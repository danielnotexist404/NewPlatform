import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CtaBand, JsonLd, SectionHeading, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList } from "@/components/marketing/gallery/faq-list";
import { DashboardPreview } from "@/components/marketing/landing/dashboard-preview";
import { CampaignsHero } from "@/components/marketing/campaigns/campaigns-hero";
import { BuilderSteps, GoalsGrid, Guardrails, MoneyFlow, SplitTest } from "@/components/marketing/campaigns/campaign-sections";
import { BusinessPage, HealthCheck, LeadsInbox, PublishingCalendar, WeeklySummary } from "@/components/marketing/campaigns/campaign-mocks";
import { CAMPAIGNS_FAQ, CAMPAIGNS_FAQ_H2, CAMPAIGNS_FINAL, CAMPAIGNS_META, DASHBOARD } from "@/content/he/campaigns";
import { BRAND, SIGNUP_HREF } from "@/lib/constants";

export const metadata: Metadata = {
  title: CAMPAIGNS_META.title,
  description: CAMPAIGNS_META.description,
  alternates: { canonical: "/campaigns" },
  openGraph: { title: CAMPAIGNS_META.title, description: CAMPAIGNS_META.description, url: "/campaigns" },
};

/**
 * /campaigns — feature page "קמפיינים בפייסבוק ובאינסטגרם בלי סוכנות" (spec 07–08 §L.5).
 * Claims gate (§L.6): must render only while `meta_ads` is on, once flags exist.
 */
export default function CampaignsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { label: "ראשי", href: "/" },
              { label: "קמפיינים", href: "/campaigns" },
            ],
            BRAND.domain,
          ),
          faqLd(CAMPAIGNS_FAQ),
        ]}
      />
      <CampaignsHero />
      <GoalsGrid />
      <BuilderSteps />

      <section id="dashboard" aria-labelledby="dash-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
        <SectionHeading id="dash-title" eyebrow={DASHBOARD.eyebrow} title={DASHBOARD.h2} subtitle={DASHBOARD.sub} align="center" className="mx-auto" />
        <div className="mt-10">
          <DashboardPreview />
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {DASHBOARD.points.map((p) => (
            <li key={p.title} className="border-s-2 border-primary ps-4">
              <h3 className="font-bold">{p.title}</h3>
              <p className="mt-1 text-small text-text-2">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-micro font-normal text-muted">{DASHBOARD.freshness}</p>
      </section>

      <SplitTest />
      <LeadsInbox />
      <PublishingCalendar />
      <HealthCheck />
      <BusinessPage />
      <WeeklySummary />
      <MoneyFlow />
      <Guardrails />

      <section aria-labelledby="campaigns-faq" className="container-marketing py-8">
        <h2 id="campaigns-faq" className="text-h2 mb-6">
          {CAMPAIGNS_FAQ_H2}
        </h2>
        <FaqList items={CAMPAIGNS_FAQ} />
      </section>

      <CtaBand title={CAMPAIGNS_FINAL.title} body={CAMPAIGNS_FINAL.body}>
        <Link href={SIGNUP_HREF} className={buttonVariants({ size: "xl" })} data-cta-location="campaigns_page">
          {CAMPAIGNS_FINAL.cta}
        </Link>
        <Link href="/pricing" className={buttonVariants({ size: "xl", variant: "secondary" })}>
          {CAMPAIGNS_FINAL.secondary}
        </Link>
      </CtaBand>
    </>
  );
}
