/**
 * Demo / sample data for the home page (Part 02 §3, spec 07–08 §L.5).
 * Everything here is shown on the page with a visible "הדגמה" / "דוגמה להמחשה" label.
 * No real business, customer or result is represented.
 */
import { getHook, getNiche, hooks, nicheShortName, type Hook } from "@/lib/data/seed";

export type CaptionPreset = "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";

export interface WallTile {
  n: number;
  column: 1 | 2 | 3;
  nicheSlug: string;
  hookId: string;
  captionPreset: CaptionPreset;
  /** Mobile marquee uses tiles 1, 2, 3, 4, 7, 8, 13, 14 (Part 02 §3.3.6). */
  mobile: boolean;
}

/** Mirrors `content/demo-wall.json` (Part 02 §3.3.6). Source is always "animatic" until real examples exist. */
export const WALL_TILES: WallTile[] = [
  { n: 1, column: 1, nicheSlug: "barbers-salons", hookId: "barbers-salons-01", captionPreset: "poster", mobile: true },
  { n: 2, column: 1, nicheSlug: "dentists", hookId: "dentists-03", captionPreset: "clean-box", mobile: true },
  { n: 3, column: 1, nicheSlug: "real-estate", hookId: "real-estate-07", captionPreset: "bold-pop", mobile: true },
  { n: 4, column: 1, nicheSlug: "restaurants", hookId: "restaurants-01", captionPreset: "karaoke", mobile: true },
  { n: 5, column: 1, nicheSlug: "fitness-trainers", hookId: "fitness-trainers-05", captionPreset: "bold-pop", mobile: false },
  { n: 6, column: 1, nicheSlug: "beauty-nails", hookId: "beauty-nails-03", captionPreset: "soft", mobile: false },
  { n: 7, column: 2, nicheSlug: "renovation-contractors", hookId: "renovation-contractors-06", captionPreset: "bold-pop", mobile: true },
  { n: 8, column: 2, nicheSlug: "mortgage-advisors", hookId: "mortgage-advisors-04", captionPreset: "news", mobile: true },
  { n: 9, column: 2, nicheSlug: "aesthetic-clinics", hookId: "aesthetic-clinics-04", captionPreset: "soft", mobile: false },
  { n: 10, column: 2, nicheSlug: "zimmers-boutique-hotels", hookId: "zimmers-boutique-hotels-02", captionPreset: "soft", mobile: false },
  { n: 11, column: 2, nicheSlug: "car-dealers", hookId: "car-dealers-02", captionPreset: "clean-box", mobile: false },
  { n: 12, column: 2, nicheSlug: "djs-musicians", hookId: "djs-musicians-01", captionPreset: "poster", mobile: false },
  { n: 13, column: 3, nicheSlug: "accountants", hookId: "accountants-04", captionPreset: "news", mobile: true },
  { n: 14, column: 3, nicheSlug: "yoga-pilates", hookId: "yoga-pilates-03", captionPreset: "soft", mobile: true },
  { n: 15, column: 3, nicheSlug: "ecommerce", hookId: "ecommerce-02", captionPreset: "bold-pop", mobile: false },
  { n: 16, column: 3, nicheSlug: "interior-design", hookId: "interior-design-02", captionPreset: "clean-box", mobile: false },
  { n: 17, column: 3, nicheSlug: "vets-dog-grooming", hookId: "vets-dog-grooming-01", captionPreset: "karaoke", mobile: false },
  { n: 18, column: 3, nicheSlug: "lawyers", hookId: "lawyers-03", captionPreset: "news", mobile: false },
];

export interface ResolvedTile {
  key: string;
  nicheSlug: string;
  nicheLabel: string;
  categorySlug: string;
  icon: string;
  text: string;
  preset: CaptionPreset;
}

export function resolveWallTile(t: WallTile): ResolvedTile | null {
  const niche = getNiche(t.nicheSlug);
  const hook = getHook(t.hookId);
  if (!niche || !hook) return null;
  return {
    key: `wall-${t.n}`,
    nicheSlug: niche.slug,
    nicheLabel: nicheShortName(niche),
    categorySlug: niche.category_slug,
    icon: niche.icon,
    text: hook.text_he,
    preset: t.captionPreset,
  };
}

