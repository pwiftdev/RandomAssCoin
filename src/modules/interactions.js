import { pick, rand, NONSENSE_LINES } from '../lib/random.js';

/** Copy-to-clipboard on the contract address chips. */
export function initCopy() {
  document.querySelectorAll('[data-ca]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        // Clipboard can be blocked (no permission, insecure context) — the
        // chip still gives feedback so the click never feels dead.
      }
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1600);
    });
  });
}

/** Buttons lean toward the pointer. */
export function initMagnets({ gsap, reduced }) {
  if (reduced || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('[data-magnet]').forEach((el) => {
    const setX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      setX((e.clientX - (r.left + r.width / 2)) * 0.32);
      setY((e.clientY - (r.top + r.height / 2)) * 0.42);
    });

    el.addEventListener('pointerleave', () => {
      setX(0);
      setY(0);
    });
  });

  // Nav links jitter on hover.
  document.querySelectorAll('[data-wobble]').forEach((el) => {
    el.addEventListener('pointerenter', () =>
      gsap.to(el, {
        rotate: rand(-7, 7),
        scale: 1.1,
        duration: 0.3,
        ease: 'back.out(3)',
      })
    );
    el.addEventListener('pointerleave', () =>
      gsap.to(el, { rotate: 0, scale: 1, duration: 0.4 })
    );
  });
}

/** Hide the top bar on the way down, bring it back on the way up. */
export function initTopbar({ lenis }) {
  const bar = document.querySelector('.topbar');
  let last = 0;

  const onScroll = (y) => {
    bar.classList.toggle('is-hidden', y > last && y > 400);
    last = y;
  };

  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY));

  // Footer line rewrites itself every few seconds.
  const line = document.querySelector('[data-foot-line]');
  setInterval(() => {
    line.textContent = pick(NONSENSE_LINES);
  }, 4200);
}
