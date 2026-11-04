/**
 * Parité FR/EN des contenus (Loi 96 : l'anglais n'est jamais plus complet que le français).
 * Pour chaque src/content/<collection>/fr/<clé>.md :
 *  - le fichier en/<clé>.md existe (et inversement);
 *  - l'avant-propos a la même structure (mêmes clés, même nombre d'éléments de liste);
 *  - le corps a le même nombre de titres H2 et H3, dans le même ordre.
 * Usage : node scripts/check-parity.ts
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = new URL('../src/content/', import.meta.url).pathname;
const problems: string[] = [];

function split(md: string): { front: string; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { front: m[1] ?? '', body: m[2] ?? '' } : { front: '', body: md };
}

/** Forme de l'avant-propos : indentation + clé, ou « - » pour un élément de liste. */
function shape(front: string): string[] {
  const out: string[] = [];
  for (const line of front.split('\n')) {
    const key = line.match(/^(\s*)(- )?([A-Za-z0-9_-]+):(\s|$)/);
    if (key) {
      out.push(`${key[1]}${key[2] ? '- ' : ''}${key[3]}`);
      continue;
    }
    const item = line.match(/^(\s*)- /);
    if (item) out.push(`${item[1]}-`);
  }
  return out;
}

function headings(body: string): string[] {
  const out: string[] = [];
  let inCode = false;
  for (const line of body.split('\n')) {
    if (line.startsWith('```')) inCode = !inCode;
    if (inCode) continue;
    const m = line.match(/^(#{2,3}) /);
    if (m) out.push(m[1] === '##' ? 'H2' : 'H3');
  }
  return out;
}

for (const collection of readdirSync(CONTENT, { withFileTypes: true })) {
  if (!collection.isDirectory()) continue;
  const frDir = join(CONTENT, collection.name, 'fr');
  const enDir = join(CONTENT, collection.name, 'en');
  const frFiles = existsSync(frDir) ? readdirSync(frDir).filter((f) => f.endsWith('.md')) : [];
  const enFiles = existsSync(enDir) ? readdirSync(enDir).filter((f) => f.endsWith('.md')) : [];
  for (const f of enFiles) if (!frFiles.includes(f)) problems.push(`${collection.name}/en/${f} : aucun pendant français`);
  for (const f of frFiles) {
    const enPath = join(enDir, f);
    if (!existsSync(enPath)) {
      problems.push(`${collection.name}/fr/${f} : pendant anglais manquant (en/${f})`);
      continue;
    }
    const fr = split(readFileSync(join(frDir, f), 'utf8'));
    const en = split(readFileSync(enPath, 'utf8'));
    const sf = shape(fr.front);
    const se = shape(en.front);
    if (sf.join('|') !== se.join('|')) {
      const i = sf.findIndex((v, k) => v !== se[k]);
      problems.push(`${collection.name}/${f} : structure d'avant-propos différente (ligne ${i + 1} : « ${sf[i] ?? '∅'} » vs « ${se[i] ?? '∅'} »)`);
    }
    const hf = headings(fr.body);
    const he = headings(en.body);
    if (hf.join() !== he.join()) {
      problems.push(`${collection.name}/${f} : titres différents (FR ${hf.filter((h) => h === 'H2').length} H2 / EN ${he.filter((h) => h === 'H2').length} H2; ordre H2/H3 ${hf.join(',')} vs ${he.join(',')})`);
    }
  }
}

if (problems.length) {
  console.error(`check-parity : ${problems.length} problème(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log('check-parity : OK (chaque contenu FR a son pendant EN, même structure)');
