import type { Metadata } from "next";
import { CampaignBuilder } from "@/components/campaigns/builder/campaign-builder";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.newCampaign.title, description: pageMeta.newCampaign.description };

export default function NewCampaignPage() {
  return <CampaignBuilder />;
}
