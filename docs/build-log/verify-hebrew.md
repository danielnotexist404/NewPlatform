# Verify: Hebrew language and UX copy

This was a read-only review through the Hebrew copy and UX lens. I sampled every part: P0, P1 §1–§2 and §10–§19, all P2 copy (home, niche pages, hooks library, pricing, FAQ, all 7 legal pages, the cookie banner and newsletter), all P3 microcopy (errors, toasts, onboarding, wizard, billing/cancel), all P5 prompt templates, all P6 emails and WhatsApp copy, the App D scripts, the full App E, and the seed (`hooks.json`, `seasons.json`, `niches.json`).
Paths are relative to `scratchpad/build/parts/`, with line numbers from `grep -n`. The owner and canon rules follow the task brief: parts win over spec, and the decision log breaks ties.

**Counts:** 0 blocker · 10 major · 22 minor.

---

## MAJOR

### M1. Free-trial claim "2 סרטונים ראשונים בחינם" goes out without its material limits, and shows to users who never got trial credits
- **Where:** `02-marketing-site.md:416` (TrustRow), `:579` ("התחילו עם 2 סרטונים בחינם"), `:698`, `:709` (home meta description), `:766` (niche meta description); `03-app-ux.md:337` (login trust row), `:537` (projects empty state: "2 הסרטונים הראשונים עלינו.").
- **Why:** The only qualification is a tooltip (`02:421`): watermark, draft quality, 720p, 9:16 only, ≤30 s, one 5-second AI clip. Meta descriptions and the login row can't carry a tooltip. Hiding material limits risks misleading by omission under Consumer Protection Law §2(a), and it breaks App E §2 principle 5 ("אמת לפני הכול") and P0 §3.10. Separately, the P3 empty state appears for *every* user with no projects. That includes `trial_status ∈ {already_claimed, disposable_email, no_identifier}` (P3 §3.5) and members of paid workspaces, so it promises free videos to people who will not get them.
- **Fix:**
  - TrustRow and login row → **"70 קרדיטים לניסיון (כ-2 סרטונים קצרים)"**.
  - Meta descriptions → **"…70 קרדיטים לניסיון, בלי כרטיס אשראי."**
  - `02:579` → **"התחילו עם 70 קרדיטים לניסיון"**.
  - `03:537`: show the sentence only when `plan_id='free' && trial_status='granted' && !has_paid`. Otherwise use **"בוחרים הוק, מאשרים תסריט, ומקבלים סרטון מוכן עם קריינות וכתוביות בעברית."**
  - Wherever the "2 videos" wording stays, add "עם סימן מים" next to it, not only in the tooltip.

### M2. The "הכי פופולרי" badge on the Business plan has no data behind it at launch
- **Where:** `02-marketing-site.md:1384`, `:680`; `01-brand-design.md:1588`; driven by seed `plans.is_highlighted=true` (`04-data-api.md:4488`).
- **Why:** At launch there are zero subscribers, so "most popular" is a false factual claim (Consumer Protection Law §2). It also contradicts P0 §3.10 and P2 §3.11 ("בלי מונים מומצאים").
- **Fix:** Badge text **"מומלץ"** (or **"מתאים לרוב העסקים"**) in P1 §11.2, P2 §3.12 and P2 §7.2. Allow "הכי פופולרי" only behind a data check, for example when the plan holds the most active subscriptions over the last 90 days.

### M3. "ביטול בלחיצה" contradicts the specified two-click flow, including inside P2 itself
- **Where:**
  - "בלחיצה" claims: `02-marketing-site.md:678`, `:1368`, `:1421`, `:1886`, `:1989`, `:2062` (Terms summary, a contractual text), `:2307` (button "ביטול מנוי בלחיצה"); `03-app-ux.md:337`, `:1531`; `06-billing-legal-ops.md:256`, `:1220`, `:1227`, `:1248`.
  - Two-click statements: `02:1523` "מבטלים מעמוד החיוב **בשתי לחיצות**"; `03:1587` "בדיוק 2 לחיצות"; `06:2773` "ביטול ב-2 לחיצות".
