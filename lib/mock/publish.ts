/**
 * SAMPLE DATA (דוגמה) for organic publishing, the content calendar and "תוכנית 30 יום"
 * — spec 07–08 §I, §S.3. Season slugs come from /seed/seasons.json; the exact dates below are the
 * calendar placement of the seed's date hints (approximate dates are marked `approx`).
 */
import { campaigns, MOCK_TODAY, type CampaignGoal } from "./campaigns";

export type SocialPlatform = "instagram" | "facebook";
export type SocialPostStatus = "scheduled" | "uploading" | "published" | "failed" | "canceled";

export interface SampleVideo {
  id: string;
  title: string;
  hookText: string;
  hookId: string;
  tone: 0 | 1 | 2 | 3;
  durationSec: number;
  captionHe: string;
  hashtags: string[];
}

export const sampleVideos: SampleVideo[] = [
  { id: "prj-wedding", title: "תספורת לחתונה", hookText: "תספורת לחתונה: מתי לקבוע תור? רמז: לא יום לפני", hookId: "barbers-salons-09", tone: 1, durationSec: 15, captionHe: "מתחתנים בחודשים הקרובים? שלחו וואטסאפ ונשמור לכם תור ניסיון.\nקובעים חודש מראש, עושים חזרה שבועיים לפני, ומגיעים לחתונה רגועים.", hashtags: ["#תספורתלחתונה", "#ברברשופ", "#רמתגן"] },
  { id: "prj-fade", title: "פייד מושלם", hookText: "פייד מושלם ב-60 שניות", hookId: "barbers-salons-04", tone: 0, durationSec: 30, captionHe: "פייד מדויק בלי לחכות בתור. שלחו וואטסאפ וקבעו לשבוע הזה.", hashtags: ["#פייד", "#ברברשופ", "#תספורתגברים"] },
  { id: "prj-questions", title: "3 שאלות לפני תספורת", hookText: "3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים", hookId: "barbers-salons-07", tone: 2, durationSec: 30, captionHe: "ספר טוב שואל קודם ומספר אחר כך. אלה שלוש השאלות שאנחנו שואלים כל לקוח חדש.", hashtags: ["#ספר", "#טיפיםלשיער", "#רמתגן"] },
  { id: "prj-friday", title: "שישי בבוקר במספרה", hookText: "שישי בבוקר אצלנו במספרה: שעה שלמה ב-30 שניות", hookId: "barbers-salons-10", tone: 3, durationSec: 30, captionHe: "ככה נראה שישי בבוקר אצלנו. מוזמנים לקפוץ, הקפה עלינו.", hashtags: ["#שישיבבוקר", "#מספרה", "#רמתגן"] },
];

export interface SocialPost {
  id: string;
  videoId: string;
  platform: SocialPlatform;
  kind: "reel" | "trial_reel";
  status: SocialPostStatus;
  at: string; // scheduled or published time
  caption: string;
  insights?: { views: number; reach: number; likes: number; comments: number; shares: number; saved: number; skipRate: number | null; avgWatchPct: number };
  errorHe?: string;
}

export const socialPosts: SocialPost[] = [
  { id: "sp-01", videoId: "prj-fade", platform: "instagram", kind: "reel", status: "published", at: "2026-10-12T18:00:00+03:00", caption: "פייד מדויק בלי לחכות בתור.", insights: { views: 4820, reach: 3910, likes: 212, comments: 14, shares: 17, saved: 38, skipRate: 41, avgWatchPct: 62 } },
  { id: "sp-02", videoId: "prj-fade", platform: "facebook", kind: "reel", status: "published", at: "2026-10-12T18:00:00+03:00", caption: "פייד מדויק בלי לחכות בתור.", insights: { views: 2140, reach: 1880, likes: 64, comments: 5, shares: 9, saved: 0, skipRate: null, avgWatchPct: 55 } },
  { id: "sp-03", videoId: "prj-questions", platform: "instagram", kind: "reel", status: "published", at: "2026-10-08T19:30:00+03:00", caption: "ספר טוב שואל קודם.", insights: { views: 7350, reach: 6120, likes: 401, comments: 33, shares: 46, saved: 92, skipRate: 33, avgWatchPct: 71 } },
  { id: "sp-04", videoId: "prj-friday", platform: "instagram", kind: "reel", status: "published", at: "2026-10-03T11:00:00+03:00", caption: "ככה נראה שישי בבוקר אצלנו.", insights: { views: 2960, reach: 2480, likes: 133, comments: 8, shares: 6, saved: 11, skipRate: 52, avgWatchPct: 48 } },
  { id: "sp-05", videoId: "prj-friday", platform: "facebook", kind: "reel", status: "failed", at: "2026-10-15T20:00:00+03:00", caption: "ככה נראה שישי בבוקר אצלנו.", errorHe: "פייסבוק לא סיימה לעבד את הסרטון בזמן. הפוסט נשמר, ואפשר לנסות שוב." },
  { id: "sp-06", videoId: "prj-wedding", platform: "instagram", kind: "reel", status: "scheduled", at: "2026-10-18T19:00:00+03:00", caption: "מתחתנים בחודשים הקרובים? שלחו וואטסאפ." },
  { id: "sp-07", videoId: "prj-wedding", platform: "facebook", kind: "reel", status: "scheduled", at: "2026-10-18T19:00:00+03:00", caption: "מתחתנים בחודשים הקרובים? שלחו וואטסאפ." },
  { id: "sp-08", videoId: "prj-questions", platform: "instagram", kind: "trial_reel", status: "scheduled", at: "2026-10-21T18:30:00+03:00", caption: "שלוש שאלות לפני כל תספורת." },
  { id: "sp-09", videoId: "prj-fade", platform: "instagram", kind: "reel", status: "scheduled", at: "2026-10-29T12:00:00+03:00", caption: "פייד לפני סוף השבוע." },
];

