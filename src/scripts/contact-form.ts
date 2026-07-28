export function initContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !btn) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    status.textContent = status.dataset.sending ?? '';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const body = (await res.json()) as { ok: boolean };
      if (!res.ok || !body.ok) throw new Error('send_failed');
      form.reset();
      status.textContent = status.dataset.success ?? '';
    } catch {
      status.textContent = `${status.dataset.error ?? ''} ${status.dataset.mailto ?? ''}`.trim();
    } finally {
      btn.disabled = false;
    }
  });
}
