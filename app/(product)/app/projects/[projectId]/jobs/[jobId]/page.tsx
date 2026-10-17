import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/misc";
import { RenderProgress } from "@/components/projects/render-progress";
import { APP_CORE } from "@/content/he/app-core";
import { ALL_PROJECTS, MOCK_JOBS, MOCK_PROJECTS, getJob, getProject } from "@/lib/mock/projects";

export const metadata: Metadata = {
  title: APP_CORE.render.metaTitle,
  description: APP_CORE.render.metaDescription,
};

export function generateStaticParams() {
  const real = MOCK_JOBS.filter((j) => j.id !== "j-new").map((j) => ({ projectId: j.projectId, jobId: j.id }));
  return [...real, ...ALL_PROJECTS.map((p) => ({ projectId: p.id, jobId: "j-new" }))];
}

type Params = Promise<{ projectId: string; jobId: string }>;

async function JobScreen({ params }: { params: Params }) {
  const { projectId, jobId } = await params;
  const project = getProject(projectId);
  const job = getJob(jobId);
  if (!project || !job) notFound();
  // a new job from the wizard renders the sample grill reel (the wizard state lives in the browser only)
  const scenes = project.scenes.length ? project.scenes : MOCK_PROJECTS[0].scenes;
  const effJob = jobId === "j-new" ? { ...job, projectId: project.id, formats: [project.primaryAspect] } : job;
  return <RenderProgress project={project} job={effJob} scenes={scenes} />;
}

/** Part 03 §7 — render progress (simulated on the client until the job channel exists). */
export default function JobPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6" aria-busy="true">
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="grid gap-8 lg:grid-cols-12">
            <Skeleton className="h-96 rounded-lg lg:col-span-4" />
            <Skeleton className="mx-auto aspect-reel w-[300px] rounded-[44px] lg:col-span-8" />
          </div>
        </div>
      }
    >
      <JobScreen params={params} />
    </Suspense>
  );
}
