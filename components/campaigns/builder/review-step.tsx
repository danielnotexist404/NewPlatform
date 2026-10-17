"use client";
import * as React from "react";
import { Check, CircleAlert, Gauge, PauseCircle, Sparkles, TriangleAlert, X } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Price } from "@/components/a11y/num";
import { builderDraft, MOCK_TODAY, SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { builder as B, CTA_LABEL, GOAL_COPY, HOOK_KEY_HE } from "@/content/he/campaigns-app";
import { dateLong, fmt } from "../text";
import { MetaPreviewFrame, type PreviewPlatform } from "./meta-preview-frame";
import { HEADLINE_MAX, PRIMARY_MAX, type DraftState, type Patch } from "./types";
import { StepHeading } from "./steps";
import { cn } from "@/lib/utils";

const AI_NOTICE_KEY = "announcement.dismissed.meta-ai-notice"; // allowed key (Part 03 §1)

export type Phase = "draft" | "preparing" | "ready" | "publishing";

export function findModerationIssues(text: string): { kind: "claims" | "attributes"; word: string } | null {
  for (const w of B.moderationWords.attributes) if (text.includes(w)) return { kind: "attributes", word: w };
  for (const w of B.moderationWords.claims) if (text.includes(w)) return { kind: "claims", word: w };
  return null;
}

export function areaSummary(d: DraftState) {
  if (d.areaMode === "radius") return `${B.area.modes.radius}, ${fmt(B.area.km, { n: d.radiusKm })}`;
  if (d.areaMode === "cities") return d.cities.length ? d.cities.join(", ") : "—";
  return B.area.modes.country;
}

export function destinationLabel(d: DraftState) {
  return d.goal === "whatsapp_messages" ? B.review.destinationWhatsapp : d.goal === "lead_form" ? B.review.destinationForm : d.goal === "website_traffic" ? B.review.destinationSite : B.review.destinationNone;
}

function useDismissed(key: string): [boolean, () => void] {
  const [dismissed, setDismissed] = React.useState(false);
  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read a per-viewer dismissal after mount
      if (localStorage.getItem(key) === "1") setDismissed(true);
    } catch {
      /* storage blocked */
    }
  }, [key]);
  return [
    dismissed,
    () => {
      setDismissed(true);
      try {
        localStorage.setItem(key, "1");
      } catch {
        /* storage blocked */
      }
    },
  ];
}

