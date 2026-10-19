"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Coins, Info } from "lucide-react";
import { accentCta, inkCta } from "@/components/layout/cta-styles";
import { LANDING } from "@/content/he/landing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import { Num } from "@/components/a11y/num";
import { PLANS, CREDIT_PACKS, type Plan } from "@/lib/data/plans";
import { PACKS, PLAN_CARD, PRICING_CONTROLS, TYPICAL_VIDEO_CREDITS } from "@/content/he/pricing";
import { fmtIls, netOf, vatPercent } from "./money";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";
type Tab = "plans" | "packs";

const loginNext = (target: string) => `/login?next=${encodeURIComponent(target)}`;

function planHref(p: Plan, cycle: Cycle) {
  if (p.id === "free") return "/login?next=/app/onboarding";
  return loginNext(`/app/billing/plans?plan=${p.id}&cycle=${cycle}`);
}

/** URL-backed controls (`?cycle=annual&vat=excl`, Part 02 §7.1). Rendered inside <Suspense>. */
export function PricingExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cycle: Cycle = params.get("cycle") === "annual" ? "annual" : "monthly";
  const excl = params.get("vat") === "excl";
  const [tab, setTab] = React.useState<Tab>(params.get("tab") === "packs" ? "packs" : "plans");

  const push = (next: { cycle?: Cycle; excl?: boolean }) => {
    const q = new URLSearchParams(params.toString());
    const c = next.cycle ?? cycle;
    const e = next.excl ?? excl;
    if (c === "annual") q.set("cycle", "annual");
    else q.delete("cycle");
    if (e) q.set("vat", "excl");
    else q.delete("vat");
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <PricingView
      tab={tab}
      cycle={cycle}
      excl={excl}
      onTab={setTab}
      onCycle={(c) => push({ cycle: c })}
      onExcl={(e) => push({ excl: e })}
    />
  );
}

/** Static fallback for the prerendered shell: same markup, default state (monthly, incl. VAT). */
export function PricingExplorerFallback() {
  return <PricingView tab="plans" cycle="monthly" excl={false} />;
}

