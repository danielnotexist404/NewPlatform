import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, SampleTag, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList } from "@/components/marketing/gallery/faq-list";
import { TrendArt } from "@/components/marketing/trends/trend-art";
import { TrendsHub } from "@/components/marketing/trends/trends-hub";
import { TRENDS_FAQ, TRENDS_HUB, TRENDS_META } from "@/content/he/trends";
import { publishedTrends } from "@/lib/mock/trends";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { BRAND, SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: TRENDS_META.title,
  description: TRENDS_META.description,
  alternates: { canonical: "/trends" },
  openGraph: { title: TRENDS_META.title, description: TRENDS_META.description, url: "/trends" },
};

export default function TrendsPage() {
  const trends = publishedTrends();
  const nicheSlugs = Array.from(new Set(trends.flatMap((t) => t.niches)));
  const niches = nicheSlugs
    .map((slug) => getNiche(slug))
    .filter((n): n is NonNullable<typeof n> => !!n)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((n) => ({ slug: n.slug, name: nicheShortName(n) }));
  const featured = trends.filter((t) => t.is_featured).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { label: "ראשי", href: "/" },
              { label: TRENDS_HUB.breadcrumb, href: "/trends" },
            ],
            BRAND.domain,
          ),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: trends.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name_he, url: `https://${BRAND.domain}/trends/${t.slug}` })),
          },
          faqLd(TRENDS_FAQ),
        ]}
      />

      <section id="hero" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
        <div className="container-marketing relative grid gap-12 pb-16 pt-8 md:pt-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-24">
          <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: "ראשי", href: "/" }, { label: TRENDS_HUB.breadcrumb }]} />
            <Eyebrow>{TRENDS_HUB.eyebrow}</Eyebrow>
            <h1 className="text-h1 max-w-2xl">
              טרנדים שעובדים לעסקים, <span className="text-gold-gradient">בעברית</span>
            </h1>
            <p className="text-body-lg max-w-xl text-text-2">{TRENDS_HUB.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={SIGNUP_HREF} className={buttonVariants({ size: "lg" })}>
                {TRENDS_HUB.cta}
              </Link>
              <a href="#all-trends" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                לכל הטרנדים
              </a>
            </div>
            <dl className="mt-2 grid max-w-xl grid-cols-3 gap-3">
              {TRENDS_HUB.stats.map((s) => (
                <div key={s.label} className="rounded-md bg-surface-1/70 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <dt className="text-micro text-text-2">{s.label}</dt>
                  <dd className="mt-1 text-[34px] font-extrabold leading-none text-primary-text num">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div aria-hidden className="relative mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center md:h-[520px]">
            {featured.map((t, i) => (
              <div
                key={t.slug}
                className={cn(
                  "absolute w-[42%] max-w-[210px] transition-transform md:w-[44%] md:max-w-[230px]",
                  i === 0 && "z-20 -translate-y-2 glow-primary rounded-md",
                  i === 1 && "z-10 ltr:-translate-x-[70%] rtl:translate-x-[70%] translate-y-8 rotate-[8deg] opacity-80",
                  i === 2 && "z-10 ltr:translate-x-[70%] rtl:-translate-x-[70%] translate-y-8 -rotate-[8deg] opacity-80",
                )}
              >
                <TrendArt trend={t} size="sm" tag={<SampleTag>{TRENDS_HUB.demoTag}</SampleTag>} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="all-trends" aria-label="כל הטרנדים" className="container-marketing scroll-mt-24 py-6">
        <TrendsHub trends={trends} niches={niches} />
      </section>

      <section aria-labelledby="how-title" className="container-marketing py-20">
        <h2 id="how-title" className="text-h2">
          {TRENDS_HUB.howTitle}
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {TRENDS_HUB.how.map((s, i) => (
            <li key={s.title} className="relative overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span aria-hidden className="font-display absolute -top-3 inset-e-4 text-[96px] leading-none text-surface-3 num">
                {i + 1}
              </span>
              <h3 className="text-h3 relative">{s.title}</h3>
              <p className="relative mt-2 text-text-2">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:flex-row md:items-start md:gap-6 md:p-8">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <ShieldCheck aria-hidden className="size-6" />
          </span>
          <div>
            <h2 className="text-h3">{TRENDS_HUB.legalTitle}</h2>
            <p className="mt-2 max-w-3xl text-text-2">{TRENDS_HUB.legalBody}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="container-marketing py-8">
        <h2 id="faq-title" className="text-h2 mb-6">
          שאלות על טרנדים
        </h2>
        <FaqList items={TRENDS_FAQ} />
      </section>

      <CtaBand title={TRENDS_HUB.ctaTitle} body={TRENDS_HUB.ctaBody}>
        <Link href={SIGNUP_HREF} className={buttonVariants({ size: "xl" })}>
          {TRENDS_HUB.cta}
        </Link>
      </CtaBand>
    </>
  );
}
