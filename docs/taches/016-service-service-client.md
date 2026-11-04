# Tâche 016 — Page Services : service-client

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Page Services : service-client conformément à `docs/brief.md`.

## Fichiers
- `src/content/services/fr/service-client.md`
- `src/content/services/en/service-client.md`
- `src/views/ServiceView.astro`

## Critères d’acceptation
- Gabarit §5.2 : douleurs, capacités, FlowLine, étapes, cas, FAQ (FAQPage), CTA
- Phrase commune « Le fil conducteur… »
- Aucun délai inventé (FAQ : [À CONFIRMER])

## Vérification
```bash
npm run check && npm run build && npm run verify:dist
```
