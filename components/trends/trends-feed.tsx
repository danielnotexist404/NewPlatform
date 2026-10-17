"use client";
import * as React from "react";
import { Camera, Megaphone, Wand } from "lucide-react";
import { TrendCard } from "./trend-card";
import { NichePicker, type NicheOption } from "./niche-picker";
import { useStoredNiche } from "./use-feed-niche";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { TRENDS_FEED } from "@/content/he/trends-app";
import { fitsNiche, supportsAi, supportsGuided, TREND_TEMPLATES, type TrendTemplate } from "@/lib/mock/trends-app";

type Filter = "all" | "ai" | "guided" | "adSafe";

const STAGE_ORDER = { new_this_week: 0, peak: 1, ending_soon: 2, classic: 3 } as const;

function applyFilter(list: TrendTemplate[], f: Filter) {
  switch (f) {
    case "ai": return list.filter(supportsAi);
    case "guided": return list.filter(supportsGuided);
    case "adSafe": return list.filter((t) => t.adSafety !== "organic_only");
    default: return list;
  }
}

export function TrendsFeed({ niches, workspaceNiche }: { niches: NicheOption[]; workspaceNiche: string }) {
  const valid = React.useCallback((slug: string) => niches.some((n) => n.slug === slug), [niches]);
  const [niche, setNiche] = useStoredNiche(workspaceNiche, valid);
  const [filter, setFilter] = React.useState<Filter>("all");
  const current = niches.find((n) => n.slug === niche);

  const { hot, classics, more } = React.useMemo(() => {
    const format = TREND_TEMPLATES.filter((t) => t.lifecycle !== "evergreen").sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]);
    const evergreen = TREND_TEMPLATES.filter((t) => t.lifecycle === "evergreen");
    // Niche-specific adaptations first, then templates that fit any business.
    const byAdaptation = (a: TrendTemplate, b: TrendTemplate) =>
      Number(b.nicheAdaptations.some((x) => x.nicheSlug === niche)) - Number(a.nicheAdaptations.some((x) => x.nicheSlug === niche));
    return {
      hot: applyFilter(format.filter((t) => fitsNiche(t, niche)), filter),
      classics: applyFilter(evergreen.filter((t) => fitsNiche(t, niche)).sort(byAdaptation), filter),
      more: applyFilter([...format, ...evergreen].filter((t) => !fitsNiche(t, niche)), filter),
    };
  }, [niche, filter]);

  const empty = hot.length + classics.length + more.length === 0;
  const fitCopy = current ? TRENDS_FEED.sections.fit(current.shortHe) : TRENDS_FEED.sections.fitGeneric;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:flex-row md:items-end md:justify-between md:p-5">
        <NichePicker
          options={niches}
          value={niche}
          onChange={setNiche}
          workspaceSlug={workspaceNiche}
          label={TRENDS_FEED.nicheLabel}
          searchLabel={TRENDS_FEED.nicheSearch}
          emptyLabel={TRENDS_FEED.nicheEmpty}
          workspaceLabel={TRENDS_FEED.nicheWorkspace}
        />
        <div className="flex flex-col gap-1.5">
          <span id="trend-filter-label" className="text-micro text-muted">{TRENDS_FEED.filtersLabel}</span>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(v) => v && setFilter(v as Filter)}
              aria-labelledby="trend-filter-label"
              className="w-max"
            >
              <ToggleGroupItem value="all">{TRENDS_FEED.filters.all}</ToggleGroupItem>
              <ToggleGroupItem value="ai" className="inline-flex items-center gap-1.5"><Wand aria-hidden className="size-4" />{TRENDS_FEED.filters.ai}</ToggleGroupItem>
              <ToggleGroupItem value="guided" className="inline-flex items-center gap-1.5"><Camera aria-hidden className="size-4" />{TRENDS_FEED.filters.guided}</ToggleGroupItem>
              <ToggleGroupItem value="adSafe" className="inline-flex items-center gap-1.5"><Megaphone aria-hidden className="size-4" />{TRENDS_FEED.filters.adSafe}</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{`${hot.length + classics.length + more.length} טרנדים`}</p>

      {empty && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-h3">{TRENDS_FEED.empty.title}</p>
          <p className="text-text-2">{TRENDS_FEED.empty.body}</p>
          <Button variant="secondary" onClick={() => setFilter("all")}>{TRENDS_FEED.empty.clear}</Button>
        </div>
      )}

      {hot.length > 0 && (
        <FeedSection id="hot" title={TRENDS_FEED.sections.week.title} sub={TRENDS_FEED.sections.week.sub} accent>
          <div className="grid gap-4 xl:grid-cols-2">
            {hot.map((t) => (
              <TrendCard key={t.slug} trend={t} nicheSlug={niche} nicheIcon={current?.icon} featured />
            ))}
          </div>
        </FeedSection>
      )}

      {classics.length > 0 && (
        <FeedSection id="classics" title={fitCopy.title} sub={fitCopy.sub}>
          <div className="grid gap-4 xl:grid-cols-2">
            {classics.map((t) => (
              <TrendCard key={t.slug} trend={t} nicheSlug={niche} nicheIcon={current?.icon} />
            ))}
          </div>
        </FeedSection>
      )}

      {more.length > 0 && (
        <FeedSection id="more" title={TRENDS_FEED.sections.more.title} sub={TRENDS_FEED.sections.more.sub}>
          <div className="grid gap-4 xl:grid-cols-2">
            {more.map((t) => (
              <TrendCard key={t.slug} trend={t} nicheSlug={niche} nicheIcon={current?.icon} />
            ))}
          </div>
        </FeedSection>
      )}
    </div>
  );
}

function FeedSection({ id, title, sub, accent, children }: { id: string; title: string; sub: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`feed-${id}`} className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id={`feed-${id}`} className="flex items-center gap-2 text-h3">
            {accent && <span aria-hidden className="size-2 animate-pulse-dot rounded-full bg-rose" />}
            {title}
          </h2>
          <p className="mt-1 text-small text-text-2">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
