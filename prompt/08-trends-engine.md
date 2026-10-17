# חלק 08 — מנוע הטרנדים הוויראליים וצילום מודרך

החלק הזה הופך פורמט שעובד ברשתות לסרטון בעברית לעסק, בלחיצה אחת או בצילום קצר לפי רשימה. הוא מגדיר איך הצוות קולט סרטון השראה עם בסיס זכויות מתועד, איך `trendAnalyze` מפרק אותו למבנה מופשט, ואיך עורכים מזה תבנית טרנד (`TrendTemplateV1`) שמעתיקה פורמט ולא ביטוי.
הוא כולל את המיגרציה `0014_trends.sql` במלואה, את נתיבי `/api/trends`, `/api/guided` ו-`/api/admin/trends` עם חוזי Zod, את 11 שכבות הטרנד ב-Remotion, את ערכת הצילום המודרך ואת `guidedAutocut`, את הפיד, את מנוע "פירוק טרנד" השבועי ואת התוכן של הדפים הציבוריים.
בנוסף הוא כולל את הטקסט המלא של שמונה פרומפטים, את המיקרו-קופי של `app.trends.*`, `app.guided.*` ו-`admin.trends.*`, את המייל `trends_weekly` ואת 12 תבניות ה-seed (`seed/trend_templates.json`, נבנה ב-`seed/scripts/build_trends.py`).
כל השמות כאן הם חוזה (חלק 00 §4). רשימות האב נשארות בחלקים שלהן: נתיבים, קודי שגיאה ומיגרציות בחלק 04, פרומפטים, מודלים והצנרת בחלק 05, דגלים, מיילים ואנליטיקה בחלק 06, נתיבי `/app` בחלק 03 ונתיבי האתר בחלק 02.

---

## §1. מטרה, היקף ומבנה הקבצים

### 1.1 מה החלק הזה בונה, ואיפה כל דבר

ב-M8 (חלק 06 §24) בעל עסק פותח "טרנדים השבוע", רואה סרטון הדגמה שלנו של פורמט שעובד עכשיו, ולוחץ **"צרו בקליק"** (הכול ב-AI) או **"צלמו בעצמכם"** (רשימת צילומים קצרה, ואנחנו עורכים). הפרויקט שנוצר עובר את אותם 9 שלבים של האשף ואת אותה `videoPipeline` של חלק 05. אין שלב חדש באשף ואין קומפוזיציה חדשה ב-Remotion.

הפניות מחלקים אחרים בצורה "חלק 08 §J.x" או "חלק 08 §D" מובילות לסעיף שבכותרת שלו מופיע אותו סימון של המפרט:

| מפרט | סעיף כאן | מה יש בו |
|---|---|---|
| §J.1 | §2 | קליטת סרטוני השראה, בסיסי זכויות, איסור סקרייפינג, שמירה |
| §J.2 | §3 | `trendAnalyze`: פקודות ffmpeg, תמלול, ניתוח, נפילות, שער סיכונים, עלות |
| §J.3 | §4 | `TrendAnalysisV1` (Zod ו-JSON Schema) |
| §J.4 | §5 | `TrendTemplateV1`, הטיוטה השטוחה, כללי TT01–TT27, שומר הדמיון |
| §D.2 | §6 | `0014_trends.sql` במלואו, כולל הבלוק של חלק 04 |
| §E.2, §E.4 | §7 | נתיבים T1–T3, G1–G4, A1–A11, ה-cron `trends-lifecycle`, צעד 9 של `cleanup` |
| §J.5 | §8 | `SceneOverlayV1` ו-11 רכיבי השכבות |
| §J.6 | §9 | הזרימה "צרו את הטרנד לעסק שלי" |
| §J.7 | §10 | ערכת הצילום המודרך ו-`guidedAutocut` |
| §J.8, §S.4 | §11 | הפיד, ציון ההוק בכרטיס, המנוע השבועי והדפים הציבוריים |
| §J.9 | §12, §18 | 12 תבניות ה-seed והסקריפט שבונה אותן |
| §M (פרומפטים) | §13 | הטקסט המלא של `trends.*`, `guided.*` ותוספות v2 |
| §L (מסכים) | §14 | `/app/trends`, ערכת הצילום ו-Trend Studio, עם המיקרו-קופי |
| §M (מיילים) | §15 | `trends_weekly` |
| §J.10, §N.8 | §16 | גבולות משפטיים, הסרה, `lint:deps` |

### 1.2 עקרונות מחייבים

1. **מעתיקים פורמט, לא ביטוי.** תבנית מתארת מבנה, קצב, סוג פיתיון ושכבות. היא לא מעתיקה טקסט, צילום, דמות, קול, מוזיקה או מותג מסרטון הייחוס (§16).
2. **אין סקרייפינג.** סרטון נכנס רק בשלוש הדרכים של §2.1, ו-`lint:deps` מכשיל את ה-CI על כלי הורדה (§2.4).
3. **כל העברית מצוירת אצלנו.** שלט, הודעה, כיתוב ותווית הם שכבות של Remotion מעל התמונה. מודל תמונה או וידאו לא מתבקש לכתוב טקסט בפריים (חלק 05, `B09`).
4. **מוזיקה מותרת לפרסום בלבד:** מוזיקה מקורית מ-`music.default` או רצועה מהספרייה לפי מצב רוח. לא שם של שיר ולא "השיר מהטרנד".
5. **סרטון ההדגמה הוא שלנו.** סרטון הייחוס לא מוצג ללקוח, לא מתפרסם ולא משמש כהדגמה.
6. **אמת בפרסום:** מחיר, דחיפות, "לפני ואחרי" ותגובות של לקוחות רק כשהם אמיתיים (נספח E). התראה מזויפת רק לפרסום רגיל.
7. **אנשים אמיתיים רק בצילום ובהסכמה.** פורמט שבנוי על אנשים (מאחורי הקלעים, יום בחיים) הוא צילום מודרך עם הצהרת `people_on_camera_consent`. אין אנשי AI שמדברים למצלמה, אין קטינים ואין המלצות מומצאות.

### 1.3 דגלים, אבן דרך ומיגרציה

- **דגלים** (כולם כבויים ב-seed, חלק 06 §21.1): `trends` (הפיד, עמוד הטרנד, יצירה מטרנד, T1–T3), `trends_public` (הדפים הציבוריים, חלק 02 §15), `guided_filming` (G1–G4 וערכת הצילום), `hook_score` (הציון בכרטיס, §11.4). Trend Studio פתוח למנהלי פלטפורמה גם כשהדגלים כבויים, כדי להכין תוכן לפני ההשקה.
- **אבן דרך:** M8 (חלק 06 §24). קריטריוני הקבלה של M8 חוזרים כאן בסעיפים 3, 8, 10, 11 ו-16.
- **מיגרציה:** `0014_trends.sql` רץ אחרי `0013_meta_integration.sql`, כי הוא מוסיף FK לעמודות `trend_template_id` שנוצרות שם. לכן, לפי ההחלטה של חלק 04 §2.3, **שני הקבצים נכנסים יחד במיזוג הראשון של M8**. הטבלאות של Meta, של דף העסק ושל תוכנית 30 יום נוצרות אז ונשארות בלי שימוש עד M9–M10, כי הנתיבים שלהן מחזירים 404 כל עוד הדגלים כבויים. כל שינוי סכמה שמתגלה אחר כך נכנס ל-`0015_…`.

### 1.4 מבנה הקבצים

```text
supabase/migrations/0014_trends.sql            §6 (full SQL + the part 04 hook_score block at the end)
supabase/tests/12_trends_rls.sql               §6.9 (pgTAP)
lib/trends/preprocess.ts                       §3.2 ffmpeg steps, phash, probe
lib/trends/preprocess-sandbox.ts               §3.3 same commands in Vercel Sandbox (M0 fallback)
lib/trends/analyze.ts                          §3.4 trends.analyze.v1 on llm.video → llm.vision_frames
lib/trends/risk.ts                             §3.5 risk gate, topic blocklist
lib/trends/adapt.ts                            §5.5 trends.adapt.v1 + draftToTemplate()
lib/trends/similarity.ts                       §5.7 similarity guard
lib/trends/validate.ts                         §5.6 TT01–TT27 (same list as seed/scripts/build_trends.py)
lib/trends/overlays.ts                         §8.3 resolveOverlayTemplate(), OVERLAY_TEXT_SLOTS
lib/trends/feed.ts                             §11.1 TrendCardDTO mapping, lifecycleBadge(), templateAdEligibility()
lib/trends/demos.ts                            §11.6 demo renders in ws-trends-studio, copy to public-media
lib/trends/seed-schema.ts                      §5.8 TrendTemplateSeed, TREND_TEMPLATE_KEY_ORDER (part 04 §16.2)
lib/trends/recipe-input.ts                     §9.4 the <trend_recipe> block of script/storyboard v2
lib/guided/shotlist.ts · lib/guided/autocut.ts §10
lib/ai/schemas/trends.ts · lib/ai/schemas/guided.ts      §4, §5, §8.1, §13 (Zod; JSON snapshots in lib/ai/schemas/json/)
lib/ai/prompts/{trends.analyze.v1,trends.adapt.v1,trends.explainer.v1,trends.sign_quad.v1,
                guided.shotlist.v1,guided.autocut.v1,script.generate.v2,storyboard.generate.v2}.ts   §13 (ownerPart "08")
lib/api/contracts/trends.ts · lib/api/contracts/guided.ts                                     §7
lib/workflows/trendAnalyze.ts · lib/workflows/guidedAutocut.ts                                §3, §10.5
lib/cron/trends-lifecycle.ts                   §7.6
remotion/layers/trends/zones.ts · layout.ts    §8.4 (zones from part 01 §16.3; overlayBox())
remotion/layers/trends/{SignOverlay,FakeUiPopup,MemeCaption,BtsLabel,SplitReveal,CommentBubble,
                        RatingStamp,PovLabel,ClockStamp,StickerPop,PriceTag}.tsx           §8.5
app/(app)/app/trends/page.tsx · app/(app)/app/trends/[slug]/page.tsx                          §14.1–§14.2
app/(app)/app/projects/[projectId]/shoot/page.tsx                                             §14.3
app/(admin)/admin/trends/**                                                                   §14.4
components/trends/* · components/guided/*      cards, feed, shoot screens (part 01 components inside)
scripts/lint-deps.ts · scripts/trends-demos.ts §2.4, §11.6
seed/scripts/build_trends.py → seed/trend_templates.json                                      §12, §18
tests/fixtures/trends/*                        §17
```

### קריטריוני קבלה
- [ ] כל קובץ ברשימה קיים, ולכל קובץ ב-`lib/trends/` ו-`lib/guided/` יש קובץ בדיקה.
- [ ] כשכל דגלי הטרנדים כבויים: `/app/trends`, `/app/trends/[slug]`, `/app/projects/[id]/shoot`, `/trends` ו-`/trends/[slug]` מחזירים 404, ופריט "טרנדים" לא מופיע בניווט (חלק 03 §2).
- [ ] `pnpm db:reset` מריץ `0001`–`0014` לפי הסדר, והרצה של `0014` על מסד בלי `0013` נכשלת על ה-FK המאוחרים.
- [ ] אף רכיב בחלק הזה לא מוסיף שלב לאשף, `step_key` לצנרת או קומפוזיציה ל-Remotion.

---

## §2. קליטת סרטוני השראה (מפרט §J.1)

### 2.1 שלוש דרכים בלבד

| דרך | `rights_basis` | מה נשמר | איך מנתחים |
|---|---|---|---|
| העלאה של קובץ על ידי מנהל פלטפורמה | `own_content` · `licensed` · `partner_permission` · `customer_owned` | הקובץ ב-`trend-refs`, `hook.mp4`, 12–16 פריימים | §3 המלא |
| קישור YouTube ציבורי | `public_youtube_url` | הקישור בלבד, בלי הורדה | Gemini מקבל את הקישור ישירות דרך ספק AI Studio (`youtubePart()`, חלק 05 §4.7) [M0-verify נעיצת הספק]; בלי ffmpeg, בלי פריימים ובלי תמלול שלנו |
| קישור והערות | `link_only_notes` | הקישור והערות מובנות של המנהל (`admin_notes_he`) | המודל עובד מטקסט בלבד: ההערות, ושורת הפתיחה שהמנהל העתיק בעצמו |

- **הקלטת מסך של פוסט של מישהו אחר אינה בסיס זכויות** עד אישור [Counsel] (מחקר 13 §3.5). אין לה ערך ב-enum, וטופס הקליטה לא מציע אותה.
- **ההצהרה** בטופס A1 היא תיבת סימון חובה, בנוסח הזה בדיוק: **"יש לנו זכות להשתמש בסרטון הזה לניתוח פנימי: בעלות, רישיון או אישור בכתב"**. הנתיב דוחה בקשה בלי `attest: true` (`INVALID_INPUT {reason:"rights_required"}`), ושומר `rights_attested_at` ו-`rights_attested_by` של המנהל.
- **`rights_note`** (5–500 תווים) מתעד את הבסיס: ממי הרישיון, איפה האישור בכתב, או מי הלקוח שהקובץ שלו. ב-`public_youtube_url` ההערה מציינת שהסרטון ציבורי ונותח בלי הורדה.
- **כלי דפדפן בלבד:** TikTok Creative Center, Meta Ad Library, Edits ו-Google Trends משמשים את הצוות לחיפוש רעיונות בדפדפן. אין מהם קליטה אוטומטית ואין להם API אצלנו.

### 2.2 הקובץ: בדיקות, כפילויות ושמירה

1. **A1** יוצר שורת `trend_references` ומחזיר העלאה חתומה ל-`trend-refs/{reference_id}/source.{ext}` (ל-10 דקות, `createSignedUploadUrl` של הלקוח הסודי). אין policy ל-`authenticated` על ה-bucket, ולכן העלאה ישירה בלי הכתובת החתומה נכשלת.
2. **A2** (`complete`) בודק: גודל עד `trend_analysis_limits.max_ref_mb` (200MB), MIME מתוך `video/mp4`, `video/quicktime`, `video/webm` (לפי חתימת הקובץ, לא לפי הסיומת), ומשך עד `max_ref_sec` (180 שניות) לפי `ffprobe` (`too_long`). נשמרים `bytes`, `duration_ms`, `width`, `height`, `mime`.
3. **phash:** average hash של שלושה פריימים, בשניות 0, 1 ו-2 (כל אחד 8×8 בגווני אפור, 64 ביט), מחוברים ל-48 תווים הקסדצימליים. סרטון שה-hash שלו במרחק של 10 ביטים לכל היותר (מתוך 192) מ-hash קיים ← `INVALID_INPUT {reason:"duplicate", referenceId}` עם הפניה לסרטון הקיים, והקובץ נמחק.
4. **שמירה:** `retention_until = now() + trend_ref_retention_days` (30) לכל בסיס **חוץ מ**-`own_content`, `licensed`, `partner_permission` ו-`customer_owned`, שבהם הקובץ נשמר עד שמנהל מוחק אותו (A11). היום רק ארבעת הבסיסים האלה מעלים קובץ, ולכן הכלל הזה הוא רשת ביטחון לבסיס עתידי (למשל הקלטת מסך, אם תאושר). צעד 9 של `/api/cron/cleanup` מוחק את הקבצים שעברו את המועד (§7.7).
5. **A11** מוחק את `source.*`, `hook.mp4` ואת `frames/*`, ממלא `file_deleted_at` ומשאיר את הניתוח המופשט. audit: `trend.reference_file_delete`.
6. **לעולם לא ללקוח:** כתובת של `trend-refs` לא מופיעה בשום DTO, דף או מייל. מסכי האדמין מקבלים כתובות חתומות ל-10 דקות מ-A4 בלבד.

### 2.3 נושאים שלא נקלטים בכלל

`lib/trends/risk.ts` מחזיק את `TOPIC_BLOCKLIST`: מלחמה, חטופים, צה״ל, ימי זיכרון, טרור, פוליטיקה ובחירות, אסונות, ועוד מילים באנגלית ובעברית. הרשימה נבדקת על `rights_note`, `admin_notes_he` ו-`source_url` כבר ב-A1 (אזהרה למנהל), ועל הניתוח בשער של §3.5 (דחייה).

### 2.4 `lint:deps` — רשימת החבילות האסורות

`scripts/lint-deps.ts` (חלק מ-`pnpm lint`, חלק 06 §15.12) קורא את `package.json` ואת `pnpm-lock.yaml`, ומכשיל את ה-CI כשאחת מהחבילות האלה מופיעה, גם כתלות עקיפה:

```ts
// scripts/lint-deps.ts
export const BANNED_PACKAGES = [
  "yt-dlp", "yt-dlp-exec", "yt-dlp-wrap", "youtube-dl", "youtube-dl-exec", "youtube-dl-wrap",
  "ytdl-core", "@distube/ytdl-core", "@ybd-project/ytdl-core", "play-dl", "youtubei.js",
  "apify", "apify-client", "crawlee",
  "tiktok-scraper", "tiktok-scraper-ts", "@tobyg74/tiktok-api-dl", "instagram-scraper", "instagram-private-api",
  "puppeteer-extra-plugin-stealth", "playwright-extra",
] as const;
export const BANNED_SCOPES = ["@apify/"] as const;            // every package under these scopes
export const BANNED_BINARIES = /\b(yt-dlp|youtube-dl)\b/;      // also checked in scripts/**, Dockerfile*, vercel.json
```

החבילה `ffmpeg-static` מותרת: היא מעבדת קובץ שכבר יש לנו, ולא מורידה דבר.

### קריטריוני קבלה
- [ ] A1 בלי `attest: true` ← 400 `rights_required`; A1 עם `rightsBasis: "licensed"`, קישור ל-TikTok ובלי `file` ← 400 `scraping_not_allowed`.
- [ ] קובץ של 181 שניות ← 400 `too_long` עם `admin.trends.errors.too_long`; אותו קובץ פעמיים ← `duplicate` עם מזהה הסרטון הראשון.
- [ ] בסיס `licensed` ← `retention_until` ריק; שורה עם `retention_until` שעבר ← אחרי `cleanup` אין קבצים בתיקייה שלה, `file_deleted_at` מלא, ו-A4 מחזיר את הניתוח עם `frameUrls: []`.
- [ ] הוספת `yt-dlp-exec` ל-`package.json` מכשילה את `pnpm lint` עם שם החבילה (קריטריון של M8).
- [ ] אין במסכי האדמין שדה "הורדה מקישור" לרשתות חברתיות.

---

## §3. צנרת הניתוח `trendAnalyze` (מפרט §J.2)

### 3.1 התהליך

`trendAnalyze({ analysisId })` רשום ב-`FLOWS` של חלק 05 §19.1 עם `owner: "08"`. A3 יוצר שורת `trend_analyses` (`status = 'queued'`, `version` = המספר הבא לאותו סרטון) ומתחיל את התהליך עם `idempotencyKey: "trend:{analysisId}"`. הצעד הראשון קובע `status = 'running'`, המצב נשמר בשורה, ובין הצעדים עוברים רק מזהים.

| צעד | `maxRetries` | מה עושה | נכשל ← |
|---|---|---|---|
| `preprocess` | 1 | §3.2. רק כשיש קובץ | `failed`, `error_code = "preprocess_failed"` |
| `transcribe` | 2 | `stt.default` (Scribe v2, `verbose_json`, `language: "auto"`) על האודיו של כל הסרטון, עד 180 שניות. רק כשיש קובץ | ממשיכים בלי תמלול, `hook_package.transcript_excerpt = null` |
| `analyze` | 1 | §3.4 | `failed`, `error_code` לפי הטקסונומיה של חלק 05 §2.3 |
| `gate` | 0 | §3.5 | `rejected` עם `reject_reason` |
| `finish` | 0 | `status = 'succeeded'`, `cost_usd` סופי, audit `trend.analysis_run` | — |

- **שעון:** כל צעד עד 300 שניות (`maxDuration` של צעד WDK). התהליך כולו נמדד מול היעד של M8: פחות מ-2 דקות ופחות מ-$0.10 לסרטון ייחוס עם קובץ.
- **תקיעה:** לתהליכים אין sweeper (חלק 05 §19.1, כלל 6). A4 בודק בקריאה: שורה ב-`running` או ב-`queued` יותר מ-15 דקות מסומנת `failed` עם `error_code = "stalled"`, ובמסך מופיע "ניתוח מחדש".
- **ffmpeg** רץ בתוך הצעד עם `ffmpeg-static`, כמו `lib/audio/concat.ts`, והקבצים ב-`/tmp/trend-{analysisId}/` נמחקים ב-`finally`. אם ספייק של M0 מראה שצעד לא מחזיק קובץ של 200MB ו-180 שניות, אותן פקודות רצות ב-Vercel Sandbox דרך `lib/trends/preprocess-sandbox.ts` (אותה חתימה, חלק 05 §19.2) [M0-verify].

### 3.2 `preprocess` — הפקודות

```bash
# 0. probe (A2 already stored it; repeated here because the step must not trust the row)
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate -of json in.src

# 1. normalise: H.264 MP4, ≤ 720p on the long side, 30 fps, AAC; also the source of every later command
ffmpeg -y -i in.src -vf "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))',fps=30" \
  -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -c:a aac -b:a 96k -ac 1 -movflags +faststart norm.mp4

# 2. hook clip 0–6 s (the video part of the analysis request)
ffmpeg -y -ss 0 -t 6 -i norm.mp4 -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart hook.mp4

# 3. scene cuts inside 0–6 s
ffmpeg -t 6 -i norm.mp4 -vf "select='gt(scene,0.30)',showinfo" -an -f null - 2> cuts.log    # parse pts_time → cuts_ms[]

# 4. frames every 250 ms in 0–3 s (13 frames) + one frame 120 ms after each cut in 3–6 s, cap 16 in total
ffmpeg -y -t 3 -i norm.mp4 -vf "fps=4,scale=-2:540" -q:v 4 frames/%03d.jpg
ffmpeg -y -ss {cut_s + 0.12} -i norm.mp4 -frames:v 1 -vf "scale=-2:540" -q:v 4 frames/cut_{t_ms}.jpg

# 5. loudness and silence cues (whole file)
ffmpeg -i norm.mp4 -af "ebur128=peak=true" -f null - 2> loud.log       # momentary loudness → loudness_peaks_ms[] (top 5, ≥ 300 ms apart)
ffmpeg -i norm.mp4 -af "silencedetect=noise=-35dB:d=0.4" -f null - 2> silence.log

# 6. optional structure clip: ≤ 90 s, 480p, 15 fps, only if hook.mp4 + structure.mp4 + frames stay ≤ base64_max_mb (8)
ffmpeg -y -t 90 -i norm.mp4 -vf "scale=-2:480,fps=15" -c:v libx264 -preset veryfast -crf 32 -an -movflags +faststart structure.mp4

# 7. audio for Scribe
ffmpeg -y -i norm.mp4 -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 48k audio.mp3

# 8. phash input (A2): three 8×8 grey frames at 0, 1, 2 s
ffmpeg -y -i norm.mp4 -vf "select='eq(n\,0)+eq(n\,30)+eq(n\,60)',scale=8:8,format=gray" -vsync 0 -f rawvideo phash.raw
```

- **מה נשמר ב-`trend-refs`:** `{reference_id}/hook.mp4` ו-`{reference_id}/frames/{t_ms}.jpg` (12–16 קבצים). `norm.mp4`, `structure.mp4` ו-`audio.mp3` נשארים ב-`/tmp` בלבד.
- **`hook_package`:** `{ cuts_ms: number[], frames: { t_ms, path }[], transcript_excerpt: string | null, loudness_peaks_ms: number[], silences_ms: [number, number][], structure_used: boolean, used_fallback: boolean, source: "file" | "youtube" | "notes" }`. `transcript_excerpt` = המילים של 0–10 השניות הראשונות, עד 400 תווים.
- **פחות מ-12 פריימים** (סרטון קצר מ-3 שניות): לוקחים פריים כל 150 מילישניות עד שיש 12.
- **תקרת גודל:** לפני הבקשה `analyze` מחשב את הגודל ב-base64 של `hook.mp4` ושל כל הפריימים. מעל 8MB: קודם מוותרים על `structure.mp4`, אחר כך מקודדים את `hook.mp4` שוב ב-`-crf 32` וב-540p, ורק אז נופלים לפריימים בלבד (§3.4).

### 3.3 `preprocess-sandbox.ts`

אותה פונקציה, `preprocessReference(referenceId): Promise<HookPackageDraft>`, שמריצה את פקודות 0–8 בתוך Vercel Sandbox עם `ffmpeg-static`, ומעלה את התוצרים ל-`trend-refs` מתוך ה-Sandbox בכתובות חתומות. הבחירה בין השניים היא החלטה של M0, שנרשמת ב-`DECISIONS.md` ונקבעת בקוד בקבוע `TREND_PREPROCESS_RUNTIME = "step" | "sandbox"` ב-`lib/trends/preprocess.ts`. זה לא משתנה סביבה ולא הגדרה באדמין.

### 3.4 `analyze` — הבקשה למודל והנפילות

1. **עם קובץ:** `runStructured("trends.analyze.v1", …)` על `route("llm.video", { needsVideoInput: true })`, `transport: "fetch"`. התוכן: חלק `text` (ההוראות, עובדות ה-ffmpeg — חיתוכים, שיאי עוצמה ושקטים — והתמלול), חלק `video_url` אחד עם `hook.mp4` (ועוד אחד עם `structure.mp4` אם נכנס), ו-12–16 זוגות של `t={ms}ms` ו-`image_url` (`timedFrameParts`). אף פעם לא כתובת מרוחקת ולא Batch API.
2. **נפילה לפריימים:** כש-`route` לא מוצא מודל עם `video_in`, כשהקריאה נכשלת ב-`bad_request`, או כש-`MediaTooLargeError` חוזר גם אחרי ההקטנה — אותה תבנית רצה על `llm.vision_frames` בלי חלקי הווידאו, עם אותם פריימים, תמלול ועובדות, ו-`hook_package.used_fallback = true` (חלק 05 §4.7).
3. **YouTube ציבורי:** חלק `video_url` עם הקישור (`youtubePart`), נעיצת ספק AI Studio, בלי פריימים ובלי עובדות; `hook_package = { source: "youtube", used_fallback: false, … }` עם מערכים ריקים. כשהספק לא זמין ← `failed` עם `error_code = "youtube_provider_unavailable"`, והמנהל יכול להוסיף הערות ולנתח שוב כ-`link_only_notes`.
4. **הערות בלבד:** אותה תבנית על `llm.vision_frames` עם חלק `text` בלבד (`<admin_notes>`), `source: "notes"`. ב-`TrendAnalysisV1` שדות התזמון הם הערכה, ולכן `trends.adapt.v1` מקבל את הדגל `timing_estimated = true`.
5. **ולידציה סמנטית** (`validate` של התבנית, תיקון אחד): `t1_ms > t0_ms`; שוטים ממוינים ולא חופפים; `hook_window_ms` בין 1,000 ל-6,000; `pacing.cuts_in_first_3s` שווה למספר החיתוכים ב-`cuts_ms` שקטנים מ-3,000 (כשיש קובץ); `hook_type` מתוך 27 הערכים של `hook_types`; `niche_fit[].niche_slug` מתוך הנישות הפעילות; כל שדה `_en` בלי אותיות עבריות.
6. **עלות:** `cost_usd` מצטבר אחרי כל קריאה (חלק 05 §7.6), כולל התמלול. `ai_generations` עם `workspace_id = null`, `task = llm_trend_analysis`, בלי קרדיטים של לקוח (`trends.analyze` = 0).

### 3.5 `gate` — שער הסיכונים (`lib/trends/risk.ts`)

| ממצא | פעולה |
|---|---|
| `risk_flags` כולל `political_or_war`, `minor`, `dangerous_stunt` או `real_injury`, או ש-`TOPIC_BLOCKLIST` נמצא ב-`format_name_en`, ב-`mechanics_en`, ב-`on_screen_text[].text_en` או ב-`spoken.first_line_en` | `status = 'rejected'`, `reject_reason` = הדגל הראשון (`"political_or_war"` וכו׳); אין טיוטת תבנית (A5 ← 409 `EDIT_CONFLICT` עם `reason: "analysis_rejected"`) |
| `testimonial_format` | ממשיכים, ו-A5 קובע `requires_people_consent = true`, `production_mode = 'guided'`, `ad_safety = 'needs_consent'`: אין אנשי AI בפורמט הזה |
| `creator_face` או `creator_voice` | ממשיכים; "the reference creator's face, look and voice" נכנס ל-`do_not_copy` |
| `copyrighted_music` או `audio.is_trending_sound_likely` | ממשיכים; רק `music_brief` (מצב רוח, BPM, נקודת דרופ), ובמסך "בטרנד המקורי יש שיר מוגן. אצלנו נוצרת מוזיקה מקורית שמותרת לפרסום." |
| `third_party_logo` | ממשיכים; "every logo and brand name visible in the reference" ב-`do_not_copy` |
| `deceptive_ui` | ממשיכים; `ad_safety = 'organic_only'` ו-`recommended_ad_goal = null` |
| `medical_claim` | ממשיכים; ב-`compliance_notes_he` נוספת השורה "בלי הבטחה לתוצאה רפואית, ובנישות רפואה ההסתייגות נוספת אוטומטית." |

### 3.6 תקציב (`assertTrendBudget`)

לפני A3 ולפני כל קריאה בתהליך: עלות מוערכת (לפי `model_registry` והגודל) מעל `trend_analysis_limits.max_usd` (0.50), או הוצאה חודשית של `llm_trend_analysis` ו-`llm_trend_template` שתעבור את `monthly_usd` (50) ← `BUDGET_GUARD {scope: "trend_analysis_limits"}` (409). המסך מציג לפני הלחיצה **"הפעולה תעלה כ-${cost} ב-OpenRouter"** ואת ההוצאה החודשית (חלק 03 §22.21). ההוצאה נספרת גם במגן היומי של חלק 05 §7.3.

### קריטריוני קבלה
- [ ] סרטון ייחוס עם רישיון מנותח בפחות מ-2 דקות ובפחות מ-$0.10, עם 12 פריימים מתוזמנים לפחות ורשימת חיתוכים (קריטריון של M8, מול ה-mock ומול הספק ב-contract-live).
- [ ] בדיקת MSW: הבקשה מכילה חלק `video_url` אחד שמתחיל ב-`data:video/mp4;base64,`, ו-12–16 חלקי `image_url` שלפני כל אחד מהם `t={ms}ms`; כשה-MSW מחזיר `bad_request` על חלק הווידאו, הבקשה השנייה הולכת ל-`llm.vision_frames` בלי וידאו ו-`used_fallback = true`.
- [ ] ניתוח עם `risk_flags: ["minor"]` ← `rejected`, `reject_reason = "minor"`, ו-A5 מחזיר 409.
- [ ] `max_usd = 0.01` ב-`app_settings` ← A3 מחזיר 409 `BUDGET_GUARD` עם `scope: "trend_analysis_limits"`, ושום קריאה לא יוצאת.
- [ ] שורה ב-`running` מלפני 16 דקות ← A4 מחזיר אותה כ-`failed` עם `error_code = "stalled"`.
- [ ] `/tmp/trend-{analysisId}/` לא קיים אחרי הצעד, גם כשהוא נכשל.

---

## §4. הסכמה `TrendAnalysisV1` (מפרט §J.3)

הניתוח המופשט של סרטון ייחוס. הוא נשמר ב-`trend_analyses.analysis`, מוצג ב-Trend Studio, והוא הקלט היחיד של `trends.adapt.v1`. כל שדה טקסט בו הוא באנגלית (`_en`), חוץ מ-`text_original`, `first_line_original` ו-`format_name_he`, שהם השוואה בלבד ולא מגיעים לתבנית.

```ts
// lib/ai/schemas/trends.ts — analysis (the file also holds the recipe, the template §5 and SceneOverlayV1 §8.1)
import { z } from "zod";
import { HookTypeSlug, NicheSlug, IsoDate } from "./common";

const Ms = z.number().int().min(0).max(600_000);
const En = (max: number) => z.string().trim().min(1).max(max).refine((s) => !/[֐-׿]/.test(s), "english_only");

export const TREND_RISK_FLAGS = ["creator_face", "creator_voice", "copyrighted_music", "third_party_logo", "minor",
  "political_or_war", "medical_claim", "testimonial_format", "dangerous_stunt", "real_injury", "deceptive_ui"] as const;
export const TREND_AUTO_REJECT = ["political_or_war", "minor", "dangerous_stunt", "real_injury"] as const;

export const TrendAnalysisV1 = z.object({
  version: z.literal(1),
  hook_window_ms: z.number().int().min(1000).max(6000),
  shots: z.array(z.object({
    t0_ms: Ms, t1_ms: Ms,
    shot_type: z.enum(["selfie", "pov_hands", "wide", "closeup", "screen", "text_card", "split", "greenscreen"]),
    camera: z.enum(["static", "handheld", "push_in", "pull_out", "whip_pan", "orbit", "top_down"]),
    subject_en: En(160),
    transition_out: z.enum(["hard_cut", "jump_cut", "hand_cover", "snap", "whip", "match_cut", "none"]),
  })).min(1).max(40),
  on_screen_text: z.array(z.object({
    t0_ms: Ms, t1_ms: Ms,
    text_original: z.string().max(300),                 // comparison only (similarity guard); never copied
    text_en: En(300), lang: z.string().regex(/^[a-z]{2,3}$/),
    role: z.enum(["hook_line", "label", "caption", "cta", "sign", "ui"]),
    position: z.enum(["top", "center", "bottom"]),
  })).max(30),
  spoken: z.object({
    first_line_original: z.string().max(300).nullable(), first_line_en: En(300).nullable(),
    speaker: z.enum(["on_camera", "voiceover", "none"]), lang: z.string().regex(/^[a-z]{2,3}$|^none$/),
  }),
  audio: z.object({
    music_present: z.boolean(), music_mood: En(40), est_bpm: z.number().int().min(40).max(220).nullable(),
    drop_at_ms: Ms.nullable(), beat_synced_cuts: z.boolean(),
    sfx: z.array(z.object({ t_ms: Ms, kind: En(30) })).max(20), is_trending_sound_likely: z.boolean(),
  }),
  pacing: z.object({ cuts_in_first_3s: z.number().int().min(0).max(30), avg_shot_ms: z.number().int().min(100).max(60_000) }),
  hook_type: HookTypeSlug,
  format_name_en: En(60), format_name_he: z.string().trim().min(2).max(40),
  mechanics_en: z.array(En(200)).min(2).max(6),         // WHY it works, abstracted: no wording, names or brands
  beats: z.array(z.object({
    order: z.number().int().min(1).max(12),
    role: z.enum(["bait", "cut", "payoff", "reveal", "cta", "label"]),
    duration_ms: z.number().int().min(0).max(60_000),
    description_abstract_en: En(240),
  })).min(2).max(12),
  production: z.object({
    needs_person_on_camera: z.boolean(), can_be_full_ai: z.boolean(),
    shots_customer_can_film_en: z.array(En(160)).max(8),
  }),
  niche_fit: z.array(z.object({ niche_slug: NicheSlug, score_0_5: z.number().int().min(0).max(5), angle_he: z.string().trim().min(4).max(120) })).max(8),
  ad_safety_suggestion: z.enum(["ad_safe", "organic_only", "needs_consent", "needs_ai_label"]),
  risk_flags: z.array(z.enum(TREND_RISK_FLAGS)).max(11),
  do_not_copy: z.array(En(240)).max(10),
}).superRefine((a, ctx) => {
  const bad = (path: (string | number)[], message: string) => ctx.addIssue({ code: "custom", path, message });
  a.shots.forEach((s, i) => { if (s.t1_ms <= s.t0_ms) bad(["shots", i, "t1_ms"], "t1_after_t0");
                              if (i > 0 && s.t0_ms < a.shots[i - 1].t1_ms) bad(["shots", i, "t0_ms"], "overlap"); });
  a.on_screen_text.forEach((t, i) => { if (t.t1_ms <= t.t0_ms) bad(["on_screen_text", i, "t1_ms"], "t1_after_t0"); });
  if (a.beats[0].role !== "bait") bad(["beats", 0, "role"], "first_beat_bait");
  a.beats.forEach((b, i) => { if (b.order !== i + 1) bad(["beats", i, "order"], "order_sequence");
                              if ((b.role === "cut" || b.role === "label") !== (b.duration_ms === 0)) bad(["beats", i, "duration_ms"], "cut_label_zero"); });
});
export type TrendAnalysisV1 = z.infer<typeof TrendAnalysisV1>;
```

ה-snapshot שנשלח לספק (`lib/ai/schemas/json/trend_analysis_v1.json`, נגזר מה-Zod ב-`toStrictJsonSchema`; האורכים, הטווחים וה-regex נבדקים רק ב-Zod):

```json
{"type":"object","additionalProperties":false,
 "required":["version","hook_window_ms","shots","on_screen_text","spoken","audio","pacing","hook_type","format_name_en","format_name_he","mechanics_en","beats","production","niche_fit","ad_safety_suggestion","risk_flags","do_not_copy"],
 "properties":{
  "version":{"type":"integer","enum":[1]},
  "hook_window_ms":{"type":"integer","description":"End of the hook, 1000-6000 ms"},
  "shots":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["t0_ms","t1_ms","shot_type","camera","subject_en","transition_out"],
    "properties":{"t0_ms":{"type":"integer"},"t1_ms":{"type":"integer"},
      "shot_type":{"type":"string","enum":["selfie","pov_hands","wide","closeup","screen","text_card","split","greenscreen"]},
      "camera":{"type":"string","enum":["static","handheld","push_in","pull_out","whip_pan","orbit","top_down"]},
      "subject_en":{"type":"string","description":"Generic description, no names, brands or exact wording"},
      "transition_out":{"type":"string","enum":["hard_cut","jump_cut","hand_cover","snap","whip","match_cut","none"]}}}},
  "on_screen_text":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["t0_ms","t1_ms","text_original","text_en","lang","role","position"],
    "properties":{"t0_ms":{"type":"integer"},"t1_ms":{"type":"integer"},"text_original":{"type":"string"},"text_en":{"type":"string"},
      "lang":{"type":"string"},"role":{"type":"string","enum":["hook_line","label","caption","cta","sign","ui"]},
      "position":{"type":"string","enum":["top","center","bottom"]}}}},
  "spoken":{"type":"object","additionalProperties":false,"required":["first_line_original","first_line_en","speaker","lang"],
    "properties":{"first_line_original":{"type":["string","null"]},"first_line_en":{"type":["string","null"]},
      "speaker":{"type":"string","enum":["on_camera","voiceover","none"]},"lang":{"type":"string"}}},
  "audio":{"type":"object","additionalProperties":false,"required":["music_present","music_mood","est_bpm","drop_at_ms","beat_synced_cuts","sfx","is_trending_sound_likely"],
    "properties":{"music_present":{"type":"boolean"},"music_mood":{"type":"string"},"est_bpm":{"type":["integer","null"]},
      "drop_at_ms":{"type":["integer","null"]},"beat_synced_cuts":{"type":"boolean"},
      "sfx":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["t_ms","kind"],"properties":{"t_ms":{"type":"integer"},"kind":{"type":"string"}}}},
      "is_trending_sound_likely":{"type":"boolean"}}},
  "pacing":{"type":"object","additionalProperties":false,"required":["cuts_in_first_3s","avg_shot_ms"],"properties":{"cuts_in_first_3s":{"type":"integer"},"avg_shot_ms":{"type":"integer"}}},
  "hook_type":{"type":"string","description":"One of the 27 hook_types slugs given in <hook_types>"},
  "format_name_en":{"type":"string"},"format_name_he":{"type":"string"},
  "mechanics_en":{"type":"array","items":{"type":"string"}},
  "beats":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["order","role","duration_ms","description_abstract_en"],
    "properties":{"order":{"type":"integer"},"role":{"type":"string","enum":["bait","cut","payoff","reveal","cta","label"]},
      "duration_ms":{"type":"integer"},"description_abstract_en":{"type":"string"}}}},
  "production":{"type":"object","additionalProperties":false,"required":["needs_person_on_camera","can_be_full_ai","shots_customer_can_film_en"],
    "properties":{"needs_person_on_camera":{"type":"boolean"},"can_be_full_ai":{"type":"boolean"},"shots_customer_can_film_en":{"type":"array","items":{"type":"string"}}}},
  "niche_fit":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["niche_slug","score_0_5","angle_he"],
    "properties":{"niche_slug":{"type":"string"},"score_0_5":{"type":"integer"},"angle_he":{"type":"string"}}}},
  "ad_safety_suggestion":{"type":"string","enum":["ad_safe","organic_only","needs_consent","needs_ai_label"]},
  "risk_flags":{"type":"array","items":{"type":"string","enum":["creator_face","creator_voice","copyrighted_music","third_party_logo","minor","political_or_war","medical_claim","testimonial_format","dangerous_stunt","real_injury","deceptive_ui"]}},
  "do_not_copy":{"type":"array","items":{"type":"string"}}}}
```

### קריטריוני קבלה
- [ ] בדיקת החוזה של חלק 05 §11.1 משווה את ה-snapshot ל-Zod, ונכשלת כשמוסיפים שדה לאחד מהם בלבד; ב-snapshot אין `oneOf` ואין `anyOf`.
- [ ] fixture עם `subject_en` בעברית, עם שוטים חופפים או עם ביט ראשון שאינו `bait` נכשל, ותיקון אחד של המודל מתבקש לפני `failed`.
- [ ] ה-fixtures של ארבעת סרטוני המחקר (`tests/fixtures/trends/analysis-t1…t4.json`) עוברים את הסכמה ואת הוולידציה הסמנטית.

---

## §5. מודל התבנית `TrendTemplateV1` (מפרט §J.4)

### 5.1 המתכון: `TrendRecipeV1`

מתכון הוא רשימת ביטים. ביט סצנה (`bait`, `payoff`, `reveal`, `cta`) הופך לסצנה אחת בדיוק (`B14`), `cut` הוא סמן מעבר חד, ו-`label` הוא שכבה קבועה מעל טווח של ביטים. המשמעות של התפקידים היא של `trendBeatPlan()` (חלק 05 §12.2): `bait → hook`, `reveal → solution` (המוצר, השירות או התוצאה נחשפים), `payoff → proof` (הרגע שמחבר את הפיתיון לעסק), `cta → cta`. כל מתכון מתחיל ב-`bait` ומסתיים ב-`cta`; כרטיס הסיום של חלק 05 (`EndCard`, 2.5 שניות) נוסף אחריו כרגיל.

```ts
// lib/ai/schemas/trends.ts — recipe, hook variants, niche adaptations, music brief
export const TREND_ROLES = ["bait", "cut", "payoff", "reveal", "cta", "label"] as const;
export const SlotKey = z.string().regex(/^[a-z][a-z0-9_]{1,30}$/);
const He = (max: number) => z.string().trim().min(1).max(max);

export const RecipeBeat = z.object({
  key: SlotKey,
  role: z.enum(TREND_ROLES),
  duration_ms: z.number().int().min(0).max(8000),          // scene beats 1500–8000 (bait 2000–3500), multiples of 500; cut/label = 0
  purpose_he: He(80),
  visual_source: z.enum(["ai_clip", "ai_image_kenburns", "user_media", "brand_card"]).nullable(),   // null on cut/label
  visual_prompt_en: z.string().max(600),                   // slots {subject_en} {setting_en} {product_en} {bait_en}; never text in frame
  motion_prompt_en: z.string().max(300),
  camera: z.enum(["static", "push_in", "pull_out", "pan_left", "pan_right", "tilt_up", "tilt_down", "handheld", "orbit", "drone"]).nullable(),
  transition_in: z.enum(["cut", "fade", "whip", "zoom", "slide", "wipe", "flash"]).nullable(),
  sfx: z.enum(["whoosh", "impact", "pop", "sizzle", "click", "riser", "cash", "camera_shutter"]).nullable(),
  speed: z.number().min(1).max(2).multipleOf(0.25).nullable(),        // guided/user footage speed ramp (playbackRate target)
  onscreen_slot: z.object({ key: SlotKey, max_chars: z.number().int().min(4).max(70), example_he: He(70) }).nullable(),
  vo_slot: z.object({ key: SlotKey, max_words: z.number().int().min(3).max(40) }).nullable(),
  overlay: z.lazy(() => SceneOverlayTemplate).nullable(),  // §8.2
  guided_shot_key: SlotKey.nullable(),
  spans: z.array(SlotKey).min(1).max(8).nullable(),        // label beats only: the scene beats it covers (contiguous)
});
export const TrendRecipeV1 = z.object({ version: z.literal(1), beats: z.array(RecipeBeat).min(3).max(16) });

export const TrendHookVariantV1 = z.object({
  key: z.enum(["A", "B", "C", "D", "E"]),
  bait_concept_en: z.string().trim().min(10).max(300),     // fills {bait_en}; concepts must differ visually (Andromeda)
  hook_line_he_pattern: He(70),                            // the hook_line slot text; placeholders from the 17 hook placeholders
  why_he: He(160),
});

export const TrendNicheAdaptationV1 = z.object({
  niche_slug: NicheSlug,
  subject_en: z.string().trim().min(3).max(160), setting_en: z.string().trim().min(3).max(160),
  product_en: z.string().trim().min(3).max(160).nullable(),
  onscreen_examples_he: z.record(SlotKey, He(70)),        // one example per onscreen slot of the recipe
  vo_example_he: He(240).nullable(),
  cta_type: z.enum(["whatsapp", "call", "link_in_bio", "booking", "navigate", "lead_form", "comment_keyword", "save_share", "visit_site"]),
  notes_he: He(200).nullable(),
});

export const MusicBriefV1 = z.object({
  mood: z.enum(["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]),     // MusicMood (part 05 §17.4)
  bpm_min: z.number().int().min(60).max(180), bpm_max: z.number().int().min(60).max(180),
  drop_at_ms: z.number().int().min(1).max(60_000).nullable(),
  energy_curve: z.enum(["flat", "build", "drop", "loop"]),
  sfx_cues: z.array(z.object({ beat_key: SlotKey, kind: RecipeBeat.shape.sfx.unwrap() })).max(10),   // Sfx (part 05 §17.4)
});
```

- **`{bait_en}`** = ה-`bait_concept_en` של גרסת ההוק שנבחרה, אחרי מילוי `{subject_en}`, `{setting_en}` ו-`{product_en}` מההתאמה לנישה. בגרסאות האחיות (חלק 05 §18.9) רק סצנת ההוק שונה: הפיתיון, שורת ההוק והקריינות שלה.
- **`speed`** הוא קצב היעד של צילום אמיתי (§10.6). בסצנת AI הוא לא משפיע.
- **`purpose_he`** הוא הסבר לצוות ולמודל, והוא לא מגיע למסך.

### 5.2 גרסאות הוק, התאמות לנישה ומוזיקה

- **גרסאות הוק:** 3–5, `A`, `B`, `C`…. הפיתיונות שונים בתמונה ולא רק בטקסט (Jaccard של המילים מתחת ל-0.5), כי מטא מתייחסת למודעות כמעט זהות כאחת. `hook_line_he_pattern` עומד באותן מגבלות כמו החריץ `hook_line`, ומותרים בו רק 17 ה-placeholders הראשונים של המילון (`{עיר}`, `{שירות}`, `{מחיר}`…).
- **התאמות לנישה:** 3–6, נישה אחת לכל התאמה, וכל נישה מופיעה גם ב-`niches[]`. ב-`onscreen_examples_he` יש דוגמה לכל חריץ טקסט של המתכון, בדיוק. הדוגמאות נכנסות ל-`<trend_recipe>` כ-few-shot (חלק 05 §12.2), ולא נכנסות לסרטון כמו שהן.
- **`music_brief`** נשלח ל-`music.default` (Lyria) או לבחירת רצועה מהספרייה לפי `mood` (חלק 05 §17.4). אף פעם לא שם של שיר. `sfx_cues` חייבים להיות בדיוק ה-`sfx` של ביטי הסצנה, כך שאין שני מקורות אמת.

### 5.3 רשימת הצילומים: `GuidedShotListV1`

```ts
// lib/ai/schemas/guided.ts (part 1 of 2)
export const GuidedShotV1 = z.object({
  key: SlotKey,
  title_he: z.string().trim().min(2).max(40),
  instruction_he: z.string().trim().min(10).max(200),
  framing: z.enum(["wide", "medium", "closeup", "pov"]),
  min_sec: z.number().min(1).max(59), max_sec: z.number().min(2).max(60),
  ghost: z.enum(["tripod_wide", "hands_table", "face_center", "product_center", "cover_lens"]),   // CameraGhostGuide (part 01)
  tips_he: z.array(z.string().trim().min(2).max(80)).max(3),
  people_on_camera: z.boolean(),
}).refine((s) => s.max_sec > s.min_sec, "max_after_min");
export const GuidedShotListV1 = z.object({
  version: z.literal(1),
  intro_he: z.string().trim().min(10).max(200),
  estimated_minutes: z.number().int().min(2).max(15),
  shots: z.array(GuidedShotV1).min(1).max(8),
});
```

### 5.4 התבנית המלאה

```ts
// lib/ai/schemas/trends.ts — the template (OVERLAY_KINDS and SceneOverlayTemplate: §8.1–§8.2)
export const TREND_TEMPLATE_KEY_ORDER = ["slug", "name_he", "tagline_he", "description_he", "why_it_works_he", "hook_type_slug",
  "lifecycle", "production_mode", "ad_safety", "extra_gates", "requires_real_footage", "requires_people_consent", "recipe",
  "hook_variants", "niche_adaptations", "music_brief", "required_overlays", "shot_list", "compliance_notes_he", "do_not_copy",
  "platform_tone", "default_duration_sec", "default_goal", "default_video_type", "default_visual_style", "default_music_mood",
  "default_caption_preset", "vo_mode", "recommended_ad_goal", "niches", "first_seen_at", "peak_expected_at", "expires_at",
  "seo_title_he", "seo_description_he", "is_featured", "sort_order"] as const;

const AdSafety = z.enum(["ad_safe", "organic_only", "needs_consent", "needs_ai_label"]);
export const TrendTemplateBase = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60),
  name_he: z.string().trim().min(2).max(40), tagline_he: z.string().trim().min(10).max(80),
  description_he: z.string().trim().min(40).max(420), why_it_works_he: z.string().trim().min(20).max(300),
  hook_type_slug: HookTypeSlug,
  lifecycle: z.enum(["moment", "format", "evergreen"]),
  production_mode: z.enum(["ai", "guided", "hybrid"]),
  ad_safety: AdSafety, extra_gates: z.array(AdSafety.exclude(["ad_safe"])).max(3),
  requires_real_footage: z.boolean(), requires_people_consent: z.boolean(),
  recipe: TrendRecipeV1,
  hook_variants: z.array(TrendHookVariantV1).min(3).max(5),
  niche_adaptations: z.array(TrendNicheAdaptationV1).min(3).max(6),
  music_brief: MusicBriefV1,
  required_overlays: z.array(z.enum(OVERLAY_KINDS)).max(4),
  shot_list: GuidedShotListV1.nullable(),
  compliance_notes_he: z.array(z.string().trim().min(5).max(200)).min(2).max(6),
  do_not_copy: z.array(z.string().trim().min(5).max(300)).min(1).max(10),
  platform_tone: z.object({ reels: z.string().max(120), facebook: z.string().max(120) }),
  default_duration_sec: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
  default_goal: z.enum(["awareness", "leads", "sales", "trust", "engagement"]),
  default_video_type: z.enum(["brand_promo", "reel_hook", "offer", "testimonial", "launch", "recruiting", "explainer"]),
  default_visual_style: z.enum(["cinematic", "ugc", "day_in_business", "before_after", "product", "text_motion"]),
  default_music_mood: MusicBriefV1.shape.mood,
  default_caption_preset: z.enum(["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"]),
  vo_mode: z.enum(["none", "optional", "required"]),
  recommended_ad_goal: z.enum(["whatsapp_messages", "lead_form", "website_traffic", "local_awareness"]).nullable(),
  niches: z.array(NicheSlug).min(1).max(12),
  first_seen_at: IsoDate.nullable(), peak_expected_at: IsoDate.nullable(), expires_at: z.string().datetime({ offset: true }).nullable(),
  seo_title_he: z.string().trim().max(60), seo_description_he: z.string().trim().min(50).max(155),
  is_featured: z.boolean(), sort_order: z.number().int().min(0).max(10_000),
});
export const TrendTemplateV1 = TrendTemplateBase.superRefine(validateTemplateRules);   // lib/trends/validate.ts: TT05–TT27 (§5.6)
export type TrendTemplateV1 = z.infer<typeof TrendTemplateV1>;
```

- **שדות שנשמרים רק במסד** ולא בחוזה של התבנית: `status`, `publish_at`, `published_at`, `published_week`, `demo_assets`, `explainer`, `source_reference_id`, `is_evergreen` (מחושבת), `created_by`, `updated_by`.
- **`expires_at`** כש-A8 מפרסם ואין ערך: `moment` + 10 ימים, `format` + 56 ימים, `evergreen` ריק. אילוץ `trend_templates_expiry` (§6.4) לא מאפשר תבנית `moment` או `format` מתוזמנת או מפורסמת בלי תאריך.
- **A6** מקבל `TrendTemplateBase.partial()` בלי `slug`. השרת ממזג עם השורה הקיימת ומריץ את `TrendTemplateV1` המלא על התוצאה. כך שגיאה של כלל TT מוחזרת על השדה ששונה (`INVALID_INPUT` עם `issues`).

### 5.5 הטיוטה השטוחה `TrendTemplateV1Draft` (`trends.adapt.v1`)

הספק מקבל סכמה קפדנית בלי איחודים ובלי רשומות (חלק 05 §11.4, כלל 1). לכן `trends.adapt.v1` מחזיר טיוטה שטוחה, ו-`draftToTemplate(draft, analysis)` ב-`lib/trends/adapt.ts` ממיר אותה ל-`TrendTemplateV1`:

- כל ביט נושא `overlay_kind` (מתוך 11 הסוגים, או `"none"`) ושדות טקסט nullable: `overlay_text_he`, `overlay_title_he`, `overlay_body_he`, `overlay_lead_he`, `overlay_label_he`, `overlay_emoji`, `overlay_time`, `overlay_verdict` (`"true" | "false" | null`), `overlay_variant` (סוגי ההתראה). הממיר בונה מהם את תבנית ה-`SceneOverlayV1` (§8.2), עם `"$onscreen"` כשהטקסט הוא טקסט החריץ.
- `onscreen_examples_he` מגיע כמערך של זוגות `{ slot_key, text_he }`, והממיר הופך אותו ל-`Record`.
- `spans` של ביט `label` מגיע כמערך של מפתחות; `shot_list` מגיע תמיד (ריק ב-`ai`), והממיר מחליף רשימה ריקה ב-`null`.
- **ברירות מחדל שהממיר קובע ולא המודל:** `slug` (מ-`format_name_en`, עם סיומת מספרית בהתנגשות), `lifecycle = 'format'`, `is_featured = false`, `sort_order = 1000`, `first_seen_at` = `observed_at` של הסרטון, `expires_at = null`, וכל מה שהשער של §3.5 קבע (`requires_people_consent`, `ad_safety`, `production_mode`, תוספות ל-`do_not_copy`).
- הטיוטה נשמרת כ-`status = 'draft'` עם `source_reference_id`, ומשם עוברת לעורך (§14.4).

ה-snapshot `lib/ai/schemas/json/trend_template_draft_v1.json`:

```json
{"type":"object","additionalProperties":false,
 "required":["name_he","tagline_he","description_he","why_it_works_he","hook_type_slug","production_mode","ad_safety","default_duration_sec","default_goal","default_video_type","default_visual_style","default_music_mood","default_caption_preset","vo_mode","recommended_ad_goal","beats","hook_variants","niche_adaptations","music_brief","shot_list","compliance_notes_he","do_not_copy","platform_tone","niches","seo_title_he","seo_description_he"],
 "properties":{
  "name_he":{"type":"string"},"tagline_he":{"type":"string"},"description_he":{"type":"string"},"why_it_works_he":{"type":"string"},
  "hook_type_slug":{"type":"string"},
  "production_mode":{"type":"string","enum":["ai","guided","hybrid"]},
  "ad_safety":{"type":"string","enum":["ad_safe","organic_only","needs_consent","needs_ai_label"]},
  "default_duration_sec":{"type":"integer","enum":[15,30,45,60]},
  "default_goal":{"type":"string","enum":["awareness","leads","sales","trust","engagement"]},
  "default_video_type":{"type":"string","enum":["brand_promo","reel_hook","offer","testimonial","launch","recruiting","explainer"]},
  "default_visual_style":{"type":"string","enum":["cinematic","ugc","day_in_business","before_after","product","text_motion"]},
  "default_music_mood":{"type":"string","enum":["energetic","warm","luxury","funny","calm","inspiring","urban"]},
  "default_caption_preset":{"type":"string","enum":["bold-pop","clean-box","karaoke","poster","news","soft"]},
  "vo_mode":{"type":"string","enum":["none","optional","required"]},
  "recommended_ad_goal":{"type":["string","null"],"enum":["whatsapp_messages","lead_form","website_traffic","local_awareness",null]},
  "beats":{"type":"array","items":{"type":"object","additionalProperties":false,
    "required":["key","role","duration_ms","purpose_he","visual_source","visual_prompt_en","motion_prompt_en","camera","transition_in","sfx","speed","onscreen_slot_key","onscreen_max_chars","onscreen_example_he","vo_slot_key","vo_max_words","overlay_kind","overlay_text_he","overlay_title_he","overlay_body_he","overlay_lead_he","overlay_label_he","overlay_emoji","overlay_time","overlay_verdict","overlay_variant","guided_shot_key","spans"],
    "properties":{"key":{"type":"string"},"role":{"type":"string","enum":["bait","cut","payoff","reveal","cta","label"]},
      "duration_ms":{"type":"integer"},"purpose_he":{"type":"string"},
      "visual_source":{"type":["string","null"],"enum":["ai_clip","ai_image_kenburns","user_media","brand_card",null]},
      "visual_prompt_en":{"type":"string"},"motion_prompt_en":{"type":"string"},
      "camera":{"type":["string","null"],"enum":["static","push_in","pull_out","pan_left","pan_right","tilt_up","tilt_down","handheld","orbit","drone",null]},
      "transition_in":{"type":["string","null"],"enum":["cut","fade","whip","zoom","slide","wipe","flash",null]},
      "sfx":{"type":["string","null"],"enum":["whoosh","impact","pop","sizzle","click","riser","cash","camera_shutter",null]},
      "speed":{"type":["number","null"]},
      "onscreen_slot_key":{"type":["string","null"]},"onscreen_max_chars":{"type":["integer","null"]},"onscreen_example_he":{"type":["string","null"]},
      "vo_slot_key":{"type":["string","null"]},"vo_max_words":{"type":["integer","null"]},
      "overlay_kind":{"type":"string","enum":["none","sign","fake_ui","meme_caption","bts_label","split_reveal","comment_bubble","rating","pov_label","clock","sticker","price"]},
      "overlay_text_he":{"type":["string","null"],"description":"\"$onscreen\" when the overlay shows the slot text"},
      "overlay_title_he":{"type":["string","null"]},"overlay_body_he":{"type":["string","null"]},"overlay_lead_he":{"type":["string","null"]},
      "overlay_label_he":{"type":["string","null"]},"overlay_emoji":{"type":["string","null"]},"overlay_time":{"type":["string","null"]},
      "overlay_verdict":{"type":["string","null"],"enum":["true","false",null]},
      "overlay_variant":{"type":["string","null"],"enum":["low_battery","new_message","order_arrived","generic",null]},
      "guided_shot_key":{"type":["string","null"]},
      "spans":{"type":"array","items":{"type":"string"}}}}},
  "hook_variants":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["key","bait_concept_en","hook_line_he_pattern","why_he"],
    "properties":{"key":{"type":"string","enum":["A","B","C","D","E"]},"bait_concept_en":{"type":"string"},"hook_line_he_pattern":{"type":"string"},"why_he":{"type":"string"}}}},
  "niche_adaptations":{"type":"array","items":{"type":"object","additionalProperties":false,
    "required":["niche_slug","subject_en","setting_en","product_en","onscreen_examples","vo_example_he","cta_type","notes_he"],
    "properties":{"niche_slug":{"type":"string"},"subject_en":{"type":"string"},"setting_en":{"type":"string"},"product_en":{"type":["string","null"]},
      "onscreen_examples":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["slot_key","text_he"],"properties":{"slot_key":{"type":"string"},"text_he":{"type":"string"}}}},
      "vo_example_he":{"type":["string","null"]},
      "cta_type":{"type":"string","enum":["whatsapp","call","link_in_bio","booking","navigate","lead_form","comment_keyword","save_share","visit_site"]},
      "notes_he":{"type":["string","null"]}}}},
  "music_brief":{"type":"object","additionalProperties":false,"required":["mood","bpm_min","bpm_max","drop_at_ms","energy_curve","sfx_cues"],
    "properties":{"mood":{"type":"string","enum":["energetic","warm","luxury","funny","calm","inspiring","urban"]},"bpm_min":{"type":"integer"},"bpm_max":{"type":"integer"},
      "drop_at_ms":{"type":["integer","null"]},"energy_curve":{"type":"string","enum":["flat","build","drop","loop"]},
      "sfx_cues":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["beat_key","kind"],
        "properties":{"beat_key":{"type":"string"},"kind":{"type":"string","enum":["whoosh","impact","pop","sizzle","click","riser","cash","camera_shutter"]}}}}}},
  "shot_list":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["key","title_he","instruction_he","framing","min_sec","max_sec","ghost","tips_he","people_on_camera"],
    "properties":{"key":{"type":"string"},"title_he":{"type":"string"},"instruction_he":{"type":"string"},
      "framing":{"type":"string","enum":["wide","medium","closeup","pov"]},"min_sec":{"type":"number"},"max_sec":{"type":"number"},
      "ghost":{"type":"string","enum":["tripod_wide","hands_table","face_center","product_center","cover_lens"]},
      "tips_he":{"type":"array","items":{"type":"string"}},"people_on_camera":{"type":"boolean"}}}},
  "compliance_notes_he":{"type":"array","items":{"type":"string"}},"do_not_copy":{"type":"array","items":{"type":"string"}},
  "platform_tone":{"type":"object","additionalProperties":false,"required":["reels","facebook"],"properties":{"reels":{"type":"string"},"facebook":{"type":"string"}}},
  "niches":{"type":"array","items":{"type":"string"}},"seo_title_he":{"type":"string"},"seo_description_he":{"type":"string"}}}
```

### 5.6 כללי התבנית TT01–TT27 (`lib/trends/validate.ts`)

אותה רשימה בדיוק רצה בשלושה מקומות: ב-`seed/scripts/build_trends.py` (על קובץ ה-seed), ב-`TrendTemplateV1.superRefine` (A5, A6, A8) וב-`pnpm seed:sync` (חלק 04 §16.1). בדיקת יחידה מריצה את שני המימושים על אותם 30 מקרים שליליים (`tests/fixtures/trends/template-cases.json`) ומוודאת שהקודים זהים.

| קוד | הכלל |
|---|---|
| TT01 | המפתחות והסדר שלהם לפי `TREND_TEMPLATE_KEY_ORDER`, וכל ביט לפי הסדר של `RecipeBeat` |
| TT02 | `slug` תקין וייחודי |
| TT03 | כל ערך מתוך ה-enum שלו; `extra_gates` שונים זה מזה, בלי `ad_safe` ובלי הערך של `ad_safety` |
| TT04 | `hook_type_slug` ו-`niches[]` קיימים (בלי `local-politics`) |
| TT05 | 2–10 ביטי סצנה; הראשון `bait` והאחרון `cta`; `bait` בין 2,000 ל-3,500 ms והשאר בין 1,500 ל-8,000, בכפולות של 500; הסכום בתוך ±10% מ-`default_duration_sec` |
| TT06 | `cut`: משך 0, `transition_in = "cut"`, בין שני ביטי סצנה; לסצנה שאחריו `transition_in = "cut"` ואותו `sfx` (`B15`) |
| TT07 | `label`: שכבה מסוג `bts_label` או `pov_label`, משך 0, `spans` של ביטי סצנה רצופים; `spans` רק בביט `label` |
| TT08 | שכבה אחת לסצנה לכל היותר, ולא בסצנה שמכוסה בתווית; `required_overlays` = בדיוק הסוגים שבשימוש |
| TT09 | כללי השכבות של §8.6: `sign` על תמונה סטטית (`ai_image_kenburns`, `camera = "static"`); `fake_ui` רק ב-`organic_only`; `price` עם `{מחיר} ₪` או `{סכום} ₪`; `split_reveal.before` מצביע על סצנה קודמת; 1–2 מדבקות מהרשימה; שעה `HH:MM`; תזמון בתוך הביט |
| TT10 | לביט ה-`bait` יש החריץ `hook_line`; כל טקסט חריץ עד `max_chars`, עד 70 תווים ועד 8 מילים; מגבלות נספח E §12 לפי השכבה (`sign_text` 40, `meme_caption` 40); בהתראה: כותרת עד 24, שורת ירידה, גוף עד 60 |
| TT11 | `vo_mode = "none"` ← אין `vo_slot`; אחרת שני חריצי קריינות לפחות, ו-`max_words` ≤ `floor(שניות × 2.4 × 0.9)` |
| TT12 | מקור AI ← פרומפטים באנגלית בלי אותיות עבריות, רק החריצים `{subject_en}`, `{setting_en}`, `{product_en}`, `{bait_en}` (האחרון רק בביט ה-`bait`), בלי בקשה לטקסט בפריים; `user_media` ו-`brand_card` בלי פרומפטים |
| TT13 | `ai`: בלי `user_media`, בלי `guided_shot_key`, `shot_list = null`. `guided`: כל ביט `user_media` עם `guided_shot_key`. `hybrid`: ביט עם `guided_shot_key` שומר מקור AI כגיבוי. המפתחות של הביטים = המפתחות של `shot_list`; `requires_real_footage` אמת בדיוק ב-`guided` |
| TT14 | `requires_people_consent` ⇔ שער `needs_consent` (ב-`ad_safety` או ב-`extra_gates`), ורק בתבנית `guided` |
| TT15 | `organic_only` ← `recommended_ad_goal = null` |
| TT16 | 3–5 גרסאות `A`, `B`, `C`…; פיתיונות שונים (Jaccard < 0.5); שורת ההוק עומדת בכללי `hook_line` ובלי סוגריים (`HE025`) |
| TT17 | 3–6 התאמות, נישה אחת לכל אחת, מתוך `niches[]`; דוגמה לכל חריץ טקסט ורק להם; `product_en` כשהפרומפטים משתמשים בו; `vo_example_he` בדיוק כשיש קריינות |
| TT18 | `music_brief` תקין; `sfx_cues` = בדיוק ה-`sfx` של ביטי הסצנה |
| TT19 | `shot_list` תקין: 1–8 שוטים, 2–15 דקות, מפתחות ייחודיים |
| TT20 | כל טקסט עברי עובר את בדיקות ה-seed של חלק 04 (`HE001`, `HE004`, `HE023`, `HE024`, לוכסנים, "·", "הכול"), `HE026`, `HE027`, placeholders מהמילון בלבד, ₪ אחרי המספר (`{מחיר} ₪`), ופנייה ברבים או ניטרלית |
| TT21 | 2–6 הערות ציות; `do_not_copy` עם 3 פריטים לפחות בתבנית שנולדה מסרטון ייחוס; ב-`organic_only` ההערה הראשונה היא המשפט הקבוע של §16.3 |
| TT22 | שומר הדמיון של §5.7 |
| TT23 | `seo_title_he` עד 60 תווים, `seo_description_he` בין 50 ל-155 |
| TT24 | `moment` ו-`format` עם `first_seen_at`; בשורת seed `expires_at = null` (נקבע בפרסום) |
| TT25 | `platform_tone` עם `reels` ו-`facebook`, עד 120 תווים כל אחד |
| TT26 | אורכי הכרטיס: שם 2–40, שורת תיאור 10–80, תיאור 40–420, "למה זה עובד" 20–300 |
| TT27 | שוט עם `ghost = "face_center"` הוא `people_on_camera` |

### 5.7 שומר הדמיון (`lib/trends/similarity.ts`)

```ts
export function similarityHits(template: TrendTemplateV1, refs: { analysis: TrendAnalysisV1 | null; extra: string[] }): SimilarityHit[];
// refs = analysis.on_screen_text[].text_en + text_original, spoken.first_line_en + first_line_original,
//        quoted phrases inside do_not_copy ('…'), and the KNOWN_REFERENCE_TEXTS list of the four research references
// normalise: lowercase, strip niqqud and punctuation, split on whitespace; drop the generic markers "pov", "grwm", "asmr"
// n = min(6, tokens(ref).length), and only refs with ≥ 3 tokens; a hit = any n-gram of the ref inside any template text
```

- **שדות שנבדקים:** כל שדה `_he` ו-`_en` של התבנית, כולל הפרומפטים, הדוגמאות לנישות וגרסאות ההוק. `do_not_copy` עצמו לא נבדק.
- **תרגום הוא העתקה:** כשלשורה בסרטון הייחוס יש תרגום עברי מוכר, המנהל מוסיף אותו ל-`do_not_copy` במירכאות בודדות, ומשם הוא נבדק כמו כל ביטוי (כך נבדקים 'בואו לבקר במוזיאון' ו-'המשאית כמעט תפסה אותי' ב-seed).
- **A5:** פגיעה ← `MODERATION_BLOCKED {reason:"similarity", hits:[{field, phrase}]}`, והטיוטה לא נשמרת. **A6** ו-**A8**: אותה בדיקה, ועם אותה שגיאה.
- **הסף** (6 מילים, או כל הביטוי כשהוא קצר יותר) נבדק ב-M0 מול 20 סרטוני ייחוס מתויגים [M0-verify], והתוצאה נרשמת ב-`DECISIONS.md`.

### 5.8 `lib/trends/seed-schema.ts`

```ts
// lib/trends/seed-schema.ts — re-exported by supabase/seed/schemas.ts (part 04 §16.2)
export { TREND_TEMPLATE_KEY_ORDER } from "@/lib/ai/schemas/trends";
export const TrendTemplateSeed = TrendTemplateV1.refine((t) => t.expires_at === null, "seed_rows_have_no_expiry");
export type TrendTemplateSeed = z.infer<typeof TrendTemplateSeed>;
```

### קריטריוני קבלה
- [ ] `TrendTemplateV1.parse` עובר על כל 12 השורות של `seed/trend_templates.json`, ו-`python3 -I seed/scripts/build_trends.py --check` מחזיר 0 שגיאות.
- [ ] 30 המקרים השליליים של `template-cases.json` נכשלים באותו קוד TT ב-Python וב-TypeScript.
- [ ] טיוטה שהטקסט על השלט שלה הוא "Come visit the museum" בתרגום עברי מילולי, או שמכילה 6 מילים רצופות מ-`text_en` של הניתוח, נדחית ב-A5 עם `MODERATION_BLOCKED` ו-`reason: "similarity"` (קריטריון של M8); "POV:" לבד לא נחשב.
- [ ] `draftToTemplate` על הפלט של `trends.adapt.v1` מה-fixture של T1 מחזיר תבנית שעוברת את `TrendTemplateV1`, עם שכבת `sign` שה-`textHe` שלה `"$onscreen"`.
- [ ] A8 על תבנית `format` בלי `expires_at` קובע `published_at + 56 ימים`.

---

## §6. המיגרציה `0014_trends.sql` (SQL מלא; מפרט §D.2)

המיגרציה רצה **אחרי ההשקה ואחרי `0013`**, ושני הקבצים נכנסים יחד במיזוג הראשון של M8 (§1.3, חלק 04 §2.3). היא לא עורכת אף קובץ מ-`0001`–`0013`. הכללים של חלק 04 §2.3 חלים: ערכי enum חדשים בראש הקובץ ובלי שימוש בתוכו; לכל טבלה חדשה `enable row level security` ו-`revoke all … from anon, authenticated` לפני grants מפורשים; לכל פונקציה `set search_path = ''` ו-`revoke execute` מפורש (R9) לפני ה-grants; פונקציה שמקבלת מזהה סביבה ופתוחה ל-`authenticated` מתחילה בבדיקת R39; FK ל-`profiles` תמיד `on delete set null`. **כל הכתיבות לטבלאות של הקובץ הזה הן בצד השרת בלבד**, חוץ מהעמודה `workspaces.benchmarks_opt_out`. הסדר בקובץ הוא הסדר של הבלוקים כאן.

### 6.1 enum-ים

```sql
-- 0014_trends.sql — trends engine + guided filming (part 08 §6). Runs after 0013 (late FKs in block 7);
-- both files ship together in the first M8 merge (part 04 §2.3).

-- ===== 1. values added to existing enums: used only at runtime, never inside this file (part 04 §3) =====
alter type public.ai_task add value if not exists 'llm_trend_analysis';
alter type public.ai_task add value if not exists 'llm_trend_template';
alter type public.ai_task add value if not exists 'llm_guided';

-- ===== 2. new enum types (8; 58 enum types after this file) =====
create type public.trend_rights_basis    as enum ('own_content','licensed','partner_permission','customer_owned','public_youtube_url','link_only_notes');
create type public.trend_source_platform as enum ('tiktok','instagram','facebook','youtube','meta_ad_library','tiktok_top_ads','own','other');
create type public.trend_analysis_status as enum ('queued','running','succeeded','failed','rejected');
create type public.trend_template_status as enum ('draft','review','scheduled','published','retired');
create type public.trend_lifecycle       as enum ('moment','format','evergreen');
create type public.trend_production_mode as enum ('ai','guided','hybrid');
create type public.trend_ad_safety       as enum ('ad_safe','organic_only','needs_consent','needs_ai_label');
create type public.guided_shoot_status   as enum ('planning','shooting','uploaded','editing','ready','failed');
```

### 6.2 סרטוני השראה וניתוחים

```sql
-- ===== 3. trend references and analyses (Trend Studio; platform admins only) =====
create table public.trend_references (
  id                  uuid primary key default gen_random_uuid(),
  created_by          uuid references public.profiles(id) on delete set null,
  source_platform     public.trend_source_platform not null,
  source_url          text check (source_url is null or (char_length(source_url) <= 2048 and source_url ~ '^https://')),
  rights_basis        public.trend_rights_basis not null,
  rights_note         text not null check (char_length(rights_note) between 5 and 500),
  rights_attested_at  timestamptz not null,
  rights_attested_by  uuid references public.profiles(id) on delete set null,     -- nullable: account deletion is never blocked
  storage_path        text,                     -- trend-refs/{id}/source.{ext}; null for public_youtube_url and link_only_notes
  mime                text check (mime is null or mime in ('video/mp4','video/quicktime','video/webm')),
  bytes               bigint check (bytes is null or bytes between 1 and 209715200),
  duration_ms         int check (duration_ms is null or duration_ms between 300 and 180000),
  width               int check (width is null or width > 0),
  height              int check (height is null or height > 0),
  phash               text check (phash is null or phash ~ '^[0-9a-f]{48}$'),   -- 3 × 64-bit average hash (0, 1, 2 s)
  region              text not null default 'IL' check (region ~ '^[A-Z]{2}$'),
  observed_at         date not null default current_date,
  admin_notes_he      text check (admin_notes_he is null or char_length(admin_notes_he) <= 4000),
  retention_until     timestamptz,
  file_deleted_at     timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint trend_references_link_bases check (
    rights_basis not in ('public_youtube_url','link_only_notes') or (storage_path is null and source_url is not null)),
  constraint trend_references_notes check (rights_basis <> 'link_only_notes' or admin_notes_he is not null),
  constraint trend_references_youtube check (
    rights_basis <> 'public_youtube_url' or source_url ~ '^https://(www\.)?(youtube\.com/(watch\?v=|shorts/)|youtu\.be/)[A-Za-z0-9_-]{6,}')
);
create index trend_references_retention_idx on public.trend_references (retention_until)
  where retention_until is not null and file_deleted_at is null;
create index trend_references_phash_idx on public.trend_references (phash) where phash is not null;

create table public.trend_analyses (
  id                 uuid primary key default gen_random_uuid(),
  reference_id       uuid not null references public.trend_references(id) on delete cascade,
  status             public.trend_analysis_status not null default 'queued',
  prompt_template_id text,
  model_served       text,
  cost_usd           numeric(10,5) not null default 0 check (cost_usd >= 0),
  analysis           jsonb check (analysis is null or (jsonb_typeof(analysis) = 'object' and analysis->>'version' = '1')),  -- TrendAnalysisV1
  hook_package       jsonb check (hook_package is null or jsonb_typeof(hook_package) = 'object'),                         -- §3.2
  risk_flags         text[] not null default '{}' check (risk_flags <@ array['creator_face','creator_voice','copyrighted_music',
                       'third_party_logo','minor','political_or_war','medical_claim','testimonial_format','dangerous_stunt',
                       'real_injury','deceptive_ui']::text[]),
  reject_reason      text check (reject_reason is null or char_length(reject_reason) <= 200),
  error_code         text check (error_code is null or char_length(error_code) <= 80),
  version            smallint not null default 1 check (version >= 1),
  created_by         uuid references public.profiles(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (reference_id, version),
  constraint trend_analyses_succeeded check (status <> 'succeeded' or analysis is not null),
  constraint trend_analyses_rejected  check ((status = 'rejected') = (reject_reason is not null))
);
```

### 6.3 תבניות, שימושים, נתונים מצטברים וצילומים

```sql
-- ===== 4. templates =====
create table public.trend_templates (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name_he                 text not null check (char_length(name_he) between 2 and 40),
  tagline_he              text not null check (char_length(tagline_he) between 10 and 80),
  description_he          text not null check (char_length(description_he) between 40 and 420),
  why_it_works_he         text not null check (char_length(why_it_works_he) between 20 and 300),
  hook_type_slug          text not null references public.hook_types(slug) on update cascade on delete restrict,
  lifecycle               public.trend_lifecycle not null,
  is_evergreen            boolean generated always as (lifecycle = 'evergreen') stored,
  production_mode         public.trend_production_mode not null,
  ad_safety               public.trend_ad_safety not null,
  extra_gates             public.trend_ad_safety[] not null default '{}'
                            check (cardinality(extra_gates) <= 3 and not ('ad_safe' = any (extra_gates))),
  requires_real_footage   boolean not null default false,
  requires_people_consent boolean not null default false,
  recipe                  jsonb not null check (jsonb_typeof(recipe) = 'object' and recipe->>'version' = '1'
                                                and jsonb_typeof(recipe->'beats') = 'array'),              -- TrendRecipeV1
  hook_variants           jsonb not null check (jsonb_typeof(hook_variants) = 'array'
                                                and jsonb_array_length(hook_variants) between 3 and 5),   -- TrendHookVariantV1[]
  niche_adaptations       jsonb not null default '[]' check (jsonb_typeof(niche_adaptations) = 'array'), -- TrendNicheAdaptationV1[]
  music_brief             jsonb not null check (jsonb_typeof(music_brief) = 'object'),                  -- MusicBriefV1
  required_overlays       text[] not null default '{}' check (required_overlays <@ array['sign','fake_ui','meme_caption',
                            'bts_label','split_reveal','comment_bubble','rating','pov_label','clock','sticker','price']::text[]),
  shot_list               jsonb check (shot_list is null or (jsonb_typeof(shot_list) = 'object' and shot_list->>'version' = '1')),
  compliance_notes_he     text[] not null default '{}',
  do_not_copy             text[] not null default '{}',                               -- never in a DTO, a page or an email
  platform_tone           jsonb not null default '{}' check (jsonb_typeof(platform_tone) = 'object'),
  default_duration_sec    smallint not null default 15 check (default_duration_sec in (15,30,45,60)),
  default_goal            public.hook_goal not null default 'awareness',
  default_video_type      public.video_type not null default 'reel_hook',
  default_visual_style    text not null check (default_visual_style in ('cinematic','ugc','day_in_business','before_after','product','text_motion')),
  default_music_mood      text not null check (default_music_mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  default_caption_preset  text not null default 'bold-pop' check (default_caption_preset in ('bold-pop','clean-box','karaoke','poster','news','soft')),
  vo_mode                 text not null default 'optional' check (vo_mode in ('none','optional','required')),
  recommended_ad_goal     public.ad_goal,
  niches                  text[] not null default '{}',                              -- niches.slug (validated by TT04)
  source_reference_id     uuid references public.trend_references(id) on delete set null,   -- internal only, never exposed
  first_seen_at           date,
  peak_expected_at        date,
  expires_at              timestamptz,
  publish_at              timestamptz,
  published_at            timestamptz,
  published_week          text check (published_week is null or published_week ~ '^[0-9]{4}-W[0-9]{2}$'),
  status                  public.trend_template_status not null default 'draft',
  demo_assets             jsonb not null default '[]' check (jsonb_typeof(demo_assets) = 'array'),   -- §11.6
  explainer               jsonb check (explainer is null or jsonb_typeof(explainer) = 'object'),     -- TrendExplainerV1
  seo_title_he            text check (seo_title_he is null or char_length(seo_title_he) <= 60),
  seo_description_he      text check (seo_description_he is null or char_length(seo_description_he) <= 155),
  is_featured             boolean not null default false,
  sort_order              int not null default 0,
  created_by              uuid references public.profiles(id) on delete set null,
  updated_by              uuid references public.profiles(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint trend_templates_organic_only check (ad_safety <> 'organic_only' or recommended_ad_goal is null),
  constraint trend_templates_expiry       check (lifecycle = 'evergreen' or expires_at is not null or status in ('draft','review')),
  constraint trend_templates_scheduled    check (status <> 'scheduled' or publish_at is not null),
  constraint trend_templates_published    check (status <> 'published' or (published_at is not null and published_week is not null)),
  constraint trend_templates_consent      check (not requires_people_consent or production_mode = 'guided')
);
create index trend_templates_status_publish_idx on public.trend_templates (status, publish_at);
create index trend_templates_niches_idx         on public.trend_templates using gin (niches);
create index trend_templates_week_idx           on public.trend_templates (published_week) where published_week is not null;

-- ===== 5. uses, stats, guided shoots =====
create table public.trend_template_uses (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  project_id        uuid not null unique references public.projects(id) on delete cascade,
  template_id       uuid not null references public.trend_templates(id) on delete restrict,   -- templates retire, never delete
  niche_slug        text references public.niches(slug) on update cascade on delete set null,
  hook_variant_keys text[] not null default '{}' check (hook_variant_keys <@ array['A','B','C','D','E']::text[]),
  production_mode   public.trend_production_mode not null,
  created_at        timestamptz not null default now()
);
create index trend_template_uses_template_idx on public.trend_template_uses (template_id, created_at desc);
create index trend_template_uses_ws_idx       on public.trend_template_uses (workspace_id);

create table public.trend_template_stats_daily (     -- filled only while cross_customer_benchmarks.enabled (§11.7)
  template_id           uuid not null references public.trend_templates(id) on delete cascade,
  niche_slug            text not null,
  date                  date not null,
  businesses_count      int not null default 0 check (businesses_count >= 0),
  impressions           bigint not null default 0,
  video_3s_plays        bigint not null default 0,
  thruplays             bigint not null default 0,
  results               bigint not null default 0,
  spend_ils             numeric(12,2) not null default 0 check (spend_ils >= 0),
  organic_views         bigint not null default 0,
  organic_skip_rate_avg numeric(6,4) check (organic_skip_rate_avg is null or organic_skip_rate_avg between 0 and 1),
  primary key (template_id, niche_slug, date)
);

create table public.guided_shoots (
  id                         uuid primary key default gen_random_uuid(),
  workspace_id               uuid not null references public.workspaces(id) on delete cascade,
  project_id                 uuid not null unique references public.projects(id) on delete cascade,
  template_id                uuid references public.trend_templates(id) on delete set null,
  status                     public.guided_shoot_status not null default 'planning',
  shot_list                  jsonb not null check (jsonb_typeof(shot_list) = 'object' and shot_list->>'version' = '1'),  -- GuidedShotListV1
  shots                      jsonb not null default '[]' check (jsonb_typeof(shots) = 'array'),
                             -- [{shot_key, asset_id, source: "camera"|"file", autocut: GuidedAutocutV1 | null}]
  people_consent_attested_at timestamptz,
  attested_by                uuid references public.profiles(id) on delete set null,
  created_by                 uuid references public.profiles(id) on delete set null,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);
create index guided_shoots_ws_idx on public.guided_shoots (workspace_id, status);
```

### 6.4 עמודות חדשות ו-FK מאוחרים

```sql
-- ===== 6. columns on existing tables =====
alter table public.projects
  add column trend_template_id uuid references public.trend_templates(id) on delete set null,
  add column production_mode   public.trend_production_mode not null default 'ai';
create index projects_trend_template_idx on public.projects (trend_template_id) where trend_template_id is not null;

alter table public.scenes
  add column overlay           jsonb check (overlay is null or (jsonb_typeof(overlay) = 'object' and overlay ? 'kind')),  -- SceneOverlayV1 (server-written, R7)
  add column user_media_in_ms  int check (user_media_in_ms is null or user_media_in_ms >= 0),
  add column user_media_out_ms int,
  add constraint scenes_user_media_trim check (
    (user_media_in_ms is null and user_media_out_ms is null)
    or (user_media_in_ms is not null and user_media_out_ms is not null and user_media_out_ms >= user_media_in_ms + 500));

alter table public.workspaces add column benchmarks_opt_out boolean not null default false;
grant update (benchmarks_opt_out) on public.workspaces to authenticated;   -- under the existing owner/admin update policy (part 04 §12.7)

-- ===== 7. late FKs for the trend_template_id columns created in 0013 =====
alter table public.ad_campaigns       add constraint ad_campaigns_trend_template_id_fkey
  foreign key (trend_template_id) references public.trend_templates(id) on delete set null;
alter table public.ad_variants        add constraint ad_variants_trend_template_id_fkey
  foreign key (trend_template_id) references public.trend_templates(id) on delete set null;
alter table public.social_posts       add constraint social_posts_trend_template_id_fkey
  foreign key (trend_template_id) references public.trend_templates(id) on delete set null;
alter table public.content_plan_items add constraint content_plan_items_trend_template_id_fkey
  foreign key (trend_template_id) references public.trend_templates(id) on delete set null;
create index if not exists ad_campaigns_trend_template_idx       on public.ad_campaigns (trend_template_id)       where trend_template_id is not null;
create index if not exists ad_variants_trend_template_idx        on public.ad_variants (trend_template_id)        where trend_template_id is not null;
create index if not exists social_posts_trend_template_idx       on public.social_posts (trend_template_id)       where trend_template_id is not null;
create index if not exists content_plan_items_trend_template_idx on public.content_plan_items (trend_template_id) where trend_template_id is not null;
```

### 6.5 טריגרים

```sql
-- ===== 8. triggers =====
create trigger set_updated_at before update on public.trend_references for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.trend_analyses   for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.trend_templates  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.guided_shoots    for each row execute function public.set_updated_at();

-- projects is writable by editors through the user client (part 04 §19.3); the trend columns are server-managed:
-- POST /api/projects inserts with the user client, then sets them and the trend_template_uses row with the secret client (§9.2).
create or replace function public.projects_trend_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then return new; end if;          -- server (secret key) writes are trusted
  if tg_op = 'INSERT' then
    if new.trend_template_id is not null or new.production_mode <> 'ai' then
      perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'server_managed_columns'));
    end if;
  elsif (new.trend_template_id, new.production_mode) is distinct from (old.trend_template_id, old.production_mode) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'server_managed_columns'));
  end if;
  return new;
end $$;
create trigger projects_trend_guard before insert or update on public.projects
  for each row execute function public.projects_trend_guard();

-- a use row and a guided shoot always belong to the workspace of their project (defence in depth for server code)
create or replace function public.trend_same_workspace_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.projects p where p.id = new.project_id and p.workspace_id = new.workspace_id) then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'cross_workspace'));
  end if;
  return new;
end $$;
create trigger trend_template_uses_same_ws before insert or update on public.trend_template_uses
  for each row execute function public.trend_same_workspace_guard();
create trigger guided_shoots_same_ws before insert or update on public.guided_shoots
  for each row execute function public.trend_same_workspace_guard();
```

### 6.6 פונקציות

```sql
-- ===== 9. functions =====
-- the app feed (T1, dashboard card, plan.month.v1). R39: rows only for a workspace the caller can access.
create or replace function public.trend_feed(p_ws uuid, p_niche text default null, p_limit int default 24, p_offset int default 0)
returns table (id uuid, slug text, name_he text, tagline_he text, why_it_works_he text, hook_type_slug text,
               lifecycle public.trend_lifecycle, production_mode public.trend_production_mode, ad_safety public.trend_ad_safety,
               extra_gates public.trend_ad_safety[], requires_real_footage boolean, requires_people_consent boolean,
               default_duration_sec smallint, recommended_ad_goal public.ad_goal, niches text[], adaptation jsonb,
               demo_assets jsonb, published_at timestamptz, published_week text, expires_at timestamptz,
               peak_expected_at date, is_featured boolean, is_this_week boolean, niche_fit boolean, sort_order int)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
declare
  v_niche text;
  v_week  text := to_char(now() at time zone 'Asia/Jerusalem', 'IYYY"-W"IW');
begin
  if (select auth.uid()) is not null and not (public.can_access_workspace(p_ws) or public.is_platform_admin()) then
    return;                                                    -- no rows: nothing is learned about a foreign workspace
  end if;
  v_niche := coalesce(p_niche, (select w.niche_slug from public.workspaces w where w.id = p_ws));
  return query
    select t.id, t.slug, t.name_he, t.tagline_he, t.why_it_works_he, t.hook_type_slug, t.lifecycle, t.production_mode,
           t.ad_safety, t.extra_gates, t.requires_real_footage, t.requires_people_consent, t.default_duration_sec,
           t.recommended_ad_goal, t.niches,
           (select e.value from jsonb_array_elements(t.niche_adaptations) e where e.value->>'niche_slug' = v_niche limit 1),
           t.demo_assets, t.published_at, t.published_week, t.expires_at, t.peak_expected_at, t.is_featured,
           coalesce(t.published_week = v_week, false),
           coalesce(v_niche = any (t.niches), false),
           t.sort_order
    from public.trend_templates t
    where t.status = 'published' and (t.expires_at is null or t.expires_at > now())
    order by t.is_featured desc,
             coalesce(t.published_week = v_week, false) desc,
             coalesce(v_niche = any (t.niches), false) desc,
             case t.lifecycle when 'moment' then 0 when 'format' then 1 else 2 end,
             t.sort_order, t.published_at desc, t.id
    limit least(greatest(coalesce(p_limit, 24), 1), 48)
    offset greatest(coalesce(p_offset, 0), 0);
end $$;

-- cross-customer aggregates (pg_cron). No-op unless app_settings.cross_customer_benchmarks.enabled; skips opted-out workspaces.
-- paid rows are dated by the insight date; organic rows by the post's publish date (IL) and carry its latest cumulative snapshot.
create or replace function public.refresh_trend_template_stats(p_from date)
returns int
language plpgsql security definer set search_path = ''
as $$
declare
  v_enabled boolean := coalesce((select (s.value->>'enabled')::boolean from public.app_settings s
                                 where s.key = 'cross_customer_benchmarks'), false);
  v_from    date    := greatest(coalesce(p_from, current_date - 28), current_date - 90);
  v_rows    int     := 0;
begin
  if not v_enabled then return 0; end if;
  delete from public.trend_template_stats_daily d where d.date >= v_from;
  with paid as (
    select v.trend_template_id as template_id, w.niche_slug, i.date,
           count(distinct i.workspace_id)::int as businesses_count,
           sum(i.impressions)::bigint as impressions, sum(i.video_3s_plays)::bigint as video_3s_plays,
           sum(i.thruplays)::bigint as thruplays, sum(i.results)::bigint as results,
           sum(i.spend_ils)::numeric(12,2) as spend_ils
    from public.ad_insights_daily i
    join public.ad_variants v on v.id = i.variant_id
    join public.workspaces w on w.id = i.workspace_id
    where i.date >= v_from and v.trend_template_id is not null
      and w.niche_slug is not null and not w.benchmarks_opt_out and w.deleted_at is null
    group by 1, 2, 3
  ), organic as (
    select p.trend_template_id as template_id, w.niche_slug, (p.published_at at time zone 'Asia/Jerusalem')::date as date,
           count(distinct p.workspace_id)::int as businesses_count,
           sum(m.views)::bigint as organic_views,
           avg(m.skip_rate)::numeric(6,4) as organic_skip_rate_avg
    from public.social_posts p
    join public.workspaces w on w.id = p.workspace_id
    join lateral (select x.views, x.skip_rate from public.social_post_metrics x
                  where x.post_id = p.id order by x.captured_at desc limit 1) m on true
    where p.status = 'published' and p.trend_template_id is not null
      and (p.published_at at time zone 'Asia/Jerusalem')::date >= v_from
      and w.niche_slug is not null and not w.benchmarks_opt_out and w.deleted_at is null
    group by 1, 2, 3
  )
  insert into public.trend_template_stats_daily (template_id, niche_slug, date, businesses_count, impressions, video_3s_plays,
                                                 thruplays, results, spend_ils, organic_views, organic_skip_rate_avg)
  select template_id, niche_slug, date,
         greatest(coalesce(paid.businesses_count, 0), coalesce(organic.businesses_count, 0)),
         coalesce(paid.impressions, 0), coalesce(paid.video_3s_plays, 0), coalesce(paid.thruplays, 0),
         coalesce(paid.results, 0), coalesce(paid.spend_ils, 0), coalesce(organic.organic_views, 0),
         organic.organic_skip_rate_avg
  from paid full join organic using (template_id, niche_slug, date);
  get diagnostics v_rows = row_count;
  return v_rows;
end $$;

-- the only read path to the stats: aggregates of the last 28 days, only when enabled and at least k_min businesses
create or replace function public.trend_template_benchmark(p_template uuid, p_niche text)
returns table (template_id uuid, niche_slug text, days int, businesses_min int, impressions bigint, hook_rate numeric,
               hold_rate numeric, results bigint, cost_per_result_ils numeric, organic_views bigint, organic_skip_rate_avg numeric)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
declare
  v_cfg  jsonb := coalesce((select s.value from public.app_settings s where s.key = 'cross_customer_benchmarks'), '{}'::jsonb);
  v_kmin int;
begin
  if not coalesce((v_cfg->>'enabled')::boolean, false) then return; end if;
  v_kmin := greatest(coalesce((v_cfg->>'k_min')::int, 5), 5);
  return query
    select p_template, p_niche, count(*)::int, max(d.businesses_count)::int,   -- the daily max is a lower bound of distinct businesses
           sum(d.impressions)::bigint,
           round(sum(d.video_3s_plays)::numeric / nullif(sum(d.impressions), 0), 4),
           round(sum(d.thruplays)::numeric / nullif(sum(d.video_3s_plays), 0), 4),
           sum(d.results)::bigint,
           round(sum(d.spend_ils) / nullif(sum(d.results), 0), 2),
           sum(d.organic_views)::bigint,
           round(avg(d.organic_skip_rate_avg), 4)
    from public.trend_template_stats_daily d
    where d.template_id = p_template and (p_niche is null or d.niche_slug = p_niche)
      and d.date >= (now() at time zone 'Asia/Jerusalem')::date - 28
    having count(*) > 0 and max(d.businesses_count) >= v_kmin;
end $$;
```

### 6.7 RLS והרשאות

```sql
-- ===== 10. RLS on every new table; explicit privileges; all writes server-only =====
do $$
declare t text;
begin
  foreach t in array array['trend_references','trend_analyses','trend_templates','trend_template_uses',
                           'trend_template_stats_daily','guided_shoots'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- templates: the public read path of /trends (part 02 §15.3) and of the app. Retired templates that were once published stay
-- readable so /trends/[slug] keeps its URL with the "less hot" badge (part 02 §15, §11.5 here; R19 removes demo_assets → 404, §16.4).
grant select (id, slug, name_he, tagline_he, description_he, why_it_works_he, hook_type_slug, lifecycle, is_evergreen,
              production_mode, ad_safety, extra_gates, requires_real_footage, requires_people_consent, recipe, hook_variants,
              niche_adaptations, music_brief, required_overlays, shot_list, compliance_notes_he, platform_tone,
              default_duration_sec, default_goal, default_video_type, default_visual_style, default_music_mood,
              default_caption_preset, vo_mode, recommended_ad_goal, niches, first_seen_at, peak_expected_at, expires_at,
              publish_at, published_at, published_week, status, demo_assets, explainer, seo_title_he, seo_description_he,
              is_featured, sort_order, created_at, updated_at)
  on public.trend_templates to anon, authenticated;            -- not source_reference_id, do_not_copy, created_by, updated_by
create policy trend_templates_read_public on public.trend_templates for select to anon, authenticated
  using (status = 'published' or (status = 'retired' and published_at is not null));
create policy trend_templates_read_admin on public.trend_templates for select to authenticated
  using ((select public.is_platform_admin()));                 -- drafts in the studio; writes stay server-only

grant select on public.trend_references, public.trend_analyses to authenticated;
create policy trend_references_select_admin on public.trend_references for select to authenticated
  using ((select public.is_platform_admin()));
create policy trend_analyses_select_admin on public.trend_analyses for select to authenticated
  using ((select public.is_platform_admin()));

grant select on public.trend_template_uses, public.guided_shoots to authenticated;
create policy trend_template_uses_select_member on public.trend_template_uses for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy guided_shoots_select_member on public.guided_shoots for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
-- trend_template_stats_daily: no grants at all (read only through trend_template_benchmark)

-- ===== 11. function privileges (R9: explicit revoke for every function this file creates, then the grants) =====
revoke execute on function public.projects_trend_guard()                      from public, anon, authenticated;
revoke execute on function public.trend_same_workspace_guard()                from public, anon, authenticated;
revoke execute on function public.trend_feed(uuid, text, int, int)            from public, anon, authenticated;
revoke execute on function public.refresh_trend_template_stats(date)          from public, anon, authenticated;
revoke execute on function public.trend_template_benchmark(uuid, text)        from public, anon, authenticated;
grant  execute on function public.trend_feed(uuid, text, int, int)            to authenticated, service_role;   -- plan.month.v1 runs in a flow
grant  execute on function public.trend_template_benchmark(uuid, text)        to authenticated;
grant  execute on function public.refresh_trend_template_stats(date)          to service_role;
```

### 6.8 אחסון, pg_cron והבלוק של חלק 04

```sql
-- ===== 12. storage: private trend-refs (no policies at all: server-only, signed URLs from /api/admin/*); uploads + webm =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('trend-refs', 'trend-refs', false, 209715200, array['video/mp4','video/quicktime','video/webm','image/jpeg'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
update storage.buckets
   set allowed_mime_types = array['video/mp4','video/quicktime','video/webm','image/jpeg','image/png','image/webp','image/heic','image/heif']
 where id = 'uploads';                                         -- webm: in-app camera recordings, transcoded by guidedAutocut

-- ===== 13. pg_cron (1 new job; 14 after this file) =====
select cron.schedule('refresh-trend-stats', '50 4 * * *',
  $$select public.refresh_trend_template_stats((now() at time zone 'Asia/Jerusalem')::date - 28)$$);

-- ── part 04 block (hook score, §19.10); keep verbatim at the end of 0014_trends.sql ──
alter table public.project_versions
  add column hook_score jsonb
    check (hook_score is null
           or (jsonb_typeof(hook_score) = 'object'
               and case when (hook_score->>'score') ~ '^[0-9]{1,3}$' then (hook_score->>'score')::int <= 100 else false end));

-- writing the score must not bump updated_at: it is the ifUnmodifiedSince base of PATCH …/script (§19.5).
-- Same pattern as hooks (§9.1): set_updated_at fires only for the listed columns. A future column of
-- project_versions is added to this list on purpose, in the migration that adds the column.
drop trigger if exists set_updated_at on public.project_versions;
create trigger set_updated_at
  before update of project_id, version, script, storyboard, caption_track, voiceover_asset_id, moderation, source, created_by
  on public.project_versions for each row execute function public.set_updated_at();
-- no grant changes: authenticated has no UPDATE on project_versions, and its INSERT column grant (§12.2) does not list hook_score
```

- **האחסון:** `0014` לא יוצר policy ב-`storage.objects` ל-`trend-refs`. מדיניות האחסון של `0009` מסוננת לפי `bucket_id`, ולכן bucket חדש בלי policy סגור לכל מי שאינו הלקוח הסודי.
- **הספירות אחרי הקובץ:** 58 טיפוסי enum, 14 משימות pg_cron, 6 טבלאות חדשות (24 בהרחבה כולה), 3 פונקציות ציבוריות ועוד 2 פונקציות טריגר.

### 6.9 בדיקות pgTAP (`supabase/tests/12_trends_rls.sql`)

| מקרה | מצופה |
|---|---|
| `anon` קורא `slug, name_he` מ-`trend_templates`: `draft` / `review` / `scheduled` / `published` / `retired` עם `published_at` / `retired` בלי `published_at` | 0 / 0 / 0 / 1 / 1 / 0 שורות |
| `anon` או `authenticated` קוראים `source_reference_id`, `do_not_copy`, `created_by` או `updated_by` | שגיאת הרשאה על העמודה |
| משתמש רגיל קורא `trend_references` או `trend_analyses`; מנהל פלטפורמה עם `aal1` / עם `aal2` | 0 שורות; 0 / שורות |
| `select * from trend_template_stats_daily` ישיר | שגיאת הרשאה |
| `trend_template_benchmark(t, 'restaurants')` כש-`enabled = false` / `true` עם 4 עסקים / עם 5 | 0 / 0 / שורה אחת |
| `trend_feed(WB)` כחבר ב-A / `trend_feed(WA)` כחבר | 0 שורות (R39) / רק `published` שלא פגו, בלי `retired` ובלי שפגו |
| `trend_feed(WA)` כ-`service_role` | אותן שורות כמו לחבר |
| `trend_templates` עם `organic_only` ו-`recommended_ad_goal = 'lead_form'` | `23514` |
| `trend_templates` עם `format`, `status = 'published'` ובלי `expires_at` | `23514` (`trend_templates_expiry`) |
| `guided_shoots` ו-`trend_template_uses` של WB כחבר ב-A | 0 שורות |
| `trend_template_uses` עם `workspace_id` שונה מזה של הפרויקט (כ-`service_role`) | `INVALID_INPUT {reason:"cross_workspace"}` |
| עורך מכניס `projects` עם `trend_template_id` / מעדכן `production_mode` | `FORBIDDEN {reason:"server_managed_columns"}` בשניהם |
| `insert`/`update`/`delete` של `authenticated` על כל אחת מ-6 הטבלאות | שגיאת הרשאה |
| בעלים מעדכן `workspaces.benchmarks_opt_out` / עורך | מצליח / 0 שורות מתעדכנות |
| `scenes` עם `user_media_out_ms - user_media_in_ms = 400` | `23514` |
| allow-list (חלק 04 §25.2) | מוסיפה בדיוק את `trend_feed(uuid,text,int,int)` ואת `trend_template_benchmark(uuid,text)` ל-`authenticated` |
| `select jobname from cron.job where jobname = 'refresh-trend-stats'` | שורה אחת, `50 4 * * *` |
| עדכון `hook_score` בלבד ב-`project_versions` | `updated_at` לא משתנה |

### קריטריוני קבלה
- [ ] `pnpm db:reset` עובר, ו-`select count(*) from pg_type t join pg_namespace n on n.oid = t.typnamespace where n.nspname = 'public' and t.typtype = 'e'` מחזיר 58.
- [ ] כל שורות §6.9 עוברות ב-`supabase test db`.
- [ ] הבלוק של חלק 04 מופיע בסוף הקובץ כלשונו (בדיקת snapshot משווה אותו לטקסט של חלק 04 §2.3).
- [ ] משתמש מחובר, גם מנהל פלטפורמה, לא יכול לקרוא או לכתוב ב-`trend-refs` דרך ה-Storage API; העלאת `video/webm` ל-`uploads` עם שורת `assets` ממתינה מצליחה.

---

## §7. נתיבים וחוזי Zod (מפרט §E.2)

רשימת האב של הנתיבים היא חלק 04 §21b.4 (T1–T3, G1–G4) ו-§24.1 (A1–A11, עם פעולות הביקורת). כאן החוזים והלוגיקה. המוסכמות של חלק 04 §18 חלות כמו שהן: `route()`, Zod על כל קלט, מעטפת השגיאה, מעטפות ב-camelCase ו-DTO בשמות העמודות. `/api/trends*` מחזיר 404 בלי `details` כשהדגל `trends` כבוי, `/api/guided/*` כש-`guided_filming` כבוי; נתיבי האדמין פתוחים תמיד למנהל פלטפורמה עם `aal2`, ו-bucket ההגבלה שלהם הוא `admin`.

### 7.1 החוזים

```ts
// lib/api/contracts/trends.ts
export const TrendsQuery = z.object({
  niche: NicheSlug.optional(),                                  // default: the workspace niche (trends.feed.niche in localStorage overrides in the UI)
  lifecycle: z.enum(["moment", "format", "evergreen"]).optional(),
  cursor: z.string().regex(/^\d{1,4}$/).optional(),             // offset into trend_feed
});
export const TrendLifecycleBadgeValue = z.enum(["new", "peak", "classic", "ending", "retired"]);   // TrendLifecycleBadge (part 01)
export const DemoAssetDTO = z.object({
  niche_slug: NicheSlug, video_url: z.string().url(), poster_url: z.string().url(), vtt_url: z.string().url().nullable(),
  aspect: z.literal("9:16"), hook_score: z.number().int().min(0).max(100).nullable(),
});
export const TrendCardDTO = z.object({
  slug: z.string(), name_he: z.string(), tagline_he: z.string(), why_it_works_he: z.string(), hook_type_slug: z.string(),
  lifecycle: z.enum(["moment", "format", "evergreen"]), lifecycle_badge: TrendLifecycleBadgeValue,
  production_mode: z.enum(["ai", "guided", "hybrid"]), ad_safety: AdSafety, extra_gates: z.array(AdSafety),
  requires_people_consent: z.boolean(), default_duration_sec: z.number().int(),
  demo: DemoAssetDTO.nullable(),                                // the demo of the viewer's niche, else the first one
  fit_he: z.string().nullable(),                                // "מתאים לעסק שלכם כי…" (§11.2)
  niche_fit: z.boolean(), is_this_week: z.boolean(), expires_at: z.string().datetime({ offset: true }).nullable(),
  hook_score: z.number().int().min(0).max(100).nullable(),      // only while the hook_score flag is on (§11.4)
});
export const TrendFeedResponse = z.object({ items: z.array(TrendCardDTO), weekLabel: z.string(), nextCursor: z.string().nullable() });

export const TemplateAdEligibility = z.object({
  eligible: z.boolean(), reason: z.literal("organic_only_template").nullable(),
  gates: z.array(z.enum(["needs_consent", "needs_ai_label"])),    // what the campaign builder will ask for (part 07 §10.6)
});
export const TrendTemplateDTO = TrendCardDTO.extend({
  description_he: z.string(), vo_mode: z.enum(["none", "optional", "required"]), niches: z.array(NicheSlug),
  beats: z.array(z.object({ key: SlotKey, role: z.enum(TREND_ROLES), purpose_he: z.string(), seconds: z.number() })),   // scene beats only
  hook_variants: z.array(TrendHookVariantV1.pick({ key: true, hook_line_he_pattern: true, why_he: true })),
  required_overlays: z.array(z.enum(OVERLAY_KINDS)), shot_list: GuidedShotListV1.nullable(),
  compliance_notes_he: z.array(z.string()), platform_tone: z.object({ reels: z.string(), facebook: z.string() }),
  demo_assets: z.array(DemoAssetDTO), allowed_durations: z.array(z.number().int()),   // §9.3
  music_note_he: z.string().nullable(),                         // "בטרנד המקורי יש שיר מוגן…" when the analysis flagged music
  published_at: z.string().datetime({ offset: true }).nullable(),
});
export const TrendDetailResponse = z.object({
  template: TrendTemplateDTO, adaptation: TrendNicheAdaptationV1.nullable(), adEligibility: TemplateAdEligibility,
});

// admin (A1–A11)
const FILE_BASES = ["own_content", "licensed", "partner_permission", "customer_owned"] as const;
export const CreateTrendReferenceBody = z.object({
  sourcePlatform: z.enum(["tiktok", "instagram", "facebook", "youtube", "meta_ad_library", "tiktok_top_ads", "own", "other"]),
  sourceUrl: z.string().url().max(2048).startsWith("https://").optional(),
  rightsBasis: z.enum([...FILE_BASES, "public_youtube_url", "link_only_notes"]),
  rightsNote: z.string().trim().min(5).max(500),
  attest: z.boolean(),                                           // must be true → otherwise INVALID_INPUT {reason:"rights_required"}
  file: z.object({ mime: z.enum(["video/mp4", "video/quicktime", "video/webm"]), bytes: z.number().int().positive().max(209_715_200) }).optional(),
  adminNotesHe: z.string().trim().min(10).max(4000).optional(),
  observedAt: IsoDate.optional(), region: z.string().regex(/^[A-Z]{2}$/).optional(),
});
export const TrendTemplatePatchBody = TrendTemplateBase.partial().omit({ slug: true }).extend({   // the merged row is re-checked with TrendTemplateV1
  ifUnmodifiedSince: z.string().datetime({ offset: true }),
  explainer: TrendExplainerV1.nullable().optional(),
  demoAssetPaths: z.array(z.string().regex(/^trends\/[a-z0-9-]+\/[a-z0-9-]+-\d+\.mp4$/)).optional(),   // keep/reorder/remove only
});
export const DemoRenderBody = z.object({ nicheSlug: NicheSlug });
export const PublishTemplateBody = z.object({ publishAt: z.string().datetime({ offset: true }).optional() });
```

```ts
// lib/api/contracts/guided.ts
export const CreateGuidedShootBody = z.object({ projectId: Uuid });
export const GuidedShotBody = z.object({ assetId: Uuid, source: z.enum(["camera", "file"]) });
export const GuidedAttestBody = z.object({ peopleConsent: z.literal(true) });
export const GuidedShotEntry = z.object({
  shot_key: SlotKey, asset_id: Uuid, source: z.enum(["camera", "file"]), autocut: GuidedAutocutV1.nullable(),
});
export const GuidedShootDTO = z.object({
  id: Uuid, project_id: Uuid, template_id: Uuid.nullable(), status: z.enum(["planning", "shooting", "uploaded", "editing", "ready", "failed"]),
  shot_list: GuidedShotListV1, shots: z.array(GuidedShotEntry), people_consent_attested_at: z.string().datetime({ offset: true }).nullable(),
  required_shot_keys: z.array(SlotKey),                         // guided: every shot; hybrid: none (AI fallback)
  needs_people_consent: z.boolean(), clip_count: z.number().int(), credits_per_clip: z.number().int(),
  updated_at: z.string().datetime({ offset: true }),
});
export const GuidedAutocutResponse = z.object({ runId: z.string(), credits: z.number().int() });
```

### 7.2 הנתיבים של האפליקציה (T1–T3)

| # | הלוגיקה |
|---|---|
| T1 | הסביבה מ-`resolveWorkspace` (חלק 04 §17.3). `trend_feed(ws, niche, 48, cursor)` דרך הלקוח של המשתמש. כשיש `lifecycle`, הסינון נעשה בשרת, והנתיב קורא עמודים נוספים של 48 עד שיש 24 פריטים או שהפונקציה החזירה פחות מ-48. `nextCursor` הוא ה-offset שממנו ממשיכים. המיפוי ל-`TrendCardDTO` ב-`toTrendCard()` של `lib/trends/feed.ts` (§11.1). `weekLabel` = `app.trends.feed.weekLabel` עם טווח הימים ראשון–שבת של השבוע הנוכחי. `Cache-Control: private, max-age=60` |
| T2 | שורת התבנית דרך הלקוח של המשתמש (ה-RLS של §6.7). `draft`, `review`, `scheduled` או slug לא קיים ← 404 בלי `details`. `retired`, או `published` שעבר `expires_at` ← 404 `{reason:"retired"}` (בממשק: הקופי של חלק 03 §1.4 והקישור לפיד). `adaptation` = ההתאמה לנישת הסביבה או `null`. `adEligibility` מ-`templateAdEligibility()`: `organic_only` ← `eligible: false`; `gates` = `needs_consent` ו-`needs_ai_label` מתוך `ad_safety` ו-`extra_gates` |
| T3 | הזרימה של §9.2 בתוך `POST /api/projects` הקיים (חלק 04 §19.3) |

### 7.3 הנתיבים של הצילום המודרך (G1–G4)

| # | הלוגיקה |
|---|---|
| G1 | הפרויקט בסביבה ובתפקיד עורך ומעלה, עם `trend_template_id` של תבנית `guided` או `hybrid` (אחרת `INVALID_INPUT {reason:"production_mode_unavailable"}`). כשיש כבר צילום לפרויקט (`unique (project_id)`) ← 200 עם הקיים. אחרת `guided.shotlist.v1` (§13.5) מתאים את `shot_list` של התבנית לעסק; כשל או timeout של 15 שניות ← רשימת הצילומים של התבנית כמו שהיא. שורת `guided_shoots` עם `status = 'planning'` ← `201 { shootId, shotList }`. אירוע `guided_shoot_started {trend_slug}` |
| G2 | `shotKey` חייב להיות ב-`shot_list`; הנכס `upload_video` באותה סביבה, אחרי `complete`, עם `metadata.guided_shoot_id` ו-`metadata.shot_key` תואמים. הבדיקות לפי `probe`: `too_short` (קצר מ-`min_sec` פחות 0.3 שניות), `too_long` (ארוך מ-`max_sec` ועוד 30 שניות, ותמיד מעל 120 שניות; הנוסח `app.guided.errors.too_long`), `wrong_orientation` (רוחב גדול מגובה, או יחס שסוטה ביותר מ-15% מ-9:16). צילום חוזר לאותו שוט מחליף את הרשומה ב-`shots`, והנכס הקודם נשאר בספריית המדיה. `status`: `shooting` אחרי הראשון, `uploaded` כשכל השוטים הנדרשים קיימים. אירוע `guided_shot_uploaded {shot_key, source}` |
| G3 | ממלא `people_consent_attested_at` ו-`attested_by`, ורושם את ההצהרה גם ב-`brief.attestations` מסוג `people_on_camera_consent` (חלק 04 §19.3), באותה עזרה של שאר ההצהרות. הנוסח של תיבת הסימון ב-§14.3 |
| G4 | `Idempotency-Key` חובה. `missing_shots`: ב-`guided` חסר שוט נדרש; ב-`hybrid` אין אף שוט. `consent_required`: יש שוט עם `people_on_camera`, או שהתבנית `requires_people_consent`, ואין הצהרה. `credits` = `credit_costs['guided.autocut']` × מספר הקליפים; בדיקת יתרה בלבד, בלי שמירה (חלק 05 §19.1, כלל 5) ← `INSUFFICIENT_CREDITS`. `status = 'editing'`, `startFlow("guidedAutocut", { shootId }, { idempotencyKey: "guided:{shootId}:{key}" })` ← `202 { runId, credits }` |

### 7.4 הנתיבים של Trend Studio (A1–A11)

| # | הלוגיקה |
|---|---|
| A1 | `attest !== true` ← `rights_required`. בסיס של קובץ (`own_content`, `licensed`, `partner_permission`, `customer_owned`) בלי `file` ← `scraping_not_allowed`: אנחנו לא מורידים קובץ מקישור. בסיס של קישור עם `file` ← `INVALID_INPUT` עם `issues`. `public_youtube_url` בלי קישור YouTube תקין, או `link_only_notes` בלי `adminNotesHe` ← `issues`. אזהרת `TOPIC_BLOCKLIST` (§2.3) מוחזרת ב-`warnings`, בלי לחסום. עם קובץ ← `upload: { bucket: "trend-refs", path, signedUrl, token }` |
| A2 | הבדיקות של §2.2 (גודל, חתימה, משך, phash) ← `200 { reference }` |
| A3 | `assertTrendBudget` (§3.6); שורת `trend_analyses` ו-`startFlow("trendAnalyze", …)` ← `202 { analysisId }` |
| A4 | `{ analysis, hookPackage, frameUrls: { t_ms, url }[] }`, עם כתובות חתומות ל-10 דקות; אחרי `file_deleted_at` `frameUrls` ריק. בדיקת התקיעה של §3.1 |
| A5 | רק לניתוח `succeeded`. `trends.adapt.v1` (§13.2) ← `draftToTemplate` ← שער הסיכונים ← `TrendTemplateV1` ← שומר הדמיון ← שורת `draft` ← `201 { templateId }` |
| A6 | `ifUnmodifiedSince` מול `updated_at` ← `EDIT_CONFLICT`. מיזוג, `TrendTemplateV1` המלא, שומר הדמיון. `demoAssetPaths` רק מסנן או מסדר מחדש את הקיים, וקובץ שהוסר נמחק מ-`public-media`. בתבנית `published` או `retired`: `revalidateTag('trends', "max")` |
| A7 | עבודה בסביבה `ws-trends-studio` (§11.6) ← `202 { jobId }`. תבנית `guided` בלי צילום מוכן בסטודיו לאותה נישה ← `INVALID_INPUT {reason:"guided_footage_required"}` |
| A8 | `no_demo` בלי נכס הדגמה; `missing_explainer` בלי `explainer`; `TrendTemplateV1` ושומר הדמיון שוב. `publishAt` בעתיד ← `scheduled`; אחרת `published` עם `published_at = now()`, `published_week` (שבוע ISO, שעון ישראל) ו-`expires_at` לפי §5.4. `revalidateTag('trends', "max")` |
| A9 | `status = 'retired'`, `revalidateTag('trends', "max")`. הפרויקטים של הלקוחות לא משתנים |
| A10 | NDJSON של `StreamEvent` (חלק 05 §10), עם `trends.explainer.v1` (§13.3) על ההתאמות לנישה; האירוע `done` כולל `versionId: null` ו-`credits: 0`. הטיוטה נשמרת ב-`explainer`, והמנהל עורך אותה ב-A6 |
| A11 | §2.2, סעיף 5 ← 204 |

### 7.5 שגיאות ומפתחות קופי

רוב הסיבות של הנתיבים כאן כבר מנוסחות ב-`errors.*` של חלק 03 §1.4 (`rights_required`, `scraping_not_allowed`, `duplicate`, `too_short`, `wrong_orientation`, `missing_shots`, `consent_required`, `no_demo`, `missing_explainer`, `retired`). `too_long` מוצג בצילום ובאדמין בנוסח של §14 (`app.guided.errors.too_long`, `admin.trends.errors.too_long`). ארבע סיבות חדשות מקבלות נוסח ב-§14.5 ונרשמות בחלק 03: `guided_footage_required`, `production_mode_unavailable`, `MODERATION_BLOCKED.similarity` ו-`EDIT_CONFLICT.analysis_rejected`. `cross_workspace` של הטריגר היא סיבת הגנה שהממשק לא מגיע אליה (`INTERNAL_REASONS`).

### 7.6 ה-cron `trends-lifecycle` (`5 * * * *`, נעילה 10 דקות)

```ts
// lib/cron/trends-lifecycle.ts — returns { published, retired, weeklySent } (part 04 §23)
export async function trendsLifecycle(now = new Date()): Promise<CronResult> {
  if (!(await flagOn("trends"))) return { skipped: "nothing_to_do" };
  const published = await publishDue(now);      // scheduled with publish_at <= now → published; published_at = now; published_week = isoWeekIL(publish_at)
  const retired   = await retireExpired(now);   // published with expires_at <= now → retired
  for (const t of [...published, ...retired]) await audit(t.status === "published" ? "trend.template_publish" : "trend.template_retire",
                                                          { actorId: null, targetId: t.id, metadata: { source: "cron" } });
  if (published.length || retired.length) revalidateTag("trends", "max");
  const weeklySent = await sendTrendsWeeklyBatch(now);     // §15.2: ≤ 400 recipients per run, idempotent per recipient
  return { published: published.length, retired: retired.length, weeklySent };
}
```

- שתי הכתיבות הן `update … where status = … and publish_at <= now() returning id, status` בלקוח הסודי, כך שהרצה חוזרת לא מפרסמת פעמיים.
- הירידה השבועית: המנהל מתזמן ב-A8 ל-`trends_weekly_drop` הקרוב (ראשון 08:00 שעון ישראל), וה-cron של 08:05 מפרסם. `published_week` הוא שבוע ה-ISO של `publish_at`, ולכן גם תבנית שהתפרסמה באיחור של שעה נספרת לשבוע הנכון.

### 7.7 צעד 9 של `/api/cron/cleanup`

שורות `trend_references` עם `retention_until < now()` ו-`file_deleted_at is null` (עד 100 לריצה): מחיקה של כל הקבצים תחת `{reference_id}/` ב-`trend-refs`, `file_deleted_at = now()`, ו-audit `trend.reference_file_delete` עם `actor_id = null` ו-`metadata.source = 'cron'`. הניתוח נשאר.

### קריטריוני קבלה
- [ ] בדיקת כיסוי הנתיבים (חלק 04 §25.5) מוצאת את T1–T3, G1–G4 ו-A1–A11, כל אחד בנוי ב-`route()` ויש לו קובץ בדיקה.
- [ ] T1 עם `lifecycle=evergreen` מחזיר רק תבניות `evergreen`, 24 לכל היותר, ו-`nextCursor` שממשיך בלי כפילויות.
- [ ] T2 לתבנית `retired` ← 404 `{reason:"retired"}`; לתבנית `draft` ← 404 בלי `details`; ב-DTO אין `do_not_copy`, `source_reference_id` או `bait_concept_en`.
- [ ] G2 עם קליפ לרוחב ← `wrong_orientation`; עם קליפ של 130 שניות ← `too_long`; G4 בלי `Idempotency-Key` ← 400, ופעמיים עם אותו מפתח ← ריצה אחת.
- [ ] G4 עם שוט של אנשים ובלי G3 ← `consent_required`; אחרי G3 יש ב-`brief.attestations` רשומה מסוג `people_on_camera_consent`.
- [ ] `trends-lifecycle` פעמיים באותה שעה מפרסם תבנית מתוזמנת פעם אחת, רושם `trend.template_publish` עם `actor_id = null`, ומחזיר `{ published: 1, retired: 0, weeklySent }` ואז `{ published: 0, … }`.

---

## §8. שכבות הטרנד ב-Remotion (מפרט §J.5)

הקונטיינר `TrendOverlays` (חלק 05 §20.3) יושב בין `OverlayTexts` ל-`CaptionsLayer`, מקבץ שכבות זהות בסצנות עוקבות לרצף אחד, ומעביר לכל רכיב `overlay`, `scene`, `format`, `brand` ו-`transformAt`. כאן: הסכמה, איך תבנית במתכון הופכת לשכבה, המיקום, ו-11 הרכיבים. המראה (גופנים, גדלים, צבעים) הוא של חלק 01 §16.5, והאזורים של חלק 01 §16.3.

### 8.1 `SceneOverlayV1`

```ts
// lib/ai/schemas/trends.ts — overlays (not sent to a provider: discriminatedUnion is allowed here, part 05 §11.4)
export const OVERLAY_KINDS = ["sign", "fake_ui", "meme_caption", "bts_label", "split_reveal", "comment_bubble", "rating",
                              "pov_label", "clock", "sticker", "price"] as const;
export const STICKER_EMOJI = ["🫶", "❤️", "🔥", "👍", "😂", "🎉", "✨", "👏"] as const;
const Pt = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) });          // fraction of the frame
export const Quad = z.object({ tl: Pt, tr: Pt, br: Pt, bl: Pt });
const T = (max: number) => z.string().trim().min(1).max(max);
const Base = {
  fromMs: z.number().int().min(0).max(20_000),                 // relative to the scene start
  toMs: z.number().int().min(1).max(20_000).nullable(),        // null = to the scene end
  position: z.enum(["auto", "top", "center", "bottom"]),       // a request; overlayBox() keeps it inside the kind's zone
  style: z.literal("default").default("default"),              // one value in v1: the look of part 01 §16.5; reserved for variants
};
export const SceneOverlayV1 = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("sign"), textHe: T(40), quad: Quad.nullable(), quadSource: z.enum(["model", "preset", "user"]),
             presetQuad: Quad, ink: z.enum(["auto", "dark", "light"]), reveal: z.enum(["words", "static"]), ...Base }),
  z.object({ kind: z.literal("fake_ui"), variant: z.enum(["low_battery", "new_message", "order_arrived", "generic"]),
             titleHe: T(24), bodyHe: T(60), buttonsHe: z.array(T(14)).min(1).max(2), theme: z.enum(["light", "dark"]),
             tapAtMs: z.number().int().min(0).nullable(), ...Base }),
  z.object({ kind: z.literal("meme_caption"), textHe: T(40), emoji: z.string().max(8).nullable(), ...Base }),
  z.object({ kind: z.literal("bts_label"), textHe: T(24), ...Base }),
  z.object({ kind: z.literal("split_reveal"), before: z.object({ beatKey: SlotKey, sceneIndex: z.number().int().min(0).nullable() }),
             beforeSource: z.object({ kind: z.enum(["image", "video"]), src: z.string(), trim: z.object({ inMs: z.number(), outMs: z.number() }).nullable() }).nullable(),
             labelBeforeHe: T(12), labelAfterHe: T(12), dividerFromMs: z.number().int().min(0), dividerToMs: z.number().int().min(1), ...Base }),
  z.object({ kind: z.literal("comment_bubble"), leadHe: T(24).nullable(), textHe: T(60), source: z.enum(["generic", "real_with_permission"]), ...Base }),
  z.object({ kind: z.literal("rating"), mode: z.enum(["score", "verdict"]), scoreText: z.string().regex(/^\d{1,2}(\.\d)?\/10$/).nullable(),
             verdict: z.enum(["true", "false"]).nullable(), labelHe: T(24).nullable(), ...Base }),
  z.object({ kind: z.literal("pov_label"), prefix: z.literal("POV:"), textHe: T(40), ...Base }),
  z.object({ kind: z.literal("clock"), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), ...Base }),
  z.object({ kind: z.literal("sticker"), stickers: z.array(z.object({ emoji: z.enum(STICKER_EMOJI), atMs: z.number().int().min(0),
             anchor: Pt, sizePx: z.number().int().min(140).max(220) })).min(1).max(2), ...Base }),
  z.object({ kind: z.literal("price"), amountHe: T(24), labelHe: T(40).nullable(), strikeAmountHe: T(24).nullable(), ...Base }),
]);
export type SceneOverlayV1 = z.infer<typeof SceneOverlayV1>;
```

- כל שדה טקסט עברי מסתיים ב-`He`, ולכן `shekelOverlay()` (חלק 05 §20.2) מעביר אותו דרך `applyShekel` בלי רשימה ידנית. במחיר, `"349 ₪"` שבטקסט עובר לצורה של ערכת המותג (`shekel_format`, ברירת המחדל `prefix`).
- `split_reveal.beforeSource` קיים רק ב-props: ב-DB הוא `null`, ו-`buildPromoProps` ממלא אותו מהמדיה של הסצנה שה-`beatKey` שלה מצוין (תמונה, או וידאו עם ה-trim שלו).
- `scenes.overlay` נכתב רק בצד השרת (R7), נכנס ל-`scenes_digest` ונבדק במודרציה של עריכות כמו כל טקסט של סצנה.

### 8.2 תבנית שכבה במתכון (`SceneOverlayTemplate`)

במתכון השכבה היא תבנית (`SceneOverlayTemplate` ב-`lib/ai/schemas/trends.ts`, שנבנית מ-`SceneOverlayV1` עם `textTemplate()` על כל שדה `He`): אותה צורה, עם שני הבדלים. (1) שדה טקסט יכול להכיל `"$onscreen"` (הטקסט של `onscreen_slot` של אותו ביט) או `"$hook"` (שורת ההוק, רק ב-`pov_label`). (2) ב-`sign` `quad = null`, וב-`split_reveal` `sceneIndex = null`. כשבתבנית יש שני שדות שמצביעים על `"$onscreen"`, הטקסט מתפצל: ב-`fake_ui` בשבירת השורה (כותרת, ואז גוף), וב-`price` אחרי הסכום עם ₪ (`"{מחיר} ₪. וזה מה שמקבלים"` ← `amountHe = "{מחיר} ₪"`, `labelHe = "וזה מה שמקבלים"`).

### 8.3 מתבנית לשכבה (`lib/trends/overlays.ts`)

```ts
/** Called by applyTrendRecipe (part 05 §18.11) for each scene with a recipe overlay, and again after every overlayTexts edit. */
export function resolveOverlayTemplate(tpl: SceneOverlayTemplate, ctx: {
  slotText: string | null;           // the scene's onscreen text, already written by script/storyboard v2 from onscreen_slot
  hookText: string | null;           // scenes[0].onscreen_text_he before it is emptied
  sceneDurationMs: number; sceneIndexOf: (beatKey: string) => number | null;
}): { overlay: SceneOverlayV1; consumesOnscreen: boolean };
// consumesOnscreen = the template references "$onscreen" (or "$hook" on the hook scene): applyTrendRecipe then empties
// scenes.onscreen_text_he and sets text_position = 'none'; otherwise the scene keeps its onscreen text in OverlayTexts.

/** The editable text slots of each kind = the keys of ScenePatchBody.overlayTexts (part 04 §19.6), with their LENGTH_LIMITS. */
export const OVERLAY_TEXT_SLOTS = {
  sign: { sign_text: ["textHe", 40] },
  fake_ui: { popup_title: ["titleHe", 24], popup_body: ["bodyHe", 60] },
  meme_caption: { meme_caption: ["textHe", 40] },
  bts_label: { bts_label: ["textHe", 24] },
  split_reveal: {},
  comment_bubble: { comment_lead: ["leadHe", 24], comment_text: ["textHe", 60] },
  rating: { rating_label: ["labelHe", 24], rating_value: ["scoreText", 7] },
  pov_label: { pov_text: ["textHe", 40] },
  clock: { clock_time: ["time", 5] },
  sticker: { sticker_emoji: ["stickers.0.emoji", 2] },
  price: { price_amount: ["amountHe", 24], price_label: ["labelHe", 40] },
} as const satisfies Record<SceneOverlayV1["kind"], Record<string, readonly [string, number]>>;
```

- **עריכה:** העורך (חלק 03 §9.3) שולח `PATCH …/scenes/[sceneId] { overlayTexts: { sign_text: "…" } }`; המפתח חייב להיות מ-`OVERLAY_TEXT_SLOTS[overlay.kind]` (אחרת `overlay_slot_unknown`), והאורך נבדק מול המגבלה שבטבלה. `price_amount` עובר את שער העובדות (חלק 03 §6.12). שינוי הפינות של השלט נשמר עם `quadSource = "user"`.
- **התוויות בעורך** (חלק 03 §9.3): "טקסט על השלט", "כותרת ההודעה", "טקסט בהודעה", "כיתוב עליון", "שורת POV", "תווית", "התגובה", "שעה", "דירוג", "מחיר", "מדבקה".

### 8.4 מיקום: `zones.ts` ו-`overlayBox()`

`remotion/layers/trends/zones.ts` הוא נתונים בלבד: האזורים של חלק 01 §16.3 לכל `kind` ולכל פורמט (9:16, 1:1, 16:9), כאחוזים מהפריים. `overlayBox(overlay, format)` ב-`layout.ts` מחזיר את המלבן של השכבה: לפי `position` המבוקש, עם הצמדה לאזור המותר ולשולי הבטיחות. אותה פונקציה משמשת את הרכיבים, את `applyTrendRecipe` (מיקום מחוץ לאזור מוזז ונרשמת אזהרה) ואת בדיקת `safe_zones` של ציון ההוק (חלק 05 §24.2). כללי השילוב של חלק 01 §16.3 נאכפים ב-`applyTrendRecipe`:

1. שכבה אחת לסצנה, ותווית קבועה נחשבת שכבה.
2. `sign`, `meme_caption` ו-`pov_label` הם שורת ההוק של הסצנה: כשהם בסצנה 0, אין `HookTitle`.
3. בסצנה עם `fake_ui`, `price`, `comment_bubble` או `sticker` הכתוביות ננעלות ל-`lower`.
4. עד שתי שכבות טקסט על המסך בבת אחת, כולל `HookTitle` ותווית קבועה.

### 8.5 11 הרכיבים

כל הרכיבים: `direction: rtl`, `unicode-bidi: plaintext`, תנועה לפי מילה בלבד (אף פעם לא לפי אות, כי היא שוברת אותיות סופיות), `renderRich()` לטוקנים לועזיים ולמספרים (`"POV:"`, `"07:00"`, `"8/10"` בתוך `<bdi>`), ניגודיות דרך `onColor`/`ensureContrast`. **הגופנים, הגדלים, הצבעים והתנועה הם בדיוק אלה של חלק 01 §16.5**; הטבלה כאן מגדירה רק את ההתנהגות שהחלק הזה הוא הבעלים שלה. `reduceMotion` של ה-props מחליף כל תנועה ב-opacity של 120ms.

| רכיב | `kind` | התנהגות | במודעה |
|---|---|---|---|
| `SignOverlay` | `sign` | הטקסט על הדף הריק ב-`perspective` של CSS לפי ארבע הפינות; הפינות עוברות דרך `transformAt(frame)` כדי שהכתב יזוז עם ה-Ken Burns; עד 3 שורות, שבירה לפי מילים בלבד; `reveal = "words"` מתחיל ב-`fromMs` | כן |
| `FakeUiPopup` | `fake_ui` | חלון מערכת כללי: כותרת, גוף ו-1–2 כפתורים, בלי לוגו, אייקון או גופן של מערכת; ב-`tapAtMs` עיגול לחיצה של 200ms על הכפתור הראשון, והחלון נעלם ב-`toMs`; לא מוסיף אחוז סוללה, שעה או שם אפליקציה שלא הופיעו בטקסט | **לא** (`organic_only`) |
| `MemeCaption` | `meme_caption` | כיתוב עליון ואימוג׳י אחד לכל היותר, בסוף; Noto Color Emoji ברינדור בלבד (בנגן: אימוג׳י של המערכת) | כן |
| `BtsLabel` | `bts_label` | גלולה קבועה על כל הסצנות שב-`spans`, מצוירת פעם אחת לכל הרצף | כן |
| `SplitReveal` | `split_reveal` | התווית "לפני" בצד ימין, והתווית "אחרי" בצד שמאל; הצד הימני מציג את `beforeSource`, והקו זז בין `dividerFromMs` ל-`dividerToMs` | כן (תוצאה אמיתית בלבד) |
| `CommentBubble` | `comment_bubble` | שורת פתיחה ("לקוח שאל:") והתגובה; בלי שם, תמונה, לייקים או עיצוב של רשת | כן |
| `RatingStamp` | `rating` | `scoreText` ("8/10") או ✗/✓ כ-SVG עם התווית ("לא נכון", "ככה עושים נכון"); הטיה של עד 8° | כן |
| `PovLabel` | `pov_label` | `"POV:"` בבידוד LTR ואחריו השורה העברית, בפסקה עם `dir="rtl"` מפורש | כן |
| `ClockStamp` | `clock` | השעה בלבד, בבידוד LTR; הטקסט של הסצנה נשאר ב-`OverlayTexts` | כן |
| `StickerPop` | `sticker` | 1–2 מדבקות ב-`atMs`, בעוגן שנבחר; עוגן שנופל על פנים (לפי `focal_x`/`focal_y` של הסצנה) מוזז לאזור הפנוי הקרוב | כן |
| `PriceTag` | `price` | הסכום דרך `applyShekel` (לפי `brand_kits.shekel_format`) ושורת התווית מתחתיו; `strikeAmountHe` רק עם מחיר קודם אמיתי | כן (מחיר אמיתי בלבד) |

### 8.6 דגלי ציות מהשכבות

`overlayComplianceFlags(scenes)` (חלק 05 §21) מחשב דגלים מכל שכבה, והם מצטרפים ל-`script.compliance.flags` בבדיקה של `POST /generate`: `price` ← `price_claim`; `split_reveal` ← `results_claim` (ובנישה רפואית גם `before_after_medical`, שחוסם); `comment_bubble` עם `real_with_permission` ← `testimonial_requires_consent`; `fake_ui` עם מילת דחיפות ("נשארו", "אחרון", "רק היום") ← `urgency_must_be_true`. `fake_ui` עצמו מסמן את הפרויקט כ-`organic_only` בשער של חלק 07 §10.6 (`AD_NOT_ELIGIBLE {reason:"deceptive_ui"}`).

### 8.7 השלט: פינות, דיו וגופן

- **הפינות:** צעד ה-keyframe קורא ל-`trends.sign_quad.v1` (§13.4) אחרי שמירת התמונה. כשל, timeout של 20 שניות, מרובע לא קמור או שטח קטן מ-3% מהפריים ← `presetQuad` (ב-9:16: 24%–50% מהגובה ו-60% מהרוחב, במרכז), ו-`quadSource = "preset"` (חלק 05 §18.11). סצנת שלט על צילום של המשתמש מקבלת את ה-preset בלי קריאה.
- **הדיו (`ink = "auto"`):** `SignOverlay` מודד את הבהירות הממוצעת של ה-keyframe בתוך ה-quad (luma על 32×32 דגימות, פעם אחת לסצנה, בתוך `delayRender`). בהירות מעל 0.55 ← הדיו הכהה של חלק 01 §16.5; אחרת הגרסה לשלט כהה (לבן עם קו). `ink = "dark" | "light"` עוקף את המדידה.
- **הגופן:** `Amatic SC` במשקל 700, בגודל 56–140px לפי רוחב ה-quad ומספר השורות, ב-`caption-fonts.ts` לנגן וב-`remotion/fonts.ts` לרינדור (חלק 01 §5). איכות הגליפים העבריים נבדקת ב-M0 [M0-verify]; אם היא לא מספיקה, הגופן המחליף נקבע ב-`DECISIONS.md` ומוחלף רק כאן.

### קריטריוני קבלה
- [ ] snapshot של `renderStill` לכל אחד מ-11 הרכיבים ב-9:16, ב-1:1 וב-16:9, עם טקסט עברי ארוך במגבלה, בלי חריגה מהאזור של חלק 01 §16.3 (בדיקת `overlayBox` מול `zones.ts`).
- [ ] T1 מרונדר ל-3 נישות, והטקסט על השלט נכון בעברית, מיושר לדף ונע איתו בזמן ה-Ken Burns (קריטריון של M8, בדיקה ויזואלית של המייסד וגולדן של `renderStill` בפריים 0 ובפריים האחרון של הסצנה).
- [ ] T4 מרונדר ומסומן כפרסום רגיל בלבד: אין בו לוגו של מערכת הפעלה, ו-`adEligibility` שלו `eligible: false` (קריטריון של M8).
- [ ] שכבה עם `position: "bottom"` לשלט מוזזת לאזור של השלט, ונרשמת אזהרה לאדמין.
- [ ] `overlayTexts: { sign_text: "x".repeat(41) }` ← 400; `overlayTexts: { popup_title: "…" }` בסצנת שלט ← `overlay_slot_unknown`.
- [ ] במחיר `"349 ₪"` בערכת מותג עם `shekel_format = "prefix"`, `PriceTag` מציג "₪349", ו-`price_claim` נכנס לדגלים.

---

## §9. הזרימה "צרו את הטרנד לעסק שלי" (מפרט §J.6)

### 9.1 נקודות כניסה

כל כניסה מובילה ל-`/app/create?trend={slug}&mode=ai|guided&src=trend` (חלק 03 §6.0): הכפתורים **"צרו בקליק"** ו-**"צלמו בעצמכם"** בכרטיס הטרנד (פיד, עמוד טרנד, כרטיס "טרנד השבוע לתחום שלכם" בדף הראשי), ה-CTA של הדף הציבורי **"צרו את זה לעסק שלכם בלחיצה"** (אורח עובר דרך `/login?next=`), המייל `trends_weekly`, ופריט `trend` בתוכנית 30 יום (`?planItem=`). **"צרו בקליק"** מוצג רק כשהתבנית `ai` או `hybrid`; **"צלמו בעצמכם"** רק כשהיא `guided` או `hybrid` והדגל `guided_filming` דולק. אירוע `trend_use_clicked {trend_slug, production_mode}`.

### 9.2 יצירת הפרויקט (T3, `createProjectFromTrend` ב-`lib/trends/feed.ts`)

1. **בדיקות:** הדגל `trends`; התבנית `published` ולא אחרי `expires_at` (אחרת `NOT_FOUND {reason:"retired"}`); `productionMode = "guided"` דורש `guided_filming` ותבנית `guided` או `hybrid`, ו-`"ai"` דורש תבנית `ai` או `hybrid` (אחרת `INVALID_INPUT {reason:"production_mode_unavailable"}`); `projects_max` כרגיל.
2. **מצב הפרויקט:** תבנית `ai` ← `ai`; `guided` ← `guided`; `hybrid` עם `"guided"` ← `hybrid` (מה שצולם נכנס, השאר ב-AI); `hybrid` עם `"ai"` ← `ai`.
3. **ברירות מחדל, לפי הסדר:** קודם מהתבנית (`default_goal`, `default_video_type`, `default_duration_sec` אחרי §9.3, `default_visual_style`, `default_caption_preset`, `default_music_mood`, `no_voice = true` כש-`vo_mode = 'none'`), אחר כך מהנישה ומערכת המותג (חלק 04 §19.3). הנישה: `nicheSlug` מהבקשה, אחרת של הסביבה. תבנית עם `needs_ai_label` (ב-`ad_safety` או ב-`extra_gates`) יוצרת פרויקט עם `ai_label = true` (חלק 07 §21, חלק 06 §11.9), ואפשר לכבות את התווית רק לפרסום רגיל; הבונה של חלק 07 דורש אותה במודעה.
4. **ההוקים:** `hook_text_he` = הדוגמה `hook_line` של ההתאמה לנישה, ובלי התאמה — `hook_line_he_pattern` של גרסה `A`. הגרסאות `B`, `C`… נבחרות מראש ב-`brief.variant_hooks`, עד `limits.hook_variants_max − 1`; `hook_type_slug` של התבנית.
5. **הכתיבה:** הלקוח של המשתמש מכניס את שורת `projects` (ה-RLS והשומרים חלים), ואז הלקוח הסודי ממלא `trend_template_id` ו-`production_mode` (`projects_trend_guard` מתיר רק כתיבה של השרת) ומכניס שורת `trend_template_uses` (`niche_slug`, `hook_variant_keys`, `production_mode`). כשל בצעד השני ← מחיקת הטיוטה בלקוח הסודי ו-`INTERNAL_ERROR`.
6. **השלב:** הראשון שלא הושלם באשף הקיים, בדרך כלל `hook` (בלשונית "מהטרנד", חלק 03 §6.4). אין שלב חדש.

### 9.3 אורכים מותרים

`allowedDurations(template, plan)` = הערכים מתוך 15, 30, 45 ו-60 שלא עוברים את `limits.max_duration_sec` ושבהם `trendBeatPlan(recipe, d)` לא זורק `trend_recipe_duration`. ברירת המחדל היא `default_duration_sec` כשהיא מותרת, אחרת הקרוב אליה. שלב `style` מציע רק את הערכים האלה (`TrendTemplateDTO.allowed_durations`).

### 9.4 תסריט וסטוריבורד

`script.generate.v2` ו-`storyboard.generate.v2` (§13.7) מקבלים את `<trend_recipe>` ואת `<beat_plan>` של `trendBeatPlan()`:

```ts
// lib/trends/recipe-input.ts → the <trend_recipe> block (jsonTag), built from the template + the project
type TrendRecipeInput = {
  slug: string; name_he: string; production_mode: "ai" | "guided" | "hybrid"; vo_mode: "none" | "optional" | "required";
  beats: { recipe_key: string; role: "bait" | "payoff" | "reveal" | "cta"; seconds: number; purpose_he: string;
           visual_source: string; visual_prompt_en: string; motion_prompt_en: string; camera: string;
           transition_in: string; sfx: string | null;
           onscreen_slot: { key: string; max_chars: number } | null; vo_slot: { key: string; max_words: number } | null;
           overlay_kind: string | null; filmed: boolean }[];            // filmed = a guided shot exists (or will) for this beat
  niche: { slug: string; subject_en: string; setting_en: string; product_en: string | null;
           examples: Record<string, string>; vo_example_he: string | null; cta_type: string; notes_he: string | null } | null;
  hook_variant: { key: string; bait_en: string; hook_line_he: string };   // the variant of this project (siblings get B, C…)
  do_not_copy: string[];                                                  // sent to the model as "never write", never shown
  compliance_notes_he: string[];
};
```

- **מה המודל כותב:** טקסט לכל חריץ (עד `max_chars`, בהשראת הדוגמאות ולא העתקה שלהן), קריינות לכל חריץ קריינות (או ריק ב-`vo_mode = 'none'`), והפרומפטים של הסצנות אחרי מילוי החריצים. `B14`–`B16` (חלק 05 §11.3) בודקים סצנה לכל ביט, מעבר `cut` אחרי ביט `cut`, ומקור ויזואלי לפי המתכון.
- **אחרי השמירה:** `applyTrendRecipe(versionId)` (חלק 05 §18.11) מצמיד את השכבות דרך `resolveOverlayTemplate` (§8.3), את הצילומים ואת החיתוכים (§10.6), ואת `sfx_cues`.
- **העובדות:** מחיר, משך עבודה או מספר בחריץ עוברים את שער העובדות כמו כל טקסט (`detectFactSlots`): placeholder שלא מולא מעובדה של העסק חוסם את `POST /generate`.

### 9.5 אחרי הרינדור

דף הפרויקט (חלק 03 §8.1) מציע **"פרסמו כרילס"**, **"העלו לקמפיין"** ו-**"בדקו 3 הוקים"**. בתבנית `organic_only` הכפתור "העלו לקמפיין" מוחלף במשפט **"הפורמט הזה מתאים רק לפרסום רגיל, ולא יעלה לקמפיין."**. ב-`needs_ai_label` הבונה מבקש את התווית "נוצר באמצעות AI" (חלק 07 §10.6), וב-`needs_consent` את ההצהרה `people_on_camera_consent`. ציון ההוק של הגרסה מוצג כרגיל (חלק 03 §8.5).

### קריטריוני קבלה
- [ ] `/app/create?trend=bait-and-sign&mode=ai&src=trend` עם פרופיל שלם יוצר טיוטה אחת עם `trend_template_id`, `production_mode = 'ai'`, `video_type = 'reel_hook'`, `no_voice = true` ושורת `trend_template_uses` אחת, ונוחת בשלב `hook`.
- [ ] `mode=guided` לתבנית `bait-and-sign` ← `production_mode_unavailable`; `mode=ai` לתבנית `behind-the-viral` ← אותה שגיאה.
- [ ] בתוכנית עם `max_duration_sec = 30`, `allowed_durations` של `day-in-the-life` הוא `[15, 30]` רק אם `trendBeatPlan` מצליח בשניהם, אחרת `[30]`.
- [ ] בסטוריבורד של T1 יש 3 סצנות (`B14`); לסצנה השנייה `transition_in = "cut"` ו-`sfx = "impact"` (`B15`); אחרי `applyTrendRecipe` ה-`onscreen_text_he` שלה ריק וה-`overlay.textHe` שלה הוא הטקסט שהמודל כתב לחריץ `sign_text`.
- [ ] טקסט חריץ עם "{מחיר}" שלא מולא חוסם את `POST /generate` בשער העובדות.

---

## §10. ערכת הצילום המודרך ו-`guidedAutocut` (מפרט §J.7)

### 10.1 הזרימה

שלב `style` (חלק 03 §6.6) ← **"פתיחת ערכת הצילום"** ← `/app/projects/[projectId]/shoot` (דגל `guided_filming`) ← G1 יוצר את הצילום ואת רשימת הצילומים ← לכל שוט: **"צילום עכשיו"** או **"העלאת סרטון"** ← G2 ← הצהרה על אנשים בצילום (G3, רק כשצריך) ← **"עריכה אוטומטית"** (G4) ← מסך התקדמות ← חזרה לשלב `preview`, והסצנות של הצילומים כבר מלאות. המסכים והקופי ב-§14.3.

### 10.2 רשימת הצילומים המותאמת

`guided.shotlist.v1` (§13.5, `llm.script`, 0 קרדיטים) מקבל את `shot_list` של התבנית, את ההתאמה לנישה, את פרטי העסק ואת התסריט אם כבר קיים, ומחזיר `GuidedShotListV1` עם אותם מפתחות, אותו מספר שוטים ואותם `framing`, `ghost` ו-`people_on_camera`. רק `title_he`, `instruction_he`, `tips_he`, `intro_he` ו-`estimated_minutes` משתנים לעסק. ולידציה: מפתחות זהים, טווחי שניות שלא חורגים מאלה של התבנית ביותר מ-20%, `lint()` של חלק 05 §23.3. כשל ← הרשימה של התבנית.

### 10.3 הצילום בדפדפן

- **המצלמה:** `CameraGhostGuide` (חלק 01 §10.17.13) עם ה-`ghost` של השוט, `getUserMedia({ video: { facingMode: "environment", width: { ideal: 1080 }, height: { ideal: 1920 }, frameRate: { ideal: 30 } }, audio: true })`, ו-`MediaRecorder` עם סוג הקובץ הראשון שנתמך מתוך `video/mp4;codecs=avc1.42E01E,mp4a.40.2`, `video/mp4`, `video/webm;codecs=vp9,opus`, `video/webm`. ההקלטה נעצרת לבד ב-`max_sec + 5` שניות, ומונה השניות מסומן בירוק מ-`min_sec`.
- **ההרשאות:** רק בנתיב הזה `Permissions-Policy: camera=(self), microphone=(self)` (חלק 06 §15.3); בכל שאר האפליקציה הן חסומות. סירוב ← `common.camera.denied` והכפתור "העלאת סרטון".
- **העלאה מהטלפון:** `<input type="file" accept="video/*" capture="environment">`.
- **שתיהן** עוברות את ההעלאה החתומה הקיימת (`POST /api/uploads/sign` עם `kind: "upload_video"`, `guidedShootId`, `shotKey`, `captureSource`; TUS מעל 6MB), אחר כך `complete`, ואז G2.

### 10.4 `guidedAutocut({ shootId })` — הצעדים

| צעד | `maxRetries` | מה עושה |
|---|---|---|
| `transcode:{shotKey}` | 1 | webm, קודק שאינו H.264, או צד ארוך מעל 1920 ← `ffmpeg -i in -vf "scale='min(1080,iw)':-2,fps=30" -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out.mp4`; הקובץ מחליף את האובייקט של אותו נכס (אותו `assets.id`, `mime` ו-`probe` מתעדכנים), וה-webm נמחק |
| `transcribe:{shotKey}` | 2 | `stt.default` עם `language: "he"` (`verbose_json`), כדי שחיתוך לא ייפול באמצע מילה; קליפ בלי דיבור ← רשימה ריקה |
| `frames:{shotKey}` | 1 | 8 פריימים בפיזור שווה (`-vf "fps=8/{duration_s},scale=-2:540"`), כל אחד עם `t={ms}ms` |
| `cut:{shotKey}` | 1 | `guided.autocut.v1` (§13.6) על `llm.vision_frames` עם הפריימים, המילים, הוראות השוט, אורך היעד (§10.5) והגרסאות; ולידציה סמנטית: `in_ms < out_ms ≤ duration`, קטע של 500ms לפחות, טייקים ממוינים; כשל ← חיתוך דטרמיניסטי מאמצע הקליפ באורך היעד, עם האזהרה `"fallback"` |
| `apply` | 0 | כותב את `shots[].autocut`, ומריץ על הגרסה הנוכחית את החלק של `applyTrendRecipe` שמצמיד צילומים: `visual_source = 'user_media'`, `user_asset_id`, `user_media_in_ms` ו-`user_media_out_ms` (§10.5) |
| `charge` | 0 | `begin_spend` ומיד `commit_spend` עם `spend:flow:guidedAutocut:{runId}` ו-`guided.autocut` × מספר הקליפים (חלק 05 §19.1, כלל 5); אם היתרה ירדה בינתיים — התוצר נשמר בלי חיוב |
| `finish` | 0 | `status = 'ready'`; אירוע `guided_autocut_completed {clips}` |

- **תקיעה:** הדף בודק את הצילום כל 3 שניות דרך הלקוח של המשתמש. `editing` יותר מ-10 דקות מסומן `failed` בקריאה הבאה (שרת), עם **"נסו שוב"** ש-G4 שולח עם מפתח חדש. בלי חיוב, כי החיוב הוא רק בצעד `charge`.
- **פרטיות:** הפריימים והתמלול לא נשמרים; רק `GuidedAutocutV1` נשמר ב-`shots[]`. הקול של הקליפ לא נכנס לסרטון ב-MVP (`muted`, חלק 05 §20.4).

### 10.5 חיתוך, קצב וגרסאות הוק

- **אורך היעד** של קטע = `duration_ms` של הסצנה × `speed` של הביט (ברירת מחדל 1). `in_ms`/`out_ms` של המודל נבחרים סביב היעד, בתוך הטייק הטוב.
- **כמה ביטים משוט אחד** (למשל `chaos` ו-`chaos_more` ב-T2): כל ביט מקבל קטע משלו, ברצף ובלי חפיפה, לפי סדר הביטים.
- **הקצב בנגן:** `playbackRate = (out_ms − in_ms) / duration_ms` של הסצנה, בטווח **0.5–2.0**. ההאטה עד 0.5× היא של העורך (חלק 03 §9.3) ושל החיתוך האוטומטי; הקצב של `ClipLayer` לצילום עם trim בחלק 05 §20.4 מתעדכן לאותו טווח (רשום בחלק 05). קטע קצר מדי גם ב-0.5× ← `Freeze` על הפריים האחרון, כמו בקליפ.
- **גרסאות הוק בצילום:** `hook_windows[]` של `guided.autocut.v1` נותן לכל גרסה (`A`, `B`, `C`) קטע אחר של שוט ה-`bait` (למשל הרגע הכי רחב, הרגע שבו מכסים את העדשה, והפרצוף הרציני). הגרסאות האחיות משתמשות בקטע של הגרסה שלהן, וכשאין קטע מתאים — באותו קטע של `A` עם שורת הוק אחרת.

### 10.6 הסכמה של מי שמופיע

תבנית `requires_people_consent`, או שוט עם `people_on_camera`, מחייבים את G3 לפני G4. הנוסח של תיבת הסימון: **"כל מי שמופיע בצילומים אישר בכתב שאפשר לפרסם אותו, כולל עובדים. אין בצילומים ילדים."** ההצהרה נשמרת גם ב-`brief.attestations` (`people_on_camera_consent`), והשער של מודעות בודק אותה (חלק 07 §10.6).

### קריטריוני קבלה
- [ ] צילום מודרך של T2 עם 3 קליפים, אחד מהם webm מהמצלמה, עובר `guidedAutocut`, מתרנדר עם כתוביות בעברית ומוזיקה ברישיון, וה-webm מוחלף ב-MP4 באותו נכס (קריטריון של M8).
- [ ] G4 עם 3 קליפים ו-`guided.autocut = 1` מחייב 3 קרדיטים פעם אחת, רק בצעד `charge`; כשל מדומה ב-`cut` של קליפ אחד מסתיים בחיתוך דטרמיניסטי עם האזהרה `"fallback"` ובלי כשל של כל הצילום.
- [ ] קטע של 1.2 שניות לסצנה של 2 שניות מתנגן ב-0.6×; קטע של 0.8 שניות לאותה סצנה מתנגן ב-0.5× ואז `Freeze`.
- [ ] `chaos` ו-`chaos_more` של T2 מקבלים קטעים לא חופפים מאותו קליפ.
- [ ] הנתיב `/app/projects/[id]/shoot` שולח `Permissions-Policy: camera=(self), microphone=(self)`, ו-`/app/projects/[id]` לא.
- [ ] צילום ב-`editing` מלפני 11 דקות מוצג כ-`failed` עם "נסו שוב", בלי חיוב.

---

## §11. הפיד, ציון ההוק, המנוע השבועי והדפים הציבוריים (מפרט §J.8, §S.4)

### 11.1 הכרטיס (`toTrendCard` ב-`lib/trends/feed.ts`)

```ts
export function lifecycleBadge(t: { status: string; lifecycle: string; published_week: string | null; expires_at: string | null },
                               now: Date): TrendLifecycleBadgeValue {
  if (t.status === "retired") return "retired";                                   // "הטרנד הזה כבר פחות חם" (public pages only)
  if (t.expires_at && Date.parse(t.expires_at) - now.getTime() <= 7 * 86_400_000) return "ending";   // "נגמר בקרוב"
  if (t.published_week === isoWeekIL(now)) return "new";                          // "חדש השבוע"
  if (t.lifecycle === "evergreen") return "classic";                              // "קלאסיקה"
  return "peak";                                                                  // "בשיא": a moment/format between its first week and the last 7 days
}
```

- **`demo`:** ההדגמה של הנישה של הצופה, אחרת הראשונה ב-`demo_assets`. הכתובות דרך `publicMediaUrl()` (חלק 04 §13.4).
- **`fit_he`:** **"מתאים לעסק שלכם כי {angle}"**, כש-`{angle}` הוא `notes_he` של ההתאמה לנישה כשהוא קיים, אחרת ה-`purpose_he` של ביט ה-payoff. בלי התאמה לנישה: `null`, והכרטיס לא מציג את השורה.
- **התגים** (חלק 01 §10.17.12): `TrendLifecycleBadge` לפי `lifecycleBadge`; תג ההפקה **"AI מלא"** (`ai`), **"צילום מודרך"** (`guided`) או **"AI או צילום"** (`hybrid`); תג המודעה **"מתאים למודעה"** או **"רק לפרסום רגיל"** (`organic_only`).
- **הסדר בפיד** הוא של `trend_feed` (§6.6): מקודמים, הירידה של השבוע, התאמה לנישה, `moment` ← `format` ← `evergreen`, `sort_order`.
- **כרטיס "טרנד השבוע לתחום שלכם"** בדף הראשי (חלק 03 §5.10) הוא הפריט הראשון של `trend_feed` לנישת הסביבה, ב-`TrendCard variant="compact"`.

### 11.2 עמוד הטרנד באפליקציה (`/app/trends/[slug]`)

T2 מזין: סרטון ההדגמה (עם בורר נישה כשיש כמה), "למה זה עובד", ההתאמה לנישה ("ככה זה ייראה אצלכם" עם הדוגמאות לחריצים), שלוש גרסאות ההוק עם `why_he`, רשימת הביטים עם שניות, רשימת הצילומים בתבנית מודרכת, הערות הציות, משפט המוזיקה כשצריך, ושני כפתורי היצירה. המסך והקופי ב-§14.2.

### 11.3 המנוע השבועי "פירוק טרנד"

| מתי (שעון ישראל) | מה |
|---|---|
| ראשון עד חמישי | הצוות מוסיף סרטוני השראה (A1–A3), מכין 1–3 טיוטות (A5–A6), מרנדר הדגמות לשלוש נישות לפחות (A7) ומייצר "פירוק טרנד" (A10) |
| חמישי | בדיקה: הטקסטים, ציון ההוק של כל הדגמה, שומר הדמיון, הערות הציות, ותזמון ב-A8 ל-`trends_weekly_drop` הבא |
| ראשון 08:05 | `trends-lifecycle` מפרסם; `revalidateTag('trends', "max")` מרענן את `/trends`, `/trends/[slug]`, מפת האתר ותמונות ה-OG |
| ראשון, 08:05 ואילך | `trends_weekly` לבעלי הסכמת דיוור (§15); הרילס שלנו של "פירוק טרנד" יוצא מהחשבונות של {{BRAND_NAME}} |

- **"כל שבוע"** לא נכתב באתר עד ארבע ירידות רצופות (`published_week` של ארבעה שבועות רצופים, חלק 02 §1.2 ו-§15).
- **כמה בשבוע:** 1–3 תבניות. שבוע בלי תבנית חדשה הוא תקין: הפיד מציג את הקיימות, ו-`trends_weekly` לא נשלח.

### 11.4 ציון ההוק בכרטיס (מפרט §S.4)

- **המקור:** הציון של סרטון ההדגמה, כלומר `hook_score.score` של הגרסה שרונדרה ב-`ws-trends-studio`. הוא נשמר בתוך פריט ה-`demo_assets` (§11.6) כשההדגמה מועתקת, ו-`hook_score` של הכרטיס הוא הציון של ההדגמה שנבחרה.
- **התצוגה** (רק כשהדגל `hook_score` דולק): `HookScoreBadge` עם **"ציון הוק: {score} מתוך 100"**, ומתחתיו, כלשונה, השורה הקבועה **"הערכה לפי כללי הוקים — לא הבטחה לתוצאות."** (נספח E §19.5). בלי ציון (הדגמה ישנה) — בלי תג.
- **הסף לפרסום:** A8 מציג אזהרה כשהציון של הדגמה נמוך מ-60, ולא חוסם.

### 11.5 הדפים הציבוריים (`/trends`, `/trends/[slug]`; חלק 02 §15 הוא הבעלים של הקוד)

החלק הזה הוא הבעלים של התוכן והכללים; חלק 02 מרנדר:

- **המקור:** רק עמודות `TREND_PUBLIC_COLUMNS` דרך הלקוח הציבורי, עם ה-RLS של §6.7. `published` ו-`retired` עם `published_at`.
- **תוכן `/trends/[slug]`:** H1 = `name_he`; סרטון ההדגמה עם VTT; "למה זה עובד" (`why_it_works_he` ו-`explainer.why_it_works_he`); "איך עושים את זה" (`explainer.how_to_steps`); דוגמאות לנישות (`explainer.niche_examples`); הערות הציות, ובתבנית `organic_only` גם **"מתאים רק לפרסום רגיל"**; שאלות ותשובות (`explainer.faq`); ה-CTA **"צרו את זה לעסק שלכם בלחיצה"** ← `/app/create?trend={slug}&src=trend`.
- **SEO:** `<title>` = `explainer.seo_title_he` או `seo_title_he`; description באותו סדר; JSON-LD `VideoObject` (שם, תיאור, `thumbnailUrl` = הפוסטר, `contentUrl`, `uploadDate` = `published_at`, `duration` ב-ISO 8601), `HowTo` (השלבים) ו-`BreadcrumbList` (ראשי › טרנדים › השם); רשומה במפת האתר עם `lastmod` = `updated_at`; תמונת OG מהפוסטר.
- **פרש:** התג **"הטרנד הזה כבר פחות חם"**, בלי כפתור יצירה, עם קישור לטרנדים החדשים, וקוד 200. **`retired` בלי `demo_assets` מחזיר 404** — זה המצב שאחרי הסרה (R19, §16.4).
- **לעולם לא:** סרטון הייחוס, כתובת של `trend-refs`, שם או שם משתמש של יוצר, צילום או אודיו מהמקור, `do_not_copy` או `source_reference_id`.

### 11.6 הדגמות (`lib/trends/demos.ts`, `pnpm trends:demos`)

- **A7** יוצר בסביבה `ws-trends-studio` פרויקט מהתבנית עם `createProjectFromTrend` (נישה = `nicheSlug`), מאשר את התסריט ואת הסטוריבורד אוטומטית ומפעיל `POST /generate`. הקרדיטים מההענקה החודשית של הסטודיו (`grant:studio:{YYYY-MM}`, חלק 04 §16.3). בתבנית `guided` צריך צילום מוכן בסטודיו לאותה תבנית ונישה, אחרת `guided_footage_required`.
- **ה-finalize** של עבודה בסביבת הסטודיו עם `trend_template_id` (רשום בחלק 05 §18) קורא ל-`copyDemoAssets(jobId)`: הרינדור 9:16, הפוסטר וה-VTT מועתקים ל-`public-media/trends/{slug}/{niche_slug}-{n}.mp4|.jpg|.vtt`, ופריט נוסף ל-`demo_assets`: `{ niche_slug, video_path, poster_path, vtt_path, aspect: "9:16", project_id, version_id, hook_score, rendered_at }`. רינדור מעל 100MB (מגבלת `public-media`) לא מועתק, והאדמין רואה אזהרה.
- **`pnpm trends:demos [--slug=…] [--niches=3]`** מריץ את A7 לכל תבנית `draft` בלי הדגמות, על שלוש ההתאמות הראשונות שלה, ומחכה לסיום. תבניות `guided` מדולגות עם הודעה שצריך לצלם קודם בסטודיו.

### 11.7 נתונים בין לקוחות (כבוי)

`refresh_trend_template_stats` ו-`trend_template_benchmark` (§6.6) קיימים, אבל `cross_customer_benchmarks.enabled = false` עד [Counsel] על תנאי הפלטפורמה של Meta ועל הפרטיות (חלק 06 §11.16, חלק 07 §21). אם יאושר: רק מצרפים, `k_min` של 5 לפחות, גילוי במדיניות הפרטיות, ומתג `workspaces.benchmarks_opt_out` בהגדרות הסביבה (בעלים ומנהלים). בממשק אין שום מספר כזה עד אז.

### קריטריוני קבלה
- [ ] `lifecycleBadge` על חמישה fixtures מחזיר `new`, `peak`, `classic`, `ending` ו-`retired`, ותבנית `evergreen` שפורסמה השבוע מקבלת `new`.
- [ ] כרטיס עם ציון מציג "ציון הוק: 82 מתוך 100" ואת השורה הקבועה כלשונה (snapshot); עם הדגל `hook_score` כבוי — בלי תג.
- [ ] `/trends/[slug]` של תבנית שפרשה מחזיר 200 עם התג; אחרי A6 שמסיר את כל `demo_assets` — 404.
- [ ] `/trends/[slug]` מקבל Lighthouse ≥ 90 ולא מכיל מדיה של סרטון הייחוס (קריטריון של M8); `VideoObject`, `HowTo` ו-`BreadcrumbList` עוברים Rich Results Test.
- [ ] A7 לנישה `restaurants` של T1 מסתיים בפריט `demo_assets` עם `hook_score` מספרי, והקובץ זמין ב-`public-media/trends/bait-and-sign/restaurants-1.mp4`.

---

## §12. ה-seed: 12 תבניות הטרנד (מפרט §J.9)

### 12.1 הסקריפט והקובץ

`seed/trend_templates.json` נבנה רק מ-`seed/scripts/build_trends.py`, שמחזיק את הנתונים ואת אותם כללי TT01–TT27 של §5.6. לא עורכים את ה-JSON ידנית (`seed/README.md`).

```bash
python3 -I seed/scripts/build_trends.py                  # writes seed/trend_templates.json, then validates it
python3 -I seed/scripts/build_trends.py --check          # rebuilds in memory; fails on any diff or rule error (part of pnpm seed:sync)
python3 -I seed/scripts/build_trends.py --print-compact  # one template per line (the appendix of §18)
```

- **הבדיקות העבריות** מיובאות מ-`seed/scripts/build_seed.py` (`_hebrew_text_issues`: `HE001`, `HE004`, `HE023`, `HE024`, לוכסנים, "·", `→`, סימני כיווניות, "הכול"), ועליהן `HE026`, `HE027`, placeholders מהמילון, מיקום ה-₪ ופנייה ברבים.
- **הטעינה** (חלק 04 §16.1, שלב 14b): `pnpm seed:sync` מעתיק ל-`supabase/seed/data/trend_templates.json`, ו-`pnpm db:seed` מכניס ב-`insert_missing` לפי `slug`, עם `status = 'draft'`, `demo_assets = []`, `published_week = null` ו-`source_reference_id = null`. התבניות עוברות ל-`published` רק מהאדמין, אחרי רינדורי ההדגמה (§11.6) ואחרי "פירוק טרנד".
- **שמות התבניות** נשארים כמו במפרט. "POV" נשאר באותיות לטיניות, כי זה השם שבו הפורמט מוכר.

### 12.2 סיכום

| slug · שם | סוג הוק · מחזור · הפקה · מודעות · שניות | הביטים (שניות) | שכבות | התאמות לנישה |
|---|---|---|---|---|
| `bait-and-sign` · פיתיון ושלט (T1) | `pattern-interrupt` · format · ai · ad_safe · 15 | `bait 2.5 → cut → sign 7 → cta 5.5` | `sign`, `sticker` | restaurants, fitness-trainers, dentists, real-estate |
| `behind-the-viral` · מאחורי הקלעים (T2) | `behind-the-scenes` · format · guided · needs_consent · 30 | `label → chaos 3.5 → chaos_more 7 → result 7.5 → team 6 → cta 6` | `bts_label` | restaurants, event-photographers, beauty-nails, fitness-trainers |
| `almost-got-me-reveal` · כמעט נפגעתי (T3) | `pattern-interrupt` · format · ai · needs_ai_label · 15 | `bait 3.5 → cut → reveal 6 → cta 5.5` | `meme_caption` | ecommerce, movers-storage, restaurants, retail-stores |
| `fake-system-popup` · התראה מזויפת (T4) | `pattern-interrupt` · format · hybrid · **organic_only** · 15 | `bait 3.5 → cut → closeup 6 → cta 5.5` | `fake_ui` | restaurants, catering-chefs, zimmers-boutique-hotels |
| `pov-deadpan` · POV | `pov` · evergreen · hybrid · ad_safe · 15 | `label → situation 3.5 → reaction 4 → twist 4 → cta 3.5` | `pov_label` | renovation-contractors, dentists, restaurants |
| `before-after-snap` · לפני ואחרי | `before-after` · evergreen · guided · ad_safe · 15 | `before 2 → cut → after 5 → split 4.5 → cta 3.5` | `split_reveal` | barbers-salons, home-services, auto-services, renovation-contractors, vets-dog-grooming |
| `day-in-the-life` · יום בחיים של… | `day-in-life` · evergreen · guided · needs_consent · 30 | `open 2.5 → prep 2.5 → first_customer 3 → craft 3 → busy 3 → closing 3 → reflection 7 → cta 6` | `clock` | restaurants, fitness-trainers, beauty-nails, event-venues |
| `asmr-process` · תהליך מספק | `satisfying-visual` · evergreen · guided · ad_safe · 15 | `raw 3 → process1 3 → process2 3 → finished 3 → cta 3` | — | catering-chefs, beauty-nails, auto-services, retail-stores |
| `myth-vs-fact` · מיתוס מול עובדה | `myth-busting` · evergreen · hybrid · ad_safe · 30 | `myth 3.5 → cut → verdict 6.5 → why 8 → tip 6 → cta 6` | `rating` | accountants, dentists, fitness-trainers, mortgage-advisors |
| `reply-to-comment` · עונים לתגובה | `question` · evergreen · hybrid · ad_safe · 30 | `comment 3.5 → answer 8 → example 7.5 → tip 6 → cta 5` | `comment_bubble` | lawyers, insurance-agents, interior-design, renovation-contractors |
| `price-reveal` · כמה זה עולה באמת | `price-reveal` · evergreen · ai · ad_safe · 15 | `number 3 → breakdown 5 → offer 3.5 → cta 3.5` | `price` | restaurants, home-services, real-estate, beauty-nails |
| `quick-how-to` · מדריך מהיר | `how-to` · evergreen · hybrid · ad_safe · 30 | `promise 3.5 → tip1 7 → tip2 7 → tip3 7 → cta 5.5` | `clock` | home-services, physio-nutrition, vets-dog-grooming, accountants |

סך הכול: 3 תבניות `ai`, 4 `guided`, 5 `hybrid`; תבנית `organic_only` אחת; 47 התאמות לנישה; לכל תבנית 3 גרסאות הוק עם פיתיונות שונים, `music_brief`, הערות ציות ו-`do_not_copy`. ב-T1–T4 `do_not_copy` מונה את הטקסטים, האנשים, המותגים והאודיו של סרטון הייחוס, כולל התרגום העברי של השלט ושל הכיתוב.

### 12.3 סטיות מכוונות מטבלת המפרט

| איפה | במפרט | ב-seed | למה |
|---|---|---|---|
| T1, fitness-trainers | "תתחילו להתאמן. זה פחות כואב מזה" | "בואו להתאמן. התירוצים נשארים בחוץ" | פנייה בגוף שני ליד "כואב" נתפסת ב-`HE026`, והתבנית מתאימה למודעה |
| T1, restaurants | "…אנחנו בחולון" | "…אנחנו ב{עיר}" | עיר אמיתית של העסק, לא דוגמה קבועה |
| T4, הווריאנטים | "האוכל שלך הגיע", "סוללה חלשה · נותרו 10%" | כותרת "ההזמנה הגיעה" וגוף "בתיאבון"; כותרת "סוללה חלשה" וגוף "כדאי לחבר למטען" | פנייה ברבים בלבד; "·" אסור בטקסט של seed; אחוז סוללה הוא הביטוי של סרטון הייחוס |
| T6, ביט ה-before | "before < 1 s" | 2 שניות ב-1.5× | `trendBeatPlan` מגביל את ביט ההוק ל-2–3.5 שניות (חלק 05 §12.2); ההאצה שומרת על התחושה |
| T2 | `label + wide chaos → result → cta` | גם ביט `team` של הצוות, ו-cta בכרטיס מותג | 30 שניות מחייבות ביט נוסף (עד 8 שניות לביט); שלושה קליפים בדיוק, כמו בקריטריון של M8 |
| T11 | "big number at 1 s" | התג נכנס ב-0.3 שניות | הבדיקה `text_by_500ms` של ציון ההוק (חלק 05 §24) |
| T12 | `clock` אופציונלי | `clock` במתכון | הטיימר הוא חלק מההבטחה "ב-20 שניות"; אפשר למחוק אותו בעורך |
| תווית AI | "צולם ב-AI" (§J.10) | "נוצר באמצעות AI" | הנוסח הקבוע של `AiLabel` (חלק 05 §21.7, חלק 01) |

### קריטריוני קבלה
- [ ] `python3 -I seed/scripts/build_trends.py --check` עובר בלי שגיאות ובלי אזהרות, ונכשל כשמשנים תו אחד ב-JSON.
- [ ] `pnpm db:seed` פעמיים מכניס 12 שורות `draft` פעם אחת, ולא דורס תבנית שהאדמין ערך.
- [ ] `TrendTemplateSeed.parse` (`lib/trends/seed-schema.ts`) עובר על כל שורה, והסדר של המפתחות זהה ל-`TREND_TEMPLATE_KEY_ORDER`.
- [ ] בדיקת יחידה: אף מחרוזת ב-JSON לא מכילה את הביטויים של `do_not_copy` של אותה תבנית (שומר הדמיון) ואף ביטוי מ-`RESULTS_BANNED_PHRASES`.

---

## §13. הפרומפטים (הטקסט המלא)

המבנה של חלק 05 §8: `PromptTemplate` מלא, `system` סטטי בעברית בלי משתנים, כל קלט בתוך `tag()`/`jsonTag()` אחרי `sanitizeForPrompt`, ו-`sys.hebrew_style.v1` כבלוק הראשון בכל תבנית שכותבת עברית (`trends.sign_quad.v1` מקבלת את `#core` בלבד). כל התבניות כאן מצהירות `ownerPart: "08"`. תבנית עם חלקי מדיה (`media(input)`) מוגדרת עם `transport: "fetch"` (חלק 05 §4.7).

| תבנית | נתיב | `ai_task` | טמפ׳ | `maxOutputTokens` | קלט מקס׳ (תווים) | קרדיטים |
|---|---|---|---|---|---|---|
| `trends.analyze.v1` | `llm.video` ← `llm.vision_frames` | `llm_trend_analysis` | 0.2 | 4,000 | 12,000 + מדיה | 0 (`trends.analyze`, צוות בלבד) |
| `trends.adapt.v1` | `llm.script` | `llm_trend_template` | 0.6 | 6,000 | 16,000 | 0 (צוות בלבד) |
| `trends.explainer.v1` | `llm.script` | `llm_trend_template` | 0.5 | 2,500 | 12,000 | 0 (צוות בלבד) |
| `trends.sign_quad.v1` | `llm.cheap` (קלט תמונה) | `llm_utility` | 0 | 300 | 1,000 + תמונה | 0 |
| `guided.shotlist.v1` | `llm.script` | `llm_guided` | 0.5 | 1,500 | 6,000 | 0 (`guided.shotlist`) |
| `guided.autocut.v1` | `llm.vision_frames` | `llm_guided` | 0.1 | 900 | 5,000 + 8 פריימים | 1 לקליפ (`guided.autocut`, נגבה בצעד `charge`) |
| `script.generate.v2` · `storyboard.generate.v2` | של v1 | של v1 | של v1 | של v1 | של v1 + 6,000 | של v1 |

### 13.1 `trends.analyze.v1`

**System:**

```text
אתם מנתחים סרטונים קצרים עבור צוות התוכן של שירות שמפיק סרטונים לעסקים קטנים בישראל. אתם מקבלים סרטון השראה אחד — קליפ של השניות הראשונות, פריימים עם חותמת זמן, עובדות מדודות ותמלול, או רק הערות של הצוות — ומחזירים ניתוח מופשט של הפורמט לפי הסכמה trend_analysis_v1.

המטרה היא להבין למה הפורמט עובד ואיך הוא בנוי, כדי ליצור פורמט דומה עם תוכן חדש לגמרי. מעתיקים מבנה, לא ביטוי.

כללים:
1. זמנים: השתמשו בעובדות שב-<measured> (חיתוכים, שיאי עוצמה, שקטים) ובחותמות t=…ms שלפני כל פריים. אל תמציאו זמן שלא נמדד. כש-<timing_estimated> הוא true, הערכה סבירה מותרת.
2. כל שדה שמסתיים ב-_en נכתב באנגלית ובתיאור כללי ("a deadpan man holding a blank sheet"): בלי שם, בלי שם משתמש, בלי מותג ובלי ציטוט.
3. text_original ו-first_line_original: מה שכתוב או נאמר בדיוק, בשפת המקור. הם משמשים רק לבדיקת דמיון. text_en ו-first_line_en: תרגום נאמן.
4. mechanics_en: 2 עד 6 משפטים על למה זה עובד (פער סקרנות, הפתעה, הזדהות, קצב), בלי לחזור על הטקסט של הסרטון.
5. beats: הרצף המופשט, והראשון תמיד bait. cut הוא מעבר חד ו-label הוא טקסט קבוע מעל כמה ביטים; לשניהם duration_ms 0.
6. hook_type: רק אחד מהערכים שב-<hook_types>.
7. niche_fit: עד 8 נישות מתוך <niches> שבהן הפורמט יעבוד, עם angle_he: משפט קצר בעברית שאומר איך עסק בנישה משתמש בו.
8. production: האם צריך אדם מול המצלמה, האם אפשר להפיק הכול ב-AI בלי להטעות את הצופה, ואילו שוטים בעל עסק יכול לצלם לבד בטלפון.
9. risk_flags: סמנו כל ערך שמתאים. creator_face ו-creator_voice: היוצר מזוהה. minor: ילד או נער. political_or_war: פוליטיקה, בחירות, מלחמה, חטופים, צבא, טרור או ימי זיכרון. testimonial_format: המלצה של לקוח או ראיון רחוב. deceptive_ui: התראה, הודעה או כפתור מזויפים. בספק — סמנו.
10. ad_safety_suggestion: organic_only כשיש deceptive_ui; needs_consent כשהפורמט בנוי על אנשים אמיתיים; needs_ai_label כשסכנה או אירוע נראים אמיתיים; אחרת ad_safe.
11. do_not_copy: באנגלית, כל מה שמזהה את הסרטון הזה: הטקסטים המדויקים, האנשים והמראה שלהם, המקום, המותגים, השיר וקטעים מיוחדים.
12. format_name_he: שם קצר לפורמט בעברית, עד 4 מילים, שאינו תרגום של כיתוב מהסרטון.
```

```ts
buildUser: (i) => [
  jsonTag("measured", i.facts),                          // { duration_ms, cuts_ms, loudness_peaks_ms, silences_ms, frames_ms } | null
  jsonTag("timing_estimated", i.source !== "file"),
  tag("transcript", sanitizeForPrompt(i.transcript ?? "", 3000)),
  tag("admin_notes", sanitizeForPrompt(i.adminNotes ?? "", 4000)),
  jsonTag("hook_types", i.hookTypeSlugs), jsonTag("niches", i.activeNicheSlugs),
  "נתחו את הסרטון לפי הסכמה trend_analysis_v1.",
].join("\n\n"),
media: (i) => i.source === "youtube" ? [youtubePart(i.youtubeUrl).part]
  : [...i.videos.map((v) => videoPart(v, i.budget)), ...i.frames.flatMap((f) => timedFrameParts(f.tMs, f.jpeg))],
validate: (o, i) => [...timingRules(o, i.facts), ...englishOnly(o), ...knownHookType(o), ...knownNiches(o)],   // §3.4 item 5
```

### 13.2 `trends.adapt.v1`

**System:**

```text
אתם עורכי תוכן בכירים בשירות שמפיק סרטונים קצרים בעברית לעסקים קטנים בישראל. אתם מקבלים ניתוח מופשט של פורמט ויראלי ומחזירים טיוטה של תבנית טרנד לפי הסכמה trend_template_draft_v1. הצוות יערוך אותה לפני פרסום.

העיקרון: מעתיקים את הפורמט — המבנה, הקצב, סוג הפיתיון והשכבות — ולעולם לא את הביטוי. הטקסטים, הרעיונות לפיתיון, האנשים והמקומות חדשים לגמרי.

כללים:
1. אל תכתבו אף ביטוי מ-<do_not_copy> ומהטקסטים של הניתוח, גם לא בתרגום לעברית, ואל תתארו את האנשים, המקום, המותגים או השיר שמופיעים שם.
2. beats: הראשון bait והאחרון cta. ביט סצנה: bait בין 2,000 ל-3,500 ms, השאר בין 1,500 ל-8,000, בכפולות של 500, וסכום קרוב ל-default_duration_sec. cut: duration_ms 0 ו-transition_in "cut", בין שני ביטי סצנה, ולסצנה שאחריו transition_in "cut" ואותו sfx. label: duration_ms 0, overlay_kind bts_label או pov_label, ו-spans עם מפתחות של ביטי סצנה רצופים.
3. visual_source: ai_clip לתנועה, ai_image_kenburns לתמונה, user_media לצילום של העסק, brand_card לכרטיס סיום. visual_prompt_en ו-motion_prompt_en באנגלית, עם {subject_en}, {setting_en}, {product_en} ו-{bait_en} (האחרון רק בביט ה-bait). אף פעם לא טקסט, אותיות, שלט כתוב או לוגו בפריים: הטקסט העברי מתווסף אצלנו כשכבה.
4. שכבות: overlay_kind מתוך הרשימה, אחת לסצנה לכל היותר. כשהשכבה מציגה את הטקסט של הביט, overlay_text_he הוא "$onscreen". sign: על תמונה עם camera static, ובפרומפט דף ריק לגמרי מול המצלמה. fake_ui רק כש-ad_safety הוא organic_only. price רק עם "{מחיר} ₪". split_reveal רק עם צילום אמיתי של "לפני".
5. onscreen_slot_key: הביט הראשון hook_line. טקסט על המסך עד onscreen_max_chars ועד 8 מילים; על שלט עד 40 תווים; בהתראה כותרת עד 24, שבירת שורה וגוף עד 60.
6. hook_variants: 3 עד 5, עם bait_concept_en שונים בתמונה ולא רק במילים, ו-hook_line_he_pattern שעומד בכללי hook_line.
7. niche_adaptations: 3 עד 6 נישות מתוך niche_fit, עם subject_en, setting_en ו-product_en באנגלית, ודוגמה בעברית לכל חריץ טקסט.
8. production_mode: ai כשאפשר להפיק הכול בלי אנשים אמיתיים; guided כשהפורמט בנוי על העסק האמיתי או על אנשים אמיתיים; hybrid כשאפשר בשתי הדרכים. אנשים אמיתיים מחייבים guided ו-needs_consent. אין אנשי AI שמדברים למצלמה, אין ילדים ואין המלצה או ראיון מומצאים.
9. אמת: מחיר, משך, מספרים ודחיפות רק כ-placeholder ({מחיר}, {זמן}, {מספר}), כדי שהעסק ימלא עובדה. אין הבטחה לתוצאה ואין "ויראלי".
10. עברית טבעית ועכשווית, פנייה ברבים או ניטרלית, בלי לוכסנים, ו-₪ אחרי ה-placeholder ("{מחיר} ₪").
11. music_brief: מצב רוח, BPM ונקודת דרופ, לעולם לא שם של שיר. sfx_cues = ה-sfx של ביטי הסצנה.
12. compliance_notes_he: 2 עד 6 הערות קצרות. כש-ad_safety הוא organic_only, ההערה הראשונה היא בדיוק: "הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים."
13. do_not_copy: העתיקו את הרשימה מהניתוח והוסיפו מה שחסר, באנגלית.
14. seo_title_he עד 60 תווים, seo_description_he בין 50 ל-155, בלי "ויראלי" ובלי הבטחות.
```

```ts
buildUser: (i) => [
  jsonTag("analysis", stripOriginals(i.analysis)),       // TrendAnalysisV1 without text_original / first_line_original
  jsonTag("do_not_copy", i.doNotCopy), jsonTag("risk_decisions", i.gateDecisions),   // §3.5: consent, organic_only, AI people blocked
  jsonTag("allowed", { overlay_kinds: OVERLAY_KINDS, niches: i.activeNicheSlugs, placeholders: HOOK_PLACEHOLDERS }),
  jsonTag("timing_estimated", i.timingEstimated),
  "כתבו טיוטת תבנית לפי הסכמה trend_template_draft_v1.",
].join("\n\n"),
validate: (o, i) => [...draftToTemplateIssues(o, i), ...similarityIssues(o, i), ...lintHe(o)],   // §5.5–§5.7
```

### 13.3 `trends.explainer.v1` ("פירוק טרנד")

**System:**

```text
אתם כותבים את "פירוק טרנד": עמוד ציבורי קצר וסרטון קצר שמסבירים לבעלי עסקים קטנים בישראל פורמט אחד שעובד עכשיו ברשתות, ואיך עושים אותו לעסק שלהם. אתם מקבלים את התבנית ומחזירים trend_explainer_v1.

כללים:
1. intro_he: 2–3 משפטים, מה רואים בסרטון ולמה הוא עוצר את הגלילה. בלי שם של יוצר, בלי תיאור של סרטון מקורי ובלי "ויראלי".
2. why_it_works_he: שלוש נקודות קצרות, מתוך why_it_works_he של התבנית ומ-hook_type.
3. how_to_steps: 3 עד 6 שלבים מעשיים לפי הביטים, כל אחד עם name_he קצר ו-text_he שאפשר לעשות; seconds לפי הביט, או null.
4. niche_examples: לכל נישה ב-<adaptations> דוגמה אחת, במשפט, מתוך הדוגמאות שלה.
5. compliance_notes_he: ההערות של התבנית בניסוח לקהל, ובתבנית organic_only גם "מתאים רק לפרסום רגיל".
6. faq: 3 עד 5 שאלות שבעל עסק ישאל (מוזיקה, צילום, כמה זמן זה לוקח, אם זה מתאים למודעה), עם תשובות נכונות לפי התבנית. אין מחיר ואין הבטחה לתוצאה.
7. reel: hook_he אחד, 3–4 משפטים קצרים לביטים, ו-cta_he בדיוק "צרו את זה לעסק שלכם בלחיצה".
8. seo_title_he עד 60 תווים ו-seo_description_he בין 50 ל-155.
9. פנייה ברבים או ניטרלית, עברית טבעית, בלי סימני קריאה.
```

```ts
buildUser: (i) => [
  jsonTag("template", pickPublic(i.template)),           // TREND_PUBLIC_COLUMNS + recipe beats (key, role, purpose_he, seconds)
  jsonTag("adaptations", i.template.niche_adaptations.map((a) => ({ niche_slug: a.niche_slug, examples: a.onscreen_examples_he, notes_he: a.notes_he }))),
  "כתבו את פירוק הטרנד לפי הסכמה trend_explainer_v1.",
].join("\n\n"),
```

```ts
// lib/ai/schemas/trends.ts — explainer and sign quad
export const TrendExplainerV1 = z.object({
  version: z.literal(1),
  intro_he: z.string().trim().min(40).max(320),
  why_it_works_he: z.array(z.string().trim().min(10).max(160)).length(3),
  how_to_steps: z.array(z.object({ name_he: z.string().trim().min(2).max(60), text_he: z.string().trim().min(10).max(220),
                                   seconds: z.number().int().min(1).max(60).nullable() })).min(3).max(6),
  niche_examples: z.array(z.object({ niche_slug: NicheSlug, example_he: z.string().trim().min(10).max(160) })).min(3).max(6),
  compliance_notes_he: z.array(z.string().trim().min(5).max(200)).max(6),
  faq: z.array(z.object({ q_he: z.string().trim().min(5).max(120), a_he: z.string().trim().min(10).max(400) })).min(3).max(5),
  seo_title_he: z.string().trim().min(10).max(60), seo_description_he: z.string().trim().min(50).max(155),
  reel: z.object({ hook_he: z.string().trim().min(3).max(60), beats_he: z.array(z.string().trim().min(3).max(90)).min(3).max(4),
                   cta_he: z.literal("צרו את זה לעסק שלכם בלחיצה") }),
});
export const SignQuadV1 = z.object({
  found: z.boolean(), quad: Quad.nullable(), confidence: z.number().min(0).max(1), occlusion: z.enum(["none", "partial", "heavy"]),
});
```

```json
{"$id":"trend_explainer_v1","type":"object","additionalProperties":false,"required":["version","intro_he","why_it_works_he","how_to_steps","niche_examples","compliance_notes_he","faq","seo_title_he","seo_description_he","reel"],
 "properties":{"version":{"type":"integer","enum":[1]},"intro_he":{"type":"string"},"why_it_works_he":{"type":"array","items":{"type":"string"}},
  "how_to_steps":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["name_he","text_he","seconds"],"properties":{"name_he":{"type":"string"},"text_he":{"type":"string"},"seconds":{"type":["integer","null"]}}}},
  "niche_examples":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["niche_slug","example_he"],"properties":{"niche_slug":{"type":"string"},"example_he":{"type":"string"}}}},
  "compliance_notes_he":{"type":"array","items":{"type":"string"}},
  "faq":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["q_he","a_he"],"properties":{"q_he":{"type":"string"},"a_he":{"type":"string"}}}},
  "seo_title_he":{"type":"string"},"seo_description_he":{"type":"string"},
  "reel":{"type":"object","additionalProperties":false,"required":["hook_he","beats_he","cta_he"],"properties":{"hook_he":{"type":"string"},"beats_he":{"type":"array","items":{"type":"string"}},"cta_he":{"type":"string","enum":["צרו את זה לעסק שלכם בלחיצה"]}}}}}
```

### 13.4 `trends.sign_quad.v1`

**System:**

```text
אתם מאתרים דף נייר ריק בתמונה. בתמונה אדם מחזיק דף לבן או שלט ריק. החזירו את ארבע הפינות של המשטח הריק כשברים של רוחב התמונה וגובהה (0 עד 1), בסדר tl, tr, br, bl מנקודת המבט של הצופה, לפי הסכמה sign_quad_v1.

כללים:
1. found false ו-quad null כשאין דף ריק ברור, כשיש עליו כתב או כשהוא קטן מ-3% מהתמונה.
2. כשאצבעות מכסות פינה, הערכו איפה הפינה נמצאת, וסמנו occlusion partial. כיסוי של יותר מרבע מהדף — heavy.
3. confidence: עד כמה אתם בטוחים במיקום, 0 עד 1.
```

```ts
buildUser: () => "מצאו את פינות הדף הריק בתמונה.",
media: (i) => [{ type: "image_url", image_url: { url: i.keyframeSignedUrl } }],          // 10-min signed URL (part 05 §4.7)
validate: (o) => o.found && o.quad ? [...convexQuad(o.quad), ...minArea(o.quad, 0.03), ...(o.confidence < 0.5 || o.occlusion === "heavy" ? ["low_confidence"] : [])] : [],
// any issue → the preset quad (quadSource "preset"); no repair round for this template
```

```json
{"$id":"sign_quad_v1","type":"object","additionalProperties":false,"required":["found","quad","confidence","occlusion"],
 "properties":{"found":{"type":"boolean"},
  "quad":{"type":["object","null"],"additionalProperties":false,"required":["tl","tr","br","bl"],"properties":{
    "tl":{"type":"object","additionalProperties":false,"required":["x","y"],"properties":{"x":{"type":"number"},"y":{"type":"number"}}},
    "tr":{"type":"object","additionalProperties":false,"required":["x","y"],"properties":{"x":{"type":"number"},"y":{"type":"number"}}},
    "br":{"type":"object","additionalProperties":false,"required":["x","y"],"properties":{"x":{"type":"number"},"y":{"type":"number"}}},
    "bl":{"type":"object","additionalProperties":false,"required":["x","y"],"properties":{"x":{"type":"number"},"y":{"type":"number"}}}}},
  "confidence":{"type":"number"},"occlusion":{"type":"string","enum":["none","partial","heavy"]}}}
```

### 13.5 `guided.shotlist.v1`

**System:**

```text
אתם במאים שמכינים לבעל עסק קטן רשימת צילומים קצרה לסרטון אחד, שיצלם לבד בטלפון. אתם מקבלים את רשימת הצילומים של התבנית, את העסק ואת התסריט אם הוא קיים, ומחזירים guided_shotlist_v1 מותאמת לעסק.

כללים:
1. אותם שוטים, באותו סדר ועם אותם key, framing, ghost ו-people_on_camera. אל תוסיפו ואל תורידו שוטים.
2. title_he עד 40 תווים. instruction_he עד 200: מה מצלמים אצל העסק הזה, איפה עומדים ומה קורה בשוט, בפועל ציווי ברבים ("צלמו", "שימו").
3. tips_he: עד 3 טיפים קצרים ומעשיים (אור, יציבות, מרחק). כש-people_on_camera, אחד מהם מזכיר לבקש אישור ממי שמצטלם.
4. min_sec ו-max_sec: כמו בתבנית, או בסטייה של עד 20%.
5. intro_he: משפט או שניים שאומרים כמה שוטים ובערך כמה זמן. estimated_minutes בין 2 ל-15.
6. אין ילדים בצילום, ואין הוראה לצלם לקוחות בלי אישור.
```

```json
{"$id":"guided_shotlist_v1","type":"object","additionalProperties":false,"required":["version","intro_he","estimated_minutes","shots"],
 "properties":{"version":{"type":"integer","enum":[1]},"intro_he":{"type":"string"},"estimated_minutes":{"type":"integer"},
  "shots":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["key","title_he","instruction_he","framing","min_sec","max_sec","ghost","tips_he","people_on_camera"],
    "properties":{"key":{"type":"string"},"title_he":{"type":"string"},"instruction_he":{"type":"string"},"framing":{"type":"string","enum":["wide","medium","closeup","pov"]},
      "min_sec":{"type":"number"},"max_sec":{"type":"number"},"ghost":{"type":"string","enum":["tripod_wide","hands_table","face_center","product_center","cover_lens"]},
      "tips_he":{"type":"array","items":{"type":"string"}},"people_on_camera":{"type":"boolean"}}}}}}
```

### 13.6 `guided.autocut.v1`

**System:**

```text
אתם עורכי וידאו. אתם מקבלים קליפ אחד שבעל עסק צילם בטלפון, כ-8 פריימים עם חותמת זמן, את המילים שנאמרו עם זמנים, את ההוראה של השוט ואת אורך היעד, ומחזירים guided_autocut_v1.

כללים:
1. takes: 1 עד 4 קטעים שמתאימים להוראה, ממוינים לפי הזמן, עם score_0_5 ו-reason_en קצר באנגלית. best_take הוא האינדקס של הטוב ביותר.
2. in_ms ו-out_ms: הקטע שייכנס לסרטון, בתוך best_take, קרוב לאורך היעד ככל האפשר, 500 ms לפחות. אל תחתכו באמצע מילה, ואל תתחילו ברגע שבו הטלפון עוד זז.
3. hook_windows: לכל גרסה ב-<variants>, קטע של 1.5 עד 3.5 שניות שמתאים לתיאור שלה, רק כשהשוט הוא שוט הפתיחה. אחרת מערך ריק.
4. warnings: shaky, blurry, dark, too_short, wrong_orientation, face_cut (פנים חתוכות בשולי המסגרת), no_subject (לא רואים את מה שההוראה ביקשה). לעולם לא fallback.
5. usable false רק כשאין אף קטע שאפשר להשתמש בו.
6. speed_hint: 1, 1.25, 1.5 או 2, לפי הקצב שמתאים לביט.
7. note_he: משפט קצר בעברית לבעל העסק, רק כשיש מה לתקן בצילום הבא ("כדאי לצלם עם יותר אור"), אחרת null.
```

```ts
// lib/ai/schemas/guided.ts — autocut
const Ms = z.number().int().min(0).max(600_000);
export const GuidedAutocutV1 = z.object({
  version: z.literal(1), usable: z.boolean(),
  takes: z.array(z.object({ in_ms: Ms, out_ms: Ms, score_0_5: z.number().int().min(0).max(5), reason_en: z.string().max(160) })).min(1).max(4),
  best_take: z.number().int().min(0).max(3), in_ms: Ms, out_ms: Ms,
  hook_windows: z.array(z.object({ variant_key: z.enum(["A", "B", "C", "D", "E"]), in_ms: Ms, out_ms: Ms })).max(5),
  warnings: z.array(z.enum(["shaky", "blurry", "dark", "too_short", "wrong_orientation", "face_cut", "no_subject", "fallback"])).max(8),
  speed_hint: z.union([z.literal(1), z.literal(1.25), z.literal(1.5), z.literal(2)]),
  note_he: z.string().trim().min(5).max(120).nullable(),
}).refine((a) => a.out_ms - a.in_ms >= 500 && a.best_take < a.takes.length, "cut_bounds");   // "fallback" is server-only
```

```json
{"$id":"guided_autocut_v1","type":"object","additionalProperties":false,"required":["version","usable","takes","best_take","in_ms","out_ms","hook_windows","warnings","speed_hint","note_he"],
 "properties":{"version":{"type":"integer","enum":[1]},"usable":{"type":"boolean"},
  "takes":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["in_ms","out_ms","score_0_5","reason_en"],"properties":{"in_ms":{"type":"integer"},"out_ms":{"type":"integer"},"score_0_5":{"type":"integer"},"reason_en":{"type":"string"}}}},
  "best_take":{"type":"integer"},"in_ms":{"type":"integer"},"out_ms":{"type":"integer"},
  "hook_windows":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["variant_key","in_ms","out_ms"],"properties":{"variant_key":{"type":"string","enum":["A","B","C","D","E"]},"in_ms":{"type":"integer"},"out_ms":{"type":"integer"}}}},
  "warnings":{"type":"array","items":{"type":"string","enum":["shaky","blurry","dark","too_short","wrong_orientation","face_cut","no_subject","fallback"]}},
  "speed_hint":{"type":"number","enum":[1,1.25,1.5,2]},"note_he":{"type":["string","null"]}}}
```

### 13.7 התוספות של `script.generate.v2` ו-`storyboard.generate.v2`

ה-`system` של כל v2 הוא הטקסט של v1 מילה במילה, ואחריו הסעיף הזה. בלי `<trend_recipe>` בקלט הסעיף לא חל, וההתנהגות זהה ל-v1 (בדיקת snapshot, חלק 05 §8.1). ה-`buildUser` מוסיף `jsonTag("trend_recipe", TrendRecipeInput)` (§9.4) רק בפרויקט עם `trend_template_id`.

**`script.generate.v2` — הסעיף שנוסף:**

```text
סעיף הטרנד: כשיש <trend_recipe> (פרויקט מתבנית טרנד)
1. <beat_plan> נבנה מהמתכון: ביט אחד לכל ביט סצנה, באותו סדר ובאותם תפקידים. אל תוסיפו ביטים ואל תאחדו ביטים.
2. בכל ביט עם onscreen_slot כתבו onscreen_text_he עד max_chars תווים ועד 8 מילים, בהשראת niche.examples ולא בהעתקה שלהן.
3. בביט הראשון שורת ההוק היא hook_variant.hook_line_he, עם התאמה קלה לעסק. placeholder כמו {מחיר} או {זמן} נשאר כשאין עובדה מתאימה ב-<facts>.
4. vo_he רק בביטים עם vo_slot, עד max_words מילים. כש-vo_mode הוא none, vo_he ריק בכל הביטים.
5. אל תכתבו אף ביטוי מ-do_not_copy, גם לא בתרגום, ואל תתארו את האנשים, המקומות או המותגים שמופיעים שם.
6. בביט עם overlay_kind fake_ui הטקסט הוא כותרת, שבירת שורה וגוף. בביט עם price הטקסט מתחיל ב-"{מחיר} ₪" ואחריו משפט קצר.
7. compliance_notes_he מחייבות: אין הבטחה לתוצאה, דחיפות רק כשהיא עובדה, ואין תגובה או המלצה של לקוח שלא נמסרה לנו.
```

**`storyboard.generate.v2` — הסעיף שנוסף:**

```text
סעיף הטרנד: כשיש <trend_recipe> (פרויקט מתבנית טרנד)
1. סצנה אחת לכל ביט, באותו סדר; beat_index לפי הסדר ו-duration לפי seconds של הביט.
2. visual_source לפי הביט. ביט עם filmed true הוא user_media, בלי image_prompt_en ובלי motion_prompt_en.
3. image_prompt_en ו-motion_prompt_en: מתחילים מ-visual_prompt_en ו-motion_prompt_en של הביט, ממלאים את {subject_en}, {setting_en} ו-{product_en} מ-niche ואת {bait_en} מ-hook_variant, ומשפרים את הניסוח בלי לשנות את הרעיון. אף פעם לא טקסט, אותיות, שלט כתוב או לוגו בפריים.
4. camera, transition_in ו-sfx לפי הביט. אחרי ביט cut: transition_in "cut" וה-sfx של ה-cut.
5. בסצנה עם overlay_kind sign: הדף ריק לגמרי, פונה למצלמה, בגובה החזה; תמונה סטילס עם camera static.
6. אנשים בסצנות AI: מבוגרים בלבד, דמות כללית שאינה דומה לאדם אמיתי, ובלי דיבור למצלמה.
```

### קריטריוני קבלה
- [ ] בדיקת ה-CI של הפרומפטים (חלק 05 §23.6) מוצאת שמונה קבצים עם `ownerPart: "08"`, הנתיב וה-`aiTask` של הטבלה, ו-snapshot של JSON Schema לכל סכמה שנשלחת לספק.
- [ ] ה-`system` של `script.generate.v2` ושל `storyboard.generate.v2` זהה ל-v1 עד השורה "סעיף הטרנד: כשיש <trend_recipe>", וחמש הדוגמאות של נספח D מחזירות פלט שעובר את אותן ולידציות.
- [ ] fixtures ב-`tests/fixtures/trends/`: פלט של `trends.adapt.v1` שמכיל ביטוי מ-`do_not_copy` נדחה ב-`validate`, ופלט של `guided.autocut.v1` עם `warnings: ["fallback"]` נדחה.
- [ ] `trends.sign_quad.v1` עם מרובע לא קמור ← ה-preset בלי סבב תיקון.

---

## §14. מסכים ומיקרו-קופי

הרכיבים הם של חלק 01 (`TrendCard`, `TrendLifecycleBadge`, `CameraGhostGuide`, `HookScoreBadge`), והניווט של חלק 03 §2 ("טרנדים", `Flame`). כל המחרוזות ב-`messages/he.json`; פנייה ברבים, ריבוי ב-ICU, והן עוברות `pnpm lint:copy` (חלק 03 §23).

### 14.1 `/app/trends` — "טרנדים השבוע"

כותרת, שורת השבוע, סינון לפי תחום (נשמר ב-`localStorage` כ-`trends.feed.niche`) ולפי סוג, ורשת של `TrendCard variant="feed"` (הראשון `featured` כשיש מקודם). גלילה אינסופית לפי `nextCursor`. אירועים: `trend_feed_viewed {niche, location:"app"}`, `trend_opened {trend_slug, location:"feed"}`.

### 14.2 `/app/trends/[slug]` — עמוד הטרנד

נגן ההדגמה (עם בורר נישה), ואחריו הסעיפים: למה זה עובד · ככה זה ייראה אצלכם · שלוש פתיחות לבחירה · מבנה הסרטון · מה מצלמים (רק `guided`/`hybrid`) · כדאי לדעת. בצד (בנייד: בתחתית, דביק): שני כפתורי היצירה, תג המודעה וציון ההוק.

### 14.3 `/app/projects/[projectId]/shoot` — ערכת הצילום

מסך פתיחה עם `intro_he`, ואז כרטיס לכל שוט (הכותרת, ההוראה, הטיפים, טווח השניות ומסגרת העזר), תצוגה מקדימה של מה שצולם עם "צילום חוזר", תיבת ההסכמה כשצריך, והכפתור "עריכה אוטומטית" עם העלות. בזמן העריכה — מסך התקדמות; בסוף — חזרה לשלב `preview`. כפתור **"בעצם, הכול ב-AI"** מוצג רק ב-`hybrid`, ומחזיר לשלב `style` בלי צילומים. מפתח ה-`localStorage` `guided.camera.tips` שומר שהטיפים של המצלמה נסגרו.

```json
{
  "app": {
    "trends": {
      "nav": "טרנדים",
      "feed": {
        "title": "טרנדים השבוע",
        "subtitle": "פורמטים שעובדים עכשיו ברשתות, מוכנים לעסק שלכם. כל סרטון הדגמה כאן הוא שלנו.",
        "weekLabel": "השבוע: {range}",
        "nicheFilter": "התחום",
        "allNiches": "כל התחומים",
        "kind": { "all": "הכול", "fresh": "חדשים", "format": "פורמטים", "evergreen": "קלאסיקות" },
        "empty": "עוד אין טרנדים לתחום הזה. בינתיים אפשר לראות את כל הטרנדים.",
        "emptyCta": "לכל הטרנדים",
        "loadMore": "עוד טרנדים"
      },
      "card": {
        "create": "צרו בקליק",
        "shoot": "צלמו בעצמכם",
        "fit": "מתאים לעסק שלכם כי {angle}",
        "whyLabel": "למה זה עובד",
        "production": { "ai": "AI מלא", "guided": "צילום מודרך", "hybrid": "AI או צילום" },
        "ads": { "ok": "מתאים למודעה", "organic": "רק לפרסום רגיל" },
        "duration": "{sec} שניות"
      },
      "page": {
        "why": "למה זה עובד",
        "yours": "ככה זה ייראה אצלכם",
        "variants": "שלוש פתיחות לבחירה",
        "variantLabel": "גרסה {key, select, A {א׳} B {ב׳} C {ג׳} D {ד׳} other {ה׳}}",
        "structure": "מבנה הסרטון",
        "beatSeconds": "{sec} שנ׳",
        "shots": "מה מצלמים",
        "shotsIntro": "{count, plural, one {שוט אחד} two {שני שוטים} other {# שוטים}}, בערך {minutes} דקות",
        "notes": "כדאי לדעת",
        "musicNote": "בטרנד המקורי יש שיר מוגן. אצלנו נוצרת מוזיקה מקורית שמותרת לפרסום.",
        "organicNotice": "הפורמט הזה מתאים רק לפרסום רגיל, ולא יעלה לקמפיין.",
        "aiLabelNotice": "הסרטון ייצא עם התווית \"נוצר באמצעות AI\", כי הוא נראה מציאותי.",
        "consentNotice": "בפורמט הזה מופיעים אנשים אמיתיים מהעסק, וצריך את ההסכמה שלהם בכתב.",
        "demoNiche": "הדגמה: {niche}",
        "endingSoon": "הטרנד עוד חם, אבל לא לאורך זמן. כדאי לפרסם בימים הקרובים."
      },
      "dashboard": { "title": "טרנד השבוע לתחום שלכם", "titleNoNiche": "טרנד השבוע", "all": "לכל הטרנדים" }
    },
    "guided": {
      "title": "ערכת הצילום",
      "intro": "{count, plural, one {שוט אחד} two {שני שוטים} other {# שוטים}} קצרים, בערך {minutes} דקות. אנחנו עורכים, מוסיפים כתוביות ומוזיקה.",
      "shotOf": "שוט {n} מתוך {total}",
      "range": "{min}–{max} שניות",
      "record": "צילום עכשיו",
      "upload": "העלאת סרטון",
      "retake": "צילום חוזר",
      "recording": { "start": "התחלת הקלטה", "stop": "עצירת ההקלטה", "enough": "אפשר לעצור", "autoStop": "ההקלטה נעצרה לבד, כי עבר הזמן של השוט." },
      "uploading": "מעלים את הצילום",
      "uploaded": "הצילום נשמר",
      "allAi": "בעצם, הכול ב-AI",
      "consent": {
        "title": "אנשים בצילום",
        "checkbox": "כל מי שמופיע בצילומים אישר בכתב שאפשר לפרסם אותו, כולל עובדים. אין בצילומים ילדים.",
        "help": "בלי ההסכמה הזו אי אפשר להמשיך לעריכה."
      },
      "autocut": {
        "cta": "עריכה אוטומטית · {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}",
        "missing": "{count, plural, one {חסר עוד שוט אחד} two {חסרים עוד שני שוטים} other {חסרים עוד # שוטים}} לפני העריכה.",
        "progress": "עורכים את הצילומים. זה לוקח בערך דקה, ואפשר לסגור את המסך.",
        "done": "הצילומים מוכנים. אפשר לראות את הסרטון בתצוגה המקדימה.",
        "toPreview": "לתצוגה המקדימה",
        "failed": "העריכה האוטומטית לא הצליחה. לא בוצע חיוב, ואפשר לנסות שוב.",
        "retry": "נסו שוב",
        "warning": {
          "shaky": "הצילום קצת רועד. אם אפשר, כדאי להניח את הטלפון על משטח.",
          "blurry": "הצילום לא חד. כדאי לנגב את העדשה ולצלם שוב.",
          "dark": "הצילום חשוך. כדאי לצלם מול חלון או להדליק אור.",
          "face_cut": "פנים נחתכות בשולי המסגרת. כדאי להתרחק צעד.",
          "no_subject": "לא רואים בצילום את מה שהשוט מבקש. כדאי לצלם שוב לפי ההוראה."
        }
      },
      "errors": {
        "too_long": "הצילום ארוך מדי לשוט הזה (עד {max} שניות). אפשר לצלם שוב קצר יותר, או להעלות קטע אחר.",
        "too_short": "הצילום קצר מדי לשוט הזה (לפחות {min} שניות). אפשר לצלם שוב.",
        "camera": "הדפדפן לא מאפשר לצלם מכאן. אפשר להעלות סרטון מהטלפון."
      }
    }
  }
}
```

### 14.4 Trend Studio (`/admin/trends`, חלק 03 §22.21)

- **"סרטוני השראה"**: טבלה עם הפלטפורמה, בסיס הזכויות, תאריך המחיקה המתוכנן, סטטוס הניתוח ועלותו. פעולות: "סרטון השראה חדש", "ניתוח", "מחיקת הקובץ".
- **"סרטון השראה חדש"**: בסיס זכויות (רדיו), הסבר, קישור, קובץ, הערות, תיבת ההצהרה, ואישור העלות לפני הניתוח.
- **"ניתוח"**: ציר זמן של השוטים, הטקסטים, הקריינות והצלילים מעל הפריימים, עם `risk_flags` כתגים, ו-"טיוטת תבנית".
- **"עורך התבנית"**: לשוניות "פרטים" · "מתכון" · "גרסאות הוק" · "נישות" · "צילום" · "ציות" · "הדגמות" · "פירוק טרנד" · "פרסום". שגיאת TT מוצגת ליד השדה עם הקוד.
- **"לוח מחזור החיים"**: טיוטה · בבדיקה · מתוזמן · מפורסם · פרש.

```json
{
  "admin": {
    "trends": {
      "title": "טרנדים",
      "references": { "title": "סרטוני השראה", "new": "סרטון השראה חדש", "retention": "יימחק ב-{date}", "kept": "נשמר עד מחיקה ידנית", "deleteFile": "מחיקת הקובץ", "deleteFileConfirm": "הקובץ יימחק, והניתוח יישאר. אי אפשר לבטל את זה." },
      "basis": {
        "own_content": "תוכן שלנו", "licensed": "ברישיון", "partner_permission": "אישור בכתב מבעלי הזכויות", "customer_owned": "תוכן של לקוח, באישורו",
        "public_youtube_url": "קישור YouTube ציבורי (בלי הורדה)", "link_only_notes": "קישור והערות בלבד"
      },
      "form": {
        "note": "הסבר לבסיס הזכויות",
        "notePlaceholder": "ממי הרישיון, איפה האישור בכתב, או מי הלקוח",
        "attest": "יש לנו זכות להשתמש בסרטון הזה לניתוח פנימי: בעלות, רישיון או אישור בכתב",
        "noScraping": "אין כאן הורדה מקישור. סרטון של מישהו אחר נכנס רק עם רישיון או אישור בכתב.",
        "topicWarning": "הנושא נראה רגיש (פוליטיקה, מלחמה, אסון). סרטונים כאלה לא הופכים לתבנית."
      },
      "analysis": { "run": "ניתוח", "rerun": "ניתוח מחדש", "cost": "הפעולה תעלה כ-${cost} ב-OpenRouter", "monthly": "הוצאה החודש: ${spent} מתוך ${limit}", "fallback": "נותח מפריימים בלבד", "rejected": "נדחה: {reason}", "draft": "טיוטת תבנית" },
      "editor": {
        "tabs": { "details": "פרטים", "recipe": "מתכון", "variants": "גרסאות הוק", "niches": "נישות", "shots": "צילום", "compliance": "ציות", "demos": "הדגמות", "explainer": "פירוק טרנד", "publish": "פרסום" },
        "doNotCopy": "לא להעתיק (פנימי, לא מוצג ללקוחות)",
        "demoRender": "רינדור הדגמה: {niche}",
        "lowScore": "ציון ההוק של ההדגמה נמוך מ-60. כדאי לחזק את הפתיחה לפני הפרסום.",
        "explainerGenerate": "יצירת טיוטה לפירוק הטרנד"
      },
      "publish": { "now": "פרסום עכשיו", "nextDrop": "בירידה הקרובה ({date})", "scheduled": "מתוזמן ל-{date}", "retire": "הוצאה משימוש", "retireConfirm": "הטרנד ייעלם מהפיד. הדף הציבורי יישאר עם התווית \"הטרנד הזה כבר פחות חם\"." },
      "board": { "draft": "טיוטה", "review": "בבדיקה", "scheduled": "מתוזמן", "published": "מפורסם", "retired": "פרש" },
      "errors": { "too_long": "הסרטון ארוך מ-3 דקות. אפשר להעלות קטע קצר יותר." }
    }
  }
}
```

### 14.5 נוסחים חדשים ב-`errors.*` (רשום בחלק 03 §1.4)

| מפתח | הנוסח |
|---|---|
| `errors.INVALID_INPUT.byReason.production_mode_unavailable` | **"אי אפשר ליצור את הטרנד הזה בדרך שנבחרה. אפשר לבחור את האפשרות השנייה בעמוד הטרנד."** |
| `errors.INVALID_INPUT.byReason.guided_footage_required` | **"לפני רינדור ההדגמה צריך לצלם את השוטים של התבנית בסביבת הסטודיו."** (אדמין) |
| `errors.MODERATION_BLOCKED.byReason.similarity` | **"הטקסט קרוב מדי לסרטון ההשראה: {phrase}. צריך לנסח מחדש."** (אדמין) |
| `errors.EDIT_CONFLICT.byReason.analysis_rejected` | **"הניתוח נדחה בבדיקת הסיכונים, ולכן אי אפשר ליצור ממנו תבנית."** (אדמין) |

### קריטריוני קבלה
- [ ] `pnpm lint:copy` עובר על `app.trends`, `app.guided` ו-`admin.trends`, ובדיקת כיסוי הסיבות של חלק 03 מוצאת נוסח לכל `reason` של §7.
- [ ] בנייד (375px) עמוד הטרנד מציג את כפתורי היצירה בתחתית הדביקה, ואין גלילה אופקית.
- [ ] ב-`hybrid` מופיע "בעצם, הכול ב-AI", וב-`guided` לא.
- [ ] כל המסכים עוברים axe בלי הפרות; ההקלטה נשלטת גם במקלדת (רווח מתחיל ועוצר).

---

## §15. המייל `trends_weekly`

### 15.1 הקטלוג (שורה ב-`EmailKey`, חלק 06 §12.4)

| `key` | סוג | מתי | למי | כיבוי | מפתח אידמפוטנטיות |
|---|---|---|---|---|---|
| `trends_weekly` | **marketing** | ראשון, אחרי הירידה של 08:00 שעון ישראל, פעם בשבוע ISO (`trends-lifecycle`); בחג או ביום שקט — יום העסקים הבא באותו שבוע | בעלי הסכמת `marketing_email` בתוקף | הסרה בלחיצה | `trends_weekly:{isoWeek}:{emailHash}` |

### 15.2 כללי השליחה (`sendTrendsWeeklyBatch`)

- **יש מה לשלוח** רק כשיש תבנית עם `published_week` של השבוע הנוכחי. עד 3 תבניות, לפי `sort_order`.
- **הנמענים:** פרופילים לא מחוקים עם מייל מאומת והסכמת `marketing_email` בתוקף, לפי שורת ההסכמה האחרונה (נקראת בשרת בלבד, R10). נמען אחד לכל כתובת. הנישה להתאמה האישית היא של `last_workspace_id`.
- **קצב:** עד 400 נמענים בכל ריצה של ה-cron, בין 08:00 ל-20:00 שעון ישראל; ריצה שמוצאת שכולם קיבלו לא שולחת דבר. `email_messages` עם מפתח האידמפוטנטיות מונע כפילות גם בהרצה מקבילה.
- **חג או יום שקט** (הכלל של חלק 06 §12.4, לפי `seasons` ו-`non_business_days`): הדחייה ליום העסקים הבא באותו שבוע ISO. אחרי חמישי — השבוע מדולג.

### 15.3 הנוסח

- **נושא:** פרסומת: {count, plural, one {טרנד חדש לעסקים השבוע} two {שני טרנדים חדשים לעסקים השבוע} other {# טרנדים חדשים לעסקים השבוע}}
- **Preheader:** פורמטים שעובדים עכשיו ברשתות, וככה עושים אותם לעסק שלכם בלחיצה.
- **H1:** טרנדים השבוע
- **גוף:**
  - שלום {firstName},
  - השבוע {count, plural, one {נוסף לפיד טרנד חדש} two {נוספו לפיד שני טרנדים חדשים} other {נוספו לפיד # טרנדים חדשים}}. כל סרטון הדגמה כאן הוא שלנו, והמוזיקה מותרת לפרסום.
  - לכל טרנד: הפוסטר של ההדגמה, השם, `tagline_he`, השורה **"מתאים לעסק שלכם כי {angle}"** (רק כשיש התאמה לנישה), התג **"רק לפרסום רגיל"** בתבנית `organic_only`, וכפתור **"צרו את זה לעסק שלכם"** ← `/app/create?trend={slug}&src=trend` (עם `utm_source=email&utm_campaign=trends_weekly`).
- **כפתור ראשי:** לכל הטרנדים ← `/app/trends`
- **הערה:** הטרנדים הם השראה לפורמט. הטקסט, המחיר והפרטים בסרטון שלכם הם של העסק שלכם.
- **תחתית:** תחתית הדיוור המלאה של חלק 06 §12.3, כולל ההסרה בלחיצה.
- פתיחה מהמייל שולחת `trend_opened {trend_slug, location:"email"}`.

### קריטריוני קבלה
- [ ] `trends_weekly` לא נשלח בלי הסכמת `marketing_email` (`skipped_no_consent`), והנושא מתחיל במילה "פרסומת:".
- [ ] שתי ריצות מקבילות באותה שעה שולחות לכל נמען פעם אחת; שבוע בלי תבנית חדשה לא שולח דבר.
- [ ] ראשון שהוא יום שקט ← השליחה מתחילה בשני ב-08:05; המייל מתרנדר ב-Gmail וב-Outlook ב-RTL.

---

## §16. גבולות משפטיים, ציות והסרה (מפרט §J.10, §N.8)

### 16.1 העקרונות ואיפה הם נאכפים

| עיקרון | איפה נאכף |
|---|---|
| **פורמט כן, ביטוי לא** (חוק זכות יוצרים, סעיף 5: רעיון, שיטה ותבנית אינם מוגנים) [Counsel: Brodesky v. Armosa] | ניתוח מופשט (§4), `do_not_copy`, שומר הדמיון (§5.7) והפקה מחדש של כל התוכן |
| **לא היוצר:** לא פנים, קול, שם או שם משתמש, ולא דמות דומה (חוק הגנת הפרטיות, סעיף 2(6)) | `risk_flags` `creator_face`/`creator_voice`, הכלל של `storyboard.generate.v2` על אנשי AI, `do_not_copy` |
| **בלי מוזיקה מסחרית מטרנד** בקבצים שלנו | `music_brief` בלבד, Lyria או ספרייה ברישיון [M0-verify את תנאי השימוש של Lyria בפרסומות], משפט המוזיקה במסך |
| **בלי המלצות מזויפות ובלי ראיונות רחוב ב-AI** | `testimonial_format` ← `guided` עם הסכמה; `comment_bubble` רק כללי או אמיתי באישור |
| **בלי קטינים ב-AI ובלי ילדים בצילום המודרך** | `minor` נדחה; `B09` של חלק 05; תיבת ההסכמה (§10.6) |
| **בלי טרנדים של מלחמה, חטופים, צה״ל, זיכרון, טרור ופוליטיקה** | `TOPIC_BLOCKLIST` ו-`political_or_war` (§2.3, §3.5) |
| **בלי לוגו של צד שלישי** | `third_party_logo` ← `do_not_copy`; הפרומפטים אוסרים לוגו בפריים |
| **בלי פעלולים מסוכנים ובלי פגיעה אמיתית** | `dangerous_stunt` ו-`real_injury` נדחים; ב-T3 הפיזיקה בלתי אפשרית ואף אחד לא נפגע |
| **דחיפות ומחיר רק כשהם אמת** | שער העובדות, `price_claim`, `urgency_must_be_true` (§8.6) |
| **ממשק מטעה רק בפרסום רגיל** | `organic_only`, `trend_templates_organic_only`, `AD_NOT_ELIGIBLE {reason:"deceptive_ui"}` (חלק 07 §10.6) |
| **סכנה מציאותית ב-AI מסומנת** | `needs_ai_label` ← `ai_label = true` והתווית "נוצר באמצעות AI" |

### 16.2 פרטיות

צילומים של אנשים מהערכה המודרכת הם קטגוריה במסמך הגדרות המאגר, עם מטרה, בסיס ותקופת שמירה (חלק 06 §11.5): הם נכסים של הסביבה ונמחקים איתה. סרטוני ייחוס הם מידע פנימי של הצוות (חלק 06 §11.15): bucket פרטי, כתובות חתומות לאדמין בלבד, ומחיקה אחרי 30 יום כשהבסיס לא מתיר שמירה. `do_not_copy` ו-`source_reference_id` לא יוצאים מהשרת לעולם.

### 16.3 המשפט הקבוע של פרסום רגיל בלבד

**"הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים."** — ההערה הראשונה בכל תבנית `organic_only` (TT21). בדף הציבורי מופיע לצידה התג "מתאים רק לפרסום רגיל".

### 16.4 הסרה (R19, חלק 06 §22)

פנייה על הפרה (`abuse_reports`, `reason = 'copyright'`) מטופלת תוך 2 ימי עסקים: השוואה בין התבנית לסרטון המקורי (⚖️ בספק), ואז A9 (`retired`), הסרת `demo_assets` ו-`explainer` ב-A6 — כך שהדף הציבורי מחזיר **404** ולא נשאר עם התווית — מחיקת קובץ הייחוס ב-A11, `revalidateTag('trends', "max")` ו-audit. הפרויקטים של הלקוחות נשארים שלהם; אם נמצאה העתקה של ביטוי, הודעת `system` לסביבות שב-`trend_template_uses` ממליצה לא לפרסם שוב את הסרטון (⚖️ על הניסוח).

### 16.5 פריטי ⚖️ (לחלק 06 §25)

הפרשנות של Brodesky v. Armosa לפורמטים של רשתות; הקלטת מסך כבסיס זכויות; תנאי Lyria לשימוש בפרסומות; נתונים בין לקוחות (§11.7); הנוסח של ההודעה ללקוחות אחרי הסרה; ההסכמה בכתב של עובדים שמצטלמים.

### קריטריוני קבלה
- [ ] fixture של ניתוח עם `political_or_war` נדחה, ו-A1 עם המילה "חטופים" בהערות מחזיר אזהרה.
- [ ] תרגול R19 על תבנית seed: אחרי השלבים, `/trends/[slug]` מחזיר 404, הקובץ של הייחוס לא קיים, ויש שתי שורות audit.
- [ ] בכל 12 התבניות אין פרומפט שמבקש טקסט, לוגו, ילד או אדם מפורסם (בדיקת `promptSafety` של חלק 05 על ה-seed).

---

## §17. בדיקות

| רמה | מה נבדק |
|---|---|
| יחידה (Vitest) | `TrendAnalysisV1`, `TrendTemplateV1` ו-TT01–TT27 מול `template-cases.json` (זהות עם Python); `draftToTemplate`; `similarityHits`; `resolveOverlayTemplate` ופיצול הטקסט; `OVERLAY_TEXT_SLOTS`; `overlayBox` מול `zones.ts`; `lifecycleBadge`; `allowedDurations`; `templateAdEligibility`; phash ומרחק; `BANNED_PACKAGES` |
| חוזה (MSW) | הבקשה של `trends.analyze.v1` (חלק `video_url`, פריימים מתוזמנים, `data_collection: "deny"`), הנפילה ל-`llm.vision_frames`, `youtubePart`, `MediaTooLargeError`; `guided.autocut.v1` ו-`trends.sign_quad.v1` |
| תהליכים (`inline`) | `trendAnalyze` מקצה לקצה על fixture של 20 שניות; `guidedAutocut` עם 3 קליפים, אחד webm; תקיעה וניסיון חוזר; חיוב יחיד |
| רינדור (golden) | 11 השכבות × 3 פורמטים; T1 בשלוש נישות; T4; T2 מצילום |
| e2e (Playwright) | פיד ← עמוד טרנד ← "צרו בקליק" ← אשף ← רינדור; "צלמו בעצמכם" עם מצלמה מדומה (`--use-fake-device-for-media-stream`) ← עריכה אוטומטית ← `preview`; Trend Studio: קליטה ← ניתוח ← טיוטה ← הדגמה ← פרסום מתוזמן ← `trends-lifecycle` |
| DB (pgTAP) | `12_trends_rls.sql` (§6.9) |
| seed | `build_trends.py --check`; `TrendTemplateSeed.parse` |
| הערכת פרומפטים | 4 סרטוני המחקר ← ניתוח ← טיוטה: אין פגיעה בשומר הדמיון, והטיוטה עוברת את TT; 10 קליפים מצולמים עם חיתוך ידני ← סטייה של עד 400ms ב-`in_ms`/`out_ms` |

### קריטריוני קבלה
- [ ] כל השורות של הטבלה רצות ב-CI (ה-e2e על staging עם mocks), והן חלק מ-DoD של M8 (חלק 06 §25).
- [ ] `tests/fixtures/trends/` מכיל את ניתוחי T1–T4, `template-cases.json`, שלושה קליפים לצילום מודרך (אחד webm) ותשובות MSW לכל שמונה התבניות.

---

## §18. נספח: `seed/trend_templates.json`

העתק של הקובץ, תבנית בכל שורה (`build_trends.py --print-compact`). הקובץ עצמו, עם הזחה, הוא מקור האמת; בדיקה ב-CI משווה את הבלוק הזה לפלט של הסקריפט.

```json
[
{"slug":"bait-and-sign","name_he":"פיתיון ושלט","tagline_he":"שלוש שניות של מתח, ואז שלט שאומר בדיוק מה רוצים","description_he":"הסרטון נפתח ברגע מותח שאין לו שום קשר לעסק, ואז חיתוך חד לאדם שעומד מול המצלמה בפנים רציניות ומחזיק שלט בכתב יד. השלט הוא ההזמנה, והוא גם הפאנץ׳. הכול נוצר ב-AI, והטקסט על השלט נכתב אצלנו בעברית מדויקת.","why_it_works_he":"הרגע המותח עוצר את הגלילה, והמעבר הפתאומי לשלט יבש מצחיק כי לא ציפו לו. ההזמנה לעסק היא הבדיחה עצמה, ולכן צופים עד הסוף ושולחים לחברים.","hook_type_slug":"pattern-interrupt","lifecycle":"format","production_mode":"ai","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"bait","role":"bait","duration_ms":2500,"purpose_he":"רגע מותח בלי קשר לעסק: עוד שנייה משהו קורה","visual_source":"ai_clip","visual_prompt_en":"Handheld smartphone-style shot of {bait_en}, bright natural daylight, candid everyday setting","motion_prompt_en":"the moment builds for two and a half seconds and stays unresolved, slight handheld shake, natural motion","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":24,"example_he":"נכנס או לא נכנס?"},"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"cut1","role":"cut","duration_ms":0,"purpose_he":"חיתוך חד, בלי מעבר","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":"cut","sfx":"impact","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"sign","role":"payoff","duration_ms":7000,"purpose_he":"אדם רציני מחזיק שלט בכתב יד עם ההזמנה לעסק","visual_source":"ai_image_kenburns","visual_prompt_en":"Static frontal medium shot of {subject_en} standing against a plain wall in {setting_en}, holding a blank white sheet of paper flat at chest height with both hands, the sheet faces the camera and is fully visible, deadpan neutral expression, soft even light","motion_prompt_en":"almost still, a slow blink, the sheet stays perfectly flat","camera":"static","transition_in":"cut","sfx":"impact","speed":null,"onscreen_slot":{"key":"sign_text","max_chars":40,"example_he":"בואו לאכול אצלנו. אנחנו ב{עיר}"},"vo_slot":null,"overlay":{"kind":"sign","textHe":"$onscreen","quad":null,"quadSource":"preset","presetQuad":{"tl":{"x":0.2,"y":0.24},"tr":{"x":0.8,"y":0.24},"br":{"x":0.8,"y":0.5},"bl":{"x":0.2,"y":0.5}},"ink":"auto","reveal":"words","fromMs":300,"toMs":null,"position":"auto"},"guided_shot_key":null,"spans":null},{"key":"cta","role":"cta","duration_ms":5500,"purpose_he":"המקום או המוצר האמיתי, עם הנעה לפעולה קצרה","visual_source":"ai_image_kenburns","visual_prompt_en":"Close-up of {product_en} in {setting_en}, warm inviting light, shallow depth of field","motion_prompt_en":"slow push in toward the subject","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו וואטסאפ ושמרו שולחן"},"vo_slot":null,"overlay":{"kind":"sticker","stickers":[{"emoji":"🫶","atMs":700,"anchor":{"x":0.7,"y":0.42},"sizePx":180}],"fromMs":0,"toMs":null,"position":"auto"},"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"a basketball rolling around the rim of a hoop again and again, about to drop in or out","hook_line_he_pattern":"נכנס או לא נכנס?","why_he":"שאלה פתוחה כבר בשנייה הראשונה, והצופה נשאר לראות את התשובה."},{"key":"B","bait_concept_en":"a long row of colourful dominoes on a café table starting to tip toward a full cup of coffee","hook_line_he_pattern":"עוד שנייה זה נופל","why_he":"תחושה שמשהו עומד להשתבש, בלי שום סכנה אמיתית."},{"key":"C","bait_concept_en":"milk poured into a coffee cup that is already full, the foam rising right to the rim","hook_line_he_pattern":"רק לא לשפוך","why_he":"מתח קטן ומוכר מהיומיום, שכל אחד מזדהה איתו."}],"niche_adaptations":[{"niche_slug":"restaurants","subject_en":"a chef in a plain dark apron, around 35","setting_en":"the dining room of a small neighbourhood restaurant","product_en":"a plate of freshly grilled food on a wooden table","onscreen_examples_he":{"hook_line":"נכנס או לא נכנס?","sign_text":"בואו לאכול אצלנו. אנחנו ב{עיר}","cta_line":"שלחו וואטסאפ ושמרו שולחן"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"אפשר לכתוב על השלט את שם המנה הכי מבוקשת במקום ההזמנה הכללית."},{"niche_slug":"fitness-trainers","subject_en":"a fitness trainer in a plain t-shirt, around 30","setting_en":"a small bright training studio","product_en":"a clean training mat with a pair of dumbbells","onscreen_examples_he":{"hook_line":"עוד שנייה זה נופל","sign_text":"בואו להתאמן. התירוצים נשארים בחוץ","cta_line":"שלחו הודעה ונתאם אימון"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"dentists","subject_en":"a dentist in a white coat, around 40","setting_en":"a calm modern dental clinic","product_en":"an empty treatment chair by a bright window","onscreen_examples_he":{"hook_line":"רק לא לשפוך","sign_text":"בואו לבדיקה לפני שזה קורה לשיניים","cta_line":"קבעו תור לבדיקה"},"vo_example_he":null,"cta_type":"booking","notes_he":"בלי הבטחות רפואיות ובלי \"בלי כאב\". השלט מזמין לבדיקה, ולא מבטיח תוצאה."},{"niche_slug":"real-estate","subject_en":"a real estate agent in a casual blazer, around 40","setting_en":"a bright empty apartment living room","product_en":"a sunny balcony with a city view","onscreen_examples_he":{"hook_line":"נכנס או לא נכנס?","sign_text":"מחפשים דירה? אני מכיר כמה","cta_line":"שלחו וואטסאפ ונקבע סיור"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"גוף ראשון לפי מי שמחזיק את השלט: \"אני מכיר\" או \"אני מכירה\"."}],"music_brief":{"mood":"funny","bpm_min":96,"bpm_max":118,"drop_at_ms":2500,"energy_curve":"drop","sfx_cues":[{"beat_key":"sign","kind":"impact"}]},"required_overlays":["sign","sticker"],"shot_list":null,"compliance_notes_he":["רגע הפיתיון נוצר ב-AI ולא מראה פגיעה באף אחד.","מי שמחזיק את השלט הוא דמות AI כללית. אפשר להחליף לתמונה של בעלי העסק, עם הסכמה בכתב.","הטקסט על השלט חייב להיות נכון: עיר, שירות ומחיר כמו שהם באמת."],"do_not_copy":["the reference sign text 'Hãy đến tham quan bảo tàng' and its translation 'Come visit the museum' (also in Hebrew: 'בואו לבקר במוזיאון')","the pole-vault crash footage and any pole-vault bait","the man in sunglasses lying on the floor, his look and his poses","the finger-heart pose sequence as performed in the reference","the reference audio track"],"platform_tone":{"reels":"קצר וחד: בלי הסבר, השלט עושה את העבודה","facebook":"אפשר שורת פתיחה אחת מעל הסרטון, בלי לגלות את הסוף"},"default_duration_sec":15,"default_goal":"awareness","default_video_type":"reel_hook","default_visual_style":"ugc","default_music_mood":"funny","default_caption_preset":"bold-pop","vo_mode":"none","recommended_ad_goal":"local_awareness","niches":["restaurants","fitness-trainers","dentists","real-estate","barbers-salons","beauty-nails","home-services","retail-stores"],"first_seen_at":"2026-10-17","peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד פיתיון ושלט: רילס מצחיק לעסקים","seo_description_he":"רגע מותח, חיתוך חד ושלט בכתב יד עם ההזמנה שלכם. ככה עושים את הטרנד לעסק, עם דוגמאות לפי תחום ומוזיקה שמותרת לפרסום.","is_featured":true,"sort_order":10},
{"slug":"behind-the-viral","name_he":"מאחורי הקלעים","tagline_he":"הבלגן של ההכנות הוא ההוק, והתוצאה מגיעה בסוף","description_he":"צילום רחב וקבוע של הצוות באמצע ההכנות לסרטון, עם התווית \"מאחורי הקלעים\". הצופים לא מבינים מה קורה ונשארים לראות, ובסוף מגיעה התוצאה. אתם מצלמים לפי רשימת צילומים קצרה, ואנחנו עורכים: תווית, כתוביות, האצה, מוזיקה וכרטיס סיום.","why_it_works_he":"סקרנות נקייה: אי אפשר להבין מה הם עושים עד שרואים את התוצאה. אנשים אמיתיים מהעסק בונים אמון, והסרטון מפנה גם לסרטון התוצאה.","hook_type_slug":"behind-the-scenes","lifecycle":"format","production_mode":"guided","ad_safety":"needs_consent","extra_gates":[],"requires_real_footage":true,"requires_people_consent":true,"recipe":{"version":1,"beats":[{"key":"bts","role":"label","duration_ms":0,"purpose_he":"תווית קבועה מעל צילומי ההכנות","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":null,"sfx":null,"speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":{"kind":"bts_label","textHe":"מאחורי הקלעים","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":null,"spans":["chaos","chaos_more"]},{"key":"chaos","role":"bait","duration_ms":3500,"purpose_he":"צילום רחב של כל הצוות באמצע ההכנות, בלי הסבר","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":1.25,"onscreen_slot":{"key":"hook_line","max_chars":40,"example_he":"הסרטון הכי מטורף שצילמנו במסעדה"},"vo_slot":{"key":"chaos_vo","max_words":7},"overlay":null,"guided_shot_key":"wide_chaos","spans":null},{"key":"chaos_more","role":"payoff","duration_ms":7000,"purpose_he":"הבלגן ממשיך, מואץ, וכולם רציניים לגמרי","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":1.5,"onscreen_slot":{"key":"detail_line","max_chars":30,"example_he":"כן, זה בכוונה"},"vo_slot":{"key":"chaos_more_vo","max_words":15},"overlay":null,"guided_shot_key":"wide_chaos","spans":null},{"key":"result","role":"reveal","duration_ms":7500,"purpose_he":"התוצאה הגמורה: למה כל הבלגן היה שווה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"whip","sfx":"whoosh","speed":null,"onscreen_slot":{"key":"result_line","max_chars":30,"example_he":"וזה מה שיצא"},"vo_slot":{"key":"result_vo","max_words":16},"overlay":null,"guided_shot_key":"final_result","spans":null},{"key":"team","role":"payoff","duration_ms":6000,"purpose_he":"הצוות שעשה את זה, מנופף למצלמה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"team_line","max_chars":30,"example_he":"הצוות שעשה את זה"},"vo_slot":{"key":"team_vo","max_words":12},"overlay":null,"guided_shot_key":"team_wave","spans":null},{"key":"cta","role":"cta","duration_ms":6000,"purpose_he":"איך מגיעים אלינו","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"בואו לראות את זה מקרוב"},"vo_slot":{"key":"cta_vo","max_words":12},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"open on the most absurd wide moment of the preparation, everyone in the middle of an action","hook_line_he_pattern":"הסרטון הכי מטורף שצילמנו אצלנו","why_he":"רואים בבת אחת את כל הבלגן, ולא מבינים מה הולך לצאת ממנו."},{"key":"B","bait_concept_en":"open on the moment someone covers the camera lens with a sheet of paper, then reveal the room","hook_line_he_pattern":"מה קורה מאחורי הדף הזה?","why_he":"המסך המכוסה יוצר שאלה, והחשיפה עונה עליה."},{"key":"C","bait_concept_en":"open on one team member keeping a completely straight face in the middle of the chaos","hook_line_he_pattern":"מה עשינו עם {מספר} עובדים ודף נייר?","why_he":"פרצוף רציני באמצע הבלגן מצחיק עוד לפני שמבינים למה."}],"niche_adaptations":[{"niche_slug":"restaurants","subject_en":"the restaurant floor team in work aprons","setting_en":"a busy restaurant bar area","product_en":"a signature dish served at the bar","onscreen_examples_he":{"hook_line":"הסרטון הכי מטורף שצילמנו במסעדה","detail_line":"כן, זה בכוונה","result_line":"וזה מה שיצא","team_line":"צוות הערב שלנו","cta_line":"בואו לראות את זה מקרוב"},"vo_example_he":"ככה נראות ההכנות לסרטון קצר אחד. ועכשיו התוצאה.","cta_type":"whatsapp","notes_he":"כל מי שמופיע בצילום, גם עובדים, צריך לאשר בכתב לפני הפרסום."},{"niche_slug":"event-photographers","subject_en":"a photographer and an assistant with lights and a backdrop","setting_en":"a small photo studio","product_en":"a finished portrait on a camera screen","onscreen_examples_he":{"hook_line":"ככה נראה יום צילומים אצלנו בסטודיו","detail_line":"התאורה לקחה יותר זמן מהצילום","result_line":"וזו התמונה שיצאה","team_line":"הצוות שמאחורי המצלמה","cta_line":"שלחו וואטסאפ וקבעו צילומים"},"vo_example_he":"רוב העבודה קורית לפני שלוחצים על הכפתור.","cta_type":"whatsapp","notes_he":null},{"niche_slug":"beauty-nails","subject_en":"a nail technician and a client at the work table","setting_en":"a calm nail studio with soft lighting","product_en":"a finished set of nails in close-up","onscreen_examples_he":{"hook_line":"ככה נראה יום צילומים אצלנו בסטודיו","detail_line":"רגע לפני שזה מושלם","result_line":"וזו התוצאה","team_line":"הידיים שמאחורי כל ציפורן","cta_line":"קבעו תור אונליין"},"vo_example_he":"לפני כל סרטון יפה יש בלגן קטן. זה שלנו.","cta_type":"booking","notes_he":null},{"niche_slug":"fitness-trainers","subject_en":"a trainer and two clients","setting_en":"a training studio during a busy hour","product_en":"the trainer giving a high five after a set","onscreen_examples_he":{"hook_line":"ככה צילמנו את אימון הבוקר","detail_line":"אף אחד לא הבין מה אנחנו עושים","result_line":"וזה הסרטון שיצא","team_line":"המאמנים של הסטודיו","cta_line":"שלחו הודעה ונתאם אימון"},"vo_example_he":"ככה נראה צילום של סרטון קצר, מאחורי הקלעים.","cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"energetic","bpm_min":110,"bpm_max":128,"drop_at_ms":23500,"energy_curve":"build","sfx_cues":[{"beat_key":"result","kind":"whoosh"}]},"required_overlays":["bts_label"],"shot_list":{"version":1,"intro_he":"שלושה שוטים קצרים, בערך עשר דקות של צילום. אנחנו עורכים, מוסיפים כתוביות ומוזיקה.","estimated_minutes":10,"shots":[{"key":"wide_chaos","title_he":"הבלגן מזווית רחבה","instruction_he":"שימו את הטלפון לאורך על חצובה או על מדף, וצלמו את כל הצוות באמצע ההכנות. לא עוצרים באמצע.","framing":"wide","min_sec":15,"max_sec":45,"ghost":"tripod_wide","tips_he":["האור מגיע מאחורי הטלפון, לא מולו","כולם בתוך המסגרת, גם מי שמחזיק את הדף","בקשו מכל מי שמצטלם אישור לפני שמתחילים"],"people_on_camera":true},{"key":"final_result","title_he":"התוצאה","instruction_he":"צלמו את התוצאה הגמורה: המנה על הבר, הצוות בעמדות, או הסרטון שיצא מההכנות.","framing":"medium","min_sec":5,"max_sec":25,"ghost":"product_center","tips_he":["צילום אחד יציב, בלי לזוז","התוצאה במרכז המסגרת"],"people_on_camera":false},{"key":"team_wave","title_he":"הצוות מזמין","instruction_he":"כל הצוות מול המצלמה, מחייך ומנופף. בלי לדבר, רק תנועה.","framing":"medium","min_sec":3,"max_sec":10,"ghost":"face_center","tips_he":["כולם בגובה העיניים של המצלמה","בקשו מכל מי שמצטלם אישור לפני שמתחילים"],"people_on_camera":true}]},"compliance_notes_he":["כל מי שמופיע בצילום צריך לתת הסכמה בכתב, גם עובדים.","בלי ילדים בצילום.","התוצאה בסוף צריכה להיות אמיתית: מה שהעסק עשה באמת."],"do_not_copy":["the reference restaurant, its bar and its staff","the exact plate-passing choreography and staff positions of the reference","the English 'behind the scenes' caption styling of the reference","the reference music"],"platform_tone":{"reels":"אנרגטי ואמיתי, כמו צילום מהטלפון של הצוות","facebook":"כדאי שורה שמסבירה שזה מאחורי הקלעים של סרטון אחר"},"default_duration_sec":30,"default_goal":"engagement","default_video_type":"reel_hook","default_visual_style":"ugc","default_music_mood":"energetic","default_caption_preset":"bold-pop","vo_mode":"optional","recommended_ad_goal":"local_awareness","niches":["restaurants","event-photographers","beauty-nails","fitness-trainers","catering-chefs","event-venues"],"first_seen_at":"2026-10-17","peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד מאחורי הקלעים: איך מצלמים את זה בעסק","seo_description_he":"צילום רחב של הצוות באמצע ההכנות, ותוצאה בסוף. ככה עושים את טרנד מאחורי הקלעים לעסק, עם רשימת צילומים קצרה ועריכה אוטומטית.","is_featured":false,"sort_order":20},
{"slug":"almost-got-me-reveal","name_he":"כמעט נפגעתי","tagline_he":"קופסאות עפות ישר למצלמה, ובתוך אחת מהן המוצר שלכם","description_he":"צילום מנקודת המבט של הצופה: ערימה של קופסאות עפה ישר לעבר המצלמה, בפיזיקה שברור שהיא לא אמיתית. חיתוך, קופסה אחת נפתחת, ובפנים המוצר שלכם. הכול נוצר ב-AI, עם התווית \"נוצר באמצעות AI\".","why_it_works_he":"כמעט-תאונה מנקודת מבט ראשונה מפעילה תגובה אינסטינקטיבית, והפיזיקה הבלתי אפשרית גורמת לצפות שוב. הקופסה הופכת את המחזה למוצר.","hook_type_slug":"pattern-interrupt","lifecycle":"format","production_mode":"ai","ad_safety":"needs_ai_label","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"bait","role":"bait","duration_ms":3500,"purpose_he":"כמעט-תאונה: קופסאות עפות ישר אל המצלמה","visual_source":"ai_clip","visual_prompt_en":"First-person POV shot, {bait_en}, the objects tumble straight toward the lens, motion blur, bright daylight, playful and clearly impossible physics, nobody is in harm's way","motion_prompt_en":"the objects fly toward the camera and stop just before the lens, quick and exaggerated","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":40,"example_he":"המשלוח הגיע. כמעט דרך המצלמה"},"vo_slot":null,"overlay":{"kind":"meme_caption","textHe":"$onscreen","emoji":"💀","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":null,"spans":null},{"key":"cut1","role":"cut","duration_ms":0,"purpose_he":"חיתוך חד, בלי מעבר","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":"cut","sfx":"impact","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"reveal","role":"reveal","duration_ms":6000,"purpose_he":"קופסה אחת נוחתת ונפתחת, ובפנים המוצר","visual_source":"ai_clip","visual_prompt_en":"Close-up of hands opening a single cardboard box on a sidewalk, revealing {product_en} inside, soft daylight","motion_prompt_en":"the flaps open and the product is lifted slowly toward the camera","camera":"push_in","transition_in":"cut","sfx":"impact","speed":null,"onscreen_slot":{"key":"reveal_line","max_chars":30,"example_he":"וזה מה שהיה בקופסה"},"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"cta","role":"cta","duration_ms":5500,"purpose_he":"המוצר במלוא הדרו, עם הנעה לפעולה","visual_source":"ai_image_kenburns","visual_prompt_en":"{product_en} displayed in {setting_en}, clean bright light, simple composition","motion_prompt_en":"slow orbit around the product","camera":"orbit","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"כל הפרטים באתר"},"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"a delivery van hits a bump in a narrow street and a tall stack of {subject_en} flies off its roof rack","hook_line_he_pattern":"המשלוח הגיע. כמעט דרך המצלמה","why_he":"רגע של בהלה שהופך מיד לצחוק, ואז לשאלה מה יש בקופסה."},{"key":"B","bait_concept_en":"a tower of {subject_en} on a high warehouse shelf tips over and cascades down","hook_line_he_pattern":"רגע, זה נופל עליי?","why_he":"השאלה של הצופה כתובה על המסך, בדיוק ברגע הנכון."},{"key":"C","bait_concept_en":"{subject_en} bounce one after another down a long outdoor staircase","hook_line_he_pattern":"כל הקופסאות האלה בדרך אליי","why_he":"קצב של נפילות חוזרות יוצר מתח עד הקופסה האחרונה."}],"niche_adaptations":[{"niche_slug":"ecommerce","subject_en":"cardboard shipping boxes","setting_en":"a clean, bright product corner with a light background","product_en":"the store's best-selling product, neatly folded","onscreen_examples_he":{"hook_line":"ההזמנה בדרך אליכם. ממש בדרך","reveal_line":"וזה מה שהיה בקופסה","cta_line":"כל הפרטים באתר"},"vo_example_he":null,"cta_type":"visit_site","notes_he":"המוצר בקופסה הוא המוצר האמיתי, באותם צבעים ובאותה אריזה."},{"niche_slug":"movers-storage","subject_en":"moving boxes","setting_en":"a tidy new living room with boxes stacked neatly","product_en":"a neat stack of intact moving boxes next to a moving truck","onscreen_examples_he":{"hook_line":"ככה נראית הובלה בלי תכנון","reveal_line":"המשאית שלנו לא מאבדת אף ארגז","cta_line":"שלחו וואטסאפ להצעת מחיר"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"הקופסאות עפות בצחוק ונוחתות שלמות. לא מראים נזק לרכוש של לקוחות."},{"niche_slug":"restaurants","subject_en":"pizza boxes","setting_en":"a warm pizzeria counter","product_en":"a fresh hot pizza with melted cheese","onscreen_examples_he":{"hook_line":"הפיצה הגיעה. מהר מדי","reveal_line":"ובקופסה? פיצה חמה","cta_line":"הזמינו בוואטסאפ"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"retail-stores","subject_en":"paper-wrapped flower bouquets","setting_en":"a bright flower shop counter","product_en":"a fresh, colourful bouquet in kraft paper","onscreen_examples_he":{"hook_line":"משלוח פרחים, גרסת האקשן","reveal_line":"וזה מה שהגיע","cta_line":"שלחו וואטסאפ והזמינו זר"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"לחנות פרחים: הזרים עפים ונוחתים שלמים."}],"music_brief":{"mood":"energetic","bpm_min":120,"bpm_max":140,"drop_at_ms":3500,"energy_curve":"drop","sfx_cues":[{"beat_key":"reveal","kind":"impact"}]},"required_overlays":["meme_caption"],"shot_list":null,"compliance_notes_he":["סכנה שנראית אמיתית ונוצרה ב-AI מקבלת את התווית \"נוצר באמצעות AI\", גם בפרסום רגיל וגם במודעה.","אף אדם לא נפגע בסרטון, וגם לא נראה כאילו נפגע.","המוצר בסוף הוא המוצר האמיתי של העסק, בלי שיפורים שאין בו."],"do_not_copy":["the reference caption 'The truck almost got me smh' and its Hebrew translation 'המשאית כמעט תפסה אותי'","the highway footbridge shot and the truck hitting the bridge","the hoodie, its printed slogan and the brand handle of the reference","the follow card and the explainer segment of the reference","the reference audio"],"platform_tone":{"reels":"מהיר ומוגזם, כמו מם","facebook":"כדאי שהמוצר יופיע כבר בתמונה המקדימה"},"default_duration_sec":15,"default_goal":"sales","default_video_type":"reel_hook","default_visual_style":"cinematic","default_music_mood":"energetic","default_caption_preset":"bold-pop","vo_mode":"none","recommended_ad_goal":"website_traffic","niches":["ecommerce","movers-storage","restaurants","retail-stores"],"first_seen_at":"2026-10-17","peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד כמעט נפגעתי: חשיפת מוצר מתוך קופסה","seo_description_he":"קופסאות עפות אל המצלמה, חיתוך, והמוצר שלכם יוצא מהקופסה. ככה עושים את הטרנד ב-AI, עם תווית מתאימה ומוזיקה שמותרת לפרסום.","is_featured":false,"sort_order":30},
{"slug":"fake-system-popup","name_he":"התראה מזויפת","tagline_he":"התראה מצחיקה קופצת מעל האוכל, והעיניים נשארות על המנה","description_he":"צילום מנקודת המבט של מי שיושב לשולחן: המנה מגיעה, ובדיוק אז קופצת על המסך התראה שנראית כמו הודעת מערכת. הצופים מנסים לסגור אותה ונשארים להסתכל על האוכל. ההתראה נבנית אצלנו בעברית, בלי לוגו ובלי עיצוב של מערכת מסוימת. מתאים רק לפרסום רגיל.","why_it_works_he":"התראה בזמן הלא נכון היא רפלקס: עוצרים, מנסים ללחוץ וצופים שוב. בכל הזמן הזה המנה נמצאת במרכז המסך.","hook_type_slug":"pattern-interrupt","lifecycle":"format","production_mode":"hybrid","ad_safety":"organic_only","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"bait","role":"bait","duration_ms":3500,"purpose_he":"המנה מוגשת, ומעליה קופצת התראה","visual_source":"ai_clip","visual_prompt_en":"First-person POV at a wooden table in {setting_en}, the viewer's hand resting on the table, a server places {product_en} right in front of the camera, warm appetizing light","motion_prompt_en":"the plate slides into frame and settles, steam rising, the hand stays still","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":70,"example_he":"סוללה חלשה\nכדאי לחבר למטען"},"vo_slot":null,"overlay":{"kind":"fake_ui","variant":"low_battery","titleHe":"$onscreen","bodyHe":"$onscreen","buttonsHe":["סגירה"],"theme":"light","tapAtMs":3050,"fromMs":350,"toMs":3300,"position":"center"},"guided_shot_key":"pov_table","spans":null},{"key":"cut1","role":"cut","duration_ms":0,"purpose_he":"חיתוך חד, בלי מעבר","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":"cut","sfx":"click","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"closeup","role":"reveal","duration_ms":6000,"purpose_he":"תקריב של המנה, בלי שום הפרעה","visual_source":"ai_clip","visual_prompt_en":"Extreme close-up of {product_en}, steam rising, rich textures, warm light","motion_prompt_en":"slow push in across the food","camera":"push_in","transition_in":"cut","sfx":"click","speed":null,"onscreen_slot":{"key":"payoff_line","max_chars":30,"example_he":"ניסיתם לסגור, נכון?"},"vo_slot":null,"overlay":null,"guided_shot_key":"food_closeup","spans":null},{"key":"cta","role":"cta","duration_ms":5500,"purpose_he":"המקום עצמו, עם הזמנה","visual_source":"ai_image_kenburns","visual_prompt_en":"{setting_en} seen from the entrance, inviting evening light, tables set","motion_prompt_en":"slow push in through the entrance","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שמרו מקום בוואטסאפ"},"vo_slot":null,"overlay":null,"guided_shot_key":"place_wide","spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"a low-battery style alert pops up over the food the moment the plate lands","hook_line_he_pattern":"סוללה חלשה\nכדאי לחבר למטען","why_he":"התראה מוכרת בזמן הכי לא נוח, והאוכל ממש מאחוריה."},{"key":"B","bait_concept_en":"a new-message style alert from mom pops up while the camera tilts toward the plate","hook_line_he_pattern":"הודעה חדשה מאמא\nאכלתם כבר?","why_he":"הודעה שכולם מכירים, וחיוך עוד לפני שמבינים שזה חלק מהסרטון."},{"key":"C","bait_concept_en":"an order-arrived style alert pops up exactly as the server sets the tray down from above","hook_line_he_pattern":"ההזמנה הגיעה\nבתיאבון","why_he":"ההתראה מתארת בדיוק את מה שקורה בתמונה, וזה מה שמצחיק."}],"niche_adaptations":[{"niche_slug":"restaurants","subject_en":"a server in a black apron","setting_en":"a cozy restaurant with wooden tables","product_en":"a plate of grilled skewers with a fresh salad","onscreen_examples_he":{"hook_line":"סוללה חלשה\nכדאי לחבר למטען","payoff_line":"ניסיתם לסגור, נכון?","cta_line":"שמרו מקום בוואטסאפ"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"\"נשארו 2 מנות\" רק כשזה נכון באותו יום, עם אישור."},{"niche_slug":"catering-chefs","subject_en":"a private chef in a white jacket","setting_en":"a home dining table set for guests","product_en":"a plated tasting dish with sauce","onscreen_examples_he":{"hook_line":"הודעה חדשה מאמא\nאכלתם כבר?","payoff_line":"אל תדאגו, אכלנו","cta_line":"שלחו וואטסאפ לתפריט לאירוע"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"zimmers-boutique-hotels","subject_en":"a host carrying a breakfast tray","setting_en":"a sunny cabin deck with a mountain view","product_en":"a rich Israeli breakfast tray with shakshuka","onscreen_examples_he":{"hook_line":"ההזמנה הגיעה\nבתיאבון","payoff_line":"ככה מתחיל בוקר אצלנו","cta_line":"בדקו תאריכים בוואטסאפ"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"funny","bpm_min":90,"bpm_max":110,"drop_at_ms":null,"energy_curve":"loop","sfx_cues":[{"beat_key":"closeup","kind":"click"}]},"required_overlays":["fake_ui"],"shot_list":{"version":1,"intro_he":"אפשר להפיק הכול ב-AI, או לצלם שלושה שוטים קצרים בטלפון. את ההתראה בונים אצלנו בכל מקרה.","estimated_minutes":6,"shots":[{"key":"pov_table","title_he":"המנה מגיעה לשולחן","instruction_he":"שימו את הטלפון לאורך בגובה העיניים של מי שיושב, יד אחת על השולחן, וצלמו את רגע ההגשה.","framing":"pov","min_sec":4,"max_sec":12,"ghost":"hands_table","tips_he":["מקום ריק במרכז המסגרת: שם תופיע ההתראה","בקשו מהמלצר אישור לפני שמצלמים"],"people_on_camera":true},{"key":"food_closeup","title_he":"תקריב של המנה","instruction_he":"מתקרבים לאט למנה, מלמעלה או מהצד. אדים או רוטב שנוזל הם בונוס.","framing":"closeup","min_sec":4,"max_sec":10,"ghost":"product_center","tips_he":["אור מהחלון, בלי פלאש","מנגבים את שולי הצלחת לפני הצילום"],"people_on_camera":false},{"key":"place_wide","title_he":"המקום","instruction_he":"צלמו את המקום מהכניסה, בתנועה איטית פנימה.","framing":"wide","min_sec":3,"max_sec":10,"ghost":"tripod_wide","tips_he":["בשעה שיש אורחים, אבל בלי פנים מזוהות"],"people_on_camera":false}]},"compliance_notes_he":["הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים.","ההתראה כללית: בלי לוגו, בלי אייקונים ובלי עיצוב של מערכת הפעלה מסוימת.","\"נשארו 2 מנות\" או כל הגבלה אחרת מופיעים רק כשהם נכונים באותו רגע."],"do_not_copy":["the iPhone-style 'Low Battery' dialog layout, system fonts, icons and the 'Low Power Mode' option","the reference fried-chicken and fries tray composition","the reference restaurant name, logo and staff","the creator explainer and the view counts quoted in it","the reference audio"],"platform_tone":{"reels":"מצחיק ושקט: ההתראה עושה את הרעש","facebook":"פוסט רגיל בלבד, בלי קידום כמודעה"},"default_duration_sec":15,"default_goal":"engagement","default_video_type":"reel_hook","default_visual_style":"ugc","default_music_mood":"funny","default_caption_preset":"bold-pop","vo_mode":"none","recommended_ad_goal":null,"niches":["restaurants","catering-chefs","zimmers-boutique-hotels"],"first_seen_at":"2026-10-17","peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד ההתראה המזויפת: רילס למסעדות ולאוכל","seo_description_he":"התראה מצחיקה קופצת מעל המנה, והצופים נשארים להסתכל על האוכל. ככה עושים את הטרנד לפרסום רגיל, בלי לוגו ובלי עיצוב של מערכת.","is_featured":false,"sort_order":40},
{"slug":"pov-deadpan","name_he":"POV","tagline_he":"משפט אחד שכל לקוח מכיר, ותפנית בסוף","description_he":"שורת POV למעלה, סיטואציה שכל לקוח בתחום מזהה, ותפנית שמראה איך זה נראה אצלכם. הומור דוגרי, בלי להעליב אף אחד. אפשר להפיק ב-AI או לצלם שני שוטים בטלפון.","why_it_works_he":"שורת POV מכניסה את הצופה לנעליים של הלקוח בשנייה אחת. ההזדהות מחזיקה אותו, והתפנית מראה במה אתם שונים.","hook_type_slug":"pov","lifecycle":"evergreen","production_mode":"hybrid","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"pov","role":"label","duration_ms":0,"purpose_he":"שורת POV קבועה מעל הסיטואציה","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":null,"sfx":null,"speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":{"kind":"pov_label","prefix":"POV:","textHe":"$hook","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":null,"spans":["situation","reaction"]},{"key":"situation","role":"bait","duration_ms":3500,"purpose_he":"הסיטואציה המוכרת: מבט יבש למצלמה","visual_source":"ai_clip","visual_prompt_en":"Medium shot of {subject_en} in {setting_en}, looking straight at the camera with a tired, deadpan expression, an everyday moment, natural light","motion_prompt_en":"a slow silent stare, then a small sigh","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":40,"example_he":"הבטיחו לכם שזה ייקח רק שבוע"},"vo_slot":{"key":"situation_vo","max_words":7},"overlay":null,"guided_shot_key":"situation_shot","spans":null},{"key":"reaction","role":"payoff","duration_ms":4000,"purpose_he":"המבט נמשך, והשתיקה אומרת הכול","visual_source":"ai_image_kenburns","visual_prompt_en":"Close-up of {subject_en} in {setting_en}, raising one eyebrow at the camera, deadpan, natural light","motion_prompt_en":"slow push in on the face","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":null,"vo_slot":{"key":"reaction_vo","max_words":8},"overlay":null,"guided_shot_key":"situation_shot","spans":null},{"key":"twist","role":"reveal","duration_ms":4000,"purpose_he":"התפנית: ככה זה אצלכם","visual_source":"ai_clip","visual_prompt_en":"{subject_en} in {setting_en} confidently presenting {product_en}, a small satisfied smile, bright clean light","motion_prompt_en":"a quick confident turn toward the camera and a nod","camera":"push_in","transition_in":"cut","sfx":"pop","speed":null,"onscreen_slot":{"key":"twist_line","max_chars":40,"example_he":"אצלנו לוח זמנים כתוב, ומעדכנים כל יום"},"vo_slot":{"key":"twist_vo","max_words":8},"overlay":null,"guided_shot_key":"twist_shot","spans":null},{"key":"cta","role":"cta","duration_ms":3500,"purpose_he":"הזמנה קצרה","visual_source":"ai_image_kenburns","visual_prompt_en":"{product_en} in {setting_en}, tidy and inviting, soft light","motion_prompt_en":"slow push in","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו וואטסאפ לתיאום"},"vo_slot":{"key":"cta_vo","max_words":7},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"{subject_en} staring silently at the camera, then slowly glancing at a wall calendar","hook_line_he_pattern":"הבטיחו לכם שזה ייקח רק שבוע","why_he":"כל לקוח שמע את המשפט הזה, והמבט היבש אומר את השאר."},{"key":"B","bait_concept_en":"a close-up of a person listening on the phone, eyes rolling, then a slow turn to the camera","hook_line_he_pattern":"שאלתם כמה זה עולה וקיבלתם \"תלוי\"","why_he":"תשובה מתחמקת שכולם מכירים, והצופה מחכה לראות מי עונה אחרת."},{"key":"C","bait_concept_en":"a wide shot of an empty waiting area in {setting_en}, one person checking the time again and again","hook_line_he_pattern":"הגעתם בזמן, ואף אחד לא מחכה לכם","why_he":"תסכול קטן ומוכר, שהתפנית פותרת."}],"niche_adaptations":[{"niche_slug":"renovation-contractors","subject_en":"a renovation contractor in work clothes, around 45","setting_en":"a half-finished bathroom renovation","product_en":"a finished modern bathroom","onscreen_examples_he":{"hook_line":"הקבלן אמר שזה ייגמר עד החג","twist_line":"אצלנו לוח זמנים כתוב, ומעדכנים כל יום","cta_line":"שלחו וואטסאפ לתיאום מדידה"},"vo_example_he":"ואז מגיעים אלינו, ומקבלים לוח זמנים בכתב.","cta_type":"whatsapp","notes_he":"לוח הזמנים והעדכונים צריכים להיות אמיתיים."},{"niche_slug":"dentists","subject_en":"a dentist in a white coat, around 40","setting_en":"a bright dental clinic reception","product_en":"a calm, tidy treatment room","onscreen_examples_he":{"hook_line":"אמרו לכם שזה \"רק משהו קטן\"","twist_line":"אצלנו מסבירים כל שלב לפני שמתחילים","cta_line":"קבעו תור לבדיקה"},"vo_example_he":"אצלנו מסבירים מה עושים ולמה, לפני שמתחילים.","cta_type":"booking","notes_he":"בלי הבטחה לתוצאה ובלי \"בלי כאב\"."},{"niche_slug":"restaurants","subject_en":"a waiter in a black apron, around 30","setting_en":"a busy neighbourhood café","product_en":"a full table of shared dishes","onscreen_examples_he":{"hook_line":"אמרתם \"רק קפה\" ונשארתם לארוחה","twist_line":"זה קורה פה הרבה. ובצדק.","cta_line":"שמרו מקום בוואטסאפ"},"vo_example_he":"זה קורה פה כל יום, ואנחנו לא מתלוננים.","cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"funny","bpm_min":85,"bpm_max":105,"drop_at_ms":7500,"energy_curve":"drop","sfx_cues":[{"beat_key":"twist","kind":"pop"}]},"required_overlays":["pov_label"],"shot_list":{"version":1,"intro_he":"אפשר הכול ב-AI. מי שרוצה להופיע בעצמו מצלם שני שוטים קצרים, בערך חמש דקות.","estimated_minutes":5,"shots":[{"key":"situation_shot","title_he":"המבט היבש","instruction_he":"עמדו מול המצלמה במקום העבודה, הסתכלו ישר לעדשה בלי לחייך, וספרו בלב עד חמש.","framing":"medium","min_sec":4,"max_sec":12,"ghost":"face_center","tips_he":["הטלפון בגובה העיניים, על משטח יציב","בלי לדבר: הטקסט יופיע למעלה"],"people_on_camera":true},{"key":"twist_shot","title_he":"התפנית","instruction_he":"הראו את מה שעושים אחרת: לוח הזמנים, החדר המוכן, המנה. תנועה אחת בטוחה לעבר המצלמה.","framing":"medium","min_sec":4,"max_sec":10,"ghost":"product_center","tips_he":["חיוך קטן מספיק","מה שמראים חייב להיות אמיתי"],"people_on_camera":true}]},"compliance_notes_he":["ההומור על הסיטואציה בתחום, אף פעם לא על לקוחות או על מתחרים בשמם.","מה שמוצג בתפנית חייב להיות נכון: לוח זמנים, מחיר או שירות שקיימים באמת.","דמות AI לא מדברת למצלמה. קריינות מגיעה מקריין, וכשרוצים דיבור מול המצלמה מצלמים את בעלי העסק."],"do_not_copy":["names, faces, voices or handles of creators who made POV skits popular","copyrighted trending sounds used in POV videos","any competitor's name, logo or premises"],"platform_tone":{"reels":"יבש וקצר, הפאנץ׳ בתפנית","facebook":"אפשר להוסיף שורה אחת על השירות מעל הסרטון"},"default_duration_sec":15,"default_goal":"engagement","default_video_type":"reel_hook","default_visual_style":"ugc","default_music_mood":"funny","default_caption_preset":"bold-pop","vo_mode":"optional","recommended_ad_goal":"whatsapp_messages","niches":["renovation-contractors","dentists","restaurants","home-services","auto-services","accountants","lawyers"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד POV לעסקים: ככה עושים רילס דוגרי","seo_description_he":"שורת POV, סיטואציה שכל לקוח מכיר ותפנית שמראה איך זה אצלכם. ככה עושים את הפורמט לעסק, ב-AI או בצילום של שני שוטים.","is_featured":false,"sort_order":50},
{"slug":"before-after-snap","name_he":"לפני ואחרי","tagline_he":"רגע של לפני, חיתוך על הקצב, והתוצאה האמיתית","description_he":"שתי שניות מהירות של המצב לפני, חיתוך חד על הקצב, והתוצאה. בסוף מסך מפוצל שמראה את שני המצבים זה לצד זה. מצלמים רק עבודה אמיתית של העסק, לפי רשימת צילומים, ואנחנו עורכים.","why_it_works_he":"מהפך ויזואלי מבטיח תמורה כבר בשנייה הראשונה. החיתוך על הקצב מספק, והמסך המפוצל משאיר את ההוכחה מול העיניים.","hook_type_slug":"before-after","lifecycle":"evergreen","production_mode":"guided","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":true,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"before","role":"bait","duration_ms":2000,"purpose_he":"המצב לפני, מהר","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":1.5,"onscreen_slot":{"key":"hook_line","max_chars":36,"example_he":"ככה זה הגיע אלינו"},"vo_slot":null,"overlay":null,"guided_shot_key":"before_shot","spans":null},{"key":"cut1","role":"cut","duration_ms":0,"purpose_he":"חיתוך חד על הקצב, כמו כף יד שמכסה את העדשה","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":"cut","sfx":"whoosh","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"after","role":"reveal","duration_ms":5000,"purpose_he":"התוצאה, מאותה זווית","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":"whoosh","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":"after_shot","spans":null},{"key":"split","role":"payoff","duration_ms":4500,"purpose_he":"לפני ואחרי זה לצד זה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"result_line","max_chars":36,"example_he":"{זמן} עבודה, בלי קיצורי דרך"},"vo_slot":null,"overlay":{"kind":"split_reveal","before":{"beatKey":"before","sceneIndex":null},"beforeSource":null,"labelBeforeHe":"לפני","labelAfterHe":"אחרי","dividerFromMs":300,"dividerToMs":800,"fromMs":0,"toMs":null,"position":"auto"},"guided_shot_key":"after_shot","spans":null},{"key":"cta","role":"cta","duration_ms":3500,"purpose_he":"איך מזמינים","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו תמונה וקבלו הצעת מחיר"},"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"open on an extreme close-up of the worst detail of the before state","hook_line_he_pattern":"ככה זה הגיע אלינו","why_he":"הפרט הכי גרוע בשנייה הראשונה, והצופה כבר רוצה לראות את התיקון."},{"key":"B","bait_concept_en":"open on a wide before shot as a hand covers the lens for the transition","hook_line_he_pattern":"רגע לפני שנגענו בזה","why_he":"היד שמכסה את העדשה מבטיחה שינוי, והצופה מחכה לראות מה מתחת."},{"key":"C","bait_concept_en":"open on half a second of the finished result, then jump back to the before state","hook_line_he_pattern":"ניחשתם איך זה נראה קודם?","why_he":"קודם התוצאה, ואז שאלה שמחזירה אחורה: שני הוקים בשנייה אחת."}],"niche_adaptations":[{"niche_slug":"barbers-salons","subject_en":"a client in the barber chair, seen from behind","setting_en":"a modern barbershop","product_en":"a fresh skin fade haircut","onscreen_examples_he":{"hook_line":"ככה הוא נכנס אלינו","result_line":"{זמן} בכיסא. זה ההבדל","cta_line":"קבעו תור אונליין"},"vo_example_he":null,"cta_type":"booking","notes_he":"הלקוח שמופיע צריך לאשר בכתב."},{"niche_slug":"home-services","subject_en":"an air conditioner indoor unit with a dusty filter","setting_en":"a living room wall","product_en":"the same unit with a clean filter","onscreen_examples_he":{"hook_line":"ככה נראה מזגן שלא נוקה הרבה זמן","result_line":"ניקוי יסודי, בלי בלגן בבית","cta_line":"התקשרו ונתאם ביקור"},"vo_example_he":null,"cta_type":"call","notes_he":null},{"niche_slug":"auto-services","subject_en":"a dirty car interior with crumbs and stains","setting_en":"a detailing bay","product_en":"the same interior, spotless","onscreen_examples_he":{"hook_line":"ככה האוטו הגיע אלינו","result_line":"דיטיילינג פנים מלא","cta_line":"שלחו וואטסאפ וקבעו תור"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"renovation-contractors","subject_en":"an old, worn bathroom","setting_en":"a small apartment bathroom","product_en":"the same bathroom after renovation","onscreen_examples_he":{"hook_line":"האמבטיה הזאת חיכתה לנו הרבה זמן","result_line":"{זמן} עבודה, מהפירוק ועד הסיליקון","cta_line":"שלחו תמונה וקבלו הצעת מחיר"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"vets-dog-grooming","subject_en":"a fluffy, matted dog on a grooming table","setting_en":"a bright grooming salon","product_en":"the same dog after a neat grooming","onscreen_examples_he":{"hook_line":"ככה הוא הגיע לטיפוח","result_line":"רחצה, סירוק ותספורת. והוא מרוצה","cta_line":"קבעו תור לטיפוח"},"vo_example_he":null,"cta_type":"booking","notes_he":null}],"music_brief":{"mood":"energetic","bpm_min":115,"bpm_max":135,"drop_at_ms":2000,"energy_curve":"drop","sfx_cues":[{"beat_key":"after","kind":"whoosh"}]},"required_overlays":["split_reveal"],"shot_list":{"version":1,"intro_he":"שני שוטים מאותה זווית: לפני שמתחילים ואחרי שמסיימים. כדאי לסמן על הרצפה איפה עמד הטלפון.","estimated_minutes":5,"shots":[{"key":"before_shot","title_he":"לפני","instruction_he":"צלמו את המצב לפני שמתחילים, לאורך, מאותה זווית שבה תצלמו בסוף. שלוש שניות מספיקות.","framing":"medium","min_sec":3,"max_sec":10,"ghost":"product_center","tips_he":["מסמנים בנייר דבק איפה עמדתם","אותה תאורה גם בצילום של אחרי"],"people_on_camera":false},{"key":"after_shot","title_he":"אחרי","instruction_he":"בדיוק מאותה זווית ובאותו אור, צלמו את התוצאה. תנו לה חמש שניות לפחות.","framing":"medium","min_sec":5,"max_sec":15,"ghost":"product_center","tips_he":["לא מזיזים את הטלפון בין שני הצילומים","בלי פילטרים: התוצאה צריכה להיות אמיתית"],"people_on_camera":false}]},"compliance_notes_he":["רק תוצאות אמיתיות של העסק. אסור לייצר ב-AI את התוצאה.","לקוח שמופיע בצילום צריך לתת הסכמה בכתב.","בקליניקות אסתטיקה ובמרפאות הפורמט לא זמין, בגלל הכללים על לפני ואחרי ברפואה.","משך עבודה או מחיר שמופיעים בסרטון צריכים להיות נכונים."],"do_not_copy":["names, faces or handles of creators known for before-and-after transitions","copyrighted trending sounds used for the transition beat","before or after images that are not the business's own work"],"platform_tone":{"reels":"קצב מהיר, החיתוך בדיוק על הביט","facebook":"כדאי לכתוב במשפט אחד מה נעשה"},"default_duration_sec":15,"default_goal":"trust","default_video_type":"reel_hook","default_visual_style":"before_after","default_music_mood":"energetic","default_caption_preset":"bold-pop","vo_mode":"none","recommended_ad_goal":"whatsapp_messages","niches":["barbers-salons","home-services","auto-services","renovation-contractors","vets-dog-grooming","beauty-nails"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד לפני ואחרי: חיתוך על הקצב לרילס של עסק","seo_description_he":"רגע של לפני, חיתוך על הקצב והתוצאה האמיתית. ככה מצלמים את הטרנד בשני שוטים, ואנחנו עורכים עם מסך מפוצל ומוזיקה מותרת.","is_featured":false,"sort_order":60},
{"slug":"day-in-the-life","name_he":"יום בחיים של…","tagline_he":"יום שלם בעסק, בשישה רגעים קצרים עם שעון","description_he":"שישה שוטים קצרים לאורך היום, כל אחד עם השעה על המסך: פתיחה, הכנות, הלקוח הראשון, העבודה עצמה, השעה העמוסה והסגירה. בסוף משפט אחד שלכם. אנשים אוהבים לראות איך עסק נראה באמת.","why_it_works_he":"תוכן אמיתי ולא מלוטש בונה אמון, והשעון יוצר קצב שקל לעקוב אחריו. צופים נשארים כדי לראות איך היום נגמר.","hook_type_slug":"day-in-life","lifecycle":"evergreen","production_mode":"guided","ad_safety":"needs_consent","extra_gates":[],"requires_real_footage":true,"requires_people_consent":true,"recipe":{"version":1,"beats":[{"key":"open","role":"bait","duration_ms":2500,"purpose_he":"פתיחת היום: מפתח בדלת, אור ראשון","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":36,"example_he":"יום שלם אצלנו, ב-30 שניות"},"vo_slot":{"key":"open_vo","max_words":5},"overlay":{"kind":"clock","time":"07:00","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"open","spans":null},{"key":"prep","role":"reveal","duration_ms":2500,"purpose_he":"ההכנות","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"prep_line","max_chars":30,"example_he":"מכינים הכול"},"vo_slot":{"key":"prep_vo","max_words":5},"overlay":{"kind":"clock","time":"08:30","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"prep","spans":null},{"key":"first_customer","role":"reveal","duration_ms":3000,"purpose_he":"הלקוח הראשון","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"first_customer_line","max_chars":30,"example_he":"הלקוח הראשון"},"vo_slot":{"key":"first_customer_vo","max_words":6},"overlay":{"kind":"clock","time":"10:00","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"first_customer","spans":null},{"key":"craft","role":"reveal","duration_ms":3000,"purpose_he":"העבודה עצמה, מקרוב","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"craft_line","max_chars":30,"example_he":"החלק שהכי אוהבים"},"vo_slot":{"key":"craft_vo","max_words":6},"overlay":{"kind":"clock","time":"12:30","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"craft","spans":null},{"key":"busy","role":"reveal","duration_ms":3000,"purpose_he":"השעה הכי עמוסה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"busy_line","max_chars":30,"example_he":"השעה הכי עמוסה"},"vo_slot":{"key":"busy_vo","max_words":6},"overlay":{"kind":"clock","time":"14:00","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"busy","spans":null},{"key":"closing","role":"reveal","duration_ms":3000,"purpose_he":"סוגרים את היום","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"handheld","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"closing_line","max_chars":30,"example_he":"סוגרים את היום"},"vo_slot":{"key":"closing_vo","max_words":6},"overlay":{"kind":"clock","time":"19:00","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"closing","spans":null},{"key":"reflection","role":"payoff","duration_ms":7000,"purpose_he":"משפט אחד שלכם על למה אתם עושים את זה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"reflection_line","max_chars":40,"example_he":"בשביל הרגע הזה אנחנו פה"},"vo_slot":{"key":"reflection_vo","max_words":15},"overlay":null,"guided_shot_key":"owner_reflection","spans":null},{"key":"cta","role":"cta","duration_ms":6000,"purpose_he":"הזמנה להכיר","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"בואו להכיר אותנו"},"vo_slot":{"key":"cta_vo","max_words":12},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"open on keys turning in the front door at first light","hook_line_he_pattern":"יום שלם אצלנו, ב-30 שניות","why_he":"פתיחה של יום מבטיחה סיפור קצר, עם התחלה וסוף."},{"key":"B","bait_concept_en":"open on the busiest moment of the day, then jump back to the morning","hook_line_he_pattern":"ככה נראית השעה הכי עמוסה אצלנו","why_he":"מתחילים בשיא, ואז חוזרים אחורה כדי לראות איך הגענו לשם."},{"key":"C","bait_concept_en":"open on the owner's tired smile at closing time, then jump back to the morning","hook_line_he_pattern":"מה קורה פה מהבוקר עד הסגירה?","why_he":"סוף היום בהתחלה יוצר סקרנות לגבי כל מה שקרה באמצע."}],"niche_adaptations":[{"niche_slug":"restaurants","subject_en":"the cook and the floor team","setting_en":"a neighbourhood bistro kitchen and dining room","product_en":"the first plates going out of the kitchen","onscreen_examples_he":{"hook_line":"יום שלם במטבח שלנו, ב-30 שניות","prep_line":"ירקות, רטבים, אש","first_customer_line":"ההזמנה הראשונה","craft_line":"המנה שהכי כיף להכין","busy_line":"שעת הצהריים","closing_line":"מנקים ונועלים","reflection_line":"בשביל הצלחות שחוזרות ריקות","cta_line":"בואו לאכול אצלנו"},"vo_example_he":"אנחנו כאן מהבוקר, כדי שבצהריים הכול יהיה מוכן.","cta_type":"whatsapp","notes_he":null},{"niche_slug":"fitness-trainers","subject_en":"a personal trainer and clients","setting_en":"a small training studio","product_en":"a client finishing a set","onscreen_examples_he":{"hook_line":"יום שלם בסטודיו, ב-30 שניות","prep_line":"מסדרים את הציוד","first_customer_line":"אימון הבוקר הראשון","craft_line":"התרגיל שכולם אוהבים לשנוא","busy_line":"שעת השיא","closing_line":"מכבים את האורות","reflection_line":"בשביל ההתקדמות של כל מתאמן","cta_line":"שלחו הודעה ונתאם אימון"},"vo_example_he":"כל יום מתחיל מוקדם, ונגמר כשהמתאמן האחרון יוצא.","cta_type":"whatsapp","notes_he":null},{"niche_slug":"beauty-nails","subject_en":"a nail technician","setting_en":"a calm nail studio","product_en":"a finished manicure in close-up","onscreen_examples_he":{"hook_line":"יום שלם בסטודיו, ב-30 שניות","prep_line":"מסדרים צבעים","first_customer_line":"התור הראשון","craft_line":"הפרט הקטן שעושה את ההבדל","busy_line":"תור אחרי תור","closing_line":"מנקים את השולחן","reflection_line":"בשביל החיוך בסוף כל תור","cta_line":"קבעו תור אונליין"},"vo_example_he":"כל יום פה מתחיל בסידור צבעים, ונגמר בידיים מטופחות.","cta_type":"booking","notes_he":null},{"niche_slug":"event-venues","subject_en":"the venue staff","setting_en":"an event hall being set up","product_en":"the hall ready with tables and lights","onscreen_examples_he":{"hook_line":"יום אירוע אצלנו, ב-30 שניות","prep_line":"פורשים מפות","first_customer_line":"הספקים מגיעים","craft_line":"התאורה נדלקת","busy_line":"האורחים בפנים","closing_line":"מקפלים כיסאות","reflection_line":"בשביל הרגע שהזוג נכנס","cta_line":"שלחו וואטסאפ לתאריך פנוי"},"vo_example_he":"מאחורי כל אירוע יש יום שלם של הכנות.","cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"warm","bpm_min":90,"bpm_max":110,"drop_at_ms":null,"energy_curve":"build","sfx_cues":[]},"required_overlays":["clock"],"shot_list":{"version":1,"intro_he":"שבעה שוטים קצרים לאורך יום אחד. כל שוט לוקח כמה שניות, ובסוף משפט אחד שלכם למצלמה.","estimated_minutes":12,"shots":[{"key":"open","title_he":"פתיחת היום","instruction_he":"צלמו את רגע הפתיחה: מפתח בדלת, תריס שעולה או האור הראשון שנדלק.","framing":"medium","min_sec":3,"max_sec":8,"ghost":"tripod_wide","tips_he":["לאורך, ביד יציבה","אם יש שלט לעסק, כדאי שייראה"],"people_on_camera":false},{"key":"prep","title_he":"ההכנות","instruction_he":"רגע של הכנה: סידור, ניקוי, חומרים על השולחן.","framing":"closeup","min_sec":3,"max_sec":8,"ghost":"hands_table","tips_he":["מקרוב, על הידיים והחומרים"],"people_on_camera":false},{"key":"first_customer","title_he":"הלקוח הראשון","instruction_he":"הרגע שהלקוח הראשון מגיע או שההזמנה הראשונה יוצאת. בלי לצלם פנים בלי אישור.","framing":"medium","min_sec":3,"max_sec":8,"ghost":"tripod_wide","tips_he":["אפשר לצלם מאחור או רק ידיים","בקשו אישור מכל מי שמופיע"],"people_on_camera":true},{"key":"craft","title_he":"העבודה עצמה","instruction_he":"תקריב של החלק שאתם הכי אוהבים בעבודה.","framing":"closeup","min_sec":3,"max_sec":8,"ghost":"hands_table","tips_he":["אור טוב על הידיים","תנועה אחת ברורה"],"people_on_camera":false},{"key":"busy","title_he":"השעה העמוסה","instruction_he":"צילום רחב בשעה הכי עמוסה של היום.","framing":"wide","min_sec":3,"max_sec":10,"ghost":"tripod_wide","tips_he":["הטלפון על משטח, לא ביד","בקשו אישור מכל מי שמופיע"],"people_on_camera":true},{"key":"closing","title_he":"סוגרים","instruction_he":"סוף היום: מכבים אור, מנקים, נועלים.","framing":"medium","min_sec":3,"max_sec":8,"ghost":"tripod_wide","tips_he":["אותה זווית כמו בפתיחה, אם אפשר"],"people_on_camera":false},{"key":"owner_reflection","title_he":"משפט אחד שלכם","instruction_he":"עמדו מול המצלמה ותגידו משפט אחד על למה אתם עושים את זה. אפשר כמה ניסיונות, אנחנו נבחר את הטוב.","framing":"medium","min_sec":5,"max_sec":20,"ghost":"face_center","tips_he":["הטלפון בגובה העיניים","מדברים לאט, כמו לחבר"],"people_on_camera":true}]},"compliance_notes_he":["כל מי שמופיע בצילום צריך לתת הסכמה בכתב, גם עובדים וגם לקוחות.","בלי ילדים בצילום.","הכול אמיתי: השעות, המקום והאנשים של העסק."],"do_not_copy":["names, faces or handles of creators known for day-in-the-life vlogs","copyrighted trending sounds used in vlog edits","time stamps or routines copied from a specific creator's video"],"platform_tone":{"reels":"אמיתי וחם, קצב קבוע","facebook":"מתאים גם לגרסה ארוכה יותר"},"default_duration_sec":30,"default_goal":"trust","default_video_type":"brand_promo","default_visual_style":"day_in_business","default_music_mood":"warm","default_caption_preset":"soft","vo_mode":"optional","recommended_ad_goal":"local_awareness","niches":["restaurants","fitness-trainers","beauty-nails","event-venues","barbers-salons","catering-chefs","vets-dog-grooming"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד יום בחיים של עסק: רילס עם שעון","seo_description_he":"שישה רגעים קצרים לאורך היום, כל אחד עם השעה על המסך, ומשפט אחד שלכם בסוף. ככה מצלמים את הטרנד, ואנחנו עורכים.","is_featured":false,"sort_order":70},
{"slug":"asmr-process","name_he":"תהליך מספק","tagline_he":"מחומר גלם למוצר מוגמר, בלי מילה אחת","description_he":"תקריבים של התהליך, מחומר הגלם ועד התוצאה, בלי דיבור. הצליל עושה את העבודה: אנחנו מוסיפים אפקטים עדינים ומוזיקה רגועה. עובד מצוין גם בלי סאונד.","why_it_works_he":"תהליך שמתקדם מול העיניים מספק ומרגיע, וצופים נשארים עד שהוא נגמר. בלי דיבור הסרטון מובן לכולם, גם בשקט.","hook_type_slug":"satisfying-visual","lifecycle":"evergreen","production_mode":"guided","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":true,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"raw","role":"bait","duration_ms":3000,"purpose_he":"חומר הגלם בתקריב, בשקט","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":24,"example_he":"תעלו את הסאונד"},"vo_slot":null,"overlay":null,"guided_shot_key":"raw_material","spans":null},{"key":"process1","role":"reveal","duration_ms":3000,"purpose_he":"התהליך: התנועה הראשונה","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":1.5,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":"process_close_1","spans":null},{"key":"process2","role":"reveal","duration_ms":3000,"purpose_he":"התהליך: הרגע הכי מספק","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":1.25,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":"process_close_2","spans":null},{"key":"finished","role":"payoff","duration_ms":3000,"purpose_he":"התוצאה המוגמרת","visual_source":"user_media","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"finished_line","max_chars":24,"example_he":"וזה מוכן"},"vo_slot":null,"overlay":null,"guided_shot_key":"finished_result","spans":null},{"key":"cta","role":"cta","duration_ms":3000,"purpose_he":"איך מזמינים","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו וואטסאפ והזמינו"},"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"open on the raw material in an extreme, perfectly still close-up","hook_line_he_pattern":"תעלו את הסאונד","why_he":"שקט מוחלט ותקריב חד מבקשים מהצופה לעצור."},{"key":"B","bait_concept_en":"open in the middle of the process, on the single most satisfying motion","hook_line_he_pattern":"עוד שנייה זה מושלם","why_he":"נכנסים באמצע התנועה, והצופה רוצה לראות אותה נגמרת."},{"key":"C","bait_concept_en":"open on half a second of the finished result, then cut back to the raw material","hook_line_he_pattern":"מאיפה זה התחיל?","why_he":"התוצאה קודם, והתהליך עונה על השאלה."}],"niche_adaptations":[{"niche_slug":"catering-chefs","subject_en":"a chef's hands","setting_en":"a clean professional kitchen counter","product_en":"a beautifully plated dish","onscreen_examples_he":{"hook_line":"תעלו את הסאונד","finished_line":"וזה מוכן לאירוע","cta_line":"שלחו וואטסאפ לתפריט"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"beauty-nails","subject_en":"a nail technician's hands","setting_en":"a calm nail station with soft light","product_en":"a glossy finished manicure","onscreen_examples_he":{"hook_line":"רגע של שקט","finished_line":"וזה מוכן","cta_line":"קבעו תור אונליין"},"vo_example_he":null,"cta_type":"booking","notes_he":null},{"niche_slug":"auto-services","subject_en":"a detailer's gloved hands","setting_en":"a detailing bay","product_en":"a mirror-shine car hood","onscreen_examples_he":{"hook_line":"תעלו את הסאונד","finished_line":"וככה הוא יוצא","cta_line":"שלחו וואטסאפ וקבעו תור"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":null},{"niche_slug":"retail-stores","subject_en":"hands packing an order","setting_en":"a tidy packing table in a small shop","product_en":"a wrapped gift box with a ribbon","onscreen_examples_he":{"hook_line":"אורזים לכם הזמנה","finished_line":"מוכן למשלוח","cta_line":"הזמינו בוואטסאפ"},"vo_example_he":null,"cta_type":"whatsapp","notes_he":"\"מוכן למשלוח\" רק כשיש לחנות משלוחים."}],"music_brief":{"mood":"calm","bpm_min":70,"bpm_max":90,"drop_at_ms":null,"energy_curve":"flat","sfx_cues":[]},"required_overlays":[],"shot_list":{"version":1,"intro_he":"ארבעה תקריבים של תהליך אחד, מההתחלה ועד הסוף. בלי לדבר, רק ידיים וחומרים.","estimated_minutes":8,"shots":[{"key":"raw_material","title_he":"חומר הגלם","instruction_he":"צלמו מקרוב את החומר לפני שמתחילים, בלי לזוז, חמש שניות.","framing":"closeup","min_sec":3,"max_sec":10,"ghost":"product_center","tips_he":["הטלפון על משטח יציב","רקע נקי ופשוט"],"people_on_camera":false},{"key":"process_close_1","title_he":"התחלת התהליך","instruction_he":"התנועה הראשונה, מקרוב: חיתוך, מריחה או קיפול.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["תנועות איטיות ורציפות","אור מהצד מבליט מרקם"],"people_on_camera":false},{"key":"process_close_2","title_he":"הרגע המספק","instruction_he":"הרגע הכי מספק בתהליך, מקרוב, מתחילתו ועד סופו.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["לא חותכים באמצע תנועה"],"people_on_camera":false},{"key":"finished_result","title_he":"התוצאה","instruction_he":"התוצאה הגמורה, מקרוב ואז קצת יותר רחוק.","framing":"closeup","min_sec":3,"max_sec":10,"ghost":"product_center","tips_he":["סיבוב קטן של המוצר מול המצלמה"],"people_on_camera":false}]},"compliance_notes_he":["התהליך והתוצאה של העסק עצמו, בלי עריכה שמשפרת את התוצאה.","הסאונד שלנו הוא אפקטים ומוזיקה ברישיון. לא משתמשים בשיר מטרנד."],"do_not_copy":["names, faces or handles of ASMR creators","copyrighted ASMR or trending audio","process footage that is not the business's own"],"platform_tone":{"reels":"רגוע ומדויק, בלי טקסט מיותר","facebook":"שורה אחת שמסבירה מה מכינים"},"default_duration_sec":15,"default_goal":"awareness","default_video_type":"reel_hook","default_visual_style":"product","default_music_mood":"calm","default_caption_preset":"soft","vo_mode":"none","recommended_ad_goal":"local_awareness","niches":["catering-chefs","beauty-nails","auto-services","retail-stores","restaurants","barbers-salons"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד ASMR לעסקים: תהליך מספק בלי מילים","seo_description_he":"תקריבים של התהליך, מחומר הגלם ועד התוצאה, בלי דיבור. ככה מצלמים את הטרנד בארבעה שוטים, עם אפקטים ומוזיקה רגועה שמותרת לפרסום.","is_featured":false,"sort_order":80},
{"slug":"myth-vs-fact","name_he":"מיתוס מול עובדה","tagline_he":"משפט שכולם מאמינים בו, חותמת \"לא נכון\" והסבר קצר","description_he":"פותחים במיתוס נפוץ בתחום, חותמת \"לא נכון\" קופצת, ואז הסבר קצר וטיפ אחד שאפשר ליישם. הקריינות מסבירה, והחותמות עושות את הדרמה. מתאים לבעלי מקצוע שרוצים להראות ידע בלי להטיף.","why_it_works_he":"מיתוס מוכר יוצר התנגדות מיידית, והחותמת נותנת סיפוק. הצופה יוצא עם משהו שימושי, ומקשר את הידע לעסק.","hook_type_slug":"myth-busting","lifecycle":"evergreen","production_mode":"hybrid","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"myth","role":"bait","duration_ms":3500,"purpose_he":"המיתוס, כמו שכולם אומרים אותו","visual_source":"ai_image_kenburns","visual_prompt_en":"Medium shot of {subject_en} in {setting_en}, one eyebrow raised in mild disbelief, looking at the camera, clean natural light","motion_prompt_en":"a subtle head tilt, otherwise still","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":40,"example_he":"מיתוס: רואה חשבון צריך רק באפריל"},"vo_slot":{"key":"myth_vo","max_words":7},"overlay":null,"guided_shot_key":"talking_head","spans":null},{"key":"cut1","role":"cut","duration_ms":0,"purpose_he":"חיתוך חד, בלי מעבר","visual_source":null,"visual_prompt_en":"","motion_prompt_en":"","camera":null,"transition_in":"cut","sfx":"pop","speed":null,"onscreen_slot":null,"vo_slot":null,"overlay":null,"guided_shot_key":null,"spans":null},{"key":"verdict","role":"payoff","duration_ms":6500,"purpose_he":"חותמת \"לא נכון\", והעובדה במשפט אחד","visual_source":"ai_image_kenburns","visual_prompt_en":"Close-up of {product_en} on a desk in {setting_en}, tidy and well lit","motion_prompt_en":"slow push in","camera":"push_in","transition_in":"cut","sfx":"pop","speed":null,"onscreen_slot":{"key":"fact_line","max_chars":40,"example_he":"תכנון מס עושים לאורך כל השנה"},"vo_slot":{"key":"verdict_vo","max_words":14},"overlay":{"kind":"rating","mode":"verdict","scoreText":null,"verdict":"false","labelHe":"לא נכון","fromMs":0,"toMs":2500,"position":"auto"},"guided_shot_key":"explain_closeup","spans":null},{"key":"why","role":"reveal","duration_ms":8000,"purpose_he":"למה, בשני משפטים","visual_source":"ai_clip","visual_prompt_en":"Hands of {subject_en} arranging {product_en} on a desk in {setting_en}, calm and organised","motion_prompt_en":"the hands move items into neat piles, slow and deliberate","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"why_line","max_chars":40,"example_he":"מי שמתכנן מוקדם, מופתע פחות"},"vo_slot":{"key":"why_vo","max_words":17},"overlay":null,"guided_shot_key":"explain_closeup","spans":null},{"key":"tip","role":"reveal","duration_ms":6000,"purpose_he":"טיפ אחד שאפשר לעשות היום","visual_source":"ai_image_kenburns","visual_prompt_en":"Top-down shot of {product_en} neatly organised on a desk in {setting_en}","motion_prompt_en":"slow top-down push in","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"tip_line","max_chars":40,"example_he":"שמרו קבלות כבר מינואר, בתיקייה אחת"},"vo_slot":{"key":"tip_vo","max_words":12},"overlay":{"kind":"rating","mode":"verdict","scoreText":null,"verdict":"true","labelHe":"ככה עושים נכון","fromMs":200,"toMs":2200,"position":"auto"},"guided_shot_key":null,"spans":null},{"key":"cta","role":"cta","duration_ms":6000,"purpose_he":"הזמנה לשאול","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו וואטסאפ עם השאלה שלכם"},"vo_slot":{"key":"cta_vo","max_words":12},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"a deadpan, slightly sceptical look straight at the camera","hook_line_he_pattern":"מיתוס שכל לקוח שלנו שמע","why_he":"מבט ספקני ושורת מיתוס מזמינים את הצופה לבדוק אם גם הוא האמין בזה."},{"key":"B","bait_concept_en":"a red cross stamp slamming onto a blank card in the first second","hook_line_he_pattern":"את זה אומרים כולם. וזה לא נכון","why_he":"החותמת בשנייה הראשונה מבטיחה תיקון, והצופה רוצה לדעת מה."},{"key":"C","bait_concept_en":"a raised index finger and a quick questioning gesture toward the camera","hook_line_he_pattern":"גם אתם חשבתם ככה?","why_he":"שאלה ישירה שמכניסה את הצופה לשיחה."}],"niche_adaptations":[{"niche_slug":"accountants","subject_en":"an accountant in a smart casual shirt, around 45","setting_en":"a tidy accounting office","product_en":"a neat folder of receipts and a calculator","onscreen_examples_he":{"hook_line":"מיתוס: רואה חשבון צריך רק באפריל","fact_line":"תכנון מס עושים לאורך כל השנה","why_line":"מי שמתכנן מוקדם, מופתע פחות","tip_line":"שמרו קבלות כבר מינואר, בתיקייה אחת","cta_line":"שלחו וואטסאפ עם השאלה שלכם"},"vo_example_he":"מי שמגיע אלינו רק באפריל, כבר מאוחר לתכנן את השנה שעברה.","cta_type":"whatsapp","notes_he":"בלי הבטחה לחיסכון במס. מסבירים עיקרון, לא מבטיחים סכום."},{"niche_slug":"dentists","subject_en":"a dentist in a white coat","setting_en":"a bright dental clinic","product_en":"a dental mirror and a toothbrush on a clean tray","onscreen_examples_he":{"hook_line":"מיתוס: אם לא כואב, אין מה לבדוק","fact_line":"הרבה בעיות מתחילות בשקט","why_line":"בבדיקה רואים מה שעוד לא מרגישים","tip_line":"קבעו בדיקה תקופתית, גם כשהכול בסדר","cta_line":"קבעו תור לבדיקה"},"vo_example_he":"הרבה בעיות בשיניים מתחילות בשקט, ולכן בדיקה תקופתית חשובה גם כשהכול נראה בסדר.","cta_type":"booking","notes_he":"מידע כללי בלבד, בלי הבטחה לתוצאה. ההסתייגות הרפואית נוספת אוטומטית."},{"niche_slug":"fitness-trainers","subject_en":"a fitness trainer in a plain t-shirt","setting_en":"a training studio","product_en":"a pair of dumbbells and a training mat","onscreen_examples_he":{"hook_line":"מיתוס: מספיק לעשות רק קרדיו","fact_line":"אימוני כוח הם חלק חשוב מהתוכנית","why_line":"גוף חזק יותר עושה כל אימון קל יותר","tip_line":"שלבו כוח וקרדיו באותו שבוע","cta_line":"שלחו הודעה ונבנה לכם תוכנית"},"vo_example_he":"קרדיו זה טוב, אבל בלי אימוני כוח התוכנית לא שלמה.","cta_type":"whatsapp","notes_he":"בלי הבטחות לשינוי בגוף ובלי לפני ואחרי של גוף."},{"niche_slug":"mortgage-advisors","subject_en":"a mortgage advisor in a blazer, around 45","setting_en":"a calm office with a large table","product_en":"printed mortgage offers side by side on a table","onscreen_examples_he":{"hook_line":"מיתוס: הבנק תמיד נותן את ההצעה הכי טובה","fact_line":"את ההצעה אפשר לבדוק ולהשוות","why_line":"תמהיל אחר יכול לשנות את ההחזר החודשי","tip_line":"לפני שחותמים, משווים כמה הצעות","cta_line":"השאירו פרטים לשיחת ייעוץ"},"vo_example_he":"ההצעה הראשונה מהבנק היא נקודת פתיחה, לא סוף פסוק.","cta_type":"lead_form","notes_he":"בלי הבטחה לחיסכון או לריבית. ההסתייגות הפיננסית נוספת אוטומטית."}],"music_brief":{"mood":"inspiring","bpm_min":95,"bpm_max":115,"drop_at_ms":null,"energy_curve":"flat","sfx_cues":[{"beat_key":"verdict","kind":"pop"}]},"required_overlays":["rating"],"shot_list":{"version":1,"intro_he":"אפשר הכול ב-AI. מי שרוצה להופיע בעצמו מצלם שני שוטים: משפט למצלמה ותקריב של העבודה.","estimated_minutes":5,"shots":[{"key":"talking_head","title_he":"המשפט למצלמה","instruction_he":"עמדו מול המצלמה ואמרו את המיתוס בטון קצת ספקני, כאילו שמעתם אותו כבר מאה פעם.","framing":"medium","min_sec":3,"max_sec":10,"ghost":"face_center","tips_he":["הטלפון בגובה העיניים","חיוך קטן בסוף המשפט"],"people_on_camera":true},{"key":"explain_closeup","title_he":"תקריב של העבודה","instruction_he":"תקריב של הידיים בעבודה: מסמכים, כלים או ציוד, לפי התחום.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["בלי מסמכים עם פרטים אישיים בפריים"],"people_on_camera":false}]},"compliance_notes_he":["כל עובדה בסרטון צריכה להיות נכונה ומקובלת בתחום. בספק, מנסחים בזהירות.","בלי הבטחה לתוצאה, לחיסכון או לריפוי.","ברפואה, במשפט ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום."],"do_not_copy":["names, faces or handles of creators known for myth-busting videos","myths and wording copied from a specific creator's video","copyrighted trending sounds"],"platform_tone":{"reels":"ענייני וקליל, מהר לעניין","facebook":"מתאים לטקסט ארוך יותר מתחת לסרטון"},"default_duration_sec":30,"default_goal":"trust","default_video_type":"explainer","default_visual_style":"ugc","default_music_mood":"inspiring","default_caption_preset":"clean-box","vo_mode":"required","recommended_ad_goal":"lead_form","niches":["accountants","dentists","fitness-trainers","mortgage-advisors","lawyers","insurance-agents","physio-nutrition"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד מיתוס מול עובדה: רילס לבעלי מקצוע","seo_description_he":"מיתוס נפוץ בתחום, חותמת לא נכון, הסבר קצר וטיפ אחד. ככה עושים את הפורמט לעסק, ב-AI או בצילום, עם קריינות בעברית.","is_featured":false,"sort_order":90},
{"slug":"reply-to-comment","name_he":"עונים לתגובה","tagline_he":"שאלה של לקוח על המסך, ותשובה קצרה וברורה","description_he":"כרטיס תגובה עם שאלה שלקוחות שואלים באמת, ואחריו תשובה קצרה: מה נכון, דוגמה וטיפ. מתאים לשאלות על מחיר, על זמן ועל התנגדויות. משתמשים בשאלה אמיתית באישור, או בשאלה כללית בלי שם.","why_it_works_he":"שאלה שהצופה כבר חשב עליה מושכת אותו פנימה, והתשובה בונה אמון. כך עונים על התנגדויות עוד לפני שהן מגיעות לשיחה.","hook_type_slug":"question","lifecycle":"evergreen","production_mode":"hybrid","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"comment","role":"bait","duration_ms":3500,"purpose_he":"כרטיס התגובה עם השאלה","visual_source":"ai_image_kenburns","visual_prompt_en":"Medium shot of {subject_en} in {setting_en} looking up from a phone with a blank screen toward the camera, thoughtful expression, natural light","motion_prompt_en":"a slow look up from the phone","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":60,"example_he":"כמה זמן לוקח לסדר צוואה?"},"vo_slot":{"key":"comment_vo","max_words":7},"overlay":{"kind":"comment_bubble","leadHe":"לקוח שאל:","textHe":"$onscreen","source":"generic","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"talking_head","spans":null},{"key":"answer","role":"payoff","duration_ms":8000,"purpose_he":"התשובה הקצרה","visual_source":"ai_clip","visual_prompt_en":"Hands of {subject_en} pointing at {product_en} on a desk in {setting_en}, calm explanatory gesture","motion_prompt_en":"the hand moves slowly across the desk, pointing at details","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"answer_line","max_chars":40,"example_he":"פחות מסובך ממה שחושבים"},"vo_slot":{"key":"answer_vo","max_words":17},"overlay":null,"guided_shot_key":"explain_closeup","spans":null},{"key":"example","role":"reveal","duration_ms":7500,"purpose_he":"דוגמה מהשטח","visual_source":"ai_image_kenburns","visual_prompt_en":"{product_en} in {setting_en}, tidy, in focus, soft light","motion_prompt_en":"slow push in","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"example_line","max_chars":40,"example_he":"שיחה מסודרת, ומסמך חתום"},"vo_slot":{"key":"example_vo","max_words":16},"overlay":null,"guided_shot_key":"explain_closeup","spans":null},{"key":"tip","role":"reveal","duration_ms":6000,"purpose_he":"טיפ אחד","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"tip_line","max_chars":40,"example_he":"הכינו מראש רשימה של כל מה שיש"},"vo_slot":{"key":"tip_vo","max_words":12},"overlay":null,"guided_shot_key":null,"spans":null},{"key":"cta","role":"cta","duration_ms":5000,"purpose_he":"הזמנה לשאול עוד","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שאלה? שלחו לנו וואטסאפ"},"vo_slot":{"key":"cta_vo","max_words":10},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"the comment card pops up over a calm shot of the workplace","hook_line_he_pattern":"כמה זמן זה לוקח באמת?","why_he":"שאלה על זמן היא הדבר הראשון שלקוחות רוצים לדעת."},{"key":"B","bait_concept_en":"the comment card appears while {subject_en} smiles and slightly shakes their head","hook_line_he_pattern":"זה באמת שווה את הכסף?","why_he":"התנגדות מוכרת על המסך, והצופה מחכה לראות איך עונים עליה."},{"key":"C","bait_concept_en":"the comment card slides in over a close-up of tools or documents on a desk","hook_line_he_pattern":"אפשר לעשות את זה לבד, לא?","why_he":"שאלה קצת מתגרה פותחת תשובה מקצועית בלי להתנשא."}],"niche_adaptations":[{"niche_slug":"lawyers","subject_en":"a lawyer in a blazer, around 45","setting_en":"a calm law office with bookshelves","product_en":"a signed document in a folder on the desk","onscreen_examples_he":{"hook_line":"כמה זמן לוקח לסדר צוואה?","answer_line":"פחות מסובך ממה שחושבים","example_line":"שיחה מסודרת, ומסמך חתום","tip_line":"הכינו רשימה של הנכסים ושל היורשים","cta_line":"שאלה? שלחו לנו וואטסאפ"},"vo_example_he":"זה תלוי במצב המשפחתי, אבל ברוב המקרים זה פחות מסובך ממה שחושבים.","cta_type":"whatsapp","notes_he":"מידע כללי, לא ייעוץ משפטי. ההסתייגות המשפטית נוספת אוטומטית."},{"niche_slug":"insurance-agents","subject_en":"an insurance agent in smart casual clothes","setting_en":"a bright small office","product_en":"an insurance policy folder on a desk","onscreen_examples_he":{"hook_line":"ביטוח דירה זה לא מיותר?","answer_line":"תלוי מה יש בדירה ומה כבר מכוסה","example_line":"בודקים מה כבר מכוסה, ורק אז מוסיפים","tip_line":"צלמו את תכולת הדירה פעם בשנה","cta_line":"השאירו פרטים לבדיקה"},"vo_example_he":"לפני שמחליטים, בודקים מה כבר מכוסה בפוליסות הקיימות.","cta_type":"lead_form","notes_he":"בלי הבטחה לחיסכון ובלי השוואה לחברה מסוימת."},{"niche_slug":"interior-design","subject_en":"an interior designer","setting_en":"a small bright apartment living room","product_en":"a cosy redesigned living room corner","onscreen_examples_he":{"hook_line":"אפשר לעצב דירה קטנה בלי לשבור קירות?","answer_line":"כן. אור, צבע ורהיטים עושים הרבה","example_line":"אותו סלון, בלי פטיש אחד","tip_line":"מתחילים מהתאורה, לפני הרהיטים","cta_line":"שלחו תמונה של החדר בוואטסאפ"},"vo_example_he":"ברוב הדירות אפשר לשנות המון בלי לשבור אף קיר.","cta_type":"whatsapp","notes_he":"דוגמה רק מפרויקט אמיתי של העסק."},{"niche_slug":"renovation-contractors","subject_en":"a renovation contractor","setting_en":"a kitchen under renovation","product_en":"a refreshed kitchen with new fronts and lighting","onscreen_examples_he":{"hook_line":"אפשר לשפץ מטבח בלי לפרק הכול?","answer_line":"לפעמים כן: חזיתות, משטח ותאורה","example_line":"אותו מטבח, בלי לפרק את הארונות","tip_line":"בודקים את מצב הארונות לפני שמחליטים","cta_line":"שלחו תמונה וקבלו הצעה"},"vo_example_he":"כשהארונות במצב טוב, מחליפים חזיתות, משטח ותאורה, ומדלגים על הפירוק.","cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"warm","bpm_min":85,"bpm_max":100,"drop_at_ms":null,"energy_curve":"flat","sfx_cues":[]},"required_overlays":["comment_bubble"],"shot_list":{"version":1,"intro_he":"אפשר הכול ב-AI. מי שרוצה לענות בעצמו מצלם שני שוטים קצרים.","estimated_minutes":5,"shots":[{"key":"talking_head","title_he":"קוראים את השאלה","instruction_he":"החזיקו טלפון ביד, הרימו מבט למצלמה ותנו רגע של מחשבה, כאילו קראתם עכשיו את השאלה.","framing":"medium","min_sec":3,"max_sec":8,"ghost":"face_center","tips_he":["בלי לדבר בשוט הזה","הטלפון שמצלם בגובה העיניים"],"people_on_camera":true},{"key":"explain_closeup","title_he":"התשובה מקרוב","instruction_he":"תקריב של מה שמסביר את התשובה: מסמך, חומר או דוגמה מהעבודה.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["בלי פרטים אישיים של לקוחות בפריים"],"people_on_camera":false}]},"compliance_notes_he":["השאלה אמיתית ובאישור, או כללית לגמרי: בלי שם, בלי תמונה ובלי עיצוב של רשת מסוימת.","התשובה מדויקת ולא מבטיחה תוצאה.","במשפט, בביטוח ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום."],"do_not_copy":["real comments, usernames or avatars taken from social networks without permission","the comment design of any specific platform","copyrighted trending sounds"],"platform_tone":{"reels":"שיחה קצרה וחמה, כמו תשובה בהודעה","facebook":"מתאים לשאלה בטקסט מעל הסרטון"},"default_duration_sec":30,"default_goal":"leads","default_video_type":"explainer","default_visual_style":"ugc","default_music_mood":"warm","default_caption_preset":"clean-box","vo_mode":"required","recommended_ad_goal":"whatsapp_messages","niches":["lawyers","insurance-agents","interior-design","renovation-contractors","accountants","mortgage-advisors","home-services"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד עונים לתגובה: רילס של שאלה ותשובה","seo_description_he":"שאלה של לקוח על המסך ותשובה קצרה וברורה. ככה עושים את הפורמט לעסק, עם שאלה אמיתית באישור או שאלה כללית, וקריינות בעברית.","is_featured":false,"sort_order":100},
{"slug":"price-reveal","name_he":"כמה זה עולה באמת","tagline_he":"מספר גדול בשנייה הראשונה, ואז מה מקבלים בדיוק","description_he":"המחיר מופיע גדול על המסך בשנייה הראשונה, ואחריו פירוט קצר של מה כלול והצעה אחת. רק מחיר אמיתי ועדכני של העסק. הכול נוצר ב-AI, והמספר נבנה אצלנו בעברית ובפורמט של ערכת המותג.","why_it_works_he":"מחיר הוא מה שכולם רוצים לדעת, ומעט עסקים מראים אותו. שקיפות עוצרת את הגלילה, והפירוט מסביר למה המחיר הוגן.","hook_type_slug":"price-reveal","lifecycle":"evergreen","production_mode":"ai","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"number","role":"bait","duration_ms":3000,"purpose_he":"המחיר, גדול, בשנייה הראשונה","visual_source":"ai_image_kenburns","visual_prompt_en":"Hero product shot in {setting_en}: {bait_en}, {product_en} in sharp focus, dramatic but warm light, empty space in the upper half of the frame","motion_prompt_en":"a slow dramatic push in","camera":"push_in","transition_in":"cut","sfx":"cash","speed":null,"onscreen_slot":{"key":"hook_line","max_chars":36,"example_he":"{מחיר} ₪. וזה מה שמקבלים"},"vo_slot":{"key":"number_vo","max_words":6},"overlay":{"kind":"price","amountHe":"$onscreen","labelHe":"$onscreen","strikeAmountHe":null,"fromMs":300,"toMs":null,"position":"center"},"guided_shot_key":null,"spans":null},{"key":"breakdown","role":"reveal","duration_ms":5000,"purpose_he":"מה כלול, בפירוט קצר","visual_source":"ai_clip","visual_prompt_en":"Slow close-up pan across the details of {product_en} in {setting_en}","motion_prompt_en":"a smooth lateral pan revealing one detail after another","camera":"pan_left","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"breakdown_line","max_chars":40,"example_he":"מנה ראשונה, עיקרית ושתייה"},"vo_slot":{"key":"breakdown_vo","max_words":10},"overlay":null,"guided_shot_key":null,"spans":null},{"key":"offer","role":"payoff","duration_ms":3500,"purpose_he":"ההצעה, רק אם היא אמיתית","visual_source":"ai_image_kenburns","visual_prompt_en":"{product_en} served and ready in {setting_en}, inviting","motion_prompt_en":"slow push in","camera":"push_in","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"offer_line","max_chars":40,"example_he":"בלי תוספות שמגלים בסוף"},"vo_slot":{"key":"offer_vo","max_words":7},"overlay":null,"guided_shot_key":null,"spans":null},{"key":"cta","role":"cta","duration_ms":3500,"purpose_he":"איך מזמינים","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"שלחו וואטסאפ ושמרו מקום"},"vo_slot":{"key":"cta_vo","max_words":7},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"a dramatic slow push-in on the hero product","hook_line_he_pattern":"{מחיר} ₪. וזה מה שמקבלים","why_he":"המספר לפני הכול: הצופה רוצה לדעת אם זה זול או יקר."},{"key":"B","bait_concept_en":"a hand slides a small blank card across the table toward the camera","hook_line_he_pattern":"כמה זה עולה באמת? {מחיר} ₪","why_he":"שאלה ותשובה באותה שורה, בלי לחכות."},{"key":"C","bait_concept_en":"a quick top-down reveal as a cover is lifted off the product","hook_line_he_pattern":"{מחיר} ₪ ל{שירות}. בלי הפתעות","why_he":"חשיפה של המוצר יחד עם המחיר, והבטחה לשקיפות."}],"niche_adaptations":[{"niche_slug":"restaurants","subject_en":"a chef","setting_en":"a cosy restaurant table","product_en":"a business-lunch meal with a starter, a main and a drink","onscreen_examples_he":{"hook_line":"{מחיר} ₪. וזה מה שמקבלים","breakdown_line":"מנה ראשונה, עיקרית ושתייה","offer_line":"בצהריים, בימים א׳ עד ה׳","cta_line":"שלחו וואטסאפ ושמרו מקום"},"vo_example_he":"ארוחה מלאה: מנה ראשונה, עיקרית ושתייה.","cta_type":"whatsapp","notes_he":"המחיר מהתפריט של היום, כולל מע״מ."},{"niche_slug":"home-services","subject_en":"an air conditioning technician in uniform","setting_en":"a bright living room with a wall-mounted AC unit","product_en":"an AC service kit laid out next to the unit","onscreen_examples_he":{"hook_line":"{מחיר} ₪ לניקוי מזגן בבית","breakdown_line":"פילטרים, מאייד והסבר מה מצאנו","offer_line":"מחיר סגור לפני שמתחילים","cta_line":"התקשרו ונתאם ביקור"},"vo_example_he":"ניקוי מלא של המזגן, ובסוף הסבר קצר מה מצאנו.","cta_type":"call","notes_he":null},{"niche_slug":"real-estate","subject_en":"a real estate agent","setting_en":"a bright apartment for sale","product_en":"a sunny four-room apartment living room","onscreen_examples_he":{"hook_line":"{מחיר} ₪ לדירת {מספר} חדרים ב{עיר}","breakdown_line":"מרפסת, חניה ומעלית","offer_line":"סיור בדירה בלי התחייבות","cta_line":"שלחו וואטסאפ ונקבע סיור"},"vo_example_he":"מחיר מבוקש אמיתי, ומה מקבלים בו.","cta_type":"whatsapp","notes_he":"רק מחיר מבוקש עדכני של נכס אמיתי."},{"niche_slug":"beauty-nails","subject_en":"a nail technician","setting_en":"a nail studio table","product_en":"a gel manicure with neat cuticles","onscreen_examples_he":{"hook_line":"{מחיר} ₪ לבנייה בג׳ל","breakdown_line":"הסרה, בנייה, עיצוב וציפוי","offer_line":"מחיר אחד, בלי תוספות","cta_line":"קבעו תור אונליין"},"vo_example_he":"בנייה בג׳ל מההתחלה ועד הסוף, במחיר אחד.","cta_type":"booking","notes_he":null}],"music_brief":{"mood":"energetic","bpm_min":105,"bpm_max":125,"drop_at_ms":300,"energy_curve":"drop","sfx_cues":[{"beat_key":"number","kind":"cash"}]},"required_overlays":["price"],"shot_list":null,"compliance_notes_he":["המחיר אמיתי, עדכני וכולל מע״מ, כמו שהוא מופיע אצלכם.","כל מה שכתוב שכלול, כלול באמת. הגבלות ותנאים כתובים במלואם.","משפטים כמו \"בלי תוספות\" כותבים רק כשזה נכון."],"do_not_copy":["prices, menus or offers of other businesses","names, faces or handles of creators known for price-reveal videos","copyrighted trending sounds"],"platform_tone":{"reels":"ישיר ושקוף, המספר בגדול","facebook":"כדאי לכתוב את המחיר גם בטקסט של הפוסט"},"default_duration_sec":15,"default_goal":"sales","default_video_type":"offer","default_visual_style":"product","default_music_mood":"energetic","default_caption_preset":"poster","vo_mode":"optional","recommended_ad_goal":"whatsapp_messages","niches":["restaurants","home-services","real-estate","beauty-nails","barbers-salons","auto-services"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד חשיפת מחיר: כמה זה עולה באמת","seo_description_he":"המחיר בגדול בשנייה הראשונה, ואז מה כלול והצעה אחת. ככה עושים את הטרנד ב-AI, עם מחיר אמיתי של העסק ומוזיקה שמותרת לפרסום.","is_featured":false,"sort_order":110},
{"slug":"quick-how-to","name_he":"מדריך מהיר","tagline_he":"שלושה טיפים קצרים, וכל אחד אפשר ליישם היום","description_he":"הבטחה קצרה בשנייה הראשונה, שלושה טיפים מעשיים עם קריינות, והזמנה לפנות. טיימר על המסך שומר על קצב. מתאים לכל תחום שיש בו ידע מקצועי.","why_it_works_he":"הבטחה לערך מוגדר בזמן קצר מורידה את המחיר של הצפייה. טיפ שימושי נשמר ונשלח הלאה, והצופה זוכר מי נתן אותו.","hook_type_slug":"how-to","lifecycle":"evergreen","production_mode":"hybrid","ad_safety":"ad_safe","extra_gates":[],"requires_real_footage":false,"requires_people_consent":false,"recipe":{"version":1,"beats":[{"key":"promise","role":"bait","duration_ms":3500,"purpose_he":"ההבטחה: שלושה טיפים, בזמן קצר","visual_source":"ai_clip","visual_prompt_en":"Hands of {subject_en} placing three objects in a row on a table in {setting_en}, clean natural light","motion_prompt_en":"three quick placements, one after another, in rhythm","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"hook_line","max_chars":30,"example_he":"3 טיפים ב-20 שניות"},"vo_slot":{"key":"promise_vo","max_words":7},"overlay":{"kind":"clock","time":"00:20","fromMs":0,"toMs":null,"position":"top"},"guided_shot_key":"talking_head","spans":null},{"key":"tip1","role":"reveal","duration_ms":7000,"purpose_he":"טיפ ראשון","visual_source":"ai_clip","visual_prompt_en":"Close-up of hands demonstrating the first step with {product_en} in {setting_en}","motion_prompt_en":"one clear demonstrative motion, steady framing","camera":"static","transition_in":"cut","sfx":"pop","speed":null,"onscreen_slot":{"key":"tip1_line","max_chars":40,"example_he":"1. מנקים את הפילטר"},"vo_slot":{"key":"tip1_vo","max_words":15},"overlay":null,"guided_shot_key":"demo_1","spans":null},{"key":"tip2","role":"reveal","duration_ms":7000,"purpose_he":"טיפ שני","visual_source":"ai_clip","visual_prompt_en":"Close-up of hands demonstrating the second step with {product_en} in {setting_en}","motion_prompt_en":"one clear demonstrative motion, steady framing","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"tip2_line","max_chars":40,"example_he":"2. בודקים שאין נזילה מתחת ליחידה"},"vo_slot":{"key":"tip2_vo","max_words":15},"overlay":null,"guided_shot_key":"demo_2","spans":null},{"key":"tip3","role":"reveal","duration_ms":7000,"purpose_he":"טיפ שלישי","visual_source":"ai_clip","visual_prompt_en":"Close-up of hands demonstrating the third step with {product_en} in {setting_en}, ending on the result","motion_prompt_en":"one clear demonstrative motion, steady framing","camera":"static","transition_in":"cut","sfx":"pop","speed":null,"onscreen_slot":{"key":"tip3_line","max_chars":40,"example_he":"3. סוגרים חלונות כשהמזגן עובד"},"vo_slot":{"key":"tip3_vo","max_words":15},"overlay":null,"guided_shot_key":"demo_3","spans":null},{"key":"cta","role":"cta","duration_ms":5500,"purpose_he":"למי שרוצה שנעשה את זה בשבילו","visual_source":"brand_card","visual_prompt_en":"","motion_prompt_en":"","camera":"static","transition_in":"cut","sfx":null,"speed":null,"onscreen_slot":{"key":"cta_line","max_chars":30,"example_he":"רוצים שנבדוק? התקשרו"},"vo_slot":{"key":"cta_vo","max_words":11},"overlay":null,"guided_shot_key":null,"spans":null}]},"hook_variants":[{"key":"A","bait_concept_en":"three objects placed in a row in a quick rhythm","hook_line_he_pattern":"3 טיפים ב-20 שניות","why_he":"מספר וזמן מוגדרים: הצופה יודע בדיוק כמה זה ייקח."},{"key":"B","bait_concept_en":"a slow push-in on a professional's tool laid out on a clean table","hook_line_he_pattern":"שלושה דברים שאנחנו בודקים תמיד","why_he":"סוד מקצועי קטן שהצופה רוצה לקחת לעצמו."},{"key":"C","bait_concept_en":"a close-up of the most common mistake, frozen for a moment","hook_line_he_pattern":"הטעות שכולם עושים, ואיך מתקנים","why_he":"טעות מוכרת יוצרת הזדהות, והתיקון נותן ערך מיד."}],"niche_adaptations":[{"niche_slug":"home-services","subject_en":"an air conditioning technician","setting_en":"a living room with a wall-mounted AC unit","product_en":"an AC filter and a soft brush","onscreen_examples_he":{"hook_line":"3 טיפים למזגן לפני הקיץ","tip1_line":"1. מנקים את הפילטר","tip2_line":"2. בודקים שאין נזילה מתחת ליחידה","tip3_line":"3. סוגרים חלונות כשהמזגן עובד","cta_line":"רוצים שנבדוק? התקשרו"},"vo_example_he":"פילטר נקי, בלי נזילות וחלונות סגורים: שלושה דברים פשוטים לפני הקיץ.","cta_type":"call","notes_he":null},{"niche_slug":"physio-nutrition","subject_en":"a physiotherapist","setting_en":"a bright treatment room","product_en":"a yoga mat and a resistance band","onscreen_examples_he":{"hook_line":"3 תרגילים קלים לגב, ליד המחשב","tip1_line":"1. מותחים את הכתפיים לאחור","tip2_line":"2. קמים ללכת כל שעה","tip3_line":"3. המסך בגובה העיניים","cta_line":"קבעו תור להערכה"},"vo_example_he":"שלושה הרגלים קטנים שאפשר להתחיל כבר היום, ליד השולחן.","cta_type":"booking","notes_he":"מידע כללי, לא מחליף בדיקה אישית. בלי הבטחה לריפוי."},{"niche_slug":"vets-dog-grooming","subject_en":"a dog groomer with a calm dog","setting_en":"a bright grooming salon","product_en":"a soft brush, a towel and a dog treat","onscreen_examples_he":{"hook_line":"3 טיפים לרחצה רגועה של הכלב","tip1_line":"1. מסרקים לפני הרחצה","tip2_line":"2. מים פושרים, לא חמים","tip3_line":"3. מייבשים היטב בין האצבעות","cta_line":"קבעו תור לטיפוח"},"vo_example_he":"סירוק, מים פושרים וייבוש טוב. ככה הרחצה נגמרת בלי דרמה.","cta_type":"booking","notes_he":null},{"niche_slug":"accountants","subject_en":"an accountant","setting_en":"a tidy office desk","product_en":"a folder of documents and a laptop with a blank screen","onscreen_examples_he":{"hook_line":"3 דברים לסגור לפני סוף השנה","tip1_line":"1. מסדרים את כל הקבלות","tip2_line":"2. בודקים הוצאות שמותר לדווח","tip3_line":"3. קובעים פגישה לפני דצמבר","cta_line":"שלחו וואטסאפ וקבעו פגישה"},"vo_example_he":"שלושה דברים פשוטים שעושים את סוף השנה הרבה יותר רגוע.","cta_type":"whatsapp","notes_he":null}],"music_brief":{"mood":"inspiring","bpm_min":95,"bpm_max":115,"drop_at_ms":null,"energy_curve":"loop","sfx_cues":[{"beat_key":"tip1","kind":"pop"},{"beat_key":"tip3","kind":"pop"}]},"required_overlays":["clock"],"shot_list":{"version":1,"intro_he":"אפשר הכול ב-AI. מי שרוצה להדגים בעצמו מצלם משפט אחד ושלוש הדגמות קצרות.","estimated_minutes":8,"shots":[{"key":"talking_head","title_he":"ההבטחה","instruction_he":"עמדו מול המצלמה, הרימו שלוש אצבעות ואמרו מה יהיה בסרטון.","framing":"medium","min_sec":3,"max_sec":8,"ghost":"face_center","tips_he":["הטלפון בגובה העיניים","משפט אחד קצר"],"people_on_camera":true},{"key":"demo_1","title_he":"הטיפ הראשון","instruction_he":"הדגימו את הטיפ הראשון בידיים, מקרוב.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["תנועה אחת ברורה"],"people_on_camera":false},{"key":"demo_2","title_he":"הטיפ השני","instruction_he":"הדגימו את הטיפ השני, מאותה זווית.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["אותו אור כמו בשוט הקודם"],"people_on_camera":false},{"key":"demo_3","title_he":"הטיפ השלישי","instruction_he":"הדגימו את הטיפ השלישי, ובסוף הראו את התוצאה.","framing":"closeup","min_sec":4,"max_sec":15,"ghost":"hands_table","tips_he":["משאירים שנייה על התוצאה"],"people_on_camera":false}]},"compliance_notes_he":["כל טיפ נכון ומקובל בתחום, ולא מבטיח תוצאה.","בבריאות ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום.","בלי מוצרים או מותגים של אחרים בפריים."],"do_not_copy":["tips and wording copied from a specific creator's video","names, faces or handles of creators known for quick tutorials","copyrighted trending sounds"],"platform_tone":{"reels":"מהיר ומעשי, טיפ כל כמה שניות","facebook":"כדאי לכתוב את שלושת הטיפים גם בטקסט"},"default_duration_sec":30,"default_goal":"trust","default_video_type":"explainer","default_visual_style":"ugc","default_music_mood":"inspiring","default_caption_preset":"clean-box","vo_mode":"required","recommended_ad_goal":"local_awareness","niches":["home-services","physio-nutrition","vets-dog-grooming","accountants","fitness-trainers","beauty-nails"],"first_seen_at":null,"peak_expected_at":null,"expires_at":null,"seo_title_he":"טרנד מדריך מהיר: שלושה טיפים ברילס אחד","seo_description_he":"הבטחה קצרה, שלושה טיפים מעשיים והזמנה לפנות. ככה עושים את הפורמט לעסק, ב-AI או בהדגמה שלכם, עם קריינות בעברית.","is_featured":false,"sort_order":120}
]
```

### קריטריוני קבלה
- [ ] הבלוק נטען כ-JSON תקין, ושווה ל-`seed/trend_templates.json` אחרי `JSON.parse` (בדיקת CI).

---

## §19. החלטות מימוש של החלק הזה

1. **קריאה ציבורית של תבנית שפרשה:** המדיניות של `anon` ו-`authenticated` היא `status = 'published' or (status = 'retired' and published_at is not null)`, כדי ש-`/trends/[slug]` יישאר זמין (חלק 02). `trend_feed` ו-T2 עדיין מחזירים רק `published` שלא פג. תבנית שפרשה בלי `demo_assets` מחזירה 404 בשכבת הדף (R19).
2. **עמודות הטרנד ב-`projects`** מנוהלות בשרת: הטריגר `projects_trend_guard`, וכתיבה בשני שלבים ב-`POST /api/projects` (§9.2). `trend_same_workspace_guard` מגן על `trend_template_uses` ועל `guided_shoots`.
3. **אילוצים נוספים** על `trend_templates` (`scheduled`, `published`, `consent`) ועל `trend_references` (בסיסים של קישור, YouTube, הערות), וה-trim של `scenes` (500ms לפחות).
4. **`trend_feed` נפתח גם ל-`service_role`**, כי `plan.month.v1` רץ בתהליך. הסינון לפי `lifecycle` של T1 נעשה בנתיב עם קריאת עמודים, והחתימה של המפרט נשארת.
5. **הנתונים בין לקוחות:** שורה אורגנית מתוארכת לפי יום הפרסום ונושאת את התמונה המצטברת האחרונה; `trend_template_benchmark` משתמש במקסימום היומי של `businesses_count` כחסם תחתון ל-`k_min`, על 28 ימים.
6. **הטיוטה השטוחה** `TrendTemplateV1Draft` והממיר `draftToTemplate`; הטוקנים `"$onscreen"` ו-`"$hook"` בתבנית השכבה, והפיצול של טקסט החריץ ב-`fake_ui` וב-`price`.
7. **`SceneOverlayV1`:** `style` הוא ערך אחד (`"default"`) ב-v1; `split_reveal.beforeSource` קיים רק ב-props; `OVERLAY_TEXT_SLOTS` מגדיר את המפתחות של `overlayTexts`.
8. **הקצב של צילום עם trim הוא 0.5–2.0**, כמו בעורך של חלק 03; כמה ביטים משוט אחד מקבלים קטעים רצופים ולא חופפים; `hook_windows` נותן לכל גרסת הוק קטע משלה.
9. **תקיעות** מזוהות בקריאה: ניתוח אחרי 15 דקות, עריכה אוטומטית אחרי 10 דקות. ההמרה ל-MP4 מחליפה את האובייקט של אותו נכס.
10. **A6** מקבל גם `explainer` ו-`demoAssetPaths` (סינון וסידור בלבד), כדי ששלב ההסרה של R19 יעבור דרך נתיב קיים. A7 דורש צילום מוכן בסטודיו לתבנית `guided`.
11. **כללי התבנית TT01–TT27** רצים זהים ב-Python וב-TypeScript; `HE026` ו-`HE027` הם חלק מ-TT20.
12. **`lifecycleBadge`, `allowedDurations` ו-`templateAdEligibility`** כמו ב-§9.3, §7.1 ו-§11.1; פרויקט `hybrid` נוצר רק מ-"צלמו בעצמכם" על תבנית `hybrid`.
13. **ה-seed:** T2 עם שלושה שוטים וביט `team`, והסטיות של §12.3 (כולל החלפת שלט הכושר בגלל `HE026` והתווית "נוצר באמצעות AI"). תבנית `needs_ai_label` יוצרת פרויקט עם `ai_label = true`.
14. **`demo_assets`** נושא את `hook_score` של ההדגמה, ו-A8 מזהיר מתחת ל-60.
15. **`trends_weekly`:** עד 400 נמענים בריצה, בין 08:00 ל-20:00, ודחייה בתוך אותו שבוע ISO בלבד.
16. **קבצים נוספים** ב-`lib/trends/`: `validate.ts`, `overlays.ts`, `demos.ts`, `seed-schema.ts` ו-`recipe-input.ts`; הקבוע `TREND_PREPROCESS_RUNTIME`.
17. **סיבות שגיאה חדשות:** `guided_footage_required`, `MODERATION_BLOCKED.similarity` ו-`EDIT_CONFLICT.analysis_rejected`.

### קריטריוני קבלה
- [ ] כל החלטה ברשימה נרשמת ב-`DECISIONS.md` של הריפו עם הפניה לסעיף כאן, לפני שהקוד שתלוי בה נכנס.

---

## תלויות בין חלקים

- **חלק 00:** שורת `prompt/08-trends-engine.md` במפה (M8) ושורת הבעלות "טרנדים, שכבות הטרנד ב-Remotion, צילום מודרך ← 08"; העיקרון 13 ("מעתיקים פורמט, לא ביטוי"). **רשום בחלק 00:** `seed/trend_templates.json` ו-`seed/scripts/build_trends.py` בטבלת הקבצים (כבר קיים).
- **חלק 01:** `TrendCard`, `TrendLifecycleBadge`, `CameraGhostGuide` ו-`HookScoreBadge` כמו שהם; האזורים (§16.3) והמראה (§16.5) של 11 השכבות; `Amatic SC` ו-`Noto Color Emoji`. **רשום בחלק 01:** תג ההפקה השלישי "AI או צילום" (`hybrid`) ב-`TrendCard`; `remotion/layers/trends/zones.ts` הוא קובץ של החלק הזה עם הנתונים של §16.3.
- **חלק 02:** `/trends` ו-`/trends/[slug]` מרנדרים את התוכן של §11.5 דרך `TREND_PUBLIC_COLUMNS` (כולן בתוך ה-grant של §6.7); `TrendExplainerV1` (§13.3, כולל `how_to_steps[].seconds`). **רשום בחלק 02:** דף של תבנית `retired` בלי `demo_assets` מחזיר 404, ותבנית `retired` עם `published_at` מחזירה 200 עם התג.
- **חלק 03:** קופי `app.trends.*`, `app.guided.*` ו-`admin.trends.*` כאן (§14); הלשונית "מהטרנד" בשלב `hook` ו-"פתיחת ערכת הצילום" בשלב `style`. **רשום בחלק 03:** ארבעת הנוסחים של §14.5 ב-`errors.*`; הכפתור "בעצם, הכול ב-AI" ב-`hybrid`; תקרת ההאטה 0.5× זהה לזו של `guidedAutocut` (§10.5).
- **חלק 04:** ה-SQL של `0014_trends.sql` כאן (§6), עם הבלוק של §2.3 כלשונו בסוף; 0013 ו-0014 נכנסים יחד במיזוג הראשון של M8; 58 enum-ים ו-14 משימות pg_cron; ה-seed של §16 (שלב 14b, `--studio`). **רשום בחלק 04:** ב-§12.7 ובבדיקה של §25 — `anon` קורא גם `retired` עם `published_at`; ב-allow-list `trend_feed` גם ל-`service_role`; גוף A6 כולל `explainer` ו-`demoAssetPaths`; `projects_trend_guard` ו-`trend_same_workspace_guard` ברשימת פונקציות הטריגר; `lib/trends/seed-schema.ts` מייצא את `TrendTemplateSeed` ואת `TREND_TEMPLATE_KEY_ORDER`.
- **חלק 05:** `trendAnalyze` ו-`guidedAutocut` ב-`FLOWS`; שמונת הפרומפטים (`ownerPart: "08"`); `trendBeatPlan`, `applyTrendRecipe`, `TrendOverlays` ו-`buildPromoProps` משתמשים ב-`resolveOverlayTemplate`, ב-`OVERLAY_TEXT_SLOTS` וב-`overlayBox`. **רשום בחלק 05:** ב-§20.4 `playbackRate` של `user_video` עם trim בטווח 0.5–2.0; ב-§18 ה-finalize של עבודה בסביבת `ws-trends-studio` קורא ל-`copyDemoAssets(jobId)`; ב-§11.4 השם `TrendTemplateV1Draft` לטיוטה השטוחה; `SceneOverlayV1.style` הוא `"default"`.
- **חלק 06:** הנוסח של `trends_weekly` (§15); `lint:deps` ורשימת החבילות (§2.4); השמירה וההסרה (§2.2, §16.4, R19); אירועים 91–96; `Permissions-Policy` למצלמה רק בנתיב הצילום; `credit_costs`: `trends.analyze` 0, `guided.shotlist` 0, `guided.autocut` 1 לקליפ; `pnpm trends:demos`. **רשום בחלק 06 §25:** פריטי ⚖️ של §16.5.
- **חלק 07:** ה-FK המאוחרים של `ad_campaigns`, `ad_variants`, `social_posts` ו-`content_plan_items` כאן (§6.4); `trend_feed` משמש את `plan.month.v1`; `ad_safety`, `extra_gates`, `recommended_ad_goal` ו-`templateAdEligibility` משמשים את §9–§10 שם. **רשום בחלק 07:** פרויקט מתבנית `needs_ai_label` נוצר עם `ai_label = true`.
- **נספח E:** `LENGTH_LIMITS` (`sign_text`, `popup_title`, `popup_body`, `meme_caption`) בונים את `SceneOverlayV1` ואת `OVERLAY_TEXT_SLOTS`; `HE026` ו-`HE027` רצים על ה-seed ועל הטיוטות; `fake-system-popup` הוא פרסום רגיל בלבד; כרטיס הטרנד מציג את השורה הקבועה של §19.5.
