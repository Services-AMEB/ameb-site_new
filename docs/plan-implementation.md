# ameb — Plan d'implémentation du site web

> **Version 1.0 — 3 novembre 2026.** Document de référence pour le dépôt (`docs/plan-implementation.md`). Il synthétise la recherche concurrentielle, les meilleures pratiques 2025-2026, la marque ameb, le système de design, les animations, la pile technique, la méthode de développement avec Claude Code, la conformité et l'échéancier. Le brief de construction prêt à coller est dans un fichier séparé : `ameb-brief-claude-code.md`.
>
> Légende : **[Observé]** = constat sourcé (URL fournie). **[Recommandation]** = choix proposé. **[À CONFIRMER]** = donnée à valider par Houssam avant publication. Aucun chiffre de résultat client n'est inventé.

---

## 0. Les 10 décisions qui structurent tout

| # | Décision | Pourquoi (preuve) |
|---|---|---|
| 1 | **On vend des résultats opérationnels, jamais un logiciel.** Aucune marque d'éditeur dans le hero, le menu, les CTA ni le logo. | [Observé] NSI (« Expert Zoho… »), Nuagix (logo coassocié Nuagix + Zoho), Tooly (« expert Zoho premium ») mènent tous avec le produit. L'agnosticisme visible est l'angle mort n° 1. |
| 2 | **Une animation phare unique, en SVG + CSS piloté par le défilement**, 0 Ko de bibliothèque. GSAP en réserve seulement. | [Observé] Aucun site consulté ne raconte un vrai « avant en silo → après connecté ». Poids mesuré d'un prototype : 1,4 Ko gzip. Support natif Chrome/Edge 115+, Safari 26+, Firefox 159+ (27 oct. 2026). |
| 3 | **Un aimant principal à prix affiché : le diagnostic opérationnel** à prix fixe [PRIX À CONFIRMER], présenté comme potentiellement admissible à ESSOR 1B. | [Observé] Aucun partenaire Zoho québécois n'affiche de prix de diagnostic. NN/g : les acheteurs quittent un site qui cache ses prix. ESSOR 1B : 50 % des dépenses admissibles, max 20 000 $, fin le 31 mars 2027 (investquebec.com). |
| 4 | **Deux aimants secondaires sans courriel** : calculateur du coût de la ressaisie et autoévaluation en 10 questions. | [Observé] Rapport Navattic 2025 : ~70 % des meilleures démos interactives ne commencent pas par un formulaire. Aucun concurrent québécois n'a d'outil interactif fonctionnel. |
| 5 | **Trois secteurs au lancement** : événementiel et associations, services professionnels, cliniques. MSP en vague 2. | Expérience terrain d'AMEB; l'événementiel est absent des menus de NSI et Nuagix; cliniques = angle confiance différenciant. |
| 6 | **Preuve sans clients nommés** selon un gabarit fixe (secteur, taille, friction, système, résultat [À CONFIRMER]). | Style BCG/McKinsey. Règle anti-réidentification propre au petit marché québécois : jamais ville + taille exacte + événement nommé. |
| 7 | **Design « cabinet-conseil moderne »** : surface claire, jade comme seule couleur d'action, Sora + Inter, schémas de systèmes au lieu de photos de banque. | [Observé] La concurrence est soit gabarit WordPress, soit ludique (Tooly, personnages 3D). Les marqueurs de gabarit 2026 : fond sombre + cyan/violet, dégradé maillé, glassmorphism. |
| 8 | **Astro + Cloudflare, construit par Claude Code** dans un repo GitHub avec CI bloquante. | Tout est texte et diffable; ~0 Ko de JS par défaut; Astro 6 stable depuis mars 2026 (MIT, équipe chez Cloudflare depuis janv. 2026). Vercel Hobby interdit l'usage commercial; Netlify gratuit limité par crédits. |
| 9 | **Conformité intégrée au code** : français à la racine, anglais sous `/en/` avec parité vérifiée en CI (Loi 96); aucun traceur par défaut (Loi 25, art. 8.1); WCAG 2.2 AA testé en CI. | [Observé] Amende de 3 000 $ (Cour du Québec, 2025) pour un site non traduit. Loi 25 : refus aussi simple que l'acceptation (CAI). |
| 10 | **Mesure sans témoins dès le jour 1**, événements de conversion nommés, test A/B du hero après 90 jours. | Plausible ou Umami; aucune bannière si aucun traceur identifiant. |

---

## 1. Identité et image de marque ameb

### 1.1 Le mot-symbole

**Ce qui existe (à respecter)** : « ameb » en minuscules, Sora SemiBold (600), suivi d'un point rond en jade. Le mot est en jade profond, le point en jade. Le logo fourni (`ameb-logo.png`) montre ce rapport : mot sombre, point clair, point centré sur la hauteur d'x, décollé du « b ».

**Construction normalisée** [Recommandation] — à reproduire tel quel dans `Logo.astro` (SVG inline) :

| Paramètre | Valeur |
|---|---|
| Police | Sora 600, approche (letter-spacing) −0,01 em |
| Couleur du mot | `#0F5E4E` (jade profond) sur fond clair; `#FFFFFF` sur fond jade profond |
| Point d'accent | Cercle plein `#1B8E6B`, diamètre = 0,34 × hauteur d'x, centré verticalement sur la hauteur d'x, espacé du « b » de 0,22 × hauteur d'x |
| Zone de protection | Hauteur du « a » tout autour (aucun élément ne peut y entrer) |
| Taille minimale | 24 px de hauteur de x à l'écran; 8 mm en impression |
| Variantes | (1) jade profond sur clair; (2) blanc + point jade sur jade profond; (3) monochrome noir pour documents; (4) **symbole seul** : le point jade dans un carré arrondi jade profond, pour favicon, avatar, icône d'app |
| Interdits | Déformer, incliner, ajouter une ombre ou un dégradé, mettre une majuscule, changer la couleur du point, placer sur une photo chargée, réduire sous la taille minimale |

Le **point** est la signature de la marque : c'est le « jeton » qui circule dans les animations (section 5). Chaque fois qu'un élément s'allume, se termine ou se connecte, c'est ce point qui apparaît. Un seul motif visuel, répété partout : c'est ce qui fait reconnaître la marque sans logo.

### 1.2 Système de couleurs

Les trois couleurs de marque sont conservées intégralement. Le système ajoute des nuances **dérivées**, nécessaires pour les états, les fonds et les contrastes WCAG. Ratios calculés en novembre 2026 (formule WCAG 2.x).

**Couleurs de marque (inchangées)**

| Jeton | Hex | Rôle | Contraste vérifié |
|---|---|---|---|
| `--jade-900` jade profond | `#0F5E4E` | Mot-symbole, titres d'accent, liens, boutons primaires, fonds de sections fortes | 7,69:1 sur blanc ✔ AAA; blanc dessus 7,69:1 ✔ |
| `--jade-600` jade | `#1B8E6B` | Point d'accent, focus, tracés SVG, icônes, grands titres, états « connecté » | **4,1:1 sur blanc : interdit pour le texte courant** (< 4,5). OK pour grand texte (≥ 24 px ou 18,66 px gras), icônes et contours (≥ 3:1) |
| `--slate-600` ardoise | `#5A7184` | Texte secondaire, légendes, îlots « silo », traits neutres | 5,08:1 sur blanc ✔ AA; 4,72:1 sur `#F4F7F6` ✔ |

**Compléments proposés** [Recommandation]

| Jeton | Hex | Rôle | Contraste |
|---|---|---|---|
| `--jade-700` | `#16745C` | Fond de bouton primaire au **survol** et bouton avec texte blanc en petite taille | Blanc dessus 5,7:1 ✔ AA |
| `--jade-100` | `#DCEFE7` | Fond de badge, surlignage, cellule « après » | Jade profond dessus 6,42:1 ✔ |
| `--jade-050` | `#EEF6F3` | Fond de section alternée (très léger) | — |
| `--slate-800` encre | `#10201C` | Texte courant (noir verdi, jamais noir pur) | 16,86:1 ✔ |
| `--slate-700` | `#3E5160` | Texte de paragraphe secondaire sur fond clair | 8,23:1 ✔ |
| `--surface` | `#F4F7F6` | Fond de carte et de section | — |
| `--line` | `#DDE5E2` | Bordures, séparateurs, grille des schémas | — |
| `--bg` | `#FFFFFF` | Fond de page | — |
| `--alert` | `#B4413A` | **Décoratif seulement**, dans la scène « silo » (erreurs, retards). Jamais pour un message d'erreur de formulaire seul (toujours icône + texte) | — |
| `--ok` | `#1B8E6B` | État de succès (même jade, avec icône) | — |

