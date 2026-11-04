# BRIEF DE CONSTRUCTION — Site web Services AMEB inc. (« ameb »)

> À coller tel quel comme premier message dans Claude Code, dans un dépôt GitHub vide. Ce brief est autonome : applique-le sans poser de questions. Pour toute donnée manquante, écris `[À CONFIRMER]` dans le contenu et inscris l'élément dans `docs/a-confirmer.md`. Le document de référence complet (`docs/plan-implementation.md`) sera ajouté au dépôt; en cas de contradiction, ce brief gagne.

## 0. Mission

Construis le site vitrine bilingue (français d'abord, anglais équivalent) de **Services AMEB inc.**, firme montréalaise d'automatisation, d'IA et de données pour les PME et organisations moyennes du Québec. Marque : **ameb** (minuscules). Slogan : **« Vos opérations, en pilote automatique. »** Positionnement : agnostique des plateformes; on vend des résultats opérationnels, pas un logiciel. Secteurs mis de l'avant : événementiel et associations, services professionnels, cliniques (MSP en vague 2).

Objectif du site : convertir vers une offre d'entrée à prix fixe, **le diagnostic opérationnel**, avec deux outils interactifs (calculateur, autoévaluation) en soutien.

Travaille par petites tâches : une branche + une PR par tâche, CI verte avant fusion. Commence par créer `CLAUDE.md` (§14), `docs/taches/`, `docs/decisions/`, `docs/interdits.txt`, `docs/a-confirmer.md`, puis la tâche 001.

## 1. Règles absolues

1. N'écris **jamais** le mot « Zoho », aucun nom de produit de cet éditeur, ni aucun nom de client, nulle part dans `src/`, `public/` ou le contenu. Un script de CI l'interdit.
2. N'invente **aucun** chiffre de résultat client, de taux, de délai ou de prix : écris `[À CONFIRMER]`.
3. Français québécois soigné : espaces insécables avant « : ; ? ! » et à l'intérieur des « guillemets »; nombres « 3 000 $ »; « courriel », « témoins », « infolettre », « prospect », « flux », « tableau de bord ». Vouvoiement partout. Titres en phrase (pas de majuscule à chaque mot). Aucun emoji.
4. Chaque page FR a sa page EN équivalente (mêmes sections, mêmes H2 traduits). L'EN n'est jamais plus complet que le FR.
5. Toutes les couleurs, tailles, espacements et durées passent par les jetons `var(--…)` de §4. Aucune valeur en dur.
6. Aucune dépendance nouvelle sans justification dans la PR. Pas de framework client (React, Vue…). Pas de Tailwind sauf décision contraire documentée dans `docs/decisions/`.
7. Aucune ressource tierce chargée au premier rendu, sauf l'analytics sans témoins; Turnstile seulement sur les pages avec formulaire.

## 2. Pile technique

- **Astro** (dernière version stable, 6.x ou plus), sortie statique (`output: 'static'`), TypeScript strict, `astro check` en CI.
- Adaptateur **Cloudflare** uniquement pour `/api/contact` (Pages Function). Hébergement Cloudflare Pages, prévisualisations par branche.
- **CSS natif** : propriétés personnalisées, `@layer reset, tokens, base, layout, components, utilities, motion;`, imbrication native. Fichiers : `tokens.css`, `base.css`, `layout.css`, `components.css`, `motion.css`.
- **Polices auto-hébergées** WOFF2 dans `public/fonts/` : Sora 600 et 700 (titres, mot-symbole), Inter 400, 500, 600 (texte). Sous-ensemble latin + latin étendu. `font-display: swap`. Préchargement de Sora 600 seulement. **Aucun appel à fonts.googleapis.com.**
- Icônes : **Lucide** en SVG inline (trait 1,75 px). Icônes métier des schémas (tableur, enveloppe, fiche, horloge, alerte) dans `src/components/icons/Sprite.astro`.
- Images : `astro:assets` (AVIF/WebP, `srcset`, `width`/`height` obligatoires). Images OG générées au build (`satori` + `@resvg/resvg-js`) : fond `#0F5E4E`, mot-symbole blanc + point jade, titre de page en Sora.
- Contenu : **Content Collections** Markdown/MDX avec schémas zod (`src/content/config.ts`).
- i18n : routage Astro, `defaultLocale: 'fr'` sans préfixe, `en` sous `/en/`, slugs localisés via `src/i18n/routes.ts`, chaînes d'interface dans `src/i18n/ui.ts`.
- Formulaires : `POST /api/contact` → vérifie le jeton **Cloudflare Turnstile** côté serveur (`TURNSTILE_SECRET`) → valide avec zod → relaie en JSON vers `N8N_WEBHOOK_URL` avec en-tête `X-AMEB-Signature` = HMAC-SHA256 (`N8N_WEBHOOK_SECRET`) → répond 200 (JSON `{ok:true}`) ou 400/422 avec message FR/EN. Variables publiques : `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_ANALYTICS_SRC`, `PUBLIC_BOOKING_URL`.
- Analytics : script **Umami** (ou Plausible) sans témoins, chargé en `defer`, source `PUBLIC_ANALYTICS_SRC`. Événements §12.
- Prise de rendez-vous : lien externe `PUBLIC_BOOKING_URL` (`[À CONFIRMER]`), jamais d'iframe au chargement.

## 3. Arborescence du dépôt

```
/
├─ CLAUDE.md
├─ .claude/settings.json            (hooks §14)
├─ docs/ (plan-implementation.md, brief.md, taches/, decisions/, rapports/, interdits.txt, a-confirmer.md)
├─ public/ (favicon.svg, robots.txt, fonts/)
├─ src/
│  ├─ content/ (config.ts; pages/{fr,en}; services/{fr,en}; secteurs/{fr,en}; cas/{fr,en}; blogue/{fr,en})
│  ├─ data/ (flows/evenementiel.json, clinique.json, msp.json, services-pros.json; quiz.json)
│  ├─ components/ (Logo, Header, Footer, LangSwitch, Button, Hero, SectionSilo, FlowLine, BeforeAfter,
│  │               Steps, Card, CaseCard, FAQ, ContactForm, Calculator, Quiz, Seo, icons/Sprite)
│  ├─ layouts/ (Base.astro, Page.astro, Article.astro)
│  ├─ i18n/ (ui.ts, routes.ts)
│  ├─ pages/ (index.astro, services/, secteurs/, diagnostic.astro, outils/, realisations/, approche.astro,
│  │          confiance.astro, a-propos.astro, ressources/, contact.astro, confidentialite.astro,
│  │          accessibilite.astro, mentions-legales.astro, styleguide.astro (noindex), en/…, api/contact.ts)
│  └─ styles/ (tokens.css, base.css, layout.css, components.css, motion.css)
├─ scripts/ (check-content.ts, check-parity.ts, og-images.ts)
├─ tests/ (a11y.spec.ts, privacy.spec.ts, forms.spec.ts, i18n.spec.ts, reduced-motion.spec.ts, visual.spec.ts)
├─ lighthouserc.json, .pa11yci.json, playwright.config.ts
└─ .github/workflows/ci.yml
```

## 4. Marque et jetons de design (`src/styles/tokens.css`)

```css
:root {
  /* Marque (fixes) */
  --jade-900: #0F5E4E;   /* jade profond : mot-symbole, liens, bouton primaire, fonds forts */
  --jade-600: #1B8E6B;   /* jade : point d'accent, focus, tracés SVG, états « connecté ». JAMAIS en texte courant sur blanc (4,1:1) */
  --slate-600: #5A7184;  /* ardoise : texte secondaire, îlots « silo », traits neutres */
  /* Compléments */
  --jade-700: #16745C;   /* survol du bouton primaire; fond de bouton avec petit texte blanc (5,7:1) */
  --jade-100: #DCEFE7;   /* badges, surlignage, cellules « après » */
  --jade-050: #EEF6F3;   /* fond de section alternée */
  --slate-800: #10201C;  /* texte courant (jamais #000) */
  --slate-700: #3E5160;  /* texte de paragraphe secondaire */
  --bg: #FFFFFF; --surface: #F4F7F6; --line: #DDE5E2;
  --alert: #B4413A;      /* décoratif, scène « silo » seulement */
  /* Sémantique */
  --color-text: var(--slate-800); --color-text-2: var(--slate-700); --color-muted: var(--slate-600);
  --color-link: var(--jade-900); --color-action: var(--jade-900); --color-action-hover: var(--jade-700);
  --color-accent: var(--jade-600); --color-focus: var(--jade-600);
  /* Typographie */
  --font-display: "Sora", system-ui, sans-serif; --font-body: "Inter", system-ui, sans-serif;
  --fs-sm: .875rem; --fs-base: 1.0625rem; --fs-lg: 1.25rem; --fs-xl: 1.5rem; --fs-2xl: 2rem; --fs-3xl: 2.5rem;
  --fs-h1: clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem); --lh-body: 1.6; --lh-tight: 1.15;
  /* Espacement, rayons, ombre */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-6: 24px; --sp-8: 32px; --sp-12: 48px;
  --sp-16: 64px; --sp-24: 96px; --sp-32: 128px;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 16px;
  --shadow-1: 0 1px 2px rgb(16 32 28 / .06), 0 8px 24px rgb(16 32 28 / .06);
  /* Mouvement */
  --dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 450ms; --ease-out: cubic-bezier(.2, 0, 0, 1);
  /* Mise en page */
  --container: 1200px; --gutter: 24px;
}
```

**Règles de marque**
- Mot-symbole : « ameb » en Sora 600, approche −0,01 em, couleur `--jade-900` (blanc sur fond jade profond), suivi d'un **point rond** `--jade-600` de diamètre 0,34 × hauteur d'x, centré sur la hauteur d'x, espacé du « b » de 0,22 × hauteur d'x. Composant `Logo.astro` en SVG inline (`<a href="/" aria-label="ameb — accueil">`), variantes `tone="dark" | "light"`. Symbole seul (favicon, OG) : point jade dans un carré arrondi jade profond.
- Une seule couleur d'action : jade. Tout élément cliquable est `--jade-900` ou `--jade-700`; rien d'autre n'est jade. Le jade profond en aplat est réservé au bandeau du diagnostic, au CTA final et au pied de page.
- Contraste : texte courant ≥ 4,5:1 (donc `--slate-800`, `--slate-700`, `--jade-900`); `--jade-600` seulement pour les grands textes (≥ 24 px ou 18,66 px gras), icônes, contours, focus.
- Visuels : schémas SVG de systèmes (ardoise = avant, jade = après), interfaces stylisées en HTML/CSS avec données fictives, portrait du fondateur `[À CONFIRMER]`. **Interdits** : photos de banque, 3D, dégradés maillés, grain, glassmorphism, logos grisés, carrousels automatiques, mot en police de code dans un titre.
- Grille : conteneur 1 200 px, 12 colonnes, gouttière 24 px; sections espacées de `--sp-24` (desktop) et `--sp-16` (mobile).
- Typographie : H1 `--fs-h1` Sora 700 approche −0,02 em, max 3 lignes sur mobile; H2 2-2,25 rem Sora 600; corps `--fs-base` Inter 400 interligne 1,6, ligne ≤ 70 caractères; chiffres `font-variant-numeric: tabular-nums`.

## 5. Pages et contenu (FR; produire l'EN équivalent)

### 5.1 Accueil `/`
1. **Hero** (grille 7/5, empilé sur mobile). H1 : « Vos opérations, en pilote automatique. » Sous-titre : « On relie vos outils, on automatise ce qui se répète et on vous donne une vue claire en temps réel, peu importe la plateforme. » Bouton primaire « Réserver mon diagnostic » → `/diagnostic/`. Bouton secondaire « Calculer mon coût de ressaisie » → `/outils/calculateur-ressaisie/`. Micro-preuve sous les boutons : « Fondée à Montréal · Expérience terrain en événementiel, TI gérées et cliniques ». À droite : `FlowLine` secteur « services-pros » (§7). Le H1 est visible immédiatement, sans animation.
2. **SectionSilo** (§6).
3. **« Ça vous dit quelque chose? »** — 4 cartes : « La même information tapée plusieurs fois » / « Des demandes perdues dans les courriels » / « Des rapports montés à la main dans Excel » / « Des factures et des relances qui traînent ».
4. **Coût du statu quo** — « Une personne qui passe 5 heures par semaine à ressaisir ou à chercher de l'information coûte environ [MONTANT CALCULÉ : 5 × 48 × 45 $ = 10 800 $] par année en temps perdu. » + lien « Faites le calcul pour votre équipe ». Le chiffre est une estimation affichée comme telle, calculée par la formule §5.6 avec les valeurs par défaut.
5. **« Ce qu'on automatise »** — grille de 9 cartes (icône + titre + 1 phrase) vers les pages Services (§5.2).
6. **« Par secteur »** — 3 cartes : « Événementiel et associations », « Services professionnels », « Cliniques », chacune avec un mini `FlowLine` statique et un lien.
7. **« Notre approche »** — `Steps` : 1 Diagnostic « On cartographie vos opérations réelles. » · 2 Plan « On priorise ce qui rapporte le plus vite. » · 3 Mise en place « On connecte, on automatise, on teste. » · 4 Pilote automatique « On documente, on forme, on surveille. »
8. **« Agnostiques, par principe »** — « On ne revend pas de logiciel. On part de vos processus, puis on choisit et on relie les bons outils, y compris ceux que vous avez déjà. »
9. **Réalisations** — 3 `CaseCard` (collection `cas`), résultats `[À CONFIRMER]`.
10. **Confiance** — 3 engagements : « Vos données restent à vous. » / « Accès au moindre privilège, retirés en fin de mandat. » / « Documentation remise à la fin de chaque mandat. » + lien `/confiance/`.
11. **CTA final** (fond `--jade-900`, texte blanc) — H2 « Prêt à arrêter la ressaisie? » + bouton (variante claire) « Réserver mon diagnostic » + « Aucun jargon. Aucune pression. »

### 5.2 Services (9 pages) — slugs FR / EN et H1
| Slug FR / EN | H1 (orienté résultat) | Capacités à présenter |
|---|---|---|
| ventes-crm / sales-crm | « Un seul endroit pour vos contacts, vos occasions et vos devis » | CRM, pipeline de ventes, devis, formulaires web, prise de rendez-vous |
| facturation-paiements / billing-payments | « Facturez plus vite, relancez sans y penser » | Facturation, comptabilité, abonnements, paiements en ligne, relances automatiques |
| marketing-automatise / marketing-automation | « Des campagnes qui partent toutes seules, aux bonnes personnes » | Campagnes courriel, segmentation, listes, parcours clients, sondages |
| evenements / events | « De l'inscription au sondage, sans ressaisie » | Inscriptions, billetterie, programmation, conférenciers, accueil sur place |
| service-client / customer-service | « Chaque demande traitée, suivie, fermée » | Billets de soutien, formulaires, prise de rendez-vous, base de connaissances |
| projets-collaboration / projects-collaboration | « Vos projets visibles, vos équipes alignées » | Gestion de projets, tâches, collaboration, temps |
| tableaux-de-bord-donnees / dashboards-data | « Vos chiffres à jour, sans monter un seul rapport à la main » | Tableaux de bord, BI, pipelines de données, nettoyage, migration, rapports |
| ia-appliquee / applied-ai | « L'IA qui trie, résume et prépare, pendant que vous décidez » | Agents, assistants, analyse de documents, tri des demandes entrantes |
| automatisation-ti-msp / msp-it-automation | « Vos billets récurrents, résolus par script » | Orchestration, documentation automatique, provisionnement, facturation du temps |

Gabarit de chaque page : H1 → « Ce qui coince » (3 douleurs) → « Ce qu'on met en place » (4-6 capacités en langage d'affaires) → `FlowLine` (secteur le plus proche) → « Comment ça se passe » (`Steps`) → 1 `CaseCard` lié → `FAQ` (4 questions, balisage FAQPage) → CTA diagnostic. Phrase commune sur chaque page : « Le fil conducteur : des flux automatisés et des intégrations entre vos applications. »

