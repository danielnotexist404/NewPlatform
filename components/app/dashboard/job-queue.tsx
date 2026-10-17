"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Num } from "@/components/a11y/num";
import { VideoTile } from "@/components/video/video-tile";
import { StatusBadge } from "@/components/projects/status-badge";
import { Plural, plural } from "@/components/projects/plural";
import { CancelJobDialog } from "@/components/projects/cancel-job-dialog";
import { APP_CORE } from "@/content/he/app-core";
import type { MockJob, MockProject } from "@/lib/mock/projects";

const D = APP_CORE.dashboard.queue;

function stageLabel(progress: number, scenes: number) {
  if (progress < 12) return "מקליטים קריינות";
  if (progress < 20) return "מסנכרנים כתוביות";
  if (progress < 80) {
    const done = Math.min(scenes, Math.max(1, Math.round(((progress - 20) / 60) * scenes)));
    return `יוצרים סצנות · ${done} מתוך ${scenes}`;
  }
  return "מרכיבים את הסרטון";
}

/** One card per active job (Part 03 §5.2). Progress is simulated on the client. */
export function JobQueue({ items }: { items: { job: MockJob; project: MockProject }[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="queue-title" id="queue" className="flex flex-col gap-3">
      <h2 id="queue-title" className="flex items-center gap-2 text-h3">
        <span className="size-2 rounded-full bg-violet animate-pulse-dot" aria-hidden />
        {D.title}
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <JobQueueCard key={it.job.id} {...it} />
        ))}
      </ul>
    </section>
  );
}

function JobQueueCard({ job, project }: { job: MockJob; project: MockProject }) {
  const [progress, setProgress] = React.useState(job.progress);
  const [stopOpen, setStopOpen] = React.useState(false);
  const [canceled, setCanceled] = React.useState(false);
  React.useEffect(() => {
    if (canceled) return;
    const id = window.setInterval(() => setProgress((p) => (p >= 92 ? p : p + 1)), 2500);
    return () => window.clearInterval(id);
  }, [canceled]);
  const minutesLeft = Math.max(1, Math.round(((100 - progress) / 100) * 6));
  if (canceled) return null;
  return (
    <li className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] glow-ai sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="w-14 shrink-0">
          <VideoTile tone={project.tone} icon={project.scenes[0]?.icon} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p dir="auto" className="truncate font-bold">{project.title}</p>
            <StatusBadge kind="job" status={job.status} />
          </div>
          <p className="text-small text-text-2">{stageLabel(progress, project.scenes.length || 5)}</p>
          <div className="flex items-center gap-3">
            <Progress value={progress} variant="ai" aria-label={`${progress}%`} className="max-w-md" />
            <span className="shrink-0 text-small font-semibold"><Num value={progress} />%</span>
          </div>
          <p className="text-micro font-normal text-muted">
            {plural(minutesLeft, APP_CORE.counts.minutesLeft)} · <Plural n={job.reservedCredits} forms={APP_CORE.counts.reserved} />
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/app/projects/${project.id}/jobs/${job.id}`}>{D.watch}</Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-danger" onClick={() => setStopOpen(true)}>{D.stop}</Button>
      </div>
      <CancelJobDialog
        open={stopOpen}
        onOpenChange={setStopOpen}
        captured={job.capturedCredits}
        onConfirm={() => {
          setCanceled(true);
          toast.success(`${APP_CORE.render.canceled} ${plural(job.reservedCredits - job.capturedCredits, APP_CORE.counts.refunded)}`);
        }}
      />
    </li>
  );
}
