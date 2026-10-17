/**
 * Mock data for the in-app trends feed, trend pages and the guided filming kit (spec 07–08 §J).
 * The 12 seed templates follow §J.9: T1–T4 from docs/research/15-reference-hooks-analysis.md and
 * 8 evergreen formats from docs/research/13-viral-trends-engine.md §4.3.
 * Until `seed/trend_templates.json` exists (Part 08 writes it), this module is the source for the UI.
 * Nothing here comes from a reference video: no creator names, no original signs or captions.
 */

export type TrendLifecycle = "moment" | "format" | "evergreen";
/** TrendLifecycleBadge stages: "חדש השבוע" · "בשיא" · "קלאסיקה" · "נגמר בקרוב". */
export type TrendStage = "new_this_week" | "peak" | "classic" | "ending_soon";
export type ProductionMode = "ai" | "guided" | "hybrid";
export type AdSafety = "ad_safe" | "organic_only" | "needs_consent" | "needs_ai_label";
export type BeatRole = "bait" | "cut" | "payoff" | "reveal" | "cta" | "label";
export type VisualSource = "ai_clip" | "ai_image_kenburns" | "user_media" | "brand_card";
export type OverlayKind =
  | "sign" | "fake_ui" | "meme_caption" | "bts_label" | "split_reveal" | "comment_bubble"
  | "rating" | "pov_label" | "clock" | "sticker" | "price";
export type TileArt = OverlayKind | "satisfying" | "how_to";
export type TileTone = "gold" | "rose" | "violet" | "success";
export type GhostKind = "tripod_wide" | "hands_table" | "face_center" | "product_center" | "cover_lens";
export type Framing = "wide" | "medium" | "closeup" | "pov";
export type MusicEnergy = "flat" | "build" | "drop" | "loop";

/** The 9 deterministic checks of "ציון הוק" (§S.4 layer 1). Weights sum to 100. */
export const HOOK_CHECKS = [
  { key: "text_by_500ms", weight: 15 },
  { key: "motion_in_1s", weight: 15 },
  { key: "hook_words", weight: 10 },
  { key: "subject_scene1", weight: 15 },
  { key: "known_hook_type", weight: 5 },
  { key: "captions_on", weight: 10 },
  { key: "cta_present", weight: 10 },
  { key: "duration_fits", weight: 10 },
  { key: "safe_zones", weight: 10 },
] as const;
export type HookCheckKey = (typeof HOOK_CHECKS)[number]["key"];

export interface TrendBeat {
  key: string;
  role: BeatRole;
  /** 500–8000 ms; "cut" = 0 (a transition marker); "label" = 0 (a persistent overlay over the whole video). */
  durationMs: number;
  titleHe: string;
  descriptionHe: string;
  visualSource?: VisualSource;
  overlay?: OverlayKind;
  guidedShotKey?: string;
}

export interface TrendHookVariant { key: "A" | "B" | "C"; baitHe: string; hookLineHe: string; whyHe: string }

export interface TrendNicheAdaptation { nicheSlug: string; angleHe: string; onscreenHe: string }

export interface GuidedShot {
  key: string;
  titleHe: string;
  instructionHe: string;
  framing: Framing;
  minSec: number;
  maxSec: number;
  ghost: GhostKind;
  tipsHe: string[];
  peopleOnCamera: boolean;
}

export interface TrendTemplate {
  slug: string;
  /** Founder reference code (T1–T4); evergreen templates have none. */
  code?: "T1" | "T2" | "T3" | "T4";
  nameHe: string;
  taglineHe: string;
  whyItWorksHe: string[];
  hookTypeSlug: string;
  lifecycle: TrendLifecycle;
  stage: TrendStage;
  /** Only for stage "ending_soon". Static mock value (no Date math during prerender). */
  endsInDays?: number;
  isThisWeek: boolean;
  productionMode: ProductionMode;
  adSafety: AdSafety;
  durationSec: 15 | 30;
  /** Niches the template fits. "all" = any business. */
  nicheSlugs: string[] | "all";
  /** "מתאים לעסק שלכם כי…" when there is no niche-specific adaptation. */
  genericFitHe: string;
  /** Default on-screen line for the demo tile when the niche has no adaptation. */
  defaultOnscreenHe: string;
  beats: TrendBeat[];
  hookVariants: TrendHookVariant[];
  nicheAdaptations: TrendNicheAdaptation[];
  music: { moodHe: string; bpmMin: number; bpmMax: number; energy: MusicEnergy; originalHadProtectedSong: boolean };
  complianceNotesHe: string[];
  shotList?: GuidedShot[];
  hookChecks: Record<HookCheckKey, boolean>;
  tile: { tone: TileTone; art: TileArt };
}

const ALL_PASS: Record<HookCheckKey, boolean> = {
  text_by_500ms: true, motion_in_1s: true, hook_words: true, subject_scene1: true, known_hook_type: true,
  captions_on: true, cta_present: true, duration_fits: true, safe_zones: true,
};
const checks = (fails: HookCheckKey[]) =>
  Object.fromEntries(Object.entries(ALL_PASS).map(([k, v]) => [k, fails.includes(k as HookCheckKey) ? false : v])) as Record<HookCheckKey, boolean>;

