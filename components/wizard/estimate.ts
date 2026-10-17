/**
 * Credit estimate mirror of Part 05 §14.2 `estimate()` with the Part 04 §16.4 `credit_costs` seed.
 * Pure and client-safe; the real numbers will come from POST /api/projects/[id]/estimate.
 * Sanity: draft30 → 50, standard30 → 107 (VIDEO_COST_EXAMPLES).
 */
import type { Quality, VisualMix } from "@/lib/mock/projects";

export const CREDIT_COSTS = {
  "script.generate": { credits: 2, label: "כתיבת תסריט (כולל 3 הצעות הוק)" },
  "storyboard.generate": { credits: 1, label: "בניית סטוריבורד" },
  "hooks.generate": { credits: 1, label: "עד 10 הוקים חדשים" },
  "image.draft": { credits: 2, label: "תמונה לסצנה: טיוטה" },
  "image.standard": { credits: 4, label: "תמונה לסצנה: סטנדרט" },
  "image.premium": { credits: 7, label: "תמונה לסצנה: פרימיום" },
  "clip.draft": { credits: 2, label: "קליפ וידאו, לכל שנייה: טיוטה" },
  "clip.standard": { credits: 5, label: "קליפ וידאו, לכל שנייה: סטנדרט" },
  "clip.premium": { credits: 11, label: "קליפ וידאו, לכל שנייה: פרימיום" },
  "voice.tts": { credits: 1, label: "קריינות, לכל 15 שניות שהתחילו" },
  "music.generate": { credits: 5, label: "מוזיקה מקורית לסרטון" },
  "render.base": { credits: 3, creditsLong: 5, label: "הרכבת הסרטון, פורמט ראשון" },
  "render.extra_format": { credits: 2, creditsLong: 3, label: "פורמט נוסף" },
} as const;
export type ActionKey = keyof typeof CREDIT_COSTS;

export interface EstimateLine { key: ActionKey; label: string; units: number; credits: number }
export interface EstimateInput {
  durationSec: number;
  quality: Quality;
  visualMix: VisualMix;
  formats: number;
  noVoice?: boolean;
  musicMode?: "library" | "generate" | "none";
  variants?: number;
  /** Optional scene-plan override (sample presets). */
  images?: number;
  clipSeconds?: number;
}

const perUnit = (key: ActionKey, durationSec: number) => {
  const c = CREDIT_COSTS[key] as { credits: number; creditsLong?: number };
  return durationSec > 30 && c.creditsLong != null ? c.creditsLong : c.credits;
};

/** Scene plan: one image per ~5 s; clips by mix (smart: half the duration, full: 80%, images: none). */
function plan(durationSec: number, mix: VisualMix) {
  const images = Math.max(3, Math.round(durationSec / 5));
  const clipSeconds = mix === "images" ? 0 : mix === "smart" ? Math.round(durationSec / 2) : Math.round(durationSec * 0.8);
  return { images, clipSeconds };
}

export function estimate(i: EstimateInput): { credits: number; lines: EstimateLine[]; alreadySpent: number } {
  const lines: EstimateLine[] = [];
  const add = (key: ActionKey, units: number) => {
    if (units <= 0) return;
    const existing = lines.find((l) => l.key === key);
    const credits = units * perUnit(key, i.durationSec);
    if (existing) { existing.units += units; existing.credits += credits; }
    else lines.push({ key, label: CREDIT_COSTS[key].label, units, credits });
  };
  const planned = plan(i.durationSec, i.visualMix);
  const images = i.images ?? planned.images;
  const clipSeconds = i.clipSeconds ?? planned.clipSeconds;
  add(`image.${i.quality}`, images);
  add(`clip.${i.quality}`, clipSeconds);
  const voUnits = Math.ceil(i.durationSec / 15);
  if (!i.noVoice) add("voice.tts", voUnits);
  if (i.musicMode === "generate") add("music.generate", 1);
  add("render.base", 1);
  add("render.extra_format", Math.max(0, i.formats - 1));
  const v = Math.max(1, i.variants ?? 1);
  if (v > 1) {
    const n = v - 1;
    add(`image.${i.quality}`, n);
    if (i.visualMix !== "images") add(`clip.${i.quality}`, n * 3);
    if (!i.noVoice) add("voice.tts", n * voUnits);
    add("render.base", n);
    add("render.extra_format", n * Math.max(0, i.formats - 1));
  }
  const credits = lines.reduce((a, l) => a + l.credits, 0);
  const alreadySpent = CREDIT_COSTS["script.generate"].credits + CREDIT_COSTS["storyboard.generate"].credits;
  return { credits, lines, alreadySpent };
}

/** Quick-start sample (Part 03 §5.1): reel/offer = draft30, brand promo = draft30 at 45 s. Includes text spend. */
export function sampleCost(kind: "reel_hook" | "offer" | "brand_promo" | "trend"): number {
  const durationSec = kind === "brand_promo" ? 45 : kind === "trend" ? 15 : 30;
  const preset = kind === "trend" ? { images: 3, clipSeconds: 5 } : { images: kind === "brand_promo" ? 9 : 6, clipSeconds: 15 };
  const { credits, alreadySpent } = estimate({ durationSec, quality: "draft", visualMix: "smart", formats: 1, ...preset });
  return credits + alreadySpent;
}

/** ETA range in minutes (Part 03 §7.3). */
export function etaRange(quality: Quality, durationSec: number, formats: number, variants = 1): [number, number] {
  const base: Record<Quality, [number, number]> = { draft: [3, 5], standard: [4, 6], premium: [6, 10] };
  const extra = Math.max(0, Math.ceil((durationSec - 30) / 15)) + Math.max(0, formats - 1) * 0.5 + Math.max(0, variants - 1) * 2;
  const [a, b] = base[quality];
  return [Math.round(a + extra), Math.round(b + extra)];
}
