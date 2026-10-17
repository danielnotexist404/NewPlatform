/**
 * SAMPLE DATA (דוגמה) for the Meta campaigns screens — spec 07–08 §F, §G, §S.2.
 * Everything here is invented for the demo workspace "מספרת דוגמה" and is shown in the UI with a
 * "נתוני דוגמה" note. Replaced by `GET /api/campaigns*` + Supabase once Meta is connected (Part 07).
 * Deterministic: no clock, no Math.random (cacheComponents prerender safe).
 */

export const MOCK_NOW = "2026-10-17T10:30:00+03:00";
export const MOCK_TODAY = "2026-10-17";
/** Share of today's budget already spent at MOCK_NOW (10:30). */
const TODAY_PARTIAL = 0.42;

export type CampaignGoal = "whatsapp_messages" | "lead_form" | "website_traffic" | "local_awareness";
export type CampaignStatus =
  | "draft" | "preparing" | "ready" | "in_review" | "active" | "paused"
  | "with_issues" | "rejected" | "completed" | "error" | "archived";
export type AdStatus = "active" | "paused" | "in_review" | "rejected";
export type CtaKey = "WHATSAPP_MESSAGE" | "SIGN_UP" | "GET_QUOTE" | "BOOK_NOW" | "LEARN_MORE" | "SHOP_NOW" | "CONTACT_US" | "CALL_NOW";
export type ReviewFeedbackKey =
  | "personal_attributes" | "misleading_claims" | "before_after" | "health_body_image" | "landing_page"
  | "unacceptable_business" | "restricted_content" | "deceptive_ui" | "political" | "ip_music";
export type RuleKind = "pause_expensive_ad" | "boost_winner" | "alert_no_results" | "alert_fatigue" | "monthly_cap_stop";
export type InsightAction =
  | "wait_more_data" | "raise_budget_20" | "boost_winner" | "pause_ad" | "new_variants_from_winner"
  | "fix_rejected_ad" | "extend_end_date" | "reply_to_whatsapp_fast" | "check_lead_form";

export interface HookVariant {
  key: "A" | "B" | "C";
  hookId: string; // seed/hooks.json id
  hookText: string;
  hookTypeHe: string;
  tone: 0 | 1 | 2 | 3;
  primaryText: string;
  headline: string;
  cta: CtaKey;
  status: AdStatus;
  /** share of the campaign's spend / impressions / results (sums to 1 per campaign) */
  share: { spend: number; impressions: number; results: number };
  hookRate: number; // video_3s_plays ÷ impressions
  holdRate: number; // thruplays ÷ video_3s_plays
  reviewFeedback?: { key: ReviewFeedbackKey; metaReason: string };
}

export interface DayPoint { date: string; spendIls: number; impressions: number; reach: number; results: number }
export interface ChangeLogEntry { at: string; who: string; source: "user" | "rule" | "system"; text: string }

export interface Campaign {
  id: string;
  name: string;
  goal: CampaignGoal;
  status: CampaignStatus;
  projectTitle: string;
  dailyBudgetIls: number;
  startDate: string;
  endDate: string | null;
  /** last day with delivery (pause / end) */
  lastDeliveryDate: string | null;
  geo: { mode: "radius" | "cities" | "country"; labelHe: string; radiusKm?: number; cities?: string[] };
  ageMin: number;
  ageMax: number;
  advantageAudience: boolean;
  timeline: { created: string; submitted?: string; approved?: string; active?: string; paused?: string; ended?: string; rejected?: string };
  variants: HookVariant[];
  daily: DayPoint[];
  changeLog: ChangeLogEntry[];
  rules: Partial<Record<RuleKind, boolean>>;
  minSampleReached: boolean;
  budgetChangesLastHour: number;
  updatedMinutesAgo: number;
  insightActions: InsightAction[];
}

