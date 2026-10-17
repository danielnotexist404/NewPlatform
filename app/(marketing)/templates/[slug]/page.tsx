import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Coins } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { Breadcrumbs, JsonLd, SampleTag, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { ReelArt, ArtChip, DurationChip, nicheIcon, toneFor } from "@/components/marketing/gallery/reel-art";
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

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t || !t.is_public) notFound();

  const niche = t.niche_slug ? getNiche(t.niche_slug) : undefined;
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
      <section id="hero" className="container-marketing grid gap-10 pb-14 pt-8 md:pt-12 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-5">
          <Breadcrumbs items={crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c))} />
          <h1 className="text-h1">{t.name_he}</h1>
          <p className="text-body-lg max-w-2xl text-text-2">{t.description_he}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={templateStartHref(t.id)} className={buttonVariants({ size: "lg" })} data-cta-location="template_page">
              {P.cta}
            </Link>
            <span className="inline-flex items-center gap-1.5 text-small font-semibold text-primary-text">
              <Coins aria-hidden className="size-4" />
              {TEMPLATES_PAGE.fromCredits(costs[0].credits)}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="bg-surface-1 px-4 py-3">
                <dt className="text-micro text-muted">{f.k}</dt>
                <dd className="mt-0.5 text-small font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className={cn("mx-auto w-full", t.aspect_ratio === "16:9" ? "max-w-[560px]" : "max-w-[320px]")}>
          <div className="rounded-[28px] bg-surface-2 p-2.5 elev-3 glow-primary">
            <ReelArt
              aspect={t.aspect_ratio}
              tone={toneFor(t.slug)}
              icon={nicheIcon(niche?.icon)}
              hook={t.sample_hook_he}
              hookPosition={t.aspect_ratio === "16:9" ? "center" : "top"}
              size="lg"
              className="rounded-[20px]"
              topEnd={<SampleTag>{P.previewTag}</SampleTag>}
              topStart={<ArtChip>{niche ? nicheShortName(niche) : TEMPLATES_PAGE.forAll}</ArtChip>}
              bottomEnd={<DurationChip sec={t.duration_sec} />}
              label={`${t.name_he}: ${t.sample_hook_he}`}
            />
          </div>
          <figcaption className="mt-3 text-center text-small text-muted">{P.previewNote}</figcaption>
        </figure>
      </section>

      <section aria-labelledby="structure" className="container-marketing py-12">
        <h2 id="structure" className="text-h2">
          {P.structureTitle}
        </h2>
        <p className="mt-2 text-text-2">{STRUCTURE_LABEL[t.structure]}</p>
        {/* desktop: horizontal LTR timeline with Hebrew labels */}
        <div dir="ltr" className="mt-8 hidden gap-2 md:flex" aria-hidden>
          {t.beat_plan.map((b, i) => (
            <div key={i} className={cn("flex min-w-0 flex-col gap-2 rounded-md p-4", ROLE_TONE[b.role] ?? "bg-surface-2 text-text")} style={{ flexGrow: b.est_duration_sec, flexBasis: 0 }}>
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

      <section aria-labelledby="hooks" className="container-marketing py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="hooks" className="text-h2">
            {P.hooksTitle}
          </h2>
          <Link href={`/hooks/types/${t.default_hook_type_slug}`} className="inline-flex items-center gap-1 font-semibold text-primary-text underline-offset-4 hover:underline">
            {P.hooksLink}
            {hookType && <span className="sr-only">: {hookType.name_he}</span>}
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {hooks.map((h) => {
            const hn = h.niche_slug ? getNiche(h.niche_slug) : undefined;
            return (
              <li key={h.id}>
                <Link href={`/hooks/h/${h.id}`} className="flex h-full flex-col gap-2 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2">
                  <span className="flex flex-wrap gap-1.5 text-micro">
                    {hookType && <span className="rounded-xs bg-primary/15 px-2 py-0.5 text-primary-text">{hookType.name_he}</span>}
                    <span className="rounded-xs bg-surface-3 px-2 py-0.5 text-text-2">{hn ? nicheShortName(hn) : TEMPLATES_PAGE.forAll}</span>
                  </span>
                  <span className="text-body-lg font-bold">{h.text_he}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="cost" className="container-marketing py-12">
        <div className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
          <h2 id="cost" className="text-h2">
            {P.costTitle}
          </h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {costs.map((c) => (
              <div key={c.q} className="rounded-md bg-surface-2 p-4">
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
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={templateStartHref(t.id)} className={buttonVariants({ size: "lg" })} data-cta-location="template_page">
              {P.cta}
            </Link>
            <Link href="/pricing#credit-costs" className={buttonVariants({ size: "lg", variant: "ghost" })}>
              כמה עולה סרטון
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="more" className="container-marketing py-12">
        <h2 id="more" className="text-h2">
          {P.moreTitle}
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {more.map((m) => (
            <li key={m.slug}>
              <TemplateCard t={m} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
