import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SampleTag } from "@/components/marketing/gallery/kit";
import { TrendArt } from "./trend-art";
import { AdSafetyBadge, ProductionBadge, TrendLifecycleBadge } from "./trend-badges";
import { TRENDS_HUB } from "@/content/he/trends";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

/** `TrendCard` (spec §J.8) — public variant: links to the "פירוק טרנד" page. */
export function TrendCard({ trend, nicheSlug, className, headingLevel = "h3" }: { trend: TrendTemplateV1; nicheSlug?: string; className?: string; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn("group relative flex flex-col gap-4 rounded-lg bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-surface-2 hover:elev-2", className)}>
      <div className="relative">
        <TrendArt trend={trend} nicheSlug={nicheSlug} size="sm" tag={<SampleTag>{TRENDS_HUB.demoTag}</SampleTag>} className="transition-transform duration-500 group-hover:scale-[1.015]" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-1 pb-1">
        <div className="flex flex-wrap gap-1.5">
          <TrendLifecycleBadge stage={trend.mock_stage} />
          <AdSafetyBadge safety={trend.ad_safety} />
        </div>
        <H className="text-[1.125rem] font-bold leading-snug sm:text-h3">
          <Link href={`/trends/${trend.slug}`} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus">
            {trend.name_he}
          </Link>
        </H>
        <p className="text-small text-text-2 line-clamp-3">{trend.tagline_he}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <ProductionBadge mode={trend.production_mode} />
          <span aria-hidden className="hidden items-center gap-1 text-small font-semibold text-primary-text sm:inline-flex">
            {TRENDS_HUB.cardCta}
            <DirIcon name="forward" className="size-4 transition-transform group-hover:ltr:translate-x-0.5 group-hover:rtl:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
