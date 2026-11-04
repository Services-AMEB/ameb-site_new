import { HTML_LANG, ROUTES, type Lang, type RouteKey } from '../i18n/routes';
import { t } from '../i18n/ui';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Ajoute « | ameb » au titre s'il reste de la place (≤ 60 caractères). */
export function fullTitle(title: string, lang: Lang): string {
  const suffix = t(lang, 'meta.titleSuffix');
  if (/\bameb\b/.test(title)) return title;
  return title.length + suffix.length <= TITLE_MAX ? `${title}${suffix}` : title;
}

export function ogImagePath(key: RouteKey, lang: Lang): string {
  const slug = key === 'home' ? 'accueil' : key.replaceAll('/', '-');
  return `/og/${lang}/${slug}.png`;
}

export function absolute(path: string, site: URL | undefined): string {
  return new URL(path, site ?? 'https://ameb.ca').href;
}

export type Crumb = { label: string; key?: RouteKey };

/** Données structurées de l'organisation (Organization + ProfessionalService). */
export function organizationLd(lang: Lang, site: URL | undefined) {
  const home = absolute(ROUTES.home[lang], site);
  return [
    {
      '@type': 'Organization',
      '@id': `${absolute('/', site)}#organization`,
      name: 'ameb',
      legalName: 'Services AMEB inc.',
      url: home,
      logo: absolute('/favicon.svg', site),
      slogan: t(lang, 'footer.tagline'),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${absolute('/', site)}#service`,
      name: 'ameb',
      url: home,
      parentOrganization: { '@id': `${absolute('/', site)}#organization` },
      description: t(lang, 'meta.defaultDescription'),
      areaServed: { '@type': 'AdministrativeArea', name: 'Québec' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Montréal',
        addressRegion: 'QC',
        addressCountry: 'CA',
      },
      knowsLanguage: [HTML_LANG.fr, HTML_LANG.en],
    },
  ];
}

export function breadcrumbLd(crumbs: Crumb[], lang: Lang, site: URL | undefined) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.key ? { item: absolute(ROUTES[c.key][lang], site) } : {}),
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}
