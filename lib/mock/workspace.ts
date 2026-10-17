/**
 * SAMPLE workspace data ("דוגמה") for the app core until Supabase is connected.
 * The business is the fictional grill bar from Appendix D §3 ("גחלת – גריל בר שכונתי, פתח תקווה (בדיוני)").
 * Every screen that shows these values labels them as sample data.
 */
import type { PlanId } from "@/lib/data/plans";
import { getHook, hooksForNiche, type Hook } from "@/lib/data/seed";

/** Fixed "now" for deterministic relative labels in mock data (Asia/Jerusalem, Saturday). */
export const MOCK_NOW = "2026-10-17T09:30:00+03:00";

export type AudienceGender = "plural" | "female" | "male";
export type Register = "formal" | "warm" | "casual" | "slang";
export type BrandToken = "primary" | "rose" | "violet" | "lemon" | "success" | "text";

export interface MockService { name: string; gender: "m" | "f" }
export interface MockFactCandidate { key: string; label: string; checked: boolean }

export const MOCK_USER = {
  firstName: "דנה",
  fullName: "דנה לוי",
  email: "dana@example.com",
  uiGenderForm: "plural" as AudienceGender,
  role: "owner" as const,
};

export const MOCK_BUSINESS = {
  name: "גחלת – גריל בר שכונתי",
  shortName: "גחלת",
  nicheSlug: "restaurants",
  city: "פתח תקווה",
  phone: "03-1234567",
  whatsapp: "050-1234567",
  website: "gahelet.example.co.il",
  usp: "הכול נצלה על גחלים פתוחות מול הסועדים, ופיתות חמות מהטאבון",
  services: [
    { name: "ארוחה זוגית", gender: "f" },
    { name: "שיפודים על הגחלים", gender: "m" },
    { name: "פיתות מהטאבון", gender: "f" },
    { name: "אירועים קטנים", gender: "m" },
  ] as MockService[],
  /** Facts the brand extraction "found" — unchecked until the owner confirms (Part 03 §4.1). */
  factCandidates: [
    { key: "google_rating", label: "דירוג 4.8 בגוגל", checked: false },
    { key: "reviews_count", label: "1,240 ביקורות בגוגל", checked: false },
    { key: "years", label: "12 שנות ניסיון", checked: false },
  ] as MockFactCandidate[],
  /** Confirmed facts (the only source for numbers in scripts, §6.12). */
  facts: [
    { key: "google_rating", label: "דירוג 4.8 בגוגל", value: "4.8" },
    { key: "reviews_count", label: "1,240 ביקורות בגוגל", value: "1,240" },
  ],
  brandColors: ["primary", "rose", "text"] as BrandToken[],
  logoLetter: "ג",
  audienceGender: "plural" as AudienceGender,
  register: "casual" as Register,
  voiceGender: "male" as "female" | "male",
};

export const MOCK_PLAN: { id: PlanId; nameHe: string; hookVariantsMax: number; monthlyCredits: number } = {
  id: "starter",
  nameHe: "בסיס",
  hookVariantsMax: 3,
  monthlyCredits: 400,
};

/** Same balance the shared CreditsMeter shows (AppShell default). */
export const MOCK_CREDITS = { balance: 400, reserved: 58 };

// ---------- Dashboard widgets (spec 07–08 §G, §H, §S.3) ----------

export const MOCK_CAMPAIGN_KPIS = {
  activeCampaigns: 1,
  spendIls: 412,
  reach: 18450,
  results: 37,
  costPerResultIls: 11.14,
  deltas: { spend: 8, reach: 14, results: 21, cpr: -11 },
  monthSpendIls: 1180,
  monthCapIls: 3000,
  winnerHook: "אל תבואו אלינו רעבים. ברצינות.",
  campaignHref: "/app/campaigns",
};

export interface MockLead { id: string; name: string; when: string; campaign: string; answer: string; tel: string; wa: string }
export const MOCK_LEADS: MockLead[] = [
  { id: "l-1", name: "מיכל", when: "לפני 18 דקות", campaign: "שולחן לאמצע השבוע", answer: "כמה סועדים? 4", tel: "+972500000001", wa: "972500000001" },
  { id: "l-2", name: "יוסי", when: "לפני שעה", campaign: "שולחן לאמצע השבוע", answer: "מתי? יום שלישי בערב", tel: "+972500000002", wa: "972500000002" },
  { id: "l-3", name: "רונית", when: "אתמול", campaign: "ארוחה זוגית מהגחלים", answer: "אירוע קטן? כן, 12 איש", tel: "+972500000003", wa: "972500000003" },
];

