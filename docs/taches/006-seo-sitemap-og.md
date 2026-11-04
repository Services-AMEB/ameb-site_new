# Tâche 006 — Seo, sitemap, robots, images OG

- Statut : terminée (2026-11-04, branche de construction initiale — voir ADR-010)

## Objectif
Seo, sitemap, robots, images OG conformément à `docs/brief.md`.

## Fichiers
- `src/components/Seo.astro`
- `src/lib/seo.ts`
- `public/robots.txt`
- `scripts/og-images.ts`

## Critères d’acceptation
- hreflang fr-CA / en-CA / x-default, canonical, og:locale
- JSON-LD Organization, ProfessionalService, Service, FAQPage, BreadcrumbList, Article
- 70 images OG générées au build

## Vérification
```bash
npm run build && npx playwright test tests/i18n.spec.ts
```
