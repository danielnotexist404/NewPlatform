import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Small text helpers for the campaigns / leads / publish / plan screens.
 * Copy lives in content/he/campaigns-app.ts with {placeholders}; `fill()` swaps them for nodes
 * (Price, Num, names) so ₪ and numbers always go through the a11y components.
 */
export function fill(template: string, values: Record<string, React.ReactNode>): React.ReactNode {
  const parts = template.split(/(\{[a-zA-Z0-9_]+\})/g);
  return parts.map((part, i) => {
    const m = /^\{([a-zA-Z0-9_]+)\}$/.exec(part);
    if (m && m[1] in values) return <React.Fragment key={i}>{values[m[1]]}</React.Fragment>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/** Plain-string interpolation (aria-labels, toasts, CSV). */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (all, k: string) => (k in values ? String(values[k]) : all));
}

export type PluralForms = { one: string; two?: string; other: string };
const nf = new Intl.NumberFormat("he-IL");

/** Hebrew plural (ICU-like): "#" is replaced by the formatted number. */
export function plural(n: number, forms: PluralForms): string {
  if (n === 1) return forms.one;
  if (n === 2 && forms.two) return forms.two;
  return forms.other.replace("#", nf.format(n));
}

const TZ = "Asia/Jerusalem";
const dLong = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
const dDayMonth = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", timeZone: TZ });
const dShort = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric", year: "numeric", timeZone: TZ });
const dWeekday = new Intl.DateTimeFormat("he-IL", { weekday: "long", timeZone: TZ });
const tTime = new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });

function toDate(iso: string) {
  // Date-only strings are anchored at noon UTC so the Israeli calendar day never shifts.
  return new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
}
/** "17 באוקטובר 2026" (App E §6.2). */
export const dateLong = (iso: string) => dLong.format(toDate(iso));
/** "17 באוקטובר" */
export const dateDayMonth = (iso: string) => dDayMonth.format(toDate(iso));
/** "17.10.2026" for tables. */
export const dateShort = (iso: string) => dShort.format(toDate(iso));
/** "יום שבת" */
export const weekday = (iso: string) => dWeekday.format(toDate(iso));
/** "14:30" */
export const timeOf = (iso: string) => tTime.format(toDate(iso));
/** "9.10" — compact axis label (charts are LTR). */
export function axisDay(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(d)}.${Number(m)}`;
}

/** Percent, bidi-isolated: "12%". */
export function Pct({ value, digits = 0, className }: { value: number; digits?: number; className?: string }) {
  const v = new Intl.NumberFormat("he-IL", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  return <bdi className={cn("num", className)}>{v}%</bdi>;
}

/** Phone numbers are always LTR inside Hebrew text. */
export function Phone({ value, className }: { value: string; className?: string }) {
  return (
    <bdi dir="ltr" className={cn("num", className)}>
      {value}
    </bdi>
  );
}
