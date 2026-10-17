"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/misc";
import { GENDER_LABEL, GOAL_LABEL, PLATFORM_LABEL, type HookGender, type HookGoal } from "@/lib/labels";
import { niches, hookFamilies, hookTypes, nicheShortName } from "@/lib/data/seed";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import { pageSeasons, PAGE_PLATFORMS } from "./hook-data";
import type { FacetKey, Filters } from "./filter-model";

const F = HOOKS_COPY.filters;
const nf = new Intl.NumberFormat("he-IL");

export interface HookFiltersProps {
  facets: FacetKey[];
  filters: Filters;
  counts: Partial<Record<FacetKey, Record<string, number>>>;
  featuredCount: number;
  onChange: (key: FacetKey | "featured" | "sort", value: string) => void;
  layout: "sidebar" | "bar" | "sheet";
  idPrefix: string;
}

function Count({ n }: { n: number }) {
  return <span className="num text-micro font-normal opacity-75">({nf.format(n)})</span>;
}

function ChipGroup({ legend, value, options, onSelect, idPrefix }: {
  legend: string; value: string; options: { value: string; label: string; count: number }[]; onSelect: (v: string) => void; idPrefix: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-micro text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          id={`${idPrefix}-all`}
          aria-pressed={!value}
          onClick={() => onSelect("")}
          className={cn(
            "rounded-sm px-2.5 py-1.5 text-sm font-semibold transition-colors",
            !value ? "bg-text text-bg" : "bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text",
          )}
        >
          {F.all}
        </button>
        {options.map((o) => {
          const on = value === o.value;
          const disabled = o.count === 0 && !on;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              aria-disabled={disabled || undefined}
              onClick={() => !disabled && onSelect(on ? "" : o.value)}
              className={cn(
                "inline-flex items-center gap-1 rounded-sm px-2.5 py-1.5 text-sm font-semibold transition-colors",
                on ? "bg-primary text-on-primary" : "bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text",
                disabled && "cursor-not-allowed opacity-40 hover:bg-surface-2 hover:text-text-2",
              )}
            >
              {o.label}
              <Count n={o.count} />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SelectFacet({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-micro text-muted">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-11 w-full appearance-none rounded-sm border bg-surface-2 ps-3.5 pe-9 text-sm font-semibold text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-0",
            value ? "border-primary-text" : "border-border-strong",
          )}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-text-2" aria-hidden />
      </div>
    </div>
  );
}

const optLabel = (label: string, n: number) => `${label} (${nf.format(n)})`;

export function HookFilters({ facets, filters, counts, featuredCount, onChange, layout, idPrefix }: HookFiltersProps) {
  const has = (k: FacetKey) => facets.includes(k);
  const c = (k: FacetKey, v: string) => counts[k]?.[v] ?? 0;
  const seasons = pageSeasons();

  return (
    <div className={cn("flex flex-col gap-6", layout === "bar" && "gap-5 md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-4")}>
      {has("niche") && (
        <SelectFacet id={`${idPrefix}-niche`} label={F.niche} value={filters.niche} onChange={(v) => onChange("niche", v)}>
          <option value="">{F.nicheAll}</option>
          <option value="__universal" disabled={c("niche", "__universal") === 0}>
            {optLabel(HOOKS_COPY.card.forAny, c("niche", "__universal"))}
          </option>
          {niches.map((n) => (
            <option key={n.slug} value={n.slug} disabled={c("niche", n.slug) === 0 && filters.niche !== n.slug}>
              {optLabel(nicheShortName(n), c("niche", n.slug))}
            </option>
          ))}
        </SelectFacet>
      )}
      {has("type") && (
        <SelectFacet id={`${idPrefix}-type`} label={F.type} value={filters.type} onChange={(v) => onChange("type", v)}>
          <option value="">{F.typeAll}</option>
          {hookFamilies.map((fam) => (
            <optgroup key={fam.slug} label={fam.name_he}>
              {hookTypes
                .filter((t) => t.family_slug === fam.slug)
                .map((t) => (
                  <option key={t.slug} value={t.slug} disabled={c("type", t.slug) === 0 && filters.type !== t.slug}>
                    {optLabel(t.name_he, c("type", t.slug))}
                  </option>
                ))}
            </optgroup>
          ))}
        </SelectFacet>
      )}
      {has("platform") && (
        <ChipGroup
          idPrefix={`${idPrefix}-platform`}
          legend={F.platform}
          value={filters.platform}
          onSelect={(v) => onChange("platform", v)}
          options={PAGE_PLATFORMS.map((p) => ({ value: p, label: PLATFORM_LABEL[p], count: c("platform", p) }))}
        />
      )}
      {has("goal") && (
        <ChipGroup
          idPrefix={`${idPrefix}-goal`}
          legend={F.goal}
          value={filters.goal}
          onSelect={(v) => onChange("goal", v)}
          options={(Object.keys(GOAL_LABEL) as HookGoal[]).map((g) => ({ value: g, label: GOAL_LABEL[g], count: c("goal", g) }))}
        />
      )}
      {has("gender") && (
        <ChipGroup
          idPrefix={`${idPrefix}-gender`}
          legend={F.gender}
          value={filters.gender}
          onSelect={(v) => onChange("gender", v)}
          options={(Object.keys(GENDER_LABEL) as HookGender[]).map((g) => ({ value: g, label: GENDER_LABEL[g], count: c("gender", g) }))}
        />
      )}
      {has("season") && (
        <SelectFacet id={`${idPrefix}-season`} label={F.season} value={filters.season} onChange={(v) => onChange("season", v)}>
          <option value="">{F.seasonAll}</option>
          {seasons.map((s) => (
            <option key={s.slug} value={s.slug} disabled={c("season", s.slug) === 0 && filters.season !== s.slug}>
              {optLabel(s.name_he, c("season", s.slug))}
            </option>
          ))}
        </SelectFacet>
      )}
      {layout !== "bar" && (
        <label className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3.5 py-3 text-sm font-semibold">
          <span>
            {F.featured} <Count n={featuredCount} />
          </span>
          <Switch checked={filters.featured} onCheckedChange={(on) => onChange("featured", on ? "1" : "")} aria-label={F.featured} />
        </label>
      )}
    </div>
  );
}
