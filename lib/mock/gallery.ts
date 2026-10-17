/**
 * Mock data for `/examples` and `/templates` (Part 02 §6).
 *
 * Examples: there are no published customer examples yet (`examples.is_published`), so the gallery shows its
 * empty state and the five Appendix D demos — always tagged "הדגמה (אנימטיק)". All businesses are fictional.
 *
 * Templates: `templates.json` in the seed is `[]` (Part 04 §16, step 14). These rows follow the `templates`
 * table (Part 04) so the pages render before an admin writes the real ones.
 */
import type { VIDEO_TYPE_LABEL } from "@/lib/labels";

export type VideoType = keyof typeof VIDEO_TYPE_LABEL;
export type AspectRatio = "9:16" | "1:1" | "16:9";
export type Structure = "hpspc" | "aida" | "pas" | "bab" | "result_first" | "brand_story";
export type BeatRole = "hook" | "problem" | "agitate" | "solution" | "proof" | "offer" | "cta" | "brand" | "story";
export type VisualStyle = "cinematic" | "ugc" | "day_in_business" | "before_after" | "product" | "text_motion";
export type VisualMix = "images" | "smart" | "full";
export type CaptionPreset = "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";
export type MusicMood = "energetic" | "warm" | "luxury" | "funny" | "calm" | "inspiring" | "urban";
export type Quality = "draft" | "standard" | "premium";

// ---------------------------------------------------------------------------------------------
// Examples (Appendix D demos)
// ---------------------------------------------------------------------------------------------

export interface DemoScene {
  t: string; // "0:00–0:03" — rendered LTR
  onscreen_he: string | null;
  visual_he: string;
}

