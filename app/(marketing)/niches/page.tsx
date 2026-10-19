import type { Metadata } from "next";
import { JsonLd, absUrl, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { PageHero } from "@/components/marketing/page/kit";
import { NicheGrid, type NicheGroup } from "@/components/marketing/niches/niche-grid";
import { categoriesWithNiches, nicheHookCount } from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { niches, nicheShortName } from "@/lib/data/seed";
import { NICHES_COPY } from "@/content/he/niches";

const H = NICHES_COPY.hub;

export const metadata: Metadata = pageMeta({ title: H.title, description: H.description(niches.length), path: "/niches" });

export default function NichesHubPage() {
  const groups: NicheGroup[] = categoriesWithNiches().map(({ category, niches: list }) => ({
    slug: category.slug,
    name: category.name_he,
    niches: list.map((n) => ({
      slug: n.slug,
      name: n.name_he,
      short: nicheShortName(n),
      icon: n.icon,
      description: n.description_he,
      category: n.category_slug,
      hookCount: nicheHookCount(n.slug),
      compliance: n.compliance_flag !== "none",
    })),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ label: NICHES_COPY.crumbs.home, href: "/" }, { label: NICHES_COPY.crumbs.niches, href: "/niches" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: niches.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.name_he, url: absUrl(`/niches/${n.slug}`) })),
          },
        ]}
      />
      <PageHero title="סרטון לכל עסק." accent="בשפה שלו." sub="בחרו נישה, וקבלו הוקים, תסריט וסגנון שמתאימים לה.">
        <section aria-label={H.filterLabel}>
          <NicheGrid groups={groups} />
        </section>
      </PageHero>
      <FinalCta title={H.notFound.title} subtitle={H.notFound.body} />
    </>
  );
}
