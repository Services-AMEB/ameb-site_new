# Registre des éléments à confirmer

Tout `[À CONFIRMER]` affiché sur le site est inscrit ici, avec la page concernée. Rien ne se publie en production tant qu'un élément de la section « Bloquant au lancement » reste ouvert.

- Section 1 : tenue à la main (décisions, comptes, validations juridiques).
- Section 2 : générée par `npm run a-confirmer` à partir du contenu; la CI échoue si elle n'est pas à jour.

## 1. Éléments hors contenu

| # | Élément | Où | Responsable | Avant | Statut |
|---|---|---|---|---|---|
| 1 | Prix du diagnostic (communiqué par écrit avant la première rencontre; non affiché sur le site, ADR-012) et modalités de déduction si l'implantation suit | /diagnostic/ | Houssam | Phase 1 | Ouvert |
| 2 | Durée réelle du diagnostic (« quelques semaines » affiché) | /diagnostic/ | Houssam | Phase 1 | Ouvert |
| 3 | **Approbation écrite des trois clients** pour leur cas anonymisé (aucun chiffre affiché, ADR-012) | /realisations/ | Houssam | Phase 1 | Ouvert |
| 4 | Nom et courriel du RPRP; adresse d'affaires; téléphone; courriel de contact; heures | Pied de page, /contact/, pages légales | Houssam | Phase 1 | Ouvert |
| 5 | Parcours du fondateur (bloc « Qui est derrière ameb ») | /contact/ | Houssam | Phase 2 | Ouvert |
| 6 | Domaine définitif (`SITE_URL`, défaut `https://ameb.ca`) et `robots.txt` (ligne Sitemap) | Configuration | Houssam | Phase 3 | Ouvert |
| 7 | Outil et lien de prise de rendez-vous (`PUBLIC_BOOKING_URL`) | /contact/ | Houssam | Phase 3 | Ouvert |
| 8 | Outil d'analytics sans témoins (Umami auto-hébergé ou Plausible) : `PUBLIC_ANALYTICS_SRC`, `PUBLIC_ANALYTICS_ID` | Toutes les pages | Houssam | Phase 3 | Ouvert |
| 9 | Clés Cloudflare Turnstile (`PUBLIC_TURNSTILE_SITEKEY`, `TURNSTILE_SECRET`) et webhook n8n (`N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`) en préproduction puis en production | Formulaires | Houssam | Phase 5 | Ouvert |
| 10 | Admissibilité au programme ESSOR pour les secteurs visés; formulation « possiblement admissible » | /, /diagnostic/ | Houssam + IQ | Phase 1 | Ouvert |
| 11 | Applicabilité de la Loi 5 aux mandats en clinique | / (onglet Cliniques) | Juriste | Phase 5 | Ouvert |
| 12 | Position « sans bannière » avec analytics sans témoins (voir ADR-007) | /confidentialite/ | Juriste | Phase 5 | Ouvert |
| 13 | Durée de conservation des soumissions (proposition : 24 mois) | /confidentialite/ | Juriste | Phase 5 | Ouvert |
| 14 | Relecture juridique des trois pages légales | /confidentialite/, /accessibilite/, /mentions-legales/ | Juriste | Phase 5 | Ouvert |
| 15 | Hébergement de l'outil d'automatisation (n8n) et évaluation des facteurs relatifs à la vie privée (Cloudflare, n8n) | /confidentialite/ | Houssam + juriste | Phase 5 | Ouvert |
| 16 | Antériorité du slogan et de la marque « ameb » (registre des marques) | /mentions-legales/ | Houssam | Phase 5 | Ouvert |
| 17 | NEQ de Services AMEB inc. | /mentions-legales/ | Houssam | Phase 1 | Ouvert |
| 18 | Logo : le brief décrit un point « centré sur la hauteur d'x, 0,34 × x »; le logo fourni montre un point posé sur la ligne de base (≈ 0,45 × x). Le site reproduit le logo fourni (ADR-006) | Logo, favicon, OG | Houssam | Phase 2 | À trancher |
| 19 | Rendu des animations de l'accueil (faisceaux, orbite, bordure tournante `@property`) sur Safari et Firefox récents : testé sur Chromium seulement | Accueil | Test manuel | Tâche 032 | Ouvert |
| 20 | Boucles d'animation sans bouton d'arrêt (demande du propriétaire, ADR-012) : écart assumé au critère WCAG 2.2.2; à reconsidérer si un utilisateur le signale | Accueil | Houssam | — | Assumé |
| 21 | Date du dernier test manuel clavier et lecteur d'écran; courriel et délai de réponse pour signaler un obstacle | /accessibilite/ | Houssam | Phase 5 | Ouvert |
| 22 | Volumes de recherche des mots-clés (titres et descriptions SEO à ajuster) | Toutes les pages | Houssam | Phase 0 | Ouvert |
| 23 | Compte Cloudflare : création des Workers `ameb-site-dev` et `ameb-site`, sous-domaine workers.dev, secrets par environnement (README, « Déployer ») | Configuration | Houssam | Avant le premier déploiement dev | Ouvert |

