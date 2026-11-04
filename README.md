# ameb — site vitrine de Services AMEB inc.

Site bilingue (français à la racine, anglais sous `/en/`) d'**ameb**, firme montréalaise d'automatisation, d'IA et de données pour les PME et organisations moyennes du Québec. Slogan : « Vos opérations, en pilote automatique. »

- **Pile** : Astro 7 (statique), TypeScript strict, CSS natif (jetons + `@layer`), aucun framework client
- **Hébergement** : Cloudflare Pages; `POST /api/contact` = Pages Function (`functions/api/contact.ts`)
- **Qualité mesurée** (2026-11-04) : Lighthouse mobile 99/100/100/100 sur les 8 URL cibles; axe 0 violation sérieuse sur 68 pages; Pa11y 66/66; 152 tests Playwright + 12 tests unitaires verts
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

## Déployer sur Cloudflare Pages

- Commande de build : `npm run build` — répertoire de sortie : `dist` — le dossier `functions/` est compilé automatiquement.
- Variables publiques (build) : `SITE_URL`, `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_ANALYTICS_SRC`, `PUBLIC_ANALYTICS_ID`, `PUBLIC_BOOKING_URL`.
- Secrets (Functions) : `TURNSTILE_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`.
- Le webhook n8n doit vérifier `X-AMEB-Signature` = HMAC-SHA256 hexadécimal du corps brut avec `N8N_WEBHOOK_SECRET`.

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
