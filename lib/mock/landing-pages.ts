/**
 * Mock data for "דף העסק" (spec 07–08 §S.1 + §S.7 — a PAID feature).
 * Both businesses are fictional samples from Appendix D (§3 "גחלת", §7 "סטודיו גוונים") and every
 * public page built from this file is labelled as a sample. Phone numbers are placeholders on purpose.
 */
import type { TileArt, TileTone } from "@/lib/mock/trends-app";

export type LandingStatus = "draft" | "published" | "unpublished";
export type LandingAccent = "gold" | "rose" | "violet";
export type BusinessIdType = "osek_murshe" | "osek_patur" | "company";

export interface LandingService { id: string; nameHe: string; descriptionHe: string; priceFromIls: number | null }
/** days: 0 = Sunday … 6 = Saturday (Asia/Jerusalem). open/close "HH:MM"; null = closed. */
export interface LandingHours { id: string; labelHe: string; days: number[]; open: string | null; close: string | null }
export interface LandingFaq { id: string; q: string; a: string }
export interface LeadFormFields { email: boolean; message: boolean; preferredTime: boolean }

/** LandingPageContentV1 (§S.1): hero video, H1, subline, 3 benefits, services, hours, address, WhatsApp, phone, lead form, FAQ ≤ 5, legal footer. */
export interface LandingPageContent {
  version: 1;
  heroVideoId: string;
  h1: string;
  subline: string;
  benefits: [string, string, string];
  services: LandingService[];
  hours: LandingHours[];
  address: { street: string; city: string };
  whatsapp: string;
  whatsappPrefill: string;
  phone: string;
  leadForm: { fields: LeadFormFields; submitLabel: string };
  faq: LandingFaq[];
  legal: { legalName: string; idType: BusinessIdType; idNumber: string };
}

export interface BusinessProfile {
  nameHe: string;
  nicheSlug: string;
  nicheIcon: string;
  accent: LandingAccent;
  city: string;
}

export interface HeroVideo { id: string; titleHe: string; hookHe: string; durationSec: number; art: TileArt; tone: TileTone }

export interface LandingPage {
  id: string;
  slug: string;
  status: LandingStatus;
  business: BusinessProfile;
  content: LandingPageContent;
  /** Static mock strings (no Date math during prerender). */
  updatedAtHe: string;
  publishedAtHe?: string;
  /** Sample numbers, shown with the "נתוני דוגמה" label. */
  stats?: { views: number; leads: number };
  heroVideos: HeroVideo[];
}

export const LANDING_LIMITS = {
  h1: 60,
  subline: 160,
  benefit: 60,
  services: 6,
  faq: 5,
  slugMin: 3,
  slugMax: 40,
} as const;

/** Credit action `landing.generate` = 10 credits per generation/regeneration (§S.7). Edits and publishing are free. */
export const LANDING_GENERATE_CREDITS = 10;

export const RESERVED_SLUGS = [
  "admin", "api", "app", "b", "blog", "help", "kdimon", "legal", "login", "logout", "new", "pricing", "privacy",
  "signup", "support", "terms", "trends", "www",
];

export const wazeHref = (a: { street: string; city: string }) =>
  `https://waze.com/ul?q=${encodeURIComponent(`${a.street}, ${a.city}`)}&navigate=yes`;

// ---------- Sample 1: "גחלת – גריל בר שכונתי", פתח תקווה (fictional, App D §3) ----------
const GAHELET_VIDEOS: HeroVideo[] = [
  { id: "v-sign", titleHe: "רילס \"פיתיון ושלט\"", hookHe: "בואו לאכול אצלנו. אנחנו בפתח תקווה", durationSec: 15, art: "sign", tone: "gold" },
  { id: "v-coals", titleHe: "רילס \"גחלים פתוחות\"", hookHe: "הכול נצלה על גחלים, מול העיניים", durationSec: 30, art: "satisfying", tone: "rose" },
  { id: "v-price", titleHe: "רילס \"כמה זה עולה באמת\"", hookHe: "כמה עולה ארוחה זוגית אצלנו?", durationSec: 15, art: "price", tone: "gold" },
];

