/**
 * SAMPLE projects, versions, jobs and share links ("דוגמה") for the app core.
 * Scripts follow Appendix D §3 (the fictional grill bar "גחלת"). Relative dates are computed from MOCK_NOW.
 */
import { MOCK_NOW } from "./workspace";

export type Aspect = "9:16" | "1:1" | "16:9";
export type ProjectStage = "draft" | "brief" | "script" | "storyboard" | "voice" | "captions" | "assets" | "render" | "done" | "failed";
export type VideoType = "reel_hook" | "brand_promo" | "offer" | "testimonial" | "launch" | "recruiting" | "explainer";
export type Goal = "awareness" | "leads" | "sales" | "trust" | "engagement";
export type Quality = "draft" | "standard" | "premium";
export type VisualMix = "images" | "smart" | "full";
export type VisualStyle = "cinematic" | "ugc" | "day_in_business" | "before_after" | "product" | "text_motion";
export type CaptionPreset = "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";
export type WizardStep = "business" | "niche" | "goal" | "hook" | "script" | "style" | "voice" | "music" | "preview";
export const WIZARD_STEPS: WizardStep[] = ["business", "niche", "goal", "hook", "script", "style", "voice", "music", "preview"];

export type SceneTone = "ember" | "gold" | "rose" | "violet" | "night" | "smoke";
export type SceneSource = "ai_clip" | "ai_image" | "user" | "brand";
export type BeatRole = "hook" | "problem" | "agitate" | "solution" | "proof" | "offer" | "cta" | "brand" | "story";

export const BEAT_ROLE_LABEL: Record<BeatRole, string> = {
  hook: "הוק", problem: "בעיה", agitate: "החרפה", solution: "פתרון", proof: "הוכחה", offer: "הצעה", cta: "הנעה לפעולה", brand: "מותג", story: "סיפור",
};

export interface MockScene {
  id: string;
  role: BeatRole;
  durationSec: number;
  onscreen: string;
  vo: string;
  visual: string;
  source: SceneSource;
  tone: SceneTone;
  icon: string;
}

export interface MockVersion { n: number; source: "ai" | "user" | "rewrite"; author: string; date: string; formats: Aspect[]; current?: boolean }
export interface MockShareLink {
  id: string; kind: "public_view" | "client_approval"; createdAt: string; createdBy: string;
  expiry: { kind: "until"; date: string } | { kind: "unlimited" } | { kind: "expired" } | { kind: "revoked" };
  views: number; allowDownload: boolean;
}
export interface MockApproval { decision: "approved" | "changes_requested"; name: string; date: string; comment?: string }

export type HookFix = "swap_variant" | "shorten" | "reveal_earlier";
export interface HookScoreData {
  score: number;
  checks: { key: "text05" | "motion1" | "words9" | "face" | "type" | "captions" | "cta" | "duration" | "safe"; ok: boolean }[];
  suggestions: { id: string; text: string; fix: HookFix; gain: number }[];
}

export interface MockVariant { letter: string; projectId: string; hookText: string }

export interface MockProject {
  id: string;
  title: string;
  videoType: VideoType;
  goal: Goal;
  durationSec: 15 | 30 | 45 | 60;
  primaryAspect: Aspect;
  renderedFormats: Aspect[];
  stage: ProjectStage;
  wizardStep?: WizardStep;
  nicheSlug: string;
  hookId: string | null;
  hookText: string;
  style: VisualStyle;
  quality: Quality;
  visualMix: VisualMix;
  voiceName: string | null;
  musicName: string | null;
  captionPreset: CaptionPreset;
  creator: string;
  createdAt: string;
  updatedAt: string;
  tone: SceneTone;
  scenes: MockScene[];
  versions: MockVersion[];
  shareLinks: MockShareLink[];
  approvals: MockApproval[];
  variants?: MockVariant[];
  creditsSpent: number;
  creditsRefunded: number;
  latestJobId?: string;
  postCaption?: string;
  hashtags?: string[];
  hookScore?: HookScoreData;
  endCardHeadline: string;
}

