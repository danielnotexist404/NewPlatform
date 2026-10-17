"use client";
import * as React from "react";
import Link from "next/link";
import { CalendarCheck2, CalendarDays, Megaphone, MoonStar, Sparkles, Vote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { DirIcon } from "@/components/a11y/dir-icon";
import { getSeason } from "@/lib/data/seed";
import { addDays, daysBetween, MOCK_TODAY } from "@/lib/mock/campaigns";
import {
  calendarSeasons,
  campaignFlights,
  CALENDAR_FIRST_MONTH,
  CALENDAR_MONTHS,
  getVideo,
  monthlyPlan,
  socialPosts,
  type SocialPost,
} from "@/lib/mock/publish";
import { publishCopy as P, planCopy as PL } from "@/content/he/campaigns-app";
import { dateDayMonth, fmt, timeOf, weekday } from "@/components/campaigns/text";
import { cn } from "@/lib/utils";

type View = "month" | "week";
const VIEW_KEY = "publish.calendar.view"; // allowed key (Part 03 §1)

type CalItem =
  | { kind: "post"; id: string; label: string; time: string; status: SocialPost["status"]; platform: SocialPost["platform"] }
  | { kind: "plan"; id: string; label: string; href: string }
  | { kind: "suggestion"; id: string; label: string }
  | { kind: "campaign"; id: string; label: string; start: boolean }
  | { kind: "season"; id: string; label: string; quiet?: boolean; election?: boolean; approx?: boolean; start: boolean };

const monthLabel = new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric", timeZone: "UTC" });

function monthStart(i: number) {
  const [y, m] = CALENDAR_FIRST_MONTH.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + i, 1));
  return d.toISOString().slice(0, 10);
}
function daysInMonth(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}
function dow(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
}

const SUGGESTION_TITLES = ["רילס: טיפ קצר מהכיסא", "לפני ואחרי של השבוע", "שאלה מהלקוחות", "יום בחיים במספרה", "המחירון בשנייה", "הוק מהספרייה", "טרנד השבוע", "סיכום שבוע"];

