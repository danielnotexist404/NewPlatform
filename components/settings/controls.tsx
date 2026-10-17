"use client";
import * as React from "react";
import { Checkbox as Cb, RadioGroup as RG } from "radix-ui";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { accountCommon } from "@/content/he/account";
import { cn } from "@/lib/utils";

/* ---------------- Checkbox (never pre-checked for consents) ---------------- */
export function Checkbox({
  id, checked, onCheckedChange, disabled, children, describedBy, className, invalid,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  describedBy?: string;
  className?: string;
  invalid?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-60", className)}>
      <Cb.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border border-border-strong bg-surface-2 transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary aria-[invalid=true]:border-danger"
      >
        <Cb.Indicator>
          <Check className="size-3.5 text-on-primary" strokeWidth={3} aria-hidden />
        </Cb.Indicator>
      </Cb.Root>
      <label htmlFor={id} className="cursor-pointer text-small leading-relaxed text-text">
        {children}
      </label>
    </div>
  );
}

/* ---------------- Radio cards ---------------- */
export interface RadioOption<V extends string> {
  value: V;
  label: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  extra?: React.ReactNode;
}

export function RadioCards<V extends string>({
  value, onValueChange, options, label, labelId, columns = 3, className, size = "md", name,
}: {
  value: V | "";
  onValueChange: (v: V) => void;
  options: RadioOption<V>[];
  label?: string;
  labelId?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  size?: "sm" | "md";
  name?: string;
}) {
  const cols = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <RG.Root
      value={value}
      onValueChange={(v) => onValueChange(v as V)}
      aria-label={labelId ? undefined : label}
      aria-labelledby={labelId}
      name={name}
      className={cn("grid gap-2.5", cols, className)}
    >
      {options.map((o) => (
        <RG.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            "group relative flex flex-col items-start gap-1 rounded-md bg-surface-2 text-start shadow-[inset_0_0_0_1px_var(--color-border-strong)] transition-[box-shadow,background-color] hover:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-55",
            "data-[state=checked]:bg-surface-3 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--color-primary-text)]",
            size === "sm" ? "px-3 py-2.5" : "px-4 py-3.5",
          )}
        >
          <span className="flex w-full items-center justify-between gap-2">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong group-data-[state=checked]:border-primary-text">
                <span className="size-2 scale-0 rounded-full bg-primary-text transition-transform group-data-[state=checked]:scale-100" />
              </span>
              <span className={cn("font-semibold", size === "sm" ? "text-sm" : "text-body")}>{o.label}</span>
            </span>
            {o.badge}
          </span>
          {o.description && <span className="ps-6.5 text-small text-text-2">{o.description}</span>}
          {o.extra && <span className="w-full ps-6.5">{o.extra}</span>}
        </RG.Item>
      ))}
    </RG.Root>
  );
}

/* ---------------- Native select ---------------- */
export function NativeSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="h-11 w-full appearance-none rounded-sm border border-border-strong bg-surface-2 ps-3.5 pe-10 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-text-2" />
    </div>
  );
}

/* ---------------- Filter chips (single select) ---------------- */
export function FilterChips<V extends string>({
  value, onChange, options, label, className,
}: {
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: React.ReactNode; count?: number }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors",
              on ? "bg-text text-bg" : "bg-surface-2 text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)] hover:bg-surface-3 hover:text-text",
            )}
          >
            {o.label}
            {o.count !== undefined && <bdi className={cn("num text-micro", on ? "text-bg/70" : "text-muted")}>{o.count}</bdi>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Autosave indicator ---------------- */
export type SaveState = "idle" | "saving" | "saved";

export function useAutosave(delay = 800) {
  const [state, setState] = React.useState<SaveState>("idle");
  const t = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const touch = React.useCallback(() => {
    if (t.current) clearTimeout(t.current);
    if (t2.current) clearTimeout(t2.current);
    setState("saving");
    t.current = setTimeout(() => {
      setState("saved");
      t2.current = setTimeout(() => setState("idle"), 2400);
    }, delay);
  }, [delay]);
  React.useEffect(() => () => {
    if (t.current) clearTimeout(t.current);
    if (t2.current) clearTimeout(t2.current);
  }, []);
  return { state, touch };
}

export function SavedIndicator({ state, className, idleText }: { state: SaveState; className?: string; idleText?: string }) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex min-h-6 items-center gap-1.5 text-small text-text-2", className)}>
      {state === "saving" && (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          {accountCommon.saving}
        </>
      )}
      {state === "saved" && (
        <>
          <Check className="size-3.5 text-success" aria-hidden />
          {accountCommon.saved}
        </>
      )}
      {state === "idle" && idleText}
    </span>
  );
}

/** Character counter under a text field. */
export function CharCount({ value, max, id }: { value: string; max: number; id?: string }) {
  const over = value.length > max;
  return (
    <span id={id} className={cn("text-micro font-normal", over ? "text-danger" : "text-muted")}>
      <bdi className="num">{value.length}</bdi>/<bdi className="num">{max}</bdi>
    </span>
  );
}
