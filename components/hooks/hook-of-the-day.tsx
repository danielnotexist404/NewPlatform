"use client";
import Link from "next/link";
import { MoonStar, Sun } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { HOOKS_COPY } from "@/content/he/hooks";
import { SEASON_DATES } from "@/content/he/hooks";
import type { HookView } from "./hook-data";
import { HookCard } from "./hook-card";
import { useToday } from "./stores";
import { quietDayToday } from "./calendar";
import { daysBetween, weekdayDateHe } from "./text";

const EPOCH = "2026-01-01";

/**
 * "הוק היום" (Part 02 §5.5). Until the cron + app_settings exist, the pick is a deterministic daily rotation
 * over featured hooks, preferring a seasonal hook whose season starts within 21 days. Quiet day → no hook.
 */
function pick(pool: HookView[], today: string): HookView {
  const seasonal = pool.filter((h) => {
    if (!h.seasonSlug) return false;
    const d = SEASON_DATES[h.seasonSlug];
    if (!d) return false;
    const until = daysBetween(today, d.start);
    return (until >= 0 && until <= 21) || (today >= d.start && today <= d.end);
  });
  const list = seasonal.length ? seasonal : pool;
  const day = Math.max(0, daysBetween(EPOCH, today));
  return list[day % list.length];
}

export function HookOfTheDay({ pool }: { pool: HookView[] }) {
  const today = useToday();
  const quiet = quietDayToday(today);
  const hook = today ? pick(pool, today) : pool[0];
  const eyebrow = today ? `${HOOKS_COPY.hotd.eyebrow} · ${weekdayDateHe(today)}` : HOOKS_COPY.hotd.eyebrow;

  return (
    <section aria-labelledby="hotd-title" className="flex flex-col gap-4">
      <p id="hotd-title" className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2" suppressHydrationWarning>
        {quiet ? <MoonStar className="size-3.5" aria-hidden /> : <Sun className="size-3.5 text-primary-text" aria-hidden />}
        {eyebrow}
      </p>
      {quiet ? (
        <div className="rounded-lg bg-surface-1 p-8 text-center text-body-lg text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{HOOKS_COPY.hotd.quiet}</div>
      ) : (
        <>
          <HookCard hook={hook} variant="featured" location="hotd" headingLevel="h2" />
          <Link href={hook.nicheSlug ? `/hooks/${hook.nicheSlug}` : "/hooks/types"} className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary-text hover:underline">
            {hook.nicheShort ? HOOKS_COPY.hotd.more(hook.nicheShort) : HOOKS_COPY.hotd.moreUniversal}
            <DirIcon name="forward" />
          </Link>
        </>
      )}
    </section>
  );
}
