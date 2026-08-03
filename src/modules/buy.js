import { rand, randInt, sign } from '../lib/random.js';

export function initBuy({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.buy');
  const bg = section.querySelector('[data-buy-bg]');
  const coin = section.querySelector('[data-buy-coin]');
  const no = section.querySelector('[data-dodge]');
  // Scoped, not a global '.btn--mega' / '.buy__title' selector — the audio
  // gate reuses .btn--mega, and a document-wide tween would hide it.
  const title = section.querySelector('.buy__title');
  const cta = section.querySelector('.btn--mega');

  if (reduced) return;

  // Sunburst spins forever, faster while the section is on screen.
  gsap.to(bg, { rotate: 360, duration: 90, ease: 'none', repeat: -1 });
  gsap.to(bg, {
    scale: 1.35,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
  });

  /* fromTo throughout — `from` + ScrollTrigger.refresh() leaves elements
     stranded at their start state. */

  // The coin rolls in from the left. Rotation lives on the inner <img> so the
  // scrub tween below can own the wrapper's transform without a fight.
  const coinArt = coin.querySelector('img');

  gsap.fromTo(
    coin,
    { xPercent: -180, autoAlpha: 0 },
    {
      xPercent: 0,
      autoAlpha: 1,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 70%' },
    }
  );

  gsap.fromTo(
    coinArt,
    { rotate: -260 },
    {
      rotate: 460,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    }
  );

  gsap.fromTo(
    title,
    { scale: 0.4, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: section, start: 'top 60%' },
    }
  );

  gsap.fromTo(
    cta,
    { yPercent: 60, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 55%' },
    }
  );

  // "DO NOT BUY" cannot be caught.
  let dodges = 0;
  const dodge = () => {
    dodges++;
    gsap.to(no, {
      x: rand(-260, 260),
      y: rand(-120, 120),
      rotate: rand(-25, 25),
      duration: 0.45,
      ease: 'back.out(2)',
    });
    if (dodges === 5) no.textContent = 'STOP IT';
    if (dodges === 9) no.textContent = 'FINE. BUY.';
    if (dodges > 12) {
      no.textContent = 'DO NOT BUY';
      dodges = 0;
    }
  };
  no.addEventListener('pointerenter', dodge);
  no.addEventListener('click', dodge);

  // Punch the coin.
  coin.addEventListener('click', () => {
    gsap.fromTo(
      coin,
      { scale: 1 },
      { scale: 1.18, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
    gsap.to(coinArt, {
      rotate: `+=${360 * randInt(1, 4) * sign()}`,
      duration: 1,
      ease: 'power4.out',
    });
  });
}
