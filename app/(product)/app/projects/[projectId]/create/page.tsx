import { notFound, redirect } from "next/navigation";
import { ALL_PROJECTS, getProject } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ projectId: p.id }));
}

/** /create without a step → the saved wizard step (Part 03 §6.0). */
export default async function WizardIndex({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const p = getProject(projectId);
  if (!p) notFound();
  redirect(`/app/projects/${p.id}/create/${p.wizardStep ?? "business"}`);
}
