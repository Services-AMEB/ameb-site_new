/** Premier chargement : 0 témoin et 0 requête hors domaines autorisés (site, analytics, Turnstile sur pages formulaire). */
import { test, expect } from '@playwright/test';

const FORM_PAGES = ['/diagnostic/', '/contact/', '/outils/calculateur-ressaisie/', '/en/diagnostic/', '/en/contact/'];
const PAGES = ['/', '/en/', '/services/ventes-crm/', '/secteurs/evenementiel-associations/', '/outils/autoevaluation/', ...FORM_PAGES];
const analytics = process.env.PUBLIC_ANALYTICS_SRC ? new URL(process.env.PUBLIC_ANALYTICS_SRC).host : null;

for (const path of PAGES) {
  test(`vie privée ${path}`, async ({ page, context, baseURL }) => {
    const site = new URL(baseURL!).host;
    const allowed = new Set([site, ...(analytics ? [analytics] : []), ...(FORM_PAGES.includes(path) ? ['challenges.cloudflare.com'] : [])]);
    const foreign: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.protocol.startsWith('http') && !allowed.has(u.host)) foreign.push(r.url());
    });
    await page.goto(path, { waitUntil: 'networkidle' });
    expect(foreign).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => document.cookie)).toBe('');
  });
}
