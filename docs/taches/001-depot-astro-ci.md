# Tâche 001 — Dépôt, Astro, TypeScript strict, lint, CI minimale

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Dépôt, Astro, TypeScript strict, lint, CI minimale conformément à `docs/brief.md`.

## Fichiers
- `package.json`
- `astro.config.ts`
- `tsconfig.json`
- `eslint.config.js`
- `.stylelintrc.json`
- `.github/workflows/ci.yml`

## Critères d’acceptation
- `npm ci` puis `npm run check` et `npm run lint` passent
- CI déclenchée sur chaque PR

## Vérification
```bash
npm run check && npm run lint
```
