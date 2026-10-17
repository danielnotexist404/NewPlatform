"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Lock, Megaphone, Globe, Users, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { Panel, Section, StatusPill, ButtonLink, Note } from "@/components/settings/kit";
import { TopUpDialog } from "./top-up-dialog";
import { CreditCostPopover } from "./credit-cost-popover";
import { UsageChart } from "./usage-chart";
import { LedgerTable } from "./ledger-table";
import { InvoiceList } from "./invoice-list";
import { BillingProfileForm } from "./billing-profile-form";
import { billingCopy } from "@/content/he/account";
import { PLANS } from "@/lib/data/plans";
import {
  MOCK_CREDIT_SUMMARY, MOCK_PAYMENT_METHOD, MOCK_SUBSCRIPTION, PLAN_EXTRA_LIMITS,
} from "@/lib/mock/account";
import { fill, formatDateHe, formatIls, formatInt, plural } from "@/components/settings/format";

const b = billingCopy;

export function BillingOverview() {
  const params = useSearchParams();
  const router = useRouter();
  const topup = params.get("topup");
  const [topUpOpen, setTopUpOpen] = React.useState(!!topup);

  React.useEffect(() => {
    if (params.get("checkout") === "canceled") {
      toast(b.checkoutCanceled);
      router.replace("/app/billing", { scroll: false });
    }
  }, [params, router]);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1.15fr_0.9fr]">
        <BalanceCard onTopUp={() => setTopUpOpen(true)} />
        <PlanCard />
        <PaymentCard />
      </div>

      <Section id="usage" title={b.usage.title}>
        <Panel><UsageChart /></Panel>
      </Section>

      <Section id="ledger" title={b.ledger.title}>
        <Panel><LedgerTable /></Panel>
      </Section>

      <Section id="invoices" title={b.invoices.title}>
        <Panel className="pb-2 md:pb-2"><InvoiceList /></Panel>
      </Section>

      <Section id="billing-profile" title={b.profile.title}>
        <Panel><BillingProfileForm /></Panel>
      </Section>

      <TopUpDialog open={topUpOpen} onOpenChange={setTopUpOpen} initialPack={topup} />
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="size-20 -rotate-90" aria-hidden style={{ direction: "ltr" }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth="7" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-primary-text)" strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(1, value))} />
    </svg>
  );
}

function BalanceCard({ onTopUp }: { onTopUp: () => void }) {
  const s = MOCK_CREDIT_SUMMARY;
  return (
    <Panel tone="gold" className="relative flex flex-col gap-5 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector opacity-80" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-text-2"><Zap className="size-4 text-primary-text" aria-hidden />{b.balance.title}</h2>
          <p className="flex items-baseline gap-2" aria-label={fill(b.balance.meterSr, { balance: formatInt(s.balance), allowance: formatInt(s.planAllowance) })}>
            <bdi className="num font-display text-[4.5rem] leading-none font-bold text-gold-gradient" aria-hidden>{formatInt(s.balance)}</bdi>
            <span className="text-body text-text-2" aria-hidden>{b.balance.unit}</span>
          </p>
        </div>
        <Ring value={s.balance / s.planAllowance} />
      </div>
      <ul className="relative flex flex-col gap-1 text-small text-text-2">
        <li>{fill(b.balance.reserved, { reserved: formatInt(s.reserved) })}</li>
        <li>{fill(b.balance.expiring, { expiring: formatInt(s.expiring30d) })}</li>
        <li>{fill(b.balance.resetsOn, { date: formatDateHe(s.nextResetAt) })}</li>
      </ul>
      <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button onClick={onTopUp}><Plus aria-hidden />{b.balance.topUp}</Button>
        <CreditCostPopover />
      </div>
    </Panel>
  );
}

