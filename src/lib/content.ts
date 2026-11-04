/**
 * Accès typé au contenu, typographie appliquée.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/routes';
import { typo } from './typo';

type Collection = 'services' | 'secteurs' | 'cas' | 'blogue' | 'pages';

/** Applique la typographie à toutes les chaînes d'un objet (récursif). */
export function deepTypo<T>(value: T, lang: Lang): T {
  if (typeof value === 'string') return typo(value, lang) as T;
  if (Array.isArray(value)) return value.map((v) => deepTypo(v, lang)) as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepTypo(v, lang);
    return out as T;
  }
  return value;
}

/** Clé d'une entrée (nom du fichier sans la langue). */
export function keyOf(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

export function langOf(entry: { id: string }): Lang {
  return entry.id.startsWith('en/') ? 'en' : 'fr';
}

/** Entrées d'une collection dans une langue, triées par « order » si présent. */
export async function listEntries<C extends Collection>(collection: C, lang: Lang): Promise<CollectionEntry<C>[]> {
  const all = (await getCollection(collection, (e: { id: string }) => langOf(e) === lang)) as CollectionEntry<C>[];
  return all
    .map((e) => ({ ...e, data: deepTypo(e.data, lang) }))
    .sort((a, b) => {
      const oa = (a.data as { order?: number }).order ?? 0;
      const ob = (b.data as { order?: number }).order ?? 0;
      return oa - ob || a.id.localeCompare(b.id);
    });
}

/** Une entrée par clé et langue (erreur explicite si absente). */
export async function getOne<C extends Collection>(collection: C, key: string, lang: Lang): Promise<CollectionEntry<C>> {
  const entry = (await getEntry(collection, `${lang}/${key}`)) as CollectionEntry<C> | undefined;
  if (!entry) throw new Error(`[contenu] ${collection}/${lang}/${key}.md introuvable`);
  return { ...entry, data: deepTypo(entry.data, lang) };
}

type PageData = CollectionEntry<'pages'>['data'];
export type PageName = PageData['page'];
/** Membre de l'union dont le discriminant « page » accepte P (gère les schémas à plusieurs valeurs). */
type PageOf<P extends PageName, D = PageData> = D extends { page: infer K } ? (P extends K ? D : never) : never;

/** Données d'une page fixe, typées selon son schéma. */
export async function getPage<P extends PageName>(
  page: P,
  lang: Lang,
): Promise<{ entry: CollectionEntry<'pages'>; data: PageOf<P> }> {
  const entry = await getOne('pages', page, lang);
  if (entry.data.page !== page) throw new Error(`[contenu] pages/${lang}/${page}.md : « page » doit valoir ${page}`);
  return { entry, data: entry.data as PageOf<P> };
}
