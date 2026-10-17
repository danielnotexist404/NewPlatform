import type { Metadata } from "next";
import { PublishOverview } from "@/components/publish/publish-overview";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.publish.title, description: pageMeta.publish.description };

export default function PublishPage() {
  return <PublishOverview />;
}
