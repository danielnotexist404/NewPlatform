/**
 * Lightweight client mirror of `lib/hebrew/facts.ts#detectFactSlots` (Part 03 §6.12) for the mock wizard.
 * Rules: fact placeholders always; unresolved profile/free placeholders; numeric claims except list counts
 * (listicle/mistakes/how-to/myth-busting, ≤ 10), video length ("30 שניות") and years.
 */
export type FactSlotKind = "placeholder" | "numeric_claim";
export interface FactSlot {
  id: string;
  kind: FactSlotKind;
  token: string;
  number: string | null;
  unit: string;
  labelHe: string;
  source: "hook" | "script";
  beatIndex: number | null;
  resolvedFrom: string | null;
}

export const FACT_PLACEHOLDERS = ["מחיר", "סכום", "מספר", "זמן", "הנחה", "דירוג", "שם_לקוח", "מספר_רישיון"];
const LIST_TYPES = ["listicle", "mistakes", "how-to", "myth-busting"];

export const PLACEHOLDER_Q: Record<string, string> = {
  "עיר": "באיזו עיר העסק?", "שכונה": "באיזו שכונה או אזור?", "שירות": "איזה שירות מציגים בסרטון?", "מוצר": "איזה מוצר מציגים בסרטון?",
  "מחיר": "מה המחיר? (₪)", "סכום": "מה הסכום? (₪)", "מספר": "מה המספר?", "זמן": "כמה זמן? (למשל: 3 חודשים)", "חודש": "באיזה חודש?",
  "קהל_יעד": "למי הסרטון מיועד? (למשל: זוגות צעירים)", "שם_העסק": "מה שם העסק?", "פעולה_שגויה": "איזו טעות נפוצה עושים הלקוחות שלכם?",
  "מיתוס": "איזה מיתוס נפוץ יש בתחום שלכם?", "לפני": "איך זה נראה לפני?", "אחרי": "איך זה נראה אחרי?", "הנחה": "מה גובה ההנחה?",
  "בעיה": "איזו בעיה העסק פותר?", "דירוג": "מה הדירוג? (למשל 4.8)", "כתובת": "מה הכתובת?", "שם_לקוח": "מה השם שיופיע עם ההמלצה? (רק באישור)",
  "מספר_רישיון": "מה מספר רישיון התיווך?", "מילה": "איזו מילה יכתבו בתגובות?",
};

const NUM_RE = /(תוך |ב-|ל-|מ-)?(\d[\d,.]*)(\s?(?:אלף|מיליון))?(\s?(?:₪|%))?(\s(?:[֐-׿"״]+))?/g;

export function detectFactSlots(input: {
  text: string;
  source: "hook" | "script";
  beatIndex?: number | null;
  hookTypeSlug?: string | null;
  confirmedValues?: string[];
}): FactSlot[] {
  const out: FactSlot[] = [];
  const where = `${input.source}:${input.beatIndex ?? "hook"}`;
  for (const m of input.text.matchAll(/\{([^}]+)\}/g)) {
    const name = m[1];
    out.push({
      id: `${where}:{${name}}`, kind: "placeholder", token: `{${name}}`, number: null, unit: name === "מחיר" || name === "סכום" ? "₪" : "",
      labelHe: PLACEHOLDER_Q[name] ?? name, source: input.source, beatIndex: input.beatIndex ?? null, resolvedFrom: null,
    });
  }
  const stripped = input.text.replace(/\{[^}]+\}/g, " ");
  for (const m of stripped.matchAll(NUM_RE)) {
    const raw = m[2].replace(/[.,]$/, "");
    const n = Number(raw.replace(/,/g, ""));
    const word = (m[5] ?? "").trim();
    if (/^(שניות|שנ׳|שנייה)$/.test(word)) continue;
    if (n >= 1900 && n <= 2099 && !m[4]) continue;
    if (input.hookTypeSlug && LIST_TYPES.includes(input.hookTypeSlug) && n <= 10 && !m[4]) continue;
    if (n <= 10 && /^(מנות|דברים|טעויות|שאלות|טיפים|תרגילים|צעדים|תמונות)$/.test(word)) continue;
    const token = `${m[1] ?? ""}${raw}${m[3] ?? ""}${m[4] ?? ""}${word ? ` ${word}` : ""}`.trim();
    const resolved = input.confirmedValues?.includes(raw) ? raw : null;
    out.push({
      id: `${where}:${raw}`, kind: "numeric_claim", token, number: raw,
      unit: `${m[3] ?? ""}${m[4] ?? ""}${word ? ` ${word}` : ""}`.trim(),
      labelHe: token, source: input.source, beatIndex: input.beatIndex ?? null, resolvedFrom: resolved,
    });
  }
  return out;
}

export type FactAction = "confirmed" | "replaced" | "removed";
export interface FactAnswer { action: FactAction; value?: string }
