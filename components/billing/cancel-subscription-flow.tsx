"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RadioGroup as RG } from "radix-ui";
import { CalendarCheck, CircleCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Price } from "@/components/a11y/num";
import { Checkbox, CharCount } from "@/components/settings/controls";
import { Panel, Note, ButtonLink, EmptyArt } from "@/components/settings/kit";
import { billingCopy, accountCommon } from "@/content/he/account";
import { BRAND } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";
import { PLANS } from "@/lib/data/plans";
import { CANCEL_FEE_CAP_ILS, MOCK_CANCEL_QUOTE, MOCK_PROFILE, MOCK_SUBSCRIPTION, MOCK_MEMBERS } from "@/lib/mock/account";
import { creditsText, fill, formatDateHe, formatIls, plural } from "@/components/settings/format";
import { cn } from "@/lib/utils";

const c = billingCopy.cancel;
type Reason = keyof typeof c.reasons;
type Scenario = "default" | "annual" | "extended" | "canceled" | "free" | "viewer" | "active-job" | "zero" | "error";

/**
 * CancelSubscriptionFlow (Part 03 §15.5, Israeli Consumer Protection Law — Part 06 §10.1–10.2):
 * ONE screen, optional reason (no preselection), two equal-size buttons, no persuasion screens,
 * no extra "are you sure?" dialog. `?scenario=` previews the other states with sample data.
 */
