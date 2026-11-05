/** Onglets des secteurs, bascule clair/sombre, calculateur approximatif : clavier, toucher, mémoire. */
import { test, expect } from '@playwright/test';

test('secteurs : onglets au clavier (flèches, Début, Fin)', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tablist').getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.locator(`#${await tabs.nth(1).getAttribute('aria-controls')}`)).toBeVisible();
  await page.keyboard.press('End');
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('thème : clair par défaut, sombre par bascule, mémorisé', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const toggle = page.locator('[data-theme-toggle]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 22, 19)');
  await page.goto('/diagnostic/');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(html).not.toHaveAttribute('data-theme', 'dark');
});

test('thème : le système en mode sombre ne change rien sans bascule', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await context.close();
});

test('calculateur : fourchette approximative, jamais un chiffre exact', async ({ page }) => {
  await page.goto('/');
  const out = page.locator('[data-calc-out]');
  await expect(out).toHaveText(/10\s000 à 12\s000\s\$/);
  await page.locator('#calc-employees').fill('3');
  await expect(out).toHaveText(/30\s000 à 35\s000\s\$/);
  await expect(page.locator('#calc-employees-out')).toHaveText('3');
});

test('bascule au toucher', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.locator('[data-theme-toggle]').tap();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await context.close();
});