const GRILL_SCENES: MockScene[] = [
  { id: "s1", role: "hook", durationSec: 3, onscreen: "אל תבואו אלינו רעבים.", vo: "אל תבואו אלינו רעבים. ברצינות.", visual: "מגש מעורב ענק נוחת על שולחן עץ, אדים ועשן עולים", source: "ai_clip", tone: "ember", icon: "UtensilsCrossed" },
  { id: "s2", role: "problem", durationSec: 4, onscreen: "צלחת ענקית. מנה קטנה.", vo: "נמאס לכם מצלחת ענקית עם מנה קטנה במרכז?", visual: "מנה זעירה על צלחת לבנה ענקית, אור קר ואפור", source: "ai_image", tone: "smoke", icon: "CircleDashed" },
  { id: "s3", role: "solution", durationSec: 6, onscreen: "הכול על גחלים. מול העיניים.", vo: "אז ככה זה אצלנו: הכול נצלה על גחלים, ממש מול העיניים שלכם.", visual: "שיפודים מסתובבים על גחלים, ניצוצות עפים", source: "ai_clip", tone: "gold", icon: "Flame" },
  { id: "s4", role: "solution", durationSec: 6, onscreen: "ארוחה זוגית מלאה: ₪149", vo: "ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-149 שקל. ויוצאים מפוצצים.", visual: "צילום מלמעלה: השולחן מתמלא בסלטים, פיתות ושיפודים", source: "ai_clip", tone: "rose", icon: "ChefHat" },
  { id: "s5", role: "proof", durationSec: 6, onscreen: "4.8 בגוגל, 1,240 ביקורות", vo: "ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות.", visual: "חברים צוחקים ליד שולחן מלא", source: "ai_image", tone: "violet", icon: "Star" },
  { id: "s6", role: "cta", durationSec: 5, onscreen: "", vo: "שולחן להערב? שלחו לנו הודעה בוואטסאפ.", visual: "חזית הגריל בלילה, שלט ניאון נדלק", source: "ai_image", tone: "night", icon: "MessageCircle" },
];

const BRAND_SCENES: MockScene[] = [
  { id: "b1", role: "hook", durationSec: 4, onscreen: "המנה שגורמת לאנשים לנסוע שעה", vo: "המנה שגורמת לאנשים לנסוע שעה בשבילה.", visual: "שיפוד אחד מסתובב לאט מעל גחלים לוחשות", source: "ai_clip", tone: "ember", icon: "Flame" },
  { id: "b2", role: "brand", durationSec: 7, onscreen: "גריל בר שכונתי בפתח תקווה", vo: "גחלת זה גריל בר שכונתי בפתח תקווה, עם אש פתוחה באמצע המסעדה.", visual: "חזית המסעדה בשעת ערב, אורות חמים", source: "ai_image", tone: "night", icon: "Store" },
  { id: "b3", role: "story", durationSec: 9, onscreen: "פיתות מהטאבון. כל ערב.", vo: "הפיתות יוצאות חמות מהטאבון, והסלטים מגיעים לשולחן בלי שתבקשו.", visual: "ידיים מותחות בצק, טאבון בוער ברקע", source: "ai_clip", tone: "gold", icon: "ChefHat" },
  { id: "b4", role: "solution", durationSec: 9, onscreen: "שיפודים לבחירה, על גחלים", vo: "בוחרים שיפודים, ורואים איך הם נצלים מול העיניים.", visual: "גריליסט מברישה שמן על שיפודים, ניצוצות", source: "ai_clip", tone: "rose", icon: "UtensilsCrossed" },
  { id: "b5", role: "proof", durationSec: 8, onscreen: "4.8 בגוגל, 1,240 ביקורות", vo: "ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות.", visual: "שולחן ארוך של חברים, צחוק וכוסות", source: "ai_image", tone: "violet", icon: "Star" },
  { id: "b6", role: "cta", durationSec: 8, onscreen: "", vo: "רוצים שולחן לסוף השבוע? שלחו לנו הודעה בוואטסאפ.", visual: "שלט ניאון נדלק מעל הכניסה", source: "ai_image", tone: "night", icon: "MessageCircle" },
];

