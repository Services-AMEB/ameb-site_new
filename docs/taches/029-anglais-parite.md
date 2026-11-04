# Tâche 029 — Version anglaise complète + parité

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Version anglaise complète + parité conformément à `docs/brief.md`.

## Fichiers
- `src/content/**/en/`
- `src/pages/en/`
- `scripts/check-parity.ts`

## Critères d’acceptation
- Chaque page FR a son équivalent EN, mêmes H2
- La version française prévaut (mention EN)

## Vérification
```bash
node scripts/check-parity.ts && npm run verify:dist
```
