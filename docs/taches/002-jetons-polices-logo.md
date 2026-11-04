# Tâche 002 — Jetons, base, polices, Logo, favicon

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Jetons, base, polices, Logo, favicon conformément à `docs/brief.md`.

## Fichiers
- `src/styles/tokens.css`
- `src/styles/base.css`
- `public/fonts/`
- `src/components/Logo.astro`
- `public/favicon.svg`

## Critères d’acceptation
- Toutes les valeurs du brief §4 présentes
- Polices auto-hébergées, Sora 600 préchargée
- Logo SVG inline, variantes dark/light

## Vérification
```bash
npm run lint && npm run build
```
