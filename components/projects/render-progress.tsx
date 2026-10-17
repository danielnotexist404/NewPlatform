"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, CircleAlert, Clock, Download, MessageCircle, Pencil, Share2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PhoneFrame } from "@/components/video/phone-frame";
import { PhonePreview } from "@/components/video/phone-preview";
import { SceneArt } from "@/components/video/scene-art";
import { useReducedMotion } from "@/components/video/use-reduced-motion";
import { APP_CORE } from "@/content/he/app-core";
import { whatsappHref } from "@/lib/constants";
import { formatDuration, type MockJob, type MockProject, type MockScene } from "@/lib/mock/projects";
import { MOCK_BUSINESS } from "@/lib/mock/workspace";
import { CancelJobDialog } from "./cancel-job-dialog";
import { AiProgress, Pct } from "./ai-progress";
import { ExportDialog, ShareDialog } from "./share-export";
import { Plural, fill, fillText, plural } from "./plural";
import { statusLabel } from "./status-badge";
import { cn } from "@/lib/utils";

const R = APP_CORE.render;
const SIM_SECONDS = 34; // demo: the whole pipeline in ~half a minute

type SceneState = "pending" | "generating" | "ready" | "degraded";
type StageKey = "script" | "voice" | "captions" | "scenes" | "music" | "render" | "done";
const BOUNDS: Record<Exclude<StageKey, "script">, [number, number]> = {
  voice: [0, 10], captions: [10, 16], scenes: [16, 78], music: [78, 82], render: [82, 97], done: [97, 100],
};

function sceneStates(p: number, n: number, degradedIdx: number): SceneState[] {
  const [a, b] = BOUNDS.scenes;
  return Array.from({ length: n }, (_, i) => {
    const start = a + ((b - a) * i) / n;
    const end = a + ((b - a) * (i + 1)) / n;
    if (p >= end) return i === degradedIdx ? "degraded" : "ready";
    if (p >= start - 4) return "generating";
    return "pending";
  });
}

