import type { Metadata } from "next";
import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheCard } from "@/components/marketing/niches/niche-grid";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { BrowseWhenIdle, WriteHooksCta } from "@/components/hooks/hook-explorer";
import { WhatIsHook } from "@/components/hooks/what-is-hook";
import { HookCard } from "@/components/hooks/hook-card";
import { HookOfTheDay } from "@/components/hooks/hook-of-the-day";
import { SeasonRail } from "@/components/hooks/season-rail";
import { HubHookExplorer } from "@/components/hooks/hub-explorer";
import {
  ALL_HOOKS, PAGE_PLATFORMS, featuredMix, hooksOfPlatform, nicheHookCount, typeHookCount, typesOfFamily, universalHooks,
  categoriesWithNiches, pageSeasons,
} from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { hookFamilies, hookTypes, niches, nicheShortName } from "@/lib/data/seed";
import { PLATFORM_LABEL } from "@/lib/labels";
import { HOOKS_COPY } from "@/content/he/hooks";

const H = HOOKS_COPY.hub;

export const metadata: Metadata = pageMeta({
  title: H.title,
  short: H.titleShort,
  description: plural(ALL_HOOKS.length, H.description),
  path: "/hooks",
});

function SectionTitle({ id, title, sub, action }: { id: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-h2">{title}</h2>
        {sub && <p className="mt-2 max-w-2xl text-text-2">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export default function HooksHubPage() {
  const crumbs = [{ label: HOOKS_COPY.crumbs.home, href: "/" }, { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" }];
  const featured = featuredMix(12);
  const universal = universalHooks();
  const hotdPool = ALL_HOOKS.filter((h) => h.featured);
  const groups = categoriesWithNiches();

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section id="hero" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklab,var(--color-violet)_16%,transparent),transparent_70%)]" />
        <div className="container-marketing relative pt-8 pb-8 md:pt-12">
          <Breadcrumbs items={crumbs} />
          <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center text-center">
            <p className="mb-5 inline-flex rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">{H.eyebrow}</p>
            <h1 className="text-h1">
              ספריית ההוקים בעברית: <span className="text-gold-gradient">משפטי פתיחה לסרטונים שעוצרים גלילה</span>
            </h1>
            <p className="mt-6 max-w-3xl text-body-lg text-text-2">{plural(ALL_HOOKS.length, H.intro)}</p>
            <dl className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {[
                { n: ALL_HOOKS.length, l: H.stats.hooks },
                { n: niches.length, l: H.stats.niches },
                { n: hookTypes.length, l: H.stats.types },
                { n: pageSeasons().length, l: H.stats.seasons },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2">
                  <dd className="order-1 text-h3 font-extrabold text-text"><Num value={s.n} /></dd>
                  <dt className="order-2 text-small text-muted">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="container-marketing">
        <HubHookExplorer />
      </div>

      <BrowseWhenIdle>
        <div className="container-marketing mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <HookOfTheDay pool={hotdPool} />
          <WhatIsHook />
        </div>

        <div className="container-marketing mt-14">
          <SeasonRail />
        </div>

        <section aria-labelledby="by-niche" className="container-marketing mt-20">
          <SectionTitle id="by-niche" title={H.sections.byNiche} sub={H.sections.byNicheSub} />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {groups.flatMap(({ niches: list }) => list).map((n) => (
              <li key={n.slug}>
                <NicheCard
                  compact
                  n={{ slug: n.slug, name: n.name_he, short: nicheShortName(n), icon: n.icon, description: n.description_he, category: n.category_slug, hookCount: nicheHookCount(n.slug), compliance: n.compliance_flag !== "none" }}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="by-type" className="container-marketing mt-20">
          <SectionTitle
            id="by-type"
            title={H.sections.byType}
            sub={H.sections.byTypeSub}
            action={
              <Link href="/hooks/types" className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline">
                {HOOKS_COPY.types.h1} <DirIcon name="forward" />
              </Link>
            }
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hookFamilies.map((f, i) => (
              <li key={f.slug} className="flex flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <span className="num text-[1.75rem] font-extrabold leading-none text-primary-text/60">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-body-lg font-bold">{f.name_he}</h3>
                <p className="text-small text-text-2">{f.description_he}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {typesOfFamily(f.slug).map((t) => (
                    <li key={t.slug}>
                      <Link href={`/hooks/types/${t.slug}`} className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-1 text-micro text-text-2 hover:bg-lemon hover:text-on-primary">
                        {t.name_he}
                        <span className="num font-normal opacity-70">{typeHookCount(t.slug)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="featured" className="container-marketing mt-20">
          <SectionTitle id="featured" title={H.sections.featured} sub={H.sections.featuredSub} />
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} location="hub" />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="by-platform" className="container-marketing mt-20">
          <SectionTitle id="by-platform" title={H.sections.byPlatform} sub={H.sections.byPlatformSub} />
          <ul className="flex flex-wrap gap-2">
            {PAGE_PLATFORMS.map((p) => (
              <li key={p}>
                <Link
                  href={`/hooks/platform/${p}`}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-1 px-5 py-3 font-semibold shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2"
                >
                  {PLATFORM_LABEL[p]}
                  <span className="num rounded-full bg-surface-3 px-2 text-micro text-text-2">{hooksOfPlatform(p).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="universal" className="container-marketing mt-20">
          <SectionTitle id="universal" title={H.sections.universal} sub={H.sections.universalSub} />
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {universal.map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} location="hub" />
              </li>
            ))}
          </ul>
        </section>
      </BrowseWhenIdle>

      <section className="container-marketing mt-20">
        <WriteHooksCta title={H.endCta.title} body={H.endCta.body} button={H.endCta.button} />
      </section>
    </HooksProvider>
  );
}
