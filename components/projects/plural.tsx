import * as React from "react";
import { Num } from "@/components/a11y/num";
import type { PluralForms } from "@/content/he/app-core";

const nf = new Intl.NumberFormat("he-IL");

/** Picks the Hebrew count form (one / two / other, optional zero) and fills "#" with the number. Plain string. */
export function plural(n: number, f: PluralForms): string {
  if (n === 0 && f.zero) return f.zero;
  if (n === 1) return f.one;
  if (n === 2) return f.two;
  return f.other.replaceAll("#", nf.format(n));
}

/** Same as `plural`, but the number is a bidi-isolated `Num`. */
export function Plural({ n, forms, className }: { n: number; forms: PluralForms; className?: string }) {
  const text = n === 0 && forms.zero ? forms.zero : n === 1 ? forms.one : n === 2 ? forms.two : forms.other;
  const parts = text.split("#");
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && <Num value={n} />}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Fills "{name}" slots in a template with strings or nodes (e.g. <Num />). */
export function fill(template: string, vars: Record<string, React.ReactNode>): React.ReactNode {
  const out: React.ReactNode[] = [];
  const re = /\{(\w+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(template))) {
    if (m.index > last) out.push(template.slice(last, m.index));
    out.push(<React.Fragment key={k++}>{vars[m[1]] ?? m[0]}</React.Fragment>);
    last = m.index + m[0].length;
  }
  if (last < template.length) out.push(template.slice(last));
  return out;
}

/** String-only variant of `fill`. */
export function fillText(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (all, k: string) => (k in vars ? (typeof vars[k] === "number" ? nf.format(vars[k] as number) : String(vars[k])) : all));
}

/** Numeric ranges with an en dash ("45–60") are isolated LTR so they read 45→60 inside Hebrew text. */
export function WithRanges({ text }: { text: string }) {
  const parts = text.split(/(\d[\d,.]*–\d[\d,.]*)/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <bdi key={i} dir="ltr" className="num">{p}</bdi> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </>
  );
}
