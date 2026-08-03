import { dieSVG, EMOJI } from '../lib/doodles.js';
import {
  rand,
  randInt,
  pick,
  chance,
  shuffle,
  cycler,
  RANDOM_NOUNS,
  RANDOM_STATS,
  NONSENSE_LINES,
} from '../lib/random.js';

const MODS = ['', '', 'wall__card--ink', 'wall__card--ink', 'wall__card--pink', 'wall__card--cyan', 'wall__card--comic'];
const SPANS = ['', '', '', 'wall__card--tall', 'wall__card--wide'];

const BODIES = [
  () => `<span class="emo">${pick(EMOJI)}</span><small>no reason</small>`,
  () => `${dieSVG(randInt(1, 6), 62)}<small>rolled a ${randInt(1, 6)}</small>`,
  () => `<b>${pick(RANDOM_NOUNS)}</b>`,
  () => `<b>${randInt(2, 99)}%</b><small>${pick(['certainty', 'ass', 'unknown', 'humidity'])}</small>`,
  () => `<small>${pick(NONSENSE_LINES)}</small>`,
  () => `<b>ASS</b><small>that's it</small>`,
  () => `<span class="emo">🎲</span><b>${randInt(1, 6)}</b>`,
  () => `<b>?</b><small>we don't know either</small>`,
  () => `<b>${randInt(3, 900)}</b><small>${pick(RANDOM_STATS)}</small>`,
  () => `<span class="emo">${pick(EMOJI)}${pick(EMOJI)}</span>`,
  () => `<b>NO</b><small>and that's final</small>`,
  () => `<b>$RANDOM</b><small>ticker, obviously</small>`,
  () => `<span class="emo">🐴</span><small>the horse is real</small>`,
  () => `<b>SOON</b><small>or never</small>`,
];

// Cyclers instead of raw picks: every option shows up once before anything
// repeats, so the grid never fills with four identical cards.
const nextBodyFn = cycler(BODIES);
const nextBody = () => nextBodyFn()();
const nextMod = cycler(MODS);

export function initWall({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.wall');
  const grid = section.querySelector('[data-wall-grid]');
  const title = section.querySelector('[data-split]');

  /* ---- split the headline into per-letter spans ---- */
  title.innerHTML = title.textContent
    .split('')
    .map((c) => (c === ' ' ? ' ' : `<span class="ch">${c}</span>`))
    .join('');

  /* ---- build the grid ---- */
  const COUNT = 18;
  const cards = [];

  const shyIndex = randInt(4, COUNT - 2);

  for (let i = 0; i < COUNT; i++) {
    const card = document.createElement('div');
    // Span + shy are structural and survive rerolls; the colour skin doesn't.
    card.dataset.fixed = [pick(SPANS), i === shyIndex ? 'wall__card--shy' : '']
      .filter(Boolean)
      .join(' ');
    card.className = ['wall__card', nextMod(), card.dataset.fixed].filter(Boolean).join(' ');
    card.innerHTML = nextBody();

    grid.appendChild(card);
    cards.push(card);
  }

  /* ---- clicking a card rerolls it ---- */
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.wall__card');
    if (!card) return;
    card.innerHTML = nextBody();
    card.className = ['wall__card', nextMod(), card.dataset.fixed].filter(Boolean).join(' ');
    if (reduced) return;
    // Scale only — `rotate` belongs to the idle float tween below.
    gsap.fromTo(card, { scale: 0.78 }, { scale: 1, duration: 0.55, ease: 'back.out(2.5)' });
  });

  if (reduced) return;

  /* ---- the shy card dodges ---- */
  const shy = grid.querySelector('.wall__card--shy');
  if (shy) {
    shy.addEventListener('pointerenter', () => {
      gsap.to(shy, {
        x: rand(-140, 140),
        y: rand(-90, 90),
        rotate: rand(-20, 20),
        duration: 0.5,
        ease: 'back.out(2)',
      });
    });
  }

  /* ---- entrances ----
     fromTo, not from: ScrollTrigger.refresh() reverts `from` tweens to their
     start state and won't replay them, which leaves everything at scale 0.  */

  gsap.fromTo(
    title.querySelectorAll('.ch'),
    { yPercent: 120, rotate: () => rand(-40, 40), autoAlpha: 0 },
    {
      yPercent: 0,
      rotate: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: 'back.out(2)',
      stagger: { amount: 0.6, from: 'random' },
      scrollTrigger: { trigger: section, start: 'top 78%' },
    }
  );

  gsap.fromTo(
    shuffle(cards),
    { scale: 0, rotate: () => rand(-90, 90), autoAlpha: 0 },
    {
      scale: 1,
      rotate: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: 'back.out(1.8)',
      stagger: { amount: 0.9, from: 'random' },
      scrollTrigger: { trigger: grid, start: 'top 85%' },
      // Idle float starts only once the entrance is done — otherwise the two
      // tweens fight over the same rotate/y.
      onComplete: startFloat,
    }
  );

  /* ---- gentle permanent float, each card on its own clock ---- */
  let floating = false;
  function startFloat() {
    if (floating) return;
    floating = true;
    cards.forEach((card) => {
      // The shy card owns its own x/y/rotate — don't fight it.
      if (card.classList.contains('wall__card--shy') || chance(0.55)) return;
      gsap.to(card, {
        y: rand(-14, 14),
        rotate: rand(-3, 3),
        duration: rand(3, 7),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: rand(0, 2),
      });
    });
  }

  /* ---- the whole grid skews as it passes ---- */
  gsap.fromTo(
    grid,
    { skewY: 3 },
    {
      skewY: -3,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
    }
  );
}
