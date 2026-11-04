# ADR-002 — CSS natif, sans Tailwind

- Statut : Accepté
- Date : 2026-11-04

- Décision : CSS natif — propriétés personnalisées (`tokens.css`), `@layer reset, tokens, base, layout, components, utilities, motion`, imbrication native; aucun framework CSS.
- Fichiers globaux : tokens, base, layout, components, motion. Les styles propres à un composant restent dans son `.astro`, toujours enveloppés dans `@layer components` ou `@layer motion` (sinon, non couchés, ils l’emporteraient sur tout).
- Garde-fou : Stylelint interdit hors `tokens.css` les couleurs hex, `rgb()`/`hsl()`, les couleurs nommées, les unités px/rem/em pour marges, espacements et tailles de police, et ms/s pour les durées.
- Interrupteurs globaux (mouvement réduit, `data-motion="paused"`) : `!important` dans la dernière couche — l’emporte sur toute déclaration normale.
- Pourquoi : contrôle total du poids (≈ 10 Ko gzip sur l’accueil), aucune dépendance, jetons lisibles par un humain.