export interface DemoExample {
  slug: string;
  title_he: string;
  niche_slug: string;
  video_type: VideoType;
  aspect_ratio: AspectRatio;
  extra_formats: AspectRatio[];
  duration_sec: number;
  hook_id: string;
  hook_text_he: string;
  /** Pre-filled wizard target (`/app/create?niche=&hook=&src=hooks`). */
  template_slug: string | null;
  scenes: DemoScene[];
  is_demo: true;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    slug: "restaurants-grill-30",
    title_he: "רילס לגריל בר שכונתי (עסק לדוגמה)",
    niche_slug: "restaurants",
    video_type: "reel_hook",
    aspect_ratio: "9:16",
    extra_formats: [],
    duration_sec: 30,
    hook_id: "restaurants-01",
    hook_text_he: "אל תבואו אלינו רעבים. ברצינות.",
    template_slug: "reel-hook-30",
    scenes: [
      { t: "0:00–0:03", onscreen_he: "אל תבואו אלינו רעבים.", visual_he: "מגש מעורב ענק נוחת על שולחן עץ בהילוך איטי" },
      { t: "0:03–0:07", onscreen_he: "צלחת ענקית. מנה קטנה.", visual_he: "מנה זעירה במרכז צלחת לבנה ענקית" },
      { t: "0:07–0:13", onscreen_he: "הכול על גחלים. מול העיניים.", visual_he: "שיפודים מסתובבים על גחלים, ניצוצות" },
      { t: "0:13–0:19", onscreen_he: "ארוחה זוגית מלאה: {מחיר} ₪", visual_he: "השולחן מתמלא בסלטים, פיתות ושיפודים" },
      { t: "0:19–0:25", onscreen_he: "4.8 בגוגל, 1,240 ביקורות", visual_he: "שני חברים צוחקים ליד שולחן מלא" },
      { t: "0:25–0:30", onscreen_he: "שולחן להערב? שלחו וואטסאפ", visual_he: "חזית הגריל בלילה, וכרטיס הסיום" },
    ],
    is_demo: true,
  },
  {
    slug: "renovation-bathroom-30",
    title_he: "לפני ואחרי של חדר רחצה לקבלן שיפוצים (עסק לדוגמה)",
    niche_slug: "renovation-contractors",
    video_type: "reel_hook",
    aspect_ratio: "9:16",
    extra_formats: ["1:1"],
    duration_sec: 30,
    hook_id: "renovation-contractors-04",
    hook_text_he: "אמבטיה משנות ה-80 ← 10 ימי עבודה",
    template_slug: "before-after-30",
    scenes: [
      { t: "0:00–0:03", onscreen_he: "אמבטיה משנות ה-80 ← 10 ימי עבודה", visual_he: "פטיש פוגע באריח ורוד ישן, אבק עף" },
      { t: "0:03–0:08", onscreen_he: "ככה זה התחיל.", visual_he: "התמונה של החדר לפני, בתקריב איטי" },
      { t: "0:08–0:14", onscreen_he: "אחרי: אותה זווית בדיוק", visual_he: "התמונה של החדר אחרי, עם מעבר הבזק" },
      { t: "0:14–0:20", onscreen_he: "לוח זמנים חתום. עדכון יומי.", visual_he: "פינת המקלחת אחרי איטום" },
      { t: "0:20–0:25", onscreen_he: "אחריות בכתב על האיטום", visual_he: "פלס על אריחים חדשים" },
      { t: "0:25–0:30", onscreen_he: "שלחו תמונות של החדר בוואטסאפ", visual_he: "בעל דירה מצלם חדר רחצה ישן, וכרטיס הסיום" },
    ],
    is_demo: true,
  },
  {
    slug: "mortgage-mix-30",
    title_he: "סרטון הסבר ליועצת משכנתאות (עסק לדוגמה)",
    niche_slug: "mortgage-advisors",
    video_type: "explainer",
    aspect_ratio: "9:16",
    extra_formats: ["16:9"],
    duration_sec: 30,
    hook_id: "mortgage-advisors-01",
    hook_text_he: "אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים",
    template_slug: "explainer-pas-30",
    scenes: [
      { t: "0:00–0:03", onscreen_he: "אותה משכנתא. הפרש של מאות אלפי שקלים.", visual_he: "שתי צנצנות זהות עם מטבעות, אחת מתמלאת מהר יותר" },
      { t: "0:04–0:08", onscreen_he: "ההבדל? התמהיל.", visual_he: "היועצת במשרד, תנועה עדינה" },
      { t: "0:08–0:13", onscreen_he: "שינוי קטן, הפרש גדול", visual_he: "ידיים מזיזות שלוש קוביות עץ" },
      { t: "0:13–0:17", onscreen_he: "פריים, קבועה, משתנה", visual_he: "כרטיס גרפי: שלושה עמודים נבנים" },
      { t: "0:21–0:25", onscreen_he: "כמה בנקים, זו מול זו", visual_he: "שתי הצעות מודפסות זו לצד זו" },
      { t: "0:25–0:30", onscreen_he: `כתבו "משכנתא" בתגובות`, visual_he: "זוג ליד שולחן המטבח, וכרטיס הסיום" },
    ],
    is_demo: true,
  },
  {
    slug: "dentists-brand-60",
    title_he: "סרטון תדמית למרפאת שיניים (עסק לדוגמה)",
    niche_slug: "dentists",
    video_type: "brand_promo",
    aspect_ratio: "16:9",
    extra_formats: ["9:16"],
    duration_sec: 60,
    hook_id: "dentists-04",
    hook_text_he: "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו",
    template_slug: "brand-story-60",
    scenes: [
      { t: "0:00–0:03", onscreen_he: "פוחדים מרופא שיניים?", visual_he: "נקודת מבט מהכיסא: מנורה רכה וצבעים רגועים" },
      { t: "0:08–0:13", onscreen_he: "בנינו את המרפאה אחרת", visual_he: "סיור איטי בחדר הטיפולים" },
      { t: "0:13–0:18", onscreen_he: "תור ראשון: שיחת היכרות", visual_he: "הסבר על דגם שיניים למטופל" },
      { t: "0:23–0:28", onscreen_he: "מסבירים כל שלב.", visual_he: "ידיים עם כפפות מצביעות על דגם" },
      { t: "0:28–0:33", onscreen_he: "עוצרים מתי שצריך.", visual_he: "מטופל מרים יד, והידיים נעצרות" },
      { t: "0:43–0:49", onscreen_he: "12 שנות ניסיון", visual_he: "עבודה שקטה ומדויקת על דגם" },
    ],
    is_demo: true,
  },
  {
    slug: "nails-hanukkah-15",
    title_he: "מבצע חנוכה לסטודיו לציפורניים (עסק לדוגמה)",
    niche_slug: "beauty-nails",
    video_type: "offer",
    aspect_ratio: "9:16",
    extra_formats: [],
    duration_sec: 15,
    hook_id: "beauty-nails-09",
    hook_text_he: "POV: יש לך אירוע בעוד יומיים, ואין תור בשום מקום",
    template_slug: "holiday-offer-15",
    scenes: [
      { t: "0:00–0:03", onscreen_he: "POV: יש לך אירוע בעוד יומיים, ואין תור", visual_he: "יד עם ציפורניים בלי לק מחזיקה טלפון" },
      { t: "0:03–0:08", onscreen_he: "בחנוכה פתוחות עד 22:00", visual_he: "מניקוריסטית מורחת לק ג׳ל בורדו" },
      { t: "0:08–0:12", onscreen_he: "לק ג׳ל ₪120", visual_he: "ציפורניים מבריקות בבורדו על כרית קטיפה" },
      { t: "0:12–0:15", onscreen_he: "קבעי תור אונליין", visual_he: "יד עם קופסת מתנה, וכרטיס הסיום" },
    ],
    is_demo: true,
  },
];

