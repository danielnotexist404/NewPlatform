"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Check, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { builderDraft, SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { builder as B, detail as DT, GOAL_COPY, sample } from "@/content/he/campaigns-app";
import { VideoThumb } from "../video-thumb";
import { SampleNote } from "../page-header";
import { CampaignStatusTimeline } from "../status-timeline";
import { useCalmMotion } from "../motion";
import { fill, fmt } from "../text";
import { AreaStep, BudgetStep, GoalStep } from "./steps";
import { areaSummary, ReviewStep, type Phase } from "./review-step";
import { initialDraft, type DraftState } from "./types";
import { cn } from "@/lib/utils";

export function CampaignBuilder() {
  const [d, setD] = React.useState<DraftState>(initialDraft);
  const [step, setStep] = React.useState(0);
  const [maxStep, setMaxStep] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("draft");
  const [confirm, setConfirm] = React.useState(false);
  const [confirmHint, setConfirmHint] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const calm = useCalmMotion();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastStep = React.useRef(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const patch = React.useCallback((p: Partial<DraftState>) => {
    setD((s) => ({ ...s, ...p }));
    // any edit after preparation sends the draft back to "הכנה לפרסום"
    setPhase((ph) => (ph === "ready" ? "draft" : ph));
  }, []);

  React.useEffect(() => {
    if (lastStep.current === step && !done) return;
    lastStep.current = step;
    const h = panelRef.current?.querySelector<HTMLElement>("[data-step-heading]");
    h?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  }, [step, done, calm]);

  const canNext =
    step === 1 ? !(d.areaMode === "cities" && d.cities.length === 0) && !d.ageWarn : step === 2 ? d.budget >= builderDraft.budgetFloor : true;

  function go(n: number) {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
  }

  function prepare() {
    setPhase("preparing");
    timers.current.push(
      window.setTimeout(() => {
        setPhase("ready");
        toast.success(B.review.officialReady);
      }, 1600),
    );
  }

  function publish() {
    if (!confirm) {
      setConfirmHint(true);
      return;
    }
    setPhase("publishing");
    timers.current.push(window.setTimeout(() => setDone(true), 1300));
  }

  if (done) return <BuilderSuccess />;

  const primary =
    step < 3 ? (
      <Button size="lg" onClick={() => go(step + 1)} disabled={!canNext} className="flex-1 lg:flex-none lg:min-w-40">
        {B.next}
        <DirIcon name="forward" />
      </Button>
    ) : phase === "draft" || phase === "preparing" ? (
      <Button size="lg" onClick={prepare} loading={phase === "preparing"} className="flex-1 lg:flex-none lg:min-w-48">
        {phase === "preparing" ? B.review.preparing : B.review.prepare}
      </Button>
    ) : (
      <Button size="lg" onClick={publish} loading={phase === "publishing"} aria-disabled={!confirm || undefined} className="flex-1 glow-primary lg:flex-none lg:min-w-48">
        {phase === "publishing" ? B.review.publishing : B.review.publish}
      </Button>
    );

  const nav = (
    <>
      {step > 0 && (
        <Button size="lg" variant="ghost" onClick={() => go(step - 1)}>
          <DirIcon name="back" />
          {B.back}
        </Button>
      )}
      {primary}
    </>
  );

  return (
    <div className="flex flex-col gap-6 pb-28 lg:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-micro text-primary-text">{fmt(B.stepOf, { n: step + 1 })}</p>
          <h1 className="text-h3">{B.title}</h1>
        </div>
        <Button asChild variant="ghost" size="icon" aria-label={B.close}>
          <Link href="/app/campaigns">
            <X aria-hidden />
          </Link>
        </Button>
      </div>

      <nav aria-label={B.stepsLabel}>
        <ol className="grid grid-cols-4 gap-2">
          {B.steps.map((label, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            const reachable = i <= maxStep && i !== step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => go(i)}
                  aria-current={state === "current" ? "step" : undefined}
                  className="group flex w-full flex-col gap-2 text-start disabled:cursor-default"
                >
                  <span className={cn("h-1 w-full rounded-full transition-colors", state === "todo" ? "bg-surface-3" : "bg-primary")} />
                  <span className={cn("flex items-center gap-1.5 text-micro", state === "todo" ? "text-muted" : "text-text", reachable && "group-hover:text-primary-text")}>
                    {state === "done" && <Check className="size-3.5 text-success" aria-hidden strokeWidth={3} />}
                    <span className="truncate">{label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div ref={panelRef} className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={calm ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={calm ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: calm ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <GoalStep d={d} patch={patch} />}
              {step === 1 && <AreaStep d={d} patch={patch} />}
              {step === 2 && <BudgetStep d={d} patch={patch} />}
              {step === 3 && <ReviewStep d={d} patch={patch} phase={phase} confirm={confirm} setConfirm={(v) => { setConfirm(v); if (v) setConfirmHint(false); }} showConfirmHint={confirmHint} />}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 hidden items-center justify-between gap-3 border-t border-border pt-6 lg:flex">{nav}</div>
        </div>

        <aside className="sticky top-[calc(var(--header-h)+24px)] hidden flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:flex" aria-label={B.summaryLabel}>
          <div className="flex items-center gap-3">
            <div className="relative h-24 w-[86px] shrink-0">
              {builderDraft.variants.map((v, i) => (
                <div key={v.key} className="absolute top-0" style={{ insetInlineStart: i * 16, transform: `rotate(${(i - 1) * 5}deg)`, zIndex: 3 - i }}>
                  <VideoThumb size="xs" tone={v.tone} showPlay={false} className="w-[54px] rounded-sm shadow-[0_0_0_2px_var(--color-surface-1)]" />
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-micro font-normal text-muted">{B.video.label}</p>
              <p className="font-bold leading-snug">{builderDraft.projectTitle}</p>
              <p className="text-micro font-normal text-text-2">{B.video.hooks} · {SAMPLE_BUSINESS.name}</p>
            </div>
          </div>
          <dl className="flex flex-col gap-3 border-t border-border pt-4 text-small">
            <AsideRow label={B.review.summary.goal} value={GOAL_COPY[d.goal].label} active={step === 0} />
            <AsideRow label={B.review.summary.area} value={areaSummary(d)} active={step === 1} />
            <AsideRow label={B.review.summary.age} value={<bdi className="num">{d.ageMin}–{d.ageMax === 65 ? "65+" : d.ageMax}</bdi>} active={step === 1} />
            <AsideRow label={B.review.summary.budget} value={<><Price ils={d.budget} /> {B.budget.perDay}</>} active={step === 2} />
          </dl>
          <div className="rounded-sm bg-surface-2 p-3">
            <p className="text-body-lg font-bold">{fill(B.budget.monthly, { amount: <Price ils={d.budget * 30} /> })}</p>
            <p className="mt-1 flex items-start gap-1.5 text-micro font-normal text-text-2">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
              {B.budget.money}
            </p>
          </div>
          <p className="text-micro font-normal text-muted">{B.review.paused}</p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] flex items-center gap-2 border-t border-border glass px-4 py-3 lg:hidden">{nav}</div>
    </div>
  );
}

function AsideRow({ label, value, active }: { label: string; value: React.ReactNode; active?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("shrink-0 font-normal", active ? "text-primary-text" : "text-muted")}>{label}</dt>
      <dd className="min-w-0 truncate text-end font-semibold text-text">{value}</dd>
    </div>
  );
}

function BuilderSuccess() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-lg bg-surface-1 p-8 text-center shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-success/15 text-success glow-ai">
          <BadgeCheck className="size-10" aria-hidden />
        </span>
        <div className="relative flex flex-col gap-2">
          <h1 className="text-h2 outline-none" tabIndex={-1} data-step-heading>{B.success.title}</h1>
          <p className="text-body-lg text-text-2">{B.success.body}</p>
        </div>
        <CampaignStatusTimeline
          className="relative w-full max-w-lg text-start"
          steps={[
            { label: DT.timeline.created, state: "done" },
            { label: DT.timeline.submitted, state: "current" },
            { label: DT.timeline.approved, state: "todo" },
            { label: DT.timeline.active, state: "todo" },
          ]}
        />
        <div className="relative flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/app/campaigns/cmp-price-reveal">{B.success.toCampaign}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/app/campaigns">{B.success.toAll}</Link>
          </Button>
        </div>
      </div>
      <SampleNote text={`${B.success.sampleNote} ${sample.campaign}`} />
    </div>
  );
}
