"use client";
import * as React from "react";
import Link from "next/link";
import { CalendarDays, CircleCheck, Copy, Hourglass, MapPin, MoreHorizontal, Pause, Play, RefreshCw, Square, Trophy, Users, Wallet, XOctagon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import {
  campaignKpis,
  MOCK_NOW,
  variantMetrics,
  winnerOf,
  type Campaign,
  type CampaignStatus,
  type ChangeLogEntry,
  type HookVariant,
  type InsightAction,
  type RangeKey,
  type RuleKind,
} from "@/lib/mock/campaigns";
import {
  dashboard as DB,
  detail as D,
  GOAL_COPY,
  HOOK_KEY_HE,
  RANGE_IN,
  REVIEW_ACTION_LABEL,
  REVIEW_FEEDBACK_FALLBACK,
  REVIEW_FEEDBACK_HE,
  sample,
} from "@/content/he/campaigns-app";
import { CampaignStatusBadge } from "../status-badge";
import { KpiRow } from "../kpi-row";
import { PageHeader, SampleNote, SectionTitle } from "../page-header";
import { RangePicker, useStoredRange } from "../range-picker";
import { CampaignStatusTimeline, type TimelineStep } from "../status-timeline";
import { dateDayMonth, dateLong, fill, fmt, formatIls, Pct, plural, timeOf } from "../text";
import { DailyChart } from "./daily-chart";
import { HookComparisonTable } from "./hook-comparison-table";
import { AutoRules, BoostDialog, BudgetDialog, ChangeLog, InsightCard, NoticeCard } from "./panels";

const RANGES: readonly RangeKey[] = ["7d", "14d", "30d", "all"] as const;

export function CampaignDetail({ campaign: c }: { campaign: Campaign }) {
  const initialRange: RangeKey = c.status === "active" ? "7d" : "all";
  const [range, setRange] = useStoredRange<RangeKey>(initialRange, RANGES);
  const [status, setStatus] = React.useState<CampaignStatus>(c.status);
  const [budget, setBudget] = React.useState(c.dailyBudgetIls);
  const [changes, setChanges] = React.useState(c.budgetChangesLastHour);
  const [log, setLog] = React.useState<ChangeLogEntry[]>(c.changeLog);
  const [rules, setRules] = React.useState(c.rules);
  const [adStatus, setAdStatus] = React.useState<Record<string, HookVariant["status"]>>(() => Object.fromEntries(c.variants.map((v) => [v.key, v.status])));
  const [boosted, setBoosted] = React.useState(false);
  const [budgetOpen, setBudgetOpen] = React.useState(false);
  const [budgetInitial, setBudgetInitial] = React.useState<number | undefined>();
  const [boostOpen, setBoostOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);
  const [refreshed, setRefreshed] = React.useState(false);

  const effRange: RangeKey = c.daily.length === 0 ? "all" : range;
  const set = React.useMemo(() => campaignKpis(c, effRange), [c, effRange]);
  const winner = winnerOf(c);
  const goal = GOAL_COPY[c.goal];
  const lead = c.variants.find((v) => v.status !== "rejected") ?? c.variants[0];

  function addLog(text: string, source: ChangeLogEntry["source"] = "user") {
    setLog((l) => [{ at: MOCK_NOW, who: D.logText.owner, source, text }, ...l]);
  }

  function pause() {
    setStatus("paused");
    addLog(D.logText.paused);
    toast.success(D.pausedToast);
  }
  function resume() {
    setStatus("active");
    addLog(D.logText.resumed);
    toast.success(D.resumedToast);
  }
  function saveBudget(v: number) {
    const from = budget;
    setBudget(v);
    setChanges((n) => n + 1);
    setBudgetOpen(false);
    addLog(fmt(D.logText.budget, { from: formatIls(from), to: formatIls(v) }));
    toast.success(fmt(D.budgetDialog.toast, { amount: formatIls(v) }));
  }
  function boost(raise: 0 | 10 | 20) {
    if (!winner) return;
    setAdStatus((s) => Object.fromEntries(Object.keys(s).map((k) => [k, k === winner.key ? "active" : "paused"])));
    setBoosted(true);
    setBoostOpen(false);
    if (raise && changes < 3) {
      const nb = Math.round(budget * (1 + raise / 100));
      setBudget(nb);
      setChanges((n) => n + 1);
      addLog(fmt(D.logText.budget, { from: formatIls(budget), to: formatIls(nb) }));
    }
    addLog(fmt(D.logText.boost, { key: HOOK_KEY_HE[winner.key] }));
    toast.success(fmt(D.boost.toast, { key: HOOK_KEY_HE[winner.key] }));
  }
  function endCampaign() {
    setStatus("completed");
    setEndOpen(false);
    addLog(D.logText.ended);
    toast.success(D.endedToast);
  }
  function toggleRule(k: RuleKind, on: boolean) {
    setRules((r) => ({ ...r, [k]: on }));
    addLog(fmt(on ? D.logText.ruleOn : D.logText.ruleOff, { name: D.rules.items[k].name }));
    toast.success(fmt(on ? D.rules.onToast : D.rules.offToast, { name: D.rules.items[k].name }));
  }

  /* timeline */
  const t = c.timeline;
  const timeline: TimelineStep[] =
    status === "rejected"
      ? [
          { label: D.timeline.created, meta: t.created && dateDayMonth(t.created), state: "done" },
          { label: D.timeline.submitted, meta: t.submitted && dateDayMonth(t.submitted), state: "done" },
          { label: D.timeline.rejected, meta: t.rejected && dateDayMonth(t.rejected), state: "failed" },
          { label: D.timeline.active, state: "todo" },
        ]
      : [
          { label: D.timeline.created, meta: t.created && dateDayMonth(t.created), state: "done" },
          { label: D.timeline.submitted, meta: t.submitted && `${dateDayMonth(t.submitted)}, ${timeOf(t.submitted)}`, state: t.approved ? "done" : "current" },
          { label: D.timeline.approved, meta: t.approved && dateDayMonth(t.approved), state: t.approved ? "done" : "todo" },
          status === "paused"
            ? { label: D.timeline.paused, meta: t.paused ? dateDayMonth(t.paused) : undefined, state: "current" }
            : status === "completed"
              ? { label: D.timeline.ended, meta: t.ended ? dateDayMonth(t.ended) : undefined, state: "done" }
              : { label: D.timeline.active, meta: t.active && dateDayMonth(t.active), state: t.active ? "current" : "todo" },
        ];

  /* insight sentences (deterministic fallback, numbers come from the KPIs above) */
  const cur = set.current;
  const cpr = cur.results ? Math.round((cur.spendIls / cur.results) * 100) / 100 : null;
  const sentences: React.ReactNode[] = [];
  if (status === "rejected") sentences.push(D.insight.sRejected);
  else if (status === "in_review" || cur.spendIls === 0) sentences.push(D.insight.sEarly);
  else {
    if (c.goal === "local_awareness") {
      sentences.push(fill(D.insight.s1Spend, { range: RANGE_IN[effRange], spend: <strong><Price ils={Math.round(cur.spendIls)} /></strong> }));
      sentences.push(fill(D.insight.sAwareness, { reach: <strong>{plural(cur.reach, D.peopleForms)}</strong>, cpm: <Price ils={Math.round((cur.spendIls / cur.reach) * 1000 * 100) / 100} decimals /> }));
    } else {
      sentences.push(
        cpr
          ? fill(D.insight.s1, { range: RANGE_IN[effRange], spend: <strong><Price ils={Math.round(cur.spendIls)} /></strong>, results: <strong>{plural(cur.results, D.resultForms[c.goal])}</strong>, cpr: <Price ils={cpr} decimals /> })
          : fill(D.insight.s1NoResults, { range: RANGE_IN[effRange], spend: <Price ils={Math.round(cur.spendIls)} /> }),
      );
    }
    if (status === "paused") sentences.push(D.insight.s2Paused);
    if (winner) {
      sentences.push(fill(D.insight.s2Winner, { hook: winner.hookText, rate: <strong><Pct value={winner.hookRate * 100} /></strong> }));
      if (status === "active" && !boosted) sentences.push(D.insight.s3Winner);
    }
  }
  const actions = c.insightActions.filter((a) => !(a === "boost_winner" && (boosted || status !== "active")));

  function hrefFor(a: InsightAction): string | null {
    switch (a) {
      case "reply_to_whatsapp_fast":
        return "/app/leads";
      case "check_lead_form":
        return "/app/settings/integrations";
      case "new_variants_from_winner":
        return `/app/create?hook=${(winner ?? lead).hookId}`;
      case "fix_rejected_ad":
        return `/app/campaigns/new?duplicate=${c.id}`;
      default:
        return null;
    }
  }
  function onAction(a: InsightAction) {
    if (a === "boost_winner") setBoostOpen(true);
    if (a === "raise_budget_20") {
      setBudgetInitial(Math.round(budget * 1.2));
      setBudgetOpen(true);
    }
    if (a === "extend_end_date") setBudgetOpen(true);
  }

  const canPause = status === "active";
  const canResume = status === "paused";
  const others = winner ? c.variants.filter((v) => v.key !== winner.key).map((v) => variantMetrics(c, v)) : [];
  const otherRes = others.reduce((a, m) => a + m.results, 0);
  const otherCpr = otherRes ? Math.round((others.reduce((a, m) => a + m.spendIls, 0) / otherRes) * 100) / 100 : null;
  const winnerCpr = winner ? variantMetrics(c, winner).costPerResult : null;
  const fb = c.variants.find((v) => v.reviewFeedback)?.reviewFeedback;

  const headerActions = (
    <>
      {canPause && (
        <Button variant="secondary" onClick={pause}>
          <Pause aria-hidden />
          {D.pause}
        </Button>
      )}
      {canResume && (
        <Button onClick={resume}>
          <Play aria-hidden style={{ transform: "none" }} />
          {D.resume}
        </Button>
      )}
      {(canPause || canResume) && (
        <Button variant="secondary" onClick={() => { setBudgetInitial(undefined); setBudgetOpen(true); }}>
          <Wallet aria-hidden />
          {D.budget}
        </Button>
      )}
      {(status === "rejected" || status === "completed") && (
        <Button asChild>
          <Link href={`/app/campaigns/new?duplicate=${c.id}`}>
            <Copy aria-hidden />
            {status === "rejected" ? D.duplicateNewText : D.duplicate}
          </Link>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={D.more}>
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => toast.success(D.duplicatedToast)}>
            <Copy aria-hidden />
            {D.duplicate}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/app/campaigns/new?duplicate=${c.id}`}>
              <RefreshCw aria-hidden />
              {D.duplicateNewText}
            </Link>
          </DropdownMenuItem>
          {(canPause || canResume) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem danger onSelect={() => setEndOpen(true)}>
                <Square aria-hidden />
                {D.end}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <SampleNote text={sample.campaign} />
      <PageHeader
        back={{ href: "/app/campaigns", label: D.back }}
        title={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {c.name}
            <CampaignStatusBadge status={status} />
          </span>
        }
        actions={headerActions}
      >
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small text-text-2">
          <li className="inline-flex items-center gap-1.5"><CircleCheck className="size-4" aria-hidden /><span className="sr-only">{D.meta.goal}: </span>{goal.label}</li>
          <li className="inline-flex items-center gap-1.5"><Wallet className="size-4" aria-hidden /><span className="sr-only">{D.meta.budget}: </span>{fill(DB.list.perDay, { amount: <Price ils={budget} className="font-semibold text-text" /> })}</li>
          <li className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden /><span className="sr-only">{D.meta.area}: </span>{c.geo.labelHe}</li>
          <li className="inline-flex items-center gap-1.5"><Users className="size-4" aria-hidden /><span className="sr-only">{D.meta.age}: </span>{c.advantageAudience ? fmt(D.ageAdvantage, { min: c.ageMin, max: c.ageMax }) : <bdi className="num">{c.ageMin}–{c.ageMax}</bdi>}</li>
          <li className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden /><span className="sr-only">{D.meta.dates}: </span>{dateLong(c.startDate)} – {c.endDate ? dateLong(c.endDate) : D.meta.untilStopped}</li>
        </ul>
      </PageHeader>

      <div className="rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
        <CampaignStatusTimeline steps={timeline} />
      </div>

      {status === "rejected" && fb && (
        <NoticeCard tone="danger" title={D.rejectedTitle} icon={XOctagon}>
          <p className="text-body font-semibold text-text">{REVIEW_FEEDBACK_HE[fb.key]?.title ?? fmt(REVIEW_FEEDBACK_FALLBACK, { reason: fb.metaReason })}</p>
          <div className="flex flex-col gap-1">
            <p className="text-micro text-text-2">{D.rejectedHow}</p>
            <p className="text-small text-text">{REVIEW_FEEDBACK_HE[fb.key]?.fix}</p>
          </div>
          <p className="text-micro font-normal text-muted">
            {D.metaSaid}: <bdi dir="ltr" className="font-mono">{fb.metaReason}</bdi>
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {REVIEW_FEEDBACK_HE[fb.key]?.action !== "none" && (
              <Button asChild size="sm">
                <Link href={`/app/campaigns/new?duplicate=${c.id}`}>{REVIEW_ACTION_LABEL[REVIEW_FEEDBACK_HE[fb.key].action]}</Link>
              </Button>
            )}
            <Button asChild size="sm" variant="secondary">
              <Link href={`/app/publish/new?project=${lead.hookId}`}>{D.publishAsPost}</Link>
            </Button>
          </div>
        </NoticeCard>
      )}
      {status === "in_review" && (
        <NoticeCard tone="waiting" title={D.inReviewTitle} icon={Hourglass}>
          <p className="text-small text-text-2">{D.inReviewBody}</p>
        </NoticeCard>
      )}
      {status === "paused" && (
        <NoticeCard tone="neutral" title={D.pausedTitle} icon={Pause}>
          <p className="text-small text-text-2">{fmt(D.pausedBody, { date: dateLong(t.paused ?? MOCK_NOW) })}</p>
        </NoticeCard>
      )}
      {status === "completed" && (
        <NoticeCard tone="neutral" title={D.completedTitle} icon={CircleCheck}>
          <p className="text-small text-text-2">{fmt(D.completedBody, { date: dateLong(c.lastDeliveryDate ?? c.endDate ?? MOCK_NOW) })}</p>
        </NoticeCard>
      )}

      {c.daily.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <RangePicker value={effRange} onChange={setRange} options={RANGES} label={DB.rangeLabel} />
            <div className="flex items-center gap-2 text-micro font-normal text-muted">
              <span>{refreshed ? DB.refreshed : fmt(DB.freshness, { n: c.updatedMinutesAgo })}</span>
              <Button variant="ghost" size="sm" disabled={refreshed} onClick={() => { setRefreshed(true); toast.success(DB.refreshed); }}>
                <RefreshCw aria-hidden />
                {DB.refresh}
              </Button>
            </div>
          </div>
          <KpiRow set={set} goal={c.goal} range={effRange} />
        </div>
      )}

      <div className={c.daily.length > 0 ? "grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]" : "grid gap-6"}>
        <InsightCard sentences={sentences} actions={actions} onAction={onAction} hrefFor={hrefFor} />
        {c.daily.length > 0 && (
          <section aria-labelledby="chart-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
              <SectionTitle id="chart-title" title={D.chart.title} />
              <DailyChart data={set.series} resultLabel={goal.resultPerDay} />
              <p className="text-micro font-normal text-muted">{DB.restatement}</p>
            </section>
          )}
      </div>

      <section aria-labelledby="hooks-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5" id="boost">
        <SectionTitle id="hooks-title" title={D.hooks.title} sub={D.hooks.sub} />
        {winner && status === "active" && !boosted && (
          <div className="flex flex-col gap-3 rounded-sm bg-primary/8 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 size-5 shrink-0 text-primary-text" aria-hidden />
              <div>
                <p className="font-bold">{D.boost.title}</p>
                <p className="text-small text-text-2">
                  {fill(D.boost.body, {
                    key: HOOK_KEY_HE[winner.key],
                    cpr: <Price ils={winnerCpr ?? 0} decimals className="font-bold text-text" />,
                    other: otherCpr ? <Price ils={otherCpr} decimals /> : "—",
                  })}
                </p>
              </div>
            </div>
            <Button onClick={() => setBoostOpen(true)} className="shrink-0 glow-primary">
              {D.boost.cta}
            </Button>
          </div>
        )}
        {winner && boosted && (
          <div className="flex flex-col gap-3 rounded-sm bg-success/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-small"><CircleCheck className="size-4 shrink-0 text-success" aria-hidden />{fmt(D.boost.done, { key: HOOK_KEY_HE[winner.key] })}</p>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/app/create?hook=${winner.hookId}`}>{D.boost.moreVariants}<DirIcon name="forward" /></Link>
            </Button>
          </div>
        )}
        <HookComparisonTable campaign={c} statuses={adStatus} winner={winner} />
      </section>


      <div className="grid items-start gap-6 lg:grid-cols-2">
        <AutoRules rules={rules} onChange={toggleRule} />
        <ChangeLog entries={log} />
      </div>

      <BudgetDialog open={budgetOpen} onOpenChange={setBudgetOpen} current={budget} changesLeft={Math.max(0, 3 - changes)} initial={budgetInitial} onSave={saveBudget} />
      {winner && <BoostDialog open={boostOpen} onOpenChange={setBoostOpen} winner={winner} onConfirm={boost} />}
      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent>
          <DialogTitle>{D.endConfirmTitle}</DialogTitle>
          <DialogDescription>{D.endConfirmBody}</DialogDescription>
          <div className="mt-5 flex gap-2">
            <Button variant="destructive" onClick={endCampaign}>{D.endConfirm}</Button>
            <Button variant="ghost" onClick={() => setEndOpen(false)}>{D.cancel}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
