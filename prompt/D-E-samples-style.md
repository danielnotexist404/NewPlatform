# נספח D — תסריטים לדוגמה

הנספח הזה מגדיר חמישה פרויקטים לדוגמה, שלמים מקצה לקצה: בריף, הוק מהספרייה, קלט מלא, תסריט `ScriptV1`, סטוריבורד `StoryboardV1` וטבלת סצנות קריאה. אלה לא "השראה". הם חוזה: כל JSON כאן עובר אימות מול ה-JSON Schemas של חלק 05 (§11), עובר את כל הבדיקות הסמנטיות `S01`–`S15` ו-`B01`–`B13` בלי שגיאה ובלי אזהרה, ועובר את ה-lint העברי (`lib/hebrew/lint.ts`).
יש להם שלושה תפקידים: דוגמאות (few-shot) בפרומפט של `script.generate.v1`, בדיקות זהב לכל הקוד הדטרמיניסטי שסביב ה-LLM (נרמול להקראה, כתוביות, props, פוסטר), וסרטוני ההדגמה (אנימטיק) של האתר השיווקי: הגלריה, `NicheShowcase` ובאנר החנוכה (§9.1).
הקובץ הזה הוא מקור האמת. אם משנים דוגמה, מעדכנים כאן, מריצים את הבדיקות ומעדכנים את קובצי ה-golden באופן מכוון, באותו PR.

## §1. מה יש בנספח, איפה זה יושב בריפו ואיך משתמשים בזה

### 1.1 חמש הדוגמאות

| # | מזהה (`id`) | נישה | סוג סרטון | מבנה | משך ופורמט | פנייה · קול · רמה | הנעה | ויז׳ואל · איכות | מה בעיקר בודקים |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `restaurants-grill-30` | `restaurants` | `reel_hook` רילס עם הוק | `hpspc` | 30 שנ׳ · 9:16 | רבים · קריין · `casual` | `whatsapp` | `smart` · `standard` | placeholder פתוח (`{מחיר}`), עובדות מאושרות (דירוג וביקורות), ₪ אחרי המספר, ניקוד חלקי |
| 2 | `renovation-bathroom-30` | `renovation-contractors` | `reel_hook` | `bab` | 30 שנ׳ · 9:16 (+1:1) | רבים · קריין · `warm` | `whatsapp` | `smart` · `standard` | לפני ואחרי מתמונות אמיתיות של המשתמש, `user_media` ו-`user_photo_animated`, תקרת קליפים |
| 3 | `mortgage-mix-30` | `mortgage-advisors` | `explainer` הסבר שירות | `pas` | 30 שנ׳ · 9:16 (+16:9) | רבים · קריינית · `formal` | `comment_keyword` | `smart` · `standard` | נישה פיננסית: שתי הסתייגויות חובה, טענה מבוססת סימולציה, גוף ראשון בנקבה, ביט הוק שמתפצל לשתי סצנות, `brand_card` |
| 4 | `dentists-brand-60` | `dentists` | `brand_promo` סרטון תדמית | `brand_story` | 60 שנ׳ · 16:9 (+9:16) | רבים · קריינית · `warm` | `call` | `smart` · `premium` | נישה רפואית, 12 סצנות (המקסימום), ראשי תיבות בהקראה, בלי פנים של "רופאה" שנוצרו ב-AI |
| 5 | `nails-hanukkah-15` | `beauty-nails` | `offer` מבצע / חג | `aida` | 15 שנ׳ · 9:16 | נקבה · קריינית · `casual` | `booking` | `images` · `standard` | פנייה בנקבה מההתחלה עד הסוף, צוות של נשים, ₪ לפני המספר, שעה בהקראה, תמונות בלבד (אפס קליפים) |

הכיסוי מכוון: חמישה מבנים מתוך שישה, שלושה אורכים (15, 30 ו-60 שניות), שלושה יחסי מסך (9:16 ו-16:9 כפורמט ראשי, 1:1 כפורמט נוסף), פנייה ברבים ובנקבה, קריין וקריינית, שלוש רמות שפה (`formal`, `warm`, `casual`), ארבעה סוגי הנעה, שני תמהילי ויז׳ואל (`smart`, `images`) ושתי רמות איכות (`standard`, `premium`). מה שלא מכוסה כאן (פנייה בזכר, `slang`, `full`, `draft`, 45 שניות) נבדק ב-20 הבריפים של `scripts/eval-prompts.ts` (חלק 05 §23.5). למבנה `result_first` אין דוגמה, ולכן `pickSampleScript` נופל עבורו לדוגמת ה-`hpspc` (חלק 05 §10.6).

כל העסקים, הכתובות והאנשים בדוגמאות בדיוניים. מספר הטלפון `050-1234567` הוא מספר דמה. לפני שמרנדרים מהדוגמאות סרטון ציבורי (הדגמה באתר השיווקי), בודקים שאין עסק אמיתי באותו שם באותה עיר; אם יש, מחליפים את השם בקלט ומרנדרים מחדש. הסרטונים האלה תמיד מסומנים בתווית "הדגמה" (חלק 01).

### 1.2 קבצים בריפו

| נתיב | תוכן | מי משתמש |
|---|---|---|
| `lib/ai/prompts/examples/{id}.script.json` | ה-`ScriptV1` של הדוגמה, בדיוק כמו בנספח | `pickSampleScript` (few-shot), בדיקות, `scripts/render-demo-videos.ts` |
| `lib/ai/prompts/examples/{id}.storyboard.json` | ה-`StoryboardV1` של הדוגמה | בדיקות, אנימטיק הדמו, `PromptTester` באדמין |
| `lib/ai/prompts/examples/index.ts` | `SAMPLE_SCRIPTS` ו-`pickSampleScript()` | שכבת ה-AI |
| `tests/fixtures/scripts/{id}.input.json` | הקלט המלא (פרויקט, עסק, עובדות, בריף, הוק, הקשר לסטוריבורד, ערכי הדגמה) | בדיקות זהב, `PromptTester`, `scripts/eval-prompts.ts` |
| `tests/fixtures/scripts/index.ts` | מייבא את שלושת הקבצים של כל דוגמה ומייצא `SAMPLE_FIXTURES` | כל הבדיקות |
| `tests/contract/appendix-d.test.ts` | בדיקות התקינות והמוטציות של §8 | `pnpm test` |
| `tests/golden/appendix-d/*` | snapshots: הקראה, כתוביות, props, פוסטרים | `pnpm test`, `pnpm test:visual` |
| `scripts/render-demo-videos.ts` (`pnpm demo:render [--upload]`) | מרנדר את חמש הדוגמאות כאנימטיק באורך מלא, ואת לולאות קיר הסרטונים של חלק 02 §3.3.6 | §9.1 |
| `public-media/demo/examples/{id}-{9x16\|1x1\|16x9}.mp4`, `{id}-poster.jpg`, `{id}.vtt`, `{id}-loop.mp4` (bucket, לא בריפו) | סרטוני ההדגמה של חמש הדוגמאות (`paths.pub.demoExample`, חלק 04 §13.4) | `ShowcaseGallery`, `NicheShowcase`, באנר החנוכה, עמוד הדוגמאות |
| `public/media/demo/logo-demo.svg` | לוגו הדמו הגנרי (צורה מופשטת בלי שם) — הקובץ היחיד של מדיית ההדגמה שנשמר בריפו | כרטיס הסיום של סרטוני ההדגמה |

קובצי ה-JSON נשמרים פעם אחת בלבד, ב-`lib/ai/prompts/examples/` (הקוד בזמן ריצה צריך אותם). התיקייה `tests/fixtures/scripts/` לא מעתיקה אותם, אלא מייבאת. כך אין שני עותקים שיכולים להתפצל.

### 1.3 הנחות משותפות לכל הדוגמאות

- **תוכנית ומגבלות:** כל הדוגמאות מניחות סביבה בתוכנית `business` (פרימיום מותר, `max_ai_clips = null`, חלק 04 §16.4). לכן `storyboard_ctx.max_ai_clip_seconds` בקלט הוא הערך הנגזר `mixCap(visual_mix, target)` של `plan.ts` (חלק 05 §14.1): 15 ב-`smart` של 30 שניות, 30 ב-`smart` של 60 שניות, 0 ב-`images`. זה משתנה של הפרומפט, לא מפתח של `plans.limits`.
- **קצב דיבור:** `wps = app_settings.hebrew_wps.default (2.4) × projects.voice_speed`. בדוגמה 5 `voice_speed = 1.1`, ולכן `wps = 2.64`. כל ביט עומד ב-`S06` (מילים בקריינות ≤ `est_duration_sec × wps`) בלי לנצל את סובלנות ה-15%, וכל סצנה עומדת ב-`B05`. סך המילים בכל דוגמה נמוך מתקציב הקריינות של חלק 05 §12.1 (`0.9 × wps × target`: כ-32 / 65 / 130 מילים ל-15 / 30 / 60 שניות); ביט בודד יכול להגיע עד התקרה המלאה של `S06`.
- **ספירת מילים:** פיצול לפי רווחים. טוקן שאין בו אות, ספרה, `{…}`, `₪` או `%` (כמו "←" או "–") לא נספר.
- **תוכנית ביטים:** לפי `STRUCTURES` (חלק 05 §12.2). כל ביט זז לכל היותר בשנייה וחצי מהתוכנית, וסכום הביטים שווה בדיוק למשך היעד. בדוגמאות 3, 4 ו-5 ביט ההוק זז, וכל דוגמה מסבירה למה.
- **סצנות:** סכום משכי הסצנות שווה בדיוק למשך היעד, ושרשור ה-`vo_he` של הסצנות שווה ל-`vo_full_he`. כרטיס הסיום (2.5 שנ׳) ו-0.3 שנ׳ של זנב מתווספים ברינדור (`calculateMetadata`, חלק 05 §20), ולא נספרים בסטוריבורד.
- **הסצנה האחרונה בלי טקסט על המסך.** ההנעה לפעולה מוצגת בכרטיס הסיום, והקריינות של ביט ה-`cta` נשמעת מעל הסצנה האחרונה.
- **פרומפטים לתמונה:** סוג השוט והעדשה (כלל 10 בסטוריבורד, למשל "Close-up shot, 50mm."), הנושא והפעולה, המקום, התאורה, משפט צבעים אחד, עוגן הסגנון מ-`STYLE_ANCHORS` מילה במילה (חלק 05 §13.2; העוגן של `cinematic` לא קובע עדשה), שורת קומפוזיציה, והסיומת הקבועה `no text, no letters, no logos, no watermark`. אורך: 60–90 מילים.
- **פרומפטים לתנועה:** פעולה אחת שמתחילה מהפריים הראשון, ובסוף `single continuous shot, no cuts, no text`.
- **אף פנים של בעל העסק לא נוצרות ב-AI.** כשהסרטון מדבר בשם אדם אמיתי (היועצת, הרופאה), הפנים מגיעות רק מתמונה שהמשתמש העלה (`user_media` או `user_photo_animated`). בשאר הסצנות רואים ידיים, גב או את המקום.
- **ערכי הדגמה:** placeholder פתוח מקבל ערך הדגמה (`demo_placeholder_values`) רק לרינדור האנימטיק ולבדיקות. הערך הזה לא נכנס לשום תוצר של משתמש.
- **יכולות מודל בבדיקות הזהב:** `planVisualSources` רץ עם fixture קבוע של יכולות (`supported_durations: null`), ולכן `snapDuration` מעגל כלפי מעלה לשנייה שלמה (חלק 05 §14.1) והתוצאה לא תלויה בסנכרון המודלים. ערכי `Σ billed` בטבלאות התוצאות הצפויות מחושבים כך.

### 1.4 איך הדוגמאות נכנסות לפרומפט

`pickSampleScript(structure, nicheSlug)` בוחר דוגמה לפי המבנה, ואם יש כמה — לפי הנישה. הפרומפט מקבל רק את ה-`ScriptV1`, בתוך `<example_script>`, עם השורה "דוגמה למבנה ולרמה בלבד. לא מעתיקים ממנה תוכן." (חלק 05 §10.6). הקלט והסטוריבורד לא נשלחים למודל.

| `structure` | הדוגמה שנבחרת |
|---|---|
| `hpspc` | `restaurants-grill-30` |
| `bab` | `renovation-bathroom-30` |
| `pas` | `mortgage-mix-30` |
| `brand_story` | `dentists-brand-60` |
| `aida` | `nails-hanukkah-15` |
| `result_first` | `restaurants-grill-30` (נפילה ל-`hpspc`) |

```ts
// lib/ai/prompts/examples/index.ts
import { ScriptV1, StoryboardV1 } from "@/lib/ai/schemas";   // value (Zod schema) + type of the same name
import restaurantsScript from "./restaurants-grill-30.script.json";
import restaurantsStoryboard from "./restaurants-grill-30.storyboard.json";
// … same for the other four samples

export interface SampleScriptEntry {
  id: "restaurants-grill-30" | "renovation-bathroom-30" | "mortgage-mix-30" | "dentists-brand-60" | "nails-hanukkah-15";
  nicheSlug: string;
  structure: ScriptV1["structure"];
  durationSec: ScriptV1["target_duration_sec"];
  script: ScriptV1;
  storyboard: StoryboardV1;
}

export const SAMPLE_SCRIPTS: readonly SampleScriptEntry[] = [
  { id: "restaurants-grill-30", nicheSlug: "restaurants", structure: "hpspc", durationSec: 30,
    script: ScriptV1.parse(restaurantsScript), storyboard: StoryboardV1.parse(restaurantsStoryboard) },
  // …
] as const;

export function pickSampleScript(structure: ScriptV1["structure"], nicheSlug?: string | null): ScriptV1 {
  const sameStructure = SAMPLE_SCRIPTS.filter((s) => s.structure === structure);
  const pick = sameStructure.find((s) => s.nicheSlug === nicheSlug) ?? sameStructure[0]
    ?? SAMPLE_SCRIPTS.find((s) => s.structure === "hpspc")!;
  return pick.script;
}
```

ה-`parse` בזמן טעינת המודול מבטיח שדוגמה שבורה מפילה את הבנייה, ולא נשלחת בשקט לפרומפט.

### קריטריוני קבלה
- [ ] חמשת זוגות הקבצים קיימים ב-`lib/ai/prompts/examples/` וזהים, תו בתו, ל-JSON בנספח (בדיקה שמשווה מול `tests/golden/appendix-d/source.json`, שנוצר מהנספח פעם אחת).
- [ ] `pickSampleScript("result_first", "dentists")` מחזיר את דוגמת `hpspc`; `pickSampleScript("bab", "restaurants")` מחזיר את דוגמת השיפוצים.
- [ ] אין אף שם עסק, כתובת או טלפון מהדוגמאות בקוד שאינו fixture או דמו (grep ב-CI על "גחלת – גריל בר", "שיפוצי הכרמל", "יסודות – ייעוץ", "מרפאת שיניים נווה", "סטודיו גוונים").

## §2. החוזה של קובץ הקלט

קובץ הקלט מכיל את כל מה שהפרומפטים של התסריט והסטוריבורד מקבלים, כדי שאפשר יהיה להריץ אותם מחדש מאותה נקודה (`PromptTester`, `scripts/eval-prompts.ts`) ולהשוות. השדות שמות אחד לאחד לעמודות במסד ולשדות של `buildUser` בחלק 05.

```ts
// tests/fixtures/scripts/types.ts
import type { z } from "@/lib/zod";
import type { ProjectBrief } from "@/lib/api/contracts/projects";
import type { Database } from "@/lib/supabase/database.types";
import type { ScriptV1, StoryboardV1 } from "@/lib/ai/schemas";
import type { SampleScriptEntry } from "@/lib/ai/prompts/examples";
import type { CaptionPresetId } from "@/remotion/captions/presets";
type E = Database["public"]["Enums"];
type MusicMood = StoryboardV1["music"]["mood"];

export interface SampleFixtureInput {
  id: SampleScriptEntry["id"];
  niche_slug: string;                                   // niches.slug
  structure: ScriptV1["structure"];
  words_per_second: number;                             // app_settings.hebrew_wps.default at fixture time (2.4)
  project: {
    video_type: E["video_type"]; goal: E["hook_goal"]; platforms: E["platform"][];
    primary_aspect: E["aspect_ratio"]; extra_aspects: E["aspect_ratio"][];
    duration_target_sec: 15 | 30 | 45 | 60; quality_tier: E["quality_tier"]; visual_mix: E["visual_mix"];
    visual_style: StoryboardV1["visual_style"]; audience_gender: E["audience_gender"]; voice_gender: E["voice_gender"];
    register: E["register"]; voice_speed: number; caption_preset: CaptionPresetId;
    music_mode: "library" | "generate" | "none"; music_mood: MusicMood | null;
  };
  business: {                                           // business_profiles subset
    business_name: string; city: string | null; services: { name_he: string; gender: "m" | "f" }[];
    usp_he: string | null; phone: string | null; whatsapp: string | null; address: string | null;
    website_url: string | null; instagram_url: string | null;
  };
  facts: { key: string; label_he: string; value: string }[];   // confirmed business_profiles.facts
  brief: z.infer<typeof ProjectBrief>;                          // projects.brief (all keys optional, part 04 §19.3)
  brand_kit: { colors: { primary: string; secondary: string; accent: string; text: string };
               caption_preset: CaptionPresetId; shekel_format: "prefix" | "suffix" };
  chosen_hook: { id: string; text_he: string; hook_type_slug: string; visual_direction_he: string };  // hooks row, copied verbatim from /seed/hooks.json
  storyboard_ctx: {
    aspect_ratio: E["aspect_ratio"];
    allowed_visual_sources: E["visual_source"][];               // plan.ts (חלק 05 §14.1)
    max_ai_clip_seconds: number;                                // DERIVED by plan.ts (part 05 §14.1), not a plans.limits key
    user_media: { n: number; kind: "upload_image" | "upload_video"; description_he: string | null }[];
    contact: ("phone" | "whatsapp" | "website" | "address" | "instagram")[];
  };
  demo_placeholder_values: Record<string, string>;          // {מחיר: "149"} — demo render and tests only
  demo_placeholder_values_spoken: Record<string, string>;   // the same values as spoken words, for the TTS golden
}
```

שדות שקיימים רק ב-fixture הם נתוני בדיקה, לא עמודות במסד: `demo_placeholder_values`, `demo_placeholder_values_spoken`, `words_per_second` (הערך של `hebrew_wps.default` בזמן כתיבת ה-fixture, 2.4), ומפתחות העובדות `google_reviews`, `featured_project`, `bathroom_duration`, `quote_turnaround`, `simulation`, `years_experience`, `hanukkah_hours` ו-`gel_price`. המפתחות `google_rating` ו-`license_number` הם המפתחות הקנוניים של `business_profiles.facts[].key`, שמהם `{דירוג}` ו-`{מספר_רישיון}` מתמלאים אוטומטית (`PLACEHOLDERS`, חלק 05 §8.2) ושער העובדות מאשר מהם מספרים (חלק 03 §6.12, כלל 4).

### קריטריוני קבלה
- [ ] `SampleFixtureInput` מאומת ב-Zod (`tests/fixtures/scripts/schema.ts`) בכל טעינה, וה-`brief` עובר את `ProjectBrief` של חלק 04 §19.3 (כל המפתחות שם אופציונליים).
- [ ] כל `chosen_hook.id` קיים ב-`seed/hooks.json`, וה-`text_he`, ה-`hook_type_slug` וה-`visual_direction_he` שלו זהים לזרע (בדיקה שקוראת את הזרע).

## §3. דוגמה 1 — גריל בר שכונתי: רילס של 30 שניות (`restaurants-grill-30`)

### 3.1 הבריף

> "גריל בר שכונתי בפתח תקווה. הכול נצלה על גחלים פתוחות מול הסועדים, פיתות מהטאבון, סלטים חופשי לשולחן ושיפודים לבחירה. רוצים למלא שולחנות באמצע השבוע. המחיר של הארוחה הזוגית עוד לא סופי."

| שדה | ערך |
|---|---|
| עסק | גחלת – גריל בר שכונתי, פתח תקווה (בדיוני) |
| נישה | `restaurants` · `compliance_flag = other` (כשרות רק עם תעודה; דירוגים רק אמיתיים) |
| סוג, מטרה, פלטפורמות | `reel_hook` · `sales` · רילס וטיקטוק |
| משך, פורמט, מבנה | 30 שנ׳ · 9:16 · `hpspc` |
| פנייה, קול, רמה | רבים · קריין · `casual` |
| ויז׳ואל ואיכות | `smart` (משולב), `standard`, סגנון `cinematic`, תקרת קליפים 15 שנ׳ |
| ערכת מותג | כתוביות `bold-pop` · `shekel_format = suffix` ("149 ₪") |
| הנעה | `whatsapp`, עם הודעה מוכנה "היי, ראינו את הסרטון ורוצים שולחן להערב" |
| עובדות מאושרות | דירוג בגוגל 4.8 · 1,240 ביקורות |
| נתון חסר | מחיר הארוחה הזוגית ← `{מחיר}` (ערך הדגמה: 149) |

### 3.2 ההוק

`restaurants-01` · `pattern-interrupt` (שבירת דפוס): **"אל תבואו אלינו רעבים. ברצינות."**
ההוק נלקח כמו שהוא (דמיון 1.0). הוא הופך את הציפייה ("בואו אלינו") ומבטיח בלי מילה אחת על מחיר או איכות. בגרסה שעל המסך נשאר רק החצי הראשון, "אל תבואו אלינו רעבים.", כי ה"ברצינות" עובד רק בקול. המבנה `hpspc` נבחר לפי סוג הסרטון (`reel_hook`), כי לסוג ההוק אין מבנה מועדף (חלק 05 §12.3).

### 3.3 הקלט (`tests/fixtures/scripts/restaurants-grill-30.input.json`)

```json
{
  "id": "restaurants-grill-30",
  "niche_slug": "restaurants",
  "structure": "hpspc",
  "words_per_second": 2.4,
  "project": {
    "video_type": "reel_hook",
    "goal": "sales",
    "platforms": [
      "reels",
      "tiktok"
    ],
    "primary_aspect": "9:16",
    "extra_aspects": [],
    "duration_target_sec": 30,
    "quality_tier": "standard",
    "visual_mix": "smart",
    "visual_style": "cinematic",
    "audience_gender": "plural",
    "voice_gender": "male",
    "register": "casual",
    "voice_speed": 1.0,
    "caption_preset": "bold-pop",
    "music_mode": "library",
    "music_mood": "energetic"
  },
  "business": {
    "business_name": "גחלת – גריל בר שכונתי",
    "city": "פתח תקווה",
    "services": [
      {
        "name_he": "ארוחה זוגית מהגריל",
        "gender": "f"
      },
      {
        "name_he": "שיפודים על גחלים",
        "gender": "m"
      }
    ],
    "usp_he": "הכול נצלה על גחלים פתוחות, מול הסועדים",
    "phone": "050-1234567",
    "whatsapp": "050-1234567",
    "address": "רחוב ההגנה, פתח תקווה",
    "website_url": null,
    "instagram_url": null
  },
  "facts": [
    {
      "key": "google_rating",
      "label_he": "דירוג בגוגל",
      "value": "4.8"
    },
    {
      "key": "google_reviews",
      "label_he": "ביקורות בגוגל",
      "value": "1,240"
    }
  ],
  "brief": {
    "focus_service": "ארוחה זוגית מהגריל",
    "notes": "פיתות מטאבון, סלטים חופשי לשולחן, שיפודים לבחירה. אווירה של שכונה.",
    "offer": null,
    "cta": {
      "type": "whatsapp",
      "target": "+972501234567",
      "keyword": null,
      "prefill_he": "היי, ראינו את הסרטון ורוצים שולחן להערב",
      "headline_he": null
    }
  },
  "brand_kit": {
    "colors": {
      "primary": "#C8442B",
      "secondary": "#1B1410",
      "accent": "#F2B134",
      "text": "#FFFFFF"
    },
    "caption_preset": "bold-pop",
    "shekel_format": "suffix"
  },
  "chosen_hook": {
    "id": "restaurants-01",
    "text_he": "אל תבואו אלינו רעבים. ברצינות.",
    "hook_type_slug": "pattern-interrupt",
    "visual_direction_he": "מגש ענק נוחת בחבטה על שולחן עץ בהילוך איטי, אדים עולים"
  },
  "storyboard_ctx": {
    "aspect_ratio": "9:16",
    "allowed_visual_sources": [
      "ai_image_kenburns",
      "user_media",
      "brand_card",
      "ai_clip",
      "user_photo_animated"
    ],
    "max_ai_clip_seconds": 15,
    "user_media": [],
    "contact": [
      "phone",
      "whatsapp",
      "address"
    ]
  },
  "demo_placeholder_values": {
    "מחיר": "149"
  },
  "demo_placeholder_values_spoken": {
    "מחיר": "מאה ארבעים ותשע"
  }
}
```

### 3.4 `ScriptV1` (`lib/ai/prompts/examples/restaurants-grill-30.script.json`)

```json
{
  "title_he": "רילס גריל בר: ארוחה זוגית מהגחלים",
  "video_type": "reel_hook",
  "goal": "sales",
  "structure": "hpspc",
  "target_duration_sec": 30,
  "audience_gender": "plural",
  "voice_gender": "male",
  "register": "casual",
  "hook": {
    "text_he": "אל תבואו אלינו רעבים. ברצינות.",
    "onscreen_he": "אל תבואו אלינו רעבים.",
    "hook_type_slug": "pattern-interrupt",
    "source_hook_id": "restaurants-01",
    "visual_direction_he": "מגש מעורב ענק נוחת על שולחן עץ בהילוך איטי, אדים ועשן עולים מהפריים הראשון"
  },
  "beats": [
    {
      "index": 0,
      "role": "hook",
      "vo_he": "אל תבואו אלינו רעבים. ברצינות.",
      "onscreen_text_he": "אל תבואו אלינו רעבים.",
      "est_duration_sec": 3,
      "visual_idea_he": "מגש מעורב ענק נוחת על שולחן עץ, אדים ועשן עולים"
    },
    {
      "index": 1,
      "role": "problem",
      "vo_he": "נמאס לכם מצלחת ענקית עם מנה קטנה במרכז?",
      "onscreen_text_he": "צלחת ענקית. מנה קטנה.",
      "est_duration_sec": 4,
      "visual_idea_he": "מנה זעירה על צלחת לבנה ענקית, אור קר ואפור"
    },
    {
      "index": 2,
      "role": "solution",
      "vo_he": "אז ככה זה אצלנו: הכול נצלה על גחלים, ממש מול העיניים שלכם.",
      "onscreen_text_he": "הכול על גחלים. מול העיניים.",
      "est_duration_sec": 6,
      "visual_idea_he": "שיפודים מסתובבים על גחלים, ניצוצות עפים, ידי הגריליסט מברישות שמן"
    },
    {
      "index": 3,
      "role": "solution",
      "vo_he": "ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים.",
      "onscreen_text_he": "ארוחה זוגית מלאה: {מחיר} ₪",
      "est_duration_sec": 6,
      "visual_idea_he": "צילום מלמעלה: השולחן מתמלא בסלטים, פיתות ושיפודים, ידיים מושיטות מכל הכיוונים"
    },
    {
      "index": 4,
      "role": "proof",
      "vo_he": "ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות.",
      "onscreen_text_he": "4.8 בגוגל, 1,240 ביקורות",
      "est_duration_sec": 6,
      "visual_idea_he": "חברים צוחקים ליד שולחן מלא, אחד מהנהן עם פה מלא"
    },
    {
      "index": 5,
      "role": "cta",
      "vo_he": "שולחן להערב? שלחו לנו הודעה בוואטסאפ.",
      "onscreen_text_he": "",
      "est_duration_sec": 5,
      "visual_idea_he": "חזית הגריל בלילה, שלט ניאון ריק נדלק, אנשים בשולחנות בחוץ"
    }
  ],
  "cta": {
    "type": "whatsapp",
    "text_he": "שולחן להערב? שלחו וואטסאפ",
    "vo_he": "שולחן להערב? שלחו לנו הודעה בוואטסאפ."
  },
  "vo_full_he": "אל תבואו אלינו רעבים. ברצינות. נמאס לכם מצלחת ענקית עם מנה קטנה במרכז? אז ככה זה אצלנו: הכול נצלה על גחלים, ממש מול העיניים שלכם. ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים. ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות. שולחן להערב? שלחו לנו הודעה בוואטסאפ.",
  "vo_tts_he": "אל תבואו אלינו רעבים. ברצינות. נמאס לכם מצלחת ענקית עם מנה קטנה במרכז? אז ככה זה אצלנו: הכול נִצְלֶה על גחלים, ממש מול העיניים שלכם. ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב{מחיר} שקל. ויוצאים מפוצצים. ולא רק אנחנו אומרים: ארבע נקודה שמונה בגוגל, מאלף מאתיים וארבעים ביקורות. שולחן להערב? שלחו לנו הודעה בוואטסאפ.",
  "post_caption_he": "סלטים חופשי לשולחן, פיתות חמות מהטאבון ושיפודים שנצלים על גחלים מול העיניים.\n\nשולחן להערב? שלחו לנו וואטסאפ, הקישור בביו.",
  "hashtags_he": [
    "#גריל",
    "#פתחתקווה",
    "#שיפודים",
    "#ארוחהזוגית",
    "#מסעדותבמרכז"
  ],
  "compliance": {
    "flags": [
      "price_claim"
    ],
    "disclaimers_he": [],
    "needs_user_facts": [
      "{מחיר}"
    ]
  }
}
```

### 3.5 `StoryboardV1` (`lib/ai/prompts/examples/restaurants-grill-30.storyboard.json`)

```json
{
  "aspect_ratio": "9:16",
  "total_duration_sec": 30,
  "visual_style": "cinematic",
  "scenes": [
    {
      "index": 0,
      "beat_index": 0,
      "duration_sec": 3,
      "visual_source": "ai_clip",
      "image_prompt_en": "Low-angle close-up shot, 50mm. A huge mixed-grill platter with skewers, grilled vegetables and fries lands on a rustic wooden table, steam and charcoal smoke rising. Busy neighborhood grill bar in Israel at night. Warm tungsten light with ember glow. Subtle terracotta and warm amber accents in plates and napkins. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, platter in the lower third, upper area clear. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The platter drops onto the table in slow motion with a small bounce, steam bursts upward, quick push-in toward the meat, single continuous shot, no cuts, no text",
      "negative_prompt_en": "extra hands, messy table, raw meat, cartoon look",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.62
      },
      "onscreen_text_he": "אל תבואו אלינו רעבים.",
      "text_position": "center",
      "vo_he": "אל תבואו אלינו רעבים. ברצינות.",
      "transition_in": "cut",
      "sfx": "impact",
      "kenburns": "none",
      "is_hook_scene": true,
      "hook_type_slug": "pattern-interrupt",
      "user_media_hint_he": null
    },
    {
      "index": 1,
      "beat_index": 1,
      "duration_sec": 4,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. A tiny portion of food centered on an oversized white plate, a single sprig of garnish, nothing else on the table. Minimalist fine-dining room with grey walls. Cold flat bluish light. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, plate in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Locked-off shot, a fork slowly pokes the tiny portion, slight push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "warm light, people, full plates",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.6
      },
      "onscreen_text_he": "צלחת ענקית. מנה קטנה.",
      "text_position": "center",
      "vo_he": "נמאס לכם מצלחת ענקית עם מנה קטנה במרכז?",
      "transition_in": "whip",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 2,
      "beat_index": 2,
      "duration_sec": 6,
      "visual_source": "ai_clip",
      "image_prompt_en": "Close-up shot, 50mm. Skewers of chicken, kebab and vegetables turning over glowing charcoal, sparks flying, the grill cook's hands brushing oil with a basting brush. Open charcoal grill facing the diners in an Israeli grill bar. Night ambience, ember glow as key light. Subtle warm amber accents in the cook's apron. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, skewers across the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Handheld close-up, sparks rising, the brush passes over the skewers, slight rack focus from the coals to the meat, single continuous shot, no cuts, no text",
      "negative_prompt_en": "burnt food, smoke covering the frame, extra hands",
      "camera": "handheld",
      "focal_point": {
        "x": 0.5,
        "y": 0.6
      },
      "onscreen_text_he": "הכול על גחלים. מול העיניים.",
      "text_position": "top",
      "vo_he": "אז ככה זה אצלנו: הכול נצלה על גחלים, ממש מול העיניים שלכם.",
      "transition_in": "cut",
      "sfx": "sizzle",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 3,
      "beat_index": 3,
      "duration_sec": 6,
      "visual_source": "ai_clip",
      "image_prompt_en": "Overhead top-down shot, 35mm. A wooden table filling with Israeli salads, hummus, hot taboon pitas, skewers and fries, several adult hands reaching in to share. Lively neighborhood grill bar. Warm evening light, vibrant natural colors. Subtle terracotta accents in the plates. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, table filling the frame, center slightly calmer. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Top-down locked camera, dishes are set down one after another, hands reach in and tear a pita, single continuous shot, no cuts, no text",
      "negative_prompt_en": "empty plates, messy spills, cartoon look",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "ארוחה זוגית מלאה: {מחיר} ₪",
      "text_position": "top",
      "vo_he": "ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 4,
      "beat_index": 4,
      "duration_sec": 6,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Medium shot, 35mm. Two adult friends laughing at a busy grill-bar table, one nodding with a full mouth, plates and pitas between them. Israeli neighborhood restaurant with string lights. Warm candid evening light. Subtle warm amber accents in the lights. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, faces in the middle third. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Gentle handheld drift toward the table as the friends laugh naturally, single continuous shot, no cuts, no text",
      "negative_prompt_en": "posed smiles, extra people in focus, phones in hand",
      "camera": "handheld",
      "focal_point": {
        "x": 0.45,
        "y": 0.5
      },
      "onscreen_text_he": "4.8 בגוגל, 1,240 ביקורות",
      "text_position": "top",
      "vo_he": "ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות.",
      "transition_in": "cut",
      "sfx": "pop",
      "kenburns": "pan_start",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 5,
      "beat_index": 5,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Wide shot, 24mm. Exterior of a small grill bar at night, a glowing blank neon sign without readable letters, adults sitting at outdoor tables. Israeli city street with warm streetlights. Night, warm neon glow. Subtle terracotta accents on the awning. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, entrance in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow dolly-in toward the entrance as the blank neon sign flickers on, single continuous shot, no cuts, no text",
      "negative_prompt_en": "readable signage, cars with license plates, empty street",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.6
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "שולחן להערב? שלחו לנו הודעה בוואטסאפ.",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    }
  ],
  "music": {
    "mood": "energetic",
    "energy": "high",
    "bpm_hint": 115,
    "beat_drop_at_sec": 3.0
  },
  "end_card": {
    "headline_he": "שולחן להערב? שלחו וואטסאפ",
    "cta_type": "whatsapp",
    "show_logo": true,
    "contact_fields": [
      "whatsapp",
      "address"
    ]
  }
}
```

### 3.6 טבלת הסצנות

| זמן | ויז׳ואל | טקסט על המסך | קריינות |
|---|---|---|---|
| 0:00–0:03 | מגש מעורב ענק נוחת על שולחן עץ בהילוך איטי, אדים ועשן, זום-אין מהיר (קליפ) | אל תבואו אלינו רעבים. | אל תבואו אלינו רעבים. ברצינות. |
| 0:03–0:07 | מנה זעירה במרכז צלחת לבנה ענקית, אור קר (תמונה בתנועה) | צלחת ענקית. מנה קטנה. | נמאס לכם מצלחת ענקית עם מנה קטנה במרכז? |
| 0:07–0:13 | שיפודים מסתובבים על גחלים, ניצוצות, ידיים מברישות שמן (קליפ) | הכול על גחלים. מול העיניים. | אז ככה זה אצלנו: הכול נצלה על גחלים, ממש מול העיניים שלכם. |
| 0:13–0:19 | צילום מלמעלה: השולחן מתמלא בסלטים, פיתות ושיפודים, ידיים מכל הכיוונים (קליפ) | ארוחה זוגית מלאה: {מחיר} ₪ | ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים. |
| 0:19–0:25 | שני חברים צוחקים ליד שולחן מלא, אחד מהנהן עם פה מלא (תמונה בתנועה) | 4.8 בגוגל, 1,240 ביקורות | ולא רק אנחנו אומרים: 4.8 בגוגל, מ-1,240 ביקורות. |
| 0:25–0:30 | חזית הגריל בלילה, שלט ניאון ריק נדלק, סועדים בחוץ (תמונה בתנועה); אחריה כרטיס הסיום | — | שולחן להערב? שלחו לנו הודעה בוואטסאפ. |
| 0:30–0:32.5 | כרטיס סיום (`EndCard`): לוגו, וואטסאפ + כתובת | שולחן להערב? שלחו וואטסאפ | — (המוזיקה נסגרת) |

### 3.7 מה הדוגמה מלמדת, ומה הבדיקות מצפות לראות

- **placeholder פתוח, שלוש צורות.** על המסך: `{מחיר} ₪` (לפי `shekel_format = suffix`). בקריינות לתצוגה: `ב-{מחיר} ₪` (לפי `shekel_format`). בטקסט להקראה: `ב{מחיר} שקל`, בלי מקף, כי אחרי ההצבה המספר נקרא כמילים והתחילית נצמדת ("במאה ארבעים ותשע שקל"). `{מחיר}` מופיע ב-`needs_user_facts`, ולכן `POST /generate` מחזיר `422 MISSING_FACTS` עד שממלאים אותו ב-`MissingFactsPanel` (חלק 03 §6.12).
- **עובדות במקום המצאות.** "4.8 בגוגל" ו-"1,240 ביקורות" עוברים את `S09` רק כי הם ב-`facts`. בתסריט המקורי של המחקר הופיע "אנחנו עונים תוך דקות". המשפט הוסר, כי זמן תגובה הוא טענה ואין לו עובדה.
- **רמת `casual`:** "ברצינות", "ויוצאים מפוצצים", "שקל" ביחיד בהקראה. בלי סלנג כבד.
- **רענון קשב** בביט הפתרון הראשון: "אז ככה זה אצלנו:".
- **ניקוד חלקי:** רק "נִצְלֶה" (כדי שלא ייקרא "נַצְלֶה"). שאר הטקסט בלי ניקוד.
- **בלי "כשר".** הבריף לא מזכיר כשרות, ולכן הטקסט לא מזכיר אותה (`HE021`).
- **קליפים:** שלוש סצנות `ai_clip` (הוק, גריל, שולחן) = 15 שניות, בדיוק התקרה של `smart` ב-30 שניות. השאר תמונות בתנועה.

**תוצאות צפויות (golden):**

