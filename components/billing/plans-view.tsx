"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, Megaphone, Globe, Users, Activity, Sparkles, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag as Badge } from "@/components/settings/kit";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Price } from "@/components/a11y/num";
import { Panel, Section, TableShell, ButtonLink, Note } from "@/components/settings/kit";
import { RadioCards } from "@/components/settings/controls";
import { BillingDisclosure } from "./billing-disclosure";
import { billingCopy, accountCommon } from "@/content/he/account";
import { PLANS, PLAN_PROMISES_HE, type Plan, type PlanId } from "@/lib/data/plans";
import {
  MOCK_SUBSCRIPTION, MOCK_FLAGS, MOCK_MEMBERS, MOCK_BRAND_KITS, PLAN_EXTRA_LIMITS, MOCK_PLAN_CHANGE_QUOTES,
} from "@/lib/mock/account";
import { creditsText, fill, formatDateHe, formatIls, formatInt, plural } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

const p = billingCopy.plans;
const ch = billingCopy.change;
const ORDER: PlanId[] = ["free", "starter", "business", "agency"];
type Cycle = "monthly" | "annual";
type Mode = { kind: "upgrade" | "downgrade" | "annual"; plan: Plan } | null;

function landingText(plan: Plan) {
  if (plan.landingPages === "per_client") return p.landing.perClient;
  if (plan.landingPages === 0) return p.landing.none;
  return plural(plan.landingPages, { one: p.landing.one, other: p.landing.other });
}
function campaignsText(plan: Plan) {
  const n = plan.meta.activeCampaigns;
  return n === null ? p.meta.campaigns.unlimited : plural(n, p.meta.campaigns);
}

