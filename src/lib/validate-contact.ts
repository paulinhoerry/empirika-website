export interface ContactInput {
  name: string;
  email: string;
  message: string;
  company?: string;
  website?: string; // honeypot — humanos não preenchem
}

type Result = { ok: true; value: ContactInput } | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(data: unknown): Result {
  if (typeof data !== 'object' || data === null) return { ok: false, errors: ['payload'] };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];
  const name = typeof d.name === 'string' ? d.name.trim() : '';
  const email = typeof d.email === 'string' ? d.email.trim() : '';
  const message = typeof d.message === 'string' ? d.message.trim() : '';
  const company = typeof d.company === 'string' ? d.company.trim().slice(0, 100) : undefined;
  const website = typeof d.website === 'string' && d.website !== '' ? d.website : undefined;
  if (name.length < 2 || name.length > 100) errors.push('name');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (message.length < 10 || message.length > 5000) errors.push('message');
  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { name, email, message, company, website } };
}
