import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { TrendsHub } from "@/components/marketing/trends/trends-hub";
import { trendReel } from "@/components/marketing/trends/trend-reel";
import { Band, HeroActions, PageHero } from "@/components/marketing/page/kit";
import { TRENDS_FAQ, TRENDS_HUB, TRENDS_META } from "@/content/he/trends";
import { publishedTrends } from "@/lib/mock/trends";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: TRENDS_META.title,
  description: TRENDS_META.description,
  alternates: { canonical: "/trends" },
  openGraph: { title: TRENDS_META.title, description: TRENDS_META.description, url: "/trends" },
};

const FAN = ["rotate-[-8deg] translate-y-8", "z-10 scale-110", "rotate-[8deg] translate-y-8"];

export default function TrendsPage() {
  const trends = publishedTrends();
  const niches = Array.from(new Set(trends.flatMap((t) => t.niches)))
    .map((slug) => getNiche(slug))
    .filter((n): n is NonNullable<typeof n> => !!n)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((n) => ({ slug: n.slug, name: nicheShortName(n) }));
  const featured = trends.filter((t) => t.is_featured).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ label: "ראשי", href: "/" }, { label: TRENDS_HUB.breadcrumb, href: "/trends" }], BRAND.domain),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: trends.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name_he, url: `https://${BRAND.domain}/trends/${t.slug}` })),
          },
          faqLd(TRENDS_FAQ),
        ]}
      />
      <PageHero
        title="טרנדים שעובדים."
        accent="לעסק שלכם."
        sub="פורמטים שתופסים ברשת, בעברית ועם מוזיקה מקורית."
        actions={<HeroActions primary={TRENDS_HUB.cta} secondary="לכל הטרנדים" secondaryHref="#all-trends" />}
      >
        <div aria-hidden className="mx-auto flex max-w-[760px] items-start justify-center gap-4 md:gap-8">
          {featured.map((t, i) => (
            <ReelCard key={t.slug} reel={trendReel(t, undefined, i)} frame="phone" offset={i * 2} decorative lite={i !== 1} className={cn("w-[30%] max-w-[230px]", FAN[i])} />
          ))}
        </div>
      </PageHero>

      <Band id="all-trends" title={TRENDS_HUB.featuredTitle} sub="מעתיקים את המבנה, לא את הסרטון.">
        <TrendsHub trends={trends} niches={niches} />
      </Band>

      <Band id="faq" title="שאלות על טרנדים">
        <FaqList items={TRENDS_FAQ.slice(0, 3).map((f) => ({ id: f.id, q: f.q_he, a: f.a_he }))} className="mx-auto max-w-3xl" />
      </Band>

      <FinalCta title={TRENDS_HUB.ctaTitle} />
    </>
  );
}