### 5.3 Secteurs (3 pages au lancement)
- `evenementiel-associations / events-associations` — H1 « Vos congrès, de l'inscription au sondage, sans ressaisie ». `FlowLine` événementiel. Capacités : événements, CRM, facturation, marketing, sondages.
- `services-professionnels / professional-services` — H1 « De la demande au paiement, un seul flux ». `FlowLine` services-pros. Capacités : CRM/devis, projets, facturation, tableaux de bord, IA.
- `cliniques / clinics` — H1 « Rendez-vous, dossiers, facturation et rappels, reliés et documentés ». `FlowLine` clinique. Encadré : « Ce site ne collecte aucun renseignement de santé. Nos mandats en clinique sont encadrés par écrit, dans le respect de la Loi 25 et du cadre applicable aux renseignements de santé. »

Gabarit : H1 → « Les réalités du secteur » (3 phrases) → `FlowLine` → capacités avec liens vers Services → `CaseCard` du secteur → encadré conformité → `BeforeAfter` (§8) → CTA.

### 5.4 `/diagnostic/`
H1 « Le diagnostic opérationnel ameb ». Sous-titre « Un prix fixe, une cartographie claire, un plan priorisé. » Bloc prix : « Prix fixe : [PRIX À CONFIRMER] $ » · « Crédité à 100 % si vous lancez l'implantation dans les 60 jours [À CONFIRMER] ». Livrables (4 cartes) : cartographie de vos processus; liste des irritants chiffrés; plan d'automatisation priorisé; choix d'outils recommandés, agnostique. Durée : `[À CONFIRMER]`. Encadré financement : « Potentiellement admissible au programme ESSOR (volet 1B) d'Investissement Québec. On vérifie votre admissibilité avec vous. [modalités À CONFIRMER] » `ContactForm` (nom, courriel, organisation, « Décrivez en une phrase ce qui vous fait perdre le plus de temps »). `FAQ` 4 questions.

