import type { Metadata } from "next";
import { CampaignsDashboard } from "@/components/campaigns/campaigns-dashboard";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.campaigns.title, description: pageMeta.campaigns.description };

export default function CampaignsPage() {
  return <CampaignsDashboard />;
}
