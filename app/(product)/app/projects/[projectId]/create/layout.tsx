import { Suspense } from "react";
import { WizardRoot, WizardSkeleton } from "@/components/wizard/wizard-root";

/** The wizard state lives in this layout, so it survives navigation between the 9 step routes. */
export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<WizardSkeleton />}>
      <WizardRoot>{children}</WizardRoot>
    </Suspense>
  );
}
