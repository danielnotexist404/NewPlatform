"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Copy, Magnet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { APP_CORE } from "@/content/he/app-core";
import { PLATFORM_LABEL } from "@/lib/labels";
import type { Hook } from "@/lib/data/seed";

const H = APP_CORE.dashboard.hookOfWeek;

/** Part 03 §5.4 — personalized with the business city/service; deterministic per Israeli week. */
export function HookOfWeek({ hook, text, typeName, nicheShort }: { hook: Hook; text: string; typeName: string; nicheShort: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; still confirm visually */
    }
    setCopied(true);
    toast.success(H.toast);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section aria-labelledby="how-title" className="relative isolate overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
      <div aria-hidden className="absolute -bottom-24 -inset-s-10 -z-10 size-64 rounded-full bg-lemon/10 blur-3xl" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="how-title" className="flex items-center gap-2 text-body-lg font-bold">
          <Magnet className="size-5 text-primary-text" aria-hidden />
          {H.title} · {nicheShort}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{typeName}</span>
          {hook.platforms.slice(0, 3).map((p) => (
            <span key={p} className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{PLATFORM_LABEL[p]}</span>
          ))}
        </div>
      </div>
      <blockquote dir="rtl" className="mt-4 text-h3 font-bold leading-snug [text-wrap:balance]">
        &quot;{text}&quot;
      </blockquote>
      <p className="mt-2 text-small text-text-2">
        <span className="font-semibold text-text">{APP_CORE.wizard.hook.firstSeconds}: </span>
        {hook.visual_direction_he}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link href={`/app/create?hook=${hook.id}&src=dashboard`}>{H.create}</Link>
        </Button>
        <Button variant="secondary" onClick={copy} aria-live="polite">
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? H.copied : H.copy}
        </Button>
        <Link href={`/app/hooks?niche=${hook.niche_slug ?? ""}`} className="ms-auto inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
          {H.more}
          <DirIcon name="next" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
