import { reelFromText, type ReelData } from "@/components/marketing/media/reel-data";
import type { TrendTemplateV1 } from "@/lib/mock/trends";

/** A trend as ReelCard data: the on-screen line of its niche adaptation (or the trend name). */
export function trendReel(t: TrendTemplateV1, nicheSlug?: string, i = 0): ReelData {
  const ad = t.niche_adaptations.find((a) => a.niche_slug === nicheSlug) ?? t.niche_adaptations[(t.sort_order + i) % Math.max(1, t.niche_adaptations.length)];
  const line = ad ? Object.values(ad.onscreen_examples_he)[0] : undefined;
  const caption = (["box", "shadow", "accent"] as const)[i % 3];
  return reelFromText(`tr-${t.slug}-${ad?.niche_slug ?? "x"}`, line || t.name_he, ad?.niche_slug ?? nicheSlug ?? null, {
    caption,
    viewsK: 20 + ((t.sort_order * 37) % 80),
  });
}
