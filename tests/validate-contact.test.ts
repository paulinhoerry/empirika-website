import { describe, it, expect } from 'vitest';
import { validateContact } from '../src/lib/validate-contact';

const valid = { name: 'Ana Souza', email: 'ana@empresa.com', company: 'Empresa', message: 'Quero automatizar meu faturamento.' };

describe('validateContact', () => {
  it('accepts a valid payload', () => {
    const r = validateContact(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.email).toBe('ana@empresa.com');
  });
  it('rejects non-object payloads', () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact('x').ok).toBe(false);
  });
  it('rejects bad email and short fields', () => {
    expect(validateContact({ ...valid, email: 'nope' }).ok).toBe(false);
    expect(validateContact({ ...valid, name: 'A' }).ok).toBe(false);
    expect(validateContact({ ...valid, message: 'curta' }).ok).toBe(false);
  });
  it('passes honeypot through untouched', () => {
    const r = validateContact({ ...valid, website: 'http://spam' });
    expect(r.ok && r.value.website).toBe('http://spam');
  });
});
