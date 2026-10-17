import { BRAND } from "@/lib/constants";
import { PLANS } from "@/lib/data/plans";
import { LANDING } from "@/content/he/landing";

/** Data block, not executed: `<` is escaped so a string can never close the tag (Part 02 §12.4). */
function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Home-page JSON-LD: WebSite + SearchAction, SoftwareApplication, FAQPage, HowTo. No ratings, reviews or user counts. */
export function HomeJsonLd() {
  const site = `https://${BRAND.domain}`;
  const prices = PLANS.map((p) => p.monthlyIls);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: BRAND.nameHe,
          alternateName: BRAND.nameEn,
          url: `${site}/`,
          inLanguage: "he",
          potentialAction: { "@type": "SearchAction", target: `${site}/hooks?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: BRAND.nameHe,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          inLanguage: "he",
          url: `${site}/`,
          offers: { "@type": "AggregateOffer", priceCurrency: "ILS", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: PLANS.length },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: LANDING.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: LANDING.how.title,
          inLanguage: "he",
          step: LANDING.how.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
        }}
      />
    </>
  );
}
