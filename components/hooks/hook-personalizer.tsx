"use client";
import * as React from "react";
import { ChevronDown, Lock, RotateCcw, Wand } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HOOKS_COPY, PERSONALIZER_BASE, PLACEHOLDER_EXAMPLES, PLACEHOLDER_QUESTIONS, HOOK_PLACEHOLDERS } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import { clearPersonalization, setPersonalValue, usePersonalization } from "./stores";
import { plural } from "./text";

const P = HOOKS_COPY.personalizer;

/**
 * "התאימו את ההוקים לעסק שלכם" (Part 02 §5.3): fills {placeholders} in every card on the page, live and locally.
 * `fields` = placeholders present on the page (for "עוד שדות"); `only` = show exactly these (single hook page).
 */
export function HookPersonalizer({ fields = [], only, className }: { fields?: string[]; only?: string[]; className?: string }) {
  const values = usePersonalization();
  const [open, setOpen] = React.useState(false);
  const [expandedState, setExpanded] = React.useState(false);
  const order = (list: string[]) => HOOK_PLACEHOLDERS.filter((p) => list.includes(p));
  const base: string[] = only ? order(only) : [...PERSONALIZER_BASE];
  const extra = only ? [] : order(fields).filter((f) => !base.includes(f));
  const shown = open ? [...base, ...extra] : base;
  const filledCount = Object.values(values).filter((v) => v && v.trim()).length;

  if (only && only.length === 0) return null;
  /** Collapsed to one line by default on library pages (clean redesign); always open on a single hook page or once filled. */
  const expanded = !!only || expandedState || filledCount > 0;

  return (
    <section
      aria-labelledby="personalizer-title"
      className={cn("relative overflow-hidden rounded-[24px] bg-surface-1 p-5 ring-hairline md:p-6", className)}
    >
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="personalizer-fields"
          disabled={!!only}
          onClick={() => setExpanded((e) => !e)}
          className="flex flex-1 items-center gap-3 text-start disabled:cursor-default"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text">
            <Wand className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col">
            <h2 id="personalizer-title" className="text-body-lg font-bold">{P.title}</h2>
            {expanded && <span className="text-small text-text-2">{P.sub}</span>}
          </span>
          {!only && <ChevronDown className={cn("ms-auto size-5 text-muted transition-transform", expanded && "rotate-180")} aria-hidden />}
        </button>
        {expanded && <p className="num text-micro text-muted" aria-live="polite">{plural(filledCount, P.filled)}</p>}
      </div>
      {expanded && (
      <div id="personalizer-fields">

      <div className={cn("relative mt-4 grid gap-3", shown.length > 1 && "md:grid-cols-3")}>
        {shown.map((name) => {
          const id = `pz-${name}`;
          return (
            <div key={name} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-sm font-semibold text-text">
                {PLACEHOLDER_QUESTIONS[name] ?? name}
              </label>
              <Input
                id={id}
                value={values[name] ?? ""}
                onChange={(e) => setPersonalValue(name, e.target.value)}
                placeholder={PLACEHOLDER_EXAMPLES[name]}
                autoComplete="off"
                maxLength={80}
              />
            </div>
          );
        })}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {extra.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-text hover:underline"
          >
            {open ? P.less : `${P.more} (${extra.length})`}
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        )}
        <p className="inline-flex items-center gap-1.5 text-micro font-normal text-muted">
          <Lock className="size-3.5" aria-hidden />
          {P.privacy}
        </p>
        <Button variant="ghost" size="sm" className="ms-auto" onClick={clearPersonalization} disabled={filledCount === 0}>
          <RotateCcw aria-hidden />
          {P.clear}
        </Button>
      </div>
      </div>
      )}
    </section>
  );
}
