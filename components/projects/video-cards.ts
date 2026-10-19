import { PROJECT_STAGE_GROUP, projectHref, relativeFromNow, type MockProject, type SceneTone } from "@/lib/mock/projects";
import type { GeneratedVideo } from "@/lib/generate/store";
import type { VideoCardData } from "./video-card";

const GROUP_STATUS = {
  ready: { label: "מוכן", tone: "ready" },
  progress: { label: "בהכנה", tone: "progress" },
  drafts: { label: "טיוטה", tone: "draft" },
  failed: { label: "נכשל", tone: "failed" },
} as const;

export function projectCard(p: MockProject): VideoCardData {
  return {
    id: p.id,
    href: projectHref(p),
    title: p.title,
    hookText: p.hookText || undefined,
    tone: p.tone,
    icon: p.scenes[0]?.icon ?? "UtensilsCrossed",
    durationSec: p.durationSec,
    aspect: p.primaryAspect,
    status: GROUP_STATUS[PROJECT_STAGE_GROUP[p.stage]],
    meta: relativeFromNow(p.updatedAt),
  };
}

const TONES: SceneTone[] = ["ember", "gold", "rose", "violet", "night"];
export const toneFor = (i: number): SceneTone => TONES[i % TONES.length];

/** Client only (uses the current time for the relative label). */
export function generatedCard(v: GeneratedVideo): VideoCardData {
  return {
    id: v.id,
    href: `/app/projects/generated?id=${encodeURIComponent(v.id)}`,
    title: v.title,
    hookText: v.scenes[0]?.onscreen_text_he || v.hookText,
    tone: "ember",
    icon: "Sparkles",
    durationSec: v.durationSec,
    aspect: v.aspect,
    image: v.scenes[0]?.image ?? null,
    status: GROUP_STATUS.ready,
    meta: relativeFromNow(v.createdAt, new Date().toISOString()),
  };
}
