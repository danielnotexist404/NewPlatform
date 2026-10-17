"use client";
import * as React from "react";
import Link from "next/link";
import { Banknote, Check, MousePointerClick, ReceiptText, Repeat, RotateCcw, Percent, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Num, Price } from "@/components/a11y/num";
import { PLANS, PLAN_PROMISES_HE, VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import { loginNext } from "./create-link";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.pricing;
const PROMISE_ICONS: LucideIcon[] = [Percent, Repeat, RotateCcw, MousePointerClick, ReceiptText, Banknote];

/** §3.12 PricingCards + short CreditCostTable, from lib/data/plans.ts. */
export function PricingTeaser() {
  const [cycle, setCycle] = React.useState<"monthly" | "annual">("monthly");
  const id = React.useId();
  return (
    <div className="mt-10 flex flex-col gap-8">
      <ToggleGroup
        type="single"
        value={cycle}
        onValueChange={(v) => v && setCycle(v as "monthly" | "annual")}
        aria-label={T.cycleLabel}
        className="w-fit rounded-full p-1 [&>button]:rounded-full [&>button]:px-4"
      >
        <ToggleGroupItem value="monthly">{T.monthly}</ToggleGroupItem>
        <ToggleGroupItem value="annual">{T.annual}</ToggleGroupItem>
      </ToggleGroup>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const highlighted = !!p.badgeHe;
          const annual = cycle === "annual" && p.annualMonthlyIls != null;
          const href = p.id === "free" ? loginNext("/app/onboarding") : loginNext(`/app/billing/plans?plan=${p.id}&cycle=${cycle}`);
          return (
            <li
              key={p.id}
              className={cn(
                "relative flex flex-col gap-5 rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]",
                highlighted && "shadow-[inset_0_0_0_1.5px_var(--color-primary),var(--glow-primary)] xl:-my-2 xl:py-8",
              )}
            >
              {highlighted && (
                <span className="absolute -top-3 inset-s-6 rounded-full bg-primary px-3 py-0.5 text-micro text-on-primary">{T.recommended}</span>
              )}
              <div className="flex flex-col gap-1">
                <h3 className="text-h3 text-text">{p.nameHe}</h3>
                <p className="text-small text-text-2">{p.taglineHe}</p>
              </div>
              <div className="flex flex-col gap-1">
                {annual && (
                  <span className="text-small text-muted line-through">
                    <Price ils={p.monthlyIls} />
                    <span className="sr-only">{T.insteadOf(p.monthlyIls)}</span>
                  </span>
                )}
                <span className="text-5xl font-extrabold leading-none text-text">
                  <Price ils={annual ? p.annualMonthlyIls! : p.monthlyIls} />
                </span>
                <span className="text-micro font-normal text-text-2">{annual ? T.perMonthAnnual(p.annualTotalIls!) : T.perMonth}</span>
                <span className="mt-1 text-small font-semibold text-primary-text">{p.id === "free" ? T.approxFree : T.approxPaid(p.approxVideos)}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {p.featuresHe.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-small text-text">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" style={{ transform: "none" }} aria-hidden />
                    <span>
                      <span className="sr-only">{T.included}: </span>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={buttonVariants({ variant: highlighted ? "primary" : "secondary", size: "lg", className: "mt-auto w-full" })}
                data-cta-location={`pricing_card_${p.id}`}
              >
                {T.cta[p.id]}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul aria-label={T.promisesLabel} className="grid gap-x-6 gap-y-3 rounded-lg bg-surface-1/60 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:grid-cols-2 lg:grid-cols-3">
        {PLAN_PROMISES_HE.map((t, i) => {
          const Icon = PROMISE_ICONS[i] ?? Check;
          return (
            <li key={t} className="flex items-start gap-2 text-small text-text-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
              {t}
            </li>
          );
        })}
      </ul>

      <div id="credit-costs-short" className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-2 lg:col-span-5">
          <h3 className="text-h3 text-text">{T.costTitle}</h3>
          <p className="text-small text-text-2">{T.costIntro}</p>
        </div>
        <div className="overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:col-span-7">
          <table className="w-full text-small" aria-describedby={`${id}-cap`}>
            <caption id={`${id}-cap`} className="sr-only">{T.costCaption}</caption>
            <thead>
              <tr className="border-b border-border text-micro text-muted">
                <th scope="col" className="px-4 py-3 text-start font-semibold">{T.costCols.video}</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">{T.costCols.credits}</th>
              </tr>
            </thead>
            <tbody>
              {VIDEO_COST_EXAMPLES.slice(0, 4).map((r) => (
                <tr key={r.labelHe} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 text-start font-normal text-text">{r.labelHe}</th>
                  <td className="px-4 py-3 text-end text-lg font-bold text-primary-text"><Num value={r.credits} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })} data-cta-location="landing_pricing">
          {T.cta_all}
        </Link>
        <Link href={loginNext("/app/campaigns/health")} className="text-sm font-semibold text-link underline-offset-4 hover:underline" data-cta-location="health_check">
          {T.healthLine}
        </Link>
      </div>
    </div>
  );
}