**Règles d'usage**
- Une seule couleur d'action : le jade. Tout ce qui est cliquable est jade ou jade profond; rien d'autre n'est jade.
- Surface claire par défaut. Le jade profond en aplat est réservé à trois endroits : bandeau du diagnostic, CTA final, pied de page. C'est ce qui donne le rythme « cabinet-conseil » plutôt que « SaaS sombre ».
- Proportion visuelle cible par page : 80 % blanc et surfaces, 12 % encre et ardoise, 6 % jade profond, 2 % jade. Le jade est rare, donc précieux.
- Mode sombre : non prioritaire. Si ajouté plus tard, inverser `--bg` → `#0B1613`, texte → `#E9F1EE`, et garder le point `#1B8E6B` (4,12:1 sur `#10201C`, OK pour les grands éléments).

### 1.3 Typographie

| Usage | Police | Graisses | Taille (desktop → mobile) |
|---|---|---|---|
| Mot-symbole, H1, H2 | **Sora** | 600, 700 | H1 `clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem)` (36 → 56 px); H2 1,75-2,25 rem |
| H3, boutons, étiquettes de schéma | Sora | 600 | 1,125-1,25 rem |
| Texte courant, formulaires, FAQ | **Inter** (ou Inter Tight pour les tableaux) | 400, 500, 600 | 1,0625-1,125 rem (17-18 px), interligne 1,6 |
| Chiffres de preuve | Sora 700, `font-variant-numeric: tabular-nums` | — | 2,5-3,25 rem |

- Auto-hébergées en WOFF2 (licence OFL), sous-ensemble latin + latin étendu (accents français), `font-display: swap`, préchargement de Sora 600 uniquement.
- Jamais plus de deux familles. Jamais de mot en police de code dans un titre (marqueur de gabarit 2026).
- Typographie française : espaces insécables avant « : ; ? ! » et à l'intérieur des guillemets « », nombres « 3 000 $ », « courriel », « témoins », « infolettre ». Titres en **phrase** (pas de majuscules à chaque mot).
- Approche −0,02 em sur les H1 seulement; 0 ailleurs. Leçon Linear : tester le H1 sur un iPhone, maximum 3 lignes.

### 1.4 Style visuel

