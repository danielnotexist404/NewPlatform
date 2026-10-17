"use client";
import * as React from "react";
import { CheckCircle2, CircleAlert, Gauge, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import type { HookView } from "./hook-data";
import { usePersonalization } from "./stores";
import { useGate } from "./hooks-provider";
import { createFromHookHref } from "./links";
import { fillText, placeholderLabel, wordCount, type Values } from "./text";

const S = HOOKS_COPY.score;

type Check = { id: string; weight: number; got: number; text: string; tip?: string };

/**
 * Teaser of "ציון הוק" (spec 07–08 §S.4): deterministic text checks only — the full score runs in the app on the
 * storyboard and render (text by 0.5 s, motion by 1 s, captions, CTA). Mandatory caption shown under the score.
 */
export function scoreHook(h: HookView, values: Values): { score: number; checks: Check[] } {
  const { text, missing } = fillText(h.text, values);
  const words = wordCount(text.replace(/\{[^}]+\}/g, "x"));
  const checks: Check[] = [];
  checks.push(
    words <= 9
      ? { id: "length", weight: 20, got: 20, text: S.checks.length.ok }
      : words <= 12
        ? { id: "length", weight: 20, got: 12, text: S.checks.length.warn, tip: S.checks.length.warn }
        : { id: "length", weight: 20, got: 4, text: S.checks.length.fail, tip: S.checks.length.fail },
  );
  checks.push({ id: "type", weight: 10, got: 10, text: S.checks.type.ok(h.typeName) });
  checks.push(h.visual.trim() ? { id: "visual", weight: 15, got: 15, text: S.checks.visual.ok } : { id: "visual", weight: 15, got: 0, text: S.checks.visual.warn, tip: S.checks.visual.warn });
  const specific = /[0-9₪%]/.test(h.text) || h.placeholders.length > 0;
  checks.push(specific ? { id: "specific", weight: 15, got: 15, text: S.checks.specific.ok } : { id: "specific", weight: 15, got: 7, text: S.checks.specific.warn, tip: S.checks.specific.warn });
  if (h.placeholders.length === 0) checks.push({ id: "personal", weight: 15, got: 15, text: S.checks.personal.none });
  else if (missing.length === 0) checks.push({ id: "personal", weight: 15, got: 15, text: S.checks.personal.ok });
  else {
    const t = S.checks.personal.warn(missing.map(placeholderLabel).join(", "));
    checks.push({ id: "personal", weight: 15, got: 6, text: t, tip: t });
  }
  checks.push(h.platforms.length >= 2 ? { id: "platforms", weight: 10, got: 10, text: S.checks.platforms.ok } : { id: "platforms", weight: 10, got: 5, text: S.checks.platforms.warn });
  checks.push(!h.compliance ? { id: "compliance", weight: 15, got: 15, text: S.checks.compliance.ok } : { id: "compliance", weight: 15, got: 9, text: S.checks.compliance.warn, tip: S.checks.compliance.warn });
  const score = Math.round(checks.reduce((s, c) => s + c.got, 0));
  return { score, checks };
}

export function HookScore({ hook }: { hook: HookView }) {
  const values = usePersonalization();
  const gate = useGate();
  const { score, checks } = scoreHook(hook, values);
  const level = score >= 85 ? "strong" : score >= 65 ? "good" : "weak";
  const tips = checks.filter((c) => c.tip).slice(0, 3);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <section aria-labelledby="score-title" className="relative overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <div aria-hidden className="pointer-events-none absolute -top-20 inset-s-0 size-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex items-center justify-between gap-3">
        <h2 id="score-title" className="flex items-center gap-2 text-h3">
          <Gauge className="size-5 text-primary-text" aria-hidden />
          {S.title}
        </h2>
        <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-micro text-text-2">{S.beta}</span>
      </div>

      <div className="relative mt-5 flex items-center gap-5">
        <div className="relative size-32 shrink-0" dir="ltr">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-surface-3)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={level === "weak" ? "var(--color-rose)" : level === "good" ? "var(--color-primary)" : "var(--color-success)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - score / 100)}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="num text-[2.25rem] font-extrabold leading-none">{score}</span>
            <span className="text-micro font-normal text-muted">{S.outOf}</span>
          </div>
        </div>
        <div>
          <p className="text-h3" aria-live="polite">
            <span className="sr-only">{`${S.title}: ${score} ${S.outOf}. `}</span>
            {S.levels[level]}
          </p>
          <p className="mt-1 text-small text-text-2">{S.caption}</p>
        </div>
      </div>

      <ul className="relative mt-5 flex flex-col gap-2">
        {checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-small">
            {c.got === c.weight ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            ) : (
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
            )}
            <span className={cn(c.got === c.weight ? "text-text-2" : "text-text")}>{c.text}</span>
          </li>
        ))}
      </ul>

      {tips.length === 0 && <p className="relative mt-4 text-small text-text-2">{S.allGood}</p>}

      <div className="relative mt-5 flex gap-2 rounded-md bg-surface-2 p-3 text-small text-text-2">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>{S.appNote}</p>
      </div>
      <Button variant="secondary" className="relative mt-4 w-full" onClick={() => gate("score", createFromHookHref(hook.id))}>
        {S.appCta}
      </Button>
    </section>
  );
}