// ---------------------------------------------------------------------------------------------
// Credit estimate (mirror of Part 05 `estimateSample` for the seed `credit_costs`, Part 02 §7.5)
// ---------------------------------------------------------------------------------------------

const COST = {
  script: 2,
  storyboard: 1,
  image: { draft: 2, standard: 4, premium: 7 },
  clipPerSec: { draft: 2, standard: 5, premium: 11 },
  ttsPer15s: 1,
  renderBase: (sec: number) => (sec <= 30 ? 3 : 5),
} as const;

const IMAGES_BY_DURATION: Record<number, number> = { 15: 4, 30: 6, 45: 8, 60: 10 };
const SMART_CLIP_SEC: Record<number, number> = { 15: 7, 30: 15, 45: 24, 60: 36 };

/**
 * Same arithmetic as the four `SAMPLE_PRESETS` of Part 05 §14.2:
 * images15 = 23 · draft30 = 50 · standard30 = 107 · premium60 = 478.
 */
export function estimateSampleCredits({ durationSec, quality, visualMix, withVoice = true }: {
  durationSec: number;
  quality: Quality;
  visualMix: VisualMix;
  withVoice?: boolean;
}): number {
  const images = IMAGES_BY_DURATION[durationSec] ?? Math.round(durationSec / 5);
  const clipSec = visualMix === `images" ? 0 : visualMix === "full" ? Math.round(durationSec * 0.8) : (SMART_CLIP_SEC[durationSec] ?? Math.round(durationSec / 2));`
  const tts = withVoice ? Math.ceil(durationSec / 15) * COST.ttsPer15s : 0;
  return COST.script + COST.storyboard + images * COST.image[quality] + clipSec * COST.clipPerSec[quality] + tts + COST.renderBase(durationSec);
}

// ---------------------------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------------------------

export interface TemplateBeat {
  role: BeatRole;
  est_duration_sec: number;
  visual_idea_he: string;
}

export interface VideoTemplate {
  id: string;
  slug: string;
  name_he: string;
  description_he: string;
  niche_slug: string | null;
  video_type: VideoType;
  goal: "awareness" | "leads" | "sales" | "trust" | "engagement";
  structure: Structure;
  duration_sec: 15 | 30 | 45 | 60;
  aspect_ratio: AspectRatio;
  visual_style: VisualStyle;
  visual_mix: VisualMix;
  caption_preset: CaptionPreset;
  music_mood: MusicMood;
  default_hook_type_slug: string;
  beat_plan: TemplateBeat[];
  sample_hook_he: string;
  is_public: boolean;
  sort_order: number;
}

