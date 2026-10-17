import * as React from "react";
import { Check, Loader2, TriangleAlert, Circle } from "lucide-react";
import { connect as C } from "@/content/he/campaigns-app";
import { cn } from "@/lib/utils";

export type CheckState = "idle" | "checking" | "ok" | "warn";

/** MetaConnectChecklist (spec §L.3): the green checklist before the first campaign. */
export function MetaConnectChecklist({
  states,
  showFixes = true,
  className,
}: {
  states?: Partial<Record<(typeof C.checklist)[number]["key"], CheckState>>;
  showFixes?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {C.checklist.map((item) => {
        const st = states?.[item.key] ?? "idle";
        return (
          <li key={item.key} className="flex items-start gap-3 rounded-sm bg-surface-2 px-3 py-2.5">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                st === "ok" && "bg-success text-bg",
                st === "warn" && "bg-primary text-on-primary",
                (st === "idle" || st === "checking") && "bg-surface-3 text-text-2",
              )}
              aria-hidden
            >
              {st === "ok" ? <Check className="size-3.5" strokeWidth={3} /> : st === "warn" ? <TriangleAlert className="size-3" /> : st === "checking" ? <Loader2 className="size-3.5 animate-spin" /> : <Circle className="size-2.5" />}
            </span>
            <div className="min-w-0">
              <p className="text-small font-semibold text-text">
                {item.label}
                <span className="sr-only">
                  {" "}
                  {st === "ok" ? C.flow.passed : st === "warn" ? C.flow.warn : st === "checking" ? C.flow.checking : ""}
                </span>
              </p>
              {showFixes && (st === "idle" || st === "warn") && <p className="text-micro font-normal text-muted">{item.fix}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