### 5.5 `/outils/calculateur-ressaisie/` — `Calculator`
Entrées : employés touchés (1-200), heures par semaine par employé (0-20, pas 0,5), coût horaire chargé (défaut 45 $, modifiable). Résultat : coût annuel = employés × heures × 48 × coût horaire, format `fr-CA` (`Intl.NumberFormat`), libellé « Estimation annuelle du temps consacré à la ressaisie et à la recherche d'information ». Aucune promesse d'économie. État de l'URL (paramètres GET) pour partage. Résultat dans une région `aria-live="polite"`. Sans JS : formulaire GET + affichage de la formule en texte. Option « Recevoir le détail par courriel » : case **non cochée** + lien politique + envoi au webhook.

### 5.6 `/outils/autoevaluation/` — `Quiz`
10 questions (0-3) depuis `src/data/quiz.json` : données clients centralisées; facturation; relances; rapports; intégrations entre applications; documentation des processus; gestion des demandes entrantes; usage de l'IA; accès et sécurité; dépendance à Excel. Profils : 0-10 « En silo », 11-20 « En transition », 21-30 « Prêt pour le pilote automatique », chacun avec 3 recommandations. Résultat affiché sans courriel; barre de progression; navigation clavier.

### 5.7 Autres pages
- `/realisations/` : liste des cas + pages individuelles. Gabarit de cas : Secteur et taille (fourchette) → Avant (3 frictions) → Système mis en place (capacités, sans marque) → Résultats (`[À CONFIRMER]` ×2) → Délai `[À CONFIRMER]` → « Cas anonymisé à la demande du client ». Créer 3 cas : association/congrès, firme de services professionnels, clinique.
- `/approche/` : les 4 étapes détaillées + « Agnostiques, par principe » + « Ce que vous recevez » (documentation, formation, surveillance).
- `/confiance/` : engagements §11, section « Renseignements de santé », « Responsable de la protection des renseignements personnels : [NOM, COURRIEL À CONFIRMER] », `BeforeAfter`.
- `/a-propos/` : fondateur `[NOM, PHOTO, PARCOURS À CONFIRMER]`, expérience terrain (événementiel, TI gérées, cliniques), Montréal, nom légal « Services AMEB inc. ».
- `/ressources/` : liste du blogue + gabarit `Article` (JSON-LD Article). Créer 2 articles : « Sortir d'Excel : par où commencer » et « Loi 25 et automatisation : ce que votre PME doit savoir » (contenu factuel, sans chiffres non sourcés).
- `/contact/` : courriel, téléphone, adresse `[À CONFIRMER]`, `ContactForm`, lien rendez-vous.
- `/confidentialite/`, `/accessibilite/`, `/mentions-legales/` : gabarits clairs en langage simple, marqués `[À CONFIRMER — relecture juridique]`.
- `/styleguide/` : tous les composants et jetons; `noindex`.

