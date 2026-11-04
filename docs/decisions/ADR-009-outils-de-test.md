# ADR-009 — Pa11y CI et Lighthouse CI lancés par npx (versions figées)

- Statut : Accepté
- Date : 2026-11-04

- Pa11y CI (puppeteer et son navigateur) et Lighthouse CI sont lourds et ne servent qu’en CI.
- Décision : `npx --yes pa11y-ci@5.0.0` et `npx --yes @lhci/cli@0.15.1`, versions figées dans `package.json` (scripts) et `ci.yml`, plutôt qu’en devDependencies; `npm ci` reste rapide.
- Playwright est figé à 1.63.0, la version du navigateur préinstallé de l’environnement de développement : les captures de référence restent comparables en CI.
- Le serveur local (`scripts/serve.ts`) compresse en gzip comme Cloudflare, pour que Lighthouse mesure des tailles réalistes.
- Budgets : Lighthouse (taille transférée) et `check-dist` (gzip niveau 9) appliquent les mêmes seuils du brief §13.
