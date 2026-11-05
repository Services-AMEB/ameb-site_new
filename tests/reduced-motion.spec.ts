/** Mouvement réduit : aucun élément animé; sinon, les boucles de l'accueil tournent sans bouton d'arrêt (ADR-012). */
import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/en/', '/diagnostic/', '/realisations/', '/contact/', '/styleguide/'];

async function animated(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll('*')) {
      for (const pseudo of [null, '::before', '::after'] as const) {
        const name = getComputedStyle(el, pseudo).animationName;
        if (name && name !== 'none') out.push(`${el.tagName.toLowerCase()}.${el.getAttribute('class') ?? ''}${pseudo ?? ''} → ${name}`);
      }
    }
    return out;
  });
}

for (const path of PAGES) {
  test(`mouvement réduit ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.mouse.wheel(0, 1500);
    expect(await animated(page)).toEqual([]);
  });
}

test('mouvement réduit : le journal reste figé et les états finaux sont affichés', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const first = await page.locator('[data-feed] .feed__item').first().textContent();
  await page.waitForTimeout(3200);
  expect(await page.locator('[data-feed] .feed__item').first().textContent()).toBe(first);
  await expect(page.locator('.tog').first()).toHaveCSS('background-color', 'rgb(27, 142, 107)');
});

test('mouvement permis : les boucles tournent en continu et le journal avance', async ({ page }) => {
  await page.goto('/');
  expect((await animated(page)).length).toBeGreaterThan(0);
  await expect(page.locator('[data-motion-toggle], [data-pause]')).toHaveCount(0);
  const first = await page.locator('[data-feed] .feed__item').first().textContent();
  await expect.poll(async () => page.locator('[data-feed] .feed__item').first().textContent(), { timeout: 6000 }).not.toBe(first);
  await expect(page.locator('[data-feed] .feed__item')).toHaveCount(4);
});
