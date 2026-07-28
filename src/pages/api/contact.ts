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

  // Turnstile: default é a chave-secreta de teste da Cloudflare (sempre passa).
  const token = (data as Record<string, unknown>)['cf-turnstile-response'];
  const secret = import.meta.env.TURNSTILE_SECRET_KEY ?? '1x0000000000000000000000000000000AA';
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: typeof token === 'string' ? token : '' }),
  });
  const captcha = (await verify.json()) as { success: boolean };
  if (!captcha.success) return json({ ok: false, error: 'captcha' }, 403);
  if (!import.meta.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY ausente');
    return json({ ok: false }, 502);
  }
  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: import.meta.env.CONTACT_FROM ?? 'Empirika <onboarding@resend.dev>',
      to: import.meta.env.CONTACT_TO ?? 'paulo@empirika.com.br',
      replyTo: result.value.email,
      subject: `[site] ${result.value.name}${result.value.company ? ' — ' + result.value.company : ''}`,
      text: `Nome: ${result.value.name}\nE-mail: ${result.value.email}\nEmpresa: ${result.value.company ?? '-'}\n\n${result.value.message}`,
    });
    if (error) {
      console.error('[contact] resend error', error);
      return json({ ok: false }, 502);
    }
  } catch (err) {
    console.error('[contact] resend exception', err);
    return json({ ok: false }, 502);
  }
  return json({ ok: true });
};
