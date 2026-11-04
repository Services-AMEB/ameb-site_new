# CLAUDE.md — site ameb (Services AMEB inc.)

Site vitrine bilingue (FR d'abord, EN équivalent) : Astro 7 statique, CSS natif, Cloudflare Pages.
Référence : `docs/brief.md` (fait foi) et `docs/plan-implementation.md`. Décisions : `docs/decisions/`.

## Commandes
- `npm run dev` — serveur de développement (formulaires : voir `npm run preview`)
- `npm run build` — compile `dist/` (+ images OG, pages 404)
- `npm run preview` — sert `dist/` + `/api/contact` comme en production (`node scripts/serve.ts`)
- `npm run check` — `astro check` + `check-content` + `check-parity`
- `npm run lint` — ESLint + Stylelint (jetons obligatoires)
- `npm test` — tests unitaires (`node --test`) + Playwright (a11y, privacy, forms, i18n, reduced-motion, visual)
- `npm run test:a11y` — axe sur tout le plan du site + Pa11y CI (serveur `preview` sur le port 4324)
- `npm run test:lh` — Lighthouse CI mobile (8 URL, ≥ 95 ×4, budgets)
- `npm run verify:dist` — liens, ancres, budgets gzip, H1 unique, parité H2, typographie FR
- `npm run a-confirmer` — régénère `docs/a-confirmer.md` (la CI vérifie qu'il est à jour)

## Règles absolues (brief §1)
1. Jamais le nom de l'éditeur (voir `docs/interdits.txt`), aucun de ses produits, aucun nom de client ni de concurrent dans `src/` ou `public/`.
2. Aucun chiffre inventé (résultat, taux, délai, prix) : `[À CONFIRMER]` / `[TO BE CONFIRMED]`, puis `npm run a-confirmer`.
3. Français québécois, vouvoiement, titres en phrase, aucun emoji; les espaces insécables sont ajoutées par `src/lib/typo.ts` (jamais « : » en dur dans un gabarit : utiliser `colon(lang)` ou `t()`).
4. Chaque page FR a son équivalent EN (mêmes sections, mêmes H2); l'EN n'est jamais plus complet.
5. Couleurs, tailles, espacements, durées : jetons `var(--…)` de `src/styles/tokens.css` uniquement (Stylelint l'impose).
6. Aucune dépendance nouvelle sans justification dans la PR; pas de framework client, pas de Tailwind.
7. Aucune ressource tierce au premier rendu (sauf analytics sans témoins); Turnstile chargé à la première interaction d'un formulaire.

## Organisation
- Une tâche = une branche = une PR, décrite dans `docs/taches/NNN-titre.md` (objectif, fichiers, critères d'acceptation, commandes de vérification).
- Lance `npm run check && npm test` avant de déclarer une tâche terminée (et `npm run build && npm run verify:dist`).
- Toute décision d'architecture → `docs/decisions/ADR-NNN-titre.md` (10 lignes).
- Toute correction humaine devient une règle ici ou un test.

## Où vit quoi
- Textes : `src/content/<collection>/{fr,en}/<clé>.md` (même nom de fichier dans les deux langues, schémas zod dans `src/content.config.ts`); chaînes d'interface : `src/i18n/ui.ts`.
- URL : `src/i18n/routes.ts` (table unique FR ↔ EN; ajouter une page = ajouter une clé).
- Pages : `src/pages/**` (3 lignes) → vues `src/views/*View.astro` partagées par les deux langues.
- Composants : `src/components/` (SectionSilo + SiloScene = concept A, FlowLine = B, BeforeAfter = C).
- API : `functions/api/contact.ts` (Pages Function) → `src/server/contact.ts` (Turnstile → zod → n8n signé HMAC).
- Styles : `@layer reset, tokens, base, layout, components, utilities, motion`. Styles de composant : toujours dans `@layer components` ou `@layer motion`.

## Pièges connus
- Mouvement : état final écrit par défaut; animations sous `prefers-reduced-motion: no-preference` (+ `@supports` pour `animation-timeline`), `animation-timeline` déclaré après le raccourci `animation`, `animation-duration: var(--dur-timeline)` (Firefox).
- `html[data-motion="paused"]` coupe toute animation (bouton pause de la scène silo, mémorisé).
- Jamais de révélation (`.reveal`) sur le H1, le sous-titre du hero ni la première section sous l'en-tête.
- Libellés de schéma : HTML positionné avec un fond propre (contraste vérifiable par axe), jamais de `<text>` SVG.
- Plages unicode des polices : « œ » doit rester dans le sous-ensemble latin (sinon 85 Ko de plus).
- Markdown : processeur Sätteri (Astro 7) — plugin `src/lib/remark-typo.ts`.
- Captures visuelles : régénérer avec `npx playwright test tests/visual.spec.ts --update-snapshots` après un changement voulu.
