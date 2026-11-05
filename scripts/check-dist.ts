/**
 * Vérifications du site compilé (dist/) :
 *  - liens internes et ancres valides;
 *  - budgets par page (gzip) : HTML ≤ 50 Ko, CSS ≤ 30 Ko, JS ≤ 20 Ko;
 *  - parité FR/EN des pages : même nombre de H2, un seul H1;
 *  - typographie FR : aucune espace ordinaire avant « ; : ! ? » dans le texte des pages FR.
 * Usage : npm run build && node scripts/check-dist.ts
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROUTES, LOCALES, type RouteKey } from '../src/i18n/routes.ts';

const DIST = new URL('../dist/', import.meta.url).pathname;
const KB = 1024;
const BUDGET = { html: 50 * KB, css: 30 * KB, js: 20 * KB };
const problems: string[] = [];
const report: string[] = [];

const gz = (s: string | Buffer) => gzipSync(s, { level: 9 }).length;
function* htmlFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}
function fileFor(path: string): string | null {
  const clean = decodeURIComponent(path.split('#')[0]!.split('?')[0]!);
  const candidates = clean.endsWith('/') ? [join(DIST, clean, 'index.html')] : [join(DIST, clean), join(DIST, clean, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}
const ids = (html: string) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, '\u0000')
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ');

const pages = [...htmlFiles(DIST)];
for (const file of pages) {
  const rel = '/' + relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const own = ids(html);

  // Liens internes
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = m[1]!;
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (href.length > 1 && !own.has(href.slice(1))) problems.push(`${rel} : ancre introuvable ${href}`);
      continue;
    }
    if (!href.startsWith('/')) continue;
    const target = fileFor(href);
    if (!target) {
      problems.push(`${rel} : lien interne cassé ${href}`);
      continue;
    }
    const hash = href.split('#')[1];
    if (hash && target.endsWith('.html') && !ids(readFileSync(target, 'utf8')).has(hash)) problems.push(`${rel} : ancre introuvable ${href}`);
  }

  // Budgets
  const htmlGz = gz(html);
  let cssGz = 0;
  for (const m of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
    const f = fileFor(m[1]!);
    if (f) {
      cssGz += gz(readFileSync(f, 'utf8'));
    }
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) cssGz += gz(m[1]!);
  let jsGz = 0;
  for (const m of html.matchAll(/<script[^>]*\ssrc="(\/[^"]+)"/g)) {
    const f = fileFor(m[1]!);
    if (f) jsGz += gz(readFileSync(f));
  }
  for (const m of html.matchAll(/<script(?![^>]*(?:src=|application\/(?:ld\+)?json))[^>]*>([\s\S]*?)<\/script>/g)) jsGz += gz(m[1]!);
  if (htmlGz > BUDGET.html) problems.push(`${rel} : HTML ${(htmlGz / KB).toFixed(1)} Ko gzip > 50 Ko`);
  if (cssGz > BUDGET.css) problems.push(`${rel} : CSS ${(cssGz / KB).toFixed(1)} Ko gzip > 30 Ko`);
  if (jsGz > BUDGET.js) problems.push(`${rel} : JS ${(jsGz / KB).toFixed(1)} Ko gzip > 20 Ko`);
  report.push(`${rel} HTML ${(htmlGz / KB).toFixed(1)} · CSS ${(cssGz / KB).toFixed(1)} · JS ${(jsGz / KB).toFixed(1)} Ko gzip`);

  // Un seul H1
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${rel} : ${h1} H1 (1 attendu)`);

  // Typographie FR
  if (/<html lang="fr-CA"/.test(html)) {
    const text = visibleText(html);
    const bad = text.match(/[^\s\u0000]{1,20}[ \t][;:!?](?=[\s\u0000]|$)/g);
    if (bad) problems.push(`${rel} : espace ordinaire avant ponctuation (${bad.slice(0, 3).join(' | ')})`);
  }
}

// Parité FR/EN : mêmes sections (H2)
for (const key of Object.keys(ROUTES) as RouteKey[]) {
  const counts = LOCALES.map((lang) => {
    const f = fileFor(ROUTES[key][lang]);
    return f ? (readFileSync(f, 'utf8').match(/<h2[\s>]/g) ?? []).length : -1;
  });
  if (counts.includes(-1)) problems.push(`${key} : page manquante (${LOCALES.join('/')} = ${counts.join('/')})`);
  else if (counts[0] !== counts[1]) problems.push(`${key} : H2 FR ${counts[0]} ≠ EN ${counts[1]}`);
}

if (process.argv.includes('--report')) console.log(report.join('\n'));
if (problems.length) {
  console.error(`check-dist : ${problems.length} problème(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`check-dist : OK (${pages.length} pages; liens, budgets, H1, parité H2, typographie)`);
