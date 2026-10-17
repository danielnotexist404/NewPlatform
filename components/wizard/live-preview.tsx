"use client";
import * as React from "react";
import { PhonePreview, type PreviewScene } from "@/components/video/phone-preview";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { APP_CORE } from "@/content/he/app-core";
import { getNiche } from "@/lib/data/seed";
import { formatDuration, type Aspect, type WizardStep } from "@/lib/mock/projects";
import { MOCK_BUSINESS, MOCK_CREDITS } from "@/lib/mock/workspace";
import { fill, fillText } from "@/components/projects/plural";
import { costOf, formatsOf, useWizard, withHook } from "./wizard-state";
import { CostBadge } from "./cost-badge";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard;
const LETTERS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳"];

/** LivePreviewPhone (Part 03 §6.0 table): what plays depends on the step. Animatic only, no render cost. */
export function LivePreview({ step, compact }: { step: WizardStep; compact?: boolean }) {
  const { data } = useWizard();
  const formats = formatsOf(data);
  const [chosen, setAspect] = React.useState<Aspect>(data.primaryAspect);
  const [variant, setVariant] = React.useState(0);
  const aspect = formats.includes(chosen) ? chosen : data.primaryAspect;

  const niche = getNiche(data.nicheSlug ?? "");
  const brandScene: PreviewScene = {
    id: "brand", onscreen: data.business.name, vo: data.business.usp, durationSec: Math.min(8, data.durationSec / 3), tone: "ember", icon: niche?.icon ?? "Store",
  };
  const hookText = data.hooks[variant]?.text ?? data.hooks[0]?.text;
  let scenes: PreviewScene[];
  const early = step === "business" || step === "niche" || step === "goal";
  if (early) scenes = [brandScene];
  else if (step === "hook" || data.scenes.length === 0) {
    scenes = hookText
      ? [{ id: "hook", onscreen: hookText, vo: hookText, durationSec: 4, tone: "ember", icon: niche?.icon ?? "Flame" }, { ...brandScene, id: "brand2", onscreen: "", durationSec: 3 }]
      : [brandScene];
  } else scenes = withHook(data.scenes, hookText);

  const full = step === "preview" && data.storyboard === "ready";
  const est = costOf(data);
  const totalSec = early ? data.durationSec : scenes.reduce((a, s) => a + s.durationSec, 0);
  const showVariants = data.abMode && data.hooks.length > 1 && !early;

  return (
    <div className={cn("flex flex-col items-center gap-4", compact && "gap-3")}>
      {showVariants && (
        <div role="tablist" aria-label={APP_CORE.project.variantsLabel} className="flex flex-wrap justify-center gap-1 rounded-full bg-surface-2 p-1">
          {data.hooks.map((h, i) => (
            <button
              key={h.key}
              role="tab"
              type="button"
              aria-selected={variant === i}
              onClick={() => setVariant(i)}
              className={cn("rounded-full px-3 py-1 text-small font-semibold text-text-2", variant === i && "bg-surface-3 text-text")}
            >
              {i === 0 ? W.preview.variantMain : fillText(W.preview.variantTab, { letter: LETTERS[i] })}
            </button>
          ))}
        </div>
      )}
      <PhonePreview
        key={`${step}-${aspect}`}
        scenes={scenes}
        title={data.title}
        aspect={aspect}
        width={compact ? 260 : step === "preview" ? 340 : 300}
        captionPreset={data.captionPreset}
        captionPosition={data.captionPosition}
        endCard={
          full
            ? {
                headline: data.endCard.headline,
                name: MOCK_BUSINESS.name,
                logoLetter: MOCK_BUSINESS.logoLetter,
                lines: [data.endCard.whatsapp ? fillText(APP_CORE.player.endWhatsapp, { phone: MOCK_BUSINESS.whatsapp }) : "", data.endCard.address ? MOCK_BUSINESS.city : ""].filter(Boolean),
              }
            : null
        }
        aiLabel={full && data.aiLabel}
        logoBug={full && data.logoBug ? MOCK_BUSINESS.logoLetter : null}
        autoPlay={step === "preview"}
        loop={!full}
        glow={!compact}
        feedHeader={
          <>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">{MOCK_BUSINESS.logoLetter}</span>
            <span className="text-small font-semibold">{MOCK_BUSINESS.shortName}</span>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {formats.length > 1 && (
          <ToggleGroup type="single" value={aspect} onValueChange={(v) => v && setAspect(v as Aspect)} aria-label={APP_CORE.project.formatsLabel} dir="ltr">
            {formats.map((f) => (
              <ToggleGroupItem key={f} value={f} className="font-mono text-micro">{f}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        <CostBadge credits={est.credits} lines={est.lines} approximate={data.scriptState !== "ready"} balance={MOCK_CREDITS.balance} />
        <span className="text-micro font-normal text-muted">
          {fill(W.estDuration, { duration: <bdi className="font-mono">{formatDuration(totalSec)}</bdi> })}
        </span>
      </div>
      {!compact && <p className="text-center text-micro font-normal text-muted">{APP_CORE.player.sample}</p>}
    </div>
  );
}