const OFFER_SCENES: MockScene[] = [
  { id: "o1", role: "hook", durationSec: 3, onscreen: "\"אחרי החגים\" הגיע.", vo: "\"אחרי החגים\" הגיע. אז מאיפה באמת מתחילים?", visual: "לוח שנה נסגר, ריח עשן עולה מהגריל", source: "ai_clip", tone: "violet", icon: "CalendarDays" },
  { id: "o2", role: "offer", durationSec: 7, onscreen: "שולחן לאמצע השבוע", vo: "מתחילים מערב אחד באמצע השבוע, עם שולחן שמחכה לכם.", visual: "שולחן ערוך עם נר, גחלים ברקע", source: "ai_image", tone: "ember", icon: "UtensilsCrossed" },
  { id: "o3", role: "solution", durationSec: 8, onscreen: "פיתות חמות. שיפודים לבחירה.", vo: "פיתות חמות מהטאבון ושיפודים לבחירה, בלי לחכות לסוף השבוע.", visual: "שיפודים על הגחלים בתקריב", source: "ai_clip", tone: "gold", icon: "Flame" },
  { id: "o4", role: "proof", durationSec: 6, onscreen: "4.8 בגוגל", vo: "4.8 בגוגל, ושולחנות מלאים גם ביום שלישי.", visual: "סועדים צוחקים בערב", source: "ai_image", tone: "rose", icon: "Star" },
  { id: "o5", role: "cta", durationSec: 6, onscreen: "", vo: "שלחו לנו וואטסאפ, ונשמור לכם שולחן.", visual: "שלט ניאון בחזית", source: "ai_image", tone: "night", icon: "MessageCircle" },
];

const LIST_SCENES: MockScene[] = [
  { id: "l1", role: "hook", durationSec: 4, onscreen: "3 מנות שהצוות אוכל", vo: "3 מנות שהצוות שלנו אוכל בכל משמרת, וכמעט אף לקוח לא מזמין.", visual: "צוות המטבח סביב שולחן קטן אחרי משמרת", source: "ai_clip", tone: "gold", icon: "ChefHat" },
  { id: "l2", role: "solution", durationSec: 6, onscreen: "1. כבד על הגחלים", vo: "אחת: כבד עוף על הגחלים, עם בצל מקורמל.", visual: "כבד על רשת, להבה קטנה", source: "ai_image", tone: "ember", icon: "Flame" },
  { id: "l3", role: "solution", durationSec: 6, onscreen: "2. פיתה עם חמאה וזעתר", vo: "שתיים: פיתה מהטאבון עם חמאה וזעתר.", visual: "פיתה נפתחת, אדים עולים", source: "ai_image", tone: "rose", icon: "ChefHat" },
  { id: "l4", role: "solution", durationSec: 6, onscreen: "3. סלט חציל שרוף", vo: "שלוש: סלט חציל שרוף, ישר מהאש.", visual: "חציל נשרף על גחלים", source: "ai_clip", tone: "violet", icon: "UtensilsCrossed" },
  { id: "l5", role: "cta", durationSec: 8, onscreen: "", vo: "בפעם הבאה, תבקשו מהצוות. ושלחו לנו וואטסאפ לשולחן.", visual: "חזית המסעדה בלילה", source: "ai_image", tone: "night", icon: "MessageCircle" },
];

const DOUGH_SCENES: MockScene[] = [
  { id: "d1", role: "hook", durationSec: 3, onscreen: "48 שעות של תפיחה", vo: "הבצק הזה תופח 48 שעות לפני שהוא מגיע לשולחן.", visual: "בצק תופח בהילוך מהיר", source: "ai_clip", tone: "gold", icon: "ChefHat" },
  { id: "d2", role: "solution", durationSec: 5, onscreen: "ישר לטאבון", vo: "ואז ישר לטאבון, ארבע דקות בחום גבוה.", visual: "פיתה נכנסת לטאבון", source: "ai_image", tone: "ember", icon: "Flame" },
  { id: "d3", role: "cta", durationSec: 7, onscreen: "", vo: "בואו לטעום חמה. שלחו וואטסאפ ונשמור שולחן.", visual: "פיתות בסל קש", source: "ai_image", tone: "rose", icon: "MessageCircle" },
];

const POV_SCENES: MockScene[] = [
  { id: "v1", role: "hook", durationSec: 4, onscreen: "POV: \"רק משהו קטן\"", vo: "הזמנתם רק משהו קטן, והשף החליט אחרת.", visual: "שולחן קטן מתמלא במגשים", source: "ai_clip", tone: "rose", icon: "UtensilsCrossed" },
  { id: "v2", role: "solution", durationSec: 8, onscreen: "ואז זה הגיע", vo: "סלטים, פיתות, ושיפודים שלא הזמנתם, אבל לא תחזירו.", visual: "מגשים נוחתים בזה אחר זה", source: "ai_clip", tone: "ember", icon: "ChefHat" },
  { id: "v3", role: "cta", durationSec: 6, onscreen: "", vo: "רוצים לנסות? שלחו וואטסאפ.", visual: "חזית בלילה", source: "ai_image", tone: "night", icon: "MessageCircle" },
];

