import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, Music, ShieldCheck } from "lucide-react";
import { TrendTile } from "@/components/trends/trend-tile";
import { RecipeTimeline } from "@/components/trends/recipe-timeline";
import { HookScorePanel } from "@/components/trends/hook-score-panel";
import { AdSafetyBadge, HookScoreBadge, ProductionBadge, TrendLifecycleBadge } from "@/components/trends/trend-badges";
import { CreateTrendPanel, TrendFitBox, TrendHeroMedia } from "@/components/trends/trend-detail-client";
import type { NicheOption } from "@/components/trends/niche-picker";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { MUSIC_ENERGY_LABEL, TREND_DETAIL, TRENDS_META } from "@/content/he/trends-app";
import { getHookType, getNiche, nicheShortName, niches } from "@/lib/data/seed";
import { getTrend, hookScore, MOCK_WORKSPACE, TREND_TEMPLATES } from "@/lib/mock/trends-app";

export function generateStaticParams() {
  return TREND_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const trend = getTrend(slug);
  if (!trend) return { title: TRENDS_META.feed.title };
  const m = TRENDS_META.detail(trend.nameHe);
  return { title: m.title, description: m.description, robots: { index: false } };
}

export default async function TrendPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trend = getTrend(slug);
  if (!trend) notFound();

  const options: NicheOption[] = niches.map((n) => ({ slug: n.slug, nameHe: n.name_he, shortHe: nicheShortName(n), icon: n.icon }));
  const hookType = getHookType(trend.hookTypeSlug);
  const organic = trend.adSafety === "organic_only";
  const ws = MOCK_WORKSPACE.nicheSlug;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <nav aria-label="מיקום" className="text-small text-text-2">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/app/trends" className="hover:text-text hover:underline">{TREND_DETAIL.breadcrumbRoot}</Link></li>
          <li aria-hidden><DirIcon name="next" className="size-3.5" /></li>
          <li aria-current="page" className="text-text">{trend.nameHe}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:items-start md:gap-8 lg:col-start-1 lg:row-start-1">
          <div className="order-2 mx-auto w-full max-w-[260px] md:order-1 md:max-w-none">
            <TrendHeroMedia slug={trend.slug} niches={options} workspaceNiche={ws} />
          </div>
          <div className="order-1 flex min-w-0 flex-col gap-4 md:order-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <TrendLifecycleBadge trend={trend} />
              <ProductionBadge mode={trend.productionMode} />
              <AdSafetyBadge safety={trend.adSafety} />
              {trend.code && <span className="text-micro text-muted">{TREND_DETAIL.codeLabel(trend.code)}</span>}
            </div>
            <h1 className="font-display text-[clamp(3rem,2rem+4vw,5.5rem)] leading-[0.95] font-bold">{trend.nameHe}</h1>
            <p className="text-body-lg text-text-2">{trend.taglineHe}</p>
            <div className="flex flex-wrap items-center gap-3 text-small text-muted">
              <HookScoreBadge score={hookScore(trend)} />
              {hookType && <span>סוג הוק: <span className="text-text-2">{hookType.name_he}</span></span>}
              <span aria-hidden>·</span>
              <span><Num value={trend.durationSec} /> שניות</span>
            </div>
            <div>
              <h2 className="text-micro text-muted">{TREND_DETAIL.why}</h2>
              <ul className="mt-2 flex flex-col gap-2">
                {trend.whyItWorksHe.map((w) => (
                  <li key={w} className="flex gap-2.5">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <TrendFitBox slug={trend.slug} niches={options} workspaceNiche={ws} />
          </div>
        </section>

        {/* Create panel: after the hero on mobile, sticky aside on desktop */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <CreateTrendPanel slug={trend.slug} niches={options} workspaceNiche={ws} />
          </div>
        </aside>

        {/* Body */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-2">
          {organic && (
            <div role="note" className="flex gap-3 rounded-lg bg-rose/10 p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-rose)_35%,transparent)]">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-rose" />
              <div>
                <h2 className="font-bold text-rose">{TREND_DETAIL.compliance.organicTitle}</h2>
                <p className="mt-1 text-text">{trend.complianceNotesHe[0]}</p>
                <p className="mt-1 text-small text-text-2">{TREND_DETAIL.compliance.organicBody}</p>
              </div>
            </div>
          )}

          <Panel title={TREND_DETAIL.recipe.title} sub={TREND_DETAIL.recipe.sub}>
            <RecipeTimeline beats={trend.beats} durationSec={trend.durationSec} />
          </Panel>

          <Panel title={TREND_DETAIL.hooks.title} sub={TREND_DETAIL.hooks.sub}>
            <ol className="grid gap-3 md:grid-cols-3">
              {trend.hookVariants.map((v) => (
                <li key={v.key} className="flex flex-col gap-2 rounded-md bg-surface-2 p-4">
                  <span dir="ltr" className="flex size-8 items-center justify-center self-start rounded-full bg-primary text-sm font-extrabold text-on-primary">{v.key}</span>
                  <p className="text-micro text-muted">{TREND_DETAIL.hooks.bait}</p>
                  <p className="text-small text-text-2">{v.baitHe}</p>
                  <p className="text-micro text-muted">{TREND_DETAIL.hooks.line}</p>
                  <p className="text-body-lg font-bold leading-snug">"{v.hookLineHe}"</p>
                  <p className="mt-auto text-small text-text-2">{v.whyHe}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title={TREND_DETAIL.niches.title} sub={TREND_DETAIL.niches.sub}>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {trend.nicheAdaptations.map((a) => {
                const n = getNiche(a.nicheSlug);
                return (
                  <li key={a.nicheSlug} className="flex flex-col gap-2">
                    <TrendTile art={trend.tile.art} tone={trend.tile.tone} text={a.onscreenHe} nicheIcon={n?.icon} durationSec={trend.durationSec} size="sm" />
                    <p className="text-small font-bold">{n ? nicheShortName(n) : a.nicheSlug}</p>
                    <p className="text-micro font-normal text-text-2">{a.angleHe}</p>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel title={TREND_DETAIL.music.title}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet"><Music aria-hidden className="size-5" /></span>
                <dl className="grid flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-small">
                  <dt className="text-muted">{TREND_DETAIL.music.mood}</dt><dd>{trend.music.moodHe}</dd>
                  <dt className="text-muted">{TREND_DETAIL.music.bpm}</dt><dd><bdi className="num">{trend.music.bpmMin}–{trend.music.bpmMax}</bdi> BPM</dd>
                  <dt className="text-muted">{TREND_DETAIL.music.energy}</dt><dd>{MUSIC_ENERGY_LABEL[trend.music.energy]}</dd>
                </dl>
              </div>
              <p className="mt-4 rounded-sm bg-surface-2 p-3 text-small text-text-2">
                {trend.music.originalHadProtectedSong ? TREND_DETAIL.music.protectedNote : TREND_DETAIL.music.licensedNote}
              </p>
            </Panel>
            <Panel title={TREND_DETAIL.compliance.title}>
              <ul className="flex flex-col gap-2.5">
                {trend.complianceNotesHe.map((c) => (
                  <li key={c} className="flex gap-2.5 text-small">
                    <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title={TREND_DETAIL.score.title}>
            <HookScorePanel trend={trend} />
          </Panel>

          <Link href="/app/trends" className="inline-flex items-center gap-1 self-start text-small font-semibold text-link hover:underline">
            <DirIcon name="back" />
            {TREND_DETAIL.back}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
      <h2 className="text-h3">{title}</h2>
      {sub && <p className="mt-1 text-small text-text-2">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
