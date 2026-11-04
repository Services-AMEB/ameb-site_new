/**
 * Serveur local de prévisualisation (sans dépendance) : sert dist/ comme Cloudflare Pages
 * (barre oblique finale, 404.html le plus proche) et route POST /api/contact vers le même
 * gestionnaire que la Pages Function (src/server/contact.ts).
 * Usage : npm run build && node scripts/serve.ts [port]
 * Variables : TURNSTILE_SECRET, N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET, TURNSTILE_VERIFY_URL (tests).
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
import { handleContact } from '../src/server/contact.ts';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

async function isFile(p: string) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname === '/api/contact') {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
    });
    const response = await handleContact(request, process.env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
    return;
  }
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  if (!extname(path) && !path.endsWith('/')) {
    res.writeHead(308, { location: `${path}/${url.search}` });
    res.end();
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  let file = join(DIST, path);
  let status = 200;
  if (!(await isFile(file))) {
    status = 404;
    file = url.pathname.startsWith('/en/') ? join(DIST, 'en/404.html') : join(DIST, '404.html');
  }
  let body: Buffer = await readFile(file);
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const headers: Record<string, string> = { 'content-type': type };
  // Compression comme en production (Cloudflare) pour les types texte.
  if (/text|javascript|json|svg|xml/.test(type) && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
    body = gzipSync(body);
    headers['content-encoding'] = 'gzip';
    headers.vary = 'accept-encoding';
  }
  if (/\/(_astro|fonts)\//.test(url.pathname)) headers['cache-control'] = 'public, max-age=31536000, immutable';
  res.writeHead(status, headers);
  res.end(body);
}).listen(PORT, () => console.log(`ameb : http://localhost:${PORT}`));
