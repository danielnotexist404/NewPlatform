import { getHook, getNiche, nicheShortName } from "@/lib/data/seed";
import { nicheVisual, type PropName } from "./props";
import type { SceneName } from "./scenes";

export type CaptionStyle = "box" | "shadow" | "accent";

/** Everything a ReelCard needs. Hooks come from the seed; view counters are illustrative and always labelled "דוגמה". */
export interface ReelData {
  key: string;
  nicheSlug: string;
  nicheLabel: string;
  icon: string;
  hook: string;
  scene: SceneName;
  prop: PropName;
  caption: CaptionStyle;
  /** Index of the word that pops in the accent color (optional) */
  highlight?: number;
  /** Illustrative view counter, in thousands */
  viewsK: number;
  sponsored?: boolean;
}

export interface ReelOptions {
  key?: string;
  scene?: SceneName;
  prop?: PropName;
  caption?: CaptionStyle;
  highlight?: number;
  viewsK?: number;
  sponsored?: boolean;
}

/** Builds a ReelData from a real seed hook id (null when the hook or its niche is missing). */
export function reelFromHook(hookId: string, o: ReelOptions = {}): ReelData | null {
  const hook = getHook(hookId);
  const niche = hook?.niche_slug ? getNiche(hook.niche_slug) : undefined;
  if (!hook || !niche) return null;
  const v = nicheVisual(niche.slug);
  return {
    key: o.key ?? hookId,
    nicheSlug: niche.slug,
    nicheLabel: nicheShortName(niche),
    icon: niche.icon,
    hook: hook.text_he,
    scene: o.scene ?? v.scene,
    prop: o.prop ?? v.prop,
    caption: o.caption ?? "box",
    highlight: o.highlight,
    viewsK: o.viewsK ?? 24,
    sponsored: o.sponsored,
  };
}

/** Builds a ReelData from free text (e.g. a trend or template title) and a niche slug. */
export function reelFromText(key: string, text: string, nicheSlug: string | null, o: ReelOptions = {}): ReelData {
  const niche = nicheSlug ? getNiche(nicheSlug) : undefined;
  const v = nicheVisual(nicheSlug);
  return {
    key,
    nicheSlug: niche?.slug ?? "",
    nicheLabel: niche ? nicheShortName(niche) : "",
    icon: niche?.icon ?? "Sparkles",
    hook: text,
    scene: o.scene ?? v.scene,
    prop: o.prop ?? v.prop,
    caption: o.caption ?? "box",
    highlight: o.highlight,
    viewsK: o.viewsK ?? 18,
    sponsored: o.sponsored,
  };
}

export const isReel = <T,>(x: T | null): x is T => x !== null;
