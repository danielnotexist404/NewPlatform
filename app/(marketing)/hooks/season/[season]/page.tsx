import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Megaphone, MoonStar, StickyNote } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { cn } from "@/lib/utils";
import { HeroGlow, PageHero, h2Class } from "@/components/marketing/page/kit";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { SmartText } from "@/components/hooks/hook-text";
import { QuietAwareCta, SeasonCountdown } from "@/components/hooks/season-status";
import { hasSeasonPage, hooksOfNiche, hooksOfSeason, pageSeasons, placeholdersIn } from "@/components/hooks/hook-data";
import { seasonCreateHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { shortDateHe } from "@/components/hooks/text";
import { getNiche, getSeason, nicheShortName } from "@/lib/data/seed";
import { HOOKS_COPY, QUIET_OVERLAPS, SEASON_DATES, SEASON_PAGES } from "@/content/he/hooks";

const S = HOOKS_COPY.season;

export function generateStaticParams() {
  return pageSeasons().map((s) => ({ season: s.slug }));
}

type Props = { params: Promise<{ season: string }> };

function h1For(slug: string): string | null {
  const page = SEASON_PAGES[slug];
  if (!page) return null;
  const year = (SEASON_DATES[slug]?.start ?? "").slice(0, 4);
  return page.h1.replace("{year}", year).trim();
}

/** Quiet days and the election have no page: 404 and no links (Part 02 §5.8). */
function load(slug: string) {
  const s = getSeason(slug);
  if (!s || !hasSeasonPage(slug)) return null;
  const h1 = h1For(slug);
  if (!h1) return null;
  return { s, h1 };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { season } = await params;
  const d = load(season);
  if (!d) return {};
  const own = hooksOfSeason(season).length;
  const nicheShown = d.s.niche_slugs.length * 2;
  return pageMeta({
    title: S.title(d.h1),
    short: d.h1,
    description: S.description(d.h1),
    path: `/hooks/season/${season}`,
    // Thin-content rule (§5.8/§12.2): intro exists and ≥ 8 hooks shown in total.
    index: own + nicheShown >= 8,
  });
}

export default function SeasonPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SeasonPageView params={params} />
    </Suspense>
  );
}

async function SeasonPageView({ params }: Props) {
  const { season } = await params;
  const d = load(season);
  if (!d) notFound();
  const { s, h1 } = d;
  const own = hooksOfSeason(season);
  const nicheBlocks = s.niche_slugs
    .map((slug) => getNiche(slug))
    .filter((n): n is NonNullable<typeof n> => !!n)
    .map((n) => {
      const hooks = hooksOfNiche(n.slug);
      const picks = [...hooks.filter((h) => h.seasonSlug === season), ...hooks.filter((h) => h.seasonSlug !== season)].slice(0, 2);
      return { n, picks };
    });
  const quietSlug = QUIET_OVERLAPS[season];
  const quiet = quietSlug ? getSeason(quietSlug) : undefined;
  const quietDate = quietSlug ? SEASON_DATES[quietSlug]?.start : undefined;
  const firstHook = own[0] ?? nicheBlocks[0]?.picks[0];
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: HOOKS_COPY.crumbs.seasons, href: "/hooks#season-rail-title" },
    { label: s.name_he, href: `/hooks/season/${season}` },
  ];
  const fields = placeholdersIn([...own, ...nicheBlocks.flatMap((b) => b.picks)]);

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero align="split" eyebrow={<SeasonCountdown slug={season} />} title={<SmartText text={h1} />} sub={<SmartText text={SEASON_PAGES[season].intro[0] ?? ""} />}>
            <aside className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-[28px] bg-surface-1 p-7 elev-3 ring-hairline">
              <div className="flex gap-3">
                <CalendarDays className="mt-1 size-5 shrink-0 text-primary-text" aria-hidden />
                <div>
                  <p className="text-micro text-muted">{S.when} <span className="font-normal">({S.approx})</span></p>
                  <p className="font-semibold"><SmartText text={s.date_hint_he} /></p>
                </div>
              </div>
              <div className="flex gap-3">
                <Megaphone className="mt-1 size-5 shrink-0 text-primary-text" aria-hidden />
                <div>
                  <p className="text-micro text-muted">{S.publish}</p>
                  <p className="font-semibold"><SmartText text={s.publish_window_he} /></p>
                </div>
              </div>
              {s.note_he && (
                <div className="flex gap-3">
                  <StickyNote className="mt-1 size-5 shrink-0 text-muted" aria-hidden />
                  <p className="text-small text-text-2"><SmartText text={s.note_he} /></p>
                </div>
              )}
              {quiet && quietDate && (
                <p role="note" className="flex gap-2 rounded-md bg-surface-2 p-3 text-small text-text">
                  <MoonStar className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {S.quietWarn(shortDateHe(quietDate), quiet.name_he)}
                </p>
              )}
            </aside>
      </PageHero>

      <div className="container-marketing flex flex-col gap-8">
        {fields.length > 0 && <HookPersonalizer fields={fields} />}
        <section aria-labelledby="season-hooks">
          <h2 id="season-hooks" className={cn(h2Class, "mb-10 text-center")}>{S.hooks}</h2>
          {own.length > 0 ? (
            <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {own.map((h) => (
                <li key={h.id} className="contents"><HookCard hook={h} location="season_page" /></li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md bg-surface-1 p-5 text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{S.hooksEmpty}</p>
          )}
        </section>
      </div>

      {nicheBlocks.length > 0 && (
        <section aria-labelledby="season-niches" className="container-marketing py-16 md:py-24">
          <h2 id="season-niches" className={cn(h2Class, "mb-10 text-center")}>{S.niches}</h2>
          <div className="flex flex-col gap-10">
            {nicheBlocks.slice(0, 3).map(({ n, picks }) => {
              const short = nicheShortName(n);
              return (
                <div key={n.slug} className="rounded-[28px] bg-surface-2 p-5 ring-hairline md:p-7">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-h3">
                      <NicheIcon name={n.icon} className="size-5 text-primary-text" />
                      {short}
                    </h3>
                    <Link href={`/hooks/${n.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-text hover:underline">
                      {S.nicheAll(short)} <DirIcon name="forward" />
                    </Link>
                  </div>
                  <ul className="grid items-start gap-4 md:grid-cols-2">
                    {picks.map((h) => (
                      <li key={h.id} className="contents"><HookCard hook={h} variant="compact" showNiche={false} location="season_page" /></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="container-marketing pb-8">
        <div className="relative overflow-hidden rounded-[40px] bg-surface-1 p-8 text-center ring-hairline md:p-16">
          <HeroGlow />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className={h2Class}><SmartText text={h1} /></h2>
            <QuietAwareCta href={seasonCreateHref(season, firstHook?.id)} label={S.cta} sub={S.ctaSub} />
          </div>
        </div>
      </section>
    </HooksProvider>
  );
}
