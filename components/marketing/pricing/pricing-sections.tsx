import Link from "next/link";
import {
  Activity, Banknote, CreditCard, FileText, Megaphone, MousePointerClick, Percent, ReceiptText, Repeat, RotateCcw, ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { PLAN_PROMISES_HE, PLANS, VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import {
  CREDIT_COSTS,
  HEALTH_BAND,
  LANDING_NOTE,
  PAYMENT_METHODS_LINE,
  PAYMENT_PROMISE,
  PROMISE_ICONS,
  TRUST_BOX,
  type PromiseIcon,
} from "@/content/he/pricing";
import { vatPercent } from "./money";
import { cn } from "@/lib/utils";

const PROMISE_ICON: Record<PromiseIcon, LucideIcon> = {
  percent: Percent,
  repeat: Repeat,
  refund: RotateCcw,
  cancel: MousePointerClick,
  receipt: ReceiptText,
  banknote: Banknote,
  card: CreditCard,
};

/** Part 02 §7.3 + the 0% line (§L.5). */
export function PromisesRow() {
  const items = [...PLAN_PROMISES_HE.map((t, i) => ({ t, icon: PROMISE_ICONS[i] })), { t: PAYMENT_PROMISE, icon: "card" as const }];
  return (
    <div className="flex flex-col gap-5">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ t, icon }, i) => {
          const Icon = PROMISE_ICON[icon];
          const first = i === 0;
          return (
            <li
              key={t}
              className={cn(
                "flex items-start gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]",
                first && "bg-primary/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] sm:col-span-2",
              )}
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", first ? "bg-primary text-on-primary" : "bg-surface-3 text-primary-text")}>
                <Icon aria-hidden className="size-4.5" />
              </span>
              <span className={cn("text-small", first && "text-body font-semibold")}>{t}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-small text-muted">{PAYMENT_METHODS_LINE}</p>
    </div>
  );
}

/** "בדיקת דופק" CTA (spec §S.2) + "דף העסק" note (§S.7). */
export function HealthAndLandingBand() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="relative isolate overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
        <div aria-hidden className="absolute -z-10 inset-e-0 top-0 size-72 rounded-full bg-success/10 blur-3xl" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-micro text-success">
          <Activity aria-hidden className="size-3.5" />
          {HEALTH_BAND.eyebrow}
        </span>
        <h2 className="text-h3 mt-4 max-w-xl">{HEALTH_BAND.title}</h2>
        <p className="mt-3 max-w-2xl text-text-2">{HEALTH_BAND.body}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href={`/login?next=${encodeURIComponent("/app/campaigns/health")}`} className={buttonVariants({ variant: "secondary", size: "lg" })}>
            {HEALTH_BAND.cta}
          </Link>
          <span className="text-small text-muted">{HEALTH_BAND.note}</span>
        </div>
      </div>
      <div className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/15 px-3 py-1 text-micro text-violet">
          <FileText aria-hidden className="size-3.5" />
          דף העסק
        </span>
        <h2 className="text-h3 mt-4">{LANDING_NOTE.title}</h2>
        <p className="mt-3 text-text-2">{LANDING_NOTE.body}</p>
        <Link href="/campaigns#business-page" className="mt-4 inline-flex items-center gap-1 font-semibold text-primary-text underline-offset-4 hover:underline">
          איך זה נראה
          <DirIcon name="forward" className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** `CreditCostTable` (Part 02 §7.5, anchor #credit-costs) — table on md+, cards on mobile. */
export function CreditCostTable() {
  const business = PLANS.find((p) => p.id === "business")!;
  const perCredit = business.monthlyIls / business.monthlyCredits;
  const rows = VIDEO_COST_EXAMPLES.map((ex, i) => ({ ...ex, includes: CREDIT_COSTS.includes[i] ?? "", ils: Math.max(1, Math.round(ex.credits * perCredit)) }));
  return (
    <div className="flex flex-col gap-8">
      {/* desktop table */}
      <div className="hidden overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] md:block">
        <table className="w-full text-start text-small">
          <caption className="sr-only">{CREDIT_COSTS.h2}</caption>
          <thead className="bg-surface-2 text-text-2">
            <tr>
              <th scope="col" className="px-5 py-3 text-start font-semibold">{CREDIT_COSTS.cols.video}</th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">{CREDIT_COSTS.cols.includes}</th>
              <th scope="col" className="px-5 py-3 text-center font-semibold">{CREDIT_COSTS.cols.credits}</th>
              <th scope="col" className="px-5 py-3 text-center font-semibold" aria-describedby="ils-footnote">
                {CREDIT_COSTS.cols.ils}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.labelHe} className="border-t border-border">
                <th scope="row" className="px-5 py-4 text-start text-body font-semibold">{r.labelHe}</th>
                <td className="px-5 py-4 text-text-2">{r.includes}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-14 justify-center rounded-full bg-primary/15 px-3 py-1 text-body font-bold text-primary-text">
                    <Num value={r.credits} />
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-body">כ-{`₪${r.ils}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((r) => (
          <li key={r.labelHe} className="rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{r.labelHe}</h3>
              <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 font-bold text-primary-text">
                <Num value={r.credits} /> <span className="text-micro font-semibold">קרדיטים</span>
              </span>
            </div>
            <p className="mt-2 text-small text-text-2">{r.includes}</p>
            <p className="mt-2 text-small">
              {CREDIT_COSTS.cols.ils}: <span className="font-semibold">כ-₪{r.ils}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 text-small text-text-2">
        <p>{CREDIT_COSTS.extraFormat}</p>
        <p id="ils-footnote" className="text-micro font-normal text-muted">
          {CREDIT_COSTS.ilsFootnote}
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-violet/10 p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_35%,transparent)] md:p-6">
        <Megaphone aria-hidden className="mt-0.5 size-6 shrink-0 text-violet" />
        <div>
          <h3 className="text-body-lg font-bold">{CREDIT_COSTS.campaignsFree.title}</h3>
          <p className="mt-1 text-text-2">{CREDIT_COSTS.campaignsFree.body}</p>
        </div>
      </div>

      <details className="group rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-5 py-4 font-semibold hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
          {CREDIT_COSTS.detailsSummary}
          <DirIcon name="next" className="size-4 transition-transform group-open:-rotate-90" />
        </summary>
        <div className="px-5 pb-5">
          <table className="w-full text-small">
            <caption className="sr-only">{CREDIT_COSTS.detailsSummary}</caption>
            <thead>
              <tr className="text-text-2">
                <th scope="col" className="py-2 text-start font-semibold">{CREDIT_COSTS.detailsCols.action}</th>
                <th scope="col" className="py-2 text-end font-semibold">{CREDIT_COSTS.detailsCols.credits}</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_COSTS.priceList.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <th scope="row" className="py-2.5 pe-4 text-start font-normal">{r.label}</th>
                  <td className="py-2.5 text-end font-semibold">
                    {r.credits === null ? <span className="text-success">{CREDIT_COSTS.free}</span> : <bdi className="num">{r.credits}</bdi>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-micro font-normal text-muted">{CREDIT_COSTS.rateNote}</p>
        </div>
      </details>

      <ul className="grid gap-4 md:grid-cols-3">
        {CREDIT_COSTS.howItWorks.map((h) => (
          <li key={h.title} className="rounded-md p-1">
            <h3 className="text-body-lg font-bold">{h.title}</h3>
            <p className="mt-1 text-small text-text-2">{h.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Part 02 §7.7 + the 0% item. */
export function TrustBox() {
  return (
    <div className="rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-10">
      <div className="flex items-center gap-3">
        <ShieldCheck aria-hidden className="size-7 text-success" />
        <h2 className="text-h2">{TRUST_BOX.title}</h2>
      </div>
      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        {TRUST_BOX.items.map((it) => (
          <div key={it.title} className="border-s-2 border-primary ps-4">
            <dt className="text-body-lg font-bold">{it.title}</dt>
            <dd className="mt-1 text-text-2">{typeof it.body === "function" ? it.body(vatPercent()) : it.body}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {TRUST_BOX.links.map((l) => (
          <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 font-semibold text-link underline underline-offset-4">
            {l.label}
            <DirIcon name="forward" className="size-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}
