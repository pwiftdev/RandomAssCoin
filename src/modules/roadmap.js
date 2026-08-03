import { sample, pick, rand, randInt, ROADMAP_ACTS } from '../lib/random.js';
import { scribbleUnderline } from '../lib/doodles.js';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q?', 'Q🎲', 'SOON', 'NEVER', 'LAST TUESDAY'];
const TAGS = ['CONFIRMED', 'PROBABLY NOT', 'IN PROGRESS?', 'ABANDONED', 'ONGOING', 'DONE (LIED)'];

export function initRoadmap({ gsap, ScrollTrigger, reduced }) {
  const section = document.querySelector('.road');
  const list = section.querySelector('[data-road-list]');
  const shuffleBtn = section.querySelector('[data-road-shuffle]');

  // Marker scrawl under the heading — same hand as the logo.
  const heading = section.querySelector('.road__head h2');
  heading.insertAdjacentHTML('beforeend', scribbleUnderline());

  const build = () => {
    const acts = sample(ROADMAP_ACTS, 6);
    const quarters = sample(QUARTERS, 6);

    list.innerHTML = acts
      .map(
        (act, i) => `<li class="road__item">
          <span class="road__q">${quarters[i]}</span>
          <span class="road__act">${act}</span>
          <span class="road__tag">${pick(TAGS)}</span>
        </li>`
      )
      .join('');

    if (reduced) return;
    gsap.from(list.children, {
      xPercent: () => (Math.random() < 0.5 ? -12 : 12),
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.06,
    });
  };

  build();

  shuffleBtn.addEventListener('click', () => {
    build();
    if (!reduced) {
      gsap.fromTo(
        shuffleBtn,
        { rotate: 0 },
        { rotate: 360 * randInt(1, 3), duration: 0.8, ease: 'power3.out' }
      );
    }
  });

  if (reduced) return;

  // First reveal on scroll, each row shoved in from a random side.
  ScrollTrigger.create({ trigger: section, start: 'top 70%', once: true, onEnter: build });

  gsap.fromTo(
    '.road__head h2',
    { yPercent: 60, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 75%' },
    }
  );

  // Rows nudge sideways at random while you hover the list — the roadmap is
  // physically unreliable.
  list.addEventListener('pointerover', (e) => {
    const item = e.target.closest('.road__item');
    if (!item) return;
    gsap.to(item.querySelector('.road__act'), {
      x: rand(-14, 14),
      skewX: rand(-6, 6),
      duration: 0.35,
      ease: 'power3.out',
    });
  });

  list.addEventListener('pointerout', (e) => {
    const item = e.target.closest('.road__item');
    if (!item) return;
    gsap.to(item.querySelector('.road__act'), { x: 0, skewX: 0, duration: 0.5 });
  });
}