export function RenderProgress({ project, job, scenes }: { project: MockProject; job: MockJob; scenes: MockScene[] }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const initial = job.status === "succeeded" ? 100 : job.progress;
  const [progress, setProgress] = React.useState(initial);
  const [rawStatus, setStatus] = React.useState<"running" | "done" | "failed" | "canceled">(
    job.status === "succeeded" ? "done" : job.status === "failed" ? "failed" : job.status === "canceled" ? "canceled" : "running",
  );
  const status = rawStatus === "running" && progress >= 100 ? "done" : rawStatus;
  const [elapsed, setElapsed] = React.useState(0);
  const [stopOpen, setStopOpen] = React.useState(false);
  const [allStages, setAllStages] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const degradedIdx = job.id === "j-new" ? -1 : Math.min(1, scenes.length - 1);
  const announcedDegraded = React.useRef(false);

  React.useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 0.5);
      setProgress((p) => Math.min(100, p + 100 / (SIM_SECONDS * 2)));
    }, 500);
    return () => window.clearInterval(id);
  }, [status]);
  const toasted = React.useRef(false);
  React.useEffect(() => {
    if (status === "done" && rawStatus === "running" && !toasted.current) {
      toasted.current = true;
      toast.success(fillText(R.readyToast, { title: project.title }));
    }
  }, [status, rawStatus, project.title]);

  const states = sceneStates(status === "failed" ? job.progress : progress, scenes.length, degradedIdx);
  const readyCount = states.filter((s) => s === "ready" || s === "degraded").length;
  const degradedVisible = states[degradedIdx] === "degraded";
  React.useEffect(() => {
    if (degradedVisible && !announcedDegraded.current && status === "running") {
      announcedDegraded.current = true;
      toast(fillText(R.degraded, { n: degradedIdx + 1 }));
    }
  }, [degradedVisible, degradedIdx, status]);

  const formats = job.formats;
  const renderDone = progress >= 97 ? formats.length : progress >= 90 && formats.length > 1 ? 1 : 0;
  const stageOf = (k: Exclude<StageKey, "script">): "done" | "active" | "pending" | "failed" => {
    const p = status === "failed" ? job.progress : progress;
    const [a, b] = BOUNDS[k];
    if (status === "failed" && p >= a && p < b) return "failed";
    if (p >= b || status === "done") return "done";
    if (p >= a) return status === "canceled" ? "pending" : "active";
    return "pending";
  };
  const STAGES: { key: StageKey; label: React.ReactNode; detail?: string; state: "done" | "active" | "pending" | "failed" }[] = [
    { key: "script", label: R.stages.script, state: "done" },
    { key: "voice", label: R.stages.voice, detail: R.details.voice, state: stageOf("voice") },
    { key: "captions", label: R.stages.captions, detail: R.details.captions, state: stageOf("captions") },
    { key: "scenes", label: fill(R.stages.scenes.replace("{done}/{total}", "{frac}"), { frac: <bdi dir="ltr" className="num">{readyCount}/{scenes.length}</bdi> }), detail: progress < 50 ? R.details.scenesImages : R.details.scenesClips, state: stageOf("scenes") },
    { key: "music", label: R.stages.music, detail: R.details.music, state: stageOf("music") },
    { key: "render", label: fill(R.stages.render.replace("{done}/{total}", "{frac}"), { frac: <bdi dir="ltr" className="num">{renderDone}/{formats.length}</bdi> }), detail: fillText(R.details.render, { aspect: formats[Math.min(renderDone, formats.length - 1)] }), state: stageOf("render") },
    { key: "done", label: R.stages.done, detail: R.details.done, state: stageOf("done") },
  ];

  const minutesLeft = Math.max(0, ((100 - progress) / 100) * 5);
  const etaText = progress >= 82 ? R.almost : minutesLeft < 1 ? R.lessThanMinute : plural(Math.round(minutesLeft), APP_CORE.counts.minutesLeft);
  const lastReady = states.map((s, i) => (s === "ready" || s === "degraded" ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
  const talk = whatsappHref(fillText(R.failure.whatsapp, { jobShortId: job.id.toUpperCase() }));
  const refundable = Math.max(0, job.reservedCredits - job.capturedCredits);

  const title = status === "done" ? R.doneTitle : status === "canceled" ? R.canceledTitle : status === "failed" ? R.failedTitle : R.title;

  return (
    <div className="flex flex-col gap-8 overflow-x-clip pb-10">
      <header className="flex flex-col gap-4">
        <Link href={`/app/projects/${project.id}`} className="inline-flex w-fit items-center gap-1 text-small text-text-2 hover:text-text">
          <DirIcon name="back" className="size-4" />
          <span dir="auto">{project.title}</span>
        </Link>
        <h1 className="text-h1" aria-live="polite">{title}</h1>
        {status !== "failed" && status !== "canceled" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <AiProgress value={progress} className="h-2.5" label={R.title} />
              <Pct value={progress} className="shrink-0 text-h3 font-extrabold" />
            </div>
            <p className="text-small text-text-2" aria-live="off">{status === "done" ? null : etaText}</p>
          </div>
        )}
        {status === "running" && <p className="text-micro font-normal text-muted">{R.demoSpeed}</p>}
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
          <section aria-label={R.stepsLabel} className="rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <ol className="flex flex-col">
              {STAGES.map((s, i) => (
                <li key={s.key} aria-current={s.state === "active" ? "step" : undefined} className={cn("relative flex gap-3 pb-5 last:pb-0", !allStages && s.state !== "active" && s.state !== "failed" && "max-lg:hidden", !allStages && "max-lg:pb-0")}>
                  {i < STAGES.length - 1 && <span aria-hidden className={cn("absolute top-8 bottom-0 inset-s-[13px] w-px", s.state === "done" ? "bg-primary/50" : "bg-border")} />}
                  <span className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full",
                    s.state === "done" && "bg-primary/15 text-primary-text",
                    s.state === "active" && "bg-violet/20 text-violet",
                    s.state === "pending" && "bg-surface-3 text-muted",
                    s.state === "failed" && "bg-danger/15 text-danger",
                  )}>
                    {s.state === "done" ? <Check className="size-4" aria-hidden /> : s.state === "active" ? <span className="size-2 rounded-full bg-violet animate-pulse-dot" aria-hidden /> : s.state === "failed" ? <CircleAlert className="size-4" aria-hidden /> : <Clock className="size-3.5" aria-hidden />}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("font-semibold", s.state === "pending" && "text-muted")}>{s.label}</span>
                    {s.state === "active" && s.detail && <span className="text-micro font-normal text-text-2">{s.key === "scenes" && progress > 60 && job.id !== "j-new" ? R.details.waiting : s.detail}</span>}
                    {s.key === "music" && s.state === "done" && <span className="text-micro font-normal text-muted">{R.details.music}</span>}
                  </div>
                  {s.state === "active" && <bdi className="shrink-0 font-mono text-micro text-muted">{formatDuration(elapsed)}</bdi>}
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => setAllStages((v) => !v)} aria-expanded={allStages} className="mt-3 text-small font-semibold text-link underline underline-offset-2 lg:hidden">
              {allStages ? R.showLess : R.showAll}
            </button>
          </section>

          {status === "running" && (
            <div className="flex flex-col gap-3">
              <p className="text-small text-text-2">{R.canLeave}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="secondary"><Link href="/app">{R.backHome}</Link></Button>
                <button type="button" onClick={() => setStopOpen(true)} className="text-small font-semibold text-danger underline-offset-4 hover:underline">{R.stop}</button>
              </div>
            </div>
          )}
          {status === "canceled" && (
            <div className="flex flex-col gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]" role="status">
              <p className="font-semibold">{R.canceled} {plural(refundable, APP_CORE.counts.refunded)}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary"><Link href={`/app/projects/${project.id}/create/preview`}>{R.backToEdit}</Link></Button>
                <Button onClick={() => { toasted.current = false; setProgress(0); setElapsed(0); setStatus("running"); }}>{R.restart}</Button>
              </div>
            </div>
          )}
        </div>

        <div className="order-first flex min-w-0 flex-col items-center gap-6 lg:order-none lg:col-span-8">
          {status === "failed" ? (
            <div role="alert" className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-rose/[.08] p-6 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-rose)_45%,transparent)]">
              <p className="flex items-center gap-2 text-h3 text-rose"><TriangleAlert className="size-6" aria-hidden />{R.failure.title}</p>
              <p className="text-text-2">{R.failure.body}</p>
              <p className="font-semibold text-success">{plural(job.reservedCredits, APP_CORE.counts.refundedAll)}</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => router.push(`/app/projects/${project.id}/create/preview`)}>{R.failure.retry}</Button>
                {talk && <Button asChild variant="secondary"><a href={talk} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden />{R.failure.talk}</a></Button>}
              </div>
              <p className="font-mono text-micro text-muted" dir="ltr">{fillText(R.failure.code, { code: job.id.toUpperCase() })}</p>
            </div>
          ) : status === "done" ? (
            <>
              <PhonePreview
                scenes={scenes}
                title={project.title}
                aspect={formats[0]}
                width={320}
                captionPreset={project.captionPreset}
                glow
                autoPlay
                endCard={{ headline: project.endCardHeadline, name: MOCK_BUSINESS.name, logoLetter: MOCK_BUSINESS.logoLetter, lines: [fillText(APP_CORE.player.endWhatsapp, { phone: MOCK_BUSINESS.whatsapp })] }}
                aiLabel
                logoBug={MOCK_BUSINESS.logoLetter}
              />
              {degradedIdx >= 0 && <p className="text-small text-text-2"><Plural n={1} forms={APP_CORE.counts.degradedScenes} /></p>}
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => setExportOpen(true)}><Download aria-hidden />{R.done.download}</Button>
                <Button variant="secondary" onClick={() => setShareOpen(true)}><Share2 aria-hidden />{R.done.share}</Button>
                <Button asChild variant="outline"><Link href={`/app/projects/${project.id === "draft-new" ? "p-1001" : project.id}`}>{R.done.project}</Link></Button>
                <Button asChild variant="ghost"><Link href={`/app/projects/${project.id}/editor`}><Pencil aria-hidden />{R.done.edit}</Link></Button>
              </div>
            </>
          ) : (
            <PhoneFrame width={300} glow label={R.title} className="max-lg:w-[62%]">
              {lastReady < 0 ? (
                <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-black px-[9%] text-center">
                  <p className="text-[8cqw] font-black leading-tight text-white">{scenes[0]?.onscreen}</p>
                  <p className="text-[4.4cqw] leading-relaxed text-white/60">{scenes.map((s) => s.vo).join(" ").slice(0, 160)}…</p>
                </div>
              ) : (
                <SceneArt key={lastReady} tone={scenes[lastReady].tone} icon={scenes[lastReady].icon} scale={reduced ? 1 : 1.06}>
                  <p className="absolute inset-x-[8%] top-[28%] text-center text-[7cqw] font-extrabold text-white">{scenes[lastReady].onscreen}</p>
                </SceneArt>
              )}
            </PhoneFrame>
          )}

          {status !== "done" && (
            <ol className="flex w-full max-w-2xl gap-2 overflow-x-auto pb-1" aria-label={APP_CORE.project.scenesLabel}>
              {scenes.map((s, i) => {
                const st = status === "failed" && states[i] !== "ready" ? "failed" : states[i];
                return (
                  <li key={s.id} className="w-[84px] shrink-0" aria-label={fillText(R.sceneLabel, { n: i + 1, status: statusLabel({ kind: "scene", status: st === "failed" ? "failed" : st }) })}>
                    <div className={cn("relative aspect-reel overflow-hidden rounded-sm bg-surface-2", st === "failed" && "ring-2 ring-danger", st === "degraded" && "ring-2 ring-primary/70")}>
                      {(st === "ready" || st === "degraded") && <SceneArt tone={s.tone} icon={s.icon} />}
                      {st === "generating" && (
                        <div className="absolute inset-0 shimmer-ai">
                          <SceneArt tone={s.tone} icon={s.icon} className="opacity-30 blur-[2px]" />
                          <span className="absolute inset-x-0 bottom-1 text-center text-[11px] text-white">{fillText(R.approxSeconds, { n: Math.max(4, 12 - i) })}</span>
                        </div>
                      )}
                      {st === "degraded" && <span className="absolute inset-x-1 bottom-1 rounded-[4px] bg-black/70 px-1 text-center text-[10px] text-primary-text">{APP_CORE.status.scene.degraded}</span>}
                    </div>
                    <p className="mt-1 text-center font-mono text-[11px] text-muted"><bdi>{i + 1}</bdi></p>
                  </li>
                );
              })}
            </ol>
          )}
          {degradedVisible && status === "running" && <p className="text-small text-text-2">{fillText(R.degraded, { n: degradedIdx + 1 })}</p>}
        </div>
      </div>

      <CancelJobDialog open={stopOpen} onOpenChange={setStopOpen} captured={job.capturedCredits} onConfirm={() => setStatus("canceled")} />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} projectId={project.id} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} formats={formats} />
    </div>
  );
}
