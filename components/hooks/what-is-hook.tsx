"use client";
import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";

const MQ = "(min-width: 48rem)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/** "מה זה הוק?" — open on desktop, closed on mobile (Part 02 §5.5 item 5). */
export function WhatIsHook({ className }: { className?: string }) {
  const desktop = React.useSyncExternalStore(subscribe, () => window.matchMedia(MQ).matches, () => true);
  const [userOpen, setUserOpen] = React.useState<boolean | null>(null);
  const open = userOpen ?? desktop;
  const W = HOOKS_COPY.hub.whatIs;
  return (
    <details
      open={open}
      onToggle={(e) => {
        const o = (e.currentTarget as HTMLDetailsElement).open;
        if (o !== open) setUserOpen(o);
      }}
      className={cn("group h-fit rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-h3 [&::-webkit-details-marker]:hidden">
        {W.summary}
        <Plus className="size-5 text-muted transition-transform group-open:rotate-45" aria-hidden />
      </summary>
      <div className="mt-4 text-text-2">
        <p>{W.body}</p>
        <Link href="/hooks/types" className="mt-4 inline-flex items-center gap-1 font-semibold text-primary-text hover:underline">
          {W.link} <DirIcon name="forward" />
        </Link>
      </div>
    </details>
  );
}
