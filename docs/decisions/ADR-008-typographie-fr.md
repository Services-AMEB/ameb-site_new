# ADR-008 — Typographie française automatique

- Statut : Accepté
- Date : 2026-11-04

- Décision : les rédacteurs écrivent des espaces ordinaires; `src/lib/typo.ts` insère les espaces insécables (avant « : ; ? ! », dans les « guillemets », milliers, avant « $ » et « % »).
- Appliquée à toutes les chaînes de l’avant-propos (`deepTypo` dans `src/lib/content.ts`), aux chaînes d’interface (`t()`), et aux corps Markdown FR par un plugin Sätteri (`src/lib/remark-typo.ts`; Astro 7 a remplacé remark par Sätteri).
- Gabarits : jamais « : » en dur; utiliser `colon(lang)`.
- Contrôle : `check-dist` échoue si une page FR contient une espace ordinaire avant « ; : ! ? ».
- Les URL et les heures ne sont pas touchées (règles conservatrices, tests unitaires).