function PricingView({
  tab,
  cycle,
  excl,
  onTab,
  onCycle,
  onExcl,
}: {
  tab: Tab;
  cycle: Cycle;
  excl: boolean;
  onTab?: (t: Tab) => void;
  onCycle?: (c: Cycle) => void;
  onExcl?: (e: boolean) => void;
}) {
  const vatId = React.useId();
  return (
    <Tabs value={tab} onValueChange={(v) => onTab?.(v as Tab)} dir="rtl" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4">
        <TabsList aria-label="סוג תשלום" className="h-12 items-center p-1.5">
          <TabsTrigger value="plans" className="h-9 px-5">
            {PRICING_CONTROLS.tabs.plans}
          </TabsTrigger>
          <TabsTrigger value="packs" className="h-9 px-5">
            {PRICING_CONTROLS.tabs.packs}
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tab === "plans" && (
            <ToggleGroup
              type="single"
              value={cycle}
              onValueChange={(v) => v && onCycle?.(v as Cycle)}
              aria-label={PRICING_CONTROLS.cycle.label}
              className="h-12 items-center rounded-full p-1.5"
            >
              <ToggleGroupItem value="monthly" className="h-9 rounded-full px-4">
                {PRICING_CONTROLS.cycle.monthly}
              </ToggleGroupItem>
              <ToggleGroupItem value="annual" className="h-9 rounded-full px-4">
                <span className="inline-flex items-center gap-1.5">
                  שנתי
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-micro text-success">חיסכון של 20%</span>
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <label htmlFor={vatId} className="flex h-12 cursor-pointer items-center gap-3 rounded-full bg-surface-2 px-4">
            <Switch id={vatId} checked={excl} onCheckedChange={(v) => onExcl?.(v)} />
            <span className="text-sm font-semibold text-text-2">{PRICING_CONTROLS.vat.label}</span>
          </label>
        </div>
      </div>

      {excl && (
        <p role="status" className="mx-auto flex max-w-2xl items-start gap-2 rounded-md bg-violet/10 px-4 py-3 text-small text-text shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_35%,transparent)]">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-violet" />
          {PRICING_CONTROLS.vat.notice(vatPercent())}
        </p>
      )}

      <TabsContent value="plans" className="focus-visible:outline-none">
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <li key={p.id} className="flex">
              <PlanCard plan={p} cycle={cycle} excl={excl} />
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="packs" className="focus-visible:outline-none">
        <p className="text-body-lg mx-auto mb-8 max-w-2xl text-center text-text-2">{PACKS.intro}</p>
        <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {CREDIT_PACKS.map((pk, i) => {
            const price = excl ? netOf(pk.priceIls) : pk.priceIls;
            const featured = i === 1;
            return (
              <li key={pk.id} className="flex">
                <div
                  className={cn(
                    "relative flex w-full flex-col gap-5 rounded-[28px] bg-surface-1 p-7 shadow-[inset_0_0_0_1px_var(--color-frame)]",
                    featured && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3">{PACKS.name(new Intl.NumberFormat("he-IL").format(pk.credits))}</h3>
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary-text">
                      <Coins aria-hidden className="size-5" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[44px] font-extrabold leading-none tracking-tight">
                      <bdi className="num">{fmtIls(price)}</bdi>
                    </p>
                    <p className="mt-2 text-small text-text-2">{excl ? PACKS.excl : PACKS.incl}</p>
                  </div>
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-small font-semibold">
                    <Num value={pk.credits} /> קרדיטים · {PACKS.approx(Math.floor(pk.credits / TYPICAL_VIDEO_CREDITS))}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {PACKS.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-small">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                        <span>
                          <span className="sr-only">{PLAN_CARD.included}: </span>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={loginNext(`/app/billing?topup=${pk.id}`)}
                    className={cn(buttonVariants({ variant: featured ? "primary" : "secondary", size: "lg" }), "mt-auto w-full")}
                  >
                    {PACKS.cta}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </TabsContent>
    </Tabs>
  );
}

const FREE_FEATURES = ["כ-2 סרטונים קצרים לניסיון", "איכות טיוטה, עם סימן מים", "קמפיין ניסיון אחד עד ₪300", "בלי כרטיס אשראי"];

function PlanCard({ plan: p, cycle, excl }: { plan: Plan; cycle: Cycle; excl: boolean }) {
  const highlighted = !!p.badgeHe;
  const annual = cycle === "annual" && p.annualMonthlyIls !== null;
  const grossMonthly = annual ? p.annualMonthlyIls! : p.monthlyIls;
  const shown = excl ? netOf(grossMonthly) : grossMonthly;
  const strike = annual ? (excl ? netOf(p.monthlyIls) : p.monthlyIls) : null;
  const total = annual ? (excl ? netOf(p.annualTotalIls!) : p.annualTotalIls!) : null;
  const free = p.id === "free";
  const features = free ? FREE_FEATURES : (LANDING.pricing.features[p.id] ?? p.featuresHe).slice(0, 4);

  let sub: string;
  if (free) sub = "בלי כרטיס אשראי";
  else if (annual) sub = excl ? PLAN_CARD.annualExcl(fmtIls(total!)) : PLAN_CARD.annualIncl(fmtIls(total!));
  else sub = excl ? PLAN_CARD.perMonthExcl : PLAN_CARD.perMonthIncl;

  return (
    <article
      aria-labelledby={`plan-${p.id}`}
      className={cn("relative flex w-full flex-col rounded-[32px] p-px", highlighted ? "bg-accent-gradient shadow-[0_40px_80px_-36px_color-mix(in_oklab,var(--color-coral)_70%,transparent)] xl:-my-4" : "bg-border")}
    >
      <div className={cn("flex h-full flex-col rounded-[31px] bg-surface-1 p-7 xl:p-6", highlighted && "xl:py-11")}>
        <div className="flex items-center justify-between gap-2">
          <h3 id={`plan-${p.id}`} className="text-h2 font-extrabold">
            {p.nameHe}
          </h3>
          {highlighted && <span className="rounded-full bg-accent-gradient px-3 py-1 text-small font-bold text-ink">{p.badgeHe}</span>}
        </div>
        <p className="mt-1 text-body text-text-2">{p.taglineHe}</p>
        <div className="mt-6 min-h-[104px]">
          <p className="flex items-baseline gap-2">
            <span className="text-[3.5rem] font-black leading-none">
              <bdi className="num">{fmtIls(shown)}</bdi>
            </span>
            {strike !== null && (
              <>
                <s aria-hidden className="num text-body text-muted">{fmtIls(strike)}</s>
                <span className="sr-only">{PLAN_CARD.insteadOf(fmtIls(strike))}</span>
              </>
            )}
          </p>
          <p className="mt-2 text-small text-muted">{sub}</p>
        </div>
        <ul className="mt-4 flex flex-col gap-3.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-body">
              <span aria-hidden className={cn("mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full", highlighted ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text")}>
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span>
                <span className="sr-only">{PLAN_CARD.included}: </span>
                {f}
              </span>
            </li>
          ))}
        </ul>
        <Link href={planHref(p, cycle)} className={cn(highlighted ? accentCta : cn(inkCta, "dark:bg-text dark:text-bg"), "mt-10 h-14 w-full text-base")}>
          {PLAN_CARD.cta[p.id]}
        </Link>
      </div>
    </article>
  );
}
