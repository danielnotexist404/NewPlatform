"use client";
import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, CloudCheck, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DirIcon } from "@/components/a11y/dir-icon";
import { plural, fillText } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { WIZARD_STEPS, type WizardStep } from "@/lib/mock/projects";
import { MOCK_CREDITS } from "@/lib/mock/workspace";
import { costOf, firstInvalid, hasPriceClaim, hookFactsOpen, reachable, scriptFactsOpen, stepValid, useWizard } from "./wizard-state";
import { LivePreview } from "./live-preview";
import { ConfirmGenerateDialog } from "./confirm-generate-dialog";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard;
const credits = APP_CORE.counts.credits;

function isStep(s: string | undefined): s is WizardStep {
  return !!s && (WIZARD_STEPS as string[]).includes(s);
}

export function useCurrentStep(): WizardStep {
  const params = useParams<{ step?: string }>();
  return isStep(params.step) ? params.step : "business";
}

/** Next-button label and cost per step (Part 03 §6.4–§6.9). */
function nextConfig(step: WizardStep, d: ReturnType<typeof useWizard>["data"]): { label: string; cost?: number } {
  switch (step) {
    case "hook":
      return d.scriptState === "ready" && d.scriptHookKey === d.hooks[0]?.key ? { label: W.next } : { label: W.hook.continueCost, cost: 2 };
    case "script": return { label: W.script.continue };
    case "style": return { label: W.style.continue };
    case "voice": return { label: W.voice.continue };
    case "music": return d.storyboard === "ready" ? { label: W.music.continue } : { label: W.music.continue, cost: 1 };
    case "preview": return { label: W.preview.generate, cost: costOf(d).credits };
    default: return { label: W.next };
  }
}

