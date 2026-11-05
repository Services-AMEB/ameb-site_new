/**
 * Collections de contenu (Markdown + avant-propos YAML), une entrée par langue :
 * src/content/<collection>/{fr,en}/<clé>.md — même nom de fichier dans les deux langues.
 *
 * Les schémas valident la structure au build : une clé manquante, une liste de
 * la mauvaise longueur ou un titre SEO trop long font échouer la compilation.
 * La typographie française est appliquée à l'affichage (src/lib/content.ts).
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICONS } from './components/icons/lucide';

const iconNames = Object.keys(ICONS) as [keyof typeof ICONS, ...(keyof typeof ICONS)[]];
const icon = z.enum(iconNames);

const str = () => z.string().trim().min(1);
const titleText = z.object({ title: str(), text: str() });
const qa = z.object({ q: str(), a: str() });
const iconLabel = z.object({ icon, label: str() });

/** Métadonnées SEO : title ≤ 60 caractères, description ≤ 155. */
const seo = {
  title: str().max(60, 'title : 60 caractères au maximum'),
  description: str().max(155, 'description : 155 caractères au maximum'),
};

/** Cas anonymisés, affichés sur l'accueil et sur /realisations/ (aucun chiffre). */
const cas = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/cas' }),
  schema: z.object({
    order: z.number().int(),
    sectorLabel: str(),
    name: str(),
    summary: str().max(220),
    before: z.array(str()).length(3),
    system: z.array(str()).min(3).max(6),
    /** Ce qui a changé au quotidien, en une phrase, sans chiffre. */
    changed: str(),
  }),
});

/* ---------- Pages fixes : un schéma par page (union discriminée sur « page ») ---------- */

const base = { ...seo, h1: str(), lead: str() };

const accueil = z.object({
  page: z.literal('accueil'),
  ...seo,
  hero: z.object({
    eyebrow: str(),
    h1: str(),
    lead: str(),
    leadStrong: str(),
    leadEnd: str(),
    ctaSecondary: str(),
    proof: z.array(str()).length(3),
  }),
  panel: z.object({
    label: str(),
    note: str(),
    sources: z.array(iconLabel).length(4),
    outputs: z.array(iconLabel).length(3),
    hub: str(),
    feed: z.array(str()).min(6).max(12),
  }),
  calc: z.object({
    eyebrow: str(),
    h2: str(),
    employees: str(),
    hours: str(),
    rate: str(),
    resultLabel: str(),
    note: str(),
  }),
  gains: z.object({
    eyebrow: str(),
    h2: str(),
    tiles: z.array(titleText).length(4),
    inputs: z.array(str()).length(3),
    output: str(),
    invoices: z.array(z.object({ name: str(), before: str(), after: str() })).length(3),
    updated: str(),
    tasks: z.array(str()).length(4),
    manual: str(),
    automated: str(),
  }),
  method: z.object({
    eyebrow: str(),
    h2: str(),
    lead: str(),
    vs: z.object({
      bad: z.object({ title: str(), items: z.array(str()).length(3) }),
      good: z.object({ title: str(), items: z.array(str()).length(3) }),
    }),
    steps: z
      .array(z.object({ label: str(), title: str(), text: str(), points: z.array(str()).length(3) }))
      .length(3),
    map: z.object({
      caption: str(),
      nodes: z.array(z.object({ label: str(), icon, friction: z.string().optional() })).length(5),
      legend: z.array(str()).length(2),
    }),
    matrix: z.object({
      caption: str(),
      process: str(),
      choices: z.array(str()).length(4),
      rows: z.array(z.object({ process: str(), why: str(), choice: z.number().int().min(0).max(3) })).min(4).max(6),
      note: str(),
    }),
    setup: z.object({ caption: str(), items: z.array(str()).length(4), done: str(), badge: str() }),
  }),
  services: z.object({
    eyebrow: str(),
    h2: str(),
    chips: z.array(iconLabel).min(8).max(10),
    chips2: z.array(str()).min(8).max(10),
    orbit: z.object({
      core: str(),
      inner: z.array(str()).length(4),
      outer: z.array(str()).length(4),
      h3: str(),
      lead: str(),
      points: z.array(str()).length(3),
    }),
  }),
  sectors: z.object({
    eyebrow: str(),
    h2: str(),
    label: str(),
    tabs: z.array(z.object({ id: str(), label: str(), h3: str(), text: str(), flow: z.array(str()).length(5) })).length(3),
  }),
  proof: z.object({ eyebrow: str(), h2: str(), lead: str(), before: str(), after: str(), changed: str(), link: str() }),
  offer: z.object({
    eyebrow: str(),
    h2: str(),
    lead: str(),
    includes: z.array(str()).length(4),
    priceLabel: str(),
    priceValue: str(),
    priceNote: str(),
    funding: str(),
  }),
  faqTitle: str(),
  faq: z.array(qa).length(4),
});

const diagnostic = z.object({
  page: z.literal('diagnostic'),
  ...base,
  price: z.object({ h2: str(), value: str(), note: str(), credit: str() }),
  deliverables: z.object({ h2: str(), items: z.array(z.object({ title: str(), text: str(), icon })).length(4) }),
  process: z.object({ h2: str(), steps: z.array(str()).length(4) }),
  funding: titleText,
  form: z.object({ h2: str(), lead: str() }),
  faqTitle: str(),
  faq: z.array(qa).length(4),
});

const realisations = z.object({
  page: z.literal('realisations'),
  ...base,
  before: str(),
  system: str(),
  changed: str(),
  note: str(),
});

const contact = z.object({
  page: z.literal('contact'),
  ...base,
  details: z.object({ h2: str(), email: str(), phone: str(), address: str(), hours: str() }),
  form: z.object({ h2: str(), lead: str() }),
  booking: titleText,
  about: z.object({ h2: str(), paragraphs: z.array(str()).min(1).max(3) }),
});

const index = z.object({
  page: z.enum(['404', 'styleguide']),
  ...base,
  note: z.string().optional(),
});

const prose = z.object({
  page: z.enum(['confidentialite', 'accessibilite', 'mentions-legales']),
  ...base,
  updated: z.coerce.date(),
  review: str(),
});

const pages = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/pages' }),
  schema: z.discriminatedUnion('page', [accueil, diagnostic, realisations, contact, index, prose]),
});

export const collections = { cas, pages };
