"use client";
import * as React from "react";
import Link from "next/link";
import { Check, Copy, Wand2 } from "lucide-react";
import { NicheIcon } from "./niche-icon";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.hookCard;

export interface HookCardData {
  id: string;
  text: string;
  typeName: string;
  nicheLabel?: string | null;
  nicheIcon?: string | null;
  visual?: string | null;
}

let announceTimer: number | undefined;
function announce(msg: string) {
  const el = document.getElementById("landing-live");
  if (!el) return;
  el.textContent = "";
  window.clearTimeout(announceTimer);
  announceTimer = window.setTimeout(() => (el.textContent = msg), 50);
}

/** HookCard, `compact` variant (Part 01 §10.15): lemon type chip, niche chip, text, copy (+ optional "צרו סרטון מההוק"). */
export function HookCard({
  hook, createHref, showVisual = false, className, tabbable = true,
}: {
  hook: HookCardData;
  createHref?: string;
  showVisual?: boolean;
  className?: string;
  tabbable?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.text);
    } catch {
      /* clipboard may be blocked; still give feedback */
    }
    setCopied(true);
    announce(T.copiedAnnounce);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const tab = tabbable ? undefined : -1;
  return (
    <article className={cn("flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{hook.typeName}</span>
        {hook.nicheLabel !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
            {hook.nicheIcon && <NicheIcon name={hook.nicheIcon} className="size-3.5" />}
            {hook.nicheLabel ?? T.universal}
          </span>
        )}
      </div>
      <blockquote dir="rtl" className="text-lg font-bold leading-snug text-text">
        <HookText text={hook.text} />
      </blockquote>
      {showVisual && hook.visual && (
        <p className="text-small text-text-2">
          <span className="font-semibold text-text">{T.firstSeconds}: </span>
          {hook.visual}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          tabIndex={tab}
          onClick={onCopy}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 text-sm font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-border-strong)] hover:bg-surface-3"
        >
          {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? T.copied : T.copy}
        </button>
        {createHref && (
          <Link
            href={createHref}
            tabIndex={tab}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-primary-text hover:bg-surface-2"
          >
            <Wand2 className="size-4" aria-hidden />
            {T.create}
          </Link>
        )}
      </div>
    </article>
  );
}

/** Unfilled {placeholders} render as lemon marker chips with the field name (Part 01 §10.15). */
export function HookText({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("{") && p.endsWith("}") ? (
          <span key={i} className="mx-0.5 rounded-xs bg-lemon px-1.5 text-[0.85em] font-semibold text-on-primary">
            {p.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}

/** One polite live region for the whole landing page (copy confirmations, filter counts). */
export function LiveRegion() {
  return <p id="landing-live" className="sr-only" aria-live="polite" />;
}
