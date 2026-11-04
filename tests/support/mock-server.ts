/**
 * Serveur simulé pour les tests : vérification Turnstile + webhook n8n.
 * POST /turnstile → { success } (échec si le jeton vaut « fail »)
 * POST /hook → enregistre la requête (corps + en-têtes); GET /last → dernière requête; POST /reset.
 * POST /hook répond 500 si le corps contient « webhook-down » (test d'erreur de relais).
 */
import { createServer } from 'node:http';

const PORT = Number(process.argv[2] ?? 4399);
let last: { body: string; signature: string | undefined } | null = null;

createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const body = Buffer.concat(chunks).toString('utf8');
  const send = (status: number, data: unknown) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(data));
  };
  if (req.url === '/turnstile') return send(200, { success: !new URLSearchParams(body).get('response')?.includes('fail') });
  if (req.url === '/hook') {
    if (body.includes('webhook-down')) return send(500, { ok: false });
    last = { body, signature: req.headers['x-ameb-signature'] as string | undefined };
    return send(200, { ok: true });
  }
  if (req.url === '/last') return send(200, last);
  if (req.url === '/reset') {
    last = null;
    return send(200, { ok: true });
  }
  send(404, {});
}).listen(PORT, () => console.log(`mock : http://localhost:${PORT}`));
