"use client";
import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/settings/controls";
import { billingCopy } from "@/content/he/account";
import { CANCEL_FEE_CAP_ILS, MOCK_WORKSPACE } from "@/lib/mock/account";
import { fill, formatIls } from "@/components/settings/format";

const d = billingCopy.disclosure;

/**
 * Pre-payment disclosure (Part 06 §4.1, Part 03 §15 "גילוי לפני תשלום"): shown above the pay button of every
 * dialog that leads to payment, with a mandatory, NOT pre-checked terms checkbox.
 */
export function BillingDisclosure({
  id, kind, priceIls, cycle = "monthly", accepted, onAcceptedChange, showRequired,
}: {
  id: string;
  kind: "subscription" | "pack";
  priceIls: number;
  cycle?: "monthly" | "annual";
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  showRequired: boolean;
}) {
  const lines =
    kind === "subscription"
      ? [
          fill(d.renewal, { price: formatIls(priceIls), cycleSuffix: cycle === "annual" ? d.perYear : d.perMonth }),
          d.cancelAnytime,
          fill(d.distance, { feeCap: formatIls(CANCEL_FEE_CAP_ILS) }),
          fill(d.invoice, { billingEmail: MOCK_WORKSPACE.billingEmail }),
        ]
      : [
          fill(d.oneTime, { price: formatIls(priceIls) }),
          d.packNoExpiry,
          fill(d.distance, { feeCap: formatIls(CANCEL_FEE_CAP_ILS) }),
          fill(d.invoice, { billingEmail: MOCK_WORKSPACE.billingEmail }),
        ];
  return (
    <div className="flex flex-col gap-3">
      <ul id={`${id}-disclosure`} className="flex flex-col gap-1.5 rounded-md bg-surface-2 p-4 text-small text-text-2">
        {lines.map((l) => (
          <li key={l} className="flex items-start gap-2">
            <ShieldCheck className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />
            <span>{renderEmail(l)}</span>
          </li>
        ))}
      </ul>
      <Checkbox id={`${id}-terms`} checked={accepted} onCheckedChange={onAcceptedChange} describedBy={`${id}-disclosure`} invalid={showRequired && !accepted}>
        {d.termsBefore}
        <Link href="/legal/terms" target="_blank" rel="noopener" className="font-semibold text-link underline underline-offset-4">{d.terms}</Link>
        {d.termsMiddle}
        <Link href="/legal/cancellation" target="_blank" rel="noopener" className="font-semibold text-link underline underline-offset-4">{d.cancellation}</Link>
        {d.termsAfter}
      </Checkbox>
      {!accepted && <p id={`${id}-terms-required`} className="text-small text-text-2">{d.termsRequired}</p>}
    </div>
  );
}

/** Wrap e-mail addresses inside copy with an LTR bdi. */
function renderEmail(text: string) {
  const m = text.match(/[^\s@]+@[^\s@]+\.[^\s@.,]+/);
  if (!m) return text;
  const [before, after] = text.split(m[0]);
  return (
    <>
      {before}
      <bdi dir="ltr">{m[0]}</bdi>
      {after}
    </>
  );
}