const GAHELET_CONTENT: LandingPageContent = {
  version: 1,
  heroVideoId: "v-sign",
  h1: "גריל על גחלים פתוחות, באמצע פתח תקווה",
  subline: "פיתות מהטאבון, סלטים חופשי לשולחן ושיפודים לבחירה. רוצים שולחן להערב? שלחו וואטסאפ.",
  benefits: [
    "הכול נצלה על גחלים, מול העיניים שלכם",
    "פיתות חמות מהטאבון, כל ערב",
    "סלטים חופשי לשולחן, בלי תוספת",
  ],
  services: [
    { id: "s1", nameHe: "ארוחה זוגית", descriptionHe: "שיפודים לבחירה, סלטים ופיתות לשניים", priceFromIls: null },
    { id: "s2", nameHe: "שיפודים על האש", descriptionHe: "פרגית, קבב וכבד עוף, עם פיתה מהטאבון", priceFromIls: null },
    { id: "s3", nameHe: "אירועים קטנים", descriptionHe: "ימי הולדת ומפגשי צוות עד 30 איש, בתיאום מראש", priceFromIls: null },
  ],
  hours: [
    { id: "h1", labelHe: "ראשון–חמישי", days: [0, 1, 2, 3, 4], open: "12:00", close: "23:00" },
    { id: "h2", labelHe: "שישי", days: [5], open: "11:00", close: "15:00" },
    { id: "h3", labelHe: "שבת", days: [6], open: null, close: null },
  ],
  address: { street: "רחוב החרושת 7", city: "פתח תקווה" },
  whatsapp: "050-0000000",
  whatsappPrefill: "היי, ראינו את הסרטון ורוצים שולחן להערב",
  phone: "03-0000000",
  leadForm: { fields: { email: false, message: true, preferredTime: true }, submitLabel: "שליחת בקשה לשולחן" },
  faq: [
    { id: "f1", q: "אפשר להזמין שולחן מראש?", a: "כן. שלחו וואטסאפ או השאירו פרטים בטופס, ונחזור אליכם לאישור." },
    { id: "f2", q: "יש מקום לקבוצות?", a: "יש. עד 30 איש, בתיאום מראש בוואטסאפ." },
    { id: "f3", q: "אפשר לקחת הביתה?", a: "כן. מזמינים בטלפון או בוואטסאפ, ואוספים מהדלפק." },
  ],
  legal: { legalName: "גחלת גריל בע״מ", idType: "company", idNumber: "000000000" },
};

/** Alternative copy returned by "יצירה מחדש" (mock of `landing.copy.v1`), cycled in order. */
export const GAHELET_REGENERATIONS: Pick<LandingPageContent, "h1" | "subline" | "benefits">[] = [
  {
    h1: "שיפודים על גחלים ופיתה מהטאבון, בפתח תקווה",
    subline: "גריל בר שכונתי עם סלטים חופשי לשולחן. בואו באמצע השבוע, או שלחו וואטסאפ ונשמור לכם מקום.",
    benefits: ["גחלים פתוחות מול הסועדים", "פיתה חמה לכל שולחן", "סלטים בלי הגבלה"],
  },
  {
    h1: "ערב טוב מתחיל בגחלים",
    subline: "גחלת, גריל בר שכונתי בפתח תקווה: שיפודים לבחירה, פיתות מהטאבון וסלטים חופשי. שולחן להערב? וואטסאפ אחד.",
    benefits: ["רואים את הצלייה מול העיניים", "פיתות יוצאות מהטאבון כל הערב", "מקום לקבוצות עד 30 איש"],
  },
];

// ---------- Sample 2: "סטודיו גוונים", כפר סבא (fictional, App D §7; the team is all women per the brief) ----------
const GVANIM_VIDEOS: HeroVideo[] = [
  { id: "v-pov", titleHe: "רילס POV", hookHe: "יש לכם אירוע בעוד יומיים, ואין תור בשום מקום", durationSec: 15, art: "pov_label", tone: "rose" },
  { id: "v-asmr", titleHe: "רילס \"תהליך מספק\"", hookHe: "הדבר הכי מספק שתראו היום", durationSec: 15, art: "satisfying", tone: "violet" },
];