export function PlansView() {
  const params = useSearchParams();
  const router = useRouter();
  const highlight = params.get("plan") as PlanId | null;
  const [cycle, setCycle] = React.useState<Cycle>(params.get("cycle") === "annual" && MOCK_FLAGS.annual_billing ? "annual" : "monthly");
  const [mode, setMode] = React.useState<Mode>(null);
  const [scheduled, setScheduled] = React.useState<{ planId: PlanId; at: string } | null>(MOCK_SUBSCRIPTION.scheduledChange);
  const current = MOCK_SUBSCRIPTION.planId;
  const currentIdx = ORDER.indexOf(current);
  const currentPlan = PLANS.find((x) => x.id === current)!;

  return (
    <div className="flex flex-col gap-10">
      {scheduled && (
        <Note tone="warning" icon={<CalendarClock aria-hidden />}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{fill(billingCopy.plan.scheduled, { date: formatDateHe(scheduled.at), planName: PLANS.find((x) => x.id === scheduled.planId)!.nameHe })}</span>
            <Button size="sm" variant="secondary" onClick={() => { setScheduled(null); toast.success(accountCommon.saved); }}>{p.cancelScheduled}</Button>
          </div>
        </Note>
      )}

      {MOCK_FLAGS.annual_billing && (
        <div className="flex flex-wrap items-center gap-3">
          <span id="cycle-label" className="text-sm font-semibold text-text-2">{p.cycleLabel}</span>
          <ToggleGroup type="single" value={cycle} onValueChange={(v) => v && setCycle(v as Cycle)} aria-labelledby="cycle-label">
            <ToggleGroupItem value="monthly">{p.monthly}</ToggleGroupItem>
            <ToggleGroupItem value="annual">{p.annual}</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const idx = ORDER.indexOf(plan.id);
          const isCurrent = plan.id === current;
          const extra = PLAN_EXTRA_LIMITS[plan.id];
          const annual = cycle === "annual" && plan.annualMonthlyIls !== null;
          const monthlyShown = annual ? plan.annualMonthlyIls! : plan.monthlyIls;
          let action: React.ReactNode;
          if (isCurrent && cycle === "annual" && MOCK_SUBSCRIPTION.cycle === "monthly" && plan.annualTotalIls) {
            action = <Button className="w-full" onClick={() => setMode({ kind: "annual", plan })}>{p.toAnnual}</Button>;
          } else if (isCurrent) {
            action = <Button className="w-full" variant="secondary" disabled>{p.current}</Button>;
          } else if (plan.id === "free") {
            action = <ButtonLink href="/app/billing/cancel" variant="outline" className="w-full">{p.toFree}</ButtonLink>;
          } else if (idx > currentIdx) {
            action = <Button className="w-full" onClick={() => setMode({ kind: "upgrade", plan })}>{p.upgrade}</Button>;
          } else {
            action = <Button className="w-full" variant="outline" onClick={() => setMode({ kind: "downgrade", plan })}>{fill(p.downgradeTo, { planName: plan.nameHe })}</Button>;
          }
          return (
            <article
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className={cn(
                "relative flex flex-col gap-5 rounded-lg bg-surface-1 p-5 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)]",
                isCurrent && "shadow-[inset_0_0_0_2px_var(--color-primary-text)]",
                highlight === plan.id && !isCurrent && "glow-primary",
              )}
            >
              {isCurrent && <div aria-hidden className="pointer-events-none absolute inset-0 rounded-lg bg-projector" />}
              <div className="relative flex items-center justify-between gap-2">
                <h2 id={`plan-${plan.id}`} className="text-h3">{plan.nameHe}</h2>
                {isCurrent ? <Badge variant="primary">{p.current}</Badge> : plan.badgeHe ? <Badge variant="lemon">{plan.badgeHe}</Badge> : null}
              </div>
              <p className="relative -mt-3 text-small text-text-2">{plan.taglineHe}</p>
              <div className="relative flex flex-col gap-0.5">
                {plan.monthlyIls === 0 ? (
                  <span className="font-display text-[3.25rem] leading-none font-bold">{p.free}</span>
                ) : (
                  <span className="flex items-baseline gap-1.5">
                    <Price ils={monthlyShown} className="font-display text-[3.25rem] leading-none font-bold" />
                    <span className="text-small text-text-2">{p.perMonth}</span>
                  </span>
                )}
                <span className="text-micro font-normal text-muted">
                  {annual && plan.annualTotalIls ? `${fill(p.billedAnnually, { amount: formatIls(plan.annualTotalIls) })} · ` : ""}
                  {p.vatIncluded}
                </span>
              </div>
              <p className="relative flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-primary-text" aria-hidden />
                {plan.monthlyCredits ? fill(p.creditsPerMonth, { n: formatInt(plan.monthlyCredits) }) : fill(p.oneTime, { n: formatInt(plan.oneTimeCredits ?? 0) })}
              </p>

              <div className="relative flex flex-col gap-2 rounded-md bg-surface-2 p-3.5">
                <p className="flex items-center gap-1.5 text-micro text-text-2"><Megaphone className="size-3.5 text-primary-text" aria-hidden />{p.meta.heading}</p>
                <ul className="flex flex-col gap-1 text-small">
                  <li className="font-semibold">
                    {plan.meta.monthlySpendCapIls > 0
                      ? fill(p.meta.spendCap, { cap: formatIls(plan.meta.monthlySpendCapIls) })
                      : fill(p.meta.testOnly, { cap: formatIls(plan.meta.testSpendIls) })}
                  </li>
                  <li className="text-text-2">{campaignsText(plan)}</li>
                  <li className="text-text-2">{plural(plan.meta.adAccounts, p.meta.adAccounts)}</li>
                </ul>
              </div>

              <ul className="relative flex flex-col gap-1.5 text-small">
                <li className="flex items-center gap-2"><Globe className="size-4 shrink-0 text-text-2" aria-hidden />{landingText(plan)}</li>
                <li className="flex items-center gap-2"><Activity className="size-4 shrink-0 text-text-2" aria-hidden />{plural(plan.healthChecksPerMonth, p.healthChecks)}</li>
                <li className="flex items-center gap-2"><Users className="size-4 shrink-0 text-text-2" aria-hidden />{plural(extra.seats, p.seats)}</li>
              </ul>

              <ul className="relative flex flex-col gap-1.5 border-t border-border pt-4 text-small text-text-2">
                {plan.featuresHe.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />{f}</li>
                ))}
              </ul>
              <div className="relative mt-auto">{action}</div>
            </article>
          );
        })}
      </div>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-small text-text-2">
        {[p.meta.zeroFee, ...PLAN_PROMISES_HE.slice(1)].map((x) => (
          <li key={x} className="flex items-center gap-1.5"><Check className="size-4 text-success" aria-hidden />{x}</li>
        ))}
      </ul>

      <Section id="compare" title={p.compareTitle}>
        <Panel className="pb-2 md:pb-2">
          <CompareTable current={current} />
        </Panel>
      </Section>

      <PlanChangeDialog
        mode={mode}
        currentPlan={currentPlan}
        onClose={() => setMode(null)}
        onScheduled={(planId) => { setScheduled({ planId, at: MOCK_SUBSCRIPTION.periodEnd }); setMode(null); toast.success(fill(ch.toastScheduled, { date: formatDateHe(MOCK_SUBSCRIPTION.periodEnd) })); }}
        onPaid={(planId) => router.push(`/app/billing/return?kind=plan_change&plan=${planId}&status=completed`)}
      />
    </div>
  );
}

