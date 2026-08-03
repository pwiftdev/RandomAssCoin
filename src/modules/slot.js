import { rand, randInt, pick, shuffle, RANDOM_STATS } from '../lib/random.js';
import { EMOJI, dieSVG, assSVG } from '../lib/doodles.js';

const BIG = () =>
  pick([
    `${randInt(1, 100)}%`,
    `${randInt(2, 999)}M`,
    '∞',
    '0',
    '🎲',
    `${randInt(1, 9)}.${randInt(0, 9)}B`,
    'ASS',
    'YES',
    `${randInt(1, 6)}`,
    pick(EMOJI),
  ]);

// The last three carry art, because "50% left dice" only really lands when
// there's an actual left dice sitting on the card.
const CARDS = [
  { n: '100%', label: 'TOKENS' },
  { n: '0%', label: 'EXPLANATION' },
  { n: '50%', label: 'LEFT DICE', art: dieSVG(2, 66), tilt: -12 },
  { n: '50%', label: 'RIGHT DICE', art: dieSVG(5, 66), tilt: 12 },
  { n: '100%', label: 'ASS', art: assSVG(46) },
];

export function initSlot({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.tok');
  const reelsHost = section.querySelector('[data-slot-reels]');
  const button = section.querySelector('[data-slot-go]');
  const grid = section.querySelector('[data-tok-grid]');

  /* ---- static cards ---- */
  grid.innerHTML = CARDS.map(
    ({ n, label, art, tilt = 0 }) => `<div class="tok__card">
        ${art ? `<span class="tok__art" style="--tilt:${tilt}deg">${art}</span>` : ''}
        <b>${n}</b><span>${label}</span>
      </div>`
  ).join('');

  /* ---- three reels of nonsense ---- */
  const CELLS = 14;
  const reels = [0, 1, 2].map(() => {
    const reel = document.createElement('div');
    reel.className = 'reel';
    const strip = document.createElement('div');
    strip.className = 'reel__strip';
    strip.innerHTML = Array.from(
      { length: CELLS },
      () =>
        `<div class="reel__cell"><span class="reel__big">${BIG()}</span><span class="reel__small">${pick(
          RANDOM_STATS
        )}</span></div>`
    ).join('');
    reel.appendChild(strip);
    reelsHost.appendChild(reel);
    return strip;
  });

  const cellH = () => reels[0].firstElementChild.offsetHeight || 180;

  let spinning = false;

  const spin = () => {
    if (spinning || reduced) return;
    spinning = true;

    reels.forEach((strip, i) => {
      // Refresh the contents mid-blur so it never repeats a result.
      [...strip.children].forEach((cell) => {
        cell.querySelector('.reel__big').textContent = BIG();
        cell.querySelector('.reel__small').textContent = pick(RANDOM_STATS);
      });

      const stopAt = randInt(2, CELLS - 3);
      gsap.fromTo(
        strip,
        { y: 0 },
        {
          y: -stopAt * cellH(),
          duration: 1.2 + i * 0.45 + rand(0, 0.3),
          ease: 'power4.out',
          onComplete: () => {
            if (i === reels.length - 1) spinning = false;
            gsap.fromTo(
              strip.parentElement,
              { scale: 1.06 },
              { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
            );
          },
        }
      );
    });
  };

  button.addEventListener('click', spin);

  if (reduced) return;

  // Auto-spin the first time it comes into view.
  ScrollTrigger.create({ trigger: section, start: 'top 65%', once: true, onEnter: spin });

  // Title halves slide past each other.
  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: 1 },
    })
    .fromTo(
      '.tok__title span:first-child',
      { xPercent: -40, opacity: 0 },
      { xPercent: 0, opacity: 1 },
      0
    )
    .fromTo(
      '.tok__title-alt',
      { xPercent: 55, rotate: 22, opacity: 0 },
      { xPercent: 0, rotate: -3, opacity: 1 },
      0
    );

  // Cards drop in, out of order.
  gsap.fromTo(
    shuffle([...grid.children]),
    { y: 70, autoAlpha: 0, rotate: () => rand(-8, 8) },
    {
      y: 0,
      autoAlpha: 1,
      rotate: 0,
      duration: 0.7,
      ease: 'back.out(1.7)',
      stagger: 0.07,
      scrollTrigger: { trigger: grid, start: 'top 82%' },
    }
  );

  gsap.to('.slot', {
    rotate: 1.4,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
}