| בדיקה | צפוי |
|---|---|
| `validateScriptV1` / `validateStoryboardV1` | 0 שגיאות, 0 אזהרות |
| `detectFactSlots` על התסריט | 3 חריצים: `{מחיר}` (placeholder, פתוח), "4.8" (מאושר מ-`google_rating`), "1,240" (מאושר מ-`google_reviews`) |
| `normalizeForTts(vo_full_he)` אחרי הצבת 149 | שווה ל-`vo_tts_he` אחרי הצבת "מאה ארבעים ותשע", בהשוואה בלי ניקוד (§8.2) |
| `planVisualSources` | אף סצנה לא יורדת מדרגה; `Σ billed = 15` |
| `paginate` בסגנון `bold-pop` | עד 3 מילים בעמוד; "4.8", "1,240" ו-"{מחיר} ₪" אף פעם לא נשברים בין עמודים; הפלט נשמר כ-snapshot |

### קריטריוני קבלה
- [ ] התסריט והסטוריבורד עוברים את כל הבדיקות בלי שגיאה ובלי אזהרה.
- [ ] בעורך, הסצנה הרביעית מציגה את `{מחיר}` כ-`PlaceholderChip`, והכפתור "צרו את הסרטון" חסום עד שממלאים אותו.
- [ ] באנימטיק הדמו מופיע "149 ₪" על המסך, ובקריינות נשמע "במאה ארבעים ותשע שקל".

## §4. דוגמה 2 — קבלן שיפוצים: לפני ואחרי של חדר רחצה, 30 שניות (`renovation-bathroom-30`)

### 4.1 הבריף

> "קבלן שיפוצים בחיפה והקריות, מתמחים בחדרי רחצה. יש לנו תמונות לפני ואחרי של חדר רחצה משנות ה-80 בקריית ביאליק, מאותה זווית, וסרטון קצר מהטלפון של הפטיש על האריח הישן. שיפוץ רגיל של חדר רחצה לוקח 10 ימי עבודה. מי ששולח תמונות של החדר מקבל הצעת מחיר תוך 24 שעות."

| שדה | ערך |
|---|---|
| עסק | שיפוצי הכרמל, חיפה והקריות (בדיוני) |
| נישה | `renovation-contractors` · `compliance_flag = other` (מחירים ומשכים רק אמיתיים) |
| סוג, מטרה, פלטפורמות | `reel_hook` · `leads` · רילס, טיקטוק, פייסבוק |
| משך, פורמט, מבנה | 30 שנ׳ · 9:16 ראשי + 1:1 נוסף · `bab` |
| פנייה, קול, רמה | רבים · קריין · `warm` |
| ויז׳ואל ואיכות | `smart`, `standard`, סגנון `before_after`, תקרת קליפים 15 שנ׳ |
| ערכת מותג | כתוביות `clean-box` · `shekel_format = prefix` |
| הנעה | `whatsapp`, עם הודעה מוכנה "היי, ראיתי את הסרטון על שיפוץ חדר רחצה. הנה תמונות של החדר" |
| עובדות מאושרות | 10 ימי עבודה · הצעת מחיר תוך 24 שעות · הפרויקט: חדר רחצה מקורי משנות ה-80 |
| העלאות | סרטון הפטיש (`upload_video`), תמונת "לפני" ותמונת "אחרי" (`upload_image`) |

### 4.2 ההוק

`renovation-contractors-04` · `before-after` (לפני / אחרי): **"אמבטיה משנות ה-80 ← 10 ימי עבודה"**
על המסך ההוק נשאר כמו בספרייה, עם החץ. בקריינות החץ הופך לנקודה: "אמבטיה משנות ה-80. 10 ימי עבודה." (דמיון 1.0, כי החץ לא נספר בטריגרמות). סוג ההוק `before-after` קובע את המבנה `bab` (חלק 05 §12.3). בתסריט של המחקר ההוק היה "האמבטיה הזאת עמדה ככה 40 שנה". הוא לא נבחר, כי "40 שנה" לא מופיע בעובדות, וכי ההוק בספרייה כבר עושה את אותה עבודה עם מספר שכן מאושר.

### 4.3 הקלט (`tests/fixtures/scripts/renovation-bathroom-30.input.json`)

```json
{
  "id": "renovation-bathroom-30",
  "niche_slug": "renovation-contractors",
  "structure": "bab",
  "words_per_second": 2.4,
  "project": {
    "video_type": "reel_hook",
    "goal": "leads",
    "platforms": [
      "reels",
      "tiktok",
      "facebook"
    ],
    "primary_aspect": "9:16",
    "extra_aspects": [
      "1:1"
    ],
    "duration_target_sec": 30,
    "quality_tier": "standard",
    "visual_mix": "smart",
    "visual_style": "before_after",
    "audience_gender": "plural",
    "voice_gender": "male",
    "register": "warm",
    "voice_speed": 1.0,
    "caption_preset": "clean-box",
    "music_mode": "library",
    "music_mood": "inspiring"
  },
  "business": {
    "business_name": "שיפוצי הכרמל",
    "city": "חיפה",
    "services": [
      {
        "name_he": "שיפוץ חדר רחצה",
        "gender": "m"
      },
      {
        "name_he": "איטום",
        "gender": "m"
      }
    ],
    "usp_he": "לוח זמנים חתום בחוזה ועדכון יומי בוואטסאפ",
    "phone": "050-1234567",
    "whatsapp": "050-1234567",
    "address": "חיפה והקריות",
    "website_url": null,
    "instagram_url": null
  },
  "facts": [
    {
      "key": "bathroom_duration",
      "label_he": "משך שיפוץ חדר רחצה סטנדרטי",
      "value": "10 ימי עבודה"
    },
    {
      "key": "quote_turnaround",
      "label_he": "זמן עד הצעת מחיר",
      "value": "24 שעות"
    },
    {
      "key": "featured_project",
      "label_he": "הפרויקט בסרטון",
      "value": "חדר רחצה מקורי משנות ה-80, קריית ביאליק"
    }
  ],
  "brief": {
    "focus_service": "שיפוץ חדר רחצה",
    "notes": "לפני: אריחים ורודים, רטיבות מתחת לריצוף, ניקוז שנסתם. אצלנו: לוח זמנים חתום בחוזה, עדכון יומי עם תמונות בוואטסאפ, אחריות בכתב על האיטום. תמונות לפני ואחרי אמיתיות מהפרויקט.",
    "offer": null,
    "cta": {
      "type": "whatsapp",
      "target": "+972501234567",
      "keyword": null,
      "prefill_he": "היי, ראיתי את הסרטון על שיפוץ חדר רחצה. הנה תמונות של החדר",
      "headline_he": null
    }
  },
  "brand_kit": {
    "colors": {
      "primary": "#1F3A5F",
      "secondary": "#0D1520",
      "accent": "#E8A33D",
      "text": "#FFFFFF"
    },
    "caption_preset": "clean-box",
    "shekel_format": "prefix"
  },
  "chosen_hook": {
    "id": "renovation-contractors-04",
    "text_he": "אמבטיה משנות ה-80 ← 10 ימי עבודה",
    "hook_type_slug": "before-after",
    "visual_direction_he": "פטיש מנפץ אריח ורוד, ענן אבק קופא בפריים"
  },
  "storyboard_ctx": {
    "aspect_ratio": "9:16",
    "allowed_visual_sources": [
      "ai_image_kenburns",
      "user_media",
      "brand_card",
      "ai_clip",
      "user_photo_animated"
    ],
    "max_ai_clip_seconds": 15,
    "user_media": [
      {
        "n": 1,
        "kind": "upload_video",
        "description_he": "פטיש שובר אריח ורוד, צולם בטלפון"
      },
      {
        "n": 2,
        "kind": "upload_image",
        "description_he": "חדר הרחצה לפני השיפוץ"
      },
      {
        "n": 3,
        "kind": "upload_image",
        "description_he": "אותו חדר אחרי השיפוץ, מאותה זווית"
      }
    ],
    "contact": [
      "phone",
      "whatsapp",
      "address"
    ]
  },
  "demo_placeholder_values": {},
  "demo_placeholder_values_spoken": {}
}
```

### 4.4 `ScriptV1` (`lib/ai/prompts/examples/renovation-bathroom-30.script.json`)

```json
{
  "title_he": "רילס לפני ואחרי: חדר רחצה משנות ה-80",
  "video_type": "reel_hook",
  "goal": "leads",
  "structure": "bab",
  "target_duration_sec": 30,
  "audience_gender": "plural",
  "voice_gender": "male",
  "register": "warm",
  "hook": {
    "text_he": "אמבטיה משנות ה-80. 10 ימי עבודה.",
    "onscreen_he": "אמבטיה משנות ה-80 ← 10 ימי עבודה",
    "hook_type_slug": "before-after",
    "source_hook_id": "renovation-contractors-04",
    "visual_direction_he": "פטיש פוגע באריח ורוד משנות ה-80, ענן אבק קופא בפריים, ומיד מעבר חד לאותה זווית אחרי השיפוץ"
  },
  "beats": [
    {
      "index": 0,
      "role": "hook",
      "vo_he": "אמבטיה משנות ה-80. 10 ימי עבודה.",
      "onscreen_text_he": "אמבטיה משנות ה-80 ← 10 ימי עבודה",
      "est_duration_sec": 3,
      "visual_idea_he": "פטיש פוגע באריח ורוד ישן, ענן אבק"
    },
    {
      "index": 1,
      "role": "story",
      "vo_he": "אריחים ורודים, רטיבות מתחת לריצוף, וניקוז שנסתם כל שבוע.",
      "onscreen_text_he": "ככה זה התחיל.",
      "est_duration_sec": 5,
      "visual_idea_he": "התמונה שלכם של החדר לפני השיפוץ"
    },
    {
      "index": 2,
      "role": "proof",
      "vo_he": "ככה היא נראית היום. אותה זווית בדיוק, בלי פילטרים.",
      "onscreen_text_he": "אחרי: אותה זווית בדיוק",
      "est_duration_sec": 6,
      "visual_idea_he": "התמונה שלכם של אותו חדר אחרי, מאותה זווית"
    },
    {
      "index": 3,
      "role": "solution",
      "vo_he": "וזה החלק החשוב: לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ.",
      "onscreen_text_he": "לוח זמנים חתום. עדכון יומי.",
      "est_duration_sec": 6,
      "visual_idea_he": "הקבלן מצלם את האיטום בטלפון כדי לשלוח עדכון"
    },
    {
      "index": 4,
      "role": "solution",
      "vo_he": "ואחריות בכתב על האיטום. לא בעל פה.",
      "onscreen_text_he": "אחריות בכתב על האיטום",
      "est_duration_sec": 5,
      "visual_idea_he": "פלס מונח על אריחים חדשים, הבועה באמצע"
    },
    {
      "index": 5,
      "role": "cta",
      "vo_he": "שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך 24 שעות.",
      "onscreen_text_he": "",
      "est_duration_sec": 5,
      "visual_idea_he": "בעל דירה מצלם בטלפון את חדר הרחצה הישן שלו"
    }
  ],
  "cta": {
    "type": "whatsapp",
    "text_he": "שלחו תמונות של החדר בוואטסאפ",
    "vo_he": "שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך 24 שעות."
  },
  "vo_full_he": "אמבטיה משנות ה-80. 10 ימי עבודה. אריחים ורודים, רטיבות מתחת לריצוף, וניקוז שנסתם כל שבוע. ככה היא נראית היום. אותה זווית בדיוק, בלי פילטרים. וזה החלק החשוב: לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ. ואחריות בכתב על האיטום. לא בעל פה. שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך 24 שעות.",
  "vo_tts_he": "אמבטיה משנות השמונים. עשרה ימי עבודה. אריחים ורודים, רטיבות מתחת לריצוף, וניקוז שנסתם כל שבוע. ככה היא נראית היום. אותה זווית בדיוק, בלי פילטרים. וזה החלק החשוב: לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ. ואחריות בכתב על האיטום. לא בעל פה. שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך עשרים וארבע שעות.",
  "post_caption_he": "מאריחים ורודים ורטיבות מתחת לריצוף לחדר רחצה שנעים להיכנס אליו. לוח זמנים חתום בחוזה, עדכון יומי בוואטסאפ ואחריות בכתב על האיטום.\n\nשלחו לנו שלוש תמונות של החדר, והצעת מחיר אצלכם תוך 24 שעות.",
  "hashtags_he": [
    "#שיפוץאמבטיה",
    "#שיפוציםבחיפה",
    "#לפניואחרי",
    "#חדררחצה",
    "#קבלןשיפוצים"
  ],
  "compliance": {
    "flags": [
      "results_claim"
    ],
    "disclaimers_he": [],
    "needs_user_facts": []
  }
}
```

### 4.5 `StoryboardV1` (`lib/ai/prompts/examples/renovation-bathroom-30.storyboard.json`)

```json
{
  "aspect_ratio": "9:16",
  "total_duration_sec": 30,
  "visual_style": "before_after",
  "scenes": [
    {
      "index": 0,
      "beat_index": 0,
      "duration_sec": 3,
      "visual_source": "user_media",
      "image_prompt_en": "",
      "motion_prompt_en": "",
      "negative_prompt_en": "",
      "camera": "handheld",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "אמבטיה משנות ה-80 ← 10 ימי עבודה",
      "text_position": "top",
      "vo_he": "אמבטיה משנות ה-80. 10 ימי עבודה.",
      "transition_in": "cut",
      "sfx": "impact",
      "kenburns": "none",
      "is_hook_scene": true,
      "hook_type_slug": "before-after",
      "user_media_hint_he": "סרטון קצר מהטלפון: פטיש פוגע באריח הישן, מקרוב, בלי פנים בפריים"
    },
    {
      "index": 1,
      "beat_index": 1,
      "duration_sec": 5,
      "visual_source": "user_media",
      "image_prompt_en": "",
      "motion_prompt_en": "",
      "negative_prompt_en": "",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "ככה זה התחיל.",
      "text_position": "center",
      "vo_he": "אריחים ורודים, רטיבות מתחת לריצוף, וניקוז שנסתם כל שבוע.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": "תמונה של חדר הרחצה לפני השיפוץ, מגובה העיניים, מהפתח"
    },
    {
      "index": 2,
      "beat_index": 2,
      "duration_sec": 6,
      "visual_source": "user_photo_animated",
      "image_prompt_en": "",
      "motion_prompt_en": "Slow push-in on the renovated bathroom, a soft light shimmer moves across the glass shower panel, a towel sways slightly, single continuous shot, no cuts, no text",
      "negative_prompt_en": "changing tiles, added objects, people",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "אחרי: אותה זווית בדיוק",
      "text_position": "center",
      "vo_he": "ככה היא נראית היום. אותה זווית בדיוק, בלי פילטרים.",
      "transition_in": "flash",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": "תמונה של אותו חדר אחרי השיפוץ, מאותה זווית ומאותו גובה"
    },
    {
      "index": 3,
      "beat_index": 3,
      "duration_sec": 6,
      "visual_source": "ai_clip",
      "image_prompt_en": "Medium close-up shot, 35mm. A contractor in a grey work T-shirt photographs a freshly waterproofed shower corner with a smartphone, the phone screen facing away from the camera. Israeli apartment bathroom mid-renovation, bare walls and tools. Even neutral daylight. Subtle deep navy accents in the work gloves. Consistent documentary framing, eye-level camera, even neutral lighting, same lens and angle suitable for a before and after comparison. Vertical 9:16 frame, hands and phone in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Handheld medium close-up, the contractor raises the phone and takes a photo, natural weight in the movement, single continuous shot, no cuts, no text",
      "negative_prompt_en": "visible phone screen, messy debris, extra people",
      "camera": "handheld",
      "focal_point": {
        "x": 0.55,
        "y": 0.55
      },
      "onscreen_text_he": "לוח זמנים חתום. עדכון יומי.",
      "text_position": "top",
      "vo_he": "וזה החלק החשוב: לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ.",
      "transition_in": "cut",
      "sfx": "camera_shutter",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 4,
      "beat_index": 4,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Macro close-up shot, 35mm. A plain spirit level without markings rests on freshly laid large grey porcelain tiles, the bubble perfectly centered, clean grout lines. Renovated Israeli bathroom. Even neutral daylight. Subtle warm amber accents in the level body. Consistent documentary framing, eye-level camera, even neutral lighting, same lens and angle suitable for a before and after comparison. Vertical 9:16 frame, level across the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow push-in toward the bubble as it settles in the center, single continuous shot, no cuts, no text",
      "negative_prompt_en": "measurement markings, cracked tiles, dirt",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.62
      },
      "onscreen_text_he": "אחריות בכתב על האיטום",
      "text_position": "center",
      "vo_he": "ואחריות בכתב על האיטום. לא בעל פה.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 5,
      "beat_index": 5,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Medium shot, 35mm. An adult homeowner holds up a smartphone and photographs an old bathroom with pink tiles, the phone screen facing away from the camera. Older Israeli apartment bathroom. Even neutral daylight. Subtle deep navy accents in the homeowner's shirt. Consistent documentary framing, eye-level camera, even neutral lighting, same lens and angle suitable for a before and after comparison. Vertical 9:16 frame, phone and hands in the middle. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Static camera, the homeowner taps the phone to take a photo and lowers it, single continuous shot, no cuts, no text",
      "negative_prompt_en": "visible phone screen, renovated room, extra people",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך 24 שעות.",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "zoom_out",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    }
  ],
  "music": {
    "mood": "inspiring",
    "energy": "medium",
    "bpm_hint": 100,
    "beat_drop_at_sec": 3.0
  },
  "end_card": {
    "headline_he": "שלחו תמונות של החדר בוואטסאפ",
    "cta_type": "whatsapp",
    "show_logo": true,
    "contact_fields": [
      "whatsapp",
      "phone"
    ]
  }
}
```

### 4.6 טבלת הסצנות

| זמן | ויז׳ואל | טקסט על המסך | קריינות |
|---|---|---|---|
| 0:00–0:03 | הסרטון שלכם: פטיש פוגע באריח ורוד ישן, אבק עף (העלאה) | אמבטיה משנות ה-80 ← 10 ימי עבודה | אמבטיה משנות ה-80. 10 ימי עבודה. |
| 0:03–0:08 | התמונה שלכם של החדר לפני, בתקריב איטי (העלאה) | ככה זה התחיל. | אריחים ורודים, רטיבות מתחת לריצוף, וניקוז שנסתם כל שבוע. |
| 0:08–0:14 | התמונה שלכם של החדר אחרי, עם תנועה עדינה; מעבר הבזק (העלאה מונפשת) | אחרי: אותה זווית בדיוק | ככה היא נראית היום. אותה זווית בדיוק, בלי פילטרים. |
| 0:14–0:20 | קבלן מצלם בטלפון את פינת המקלחת אחרי איטום, המסך לא נראה (קליפ) | לוח זמנים חתום. עדכון יומי. | וזה החלק החשוב: לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ. |
| 0:20–0:25 | פלס על אריחים חדשים, הבועה באמצע (תמונה בתנועה) | אחריות בכתב על האיטום | ואחריות בכתב על האיטום. לא בעל פה. |
| 0:25–0:30 | בעל דירה מצלם בטלפון חדר רחצה ישן (תמונה בתנועה); אחריה כרטיס הסיום | — | שלחו שלוש תמונות של החדר בוואטסאפ, והצעת מחיר אצלכם תוך 24 שעות. |
| 0:30–0:32.5 | כרטיס סיום (`EndCard`): לוגו, וואטסאפ + טלפון | שלחו תמונות של החדר בוואטסאפ | — (המוזיקה נסגרת) |

### 4.7 מה הדוגמה מלמדת, ומה הבדיקות מצפות לראות

- **לפני ואחרי של עבודה אמיתית מגיעים רק מצילומים אמיתיים.** תמונת "אחרי" שנוצרה ב-AI הייתה מציגה עבודה שהקבלן לא עשה, וזה פרסום מטעה. לכן סצנות 0–2 הן העלאות של המשתמש: `user_media` לסרטון הפטיש ולתמונת "לפני", ו-`user_photo_animated` לתמונת "אחרי" עם תנועה עדינה בלבד. ה-AI מייצר רק את מה שאינו טענה על התוצאה: איטום, פלס, בעל דירה שמצלם.
- **ה-`negative_prompt_en` של התמונה המונפשת** ("changing tiles, added objects, people") שומר שהמודל לא "ישפר" את החדר האמיתי. אם התוצאה משנה פרטים, המשתמש מחליף את הסצנה ל-`user_media` רגיל בעורך.
- **תקרת הקליפים כוללת תמונות מונפשות.** `Σ billed = 6 (user_photo_animated) + 6 (ai_clip)` = 12 מתוך 15. אילו גם תמונת ה"לפני" הייתה מונפשת, הסכום היה עובר את התקרה ו-`plan.ts` היה מוריד אותה מדרגה.
- **מספרי הוראה במילים.** "שלחו שלוש תמונות" כתוב במילים גם בקריינות לתצוגה. `detectFactSlots` פוטר גם את הצורה בספרות ("שלחו 3 תמונות" — כמות בהוראה, חלק 03 §6.12 כלל 2), אבל במילים זה נקרא טבעי יותר ולא יוצר חריץ בכלל. "10 ימי עבודה" ו-"24 שעות" הם טענות, ושתיהן מאושרות.
- **מעבר `flash` אחד**, בדיוק ברגע החשיפה של ה"אחרי". אפקט `camera_shutter` רק בסצנה שבה מצלמים.
- **הסכמה:** בהעלאות אין אנשים מזוהים. תיבת ההסכמה של ההעלאה מסומנת בכל מקרה בהעלאה הראשונה בסשן, ונשמרת על הנכס (`assets.metadata.consent_attested`, חלק 03 §6.6) ולא ב-`brief.attestations`. את ההסכמה של בעלי הדירה לפרסום תמונות הבית שלהם הקבלן מסדיר מולם, כמו כל אחריות על תוכן שהמשתמש מעלה (תנאי השימוש, חלק 02 §10).
- **פורמט נוסף 1:1:** הקליפים נוצרים פעם אחת ב-9:16 ומותאמים ל-1:1 ב-`blur_pad` (חלק 05 §20.6). לכן כל `focal_point` ממוקם בתוך הריבוע המרכזי.

**תוצאות צפויות (golden):**

| בדיקה | צפוי |
|---|---|
| `validateScriptV1` / `validateStoryboardV1` | 0 שגיאות, 0 אזהרות |
| `detectFactSlots` | 3 חריצים, כולם מאושרים: "ה-80" (`featured_project`), "10" (`bathroom_duration`), "24" (`quote_turnaround`) |
| `normalizeForTts` | "משנות ה-80" ← "משנות השמונים"; "10 ימי עבודה" ← "עשרה ימי עבודה"; "תוך 24 שעות" ← "תוך עשרים וארבע שעות" |
| `planVisualSources` עם שלוש ההעלאות | סצנה 0 ← הסרטון, סצנה 1 ← תמונת "לפני", סצנה 2 ← תמונת "אחרי"; אף סצנה לא יורדת מדרגה |
| `buildPromoProps` ב-1:1 | `fit: "blur_pad"` לכל סצנות הווידאו, `cover` לתמונות |

### קריטריוני קבלה
- [ ] בלי העלאות (`user_media: []`), `plan.ts` מוריד את סצנות 0–2 ל-`ai_image_kenburns`, והעורך מציג בכל אחת: "כאן מתאים צילום שלכם: {hint}".
- [ ] הרינדור ב-1:1 לא חותך את החץ "←" ולא את "ה-80" בטקסט ההוק.
- [ ] הקריינות לא מכילה "ארבעים שנה" או כל מספר שאינו בעובדות.

## §5. דוגמה 3 — יועצת משכנתאות: סרטון הסבר של 30 שניות (`mortgage-mix-30`)

### 5.1 הבריף

> "יועצת משכנתאות בראשון לציון. רוצה סרטון הסבר שמביא פניות: למה התמהיל חשוב יותר מהבנק. יש לי סימולציה מתועדת: הלוואה של ₪1,200,000 ל-25 שנה, הפרש של ₪310,000 בין שני תמהילים. מי שכותב 'משכנתא' בתגובות מקבל ממני בפרטי מחשבון תמהיל."

| שדה | ערך |
|---|---|
| עסק | יסודות – ייעוץ משכנתאות, ראשון לציון (בדיוני) |
| נישה | `mortgage-advisors` · `compliance_flag = financial` |
| סוג, מטרה, פלטפורמות | `explainer` · `leads` · רילס, שורטס, פייסבוק |
| משך, פורמט, מבנה | 30 שנ׳ · 9:16 ראשי + 16:9 נוסף · `pas` |
| פנייה, קול, רמה | רבים · קריינית בגוף ראשון · `formal` |
| ויז׳ואל ואיכות | `smart`, `standard`, סגנון `cinematic`, תקרת קליפים 15 שנ׳ |
| ערכת מותג | כתוביות `news` · `shekel_format = prefix` |
| הנעה | `comment_keyword`, מילת המפתח "משכנתא" |
| עובדות מאושרות | סימולציה מתועדת: ₪1,200,000 ל-25 שנה, הפרש של ₪310,000 |
| העלאות | פורטרט של היועצת במשרד (`upload_image`) |

### 5.2 ההוק

`mortgage-advisors-01` · `statistic` (נתון / מספר): **"אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים"**
ההוק נלקח כמו שהוא, והקו המפריד הפך לפסיק (דמיון 1.0). הוא נשען על הסימולציה המתועדת, ולכן אומר "יכול להגיע" ולא נוקב בסכום. ההוק המדובר ארוך: עשר מילים. כדי לעמוד בתקציב המילים, ביט ההוק מתארך מ-3 ל-4.5 שניות (המקסימום המותר), וביט הבעיה מתקצר בשנייה. בסטוריבורד ביט ההוק מתפצל לשתי סצנות: סצנת ההוק (3 שנ׳) ותקריב קצר (1.5 שנ׳), כי סצנת הוק לא עוברת 3.5 שניות. המבנה `pas` נבחר לפי סוג הסרטון `explainer`; לסוג ההוק `statistic` אין מבנה מועדף.

### 5.3 הקלט (`tests/fixtures/scripts/mortgage-mix-30.input.json`)

```json
{
  "id": "mortgage-mix-30",
  "niche_slug": "mortgage-advisors",
  "structure": "pas",
  "words_per_second": 2.4,
  "project": {
    "video_type": "explainer",
    "goal": "leads",
    "platforms": [
      "reels",
      "shorts",
      "facebook"
    ],
    "primary_aspect": "9:16",
    "extra_aspects": [
      "16:9"
    ],
    "duration_target_sec": 30,
    "quality_tier": "standard",
    "visual_mix": "smart",
    "visual_style": "cinematic",
    "audience_gender": "plural",
    "voice_gender": "female",
    "register": "formal",
    "voice_speed": 1.0,
    "caption_preset": "news",
    "music_mode": "library",
    "music_mood": "warm"
  },
  "business": {
    "business_name": "יסודות – ייעוץ משכנתאות",
    "city": "ראשון לציון",
    "services": [
      {
        "name_he": "בדיקת תמהיל",
        "gender": "f"
      },
      {
        "name_he": "ליווי משכנתא",
        "gender": "m"
      }
    ],
    "usp_he": "משווה הצעות של כמה בנקים ובונה תמהיל לפי ההכנסה",
    "phone": "050-1234567",
    "whatsapp": "050-1234567",
    "address": null,
    "website_url": null,
    "instagram_url": null
  },
  "facts": [
    {
      "key": "simulation",
      "label_he": "סימולציה מתועדת",
      "value": "הלוואה של ₪1,200,000 ל-25 שנה: הפרש של ₪310,000 בין שני תמהילים"
    }
  ],
  "brief": {
    "focus_service": "בדיקת תמהיל",
    "notes": "היועצת בודקת פריים, קבועה לא צמודה ומשתנה כל חמש, ומשווה הצעות של כמה בנקים. למי שכותב בתגובות נשלח בפרטי מחשבון תמהיל.",
    "offer": null,
    "cta": {
      "type": "comment_keyword",
      "target": null,
      "keyword": "משכנתא",
      "prefill_he": null,
      "headline_he": null
    }
  },
  "brand_kit": {
    "colors": {
      "primary": "#0E5E6F",
      "secondary": "#0B1F24",
      "accent": "#F2C14E",
      "text": "#FFFFFF"
    },
    "caption_preset": "news",
    "shekel_format": "prefix"
  },
  "chosen_hook": {
    "id": "mortgage-advisors-01",
    "text_he": "אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים",
    "hook_type_slug": "statistic",
    "visual_direction_he": "שתי ערימות מטבעות זהות, אחת מתחילה לצמוח מהר"
  },
  "storyboard_ctx": {
    "aspect_ratio": "9:16",
    "allowed_visual_sources": [
      "ai_image_kenburns",
      "user_media",
      "brand_card",
      "ai_clip",
      "user_photo_animated"
    ],
    "max_ai_clip_seconds": 15,
    "user_media": [
      {
        "n": 1,
        "kind": "upload_image",
        "description_he": "פורטרט של היועצת במשרד"
      }
    ],
    "contact": [
      "phone",
      "whatsapp"
    ]
  },
  "demo_placeholder_values": {},
  "demo_placeholder_values_spoken": {}
}
```

### 5.4 `ScriptV1` (`lib/ai/prompts/examples/mortgage-mix-30.script.json`)

```json
{
  "title_he": "הסבר שירות: למה התמהיל חשוב יותר מהבנק",
  "video_type": "explainer",
  "goal": "leads",
  "structure": "pas",
  "target_duration_sec": 30,
  "audience_gender": "plural",
  "voice_gender": "female",
  "register": "formal",
  "hook": {
    "text_he": "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות אלפי שקלים.",
    "onscreen_he": "אותה משכנתא. הפרש של מאות אלפי שקלים.",
    "hook_type_slug": "statistic",
    "source_hook_id": "mortgage-advisors-01",
    "visual_direction_he": "שתי צנצנות זכוכית זהות מלאות מטבעות על שולחן לבן, ואחת מתחילה להתמלא מהר יותר כבר מהפריים הראשון"
  },
  "beats": [
    {
      "index": 0,
      "role": "hook",
      "vo_he": "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות אלפי שקלים.",
      "onscreen_text_he": "אותה משכנתא. הפרש של מאות אלפי שקלים.",
      "est_duration_sec": 4.5,
      "visual_idea_he": "שתי צנצנות מטבעות זהות, אחת מתמלאת מהר יותר"
    },
    {
      "index": 1,
      "role": "problem",
      "vo_he": "ההבדל הוא לא הבנק. ההבדל הוא התמהיל.",
      "onscreen_text_he": "ההבדל? התמהיל.",
      "est_duration_sec": 4,
      "visual_idea_he": "התמונה שלכם: היועצת במשרד, פונה למצלמה"
    },
    {
      "index": 2,
      "role": "agitate",
      "vo_he": "שינוי קטן בחלוקה משנה את ההחזר החודשי, ואת הסכום שתחזירו בסוף.",
      "onscreen_text_he": "שינוי קטן, הפרש גדול",
      "est_duration_sec": 5,
      "visual_idea_he": "ידיים מזיזות שלוש קוביות עץ בגבהים שונים על שולחן"
    },
    {
      "index": 3,
      "role": "solution",
      "vo_he": "וכאן זה מתחיל: אני בודקת פריים, קבועה לא צמודה ומשתנה כל חמש, ומרכיבה תמהיל שמתאים להכנסה שלכם.",
      "onscreen_text_he": "פריים, קבועה, משתנה",
      "est_duration_sec": 7.5,
      "visual_idea_he": "כרטיס גרפי עם שלושת המסלולים, ואז היועצת עובדת מול המחשב"
    },
    {
      "index": 4,
      "role": "proof",
      "vo_he": "ומניחה זו מול זו את ההצעות של כמה בנקים.",
      "onscreen_text_he": "כמה בנקים, זו מול זו",
      "est_duration_sec": 4,
      "visual_idea_he": "שתי הצעות מודפסות זו לצד זו, עט עובר ביניהן"
    },
    {
      "index": 5,
      "role": "cta",
      "vo_he": "כתבו \"משכנתא\" בתגובות, ונשלח לכם את המחשבון בפרטי.",
      "onscreen_text_he": "",
      "est_duration_sec": 5,
      "visual_idea_he": "ידיים של זוג מחזיקות טלפון ליד שולחן המטבח"
    }
  ],
  "cta": {
    "type": "comment_keyword",
    "text_he": "כתבו \"משכנתא\" בתגובות",
    "vo_he": "כתבו \"משכנתא\" בתגובות, ונשלח לכם את המחשבון בפרטי."
  },
  "vo_full_he": "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות אלפי שקלים. ההבדל הוא לא הבנק. ההבדל הוא התמהיל. שינוי קטן בחלוקה משנה את ההחזר החודשי, ואת הסכום שתחזירו בסוף. וכאן זה מתחיל: אני בודקת פריים, קבועה לא צמודה ומשתנה כל חמש, ומרכיבה תמהיל שמתאים להכנסה שלכם. ומניחה זו מול זו את ההצעות של כמה בנקים. כתבו \"משכנתא\" בתגובות, ונשלח לכם את המחשבון בפרטי.",
  "vo_tts_he": "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות אלפי שקלים. ההבדל הוא לא הבנק. ההבדל הוא התמהיל. שינוי קטן בחלוקה משנה את ההחזר החודשי, ואת הסכום שתחזירו בסוף. וכאן זה מתחיל: אני בודקת פריים, קבועה לא צמודה ומשתנה כל חמש, ומרכיבה תמהיל שמתאים להכנסה שלכם. ומניחה זו מול זו את ההצעות של כמה בנקים. כתבו משכנתא בתגובות, ונשלח לכם את המחשבון בפרטי.",
  "post_caption_he": "אותה דירה, אותו סכום הלוואה, ושני זוגות שישלמו סכום שונה מאוד. מה שמבדיל ביניהם הוא החלוקה בין המסלולים.\n\nרוצים לראות איך זה נראה אצלכם? כתבו \"משכנתא\" בתגובות, ונשלח לכם את המחשבון בפרטי.\n\nהמידע אינו מהווה ייעוץ או המלצה. הסימולציה להמחשה בלבד.",
  "hashtags_he": [
    "#משכנתא",
    "#יועצתמשכנתאות",
    "#תמהילמשכנתא",
    "#דירהראשונה",
    "#ראשוןלציון"
  ],
  "compliance": {
    "flags": [
      "financial_disclaimer",
      "personal_attributes",
      "price_claim"
    ],
    "disclaimers_he": [
      "המידע אינו מהווה ייעוץ או המלצה.",
      "הסימולציה להמחשה בלבד."
    ],
    "needs_user_facts": []
  }
}
```

### 5.5 `StoryboardV1` (`lib/ai/prompts/examples/mortgage-mix-30.storyboard.json`)

```json
{
  "aspect_ratio": "9:16",
  "total_duration_sec": 30,
  "visual_style": "cinematic",
  "scenes": [
    {
      "index": 0,
      "beat_index": 0,
      "duration_sec": 3,
      "visual_source": "ai_clip",
      "image_prompt_en": "Close-up shot, 50mm. Two identical glass jars filled with plain golden coins without markings stand side by side on a clean white desk, the right jar filling faster. Calm modern office in Israel. Soft daylight. Subtle deep teal accents in the desk accessories. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, jars in the lower half, upper area clear. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Coins pour into the right jar and it fills faster than the left one, slow push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "numbers on coins, banknotes, cluttered desk",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.65
      },
      "onscreen_text_he": "אותה משכנתא. הפרש של מאות אלפי שקלים.",
      "text_position": "top",
      "vo_he": "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות",
      "transition_in": "cut",
      "sfx": "cash",
      "kenburns": "none",
      "is_hook_scene": true,
      "hook_type_slug": "statistic",
      "user_media_hint_he": null
    },
    {
      "index": 1,
      "beat_index": 0,
      "duration_sec": 1.5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Extreme close-up shot, 100mm macro. Plain golden coins without markings spill over the rim of a glass jar onto a white desk. Calm modern office. Soft daylight. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, rim in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Coins tumble over the rim in slow motion, single continuous shot, no cuts, no text",
      "negative_prompt_en": "numbers on coins, banknotes",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "אלפי שקלים.",
      "transition_in": "zoom",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 2,
      "beat_index": 1,
      "duration_sec": 4,
      "visual_source": "user_photo_animated",
      "image_prompt_en": "",
      "motion_prompt_en": "Subtle natural movement, the advisor turns slightly toward the camera and smiles, soft office light, single continuous shot, no cuts, no text",
      "negative_prompt_en": "changing face, extra people",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "ההבדל? התמהיל.",
      "text_position": "top",
      "vo_he": "ההבדל הוא לא הבנק. ההבדל הוא התמהיל.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": "פורטרט של היועצת במשרד, מגובה העיניים, רקע נקי"
    },
    {
      "index": 3,
      "beat_index": 2,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. An advisor's hands slide three wooden blocks of different heights across a light oak desk, changing their order. Calm modern office in Israel. Soft window light. Subtle deep teal and golden yellow accents on the blocks. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, blocks in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The hands slide one block forward and the others shift, slow push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "numbers, charts, cluttered desk",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.62
      },
      "onscreen_text_he": "שינוי קטן, הפרש גדול",
      "text_position": "top",
      "vo_he": "שינוי קטן בחלוקה משנה את ההחזר החודשי, ואת הסכום שתחזירו בסוף.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "pan_start",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 4,
      "beat_index": 3,
      "duration_sec": 4,
      "visual_source": "brand_card",
      "image_prompt_en": "",
      "motion_prompt_en": "",
      "negative_prompt_en": "",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "פריים, קבועה, משתנה",
      "text_position": "center",
      "vo_he": "וכאן זה מתחיל: אני בודקת פריים, קבועה לא צמודה ומשתנה",
      "transition_in": "slide",
      "sfx": "click",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 5,
      "beat_index": 3,
      "duration_sec": 3.5,
      "visual_source": "ai_clip",
      "image_prompt_en": "Over-the-shoulder medium close-up shot, 50mm. An advisor in a navy blazer, seen from behind, works on a laptop with a blurred unreadable screen, blank paperwork beside it. Calm modern office in Israel. Soft daylight. Subtle deep teal accents in a coffee mug. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, laptop in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Over-the-shoulder handheld shot, fingers type and then pause, slight push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "readable screen, face toward camera, charts with numbers",
      "camera": "handheld",
      "focal_point": {
        "x": 0.5,
        "y": 0.6
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "כל חמש, ומרכיבה תמהיל שמתאים להכנסה שלכם.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 6,
      "beat_index": 4,
      "duration_sec": 4,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Overhead top-down shot, 35mm. Two printed loan offers with blank unreadable pages lie side by side on a desk, a hand holding a pen hovers between them. Calm modern office in Israel. Soft daylight. Subtle golden yellow accents in the pen. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, papers in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The pen moves from one page to the other and taps it, single continuous shot, no cuts, no text",
      "negative_prompt_en": "readable text, bank logos, numbers",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "כמה בנקים, זו מול זו",
      "text_position": "top",
      "vo_he": "ומניחה זו מול זו את ההצעות של כמה בנקים.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_out",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 7,
      "beat_index": 5,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Medium close-up shot, 50mm. A couple's hands hold a smartphone together at a kitchen table, the phone screen facing away from the camera, two coffee cups nearby. Bright Israeli apartment kitchen. Soft morning light. Subtle deep teal accents in a mug. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, hands in the middle. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Static camera, a thumb taps the phone and the hands relax, single continuous shot, no cuts, no text",
      "negative_prompt_en": "visible phone screen, faces in focus, cluttered table",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "כתבו \"משכנתא\" בתגובות, ונשלח לכם את המחשבון בפרטי.",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    }
  ],
  "music": {
    "mood": "warm",
    "energy": "medium",
    "bpm_hint": 92,
    "beat_drop_at_sec": 3.0
  },
  "end_card": {
    "headline_he": "כתבו \"משכנתא\" בתגובות",
    "cta_type": "comment_keyword",
    "show_logo": true,
    "contact_fields": [
      "whatsapp"
    ]
  }
}
```

