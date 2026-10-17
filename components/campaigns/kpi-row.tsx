"use client";
import * as React from "react";
import { MOCK_TODAY, type CampaignGoal, type KpiSet, type RangeKey } from "@/lib/mock/campaigns";
import { GOAL_COPY, kpi as K } from "@/content/he/campaigns-app";
import { KpiTile, KpiValue, pctChange } from "./kpi-tile";
import { cn } from "@/lib/utils";

/** The four headline KPIs, always in this order (spec §G.1). */
export function KpiRow({ set, goal, range, className }: { set: KpiSet; goal: CampaignGoal | "workspace"; range: RangeKey; className?: string }) {
  const { current: c, previous: p } = set;
  const awareness = goal === "local_awareness";
  const cost = awareness ? (c.reach > 0 ? (c.spendIls / c.reach) * 1000 : null) : c.results > 0 ? c.spendIls / c.results : null;
  const prevCost = p ? (awareness ? (p.reach > 0 ? (p.spendIls / p.reach) * 1000 : null) : p.results > 0 ? p.spendIls / p.results : null) : null;
  const vsLabel = K.vsPrev[range];
  const withDelta = range !== "all";
  const series = set.series.filter((d) => d.date !== MOCK_TODAY); // full days only

  const resultsSub = goal === "workspace" ? K.results.workspaceSub : GOAL_COPY[goal].resultLabel;
  const resultsHelp = goal === "workspace" ? K.results.workspaceHelp : GOAL_COPY[goal].resultHelp;
  const costLabel = goal === "workspace" ? K.cost.label : GOAL_COPY[goal].costLabel;

  return (
    <div className={cn("grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4", className)}>
      <KpiTile
        label={K.spend.label}
        help={K.spend.help}
        value={<KpiValue value={c.spendIls} kind="ils" />}
        spark={series.map((d) => d.spendIls)}
        delta={withDelta ? { pct: pctChange(c.spendIls, p?.spendIls), good: "neutral", vsLabel } : undefined}
      />
      <KpiTile
        label={K.reach.label}
        help={K.reach.help}
        value={<KpiValue value={c.reach} kind="count" />}
        spark={series.map((d) => d.reach)}
        delta={withDelta ? { pct: pctChange(c.reach, p?.reach), good: "up", vsLabel } : undefined}
      />
      <KpiTile
        label={K.results.label}
        sub={resultsSub}
        help={resultsHelp}
        value={<KpiValue value={c.results} kind="count" />}
        spark={series.map((d) => d.results)}
        delta={withDelta ? { pct: pctChange(c.results, p?.results), good: "up", vsLabel } : undefined}
      />
      <KpiTile
        label={costLabel}
        help={awareness ? K.cost.awarenessHelp : K.cost.help}
        value={<KpiValue value={cost} kind="ils2" />}
        delta={withDelta ? { pct: cost !== null ? pctChange(cost, prevCost) : null, good: "down", vsLabel } : undefined}
      />
    </div>
  );
}