## 6. Animation A — `SectionSilo.astro` (accueil)
- Desktop (≥ 1024 px) : section `height: 400vh`, enfant `position: sticky; top: 0; height: 100vh`, grille texte (gauche, 4 blocs) / scène (droite). `view-timeline: --silo block` sur la section.
- SVG inline `viewBox="0 0 1200 720"`, `role="img" aria-labelledby="silo-desc"`, `<desc>`; conteneur `aspect-ratio: 5/3`. Groupes : `#islands` (6 `<rect rx="12">` : ventes, finances, service, opérations, marketing, direction), `#noise` (tableurs, enveloppes, fiches en double, horloge, alertes `--alert`), `#links` (6 `<path pathLength="1">` en `--jade-600`), `#hub` (« Données unifiées »), `#dashboard` (4 tuiles KPI), `#ai` (badge + 3 jetons), `#alert`, `#tokens` (5 `<circle r="5">`). **Aucun `<text>` dans le SVG** : libellés en HTML positionné (`src/i18n/ui.ts`).
- Scènes (`animation-range` sur `contain`) : 1 « Le silo » 0-25 % · 2 « La friction » 25-45 % · 3 « La connexion » 45-75 % · 4 « Le pilote automatique » 75-100 %. Détail des mouvements : §5.3 du plan. Propriétés animées : `opacity`, `transform`, `stroke-dashoffset`, `fill` (îlots `--slate-600` → `--jade-600`) uniquement. Déclarer `animation-timeline` **après** le raccourci `animation`; `animation-duration: 1ms` (Firefox).
- Textes de scène (HTML visible, un par bloc) : 1 « Six équipes. Six outils. La même information tapée quatre fois. » · 2 « Les demandes se perdent entre deux boîtes de réception. Les délais s'allongent. » · 3 « On relie vos outils. Une seule source de vérité. Des flux qui roulent seuls. » · 4 « Vos opérations, en pilote automatique. » + bouton « Réserver mon diagnostic ».
- Boucle des jetons en scène 4 (2,4 s, ≤ 6 simultanés) : **bouton « Mettre en pause l'animation »** visible, accessible au clavier, qui arrête aussi toute animation de la page (`data-motion="paused"` sur `<html>`).
- Sous la scène : `<ol>` visible des 4 étapes (texte).
- Dégradations : `@media (prefers-reduced-motion: reduce)`, `@supports not (animation-timeline: view())` et < 1024 px → pas de sticky; 4 cartes empilées (texte + mini-scène figée à l'état final de chaque scène), révélation `view()` simple si supportée et mouvement autorisé.
- Interdits : prise de contrôle du défilement, écouteur `scroll`, bibliothèque d'animation. GSAP (core + ScrollTrigger ≤ 50 Ko) uniquement si un défaut bloquant est documenté dans `docs/decisions/`, chargé dynamiquement sur l'accueil seulement.
- Budget : SVG + CSS de la scène ≤ 10 Ko gzip; 0 Ko de JS obligatoire; CLS = 0.

## 7. Concept B — `FlowLine.astro` (données `src/data/flows/*.json`, libellés FR/EN)
| Secteur | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| evenementiel | Inscription en ligne | Fiche participant | Facture et paiement | Rappels automatiques | Sondage post-événement |
| clinique | Prise de rendez-vous | Dossier créé | Facturation | Rappels | Suivi post-visite |
| msp | Billet de soutien | Script automatisé | Documentation à jour | Temps facturé | Rapport client |
| services-pros | Demande entrante | Tri par IA | Devis | Projet | Facture |

Comportement : à l'entrée dans la vue (IntersectionObserver, une seule fois), un point `--jade-600` parcourt la ligne en **4 s** (`offset-path` si supporté, sinon `transform` sur segments; tester et documenter); chaque nœud passe `--slate-600` → `--jade-600` (200 ms `--ease-out`); étiquettes finales « 0 ressaisie » et « 2 s au lieu de 2 jours ». Bouton « Rejouer ». Onglets de secteur optionnels (prop `tabs`). Mouvement réduit : tous les nœuds allumés, aucune animation. Mobile : vertical.

## 8. Concept C — `BeforeAfter.astro`
`<button aria-pressed="false">` « Avant / Avec ameb » bascule une classe sur le schéma (mêmes nœuds : dispersés et ardoise ↔ alignés et jade, liens tracés, tableau de bord visible). Bascule enveloppée dans `document.startViewTransition()` si disponible, sinon instantanée. Déplacements en FLIP via Web Animations API, 450 ms `--ease-out`. Mouvement réduit : fondu seulement.

## 9. Microinteractions (`motion.css`)
- Bouton : `background` `--jade-900` → `--jade-700`, `--dur-fast`; actif `translateY(1px)`.
- Focus : `:focus-visible { outline: 2px solid var(--jade-600); outline-offset: 2px }` partout; jamais `outline: none` sans remplacement.
- Lien : soulignement `scaleX` 0 → 1 depuis la gauche, 200 ms.
- Carte : ombre `--shadow-1` et bordure `--jade-100` au survol, `--dur-base`; aucune translation.
- Révélations : `opacity` 0 → 1 + `translateY(16px)`, `animation-timeline: view()`, `animation-range: entry 0% entry 60%`, sous `@supports` et `prefers-reduced-motion: no-preference`; **jamais sur le H1 ni le sous-titre du hero**.
- `Steps` : ligne tracée au défilement (`cover 0% 80%`).
- `FAQ` : `<details>` natif, chevron `rotate(90deg)` 200 ms; pas d'animation de hauteur.
- Formulaire : validation à `blur`; erreur glisse de 4 px + fondu 150 ms; succès : icône check + texte + point jade `scale` 0 → 1 (200 ms).
- Transitions de page : `@view-transition { navigation: auto; }`, 250 ms; `view-transition-name` sur `Header` et `Logo`.
- Compteurs : interdits (chiffres non confirmés).
- `@media (prefers-reduced-motion: reduce)` : toutes les animations et transitions à `none`; états finaux affichés. `html[data-motion="paused"]` : idem.
- Aucun `will-change` permanent; aucune parallaxe; aucune boucle > 5 s sans bouton pause.

## 10. i18n et SEO
- `<html lang="fr-CA">` / `"en-CA"`; `lang` sur les passages dans l'autre langue.
- `LangSwitch` renvoie toujours vers la page équivalente (table `routes.ts`), jamais vers l'accueil.
- `<link rel="alternate" hreflang="fr-CA">`, `"en-CA"`, `"x-default"` (→ FR); `canonical` par page; `og:locale` `fr_CA` / `en_CA`; images OG FR et EN.
- JSON-LD : `Organization` + `ProfessionalService` (`areaServed`: Québec; adresse `[À CONFIRMER]`), `Service` sur chaque page Services, `FAQPage`, `BreadcrumbList`, `Article` (blogue).
- `@astrojs/sitemap` avec i18n; `robots.txt` : tout autorisé sauf `/api/` et `/styleguide/`.
- `title` ≤ 60 caractères, `meta description` ≤ 155, un H1 par page, hiérarchie sans saut.

## 11. Conformité
- **Loi 96** : FR par défaut et complet à la racine; EN sous `/en/` au plus équivalent; sélecteur de langue sur chaque page; courriels automatiques en FR (EN si la page source est EN); nom légal « Services AMEB inc. » dans le pied de page.
- **Loi 25** : aucun témoin non essentiel; aucune ressource tierce sauf Turnstile (pages avec formulaire) et analytics sans témoins; aucune bannière tant qu'aucun traceur identifiant n'est ajouté (`[À CONFIRMER — juriste]`); case de consentement **non cochée** pour tout envoi optionnel, avec finalité indiquée; lien vers `/confidentialite/` sous chaque formulaire; RPRP (titre, nom, courriel) dans le pied de page et sur `/confiance/`; formulaires de 4 champs maximum; Turnstile et l'hébergement Cloudflare mentionnés dans la politique de confidentialité.
- **Messages de confiance** (à utiliser tels quels) : « Vos données restent à vous : accès, exportations et documentation vous sont remis à la fin de chaque mandat. » · « Comptes nominatifs, moindre privilège, accès retirés en fin de mandat. » · « On identifie avec vous où vos données sont hébergées avant toute mise en place. » · « Entente de confidentialité signée avant tout accès à vos systèmes. » **Interdits** : « garanti », « certifié », « 100 % », « vos données ne quittent jamais le Canada », « conforme à la Loi 25 » (écrire « dans le respect de »).
- **WCAG 2.2 AA** : lien d'évitement; landmarks; `scroll-padding-top: 80px` (focus jamais masqué par l'en-tête collant); cibles ≥ 24×24 px (boutons 48 px); `label` + `autocomplete` + `aria-describedby` sur les erreurs; aucune information portée par la couleur seule; `aria-live="polite"` pour les résultats; menu mobile en `<dialog>` avec gestion du focus; contraste vérifié.

