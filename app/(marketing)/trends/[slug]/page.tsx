import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Ban, Camera, CheckCircle2, Megaphone, Music2, Wand2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, SampleTag, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList } from "@/components/marketing/gallery/faq-list";
import { TrendArt } from "@/components/marketing/trends/trend-art";
import { TrendCard } from "@/components/marketing/trends/trend-card";
import { AdSafetyBadge, ProductionBadge, TrendLifecycleBadge } from "@/components/marketing/trends/trend-badges";
import { FirstSeconds, RecipeStrip } from "@/components/marketing/trends/first-seconds";
import { AD_SAFETY, LIFECYCLE_LABEL, PRODUCTION_LABEL, TREND_PAGE } from "@/content/he/trends";
import { getTrend, publishedTrends, TREND_MUSIC_NOTE_HE, type AdGoal } from "@/lib/mock/trends";
import { getHookType, getNiche, nicheShortName } from "@/lib/data/seed";
import { CAMPAIGN_GOAL_LABEL } from "@/lib/labels";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const GOAL_KEY: Record<AdGoal, keyof typeof CAMPAIGN_GOAL_LABEL> = {
  whatsapp_messages: "whatsapp",
  lead_form: "lead_form",
  website_traffic: "traffic",
  local_awareness: "awareness",
};

const createHref = (slug: string, mode?: "guided") =>
  `/login?next=${encodeURIComponent(`/app/create?trend=${slug}&src=trend${mode ? `&mode=${mode}` : ""}`)}`;

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

