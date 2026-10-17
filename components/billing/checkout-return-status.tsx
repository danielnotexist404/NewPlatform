"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CircleCheck, CircleAlert, Clock } from "lucide-react";
import { Panel, ButtonLink } from "@/components/settings/kit";
import { billingCopy } from "@/content/he/account";
import { PLANS } from "@/lib/data/plans";
import { MOCK_PROFILE } from "@/lib/mock/account";
import { fill, plural } from "@/components/settings/format";

const r = billingCopy.return;
type Status = "created" | "completed" | "failed" | "expired" | "slow";

/**
 * CheckoutReturnStatus (Part 03 §15.4): polls the checkout session; credits are granted only by the webhook,
 * so this page never grants anything itself. Mock: `created` for ~2.5 s, then the `status` from the URL.
 */
export function CheckoutReturnStatus() {
  const params = useSearchParams();
  const kind = (params.get("kind") ?? "topup") as "topup" | "subscription" | "plan_change" | "update_card";
  const target = (params.get("status") ?? "completed") as Status;
  const credits = Number(params.get("credits") ?? 0);
  const plan = PLANS.find((p) => p.id === params.get("plan"));
  const [status, setStatus] = React.useState<Status>("created");
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setStatus(target), 2500);
    return () => clearTimeout(t);
  }, [target]);
  React.useEffect(() => { if (status !== "created") headingRef.current?.focus(); }, [status]);

  let title = r.created.title;
  let body = r.created.body;
  let actions: React.ReactNode = null;
  let icon = <Loader2 className="size-10 animate-spin text-violet" aria-hidden />;

  if (status === "completed") {
    icon = <CircleCheck className="size-10 text-success" aria-hidden />;
    if (kind === "topup") {
      title = r.topup.title;
      body = fill(r.topup.body, { credits: plural(credits || 500, r.topup.credits), email: MOCK_PROFILE.email });
      actions = <ButtonLink href="/app" variant="primary">{r.backToWork}</ButtonLink>;
    } else if (kind === "update_card") {
      title = r.update_card.title;
      body = r.update_card.body;
      actions = <ButtonLink href="/app/billing" variant="primary">{r.toBilling}</ButtonLink>;
    } else {
      const p = plan ?? PLANS[2];
      title = fill(r.subscription.title, { planName: p.nameHe });
      body = fill(r.subscription.body, { credits: plural(p.monthlyCredits, r.subscription.credits), email: MOCK_PROFILE.email });
      actions = (
        <>
          <ButtonLink href="/app/create" variant="primary">{r.createVideo}</ButtonLink>
          <ButtonLink href="/app/billing" variant="secondary">{r.toBilling}</ButtonLink>
        </>
      );
    }
  } else if (status === "failed") {
    icon = <CircleAlert className="size-10 text-danger" aria-hidden />;
    title = r.failed.title;
    body = r.failed.body;
    actions = (
      <>
        <ButtonLink href="/app/billing?topup=pack-500" variant="primary">{r.retry}</ButtonLink>
        <ButtonLink href="/app/billing" variant="secondary">{r.toBilling}</ButtonLink>
      </>
    );
  } else if (status === "expired" || status === "slow") {
    icon = <Clock className="size-10 text-primary-text" aria-hidden />;
    title = r[status].title;
    body = r[status].body;
    actions = <ButtonLink href="/app/billing" variant="secondary">{r.toBilling}</ButtonLink>;
  }

  return (
    <Panel className="relative mx-auto flex max-w-xl flex-col items-center gap-5 overflow-hidden py-14 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
      <div className="relative flex size-20 items-center justify-center rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{icon}</div>
      <div className="relative flex flex-col gap-2" role="status" aria-live="polite">
        <h1 ref={headingRef} tabIndex={-1} className="text-h2 outline-none">{title}</h1>
        <p className="text-body-lg text-text-2">{body}</p>
      </div>
      {actions && <div className="relative flex flex-wrap justify-center gap-2">{actions}</div>}
    </Panel>
  );
}
