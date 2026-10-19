import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { PageHero } from "@/components/marketing/page/kit";
import { ExamplesGallery, ExamplesGalleryFallback, type ExampleItem } from "@/components/marketing/gallery/examples-gallery";
import { EXAMPLES_PAGE as T } from "@/content/he/gallery";
import { DEMO_EXAMPLES, TEMPLATES } from "@/lib/mock/gallery";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: T.meta.title,
  description: T.meta.description,
  alternates: { canonical: "/examples" },
  openGraph: { title: T.meta.title, description: T.meta.description, url: "/examples" },
};

export default function ExamplesPage() {
  // No published customer examples yet → empty state with the five Appendix D demos (Part 02 §6.1).
  const items: ExampleItem[] = DEMO_EXAMPLES.map((e) => {
    const n = getNiche(e.niche_slug);
    return {
      ...e,
      nicheName: n ? nicheShortName(n) : e.niche_slug,
      nicheIconName: n?.icon ?? "",
      templateId: TEMPLATES.find((t) => t.slug === e.template_slug)?.id ?? null,
    };
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { label: "ראשי", href: "/" },
              { label: T.breadcrumb, href: "/examples" },
            ],
            BRAND.domain,
          ),
        ]}
      />
      <PageHero title="דוגמאות" accent="שעוצרות גלילה." sub="הדגמות מתסריטים לדוגמה. לחצו על סרטון כדי לראות איך הוא בנוי.">
        <section aria-label={T.breadcrumb}>
          <Suspense fallback={<ExamplesGalleryFallback items={items} />}>
            <ExamplesGallery items={items} />
          </Suspense>
        </section>
      </PageHero>
      <FinalCta title={T.moreTitle} subtitle="תבניות וטרנדים מוכנים, לכל נישה." />
    </>
  );
}
