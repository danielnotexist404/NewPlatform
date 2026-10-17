import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { APP_CORE } from "@/content/he/app-core";
import { OnboardingFlow } from "./_components/onboarding-flow";

export const metadata: Metadata = {
  title: APP_CORE.onboarding.metaTitle,
  description: APP_CORE.onboarding.metaDescription,
};

/** Part 03 §4 + spec 07–08 §L.3: business · niche · voice · connect (skippable). `?step=connect` opens the Meta step. */
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6" aria-busy="true">
          <Skeleton className="h-8 w-80 rounded-full" />
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}
