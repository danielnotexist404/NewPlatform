import { notFound, redirect } from "next/navigation";
import { ALL_PROJECTS, NEW_DRAFT_ID, WIZARD_STEPS, getProject } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.flatMap((p) => WIZARD_STEPS.map((step) => ({ projectId: p.id, step })));
}

/** The 9-step wizard became 3 screens: old step links open the new flow for the same project. */
export default async function WizardStepPage({ params }: { params: Promise<{ projectId: string; step: string }> }) {
  const { projectId } = await params;
  const p = getProject(projectId);
  if (!p) notFound();
  redirect(p.id === NEW_DRAFT_ID ? "/app/create" : `/app/create?project=${p.id}`);
}
