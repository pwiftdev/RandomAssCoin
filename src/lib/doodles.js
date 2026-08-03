// Hand-drawn SVG bits, built to match the logo: fat black strokes, gold fill,
// nothing perfectly straight.

import { randInt, rand } from './random.js';

const PIPS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 26], [70, 26], [30, 50], [70, 50], [30, 74], [70, 74]],
};

/** A single wobbly die face. Black body, gold pips — same as the logo. */
export function dieSVG(face = randInt(1, 6), size = 100) {
  const w = rand(-3, 3);
  const pips = PIPS[face]
    .map(([x, y]) => {
      const rx = (6 + rand(-1, 1)).toFixed(1);
      const ry = (5.2 + rand(-1, 1)).toFixed(1);
      return `<ellipse cx="${(x + rand(-2, 2)).toFixed(1)}" cy="${(y + rand(-2, 2)).toFixed(1)}" rx="${rx}" ry="${ry}" fill="var(--gold)" transform="rotate(${rand(-40, 40).toFixed(0)} ${x} ${y})"/>`;
    })
    .join('');
  return `<svg class="die" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    <path d="M ${12 + w} ${16 - w} Q 50 ${8 + w} ${88 - w} ${15 + w}
             Q ${94 + w} 50 ${86 + w} ${87 - w}
             Q 50 ${94 - w} ${14 - w} ${85 + w}
             Q ${7 - w} 50 ${12 + w} ${16 - w} Z"
          fill="var(--ink)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"/>
    ${pips}
  </svg>`;
}

/** The doodle from the logo's right side, on its own. */
export function assSVG(size = 120) {
  return `<svg class="doodle-ass" viewBox="0 0 120 160" width="${size}" height="${size * 1.33}" aria-hidden="true">
    <g fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round">
      <path d="M18 22 Q10 90 20 148"/>
      <path d="M52 46 Q78 62 66 92 Q56 118 62 150"/>
      <path d="M96 40 Q112 66 96 92 Q78 116 88 150"/>
      <path d="M46 96 Q66 84 96 92"/>
    </g>
  </svg>`;
}

/** Marker underline. */
export function scribbleUnderline() {
  return `<svg class="scribble-line" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
    <path d="M4 14 Q60 4 104 12 Q150 20 196 8" fill="none" stroke="currentColor"
          stroke-width="7" stroke-linecap="round"/>
    <path d="M10 21 Q70 13 120 19 Q160 23 190 17" fill="none" stroke="currentColor"
          stroke-width="3" stroke-linecap="round" opacity=".7"/>
  </svg>`;
}

/** Big fat arrow, points wherever you rotate it. */
export function starSVG() {
  return `<svg class="doodle-star" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 6 L60 38 L94 40 L66 60 L76 92 L50 72 L24 92 L34 60 L6 40 L40 38 Z"
          fill="currentColor" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/>
  </svg>`;
}

export const EMOJI = ['🎲', '🍑', '🐴', '🧦', '🦢', '🚽', '🥫', '📠', '🪑', '🍜', '🛒', '🧻', '🪠', '🥚'];
