import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/misc";
import { ProjectView } from "@/components/projects/project-view";
import { APP_CORE } from "@/content/he/app-core";
import { ALL_PROJECTS, PROJECT_STAGE_GROUP, getProject } from "@/lib/mock/projects";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ projectId: p.id }));
}

export const metadata: Metadata = {
  title: APP_CORE.project.metaTitleFallback,
  description: APP_CORE.project.metaDescription,
};

type Params = Promise<{ projectId: string }>;

async function ProjectScreen({ params }: { params: Params }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) notFound();
  // Part 03 §8.1: drafts open the wizard at the saved step; an active job opens the progress screen
  const group = PROJECT_STAGE_GROUP[project.stage];
  if (group === "drafts") redirect(`/app/projects/${project.id}/create/${project.wizardStep ?? "business"}`);
  if (group === "progress" && project.latestJobId) redirect(`/app/projects/${project.id}/jobs/${project.latestJobId}`);
  return <ProjectView project={project} />;
}

export default function ProjectPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6" aria-busy="true">
          <Skeleton className="h-12 w-2/3" />
          <div className="grid gap-8 lg:grid-cols-12">
            <Skeleton className="mx-auto aspect-reel w-[340px] rounded-[44px] lg:col-span-7" />
            <Skeleton className="h-96 rounded-lg lg:col-span-5" />
          </div>
        </div>
      }
    >
      <ProjectScreen params={params} />
    </Suspense>
  );
}
