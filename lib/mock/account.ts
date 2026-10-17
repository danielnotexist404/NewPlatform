/**
 * Sample data for the account & library screens (brand, billing, settings, team, clients, media,
 * templates, in-app hooks). EVERYTHING HERE IS SAMPLE DATA ("דוגמה") until Supabase is connected;
 * the shapes mirror the Part 04 tables/DTOs so the mock can be swapped for data-access functions.
 * Dates are ISO strings (never `new Date()` here — Server Components prerender with cacheComponents).
 */
import type { PlanId } from "@/lib/data/plans";

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */
export type MemberRole = "owner" | "admin" | "editor" | "viewer";
export type GenderForm = "plural" | "female" | "male";

export const TODAY_ISO = "2026-10-17";

export const MOCK_PROFILE = {
  id: "u-1",
  fullName: "ליה כהן",
  email: "lia@example.co.il",
  role: "owner" as MemberRole,
  genderForm: "plural" as GenderForm,
  larger_captions: false,
};

export const MOCK_WORKSPACE = {
  id: "ws-1",
  name: "סטודיו ליה",
  nicheSlug: "beauty-nails",
  type: "own" as "own" | "agency" | "client",
  planId: "business" as PlanId,
  cycle: "monthly" as "monthly" | "annual",
  hasPaid: true,
  whiteLabel: false,
  billingEmail: "lia@example.co.il",
};

/** Feature flags that change what these screens show (Part 04 flags; seed defaults are off). */
export const MOCK_FLAGS = {
  annual_billing: true,
  whatsapp_notify: true,
  bitEnabled: false,
  meta_ads: true,
};

/** Limits that are not in lib/data/plans.ts yet (Part 04 `plans.limits`). */
export const PLAN_EXTRA_LIMITS: Record<PlanId, { seats: number; brandKits: number | null; clientWorkspaces: number }> = {
  free: { seats: 1, brandKits: 1, clientWorkspaces: 0 },
  starter: { seats: 1, brandKits: 1, clientWorkspaces: 0 },
  business: { seats: 3, brandKits: 3, clientWorkspaces: 0 },
  agency: { seats: 10, brandKits: null, clientWorkspaces: 15 },
};

/* ------------------------------------------------------------------ */
/* Billing                                                             */
/* ------------------------------------------------------------------ */
export const MOCK_CREDIT_SUMMARY = {
  balance: 816,
  reserved: 107,
  planAllowance: 1000,
  expiring30d: 20,
  nextResetAt: "2026-11-08",
};

export const MOCK_SUBSCRIPTION = {
  planId: "business" as PlanId,
  cycle: "monthly" as "monthly" | "annual",
  status: "active" as "active" | "past_due" | "canceled" | "expired",
  cancelAtPeriodEnd: false,
  priceIls: 289,
  periodStart: "2026-10-08",
  periodEnd: "2026-11-08",
  firstPaidAt: "2026-10-08",
  scheduledChange: null as null | { planId: PlanId; at: string },
};

export const MOCK_PAYMENT_METHOD = { brandHe: "ויזה", last4: "4242", mm: "08", yy: "28" };

export const TYPICAL_VIDEO_CREDITS = 50;
export const ALLOCATION_THRESHOLD_ILS = 5000;
export const CANCEL_FEE_CAP_ILS = 100;

export type UsageCategory = "videos" | "scenes" | "rerenders" | "scripts" | "other";
export const MOCK_USAGE: { category: UsageCategory; credits: number }[] = [
  { category: "videos", credits: 130 },
  { category: "scenes", credits: 8 },
  { category: "rerenders", credits: 0 },
  { category: "scripts", credits: 1 },
  { category: "other", credits: 10 },
];

export type LedgerKind =
  | "grant_trial" | "grant_plan" | "grant_rollover" | "purchase" | "promo" | "expire"
  | "reserve" | "capture" | "release" | "refund" | "adjustment";

export interface LedgerRow {
  id: string;
  at: string;
  kind: LedgerKind;
  descriptionHe: string;
  delta: number;
  balanceAfter: number;
  projectId?: string;
}

