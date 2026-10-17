import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { APP_CORE } from "@/content/he/app-core";
import { MOCK_PROJECTS } from "@/lib/mock/projects";

export const metadata: Metadata = {
  title: APP_CORE.projects.metaTitle,
  description: APP_CORE.projects.metaDescription,
};

function GridSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-14 w-56" />
      <Skeleton className="h-28 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="aspect-reel rounded-md" />)}
      </div>
    </div>
  );
}

/** Part 03 §10 — the filter state lives in the URL, so the browser reads search params under Suspense. */
export default function ProjectsPage() {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <ProjectsBrowser projects={MOCK_PROJECTS} />
    </Suspense>
  );
}