export type PlanItemKind = "video" | "trend" | "campaign" | "post";
export type PlanItemStatus = "planned" | "in_progress" | "done" | "skipped";
export interface MockPlanItem { id: string; day: string; date: string; kind: PlanItemKind; title: string; status: PlanItemStatus; href: string }
export const MOCK_PLAN_ITEMS: MockPlanItem[] = [
  { id: "pi-1", day: "ראשון", date: "18.10", kind: "trend", title: "טרנד: פיתיון ושלט", status: "planned", href: "/app/create?trend=bait-and-sign&src=trend" },
  { id: "pi-2", day: "שלישי", date: "20.10", kind: "video", title: "רילס: המנה שגורמת לאנשים לנסוע שעה", status: "planned", href: "/app/create?hook=restaurants-11&src=dashboard" },
  { id: "pi-3", day: "רביעי", date: "21.10", kind: "campaign", title: "קמפיין: שולחן לאמצע השבוע", status: "in_progress", href: "/app/campaigns/new?project=p-1003" },
  { id: "pi-4", day: "חמישי", date: "22.10", kind: "post", title: "פוסט: מאחורי הקלעים של הגריל", status: "planned", href: "/app/publish/new?project=p-1002" },
];
export const MOCK_PLAN_PROGRESS = { done: 3, total: 12 };

/** "טרנד השבוע לתחום שלכם" (spec 07–08 §J.8, seed template `bait-and-sign`). */
export const MOCK_TREND = {
  slug: "bait-and-sign",
  nameHe: "פיתיון ושלט",
  whyHe: "רגע של \"כמעט\" שעוצר את הגלילה, ואז שלט פשוט עם המסר שלכם.",
  fitHe: "מתאים למסעדות: \"בואו לאכול אצלנו. אנחנו בפתח תקווה\"",
  durationSec: 15,
};

// ---------- Catalogs used by the wizard ----------

export interface MockVoice { id: string; name: string; gender: "female" | "male"; age: string; tone: string; brand?: boolean }
export const MOCK_VOICES: MockVoice[] = [
  { id: "v-ori", name: "אורי", gender: "male", age: "בוגר", tone: "חם ובטוח", brand: true },
  { id: "v-amit", name: "עמית", gender: "male", age: "צעיר", tone: "אנרגטי ומהיר" },
  { id: "v-dani", name: "דני", gender: "male", age: "מבוגר", tone: "רגוע ועמוק" },
  { id: "v-noa", name: "נועה", gender: "female", age: "צעירה", tone: "קלילה ומחייכת" },
  { id: "v-michal", name: "מיכל", gender: "female", age: "בוגרת", tone: "חמה וברורה" },
  { id: "v-yael", name: "יעל", gender: "female", age: "מבוגרת", tone: "רצינית ומרגיעה" },
];

export interface MockTrack { id: string; name: string; mood: string; durationSec: number }
export const MOCK_TRACKS: MockTrack[] = [
  { id: "t-1", name: "גחלים בלילה", mood: "אורבני", durationSec: 32 },
  { id: "t-2", name: "רחוב צדדי", mood: "אורבני", durationSec: 45 },
  { id: "t-3", name: "שישי בצהריים", mood: "חם", durationSec: 38 },
  { id: "t-4", name: "שולחן מלא", mood: "חם", durationSec: 30 },
  { id: "t-5", name: "דופק גבוה", mood: "אנרגטי", durationSec: 30 },
  { id: "t-6", name: "קפיצה קדימה", mood: "אנרגטי", durationSec: 60 },
  { id: "t-7", name: "קטיפה שחורה", mood: "יוקרתי", durationSec: 48 },
  { id: "t-8", name: "פיקניק", mood: "קליל ומצחיק", durationSec: 30 },
  { id: "t-9", name: "גל רך", mood: "רגוע", durationSec: 60 },
  { id: "t-10", name: "בוקר חדש", mood: "מעורר השראה", durationSec: 45 },
];

// ---------- Hook personalization and hook of the week ----------

const PROFILE_VALUES: Record<string, string> = {
  "עיר": MOCK_BUSINESS.city,
  "שירות": MOCK_BUSINESS.services[0].name,
  "מוצר": MOCK_BUSINESS.services[0].name,
  "שם_העסק": MOCK_BUSINESS.shortName,
};

/** Fills profile placeholders with prefix grammar ("ב{עיר}" + "השרון" → "בשרון"); fact placeholders stay open. */
export function personalizeHook(text: string, values: Record<string, string> = PROFILE_VALUES): string {
  return text.replace(/([בלמ]?)\{([^}]+)\}/g, (all, prefix: string, name: string) => {
    const v = values[name];
    if (!v) return all;
    if (prefix && v.startsWith("ה")) return `${prefix}${v.slice(1)}`;
    return `${prefix}${v}`;
  });
}

/** Deterministic weekly pick (Part 03 §5.4): Israeli weeks from Sunday 2026-01-04, featured first. */
export function hookOfTheWeek(nicheSlug: string = MOCK_BUSINESS.nicheSlug, nowIso: string = MOCK_NOW): Hook {
  const list = hooksForNiche(nicheSlug).filter((h) => !h.season_slug);
  const ordered = [...list.filter((h) => h.is_featured), ...list.filter((h) => !h.is_featured)];
  const days = Math.floor((Date.parse(nowIso) - Date.parse("2026-01-04T00:00:00+02:00")) / 86_400_000);
  const week = Math.floor(days / 7);
  return ordered[week % ordered.length] ?? (getHook("universal-01") as Hook);
}