/** Newest first. */
export const MOCK_LEDGER: LedgerRow[] = [
  { id: "l17", at: "2026-10-17T09:12", kind: "reserve", descriptionHe: "דף העסק: יצירה", delta: -10, balanceAfter: 816 },
  { id: "l16", at: "2026-10-16T18:40", kind: "reserve", descriptionHe: "שמירה ליצירה: מבצע חנוכה בסטודיו", delta: -107, balanceAfter: 826, projectId: "p-hanukkah" },
  { id: "l15", at: "2026-10-15T11:05", kind: "capture", descriptionHe: "חיוב בפועל: 5 וריאציות להוק", delta: 0, balanceAfter: 933 },
  { id: "l14", at: "2026-10-15T11:04", kind: "reserve", descriptionHe: "5 וריאציות להוק", delta: -1, balanceAfter: 933 },
  { id: "l13", at: "2026-10-14T16:22", kind: "reserve", descriptionHe: "יצירה מחדש של סצנה 3: גבות, יום 1 מול יום 30", delta: -8, balanceAfter: 934, projectId: "p-brows" },
  { id: "l12", at: "2026-10-13T10:30", kind: "reserve", descriptionHe: "יצירה: סיור בסטודיו", delta: -23, balanceAfter: 942, projectId: "p-tour" },
  { id: "l11", at: "2026-10-11T14:02", kind: "refund", descriptionHe: "יצירה שנכשלה: הקרדיטים הוחזרו", delta: 50, balanceAfter: 965, projectId: "p-brows" },
  { id: "l10", at: "2026-10-11T13:55", kind: "reserve", descriptionHe: "שמירה ליצירה: גבות, יום 1 מול יום 30", delta: -50, balanceAfter: 915, projectId: "p-brows" },
  { id: "l9", at: "2026-10-09T12:15", kind: "capture", descriptionHe: "חיוב בפועל: לק ג׳ל שמחזיק 4 שבועות", delta: 0, balanceAfter: 965 },
  { id: "l8", at: "2026-10-09T12:01", kind: "reserve", descriptionHe: "שמירה ליצירה: לק ג׳ל שמחזיק 4 שבועות", delta: -107, balanceAfter: 965, projectId: "p-gel" },
  { id: "l7", at: "2026-10-08T08:00", kind: "grant_plan", descriptionHe: "מכסה חודשית: תוכנית עסק", delta: 1000, balanceAfter: 1072 },
  { id: "l6", at: "2026-10-04T17:31", kind: "release", descriptionHe: "החזר של מה שלא נוצל ביצירה", delta: 9, balanceAfter: 72, projectId: "p-gel" },
  { id: "l5", at: "2026-10-04T17:10", kind: "reserve", descriptionHe: "שמירה ליצירה: לק ג׳ל שמחזיק 4 שבועות (טיוטה)", delta: -107, balanceAfter: 63, projectId: "p-gel" },
  { id: "l4", at: "2026-10-03T20:45", kind: "purchase", descriptionHe: "רכישת חבילה: 150 קרדיטים", delta: 150, balanceAfter: 170 },
  { id: "l3", at: "2026-10-02T19:20", kind: "capture", descriptionHe: "חיוב בפועל: רילס ראשון", delta: 0, balanceAfter: 20 },
  { id: "l2", at: "2026-10-02T19:02", kind: "reserve", descriptionHe: "שמירה ליצירה: רילס ראשון", delta: -50, balanceAfter: 20, projectId: "p-first" },
  { id: "l1", at: "2026-10-01T09:00", kind: "grant_trial", descriptionHe: "קרדיטי ניסיון בהרשמה", delta: 70, balanceAfter: 70 },
];

export type InvoiceKind = "tax_invoice_receipt" | "credit_invoice" | "receipt";
export const MOCK_INVOICES: { id: string; docNumber: number; at: string; kind: InvoiceKind; amountIls: number; allocationNumber: string | null }[] = [
  { id: "inv-2", docNumber: 10002, at: "2026-10-08", kind: "tax_invoice_receipt", amountIls: 289, allocationNumber: null },
  { id: "inv-1", docNumber: 10001, at: "2026-10-03", kind: "tax_invoice_receipt", amountIls: 59, allocationNumber: null },
];

export const MOCK_BILLING_PROFILE = {
  legalName: "ליה כהן",
  isBusiness: false,
  vatId: "",
  email: "lia@example.co.il",
  address: "",
  city: "רמת גן",
  zip: "",
  phone: "",
};

/** Quote from GET /api/billing/cancel/quote — computed like lib/billing/refunds.ts (sample numbers). */
export const MOCK_CANCEL_QUOTE = {
  effectiveAt: "2026-11-08",
  refundEligible: true,
  reasonCode: "distance_14d" as "distance_14d" | "annual_prorata" | "extended",
  paidAt: "2026-10-08",
  paidIls: 289,
  usedCredits: 149,
  consumedValueIls: 43.06,
  feeIls: 14.45,
  refundIls: 231.49,
  creditsExpireAt: "2026-12-08",
  annualMonthsLeft: 7,
  annualRefundIls: 1617,
};

/** Upgrade quote business → agency (PlanChangeResponse, dryRun) — sample numbers. */
export const MOCK_PLAN_CHANGE_QUOTES: Partial<Record<PlanId, { chargeNowIls: number; creditsGrantedNow: number }>> = {
  agency: { chargeNowIls: 497.42, creditsGrantedNow: 1632 },
};

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
export type CaptionPresetId = "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";
export type CtaType = "whatsapp" | "call" | "booking" | "link_in_bio" | "navigate" | "lead_form" | "comment_keyword" | "save_share" | "visit_site";
export type MusicMood = "energetic" | "warm" | "luxury" | "funny" | "calm" | "inspiring" | "urban";
export type BrandFont = "Heebo" | "Rubik" | "Assistant" | "Secular One" | "Suez One" | "Fredoka" | "Karantina";

export interface BrandKit {
  id: string;
  name: string;
  isDefault: boolean;
  usedInProjects: number;
  logoText: string;
  colors: { primary: string; secondary: string; accent: string; text: string };
  fonts: { heading: BrandFont; body: BrandFont };
  captionPreset: CaptionPresetId;
  captionHighlight: string;
  introStyle: "none" | "logo_reveal" | "title_card";
  lowerThird: "glass" | "solid" | "none";
  watermark: { on: boolean; position: "top_start" | "top_end" | "bottom_start" | "bottom_end"; opacity: number };
  endCard: {
    ctaType: CtaType;
    headline: string;
    whatsappNumber: string;
    whatsappPrefill: string;
    showPhone: boolean; showWhatsapp: boolean; showWebsite: boolean; showAddress: boolean;
    showInstagram: boolean; showQr: boolean; logoBug: boolean;
    disclaimer: string; license: string;
  };
  defaultVoiceId: string | null;
  musicMood: MusicMood | null;
  shekelFormat: "prefix" | "suffix";
}

