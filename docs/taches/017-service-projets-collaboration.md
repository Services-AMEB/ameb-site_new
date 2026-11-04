# Tâche 017 — Page Services : projets-collaboration

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Page Services : projets-collaboration conformément à `docs/brief.md`.

## Fichiers
- `src/content/services/fr/projets-collaboration.md`
- `src/content/services/en/projets-collaboration.md`
- `src/views/ServiceView.astro`

## Critères d’acceptation
- Gabarit §5.2 : douleurs, capacités, FlowLine, étapes, cas, FAQ (FAQPage), CTA
- Phrase commune « Le fil conducteur… »
- Aucun délai inventé (FAQ : [À CONFIRMER])

## Vérification
```bash
npm run check && npm run build && npm run verify:dist
```
