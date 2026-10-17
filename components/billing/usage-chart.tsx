"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell, LabelList } from "recharts";
import { Progress } from "@/components/ui/misc";
import { billingCopy } from "@/content/he/account";
import { MOCK_USAGE, MOCK_CREDIT_SUMMARY, MOCK_SUBSCRIPTION } from "@/lib/mock/account";
import { fill, formatDateHe, formatInt } from "@/components/settings/format";

const u = billingCopy.usage;
const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

/** UsageChart (Part 03 §15.1): horizontal bars, LTR like every chart, plus a visually hidden table. */
export function UsageChart() {
  const allowance = MOCK_CREDIT_SUMMARY.planAllowance;
  const used = MOCK_USAGE.reduce((s, x) => s + x.credits, 0);
  const data = MOCK_USAGE.map((x) => ({ name: u.categories[x.category], credits: x.credits }));
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Recharts measures the DOM; render it after mount only
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-body-lg">
          {u.summary.split("{used}")[0]}
          <bdi className="num font-bold">{formatInt(used)}</bdi>
          {u.summary.split("{used}")[1].split("{allowance}")[0]}
          <bdi className="num font-bold">{formatInt(allowance)}</bdi>
          {u.summary.split("{allowance}")[1]}
        </p>
        <Progress value={(used / allowance) * 100} aria-label={fill(u.summary, { used: formatInt(used), allowance: formatInt(allowance) })} />
        <p className="text-small text-muted">{fill(u.period, { from: formatDateHe(MOCK_SUBSCRIPTION.periodStart, "dayMonth"), to: formatDateHe(MOCK_SUBSCRIPTION.periodEnd, "dayMonth") })}</p>
      </div>
      <div dir="ltr" aria-hidden className="h-56 w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 8 }} barCategoryGap={10}>
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-text-2)", fontSize: 14, fontFamily: "var(--font-sans)" }}
              />
              <Bar dataKey="credits" radius={[4, 8, 8, 4]} minPointSize={3} isAnimationActive={false}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                <LabelList dataKey="credits" position="right" style={{ fill: "var(--color-text)", fontSize: 13, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <table className="sr-only">
        <caption>{u.tableCaption}</caption>
        <thead><tr><th scope="col">{u.category}</th><th scope="col">{u.credits}</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.name}><th scope="row">{d.name}</th><td>{formatInt(d.credits)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
