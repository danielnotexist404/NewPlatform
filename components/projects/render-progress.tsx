"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta } from "@/components/layout/cta-styles";
import { RenderScreen } from "@/components/wizard/render-screen";
import type { MockJob, MockProject, MockScene } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

const SIM_SECONDS = 14; // demo: the remaining pipeline in a few seconds

/** Render progress for a sample job (simulated until the job channel exists): ring + four steps, then the video page. */
export function RenderProgress({ project, job, scenes }: { project: MockProject; job: MockJob; scenes: MockScene[] }) {
  const router = useRouter();
  const failed = job.status === "failed" || job.status === "canceled";
  const [p, setP] = React.useState(job.status === "succeeded" ? 100 : job.progress);

  React.useEffect(() => {
    if (failed || p >= 100) return;
    const id = window.setInterval(() => setP((v) => Math.min(100, v + 100 / (SIM_SECONDS * 2))), 500);
    return () => window.clearInterval(id);
  }, [failed, p]);

  const done = p >= 100;
  React.useEffect(() => {
    if (!done || failed) return;
    toast.success("הסרטון מוכן");
    const id = window.setTimeout(() => router.push(`/app/projects/${project.id}`), 1200);
    return () => window.clearTimeout(id);
  }, [done, failed, router, project.id]);

  const stage = done ? 4 : p < 10 ? 0 : p < 78 ? 1 : p < 88 ? 2 : 3;
  const n = scenes.length;
  const scenesDone = Math.min(n, Math.max(0, Math.floor(((p - 10) / 68) * n)));

  return (
    <div className="flex flex-col gap-4">
      <Link href="/app/projects" className="inline-flex w-fit items-center gap-1.5 text-small font-semibold text-text-2 hover:text-text">
        <DirIcon name="back" className="size-4" />
        <span dir="auto">{project.title}</span>
      </Link>
      <RenderScreen
        stage={stage}
        target={failed ? 0 : p}
        scenes={[scenesDone, n]}
        error={failed}
        onRetry={() => router.push(`/app/create?project=${project.id}`)}
      />
      {done && !failed && (
        <div className="flex justify-center">
          <Link href={`/app/projects/${project.id}`} className={cn(accentCta, "h-12 px-7")}>
            לסרטון
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