**Trois familles de visuels, et rien d'autre** [Recommandation] :
1. **Schémas de systèmes** sur mesure (SVG) : nœuds, liens, jetons, tuiles. Toujours en ardoise pour « avant » et jade pour « après ». C'est le visuel signature.
2. **Interfaces stylisées** avec données fictives (tableau de bord, journal de flux, fiche client) — dessinées en HTML/CSS, pas des captures réelles (Loi 25, et agnosticisme : aucune interface d'éditeur reconnaissable).
3. **Portrait professionnel du fondateur** et photos de séances de travail réelles. [Observé] NN/g : les utilisateurs ignorent les photos de banque mais regardent les vraies personnes.

**Interdits** : photos de banque, illustrations 3D ludiques, dégradés maillés, grain décoratif, glassmorphism, rangée de logos grisés, emojis dans l'interface, carrousels automatiques.

**Iconographie** : Lucide (SVG inline), trait 1,75 px, 20-24 px, couleur héritée. Les icônes métier des schémas (tableur, enveloppe, horloge, fiche) sont dessinées une fois dans un sprite SVG maison, même trait.

**Grille et espacement** : conteneur 1 200 px max, 12 colonnes, gouttière 24 px; échelle d'espacement 4-8-12-16-24-32-48-64-96-128; sections de 96 px (desktop) et 64 px (mobile) de respiration verticale; rayons 6 px (boutons), 12 px (cartes), 16 px (hub de schéma). Ombres : une seule, très douce, `0 1px 2px rgb(16 32 28 / .06), 0 8px 24px rgb(16 32 28 / .06)`.

### 1.5 Voix et ton

- Vouvoiement sur tout le site ([Observé] 53 des 54 agences d'automatisation montréalaises recensées vouvoient).
- Phrases courtes, verbes d'action, vocabulaire des opérations (« ressaisie », « relance », « devis », « dossier »), jamais de jargon d'éditeur ni d'anglicismes (« workflow » → « flux », « lead » → « prospect », « dashboard » → « tableau de bord »).
- On nomme la douleur avant la solution. On chiffre quand on peut; sinon on dit « estimation ».
- Aucune promesse absolue (« garanti », « 100 % », « conforme à la Loi 25 ») : on écrit « dans le respect de », « documenté », « vérifiable ».
- Signature : « Vos opérations, en pilote automatique. » conservée. [Observé] FLO (Montréal) utilise « Ta PME sur Autopilote » (hellodarwin.com/fr/agences/flo) : formulation différente, mais faire vérifier l'antériorité des deux slogans au registre des marques [À CONFIRMER].

### 1.6 Mouvement de marque (« motion identity »)

Le mouvement d'ameb a une seule idée : **des choses séparées qui se relient, puis qui roulent toutes seules**. Trois gestes :
1. **Le tracé** : une ligne jade qui se dessine entre deux éléments (`stroke-dashoffset`).
2. **Le jeton** : le point de la marque qui parcourt un lien et allume le nœud suivant (ardoise → jade, 200 ms).
3. **L'assemblage** : des tuiles qui se mettent en place (translateY 16 px + fondu, 400 ms), jamais depuis très loin, jamais en rebond.

Courbe unique : `cubic-bezier(0.2, 0, 0, 1)` (sortie rapide, arrivée douce). Durées : 150 ms (micro), 250 ms (base), 450 ms (entrée de section). Aucun rebond, aucune élasticité, aucune boucle rapide, aucune parallaxe.

---

## 2. Stratégie en bref

### 2.1 Ce que la concurrence fait, et ce qu'elle ne fait pas

| Constat [Observé] | Source | Conséquence pour ameb |
|---|---|---|
| Les partenaires Zoho québécois mènent tous avec le produit; aucun n'affiche de prix de diagnostic | nsisolution.com, nuagix.ca, tooly.ca | Mener avec les opérations; afficher le prix du diagnostic |
| Nuagix affiche « 149 $/h, en production en 3 à 5 semaines » et un SEO local massif (pages par ville) | nuagix.ca/consultant-zoho-brossard/ | Chiffrer le délai de mise en production [À CONFIRMER]; SEO local ciblé (Montréal, Laval, Rive-Sud) sans pages-doublons |
| Tooly nomme la douleur (« double saisie, informations perdues, aucune vue d'ensemble ») puis vend l'outil; ton ludique, 3D | tooly.ca | Nommer la même douleur, puis **montrer** le système en mouvement, en registre sobre |
| Liboiron (Montréal) publie 11 cas nommés et chiffrés; Wrkflos publie ses prix (dès 500 $) et vise les cliniques | première passe de recherche | La preuve chiffrée est attendue : d'où le gabarit de cas anonymisé avec résultats réels [À CONFIRMER] |
| Aucun concurrent n'a d'outil interactif fonctionnel ni de page événementiel/MSP | première passe + report | Calculateur, autoévaluation, pages secteurs |
| 2 % des pages d'accueil B2B chiffrent le coût du statu quo; 68 % n'ont aucune preuve au premier écran | signalscore.pages.dev/report/ (2026) | Coût de la ressaisie dans le hero ou juste dessous; preuve dès le premier écran |
| 87 % des fournisseurs retenus le sont par recommandation; 64 % des acheteurs jugent les sites indistinguables | wynter.com (juin 2026) | Le site sert à **confirmer** un choix : clarté, prix, preuve, méthode |

### 2.2 Niches et ordre de déploiement

1. **Événementiel, congrès, associations** (lancement) — flux complet démontrable, créneau libre.
2. **Services professionnels** (lancement) — grand bassin, douleurs devis/facturation/suivi.
3. **Cliniques privées** (lancement) — angle confiance; encadré Loi 25 et renseignements de santé; validation juridique de la Loi 5 [À CONFIRMER].
4. **MSP / TI gérées** (vague 2, 60-90 jours) — plutôt canal partenaire.
5. **OBNL, construction** (vague 3) — articles de blogue d'abord.

### 2.3 Appels à l'action et aimants

| Niveau | Libellé | Destination | Règle |
|---|---|---|---|
| Primaire (unique, répété) | **Réserver mon diagnostic** | `/diagnostic/` | Bouton jade profond, présent dans l'en-tête, le hero, chaque fin de page |
| Secondaire | **Calculer mon coût de ressaisie** | `/outils/calculateur-ressaisie/` | Bouton contour; résultat sans courriel |
| Tertiaire | **Faire l'autoévaluation (3 min)** | `/outils/autoevaluation/` | Lien en fin d'article et de page Secteur |
| Contact direct | « Écrivez-nous » / téléphone | `/contact/` | Jamais le CTA principal |
| Rapport PDF | Après le calculateur ou le quiz, **optionnel**, case de consentement non cochée | Webhook n8n → envoi | Loi 25 : consentement explicite, finalité indiquée |

Financement : formulation sûre « On vérifie votre admissibilité » — jamais « projet subventionné ». [Observé] ESSOR 1B : 50 %, max 20 000 $, fin 31 mars 2027, services professionnels et santé « non priorisés » depuis mars 2026; IRIA (DEC) ouvert jusqu'en 2031 (voir notes de recherche).

---

## 3. Architecture et contenu

### 3.1 Arborescence (2 clics maximum depuis l'accueil)

```
/                                  Accueil
/services/                         Vue d'ensemble par fonction
  /services/ventes-crm/
  /services/facturation-paiements/
  /services/marketing-automatise/
  /services/evenements/
  /services/service-client/
  /services/projets-collaboration/
  /services/tableaux-de-bord-donnees/
  /services/ia-appliquee/
  /services/automatisation-ti-msp/
/secteurs/
  /secteurs/evenementiel-associations/
  /secteurs/services-professionnels/
  /secteurs/cliniques/
  /secteurs/msp/                   (vague 2)
/diagnostic/                       Offre d'entrée, prix, financement
/outils/calculateur-ressaisie/
/outils/autoevaluation/
/realisations/                     Cas anonymisés (liste + pages)
/approche/                         Méthode en 4 étapes, agnosticisme
/confiance/                        Sécurité, Loi 25, santé, RPRP
/a-propos/
/ressources/                       Blogue (liste + articles)
/contact/
/confidentialite/  /accessibilite/  /mentions-legales/
/en/…                              Miroir complet, slugs anglais
```

Les 12 capacités du mandat sont couvertes par 9 pages Services : formulaires et prise de rendez-vous → Ventes et Service client; données (pipelines, nettoyage, migration) → Tableaux de bord et données; « automatisation de flux et intégrations » = fil commun, expliqué sur `/approche/` et présent dans chaque page.

### 3.2 Page d'accueil, section par section

| # | Section | Contenu | Visuel |
|---|---|---|---|
| 1 | Hero | H1 + sous-titre + CTA primaire + CTA secondaire + micro-preuve (« Fondée à Montréal · Expérience en événementiel, TI gérées et cliniques ») | Concept B (chaîne de 5 nœuds, 4 s, lecture unique) à droite du H1; H1 visible immédiatement (LCP) |
| 2 | Animation phare | Concept A, 4 scènes au défilement | SVG sticky |
| 3 | « Ça vous dit quelque chose? » | 4 cartes de douleur | Icônes maison |
| 4 | Coût du statu quo | « Une personne qui ressaisit 5 h par semaine coûte environ [X] $ par année. » + lien calculateur | Chiffre Sora 700 |
| 5 | Ce qu'on automatise | 9 cartes → pages Services | Icône + 1 phrase |
| 6 | Par secteur | 3 cartes → pages Secteurs | Mini-FlowLine statique |
| 7 | Notre approche | 4 étapes : Diagnostic → Plan → Mise en place → Pilote automatique | Ligne jade tracée |
| 8 | Agnostiques, par principe | « On ne revend pas de logiciel. On part de vos processus… » | Texte + schéma « vos outils actuels + nouveaux » |
| 9 | Réalisations | 3 cas anonymisés (résultats [À CONFIRMER]) | CaseCard |
| 10 | Confiance | 3 engagements + lien `/confiance/` | Icônes |
| 11 | CTA final (fond jade profond) | « Prêt à arrêter la ressaisie? » + bouton + « Aucun jargon. Aucune pression. » | — |

### 3.3 Cinq titres de hero (français québécois)

1. **Vos opérations, en pilote automatique.** — « On relie vos outils, on automatise ce qui se répète et on vous donne une vue claire en temps réel, peu importe la plateforme. » *(lancement)*
2. **Arrêtez de taper la même information quatre fois.** — « Formulaires, CRM, facturation, rappels : on connecte vos systèmes pour que vos données circulent toutes seules. » *(variante A/B à 90 jours)*
3. **Moins de courriels perdus. Plus de temps pour vos clients.** — « Automatisation, IA et données au service des PME québécoises, livrées clé en main et documentées. »
4. **Votre entreprise roule déjà. On la fait rouler toute seule.** — « Un diagnostic à prix fixe, un plan clair, puis des flux automatisés qui travaillent pendant que vous dormez. »
5. **Des résultats opérationnels, pas un logiciel de plus.** — « On part de vos processus réels et on choisit les bons outils, jamais l'inverse. »

### 3.4 Gabarits de pages

**Page Services (par fonction)** : H1 orienté résultat → « Ce qui coince » (3 douleurs) → « Ce qu'on met en place » (4-6 capacités) → FlowLine (concept B) → « Comment ça se passe » (4 étapes) → cas anonymisé lié → FAQ (4 questions, balisage FAQPage) → CTA diagnostic.

**Page Secteur (par niche)** : H1 sectoriel → réalités du secteur (3 phrases) → FlowLine sectoriel → capacités pertinentes avec liens vers Services → cas anonymisé du secteur → encadré conformité (Loi 25; renseignements de santé pour les cliniques) → BeforeAfter (concept C) → CTA.

**Cas anonymisé** (gabarit fixe) : Secteur et taille (fourchette) → Avant (3 frictions observées) → Système mis en place (capacités, sans marque) → Résultats ([À CONFIRMER] ×2) → Délai [À CONFIRMER] → mention « Cas anonymisé à la demande du client ». Règle : approbation écrite du client même anonymisé; jamais ville + taille exacte + événement nommé.

**Page Diagnostic** : H1 « Le diagnostic opérationnel ameb » → prix fixe [PRIX À CONFIRMER] → ce qu'on livre (cartographie des processus, irritants chiffrés, plan priorisé, choix d'outils recommandés) → durée [À CONFIRMER] → « Crédité à 100 % si vous lancez l'implantation dans les 60 jours » [À CONFIRMER] → encadré financement (« potentiellement admissible à ESSOR volet 1B — on vérifie votre admissibilité ») → formulaire 4 champs → FAQ.

### 3.5 Outils interactifs

**Calculateur du coût de la ressaisie** : entrées = employés touchés (1-200), heures/semaine/employé (0-20), coût horaire chargé (défaut 45 $, modifiable). Sortie = employés × heures × 48 × coût horaire, format `fr-CA`, libellé « estimation annuelle ». Aucune promesse d'économie. Partageable par URL (paramètres GET). Rapport PDF optionnel contre courriel avec consentement.

**Autoévaluation (10 questions, 0-3)** : données clients centralisées; facturation; relances; rapports; intégrations; documentation; demandes entrantes; IA; accès et sécurité; dépendance à Excel. Profils : 0-10 « En silo », 11-20 « En transition », 21-30 « Prêt pour le pilote automatique ». Résultat affiché sans courriel, avec 3 recommandations par profil.

### 3.6 SEO : mots-clés et calendrier

[Observé] Aucun volume fiable n'a pu être obtenu sans compte Keyword Planner / Semrush / Ahrefs. **Mesurer en phase 0** (ciblage Québec, français) avant de figer les textes.

| Mot-clé | Intention | Page cible | Priorité |
|---|---|---|---|
| automatisation des processus | Info → commerciale | /services/ + blogue | Haute |
| automatisation PME | Commerciale | Accueil | Haute |
| intégration CRM / consultant CRM Montréal | Commerciale, locale | /services/ventes-crm/ | Haute |
| intelligence artificielle PME / agent IA entreprise | Info / commerciale | /services/ia-appliquee/ | Haute / Moyenne |
| logiciel gestion d'événements | Commerciale (concurrence éditeurs) | /secteurs/evenementiel-associations/ | Moyenne |
| tableau de bord PME / migration de données | Info / commerciale | /services/tableaux-de-bord-donnees/ | Moyenne |
| prise de rendez-vous en ligne clinique | Commerciale | /secteurs/cliniques/ | Moyenne |
| Loi 25 conformité PME | Informationnelle | Blogue + /confiance/ | Moyenne |
| subvention ESSOR diagnostic numérique | Transactionnelle | /diagnostic/ | Haute |
| Acomba CRM (intégration) | Commerciale de niche | Blogue technique | Basse (quasi aucun concurrent) |
| sortir d'Excel | Informationnelle | Blogue | Moyenne |
| automatisation TI MSP | Niche | /services/automatisation-ti-msp/ | Basse |

Calendrier de départ (1 article aux 2 semaines) : Sortir d'Excel → ESSOR 1B 2026-2027 → Loi 25 et automatisation → Automatiser un congrès de l'inscription au sondage → Tri des demandes par IA → 7 indicateurs d'un tableau de bord PME.

---

## 4. Système de design et méthode UI

### 4.1 Méthode : « design in code », avec Figma en appui

[Recommandation] Pour un fondateur solo avec Claude Code, le système de design vit **dans le code** (jetons CSS, composants Astro, page `/styleguide/` non indexée). Figma (plan gratuit) sert à trois choses seulement : composer l'accueil et une page Service avant de coder, dessiner le SVG de la scène phare, et produire les images OG. Toute décision de design finit dans `tokens.css` ou dans un composant; aucune maquette n'est la « source de vérité ».

Processus par écran :
1. **Contenu d'abord** : le texte FR de la page est écrit et relu avant toute mise en page (le design sert le message, pas l'inverse).
2. **Fil de fer en HTML** sur la page de styleguide (blocs gris, vrais textes).
3. **Mise en forme avec les jetons** uniquement (`var(--…)`); toute valeur « magique » est refusée en revue.
4. **Revue sur mobile réel** (iPhone + Android), au clavier et avec VoiceOver.
5. **Capture de référence** (Playwright) pour détecter les régressions visuelles.

### 4.2 Jetons (`src/styles/tokens.css`)

```css
:root {
  /* Marque */
  --jade-900: #0F5E4E;  --jade-700: #16745C;  --jade-600: #1B8E6B;
  --jade-100: #DCEFE7;  --jade-050: #EEF6F3;
  --slate-800: #10201C; --slate-700: #3E5160; --slate-600: #5A7184;
  --bg: #FFFFFF;        --surface: #F4F7F6;   --line: #DDE5E2;
  --alert: #B4413A;
  /* Sémantique */
  --color-text: var(--slate-800); --color-text-2: var(--slate-700); --color-muted: var(--slate-600);
  --color-link: var(--jade-900);  --color-action: var(--jade-900); --color-action-hover: var(--jade-700);
  --color-accent: var(--jade-600); --color-focus: var(--jade-600);
  /* Typo */
  --font-display: "Sora", system-ui, sans-serif; --font-body: "Inter", system-ui, sans-serif;
  --fs-sm: .875rem; --fs-base: 1.0625rem; --fs-lg: 1.25rem; --fs-xl: 1.5rem;
  --fs-2xl: 2rem; --fs-3xl: 2.5rem; --fs-h1: clamp(2.25rem, 1.5rem + 2.5vw, 3.5rem);
  --lh-body: 1.6; --lh-tight: 1.15;
  /* Espacement, rayons, ombres */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-6: 24px; --sp-8: 32px;
  --sp-12: 48px; --sp-16: 64px; --sp-24: 96px; --sp-32: 128px;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 16px;
  --shadow-1: 0 1px 2px rgb(16 32 28 / .06), 0 8px 24px rgb(16 32 28 / .06);
  /* Mouvement */
  --dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 450ms;
  --ease-out: cubic-bezier(.2, 0, 0, 1);
  /* Mise en page */
  --container: 1200px; --gutter: 24px;
}
```

Couches CSS : `@layer reset, tokens, base, layout, components, utilities, motion;`. Pas de framework client. Tailwind v4 est acceptable si Claude Code le préfère, à condition que **toutes** les couleurs passent par `@theme` avec ces mêmes valeurs.

### 4.3 Composants (bibliothèque minimale)

| Composant | Spécification |
|---|---|
| `Button` | Variantes `primary` (fond jade-900, texte blanc, survol jade-700), `secondary` (contour jade-900), `ghost`. Hauteur 48 px (44 px minimum), padding 0 24 px, Sora 600 1 rem, rayon 6 px. Focus visible 2 px jade-600 décalé de 2 px. Cible ≥ 24×24 px (WCAG 2.5.8) |
| `Header` | Logo, 5 entrées (Services, Secteurs, Diagnostic, Réalisations, À propos), LangSwitch, CTA. Collant, 64 px, fond blanc 92 % + flou léger. Menu mobile = `<dialog>` natif plein écran |
| `Footer` | Fond jade-900, texte blanc, 4 colonnes (Services, Secteurs, Entreprise, Légal), RPRP, adresse, mot-symbole blanc |
| `Hero` | Grille 7/5 : texte à gauche, FlowLine à droite; empilé sur mobile |
| `SectionSilo` | Concept A (section 5.3) |
| `FlowLine` | Concept B, données par secteur |
| `BeforeAfter` | Concept C, `<button aria-pressed>` + View Transition |
| `Card` / `CaseCard` | Fond surface, bordure line, rayon 12 px, titre Sora, pas d'ombre au repos, ombre-1 au survol (250 ms) |
| `Steps` | 4 étapes, ligne jade tracée au défilement |
| `FAQ` | `<details>`/`<summary>` natifs, icône qui pivote 90°, balisage FAQPage |
| `ContactForm` | 4 champs (nom, courriel, organisation, message), Turnstile, validation à la sortie du champ, erreurs liées par `aria-describedby`, succès avec icône + texte |
| `Calculator`, `Quiz` | Îlots Astro (script léger), résultat annoncé par `aria-live="polite"` |
| `LangSwitch` | Renvoie vers la page équivalente (jamais vers l'accueil) |
| `Seo` | title ≤ 60, description ≤ 155, canonical, hreflang, OG, JSON-LD |
| `Logo` | SVG inline, `aria-label="ameb — accueil"` |

États obligatoires pour tout composant interactif : repos, survol, focus visible, actif, désactivé, erreur, succès, chargement. Jamais la couleur seule pour porter une information.

### 4.4 Heuristiques de revue UI (checklist par page)

- Le visiteur comprend **quoi et pour qui** en 5 secondes au premier écran.
- Une seule action primaire par écran; le CTA primaire est le bouton le plus foncé de la page.
- La preuve apparaît avant le pli (micro-preuve, chiffre ou cas).
- Aucune valeur CSS hors jetons; aucune couleur en dur.
- Texte ≥ 17 px, ligne ≤ 70 caractères, contraste vérifié.
- H1 unique; hiérarchie H2/H3 sans saut.
- Toutes les images ont `width`/`height` et `alt` utile (ou `alt=""` si décoratif).
- Mouvement : rien ne bouge au repos; tout respecte `prefers-reduced-motion`.
- Mobile : aucune section sticky de plus d'un écran; cibles ≥ 44 px; aucun défilement horizontal.

---

## 5. Animations et microinteractions

### 5.1 Principes (sourcés)

- [Observé] Les animations CSS pilotées par le défilement s'exécutent hors du fil principal; n'animer que `transform`, `opacity`, `clip-path`, `stroke-dashoffset` (developer.chrome.com/articles/scroll-driven-animations; web.dev/articles/animations-guide).
- [Observé] Support : Chrome/Edge 115+, Safari 26+, Firefox 159+ (27 octobre 2026). Repli obligatoire : état final écrit par défaut, animation seulement sous `@supports (animation-timeline: view())` et `prefers-reduced-motion: no-preference` (MDN; buildmvpfast.com, juillet 2026).
- [Observé] Un `<svg>` inline n'est pas candidat LCP, et un élément à opacité 0 non plus : le **H1 doit être visible immédiatement** (web.dev/lcp).
- [Observé] WCAG 2.2.2 (niveau A) : tout mouvement qui démarre seul, dure plus de 5 s et s'affiche avec d'autre contenu exige une pause; l'arrivée dans le viewport compte comme un démarrage automatique. WCAG 2.3.3 : le mouvement déclenché par le défilement doit pouvoir être désactivé (w3c.github.io/wcag/understanding/).
- [Observé] NN/g : la prise de contrôle du défilement nuit; la parallaxe laisse indifférent. Révélations acceptables si rapides, jouées une fois, désactivées sur mobile.
- [Observé] GSAP est gratuit en usage commercial, plugins compris, et le code GSAP généré par IA est permis (gsap.com/community/standard-license/). Licence propriétaire : ne pas en faire une dépendance structurante.
- [Observé] Poids mesurés (gzip, nov. 2026) : scène SVG+CSS 1,4 Ko; GSAP core + ScrollTrigger ≈ 45 Ko; lottie-web 45-74 Ko; dotLottie 30 Ko + 480 Ko WASM; Rive lite 60 Ko + 340 Ko WASM; Three.js 130-185 Ko.

**Décision** : SVG inline + CSS (keyframes, `view-timeline`, `stroke-dashoffset`, `offset-path`) + ≤ 1 Ko de JS natif (IntersectionObserver, bouton pause, onglets). GSAP chargé dynamiquement sur l'accueil seulement si un défaut bloquant est démontré. Lottie, Rive, Three.js écartés (éditeur graphique, binaire, texte non traduisible, poids).

### 5.2 Catalogue des microinteractions

| Patron | Spécification | Reduced motion |
|---|---|---|
| Bouton survol | `background` jade-900 → jade-700, 150 ms ease-out; aucun déplacement | Couleur seulement (déjà sans mouvement) |
| Bouton actif | `transform: translateY(1px)`, 100 ms | Aucun |
| Focus | `outline: 2px solid var(--jade-600); outline-offset: 2px` sur `:focus-visible`; jamais retiré | — |
| Lien | Soulignement `scaleX(0→1)` depuis la gauche, 200 ms; couleur jade-900 | Soulignement permanent |
| Carte survol | Ombre-1 apparaît, bordure line → jade-100, 250 ms; pas de translation | Ombre sans transition |
| Révélation au défilement | `opacity 0→1` + `translateY(16px→0)`, `animation-timeline: view()`, `animation-range: entry 0% entry 60%`, une seule fois; **jamais sur le H1 ni sur le sous-titre du hero** | Désactivée |
| Ligne des étapes | `stroke-dashoffset` tracé au défilement (`cover 0% 80%`) | Tracée d'emblée |
| Compteurs | Interdits tant que les chiffres ne sont pas confirmés; ensuite valeur finale dans le HTML, animation décorative ≤ 1,2 s | Valeur fixe |
| Accordéon FAQ | `<details>` natif; chevron `rotate(90deg)` 200 ms; contenu sans animation de hauteur (évite le CLS) | Aucun |
| Formulaire | Validation à `blur`; message d'erreur glisse de 4 px + fondu 150 ms; icône check jade en succès | Fondu seulement |
| Transition de page | `@view-transition { navigation: auto; }`, fondu 250 ms; le `Header` et le `Logo` ont un `view-transition-name` pour rester stables | `navigation: none` |
| Menu mobile | `<dialog>` : fondu 200 ms + translateY 8 px | Fondu |
| Jeton de marque | Point jade qui apparaît en fin d'action (succès de formulaire, fin de FlowLine) : `scale(0→1)` 200 ms | Apparaît sans échelle |

Règles globales : un seul `--ease-out`; durées 100-200 ms (micro), 300-500 ms (entrée); aucune boucle infinie sans bouton pause; 0 Ko de JS d'animation par défaut; `will-change` jamais appliqué en permanence.

### 5.3 Animation phare — Concept A « Le plan qui se connecte » (retenu, accueil)

**Format** : section de 400 vh sur desktop (≥ 1024 px); enfant `position: sticky; top: 0; height: 100vh`. Scène SVG (viewBox 1200×720) à droite, 4 blocs de texte à gauche qui pilotent la `view-timeline`. Le défilement avance la scène; il n'est **jamais** capturé.

| Scène | Plage | Ce qui bouge (transform / opacity / dashoffset / fill seulement) | Texte FR |
|---|---|---|---|
| 1. Le silo | contain 0-25 % | 6 îlots gris ardoise dispersés, légèrement inclinés (−4° à +3°). Icônes tableur et enveloppes qui s'empilent (opacity par paliers). Une même fiche client apparaît en double dans deux îlots. Badge « Ressaisie ×4 » pulse 2 fois puis se fige. Points rouges d'alerte qui apparaissent (opacity seulement). | « Six équipes. Six outils. La même information tapée quatre fois. » |
| 2. La friction | 25-45 % | Une enveloppe « tombe » entre deux îlots (translateY + fondu). Les fiches dupliquées se superposent en décalé. Une horloge affiche « +3 jours ». Le compteur de ressaisies monte (texte HTML, pas SVG). | « Les demandes se perdent entre deux boîtes de réception. Les délais s'allongent. » |
| 3. La connexion | 45-75 % | Les îlots s'alignent sur la grille (transform) et passent ardoise → jade (fill). Un hub « Données unifiées » apparaît au centre (scale 0,8 → 1 + fondu). 6 liens jade se tracent depuis le hub (stroke-dashoffset, décalés de 0,05 chacun). Les doublons fusionnent en une fiche. Les tableurs se replient (scale 0,6 + fondu). | « On relie vos outils. Une seule source de vérité. Des flux qui roulent seuls. » |
| 4. Le pilote automatique | 75-100 % | Le hub devient un tableau de bord : 4 tuiles KPI s'assemblent (translateY 16 px + fondu, décalées). Un badge « IA » trie 3 jetons vers les bons îlots (offset-path). Une alerte jade « Facture en retard, relance envoyée » apparaît. 5 jetons circulent en boucle lente sur les liens (2,4 s, ≤ 6 simultanés) avec **bouton pause** visible. | « Vos opérations, en pilote automatique. » + bouton « Réserver mon diagnostic » |

**Structure SVG** (`SectionSilo.astro`) : groupes `#islands` (6 `<rect rx="12">`), `#noise` (sprite : tableur, enveloppe, doublon, horloge, alerte), `#links` (6 `<path>` avec `pathLength="1"`), `#hub`, `#dashboard` (4 tuiles), `#ai` (badge + 3 jetons), `#alert`, `#tokens` (5 cercles r=5). **Aucun `<text>` dans le SVG** : tous les libellés sont du HTML positionné en absolu (traduisible, lisible au lecteur d'écran, indexable). `<svg role="img" aria-labelledby="scene-desc">` + `<desc>`; une `<ol>` visible des 4 étapes sous la scène.

**CSS (squelette)** :
```css
.silo { view-timeline: --silo block; }
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .silo #links path { animation: trace linear both; animation-timeline: --silo; animation-range: contain 45% contain 75%; }
    .silo .island      { animation: align linear both; animation-timeline: --silo; animation-range: contain 45% contain 65%; }
    .silo #dashboard .tile { animation: assemble linear both; animation-timeline: --silo; animation-range: contain 75% contain 95%; }
    /* … une règle par groupe, toujours animation-timeline déclaré APRÈS le raccourci animation (MDN) */
  }
}
@keyframes trace    { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes align    { from { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); fill: var(--slate-600) } to { transform: none; fill: var(--jade-600) } }
@keyframes assemble { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
```
Firefox exige une `animation-duration` non nulle avec les timelines : utiliser `1ms` (MDN). Vérifier `offset-path: path()` sur les navigateurs cibles avant de l'utiliser pour les jetons; sinon `transform` sur segments droits ou GSAP MotionPath (9,5 Ko) [À CONFIRMER].

**Dégradations** :
- `prefers-reduced-motion: reduce` → état final (scène 4) affiché, boucle des jetons arrêtée, liste textuelle des 4 étapes.
- Navigateur sans `animation-timeline` → même état final.
- Mobile (< 768 px) → pas de sticky : 4 cartes empilées (texte + mini-scène de l'état final de chaque scène), chacune avec une révélation `view()` simple. Variante pas-à-pas au toucher (‹ ›) acceptable.
- Budget : scène ≤ 10 Ko gzip, 0 Ko de JS obligatoire, CLS = 0 (conteneur avec `aspect-ratio: 5 / 3`).

### 5.4 Concept B « Une demande, zéro ressaisie » (hero et pages Services/Secteurs)

Chaîne horizontale de 5 nœuds (verticale sur mobile). Quand la section entre dans la vue (IntersectionObserver, une fois), un jeton jade parcourt la ligne en **4 s** (< 5 s, donc conforme à 2.2.2 sans bouton pause); chaque nœud passe ardoise → jade (200 ms); étiquette finale « 0 ressaisie » + chronomètre « 2 s » contre « 2 jours ». Bouton « Rejouer » (`<button>`) et onglets de secteur (déclenchement volontaire). Reduced motion : tous les nœuds allumés d'emblée.

| Secteur | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Événementiel | Inscription en ligne | Fiche participant | Facture et paiement | Rappels automatiques | Sondage post-événement |
| Clinique | Prise de rendez-vous | Dossier créé | Facturation | Rappels | Suivi post-visite |
| MSP | Billet de soutien | Script automatisé | Documentation à jour | Temps facturé | Rapport client |
| Services pros | Demande entrante | Tri par IA | Devis | Projet | Facture |

Données : `src/data/flows/{evenementiel,clinique,msp,services-pros}.json` avec libellés FR/EN; un seul composant.

### 5.5 Concept C « Avant / Avec ameb » (pages Secteurs, Services, Confiance)

`<button aria-pressed>` qui bascule le même schéma entre l'état silo et l'état connecté, enveloppé dans `document.startViewTransition()` si disponible (sinon bascule instantanée). Déplacement des nœuds en FLIP (Web Animations API). Le plus accessible des trois : contrôlé par l'utilisateur, parfait au toucher, réutilisable en présentation client.

**Combinaison retenue** : B dans le hero (impact immédiat, LCP intact) · A sous le hero de l'accueil (récit complet) · C sur les pages Secteurs. Un seul vocabulaire visuel (nœud, lien, jeton, tuile) et quatre fichiers JSON.

---

## 6. Pile technique et outils

### 6.1 Comparatif (synthèse)

| Critère | **Astro** (retenu) | Next.js | Webflow | Framer |
|---|---|---|---|---|
| Maintenable par Claude Code | Excellent : tout en texte, Markdown, diffable | Bon, mais surdimensionné (runtime React) | Faible (éditeur visuel; MCP officiel mais pas de création CMS en langue secondaire; export perd CMS, formulaires et EN) | Partiel (MCP en préversion) |
| JS par défaut | ~0 Ko (îlots) | Runtime React | Moyen | Moyen |
| i18n FR/EN | Natif (routing, hreflang, slugs localisés) | Via middleware | Localisation payante | Locale 20 $ US/mois chacune |
| Hébergement | Cloudflare gratuit (statique illimité, usage commercial permis) | 0-20 $+ | 14-39 $ US/mois | 10-30 $ US/mois |
| Verrouillage | Aucun (MIT) | Faible | Élevé | Élevé |
| CWV | Astro au moins comparable aux meilleurs (sources tierces divergentes : 56-71 % de réussite mobile; référence : httparchive.org/reports/techreport) | 35-58 % selon la source | — | — |

[Observé] Astro 6.0 stable le 10 mars 2026; équipe chez Cloudflare depuis le 16 janvier 2026, projet toujours MIT et agnostique (astro.build/blog/joining-cloudflare/). Installer la dernière version stable au démarrage.

### 6.2 Outils par catégorie

| Catégorie | Choix | Coût |
|---|---|---|
| Cadriciel | Astro (dernière 6.x stable), sortie statique, TypeScript strict | 0 $ |
| Styles | CSS natif + jetons + `@layer`; `lightningcss` via Astro | 0 $ |
| Composants | HTML natif (`<details>`, `<dialog>`, `<button>`) + composants `.astro`; aucun framework client | 0 $ |
| Icônes | Lucide (SVG inline via `@lucide/astro` ou copie des SVG) | 0 $ |
| Polices | Sora + Inter auto-hébergées (API de polices Astro ou Fontsource), WOFF2 sous-ensemble | 0 $ |
| Images | `astro:assets` (AVIF/WebP, `srcset`), OG images générées au build (`satori` + `resvg`) | 0 $ |
| Contenu | Content Collections (Markdown/MDX, schémas zod); CMS headless optionnel plus tard (Keystatic ou Decap, compatibles Git) | 0 $ |
| i18n | Routage i18n d'Astro : `fr` à la racine, `en` sous `/en/`, `routes.ts` pour les slugs | 0 $ |
| Formulaires | `POST /api/contact` (Cloudflare Pages Function) → Turnstile → zod → webhook n8n (`N8N_WEBHOOK_URL`, HMAC `X-AMEB-Signature`) | 0 $ (Workers gratuit : 100 000 req/jour, 10 ms CPU; payant dès 5 $ US/mois) |
| Anti-pourriel | Cloudflare Turnstile (sans témoin de suivi; transmet IP et empreinte navigateur à Cloudflare — à déclarer dans la politique de confidentialité) | 0 $ |
| Rendez-vous | Lien externe vers l'outil de réservation d'AMEB (pas d'iframe tierce au chargement); Cal.com auto-hébergé en option | [À CONFIRMER] |
| Analytics | **Umami** auto-hébergé (MIT, sans témoins, PostgreSQL) sur le droplet n8n existant, ou Plausible Cloud (Starter 9 $ US/mois, UE) | 0-9 $ US/mois |
| Hébergement / CDN | Cloudflare Pages (ou Workers Static Assets), prévisualisations par branche | 0 $ |
| Domaine / DNS | Cloudflare DNS, HTTPS auto, HSTS | domaine [À CONFIRMER] |
| CI/CD | GitHub Actions (2 000 min/mois gratuites, illimité si repo public) | 0 $ |
| Tests | Playwright + `@axe-core/playwright`, Pa11y CI, Lighthouse CI (assertions), `html-validate`, vérificateur de liens, captures de référence | 0 $ |
| Qualité | ESLint + Stylelint + Prettier; `astro check` | 0 $ |
| Surveillance | Uptime Kuma auto-hébergé (droplet n8n) ou moniteur gratuit; alertes courriel/SMS | 0 $ |
| Dépendances | Renovate ou Dependabot, PR hebdomadaire | 0 $ |
| SEO technique | `@astrojs/sitemap` (i18n), `robots.txt`, JSON-LD (Organization, ProfessionalService, Service, FAQPage, BreadcrumbList, Article) | 0 $ |
| Design | Figma gratuit (3 fichiers : accueil, page Service, scène SVG) | 0 $ |

Coût récurrent estimé : domaine + 0 à 9 $ US/mois. (Estimation, pas un devis.)

### 6.3 Structure du dépôt

```
/
├─ CLAUDE.md                       (< 80 lignes, voir brief)
├─ .claude/settings.json           (hooks)
├─ docs/
│  ├─ plan-implementation.md       (ce document)
│  ├─ brief.md                     (brief de construction)
│  ├─ taches/NNN-titre.md          (une tâche = un fichier)
│  ├─ decisions/ADR-NNN.md         (décisions d'architecture, 10 lignes chacune)
│  ├─ rapports/AAAA-MM.md          (audits mensuels)
│  ├─ interdits.txt                (mots interdits : zoho, noms de produits, noms de clients)
│  └─ a-confirmer.md               (registre des [À CONFIRMER])
├─ public/ (favicon.svg, robots.txt, fonts/)
├─ src/
│  ├─ content/ (config.ts; pages/{fr,en}; services/{fr,en}; secteurs/{fr,en}; cas/{fr,en}; blogue/{fr,en})
│  ├─ data/flows/*.json  data/quiz.json
│  ├─ components/ (Logo, Header, Footer, LangSwitch, Button, Hero, SectionSilo, FlowLine, BeforeAfter,
│  │               Steps, Card, CaseCard, FAQ, ContactForm, Calculator, Quiz, Seo)
│  ├─ layouts/ (Base, Page, Article)
│  ├─ i18n/ (ui.ts, routes.ts)
│  ├─ pages/ (index.astro, services/, secteurs/, …, en/…, api/contact.ts, styleguide.astro)
│  └─ styles/ (tokens.css, base.css, layout.css, components.css, motion.css)
├─ scripts/ (check-content.ts, check-parity.ts, og-images.ts)
├─ tests/ (a11y, privacy, forms, i18n, reduced-motion, visual)
├─ lighthouserc.json  .pa11yci.json  playwright.config.ts
└─ .github/workflows/ci.yml
```

---

## 7. Méthode de développement avec Claude Code

### 7.1 Principes (sourcés)

[Observé] Pratiques publiées par Anthropic (anthropic.com/engineering/claude-code-best-practices; support.claude.com « power user tips ») : un `CLAUDE.md` versionné et court, ajusté comme un prompt; après chaque erreur, la règle va dans `CLAUDE.md`; les **hooks** sont déterministes là où les instructions ne sont qu'indicatives; cycle explorer → planifier → implémenter → commiter; action GitHub pour mentionner Claude dans les PR.

### 7.2 Organisation du travail

| Élément | Règle |
|---|---|
| Branches | `main` protégée; une branche par tâche (`feat/accueil-hero`, `fix/contraste-footer`) |
| PR | Une PR par tâche; prévisualisation Cloudflare automatique; fusion seulement si la CI est verte **et** après revue humaine sur mobile et desktop |
| Tâches | `docs/taches/NNN-titre.md` : objectif, fichiers touchés, critères d'acceptation, commandes de vérification. 1 à 3 h chacune |
| Session type | 1) Claude lit `CLAUDE.md` + la tâche; 2) plan en 5 lignes; 3) implémentation; 4) `npm run check && npm test`; 5) PR avec résumé et captures Playwright |
| Hooks (`.claude/settings.json`) | `PostToolUse` (Edit/Write) → `npm run lint --silent`; pré-commit → `check-content` + `check-parity`; refus de commit si échec |
| Revue | Sous-agent de revue (ou `/simplify`) avant la fusion : lisibilité, jetons, accessibilité, aucune dépendance nouvelle non justifiée |
| Mémoire | `docs/decisions/` (ADR courts) référencé depuis `CLAUDE.md`; aucune décision n'est prise deux fois |
| Garde-fous de contenu | `scripts/check-content.ts` échoue si `/zoho/i` ou un terme de `docs/interdits.txt` apparaît dans `src/`; `check-parity.ts` échoue si une page FR n'a pas son équivalent EN avec les mêmes H2 |
| Règle d'or | Toute correction humaine devient une règle dans `CLAUDE.md` ou un test |

