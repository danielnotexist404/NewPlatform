import { Check, CircleAlert, Clock, Circle, TriangleAlert } from "lucide-react";
import { APP_CORE } from "@/content/he/app-core";
import type { JobStatus, ProjectStage } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

/** Status with icon + text, never color alone (Part 01 §10.10). App-core local copy until the shared one exists. */
type Tone = "neutral" | "progress" | "waiting" | "success" | "warning" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-surface-3 text-text-2",
  progress: "bg-violet/15 text-violet",
  waiting: "bg-primary/15 text-primary-text",
  success: "bg-success/15 text-success",
  warning: "bg-primary/15 text-primary-text",
  danger: "bg-danger/15 text-danger",
};

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "progress") return <span className="size-1.5 rounded-full bg-violet animate-pulse-dot" aria-hidden />;
  const I = tone === "success" ? Check : tone === "danger" ? CircleAlert : tone === "warning" ? TriangleAlert : tone === "waiting" ? Clock : Circle;
  return <I className="size-3.5" aria-hidden />;
}

const s = APP_CORE.status;

const PROJECT: Record<ProjectStage, [string, Tone]> = {
  draft: [s.project.draft, "neutral"],
  brief: [s.project.brief, "neutral"],
  script: [s.project.script, "neutral"],
  storyboard: [s.project.storyboard, "neutral"],
  voice: [s.project.inProgress, "progress"],
  captions: [s.project.inProgress, "progress"],
  assets: [s.project.inProgress, "progress"],
  render: [s.project.inProgress, "progress"],
  done: [s.project.done, "success"],
  failed: [s.project.failed, "danger"],
};

const JOB: Record<JobStatus, [string, Tone]> = {
  queued: [s.job.queued, "waiting"],
  running: [s.job.running, "progress"],
  waiting_external: [s.job.waiting_external, "progress"],
  succeeded: [s.job.succeeded, "success"],
  failed: [s.job.failed, "danger"],
  canceled: [s.job.canceled, "neutral"],
};

type SceneStatus = keyof typeof s.scene;
const SCENE: Record<SceneStatus, [string, Tone]> = {
  pending: [s.scene.pending, "neutral"],
  generating: [s.scene.generating, "progress"],
  ready: [s.scene.ready, "success"],
  failed: [s.scene.failed, "danger"],
  degraded: [s.scene.degraded, "warning"],
};

export type StatusBadgeProps =
  | { kind: "project"; status: ProjectStage; className?: string; size?: "sm" | "md" }
  | { kind: "job"; status: JobStatus; className?: string; size?: "sm" | "md" }
  | { kind: "scene"; status: SceneStatus; className?: string; size?: "sm" | "md" };

export function statusLabel(p: Pick<StatusBadgeProps, "kind" | "status">): string {
  if (p.kind === "project") return PROJECT[p.status as ProjectStage][0];
  if (p.kind === "job") return JOB[p.status as JobStatus][0];
  return SCENE[p.status as SceneStatus][0];
}

export function StatusBadge(props: StatusBadgeProps) {
  const [label, tone] =
    props.kind === "project" ? PROJECT[props.status] : props.kind === "job" ? JOB[props.status] : SCENE[props.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs font-semibold whitespace-nowrap",
        props.size === "md" ? "px-2.5 py-1 text-small" : "px-2 py-0.5 text-micro",
        TONE_CLASS[tone],
        props.className,
      )}
    >
      <ToneIcon tone={tone} />
      {label}
    </span>
  );
}