- **Why:** The legal summary and the disclosure block (`06:256`) state a mechanism the product does not have. A logged-out user also has to log in first (`02:289`). The P1 glossary (`01:126`) requires the cancel button to be labelled exactly "ביטול מנוי", but P2 uses "ביטול מנוי בלחיצה".
- **Fix:** Use one wording everywhere: **"ביטול אונליין בכל רגע"**. Spell out the mechanism once: **"מבטלים מעמוד החיוב: "ביטול מנוי" ואישור אחד, בלי שיחת שימור."** Change the `/legal/cancellation` button to **"ביטול מנוי"**. Change `06:256` to **"אפשר לבטל בכל רגע בעמוד החיוב, במייל או בטלפון. אחרי ביטול לא יהיו חיובים נוספים."**

### M4. "אנחנו לא שומרים את פרטי הכרטיס" contradicts the privacy policy and the terms
- **Where:** `02-marketing-site.md:1426` (pricing payment line), `:1980` and `:1983` (FAQ `pricing-payment-methods` and its `ByCardOnly` variant). Contradicted by `02:2101` (Terms 6.2, "…וארבע ספרות אחרונות לזיהוי"), `02:2183` (privacy table: "ארבע ספרות אחרונות ותוקף הכרטיס, אסימון תשלום") and `03:1482` ("{brand} שמסתיים ב-{last4}" · "בתוקף עד {mm}/{yy}").
- **Why:** Under Amendment 13, all user-facing statements about what we store must match the §11 notice. Last-4 digits and the expiry date are card details.
- **Fix:** Use **"…אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס."** in all three strings.

### M5. "Free preview" claims are false, because the script (2 credits) and storyboard (1 credit) are charged before the preview
- **Where:** `02-marketing-site.md:514` (HowItWorks: "צופים בתצוגה מקדימה **בחינם**, מאשרים את העלות בקרדיטים"); `03-app-ux.md:856` (preview subtitle: "זו תצוגה מקדימה **בלי עלות**"), which appears right after the button "המשך לתצוגה המקדימה · קרדיט אחד" (`03:852`) and after "המשך לתסריט · 2 קרדיטים" (`03:739`).
- **Why:** This misstates the price (P2 §7.5 lists `script.generate` = 2 and `storyboard.generate` = 1). Inside the app, the user is told "no cost" on the screen they just paid for.
- **Fix:** `02:514` → **"כותבים תסריט וצופים בתצוגה מקדימה (3 קרדיטים), ורק אחרי שמאשרים את העלות נוצר הסרטון המלא…"**. `03:856` → **"הצפייה בתצוגה המקדימה לא עולה קרדיטים: הסצנות מוצגות כגרפיקה בצבעי המותג, והוויז׳ואל האמיתי ייווצר אחרי האישור."**

### M6. Hyphen between a Hebrew prefix letter and a Hebrew variable, about 60 times, including the burned-in watermark
- **Where (sample):**
  - Watermark: `01-brand-design.md:2115`, `05-ai-pipeline.md:3279`, `02:2116`, `03:871`, `03:1213` ("נוצר ב-{{BRAND_NAME}}").
  - `02:626`, `:811`, `:883`, `:1318`, `:2457`, `:2588` ("מ-{{BRAND_NAME}}").
  - `03:340` ("כניסה ל-{{BRAND_NAME}}").
  - `04-data-api.md:59`, `:68`, `:83` (auth email subjects and H1).
  - `06-billing-legal-ops.md:1046`, `:1047`, `:1089` ("ברוכים הבאים ל-{{BRAND_NAME}}"), `:1135`, `:1177`–`1180`, `:1200`, `:1219`, `:1287`, `:1305` ("מ-{agencyName}"), `:1317`, `:1318` ("מ-{approverName}"), `:1323` ("ל-"{workspaceName}""), `:1324` and `:1328` ("מ-{inviterName}"), `:1452` ("ל-{{BRAND_NAME}}").
  - Inconsistent with `03:198`, which writes "עברתם ל"{name}"" with no hyphen.
