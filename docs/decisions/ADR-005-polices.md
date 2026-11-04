# ADR-005 — Polices : Sora statique, Inter variable

- Statut : Accepté
- Date : 2026-11-04

- Décision : Sora 600 et 700 (WOFF2 statiques) et Inter en un seul WOFF2 variable (axe wght) couvrant 400, 500 et 600; sous-ensembles latin + latin étendu de Fontsource (licence OFL), servis depuis `public/fonts/`.
- Pourquoi : Inter 400 + 500 + 600 en statique = 72 Ko; la variable = 48 Ko. Total par page : 77 Ko (budget 100 Ko), mesuré par Lighthouse.
- `font-display: swap`; préchargement de Sora 600 (latin) seulement; aucun appel à un service de polices tiers.
- Plages unicode : « œ » (U+0153) figurait dans les deux sous-ensembles; on l’a retiré de la plage latin étendu pour éviter de télécharger 85 Ko de plus sur les pages qui l’emploient.
- Images OG : satori lit les versions WOFF (non WOFF2) copiées dans `scripts/assets/`.
