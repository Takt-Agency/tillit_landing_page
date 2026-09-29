type Tier = { min: number; max: number; price: number };

export const ZEN_TIERS: Tier[] = [
  { min: 100, max: 300, price: 2.99 },
  { min: 301, max: 500, price: 4.99 },
  { min: 501, max: 1000, price: 9.99 },
  { min: 1001, max: 2000, price: 19.99 },
  { min: 2001, max: 3000, price: 29.99 },
  { min: 3001, max: 4000, price: 39.99 },
  { min: 4001, max: 5000, price: 49.99 },
];

export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 5000;
export const NOTE_FREE_LIMIT = 1500;
export const FRANCECONNECT_FEE = 1.5;

/** Banque de France — taux effectifs moyens & seuils de l'usure (3ᵉ trim. 2026). */
type RateBracket = { max: number; rate: number };

export const CONSO_BRACKETS: RateBracket[] = [
  { max: 3000, rate: 17.65 },
  { max: Infinity, rate: 11.75 },
];

export const REVOLV_BRACKETS: RateBracket[] = [
  { max: 3000, rate: 23.53 },
  { max: Infinity, rate: 15.67 },
];

export function bracketRate(amount: number, brackets: RateBracket[]): number {
  const b = brackets.find((br) => amount <= br.max);
  return b ? b.rate : brackets[brackets.length - 1].rate;
}

export function zenPrice(amount: number): number {
  if (amount <= 0) return 0;
  const tier = ZEN_TIERS.find((t) => amount >= t.min && amount <= t.max);
  return tier ? tier.price : ZEN_TIERS[ZEN_TIERS.length - 1].price;
}

export function zenTierIndex(amount: number): number {
  return ZEN_TIERS.findIndex((t) => amount >= t.min && amount <= t.max);
}

export function loanInterest(principal: number, months: number, annualRatePct: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return 0;
  const monthly = (principal * r) / (1 - Math.pow(1 + r, -months));
  return Math.max(0, monthly * months - principal);
}

/** Monthly amount rounded down to the cent; the last instalment absorbs the difference. */
export function instalments(amount: number, months: number) {
  const cents = Math.round(amount * 100);
  const monthlyCents = Math.floor(cents / months);
  const lastCents = cents - monthlyCents * (months - 1);
  let remaining = cents;
  const rows = Array.from({ length: months }, (_, i) => {
    const due = i === months - 1 ? lastCents : monthlyCents;
    remaining -= due;
    return { n: i + 1, amount: due / 100, remaining: remaining / 100 };
  });
  return { monthly: monthlyCents / 100, last: lastCents / 100, rows };
}

// Pass lang = 'en' on English pages: €1,500.00 instead of 1 500,00 €.
const LOCALE = { fr: 'fr-FR', en: 'en-GB' } as const;

export const eur = (v: number, lang: 'fr' | 'en' = 'fr') =>
  new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(v);

export const eurWhole = (v: number, lang: 'fr' | 'en' = 'fr') =>
  new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 0 }).format(v);

export const rateFmt = (v: number, lang: 'fr' | 'en' = 'fr') =>
  new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
