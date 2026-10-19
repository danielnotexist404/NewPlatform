import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page/kit";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { FaqBrowser } from "@/components/marketing/content/faq-browser";
import { JsonLd } from "@/components/marketing/content/json-ld";
import { plainText } from "@/components/marketing/content/inline";
import { FAQ, FAQ_CATEGORIES } from "@/content/he/site";

export const metadata: Metadata = {
  title: FAQ.meta.title,
  description: FAQ.meta.description,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div>
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
      <PageHero title={FAQ.h1} sub="תשובות קצרות. ואם חסר משהו, כתבו לנו." className="pb-6">
        <div className="text-start">
          <FaqBrowser categories={FAQ_CATEGORIES} />
        </div>
      </PageHero>
      <FinalCta title={FAQ.ctaTitle} subtitle={FAQ.ctaBody} href="/contact" cta={FAQ.cta} />
    </div>
  );
}
