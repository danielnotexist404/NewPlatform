import type { Metadata } from "next";
import { MetaIntegration } from "@/components/campaigns/meta-integration";
import { integrationsCopy, pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: `${integrationsCopy.metaTitle} · ${pageMeta.integrations.title}`, description: pageMeta.integrations.description };

/** Target of the Meta OAuth callback (spec §C.3: /app/settings/integrations/meta?step=assets). */
export default function MetaIntegrationPage() {
  return <MetaIntegration />;
}
