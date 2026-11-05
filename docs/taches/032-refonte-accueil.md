# Tâche 032 — Refonte de l’accueil et réduction à sept pages

- Statut : terminée (2026-11-05)
- Branche : `feat/refonte-accueil`
- Décision : ADR-012

## Objectif
Rendre le message compréhensible en quelques secondes (« la technologie s’adapte à vous, pas l’inverse », on analyse d’abord, on décide, puis on construit), avec les composants validés dans le prototype, sans chiffre exact, clair par défaut avec bascule sombre, animations en boucle.

## Fichiers
- `src/i18n/routes.ts` (7 routes + ancres), `src/i18n/ui.ts`
- `src/styles/tokens.css` (thème sombre, jetons de mouvement et de taille), `components.css`, `motion.css`
- `src/components/home/{Hero,Calc,Gains,Method,Services,Sectors,Offer}.astro`, `src/components/CaseCards.astro`, `Header.astro` (bascule), `Footer.astro`
- `src/views/{HomeView,RealisationsView,DiagnosticView,ContactView,StyleguideView}.astro`
- `src/content.config.ts`, `src/content/pages/{fr,en}/{accueil,diagnostic,realisations,contact,accessibilite}.md`, `src/content/cas/`
- `src/lib/calc.ts` (fourchette), `scripts/check-dist.ts`, `scripts/a-confirmer.ts`, tests, `lighthouserc.json`, `docs/interdits.txt` (rewst, gto)

## Critères d’acceptation
- 7 pages FR et 7 pages EN, parité vérifiée; aucune route orpheline
- Aucun chiffre exact dans le contenu (prix, pourcentage, délai, résultat); calculateur en fourchette arrondie
- Clair par défaut même si le système est en sombre; bascule mémorisée; contrastes AA dans les deux thèmes (axe sur chaque page)
- Boucles continues, aucun bouton d’arrêt; tout s’arrête sous `prefers-reduced-motion`
- Budgets : HTML ≤ 50 Ko, CSS ≤ 30 Ko, JS ≤ 20 Ko (gzip); Lighthouse mobile ≥ 95 ×4 sur les 8 URL

## Vérification
```bash
npm run check && npm run lint && npm run build && npm run verify:dist && npm test
```
