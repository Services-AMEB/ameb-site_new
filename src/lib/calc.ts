/**
 * Ordre de grandeur du coût de la ressaisie (brief §5.5, refonte ADR-012 : aucun chiffre exact).
 * employés × heures par semaine × 48 semaines × coût horaire, affiché en fourchette arrondie.
 */
export const WEEKS_PER_YEAR = 48;

export const CALC_LIMITS = {
  employees: { min: 1, max: 200, step: 1, default: 1 },
  hours: { min: 0, max: 20, step: 0.5, default: 5 },
  rate: { min: 20, max: 150, step: 1, default: 45 },
} as const;

export type CalcInput = { employees: number; hours: number; rate: number };

export function annualCost({ employees, hours, rate }: CalcInput): number {
  return employees * hours * WEEKS_PER_YEAR * rate;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Lit et borne les valeurs (ex. champs du formulaire). */
export function parseInput(get: (k: keyof CalcInput) => string | null | undefined): CalcInput {
  const read = (k: keyof CalcInput) => {
    const raw = get(k);
    const lim = CALC_LIMITS[k];
    if (raw == null || raw === '') return lim.default;
    const n = Number(String(raw).replace(',', '.'));
    const stepped = Math.round(n / lim.step) * lim.step;
    return clamp(stepped, lim.min, lim.max);
  };
  return { employees: read('employees'), hours: read('hours'), rate: read('rate') };
}

/** Arrondit à un pas « lisible » selon la grandeur (500, 1 000, 5 000, 10 000). */
export function nice(value: number): number {
  const step = value < 5000 ? 500 : value < 20000 ? 1000 : value < 100000 ? 5000 : 10000;
  return Math.round(value / step) * step;
}

/** Fourchette approximative (±10 %, arrondie). lo === hi quand l'arrondi les confond. */
export function approxRange(value: number): { lo: number; hi: number } {
  return { lo: nice(value * 0.9), hi: nice(value * 1.1) };
}

export function formatMoney(value: number, lang: 'fr' | 'en'): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value);
}

/** « 10 000 à 12 000 $ » / « $10,000 to $12,000 », ou « environ 500 $ » quand la fourchette se confond. */
export function formatRange(value: number, lang: 'fr' | 'en', words: { about: string; to: string }): string {
  const { lo, hi } = approxRange(value);
  if (lo === hi) return `${words.about} ${formatMoney(hi, lang)}`;
  if (lang === 'fr') return `${formatMoney(lo, lang).replace(/\s?\$$/, '')} ${words.to} ${formatMoney(hi, lang)}`;
  return `${formatMoney(lo, lang)} ${words.to} ${formatMoney(hi, lang)}`;
}
