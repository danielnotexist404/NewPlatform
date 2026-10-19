"use client";
import * as React from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { cn } from "@/lib/utils";

const R = SIMPLE_APP.create.render;

/** Eases the shown value toward `target` and keeps creeping slowly while waiting on the network. */
function useCreep(target: number) {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((v) => {
        const cap = target >= 100 ? 100 : target + 6;
        const next = v < target ? v + Math.max(0.15, (target - v) * 0.06) : v < cap ? v + 0.02 : v;
        return Math.min(cap, next);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.min(100, shown);
}

export function ProgressRing({ value, size = 220 }: { value: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = React.useId();
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-coral)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <bdi dir="ltr" className="num text-h1 font-extrabold">{Math.floor(value)}%</bdi>
      </span>
    </div>
  );
}

/** Render progress: one ring + four steps. `stage` = active step (4 = done, -1 = idle). */
export function RenderScreen({
  stage,
  target,
  scenes,
  error,
  onRetry,
  onBack,
}: {
  stage: number;
  target: number;
  scenes: [number, number];
  error?: boolean;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  const shown = useCreep(error ? 0 : target);
  const done = stage >= 4;
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-10 py-6 text-center md:py-12">
      <ProgressRing value={done ? 100 : shown} />
      <div className="flex flex-col gap-2" aria-live="polite">
        <h1 className="text-h2">{error ? R.error : done ? R.done : R.title}</h1>
      </div>
      {error ? (
        <div className="flex flex-wrap justify-center gap-3">
          {onBack && (
            <Button variant="ghost" size="lg" onClick={onBack}>
              <DirIcon name="back" />
              {SIMPLE_APP.create.back}
            </Button>
          )}
          {onRetry && (
            <Button size="lg" onClick={onRetry}>
              <RotateCcw aria-hidden />
              {R.retry}
            </Button>
          )}
        </div>
      ) : (
        <ol className="flex w-full flex-col gap-1 rounded-xl bg-surface-1 p-3 text-start elev-2 ring-hairline">
          {R.steps.map((label, i) => {
            const state = i < stage ? "done" : i === stage ? "active" : "pending";
            return (
              <li key={label} className={cn("flex items-center gap-3 rounded-md px-3 py-3", state === "active" && "bg-surface-2")} aria-current={state === "active" ? "step" : undefined}>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    state === "done" ? "bg-accent-gradient text-ink" : state === "active" ? "text-primary-text" : "ring-1 ring-border-strong/60",
                  )}
                >
                  {state === "done" ? <Check className="size-4" aria-hidden /> : state === "active" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
                </span>
                <span className={cn("flex-1 text-body font-semibold", state === "pending" ? "text-muted" : "text-text")}>{label}</span>
                {i === 1 && scenes[1] > 0 && (
                  <bdi dir="ltr" className="num text-small text-muted">{scenes[0]}/{scenes[1]}</bdi>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
