import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarHeart, Check, Clapperboard, Film } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { Section, SectionHeading } from "@/components/marketing/niches/section";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { PhoneFrame, ReelTile } from "@/components/marketing/niches/reel-tile";
import { SampleScripts } from "@/components/marketing/niches/sample-scripts";
import { ComplianceBox, CostBlock, FaqList, FinalCtaBand, RealAssetsBox } from "@/components/marketing/niches/blocks";
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
import { cn } from "@/lib/utils";

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

export default async function NichePage({ params }: Props) {
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

  return (
    <HooksProvider>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faq)]} />

      {/* 1–2 Hero */}
      <section id="hero" className="container-marketing pt-8 pb-12 md:pt-12 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">
              <NicheIcon name={n.icon} className="size-3.5" />
              {category?.name_he}
            </p>
            <h1 className="text-h1">
              סרטון תדמית <span className="text-gold-gradient">ל{short}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-text-2">{lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={createHref} className={cn(buttonVariants({ size: "xl" }))}>
                <Clapperboard aria-hidden />
                {P.primary(short)}
              </Link>
              <Link href={`/hooks/${slug}`} className={cn(buttonVariants({ variant: "secondary", size: "xl" }))}>
                {P.secondary(short)}
                <DirIcon name="forward" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-small text-text-2" aria-label="מה מקבלים">
              {P.trust.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-success" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          {heroHook && (
            <PhoneFrame label={P.phoneLabel(short)} className="lg:me-0">
              <ReelTile
                icon={n.icon}
                category={n.category_slug}
                hookText={heroHook.text}
                caption={n.video_types_he[0]}
                handle={short}
                badge={P.sampleBadge}
              />
            </PhoneFrame>
          )}
        </div>
      </section>

      {/* 3 What to publish */}
      <Section labelledBy="videos-title" className="pt-0">
        <SectionHeading id="videos-title" title={P.videosTitle(short)} subtitle={P.videosNote} />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {n.video_types_he.map((v, i) => (
            <li key={v} className="flex flex-col gap-4 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span className="flex items-center justify-between text-muted">
                <Film className="size-5 text-primary-text" aria-hidden />
                <span className="num font-display text-[2rem] leading-none text-text-2/60">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="text-body-lg font-bold leading-snug">{v}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4 Continuation */}
      {rest.length > 0 && (
        <Section labelledBy="more-title" className="pt-0">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <h2 id="more-title" className="text-h2">{P.moreTitle(short)}</h2>
            <div className="prose-he max-w-none text-text-2 [&_p]:text-body-lg">
              {rest.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          {REAL_ASSETS_NICHES.includes(slug) && (
            <div className="mt-8">
              <RealAssetsBox text={NICHES_COPY.realAssets} extra={slug === "real-estate-developers" ? NICHES_COPY.realAssetsDevelopers : undefined} />
            </div>
          )}
        </Section>
      )}

      {/* 5 Sample scripts */}
      {content.sample_scripts.length > 0 && (
        <Section labelledBy="scripts-title">
          <SectionHeading id="scripts-title" title={P.scriptsTitle(short)} subtitle={P.scriptsNote} />
          <SampleScripts scripts={content.sample_scripts} hrefFor={(s) => createForNicheHref(slug, "niche_page", s.hook_id ?? undefined)} />
        </Section>
      )}

      {/* 6 Hooks */}
      {hooks.length > 0 && (
        <Section labelledBy="hooks-title">
          <SectionHeading
            id="hooks-title"
            title={P.hooksTitle(short)}
            action={
              <Link href={`/hooks/${slug}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                {plural(hooks.length, P.hooksAll)}
                <DirIcon name="forward" />
              </Link>
            }
          />
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hooks.slice(0, 6).map((h) => (
              <li key={h.id} className="contents">
                <HookCard hook={h} showNiche={false} location="niche_page" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 7 Seasons */}
      <Section labelledBy="seasons-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="seasons-title" className="text-h2">{P.seasonsTitle(short)}</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {n.seasonal_angles_he.map((a) => (
                <li key={a} className="flex items-start gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <CalendarHeart className="mt-0.5 size-5 shrink-0 text-rose" aria-hidden />
                  <span className="font-semibold">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <SeasonRail title={P.seasonsRail} nicheSlug={slug} limit={4} headingLevel="h3" className="lg:pt-2 [&_ul]:md:grid-cols-2" />
        </div>
      </Section>

      {/* 8 Compliance */}
      {n.compliance_note_he && (
        <Section labelledBy="rules-title">
          <ComplianceBox headingId="rules-title" note={n.compliance_note_he} disclaimers={disclaimersFor(n)} />
        </Section>
      )}

      {/* 9 Cost */}
      <Section labelledBy="cost-title">
        <CostBlock headingId="cost-title" title={P.costTitle(short)} />
      </Section>

      {/* 10 FAQ */}
      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 id="faq-title" className="text-h2">{P.faqTitle(short)}</h2>
          <FaqList items={faq} idPrefix={slug} />
        </div>
      </Section>

      {/* 11 Related */}
      {related.length > 0 && (
        <Section labelledBy="related-title">
          <SectionHeading id="related-title" title={P.relatedTitle} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        </Section>
      )}

      {/* 12 Final CTA */}
      <FinalCtaBand title={P.finalTitle} sub={P.finalSub(short)} href={createHref} cta={P.finalCta} />
    </HooksProvider>
  );
}