export const TREND_TEMPLATES: TrendTemplate[] = [
  // ---------- T1–T4: the founder's reference formats (R15) ----------
  {
    slug: "bait-and-sign",
    code: "T1",
    nameHe: "פיתיון ושלט",
    taglineHe: "רגע דרמטי, חיתוך חד, ושלט יבש עם המסר שלכם.",
    whyItWorksHe: [
      "שתי השניות הראשונות הן רגע של \"מה הולך לקרות?\". אף אחד לא גולל הלאה באמצע.",
      "החיתוך החד לשלט יבש ומצחיק יוצר פאנץ׳, ואנשים צופים שוב ומשתפים.",
      "ההנעה לפעולה היא הבדיחה עצמה, והסרטון קצר וחוזר בלופ.",
    ],
    hookTypeSlug: "pattern-interrupt",
    lifecycle: "format",
    stage: "new_this_week",
    isThisWeek: true,
    productionMode: "ai",
    adSafety: "ad_safe",
    durationSec: 15,
    nicheSlugs: "all",
    genericFitHe: "כל עסק יכול לכתוב על השלט משפט אחד עם הזמנה, ולתת לפיתיון לעשות את העבודה.",
    defaultOnscreenHe: "בואו אלינו. זה פחות דרמטי מזה",
    beats: [
      { key: "bait", role: "bait", durationMs: 2500, titleHe: "הפיתיון", descriptionHe: "רגע של כמעט: קפיצה, דומינו לפני נפילה, בלון לפני פיצוץ. בלי פציעות ובלי צילומים של אחרים.", visualSource: "ai_clip" },
      { key: "cut", role: "cut", durationMs: 0, titleHe: "חיתוך חד", descriptionHe: "מעבר בבת אחת, עם אפקט קול קצר." },
      { key: "sign", role: "payoff", durationMs: 6000, titleHe: "השלט", descriptionHe: "אדם עם פנים רציניות מחזיק דף ריק, ואנחנו כותבים עליו את המסר שלכם בעברית, בכתב יד.", visualSource: "ai_image_kenburns", overlay: "sign" },
      { key: "cta", role: "cta", durationMs: 4000, titleHe: "הנעה לפעולה", descriptionHe: "שם העסק וכפתור וואטסאפ, ומדבקת לב קטנה בסוף.", visualSource: "brand_card", overlay: "sticker" },
    ],
    hookVariants: [
      { key: "A", baitHe: "קופץ במוט שהמוט שלו מתכופף הצידה", hookLineHe: "חכו לנחיתה", whyHe: "תנועה גדולה ומוכרת. ברור שמשהו עומד לקרות." },
      { key: "B", baitHe: "שורת דומינו ארוכה שנעצרת באבן האחרונה", hookLineHe: "האבן האחרונה", whyHe: "מתח שנבנה לאט, והעין נצמדת לסוף השורה." },
      { key: "C", baitHe: "חתול על מדף, שנייה לפני קפיצה", hookLineHe: "הוא קופץ או לא?", whyHe: "סקרנות פשוטה. כולם רוצים לדעת מה יקרה." },
    ],
    nicheAdaptations: [
      { nicheSlug: "restaurants", angleHe: "הפאנץ׳ הוא הזמנה פשוטה לאוכל, עם השכונה שלכם.", onscreenHe: "בואו לאכול אצלנו. אנחנו בחולון" },
      { nicheSlug: "fitness-trainers", angleHe: "הנפילה בפיתיון היא בדיוק הבדיחה על כאב שרירים.", onscreenHe: "תתחילו להתאמן. זה פחות כואב מזה" },
      { nicheSlug: "dentists", angleHe: "הרגע המלחיץ הוא תזכורת עדינה לבדיקה התקופתית.", onscreenHe: "בואו לבדיקה לפני שזה קורה לשיניים" },
      { nicheSlug: "real-estate", angleHe: "שלט יבש ואישי בונה היכרות עם המתווך עוד לפני השיחה.", onscreenHe: "מחפשים דירה? אני מכיר כמה" },
    ],
    music: { moodHe: "קומית, עם עצירה רגע לפני השלט", bpmMin: 100, bpmMax: 120, energy: "drop", originalHadProtectedSong: true },
    complianceNotesHe: [
      "בפיתיון אין פציעה אמיתית. מטא דוחה מודעות עם תוכן מזעזע.",
      "האדם עם השלט נוצר ב-AI, או שזה בעל העסק עם הסכמה מתועדת.",
      "השלטים, הכיתובים והמוזיקה של סרטון המקור לא נכנסים לתבנית.",
    ],
    hookChecks: checks(["subject_scene1"]),
    tile: { tone: "gold", art: "sign" },
  },
  {
    slug: "behind-the-viral",
    code: "T2",
    nameHe: "מאחורי הקלעים",
    taglineHe: "שוט רחב אחד של הכאוס מאחורי הסרטון, והתוצאה בסוף.",
    whyItWorksHe: [
      "הצופה לא מבין מה קורה, והסקרנות מחזיקה אותו עד הסוף.",
      "רואים את האנשים האמיתיים של העסק, וזה בונה אמון.",
      "הסרטון מכפיל את החשיפה של הסרטון המקורי: \"עכשיו לכו לראות את התוצאה\".",
    ],
    hookTypeSlug: "behind-the-scenes",
    lifecycle: "format",
    stage: "peak",
    isThisWeek: false,
    productionMode: "guided",
    adSafety: "needs_consent",
    durationSec: 30,
    nicheSlugs: ["restaurants", "catering-chefs", "event-photographers", "beauty-nails", "barbers-salons", "fitness-trainers", "event-venues", "kids-activities", "djs-musicians"],
    genericFitHe: "צוות אמיתי שעושה משהו מוזר ומתואם מעורר סקרנות בכל תחום.",
    defaultOnscreenHe: "מאחורי הקלעים של הסרטון הכי מטורף שצילמנו",
    beats: [
      { key: "label", role: "label", durationMs: 0, titleHe: "תווית \"מאחורי הקלעים\"", descriptionHe: "תווית קבועה בראש המסך לאורך כל הסרטון.", overlay: "bts_label" },
      { key: "chaos", role: "bait", durationMs: 14000, titleHe: "הכאוס", descriptionHe: "שוט רחב וסטטי: כל הצוות עושה משהו מוזר ומתואם. אתם מצלמים, בלי הסבר.", visualSource: "user_media", guidedShotKey: "wide-chaos" },
      { key: "cover", role: "cut", durationMs: 0, titleHe: "כיסוי העדשה", descriptionHe: "מישהו מכסה את המצלמה בדף, וזה המעבר.", guidedShotKey: "cover-lens" },
      { key: "result", role: "payoff", durationMs: 9000, titleHe: "התוצאה", descriptionHe: "התוצאה הסופית במלואה: המנה, הסרטון או הצוות בפוזה האחרונה.", visualSource: "user_media", guidedShotKey: "result" },
      { key: "cta", role: "cta", durationMs: 4500, titleHe: "הנעה לפעולה", descriptionHe: "\"עכשיו לכו לראות את הסרטון\", או הזמנה לבוא.", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "חמישה אנשים על הבר עם צלחות ביד", hookLineHe: "מה עשינו עם 5 מלצרים ונייר A4?", whyHe: "שאלה עם מספר ופרט מוזר. אי אפשר לא לחכות לתשובה." },
      { key: "B", baitHe: "צלם שוכב על הרצפה מתחת לשולחן", hookLineHe: "ככה נראה יום צילומים אצלנו", whyHe: "הצצה למקום שהצופה לא רואה בדרך כלל." },
      { key: "C", baitHe: "מישהו עומד על כיסא עם טלפון ביד", hookLineHe: "הסרטון הכי מטורף שצילמנו", whyHe: "הבטחה גדולה, והכאוס בתמונה מוכיח אותה." },
    ],
    nicheAdaptations: [
      { nicheSlug: "restaurants", angleHe: "המטבח והצוות שלכם הם הכוכבים, והמנה היא הפאנץ׳.", onscreenHe: "מאחורי הקלעים של הסרטון הכי מטורף שצילמנו במסעדה" },
      { nicheSlug: "event-photographers", angleHe: "לקוחות רוצים לראות איך נראה יום צילומים אצלכם.", onscreenHe: "ככה נראה יום צילומים אצלנו בסטודיו" },
      { nicheSlug: "beauty-nails", angleHe: "הסטודיו מאחורי הקלעים מראה את הצוות ואת האווירה.", onscreenHe: "ככה נראה יום צילומים אצלנו בסטודיו" },
    ],
    music: { moodHe: "אנרגטית, עם האצה לקראת התוצאה", bpmMin: 110, bpmMax: 128, energy: "build", originalHadProtectedSong: true },
    complianceNotesHe: [
      "כל מי שמופיע בצילום צריך להסכים להופיע בסרטון. מסמנים אישור לפני העריכה.",
      "לקוחות שמזהים אותם ברקע רק עם ההסכמה שלהם.",
      "המוזיקה נוצרת אצלנו ומותרת לפרסום.",
    ],
    shotList: [
      { key: "wide-chaos", titleHe: "שוט רחב של כל הצוות", instructionHe: "שימו את הטלפון על חצובה או על מדף בגובה החזה, לאורך. צלמו את כל הצוות מזווית רחבה, ואל תזיזו את הטלפון.", framing: "wide", minSec: 10, maxSec: 20, ghost: "tripod_wide", tipsHe: ["כל הצוות בתוך המסגרת, גם מי שעומד בצד.", "האור מגיע מאחורי הטלפון, לא מולו.", "בלי הסברים. הכאוס הוא ההוק."], peopleOnCamera: true },
      { key: "cover-lens", titleHe: "כיסוי העדשה", instructionHe: "מישהו מתקרב ומכסה את המצלמה בדף A4 לשנייה, ואז מוריד אותו. ככה נוצר המעבר החלק.", framing: "closeup", minSec: 2, maxSec: 4, ghost: "cover_lens", tipsHe: ["הדף מכסה את כל המסך.", "מכסים לאט ומורידים מהר."], peopleOnCamera: true },
      { key: "result", titleHe: "התוצאה", instructionHe: "צלמו את התוצאה מקרוב, במרכז הפריים: המנה המוכנה או הצוות בפוזה הסופית. 3–5 שניות בלי לזוז.", framing: "closeup", minSec: 3, maxSec: 6, ghost: "product_center", tipsHe: ["נקו את השולחן מסביב.", "תנו לתוצאה רגע של שקט לפני שעוצרים."], peopleOnCamera: false },
    ],
    hookChecks: checks(["captions_on"]),
    tile: { tone: "violet", art: "bts_label" },
  },
  {
    slug: "almost-got-me-reveal",
    code: "T3",
    nameHe: "כמעט נפגעתי",
    taglineHe: "משאית, מגדל ארגזים וגשר. ובתוך הארגז: המוצר שלכם.",
    whyItWorksHe: [
      "כמעט-תאונה מנקודת מבט אישית מעוררת \"וואו\" אינסטינקטיבי.",
      "הפיזיקה הבלתי אפשרית גורמת לצפות שוב ולשאול בתגובות \"זה אמיתי?\".",
      "הארגז הופך את הספקטקל למוצר.",
    ],
    hookTypeSlug: "pattern-interrupt",
    lifecycle: "format",
    stage: "ending_soon",
    endsInDays: 6,
    isThisWeek: false,
    productionMode: "ai",
    adSafety: "needs_ai_label",
    durationSec: 15,
    nicheSlugs: ["ecommerce", "movers-storage", "restaurants", "retail-stores", "catering-chefs"],
    genericFitHe: "כל מוצר שאפשר לשים בארגז יכול להיות הפאנץ׳ של הסרטון.",
    defaultOnscreenHe: "המשאית כמעט תפסה אותי 💀",
    beats: [
      { key: "near-miss", role: "bait", durationMs: 3000, titleHe: "כמעט נפגעתי", descriptionHe: "נקודת מבט מגשר: משאית עם מגדל ארגזים מתקרבת, והארגזים עפים למצלמה. קליפ AI, בלי אנשים שנפגעים.", visualSource: "ai_clip", overlay: "meme_caption" },
      { key: "cut", role: "cut", durationMs: 0, titleHe: "חיתוך", descriptionHe: "ארגז אחד נוחת, וחותכים." },
      { key: "unbox", role: "reveal", durationMs: 5500, titleHe: "פתיחת הארגז", descriptionHe: "פותחים את הארגז, ובפנים המוצר שלכם: צילום שלכם או אנימציה של המוצר.", visualSource: "user_media" },
      { key: "cta", role: "cta", durationMs: 4000, titleHe: "הנעה לפעולה", descriptionHe: "שם העסק, ו\"הזמינו באתר\" או וואטסאפ.", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "משאית עם מגדל ארגזים מתחת לגשר", hookLineHe: "המשאית כמעט תפסה אותי 💀", whyHe: "סכנה מדומה בנקודת מבט אישית. המוח מגיב לפני שהוא חושב." },
      { key: "B", baitHe: "מנוף שמוריד משטח חבילות ממש ליד המצלמה", hookLineHe: "זה עבר סנטימטר ממני", whyHe: "מרחק קטן ממה שקרוב לפנים יוצר עצירה מיידית." },
      { key: "C", baitHe: "גל של קופסאות שמתגלגל במורד רחוב", hookLineHe: "לא האמנתי שזה קורה", whyHe: "תמונה בלתי אפשרית שגורמת לצפות שוב." },
    ],
    nicheAdaptations: [
      { nicheSlug: "ecommerce", angleHe: "הארגזים עפים, ובתוך אחד מהם ההזמנה של הלקוח.", onscreenHe: "המשאית כמעט תפסה אותי 💀" },
      { nicheSlug: "movers-storage", angleHe: "הארגזים עפים אבל נוחתים בשלום, בדיוק כמו בהובלה שלכם.", onscreenHe: "המשאית שלנו לא מאבדת אף ארגז" },
      { nicheSlug: "restaurants", angleHe: "קופסאות פיצה עפות, ובפנים פיצה חמה.", onscreenHe: "הפיצה כמעט תפסה אותי 💀" },
      { nicheSlug: "retail-stores", angleHe: "זרי פרחים במקום ארגזים, והזר שלכם נוחת בידיים.", onscreenHe: "הזר הזה כמעט תפס אותי 💀" },
    ],
    music: { moodHe: "מתח קצר ואז הקלה", bpmMin: 90, bpmMax: 110, energy: "drop", originalHadProtectedSong: true },
    complianceNotesHe: [
      "תווית \"צולם ב-AI\" על המסך, ותווית ה-AI של מטא במודעה.",
      "אף אחד לא נפגע בסרטון, וגם לא נראה כאילו נפגע.",
      "המוצר בארגז הוא המוצר האמיתי שלכם.",
    ],
    hookChecks: checks(["subject_scene1"]),
    tile: { tone: "rose", art: "meme_caption" },
  },
  {
    slug: "fake-system-popup",
    code: "T4",
    nameHe: "התראה מזויפת",
    taglineHe: "התראת \"סוללה חלשה\" קופצת מעל האוכל, וכולם מנסים לסגור אותה.",
    whyItWorksHe: [
      "רפלקס: התראה מזויפת גורמת לעצור, לנסות ללחוץ ולצפות שוב.",
      "האוכל נשאר במרכז, אז כל זמן הצפייה מוקדש למוצר.",
      "עובד מצוין גם בחשבונות קטנים, כפוסט רגיל.",
    ],
    hookTypeSlug: "pattern-interrupt",
    lifecycle: "format",
    stage: "new_this_week",
    isThisWeek: true,
    productionMode: "hybrid",
    adSafety: "organic_only",
    durationSec: 15,
    nicheSlugs: ["restaurants", "catering-chefs"],
    genericFitHe: "עובד הכי טוב כשיש על השולחן משהו שרוצים להמשיך להסתכל עליו.",
    defaultOnscreenHe: "סוללה חלשה · נותרו 10%",
    beats: [
      { key: "served", role: "bait", durationMs: 2000, titleHe: "המנה מגיעה", descriptionHe: "נקודת מבט ליד שולחן עץ, והמנה מונחת מולכם.", visualSource: "user_media", guidedShotKey: "pov-table" },
      { key: "popup", role: "label", durationMs: 0, titleHe: "ההתראה", descriptionHe: "התראת מערכת בעיצוב כללי קופצת מעל האוכל בשנייה וחצי, ונשארת.", overlay: "fake_ui" },
      { key: "closeup", role: "payoff", durationMs: 6000, titleHe: "קלוז-אפ", descriptionHe: "קרוב על המנה: אדים, רוטב, פריכות.", visualSource: "user_media", guidedShotKey: "closeup" },
      { key: "cta", role: "cta", durationMs: 4500, titleHe: "הנעה לפעולה", descriptionHe: "ביס ראשון, שם העסק ווואטסאפ להזמנת שולחן.", visualSource: "user_media", guidedShotKey: "bite" },
    ],
    hookVariants: [
      { key: "A", baitHe: "התראת סוללה מעל המגש", hookLineHe: "סוללה חלשה · נותרו 10%", whyHe: "כולם מכירים את הפחד מסוללה ריקה, והיד זזה לבד." },
      { key: "B", baitHe: "הודעה אישית שקופצת באמצע הארוחה", hookLineHe: "הודעה חדשה מאמא", whyHe: "הודעה שאי אפשר להתעלם ממנה." },
      { key: "C", baitHe: "התראת משלוח מעל המנה שכבר הגיעה", hookLineHe: "האוכל שלך הגיע", whyHe: "משחק מילים: האוכל באמת הגיע." },
    ],
    nicheAdaptations: [
      { nicheSlug: "restaurants", angleHe: "המנה שלכם במרכז, וההתראה רק מחזיקה את העין עליה.", onscreenHe: "סוללה חלשה · נותרו 10%" },
      { nicheSlug: "catering-chefs", angleHe: "מגש אירוח מלא, וההתראה \"האוכל שלך הגיע\" סוגרת את הבדיחה.", onscreenHe: "האוכל שלך הגיע" },
    ],
    music: { moodHe: "חמימה וקלילה", bpmMin: 95, bpmMax: 115, energy: "loop", originalHadProtectedSong: true },
    complianceNotesHe: [
      "הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים.",
      "\"נשארו 2 מנות\" רק כשזה נכון באותו יום.",
      "ההתראה בעיצוב כללי, בלי לוגו של מערכת הפעלה.",
    ],
    shotList: [
      { key: "pov-table", titleHe: "השולחן מנקודת מבט", instructionHe: "החזיקו את הטלפון בגובה העיניים מול השולחן, ויד אחת מונחת עליו. מישהו מניח את המנה במרכז.", framing: "pov", minSec: 4, maxSec: 6, ghost: "hands_table", tipsHe: ["השולחן נקי, רק המנה במרכז.", "היד על השולחן לא זזה."], peopleOnCamera: false },
      { key: "closeup", titleHe: "קלוז-אפ על המנה", instructionHe: "קרבו את הטלפון למנה עד שהיא ממלאת את המסך, בתנועה איטית פנימה.", framing: "closeup", minSec: 3, maxSec: 5, ghost: "product_center", tipsHe: ["צלמו כשהמנה עוד מעלה אדים.", "אור מהחלון מהצד נותן מרקם."], peopleOnCamera: false },
      { key: "bite", titleHe: "הביס הראשון", instructionHe: "יד לוקחת ביס או טובלת ברוטב. רק ידיים, בלי פנים.", framing: "closeup", minSec: 2, maxSec: 4, ghost: "hands_table", tipsHe: ["תנועה אחת, לאט.", "אפשר לצלם שני טייקים ולבחור."], peopleOnCamera: false },
    ],
    hookChecks: checks(["text_by_500ms"]),
    tile: { tone: "gold", art: "fake_ui" },
  },

  // ---------- 8 evergreen formats (R13 §4.3) ----------
  {
    slug: "pov-deadpan",
    nameHe: "POV",
    taglineHe: "שורת \"POV:\" יבשה, מצב שכולם מכירים, וטוויסט.",
    whyItWorksHe: [
      "הכותרת לבדה יוצרת פער סקרנות: רוצים לראות איך זה נגמר.",
      "הומור דוגרי ישראלי שמזהים בו את עצמם.",
      "קל לצלם בטלפון, או ליצור כמערכון AI בדיוני.",
    ],
    hookTypeSlug: "pov",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "hybrid",
    adSafety: "ad_safe",
    durationSec: 15,
    nicheSlugs: "all",
    genericFitHe: "לכל תחום יש מצב אחד שכל לקוח מכיר. הוא שורת ה-POV שלכם.",
    defaultOnscreenHe: "מצאתם סוף סוף מישהו שעונה בוואטסאפ",
    beats: [
      { key: "label", role: "label", durationMs: 0, titleHe: "תווית POV", descriptionHe: "\"POV:\" ושורה אחת בעברית, לאורך כל הסרטון.", overlay: "pov_label" },
      { key: "line", role: "bait", durationMs: 3000, titleHe: "שורת ה-POV", descriptionHe: "פנים לא זזות ושורה אחת על המסך: מצב יומיומי.", visualSource: "user_media", guidedShotKey: "pov-line" },
      { key: "situation", role: "payoff", durationMs: 5500, titleHe: "המצב", descriptionHe: "המצב המוכר משוחק עד הסוף, בלי הסברים.", visualSource: "user_media", guidedShotKey: "situation" },
      { key: "twist", role: "reveal", durationMs: 2000, titleHe: "הטוויסט", descriptionHe: "התפנית: אתם הפתרון.", visualSource: "user_media", guidedShotKey: "twist" },
      { key: "cta", role: "cta", durationMs: 2000, titleHe: "הנעה לפעולה", descriptionHe: "שם העסק ווואטסאפ.", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "מבט ישיר ושתיקה ארוכה", hookLineHe: "אמרו לכם \"זה ייקח רק שבועיים\"", whyHe: "משפט שכולם שמעו פעם, ויודעים איך הוא נגמר." },
      { key: "B", baitHe: "מצלמה נסתרת בגובה הדלפק", hookLineHe: "אתם הלקוח הראשון של הבוקר", whyHe: "זווית לא רגילה של רגע רגיל." },
      { key: "C", baitHe: "יד שמושיטה טלפון לאט", hookLineHe: "מצאתם סוף סוף מישהו שעונה בוואטסאפ", whyHe: "כאב אמיתי של לקוחות, והפתרון באותו משפט." },
    ],
    nicheAdaptations: [
      { nicheSlug: "renovation-contractors", angleHe: "הפחד הכי גדול בשיפוץ הוא לוח זמנים, והטוויסט: אצלכם הוא בחוזה.", onscreenHe: "הקבלן אמר שבועיים, וסיים בשבועיים" },
      { nicheSlug: "dentists", angleHe: "כולם מכירים את הרגע בכיסא. הטוויסט: הפעם באמת לא כואב.", onscreenHe: "אתם בכיסא, ושומעים \"זה לא יכאב\"" },
      { nicheSlug: "restaurants", angleHe: "\"רק משהו קטן\" שהופך לשולחן מלא. זה המסר.", onscreenHe: "הזמנתם \"רק משהו קטן\"" },
    ],
    music: { moodHe: "יבשה, עם הפסקה לפני הטוויסט", bpmMin: 85, bpmMax: 105, energy: "flat", originalHadProtectedSong: false },
    complianceNotesHe: [
      "מערכון AI תמיד בדיוני וברור שהוא כזה. בלי \"לקוחות\" שנוצרו ב-AI שממליצים עליכם.",
      "הומור על המצב, אף פעם לא על חשבון הלקוח.",
    ],
    shotList: [
      { key: "pov-line", titleHe: "שוט פתיחה יבש", instructionHe: "פנים לא זזות, מבט ישר למצלמה, שתי שניות של שתיקה. את שורת ה-POV אנחנו מוסיפים.", framing: "medium", minSec: 3, maxSec: 5, ghost: "face_center", tipsHe: ["בלי חיוך. היובש הוא הבדיחה.", "הטלפון בגובה העיניים."], peopleOnCamera: true },
      { key: "situation", titleHe: "המצב", instructionHe: "צלמו את המצב בשוט אחד: הלקוח נכנס, השאלה והתגובה.", framing: "medium", minSec: 5, maxSec: 8, ghost: "tripod_wide", tipsHe: ["שוט אחד רציף עדיף על כמה קטנים.", "מי שמשחק את הלקוח צריך להסכים להופיע."], peopleOnCamera: true },
      { key: "twist", titleHe: "הטוויסט", instructionHe: "הצד שלכם: התוצאה, החיוך או המוצר במרכז הפריים.", framing: "closeup", minSec: 2, maxSec: 4, ghost: "product_center", tipsHe: ["קצר וחד. שנייה וחצי מספיקות."], peopleOnCamera: false },
    ],
    hookChecks: checks(["motion_in_1s"]),
    tile: { tone: "violet", art: "pov_label" },
  },
  {
    slug: "before-after-snap",
    nameHe: "לפני ואחרי",
    taglineHe: "הלפני פחות משנייה, סנאפ, והאחרי.",
    whyItWorksHe: [
      "המעבר על הביט הוא הרגע שמחכים לו.",
      "תוצאה אמיתית משכנעת יותר מכל משפט.",
      "עובד גם בלי סאונד.",
    ],
    hookTypeSlug: "before-after",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "guided",
    adSafety: "ad_safe",
    durationSec: 15,
    nicheSlugs: ["barbers-salons", "beauty-nails", "home-services", "auto-services", "renovation-contractors", "interior-design", "vets-dog-grooming"],
    genericFitHe: "אם העבודה שלכם משנה משהו שאפשר לראות, זה הפורמט.",
    defaultOnscreenHe: "נכנס ככה. יצא ככה.",
    beats: [
      { key: "before", role: "bait", durationMs: 900, titleHe: "לפני", descriptionHe: "המצב לפני, פחות משנייה.", visualSource: "user_media", guidedShotKey: "before" },
      { key: "snap", role: "cut", durationMs: 0, titleHe: "סנאפ", descriptionHe: "יד מכסה את העדשה או סנאפ באצבעות, על הביט.", guidedShotKey: "snap" },
      { key: "after", role: "payoff", durationMs: 7000, titleHe: "אחרי", descriptionHe: "אותה זווית בדיוק, והתוצאה.", visualSource: "user_media", overlay: "split_reveal", guidedShotKey: "after" },
      { key: "cta", role: "cta", durationMs: 4600, titleHe: "מחיר או הנעה", descriptionHe: "המחיר האמיתי, או \"שלחו וואטסאפ לתיאום\".", visualSource: "brand_card", overlay: "price" },
    ],
    hookVariants: [
      { key: "A", baitHe: "יד שמכסה את העדשה", hookLineHe: "מה שהגיע אלינו הבוקר", whyHe: "הצופה רוצה לראות מה יצא מזה." },
      { key: "B", baitHe: "סנאפ באצבעות מול המצלמה", hookLineHe: "סנאפ אחד, שעתיים עבודה", whyHe: "מבטיח מעבר מהיר ותוצאה גדולה." },
      { key: "C", baitHe: "החלקה של יד על המסך", hookLineHe: "תחליקו כדי לראות את ההבדל", whyHe: "מזמין לעקוב אחרי התנועה." },
    ],
    nicheAdaptations: [
      { nicheSlug: "barbers-salons", angleHe: "תספורת לפני ואחרי, מאותה זווית, אומרת הכול.", onscreenHe: "נכנס ככה. יצא ככה." },
      { nicheSlug: "home-services", angleHe: "לוח חשמל או מזגן לפני ואחרי מראים עבודה מסודרת.", onscreenHe: "ככה זה נראה כשהגענו" },
      { nicheSlug: "auto-services", angleHe: "פנים הרכב לפני ואחרי ניקוי הם הוכחה בשנייה.", onscreenHe: "שלוש שעות של דיטיילינג" },
      { nicheSlug: "renovation-contractors", angleHe: "חדר רחצה ישן מול חדש, באותה זווית.", onscreenHe: "האמבטיה הזאת חיכתה מספיק." },
    ],
    music: { moodHe: "ביט ברור עם רגע מעבר", bpmMin: 110, bpmMax: 130, energy: "drop", originalHadProtectedSong: false },
    complianceNotesHe: [
      "רק תוצאות אמיתיות. אף פעם לא \"אחרי\" שנוצר ב-AI.",
      "קליניקות אסתטיקה: לפני ואחרי של טיפול רפואי מוגבל בפרסום ממומן.",
      "כשרואים לקוח, צריך את ההסכמה שלו.",
    ],
    shotList: [
      { key: "before", titleHe: "הלפני", instructionHe: "שימו את הטלפון על חצובה או סמנו את המקום על הרצפה. צלמו את המצב לפני, 2–3 שניות.", framing: "wide", minSec: 2, maxSec: 4, ghost: "tripod_wide", tipsHe: ["סמנו את מקום הטלפון במדבקה. תצטרכו אותו שוב.", "אותה תאורה בשני השוטים."], peopleOnCamera: false },
      { key: "snap", titleHe: "הסנאפ", instructionHe: "בלי להזיז את הטלפון: יד מכסה את העדשה, או סנאפ באצבעות מול המצלמה.", framing: "closeup", minSec: 1, maxSec: 2, ghost: "cover_lens", tipsHe: ["תנועה אחת מהירה."], peopleOnCamera: false },
      { key: "after", titleHe: "האחרי", instructionHe: "מאותה נקודה בדיוק, אחרי העבודה. 4–6 שניות, ואפשר תנועה איטית פנימה.", framing: "wide", minSec: 4, maxSec: 6, ghost: "tripod_wide", tipsHe: ["אותה זווית בדיוק כמו בלפני.", "תנו לתוצאה רגע לפני שעוצרים."], peopleOnCamera: false },
    ],
    hookChecks: checks(["captions_on"]),
    tile: { tone: "success", art: "split_reveal" },
  },
  {
    slug: "day-in-the-life",
    nameHe: "יום בחיים של…",
    taglineHe: "06:30, פותחים את העסק. מונטאז׳ מהיר של יום אמיתי.",
    whyItWorksHe: [
      "חותמת שעה בכל שוט יוצרת קצב ורצון לראות מה הלאה.",
      "תוכן אמיתי ולא מלוטש עובד היום טוב יותר מפרסומת.",
      "מכירים את האנשים שמאחורי העסק.",
    ],
    hookTypeSlug: "day-in-life",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "guided",
    adSafety: "needs_consent",
    durationSec: 30,
    nicheSlugs: "all",
    genericFitHe: "לכל עסק יש בוקר, עומס וסגירה. זה כבר סיפור.",
    defaultOnscreenHe: "06:30. עוד רגע פותחים",
    beats: [
      { key: "open", role: "bait", durationMs: 2500, titleHe: "פתיחה עם שעה", descriptionHe: "06:30, המפתח בדלת והאור נדלק.", visualSource: "user_media", overlay: "clock", guidedShotKey: "opening" },
      { key: "moments", role: "payoff", durationMs: 16000, titleHe: "רגעים מהיום", descriptionHe: "5–8 שוטים קצרים לאורך היום, כל אחד עם השעה שלו.", visualSource: "user_media", overlay: "clock", guidedShotKey: "moments" },
      { key: "reflection", role: "reveal", durationMs: 5000, titleHe: "משפט לסיום", descriptionHe: "משפט אחד: למה אתם עושים את זה.", visualSource: "user_media", guidedShotKey: "reflection" },
      { key: "cta", role: "cta", durationMs: 4000, titleHe: "הנעה לפעולה", descriptionHe: "\"בואו להגיד שלום\" ווואטסאפ.", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "מפתח בדלת בחושך", hookLineHe: "06:30. עוד רגע פותחים", whyHe: "שעה מוקדמת היא סיפור בפני עצמה." },
      { key: "B", baitHe: "קפה ראשון על הדלפק", hookLineHe: "ככה מתחיל אצלנו יום", whyHe: "רגע אישי וחם שכל אחד מכיר." },
      { key: "C", baitHe: "שעון על הקיר שמתקדם מהר", hookLineHe: "יום שלם בחצי דקה", whyHe: "הבטחה ברורה לקצב מהיר." },
    ],
    nicheAdaptations: [
      { nicheSlug: "restaurants", angleHe: "הבצק, הגחלים והעומס של הצהריים הם הסיפור שלכם.", onscreenHe: "06:30. הבצק כבר תופח" },
      { nicheSlug: "fitness-trainers", angleHe: "האימון הראשון של הבוקר מראה מחויבות.", onscreenHe: "05:45. האימון הראשון של היום" },
      { nicheSlug: "beauty-nails", angleHe: "הכנת העמדה, הלקוחה הראשונה, והתוצאה בסוף היום.", onscreenHe: "09:00. העמדה מוכנה" },
      { nicheSlug: "event-venues", angleHe: "מאולם ריק לחתונה מלאה ביום אחד.", onscreenHe: "16:00. עורכים את השולחנות" },
    ],
    music: { moodHe: "אופטימית, עם קצב שמתגבר", bpmMin: 100, bpmMax: 120, energy: "build", originalHadProtectedSong: false },
    complianceNotesHe: [
      "כל מי שמופיע צריך להסכים להופיע.",
      "לקוחות בפריים רק עם ההסכמה שלהם.",
      "השעות אמיתיות. לא כותבים 06:30 כשפותחים ב-09:00.",
    ],
    shotList: [
      { key: "opening", titleHe: "פתיחת היום", instructionHe: "צלמו את הרגע הראשון: מפתח בדלת, אור שנדלק או קפה ראשון. 2–3 שניות.", framing: "medium", minSec: 2, maxSec: 4, ghost: "hands_table", tipsHe: ["כדאי לצלם באמת בשעה שתופיע על המסך."], peopleOnCamera: false },
      { key: "moments", titleHe: "רגעים מהיום", instructionHe: "5–8 שוטים קצרים של 1–2 שניות לאורך היום, כל פעם משהו אחר: עבודה, לקוח, ניקיון.", framing: "medium", minSec: 8, maxSec: 16, ghost: "tripod_wide", tipsHe: ["רשמו לעצמכם את השעה של כל שוט.", "שוטים קצרים, קצב מהיר."], peopleOnCamera: true },
      { key: "reflection", titleHe: "משפט לסיום", instructionHe: "דברו למצלמה משפט אחד: למה אתם אוהבים את מה שאתם עושים.", framing: "medium", minSec: 4, maxSec: 6, ghost: "face_center", tipsHe: ["משפט אחד, בלי לקרוא מדף.", "אור מול הפנים."], peopleOnCamera: true },
    ],
    hookChecks: checks(["hook_words"]),
    tile: { tone: "gold", art: "clock" },
  },
  {
    slug: "asmr-process",
    nameHe: "תהליך מספק",
    taglineHe: "חומר גלם, תהליך בקלוז-אפ ותוצאה. בלי לדבר.",
    whyItWorksHe: [
      "מרקם וצליל חד בקלוז-אפ קשה להפסיק לראות.",
      "עובד בלי סאונד, ועוד יותר טוב איתו.",
      "מראה מקצועיות בלי מילה אחת.",
    ],
    hookTypeSlug: "satisfying-visual",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "guided",
    adSafety: "ad_safe",
    durationSec: 15,
    nicheSlugs: ["catering-chefs", "restaurants", "beauty-nails", "barbers-salons", "auto-services", "retail-stores", "ecommerce"],
    genericFitHe: "כל עבודה של ידיים נראית מעולה מקרוב.",
    defaultOnscreenHe: "חכו לסוף",
    beats: [
      { key: "raw", role: "bait", durationMs: 2000, titleHe: "חומר הגלם", descriptionHe: "חומר הגלם בקלוז-אפ, מלמעלה.", visualSource: "user_media", guidedShotKey: "raw" },
      { key: "process", role: "payoff", durationMs: 7500, titleHe: "התהליך", descriptionHe: "3–4 קלוז-אפים של הידיים בעבודה, עם הצליל האמיתי.", visualSource: "user_media", guidedShotKey: "process" },
      { key: "finished", role: "reveal", durationMs: 3000, titleHe: "התוצאה", descriptionHe: "התוצאה המוגמרת, בסיבוב איטי.", visualSource: "user_media", guidedShotKey: "finished" },
    ],
    hookVariants: [
      { key: "A", baitHe: "סכין שנכנסת לבצק טרי", hookLineHe: "חכו לסוף", whyHe: "הבטחה קטנה שמחזיקה עד הסוף." },
      { key: "B", baitHe: "שכבת לק ראשונה מקרוב", hookLineHe: "הדבר הכי מספק שתראו היום", whyHe: "מזמין לבדוק אם זה נכון." },
      { key: "C", baitHe: "קצף לבן על רכב שחור", hookLineHe: "תקשיבו לזה עם סאונד", whyHe: "מבקש מהצופה פעולה קטנה, וזה מגדיל את הצפייה." },
    ],
    nicheAdaptations: [
      { nicheSlug: "catering-chefs", angleHe: "בצק נפתח ורוטב נשפך: המטבח שלכם הוא ההוק.", onscreenHe: "תקשיבו לזה עם סאונד" },
      { nicheSlug: "beauty-nails", angleHe: "שכבה אחרי שכבה של ג׳ל מראה דיוק.", onscreenHe: "הדבר הכי מספק שתראו היום" },
      { nicheSlug: "auto-services", angleHe: "קצף, שטיפה וברק: התוצאה מדברת.", onscreenHe: "חכו לסוף" },
      { nicheSlug: "retail-stores", angleHe: "אריזה בנייר משי מראה כמה אכפת לכם.", onscreenHe: "אורזים לכם הזמנה" },
    ],
    music: { moodHe: "רכה, בלי תופים, כדי שהצלילים יישמעו", bpmMin: 70, bpmMax: 90, energy: "flat", originalHadProtectedSong: false },
    complianceNotesHe: [
      "צלילים אמיתיים מהעבודה, ומוזיקה רק מהספרייה המורשית.",
      "לא צריך אנשים בפריים. ידיים מספיקות.",
    ],
    shotList: [
      { key: "raw", titleHe: "חומר הגלם", instructionHe: "צלמו את חומר הגלם מקרוב, מלמעלה. 2–3 שניות.", framing: "closeup", minSec: 2, maxSec: 4, ghost: "product_center", tipsHe: ["רקע נקי ואחיד.", "הטלפון יציב, מעל השולחן."], peopleOnCamera: false },
      { key: "process", titleHe: "הידיים בעבודה", instructionHe: "3–4 שוטים קרובים של התהליך. הטלפון יציב, רק הידיים זזות.", framing: "closeup", minSec: 6, maxSec: 10, ghost: "hands_table", tipsHe: ["קרוב יותר ממה שנראה לכם טבעי.", "שקט בחדר, כדי שהצליל יישמע."], peopleOnCamera: false },
      { key: "finished", titleHe: "התוצאה", instructionHe: "התוצאה המוגמרת במרכז הפריים, בתנועה איטית סביבה.", framing: "closeup", minSec: 3, maxSec: 5, ghost: "product_center", tipsHe: ["סיבוב חצי עיגול, לאט."], peopleOnCamera: false },
    ],
    hookChecks: checks(["text_by_500ms", "captions_on"]),
    tile: { tone: "rose", art: "satisfying" },
  },
  {
    slug: "myth-vs-fact",
    nameHe: "מיתוס מול עובדה",
    taglineHe: "מיתוס על המסך, \"לא נכון\", ואז ההסבר.",
    whyItWorksHe: [
      "מיתוס מוכר עוצר את הגלילה: \"רגע, זה לא נכון?\"",
      "מציג אתכם כמומחים בלי להתרברב.",
      "טיפ שימושי בסוף גורם לשמור את הסרטון.",
    ],
    hookTypeSlug: "myth-busting",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "hybrid",
    adSafety: "ad_safe",
    durationSec: 30,
    nicheSlugs: ["accountants", "dentists", "fitness-trainers", "mortgage-advisors", "lawyers", "insurance-agents", "physio-nutrition", "real-estate", "vets-dog-grooming", "driving-schools"],
    genericFitHe: "בכל מקצוע יש משהו שלקוחות בטוחים בו, והוא לא נכון.",
    defaultOnscreenHe: "שמעתם את זה מאה פעמים, וזה לא נכון",
    beats: [
      { key: "myth", role: "bait", durationMs: 3000, titleHe: "המיתוס", descriptionHe: "המיתוס, בדיוק כמו שלקוחות אומרים אותו.", visualSource: "user_media", overlay: "rating", guidedShotKey: "myth" },
      { key: "wrong", role: "payoff", durationMs: 2000, titleHe: "לא נכון", descriptionHe: "חותמת ✗ גדולה על המסך.", visualSource: "brand_card", overlay: "rating" },
      { key: "why", role: "reveal", durationMs: 12000, titleHe: "למה", descriptionHe: "הסבר קצר בגובה העיניים.", visualSource: "user_media", guidedShotKey: "explain" },
      { key: "tip", role: "payoff", durationMs: 6500, titleHe: "הטיפ", descriptionHe: "טיפ אחד שאפשר ליישם היום, עם חותמת ✓.", visualSource: "user_media", overlay: "rating", guidedShotKey: "tip" },
      { key: "cta", role: "cta", durationMs: 4000, titleHe: "הנעה לפעולה", descriptionHe: "\"יש לכם שאלה? שלחו לנו וואטסאפ\".", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "חותמת ✗ אדומה שנוחתת על המסך", hookLineHe: "שמעתם את זה מאה פעמים, וזה לא נכון", whyHe: "סתירה ישירה למשהו שהצופה מאמין בו." },
      { key: "B", baitHe: "פנים מופתעות מול המצלמה", hookLineHe: "מיתוס שעולה לכם כסף", whyHe: "כסף הוא סיבה טובה להישאר עד הסוף." },
      { key: "C", baitHe: "כרטיס \"נכון או לא נכון\"", hookLineHe: "נכון או לא? יש לכם 3 שניות", whyHe: "משחק קטן שמכניס את הצופה פנימה." },
    ],
    nicheAdaptations: [
      { nicheSlug: "accountants", angleHe: "לקוחות קטנים חושבים שהם לא צריכים ליווי. אתם מסבירים למה כן.", onscreenHe: "\"אני קטן מדי בשביל רואה חשבון\"" },
      { nicheSlug: "dentists", angleHe: "\"לא כואב, אז אין מה לבדוק\" הוא המיתוס הכי נפוץ.", onscreenHe: "אם לא כואב, אין מה לבדוק?" },
      { nicheSlug: "fitness-trainers", angleHe: "בטן שטוחה רק מכפיפות בטן? זה המיתוס שכולם מכירים.", onscreenHe: "בטן שטוחה עושים רק עם כפיפות בטן?" },
      { nicheSlug: "mortgage-advisors", angleHe: "הרבה חושבים שהבנק שלהם ייתן להם את ההצעה הכי טובה.", onscreenHe: "\"הבנק שלי כבר ייתן לי את הכי טוב\"" },
    ],
    music: { moodHe: "בטוחה ושקטה מתחת לדיבור", bpmMin: 80, bpmMax: 100, energy: "flat", originalHadProtectedSong: false },
    complianceNotesHe: [
      "כל טענה נכונה ומבוססת.",
      "בתחומים מוסדרים, כמו בריאות ופיננסים: בלי הבטחות לתוצאה.",
    ],
    shotList: [
      { key: "myth", titleHe: "המיתוס", instructionHe: "אמרו למצלמה את המיתוס כמו שלקוחות אומרים אותו, עם פנים רציניות.", framing: "medium", minSec: 3, maxSec: 5, ghost: "face_center", tipsHe: ["משפט אחד קצר.", "הטלפון בגובה העיניים."], peopleOnCamera: true },
      { key: "explain", titleHe: "ההסבר", instructionHe: "הסבירו בשני משפטים למה זה לא נכון, עם מבט למצלמה.", framing: "medium", minSec: 8, maxSec: 14, ghost: "face_center", tipsHe: ["דברו כמו עם לקוח מולכם.", "בלי מונחים מקצועיים."], peopleOnCamera: true },
      { key: "tip", titleHe: "הטיפ", instructionHe: "טיפ אחד שאפשר ליישם היום. אפשר להראות משהו ביד.", framing: "closeup", minSec: 4, maxSec: 8, ghost: "hands_table", tipsHe: ["טיפ אחד בלבד. השאר בסרטון הבא."], peopleOnCamera: false },
    ],
    hookChecks: checks(["safe_zones"]),
    tile: { tone: "rose", art: "rating" },
  },
  {
    slug: "reply-to-comment",
    nameHe: "עונים לתגובה",
    taglineHe: "כרטיס תגובה בפריים הראשון, ותשובה ישירה.",
    whyItWorksHe: [
      "כרטיס תגובה נראה כמו שיחה אמיתית, ועוצר את הגלילה.",
      "עונה על השאלה שעוצרת לקוחות לפני שהם פונים.",
      "מצוין לשאלות נפוצות ולהתנגדויות.",
    ],
    hookTypeSlug: "question",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "hybrid",
    adSafety: "ad_safe",
    durationSec: 30,
    nicheSlugs: "all",
    genericFitHe: "יש שאלה שכל לקוח שואל אתכם. התשובה שלכם היא הסרטון.",
    defaultOnscreenHe: "לקוח שאל: כמה זמן זה לוקח?",
    beats: [
      { key: "comment", role: "bait", durationMs: 3000, titleHe: "התגובה", descriptionHe: "כרטיס \"לקוח שאל:\" עם שאלה אמיתית באישור, או ניסוח כללי.", visualSource: "brand_card", overlay: "comment_bubble" },
      { key: "answer", role: "payoff", durationMs: 16500, titleHe: "התשובה", descriptionHe: "תשובה ישירה וקצרה, בלי להתחמק.", visualSource: "user_media", guidedShotKey: "answer" },
      { key: "cta", role: "cta", durationMs: 8000, titleHe: "הנעה לפעולה", descriptionHe: "\"יש לכם שאלה? שלחו לנו וואטסאפ\".", visualSource: "user_media", guidedShotKey: "cta" },
    ],
    hookVariants: [
      { key: "A", baitHe: "כרטיס \"לקוח שאל:\" שקופץ למסך", hookLineHe: "שאלו אותנו כמה זה עולה באמת", whyHe: "השאלה שכולם רוצים לשאול ומתביישים." },
      { key: "B", baitHe: "שאלה שנכתבת מילה אחרי מילה", hookLineHe: "השאלה שכל לקוח שואל אותנו", whyHe: "מבטיח מידע שימושי ומוכר." },
      { key: "C", baitHe: "ראש שמונד \"לא\" לפני שהשאלה נגמרת", hookLineHe: "לא, זה לא מסובך כמו שחושבים", whyHe: "מרגיע פחד אמיתי בשורה אחת." },
    ],
    nicheAdaptations: [
      { nicheSlug: "lawyers", angleHe: "שאלה משפטית נפוצה, בתשובה פשוטה וזהירה.", onscreenHe: "לקוח שאל: מה קורה כשאין צוואה?" },
      { nicheSlug: "insurance-agents", angleHe: "השאלה על הפרמיה היא בדיוק מה שמטריד לקוחות.", onscreenHe: "לקוח שאל: למה הפרמיה שלי עלתה?" },
      { nicheSlug: "interior-design", angleHe: "דירה קטנה היא אתגר שכולם מכירים.", onscreenHe: "לקוח שאל: אפשר לעצב דירה קטנה בלי לשבור קירות?" },
    ],
    music: { moodHe: "שקטה מתחת לדיבור", bpmMin: 80, bpmMax: 100, energy: "flat", originalHadProtectedSong: false },
    complianceNotesHe: [
      "תגובות אמיתיות רק באישור מי שכתב אותן, או ניסוח כללי בלי שם.",
      "בלי עיצוב שמחקה רשת חברתית מסוימת ובלי שמות בדויים.",
    ],
    shotList: [
      { key: "listen", titleHe: "קוראים את השאלה", instructionHe: "הסתכלו בטלפון כאילו אתם קוראים תגובה, ואז הרימו מבט למצלמה.", framing: "medium", minSec: 2, maxSec: 3, ghost: "face_center", tipsHe: ["רגע של מחשבה לפני המבט."], peopleOnCamera: true },
      { key: "answer", titleHe: "התשובה", instructionHe: "ענו למצלמה ב-2–3 משפטים, פשוט, כמו בשיחה.", framing: "medium", minSec: 10, maxSec: 20, ghost: "face_center", tipsHe: ["תשובה אחת ברורה.", "אפשר לצלם כמה טייקים, אנחנו בוחרים את הטוב."], peopleOnCamera: true },
      { key: "cta", titleHe: "הזמנה לשאול", instructionHe: "סיימו ב\"יש לכם שאלה? שלחו לנו\". אפשר להפנות את הטלפון לעסק.", framing: "medium", minSec: 2, maxSec: 4, ghost: "tripod_wide", tipsHe: ["חיוך קטן בסוף עוזר."], peopleOnCamera: true },
    ],
    hookChecks: checks(["motion_in_1s"]),
    tile: { tone: "violet", art: "comment_bubble" },
  },
  {
    slug: "price-reveal",
    nameHe: "כמה זה עולה באמת",
    taglineHe: "מספר גדול על המסך בשנייה הראשונה, ואז הפירוק.",
    whyItWorksHe: [
      "מחיר הוא הדבר הראשון שלקוחות רוצים לדעת.",
      "מספר גדול בשנייה הראשונה עוצר את הגלילה.",
      "שקיפות בונה אמון ומסננת פניות לא רלוונטיות.",
    ],
    hookTypeSlug: "price-reveal",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "ai",
    adSafety: "ad_safe",
    durationSec: 15,
    nicheSlugs: ["restaurants", "home-services", "real-estate", "renovation-contractors", "barbers-salons", "beauty-nails", "driving-schools", "movers-storage", "catering-chefs", "car-dealers"],
    genericFitHe: "אם יש לכם מחיר ברור, להראות אותו זה הדבר הכי משכנע.",
    defaultOnscreenHe: "כמה זה עולה באמת?",
    beats: [
      { key: "number", role: "bait", durationMs: 2000, titleHe: "המספר", descriptionHe: "המחיר האמיתי, גדול, במרכז המסך.", visualSource: "brand_card", overlay: "price" },
      { key: "breakdown", role: "payoff", durationMs: 5500, titleHe: "הפירוק", descriptionHe: "מה בדיוק מקבלים במחיר הזה.", visualSource: "ai_image_kenburns" },
      { key: "offer", role: "reveal", durationMs: 2500, titleHe: "ההצעה", descriptionHe: "מה כלול, ואם יש מבצע אמיתי.", visualSource: "ai_image_kenburns" },
      { key: "cta", role: "cta", durationMs: 2500, titleHe: "הנעה לפעולה", descriptionHe: "\"שלחו וואטסאפ להצעת מחיר\".", visualSource: "brand_card" },
    ],
    hookVariants: [
      { key: "A", baitHe: "מספר שקופץ למרכז המסך", hookLineHe: "כמה זה עולה באמת?", whyHe: "השאלה שכל לקוח שואל, בתשובה מיידית." },
      { key: "B", baitHe: "חשבונית שנפתחת לאט", hookLineHe: "מה מקבלים במחיר הזה?", whyHe: "מבטיח פירוט, ולכן מחזיק." },
      { key: "C", baitHe: "מחשבון על השולחן", hookLineHe: "בלי הפתעות בסוף", whyHe: "מרגיע את הפחד הכי גדול: תוספות." },
    ],
    nicheAdaptations: [
      { nicheSlug: "restaurants", angleHe: "ארוחה זוגית עם מחיר ברור מביאה הזמנות באמצע השבוע.", onscreenHe: "כמה עולה ארוחה זוגית אצלנו?" },
      { nicheSlug: "home-services", angleHe: "מחיר שקוף לעבודה נפוצה מוריד את החשש להזמין.", onscreenHe: "כמה עולה החלפת ברז?" },
      { nicheSlug: "real-estate", angleHe: "מה מקבלים היום בתקציב מסוים, לפי מחירים עדכניים.", onscreenHe: "מה מקבלים היום בתקציב של דירת 4 חדרים?" },
    ],
    music: { moodHe: "בטוחה, עם הדגשה על המספר", bpmMin: 100, bpmMax: 120, energy: "drop", originalHadProtectedSong: false },
    complianceNotesHe: [
      "רק מחירים עדכניים ואמיתיים (חוק הגנת הצרכן).",
      "אם המחיר \"החל מ-\", כותבים את זה על המסך.",
    ],
    hookChecks: checks(["subject_scene1"]),
    tile: { tone: "gold", art: "price" },
  },
  {
    slug: "quick-how-to",
    nameHe: "מדריך מהיר",
    taglineHe: "\"3 טיפים ב-20 שניות\", ומקיימים.",
    whyItWorksHe: [
      "הבטחה ברורה של ערך בזמן קצוב.",
      "אנשים שומרים סרטונים כאלה, ושמירה שווה יותר מלייק.",
      "כתוביות שעוזרות למצוא את הסרטון בחיפוש.",
    ],
    hookTypeSlug: "how-to",
    lifecycle: "evergreen",
    stage: "classic",
    isThisWeek: false,
    productionMode: "hybrid",
    adSafety: "ad_safe",
    durationSec: 30,
    nicheSlugs: "all",
    genericFitHe: "שלושה טיפים מהמקצוע שלכם מראים ידע, ובונים אמון לפני הפנייה.",
    defaultOnscreenHe: "3 טיפים ב-20 שניות",
    beats: [
      { key: "promise", role: "bait", durationMs: 2500, titleHe: "ההבטחה", descriptionHe: "\"3 טיפים ב-20 שניות\", עם טיימר קטן.", visualSource: "user_media", overlay: "clock", guidedShotKey: "promise" },
      { key: "tip1", role: "payoff", durationMs: 6000, titleHe: "טיפ 1", descriptionHe: "הטיפ הראשון, עם הדגמה ביד.", visualSource: "user_media", guidedShotKey: "tips" },
      { key: "tip2", role: "payoff", durationMs: 6000, titleHe: "טיפ 2", descriptionHe: "הטיפ השני.", visualSource: "ai_image_kenburns", guidedShotKey: "tips" },
      { key: "tip3", role: "payoff", durationMs: 6000, titleHe: "טיפ 3", descriptionHe: "הטיפ השלישי, הכי שימושי.", visualSource: "user_media", guidedShotKey: "tips" },
      { key: "cta", role: "cta", durationMs: 7000, titleHe: "הנעה לפעולה", descriptionHe: "\"שמרו את הסרטון\" או וואטסאפ.", visualSource: "brand_card", guidedShotKey: "cta" },
    ],
    hookVariants: [
      { key: "A", baitHe: "טיימר שמתחיל לרוץ", hookLineHe: "3 טיפים ב-20 שניות", whyHe: "הבטחה מדידה, והטיימר מוכיח אותה." },
      { key: "B", baitHe: "יד שמראה שלוש אצבעות", hookLineHe: "שלושה דברים שאף אחד לא אומר לכם", whyHe: "תחושת סוד מקצועי." },
      { key: "C", baitHe: "רשימה שנכתבת על דף", hookLineHe: "שמרו את זה לפני הקיץ", whyHe: "עונתיות שנותנת סיבה לשמור עכשיו." },
    ],
    nicheAdaptations: [
      { nicheSlug: "home-services", angleHe: "בדיקות קטנות שהלקוח יכול לעשות בבית לפני שמזמינים אתכם.", onscreenHe: "3 דברים לבדוק במזגן לפני הקיץ" },
      { nicheSlug: "physio-nutrition", angleHe: "תרגילים פשוטים שמראים ידע, בלי לאבחן.", onscreenHe: "3 תרגילים לגב אחרי יום מול מחשב" },
      { nicheSlug: "vets-dog-grooming", angleHe: "טיפוח בבית בין התורים, עם הטיפ שלכם.", onscreenHe: "3 טיפים לטיפוח כלב בבית" },
    ],
    music: { moodHe: "קלילה ומהירה", bpmMin: 105, bpmMax: 125, energy: "loop", originalHadProtectedSong: false },
    complianceNotesHe: [
      "טיפים נכונים ובטוחים בלבד.",
      "בתחומי בריאות: מידע כללי, לא אבחון ולא טיפול.",
    ],
    shotList: [
      { key: "promise", titleHe: "ההבטחה", instructionHe: "פנים למצלמה ושלוש אצבעות למעלה: \"שלושה טיפים, 20 שניות\".", framing: "medium", minSec: 2, maxSec: 3, ghost: "face_center", tipsHe: ["אנרגיה גבוהה בשנייה הראשונה."], peopleOnCamera: true },
      { key: "tips", titleHe: "שלושת הטיפים", instructionHe: "שוט קצר לכל טיפ: מראים ביד את מה שמסבירים.", framing: "closeup", minSec: 12, maxSec: 18, ghost: "hands_table", tipsHe: ["טיפ אחד בכל שוט.", "מראים, לא רק מספרים."], peopleOnCamera: false },
      { key: "cta", titleHe: "סיום", instructionHe: "\"שמרו את הסרטון\" או \"שלחו לנו וואטסאפ\".", framing: "medium", minSec: 2, maxSec: 4, ghost: "face_center", tipsHe: ["משפט אחד וחיוך."], peopleOnCamera: true },
    ],
    hookChecks: checks(["safe_zones"]),
    tile: { tone: "success", art: "how_to" },
  },
];