const SCORE_REEL: HookScoreData = {
  score: 78,
  checks: [
    { key: "text05", ok: true }, { key: "motion1", ok: true }, { key: "words9", ok: true }, { key: "face", ok: false },
    { key: "type", ok: true }, { key: "captions", ok: true }, { key: "cta", ok: true }, { key: "duration", ok: true }, { key: "safe", ok: false },
  ],
  suggestions: [
    { id: "f1", text: "בסצנה הראשונה עוד לא רואים את המגש עצמו. כדאי להתחיל מהרגע שהוא נוחת על השולחן.", fix: "reveal_earlier", gain: 9 },
    { id: "f2", text: "הטקסט על המסך יושב קרוב לאזור הכיתוב של הרשת. כדאי להעלות אותו לאזור ההוק.", fix: "shorten", gain: 6 },
  ],
};

const SCORE_BRAND: HookScoreData = {
  score: 61,
  checks: [
    { key: "text05", ok: false }, { key: "motion1", ok: true }, { key: "words9", ok: true }, { key: "face", ok: true },
    { key: "type", ok: true }, { key: "captions", ok: true }, { key: "cta", ok: true }, { key: "duration", ok: false }, { key: "safe", ok: true },
  ],
  suggestions: [
    { id: "f1", text: "הטקסט על המסך מופיע רק אחרי שנייה וחצי. כדאי להקדים אותו לפריים הראשון.", fix: "reveal_earlier", gain: 12 },
    { id: "f2", text: "ההוק ארוך מעט לרילס. גרסה קצרה: \"נוסעים שעה בשביל המנה הזאת\".", fix: "shorten", gain: 8 },
    { id: "f3", text: "סרטון של 45 שניות ארוך לרילס. כדאי להחליף לגרסת ההוק הקצרה בפורמט 9:16.", fix: "swap_variant", gain: 7 },
  ],
};

const SCORE_LIST: HookScoreData = {
  score: 86,
  checks: [
    { key: "text05", ok: true }, { key: "motion1", ok: true }, { key: "words9", ok: false }, { key: "face", ok: true },
    { key: "type", ok: true }, { key: "captions", ok: true }, { key: "cta", ok: true }, { key: "duration", ok: true }, { key: "safe", ok: true },
  ],
  suggestions: [
    { id: "f1", text: "ההוק ארוך מ-9 מילים. אפשר לקצר ל\"3 מנות שהצוות אוכל, ואתם לא מזמינים\".", fix: "shorten", gain: 5 },
  ],
};

const SCORE_DOUGH: HookScoreData = {
  score: 71,
  checks: [
    { key: "text05", ok: true }, { key: "motion1", ok: false }, { key: "words9", ok: true }, { key: "face", ok: true },
    { key: "type", ok: true }, { key: "captions", ok: true }, { key: "cta", ok: true }, { key: "duration", ok: true }, { key: "safe", ok: true },
  ],
  suggestions: [
    { id: "f1", text: "בשנייה הראשונה אין תנועה. כדאי לפתוח בבצק שכבר תופח, בהילוך מהיר.", fix: "reveal_earlier", gain: 10 },
    { id: "f2", text: "יש גרסת הוק שנייה שמתחילה מהטאבון. אפשר להחליף אליה בקליק.", fix: "swap_variant", gain: 6 },
  ],
};

