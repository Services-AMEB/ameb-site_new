# Tâche 025 — Calculateur du coût de la ressaisie

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Calculateur du coût de la ressaisie conformément à `docs/brief.md`.

## Fichiers
- `src/components/Calculator.astro`
- `src/lib/calc.ts`

## Critères d’acceptation
- Formule employés × heures × 48 × coût horaire, format fr-CA
- État dans l’URL, aria-live, formule en texte sans JS
- Rapport par courriel : case non cochée + lien politique

## Vérification
```bash
npx playwright test tests/forms.spec.ts -g calculateur
```
