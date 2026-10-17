"use client";
import * as React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, SearchX, Sparkles, LayoutGrid } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DirIcon } from "@/components/a11y/dir-icon";
import { GENDER_LABEL, GOAL_LABEL, PLATFORM_LABEL, type HookGender, type HookGoal, type Platform } from "@/lib/labels";
import { getHookType, getNiche, getSeason, hookFamilies, nicheShortName } from "@/lib/data/seed";
import { HOOKS_COPY, QUICK_FILTERS } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import type { HookView } from "./hook-data";
import { HookCard } from "./hook-card";
import { HookFilters } from "./hook-filters";
import { HookPersonalizer } from "./hook-personalizer";
import { useGate } from "./hooks-provider";
import { generateHooksHref } from "./links";
import { replaceSearch, setSearchDraft, useLocationSearch, useSearchDraft } from "./stores";
import {
  activeCount, applyFilters, effectiveQuery, facetCounts, featuredCount, parseFilters, toParams,
  type FacetKey, type Filters,
} from "./filter-model";
import { plural } from "./text";

const F = HOOKS_COPY.filters;
const PAGE = 24;

export interface HookExplorerProps {
  hooks: HookView[];
  mode: "hub" | "niche";
  facets: FacetKey[];
  nicheSlug?: string;
  /** Placeholders that appear on the page, for "עוד שדות". */
  personalizerFields: string[];
  showNicheChip: boolean;
  location: string;
  searchPlaceholder?: string;
}

/** Shared state hook: filters from the URL, with the typed draft taking over the query while typing. */
function useFilters(): { filters: Filters; urlFilters: Filters; draft: string | null } {
  const search = useLocationSearch();
  const draft = useSearchDraft();
  const urlFilters = React.useMemo(() => parseFilters(search), [search]);
  const filters = React.useMemo(() => (draft === null ? urlFilters : { ...urlFilters, q: draft }), [urlFilters, draft]);
  return { filters, urlFilters, draft };
}

function isActive(f: Filters, fixed: FacetKey[] = []) {
  return activeCount(f, fixed) > 0 || f.all;
}

/** Hides its children (hub browse sections) while a search or filter is active (Part 02 §5.5 items 8–9). */
export function BrowseWhenIdle({ children }: { children: React.ReactNode }) {
  const { filters } = useFilters();
  return <div hidden={isActive(filters)}>{children}</div>;
}

function writeFilters(next: Filters) {
  replaceSearch(toParams(next));
}

