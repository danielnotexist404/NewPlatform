import { notFound, redirect } from "next/navigation";
import { ALL_PROJECTS, NEW_DRAFT_ID, getProject } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ projectId: p.id }));
}

/** /create without a step → the 3-screen flow for this project. */
export default async function WizardIndex({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const p = getProject(projectId);
  if (!p) notFound();
  redirect(p.id === NEW_DRAFT_ID ? "/app/create" : `/app/create?project=${p.id}`);
}