export const MOCK_BRAND_KITS: BrandKit[] = [
  {
    id: "kit-studio",
    name: "סטודיו ליה",
    isDefault: true,
    usedInProjects: 6,
    logoText: "ליה",
    colors: { primary: "#D9467A", secondary: "#1B1420", accent: "#F4B860", text: "#FFFFFF" },
    fonts: { heading: "Secular One", body: "Heebo" },
    captionPreset: "bold-pop",
    captionHighlight: "#F4B860",
    introStyle: "logo_reveal",
    lowerThird: "glass",
    watermark: { on: true, position: "top_end", opacity: 70 },
    endCard: {
      ctaType: "whatsapp",
      headline: "שלחו לנו וואטסאפ",
      whatsappNumber: "050-1234567",
      whatsappPrefill: "היי, ראיתי את הסרטון על לק ג׳ל ואשמח לפרטים",
      showPhone: true, showWhatsapp: true, showWebsite: false, showAddress: true,
      showInstagram: true, showQr: false, logoBug: true,
      disclaimer: "", license: "",
    },
    defaultVoiceId: "v-f-warm",
    musicMood: "warm",
    shekelFormat: "prefix",
  },
  {
    id: "kit-holidays",
    name: "קמפיין חגים",
    isDefault: false,
    usedInProjects: 1,
    logoText: "ליה",
    colors: { primary: "#2F5BD3", secondary: "#0E1630", accent: "#FFD166", text: "#FFFFFF" },
    fonts: { heading: "Suez One", body: "Assistant" },
    captionPreset: "poster",
    captionHighlight: "#FFD166",
    introStyle: "title_card",
    lowerThird: "solid",
    watermark: { on: false, position: "bottom_end", opacity: 60 },
    endCard: {
      ctaType: "booking",
      headline: "קבעו תור אונליין",
      whatsappNumber: "050-1234567",
      whatsappPrefill: "היי, ראיתי את הסרטון ואשמח לפרטים",
      showPhone: true, showWhatsapp: false, showWebsite: false, showAddress: false,
      showInstagram: true, showQr: true, logoBug: true,
      disclaimer: "", license: "",
    },
    defaultVoiceId: "v-m-energetic",
    musicMood: "energetic",
    shekelFormat: "prefix",
  },
];

export const getBrandKit = (id: string) => MOCK_BRAND_KITS.find((k) => k.id === id);

export const MOCK_VOICES = [
  { id: "v-f-warm", gender: "female" as const, nameHe: "קריינית חמה", ageHe: "בוגרת", toneHe: "חמה ובטוחה" },
  { id: "v-f-young", gender: "female" as const, nameHe: "קריינית צעירה", ageHe: "צעירה", toneHe: "קלילה ואנרגטית" },
  { id: "v-m-energetic", gender: "male" as const, nameHe: "קריין אנרגטי", ageHe: "צעיר", toneHe: "מהיר ונלהב" },
  { id: "v-m-calm", gender: "male" as const, nameHe: "קריין רגוע", ageHe: "בוגר", toneHe: "רגוע ואמין" },
];

export type ServiceGender = "m" | "f";
export const MOCK_BUSINESS_PROFILE = {
  name: "סטודיו ליה",
  nicheSlug: "beauty-nails",
  city: "רמת גן",
  area: "גוש דן",
  description: "סטודיו לציפורניים וגבות ברמת גן. לק ג׳ל, בניית ציפורניים ועיצוב גבות, בתיאום מראש.",
  usp: "כל טיפול מתחיל בהכנה יסודית של הציפורן, ולכן הלק מחזיק יותר.",
  services: [
    { id: "s1", name: "לק ג׳ל", gender: "m" as ServiceGender, definite: "הלק ג׳ל" },
    { id: "s2", name: "בניית ציפורניים", gender: "f" as ServiceGender, definite: "בניית הציפורניים" },
    { id: "s3", name: "עיצוב גבות", gender: "m" as ServiceGender, definite: "עיצוב הגבות" },
    { id: "s4", name: "הרמת ריסים", gender: "f" as ServiceGender, definite: "הרמת הריסים" },
  ],
  phone: "050-1234567",
  whatsapp: "050-1234567",
  website: "",
  instagram: "@studio.lia",
  facebook: "",
  address: "רחוב ביאליק, רמת גן",
  audience: "plural" as "plural" | "female" | "male",
  register: "warm" as "formal" | "warm" | "casual" | "slang",
  preferredCta: "whatsapp" as CtaType,
  facts: [
    { id: "f1", label: "שנות ניסיון", value: "8" },
    { id: "f2", label: "דירוג בגוגל", value: "4.9" },
  ],
};

/** "עדכון מהאתר" comparison (sample result of POST /api/brand/extract). */
export const MOCK_EXTRACT_DIFF = [
  { field: "description", labelHe: "תיאור קצר", was: MOCK_BUSINESS_PROFILE.description, now: "סטודיו לציפורניים, גבות וריסים ברמת גן. לק ג׳ל, בנייה, עיצוב גבות והרמת ריסים, בתיאום מראש." },
  { field: "services", labelHe: "שירותים", was: "לק ג׳ל · בניית ציפורניים · עיצוב גבות · הרמת ריסים", now: "לק ג׳ל · בניית ציפורניים · עיצוב גבות · הרמת ריסים · מניקור רוסי" },
  { field: "phone", labelHe: "טלפון", was: "050-1234567", now: "050-1234567" },
];

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */
export type NotificationKind =
  | "job_succeeded" | "job_failed" | "credits_low" | "approval_received" | "payment_failed" | "invite"
  | "lead_received" | "meta_campaign_live" | "meta_ad_rejected" | "weekly_results"
  | "spend_cap_warning" | "meta_connection_lost" | "social_post_published" | "social_post_failed";