/* ---------- deterministic helpers ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * 86_400_000).toISOString().slice(0, 10);
}
export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}
const r2 = (n: number) => Math.round(n * 100) / 100;

function series(seed: number, start: string, end: string, budget: number, cfg: { cpm: number; cpr: number; reach: number; resultsFromImpressions?: number }): DayPoint[] {
  const rnd = mulberry32(seed);
  const out: DayPoint[] = [];
  const n = daysBetween(start, end);
  for (let i = 0; i <= n; i++) {
    const date = addDays(start, i);
    const learning = i < 2 ? 0.65 : i < 4 ? 0.85 : 1;
    const partial = date === MOCK_TODAY ? TODAY_PARTIAL : 1;
    const spend = r2(budget * (0.84 + 0.28 * rnd()) * partial);
    const impressions = Math.round((spend / cfg.cpm) * 1000 * (0.9 + 0.2 * rnd()));
    const reach = Math.round(impressions * cfg.reach * (0.9 + 0.14 * rnd()));
    const results = cfg.resultsFromImpressions
      ? Math.round(impressions * cfg.resultsFromImpressions * (0.85 + 0.3 * rnd()))
      : Math.round((spend / cfg.cpr) * learning * (0.55 + 0.9 * rnd()));
    out.push({ date, spendIls: spend, impressions, reach, results });
  }
  return out;
}

/* ---------- the sample workspace ---------- */
export const SAMPLE_BUSINESS = {
  name: "מספרת דוגמה",
  nicheSlug: "barbers-salons",
  addressHe: "רחוב הדוגמה 12, רמת גן",
  cityHe: "רמת גן",
  instagram: "sample.barbershop",
  whatsappDisplay: "03-555-0100",
  plan: { id: "starter" as const, nameHe: "מתחילים", monthlyCapIls: 3000, autoRulesMax: 2, activeCampaignsMax: 2, healthChecksPerMonth: 2 },
  userMonthlyCapIls: 2000 as number | null,
};

const c1Variants: HookVariant[] = [
  {
    key: "A", hookId: "barbers-salons-04", hookText: "פייד מושלם ב-60 שניות", hookTypeHe: "ויזואל ממכר", tone: 0,
    primaryText: "שלחו הודעה בוואטסאפ וקבעו תור לפייד. 5 דקות מכם, ברמת גן.",
    headline: "פייד מדויק, בלי לחכות", cta: "WHATSAPP_MESSAGE", status: "active",
    share: { spend: 0.29, impressions: 0.3, results: 0.22 }, hookRate: 0.241, holdRate: 0.092,
  },
  {
    key: "B", hookId: "barbers-salons-06", hookText: "POV: הספר הקבוע שלכם בחופש, ואתם אצל מישהו חדש", hookTypeHe: "נקודת מבט", tone: 1,
    primaryText: "הספר הקבוע בחופש? שלחו לנו וואטסאפ ונמצא לכם תור עוד היום.",
    headline: "תור עוד היום", cta: "WHATSAPP_MESSAGE", status: "active",
    share: { spend: 0.46, impressions: 0.45, results: 0.6 }, hookRate: 0.382, holdRate: 0.141,
  },
  {
    key: "C", hookId: "barbers-salons-03", hookText: "תפסיקו לחפוף כל יום. ברצינות, השיער שלכם מתחנן", hookTypeHe: "תפסיקו לעשות X", tone: 2,
    primaryText: "שיער שנראה טוב גם בלי לחפוף כל יום. שלחו וואטסאפ ונסביר מה מתאים לכם.",
    headline: "ייעוץ קצר בוואטסאפ", cta: "WHATSAPP_MESSAGE", status: "active",
    share: { spend: 0.25, impressions: 0.25, results: 0.18 }, hookRate: 0.187, holdRate: 0.071,
  },
];

