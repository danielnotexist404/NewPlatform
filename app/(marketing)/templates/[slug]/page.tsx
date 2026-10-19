import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Coins } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { JsonLd, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { MediaTile } from "@/components/marketing/media/media-tile";
import { reelFromText } from "@/components/marketing/media/reel-data";
import { HeroActions, MoreLink, PageHero, h2Class } from "@/components/marketing/page/kit";
import { TemplateCard, templateStartHref } from "@/components/marketing/gallery/template-card";
import { toCardData } from "@/components/marketing/gallery/template-data";
import {
  BEAT_ROLE_LABEL,
  CAPTION_PRESET_LABEL,
  MUSIC_MOOD_LABEL,
  STRUCTURE_LABEL,
  TEMPLATE_PAGE as P,
  TEMPLATES_PAGE,
  VISUAL_STYLE_LABEL,
} from "@/content/he/gallery";
import { ASPECT_LABEL, QUALITY_LABEL, VIDEO_TYPE_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { estimateSampleCredits, getTemplate, publicTemplates, type Quality } from "@/lib/mock/gallery";
import { getHookType, getNiche, hooksForType, nicheShortName } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return publicTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  const title = `${t.name_he}: תבנית לסרטון ב${BRAND.nameHe}`;
  const description = t.description_he.length > 155 ? `${t.description_he.slice(0, 154)}…` : t.description_he;
  return { title, description, alternates: { canonical: `/templates/${t.slug}` }, openGraph: { title, description, url: `/templates/${t.slug}` } };
}

const ROLE_TONE: Record<string, string> = {
  hook: "bg-primary/20 text-primary-text",
  cta: "bg-success/15 text-success",
  proof: "bg-violet/20 text-violet",
  offer: "bg-rose/15 text-rose",
};

export default function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
      <TemplatePageView params={params} />
    </Suspense>
  );
}

