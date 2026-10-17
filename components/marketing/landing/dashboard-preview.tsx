"use client";
import * as React from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Eye, Info, MessageCircle, Pause, TrendingUp, Wallet, Coins, Trophy, type LucideIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Num, Price } from "@/components/a11y/num";
import { DASHBOARD_SAMPLE as D } from "@/lib/mock/landing";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.dashboard;
const nf = new Intl.NumberFormat("he-IL");

function Kpi({ icon: Icon, label, sublabel, hint, children }: { icon: LucideIcon; label: string; sublabel?: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface-2 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-small font-semibold text-text-2">
          <Icon className="size-4 text-primary-text" aria-hidden />
          {label}
        </span>
        <Tooltip content={<span className="block max-w-56 text-small">{hint}</span>}>
          <button type="button" className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-surface-3 hover:text-text" aria-label={`${T.whatIsIt} ${label}`}>
            <Info className="size-3.5" aria-hidden />
          </button>
        </Tooltip>
      </div>
      <div className="text-3xl font-extrabold leading-none text-text md:text-[2rem]">{children}</div>
      {sublabel && <span className="text-micro font-normal text-muted">{sublabel}</span>}
    </div>
  );
}

/** DashboardPreview (spec 07–08 §G.1, §L.5): the four plain-Hebrew KPIs, a daily chart and hook comparison. Sample data, clearly labelled. */
export function DashboardPreview() {
  const winner = D.hooks.find((h) => h.winner) ?? D.hooks[0];
  return (
    <figure className="relative overflow-hidden rounded-xl bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)]" aria-labelledby="dash-caption">
      {/* window bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text">{T.windowTitle}</span>
          <span className="hidden text-micro font-normal text-muted sm:inline">{T.periodLabel}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{T.badge}</span>
      </div>

      <div className="flex flex-col gap-5 p-4 md:p-6">
        {/* campaign header */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-lg font-bold text-text">&quot;{D.campaignNameHe}&quot;</h3>
          <span className="inline-flex items-center gap-1 rounded-xs bg-success/15 px-2 py-0.5 text-micro text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            {T.statusActive}
          </span>
          <span className="text-small text-text-2">
            {D.businessHe} · {D.goalLabelHe} · <Price ils={D.dailyBudgetIls} /> ליום
          </span>
        </div>

        {/* 4 KPIs, always in this order */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi icon={Wallet} label={T.kpis.spend.label} hint={T.kpis.spend.hint}>
            <Price ils={D.spendIls} />
          </Kpi>
          <Kpi icon={Eye} label={T.kpis.reach.label} hint={T.kpis.reach.hint}>
            <Num value={D.reach} />
          </Kpi>
          <Kpi icon={MessageCircle} label={T.kpis.results.label} sublabel={T.kpis.results.sublabel} hint={T.kpis.results.hint}>
            <Num value={D.results} />
          </Kpi>
          <Kpi icon={Coins} label={T.kpis.cpr.label} hint={T.kpis.cpr.hint}>
            <Price ils={D.costPerResultIls} decimals />
          </Kpi>
        </div>

        {/* plain sentence */}
        <div className="flex items-start gap-3 rounded-md bg-violet/10 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_30%,transparent)]">
          <TrendingUp className="mt-0.5 size-5 shrink-0 text-violet" aria-hidden />
          <p className="text-body text-text">
            <span className="sr-only">{T.summaryLabel}: </span>
            {T.sentence(`₪${nf.format(D.spendIls)}`, D.results, winner.text)}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-5">
          {/* chart */}
          <div className="flex flex-col gap-3 rounded-md bg-surface-2/50 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-small font-bold text-text">{T.chartTitle}</h4>
              <div className="flex items-center gap-3 text-micro font-normal text-text-2">
                <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-[3px] bg-[var(--color-chart-1)]" aria-hidden />{T.chartSpend}</span>
                <span className="inline-flex items-center gap-1"><span className="h-0.5 w-3 rounded-full bg-[var(--color-chart-2)]" aria-hidden />{T.chartResults}</span>
              </div>
            </div>
            <div dir="ltr" className="h-44 w-full" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={D.daily as unknown as { day: string; spend: number; results: number }[]} margin={{ top: 6, right: 4, bottom: 0, left: -18 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-2)", fontSize: 12 }} />
                  <YAxis yAxisId="s" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted)", fontSize: 11 }} width={40} />
                  <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted)", fontSize: 11 }} width={24} allowDecimals={false} />
                  <RTooltip
                    cursor={{ fill: "color-mix(in oklab, var(--color-text) 6%, transparent)" }}
                    contentStyle={{ background: "var(--color-surface-3)", border: "none", borderRadius: 8, color: "var(--color-text)", direction: "rtl" }}
                    formatter={(v, name) => [name === "spend" ? `₪${v}` : String(v), name === "spend" ? T.chartSpend : T.chartResults]}
                  />
                  <Bar yAxisId="s" dataKey="spend" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={22} fillOpacity={0.85} isAnimationActive={false} />
                  <Line yAxisId="r" dataKey="results" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-chart-2)" }} type="monotone" isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <details className="text-small text-text-2">
              <summary className="cursor-pointer text-micro font-semibold text-link">{T.chartTableSummary}</summary>
              <table className="mt-2 w-full text-start text-small">
                <thead>
                  <tr className="text-muted">
                    <th scope="col" className="py-1 text-start font-semibold">{T.dayCol}</th>
                    <th scope="col" className="py-1 text-start font-semibold">{T.chartSpend}</th>
                    <th scope="col" className="py-1 text-start font-semibold">{T.chartResults}</th>
                  </tr>
                </thead>
                <tbody>
                  {D.daily.map((d) => (
                    <tr key={d.day} className="border-t border-border">
                      <th scope="row" className="py-1 text-start font-normal">{d.day}</th>
                      <td className="py-1"><Price ils={d.spend} /></td>
                      <td className="py-1"><Num value={d.results} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>

          {/* hook comparison */}
          <div className="flex flex-col gap-3 rounded-md bg-surface-2/50 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:col-span-3">
            <h4 className="text-small font-bold text-text">{T.hooksTitle}</h4>
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-micro text-muted">
                    <th scope="col" className="pb-2 text-start font-semibold">{T.hookCols.hook}</th>
                    <th scope="col" className="hidden pb-2 text-start font-semibold sm:table-cell">{T.hookCols.hookRate}</th>
                    <th scope="col" className="pb-2 text-start font-semibold">{T.hookCols.results}</th>
                    <th scope="col" className="pb-2 text-start font-semibold">{T.hookCols.cpr}</th>
                  </tr>
                </thead>
                <tbody>
                  {D.hooks.map((h) => (
                    <tr key={h.hookId} className="border-t border-border align-middle">
                      <th scope="row" className="py-2.5 pe-3 text-start font-semibold text-text sm:max-w-[16rem]">
                        <span className="line-clamp-2">{h.text}</span>
                        {h.winner && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-xs bg-primary px-1.5 py-0.5 text-micro text-on-primary">
                            <Trophy className="size-3" aria-hidden />
                            {T.winner}
                          </span>
                        )}
                      </th>
                      <td className="hidden py-2.5 pe-3 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-3" aria-hidden>
                            <span className="block h-full rounded-full bg-[var(--color-chart-1)]" style={{ width: `${h.hookRatePct * 2.6}%` }} />
                          </span>
                          <bdi className="num">{h.hookRatePct}%</bdi>
                        </div>
                      </td>
                      <td className="py-2.5 pe-3"><Num value={h.results} /></td>
                      <td className={cn("py-2.5", h.winner && "font-bold text-success")}><Price ils={Math.round((h.spendIls / h.results) * 100) / 100} decimals /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* sample actions — illustration only, not interactive */}
        <div className="flex flex-wrap items-center gap-2" aria-label={T.actionsLabel} role="group">
          {T.actions.map((a, i) => (
            <span
              key={a}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold",
                i === 2 ? "bg-primary text-on-primary" : "bg-surface-2 text-text shadow-[inset_0_0_0_1px_var(--color-border-strong)]",
              )}
            >
              {i === 1 && <Pause className="size-4" aria-hidden />}
              {i === 2 && <Trophy className="size-4" aria-hidden />}
              {a}
            </span>
          ))}
        </div>
      </div>
      <figcaption id="dash-caption" className="border-t border-border px-4 py-3 text-micro font-normal text-muted md:px-6">
        <span className="font-semibold text-text-2">{T.badge}: </span>
        {T.disclaimer}
      </figcaption>
    </figure>
  );
}