export const MOCK_NOTIFICATION_PREFS: Partial<Record<NotificationKind, { email: boolean; whatsapp: boolean }>> = {
  social_post_published: { email: false, whatsapp: false },
};

export const MOCK_CONSENTS = [
  { kind: "terms" as const, version: "2026-10", at: "2026-10-01", granted: true },
  { kind: "privacy" as const, version: "2026-10", at: "2026-10-01", granted: true },
  { kind: "marketing_email" as const, version: "2026-10", at: "2026-10-01", granted: false },
  { kind: "analytics_cookies" as const, version: "2026-10", at: "2026-10-01", granted: true },
];

export const MOCK_PRONUNCIATION = [
  { id: "pr1", term: "ג׳ל", sayAs: "גֶ׳ל", note: "" },
  { id: "pr2", term: "מיקרובליידינג", sayAs: "מִיקְרוֹ-בְּלֵיידִינְג", note: "בלי הדגשה על ה-ר" },
  { id: "pr3", term: "פינטרסט", sayAs: "פִּינְטֶרֶסְט", note: "" },
];

/* ------------------------------------------------------------------ */
/* Team & clients                                                      */
/* ------------------------------------------------------------------ */
export const MOCK_MEMBERS = [
  { id: "u-1", name: "ליה כהן", email: "lia@example.co.il", role: "owner" as MemberRole, joinedAt: "2026-10-01", isYou: true },
  { id: "u-2", name: "נועם לוי", email: "noam@example.co.il", role: "admin" as MemberRole, joinedAt: "2026-10-05", isYou: false },
  { id: "u-3", name: "מיכל אברהם", email: "michal@example.co.il", role: "viewer" as MemberRole, joinedAt: "2026-10-12", isYou: false },
];

export const MOCK_INVITES = [
  { id: "i-1", email: "dana@example.co.il", role: "editor" as MemberRole, sentRelativeHe: "לפני יומיים", expiresAt: "2026-10-22" },
];

export const MOCK_CLIENTS = [
  { id: "c-1", name: "גריל בר שכונתי", initials: "ג", colors: ["#E2572B", "#1A1210", "#F2C14E", "#FFFFFF"], projects: 9, lastActivityHe: "לפני 3 שעות", creditsThisMonth: 342, pendingApprovals: 2 },
  { id: "c-2", name: "סטודיו פילאטיס בצפון", initials: "ס", colors: ["#3FA796", "#0F2422", "#F5E6C8", "#FFFFFF"], projects: 5, lastActivityHe: "אתמול", creditsThisMonth: 160, pendingApprovals: 0 },
  { id: "c-3", name: "שיפוצים בעמק", initials: "ש", colors: ["#2E5AAC", "#0C1730", "#FFB547", "#FFFFFF"], projects: 3, lastActivityHe: "לפני 4 ימים", creditsThisMonth: 107, pendingApprovals: 1 },
  { id: "c-4", name: "משרד תיווך במרכז", initials: "מ", colors: ["#7A5CFA", "#16112E", "#FF8FAB", "#FFFFFF"], projects: 0, lastActivityHe: "לפני שבועיים", creditsThisMonth: 0, pendingApprovals: 0 },
];

/* ------------------------------------------------------------------ */
/* Media library                                                       */
/* ------------------------------------------------------------------ */
export type AssetKind = "upload_image" | "upload_video" | "logo" | "brand_image" | "keyframe" | "clip" | "render";

export interface MockProject { id: string; title: string }
export const MOCK_PROJECTS: MockProject[] = [
  { id: "p-gel", title: "לק ג׳ל שמחזיק 4 שבועות" },
  { id: "p-brows", title: "גבות: יום 1 מול יום 30" },
  { id: "p-hanukkah", title: "מבצע חנוכה בסטודיו" },
  { id: "p-tour", title: "סיור בסטודיו" },
  { id: "p-first", title: "רילס ראשון" },
];

export interface MockAsset {
  id: string;
  kind: AssetKind;
  filename: string;
  width: number;
  height: number;
  durationSec?: number;
  bytes: number;
  createdAt: string;
  projectIds: string[];
  /** Art direction for the CSS placeholder tile (no real media yet). */
  hue: number;
  captionHe?: string;
  objectUrl?: string;
}

