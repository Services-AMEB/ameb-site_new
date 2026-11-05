import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type Env } from '../../worker/index.ts';

const assets = { fetch: async (r: Request) => new Response(`asset ${new URL(r.url).pathname}`) };
const env: Env = { ASSETS: assets };

test('les pages sont servies par ASSETS', async () => {
  const res = await worker.fetch(new Request('https://ameb.ca/diagnostic/'), env);
  assert.equal(await res.text(), 'asset /diagnostic/');
});

test('/api/contact : 405 hors POST, 503 sans secrets', async () => {
  assert.equal((await worker.fetch(new Request('https://ameb.ca/api/contact'), env)).status, 405);
  const post = new Request('https://ameb.ca/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"lang":"fr"}' });
  assert.equal((await worker.fetch(post, env)).status, 503);
});

test('/api/inconnu : 404 JSON', async () => {
  const res = await worker.fetch(new Request('https://ameb.ca/api/inconnu'), env);
  assert.equal(res.status, 404);
  assert.equal(res.headers.get('content-type'), 'application/json; charset=utf-8');
});
