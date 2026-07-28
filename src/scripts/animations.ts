import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export function initAnimations(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => (el.style.opacity = '1'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Subiu acima de Serviços → volta ao topo (rebobina o hero em vez de arrastar).
  const services = document.querySelector<HTMLElement>('#capabilities');
  if (services && window.matchMedia('(pointer: fine)').matches) {
    let snapping = false;
    let lastY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        const up = y < lastY;
        lastY = y;
        if (snapping || !up || y <= 0) return;
        // Serviços inteiramente abaixo da viewport = estamos "acima" da seção.
        if (services.getBoundingClientRect().top > window.innerHeight) {
          snapping = true;
          const release = () => (snapping = false);
          setTimeout(release, 1400); // solta a trava mesmo se o tween morrer sem callback
          gsap.to(window, {
            scrollTo: 0,
            duration: 1.1,
            ease: 'power2.inOut',
            onComplete: release,
            onInterrupt: release,
          });
        }
      },
      { passive: true },
    );
  }

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