### 7.3 Ordre de construction (tâches 001 → 030)

001 Repo, Astro, TypeScript, lint, CI vide verte · 002 `tokens.css`, `base.css`, polices, `Logo` · 003 `Base.astro`, `Header`, `Footer`, `LangSwitch`, i18n routes · 004 `Button`, `Card`, `Steps`, `FAQ`, page `/styleguide/` · 005 Content Collections + schémas · 006 `Seo` (hreflang, canonical, OG, JSON-LD) + sitemap + robots · 007 Accueil (texte FR, sections statiques) · 008 `FlowLine` (concept B) + JSON secteurs · 009 `SectionSilo` (concept A) desktop · 010 `SectionSilo` mobile + reduced motion + bouton pause · 011 `BeforeAfter` (concept C) · 012-020 Pages Services ×9 · 021-023 Pages Secteurs ×3 · 024 `/diagnostic/` + `ContactForm` + `/api/contact` + Turnstile + webhook n8n (préprod) · 025 `Calculator` · 026 `Quiz` · 027 Réalisations, Approche, Confiance, À propos, Contact, légales · 028 Blogue (liste, article, 2 premiers articles) · 029 Version EN complète + parité · 030 Tests complets (a11y, privacy, forms, i18n, reduced-motion, visuel), Lighthouse CI, Pa11y; liste de lancement.

