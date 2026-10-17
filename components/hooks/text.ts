/**
 * Hebrew text helpers for the hooks library: plurals, search normalization, list joining and
 * placeholder filling with prefix grammar (Part 02 §5.3; Appendix F §7.4).
 * Pure functions — safe on the server and the client.
 */
import type { PluralForms } from "@/content/he/hooks";

const nf = new Intl.NumberFormat("he-IL");

export function plural(n: number, forms: PluralForms): string {
  const f = n === 0 && forms.zero ? forms.zero : n === 1 ? forms.one : n === 2 ? forms.two : forms.other;
  return f.replace("#", nf.format(n));
}

const HEBREW_LETTER = /[א-ת]/;
const NIQQUD = /[֑-ׇ]/g;

/** Search normalization: no niqqud, ״→", ׳→', collapsed spaces, lower case (Part 02 §5.1). */
export function normalize(s: string): string {
  return s
    .replace(NIQQUD, "")
    .replace(/[״“”]/g, '"')
    .replace(/[׳‘’]/g, "'")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** "א, ב וג" — the conjunction ו attaches to a Hebrew word; otherwise a comma is used. */
export function joinHe(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  const last = items[items.length - 1];
  const head = items.slice(0, -1).join(", ");
  return HEBREW_LETTER.test(last.charAt(0)) ? `${head} ו${last}` : `${head}, ${last}`;
}

/** Human label for a placeholder name: "שם_העסק" → "שם העסק". */
export const placeholderLabel = (name: string) => name.replace(/_/g, " ");

/** Placeholders whose value is a place name, where "ב" + "השרון" → "בשרון" (article ה is absorbed). */
const PLACE_PLACEHOLDERS = new Set(["עיר", "שכונה"]);
/** Place names that start with ה that is part of the name, not the article. */
const H_NOT_ARTICLE = ["הרצליה", "הוד השרון", "הוד ", "הר ", "הדר", "הודיה", "הושעיה", "הראל"];
const PREFIX_LETTERS = "ובלמשהכ";

/** Attach Hebrew prefix letters to a runtime value. */
export function attachPrefix(prefix: string, value: string, placeholder: string): string {
  if (!prefix) return value;
  const v = value.trim();
  if (!v) return prefix;
  if (!HEBREW_LETTER.test(v.charAt(0))) return `${prefix}-${v}`;
  const absorbs = /[בלכ]$/.test(prefix);
  if (absorbs && PLACE_PLACEHOLDERS.has(placeholder) && v.startsWith("ה") && !H_NOT_ARTICLE.some((x) => v === x.trim() || v.startsWith(x))) {
    return `${prefix}${v.slice(1)}`;
  }
  return `${prefix}${v}`;
}

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "ph"; name: string; prefix: string };

/** Splits "גרים ב{עיר}?" into text and placeholder segments; prefix letters glued to a placeholder move into it. */
export function segments(text: string): Segment[] {
  const out: Segment[] = [];
  const re = /\{([^{}]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let before = text.slice(last, m.index);
    let prefix = "";
    // Trailing prefix letters (1–3) directly before "{", not part of a longer word.
    const tail = /([א-ת]{1,3})$/.exec(before);
    if (tail) {
      const run = tail[1];
      const charBefore = before.charAt(before.length - run.length - 1);
      const isWordStart = !charBefore || !HEBREW_LETTER.test(charBefore);
      if (isWordStart && [...run].every((c) => PREFIX_LETTERS.includes(c))) {
        prefix = run;
        before = before.slice(0, -run.length);
      }
    }
    if (before) out.push({ kind: "text", text: before });
    out.push({ kind: "ph", name: m[1], prefix });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

export type Values = Partial<Record<string, string>>;

/** Fills {placeholders}; unfilled ones stay in braces ("ב{עיר}"), as the copy action requires (Part 02 §5.4). */
export function fillText(text: string, values: Values): { text: string; missing: string[] } {
  const missing: string[] = [];
  const parts = segments(text).map((s) => {
    if (s.kind === "text") return s.text;
    const v = values[s.name]?.trim();
    if (!v) {
      if (!missing.includes(s.name)) missing.push(s.name);
      return `${s.prefix}{${s.name}}`;
    }
    return attachPrefix(s.prefix, v, s.name);
  });
  return { text: parts.join(""), missing };
}

/** Wraps Latin words and numbers in <bdi> runs (rendering helper data). */
export function bidiRuns(text: string): { text: string; isolate: boolean }[] {
  const out: { text: string; isolate: boolean }[] = [];
  const re = /[A-Za-z0-9][A-Za-z0-9.,%:+/]*[A-Za-z0-9%]|[A-Za-z0-9]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), isolate: false });
    out.push({ text: m[0], isolate: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), isolate: false });
  return out;
}

export const wordCount = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** Stable small hash for deterministic ordering without Math.random (cacheComponents). */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** "2026-10-17" in Israel time. Call only on the client or inside "use cache". */
export function todayIL(d: Date = new Date()): string {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  return p; // en-CA formats as YYYY-MM-DD
}

const dayMs = 86_400_000;
export const isoToUtc = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
export const daysBetween = (fromIso: string, toIso: string) => Math.round((isoToUtc(toIso) - isoToUtc(fromIso)) / dayMs);

/** "27 בנובמבר" */
export function shortDateHe(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(isoToUtc(iso)));
}
/** "יום ו׳, 17 באוקטובר" */
export function weekdayDateHe(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(isoToUtc(iso)));
}
