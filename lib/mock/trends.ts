/**
 * Mock of the 12 seed trend templates (spec 07–08 §J.9). Field names follow `TrendTemplateV1` (§J.4) and
 * the `trend_templates` columns of `0014_trends.sql` (§D.2). Until the database and Part 08's
 * `supabase/seed/data/trend_templates.json` exist, the public `/trends` pages read this file.
 *
 * Rules carried by the data (§J.10): we copy the FORMAT, never the expression of a reference video —
 * no reference footage, creator, sign text, caption or music is reproduced here (`do_not_copy`).
 * `source_reference_id` is internal and is never exposed, so it is not part of this public mock.
 */
import type { HookGoal } from "@/lib/labels";

export type TrendLifecycle = "moment" | "format" | "evergreen";
export type TrendProductionMode = "ai" | "guided" | "hybrid";
export type TrendAdSafety = "ad_safe" | "organic_only" | "needs_consent" | "needs_ai_label";
export type TrendBeatRole = "bait" | "cut" | "payoff" | "reveal" | "cta" | "label";
export type TrendVisualSource = "ai_clip" | "ai_image_kenburns" | "user_media" | "brand_card";
export type TrendOverlayKind =
  | "sign"
  | "fake_ui"
  | "meme_caption"
  | "bts_label"
  | "split_reveal"
  | "comment_bubble"
  | "rating"
  | "pov_label"
  | "clock"
  | "sticker"
  | "price";
export type AdGoal = "whatsapp_messages" | "lead_form" | "website_traffic" | "local_awareness";
export type TrendTemplateStatus = "draft" | "review" | "scheduled" | "published" | "retired";

export interface TrendRecipeBeatV1 {
  key: string;
  role: TrendBeatRole;
  /** 500–8000; a "cut" is a transition marker (0); a "label" is a persistent overlay over a range of beats. */
  duration_ms: number;
  visual_source: TrendVisualSource;
  /** No text in frames; `{subject_en}`, `{setting_en}`, `{product_en}` come from the niche adaptation. */
  visual_prompt_en: string;
  motion_prompt_en: string;
  camera: "static" | "handheld" | "push_in" | "pull_out" | "whip_pan" | "orbit" | "top_down" | "pov";
  transition_in: "cut" | "snap" | "hand_cover" | "whip" | "match_cut" | "fade" | "none";
  sfx: string | null;
  onscreen_slot?: { key: string; max_chars: number; example_he: string };
  vo_slot?: { key: string; max_words: number };
  overlay?: { kind: TrendOverlayKind; text_he?: string } | null;
  guided_shot_key?: string;
  /** Public explainer text for this beat (Hebrew, abstract — never the reference). */
  description_he: string;
}

export interface TrendRecipeV1 {
  beats: TrendRecipeBeatV1[];
}

export interface TrendHookVariantV1 {
  key: "A" | "B" | "C";
  bait_concept_en: string;
  hook_line_he_pattern: string;
  why_he: string;
}

export interface TrendNicheAdaptationV1 {
  niche_slug: string;
  subject_en: string;
  setting_en: string;
  product_en?: string;
  onscreen_examples_he: Record<string, string>;
  vo_example_he?: string;
  cta_type: "WHATSAPP_MESSAGE" | "SIGN_UP" | "GET_QUOTE" | "BOOK_NOW" | "LEARN_MORE" | "SHOP_NOW" | "CALL_NOW";
  notes_he?: string;
}

export interface MusicBriefV1 {
  mood: "energetic" | "warm" | "luxury" | "funny" | "calm" | "inspiring" | "urban";
  bpm_min: number;
  bpm_max: number;
  drop_at_ms?: number;
  energy_curve: "flat" | "build" | "drop" | "loop";
  sfx_cues: { beat_key: string; kind: string }[];
}

export interface GuidedShotV1 {
  key: string;
  title_he: string;
  instruction_he: string;
  framing: "wide" | "medium" | "closeup" | "pov";
  min_sec: number;
  max_sec: number;
  ghost: "tripod_wide" | "hands_table" | "face_center" | "product_center" | "cover_lens";
  tips_he: string[];
  people_on_camera: boolean;
}

export interface GuidedShotListV1 {
  shots: GuidedShotV1[];
}

/** Public "פירוק טרנד" explainer (`TrendExplainerV1`, drafted by `trends.explainer.v1`, edited by an admin). */
export interface TrendExplainerV1 {
  first_seconds_he: { t_ms: number; text_he: string }[];
  why_it_works_he: string[];
  how_to_he: { title_he: string; body_he: string }[];
  faq_he: { q_he: string; a_he: string }[];
}

export interface TrendTemplateV1 {
  slug: string;
  name_he: string;
  tagline_he: string;
  description_he: string;
  why_it_works_he: string;
  hook_type_slug: string;
  lifecycle: TrendLifecycle;
  production_mode: TrendProductionMode;
  ad_safety: TrendAdSafety;
  extra_gates: TrendAdSafety[];
  requires_real_footage: boolean;
  requires_people_consent: boolean;
  recipe: TrendRecipeV1;
  hook_variants: TrendHookVariantV1[];
  niche_adaptations: TrendNicheAdaptationV1[];
  music_brief: MusicBriefV1;
  required_overlays: TrendOverlayKind[];
  shot_list: GuidedShotListV1 | null;
  compliance_notes_he: string[];
  do_not_copy: string[];
  platform_tone: { reels?: string; tiktok?: string };
  default_duration_sec: 15 | 30 | 45 | 60;
  default_goal: HookGoal;
  default_video_type: "reel_hook" | "brand_promo" | "offer" | "explainer";
  default_visual_style: string;
  default_music_mood: MusicBriefV1["mood"];
  default_caption_preset: "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";
  vo_mode: "none" | "optional" | "required";
  recommended_ad_goal: AdGoal | null;
  niches: string[];
  status: TrendTemplateStatus;
  explainer: TrendExplainerV1;
  seo_title_he: string;
  seo_description_he: string;
  is_featured: boolean;
  sort_order: number;
  /**
   * Mock only: the lifecycle stage the feed would compute at runtime from `published_week`,
   * `peak_expected_at` and `expires_at` (`TrendLifecycleBadge`). Evergreen templates are always "classic".
   */
  mock_stage: "new" | "peak" | "fading" | "classic";
}

const MUSIC_NOTE = "בטרנד המקורי יש שיר מוגן. אצלנו נוצרת מוזיקה מקורית שמותרת לפרסום.";

const COMMON_FAQ = [
  {
    q_he: "מותר להשתמש בטרנד הזה במודעה?",
    a_he: `זה תלוי בתווית של הטרנד. "מתאים למודעה" אומר שאפשר להעלות אותו כקמפיין. "רק לפרסום רגיל" אומר שמטא לא מאשרת אותו כמודעה, ולכן בונה הקמפיינים חוסם אותו ומסביר למה.`,
  },
  {
    q_he: "מה עם המוזיקה?",
    a_he: MUSIC_NOTE + " אנחנו לא משתמשים בשירים מהרשת, כי אסור להשתמש בהם במודעות.",
  },
];