async function TemplatePageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t || !t.is_public) notFound();

  const hookType = getHookType(t.default_hook_type_slug);
  const typeHooks = hooksForType(t.default_hook_type_slug).filter((h) => h.placeholders.length === 0 && !h.text_he.includes("{"));
  const hooks = [...typeHooks.filter((h) => h.niche_slug === t.niche_slug), ...typeHooks.filter((h) => h.niche_slug !== t.niche_slug)].slice(0, 4);
  const total = t.beat_plan.reduce((s, b) => s + b.est_duration_sec, 0) || 1;
  const costs = (["draft", "standard", "premium"] as Quality[]).map((q) => ({ q, credits: estimateSampleCredits({ durationSec: t.duration_sec, quality: q, visualMix: t.visual_mix }) }));
  const all = toCardData();
  const more = [...all.filter((x) => x.slug !== t.slug && x.video_type === t.video_type), ...all.filter((x) => x.slug !== t.slug && x.video_type !== t.video_type)].slice(0, 3);
  const crumbs = [
    { label: "ראשי", href: "/" },
    { label: TEMPLATES_PAGE.breadcrumb, href: "/templates" },
    { label: t.name_he, href: `/templates/${t.slug}` },
  ];
  const reel = reelFromText(t.slug, t.sample_hook_he, t.niche_slug, { caption: "box", highlight: 1 });
  const facts = [
    { k: P.facts.type, v: VIDEO_TYPE_LABEL[t.video_type] },
    { k: P.facts.duration, v: P.durationValue(t.duration_sec) },
    { k: P.facts.format, v: ASPECT_LABEL[t.aspect_ratio] },
    { k: P.facts.structure, v: STRUCTURE_LABEL[t.structure] },
    { k: P.facts.style, v: VISUAL_STYLE_LABEL[t.visual_style] },
    { k: P.facts.captions, v: CAPTION_PRESET_LABEL[t.caption_preset] },
    { k: P.facts.music, v: MUSIC_MOOD_LABEL[t.music_mood] },
    { k: P.facts.visual, v: VISUAL_MIX_LABEL[t.visual_mix] },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs, BRAND.domain)]} />
      <PageHero
        align="split"
        title={t.name_he}
        sub={t.description_he}
        actions={
          <>
            <HeroActions primary={P.cta} primaryHref={templateStartHref(t.id)} />
            <span className="inline-flex items-center gap-1.5 text-small font-semibold text-primary-text">
              <Coins aria-hidden className="size-4" />
              {TEMPLATES_PAGE.fromCredits(costs[0].credits)}
            </span>
          </>
        }
      >
        <figure className={cn("mx-auto w-full", t.aspect_ratio === "16:9" ? "max-w-[620px]" : "max-w-[300px]")}>
          <MediaTile reel={reel} aspect={t.aspect_ratio} label={`${t.name_he}: ${t.sample_hook_he}`} rounded="rounded-[28px]">
            <span className="absolute top-[4%] inset-e-[4%] z-10 rounded-full bg-paper/90 px-2.5 py-1 text-micro text-ink">{P.previewTag}</span>
          </MediaTile>
          <figcaption className="mt-4 text-center text-small text-muted">{facts.slice(0, 4).map((f) => f.v).join(" · ")}</figcaption>
        </figure>
      </PageHero>

      <section aria-labelledby="structure" className="container-marketing py-16 md:py-24">
        <h2 id="structure" className={cn(h2Class, "text-center")}>
          {P.structureTitle}
        </h2>
        <p className="mt-3 text-center text-body-lg text-text-2">{STRUCTURE_LABEL[t.structure]}</p>
        {/* desktop: horizontal LTR timeline with Hebrew labels */}
        <div dir="ltr" className="mt-8 hidden gap-2 md:flex" aria-hidden>
          {t.beat_plan.map((b, i) => (
            <div key={i} className={cn("flex min-w-0 flex-col gap-2 rounded-[18px] p-5", ROLE_TONE[b.role] ?? "bg-surface-2 text-text")} style={{ flexGrow: b.est_duration_sec, flexBasis: 0 }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-micro opacity-80">{b.est_duration_sec}s</span>
                <span dir="rtl" className="truncate text-small font-bold">
                  {BEAT_ROLE_LABEL[b.role]}
                </span>
              </div>
              <p dir="rtl" className="text-small text-text">
                {b.visual_idea_he}
              </p>
            </div>
          ))}
        </div>
        <div dir="ltr" className="mt-2 hidden justify-between font-mono text-micro text-muted md:flex" aria-hidden>
          <span>0s</span>
          <span>{total}s</span>
        </div>
        {/* list (mobile; and the accessible version everywhere) */}
        <ol className="mt-6 flex flex-col gap-3 md:sr-only">
          {t.beat_plan.map((b, i) => (
            <li key={i} className="flex gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span className={cn("h-fit shrink-0 rounded-xs px-2 py-0.5 text-micro", ROLE_TONE[b.role] ?? "bg-surface-3 text-text-2")}>{BEAT_ROLE_LABEL[b.role]}</span>
              <div>
                <p className="text-small">{b.visual_idea_he}</p>
                <p className="mt-1 text-micro font-normal text-muted">{P.beatSeconds(b.est_duration_sec)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hooks" className="container-marketing py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 id="hooks" className={h2Class}>
            {P.hooksTitle}
          </h2>
          <Link href={`/hooks/types/${t.default_hook_type_slug}`} className="inline-flex items-center gap-1 font-semibold text-primary-text underline-offset-4 hover:underline">
            {P.hooksLink}
            {hookType && <span className="sr-only">: {hookType.name_he}</span>}
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {hooks.slice(0, 3).map((h) => {
            const hn = h.niche_slug ? getNiche(h.niche_slug) : undefined;
            return (
              <li key={h.id}>
                <Link href={`/hooks/h/${h.id}`} className="flex h-full flex-col gap-3 rounded-[24px] bg-surface-1 p-6 ring-hairline transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:elev-2">
                  <span className="flex flex-wrap gap-1.5 text-micro">
                    {hookType && <span className="rounded-xs bg-primary/15 px-2 py-0.5 text-primary-text">{hookType.name_he}</span>}
                    <span className="rounded-xs bg-surface-3 px-2 py-0.5 text-text-2">{hn ? nicheShortName(hn) : TEMPLATES_PAGE.forAll}</span>
                  </span>
                  <span className="text-h3 font-bold leading-snug">{h.text_he}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="cost" className="container-marketing py-8">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-surface-1 p-7 text-center ring-hairline md:p-12">
          <h2 id="cost" className={h2Class}>
            {P.costTitle}
          </h2>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {costs.map((c) => (
              <div key={c.q} className="rounded-[20px] bg-surface-2 p-5">
                <dt className="text-small text-text-2">{QUALITY_LABEL[c.q]}</dt>
                <dd className="mt-1 text-h3 font-extrabold">
                  <span className="sr-only">{P.costRow(c.credits)}</span>
                  <span aria-hidden>
                    ≈ <Num value={c.credits} /> <span className="text-small font-semibold text-text-2">קרדיטים</span>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-small text-muted">{P.costNote}</p>
          <div className="mt-6 flex justify-center">
            <MoreLink href="/pricing#details">כמה עולה סרטון</MoreLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="more" className="container-marketing py-16 md:py-24">
        <h2 id="more" className={cn(h2Class, "mb-4 text-center")}>
          {P.moreTitle}
        </h2>
        <ul className="mt-10 grid grid-cols-2 items-end gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
          {more.map((m, i) => (
            <li key={m.slug}>
              <TemplateCard t={m} index={i + 1} />
            </li>
          ))}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
