import type { Metadata } from "next";
import { LandingStyles } from "@/components/marketing/landing/landing-styles";
import { Hero } from "@/components/marketing/landing/hero";
import { EnginesStrip, Pillars } from "@/components/marketing/landing/engines-pillars";
import { NichesSection } from "@/components/marketing/landing/niches-section";
import { Section, SectionHeading } from "@/components/marketing/landing/section-heading";
import { HowItWorks } from "@/components/marketing/landing/how-it-works";
import { CampaignFlow } from "@/components/marketing/landing/campaign-flow";
import { GrowthExtras } from "@/components/marketing/landing/growth-extras";
import { EditorMath } from "@/components/marketing/landing/editor-math";
import { FeatureBento } from "@/components/marketing/landing/feature-bento";
import { HooksTeaser } from "@/components/marketing/landing/hooks-teaser";
import { TrendsTeaser } from "@/components/marketing/landing/trends-teaser";
import { ComparisonBlock, CountersRow, Showcase } from "@/components/marketing/landing/proof-sections";
import { PricingTeaser } from "@/components/marketing/landing/pricing-teaser";
import { FaqSection, FinalCta } from "@/components/marketing/landing/faq-final";
import { LiveRegion } from "@/components/marketing/landing/hook-card";
import { HomeJsonLd } from "@/components/marketing/landing/json-ld";
import { LANDING } from "@/content/he/landing";

export const metadata: Metadata = {
  title: { absolute: LANDING.meta.title },
  description: LANDING.meta.description,
  alternates: { canonical: "/" },
  openGraph: { title: LANDING.meta.title, description: LANDING.meta.description, url: "/" },
};

/**
 * Home page — Part 02 §3 order with the spec 07–08 §L.5 additions:
 * Hero → Engines → Pillars (§A.2) → Niches → HowItWorks → CampaignFlow (+Dashboard) → Extras (§S.1/§S.2)
 * → EditorMath → Features → Hooks → Trends → Examples → Counters (Testimonials hidden: none approved)
 * → Compare → Pricing → FAQ → Final CTA.
 */
export default function HomePage() {
  return (
    <>
      <LandingStyles />
      <HomeJsonLd />
      <LiveRegion />
      <Hero />
      <EnginesStrip />
      <Pillars />
      <NichesSection />
      <Section id="how-it-works" labelledBy="how-title">
        <SectionHeading id="how-title" eyebrow={LANDING.how.eyebrow} title={LANDING.how.title} />
        <HowItWorks />
      </Section>
      <CampaignFlow />
      <GrowthExtras />
      <EditorMath />
      <FeatureBento />
      <HooksTeaser />
      <TrendsTeaser />
      <Showcase />
      <CountersRow />
      <ComparisonBlock />
      <Section id="pricing" labelledBy="pricing-title">
        <SectionHeading id="pricing-title" eyebrow={LANDING.pricing.eyebrow} title={LANDING.pricing.title} subtitle={LANDING.pricing.subtitle} />
        <PricingTeaser />
      </Section>
      <FaqSection />
      <FinalCta />
    </>
  );
}
