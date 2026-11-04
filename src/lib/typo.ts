/**
 * Typographie française (Québec) appliquée automatiquement au texte affiché.
 *
 * - espace insécable (U+00A0) avant « : ; ? ! » et à l'intérieur des « guillemets »;
 * - espace insécable avant « $ » et « % » précédés d'un chiffre;
 * - séparateur de milliers insécable (« 3 000 $ »).
 *
 * Le texte anglais est retourné tel quel. Les URL et heures (« https: », « 9:30 »)
 * ne sont pas touchées : on n'ajoute une espace avant « : » que si le caractère
 * précédent est une lettre et que le suivant est une espace ou la fin du texte.
 */
import type { Lang } from '../i18n/routes';

export const NBSP = ' ';

export function typoFr(input: string): string {
  return (
    input
      // espace ordinaire (ou fine) avant ; : ! ? » → insécable
      .replace(/[  ]+([;:!?»])/g, `${NBSP}$1`)
      // lettre collée à ; ! ? (fin de mot) → insécable
      .replace(/([\p{L}\p{N})\]])([;!?])(?=\s|$|[»")\]])/gu, `$1${NBSP}$2`)
      // lettre collée à : suivie d'une espace ou de la fin → insécable
      .replace(/(\p{L})(:)(?=\s|$)/gu, `$1${NBSP}$2`)
      // « suivi d'une espace ordinaire ou collé → insécable
      .replace(/«[  ]*/g, `«${NBSP}`)
      // collé avant » → insécable
      .replace(/([^\s ])»/g, `$1${NBSP}»`)
      // chiffres + $ ou % → insécable
      .replace(/(\d)[  ]?([$%])/g, `$1${NBSP}$2`)
      // milliers : « 10 800 » → insécable
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
  );
}

export function typo(input: string, lang: Lang): string {
  return lang === 'fr' ? typoFr(input) : input;
}

/** Deux-points selon la langue (« : » précédé d'une insécable en français). */
export function colon(lang: Lang): string {
  return lang === 'fr' ? `${NBSP}:` : ':';
}
