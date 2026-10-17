/**
 * Demo data for the home page hero (2026 redesign). Hooks are real seed hooks (lib/data/seed.ts);
 * the view counters are illustrative and always rendered with a visible "דוגמה" label.
 * No real business, customer or result is represented.
 */
import { getHook, getNiche, nicheShortName } from "@/lib/data/seed";

export type SceneName = "teal" | "cocoa" | "dusk" | "blush" | "sky";
export type CaptionStyle = "box" | "shadow" | "accent";

export interface HeroReel {
  key: string;
  nicheSlug: string;
  nicheLabel: string;
  icon: string;
  hook: string;
  scene: SceneName;
  caption: CaptionStyle;
  /** Illustrative view counter, in thousands. Always labelled "דוגמה". */
  viewsK: number;
  sponsored: boolean;
}

function reel(key: string, hookId: string, scene: SceneName, caption: CaptionStyle, viewsK: number, sponsored = false): HeroReel | null {
  const hook = getHook(hookId);
  const niche = hook?.niche_slug ? getNiche(hook.niche_slug) : undefined;
  if (!hook || !niche) return null;
  return { key, nicheSlug: niche.slug, nicheLabel: nicheShortName(niche), icon: niche.icon, hook: hook.text_he, scene, caption, viewsK, sponsored };
}

const defined = <T,>(x: T | null): x is T => x !== null;

/** The fan, in DOM (reading) order: start side → end side. Index 2 is the large center phone. */
export const HERO_REELS: HeroReel[] = [
  reel("r1", "barbers-salons-01", "teal", "box", 48.2, true),
  reel("r2", "restaurants-01", "cocoa", "shadow", 31.7),
  reel("r3", "real-estate-02", "dusk", "accent", 126, true),
  reel("r4", "beauty-nails-01", "blush", "box", 22.4),
  reel("r5", "zimmers-boutique-hotels-02", "sky", "shadow", 57.9, true),
].filter(defined);

/** Hooks the center phone types out, one after another (real seed hooks). */
export const TYPING_REELS: HeroReel[] = [
  reel("t1", "real-estate-02", "dusk", "accent", 126, true),
  reel("t2", "dentists-03", "dusk", "accent", 64.3, true),
  reel("t3", "fitness-trainers-01", "dusk", "accent", 88.1, true),
  reel("t4", "renovation-contractors-01", "dusk", "accent", 41.5, true),
].filter(defined);