### 7.4 CI (`ci.yml`, sur chaque PR)

`npm ci` → `astro check` → lint (eslint, stylelint) → `check-content` → `check-parity` → `astro build` → `html-validate` → liens → Playwright (`a11y` : 0 violation serious/critical sur chaque URL du sitemap; `privacy` : 0 témoin et 0 requête hors domaines autorisés au premier chargement; `forms`; `i18n` : hreflang, lang, LangSwitch; `reduced-motion` : `emulateMedia({reducedMotion:'reduce'})` → aucun élément avec `animation-name ≠ none`; `visual` : captures de référence) → Pa11y CI → Lighthouse CI (mobile ≥ 95 ×4 sur `/`, `/services/ventes-crm/`, `/secteurs/evenementiel-associations/`, `/diagnostic/` et leurs EN; budgets §8.1).

---

## 8. Performance, accessibilité, conformité

### 8.1 Performance

- **Cibles (p75 mobile)** : LCP ≤ 2,0 s (seuil 2,5 s), INP ≤ 100 ms (seuil 200 ms), CLS ≤ 0,05 (seuil 0,1).
- **Budgets par page** : HTML ≤ 50 Ko, CSS ≤ 30 Ko, JS ≤ 20 Ko (hors repli GSAP ≤ 50 Ko, accueil seulement, chargé dynamiquement), polices ≤ 100 Ko (2 familles, sous-ensemble), image LCP ≤ 120 Ko AVIF, scène SVG ≤ 10 Ko.
- **Techniques** : H1 texte = élément LCP, jamais en fondu; préchargement de Sora 600; dimensions explicites sur toutes les images et SVG; `aspect-ratio` sur les conteneurs de scène; îlots hydratés `client:visible` (rootMargin 200 px) ou `client:media`; aucun script tiers hors Turnstile (pages formulaire) et analytics.
- **Contrôle** : Lighthouse CI avec assertions bloquantes; CrUX/Search Console revus chaque mois.

