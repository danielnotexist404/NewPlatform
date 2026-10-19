"use client";
import * as React from "react";
import Link from "next/link";
import { Globe, HeartPulse, Plus } from "lucide-react";
import { accentCta } from "@/components/layout/cta-styles";
import { campaigns, workspaceKpis, type RangeKey } from "@/lib/mock/campaigns";
import { dashboard as D } from "@/content/he/campaigns-app";
import { RangePicker, useStoredRange } from "./range-picker";
import { KpiRow } from "./kpi-row";
import { CampaignList } from "./campaign-list";
import { cn } from "@/lib/utils";

type WsRange = Exclude<RangeKey, "all">;
const RANGES: readonly WsRange[] = ["7d", "14d", "30d", "month"] as const;

/** Minimal campaigns home: title + range, the four KPI tiles, the campaign list. */
export function CampaignsDashboard() {
  const [range, setRange] = useStoredRange<WsRange>("7d", RANGES);
  const set = React.useMemo(() => workspaceKpis(range), [range]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-h1">{D.title}</h1>
          <p className="text-small text-muted">נתוני דוגמה</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RangePicker value={range} onChange={setRange} options={RANGES} label={D.rangeLabel} />
          <Link href="/app/campaigns/new" className={cn(accentCta, "h-12 px-6")}>
            <Plus className="size-5" aria-hidden />
            {D.newCampaign}
          </Link>
        </div>
      </header>

      <KpiRow set={set} goal="workspace" range={range} />

      <CampaignList items={campaigns} />

      <nav aria-label="עוד בקמפיינים" className="flex flex-wrap gap-2 border-t border-border pt-6">
        <Link href="/app/landing-pages" className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-1 px-4 text-small font-semibold text-text-2 ring-1 ring-border hover:text-text">
          <Globe className="size-4" aria-hidden />
          דפי עסק
        </Link>
        <Link href="/app/campaigns/health" className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-1 px-4 text-small font-semibold text-text-2 ring-1 ring-border hover:text-text">
          <HeartPulse className="size-4" aria-hidden />
          בדיקת דופק
        </Link>
      </nav>
    </div>
  );
}
