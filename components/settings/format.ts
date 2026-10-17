/**
 * Formatting helpers for the account screens (Part 01 §2.5 rules), pure and deterministic:
 * no `new Date()` / `Date.now()`, so they are safe in prerendered Server Components.
 * When `lib/format/` lands, these become thin re-exports of it.
 */

const nf = new Intl.NumberFormat("he-IL");
const nf2 = new Intl.NumberFormat("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const MONTHS_HE = [
  "בינואר", "בפברואר", "במרץ", "באפריל", "במאי", "ביוני",
  "ביולי", "באוגוסט", "בספטמבר", "באוקטובר", "בנובמבר", "בדצמבר",
] as const;

export function formatInt(n: number): string {
  return nf.format(n);
}

/** "₪119" / "₪95.50" — the shekel sign always before the number; U+2212 for negatives. */
export function formatIls(amount: number, agorot: "auto" | "always" = "auto"): string {
  const abs = Math.abs(amount);
  const whole = Math.round(abs * 100) % 100 === 0;
  const text = agorot === "always" || !whole ? nf2.format(abs) : nf.format(abs);
  return `${amount < 0 ? "−" : ""}₪${text}`;
}

/** "+70" / "−50" (typographic minus). */
export function formatSigned(n: number): string {
  if (n === 0) return "0";
  return `${n > 0 ? "+" : "−"}${nf.format(Math.abs(n))}`;
}

function parts(iso: string) {
  const [d] = iso.split("T");
  const [y, m, day] = d.split("-").map(Number);
  return { y, m, day };
}

/** "13 באוקטובר 2026" (long) · "13.10.2026" (numeric) · "13 באוקטובר" (dayMonth). */
export function formatDateHe(iso: string, style: "long" | "numeric" | "dayMonth" = "long"): string {
  const { y, m, day } = parts(iso);
  if (style === "numeric") return `${day}.${m}.${y}`;
  if (style === "dayMonth") return `${day} ${MONTHS_HE[m - 1]}`;
  return `${day} ${MONTHS_HE[m - 1]} ${y}`;
}

/** "13 באוקטובר 2026, 14:30" */
export function formatDateTimeHe(iso: string): string {
  const time = iso.split("T")[1]?.slice(0, 5);
  return time ? `${formatDateHe(iso)}, ${time}` : formatDateHe(iso);
}

/** Hebrew ICU-like plural: {one, two, other} with "#" replaced by the formatted number. */
export function plural(n: number, forms: { zero?: string; one: string; two?: string; other: string }): string {
  if (n === 0 && forms.zero) return forms.zero;
  if (n === 1) return forms.one;
  if (n === 2 && forms.two) return forms.two;
  return forms.other.replace("#", nf.format(n));
}

export const creditsText = (n: number) =>
  plural(n, { one: "קרדיט אחד", two: "שני קרדיטים", other: "# קרדיטים" });

/** 30 -> "0:30", 75 -> "1:15" */
export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${nf.format(Math.max(1, Math.round(bytes / 1024)))}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${new Intl.NumberFormat("he-IL", { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))}MB`;
  return `${new Intl.NumberFormat("he-IL", { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024 * 1024))}GB`;
}

/** Fill "{var}" placeholders in a copy string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type GenderForm = "plural" | "female" | "male";
export type Gendered = { plural: string; female: string; male: string };
export const g = (form: GenderForm, s: Gendered) => s[form];

/** Israeli ID / company number check digit (9 digits, Luhn-like). */
export function isValidIsraeliId(raw: string): boolean {
  const v = raw.replace(/\D/g, "");
  if (v.length < 5 || v.length > 9) return false;
  const id = v.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let d = Number(id[i]) * ((i % 2) + 1);
    if (d > 9) d -= 9;
    sum += d;
  }
  return sum % 10 === 0;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
export const isHex = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s.trim());

/** WCAG relative-luminance contrast between two #RRGGBB colors. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  if (!isHex(a) || !isHex(b)) return 21;
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
