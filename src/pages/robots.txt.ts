/** robots.txt : tout autorisé sauf /api/ et /styleguide/; en préproduction (SITE_ENV=dev), rien n'est indexé. */
import type { APIRoute } from 'astro';
import { SITE_ENV } from 'astro:env/server';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://ameb.ca').href;
  const body =
    SITE_ENV === 'dev'
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /styleguide/\nDisallow: /en/styleguide/\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
