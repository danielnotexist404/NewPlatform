"use client";
import * as React from "react";
import Link from "next/link";
import { Camera, Check, CircleAlert, Clock, Lightbulb, RefreshCw, Scissors, Square, TriangleAlert, Users, Zap } from "lucide-react";
import { CameraGhostGuide } from "./camera-ghost-guide";
import { UploadDropzone, type PickedFile } from "./upload-dropzone";
import { AutocutProgress } from "./autocut-progress";
import { useTipsSeen } from "./use-tips-seen";
import { TrendTile } from "@/components/trends/trend-tile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num } from "@/components/a11y/num";
import { GUIDED } from "@/content/he/trends-app";
import { getTrend, onscreenFor, type GuidedShot } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

type ShotStatus = "todo" | "recording" | "done";
interface ShotState { status: ShotStatus; source?: "camera" | "file"; takes: number; seconds?: number; fileName?: string }
type Phase = "shoot" | "editing" | "done";

export function ShootKit({ trendSlug, nicheSlug, nicheIcon, continueHref }: { trendSlug: string; nicheSlug: string; nicheIcon?: string; continueHref: string }) {
  const trend = getTrend(trendSlug)!;
  const shots = trend.shotList ?? [];
  const [active, setActive] = React.useState(0);
  const [state, setState] = React.useState<Record<string, ShotState>>({});
  const [elapsed, setElapsed] = React.useState(0);
  const [consent, setConsent] = React.useState(false);
  const [consentError, setConsentError] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("shoot");
  const [stage, setStage] = React.useState(0);
  const [tipsSeen, markTipsSeen] = useTipsSeen();
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  const shot = shots[active];
  const st = state[shot?.key] ?? { status: "todo", takes: 0 };
  const recording = st.status === "recording";
  const doneCount = shots.filter((s) => state[s.key]?.status === "done").length;
  const allDone = doneCount === shots.length;
  const needsConsent = shots.some((s) => s.peopleOnCamera);

  // Recording timer (mock: counts seconds, stops at maxSec).
  React.useEffect(() => {
    if (!recording || !shot) return;
    let sec = 0;
    const t = setInterval(() => {
      sec = Math.min(sec + 1, shot.maxSec);
      setElapsed(sec);
      if (sec >= shot.maxSec) {
        clearInterval(t);
        setState((s) => ({ ...s, [shot.key]: { status: "done", source: "camera", takes: (s[shot.key]?.takes ?? 0) + 1, seconds: sec } }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [recording, shot]);

  // Autocut stages (mock).
  React.useEffect(() => {
    if (phase !== "editing") return;
    let n = 0;
    let done: ReturnType<typeof setTimeout> | undefined;
    const t = setInterval(() => {
      n += 1;
      setStage(n);
      if (n >= GUIDED.autocut.stages.length) {
        clearInterval(t);
        done = setTimeout(() => setPhase("done"), 700);
      }
    }, 1100);
    return () => { clearInterval(t); if (done) clearTimeout(done); };
  }, [phase]);

  function go(i: number) {
    if (recording) return;
    setActive(i);
    setElapsed(0);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function startRec() {
    setElapsed(0);
    setState((s) => ({ ...s, [shot.key]: { ...st, status: "recording" } }));
  }

  function stopRec() {
    setState((s) => ({ ...s, [shot.key]: { status: "done", source: "camera", takes: st.takes + 1, seconds: elapsed } }));
  }

  function onUploaded(f: PickedFile) {
    setState((s) => ({ ...s, [shot.key]: { status: "done", source: "file", takes: (s[shot.key]?.takes ?? 0) + 1, fileName: f.name } }));
  }

  function nextShot() {
    const next = shots.findIndex((s, i) => i > active && state[s.key]?.status !== "done");
    const any = next === -1 ? shots.findIndex((s) => state[s.key]?.status !== "done") : next;
    if (any !== -1) go(any);
  }

  function startAutocut() {
    if (needsConsent && !consent) {
      setConsentError(true);
      return;
    }
    setStage(0);
    setPhase("editing");
  }

  function restart() {
    setState({});
    setActive(0);
    setElapsed(0);
    setPhase("shoot");
    setStage(0);
  }

  if (!shot) return <p>{GUIDED.notFound}</p>;

  if (phase === "done") {
    return (
      <section aria-labelledby="autocut-done" className="grid gap-8 rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:grid-cols-[260px_minmax(0,1fr)] md:p-8">
        <div className="mx-auto w-full max-w-[260px]">
          <TrendTile art={trend.tile.art} tone={trend.tile.tone} text={onscreenFor(trend, nicheSlug)} nicheIcon={nicheIcon} durationSec={trend.durationSec} label="תצוגה מקדימה" size="lg" ariaLabel={GUIDED.autocut.done} className="rounded-lg elev-3" />
        </div>
        <div className="flex flex-col gap-5">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-micro text-success">
            <Check aria-hidden className="size-3.5" />
            {GUIDED.autocut.doneBadge}
          </p>
          <h2 id="autocut-done" tabIndex={-1} className="text-h2">{GUIDED.autocut.done}</h2>
          <p className="text-body-lg text-text-2">{GUIDED.autocut.doneSub}</p>
          <ul className="flex flex-col gap-2">
            {GUIDED.autocut.warnings.map((w) => (
              <li key={w} className="flex items-start gap-2 rounded-sm bg-surface-2 p-3 text-small">
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-text" />
                {w}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href={continueHref} className={buttonVariants({ size: "lg" })}>
              {GUIDED.autocut.continue}
              <DirIcon name="forward" />
            </Link>
            <Button variant="secondary" size="lg" onClick={restart}>
              <RefreshCw aria-hidden />
              {GUIDED.autocut.restart}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* progress + stepper */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-small">
          <span className="font-semibold">{GUIDED.stepsLabel}</span>
          <span className="text-text-2">{GUIDED.progress(doneCount, shots.length)}</span>
        </div>
        <Progress value={(doneCount / shots.length) * 100} aria-label={GUIDED.progress(doneCount, shots.length)} />
        <ol className="grid grid-cols-3 gap-2">
          {shots.map((s, i) => {
            const status = state[s.key]?.status ?? "todo";
            const isActive = i === active;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  disabled={recording}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-1 rounded-md p-2.5 text-start shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:bg-surface-2 disabled:cursor-not-allowed md:flex-row md:items-center md:gap-3 md:p-3",
                    isActive && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
                  )}
                >
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold", status === "done" ? "bg-success text-black" : isActive ? "bg-primary text-on-primary" : "bg-surface-3 text-text-2")}>
                    {status === "done" ? <Check aria-hidden className="size-4" /> : <Num value={i + 1} />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="line-clamp-2 text-small leading-snug font-semibold md:line-clamp-1">{s.titleHe}</span>
                    <span className="text-micro font-normal text-muted">{GUIDED.states[status === "done" && state[s.key]?.source === "file" ? "uploaded" : status]}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {!tipsSeen && (
        <div className="flex flex-col gap-3 rounded-md bg-primary/10 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] md:flex-row md:items-center">
          <Lightbulb aria-hidden className="size-5 shrink-0 text-primary-text" />
          <div className="flex-1">
            <p className="font-semibold">{GUIDED.firstTips.title}</p>
            <ul className="mt-1 flex flex-col gap-x-5 gap-y-0.5 text-small text-text-2 md:flex-row">
              {GUIDED.firstTips.items.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <Button variant="secondary" size="sm" onClick={markTipsSeen}>{GUIDED.firstTips.dismiss}</Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-x-10">
        {/* instruction */}
        <section aria-labelledby="shot-title" className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
          <p className="text-micro text-primary-text">{GUIDED.shot(active + 1)} · {GUIDED.framing[shot.framing]}</p>
          <h2 id="shot-title" ref={headingRef} tabIndex={-1} className="text-h2 outline-none">{shot.titleHe}</h2>
          <p className="text-body-lg">{shot.instructionHe}</p>
          <div className="flex flex-wrap gap-2 text-small">
            <Chip icon={<Clock aria-hidden className="size-4" />}>{GUIDED.length(shot.minSec, shot.maxSec)}</Chip>
            <Chip icon={<Square aria-hidden className="size-4" />}>{GUIDED.ghost[shot.ghost]}</Chip>
            {shot.peopleOnCamera && <Chip icon={<Users aria-hidden className="size-4" />}>{GUIDED.peopleNote}</Chip>}
          </div>
        </section>

        {/* camera */}
        <section aria-label={GUIDED.camera.label} className="flex flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="mx-auto w-full max-w-[300px] lg:max-w-none">
            <CameraGhostGuide
              ghost={shot.ghost}
              hint={GUIDED.ghost[shot.ghost]}
              shotLabel={GUIDED.shot(active + 1)}
              framingLabel={GUIDED.framing[shot.framing]}
              recording={recording}
              elapsed={recording ? elapsed : st.seconds ?? 0}
              captured={st.status === "done"}
            />
          </div>
          <CaptureControls
            shot={shot}
            st={st}
            elapsed={elapsed}
            onStart={startRec}
            onStop={stopRec}
          />
          <p className="text-center text-micro text-muted">{GUIDED.camera.permissionNote}</p>
        </section>

        {/* tips + upload */}
        <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-2">
          <div className="rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <p className="text-micro text-muted">{GUIDED.tipsTitle}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {shot.tipsHe.map((t) => (
                <li key={t} className="flex gap-2 text-small">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-small font-semibold">{GUIDED.upload.title}</p>
            <UploadDropzone key={shot.key} onUploaded={onUploaded} disabled={recording} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {active > 0 && (
              <Button variant="ghost" onClick={() => go(active - 1)} disabled={recording}>
                <DirIcon name="prev" />
                {GUIDED.prev}
              </Button>
            )}
            {st.status === "done" && !allDone && (
              <Button onClick={nextShot}>
                {GUIDED.next}
                <DirIcon name="next" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* autocut */}
      <section aria-labelledby="autocut-title" className="flex flex-col gap-5 rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
          <div>
            <h2 id="autocut-title" className="flex items-center gap-2 text-h3">
              <Scissors aria-hidden className="size-5 text-violet" />
              {GUIDED.autocut.title}
            </h2>
            <p className="mt-1 max-w-2xl text-small text-text-2">{GUIDED.autocut.sub}</p>
          </div>
          {phase === "shoot" && (
            <p className="flex shrink-0 items-center gap-1.5 text-small text-text-2">
              <Zap aria-hidden className="size-4 text-primary-text" />
              {GUIDED.autocut.cost(shots.length)}
            </p>
          )}
        </div>

        {phase === "editing" ? (
          <AutocutProgress stage={stage} />
        ) : (
          <>
            {needsConsent && (
              <div className="flex flex-col gap-1">
                <label className="flex cursor-pointer items-start gap-3 text-small">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setConsentError(false); }}
                    aria-invalid={consentError || undefined}
                    aria-describedby="consent-help"
                    className="mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span>{GUIDED.consent.label}</span>
                </label>
                <p id="consent-help" className={cn("ps-8 text-micro font-normal", consentError ? "text-danger" : "text-muted")} role={consentError ? "alert" : undefined}>
                  {GUIDED.consent.help}
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={startAutocut} disabled={!allDone}>
                <Scissors aria-hidden />
                {GUIDED.autocut.cta} · {GUIDED.autocut.cost(shots.length)}
              </Button>
              {!allDone && (
                <span className="flex items-center gap-1.5 text-small text-muted">
                  <CircleAlert aria-hidden className="size-4" />
                  {GUIDED.autocut.missing(shots.length - doneCount)}
                </span>
              )}
            </div>
            <p className="text-micro font-normal text-muted">{GUIDED.autocut.costNote}</p>
          </>
        )}
      </section>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      {icon}
      {children}
    </span>
  );
}

function CaptureControls({ shot, st, elapsed, onStart, onStop }: {
  shot: GuidedShot; st: ShotState; elapsed: number; onStart: () => void; onStop: () => void;
}) {
  const recording = st.status === "recording";
  const remaining = Math.max(0, shot.minSec - elapsed);
  if (recording) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button size="lg" variant="destructive" onClick={onStop} disabled={remaining > 0} className="w-full max-w-[300px]">
          <Square aria-hidden className="fill-current" />
          {GUIDED.camera.stop}
        </Button>
        <p className="text-micro font-normal text-muted" aria-live="polite">
          {remaining > 0 ? GUIDED.camera.tooShort(shot.minSec) : GUIDED.camera.rec}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <Button size="lg" onClick={onStart} className="w-full max-w-[300px]">
        {st.status === "done" ? <RefreshCw aria-hidden /> : <Camera aria-hidden />}
        {st.status === "done" ? GUIDED.camera.retake : GUIDED.camera.start}
      </Button>
      {st.status === "done" && (
        <p className="flex items-center gap-1.5 text-small text-success" aria-live="polite">
          <Check aria-hidden className="size-4" />
          {GUIDED.camera.take(st.takes)}
          {st.fileName ? <bdi dir="ltr" className="max-w-40 truncate text-muted">· {st.fileName}</bdi> : st.seconds ? <span className="text-muted">· <Num value={st.seconds} /> שנ׳</span> : null}
        </p>
      )}
    </div>
  );
}
