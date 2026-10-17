"use client";
import * as React from "react";
import { toast } from "sonner";
import { Check, ChevronDown, Gauge, WandSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CORE } from "@/content/he/app-core";
import type { HookScoreData } from "@/lib/mock/projects";
import { fillText } from "./plural";
import { cn } from "@/lib/utils";

const HS = APP_CORE.hookScore;

const bucket = (s: number) => (s >= 80 ? "strong" : s >= 60 ? "good" : "weak") as keyof typeof HS.buckets;
const toneClass = (s: number) => (s >= 80 ? "text-success" : s >= 60 ? "text-primary-text" : "text-rose");
const toneVar = (s: number) => (s >= 80 ? "var(--color-success)" : s >= 60 ? "var(--color-primary)" : "var(--color-rose)");

/** HookScoreBadge (spec 07–08 §S.4): ring gauge 0–100. The ring is a gauge, so it never mirrors. */
export function HookScoreBadge({ score, size = 56, className }: { score: number; size?: number; className?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      role="img"
      aria-label={fillText(HS.badgeLabel, { score })}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={toneVar(score)}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out)]"
        />
      </svg>
      <bdi className={cn("num absolute font-extrabold", size >= 56 ? "text-h3" : "text-micro", toneClass(score))} aria-hidden>{score}</bdi>
    </span>
  );
}

/** Score panel with up to 3 "תקנו בקליק" fixes and the mandatory caption. Fixes are simulated (new draft version). */
export function HookScorePanel({ data, onFix }: { data: HookScoreData; onFix?: (fix: string) => void }) {
  const [applied, setApplied] = React.useState<string[]>([]);
  const [showChecks, setShowChecks] = React.useState(false);
  const gained = data.suggestions.filter((s) => applied.includes(s.id)).reduce((a, s) => a + s.gain, 0);
  const score = Math.min(100, data.score + gained);
  const left = data.suggestions.slice(0, 3);

  return (
    <section aria-labelledby="hs-title" className="flex flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <div className="flex items-center gap-4">
        <HookScoreBadge score={score} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 id="hs-title" className="flex items-center gap-2 text-body-lg font-bold">
            <Gauge className="size-4 text-primary-text" aria-hidden />
            {HS.title}
          </h2>
          <p className={cn("text-small font-semibold", toneClass(score))} aria-live="polite">
            {fillText(HS.outOf, { score })} · {HS.buckets[bucket(score)]}
          </p>
        </div>
      </div>

      {left.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-micro text-muted">{HS.suggestionsTitle}</p>
          <ul className="flex flex-col gap-2">
            {left.map((s) => {
              const done = applied.includes(s.id);
              return (
                <li key={s.id} className={cn("flex flex-col gap-2 rounded-md bg-surface-2 p-3", done && "opacity-80")}>
                  <p className="text-small">{s.text}</p>
                  <div className="flex items-center justify-between gap-2">
                    <bdi dir="ltr" className="num text-micro text-success">+{s.gain}</bdi>
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-micro text-success"><Check className="size-3.5" aria-hidden />{HS.fixed}</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setApplied((a) => [...a, s.id]);
                          onFix?.(s.fix);
                          toast.success(HS.fixedToast);
                        }}
                      >
                        <WandSparkles aria-hidden />
                        {HS.fix}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-small text-text-2">{HS.allGood}</p>
      )}

      <div>
        <button type="button" onClick={() => setShowChecks((v) => !v)} aria-expanded={showChecks} className="flex items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
          {HS.checksTitle}
          <ChevronDown className={cn("size-4 transition-transform", showChecks && "rotate-180")} aria-hidden />
        </button>
        {showChecks && (
          <ul className="mt-2 grid gap-1.5 text-small">
            {data.checks.map((c) => (
              <li key={c.key} className="flex items-center gap-2">
                {c.ok ? <Check className="size-4 shrink-0 text-success" aria-label={HS.pass} /> : <X className="size-4 shrink-0 text-rose" aria-label={HS.fail} />}
                <span className={c.ok ? "text-text-2" : "text-text"}>{HS.checks[c.key]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="border-t border-border pt-3 text-micro font-normal text-muted">{HS.caption}</p>
    </section>
  );
}