export const NEW_DRAFT_ID = "draft-new";

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "p-1001", title: "רילס גריל בר: ארוחה זוגית מהגחלים", videoType: "reel_hook", goal: "sales", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: ["9:16", "1:1"], stage: "done", nicheSlug: "restaurants",
    hookId: "restaurants-01", hookText: "אל תבואו אלינו רעבים. ברצינות.", style: "cinematic", quality: "standard", visualMix: "smart",
    voiceName: "אורי", musicName: "גחלים בלילה", captionPreset: "bold-pop", creator: "דנה לוי",
    createdAt: "2026-10-12T11:20:00+03:00", updatedAt: "2026-10-16T21:05:00+03:00", tone: "ember", scenes: GRILL_SCENES,
    versions: [
      { n: 3, source: "user", author: "דנה לוי", date: "2026-10-16T21:05:00+03:00", formats: ["9:16", "1:1"], current: true },
      { n: 2, source: "rewrite", author: "דנה לוי", date: "2026-10-12T12:02:00+03:00", formats: ["9:16"] },
      { n: 1, source: "ai", author: "דנה לוי", date: "2026-10-12T11:24:00+03:00", formats: [] },
    ],
    shareLinks: [
      { id: "sh-1", kind: "public_view", createdAt: "2026-10-13T10:00:00+03:00", createdBy: "דנה לוי", expiry: { kind: "until", date: "2026-11-12T10:00:00+02:00" }, views: 46, allowDownload: false },
      { id: "sh-0", kind: "public_view", createdAt: "2026-10-12T13:00:00+03:00", createdBy: "דנה לוי", expiry: { kind: "revoked" }, views: 3, allowDownload: true },
    ],
    approvals: [],
    creditsSpent: 112, creditsRefunded: 5, latestJobId: "j-2003",
    postCaption: "סלטים חופשי לשולחן, פיתות חמות מהטאבון ושיפודים שנצלים על גחלים מול העיניים.\n\nשולחן להערב? שלחו לנו וואטסאפ, הקישור בביו.",
    hashtags: ["#גריל", "#פתחתקווה", "#שיפודים", "#ארוחהזוגית", "#מסעדותבמרכז"],
    hookScore: SCORE_REEL, endCardHeadline: "שולחן להערב? שלחו וואטסאפ",
  },
  {
    id: "p-1003", title: "מבצע אחרי החגים: שולחן לאמצע השבוע", videoType: "offer", goal: "sales", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: [], stage: "assets", nicheSlug: "restaurants",
    hookId: "seasonal-after-holidays-01", hookText: "\"אחרי החגים\" הגיע. אז מאיפה באמת מתחילים?", style: "cinematic", quality: "standard", visualMix: "smart",
    voiceName: "מיכל", musicName: "שישי בצהריים", captionPreset: "bold-pop", creator: "דנה לוי",
    createdAt: "2026-10-17T08:40:00+03:00", updatedAt: "2026-10-17T09:21:00+03:00", tone: "violet", scenes: OFFER_SCENES,
    versions: [{ n: 1, source: "ai", author: "דנה לוי", date: "2026-10-17T08:52:00+03:00", formats: [], current: true }],
    shareLinks: [], approvals: [], creditsSpent: 3, creditsRefunded: 0, latestJobId: "j-2001",
    endCardHeadline: "שלחו לנו וואטסאפ",
  },
  {
    id: "p-1005", title: "3 מנות שהצוות אוכל", videoType: "reel_hook", goal: "sales", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: ["9:16"], stage: "done", nicheSlug: "restaurants",
    hookId: "restaurants-05", hookText: "3 מנות שהצוות שלנו אוכל בכל משמרת – וכמעט אף לקוח לא מזמין", style: "day_in_business", quality: "draft", visualMix: "smart",
    voiceName: "נועה", musicName: "שולחן מלא", captionPreset: "karaoke", creator: "דנה לוי",
    createdAt: "2026-10-09T14:00:00+03:00", updatedAt: "2026-10-14T18:40:00+03:00", tone: "gold", scenes: LIST_SCENES,
    versions: [{ n: 1, source: "ai", author: "דנה לוי", date: "2026-10-09T14:10:00+03:00", formats: ["9:16"], current: true }],
    shareLinks: [], approvals: [],
    variants: [
      { letter: "א׳", projectId: "p-1005", hookText: "3 מנות שהצוות שלנו אוכל בכל משמרת – וכמעט אף לקוח לא מזמין" },
      { letter: "ב׳", projectId: "p-1005", hookText: "POV: הזמנתם \"רק משהו קטן\", והשף החליט אחרת" },
      { letter: "ג׳", projectId: "p-1005", hookText: "כמה עולה ארוחה זוגית מלאה אצלנו? נחשו בתגובות" },
    ],
    creditsSpent: 66, creditsRefunded: 0, latestJobId: "j-2005", hookScore: SCORE_LIST, endCardHeadline: "שלחו לנו וואטסאפ",
    postCaption: "שלוש מנות שהצוות שלנו לא מוותר עליהן. בפעם הבאה, תבקשו.", hashtags: ["#גריל", "#פתחתקווה", "#מאחוריהקלעים"],
  },
  {
    id: "p-1002", title: "סרטון תדמית: גחלת מול העיניים", videoType: "brand_promo", goal: "trust", durationSec: 45,
    primaryAspect: "16:9", renderedFormats: ["16:9", "9:16"], stage: "done", nicheSlug: "restaurants",
    hookId: "restaurants-11", hookText: "המנה שגורמת לאנשים לנסוע שעה בשבילה", style: "cinematic", quality: "standard", visualMix: "smart",
    voiceName: "אורי", musicName: "קטיפה שחורה", captionPreset: "clean-box", creator: "דנה לוי",
    createdAt: "2026-10-05T10:00:00+03:00", updatedAt: "2026-10-11T16:30:00+03:00", tone: "night", scenes: BRAND_SCENES,
    versions: [
      { n: 2, source: "user", author: "דנה לוי", date: "2026-10-11T16:30:00+03:00", formats: ["16:9", "9:16"], current: true },
      { n: 1, source: "ai", author: "דנה לוי", date: "2026-10-05T10:20:00+03:00", formats: ["16:9"] },
    ],
    shareLinks: [{ id: "sh-3", kind: "public_view", createdAt: "2026-10-11T17:00:00+03:00", createdBy: "דנה לוי", expiry: { kind: "unlimited" }, views: 128, allowDownload: true }],
    approvals: [], creditsSpent: 168, creditsRefunded: 0, latestJobId: "j-2004", hookScore: SCORE_BRAND,
    endCardHeadline: "שלחו לנו וואטסאפ",
    postCaption: "אש פתוחה באמצע המסעדה, פיתות מהטאבון וסלטים שמגיעים לבד. ככה זה בגחלת.", hashtags: ["#גריל", "#פתחתקווה", "#גחלת"],
  },
  {
    id: "p-1004", title: "שישי בצהריים אצלנו", videoType: "reel_hook", goal: "awareness", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: [], stage: "script", wizardStep: "script", nicheSlug: "restaurants",
    hookId: "restaurants-04", hookText: "שישי בצהריים אצלנו: 280 סועדים, מטבח אחד", style: "day_in_business", quality: "draft", visualMix: "smart",
    voiceName: null, musicName: null, captionPreset: "bold-pop", creator: "דנה לוי",
    createdAt: "2026-10-15T12:00:00+03:00", updatedAt: "2026-10-16T09:10:00+03:00", tone: "rose", scenes: POV_SCENES,
    versions: [{ n: 1, source: "ai", author: "דנה לוי", date: "2026-10-15T12:05:00+03:00", formats: [], current: true }],
    shareLinks: [], approvals: [], creditsSpent: 2, creditsRefunded: 0, endCardHeadline: "שלחו לנו וואטסאפ",
  },
  {
    id: "p-1008", title: "הבצק שתופח 48 שעות", videoType: "reel_hook", goal: "trust", durationSec: 15,
    primaryAspect: "1:1", renderedFormats: ["1:1"], stage: "done", nicheSlug: "restaurants",
    hookId: "restaurants-06", hookText: "הבצק הזה תופח 48 שעות לפני שהוא מגיע לשולחן", style: "product", quality: "draft", visualMix: "images",
    voiceName: "מיכל", musicName: "בוקר חדש", captionPreset: "poster", creator: "דנה לוי",
    createdAt: "2026-09-30T09:00:00+03:00", updatedAt: "2026-10-02T13:15:00+03:00", tone: "gold", scenes: DOUGH_SCENES,
    versions: [{ n: 1, source: "ai", author: "דנה לוי", date: "2026-09-30T09:10:00+03:00", formats: ["1:1"], current: true }],
    shareLinks: [{ id: "sh-4", kind: "public_view", createdAt: "2026-09-30T12:00:00+03:00", createdBy: "דנה לוי", expiry: { kind: "expired" }, views: 19, allowDownload: false }],
    approvals: [], creditsSpent: 26, creditsRefunded: 0, latestJobId: "j-2006", hookScore: SCORE_DOUGH, endCardHeadline: "שלחו לנו וואטסאפ",
    postCaption: "48 שעות של סבלנות, ארבע דקות בטאבון.", hashtags: ["#פיתה", "#טאבון", "#פתחתקווה"],
  },
  {
    id: "p-1006", title: "POV: השף החליט אחרת", videoType: "reel_hook", goal: "awareness", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: [], stage: "failed", nicheSlug: "restaurants",
    hookId: "restaurants-03", hookText: "POV: הזמנתם \"רק משהו קטן\", והשף החליט אחרת", style: "ugc", quality: "standard", visualMix: "full",
    voiceName: "עמית", musicName: "דופק גבוה", captionPreset: "poster", creator: "דנה לוי",
    createdAt: "2026-10-13T19:00:00+03:00", updatedAt: "2026-10-13T19:31:00+03:00", tone: "rose", scenes: POV_SCENES,
    versions: [{ n: 1, source: "ai", author: "דנה לוי", date: "2026-10-13T19:08:00+03:00", formats: [], current: true }],
    shareLinks: [], approvals: [], creditsSpent: 3, creditsRefunded: 158, latestJobId: "j-2002", endCardHeadline: "שלחו לנו וואטסאפ",
  },
  {
    id: "p-1007", title: "סרטון חדש · 9.10.2026", videoType: "reel_hook", goal: "leads", durationSec: 30,
    primaryAspect: "9:16", renderedFormats: [], stage: "draft", wizardStep: "goal", nicheSlug: "restaurants",
    hookId: null, hookText: "", style: "cinematic", quality: "draft", visualMix: "smart",
    voiceName: null, musicName: null, captionPreset: "bold-pop", creator: "דנה לוי",
    createdAt: "2026-10-09T08:00:00+03:00", updatedAt: "2026-10-09T08:04:00+03:00", tone: "smoke", scenes: [],
    versions: [], shareLinks: [], approvals: [], creditsSpent: 0, creditsRefunded: 0, endCardHeadline: "שלחו לנו וואטסאפ",
  },
];