export const MOCK_ASSETS: MockAsset[] = [
  { id: "a1", kind: "render", filename: "lak-gel-4-weeks_9x16.mp4", width: 1080, height: 1920, durationSec: 30, bytes: 18_400_000, createdAt: "2026-10-09T12:15", projectIds: ["p-gel"], hue: 340, captionHe: "לק ג׳ל שמחזיק 4 שבועות?" },
  { id: "a2", kind: "render", filename: "lak-gel-4-weeks_1x1.mp4", width: 1080, height: 1080, durationSec: 30, bytes: 14_100_000, createdAt: "2026-10-09T12:16", projectIds: ["p-gel"], hue: 340, captionHe: "הכול בהכנה" },
  { id: "a3", kind: "clip", filename: "scene-1-hands-closeup.mp4", width: 1080, height: 1920, durationSec: 5, bytes: 6_200_000, createdAt: "2026-10-09T12:05", projectIds: ["p-gel"], hue: 18 },
  { id: "a4", kind: "keyframe", filename: "scene-2-keyframe.png", width: 1080, height: 1920, bytes: 2_300_000, createdAt: "2026-10-09T12:03", projectIds: ["p-gel"], hue: 280 },
  { id: "a5", kind: "upload_video", filename: "IMG_4821.MOV", width: 1080, height: 1920, durationSec: 42, bytes: 96_000_000, createdAt: "2026-10-12T09:40", projectIds: ["p-tour"], hue: 200, captionHe: "צילום מהסטודיו" },
  { id: "a6", kind: "upload_image", filename: "studio-entrance.jpg", width: 3024, height: 4032, bytes: 3_800_000, createdAt: "2026-10-12T09:38", projectIds: ["p-tour"], hue: 35 },
  { id: "a7", kind: "upload_image", filename: "nails-pink-set.heic", width: 3024, height: 3024, bytes: 2_100_000, createdAt: "2026-10-10T15:12", projectIds: [], hue: 330 },
  { id: "a8", kind: "logo", filename: "lia-logo.svg", width: 512, height: 512, bytes: 12_000, createdAt: "2026-10-01T09:20", projectIds: ["p-gel", "p-brows", "p-tour", "p-first"], hue: 340, captionHe: "ליה" },
  { id: "a9", kind: "brand_image", filename: "brand-texture.png", width: 1920, height: 1080, bytes: 1_400_000, createdAt: "2026-10-01T09:22", projectIds: [], hue: 20 },
  { id: "a10", kind: "render", filename: "brows-day1-day30_9x16.mp4", width: 1080, height: 1920, durationSec: 15, bytes: 9_800_000, createdAt: "2026-10-14T16:40", projectIds: ["p-brows"], hue: 25, captionHe: "יום 1 מול יום 30" },
  { id: "a11", kind: "keyframe", filename: "scene-1-brows.png", width: 1080, height: 1920, bytes: 2_000_000, createdAt: "2026-10-14T16:20", projectIds: ["p-brows"], hue: 15 },
  { id: "a12", kind: "clip", filename: "scene-3-reveal.mp4", width: 1080, height: 1920, durationSec: 4, bytes: 5_100_000, createdAt: "2026-10-14T16:31", projectIds: ["p-brows"], hue: 300 },
  { id: "a13", kind: "upload_image", filename: "before-after-brows.jpg", width: 4032, height: 3024, bytes: 4_200_000, createdAt: "2026-10-11T13:40", projectIds: ["p-brows"], hue: 45 },
  { id: "a14", kind: "render", filename: "studio-tour_16x9.mp4", width: 1920, height: 1080, durationSec: 15, bytes: 11_300_000, createdAt: "2026-10-13T10:52", projectIds: ["p-tour"], hue: 210, captionHe: "ככה נראה הסטודיו" },
];

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */
export type VideoType = "brand_promo" | "reel_hook" | "offer" | "testimonial" | "launch" | "recruiting" | "explainer";
export type Structure = "hpspc" | "aida" | "pas" | "bab" | "result_first" | "brand_story";
export type BeatRole = "hook" | "problem" | "agitate" | "solution" | "proof" | "offer" | "cta" | "brand" | "story";
export type VisualStyle = "cinematic" | "ugc" | "day_in_business" | "before_after" | "product" | "text_motion";

export interface MockTemplate {
  id: string;
  nameHe: string;
  descriptionHe: string;
  nicheSlug: string | null;
  videoType: VideoType;
  durationSec: 15 | 30 | 45 | 60;
  aspect: "9:16" | "1:1" | "16:9";
  structure: Structure;
  visualStyle: VisualStyle;
  captionPreset: CaptionPresetId;
  musicMood: MusicMood;
  visualMix: "images" | "smart" | "full";
  defaultHookType: string;
  beats: { role: BeatRole; sec: number; ideaHe: string }[];
  /** Sample estimates (estimateSample, Part 05 §14.2) per quality tier. */
  cost: { draft: number; standard: number; premium: number };
  hue: number;
  icon: string;
}

