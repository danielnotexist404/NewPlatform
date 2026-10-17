"use client";
import * as React from "react";
import { BadgeCheck, Check, Link2, Lock, Megaphone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { connect as C } from "@/content/he/campaigns-app";
import { SAMPLE_BUSINESS, metaConnection } from "@/lib/mock/campaigns";
import { MetaConnectChecklist, type CheckState } from "./meta-connect-checklist";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;
const CHECK_KEYS = C.checklist.map((c) => c.key);

/** Mocked Facebook Login for Business flow (spec §C.3): consent → assets → preflight → done. */
export function MetaConnectFlow({ open, onOpenChange, onConnected }: { open: boolean; onOpenChange: (o: boolean) => void; onConnected: () => void }) {
  const [step, setStep] = React.useState<Step>(0);
  const [loading, setLoading] = React.useState(false);
  const [checks, setChecks] = React.useState<Partial<Record<(typeof CHECK_KEYS)[number], CheckState>>>({});
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function reset() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStep(0);
    setLoading(false);
    setChecks({});
  }

  function consent() {
    setLoading(true);
    timers.current.push(window.setTimeout(() => { setLoading(false); setStep(1); }, 1100));
  }

  function runChecks() {
    setStep(2);
    CHECK_KEYS.forEach((k, i) => {
      timers.current.push(window.setTimeout(() => setChecks((s) => ({ ...s, [k]: "checking" })), i * 380));
      timers.current.push(window.setTimeout(() => setChecks((s) => ({ ...s, [k]: "ok" })), i * 380 + 340));
    });
    timers.current.push(window.setTimeout(() => setStep(3), CHECK_KEYS.length * 380 + 500));
  }

  function finish() {
    onConnected();
    onOpenChange(false);
    toast.success(C.flow.toast);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent size="lg" closeLabel="סגירה">
        <DialogTitle>{C.flow.title}</DialogTitle>
        <DialogDescription className="sr-only">{C.flow.steps.join(" · ")}</DialogDescription>
        <ol className="mt-4 flex items-center gap-2" aria-label="שלבים">
          {C.flow.steps.map((s, i) => {
            const idx = Math.min(step, 2);
            const done = step === 3 || i < idx;
            const current = i === idx && step !== 3;
            return (
              <li key={s} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
                <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-micro", done ? "bg-success text-bg" : current ? "bg-primary text-on-primary" : "bg-surface-3 text-text-2")}>
                  {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <bdi className="num">{i + 1}</bdi>}
                </span>
                <span className={cn("truncate text-micro", current ? "text-text" : "text-text-2")}>{s}</span>
                {i < 2 && <span aria-hidden className="h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 min-h-64">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3 rounded-md bg-surface-2 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet"><Link2 className="size-5" aria-hidden /></span>
                <div>
                  <p className="font-bold">{C.flow.step1Title}</p>
                  <p className="text-small text-text-2">{C.flow.step1Body}</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                {C.permissions.map((p) => (
                  <li key={p.title} className="flex items-start gap-2 text-small">
                    <Lock className="mt-1 size-3.5 shrink-0 text-muted" aria-hidden />
                    <span><span className="font-semibold">{p.title}:</span> <span className="text-text-2">{p.why}</span></span>
                  </li>
                ))}
              </ul>
              <Button size="lg" onClick={consent} loading={loading} className="self-start">
                {loading ? C.flow.step1Loading : C.flow.step1Cta}
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-bold">{C.flow.step2Title}</p>
                <p className="text-small text-text-2">{C.flow.step2Body}</p>
              </div>
              {[
                { label: C.flow.page, value: metaConnection.assets.page.name, meta: metaConnection.assets.page.category },
                { label: C.flow.ig, value: `@${metaConnection.assets.instagram.username}`, meta: "חשבון מקצועי", ltr: true },
                { label: C.flow.ad, value: metaConnection.assets.adAccount.name, meta: "בשקלים" },
              ].map((a) => (
                <fieldset key={a.label} className="flex flex-col gap-2">
                  <legend className="mb-2 text-small font-semibold">{a.label}</legend>
                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-primary bg-primary/8 px-3 py-2.5">
                    <input type="radio" name={a.label} defaultChecked className="size-4 accent-[var(--color-primary)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{a.ltr ? <bdi dir="ltr">{a.value}</bdi> : a.value}</span>
                      <span className="block text-micro font-normal text-muted">{a.meta}</span>
                    </span>
                  </label>
                </fieldset>
              ))}
              <div className="flex gap-2">
                <Button onClick={runChecks}>{C.flow.next}</Button>
                <Button variant="ghost" onClick={() => setStep(0)}>{C.flow.back}</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4" aria-live="polite">
              <div>
                <p className="font-bold">{C.flow.step3Title}</p>
                <p className="text-small text-text-2">{C.flow.step3Body}</p>
              </div>
              <MetaConnectChecklist states={checks} showFixes={false} />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-6 text-center" aria-live="polite">
              <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success glow-ai">
                <BadgeCheck className="size-8" aria-hidden />
              </span>
              <div>
                <p className="text-h3">{C.flow.doneTitle}</p>
                <p className="mt-1 text-text-2">{C.flow.doneBody}</p>
              </div>
              <Button size="lg" onClick={finish}>{C.flow.finish}</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** ConnectMetaCard — the empty state of /app/campaigns before Facebook & Instagram are connected. */
export function ConnectMetaCard({ onConnected }: { onConnected: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <section aria-labelledby="connect-title" className="relative overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-70" />
      <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-micro text-primary-text">
              <Megaphone className="size-3.5" aria-hidden />
              {C.eyebrow}
            </span>
            <h2 id="connect-title" className="text-h1">{C.title}</h2>
            <p className="max-w-xl text-body-lg text-text-2">{C.body}</p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {C.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-small">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text"><Check className="size-3" strokeWidth={3} aria-hidden /></span>
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xl" onClick={() => setOpen(true)} className="glow-primary">
              {C.cta}
            </Button>
            <span className="text-small text-muted">{SAMPLE_BUSINESS.name} · דוגמה</span>
          </div>
          <ul className="flex flex-col gap-1.5 border-t border-border pt-4">
            {C.trust.map((t) => (
              <li key={t} className="flex items-center gap-2 text-small text-text-2">
                <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-md bg-bg/60 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
          <h3 className="text-body font-bold">{C.checklistTitle}</h3>
          <MetaConnectChecklist />
          <Accordion type="single" collapsible>
            <AccordionItem value="perm" className="border-b-0">
              <AccordionTrigger className="py-2 text-small">{C.permissionsTitle}</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 text-small">
                  {C.permissions.map((p) => (
                    <li key={p.title}>
                      <span className="font-semibold text-text">{p.title}</span>
                      <span className="block text-text-2">{p.why}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-micro font-normal text-muted">{C.permissionsNote}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <MetaConnectFlow open={open} onOpenChange={setOpen} onConnected={onConnected} />
    </section>
  );
}
