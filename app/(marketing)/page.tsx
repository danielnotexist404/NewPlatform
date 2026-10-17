import type { Metadata } from "next";
import { Hero } from "@/components/marketing/landing/hero";
import { NicheMarquee } from "@/components/marketing/landing/niche-marquee";
import { HowItWorks } from "@/components/marketing/landing/how-it-works";
import { DashboardShowcase } from "@/components/marketing/landing/dashboard-showcase";
import { TrendsCarousel } from "@/components/marketing/landing/trends-carousel";
import { PricingTeaser } from "@/components/marketing/landing/pricing-teaser";
import { AgencyBenefits } from "@/components/marketing/landing/agency-benefits";
import { FaqSection, FinalCta } from "@/components/marketing/landing/faq-final";
import { RevealObserver } from "@/components/marketing/landing/reveal-observer";
import { HomeJsonLd } from "@/components/marketing/landing/json-ld";
import { LANDING } from "@/content/he/landing";

export const metadata: Metadata = {
  title: { absolute: LANDING.meta.title },
  description: LANDING.meta.description,
  alternates: { canonical: "/" },
  openGraph: { title: LANDING.meta.title, description: LANDING.meta.description, url: "/" },
};

/**
 * Home page (2026 light redesign): Hero → Niches → How it works → Dashboard → Trends → Pricing
 * → "Still paying an agency?" → FAQ → Final CTA. Promo bar, header and footer come from the marketing layout.
 */
export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <RevealObserver />
      <Hero />
      <NicheMarquee />
      <HowItWorks />
      <DashboardShowcase />
      <TrendsCarousel />
      <PricingTeaser />
      <AgencyBenefits />
      <FaqSection />
      <FinalCta />
    </>
  );
}