export function HookExplorer({ hooks, mode, facets, nicheSlug, personalizerFields, showNicheChip, location, searchPlaceholder }: HookExplorerProps) {
  const { filters, urlFilters, draft } = useFilters();
  const gate = useGate();
  const deferred = React.useDeferredValue(filters);
  const results = React.useMemo(() => applyFilters(hooks, deferred), [hooks, deferred]);
  const counts = React.useMemo(() => facetCounts(hooks, deferred, facets), [hooks, deferred, facets]);
  const featuredN = React.useMemo(() => featuredCount(hooks, deferred), [hooks, deferred]);
  const active = isActive(filters);
  const nActive = activeCount(filters);
  const timer = React.useRef<number | undefined>(undefined);
  const resultsHeadingRef = React.useRef<HTMLParagraphElement>(null);
  const searchId = `${location}-search`;

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  function update(key: FacetKey | "featured" | "sort", value: string) {
    const base = { ...urlFilters, q: draft ?? urlFilters.q };
    const next: Filters =
      key === "featured" ? { ...base, featured: value === "1" } : key === "sort" ? { ...base, sort: value === "new" ? "new" : "popular" } : { ...base, [key]: value };
    writeFilters(next);
    setSearchDraft(null);
  }

  function onQuery(v: string) {
    setSearchDraft(v);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const current = parseFilters(window.location.search);
      writeFilters({ ...current, q: v });
      setSearchDraft(null);
    }, 250);
  }

  function clearAll() {
    window.clearTimeout(timer.current);
    setSearchDraft(null);
    writeFilters({ ...parseFilters(""), sort: urlFilters.sort });
  }

  function enterResults(patch: Partial<Filters>) {
    writeFilters({ ...urlFilters, ...patch });
    requestAnimationFrame(() => resultsHeadingRef.current?.focus());
  }

  const qValue = draft ?? urlFilters.q;
  const writeHref = generateHooksHref(nicheSlug ?? (filters.niche && filters.niche !== "__universal" ? filters.niche : null), effectiveQuery(filters.q) ? filters.q : null);

  const activeChips: { key: FacetKey | "featured" | "q"; label: string }[] = [];
  if (effectiveQuery(filters.q)) activeChips.push({ key: "q", label: `${F.searchQuery}: ${filters.q.trim()}` });
  for (const k of facets) {
    const v = filters[k];
    if (!v) continue;
    activeChips.push({ key: k, label: facetValueLabel(k, v) });
  }
  if (filters.featured) activeChips.push({ key: "featured", label: F.featured });

  const filterPanel = (layout: "sidebar" | "sheet" | "bar", prefix: string) => (
    <HookFilters
      idPrefix={prefix}
      facets={facets}
      filters={filters}
      counts={counts}
      featuredCount={featuredN}
      onChange={update}
      layout={layout}
    />
  );

  const showResults = mode === "niche" || active;
  const grouped = mode === "niche" && !active;

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div role="search" className="flex flex-col gap-3">
        <label htmlFor={searchId} className={cn(mode === "hub" ? "sr-only" : "text-sm font-semibold")}>
          {HOOKS_COPY.hub.searchLabel}
        </label>
        <div className="relative">
          <Search className={cn("pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 text-muted", mode === "hub" ? "size-5" : "size-4.5")} aria-hidden />
          <input
            id={searchId}
            type="search"
            value={qValue}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchPlaceholder ?? HOOKS_COPY.hub.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className={cn(
              "w-full rounded-full border border-border-strong bg-surface-1 ps-12 pe-12 text-text placeholder:text-muted transition-shadow focus-visible:outline-2 focus-visible:outline-offset-0 [&::-webkit-search-cancel-button]:hidden",
              mode === "hub" ? "h-14 text-body elev-2 focus-visible:glow-primary md:h-16 md:text-body-lg" : "h-12 text-base",
            )}
          />
          {qValue && (
            <button
              type="button"
              onClick={() => {
                window.clearTimeout(timer.current);
                setSearchDraft(null);
                writeFilters({ ...urlFilters, q: "" });
                document.getElementById(searchId)?.focus();
              }}
              aria-label="ניקוי החיפוש"
              className="absolute inset-e-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-text-2 hover:bg-surface-2 hover:text-text"
            >
              <X className="size-4.5" aria-hidden />
            </button>
          )}
        </div>
        {mode === "hub" && !active && (
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <span className="shrink-0 text-micro text-muted">{HOOKS_COPY.hub.quickLabel}:</span>
            {QUICK_FILTERS.map((q) => (
              <button
                key={`${q.param}-${q.value}`}
                type="button"
                onClick={() => enterResults(q.param === "featured" ? { featured: true } : ({ [q.param]: q.value } as Partial<Filters>))}
                className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-3 hover:text-text"
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => enterResults({ all: true })}
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-primary-text hover:underline"
            >
              <LayoutGrid className="size-4" aria-hidden />
              {plural(hooks.length, HOOKS_COPY.hub.browseAll)}
              <DirIcon name="forward" />
            </button>
          </div>
        )}
      </div>

      <HookPersonalizer fields={personalizerFields} />

      {mode === "niche" && (
        <div className="rounded-lg bg-surface-1/60 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">{filterPanel("bar", `${location}-bar`)}</div>
      )}

      {showResults && (
        <div className={cn(mode === "hub" && "grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]")}>
          {mode === "hub" && (
            <aside aria-label={F.title} className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)+20px)] flex max-h-[calc(100dvh-var(--header-h)-40px)] flex-col gap-4 overflow-y-auto rounded-lg bg-surface-1/60 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-body font-bold">{F.title}</h2>
                  {nActive > 0 && (
                    <button type="button" onClick={clearAll} className="text-sm font-semibold text-primary-text hover:underline">
                      {F.clearAll}
                    </button>
                  )}
                </div>
                {filterPanel("sidebar", `${location}-side`)}
              </div>
            </aside>
          )}

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p ref={resultsHeadingRef} tabIndex={-1} aria-live="polite" className="num text-h3 outline-none">
                {plural(results.length, F.results)}
              </p>
              <div className="flex items-center gap-2">
                {mode === "hub" && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="secondary" size="md" className="lg:hidden">
                        <SlidersHorizontal aria-hidden />
                        {F.open}
                        {nActive > 0 && (
                          <span className="num inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-micro text-on-primary">{nActive}</span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" title={F.open} closeLabel="סגירת הסינון" className="pb-0">
                      <div className="pb-4">{filterPanel("sheet", `${location}-sheet`)}</div>
                      <div className="sticky bottom-0 -mx-5 mt-auto flex gap-2 border-t border-border bg-surface-1 p-4">
                        <SheetClose asChild>
                          <Button size="lg" className="flex-1">{plural(results.length, F.show)}</Button>
                        </SheetClose>
                        <Button variant="ghost" size="lg" onClick={clearAll}>{F.clear}</Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
                <label htmlFor={`${location}-sort`} className="sr-only">{F.sort}</label>
                <select
                  id={`${location}-sort`}
                  value={filters.sort}
                  onChange={(e) => update("sort", e.target.value)}
                  className="h-10 rounded-full border border-border-strong bg-surface-2 px-4 text-sm font-semibold text-text"
                >
                  <option value="popular">{F.sortPopular}</option>
                  <option value="new">{F.sortNew}</option>
                </select>
              </div>
            </div>

            {activeChips.length > 0 && (
              <ul aria-label={F.activeLabel} className="flex flex-wrap items-center gap-2">
                {activeChips.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => {
                        if (c.key === "q") {
                          setSearchDraft(null);
                          writeFilters({ ...urlFilters, q: "" });
                        } else update(c.key, "");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-sm font-semibold text-primary-text shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] hover:bg-primary/20"
                    >
                      {c.label}
                      <X className="size-3.5" aria-hidden />
                      <span className="sr-only">{F.removeFilter}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={clearAll} className="px-2 text-sm font-semibold text-text-2 underline-offset-4 hover:text-text hover:underline">
                    {F.clearAll}
                  </button>
                </li>
              </ul>
            )}

            {results.length === 0 ? (
              <EmptyResults onClear={clearAll} onWrite={() => gate("generate", writeHref)} />
            ) : grouped ? (
              <GroupedList items={results} showNiche={showNicheChip} location={location} />
            ) : (
              <PagedList key={toParams(deferred).toString()} items={results} showNiche={showNicheChip} location={location} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function facetValueLabel(k: FacetKey, v: string): string {
  switch (k) {
    case "niche": {
      if (v === "__universal") return HOOKS_COPY.card.forAny;
      const n = getNiche(v);
      return n ? nicheShortName(n) : v;
    }
    case "type": return getHookType(v)?.name_he ?? v;
    case "platform": return PLATFORM_LABEL[v as Platform] ?? v;
    case "goal": return GOAL_LABEL[v as HookGoal] ?? v;
    case "gender": return GENDER_LABEL[v as HookGender] ?? v;
    case "season": return getSeason(v)?.name_he ?? v;
  }
}

function EmptyResults({ onClear, onWrite }: { onClear: () => void; onWrite: () => void }) {
  const E = HOOKS_COPY.empty.noResults;
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-1/60 px-6 py-14 text-center shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-surface-2 text-text-2">
        <SearchX className="size-7" aria-hidden />
      </span>
      <h3 className="text-h3">{E.title}</h3>
      <p className="max-w-md text-text-2">{E.body}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onClear}>{E.clear}</Button>
        <Button onClick={onWrite}>
          <Sparkles aria-hidden />
          {E.write}
        </Button>
      </div>
    </div>
  );
}

function PagedList({ items, showNiche, location }: { items: HookView[]; showNiche: boolean; location: string }) {
  const [visible, setVisible] = React.useState(PAGE);
  const [announce, setAnnounce] = React.useState("");
  const focusFrom = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (focusFrom.current === null) return;
    const h = items[focusFrom.current];
    focusFrom.current = null;
    if (h) document.getElementById(h.id)?.focus();
  }, [visible, items]);
  const shown = items.slice(0, visible);
  return (
    <>
      <ul className="grid items-start gap-4 xl:grid-cols-2">
        {shown.map((h) => (
          <li key={h.id} className="contents">
            <HookCard hook={h} showNiche={showNiche} location={location} />
          </li>
        ))}
      </ul>
      {visible < items.length && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              const n = Math.min(PAGE, items.length - visible);
              focusFrom.current = visible;
              setVisible(visible + PAGE);
              setAnnounce(plural(n, F.loaded));
            }}
          >
            {F.loadMore}
            <span className="num text-text-2">({items.length - visible})</span>
          </Button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{announce}</p>
    </>
  );
}

function GroupedList({ items, showNiche, location }: { items: HookView[]; showNiche: boolean; location: string }) {
  const groups = hookFamilies
    .map((f) => ({ family: f, items: items.filter((h) => h.familySlug === f.slug) }))
    .filter((g) => g.items.length > 0);
  return (
    <div className="flex flex-col gap-10">
      {groups.map((g) => (
        <section key={g.family.slug} aria-labelledby={`fam-${g.family.slug}`} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
            <h2 id={`fam-${g.family.slug}`} className="text-h3">
              {g.family.name_he} <span className="num text-body font-normal text-muted">· {plural(g.items.length, HOOKS_COPY.niche.familyCount)}</span>
            </h2>
            <p className="text-small text-text-2">{g.family.description_he}</p>
          </div>
          <ul className="grid items-start gap-4 lg:grid-cols-2">
            {g.items.map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} showNiche={showNiche} location={location} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Link-styled "write me hooks" CTA card used at the bottom of library pages (gated, Part 02 §5.4). */
export function WriteHooksCta({ title, body, button, niche, secondary }: { title: string; body: string; button: string; niche?: string; secondary?: { href: string; label: string } }) {
  const gate = useGate();
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-1 p-8 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_0%_100%,color-mix(in_oklab,var(--color-violet)_20%,transparent),transparent_70%)]" />
      <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-h2">{title}</h2>
          <p className="mt-3 text-body-lg text-text-2">{body}</p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <Button size="xl" onClick={() => gate("generate", generateHooksHref(niche))}>
            <Sparkles aria-hidden />
            {button}
          </Button>
          {secondary && (
            <Link href={secondary.href} className={cn(buttonVariants({ variant: "link" }), "text-base")}>
              {secondary.label} <DirIcon name="forward" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
