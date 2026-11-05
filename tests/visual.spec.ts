/**
 * Captures de référence des 4 gabarits (accueil, diagnostic, réalisations, contact), desktop + mobile.
 * Les captures sont produites par le workflow « Captures de référence » dans l'environnement de la CI
 * (le rendu des polices diffère d'une machine à l'autre) : la comparaison ne s'exécute qu'en CI.
 */
import { test, expect } from '@playwright/test';

test.skip(!process.env.CI, 'captures de référence : comparaison en CI seulement');

const TEMPLATES = {
  accueil: '/',
  diagnostic: '/diagnostic/',
  realisations: '/realisations/',
  contact: '/contact/',
};

for (const [name, path] of Object.entries(TEMPLATES)) {
  test(`visuel ${name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
