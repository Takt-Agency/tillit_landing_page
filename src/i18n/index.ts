import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { fr } from '../lib/typo';

export type Lang = 'fr' | 'en';

/**
 * French path → English path. Every page exists in both languages; the English
 * slugs are the ones of the reference site (tillitapp.fr/en/…).
 */
export const ROUTE_PAIRS: [fr: string, en: string][] = [
  ['/', '/en/'],
  ['/notre-histoire', '/en/our-story'],
  ['/comment-ca-marche', '/en/how-it-works'],
  ['/tarifs', '/en/pricing'],
  ['/confiance', '/en/loan-record-and-trusted-third-party'],
  ['/difference', '/en/expense-splitting-or-lending'],
  ['/recours', '/en/if-it-gets-stuck'],
  ['/cas-usage', '/en/use-cases'],
  ['/blog', '/en/advice'],
  ['/article-preter-avant-virement', '/en/before-you-transfer-the-money'],
  ['/article-imprevu-echeancier', '/en/when-repayment-gets-hard'],
  ['/faq', '/en/faq'],
  ['/contact', '/en/contact'],
  ['/confirmation', '/en/thank-you'],
  ['/prototype', '/en/prototype'],
  ['/mentions-legales', '/en/legal-notice'],
  ['/conditions', '/en/terms'],
  ['/confidentialite', '/en/privacy'],
  ['/cookies', '/en/cookies'],
  ['/404', '/en/404'],
];

const FR_TO_EN = new Map(ROUTE_PAIRS);
const EN_TO_FR = new Map(ROUTE_PAIRS.map(([f, e]) => [e, f]));

const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

export function langOf(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

/**
 * Localise a French link (path, optional #hash / ?query) for the given language.
 * `localize('/tarifs#signature', 'en')` → `/en/pricing#signature`,
 * `localize('/#waitlist', 'en')` → `/en/#waitlist`.
 */
export function localize(frHref: string, lang: Lang): string {
  if (lang === 'fr' || !frHref.startsWith('/')) return frHref;
  const m = frHref.match(/^([^?#]*)(.*)$/)!;
  const path = trimSlash(m[1] || '/');
  const en = FR_TO_EN.get(path);
  return (en ?? `/en${path === '/' ? '/' : path}`) + m[2];
}

/** The same page in the other language (used by the FR/EN switcher). */
export function switchLang(pathname: string, hash: string, target: Lang): string {
  const current = langOf(pathname);
  if (current === target) return pathname + hash;
  if (target === 'en') {
    const en = FR_TO_EN.get(trimSlash(pathname));
    return (en ?? '/en/404') + (en ? hash : '');
  }
  const path = pathname === '/en' ? '/en/' : pathname;
  const frPath = EN_TO_FR.get(path) ?? EN_TO_FR.get(trimSlash(path));
  return (frPath ?? '/404') + (frPath ? hash : '');
}

/** Current language, read from the URL: every English page lives under /en/. */
export function useLang(): Lang {
  return langOf(useLocation().pathname);
}

/**
 * Link helper: `const l = useLocalize();` then `<Link to={l('/tarifs')}>`.
 * Always write the FRENCH path; it is mapped to the English one on /en/ pages.
 */
export function useLocalize() {
  const lang = useLang();
  return useCallback((frHref: string) => localize(frHref, lang), [lang]);
}

/** Typography for the current language: French non-breaking spaces only in French. */
export function typo(text: string, lang: Lang): string {
  return lang === 'fr' ? fr(text) : text;
}

/** Pick the right copy: `const t = pick(COPY, lang)` with `COPY = { fr: {...}, en: {...} }`. */
export function pick<T>(copy: Record<Lang, T>, lang: Lang): T {
  return copy[lang];
}