const RAW: Omit<Campaign, "daily">[] = [
  {
    id: "cmp-after-holidays",
    name: "אחרי החגים: תור בלי לחכות",
    goal: "whatsapp_messages",
    status: "active",
    projectTitle: "אחרי החגים · 3 הוקים",
    dailyBudgetIls: 40,
    startDate: "2026-10-05",
    endDate: null,
    lastDeliveryDate: MOCK_TODAY,
    geo: { mode: "radius", labelHe: "סביב העסק, 5 ק״מ", radiusKm: 5 },
    ageMin: 18, ageMax: 55, advantageAudience: true,
    timeline: { created: "2026-10-04T21:10:00+03:00", submitted: "2026-10-04T21:14:00+03:00", approved: "2026-10-05T06:40:00+03:00", active: "2026-10-05T06:41:00+03:00" },
    variants: c1Variants,
    changeLog: [
      { at: "2026-10-12T08:00:00+03:00", who: "כלל אוטומטי", source: "rule", text: "התראה: ההוק המנצח מביא פנייה בפחות מ-80% מהממוצע" },
      { at: "2026-10-09T19:30:00+03:00", who: "בעל העסק", source: "user", text: "התקציב היומי שונה מ-₪35 ל-₪40" },
      { at: "2026-10-05T06:41:00+03:00", who: "מטא", source: "system", text: "שלוש המודעות אושרו, והקמפיין פעיל" },
      { at: "2026-10-04T21:14:00+03:00", who: "בעל העסק", source: "user", text: "הקמפיין פורסם ונשלח לבדיקה של מטא" },
    ],
    rules: { pause_expensive_ad: true, alert_no_results: true },
    minSampleReached: true,
    budgetChangesLastHour: 0,
    updatedMinutesAgo: 12,
    insightActions: ["boost_winner", "reply_to_whatsapp_fast"],
  },
  {
    id: "cmp-price-reveal",
    name: "כמה עולה תספורת טובה",
    goal: "whatsapp_messages",
    status: "in_review",
    projectTitle: "חשיפת מחיר · 3 הוקים",
    dailyBudgetIls: 30,
    startDate: MOCK_TODAY,
    endDate: "2026-10-24",
    lastDeliveryDate: null,
    geo: { mode: "radius", labelHe: "סביב העסק, 10 ק״מ", radiusKm: 10 },
    ageMin: 18, ageMax: 65, advantageAudience: true,
    timeline: { created: "2026-10-17T09:05:00+03:00", submitted: "2026-10-17T09:20:00+03:00" },
    variants: [
      { key: "A", hookId: "barbers-salons-05", hookText: "כמה צריכה לעלות תספורת טובה? ולמה לא 40 ₪", hookTypeHe: "חשיפת מחיר", tone: 3, primaryText: "מה בדיוק משלמים בתספורת טובה? שלחו וואטסאפ ונשלח מחירון מלא.", headline: "המחירון בוואטסאפ", cta: "WHATSAPP_MESSAGE", status: "in_review", share: { spend: 0, impressions: 0, results: 0 }, hookRate: 0, holdRate: 0 },
      { key: "B", hookId: "barbers-salons-07", hookText: "3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים", hookTypeHe: "רשימה ממוספרת", tone: 0, primaryText: "ספר טוב שואל קודם. שלחו וואטסאפ וקבעו תור עם שיחה קצרה לפני.", headline: "קודם שואלים, אחר כך מספרים", cta: "WHATSAPP_MESSAGE", status: "in_review", share: { spend: 0, impressions: 0, results: 0 }, hookRate: 0, holdRate: 0 },
      { key: "C", hookId: "barbers-salons-02", hookText: "התספורת הזאת מתאימה רק ל-3 צורות פנים", hookTypeHe: "רשימה ממוספרת", tone: 2, primaryText: "לא בטוחים מה מתאים לכם? שלחו תמונה בוואטסאפ ונמליץ על תספורת.", headline: "המלצה לפי צורת הפנים", cta: "WHATSAPP_MESSAGE", status: "in_review", share: { spend: 0, impressions: 0, results: 0 }, hookRate: 0, holdRate: 0 },
    ],
    changeLog: [
      { at: "2026-10-17T09:20:00+03:00", who: "בעל העסק", source: "user", text: "הקמפיין פורסם ונשלח לבדיקה של מטא" },
      { at: "2026-10-17T09:05:00+03:00", who: "בעל העסק", source: "user", text: "נוצרה טיוטה מהפרויקט \"חשיפת מחיר\"" },
    ],
    rules: {},
    minSampleReached: false,
    budgetChangesLastHour: 1,
    updatedMinutesAgo: 4,
    insightActions: ["wait_more_data"],
  },
  {
    id: "cmp-wedding-leads",
    name: "תספורת לחתונה: טופס לידים",
    goal: "lead_form",
    status: "paused",
    projectTitle: "תספורת לחתונה · 3 הוקים",
    dailyBudgetIls: 30,
    startDate: "2026-09-28",
    endDate: null,
    lastDeliveryDate: "2026-10-14",
    geo: { mode: "cities", labelHe: "רמת גן, גבעתיים, בני ברק", cities: ["רמת גן", "גבעתיים", "בני ברק"] },
    ageMin: 22, ageMax: 45, advantageAudience: false,
    timeline: { created: "2026-09-27T20:00:00+03:00", submitted: "2026-09-27T20:06:00+03:00", approved: "2026-09-28T08:15:00+03:00", active: "2026-09-28T08:16:00+03:00", paused: "2026-10-14T22:10:00+03:00" },
    variants: [
      { key: "A", hookId: "barbers-salons-09", hookText: "תספורת לחתונה: מתי לקבוע תור? רמז: לא יום לפני", hookTypeHe: "שאלה", tone: 1, primaryText: "מתחתנים בקרוב? השאירו פרטים ונחזור אליכם עם תאריכים פנויים.", headline: "תור לחתן, בלי לחץ", cta: "BOOK_NOW", status: "paused", share: { spend: 0.4, impressions: 0.38, results: 0.47 }, hookRate: 0.296, holdRate: 0.118 },
      { key: "B", hookId: "barbers-salons-07", hookText: "3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים", hookTypeHe: "רשימה ממוספרת", tone: 0, primaryText: "לפני החתונה עושים חזרה. השאירו פרטים ונקבע תור ניסיון.", headline: "תור ניסיון לפני החתונה", cta: "BOOK_NOW", status: "paused", share: { spend: 0.34, impressions: 0.35, results: 0.33 }, hookRate: 0.262, holdRate: 0.104 },
      { key: "C", hookId: "barbers-salons-02", hookText: "התספורת הזאת מתאימה רק ל-3 צורות פנים", hookTypeHe: "רשימה ממוספרת", tone: 2, primaryText: "השאירו פרטים ונמליץ על תספורת שמתאימה לפנים שלכם ולחליפה.", headline: "התאמה לפני האירוע", cta: "BOOK_NOW", status: "paused", share: { spend: 0.26, impressions: 0.27, results: 0.2 }, hookRate: 0.214, holdRate: 0.083 },
    ],
    changeLog: [
      { at: "2026-10-14T22:10:00+03:00", who: "בעל העסק", source: "user", text: "הקמפיין הושהה" },
      { at: "2026-10-03T10:00:00+03:00", who: "בעל העסק", source: "user", text: "התקציב היומי שונה מ-₪25 ל-₪30" },
      { at: "2026-09-28T08:16:00+03:00", who: "מטא", source: "system", text: "המודעות אושרו, והקמפיין פעיל" },
    ],
    rules: { alert_no_results: true },
    minSampleReached: true,
    budgetChangesLastHour: 0,
    updatedMinutesAgo: 38,
    insightActions: ["check_lead_form", "new_variants_from_winner"],
  },
  {
    id: "cmp-curly-rejected",
    name: "שיער מתולתל: ייעוץ בוואטסאפ",
    goal: "whatsapp_messages",
    status: "rejected",
    projectTitle: "שיער מתולתל · הוק אחד",
    dailyBudgetIls: 30,
    startDate: "2026-10-16",
    endDate: "2026-10-30",
    lastDeliveryDate: null,
    geo: { mode: "radius", labelHe: "סביב העסק, 5 ק״מ", radiusKm: 5 },
    ageMin: 18, ageMax: 65, advantageAudience: true,
    timeline: { created: "2026-10-15T21:30:00+03:00", submitted: "2026-10-15T21:34:00+03:00", rejected: "2026-10-16T07:52:00+03:00" },
    variants: [
      {
        key: "A", hookId: "barbers-salons-08", hookText: "מה ששיער מתולתל צריך – ואף אחד לא אמר לכם", hookTypeHe: "סוד מקצועי", tone: 3,
        primaryText: "יש לכם שיער מתולתל שאף אחד לא יודע לספר? שלחו וואטסאפ ונסדר את זה.",
        headline: "ספר שמבין תלתלים", cta: "WHATSAPP_MESSAGE", status: "rejected",
        share: { spend: 0, impressions: 0, results: 0 }, hookRate: 0, holdRate: 0,
        reviewFeedback: { key: "personal_attributes", metaReason: "Ads must not assert or imply personal attributes." },
      },
    ],
    changeLog: [
      { at: "2026-10-16T07:52:00+03:00", who: "מטא", source: "system", text: "המודעה נדחתה בבדיקה של מטא" },
      { at: "2026-10-15T21:34:00+03:00", who: "בעל העסק", source: "user", text: "הקמפיין פורסם ונשלח לבדיקה של מטא" },
    ],
    rules: {},
    minSampleReached: false,
    budgetChangesLastHour: 0,
    updatedMinutesAgo: 51,
    insightActions: ["fix_rejected_ad"],
  },
  {
    id: "cmp-friday-awareness",
    name: "שישי בבוקר במספרה: חשיפה לשכונה",
    goal: "local_awareness",
    status: "completed",
    projectTitle: "יום בחיים · 2 הוקים",
    dailyBudgetIls: 25,
    startDate: "2026-09-01",
    endDate: "2026-09-21",
    lastDeliveryDate: "2026-09-21",
    geo: { mode: "radius", labelHe: "סביב העסק, 3 ק״מ", radiusKm: 3 },
    ageMin: 18, ageMax: 65, advantageAudience: true,
    timeline: { created: "2026-08-31T18:00:00+03:00", submitted: "2026-08-31T18:03:00+03:00", approved: "2026-09-01T07:20:00+03:00", active: "2026-09-01T07:21:00+03:00", ended: "2026-09-21T23:59:00+03:00" },
    variants: [
      { key: "A", hookId: "barbers-salons-10", hookText: "שישי בבוקר אצלנו במספרה: שעה שלמה ב-30 שניות", hookTypeHe: "יום בחיים", tone: 1, primaryText: "ככה נראה שישי בבוקר אצלנו. מוזמנים לקפוץ, הקפה עלינו.", headline: "שישי בבוקר במספרה", cta: "LEARN_MORE", status: "paused", share: { spend: 0.55, impressions: 0.56, results: 0.6 }, hookRate: 0.318, holdRate: 0.127 },
      { key: "B", hookId: "barbers-salons-01", hookText: "ביקש \"רק לסדר קצת\". זה מה שיצא", hookTypeHe: "לפני / אחרי", tone: 0, primaryText: "מה זה \"רק לסדר קצת\" אצלנו? תראו בעצמכם.", headline: "רק לסדר קצת", cta: "LEARN_MORE", status: "paused", share: { spend: 0.45, impressions: 0.44, results: 0.4 }, hookRate: 0.276, holdRate: 0.109 },
    ],
    changeLog: [
      { at: "2026-09-21T23:59:00+03:00", who: "המערכת", source: "system", text: "הקמפיין הגיע לתאריך הסיום והסתיים" },
      { at: "2026-09-01T07:21:00+03:00", who: "מטא", source: "system", text: "המודעות אושרו, והקמפיין פעיל" },
    ],
    rules: {},
    minSampleReached: true,
    budgetChangesLastHour: 0,
    updatedMinutesAgo: 60 * 24,
    insightActions: ["new_variants_from_winner"],
  },
];

