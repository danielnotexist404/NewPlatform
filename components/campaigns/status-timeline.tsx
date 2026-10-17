import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  label: string;
  meta?: string;
  state: "done" | "current" | "todo" | "failed";
}

/** CampaignStatusTimeline (spec §F.7): "נוצר · נשלח לבדיקה של מטא · אושר · פעיל" — no time promises. */
export function CampaignStatusTimeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("grid gap-2", className)} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex flex-col gap-2" aria-current={s.state === "current" ? "step" : undefined}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                s.state === "done" && "bg-success text-bg",
                s.state === "current" && "bg-primary text-on-primary glow-primary",
                s.state === "todo" && "bg-surface-3 text-muted",
                s.state === "failed" && "bg-danger text-on-danger",
              )}
              aria-hidden
            >
              {s.state === "done" ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : s.state === "failed" ? (
                <X className="size-3.5" strokeWidth={3} />
              ) : s.state === "current" ? (
                <span className="size-2 rounded-full bg-on-primary animate-pulse-dot" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className={cn("h-0.5 flex-1 rounded-full", s.state === "done" ? "bg-success/60" : "bg-surface-3")} />
            )}
          </div>
          <div className="min-w-0 pe-2">
            <p className={cn("text-micro", s.state === "todo" ? "text-muted" : "text-text")}>{s.label}</p>
            {s.meta && <p className="text-micro font-normal text-muted">{s.meta}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
