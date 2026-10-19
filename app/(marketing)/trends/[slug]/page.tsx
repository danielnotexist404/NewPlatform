import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, CheckCircle2, Wand2 } from "lucide-react";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { TrendCard } from "@/components/marketing/trends/trend-card";
import { trendReel } from "@/components/marketing/trends/trend-reel";
import { AdSafetyBadge, ProductionBadge } from "@/components/marketing/trends/trend-badges";
import { FirstSeconds, RecipeStrip } from "@/components/marketing/trends/first-seconds";
import { Band, Disclosure, MoreLink, PageHero } from "@/components/marketing/page/kit";
import { accentCta, ctaArrow, quietCta } from "@/components/layout/cta-styles";
import { DirIcon } from "@/components/a11y/dir-icon";
import { AD_SAFETY, TREND_PAGE } from "@/content/he/trends";
import { getTrend, publishedTrends, TREND_MUSIC_NOTE_HE } from "@/lib/mock/trends";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const createHref = (slug: string, mode?: "guided") =>
  `/login?next=${encodeURIComponent(`/app/create?trend=${slug}&src=trend${mode ? `&mode=${mode}` : ""}`)}`;

/** Renders "{placeholder}" slots as soft chips. */
function Pattern({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{[^}]+\})/).map((part, i) =>
        part.startsWith("{") ? (
          <span key={i} className="mx-0.5 rounded-[8px] bg-primary/15 px-1.5 py-0.5 text-primary-text">{part.slice(1, -1)}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function generateStaticParams() {
  return publishedTrends().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTrend(slug);
  if (!t) return {};
  return {
    title: t.seo_title_he,
    description: t.seo_description_he,
    alternates: { canonical: `/trends/${t.slug}` },
    openGraph: { title: t.seo_title_he, description: t.seo_description_he, url: `/trends/${t.slug}` },
  };
}

export default function TrendPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
      <TrendPageView params={params} />
    </Suspense>
  );
}

