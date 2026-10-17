"use client";
import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/misc";
import { APP_CORE } from "@/content/he/app-core";
import { NEW_DRAFT, getProject, type WizardStep } from "@/lib/mock/projects";
import { WizardProvider, initWizard } from "./wizard-state";
import { WizardShell } from "./wizard-shell";

/** Mounts once per wizard session (the create/ layout persists across steps), so state survives step changes. */
export function WizardRoot({ children }: { children: React.ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const q = useSearchParams();
  const project = getProject(params.projectId) ?? NEW_DRAFT;
  const [initial] = React.useState(() => initWizard(project, new URLSearchParams(q.toString())).data);
  return (
    <WizardProvider initial={initial}>
      <WizardShell>{children}</WizardShell>
    </WizardProvider>
  );
}

/** Skeleton in the final geometry (Part 03 §1.3). */
export function WizardSkeleton({ label = APP_CORE.wizard.creating }: { label?: string }) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label={label}>
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="ms-auto h-8 w-28 rounded-full" />
      </div>
      <div className="hidden gap-3 lg:flex">
        {Array.from({ length: 9 }, (_, i) => <Skeleton key={i} className="h-7 flex-1 rounded-full" />)}
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <Skeleton className="mx-auto aspect-reel w-[300px] rounded-[44px]" />
        </div>
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}

/** /app/create: opens a draft and replaces the URL with its landing step (no second draft on "back"). */
export function CreateRedirect() {
  const router = useRouter();
  const q = useSearchParams();
  React.useEffect(() => {
    const query = q.toString();
    const { landing } = initWizard(NEW_DRAFT, new URLSearchParams(query));
    const step: WizardStep = landing;
    router.replace(`/app/projects/${NEW_DRAFT.id}/create/${step}${query ? `?${query}` : ""}`);
  }, [q, router]);
  return <WizardSkeleton />;
}
