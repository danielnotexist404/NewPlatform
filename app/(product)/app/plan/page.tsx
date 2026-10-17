import type { Metadata } from "next";
import { PlanBoard } from "@/components/plan/plan-board";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.plan.title, description: pageMeta.plan.description };

export default function PlanPage() {
  return <PlanBoard />;
}