## 12. Analytics (événements, sans témoins)
`cta_diagnostic` (prop `placement`) · `form_diagnostic_submit` (après 200) · `booking_click` · `calc_complete` · `quiz_complete` (prop `profil`) · `report_request` · `lang_switch` · `case_view` · `tel_click` · `email_click`. Implémentés via un petit module `src/lib/track.ts` qui ne fait rien si `PUBLIC_ANALYTICS_SRC` est vide.

## 13. Performance (bloquant en CI)
Lighthouse mobile ≥ 95 (performance, accessibilité, bonnes pratiques, SEO) sur `/`, `/services/ventes-crm/`, `/secteurs/evenementiel-associations/`, `/diagnostic/` et leurs équivalents EN. Budgets par page : HTML ≤ 50 Ko, CSS ≤ 30 Ko, JS ≤ 20 Ko (hors repli GSAP), polices ≤ 100 Ko, image LCP ≤ 120 Ko AVIF, scène SVG ≤ 10 Ko gzip. CLS ≤ 0,05. Le H1 texte est l'élément LCP (jamais à opacité 0). Préchargement de Sora 600. Îlots (`Calculator`, `Quiz`, scripts de `FlowLine`/`BeforeAfter`) chargés avec `client:visible` ou en `<script type="module">` différé.