function PlanCard() {
  const sub = MOCK_SUBSCRIPTION;
  const plan = PLANS.find((p) => p.id === sub.planId)!;
  const extra = PLAN_EXTRA_LIMITS[plan.id];
  const landing = plan.landingPages === "per_client" ? b.plans.landing.perClient : plan.landingPages === 0 ? b.plans.landing.none : plural(plan.landingPages, { one: b.plans.landing.one, other: b.plans.landing.other });
  return (
    <Panel className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-h3">{fill(b.plan.title, { planName: plan.nameHe })}</h2>
        {sub.cancelAtPeriodEnd ? (
          <StatusPill tone="warning">{fill(b.status.endsOn, { date: formatDateHe(sub.periodEnd) })}</StatusPill>
        ) : (
          <StatusPill tone={sub.status === "active" ? "success" : sub.status === "past_due" ? "danger" : "neutral"}>{b.status[sub.status]}</StatusPill>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body-lg">
          <Price ils={sub.priceIls} className="font-bold" /> {sub.cycle === "annual" ? b.plan.perYear.replace("{price} ", "") : b.plan.perMonth.replace("{price} ", "")}
        </p>
        <p className="text-small text-text-2">{fill(b.plan.monthlyCredits, { monthlyCredits: formatInt(plan.monthlyCredits) })}</p>
        <p className="text-small text-text-2">
          {sub.cancelAtPeriodEnd ? fill(b.plan.endsOn, { date: formatDateHe(sub.periodEnd) }) : fill(b.plan.nextCharge, { date: formatDateHe(sub.periodEnd) })}
        </p>
      </div>
      <ul className="flex flex-col gap-1.5 border-t border-border pt-4 text-small">
        <li className="flex items-center gap-2"><Megaphone className="size-4 text-primary-text" aria-hidden />{fill(b.plans.meta.spendCap, { cap: formatIls(plan.meta.monthlySpendCapIls) })}</li>
        <li className="flex items-center gap-2"><Globe className="size-4 text-primary-text" aria-hidden />{landing}</li>
        <li className="flex items-center gap-2"><Users className="size-4 text-primary-text" aria-hidden />{plural(extra.seats, b.plans.seats)}</li>
      </ul>
      {/* Equal weight: "שינוי תוכנית" and "ביטול מנוי" share variant and size (Part 03 §15 principles). */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        <ButtonLink href="/app/billing/plans" variant="secondary">{b.plan.change}</ButtonLink>
        <ButtonLink href="/app/billing/cancel" variant="secondary">{b.plan.cancel}</ButtonLink>
      </div>
      <p className="-mt-2 text-center text-micro font-normal text-muted">{b.plan.cancelPromise}</p>
    </Panel>
  );
}

function PaymentCard() {
  const m = MOCK_PAYMENT_METHOD;
  const [busy, setBusy] = React.useState(false);
  return (
    <Panel className="flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-text-2">{b.payment.title}</h2>
      <div dir="ltr" className="relative aspect-[1.586] w-full max-w-72 self-start overflow-hidden rounded-md bg-surface-3 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]" aria-hidden>
        <div className="absolute inset-0 bg-afterglow" />
        <div className="relative flex h-full flex-col justify-between">
          <CreditCard className="size-6 text-text-2" />
          <div className="flex items-end justify-between">
            <span className="num font-mono text-sm tracking-widest text-text">•••• {m.last4}</span>
            <span className="num font-mono text-micro text-text-2">{m.mm}/{m.yy}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold">
          {b.payment.card.split("{last4}")[0].replace("{brand}", m.brandHe)}
          <bdi className="num">{m.last4}</bdi>
        </p>
        <p className="text-small text-text-2">
          {b.payment.validUntil.split("{mm}")[0]}<bdi className="num">{m.mm}/{m.yy}</bdi>
        </p>
      </div>
      <Button
        variant="secondary"
        className="mt-auto w-fit"
        loading={busy}
        onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); toast(b.topUp.redirecting); }, 700); }}
      >
        {b.payment.update}
      </Button>
      <Note tone="lock" icon={<Lock aria-hidden />} className="py-2 text-micro font-normal">{b.payment.secure}</Note>
    </Panel>
  );
}
