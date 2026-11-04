# Tâche 007 — Accueil statique (texte FR)

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Accueil statique (texte FR) conformément à `docs/brief.md`.

## Fichiers
- `src/views/HomeView.astro`
- `src/content/pages/fr/accueil.md`
- `src/components/Hero.astro`

## Critères d’acceptation
- 11 sections du brief §5.1
- Coût du statu quo calculé par la formule (10 800 $)

## Vérification
```bash
npm run build && npm run verify:dist
```
