/**
 * Utilitaires de formulaire côté navigateur : Turnstile chargé à la demande
 * (première interaction avec le formulaire), validation à la sortie du champ, envoi JSON.
 */
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let turnstileLoading: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  turnstileLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile'));
    document.head.append(s);
  });
  return turnstileLoading;
}

/** Prépare Turnstile pour un formulaire; retourne une fonction qui fournit le jeton. */
export function setupTurnstile(form: HTMLFormElement, lang: 'fr' | 'en'): () => Promise<string> {
  const sitekey = form.dataset.sitekey ?? '';
  const box = form.querySelector<HTMLElement>('[data-turnstile]');
  let token = '';
  let widget: Promise<void> | null = null;

  const init = () => {
    if (!sitekey || !box) return Promise.resolve();
    widget ??= loadTurnstileScript().then(() => {
      window.turnstile?.render(box, {
        sitekey,
        language: lang,
        appearance: 'interaction-only',
        callback: (t: string) => (token = t),
        'expired-callback': () => (token = ''),
      });
    });
    return widget;
  };
  form.addEventListener('focusin', () => void init(), { once: true });

  return async () => {
    if (!sitekey) return 'dev-sans-turnstile';
    await init().catch(() => undefined);
    for (let i = 0; i < 40 && !token; i++) await new Promise((r) => setTimeout(r, 250));
    return token;
  };
}

export type FieldRule = (value: string, el: HTMLInputElement | HTMLTextAreaElement) => boolean;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const RULES: Record<string, FieldRule> = {
  required: (v) => v.trim().length > 0,
  email: (v) => EMAIL.test(v.trim()),
  checked: (_v, el) => (el as HTMLInputElement).checked,
};

/** Affiche ou retire l'erreur d'un champ (aria-invalid + aria-describedby). */
export function setFieldError(el: HTMLElement, message: string | null): void {
  const err = document.getElementById(`${el.id}-error`);
  if (!err) return;
  const text = err.querySelector('[data-error-text]');
  if (message) {
    el.setAttribute('aria-invalid', 'true');
    if (text) text.textContent = message;
    err.hidden = false;
  } else {
    el.removeAttribute('aria-invalid');
    err.hidden = true;
  }
}

/** Valide un champ selon data-rules (« required email »); retourne true si valide. */
export function validateField(el: HTMLInputElement | HTMLTextAreaElement): boolean {
  const rules = (el.dataset.rules ?? '').split(/\s+/).filter(Boolean);
  const ok = rules.every((r) => RULES[r]?.(el.value, el) ?? true);
  setFieldError(el, ok ? null : (el.dataset.error ?? ''));
  return ok;
}

export function wireValidation(form: HTMLFormElement): Array<HTMLInputElement | HTMLTextAreaElement> {
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-rules]')];
  for (const f of fields) {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => {
      if (f.getAttribute('aria-invalid') === 'true') validateField(f);
    });
    f.addEventListener('change', () => {
      if (f.type === 'checkbox') validateField(f);
    });
  }
  return fields;
}

export type ApiResult = { ok: boolean; message?: string; fields?: Record<string, string> };

export async function postContact(payload: Record<string, unknown>): Promise<ApiResult & { status: number }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as ApiResult;
    return { ...data, ok: res.ok && data.ok !== false, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
