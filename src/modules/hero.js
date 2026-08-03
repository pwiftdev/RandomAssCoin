import { dieSVG, assSVG, starSVG } from '../lib/doodles.js';
import { rand, randInt, pick, sign } from '../lib/random.js';

export function initHero({ gsap, ScrollTrigger, reduced }) {
  const hero = document.querySelector('.hero');
  const scatter = hero.querySelector('[data-hero-scatter]');
  const bg = hero.querySelector('[data-hero-bg]');
  const coin = hero.querySelector('[data-coin]');
  const title = hero.querySelector('.hero__title');
  const cue = hero.querySelector('[data-scrollcue]');

  /* ---------------------------------------------------------------------
     Scatter a pile of dice and doodles behind the type. Each gets its own
     parallax depth so the whole field separates as you move/scroll.
     --------------------------------------------------------------------- */

  /* Three nested layers per piece, so the transforms never fight:
     .par  → scroll parallax (y)
     .pt   → pointer parallax (x/y)
     svg   → its own tumble + float                                       */

  const junk = [];
  const COUNT = window.innerWidth < 700 ? 8 : 16;

  for (let i = 0; i < COUNT; i++) {
    const size = rand(38, 130);
    const kind = i % 6 === 0 ? 'ass' : i % 7 === 3 ? 'star' : 'die';

    const par = document.createElement('div');
    par.className = 'par';
    const pt = document.createElement('div');
    pt.className = 'pt';
    pt.innerHTML =
      kind === 'ass' ? assSVG(size) : kind === 'star' ? starSVG() : dieSVG(randInt(1, 6), size);

    const svg = pt.firstElementChild;
    if (kind === 'star') {
      svg.style.width = `${size}px`;
      svg.style.height = `${size}px`;
      svg.style.color = pick(['var(--gold)', 'var(--pink)', 'var(--cyan)']);
    }

    par.style.left = `${rand(-4, 94)}%`;
    par.style.top = `${rand(-6, 92)}%`;
    par.style.opacity = String(rand(0.35, 1));

    par.appendChild(pt);
    scatter.appendChild(par);
    junk.push({ el: par, inner: pt, art: svg, depth: rand(0.15, 1), spin: rand(8, 40) * sign() });
  }

  if (!reduced) {
    junk.forEach(({ el, art, depth, spin }) => {
      gsap.set(art, { rotate: rand(-30, 30) });
      // Slow permanent tumble.
      gsap.to(art, {
        rotate: `+=${spin * 12}`,
        duration: rand(24, 70),
        ease: 'none',
        repeat: -1,
      });
      gsap.to(art, {
        yPercent: rand(-24, 24),
        xPercent: rand(-18, 18),
        duration: rand(5, 12),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: rand(0, 3),
      });
      // Scroll parallax — deeper pieces lag further behind.
      gsap.to(el, {
        y: () => -depth * window.innerHeight * 0.75,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    });
  }

  /* ---------------------------------------------------------------------
     Pointer parallax — the type layers, the coin and the background all
     drift at different rates.
     --------------------------------------------------------------------- */

  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    const layers = [
      ...title.querySelectorAll('[data-par]'),
    ].map((el) => ({ el, k: parseFloat(el.dataset.par) * 40 }));

    const movers = [
      { el: bg, k: 26 },
      ...layers,
      ...junk.map(({ inner, depth }) => ({ el: inner, k: depth * 62 })),
    ].map((m) => ({
      ...m,
      x: gsap.quickTo(m.el, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(m.el, 'y', { duration: 0.9, ease: 'power3' }),
    }));

    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(-nx * m.k);
        m.y(-ny * m.k);
      });
      gsap.to(coin, {
        rotate: nx * 26,
        scale: 1 + Math.abs(ny) * 0.08,
        duration: 0.8,
        ease: 'power3',
      });
    });
  }

  /* ---------------------------------------------------------------------
     The coin spins on click. Every click, a different number of turns.
     --------------------------------------------------------------------- */

  coin.addEventListener('click', () => {
    gsap.fromTo(
      coin,
      { rotate: 0 },
      { rotate: 360 * randInt(2, 6) * sign(), duration: rand(0.8, 1.8), ease: 'power4.out' }
    );
  });

  /* ---------------------------------------------------------------------
     Entrance
     --------------------------------------------------------------------- */

  document.addEventListener('rac:enter', () => {
    if (reduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.from('.hero__title .line--1', { yPercent: 130, rotate: -12, duration: 1, opacity: 0 })
      .from(
        '.hero__title .line--2 em',
        { scale: 0.2, rotate: 22, opacity: 0, duration: 1.1, ease: 'back.out(2.2)' },
        '-=0.75'
      )
      .from(coin, { scale: 0, rotate: -540, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.95')
      .from('.hero__title .line--3', { yPercent: -130, opacity: 0, duration: 0.9 }, '-=0.9')
      .from('.hero__sub', { y: 40, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero__cta > *', { y: 30, opacity: 0, stagger: 0.09, duration: 0.6 }, '-=0.45')
      .from(scatter.children, { scale: 0, opacity: 0, stagger: { amount: 0.6, from: 'random' }, duration: 0.8 }, '-=1.2');

    gsap.to(cue, { y: 8, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  /* ---------------------------------------------------------------------
     Scroll-out: the title splits apart, the background over-scrolls.
     --------------------------------------------------------------------- */

  if (reduced) return;

  gsap.to(bg, {
    yPercent: 22,
    scale: 1.25,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap
    .timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: 0.8 },
    })
    .to('.hero__title .line--1', { xPercent: -34, rotate: -8 }, 0)
    .to('.hero__title .line--2', { scale: 1.35 }, 0)
    .to('.hero__title .line--3', { xPercent: 40, rotate: 9 }, 0)
    .to('.hero__sub', { yPercent: 90, opacity: 0 }, 0)
    .to(cue, { opacity: 0 }, 0);
}
