import type { Metadata } from "next";
import { HealthReport } from "@/components/campaigns/health-report";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.health.title, description: pageMeta.health.description };

export default function HealthCheckPage() {
  return <HealthReport />;
}
