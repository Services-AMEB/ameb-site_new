# Tâche 031 — Déploiement Cloudflare Workers en mode dev (wrangler.jsonc)

- Statut : terminée (2026-11-04)

## Objectif
Pouvoir déployer le site sur Cloudflare dans un environnement de préproduction (dev), non indexé, avec le formulaire fonctionnel.

## Fichiers
- `wrangler.jsonc`, `worker/index.ts`, `.dev.vars.example`
- `astro.config.ts` (`SITE_ENV`), `src/components/Seo.astro`, `src/pages/robots.txt.ts`
- `package.json` (`build:dev`, `cf:dev`, `deploy:dev`, `deploy`), `README.md`, `docs/decisions/ADR-011-cloudflare-workers.md`

## Critères d'acceptation
- `wrangler deploy --dry-run` réussit pour la production et pour `--env dev`
- En dev : `noindex` sur toutes les pages, `robots.txt` « Disallow: / »
- `wrangler dev` : pages, 404 FR/EN, `_headers` et `/api/contact` fonctionnels
- Aucun secret dans le dépôt

## Vérification
```bash
npm run test:unit && npm run build:dev && npx --yes wrangler@4.151.3 deploy --dry-run --env dev
```
