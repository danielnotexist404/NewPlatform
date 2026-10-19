import Link from "next/link";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { AdSafetyBadge } from "./trend-badges";
import { trendReel } from "./trend-reel";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

/** `TrendCard` (spec §J.8) — public variant: a looping reel + name + one line. Links to the "פירוק טרנד" page. */
export function TrendCard({ trend, nicheSlug, className, headingLevel = "h3", index = 0 }: { trend: TrendTemplateV1; nicheSlug?: string; className?: string; headingLevel?: "h2" | "h3"; index?: number }) {
  const H = headingLevel;
  return (
    <article className={cn("group relative flex flex-col gap-4", className)}>
      <ReelCard reel={trendReel(trend, nicheSlug, index)} lite offset={index * 1.3} decorative className="transition-transform duration-500 group-hover:-translate-y-1" />
      <div className="flex flex-col gap-1.5 px-1">
        <H className="text-h3 font-bold leading-snug">
          <Link href={`/trends/${trend.slug}`} className="after:absolute after:inset-0 after:rounded-[22px] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus">
            {trend.name_he}
          </Link>
        </H>
        <p className="line-clamp-2 text-body text-text-2">{trend.tagline_he}</p>
        <div className="mt-1"><AdSafetyBadge safety={trend.ad_safety} /></div>
      </div>
    </article>
  );
}
