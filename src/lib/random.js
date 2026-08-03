// The single source of chaos. Everything on this site pulls from here.

export const rand = (min, max) => Math.random() * (max - min) + min;
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const chance = (p) => Math.random() < p;
export const sign = () => (Math.random() < 0.5 ? -1 : 1);

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pull n items without repeats. Falls back to repeats if n > pool size. */
export function sample(arr, n) {
  if (n >= arr.length) return shuffle(arr);
  return shuffle(arr).slice(0, n);
}

/** A pool that never gives you the same thing twice in a row. */
export function cycler(arr) {
  let bag = shuffle(arr);
  return () => {
    if (!bag.length) bag = shuffle(arr);
    return bag.pop();
  };
}

export const CHAOS_COLORS = ['#ff2e88', '#00e5ff', '#b6ff00', '#ff5c00', '#8c52ff', '#ffc20e'];

// ---------------------------------------------------------------------------
// Word banks. Deliberately unhinged.
// ---------------------------------------------------------------------------

export const RANDOM_NOUNS = [
  'A LAWNMOWER', 'MY UNCLE GARY', 'A WET SOCK', 'THE MOON', 'A HORSE',
  'SOUP', 'A TRAFFIC CONE', 'YOUR EX', 'A FAX MACHINE', 'A SINGLE GRAPE',
  'FLORIDA', 'A HAUNTED FRIDGE', 'BEES', 'A LADDER', 'DENTAL RECORDS',
  'A PIGEON WITH A JOB', 'THE CONCEPT OF TUESDAY', 'A BEIGE CAR',
  'AN UNPLUGGED TREADMILL', 'A GOOSE THAT KNOWS', 'CARPET SAMPLES',
  'A MICROWAVE ON A BOAT', 'THE NUMBER 7', 'A GUY NAMED DOUG',
];

export const RANDOM_VERBS = [
  'ROLLING', 'SHUFFLING', 'YEETING', 'FERMENTING', 'REVERSING',
  'MICROWAVING', 'BAPTIZING', 'LAMINATING', 'UNHINGING', 'SUMMONING',
];

export const RANDOM_STATS = [
  'BONES IN A HAND', 'GEESE PER CAPITA', 'AVERAGE SOCK HUMIDITY',
  'UNITS OF PURE VIBE', 'CONFIRMED SIGHTINGS', 'GRAMS OF AUDACITY',
  'HOURS SINCE INCIDENT', 'LICENSED PLUMBERS', 'DECIBELS OF SILENCE',
];

export const ROADMAP_ACTS = [
  'BUY A HORSE', 'DELETE THE ROADMAP', 'LEARN TO SWIM', 'ANNOY A BANK',
  'MICROWAVE THE CHARTS', 'HIRE A GOOSE', 'INVENT A NEW TUESDAY',
  'REPLACE ALL CHAIRS', 'ACQUIRE A SECOND HORSE', 'GO TO SPACE (BRIEFLY)',
  'START A BAND', 'END THE BAND', 'BUY A BUILDING, SELL A BUILDING',
  'TEACH THE HORSE TO TRADE', 'DIG A HOLE', 'FILL IN THE HOLE',
  'SPEAK AT A CONFERENCE UNINVITED', 'MAKE SOUP FOR EVERYONE',
  'BECOME A COUNTRY', 'FORGET WHY WE DID ANY OF THIS',
];

export const TICKER_BITS = [
  '$RANDOM', 'NO UTILITY', '100% RANDOM', 'WE BOUGHT IT ANYWAY', 'DICE ROLLED',
  'SERIOUSLY, NOTHING', 'ASS', 'CHART GO ???', 'PUMP.FUN', 'ZERO PLAN',
  'MAXIMUM ASS', 'IT IS WHAT IT IS', 'RANDOM ASS COIN',
];

export const NONSENSE_LINES = [
  'this is not financial advice, this is barely advice',
  'we rolled a dice and it said buy',
  'the whitepaper is a napkin',
  'audited by a guy named doug',
  'liquidity is a state of mind',
  'we do not know what we are doing and it is going great',
];
