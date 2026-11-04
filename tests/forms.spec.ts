/** Formulaires : validation, erreurs FR/EN, succès simulé (webhook n8n simulé, signature HMAC vérifiée). */
import { test, expect, request } from '@playwright/test';
import { createHmac } from 'node:crypto';

const MOCK = 'http://localhost:4399';

test.beforeEach(async () => {
  const api = await request.newContext();
  await api.post(`${MOCK}/reset`);
});

test('diagnostic : erreurs à la soumission et à la sortie du champ', async ({ page }) => {
  await page.goto('/diagnostic/');
  const form = page.locator('#form-diagnostic');
  await form.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(form.locator('[data-status-error]')).toBeVisible();
  const name = form.getByLabel('Nom');
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toBeFocused();
  await expect(page.locator('#form-diagnostic-name-error')).toContainText('Indiquez votre nom.');
  const email = form.getByLabel('Courriel');
  await email.fill('pas-un-courriel');
  await email.blur();
  await expect(page.locator('#form-diagnostic-email-error')).toContainText('courriel valide');
  await email.fill('nom@entreprise.ca');
  await email.blur();
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');
});

test('diagnostic : succès, relais signé vers le webhook', async ({ page }) => {
  await page.goto('/diagnostic/');
  const form = page.locator('#form-diagnostic');
  await form.getByLabel('Nom').fill('Camille Test');
  await form.getByLabel('Courriel').fill('camille@exemple.ca');
  await form.getByLabel('Organisation').fill('Organisation test');
  await form.getByLabel(/Décrivez en une phrase/).fill('La ressaisie des inscriptions.');
  await form.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(form.locator('[data-status-success]')).toBeVisible();
  const api = await request.newContext();
  const last = await (await api.get(`${MOCK}/last`)).json();
  expect(last).not.toBeNull();
  const payload = JSON.parse(last.body);
  expect(payload).toMatchObject({ kind: 'diagnostic', lang: 'fr', name: 'Camille Test', email: 'camille@exemple.ca' });
  const expected = createHmac('sha256', 'test-webhook-secret').update(last.body).digest('hex');
  expect(last.signature).toBe(expected);
});

test('contact EN : messages d’erreur en anglais', async ({ page }) => {
  await page.goto('/en/contact/');
  const form = page.locator('#form-contact');
  await form.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.locator('#form-contact-name-error')).toContainText('Enter your name.');
});

test('API : 422 en anglais si la validation échoue, 400 si Turnstile échoue', async ({ baseURL }) => {
  const api = await request.newContext({ baseURL });
  const invalid = await api.post('/api/contact', { data: { kind: 'diagnostic', lang: 'en', token: 'ok', name: '', email: 'x' } });
  expect(invalid.status()).toBe(422);
  const body = await invalid.json();
  expect(body.fields.email).toContain('valid email');
  const bot = await api.post('/api/contact', { data: { kind: 'contact', lang: 'fr', token: 'fail', name: 'A', email: 'a@b.ca', message: 'x' } });
  expect(bot.status()).toBe(400);
  expect((await bot.json()).message).toContain('anti-pourriel');
});

test('calculateur : calcul, URL partageable, rapport avec consentement explicite', async ({ page }) => {
  await page.goto('/outils/calculateur-ressaisie/');
  const result = page.locator('[data-calc-value]');
  await expect(result).toHaveText(/10\s800\s\$/);
  await page.getByLabel('Employés touchés').fill('3');
  await expect(result).toHaveText(/32\s400\s\$/);
  await expect(page).toHaveURL(/employees=3/);
  const consent = page.getByLabel(/J’accepte de recevoir/);
  await expect(consent).not.toBeChecked();
  const report = page.locator('[data-report-form]');
  await report.getByLabel('Courriel', { exact: true }).fill('camille@exemple.ca');
  await report.getByRole('button', { name: 'Recevoir le détail' }).click();
  await expect(page.locator('#report-consent-error')).toBeVisible();
  await consent.check();
  await report.getByRole('button', { name: 'Recevoir le détail' }).click();
  await expect(report.locator('[data-status-success]')).toBeVisible();
  const api = await request.newContext();
  const payload = JSON.parse((await (await api.get(`${MOCK}/last`)).json()).body);
  expect(payload).toMatchObject({ kind: 'report', consent: true, employees: 3, hours: 5, rate: 45, annualCost: 32400 });
});

test('autoévaluation : progression, clavier, résultat sans courriel', async ({ page }) => {
  await page.goto('/outils/autoevaluation/');
  await expect(page.getByText('Question 1 sur 10')).toBeVisible();
  await page.getByRole('button', { name: 'Question suivante' }).click();
  await expect(page.getByText('Choisissez une réponse pour continuer.')).toBeVisible();
  for (let i = 0; i < 10; i++) {
    const q = page.locator('.quiz__q.is-current');
    await q.locator('input[type="radio"]').nth(3).focus();
    await page.keyboard.press('Space');
    await page.getByRole('button', { name: i === 9 ? 'Voir mon résultat' : 'Question suivante' }).click();
  }
  await expect(page.locator('[data-quiz-result]')).toBeVisible();
  await expect(page.locator('[data-quiz-score]')).toContainText('30');
  await expect(page.locator('[data-quiz-profile]')).toHaveText('Prêt pour le pilote automatique');
});
