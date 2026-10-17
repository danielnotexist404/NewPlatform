import Link from "next/link";
import { ChartNoAxesColumn, Clapperboard, Clock, Megaphone, Percent, ShieldCheck, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Section, SectionHeading } from "./section-heading";
import { DashboardPreview } from "./dashboard-preview";
import { SIGNUP_HREF } from "@/lib/constants";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Clapperboard, Megaphone, ChartNoAxesColumn, Percent, ShieldCheck, Clock };
const T = LANDING.campaigns;

/** CampaignFlow (#campaigns, spec 07–08 §L.5): video → campaign → report, with the sample dashboard. */
export function CampaignFlow() {
  return (
    <Section id="campaigns" labelledBy="campaigns-title" className="overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] light:hidden"
        style={{ background: "radial-gradient(50% 60% at 50% 0%, color-mix(in oklab, var(--color-violet) 16%, transparent), transparent 70%)" }}
      />
      <SectionHeading id="campaigns-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} align="center" className="mx-auto" />

      <ol className="relative mt-14 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <span aria-hidden className="absolute inset-x-[16%] top-9 hidden h-px border-t border-dashed border-border-strong lg:block" />
        {T.steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <li key={s.title} className="relative flex flex-col gap-3 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <div className="flex items-center justify-between">
                <span className={cn("relative inline-flex size-12 items-center justify-center rounded-full", i === 1 ? "bg-primary text-on-primary glow-primary" : "bg-surface-3 text-primary-text")}>
                  <Icon className="size-5" aria-hidden />
                </span>
                {i < 2 && <DirIcon name="forward" className="hidden size-5 text-muted lg:block" />}
              </div>
              <p className="text-micro text-primary-text">{s.kicker}</p>
              <h3 className="text-h3 text-text">{s.title}</h3>
              <p className="text-small text-text-2">{s.text}</p>
              {i === 1 && (
                <ul className="mt-1 flex flex-wrap gap-1.5" aria-label={T.goalsLabel}>
                  {T.goals.map((g, gi) => (
                    <li key={g} className={cn("rounded-full px-2.5 py-1 text-micro", gi === 0 ? "bg-primary/15 text-primary-text" : "bg-surface-3 text-text-2")}>
                      {g}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-10">
        <DashboardPreview />
      </div>

      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {T.facts.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <li key={f.text} className="flex items-start gap-2.5 text-small text-text-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {f.text}
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href={SIGNUP_HREF} className={buttonVariants({ size: "lg" })} data-cta-location="campaigns">
          {T.ctaPrimary}
        </Link>
        <Link href="/campaigns" className={buttonVariants({ variant: "ghost", size: "lg" })}>
          {T.ctaSecondary}
        </Link>
      </div>
    </Section>
  );
}
