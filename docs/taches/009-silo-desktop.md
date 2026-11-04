# Tâche 009 — SectionSilo desktop

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
SectionSilo desktop conformément à `docs/brief.md`.

## Fichiers
- `src/components/SectionSilo.astro`
- `src/components/SiloScene.astro`
- `src/components/icons/Sprite.astro`

## Critères d’acceptation
- 400vh, scène collante, view-timeline --silo, 4 scènes
- Aucun <text> SVG, aucun écouteur scroll
- Scène ≤ 10 Ko gzip

## Vérification
```bash
npm run verify:dist -- --report
```
