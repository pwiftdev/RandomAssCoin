# RANDOM ASS COIN — $RANDOM

Landing page for the most random ass coin ever.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## How it's put together

Vite + vanilla JS. GSAP/ScrollTrigger for scroll work, Lenis for smooth scroll —
both share one ticker (`src/main.js`) so there's a single rAF loop.

```
src/
  lib/random.js      every random helper + the word banks
  lib/doodles.js     inline SVG dice / doodles, drawn to match the logo
  modules/           one file per section, each exports init*(ctx)
  styles/            base (tokens, chrome) · sections · mockups
```

`ctx` is `{ gsap, ScrollTrigger, reduced, lenis }`. Every module takes it and
bails early when `reduced` (`prefers-reduced-motion`) is set.

### Two things worth knowing before editing

- **Use `gsap.fromTo`, never `gsap.from`, with a ScrollTrigger.**
  `ScrollTrigger.refresh()` reverts `from` tweens to their start state and
  won't replay them — elements get stranded at `scale: 0`.
- **One tween per transform property per element.** Where an entrance, a
  parallax and an idle float all touch the same node, they're split across
  nested wrappers (see the `.par` / `.pt` / svg stack in `modules/hero.js`) or
  sequenced so they never overlap.

Content lives in the word banks in `lib/random.js`, the site list in
`modules/mockups.js`, the six outcomes in `modules/rolls.js` and the
tokenomics cards in `modules/slot.js`.

The logo is `public/coin.jpg`. It's a JPEG on an off-white card, so `.coin img`
in `styles/base.css` clips it to a circle matched to the drawn ring — swap the
art and those `clip-path` / `scale` numbers need re-measuring.

The site mockups are parody layouts. No real logos or brand marks.