export const getVideo = (id: string) => sampleVideos.find((v) => v.id === id);

/* ---------- Calendar placement of seasons (seed slugs) ---------- */
export interface CalendarSeason { slug: string; start: string; end: string; approx?: boolean; quiet?: boolean; election?: boolean }

export const calendarSeasons: CalendarSeason[] = [
  { slug: "after-holidays", start: "2026-10-04", end: "2026-10-31" },
  { slug: "knesset-elections-2026", start: "2026-10-27", end: "2026-10-27", election: true },
  { slug: "singles-day", start: "2026-11-11", end: "2026-11-11" },
  { slug: "black-friday", start: "2026-11-27", end: "2026-11-30" },
  { slug: "hanukkah", start: "2026-12-04", end: "2026-12-12" },
  { slug: "tax-year-end", start: "2026-12-20", end: "2026-12-31" },
  { slug: "silvester", start: "2026-12-31", end: "2026-12-31" },
  { slug: "tu-bishvat", start: "2027-01-23", end: "2027-01-23", approx: true },
  { slug: "family-day", start: "2027-02-07", end: "2027-02-07", approx: true },
  { slug: "valentines", start: "2027-02-14", end: "2027-02-14" },
  { slug: "purim", start: "2027-03-23", end: "2027-03-23", approx: true },
  { slug: "pre-passover", start: "2027-03-28", end: "2027-04-20" },
  { slug: "passover", start: "2027-04-21", end: "2027-04-28", approx: true },
  { slug: "holocaust-memorial-day", start: "2027-05-04", end: "2027-05-04", approx: true, quiet: true },
  { slug: "memorial-day", start: "2027-05-11", end: "2027-05-11", approx: true, quiet: true },
  { slug: "independence-day", start: "2027-05-12", end: "2027-05-12", approx: true },
  { slug: "lag-baomer", start: "2027-05-25", end: "2027-05-25", approx: true },
  { slug: "shavuot", start: "2027-06-11", end: "2027-06-11", approx: true },
  { slug: "summer", start: "2027-07-01", end: "2027-08-31" },
  { slug: "tu-beav", start: "2027-08-18", end: "2027-08-18", approx: true },
  { slug: "back-to-school", start: "2027-09-01", end: "2027-09-01" },
];

/** Months the calendar can show: from this month for 12 months. */
export const CALENDAR_FIRST_MONTH = MOCK_TODAY.slice(0, 7); // "2026-10"
export const CALENDAR_MONTHS = 12;

export interface CampaignFlight { id: string; name: string; start: string; end: string; open: boolean; goal: CampaignGoal }
export const campaignFlights: CampaignFlight[] = campaigns
  .filter((c) => c.status !== "rejected" && c.status !== "draft")
  .map((c) => ({
    id: c.id,
    name: c.name,
    start: c.startDate,
    end: c.endDate ?? c.lastDeliveryDate ?? MOCK_TODAY,
    open: c.status === "active" && !c.endDate,
    goal: c.goal,
  }));

/* ---------- "התוכנית שלי" — 30-day plan (S.3) ---------- */
export type PlanItemKind = "video" | "trend" | "campaign" | "post";
export type PlanItemStatus = "planned" | "in_progress" | "done" | "skipped";

export interface PlanItem {
  id: string;
  plannedFor: string;
  kind: PlanItemKind;
  title: string;
  why: string;
  seasonSlug?: string;
  hookId?: string;
  href: string;
  status: PlanItemStatus;
}

