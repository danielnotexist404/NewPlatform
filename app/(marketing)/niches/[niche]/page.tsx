import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarHeart } from "lucide-react";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { SampleScripts } from "@/components/marketing/niches/sample-scripts";
import { ComplianceBox, CostBlock, RealAssetsBox } from "@/components/marketing/niches/blocks";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { isReel, reelFromHook } from "@/components/marketing/media/reel-data";
import { nicheVisualAt } from "@/components/marketing/media/props";
import { Band, Chip, Disclosure, HeroActions, MoreLink, PageHero } from "@/components/marketing/page/kit";
import { NicheCard } from "@/components/marketing/niches/niche-grid";
import { disclaimersFor, nicheContent } from "@/components/marketing/niches/niche-content";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { SeasonRail } from "@/components/hooks/season-rail";
import { hooksOfNiche, nicheHookCount, relatedNiches } from "@/components/hooks/hook-data";
import { createForNicheHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { getNiche, nicheCategories, niches, nicheShortName } from "@/lib/data/seed";
import { PLANS } from "@/lib/data/plans";
import { NICHES_COPY, REAL_ASSETS_NICHES } from "@/content/he/niches";

const P = NICHES_COPY.page;
const TRIAL = PLANS.find((p) => p.id === "free")?.oneTimeCredits ?? 70;

export function generateStaticParams() {
  return niches.map((n) => ({ niche: n.slug }));
}

type Props = { params: Promise<{ niche: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche: slug } = await params;
  const n = getNiche(slug);
  const c = nicheContent(slug);
  if (!n || !c) return {};
  const short = nicheShortName(n);
  return pageMeta({
    title: c.seo_title_he ?? P.title(short),
    short: P.titleShort(short),
    description: c.seo_description_he ?? P.description(short, TRIAL),
    path: `/niches/${slug}`,
    index: c.reviewed,
  });
}

export default function NichePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <NichePageView params={params} />
    </Suspense>
  );
}

async function NichePageView({ params }: Props) {
  const { niche: slug } = await params;
  const n = getNiche(slug);
  const content = nicheContent(slug);
  if (!n || !content) notFound();

  const short = nicheShortName(n);
  const category = nicheCategories.find((c) => c.slug === n.category_slug);
  const hooks = hooksOfNiche(slug);
  const heroHook = hooks[0];
  const [lead, ...rest] = content.landing_intro_he;
  const related = relatedNiches(n, 4);
  const createHref = createForNicheHref(slug);
  const faq = content.faq.map((f) => ({ q: f.q_he, a: f.a_he }));
  const crumbs = [
    { label: NICHES_COPY.crumbs.home, href: "/" },
    { label: NICHES_COPY.crumbs.niches, href: "/niches" },
    { label: short, href: `/niches/${slug}` },
  ];

  const reels = hooks.slice(0, 4).map((h, i) => reelFromHook(h.id, { ...nicheVisualAt(slug, i), caption: (["box", "shadow", "accent", "box"] as const)[i], viewsK: 18 + i * 13.4, highlight: 1 + i })).filter(isReel);
  const heroReel = heroHook ? reelFromHook(heroHook.id, { caption: "box", viewsK: 42.6, sponsored: true, highlight: 2 }) : null;

  return (
    <HooksProvider>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faq)]} />

      <PageHero
        align="split"
        eyebrow={<Chip><NicheIcon name={n.icon} className="size-4" />{category?.name_he}</Chip>}
        title="סרטון תדמית"
        accent={`ל${short}`}
        sub="הוקים, תסריט, קריינות וכתוביות בעברית. מוכן תוך דקות."
        actions={<HeroActions primary={P.primary(short)} primaryHref={createHref} secondary={P.secondary(short)} secondaryHref={`/hooks/${slug}`} />}
      >
        {heroReel && <ReelCard reel={heroReel} frame="phone" className="mx-auto w-full max-w-[290px]" label={P.phoneLabel(short)} />}
      </PageHero>

      {reels.length > 0 && (
        <Band id="videos" title={`סרטונים ל${short}`} sub="כל אחד מהם נוצר באשף, בעברית.">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4">
            {reels.map((r, i) => (
              <li key={r.key} className="flex flex-col gap-3">
                <ReelCard reel={r} offset={i * 1.6} lite />
                {n.video_types_he[i] && <p className="px-1 text-body font-bold text-text">{n.video_types_he[i]}</p>}
              </li>
            ))}
          </ul>
        </Band>
      )}

      {hooks.length > 0 && (
        <Band id="hooks" title={P.hooksTitle(short)}>
          <ul className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hooks.slice(0, 3).map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} showNiche={false} location="niche_page" />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <MoreLink href={`/hooks/${slug}`}>{plural(hooks.length, P.hooksAll)}</MoreLink>
          </div>
        </Band>
      )}

      <Band id="details" title="כל הפרטים" tight>
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {rest.length > 0 && (
            <Disclosure summary={P.moreTitle(short)}>
              <div className="prose-he max-w-none text-text-2">
                {[lead, ...rest].map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
              {REAL_ASSETS_NICHES.includes(slug) && (
                <div className="mt-6">
                  <RealAssetsBox text={NICHES_COPY.realAssets} extra={slug === "real-estate-developers" ? NICHES_COPY.realAssetsDevelopers : undefined} />
                </div>
              )}
            </Disclosure>
          )}
          {content.sample_scripts.length > 0 && (
            <Disclosure summary={P.scriptsTitle(short)}>
              <SampleScripts scripts={content.sample_scripts} hrefFor={(sc) => createForNicheHref(slug, "niche_page", sc.hook_id ?? undefined)} />
            </Disclosure>
          )}
          <Disclosure summary={P.seasonsTitle(short)}>
            <ul className="flex flex-col gap-3">
              {n.seasonal_angles_he.map((a) => (
                <li key={a} className="flex items-start gap-3 text-body">
                  <CalendarHeart className="mt-1 size-5 shrink-0 text-rose" aria-hidden />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <SeasonRail title={P.seasonsRail} nicheSlug={slug} limit={4} headingLevel="h3" className="mt-8 [&_ul]:md:grid-cols-2" />
          </Disclosure>
          {n.compliance_note_he && (
            <Disclosure summary="כללי פרסום בתחום">
              <ComplianceBox headingId="rules-title" note={n.compliance_note_he} disclaimers={disclaimersFor(n)} />
            </Disclosure>
          )}
          <Disclosure summary={P.costTitle(short)}>
            <CostBlock headingId="cost-title" title={P.costTitle(short)} />
          </Disclosure>
        </div>
      </Band>

      <Band id="faq" title="שאלות נפוצות">
        <FaqList items={faq.slice(0, 4).map((f, i) => ({ id: `${slug}-${i}`, q: f.q, a: f.a }))} className="mx-auto max-w-3xl" />
      </Band>

      {related.length > 0 && (
        <Band id="related" title={P.relatedTitle}>
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <NicheCard
                  n={{
                    slug: r.slug,
                    name: r.name_he,
                    short: nicheShortName(r),
                    icon: r.icon,
                    description: r.description_he,
                    category: r.category_slug,
                    hookCount: nicheHookCount(r.slug),
                    compliance: r.compliance_flag !== "none",
                  }}
                />
              </li>
            ))}
          </ul>
        </Band>
      )}

      <FinalCta title={P.finalTitle} subtitle={P.finalSub(short)} href={createHref} cta={P.finalCta} />
    </HooksProvider>
  );
}