- **Why:** App E §6.2 rule 5 and §9 allow a hyphen after a prefix letter **only before digits or Latin**. `BRAND.nameHe` is Hebrew by definition (default "קדימון", P0), so these render as "נוצר ב-קדימון", "ברוכים הבאים ל-קדימון" and "הזמנה מ-דנה". That is wrong Hebrew in every free video, every email footer and every auth email. P2 §5.8 (`:1229`) already specifies `withPrefix()` in `lib/hebrew/text.ts` for this purpose, but nothing else uses it.
- **Fix:**
  - Add `BRAND.nameHeWith = { b, l, m, h }` built with `withPrefix()`, and make ICU strings take pre-joined variables (`{inBrand}`, `{toBrand}`, `{fromAgency}`…), for example "נוצר {inBrand}" → "נוצר בקדימון".
  - Supabase templates are pasted literally, so write "בקדימון" / "לקדימון" there.
  - Add a `lint:copy` rule: `[בלמהוש]-\{` (or `-{{`) in `messages/he.json`, emails or MDX is an error unless the variable is declared numeric or Latin.

### M7. Contradictory rules for writing prices in `vo_he` reach the model through few-shots
- **Where:** App E §6.3 row "מחיר" (`90-appendices-d-e.md:3044`: `vo_he` = "ב-149 שקל"); App D example 1 (`:346`, `:487`, `:574`, `:2568`: `vo_he` "ב-{מחיר} שקל"). Against: App E §6.1 exception 2 (`:3016`, which lists `vo_he` and `vo_full_he` as following `shekel_format`), D-260 exception 2 (same rule), P5 §9 section 4 (`05:1008`: "בטקסט לתצוגה (vo_he, vo_full_he)… מחיר עם ₪ לפי shekel_format"), and App D example 5 (`:2324` "ב-₪120").
- **Why:** `pickSampleScript` feeds App D scripts as few-shots (P5 §10.6). The model sees the system rule "₪ per shekel_format" next to an example using "שקל", and output will flip between the two. App E also contradicts itself (§6.1 vs §6.3). The tie-breaker, D-260, says `vo_he` follows `shekel_format`.
- **Fix:**
  - App E §6.3 `vo_he` cell → **"ב-149 ₪ (`suffix`) / ב-₪149 (`prefix`)"**.
  - App D ex. 1 `vo_he` (lines 346 and 487) → **"…ושיפודים לבחירה, ב-{מחיר} ₪. ויוצאים מפוצצים."**
  - `:574` → "בקריינות לתצוגה: `ב-{מחיר} ₪`".
  - Update the §8.2 golden table row 1 to input `ב-{מחיר} ₪`. The spoken output is unchanged: "במאה ארבעים ותשע שקל".