### 5.6 טבלת הסצנות

| זמן | ויז׳ואל | טקסט על המסך | קריינות |
|---|---|---|---|
| 0:00–0:03 | שתי צנצנות זכוכית זהות עם מטבעות, הימנית מתמלאת מהר יותר (קליפ) | אותה משכנתא. הפרש של מאות אלפי שקלים. | אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות |
| 0:03–0:04.5 | מטבעות גולשים משפת הצנצנת, תקריב קצר (תמונה בתנועה) | — | אלפי שקלים. |
| 0:04.5–0:08.5 | התמונה שלכם: היועצת במשרד, תנועה עדינה (העלאה מונפשת) | ההבדל? התמהיל. | ההבדל הוא לא הבנק. ההבדל הוא התמהיל. |
| 0:08.5–0:13.5 | ידיים מזיזות שלוש קוביות עץ בגבהים שונים (תמונה בתנועה) | שינוי קטן, הפרש גדול | שינוי קטן בחלוקה משנה את ההחזר החודשי, ואת הסכום שתחזירו בסוף. |
| 0:13.5–0:17.5 | כרטיס גרפי בצבעי המותג: שלושה עמודים נבנים זה אחר זה | פריים, קבועה, משתנה | וכאן זה מתחיל: אני בודקת פריים, קבועה לא צמודה ומשתנה |
| 0:17.5–0:21 | מעבר לכתף: היועצת עובדת מול מחשב, המסך מטושטש (קליפ) | — | כל חמש, ומרכיבה תמהיל שמתאים להכנסה שלכם. |
| 0:21–0:25 | שתי הצעות מודפסות זו לצד זו, עט עובר ביניהן (תמונה בתנועה) | כמה בנקים, זו מול זו | ומניחה זו מול זו את ההצעות של כמה בנקים. |
| 0:25–0:30 | ידיים של זוג מחזיקות טלפון ליד שולחן המטבח (תמונה בתנועה); אחריה כרטיס הסיום עם ההסתייגויות | — | כתבו "משכנתא" בתגובות, ונשלח לכם את המחשבון בפרטי. |
| 0:30–0:32.5 | כרטיס סיום (`EndCard`): לוגו, וואטסאפ | כתבו "משכנתא" בתגובות | — (המוזיקה נסגרת) |

### 5.7 מה הדוגמה מלמדת, ומה הבדיקות מצפות לראות

- **שתי הסתייגויות חובה**, בדיוק בנוסח של `COMPLIANCE_RULES.financial` (חלק 05 §21.3): "המידע אינו מהווה ייעוץ או המלצה." (תמיד) ו-"הסימולציה להמחשה בלבד." (בגלל הדגל `price_claim`). שתיהן מוצגות בכרטיס הסיום (`endCard.disclaimersHe`). בנוסף, `persistentDisclaimer()` קובע אוטומטית `disclaimer.showOn = "all"` (נישה עם `compliance_flag = financial` ותסריט עם `price_claim`, וגם הדגל `financial_disclaimer`; חלק 05 §20.7), ולכן ההסתייגות הראשונה מוצגת כ-`DisclaimerStrip` לאורך כל הסרטון. זה חשוב כאן במיוחד, כי ההוק עצמו מדבר על סכום.
- **בלי הבטחה.** "שיכול להגיע", "משנה את ההחזר", "שמתאים להכנסה שלכם". אין "תחסכו", "מובטח" או סכום חיסכון לצופה.
- **בלי פנייה שמניחה מצב כלכלי.** אין "יש לכם משכנתא יקרה?". הדגל `personal_attributes` נוסף אוטומטית לנישה, והתסריט עומד בו.
- **גוף ראשון בנקבה:** "אני בודקת", "ומרכיבה", "ומניחה". בחרנו פעלים שהצורה הכתובה שלהם חד-משמעית. "ומשווה", למשל, נכתב אותו דבר בזכר ובנקבה, ומנוע ההקראה עלול לקרוא אותו בזכר.
- **רמת `formal` בלי ביורוקרטיה:** משפטים קצרים, "ההבדל הוא התמהיל", בלי "הננו" ובלי "על מנת".
- **הפנים של היועצת מגיעות רק מהתמונה שלה** (סצנה 2). בשאר הסצנות רואים ידיים, גב או חפצים. כשהדגל `avatar` יופעל (v2), אפשר להחליף את סצנות 2 ו-5 באווטאר שלה, רק דרך זרימת ההסכמה של `likeness_profiles`.
- **מירכאות:** מילת המפתח מופיעה במירכאות רגילות (`"משכנתא"`) על המסך ובקריינות לתצוגה, ונמחקת בטקסט להקראה.
- **`brand_card`** לסצנה שכולה טקסט ("פריים, קבועה, משתנה"), עם מעבר `slide` ואפקט `click`.

**תוצאות צפויות (golden):**

| בדיקה | צפוי |
|---|---|
| `validateScriptV1` / `validateStoryboardV1` | 0 שגיאות, 0 אזהרות |
| `S14` | שתי ההסתייגויות קיימות; מחיקת אחת מהן מחזירה `S14` עם תיקון אוטומטי |
| `detectFactSlots` | 0 חריצים (אין ספרות בטקסט; "מאות אלפי שקלים" מגובה בעובדה ומסומן ב-`price_claim`) |
| `planVisualSources` | `Σ billed = 3 + 4 (ai_clip) + 4 (user_photo_animated) = 11` |
| `buildPromoProps` | `disclaimer = { textHe: "המידע אינו מהווה ייעוץ או המלצה.", showOn: "all" }`; `endCard.disclaimersHe` = שתי ההסתייגויות, לפי הסדר |
| 16:9 | סצנות 9:16 עוברות ל-`blur_pad`; ה-`brand_card` מרונדר מחדש ב-16:9 (אין חיתוך) |

### קריטריוני קבלה
- [ ] בכרטיס הסיום ובכל פורמט מופיעות שתי ההסתייגויות, בניגודיות של 4.5:1 לפחות, לפחות 2.5 שניות; ובכל פורמט `DisclaimerStrip` מציג את "המידע אינו מהווה ייעוץ או המלצה." מהפריים הראשון ועד כרטיס הסיום.
- [ ] החלפת "אני בודקת" ב-"אני בודק" מחזירה `HE015` (קול נשי).
- [ ] הוספת "חיסכון מובטח" לכל שדה מחזירה `HE020`.

## §6. דוגמה 4 — מרפאת שיניים: סרטון תדמית של 60 שניות (`dentists-brand-60`)

### 6.1 הבריף

> "מרפאת שיניים ברחובות. המנהלת היא ד״ר מאיה, עם 12 שנות ניסיון. רוצים סרטון תדמית לאתר וליוטיוב, שמדבר אל מי שחושש מרופא שיניים. אצלנו התור הראשון הוא שיחת היכרות בלי טיפול. יש ג׳ל הרדמה לפני כל זריקה, מסך מעל הכיסא ואוזניות שמבטלות רעש. מסבירים כל שלב, ומטופל יכול להרים יד ולעצור. ד״ר מאיה מאשרת קריינות בגוף ראשון בשמה."

| שדה | ערך |
|---|---|
| עסק | מרפאת שיניים נווה, רחובות (בדיוני; ד״ר מאיה דמות בדיונית) |
| נישה | `dentists` · `compliance_flag = medical` |
| סוג, מטרה, פלטפורמות | `brand_promo` · `trust` · יוטיוב, פייסבוק, רילס |
| משך, פורמט, מבנה | 60 שנ׳ · 16:9 ראשי + 9:16 נוסף · `brand_story` |
| פנייה, קול, רמה | רבים · קריינית בגוף ראשון · `warm` |
| ויז׳ואל ואיכות | `smart`, `premium`, סגנון `cinematic`, תקרת קליפים 30 שנ׳ |
| ערכת מותג | כתוביות `news` · `shekel_format = prefix` |
| הנעה | `call` (מי שחושש מטיפול מעדיף לדבר עם בן אדם) |
| עובדות מאושרות | 12 שנות ניסיון |
| העלאות | סיור בחדר הטיפולים (`upload_video`), פורטרט של ד״ר מאיה (`upload_image`) |

### 6.2 ההוק

`dentists-04` · `callout` (פנייה לקהל): **"פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו"**
ההוק נלקח כמו שהוא (דמיון 1.0), ובגרסה שעל המסך נשארת רק השאלה. הוא מתאים לסרטון תדמית כי הוא מבטיח חוויה ("ככה זה נראה"), לא תוצאה. המבנה `brand_story` נקבע לפי סוג הסרטון `brand_promo`.

**למה ביט ההוק קצר מהתוכנית:** ב-`brand_story` של 60 שניות ביט ההוק הוא 5 שניות. ביט של 5 שניות היה מתפצל לשתי סצנות, וכל ביט של 10 שניות מתפצל לשתיים בכל מקרה (סצנה עד 8 שניות). יחד זה 13 סצנות, מעל המקסימום של 12. לכן ההוק מתקצר ל-3.5 שניות (סצנה אחת), וביט ההנעה לפעולה מתארך ל-5.5. כל שינוי בתוך גבול השנייה וחצי, והסכום נשאר 60.

**לפרסום ממומן:** ההוק פונה לצופה בשאלה על פחד. בפרסום ממומן במטא זה עלול להיחשב פנייה שמניחה מאפיין אישי, ולכן מסומן `personal_attributes`. לגרסה הממומנת משתמשים בניסוח בגוף שלישי: "הרבה אנשים פוחדים מרופא שיניים. ככה זה נראה מהכיסא אצלנו." (שכתוב של ביט ההוק ב-`scene.rewrite.v1` עם `instruction: "custom"`, כי `hooks.inflect.v1` מטה רק מגדר ולא עובר לגוף שלישי; ביט ההוק מתארך אז ל-4.5 שניות).

### 6.3 הקלט (`tests/fixtures/scripts/dentists-brand-60.input.json`)

```json
{
  "id": "dentists-brand-60",
  "niche_slug": "dentists",
  "structure": "brand_story",
  "words_per_second": 2.4,
  "project": {
    "video_type": "brand_promo",
    "goal": "trust",
    "platforms": [
      "youtube",
      "facebook",
      "reels"
    ],
    "primary_aspect": "16:9",
    "extra_aspects": [
      "9:16"
    ],
    "duration_target_sec": 60,
    "quality_tier": "premium",
    "visual_mix": "smart",
    "visual_style": "cinematic",
    "audience_gender": "plural",
    "voice_gender": "female",
    "register": "warm",
    "voice_speed": 1.0,
    "caption_preset": "news",
    "music_mode": "library",
    "music_mood": "calm"
  },
  "business": {
    "business_name": "מרפאת שיניים נווה",
    "city": "רחובות",
    "services": [
      {
        "name_he": "טיפולי שיניים",
        "gender": "m"
      },
      {
        "name_he": "פגישת היכרות",
        "gender": "f"
      }
    ],
    "usp_he": "טיפול רגוע למי שחושש מרופא שיניים",
    "phone": "050-1234567",
    "whatsapp": null,
    "address": "רחוב הרצל, רחובות",
    "website_url": null,
    "instagram_url": null
  },
  "facts": [
    {
      "key": "years_experience",
      "label_he": "שנות ניסיון של ד״ר מאיה",
      "value": "12 שנים"
    }
  ],
  "brief": {
    "focus_service": "פגישת היכרות",
    "notes": "הקריינות בגוף ראשון בשם ד״ר מאיה, מנהלת המרפאה, באישורה. התור הראשון הוא שיחת היכרות בלי טיפול. ג׳ל הרדמה לפני כל זריקה, מסך מעל הכיסא ואוזניות מבטלות רעש. מסבירים כל שלב, ומטופל יכול להרים יד ולעצור.",
    "offer": null,
    "cta": {
      "type": "call",
      "target": "+972501234567",
      "keyword": null,
      "prefill_he": null,
      "headline_he": null
    }
  },
  "brand_kit": {
    "colors": {
      "primary": "#5E8C6A",
      "secondary": "#10201A",
      "accent": "#E9C46A",
      "text": "#FFFFFF"
    },
    "caption_preset": "news",
    "shekel_format": "prefix"
  },
  "chosen_hook": {
    "id": "dentists-04",
    "text_he": "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו",
    "hook_type_slug": "callout",
    "visual_direction_he": "צילום מנקודת המבט של המטופל: תקרה עם מסך שמקרין סדרה, תאורה רכה"
  },
  "storyboard_ctx": {
    "aspect_ratio": "16:9",
    "allowed_visual_sources": [
      "ai_image_kenburns",
      "user_media",
      "brand_card",
      "ai_clip",
      "user_photo_animated"
    ],
    "max_ai_clip_seconds": 30,
    "user_media": [
      {
        "n": 1,
        "kind": "upload_video",
        "description_he": "סיור קצר בחדר הטיפולים, צולם בטלפון"
      },
      {
        "n": 2,
        "kind": "upload_image",
        "description_he": "פורטרט של ד״ר מאיה בחלוק"
      }
    ],
    "contact": [
      "phone",
      "address"
    ]
  },
  "demo_placeholder_values": {},
  "demo_placeholder_values_spoken": {}
}
```

### 6.4 `ScriptV1` (`lib/ai/prompts/examples/dentists-brand-60.script.json`)

```json
{
  "title_he": "סרטון תדמית: מרפאת שיניים למי שחושש מטיפול",
  "video_type": "brand_promo",
  "goal": "trust",
  "structure": "brand_story",
  "target_duration_sec": 60,
  "audience_gender": "plural",
  "voice_gender": "female",
  "register": "warm",
  "hook": {
    "text_he": "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו.",
    "onscreen_he": "פוחדים מרופא שיניים?",
    "hook_type_slug": "callout",
    "source_hook_id": "dentists-04",
    "visual_direction_he": "נקודת מבט מהכיסא: מנורה רכה, מסך עם צבעים רגועים מעל הראש, ויד עם כפפה מסובבת את האור הצידה"
  },
  "beats": [
    {
      "index": 0,
      "role": "hook",
      "vo_he": "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו.",
      "onscreen_text_he": "פוחדים מרופא שיניים?",
      "est_duration_sec": 3.5,
      "visual_idea_he": "נקודת מבט מהכיסא: אור רך ומסך רגוע מעל הראש"
    },
    {
      "index": 1,
      "role": "story",
      "vo_he": "הרבה אנשים דוחים טיפול שנים, בגלל רגע אחד לא נעים שזוכרים מפעם. אנחנו יודעים, ובגלל זה בנינו את המרפאה אחרת.",
      "onscreen_text_he": "בנינו את המרפאה אחרת",
      "est_duration_sec": 10,
      "visual_idea_he": "אישה מהססת בחדר ההמתנה, ואז סיור בחדר הטיפולים"
    },
    {
      "index": 2,
      "role": "solution",
      "vo_he": "וזה מתחיל עוד לפני הכיסא: התור הראשון הוא שיחת היכרות. בלי מקדחה ובלי הפתעות.",
      "onscreen_text_he": "תור ראשון: שיחת היכרות",
      "est_duration_sec": 10,
      "visual_idea_he": "שיחה ליד שולחן מול דגם של שיניים, ומגש מכוסה ליד כיסא ריק"
    },
    {
      "index": 3,
      "role": "solution",
      "vo_he": "בכל שלב אני מסבירה מה עומד לקרות, ואם צריך הפסקה, מרימים יד ועוצרים.",
      "onscreen_text_he": "מסבירים כל שלב. עוצרים מתי שצריך.",
      "est_duration_sec": 10,
      "visual_idea_he": "ידיים עם כפפות מסבירות על דגם, מטופל מרים יד והטיפול נעצר"
    },
    {
      "index": 4,
      "role": "proof",
      "vo_he": "ג׳ל הרדמה לפני כל זריקה, מסך מעל הכיסא ואוזניות שמבטלות את הרעש של המקדחה.",
      "onscreen_text_he": "ג׳ל הרדמה, מסך ואוזניות",
      "est_duration_sec": 10,
      "visual_idea_he": "מקלון עם ג׳ל, ומטופל רגוע עם אוזניות מול מסך"
    },
    {
      "index": 5,
      "role": "proof",
      "vo_he": "ואחרי 12 שנים בתחום, אני יודעת שהשקט של המטופל חשוב כמו הטיפול עצמו.",
      "onscreen_text_he": "12 שנות ניסיון",
      "est_duration_sec": 6,
      "visual_idea_he": "ידיים עובדות בשקט ובדיוק עם מראה על דגם"
    },
    {
      "index": 6,
      "role": "brand",
      "vo_he": "אני ד״ר מאיה, וזו המרפאה שלנו ברחובות.",
      "onscreen_text_he": "ד״ר מאיה, מרפאת שיניים נווה",
      "est_duration_sec": 5,
      "visual_idea_he": "התמונה שלכם: ד״ר מאיה בחלוק, מחייכת"
    },
    {
      "index": 7,
      "role": "cta",
      "vo_he": "רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות.",
      "onscreen_text_he": "",
      "est_duration_sec": 5.5,
      "visual_idea_he": "דלפק קבלה מואר עם צמחים"
    }
  ],
  "cta": {
    "type": "call",
    "text_he": "התקשרו לקביעת פגישת היכרות",
    "vo_he": "רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות."
  },
  "vo_full_he": "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו. הרבה אנשים דוחים טיפול שנים, בגלל רגע אחד לא נעים שזוכרים מפעם. אנחנו יודעים, ובגלל זה בנינו את המרפאה אחרת. וזה מתחיל עוד לפני הכיסא: התור הראשון הוא שיחת היכרות. בלי מקדחה ובלי הפתעות. בכל שלב אני מסבירה מה עומד לקרות, ואם צריך הפסקה, מרימים יד ועוצרים. ג׳ל הרדמה לפני כל זריקה, מסך מעל הכיסא ואוזניות שמבטלות את הרעש של המקדחה. ואחרי 12 שנים בתחום, אני יודעת שהשקט של המטופל חשוב כמו הטיפול עצמו. אני ד״ר מאיה, וזו המרפאה שלנו ברחובות. רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות.",
  "vo_tts_he": "פוחדים מרופא שיניים? ככה זה נִרְאֶה מהכיסא אצלנו. הרבה אנשים דוחים טיפול שנים, בגלל רגע אחד לא נעים שזוכרים מפעם. אנחנו יודעים, ובגלל זה בנינו את המרפאה אחרת. וזה מתחיל עוד לפני הכיסא: התור הראשון הוא שיחת היכרות. בלי מקדחה ובלי הפתעות. בכל שלב אני מסבירה מה עומד לקרות, ואם צריך הפסקה, מרימים יד ועוצרים. ג׳ל הרדמה לפני כל זריקה, מסך מעל הכיסא ואוזניות שמבטלות את הרעש של המקדחה. ואחרי שתים עשרה שנים בתחום, אני יודעת שהשקט של המטופל חשוב כמו הטיפול עצמו. אני דוקטור מאיה, וזו המרפאה שלנו ברחובות. רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות.",
  "post_caption_he": "לא כל ביקור אצל רופא שיניים צריך להתחיל בכיסא. אצלנו התור הראשון הוא שיחת היכרות, ובכל שלב מסבירים מה עומד לקרות.\n\nרוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות ברחובות.",
  "hashtags_he": [
    "#רופאשיניים",
    "#מרפאתשיניים",
    "#רחובות",
    "#פחדמרופאשיניים",
    "#טיפולשיניים"
  ],
  "compliance": {
    "flags": [
      "results_claim",
      "personal_attributes"
    ],
    "disclaimers_he": [
      "התוצאות משתנות מאדם לאדם."
    ],
    "needs_user_facts": []
  }
}
```

### 6.5 `StoryboardV1` (`lib/ai/prompts/examples/dentists-brand-60.storyboard.json`)

```json
{
  "aspect_ratio": "16:9",
  "total_duration_sec": 60,
  "visual_style": "cinematic",
  "scenes": [
    {
      "index": 0,
      "beat_index": 0,
      "duration_sec": 3.5,
      "visual_source": "ai_clip",
      "image_prompt_en": "Point-of-view shot from a reclining dental chair looking up, 24mm. A soft round overhead light, a ceiling-mounted screen glowing with calm abstract blue and green colors, a dentist's gloved hand gently turning the light aside. Bright modern dental clinic in Israel. Soft natural daylight. Subtle sage green accents in the ceiling panels. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, screen in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow push-in from the patient's point of view as the gloved hand turns the light away from the eyes, single continuous shot, no cuts, no text",
      "negative_prompt_en": "needles, drills in close-up, blood, harsh light",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.45
      },
      "onscreen_text_he": "פוחדים מרופא שיניים?",
      "text_position": "center",
      "vo_he": "פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": true,
      "hook_type_slug": "callout",
      "user_media_hint_he": null
    },
    {
      "index": 1,
      "beat_index": 1,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Medium shot, 35mm. An adult woman in her thirties sits in a calm clinic waiting area holding a cup of tea, thoughtful expression, glancing toward a treatment room door. Bright modern dental clinic in Israel with plants and wood details. Soft window light. Subtle sage green accents in the cushions. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, woman in the right third. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow drift toward the woman as she lowers the cup and takes a breath, single continuous shot, no cuts, no text",
      "negative_prompt_en": "crying, exaggerated fear, medical instruments",
      "camera": "push_in",
      "focal_point": {
        "x": 0.66,
        "y": 0.5
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "הרבה אנשים דוחים טיפול שנים, בגלל רגע אחד לא נעים שזוכרים מפעם.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "pan_start",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 2,
      "beat_index": 1,
      "duration_sec": 5,
      "visual_source": "user_media",
      "image_prompt_en": "",
      "motion_prompt_en": "",
      "negative_prompt_en": "",
      "camera": "handheld",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "בנינו את המרפאה אחרת",
      "text_position": "center",
      "vo_he": "אנחנו יודעים, ובגלל זה בנינו את המרפאה אחרת.",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": "סרטון קצר מהטלפון: הליכה איטית בחדר הטיפולים, בלי מטופלים בפריים"
    },
    {
      "index": 3,
      "beat_index": 2,
      "duration_sec": 5,
      "visual_source": "ai_clip",
      "image_prompt_en": "Over-the-shoulder medium shot, 35mm. A dentist in a white coat, seen from behind, explains a dental model to an adult patient sitting across a light wooden desk, the patient nodding. Consultation corner of a bright dental clinic in Israel. Soft daylight. Subtle sage green accents in a plant pot. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, patient in the left third. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow arc around the desk as the dentist turns the dental model in her hands, single continuous shot, no cuts, no text",
      "negative_prompt_en": "dentist face toward camera, instruments, gloves with blood",
      "camera": "orbit",
      "focal_point": {
        "x": 0.35,
        "y": 0.5
      },
      "onscreen_text_he": "תור ראשון: שיחת היכרות",
      "text_position": "top",
      "vo_he": "וזה מתחיל עוד לפני הכיסא: התור הראשון הוא שיחת היכרות.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 4,
      "beat_index": 2,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. A neatly covered instrument tray beside an empty dental chair, a soft blanket folded on the seat. Calm treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the blanket. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, tray in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow pull-out revealing the calm empty treatment room, single continuous shot, no cuts, no text",
      "negative_prompt_en": "exposed needles, drills in close-up, blood",
      "camera": "pull_out",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "בלי מקדחה ובלי הפתעות.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_out",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 5,
      "beat_index": 3,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. A dentist's gloved hands hold a dental model and point to one tooth while an adult patient's hands rest calmly on the armrest. Treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the gloves. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, hands in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The gloved finger moves slowly along the model, slight push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "needles, blood, faces",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "מסבירים כל שלב.",
      "text_position": "top",
      "vo_he": "בכל שלב אני מסבירה מה עומד לקרות,",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 6,
      "beat_index": 3,
      "duration_sec": 5,
      "visual_source": "ai_clip",
      "image_prompt_en": "Medium close-up shot, 50mm. An adult patient reclining in a dental chair calmly raises one hand, and the dentist's gloved hands pause and move back. Bright treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the chair. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, raised hand in the right third. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Locked-off camera, the patient raises a hand and the gloved hands pull back gently, single continuous shot, no cuts, no text",
      "negative_prompt_en": "pain expression, needles, blood",
      "camera": "static",
      "focal_point": {
        "x": 0.66,
        "y": 0.45
      },
      "onscreen_text_he": "עוצרים מתי שצריך.",
      "text_position": "top",
      "vo_he": "ואם צריך הפסקה, מרימים יד ועוצרים.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 7,
      "beat_index": 4,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Macro close-up shot, 100mm macro. A gloved hand holds a cotton swab with a small amount of clear numbing gel. Treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the background. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, swab in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The swab turns slowly in the light, single continuous shot, no cuts, no text",
      "negative_prompt_en": "needles, syringes, open mouth, blood",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "ג׳ל הרדמה",
      "text_position": "top",
      "vo_he": "ג׳ל הרדמה לפני כל זריקה,",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 8,
      "beat_index": 4,
      "duration_sec": 5,
      "visual_source": "ai_clip",
      "image_prompt_en": "Medium shot, 35mm. An adult patient reclines in a dental chair wearing large noise-cancelling headphones, watching a ceiling-mounted screen with calm abstract colors, relaxed face. Bright treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the headphones. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, patient in the left third. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow pull-out as the patient settles deeper into the chair and exhales, single continuous shot, no cuts, no text",
      "negative_prompt_en": "brand names on headphones, readable screen, needles",
      "camera": "pull_out",
      "focal_point": {
        "x": 0.35,
        "y": 0.5
      },
      "onscreen_text_he": "מסך ואוזניות",
      "text_position": "top",
      "vo_he": "מסך מעל הכיסא ואוזניות שמבטלות את הרעש של המקדחה.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 9,
      "beat_index": 5,
      "duration_sec": 6,
      "visual_source": "ai_clip",
      "image_prompt_en": "Close-up shot, 50mm. A dentist's gloved hands work calmly and precisely with a small dental mirror on a training model, steady and unhurried. Treatment room in a modern Israeli clinic. Soft natural daylight. Subtle sage green accents in the tray. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, hands in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Subtle handheld close-up following the steady hand movement, single continuous shot, no cuts, no text",
      "negative_prompt_en": "needles, blood, open mouth",
      "camera": "handheld",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "12 שנות ניסיון",
      "text_position": "top",
      "vo_he": "ואחרי 12 שנים בתחום, אני יודעת שהשקט של המטופל חשוב כמו הטיפול עצמו.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 10,
      "beat_index": 6,
      "duration_sec": 5,
      "visual_source": "user_photo_animated",
      "image_prompt_en": "",
      "motion_prompt_en": "Subtle natural movement, the dentist smiles warmly and nods once, soft clinic light, single continuous shot, no cuts, no text",
      "negative_prompt_en": "changing face, extra people",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.4
      },
      "onscreen_text_he": "ד״ר מאיה, מרפאת שיניים נווה",
      "text_position": "top",
      "vo_he": "אני ד״ר מאיה, וזו המרפאה שלנו ברחובות.",
      "transition_in": "fade",
      "sfx": "none",
      "kenburns": "none",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": "פורטרט של ד״ר מאיה בחלוק, בחדר הטיפולים, מגובה העיניים"
    },
    {
      "index": 11,
      "beat_index": 7,
      "duration_sec": 5.5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Wide shot, 24mm. A bright, welcoming dental clinic reception with fresh plants, a light wooden desk and a blank sign on the wall. Modern Israeli clinic. Warm late-afternoon light. Subtle sage green accents in the plants and chairs. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Horizontal 16:9 frame, desk in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "Slow push-in toward the empty reception desk, single continuous shot, no cuts, no text",
      "negative_prompt_en": "readable signage, people, clutter",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    }
  ],
  "music": {
    "mood": "calm",
    "energy": "low",
    "bpm_hint": 78,
    "beat_drop_at_sec": null
  },
  "end_card": {
    "headline_he": "התקשרו לקביעת פגישת היכרות",
    "cta_type": "call",
    "show_logo": true,
    "contact_fields": [
      "phone",
      "address"
    ]
  }
}
```

### 6.6 טבלת הסצנות

| זמן | ויז׳ואל | טקסט על המסך | קריינות |
|---|---|---|---|
| 0:00–0:03.5 | נקודת מבט מהכיסא: מנורה רכה, מסך עם צבעים רגועים, יד עם כפפה מסיטה את האור (קליפ) | פוחדים מרופא שיניים? | פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו. |
| 0:03.5–0:08.5 | אישה בחדר ההמתנה עם כוס תה, מהססת (תמונה בתנועה) | — | הרבה אנשים דוחים טיפול שנים, בגלל רגע אחד לא נעים שזוכרים מפעם. |
| 0:08.5–0:13.5 | הסרטון שלכם: סיור איטי בחדר הטיפולים (העלאה) | בנינו את המרפאה אחרת | אנחנו יודעים, ובגלל זה בנינו את המרפאה אחרת. |
| 0:13.5–0:18.5 | מעבר לכתף: רופאה מסבירה על דגם שיניים למטופל שמהנהן (קליפ) | תור ראשון: שיחת היכרות | וזה מתחיל עוד לפני הכיסא: התור הראשון הוא שיחת היכרות. |
| 0:18.5–0:23.5 | מגש מכוסה ליד כיסא ריק ושמיכה מקופלת (תמונה בתנועה) | — | בלי מקדחה ובלי הפתעות. |
| 0:23.5–0:28.5 | ידיים עם כפפות מצביעות על דגם, ידי המטופל רגועות (תמונה בתנועה) | מסבירים כל שלב. | בכל שלב אני מסבירה מה עומד לקרות, |
| 0:28.5–0:33.5 | מטופל מרים יד, והידיים עם הכפפות נעצרות ונסוגות (קליפ) | עוצרים מתי שצריך. | ואם צריך הפסקה, מרימים יד ועוצרים. |
| 0:33.5–0:38.5 | מקלון צמר גפן עם ג׳ל שקוף, תקריב (תמונה בתנועה) | ג׳ל הרדמה | ג׳ל הרדמה לפני כל זריקה, |
| 0:38.5–0:43.5 | מטופל רגוע עם אוזניות מול מסך בתקרה (קליפ) | מסך ואוזניות | מסך מעל הכיסא ואוזניות שמבטלות את הרעש של המקדחה. |
| 0:43.5–0:49.5 | ידיים עובדות בשקט ובדיוק עם מראה על דגם (קליפ) | 12 שנות ניסיון | ואחרי 12 שנים בתחום, אני יודעת שהשקט של המטופל חשוב כמו הטיפול עצמו. |
| 0:49.5–0:54.5 | התמונה שלכם: ד״ר מאיה מחייכת ומהנהנת (העלאה מונפשת) | ד״ר מאיה, מרפאת שיניים נווה | אני ד״ר מאיה, וזו המרפאה שלנו ברחובות. |
| 0:54.5–1:00 | דלפק קבלה מואר עם צמחים (תמונה בתנועה); אחריה כרטיס הסיום עם ההסתייגות | — | רוצים להתחיל בשיחה? התקשרו אלינו, ונקבע לכם פגישת היכרות. |
| 1:00–1:02.5 | כרטיס סיום (`EndCard`): לוגו, טלפון + כתובת | התקשרו לקביעת פגישת היכרות | — (המוזיקה נסגרת) |

### 6.7 מה הדוגמה מלמדת, ומה הבדיקות מצפות לראות

- **ציות רפואי בלי לאבד חום.** אין "ללא כאב", אין "תוצאה", אין "הכי טוב". יש תיאור של מה שקורה בפועל: שיחת היכרות, הסבר בכל שלב, אפשרות לעצור, ג׳ל, מסך ואוזניות. ההסתייגות "התוצאות משתנות מאדם לאדם." חובה בנישה רפואית גם כשאין טענת תוצאה (`S14`).
- **גוף שלישי לפחד:** "הרבה אנשים דוחים טיפול שנים", ולא "גם אתם דוחים טיפול?".
- **"אנחנו" של המרפאה ו"אני" של הרופאה, באותו סרטון.** המרפאה מדברת ברבים ("אנחנו יודעים", "בנינו"), והרופאה בגוף ראשון בנקבה ("אני מסבירה", "אני יודעת"). החתימה "אני ד״ר מאיה" מגיעה בביט ה-`brand`, יחד עם התמונה שלה ושורת שם על המסך.
- **אין רופאה שנוצרה ב-AI.** בכל הסצנות שנוצרות רואים את הרופאה מאחור או רק את הידיים עם הכפפות. הפנים של ד״ר מאיה מגיעות רק מהפורטרט שהועלה (סצנה 10).
- **ויז׳ואל רגיש:** בלי מחטים, בלי דם ובלי פה פתוח בתקריב. ה"ג׳ל" מוצג על מקלון צמר גפן.
- **ראשי תיבות בהקראה:** "ד״ר" ← "דוקטור". "12 שנים" ← "שתים עשרה שנים" (נקבה). "נִרְאֶה" מנוקד, כדי שלא ייקרא "נֵרָאֶה".
- **מבנה של 60 שניות:** 12 סצנות, מעברי `fade` בשלוש נקודות רגועות, בלי אפקטים קוליים, מוזיקה `calm` בלי דרופ (`beat_drop_at_sec: null`).
- **מספר רישיון:** בנישה רפואית כדאי להציג את מספר הרישיון בכרטיס הסיום, דרך `brand_kits.end_card.license_text_he` (חלק 03). הוא לא נכתב בתסריט.

**תוצאות צפויות (golden):**

| בדיקה | צפוי |
|---|---|
| `validateScriptV1` / `validateStoryboardV1` | 0 שגיאות, 0 אזהרות |
| `B01` | 12 סצנות, המקסימום המותר |
| `planVisualSources` | `Σ billed = 4 + 5 + 5 + 5 + 6 (ai_clip) + 5 (user_photo_animated) = 30`, בדיוק התקרה; אף סצנה לא יורדת מדרגה |
| `detectFactSlots` | חריץ אחד, מאושר: "12" (`years_experience`) |
| 9:16 | המסגור מ-16:9 ל-9:16 משתמש ב-`cover` עם `focal_point`; הנושא נשאר בפריים בכל 12 הסצנות (בדיקת golden של הפוסטרים) |

### קריטריוני קבלה
- [ ] הוספת "ללא כאב" לכל שדה עברי מחזירה `HE020`; מחיקת ההסתייגות מחזירה `S14`.
- [ ] בגרסת 9:16, הטקסט "ד״ר מאיה, מרפאת שיניים נווה" נשאר בתוך אזור הבטוח העליון ולא מכסה את הפנים.
- [ ] `PosterStill` ב-1.2 שניות מציג את סצנת ההוק עם "פוחדים מרופא שיניים?" במרכז.

## §7. דוגמה 5 — סטודיו לציפורניים: מבצע חנוכה של 15 שניות (`nails-hanukkah-15`)

### 7.1 הבריף

> "סטודיו לציפורניים בכפר סבא, הצוות כולו נשים. בחנוכה (4–12 בדצמבר 2026) אנחנו פתוחות כל ערב עד 22:00. לק ג׳ל ב-₪120. תורים בקישור שבביו. הקהל שלנו: נשים."

| שדה | ערך |
|---|---|
| עסק | סטודיו גוונים, כפר סבא (בדיוני) |
| נישה | `beauty-nails` · `compliance_flag = none` |
| סוג, מטרה, פלטפורמות | `offer` · `sales` · רילס, טיקטוק, סטטוס בוואטסאפ |
| משך, פורמט, מבנה | 15 שנ׳ · 9:16 · `aida` |
| פנייה, קול, רמה | נקבה · קריינית · `casual` · `voice_speed = 1.1` |
| ויז׳ואל ואיכות | `images` (תמונות בתנועה, אפס קליפים), `standard`, סגנון `cinematic` |
| ערכת מותג | כתוביות `soft` · `shekel_format = prefix` ("₪120") |
| הנעה | `booking` (הקישור לתורים בביו) |
| עובדות מאושרות | לק ג׳ל ₪120 · בחנוכה פתוחות עד 22:00 |
| הצעה (`brief.offer`) | "בחנוכה פתוחות עד 22:00, לק ג׳ל ב-₪120", בתוקף עד 2026-12-12, עונה `hanukkah` |

### 7.2 ההוק

`beauty-nails-09` · `pov` (נקודת מבט): **"POV: יש לכם אירוע בעוד יומיים, ואין תור בשום מקום"**
ההוק בספרייה ברבים. כאן הוא מוטה לנקבה ("יש לך"), וה-"POV:" נשאר רק על המסך: בקריינות הוא נשמע מאולץ, וממילא הוא מסגרת חזותית. הדמיון להוק המקורי 0.81, מעל הסף של 0.6. ההוק המדובר (9 מילים) נכנס בביט של 3.5 שניות רק כי `voice_speed = 1.1` מעלה את קצב הדיבור ל-2.64 מילים לשנייה. בלי זה, אותו הוק היה מקבל אזהרת `S06`. כיוון הצילום של ההוק בספרייה מציג טקסט על מסך הטלפון ("אין תורים פנויים"); בתסריט הוא הופך ליד שגוללת ונעצרת, והמסך מופנה מהמצלמה, כי שום טקסט לא נכנס לפיקסלים שהמנוע מייצר (חלק 05 §13.1).

### 7.3 הקלט (`tests/fixtures/scripts/nails-hanukkah-15.input.json`)

