import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageHero } from "@/components/marketing/content/page-hero";
import { FaqBrowser } from "@/components/marketing/content/faq-browser";
import { JsonLd } from "@/components/marketing/content/json-ld";
import { plainText } from "@/components/marketing/content/inline";
import { cn } from "@/lib/utils";
import { FAQ, FAQ_CATEGORIES } from "@/content/he/site";

export const metadata: Metadata = {
  title: FAQ.meta.title,
  description: FAQ.meta.description,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="pb-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "he",
          mainEntity: FAQ_CATEGORIES.flatMap((c) =>
            c.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: plainText(it.a) } })),
          ),
        }}
      />
      <PageHero crumbs={[{ label: FAQ.crumb }]} eyebrow={FAQ.eyebrow} title={FAQ.h1} lede={FAQ.lede} />
      <div className="container-marketing">
        <FaqBrowser categories={FAQ_CATEGORIES} />
        <section aria-labelledby="faq-cta" className="relative mt-20 overflow-hidden rounded-xl bg-surface-1 p-8 text-center shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
          <div className="relative flex flex-col items-center gap-4">
            <h2 id="faq-cta" className="text-h2">{FAQ.ctaTitle}</h2>
            <p className="max-w-xl text-text-2">{FAQ.ctaBody}</p>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
              {FAQ.cta}
              <DirIcon name="forward" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
