import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { WizardStepView } from "@/components/wizard/steps/step-view";
import { APP_CORE } from "@/content/he/app-core";
import { ALL_PROJECTS, WIZARD_STEPS, getProject, type WizardStep } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.flatMap((p) => WIZARD_STEPS.map((step) => ({ projectId: p.id, step })));
}

export async function generateMetadata({ params }: { params: Promise<{ projectId: string; step: string }> }): Promise<Metadata> {
  const { step } = await params;
  const label = (APP_CORE.wizard.steps as Record<string, string>)[step];
  return {
    title: label ? `${APP_CORE.wizard.metaTitle} · ${label}` : APP_CORE.wizard.metaTitle,
    description: APP_CORE.wizard.metaDescription,
  };
}

export default async function WizardStepPage({ params }: { params: Promise<{ projectId: string; step: string }> }) {
  const { projectId, step } = await params;
  const project = getProject(projectId);
  if (!project) notFound();
  if (!(WIZARD_STEPS as string[]).includes(step)) redirect(`/app/projects/${project.id}/create/${project.wizardStep ?? "business"}`);
  return <WizardStepView step={step as WizardStep} />;
}
