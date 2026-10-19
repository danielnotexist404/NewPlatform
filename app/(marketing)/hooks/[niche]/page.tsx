import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { JsonLd, absUrl, breadcrumbJsonLd, faqJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { SampleScripts } from "@/components/marketing/niches/sample-scripts";
import { ComplianceBox } from "@/components/marketing/niches/blocks";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { Band, Chip, Disclosure, PageHero } from "@/components/marketing/page/kit";
import { disclaimersFor, nicheContent } from "@/components/marketing/niches/niche-content";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookExplorer } from "@/components/hooks/hook-explorer";
import { HookCard } from "@/components/hooks/hook-card";
import { hooksOfNiche, nicheHookCount, placeholdersIn, relatedNiches, universalHooks } from "@/components/hooks/hook-data";
import { createForNicheHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { plural, todayIL } from "@/components/hooks/text";
import { getNiche, niches, nicheShortName } from "@/lib/data/seed";
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
  const related = relatedNiches(n, 6);
  const fields = placeholdersIn(hooks);
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
      <PageHero
        eyebrow={<Chip><NicheIcon name={n.icon} className="size-4" />{n.name_he}</Chip>}
        title={N.h1(short, plural(hooks.length, N.sentences), year)}
        sub="מעתיקים, מתאימים לעסק, והופכים לסרטון בלחיצה."
        className="pb-4 md:pb-8"
      />

      <div className="container-marketing">
        {isEmpty ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] bg-surface-1 p-8 ring-hairline">
              <h2 className="text-h3">{HOOKS_COPY.empty.nicheNoHooks.title}</h2>
              <p className="mt-2 text-text-2">{HOOKS_COPY.empty.nicheNoHooks.body}</p>
            </div>
            <ul className="grid items-start gap-5 md:grid-cols-2">
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

      <Band id="details" title="עוד לפני שמתחילים" tight className="mt-10">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <Disclosure summary={`על הוקים ל${short}`}>
            <div className="prose-he max-w-none text-text-2">
              {content.seo_intro_he.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </Disclosure>
          {content.sample_scripts.length > 0 && (
            <Disclosure summary={N.scripts(short)}>
              <SampleScripts scripts={content.sample_scripts} hrefFor={(sc) => createForNicheHref(slug, "hooks", sc.hook_id ?? undefined)} />
            </Disclosure>
          )}
          {n.compliance_note_he && (
            <Disclosure summary="כללי פרסום בתחום">
              <ComplianceBox headingId="rules-title" note={n.compliance_note_he} disclaimers={disclaimersFor(n)} />
            </Disclosure>
          )}
        </div>
      </Band>

      <Band id="faq" title="שאלות נפוצות">
        <FaqList items={faq.slice(0, 4).map((f, i) => ({ id: `hooks-${slug}-${i}`, q: f.q, a: f.a }))} className="mx-auto max-w-3xl" />
      </Band>

      {related.length > 0 && (
        <Band id="related" title={N.related} tight>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/hooks/${r.slug}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-surface-1 px-5 text-body font-semibold text-text ring-hairline hover:bg-surface-2">
                  <NicheIcon name={r.icon} className="size-4 text-primary-text" />
                  {nicheShortName(r)}
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      )}

      <FinalCta title={N.cta.title} subtitle={N.cta.body} href={createForNicheHref(slug)} />
    </HooksProvider>
  );
}
