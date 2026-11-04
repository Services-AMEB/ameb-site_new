# ADR-011 — Déploiement Cloudflare Workers (wrangler.jsonc) avec environnement dev

- Statut : Accepté
- Date : 2026-11-04

- Contexte : demande de pouvoir déployer le site sur Cloudflare « en mode dev »; le tableau de bord Cloudflare propose désormais par défaut un Worker à ressources statiques.
- Décision : `wrangler.jsonc` déclare un Worker (`main: worker/index.ts`) qui sert `dist/` (binding `ASSETS`, `auto-trailing-slash`, `404-page`) et n'exécute du code que pour `/api/*` (`run_worker_first`). La logique reste `src/server/contact.ts`, partagée avec la Pages Function (ADR-004), qui demeure pour un éventuel projet Pages.
- Environnements : production (`ameb-site`) et `dev` (`ameb-site-dev`, `workers_dev`, URL d'aperçu). `SITE_ENV=dev` au build (`astro:env`) met toutes les pages en `noindex` et génère un `robots.txt` « Disallow: / » : la préproduction n'est jamais indexée.
- Wrangler 4.151.3 lancé par `npx` (version figée, comme Pa11y et Lighthouse CI — ADR-009) : aucune dépendance ajoutée au projet.
- Vérifié localement avec `wrangler dev` (runtime workerd) : pages, redirections, 404 FR/EN, `_headers`, API (405, 422 EN, 503 sans secrets, 200 avec relais signé HMAC valide) et `wrangler deploy --dry-run` pour les deux environnements.
- Secrets (`TURNSTILE_SECRET`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`) : `wrangler secret put … --env dev`, jamais dans `wrangler.jsonc`; en local, `.dev.vars` (ignoré par git).
