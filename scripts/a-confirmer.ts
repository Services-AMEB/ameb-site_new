/**
 * Régénère la section automatique de docs/a-confirmer.md : chaque marqueur
 * [À CONFIRMER…] du contenu FR (et des chaînes d'interface), avec la page concernée.
 * Usage : node scripts/a-confirmer.ts        (écrit le fichier)
 *         node scripts/a-confirmer.ts --check (échoue si le fichier n'est pas à jour — CI)
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROUTES, type RouteKey } from '../src/i18n/routes.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const DOC = join(ROOT, 'docs/a-confirmer.md');
const START = '<!-- DÉBUT : section générée par scripts/a-confirmer.ts — ne pas modifier à la main -->';
const END = '<!-- FIN : section générée -->';
const MARK = /\[[^\]]*CONFIRMER[^\]]*\]/g;

const PAGE_KEYS: Record<string, RouteKey> = {
  accueil: 'home',
  calculateur: 'outils/calculateur-ressaisie',
  autoevaluation: 'outils/autoevaluation',
};
const COLLECTION_PREFIX: Record<string, string> = {
  services: 'services',
  secteurs: 'secteurs',
  cas: 'realisations',
  blogue: 'ressources',
};

function pageFor(collection: string, key: string): string {
  const routeKey = (collection === 'pages' ? (PAGE_KEYS[key] ?? key) : `${COLLECTION_PREFIX[collection]}/${key}`) as RouteKey;
  return ROUTES[routeKey]?.fr ?? '?';
}

type Row = { page: string; where: string; field: string; marker: string };
const rows: Row[] = [];

function scan(file: string, page: string) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const keys: string[] = [];
  let fences = 0;
  lines.forEach((line, i) => {
    if (line.trim() === '---') fences++;
    const inFront = fences === 1;
    const key = inFront ? line.match(/^(\s*)(?:- )?([A-Za-z0-9_-]+):/) : null;
    if (key) {
      const depth = Math.floor((key[1] ?? '').length / 2);
      keys.length = depth;
      keys[depth] = key[2]!;
    }
    for (const m of line.matchAll(MARK)) {
      const heading = lines.slice(0, i + 1).reverse().find((l) => /^#{2,3} /.test(l));
      const field = inFront ? keys.filter(Boolean).join('.') : `corps${heading ? ` (${heading.replace(/^#+ /, '')})` : ''}`;
      rows.push({ page, where: `${relative(ROOT, file)}:${i + 1}`, field, marker: m[0] });
    }
  });
}

const CONTENT = join(ROOT, 'src/content');
for (const collection of readdirSync(CONTENT)) {
  const dir = join(CONTENT, collection, 'fr');
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) scan(join(dir, f), pageFor(collection, f.replace(/\.md$/, '')));
}
// Chaînes d'interface FR (pied de page = toutes les pages)
const ui = readFileSync(join(ROOT, 'src/i18n/ui.ts'), 'utf8').split('\nconst en')[0] ?? '';
ui.split('\n').forEach((line, i) => {
  for (const m of line.matchAll(MARK)) {
    const key = line.match(/'([a-zA-Z.]+)':/)?.[1] ?? '?';
    rows.push({ page: key.startsWith('footer.') ? 'toutes (pied de page)' : 'interface', where: `src/i18n/ui.ts:${i + 1}`, field: key, marker: m[0] });
  }
});

const esc = (s: string) => s.replace(/\|/g, '\\|');
const table = [
  `${rows.length} marqueurs dans le contenu français (chacun a son pendant [TO BE CONFIRMED] en anglais).`,
  '',
  '| Page | Champ | Marqueur | Fichier |',
  '|---|---|---|---|',
  ...rows.map((r) => `| ${esc(r.page)} | ${esc(r.field)} | ${esc(r.marker)} | \`${r.where}\` |`),
].join('\n');
const generated = `${START}\n${table}\n${END}`;

const current = existsSync(DOC) ? readFileSync(DOC, 'utf8') : '';
const next = current.includes(START)
  ? current.replace(new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END}`), generated)
  : `${current.trimEnd()}\n\n## Marqueurs dans le contenu\n\n${generated}\n`;

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error('a-confirmer : docs/a-confirmer.md n’est pas à jour. Lancez « npm run a-confirmer ».');
    process.exit(1);
  }
  console.log(`a-confirmer : OK (${rows.length} marqueurs inscrits)`);
} else {
  writeFileSync(DOC, next);
  console.log(`a-confirmer : ${rows.length} marqueurs inscrits dans docs/a-confirmer.md`);
}
