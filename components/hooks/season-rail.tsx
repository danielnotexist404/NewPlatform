"use client";
import Link from "next/link";
import { CalendarDays, MoonStar } from "lucide-react";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import { useToday } from "./stores";
import { upcomingSeasons } from "./calendar";
import { shortDateHe } from "./text";
import { SmartText } from "./hook-text";

/**
 * "העונות הקרובות" (Part 02 §5.5 item 7): the next seasons by date. Quiet days are grey, without a link,
 * labelled "יום שקט — לא מפרסמים". The election never shows.
 */
export function SeasonRail({ title = HOOKS_COPY.seasonRail.title, nicheSlug, limit = 4, className, headingLevel = "h2" }: {
  title?: string; nicheSlug?: string; limit?: number; className?: string; headingLevel?: "h2" | "h3";
}) {
  const today = useToday();
  const items = upcomingSeasons(today, limit, nicheSlug ? (s) => s.niche_slugs.includes(nicheSlug) : undefined);
  const H = headingLevel;
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="season-rail-title" className={cn("flex flex-col gap-4", className)}>
      <H id="season-rail-title" className="text-h3">{title}</H>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {items.map(({ season, start, end }) => {
          const now = !!today && start <= today && today <= end;
          const label = (
            <>
              <span className="flex items-center gap-2 text-micro text-muted">
                {season.is_quiet_day ? <MoonStar className="size-3.5" aria-hidden /> : <CalendarDays className="size-3.5" aria-hidden />}
                <span>{now ? HOOKS_COPY.seasonRail.now : shortDateHe(start)}</span>
                {now && <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />}
              </span>
              <span className="mt-1 block text-body font-bold leading-snug"><SmartText text={season.name_he} /></span>
              <span className="mt-1 block text-small text-text-2">
                {season.is_quiet_day ? HOOKS_COPY.seasonRail.quiet : <SmartText text={season.publish_window_he} />}
              </span>
            </>
          );
          return (
            <li key={season.slug} className="w-[72%] shrink-0 snap-start xs:w-[60%] md:w-auto">
              {season.is_quiet_day ? (
                <div className="h-full rounded-md bg-surface-1/50 p-4 opacity-70 shadow-[inset_0_0_0_1px_var(--color-frame)]">{label}</div>
              ) : (
                <Link
                  href={`/hooks/season/${season.slug}`}
                  className={cn(
                    "block h-full rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2",
                    now && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-success)_45%,transparent)]",
                  )}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
