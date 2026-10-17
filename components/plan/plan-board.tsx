"use client";
import * as React from "react";
import Link from "next/link";
import { CalendarRange, Check, Clapperboard, Flame, Megaphone, MoreHorizontal, RefreshCw, Send, ShieldCheck, Undo2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { daysBetween } from "@/lib/mock/campaigns";
import { monthlyPlan as MP, type PlanItem, type PlanItemKind, type PlanItemStatus } from "@/lib/mock/publish";
import { planCopy as PL, sample } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote, SectionTitle } from "@/components/campaigns/page-header";
import { dateDayMonth, fill, fmt, weekday } from "@/components/campaigns/text";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<PlanItemKind, React.ComponentType<{ className?: string }>> = {
  video: Clapperboard,
  trend: Flame,
  campaign: Megaphone,
  post: Send,
};
const KIND_TONE: Record<PlanItemKind, string> = {
  video: "bg-primary/12 text-primary-text",
  trend: "bg-rose/15 text-rose",
  campaign: "bg-violet/15 text-violet",
  post: "bg-success/15 text-success",
};
const STATUS_TONE: Record<PlanItemStatus, string> = {
  planned: "bg-surface-3 text-text-2",
  in_progress: "bg-primary/12 text-primary-text",
  done: "bg-success/15 text-success",
  skipped: "bg-surface-3 text-muted line-through",
};

type Filter = keyof typeof PL.filters;

export function PlanBoard() {
  const [items, setItems] = React.useState<PlanItem[]>(MP.items);
  const [filter, setFilter] = React.useState<Filter>("all");
  const done = items.filter((i) => i.status === "done").length;
  const nextId = items.find((i) => i.status === "planned" || i.status === "in_progress")?.id;
  const shown = items.filter((i) => (filter === "all" ? true : filter === "done" ? i.status === "done" : i.status !== "done" && i.status !== "skipped"));
  const weeks = new Map<number, PlanItem[]>();
  for (const it of shown) {
    const w = Math.floor(daysBetween(MP.from, it.plannedFor) / 7) + 1;
    weeks.set(w, [...(weeks.get(w) ?? []), it]);
  }

  function setStatus(id: string, status: PlanItemStatus) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
    if (status === "skipped") toast.success(PL.skippedToast);
    if (status === "done") toast.success(PL.doneToast);
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <SampleNote text={sample.plan} />
      <PageHeader
        eyebrow={PL.eyebrow}
        eyebrowIcon={CalendarRange}
        title={PL.title}
        sub={PL.sub}
        actions={
          <Button variant="secondary" onClick={() => toast(PL.regenerateToast, { description: PL.regenerateNote })}>
            <RefreshCw aria-hidden />
            {PL.regenerate}
          </Button>
        }
      />

      <section className="relative overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6" aria-labelledby="plan-range">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector opacity-80" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 id="plan-range" className="text-h3">{fmt(PL.range, { from: dateDayMonth(MP.from), to: dateDayMonth(MP.to) })}</h2>
            <dl className="flex flex-wrap gap-2">
              {[
                [PL.inputs.niche, MP.inputs.niche],
                [PL.inputs.goal, MP.inputs.goal],
                [PL.inputs.area, MP.inputs.area],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-small">
                  <dt className="text-muted">{k}:</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-small">
                <dt className="text-muted">{PL.inputs.budget}:</dt>
                <dd className="font-semibold">{fill(PL.perMonth, { amount: <Price ils={MP.inputs.monthlyBudgetIls} /> })}</dd>
              </div>
            </dl>
          </div>
          <div className="flex min-w-56 flex-col gap-2">
            <p className="text-small font-semibold">{fmt(PL.progress, { done, total: items.length })}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={done} aria-label={fmt(PL.progress, { done, total: items.length })}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(done / items.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="plan-campaigns" className="flex flex-col gap-4">
        <SectionTitle id="plan-campaigns" title={PL.campaignsTitle} />
        <div className="grid gap-3 md:grid-cols-2">
          {MP.campaignSuggestions.map((c) => (
            <article key={c.id} className="flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet"><Megaphone className="size-5" aria-hidden /></span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-body-lg font-bold">{c.title}</h3>
                  <p className="text-small text-text-2">{c.why}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <p className="flex flex-wrap gap-x-3 text-micro font-normal text-text-2">
                  <span>{c.goalHe}</span>
                  <span>{fill(PL.budgetRec, { amount: <Price ils={c.dailyBudgetIls} className="font-semibold text-text" /> })}</span>
                  <span>{fmt(PL.startsOn, { date: dateDayMonth(c.start) })}</span>
                </p>
                <Button asChild size="sm">
                  <Link href={c.href}>
                    <Wand2 aria-hidden />
                    {PL.create}
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="plan-items" className="flex flex-col gap-4">
        <SectionTitle
          id="plan-items"
          title={PL.itemsTitle}
          action={
            <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label={PL.itemsTitle} className="rounded-full">
              {(Object.keys(PL.filters) as Filter[]).map((f) => (
                <ToggleGroupItem key={f} value={f} className="rounded-full">{PL.filters[f]}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          }
        />
        <div className="flex flex-col gap-6">
          {[...weeks.entries()].map(([w, list]) => (
            <div key={w} className="flex flex-col gap-2">
              <h3 className="text-micro text-text-2">{fmt(PL.week, { n: w })}</h3>
              <ol className="flex flex-col gap-2">
                {list.map((it) => (
                  <PlanRow key={it.id} item={it} next={it.id === nextId} onStatus={(s) => setStatus(it.id, s)} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-md border border-dashed border-border-strong p-4 text-small text-text-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{PL.guard}</p>
          <p className="ps-6">{PL.caveat}</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/app/publish">
            {PL.toCalendar}
            <DirIcon name="forward" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function PlanRow({ item: it, onStatus, next }: { item: PlanItem; onStatus: (s: PlanItemStatus) => void; next: boolean }) {
  const Icon = KIND_ICON[it.kind];
  const closed = it.status === "done" || it.status === "skipped";
  return (
    <li className={cn("flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:flex-row sm:items-center", closed && "opacity-75")}>
      <div className="flex shrink-0 flex-row items-baseline gap-2 sm:w-28 sm:flex-col sm:gap-0">
        <span className="text-micro font-normal text-muted">{weekday(it.plannedFor)}</span>
        <span className="whitespace-nowrap text-body font-bold">{dateDayMonth(it.plannedFor)}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro", KIND_TONE[it.kind])}>
            <Icon className="size-3.5" aria-hidden />
            {PL.kind[it.kind]}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-micro", STATUS_TONE[it.status])}>{PL.status[it.status]}</span>
        </div>
        <p className={cn("font-bold", it.status === "skipped" && "line-through")}>{it.title}</p>
        <p className="text-small text-text-2">{it.why}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {it.status === "skipped" ? (
          <Button variant="ghost" size="sm" onClick={() => onStatus("planned")}>
            <Undo2 aria-hidden />
            {PL.undoSkip}
          </Button>
        ) : (
          <Button asChild size="sm" variant={next ? "primary" : "secondary"}>
            <Link href={it.href}>
              {it.status === "done" ? PL.open : PL.create}
              <DirIcon name="forward" />
            </Link>
          </Button>
        )}
        {!closed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`${PL.markDone} · ${PL.skip}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onStatus("done")}>
                <Check aria-hidden />
                {PL.markDone}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onStatus("skipped")}>
                <Undo2 aria-hidden />
                {PL.skip}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </li>
  );
}
