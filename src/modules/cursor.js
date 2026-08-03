import { pick, chance } from '../lib/random.js';

const LABELS = ['🎲', '?', '$RANDOM', '!!', '🍑', 'OK', '???'];

export function initCursor({ gsap, reduced }) {
  if (reduced) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const el = document.querySelector('[data-cursor]');
  const inner = el.querySelector('[data-cursor-inner]');
  document.body.classList.add('cursor-ready');

  const setX = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' });
  const setY = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    setX(e.clientX);
    setY(e.clientY);
  });

  // Interactive things make it swell and pick up a label.
  const hot = 'a, button, .mock, .wall__card, .tok__card, .road__item, .ca';

  document.addEventListener('pointerover', (e) => {
    if (!e.target.closest?.(hot)) return;
    el.classList.add('is-big');
    gsap.to(el, { scale: 2.1, duration: 0.28, ease: 'back.out(2)' });
    inner.textContent = chance(0.5) ? pick(LABELS) : '';
  });

  document.addEventListener('pointerout', (e) => {
    if (!e.target.closest?.(hot)) return;
    el.classList.remove('is-big');
    gsap.to(el, { scale: 1, duration: 0.28 });
    inner.textContent = '';
  });

  document.addEventListener('pointerdown', () =>
    gsap.to(el, { scale: 0.55, duration: 0.12 })
  );
  document.addEventListener('pointerup', () =>
    gsap.to(el, { scale: el.classList.contains('is-big') ? 2.1 : 1, duration: 0.3 })
  );

  // Every so often the cursor just... becomes something else.
  setInterval(() => {
    if (!chance(0.35)) return;
    el.classList.add('is-text');
    inner.textContent = pick(LABELS);
    setTimeout(() => {
      el.classList.remove('is-text');
      if (!el.classList.contains('is-big')) inner.textContent = '';
    }, 900);
  }, 7000);
}
