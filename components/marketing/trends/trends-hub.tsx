"use client";
import * as React from "react";
import { Switch } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { TrendCard } from "./trend-card";
import { TRENDS_HUB } from "@/content/he/trends";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

/** Client-side filters for `/trends` (niche chips · ad-safe). No URL state: the hub stays one indexable page. */
export function TrendsHub({ trends, niches }: { trends: TrendTemplateV1[]; niches: { slug: string; name: string }[] }) {
  const [niche, setNiche] = React.useState<string>("");
  const [adOnly, setAdOnly] = React.useState(false);
  const filtered = trends.filter((t) => (!niche || t.niches.includes(niche)) && (!adOnly || t.ad_safety !== "organic_only"));
  const chips = [{ slug: "", name: TRENDS_HUB.filters.nicheAll }, ...niches.slice(0, 8)];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-4">
        <div role="radiogroup" aria-label={TRENDS_HUB.filters.nicheLabel} className="flex flex-wrap justify-center gap-2">
          {chips.map((c) => {
            const active = niche === c.slug;
            return (
              <button
                key={c.slug || "all"}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setNiche(c.slug)}
                className={cn(
                  "h-11 rounded-full px-5 text-body font-semibold transition-colors",
                  active ? "bg-ink text-paper dark:bg-text dark:text-bg" : "bg-surface-1 text-text-2 ring-hairline hover:text-text",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3">
          <Switch checked={adOnly} onCheckedChange={setAdOnly} aria-label={TRENDS_HUB.filters.adLabel} />
          <span className="text-small font-semibold text-text-2" aria-hidden>
            {TRENDS_HUB.filters.adLabel}
          </span>
        </label>
      </div>
      <p className="sr-only" aria-live="polite">{TRENDS_HUB.filters.results(filtered.length)}</p>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[28px] bg-surface-1 px-6 py-16 text-center ring-hairline">
          <p className="text-body-lg">{TRENDS_HUB.filters.empty}</p>
          <Button variant="secondary" onClick={() => { setNiche(""); setAdOnly(false); }}>{TRENDS_HUB.filters.clear}</Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t, i) => (
            <li key={t.slug} className="flex">
              <TrendCard trend={t} nicheSlug={niche || undefined} index={i} className="w-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
