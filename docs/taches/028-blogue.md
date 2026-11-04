# Tâche 028 — Blogue + 2 articles

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Blogue + 2 articles conformément à `docs/brief.md`.

## Fichiers
- `src/layouts/Article.astro`
- `src/views/ArticleView.astro`
- `src/content/blogue/`

## Critères d’acceptation
- JSON-LD Article
- Contenu factuel, sans chiffres non sourcés

## Vérification
```bash
npm run build && npm run verify:dist
```
