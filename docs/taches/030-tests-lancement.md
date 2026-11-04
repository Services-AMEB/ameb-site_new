# Tâche 030 — Tests complets, Lighthouse CI, Pa11y, liste de lancement

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Tests complets, Lighthouse CI, Pa11y, liste de lancement conformément à `docs/brief.md`.

## Fichiers
- `tests/`
- `lighthouserc.json`
- `.pa11yci.json`
- `playwright.config.ts`
- `docs/a-confirmer.md`

## Critères d’acceptation
- axe 0 serious/critical sur tout le plan du site; Pa11y 66/66
- Lighthouse mobile ≥ 95 ×4 sur les 8 URL; budgets
- Liste de lancement : plan §10.1

## Vérification
```bash
npm test && npm run test:a11y && npm run test:lh
```