/** A fresh draft opened by /app/create (in-memory until the API exists). */
export const NEW_DRAFT: MockProject = {
  id: NEW_DRAFT_ID, title: "סרטון חדש · 17.10.2026", videoType: "reel_hook", goal: "leads", durationSec: 30,
  primaryAspect: "9:16", renderedFormats: [], stage: "draft", wizardStep: "business", nicheSlug: "restaurants",
  hookId: null, hookText: "", style: "cinematic", quality: "standard", visualMix: "smart",
  voiceName: null, musicName: null, captionPreset: "bold-pop", creator: "דנה לוי",
  createdAt: MOCK_NOW, updatedAt: MOCK_NOW, tone: "ember", scenes: [], versions: [], shareLinks: [], approvals: [],
  creditsSpent: 0, creditsRefunded: 0, endCardHeadline: "שלחו לנו וואטסאפ",
};

export type JobStatus = "queued" | "running" | "waiting_external" | "succeeded" | "failed" | "canceled";
export interface MockJob {
  id: string; projectId: string; status: JobStatus; progress: number; reservedCredits: number;
  capturedCredits: number; errorCode?: "VIDEO_JOB_FAILED" | "TTS_FAILED"; formats: Aspect[];
}

export const MOCK_JOBS: MockJob[] = [
  { id: "j-2001", projectId: "p-1003", status: "running", progress: 46, reservedCredits: 58, capturedCredits: 21, formats: ["9:16"] },
  { id: "j-2002", projectId: "p-1006", status: "failed", progress: 38, reservedCredits: 158, capturedCredits: 0, errorCode: "VIDEO_JOB_FAILED", formats: ["9:16"] },
  { id: "j-2003", projectId: "p-1001", status: "succeeded", progress: 100, reservedCredits: 0, capturedCredits: 107, formats: ["9:16", "1:1"] },
  { id: "j-2004", projectId: "p-1002", status: "succeeded", progress: 100, reservedCredits: 0, capturedCredits: 165, formats: ["16:9", "9:16"] },
  { id: "j-2005", projectId: "p-1005", status: "succeeded", progress: 100, reservedCredits: 0, capturedCredits: 63, formats: ["9:16"] },
  { id: "j-2006", projectId: "p-1008", status: "succeeded", progress: 100, reservedCredits: 0, capturedCredits: 23, formats: ["1:1"] },
  { id: "j-new", projectId: NEW_DRAFT_ID, status: "queued", progress: 0, reservedCredits: 50, capturedCredits: 0, formats: ["9:16"] },
];

