"use client";
import * as React from "react";
import Link from "next/link";
import { Flame, Megaphone, Plus, Sparkles } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Price } from "@/components/a11y/num";
import { accentCta } from "@/components/layout/cta-styles";
import { VideoCard, type VideoCardData } from "@/components/projects/video-card";
import { generatedCard } from "@/components/projects/video-cards";
import { VideoTile } from "@/components/video/video-tile";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { useGeneratedVideos } from "@/lib/generate/store";
import { cn } from "@/lib/utils";

const D = SIMPLE_APP.dashboard;

/** The one big call to action on the dashboard. */
export function CreateCard({ hookSamples }: { hookSamples: string[] }) {
  return (
    <section aria-labelledby="create-title" className="relative isolate overflow-hidden rounded-xl bg-surface-1 elev-3 ring-hairline">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_0%_100%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_60%),radial-gradient(60%_90%_at_10%_0%,color-mix(in_oklab,var(--color-coral)_14%,transparent),transparent_60%)]" />
      <div className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-micro text-primary-text ring-hairline">
            <Sparkles className="size-3.5" aria-hidden />
            AI
          </span>
          <h2 id="create-title" className="text-title">{D.createTitle}</h2>
          <p className="max-w-md text-body-lg text-text-2">{D.createBody}</p>
          <Link href="/app/create" className={cn(accentCta, "mt-2 h-14 px-8 text-lg")}>
            <Plus className="size-5" aria-hidden />
            {D.createCta}
          </Link>
        </div>
        <div aria-hidden className="hidden items-end gap-4 lg:flex">
          {hookSamples.slice(0, 3).map((h, i) => (
            <div key={h} className={cn("w-[132px] rounded-lg elev-3", i === 1 ? "-translate-y-6 w-[150px]" : "")} style={{ rotate: `${(i - 1) * 4}deg` }}>
              <VideoTile tone={(["rose", "ember", "violet"] as const)[i]} icon={(["Star", "Flame", "Sparkles"] as const)[i]} hookText={h} textSize="sm" className="rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Three latest videos: generated in this browser first, then the sample projects. */
export function RecentVideos({ items }: { items: VideoCardData[] }) {
  const generated = useGeneratedVideos();
  const list = [...generated.map(generatedCard), ...items].slice(0, 3);
  return (
    <section aria-labelledby="recent-title" className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="recent-title" className="text-h3">{D.recent}</h2>
        <Link href="/app/projects" className="inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
          {D.all}
          <DirIcon name="next" className="size-4" />
        </Link>
      </div>
      <ul className="grid grid-cols-3 gap-3 md:gap-6">
        {list.map((v, i) => (
          <li key={v.id} className="min-w-0">
            <VideoCard video={v} priority={i === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CampaignSummary({ name, spendIls, results, costPerResultIls }: { name: string; spendIls: number; results: number; costPerResultIls: number }) {
  return (
    <Link href="/app/campaigns" className="group flex flex-col gap-4 rounded-lg bg-surface-1 p-5 elev-2 ring-hairline transition-shadow hover:elev-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-small font-semibold text-text-2">
          <Megaphone className="size-4 text-primary-text" aria-hidden />
          {D.campaign}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-micro text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          {D.sample}
        </span>
      </div>
      <p dir="auto" className="line-clamp-1 text-body font-bold">{name}</p>
      <dl className="grid grid-cols-3 gap-2">
        {[
          { k: D.spend, v: <Price ils={Math.round(spendIls)} /> },
          { k: D.leads, v: <bdi className="num">{results}</bdi> },
          { k: D.cpr, v: <Price ils={costPerResultIls} decimals /> },
        ].map((x) => (
          <div key={x.k} className="flex flex-col gap-0.5">
            <dt className="text-micro font-normal text-muted">{x.k}</dt>
            <dd className="text-body-lg font-extrabold">{x.v}</dd>
          </div>
        ))}
      </dl>
      <span className="inline-flex items-center gap-1 text-small font-semibold text-primary-text">
        {D.campaignOpen}
        <DirIcon name="next" className="size-4 transition-transform rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function TrendCard({ slug, name, why, hook }: { slug: string; name: string; why: string; hook: string }) {
  return (
    <section aria-labelledby="trend-title" className="flex flex-col gap-4 rounded-lg bg-surface-1 p-5 elev-2 ring-hairline">
      <div className="flex items-center justify-between gap-2">
        <span id="trend-title" className="inline-flex items-center gap-2 text-small font-semibold text-text-2">
          <Flame className="size-4 text-primary-text" aria-hidden />
          {D.trend}
        </span>
        <Link href="/app/trends" className="text-micro text-text-2 hover:text-text hover:underline">{D.trendMore}</Link>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body font-bold">{name}</p>
        <p className="text-small text-text-2">{why}</p>
      </div>
      <p dir="auto" className="rounded-md bg-surface-2 px-4 py-3 text-small font-semibold">״{hook}״</p>
      <Link href={`/app/create?trend=${slug}`} className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-ink px-5 text-small font-bold text-paper transition-transform hover:-translate-y-px">
        {D.trendCta}
        <DirIcon name="next" className="size-4" />
      </Link>
    </section>
  );
}