```json
{
  "id": "nails-hanukkah-15",
  "niche_slug": "beauty-nails",
  "structure": "aida",
  "words_per_second": 2.4,
  "project": {
    "video_type": "offer",
    "goal": "sales",
    "platforms": [
      "reels",
      "tiktok",
      "whatsapp"
    ],
    "primary_aspect": "9:16",
    "extra_aspects": [],
    "duration_target_sec": 15,
    "quality_tier": "standard",
    "visual_mix": "images",
    "visual_style": "cinematic",
    "audience_gender": "female",
    "voice_gender": "female",
    "register": "casual",
    "voice_speed": 1.1,
    "caption_preset": "soft",
    "music_mode": "library",
    "music_mood": "energetic"
  },
  "business": {
    "business_name": "סטודיו גוונים",
    "city": "כפר סבא",
    "services": [
      {
        "name_he": "לק ג׳ל",
        "gender": "m"
      },
      {
        "name_he": "בניית ציפורניים",
        "gender": "f"
      }
    ],
    "usp_he": "תורים גם בערב",
    "phone": "050-1234567",
    "whatsapp": "050-1234567",
    "address": "רחוב ויצמן, כפר סבא",
    "website_url": null,
    "instagram_url": null
  },
  "facts": [
    {
      "key": "gel_price",
      "label_he": "מחיר לק ג׳ל",
      "value": "₪120"
    },
    {
      "key": "hanukkah_hours",
      "label_he": "שעות פתיחה בחנוכה",
      "value": "עד 22:00"
    }
  ],
  "brief": {
    "focus_service": "לק ג׳ל",
    "notes": "הצוות כולו נשים. כל ימי חנוכה פתוחות עד 22:00. קביעת תורים בקישור שבביו.",
    "offer": {
      "text_he": "בחנוכה פתוחות עד 22:00, לק ג׳ל ב-₪120",
      "valid_until": "2026-12-12",
      "season_slug": "hanukkah"
    },
    "cta": {
      "type": "booking",
      "target": "https://booking.example.com/studio",
      "keyword": null,
      "prefill_he": null,
      "headline_he": null
    }
  },
  "brand_kit": {
    "colors": {
      "primary": "#8E2C48",
      "secondary": "#1E1016",
      "accent": "#E8B4A0",
      "text": "#FFFFFF"
    },
    "caption_preset": "soft",
    "shekel_format": "prefix"
  },
  "chosen_hook": {
    "id": "beauty-nails-09",
    "text_he": "POV: יש לכם אירוע בעוד יומיים, ואין תור בשום מקום",
    "hook_type_slug": "pov",
    "visual_direction_he": "גלילה בטלפון: \"אין תורים פנויים\", ואז משבצת פנויה מהבהבת"
  },
  "storyboard_ctx": {
    "aspect_ratio": "9:16",
    "allowed_visual_sources": [
      "ai_image_kenburns",
      "user_media",
      "brand_card"
    ],
    "max_ai_clip_seconds": 0,
    "user_media": [],
    "contact": [
      "phone",
      "whatsapp",
      "address"
    ]
  },
  "demo_placeholder_values": {},
  "demo_placeholder_values_spoken": {}
}
```

### 7.4 `ScriptV1` (`lib/ai/prompts/examples/nails-hanukkah-15.script.json`)

```json
{
  "title_he": "מבצע חנוכה: לק ג׳ל ותורים עד 22:00",
  "video_type": "offer",
  "goal": "sales",
  "structure": "aida",
  "target_duration_sec": 15,
  "audience_gender": "female",
  "voice_gender": "female",
  "register": "casual",
  "hook": {
    "text_he": "יש לך אירוע בעוד יומיים, ואין תור בשום מקום?",
    "onscreen_he": "POV: יש לך אירוע בעוד יומיים, ואין תור",
    "hook_type_slug": "pov",
    "source_hook_id": "beauty-nails-09",
    "visual_direction_he": "יד עם ציפורניים בלי לק גוללת בטלפון בערב, והאגודל נעצר בבת אחת"
  },
  "beats": [
    {
      "index": 0,
      "role": "hook",
      "vo_he": "יש לך אירוע בעוד יומיים, ואין תור בשום מקום?",
      "onscreen_text_he": "POV: יש לך אירוע בעוד יומיים, ואין תור",
      "est_duration_sec": 3.5,
      "visual_idea_he": "יד עם ציפורניים בלי לק מחזיקה טלפון, האגודל עוצר"
    },
    {
      "index": 1,
      "role": "solution",
      "vo_he": "בחנוכה אנחנו פתוחות עד 22:00, גם בשבילך.",
      "onscreen_text_he": "בחנוכה פתוחות עד 22:00",
      "est_duration_sec": 5,
      "visual_idea_he": "מניקוריסטית מורחת לק ג׳ל בורדו, אורות חג מטושטשים ברקע"
    },
    {
      "index": 2,
      "role": "offer",
      "vo_he": "לק ג׳ל ב-₪120, ויוצאת מוכנה לאירוע.",
      "onscreen_text_he": "לק ג׳ל ₪120",
      "est_duration_sec": 3.5,
      "visual_idea_he": "ציפורניים מבריקות בבורדו על כרית קטיפה"
    },
    {
      "index": 3,
      "role": "cta",
      "vo_he": "קבעי תור בקישור שבביו.",
      "onscreen_text_he": "",
      "est_duration_sec": 3,
      "visual_idea_he": "יד עם מניקור טרי מחזיקה קופסת מתנה קטנה"
    }
  ],
  "cta": {
    "type": "booking",
    "text_he": "קבעי תור אונליין",
    "vo_he": "קבעי תור בקישור שבביו."
  },
  "vo_full_he": "יש לך אירוע בעוד יומיים, ואין תור בשום מקום? בחנוכה אנחנו פתוחות עד 22:00, גם בשבילך. לק ג׳ל ב-₪120, ויוצאת מוכנה לאירוע. קבעי תור בקישור שבביו.",
  "vo_tts_he": "יש לָךְ אירוע בעוד יומיים, ואין תור בשום מקום? בחנוכה אנחנו פתוחות עד עשר בערב, גם בִּשְׁבִילֵךְ. לק ג׳ל במאה ועשרים שקל, ויוצאת מוכנה לאירוע. קבעי תור בקישור שבביו.",
  "post_caption_he": "חנוכה מלא באירועים, והציפורניים לא צריכות לחכות לשבוע הבא. כל ימי החג אנחנו פתוחות עד 22:00.\n\nלק ג׳ל ב-₪120. קבעי תור בקישור שבביו.",
  "hashtags_he": [
    "#לקגל",
    "#ציפורניים",
    "#כפרסבא",
    "#חנוכה",
    "#מניקור"
  ],
  "compliance": {
    "flags": [
      "price_claim",
      "urgency_must_be_true"
    ],
    "disclaimers_he": [],
    "needs_user_facts": []
  }
}
```

### 7.5 `StoryboardV1` (`lib/ai/prompts/examples/nails-hanukkah-15.storyboard.json`)

```json
{
  "aspect_ratio": "9:16",
  "total_duration_sec": 15,
  "visual_style": "cinematic",
  "scenes": [
    {
      "index": 0,
      "beat_index": 0,
      "duration_sec": 3.5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. A woman's hand with bare, unpolished nails holds a smartphone, the phone screen facing away from the camera, thumb hesitating. Cozy Israeli apartment in the evening. Warm lamp light. Subtle burgundy and rose gold accents in a sweater sleeve. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, hand in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The thumb scrolls and stops, slight push-in, single continuous shot, no cuts, no text",
      "negative_prompt_en": "visible phone screen, chipped polish, rings with logos",
      "camera": "push_in",
      "focal_point": {
        "x": 0.5,
        "y": 0.62
      },
      "onscreen_text_he": "POV: יש לך אירוע בעוד יומיים, ואין תור",
      "text_position": "top",
      "vo_he": "יש לך אירוע בעוד יומיים, ואין תור בשום מקום?",
      "transition_in": "cut",
      "sfx": "pop",
      "kenburns": "zoom_in",
      "is_hook_scene": true,
      "hook_type_slug": "pov",
      "user_media_hint_he": null
    },
    {
      "index": 1,
      "beat_index": 1,
      "duration_sec": 5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Close-up shot, 50mm. A manicurist's hands in black gloves paint glossy burgundy gel polish on a client's nails at a neat salon station. Modern Israeli nail studio with warm string lights and blue-and-silver ornaments softly blurred in the background. Warm vanity light. Subtle rose gold accents in the tools. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, hands in the lower half. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The brush glides along the nail in one smooth stroke, single continuous shot, no cuts, no text",
      "negative_prompt_en": "messy polish, bottle labels, religious symbols",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.62
      },
      "onscreen_text_he": "בחנוכה פתוחות עד 22:00",
      "text_position": "top",
      "vo_he": "בחנוכה אנחנו פתוחות עד 22:00, גם בשבילך.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "pan_start",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 2,
      "beat_index": 2,
      "duration_sec": 3.5,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Macro close-up shot, 100mm macro. Finished glossy burgundy gel nails on a hand resting on a soft velvet cushion. Modern Israeli nail studio. Warm vanity light with a gentle sparkle. Subtle rose gold accents in the cushion trim. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, nails in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "A slow light sweep moves across the glossy nails, single continuous shot, no cuts, no text",
      "negative_prompt_en": "chipped polish, rings with logos, bottle labels",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.55
      },
      "onscreen_text_he": "לק ג׳ל ₪120",
      "text_position": "top",
      "vo_he": "לק ג׳ל ב-₪120, ויוצאת מוכנה לאירוע.",
      "transition_in": "zoom",
      "sfx": "cash",
      "kenburns": "zoom_out",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    },
    {
      "index": 3,
      "beat_index": 3,
      "duration_sec": 3,
      "visual_source": "ai_image_kenburns",
      "image_prompt_en": "Medium close-up shot, 50mm. A woman's hand with a fresh burgundy manicure holds a small wrapped gift box at an evening gathering, sparkling bokeh behind. Festive Israeli living room. Warm evening light. Subtle rose gold accents in the ribbon. Cinematic commercial photography, shallow depth of field, soft directional key light, subtle film grain, natural rich color grade. Vertical 9:16 frame, hand in the center. no text, no letters, no logos, no watermark",
      "motion_prompt_en": "The hand lifts the gift box slightly toward the camera, single continuous shot, no cuts, no text",
      "negative_prompt_en": "alcohol, faces in focus, logos on packaging",
      "camera": "static",
      "focal_point": {
        "x": 0.5,
        "y": 0.5
      },
      "onscreen_text_he": "",
      "text_position": "none",
      "vo_he": "קבעי תור בקישור שבביו.",
      "transition_in": "cut",
      "sfx": "none",
      "kenburns": "zoom_in",
      "is_hook_scene": false,
      "hook_type_slug": null,
      "user_media_hint_he": null
    }
  ],
  "music": {
    "mood": "energetic",
    "energy": "medium",
    "bpm_hint": 112,
    "beat_drop_at_sec": 3.5
  },
  "end_card": {
    "headline_he": "קבעי תור אונליין",
    "cta_type": "booking",
    "show_logo": true,
    "contact_fields": [
      "address",
      "whatsapp"
    ]
  }
}
```

### 7.6 טבלת הסצנות

| זמן | ויז׳ואל | טקסט על המסך | קריינות |
|---|---|---|---|
| 0:00–0:03.5 | יד עם ציפורניים בלי לק מחזיקה טלפון, האגודל נעצר (תמונה בתנועה) | POV: יש לך אירוע בעוד יומיים, ואין תור | יש לך אירוע בעוד יומיים, ואין תור בשום מקום? |
| 0:03.5–0:08.5 | מניקוריסטית מורחת לק ג׳ל בורדו, אורות כחול-כסף מטושטשים ברקע (תמונה בתנועה) | בחנוכה פתוחות עד 22:00 | בחנוכה אנחנו פתוחות עד 22:00, גם בשבילך. |
| 0:08.5–0:12 | ציפורניים מבריקות בבורדו על כרית קטיפה (תמונה בתנועה) | לק ג׳ל ₪120 | לק ג׳ל ב-₪120, ויוצאת מוכנה לאירוע. |
| 0:12–0:15 | יד עם מניקור טרי מחזיקה קופסת מתנה, בוקה של אורות (תמונה בתנועה); אחריה כרטיס הסיום | — | קבעי תור בקישור שבביו. |
| 0:15–0:17.5 | כרטיס סיום (`EndCard`): לוגו, כתובת + וואטסאפ | קבעי תור אונליין | — (המוזיקה נסגרת) |

### 7.7 מה הדוגמה מלמדת, ומה הבדיקות מצפות לראות

- **פנייה בנקבה מההתחלה עד הסוף:** "יש לך", "בשבילך", "ויוצאת מוכנה", "קבעי תור", גם בטקסט לפוסט ובכרטיס הסיום ("קבעי תור אונליין"). ערבוב של צורה אחת ברבים מחזיר `HE014`.
- **צוות של נשים מדבר בנקבה:** "אנחנו פתוחות". זה מופיע בבריף, ולכן מותר. בלי האמירה הזו, ברירת המחדל היא "אנחנו פתוחים".
- **ניקוד להטיה מגדרית בהקראה:** "לָךְ" ו-"בִּשְׁבִילֵךְ". בלי ניקוד, מנוע ההקראה קורא לפעמים "לְךָ" ו-"בִּשְׁבִילְךָ" (זכר), וזו הטעות הכי מורגשת לאוזן ישראלית.
- **₪ לפני המספר:** "₪120" על המסך ובקריינות לתצוגה (`shekel_format = prefix`), לעומת "{מחיר} ₪" בדוגמה 1. בהקראה ברמת `casual`: "במאה ועשרים שקל".
- **שעה:** "22:00" על המסך; "עשר בערב" בהקראה (חלק 05 §15.2, כלל 5).
- **דחיפות אמיתית בלבד:** ההצעה מוגבלת לימי חנוכה, ויש לה `valid_until`. לכן הדגל `urgency_must_be_true` מוצדק, ואין "נשארו 3 תורים".
- **חג בלי סמלים דתיים:** הרקע "כחול-כסף" ואורות, בלי חנוכייה (הרשימה השלילית הקבועה כוללת `religious symbol`).
- **תמונות בלבד:** ארבע סצנות `ai_image_kenburns` ברמת `standard`. זו בדיוק הדוגמה של "רילס 15 שניות, תמונות בתנועה" בדף המחירים (`SAMPLE_PRESETS.images15`, חלק 05 §14.2): 3 (תסריט וסטוריבורד) + 16 (ארבע תמונות) + 1 (קריינות) + 3 (הרכבה) = **23 קרדיטים**.
- **האשטגים בלי גרש:** `#לקגל` ולא `#לקג׳ל`. ברשתות, גרש ומירכאות שוברים את ההאשטג.

**תוצאות צפויות (golden):**

| בדיקה | צפוי |
|---|---|
| `validateScriptV1` / `validateStoryboardV1` | 0 שגיאות, 0 אזהרות |
| הערכת עלות (חלק 05 §14.2) | `estimateSample` מחזיר 23; `estimate()` על הגרסה מחזיר 20, עם `alreadySpent = 3` (התסריט והסטוריבורד כבר שולמו) |
| `detectFactSlots` | 2 חריצים, מאושרים: "22:00" (`hanukkah_hours`), "₪120" (`gel_price`; נמצא גם ב-`brief.offer`) |
| `hooks.inflect.v1` על `beauty-nails-09` עם `female` | מחזיר נוסח שהדמיון שלו להוק ≥ 0.6 ומשתמש ב-"לך" (בדיקה חיה, לא חוסמת) |
| `paginate` בסגנון `soft` | עד 2 שורות × 22 תווים לעמוד; "₪120" ו-"22:00" לא נשברים |

### קריטריוני קבלה
- [ ] החלפת "קבעי" ב-"קבעו" מחזירה `HE014`.
- [ ] בתוכנית `free` (איכות `draft` בלבד) אותה דוגמה עולה 3 + 8 + 1 + 3 = 15 קרדיטים, נוצרת בלי שינוי מבני (אין קליפים, 15 שניות, פורמט אחד) ומקבלת סימן מים.
- [ ] בהקראה של אנימטיק הדמו נשמע "לָךְ" ו-"בִּשְׁבִילֵךְ" בנקבה (בדיקת האזנה ידנית ב-M7, עם הקול הנשי שנבחר בבדיקה העיוורת).

## §8. בדיקות הזהב

### 8.1 בדיקות התקינות (`tests/contract/appendix-d.test.ts`)

```ts
import { SAMPLE_FIXTURES } from "@/tests/fixtures/scripts";
import { ScriptV1, StoryboardV1, validateScriptV1, validateStoryboardV1 } from "@/lib/ai/schemas";   // part 05 §11.2–§11.3
import { lint } from "@/lib/hebrew/lint";
import { normalizeForTts } from "@/lib/hebrew/tts";
import { stripNiqqud, fillPlaceholders } from "@/lib/hebrew/text";
import { ajv } from "@/tests/helpers/ajv";

describe.each(SAMPLE_FIXTURES)("appendix D · $id", (f) => {
  it("matches Zod and the strict JSON Schema", () => {
    expect(() => ScriptV1.parse(f.script)).not.toThrow();
    expect(() => StoryboardV1.parse(f.storyboard)).not.toThrow();
    expect(ajv.validate("script_v1", f.script)).toBe(true);
    expect(ajv.validate("storyboard_v1", f.storyboard)).toBe(true);
  });

  it("has zero semantic errors and zero warnings", () => {
    expect(validateScriptV1(f.script, toScriptInput(f.input))).toEqual([]);
    expect(validateStoryboardV1(f.storyboard, toStoryboardInput(f.input, f.script))).toEqual([]);
  });

  it("passes the Hebrew lint on every _he field", () => {
    for (const [field, text] of heFields(f.script, f.storyboard)) {
      expect(lint(text, { field, ...lintContext(f.input) }).filter((i) => i.severity === "error")).toEqual([]);
    }
  });

  it("TTS normalization agrees with vo_tts_he (niqqud-insensitive)", () => {
    const display = fillPlaceholders(f.script.vo_full_he, f.input.demo_placeholder_values);
    const spoken = normalizeForTts(display, ttsContext(f.input)).spoken;
    const expected = fillPlaceholders(f.script.vo_tts_he, f.input.demo_placeholder_values_spoken);
    expect(stripNiqqud(spoken)).toBe(stripNiqqud(expected));
  });
});
```

`toScriptInput`, `toStoryboardInput`, `lintContext` ו-`ttsContext` ממפים את קובץ הקלט לאותם אובייקטים שהפרומפטים והוולידציה מקבלים בזמן ריצה (`words_per_second` × `voice_speed`, `COMPLIANCE_RULES` של הנישה, העובדות, `allowed_visual_sources`, `max_ai_clip_seconds`, `contact`). הבדיקה מצפה **לאפס אזהרות**, לא רק לאפס שגיאות: דוגמה שמלמדת את המודל צריכה להיות נקייה לגמרי.

### 8.2 טבלת ההקראה הצפויה

אלה כל הטוקנים בדוגמאות שהנרמול הדטרמיניסטי (`normalizeForTts`, חלק 05 §15.2) צריך לטפל בהם. ההשוואה בבדיקה מתעלמת מניקוד, כי את הניקוד מוסיף המודל (או מילון ההגייה) ולא הנרמול.

| דוגמה | בטקסט לתצוגה | בהקראה | כלל ב-§15.2 |
|---|---|---|---|
| 1 | `ב-{מחיר} ₪` (ערך הדגמה 149, `casual`) | במאה ארבעים ותשע שקל | 3 (מחיר) + תחילית |
| 1 | `4.8 בגוגל` | ארבע נקודה שמונה בגוגל | 8 (עשרוני) |
| 1 | `מ-1,240 ביקורות` | מאלף מאתיים וארבעים ביקורות | 10 (מספר ושם עצם) |
| 2 | `משנות ה-80` | משנות השמונים | 11 (מספר בלי שם עצם מוכר) |
| 2 | `10 ימי עבודה` | עשרה ימי עבודה | 10, עם צורת הסמיכות "ימי" ב-`NOUN_GENDER` |
| 2 | `תוך 24 שעות` | תוך עשרים וארבע שעות | 10 |
| 3 | `כתבו "משכנתא" בתגובות` | כתבו משכנתא בתגובות | 14 (מירכאות נמחקות) |
| 4 | `ד״ר מאיה` | דוקטור מאיה | 12 (ראשי תיבות) |
| 4 | `12 שנים` | שתים עשרה שנים | 10 |
| 5 | `עד 22:00` | עד עשר בערב | 5 (שעה) |
| 5 | `ב-₪120` (`casual`) | במאה ועשרים שקל | 3 + תחילית |

הניקוד שהמודל הוסיף ב-`vo_tts_he` (ולכן נשמר בהקראה בפועל): "נִצְלֶה" (דוגמה 1), "נִרְאֶה" (דוגמה 4), "לָךְ" ו-"בִּשְׁבִילֵךְ" (דוגמה 5). אלה גם מקרי הבדיקה של מילון ההגייה: כשהמשתמש מוסיף אותם ב-`/app/settings/pronunciation`, הנרמול הדטרמיניסטי מגיע לאותה תוצאה.

### 8.3 מוטציות שליליות

כל שורה היא בדיקה: לוקחים את הדוגמה, משנים דבר אחד, ומצפים לקוד שבטבלה (או לזוג הקודים, כשהמוטציה שוברת שני כללים בבת אחת). כך הדוגמאות בודקות גם את הוולידציה עצמה, ולא רק להפך.

| # | דוגמה | המוטציה | קוד צפוי | התנהגות |
|---|---|---|---|---|
| 1 | 1 | מחיקת `{מחיר}` מ-`needs_user_facts` | `S08` | שגיאה |
| 2 | 1 | "4.8" ← "4.9" בביט ההוכחה | `S09` / `HE022` | שגיאה ("מספר מומצא") |
| 3 | 1 | הצבת "149" בספרות בתוך `vo_tts_he` | `S07` / `HE009` | שגיאה |
| 4 | 1 | הוספת "הכול כשר למהדרין" לביט הפתרון | `HE021` | שגיאה (אין עובדת כשרות) |
| 5 | 1 | שינוי ה-`vo_he` של ביט ה-`cta` בלי לעדכן את `cta.vo_he` | `S04` | שגיאה |
| 6 | 1 | הפיכת סצנה 4 ל-`ai_clip` (21 שניות קליפ) | `B06` | תיקון אוטומטי: הסצנה בעדיפות הנמוכה יורדת ל-`ai_image_kenburns` |
| 7 | 2 | `is_hook_scene: false` בסצנה 0 | `B01` | שגיאה |
| 8 | 2 | מחיקת הסיומת `no text, no letters, no logos, no watermark` מסצנה 3 | `B08` | תיקון אוטומטי |
| 9 | 2 | `end_card.cta_type = "call"` | `B12` | תיקון אוטומטי (חוזר ל-`whatsapp`) |
| 10 | 2 | "לוח זמנים חתום" ← "לוח זמנים חתום/ה" | `HE002` | שגיאה |
| 11 | 3 | מחיקת "הסימולציה להמחשה בלבד." | `S14` | תיקון אוטומטי (ההסתייגות נוספת) |
| 12 | 3 | "אני בודקת" ← "אני בודק" | `HE015` | שגיאה |
| 13 | 3 | החלפת ההוק המדובר ב-"הריבית עלתה. מה עושים עכשיו?" | `S13` | שגיאה (דמיון מתחת ל-0.6) |
| 14 | 3 | הוספת "חיסכון מובטח" לטקסט לפוסט | `HE020` | שגיאה |
| 15 | 4 | הוספת "ללא כאב" לביט הפתרון | `HE020` | שגיאה |
| 16 | 4 | הוספת "a little girl smiling in the chair" לפרומפט של סצנה 1 | `B09` | שגיאה; אם לא מתוקן, הסצנה יורדת ל-`brand_card` |
| 17 | 4 | פיצול סצנה 11 לשתי סצנות (13 סצנות) | `B01` | שגיאה |
| 18 | 5 | "קבעי תור" ← "קבעו תור" | `HE014` | שגיאה |
| 19 | 5 | הוספת "!!" לטקסט על המסך | `HE006` / `HE001` | שגיאה |
| 20 | 5 | "קבעי תור בקישור שבביו." ← "קבעי תור בקישור שבביו..." | `HE023` | אזהרה ותיקון אוטומטי ל-"…" |
| 21 | 5 | `audience_gender: "plural"` בתסריט בלבד | `S10` | תיקון אוטומטי מההקשר |
| 22 | כל דוגמה | הוספת "קחו את העסק לשלב הבא" לשדה עברי כלשהו | `HE001` | שגיאה |

### 8.4 golden ויזואלי ודטרמיניזם

- `paginate` לכל דוגמה ולכל אחד מששת סגנונות הכתוביות ← snapshot של העמודים (`tests/golden/appendix-d/{id}.captions.{preset}.json`). התזמון מגיע מ-`alignment_fallback` (חלוקה לפי אורך המילים), כדי שהבדיקה לא תלויה בספק.
- `buildPromoProps` עם נכסים מדומים (`mock://keyframe/{sceneIndex}`) ← snapshot של ה-props, לכל פורמט של הדוגמה.
- `PosterStill` לכל דוגמה בפורמט הראשי ← PNG שמושווה ל-golden בסף של 0.5% (חלק 05 §20.12). זו גם בדיקת ה-RTL הוויזואלית הכי חשובה: "ה-80 ← 10", "₪120", "4.8" ו-"ד״ר" במקומם.
- תמלול אמיתי (ספייק 4 ב-M0) של קריינות דוגמה 1 נשמר כ-fixture; `alignWords` עליו צריך להתאים לפחות 90% מהמילים ישירות.

### קריטריוני קבלה
- [ ] `pnpm test` מריץ את כל הבדיקות של §8.1 ו-§8.3 על חמש הדוגמאות, וכל 22 המוטציות מחזירות בדיוק את הקוד הצפוי.
- [ ] שינוי מקרי בפונקציה דטרמיניסטית (נרמול, עימוד, props) נכשל ב-snapshot, ועדכון golden דורש את הדגל `--update-golden` ושורה ב-PR.
- [ ] הדוגמאות נטענות ב-`PromptTester` באדמין תחת "דוגמאות נספח D", ואפשר להריץ עליהן כל מודל מופעל ולהשוות.

## §9. שימושים נוספים בדוגמאות

### 9.1 סרטוני ההדגמה לאתר השיווקי (`scripts/render-demo-videos.ts`, `pnpm demo:render [--upload]`)

עד שיש תוצרים אמיתיים של לקוחות, האתר השיווקי מציג אנימטיקים: קומפוזיציית `Animatic` (חלק 05 §20.10) עם אותן שכבות טקסט, כתוביות ומוזיקה, ובמקום תמונות שנוצרו — כרטיסים בצבעי המותג. התסריט מרנדר שני סוגים של מדיה:
- **קיר הסרטונים (`VideoWall`)** לא משתמש בדוגמאות של הנספח. הוא בנוי מ-18 האריחים של `content/demo-wall.json` (חלק 02 §3.3.6): לולאה של 4–6 שניות עם ההוק בלבד, 540×960, בלי סאונד, ועוד פוסטר AVIF וקובץ VTT, אל `public-media/demo/wall/{n}-{hook_id}.{mp4|avif|vtt}`.
- **חמש הדוגמאות של הנספח**, באורך מלא, לפי השלבים הבאים.

1. טוען את חמש הדוגמאות, ומציב את `demo_placeholder_values` (רק `{מחיר}` = 149 בדוגמה 1).
2. בונה props ל-`Animatic`: רקעים בצבעי ערכת המותג שבקלט, הטקסטים שעל המסך, כתוביות משוערות (`alignment_fallback`), מוזיקה מהספרייה לפי `music.mood`, וכרטיס סיום עם לוגו הדמו הגנרי (`public/media/demo/logo-demo.svg`, צורה מופשטת בלי שם).
3. מרנדר כל דוגמה בשלושת הפורמטים (9:16, 1:1, 16:9), כי `NicheShowcase` מציג "אותו סרטון, 3 פורמטים" (חלק 02 §3.5). לכל דוגמה נוצרים גם `{id}-poster.jpg` (פריים ב-1.2 שניות, בפורמט הראשי שבטבלה), `{id}.vtt`, ולולאה קצרה `{id}-loop.mp4` לתצוגה המקדימה של `VideoTile` (חמש השניות הראשונות ב-9:16, 540×960, בלי סאונד).
4. עם `--upload` הקבצים עולים ל-`public-media/demo/examples/{id}-{9x16|1x1|16x9}.mp4` ולשאר השמות שלמעלה, באותה תיקייה (מפתח סודי, `upsert`; `paths.pub.demoExample`, חלק 04 §13.4). בלי `--upload` הם נכתבים ל-`.demo-out/` לבדיקה ידנית. שום קובץ וידאו לא נשמר בריפו.
5. כל פריט שמציג סרטון כזה נושא את התווית **"הדגמה"** (בעמוד הדוגמאות: **"הדגמה (אנימטיק)"**), וה-`alt` שלו: **"סרטון הדגמה: {title_he}"**.

| דוגמה | איפה מופיעה | פורמטים (הראשי ראשון) |
|---|---|---|
| `restaurants-grill-30` | `NicheShowcase` למסעדות, `ShowcaseGallery`, עמוד הדוגמאות | 9:16 · 1:1 · 16:9 |
| `renovation-bathroom-30` | `NicheShowcase` לקבלני שיפוצים, `ShowcaseGallery`, עמוד הדוגמאות | 9:16 · 1:1 · 16:9 |
| `mortgage-mix-30` | `NicheShowcase` ליועצי משכנתאות, `ShowcaseGallery`, עמוד הדוגמאות | 9:16 · 1:1 · 16:9 |
| `dentists-brand-60` | `NicheShowcase` לרופאי שיניים, `ShowcaseGallery` (סרטון תדמית), עמוד הדוגמאות | 16:9 · 9:16 · 1:1 |
| `nails-hanukkah-15` | `NicheShowcase` למכוני ציפורניים, באנר העונה של חנוכה, `ShowcaseGallery`, עמוד הדוגמאות | 9:16 · 1:1 · 16:9 |

ברגע שיש ב-`examples` תוצר אמיתי מאותה נישה עם `is_published = true`, הוא מחליף את פריט ההדגמה באותו מקום (חלק 02 §3.5, §3.10).

### 9.2 דפי הנישה ו-fixtures נוספים

- **`niches.sample_scripts`** (חלק 02 §4.3): לנישות `restaurants`, `renovation-contractors`, `mortgage-advisors`, `dentists` ו-`beauty-nails` אפשר לגזור תסריט לדוגמה מהדוגמאות כאן, עם `toNicheSampleScript(script, hookId)` (כותרת, סוג, משך, הוק, ביטים בשלוש עמודות, הנעה, הסתייגויות). תוכן שחלק 02 כבר כתב לנישה גובר; ההמרה משלימה רק נישות בלי תוכן. זה מושג אחר מחמש הדוגמאות: לכל נישה פעילה יש בדיוק שלושה `SampleScript` שיווקיים.
- **MSW:** `tests/fixtures/openrouter/chat-script.sse` הוא ה-`ScriptV1` של דוגמה 1, מחולק ל-chunks של הסטרים של OpenRouter (כולל `usage.cost` בהודעה האחרונה; הדפדפן מקבל ממנו אירועי NDJSON `partial`/`done` דרך `POST /api/projects/[id]/script`, חלק 05 §3.5), ו-`chat-storyboard.json` עוטף את ה-`StoryboardV1` שלה בגוף תשובה של chat completion. כך בדיקות ה-e2e של האשף מראות טקסט עברי אמיתי.
- **`scripts/eval-prompts.ts`:** חמשת קובצי הקלט רצים כסט נוסף לצד 20 הבריפים (חלק 05 §23.5). התוצר החדש לא צריך להיות דומה לדוגמה; הוא צריך לעבור את אותן בדיקות ואת השופט.

### קריטריוני קבלה
- [ ] `pnpm demo:render` מייצר לחמש הדוגמאות 15 קובצי MP4 באורך מלא (5 × 3 פורמטים), 5 פוסטרים, 5 קובצי VTT ו-5 לולאות של 540×960, כל לולאה עד 1.2MB; עם `--upload` כולם נמצאים ב-`public-media/demo/examples/`, ובריפו נשאר רק `public/media/demo/logo-demo.svg`.
- [ ] אף אנימטיק לא מציג `{` או `}` על המסך.
- [ ] באתר השיווקי, כל סרטון הדגמה מסומן "הדגמה" ויש לו כתוביות ב-`<track srclang="he">`, ואף אחת מחמש הדוגמאות לא מופיעה ב-`VideoWall`.

# נספח E — מדריך סגנון לקופי בעברית

זה המדריך שלפיו נכתבת כל מילה עברית במוצר: מחרוזות הממשק, האתר השיווקי, המיילים, הזרע של ספריית ההוקים, והפלט של כל פרומפט יצירתי.
הגרסה שהמודלים מקבלים היא `sys.hebrew_style.v1` (חלק 05 §9), וכללי המיקרו-קופי של הממשק נמצאים בחלק 01 §2. הנספח לא מחליף אותם. הוא מסביר את ההיגיון ומוסיף את מה שחסר: רמת שפה לכל נישה, טבלאות הטיה, רשימת האיסורים המלאה, מספרים והקראה, ניסוחי ציות, וקופי נגיש.
כל כלל שאפשר לבדוק במכונה נאכף ב-`lib/hebrew/lint.ts` (חלק 05 §23.3), מתוך מקור נתונים אחד: `lib/ai/prompts/style-data.ts`.
בסוף הנספח יש 30 דוגמאות "לפני ואחרי" ורשימת בדיקה לסקירת עברית לפני השקה (M7), ואחריהן שני פרקים של הרחבת Meta: קופי למודעות, לטופסי לידים, לפרסום רגיל ולדף העסק (§18), ושפת הדוחות, התובנות והציונים (§19).

## §1. היקף, מקור אמת וסדר עדיפויות

| משטח | מי כותב | הכללים | איך נאכף |
|---|---|---|---|
| ממשק האפליקציה (`messages/he.json`) | הצוות, לפי חלקים 01–03 | חלק 01 §2 + הנספח | `pnpm lint:copy` (חלק 01 §2.6: ביטויים אסורים, לוכסנים, `!!`, `"` בתוך מילה, `...`, "הכל", ₪ שנכתב ידנית) |
| אתר שיווקי, בלוג, דפים משפטיים | הצוות, לפי חלק 02 | חלק 02 + הנספח | `pnpm lint:copy` על `messages.marketing` ועל `content/**/*.{mdx,json}` ב-CI |
| מיילים והתראות | הצוות, לפי חלק 06 | חלק 06 + הנספח | `pnpm lint:copy` על תבניות React Email |
| זרע ההוקים והנישות | `seed/scripts/build_seed.py` | ה-README של הזרע + הנספח | `build_seed.py --check`, ו-`lint` בזמן `pnpm db:seed` |
| תוצרי AI (הוקים, תסריטים, טקסט לפוסט, SEO) | המודלים | `sys.hebrew_style.v1` + תבניות חלק 05 | `S12`, `H07` (`lint`), ותיקון אחד אוטומטי |
| טקסט שהמשתמש כותב בעורך | המשתמש | — | אזהרות בלבד. כללי ציות חוסמים רק תוצרי AI (חלק 05 §21.3) |
| עריכות במסכי האדמין (הוקים, נישות, תבניות) | מנהלי פלטפורמה | הנספח | לוח הבדיקות באדמין (חלק 03) |
| קופי של קמפיין: מודעות, טופסי לידים, כיתוב לפרסום רגיל, דף העסק (`ads.copy.v1`, `post.caption.v2`, `landing.copy.v1`, ועריכות של המשתמש בבונה) | המודלים והמשתמש | §18 + הנספח | `lint` (כולל `HE026`), ולידציית Zod לפי §12, `moderation.ad.v1` לפני ההכנה ולפני הפרסום, ושער הבטיחות `adEligibility` (חלק 07). עריכה של המשתמש מקבלת אזהרות, ו-`moderation.ad.v1` מחליט על חסימה |
| דוחות, תובנות וציונים (`ads.insight_explain.v1`, `ads.health_check.v1`, `plan.month.v1`, `hooks.score.v1`, הסיכום השבועי, המחרוזות של `app.campaigns.*`) | המודלים והצוות | §19 + הנספח | ולידציה סמנטית (כל מספר בפלט קיים בקלט, פעולות רק מהרשימה הסגורה), `HE027`, `lint:copy` עם `ADS_JARGON`, ותבנית דטרמיניסטית כשהפלט נפסל (חלק 07) |

**סדר עדיפויות:** הטקסט של `sys.hebrew_style.v1` ושל תבניות הפרומפט (חלק 05) קובע לתוצרי AI. חלק 01 §2 קובע למחרוזות ממשק. הנספח משלים כל מה ששניהם לא מכסים. אם נמצאה סתירה, החלק גובר על הנספח, והסתירה נרשמת ב-`DECISIONS.md` ומתוקנת כאן.

**מקור נתונים אחד:**

```ts
// lib/ai/prompts/style-data.ts — imported by sys.hebrew_style.v1, lib/hebrew/lint.ts, the seed checker and the admin hook editor
export const BANNED_PHRASES: readonly string[];                         // §5.2 — error HE001, everywhere
export const TRANSLATED_PATTERNS: readonly { re: RegExp; hintHe: string }[]; // §5.3 — warning HE018
export const BUREAUCRATIC_WORDS = ["ניתן", "הינו", "הינה", "הננו", "על מנת", "במידה ו", "בכפוף ל"] as const; // HE019 in casual/slang (the banned ones also hit HE001)
export const SLANG_BY_REGISTER: Record<Register, readonly string[]>;   // §3.4
export const REGISTER_DEFAULTS: Record<string, { register: Register | null; audience: AudienceGender | null; cta: CtaType | null }>;
  // §3.3 — DERIVED at module load from supabase/seed/data/niche_extras.json (the only copy of the table; part 04 §16.1).
  // Runtime code reads niches.default_* from the DB; this map serves lint, eval-prompts and the admin hook editor.
export const LENGTH_LIMITS: LengthLimits;                                // §12 (incl. ad_*, lead_form_*, ig_*, overlay and landing_* keys)
export const PERSONAL_ATTRIBUTE_PATTERNS: readonly { re: RegExp; hintHe: string }[]; // §18.4 — HE026 in paid copy (ads, lead forms, landing pages)
export const RESULTS_BANNED_PHRASES: readonly string[];                 // §19.6 — HE027 in results copy, ad copy and landing pages
export const ADS_JARGON: readonly string[];                             // §19.6 — lint:copy in campaign/lead/publish strings outside the "advanced" allow-list
export const HEBREW_CHARS = { gershayim: "\u05F4", geresh: "\u05F3", ellipsis: "\u2026", enDash: "\u2013", minus: "\u2212", arrow: "\u2190", nbsp: "\u00A0" } as const;
```

