import pt from './pt.json';
import en from './en.json';

export type Dictionary = typeof pt;
export type Locale = 'pt' | 'en';

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