export const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: "tpl-before-after-15", nameHe: "לפני ואחרי ב-15 שניות", descriptionHe: 'התוצאה מדברת בעד עצמה: פתיחה עם ה"לפני", מעבר חד, וה"אחרי" עם הנעה לפעולה.',
    nicheSlug: "beauty-nails", videoType: "reel_hook", durationSec: 15, aspect: "9:16", structure: "bab", visualStyle: "before_after",
    captionPreset: "bold-pop", musicMood: "energetic", visualMix: "smart", defaultHookType: "before-after",
    beats: [
      { role: "hook", sec: 3, ideaHe: 'ה"לפני" בתקריב, טקסט הוק על המסך' },
      { role: "solution", sec: 7, ideaHe: "מעבר חד לתהליך, ידיים בעבודה" },
      { role: "cta", sec: 5, ideaHe: 'ה"אחרי" + כרטיס סיום עם וואטסאפ' },
    ],
    cost: { draft: 23, standard: 54, premium: 120 }, hue: 330, icon: "Brush",
  },
  {
    id: "tpl-brand-30", nameHe: "סרטון תדמית קצר", descriptionHe: "מי אתם, מה אתם עושים ולמה לבחור דווקא בכם. מבנה של סיפור מותג ב-30 שניות.",
    nicheSlug: null, videoType: "brand_promo", durationSec: 30, aspect: "16:9", structure: "brand_story", visualStyle: "cinematic",
    captionPreset: "clean-box", musicMood: "inspiring", visualMix: "smart", defaultHookType: "story",
    beats: [
      { role: "hook", sec: 4, ideaHe: "רגע אמיתי מהעסק, בלי מילים" },
      { role: "story", sec: 10, ideaHe: "איך הכול התחיל, בגוף ראשון" },
      { role: "proof", sec: 8, ideaHe: "עובדה מאושרת: שנות ניסיון או דירוג" },
      { role: "brand", sec: 4, ideaHe: "הלוגו והצבעים של המותג" },
      { role: "cta", sec: 4, ideaHe: "כרטיס סיום עם הנעה לפעולה" },
    ],
    cost: { draft: 50, standard: 107, premium: 239 }, hue: 35, icon: "Clapperboard",
  },
  {
    id: "tpl-offer-15", nameHe: "מבצע לחג", descriptionHe: "הצעה אחת, ברורה, עם תאריך סיום. מתאים לחנוכה, לפסח ולבלאק פריידיי.",
    nicheSlug: null, videoType: "offer", durationSec: 15, aspect: "9:16", structure: "aida", visualStyle: "text_motion",
    captionPreset: "poster", musicMood: "energetic", visualMix: "images", defaultHookType: "urgency-offer",
    beats: [
      { role: "hook", sec: 3, ideaHe: "ההצעה בגדול על המסך" },
      { role: "offer", sec: 7, ideaHe: "מה מקבלים ועד מתי" },
      { role: "cta", sec: 5, ideaHe: "איך מזמינים, בשורה אחת" },
    ],
    cost: { draft: 23, standard: 48, premium: 104 }, hue: 45, icon: "Gift",
  },
  {
    id: "tpl-pov-30", nameHe: "POV: הלקוח שלכם", descriptionHe: "הצופה רואה את עצמו בסיטואציה, ואתם מגיעים עם הפתרון. עובד מצוין ברילס.",
    nicheSlug: null, videoType: "reel_hook", durationSec: 30, aspect: "9:16", structure: "pas", visualStyle: "ugc",
    captionPreset: "karaoke", musicMood: "funny", visualMix: "smart", defaultHookType: "pov",
    beats: [
      { role: "hook", sec: 3, ideaHe: "POV על המסך, מצלמה מגובה העיניים" },
      { role: "problem", sec: 8, ideaHe: "הבעיה שכולם מכירים" },
      { role: "agitate", sec: 6, ideaHe: "מה קורה כשמחכים עוד" },
      { role: "solution", sec: 9, ideaHe: "העסק שלכם נכנס לתמונה" },
      { role: "cta", sec: 4, ideaHe: "הנעה לפעולה" },
    ],
    cost: { draft: 50, standard: 107, premium: 239 }, hue: 280, icon: "Smartphone",
  },
  {
    id: "tpl-testimonial-30", nameHe: "המלצה של לקוח", descriptionHe: "לקוח אמיתי מספר במשפט אחד מה השתנה. בלי המלצות מומצאות: רק עם הסכמה וציטוט אמיתי.",
    nicheSlug: null, videoType: "testimonial", durationSec: 30, aspect: "9:16", structure: "result_first", visualStyle: "ugc",
    captionPreset: "soft", musicMood: "warm", visualMix: "images", defaultHookType: "social-proof",
    beats: [
      { role: "hook", sec: 4, ideaHe: "הציטוט החזק ביותר, קודם" },
      { role: "story", sec: 12, ideaHe: "מה היה לפני, ומה עכשיו" },
      { role: "proof", sec: 8, ideaHe: "שם פרטי ותחום, באישור הלקוח" },
      { role: "cta", sec: 6, ideaHe: "הזמנה לנסות" },
    ],
    cost: { draft: 50, standard: 102, premium: 228 }, hue: 160, icon: "Quote",
  },
  {
    id: "tpl-launch-30", nameHe: "השקה של שירות חדש", descriptionHe: "יש לכם משהו חדש? מציגים אותו כמו טריילר: טיזר, חשיפה ותאריך.",
    nicheSlug: null, videoType: "launch", durationSec: 30, aspect: "9:16", structure: "aida", visualStyle: "cinematic",
    captionPreset: "poster", musicMood: "inspiring", visualMix: "full", defaultHookType: "curiosity-gap",
    beats: [
      { role: "hook", sec: 4, ideaHe: "טיזר: חושך, אור אחד" },
      { role: "solution", sec: 12, ideaHe: "החשיפה: מה חדש ולמי זה" },
      { role: "offer", sec: 8, ideaHe: "הצעת השקה, אם יש" },
      { role: "cta", sec: 6, ideaHe: "מתי ואיך מתחילים" },
    ],
    cost: { draft: 74, standard: 156, premium: 340 }, hue: 220, icon: "Rocket",
  },
  {
    id: "tpl-recruiting-30", nameHe: "מגייסים לצוות", descriptionHe: "יום בעבודה אצלכם, בעיניים של מי שכבר שם. מושך מועמדים שמתאימים באמת.",
    nicheSlug: null, videoType: "recruiting", durationSec: 30, aspect: "9:16", structure: "hpspc", visualStyle: "day_in_business",
    captionPreset: "clean-box", musicMood: "urban", visualMix: "smart", defaultHookType: "callout",
    beats: [
      { role: "hook", sec: 3, ideaHe: "פנייה ישירה: מחפשים אתכם" },
      { role: "problem", sec: 6, ideaHe: "מה מעצבן בעבודות אחרות" },
      { role: "solution", sec: 10, ideaHe: "רגעים מהיום אצלכם" },
      { role: "proof", sec: 6, ideaHe: "תנאים אמיתיים, בלי הבטחות ריקות" },
      { role: "cta", sec: 5, ideaHe: "איך שולחים קורות חיים" },
    ],
    cost: { draft: 50, standard: 107, premium: 239 }, hue: 190, icon: "Users",
  },
  {
    id: "tpl-explainer-45", nameHe: "איך זה עובד, בשלושה שלבים", descriptionHe: "מסבירים שירות מורכב בפשטות: שלב, שלב, שלב, ואז מה מקבלים בסוף.",
    nicheSlug: null, videoType: "explainer", durationSec: 45, aspect: "16:9", structure: "hpspc", visualStyle: "text_motion",
    captionPreset: "news", musicMood: "calm", visualMix: "images", defaultHookType: "how-to",
    beats: [
      { role: "hook", sec: 5, ideaHe: "השאלה שכולם שואלים" },
      { role: "solution", sec: 24, ideaHe: "שלושה שלבים, אחד אחרי השני" },
      { role: "proof", sec: 8, ideaHe: "עובדה מאושרת אחת" },
      { role: "cta", sec: 8, ideaHe: "שיחת היכרות או השארת פרטים" },
    ],
    cost: { draft: 61, standard: 133, premium: 298 }, hue: 250, icon: "ListOrdered",
  },
  {
    id: "tpl-nails-secret-30", nameHe: "הסוד המקצועי של הסטודיו", descriptionHe: "מגלים טיפ אחד שרק אנשי מקצוע יודעים, ומראים אותו בפעולה. בונה אמון ושומרים אותו.",
    nicheSlug: "beauty-nails", videoType: "reel_hook", durationSec: 30, aspect: "9:16", structure: "hpspc", visualStyle: "product",
    captionPreset: "karaoke", musicMood: "warm", visualMix: "smart", defaultHookType: "insider-secret",
    beats: [
      { role: "hook", sec: 3, ideaHe: "תקריב על הציפורן, טקסט הוק" },
      { role: "problem", sec: 7, ideaHe: "למה הלק מתקלף אצל רוב האנשים" },
      { role: "solution", sec: 12, ideaHe: "ההכנה הנכונה, בתנועה איטית" },
      { role: "proof", sec: 4, ideaHe: "התוצאה אחרי שבועות" },
      { role: "cta", sec: 4, ideaHe: "וואטסאפ לתיאום" },
    ],
    cost: { draft: 50, standard: 107, premium: 239 }, hue: 345, icon: "Sparkles",
  },
  {
    id: "tpl-day-60", nameHe: "יום בעסק", descriptionHe: "מהבוקר ועד הסגירה: רגעים קטנים שמראים איך זה באמת אצלכם. מתאים לסרטון תדמית לאתר.",
    nicheSlug: null, videoType: "brand_promo", durationSec: 60, aspect: "16:9", structure: "brand_story", visualStyle: "day_in_business",
    captionPreset: "clean-box", musicMood: "warm", visualMix: "full", defaultHookType: "day-in-life",
    beats: [
      { role: "hook", sec: 5, ideaHe: "פתיחת הדלת בבוקר" },
      { role: "story", sec: 25, ideaHe: "רגעים מהשגרה, לקוחות ועבודה" },
      { role: "proof", sec: 15, ideaHe: "מה הלקוחות מקבלים בסוף" },
      { role: "brand", sec: 8, ideaHe: "הצוות והמותג" },
      { role: "cta", sec: 7, ideaHe: "איך מגיעים ומתאמים" },
    ],
    cost: { draft: 100, standard: 214, premium: 478 }, hue: 25, icon: "Sun",
  },
  {
    id: "tpl-mistakes-30", nameHe: "3 טעויות שכולם עושים", descriptionHe: "רשימה קצרה של טעויות נפוצות בתחום שלכם. כל טעות בסצנה משלה, והתיקון בסוף.",
    nicheSlug: null, videoType: "reel_hook", durationSec: 30, aspect: "1:1", structure: "pas", visualStyle: "text_motion",
    captionPreset: "bold-pop", musicMood: "energetic", visualMix: "images", defaultHookType: "mistakes",
    beats: [
      { role: "hook", sec: 3, ideaHe: "המספר 3 על המסך" },
      { role: "problem", sec: 18, ideaHe: "שלוש טעויות, שש שניות לכל אחת" },
      { role: "solution", sec: 5, ideaHe: "מה עושים במקום" },
      { role: "cta", sec: 4, ideaHe: "שמרו ושלחו למי שצריך" },
    ],
    cost: { draft: 50, standard: 98, premium: 220 }, hue: 10, icon: "TriangleAlert",
  },
];