### קריטריוני קבלה
- [ ] `lint`, הבדיקה של `messages/he.json`, בודק הזרע ועורך ההוקים באדמין מייבאים את הרשימות מ-`style-data.ts` בלבד (grep: אין רשימת ביטויים אסורים בשום קובץ אחר).
- [ ] שינוי ב-`BANNED_PHRASES` משנה גם את הטקסט שנשלח למודל בסעיף 11 של `sys.hebrew_style.v1` (snapshot מתעדכן באותו PR).

## §2. הקול

{{BRAND_NAME}} כותב כמו במאי-מפיק ותיק שעובד בשביל בעל העסק (חלק 01 §1.2). בסרטונים עצמם הקול הוא של **העסק**, לא שלנו: בעל מקצוע ישראלי שמדבר עם הלקוחות שלו, ישר ובחום.

| # | עיקרון | ✗ לא | ✓ כן |
|---|---|---|---|
| 1 | מדברים כמו בעל מקצוע, לא כמו משרד פרסום | "אנו מתמחים במגוון רחב של פתרונות שיפוץ" | "אנחנו משפצים חדרי רחצה. עשרה ימי עבודה, לוח זמנים בחוזה." |
| 2 | פרט מוחשי אחד במקום שלושה שמות תואר | "אוכל איכותי, טרי ומפנק" | "פיתות מהטאבון ושיפודים על גחלים" |
| 3 | משפט אחד, רעיון אחד | "אנחנו מציעים טיפולים מתקדמים ומקצועיים בסביבה נעימה ומרגיעה עם צוות מנוסה" | "התור הראשון הוא שיחת היכרות. בלי מקדחה ובלי הפתעות." |
| 4 | פעלים בקופי, שמות פעולה בכפתורים | "ביצוע התאמה אישית של התפריט לאירוע" | "מתאימים את התפריט לאירוע" (ובכפתור: "שמירה") |
| 5 | אמת לפני הכול | "אלפי לקוחות מרוצים" | "4.8 בגוגל, מ-1,240 ביקורות" (רק כשזו עובדה מאושרת) |
| 6 | חום בלי חנופה | "לקוחות יקרים ונפלאים שלנו" | "אנחנו יודעים כמה קשה לבחור. בגלל זה מתחילים בשיחה." |
| 7 | ישירות בלי גסות | "די לקבלנים הנוכלים" | "הפחד הכי גדול בשיפוץ? קבלן שנעלם באמצע." |
| 8 | הומור במינון, אף פעם על חשבון הלקוח | "אם אתם עדיין גרים עם האריחים האלה, משהו לא בסדר אצלכם" | "האמבטיה הזאת חיכתה מספיק." |
| 9 | בלי מילים ריקות | "חוויה", "פתרון", "מושלם", "ייחודי" (בלי פירוט) | מה בדיוק קורה, מה מקבלים, כמה זמן זה לוקח |
| 10 | כל משפט עובד בקול רם | "בשל העובדה שהביקוש גבוה, מומלץ להקדים" | "יש עומס בחגים. כדאי לקבוע מוקדם." |

**שגיאות לשון שחוזרות בטקסטים שיווקיים, ומה כותבים:**

| ✗ | ✓ | הערה |
|---|---|---|
| הכל | הכול | כתיב מלא (`HE005`) |
| תכנית, צהרים, שעור, מאד | תוכנית, צהריים, שיעור, מאוד | כתיב מלא לפי כללי האקדמיה ללשון העברית |
| שתיים שעות | שתי שעות | "שתיים" רק בלי שם עצם אחריו |
| שלושה שעות / שלוש ימים | שלוש שעות / שלושה ימים | מין המספר הפוך למין שם העצם |
| מאה שקל (ברמה רשמית) | מאה שקלים | ברמות `casual`/`slang` "מאה שקל" תקין בדיבור |
| יותר טוב מ (ברמה רשמית) | טוב יותר מ | ברמות הקלילות שתי הצורות תקינות |
| בשבילכן (לקהל מעורב) | בשבילכם | נקבה רבות רק כשהקהל כולו נשים והבריף אומר זאת |
| אני יבוא / אני יגיד | אני אבוא / אני אגיד | גם בסלנג |
| למרות ש... אז | למרות ש... | בלי "אז" כפול |

### קריטריוני קבלה
- [ ] סקירת העברית של M7 (בידי מי שעברית היא שפת האם שלו, חלק 06 §24) עוברת על 50 מחרוזות אקראיות מכל namespace ועל 20 תסריטים, ומסמנת כל הפרה של טבלת העקרונות.
- [ ] `TRANSLATED_PATTERNS` כולל את כל הצורות בעמודה ✗ של טבלת השגיאות שאפשר לזהות בביטוי רגולרי (שתיים + שם עצם, אני יבוא); "הכל" נתפס בכלל הנפרד `HE005`.

## §3. רמת שפה (`register`)

### 3.1 ארבע הרמות

| `register` | תווית בממשק | למי | משפטים | מותר | אסור | הומור |
|---|---|---|---|---|---|---|
| `formal` | רשמי | עורכי דין, רואי חשבון, פיננסים, רופאים, יזמי נדל״ן, B2B | עד 14 מילים, מלאים ומדויקים | מונחים מקצועיים עם הסבר קצר; "כדאי", "חשוב לדעת" | סלנג, "תכלס", בדיחות, וגם ביורוקרטיה: "הננו", "הינו", "על מנת", "במידה ו" | לא |
| `warm` | חם | מטפלים, קליניקות, סטודיו קטן, צימרים, שיפוצים, עיצוב פנים | 8–12 מילים, בגובה העיניים | "ממש", "באמת", "בשקט", "בלי לחץ"; גוף ראשון של בעל העסק | סלנג רשת, "פצצה", צעקות | עדין, על המצב ולא על אנשים |
| `casual` | קליל | מסעדות, בעלי מקצוע, חנויות, רכב, הובלות | 5–10 מילים, קצב מהיר | "תכלס", "אחלה", "סבבה", "בכיף", "שקל" ביחיד, משפטים חלקיים ("ברצינות.") | גסויות, סלנג כבד | כן, ישראלי ומוכר |
| `slang` | סלנג | ברברשופ, חיי לילה, כושר לצעירים, DJ | 3–8 מילים | "וייב", "פצצה", "מטורף", "דיל", "אש", "POV" (על המסך) | גסויות, עלבונות, רמיזות מיניות, "בלי חרטא" בנישה מוסדרת | כן, אבל לא על חשבון הלקוח |

### 3.2 אותו מסר בארבע רמות

| מסר | `formal` | `warm` | `casual` | `slang` |
|---|---|---|---|---|
| הוק (הוכחה) | "לפני שחותמים על משכנתא, כדאי לבדוק את התמהיל." | "אנחנו יודעים כמה מלחיץ לחתום. בגלל זה בודקים יחד." | "חותמים על משכנתא? רגע, תבדקו קודם את התמהיל." | — (לא מתאים לנישה) |
| הנעה לפעולה | "השאירו פרטים ונחזור אליכם לתיאום פגישה." | "שלחו לנו הודעה, ונקבע שיחה בלי לחץ." | "שלחו וואטסאפ, ונסגור את זה." | "שלחו הודעה. סוגרים תור ויאללה." |
| תיאור שירות | "ליווי מלא מהאישור העקרוני ועד החתימה." | "אנחנו איתכם מהאישור העקרוני ועד החתימה." | "מהאישור ועד החתימה, אנחנו על זה." | "מהאישור ועד החתימה, סגור." |
| מבצע | "בחודש נובמבר: פגישת ייעוץ ראשונה ללא עלות." | "בנובמבר הפגישה הראשונה עלינו." | "בנובמבר? פגישה ראשונה עלינו." | "נובמבר: פגישה ראשונה עלינו. דיל." |

המבצע בטבלה הוא דוגמה לניסוח בלבד. במוצר הוא מופיע רק אם הוא כתוב ב-`brief.offer` או בעובדות.
משפטי הדוגמה של האונבורדינג (`app.onboarding.samples.{audience}.{register}`, 3 פניות × 4 רמות = 12 מחרוזות, חלק 03 §4.3) נלקחים מהטבלה הזו, ומוטים לנקבה ולזכר לפי טבלה 4.4.

### 3.3 ברירות מחדל לפי נישה

הטבלה הזו היא ערכי ההשקה של העמודות `niches.default_register`, `niches.default_audience_gender` ו-`niches.default_cta`. הם נטענים ל-DB מהקובץ `supabase/seed/data/niche_extras.json` (חלק 04 §16.1, מצב `fill_if_null`: עמודה נכתבת רק כשהיא NULL, כך שעריכה של מנהל ב-`/admin/niches` לא נדרסת), ו-`REGISTER_DEFAULTS` נגזר מאותו קובץ. המשתמש בוחר פנייה וטון באונבורדינג (חלק 03 §4.3) ויכול לשנות אותם לכל פרויקט באשף (חלק 03 §6.3, `ToneAndAddressFields`). סוג ההנעה נבחר לפי הכלל של §11.1: עסק מקומי — וואטסאפ קודם; תורים — `booking`; שירות דחוף — `call`; פיננסים מפוקחים ו-B2B — `lead_form`.

| `slug` | `default_register` | `default_audience_gender` | `default_cta` | הערות טון |
|---|---|---|---|---|
| `real-estate` | `warm` | `plural` | `whatsapp` | מקצועי וחם; מחיר מבוקש אינו מחיר עסקה |
| `real-estate-developers` | `formal` | `plural` | `lead_form` | שפת פרויקט, בלי "השקעה בטוחה" |
| `aesthetic-clinics` | `warm` | `plural` | `booking` | רגיש לגוף; גוף שלישי, בלי לפני ואחרי בלי הסתייגות |
| `beauty-nails` | `casual` | `female` | `booking` | קליל, צבעוני; פנייה בנקבה היא ברירת המחדל היחידה שאינה רבים |
| `barbers-salons` | `slang` | `plural` | `booking` | צעיר וחד; "POV" על המסך עובד |
| `restaurants` | `casual` | `plural` | `whatsapp` | חושני (טעם, ריח, אדים), הומור מותר |
| `fitness-trainers` | `casual` | `plural` | `whatsapp` | אנרגטי; בלי בושה גופנית ובלי הבטחת קילוגרמים |
| `yoga-pilates` | `warm` | `plural` | `booking` | רגוע, נשימה, בלי סלנג |
| `renovation-contractors` | `warm` | `plural` | `whatsapp` | אמין ומעשי; "שלחו תמונות" |
| `dentists` | `warm` | `plural` | `booking` | מרגיע; בלי "ללא כאב" |
| `mortgage-advisors` | `formal` | `plural` | `lead_form` | מסביר, לא מבטיח |
| `event-venues` | `warm` | `plural` | `whatsapp` | חגיגי ומאופק |
| `ecommerce` | `casual` | `plural` | `visit_site` | מוצר במרכז, מחיר רק אמיתי |
| `car-dealers` | `casual` | `plural` | `whatsapp` | ישיר; תנאי מימון רק עם הסתייגות |
| `auto-services` | `casual` | `plural` | `whatsapp` | פרקטי, "מה מקבלים ומתי" |
| `lawyers` | `formal` | `plural` | `whatsapp` | מכובד; בלי "הכי טוב", בלי המלצות |
| `accountants` | `formal` | `plural` | `whatsapp` | ענייני; לא מצטטים תקרות בלי לוודא |
| `insurance-agents` | `formal` | `plural` | `lead_form` | בלי פנייה למצב כלכלי או בריאותי |
| `interior-design` | `warm` | `plural` | `whatsapp` | אסתטי, חומרים ואור |
| `event-photographers` | `warm` | `plural` | `whatsapp` | רגשי; צילומי אנשים רק בהסכמה |
| `djs-musicians` | `slang` | `plural` | `whatsapp` | אנרגיה, רחבה |
| `zimmers-boutique-hotels` | `warm` | `plural` | `whatsapp` | שקט, נוף, זוגיות |
| `tourism-attractions` | `casual` | `plural` | `booking` | חוויה עם פרטים: כמה זמן, למי מתאים |
| `courses-educators` | `warm` | `plural` | `whatsapp` | מעודד, בלי הבטחת הכנסה |
| `therapists` | `warm` | `plural` | `whatsapp` | רך ביותר; בלי המלצות מטופלים, בלי הבטחת שיפור |
| `vets-dog-grooming` | `warm` | `plural` | `whatsapp` | חם ומשפחתי |
| `driving-schools` | `casual` | `plural` | `whatsapp` | צעיר וקליל, בלי הבטחת "עוברים בטסט ראשון" |
| `kids-activities` | `warm` | `plural` | `whatsapp` | פונה להורים; אין ילדים בתמונות שנוצרות |
| `home-services` | `casual` | `plural` | `call` | דחוף ופרקטי: "מגיעים היום" רק אם נכון |
| `movers-storage` | `casual` | `plural` | `whatsapp` | הומור על מעבר דירה, בלי שעות שלא אושרו |
| `retail-stores` | `casual` | `plural` | `navigate` | "קפצו לחנות" |
| `catering-chefs` | `warm` | `plural` | `whatsapp` | חגיגי; כשרות רק עם תעודה |
| `b2b-startups` | `formal` | `plural` | `lead_form` | בהיר, בלי באזוורדים |
| `nonprofits` | `warm` | `plural` | `visit_site` | מכבד, בלי סחטנות רגשית |
| `local-politics` | — | — | — | הנישה לא פעילה בהשקה (`is_active = false`) |
| `physio-nutrition` | `warm` | `plural` | `booking` | בלי "ריפוי"; בלפני ואחרי — עם הסתייגות |

### 3.4 מילון הסלנג לפי רמה (`SLANG_BY_REGISTER`)

- `formal`: אין.
- `warm`: ממש, באמת, בשקט, בלי לחץ, בגובה העיניים, בנחת.
- `casual`: כל מה שב-`warm`, ובנוסף: תכלס, אחלה, סבבה, בכיף, לגמרי, ברצינות, מפוצצים (אוכל), סגרנו.
- `slang`: כל מה שב-`casual`, ובנוסף: יאללה, וייב, פצצה, מטורף, אש, דיל, על הכיפאק, חבל על הזמן, POV (על המסך).
- **אסור בכל רמה:** גסויות, קללות, "פראייר" כעלבון ללקוח, רמיזות מיניות, כינויי גנאי לקבוצות.
- **`HE019`:** מילה ביורוקרטית ("ניתן", "בכפוף ל") ברמת `casual` או `slang` מקבלת אזהרה. הכיוון ההפוך — מילת סלנג מהרמה `slang` בתסריט ברמת `formal` או `warm` — אין לו קוד lint: הוא נתפס בקריטריון "התאמה לנישה ולקהל" של השופט ב-`scripts/eval-prompts.ts` (חלק 05 §23.5) ובסעיף רמת השפה של רשימת הבדיקה §17.

### קריטריוני קבלה
- [ ] `supabase/seed/data/niche_extras.json` זהה לטבלה הזו בכל 36 השורות (בדיקת יחידה), ו-`pnpm db:seed` ממלא את שלוש העמודות בכל 35 הנישות הפעילות; `local-politics` נשאר עם `NULL`, וערך שמנהל כבר שינה לא נדרס בהרצה חוזרת.
- [ ] בפרויקט חדש בנישה `beauty-nails`, האשף מציע פנייה בנקבה; בכל נישה אחרת — ברבים.
- [ ] סקירה ידנית: כל הוק בזרע בנישה עם `default_register = formal` נשמע רשמי ולא ביורוקרטי.

## §4. פנייה ומגדר

### 4.1 איזו פנייה, איפה

| משטח | הפנייה | מקור הערך |
|---|---|---|
| אתר שיווקי, ספריית הוקים ציבורית, בלוג, דפים משפטיים | רבים, תמיד | — |
| ממשק האפליקציה | רבים כברירת מחדל; נקבה או זכר לפי בחירת המשתמש | `profiles.ui_gender_form` דרך ICU `select` (חלק 01 §2.2) |
| מיילים והתראות | כמו בממשק | `ui_gender_form` של הנמען |
| סרטון: קריינות, טקסט על המסך, כרטיס סיום, טקסט לפוסט | לפי הפרויקט | `projects.audience_gender` |
| דובר בגוף ראשון בסרטון | לפי הקול | `projects.voice_gender` |
| העסק מדבר על עצמו | רבים ("אנחנו מגיעים") | רבות ("אנחנו מגיעות") רק כשהבריף אומר שהצוות כולו נשים |

**כלל הברזל:** פנייה אחת מההתחלה ועד הסוף, בכל השדות של אותו תוצר. הוק בנקבה עם הנעה ברבים הוא שגיאה (`HE014`).

### 4.2 צורות אסורות

| ✗ | למה | ✓ |
|---|---|---|
| הזמן/י, מוזמנים/ות | אי אפשר להקריא; נראה כמו טופס ממשלתי (`HE002`) | הזמינו · מוזמנים לבוא |
| בעל·ת עסק, לקוח·ה | נקודה מגדרית (`HE003`) | בעלי עסקים · מי שמנהל עסק |
| לקוח(ה), מטפל(ת) | סוגריים מגדריים (`HE003`) | לקוחות · אנשי הטיפול |
| אתה ואת, מוזמנים ומוזמנות | כפילות; ארוך ומסורבל | אתם · מוזמנים |
| בחר/בחרי (שתי אפשרויות בכפתור) | כפתור עם שתי צורות | "בחירה" (שם פעולה) או "בחרו" |

### 4.3 איך עוקפים מגדר בלי להישמע מתורגמים

| טכניקה | מתי | דוגמה |
|---|---|---|
| ציווי ברבים | ברירת המחדל לכל קריאה לפעולה | "שלחו לנו וואטסאפ", "בדקו את התמהיל" |
| שם פעולה | כפתורים ופעולות מערכת (חלק 01 §2.1) | "שמירה", "הורדה", "יצירה מחדש" |
| "אפשר" / "כדאי" + שם פועל | עצות והסברים | "כדאי לבדוק את זה לפני החתימה" |
| "מי ש…" | פנייה לקהל מסוים בלי להניח מגדר | "מי שמחפש דירה ראשונה צריך לדעת את זה" |
| סביל או סתמי | הודעות מערכת | "הסרטון יישלח למייל כשיהיה מוכן" |
| "בואו" + עתיד ברבים | הזמנה רכה | "בואו נבדוק יחד" |
| גוף שלישי | נישות מוסדרות ופרסום ממומן | "הרבה אנשים דוחים טיפול שנים" |

### 4.4 טבלת הטיה לפעלים ולמילים הנפוצות

| רבים (`plural`) | נקבה (`female`) | זכר (`male`) | הערה להקראה |
|---|---|---|---|
| בואו | בואי | בוא | |
| שלחו | שלחי | שלח | |
| התקשרו | התקשרי | התקשר | |
| קבעו | קבעי | קבע | |
| כתבו | כתבי | כתוב | |
| שמרו | שמרי | שמור | |
| בדקו / תבדקו | בדקי / תבדקי | בדוק / תבדוק | |
| גלו | גלי | גלה | |
| הזמינו | הזמיני | הזמן | |
| השאירו | השאירי | השאר | |
| נווטו | נווטי | נווט | |
| צרו | צרי | צור | |
| נסו | נסי | נסה | |
| תגידו | תגידי | תגיד | |
| אתם | את | אתה | |
| לכם | לך | לך | בנקבה "לָךְ", בזכר "לְךָ" — לנקד בהקראה |
| שלכם | שלך | שלך | "שֶׁלָּךְ" / "שֶׁלְּךָ" — לנקד |
| בשבילכם | בשבילך | בשבילך | "בִּשְׁבִילֵךְ" / "בִּשְׁבִילְךָ" — לנקד |
| אצלכם | אצלך | אצלך | "אֶצְלֵךְ" / "אֶצְלְךָ" — לנקד |
| רוצים | רוצה | רוצה | "רוֹצָה" / "רוֹצֶה" — לנקד כשההקשר לא מכריע |
| מוכנים | מוכנה | מוכן | |
| מחפשים | מחפשת | מחפש | |
| יכולים | יכולה | יכול | |
| מגיעים | מגיעה | מגיע | |

### 4.5 הדובר בגוף ראשון

| קול נשי | קול גברי |
|---|---|
| אני ממליצה | אני ממליץ |
| אני בודקת | אני בודק |
| אני מסבירה | אני מסביר |
| אני יודעת | אני יודע |
| אני בטוחה | אני בטוח |
| אני מאמינה | אני מאמין |
| אני מחכה (מְחַכָּה) | אני מחכה (מְחַכֶּה) — זהה בכתב, לנקד או לבחור פועל אחר |
| אני משווה (מַשְׁוָה) | אני משווה (מַשְׁוֶה) — זהה בכתב, עדיף פועל אחר ("אני מניחה זו מול זו") |

כשהצורה הכתובה זהה בזכר ובנקבה, בוחרים פועל אחר או מנקדים בטקסט להקראה. זו הסיבה שבנספח D, דוגמה 3, הקריינית אומרת "ומניחה" ולא "ומשווה".

### 4.6 הוקים בספרייה ומגדר

השדה `gender` בהוקים (`neutral`, `plural`, `female`, `male`) מתאר את הצורה שבה ההוק כתוב בזרע. `neutral` הוא הוק שלא פונה לאף אחד ("הדירה הזאת נמכרה תוך 9 ימים"), ולכן מתאים לכל פרויקט בלי שינוי. בכל צורה אחרת, כשהפנייה של הפרויקט שונה, ההוק עובר `hooks.inflect.v1` לפני השימוש, והתוצאה צריכה לשמור על דמיון של 0.6 לפחות להוק המקורי (`S13`). בספרייה הציבורית ההוקים מוצגים תמיד בצורה שבזרע; בתוך האפליקציה, בצורה של הפרויקט.

### קריטריוני קבלה
- [ ] `HE014` מזהה כל ערבוב של שתי צורות מטבלה 4.4 באותו תוצר, ולא מתריע על הוקים `neutral`.
- [ ] `HE015` מזהה כל זוג מטבלה 4.5 שלא מתאים ל-`voice_gender` (חוץ מהשורות שזהות בכתב).
- [ ] כל `select` על `g` ב-`messages/he.json` משתמש בצורות של טבלה 4.4, ונבדק בבדיקת היחידה של חלק 01 §2.2.

## §5. ביטויים שעובדים, ביטויים אסורים

### 5.1 ביטויים ישראליים שעובדים

| ביטוי | רמה מינימלית | מתי | דוגמה |
|---|---|---|---|
| ברצינות | `casual` | חיזוק אחרי משפט מפתיע | "אל תבואו אלינו רעבים. ברצינות." |
| בלי אותיות קטנות | `warm` | מחירים ותנאים שקופים | "כמה עולה שתל? בלי אותיות קטנות." |
| בגובה העיניים | `warm` | שירות אישי | "מסבירים בגובה העיניים, כל שלב." |
| בלי הפתעות | `formal` | שקיפות במחיר או בתהליך | "הצעת מחיר כתובה, בלי הפתעות." |
| מה שרואים זה מה שמקבלים | `warm` | מוצר או עבודה מצולמת | "התמונות מהפרויקט עצמו. מה שרואים זה מה שמקבלים." |
| תכלס | `casual` | מעבר לשורה התחתונה | "תכלס? עשרה ימי עבודה." |
| עוד שבוע מסיים | `casual` | הומור מוכר על קבלנים | "קבלן שאומר 'עוד שבוע' כבר שלושה חודשים? מכירים." |
| ארוחת שישי | `warm` | אוכל, משפחה, אירוח | "טעם של ארוחת שישי, גם ביום שלישי." |
| פקק באיילון | `casual` | זמן, נוחות, מיקום | "בזמן שאתם בפקק באיילון, אנחנו כבר מבשלים." |
| רק בישראל | `casual` | הומור מקומי עדין | "רק בישראל מזמינים חומוס לפני הקפה." |
| סגרנו | `casual` | סגירת עסקה או תור | "שלחו תאריך, וסגרנו." |
| על הכיפאק | `slang` | שביעות רצון, רק בסלנג | "תספורת על הכיפאק, בלי לחכות." |
| וייב | `slang` | אווירה | "הווייב של שישי בצהריים, כל ערב." |
| דוגרי | `casual` | כנות | "דוגרי: זה לא מתאים לכולם." |
| שווה את הנסיעה | `casual` | עסק שמחוץ לעיר | "שווה את הנסיעה מהמרכז." |

הומור ישראלי מוכר (הקבלן ש"עוד שבוע", הפקק, ארוחת שישי) מותר כשהוא מתאים לנישה ולרמה. הומור על מלחמה, טרור, שכול, מילואים כבדיחה, דת, עדות, פוליטיקה או מראה חיצוני — אסור, בכל רמה (חלק 05 §9, סעיף 10). פנייה למילואימניקים מותרת כהטבה אמיתית ובטון מכבד, לא כגימיק.

### 5.2 ביטויים אסורים (`BANNED_PHRASES`, `HE001`, שגיאה בכל משטח)

זו הרשימה הקנונית היחידה: `BANNED_PHRASES` ב-`lib/ai/prompts/style-data.ts` מכיל את 46 השורות, לפי הסדר. ממנה נבנה סעיף 11 של `sys.hebrew_style.v1` (משפט פתיחה קבוע ואחריו הרשימה, חלק 05 §9), וממנה מייבאים `lib/hebrew/lint.ts` (`HE001`), `pnpm lint:copy` (חלק 01 §2.6) ובודק הזרע (חלק 04 §16.2). ביטוי חדש נוסף כאן ובקוד באותו PR, וה-snapshot של הפרומפט מתעדכן איתו.

| # | ביטוי | למה אסור | מה כותבים במקום |
|---|---|---|---|
| 1 | קחו את העסק לשלב הבא | הקלישאה המתורגמת המפורסמת ביותר | מה בדיוק משתנה: "רילס מוכן לשבוע הזה" |
| 2 | לשלב הבא | אותו דבר, בכל הקשר | השלב עצמו: "לפגישה הראשונה", "לתור" |
| 3 | פתרון חדשני ומקיף | ריק, נשמע כמו מצגת | מה עושים: "מחליפים אריחים בלי לשבור את הקירות" |
| 4 | פתרון חדשני | ריק | אותו דבר |
| 5 | הפתרון המושלם | הבטחה שאי אפשר לקיים | "מתאים במיוחד ל…" |
| 6 | בעולם של היום | תרגום של "In today's world" | ישר לעניין |
| 7 | בעידן הדיגיטלי | קלישאה | ישר לעניין |
| 8 | בעידן של היום | קלישאה | ישר לעניין |
| 9 | זה הזמן ל… | תרגום של "It's time to" | הסיבה האמיתית: "לפני החגים יש עומס, לכן…" |
| 10 | האם ידעתם ש… | תרגום של "Did you know"; פתיחה איטית | הנתון עצמו, ורק אם הוא בעובדות |
| 11 | האם ידעת ש… | אותו דבר, ביחיד | אותו דבר |
| 12 | אתם לא תאמינו | Clickbait מתורגם | מה קרה: "המטבח הזה עלה {מחיר} ₪" |
| 13 | אתה לא תאמין | אותו דבר | אותו דבר |
| 14 | חוויה בלתי נשכחת | ריק | מה קורה בחוויה: "ארוחה של שלוש שעות על הגריל" |
| 15 | ברמה הגבוהה ביותר | סופרלטיב שאי אפשר להוכיח | הפרט המקצועי: "איטום בשתי שכבות" |
| 16 | ללא פשרות | ריק | על מה לא מתפשרים, בפועל |
| 17 | שירות מקצועי ואדיב | כל עסק אומר את זה | הוכחה: "עדכון יומי בוואטסאפ" |
| 18 | יחס אישי ומקצועי | אותו דבר | "התור הראשון הוא שיחת היכרות" |
| 19 | המקום המושלם עבורכם | הבטחה ריקה, ו"עבורכם" רשמי מדי | "מתאים למי ש…" |
| 20 | הצטרפו למהפכה | מתלהב ומתורגם | פעולה אחת עם תמורה: "התחילו עם {trialCredits} קרדיטים לניסיון" |
| 21 | המסע שלכם מתחיל כאן | תרגום של "Your journey starts here" | מה קורה בצעד הראשון |
| 22 | הגעתם למקום הנכון | קלישאה של דפי נחיתה | מה יש כאן: "כל ההוקים לנדל״ן, לפי סוג" |
| 23 | כל מה שצריך במקום אחד | ריק | מה בדיוק כלול |
| 24 | תנו לנו לעשות את העבודה בשבילכם | מתורגם ומתנשא | "אתם מאשרים, אנחנו מכינים" |
| 25 | אנחנו כאן בשבילכם | ריק | שעות, ערוץ ומי עונה: "שלחו הודעה" |
| 26 | צוות מקצועי ומנוסה | לא אומר כלום | כמה שנים, מה עשו — רק מהעובדות |
| 27 | שנים רבות של ניסיון | מעורפל ונשמע כמו הסתרה | המספר המאושר: "12 שנות ניסיון" |
| 28 | המובילים בתחום | סופרלטיב בלי הוכחה; אסור בנישות מוסדרות | מה עושים אחרת |
| 29 | סטנדרט חדש של… | ריק | הפרט שמשנה |
| 30 | הצעה שאי אפשר לסרב לה | קלישאה, ונשמעת לחץ | ההצעה עצמה ותוקפה |
| 31 | הזדמנות של פעם בחיים | דחיפות מזויפת | דחיפות אמיתית בלבד: "עד מוצאי חנוכה" |
| 32 | אל תפספסו את ההזדמנות | דחיפות מזויפת | מה יש ועד מתי |
| 33 | מחירים שלא תמצאו בשום מקום אחר | טענה השוואתית שאי אפשר להוכיח | המחיר עצמו, מהעובדות |
| 34 | תוצאות מדהימות | הבטחה; אסור ברפואה, במשפט ובפיננסים | תיאור התהליך |
| 35 | חוויית לקוח מושלמת | ריק | מה הלקוח מקבל |
| 36 | בינה מלאכותית מהפכנית | מתלהב; לא מה שמוכרים | מה הלקוח מקבל: "סרטון מוכן תוך דקות" |
| 37 | צרו קשר עוד היום | מתורגם, בלי ערוץ | "שלחו וואטסאפ" / "התקשרו" |
| 38 | פשוט. מהיר. יעיל. | שלושה שמות תואר ריקים | יתרון מוחשי אחד |
| 39 | עומדים לרשותכם | ביורוקרטי | "אפשר לכתוב לנו בכל שאלה" |
| 40 | הננו | ביורוקרטי | "אנחנו" או בלי |
| 41 | הינו | ביורוקרטי | "הוא" או בלי |
| 42 | הינה | ביורוקרטי | "היא" או בלי |
| 43 | במידה ו… | ביורוקרטי ושגוי | "אם" |
| 44 | על מנת | ביורוקרטי | "כדי" |
| 45 | !! | צעקה | נקודה, או סימן קריאה אחד |
| 46 | חוויית משתמש מושלמת | ריק ומתורגם ("perfect user experience") | מה המשתמש עושה ומה מקבל: "בוחרים הוק, ומקבלים סרטון" |

ביטויים 40–42 נבדקים כמילה שלמה בלבד ("הינה" ולא "הנה"). שאר הביטויים נבדקים כרצף, אחרי נרמול רווחים, הסרת ניקוד והמרת ״ ו-׳ ל-" ו-'. "זה הזמן ל…", "האם ידעתם ש…" ו"במידה ו…" נבדקים בלי שלוש הנקודות: "זה הזמן ל" תופס גם "זה הזמן לחדש".

### 5.3 צורות שנשמעות מתורגמות (`TRANSLATED_PATTERNS`, `HE018`, אזהרה)

| צורה | למה | במקום |
|---|---|---|
| בואו נדבר על… | הקדמה מיותרת | ישר לנושא |
| קבלו את… | תרגום של "Meet" / "Get" | "ככה נראה…", "הנה…" |
| אנחנו מאמינים ש… | הצהרה במקום הבטחה | הבטחה קונקרטית אחת |
| לחצו על הקישור למטה (בסרטון) | ברילס אין "למטה" | "הקישור בביו" |
| זה משנה את כל התמונה | ריק | מה בדיוק משתנה |
| אנחנו גאים להציג | רשמי ומתורגם | פשוט להציג |
| מעל ומעבר | קלישאה מתורגמת | מה עשיתם בפועל |
| ברוכים הבאים לעולם של… | פתיחה איטית | המסר במילה הראשונה |
| כל מה שאתם צריכים לדעת על… | כותרת גנרית | המספר והנושא: "3 דברים לבדוק לפני…" |
| מושלם ל… | הבטחה ריקה | "מתאים ל…" |
| ביצוע של… / ביצוע עבודות | שם פעולה כבד | פועל: "מבצעים", "עושים" |
| בצורה מקצועית / באופן אישי | תואר הפועל ריק | איך בדיוק |
| ניתן ל… (ברמה קלילה) | רשמי מדי | "אפשר ל…" |
| שתיים + שם עצם ("שתיים שעות") | שגיאה | "שתי שעות", "שעתיים" |

### קריטריוני קבלה
- [ ] כל 46 השורות של §5.2 נמצאות ב-`BANNED_PHRASES`, באותו סדר (סעיף 11 של `sys.hebrew_style.v1` מציג אותן כך), וקובץ `tests/fixtures/hebrew-lint-cases.json` כולל מקרה חיובי ומקרה שלילי לכל אחת (למשל "הנה" לא נתפס כ"הינה").
- [ ] 326 ההוקים בזרע ו-`messages/he.json` לא מכילים אף ביטוי מ-§5.2 (בדיקה ב-CI).
- [ ] `HE018` מופיע כאזהרה ב-`PromptTester` ובלוח הבדיקות באדמין, ולא חוסם שמירה.

## §6. מספרים, מטבע, תאריכים ושעות

### 6.1 איפה כותבים מה

יש כלל אחד למיקום ה-₪, עם ארבעה חריגים מוגדרים. אותו כלל מופיע בחלק 01 §2.1 סעיף 20, וכל החלקים פועלים לפיו:

| משטח | מספרים | מחיר בשקלים | מקור הכלל |
|---|---|---|---|
| **הכלל:** ממשק האפליקציה, אדמין, האתר השיווקי, בלוג, דפים משפטיים, מיילים, הודעות וואטסאפ, שורות חשבונית שאנחנו מייצרים | ספרות, דרך `Num` / `Price` | **"₪119"** — ₪ לפני המספר, בלי רווח ("₪1,140", "₪95.50", ומינוס "−₪50"), רק דרך `formatIls` / `Price` (ובקוד חיוב `formatAgorot`), עם "כולל מע״מ" כשזה מחיר לצרכן. לא כותבים ₪ ליד מספר ידנית ב-`messages/he.json` (משתנה ICU שעובר דרך `formatIls`), ולא משתמשים ב-`Intl.NumberFormat` עם `style: "currency"`. באנליטיקה — מספר בלבד | חלק 01 §2.1 סעיף 20, §2.5 |
| **חריג 1 — טקסט של הוקים:** הזרע (נספח C, `/seed/hooks.json`), `hooks.text_he`, ו-`workspace_hooks.text_he` שנוצר בפרומפטים `hooks.*` (וגם ציטוט מילולי של הוק, למשל בבלוג) | ספרות | **"349 ₪"** — מספר, רווח, ₪ (בתצוגה הרווח הופך לרווח קשיח, U+00A0); placeholder: **"{מחיר} ₪"**. `build_seed.py --check` ו-`lint` נכשלים על "₪349" בטקסט של הוק | מוסכמת הזרע (README של `seed/`) |
| **חריג 2 — סרטון:** כל טקסט תצוגה שנכנס לרינדור — כותרת ההוק, טקסט על המסך, טקסט התצוגה של הכתוביות, `vo_he`, `vo_full_he`, כרטיס הסיום, הטקסט לפוסט | ספרות | לפי `brand_kits.shekel_format`: `prefix` ← "₪120" (ברירת המחדל), `suffix` ← "120 ₪". שתי תוויות הבחירה בעורך ערכת המותג מציגות את שתי הצורות כלשונן — המקום היחיד בממשק שבו סכום עם ₪ כתוב ידנית. אותו כלל חל על הטקסט של המודעה במטא (`primary_text_he`, `headline_he`, `description_he`), כדי שהמודעה והסרטון שהיא נושאת לא יציגו שתי מוסכמות. דף העסק (`/b/[slug]`) הוא דף אינטרנט, ולכן הולך לפי הכלל: ₪ לפני המספר, דרך `Price` | חלק 05 §9, סעיף 4; §18 כאן |
| **חריג 3 — הקראה** (`vo_tts_he`) | מילים, בהתאמת מין; אף פעם לא ₪ ולא ספרות | "מאה ועשרים שקל" (`casual`/`slang`) / "מאה ועשרים שקלים" (שאר הרמות) | חלק 05 §15.2–15.3 |
| **חריג 4 — מסמכים של צד שלישי** | — | Morning מפיקה את ה-PDF של החשבונית בעיצוב שלה; אנחנו לא שולטים בפורמט | חלק 06 §9 |

ב-placeholders של מחיר בספרייה נכתב "{מחיר} ₪" לפי מוסכמת הזרע. כשההוק נכנס לפרויקט, `applyShekel(text, format)` (`lib/hebrew/placeholders.ts`) ממקם את ה-₪ מחדש לפי `shekel_format` של ערכת המותג, ו-`buildPromoProps` מפעיל אותה פעם נוספת לפני הרינדור, כך שבסרטון אחד אין שתי מוסכמות. היא לא נוגעת ב-`vo_tts_he`.

### 6.2 כללים