export const TEMPLATES: VideoTemplate[] = [
  {
    id: "tpl-reel-hook-30",
    slug: "reel-hook-30",
    name_he: "רילס עם הוק, 30 שניות",
    description_he: "המבנה הכי שימושי לרשתות: הוק חזק בשלוש השניות הראשונות, בעיה שהלקוח מכיר, הפתרון שלכם, הוכחה אחת והנעה לוואטסאפ.",
    niche_slug: null,
    video_type: "reel_hook",
    goal: "sales",
    structure: "hpspc",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "cinematic",
    visual_mix: "smart",
    caption_preset: "bold-pop",
    music_mood: "energetic",
    default_hook_type_slug: "pattern-interrupt",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "רגע מפתיע עם טקסט גדול על המסך" },
      { role: "problem", est_duration_sec: 5, visual_idea_he: "המצב שהלקוח מכיר ולא אוהב" },
      { role: "solution", est_duration_sec: 8, visual_idea_he: "איך זה עובד אצלכם, מקרוב" },
      { role: "proof", est_duration_sec: 8, visual_idea_he: "דירוג, ביקורת אמיתית או תוצאה" },
      { role: "cta", est_duration_sec: 6, visual_idea_he: "הזמנה לשלוח הודעה בוואטסאפ" },
    ],
    sample_hook_he: "אל תבואו אלינו רעבים. ברצינות.",
    is_public: true,
    sort_order: 1,
  },
  {
    id: "tpl-before-after-30",
    slug: "before-after-30",
    name_he: "לפני ואחרי, 30 שניות",
    description_he: "התמונות האמיתיות שלכם מאותה זווית, מעבר על הקצב, ואז מה עשיתם ואיך פונים אליכם. מתאים לשיפוצים, ניקיון, דיטיילינג ומספרות.",
    niche_slug: "renovation-contractors",
    video_type: "reel_hook",
    goal: "trust",
    structure: "bab",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "before_after",
    visual_mix: "smart",
    caption_preset: "poster",
    music_mood: "inspiring",
    default_hook_type_slug: "before-after",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "רגע העבודה: פטיש, מברשת או מספריים" },
      { role: "problem", est_duration_sec: 5, visual_idea_he: `התמונה שלכם של ה"לפני"` },
      { role: "solution", est_duration_sec: 6, visual_idea_he: `ה"אחרי", מאותה זווית בדיוק` },
      { role: "proof", est_duration_sec: 11, visual_idea_he: "פרטים: אחריות, לוח זמנים, חומרים" },
      { role: "cta", est_duration_sec: 5, visual_idea_he: "שלחו תמונה בוואטסאפ וקבלו הצעה" },
    ],
    sample_hook_he: "אמבטיה משנות ה-80 ← 10 ימי עבודה",
    is_public: true,
    sort_order: 2,
  },
  {
    id: "tpl-explainer-pas-30",
    slug: "explainer-pas-30",
    name_he: "הסבר שירות, 30 שניות",
    description_he: "בעיה, למה היא מציקה, ואיך אתם פותרים אותה. מבנה רגוע לנותני שירות מקצועי: משכנתאות, ביטוח, ראיית חשבון ועריכת דין.",
    niche_slug: "mortgage-advisors",
    video_type: "explainer",
    goal: "leads",
    structure: "pas",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "text_motion",
    visual_mix: "smart",
    caption_preset: "news",
    music_mood: "calm",
    default_hook_type_slug: "statistic",
    beat_plan: [
      { role: "hook", est_duration_sec: 4, visual_idea_he: "נתון או השוואה בשתי צנצנות" },
      { role: "problem", est_duration_sec: 5, visual_idea_he: "הבעיה שהלקוח לא יודע שיש לו" },
      { role: "agitate", est_duration_sec: 5, visual_idea_he: "למה זה עולה לו כסף או זמן" },
      { role: "solution", est_duration_sec: 11, visual_idea_he: "מה אתם בודקים, צעד אחר צעד" },
      { role: "cta", est_duration_sec: 5, visual_idea_he: "כתבו מילה בתגובות או שלחו הודעה" },
    ],
    sample_hook_he: "אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים",
    is_public: true,
    sort_order: 3,
  },
  {
    id: "tpl-brand-story-60",
    slug: "brand-story-60",
    name_he: "סרטון תדמית, 60 שניות",
    description_he: "סיפור העסק בדקה: מה מרגיש הלקוח, מה בניתם אחרת, איך זה נראה מבפנים ומי עומד מאחורי זה. לאתר, ליוטיוב ולמודעות.",
    niche_slug: null,
    video_type: "brand_promo",
    goal: "trust",
    structure: "brand_story",
    duration_sec: 60,
    aspect_ratio: "16:9",
    visual_style: "cinematic",
    visual_mix: "smart",
    caption_preset: "clean-box",
    music_mood: "warm",
    default_hook_type_slug: "callout",
    beat_plan: [
      { role: "hook", est_duration_sec: 4, visual_idea_he: "נקודת מבט של הלקוח ברגע הראשון" },
      { role: "story", est_duration_sec: 10, visual_idea_he: "למה לקוחות מתלבטים, בלי להאשים" },
      { role: "solution", est_duration_sec: 20, visual_idea_he: "סיור בעסק ומה עושים אחרת" },
      { role: "proof", est_duration_sec: 10, visual_idea_he: "שנות ניסיון או עובדה מאושרת" },
      { role: "brand", est_duration_sec: 10, visual_idea_he: "מי אתם, הפנים והמקום" },
      { role: "cta", est_duration_sec: 6, visual_idea_he: "התקשרו או קבעו פגישה" },
    ],
    sample_hook_he: "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו",
    is_public: true,
    sort_order: 4,
  },
  {
    id: "tpl-holiday-offer-15",
    slug: "holiday-offer-15",
    name_he: "מבצע לחג, 15 שניות",
    description_he: "מבצע אחד, ברור ואמיתי, עם תאריך סיום. תשומת לב, עניין, רצון ופעולה בחמש-עשרה שניות. מתאים לחנוכה, לפסח, לראש השנה ולבלאק פריידי.",
    niche_slug: "beauty-nails",
    video_type: "offer",
    goal: "sales",
    structure: "aida",
    duration_sec: 15,
    aspect_ratio: "9:16",
    visual_style: "product",
    visual_mix: "images",
    caption_preset: "poster",
    music_mood: "energetic",
    default_hook_type_slug: "pov",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "הרגע שבו הלקוח צריך אתכם" },
      { role: "offer", est_duration_sec: 5, visual_idea_he: "ההצעה ושעות הפתיחה בחג" },
      { role: "proof", est_duration_sec: 4, visual_idea_he: "המוצר או התוצאה מקרוב, עם המחיר" },
      { role: "cta", est_duration_sec: 3, visual_idea_he: "קבעו תור, עד מתי" },
    ],
    sample_hook_he: "POV: יש לכם אירוע בעוד יומיים, ואין תור בשום מקום",
    is_public: true,
    sort_order: 5,
  },
  {
    id: "tpl-result-first-15",
    slug: "result-first-15",
    name_he: "התוצאה קודם, 15 שניות",
    description_he: "מתחילים מהסוף: המנה המוכנה, הדירה המעוצבת או הרכב הנקי. אחר כך שתי שניות של איך, והזמנה לפנות.",
    niche_slug: null,
    video_type: "reel_hook",
    goal: "awareness",
    structure: "result_first",
    duration_sec: 15,
    aspect_ratio: "9:16",
    visual_style: "product",
    visual_mix: "smart",
    caption_preset: "bold-pop",
    music_mood: "urban",
    default_hook_type_slug: "result-first",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "התוצאה המוגמרת, הכי קרוב שאפשר" },
      { role: "solution", est_duration_sec: 6, visual_idea_he: "שניים-שלושה צילומים של התהליך" },
      { role: "proof", est_duration_sec: 3, visual_idea_he: "פרט אחד שמראה איכות" },
      { role: "cta", est_duration_sec: 3, visual_idea_he: "שלחו הודעה" },
    ],
    sample_hook_he: "ככה זה נראה בסוף. עכשיו תראו איך",
    is_public: true,
    sort_order: 6,
  },
  {
    id: "tpl-launch-30",
    slug: "launch-30",
    name_he: "השקה, 30 שניות",
    description_he: "פתחתם סניף, מוצר או שירות חדש? מה חדש, למי זה מתאים, מתי ואיפה. עם תאריך אמיתי והנעה אחת.",
    niche_slug: null,
    video_type: "launch",
    goal: "awareness",
    structure: "aida",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "cinematic",
    visual_mix: "smart",
    caption_preset: "poster",
    music_mood: "inspiring",
    default_hook_type_slug: "curiosity-gap",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "דלת שנפתחת או קופסה שמוסרים ממנה כיסוי" },
      { role: "solution", est_duration_sec: 10, visual_idea_he: "מה חדש, בשלושה צילומים" },
      { role: "offer", est_duration_sec: 9, visual_idea_he: "הטבת פתיחה אמיתית, אם יש" },
      { role: "cta", est_duration_sec: 8, visual_idea_he: "תאריך, כתובת וכפתור וואטסאפ" },
    ],
    sample_hook_he: "משהו חדש נפתח ביום חמישי. ואתם הראשונים לדעת",
    is_public: true,
    sort_order: 7,
  },
  {
    id: "tpl-recruiting-30",
    slug: "recruiting-30",
    name_he: "גיוס עובדים, 30 שניות",
    description_he: "איך נראה יום עבודה אצלכם, מה מקבלים ולמי זה מתאים. מושך מועמדים ונותן להם לפנות בהודעה אחת.",
    niche_slug: "restaurants",
    video_type: "recruiting",
    goal: "leads",
    structure: "hpspc",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "day_in_business",
    visual_mix: "smart",
    caption_preset: "karaoke",
    music_mood: "energetic",
    default_hook_type_slug: "callout",
    beat_plan: [
      { role: "hook", est_duration_sec: 3, visual_idea_he: "הצוות באמצע משמרת, מחייך" },
      { role: "problem", est_duration_sec: 5, visual_idea_he: "מה מעייף בעבודות אחרות" },
      { role: "solution", est_duration_sec: 10, visual_idea_he: "מה שונה אצלכם: שעות, אווירה, צוות" },
      { role: "offer", est_duration_sec: 6, visual_idea_he: "מה מקבלים, רק דברים אמיתיים" },
      { role: "cta", est_duration_sec: 6, visual_idea_he: "שלחו הודעה עם שם וזמינות" },
    ],
    sample_hook_he: "מחפשים מלצרים שאוהבים אנשים. לא רק טיפים",
    is_public: true,
    sort_order: 8,
  },
  {
    id: "tpl-testimonial-30",
    slug: "testimonial-30",
    name_he: "המלצה של לקוח אמיתי, 30 שניות",
    description_he: "ציטוט אמיתי של לקוח, באישור שלו, עם התוצאה שהוא קיבל. אנחנו לא ממציאים המלצות ולא יוצרים לקוחות ב-AI.",
    niche_slug: null,
    video_type: "testimonial",
    goal: "trust",
    structure: "result_first",
    duration_sec: 30,
    aspect_ratio: "9:16",
    visual_style: "ugc",
    visual_mix: "images",
    caption_preset: "soft",
    music_mood: "warm",
    default_hook_type_slug: "social-proof",
    beat_plan: [
      { role: "hook", est_duration_sec: 4, visual_idea_he: "המשפט החזק מהמלצה, על המסך" },
      { role: "story", est_duration_sec: 10, visual_idea_he: "מה הלקוח חיפש, במילים שלו" },
      { role: "proof", est_duration_sec: 10, visual_idea_he: "התוצאה, מצילומים אמיתיים" },
      { role: "cta", est_duration_sec: 6, visual_idea_he: "רוצים גם? שלחו הודעה" },
    ],
    sample_hook_he: "ההמלצה של לקוח אמיתי, במשפט אחד",
    is_public: true,
    sort_order: 9,
  },
  {
    id: "tpl-quick-tips-45",
    slug: "quick-tips-45",
    name_he: "3 טיפים מקצועיים, 45 שניות",
    description_he: "שלושה טיפים שהלקוחות שלכם צריכים, אחד אחרי השני, ובסוף הזמנה לשאול. בונה סמכות ונשמר בפרופיל.",
    niche_slug: null,
    video_type: "explainer",
    goal: "engagement",
    structure: "hpspc",
    duration_sec: 45,
    aspect_ratio: "9:16",
    visual_style: "text_motion",
    visual_mix: "smart",
    caption_preset: "clean-box",
    music_mood: "calm",
    default_hook_type_slug: "listicle",
    beat_plan: [
      { role: "hook", est_duration_sec: 4, visual_idea_he: "הבטחה: 3 דברים לבדוק לפני…" },
      { role: "solution", est_duration_sec: 12, visual_idea_he: "טיפ 1 עם מספר גדול על המסך" },
      { role: "solution", est_duration_sec: 12, visual_idea_he: "טיפ 2" },
      { role: "solution", est_duration_sec: 11, visual_idea_he: "טיפ 3" },
      { role: "cta", est_duration_sec: 6, visual_idea_he: "שמרו את הסרטון ושאלו אותנו" },
    ],
    sample_hook_he: "3 דברים לבדוק לפני שחותמים",
    is_public: true,
    sort_order: 10,
  },
];

export const publicTemplates = () => TEMPLATES.filter((t) => t.is_public).sort((a, b) => a.sort_order - b.sort_order);
export const getTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug);
export const getDemoExample = (slug: string) => DEMO_EXAMPLES.find((e) => e.slug === slug);
