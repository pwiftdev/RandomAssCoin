import './styles/base.css';
import './styles/sections.css';
import './styles/mockups.css';
import './styles/audio.css';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initPreloader } from './modules/preloader.js';
import { initCursor } from './modules/cursor.js';
import { initMarquees } from './modules/marquee.js';
import { initHero } from './modules/hero.js';
import { initRolls } from './modules/rolls.js';
import { initInternet } from './modules/internet.js';
import { initInterrupt } from './modules/interrupt.js';
import { initSlot } from './modules/slot.js';
import { initRoadmap } from './modules/roadmap.js';
import { initWall } from './modules/wall.js';
import { initBuy } from './modules/buy.js';
import { initChaos } from './modules/chaos.js';
import { initAudio } from './modules/audio.js';
import { initContractAddress, initMagnets, initTopbar } from './modules/interactions.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------
   Smooth scroll. Lenis drives, GSAP's ticker is the clock, ScrollTrigger
   listens — one rAF loop for the whole site.
   ------------------------------------------------------------------------- */

let lenis = null;

if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Anchor links have to go through Lenis or they fight it.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView();
  });
});

/* -------------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------------- */

const ctx = { gsap, ScrollTrigger, reduced, lenis };

// Things that should exist before the curtain lifts.
initMarquees(ctx);
initHero(ctx);
initRolls(ctx);
initInternet(ctx);
initInterrupt(ctx);
initSlot(ctx);
initRoadmap(ctx);
initWall(ctx);
initBuy(ctx);
initContractAddress();
initMagnets(ctx);
initTopbar(ctx);
initCursor(ctx);
// Subscribes to 'rac:enter', so it must be wired before the preloader fires it.
initAudio(ctx);

// Fonts land after first paint and shift every headline; recalc once settled.
if (document.fonts?.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener('load', () => ScrollTrigger.refresh());

// Dev handle — `window.rac.lenis.scrollTo(...)` beats fighting smooth scroll
// from the console. Stripped from production builds.
if (import.meta.env.DEV) window.rac = ctx;

initPreloader(ctx, () => {
  // Measure before the audio gate locks scrolling, not after.
  ScrollTrigger.refresh();
  document.dispatchEvent(new CustomEvent('rac:enter'));
  initChaos(ctx);
});
