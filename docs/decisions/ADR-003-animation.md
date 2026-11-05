# ADR-003 — Technique d’animation (concepts A, B, C)

- Statut : Remplacé par ADR-012 (composants retirés le 2026-11-05)
- Date : 2026-11-04

- A — SectionSilo : SVG inline + CSS piloté par le défilement (`view-timeline: --silo block`, plages `contain`), propriétés opacity / transform / stroke-dashoffset / fill seulement; 0 Ko de JS requis (le seul script est le bouton pause). Scène : 4,6 Ko gzip (SVG + CSS), mesurée par `check-dist`.
- Repli : cartes empilées avec mini-scènes figées (états 1 à 4) si < 1024 px, mouvement réduit ou `animation-timeline` non pris en charge. État final écrit par défaut.
- Jetons : `offset-path: path()` sous `@supports`, sinon position fixe au milieu de chaque lien. Vérifié dans Chromium; Safari 26+ et Firefox 159+ à vérifier manuellement (a-confirmer n° 19).
- B — FlowLine : ligne droite, donc le point se déplace par `transform` sur un segment (équivalent exact d’`offset-path` pour une droite, pris en charge partout). IntersectionObserver, une seule lecture de 4 s (< 5 s : WCAG 2.2.2 sans pause), bouton Rejouer.
- C — BeforeAfter : `document.startViewTransition()` si disponible (noms de transition uniques par nœud), sinon FLIP via Web Animations API, 450 ms; mouvement réduit : fondu.
- GSAP, Lottie, Rive, Three.js : non utilisés (aucun défaut bloquant constaté).
