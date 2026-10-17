"use client";
import * as React from "react";
import { FlaskConical } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { LP_DEMO } from "@/content/he/landing-pages";

/**
 * Mock "current plan" for the landing-pages screens (§S.7 paid gate). Default = starter, so the full flow is
 * visible; `?plan=free` (or the toggle) shows the free state. In-memory + URL, no browser storage.
 */
export type DemoPlan = "starter" | "free";

const listeners = new Set<() => void>();
let memory: DemoPlan | null = null;

function read(): DemoPlan {
  if (memory) return memory;
  try {
    return new URLSearchParams(window.location.search).get("plan") === "free" ? "free" : "starter";
  } catch {
    return "starter";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useDemoPlan() {
  const plan = React.useSyncExternalStore(subscribe, read, () => "starter" as DemoPlan);
  const setPlan = React.useCallback((p: DemoPlan) => {
    memory = p;
    try {
      const url = new URL(window.location.href);
      if (p === "free") url.searchParams.set("plan", "free");
      else url.searchParams.delete("plan");
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }, []);
  return [plan, setPlan] as const;
}

/** Appends `?plan=free` to in-area links while the free demo state is on. */
export function withPlan(href: string, plan: DemoPlan) {
  if (plan !== "free") return href;
  return href.includes("?") ? `${href}&plan=free` : `${href}?plan=free`;
}

export function PlanDemoToggle() {
  const [plan, setPlan] = useDemoPlan();
  return (
    <div className="flex flex-col gap-3 rounded-md border border-dashed border-border-strong px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-small text-text-2">
        <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0 text-violet" />
        <span><span className="font-semibold text-text">{LP_DEMO.label}:</span> {LP_DEMO.body}</span>
      </p>
      <ToggleGroup type="single" value={plan} onValueChange={(v) => v && setPlan(v as DemoPlan)} aria-label={LP_DEMO.label} className="self-start sm:self-auto">
        <ToggleGroupItem value="starter">{LP_DEMO.starter}</ToggleGroupItem>
        <ToggleGroupItem value="free">{LP_DEMO.free}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
