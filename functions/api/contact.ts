/**
 * Cloudflare Pages Function : POST /api/contact.
 * Variables (réglages du projet Pages) : TURNSTILE_SECRET, N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET.
 * Voir docs/decisions/ADR-004-api-contact.md.
 */
import { handleContact, type ContactEnv } from '../../src/server/contact.ts';

type Context = { request: Request; env: ContactEnv };

export const onRequestPost = ({ request, env }: Context): Promise<Response> => handleContact(request, env);

export const onRequest = (): Response =>
  new Response(JSON.stringify({ ok: false, message: 'Méthode non permise. / Method not allowed.' }), {
    status: 405,
    headers: { allow: 'POST', 'content-type': 'application/json; charset=utf-8' },
  });
