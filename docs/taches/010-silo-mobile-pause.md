# Tâche 010 — SectionSilo mobile, mouvement réduit, pause

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
SectionSilo mobile, mouvement réduit, pause conformément à `docs/brief.md`.

## Fichiers
- `src/components/SectionSilo.astro`
- `src/styles/motion.css`

## Critères d’acceptation
- Cartes et mini-scènes figées si < 1024 px, mouvement réduit ou sans prise en charge
- Bouton pause : coupe toute animation, mémorisé

## Vérification
```bash
npx playwright test tests/reduced-motion.spec.ts
```
