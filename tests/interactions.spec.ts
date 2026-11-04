/** FlowLine et BeforeAfter : fonctionnels au clavier (et au toucher, via les mêmes boutons). */
import { test, expect } from '@playwright/test';

test('FlowLine : lecture à l’entrée dans la vue, puis bouton Rejouer au clavier', async ({ page }) => {
  await page.goto('/');
  const flow = page.locator('.hero .flow');
  await expect(flow).toHaveClass(/is-playing/);
  const replay = flow.getByRole('button', { name: 'Rejouer' });
  await replay.focus();
  await page.keyboard.press('Enter');
  await expect(flow).toHaveClass(/is-playing/);
});

test('FlowLine : onglets de secteur (flèches)', async ({ page }) => {
  await page.goto('/styleguide/');
  const tabs = page.getByRole('tablist').first().getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  const panel = page.locator(`#${await tabs.nth(1).getAttribute('aria-controls')}`);
  await expect(panel).toBeVisible();
});

test('BeforeAfter : bascule au clavier (aria-pressed, légende annoncée)', async ({ page }) => {
  await page.goto('/secteurs/cliniques/');
  const toggle = page.locator('[data-ba-toggle]');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-ba]')).toHaveClass(/is-after/);
  await expect(page.locator('.ba__caption')).toContainText('Avec ameb');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('BeforeAfter : toucher', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/confiance/');
  await page.locator('[data-ba-toggle]').tap();
  await expect(page.locator('[data-ba-toggle]')).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});
