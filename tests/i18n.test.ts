import { describe, it, expect } from 'vitest';
import { t, altPath, htmlLang } from '../src/i18n';

describe('i18n', () => {
  it('returns dictionaries with mirrored keys', () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) ? keys(v).map((s) => `${k}.${s}`) : [k]);
    expect(keys(t('pt'))).toEqual(keys(t('en')));
  });
  it('altPath swaps locales', () => {
    expect(altPath('pt')).toBe('/en/');
    expect(altPath('en')).toBe('/');
  });
  it('htmlLang maps to BCP47', () => {
    expect(htmlLang('pt')).toBe('pt-BR');
    expect(htmlLang('en')).toBe('en');
  });
});
