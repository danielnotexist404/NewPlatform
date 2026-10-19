import type { Metadata } from "next";
import { JsonLd, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { PageHero } from "@/components/marketing/page/kit";
import { TemplatesGallery } from "@/components/marketing/gallery/templates-gallery";
import { toCardData } from "@/components/marketing/gallery/template-data";
import { TEMPLATES_PAGE as T } from "@/content/he/gallery";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: T.meta.title,
  description: T.meta.description,
  alternates: { canonical: "/templates" },
  openGraph: { title: T.meta.title, description: T.meta.description, url: "/templates" },
};

export default function TemplatesPage() {
  const items = toCardData();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { label: "ראשי", href: "/" },
              { label: T.breadcrumb, href: "/templates" },
            ],
            BRAND.domain,
          ),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: items.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name_he, url: `https://${BRAND.domain}/templates/${t.slug}` })),
          },
        ]}
      />
      <PageHero title="תבניות מוכנות." accent="לכל סרטון." sub="בוחרים מבנה, ממלאים פרטים, ומקבלים סרטון בעברית.">
        <section aria-label={T.breadcrumb}>
          <TemplatesGallery items={items} />
        </section>
      </PageHero>
      <FinalCta title="לא מצאתם תבנית? התחילו מהוק" subtitle="מאות הוקים בעברית, לכל נישה." />
    </>
  );
}
