/**
 * Images Open Graph générées au build (satori + resvg).
 * Parcourt dist/**.html, lit og:image (/og/….png) et og:title, puis produit
 * un PNG 1200×630 : fond jade profond, mot-symbole blanc + point jade, titre en Sora.
 */
import type { AstroIntegration } from 'astro';
import { readFile, readdir, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { LOGO } from '../src/components/logo-data.ts';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), 'assets');

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

function decode(s: string): string {
  return s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#xa0;|&#160;/gi, ' ');
}

export async function renderOgImages(distDir: string, logger?: { info: (m: string) => void }) {
  const fonts = [
    { name: 'Sora', data: await readFile(join(ASSETS, 'sora-600.woff')), weight: 600 as const, style: 'normal' as const },
    { name: 'Sora', data: await readFile(join(ASSETS, 'sora-700.woff')), weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: await readFile(join(ASSETS, 'inter-400.woff')), weight: 400 as const, style: 'normal' as const },
  ];
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}"><path fill="#FFFFFF" d="${LOGO.word}"/><circle fill="#1B8E6B" cx="${LOGO.dot.cx}" cy="${LOGO.dot.cy}" r="${LOGO.dot.r}"/></svg>`;
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  const logoH = 64;
  const logoW = Math.round((LOGO.width / LOGO.height) * logoH);

  const done = new Set<string>();
  let count = 0;
  for await (const file of htmlFiles(distDir)) {
    const html = await readFile(file, 'utf8');
    const img = html.match(/<meta property="og:image" content="[^"]*?(\/og\/[^"]+\.png)"/)?.[1];
    const title = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1];
    const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? 'fr-CA';
    if (!img || !title || done.has(img)) continue;
    done.add(img);
    const heading = decode(title).replace(/\s*\|\s*ameb$/, '');
    const tagline = lang.startsWith('en') ? 'Your operations, on autopilot.' : 'Vos opérations, en pilote automatique.';

    const tree = {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0F5E4E',
          color: '#FFFFFF',
          fontFamily: 'Sora',
        },
        children: [
          { type: 'img', props: { src: logoSrc, width: logoW, height: logoH } },
          {
            type: 'div',
            props: {
              style: { fontSize: heading.length > 48 ? 56 : 68, fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 1000 },
              children: heading,
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontFamily: 'Inter', color: '#DCEFE7' },
              children: [
                { type: 'div', props: { style: { width: 16, height: 16, borderRadius: 8, background: '#1B8E6B' } } },
                { type: 'div', props: { children: tagline } },
              ],
            },
          },
        ],
      },
    };
    // Arbre satori construit sans JSX (objets { type, props }).
    const svg = await satori(tree as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
    const out = join(distDir, img);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, png);
    count++;
  }
  logger?.info(`${count} images Open Graph générées`);
  return count;
}

export default function ogImages(): AstroIntegration {
  return {
    name: 'ameb-og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        await renderOgImages(out, logger);
        // Pages 404 : Cloudflare sert le 404.html le plus proche (/en/404.html pour /en/…).
        await copyFile(join(out, 'en/404/index.html'), join(out, 'en/404.html'));
        await mkdir(join(out, '404'), { recursive: true });
        await copyFile(join(out, '404.html'), join(out, '404/index.html'));
      },
    },
  };
}
