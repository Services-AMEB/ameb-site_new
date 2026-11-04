/**
 * Garde-fou de contenu : échoue si src/ ou public/ contient
 * - le nom de l'éditeur (/zoho/i) ou un terme de docs/interdits.txt;
 * - un emoji (règle 3 du brief).
 * Usage : node scripts/check-content.ts
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIRS = ['src', 'public'];
const TEXT_EXT = new Set(['.astro', '.ts', '.js', '.mjs', '.md', '.mdx', '.json', '.css', '.svg', '.txt', '.html', '.xml', '.yml', '.yaml']);
const SKIP = new Set(['src/components/icons/lucide.ts', 'public/fonts/LICENSE-sora.txt', 'public/fonts/LICENSE-inter.txt']);

type Rule = { label: string; re: RegExp; textOnly?: boolean };
const rules: Rule[] = [{ label: 'zoho', re: /zoho/giu }];
/** Fichiers de texte éditorial (où s'appliquent les formulations interdites). */
const isText = (rel: string) => /^src\/(content|data|i18n)\//.test(rel);

for (const raw of readFileSync(join(ROOT, 'docs/interdits.txt'), 'utf8').split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  if (line.startsWith('texte:')) rules.push({ label: line, re: new RegExp(line.slice(6), 'giu'), textOnly: true });
  else {
    const esc = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    rules.push({ label: line, re: new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, 'giu') });
  }
}
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F2FF}\u{FE0F}]/gu;

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const problems: string[] = [];
for (const d of DIRS) {
  for (const file of walk(join(ROOT, d))) {
    const rel = relative(ROOT, file);
    if (SKIP.has(rel) || !TEXT_EXT.has(extname(file))) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((text, i) => {
      for (const r of rules) {
        if (r.textOnly && !isText(rel)) continue;
        r.re.lastIndex = 0;
        if (r.re.test(text)) problems.push(`${rel}:${i + 1} terme interdit (${r.label}) → ${text.trim().slice(0, 120)}`);
      }
      EMOJI.lastIndex = 0;
      if (EMOJI.test(text)) problems.push(`${rel}:${i + 1} emoji interdit → ${text.trim().slice(0, 120)}`);
    });
  }
}

if (problems.length) {
  console.error(`check-content : ${problems.length} problème(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log('check-content : OK (aucun terme interdit, aucun emoji)');
