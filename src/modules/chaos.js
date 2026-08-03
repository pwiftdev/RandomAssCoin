import { dieSVG, EMOJI } from '../lib/doodles.js';
import { rand, randInt, pick, chance, sign, CHAOS_COLORS } from '../lib/random.js';
import { shake } from './interrupt.js';

const POPUP_TITLES = ['ALERT', 'CONGRATULATIONS', 'SYSTEM', 'HELLO', 'IMPORTANT', 'ASS.EXE'];
const POPUP_BODIES = [
  'You are the 1,000,000th visitor. You have won a dice.',
  'A random number has been generated. It was 4.',
  'This window appeared for no reason. It will leave the same way.',
  'Your device is running perfectly. Suspicious.',
  'Doug says hi.',
  'Nothing is wrong. That is the problem.',
];
const POPUP_CTAS = ['SURE', 'OK???', 'FINE', 'WHATEVER', 'CLAIM ASS'];

/**
 * Everything that happens to you without asking. Runs on a loop that picks a
 * random event and a random gap, plus a few input-triggered ones.
 */
export function initChaos({ gsap, reduced }) {
  if (reduced) return;

  const layer = document.querySelector('[data-chaos-layer]');
  const flashbang = document.querySelector('[data-flashbang]');

  /* --------------------------------------------------------------------
     Fling a handful of junk across the screen
     -------------------------------------------------------------------- */

  const spray = (x = rand(0, innerWidth), y = rand(0, innerHeight), n = randInt(6, 14)) => {
    for (let i = 0; i < n; i++) {
      let el;
      if (chance(0.55)) {
        el = document.createElement('span');
        el.className = 'confetti';
        el.textContent = pick(EMOJI);
      } else {
        const box = document.createElement('div');
        box.innerHTML = dieSVG(randInt(1, 6), randInt(26, 58));
        el = box.firstElementChild;
      }
      layer.appendChild(el);

      gsap.set(el, { x, y, xPercent: -50, yPercent: -50 });
      gsap.to(el, {
        x: x + rand(-380, 380),
        y: y + rand(-300, 260),
        rotate: rand(-540, 540),
        scale: rand(0.5, 1.6),
        duration: rand(0.9, 1.8),
        ease: 'power2.out',
      });
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.5,
        delay: rand(0.6, 1.2),
        onComplete: () => el.remove(),
      });
    }
  };

  /* --------------------------------------------------------------------
     A popup barges in
     -------------------------------------------------------------------- */

  const popup = () => {
    if (layer.querySelectorAll('.popup').length >= 2) return;

    const el = document.createElement('div');
    el.className = 'popup';
    el.innerHTML = `
      <div class="popup__bar"><span>${pick(POPUP_TITLES)}</span><button aria-label="close">✕</button></div>
      <div class="popup__body">
        ${dieSVG(randInt(1, 6), 54)}
        <p>${pick(POPUP_BODIES)}</p>
        <button class="popup__cta">${pick(POPUP_CTAS)}</button>
      </div>`;

    layer.appendChild(el);

    // Position in px off the measured width — a percentage would push it off
    // the right edge on narrow screens.
    const w = el.offsetWidth;
    el.style.left = `${rand(10, Math.max(12, innerWidth - w - 10))}px`;
    el.style.top = `${rand(12, 62)}%`;

    gsap.fromTo(
      el,
      { scale: 0.5, autoAlpha: 0, rotate: rand(-10, 10) },
      { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }
    );

    const kill = () => {
      gsap.to(el, {
        scale: 0.6,
        autoAlpha: 0,
        rotate: rand(-30, 30),
        duration: 0.3,
        onComplete: () => el.remove(),
      });
    };

    el.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => {
        spray(innerWidth * 0.5, innerHeight * 0.5, 10);
        kill();
      })
    );

    // It leaves on its own if you ignore it.
    gsap.delayedCall(rand(6, 11), kill);
  };

  /* --------------------------------------------------------------------
     Colour flash / invert
     -------------------------------------------------------------------- */

  const flash = () => {
    flashbang.style.background = pick(CHAOS_COLORS);
    gsap
      .timeline()
      .to(flashbang, { opacity: 0.9, duration: 0.06 })
      .to(flashbang, { opacity: 0, duration: 0.24 });
  };

  const invert = () => {
    document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    setTimeout(() => {
      document.documentElement.style.filter = '';
    }, randInt(90, 240));
  };

  /* --------------------------------------------------------------------
     A stray sticker slides on and off
     -------------------------------------------------------------------- */

  const sticker = () => {
    const el = document.createElement('div');
    el.className = 'sticker';
    el.textContent = pick([
      'RANDOM',
      'WHY?',
      '$RANDOM',
      'NEW!',
      'NO UTILITY',
      'ROLL AGAIN',
      'HELLO',
      '100% ASS',
    ]);
    el.style.background = pick(CHAOS_COLORS);
    el.style.top = `${rand(10, 82)}%`;
    layer.appendChild(el);
    el.style.left = `${rand(10, Math.max(12, innerWidth - el.offsetWidth - 10))}px`;

    gsap.fromTo(
      el,
      { scale: 0, rotate: rand(-40, 40) },
      { scale: 1, duration: 0.4, ease: 'back.out(3)' }
    );
    gsap.to(el, {
      scale: 0,
      duration: 0.3,
      delay: rand(1.6, 3.4),
      ease: 'back.in(2)',
      onComplete: () => el.remove(),
    });
  };

  /* --------------------------------------------------------------------
     The random-event loop. Weighted so the loud ones stay rare.
     -------------------------------------------------------------------- */

  const EVENTS = [
    { run: sticker, weight: 5 },
    { run: () => spray(), weight: 4 },
    { run: popup, weight: 3 },
    { run: flash, weight: 2 },
    { run: () => shake(gsap, randInt(10, 20)), weight: 2 },
    { run: invert, weight: 1 },
  ];

  const pool = EVENTS.flatMap((e) => Array(e.weight).fill(e.run));

  const tick = () => {
    pick(pool)();
    gsap.delayedCall(rand(3.5, 9), tick);
  };
  gsap.delayedCall(rand(4, 7), tick);

  /* --------------------------------------------------------------------
     Input-triggered chaos
     -------------------------------------------------------------------- */

  // Clicking anywhere throws a little junk.
  window.addEventListener('pointerdown', (e) => {
    if (chance(0.55)) spray(e.clientX, e.clientY, randInt(3, 7));
  });

  // Any key: dice everywhere.
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    spray(rand(0, innerWidth), rand(0, innerHeight), randInt(4, 9));
    if (chance(0.2)) flash();
  });

  // Idle too long and the site gets bored and yells.
  let idle;
  const resetIdle = () => {
    clearTimeout(idle);
    idle = setTimeout(() => {
      sticker();
      shake(gsap, 14);
    }, 12000);
  };
  ['pointermove', 'keydown', 'scroll', 'wheel'].forEach((ev) =>
    window.addEventListener(ev, resetIdle, { passive: true })
  );
  resetIdle();

  // Tab away and come back to a greeting.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      document.title = pick([
        'RANDOM ASS COIN — $RANDOM',
        'you came back',
        'we rolled a 4 while you were gone',
        '$RANDOM · still here',
      ]);
      if (chance(0.6)) sticker();
    } else {
      document.title = 'come back';
    }
  });

  /* --------------------------------------------------------------------
     Konami: everything at once, once.
     -------------------------------------------------------------------- */

  const CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
  ];
  let idx = 0;

  window.addEventListener('keydown', (e) => {
    idx = e.key.toLowerCase() === CODE[idx].toLowerCase() ? idx + 1 : 0;
    if (idx < CODE.length) return;
    idx = 0;

    for (let i = 0; i < 12; i++) {
      gsap.delayedCall(i * 0.12, () => {
        spray(rand(0, innerWidth), rand(0, innerHeight), 8);
        if (i % 3 === 0) flash();
      });
    }
    gsap.to('main', {
      rotate: 360 * sign(),
      duration: 2.4,
      ease: 'power4.inOut',
      onComplete: () => gsap.set('main', { clearProps: 'transform' }),
    });
    popup();
  });
}
