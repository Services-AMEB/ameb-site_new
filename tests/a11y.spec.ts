/** axe : 0 violation « serious » ou « critical » sur chaque URL du plan du site (WCAG 2.2 AA). */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { sitemapPaths } from './support/urls.ts';

const paths = [...sitemapPaths(), '/styleguide/', '/404.html'];

for (const path of paths) {
  test(`axe ${path}`, async ({ page }) => {
    // États finaux (mouvement réduit) : aucun élément à mi-animation.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(blocking.map((v) => `${v.id} : ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('menu mobile : dialog, focus et Échap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-open]');
  await toggle.click();
  const dialog = page.locator('#menu-mobile');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('lien d’évitement visible au focus et cible le contenu', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#contenu');
});
