import type { Metadata } from "next";
import { LeadsInbox } from "@/components/leads/leads-inbox";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.leads.title, description: pageMeta.leads.description };

export default function LeadsPage() {
  return <LeadsInbox />;
}
