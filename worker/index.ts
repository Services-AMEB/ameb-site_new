/**
 * Point d'entrée Cloudflare Workers (ressources statiques + API).
 * - POST /api/contact → src/server/contact.ts (Turnstile → zod → n8n signé HMAC);
 * - tout le reste → fichiers statiques de dist/ (binding ASSETS).
 * Seules les requêtes /api/* exécutent ce script (« run_worker_first » dans wrangler.jsonc);
 * les pages statiques sont servies directement, sans coût d'exécution.
 * Un projet Cloudflare Pages utilise plutôt functions/api/contact.ts (même gestionnaire).
 */
import { handleContact, type ContactEnv } from '../src/server/contact.ts';

export interface Env extends ContactEnv {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  SITE_ENV?: string;
}

const json = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact' || pathname === '/api/contact/') {
      if (request.method !== 'POST') return json(405, { ok: false, message: 'Méthode non permise. / Method not allowed.' }, { allow: 'POST' });
      return handleContact(request, env);
    }
    if (pathname.startsWith('/api/')) return json(404, { ok: false, message: 'Introuvable. / Not found.' });
    return env.ASSETS.fetch(request);
  },
};