export const ALL_PROJECTS = [...MOCK_PROJECTS, NEW_DRAFT];
export const getProject = (id: string) => ALL_PROJECTS.find((p) => p.id === id);
export const getJob = (id: string) => MOCK_JOBS.find((j) => j.id === id);
export const activeJobs = () => MOCK_JOBS.filter((j) => j.status === "queued" || j.status === "running" || j.status === "waiting_external").filter((j) => j.projectId !== NEW_DRAFT_ID);
/** Recent projects for the dashboard (updated desc, not archived). */
export const recentProjects = (limit = 8) => [...MOCK_PROJECTS].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, limit);

/** Draft scenes the wizard uses before a script exists (the grill reel from Appendix D, with {מחיר} still open). */
export const DRAFT_SCRIPT: MockScene[] = GRILL_SCENES.map((s) =>
  s.id === "s4"
    ? { ...s, onscreen: "ארוחה זוגית מלאה: {מחיר} ₪", vo: "ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים." }
    : s,
);

export const PROJECT_STAGE_GROUP: Record<ProjectStage, "drafts" | "progress" | "ready" | "failed"> = {
  draft: "drafts", brief: "drafts", script: "drafts", storyboard: "drafts",
  voice: "progress", captions: "progress", assets: "progress", render: "progress",
  done: "ready", failed: "failed",
};

