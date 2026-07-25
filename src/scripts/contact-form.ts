const form = document.getElementById('contact-form') as HTMLFormElement | null;

if (form) {
  const status = form.querySelector('#form-status') as HTMLParagraphElement;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const d = form.dataset;

  const setFieldError = (input: HTMLInputElement | HTMLTextAreaElement, msg: string) => {
    const p = input.parentElement?.querySelector('.field-error') as HTMLParagraphElement | null;
    if (p) { p.textContent = msg; p.classList.toggle('hidden', msg === ''); }
    input.setAttribute('aria-invalid', msg === '' ? 'false' : 'true');
  };

  const validate = (): boolean => {
    let ok = true;
    for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')) {
      if (!el.value.trim()) { setFieldError(el, d.msgRequired ?? ''); ok = false; }
      else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) {
        setFieldError(el, d.msgEmail ?? ''); ok = false;
      } else setFieldError(el, '');
    }
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    status.textContent = d.msgSending ?? '';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      status.textContent = d.msgSuccess ?? '';
      form.reset();
    } catch {
      status.innerHTML = `${d.msgError ?? ''} <a class="underline" href="mailto:${d.contactEmail}">${d.contactEmail}</a>`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}
