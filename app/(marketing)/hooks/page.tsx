import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { Band, MoreLink, PageHero } from "@/components/marketing/page/kit";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { BrowseWhenIdle } from "@/components/hooks/hook-explorer";
import { HookCard } from "@/components/hooks/hook-card";
import { HubHookExplorer } from "@/components/hooks/hub-explorer";
import { ALL_HOOKS, featuredMix, nicheHookCount, categoriesWithNiches } from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { nicheShortName } from "@/lib/data/seed";
import { HOOKS_COPY } from "@/content/he/hooks";
const H = HOOKS_COPY.hub;

export const metadata: Metadata = pageMeta({
  title: H.title,
  short: H.titleShort,
  description: plural(ALL_HOOKS.length, H.description),
  path: "/hooks",
});

export default function HooksHubPage() {
  const crumbs = [{ label: HOOKS_COPY.crumbs.home, href: "/" }, { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" }];
  const featured = featuredMix(6);
  const groups = categoriesWithNiches();

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero title="ספריית ההוקים." accent="משפטים שעוצרים גלילה." sub={`${ALL_HOOKS.length.toLocaleString("he-IL")} הוקים בעברית, לכל נישה. חינם להעתקה.`}>
        <div className="mx-auto max-w-5xl text-start">
          <HubHookExplorer />
        </div>
      </PageHero>

      <BrowseWhenIdle>
        <Band id="featured" title={H.sections.featured}>
          <ul className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} location="hub" />
              </li>
            ))}
          </ul>
        </Band>

        <Band id="by-niche" title={H.sections.byNiche}>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {groups.flatMap(({ niches: list }) => list).map((n) => (
              <li key={n.slug}>
                <Link href={`/hooks/${n.slug}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-surface-1 px-5 text-body font-semibold text-text ring-hairline transition-colors hover:bg-surface-2">
                  <NicheIcon name={n.icon} className="size-4 text-primary-text" />
                  {nicheShortName(n)}
                  <span className="num text-small font-normal text-muted">{nicheHookCount(n.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <MoreLink href="/hooks/types">{HOOKS_COPY.types.h1}</MoreLink>
          </div>
        </Band>
      </BrowseWhenIdle>

      <FinalCta title={H.endCta.title} subtitle={H.endCta.body} />
    </HooksProvider>
  );
}
