import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/campaigns/detail/campaign-detail";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { pageMeta } from "@/content/he/campaigns-app";

export function generateStaticParams() {
  return campaigns.map((c) => ({ campaignId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ campaignId: string }> }): Promise<Metadata> {
  const { campaignId } = await params;
  const c = getCampaign(campaignId);
  return {
    title: c ? `${c.name} · ${pageMeta.campaign.title}` : pageMeta.campaign.title,
    description: pageMeta.campaign.description,
  };
}

export default async function CampaignPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = getCampaign(campaignId);
  if (!campaign) notFound();
  return <CampaignDetail campaign={campaign} />;
}
