// Génère src/components/logo-data.ts à partir des glyphes de Sora 600.
// Usage ponctuel (outil non inclus dans les dépendances du projet) :
//   npm i --no-save opentype.js@1.3.4 && node scripts/build-logo.mjs
// Paramètres : voir docs/decisions/ADR-006-logo.md
import { readFileSync, writeFileSync } from 'node:fs';

const opentype = (await import('opentype.js')).default;
const buf = readFileSync(new URL('./assets/sora-600.woff', import.meta.url));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const UPM = font.unitsPerEm;
const SIZE = 100; // unités SVG pour 1 em
const scale = SIZE / UPM;
const TRACKING = -0.01 * SIZE; // approche −0,01 em
const DOT_RATIO = Number(process.env.DOT_RATIO ?? 0.45); // diamètre / hauteur d'x (logo fourni)
const GAP_RATIO = Number(process.env.GAP_RATIO ?? 0.2); // espace b → point / hauteur d'x (logo fourni)
const DOT_ALIGN = process.env.DOT_ALIGN ?? 'baseline'; // 'baseline' (logo fourni) ou 'center' (centré sur la hauteur d'x)

const xHeight = font.tables.os2.sxHeight * scale;
const ascender = font.ascender * scale;

let x = 0;
const parts = [];
let maxRight = 0;
let minLeft = Infinity;
let top = Infinity;
for (const ch of 'ameb') {
  const glyph = font.charToGlyph(ch);
  const path = glyph.getPath(x, 0, SIZE);
  const bb = path.getBoundingBox();
  minLeft = Math.min(minLeft, bb.x1);
  maxRight = Math.max(maxRight, bb.x2);
  top = Math.min(top, bb.y1);
  parts.push(path.toPathData(2));
  x += glyph.advanceWidth * scale + TRACKING;
}
const d = parts.join('');
const r = (DOT_RATIO * xHeight) / 2;
const cx = maxRight + GAP_RATIO * xHeight + r;
const cy = DOT_ALIGN === 'center' ? -xHeight / 2 : -r;
const right = cx + r;
const vb = [minLeft, top, right - minLeft, -top].map((n) => +n.toFixed(2));

const out = `// Fichier généré par scripts/build-logo.mjs — ne pas modifier à la main.
// Sora 600, approche −0,01 em; point : diamètre ${DOT_RATIO} × x, écart ${GAP_RATIO} × x, alignement « ${DOT_ALIGN} ».
export const LOGO = {
  viewBox: '${vb.join(' ')}',
  width: ${vb[2]},
  height: ${vb[3]},
  word: '${d}',
  dot: { cx: ${cx.toFixed(2)}, cy: ${cy.toFixed(2)}, r: ${r.toFixed(2)} },
  xHeight: ${xHeight.toFixed(2)},
  ascender: ${ascender.toFixed(2)},
} as const;
`;
writeFileSync(new URL('../src/components/logo-data.ts', import.meta.url), out);
console.log('viewBox', vb.join(' '), 'xHeight', xHeight.toFixed(2), 'dot r', r.toFixed(2));
