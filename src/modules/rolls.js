import { dieSVG } from '../lib/doodles.js';
import { rand, randInt, sign } from '../lib/random.js';

/**
 * The marketing department. One die decides the day's output. Rolling a 6
 * means "roll again", so the section will happily roll itself in a chain
 * until it lands on something that isn't a 6.
 */

const OUTCOMES = [
  { face: 1, act: 'POST NOTHING', note: 'silence is a strategy' },
  { face: 2, act: 'BAD MEME', note: 'made in 4 minutes' },
  { face: 3, act: 'WORSE MEME', note: 'made in 40 seconds' },
  { face: 4, act: 'RANDOM GIVEAWAY', note: 'to a random person' },
  { face: 5, act: 'CHANGE THE WEBSITE', note: 'this website. right now.' },
  { face: 6, act: 'ROLL AGAIN', note: 'the loop is the plan' },
];

export function initRolls({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.rolls');
  const dieBox = section.querySelector('[data-roll-die]');
  const button = section.querySelector('[data-roll-go]');
  const list = section.querySelector('[data-roll-list]');
  const chain = section.querySelector('[data-roll-chain]');
  const ghost = section.querySelector('[data-roll-ghost]');

  /* ---- the six outcomes ---- */
  list.innerHTML = OUTCOMES.map(
    ({ face, act, note }) => `<li class="rolls__item" data-face="${face}">
        <span class="rolls__pip">${dieSVG(face, 44)}</span>
        <span class="rolls__act">${act}</span>
        <span class="rolls__note">${note}</span>
      </li>`
  ).join('');

  const items = [...list.children];
  const setDie = (face, size = 260) => {
    dieBox.innerHTML = dieSVG(face, size);
  };

  setDie(randInt(1, 6));

  /* ---- rolling ---- */

  let rolling = false;
  let chainCount = 0;

  const land = (face) => {
    list.classList.add('has-result');
    items.forEach((el) => el.classList.toggle('is-hit', +el.dataset.face === face));
    ghost.textContent = String(face);

    if (!reduced) {
      const hit = items[face - 1];
      gsap.fromTo(
        hit,
        { scale: 0.94 },
        { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }
      );
      gsap.fromTo(ghost, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' });
    }

    // A 6 means roll again — so it does, on its own.
    if (face === 6) {
      chainCount++;
      chain.textContent = `ROLLED AGAIN ×${chainCount}`;
      gsap.delayedCall(reduced ? 0.4 : 0.85, roll);
      return;
    }

    chainCount = 0;
    chain.textContent = `TODAY: ${OUTCOMES[face - 1].act}`;
  };

  function roll() {
    if (rolling) return;
    rolling = true;

    const face = randInt(1, 6);

    if (reduced) {
      setDie(face);
      rolling = false;
      land(face);
      return;
    }

    list.classList.remove('has-result');
    items.forEach((el) => el.classList.remove('is-hit'));

    // Face flickers while it tumbles, then settles on the real result.
    const flicker = setInterval(() => setDie(randInt(1, 6)), 70);

    gsap
      .timeline({
        onComplete: () => {
          clearInterval(flicker);
          setDie(face);
          rolling = false;
          land(face);
        },
      })
      .to(dieBox, {
        rotate: `+=${360 * randInt(2, 4) * sign()}`,
        y: -60,
        scale: 0.82,
        duration: 0.42,
        ease: 'power2.out',
      })
      .to(dieBox, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'bounce.out',
      });
  }

  button.addEventListener('click', roll);
  dieBox.addEventListener('click', roll);

  /* ---- entrance + scroll ---- */

  if (reduced) {
    roll();
    return;
  }

  ScrollTrigger.create({ trigger: section, start: 'top 60%', once: true, onEnter: roll });

  gsap.fromTo(
    '.rolls__head > *',
    { yPercent: 60, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 72%' },
    }
  );

  gsap.fromTo(
    items,
    { x: () => rand(-60, 60), autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: list, start: 'top 85%' },
    }
  );

  // Die drifts against the scroll; the ghost numeral drifts with it.
  gsap.fromTo(
    dieBox.parentElement,
    { y: 40 },
    {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
    }
  );

  gsap.fromTo(
    ghost,
    { yPercent: 8, xPercent: -4 },
    {
      yPercent: -8,
      xPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.6 },
    }
  );
}
