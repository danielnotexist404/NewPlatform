import Link from "next/link";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHookType, getNiche, getSeason, hooks, hooksForSeason, nicheShortName, type Hook } from "@/lib/data/seed";
import { Section, SectionHeading } from "./section-heading";
import { HooksMarquee } from "./hooks-marquee";
import type { HookCardData } from "./hook-card";
import { LANDING } from "@/content/he/landing";

const T = LANDING.hooks;
/** The coming season (Black Friday, 27.11.2026). Revisit when the season helper lands (`getUpcomingSeason`). */
const SEASON_SLUG = "black-friday";
const QUICK_NICHES = ["real-estate", "barbers-salons", "dentists", "restaurants"];

const toCard = (h: Hook): HookCardData => {
  const niche = h.niche_slug ? getNiche(h.niche_slug) : undefined;
  return {
    id: h.id,
    text: h.text_he,
    typeName: getHookType(h.hook_type_slug)?.name_he ?? "",
    nicheLabel: niche ? nicheShortName(niche) : null,
    nicheIcon: niche?.icon ?? null,
  };
};

/** §3.9 HooksTeaser: 24 hooks in two marquee rows, GET search to /hooks, quick chips, CTA. */
export function HooksTeaser() {
  const published = hooks.filter((h) => h.niche_slug !== "local-politics");
  const seen = new Set<string>();
  const featured = published.filter((h) => {
    if (!h.is_featured || h.placeholders.length > 0) return false;
    const k = h.niche_slug ?? `u-${h.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const seasonal = hooksForSeason(SEASON_SLUG).slice(0, 2);
  const pool = [...featured.slice(0, 24 - seasonal.length), ...seasonal].map(toCard);
  const rows: [HookCardData[], HookCardData[]] = [pool.filter((_, i) => i % 2 === 0), pool.filter((_, i) => i % 2 === 1)];
  const season = getSeason(SEASON_SLUG);

  return (
    <Section id="hooks" labelledBy="hooks-title" container={false} className="overflow-hidden">
      <div className="container-marketing">
        <SectionHeading id="hooks-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle(published.length)} />
      </div>
      <div className="mt-12">
        <HooksMarquee rows={rows} />
      </div>
      <div className="container-marketing mt-10 flex flex-col gap-5">
        <form action="/hooks" method="get" role="search" className="flex w-full max-w-2xl flex-col gap-2">
          <label htmlFor="hooks-q" className="text-sm font-semibold text-text">{T.searchLabel}</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input id="hooks-q" name="q" size="lg" placeholder={T.searchPlaceholder} className="ps-10" autoComplete="off" />
            </div>
            <button type="submit" className={buttonVariants({ variant: "secondary", size: "lg", className: "h-[52px]" })}>
              {T.searchButton}
            </button>
          </div>
        </form>
        <nav aria-label={T.quickLabel}>
          <ul className="flex flex-wrap gap-2">
            {QUICK_NICHES.map((slug) => {
              const n = getNiche(slug);
              if (!n) return null;
              return (
                <li key={slug}>
                  <Link href={`/hooks/${slug}`} className="inline-flex h-9 items-center rounded-full bg-surface-2 px-3.5 text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)] hover:text-text">
                    {nicheShortName(n)}
                  </Link>
                </li>
              );
            })}
            {season && !season.is_quiet_day && (
              <li>
                <Link href={`/hooks/season/${season.slug}`} className="inline-flex h-9 items-center rounded-full bg-primary/15 px-3.5 text-sm font-semibold text-primary-text hover:bg-primary/25">
                  {T.seasonChip}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div>
          <Link href="/hooks" className={buttonVariants({ size: "lg" })} data-cta-location="hooks_teaser">
            {T.cta}
          </Link>
        </div>
      </div>
    </Section>
  );
}
