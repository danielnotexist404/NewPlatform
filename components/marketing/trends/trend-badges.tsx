import { Ban, Bot, Camera, Clapperboard, Flame, Megaphone, Sparkle, Star, Timer } from "lucide-react";
import { AD_SAFETY, LIFECYCLE_STAGE_LABEL, PRODUCTION_LABEL } from "@/content/he/trends";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

const base = "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro whitespace-nowrap [&_svg]:size-3.5";

/** `TrendLifecycleBadge` (spec §J.8): "חדש השבוע" · "בשיא" · "קלאסיקה" · "נגמר בקרוב". */
export function TrendLifecycleBadge({ stage, className }: { stage: TrendTemplateV1["mock_stage"]; className?: string }) {
  const map = {
    new: { cls: "bg-lemon text-on-primary", Icon: Sparkle },
    peak: { cls: "bg-rose/15 text-rose", Icon: Flame },
    fading: { cls: "bg-surface-3 text-text-2", Icon: Timer },
    classic: { cls: "bg-violet/15 text-violet", Icon: Star },
  } as const;
  const { cls, Icon } = map[stage];
  return (
    <span className={cn(base, cls, className)}>
      <Icon aria-hidden />
      {LIFECYCLE_STAGE_LABEL[stage]}
    </span>
  );
}

export function ProductionBadge({ mode, className }: { mode: TrendTemplateV1["production_mode"]; className?: string }) {
  const Icon = mode === "ai" ? Bot : mode === "guided" ? Camera : Clapperboard;
  return (
    <span className={cn(base, "bg-surface-3 text-text-2", className)}>
      <Icon aria-hidden />
      {PRODUCTION_LABEL[mode]}
    </span>
  );
}

/** Ad badge: "מתאים למודעה" / "רק לפרסום רגיל" — never colour alone (icon + text). */
export function AdSafetyBadge({ safety, className }: { safety: TrendTemplateV1["ad_safety"]; className?: string }) {
  const organic = safety === "organic_only";
  return (
    <span className={cn(base, organic ? "bg-danger/15 text-danger" : "bg-success/15 text-success", className)}>
      {organic ? <Ban aria-hidden /> : <Megaphone aria-hidden />}
      {AD_SAFETY[safety].badge}
    </span>
  );
}
