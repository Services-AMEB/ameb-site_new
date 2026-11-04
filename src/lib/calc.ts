/** Calculateur du coût de la ressaisie (formule du brief §5.5). */
export const WEEKS_PER_YEAR = 48;

export const CALC_LIMITS = {
  employees: { min: 1, max: 200, step: 1, default: 1 },
  hours: { min: 0, max: 20, step: 0.5, default: 5 },
  rate: { min: 1, max: 500, step: 1, default: 45 },
} as const;

export type CalcInput = { employees: number; hours: number; rate: number };

export function annualCost({ employees, hours, rate }: CalcInput): number {
  return employees * hours * WEEKS_PER_YEAR * rate;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Lit et borne les valeurs (ex. paramètres d'URL). */
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

export function formatMoney(value: number, lang: 'fr' | 'en'): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value);
}
