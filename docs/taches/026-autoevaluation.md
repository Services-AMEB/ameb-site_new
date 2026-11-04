# Tâche 026 — Autoévaluation (Quiz)

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Autoévaluation (Quiz) conformément à `docs/brief.md`.

## Fichiers
- `src/components/Quiz.astro`
- `src/data/quiz.json`

## Critères d’acceptation
- 10 questions 0-3, 3 profils, 3 recommandations chacun
- Barre de progression, clavier, résultat sans courriel

## Vérification
```bash
npx playwright test tests/forms.spec.ts -g autoévaluation
```