### M8. Canonical copy fails the parts' own `lint:copy` (CI is red as written)
- **Where and why:**
  1. **Banned phrases (HE001) in UI strings:** `03-app-ux.md:548` "**זה הזמן לפרסם**" (banned #9 "זה הזמן ל"); `03:1746` "**המשך לשלב הבא**" (banned #2 "לשלב הבא", matched "בכל הקשר", App E `:2934`). P1 §2.6 makes these errors on `messages/he.json`.
  2. **Slash between Hebrew letters:** "חשבונית מס**/**קבלה" in `02:1525`, `:1979`, `:2105`; `03:1499` (doc-type label and the empty-state text); `06:258`, `:1135`, `:1151`, `:1169`. P1 §2.6 rule "לוכסן בין אותיות עבריות (`[א-ת]/[א-ת]`)" is an error. The P1 glossary (`01:128`) also says to write "חשבונית מס".
  3. **Doublings in MDX:** `content/legal/likeness-consent.mdx` (`02:2494`–`2503`: "מופיע או מופיעה", "רשאי או רשאית", "מסכים או מסכימה") and the voice declaration. P1 §2.6 exempts only *message keys* from the doubling rule, but `lint:copy` also scans `content/**/*.mdx`, which has no keys.
- **Fix:**
  - `03:548` → **"כדאי להתחיל לפרסם עכשיו"**.
  - `03:1746` → **"השלב הבא"**.
  - Invoice wording: marketing, FAQ and terms → **"חשבונית מס"**; document-type label and email row → **"חשבונית מס-קבלה"**, matching the P1 glossary.
  - Add a file-level exemption to P1 §2.6: `content/legal/likeness-consent.mdx` (the form block only), alongside the key list.

### M9. Raw bidi control characters inside UI strings, which P1's `lint:rtl` treats as an error
- **Where:** LRM (U+200E) or RLM (U+200F) inside quoted copy: `02-marketing-site.md:389` and `:391` ("‎@yourbusiness"), `:1917` ("‎+972-50-1234567"); `03-app-ux.md:117` and `:2061` ("JPG, ‏PNG, ‏WEBP…"), `:425`, `:431`, `:1391` ("‎#RRGGBB").
- **Why:** P1 §9.3 (`01:1096`) makes "תווי bidi חשופים… ב-MDX וב-messages/he.json" an **error**. App E §8 says copywriters never type these, because components add them. Since P2 and P3 present these strings as final copy, the agent will paste them as-is and CI will fail.
- **Fix:** Remove the marks from the strings and wrap the Latin tokens with ICU rich text, for example `"…כמו <ltr>@yourbusiness</ltr>."` and `"…JPG, PNG, WEBP, HEIC, MP4 או MOV"`, with each token in `<bdi>` via `Num` or `bdi`. Add a note in P2 §1.3 and P3 §1.4 that copy in these parts never contains raw U+200E/U+200F.

### M10. Count strings without ICU plural produce "1 קרדיטים", "עוד 1 ימים", "1 סצנות נבנו"
- **Where (reachable with n = 1 or 2):**
  - `03-app-ux.md:194` (`creditsRefunded` toast "{count} קרדיטים חזרו ליתרה"), `:193`, `:897` ("חסרים {missing} קרדיטים."), `:1109` ("נשארו בערך {minutes} דקות"), `:1125` and `:1145` ("{refunded} קרדיטים חזרו"), `:1138` ("{n} סצנות נבנו…"), `:730` ("{n} מילים").
  - `03:85` / §23 `INSUFFICIENT_CREDITS` ("עולה {needed} קרדיטים": `hooks.generate` costs 1).
  - `03:1573` ("על {months} החודשים").
  - `02-marketing-site.md:1230` ("עוד {n} ימים", where 1 → "עוד יום אחד" and 2 → "עוד יומיים").
  - `06-billing-legal-ops.md:1112` ("{degradedCount} סצנות"), `:1117`, `:1292` ("בערך {videosLeft} סרטונים", where only 0 is handled), `:1271`.
- **Why:** This is a Hebrew number-agreement error in high-traffic states. P1 §19 acceptance (`01:2455`) already requires ICU plural for the `common.credits` strings, but P3 and P6 re-type the same sentences without it.
- **Fix:**
  - Use `{n, plural, one {…אחד/אחת} two {…} other {# …}}` everywhere. Credits: `{refunded, plural, one {הקרדיט חזר ליתרה} other {# קרדיטים חזרו ליתרה}}`. Days: `{n, plural, one {עוד יום אחד} two {עוד יומיים} other {עוד # ימים}}`. Minutes: `one {נשארה בערך דקה} other {נשארו בערך # דקות}`.
  - Reuse `common.credits.*` instead of re-typing.
  - Add a `lint:copy` rule: `\{[a-zA-Z]+\} [א-ת]+(ים|ות)\b` outside a `plural` block is an error.

---

## MINOR

### m1. Ungrammatical "לבערך": a residue that review-p3 fixed only in P3
- **Where:** `02-marketing-site.md:421` (TrustRow tooltip), `:1956` (FAQ `free`).
- **Fix:** **"70 קרדיטי ניסיון מספיקים בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים."** · FAQ: **"70 קרדיטים לניסיון, שמספיקים בערך לשני סרטונים קצרים…"**

### m2. "מכתבים" is not a Hebrew verb
- **Where:** `02-marketing-site.md:364` (hero variant B: "וכותבים, מקריינים ומכתבים את זה").
- **Fix:** **"…וכותבים, מקריינים ומוסיפים כתוביות, בעברית טבעית."**

### m3. "לילה טוב" used as a greeting
- **Where:** `03-app-ux.md:509` (22:00–04:59), enforced by the test at `:573`.
- **Why:** In Hebrew, "לילה טוב" is a parting phrase ("sleep well"), not a hello.
- **Fix:** 17:00–23:59 **"ערב טוב, {firstName}"**; 00:00–04:59 **"שלום, {firstName}"**. Update the test to expect "ערב טוב" at 23:00.

### m4. Calques and translated-sounding phrasing in user-facing copy (App E §5.3 spirit)
| Where | Now | Replace with |
|---|---|---|
| `03:1109` | "כמעט שם" ("almost there") | **"עוד רגע"** |
| `03:1110` | "אנחנו עדיין על זה." ("still on it") | **"זה לוקח יותר מהרגיל, והיצירה ממשיכה."** |
| `01:1552`, `01:2243` | `aria-label` "פירורי לחם" ("breadcrumbs") | **"מיקום באתר"** |
| `03:99`, `03:2081` | CTA "חזרה לבית" ("back to home") | **"חזרה לדף הראשי"** |
| `02:1176`, `:1184`, `:1186`; `02:1291` table | "מה זה הוק {name_he} ואיך כותבים **אחד**" | **"הוק {name_he}: מה זה ואיך כותבים הוק כזה"** |
| `02:2134` (Terms 12.1) | "השירות ניתן כפי שהוא ובמידה שהוא זמין" ("as is / as available") | **"השירות ניתן כמות שהוא ולפי זמינותו."** |
| `02:2097` (Terms 5.10) | "…— רשאים אנחנו לבטל, אחרי הודעה לכם." | **"…— אנחנו רשאים לבטל אותם, אחרי שנודיע לכם."** |

### m5. Agreement failures from templated names
- `03-app-ux.md:548` and `:1452`: "מתחיל ב-{date}" and "{seasonName} מתחיל ב-{date}" are masculine, but seasons include "חנוכה", "עונת ההרשמה לגנים ולקייטנות" and "חזרה ללימודים". **Fix:** "**החל מ-{date}**" / "**{seasonName}: החל מ-{date}**".
- `02-marketing-site.md:753`, `:757`, `:762`: "מה/מתי {short_name_he} מפרסמים" and "הסרטון הבא של {short_name_he} מתחיל כאן" use a plural verb, but `short_name_he` "סטודיו ליוגה ופילאטיס" (`02:140`) is singular, which breaks the P2 §4.3 rule "צירוף ברבים". "הסרטון הבא של רופאי שיניים" is also semantically odd. **Fix:** set `yoga-pilates.short_name_he` = **"מורי יוגה ופילאטיס"**, and `:762` → **"הסרטון הבא של העסק שלכם מתחיל כאן."**
- `02-marketing-site.md:310` WhatsApp prefill "יש לי עסק בתחום {short_name_he}" produces "עסק בתחום רופאי שיניים". **Fix:** **"היי, ראיתי את העמוד על סרטונים ל{short_name_he} ואשמח לשמוע איך זה עובד"**.
- `06:1158` "{cardBrandHe} שמסתיים ב-{last4}" produces "ויזה שמסתיים". Also `03:1482`. **Fix:** **"כרטיס {cardBrandHe} שמסתיים ב-{last4}"**.

### m6. The season H1 template breaks on real season names
- **Where:** `02-marketing-site.md:1229` "הוקים ל{name_he} {year}", with seed `seasons.json` names "לפני פסח: ניקיונות ושיפוצים", "ינואר: שנה אזרחית חדשה", "אחרי החגים", "11.11, יום הרווקים".
- **Why:** The output includes "הוקים ללפני פסח: ניקיונות ושיפוצים 2027" and "הוקים לינואר: שנה אזרחית חדשה 2027". Also, "ולנטיינז" is a non-standard spelling.
- **Fix:** Add `seasons.title_name_he` (for example "ניקיונות ושיפוצים לפסח", "השנה האזרחית החדשה", "יום הרווקים 11.11", "התקופה שאחרי החגים") and use it in H1, title and description. Rename "ולנטיינז" → **"ולנטיין (יום האהבה)"**.

### m7. Hook-type names with "/" and "X" go into H1s
- **Where:** `02:1176` template plus seed `hook_types.name_he`: "POV / נקודת מבט", "לפני / אחרי", "נתון / מספר", "דחיפות / הצעה", "X טעויות", "תפסיקו לעשות X".
- **Why:** The output includes "מה זה הוק X טעויות ואיך כותבים אחד".
- **Fix:** Require a frontmatter `h1` for every type whose name contains "/" or "X" (CI check), or add `hook_types.title_name_he` ("לפני ואחרי", "רשימת טעויות", "תפסיקו לעשות").

### m8. The services gender toggle is opaque and its example teaches nothing
- **Where:** `03-app-ux.md:428`: ToggleGroup "ז׳ · נ׳", Tooltip "עוזר לנו לכתוב "השיפוץ שלנו" או "הבנייה שלנו" נכון".
- **Why:** "שלנו" doesn't change with gender. Screen readers announce "ז גרש".
- **Fix:** Labels **"זכר · נקבה"** (or `aria-label` "מין דקדוקי: זכר/נקבה"). Tooltip: **"עוזר לנו לכתוב נכון: "השיפוץ החדש" או "הבנייה החדשה"."**

### m9. Terminology drift: one thing, several names
| Concept | Variants found | Use |
|---|---|---|
| App home `/app` | "בית" (`03:280`, `01:1911`), "דשבורד" (`03:416`, `:458`, `:478`, §7 "חזרה לדשבורד"), "ראשי" (breadcrumbs) | **"ראשי"** everywhere |
| Fast path | "סרטון ב-3 קליקים" (`03:309`, `:518`, `:648`, `:908`) vs "בלחיצה/לחיצות" elsewhere | **"סרטון ב-3 לחיצות"** |
| Status label | "סטוריבורד מוכן" (`01:2361`) | **"הסצנות מוכנות"** (users never see "סטוריבורד" elsewhere) |
| Visual style | "סגנון UGC" (`02:130`, `03:803`) | **"צילום טלפון"** |
| `offer` | "מבצע / חג" (`02:123`, `03:672`) vs "מבצע או חג" (`03:309`, `:516`) | **"מבצע או חג"** |
| Theme | "ערכת צבעים" (`01:2270`) vs "ערכת נושא" (`02:258`) | **"ערכת נושא"** |
| Platforms | `common.platforms.shorts` "שורטס", `.whatsapp` "וואטסאפ" (`01:2390`) vs `common.labels` "יוטיוב שורטס", "סטטוס וואטסאפ" (`02:119`) | One source: `lib/labels.ts`; delete `common.platforms` |
| Link-in-bio | "הקישור בפרופיל" (`02:917`, `:940`) | **"הקישור בביו"** (App E §8) |
| Free CTA | "צרו סרטון בחינם" (`02:254`) vs "צרו סרטון חינם" (`02:300`, `01:1593`) | **"צרו סרטון בחינם"** |
| Annual toggle / plan CTA | "חסכו 20%" and "בחירה בתוכנית עסק" (`01:1588`) vs "שנתי · חיסכון של 20%" and "בחרו בעסק" (`02:679`, `:1371`, `:1391`) | P2 wording |

### m10. CtaPicker end-card defaults diverge from `CTA_DEFAULTS` and App E §11.3
- **Where:** `03-app-ux.md:§6.3` table: `call` "חייגו עכשיו", `lead_form` "השאירו פרטים ונחזור אליכם", `save_share` "שמרו את הסרטון לפעם הבאה". These conflict with `05:2145`–`2151` ("התקשרו עכשיו", "השאירו פרטים", "שמרו ושלחו למי שצריך").
- **Why:** App E §11.3 acceptance requires both components to use the same phrasing.
- **Fix:** Copy the P5 values into the P3 table.

### m11. Error copy uses personal plural, so a female or male UI user gets mixed address on one screen
- **Where:** `03-app-ux.md` §1.4 and §23 ("לא חויבתם", "שלא תחכו", "ביקשתם", "שלחתם", "הגעתם", "התחלתם", "אתם הבעלים").
- **Why:** P1 §2.2 (`01:102`) says errors are written impersonally so they need no `select`. App E §4.1 "כלל הברזל" requires one address form per screen.
- **Fix:** Use impersonal forms: **"לא בוצע חיוב."**, **"היו הרבה בקשות בזמן קצר."**, **"הגעת למכסה היומית"** → **"המכסה היומית נוצלה (5)."** Alternatively, add `select` branches as P6 §12.6 does for emails.

### m12. Superlative or absolute marketing claims (App E §2 #9, banned #28 family)
- `02:365` "בעברית **מושלמת**" (H1, variant C) → **"בעברית טבעית"**.
- `02:469` "מנועי ה-AI **המובילים בעולם**" (and `01:129`) → **"מאחורי הקלעים עובדים מנועי AI כמו Veo, Kling ו-Claude, ואנחנו מתאימים מנוע לכל סצנה."** The list should come from the data.
- `02:594` "**כל מה** שעורך הווידאו עשה, עכשיו אוטומטי" → **"מה שעורך הווידאו עשה, עכשיו בכמה לחיצות"**.
- `03:848` "מנגינה חדשה שנוצרת **רק בשבילכם**" contradicts Terms 8.3 ("איננו מתחייבים לבלעדיות") → **"מנגינה חדשה שנוצרת לסרטון הזה"**.

### m13. Privacy and price statements that overstate
- `02:1888` (About): "המידע שלכם נשמר בשרתים באירופה" leaves out US processing, which `02:2007` and `02:2164` state. **Fix:** **"המידע נשמר בשרתים באירופה (חלק מהעיבוד אצל ספקים בארה״ב), לא משמש לאימון מודלים…"**.
- Cookies §1 (`02:2278`) says the localStorage data "לא נשלח אלינו", but `hero_draft_v1` is sent to `/app/create` (`02:407`). **Fix:** "…ונשלח אלינו רק כשממשיכים ליצירת סרטון."
- Footer `02:294` and pricing `02:1525` say "כל המחירים באתר … כוללים מע״מ", but `VatModeToggle` shows ex-VAT prices. **Fix:** append **"(אלא אם מסומן "לפני מע״מ")"**.

### m14. App E §13.2 niqqud rows break App E's own rule 8 and the App D golden check
- **Where:** `90-appendices-d-e.md:3275` "בריכה → בְּרֵכָה" (drops the י), `:3283` "בוקר → בֹּקֶר" (drops the ו).
- **Fix:** **"בְּרֵיכָה"** and **"בּוֹקֶר"**. Stripping niqqud must give back the displayed word (rule 8 at `:3262`).

### m15. Seed hooks violate App E length and punctuation rules
- **Length:** 3 hooks exceed the 12-word `HE010` limit (App E §12):
  - `real-estate-01` (14 words; also used as a P2 sample-script hook and in the blog) → **"3 דברים לבדוק לפני שחותמים על דירה. על השלישי מתווכים שותקים"**.
  - `mortgage-advisors-05` (13) → **"מיתוס: "אנחנו 20 שנה בבנק, יתנו לנו את הריבית הכי טובה""**.
  - `zimmers-boutique-hotels-03` (13).
- **Parentheses:** 10 hooks contain parentheses, which App E §9 bans in hooks ("לא בהוקים"): `barbers-salons-09`, `fitness-trainers-09`, `dentists-02`, `ecommerce-03`, `lawyers-05`, `accountants-06`, `insurance-agents-09`, `djs-musicians-03`, `zimmers-boutique-hotels-03`, `vets-dog-grooming-02`.
- **Fix:** Rewrite the hooks with " – " or a second sentence (for example "3 סימנים שאולי צריך טיפול שורש. השלישי מפתיע"). Add `HE009` and `HE010` to the seed checker (`04-data-api.md:4300`).

### m16. MDX bodies contain `{…}` placeholders that MDX parses as JS expressions, so the copy won't render
- **Where:**
  - `02:1205`–`1207` (`pov.mdx`: "POV: {רגע מוכר מהחיים של הלקוח}", "{שירות} ב{עיר}").
  - `02:1263` (`facebook.mdx`: "גרים ב{עיר}?").
  - `02:1746` (blog body "{{BRAND_NAME}}"). LegalPage substitutes variables only for legal MDX.
- **Fix:** Escape the braces (`\{עיר\}`) or render them with `<Placeholder name="עיר" />`. Run the `{{…}}` substitution as a remark step for all `content/**/*.mdx`.

### m17. Delete-confirmation example contradicts the real dialog
- **Where:** `01:144` example "…**אי אפשר לשחזר אותו**." vs `03:534` "אפשר לשחזר תוך 30 יום דרך התמיכה".
- **Fix:** Change `01:144` to **"למחוק את הפרויקט "מבצע חנוכה"? אפשר לשחזר אותו תוך 30 יום דרך התמיכה."**

### m18. Favorites empty state is awkward and its icon is inconsistent
- **Where:** `01:2374` "כוכב על הוק שומר אותו כאן." The P2 card mock shows "♡ שמירה" (`02:999`), while the P1 icon map uses `Star` (`01:1925`).
- **Fix:** **"עוד אין הוקים שמורים. לחיצה על הכוכב בכרטיס של הוק שומרת אותו כאן."** Change the mock to ☆.

### m19. Tilde used for "about"
- **Where:** `03-app-ux.md:1115` "~{seconds} שנ׳".
- **Why:** Screen readers read "tilde". `common.time.approxSeconds` already exists.
- **Fix:** **"כ-{n} שנ׳"**.

### m20. Email copy breaks P6's own conventions
- `06:1165` "ולא יותר מ-**₪100**" and `06:257` (disclosure) hard-code the fee cap, which breaks the `06:1086` rule ("₪100 … מגיעים כמשתנים `{feeCap}`"). **Fix:** use `{feeCap}`.
- The magic-link template (`04-data-api.md:62`–`79`) has `<table>` without `dir="rtl"` and `<td>` without `align="right"`. P6 §12.2 rule 1 says Outlook ignores body CSS direction. **Fix:** add `dir="rtl"` to the table and `align="right" style="text-align:right"` to the td.

### m21. Small grammar and clarity fixes in user-facing copy
| Where | Now | Fix |
|---|---|---|
| `02:2009` | "WCAG 2.2 ברמה AA, **שמחמירה מהדרישה** של…" | "…, **שמחמירה יותר מהדרישה** של…" |
| `02:1462` | "גללו לצד **לראות** את כל התוכניות" | "גללו הצידה **כדי לראות** את כל התוכניות" |
| `02:1171` | "יש {count} דרכים… **ומחולקות** לשמונה משפחות" | "יש {count} דרכים עיקריות לפתוח סרטון, **בשמונה משפחות**:" |
| `03:1570` | "ההחזר יוצא לכרטיס שבו שילמתם תוך 14 יום לכל היותר" (ambiguous) | "ההחזר יוצא **תוך 14 יום לכל היותר** (בדרך כלל באותו יום) לכרטיס שבו שילמתם" |
| `03:525` | "{credits} קרדיטים **שמורים**" (reads as "saved") | "**שוריינו** {credits} קרדיטים" |
| `02:1108` | sort "הכי הרבה סרטונים נוצרו" | "**הכי הרבה סרטונים**" |

### m22. Hebrew maqaf (U+05BE) in user-facing text
- **Where:** `02:147` short name "די־ג׳ייז ומוזיקאים" (the seed name is "DJ…"), `02:2393` "אודיו־דסקריפשן", `06:1146` "אי־פעם".
- **Why:** App E §9 says the Hebrew maqaf is not used.
- **Fix:** **"דיג׳ייז ומוזיקאים"** (matching the seed spelling), **"תיאור קולי"** (drop the loanword), **"אי-פעם"**.

---

### Checked and found consistent (no finding)
- Banned phrases: none appear in marketing, emails or prompts outside the negative-example tables.
- No masculine-singular UI imperatives (D-262 grep). No gender slash, dot or parentheses forms in UI.
- "הכול" spelling, ״/׳ usage and ₪-prefix in UI (D-260): all correct.
- VAT maths (₪100.85, ₪244.92, ₪80.51, ₪966.10) and refund examples (₪98.17, ₪170.05, ₪1,848): correct.
- Quiet-day banner wording matches the official names of יום הזיכרון and יום השואה. ERAN 1201 is correct.
- The 47% Facebook/Nielsen wording ("עד") matches `docs/research/07-hooks.md`.
- The ₪5,000 allocation threshold from 1.6.2026 matches `06-israel.md`.
- `sys.hebrew_style.v1`, the inflection tables (App E §4.4–4.5, P6 §12.6) and `numberToHebrew` agreement rules are grammatically sound.
