import type { Metadata } from "next";
import { MetaIntegration } from "@/components/campaigns/meta-integration";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.integrations.title, description: pageMeta.integrations.description };

export default function IntegrationsPage() {
  return <MetaIntegration />;
}
