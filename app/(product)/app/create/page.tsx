import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateRedirect, WizardSkeleton } from "@/components/wizard/wizard-root";
import { APP_CORE } from "@/content/he/app-core";

export const metadata: Metadata = {
  title: APP_CORE.wizard.metaTitle,
  description: APP_CORE.wizard.metaDescription,
};

/** Part 03 §6.0: creates a draft (mock) and replaces the URL with the landing step. */
export default function CreatePage() {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <CreateRedirect />
    </Suspense>
  );
}