/* ------------------------------------------------------------------ */
/* In-app hooks library                                                */
/* ------------------------------------------------------------------ */
export const MOCK_FAVORITE_HOOK_IDS = ["beauty-nails-01", "beauty-nails-07", "beauty-nails-09"];

export interface WorkspaceHook {
  id: string;
  textHe: string;
  strength: 1 | 2 | 3 | 4 | 5;
  whyHe: string;
  sourceHookId: string | null;
  projectTitle: string | null;
  createdAt: string;
}

export const MOCK_WORKSPACE_HOOKS: WorkspaceHook[] = [
  { id: "wh-1", textHe: "הלק שלכם מתקלף אחרי שבוע? הבעיה לא בלק", strength: 5, whyHe: "פותח בכאב שכולם מכירים ומבטיח הסבר, בלי להאשים את הצופה.", sourceHookId: "beauty-nails-01", projectTitle: "לק ג׳ל שמחזיק 4 שבועות", createdAt: "2026-10-15" },
  { id: "wh-2", textHe: "4 שבועות עם אותו לק. ככה מכינים ציפורן ברמת גן", strength: 4, whyHe: "מספר מוחשי ועיר, כך שהצופה המקומי מרגיש שזה בשבילו.", sourceHookId: "beauty-nails-01", projectTitle: "לק ג׳ל שמחזיק 4 שבועות", createdAt: "2026-10-15" },
  { id: "wh-3", textHe: "מה עושים בסטודיו ליה לפני שבכלל פותחים את הלק", strength: 4, whyHe: "פער סקרנות: הצופה רוצה לדעת מה קורה מאחורי הקלעים.", sourceHookId: "beauty-nails-01", projectTitle: null, createdAt: "2026-10-15" },
  { id: "wh-4", textHe: "הטעות שהורסת לק ג׳ל כבר ביום הראשון", strength: 3, whyHe: "אזהרה קצרה וחדה, אבל כללית מעט. כדאי להוסיף פרט מוחשי.", sourceHookId: "beauty-nails-02", projectTitle: null, createdAt: "2026-10-11" },
  { id: "wh-5", textHe: "גבות שנראות טבעי גם ביום 30? צילמנו כל שבוע", strength: 5, whyHe: "הבטחה שאפשר להראות, עם הוכחה מובנית בסרטון.", sourceHookId: "beauty-nails-07", projectTitle: "גבות: יום 1 מול יום 30", createdAt: "2026-10-11" },
];

