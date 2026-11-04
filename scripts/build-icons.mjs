// Génère public/apple-touch-icon.png (180×180) à partir de public/favicon.svg. Usage : node scripts/build-icons.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8').replace('rx="14"', 'rx="0"');
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), new Resvg(svg, { fitTo: { mode: 'width', value: 180 } }).render().asPng());
console.log('apple-touch-icon.png généré');
