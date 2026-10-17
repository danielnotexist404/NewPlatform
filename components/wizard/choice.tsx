"use client";
import * as React from "react";
import Link from "next/link";
import { RadioGroup as RG } from "radix-ui";
import { Check, Lock } from "lucide-react";
import { APP_CORE } from "@/content/he/app-core";
import { cn } from "@/lib/utils";

/** Step title; receives focus on every step change (Part 03 §6.0). */
export function StepHeading({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 id="wizard-step-title" tabIndex={-1} className="text-h2 outline-none">{title}</h1>
      {subtitle && <p className="max-w-[60ch] text-body text-text-2">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Group({ label, help, children, className, id }: { label: string; help?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <fieldset className={cn("flex min-w-0 flex-col gap-3", className)} id={id}>
      <legend className="mb-3 text-body font-bold">{label}</legend>
      {children}
      {help && <p className="text-small text-muted">{help}</p>}
    </fieldset>
  );
}

export function LockedNote({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-micro font-normal text-text-2", className)}>
      <Lock className="mt-0.5 size-3.5 shrink-0 text-primary-text" aria-hidden />
      <span>
        {text}{" "}
        <Link href="/app/billing/plans" className="font-semibold text-link underline underline-offset-2">{APP_CORE.wizard.style.comparePlans}</Link>
      </span>
    </p>
  );
}

export function DeltaChip({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <bdi dir="ltr" className={cn("num rounded-xs px-1.5 py-0.5 text-micro", n > 0 ? "bg-surface-3 text-text-2" : "bg-success/15 text-success")}>
      {n > 0 ? "+" : "−"}{Math.abs(n)}
    </bdi>
  );
}

export interface RadioCardItem {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  badge?: React.ReactNode;
  aside?: React.ReactNode;
  locked?: string;
  disabled?: boolean;
}

export function RadioCards({
  value,
  onValueChange,
  items,
  columns = "sm:grid-cols-2",
  label,
  size = "md",
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  items: RadioCardItem[];
  columns?: string;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <RG.Root value={value} onValueChange={onValueChange} aria-label={label} className={cn("grid gap-3", columns, className)}>
      {items.map((it) => {
        const disabled = it.disabled || !!it.locked;
        return (
          <RG.Item
            key={it.value}
            value={it.value}
            disabled={disabled}
            className={cn(
              "group relative flex flex-col gap-2 rounded-md bg-surface-1 text-start shadow-[inset_0_0_0_1px_var(--color-border)] transition-[box-shadow,background-color] hover:bg-surface-2",
              size === "sm" ? "p-3" : "p-4",
              "data-[state=checked]:bg-surface-2 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--color-primary)]",
              disabled && "cursor-not-allowed opacity-70 hover:bg-surface-1",
            )}
          >
            {it.media}
            <span className="flex items-start justify-between gap-2">
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 font-bold">
                  {it.locked && <Lock className="size-3.5 text-primary-text" aria-hidden />}
                  {it.title}
                  {it.badge}
                </span>
                {it.description && <span className="text-small font-normal text-text-2">{it.description}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {it.aside}
                <span className="flex size-5 items-center justify-center rounded-full border border-border-strong group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary">
                  <RG.Indicator><Check className="size-3.5 text-on-primary" aria-hidden /></RG.Indicator>
                </span>
              </span>
            </span>
            {it.locked && <span className="text-micro font-normal text-text-2">{it.locked}</span>}
          </RG.Item>
        );
      })}
    </RG.Root>
  );
}

export function ChipRadio({ value, onValueChange, items, label, className }: {
  value: string; onValueChange: (v: string) => void; label: string; className?: string;
  items: { value: string; label: React.ReactNode; badge?: React.ReactNode; locked?: boolean }[];
}) {
  return (
    <RG.Root value={value} onValueChange={onValueChange} aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {items.map((it) => (
        <RG.Item
          key={it.value}
          value={it.value}
          disabled={it.locked}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface-2 px-4 text-sm font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-primary data-[state=checked]:text-on-primary data-[state=checked]:shadow-none"
        >
          {it.locked && <Lock className="size-3.5" aria-hidden />}
          {it.label}
          {it.badge}
        </RG.Item>
      ))}
    </RG.Root>
  );
}

export function ChipToggle({ pressed, onPressedChange, children, className, disabled }: {
  pressed: boolean; onPressedChange: (p: boolean) => void; children: React.ReactNode; className?: string; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors disabled:opacity-60",
        pressed ? "bg-primary/15 text-primary-text shadow-[inset_0_0_0_1px_var(--color-primary)]" : "bg-surface-2 text-text-2 hover:text-text",
        className,
      )}
    >
      {pressed && <Check className="size-3.5" aria-hidden />}
      {children}
    </button>
  );
}

export function Panel({ children, className, tone = "default" }: { children: React.ReactNode; className?: string; tone?: "default" | "ai" | "warn" | "gold" }) {
  return (
    <div
      className={cn(
        "rounded-lg p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]",
        tone === "default" && "bg-surface-1",
        tone === "ai" && "bg-violet/[.07] glow-ai",
        tone === "warn" && "bg-lemon/[.07] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_40%,transparent)]",
        tone === "gold" && "bg-primary/[.07] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
