# Tâche 011 — BeforeAfter

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
BeforeAfter conformément à `docs/brief.md`.

## Fichiers
- `src/components/BeforeAfter.astro`

## Critères d’acceptation
- aria-pressed, View Transition sinon FLIP 450 ms, fondu en mouvement réduit
- Clavier et toucher

## Vérification
```bash
npx playwright test tests/interactions.spec.ts
```
