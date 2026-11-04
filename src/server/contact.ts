/**
 * POST /api/contact — logique indépendante de la plateforme (testable dans Node).
 * 1. vérifie le jeton Cloudflare Turnstile côté serveur (TURNSTILE_SECRET);
 * 2. valide la charge avec zod (4 champs au maximum par formulaire);
 * 3. relaie en JSON vers N8N_WEBHOOK_URL, signé : X-AMEB-Signature = HMAC-SHA256 hex (N8N_WEBHOOK_SECRET);
 * 4. répond 200 { ok: true } ou 400/422/5xx { ok: false, message } en FR ou EN.
 * Exposée par functions/api/contact.ts (Cloudflare Pages Function).
 */
import { z } from 'zod';

export interface ContactEnv {
  TURNSTILE_SECRET?: string;
  N8N_WEBHOOK_URL?: string;
  N8N_WEBHOOK_SECRET?: string;
  /** Tests seulement : URL de vérification Turnstile simulée. */
  TURNSTILE_VERIFY_URL?: string;
}

type Lang = 'fr' | 'en';
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const WEEKS_PER_YEAR = 48;

const MESSAGES = {
  fr: {
    ok: 'Merci ! Votre demande est bien reçue.',
    method: 'Méthode non permise.',
    badRequest: 'Requête invalide.',
    turnstile: 'La vérification anti-pourriel a échoué. Rechargez la page et réessayez.',
    invalid: 'Certains champs sont à corriger.',
    config: 'Le formulaire est temporairement indisponible. Écrivez-nous directement.',
    relay: 'L’envoi n’a pas fonctionné. Réessayez dans quelques minutes.',
    fields: {
      name: 'Indiquez votre nom.',
      email: 'Indiquez un courriel valide, par exemple nom@entreprise.ca.',
      organization: 'Indiquez le nom de votre organisation.',
      message: 'Décrivez votre besoin en une phrase ou plus.',
      consent: 'Cochez la case pour recevoir le détail par courriel.',
      calc: 'Les valeurs du calcul sont invalides.',
    },
  },
  en: {
    ok: 'Thank you! Your request has been received.',
    method: 'Method not allowed.',
    badRequest: 'Invalid request.',
    turnstile: 'Spam protection failed. Reload the page and try again.',
    invalid: 'Some fields need to be corrected.',
    config: 'The form is temporarily unavailable. Please email us directly.',
    relay: 'Sending failed. Please try again in a few minutes.',
    fields: {
      name: 'Enter your name.',
      email: 'Enter a valid email, for example name@company.ca.',
      organization: 'Enter the name of your organization.',
      message: 'Describe your need in one sentence or more.',
      consent: 'Check the box to receive the details by email.',
      calc: 'The calculation values are invalid.',
    },
  },
} as const;

const text = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().max(254).pipe(z.email());
const common = {
  lang: z.enum(['fr', 'en']).default('fr'),
  page: z.string().max(200).optional(),
};

export const ContactSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('diagnostic'),
    ...common,
    name: text(120),
    email,
    organization: text(160),
    message: text(1000),
  }),
  z.object({
    kind: z.literal('contact'),
    ...common,
    name: text(120),
    email,
    organization: z.string().trim().max(160).optional().default(''),
    message: text(2000),
  }),
  z.object({
    kind: z.literal('report'),
    ...common,
    email,
    consent: z.literal(true),
    employees: z.coerce.number().int().min(1).max(200),
    hours: z.coerce.number().min(0).max(20).multipleOf(0.5),
    rate: z.coerce.number().min(1).max(500),
  }),
]);
export type ContactPayload = z.infer<typeof ContactSchema>;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function hmacHex(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get('content-type') ?? '';
  try {
    if (type.includes('application/json')) return (await request.json()) as Record<string, unknown>;
    if (type.includes('form')) {
      const form = await request.formData();
      const out: Record<string, unknown> = {};
      form.forEach((v, k) => (out[k] = typeof v === 'string' ? v : ''));
      if (out.consent === 'on' || out.consent === 'true') out.consent = true;
      return out;
    }
  } catch {
    return null;
  }
  return null;
}

export async function handleContact(request: Request, env: ContactEnv, fetchImpl: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, message: MESSAGES.fr.method });

  const raw = await readBody(request);
  const lang: Lang = raw?.lang === 'en' ? 'en' : 'fr';
  const m = MESSAGES[lang];
  if (!raw || typeof raw !== 'object') return json(400, { ok: false, message: m.badRequest });

  // Piège à robots : champ invisible rempli → réponse neutre, rien n'est relayé.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') return json(200, { ok: true, message: m.ok });

  if (!env.TURNSTILE_SECRET || !env.N8N_WEBHOOK_URL || !env.N8N_WEBHOOK_SECRET) {
    return json(503, { ok: false, message: m.config });
  }

  // 1. Turnstile (côté serveur)
  const token = typeof raw.token === 'string' ? raw.token : '';
  if (!token) return json(400, { ok: false, error: 'turnstile', message: m.turnstile });
  try {
    const params = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
    const ip = request.headers.get('cf-connecting-ip');
    if (ip) params.set('remoteip', ip);
    const res = await fetchImpl(env.TURNSTILE_VERIFY_URL || TURNSTILE_URL, { method: 'POST', body: params });
    const outcome = (await res.json()) as { success?: boolean };
    if (!outcome.success) return json(400, { ok: false, error: 'turnstile', message: m.turnstile });
  } catch {
    return json(400, { ok: false, error: 'turnstile', message: m.turnstile });
  }

  // 2. Validation
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      const msgKey = (['employees', 'hours', 'rate'].includes(key) ? 'calc' : key) as keyof typeof m.fields;
      if (key && !fields[key]) fields[key] = m.fields[msgKey] ?? m.invalid;
    }
    return json(422, { ok: false, error: 'validation', message: m.invalid, fields });
  }

  // 3. Relais signé vers n8n
  const data = parsed.data;
  const payload = {
    ...data,
    ...(data.kind === 'report' ? { annualCost: data.employees * data.hours * WEEKS_PER_YEAR * data.rate } : {}),
    submittedAt: new Date().toISOString(),
    source: 'ameb-site',
  };
  const body = JSON.stringify(payload);
  try {
    const signature = await hmacHex(env.N8N_WEBHOOK_SECRET, body);
    const res = await fetchImpl(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'X-AMEB-Signature': signature },
      body,
    });
    if (!res.ok) return json(502, { ok: false, error: 'relay', message: m.relay });
  } catch {
    return json(502, { ok: false, error: 'relay', message: m.relay });
  }

  return json(200, { ok: true, message: m.ok });
}
