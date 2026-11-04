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
import { childRoutes } from './i18n/routes';

const iconNames = Object.keys(ICONS) as [keyof typeof ICONS, ...(keyof typeof ICONS)[]];
const icon = z.enum(iconNames);

const strip = (key: string) => key.split('/')[1] ?? key;
const serviceKeys = childRoutes('services').map(strip) as [string, ...string[]];
const sectorKeys = childRoutes('secteurs').map(strip) as [string, ...string[]];
const caseKeys = childRoutes('realisations').map(strip) as [string, ...string[]];

export const FLOW_KEYS = ['evenementiel', 'clinique', 'msp', 'services-pros'] as const;
const flow = z.enum(FLOW_KEYS);

const str = () => z.string().trim().min(1);
const titleText = z.object({ title: str(), text: str() });
const qa = z.object({ q: str(), a: str() });

/** Métadonnées SEO : title ≤ 60 caractères, description ≤ 155. */
const seo = {
  title: str().max(60, 'title : 60 caractères au maximum'),
  description: str().max(155, 'description : 155 caractères au maximum'),
};

const services = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/services' }),
  schema: z.object({
    ...seo,
    order: z.number().int(),
    icon,
    /** Libellé court (menus, cartes). */
    name: str(),
    /** Une phrase pour la carte de l'accueil. */
    summary: str().max(160),
    h1: str(),
    lead: str(),
    pains: z.array(titleText).length(3),
    capabilities: z.array(titleText).min(4).max(6),
    flow,
    /** Texte de chacune des 4 étapes (titres fixes : Diagnostic, Plan, Mise en place, Pilote automatique). */
    steps: z.array(str()).length(4),
    case: z.enum(caseKeys),
    faq: z.array(qa).length(4),
  }),
});

const secteurs = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/secteurs' }),
  schema: z.object({
    ...seo,
    order: z.number().int(),
    icon,
    name: str(),
    summary: str().max(160),
    h1: str(),
    lead: str(),
    realities: z.array(str()).length(3),
    flow,
    capabilities: z
      .array(z.object({ service: z.enum(serviceKeys), title: str(), text: str() }))
      .min(4)
      .max(6),
    case: z.enum(caseKeys),
    compliance: titleText,
  }),
});

const cas = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/cas' }),
  schema: z.object({
    ...seo,
    order: z.number().int(),
    sector: z.enum(sectorKeys),
    /** Titre de la carte. */
    name: str(),
    summary: str().max(200),
    h1: str(),
    lead: str(),
    sectorLabel: str(),
    /** Fourchette, jamais une taille exacte (règle anti-réidentification). */
    size: str(),
    before: z.array(str()).length(3),
    system: z.array(str()).min(3).max(6),
    results: z.array(str()).length(2),
    delay: str(),
  }),
});

const blogue = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/blogue' }),
  schema: z.object({
    ...seo,
    h1: str(),
    lead: str(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    readingMinutes: z.number().int().positive(),
  }),
});

/* ---------- Pages fixes : un schéma par page (union discriminée sur « page ») ---------- */

const base = { ...seo, h1: str(), lead: str() };

const accueil = z.object({
  page: z.literal('accueil'),
  ...seo,
  hero: z.object({ h1: str(), lead: str(), proof: str() }),
  pains: z.object({ h2: str(), items: z.array(z.object({ title: str(), text: str(), icon })).length(4) }),
  cost: z.object({ h2: str(), before: str(), after: str(), note: str(), link: str() }),
  automate: z.object({ h2: str(), lead: str() }),
  sectors: z.object({ h2: str(), lead: str() }),
  approach: z.object({ h2: str(), lead: str(), steps: z.array(str()).length(4) }),
  agnostic: z.object({ h2: str(), text: str(), points: z.array(str()).min(2).max(4) }),
  cases: z.object({ h2: str(), lead: str() }),
  trust: z.object({ h2: str(), items: z.array(z.object({ text: str(), icon })).length(3), link: str() }),
});

const diagnostic = z.object({
  page: z.literal('diagnostic'),
  ...base,
  price: z.object({ h2: str(), amount: str(), credit: str(), duration: str(), note: str() }),
  deliverables: z.object({ h2: str(), items: z.array(z.object({ title: str(), text: str(), icon })).length(4) }),
  process: z.object({ h2: str(), steps: z.array(str()).length(4) }),
  funding: titleText,
  form: z.object({ h2: str(), lead: str() }),
  faq: z.array(qa).length(4),
});

const outils = z.object({
  page: z.literal('outils'),
  ...base,
  tools: z.array(z.object({ route: z.enum(['outils/calculateur-ressaisie', 'outils/autoevaluation']), title: str(), text: str(), icon })).length(2),
});

const calculateur = z.object({
  page: z.literal('calculateur'),
  ...base,
  howTo: z.object({ h2: str(), items: z.array(str()).min(2).max(5) }),
  next: titleText,
});

const autoevaluation = z.object({
  page: z.literal('autoevaluation'),
  ...base,
  intro: z.object({ h2: str(), items: z.array(str()).min(2).max(4) }),
  next: titleText,
});

const approche = z.object({
  page: z.literal('approche'),
  ...base,
  steps: z.object({
    h2: str(),
    items: z.array(z.object({ text: str(), details: z.array(str()).min(2).max(5) })).length(4),
  }),
  agnostic: z.object({ h2: str(), text: str(), points: z.array(str()).min(2).max(5) }),
  receive: z.object({ h2: str(), items: z.array(z.object({ title: str(), text: str(), icon })).length(3) }),
  thread: titleText,
});

const confiance = z.object({
  page: z.literal('confiance'),
  ...base,
  commitments: z.object({ h2: str(), items: z.array(z.object({ text: str(), icon })).min(4).max(6) }),
  health: z.object({ h2: str(), paragraphs: z.array(str()).min(1).max(4) }),
  rprp: z.object({ h2: str(), text: str(), contact: str() }),
  beforeAfter: z.object({ h2: str(), lead: str() }),
});

const aPropos = z.object({
  page: z.literal('a-propos'),
  ...base,
  founder: z.object({ h2: str(), name: str(), role: str(), bio: z.array(str()).min(1).max(4), photo: str() }),
  experience: z.object({ h2: str(), items: z.array(titleText).length(3) }),
  company: z.object({ h2: str(), paragraphs: z.array(str()).min(1).max(4) }),
});

const contact = z.object({
  page: z.literal('contact'),
  ...base,
  details: z.object({ h2: str(), email: str(), phone: str(), address: str(), hours: str() }),
  form: z.object({ h2: str(), lead: str() }),
  booking: titleText,
});

const index = z.object({
  page: z.enum(['services', 'secteurs', 'realisations', 'ressources', '404', 'styleguide']),
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
  schema: z.discriminatedUnion('page', [
    accueil,
    diagnostic,
    outils,
    calculateur,
    autoevaluation,
    approche,
    confiance,
    aPropos,
    contact,
    index,
    prose,
  ]),
});

export const collections = { services, secteurs, cas, blogue, pages };
