import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, breadcrumbLd } from "@/components/marketing/gallery/kit";
import { ExamplesGallery, ExamplesGalleryFallback, type ExampleItem } from "@/components/marketing/gallery/examples-gallery";
import { EXAMPLES_PAGE as T } from "@/content/he/gallery";
import { DEMO_EXAMPLES, TEMPLATES } from "@/lib/mock/gallery";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { BRAND, SIGNUP_HREF } from "@/lib/constants";

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
      <section id="hero" className="container-marketing flex flex-col gap-5 pb-10 pt-8 md:pt-12">
        <Breadcrumbs items={[{ label: "ראשי", href: "/" }, { label: T.breadcrumb }]} />
        <h1 className="text-h1 max-w-3xl">{T.h1}</h1>
        <p className="text-body-lg max-w-3xl text-text-2">{T.intro}</p>
      </section>

      <section aria-labelledby="empty-title" className="container-marketing pb-10">
        <div className="flex flex-col gap-4 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lemon text-on-primary">
              <Clapperboard aria-hidden className="size-5" />
            </span>
            <div>
              <Eyebrow>{T.demoTag}</Eyebrow>
              <h2 id="empty-title" className="text-h3 mt-3">
                {T.emptyTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-text-2">{T.emptyBody}</p>
            </div>
          </div>
          <Link href={SIGNUP_HREF} className={buttonVariants({ size: "lg" })}>
            {T.emptyCta}
          </Link>
        </div>
      </section>

      <section aria-label={T.breadcrumb} className="container-marketing pb-10">
        <Suspense fallback={<ExamplesGalleryFallback items={items} />}>
          <ExamplesGallery items={items} />
        </Suspense>
      </section>

      <CtaBand title={T.moreTitle}>
        <Link href="/templates" className={buttonVariants({ size: "xl" })}>
          {T.moreTemplates}
        </Link>
        <Link href="/trends" className={buttonVariants({ size: "xl", variant: "secondary" })}>
          {T.moreTrends}
        </Link>
      </CtaBand>
    </>
  );
}