export const TREND_TEMPLATES: TrendTemplateV1[] = [
  // ---------- T1 ----------
  {
    slug: "bait-and-sign",
    name_he: "פיתיון ושלט",
    tagline_he: "שתי שניות של דרמה, ואז שלט בכתב יד עם המסר שלכם",
    description_he:
      "הסרטון נפתח ברגע דרמטי שלא קשור לעסק בכלל. חיתוך חד, ועל המסך מופיע אדם רציני לגמרי שמחזיק דף עם משפט אחד בכתב יד. ההפתעה היא הבדיחה, והשלט הוא ההנעה לפעולה.",
    why_it_works_he:
      "הפתיחה עוצרת את הגלילה כי לא ברור מה עומד לקרות. החיתוך לשלט שובר את הציפייה ומצחיק, והשלט עצמו הוא גם הפאנץ׳ וגם ההנעה לפעולה. הסרטון קצר, ולכן רואים אותו פעמיים.",
    hook_type_slug: "pattern-interrupt",
    lifecycle: "format",
    production_mode: "ai",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        {
          key: "bait",
          role: "bait",
          duration_ms: 2500,
          visual_source: "ai_clip",
          visual_prompt_en: "dramatic near-fail moment unrelated to the business, {setting_en}, nobody gets hurt, no text",
          motion_prompt_en: "fast build-up, freeze right before the outcome",
          camera: "handheld",
          transition_in: "none",
          sfx: "whoosh",
          description_he: "רגע דרמטי של כמעט: משהו עומד להשתבש, ואף אחד לא נפגע. נוצר ב-AI, בלי קשר לעסק.",
        },
        {
          key: "cut",
          role: "cut",
          duration_ms: 0,
          visual_source: "ai_image_kenburns",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "cut",
          sfx: "record-scratch",
          description_he: "חיתוך חד, בלי מעבר. השקט אחרי הרעש הוא חלק מהבדיחה.",
        },
        {
          key: "sign",
          role: "payoff",
          duration_ms: 4500,
          visual_source: "ai_image_kenburns",
          visual_prompt_en: "deadpan {subject_en} against a plain wall holding a blank white sheet, flat light, no text",
          motion_prompt_en: "very slow push in",
          camera: "static",
          transition_in: "cut",
          sfx: null,
          onscreen_slot: { key: "sign_text", max_chars: 40, example_he: "בואו לאכול אצלנו. אנחנו בחולון" },
          overlay: { kind: "sign" },
          description_he: "אדם עם פרצוף רציני מחזיק דף ריק. אנחנו כותבים עליו את המשפט שלכם בכתב יד עברי.",
        },
        {
          key: "cta",
          role: "cta",
          duration_ms: 3000,
          visual_source: "brand_card",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "fade",
          sfx: null,
          overlay: { kind: "sticker", text_he: "❤️" },
          description_he: "כרטיס סיום עם הלוגו וכפתור וואטסאפ.",
        },
      ],
    },
    hook_variants: [
      {
        key: "A",
        bait_concept_en: "sports near-fail: an athlete misjudges a jump and lands safely on a mat",
        hook_line_he_pattern: "{פעולה} אצלנו. זה פחות {תחושה} מזה",
        why_he: "רגע ספורטיבי שכולם מבינים בלי מילים.",
      },
      {
        key: "B",
        bait_concept_en: "a giant domino line about to fall, the last piece wobbles",
        hook_line_he_pattern: "בואו ל{מקום}. אנחנו ב{עיר}",
        why_he: "מתח איטי שמחזיק את העין עד החיתוך.",
      },
      {
        key: "C",
        bait_concept_en: "a glass being poured to the very brim, a drop hangs on the edge",
        hook_line_he_pattern: "{שאלה קצרה}? אני מכיר כמה",
        why_he: `רגע "מספק" שעוצר את הגלילה גם בלי סאונד.`,
      },
    ],
    niche_adaptations: [
      { niche_slug: "restaurants", subject_en: "chef in an apron", setting_en: "a busy kitchen", onscreen_examples_he: { sign_text: "בואו לאכול אצלנו. אנחנו בחולון" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "fitness-trainers", subject_en: "trainer in sportswear", setting_en: "a gym", onscreen_examples_he: { sign_text: "תתחילו להתאמן. זה פחות כואב מזה" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "dentists", subject_en: "person in a white coat", setting_en: "a bright clinic corridor", onscreen_examples_he: { sign_text: "בואו לבדיקה לפני שזה קורה לשיניים" }, cta_type: "BOOK_NOW" },
      { niche_slug: "real-estate", subject_en: "agent in a blazer", setting_en: "an empty apartment", onscreen_examples_he: { sign_text: "מחפשים דירה? אני מכיר כמה" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "funny", bpm_min: 110, bpm_max: 128, drop_at_ms: 2500, energy_curve: "drop", sfx_cues: [{ beat_key: "cut", kind: "record-scratch" }] },
    required_overlays: ["sign", "sticker"],
    shot_list: null,
    compliance_notes_he: [
      "בלי פציעות אמיתיות ובלי רגעים מסוכנים באמת: מטא מגבילה תוכן מזעזע במודעות.",
      "האדם עם השלט נוצר ב-AI, או שזה בעל העסק עצמו, עם הסכמה מתועדת.",
    ],
    do_not_copy: ["the reference's sign text and language", "the reference creator, face, outfit or pose", "the reference's sports footage", "the reference's music"],
    platform_tone: { reels: "דדפאן יבש, בלי צחוק", tiktok: "אפשר להגזים בפוזה בסוף" },
    default_duration_sec: 15,
    default_goal: "awareness",
    default_video_type: "reel_hook",
    default_visual_style: "cinematic",
    default_music_mood: "funny",
    default_caption_preset: "bold-pop",
    vo_mode: "none",
    recommended_ad_goal: "whatsapp_messages",
    niches: ["restaurants", "fitness-trainers", "dentists", "real-estate"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "רגע דרמטי מתחיל מיד, בלי הקדמה ובלי לוגו" },
        { t_ms: 1200, text_he: "הצופה מחכה לראות אם זה ייגמר רע" },
        { t_ms: 2500, text_he: "חיתוך חד: קיר ריק, אדם רציני ושלט בכתב יד" },
        { t_ms: 3000, text_he: "המשפט שלכם כבר על המסך, ונשאר שם עד הסוף" },
      ],
      why_it_works_he: [
        "שבירת דפוס: הפתיחה לא קשורה לעסק, ולכן אי אפשר לנחש מה יבוא.",
        "הניגוד בין הדרמה לפרצוף הרציני יוצר צחוק, ואנשים שולחים את זה הלאה.",
        "השלט הוא ההנעה לפעולה, כך שהמסר לא מרגיש כמו פרסומת.",
        "הסרטון קצר ונגמר מהר, ולכן הרבה צופים רואים אותו שוב.",
      ],
      how_to_he: [
        { title_he: "בוחרים רגע פתיחה", body_he: "יש שלוש גרסאות שונות של רגע הפתיחה. כל אחת נוצרת ב-AI, בלי אנשים אמיתיים ובלי פציעות." },
        { title_he: "כותבים משפט אחד לשלט", body_he: "עד 40 תווים. מה שהייתם אומרים ללקוח בדלת: איפה אתם, ומה כדאי לעשות עכשיו." },
        { title_he: "המערכת כותבת את השלט", body_he: "המשפט מורכב על הדף בכתב יד עברי, כך שכל אות יוצאת נכונה." },
        { title_he: "מוסיפים סיום עם וואטסאפ", body_he: "כרטיס סיום עם הלוגו ועם כפתור שליחת הודעה, ומוזיקה מקורית שמותרת לפרסום." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "פיתיון ושלט: טרנד רילס לעסקים, ואיך עושים אותו בעברית",
    seo_description_he: `פירוק הטרנד "פיתיון ושלט": מה קורה בשלוש השניות הראשונות, למה זה עובד, ואיך עושים סרטון כזה לעסק שלכם בלחיצה, עם מוזיקה שמותרת לפרסום.`,
    is_featured: true,
    sort_order: 1,
    mock_stage: "new",
  },

  // ---------- T2 ----------
  {
    slug: "behind-the-viral",
    name_he: "מאחורי הקלעים",
    tagline_he: "מראים את הבלגן של הצילומים, והצופים נשארים לראות מה יצא",
    description_he:
      `צילום רחב וקבוע של הצוות באמצע הכנה לצילום מטורף, עם התווית "מאחורי הקלעים" למעלה. לא מסבירים כלום בהתחלה: הבלגן עצמו הוא ההוק, ובסוף מגלים את התוצאה.`,
    why_it_works_he:
      "הצופה לא מבין מה קורה, והסקרנות מחזיקה אותו עד הסוף. רואים אנשים אמיתיים מהעסק, וזה בונה אמון. ומי שאהב את התוצאה, חוזר לראות איך עשו אותה.",
    hook_type_slug: "behind-the-scenes",
    lifecycle: "format",
    production_mode: "guided",
    ad_safety: "needs_consent",
    extra_gates: [],
    requires_real_footage: true,
    requires_people_consent: true,
    recipe: {
      beats: [
        {
          key: "label",
          role: "label",
          duration_ms: 24000,
          visual_source: "user_media",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "none",
          sfx: null,
          overlay: { kind: "bts_label", text_he: "מאחורי הקלעים" },
          description_he: `התווית "מאחורי הקלעים" נשארת למעלה לאורך כל הסרטון.`,
        },
        {
          key: "chaos",
          role: "bait",
          duration_ms: 12000,
          visual_source: "user_media",
          visual_prompt_en: "",
          motion_prompt_en: "slight speed ramp",
          camera: "static",
          transition_in: "none",
          sfx: null,
          guided_shot_key: "wide",
          onscreen_slot: { key: "chaos_line", max_chars: 50, example_he: "מה עשינו עם 5 מלצרים ונייר A4?" },
          description_he: "צילום רחב מחצובה: הצוות באמצע הכנה שנראית לא הגיונית. בלי הסבר.",
        },
        {
          key: "result",
          role: "reveal",
          duration_ms: 9000,
          visual_source: "user_media",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "match_cut",
          sfx: "pop",
          guided_shot_key: "result",
          description_he: "חיתוך לתוצאה: הצילום המוגמר, או המנה, או הלקוח המרוצה.",
        },
        {
          key: "cta",
          role: "cta",
          duration_ms: 3000,
          visual_source: "brand_card",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "fade",
          sfx: null,
          description_he: `כרטיס סיום: "רוצים לראות את התוצאה המלאה? שלחו הודעה".`
        },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the whole team frozen in an absurd arrangement around the counter", hook_line_he_pattern: "מאחורי הקלעים של {הסרטון הכי מטורף שצילמנו}", why_he: "הסידור המוזר הוא ההוק, גם בלי סאונד." },
      { key: "B", bait_concept_en: "someone covers the lens with a sheet of paper, then pulls it away", hook_line_he_pattern: "מה עשינו עם {מספר} {אנשים} ו{חפץ}?", why_he: "הצופה רוצה לדעת למה מכסים את המצלמה." },
      { key: "C", bait_concept_en: "a whispered countdown before a take, everyone in position", hook_line_he_pattern: "טייק {מספר}. הפעם זה חייב לעבוד", why_he: `ספירה לאחור יוצרת מתח של "עוד רגע".` },
    ],
    niche_adaptations: [
      { niche_slug: "restaurants", subject_en: "kitchen and floor staff", setting_en: "the restaurant bar", onscreen_examples_he: { chaos_line: "מאחורי הקלעים של הסרטון הכי מטורף שצילמנו במסעדה" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "event-photographers", subject_en: "photographer and assistant", setting_en: "a photo studio", onscreen_examples_he: { chaos_line: "ככה נראה יום צילומים אצלנו בסטודיו" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "beauty-nails", subject_en: "nail technicians", setting_en: "a nail studio", onscreen_examples_he: { chaos_line: "ככה צילמנו את הסרטון שכולן שאלו עליו" }, cta_type: "BOOK_NOW" },
      { niche_slug: "catering-chefs", subject_en: "a private chef and helpers", setting_en: "an event kitchen", onscreen_examples_he: { chaos_line: "מה עשינו עם 5 מלצרים ונייר A4?" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "energetic", bpm_min: 100, bpm_max: 120, energy_curve: "build", sfx_cues: [{ beat_key: "result", kind: "pop" }] },
    required_overlays: ["bts_label"],
    shot_list: {
      shots: [
        { key: "wide", title_he: "צילום רחב של כל הצוות", instruction_he: "שימו את הטלפון על חצובה, וצלמו את כל הצוות מזווית רחבה, בלי להזיז את הטלפון.", framing: "wide", min_sec: 8, max_sec: 20, ghost: "tripod_wide", tips_he: ["תאורה מהחלון או מהתקרה, לא מאחורי האנשים", "אל תסבירו כלום מול המצלמה"], people_on_camera: true },
        { key: "detail", title_he: "תקריב על הידיים", instruction_he: "תקריב קצר על הידיים בזמן ההכנה, מגובה השולחן.", framing: "closeup", min_sec: 3, max_sec: 6, ghost: "hands_table", tips_he: ["שתי שניות בלי תנועה לפני ואחרי"], people_on_camera: false },
        { key: "result", title_he: "התוצאה", instruction_he: "צלמו את התוצאה המוגמרת במרכז הפריים, ממש קרוב.", framing: "medium", min_sec: 3, max_sec: 8, ghost: "product_center", tips_he: ["אותה תאורה כמו בצילום הרחב"], people_on_camera: false },
      ],
    },
    compliance_notes_he: [
      "כל מי שמופיע בצילום צריך לתת הסכמה לפני הפרסום, ובונה הקמפיינים מבקש אישור על זה.",
      "זה צילום אמיתי של העסק. לא מייצרים אנשים ב-AI כדי שייראו כמו הצוות.",
    ],
    do_not_copy: ["the reference's staff, venue and plates trick footage", "the reference's caption wording", "the reference's music"],
    platform_tone: { reels: "חם ואמיתי", tiktok: "אפשר יותר כאוס" },
    default_duration_sec: 30,
    default_goal: "trust",
    default_video_type: "reel_hook",
    default_visual_style: "day_in_business",
    default_music_mood: "energetic",
    default_caption_preset: "bold-pop",
    vo_mode: "optional",
    recommended_ad_goal: "local_awareness",
    niches: ["restaurants", "event-photographers", "beauty-nails", "catering-chefs"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: `צילום רחב וקבוע, והתווית "מאחורי הקלעים" כבר למעלה` },
        { t_ms: 1000, text_he: "הצוות עושה משהו שלא ברור למה" },
        { t_ms: 2000, text_he: "אף אחד לא מסביר, והצופה מתחיל לנחש" },
        { t_ms: 3000, text_he: "הסקרנות מחזיקה אותו עד שהתוצאה מתגלה" },
      ],
      why_it_works_he: [
        "פער סקרנות: הצופה רואה את האמצע ורוצה לדעת מה יצא בסוף.",
        "אנשים אמיתיים מהעסק בונים אמון יותר מכל סרטון מלוטש.",
        "הסרטון מחזיר צפיות גם לסרטון התוצאה עצמו.",
      ],
      how_to_he: [
        { title_he: "מקבלים רשימת צילומים", body_he: "שלושה צילומים קצרים, עם הסבר בעברית ומסגרת עזר על המסך של הטלפון." },
        { title_he: "מצלמים או מעלים", body_he: "מצלמים מהדפדפן או מעלים סרטונים מהטלפון. כל צילום לוקח פחות מדקה." },
        { title_he: "המערכת עורכת", body_he: "בוחרת את הטייק הטוב, חותכת, מוסיפה את התווית, כתוביות בעברית ומוזיקה מקורית." },
        { title_he: "מאשרים הסכמה ומפרסמים", body_he: "מסמנים שכל מי שמופיע הסכים, ומפרסמים כרילס או מעלים לקמפיין." },
      ],
      faq_he: [
        { q_he: "חייבים לצלם בעצמנו?", a_he: "כן. הטרנד הזה עובד רק עם צילום אמיתי של העסק והצוות. אנחנו נותנים רשימת צילומים ועורכים בשבילכם." },
        ...COMMON_FAQ,
      ],
    },
    seo_title_he: "מאחורי הקלעים: טרנד רילס לעסקים עם צילום של הצוות",
    seo_description_he: `איך עושים סרטון "מאחורי הקלעים" שמחזיק צופים עד הסוף: מה קורה בשלוש השניות הראשונות, רשימת צילומים לטלפון, ועריכה אוטומטית בעברית.`,
    is_featured: true,
    sort_order: 2,
    mock_stage: "peak",
  },

  // ---------- T3 ----------
  {
    slug: "almost-got-me-reveal",
    name_he: "כמעט נפגעתי",
    tagline_he: "רגע של כמעט, מנקודת המבט של הצופה, ואז המוצר שלכם יוצא מהקופסה",
    description_he:
      "הסרטון נפתח מנקודת מבט של הצופה: משהו ענק עף לכיוון המצלמה ונעצר ברגע האחרון. חיתוך, קופסה נוחתת, ומתוכה יוצא המוצר שלכם. שורת מם בעברית למעלה סוגרת את הבדיחה.",
    why_it_works_he:
      `כמעט-פגיעה מנקודת מבט ראשונה מפעילה תגובת "וואו" אינסטינקטיבית. הפיזיקה הבלתי אפשרית גורמת לצפות שוב ולשאול בתגובות אם זה אמיתי, והקופסה הופכת את המחזה למוצר.`,
    hook_type_slug: "pattern-interrupt",
    lifecycle: "format",
    production_mode: "ai",
    ad_safety: "needs_ai_label",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        {
          key: "near_miss",
          role: "bait",
          duration_ms: 2500,
          visual_source: "ai_clip",
          visual_prompt_en: "first-person view, an absurd tower of {product_en} boxes flies toward the camera and stops inches away, impossible physics, no people hurt, no text",
          motion_prompt_en: "rapid approach, sudden stop, slight camera shake",
          camera: "pov",
          transition_in: "none",
          sfx: "impact",
          overlay: { kind: "meme_caption", text_he: "המשאית כמעט תפסה אותי 💀" },
          onscreen_slot: { key: "meme_line", max_chars: 40, example_he: "המשאית כמעט תפסה אותי 💀" },
          description_he: "נקודת מבט ראשונה: משהו ענק עף למצלמה ונעצר בדיוק בזמן. נוצר ב-AI, ואף אחד לא נפגע.",
        },
        {
          key: "cut",
          role: "cut",
          duration_ms: 0,
          visual_source: "ai_clip",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "cut",
          sfx: "thud",
          description_he: "חיתוך חד, וקופסה אחת נוחתת לפני המצלמה.",
        },
        {
          key: "reveal",
          role: "reveal",
          duration_ms: 5500,
          visual_source: "user_media",
          visual_prompt_en: "hands open a cardboard box on a table and lift {product_en} toward the camera, warm light, no text",
          motion_prompt_en: "slow lift, slight push in",
          camera: "push_in",
          transition_in: "cut",
          sfx: "unbox",
          description_he: "פותחים את הקופסה, והמוצר שלכם יוצא ממנה. מהתמונה או מהסרטון שלכם, או ב-AI.",
        },
        {
          key: "cta",
          role: "cta",
          duration_ms: 3000,
          visual_source: "brand_card",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "fade",
          sfx: null,
          description_he: `כרטיס סיום: "הזמינו בוואטסאפ" או "הזמינו באתר".`
        },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "boxes from an overloaded truck fly at a footbridge viewer", hook_line_he_pattern: "{הרכב} כמעט תפס אותי 💀", why_he: "התמונה הכי חזקה: הכול מתקרב למצלמה." },
      { key: "B", bait_concept_en: "a wobbling tower of boxes leans over the viewer in a warehouse", hook_line_he_pattern: "רגע לפני ש{משהו} נפל עליי", why_he: "מתח של שנייה וחצי בלי תנועה מהירה." },
      { key: "C", bait_concept_en: "a parcel drops from the sky and lands right at the viewer's feet", hook_line_he_pattern: "ההזמנה הגיעה מהר מדי", why_he: "הומור עדין שמתאים גם לפיד." },
    ],
    niche_adaptations: [
      { niche_slug: "ecommerce", subject_en: "shopper", setting_en: "a city footbridge", product_en: "the store's product", onscreen_examples_he: { meme_line: "המשאית כמעט תפסה אותי 💀" }, cta_type: "SHOP_NOW" },
      { niche_slug: "movers-storage", subject_en: "mover", setting_en: "a street outside a building", product_en: "moving boxes landing safely", onscreen_examples_he: { meme_line: "המשאית שלנו לא מאבדת אף ארגז" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "restaurants", subject_en: "hungry customer", setting_en: "a street at night", product_en: "a hot pizza", onscreen_examples_he: { meme_line: "קופסאות הפיצה כמעט תפסו אותי 💀" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "retail-stores", subject_en: "passer-by", setting_en: "a flower market", product_en: "a fresh bouquet", onscreen_examples_he: { meme_line: "זר כמעט עף לי לפנים 💐" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "urban", bpm_min: 120, bpm_max: 140, drop_at_ms: 2500, energy_curve: "drop", sfx_cues: [{ beat_key: "near_miss", kind: "impact" }, { beat_key: "reveal", kind: "unbox" }] },
    required_overlays: ["meme_caption"],
    shot_list: null,
    compliance_notes_he: [
      `סכנה מציאותית שנוצרה ב-AI עלולה להטעות. על המסך מופיעה תווית קטנה "צולם ב-AI", ובמודעה נוספת תווית AI.`,
      "אף פעם לא מראים אנשים שנפגעים, ואף פעם לא רכב או מקום אמיתי שאפשר לזהות.",
    ],
    do_not_copy: ["the reference's brand, product and hoodie print", "the reference's caption and emoji sequence", "the reference creator and follow card", "the reference's music"],
    platform_tone: { reels: "מם קליל", tiktok: "מם קליל" },
    default_duration_sec: 15,
    default_goal: "sales",
    default_video_type: "reel_hook",
    default_visual_style: "product",
    default_music_mood: "urban",
    default_caption_preset: "poster",
    vo_mode: "none",
    recommended_ad_goal: "website_traffic",
    niches: ["ecommerce", "movers-storage", "restaurants", "retail-stores"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "נקודת מבט ראשונה: משהו ענק מתקרב למצלמה" },
        { t_ms: 1500, text_he: "הוא נעצר ממש לפני הפנים, ושורת המם מופיעה למעלה" },
        { t_ms: 2500, text_he: "חיתוך: קופסה נוחתת על השולחן" },
        { t_ms: 3000, text_he: "הידיים פותחות אותה, והמוצר שלכם יוצא" },
      ],
      why_it_works_he: [
        "כמעט-פגיעה מנקודת מבט ראשונה היא שבירת דפוס חזקה: הגוף מגיב לפני שהמוח מבין.",
        `פיזיקה בלתי אפשרית גורמת לצפות שוב ולכתוב בתגובות "זה אמיתי?".`,
        "הקופסה מחברת את המחזה למוצר, כך שהצפייה החוזרת היא צפייה במוצר.",
      ],
      how_to_he: [
        { title_he: "בוחרים את רגע הכמעט", body_he: "שלוש גרסאות: ארגזים שעפים, מגדל שמתנדנד או חבילה שנוחתת. הכול נוצר ב-AI." },
        { title_he: "מעלים את המוצר", body_he: "תמונה או סרטון קצר של המוצר שלכם. בלי תמונה, המערכת יוצרת סצנת פתיחת קופסה." },
        { title_he: "כותבים את שורת המם", body_he: "עד 40 תווים, בעברית מדוברת. המערכת מציעה שלוש שורות לפי הנישה." },
        { title_he: "תווית AI ופרסום", body_he: `התווית "צולם ב-AI" מתווספת אוטומטית, והסרטון מוכן לרילס או לקמפיין.` },
      ],
      faq_he: [
        { q_he: "למה צריך תווית AI?", a_he: "כי הסצנה נראית מציאותית ומראה סכנה. מטא מבקשת לסמן תוכן כזה, וגם הצופים מגיעים בלי להרגיש שעבדו עליהם." },
        ...COMMON_FAQ,
      ],
    },
    seo_title_he: "כמעט נפגעתי: טרנד POV עם חשיפת מוצר, ואיך עושים אותו לעסק",
    seo_description_he: `פירוק הטרנד "כמעט נפגעתי": רגע כמעט מנקודת מבט ראשונה, חיתוך וחשיפת המוצר מתוך קופסה. איך עושים את זה ב-AI, עם תווית AI ומוזיקה מותרת.`,
    is_featured: true,
    sort_order: 3,
    mock_stage: "peak",
  },

  // ---------- T4 ----------
  {
    slug: "fake-system-popup",
    name_he: "התראה מזויפת",
    tagline_he: "התראה שנראית כמו של הטלפון קופצת מעל האוכל. רק לפרסום רגיל",
    description_he:
      "נקודת מבט של סועד ליד שולחן: המנה מגיעה, ושנייה וחצי אחר כך קופצת מעליה התראה שנראית כמו של הטלפון. הצופים מנסים לסגור אותה, וממשיכים להסתכל על האוכל.",
    why_it_works_he:
      "ההתראה מפעילה רפלקס: עוצרים, מנסים ללחוץ, ורואים שוב. בזמן הזה העין נשארת על המנה. בגלל זה הטרנד חזק, ובגלל זה מטא לא מאשרת אותו כמודעה.",
    hook_type_slug: "pattern-interrupt",
    lifecycle: "format",
    production_mode: "hybrid",
    ad_safety: "organic_only",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        {
          key: "serve",
          role: "bait",
          duration_ms: 1500,
          visual_source: "user_media",
          visual_prompt_en: "first-person view at a wooden table, a tray of {product_en} is placed in front of the viewer, warm light, no text",
          motion_prompt_en: "tray slides into frame",
          camera: "pov",
          transition_in: "none",
          sfx: null,
          description_he: "נקודת מבט של סועד: המנה מונחת על השולחן. מהסרטון שלכם או ב-AI.",
        },
        {
          key: "popup",
          role: "label",
          duration_ms: 3000,
          visual_source: "user_media",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "none",
          sfx: "notification",
          onscreen_slot: { key: "popup_title", max_chars: 24, example_he: "סוללה חלשה" },
          overlay: { kind: "fake_ui", text_he: "סוללה חלשה · נותרו 10%" },
          description_he: "התראה כללית בסגנון טלפון קופצת מעל המנה. בלי לוגו של מערכת הפעלה, והכול בעברית.",
        },
        {
          key: "closeup",
          role: "payoff",
          duration_ms: 6000,
          visual_source: "user_media",
          visual_prompt_en: "extreme close-up of {product_en}, steam, slow motion, no text",
          motion_prompt_en: "slow orbit",
          camera: "orbit",
          transition_in: "cut",
          sfx: null,
          description_he: "תקריב על המנה. כאן כל הצפייה החוזרת מושקעת במוצר.",
        },
        {
          key: "cta",
          role: "cta",
          duration_ms: 3000,
          visual_source: "brand_card",
          visual_prompt_en: "",
          motion_prompt_en: "",
          camera: "static",
          transition_in: "fade",
          sfx: null,
          description_he: "כרטיס סיום עם הלוגו ושליחת הודעה בוואטסאפ.",
        },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "a low-battery style dialog appears over the food", hook_line_he_pattern: "סוללה חלשה · נותרו 10%", why_he: "ההתראה הכי מוכרת, ולכן הרפלקס הכי חזק." },
      { key: "B", bait_concept_en: "a new-message style banner from 'mom' slides over the dish", hook_line_he_pattern: `הודעה חדשה מאמא: "{שאלה}"`, why_he: "הומור משפחתי שכל ישראלי מכיר." },
      { key: "C", bait_concept_en: "a delivery-style 'your food has arrived' banner", hook_line_he_pattern: "האוכל שלך הגיע", why_he: "מתחבר ישר למשלוחים ולהזמנות." },
    ],
    niche_adaptations: [
      { niche_slug: "restaurants", subject_en: "diner", setting_en: "a wooden restaurant table", product_en: "fried chicken and fries", onscreen_examples_he: { popup_title: "סוללה חלשה" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "catering-chefs", subject_en: "guest", setting_en: "a festive dinner table", product_en: "a catering platter", onscreen_examples_he: { popup_title: "הודעה חדשה מאמא" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "ecommerce", subject_en: "shopper", setting_en: "a living-room coffee table", product_en: "an unboxed product", onscreen_examples_he: { popup_title: "החבילה שלך הגיעה" }, cta_type: "SHOP_NOW" },
    ],
    music_brief: { mood: "funny", bpm_min: 95, bpm_max: 115, energy_curve: "loop", sfx_cues: [{ beat_key: "popup", kind: "notification" }] },
    required_overlays: ["fake_ui"],
    shot_list: {
      shots: [
        { key: "pov", title_he: "נקודת מבט מהשולחן", instruction_he: "החזיקו את הטלפון בגובה העיניים מול השולחן, ותנו למישהו להניח את המנה.", framing: "pov", min_sec: 3, max_sec: 6, ghost: "hands_table", tips_he: ["יד אחת שלכם על השולחן נותנת תחושה של נקודת מבט"], people_on_camera: false },
        { key: "close", title_he: "תקריב על המנה", instruction_he: "תקריב איטי על המנה, עם אדים אם יש.", framing: "closeup", min_sec: 3, max_sec: 8, ghost: "product_center", tips_he: ["אור מהצד מבליט מרקם"], people_on_camera: false },
      ],
    },
    compliance_notes_he: [
      "מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים. לכן הטרנד הזה מתאים רק לפרסום רגיל, ובונה הקמפיינים חוסם אותו.",
      "ההתראה כללית לגמרי: בלי לוגו של אפל, גוגל או כל מערכת אחרת.",
      `דחיפות כמו "נשארו 2 מנות" מותרת רק כשזה באמת נכון.`,
    ],
    do_not_copy: ["the reference's restaurant, dish styling and tray", "any real operating-system dialog design or logo", "the reference's creator explainer and view counts"],
    platform_tone: { reels: "קליל", tiktok: "קליל" },
    default_duration_sec: 15,
    default_goal: "engagement",
    default_video_type: "reel_hook",
    default_visual_style: "product",
    default_music_mood: "funny",
    default_caption_preset: "bold-pop",
    vo_mode: "none",
    recommended_ad_goal: null,
    niches: ["restaurants", "catering-chefs", "ecommerce"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "נקודת מבט של סועד, יד על השולחן" },
        { t_ms: 800, text_he: "המנה מונחת מול המצלמה" },
        { t_ms: 1500, text_he: "התראה בסגנון טלפון קופצת מעל האוכל" },
        { t_ms: 3000, text_he: "הצופה מנסה לסגור אותה, והעין נשארת על המנה" },
      ],
      why_it_works_he: [
        "רפלקס: התראה על המסך גורמת לעצור ולנסות ללחוץ.",
        "האוכל נשאר במרכז, אז כל שנייה של צפייה היא שנייה מול המוצר.",
        "צופים חוזרים לסרטון כדי להבין מה קרה, וזה מאריך את זמן הצפייה.",
      ],
      how_to_he: [
        { title_he: "מצלמים מהשולחן או ב-AI", body_he: "שני צילומים קצרים מהטלפון, או סצנה שנוצרת ב-AI מהתפריט שלכם." },
        { title_he: "בוחרים התראה", body_he: "שלוש גרסאות: סוללה חלשה, הודעה מאמא, או האוכל שלך הגיע. הכול בעברית, בלי לוגו של מערכת." },
        { title_he: "המערכת מרכיבה", body_he: "ההתראה נכנסת בשנייה וחצי, עם צליל התראה ומוזיקה מקורית." },
        { title_he: "מפרסמים כרילס", body_he: "מפרסמים כפוסט רגיל באינסטגרם ובפייסבוק. כמודעה זה לא יעבור, ולכן האפשרות חסומה." },
      ],
      faq_he: [
        { q_he: "למה אי אפשר להעלות את זה לקמפיין?", a_he: "כללי הפרסום של מטא אוסרים מודעות שמחקות הודעות מערכת או כפתורים. כדי שלא תבזבזו זמן על מודעה שתידחה, בונה הקמפיינים חוסם את הטרנד הזה ומציע במקומו טרנד שמתאים למודעה." },
        ...COMMON_FAQ,
      ],
    },
    seo_title_he: "התראה מזויפת: טרנד רילס למסעדות, ולמה הוא רק לפרסום רגיל",
    seo_description_he: `פירוק הטרנד "התראה מזויפת": התראה בסגנון טלפון מעל המנה. למה זה עוצר את הגלילה, איך עושים את זה בעברית, ולמה אסור להעלות את זה כמודעה.`,
    is_featured: false,
    sort_order: 4,
    mock_stage: "new",
  },

  // ---------- E1 ----------
  {
    slug: "pov-deadpan",
    name_he: "POV",
    tagline_he: "שורת POV יבשה מעל רגע שכל לקוח מכיר",
    description_he:
      `שורה אחת על המסך, "POV:" ומשפט קצר, מעל סיטואציה יומיומית שהלקוחות שלכם מכירים מצוין. אחרי כמה שניות מגיע טוויסט, והסרטון נסגר בעסק שלכם.`,
    why_it_works_he:
      "הצופה מזהה את עצמו תוך שנייה, ולכן נשאר. הומור יבש ודוגרי עובד מצוין בעברית, וכל עסק יכול לכתוב שורת POV על הלקוחות שלו.",
    hook_type_slug: "pov",
    lifecycle: "evergreen",
    production_mode: "hybrid",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "line", role: "label", duration_ms: 9000, visual_source: "ai_image_kenburns", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "none", sfx: null, overlay: { kind: "pov_label" }, onscreen_slot: { key: "pov_line", max_chars: 45, example_he: `POV: הקבלן אמר "עוד שבוע"` }, description_he: `השורה "POV:" נשארת למעלה, עם משפט אחד על הסיטואציה.` },
        { key: "situation", role: "bait", duration_ms: 5000, visual_source: "ai_image_kenburns", visual_prompt_en: "relatable everyday moment with {subject_en} in {setting_en}, candid, no text", motion_prompt_en: "slow push in", camera: "push_in", transition_in: "none", sfx: null, description_he: "הסיטואציה המוכרת, בלי מילים מיותרות." },
        { key: "twist", role: "payoff", duration_ms: 4000, visual_source: "ai_clip", visual_prompt_en: "unexpected turn: {subject_en} solves it effortlessly, no text", motion_prompt_en: "quick reveal", camera: "handheld", transition_in: "cut", sfx: "ding", description_he: "הטוויסט: איך זה נראה אצלכם." },
        { key: "cta", role: "cta", duration_ms: 3000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: "כרטיס סיום עם הנעה לפעולה." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the customer's frustrating moment, shot candid", hook_line_he_pattern: "POV: {רגע מתסכל שכל לקוח מכיר}", why_he: "הזדהות מיידית." },
      { key: "B", bait_concept_en: "the business owner's inside view of a typical request", hook_line_he_pattern: "POV: אתם {בעל המקצוע} ומישהו מבקש {בקשה}", why_he: "מבט מבפנים שמעורר סקרנות." },
      { key: "C", bait_concept_en: "the moment of relief after the problem is solved", hook_line_he_pattern: "POV: סוף סוף מצאתם {מה שחיפשתם}", why_he: "סוף טוב כבר בפתיחה." },
    ],
    niche_adaptations: [
      { niche_slug: "renovation-contractors", subject_en: "a homeowner", setting_en: "a half-renovated kitchen", onscreen_examples_he: { pov_line: "POV: קבלן שבאמת מסיים בזמן" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "dentists", subject_en: "a patient", setting_en: "a calm dental clinic", onscreen_examples_he: { pov_line: "POV: אמרתם לרופא שאתם משתמשים בחוט דנטלי" }, cta_type: "BOOK_NOW" },
      { niche_slug: "restaurants", subject_en: "friends at a table", setting_en: "a lively restaurant", onscreen_examples_he: { pov_line: `POV: הזמנתם "רק משהו קטן"` }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "barbers-salons", subject_en: "a client in the chair", setting_en: "a barbershop", onscreen_examples_he: { pov_line: `POV: אמרתם "רק ליישר קצת"` }, cta_type: "BOOK_NOW" },
    ],
    music_brief: { mood: "funny", bpm_min: 90, bpm_max: 110, energy_curve: "flat", sfx_cues: [{ beat_key: "twist", kind: "ding" }] },
    required_overlays: ["pov_label"],
    shot_list: {
      shots: [
        { key: "situation", title_he: "הסיטואציה", instruction_he: "צלמו את הרגע המוכר כמו שהוא קורה אצלכם, בלי לשחק יותר מדי.", framing: "medium", min_sec: 3, max_sec: 6, ghost: "face_center", tips_he: ["הבעה יבשה עובדת יותר מצחוק"], people_on_camera: true },
        { key: "twist", title_he: "הטוויסט", instruction_he: "צילום קצר של הפתרון אצלכם: המנה, העבודה או התוצאה.", framing: "closeup", min_sec: 2, max_sec: 5, ghost: "product_center", tips_he: [], people_on_camera: false },
      ],
    },
    compliance_notes_he: ["הומור על הלקוחות, לא נגדם. בלי לצחוק על מראה, דת, עדה או מצב בריאותי.", "בצילום עם אנשים אמיתיים צריך את ההסכמה שלהם."],
    do_not_copy: ["any specific creator's POV line", "trending audio"],
    platform_tone: { reels: "יבש ודוגרי", tiktok: "יבש ודוגרי, יותר מהיר" },
    default_duration_sec: 15,
    default_goal: "engagement",
    default_video_type: "reel_hook",
    default_visual_style: "ugc",
    default_music_mood: "funny",
    default_caption_preset: "bold-pop",
    vo_mode: "optional",
    recommended_ad_goal: "whatsapp_messages",
    niches: ["renovation-contractors", "dentists", "restaurants", "barbers-salons"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: `השורה "POV:" על המסך כבר בפריים הראשון` },
        { t_ms: 800, text_he: "הסיטואציה המוכרת מתחילה, בלי הקדמה" },
        { t_ms: 2000, text_he: "הצופה מזהה את עצמו ומחייך" },
        { t_ms: 3000, text_he: "הוא נשאר כדי לראות איך זה נגמר" },
      ],
      why_it_works_he: [
        "הזדהות: הצופה רואה את עצמו בתוך הסרטון.",
        "הכותרת לבד יוצרת סקרנות, גם בלי סאונד.",
        "הומור ישראלי יבש מרגיש אמיתי ולא כמו פרסומת.",
      ],
      how_to_he: [
        { title_he: "בוחרים רגע מוכר", body_he: "המערכת מציעה רגעים מוכרים מהנישה שלכם, ואתם בוחרים את זה שהכי קורה אצלכם." },
        { title_he: "כותבים שורת POV", body_he: "משפט אחד, עד 45 תווים. דוגרי, בלי להסביר את הבדיחה." },
        { title_he: "מצלמים או יוצרים ב-AI", body_he: "שני צילומים קצרים מהטלפון, או סצנות שנוצרות ב-AI." },
        { title_he: "מוסיפים טוויסט וסיום", body_he: "הטוויסט מראה איך זה אצלכם, וכרטיס הסיום מזמין לשלוח הודעה." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "סרטון POV לעסקים: איך כותבים שורת POV שעוצרת גלילה",
    seo_description_he: "פירוק הפורמט POV: למה שורה אחת על המסך מחזיקה צופים, דוגמאות לפי נישה, ואיך עושים סרטון כזה בעברית בלחיצה.",
    is_featured: false,
    sort_order: 5,
    mock_stage: "classic",
  },

  // ---------- E2 ----------
  {
    slug: "before-after-snap",
    name_he: "לפני ואחרי",
    tagline_he: `פחות משנייה של "לפני", חיתוך בהקשת אצבע, ואז ה"אחרי"`
    ,
    description_he:
      `מראים את המצב לפני לפחות משנייה, ואז מעבר מהיר: הקשת אצבע, יד שמכסה את העדשה או החלקה. ה"אחרי" נחשף בדיוק על הקצב, ובסוף המחיר או ההנעה לפעולה.`,
    why_it_works_he:
      "המוח רוצה לראות את ההבדל, ולכן הצופה נשאר עד החשיפה. כשזו עבודה אמיתית שלכם, מאותה זווית, זו ההוכחה הכי חזקה שיש.",
    hook_type_slug: "before-after",
    lifecycle: "evergreen",
    production_mode: "guided",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: true,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "before", role: "bait", duration_ms: 900, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "none", sfx: null, guided_shot_key: "before", overlay: { kind: "split_reveal" }, description_he: `ה"לפני", פחות משנייה. מאותה זווית שתצלמו את ה"אחרי".` },
        { key: "snap", role: "cut", duration_ms: 0, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "snap", sfx: "snap", description_he: "מעבר על הקצב: הקשת אצבע, יד על העדשה או החלקה." },
        { key: "after", role: "reveal", duration_ms: 7000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "slow push in", camera: "push_in", transition_in: "snap", sfx: null, guided_shot_key: "after", description_he: `ה"אחרי" נחשף, עם תנועה איטית.` },
        { key: "cta", role: "cta", duration_ms: 3500, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, overlay: { kind: "price" }, description_he: "מחיר אמיתי או הנעה לפעולה." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "finger snap on the beat", hook_line_he_pattern: "{מה היה} ← {כמה זמן לקח}", why_he: "המספר נותן הוכחה." },
      { key: "B", bait_concept_en: "a hand covers the lens and pulls away", hook_line_he_pattern: "ככה זה הגיע אלינו", why_he: "המעבר עצמו מספק." },
      { key: "C", bait_concept_en: "a swipe with a split-screen divider", hook_line_he_pattern: "אותה זווית. בלי פילטרים", why_he: "מחזק אמינות." },
    ],
    niche_adaptations: [
      { niche_slug: "barbers-salons", subject_en: "a client", setting_en: "a barber chair", onscreen_examples_he: { hook: "ככה הוא נכנס. ככה הוא יצא" }, cta_type: "BOOK_NOW" },
      { niche_slug: "renovation-contractors", subject_en: "a bathroom", setting_en: "an old apartment", onscreen_examples_he: { hook: "אמבטיה משנות ה-80 ← 10 ימי עבודה" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "auto-services", subject_en: "a car interior", setting_en: "a detailing bay", onscreen_examples_he: { hook: "אותו רכב. שלוש שעות של דיטיילינג" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "home-services", subject_en: "an air conditioner filter", setting_en: "a living room", onscreen_examples_he: { hook: "מסנן מזגן לפני ניקוי, ואחרי" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "energetic", bpm_min: 115, bpm_max: 130, drop_at_ms: 900, energy_curve: "drop", sfx_cues: [{ beat_key: "snap", kind: "snap" }] },
    required_overlays: ["split_reveal"],
    shot_list: {
      shots: [
        { key: "before", title_he: `ה"לפני"`, instruction_he: "צלמו את המצב לפני העבודה מזווית קבועה. סמנו לעצמכם איפה עמדתם.", framing: "medium", min_sec: 2, max_sec: 4, ghost: "tripod_wide", tips_he: ["חצובה או סימון על הרצפה", "אותה שעה ביום, אותה תאורה"], people_on_camera: false },
        { key: "after", title_he: `ה"אחרי"`, instruction_he: "אחרי העבודה, חזרו בדיוק לאותה נקודה וצלמו שוב.", framing: "medium", min_sec: 3, max_sec: 6, ghost: "tripod_wide", tips_he: ["בלי פילטרים, בלי זום"], people_on_camera: false },
      ],
    },
    compliance_notes_he: [
      `רק תוצאות אמיתיות, מאותה זווית. אף פעם לא "אחרי" שנוצר ב-AI.`,
      "בקליניקות אסתטיקה ובטיפולים בגוף, מטא מגבילה תמונות לפני ואחרי במודעות. שם מומלץ פרסום רגיל בלבד.",
    ],
    do_not_copy: ["trending audio", "other businesses' before/after photos"],
    platform_tone: { reels: "מספק ונקי", tiktok: "מהיר" },
    default_duration_sec: 15,
    default_goal: "trust",
    default_video_type: "reel_hook",
    default_visual_style: "before_after",
    default_music_mood: "energetic",
    default_caption_preset: "poster",
    vo_mode: "optional",
    recommended_ad_goal: "whatsapp_messages",
    niches: ["barbers-salons", "renovation-contractors", "auto-services", "home-services"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: `ה"לפני" על המסך, פחות משנייה` },
        { t_ms: 900, text_he: "הקשת אצבע או יד על העדשה, בדיוק על הקצב" },
        { t_ms: 1200, text_he: `ה"אחרי" נחשף מאותה זווית` },
        { t_ms: 3000, text_he: "הצופה משווה בראש, ונשאר לראות פרטים" },
      ],
      why_it_works_he: [
        `המוח רוצה לסגור את הפער בין "לפני" ל"אחרי".`,
        "מעבר על הקצב נותן רגע מספק שאנשים חוזרים אליו.",
        "עבודה אמיתית מאותה זווית היא הוכחה, לא הבטחה.",
      ],
      how_to_he: [
        { title_he: `מצלמים "לפני"`, body_he: "זווית קבועה, בלי זום. המערכת מראה מסגרת עזר כדי שתחזרו לאותה נקודה." },
        { title_he: `מצלמים "אחרי"`, body_he: "מאותה נקודה בדיוק, אחרי העבודה." },
        { title_he: "בוחרים מעבר", body_he: "הקשת אצבע, יד על העדשה או מסך מפוצל. המערכת מסנכרנת למוזיקה." },
        { title_he: "מוסיפים מחיר או הנעה", body_he: `מחיר אמיתי ועדכני, או "שלחו תמונה בוואטסאפ ונחזור עם הצעה".` },
      ],
      faq_he: [
        { q_he: `אפשר ליצור את ה"אחרי" ב-AI?`, a_he: `לא. "אחרי" שנוצר ב-AI הוא הטעיה של הלקוחות, ואנחנו לא מאפשרים אותו. ה"לפני" וה"אחרי" חייבים להיות צילומים אמיתיים של העבודה שלכם.` },
        ...COMMON_FAQ,
      ],
    },
    seo_title_he: "סרטון לפני ואחרי לעסקים: מעבר על הקצב שמחזיק צופים",
    seo_description_he: `איך עושים סרטון לפני ואחרי שעובד: פחות משנייה של "לפני", מעבר על הקצב וחשיפה. רשימת צילומים, עריכה אוטומטית, ורק תוצאות אמיתיות.`,
    is_featured: true,
    sort_order: 6,
    mock_stage: "classic",
  },

  // ---------- E3 ----------
  {
    slug: "day-in-the-life",
    name_he: "יום בחיים של…",
    tagline_he: "מונטאז׳ מהיר של היום שלכם, עם שעה על כל צילום",
    description_he:
      `חמישה עד שמונה צילומים קצרים מהיום בעסק, וכל אחד עם חותמת שעה: "06:30 — מדליקים את הטאבון". בסוף משפט קצר על למה אתם עושים את זה, והנעה לפעולה.`,
    why_it_works_he:
      "אנשים אוהבים לראות איך נראה יום אמיתי מאחורי הדלפק. השעות על המסך יוצרות קצב, והמונטאז׳ מראה עבודה בלי להתרברב.",
    hook_type_slug: "day-in-life",
    lifecycle: "evergreen",
    production_mode: "guided",
    ad_safety: "needs_consent",
    extra_gates: [],
    requires_real_footage: true,
    requires_people_consent: true,
    recipe: {
      beats: [
        { key: "clock", role: "label", duration_ms: 20000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "none", sfx: null, overlay: { kind: "clock", text_he: "06:30" }, description_he: "חותמת שעה על כל צילום." },
        { key: "montage", role: "bait", duration_ms: 18000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "speed ramp between shots", camera: "handheld", transition_in: "none", sfx: "tick", guided_shot_key: "micro", onscreen_slot: { key: "opening", max_chars: 30, example_he: "06:30 — מדליקים את הטאבון" }, description_he: "5 עד 8 צילומים קצרים, מהבוקר עד הסגירה." },
        { key: "reflection", role: "payoff", duration_ms: 6000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: null, description_he: "רגע שקט: משפט אחד על למה אתם עושים את זה." },
        { key: "cta", role: "cta", duration_ms: 3000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: "כרטיס סיום." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the very first action of the morning, lights on", hook_line_he_pattern: "{שעה} — {הפעולה הראשונה ביום}", why_he: "פתיחה שקטה ואמיתית." },
      { key: "B", bait_concept_en: "the busiest minute of the day, sped up", hook_line_he_pattern: "ככה נראית שעת העומס אצלנו", why_he: "אנרגיה מהפריים הראשון." },
      { key: "C", bait_concept_en: "the last light switched off at closing", hook_line_he_pattern: "יום שלם ב-30 שניות", why_he: "מבטיח קצב מהיר." },
    ],
    niche_adaptations: [
      { niche_slug: "restaurants", subject_en: "the kitchen team", setting_en: "a bakery-restaurant", onscreen_examples_he: { opening: "06:30 — מדליקים את הטאבון" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "fitness-trainers", subject_en: "a personal trainer", setting_en: "a small studio", onscreen_examples_he: { opening: "05:45 — האימון הראשון" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "beauty-nails", subject_en: "a nail technician", setting_en: "a home studio", onscreen_examples_he: { opening: "09:00 — מסדרות את העמדה" }, cta_type: "BOOK_NOW" },
      { niche_slug: "event-venues", subject_en: "the venue crew", setting_en: "an event garden", onscreen_examples_he: { opening: "14:00 — מתחילים להקים" }, cta_type: "LEARN_MORE" },
    ],
    music_brief: { mood: "warm", bpm_min: 95, bpm_max: 112, energy_curve: "build", sfx_cues: [{ beat_key: "montage", kind: "tick" }] },
    required_overlays: ["clock"],
    shot_list: {
      shots: [
        { key: "micro", title_he: "צילומים קצרים לאורך היום", instruction_he: "צלמו 5 עד 8 קטעים של 2–3 שניות מרגעים שונים ביום. רשמו את השעה של כל אחד.", framing: "medium", min_sec: 2, max_sec: 4, ghost: "hands_table", tips_he: ["כל צילום עם תנועה אחת ברורה", "גם רגעים קטנים, כמו קפה או מפתח בדלת"], people_on_camera: true },
        { key: "reflection", title_he: "רגע שקט", instruction_he: "צילום אחד רגוע בסוף היום: המקום ריק, או אתם מסתכלים על התוצאה.", framing: "wide", min_sec: 3, max_sec: 6, ghost: "tripod_wide", tips_he: [], people_on_camera: true },
      ],
    },
    compliance_notes_he: ["כל מי שמופיע צריך לתת הסכמה, ובמיוחד לקוחות שנכנסים לפריים.", "בלי ילדים בצילום בלי אישור של ההורים."],
    do_not_copy: ["trending audio", "other creators' vlog voice-over"],
    platform_tone: { reels: "חם", tiktok: "מהיר וקליל" },
    default_duration_sec: 30,
    default_goal: "trust",
    default_video_type: "reel_hook",
    default_visual_style: "day_in_business",
    default_music_mood: "warm",
    default_caption_preset: "clean-box",
    vo_mode: "optional",
    recommended_ad_goal: "local_awareness",
    niches: ["restaurants", "fitness-trainers", "beauty-nails", "event-venues"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "חותמת שעה ופעולה ראשונה של הבוקר" },
        { t_ms: 1000, text_he: "חיתוך מהיר לצילום הבא, עם שעה חדשה" },
        { t_ms: 2000, text_he: "הקצב מבטיח יום שלם בכמה שניות" },
        { t_ms: 3000, text_he: "הצופה נשאר לראות את שאר היום" },
      ],
      why_it_works_he: [
        "סקרנות טבעית לגבי מה שקורה מאחורי הדלפק.",
        "חותמות שעה נותנות מבנה וקצב.",
        "תוכן אמיתי של עסק קטן מחזיק יותר זמן מתוכן מלוטש.",
      ],
      how_to_he: [
        { title_he: "מקבלים רשימה", body_he: "רשימת צילומים מותאמת לנישה, עם הסבר קצר לכל צילום." },
        { title_he: "מצלמים במהלך היום", body_he: "כל צילום 2–3 שניות. מעלים בסוף היום, הכול בבת אחת." },
        { title_he: "המערכת עורכת", body_he: "מסדרת לפי השעות, מוסיפה חותמות, כתוביות ומוזיקה מקורית." },
        { title_he: "מאשרים הסכמות ומפרסמים", body_he: "מסמנים שכל מי שמופיע הסכים, ומפרסמים." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "יום בחיים של העסק: פורמט רילס עם חותמות שעה",
    seo_description_he: `איך עושים סרטון "יום בחיים של…" לעסק: רשימת צילומים לטלפון, חותמות שעה, עריכה אוטומטית ומוזיקה שמותרת לפרסום.`,
    is_featured: false,
    sort_order: 7,
    mock_stage: "classic",
  },

  // ---------- E4 ----------
  {
    slug: "asmr-process",
    name_he: "תהליך מספק",
    tagline_he: "תקריבים של העבודה, צלילים נקיים ובלי מילה אחת",
    description_he:
      "מחומר גלם ועד תוצאה מוגמרת, בתקריבים איטיים עם צלילים נקיים של העבודה עצמה. בלי דיבור ובלי הסברים: הידיים מספרות הכול.",
    why_it_works_he:
      "ויזואל מספק מחזיק את העין גם בלי סאונד. רואים מיומנות אמיתית, ואי אפשר להפסיק באמצע בלי לראות איך זה נגמר.",
    hook_type_slug: "satisfying-visual",
    lifecycle: "evergreen",
    production_mode: "guided",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: true,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "raw", role: "bait", duration_ms: 2500, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "", camera: "top_down", transition_in: "none", sfx: "texture", guided_shot_key: "raw", description_he: "חומר הגלם, בתקריב מלמעלה." },
        { key: "process", role: "payoff", duration_ms: 8000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "real-time, no speed ramp", camera: "static", transition_in: "match_cut", sfx: "texture", guided_shot_key: "process", description_he: "שלושה תקריבים של התהליך, עם הצליל האמיתי." },
        { key: "finished", role: "reveal", duration_ms: 3000, visual_source: "user_media", visual_prompt_en: "", motion_prompt_en: "slow orbit", camera: "orbit", transition_in: "cut", sfx: null, guided_shot_key: "finished", description_he: "התוצאה המוגמרת." },
        { key: "cta", role: "cta", duration_ms: 2500, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: "כרטיס סיום שקט." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the first touch of a tool on raw material", hook_line_he_pattern: "{מספר} שניות של {תהליך}", why_he: "מבטיח חוויה קצרה ומספקת." },
      { key: "B", bait_concept_en: "a perfectly clean final pass", hook_line_he_pattern: "רק תקשיבו", why_he: "מזמין להדליק סאונד." },
      { key: "C", bait_concept_en: "a top-down shot of tidy tools before work", hook_line_he_pattern: "בלי מילים. רק עבודה", why_he: "ניגוד לתוכן מדבר." },
    ],
    niche_adaptations: [
      { niche_slug: "catering-chefs", subject_en: "a chef's hands", setting_en: "a prep counter", onscreen_examples_he: { hook: "30 שניות של חיתוך ירקות לאירוע" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "beauty-nails", subject_en: "nail technician hands", setting_en: "a manicure table", onscreen_examples_he: { hook: "רק תקשיבו לזה" }, cta_type: "BOOK_NOW" },
      { niche_slug: "auto-services", subject_en: "a detailer", setting_en: "a car interior", onscreen_examples_he: { hook: "ניקוי מושבים, בלי מילים" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "retail-stores", subject_en: "packing hands", setting_en: "a shop counter", onscreen_examples_he: { hook: "אורזים הזמנה, צעד אחר צעד" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "calm", bpm_min: 70, bpm_max: 90, energy_curve: "flat", sfx_cues: [{ beat_key: "process", kind: "texture" }] },
    required_overlays: [],
    shot_list: {
      shots: [
        { key: "raw", title_he: "חומר הגלם", instruction_he: "צילום מלמעלה של חומר הגלם והכלים, לפני שמתחילים.", framing: "closeup", min_sec: 2, max_sec: 4, ghost: "hands_table", tips_he: ["רקע נקי ואחיד"], people_on_camera: false },
        { key: "process", title_he: "התהליך", instruction_he: "שלושה תקריבים קצרים של העבודה, עם הטלפון קרוב לצליל.", framing: "closeup", min_sec: 3, max_sec: 6, ghost: "hands_table", tips_he: ["בלי מוזיקה ברקע בזמן הצילום", "תנו לצליל של העבודה להישמע"], people_on_camera: false },
        { key: "finished", title_he: "התוצאה", instruction_he: "התוצאה המוגמרת במרכז, בתנועה איטית סביבה.", framing: "medium", min_sec: 2, max_sec: 4, ghost: "product_center", tips_he: [], people_on_camera: false },
      ],
    },
    compliance_notes_he: ["רק עבודה אמיתית שלכם. בלי צילומים של עסקים אחרים."],
    do_not_copy: ["trending ASMR audio", "other creators' footage"],
    platform_tone: { reels: "שקט ומדויק", tiktok: "שקט ומדויק" },
    default_duration_sec: 15,
    default_goal: "trust",
    default_video_type: "reel_hook",
    default_visual_style: "product",
    default_music_mood: "calm",
    default_caption_preset: "soft",
    vo_mode: "none",
    recommended_ad_goal: "local_awareness",
    niches: ["catering-chefs", "beauty-nails", "auto-services", "retail-stores"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "תקריב של חומר הגלם, עם צליל נקי" },
        { t_ms: 1000, text_he: "המגע הראשון של הכלי" },
        { t_ms: 2500, text_he: "חיתוך מותאם לתקריב הבא בתהליך" },
        { t_ms: 3000, text_he: "הצופה רוצה לראות איך זה נגמר" },
      ],
      why_it_works_he: [
        "ויזואל מספק עובד גם בלי סאונד, וגם עם סאונד.",
        `רואים מיומנות, בלי שמישהו יצטרך להגיד "אנחנו מקצועיים".`,
        "התהליך יוצר ציפייה לתוצאה.",
      ],
      how_to_he: [
        { title_he: "מקבלים רשימת צילומים", body_he: "שלושה סוגי צילומים: חומר גלם, תהליך ותוצאה." },
        { title_he: "מצלמים קרוב לצליל", body_he: "הטלפון קרוב לעבודה, בלי מוזיקה ברקע." },
        { title_he: "המערכת עורכת", body_he: "חיתוכים מותאמים, ניקוי רעשים ומוזיקה שקטה מתחת לצליל." },
        { title_he: "מפרסמים", body_he: "כרילס או כמודעה לאזור שלכם." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "סרטון תהליך מספק לעסקים: תקריבים בלי מילים שמחזיקים צופים",
    seo_description_he: `פירוק הפורמט "תהליך מספק": מחומר גלם לתוצאה, בתקריבים ובצלילים נקיים. רשימת צילומים לטלפון ועריכה אוטומטית.`,
    is_featured: false,
    sort_order: 8,
    mock_stage: "classic",
  },

  // ---------- E5 ----------
  {
    slug: "myth-vs-fact",
    name_he: "מיתוס מול עובדה",
    tagline_he: `מיתוס שכולם מאמינים בו, "לא נכון" גדול, והסבר קצר`,
    description_he:
      `פותחים במשפט שהרבה לקוחות מאמינים בו, ומיד חותמת "לא נכון". אחר כך הסבר קצר למה, וטיפ אחד שאפשר לעשות כבר היום.`,
    why_it_works_he:
      `מיתוס מוכר מושך תשומת לב, וה"לא נכון" יוצר פער שרוצים לסגור. אתם יוצאים מומחים בלי לדבר על עצמכם.`,
    hook_type_slug: "myth-busting",
    lifecycle: "evergreen",
    production_mode: "hybrid",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "myth", role: "bait", duration_ms: 3000, visual_source: "ai_image_kenburns", visual_prompt_en: "{subject_en} looking skeptical in {setting_en}, no text", motion_prompt_en: "slow push in", camera: "push_in", transition_in: "none", sfx: null, onscreen_slot: { key: "myth", max_chars: 45, example_he: "מיתוס: אם לא כואב, אין עששת" }, description_he: "המיתוס, במשפט אחד על המסך." },
        { key: "stamp", role: "label", duration_ms: 2000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: "stamp", overlay: { kind: "rating", text_he: "✗ לא נכון" }, description_he: `חותמת "לא נכון" גדולה.` },
        { key: "why", role: "payoff", duration_ms: 14000, visual_source: "ai_image_kenburns", visual_prompt_en: "close-up explaining gesture, {setting_en}, no text", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: null, vo_slot: { key: "why", max_words: 30 }, description_he: "הסבר קצר: למה זה לא נכון." },
        { key: "tip", role: "reveal", duration_ms: 7000, visual_source: "ai_image_kenburns", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: null, overlay: { kind: "rating", text_he: "✓ מה כן" }, description_he: "טיפ אחד שאפשר לעשות היום." },
        { key: "cta", role: "cta", duration_ms: 4000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: "הנעה לפעולה." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the myth as a bold on-screen quote", hook_line_he_pattern: "מיתוס: {אמונה נפוצה}", why_he: "ישיר וברור." },
      { key: "B", bait_concept_en: "a customer saying the myth out loud", hook_line_he_pattern: `שומעים את זה כל יום: "{אמונה נפוצה}"`, why_he: "מרגיש אמיתי." },
      { key: "C", bait_concept_en: "a big red X first, myth second", hook_line_he_pattern: "תפסיקו להאמין ש{אמונה נפוצה}", why_he: "פותח בעימות." },
    ],
    niche_adaptations: [
      { niche_slug: "dentists", subject_en: "a dentist", setting_en: "a clinic", onscreen_examples_he: { myth: "מיתוס: אם לא כואב, אין עששת" }, cta_type: "BOOK_NOW", notes_he: "כל טענה חייבת להיות נכונה רפואית, בלי הבטחת תוצאה." },
      { niche_slug: "fitness-trainers", subject_en: "a trainer", setting_en: "a gym", onscreen_examples_he: { myth: "מיתוס: בטן שטוחה עושים רק בכפיפות בטן" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "mortgage-advisors", subject_en: "an advisor", setting_en: "an office", onscreen_examples_he: { myth: "מיתוס: ההצעה של הבנק שלי היא בטוח הכי טובה" }, cta_type: "GET_QUOTE", notes_he: "נישה פיננסית: בלי הבטחת חיסכון, עם ההסתייגויות הנדרשות." },
      { niche_slug: "accountants", subject_en: "an accountant", setting_en: "a home office", onscreen_examples_he: { myth: "מיתוס: רואה חשבון צריך רק בסוף השנה" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "inspiring", bpm_min: 90, bpm_max: 105, energy_curve: "build", sfx_cues: [{ beat_key: "stamp", kind: "stamp" }] },
    required_overlays: ["rating"],
    shot_list: {
      shots: [
        { key: "talk", title_he: "משפט למצלמה", instruction_he: "הסבר קצר למצלמה, בגובה העיניים, במשפטים קצרים.", framing: "medium", min_sec: 8, max_sec: 20, ghost: "face_center", tips_he: ["אפשר לקרוא מהטלפון: המערכת מציגה את הטקסט"], people_on_camera: true },
      ],
    },
    compliance_notes_he: [
      "המיתוס וההסבר חייבים להיות נכונים ומבוססים. בנישות מפוקחות המערכת מוסיפה את ההסתייגויות הנדרשות.",
      "בלי הבטחת תוצאות ובלי פנייה שמניחה מאפיין אישי של הצופה.",
    ],
    do_not_copy: ["other creators' scripts"],
    platform_tone: { reels: "סמכותי וידידותי", tiktok: "ישיר" },
    default_duration_sec: 30,
    default_goal: "trust",
    default_video_type: "explainer",
    default_visual_style: "text_motion",
    default_music_mood: "inspiring",
    default_caption_preset: "news",
    vo_mode: "required",
    recommended_ad_goal: "lead_form",
    niches: ["dentists", "fitness-trainers", "mortgage-advisors", "accountants"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "המיתוס על המסך, במשפט אחד" },
        { t_ms: 1500, text_he: `הצופה מהנהן: "גם אני חשבתי ככה"` },
        { t_ms: 3000, text_he: `חותמת "לא נכון" נוחתת` },
        { t_ms: 3500, text_he: "עכשיו הוא חייב לשמוע למה" },
      ],
      why_it_works_he: [
        "ניפוץ מיתוס יוצר פער ידע שרוצים לסגור.",
        "אתם נשמעים מומחים בלי להגיד את זה.",
        "טיפ אחד בסוף נותן ערך, ואנשים שומרים את הסרטון.",
      ],
      how_to_he: [
        { title_he: "בוחרים מיתוס", body_he: "המערכת מציעה מיתוסים נפוצים בנישה. בוחרים אחד שאתם שומעים מלקוחות." },
        { title_he: "בודקים שהעובדה נכונה", body_he: "ההסבר חייב להיות נכון. בנישות מפוקחות מתווספות הסתייגויות." },
        { title_he: "מצלמים או בוחרים קריינות", body_he: "אתם מול המצלמה, או קריינות בעברית עם ויז׳ואלים." },
        { title_he: "מפרסמים", body_he: "כרילס, או כמודעה עם טופס לידים." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "מיתוס מול עובדה: פורמט רילס שבונה סמכות לבעלי מקצוע",
    seo_description_he: `איך עושים סרטון "מיתוס מול עובדה" לעסק: מבנה של 30 שניות, דוגמאות לפי נישה, וכללי ניסוח לנישות מפוקחות.`,
    is_featured: false,
    sort_order: 9,
    mock_stage: "classic",
  },

  // ---------- E6 ----------
  {
    slug: "reply-to-comment",
    name_he: "עונים לתגובה",
    tagline_he: "שאלה של לקוח בבועת תגובה, ותשובה קצרה וברורה",
    description_he:
      "בועת תגובה מופיעה בפריים הראשון עם שאלה שלקוחות באמת שואלים. אחר כך תשובה קצרה, ובסוף הזמנה לשאול עוד בוואטסאפ.",
    why_it_works_he:
      "שאלה אמיתית מושכת את כל מי ששאל את עצמו אותו דבר. זה מרגיש כמו שיחה ולא כמו פרסומת, ועונה על התנגדויות לפני שהן מגיעות.",
    hook_type_slug: "question",
    lifecycle: "evergreen",
    production_mode: "hybrid",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "comment", role: "bait", duration_ms: 3500, visual_source: "ai_image_kenburns", visual_prompt_en: "{subject_en} in {setting_en} reading a phone, no text on screen", motion_prompt_en: "slow push in", camera: "push_in", transition_in: "none", sfx: "pop", overlay: { kind: "comment_bubble", text_he: "לקוח שאל:" }, onscreen_slot: { key: "question", max_chars: 60, example_he: "כמה זמן לוקח לקבל צו ירושה?" }, description_he: "בועת תגובה עם שאלה אמיתית, בלי שם ובלי מיתוג של רשת." },
        { key: "answer", role: "payoff", duration_ms: 20000, visual_source: "ai_image_kenburns", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: null, vo_slot: { key: "answer", max_words: 50 }, description_he: "התשובה, בשניים-שלושה משפטים." },
        { key: "cta", role: "cta", duration_ms: 4000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: `"יש לכם שאלה? שלחו בוואטסאפ".` },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "comment bubble pops over a calm office shot", hook_line_he_pattern: `לקוח שאל: "{שאלה}"`, why_he: "השאלה עצמה היא ההוק." },
      { key: "B", bait_concept_en: "the professional points at the comment", hook_line_he_pattern: "שואלים אותי את זה כל שבוע", why_he: "מראה שזו שאלה נפוצה." },
      { key: "C", bait_concept_en: "the answer's key number appears first", hook_line_he_pattern: "התשובה הקצרה: {תשובה}. והארוכה:", why_he: "נותן ערך כבר בשנייה הראשונה." },
    ],
    niche_adaptations: [
      { niche_slug: "lawyers", subject_en: "a lawyer", setting_en: "a law office", onscreen_examples_he: { question: "כמה זמן לוקח לקבל צו ירושה?" }, cta_type: "WHATSAPP_MESSAGE", notes_he: `מידע כללי בלבד, עם ההסתייגות "אין לראות בזה ייעוץ משפטי".` },
      { niche_slug: "insurance-agents", subject_en: "an insurance agent", setting_en: "a home office", onscreen_examples_he: { question: "מה ההבדל בין ביטוח חיים לביטוח משכנתא?" }, cta_type: "GET_QUOTE" },
      { niche_slug: "interior-design", subject_en: "an interior designer", setting_en: "a bright living room", onscreen_examples_he: { question: "צריך מעצבת גם לדירה קטנה?" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "calm", bpm_min: 80, bpm_max: 100, energy_curve: "flat", sfx_cues: [{ beat_key: "comment", kind: "pop" }] },
    required_overlays: ["comment_bubble"],
    shot_list: {
      shots: [
        { key: "answer", title_he: "התשובה למצלמה", instruction_he: "ענו על השאלה בשניים-שלושה משפטים, מבט למצלמה.", framing: "medium", min_sec: 10, max_sec: 25, ghost: "face_center", tips_he: ["התחילו מהתשובה הקצרה"], people_on_camera: true },
      ],
    },
    compliance_notes_he: [
      `תגובה אמיתית רק באישור מי שכתב אותה. אחרת, ניסוח כללי "לקוח שאל:" בלי שם.`,
      "בלי לוגו של רשת חברתית ובלי שמות מומצאים.",
    ],
    do_not_copy: ["platform comment UI and branding", "real usernames"],
    platform_tone: { reels: "ענייני וחם", tiktok: "ישיר" },
    default_duration_sec: 30,
    default_goal: "leads",
    default_video_type: "explainer",
    default_visual_style: "ugc",
    default_music_mood: "calm",
    default_caption_preset: "clean-box",
    vo_mode: "required",
    recommended_ad_goal: "lead_form",
    niches: ["lawyers", "insurance-agents", "interior-design"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "בועת תגובה קופצת עם שאלה של לקוח" },
        { t_ms: 1500, text_he: "מי ששאל את עצמו אותו דבר נעצר" },
        { t_ms: 2500, text_he: "חיתוך לתשובה, מבט למצלמה" },
        { t_ms: 3500, text_he: "התשובה הקצרה כבר בשנייה הרביעית" },
      ],
      why_it_works_he: [
        "שאלה אמיתית מדברת בדיוק אל מי שמתלבט.",
        "זה מרגיש כמו שיחה, לא כמו מודעה.",
        "סרטון אחד עונה על שאלה שחוזרת שוב ושוב.",
      ],
      how_to_he: [
        { title_he: "בוחרים שאלה", body_he: "שאלה שלקוחות שואלים אתכם, או תגובה אמיתית שקיבלתם, באישור הכותב." },
        { title_he: "כותבים תשובה קצרה", body_he: "שניים-שלושה משפטים. המערכת עוזרת לקצר." },
        { title_he: "מצלמים או בוחרים קריינות", body_he: "אתם מול המצלמה, או קריינות בעברית." },
        { title_he: "מפרסמים", body_he: "כרילס, או כמודעה עם טופס לידים לשאלות נוספות." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "עונים לתגובה: פורמט רילס שהופך שאלות של לקוחות ללידים",
    seo_description_he: `איך עושים סרטון "עונים לתגובה" לעסק: בועת תגובה בעברית, תשובה קצרה והנעה לוואטסאפ. בלי מיתוג של רשת ובלי שמות מומצאים.`,
    is_featured: false,
    sort_order: 10,
    mock_stage: "classic",
  },

  // ---------- E7 ----------
  {
    slug: "price-reveal",
    name_he: "כמה זה עולה באמת",
    tagline_he: "המספר הגדול כבר בשנייה הראשונה, ואז מה מקבלים בו",
    description_he:
      "מחיר אמיתי ועדכני מופיע ענק על המסך כבר בשנייה הראשונה. אחר כך פירוק קצר של מה כלול בו, וההצעה שלכם.",
    why_it_works_he:
      "כולם רוצים לדעת כמה זה עולה, ורוב העסקים לא אומרים. מחיר גלוי עוצר גלילה, מסנן לקוחות לא מתאימים ובונה אמון.",
    hook_type_slug: "price-reveal",
    lifecycle: "evergreen",
    production_mode: "ai",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "number", role: "bait", duration_ms: 2500, visual_source: "ai_clip", visual_prompt_en: "hero shot of {product_en} in {setting_en}, dramatic light, no text", motion_prompt_en: "fast push in", camera: "push_in", transition_in: "none", sfx: "hit", overlay: { kind: "price" }, onscreen_slot: { key: "price", max_chars: 20, example_he: "ארוחה זוגית: ₪{מחיר}" }, description_he: "המחיר, ענק, כבר בשנייה הראשונה." },
        { key: "breakdown", role: "payoff", duration_ms: 7500, visual_source: "ai_image_kenburns", visual_prompt_en: "three detail shots of what is included, no text", motion_prompt_en: "", camera: "top_down", transition_in: "cut", sfx: "tick", description_he: "מה כלול במחיר, פריט אחר פריט." },
        { key: "offer", role: "reveal", duration_ms: 2500, visual_source: "ai_image_kenburns", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "cut", sfx: null, description_he: "ההצעה, ועד מתי היא תקפה (רק אם זה נכון)." },
        { key: "cta", role: "cta", duration_ms: 2500, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: "הנעה לפעולה." },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "the price slams onto the screen over a hero shot", hook_line_he_pattern: "{שירות}: ₪{מחיר}. זה מה שמקבלים", why_he: "שקיפות מיידית." },
      { key: "B", bait_concept_en: "a receipt prints out line by line", hook_line_he_pattern: "כמה עולה {שירות} באמת?", why_he: "שאלה שכולם שואלים." },
      { key: "C", bait_concept_en: "a hand places bills on the table", hook_line_he_pattern: "מה מקבלים ב-₪{מחיר}?", why_he: "מזמין להשוות." },
    ],
    niche_adaptations: [
      { niche_slug: "restaurants", subject_en: "a mixed grill platter", setting_en: "a wooden table", product_en: "a dinner for two", onscreen_examples_he: { price: "ארוחה זוגית: ₪{מחיר}" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "home-services", subject_en: "an AC technician's kit", setting_en: "a living room", product_en: "an AC cleaning service", onscreen_examples_he: { price: "ניקוי מזגן: ₪{מחיר}" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "real-estate", subject_en: "an apartment living room", setting_en: "a city apartment", product_en: "a 4-room apartment", onscreen_examples_he: { price: "4 חדרים בחולון: ₪{מחיר}" }, cta_type: "WHATSAPP_MESSAGE", notes_he: "רק מחיר מבוקש אמיתי ועדכני של נכס שאתם משווקים." },
    ],
    music_brief: { mood: "energetic", bpm_min: 110, bpm_max: 128, drop_at_ms: 500, energy_curve: "drop", sfx_cues: [{ beat_key: "number", kind: "hit" }] },
    required_overlays: ["price"],
    shot_list: null,
    compliance_notes_he: [
      "רק מחיר אמיתי ועדכני. חוק הגנת הצרכן חל על כל מחיר במודעה.",
      `דחיפות ("עד סוף השבוע") רק כשזה באמת נכון.`,
    ],
    do_not_copy: ["competitors' prices or names"],
    platform_tone: { reels: "ישיר", tiktok: "ישיר" },
    default_duration_sec: 15,
    default_goal: "sales",
    default_video_type: "offer",
    default_visual_style: "product",
    default_music_mood: "energetic",
    default_caption_preset: "poster",
    vo_mode: "optional",
    recommended_ad_goal: "whatsapp_messages",
    niches: ["restaurants", "home-services", "real-estate"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "תמונת גיבור של המוצר או השירות" },
        { t_ms: 500, text_he: "המחיר נוחת ענק על המסך" },
        { t_ms: 2500, text_he: "חיתוך לפירוט: מה כלול" },
        { t_ms: 3000, text_he: "הצופה נשאר כדי לבדוק אם זה שווה" },
      ],
      why_it_works_he: [
        "מחיר גלוי עונה על השאלה הראשונה של כל לקוח.",
        "מספר גדול על המסך עוצר את העין.",
        "שקיפות מסננת פניות לא מתאימות, וחוסכת לכם זמן.",
      ],
      how_to_he: [
        { title_he: "מכניסים מחיר אמיתי", body_he: "המחיר העדכני שלכם. בלי מחיר, המערכת משאירה מקום ריק ומבקשת למלא." },
        { title_he: "מפרטים מה כלול", body_he: "שלושה פריטים קצרים. המערכת מציעה לפי הנישה." },
        { title_he: "בוחרים סגנון", body_he: "ויז׳ואלים ב-AI או התמונות שלכם, וכתוביות בסגנון פוסטר." },
        { title_he: "מפרסמים", body_he: "כרילס, או כמודעה עם הודעות בוואטסאפ." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "כמה זה עולה באמת: פורמט חשיפת מחיר לעסקים",
    seo_description_he: "איך עושים סרטון חשיפת מחיר שעוצר גלילה: המספר בשנייה הראשונה, פירוט ומה כלול, והכללים למחיר אמיתי ועדכני.",
    is_featured: false,
    sort_order: 11,
    mock_stage: "classic",
  },

  // ---------- E8 ----------
  {
    slug: "quick-how-to",
    name_he: "מדריך מהיר",
    tagline_he: "הבטחה של ערך בכמה שניות, ושלושה צעדים ברורים",
    description_he:
      `פותחים בהבטחה קצרה: "3 טיפים ב-20 שניות". אחר כך שלושה צעדים, כל אחד עם מספר גדול על המסך, ובסוף הזמנה לשמור את הסרטון ולפנות אליכם.`,
    why_it_works_he:
      "הבטחה ברורה ומדידה גורמת להישאר עד הסוף. אנשים שומרים ושולחים סרטונים שימושיים, ומחפשים אותם שוב.",
    hook_type_slug: "how-to",
    lifecycle: "evergreen",
    production_mode: "hybrid",
    ad_safety: "ad_safe",
    extra_gates: [],
    requires_real_footage: false,
    requires_people_consent: false,
    recipe: {
      beats: [
        { key: "promise", role: "bait", duration_ms: 3000, visual_source: "ai_image_kenburns", visual_prompt_en: "{subject_en} ready to demonstrate in {setting_en}, no text", motion_prompt_en: "push in", camera: "push_in", transition_in: "none", sfx: null, overlay: { kind: "clock", text_he: "0:20" }, onscreen_slot: { key: "promise", max_chars: 40, example_he: "3 דברים לבדוק לפני שמדליקים מזגן" }, description_he: "ההבטחה: כמה טיפים, בכמה שניות." },
        { key: "steps", role: "payoff", duration_ms: 21000, visual_source: "ai_image_kenburns", visual_prompt_en: "three clear demonstration shots, hands, no text", motion_prompt_en: "", camera: "top_down", transition_in: "cut", sfx: "tick", vo_slot: { key: "steps", max_words: 45 }, description_he: "שלושה צעדים, מספר גדול על כל אחד." },
        { key: "cta", role: "cta", duration_ms: 4000, visual_source: "brand_card", visual_prompt_en: "", motion_prompt_en: "", camera: "static", transition_in: "fade", sfx: null, description_he: `"שמרו את הסרטון", והנעה לפעולה.` },
      ],
    },
    hook_variants: [
      { key: "A", bait_concept_en: "a countdown timer appears with the promise", hook_line_he_pattern: "{מספר} {טיפים} ב-{שניות} שניות", why_he: "הבטחה מדידה." },
      { key: "B", bait_concept_en: "a common mistake shown first", hook_line_he_pattern: "רוב האנשים עושים את זה לא נכון", why_he: "פותח בבעיה." },
      { key: "C", bait_concept_en: "the end result first, then how", hook_line_he_pattern: "ככה זה אמור להיראות. הנה איך", why_he: "התוצאה קודם." },
    ],
    niche_adaptations: [
      { niche_slug: "home-services", subject_en: "a technician", setting_en: "a living room", onscreen_examples_he: { promise: "3 דברים לבדוק לפני שמדליקים מזגן בקיץ" }, cta_type: "WHATSAPP_MESSAGE" },
      { niche_slug: "physio-nutrition", subject_en: "a physiotherapist", setting_en: "a treatment room", onscreen_examples_he: { promise: "3 תרגילים לגב אחרי יום מול המחשב" }, cta_type: "BOOK_NOW", notes_he: "מידע כללי, בלי הבטחה רפואית." },
      { niche_slug: "vets-dog-grooming", subject_en: "a dog groomer", setting_en: "a grooming room", onscreen_examples_he: { promise: "3 טיפים לטיול עם הכלב בחום" }, cta_type: "WHATSAPP_MESSAGE" },
    ],
    music_brief: { mood: "inspiring", bpm_min: 100, bpm_max: 118, energy_curve: "flat", sfx_cues: [{ beat_key: "steps", kind: "tick" }] },
    required_overlays: [],
    shot_list: {
      shots: [
        { key: "demo", title_he: "הדגמה מלמעלה", instruction_he: "שלושה צילומים קצרים מלמעלה של כל צעד.", framing: "closeup", min_sec: 3, max_sec: 7, ghost: "hands_table", tips_he: ["צעד אחד בכל צילום"], people_on_camera: false },
      ],
    },
    compliance_notes_he: ["רק מידע נכון ובטוח. בנישות בריאות: מידע כללי, בלי הבטחה רפואית."],
    do_not_copy: ["other creators' scripts"],
    platform_tone: { reels: "שימושי", tiktok: "מהיר" },
    default_duration_sec: 30,
    default_goal: "engagement",
    default_video_type: "explainer",
    default_visual_style: "text_motion",
    default_music_mood: "inspiring",
    default_caption_preset: "clean-box",
    vo_mode: "required",
    recommended_ad_goal: "whatsapp_messages",
    niches: ["home-services", "physio-nutrition", "vets-dog-grooming"],
    status: "published",
    explainer: {
      first_seconds_he: [
        { t_ms: 0, text_he: "ההבטחה על המסך: כמה טיפים, בכמה שניות" },
        { t_ms: 1200, text_he: "טיימר קטן מתחיל לרוץ" },
        { t_ms: 3000, text_he: "המספר 1 נוחת, והצעד הראשון מתחיל" },
      ],
      why_it_works_he: [
        "הבטחה ברורה ומדידה מחזיקה עד הסוף.",
        "תוכן שימושי נשמר ונשלח הלאה.",
        "אנשים מחפשים מדריכים קצרים, ולכן הסרטון ממשיך להביא צפיות.",
      ],
      how_to_he: [
        { title_he: "בוחרים נושא", body_he: "שאלה שלקוחות שואלים, או טעות נפוצה בתחום." },
        { title_he: "כותבים שלושה צעדים", body_he: "משפט אחד לכל צעד. המערכת עוזרת לקצר." },
        { title_he: "מצלמים או יוצרים ב-AI", body_he: "הדגמה מלמעלה מהטלפון, או ויז׳ואלים ב-AI." },
        { title_he: "מפרסמים", body_he: "כרילס עם כיתוב שמחפשים, או כמודעה." },
      ],
      faq_he: COMMON_FAQ,
    },
    seo_title_he: "מדריך מהיר: פורמט רילס של 3 טיפים לעסקים",
    seo_description_he: `איך עושים סרטון "מדריך מהיר" לעסק: הבטחה מדידה, שלושה צעדים ומספרים גדולים על המסך. דוגמאות לפי נישה ועריכה אוטומטית.`,
    is_featured: false,
    sort_order: 12,
    mock_stage: "classic",
  },
];

export const TREND_MUSIC_NOTE_HE = MUSIC_NOTE;

export const publishedTrends = () =>
  TREND_TEMPLATES.filter((t) => t.status === "published").sort((a, b) => a.sort_order - b.sort_order);

export const getTrend = (slug: string) => TREND_TEMPLATES.find((t) => t.slug === slug);
