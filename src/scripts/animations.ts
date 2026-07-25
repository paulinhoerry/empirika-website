import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: the one authored focal moment on the page — title lines stagger up,
  // then kicker/subtitle/CTA follow. Duration trimmed to 0.8s to sit inside
  // impeccable's "authored focal entrance" band (500-800ms); see animate.md.
  gsap.from('[data-animate="hero"] h1 > span', {
    yPercent: 60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
  });
  // Kicker, subtitle and CTA are all direct children of the hero section in
  // the current markup, so `> p, > a` still matches all three in document
  // order (kicker, subtitle, CTA) and they follow the title as one group.
  gsap.from('[data-animate="hero"] > p, [data-animate="hero"] > a', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    delay: 0.5,
    stagger: 0.1,
  });

  // Sections: quiet supporting reveals on scroll, not repeats of the hero's
  // drama (animate.md: "prefer one rehearsed focal sequence to repeated
  // section reveals"; don't reinterpret every scrolled section as a
  // staggered list). Distance/duration/stagger are pulled in from the
  // brief's defaults accordingly.
  //
  // Each section wraps its whole content in a single `.mx-auto` container
  // (Task 7), so animating `el.children` directly would only ever find that
  // one wrapper — nothing to stagger. The wrapper carries an explicit
  // `data-animate-children` marker (set in each section component) so the
  // stagger target is a semantic contract, not inferred from sibling count;
  // falls back to `el` for any section that doesn't opt in.
  document.querySelectorAll<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
    const target = el.querySelector<HTMLElement>('[data-animate-children]') ?? el;
    gsap.from(target.children, {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });
  });
});