/** Mock workspace (sample business "גחלת", App D §3, fictional). */
export const MOCK_WORKSPACE = {
  businessNameHe: "גחלת – גריל בר שכונתי",
  nicheSlug: "restaurants",
  /** Static mock date of the last weekly drop (Sunday 08:00 Asia/Jerusalem). */
  lastDropHe: "יום ראשון, 11 באוקטובר",
} as const;

export const getTrend = (slug: string) => TREND_TEMPLATES.find((t) => t.slug === slug);

export function hookScore(t: TrendTemplate): number {
  return HOOK_CHECKS.reduce((sum, c) => sum + (t.hookChecks[c.key] ? c.weight : 0), 0);
}

export const fitsNiche = (t: TrendTemplate, nicheSlug: string) =>
  t.nicheSlugs === "all" || t.nicheSlugs.includes(nicheSlug);

export const adaptationFor = (t: TrendTemplate, nicheSlug: string | null | undefined) =>
  nicheSlug ? t.nicheAdaptations.find((a) => a.nicheSlug === nicheSlug) : undefined;

export const onscreenFor = (t: TrendTemplate, nicheSlug: string | null | undefined) =>
  adaptationFor(t, nicheSlug)?.onscreenHe ?? t.defaultOnscreenHe;

export const supportsAi = (t: TrendTemplate) => t.productionMode !== "guided";
export const supportsGuided = (t: TrendTemplate) => t.productionMode !== "ai" && !!t.shotList?.length;

/** Guided shoots: one mock project per template that has a shot list (`/app/projects/{id}/shoot`). */
export const shootProjectId = (slug: string) => `trend-${slug}`;
export const SHOOT_PROJECTS = TREND_TEMPLATES.filter(supportsGuided).map((t) => ({
  projectId: shootProjectId(t.slug),
  trendSlug: t.slug,
}));
export const getShootProject = (projectId: string) => {
  const p = SHOOT_PROJECTS.find((s) => s.projectId === projectId);
  const trend = p ? getTrend(p.trendSlug) : undefined;
  return p && trend ? { ...p, trend } : undefined;
};

/** `/app/create?trend=…` deep link (§J.6). The wizard owner reads these params. */
export function createHref(slug: string, mode: "ai" | "guided", nicheSlug?: string | null) {
  const q = new URLSearchParams({ trend: slug, mode, src: "trend" });
  if (nicheSlug) q.set("niche", nicheSlug);
  return `/app/create?${q.toString()}`;
}
