/**
 * Table unique des URL FR ↔ EN (slugs localisés).
 *
 * Toute page du site a une clé ici. Les liens, le sélecteur de langue, les
 * balises hreflang et le plan du site s'appuient sur cette table : une page
 * FR sans équivalent EN est impossible (le type l'exige).
 */
export const LOCALES = ['fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Lang = 'fr';

export const HTML_LANG: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' };
export const OG_LOCALE: Record<Lang, string> = { fr: 'fr_CA', en: 'en_CA' };

type Pair = { fr: string; en: string };

export const ROUTES = {
  home: { fr: '/', en: '/en/' },

  services: { fr: '/services/', en: '/en/services/' },
  'services/ventes-crm': { fr: '/services/ventes-crm/', en: '/en/services/sales-crm/' },
  'services/facturation-paiements': { fr: '/services/facturation-paiements/', en: '/en/services/billing-payments/' },
  'services/marketing-automatise': { fr: '/services/marketing-automatise/', en: '/en/services/marketing-automation/' },
  'services/evenements': { fr: '/services/evenements/', en: '/en/services/events/' },
  'services/service-client': { fr: '/services/service-client/', en: '/en/services/customer-service/' },
  'services/projets-collaboration': { fr: '/services/projets-collaboration/', en: '/en/services/projects-collaboration/' },
  'services/tableaux-de-bord-donnees': { fr: '/services/tableaux-de-bord-donnees/', en: '/en/services/dashboards-data/' },
  'services/ia-appliquee': { fr: '/services/ia-appliquee/', en: '/en/services/applied-ai/' },
  'services/automatisation-ti-msp': { fr: '/services/automatisation-ti-msp/', en: '/en/services/msp-it-automation/' },

  secteurs: { fr: '/secteurs/', en: '/en/sectors/' },
  'secteurs/evenementiel-associations': {
    fr: '/secteurs/evenementiel-associations/',
    en: '/en/sectors/events-associations/',
  },
  'secteurs/services-professionnels': {
    fr: '/secteurs/services-professionnels/',
    en: '/en/sectors/professional-services/',
  },
  'secteurs/cliniques': { fr: '/secteurs/cliniques/', en: '/en/sectors/clinics/' },

  diagnostic: { fr: '/diagnostic/', en: '/en/diagnostic/' },

  outils: { fr: '/outils/', en: '/en/tools/' },
  'outils/calculateur-ressaisie': { fr: '/outils/calculateur-ressaisie/', en: '/en/tools/re-entry-calculator/' },
  'outils/autoevaluation': { fr: '/outils/autoevaluation/', en: '/en/tools/self-assessment/' },

  realisations: { fr: '/realisations/', en: '/en/case-studies/' },
  'realisations/association-congres': {
    fr: '/realisations/association-congres/',
    en: '/en/case-studies/association-conference/',
  },
  'realisations/firme-services-professionnels': {
    fr: '/realisations/firme-services-professionnels/',
    en: '/en/case-studies/professional-services-firm/',
  },
  'realisations/clinique': { fr: '/realisations/clinique/', en: '/en/case-studies/clinic/' },

  approche: { fr: '/approche/', en: '/en/approach/' },
  confiance: { fr: '/confiance/', en: '/en/trust/' },
  'a-propos': { fr: '/a-propos/', en: '/en/about/' },

  ressources: { fr: '/ressources/', en: '/en/resources/' },
  'ressources/sortir-d-excel': {
    fr: '/ressources/sortir-d-excel-par-ou-commencer/',
    en: '/en/resources/moving-off-excel-where-to-start/',
  },
  'ressources/loi-25-automatisation': {
    fr: '/ressources/loi-25-et-automatisation/',
    en: '/en/resources/law-25-and-automation/',
  },

  contact: { fr: '/contact/', en: '/en/contact/' },
  confidentialite: { fr: '/confidentialite/', en: '/en/privacy/' },
  accessibilite: { fr: '/accessibilite/', en: '/en/accessibility/' },
  'mentions-legales': { fr: '/mentions-legales/', en: '/en/legal-notice/' },

  styleguide: { fr: '/styleguide/', en: '/en/styleguide/' },
  '404': { fr: '/404/', en: '/en/404/' },
} as const satisfies Record<string, Pair>;

export type RouteKey = keyof typeof ROUTES;

/** Pages exclues du plan du site et marquées noindex. */
export const NOINDEX_ROUTES: readonly RouteKey[] = ['styleguide', '404'];

/** Clés de route d'un groupe (« services/… », « secteurs/… »). */
export function childRoutes<P extends string>(prefix: P): Extract<RouteKey, `${P}/${string}`>[] {
  return (Object.keys(ROUTES) as RouteKey[]).filter((k) => k.startsWith(`${prefix}/`)) as Extract<
    RouteKey,
    `${P}/${string}`
  >[];
}

/** URL d'une clé de route dans une langue, avec ancre facultative. */
export function url(key: RouteKey, lang: Lang, hash?: string): string {
  const path = ROUTES[key][lang];
  return hash ? `${path}#${hash}` : path;
}

/** Normalise un chemin (barre oblique finale, sans .html ni index). */
export function normalizePath(pathname: string): string {
  let p = pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
  if (!p.endsWith('/')) p += '/';
  return p;
}

/** Retrouve la clé de route et la langue d'un chemin. */
export function findRoute(pathname: string): { key: RouteKey; lang: Lang } | undefined {
  const p = normalizePath(pathname);
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    for (const lang of LOCALES) {
      if (ROUTES[key][lang] === p) return { key, lang };
    }
  }
  return undefined;
}

/** Dernier segment du chemin (slug) d'une clé, utile pour getStaticPaths. */
export function slugOf(key: RouteKey, lang: Lang): string {
  const parts = ROUTES[key][lang].split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}
