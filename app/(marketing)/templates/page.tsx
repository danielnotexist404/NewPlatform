import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs, CtaBand, JsonLd, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { TemplatesGallery } from "@/components/marketing/gallery/templates-gallery";
import { toCardData } from "@/components/marketing/gallery/template-data";
import { TEMPLATES_PAGE as T } from "@/content/he/gallery";
import { BRAND, SIGNUP_HREF } from "@/lib/constants";

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
      <section id="hero" className="container-marketing flex flex-col gap-5 pb-10 pt-8 md:pt-12">
        <Breadcrumbs items={[{ label: "ראשי", href: "/" }, { label: T.breadcrumb }]} />
        <h1 className="text-h1 max-w-3xl">
          תבניות לסרטוני <span className="text-gold-gradient">תדמית ורילס</span>
        </h1>
        <p className="text-body-lg max-w-3xl text-text-2">{T.intro}</p>
      </section>
      <section aria-label={T.breadcrumb} className="container-marketing pb-10">
        <TemplatesGallery items={items} />
      </section>
      <CtaBand title="לא מצאתם תבנית? התחילו מהוק">
        <Link href="/hooks" className={buttonVariants({ size: "xl" })}>
          לספריית ההוקים
        </Link>
        <Link href={SIGNUP_HREF} className={buttonVariants({ size: "xl", variant: "secondary" })}>
          צרו סרטון בחינם
        </Link>
      </CtaBand>
    </>
  );
}