const SERIES: Record<string, DayPoint[]> = {
  "cmp-after-holidays": series(11, "2026-10-05", MOCK_TODAY, 40, { cpm: 18, cpr: 8.5, reach: 0.64 }),
  "cmp-wedding-leads": series(23, "2026-09-28", "2026-10-14", 30, { cpm: 21, cpr: 14, reach: 0.6 }),
  "cmp-friday-awareness": series(37, "2026-09-01", "2026-09-21", 25, { cpm: 12, cpr: 1, reach: 0.7, resultsFromImpressions: 0.29 }),
};

export const campaigns: Campaign[] = RAW.map((c) => ({ ...c, daily: SERIES[c.id] ?? [] }));
export const getCampaign = (id: string) => campaigns.find((c) => c.id === id);

/* ---------- KPI math (G.1) ---------- */
export type RangeKey = "7d" | "14d" | "30d" | "month" | "all";
export interface Totals { spendIls: number; reach: number; impressions: number; results: number }
export interface KpiSet { current: Totals; previous: Totals | null; from: string; to: string; series: DayPoint[] }

const EMPTY: Totals = { spendIls: 0, reach: 0, impressions: 0, results: 0 };

export function rangeBounds(range: RangeKey, firstDay?: string): { from: string; to: string; prevFrom: string | null; prevTo: string | null } {
  const to = MOCK_TODAY;
  if (range === "all") return { from: firstDay ?? to, to, prevFrom: null, prevTo: null };
  const len = range === "7d" ? 7 : range === "14d" ? 14 : range === "30d" ? 30 : Number(MOCK_TODAY.slice(8, 10));
  const from = addDays(to, -(len - 1));
  return { from, to, prevFrom: addDays(from, -len), prevTo: addDays(from, -1) };
}

