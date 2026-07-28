import pt from './pt.json';
import en from './en.json';

export type Locale = 'pt' | 'en';
export type Dict = typeof pt;

const dicts: Record<Locale, Dict> = { pt, en: en as Dict };

export function t(locale: Locale): Dict {
  return dicts[locale];
}

export function altPath(locale: Locale): string {
  return locale === 'pt' ? '/en/' : '/';
}

export function htmlLang(locale: Locale): string {
  return locale === 'pt' ? 'pt-BR' : 'en';
}