export const monthlyPlan = {
  month: "2026-10",
  from: "2026-10-17",
  to: "2026-11-15",
  createdAt: "2026-10-17T07:00:00+03:00",
  inputs: { niche: "מספרות וברברשופ", goal: "פניות בוואטסאפ", area: "רמת גן והסביבה", monthlyBudgetIls: 1200 },
  campaignSuggestions: [
    { id: "cs-1", title: "להמשיך את \"אחרי החגים\" עד סוף אוקטובר", why: "ההוק המנצח עדיין מביא פניות בפחות כסף. סוף החודש הוא עוד זמן טוב לתור אחרי החגים.", dailyBudgetIls: 40, goalHe: "הודעות בוואטסאפ", href: "/app/campaigns/cmp-after-holidays", start: "2026-10-17" },
    { id: "cs-2", title: "קמפיין חנוכה: שובר מתנה לתספורת", why: "חנוכה מתחיל ב-4 בדצמבר. כדאי לעלות שבועיים לפני, כשאנשים מתחילים לחפש מתנות.", dailyBudgetIls: 40, goalHe: "הודעות בוואטסאפ", href: "/app/campaigns/new?season=hanukkah", start: "2026-11-20" },
  ],
  items: [
    { id: "pi-01", plannedFor: "2026-10-17", kind: "campaign", title: "להגביר את ההוק המנצח של \"אחרי החגים\"", why: "ההוק ב׳ מביא פנייה בפחות כסף משני האחרים", href: "/app/campaigns/cmp-after-holidays", status: "done" },
    { id: "pi-02", plannedFor: "2026-10-18", kind: "post", title: "רילס: תספורת לחתונה, מתי לקבוע תור", why: "עונת החתונות של הסתיו", hookId: "barbers-salons-09", href: "/app/publish", status: "in_progress" },
    { id: "pi-03", plannedFor: "2026-10-20", kind: "trend", title: "טרנד \"לפני ואחרי בשנייה\" למספרות", why: "פורמט שעובד השבוע בנישה שלכם", href: "/app/trends", status: "planned" },
    { id: "pi-04", plannedFor: "2026-10-21", kind: "post", title: "רילס ניסיון: 3 שאלות שספר טוב שואל", why: "בודקים הוק חדש מול קהל שלא עוקב אחריכם", hookId: "barbers-salons-07", href: "/app/publish", status: "in_progress" },
    { id: "pi-05", plannedFor: "2026-10-23", kind: "video", title: "סרטון חדש: שישי בבוקר במספרה", why: "הסרטון הקודם בסגנון הזה הביא הרבה שמירות", hookId: "barbers-salons-10", href: "/app/create?hook=barbers-salons-10", status: "planned" },
    { id: "pi-06", plannedFor: "2026-10-26", kind: "post", title: "שעות פתיחה ביום הבחירות", why: "יום הבחירות (27.10) הוא יום שבתון. בלי שום תוכן פוליטי", seasonSlug: "knesset-elections-2026", href: "/app/publish/new", status: "planned" },
    { id: "pi-07", plannedFor: "2026-10-28", kind: "video", title: "גרסה חדשה להוק \"תפסיקו לחפוף כל יום\"", why: "ההוק עצר אנשים, אבל מעט נשארו עד הסוף. נקצר את הפתיחה", hookId: "barbers-salons-03", href: "/app/create?hook=barbers-salons-03", status: "planned" },
    { id: "pi-08", plannedFor: "2026-10-30", kind: "campaign", title: "להחזיר את קמפיין הלידים לחתונות", why: "הטופס הביא לידים במחיר טוב עד שהושהה", href: "/app/campaigns/new?duplicate=cmp-wedding-leads", status: "planned" },
    { id: "pi-09", plannedFor: "2026-11-02", kind: "trend", title: "טרנד \"POV: הספר בחופש\"", why: "ההוק הזה הוא המנצח שלכם בקמפיין", hookId: "barbers-salons-06", href: "/app/trends", status: "planned" },
    { id: "pi-10", plannedFor: "2026-11-05", kind: "video", title: "שובר מתנה לחנוכה: מכינים מראש", why: "חנוכה ב-4 בדצמבר. סרטון מוכן מראש חוסך לחץ בסוף נובמבר", seasonSlug: "hanukkah", href: "/app/create?season=hanukkah", status: "planned" },
    { id: "pi-11", plannedFor: "2026-11-09", kind: "post", title: "שיער מתולתל, בניסוח חדש", why: "המודעה נדחתה בגלל הניסוח. כפוסט רגיל, בגוף שלישי, זה עובד", hookId: "barbers-salons-08", href: "/app/publish/new", status: "planned" },
    { id: "pi-12", plannedFor: "2026-11-13", kind: "post", title: "סיכום החודש: 3 התספורות שהכי ביקשו", why: "פוסט פשוט שמחזק אמון לפני עונת החגים", href: "/app/publish/new", status: "planned" },
  ] satisfies PlanItem[],
};