/** Sample results streamed by the mocked POST /api/hooks/variations. */
export const MOCK_VARIATIONS = [
  { textHe: "{מוצר} שמחזיק 4 שבועות? הסוד הוא מה שקורה לפני הצבע", strength: 5 as const, whyHe: "שומר על ההבטחה של המקור ומחדד את הסקרנות." },
  { textHe: "למה אצלנו הלק לא מתקלף אחרי שבוע", strength: 4 as const, whyHe: "שאלה בגוף ראשון של העסק, טבעית לקריינות." },
  { textHe: "ההכנה של הציפורן לוקחת 10 דקות. היא שווה עוד 3 שבועות", strength: 4 as const, whyHe: "מספרים מוחשיים שמסבירים את הערך." },
  { textHe: "אל תמהרו לצבע. זה מה שעושים קודם ב{עיר}", strength: 3 as const, whyHe: "פקודה ישירה עם התאמה מקומית; פחות חדה מהמקור." },
  { textHe: "ככה נראה לק ג׳ל אחרי חודש, כשההכנה נכונה", strength: 4 as const, whyHe: "מבטיח הוכחה ויזואלית, מתאים לסרטון לפני ואחרי." },
];

export const MOCK_NEW_HOOKS = [
  { textHe: "3 סימנים שהגיע הזמן לבנות ציפורניים מחדש", strength: 4 as const, whyHe: "רשימה ממוספרת קצרה עם תועלת ברורה." },
  { textHe: "מה באמת קורה בסטודיו ליה בשעה הראשונה של הבוקר", strength: 4 as const, whyHe: "מאחורי הקלעים, בונה קרבה לעסק." },
  { textHe: "הצבע הזה יחמיא לכם יותר ממה שחשבתם", strength: 3 as const, whyHe: "סקרנות אישית, אבל כללי מעט." },
  { textHe: "יש לכם אירוע בסוף השבוע? כך נשארים עם ציפורניים מושלמות עד אז", strength: 4 as const, whyHe: "פונה לצורך מיידי עם הבטחה מעשית." },
  { textHe: "גבות בלי מיקרובליידינג: מה אפשר לעשות ב-20 דקות", strength: 5 as const, whyHe: "מנפץ הנחה נפוצה ונותן זמן מוחשי." },
  { textHe: "שאלתם, ענינו: כמה זמן מחזיקה הרמת ריסים", strength: 4 as const, whyHe: "תשובה לשאלה נפוצה, שומרים ושולחים." },
  { textHe: "הטעות הכי נפוצה אחרי לק ג׳ל, ואיך נמנעים ממנה", strength: 4 as const, whyHe: "אזהרה עם פתרון, בלי להאשים." },
  { textHe: "לפני ואחרי: ציפורניים קצרות שנראות מטופחות", strength: 3 as const, whyHe: "מבנה מוכר, כדאי להוסיף פרט מפתיע." },
  { textHe: "ככה נראה מניקור שמחזיק עד החתונה", strength: 4 as const, whyHe: "קהל ברור ורגע חשוב." },
  { textHe: "10 דקות של הכנה, 4 שבועות של שקט", strength: 5 as const, whyHe: "קצב, מספרים וניגוד שקל לזכור." },
];
