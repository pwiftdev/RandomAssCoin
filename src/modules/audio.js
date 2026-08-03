import { dieSVG } from '../lib/doodles.js';
import { rand, randInt, sign } from '../lib/random.js';

const STORE_KEY = 'rac:volume';
const DEFAULT_VOL = 55;

/**
 * Soundtrack + the gate that unlocks it.
 *
 * Autoplay with sound is blocked everywhere without a user gesture, so the
 * gate popup *is* the gesture — clicking it starts the loop. The volume dock
 * appears afterwards either way, so anyone who skipped can still turn it on.
 */
export function initAudio({ gsap, ScrollTrigger, reduced, lenis }) {
  const audio = document.querySelector('[data-audio]');
  const gate = document.querySelector('[data-gate]');
  const gateDie = gate.querySelector('[data-gate-die]');
  const goBtn = gate.querySelector('[data-gate-go]');
  const skipBtn = gate.querySelector('[data-gate-skip]');

  const dock = document.querySelector('[data-vol]');
  const range = dock.querySelector('[data-vol-range]');
  const num = dock.querySelector('[data-vol-num]');
  const toggle = dock.querySelector('[data-vol-toggle]');
  const icon = dock.querySelector('[data-vol-icon]');

  /* ---------------------------------------------------------------------
     Volume — persisted, so it survives a reload.
     --------------------------------------------------------------------- */

  const stored = Number.parseInt(localStorage.getItem(STORE_KEY) ?? '', 10);
  let volume = Number.isFinite(stored) ? Math.min(100, Math.max(0, stored)) : DEFAULT_VOL;

  audio.loop = true;
  audio.volume = 0; // faded up on start

  const paintSlider = () => {
    range.value = String(volume);
    num.textContent = String(volume);
    // Gold fill up to the handle, ink track after it.
    range.style.setProperty('--fill', `${volume}%`);
    icon.textContent = audio.paused || volume === 0 ? '✕' : '♪';
    dock.classList.toggle('is-off', audio.paused || volume === 0);
  };

  const applyVolume = (v, { persist = true } = {}) => {
    volume = Math.min(100, Math.max(0, Math.round(v)));
    if (!audio.paused) audio.volume = volume / 100;
    if (persist) localStorage.setItem(STORE_KEY, String(volume));
    paintSlider();
  };

  range.addEventListener('input', () => applyVolume(Number(range.value)));

  // Scroll the slider to nudge the volume — it is, after all, a scrolling bar.
  dock.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      applyVolume(volume + (e.deltaY < 0 ? 4 : -4));
    },
    { passive: false }
  );

  /* ---------------------------------------------------------------------
     Play / pause
     --------------------------------------------------------------------- */

  let started = false;

  const start = async () => {
    try {
      await audio.play();
    } catch {
      // Blocked or the file is missing — fail quiet, the page still works.
      paintSlider();
      return false;
    }
    started = true;
    // Fade in rather than slamming in at full volume.
    gsap.fromTo(
      audio,
      { volume: 0 },
      { volume: volume / 100, duration: 1.2, ease: 'power2.out', onUpdate: paintSlider }
    );
    paintSlider();
    return true;
  };

  const stop = () => {
    gsap.to(audio, {
      volume: 0,
      duration: 0.3,
      onComplete: () => {
        audio.pause();
        paintSlider();
      },
    });
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) start();
    else stop();
  });

  /* ---------------------------------------------------------------------
     The gate
     --------------------------------------------------------------------- */

  gateDie.innerHTML = dieSVG(randInt(1, 6), 120);

  let faceSwap = null;

  const showDock = () => {
    dock.hidden = false;
    paintSlider();
    if (reduced) return;
    gsap.fromTo(
      dock,
      { x: -40, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.8)', delay: 0.2 }
    );
  };

  // Lenis owns the scroll, so stop() is the real lock; the body class is the
  // fallback for the reduced-motion path where Lenis isn't running.
  const lockScroll = (on) => {
    document.body.classList.toggle('is-locked', on);
    if (!lenis) return;
    if (on) lenis.stop();
    else lenis.start();
  };

  const closeGate = () => {
    clearInterval(faceSwap);
    lockScroll(false);
    ScrollTrigger.refresh();

    if (reduced) {
      gate.hidden = true;
      showDock();
      return;
    }

    gsap
      .timeline({
        onComplete: () => {
          gate.hidden = true;
          showDock();
        },
      })
      .to(gate.querySelector('.gate__inner'), {
        scale: 0.7,
        autoAlpha: 0,
        rotate: rand(-8, 8),
        duration: 0.35,
        ease: 'back.in(2)',
      })
      .to(gate, { autoAlpha: 0, duration: 0.3 }, '-=0.15');
  };

  goBtn.addEventListener('click', () => {
    start();
    closeGate();
    document.dispatchEvent(new CustomEvent('rac:audio-on'));
  });

  skipBtn.addEventListener('click', closeGate);

  const openGate = () => {
    gate.hidden = false;
    lockScroll(true);

    if (reduced) return;

    faceSwap = setInterval(() => {
      gateDie.innerHTML = dieSVG(randInt(1, 6), 120);
    }, 260);

    gsap.fromTo(gate, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    gsap.fromTo(
      gate.querySelector('.gate__inner'),
      { scale: 0.6, y: 60, autoAlpha: 0, rotate: rand(-6, 6) },
      { scale: 1, y: 0, autoAlpha: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );
    // The button will not sit still.
    gsap.to(goBtn, {
      rotate: 2.5 * sign(),
      duration: 0.9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  };

  // Wait for the preloader to clear before barging in.
  document.addEventListener('rac:enter', openGate, { once: true });

  /* ---------------------------------------------------------------------
     Pause while the tab is hidden, resume when it comes back.
     --------------------------------------------------------------------- */

  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) audio.pause();
    else audio.play().catch(() => {});
    paintSlider();
  });

  paintSlider();
}
