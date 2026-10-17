import { Camera, Clock, Flame, Gauge, Info, Megaphone, Repeat, Wand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Num } from "@/components/a11y/num";
import { TREND_BADGES, TRENDS_FEED } from "@/content/he/trends-app";
import type { AdSafety, ProductionMode, TrendTemplate } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

/** TrendLifecycleBadge (spec 07–08 §J.8): "חדש השבוע" · "בשיא" · "קלאסיקה" · "נגמר בקרוב". */
export function TrendLifecycleBadge({ trend, className }: { trend: Pick<TrendTemplate, "stage" | "endsInDays">; className?: string }) {
  switch (trend.stage) {
    case "new_this_week":
      return (
        <Badge variant="lemon" className={className}>
          <span aria-hidden className="size-1.5 rounded-full bg-on-primary" />
          {TREND_BADGES.stage.new_this_week}
        </Badge>
      );
    case "peak":
      return (
        <Badge className={cn("bg-rose/15 text-rose", className)}>
          <Flame aria-hidden />
          {TREND_BADGES.stage.peak}
        </Badge>
      );
    case "ending_soon":
      return (
        <Badge className={cn("bg-primary/15 text-primary-text", className)}>
          <Clock aria-hidden />
          {TREND_BADGES.stage.ending_soon}
          {trend.endsInDays ? <span className="font-normal">· {TREND_BADGES.endsIn(trend.endsInDays)}</span> : null}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          <Repeat aria-hidden />
          {TREND_BADGES.stage.classic}
        </Badge>
      );
  }
}

export function ProductionBadge({ mode, className }: { mode: ProductionMode; className?: string }) {
  const Icon = mode === "guided" ? Camera : Wand;
  return (
    <Badge variant={mode === "guided" ? "outline" : "violet"} className={className}>
      <Icon aria-hidden />
      {TREND_BADGES.production[mode]}
    </Badge>
  );
}

export function AdSafetyBadge({ safety, className, withTooltip = true }: { safety: AdSafety; className?: string; withTooltip?: boolean }) {
  const organic = safety === "organic_only";
  const extra = TREND_BADGES.adExtra[safety];
  const badge = (
    <Badge
      variant={organic ? undefined : "success"}
      className={cn("whitespace-normal", organic && "bg-rose/15 text-rose", withTooltip && "cursor-help", className)}
      tabIndex={withTooltip ? 0 : undefined}
      aria-label={`${TREND_BADGES.ad[safety]}${extra ? `, ${extra}` : ""}. ${TREND_BADGES.adTooltip[safety]}`}
    >
      {organic ? <Info aria-hidden /> : <Megaphone aria-hidden />}
      {TREND_BADGES.ad[safety]}
      {extra && <span className="font-normal opacity-90">· {extra}</span>}
    </Badge>
  );
  return withTooltip ? <Tooltip content={TREND_BADGES.adTooltip[safety]}>{badge}</Tooltip> : badge;
}

export const scoreTone = (score: number) =>
  score >= 85 ? "text-success" : score >= 70 ? "text-primary-text" : "text-rose";

/** HookScoreBadge (§S.4) — compact pill for cards. */
export function HookScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <Tooltip content={TRENDS_FEED.scoreNote}>
      <span
        tabIndex={0}
        aria-label={`${TREND_BADGES.scoreAria(score)}. ${TRENDS_FEED.scoreNote}`}
        className={cn("inline-flex cursor-help items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}
      >
        <Gauge aria-hidden className={cn("size-3.5", scoreTone(score))} />
        {TREND_BADGES.score}
        <Num value={score} className={cn("text-small font-extrabold", scoreTone(score))} />
      </span>
    </Tooltip>
  );
}

/** Large ring for the trend page score panel. Ring direction never flips (media/chart rule). */
export function HookScoreRing({ score, size = 112 }: { score: number; size?: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={TREND_BADGES.scoreAria(score)}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden style={{ direction: "ltr" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          className={cn("transition-[stroke-dashoffset] duration-700", scoreTone(score))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Num value={score} className={cn("text-h2 font-extrabold leading-none", scoreTone(score))} />
        <span className="text-micro text-muted">מתוך 100</span>
      </div>
    </div>
  );
}
