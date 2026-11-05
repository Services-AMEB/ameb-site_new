# ameb — site vitrine de Services AMEB inc.

Site bilingue (français à la racine, anglais sous `/en/`) d'**ameb**, firme montréalaise d'automatisation, d'IA et de données pour les PME et organisations moyennes du Québec. Slogan : « Vos opérations, en pilote automatique. »

- **Pile** : Astro 7 (statique), TypeScript strict, CSS natif (jetons + `@layer`), aucun framework client
- **Hébergement** : Cloudflare Pages; `POST /api/contact` = Pages Function (`functions/api/contact.ts`)
- **Sept pages par langue** (ADR-012) : accueil (message complet, sections ancrées), diagnostic, réalisations, contact, confidentialité, accessibilité, mentions légales
- **Qualité mesurée** : voir la section « Vérifications »; chaque PR relance Lighthouse (8 URL, mobile, ≥ 95 ×4), axe et Pa11y sur tout le plan du site
- **Pour Claude Code** : lire `CLAUDE.md`. Brief : `docs/brief.md`. Décisions : `docs/decisions/`. À confirmer avant lancement : `docs/a-confirmer.md`

## Démarrer

Node 22.22 ou plus récent (`.nvmrc`).

```bash
npm ci
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Pour tester les formulaires comme en production : `npm run build` puis `npm run preview` (sert `dist/` et `/api/contact`; variables `TURNSTILE_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` dans l'environnement).

## Déployer sur Cloudflare (Workers, `wrangler.jsonc`)

Le site se déploie comme **Worker à ressources statiques** : `dist/` est servi en statique et seul `/api/*` exécute `worker/index.ts`. Deux environnements :

| Environnement | Worker | Indexation | Commande |
|---|---|---|---|
| dev (préproduction) | `ameb-site-new-dev` (`*.workers.dev`) | `noindex` + `robots.txt` « Disallow: / » | `npm run deploy:dev` |
| production | `ameb-site-new` | normale | `npm run deploy` |

### Mode dev, depuis votre poste

```bash
npx wrangler@4.151.3 login
```

```bash
npm run deploy:dev
```

Secrets du formulaire (une fois par environnement; sans eux, l'API répond 503 et le formulaire affiche un message d'erreur) :

```bash
npx wrangler@4.151.3 secret put TURNSTILE_SECRET --env dev
```

```bash
npx wrangler@4.151.3 secret put N8N_WEBHOOK_URL --env dev
```

```bash
npx wrangler@4.151.3 secret put N8N_WEBHOOK_SECRET --env dev
```

En dev, les clés de test de Cloudflare Turnstile évitent de créer un widget : clé de site `1x00000000000000000000AA` (variable de build `PUBLIC_TURNSTILE_SITEKEY`), secret `1x0000000000000000000000000000000AA`.

Tester localement dans le runtime Cloudflare (copier `.dev.vars.example` en `.dev.vars`) :

```bash
npm run cf:dev
```

### Mode dev, par Git (Workers Builds)

Dans le tableau de bord Cloudflare, créer un Worker relié au dépôt GitHub :
- nom du Worker : `ameb-site-new-dev` (doit correspondre à `env.dev.name`);
- commande de build : laisser vide (`wrangler.jsonc` compile le site lui-même avant le déploiement) ou `npm run build:dev`;
- commande de déploiement : `npx wrangler deploy --env dev`;
- variables de build : `PUBLIC_TURNSTILE_SITEKEY` (et au besoin `PUBLIC_BOOKING_URL`, `PUBLIC_ANALYTICS_SRC`, `PUBLIC_ANALYTICS_ID`);
- secrets du Worker : `TURNSTILE_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`.

Pour la production, même chose avec le Worker `ameb-site-new` (le nom déclaré dans `wrangler.jsonc` doit être exactement celui du Worker dans le tableau de bord), la commande de build `npm run build` et la commande de déploiement `npx wrangler deploy` (variable de build `SITE_URL` = domaine définitif).

### Cloudflare Pages (autre option)

Un projet Pages ignore `wrangler.jsonc` (pas de `pages_build_output_dir`) et utilise `functions/api/contact.ts` : commande de build `npm run build`, répertoire de sortie `dist`, mêmes variables et secrets.

Le webhook n8n doit vérifier `X-AMEB-Signature` = HMAC-SHA256 hexadécimal du corps brut avec `N8N_WEBHOOK_SECRET`.

## Modifier le contenu

Tout le texte vit dans `src/content/<collection>/{fr,en}/<clé>.md` (même nom de fichier dans les deux langues) et `src/i18n/ui.ts`. Écrivez des espaces ordinaires : les espaces insécables françaises sont ajoutées automatiquement. Après un ajout ou un retrait de `[À CONFIRMER]`, lancez `npm run a-confirmer`.

## Vérifications

| Commande | Effet |
|---|---|
| `npm run check` | types, contenu interdit, parité FR/EN, registre à jour |
| `npm run lint` | ESLint + Stylelint (jetons obligatoires) |
| `npm run build && npm run verify:dist` | liens, ancres, budgets gzip, H1 unique, parité H2, typographie FR |
| `npm test` | unitaires + Playwright (a11y, privacy, forms, i18n, reduced-motion, interactions, visual) |
| `npm run test:a11y` | axe + Pa11y CI (lancer d'abord `node scripts/serve.ts 4324`) |
| `npm run test:lh` | Lighthouse CI (8 URL, mobile, ≥ 95, budgets) |
