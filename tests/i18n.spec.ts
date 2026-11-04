/** i18n : lang, hreflang (fr-CA, en-CA, x-default), canonical, LangSwitch → page équivalente. */
import { test, expect } from '@playwright/test';
import { PUBLIC_KEYS, ROUTES } from './support/urls.ts';

const SITE = process.env.SITE_URL || 'https://ameb.ca';

for (const key of PUBLIC_KEYS) {
  test(`i18n ${key}`, async ({ page }) => {
    for (const [lang, other, htmlLang] of [
      ['fr', 'en', 'fr-CA'],
      ['en', 'fr', 'en-CA'],
    ] as const) {
      await page.goto(ROUTES[key][lang]);
      await expect(page.locator('html')).toHaveAttribute('lang', htmlLang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL(ROUTES[key][lang], SITE).href);
      await expect(page.locator('link[hreflang="fr-CA"]')).toHaveAttribute('href', new URL(ROUTES[key].fr, SITE).href);
      await expect(page.locator('link[hreflang="en-CA"]')).toHaveAttribute('href', new URL(ROUTES[key].en, SITE).href);
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', new URL(ROUTES[key].fr, SITE).href);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'fr' ? 'fr_CA' : 'en_CA');
      const switcher = page.locator('footer .langswitch');
      await expect(switcher).toHaveAttribute('href', ROUTES[key][other]);
      await expect(page.locator('h1')).toHaveCount(1);
    }
    // Navigation réelle par le sélecteur
    await page.goto(ROUTES[key].fr);
    await page.locator('footer .langswitch').click();
    await expect(page).toHaveURL(new RegExp(`${ROUTES[key].en.replace(/\//g, '\\/')}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-CA');
  });
}

test('robots.txt et sitemap avec alternates', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /api/');
  expect(robots).toContain('Disallow: /styleguide/');
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).toContain('hreflang="en-CA"');
  expect(sitemap).not.toContain('/styleguide/');
});
