"use client";
import * as React from "react";
import Link from "next/link";
import { Check, Gift } from "lucide-react";
import { CountUp } from "./count-up";
import { SectionHeading } from "./section-heading";
import { loginNext } from "./create-link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, ctaArrow, inkCta } from "@/components/layout/cta-styles";
import { PLANS, type Plan } from "@/lib/data/plans";
import { SIGNUP_HREF } from "@/lib/constants";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.pricing;
const nf = new Intl.NumberFormat("he-IL");
type Cycle = "monthly" | "annual";

const PAID = PLANS.filter((p) => p.id !== "free");
const SAVE_PCT = Math.round(
  Math.min(...PAID.map((p) => (p.annualMonthlyIls ? 1 - p.annualMonthlyIls / p.monthlyIls : 0))) * 100,
);

function PlanCard({ plan, cycle }: { plan: Plan; cycle: Cycle }) {
  const featured = plan.badgeHe === C.recommended;
  const price = cycle === "annual" && plan.annualMonthlyIls ? plan.annualMonthlyIls : plan.monthlyIls;
  const features = C.features[plan.id] ?? plan.featuresHe.slice(0, 6);
  return (
    <li
      className={cn(
        "reveal relative flex flex-col rounded-[28px] p-px transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1",
        featured
          ? "bg-accent-gradient shadow-[0_40px_80px_-36px_color-mix(in_oklab,var(--color-coral)_70%,transparent)] lg:-my-4"
          : "bg-border shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_5%,transparent)] hover:shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--color-ink)_25%,transparent)]",
      )}
    >
      <div className={cn("flex h-full flex-col rounded-[27px] bg-surface-1 p-6 md:p-7", featured && "lg:py-10")}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-h3 text-text">{plan.nameHe}</h3>
          {featured && <span className="rounded-full bg-accent-gradient px-3 py-1 text-micro text-ink">{plan.badgeHe}</span>}
        </div>
        <p className="mt-1 text-small text-text-2">{plan.taglineHe}</p>
        <p className="mt-6 flex items-baseline gap-1.5">
          <CountUp
            value={price}
            from={Math.round(price * 0.6)}
            prefix="₪"
            label={`${price} שקלים`}
            className="text-[3.25rem] font-black leading-none text-text"
          />
          <span className="text-small text-muted">{C.perMonth}</span>
        </p>
        <p className="mt-2 min-h-[1.4em] text-micro font-normal text-muted">
          {cycle === "annual" && plan.annualTotalIls ? C.billedAnnual(`₪${nf.format(plan.annualTotalIls)}`) : C.billedMonthly}
        </p>
        <Link
          href={loginNext(`/app/billing/plans?plan=${plan.id}&cycle=${cycle}`)}
          className={cn(featured ? accentCta : cn(inkCta, "dark:bg-text dark:text-bg"), "mt-6 h-12 w-full text-base")}
        >
          {C.cta(plan.nameHe)}
          <DirIcon name="forward" className={ctaArrow} />
        </Link>
        <ul className="mt-7 flex flex-col gap-3 border-t border-border pt-6 text-small text-text">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span aria-hidden className={cn("mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full", featured ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text")}>
                <Check className="size-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function PricingTeaser() {
  const [cycle, setCycle] = React.useState<Cycle>("monthly");
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative scroll-mt-20 py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 mx-auto h-[60%] max-w-5xl rounded-[50%] opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent)" }}
      />
      <div className="container-marketing">
        <SectionHeading id="pricing-title" eyebrow={C.eyebrow} title={C.title} subtitle={C.subtitle}>
          <div role="radiogroup" aria-label={C.cycleLabel} className="mt-4 inline-flex rounded-full bg-surface-3 p-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            {(["monthly", "annual"] as const).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={cycle === c}
                onClick={() => setCycle(c)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-5 text-small font-semibold transition-[background-color,color,box-shadow] duration-300",
                  cycle === c ? "bg-surface-1 text-text shadow-[0_1px_3px_color-mix(in_oklab,var(--color-ink)_14%,transparent)]" : "text-text-2 hover:text-text",
                )}
              >
                {c === "monthly" ? C.monthly : C.annual}
                {c === "annual" && SAVE_PCT > 0 && (
                  <span className="rounded-full bg-success/12 px-2 py-0.5 text-micro text-success">{C.save(SAVE_PCT)}</span>
                )}
              </button>
            ))}
          </div>
        </SectionHeading>

        <ul className="mt-14 grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
          {PAID.map((p) => (
            <PlanCard key={p.id} plan={p} cycle={cycle} />
          ))}
        </ul>

        <div className="reveal mt-8 flex flex-col items-center justify-between gap-4 rounded-[22px] bg-surface-2 px-5 py-4 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:flex-row md:px-7">
          <div className="flex items-center gap-3 text-center sm:text-start">
            <span aria-hidden className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-surface-1 text-primary-text shadow-[inset_0_0_0_1px_var(--color-frame)] sm:inline-flex">
              <Gift className="size-[18px]" />
            </span>
            <p className="text-body text-text">
              <span className="font-bold">{C.trial.title}</span> <span className="text-text-2">{C.trial.text}</span>
            </p>
          </div>
          <Link href={SIGNUP_HREF} className="group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-surface-1 px-5 text-small font-bold text-text shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_8%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-transform hover:-translate-y-px">
            {C.trial.cta}
            <DirIcon name="forward" className={ctaArrow} />
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-small text-muted">{C.note}</p>
          <Link href="/pricing" className="group inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
            {C.all}
            <DirIcon name="forward" className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