/* ------------------------------------------------------------------ */
/* DashboardPreview — "דוגמה להמחשה" (spec 07–08 §G.1, §L.5)            */
/* ------------------------------------------------------------------ */

export interface DashboardSampleHook {
  hookId: string;
  text: string;
  impressions: number;
  hookRatePct: number; // video_3s_plays ÷ impressions ("עצרו לצפות")
  results: number;
  spendIls: number;
  winner?: boolean;
}

const barberHook = (id: string): Hook => getHook(id) ?? hooks[0];

/** A fictional barbershop, 7 days, ₪40 a day, goal "הודעות בוואטסאפ". Illustration only. */
export const DASHBOARD_SAMPLE = {
  campaignNameHe: "תור פנוי השבוע",
  businessHe: "מספרה שכונתית לדוגמה",
  goalLabelHe: "הודעות בוואטסאפ",
  dailyBudgetIls: 40,
  days: 7,
  spendIls: 280,
  reach: 9450,
  results: 23,
  /** 280 ÷ 23, rounded to agorot */
  costPerResultIls: 12.17,
  daily: [
    { day: "א׳", spend: 40, results: 2 },
    { day: "ב׳", spend: 40, results: 3 },
    { day: "ג׳", spend: 40, results: 3 },
    { day: "ד׳", spend: 40, results: 4 },
    { day: "ה׳", spend: 40, results: 3 },
    { day: "ו׳", spend: 40, results: 5 },
    { day: "ש׳", spend: 40, results: 3 },
  ],
  hooks: [
    { hookId: "barbers-salons-01", text: barberHook("barbers-salons-01").text_he, impressions: 5200, hookRatePct: 31, results: 13, spendIls: 120, winner: true },
    { hookId: "barbers-salons-04", text: barberHook("barbers-salons-04").text_he, impressions: 4100, hookRatePct: 24, results: 6, spendIls: 90 },
    { hookId: "barbers-salons-06", text: barberHook("barbers-salons-06").text_he, impressions: 3300, hookRatePct: 19, results: 4, spendIls: 70 },
  ] satisfies DashboardSampleHook[],
} as const;

/* ------------------------------------------------------------------ */
/* ShowcaseGallery — Appendix D demo items (Part 02 §3.10)              */
/* ------------------------------------------------------------------ */

export type DemoFormat = "9:16" | "1:1" | "16:9";

export interface DemoExample {
  id: string;
  nicheSlug: string;
  titleHe: string;
  onscreenHe: string;
  durationSec: number;
  format: DemoFormat;
  preset: CaptionPreset;
}

/** The five fictional businesses of Appendix D. Always labelled "הדגמה". */
export const DEMO_EXAMPLES: DemoExample[] = [
  { id: "restaurants-grill-30", nicheSlug: "restaurants", titleHe: "גריל בר שכונתי: רילס עם הוק", onscreenHe: "אל תבואו אלינו רעבים.", durationSec: 30, format: "9:16", preset: "karaoke" },
  { id: "renovation-bathroom-30", nicheSlug: "renovation-contractors", titleHe: "קבלן שיפוצים: חדר רחצה לפני ואחרי", onscreenHe: "אמבטיה משנות ה-80 ← 10 ימי עבודה", durationSec: 30, format: "1:1", preset: "bold-pop" },
  { id: "mortgage-mix-30", nicheSlug: "mortgage-advisors", titleHe: "יועצת משכנתאות: סרטון הסבר", onscreenHe: "אותה משכנתא, שני תמהילים", durationSec: 30, format: "9:16", preset: "news" },
  { id: "dentists-brand-60", nicheSlug: "dentists", titleHe: "מרפאת שיניים: סרטון תדמית", onscreenHe: "פוחדים מרופא שיניים?", durationSec: 60, format: "16:9", preset: "clean-box" },
  { id: "nails-hanukkah-15", nicheSlug: "beauty-nails", titleHe: "סטודיו לציפורניים: מבצע חנוכה", onscreenHe: "POV: יש לך אירוע בעוד יומיים, ואין תור בשום מקום", durationSec: 15, format: "9:16", preset: "soft" },
];
