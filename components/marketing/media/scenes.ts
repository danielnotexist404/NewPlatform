/**
 * Scene palettes for the CSS "video" art. Theme-independent tokens only (scene-*, primary, coral, lemon, paper, ink),
 * so a reel looks the same in the light and the dark theme.
 */
export type SceneName = "amber" | "teal" | "dusk" | "blush" | "sky" | "night" | "sand" | "mint";

const m = (c: string, pct: number) => `color-mix(in oklab, var(--color-${c}) ${pct}%, transparent)`;
const mx = (a: string, b: string, pct: number) => `color-mix(in oklab, var(--color-${a}) ${pct}%, var(--color-${b}))`;

export interface Scene {
  /** Base gradient of the "room" */
  base: string;
  /** Two drifting light blobs */
  blobs: [string, string];
  /** Floor / table plane under the product */
  floor: string;
  /** Rim light color for the product */
  rim: string;
}

export const SCENES: Record<SceneName, Scene> = {
  amber: {
    base: `radial-gradient(80% 55% at 70% 18%, ${m("primary", 90)}, transparent 70%), linear-gradient(170deg, ${mx("primary", "scene-cocoa", 55)}, var(--color-scene-cocoa) 58%, var(--color-ink))`,
    blobs: [m("lemon", 70), m("coral", 70)],
    floor: `linear-gradient(180deg, ${mx("scene-cocoa", "primary", 70)}, var(--color-scene-cocoa))`,
    rim: "var(--color-lemon)",
  },
  teal: {
    base: `radial-gradient(70% 50% at 25% 15%, ${m("scene-mint", 80)}, transparent 70%), linear-gradient(170deg, ${mx("scene-teal", "scene-mint", 75)}, var(--color-scene-teal) 50%, var(--color-scene-night))`,
    blobs: [m("scene-mint", 75), m("primary", 55)],
    floor: `linear-gradient(180deg, ${mx("scene-teal", "scene-night", 70)}, var(--color-scene-night))`,
    rim: "var(--color-scene-mint)",
  },
  dusk: {
    base: `radial-gradient(90% 55% at 50% 0%, ${m("primary", 95)}, transparent 72%), radial-gradient(70% 45% at 90% 40%, ${m("coral", 85)}, transparent 70%), linear-gradient(180deg, ${mx("coral", "scene-wine", 70)}, var(--color-scene-wine) 52%, var(--color-scene-night))`,
    blobs: [m("lemon", 60), m("scene-blush", 70)],
    floor: `linear-gradient(180deg, ${mx("scene-wine", "scene-night", 60)}, var(--color-scene-night))`,
    rim: "var(--color-primary)",
  },
  blush: {
    base: `radial-gradient(75% 50% at 28% 14%, ${m("scene-blush", 100)}, transparent 72%), radial-gradient(70% 45% at 85% 60%, ${m("coral", 50)}, transparent 70%), linear-gradient(170deg, ${mx("scene-blush", "scene-wine", 60)}, var(--color-scene-wine) 60%, var(--color-ink))`,
    blobs: [m("paper", 55), m("scene-blush", 80)],
    floor: `linear-gradient(180deg, ${mx("scene-wine", "scene-blush", 70)}, var(--color-scene-wine))`,
    rim: "var(--color-scene-blush)",
  },
  sky: {
    base: `radial-gradient(90% 55% at 50% 0%, ${m("scene-sky", 100)}, transparent 75%), radial-gradient(70% 40% at 20% 72%, ${m("scene-sand", 70)}, transparent 70%), linear-gradient(180deg, ${mx("scene-sky", "scene-navy", 55)}, var(--color-scene-navy) 58%, var(--color-scene-night))`,
    blobs: [m("paper", 50), m("scene-sand", 70)],
    floor: `linear-gradient(180deg, ${mx("scene-navy", "scene-sand", 80)}, var(--color-scene-navy))`,
    rim: "var(--color-scene-sky)",
  },
  night: {
    base: `radial-gradient(60% 40% at 80% 20%, ${m("coral", 70)}, transparent 70%), radial-gradient(60% 45% at 15% 45%, ${m("scene-sky", 45)}, transparent 70%), linear-gradient(180deg, var(--color-scene-navy), var(--color-scene-night) 60%, var(--color-ink))`,
    blobs: [m("lemon", 55), m("coral", 75)],
    floor: `linear-gradient(180deg, ${mx("scene-night", "scene-navy", 60)}, var(--color-ink))`,
    rim: "var(--color-coral)",
  },
  sand: {
    base: `radial-gradient(80% 55% at 30% 15%, ${m("paper", 80)}, transparent 70%), linear-gradient(170deg, var(--color-scene-sand), ${mx("scene-sand", "scene-cocoa", 55)} 60%, var(--color-scene-cocoa))`,
    blobs: [m("paper", 70), m("primary", 55)],
    floor: `linear-gradient(180deg, ${mx("scene-sand", "scene-cocoa", 50)}, var(--color-scene-cocoa))`,
    rim: "var(--color-paper)",
  },
  mint: {
    base: `radial-gradient(80% 55% at 70% 12%, ${m("paper", 75)}, transparent 70%), radial-gradient(70% 50% at 15% 60%, ${m("scene-sky", 70)}, transparent 70%), linear-gradient(170deg, var(--color-scene-mint), ${mx("scene-mint", "scene-teal", 45)} 55%, var(--color-scene-teal))`,
    blobs: [m("paper", 70), m("scene-sky", 80)],
    floor: `linear-gradient(180deg, ${mx("scene-teal", "scene-mint", 70)}, var(--color-scene-teal))`,
    rim: "var(--color-paper)",
  },
};

export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const tint = m;
