import { dieSVG } from "../lib/doodles.js";
import { pick, randInt } from "../lib/random.js";

const WORDS = [
  "SHUFFLING",
  "PICKING A COIN AT RANDOM",
  "ROLLING DICE",
  "CONSULTING A GOOSE",
  "NO PLAN DETECTED",
  "THIS IS FINE",
  "ASKING DOUG",
  "ALMOST",
];

export function initPreloader({ gsap, reduced }, done) {
  const root = document.getElementById("preloader");
  const dieBox = root.querySelector("[data-pre-die]");
  const word = root.querySelector("[data-pre-word]");
  const num = root.querySelector("[data-pre-num]");
  const bar = root.querySelector("[data-pre-bar]");

  document.body.classList.add("is-locked");
  dieBox.innerHTML = dieSVG(randInt(1, 6), 110);

  const finish = () => {
    document.body.classList.remove("is-locked");
    root.remove();
    done();
  };

  if (reduced) {
    finish();
    return;
  }

  // The die keeps changing face mid-tumble.
  const faceSwap = setInterval(() => {
    dieBox.innerHTML = dieSVG(randInt(1, 6), 110);
  }, 150);

  const wordSwap = setInterval(() => {
    word.textContent = pick(WORDS);
  }, 380);

  const numberSwap = setInterval(() => {
    num.textContent = String(randInt(0, 99)).padStart(2, "0");
  }, 90);

  const counter = { v: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      clearInterval(faceSwap);
      clearInterval(wordSwap);
      clearInterval(numberSwap);
    },
  });

  const paint = () => {
    const v = Math.round(counter.v);
    bar.style.width = `${v}%`;
  };

  // Deliberately uneven — it lurches, stalls, then gives up and finishes.
  [
    [37, 0.5, "power4.out"],
    [41, 0.45, "none"],
    [78, 0.6, "power3.out"],
    [79, 0.35, "none"],
    [100, 0.55, "power2.inOut"],
  ].forEach(([v, duration, ease]) => {
    tl.to(counter, { v, duration, ease, onUpdate: paint });
  });

  tl.to(word, { autoAlpha: 0, duration: 0.15 }, "-=0.15")
    .to(num, { scale: 14, autoAlpha: 0, duration: 0.5, ease: "power3.in" })
    .to(
      root,
      {
        yPercent: -100,
        duration: 0.7,
        ease: "expo.inOut",
        onComplete: finish,
      },
      "-=0.15",
    );
}
