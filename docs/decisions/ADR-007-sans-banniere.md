# ADR-007 — Politique « sans bannière » de témoins

- Statut : Accepté (validation juridique à faire)
- Date : 2026-11-04

- Constat : le site ne dépose aucun témoin, ni essentiel ni non essentiel (test Playwright `privacy.spec` : 0 témoin au premier chargement sur 10 pages, desktop et mobile).
- Mesure d’audience : Umami ou Plausible sans témoins ni identifiant persistant, chargé en `defer` seulement si `PUBLIC_ANALYTICS_SRC` est défini; `src/lib/track.ts` ne fait rien sinon.
- Tiers : seul Cloudflare Turnstile, sur les pages avec formulaire, et seulement après la première interaction; mentionné dans la politique de confidentialité.
- Décision : aucune bannière tant qu’aucune technologie qui identifie, localise ou profile n’est ajoutée (Loi 25, art. 8.1).
- Toute nouvelle ressource tierce doit d’abord faire échouer `privacy.spec`, puis être ajoutée à sa liste d’autorisation avec une décision écrite ici.
- Validation par un juriste : registre n° 12.
