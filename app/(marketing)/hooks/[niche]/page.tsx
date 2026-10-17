import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { Breadcrumbs, JsonLd, absUrl, breadcrumbJsonLd, faqJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { NicheCard } from "@/components/marketing/niches/niche-grid";
import { SampleScripts } from "@/components/marketing/niches/sample-scripts";
import { ComplianceBox, FaqList } from "@/components/marketing/niches/blocks";
import { disclaimersFor, nicheContent } from "@/components/marketing/niches/niche-content";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookExplorer, WriteHooksCta } from "@/components/hooks/hook-explorer";
import { HookCard } from "@/components/hooks/hook-card";
import { ExpandableIntro } from "@/components/hooks/expandable-intro";
import { ALL_HOOKS, hooksOfNiche, nicheHookCount, placeholdersIn, relatedNiches, universalHooks, byPopular } from "@/components/hooks/hook-data";
import { createForNicheHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { plural, todayIL } from "@/components/hooks/text";
import { getNiche, niches, nicheShortName, seasons } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";
import { HOOKS_COPY } from "@/content/he/hooks";

const N = HOOKS_COPY.niche;

export function generateStaticParams() {
  return niches.map((n) => ({ niche: n.slug }));
}

/** Year in Israel, refreshed by revalidation (Part 02 §5.6: `year` = current year, Asia/Jerusalem). */
async function yearIL(): Promise<string> {
  "use cache";
  cacheLife("days");
  return todayIL().slice(0, 4);
}

type Props = { params: Promise<{ niche: string }> };

/** Indexable only with reviewed text and ≥ 8 hooks (Part 02 §5.6). */
const indexable = (slug: string) => !!nicheContent(slug)?.reviewed && nicheHookCount(slug) >= 8;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche: slug } = await params;
  const n = getNiche(slug);
  if (!n) return {};
  const short = nicheShortName(n);
  const count = nicheHookCount(slug);
  const year = await yearIL();
  return pageMeta({
    title: N.titleFull(short, plural(count, N.sentences), year),
    short: N.titleShort(short, year),
    description: N.description(plural(count, N.hooksCount), short),
    path: `/hooks/${slug}`,
    canonical: indexable(slug) ? `/hooks/${slug}` : "/hooks",
    index: indexable(slug),
  });
}

export default function HooksNichePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HooksNichePageView params={params} />
    </Suspense>
  );
}

async function HooksNichePageView({ params }: Props) {
  const { niche: slug } = await params;
  const n = getNiche(slug);
  const content = nicheContent(slug);
  if (!n || !content) notFound();
  const short = nicheShortName(n);
  const year = await yearIL();
  const hooks = hooksOfNiche(slug);
  const seasonSlugs = seasons.filter((s) => s.niche_slugs.includes(slug) && !s.is_quiet_day).map((s) => s.slug);
  const seasonal = [
    ...hooks.filter((h) => h.seasonSlug),
    ...ALL_HOOKS.filter((h) => h.nicheSlug === null && h.seasonSlug && seasonSlugs.includes(h.seasonSlug)),
  ].sort(byPopular);
  const universal = universalHooks().slice(0, 4);
  const related = relatedNiches(n, 6);
  const fields = placeholdersIn([...hooks, ...seasonal, ...universal]);
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: short, href: `/hooks/${slug}` },
  ];
  const faq = N.faq.map((f) => ({ q: f.q, a: typeof f.a === "function" ? f.a(BRAND.nameHeWith.b) : f.a }));
  const isEmpty = hooks.length === 0;

  return (
    <HooksProvider>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: hooks.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: h.text, url: absUrl(`/hooks/${slug}#${h.id}`) })),
          },
          faqJsonLd(faq),
        ]}
      />
      <section id="hero" className="container-marketing pt-8 pb-8 md:pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 max-w-5xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">
            <NicheIcon name={n.icon} className="size-3.5" />
            {n.name_he}
          </p>
          <h1 className="text-h1">{N.h1(short, plural(hooks.length, N.sentences), year)}</h1>
          <ExpandableIntro paragraphs={content.seo_intro_he} more={N.readMore} less={N.readLess} className="mt-6" />
        </div>
      </section>

      <div className="container-marketing">
        {isEmpty ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg bg-surface-1 p-8 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <h2 className="text-h3">{HOOKS_COPY.empty.nicheNoHooks.title}</h2>
              <p className="mt-2 text-text-2">{HOOKS_COPY.empty.nicheNoHooks.body}</p>
            </div>
            <ul className="grid items-start gap-4 md:grid-cols-2">
              {universalHooks().map((h) => (
                <li key={h.id} className="contents"><HookCard hook={h} location="hook_niche_page" /></li>
              ))}
            </ul>
          </div>
        ) : (
          <HookExplorer
            hooks={hooks}
            mode="niche"
            nicheSlug={slug}
            facets={["type", "platform", "goal", "gender"]}
            personalizerFields={fields}
            showNicheChip={false}
            location="hook_niche_page"
            searchPlaceholder={`חיפוש בהוקים ל${short}`}
          />
        )}
      </div>

      {content.sample_scripts.length > 0 && (
        <section aria-labelledby="scripts-title" className="container-marketing mt-20">
          <h2 id="scripts-title" className="mb-6 text-h2">{N.scripts(short)}</h2>
          <SampleScripts scripts={content.sample_scripts} hrefFor={(s) => createForNicheHref(slug, "hooks", s.hook_id ?? undefined)} />
        </section>
      )}

      {seasonal.length >= 2 && (
        <section aria-labelledby="seasonal-title" className="container-marketing mt-20">
          <h2 id="seasonal-title" className="mb-6 text-h2">{N.seasonal(short)}</h2>
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {seasonal.slice(0, 6).map((h) => (
              <li key={h.id} className="contents"><HookCard hook={h} showNiche={h.nicheSlug !== slug} location="hook_niche_page" /></li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="universal-title" className="container-marketing mt-20">
        <h2 id="universal-title" className="mb-6 text-h2">{N.universal(short)}</h2>
        <ul className="grid items-start gap-4 md:grid-cols-2">
          {universal.map((h) => (
            <li key={h.id} className="contents"><HookCard hook={h} location="hook_niche_page" /></li>
          ))}
        </ul>
      </section>

      {n.compliance_note_he && (
        <section aria-labelledby="rules-title" className="container-marketing mt-20">
          <ComplianceBox headingId="rules-title" note={n.compliance_note_he} disclaimers={disclaimersFor(n)} />
        </section>
      )}

      <section aria-labelledby="faq-title" className="container-marketing mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 id="faq-title" className="text-h2">{N.faqTitle(short)}</h2>
          <FaqList items={faq} idPrefix={`hooks-${slug}`} />
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-marketing mt-20">
          <h2 id="related-title" className="mb-6 text-h2">{N.related}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <NicheCard
                  compact
                  n={{ slug: r.slug, name: r.name_he, short: nicheShortName(r), icon: r.icon, description: r.description_he, category: r.category_slug, hookCount: nicheHookCount(r.slug), compliance: r.compliance_flag !== "none" }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-marketing mt-20">
        <WriteHooksCta title={N.cta.title} body={N.cta.body} button={N.cta.button} niche={slug} secondary={{ href: `/niches/${slug}`, label: N.cta.nicheLink(short) }} />
      </section>
    </HooksProvider>
  );
}
