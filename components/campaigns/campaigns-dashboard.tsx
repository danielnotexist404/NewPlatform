"use client";
import * as React from "react";
import Link from "next/link";
import { Megaphone, Plus, RefreshCw, Vote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  campaigns,
  monthSpendIls,
  SAMPLE_BUSINESS,
  winnerOf,
  workspaceKpis,
  type RangeKey,
} from "@/lib/mock/campaigns";
import { dashboard as D, sample, connect as C, RANGE_LABEL, RANGE_IN } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote } from "./page-header";
import { RangePicker, useStoredRange } from "./range-picker";
import { KpiRow } from "./kpi-row";
import { CampaignList } from "./campaign-list";
import { SpendCapMeter } from "./spend-cap-meter";
import { HealthTeaserCard, WinnerCard } from "./side-cards";
import { ConnectMetaCard } from "./connect-meta-card";
import { fill, fmt, plural } from "./text";

type WsRange = Exclude<RangeKey, "all">;
const RANGES: readonly WsRange[] = ["7d", "14d", "30d", "month"] as const;
const RESULTS_FORMS = { one: "פנייה אחת", two: "2 פניות", other: "# פניות" };

export function CampaignsDashboard() {
  const [connected, setConnected] = React.useState(true);
  const [range, setRange] = useStoredRange<WsRange>("7d", RANGES);
  const [refreshed, setRefreshed] = React.useState(false);
  const set = React.useMemo(() => workspaceKpis(range), [range]);
  const lead = campaigns.find((c) => c.id === "cmp-after-holidays")!;
  const winner = winnerOf(lead);

  const delta = set.previous ? set.current.results - set.previous.results : 0;
  const deltaText = !set.previous ? D.summarySame : delta > 0 ? D.summaryUp : delta < 0 ? D.summaryDown : D.summarySame;

  const actions = (
    <>
      {connected && <RangePicker value={range} onChange={setRange} options={RANGES} label={D.rangeLabel} />}
      <Button asChild size="lg">
        <Link href="/app/campaigns/new">
          <Plus aria-hidden />
          {D.newCampaign}
        </Link>
      </Button>
    </>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <SampleNote
        text={sample.dashboard}
        action={
          <button type="button" onClick={() => setConnected((v) => !v)} className="text-small font-semibold text-link underline-offset-4 hover:underline">
            {connected ? sample.showEmpty : sample.showSample}
          </button>
        }
      />
      <PageHeader eyebrow={D.eyebrow} eyebrowIcon={Megaphone} title={D.title} sub={D.sub} actions={actions} />

      {!connected ? (
        <div className="flex flex-col gap-6">
          <ConnectMetaCard onConnected={() => setConnected(true)} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="relative lg:col-span-2" aria-hidden>
              <p className="mb-3 text-small font-semibold text-text-2">{C.ghostTitle}</p>
              <div className="pointer-events-none select-none opacity-45 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
                <KpiRow set={workspaceKpis("7d")} goal="workspace" range="7d" className="xl:grid-cols-2" />
              </div>
            </div>
            <HealthTeaserCard connected={false} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-body-lg text-text" aria-live="polite">
                {fill(winner ? D.summary : D.summaryNoWinner, {
                  range: RANGE_IN[range],
                  results: <strong className="font-bold">{plural(set.current.results, RESULTS_FORMS)}</strong>,
                  delta: deltaText,
                  hook: winner ? winner.hookText : "",
                })}
              </p>
              <div className="flex items-center gap-2 text-micro font-normal text-muted">
                <span>{refreshed ? D.refreshed : fmt(D.freshness, { n: lead.updatedMinutesAgo })}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={refreshed}
                  title={refreshed ? D.refreshLimit : undefined}
                  onClick={() => {
                    setRefreshed(true);
                    toast.success(D.refreshed);
                  }}
                >
                  <RefreshCw aria-hidden />
                  {D.refresh}
                </Button>
              </div>
            </div>
            <KpiRow set={set} goal="workspace" range={range} />
            <p className="text-micro font-normal text-muted">
              {RANGE_LABEL[range]} · {D.restatement}
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-sm bg-violet/10 px-3 py-2.5 text-small text-text">
            <Vote className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
            {D.election}
          </div>

          {/* mobile order: winner → list → cap → health; desktop: list beside a side column */}
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-8 lg:gap-y-4">
            {winner && <WinnerCard campaign={lead} winner={winner} className="lg:col-start-2 lg:row-start-1" />}
            <div className="lg:col-start-1 lg:row-span-3 lg:row-start-1">
              <CampaignList items={campaigns} />
            </div>
            <div className="rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5 lg:col-start-2 lg:row-start-2">
              <SpendCapMeter usedIls={monthSpendIls()} capIls={SAMPLE_BUSINESS.plan.monthlyCapIls} planName={SAMPLE_BUSINESS.plan.nameHe} userCapIls={SAMPLE_BUSINESS.userMonthlyCapIls} />
            </div>
            <HealthTeaserCard className="lg:col-start-2 lg:row-start-3" />
          </div>
        </>
      )}
    </div>
  );
}
