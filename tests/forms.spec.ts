/** Formulaires : validation, erreurs FR/EN, succès simulé (webhook n8n simulé, signature HMAC vérifiée). */
import { test, expect, request } from '@playwright/test';
import { createHmac } from 'node:crypto';

const MOCK = 'http://localhost:4399';

// Le webhook simulé est partagé : ces tests s'exécutent l'un après l'autre.
test.describe.configure({ mode: 'serial' });

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