function sum(points: DayPoint[]): Totals {
  return points.reduce(
    (a, p) => ({ spendIls: r2(a.spendIls + p.spendIls), reach: a.reach + p.reach, impressions: a.impressions + p.impressions, results: a.results + p.results }),
    { ...EMPTY },
  );
}
const inRange = (p: DayPoint, from: string, to: string) => p.date >= from && p.date <= to;

/** Daily points of several campaigns merged by date (results only from `resultGoals`). */
function merge(list: Campaign[], from: string, to: string, resultGoals?: CampaignGoal[]): DayPoint[] {
  const n = daysBetween(from, to);
  const out: DayPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const date = addDays(from, i);
    const day: DayPoint = { date, spendIls: 0, impressions: 0, reach: 0, results: 0 };
    for (const c of list) {
      const p = c.daily.find((d) => d.date === date);
      if (!p) continue;
      day.spendIls = r2(day.spendIls + p.spendIls);
      day.impressions += p.impressions;
      day.reach += p.reach;
      if (!resultGoals || resultGoals.includes(c.goal)) day.results += p.results;
    }
    out.push(day);
  }
  return out;
}

export function campaignKpis(c: Campaign, range: RangeKey): KpiSet {
  const first = c.daily[0]?.date ?? c.startDate;
  const b = rangeBounds(range, first);
  const to = range === "all" ? (c.lastDeliveryDate ?? b.to) : b.to;
  const cur = c.daily.filter((p) => inRange(p, b.from, to));
  const prev = b.prevFrom && b.prevTo ? c.daily.filter((p) => inRange(p, b.prevFrom!, b.prevTo!)) : null;
  return { current: sum(cur), previous: prev && prev.length ? sum(prev) : null, from: b.from, to, series: range === "all" ? c.daily : merge([c], b.from, to) };
}