export function WizardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const step = useCurrentStep();
  const { data, set, saveState } = useWizard();
  const idx = WIZARD_STEPS.indexOf(step);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const go = React.useCallback((s: WizardStep) => router.push(`/app/projects/${data.projectId}/create/${s}`), [router, data.projectId]);

  // guard: no skipping past the first invalid step; focus the step title on every change
  React.useEffect(() => {
    if (!reachable(step, data)) {
      const fi = firstInvalid(data);
      if (fi) {
        toast(fillText(W.stepBlocked, { stepLabel: W.steps[fi] }));
        router.replace(`/app/projects/${data.projectId}/create/${fi}`);
        return;
      }
    }
    const el = document.getElementById("wizard-step-title");
    el?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const valid = stepValid(step, data);
  const cfg = nextConfig(step, data);

  const onNext = () => {
    if (!valid) return;
    if (step === "hook" && cfg.cost) set((d) => ({ scriptState: "writing", scriptHookKey: d.hooks[0]?.key ?? null }));
    if (step === "music" && data.storyboard !== "ready") set({ storyboard: "building" });
    if (step === "preview") { setConfirmOpen(true); return; }
    const next = WIZARD_STEPS[idx + 1];
    if (next) go(next);
  };

  const openFacts = scriptFactsOpen(data);
  const blockedReason =
    !valid && (step === "preview" || step === "script") && data.scriptState === "ready"
      ? openFacts > 0
        ? openFacts === 1 ? W.preview.missingFact : fillText(W.preview.missingFacts, { n: openFacts })
        : hasPriceClaim(data) && !data.priceAttested ? W.preview.needAttest : null
      : !valid && step === "hook" && hookFactsOpen(data) > 0 ? W.facts.title : null;

  return (
    <div className="flex min-h-[calc(100dvh-56px-48px)] flex-col">
      {/* header: title + save, then the stepper */}
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <label htmlFor="wizard-title" className="sr-only">{W.titleLabel}</label>
          <input
            id="wizard-title"
            dir="auto"
            value={data.title}
            maxLength={80}
            onChange={(e) => set({ title: e.target.value })}
            className="min-w-0 flex-1 rounded-sm bg-transparent px-2 py-1 -ms-2 text-body-lg font-bold text-text hover:bg-surface-2 focus-visible:bg-surface-2"
          />
          <span className="hidden items-center gap-1.5 text-micro font-normal text-muted sm:inline-flex" aria-live="polite">
            {saveState === "saving" ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <CloudCheck className="size-3.5" aria-hidden />}
            {saveState === "saving" ? W.saving : W.saved}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              toast.success(W.savedToast);
              router.push("/app");
            }}
          >
            {W.saveExit}
          </Button>
        </div>

        {/* desktop stepper */}
        <nav aria-label="שלבי האשף" className="hidden lg:block">
          <ol className="flex items-center">
            {WIZARD_STEPS.map((s, i) => {
              const done = i < idx && stepValid(s, data);
              const current = s === step;
              const can = reachable(s, data);
              const inner = (
                <>
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-micro transition-colors",
                      current ? "bg-primary text-on-primary glow-primary" : done ? "bg-primary/15 text-primary-text" : "bg-surface-2 text-muted shadow-[inset_0_0_0_1px_var(--color-border)]",
                    )}
                  >
                    {done ? <Check className="size-3.5" aria-hidden /> : <bdi className="num">{i + 1}</bdi>}
                  </span>
                  <span className={cn("whitespace-nowrap text-small font-semibold", current ? "text-text" : can ? "text-text-2" : "text-muted")}>{W.steps[s]}</span>
                </>
              );
              return (
                <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
                  {can && !current ? (
                    <Link href={`/app/projects/${data.projectId}/create/${s}`} className="flex items-center gap-2 rounded-full pe-1 hover:[&>span:last-child]:text-text">
                      {inner}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2" aria-current={current ? "step" : undefined} aria-disabled={!can || undefined}>
                      {inner}
                    </span>
                  )}
                  {i < WIZARD_STEPS.length - 1 && <span aria-hidden className={cn("mx-1 h-px flex-1", i < idx ? "bg-primary/50" : "bg-border")} />}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* mobile compact stepper */}
        <div className="flex flex-col gap-2 lg:hidden">
          <p className="text-small font-semibold text-text-2" aria-current="step">
            {fillText(W.compact, { n: idx + 1, label: W.steps[step] })}
          </p>
          <Progress value={((idx + 1) / WIZARD_STEPS.length) * 100} aria-label={fillText(W.compact, { n: idx + 1, label: W.steps[step] })} />
        </div>
      </div>

      <div className="grid flex-1 gap-8 py-8 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">{children}</div>
        <aside className="hidden lg:col-span-5 lg:block" aria-label={W.previewTitle}>
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <LivePreview step={step} />
          </div>
        </aside>
      </div>

      {/* footer */}
      <div className="sticky bottom-0 z-[var(--z-sticky)] -mx-4 mt-auto border-t border-border glass px-4 py-3 md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {idx > 0 ? (
            <Button variant="ghost" onClick={() => go(WIZARD_STEPS[idx - 1])}>
              <DirIcon name="back" />
              {W.back}
            </Button>
          ) : (
            <span />
          )}
          <span id="wizard-blocked" className="order-first w-full text-micro font-normal text-text-2 empty:hidden md:order-none md:me-auto md:w-auto">{blockedReason}</span>
          <Button
            size="lg"
            onClick={onNext}
            disabled={!valid}
            aria-describedby={!valid && blockedReason ? "wizard-blocked" : undefined}
            className="ms-auto min-w-0 max-md:flex-1 max-md:px-4"
          >
            {cfg.label}
            {cfg.cost != null && <span className="font-normal opacity-80">· {plural(cfg.cost, credits)}</span>}
            {step !== "preview" && <DirIcon name="forward" />}
          </Button>
        </div>
      </div>

      {/* mobile floating mini-phone → bottom sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={W.previewOpen}
            className="fixed bottom-24 inset-e-4 z-[var(--z-sticky)] flex h-20 w-12 items-center justify-center rounded-[14px] border border-border-strong/50 bg-surface-3 text-primary-text elev-3 lg:hidden"
          >
            <Smartphone className="size-5" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" title={W.previewTitle}>
          <LivePreview step={step} compact />
        </SheetContent>
      </Sheet>

      <ConfirmGenerateDialog open={confirmOpen} onOpenChange={setConfirmOpen} balance={MOCK_CREDITS.balance} />
    </div>
  );
}
