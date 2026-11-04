# ADR-001 — Choix d’Astro (7.x, sortie statique)

- Statut : Accepté
- Date : 2026-11-04

- Contexte : site vitrine bilingue maintenu par un fondateur avec Claude Code; tout doit être texte et diffable (brief §2, plan §6.1).
- Décision : Astro 7.4.1 (dernière stable publiée depuis plus de deux semaines au démarrage; le brief exige 6.x ou plus), `output: 'static'`, TypeScript strict, Content Collections + zod.
- Pourquoi : 0 Ko de JS par défaut, routage i18n natif, Markdown, MIT, hébergement Cloudflare gratuit; Next.js (runtime React) et les éditeurs visuels (verrouillage) écartés.
- Dépendances installées avec `npm install --before=<J−14>` (versions de plus de deux semaines) et figées (`--save-exact`, `package-lock.json`).
- Astro 7 : la configuration du contenu vit dans `src/content.config.ts` (et non `src/content/config.ts`, emplacement d’Astro 4 retiré); le Markdown passe par Sätteri (voir ADR-008).
- Conséquence : chaque page est un fichier de 3 lignes qui appelle une vue partagée FR/EN (`src/views/`).
