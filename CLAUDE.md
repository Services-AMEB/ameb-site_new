# CLAUDE.md — site ameb (Services AMEB inc.)

Site vitrine bilingue (FR d'abord, EN équivalent) : Astro 7 statique, CSS natif, Cloudflare (Workers ou Pages).
Référence : `docs/brief.md`, amendé par les décisions de `docs/decisions/` (ADR-012 : sept pages, aucun chiffre exact, boucles sans pause, clair par défaut + bascule sombre). En cas de contradiction, l'ADR le plus récent gagne.

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
- `npm run cf:dev` — build de préproduction + `wrangler dev` (runtime Cloudflare local; secrets dans `.dev.vars`)
- `npm run deploy:dev` / `npm run deploy` — Worker « ameb-site-dev » (noindex) / « ameb-site » (production)

## Règles absolues (brief §1)
1. Jamais le nom de l'éditeur (voir `docs/interdits.txt`), aucun de ses produits, aucun nom de client ni de concurrent dans `src/` ou `public/`.
2. Aucun chiffre exact ni inventé (résultat, taux, délai, prix, forfait) : formuler en ordre de grandeur (« quelques semaines », fourchette arrondie du calculateur). Les coordonnées manquantes restent `[À CONFIRMER]` / `[TO BE CONFIRMED]`, puis `npm run a-confirmer`.
3. Français québécois, vouvoiement, titres en phrase, aucun emoji; les espaces insécables sont ajoutées par `src/lib/typo.ts` (jamais « : » en dur dans un gabarit : utiliser `colon(lang)` ou `t()`).
4. Chaque page FR a son équivalent EN (mêmes sections, mêmes H2); l'EN n'est jamais plus complet.
5. Couleurs, tailles, espacements, durées : jetons `var(--…)` de `src/styles/tokens.css` uniquement (Stylelint l'impose).
6. Aucune dépendance nouvelle sans justification dans la PR; pas de framework client, pas de Tailwind.
7. Aucune ressource tierce au premier rendu (sauf analytics sans témoins); Turnstile chargé à la première interaction d'un formulaire.
8. Message : « La technologie s'adapte à vous. Pas l'inverse. » On analyse d'abord, on décide (garder / intégrer / automatiser / développer), puis on construit. Jamais de nom de logiciel; l'analogie du moule est permise.

## Organisation
- Une tâche = une branche = une PR, décrite dans `docs/taches/NNN-titre.md` (objectif, fichiers, critères d'acceptation, commandes de vérification).
- Lance `npm run check && npm test` avant de déclarer une tâche terminée (et `npm run build && npm run verify:dist`).
- Toute décision d'architecture → `docs/decisions/ADR-NNN-titre.md` (10 lignes).
- Toute correction humaine devient une règle ici ou un test.

## Où vit quoi
- Textes : `src/content/<collection>/{fr,en}/<clé>.md` (même nom de fichier dans les deux langues, schémas zod dans `src/content.config.ts`); chaînes d'interface : `src/i18n/ui.ts`.
- URL : `src/i18n/routes.ts` (table unique FR ↔ EN, 7 pages + ancres de l'accueil; ajouter une page = ajouter une clé). Pas de nouvelle page sans décision : l'accueil porte le message.
- Pages : `src/pages/**` (3 lignes) → vues `src/views/*View.astro` partagées par les deux langues.
- Composants de l'accueil : `src/components/home/` (Hero = faisceaux + journal, Calc = fourchette, Gains = bento, Method = moule + 3 étapes collantes, Services = rubans + orbite, Sectors = onglets, Offer = carte à bordure tournante); `CaseCards` partagé avec /realisations/.
- API : `worker/index.ts` (Cloudflare Workers, `wrangler.jsonc`) ou `functions/api/contact.ts` (Pages) → `src/server/contact.ts` (Turnstile → zod → n8n signé HMAC).
- Styles : `@layer reset, tokens, base, layout, components, utilities, motion`. Styles de composant : toujours dans `@layer components` ou `@layer motion`.

## Pièges connus
- Mouvement : état final écrit par défaut; animations seulement sous `prefers-reduced-motion: no-preference`; boucles continues sans bouton d'arrêt (ADR-012); délais en `calc(var(--dur-…) * n)`, jamais en secondes littérales (Stylelint).
- Thème : clair par défaut, `html[data-theme="dark"]` par la bascule de l'en-tête (mémorisée dans `localStorage`, appliquée par un script inline dans `Base.astro`). Les fonds forts utilisent `--band`, le logo `--color-logo`; tout jeton de couleur a sa valeur sombre dans `tokens.css`.
- Jamais de révélation (`.reveal`) sur le H1, le sous-titre du hero ni la première section sous l'en-tête.
- Libellés de schéma : HTML positionné avec un fond propre (contraste vérifiable par axe), jamais de `<text>` SVG; les démos sont `aria-hidden` et marquées « données fictives ».
- Plages unicode des polices : « œ » doit rester dans le sous-ensemble latin (sinon 85 Ko de plus).
- Markdown : processeur Sätteri (Astro 7) — plugin `src/lib/remark-typo.ts`.
- Captures visuelles : régénérer avec `npx playwright test tests/visual.spec.ts --update-snapshots` après un changement voulu.