/** Where a click on a project card goes (Part 03 §5.3). */
export function projectHref(p: MockProject): string {
  const g = PROJECT_STAGE_GROUP[p.stage];
  if (g === "drafts") return `/app/projects/${p.id}/create/${p.wizardStep ?? "business"}`;
  if (g === "progress" && p.latestJobId) return `/app/projects/${p.id}/jobs/${p.latestJobId}`;
  return `/app/projects/${p.id}`;
}

// ---------- Date helpers (deterministic, from MOCK_NOW) ----------

const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric", year: "numeric", timeZone: "Asia/Jerusalem" });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export function relativeFromNow(iso: string, nowIso: string = MOCK_NOW): string {
  const diffMin = Math.max(0, Math.round((Date.parse(nowIso) - Date.parse(iso)) / 60_000));
  if (diffMin < 1) return "עכשיו";
  if (diffMin < 60) return diffMin === 1 ? "לפני דקה" : diffMin === 2 ? "לפני שתי דקות" : `לפני ${diffMin} דקות`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return h === 1 ? "לפני שעה" : h === 2 ? "לפני שעתיים" : `לפני ${h} שעות`;
  const d = Math.round(h / 24);
  if (d === 1) return "אתמול";
  if (d === 2) return "שלשום";
  if (d < 14) return `לפני ${d} ימים`;
  return `ב-${formatDate(iso)}`;
}

export const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

/** Sample results of the free per-beat rewrite (scene.rewrite, Part 03 §6.5) for the grill script. */
export const SCRIPT_REWRITES: Record<string, { short: string; energetic: string; formal: string }> = {
  s2: { short: "צלחת ענקית, מנה קטנה?", energetic: "צלחת ענקית ומנה קטנטנה? לא אצלנו.", formal: "מכירים את הצלחת הגדולה עם המנה הקטנה במרכז?" },
  s3: { short: "אצלנו הכול נצלה על גחלים, מול העיניים.", energetic: "גחלים פתוחות, אש אמיתית, והכול מול העיניים שלכם.", formal: "אצלנו כל המנות נצלות על גחלים, מול הסועדים." },
  s4: { short: "ארוחה זוגית מלאה: סלטים, פיתות ושיפודים.", energetic: "סלטים, פיתות מהטאבון ושיפודים לבחירה. יוצאים מפוצצים.", formal: "ארוחה זוגית מלאה הכוללת סלטים, פיתות מהטאבון ושיפודים לבחירה." },
  s5: { short: "4.8 בגוגל, מ-1,240 ביקורות.", energetic: "4.8 בגוגל. 1,240 ביקורות. זה לא רק אנחנו.", formal: "הדירוג שלנו בגוגל הוא 4.8, מתוך 1,240 ביקורות." },
  s6: { short: "שולחן להערב? שלחו וואטסאפ.", energetic: "רוצים שולחן הערב? שלחו וואטסאפ עכשיו.", formal: "להזמנת שולחן, שלחו לנו הודעה בוואטסאפ." },
};
