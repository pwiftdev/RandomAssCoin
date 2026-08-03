/**
 * Parody website frames. Deliberately generic: recognisable *layouts*, no
 * real brand names or marks. Each returns { url, scrawl, html }.
 */

import { dieSVG } from '../lib/doodles.js';

const coin = (cls = '') => `<span class="coin ${cls}"><img src="./coin.jpg" alt=""/></span>`;

/** A chart that gives up on being a chart. */
function chartPath() {
  const pts = [];
  let y = 150;
  for (let i = 0; i <= 40; i++) {
    // Wanders, then goes vertical at the end because of course it does.
    y = i < 32 ? Math.max(20, Math.min(170, y + (Math.random() - 0.48) * 26)) : y - 14;
    pts.push(`${(i / 40) * 400},${Math.max(6, y).toFixed(1)}`);
  }
  return pts.join(' ');
}

export const MOCKS = [
  {
    url: 'search.com/?q=random+ass+coin',
    scrawl: 'we googled ourselves',
    html: `<div class="m-search">
      <div class="m-search__bar">🔍 <b>random ass coin</b></div>
      <div class="m-search__meta">About 4 results (0.00000001 seconds)</div>
      <div class="m-search__res">
        <div class="u">pump.fun › ass</div>
        <div class="t">RANDOM ASS COIN ($RANDOM) — the most random ass coin</div>
        <div class="d">We are buying <em>random coins</em>. So here is the most <em>random ass coin</em> ever. No utility. No plan. Just ass.</div>
      </div>
      <div class="m-search__res">
        <div class="u">reddit.com › r/whatisthis</div>
        <div class="t">is this a real coin or did someone roll a dice</div>
        <div class="d">it's both. i checked. — <em>u/doug</em>, 4 hours ago</div>
      </div>
      <div class="m-search__res">
        <div class="u">answers.com › ass</div>
        <div class="t">how much ass is too much ass?</div>
        <div class="d">Best answer: there is no such thing as too much <em>ass</em>.</div>
      </div>
    </div>`,
  },
  {
    url: 'encyclopedia.org/wiki/Random_Ass_Coin',
    scrawl: 'someone edited this. not us.',
    html: `<div class="m-wiki">
      <div class="m-wiki__box">
        ${coin()}
        <dl>
          <dt>Type</dt><dd>Ass</dd>
          <dt>Founded</dt><dd>By accident</dd>
          <dt>Utility</dt><dd>None</dd>
          <dt>Plan</dt><dd>Citation needed</dd>
          <dt>Dice</dt><dd>Yes</dd>
        </dl>
      </div>
      <h3>Random Ass Coin</h3>
      <p><b>Random Ass Coin</b> ($RANDOM) is a <a href="#">digital asset</a> created after its founders were observed buying <a href="#">random coins</a> and decided to skip the middleman.<sup>[1]</sup></p>
      <p>The project is notable for having no <a href="#">roadmap</a>, no <a href="#">utility</a>, and one (1) dice.<sup>[citation needed]</sup> Scholars remain divided on whether it is a coin or a bit.</p>
      <p>In 2026 the coin was briefly the subject of a <a href="#">municipal investigation</a> involving a horse.</p>
    </div>`,
  },
  {
    url: 'x.com/randomasscoin/status/1',
    scrawl: 'ratio\'d ourselves',
    html: `<div class="m-post">
      <div class="m-post__head">
        ${coin()}
        <div>
          <div class="m-post__name">Random Ass Coin <span class="m-post__badge">✓</span></div>
          <div class="m-post__handle">@randomasscoin</div>
        </div>
      </div>
      <div class="m-post__text">we rolled a dice to decide the tokenomics and it landed on the floor. that's the tokenomics.</div>
      <div class="m-post__stats">
        <span><b>4.2K</b> reposts</span><span><b>69K</b> likes</span><span><b>1</b> horse</span>
      </div>
    </div>`,
  },
  {
    url: 'terminal://markets/ASS:USD',
    scrawl: 'chart guy quit',
    html: `<div class="m-term">
      <div class="m-term__top"><span>ASS:USD</span><span>MKT OPEN · WHY</span></div>
      <div class="m-term__price">???.??</div>
      <div class="m-term__delta">▲ +∞% · 24H · analysts baffled</div>
      <svg class="m-term__chart" viewBox="0 0 400 180" preserveAspectRatio="none">
        <polyline points="${chartPath()}" fill="none" stroke="#00ff88" stroke-width="3"/>
      </svg>
      <div class="m-term__rows">
        <div><span>MKT CAP</span><span>A LOT / A LITTLE</span></div>
        <div><span>VOLUME</span><span>YES</span></div>
        <div><span>P/E RATIO</span><span>🎲</span></div>
        <div><span>ANALYST RATING</span><span>STRONG ASS</span></div>
      </div>
    </div>`,
  },
  {
    url: 'shop.com/dp/B0RANDOMASS',
    scrawl: 'free shipping on ass',
    html: `<div class="m-shop">
      <div class="m-shop__img">${coin()}</div>
      <div>
        <h3>Random Ass Coin, 1 Count, Digital, Assorted Randomness (Ass)</h3>
        <div class="m-shop__stars">★★★★☆ <span style="color:#007185">1,204 ratings</span></div>
        <div class="m-shop__price"><sup>$</sup>0<sup>.000069</sup></div>
        <div class="m-shop__ship">FREE delivery <b>tomorrow, maybe</b>. Or a horse brings it.</div>
        <span class="m-shop__buy">Add to Ass</span>
        <div class="m-shop__stock">In Stock — only ∞ left</div>
      </div>
    </div>`,
  },
  {
    url: 'C:\\WINDOWS\\ass.exe',
    scrawl: 'this happens a lot',
    html: `<div class="m-bsod">
      <div class="m-bsod__face">:(</div>
      <h3>Your PC ran into a problem and needs to think about ass.</h3>
      <p>We're just collecting some error info, and then we'll restart for you. We do not know what we are collecting.</p>
      <p>0% complete</p>
      <div class="m-bsod__code">
        Stop code: TOO_MUCH_RANDOM<br/>
        What failed: ass.sys<br/>
        Who to blame: doug
      </div>
    </div>`,
  },
  {
    url: 'symptoms.com/checker/results',
    scrawl: "it's always the worst option",
    html: `<div class="m-med">
      <span class="m-med__tag">SYMPTOM CHECKER</span>
      <h3>You searched: "cannot stop thinking about a coin"</h3>
      <ul>
        <li><i></i> Acute Ass Exposure (98% match)</li>
        <li><i></i> Chronic Dice Rolling</li>
        <li><i></i> Portfolio Based Delusion</li>
        <li><i></i> It is definitely something serious</li>
      </ul>
      <div class="m-med__note">⚠ Seek immediate liquidity. Or don't. We are a website.</div>
    </div>`,
  },
  {
    url: 'reviews.com/biz/random-ass-coin',
    scrawl: 'the 1 star is our mum',
    html: `<div class="m-rev">
      <h3>Random Ass Coin</h3>
      <div class="m-rev__stars">★★★★★ · 412 reviews · $ · Ass, Dice, Financial Nonsense</div>
      <div class="m-rev__item">
        <div class="m-rev__who">Gary V. · ★★★★★</div>
        <div class="m-rev__body">Came for the ass, stayed for the ass. Parking was difficult.</div>
      </div>
      <div class="m-rev__item">
        <div class="m-rev__who">Susan R. · ★☆☆☆☆</div>
        <div class="m-rev__body">I do not understand what any of this is and my son will not explain it.</div>
      </div>
      <div class="m-rev__item">
        <div class="m-rev__who">A Horse · ★★★★★</div>
        <div class="m-rev__body">neigh (positive)</div>
      </div>
    </div>`,
  },
  {
    url: 'flatpack.com/p/ÅSS-90210',
    scrawl: 'missing one screw. always.',
    html: `<div class="m-flat">
      <div class="m-flat__name">ÅSS</div>
      <div class="m-flat__desc">Randomiser unit, gold/black. Some assembly required. Dice not included, dice very much included.</div>
      <div class="m-flat__steps">
        <div class="m-flat__step"><b>1</b>${dieSVG(3, 34)}<span>ROLL</span></div>
        <div class="m-flat__step"><b>2</b><span style="font-size:26px">🔩</span><span>SCREW</span></div>
        <div class="m-flat__step"><b>3</b><span style="font-size:26px">😵</span><span>CRY</span></div>
      </div>
      <div class="m-flat__price">$RANDOM</div>
    </div>`,
  },
  {
    url: 'videos.com/watch?v=assassass',
    scrawl: 'do not watch this',
    html: `<div class="m-vid">
      <div class="m-vid__frame">
        ${coin()}
        <span class="m-vid__time">4:20</span>
        <span class="m-vid__bar"><i></i></span>
      </div>
      <h3>I bought $RANDOM and now I own a horse (EMOTIONAL)</h3>
      <div class="m-vid__meta">2.1M views · 3 hours ago</div>
      <div class="m-vid__row">${coin()}<span>DougFinance · 12.4K subscribers</span></div>
    </div>`,
  },
];

export function mockHTML({ url, scrawl, html }) {
  return `<div class="mock__chrome">
      <span class="mock__dots"><i></i><i></i><i></i></span>
      <span class="mock__url">${url}</span>
    </div>
    <div class="mock__body">${html}</div>
    <span class="mock__scrawl">${scrawl}</span>`;
}
