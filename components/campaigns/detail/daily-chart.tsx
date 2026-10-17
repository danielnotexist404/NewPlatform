"use client";
import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import type { DayPoint } from "@/lib/mock/campaigns";
import { detail as D } from "@/content/he/campaigns-app";
import { axisDay, dateShort } from "../text";

const nf = new Intl.NumberFormat("he-IL");
const AXIS = { fill: "var(--color-muted)", fontSize: 12 };

function TipBox({ active, payload, label, kind, resultLabel }: { active?: boolean; payload?: { value: number }[]; label?: string; kind: "spend" | "results"; resultLabel: string }) {
  if (!active || !payload?.length || !label) return null;
  const v = payload[0].value;
  return (
    <div dir="rtl" className="rounded-sm bg-surface-3 px-3 py-2 text-small text-text elev-2">
      <p className="text-micro font-normal text-muted">{dateShort(label)}</p>
      <p className="font-bold">
        {kind === "spend" ? <Price ils={v} decimals /> : <bdi className="num">{nf.format(v)}</bdi>}{" "}
        <span className="font-normal text-text-2">{kind === "spend" ? D.chart.spend : resultLabel}</span>
      </p>
    </div>
  );
}

/**
 * Daily chart (spec §G.3) as two small multiples on one shared day axis — never a dual-axis chart.
 * Charts stay LTR (time runs left→right); the table below is the accessible alternative.
 */
export function DailyChart({ data, resultLabel }: { data: DayPoint[]; resultLabel: string }) {
  const [table, setTable] = React.useState(false);
  const id = React.useId();
  if (data.length === 0) {
    return <p className="rounded-md border border-dashed border-border-strong p-8 text-center text-small text-text-2">{D.chart.empty}</p>;
  }
  const ticks = data.length > 10 ? data.filter((_, i) => i % Math.ceil(data.length / 7) === 0).map((d) => d.date) : undefined;
  return (
    <div className="flex flex-col gap-5">
      <figure className="flex flex-col gap-2" aria-labelledby={`${id}-spend`}>
        <figcaption id={`${id}-spend`} className="flex items-center gap-2 text-small font-semibold text-text-2">
          <span aria-hidden className="size-2.5 rounded-xs" style={{ background: "var(--color-chart-1)" }} />
          {D.chart.spend}
        </figcaption>
        <div dir="ltr" className="h-40 w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="22%">
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="date" tickFormatter={axisDay} tick={AXIS} tickLine={false} axisLine={{ stroke: "var(--color-border)" }} ticks={ticks} interval={ticks ? 0 : "preserveStartEnd"} />
              <YAxis width={44} tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v: number) => `₪${nf.format(v)}`} allowDecimals={false} />
              <Tooltip cursor={{ fill: "var(--color-surface-2)" }} content={<TipBox kind="spend" resultLabel={resultLabel} />} />
              <Bar dataKey="spendIls" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
      <figure className="flex flex-col gap-2" aria-labelledby={`${id}-results`}>
        <figcaption id={`${id}-results`} className="flex items-center gap-2 text-small font-semibold text-text-2">
          <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: "var(--color-chart-2)" }} />
          {resultLabel}
        </figcaption>
        <div dir="ltr" className="h-36 w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="date" tickFormatter={axisDay} tick={AXIS} tickLine={false} axisLine={{ stroke: "var(--color-border)" }} ticks={ticks} interval={ticks ? 0 : "preserveStartEnd"} />
              <YAxis width={44} tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ stroke: "var(--color-border-strong)" }} content={<TipBox kind="results" resultLabel={resultLabel} />} />
              <Area
                type="monotone"
                dataKey="results"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="var(--color-chart-2)"
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 5, stroke: "var(--color-surface-1)", strokeWidth: 2, fill: "var(--color-chart-2)" }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>
      <div>
        <Button variant="ghost" size="sm" onClick={() => setTable((v) => !v)} aria-expanded={table} aria-controls={`${id}-table`}>
          <Table2 aria-hidden />
          {table ? D.chart.tableHide : D.chart.tableShow}
        </Button>
        <div id={`${id}-table`} hidden={!table} className="mt-3 max-h-80 overflow-auto rounded-sm shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <table className="w-full text-small">
            <caption className="sr-only">{D.chart.title}</caption>
            <thead className="sticky top-0 bg-surface-2 text-text-2">
              <tr>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{D.chart.table.date}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{D.chart.table.spend}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{resultLabel}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{D.chart.table.reach}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.date} className="border-t border-border">
                  <th scope="row" className="px-3 py-2 text-start font-normal"><bdi className="num">{dateShort(p.date)}</bdi></th>
                  <td className="px-3 py-2"><Price ils={p.spendIls} decimals /></td>
                  <td className="px-3 py-2"><bdi className="num">{nf.format(p.results)}</bdi></td>
                  <td className="px-3 py-2"><bdi className="num">{nf.format(p.reach)}</bdi></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