function CompareTable({ current }: { current: PlanId }) {
  const rows: { label: string; cell: (pl: Plan) => React.ReactNode }[] = [
    { label: p.rows.price, cell: (pl) => (pl.monthlyIls ? <Price ils={pl.monthlyIls} /> : p.free) },
    { label: p.rows.credits, cell: (pl) => (pl.monthlyCredits ? formatInt(pl.monthlyCredits) : fill(p.oneTimeShort, { n: formatInt(pl.oneTimeCredits ?? 0) })) },
    { label: p.rows.videos, cell: (pl) => `≈ ${formatInt(pl.approxVideos)}` },
    { label: p.rows.seats, cell: (pl) => formatInt(PLAN_EXTRA_LIMITS[pl.id].seats) },
    { label: p.rows.adAccounts, cell: (pl) => formatInt(pl.meta.adAccounts) },
    { label: p.rows.activeCampaigns, cell: (pl) => (pl.meta.activeCampaigns === null ? p.unlimited : formatInt(pl.meta.activeCampaigns)) },
    { label: p.rows.spendCap, cell: (pl) => (pl.meta.monthlySpendCapIls ? <Price ils={pl.meta.monthlySpendCapIls} /> : p.none) },
    { label: p.rows.testSpend, cell: (pl) => (pl.meta.testSpendIls ? <>{p.upTo} <Price ils={pl.meta.testSpendIls} /></> : p.none) },
    { label: p.rows.landingPages, cell: (pl) => (pl.landingPages === "per_client" ? p.perClientShort : pl.landingPages === 0 ? p.none : formatInt(pl.landingPages)) },
    { label: p.rows.healthChecks, cell: (pl) => formatInt(pl.healthChecksPerMonth) },
  ];
  return (
    <TableShell>
      <caption className="sr-only">{p.compareCaption}</caption>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">{p.compareTitle}</span></th>
          {PLANS.map((pl) => (
            <th key={pl.id} scope="col" className={cn("text-center", pl.id === current && "text-primary-text!")}>{pl.nameHe}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row" className="text-text-2">{r.label}</th>
            {PLANS.map((pl) => (
              <td key={pl.id} className={cn("text-center font-semibold", pl.id === current && "bg-surface-2/50")}>{r.cell(pl)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function PlanChangeDialog({
  mode, currentPlan, onClose, onScheduled, onPaid,
}: {
  mode: Mode;
  currentPlan: Plan;
  onClose: () => void;
  onScheduled: (planId: PlanId) => void;
  onPaid: (planId: PlanId) => void;
}) {
  const [accepted, setAccepted] = React.useState(false);
  const [tried, setTried] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [when, setWhen] = React.useState<"period_end" | "now">("period_end");
  const periodEnd = formatDateHe(MOCK_SUBSCRIPTION.periodEnd);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset each time the dialog opens
    setAccepted(false); setTried(false); setBusy(false); setWhen("period_end");
  }, [mode]);

  if (!mode) return <Dialog open={false} />;
  const plan = mode.plan;
  const extra = PLAN_EXTRA_LIMITS[plan.id];
  const needsPayment = mode.kind === "upgrade" || (mode.kind === "annual" && when === "now");
  const quote = MOCK_PLAN_CHANGE_QUOTES[plan.id] ?? { chargeNowIls: Math.max(0, Math.round((plan.monthlyIls - currentPlan.monthlyIls) * 0.7 * 100) / 100), creditsGrantedNow: Math.round((plan.monthlyCredits - currentPlan.monthlyCredits) * 0.7) };

  const pay = () => {
    if (needsPayment && !accepted) { setTried(true); return; }
    setBusy(true);
    setTimeout(() => {
      if (mode.kind === "downgrade" || (mode.kind === "annual" && when === "period_end")) onScheduled(plan.id);
      else onPaid(plan.id);
    }, 900);
  };

  const countedMembers = MOCK_MEMBERS.filter((m) => m.role !== "viewer").length;
  const impacts: string[] = [];
  if (mode.kind === "downgrade") {
    if (countedMembers > extra.seats) impacts.push(fill(ch.impactSeats, { members: countedMembers, seats: extra.seats, periodEnd }));
    if (extra.brandKits !== null && MOCK_BRAND_KITS.length > extra.brandKits) impacts.push(fill(ch.impactKits, { kits: MOCK_BRAND_KITS.length, max: extra.brandKits }));
    if (plan.meta.monthlySpendCapIls < currentPlan.meta.monthlySpendCapIls) impacts.push(fill(ch.impactSpend, { cap: formatIls(plan.meta.monthlySpendCapIls) }));
  }

  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent size="lg" className="max-h-[92dvh] overflow-y-auto">
        <DialogTitle>{fill(ch.title, { planName: plan.nameHe })}</DialogTitle>
        <DialogDescription>
          {mode.kind === "annual"
            ? fill(ch.priceAnnual, { price: formatIls(plan.annualTotalIls ?? 0) })
            : fill(ch.price, { price: formatIls(plan.monthlyIls) })}
        </DialogDescription>

        <div className="mt-5 flex flex-col gap-4">
          {mode.kind === "upgrade" && (
            <Panel className="flex flex-col gap-2 bg-surface-2 p-4 md:p-4">
              <p className="font-bold">{ch.upgradeNow}</p>
              <p className="text-small text-text-2">
                {fill(ch.upgradeCharge, { chargeNow: formatIls(quote.chargeNowIls), periodEnd, proratedCredits: creditsText(quote.creditsGrantedNow) })}
              </p>
              <p className="text-small text-text-2">{fill(ch.upgradeFrom, { periodEnd, newPrice: formatIls(plan.monthlyIls) })}</p>
              <p className="text-small text-text-2">{ch.cancelAnytime}</p>
            </Panel>
          )}

          {mode.kind === "downgrade" && (
            <div className="flex flex-col gap-3">
              <p>{fill(ch.downgradeWhen, { periodEnd, currentPlan: currentPlan.nameHe })}</p>
              <p className="text-small text-text-2">{ch.downgradeCredits}</p>
              {impacts.length > 0 && (
                <div className="flex flex-col gap-2 rounded-md bg-surface-2 p-4">
                  <p className="text-sm font-bold">{ch.impactsTitle}</p>
                  <ul className="flex list-disc flex-col gap-1.5 ps-5 text-small text-text-2">
                    {impacts.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {mode.kind === "annual" && (
            <div className="flex flex-col gap-2">
              <p id="when-label" className="font-bold">{ch.whenTitle}</p>
              <RadioCards<"period_end" | "now">
                labelId="when-label"
                value={when}
                onValueChange={setWhen}
                columns={1}
                options={[
                  { value: "period_end", label: ch.whenPeriodEnd, description: fill(ch.whenPeriodEndBody, { periodEnd, annualTotal: formatIls(plan.annualTotalIls ?? 0), credits: creditsText(plan.monthlyCredits) }) },
                  { value: "now", label: ch.whenNow, description: fill(ch.whenNowBody, { annualTotal: formatIls(plan.annualTotalIls ?? 0), credits: creditsText(plan.monthlyCredits) }) },
                ]}
              />
            </div>
          )}

          {needsPayment && (
            <BillingDisclosure
              id="planchange"
              kind="subscription"
              priceIls={mode.kind === "annual" ? plan.annualTotalIls ?? 0 : plan.monthlyIls}
              cycle={mode.kind === "annual" ? "annual" : "monthly"}
              accepted={accepted}
              onAcceptedChange={setAccepted}
              showRequired={tried}
            />
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onClose} disabled={busy}>{accountCommon.cancel}</Button>
            <Button
              size="lg"
              loading={busy}
              aria-disabled={(needsPayment && !accepted) || undefined}
              aria-describedby={needsPayment && !accepted ? "planchange-terms-required" : undefined}
              onClick={pay}
            >
              {busy
                ? ch.processing
                : mode.kind === "upgrade"
                  ? fill(ch.upgradeButton, { chargeNow: formatIls(quote.chargeNowIls) })
                  : mode.kind === "downgrade"
                    ? ch.confirmDowngrade
                    : when === "now"
                      ? fill(ch.toAnnualNow, { annualTotal: formatIls(plan.annualTotalIls ?? 0) })
                      : ch.toAnnual}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
