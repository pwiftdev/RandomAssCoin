import { dieSVG } from '../lib/doodles.js';
import { TICKER_BITS, shuffle, randInt } from '../lib/random.js';

/**
 * Seamless marquees. Each row is duplicated until it's at least 2x the
 * viewport, then translated by exactly one copy's width and wrapped — so the
 * loop point is invisible regardless of content length.
 */
export function initMarquees({ gsap, reduced }) {
  document.querySelectorAll('[data-marquee]').forEach((host) => {
    const speed = parseFloat(host.dataset.speed || '1');

    const unit = shuffle(TICKER_BITS)
      .map((t) => `<span>${t}</span>${dieSVG(randInt(1, 6), 40)}`)
      .join('');

    const row = document.createElement('div');
    row.className = 'ticker__row';
    row.innerHTML = unit;
    host.appendChild(row);

    // Repeat until one copy comfortably overflows, then clone it once.
    let guard = 0;
    while (row.scrollWidth < window.innerWidth * 1.5 && guard++ < 6) {
      row.innerHTML += unit;
    }

    const copyWidth = row.scrollWidth;
    const clone = row.cloneNode(true);
    host.appendChild(clone);

    if (reduced) return;

    const rows = [row, clone];
    gsap.set(rows, { x: (i) => i * copyWidth });

    const wrap = gsap.utils.wrap(-copyWidth, copyWidth);
    const tween = gsap.to(rows, {
      x: `+=${speed > 0 ? -copyWidth : copyWidth}`,
      duration: copyWidth / (90 * Math.abs(speed)),
      ease: 'none',
      repeat: -1,
      modifiers: { x: (x) => `${wrap(parseFloat(x))}px` },
    });

    // Hovering the ticker slows it to a crawl.
    host.addEventListener('pointerenter', () =>
      gsap.to(tween, { timeScale: 0.15, duration: 0.4 })
    );
    host.addEventListener('pointerleave', () =>
      gsap.to(tween, { timeScale: 1, duration: 0.6 })
    );
  });
}