1. **מפריד אלפים:** פסיק. "1,240", "₪12,000". בלי רווח ובלי נקודה.
2. **שבר עשרוני:** נקודה. "4.8", "₪95.50". אגורות רק כשהן לא אפס.
3. **אחוז:** צמוד למספר, אחריו: "50%". לא "50 אחוז" על המסך, ולא "%50".
4. **טווח:** מקף ארוך (en dash, U+2013) בלי רווחים: "10–20", "4–6 דקות". בהקראה: "עשר עד עשרים".
5. **אות שימוש לפני ספרות:** מקף רגיל, בלי רווחים: "ב-30 שניות", "ל-3 פורמטים", "מ-1,240 ביקורות", "ה-80". בממשק דרך `Num` עם `hePrefix`, כדי שהאות והמספר לא יישברו בין שורות. **בהקראה בלי מקף:** "בשלושים שניות", "מאלף מאתיים וארבעים". לכן ב-`vo_tts_he` אות שימוש לפני placeholder נצמדת בלי מקף: "ב{מחיר} שקל".
6. **מספר + יחידה לא נשברים:** "₪99", "50%", "3 שנ׳", "24 שעות" — גם בכתוביות (`paginate`) וגם בממשק (רווח קשיח).
7. **תאריך בממשק ובמיילים:** "13 באוקטובר 2026"; בטבלאות: "13.10.2026". בסרטון: "1 בנובמבר" ולא "1.11", כי צופה קורא מהר. בלי "13/10".
8. **שעה:** 24 שעות, "14:30", "22:00". לא "10 בלילה" על המסך; בהקראה כן: "עשר בערב".
9. **ימים בשבוע:** במילים: "יום חמישי", "מוצאי שבת". השבוע מתחיל ביום ראשון.
10. **משך בממשק:** "30 שנ׳", "דקה וחצי", "4–6 דקות". בסרטון ובמחירון: "30 שניות".
11. **טלפון:** "050-123-4567" (דרך `formatPhoneIL`). בהקראה: ספרה אחרי ספרה, בקבוצות.
12. **סכומים גדולים לא מדויקים:** במילים: "מאות אלפי שקלים", "אלפי לקוחות" — ורק כשזו עובדה. סכום מדויק בספרות: "₪310,000".
13. **מינוס:** התו U+2212 ("−50"), לא מקף.
14. **"ש״ח":** לא בממשק, לא באתר ובדפים המשפטיים, לא על המסך ולא בשורות חשבונית שאנחנו מייצרים — תמיד ₪ לפי §6.1. "ש״ח" מופיע רק בתוך מסמך של צד שלישי (חריג 4), ובהקראה נקרא "שקלים".
15. **מספרים בהוקים הם דוגמה:** כל ספרה בהוק או בתסריט שאינה מספר רשימה, משך הסרטון או שנה, עוברת בשער העובדות (`detectFactSlots`, חלק 03 §6.12). אם אין לה עובדה — placeholder.
16. **ספירה בממשק:** כל מחרוזת שבה משתנה סופר שם עצם עוברת דרך ICU plural: `{n, plural, one {…} two {…} other {# …}}`, לפי התבניות של `common.*` בחלק 01 (למשל `{n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}`). פטורים רק קבועים מהזרע שתמיד 3 ומעלה (`trialCredits`, `monthlyCredits` וחבריהם), ברשימת ההיתר של `lint:copy`. `{n} קרדיטים` מחוץ ל-`plural` הוא שגיאה.

### 6.3 אותו נתון בארבעה משטחים

| נתון | ממשק | על המסך בסרטון | `vo_he` (לתצוגה) | `vo_tts_he` (להקראה) |
|---|---|---|---|---|
| מחיר | ₪149 · כולל מע״מ | 149 ₪ (`suffix`) / ₪149 (`prefix`) | ב-149 ₪ (`suffix`) / ב-₪149 (`prefix`) | במאה ארבעים ותשע שקל |
| אחוז | 20% | 20% הנחה | 20% הנחה | עשרים אחוז הנחה |
| דירוג | 4.8 | 4.8 בגוגל | 4.8 בגוגל | ארבע נקודה שמונה בגוגל |
| כמות | 1,240 ביקורות | 1,240 ביקורות | מ-1,240 ביקורות | מאלף מאתיים וארבעים ביקורות |
| משך | 10 ימי עבודה | 10 ימי עבודה | 10 ימי עבודה | עשרה ימי עבודה |
| שעה | 22:00 | עד 22:00 | עד 22:00 | עד עשר בערב |
| תאריך | 12 בדצמבר 2026 | עד 12 בדצמבר | עד 12 בדצמבר | עד השנים עשר בדצמבר |
| שנה | 2026 | ב-2026 | ב-2026 | באלפיים עשרים ושש |
| טלפון | 050-123-4567 | 050-123-4567 | 050-123-4567 | אפס חמש אפס, אחת שתיים שלוש, ארבע חמש שש שבע |
| שעות + יום | — | תוך 24 שעות | תוך 24 שעות | תוך עשרים וארבע שעות |

### קריטריוני קבלה
- [ ] `formatIls`, `lib/hebrew/placeholders.ts` (מיקום ₪) ו-`normalizeForTts` מכוסים בבדיקות יחידה לכל שורה בטבלה 6.3.
- [ ] בדיקת הזרע נכשלת על "₪349" בטקסט של הוק (מוסכמת הזרע היא "349 ₪"); כל מחיר בממשק עובר דרך `Price`/`formatIls` ולא נכתב ידנית במחרוזת (חלק 01). החריג היחיד: תוויות הבחירה של `shekel_format` בערכת המותג, שמציגות את שתי הצורות.
- [ ] ב-`paginate`, אף צירוף מטבלה 6.3 לא נשבר בין שני עמודים.

## §7. ראשי תיבות, גרש וגרשיים

