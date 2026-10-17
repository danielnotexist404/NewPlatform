import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { TrendsFeed } from "@/components/trends/trends-feed";
import type { NicheOption } from "@/components/trends/niche-picker";
import { TRENDS_FEED, TRENDS_META } from "@/content/he/trends-app";
import { nicheShortName, niches } from "@/lib/data/seed";
import { MOCK_WORKSPACE } from "@/lib/mock/trends-app";

export const metadata: Metadata = {
  title: TRENDS_META.feed.title,
  description: TRENDS_META.feed.description,
  robots: { index: false },
};

export default function TrendsPage() {
  const options: NicheOption[] = niches.map((n) => ({ slug: n.slug, nameHe: n.name_he, shortHe: nicheShortName(n), icon: n.icon }));
  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="relative overflow-hidden rounded-xl bg-surface-1 px-5 py-8 shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-10 md:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-90" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
        <div className="relative flex flex-col gap-4">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose/15 px-3 py-1 text-micro text-rose">
            <Flame aria-hidden className="size-3.5" />
            {TRENDS_FEED.eyebrow}
          </p>
          <h1 className="font-display text-display leading-[0.95]">
            טרנדים <span className="text-gold-gradient">השבוע</span>
          </h1>
          <p className="max-w-2xl text-body-lg text-text-2">{TRENDS_FEED.lead}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted">
            <span>{TRENDS_FEED.lastDrop(MOCK_WORKSPACE.lastDropHe)}</span>
            <span aria-hidden>·</span>
            <span>{TRENDS_FEED.scoreNote}</span>
          </div>
        </div>
      </header>
      <TrendsFeed niches={options} workspaceNiche={MOCK_WORKSPACE.nicheSlug} />
    </div>
  );
}
