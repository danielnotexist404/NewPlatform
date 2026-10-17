import Link from "next/link";
import { Camera, Wand } from "lucide-react";
import { TrendTile } from "./trend-tile";
import { AdSafetyBadge, HookScoreBadge, ProductionBadge, TrendLifecycleBadge } from "./trend-badges";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { TREND_CARD } from "@/content/he/trends-app";
import {
  adaptationFor, createHref, hookScore, onscreenFor, supportsAi, supportsGuided, type TrendTemplate,
} from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

/** TrendCard (spec 07–08 §J.8): demo, name, "למה זה עובד", "מתאים לעסק שלכם כי…", badges, actions. */
export function TrendCard({
  trend, nicheSlug, nicheIcon, featured = false, className,
}: { trend: TrendTemplate; nicheSlug: string | null; nicheIcon?: string | null; featured?: boolean; className?: string }) {
  const detailHref = `/app/trends/${trend.slug}`;
  const fit = adaptationFor(trend, nicheSlug)?.angleHe ?? trend.genericFitHe;
  const ai = supportsAi(trend);
  const guided = supportsGuided(trend);
  const titleId = `trend-${trend.slug}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group grid gap-x-4 gap-y-3 rounded-lg bg-surface-1 p-3 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[background-color,box-shadow] duration-[var(--duration-panel)] hover:bg-surface-2 md:p-4",
        featured ? "grid-cols-[112px_minmax(0,1fr)] md:grid-cols-[208px_minmax(0,1fr)] md:gap-x-6" : "grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[156px_minmax(0,1fr)]",
        className,
      )}
    >
      <Link
        href={detailHref}
        tabIndex={-1}
        aria-hidden
        className={cn("block self-start overflow-hidden rounded-md transition-transform duration-[var(--duration-panel)] group-hover:scale-[1.015]", featured ? "md:row-span-3" : "md:row-span-3")}
      >
        <TrendTile
          art={trend.tile.art}
          tone={trend.tile.tone}
          text={onscreenFor(trend, nicheSlug)}
          nicheIcon={nicheIcon}
          durationSec={trend.durationSec}
          label={TREND_CARD.demoLabel}
          size={featured ? "lg" : "md"}
        />
      </Link>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <TrendLifecycleBadge trend={trend} />
          <ProductionBadge mode={trend.productionMode} />
          <AdSafetyBadge safety={trend.adSafety} />
        </div>
        <h3 id={titleId} className={cn("font-bold leading-tight", featured ? "text-h3" : "text-body-lg")}>
          <Link href={detailHref} className="hover:text-primary-text focus-visible:text-primary-text">
            {trend.nameHe}
            {trend.code && <span className="sr-only"> ({trend.code})</span>}
          </Link>
        </h3>
        <p className={cn("text-text-2", featured ? "text-body" : "text-small")}>{trend.taglineHe}</p>
      </div>

      <div className="col-span-2 flex min-w-0 flex-col gap-3 md:col-span-1 md:col-start-2">
        <div>
          <p className="text-micro text-muted">{TREND_CARD.whyLabel}</p>
          <p className="mt-0.5 line-clamp-2 text-small text-text">{trend.whyItWorksHe[0]}</p>
        </div>
        <div className="rounded-sm bg-surface-2 px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--color-frame)] group-hover:bg-surface-3">
          <p className="text-micro text-primary-text">{TREND_CARD.fitLabel}…</p>
          <p className="mt-0.5 text-small text-text">{fit}</p>
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap items-center gap-2 self-end md:col-span-1 md:col-start-2">
        {ai && (
          <Link href={createHref(trend.slug, "ai", nicheSlug)} className={buttonVariants({ variant: "primary", size: "sm" })}>
            <Wand aria-hidden />
            {TREND_CARD.aiCta}
          </Link>
        )}
        {guided && (
          <Link href={createHref(trend.slug, "guided", nicheSlug)} className={buttonVariants({ variant: ai ? "secondary" : "primary", size: "sm" })}>
            <Camera aria-hidden />
            {TREND_CARD.guidedCta}
          </Link>
        )}
        <span className="ms-auto flex items-center gap-2">
          <HookScoreBadge score={hookScore(trend)} />
        </span>
        <Link href={detailHref} className="inline-flex w-full items-center gap-1 text-small font-semibold text-link hover:underline md:w-auto">
          {TREND_CARD.details}
          <DirIcon name="next" />
          <span className="sr-only">: {trend.nameHe}</span>
        </Link>
      </div>
    </article>
  );
}
