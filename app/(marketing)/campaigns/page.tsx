import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/marketing/gallery/kit";
import { FaqList, FinalCta } from "@/components/marketing/landing/faq-final";
import { ScrollTilt } from "@/components/marketing/landing/scroll-tilt";
import { CampaignDashboard } from "@/components/marketing/media/campaign-dashboard";
import { CampaignHeroVisual, LeadsVisual, SetupVisual } from "@/components/marketing/campaigns/visuals";
import { Band, FeatureRow, HeroActions, PageHero, PromiseStrip, VisualPanel } from "@/components/marketing/page/kit";
import { CAMPAIGNS, CAMPAIGNS_FAQ, CAMPAIGNS_FAQ_H2, CAMPAIGNS_FINAL, CAMPAIGNS_META } from "@/content/he/campaigns";
import { LANDING } from "@/content/he/landing";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: CAMPAIGNS_META.title,
  description: CAMPAIGNS_META.description,
  alternates: { canonical: "/campaigns" },
  openGraph: { title: CAMPAIGNS_META.title, description: CAMPAIGNS_META.description, url: "/campaigns" },
};

const C = CAMPAIGNS;

/** /campaigns — feature page (spec 07–08 §L.5). Claims gate (§L.6): render only while `meta_ads` is on, once flags exist. */
export default function CampaignsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ label: "ראשי", href: "/" }, { label: "קמפיינים", href: "/campaigns" }], BRAND.domain),
          faqLd(CAMPAIGNS_FAQ),
        ]}
      />
      <PageHero
        align="split"
        title={C.hero.title}
        accent={C.hero.accent}
        sub={C.hero.sub}
        actions={<HeroActions primary={C.hero.cta} secondary={C.hero.secondary} secondaryHref="#dashboard" />}
      >
        <CampaignHeroVisual />
      </PageHero>

      <FeatureRow
        id="setup"
        title={C.setup.title}
        text={C.setup.text}
        visual={<VisualPanel className="px-5 py-12 md:px-10 md:py-16"><SetupVisual /></VisualPanel>}
      />

      <Band id="dashboard" title={C.dash.title} sub={C.dash.sub} className="overflow-x-clip">
        <ScrollTilt>
          <CampaignDashboard />
        </ScrollTilt>
        <p className="mt-5 text-center text-micro font-normal text-muted">{LANDING.dash.disclaimer}</p>
      </Band>

      <FeatureRow
        id="leads"
        flip
        title={C.leads.title}
        text={C.leads.text}
        visual={<VisualPanel className="px-5 py-12 md:px-10 md:py-16"><LeadsVisual /></VisualPanel>}
      />

      <Band id="promises" title={C.promisesTitle} tight>
        <PromiseStrip items={C.promises} />
      </Band>

      <Band id="campaigns-faq" title={CAMPAIGNS_FAQ_H2}>
        <FaqList items={CAMPAIGNS_FAQ.map((f) => ({ id: f.id, q: f.q_he, a: f.a_he }))} className="mx-auto max-w-3xl" />
      </Band>

      <FinalCta title={CAMPAIGNS_FINAL.title} subtitle={CAMPAIGNS_FINAL.body} />
    </>
  );
}