/** Workspace level: spend/reach of all campaigns; results only from result goals (awareness counts views). */
export function workspaceKpis(range: Exclude<RangeKey, "all">): KpiSet {
  const b = rangeBounds(range);
  const goals: CampaignGoal[] = ["whatsapp_messages", "lead_form", "website_traffic"];
  const cur = merge(campaigns, b.from, b.to, goals);
  const prev = merge(campaigns, b.prevFrom!, b.prevTo!, goals);
  const prevTotals = sum(prev);
  return { current: sum(cur), previous: prevTotals.spendIls > 0 ? prevTotals : null, from: b.from, to: b.to, series: cur };
}

export function variantMetrics(c: Campaign, v: HookVariant) {
  const t = sum(c.daily);
  const impressions = Math.round(t.impressions * v.share.impressions);
  const spendIls = r2(t.spendIls * v.share.spend);
  const results = Math.round(t.results * v.share.results);
  const plays3s = Math.round(impressions * v.hookRate);
  const thruplays = Math.round(plays3s * v.holdRate);
  return { impressions, spendIls, results, plays3s, thruplays, costPerResult: results > 0 ? r2(spendIls / results) : null };
}

export function winnerOf(c: Campaign): HookVariant | null {
  if (!c.minSampleReached || c.variants.length < 2) return null;
  const ranked = c.variants
    .map((v) => ({ v, m: variantMetrics(c, v) }))
    .filter((x) => x.m.costPerResult !== null)
    .sort((a, b) => a.m.costPerResult! - b.m.costPerResult! || b.v.hookRate - a.v.hookRate);
  return ranked[0]?.v ?? null;
}

