/**
 * Deterministic demo script (no API key, or the AI call failed). Same input → same output.
 * Built only from what the user gave us (hook, niche, business, city): no numbers or claims are invented.
 * Client-safe, so the preview step can show the same draft before anything is generated.
 */
import type { GeneratedScene, ScriptRequest } from "./types";

const GOAL_BEAT: Record<string, { onscreen: string; vo: string }> = {
  leads: { onscreen: "שאלה? תשובה אישית", vo: "שולחים לנו הודעה, ומקבלים תשובה אישית מאיתנו." },
  sales: { onscreen: "זה הזמן להזמין", vo: "רוצים ליהנות מזה כבר השבוע? זה בדיוק הזמן." },
  awareness: { onscreen: "שווה להכיר", vo: "ואם עוד לא הכרתם אותנו, זה הזמן להכיר." },
  trust: { onscreen: "יחס אישי, כל פעם", vo: "אנחנו כאן בשבילכם, עם יחס אישי בכל פעם מחדש." },
  engagement: { onscreen: "ספרו לנו בתגובות", vo: "ומה אתם הייתם בוחרים? ספרו לנו בתגובות." },
};

/** First sentence, at most 8 words: on-screen text for the hook scene. */
export function shortOnscreen(text: string): string {
  const first = text.split(/(?<=[.?!])\s/)[0] ?? text;
  const words = first.trim().split(/\s+/);
  return words.length > 8 ? words.slice(0, 8).join(" ") : first.trim();
}

const inCity = (city?: string) => (city ? `ב${city.startsWith("ה") ? city.slice(1) : city}` : "");

export function mockScript(req: ScriptRequest): GeneratedScene[] {
  const biz = req.businessName?.trim() || "";
  const where = inCity(req.city?.trim());
  const subject = req.nicheEn?.trim() || "a small local business";
  const look =
    req.style === "ugc" ? "handheld smartphone footage, natural light, authentic"
    : req.style === "text_motion" ? "clean minimal background, soft gradient light, lots of negative space"
    : "cinematic, shallow depth of field, warm light";
  const goal = GOAL_BEAT[req.goal] ?? GOAL_BEAT.leads;

  const beats: Omit<GeneratedScene, "duration_sec">[] = [
    { onscreen_text_he: shortOnscreen(req.hookText), vo_he: req.hookText, visual_prompt_en: `Vertical close-up that stops the scroll: ${subject}, dramatic first moment, ${look}` },
    {
      onscreen_text_he: "ככה זה נראה אצלנו",
      vo_he: biz ? `ב${biz}${where ? ` ${where}` : ""} עושים את זה קצת אחרת.` : `אצלנו${where ? ` ${where}` : ""} עושים את זה קצת אחרת.`,
      visual_prompt_en: `Wide establishing shot of ${subject}, inviting atmosphere, ${look}`,
    },
    { onscreen_text_he: "בלי קיצורי דרך", vo_he: "כל פרט נעשה בקפידה, בדיוק כמו שהייתם רוצים.", visual_prompt_en: `Detail shot of skilled hands at work in ${subject}, ${look}` },
    { onscreen_text_he: goal.onscreen, vo_he: goal.vo, visual_prompt_en: `Happy customers enjoying ${subject}, candid moment, ${look}` },
    { onscreen_text_he: "", vo_he: `${where ? `${where}? ` : ""}שלחו לנו הודעה בוואטסאפ, ונחזור אליכם.`, visual_prompt_en: `Storefront of ${subject} at golden hour, welcoming entrance, ${look}` },
  ];
  if (req.durationSec >= 40) {
    beats.splice(3, 0, { onscreen_text_he: "מאחורי הקלעים", vo_he: "רגע מאחורי הקלעים, כדי שתראו איך זה באמת נעשה.", visual_prompt_en: `Behind the scenes at ${subject}, team preparing, ${look}` });
  } else if (req.durationSec <= 15) {
    beats.splice(2, 1);
  }
  return withDurations(beats, req.durationSec);
}

/** Hook 3 s, CTA 4 s, the rest split evenly (rounded to 0.5 s) so the total matches the requested length. */
export function withDurations(beats: Omit<GeneratedScene, "duration_sec">[], total: number): GeneratedScene[] {
  const n = beats.length;
  const hook = Math.min(3, total / n);
  const cta = Math.min(4, total / n);
  const middle = n > 2 ? Math.max(1, (total - hook - cta) / (n - 2)) : total / n;
  const out = beats.map((b, i) => ({ ...b, duration_sec: i === 0 ? hook : i === n - 1 ? cta : Math.round(middle * 2) / 2 }));
  const diff = total - out.reduce((a, s) => a + s.duration_sec, 0);
  if (n > 2) out[n - 2].duration_sec = Math.max(1, out[n - 2].duration_sec + diff);
  return out;
}

/** Scales AI scene lengths so they add up to the requested duration (each scene 1.5–15 s). */
export function normalizeDurations(scenes: GeneratedScene[], total: number): GeneratedScene[] {
  const sum = scenes.reduce((a, s) => a + Math.max(0.5, s.duration_sec), 0) || 1;
  return scenes.map((s) => ({ ...s, duration_sec: Math.min(15, Math.max(1.5, Math.round(((Math.max(0.5, s.duration_sec) * total) / sum) * 2) / 2)) }));
}