export function ReviewStep({ d, patch, phase, confirm, setConfirm, showConfirmHint }: { d: DraftState; patch: Patch; phase: Phase; confirm: boolean; setConfirm: (v: boolean) => void; showConfirmHint: boolean }) {
  const [platform, setPlatform] = React.useState<PreviewPlatform>("reels");
  const [aiDismissed, dismissAi] = useDismissed(AI_NOTICE_KEY);
  const issues = d.variants.map((v) => findModerationIssues(`${v.primaryText} ${v.headline}`));
  const claimsOk = issues.every((i) => !i);
  const ctaLabel = CTA_LABEL[d.cta];

  function editVariant(i: number, p: Partial<DraftState["variants"][number]>) {
    patch({ variants: d.variants.map((v, j) => (j === i ? { ...v, ...p } : v)) });
  }

  const safety = [
    { key: "claims", label: B.review.safety.claims, ok: claimsOk },
    { key: "music", label: B.review.safety.music, ok: true },
    { key: "ui", label: B.review.safety.ui, ok: true },
    { key: "political", label: B.review.safety.political, ok: true },
    { key: "spec", label: B.review.safety.spec, ok: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <StepHeading title={B.review.title} sub={B.review.sub} />

      {/* Previews */}
      <section aria-labelledby="previews-title" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="previews-title" className="text-h3">{B.review.previews}</h3>
          <Tabs value={platform} onValueChange={(v) => setPlatform(v as PreviewPlatform)}>
            <TabsList aria-label={B.review.previews}>
              <TabsTrigger value="reels">{B.review.platforms.reels}</TabsTrigger>
              <TabsTrigger value="instagram">{B.review.platforms.instagram}</TabsTrigger>
              <TabsTrigger value="facebook">{B.review.platforms.facebook}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {builderDraft.variants.map((v, i) => (
            <MetaPreviewFrame
              key={v.key}
              platform={platform}
              hookText={v.hookText}
              tone={v.tone}
              primaryText={d.variants[i].primaryText}
              headline={d.variants[i].headline}
              ctaLabel={ctaLabel}
              label={`${fmt(B.review.hook, { key: HOOK_KEY_HE[v.key] })} · ${v.hookTypeHe}`}
              className="w-[min(72vw,260px)] shrink-0 snap-center md:w-auto"
            />
          ))}
        </div>
        <p className={cn("flex items-center gap-2 text-small", phase === "ready" || phase === "publishing" ? "text-success" : "text-muted")}>
          {phase === "ready" || phase === "publishing" ? <Check className="size-4" aria-hidden /> : null}
          {phase === "ready" || phase === "publishing" ? B.review.officialReady : B.review.previewNote}
        </p>
      </section>

      {/* Copy */}
      <section aria-labelledby="copy-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 id="copy-title" className="text-h3">{B.review.copyTitle}</h3>
          <p className="inline-flex items-center gap-1.5 text-small text-text-2"><Sparkles className="size-4 text-violet" aria-hidden />{B.review.copyNote}</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {builderDraft.variants.map((v, i) => {
            const issue = issues[i];
            const pLen = d.variants[i].primaryText.length;
            const hLen = d.variants[i].headline.length;
            return (
              <div key={v.key} className="flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-micro text-primary-text">{fmt(B.review.hook, { key: HOOK_KEY_HE[v.key] })}</p>
                    <p className="text-small font-bold leading-snug">{v.hookText}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet/15 px-2 py-0.5 text-micro text-violet" title={B.review.hookScoreCaption}>
                    <Gauge className="size-3.5" aria-hidden />
                    <span className="sr-only">{B.review.hookScore}</span>
                    <bdi className="num">{v.hookScore}</bdi>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor={`primary-${v.key}`}>{B.review.primary}</Label>
                    <bdi className={cn("text-micro num", pLen > PRIMARY_MAX ? "text-primary-text" : "text-muted")}>{fmt(B.review.counter, { n: pLen, max: PRIMARY_MAX })}</bdi>
                  </div>
                  <Textarea id={`primary-${v.key}`} value={d.variants[i].primaryText} onChange={(e) => editVariant(i, { primaryText: e.target.value })} aria-invalid={!!issue || undefined} className="min-h-20 text-sm" />
                  {pLen > PRIMARY_MAX && <p className="text-micro font-normal text-primary-text">{B.review.tooLong}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor={`headline-${v.key}`}>{B.review.headline}</Label>
                    <bdi className={cn("text-micro num", hLen > HEADLINE_MAX ? "text-primary-text" : "text-muted")}>{fmt(B.review.counter, { n: hLen, max: HEADLINE_MAX })}</bdi>
                  </div>
                  <Input id={`headline-${v.key}`} value={d.variants[i].headline} onChange={(e) => editVariant(i, { headline: e.target.value })} className="h-10 text-sm" />
                </div>
                <p className="text-micro font-normal text-text-2">{B.review.cta}: <span className="font-semibold text-text">{ctaLabel}</span></p>
                {issue && (
                  <p role="alert" className="flex items-start gap-2 rounded-sm bg-danger/10 p-2.5 text-micro font-normal text-text">
                    <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden />
                    {fmt(issue.kind === "claims" ? B.review.claimWarn : B.review.attrWarn, { key: HOOK_KEY_HE[v.key], word: issue.word })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-micro font-normal text-muted">{B.review.hookScore}: {B.review.hookScoreCaption}</p>
      </section>

      {/* Ad-safety gate (F.12) */}
      <section aria-labelledby="safety-title" className="flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
        <h3 id="safety-title" className="text-body font-bold">{B.review.safetyTitle}</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {safety.map((s) => (
            <li key={s.key} className="flex items-start gap-2 text-small">
              <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", s.ok ? "bg-success/15 text-success" : "bg-danger/15 text-danger")} aria-hidden>
                {s.ok ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
              </span>
              <span className={s.ok ? "text-text" : "text-danger"}>
                {s.label}
                <span className="sr-only">{s.ok ? B.review.safetyOk : B.review.safetyFix}</span>
              </span>
            </li>
          ))}
        </ul>
        {!aiDismissed && (
          <div className="flex flex-col gap-2 rounded-sm bg-violet/10 p-3 text-small sm:flex-row sm:items-start sm:justify-between">
            <p className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
              {B.review.aiNotice}
            </p>
            <button type="button" onClick={dismissAi} className="shrink-0 text-small font-semibold text-link underline-offset-4 hover:underline">
              {B.review.aiNoticeDismiss}
            </button>
          </div>
        )}
      </section>

      {/* Summary */}
      <section aria-labelledby="sum-title" className="flex flex-col gap-3">
        <h3 id="sum-title" className="text-h3">{B.review.summaryTitle}</h3>
        <dl className="grid gap-x-6 gap-y-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:grid-cols-2 md:p-5">
          <SumRow label={B.review.summary.goal} value={GOAL_COPY[d.goal].label} />
          <SumRow label={B.review.summary.cta} value={ctaLabel} />
          <SumRow label={B.review.summary.destination} value={destinationLabel(d)} />
          <SumRow label={B.review.summary.area} value={areaSummary(d)} />
          <SumRow label={B.review.summary.age} value={<bdi className="num">{d.ageMin}–{d.ageMax === 65 ? "65+" : d.ageMax}</bdi>} />
          <SumRow label={B.review.summary.budget} value={<><Price ils={d.budget} /> {B.budget.perDay}</>} />
          <SumRow label={B.review.summary.dates} value={d.duration === "date" ? fmt(B.review.datesRange, { start: dateLong(MOCK_TODAY), end: dateLong(d.endDate) }) : fmt(B.review.datesOpen, { start: dateLong(MOCK_TODAY) })} />
          <SumRow label={B.review.summary.video} value={`${builderDraft.projectTitle} · ${SAMPLE_BUSINESS.name}`} />
        </dl>
      </section>

      {/* Paused-first notice + confirmation */}
      <section className="flex flex-col gap-4 rounded-lg bg-surface-2 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] md:p-6">
        <div className="flex items-start gap-3">
          <PauseCircle className="mt-0.5 size-6 shrink-0 text-primary-text" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="text-body-lg font-bold">{B.review.paused}</p>
            <p className="text-small text-text-2">{B.review.pausedSub}</p>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-sm bg-surface-1 p-3">
          <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--color-primary)]" aria-describedby={showConfirmHint ? "confirm-hint" : undefined} />
          <span className="text-small">{B.review.confirm}</span>
        </label>
        {showConfirmHint && !confirm && (
          <p id="confirm-hint" role="alert" className="flex items-center gap-2 text-small text-primary-text">
            <TriangleAlert className="size-4" aria-hidden />
            {B.review.confirmFirst}
          </p>
        )}
      </section>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-micro font-normal text-muted">{label}</dt>
      <dd className="text-small font-semibold text-text">{value}</dd>
    </div>
  );
}