/** Managed spend in the current Asia/Jerusalem month (K.3). */
export function monthSpendIls(): number {
  const from = `${MOCK_TODAY.slice(0, 8)}01`;
  return r2(campaigns.reduce((a, c) => a + sum(c.daily.filter((p) => inRange(p, from, MOCK_TODAY))).spendIls, 0));
}

/* ---------- "בדיקת דופק" report (S.2) — SAMPLE ---------- */
export interface HealthFix {
  id: string;
  check: string;
  severity: "high" | "medium" | "low";
  title: string;
  why: string;
  action: { label: string; href?: string; instantToast?: string };
  savingIls?: number;
}
export interface HealthBurn { key: string; amountIls: number; title: string; detail: string }
export interface HealthCheckRow { key: string; label: string; passed: boolean; note: string }

export const healthReport = {
  score: 58,
  periodStart: "2026-07-19",
  periodEnd: "2026-10-16",
  createdAt: "2026-10-17T08:12:00+03:00",
  totalSpendIls: 4860,
  campaignsChecked: 7,
  adsChecked: 19,
  burn: [
    { key: "zero_results", amountIls: 1140, title: "4 מודעות שלא הביאו אף פנייה", detail: "רצו יותר מ-10 ימים כל אחת, עם הוצאה של ₪240–₪330, ובלי הודעה אחת בוואטסאפ." },
    { key: "frequency", amountIls: 620, title: "אותם אנשים ראו את אותה מודעה שוב ושוב", detail: "בקמפיין \"מבצע קיץ\" כל אדם ראה את המודעה בממוצע 4.6 פעמים. אחרי 3 פעמים רוב האנשים כבר מדלגים." },
    { key: "tiny_adsets", amountIls: 410, title: "תקציב קטן שהתפצל ל-6 קבוצות מודעות", detail: "₪50 ליום חולקו ל-6 קבוצות, אז אף אחת מהן לא קיבלה מספיק נתונים כדי שמטא תלמד." },
  ] satisfies HealthBurn[],
  fixes: [
    { id: "f1", check: "zero_results", severity: "high", title: "להשהות את 4 המודעות שלא הביאו פניות", why: "הן ממשיכות להוציא כסף בלי תוצאה. ההשהיה לא מוחקת אותן, ואפשר להחזיר אותן בכל רגע.", action: { label: "השהיית 4 המודעות", instantToast: "4 המודעות הושהו בחשבון המודעות" }, savingIls: 1140 },
    { id: "f2", check: "no_video", severity: "high", title: "להחליף תמונות בסרטונים קצרים", why: "רוב המודעות בחשבון הן תמונות. ברילס ובסטוריז סרטון אנכי עוצר יותר אנשים.", action: { label: "יצירת סרטון עם 3 הוקים", href: "/app/create" } },
    { id: "f3", check: "tiny_adsets", severity: "medium", title: "לאחד את 6 הקבוצות לקמפיין אחד עם 3 הוקים", why: "קמפיין אחד עם תקציב אחד נותן למטא מספיק נתונים, ואתם רואים מה עובד בלי לפצל.", action: { label: "קמפיין חדש עם 3 הוקים", href: "/app/campaigns/new" }, savingIls: 410 },
    { id: "f4", check: "fatigue", severity: "medium", title: "לרענן את \"מבצע קיץ\" בסרטון חדש", why: "אותו סרטון רץ כבר 41 ימים, ואנשים התחילו לדלג עליו. גרסה חדשה מאותו טרנד מחזירה עניין.", action: { label: "סרטון חדש מאותו טרנד", href: "/app/trends" }, savingIls: 620 },
    { id: "f5", check: "advantage_off", severity: "low", title: "לתת למטא למצוא את הקהל המתאים", why: "בשני קמפיינים הגיל והתחומים מוגבלים ידנית. ההגבלה מצמצמת את הקהל ומייקרת כל פנייה.", action: { label: "הפעלה בקמפיין הבא", href: "/app/campaigns/new" } },
  ] satisfies HealthFix[],
  checks: [
    { key: "zero_results", label: "הוצאה בלי תוצאות", passed: false, note: "4 מודעות" },
    { key: "frequency", label: "תדירות גבוהה מ-3", passed: false, note: "קמפיין אחד" },
    { key: "ctr", label: "אחוז הקלקות נמוך מהרגיל בחשבון", passed: true, note: "תקין" },
    { key: "fatigue", label: "סרטונים ותמונות ישנים מ-30 יום", passed: false, note: "2 מודעות" },
    { key: "no_video", label: "יש מודעות וידאו", passed: false, note: "רק 3 מתוך 19" },
    { key: "tiny_adsets", label: "תקציב קטן שמתפצל להרבה קבוצות", passed: false, note: "6 קבוצות" },
    { key: "advantage_off", label: "מטא מוצאת את הקהל המתאים", passed: false, note: "כבוי ב-2 קמפיינים" },
    { key: "learning", label: "מודעות שתקועות בשלב הלמידה", passed: true, note: "תקין" },
    { key: "billing", label: "אמצעי תשלום וחשבון פעיל", passed: true, note: "תקין" },
    { key: "placements", label: "הרילס כלולים במיקומים", passed: true, note: "תקין" },
  ] satisfies HealthCheckRow[],
};

/* ---------- Meta connection (C.3, L.3) — SAMPLE ---------- */
export const metaConnection = {
  status: "connected" as "connected" | "needs_reconnect" | "revoked",
  businessName: "מספרת דוגמה",
  connectedBy: "בעל העסק",
  connectedAt: "2026-09-02",
  lastHealthCheck: "2026-10-17T06:00:00+03:00",
  assets: {
    page: { name: "מספרת דוגמה", category: "מספרה" },
    instagram: { username: "sample.barbershop" },
    adAccount: { name: "מספרת דוגמה · מודעות", id: "act_000000000000", currency: "ILS" },
    whatsapp: "03-555-0100",
  },
  privacyUrl: "https://example.co.il/privacy",
};

/** Cities offered by the mock city search (Meta geolocation search in production). */
export const CITY_SUGGESTIONS = [
  "תל אביב-יפו", "רמת גן", "גבעתיים", "בני ברק", "פתח תקווה", "חולון", "בת ים", "ראשון לציון", "הרצליה", "רעננה",
  "כפר סבא", "ירושלים", "חיפה", "באר שבע", "נתניה", "אשדוד", "מודיעין", "רחובות", "קריית אונו", "אור יהודה",
];
