# Tâche 008 — FlowLine + données JSON

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
FlowLine + données JSON conformément à `docs/brief.md`.

## Fichiers
- `src/components/FlowLine.astro`
- `src/data/flows/*.json`

## Critères d’acceptation
- Lecture unique de 4 s à l’entrée dans la vue, bouton Rejouer, onglets
- Mouvement réduit : tout allumé; mobile : vertical

## Vérification
```bash
npx playwright test tests/interactions.spec.ts
```