**הכלל:** גרשיים ״ (U+05F4) בראשי תיבות; גרש ׳ (U+05F3) בקיצורים ובאותיות שמייצגות צליל לועזי. לא מירכאות ASCII (") ולא אפוסטרוף (') בתוך מילה עברית (`HE004`, עם תיקון אוטומטי בשמירה).

| נכון | שימוש | בהקראה |
|---|---|---|
| מע״מ | "כולל מע״מ" | מַעַם |
| נדל״ן | נישה, הוקים | נַדְלָן |
| עו״ד | עורכי דין | עורך דין |
| רו״ח | רואי חשבון | רואה חשבון |
| ד״ר | רופאים | דוקטור |
| ש״ח | לא בטקסט שלנו (תמיד ₪, §6.1); מופיע רק במסמכים של צד שלישי | שקלים |
| בע״מ | שם חברה, בכרטיס סיום | נמחק בהקראה |
| ת״א | כתובות (עדיף "תל אביב" מלא) | תל אביב |
| מ״ר | נדל״ן, שיפוצים | מטר רבוע / מטרים רבועים |
| ק״מ, ק״ג, ס״מ | מידות | קילומטר, קילו, סנטימטר |
| ע״י | עדיף "על ידי" או לנסח מחדש | על ידי |
| בי״ס | חוגים, לימודים | בית ספר |
| וכו׳ | עדיף להימנע בקופי | וכולי |
| פרופ׳ | תואר | פרופסור |
| שנ׳, דק׳ | משך בממשק | שניות, דקות |
| ג׳ל, צ׳יפס, ז׳קט, ג׳ינס | מילים לועזיות עם צליל שאין לו אות | כמו שנכתב (המנוע קורא את הגרש) |
| ער״ן | שורת עזרה בנישת מטפלים | ערן |

**אסור בקופי שיווקי:** ראשי תיבות צבאיים או פוליטיים (צה״ל, ח״כ, רה״מ) — גם כשהם תקינים, הם מכניסים את הטקסט לתחום שאנחנו לא נוגעים בו (חלק 05 §21).
**חיפוש:** ספריית ההוקים מנרמלת ״←" ו-׳←' בשאילתה ובאינדקס, כך שמי שמקליד "נדל"ן" מוצא "נדל״ן".
**האשטגים:** בלי גרש ובלי גרשיים (`#נדלן`, `#לקגל`). הרשתות קוטעות את ההאשטג בתו הזה.
**הקלדה:** במקלדת הם לא נגישים, ולכן כל שדה טקסט עברי במוצר (עורך התסריט, עורך ההוקים באדמין, ערכת המותג) מתקן אוטומטית `"` ו-`'` שבין שתי אותיות עבריות לגרשיים ולגרש בזמן השמירה.

### קריטריוני קבלה
- [ ] אין בזרע, ב-`messages/he.json` ובתוצרי AI אף `"` או `'` בין שתי אותיות עבריות (`HE004`).
- [ ] חיפוש "נדל"ן" ו"נדל״ן" בספריית ההוקים מחזיר את אותן תוצאות.
- [ ] `ACRONYMS` (חלק 05 §15.5) כולל את כל השורות של הטבלה כאן.

## §8. מונחים באנגלית

**המדיניות:** עברית כשיש מילה עברית טובה ששגורה בפי בעלי עסקים. לועזית שהשתרשה — מותרת, באותיות עבריות. אותיות לטיניות — רק לשמות מותגים, לראשי תיבות בינלאומיים, ולמונחים שאין להם צורה עברית מקובלת, ורק על המסך ובממשק, אף פעם לא בהקראה.

| מונח | בממשק ובאתר | על המסך בסרטון | בהקראה | הערה |
|---|---|---|---|---|
| Reels | רילס | רילס | רילס | יחיד ורבים זהים |
| TikTok / Shorts | טיקטוק / שורטס | טיקטוק / שורטס | טיקטוק / שורטס | |
| Hook | הוק / הוקים | — | — | לא "וו" ולא "פתיח" |
| CTA | הנעה לפעולה | — | — | "CTA" רק בקוד, בלוגים ובמסמכים פנימיים |
| WhatsApp | וואטסאפ | וואטסאפ | וואטסאפ | |
| Instagram / Facebook / YouTube | אינסטגרם / פייסבוק / יוטיוב | כנ״ל | כנ״ל | |
| Waze | וויז | וויז | וויז | |
| Link in bio | קישור בביו | הקישור בביו | הקישור שבביו | |
| POV | — | POV (באותיות לטיניות) | לא מקריאים; כותבים את המשפט בלעדיו | אם בכל זאת נשאר, `LOANWORDS` מקריא "פִּי אוֹ וִי" (חלק 05 §15.5) |
| Black Friday | בלאק פריידיי | Black Friday או בלאק פריידיי | בלאק פריידיי | |
| Sale | מבצע | SALE או מבצע | סייל | "מבצע" עדיף |
| AI | AI | — | עדיף לכתוב "בינה מלאכותית" | אם נשאר "AI", `LOANWORDS` מקריא "אֵיי אַיי" (חלק 05 §15.5). התווית "נוצר באמצעות AI" קבועה (חלק 05 §21.7) |
| Leads | לידים | — | פניות | בסרטון לא מדברים על "לידים" |
| Template | תבנית | — | — | |
| Render | הרכבה | — | — | |
| Prompt | תיאור (למנוע) | — | — | רק תחת "מתקדם" |
| Voice-over / Subtitles | קריינות / כתוביות | — | — | |
| Brand kit | ערכת מותג | — | — | |
| Full HD | Full HD | — | — | מופיע כך בכרטיסי המחירים |
| White label | בלי המיתוג שלנו (White label) | — | — | הסוגריים רק בכרטיס המחיר |
| Online | אונליין | אונליין | אונליין | |
| VIP / Wi-Fi | VIP / Wi-Fi | VIP / Wi-Fi | וִי אַיי פִּי / וַיי פַיי | |
| Meta | מטא | — | — | בסרטונים לא מדברים על מטא. Meta באותיות לטיניות רק בקוד ובמסמכים פנימיים; לא "פייסבוק" כשהכוונה לחברה. בלי הלוגואים |
| Ads Manager | מנהל המודעות של מטא | — | — | לא "אדס מנג׳ר" |
| Campaign / Ad | קמפיין / מודעה | — | — | "קמפיין" הוא כל ההשקה בתשלום; "מודעה" היא אחת מתוכו |
| Organic post | פרסום רגיל | — | — | לא "אורגני" בממשק. "פרסום רגיל" מול "קמפיין" |
| Boost | קידום ("קדמו את הסרטון הזה") | — | — | לא "בוסט" |
| Winner | המנצח ("הגבירו את המנצח") | — | — | רק אחרי מדגם מינימלי (§19.2) |
| Landing page | דף העסק | — | — | לא "לנדינג" ולא "דף נחיתה" בממשק |
| Hook score / Health check | ציון הוק / בדיקת דופק | — | — | מוצגים תמיד כהערכה (§19.5) |
| ROAS, CPM, CPC, CTR, ODAX, Advantage+, ad set, pixel | לא בממשק הרגיל | — | — | רק בתוך "הגדרות מתקדמות", עם הסבר בשורה אחת (`ADS_JARGON`, §19.6) |

**בידוד כיווני:** כל רצף לטיני או מספרי בתוך משפט עברי בממשק עטוף ב-`<bdi>` (דרך `Num` או `bdi` ידני), ובסרטון מסומן `is_ltr` בכתוביות (חלק 05 §16.6). כותבי קופי לא מקלידים תווי כיווניות (U+200E, U+200F, U+2066–U+2069) בטקסט: הרכיבים מוסיפים אותם. `lint` מתריע על תו כזה בתוכן.
**משפט לא מתחיל באותיות לטיניות** כשאפשר להימנע: "מבצע Black Friday" ולא "Black Friday מתחיל".

### קריטריוני קבלה
- [ ] `LOANWORDS` (חלק 05 §15.5) מכסה כל מונח בטבלה שמופיע בעמודת "בהקראה".
- [ ] `HE008` תופס כל אות לטינית ב-`vo_tts_he`, כולל "POV" ו-"AI".
- [ ] בדיקת `messages/he.json` נכשלת על "Generate", "Download", "Upload" או "Render" בכל מחרוזת (חלק 01 §2.1 סעיף 12).

## §9. פיסוק וסימנים

| סימן | מתי | כלל |
|---|---|---|
| נקודה `.` | סוף משפט | גם בהוקים קצרים, כשזה משפט ("אל תבואו אלינו רעבים."). בכפתורים, כותרות ותוויות — בלי נקודה |
| פסיק `,` | הפסקת נשימה | בקריינות, פסיק הוא הפסקה קצרה של מנוע ההקראה. שמים אותו איפה שבן אדם היה עוצר |
| נקודתיים `:` | חשיפה, רשימה, "וזה החלק החשוב:" | אחריהן מילה ראשונה בלי אות גדולה (אין כאלה) ובלי מקף |
| סימן שאלה `?` | שאלה אמיתית | בהוקים, שאלה אחת לכל היותר. מנוע ההקראה מרים אינטונציה, אז לא שמים אותו על משפט שאינו שאלה |
| סימן קריאה `!` | רגע הצלחה אמיתי בממשק; לכל היותר שניים בתסריט שלם | אף פעם לא `!!`, לא בהודעות שגיאה, לא בכפתורים, לא בהסתייגויות |
| שלוש נקודות `…` (U+2026) | פעולה שנמשכת בממשק ("מנתחים את האתר…"); השהיה מכוונת בקריינות | תו אחד, לא שלוש נקודות (`HE023`) |
| מקף ארוך עם רווחים ` – ` | בין חלקי משפט | כמו בזרע ("3 מנות שהצוות שלנו אוכל בכל משמרת – וכמעט אף לקוח לא מזמין"). בקריינות עדיף פסיק או נקודה |
| מקף ארוך בלי רווחים `–` | טווחים | "10–20", "4–6 דקות" |
| מקף רגיל `-` | אות שימוש לפני ספרה או לועזית | "ב-30", "ל-WhatsApp" (בממשק עדיף "לוואטסאפ"). מקף עברי (מקף עליון, U+05BE) לא בשימוש |
| בלי מקף | אות שימוש לפני משתנה | אחרי אות שימוש לפני משתנה עברי (`{{BRAND_NAME}}`, שמות) — בלי מקף: "נוצר ב{{BRAND_NAME}}", "ברוכים הבאים ל{{BRAND_NAME}}". לפני שם שמגיע בזמן ריצה (`{name}`, `{inviterName}`, `{agencyName}`, `{businessName}`, `{firstName}` וחבריהם) — מנסחים בלי אות שימוש ("עדכונים ומבצעים מאת {businessName}"): "הזמנה מאת {inviterName}", "להעביר את הבעלות אל {name}"; שם במירכאות מותר: `ל"{workspaceName}"`. לפני ספרות, לועזית, כתובת מייל ותאריך מעוצב המקף נשאר ("ב-14 באוקטובר", "ל-dana@x.co"). חלק 00 §6.5; `lint:copy` אוכף (חלק 01 §2.6) |
| מירכאות `"…"` | ציטוט, מילת מפתח, שם של משהו | מירכאות רגילות (חלק 01 §2.1). בהקראה הן נמחקות. לא ״…״ כמירכאות |
| גרש ׳ / גרשיים ״ | קיצורים וראשי תיבות בלבד | §7 |
| סוגריים `( )` | הבהרה בממשק ובדפים משפטיים | לא בקריינות, לא על המסך, לא בהוקים (`HE025`) |
| חץ `←` | התקדמות, מעבר, "לפני ← אחרי", קישור "לכל ההוקים ←" | בעברית ההתקדמות היא שמאלה. `→` אסור בתוכן (`HE017`). חצים בממשק עוברים דרך `DirIcon` |
| נקודה אמצעית ` · ` | מפריד בין פריטים בשורת מטא בממשק ("30 שנ׳ · 9:16 · טיוטה") | תמיד עם רווחים משני הצדדים. לא על המסך בסרטון ולא בתוצרי AI — שם פסיק. בלי רווחים זו נקודה מגדרית (`HE003`) |
| לוכסן `/` | שבר או חלופה טכנית ("1/3") | לא בין צורות מגדר (`HE002`), לא בתאריכים |
| כוכבית `*` | — | לא משתמשים. הערת שוליים נכתבת במלואה, ליד הטענה |

**רווחים:** רווח אחד בין מילים; אין רווח לפני סימן פיסוק; רווח אחרי (`HE024`, תיקון אוטומטי). רווח קשיח בין מספר ליחידה (`149 ₪`, `3 שנ׳`) בתצוגה.
**אותיות סופיות:** ך ם ן ף ץ בסוף מילה, גם בשמות לועזיים בתעתיק ("גוגל", "וייב"). אנימציה של טקסט עברי היא לפי מילה, אף פעם לא לפי אות (חלק 01).

### קריטריוני קבלה
- [ ] `lint` מתקן אוטומטית "..." ל-"…", "→" ל-"←" ורווח לפני פיסוק, ומדווח על התיקון.
- [ ] בתוצרי AI אין `·` ואין סוגריים בשדות `vo_*` ו-`onscreen_*`.

## §10. אימוג׳ים והאשטגים

| משטח | אימוג׳ים | האשטגים |
|---|---|---|
| ממשק, אתר, מיילים, הודעות מערכת | לא (חלק 01 §2.1 סעיף 18) | — |
| קריינות (`vo_*`) | לא (`HE007`); מנוע ההקראה מקריא אותם או משתתק | לא |
| טקסט על המסך, הוקים, כרטיס סיום | לא. הם נשברים בגופנים העבריים ושוברים את הבידוד הכיווני | לא |
| טקסט לפוסט (`post_caption_he`) | המחולל לא מוסיף. המשתמש יכול להוסיף בעורך | ב-`hashtags_he` בלבד, לא בתוך הטקסט |
| הודעת וואטסאפ מוכנה (`prefill_he`) | לא | לא |
| כיתוב לפרסום רגיל באינסטגרם ובפייסבוק (`social_posts.caption_he`, `post.caption.v2`) | המחולל לא מוסיף. המשתמש יכול להוסיף בחלון הפרסום | ב-`hashtags_he` בלבד: 3 עד 5 |
| טקסט ראשי של מודעה (`primary_text_he`) | עד 2, אף פעם לא במקום מילה ולא כחיקוי של כפתור או התראה (§18.3) | לא |
| כותרת ותיאור של מודעה, טופס לידים | לא | לא |
| דף העסק (`/b/[slug]`) | לא, כמו באתר | לא |

**האשטגים (`hashtags_he`):** 3 עד 8 בתסריט (`ScriptV1`), ו-3 עד 5 בכל מה שמתפרסם דרכנו באינסטגרם ובפייסבוק (`post.caption.v2` עם `reels` או `facebook`, `social_posts.hashtags_he`): אינסטגרם מגבילה פוסט ל-5 האשטגים, ובונה הכיתוב (`lib/social/caption.ts`, חלק 07) שומר את חמשת הראשונים לפי הסדר [M0-verify איך ה-API מגיב לפוסט עם יותר מ-5]. במודעות אין האשטגים בכלל. כל אחד מתחיל ב-`#`, בלי רווחים, בלי גרש וגרשיים, בלי מקף, בלי ניקוד — התווים האלה קוטעים את ההאשטג. צירוף של כמה מילים נכתב צמוד, או עם קו תחתון כשזה עוזר לקרוא (`#שיפוץ_אמבטיה`); בונה הכיתוב מחליף רווח בקו תחתון ומסיר גרש, גרשיים, מקף וניקוד. לכל היותר שניים באנגלית (`S15`). שילוב של הנישה, השירות והעיר: `#שיפוצאמבטיה`, `#שיפוציםבחיפה`, `#לפניואחרי`. בלי האשטגים כלליים (`#love`, `#instagood`), בלי שם של מתחרה, ובלי האשטגים פוליטיים.

### קריטריוני קבלה
- [ ] `S15` ובדיקה נוספת על `hashtags_he` דוחות האשטג עם רווח, גרש, גרשיים או ניקוד.
- [ ] אין אף אימוג׳י ב-`messages/he.json` (בדיקת טווחי Unicode).
- [ ] בדיקת יחידה של `lib/social/caption.ts`: קלט עם 8 האשטגים, רווח, מקף וגרשיים מחזיר 5 האשטגים נקיים, לפי הסדר; `AdCopyV1` דוחה טקסט עם `#`, עם `@` או עם יותר משני אימוג׳ים, וכל אימוג׳י בכותרת או בתיאור של מודעה.

## §11. הנעה לפעולה: וואטסאפ קודם

### 11.1 איזו הנעה

1. **עסק מקומי שנותן שירות** (רוב הנישות): **וואטסאפ**. זה הערוץ שבעלי עסקים בישראל עונים בו, ושהלקוחות כבר פתוחים בו.
2. **עסק שעובד בתורים ויש לו מערכת זימון:** `booking` ("קבעו תור בקישור שבביו").
3. **שירות דחוף** (אינסטלציה, חשמל, מנעולן, וטרינר חירום): `call`.
4. **מקום שבאים אליו** (חנות, מסעדה בלי הזמנת מקום, אטרקציה): `navigate` כהנעה שנייה, בטקסט לפוסט.
5. **פיננסים מפוקחים, יזמות נדל״ן, B2B:** `lead_form`.
6. **חנות אונליין:** `visit_site`.
7. **מטרת מעורבות:** `comment_keyword`. **מטרת חשיפה:** `save_share`.

### 11.2 המבנה של הנעה טובה

**פועל + ערוץ + מה מקבלים.** "שלחו 3 תמונות של החדר בוואטסאפ ← הצעת מחיר תוך 24 שעות" (כשה-24 שעות היא עובדה). פעולה אחת בלבד. אם אין עובדה על זמן תגובה, לא כותבים זמן: "שלחו תמונות של החדר, ונחזור אליכם עם הצעת מחיר".

| ✗ | למה | ✓ |
|---|---|---|
| "צרו קשר עוד היום!" | אין ערוץ, אין תמורה, סימן קריאה | "שלחו לנו וואטסאפ, ונשלח לכם את המחירון" |
| "עונים תוך דקות" (בלי עובדה) | טענה בלי בסיס | "שלחו הודעה בוואטסאפ" |
| "התקשרו או שלחו וואטסאפ או השאירו פרטים" | שלוש פעולות | פעולה אחת; השאר בכרטיס הסיום |
| "לחצו על הקישור למטה" | ברילס אין "למטה" | "הקישור בביו" |
| "נשארו רק 3 מקומות!" (בלי עובדה) | דחיפות מזויפת, ייתכן פרסום מטעה | רק עם עובדה מאושרת; אחרת בלי |

### 11.3 ניסוחים לפי סוג (ברבים; ההטיה לנקבה ולזכר לפי טבלה 4.4)

| `cta.type` | בקריינות | בכרטיס הסיום (עד 6 מילים) | הודעה מוכנה (`prefill_he`, בקול הלקוח) |
|---|---|---|---|
| `whatsapp` | "שלחו לנו הודעה בוואטסאפ." · "שלחו תמונה בוואטסאפ, ונחזור אליכם עם הצעה." | "שלחו לנו וואטסאפ" · "הצעת מחיר בוואטסאפ" | "היי, ראיתי את הסרטון על {שירות} ואשמח לפרטים" |
| `call` | "התקשרו אלינו עכשיו." · "רוצים להתחיל בשיחה? התקשרו אלינו." | "התקשרו עכשיו" · "חייגו לתיאום" | — |
| `booking` | "קבעו תור בקישור שבביו." · "התורים לחנוכה בקישור שבביו." | "קבעו תור אונליין" | — |
| `link_in_bio` | "כל הפרטים בקישור שבביו." | "כל הפרטים בקישור בביו" | — |
| `navigate` | "מחפשים אותנו בוויז, ובאים." · "נווטו אלינו בוויז." | "נווטו אלינו בוויז" | — |
| `lead_form` | "השאירו פרטים, ונחזור אליכם." | "השאירו פרטים" · "בדיקה בלי התחייבות" | — |
| `comment_keyword` | "כתבו "{מילה}" בתגובות, ונשלח לכם את הפרטים בפרטי." | "כתבו "{מילה}" בתגובות" | — |
| `save_share` | "שמרו את הסרטון, ושלחו אותו למי שצריך." | "שמרו ושלחו למי שצריך" | — |
| `visit_site` | "כל הפרטים באתר שלנו." | "כל הפרטים באתר" | — |

ההודעה המוכנה לוואטסאפ נכתבת בקול של הלקוח ובניסוח שלא מחייב מגדר ("ראיתי", "אשמח"). מקסימום 200 תווים. היא נכנסת לקישור `wa.me` עם קידוד URL.

### 11.4 ההנעה בקמפיין: מטרה, כפתור וטקסט

במודעה יש כפתור, ולכן ההנעה נקבעת לפי מטרת הקמפיין, ולא לפי `cta.type` של הסרטון. המטרה מגיעה מברירות המחדל לפי נישה (`NICHE_AD_PRESETS`) או מהבחירה של המשתמש בשלב "מטרה", והכפתורים המותרים לכל מטרה הם אלה של מיפוי המטרות בחלק 07. `ads.copy.v1` כותב את ההנעה שבטקסט כך שתבטיח בדיוק את מה שהכפתור עושה. את הנוסח של הכפתור עצמו מטא מציגה בשפה של הצופה, ואנחנו לא שולטים בו [M0-verify את התוויות בעברית].

| מטרה (`ad_goal`) | הכפתור (`cta_type`) | ההנעה בטקסט של המודעה (ברבים) |
|---|---|---|
| `whatsapp_messages` · "הודעות בוואטסאפ" | `WHATSAPP_MESSAGE` | "שלחו לנו הודעה בוואטסאפ." · "שלחו תמונה בוואטסאפ, ונחזור אליכם עם הצעה." |
| `lead_form` · "לידים בטופס" | `GET_QUOTE` · `SIGN_UP` · `BOOK_NOW` · `LEARN_MORE`, לפי הנישה | "השאירו פרטים, ונחזור אליכם." · "הצעת מחיר בטופס קצר." |
| `website_traffic` · "כניסות לאתר" | `LEARN_MORE` · `BOOK_NOW` · `SHOP_NOW` · `CONTACT_US` | "כל הפרטים באתר." · "קבעו תור באתר." · "להזמנה באתר." |
| `local_awareness` · "חשיפה לאזור" | `LEARN_MORE` · `CALL_NOW` (כשיש טלפון) · `WHATSAPP_MESSAGE` [M0-verify במטרה הזו] | הכתובת או האזור מהעובדות, והנעה רכה אחת: "אנחנו ברחוב סוקולוב 12 בחולון." · "התקשרו אלינו." |

**מה לא עובר מהסרטון למודעה:** `link_in_bio` ("הקישור בביו"), `comment_keyword` ("כתבו בתגובות") ו-`save_share` ("שמרו את הסרטון") לא נכתבים בטקסט של מודעה, ו-"נווטו אלינו בוויז" (`navigate`) מוחלף בכתובת, כי הכפתור לא פותח את וויז. `whatsapp`, `lead_form`, `booking`, `visit_site` ו-`call` עוברים כמו שהם כשהם מתאימים למטרה; כשלא, הטקסט הולך לפי המטרה.

### קריטריוני קבלה
- [ ] `CTA_DEFAULTS` (חלק 05 §12.4) ו-`CtaPicker` (חלק 03) משתמשים בניסוחים של טבלה 11.3, ואף אחד מהם לא כולל זמן תגובה או מחיר.
- [ ] כל אחד מחמשת התסריטים של נספח D מסתיים בהנעה אחת בלבד בביט ה-`cta`; תסריט עם יותר מפעולה אחת שם נכשל בסעיף "הנעה אחת" של רשימת הבדיקה §17 (אין לזה קוד lint).
- [ ] טבלה 11.4 זהה למיפוי המטרות של חלק 07 (מטרה ← כפתורים מותרים), ובדיקת יחידה של `ads.copy.v1` מוודאת שאין בטקסט של מודעה "בביו", "בתגובות" או "נווטו", ושהפועל של ההנעה מתאים לכפתור (וואטסאפ ← "שלחו", טופס ← "השאירו", אתר ← "באתר").
- [ ] כותרת כרטיס הסיום: Zod `max(30)` ועוד בדיקה של עד 6 מילים, בחלקים 04 ו-05 (`brief.cta.headline_he` ו-`RenderOptions.headline_he` בחלק 04, `end_card.headline_he` בחלק 05). כל הניסוחים בעמודת "בכרטיס הסיום" בטבלה 11.3 וכל `headline_he` בנספח D עומדים בזה.

## §12. מגבלות אורך (`LENGTH_LIMITS`)

| רכיב | מקסימום | הערה |
|---|---|---|
| הוק מדובר (`hook.text_he`, `hooks.text_he`) | 12 מילים | `HE010` |
| הוק על המסך (`hook.onscreen_he`) | 8 מילים, 2 שורות | שבירת שורה רק בין מילים; ב-9:16 עד 22 תווים בשורה, ב-1:1 עד 24, ב-16:9 עד 32. `HookTitle` ו-`OverlayTexts` מקטינים את הגופן עד 15% כדי להיכנס בשתי שורות; מעבר לזה העורך מציג אזהרה מראש (חלק 03 §9.3), וברינדור הטקסט נשבר בגבול מילה ונחתך ב-"…" (חלק 05 §20.5) |
| טקסט על המסך בסצנה | 8 מילים, 2 שורות | אותן מגבלות תווים כמו ההוק (`HE011` למילים; אזהרה לתווים) |
| זמן מינימלי לטקסט על המסך | 1.2 שניות, ולפחות שנייה לכל 15 תווים | טקסט ארוך מתפצל לשתי סצנות |
| כתוביות | `bold-pop`: עד 3 מילים בעמוד, 2 שורות × 22 תווים; `poster`: עד 2 מילים, 2 שורות × 14 תווים; שאר הסגנונות: 2 שורות × 22 תווים | `CAPTION_PRESETS[preset].paging` (חלק 01); עמוד 0.6–2.2 שניות (חלק 05 §16.4) |
| כותרת כרטיס הסיום | 6 מילים, עד 30 תווים | `end_card.headline_he` |
| `cta.text_he` | 8 מילים | |
| הסתייגות על המסך | 60 תווים בשורה, 2 שורות; לפחות 2.5 שניות | ניגודיות 4.5:1 לפחות |
| קריינות | בכל ביט: עד `est_duration_sec × wps × voice_speed` מילים (`S06`); בכל הסרטון: כ-`0.9 × wps × target` | חלק 05 §12.1: כ-32 / 65 / 97 / 130 מילים ל-15 / 30 / 45 / 60 שניות (2.4 מילים לשנייה). הסצנות מכסות את כל משך היעד, וכרטיס הסיום (2.5 שניות + 0.3 שניות זנב) מתווסף אחריהן |
| קטע בקריינות בין שני סימני פיסוק | עד 14 מילים | אחר כך פסיק, נקודתיים או נקודה; זה גם המקום שבו מנוע ההקראה נושם |
| סוגריים בהוק, בטקסט על המסך או בקריינות | אסור (0) | `HE025` (חלק 05 §23.3); מנסחים מחדש עם פסיק, נקודתיים או משפט שני. רץ גם על ההוקים בזרע |
| `title_he` (כותרת פנימית) | 60 תווים | |
| `post_caption_he` | 3 פסקאות קצרות, עד 600 תווים; המשפט הראשון עד 90 תווים | המשפט הראשון הוא מה שרואים לפני "עוד", והוא שונה מההוק |
| `hashtags_he` | 3–8 בתסריט; 3–5 בפרסום רגיל באינסטגרם ובפייסבוק (`ig_hashtags`) | §10 |
| `visual_direction_he` | משפט אחד, עד 20 מילים | |
| `why_it_works_he` | עד 15 מילים | |
| `prefill_he` (וואטסאפ) | 200 תווים | |
| ממשק: כותרת מסך / כפתור / טוסט | 6 / 4 / 12 מילים | חלק 01 §2.1 סעיף 15 |
| SEO: `<title>` / תיאור | 60 / 155 תווים | |
| מייל: נושא / preheader | 50 / 90 תווים | מייל שיווקי: "פרסומת" בתחילת הנושא, בתוך המגבלה |
| התראה בממשק: כותרת / גוף | 40 / 100 תווים | |
| כותרת בתמונת OG | 40 תווים, 2 שורות | |

**מפתחות להרחבת Meta והטרנדים.** אותו אובייקט `LENGTH_LIMITS`; ה-Zod של החוזים בחלקים 05, 07 ו-08 בונה את המגבלות מכאן, ולא כותב מספרים משלו.

| מפתח | רכיב | מקסימום | הערה |
|---|---|---|---|
| `ad_primary_text` | טקסט ראשי של מודעה | 125 תווים גלויים, ו-500 בסך הכול | ההנעה בתוך ה-125. 125 היא הערכה לנקודת הקיטוע לפני "עוד" [M0-verify בעברית ובכל מיקום]; מעבר אליה — אזהרה, לא חסימה |
| `ad_headline` | כותרת של מודעה | 40 תווים | העמודה במסד מאפשרת 60; מעבר ל-40 — אזהרה |
| `ad_description` | תיאור של מודעה | 30 תווים | רשות; לא מופיע בכל המיקומים |
| `lead_form_headline` | כותרת הפתיחה של טופס הלידים | 60 תווים | |
| `lead_form_intro` | טקסט הפתיחה של טופס הלידים | 200 תווים | |
| `lead_form_privacy_link` | טקסט הקישור למדיניות הפרטיות בטופס | 70 תווים | "מדיניות הפרטיות של {businessName}" |
| `ig_caption` | כיתוב לפרסום רגיל | 2,000 תווים | המגבלה של אינסטגרם היא 2,200 ואנחנו משאירים מרווח; המחולל מכוון ל-600 (`post_caption_he`) |
| `ig_hashtags` | האשטגים בפרסום רגיל | 5 | §10 |
| `sign_text` | טקסט על השלט (`SignOverlay`) | 40 תווים, עד 3 שורות | חלק 08 |
| `popup_title` · `popup_body` | התראה מזויפת (`FakeUiPopup`) | 24 · 60 תווים | פרסום רגיל בלבד (§18.3) |
| `meme_caption` | כיתוב מם (`MemeCaption`) | 40 תווים | |
| `landing_h1` | דף העסק: כותרת ראשית | 40 תווים | §18.7 |
| `landing_subline` | דף העסק: שורת משנה | 120 תווים | |
| `landing_benefit` | דף העסק: יתרון | 8 מילים, בדיוק 3 יתרונות | |
| `landing_faq_q` · `landing_faq_a` | דף העסק: שאלה · תשובה | 12 מילים · 300 תווים, עד 5 שאלות | |
| `hook_score_tip` | ציון הוק: הצעה לתיקון | 12 מילים, עד 3 הצעות | §19.5 |

### קריטריוני קבלה
- [ ] `LENGTH_LIMITS` מיוצא מ-`style-data.ts` ומשמש את `lint`, את עורך ההוקים באדמין, את עורך התסריט (מונה מילים חי) ואת בדיקות `messages/he.json`.
- [ ] `AdCopyV1`, `LeadFormSpecV1`, `CreateSocialPostBody`, `SceneOverlayV1`, `LandingPageContentV1` ו-`HookScoreV1` בונים את מגבלות ה-Zod מהמפתחות החדשים (בדיקה שמשווה את הסכמות למפתחות), ומונה התווים בבונה הקמפיינים מסמן את גבול 125 התווים של `ad_primary_text`.
- [ ] בעורך, טקסט על המסך שעובר את מגבלת התווים לשורה (גם אחרי הקטנת הגופן ב-15%) מקבל את האזהרה "הטקסט ארוך מדי לשתי שורות בפורמט {format}. כדאי לקצר." (חלק 03 §9.3) ולא נחתך בשקט.

## §13. כתיבה שנשמעת טוב בהקראה

עברית בלי ניקוד היא כתב שהקורא משלים מההקשר. מנוע הקראה משלים לפעמים לא נכון: שם עסק, שם פרטי, מילה דו-משמעית או פנייה בנקבה. לכן יש שני טקסטים: `vo_he` / `vo_full_he` לתצוגה (מה שהמשתמש קורא ועורך), ו-`vo_tts_he` להקראה (מה שהמנוע מקבל). הכללים כאן חלים על הטקסט להקראה, ועל כל מי שכותב קריינות.

### 13.1 כללי כתיבה

1. **משפט קצר, נשימה ברורה.** פסיק איפה שעוצרים, נקודה איפה שמסיימים רעיון. קטע של עד 14 מילים בין שני סימני פיסוק.
2. **מספרים במילים, בהתאמת מין** (טבלה 6.3 וחלק 05 §15.3). "3 שעות" ← "שלוש שעות"; "3 ימים" ← "שלושה ימים"; "2 שעות" ← "שעתיים".
3. **טלפון ספרה אחרי ספרה**, בקבוצות עם פסיקים: "אפס חמש אפס, אחת שתיים שלוש, ארבע חמש שש שבע".
4. **אות שימוש נצמדת למילה** בלי מקף: "ב-30" ← "בשלושים"; "ב-{מחיר}" ← "ב{מחיר}".
5. **ראשי תיבות נפרשים** (§7), לועזית באותיות עבריות (§8), בלי סמלים: `&` ← "ו", `+` ← "פלוס", `%` ← "אחוז", `₪` ← "שקלים".
6. **בלי סוגריים, בלי לוכסנים, בלי מירכאות, בלי אימוג׳ים.** מה שבסוגריים — או שנכנס למשפט, או שיוצא.
7. **ניקוד רק איפה שצריך:** במילה שאפשר לקרוא ביותר מדרך אחת בהקשר, במילה מגדרית שזהה בכתב (לך, שלך, בשבילך), ובמונחים ממילון ההגייה. לא מנקדים משפט שלם: ניקוד מלא מאט את המנוע ולפעמים משבש אותו.
8. **ניקוד על כתיב מלא.** מוסיפים סימני ניקוד לאותיות שכבר כתובות, בלי למחוק אם קריאה: "נִצְלֶה", "בִּשְׁבִילֵךְ". כך הטקסט בלי הניקוד נשאר זהה לטקסט לתצוגה (בדיקת הזהב של נספח D, §8.2, תלויה בזה).
9. **שאלה מסתיימת בסימן שאלה**, ומשפט רגיל לא. המנוע משנה אינטונציה לפי הסימן.
10. **"…" להשהיה מכוונת** לפני חשיפה ("ככה הוא נראה היום…"). לכל היותר פעם אחת בסרטון.
11. **שם העסק בפעם הראשונה** — אם הוא לא מילה עברית רגילה, הוא נכנס למילון ההגייה של הסביבה לפני היצירה הראשונה.

### 13.2 מילים דו-משמעיות נפוצות

| כתוב | קריאה רצויה (דוגמה) | הקריאה השגויה האפשרית | נישות שבהן זה קורה |
|---|---|---|---|
| ספר | סַפָּר | סֵפֶר, סָפַר | ברברשופ, מספרות |
| נראה | נִרְאֶה ("ככה זה נראה") | נֵרָאֶה | כל הנישות |
| נצלה | נִצְלֶה | נַצְלֶה | מסעדות, קייטרינג |
| שמן | שֶׁמֶן (שמן זית) | שָׁמֵן | מסעדות, כושר — רגיש במיוחד |
| בריכה | בְּרֵיכָה | בְּרִיכָה | צימרים, תיירות |
| כתבה | כַּתָּבָה | כָּתְבָה | קורסים, תקשורת |
| חלב | חָלָב | חֵלֶב | מאפיות, שבועות |
| שוק | שׁוּק ("מחירי השוק") | שׁוֹק | נדל״ן, משכנתאות |
| מצלמה / מצלמת | מַצְלֵמָה (המכשיר) / מְצַלֶּמֶת (האישה שמצלמת) | ההפך | צלמי אירועים |
| לך, שלך, בשבילך, אצלך | לָךְ / שֶׁלָּךְ / בִּשְׁבִילֵךְ / אֶצְלֵךְ (נקבה) | הצורה בזכר | כל פרויקט עם `audience_gender = female` |
| רוצה | רוֹצָה (נקבה) | רוֹצֶה | כל פרויקט עם פנייה ביחיד |
| מחכה | מְחַכָּה (נקבה) | מְחַכֶּה | קריינית בגוף ראשון |
| בוקר | בּוֹקֶר | בּוֹקֵר | בתי קפה |
| תור | תּוֹר | תּוּר | כל הנישות עם תורים — בדרך כלל תקין, לבדוק בבדיקה העיוורת |
| מנה | מָנָה | מוֹנֶה | מסעדות — בדרך כלל תקין |

### 13.3 מילון ההגייה (`pronunciation_entries`) — דוגמאות

המשתמש מוסיף מונחים ב-`/app/settings/pronunciation` (חלק 03), עם כפתור "השמעה" לבדיקה. ההחלפה חלה בגבול מילה, כולל אותיות שימוש לפני המונח ("לגחלת", "בגחלת").

| `term` | `say_as` | `note` |
|---|---|---|
| גחלת | גַּחֶלֶת | שם העסק |
| מיכל | מִיכַל | שם פרטי; טעם מלרע |
| יוסי | יוֹסִי | שם פרטי; טעם מלעיל |
| נויה | נוֹיָה | שם פרטי |
| ויצמן | וַיְצְמָן | רחוב |
| קריית ביאליק | קִרְיַת בְּיָאלִיק | עיר |
| גוונים | גְּוָנִים | שם העסק |
| ש.ב. שיפוצים | שִׁין בֵּית שיפוצים | ראשי תיבות בשם העסק |
| Kia | קִיָּה | מותג רכב |
| מיקרובליידינג | מִיקְרוֹבְּלֵיידִינְג | שם טיפול |
| טאבון | טַאבּוּן | מסעדות |
| שווארמה | שָׁוַורְמָה | מסעדות |
| פילאטיס | פִּילָאטִיס | סטודיו |
| ג׳ל | ג׳ל | בלי שינוי; לבדוק בשמיעה שהגרש נקרא "ג׳" |

### 13.4 בדיקת שמיעה

לפני השקה (M7, חלק 06 §24; גם סעיף ב-DoD של §25), כל קול שנבחר בבדיקה העיוורת עובר את "רשימת השמיעה": חמשת התסריטים של נספח D, כל שורות טבלה 13.2, כל שורות טבלה 6.3, ו-20 שמות עסקים ורחובות אמיתיים מהנישות בעדיפות 1. כל מילה שנקראה לא נכון נכנסת ל-`ACRONYMS`, ל-`LOANWORDS` או לרשימת הניקוד הכללית (`lib/hebrew/data/`), ולא נשארת בעיה של המשתמש.

### קריטריוני קבלה
- [ ] `S07` / `HE008` / `HE009` דוחים כל ספרה, אות לטינית, סוגריים או אימוג׳י ב-`vo_tts_he`.
- [ ] הסרת הניקוד מ-`vo_tts_he` של כל תסריט ב-AI (לפני הצבת placeholders) נותנת טקסט שזהה ל-`normalizeForTts(vo_full_he)` בלי ניקוד, אחרי נרמול רווחים (אותה בדיקה של נספח D §8.2, על תוצרים חיים, כאזהרה).
- [ ] קובץ "רשימת השמיעה" נשמר ב-`docs/eval/listening-list.md` עם תוצאה לכל קול.

## §14. ניסוחי ציות לפי סקטור

הטקסטים כאן מבוססים על `COMPLIANCE_RULES` (חלק 05 §21.3) ומסומנים לבדיקת עורך דין לפני ההשקה. הם לא ייעוץ משפטי. נוסח ההסתייגויות **מילה במילה** כמו בקוד, כי `S14` משווה מחרוזות.

| סקטור (`compliance_flag` / נישה) | מותר | אסור | הסתייגות חובה | חלופה בטוחה |
|---|---|---|---|---|
| רפואה ואסתטיקה (`medical`: `dentists`, `aesthetic-clinics`) | תיאור התהליך, הסבר, הצוות, המקום, מחיר מהמחירון האמיתי | "ללא כאב", "תוצאה מובטחת", "100% הצלחה", "קבוע לתמיד", "הרופא הכי טוב", המלצות מטופלים בלי הסכמה | "התוצאות משתנות מאדם לאדם." · בלפני ואחרי: "התמונות להמחשה. התוצאות משתנות מאדם לאדם." | "מסבירים כל שלב, ועוצרים מתי שצריך" במקום "בלי כאב" |
| מטפלים (`medical`: `therapists`) | הסבר רך, מה קורה בפגישה הראשונה, מתי כדאי לפנות | המלצות מטופלים, הבטחת שיפור, פנייה שמניחה מצב נפשי ("סובלים מחרדה?") | "התוצאות משתנות מאדם לאדם." · רשות: "במצב חירום רגשי: ער״ן 1201." | "הרבה אנשים מגיעים לפגישה הראשונה בלי לדעת מה לשאול" |
| פיזיותרפיה ותזונה (`medical`: `physio-nutrition`) | תרגילים, הסבר, הדגמה | "ריפוי מלא", "מעלים את הכאב לתמיד" | "התוצאות משתנות מאדם לאדם." · בלפני ואחרי: "התוצאות משתנות מאדם לאדם. אין בתוכן תחליף לייעוץ מקצועי." | "תרגיל אחד שאפשר לעשות ליד השולחן" |
| משפט (`legal`: `lawyers`) | הסבר כללי של זכות או הליך, טון מכובד | "הכי טוב", "המוביל", "מספר 1", "מבטיחים לנצח", "זוכים תמיד", המלצות לקוחות, השוואה למשרדים אחרים | "המידע כללי ואינו מהווה ייעוץ משפטי." | "3 דברים שכדאי לבדוק לפני שחותמים על הסכם שכירות" |
| פיננסים (`financial`: `mortgage-advisors`, `insurance-agents`, `accountants`) | הסבר מסלולים, סימולציה מתועדת, תזכורות למועדים מאומתים | "תשואה מובטחת", "חיסכון מובטח", "בלי סיכון", "אישור בטוח", פנייה שמניחה מצב כלכלי ("יש לכם חובות?") | "המידע אינו מהווה ייעוץ או המלצה." · עם מספר או סימולציה: "הסימולציה להמחשה בלבד." | "שני תמהילים לאותה הלוואה, והפרש שיכול להגיע ל…" (עם סימולציה מתועדת) |
| נדל״ן (`real_estate`: `real-estate`, `real-estate-developers`) | סיור בנכס מצילומים אמיתיים, מדריך שכונה, טיפים | מחיר מבוקש שמוצג כמחיר עסקה, "השקעה בטוחה", "הדירה הכי שווה בעיר" | "המחירים והתמונות להמחשה בלבד." · מספר רישיון בכרטיס הסיום כשהוא בעובדות (`{מספר_רישיון}`) | "מחיר מבוקש" במפורש, ותמיד מהנכס עצמו |
| אלכוהול (`alcohol`; אין נישה בזרע עם הדגל הזה בהשקה, והוא חל כשמנהל מסמן כך נישה) | אווירה, מוצר, אירוע למבוגרים | פנייה לקטינים, דמויות צעירות, "שתו בלי הגבלה" | "אזהרה: שתייה מופרזת של משקאות משכרים מסכנת חיים." | "הטעימה מתחילה בשמונה" |
| מזון וכשרות (`restaurants`, `catering-chefs`) | "כשר" רק עם תעודה בתוקף שמופיעה בעובדות | "כשר", "כשרות", "בהשגחת" בלי עובדה (`HE021`) | — | לא להזכיר כשרות כשאין עובדה |
| ילדים (`kids-activities`) | המקום, הצוות הבוגר, הפעילות | ילדים בתמונות שנוצרות; צילומי ילדים מהעלאות בלי הסכמת הורים (תיבת ההסכמה בהעלאה, `assets.metadata.consent_attested`, ואישור `minors` ב-`brief.attestations`) | — | "ככה נראה בוקר אצלנו בחוג" עם צילומי המקום |
| כושר (`fitness-trainers`) | תהליך, תרגילים, שגרה | הבטחת קילוגרמים, לפני ואחרי בלי הסתייגות, בושה גופנית | בלפני ואחרי: "התוצאות משתנות מאדם לאדם." | "שלושה אימונים בשבוע, מה שהגוף שלכם מאפשר" |
| הגרלות ותחרויות (כל נישה) | תחרות עם תקנון | "הגרלה" בלי תקנון; "כולם זוכים" | מומלץ (לא בקוד): "התחרות לפי התקנון שבביו." | "שלחו תשובה בתגובות; התקנון בביו" |
| כל הנישות | עובדות מאושרות; דחיפות אמיתית עם תאריך | מספרים, דירוגים, "נשארו X מקומות", "אלפי לקוחות" בלי עובדה; המלצה מומצאת | — | placeholder + שער העובדות |

**שלוש הערות שחלות על כולם:**
1. **פרסום ממומן במטא:** פנייה שמניחה מצב בריאותי, כלכלי, גיל או מאפיין אישי של הצופה נדחית. בגרסה הממומנת עוברים לגוף שלישי ("הרבה אנשים עם…"). הדגל `personal_attributes` מסמן תסריט שצריך גרסה כזו. הכלל המלא לקופי של קמפיין, לטופס הלידים ולדף העסק, עם הדוגמאות ו-`HE026`, ב-§18.4.
2. **המלצות:** רק ציטוט אמיתי, מילה במילה (`brief.testimonial = { quote_he, name_he, consent_attested: true }`). בסרטון מסוג `testimonial` צריך גם `consent_attested = true` וגם אישור `testimonial_requires_consent` ב-`brief.attestations` (חלק 04 §19.3). בתסריט מסוג אחר שסומן בדגל `testimonial_requires_consent` צריך רק את האישור. השרת אוכף את זה על הגרסה שנוצרת (חלק 04 §19.8, שלב 3, וגם ביצירה מחדש של סצנה): בלי הסכמה, `POST /generate` מחזיר `422 MISSING_FACTS` עם התווית "אישור בכתב מהלקוח על השימוש בהמלצה". אף פעם לא "לקוח" שנוצר ב-AI, ולא "לקוחות מספרים".
3. **הסתייגות מוצגת, לא רק כתובה:** על המסך, בניגודיות של 4.5:1 לפחות, לפחות 2.5 שניות, בכל פורמט (חלק 05 §20.7).

### קריטריוני קבלה
- [ ] כל הסתייגות בטבלה, חוץ מזו שמסומנת "מומלץ (לא בקוד)", זהה תו בתו למחרוזת ב-`COMPLIANCE_RULES` (בדיקה שמשווה את שתי הרשימות).
- [ ] כל מילה בעמודת "אסור" שנמצאת ב-`bannedHe` מחזירה `HE020` בנישה המתאימה ולא בנישות אחרות ("הכי טוב" מותר במסעדה, אסור בעריכת דין).
- [ ] `ComplianceChecklist` בעורך (חלק 03) מציג את עמודת "מותר" ו"חלופה בטוחה" כהסבר, לא רק את האיסור.

## §15. קופי נגיש

הבסיס הטכני בחלק 01 (WCAG 2.2 AA, ת״י 5568). כאן — איך כותבים את הטקסט עצמו.

| נושא | כלל | ✗ | ✓ |
|---|---|---|---|
| שפה פשוטה | משפט בממשק עד 20 מילים; מילה מוכרת לפני מונח | "יש לבצע אימות של כתובת הדואר האלקטרוני" | "שלחנו לכם קישור למייל. לחצו עליו כדי להיכנס." |
| טקסט של קישור | מתאר את היעד גם מחוץ להקשר | "לחצו כאן" · "קראו עוד" | "לכל ההוקים לנדל״ן" · "מדיניות הביטול המלאה" |
| `aria-label` לכפתור אייקון | שם פעולה בעברית, בלי "כפתור" | "כפתור X" · "close" | "סגירה", "השמעה", "השהיה", "השתקה", "מסך מלא", "העתקת ההוק", "הוספה למועדפים", "תפריט", "חיפוש" |
| טקסט חלופי לתמונה | מה רואים ולמה זה חשוב, עד 125 תווים; תמונה דקורטיבית — `alt=""` | "תמונה" · "image123.png" | "פוסטר הסרטון: מגש מעורב על שולחן עץ, עם הכיתוב "אל תבואו אלינו רעבים"" |
| הודעת שגיאה | מה קרה, למה, מה עושים; מקושרת לשדה (`aria-describedby`) | "שגיאה בשדה" · "קלט לא חוקי" | "מספר הטלפון קצר מדי. צריך 10 ספרות, למשל 050-123-4567." |
| בלי הוראות לפי צבע או צד | ב-RTL "ימין" ו"שמאל" מבלבלים, ומי שלא רואה לא יודע מה ירוק | "לחצו על הכפתור הירוק בצד שמאל" | "לחצו על 'המשך'" |
| תווית גלויה | placeholder הוא דוגמה, לא תווית | שדה עם placeholder "שם העסק" בלבד | תווית "שם העסק" + placeholder "למשל: הסטודיו של דנה" |
| הודעות חיות (`aria-live`) | קצרות, רק אבני דרך | הכרזה על כל אחוז התקדמות | "התסריט מוכן לעריכה" · "הסרטון מוכן" |
| זמן מוגבל | מודיעים מראש ומציעים הארכה | קישור שפג בלי הסבר | "הקישור תקף לשעה. אם הוא פג, אפשר לבקש חדש." |
| ראשי תיבות | בפעם הראשונה בעמוד, מלא; אחר כך מקוצר | "יש לצרף ת״ז" | "מספר תעודת זהות (ת״ז)" |
| כתוביות לסרטונים שלנו | כל סרטון שיווקי עם `<track srclang="he">` | סרטון בלי כתוביות | VTT מתוך `CaptionTrackV1` |
| הצהרת נגישות | עניינית, עם תאריך ופרטי קשר אמיתיים | "האתר נגיש לחלוטין" | "האתר נבנה ונבדק לפי WCAG 2.2 ברמה AA. ידוע לנו על {פער}. נשמח לשמוע: {{A11Y_COORDINATOR_EMAIL}}" |

### קריטריוני קבלה
- [ ] אין ב-`messages/he.json` את המחרוזות "לחצו כאן", "קראו עוד" (בלי השלמה), "כפתור" בתוך `aria-label`, או הוראה עם "ימין"/"שמאל"/"ירוק"/"אדום".
- [ ] כל `aria-label` של כפתור אייקון מופיע ב-`common.a11y.*` ומשתמש בשם פעולה מהרשימה.

## §16. שלושים דוגמאות: לפני (נשמע מתורגם) ואחרי (עברית ישראלית)

| # | הקשר | לפני | אחרי | מה תוקן |
|---|---|---|---|---|
| 1 | הוק, מסעדה | "האם ידעתם שהמנה שלנו היא הכי פופולרית בעיר?" | "המנה הזאת יוצאת מהמטבח 400 פעם בשבוע. הנה למה." (עם עובדה) | פתיחה בנתון במקום "האם ידעתם"; טענה רק עם עובדה |
| 2 | הוק, שיפוצים | "אתם לא תאמינו איך נראה המטבח הזה אחרי השיפוץ!" | "המטבח הזה עלה 38,000 ₪. נחשו מה החלפנו." (עם עובדה; טקסט של הוק, ולכן ₪ אחרי המספר) | Clickbait מתורגם ← מספר מוחשי ושאלה |
| 3 | הוק, עורכי דין | "אנו המשרד המוביל בתחום דיני העבודה" | "3 דברים לבדוק לפני שחותמים על מכתב פיטורים." | סופרלטיב אסור ← ערך מעשי, בלי להניח את מצב הצופה |
| 4 | הוק, ברברשופ (`slang`, זכר) | "בוא לחוות חוויית תספורת ייחודית" | "POV: קמת מהכיסא ולא זיהית את עצמך." | "חוויה ייחודית" ← רגע מוחשי |
| 5 | הוק, משכנתאות | "זה הזמן לחסוך במשכנתא שלכם!" | "אותה משכנתא, שני תמהילים, והפרש שיכול להגיע למאות אלפי שקלים." | "זה הזמן ל" + הבטחה ← טענה מגובה בסימולציה |
| 6 | קריינות, קליניקה | "אנו מציעים מגוון רחב של טיפולים מתקדמים בסביבה נעימה" | "התור הראשון הוא שיחת היכרות. בלי מקדחה ובלי הפתעות." | שמות תואר ריקים ← מה קורה בפועל |
| 7 | קריינות, צימר | "חוויה בלתי נשכחת של שקט ושלווה בלב הטבע" | "ג׳קוזי על המרפסת, נוף לגלבוע, ואף שכן מעבר לקיר." | קלישאה ← שלושה פרטים |
| 8 | קריינות, שיפוצים | "אנחנו מבצעים עבודות שיפוץ באופן מקצועי ואמין" | "לוח זמנים חתום בחוזה, ועדכון עם תמונות כל יום בוואטסאפ." | "באופן מקצועי" ← הוכחה |
| 9 | טקסט על המסך | "פתרון חדשני ומקיף לניהול העסק שלך" | "רילס מוכן לשבוע הזה" | ביטוי אסור ← תוצאה |
| 10 | הנעה לפעולה | "צרו קשר עוד היום!" | "שלחו לנו וואטסאפ, ונשלח לכם את המחירון." | בלי ערוץ ← ערוץ ותמורה |
| 11 | הנעה לפעולה, רילס | "לחצו על הקישור למטה" | "הקישור בביו" | אין "למטה" ברילס |
| 12 | הנעה לפעולה, נקבה | "הזמיני/הזמן תור עכשיו" | "קבעי תור בקישור שבביו." | לוכסן ← פנייה אחת לפי הפרויקט |
| 13 | כפתור בממשק | "לחץ כאן כדי לייצר סרטון" | "צרו את הסרטון · 50 קרדיטים" | זכר יחיד + "כאן" ← רבים ועלות |
| 14 | הודעת שגיאה | "אירעה שגיאה. אנא נסה שנית מאוחר יותר." | "לא הצלחנו ליצור את הסצנה. הקרדיטים חזרו אליכם. אפשר לנסות שוב." | מה קרה, מה עם הכסף, מה עושים |
| 15 | שגיאת שדה | "הזנת כתובת אימייל לא חוקית" | "הכתובת לא נראית תקינה. כדאי לבדוק שאין בה רווחים." | מאשים ← מסביר |
| 16 | מצב ריק | "אין נתונים להצגה" | "עוד אין פרויקטים. בואו ניצור את הסרטון הראשון." | טכני ← מזמין |
| 17 | טעינה | "טוען, אנא המתן..." | "כותבים את התסריט…" | "אנא המתן" ← מה קורה עכשיו |
| 18 | מייל, סרטון מוכן | "הננו שמחים להודיעך כי הסרטון שלך הושלם בהצלחה" | "הסרטון שלכם מוכן: מבצע חנוכה – סטודיו גוונים" | ביורוקרטיה ← התוצאה קודם |
| 19 | מייל, תשלום נכשל | "התשלום שלך נדחה. אנא עדכן את פרטי האשראי על מנת להמשיך" | "הכרטיס לא אושר. אפשר לעדכן אמצעי תשלום ולנסות שוב. הסרטונים שלכם שמורים." | "על מנת" + לחץ ← הרגעה ופעולה |
| 20 | דף המחירים | "תוכניות גמישות המותאמות לכל עסק ועסק" | "₪119 לחודש · כולל מע״מ · ביטול אונליין בכל רגע" | ריק ← מחיר ותנאים |
| 21 | ביטול מנוי | "אנו מצטערים לראותך עוזב. האם אתה בטוח?" | "לבטל את המנוי? החיוב הבא לא יתבצע, והגישה נשארת עד 1 בנובמבר." | זכר יחיד ורגשנות ← מה יקרה |
| 22 | התראה | "יש לך הודעה חדשה!" | "יעל אישרה את הסרטון "מבצע חנוכה"" | כללי ← מי, מה |
| 23 | ספריית ההוקים | "כל מה שאתם צריכים לדעת על הוקים" | "הוקים לסרטונים לנדל״ן: 10 משפטי פתיחה שעוצרים גלילה" | כותרת גנרית ← נושא ומספר |
| 24 | טקסט לפוסט, מסעדה | "בואו ליהנות מחוויה קולינרית ייחודית שלא תשכחו!!" | "שישי בערב בלי לחשוב פעמיים: מגש מהגחלים, פיתות מהטאבון ושולחן מלא." | קלישאה ו-"!!" ← תמונה מוחשית |
| 25 | ציות, רופא שיניים | "טיפולי שיניים ללא כאב, מובטח!" | "מסבירים כל שלב, ועוצרים מתי שצריך." + "התוצאות משתנות מאדם לאדם." | הבטחה אסורה ← תהליך והסתייגות |
| 26 | ציות, ביטוח (ממומן) | "יש לכם חובות? אנחנו נפתור לכם את הבעיה" | "הרבה משפחות לא יודעות כמה הן משלמות על ביטוח. בדיקת תיק בלי התחייבות." + "המידע אינו מהווה ייעוץ או המלצה." | פנייה שמניחה מצב כלכלי ← גוף שלישי |
| 27 | ציות, נדל״ן | "דירה במחיר מציאה! 1.9 מיליון בלבד" | "4 חדרים בקומה 3, מחיר מבוקש: ₪1,900,000." + "המחירים והתמונות להמחשה בלבד." (עם עובדות; בסרטון עם `shekel_format = prefix`) | "מציאה" ← מחיר מבוקש מפורש |
| 28 | דחיפות | "נשארו רק 3 מקומות, מהרו!" | "ההרשמה לקבוצת נובמבר נסגרת ביום חמישי." (עם עובדה) | דחיפות מזויפת ← מועד אמיתי |
| 29 | הקראה | "התקשרו ל-050-1234567 (גם בוואטסאפ) & תקבלו 10% הנחה" | בתצוגה: "התקשרו אלינו, או שלחו וואטסאפ. 10% הנחה על הביקור הראשון." · בהקראה: "התקשרו אלינו, או שלחו וואטסאפ. עשרה אחוזים הנחה על הביקור הראשון." | סוגריים, סמלים ושתי פעולות ← משפט נקי (הטלפון בכרטיס הסיום) |
| 30 | AI בממשק | "הבינה המלאכותית המהפכנית שלנו תיצור עבורך סרטון מושלם" | "בוחרים נישה והוק, ומקבלים סרטון מוכן תוך דקות." | מתלהב ומבטיח ← מה המשתמש עושה ומה מקבל |

מספרים בעמודת "אחרי" (400, 38,000, 1,900,000, 10%, נובמבר) הם דוגמה. בתוצר אמיתי הם מגיעים מהעובדות, או שהמשפט נכתב בלעדיהם.

### קריטריוני קבלה
- [ ] כל 30 שורות ה"לפני" נמצאות ב-`tests/fixtures/hebrew-lint-cases.json` כמקרים שליליים, וכל אחת מחזירה לפחות קוד `HE*` אחד או אזהרת `HE018`.
- [ ] כל 30 שורות ה"אחרי" עוברות את `lint` בלי שגיאות (עם הקשר מתאים: פנייה, נישה ועובדות).

## §17. רשימת בדיקה לפני פרסום טקסט

לכל מחרוזת חדשה בממשק, לכל הוק שנכנס לספרייה, ולכל שינוי בפרומפט שמייצר טקסט:

- [ ] נשמע כמו עברית שנכתבה במקור, כשקוראים בקול.
- [ ] פנייה אחת, לפי ההקשר, מההתחלה ועד הסוף; בלי לוכסנים ונקודות מגדריות.
- [ ] דובר בגוף ראשון מתאים לקול.
- [ ] רמת השפה מתאימה לנישה (טבלה 3.3).
- [ ] אין אף ביטוי מ-§5.2.
- [ ] כל מספר שסופר שם עצם עובר דרך ICU plural עם `one`, `two` ו-`other` (§6.2 סעיף 16); אין `{n} קרדיטים` מחוץ ל-`plural`.
- [ ] אין במחרוזת תווי כיווניות גולמיים (U+200E, U+200F) ואין מקף עברי (U+05BE). מספר או מילה לועזית בתוך קופי נעטפים ב-`<ltr>…</ltr>` של ICU או ב-`Num`, ובמקום מקף עברי כותבים "-" או מנסחים מחדש (חלק 00 §6.5; `lint:copy`, חלק 01 §2.6).
- [ ] כל מספר, מחיר, דירוג או זמן הוא עובדה מאושרת, placeholder, מספר רשימה, משך הסרטון או שנה.
- [ ] ₪ במקום הנכון למשטח (§6.1); מפריד אלפים; אחוז צמוד; "ב-30" עם מקף.
- [ ] גרשיים וגרש טיפוגרפיים; "…" ולא "..."; "←" ולא "→".
- [ ] הוק עד 12 מילים מדוברות ו-8 על המסך; המסר במילה הראשונה; בלי ברכה ובלי שם העסק.
- [ ] הנעה אחת, עם ערוץ ותמורה; וואטסאפ קודם לעסק מקומי.
- [ ] בנישה מוסדרת: ההסתייגות במקומה, בנוסח המדויק, ואין מילה אסורה.
- [ ] הטקסט להקראה בלי ספרות, אותיות לטיניות, סוגריים וסמלים; ניקוד רק במילים דו-משמעיות.
- [ ] טקסט על המסך נכנס בשתי שורות בכל הפורמטים של הפרויקט.
- [ ] טקסט לממשק: שם פעולה בכפתור, הודעת שגיאה שעונה על שלוש השאלות, טקסט קישור שמתאר יעד.
- [ ] בלי הומור על מלחמה, שכול, דת, עדות או פוליטיקה; ביום זיכרון — בלי טון שיווקי.

ובקופי של קמפיין, של פרסום רגיל ושל דוחות (§18–§19):

- [ ] במודעה: ההנעה בתוך 125 התווים הראשונים, ומתאימה לכפתור ולמטרה (§11.4); בלי האשטגים, בלי @, עד שני אימוג׳ים בטקסט הראשי ואף אחד בכותרת ובתיאור (§18.3).
- [ ] במודעה, בטופס הלידים ובדף העסק: בלי פנייה שמניחה מאפיין אישי של הצופה (§18.4), בלי הבטחת תוצאות, בלי ממשק מזויף, ומחיר, מועד או זמן תגובה רק מהעובדות.
- [ ] בכיתוב לפרסום רגיל: ההנעה בשורה הראשונה, 3–5 האשטגים ב-`hashtags_he` בלבד, בלי @, ובלי תווי כיווניות שהוקלדו ידנית (הקוד מוסיף אותם בזמן הפרסום).
- [ ] בדוחות ובתובנות: ארבעת השמות הקבועים, כל מספר מופיע בנתונים, בלי תחזית, בלי השוואה לעסקים אחרים ובלי ז׳רגון (§19.1–§19.6).
- [ ] ציון הוק וציון של בדיקת דופק מוצגים כהערכה, עם השורה הקבועה (§19.5).

### קריטריוני קבלה
- [ ] הרשימה מוצגת כלשונה בלשונית "בדיקות עברית" של `PromptTester` ושל עורך ההוקים באדמין (חלק 03), וכל סעיף שאפשר לבדוק במכונה מסומן שם ✓/✕ אוטומטית.
- [ ] סקירת העברית של M7 (חלק 06) משתמשת ברשימה הזו כטופס, ושומרת את התוצאות ב-`docs/eval/hebrew-review-m7.md`.

## §18. קופי למודעות במטא, לטופסי לידים, לפרסום רגיל ולדף העסק

הפרק חל על כל טקסט שאנחנו כותבים כדי שיופיע מחוץ לסרטון, כשהסרטון עולה לפייסבוק ולאינסטגרם: הטקסט הראשי, הכותרת והתיאור של מודעה (`ads.copy.v1` ← `AdCopyV1`), טופס הלידים (`LeadFormSpecV1`), הכיתוב לפרסום רגיל (`post.caption.v2` ← `PostCaptionV2`) ותוכן "דף העסק" (`landing.copy.v1` ← `LandingPageContentV1`). הסרטון עצמו נשאר תחת §2–§16. הטקסטים המלאים של הפרומפטים והמיקרו-קופי של המסכים נמצאים בחלק 07; כאן הכללים שלפיהם הם נכתבים, נבדקים ונערכים. כל מה שהמשתמש עורך בבונה הקמפיינים עובר את אותם כללים כאזהרות, ו-`moderation.ad.v1` מחליט לפני ההכנה ולפני הפרסום.

### 18.1 המבנה של מודעה

1. **הטקסט הראשי (`primary_text_he`)** — שתיים עד ארבע שורות קצרות, משפט אחד בכל שורה:
   - **שורה ראשונה:** המסר של ההוק במילים אחרות (לא העתק של הטקסט שעל המסך), או התועלת המוחשית.
   - **ההנעה לפעולה, עם הערוץ, בתוך 125 התווים הראשונים** (`ad_primary_text`, §12), כי זה מה שרואים לפני "עוד". בשורה הראשונה או בשנייה.
   - **שורה של עובדה אחת או שתיים:** מחיר, שעות, אזור, זמן עבודה — רק מהעובדות המאושרות (`business_profiles.facts`, `brief.offer`).
   - **שורה אחרונה (רשות):** ההנעה שוב, במילים אחרות.
2. **הכותרת (`headline_he`, עד 40 תווים)** — מה מקבלים, ואיפה: "הצעת מחיר בוואטסאפ", "תור לשבוע הבא", "המחירון המלא באתר". בלי שם העסק (מטא מציגה אותו ליד המודעה) ובלי סימן קריאה.
3. **התיאור (`description_he`, עד 30 תווים)** — רשות, משפט קצר אחד. הוא לא מוצג בכל מיקום, ולכן אף פעם לא נושא מידע חיוני [M0-verify באילו מיקומים הוא מוצג].
4. **הכפתור (`cta_type`)** — מהרשימה המותרת למטרה (§11.4). הטקסט מבטיח בדיוק את מה שהכפתור עושה.
5. **שלוש גרסאות לבדיקת 3 ההוקים:** כל גרסה נכתבת סביב ההוק שלה (`A`, `B`, `C`), והשורה הראשונה שונה ברעיון, לא רק בניסוח. מטא מתייחסת למודעות כמעט זהות כאל מודעה אחת.
6. **פנייה:** כמו בסרטון שהמודעה נושאת (`projects.audience_gender`, §4.1). פרויקט ברבים — מודעה ברבים, והעסק מדבר על עצמו ב"אנחנו".
7. **רמת שפה:** לפי הנישה (טבלה 3.3). במודעה מותר להיות ישיר יותר מבסרטון, לא צעקני יותר.
8. **₪ ומספרים:** לפי `brand_kits.shekel_format`, כמו בסרטון (§6.1, חריג 2), ולפי שאר הכללים של §6.2. מחיר במודעה זהה למחיר בסרטון ובדף שאליו היא מובילה.
9. **כיווניות:** שורה שמתחילה בספרה, ב-₪, באימוג׳י או באותיות לטיניות מקבלת U+200F בקוד בזמן השליחה למטא, כמו בכיתוב לפרסום רגיל (§18.6). כותבים לא מקלידים את הסימן, ועדיף לפתוח שורה במילה עברית.

### 18.2 מילים קבועות

השמות הקנוניים של חלק 07 (והטבלה ב-§8): **קמפיין** (כל ההשקה בתשלום), **מודעה** (אחת מתוכו), **פרסום רגיל** (פוסט או רילס בלי תשלום), **פנייה** (שיחה בוואטסאפ או ליד), **ליד** (מי שמילא טופס), **מנהל המודעות של מטא**. המטרות נקראות תמיד "הודעות בוואטסאפ", "לידים בטופס", "כניסות לאתר" ו"חשיפה לאזור". "בוסט", "אורגני", "המרה", "לנדינג" ו"אדס מנג׳ר" לא מופיעים בממשק.

### 18.3 מה אין במודעה

- **האשטגים** — אף אחד, ו-@ — אף אחד. שיתוף פעולה עם חשבון אחר עובר דרך השדה `collaborators`, ורק בפרסום רגיל.
- **יותר משני אימוג׳ים** בטקסט הראשי, ואימוג׳י כלשהו בכותרת או בתיאור. אימוג׳י לא מחליף מילה ("📞 עכשיו") ולא מחקה כפתור או התראה.
- **"ממומן", "פרסומת" או "מודעה" בתוך הטקסט:** מטא מסמנת את המודעה בעצמה.
- **הפניות שאין להן משמעות במודעה:** "הקישור בביו", "לחצו על הקישור למטה", "כתבו 'מחיר' בתגובות", "נווטו אלינו בוויז". במודעה יש כפתור (§11.4).
- **ממשק מזויף:** "⚠️ התראה", "הודעה חדשה", "נותרו 10% סוללה", כפתורי ▶ או ✕ מצוירים, "לחצו כאן לסגירה". פורמטים כאלה מותרים רק בפרסום רגיל (התבנית `fake-system-popup`, חלק 08), ושער הבטיחות חוסם אותם בקמפיין (`AD_NOT_ELIGIBLE` עם `reason: "deceptive_ui"` או `"organic_only_template"`).
- **הבטחת תוצאות** (`RESULTS_BANNED_PHRASES`, §19.6): "תוצאות מובטחות", "יותר לקוחות בוודאות", "ויראלי מובטח", "הכפלת המכירות", "ROI".
- **שותפות עם מטא:** "שותף רשמי של מטא", "מאושר על ידי מטא", והלוגואים של Meta, Facebook ו-Instagram.
- **מתחרים:** שמות של עסקים אחרים, "הכי זול בעיר", "מחירים שלא תמצאו בשום מקום אחר" (§5.2).
- **פוליטיקה, מלחמה, בחירות, אסונות ויום זיכרון** — בשום טון. תוכן כזה נחסם לפני כל קריאה למטא (חלק 07), ובימים שקטים לא מציעים קמפיין עונתי.
- **מספרים בלי עובדה:** מחיר, הנחה, דירוג, "נשארו X", "מאות לקוחות", "עונים תוך דקות" — רק מהעובדות (`HE022`).
- **המלצות:** רק ציטוט אמיתי עם הסכמה (§14, הערה 2). אף פעם לא "לקוחות מספרים" שנוצר ב-AI.

### 18.4 פנייה שמניחה מאפיין אישי (`PERSONAL_ATTRIBUTE_PATTERNS`, `HE026`)

כללי הפרסום של מטא אוסרים טקסט שקובע או רומז שלצופה יש מאפיין אישי: מצב בריאותי, גופני או נפשי, מצב כלכלי, גיל, דת או אמונה, מוצא, נטייה מינית, מצב משפחתי, היריון, עבר פלילי או מצב תעסוקתי. זו הגרסה המחייבת של §14, הערה 1. בקופי של קמפיין, בטופס הלידים ובדף העסק (שהמודעה מובילה אליו) כותבים על השירות, על המצב או בגוף שלישי — לא על הצופה.

| ✗ נדחה | למה | ✓ במקום |
|---|---|---|
| "את סובלת מכאבי גב?" | מצב בריאותי של הצופה | "תרגיל אחד לכאבי גב, שאפשר לעשות ליד השולחן." |
| "יש לכם חובות?" | מצב כלכלי | "הרבה משפחות לא יודעות כמה הן משלמות על הלוואות. בדיקת תמהיל לוקחת שיחה אחת." |
| "בני 50 ומעלה? זה בשבילכם." | גיל | "פילאטיס בקבוצות קטנות, בקצב שמתאים לגוף." |
| "סובלים מחרדה?" | מצב נפשי | "הפגישה הראשונה היא שיחת היכרות. מגיעים, מספרים, ומחליטים יחד." |
| "רוצים לרדת 10 קילו?" | מצב גופני, והבטחה | "שלושה אימונים בשבוע, בקצב שהגוף מאפשר." |
| "את בהיריון? בואי להצטלם." | היריון | "צילומי היריון בסטודיו, באור טבעי." |
| "גרושים טריים?" | מצב משפחתי | "דירות שלושה חדרים להשכרה בקריות." |
| "מחפשים עבודה?" | מצב תעסוקתי | "קורס ערב בחיפה: חצי שנה, פעמיים בשבוע." (עם עובדות) |

`HE026` מזהה פנייה בגוף שני (ציווי או שאלה, "אתם", "את", "אתה", "יש לכם", או "בני" ו"בנות" ואחריהם גיל) ליד מילה מרשימת המאפיינים של `PERSONAL_ATTRIBUTE_PATTERNS` (כאב, מחלה, חרדה, דיכאון, משקל, קילו, היריון, חובות, פיגור בתשלומים, מובטל, גירושין, רווקות, גיל ועוד). הכלל הוא שגיאה בתוצרי `ads.copy.v1` ו-`landing.copy.v1` ובטקסטים של טופס הלידים, ואזהרה בעריכה של המשתמש. ההחלטה הסופית, לפני ההכנה ולפני הפרסום, היא של `moderation.ad.v1`.

### 18.5 טופס לידים (`LeadFormSpecV1`)

הטופס של מטא (`HE_IL`) הוא ההמשך של המודעה, ולכן הוא כתוב באותה פנייה ובאותה רמת שפה. הוא קצר: שם וטלפון חובה, מייל ועיר רשות, ועד שלוש שאלות שלנו.

| חלק בטופס | כלל | דוגמה |
|---|---|---|
| כותרת הפתיחה (`lead_form_headline`, עד 60 תווים) | מה מקבלים, לא "מלאו את הטופס" | "הצעת מחיר לשיפוץ האמבטיה" |
| טקסט הפתיחה (`lead_form_intro`, עד 200 תווים) | מה קורה אחרי השליחה, ומי חוזר | "משאירים שם וטלפון, ונחזור אליכם לתיאום. זה לוקח פחות מדקה." |
| שאלות שלנו (עד 3) | שאלה קצרה לכל דבר; בחירה מרשימה עדיפה על טקסט חופשי. לא שואלים על בריאות, הכנסה או גיל, אלא אם השירות לא אפשרי בלי זה (ואז ⚖️) | "באיזה אזור הדירה?" · "מתי נוח שנחזור אליכם?" |
| הקישור למדיניות הפרטיות (`lead_form_privacy_link`, עד 70 תווים) | שם המסמך ושם העסק | "מדיניות הפרטיות של {businessName}" |
| הסכמה לדיוור (כבויה כברירת מחדל) | מה יישלח ומאת מי; עם מילה עצמאית, כי לפני משתנה של זמן ריצה לא מצמידים אות שימוש (§9) | "מאשרים לקבל עדכונים ומבצעים מאת {businessName}" |
| מסך התודה: כותרת | קצרה, בלי סימן קריאה | "קיבלנו את הפרטים" |
| מסך התודה: גוף | מה קורה עכשיו; זמן חזרה רק כשהוא עובדה | "נחזור אליכם בהקדם. אפשר גם לכתוב לנו עכשיו בוואטסאפ." |
| מסך התודה: כפתור | פעולה אחת, לפי הערוץ | "שלחו לנו וואטסאפ" · "התקשרו" · "לאתר" |

ההודעה המוכנה שבעל העסק שולח לליד מתיבת הלידים נכתבת בקול של העסק, עד 200 תווים (`prefill_he`, §12), בלי מגדר ובלי מחיר: "היי {firstName}, כאן {businessName}. קיבלנו את הפנייה שלכם ונשמח לעזור." טלפון, מייל או שם של ליד לא נכנסים לשום פרומפט ולשום טקסט שנוצר ב-AI.

### 18.6 כיתוב לפרסום רגיל (`post.caption.v2`)

1. **שורה ראשונה:** ההנעה, או ההוק במילים אחרות ומיד אחריו ההנעה (`first_line_cta_he`). המשפט הראשון עד 90 תווים (§12, `post_caption_he`).
2. **אורך:** המחולל מכוון ל-600 תווים, והמשתמש יכול להאריך עד 2,000 (`ig_caption`).
3. **האשטגים:** 3–5, ב-`hashtags_he` בלבד (§10). בונה הכיתוב מצרף אותם בסוף.
4. **בלי @:** חשבון שותף עובר דרך `collaborators` (עד 3).
5. **תווי כיווניות:** שורה שמתחילה בספרה, באימוג׳י, ב-₪ או באותיות לטיניות מקבלת U+200F, ומספר טלפון או כתובת נעטפים ב-U+2066…U+2069 — הכול בקוד, בזמן הפרסום (`lib/social/caption.ts`). כותבים לא מקלידים אותם, ו-`lint` מתריע עליהם בתוכן (§8).
6. **הודעת ה-AI:** הנוסח הקבוע של חלון הפרסום ושל סקירת הקמפיין נמצא בחלק 07. לא כותבים "בלי תווית AI", ולא מבטיחים שמטא לא תוסיף תווית.

### 18.7 דף העסק (`landing.copy.v1`, `/b/[slug]`)

דף העסק הוא דף אינטרנט ציבורי של העסק, שמודעות "כניסות לאתר" ו"לידים" מובילות אליו. הוא כתוב ברבים (§4.1), העסק מדבר בו ב"אנחנו", והוא עומד בכל כללי האמת של הנספח: בלי ביקורות, מחירים, דירוגים או מדיניות שלא הגיעו מהעובדות.

| חלק | כלל | דוגמה (עם עובדות) |
|---|---|---|
| כותרת ראשית (`landing_h1`) | מה עושים ואיפה; בלי "ברוכים הבאים" ובלי שם העסק לבד | "שיפוץ חדרי רחצה בחיפה ובקריות" |
| שורת משנה (`landing_subline`) | איך זה עובד, או הוכחה אחת | "הצעת מחיר כתובה אחרי ביקור אחד, ולוח זמנים חתום בחוזה." |
| שלושה יתרונות (`landing_benefit`) | כל אחד פרט מוחשי, לא שם תואר | "עדכון עם תמונות כל יום בוואטסאפ" |
| שירותים | שם השירות, ומחיר רק מהמחירון ("החל מ-₪350", דרך `Price`); בלי "מחירים נמוכים" | "החלפת אריחים · החל מ-₪350 למ״ר" |
| שעות פתיחה | ימים בקיצור עם גרש, שעות ב-24 שעות, טווח עם מקף ארוך (§6.2) | "א׳–ה׳ 08:00–18:00 · ו׳ 08:00–13:00" |
| כתובת וכפתורים | כפתור אחד לכל ערוץ, עם ההנעות של §11.3 | "נווטו אלינו בוויז" · "שלחו לנו וואטסאפ" · "התקשרו" |
| טופס פנייה | שם, טלפון והודעה (רשות); הכפתור "שליחה"; אחרי השליחה: "קיבלנו את הפרטים. נחזור אליכם בהקדם." | — |
| שאלות נפוצות (עד 5) | רק מה שיש לו עובדה — חניה, אחריות, כשרות, ביטולים. בלי עובדה אין שאלה | "יש אחריות על העבודה?" ← "כן, שנתיים על האיטום." |
| תחתית | שם העסק, מספר עוסק או ח״פ וכתובת, כשהם בעובדות; הקישור "מדיניות הפרטיות" (`/b/[slug]/privacy`, ⚖️, חלק 07); בנישה מוסדרת — ההסתייגות של §14 כלשונה | — |

**תצוגה מקדימה בתוכנית החינמית:** דף העסק הוא יכולת בתשלום (חלק 07, חלק 06). בתוכנית החינמית אפשר לראות תצוגה מקדימה עם סימן מים, שלא ניתנת לפרסום, ולידה השורה הקבועה "דף העסק זמין בתוכניות בתשלום". השורה "נבנה עם {{BRAND_NAME}}" מופיעה רק בתוכנית החינמית: בתצוגה המקדימה, ובדף היחיד שסביבה חינמית שרכשה חבילת קרדיטים רשאית לפרסם (חלק 06 §2.1); בתוכניות בתשלום אין בדף מיתוג שלנו. כפתור היצירה ושל היצירה מחדש מציג את העלות בקרדיטים לפני הלחיצה (עיקרון 11 של חלק 00, דרך תבנית הקרדיטים של `common`). עריכת טקסט בדף, פרסום והסרה מפרסום לא עולים קרדיטים, ולכן לא מוצגת לידם עלות.

### 18.8 שש דוגמאות: לפני ואחרי

| # | נישה · מטרה | ✗ לפני | ✓ אחרי (עם העובדות המתאימות) | מה תוקן |
|---|---|---|---|---|
| 1 | מסעדה · הודעות בוואטסאפ | "האוכל הכי טוב בעיר!! הזמינו עכשיו 🍔🔥🎉😋" | "שיפודים על גחלים ופיתות מהטאבון, עד 23:00. שלחו לנו הודעה בוואטסאפ, ונשמור לכם שולחן." | סופרלטיב, "!!" וארבעה אימוג׳ים ← פרט מוחשי, שעה מהעובדות, ערוץ ותמורה |
| 2 | רופאי שיניים · לידים בטופס | "את סובלת מרגישות בשיניים? טיפול ללא כאב, מובטח." | "הרבה אנשים דוחים בדיקה שנים. בבדיקה הראשונה מסבירים כל שלב. השאירו פרטים, ונחזור אליכם לתיאום." | מאפיין בריאותי (`HE026`) והבטחה אסורה (§14) ← גוף שלישי ותהליך |
| 3 | שיפוצים · הודעות בוואטסאפ | "הקבלן המוביל בתחום! מחירים שלא תמצאו בשום מקום אחר" | "שולחים 3 תמונות של החדר בוואטסאפ, ומקבלים הצעת מחיר כתובה. לוח הזמנים חתום בחוזה." | שני ביטויים אסורים (§5.2) ← מה עושים ומה מקבלים |
| 4 | יועצי משכנתאות · לידים בטופס | "יש לכם חובות? אישור משכנתא בטוח תוך 24 שעות" | "שני תמהילים לאותה הלוואה יכולים להיגמר בהחזר חודשי אחר. השאירו פרטים לבדיקה בלי התחייבות." + "המידע אינו מהווה ייעוץ או המלצה." | מאפיין כלכלי והבטחה ← הסבר, וההסתייגות של §14 |
| 5 | חנות אונליין · כניסות לאתר | "מבצע של פעם בחיים!!! נשארו רק 3 יחידות #מבצע #סייל" | "סט מגבות כותנה ב-₪149, משלוח חינם עד יום חמישי. כל הפרטים באתר." | דחיפות מזויפת, "!!!" והאשטגים ← מחיר ומועד אמיתיים |
| 6 | ברברשופ · הודעות בוואטסאפ | "⚠️ התראה: יש לכם הודעה חדשה! הקישור בביו" | "קמתם מהכיסא ולא זיהיתם את עצמכם? ככה זה אצלנו. שלחו הודעה בוואטסאפ, וסוגרים תור." | ממשק מזויף והפניה לביו ← הוק אמיתי והנעה שמתאימה לכפתור |

### קריטריוני קבלה
- [ ] `tests/fixtures/ad-copy-cases.json` כולל את כל שורות ה-✗ של §18.4 ושל §18.8 כמקרים שליליים (כל אחת נכשלת לפחות באחד מ-`HE001`, `HE022`, `HE026`, `HE027`, או בבדיקת ה-Zod של אימוג׳ים, האשטגים ו-@), ואת שורות ה-✓ כמקרים חיוביים שעוברים עם העובדות המתאימות.
- [ ] `HE026` לא מתריע על אף שורת ✓ בטבלה 18.4, ולא על ההסתייגויות של §14.
- [ ] בבדיקת יחידה של `ads.copy.v1` (fixture עם 3 הוקים), השורה הראשונה של שלוש הגרסאות שונה (דמיון trigram מתחת ל-0.6), וההנעה של כל גרסה נמצאת בתוך 125 התווים הראשונים.
- [ ] `HE022` רץ על הטקסט של המודעה ועל תוכן דף העסק: כל מחיר, אחוז, שעה או מספר בהם קיים בעובדות או ב-`brief.offer`.
- [ ] טקסט ההסכמה לדיוור בטופס הלידים הוא "מאשרים לקבל עדכונים ומבצעים מאת {businessName}", והתיבה כבויה כברירת מחדל.
- [ ] בתוכנית החינמית, בלי רכישת חבילה, דף העסק לא ניתן לפרסום, והתצוגה המקדימה מציגה סימן מים ואת השורה "דף העסק זמין בתוכניות בתשלום" (e2e).

## §19. שפת הדוחות, התובנות והציונים

הפרק חל על כל טקסט שמסביר לבעל העסק מה קרה: הדשבורד (`/app/campaigns`) ודף הקמפיין, הכרטיס "מה זה אומר?" (`ads.insight_explain.v1`), הסיכום השבועי (`weekly_results` במייל ו-`weekly_results_he` בוואטסאפ), טבלת הסרטונים שעובדים הכי טוב ב-`/app/publish`, הדוח של "בדיקת דופק" (`ads.health_check.v1`), "תוכנית 30 יום" (`plan.month.v1`) וציון ההוק (`hooks.score.v1`, `HookScoreBadge`). המחרוזות הסופיות נמצאות בחלק 07, ולציון ההוק בחלק 03; כאן הכללים. העיקרון: **מספרים אמיתיים, משפט אחד שמסביר אותם, ובלי הבטחות.**

### 19.1 ארבעת המספרים

השמות קבועים, תמיד באותו סדר ובאותו כתיב: בדשבורד, בדף הקמפיין, בסיכום השבועי ובהסברים.

| # | השם | "מה זה?" (שורה אחת) | הערות |
|---|---|---|---|
| 1 | כמה הוצאתם | "כמה מטא חייבה על הקמפיינים בתקופה הזו." | ₪ דרך `formatIls`; הסכום כפי שמטא מדווחת |
| 2 | כמה אנשים ראו | "כמה אנשים שונים ראו את המודעה לפחות פעם אחת." | זה reach, לא חשיפות |
| 3 | כמה פניות | לפי המטרה: **"פניות בוואטסאפ"** — "כמה שיחות חדשות נפתחו איתכם בוואטסאפ מהמודעה." · **"לידים"** — "כמה אנשים השאירו פרטים בטופס." · **"כניסות לאתר"** — "כמה אנשים הגיעו לאתר אחרי לחיצה על המודעה." · בחשיפה: **"צפו לפחות 3 שניות"** — "כמה פעמים צפו במודעה לפחות 3 שניות." | התווית של המשבצת היא התווית של המטרה; "כמה פניות" הוא השם בסיכום של כמה מטרות יחד |
| 4 | כמה עלתה כל פנייה | "ההוצאה חלקי מספר הפניות." · בחשיפה: **"עלות ל-1,000 אנשים"** — "כמה עלה להגיע ל-1,000 אנשים." | כשאין פניות: "אין עדיין פניות", לא "₪0" ולא "∞" |

**שינוי מול התקופה הקודמת:** מילה, מספר ותקופה — "עלה ב-12% לעומת השבוע הקודם", "ירד ב-₪3 לעומת 14 הימים הקודמים". החץ והצבע לא נושאים לבד את המשמעות (`KpiTile`, חלק 01). בעלות לפנייה ירידה היא טובה; בפניות ובאנשים שראו עלייה היא טובה; בהוצאה אין צבע של טוב או רע, רק כיוון. כשאין תקופה קודמת: "אין עדיין תקופה להשוואה".

### 19.2 מדדי ההוק

| המדד | בממשק | "מה זה?" | איך מחושב |
|---|---|---|---|
| hook rate | **עצרו לצפות** | "מתוך כל הפעמים שהמודעה הופיעה, בכמה עצרו לצפות לפחות 3 שניות." | צפיות של 3 שניות ÷ חשיפות |
| hold rate | **נשארו עד הסוף** | "מתוך מי שעצר לצפות, כמה צפו עד הסוף או לפחות 15 שניות." | ThruPlay ÷ צפיות של 3 שניות [M0-verify את ההגדרה של ThruPlay ב-`v26.0`] |
| impressions | חשיפות | "כמה פעמים המודעה הופיעה על מסך. אותו אדם יכול לראות אותה יותר מפעם אחת." | — |
| `reels_skip_rate` (פרסום רגיל) | דילגו מהר | "כמה מהצופים גללו הלאה בשלוש השניות הראשונות. נמוך יותר זה טוב יותר." · בלי ערך: "אין עדיין מספיק צפיות" | מטא מחזירה |
| זמן צפייה ממוצע (פרסום רגיל) | כמה מהסרטון צפו | "בממוצע, איזה חלק מהסרטון צפו." | זמן צפייה ממוצע ÷ אורך הסרטון |

- **המנצח** מסומן רק אחרי המדגם המינימלי (`meta_min_sample`). לפני כן: "עדיין מוקדם לקבוע מנצח".
- **שני אוצרות מילים:** בקמפיין — חשיפות, "עצרו לצפות", פניות; בפרסום רגיל — צפיות, "דילגו מהר", שיתופים. לא מערבבים אותם בטבלה אחת.

### 19.3 אי ודאות והערכות

- **מוקדם מדי:** לפני המדגם המינימלי — "עדיין מוקדם לדעת", וההמלצה היחידה היא לחכות (`wait_more_data`).
- **עדכניות:** "עודכן לפני {minutes} דקות" דרך ICU plural (`{minutes, plural, one {עודכן לפני דקה} two {עודכן לפני שתי דקות} other {עודכן לפני # דקות}}`), וההערה הקבועה "נתוני מטא יכולים להתעדכן עד 28 יום אחורה".
- **הערכה נקראת הערכה:** "בערך ₪1,200 לחודש" (תקציב יומי × 30), "₪30–₪50 ליום" כהמלצת פתיחה ולא כהבטחה, והמשפט הכן על חריגה יומית מהתקציב (חלק 07, [M0-verify]).
- **אין תחזיות:** לא "בשבוע הבא יגיעו 20 פניות", לא "הקמפיין הזה יביא לקוחות", לא "תוך חודש תחזירו את ההשקעה".
- **אין השוואה לאחרים:** לא "הממוצע בתחום שלכם", לא "עסקים כמוכם", לא "יותר מהמתחרים". אין לנו נתוני השוואה בין לקוחות (חלק 07, [Counsel]); משווים רק לעבר של אותו חשבון.
- **אין סיבתיות שלא הוכחה:** "גרסה B הביאה פניות בעלות נמוכה יותר", ולא "ההוק של גרסה B שכנע יותר אנשים".

### 19.4 הסבר והמלצה

**המבנה של "מה זה אומר?"** — 2–4 משפטים קצרים: מה קרה, במספרים מהנתונים · מה זה אומר, במשפט אחד · עד שתי המלצות מהרשימה הסגורה, כל אחת עם כפתור.

- **כל מספר בטקסט קיים בנתונים** שנשלחו למודל (ולידציה סמנטית). פלט שנפסל מוחלף בתבנית הדטרמיניסטית של `lib/meta/explain-fallback.ts`, שעומדת באותם כללים.
- **ניסוח של המלצה:** "כדאי לשקול…", "אפשר…", "שווה לבדוק…". לא "חייבים", לא "מומלץ בחום", לא "מיד".
- **בלי האשמה:** "עוד לא הגיעו פניות" ולא "הקמפיין נכשל"; "ההגדרה הזו מפצלת תקציב קטן" ולא "טעיתם".
- **בלי פרטים אישיים:** לא שם ולא טלפון של ליד, רק ספירות. הנתונים של הלידים לא נכנסים לפרומפט בכלל.
- **פנייה:** ברבים, או לפי `ui_gender_form`, כמו בממשק (§4.1).

| פעולה (`action`) | כיוון הניסוח של ההמלצה |
|---|---|
| `wait_more_data` | "כדאי לחכות עוד כמה ימים לפני שמשנים משהו." |
| `raise_budget_20` | "אפשר לשקול להעלות את התקציב היומי ב-20%." |
| `boost_winner` | "גרסה {key} מביאה פניות בעלות נמוכה מהאחרות. אפשר להגביר אותה." (הכפתור: "הגבירו את המנצח") |
| `pause_ad` | "כדאי לשקול להשהות את גרסה {key} ולהשאיר את התקציב לאחרות." |
| `new_variants_from_winner` | "שווה ליצור עוד 3 גרסאות מההוק המנצח." |
| `fix_rejected_ad` | "מטא לא אישרה את אחת המודעות. אפשר לתקן אותה ולשלוח שוב." |
| `extend_end_date` | "הקמפיין מסתיים בקרוב. אפשר להאריך אותו." |
| `reply_to_whatsapp_fast` | "יש שיחות חדשות בוואטסאפ. כדאי לענות להן כמה שיותר מהר." |
| `check_lead_form` | "כדאי לבדוק שטופס הלידים קצר וברור." |

`{key}` הוא `A`, `B` או `C`, ואין לפניו אות שימוש.

### 19.5 ציונים ותוכניות: ציון הוק, בדיקת דופק, תוכנית 30 יום

**ציון הוק** (`hooks.score.v1`, חלק 05; הממשק בחלק 03):
- התצוגה: "ציון הוק: {score} מתוך 100", לא "72/100". מתחתיו, תמיד ובכל מקום שבו הוא מוצג (דף הפרויקט, שלב הסקירה בבונה הקמפיינים, כרטיסי הטרנדים), השורה הקבועה, מילה במילה: **"הערכה לפי כללי הוקים — לא הבטחה לתוצאות."**
- הציון בודק את ההוק לפי כללים ואת הטקסט של הסטוריבורד, לא את קובץ הווידאו. לכן כותבים "בדקנו את ההוק לפי {n} כללים" (ICU plural), ולא "ניתחנו את הסרטון".
- עד שלוש הצעות, כל אחת תיקון מוחשי בציווי ברבים, עד 12 מילים (`hook_score_tip`), עם הכפתור "תקנו בקליק": "קצרו את ההוק ל-9 מילים", "הקדימו את החשיפה לשנייה הראשונה", "הוסיפו טקסט על המסך כבר בחצי השנייה הראשונה", "נסו את גרסת ההוק B".
- לא: "ההוק הזה יהיה ויראלי", "ציון גבוה = יותר צפיות", "ההוק שלכם חלש". כן: "אפשר לחזק את ההוק".

**בדיקת דופק** (`ads.health_check.v1`, חלק 07):
- הכותרת "איפה הכסף נשרף" מובילה לממצאים עם מספרים מהחשבון עצמו בלבד: "₪420 הלכו על 3 מודעות שלא הביאו אף פנייה ב-30 הימים האחרונים."
- השוואה רק לחשבון עצמו ("נמוך מהממוצע של החשבון שלכם"), אף פעם לא לעסקים אחרים.
- עד 5 תיקונים, כל אחד עם הסבר בשורה אחת וכפתור לבונה הקמפיינים כשאפשר; בלי האשמה.
- ציון הבריאות (0–100) מוצג כמו ציון ההוק, "{score} מתוך 100", ומתחתיו שורה קבועה שאומרת שזו הערכה לפי הבדיקות ולא הבטחה לתוצאות (הנוסח בחלק 07, באותו מבנה של השורה של ציון ההוק).

**תוכנית 30 יום** (`plan.month.v1`, חלק 07):
- כותרת של פריט עד 8 מילים, שמתחילה בסוג: "רילס: לפני ואחרי של חדר אמבטיה", "קמפיין: הודעות בוואטסאפ לפני ראש השנה".
- תאריכים לפי §6.2 ("יום חמישי, 12 בנובמבר"); ביום שקט אין פריט שיווקי.
- תקציב מוצע מסומן כהמלצה, לא כתחזית: "₪40 ליום · המלצה לפתיחה".

### 19.6 מילים אסורות וז׳רגון (`RESULTS_BANNED_PHRASES`, `ADS_JARGON`, `HE027`)

**`RESULTS_BANNED_PHRASES`** — `HE027`, שגיאה בתוצרי `ads.insight_explain.v1`, `ads.health_check.v1`, `plan.month.v1`, `hooks.score.v1`, `ads.copy.v1` ו-`landing.copy.v1`, ובמחרוזות הממשק והמיילים של הקמפיינים, הלידים והפרסום (`lint:copy`). הבדיקה כמו ב-§5.2: רצף אחרי נרמול. האתר השיווקי ושאלות נפוצות כמו "יש תוצאות מובטחות?" (חלק 02) לא נבדקים בכלל הזה. בשלילה כותבים "לא מבטיחים תוצאות", ולא "אין תוצאות מובטחות".

| ביטוי | במקום |
|---|---|
| תוצאות מובטחות · תוצאה מובטחת | מה עושים ומה בודקים |
| יותר לקוחות בוודאות | "פניות מאנשים באזור שלכם" (תיאור, לא הבטחה) |
| ויראלי מובטח · יהיה ויראלי · יתפוצץ ברשת | "פורמט שעובד עכשיו ברשתות" (כשזה נכון) |
| הכפלת המכירות · הכפלת ההכנסות | — |
| ROI · החזר השקעה מובטח | "כמה עלתה כל פנייה" |
| בטוח יעבוד · בטוח תקבלו | "כדאי לנסות" |
| הממוצע בתחום · עסקים כמוכם | השוואה לעבר של החשבון בלבד |
| הקמפיין נכשל | "עוד לא הגיעו פניות" |

**`ADS_JARGON`** — לא בממשק הרגיל: ROAS, CPM, CPC, CTR, CPL, CPA, ODAX, Advantage+, ad set, pixel, וגם הצורות העבריות "אד סט", "קבוצת מודעות", "פיקסל", "המרות", "אופטימיזציה". מותר רק בתוך "הגדרות מתקדמות", עם הסבר בשורה אחת ("Advantage+: מטא מחליטה לבד איפה להציג את המודעה"), דרך רשימת ההיתר של `lint:copy` (חלק 01 §2.6). במקומם: "כמה עלתה כל פנייה", "עצרו לצפות", "תנו למטא למצוא את הקהל המתאים", "רק רילס וסטוריז".

### 19.7 שש דוגמאות: לפני ואחרי

| # | הקשר | ✗ לפני | ✓ אחרי (המספרים מהנתונים) | מה תוקן |
|---|---|---|---|---|
| 1 | "מה זה אומר?", שבוע ראשון | "הקמפיין שלכם מצליח מאוד! בשבוע הבא תקבלו פי 2 פניות." | "בשבוע האחרון הוצאתם ₪280, והגיעו 14 פניות בוואטסאפ: ₪20 לפנייה. עדיין מוקדם לקבוע מנצח בין ההוקים." | תחזית וסימן קריאה ← מספרים מהנתונים ואי ודאות |
| 2 | השוואת הוקים | "ה-CTR של B נמוך וה-CPM גבוה. כדאי לשפר את האופטימיזציה של ה-ad set." | "בגרסה B פחות אנשים עצרו לצפות. כדאי לשקול להשהות אותה ולהשאיר את התקציב לשתי האחרות." | ז׳רגון ← "עצרו לצפות" והמלצה מהרשימה |
| 3 | עלות לפנייה | "העלות לפנייה שלכם גבוהה מהממוצע בתחום." | "העלות לפנייה עלתה מ-₪18 ל-₪26 לעומת השבוע הקודם." | השוואה לאחרים ← השוואה לעבר של החשבון |
| 4 | אין פניות | "אין תוצאות. הקמפיין נכשל." | "ב-48 השעות האחרונות הוצאתם ₪60, ועוד לא הגיעו פניות. כדאי לבדוק שטופס הלידים קצר וברור." | שיפוט ← עובדה ופעולה |
| 5 | הגדלת תקציב | "מומלץ בחום להכפיל את התקציב כדי להכפיל את המכירות." | "גרסה A מביאה פניות בעלות נמוכה מהאחרות. אפשר להגביר אותה ולהעלות את התקציב ב-20%." | הבטחה ← המלצה מהרשימה הסגורה |
| 6 | ציון הוק | "ציון 82! ההוק הזה יהיה ויראלי." | "ציון הוק: 82 מתוך 100." ומתחת: "הערכה לפי כללי הוקים — לא הבטחה לתוצאות." | תחזית ← הערכה עם השורה הקבועה |

### 19.8 מיילים והתראות על תוצאות

- **הסיכום השבועי** (`weekly_results`): נושא עד 50 תווים (§12), בלי אימוג׳ים ובלי הבטחה; ארבעת המספרים של 7 הימים האחרונים מול השבוע הקודם, ההוק המנצח (רק אחרי המדגם המינימלי), הרילס הכי טוב והמלצה אחת. הוא נשלח רק כשהייתה הוצאה או פרסום באותו שבוע, ולכן אין בו "השבוע לא קרה כלום".
- **ליד חדש** (`lead_received` בממשק, `lead_new` במייל): השם הפרטי ושם הקמפיין. הטלפון לא נכנס לנושא של מייל, ובוואטסאפ הוא נכנס רק לפי ההגדרה `lead_notify.include_phone_in_whatsapp` (⚖️, חלק 07).
- **תקרת הוצאה** (`spend_cap_warning`): מה קרה ומה לא קורה, בלי פנייה מאשימה: "נוצלו 80% מתקרת ההוצאה החודשית. המודעות ממשיכות לרוץ." לעולם לא רומזים שעצרנו מודעות: תקרה של התוכנית לא משהה מודעות (עיקרון 12 של חלק 00).
- **מודעה שנדחתה** (`meta_ad_rejected`): הסיבה של מטא בעברית פשוטה, מ-`REVIEW_FEEDBACK_HE` (חלק 07), ומה עושים עכשיו. "מטא לא אישרה את המודעה", ולא "המודעה שלכם הפרה את הכללים".

### קריטריוני קבלה
- [ ] `tests/fixtures/insight-cases.json`: כל שורת ✗ ב-§19.7 נכשלת (`HE027`, מספר שלא קיים בקלט, פעולה מחוץ לרשימה, או ז׳רגון), וכל שורת ✓ עוברת עם הקלט המתאים.
- [ ] הוולידציה הסמנטית של `ads.insight_explain.v1` דוחה פלט עם מספר שלא קיים בקלט, עם פעולה מחוץ לרשימה הסגורה, או עם פעולה שאינה `wait_more_data` לפני המדגם המינימלי; הטקסט של `lib/meta/explain-fallback.ts` עובר `lint` בלי שגיאות.
- [ ] `lint:copy` נכשל על כל מונח מ-`ADS_JARGON` במחרוזות של הקמפיינים, הלידים והפרסום מחוץ לרשימת ההיתר של ההגדרות המתקדמות, ועל כל ביטוי מ-`RESULTS_BANNED_PHRASES` באותן מחרוזות ובתבניות המייל של חלק 07.
- [ ] בכל מקום שבו מוצג ציון הוק (דף הפרויקט, שלב הסקירה בבונה, כרטיס טרנד), השורה "הערכה לפי כללי הוקים — לא הבטחה לתוצאות." מופיעה כלשונה (snapshot ב-e2e).
- [ ] ארבעת שמות המדדים מופיעים באותו סדר ובאותו כתיב בדשבורד, בדף הקמפיין ובמייל השבועי (snapshot).

## תלויות בין חלקים

- **חלק 05:** החוזים שהדוגמאות עומדות בהם — JSON Schema ו-Zod של `ScriptV1`/`StoryboardV1` (§11.1–§11.2) והבדיקות `S01`–`S15`, `B01`–`B13` (§11.3); `pickSampleScript` (§10.6) קורא את `lib/ai/prompts/examples/*.json`; `STRUCTURES` ותקציב המילים `0.9 × wps × target`, עם כרטיס הסיום אחרי הסצנות (§12.1–§12.2); `CTA_DEFAULTS` עם מירכאות ASCII (§12.4); `STYLE_ANCHORS` (העוגן `cinematic` בלי עדשה) וכלל 10 של הסטוריבורד (§10.7, §13.2); `planVisualSources`, `mixCap` ו-`snapDuration` (§14.1); `estimate` ו-`SAMPLE_PRESETS.images15` = 23 (§14.2); `normalizeForTts`, `NOUN_GENDER` עם צורות הסמיכות, `ACRONYMS` ו-`LOANWORDS` (§15.2–§15.5); `persistentDisclaimer()` (§20.7); `COMPLIANCE_RULES` ו-`NICHE_OVERRIDES`, שהסתייגויות §14 כאן זהות להם תו בתו (§21.3); סעיף 11 של `sys.hebrew_style.v1` נבנה מ-`BANNED_PHRASES` (§9); כללי ה-lint `HE001`–`HE025` (§23.3); `Animatic`, `PosterStill` ו-`scripts/render-demo-videos.ts` (§20.10, §23.4) — חמש הדוגמאות מרונדרות כ-`Animatic` באורך מלא בשלושת הפורמטים; `LENGTH_LIMITS`, `HookTitle` ו-`OverlayTexts` (§20.5); `fillPlaceholders` ו-`stripNiqqud` (`lib/hebrew/text.ts`), `applyShekel` ו-`PLACEHOLDERS` (`lib/hebrew/placeholders.ts`, §8.2).
- **חלק 04:** `ProjectBrief` (§19.3), סוגי ה-enum (§3), `business_profiles.facts` במבנה `[{key, label_he, value}]` (§4); `niche_extras.json` (§16.1, `fill_if_null`) שנטען מטבלה §3.3 כאן; בודק הזרע מייבא את `BANNED_PHRASES` (§16.2); `plans.limits` ו-`credit_costs` (§16.4) — הדוגמאות מניחות תוכנית `business`, והחישובים 23 ו-15 קרדיטים נשענים על המחירון; נתיבי `public-media/demo/examples/` ו-`demo/wall/` ו-`paths.pub.demoExample` (§13.1, §13.4); `422 MISSING_FACTS` (§18.2, §19.8).
- **חלק 03:** `detectFactSlots` ו-`MissingFactsPanel`, כולל הפטור "כמות בהוראה" (§6.12); `ToneAndAddressFields` (§6.3) ושלב "איך מדברים" באונבורדינג (§4.3), שמשפטי הדוגמה שלו נלקחים מ-§3.2 ו-§4.4 כאן; תיבת ההסכמה בהעלאה (§6.6); אזהרת שתי השורות בעורך (§6.9, §9.3); `ComplianceChecklist` ו-`brief.attestations` (§6.5); `PromptTester` טוען את חמש הדוגמאות (§22); `/app/settings/pronunciation`.
- **חלק 02:** `NicheShowcase` ("אותו סרטון, 3 פורמטים", §3.5), `ShowcaseGallery` (§3.10), עמוד הדוגמאות ובאנר החנוכה מציגים את חמש הדוגמאות; קיר הסרטונים בנוי בנפרד מ-`content/demo-wall.json` (§3.3.6); `toNicheSampleScript` ל-`niches.sample_scripts` (§4.3); ₪ לפי §6.1 כאן.
- **חלק 01:** כלל ה-₪ (§2.1 סעיף 20) ו-`formatIls`, `Price`, `Num` (§2.5); `pnpm lint:copy` מייבא את `BANNED_PHRASES` (§2.6); `CAPTION_PRESETS` ו-`paging` (§16); התווית "הדגמה"; `public/media/demo/logo-demo.svg`.
- **חלק 06:** סקירת העברית ובדיקת השמיעה של M7 (§24, §25) עם `docs/eval/hebrew-review-m7.md` ו-`docs/eval/listening-list.md`; חשבוניות Morning (§9) הן חריג 4 של כלל ה-₪.
- **הזרע (`/seed`):** חמשת ההוקים של הדוגמאות (`text_he`, `hook_type_slug`, `visual_direction_he` זהים לזרע), העונה `hanukkah` (4–12.12.2026), ה-slugs ודגלי הציות של 36 הנישות.

**הרחבת 2026-10-17 (§18–§19, והתוספות ל-§1, §6.1, §8, §10–§12, §14 ו-§17):**

- **חלק 07:** `ads.copy.v1`, `post.caption.v2`, `landing.copy.v1`, `ads.insight_explain.v1`, `ads.health_check.v1` ו-`plan.month.v1` נכתבים לפי §18–§19 ומייבאים מ-`style-data.ts` את `LENGTH_LIMITS`, `PERSONAL_ATTRIBUTE_PATTERNS` ו-`RESULTS_BANNED_PHRASES`; `AdCopyV1`, `LeadFormSpecV1`, `CreateSocialPostBody` ו-`LandingPageContentV1` בונים את מגבלות ה-Zod מהמפתחות של §12 (`ad_*`, `lead_form_*` כולל `lead_form_intro`, `ig_*`, `landing_*`) — רשום בחלק 07. טקסט ההסכמה לדיוור בטופס הלידים בנוסח "מאשרים לקבל עדכונים ומבצעים מאת {businessName}" (§18.5; בלי אות שימוש צמודה למשתנה) — רשום בחלק 07. `lib/social/caption.ts` מקצץ ל-5 האשטגים לפי הסדר, מחליף רווח בקו תחתון ומסיר גרש, גרשיים, מקף וניקוד (§10), והסימון U+200F לשורה שמתחילה בספרה, ב-₪, באימוג׳י או באותיות לטיניות חל גם על הטקסט של מודעה בזמן השליחה למטא (§18.1) — רשום בחלק 07. טבלה 11.4 זהה למיפוי המטרות ול-`NICHE_AD_PRESETS`; ארבעת שמות המדדים, הרשימה הסגורה של הפעולות ו-`lib/meta/explain-fallback.ts` (§19.1, §19.4); הנוסח הקבוע לציון של בדיקת דופק באותו מבנה של השורה של ציון ההוק (§19.5); `REVIEW_FEEDBACK_HE` ותבניות המייל `weekly_results`, `lead_new`, `spend_cap_warning`, `meta_ad_rejected`, `health_check_ready`, `monthly_plan_ready` לפי §19.8; דף העסק בתשלום, עם התצוגה המקדימה והשורה "דף העסק זמין בתוכניות בתשלום" (§18.7).
- **חלק 08:** `SceneOverlayV1` בונה את המגבלות מ-`sign_text`, `popup_title`, `popup_body` ו-`meme_caption` (§12) — רשום בחלק 08; התבנית `fake-system-popup` היא פרסום רגיל בלבד (§18.3); כרטיסי הטרנדים מציגים את השורה הקבועה של ציון ההוק (§19.5).
- **חלק 05:** כללי ה-lint החדשים `HE026` (פנייה שמניחה מאפיין אישי בקופי של קמפיין, §18.4) ו-`HE027` (שפת תוצאות אסורה, §19.6) נרשמים בטבלה של §23.3 ונספרים במספר הכללים שם — רשום בחלק 05 §23.3; `HookScoreV1` בונה את המגבלה מ-`hook_score_tip`, ו-`hooks.score.v1` כותב הצעות לפי §19.5; `post.caption.v2` מחזיר 3–5 האשטגים ל-`reels` ול-`facebook` (§10).
- **חלק 03:** `HookScoreBadge` והפאנל של ציון ההוק מציגים "ציון הוק: {score} מתוך 100" ואת השורה הקבועה "הערכה לפי כללי הוקים — לא הבטחה לתוצאות." (§19.5).
- **חלק 01:** `lint:copy` מייבא את `ADS_JARGON` ואת `RESULTS_BANNED_PHRASES` מ-`style-data.ts`, עם רשימת היתר להגדרות המתקדמות — רשום בחלק 01 §2.6; `KpiTile` מציג שינוי עם מילה, ולא רק בצבע או בחץ (§19.1).
- **חלק 06:** סקירת העברית של M11 עוברת על §18–§19 ועל רשימת הבדיקה המורחבת של §17.
