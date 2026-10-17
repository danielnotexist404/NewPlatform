"use client";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/misc";
import { GUIDED } from "@/content/he/trends-app";
import { cn } from "@/lib/utils";

/** `guidedAutocut` progress (mock): stage list + AI progress bar + a polite live region. */
export function AutocutProgress({ stage }: { stage: number }) {
  const stages = GUIDED.autocut.stages;
  const pct = Math.round((Math.min(stage, stages.length) / stages.length) * 100);
  const current = stages[Math.min(stage, stages.length - 1)];
  return (
    <div className="flex flex-col gap-4">
      <Progress value={Math.max(6, pct)} variant="ai" aria-label={GUIDED.autocut.working} />
      <p className="sr-only" aria-live="polite">{GUIDED.autocut.live(current)}</p>
      <ol className="flex flex-col gap-2.5">
        {stages.map((s, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <li key={s} className={cn("flex items-center gap-3 text-small", !done && !active && "text-muted")}>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-success/15 text-success" : active ? "bg-violet/15 text-violet" : "bg-surface-3",
                )}
              >
                {done ? <Check aria-hidden className="size-3.5" /> : active ? <span aria-hidden className="size-2 animate-pulse-dot rounded-full bg-violet" /> : null}
              </span>
              <span className={cn(active && "font-semibold text-text")}>{s}</span>
              {active && <span className="ms-auto text-micro text-violet">{GUIDED.autocut.working}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
