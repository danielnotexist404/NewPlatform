"use client";
import * as React from "react";
import { CircleAlert, Zap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Num } from "@/components/a11y/num";
import { Plural, plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import type { EstimateLine } from "./estimate";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard.preview;

/** Credits before every generation (Part 01 §10.8), with a breakdown popover. */
export function CostBadge({
  credits,
  lines,
  approximate,
  balance,
  size = "chip",
  className,
}: {
  credits: number;
  lines?: EstimateLine[];
  approximate?: boolean;
  balance?: number;
  size?: "chip" | "lg";
  className?: string;
}) {
  const insufficient = balance != null && balance < credits;
  const label = `${approximate ? "≈ " : ""}${plural(credits, APP_CORE.counts.credits)}`;
  const body = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "lg" ? "bg-primary/12 px-4 py-2 text-h3 text-primary-text" : "bg-surface-2 px-3 py-1 text-small shadow-[inset_0_0_0_1px_var(--color-frame)]",
        insufficient && "text-rose",
        className,
      )}
    >
      {insufficient ? <CircleAlert className="size-4" aria-hidden /> : <Zap className={cn(size === "lg" ? "size-5" : "size-3.5", "text-primary-text")} aria-hidden />}
      {approximate && <span aria-hidden>≈</span>}
      <Plural n={credits} forms={APP_CORE.counts.credits} />
      {insufficient && (
        <span className="text-small"> · <Plural n={credits - (balance ?? 0)} forms={APP_CORE.counts.missing} /></span>
      )}
    </span>
  );
  if (!lines?.length) return <span aria-label={`עלות: ${label}`}>{body}</span>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="rounded-full" aria-label={`עלות: ${label}. ${W.breakdown}`}>
          {body}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <p className="mb-2 text-small font-bold">{W.breakdown}</p>
        <table className="w-full text-small">
          <tbody>
            {lines.map((l) => (
              <tr key={l.key} className="border-b border-border last:border-0">
                <td className="py-1.5 pe-2 text-text-2">{l.label}</td>
                <td className="py-1.5 pe-2 text-end text-muted"><span aria-hidden>×</span><Num value={l.units} /></td>
                <td className="py-1.5 text-end font-semibold"><Num value={l.credits} /></td>
              </tr>
            ))}
            <tr>
              <td className="pt-2 font-bold" colSpan={2}>{W.total}</td>
              <td className="pt-2 text-end font-bold text-primary-text"><Num value={credits} /></td>
            </tr>
          </tbody>
        </table>
      </PopoverContent>
    </Popover>
  );
}
