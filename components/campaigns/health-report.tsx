"use client";
import * as React from "react";
import Link from "next/link";
import { Check, CircleCheck, Flame, HeartPulse, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { healthReport as R, SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { health as H, sample } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote, SectionTitle } from "./page-header";
import { ScoreRing } from "./score-ring";
import { dateLong, fill, fmt, formatIls, timeOf } from "./text";
import { cn } from "@/lib/utils";

const BURN_SHADES = [1, 0.7, 0.45]; // one hue (rose), stepped — burn categories are ordered by size

export function HealthReport() {
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const burnTotal = R.burn.reduce((a, b) => a + b.amountIls, 0);
  const band = R.score < 50 ? H.bands.low : R.score < 75 ? H.bands.mid : H.bands.high;
  const perDay = Math.round(R.totalSpendIls / 90);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <SampleNote text={sample.health} />
      <PageHeader
        back={{ href: "/app/campaigns", label: H.back }}
        eyebrow={H.eyebrow}
        eyebrowIcon={HeartPulse}
        title={H.title}
        sub={fmt(H.period, { from: dateLong(R.periodStart), to: dateLong(R.periodEnd) })}
      />

      {/* Score hero */}
      <section aria-labelledby="score-title" className="relative overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
        <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <ScoreRing score={R.score} size={188} label={H.scoreLabel} display className="mx-auto" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="score-title" className="text-micro text-text-2">{H.scoreLabel}</h2>
              <p className="text-h2">{band}</p>
              <p className="max-w-2xl text-body-lg text-text-2">{fill(H.summary, { perDay: <Price ils={perDay} className="font-bold text-text" /> })}</p>
            </div>
            <dl className="grid grid-cols-3 gap-3">
              <div className="rounded-sm bg-surface-2 p-3">
                <dt className="text-micro font-normal text-muted">{H.stats.spend}</dt>
                <dd className="text-body-lg font-bold"><Price ils={R.totalSpendIls} /></dd>
              </div>
              <div className="rounded-sm bg-surface-2 p-3">
                <dt className="text-micro font-normal text-muted">{H.stats.campaigns}</dt>
                <dd className="text-body-lg font-bold"><bdi className="num">{R.campaignsChecked}</bdi></dd>
              </div>
              <div className="rounded-sm bg-surface-2 p-3">
                <dt className="text-micro font-normal text-muted">{H.stats.ads}</dt>
                <dd className="text-body-lg font-bold"><bdi className="num">{R.adsChecked}</bdi></dd>
              </div>
            </dl>
            <p className="text-micro font-normal text-muted">{H.scoreNote}</p>
          </div>
        </div>
      </section>

      {/* Where the money burns */}
      <section aria-labelledby="burn-title" className="flex flex-col gap-5 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
        <SectionTitle
          id="burn-title"
          title={H.burnTitle}
          sub={fill(H.burnSub, { amount: <Price ils={burnTotal} className="font-bold text-text" />, total: <Price ils={R.totalSpendIls} /> })}
        />
        <div className="flex flex-col gap-2">
          <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label={fmt(H.burnAria, { amount: formatIls(burnTotal), total: formatIls(R.totalSpendIls) })}>
            {R.burn.map((b, i) => (
              <span key={b.key} className="h-full first:rounded-s-full" style={{ width: `${(b.amountIls / R.totalSpendIls) * 100}%`, background: "var(--color-rose)", opacity: BURN_SHADES[i] }} />
            ))}
            <span className="h-full flex-1 rounded-e-full bg-surface-3" />
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-micro font-normal text-text-2">
            {R.burn.map((b, i) => (
              <li key={b.key} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 rounded-xs" style={{ background: "var(--color-rose)", opacity: BURN_SHADES[i] }} />
                {b.title}
              </li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-xs bg-surface-3" />
              {H.burnLegendWorking}
            </li>
          </ul>
        </div>
        <ol className="grid gap-3 md:grid-cols-3">
          {R.burn.map((b) => (
            <li key={b.key} className="flex flex-col gap-2 rounded-sm bg-surface-2 p-4">
              <p className="flex items-center gap-2 text-h3 font-bold">
                <Flame className="size-5 text-rose" aria-hidden />
                <Price ils={b.amountIls} />
              </p>
              <p className="font-semibold">{b.title}</p>
              <p className="text-small text-text-2">{b.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Fixes */}
      <section aria-labelledby="fixes-title" className="flex flex-col gap-4">
        <SectionTitle id="fixes-title" title={H.fixesTitle} sub={H.fixesSub} />
        <ol className="flex flex-col gap-3">
          {R.fixes.map((f, i) => {
            const isDone = !!done[f.id];
            return (
              <li key={f.id} className={cn("flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:flex-row md:items-center md:p-5", isDone && "opacity-70")}>
                <span aria-hidden className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-body font-bold", isDone ? "bg-success text-bg" : "bg-surface-3 text-text")}>
                  {isDone ? <Check className="size-5" strokeWidth={3} /> : <bdi className="num">{i + 1}</bdi>}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-micro", f.severity === "high" ? "bg-danger/15 text-danger" : f.severity === "medium" ? "bg-primary/12 text-primary-text" : "bg-surface-3 text-text-2")}>
                      {H.severity[f.severity]}
                    </span>
                    {f.savingIls && (
                      <span className="text-micro font-normal text-muted">
                        {H.savingLabel}: {fill(H.saving, { amount: <Price ils={f.savingIls} /> })}
                      </span>
                    )}
                  </div>
                  <p className="text-body-lg font-bold">{f.title}</p>
                  <p className="text-small text-text-2">{f.why}</p>
                </div>
                <div className="shrink-0">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1.5 text-small font-semibold text-success"><CircleCheck className="size-4" aria-hidden />{H.done}</span>
                  ) : f.action.href ? (
                    <Button asChild variant={i === 0 ? "primary" : "secondary"}>
                      <Link href={f.action.href}>
                        {f.action.label}
                        <DirIcon name="forward" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant={i === 0 ? "primary" : "secondary"}
                      onClick={() => {
                        setDone((d) => ({ ...d, [f.id]: true }));
                        toast.success(f.action.instantToast ?? H.done);
                      }}
                    >
                      {f.action.label}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Checks */}
      <section aria-labelledby="checks-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
        <SectionTitle id="checks-title" title={H.checksTitle} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {R.checks.map((c) => (
            <li key={c.key} className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2 text-small">
                <span aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center rounded-full", c.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>
                  {c.passed ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
                </span>
                {c.label}
              </span>
              <span className={cn("shrink-0 text-micro", c.passed ? "text-success" : "text-danger")}>
                <span className="sr-only">{c.passed ? H.passed : H.failed}: </span>
                {c.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 rounded-md border border-dashed border-border-strong p-4 text-small text-text-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-text">{H.footer}</p>
          <p>{fmt(H.created, { date: dateLong(R.createdAt), time: timeOf(R.createdAt) })} · {fmt(H.rerunNote, { plan: `"${SAMPLE_BUSINESS.plan.nameHe}"`, n: SAMPLE_BUSINESS.plan.healthChecksPerMonth })}</p>
        </div>
        <Button variant="secondary" disabled title={H.rerunTomorrow}>
          <RefreshCw aria-hidden />
          {H.rerun}
        </Button>
      </div>
    </div>
  );
}
