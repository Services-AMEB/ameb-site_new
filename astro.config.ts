// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { LOCALES, NOINDEX_ROUTES, ROUTES, HTML_LANG, findRoute } from './src/i18n/routes.ts';
import { satteri } from '@astrojs/markdown-satteri';
import { typoFrPlugin } from './src/lib/remark-typo.ts';
import ogImages from './scripts/og-images.ts';

const env = { ...loadEnv('', process.cwd(), ''), ...process.env };
const SITE = env.SITE_URL || 'https://ameb.ca';

const excluded = new Set(
  NOINDEX_ROUTES.flatMap((key) => LOCALES.map((lang) => new URL(ROUTES[key][lang], SITE).href)),
);

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },

  // SITE_ENV=dev (préproduction) : noindex sur toutes les pages et robots.txt « Disallow: / ».
  env: {
    schema: {
      SITE_ENV: envField.enum({ context: 'server', access: 'public', values: ['production', 'dev'], default: 'production' }),
    },
  },

  i18n: {
    locales: [...LOCALES],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },

  markdown: {
    processor: satteri({ mdastPlugins: [typoFrPlugin] }),
  },

  integrations: [
    sitemap({
      filter: (page) => !excluded.has(page),
      serialize(item) {
        // Slugs localisés : on relie chaque URL à son équivalent via routes.ts.
        const match = findRoute(new URL(item.url).pathname);
        if (match) {
          item.links = LOCALES.map((lang) => ({
            url: new URL(ROUTES[match.key][lang], SITE).href,
            lang: HTML_LANG[lang],
          }));
        }
        return item;
      },
    }),
    ogImages(),
  ],
});