export function ContentCalendar() {
  const [view, setView] = React.useState<View>("month");
  const [monthIdx, setMonthIdx] = React.useState(0);
  const [weekStart, setWeekStart] = React.useState(() => addDays(MOCK_TODAY, -dow(MOCK_TODAY)));
  const [selected, setSelected] = React.useState<string>(MOCK_TODAY);
  const [suggested, setSuggested] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the remembered view after mount
      if (v === "week" || v === "month") setView(v);
    } catch {
      /* storage blocked */
    }
  }, []);
  function changeView(v: View) {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* storage blocked */
    }
  }

  const itemsFor = React.useCallback(
    (date: string): CalItem[] => {
      const out: CalItem[] = [];
      for (const s of calendarSeasons) {
        if (date >= s.start && date <= s.end) {
          const name = getSeason(s.slug)?.name_he ?? s.slug;
          out.push({ kind: "season", id: s.slug, label: name, quiet: s.quiet, election: s.election, approx: s.approx, start: date === s.start });
        }
      }
      for (const c of campaignFlights) {
        if (date >= c.start && date <= c.end) out.push({ kind: "campaign", id: c.id, label: c.name, start: date === c.start });
      }
      for (const p of socialPosts) {
        if (p.at.slice(0, 10) === date) {
          out.push({ kind: "post", id: p.id, label: getVideo(p.videoId)?.title ?? "", time: timeOf(p.at), status: p.status, platform: p.platform });
        }
      }
      for (const it of monthlyPlan.items) {
        if (it.plannedFor === date && it.status === "planned") out.push({ kind: "plan", id: it.id, label: it.title, href: it.href });
      }
      (suggested[date] ?? []).forEach((t, i) => out.push({ kind: "suggestion", id: `${date}-${i}`, label: t }));
      return out;
    },
    [suggested],
  );

  const start = monthStart(monthIdx);
  const monthDays = daysInMonth(start);
  const lead = dow(start);
  const monthCells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: monthDays }, (_, i) => addDays(start, i))];
  while (monthCells.length % 7) monthCells.push(null);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function planMonth() {
    const base = view === "month" ? start : weekStart;
    const span = view === "month" ? monthDays : 7;
    const next: Record<string, string[]> = { ...suggested };
    let added = 0;
    for (let i = 0; i < span && added < 8; i += Math.max(1, Math.floor(span / 8))) {
      const d = addDays(base, i);
      if (d < MOCK_TODAY) continue;
      const blocked = calendarSeasons.some((s) => s.quiet && d >= s.start && d <= s.end);
      if (blocked) continue;
      next[d] = [...(next[d] ?? []), SUGGESTION_TITLES[added % SUGGESTION_TITLES.length]];
      added++;
    }
    setSuggested(next);
    toast.success(P.calendar.planMonthToast);
  }

  const title =
    view === "month"
      ? monthLabel.format(new Date(`${start}T12:00:00Z`))
      : fmt(P.calendar.weekOf, { from: dateDayMonth(weekDays[0]), to: dateDayMonth(weekDays[6]) });
  const canPrev = view === "month" ? monthIdx > 0 : weekStart > addDays(monthStart(0), -7);
  const canNext = view === "month" ? monthIdx < CALENDAR_MONTHS - 1 : daysBetween(weekStart, monthStart(CALENDAR_MONTHS)) > 7;
  const selItems = itemsFor(selected);

  return (
    <section aria-labelledby="cal-title" className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 id="cal-title" className="text-h3">
            <span className="sr-only">{P.calendar.title}: </span>
            {title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" disabled={!canPrev} aria-label={P.calendar.prev} onClick={() => (view === "month" ? setMonthIdx((i) => i - 1) : setWeekStart((w) => addDays(w, -7)))}>
              <DirIcon name="prev" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMonthIdx(0);
                setWeekStart(addDays(MOCK_TODAY, -dow(MOCK_TODAY)));
                setSelected(MOCK_TODAY);
              }}
            >
              {P.calendar.today}
            </Button>
            <Button variant="ghost" size="icon-sm" disabled={!canNext} aria-label={P.calendar.next} onClick={() => (view === "month" ? setMonthIdx((i) => i + 1) : setWeekStart((w) => addDays(w, 7)))}>
              <DirIcon name="next" />
            </Button>
          </div>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && changeView(v as View)} aria-label={P.calendar.title} className="rounded-full">
            <ToggleGroupItem value="month" className="rounded-full">{P.calendar.month}</ToggleGroupItem>
            <ToggleGroupItem value="week" className="rounded-full">{P.calendar.week}</ToggleGroupItem>
          </ToggleGroup>
          <Button size="sm" variant="secondary" onClick={planMonth}>
            <Sparkles aria-hidden />
            {P.calendar.planMonth}
          </Button>
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-micro font-normal text-text-2" aria-label={P.calendar.legendLabel}>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-primary" />{P.calendar.legend.scheduled}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-success" />{P.calendar.legend.published}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-danger" />{P.calendar.legend.failed}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="h-1 w-3 rounded-full bg-violet" />{P.calendar.legend.campaign}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-xs border border-primary-text" />{P.calendar.legend.season}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-xs bg-[repeating-linear-gradient(45deg,var(--color-border-strong)_0_2px,transparent_2px_4px)]" />{P.calendar.legend.quiet}</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-xs border border-dashed border-text-2" />{P.calendar.legend.planned}</li>
      </ul>

      {view === "month" ? (
        <div role="grid" aria-labelledby="cal-title" className="overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <div role="row" className="grid grid-cols-7 bg-surface-2">
            {P.calendar.weekdays.map((d, i) => (
              <div role="columnheader" key={d} aria-label={P.calendar.weekdaysLong[i]} className="px-2 py-2 text-center text-micro text-text-2">{d}</div>
            ))}
          </div>
          {Array.from({ length: monthCells.length / 7 }, (_, r) => (
            <div role="row" key={r} className="grid grid-cols-7">
              {monthCells.slice(r * 7, r * 7 + 7).map((date, i) =>
                date ? (
                  <DayCell key={date} date={date} items={itemsFor(date)} selected={selected === date} onSelect={() => setSelected(date)} />
                ) : (
                  <div role="gridcell" key={`e-${r}-${i}`} className="min-h-16 border-t border-s border-border bg-bg/40 md:min-h-28" />
                ),
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-7">
          {weekDays.map((date) => {
            const items = itemsFor(date);
            const quiet = items.some((x) => x.kind === "season" && x.quiet);
            return (
              <button
                type="button"
                key={date}
                onClick={() => setSelected(date)}
                aria-pressed={selected === date}
                className={cn(
                  "flex min-h-24 flex-col gap-2 rounded-md bg-surface-2 p-3 text-start transition-colors hover:bg-surface-3 md:min-h-64",
                  selected === date && "shadow-[inset_0_0_0_2px_var(--color-primary)]",
                  quiet && "bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--color-border-strong)_25%,transparent)_0_6px,transparent_6px_12px)]",
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-micro text-text-2">{weekday(date)}</span>
                  <span className={cn("text-body font-bold num", date === MOCK_TODAY && "flex size-7 items-center justify-center rounded-full bg-primary text-on-primary")}>{Number(date.slice(8))}</span>
                </span>
                <span className="flex flex-col gap-1">
                  {items.length === 0 && <span className="text-micro font-normal text-muted">{P.calendar.nothing}</span>}
                  {items.map((it) => (
                    <Chip key={`${it.kind}-${it.id}`} item={it} full />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-md bg-surface-2 p-4" aria-live="polite">
        <h3 className="flex items-center gap-2 text-body font-bold">
          <CalendarDays className="size-4 text-text-2" aria-hidden />
          {weekday(selected)}, {dateDayMonth(selected)}
        </h3>
        {selItems.length === 0 ? (
          <p className="text-small text-text-2">{P.calendar.nothing}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selItems.map((it) => (
              <li key={`${it.kind}-${it.id}`} className="flex flex-wrap items-center justify-between gap-2">
                <Chip item={it} full />
                {it.kind === "plan" && (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={it.href}>{PL.create}<DirIcon name="forward" /></Link>
                  </Button>
                )}
                {it.kind === "campaign" && (
                  <Link href={`/app/campaigns/${it.id}`} className="text-small text-link underline-offset-4 hover:underline">{P.calendar.open}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-micro font-normal text-muted">{P.igNote}</p>
    </section>
  );
}

function DayCell({ date, items, selected, onSelect }: { date: string; items: CalItem[]; selected: boolean; onSelect: () => void }) {
  const quiet = items.some((x) => x.kind === "season" && x.quiet);
  const election = items.some((x) => x.kind === "season" && x.election);
  const inCampaign = items.some((x) => x.kind === "campaign");
  const visible = items.filter((x) => x.kind !== "campaign" || x.start).filter((x) => x.kind !== "season" || x.start || x.quiet || x.election);
  const shown = visible.slice(0, 3);
  const isToday = date === MOCK_TODAY;
  const past = date < MOCK_TODAY;
  return (
    <div role="gridcell" aria-selected={selected} className="border-t border-s border-border">
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${weekday(date)}, ${dateDayMonth(date)}${items.length ? ` · ${items.length}` : ""}`}
        className={cn(
          "relative flex size-full min-h-16 flex-col gap-1 p-1.5 text-start transition-colors hover:bg-surface-2 md:min-h-28 md:p-2",
          selected && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
          past && "opacity-70",
          quiet && "bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--color-border-strong)_25%,transparent)_0_6px,transparent_6px_12px)]",
        )}
      >
        <span className={cn("flex size-6 items-center justify-center self-start rounded-full text-micro num", isToday ? "bg-primary text-on-primary" : "text-text-2")}>{Number(date.slice(8))}</span>
        {inCampaign && <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-violet/70" />}
        {/* chips on wide screens */}
        <span className="hidden flex-col gap-1 md:flex">
          {shown.map((it) => (
            <Chip key={`${it.kind}-${it.id}`} item={it} />
          ))}
          {visible.length > 3 && <span className="text-micro font-normal text-muted">{fmt(P.calendar.more, { n: visible.length - 3 })}</span>}
        </span>
        {/* dots on phones */}
        <span aria-hidden className="mt-auto flex flex-wrap gap-0.5 md:hidden">
          {items.filter((x) => x.kind === "post").map((x) => (
            <span key={x.id} className={cn("size-1.5 rounded-full", x.kind === "post" && (x.status === "published" ? "bg-success" : x.status === "failed" ? "bg-danger" : "bg-primary"))} />
          ))}
          {items.some((x) => x.kind === "plan" || x.kind === "suggestion") && <span className="size-1.5 rounded-full border border-text-2" />}
          {(election || items.some((x) => x.kind === "season" && x.start)) && <span className="size-1.5 rounded-xs border border-primary-text" />}
        </span>
      </button>
    </div>
  );
}

function Chip({ item: it, full = false }: { item: CalItem; full?: boolean }) {
  const base = cn("flex min-w-0 items-center gap-1 rounded-xs px-1.5 py-0.5 text-micro", full ? "w-fit max-w-full" : "w-full");
  switch (it.kind) {
    case "post":
      return (
        <span className={cn(base, it.status === "published" ? "bg-success/15 text-success" : it.status === "failed" ? "bg-danger/15 text-danger" : "bg-primary/15 text-primary-text")}>
          <bdi className="num shrink-0">{it.time}</bdi>
          <span className="truncate">{full ? `${P.platform[it.platform]} · ${it.label}` : it.label}</span>
          {full && <span className="shrink-0 font-normal">· {P.status[it.status]}</span>}
        </span>
      );
    case "plan":
      return (
        <span className={cn(base, "border border-dashed border-border-strong text-text-2")}>
          <CalendarCheck2 className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{it.label}</span>
        </span>
      );
    case "suggestion":
      return (
        <span className={cn(base, "border border-dashed border-violet/60 text-violet")}>
          <Sparkles className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{P.calendar.suggested}: {it.label}</span>
        </span>
      );
    case "campaign":
      return (
        <span className={cn(base, "bg-violet/15 text-violet")}>
          <Megaphone className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{it.label}</span>
        </span>
      );
    case "season":
      if (it.quiet)
        return (
          <span className={cn(base, "bg-surface-3 text-text")}>
            <MoonStar className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{full ? `${it.label} · ${P.calendar.quiet}` : it.label}</span>
          </span>
        );
      if (it.election)
        return (
          <span className={cn(base, "bg-violet/15 text-violet")}>
            <Vote className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{full ? `${it.label} · ${P.calendar.election}` : it.label}</span>
          </span>
        );
      return (
        <span className={cn(base, "border border-primary-text/50 text-primary-text")}>
          <span className="truncate">{it.label}{full && it.approx ? ` · ${P.calendar.approx}` : ""}</span>
        </span>
      );
  }
}
