/** Captures de référence des 4 gabarits (accueil, service, secteur, diagnostic), desktop + mobile. */
import { test, expect } from '@playwright/test';

const TEMPLATES = {
  accueil: '/',
  service: '/services/ventes-crm/',
  secteur: '/secteurs/evenementiel-associations/',
  diagnostic: '/diagnostic/',
};

for (const [name, path] of Object.entries(TEMPLATES)) {
  test(`visuel ${name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
