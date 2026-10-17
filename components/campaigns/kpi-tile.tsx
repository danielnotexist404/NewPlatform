"use client";
import * as React from "react";
import { CircleHelp, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { kpi as K } from "@/content/he/campaigns-app";
import { fmt } from "./text";
import { cn } from "@/lib/utils";

const nf0 = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Big KPI value: proportional digits (dataviz: hero figures are not tabular). ₪ before the number. */
export function KpiValue({ value, kind }: { value: number | null; kind: "ils" | "ils2" | "count" }) {
  if (value === null) return <span className="text-text-2">—</span>;
  if (kind === "count") return <bdi>{nf0.format(value)}</bdi>;
  const text = kind === "ils2" ? nf2.format(value) : nf0.format(value);
  return <bdi aria-label={`${text} שקלים`}>₪{text}</bdi>;
}

export interface KpiDelta {
  /** relative change in percent, e.g. 12.4 */
  pct: number | null;
  /** which direction is good for the reader */
  good: "up" | "down" | "neutral";
  vsLabel: string;
}

export function DeltaChip({ delta, className }: { delta: KpiDelta; className?: string }) {
  if (delta.pct === null) {
    return <span className={cn("text-micro text-muted", className)}>{K.noPrev}</span>;
  }
  const rounded = Math.round(delta.pct);
  const dir = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const tone =
    dir === "flat" || delta.good === "neutral" ? "text-text-2" : dir === delta.good ? "text-success" : "text-danger";
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const pctText = `${nf0.format(Math.abs(rounded))}%`;
  const sr = dir === "flat" ? K.deltaFlat : fmt(dir === "up" ? K.deltaUp : K.deltaDown, { pct: pctText });
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-micro", className)}>
      <span className={cn("inline-flex items-center gap-1 font-bold", tone)}>
        <Icon className="size-3.5" aria-hidden style={{ transform: "none" }} />
        <span className="sr-only">{sr}</span>
        <bdi aria-hidden className="num">{dir === "flat" ? "0%" : pctText}</bdi>
      </span>
      <span className="font-normal text-muted">{delta.vsLabel}</span>
    </span>
  );
}

function Sparkline({ points, className }: { points: number[]; className?: string }) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1);
  const w = 100;
  const h = 28;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - 2 - (p / max) * (h - 6)] as const);
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-7 w-full overflow-visible", className)} aria-hidden>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="var(--color-primary)" opacity={0.08} />
      <path d={d} fill="none" stroke="var(--color-border-strong)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={3} fill="var(--color-primary)" stroke="var(--color-surface-1)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function KpiTile({
  label,
  sub,
  help,
  value,
  delta,
  spark,
  className,
  index,
}: {
  label: string;
  sub?: string;
  help: string;
  value: React.ReactNode;
  delta?: KpiDelta;
  spark?: number[];
  className?: string;
  index?: number;
}) {
  const id = React.useId();
  return (
    <div
      className={cn(
        "group relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-md bg-surface-1 p-4 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5",
        className,
      )}
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p id={`${id}-label`} className="text-small font-semibold text-text">
            {index !== undefined && <span className="me-1.5 text-muted num" aria-hidden>{index}.</span>}
            {label}
          </p>
          {sub && <p className="truncate text-micro font-normal text-muted">{sub}</p>}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="-me-1 -mt-1 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-micro text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
              aria-label={`${K.whatIsIt} ${label}`}
            >
              <CircleHelp className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{K.whatIsIt}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 text-small text-text">
            <p className="mb-1 font-bold">{label}</p>
            <p className="text-text-2">{help}</p>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-h2 font-bold leading-none tracking-normal">{value}</p>
      <div className="mt-auto flex flex-col gap-2">
        {spark && <Sparkline points={spark} />}
        {delta && <DeltaChip delta={delta} />}
      </div>
    </div>
  );
}

export function pctChange(cur: number, prev: number | null | undefined): number | null {
  if (prev === null || prev === undefined || prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}
