import { Camera, Film, Layers, Scissors } from "lucide-react";
import { Num } from "@/components/a11y/num";
import { BEAT_ROLE_LABEL, OVERLAY_LABEL, TREND_DETAIL, VISUAL_SOURCE_LABEL } from "@/content/he/trends-app";
import type { BeatRole, TrendBeat } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

const END_CARD_MS = 2500;

export const ROLE_TONE: Record<BeatRole | "end", { bar: string; dot: string; text: string }> = {
  bait: { bar: "bg-rose/85 text-black", dot: "bg-rose", text: "text-rose" },
  cut: { bar: "bg-text", dot: "bg-text", text: "text-text" },
  payoff: { bar: "bg-primary text-on-primary", dot: "bg-primary", text: "text-primary-text" },
  reveal: { bar: "bg-violet/85 text-black", dot: "bg-violet", text: "text-violet" },
  cta: { bar: "bg-success/85 text-black", dot: "bg-success", text: "text-success" },
  label: { bar: "bg-lemon text-on-primary", dot: "bg-lemon", text: "text-text" },
  end: { bar: "bg-surface-3 text-text-2", dot: "bg-surface-3", text: "text-text-2" },
};

const sec = (ms: number) => Math.round(ms / 100) / 10;

/** Proportional beat bar (media timeline → LTR) + the ordered beat list (RTL). */
export function RecipeTimeline({ beats, durationSec }: { beats: TrendBeat[]; durationSec: number }) {
  const timed = beats.filter((b) => b.role !== "label");
  const labels = beats.filter((b) => b.role === "label");
  const totalMs = timed.reduce((s, b) => s + b.durationMs, 0) + END_CARD_MS;
  const ticks = Array.from({ length: Math.floor(totalMs / 5000) + 1 }, (_, i) => i * 5).filter((t) => t * 1000 < totalMs - 1500);
  const stepOf = new Map<string, number>();
  beats.filter((b) => b.role !== "label" && b.role !== "cut").forEach((b, i) => stepOf.set(b.key, i + 1));

  return (
    <div className="flex flex-col gap-6">
      <figure className="flex flex-col gap-2" aria-label={TREND_DETAIL.recipe.timelineLabel}>
        <div dir="ltr" className="flex flex-col gap-1.5">
          {labels.map((l) => (
            <div key={l.key} className="flex h-6 items-center justify-center rounded-xs bg-lemon/90 px-2 text-micro text-on-primary">
              <span dir="rtl" className="truncate">{BEAT_ROLE_LABEL.label}: {l.titleHe}</span>
            </div>
          ))}
          <div className="flex h-14 items-stretch gap-[3px] overflow-hidden rounded-sm">
            {timed.map((b) =>
              b.role === "cut" ? (
                <div key={b.key} className="relative flex w-1.5 shrink-0 items-center justify-center bg-text" title={`${BEAT_ROLE_LABEL.cut}: ${b.titleHe}`}>
                  <Scissors aria-hidden className="absolute size-3.5 -translate-y-6 text-text" />
                </div>
              ) : (
                <div
                  key={b.key}
                  className={cn("flex min-w-0 flex-col justify-center rounded-[4px] px-2", ROLE_TONE[b.role].bar)}
                  style={{ flexGrow: b.durationMs, flexBasis: 0 }}
                >
                  <span dir="rtl" className="truncate text-micro">{BEAT_ROLE_LABEL[b.role]}</span>
                  <span dir="rtl" className="truncate text-[0.75rem] opacity-80">{b.titleHe}</span>
                </div>
              ),
            )}
            <div className={cn("flex min-w-0 flex-col justify-center rounded-[4px] px-2", ROLE_TONE.end.bar)} style={{ flexGrow: END_CARD_MS, flexBasis: 0 }}>
              <span dir="rtl" className="truncate text-micro">{TREND_DETAIL.recipe.endCard}</span>
            </div>
          </div>
          <div className="relative h-4 text-micro text-muted">
            {ticks.map((t) => (
              <span key={t} className="num absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${Math.min(100, (t * 1000 * 100) / totalMs)}%` }}>
                {t}s
              </span>
            ))}
            <span className="num absolute inset-e-0">{durationSec}s</span>
          </div>
        </div>
      </figure>

      <ol className="flex flex-col gap-3">
        {beats.map((b) => {
          const isTimed = b.role !== "label" && b.role !== "cut";
          return (
            <li key={b.key} className={cn("grid grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-md p-3", b.role === "cut" || b.role === "label" ? "bg-transparent shadow-[inset_0_0_0_1px_var(--color-border)]" : "bg-surface-2")}>
              <span
                aria-hidden
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-sm font-extrabold",
                  isTimed ? ROLE_TONE[b.role].bar : "bg-surface-3 text-text-2",
                )}
              >
                {b.role === "cut" ? <Scissors className="size-4" /> : b.role === "label" ? <Layers className="size-4" /> : <Num value={stepOf.get(b.key) ?? 0} />}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={cn("inline-flex items-center gap-1.5 text-micro", ROLE_TONE[b.role].text)}>
                    <span aria-hidden className={cn("size-1.5 rounded-full", ROLE_TONE[b.role].dot)} />
                    {BEAT_ROLE_LABEL[b.role]}
                  </span>
                  <h3 className="text-body font-bold">{b.titleHe}</h3>
                  <span className="ms-auto text-micro text-muted">
                    {b.role === "cut" ? TREND_DETAIL.recipe.transition
                      : b.role === "label" ? TREND_DETAIL.recipe.wholeVideo
                      : <><Num value={sec(b.durationMs)} /> {TREND_DETAIL.recipe.seconds}</>}
                  </span>
                </div>
                <p className="text-small text-text-2">{b.descriptionHe}</p>
                {(b.visualSource || b.overlay || b.guidedShotKey) && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {b.visualSource && (
                      <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
                        <Film aria-hidden className="size-3.5" />
                        <span className="sr-only">{TREND_DETAIL.recipe.visualSource}: </span>
                        {VISUAL_SOURCE_LABEL[b.visualSource]}
                      </span>
                    )}
                    {b.overlay && (
                      <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
                        <Layers aria-hidden className="size-3.5" />
                        <span className="sr-only">{TREND_DETAIL.recipe.overlay}: </span>
                        {OVERLAY_LABEL[b.overlay]}
                      </span>
                    )}
                    {b.guidedShotKey && b.visualSource === "user_media" && (
                      <span className="inline-flex items-center gap-1 rounded-xs border border-border-strong px-2 py-0.5 text-micro text-text-2">
                        <Camera aria-hidden className="size-3.5" />
                        {TREND_DETAIL.recipe.yourShot}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
