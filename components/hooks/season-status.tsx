"use client";
import * as React from "react";
import Link from "next/link";
import { Clapperboard, MoonStar, Timer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import { useToday } from "./stores";
import { quietDayToday, seasonPhase } from "./calendar";
import { plural } from "./text";

const S = HOOKS_COPY.season;

/** Client countdown: "עוד # ימים" / "העונה בעיצומה" / "העונה הסתיימה…" (Part 02 §5.8). */
export function SeasonCountdown({ slug }: { slug: string }) {
  const today = useToday();
  if (!today) return <span className="inline-block h-6 w-24 animate-pulse rounded-full bg-surface-2" aria-hidden />;
  const phase = seasonPhase(slug, today);
  if (!phase) return null;
  const text = phase.kind === "upcoming" ? plural(phase.days, S.countdown) : phase.kind === "now" ? S.inProgress : S.ended;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        phase.kind === "now" ? "bg-success/15 text-success" : phase.kind === "ended" ? "bg-surface-2 text-text-2" : "bg-primary/15 text-primary-text",
      )}
    >
      <Timer className="size-4" aria-hidden />
      <span className="num">{text}</span>
    </span>
  );
}

/**
 * Promo CTA that respects quiet days: on Yom HaShoah / Yom HaZikaron the button is replaced by a quiet notice
 * (Part 02 §2.1, §5.8; spec F quiet days).
 */
export function QuietAwareCta({ href, label, sub }: { href: string; label: string; sub?: string }) {
  const today = useToday();
  const quiet = quietDayToday(today);
  if (quiet) {
    return (
      <p className="flex items-start gap-2 rounded-md bg-surface-2 p-4 text-text-2" role="note">
        <MoonStar className="mt-1 size-4 shrink-0" aria-hidden />
        {S.quietToday(quiet.name_he)}
      </p>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Link href={href} className={cn(buttonVariants({ size: "xl" }))}>
        <Clapperboard aria-hidden />
        {label}
      </Link>
      {sub && <p className="max-w-md text-small text-text-2">{sub}</p>}
    </div>
  );
}
