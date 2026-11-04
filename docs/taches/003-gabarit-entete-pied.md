# Tâche 003 — Base.astro, Header, Footer, LangSwitch, routes i18n

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Base.astro, Header, Footer, LangSwitch, routes i18n conformément à `docs/brief.md`.

## Fichiers
- `src/layouts/Base.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/LangSwitch.astro`
- `src/i18n/routes.ts`
- `src/i18n/ui.ts`

## Critères d’acceptation
- Lien d’évitement, landmarks, menu mobile en <dialog>
- LangSwitch → page équivalente
- RPRP et nom légal dans le pied de page

## Vérification
```bash
npx playwright test tests/i18n.spec.ts
```
