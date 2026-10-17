"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MapPin, MessageCircle, Pencil, Phone, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { getNiche } from "@/lib/data/seed";
import { DRAFT_SCRIPT } from "@/lib/mock/projects";
import { MOCK_BUSINESS } from "@/lib/mock/workspace";
import { Panel, StepHeading } from "../choice";
import { hookFromSeed, useWizard, withHook } from "../wizard-state";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard;
const B = W.business;

export function BusinessStep() {
  const { data, set } = useWizard();
  const [editing, setEditing] = React.useState(false);
  const niche = getNiche(data.nicheSlug ?? "");
  const nameError = !data.business.name.trim() ? APP_CORE.onboarding.business.errors.nameEmpty : data.business.name.length > 60 ? APP_CORE.onboarding.business.errors.nameLong : undefined;
  const setBiz = (p: Partial<typeof data.business>) => set((d) => ({ business: { ...d.business, ...p } }));

  if (data.fastPath === "running") return <FastPathOverlay />;

  return (
    <>
      <StepHeading title={B.title} subtitle={B.subtitle} />

      <Panel className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary text-2xl font-black text-on-primary glow-primary" aria-hidden>
            {MOCK_BUSINESS.logoLetter}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-h3" dir="auto">{data.business.name}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-text-2">
              <span>{niche?.name_he}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" aria-hidden />{data.business.city}</span>
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditing((e) => !e)} aria-expanded={editing}>
            {editing ? <Check aria-hidden /> : <Pencil aria-hidden />}
            {editing ? B.done : B.edit}
          </Button>
        </div>
        {!editing ? (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-2" aria-label={APP_CORE.onboarding.business.fields.services}>
              {data.business.services.map((s) => (
                <li key={s.name} className="rounded-full bg-surface-2 px-3 py-1 text-small">{s.name}</li>
              ))}
            </ul>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-small text-text-2">
              <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" aria-hidden /><bdi dir="ltr">{data.business.phone}</bdi></span>
              <span className="inline-flex items-center gap-1.5"><MessageCircle className="size-3.5" aria-hidden /><bdi dir="ltr">{data.business.whatsapp}</bdi></span>
            </p>
            <p className="text-small text-text-2">{data.business.usp}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={APP_CORE.onboarding.business.fields.name} htmlFor="biz-name" error={nameError}>
              <Input id="biz-name" value={data.business.name} onChange={(e) => setBiz({ name: e.target.value })} aria-invalid={!!nameError} />
            </Field>
            <Field label={APP_CORE.onboarding.business.fields.city} htmlFor="biz-city">
              <Input id="biz-city" value={data.business.city} onChange={(e) => setBiz({ city: e.target.value })} />
            </Field>
            <Field label={APP_CORE.onboarding.business.fields.phone} htmlFor="biz-phone">
              <LtrInput id="biz-phone" type="tel" value={data.business.phone} onChange={(e) => setBiz({ phone: e.target.value })} />
            </Field>
            <Field label={APP_CORE.onboarding.business.fields.whatsapp} htmlFor="biz-wa">
              <LtrInput id="biz-wa" type="tel" value={data.business.whatsapp} onChange={(e) => setBiz({ whatsapp: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label={APP_CORE.onboarding.business.fields.usp} htmlFor="biz-usp" help={W.businessHelp}>
                <Textarea id="biz-usp" maxLength={160} value={data.business.usp} onChange={(e) => setBiz({ usp: e.target.value })} className="min-h-16" />
              </Field>
            </div>
          </div>
        )}
      </Panel>

      <div className="grid gap-5">
        <Field label={B.focusService} htmlFor="focus">
          <select
            id="focus"
            value={data.focusService}
            onChange={(e) => set({ focusService: e.target.value })}
            className="h-11 w-full rounded-sm border border-border-strong bg-surface-2 px-3.5 text-base text-text"
          >
            {data.business.services.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
            <option value="__other">{B.focusOther}</option>
          </select>
        </Field>
        {data.focusService === "__other" && (
          <Input aria-label={B.focusOther} maxLength={60} value={data.focusOther} onChange={(e) => set({ focusOther: e.target.value })} />
        )}
        <Field label={B.notes} htmlFor="notes" help={B.notesHelp}>
          <Textarea id="notes" maxLength={500} value={data.notes} placeholder={B.notesPlaceholder} onChange={(e) => set({ notes: e.target.value })} />
        </Field>
        <p className="-mt-3 text-end text-micro font-normal text-muted" aria-live="polite"><bdi className="num">{data.notes.length}</bdi> / <bdi className="num">500</bdi></p>
      </div>

      <FastPathCard />
    </>
  );
}

function FastPathCard() {
  const { data, set } = useWizard();
  const F = W.fastPath;
  return (
    <Panel tone={data.fastHighlight ? "gold" : "ai"} className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", data.fastHighlight && "glow-primary")}>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-violet/15 text-violet">
        <WandSparkles className="size-6" aria-hidden />
      </span>
      <div className="flex-1">
        <h2 className="text-body-lg font-bold">{F.title}</h2>
        <p className="text-small text-text-2">{F.body}</p>
      </div>
      <Button onClick={() => set({ fastPath: "running" })} disabled={!data.business.name.trim()} className="shrink-0">
        {F.cta}
        <span className="font-normal opacity-80">· {plural(3, APP_CORE.counts.credits)}</span>
      </Button>
    </Panel>
  );
}

/** FastPathOverlay (Part 03 §6.11): in-content progress, not a blocking modal. */
function FastPathOverlay() {
  const router = useRouter();
  const { data, set } = useWizard();
  const F = W.fastPath;
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    if (stage >= F.steps.length) {
      const hook = hookFromSeed("restaurants-01");
      set({
        fastPath: "done",
        hooks: hook ? [hook] : [],
        scriptState: "ready",
        scriptHookKey: hook?.key ?? null,
        scenes: withHook(DRAFT_SCRIPT, hook?.text),
        visualStyle: "cinematic",
        visualMix: "smart",
        quality: "standard",
        voiceId: "v-ori",
        musicMode: "library",
        mood: "אורבני",
        trackId: "t-1",
        storyboard: "ready",
      });
      router.push(`/app/projects/${data.projectId}/create/preview`);
      return;
    }
    const id = window.setTimeout(() => setStage((s) => s + 1), 1300);
    return () => window.clearTimeout(id);
  }, [stage, F.steps.length, set, router, data.projectId]);

  return (
    <section aria-labelledby="fp-title" aria-live="polite" className="flex flex-col gap-6 rounded-lg bg-violet/[.06] p-6 glow-ai">
      <h1 id="wizard-step-title" tabIndex={-1} className="flex items-center gap-3 text-h2 outline-none">
        <WandSparkles className="size-7 text-violet" aria-hidden />
        <span id="fp-title">{F.title}</span>
      </h1>
      <ol className="flex flex-col gap-3">
        {F.steps.map((label, i) => {
          const done = i < stage;
          const running = i === stage;
          return (
            <li key={label} className={cn("flex items-center gap-3 rounded-md p-3", running ? "shimmer-ai" : "bg-surface-1")}>
              <span className={cn("flex size-7 items-center justify-center rounded-full", done ? "bg-success/15 text-success" : running ? "bg-violet/20 text-violet" : "bg-surface-3 text-muted")}>
                {done ? <Check className="size-4" aria-hidden /> : running ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <bdi className="num text-micro">{i + 1}</bdi>}
              </span>
              <span className={cn("font-semibold", !done && !running && "text-muted")}>{label}</span>
            </li>
          );
        })}
      </ol>
      <Button variant="secondary" className="self-start" onClick={() => set({ fastPath: "idle" })}>{F.stop}</Button>
    </section>
  );
}
