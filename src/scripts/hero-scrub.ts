import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Adaptado do scrub-engine da skill scroll-world: o clipe é carregado como Blob
// (sempre seekable, mesmo em host sem byte-range) e o scroll dirige currentTime.
export function initHeroScrub(section: HTMLElement): void {
  const video = section.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video) return;
  const src = video.dataset.src;
  if (!src) return;
  // Desktop-only por decisão de projeto: no mobile/reduced-motion fica o poster.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
  if (reduced || !desktop) return;

  // Só quando o scrub vai acontecer: headline começa em outline e preenche no scroll.
  const fills = section.querySelectorAll<HTMLElement>('[data-line-fill]');
  gsap.set(fills, { clipPath: 'inset(-5% 100% -5% 0)' });

  fetch(src)
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    .then(
      (blob) =>
        new Promise<void>((resolve, reject) => {
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
          video.addEventListener('error', () => reject(new Error('video')), { once: true });
          video.src = URL.createObjectURL(blob);
          video.load();
        }),
    )
    .then(() => {
      gsap.registerPlugin(ScrollTrigger);
      const copy = section.querySelector<HTMLElement>('[data-hero-copy]');
      let target = 0;
      const apply = () => {
        // Nunca enfileira um seek enquanto o decoder resolve o anterior.
        if (video.seeking) return;
        if (Math.abs(video.currentTime - target) > 0.01) video.currentTime = target;
      };
      video.addEventListener('seeked', apply);
      video.addEventListener(
        'seeked',
        () => video.classList.add('has-clip'),
        { once: true },
      );
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          target = p * Math.max(0, video.duration - 0.05);
          apply();
          // Linhas preenchem em sequência (1ª: 0–35%, 2ª: 15–55% do scrub).
          const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
          const spans = [clamp01(p / 0.35), clamp01((p - 0.15) / 0.4)];
          fills.forEach((el, i) => {
            gsap.set(el, { clipPath: `inset(-5% ${100 * (1 - (spans[i] ?? 1))}% -5% 0)` });
          });
          // Copy sai de cena só no trecho final, antes do porto.
          if (copy) {
            const fade = clamp01((p - 0.72) / 0.23);
            gsap.set(copy, { opacity: 1 - fade, y: -48 * fade });
          }
        },
      });
      apply();
    })
    .catch(() => {
      /* fallback: poster estático segue visível e a headline volta a preenchida */
      gsap.set(fills, { clipPath: 'none' });
    });
}
