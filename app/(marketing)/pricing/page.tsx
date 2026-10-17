import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BadgePercent } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CtaBand, Eyebrow, JsonLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList } from "@/components/marketing/gallery/faq-list";
import { PricingExplorer, PricingExplorerFallback } from "@/components/marketing/pricing/pricing-explorer";
import { PlanComparisonTable } from "@/components/marketing/pricing/plan-comparison-table";
import { CreditCostTable, HealthAndLandingBand, PromisesRow, TrustBox } from "@/components/marketing/pricing/pricing-sections";
import { COMPARE, CREDIT_COSTS, PRICING_FAQ, PRICING_FAQ_H2, PRICING_FINAL_CTA, PRICING_HERO, PRICING_META, PACKS } from "@/content/he/pricing";
import { CREDIT_PACKS, PLANS } from "@/lib/data/plans";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: PRICING_META.title,
  description: PRICING_META.description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: PRICING_META.title, description: PRICING_META.description, url: "/pricing" },
};

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
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: 0,
      highPrice: Math.max(...PLANS.map((p) => p.monthlyIls)),
      offerCount: offers.length,
      offers,
    },
  };
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[productLd(), faqLd(PRICING_FAQ)]} />

      <section id="hero" className="container-marketing flex flex-col items-center gap-5 pb-10 pt-12 text-center md:pt-16">
        <Eyebrow>{PRICING_HERO.eyebrow}</Eyebrow>
        <h1 className="text-h1 max-w-3xl">
          מחירים פשוטים, <span className="text-gold-gradient">בשקלים</span>
        </h1>
        <p className="text-body-lg max-w-2xl text-text-2">{PRICING_HERO.intro}</p>
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-small font-semibold text-text shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]">
          <BadgePercent aria-hidden className="size-4.5 text-primary-text" />
          {PRICING_HERO.zeroPct}
        </p>
      </section>

      <section aria-label="תוכניות וחבילות" className="container-marketing pb-14">
        <Suspense fallback={<PricingExplorerFallback />}>
          <PricingExplorer />
        </Suspense>
      </section>

      <section aria-label="מה מקבלים בכל תוכנית" className="container-marketing pb-16">
        <PromisesRow />
      </section>

      <section aria-label="בדיקת דופק ודף העסק" className="container-marketing pb-20">
        <HealthAndLandingBand />
      </section>

      <section aria-labelledby="compare-title" className="container-marketing pb-20">
        <h2 id="compare-title" className="text-h2 mb-6">
          {COMPARE.h2}
        </h2>
        <PlanComparisonTable />
      </section>

      <section id="credit-costs" aria-labelledby="credit-costs-title" className="container-marketing scroll-mt-24 pb-20">
        <h2 id="credit-costs-title" className="text-h2">
          {CREDIT_COSTS.h2}
        </h2>
        <p className="text-body-lg mt-3 mb-8 max-w-3xl text-text-2">{CREDIT_COSTS.intro}</p>
        <CreditCostTable />
      </section>

      <section aria-label="ביטול ומע״מ" className="container-marketing pb-20">
        <TrustBox />
      </section>

      <section aria-labelledby="pricing-faq" className="container-marketing">
        <h2 id="pricing-faq" className="text-h2 mb-6">
          {PRICING_FAQ_H2}
        </h2>
        <FaqList items={PRICING_FAQ} />
      </section>

      <CtaBand title={PRICING_FINAL_CTA.title} body={PRICING_FINAL_CTA.body}>
        <Link href="/login?next=/app/onboarding" className={buttonVariants({ size: "xl" })}>
          {PRICING_FINAL_CTA.cta}
        </Link>
        <Link href="/faq" className={buttonVariants({ size: "xl", variant: "secondary" })}>
          {PRICING_FINAL_CTA.secondary}
        </Link>
      </CtaBand>
    </>
  );
}