async function TrendPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTrend(slug);
  if (!t || t.status !== "published") notFound();

  const safety = AD_SAFETY[t.ad_safety];
  const offersGuided = t.production_mode !== "ai";
  const offersAi = t.production_mode !== "guided";
  const more = publishedTrends()
    .filter((x) => x.slug !== t.slug)
    .sort((a, b) => Number(b.lifecycle === t.lifecycle) - Number(a.lifecycle === t.lifecycle))
    .slice(0, 4);
  const crumbs = [
    { label: "ראשי", href: "/" },
    { label: TREND_PAGE.breadcrumbHub, href: "/trends" },
    { label: t.name_he, href: `/trends/${t.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs, BRAND.domain),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `איך עושים את הטרנד "${t.name_he}" לעסק`,
            description: t.description_he,
            totalTime: `PT${t.default_duration_sec}S`,
            step: t.explainer.how_to_he.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title_he, text: s.body_he })),
          },
          faqLd(t.explainer.faq_he),
        ]}
      />

      <PageHero
        align="split"
        eyebrow={<div className="flex flex-wrap gap-2"><AdSafetyBadge safety={t.ad_safety} /><ProductionBadge mode={t.production_mode} /></div>}
        title={t.name_he}
        sub={t.tagline_he}
        actions={
          <>
            {offersAi && (
              <Link href={createHref(t.slug)} className={cn(accentCta, "h-14 w-full px-8 text-lg sm:w-auto")}>
                <Wand2 aria-hidden className="size-5" />
                {TREND_PAGE.ctaAi}
                <DirIcon name="forward" className={ctaArrow} />
              </Link>
            )}
            {offersGuided && (
              <Link href={createHref(t.slug, "guided")} className={cn(quietCta, "h-14 px-6 text-base ring-hairline")}>
                <Camera aria-hidden className="size-5" />
                {TREND_PAGE.ctaGuided}
              </Link>
            )}
          </>
        }
      >
        <figure className="mx-auto w-full max-w-[300px]">
          <ReelCard reel={trendReel(t)} frame="phone" label={`${TREND_PAGE.demoTag}: ${t.name_he}`} />
          <figcaption className="mt-4 text-center text-small text-muted">{TREND_PAGE.demoNote}</figcaption>
        </figure>
      </PageHero>

      <Band id="first3" title={TREND_PAGE.firstSecondsTitle}>
        <div className="mx-auto max-w-5xl">
          <FirstSeconds items={t.explainer.first_seconds_he} />
        </div>
      </Band>

      <Band id="niches" title={TREND_PAGE.nichesTitle} className="overflow-x-clip">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4">
          {t.niche_adaptations.slice(0, 4).map((a, i) => {
            const n = getNiche(a.niche_slug);
            return (
              <li key={a.niche_slug} className="flex flex-col gap-3">
                <ReelCard reel={trendReel(t, a.niche_slug, i)} offset={i * 1.4} lite />
                <p className="px-1 text-body font-bold text-text">{n ? nicheShortName(n) : a.niche_slug}</p>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band id="hooks" title={TREND_PAGE.hooksTitle} sub="מעלים את שלושתן לקמפיין אחד, ורואים איזו עובדת.">
        <ul className="grid gap-5 md:grid-cols-3">
          {t.hook_variants.map((h) => (
            <li key={h.key} className="flex flex-col gap-4 rounded-[28px] bg-surface-1 p-7 ring-hairline">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-gradient text-h3 font-black text-ink">{h.key}</span>
              <p className="text-h3 font-bold leading-[1.6] text-text"><Pattern text={h.hook_line_he_pattern} /></p>
            </li>
          ))}
        </ul>
      </Band>

      <Band id="details" title="כל הפרטים" tight>
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <Disclosure summary={TREND_PAGE.whyTitle}>
            <p className="text-body-lg text-text-2">{t.why_it_works_he}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {t.explainer.why_it_works_he.map((w) => (
                <li key={w} className="flex gap-3 text-body">
                  <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-primary-text" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Disclosure>
          <Disclosure summary={TREND_PAGE.recipeTitle}>
            <RecipeStrip beats={t.recipe.beats} />
          </Disclosure>
          {t.shot_list && offersGuided && (
            <Disclosure summary={TREND_PAGE.shotListTitle}>
              <p className="mb-5 text-body text-text-2">{TREND_PAGE.shotListBody}</p>
              <ol className="grid gap-3 md:grid-cols-3">
                {t.shot_list.shots.map((sh, i) => (
                  <li key={sh.key} className="rounded-[18px] bg-surface-2 p-4">
                    <p className="font-bold"><span className="num text-muted">{i + 1}. </span>{sh.title_he}</p>
                    <p className="mt-1 text-small text-text-2">{sh.instruction_he}</p>
                    <p className="mt-2 text-micro text-muted">{TREND_PAGE.shotSeconds(sh.min_sec, sh.max_sec)}</p>
                  </li>
                ))}
              </ol>
            </Disclosure>
          )}
          <Disclosure summary={TREND_PAGE.complianceTitle}>
            <div className="flex flex-col gap-4 text-body text-text-2">
              <p><strong className="text-text">{safety.title}.</strong> {safety.body}</p>
              <p><strong className="text-text">{TREND_PAGE.musicTitle}.</strong> {TREND_MUSIC_NOTE_HE}</p>
              <ul className="flex list-disc flex-col gap-2 ps-5">
                {t.compliance_notes_he.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </Disclosure>
        </div>
      </Band>

      <Band id="faq" title={TREND_PAGE.faqTitle}>
        <FaqList items={t.explainer.faq_he.slice(0, 4).map((f, i) => ({ id: `${t.slug}-${i}`, q: f.q_he, a: f.a_he }))} className="mx-auto max-w-3xl" />
      </Band>

      <Band id="more" title={TREND_PAGE.moreTitle}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {more.map((m, i) => (
            <li key={m.slug} className="flex">
              <TrendCard trend={m} index={i + 1} className="w-full" />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center"><MoreLink href="/trends">{TREND_PAGE.moreLink}</MoreLink></div>
      </Band>

      <FinalCta title={TREND_PAGE.ctaAi} subtitle={TREND_PAGE.ctaNote} />
    </>
  );
}
