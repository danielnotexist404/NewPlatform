import Link from "next/link";
import { Calendar, Clapperboard, Flame, Smartphone, WandSparkles } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Plural } from "@/components/projects/plural";
import { sampleCost } from "@/components/wizard/estimate";
import { APP_CORE } from "@/content/he/app-core";
import { MOCK_TREND } from "@/lib/mock/workspace";
import { cn } from "@/lib/utils";

const D = APP_CORE.dashboard;

const CARDS = [
  { key: "brand_promo", icon: Clapperboard, href: "/app/create?type=brand_promo&src=dashboard", glow: "primary" },
  { key: "reel_hook", icon: Smartphone, href: "/app/create?type=reel_hook&src=dashboard", glow: "rose" },
  { key: "offer", icon: Calendar, href: "/app/create?type=offer&src=dashboard", glow: "violet" },
  { key: "trend", icon: Flame, href: `/app/create?trend=${MOCK_TREND.slug}&src=trend`, glow: "lemon" },
] as const;

/** Part 03 §5.1 quick starts + "טרנד השבוע" (spec 07–08 §J.8). Mobile: horizontal snap rail. */
export function QuickStarts() {
  return (
    <section aria-labelledby="qs-title" className="flex flex-col gap-4">
      <h2 id="qs-title" className="sr-only">{D.quickStartsLabel}</h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
        {CARDS.map(({ key, icon: Icon, href, glow }) => {
          const copy = D.quickStarts[key];
          const cost = sampleCost(key);
          const isTrend = key === "trend";
          return (
            <li key={key} className="w-[78%] shrink-0 snap-start xs:w-[70%] md:w-auto">
              <Link
                href={href}
                className="group relative isolate flex h-full min-h-44 flex-col gap-3 overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-surface-2 hover:glow-primary focus-visible:outline-2"
              >
                <span
                  aria-hidden
                  className="absolute -top-16 -inset-e-16 -z-10 size-48 rounded-full opacity-60 blur-3xl transition-opacity group-hover:opacity-90"
                  style={{ background: `color-mix(in oklab, var(--color-${glow}) 30%, transparent)` }}
                />
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-sm",
                      glow === "primary" && "bg-primary text-on-primary",
                      glow === "rose" && "bg-rose/15 text-rose",
                      glow === "violet" && "bg-violet/15 text-violet",
                      glow === "lemon" && "bg-lemon text-on-primary",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {isTrend && <span className="rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{D.trend.badgeNew}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-h3">{copy.title}</h3>
                  <p className="text-small text-text-2">
                    {isTrend ? `${MOCK_TREND.nameHe} · ${copy.description}` : copy.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-1 text-small">
                  <span className="text-muted">
                    <Plural n={cost} forms={APP_CORE.counts.creditsFrom} />
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-text transition-colors group-hover:bg-primary group-hover:text-on-primary">
                    <DirIcon name="forward" className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/app/create?fast=1&src=dashboard"
        className="group inline-flex w-fit items-center gap-2 rounded-full bg-violet/10 px-4 py-2 text-small font-semibold text-violet shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_35%,transparent)] transition-colors hover:bg-violet/20"
      >
        <WandSparkles className="size-4" aria-hidden />
        {D.fastPath}
        <DirIcon name="next" className="size-4 transition-transform rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
