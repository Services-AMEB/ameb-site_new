/** Mouvement réduit : aucun élément animé; bouton pause : arrête tout et persiste. */
import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/en/', '/services/ventes-crm/', '/secteurs/cliniques/', '/diagnostic/', '/approche/', '/styleguide/'];

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

test('mouvement réduit : FlowLine tout allumé, scène silo en cartes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.flow').first()).not.toHaveClass(/is-armed/);
  await expect(page.locator('.silo__sticky')).toBeHidden();
  await expect(page.locator('.silo__mini').first()).toBeVisible();
});

test('bouton pause : arrête toutes les animations et persiste', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('.silo__stage');
  await stage.scrollIntoViewIfNeeded();
  expect((await animated(page)).length).toBeGreaterThan(0);
  const pause = page.locator('[data-motion-toggle]:visible').first();
  await expect(pause).toHaveText(/Mettre en pause l’animation/);
  await pause.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  expect(await animated(page)).toEqual([]);
  await expect(pause).toHaveText(/Reprendre l’animation/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  expect(await animated(page)).toEqual([]);
  await page.locator('[data-motion-toggle]:visible').first().click();
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'paused');
});

test('scène silo : récit collant au défilement sur desktop', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.silo__sticky')).toHaveCSS('position', 'sticky');
  await expect(page.locator('.silo-scene[data-state="live"] svg')).toHaveAttribute('aria-labelledby', 'silo-desc');
  expect(await page.locator('.silo-scene[data-state="live"] svg text').count()).toBe(0);
});
