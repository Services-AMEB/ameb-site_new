# Tâche 004 — Button, Card, Steps, FAQ, /styleguide/

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Button, Card, Steps, FAQ, /styleguide/ conformément à `docs/brief.md`.

## Fichiers
- `src/components/Button.astro`
- `src/components/Card.astro`
- `src/components/Steps.astro`
- `src/components/FAQ.astro`
- `src/views/StyleguideView.astro`

## Critères d’acceptation
- Styleguide noindex avec jetons et composants
- Focus visible partout

## Vérification
```bash
npm run build && npx playwright test tests/a11y.spec.ts -g styleguide
```
