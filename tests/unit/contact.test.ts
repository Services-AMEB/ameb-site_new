import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { handleContact, type ContactEnv } from '../../src/server/contact.ts';

const env: ContactEnv = {
  TURNSTILE_SECRET: 'secret',
  N8N_WEBHOOK_URL: 'https://n8n.example/webhook',
  N8N_WEBHOOK_SECRET: 'whsec',
};

function fakeFetch(opts: { turnstile?: boolean; hookStatus?: number } = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('turnstile') || String(url).includes('siteverify'))
      return new Response(JSON.stringify({ success: opts.turnstile ?? true }));
    return new Response('{}', { status: opts.hookStatus ?? 200 });
  }) as typeof fetch;
  return { impl, calls };
}

const post = (body: unknown) =>
  new Request('https://ameb.ca/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

const valid = { kind: 'diagnostic', lang: 'fr', token: 't', name: 'Camille', email: 'c@exemple.ca', organization: 'Org', message: 'Ressaisie' };

test('405 hors POST', async () => {
  const res = await handleContact(new Request('https://ameb.ca/api/contact'), env, fakeFetch().impl);
  assert.equal(res.status, 405);
});

test('503 si la configuration est absente', async () => {
  const res = await handleContact(post(valid), {}, fakeFetch().impl);
  assert.equal(res.status, 503);
});

test('400 si Turnstile échoue (vérifié avant la validation)', async () => {
  const res = await handleContact(post({ ...valid, email: 'invalide' }), env, fakeFetch({ turnstile: false }).impl);
  assert.equal(res.status, 400);
  assert.match((await res.json()).message, /anti-pourriel/);
});

test('422 avec messages par champ, en FR ou EN', async () => {
  const fr = await handleContact(post({ ...valid, email: 'x' }), env, fakeFetch().impl);
  assert.equal(fr.status, 422);
  assert.match((await fr.json()).fields.email, /courriel valide/);
  const en = await handleContact(post({ ...valid, lang: 'en', name: '' }), env, fakeFetch().impl);
  assert.equal((await en.json()).fields.name, 'Enter your name.');
});

test('200 et relais signé HMAC-SHA256 vers n8n', async () => {
  const f = fakeFetch();
  const res = await handleContact(post(valid), env, f.impl);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, message: 'Merci\u00A0! Votre demande est bien reçue.' });
  const hook = f.calls.find((c) => c.url === env.N8N_WEBHOOK_URL);
  assert.ok(hook);
  const body = String(hook.init?.body);
  const sig = (hook.init?.headers as Record<string, string>)['X-AMEB-Signature'];
  assert.equal(sig, createHmac('sha256', 'whsec').update(body).digest('hex'));
  assert.equal(JSON.parse(body).kind, 'diagnostic');
});

test('rapport : consentement exigé et coût calculé côté serveur', async () => {
  const refused = await handleContact(post({ kind: 'report', token: 't', email: 'c@exemple.ca', consent: false, employees: 2, hours: 5, rate: 45 }), env, fakeFetch().impl);
  assert.equal(refused.status, 422);
  const f = fakeFetch();
  const ok = await handleContact(post({ kind: 'report', token: 't', email: 'c@exemple.ca', consent: true, employees: 2, hours: 5, rate: 45 }), env, f.impl);
  assert.equal(ok.status, 200);
  const hook = f.calls.find((c) => c.url === env.N8N_WEBHOOK_URL);
  assert.equal(JSON.parse(String(hook?.init?.body)).annualCost, 21600);
});

test('piège à robots : 200 neutre, rien n’est relayé', async () => {
  const f = fakeFetch();
  const res = await handleContact(post({ ...valid, website: 'spam' }), env, f.impl);
  assert.equal(res.status, 200);
  assert.equal(f.calls.length, 0);
});

test('502 si le webhook échoue', async () => {
  const res = await handleContact(post(valid), env, fakeFetch({ hookStatus: 500 }).impl);
  assert.equal(res.status, 502);
});
