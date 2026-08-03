import { CONTRACT_ADDRESS, PUMP_FUN_URL } from '../config.js';
import { pick, rand, NONSENSE_LINES } from '../lib/random.js';

const shortenAddress = (address) => `${address.slice(0, 8)}…${address.slice(-4)}`;

async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();

  const copied = document.execCommand('copy');
  input.remove();

  if (!copied) throw new Error('Clipboard copy failed');
}

function showCopyStatus(button, className) {
  button.classList.remove('is-copied', 'is-copy-error');
  button.classList.add(className);
  setTimeout(() => button.classList.remove(className), 1600);
}

/** Populate contract details and enable copy-to-clipboard on the CA chips. */
export function initContractAddress() {
  document.querySelectorAll('[data-ca-link]').forEach((link) => {
    link.href = PUMP_FUN_URL;
  });

  document.querySelectorAll('[data-ca]').forEach((btn) => {
    const address = btn.querySelector('[data-ca-text]');
    const showFullAddress = btn.dataset.caDisplay === 'full';

    address.textContent = showFullAddress ? CONTRACT_ADDRESS : shortenAddress(CONTRACT_ADDRESS);
    btn.setAttribute('aria-label', `Copy contract address ${CONTRACT_ADDRESS}`);

    btn.addEventListener('click', async () => {
      try {
        await copyToClipboard(CONTRACT_ADDRESS);
        showCopyStatus(btn, 'is-copied');
      } catch {
        showCopyStatus(btn, 'is-copy-error');
      }
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
    el.addEventListener('pointerleave', () => gsap.to(el, { rotate: 0, scale: 1, duration: 0.4 }));
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
