import { Suspense } from "react";
import type { Metadata } from "next";
import { WizardStepView } from "@/components/wizard/steps/step-view";
import { WizardSkeleton } from "@/components/wizard/wizard-root";
import { APP_CORE } from "@/content/he/app-core";
import { ALL_PROJECTS, WIZARD_STEPS } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.flatMap((p) => WIZARD_STEPS.map((step) => ({ projectId: p.id, step })));
}

export const metadata: Metadata = {
  title: APP_CORE.wizard.metaTitle,
  description: APP_CORE.wizard.metaDescription,
};

/** The step is read on the client (useParams) so navigation between steps stays instant; state lives in the layout. */
export default function WizardStepPage() {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <WizardStepView />
    </Suspense>
  );
}
