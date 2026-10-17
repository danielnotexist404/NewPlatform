"use client";
import * as React from "react";
import Link from "next/link";
import { Camera, Check, Info, Wand, Zap } from "lucide-react";
import { TrendTile } from "./trend-tile";
import { NichePicker, type NicheOption } from "./niche-picker";
import { useStoredNiche } from "./use-feed-niche";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { TREND_CARD, TREND_DETAIL, TRENDS_FEED } from "@/content/he/trends-app";
import { VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import {
  adaptationFor, createHref, getTrend, onscreenFor, shootProjectId, supportsAi, supportsGuided,
} from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

function useTrendNiche(niches: NicheOption[], workspaceNiche: string) {
  const valid = React.useCallback((slug: string) => niches.some((n) => n.slug === slug), [niches]);
  return useStoredNiche(workspaceNiche, valid);
}

/** Demo tile + "מתאים לעסק שלכם כי…" — follows the niche picked in the feed or in the create panel. */
export function TrendHeroMedia({ slug, niches, workspaceNiche }: { slug: string; niches: NicheOption[]; workspaceNiche: string }) {
  const trend = getTrend(slug)!;
  const [niche] = useTrendNiche(niches, workspaceNiche);
  const icon = niches.find((n) => n.slug === niche)?.icon;
  return (
    <TrendTile
      art={trend.tile.art}
      tone={trend.tile.tone}
      text={onscreenFor(trend, niche)}
      nicheIcon={icon}
      durationSec={trend.durationSec}
      label={TREND_CARD.demoLabel}
      size="lg"
      ariaLabel={TREND_CARD.playLabel(trend.nameHe)}
      className="rounded-lg elev-3"
    />
  );
}

export function TrendFitBox({ slug, niches, workspaceNiche }: { slug: string; niches: NicheOption[]; workspaceNiche: string }) {
  const trend = getTrend(slug)!;
  const [niche] = useTrendNiche(niches, workspaceNiche);
  const current = niches.find((n) => n.slug === niche);
  const adaptation = adaptationFor(trend, niche);
  return (
    <div className="rounded-md bg-surface-2 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <p className="text-micro text-primary-text">
        {TREND_DETAIL.fit}…{current && <span className="text-muted"> ({current.shortHe})</span>}
      </p>
      <p className="mt-1 text-body">{adaptation?.angleHe ?? trend.genericFitHe}</p>
    </div>
  );
}

type Mode = "ai" | "guided";

export function CreateTrendPanel({ slug, niches, workspaceNiche }: { slug: string; niches: NicheOption[]; workspaceNiche: string }) {
  const trend = getTrend(slug)!;
  const [niche, setNiche] = useTrendNiche(niches, workspaceNiche);
  const canAi = supportsAi(trend);
  const canGuided = supportsGuided(trend);
  const [mode, setMode] = React.useState<Mode>(canAi ? "ai" : "guided");
  const cost = trend.durationSec === 15 ? VIDEO_COST_EXAMPLES[0] : VIDEO_COST_EXAMPLES[1];
  const clips = trend.shotList?.length ?? 0;
  const groupId = React.useId();

  const options: { mode: Mode; enabled: boolean; icon: typeof Wand }[] = [
    { mode: "ai", enabled: canAi, icon: Wand },
    { mode: "guided", enabled: canGuided, icon: Camera },
  ];

  return (
    <section aria-labelledby={`${groupId}-title`} className="flex flex-col gap-5 rounded-lg bg-surface-1 p-5 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
      <div>
        <h2 id={`${groupId}-title`} className="text-h3">{TREND_DETAIL.create.title}</h2>
        <p className="mt-1 text-small text-text-2">{TREND_DETAIL.create.sub}</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-micro text-muted">{TREND_DETAIL.create.modeLabel}</legend>
        {options.map(({ mode: m, enabled, icon: Icon }) => {
          const copy = TREND_DETAIL.modes[m];
          const checked = mode === m;
          return (
            <label
              key={m}
              className={cn(
                "relative flex cursor-pointer gap-3 rounded-md p-3.5 shadow-[inset_0_0_0_1px_var(--color-border-strong)] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                checked && enabled && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
                !enabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="radio"
                name={`${groupId}-mode`}
                value={m}
                checked={checked && enabled}
                disabled={!enabled}
                onChange={() => setMode(m)}
                className="sr-only"
              />
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", m === "ai" ? "bg-violet/15 text-violet" : "bg-primary/15 text-primary-text")}>
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-bold">{copy.title}</span>
                <span className="text-small text-text-2">{enabled ? copy.body : copy.unavailable}</span>
              </span>
              {checked && enabled && (
                <span className="absolute top-3 inset-e-3 flex size-5 items-center justify-center rounded-full bg-primary text-on-primary">
                  <Check aria-hidden className="size-3.5" />
                </span>
              )}
            </label>
          );
        })}
      </fieldset>

      <NichePicker
        options={niches}
        value={niche}
        onChange={setNiche}
        workspaceSlug={workspaceNiche}
        label={TREND_DETAIL.create.nicheLabel}
        searchLabel={TRENDS_FEED.nicheSearch}
        emptyLabel={TRENDS_FEED.nicheEmpty}
        workspaceLabel={TRENDS_FEED.nicheWorkspace}
        className="[&_button]:w-full"
      />

      <ul className="flex flex-col gap-1.5 text-small">
        <li className="flex items-center gap-2">
          <Check aria-hidden className="size-4 text-success" />
          {TREND_DETAIL.create.hooksLabel}
          <span className="ms-auto flex gap-1" dir="ltr">
            {trend.hookVariants.map((v) => (
              <span key={v.key} className="flex size-6 items-center justify-center rounded-full bg-surface-3 text-micro">{v.key}</span>
            ))}
          </span>
        </li>
      </ul>

      <div className="rounded-sm bg-surface-2 p-3 text-small">
        <p className="flex items-center gap-1.5 text-micro text-muted">
          <Zap aria-hidden className="size-3.5 text-primary-text" />
          {TREND_DETAIL.create.costTitle}
        </p>
        {mode === "ai" ? (
          <p className="mt-1">
            {TREND_DETAIL.create.costSameAsVideo}{" "}
            <span className="text-text-2">לדוגמה: {cost.labelHe} · <Num value={cost.credits} /> קרדיטים.</span>
          </p>
        ) : (
          <p className="mt-1">
            {TREND_DETAIL.create.costAutocut}
            <span className="text-text-2"> · <Num value={clips} /> קליפים = <Num value={clips} /> קרדיטים, ועוד הרינדור כמו בכל סרטון.</span>
          </p>
        )}
      </div>

      {trend.adSafety === "organic_only" && (
        <p className="flex items-start gap-2 rounded-sm bg-rose/10 p-3 text-small text-text">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-rose" />
          {TREND_DETAIL.create.organicNote}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Link href={createHref(trend.slug, mode, niche)} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
          {mode === "ai" ? <Wand aria-hidden /> : <Camera aria-hidden />}
          {TREND_DETAIL.create.cta}
        </Link>
        {mode === "guided" && canGuided && (
          <Link href={`/app/projects/${shootProjectId(trend.slug)}/shoot`} className="inline-flex items-center justify-center gap-1 text-small font-semibold text-link hover:underline">
            {TREND_DETAIL.create.shotListLink}
            <DirIcon name="next" />
          </Link>
        )}
      </div>
    </section>
  );
}
