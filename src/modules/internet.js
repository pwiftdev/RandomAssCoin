import { MOCKS, mockHTML } from './mockups.js';
import { shuffle, rand, sign } from '../lib/random.js';

/**
 * Pinned horizontal scroll. The section is as tall as the track is wide, so
 * vertical scroll maps 1:1 onto sideways travel.
 */
export function initInternet({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.internet');
  const pin = section.querySelector('.internet__pin');
  const track = section.querySelector('[data-internet-track]');

  const cards = shuffle(MOCKS).map((m) => {
    const el = document.createElement('article');
    el.className = 'mock';
    el.innerHTML = mockHTML(m);
    track.appendChild(el);
    return el;
  });

  // Every card sits at its own angle and height.
  cards.forEach((el, i) => {
    gsap.set(el, { rotate: rand(-3.5, 3.5), y: rand(-26, 26) });
    el.style.zIndex = String(10 + (i % 3));
  });

  if (reduced) {
    track.style.flexWrap = 'wrap';
    track.style.width = 'auto';
    return;
  }

  const distance = () => track.scrollWidth - window.innerWidth + 80;

  const scrub = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: pin,
      start: 'top top',
      end: () => `+=${distance()}`,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // Depth: cards drift vertically and counter-rotate as they pass through.
  cards.forEach((el, i) => {
    const depth = 0.25 + (i % 4) * 0.22;
    gsap.to(el, {
      y: `+=${rand(-60, 60) * depth}`,
      rotate: `+=${rand(6, 16) * sign()}`,
      ease: 'none',
      scrollTrigger: {
        containerAnimation: scrub,
        trigger: el,
        start: 'left right',
        end: 'right left',
        scrub: true,
      },
    });

    // Pop up on entry. fromTo — `from` + ScrollTrigger.refresh() strands the
    // element at its start state.
    gsap.fromTo(
      el,
      { scale: 0.72, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          containerAnimation: scrub,
          trigger: el,
          start: 'left 96%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Grab one and it tilts toward you.
    el.addEventListener('pointerenter', () =>
      gsap.to(el, { scale: 1.04, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' })
    );
    el.addEventListener('pointerleave', () =>
      gsap.to(el, { scale: 1, duration: 0.4, overwrite: 'auto' })
    );
  });

  // Headline drifts the other way — small, or it walks off the left edge.
  gsap.fromTo(
    '.internet__head h2',
    { x: 0 },
    {
      // Scaled to viewport so it never walks off the left edge on mobile.
      x: () => -window.innerWidth * 0.045,
      ease: 'none',
      invalidateOnRefresh: true,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 1,
      },
    }
  );
}
