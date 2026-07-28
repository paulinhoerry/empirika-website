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
          target = self.progress * Math.max(0, video.duration - 0.05);
          apply();
          if (copy) {
            const fade = Math.min(1, self.progress * 2.2);
            gsap.set(copy, { opacity: 1 - fade, y: -48 * fade });
          }
        },
      });
      apply();
    })
    .catch(() => {
      /* fallback: poster estático segue visível, página totalmente usável */
    });
}
