import { Coins, Eye, MessageCircle, Pause, SlidersHorizontal, Trophy, Wallet, type LucideIcon } from "lucide-react";
import { BrowserFrame } from "./browser-frame";
import { Num, Price } from "@/components/a11y/num";
import s from "./media.module.css";
import { DASHBOARD_SAMPLE as D } from "@/lib/mock/landing";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.dash;

function Sparkline({ values, id }: { values: number[]; id: string }) {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 22 - 3}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
      <defs>
        <linearGradient id={`cd-l-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--color-primary)" />
          <stop offset="1" stopColor="var(--color-coral)" />
        </linearGradient>
        <linearGradient id={`cd-f-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity=".28" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#cd-f-${id})`} />
      <polyline points={pts} fill="none" stroke={`url(#cd-l-${id})`} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kpi({ icon: Icon, label, value, series, id }: { icon: LucideIcon; label: string; value: React.ReactNode; series: number[]; id: string }) {
  return (
    <div className="flex flex-col rounded-[18px] bg-surface-1 p-4 ring-hairline md:p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary-text">
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-small font-semibold text-text-2">{label}</p>
      </div>
      <p className="mt-3 text-[clamp(1.6rem,1.2rem+1.3vw,2.5rem)] font-extrabold leading-none text-text">{value}</p>
      <div className="mt-3" dir="ltr"><Sparkline values={series} id={id} /></div>
    </div>
  );
}

/**
 * The campaign dashboard product shot (sample data, always labelled). `compact` drops the hooks panel for small spaces.
 */
export function CampaignDashboard({ compact = false, className }: { compact?: boolean; className?: string }) {
  const maxRes = Math.max(...D.daily.map((d) => d.results));
  const maxHookRes = Math.max(...D.hooks.map((h) => h.results));
  const cum = D.daily.reduce<number[]>((a, d) => [...a, (a.at(-1) ?? 0) + d.spend], []);
  return (
    <BrowserFrame
      url="kdimon.co.il/app/campaigns"
      label={`${C.badge}: ${C.title}`}
      className={className}
      tabs={<span className="rounded-full bg-ink px-3 py-1 text-micro text-paper">{C.badge}</span>}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-4 md:px-6 md:pt-5">
        <p className="text-body font-bold text-text">
          {C.windowTitle} <span className="font-normal text-muted">/ {D.campaignNameHe}</span>
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-0.5 text-micro text-success">
          <span aria-hidden className="size-1.5 rounded-full bg-success animate-pulse-dot" />
          {C.active}
        </span>
        <span className="ms-auto rounded-full bg-surface-1 px-3 py-1 text-micro font-semibold text-text-2 ring-1 ring-border">{C.period}</span>
      </div>
      <div className="grid gap-3 p-3 md:gap-4 md:p-5">
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          <Kpi id="spend" icon={Wallet} label={C.kpis.spend} value={<Price ils={D.spendIls} />} series={cum} />
          <Kpi id="reach" icon={Eye} label={C.kpis.reach} value={<Num value={D.reach} />} series={[900, 2100, 3400, 4700, 6200, 7900, 9450]} />
          <Kpi id="results" icon={MessageCircle} label={C.kpis.results} value={<Num value={D.results} />} series={D.daily.map((d) => d.results)} />
          <Kpi id="cpr" icon={Coins} label={C.kpis.cpr} value={<Price ils={D.costPerResultIls} decimals />} series={[19, 16, 15, 13.5, 13, 12.4, 12.17]} />
        </div>
        {!compact && (
          <div className="grid gap-3 md:gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0 rounded-[18px] bg-surface-1 p-4 ring-hairline md:p-5">
              <p className="text-small font-bold text-text">{C.chartTitle}</p>
              <div dir="ltr" className="mt-5 flex h-44 items-end gap-2 md:gap-3">
                {D.daily.map((d, i) => (
                  <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="num text-micro text-text-2">{d.results}</span>
                    <span
                      className={cn("w-full max-w-12 rounded-t-[10px] rounded-b-[4px] bg-accent-gradient opacity-90", s.grow)}
                      style={{ height: `${(d.results / maxRes) * 72 + 8}%`, "--i": i } as React.CSSProperties}
                    />
                    <span className="text-micro font-normal text-muted">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 rounded-[18px] bg-surface-1 p-4 ring-hairline md:p-5">
              <p className="text-small font-bold text-text">{C.hooksTitle}</p>
              <ul className="mt-4 flex flex-col gap-4">
                {D.hooks.map((h) => {
                  const win = "winner" in h && h.winner;
                  return (
                    <li key={h.hookId}>
                      <div className="flex items-center justify-between gap-3 text-small">
                        <span className="min-w-0 truncate font-semibold text-text">{h.text}</span>
                        {win && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-micro text-primary-text">
                            <Trophy className="size-3" aria-hidden />
                            {C.winner}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                          <div className={cn("h-full rounded-full", win ? "bg-accent-gradient" : "bg-border-strong/50")} style={{ width: `${(h.results / maxHookRes) * 100}%` }} />
                        </div>
                        <span className="shrink-0 text-micro text-text-2">
                          <bdi className="num">{h.results}</bdi> {C.leads}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div aria-hidden className="mt-5 flex gap-2">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-micro text-text ring-1 ring-border">
                  <SlidersHorizontal className="size-3.5" />
                  שינוי תקציב
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-micro text-text ring-1 ring-border">
                  <Pause className="size-3.5" />
                  השהיה
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
