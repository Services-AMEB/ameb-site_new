# ADR-006 — Construction du mot-symbole

- Statut : À confirmer
- Date : 2026-11-04

- Le mot-symbole est généré depuis les glyphes de Sora 600 (approche −0,01 em) par `scripts/build-logo.mjs` → `src/components/logo-data.ts`; aucune dépendance à la police au rendu.
- Écart constaté : le brief décrit un point « centré sur la hauteur d’x », de 0,34 × x, à 0,22 × x du « b ». Le logo fourni (`docs/ameb-logo-reference.png`, mesuré au pixel) montre un point posé sur la ligne de base, d’environ 0,45 × x, à 0,20 × x du « b ».
- Décision provisoire : reproduire le logo fourni (identité existante). Pour appliquer la construction du brief : `DOT_ALIGN=center DOT_RATIO=0.34 GAP_RATIO=0.22 node scripts/build-logo.mjs` (après `npm i --no-save opentype.js@1.3.4`).
- Symbole seul (favicon, apple-touch-icon) : point jade dans un carré arrondi jade profond.
- Inscrit au registre (`docs/a-confirmer.md`, n° 18).
