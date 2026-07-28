export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContact } from '../../lib/validate-contact';

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }
  const result = validateContact(data);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);
  if (result.value.website) return json({ ok: true }); // honeypot: finge sucesso
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: import.meta.env.CONTACT_FROM ?? 'Empirika <onboarding@resend.dev>',
    to: import.meta.env.CONTACT_TO ?? 'paulinhoerry@gmail.com',
    replyTo: result.value.email,
    subject: `[site] ${result.value.name}${result.value.company ? ' — ' + result.value.company : ''}`,
    text: `Nome: ${result.value.name}\nE-mail: ${result.value.email}\nEmpresa: ${result.value.company ?? '-'}\n\n${result.value.message}`,
  });
  if (error) {
    console.error('[contact] resend error', error);
    return json({ ok: false }, 502);
  }
  return json({ ok: true });
};
