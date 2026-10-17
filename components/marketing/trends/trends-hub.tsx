"use client";
import * as React from "react";
import { Switch } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { TrendCard } from "./trend-card";
import { TRENDS_HUB, LIFECYCLE_STAGE_LABEL } from "@/content/he/trends";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

type Stage = TrendTemplateV1["mock_stage"];

/** Client-side filters for `/trends` (niche · lifecycle · ad-safe). No URL state: the hub stays one indexable page. */
export function TrendsHub({ trends, niches }: { trends: TrendTemplateV1[]; niches: { slug: string; name: string }[] }) {
  const [niche, setNiche] = React.useState<string>("");
  const [stage, setStage] = React.useState<Stage | "">("");
  const [adOnly, setAdOnly] = React.useState(false);

  const stages = React.useMemo(() => {
    const order: Stage[] = ["new", "peak", "fading", "classic"];
    const present = new Set(trends.map((t) => t.mock_stage));
    return order.filter((s) => present.has(s));
  }, [trends]);

  const filtered = trends.filter(
    (t) => (!niche || t.niches.includes(niche)) && (!stage || t.mock_stage === stage) && (!adOnly || t.ad_safety !== "organic_only"),
  );
  const filtering = !!niche || !!stage || adOnly;
  const hot = filtered.filter((t) => t.lifecycle !== "evergreen");
  const library = filtered.filter((t) => t.lifecycle === "evergreen");
  const clear = () => {
    setNiche("");
    setStage("");
    setAdOnly(false);
  };

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="סינון טרנדים" className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:flex-row md:flex-wrap md:items-center md:gap-6 md:p-5">
        <label className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
          <span className="text-small font-semibold text-text-2">{TRENDS_HUB.filters.nicheLabel}</span>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="h-10 min-w-56 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm text-text focus-visible:outline-2"
          >
            <option value="">{TRENDS_HUB.filters.nicheAll}</option>
            {niches.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
          <span id="stage-label" className="text-small font-semibold text-text-2">
            {TRENDS_HUB.filters.stageLabel}
          </span>
          <div role="radiogroup" aria-labelledby="stage-label" className="flex flex-wrap gap-1.5">
            {(["", ...stages] as (Stage | "")[]).map((s) => {
              const active = stage === s;
              return (
                <button
                  key={s || "all"}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStage(s)}
                  className={cn(
                    "h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors",
                    active ? "border-primary bg-primary text-on-primary" : "border-border-strong text-text-2 hover:text-text",
                  )}
                >
                  {s ? LIFECYCLE_STAGE_LABEL[s] : TRENDS_HUB.filters.stageAll}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-3 md:ms-auto">
          <Switch checked={adOnly} onCheckedChange={setAdOnly} aria-label={TRENDS_HUB.filters.adLabel} />
          <span className="text-small font-semibold text-text-2" aria-hidden>
            {TRENDS_HUB.filters.adLabel}
          </span>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {TRENDS_HUB.filters.results(filtered.length)}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-1 px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <p className="text-body-lg">{TRENDS_HUB.filters.empty}</p>
          <Button variant="secondary" onClick={clear}>
            {TRENDS_HUB.filters.clear}
          </Button>
        </div>
      ) : filtering ? (
        <Grid trends={filtered} niche={niche} />
      ) : (
        <>
          {hot.length > 0 && (
            <section aria-labelledby="hot-title" className="flex flex-col gap-6">
              <h2 id="hot-title" className="text-h2">
                {TRENDS_HUB.featuredTitle}
              </h2>
              <Grid trends={hot} niche={niche} />
            </section>
          )}
          {library.length > 0 && (
            <section aria-labelledby="lib-title" className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col gap-2">
                <h2 id="lib-title" className="text-h2">
                  {TRENDS_HUB.libraryTitle}
                </h2>
                <p className="text-text-2">{TRENDS_HUB.librarySubtitle}</p>
              </div>
              <Grid trends={library} niche={niche} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Grid({ trends, niche }: { trends: TrendTemplateV1[]; niche: string }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {trends.map((t) => (
        <li key={t.slug} className="flex">
          <TrendCard trend={t} nicheSlug={niche || undefined} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