### 8.2 Accessibilité WCAG 2.2 AA

- Contrastes : texte courant ≥ 4,5:1 (donc jade-900 ou slate pour le texte; jade-600 réservé aux grands textes, icônes et contours ≥ 3:1).
- Critères 2.2 à couvrir explicitement : 2.4.11 Focus non masqué (l'en-tête collant ne doit jamais couvrir le focus → `scroll-padding-top: 80px`); 2.5.7 Pas de glissement obligatoire; 2.5.8 Cibles ≥ 24×24 px; 3.2.6 Aide au même endroit sur chaque page (pied de page); 3.3.7 Ne jamais redemander une information dans un formulaire multi-étapes; 3.3.8 Aucune authentification.
- Structure : lien d'évitement; landmarks (`header`, `nav`, `main`, `footer`); un H1 par page; `lang="fr-CA"` / `"en-CA"` + `lang` sur les passages dans l'autre langue; formulaires avec `label`, `autocomplete`, erreurs liées par `aria-describedby`; `aria-live="polite"` pour les résultats du calculateur et du quiz.
- Mouvement : tout sous `prefers-reduced-motion`; bouton pause pour toute boucle > 5 s; aucune prise de contrôle du défilement.
- Tests : axe (0 violation serious/critical), Pa11y sur tout le sitemap, tests manuels clavier + NVDA/VoiceOver avant lancement, puis chaque trimestre.
- Contexte légal : aucune obligation légale pour une entreprise privée québécoise non fédérale (Loi canadienne sur l'accessibilité : entités fédérales; SGQRI 008 : organismes publics) — on vise AA par choix et comme argument de qualité.

### 8.3 Loi 96 (Charte de la langue française)

- [Observé] Art. 52 : publications commerciales en français « quel qu'en soit le support »; version française au moins équivalente. Contrats d'adhésion (conditions d'utilisation) remis en français d'abord. [Observé] Amende de 3 000 $ (Cour du Québec, octobre 2025) pour du contenu web commercial offert uniquement dans une autre langue (oqlf.gouv.qc.ca, communiqué du 14 nov. 2025).
- Mise en œuvre : FR à la racine; EN sous `/en/`, jamais plus complet que le FR; parité vérifiée en CI; sélecteur de langue sur chaque page; courriels automatiques en FR (EN si la page source est EN); mot-symbole « ameb » = marque, sans générique requis sur le site (le nom légal « Services AMEB inc. » apparaît dans le pied de page et les mentions légales).

### 8.4 Loi 25 (protection des renseignements personnels)

- [Observé] Art. 8.1 : toute technologie qui identifie, localise ou profile doit être **désactivée par défaut**; lignes directrices de la CAI sur le consentement (31 oct. 2023) : refus aussi simple que l'acceptation, pas de case précochée. Obligations : politique de confidentialité en termes simples; RPRP désigné avec titre et coordonnées publiés; registre des incidents; évaluation des communications hors Québec; durées de conservation; droit à la portabilité (depuis sept. 2024).
- Mise en œuvre : analytics sans témoins ni identifiant persistant (Umami/Plausible) → **aucune bannière** (position à faire valider par un juriste [À CONFIRMER]); aucun script tiers avant consentement; test Playwright `privacy` en CI; formulaires minimaux (4 champs), finalité indiquée, case de consentement non cochée pour l'envoi du rapport; lien vers `/confidentialite/` sous chaque formulaire; RPRP dans le pied de page (`[NOM, COURRIEL À CONFIRMER]`); conservation des soumissions 24 mois [À CONFIRMER]; Turnstile et l'hébergement Cloudflare (États-Unis) déclarés dans la politique et dans l'évaluation de transfert hors Québec.
- Santé : le site **ne collecte aucun renseignement de santé**; les mandats cliniques sont encadrés par écrit; applicabilité de la Loi 5 (renseignements de santé et de services sociaux, en vigueur pour les cliniques privées depuis juillet 2024) aux mandats → juriste [À CONFIRMER].

### 8.5 Messages de confiance publiables (vérifiables, sans surpromesse)

- « Vos données restent à vous : accès, exportations et documentation vous sont remis à la fin de chaque mandat. »
- « Comptes nominatifs, moindre privilège, accès retirés en fin de mandat. »
- « On identifie avec vous où vos données sont hébergées avant toute mise en place. »
- « Renseignements de santé : on travaille dans le respect de la Loi 25 et du cadre applicable, et on documente chaque flux. »
- « Entente de confidentialité signée avant tout accès à vos systèmes. »
- À éviter : « conformité garantie », « certifié » (sans certification), « vos données ne quittent jamais le Canada », « 100 % sécurisé ».

---

## 9. Mesure et optimisation

| Événement | Déclencheur |
|---|---|
| `cta_diagnostic` | Clic sur « Réserver mon diagnostic » (propriété : emplacement) |
| `form_diagnostic_submit` | Réponse 200 du Worker |
| `booking_click` | Clic vers l'outil de rendez-vous |
| `calc_complete` / `quiz_complete` | Résultat affiché (propriété : profil) |
| `report_request` | Rapport PDF demandé |
| `lang_switch`, `case_view`, `tel_click`, `email_click` | Évidents |

- Tableau de bord hebdomadaire : visites par source; conversion vers le diagnostic par page d'entrée; complétion calculateur/quiz; CWV (Search Console); positions sur les 15 mots-clés.
- Tests A/B après J+90 (quand le trafic le permet) : hero 1 vs 2; « Réserver mon diagnostic » vs « Obtenir mon plan »; prix affiché vs « à partir de ». Variante attribuée côté serveur (Worker), sans témoin identifiant.

---

## 10. Phases et échéancier (≈ 10 semaines, fondateur solo + Claude Code)

| Phase | Semaines | Livrables | Critères de sortie |
|---|---|---|---|
| **0. Découverte** | S1 | Fiche de positionnement; 3 personas (direction d'association, associé de firme, gestion de clinique); volumes de mots-clés mesurés; inventaire des preuves disponibles; registre `a-confirmer.md` | Volumes mesurés; chaque [À CONFIRMER] a un responsable et une date |
| **1. Contenu** | S2-S3 | Arborescence finale; textes FR de toutes les pages; 3 cas anonymisés (approbation client écrite); 10 questions du quiz; formule du calculateur | Relecture FR terminée; 0 nom de client, 0 marque d'éditeur |
| **2. Design system** | S3-S4 | `tokens.css`; maquettes Figma de l'accueil et d'une page Service; SVG de la scène phare nettoyé (groupes nommés); images OG | Contrastes AA validés; styleguide en ligne en prévisualisation |
| **3. Développement** | S4-S7 | Tâches 001-028 | CI verte; Lighthouse ≥ 95 ×4 sur les gabarits; animation A conforme sur Chrome/Safari/Firefox récents |
| **4. Bilingue** | S7-S8 | Tâche 029 : EN équivalent, révision humaine | Parité 100 % |
| **5. QA** | S8-S9 | Tâche 030 : tests manuels clavier/lecteur d'écran, mobiles réels, formulaire de bout en bout (n8n reçoit), relecture juridique des pages légales | Liste de lancement cochée |
| **6. Lancement** | S10 | Bascule DNS; sitemap soumis (Search Console, Bing); redirections 301 si ancien site; annonce LinkedIn; profil Google Business à jour | Moniteur actif; premiers événements reçus |
| **7. Post-lancement** | J+1 → J+90 | 1 article aux 2 semaines; audit mensuel (`docs/rapports/`); test A/B à J+90 | Rapport 90 jours |

### 10.1 Liste de vérification de lancement

- [ ] Parité FR/EN à 100 % (script) et sélecteur de langue vers la page équivalente
- [ ] 0 mot interdit dans `src/` (script)
- [ ] 0 témoin et 0 requête tierce non autorisée au premier chargement (Playwright)
- [ ] Politique de confidentialité, RPRP (nom + courriel), Accessibilité, Mentions légales publiées et relues par un juriste
- [ ] axe : 0 violation serious/critical; tests manuels clavier + lecteur d'écran consignés
- [ ] Lighthouse mobile ≥ 95 ×4 sur les 4 gabarits FR + EN; budgets respectés
- [ ] Formulaire : Turnstile validé côté serveur; webhook n8n reçu en préprod et en prod; courriel de confirmation FR
- [ ] hreflang, canonical, sitemap, robots, JSON-LD validés (Rich Results Test)
- [ ] Images OG FR et EN
- [ ] Redirections 301 depuis l'ancien site [si applicable]
- [ ] Moniteur de disponibilité actif, alerte test reçue
- [ ] Tous les [À CONFIRMER] résolus ou retirés du contenu publié; chiffres de résultats approuvés par les clients concernés
- [ ] Antériorité du slogan vérifiée au registre des marques

### 10.2 Maintenance continue

- **Hebdo** : PR Renovate/Dependabot → Claude Code vérifie → fusion si CI verte.
- **Mensuel** : tâche « audit » (Lighthouse, axe, liens, parité, CWV Search Console, positions SEO) → `docs/rapports/AAAA-MM.md`.
- **Trimestriel** : textes de conformité, montants et dates des programmes de financement, version d'Astro, tests lecteur d'écran.
- **Règle d'or** : toute correction humaine devient une règle `CLAUDE.md` ou un test.

---

## 11. Registre des [À CONFIRMER]

| Élément | Responsable | Avant |
|---|---|---|
| Prix du diagnostic et conditions du crédit à 100 % | Houssam | Phase 1 |
| Durée du diagnostic; délai « premiers flux en production » | Houssam | Phase 1 |
| Résultats chiffrés des 3 cas anonymisés + approbation écrite des clients | Houssam | Phase 1 |
| Nom et courriel du RPRP; adresse d'affaires; téléphone | Houssam | Phase 1 |
| Portrait et parcours du fondateur | Houssam | Phase 2 |
| Domaine (ameb.ca?) et outil de prise de rendez-vous | Houssam | Phase 3 |
| Admissibilité ESSOR 1B pour les secteurs visés; montants IRIA; formulation | Houssam + IQ | Phase 1 |
| Applicabilité de la Loi 5 aux mandats cliniques; position « sans bannière » avec analytics sans témoins; durée de conservation des soumissions | Juriste | Phase 5 |
| Antériorité du slogan (CIPO) | Houssam | Phase 5 |
| Support `offset-path: path()` sur navigateurs cibles | Claude Code (test) | Tâche 009 |
| Volumes de recherche des 15 mots-clés | Houssam (Keyword Planner) | Phase 0 |
| Identité exacte de « Touli » (analyse faite sur Tooly, tooly.ca) | Houssam | — |

---

## Sources principales

Concurrents : https://nsisolution.com/ · https://nuagix.ca/ · https://nuagix.ca/consultant-zoho-brossard/ · https://tooly.ca/ · https://tooly.ca/pourquoi-zoho/ · https://hellodarwin.com/fr/agences/flo · https://clutch.co/profile/nuagix
Pratiques : https://signalscore.pages.dev/report/ · https://wynter.com/research/b2b-vendor-differentiation-survey · https://www.nngroup.com/articles/show-price/ · https://www.nngroup.com/articles/photos-as-web-content/ · https://www.nngroup.com/articles/parallax-usability/ · https://brainy.ink/paper/why-every-saas-looks-the-same-2026 · https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/ · https://www.ramp.com · https://zapier.com
Animation : https://developer.chrome.com/articles/scroll-driven-animations · https://developer.mozilla.org/Firefox/Releases/159 · https://scroll-driven-animations.style/ · https://web.dev/lcp · https://web.dev/articles/animations-guide · https://web.dev/articles/prefers-reduced-motion · https://w3c.github.io/wcag/understanding/pause-stop-hide.html · https://gsap.com/community/standard-license/ · https://gsap.com/blog/3-13/ · https://rive.app/docs/runtimes/runtime-sizes.md · https://github.blog/engineering/how-we-built-the-github-globe · https://stripe.com/blog/globe
Technique : https://astro.build/blog/joining-cloudflare/ · https://astro.build/blog/2/ · https://developers.cloudflare.com/workers/platform/pricing/ · https://github.com/pricing · https://httparchive.org/reports/techreport/tech · https://www.anthropic.com/engineering/claude-code-best-practices · https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
Conformité et financement : https://www.oqlf.gouv.qc.ca/office/communiques/2025/20251114_infraction_waterco.aspx · https://conceptionwebqc.ca/blogue/obligations-legales/loi-96-site-web-francais/ · https://oktanagency.com/fr-ca/loi-25-cookies-site-web/ · https://www.investquebec.com/fr/financement/programmes-gouvernementaux/essor/appui-la-concretisation-de-projets-dinvestissement

Notes de recherche détaillées (8 fichiers) dans `research_notes/Stratégie site web ameb/`.