export default async function TrendPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTrend(slug);
  if (!t || t.status !== "published") notFound();

  const hookType = getHookType(t.hook_type_slug);
  const safety = AD_SAFETY[t.ad_safety];
  const organic = t.ad_safety === "organic_only";
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

      {/* ---------- Hero ---------- */}
      <section id="hero" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
        <div className="container-marketing relative grid gap-10 pb-14 pt-8 md:pt-12 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-5">
            <Breadcrumbs items={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))} />
            <div className="flex flex-wrap gap-2">
              <TrendLifecycleBadge stage={t.mock_stage} />
              <AdSafetyBadge safety={t.ad_safety} />
              <ProductionBadge mode={t.production_mode} />
            </div>
            <h1 className="font-display text-display leading-[0.95]">{t.name_he}</h1>
            <p className="text-h3 max-w-2xl font-semibold text-text">{t.tagline_he}</p>
            <p className="text-body-lg max-w-2xl text-text-2">{t.description_he}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              {offersAi && (
                <Link href={createHref(t.slug)} className={buttonVariants({ size: "lg" })}>
                  <Wand2 aria-hidden />
                  {TREND_PAGE.ctaAi}
                </Link>
              )}
              {offersGuided && (
                <Link href={createHref(t.slug, "guided")} className={buttonVariants({ size: "lg", variant: offersAi ? "secondary" : "primary" })}>
                  <Camera aria-hidden />
                  {TREND_PAGE.ctaGuided}
                </Link>
              )}
            </div>
            <p className="text-small text-muted">{TREND_PAGE.ctaNote}</p>

            <dl className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border sm:grid-cols-4">
              {[
                { k: TREND_PAGE.facts.hookType, v: hookType?.name_he ?? t.hook_type_slug },
                { k: TREND_PAGE.facts.duration, v: TREND_PAGE.facts.seconds(t.default_duration_sec) },
                { k: TREND_PAGE.facts.production, v: PRODUCTION_LABEL[t.production_mode] },
                { k: TREND_PAGE.facts.goal, v: t.recommended_ad_goal ? CAMPAIGN_GOAL_LABEL[GOAL_KEY[t.recommended_ad_goal]] : TREND_PAGE.facts.noGoal },
              ].map((f) => (
                <div key={f.k} className="bg-surface-1 px-4 py-3">
                  <dt className="text-micro text-muted">{f.k}</dt>
                  <dd className="mt-0.5 font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="mx-auto w-full max-w-[340px]">
            <div className="rounded-[34px] bg-surface-2 p-2.5 elev-3 shadow-[inset_0_0_0_1px_var(--color-frame)] glow-primary">
              <TrendArt trend={t} size="lg" className="rounded-[26px]" tag={<SampleTag>{TREND_PAGE.demoTag}</SampleTag>} />
            </div>
            <figcaption className="mt-3 text-center text-small text-muted">{TREND_PAGE.demoNote}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- First 3 seconds ---------- */}
      <section aria-labelledby="first3" className="container-marketing py-14">
        <div className="rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-10">
          <Eyebrow>{TREND_PAGE.breakdownEyebrow}</Eyebrow>
          <h2 id="first3" className="text-h2 mt-4">
            {TREND_PAGE.firstSecondsTitle}
          </h2>
          <div className="mt-8">
            <FirstSeconds items={t.explainer.first_seconds_he} />
          </div>
        </div>
      </section>

      {/* ---------- Why + ad safety ---------- */}
      <section aria-labelledby="why" className="container-marketing grid gap-6 py-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 id="why" className="text-h2">
            {TREND_PAGE.whyTitle}
          </h2>
          <p className="text-body-lg mt-4 max-w-2xl text-text-2">{t.why_it_works_he}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {t.explainer.why_it_works_he.map((w) => (
              <li key={w} className="flex gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-text" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside
          aria-labelledby="ad-safety"
          className={cn(
            "flex flex-col gap-3 self-start rounded-lg p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]",
            organic ? "bg-danger/10" : "bg-success/10",
          )}
        >
          <span className={cn("flex size-11 items-center justify-center rounded-full", organic ? "bg-danger/15 text-danger" : "bg-success/15 text-success")}>
            {organic ? <Ban aria-hidden className="size-5" /> : <Megaphone aria-hidden className="size-5" />}
          </span>
          <h2 id="ad-safety" className="text-h3">
            {safety.title}
          </h2>
          <p className="text-text-2">{safety.body}</p>
        </aside>
      </section>

      {/* ---------- Recipe ---------- */}
      <section aria-labelledby="recipe" className="container-marketing py-14">
        <h2 id="recipe" className="text-h2">
          {TREND_PAGE.recipeTitle}
        </h2>
        <div className="mt-6">
          <RecipeStrip beats={t.recipe.beats} />
        </div>
      </section>

      {/* ---------- How to ---------- */}
      <section aria-labelledby="howto" className="container-marketing py-6">
        <h2 id="howto" className="text-h2">
          {TREND_PAGE.howTitle}
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.explainer.how_to_he.map((s, i) => (
            <li key={s.title_he} className="relative flex flex-col gap-2 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-on-primary num">{i + 1}</span>
              <h3 className="text-body-lg font-bold">{s.title_he}</h3>
              <p className="text-text-2">{s.body_he}</p>
            </li>
          ))}
        </ol>

        {t.shot_list && offersGuided && (
          <div className="mt-8 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
            <div className="flex items-center gap-3">
              <Camera aria-hidden className="size-5 text-primary-text" />
              <h3 className="text-h3">{TREND_PAGE.shotListTitle}</h3>
            </div>
            <p className="mt-2 max-w-2xl text-text-2">{TREND_PAGE.shotListBody}</p>
            <ol className="mt-5 grid gap-3 md:grid-cols-3">
              {t.shot_list.shots.map((s, i) => (
                <li key={s.key} className="rounded-md bg-surface-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">
                      <span className="text-muted num">{i + 1}. </span>
                      {s.title_he}
                    </span>
                    <span className="rounded-xs bg-surface-3 px-1.5 py-0.5 text-micro text-text-2">{TREND_PAGE.shotSeconds(s.min_sec, s.max_sec)}</span>
                  </div>
                  <p className="mt-2 text-small text-text-2">{s.instruction_he}</p>
                  {s.tips_he.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1 text-small text-muted">
                      {s.tips_he.map((tip) => (
                        <li key={tip}>· {tip}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* ---------- Hook variants ---------- */}
      <section aria-labelledby="hooks" className="container-marketing py-14">
        <h2 id="hooks" className="text-h2">
          {TREND_PAGE.hooksTitle}
        </h2>
        <p className="text-body-lg mt-3 max-w-2xl text-text-2">{TREND_PAGE.hooksBody}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {t.hook_variants.map((h) => (
            <li key={h.key} className="flex flex-col gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span className="font-display text-[56px] leading-none text-primary-text">{h.key}</span>
              <p className="text-body-lg font-bold">{h.hook_line_he_pattern}</p>
              <p className="text-small text-text-2">{h.why_he}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Niche examples ---------- */}
      <section aria-labelledby="niches" className="container-marketing py-6">
        <h2 id="niches" className="text-h2">
          {TREND_PAGE.nichesTitle}
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {t.niche_adaptations.map((a) => {
            const n = getNiche(a.niche_slug);
            return (
              <li key={a.niche_slug} className="flex flex-col gap-3">
                <TrendArt trend={t} nicheSlug={a.niche_slug} size="sm" tag={<SampleTag>{TREND_PAGE.demoTag}</SampleTag>} />
                <div>
                  <h3 className="font-bold">{n ? nicheShortName(n) : a.niche_slug}</h3>
                  <p className="text-small text-text-2">{Object.values(a.onscreen_examples_he)[0]}</p>
                  {a.notes_he && <p className="mt-1 text-micro text-muted">{a.notes_he}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Music + compliance ---------- */}
      <section className="container-marketing grid gap-4 py-14 md:grid-cols-2">
        <div className="flex gap-4 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <Music2 aria-hidden className="size-6 shrink-0 text-violet" />
          <div>
            <h2 className="text-h3">{TREND_PAGE.musicTitle}</h2>
            <p className="mt-2 text-text-2">{TREND_MUSIC_NOTE_HE}</p>
            <p className="mt-2 text-small text-muted">
              {LIFECYCLE_LABEL[t.lifecycle]} · <bdi dir="ltr" className="num">{t.music_brief.bpm_min}–{t.music_brief.bpm_max} BPM</bdi>
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <AlertTriangle aria-hidden className="size-6 shrink-0 text-primary-text" />
          <div>
            <h2 className="text-h3">{TREND_PAGE.complianceTitle}</h2>
            <ul className="mt-2 flex flex-col gap-2 text-text-2">
              {t.compliance_notes_he.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="faq" className="container-marketing py-6">
        <h2 id="faq" className="text-h2 mb-6">
          {TREND_PAGE.faqTitle}
        </h2>
        <FaqList items={t.explainer.faq_he.map((f, i) => ({ id: `${t.slug}-${i}`, ...f }))} />
      </section>

      <CtaBand title={TREND_PAGE.ctaAi} body={t.tagline_he}>
        {offersAi && (
          <Link href={createHref(t.slug)} className={buttonVariants({ size: "xl" })}>
            {TREND_PAGE.ctaAi}
          </Link>
        )}
        {offersGuided && (
          <Link href={createHref(t.slug, "guided")} className={buttonVariants({ size: "xl", variant: offersAi ? "secondary" : "primary" })}>
            {TREND_PAGE.ctaGuided}
          </Link>
        )}
      </CtaBand>

      {/* ---------- More ---------- */}
      <section aria-labelledby="more" className="container-marketing pb-8">
        <div className="flex items-end justify-between gap-4">
          <h2 id="more" className="text-h2">
            {TREND_PAGE.moreTitle}
          </h2>
          <Link href="/trends" className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline underline-offset-4">
            {TREND_PAGE.moreLink}
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {more.map((m) => (
            <li key={m.slug} className="flex">
              <TrendCard trend={m} className="w-full" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
