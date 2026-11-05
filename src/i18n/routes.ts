/**
 * Table unique des URL FR ↔ EN (slugs localisés).
 *
 * Toute page du site a une clé ici. Les liens, le sélecteur de langue, les
 * balises hreflang et le plan du site s'appuient sur cette table : une page
 * FR sans équivalent EN est impossible (le type l'exige).
 *
 * Sept pages par langue (refonte, ADR-012) : l'accueil porte le message complet;
 * les autres pages servent une action (diagnostic, contact) ou une obligation (légal).
 */
export const LOCALES = ['fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Lang = 'fr';

export const HTML_LANG: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' };
export const OG_LOCALE: Record<Lang, string> = { fr: 'fr_CA', en: 'en_CA' };

type Pair = { fr: string; en: string };

export const ROUTES = {
  home: { fr: '/', en: '/en/' },
  diagnostic: { fr: '/diagnostic/', en: '/en/diagnostic/' },
  realisations: { fr: '/realisations/', en: '/en/case-studies/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  confidentialite: { fr: '/confidentialite/', en: '/en/privacy/' },
  accessibilite: { fr: '/accessibilite/', en: '/en/accessibility/' },
  'mentions-legales': { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  styleguide: { fr: '/styleguide/', en: '/en/styleguide/' },
  '404': { fr: '/404/', en: '/en/404/' },
} as const satisfies Record<string, Pair>;

export type RouteKey = keyof typeof ROUTES;

/** Ancres des sections de l'accueil (mêmes identifiants dans les deux langues). */
export const HOME_ANCHORS = {
  methode: 'methode',
  services: 'services',
  secteurs: 'secteurs',
  preuve: 'preuve',
  offre: 'offre',
} as const;
export type HomeAnchor = keyof typeof HOME_ANCHORS;

/** Pages exclues du plan du site et marquées noindex. */
export const NOINDEX_ROUTES: readonly RouteKey[] = ['styleguide', '404'];

/** URL d'une clé de route dans une langue, avec ancre facultative. */
export function url(key: RouteKey, lang: Lang, hash?: string): string {
  const path = ROUTES[key][lang];
  return hash ? `${path}#${hash}` : path;
}

/** URL d'une section de l'accueil. */
export function homeUrl(anchor: HomeAnchor, lang: Lang): string {
  return url('home', lang, HOME_ANCHORS[anchor]);
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
