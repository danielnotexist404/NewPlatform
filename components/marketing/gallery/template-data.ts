import { publicTemplates, type VideoTemplate } from "@/lib/mock/gallery";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import type { TemplateCardData } from "./template-card";

/** Server-side: enrich templates with niche name/icon (keeps the seed out of client bundles). */
export function toCardData(list: VideoTemplate[] = publicTemplates()): TemplateCardData[] {
  return list.map((t) => {
    const n = t.niche_slug ? getNiche(t.niche_slug) : undefined;
    return { ...t, nicheName: n ? nicheShortName(n) : null, nicheIconName: n?.icon ?? null };
  });
}
