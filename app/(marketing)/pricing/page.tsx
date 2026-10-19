import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { PricingExplorer, PricingExplorerFallback } from "@/components/marketing/pricing/pricing-explorer";
import { PlanComparisonTable } from "@/components/marketing/pricing/plan-comparison-table";
import { CreditCostTable } from "@/components/marketing/pricing/pricing-sections";
import { Band, Disclosure, PageHero, PromiseStrip } from "@/components/marketing/page/kit";
import { COMPARE, CREDIT_COSTS, PRICING_FAQ, PRICING_FAQ_H2, PRICING_FINAL_CTA, PRICING_META, PACKS } from "@/content/he/pricing";
import { CREDIT_PACKS, PLANS } from "@/lib/data/plans";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: PRICING_META.title,
  description: PRICING_META.description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: PRICING_META.title, description: PRICING_META.description, url: "/pricing" },
};

const FAQ_IDS = ["credits", "meta-fee", "pricing-rollover", "pricing-refund-14", "invoice-vat"];
const FAQ = PRICING_FAQ.filter((f) => FAQ_IDS.includes(f.id));

const PROMISES = [
  { title: "0% מהתקציב", text: "התקציב עובר ישירות למטא." },
  { title: "ביטול בכל רגע", text: "אונליין, בלי שיחת שימור." },
  { title: "קרדיטים עוברים", text: "מה שלא נוצל עובר לחודש הבא." },
  { title: "חשבונית מס", text: "על כל תשלום, כולל מע״מ." },
];

function productLd() {
  const offers = [
    ...PLANS.map((p) => ({
      "@type": "Offer",
      name: p.nameHe,
      price: p.monthlyIls,
      priceCurrency: "ILS",
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.monthlyIls, priceCurrency: "ILS", valueAddedTaxIncluded: true, unitText: "MONTH" },
    })),
    ...CREDIT_PACKS.map((pk) => ({
      "@type": "Offer",
      name: PACKS.name(String(pk.credits)),
      price: pk.priceIls,
      priceCurrency: "ILS",
      priceSpecification: { "@type": "PriceSpecification", price: pk.priceIls, priceCurrency: "ILS", valueAddedTaxIncluded: true },
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: BRAND.nameHe,
    description: PRICING_META.description,
    brand: { "@type": "Brand", name: BRAND.nameHe },
    offers: { "@type": "AggregateOffer", priceCurrency: "ILS", lowPrice: 0, highPrice: Math.max(...PLANS.map((p) => p.monthlyIls)), offerCount: offers.length, offers },
  };
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[productLd(), faqLd(FAQ)]} />
      <PageHero title="מחירים פשוטים." accent="בשקלים." sub="מתחילים בחינם. מבטלים אונליין בכל רגע." className="pb-6 md:pb-10">
        <Suspense fallback={<PricingExplorerFallback />}>
          <PricingExplorer />
        </Suspense>
      </PageHero>

      <Band id="promises" tight>
        <PromiseStrip items={PROMISES} />
      </Band>

      <Band id="details" title="כל הפרטים" sub="למי שאוהב לדעת הכול מראש.">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <Disclosure summary={COMPARE.h2}>
            <PlanComparisonTable />
          </Disclosure>
          <Disclosure summary={CREDIT_COSTS.h2}>
            <p className="mb-6 max-w-3xl text-body text-text-2">{CREDIT_COSTS.intro}</p>
            <CreditCostTable />
          </Disclosure>
        </div>
      </Band>

      <Band id="pricing-faq" title={PRICING_FAQ_H2}>
        <FaqList items={FAQ.map((f) => ({ id: f.id, q: f.q_he, a: f.a_he }))} className="mx-auto max-w-3xl" />
      </Band>

      <FinalCta title={PRICING_FINAL_CTA.title} subtitle={PRICING_FINAL_CTA.body} />
    </>
  );
}
