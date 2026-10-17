import { Suspense } from "react";
import type { Metadata } from "next";
import { BuilderEntry } from "@/components/campaigns/builder/builder-entry";
import { DetailSkeleton } from "@/components/campaigns/detail/detail-skeleton";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.newCampaign.title, description: pageMeta.newCampaign.description };

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <BuilderEntry />
    </Suspense>
  );
}