const GVANIM_CONTENT: LandingPageContent = {
  version: 1,
  heroVideoId: "v-pov",
  h1: "לק ג׳ל, בנייה ועיצוב ציפורניים בכפר סבא",
  subline: "קובעים תור בוואטסאפ ומגיעים. בחנוכה אנחנו פתוחות כל ערב עד 22:00.",
  benefits: [
    "תור בוואטסאפ, בלי לחכות לטלפון",
    "כלים מעוקרים לכל לקוחה",
    "עיצוב לפי תמונה שתביאו",
  ],
  services: [
    { id: "s1", nameHe: "לק ג׳ל", descriptionHe: "כולל הכנה ומניקור יבש", priceFromIls: 120 },
    { id: "s2", nameHe: "בניית ציפורניים", descriptionHe: "ג׳ל או אקריל, לפי מה שמתאים לכם", priceFromIls: null },
    { id: "s3", nameHe: "עיצוב ואמנות", descriptionHe: "קישוטים ועיצובים לפי בקשה", priceFromIls: null },
  ],
  hours: [
    { id: "h1", labelHe: "ראשון–חמישי", days: [0, 1, 2, 3, 4], open: "09:00", close: "20:00" },
    { id: "h2", labelHe: "שישי", days: [5], open: "08:30", close: "14:00" },
    { id: "h3", labelHe: "שבת", days: [6], open: null, close: null },
  ],
  address: { street: "רחוב התעשייה 3", city: "כפר סבא" },
  whatsapp: "050-0000000",
  whatsappPrefill: "היי, אפשר לקבוע תור ללק ג׳ל?",
  phone: "09-0000000",
  leadForm: { fields: { email: false, message: true, preferredTime: true }, submitLabel: "בקשת תור" },
  faq: [
    { id: "f1", q: "כמה זמן מחזיק לק ג׳ל?", a: "בדרך כלל שלושה עד ארבעה שבועות, תלוי בציפורן ובשגרה." },
    { id: "f2", q: "צריך לקבוע תור מראש?", a: "כן. הכי מהיר בוואטסאפ, ואם יש חלון פנוי באותו יום, נגיד לכם." },
    { id: "f3", q: "אפשר להביא עיצוב מתמונה?", a: "בטח. שלחו תמונה בוואטסאפ, ונגיד אם זה אפשרי וכמה זמן זה לוקח." },
  ],
  legal: { legalName: "גוונים סטודיו לציפורניים", idType: "osek_murshe", idNumber: "000000000" },
};

/** The current workspace's page (in-app, plan "starter" = 1 page). */
export const WORKSPACE_PAGES: LandingPage[] = [
  {
    id: "lp-gahelet",
    slug: "gahelet-grill",
    status: "published",
    business: { nameHe: "גחלת – גריל בר שכונתי", nicheSlug: "restaurants", nicheIcon: "UtensilsCrossed", accent: "gold", city: "פתח תקווה" },
    content: GAHELET_CONTENT,
    updatedAtHe: "16 באוקטובר 2026",
    publishedAtHe: "14 באוקטובר 2026",
    stats: { views: 312, leads: 9 },
    heroVideos: GAHELET_VIDEOS,
  },
];

/** Public sample pages served at /b/[slug]. */
export const PUBLIC_PAGES: LandingPage[] = [
  WORKSPACE_PAGES[0],
  {
    id: "lp-gvanim",
    slug: "gvanim-nails",
    status: "published",
    business: { nameHe: "סטודיו גוונים", nicheSlug: "beauty-nails", nicheIcon: "Brush", accent: "rose", city: "כפר סבא" },
    content: GVANIM_CONTENT,
    updatedAtHe: "12 באוקטובר 2026",
    publishedAtHe: "12 באוקטובר 2026",
    heroVideos: GVANIM_VIDEOS,
  },
];

export const NEW_PAGE_ID = "new";

export const getWorkspacePage = (id: string) => WORKSPACE_PAGES.find((p) => p.id === id);
export const getPublicPage = (slug: string) => PUBLIC_PAGES.find((p) => p.slug === slug && p.status === "published");

/** What `landing.copy.v1` would draft for a new page from the brand kit + niche + best video (mock). */
export function draftForNewPage(): LandingPage {
  const base = WORKSPACE_PAGES[0];
  return {
    ...base,
    id: NEW_PAGE_ID,
    slug: "gahelet",
    status: "draft",
    stats: undefined,
    publishedAtHe: undefined,
    content: { ...base.content, ...GAHELET_REGENERATIONS[0] },
  };
}

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export function slugError(slug: string, ownId: string): "format" | "length" | "reserved" | "taken" | null {
  if (slug.length < LANDING_LIMITS.slugMin || slug.length > LANDING_LIMITS.slugMax) return "length";
  if (!SLUG_RE.test(slug)) return "format";
  if (RESERVED_SLUGS.includes(slug)) return "reserved";
  if (PUBLIC_PAGES.some((p) => p.slug === slug && p.id !== ownId)) return "taken";
  return null;
}