export function CancelSubscriptionFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const scenario = (params.get("scenario") ?? "default") as Scenario;
  const plan = PLANS.find((p) => p.id === MOCK_SUBSCRIPTION.planId)!;
  const lower = PLANS.filter((p) => p.monthlyIls > 0 && p.monthlyIls < plan.monthlyIls).at(-1);
  const q = scenario === "zero" ? { ...MOCK_CANCEL_QUOTE, consumedValueIls: 289, feeIls: 14.45, refundIls: 0, usedCredits: 1000 } : MOCK_CANCEL_QUOTE;
  const periodEnd = formatDateHe(MOCK_SUBSCRIPTION.periodEnd);
  const owner = MOCK_MEMBERS.find((m) => m.role === "owner")!;

  const [reason, setReason] = React.useState<Reason | "">("");
  const [details, setDetails] = React.useState("");
  const [refund, setRefund] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  const [state, setState] = React.useState<"form" | "submitting" | "done" | "error">("form");
  const [attempt, setAttempt] = React.useState(0);
  const submitted = React.useRef<{ refund: boolean; extended: boolean }>({ refund: false, extended: false });
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => { if (state === "done") headingRef.current?.focus(); }, [state]);

  if (scenario === "viewer") {
    const phone = isFilled(BRAND.phone) ? BRAND.phone : null;
    return (
      <Panel className="max-w-2xl">
        <Note>{fill(phone ? c.notOwner : c.notOwnerNoPhone, { ownerName: owner.name, billingEmail: BRAND.emails.billing, supportPhone: phone ?? "" })}</Note>
        <ButtonLink href="/app/billing" className="mt-5">{c.back}</ButtonLink>
      </Panel>
    );
  }
  if (scenario === "free") {
    return (
      <Panel className="flex max-w-2xl flex-col gap-4">
        <p className="text-body-lg font-semibold">{c.noSubscription}</p>
        <Note>{c.packRefundOffer}</Note>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => toast.success(fill(c.done.refund, { refund: formatIls(59) }))}>{c.packRefundButton}</Button>
          <ButtonLink href="/app/billing" variant="ghost">{c.back}</ButtonLink>
        </div>
      </Panel>
    );
  }
  if (scenario === "canceled") {
    return (
      <Panel className="flex max-w-2xl flex-col gap-4">
        <p className="text-body-lg font-semibold">{fill(c.alreadyCanceled, { periodEnd })}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { toast.success(fill(c.done.resumed, { date: periodEnd })); router.push("/app/billing"); }}>{c.done.resume}</Button>
          <ButtonLink href="/app/billing" variant="secondary">{c.back}</ButtonLink>
        </div>
      </Panel>
    );
  }

  if (state === "done") {
    const withRefund = submitted.current.refund && q.refundIls > 0;
    const closed = withRefund && q.reasonCode === "distance_14d";
    return (
      <Panel tone="gold" className="relative flex max-w-2xl flex-col items-center gap-5 overflow-hidden py-12 text-center md:py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
        <EmptyArt illustration="approval-done" size="section" />
        <h2 ref={headingRef} tabIndex={-1} className="relative text-h2 outline-none">{c.done.title}</h2>
        <p className="relative max-w-md text-body-lg text-text-2">
          {closed ? fill(c.done.bodyClosed, { email: MOCK_PROFILE.email }) : fill(c.done.body, { periodEnd, email: MOCK_PROFILE.email })}
        </p>
        <p className="relative flex items-center gap-2 text-small text-text-2">
          <CalendarCheck className="size-4 text-success" aria-hidden />
          {fill(c.done.canceledAt, { date: formatDateHe("2026-10-17") })}
        </p>
        {withRefund && <Note tone="success" className="relative max-w-md text-start">{fill(c.done.refund, { refund: formatIls(scenario === "annual" ? q.annualRefundIls : q.refundIls) })}</Note>}
        {submitted.current.extended && <Note tone="success" className="relative max-w-md text-start">{c.done.extended}</Note>}
        <div className="relative flex flex-wrap justify-center gap-2">
          <ButtonLink href="/app" variant="primary">{c.done.backToAccount}</ButtonLink>
          {!withRefund && (
            <Button variant="secondary" onClick={() => { toast.success(fill(c.done.resumed, { date: periodEnd })); router.push("/app/billing"); }}>
              {c.done.resume}
            </Button>
          )}
        </div>
      </Panel>
    );
  }

  const activeJob = scenario === "active-job";
  const showRefund = q.refundEligible && q.reasonCode === "distance_14d" && scenario !== "annual" && scenario !== "extended";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "submitting") return;
    submitted.current = { refund: scenario === "annual" ? true : refund, extended };
    setState("submitting");
    setTimeout(() => {
      if (scenario === "error" && attempt === 0) { setAttempt(1); setState("error"); return; }
      setState("done");
    }, 1000);
  };

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6" aria-describedby="cancel-intro">
      <p id="cancel-intro" className="text-text-2">{c.intro}</p>

      <Panel className="flex flex-col gap-4">
        <h2 className="text-h3">{c.whatHappens}</h2>
        <ul className="flex flex-col gap-2.5">
          {[
            c.noMoreCharges,
            fill(c.keepsWorking, { planName: plan.nameHe, periodEnd }),
            fill(c.credits, { expiresAt: formatDateHe(q.creditsExpireAt) }),
            c.yours,
          ].map((x) => (
            <li key={x} className="flex items-start gap-2.5">
              <CircleCheck className="mt-1 size-4 shrink-0 text-success" aria-hidden />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-body-lg font-bold">{c.reasonLegend}</legend>
          <RG.Root value={reason} onValueChange={(v) => setReason(v as Reason)} className="grid gap-2 sm:grid-cols-2" aria-label={c.reasonLegend}>
            {(Object.keys(c.reasons) as Reason[]).map((r) => (
              <RG.Item
                key={r}
                value={r}
                className="group flex items-center gap-2.5 rounded-sm bg-surface-2 px-3.5 py-3 text-start text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-border)] hover:bg-surface-3 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--color-text-2)]"
              >
                <span aria-hidden className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong">
                  <span className="size-2 scale-0 rounded-full bg-text transition-transform group-data-[state=checked]:scale-100" />
                </span>
                {c.reasons[r]}
              </RG.Item>
            ))}
          </RG.Root>
          {reason && (
            <button type="button" onClick={() => setReason("")} className="w-fit text-sm font-semibold text-link underline-offset-4 hover:underline">{c.clearReason}</button>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cancel-details" className="flex items-center justify-between text-sm font-semibold">
              {c.details}
              <CharCount value={details} max={500} id="cancel-details-count" />
            </label>
            <Textarea id="cancel-details" maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} aria-describedby="cancel-details-count" />
          </div>
        </fieldset>
      </Panel>

      {showRefund && (
        <Panel className="flex flex-col gap-4">
          <Checkbox id="cancel-refund" checked={refund} onCheckedChange={setRefund} disabled={activeJob || q.refundIls === 0} describedBy="refund-explain">
            {fill(c.refundCheckbox, { paidAt: formatDateHe(q.paidAt) })}
          </Checkbox>
          {activeJob && <p className="text-small text-text-2">{c.refundActiveJob}</p>}
          <table className="w-full text-small">
            <caption className="sr-only">{c.refundTable.caption}</caption>
            <tbody className="[&_td]:py-2 [&_th]:py-2 [&_tr]:border-b [&_tr]:border-border">
              <tr><th scope="row" className="text-start font-normal text-text-2">{c.refundTable.paid}</th><td className="text-end"><Price ils={q.paidIls} decimals /></td></tr>
              <tr><th scope="row" className="text-start font-normal text-text-2">{fill(c.refundTable.consumed, { usedCredits: creditsText(q.usedCredits) })}</th><td className="text-end"><bdi dir="ltr" className="num">{formatIls(-q.consumedValueIls, "always")}</bdi></td></tr>
              <tr><th scope="row" className="text-start font-normal text-text-2">{fill(c.refundTable.fee, { feeCap: formatIls(CANCEL_FEE_CAP_ILS) })}</th><td className="text-end"><bdi dir="ltr" className="num">{formatIls(-q.feeIls, "always")}</bdi></td></tr>
              <tr className="border-b-0!"><th scope="row" className="text-start text-body font-bold">{c.refundTable.refund}</th><td className="text-end text-body-lg font-bold text-primary-text"><Price ils={q.refundIls} decimals /></td></tr>
            </tbody>
          </table>
          <p id="refund-explain" className="text-small text-text-2">{q.refundIls === 0 ? c.refundZero : c.refundExplain}</p>
        </Panel>
      )}

      {scenario === "annual" && (
        <Note tone="info" icon={<ShieldCheck aria-hidden />}>
          {fill(plural(q.annualMonthsLeft, c.annualProrata), { refund: formatIls(q.annualRefundIls) })}
        </Note>
      )}

      {scenario === "extended" && (
        <Panel className="flex flex-col gap-2">
          <Checkbox id="cancel-extended" checked={extended} onCheckedChange={setExtended} describedBy="extended-help">{c.extendedCheckbox}</Checkbox>
          <p id="extended-help" className="ps-8 text-small text-text-2">{c.extendedHelp}</p>
        </Panel>
      )}

      {state === "error" && (
        <Note tone="danger" className="items-center">
          <span role="alert">{fill(c.error, { billingEmail: BRAND.emails.billing })}</span>
        </Note>
      )}

      {/* Equal size, neither pre-focused nor pre-selected. Start: back · End: cancel (destructive). */}
      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href="/app/billing" variant="secondary" size="lg" className="w-full">{c.back}</ButtonLink>
        <Button type="submit" variant="destructive" size="lg" className="w-full" loading={state === "submitting"}>
          {state === "submitting" ? c.submitting : state === "error" ? accountCommon.retry : c.submit}
        </Button>
      </div>

      {lower && (
        <p className={cn("text-small text-text-2")}>
          {fill(c.lowerPlan, { lowerPlan: lower.nameHe })}{" "}
          <Link href={`/app/billing/plans?plan=${lower.id}`} className="font-semibold text-link underline underline-offset-4">{c.lowerPlanLink}</Link>
        </p>
      )}
    </form>
  );
}
