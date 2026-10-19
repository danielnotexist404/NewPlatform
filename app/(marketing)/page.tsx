import type { Metadata } from "next";
import { Hero } from "@/components/marketing/landing/hero";
import { HowItWorks } from "@/components/marketing/landing/how-it-works";
import { DashboardShowcase } from "@/components/marketing/landing/dashboard-showcase";
import { ReelsSection } from "@/components/marketing/landing/reels-section";
import { PricingTeaser } from "@/components/marketing/landing/pricing-teaser";
import { FaqSection, FinalCta } from "@/components/marketing/landing/faq-final";
import { HomeJsonLd } from "@/components/marketing/landing/json-ld";
import { LANDING } from "@/content/he/landing";

export const metadata: Metadata = {
  title: { absolute: LANDING.meta.title },
  description: LANDING.meta.description,
  alternates: { canonical: "/" },
  openGraph: { title: LANDING.meta.title, description: LANDING.meta.description, url: "/" },
};

/** Home (clean redesign): Hero → How it works → Product shot → Reels → Pricing → FAQ → Final CTA. */
export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <HowItWorks />
      <DashboardShowcase />
      <ReelsSection />
      <PricingTeaser />
      <FaqSection />
      <FinalCta />
    </>
  );
}
