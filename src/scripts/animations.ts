import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAnimations(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => (el.style.opacity = '1'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-parallax-group]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      gsap.to(child, {
        y: () => -16 * (i + 1),
        ease: 'none',
        scrollTrigger: { trigger: group, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });
  });

  const cue = document.querySelector('[data-scroll-cue]');
  if (cue) {
    gsap.to(cue, { opacity: 0, scrollTrigger: { trigger: '#hero', start: 'top top', end: '30% top', scrub: true } });
  }
}