## 2. Marqueurs dans le contenu

<!-- DÉBUT : section générée par scripts/a-confirmer.ts — ne pas modifier à la main -->
30 marqueurs dans le contenu français (chacun a son pendant [TO BE CONFIRMED] en anglais).

| Page | Champ | Marqueur | Fichier |
|---|---|---|---|
| /accessibilite/ | review | [À CONFIRMER — relecture juridique] | `src/content/pages/fr/accessibilite.md:8` |
| /accessibilite/ | corps (Comment nous testons) | [À CONFIRMER] | `src/content/pages/fr/accessibilite.md:29` |
| /accessibilite/ | corps (Limites connues) | [À CONFIRMER] | `src/content/pages/fr/accessibilite.md:38` |
| /accessibilite/ | corps (Signaler un obstacle) | [COURRIEL À CONFIRMER] | `src/content/pages/fr/accessibilite.md:42` |
| /accessibilite/ | corps (Délai de réponse) | [À CONFIRMER] | `src/content/pages/fr/accessibilite.md:54` |
| /confidentialite/ | review | [À CONFIRMER — relecture juridique] | `src/content/pages/fr/confidentialite.md:8` |
| /confidentialite/ | corps (Qui est responsable) | [NOM, COURRIEL À CONFIRMER] | `src/content/pages/fr/confidentialite.md:15` |
| /confidentialite/ | corps (Pourquoi nous les utilisons) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:53` |
| /confidentialite/ | corps (Témoins et mesure d’audience) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:61` |
| /confidentialite/ | corps (Témoins et mesure d’audience) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:63` |
| /confidentialite/ | corps (Relais des formulaires) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:73` |
| /confidentialite/ | corps (Prise de rendez-vous) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:77` |
| /confidentialite/ | corps (Communication à l’extérieur du Québec) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:81` |
| /confidentialite/ | corps (Communication à l’extérieur du Québec) | [À CONFIRMER] | `src/content/pages/fr/confidentialite.md:81` |
| /confidentialite/ | corps (Durée de conservation) | [À CONFIRMER — durée proposée : 24 mois] | `src/content/pages/fr/confidentialite.md:85` |
| /confidentialite/ | corps (Nous joindre) | [NOM, COURRIEL À CONFIRMER] | `src/content/pages/fr/confidentialite.md:120` |
| /confidentialite/ | corps (Nous joindre) | [ADRESSE À CONFIRMER] | `src/content/pages/fr/confidentialite.md:121` |
| /contact/ | details.email | [COURRIEL À CONFIRMER] | `src/content/pages/fr/contact.md:9` |
| /contact/ | details.phone | [TÉLÉPHONE À CONFIRMER] | `src/content/pages/fr/contact.md:10` |
| /contact/ | details.address | [ADRESSE À CONFIRMER] | `src/content/pages/fr/contact.md:11` |
| /contact/ | details.hours | [HEURES À CONFIRMER] | `src/content/pages/fr/contact.md:12` |
| /contact/ | about.paragraphs | [PARCOURS À CONFIRMER] | `src/content/pages/fr/contact.md:22` |
| /mentions-legales/ | review | [À CONFIRMER — relecture juridique] | `src/content/pages/fr/mentions-legales.md:8` |
| /mentions-legales/ | corps (Éditeur du site) | [À CONFIRMER] | `src/content/pages/fr/mentions-legales.md:14` |
| /mentions-legales/ | corps (Éditeur du site) | [À CONFIRMER] | `src/content/pages/fr/mentions-legales.md:15` |
| /mentions-legales/ | corps (Éditeur du site) | [À CONFIRMER] | `src/content/pages/fr/mentions-legales.md:16` |
| /mentions-legales/ | corps (Marques) | [À CONFIRMER] | `src/content/pages/fr/mentions-legales.md:28` |
| toutes (pied de page) | footer.address | [À CONFIRMER] | `src/i18n/ui.ts:54` |
| toutes (pied de page) | footer.rprpValue | [NOM, COURRIEL À CONFIRMER] | `src/i18n/ui.ts:56` |
| interface | common.toConfirm | [À CONFIRMER] | `src/i18n/ui.ts:64` |
<!-- FIN : section générée -->
