"use client";
import * as React from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { campaignKpis, type Campaign, type CampaignStatus } from "@/lib/mock/campaigns";
import { GOAL_COPY, dashboard as D } from "@/content/he/campaigns-app";
import { CampaignStatusBadge } from "./status-badge";
import { VideoThumb } from "./video-thumb";
import { fill, plural } from "./text";
import { cn } from "@/lib/utils";

type Filter = keyof typeof D.list.filters;
const FILTERS: Record<Filter, CampaignStatus[] | null> = {
  all: null,
  active: ["active", "with_issues"],
  review: ["in_review", "preparing", "ready", "draft", "rejected"],
  paused: ["paused"],
  done: ["completed", "archived"],
};

const nf = new Intl.NumberFormat("he-IL");

export function CampaignList({ items }: { items: Campaign[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const shown = items.filter((c) => !FILTERS[filter] || FILTERS[filter]!.includes(c.status));
  return (
    <section aria-labelledby="campaigns-list-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="campaigns-list-title" className="text-h3">{D.list.title}</h2>
        <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label="סינון קמפיינים" className="max-w-full overflow-x-auto rounded-full [scrollbar-width:none]">
          {(Object.keys(D.list.filters) as Filter[]).map((f) => (
            <ToggleGroupItem key={f} value={f} className="shrink-0 rounded-full">
              {D.list.filters[f]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border-strong p-10 text-center text-text-2">
          <Megaphone className="size-6" aria-hidden />
          {D.list.empty}
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {shown.map((c) => (
            <li key={c.id}>
              <CampaignRow c={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CampaignRow({ c }: { c: Campaign }) {
  const t = campaignKpis(c, "all").current;
  const awareness = c.goal === "local_awareness";
  const cpr = awareness ? (t.reach ? (t.spendIls / t.reach) * 1000 : null) : t.results ? t.spendIls / t.results : null;
  const lead = c.variants.find((v) => v.status !== "rejected") ?? c.variants[0];
  return (
    <Link
      href={`/app/campaigns/${c.id}`}
      className="group flex items-center gap-3 rounded-lg bg-surface-1 p-3 elev-1 ring-hairline transition-shadow hover:elev-2 md:gap-5 md:p-4"
    >
      <VideoThumb size="sm" tone={lead.tone} className="w-12 md:w-14" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-bold text-text">{c.name}</p>
            <CampaignStatusBadge status={c.status} size="sm" />
          </div>
          <p className="truncate text-micro font-normal text-text-2">
            {GOAL_COPY[c.goal].label} · {fill(D.list.perDay, { amount: <Price ils={c.dailyBudgetIls} /> })} · {plural(c.variants.length, D.list.hooks)}
          </p>
        </div>
        <dl className="grid shrink-0 grid-cols-3 gap-x-4 text-micro md:w-[300px]">
          <div>
            <dt className="font-normal text-muted">{D.list.spend}</dt>
            <dd className="text-small font-bold text-text">{t.spendIls ? <Price ils={Math.round(t.spendIls)} /> : "—"}</dd>
          </div>
          <div>
            <dt className="font-normal text-muted">{awareness ? D.list.views : D.list.results}</dt>
            <dd className="text-small font-bold text-text">{t.results ? <bdi className="num">{nf.format(t.results)}</bdi> : "—"}</dd>
          </div>
          <div>
            <dt className="font-normal text-muted">{awareness ? D.list.perThousand : D.list.perResult}</dt>
            <dd className="text-small font-bold text-text">{cpr ? <Price ils={Math.round(cpr * 100) / 100} decimals /> : "—"}</dd>
          </div>
        </dl>
      </div>
      <span className={cn("hidden size-8 shrink-0 items-center justify-center rounded-full text-text-2 transition-colors group-hover:bg-surface-3 group-hover:text-text sm:flex")} aria-hidden>
        <DirIcon name="next" className="size-4" />
      </span>
      <span className="sr-only">{D.list.open}</span>
    </Link>
  );
}
