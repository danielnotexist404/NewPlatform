/**
 * Pure savings math for EditorMath (Part 02 §3.7.2). Mirrors `lib/marketing/savings.ts` of the spec:
 * the cheapest paid plan + cheapest pack combo (packs never expire) that covers the credits needed.
 * Unit examples (seed prices): 8×₪550 draft → ₪119 (saving ₪4,281); 30×₪550 draft → ₪289 + pack 500 = ₪468
 * (saving ₪16,032); 10×₪550 standard → ₪289 + pack 150 = ₪348 (saving ₪5,152).
 */
import { CREDIT_PACKS, PLANS, VIDEO_COST_EXAMPLES } from "@/lib/data/plans";

export type SavingsPreset = "draft30" | "standard30";

export const CREDITS_PER_VIDEO: Record<SavingsPreset, number> = {
  draft30: VIDEO_COST_EXAMPLES[1].credits, // 50
  standard30: VIDEO_COST_EXAMPLES[2].credits, // 107
};

export interface PackItem { packId: string; credits: number; qty: number }

/** Min-cost combination of packs (each up to 20) whose credits ≥ shortfall. */
export function cheapestPackCombo(shortfall: number): { totalIls: number; items: PackItem[] } {
  if (shortfall <= 0) return { totalIls: 0, items: [] };
  const packs = CREDIT_PACKS;
  let best: { totalIls: number; qty: number[] } | null = null;
  const qty = packs.map(() => 0);
  const walk = (i: number, credits: number, cost: number) => {
    if (best && cost >= best.totalIls) return;
    if (credits >= shortfall) {
      best = { totalIls: cost, qty: [...qty] };
      return;
    }
    if (i >= packs.length) return;
    for (let q = 0; q <= 20; q++) {
      qty[i] = q;
      walk(i + 1, credits + q * packs[i].credits, cost + q * packs[i].priceIls);
      if (credits + q * packs[i].credits >= shortfall) break;
    }
    qty[i] = 0;
  };
  walk(0, 0, 0);
  const b = best as { totalIls: number; qty: number[] } | null;
  if (!b) return { totalIls: Number.POSITIVE_INFINITY, items: [] };
  return {
    totalIls: b.totalIls,
    items: packs.map((p, i) => ({ packId: p.id, credits: p.credits, qty: b.qty[i] })).filter((x) => x.qty > 0),
  };
}

export function computeSavings(i: { videos: number; pricePerVideoIls: number; preset: SavingsPreset }) {
  const creditsPerVideo = CREDITS_PER_VIDEO[i.preset];
  const creditsNeeded = i.videos * creditsPerVideo;
  const todayIls = i.videos * i.pricePerVideoIls;
  const options = PLANS.filter((p) => p.id !== "free").map((p) => {
    const combo = cheapestPackCombo(Math.max(0, creditsNeeded - p.monthlyCredits));
    return { planId: p.id, planName: p.nameHe, totalIls: p.monthlyIls + combo.totalIls, packs: combo.items };
  });
  const ours = options.reduce((a, b) => (b.totalIls < a.totalIls ? b : a));
  const savingMonthlyIls = todayIls - ours.totalIls;
  return { creditsPerVideo, creditsNeeded, todayIls, ours, savingMonthlyIls, savingYearlyIls: savingMonthlyIls * 12 };
}
