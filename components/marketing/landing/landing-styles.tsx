/**
 * Keyframes and caption-preset classes for the home page only (tokens only, no raw colors).
 * Rendered once with React 19 <style href precedence> so it is hoisted and de-duplicated.
 * All animations stop under prefers-reduced-motion / [data-motion=reduce] through the global rule in globals.css.
 */
const ink = (pct: number) => `color-mix(in oklab, var(--color-black) ${pct}%, transparent)`;

const CSS = `
@keyframes kd-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes kd-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes kd-sweep { 0%, 78% { transform: translateX(-160%) skewX(-18deg); } 100% { transform: translateX(260%) skewX(-18deg); } }
@keyframes kd-wave { 0%, 100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }
@keyframes kd-pulse-ring { 0% { transform: scale(.9); opacity: .7; } 100% { transform: scale(1.5); opacity: 0; } }
@keyframes kd-toast { 0%, 45% { opacity: 0; transform: translateY(8px); } 55%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; transform: none; } }
@keyframes kd-popup { 0%, 30% { opacity: 0; transform: scale(.92); } 38%, 100% { opacity: 1; transform: none; } }
@keyframes kd-boxes { 0% { transform: translateY(0) rotate(0); } 100% { transform: translateY(-14%) rotate(-8deg); } }

.kd-paused, .kd-paused * { animation-play-state: paused !important; }
.kd-progress { transform-origin: var(--kd-origin, right); animation: kd-progress var(--kd-dur, 6s) linear infinite; animation-delay: var(--kd-delay, 0s); }
:root[dir="ltr"] .kd-progress { --kd-origin: left; }
.kd-sweep { animation: kd-sweep 6s var(--ease-in-out) infinite; }
.kd-wave { transform-origin: center; animation: kd-wave 1.1s var(--ease-in-out) infinite; }
.kd-ring { animation: kd-pulse-ring 1.8s var(--ease-out) infinite; }
.kd-toast { animation: kd-toast 5s var(--ease-out) infinite; }
.kd-popup { animation: kd-popup 4s var(--ease-out) infinite alternate; }
.kd-boxes { animation: kd-boxes 2.4s var(--ease-in-out) infinite alternate; }

/* Reel art: sizes follow the 1080px canvas through container query units (Part 01 §16.1). */
.kd-reel { container-type: inline-size; }
.kd-cap { direction: rtl; unicode-bidi: plaintext; text-align: center; letter-spacing: 0; text-wrap: balance; overflow-wrap: anywhere; }
.kd-cap bdi { unicode-bidi: isolate; }
.kd-cap-bold-pop { font-weight: 900; font-size: 7.8cqi; line-height: 1.15; color: var(--color-white);
  -webkit-text-stroke: .07em ${ink(90)}; paint-order: stroke fill; text-shadow: 0 .1em .5em ${ink(45)}; }
.kd-cap-bold-pop .kd-on { background: var(--color-primary); color: var(--color-on-primary); -webkit-text-stroke: 0; border-radius: .14em; padding: .04em .2em; text-shadow: none; }
.kd-cap-clean-box { font-weight: 700; font-size: 6.2cqi; line-height: 1.5; color: var(--color-white); }
.kd-cap-clean-box > span { background: ${ink(86)}; border-radius: .22em; padding: .12em .45em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.kd-cap-clean-box .kd-on { box-shadow: inset 0 -.12em 0 var(--color-primary); }
.kd-cap-karaoke { font-weight: 800; font-size: 6.8cqi; line-height: 1.2; color: var(--color-white);
  -webkit-text-stroke: .06em ${ink(85)}; paint-order: stroke fill; }
.kd-cap-karaoke .kd-sung { color: var(--color-rose); }
:root[data-theme="light"] .kd-cap-karaoke .kd-sung { color: color-mix(in oklab, var(--color-rose) 55%, var(--color-white)); }
.kd-cap-poster { font-family: var(--font-display); font-weight: 700; font-size: 12.4cqi; line-height: .98; color: var(--color-white);
  -webkit-text-stroke: .025em ${ink(70)}; paint-order: stroke fill; text-shadow: 0 .06em .25em ${ink(55)}; }
.kd-cap-poster .kd-on { color: var(--color-primary); }
.kd-cap-news { font-weight: 700; font-size: 5.9cqi; line-height: 1.3; color: var(--color-white); text-align: start;
  background: ${ink(82)}; border-radius: .18em; padding: .45em .6em; border-inline-start: .16em solid var(--color-primary); }
.kd-cap-news .kd-on { color: var(--color-primary); }
.kd-cap-soft { font-weight: 700; font-size: 6.4cqi; line-height: 1.45; color: var(--color-on-primary); }
.kd-cap-soft > span { background: color-mix(in oklab, var(--kd-accent, var(--color-rose)) 22%, var(--color-white)); border-radius: .9em; padding: .14em .5em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.kd-cap-soft .kd-on { background: color-mix(in oklab, var(--kd-accent, var(--color-rose)) 38%, var(--color-white)); border-radius: .5em; padding: 0 .12em; }

/* Handwritten-looking sign (trend T1) */
.kd-sign { font-family: var(--font-display); font-weight: 700; color: var(--color-on-primary); line-height: 1.05; }
`;

export function LandingStyles() {
  return (
    <style href="kdimon-landing" precedence="medium">
      {CSS}
    </style>
  );
}
