# ADR-004 — API de contact en Pages Function native (sans adaptateur Astro)

- Statut : Accepté
- Date : 2026-11-04

- Contexte : le brief demande l’adaptateur Cloudflare « uniquement pour /api/contact (Pages Function) ».
- Constat : `@astrojs/cloudflare` 14 dépend de wrangler et du plugin Vite Cloudflare (workerd) et ferait passer tout le build et le serveur de développement dans le runtime Workers.
- Décision : la logique vit dans `src/server/contact.ts` (indépendante de la plateforme, testée dans Node), exposée par `functions/api/contact.ts`, une Pages Function que Cloudflare Pages compile seule. Le site reste 100 % statique, sans adaptateur ni dépendance supplémentaire.
- Flux : Turnstile vérifié côté serveur → validation zod (`zod` déclaré explicitement) → relais JSON vers `N8N_WEBHOOK_URL`, en-tête `X-AMEB-Signature` = HMAC-SHA256 hexadécimal du corps (`N8N_WEBHOOK_SECRET`) → 200 `{ok:true}` ou 400/422/502/503 avec message FR/EN.
- Local et tests : `scripts/serve.ts` sert `dist/` et route `/api/contact` vers le même gestionnaire; Playwright simule Turnstile et n8n (`tests/support/mock-server.ts`).
- Turnstile est chargé à la première interaction avec un formulaire (focus), jamais au premier rendu.
