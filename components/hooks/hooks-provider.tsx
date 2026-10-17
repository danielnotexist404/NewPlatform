"use client";
import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { HOOKS_COPY } from "@/content/he/hooks";
import { PLANS } from "@/lib/data/plans";
import { cn } from "@/lib/utils";

export type GateKind = "create" | "variations" | "save" | "generate" | "score";

const TRIAL = PLANS.find((p) => p.id === "free")?.oneTimeCredits ?? 70;

type GateFn = (kind: GateKind, href: string) => void;
const GateContext = React.createContext<GateFn | null>(null);

/**
 * One SignupGateDialog per page (Part 02 §5.4): actions that need an account open it,
 * and the primary button continues to /login?next=… with the chosen hook.
 */
export function HooksProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<{ kind: GateKind; href: string } | null>(null);
  const open = React.useCallback<GateFn>((kind, href) => setState({ kind, href }), []);
  const copy = state ? HOOKS_COPY.gate[state.kind] : null;
  return (
    <GateContext.Provider value={open}>
      {children}
      <Dialog open={!!state} onOpenChange={(o) => !o && setState(null)}>
        {state && copy && (
          <DialogContent
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              document.getElementById("gate-primary")?.focus();
            }}
          >
            <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary-text">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.body(TRIAL)}</DialogDescription>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link id="gate-primary" href={state.href} className={cn(buttonVariants({ size: "lg" }), "sm:flex-1")}>
                {copy.primary}
              </Link>
              <DialogClose className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>{HOOKS_COPY.gate.later}</DialogClose>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </GateContext.Provider>
  );
}

/** Opens the gate; without a provider it navigates straight to the target. */
export function useGate(): GateFn {
  const ctx = React.useContext(GateContext);
  return React.useCallback<GateFn>(
    (kind, href) => {
      if (ctx) ctx(kind, href);
      else window.location.assign(href);
    },
    [ctx],
  );
}
