import { dieSVG, EMOJI } from '../lib/doodles.js';
import { rand, randInt, pick, sign } from '../lib/random.js';

const CUTS = ['WHAT<br>THE<br>ASS', 'HUH', 'NO<br>WAY', 'ASS<br>ASS<br>ASS', 'WHY', 'OK<br>SURE'];

/**
 * The takeover. Screen fills gold, type slams in, junk rains down, then it
 * cuts back to black like nothing happened.
 */
export function initInterrupt({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('[data-interrupt]');
  const flash = section.querySelector('[data-interrupt-flash]');
  const text = section.querySelector('[data-interrupt-text]');
  const rain = section.querySelector('[data-interrupt-rain]');

  // Fill with falling junk: dice and emoji, mixed.
  const bits = [];
  const COUNT = window.innerWidth < 700 ? 14 : 30;

  for (let i = 0; i < COUNT; i++) {
    let el;
    if (i % 3 === 0) {
      el = document.createElement('span');
      el.className = 'confetti';
      el.textContent = pick(EMOJI);
    } else {
      const box = document.createElement('div');
      box.innerHTML = dieSVG(randInt(1, 6), 56);
      el = box.firstElementChild;
    }
    el.style.left = `${rand(-2, 98)}%`;
    el.style.top = `${rand(-30, 10)}%`;
    rain.appendChild(el);
    bits.push(el);
  }

  if (reduced) return;

  gsap.set(bits, { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

  tl.to(flash, { scaleY: 1, duration: 0.35, ease: 'power4.out' })
    .fromTo(
      text,
      { scale: 0.3, rotate: -14 },
      { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.4)' },
      0.1
    )
    .to(
      bits,
      {
        y: () => window.innerHeight * rand(1.1, 1.9),
        x: () => rand(-160, 160),
        rotate: () => rand(-540, 540),
        autoAlpha: 1,
        duration: 1.4,
        ease: 'none',
        stagger: { amount: 0.9, from: 'random' },
      },
      0.15
    )
    .to(text, { scale: 1.9, rotate: rand(-6, 6), duration: 1 }, 0.6)
    .to(flash, { scaleY: 0, transformOrigin: 'top', duration: 0.4, ease: 'power4.in' }, 1.5);

  // Cut to a different word every time the section is entered.
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    onEnter: () => {
      text.innerHTML = pick(CUTS);
    },
    onEnterBack: () => {
      text.innerHTML = pick(CUTS);
    },
  });

  // A hard jolt right as it lands.
  ScrollTrigger.create({
    trigger: section,
    start: 'top 40%',
    onEnter: () => shake(gsap),
  });
}

/**
 * Screen shake. Transforms on <main> would become the containing block for
 * ScrollTrigger's pinned (position: fixed) children, so the transform is
 * cleared the instant it settles rather than left at translate(0,0).
 */
export function shake(gsap, strength = 22) {
  const main = document.querySelector('main');
  gsap
    .timeline({ onComplete: () => gsap.set(main, { clearProps: 'transform' }) })
    .to(main, { x: strength * sign(), y: strength * 0.5 * sign(), duration: 0.05 })
    .to(main, { x: -strength * 0.7, y: -strength * 0.4, duration: 0.05 })
    .to(main, { x: strength * 0.4, y: strength * 0.2, duration: 0.05 })
    .to(main, { x: 0, y: 0, duration: 0.12, ease: 'elastic.out(1, 0.4)' });
}