## 14. `CLAUDE.md` (< 80 lignes), hooks et CI
**CLAUDE.md** doit contenir : les commandes (`npm run dev | build | check | lint | test | test:a11y | test:lh`); les règles §1 en 7 lignes; « une tâche = une branche = une PR, décrite dans `docs/taches/NNN-titre.md` (objectif, fichiers, critères d'acceptation, commandes de vérification) »; « lance `npm run check && npm test` avant de déclarer une tâche terminée »; « jetons uniquement via `var(--…)` »; « aucune nouvelle dépendance sans justification dans la PR »; « toute décision d'architecture → `docs/decisions/ADR-NNN.md` (10 lignes) »; « toute correction humaine devient une règle ici ou un test »; pointeur vers `docs/brief.md` et `docs/plan-implementation.md`.

**Hooks** (`.claude/settings.json`) : `PostToolUse` sur `Edit|Write` → `npm run lint --silent`; hook de pré-commit (husky ou script) → `node scripts/check-content.ts && node scripts/check-parity.ts`.

**CI** (`.github/workflows/ci.yml`, sur chaque PR) : `npm ci` → `astro check` → `eslint` + `stylelint` → `scripts/check-content.ts` (échec si `/zoho/i` ou un terme de `docs/interdits.txt` apparaît dans `src/` ou `public/`) → `scripts/check-parity.ts` (chaque fichier `fr` a son pendant `en` avec le même nombre et le même ordre de H2) → `astro build` → `html-validate` → vérificateur de liens internes → Playwright : `a11y.spec` (axe : 0 violation serious/critical sur chaque URL du sitemap), `privacy.spec` (premier chargement : 0 témoin, 0 requête hors domaines autorisés : site, analytics, Turnstile sur pages formulaire), `forms.spec` (validation, erreurs, succès simulé avec webhook mocké), `i18n.spec` (hreflang, `lang`, LangSwitch → page équivalente), `reduced-motion.spec` (`emulateMedia({reducedMotion:'reduce'})` → aucun élément avec `animation-name` ≠ `none`), `visual.spec` (captures de référence des 4 gabarits, desktop + mobile) → Pa11y CI → Lighthouse CI (assertions §13).

## 15. Ordre des tâches
001 Repo, Astro, TS strict, lint, CI minimale verte · 002 `tokens.css`, `base.css`, polices, `Logo`, favicon · 003 `Base.astro`, `Header`, `Footer`, `LangSwitch`, routes i18n · 004 `Button`, `Card`, `Steps`, `FAQ`, `/styleguide/` · 005 Content Collections + schémas zod · 006 `Seo`, sitemap, robots, OG · 007 Accueil statique (texte FR) · 008 `FlowLine` + JSON · 009 `SectionSilo` desktop · 010 `SectionSilo` mobile + reduced motion + pause · 011 `BeforeAfter` · 012-020 Services ×9 · 021-023 Secteurs ×3 · 024 `/diagnostic/` + `ContactForm` + `/api/contact` + Turnstile + webhook · 025 `Calculator` · 026 `Quiz` · 027 Réalisations, Approche, Confiance, À propos, Contact, légales · 028 Blogue + 2 articles · 029 EN complet + parité · 030 Tests complets, Lighthouse CI, Pa11y, liste de lancement.

## 16. Critères d'acceptation finaux
- Toutes les pages §5 existent en FR et en EN, accessibles en 2 clics depuis l'accueil; `LangSwitch` fonctionne sur chacune.
- CI verte (tous les contrôles §14) sur `main`.
- `SectionSilo` conforme à §6 sur Chrome, Safari et Firefox récents; état statique correct en mouvement réduit, sans support et sur mobile; bouton pause fonctionnel.
- `FlowLine` et `BeforeAfter` fonctionnels au clavier et au toucher.
- Formulaire : soumission reçue par le webhook n8n en préproduction; Turnstile vérifié côté serveur; réponses d'erreur en FR/EN.
- Lighthouse mobile ≥ 95 ×4 sur les 8 URL de §13; budgets respectés.
- Aucun « Zoho », aucun nom de client, aucun chiffre inventé; tous les `[À CONFIRMER]` listés dans `docs/a-confirmer.md` avec la page concernée.
- `docs/decisions/` contient au moins : choix d'Astro, choix CSS natif, technique d'animation, politique « sans bannière ».
