import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Price } from "@/components/a11y/num";
import { spendCap as S } from "@/content/he/campaigns-app";
import { fill } from "./text";
import { cn } from "@/lib/utils";

/** SpendCapMeter (spec §K.3, §L.4): managed spend this month vs the plan cap, plus the user's own cap. */
export function SpendCapMeter({
  usedIls,
  capIls,
  planName,
  userCapIls,
  compact = false,
  className,
}: {
  usedIls: number;
  capIls: number;
  planName: string;
  userCapIls?: number | null;
  compact?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, (usedIls / capIls) * 100);
  const userPct = userCapIls ? Math.min(100, (userCapIls / capIls) * 100) : null;
  const tone = pct >= 100 ? "bg-danger" : pct >= 80 ? "bg-rose" : "bg-primary";
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {!compact && (
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-body font-bold">{S.title}</h2>
          <Link href="/app/billing/plans" className="text-small text-link underline-offset-4 hover:underline">
            {S.upgrade}
          </Link>
        </div>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-body-lg font-bold">
          {fill(S.used, { used: <Price ils={Math.round(usedIls)} />, cap: <Price ils={capIls} className="font-normal text-text-2" /> })}
        </p>
        <p className="text-small text-text-2">{fill(S.left, { left: <Price ils={Math.max(0, Math.round(capIls - usedIls))} /> })}</p>
      </div>
      <div
        className="relative h-2.5 w-full rounded-full bg-primary/15"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={capIls}
        aria-valuenow={Math.round(usedIls)}
        aria-label={S.title}
      >
        <div className={cn("absolute inset-y-0 inset-s-0 rounded-full", tone)} style={{ width: `${pct}%` }} />
        {userPct !== null && (
          <span aria-hidden className="absolute -inset-y-1 w-0.5 rounded-full bg-text" style={{ insetInlineStart: `calc(${userPct}% - 1px)` }} />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-micro font-normal text-text-2">
        <span>{fill(S.planLine, { plan: `"${planName}"`, cap: <Price ils={capIls} /> })}</span>
        {userCapIls ? (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-3 w-0.5 rounded-full bg-text" />
            {fill(S.userCap, { cap: <Price ils={userCapIls} /> })}
          </span>
        ) : null}
      </div>
      {pct >= 80 && <p className="text-small text-primary-text">{S.warn80}</p>}
      {!compact && (
        <p className="flex items-start gap-2 rounded-sm bg-surface-2 px-3 py-2 text-small text-text-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
          {S.money}
        </p>
      )}
    </div>
  );
}
