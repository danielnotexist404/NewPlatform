import type { Metadata } from "next";
import { LandingStyles } from "@/components/marketing/landing/landing-styles";
import { Hero } from "@/components/marketing/landing/hero";
import { LANDING } from "@/content/he/landing";

export const metadata: Metadata = {
  title: { absolute: LANDING.meta.title },
  description: LANDING.meta.description,
  alternates: { canonical: "/" },
  openGraph: { title: LANDING.meta.title, description: LANDING.meta.description, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <LandingStyles />
      <Hero />
    </>
  );
}
