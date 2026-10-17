"use client";
import * as React from "react";
import Link from "next/link";
import { CircleCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Skeleton, Switch } from "@/components/ui/misc";
import { Num } from "@/components/a11y/num";
import { VideoTile } from "@/components/video/video-tile";
import { fill, fillText, Plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { QUALITY_LABEL, VIDEO_TYPE_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { formatDuration, type Aspect, type CaptionPreset } from "@/lib/mock/projects";
import { MOCK_CREDITS, MOCK_PLAN, MOCK_TRACKS, MOCK_VOICES } from "@/lib/mock/workspace";
import { ChipRadio, ChipToggle, Group, Panel, RadioCards, StepHeading } from "../choice";
import { CostBadge } from "../cost-badge";
import { etaRange } from "../estimate";
import { costOf, formatsOf, hasPriceClaim, scriptFactsOpen, useWizard, withHook } from "../wizard-state";
import { ScriptFactsPanel } from "./script-step";
import { cn } from "@/lib/utils";

const P = APP_CORE.wizard.preview;
const PRESETS: CaptionPreset[] = ["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"];
const SOURCE_LABEL = { ai_clip: P.sources.ai_clip, ai_image: P.sources.ai_image, user: P.sources.user, brand: P.sources.brand } as const;
const LIMIT: Record<Aspect, number> = { "9:16": 22, "1:1": 24, "16:9": 32 };

export function PreviewStep() {
  const { data, set } = useWizard();

  React.useEffect(() => {
    if (data.storyboard !== "building") return;
    const id = window.setTimeout(() => set({ storyboard: "ready" }), 2200);
    return () => window.clearTimeout(id);
  }, [data.storyboard, set]);
  React.useEffect(() => {
    if (data.storyboard === "none") set({ storyboard: "building" });
  }, [data.storyboard, set]);

  const scenes = withHook(data.scenes, data.hooks[0]?.text);
  const est = costOf(data);
  const formats = formatsOf(data);
  const [eMin, eMax] = etaRange(data.quality, data.durationSec, formats.length, data.abMode ? data.hooks.length : 1);
  const openFacts = scriptFactsOpen(data);
  const needsAttest = hasPriceClaim(data) && !data.priceAttested;
  const voice = data.voiceId === "none" ? APP_CORE.wizard.confirm.noVoice : MOCK_VOICES.find((v) => v.id === data.voiceId)?.name;
  const music = data.musicMode === "none" ? APP_CORE.wizard.confirm.noMusic : data.musicMode === "generate" ? APP_CORE.wizard.confirm.originalMusic : MOCK_TRACKS.find((t) => t.id === data.trackId)?.name;

  if (data.storyboard !== "ready") {
    return (
      <>
        <StepHeading title={P.title} subtitle={P.subtitle} />
        <p className="flex items-center gap-2 self-start rounded-full bg-violet/10 px-4 py-2 text-small font-semibold text-violet glow-ai">
          <span className="size-2 rounded-full bg-violet animate-pulse-dot" aria-hidden />
          {P.building}
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6" aria-busy="true">
          {scenes.map((s) => <Skeleton key={s.id} className="aspect-reel rounded-md shimmer-ai" />)}
        </div>
      </>
    );
  }

  return (
    <>
      <StepHeading title={P.title} subtitle={P.subtitle} />

      {data.fastPath === "done" && (
        <p className="flex items-start gap-2 rounded-md bg-violet/10 p-4 text-small font-semibold glow-ai">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
          {APP_CORE.wizard.fastPath.done}
        </p>
      )}

      {openFacts > 0 || needsAttest ? (
        <>
          {openFacts > 0 && (
            <p className="flex items-center gap-2 font-bold" role="status">
              <TriangleAlert className="size-4 text-primary-text" aria-hidden />
              <Plural n={openFacts} forms={APP_CORE.counts.factsLeft} />
            </p>
          )}
          <ScriptFactsPanel />
          {needsAttest && (
            <Panel tone="warn">
              <label className="flex items-start gap-3 text-small">
                <input type="checkbox" checked={data.priceAttested} onChange={(e) => set({ priceAttested: e.target.checked })} className="mt-1 size-4 accent-[var(--color-primary)]" />
                <span><span className="text-text-2">{APP_CORE.wizard.script.priceClaim} </span><span className="font-semibold">{APP_CORE.wizard.script.priceAttest}</span></span>
              </label>
            </Panel>
          )}
        </>
      ) : (
        <p className="flex items-center gap-2 rounded-md bg-success/10 px-4 py-3 text-small font-semibold text-success">
          <CircleCheck className="size-4" aria-hidden />
          {P.allApproved}
        </p>
      )}

      <Accordion type="multiple" defaultValue={["scenes"]} className="rounded-lg bg-surface-1 px-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <AccordionItem value="scenes">
          <AccordionTrigger>{P.sections.scenes}</AccordionTrigger>
          <AccordionContent>
            <ol className="flex flex-col gap-2">
              {scenes.map((s, i) => {
                const long = s.onscreen.length > LIMIT[data.primaryAspect] * 2;
                return (
                  <li key={s.id} className="flex gap-3 rounded-md bg-surface-2 p-3">
                    <div className="w-12 shrink-0"><VideoTile tone={s.tone} icon={s.icon} /></div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-micro">
                        <span className="font-bold text-text">{fill(P.scene, { n: <Num value={i + 1} /> })}</span>
                        <bdi className="font-mono text-muted">{formatDuration(s.durationSec)}</bdi>
                        <span className="rounded-xs bg-surface-3 px-1.5 py-0.5 text-text-2">{SOURCE_LABEL[s.source]}</span>
                      </div>
                      {(i > 0 || s.onscreen) && (
                        <Input
                          aria-label={`${APP_CORE.wizard.script.onscreen} · ${fillText(P.scene, { n: i + 1 })}`}
                          value={s.onscreen}
                          onChange={(e) => set((d) => ({ scenes: d.scenes.map((x, j) => (j === i ? { ...x, onscreen: e.target.value } : x)) }))}
                          className="h-9 text-small"
                        />
                      )}
                      {long && <p className="text-micro text-primary-text">{fillText(P.tooLong, { format: data.primaryAspect })}</p>}
                      <p className="line-clamp-2 text-micro font-normal text-text-2">{s.vo}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Link href={`/app/projects/${data.projectId}/editor`} className="mt-3 inline-block text-small font-semibold text-link underline underline-offset-2">{P.advanced}</Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="captions">
          <AccordionTrigger>{P.sections.captions}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <RadioCards
              label={P.sections.captions}
              value={data.captionPreset}
              onValueChange={(v) => set({ captionPreset: v as CaptionPreset })}
              columns="grid-cols-3"
              size="sm"
              items={PRESETS.map((p) => ({ value: p, title: P.captionPresets[p], media: <CaptionSample preset={p} /> }))}
            />
            <Group label={P.captionPosition}>
              <ChipRadio label={P.captionPosition} value={data.captionPosition} onValueChange={(v) => set({ captionPosition: v as "lower" | "middle" })}
                items={[{ value: "lower", label: P.captionLower }, { value: "middle", label: P.captionMiddle }]} />
            </Group>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>{P.sections.brand}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-3 text-small font-semibold text-text">
              {P.logoBug}
              <Switch checked={data.logoBug} onCheckedChange={(c) => set({ logoBug: c })} />
            </label>
            <Group label={P.intro} help={P.introHelp}>
              <ChipRadio label={P.intro} value={data.intro} onValueChange={(v) => set({ intro: v as typeof data.intro })}
                items={(["none", "logo_reveal", "title_card"] as const).map((k) => ({ value: k, label: P.intros[k] }))} />
            </Group>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="end">
          <AccordionTrigger>{P.sections.endCard}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end-headline" className="text-sm font-semibold text-text">{P.endCardHeadline}</label>
              <Input id="end-headline" maxLength={30} value={data.endCard.headline} onChange={(e) => set((d) => ({ endCard: { ...d.endCard, headline: e.target.value } }))} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["phone", "whatsapp", "website", "address"] as const).map((k) => (
                <ChipToggle key={k} pressed={data.endCard[k]} onPressedChange={(on) => set((d) => ({ endCard: { ...d.endCard, [k]: on } }))}>{P.endCardToggles[k]}</ChipToggle>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai">
          <AccordionTrigger>{P.sections.aiLabel}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <label className="flex items-center justify-between gap-3 text-small font-semibold text-text">
              {P.aiLabelToggle}
              <Switch checked={data.aiLabel} onCheckedChange={(c) => set({ aiLabel: c })} />
            </label>
            <p className="text-small">{P.aiLabelHelp}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formats" className="border-b-0">
          <AccordionTrigger>{P.sections.formats}</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2">
            {(["9:16", "1:1", "16:9"] as Aspect[]).map((a) => (
              <ChipToggle
                key={a}
                pressed={formats.includes(a)}
                disabled={a === data.primaryAspect}
                onPressedChange={(on) => set((d) => ({ extraAspects: on ? [...d.extraAspects, a] : d.extraAspects.filter((x) => x !== a) }))}
              >
                <bdi dir="ltr" className="font-mono">{a}</bdi>
              </ChipToggle>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Panel className="flex flex-col gap-4">
        <h2 className="text-body-lg font-bold">{P.summaryTitle}</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-small sm:grid-cols-3">
          {[
            [P.summary.type, <>{VIDEO_TYPE_LABEL[data.videoType]} · <bdi className="num">{data.durationSec}</bdi> שנ׳</>],
            [P.summary.formats, <bdi key="f" dir="ltr" className="font-mono">{formats.join(" · ")}</bdi>],
            [P.summary.quality, QUALITY_LABEL[data.quality]],
            [P.summary.visual, VISUAL_MIX_LABEL[data.visualMix]],
            [P.summary.voice, voice],
            [P.summary.music, music],
            ...(data.abMode && data.hooks.length > 1 ? [[P.summary.variants, <Plural key="v" n={data.hooks.length} forms={APP_CORE.counts.hooksVersions} />]] : []),
          ].map(([k, v], i) => (
            <div key={i} className="flex flex-col">
              <dt className="text-micro text-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className={cn("flex flex-wrap items-center gap-3 border-t border-border pt-4")}>
          <CostBadge credits={est.credits} lines={est.lines} balance={MOCK_CREDITS.balance} />
          <span className="text-micro font-normal text-text-2">
            {fill(P.balance, { balance: <Num value={MOCK_CREDITS.balance} />, after: <Num value={Math.max(0, MOCK_CREDITS.balance - est.credits)} /> })}
          </span>
          <span className="text-micro font-normal text-text-2">{fill(P.eta, { eta: <bdi dir="ltr" className="num">{`${eMin}–${eMax}`}</bdi> })}</span>
        </div>
        {MOCK_PLAN.id === "free" && <p className="text-small text-text-2">{P.watermark}</p>}
      </Panel>
    </>
  );
}

function CaptionSample({ preset }: { preset: CaptionPreset }) {
  const w = P.captionSample;
  return (
    <span aria-hidden className="relative flex h-14 items-center justify-center overflow-hidden rounded-sm bg-black">
      <span
        className={cn(
          "text-small leading-none text-white",
          preset === "bold-pop" && "font-black",
          preset === "poster" && "font-display text-h3",
          preset === "clean-box" && "rounded-[6px] bg-black/80 px-2 py-1 font-bold shadow-[0_0_0_1px_var(--color-frame)]",
          preset === "news" && "border-s-4 border-primary bg-black/80 px-2 py-1 font-bold",
          preset === "soft" && "rounded-full bg-white/90 px-2.5 py-1 font-semibold text-on-primary",
          preset === "karaoke" && "font-extrabold",
        )}
      >
        {preset === "bold-pop" ? <>{w[0]} <span className="rounded-[4px] bg-primary px-1 text-on-primary">{w[1]}</span> {w[2]}</> : preset === "karaoke" ? <><span className="text-rose">{w[0]} {w[1]}</span> {w[2]}</> : w.join(" ")}
      </span>
    </span>
  );
}
