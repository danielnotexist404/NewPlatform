import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/campaigns/detail/campaign-detail";
import { DetailSkeleton } from "@/components/campaigns/detail/detail-skeleton";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { pageMeta } from "@/content/he/campaigns-app";

type Params = Promise<{ campaignId: string }>;

export function generateStaticParams() {
  return campaigns.map((c) => ({ campaignId: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { campaignId } = await params;
  const c = getCampaign(campaignId);
  return {
    title: c ? `${c.name} · ${pageMeta.campaign.title}` : pageMeta.campaign.title,
    description: pageMeta.campaign.description,
  };
}

async function CampaignContent({ params }: { params: Params }) {
  const { campaignId } = await params;
  const campaign = getCampaign(campaignId);
  if (!campaign) notFound();
  return <CampaignDetail campaign={campaign} />;
}

export default function CampaignPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <CampaignContent params={params} />
    </Suspense>
  );
}
