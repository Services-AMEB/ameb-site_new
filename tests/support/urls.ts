import { readFileSync } from 'node:fs';
import { ROUTES, NOINDEX_ROUTES, type RouteKey } from '../../src/i18n/routes.ts';

/** Chemins de toutes les URL du plan du site (dist/sitemap-0.xml). */
export function sitemapPaths(): string[] {
  const xml = readFileSync(new URL('../../dist/sitemap-0.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
}

/** Toutes les clés de route publiques. */
export const PUBLIC_KEYS = (Object.keys(ROUTES) as RouteKey[]).filter((k) => !NOINDEX_ROUTES.includes(k));
export { ROUTES };
