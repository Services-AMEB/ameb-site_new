# Tâche 005 — Content Collections + schémas zod

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Content Collections + schémas zod conformément à `docs/brief.md`.

## Fichiers
- `src/content.config.ts`
- `src/lib/content.ts`

## Critères d’acceptation
- Titre ≤ 60, description ≤ 155 imposés par le schéma
- Listes de longueur fixe (3 douleurs, 4 FAQ…)

## Vérification
```bash
npx astro sync && npm run check
```
