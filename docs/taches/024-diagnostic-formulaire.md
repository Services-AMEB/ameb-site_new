# Tâche 024 — /diagnostic/ + ContactForm + /api/contact + Turnstile + webhook

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
/diagnostic/ + ContactForm + /api/contact + Turnstile + webhook conformément à `docs/brief.md`.

## Fichiers
- `src/views/DiagnosticView.astro`
- `src/components/ContactForm.astro`
- `src/server/contact.ts`
- `functions/api/contact.ts`
- `src/lib/forms.ts`

## Critères d’acceptation
- 4 champs, validation à la sortie du champ, erreurs liées (aria-describedby)
- Turnstile vérifié côté serveur, relais signé HMAC, réponses FR/EN
- Turnstile chargé à la première interaction seulement

## Vérification
```bash
npm run test:unit && npx playwright test tests/forms.spec.ts
```
