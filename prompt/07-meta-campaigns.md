# חלק 07 — קמפיינים ופרסום ב-Meta: חיבור, השקה, ניהול, דוחות ולידים

החלק הזה הופך סרטון מוכן לתוצאה עסקית, בלי שבעל העסק יפתח את מנהל המודעות של מטא: חיבור חשבון הפייסבוק והאינסטגרם, בניית קמפיין בארבעה צעדים, פרסום אחרי אישור מפורש, דשבורד בעברית פשוטה עם ארבעה מספרים, תיבת לידים, פרסום רגיל ותזמון, ולוח תוכן.
הוא כולל את המיגרציה `0013_meta_integration.sql` במלואה, את כל הנתיבים עם חוזי Zod, את ה-webhooks, ה-crons וה-workflows של Meta, את המסכים עם המיקרו-קופי הסופי, את הטקסט המלא של שבעה פרומפטים ואת הנוסח של תשעה מיילים.
בנוסף הוא הבעלים של שלוש התוספות שהמייסד אישר: "דף העסק" (דף נחיתה אוטומטי, פיצ׳ר בתשלום), "בדיקת דופק" (בדיקה חינמית של חשבון מודעות קיים) ו"תוכנית 30 יום", ושל מפת הדרכים שאחרי M11.
כל השמות כאן הם חוזה (חלק 00 §4), ו"דף העסק" הוא פיצ׳ר בתשלום לפי החלטת המייסד (§14.1). רשימות האב נשארות בחלקים שלהן (נתיבים, קודי שגיאה ומיגרציות בחלק 04, פרומפטים ומודלים בחלק 05, משתני סביבה, דגלים, מיילים ואנליטיקה בחלק 06, נתיבי `/app` בחלק 03), עם הפניות לכאן.

---

## §1. מטרה, עקרונות מוצר ומבנה הקבצים

### 1.1 למי ובשביל מה

**הקהל:** עסקים קטנים בישראל בתחילת הדרך, ועסקים בצמיחה, שרוצים לפרסם בפייסבוק ובאינסטגרם בתשלום בלי לשבור את הבנק, בלי לשלם למשווק אלפי שקלים בחודש ובלי ללמוד את מנהל המודעות של מטא.

**הלולאה שכל מסך בחלק הזה משרת:** לוחצים, ויש סרטון בעברית (הרבה פעמים מפורמט טרנדי, חלק 08) ← מעלים אותו כקמפיין בפייסבוק ובאינסטגרם, או כפוסט רגיל, מתוך הממשק שלנו ← רואים דוח פשוט בעברית: כמה הוצאתם, כמה אנשים ראו, כמה פניות הגיעו, כמה עלתה כל פנייה ← משנים תקציב, משהים או מגבירים את ההוק המנצח מאותו מקום.

**המשפט הפנימי:** "סרטון טרנדי בעברית בדקות, קמפיין בפייסבוק ובאינסטגרם בלחיצה, ודוח שמבינים. בלי סוכנות ובלי מנהל המודעות של מטא."

**היתרון שהממשק צריך להוכיח בכל צעד:** קריאייטיב עברי מקורי עם שכבות RTL; פורמטים טרנדיים שכל נישה יכולה להפיק; תוצאות שמתחילות בוואטסאפ ("פניות בוואטסאפ", "₪ לפנייה"); דוח של ארבעה מספרים ומשפט אחד; פרסום רגיל ופרסום ממומן באותה לולאה; 0% מהתקציב, ואנחנו לעולם לא מחזיקים כסף של פרסום; מעקות בטיחות — הכול נוצר מושהה, הפעלה רק באישור מפורש, תקרות קשיחות ויומן שינויים.

**הסיכון האסטרטגי ותגובת המוצר:** ה-AI של מטא עצמה משתפר כל הזמן. החפיר שלנו הוא קריאייטיב בעברית, ידע לפי נישה, מהירות בטרנדים וממשק פשוט — לא צנרת ה-API. לכן החלק הזה משתמש באוטומציה של מטא (Advantage+: קהל, מיקומים ותקציב ברמת הקמפיין) במקום להילחם בה, ומסתיר את המונחים שלה מאחורי ברירות מחדל טובות.

### 1.2 עקרונות מוצר מחייבים

1. **כסף של פרסום:** 0% מהתקציב. התקציב משולם ישירות למטא מאמצעי התשלום שבחשבון המודעות של הלקוח. אנחנו לא גובים, לא מחזיקים ולא מחזירים כסף של פרסום (חלק 06 §1). השקה, ניהול ודוחות לא עולים קרדיטים; רק יצירת סרטונים עולה קרדיטים, כמו היום, ו"דף העסק" עולה קרדיטים ביצירה (§14).
2. **הכול נוצר מושהה.** כל אובייקט במטא (קמפיין, קבוצת מודעות, קריאייטיב, מודעה) נוצר ב-`PAUSED`. מה שגורם להוצאה הוא רק הלחיצה על **"פרסום"** של בעלים או מנהל, אחרי סימון תיבת האישור, או חידוש שלהם.
3. **תקרות בכל מקום שמחליטים בו על כסף:** תקרת התוכנית (ניהול הוצאה חודשית, §17) ותקרה חודשית אישית אופציונלית. הן מוצגות בשלב התקציב, בדף הקמפיין ובדשבורד, ולעולם לא משהות מודעות של הלקוח בגלל תקרת התוכנית.
4. **יומן שינויים** לכל פעולה, של משתמש, של כלל אוטומטי או של המערכת, בעברית.
5. **אמת בתוצאות.** אין הבטחה ואין חיזוי. אין "ממוצע בתחום שלכם" ואין השוואה ללקוחות אחרים. כל מספר בדוח מגיע מהנתונים של הלקוח עצמו. לפני מדגם מינימלי (`app_settings.meta_min_sample`) כתוב **"עדיין מוקדם לקבוע"**.
6. **"אחרי בדיקה של מטא"** מופיע בכל מקום שבו הממשק רומז ש"זה באוויר": מטא בודקת כל מודעה לפני שהיא רצה, ואנחנו לא מבטיחים זמן.
7. **וואטסאפ קודם.** מטרת ברירת המחדל לנישות שירות היא "הודעות בוואטסאפ", והניסוחים מכוונים לפנייה בוואטסאפ (נספח E §11).
8. **מינימום מידע.** טוקנים מוצפנים בלבד, לא מגיעים לדפדפן, ללוגים, ל-Sentry, לאנליטיקה או לפרומפט. לידים לא נכנסים לשום פרומפט, לא משמשים לשיווק שלנו ולא מצטרפים בין לקוחות.

### 1.3 טענות בתוך האפליקציה

| טענה | מותר? | תנאי |
|---|---|---|
| "0% מהתקציב. התקציב משולם ישירות למטא, מהכרטיס שלכם" | מותר | נכון לפי התכנון |
| "לא צריך להכיר את מנהל המודעות של מטא" | מותר | — |
| "מסרטון לקמפיין בכמה דקות" | מותר | תמיד עם "אחרי בדיקה של מטא" |
| "תוצאות מובטחות", "יותר לקוחות בוודאות", "ויראלי מובטח", "ROI", "הכפלת המכירות" | אסור | — |
| "שותף רשמי של מטא", לוגו של Meta/Facebook/Instagram, "מאושר על ידי מטא" | אסור | אנחנו לא Meta Business Partner. השמות מופיעים כטקסט רגיל בלבד [M0-verify את כללי המותג של מטא] |
| שמות מתחרים, מספרים מסרטוני השראה ("מ-4K ל-50K צפיות") | אסור | מותר: "גם חשבונות קטנים יכולים להגיע לקהל חדש", לא כהבטחה |

השער של הטענות באתר השיווקי (דגלים, ארבע הורדות שבועיות) — חלק 02. באפליקציה, כל מסך מהחלק הזה מוצג רק כשהדגל שלו דולק (§1.5), ולכן אין בה טענה על פיצ׳ר כבוי.

### 1.4 מונחים קנוניים בממשק

| מושג | בממשק | לא כותבים |
|---|---|---|
| פרסום בתשלום | **קמפיין** | "קמפיין ממומן" במסכים פנימיים, "בוסט" |
| מודעה אחת בתוך קמפיין | **מודעה** | "קריאייטיב", "Ad" |
| פרסום לא ממומן | **פרסום רגיל** | "אורגני" |
| שיחה בוואטסאפ או ליד | **פנייה** | "המרה", "תוצאה" (מותר רק בהגדרות מתקדמות) |
| ליד מטופס | **ליד** | "Lead" |
| Ads Manager | **מנהל המודעות של מטא** | "אדס מנג׳ר" |
| ארבע המטרות | **הודעות בוואטסאפ** · **לידים בטופס** · **כניסות לאתר** · **חשיפה לאזור** | שמות ה-ODAX |
| ארבעת המספרים | **כמה הוצאתם** · **כמה אנשים ראו** · **כמה פניות** · **כמה עלתה כל פנייה** | CPM, CPC, CPL |
| ניווט | **קמפיינים** · **לידים** · **פרסום ותזמון** · **טרנדים** | — |
| כפתורים | **העלו לקמפיין** · **פרסמו עכשיו** · **הכנה לפרסום** · **פרסום** · **השהיה** · **המשך** · **הגבירו את המנצח** · **צרו בקליק** · **צלמו בעצמכם** | — |
| אונבורדינג | **חיבור פייסבוק ואינסטגרם** | — |

**ז׳רגון שאסור בממשק ברירת המחדל:** ROAS, CPM, CPC, ODAX, Advantage+, ad set, פיקסל. מותר רק בתוך "הגדרות מתקדמות", ותמיד עם הסבר של שורה אחת (`lint:copy` נכשל על המילים האלה מחוץ למפתחות `*.advanced.*`).

### 1.5 דגלים ואבני דרך

| דגל (`feature_flags`, כבוי ב-seed) | מה הוא פותח | אבן דרך | מה קורה כשהוא כבוי |
|---|---|---|---|
| `meta_connect` | חיבור, נכסים, בדיקת מוכנות, פרסום רגיל ותזמון, לוח התוכן, נתונים של פרסום רגיל | M9 | `/api/meta/*` ו-`/api/social/*` מחזירים 404; פריטי הניווט "פרסום ותזמון" ושלב האונבורדינג מוסתרים |
| `meta_ads` | בונה הקמפיינים, דשבורד, קידום המנצח, תקרות | M10 | `/api/campaigns/*` מחזירים 404; **קמפיינים שכבר רצים במטא ממשיכים לרוץ**, והכיבוי עוצר רק השקות חדשות (חלק 06 §21.3) |
| `meta_lead_forms` | המטרה "לידים בטופס" | M10 | הכרטיס מוצג מושבת; תיבת הלידים נשארת פתוחה אם `landing_pages` דולק |
| `meta_auto_rules` | כללים אוטומטיים | M10 (נפתח אחרי שבועיים של בטא) | הלשונית מוסתרת, `C18` מחזיר 404, וכללים קיימים לא מוערכים |
| `landing_pages` | "דף העסק" | M10 | `/api/landing-pages/*` ו-`/b/*` מחזירים 404 |
| `meta_health_check` | "בדיקת דופק" | M10 | הכרטיס והנתיבים מוסתרים |
| `monthly_plan` | "תוכנית 30 יום" | M9 | "תכנון חודש" בלוח התוכן חוזר להצעה הדטרמיניסטית של 8 משבצות (§13.7) |

**נתיבי הלידים** (`/api/leads/*`) פתוחים כש-`meta_lead_forms` **או** `landing_pages` דולק, כי לידים מדף העסק נכנסים לאותה תיבה. **המיגרציה** `0013_meta_integration.sql` נכנסת כבר במיזוג הראשון של M8, יחד עם `0014_trends.sql` (חלק 04 §2.3), ולכן היא שלמה מראש, כולל הטבלאות של M9–M10; עד שהדגלים נדלקים הטבלאות ריקות והנתיבים מחזירים 404. מסלול הבעלים מול Meta (§4) מתחיל ב-M0, ושום קוד לא מחכה לו; ההשקה הציבורית של פיצ׳רי Meta (M11) לא קורית לפני אימות העסק, App Review ואימות ה-Tech Provider.

### 1.6 מבנה הקבצים

```
lib/meta/
├─ client.ts            metaFetch(): version, token, appsecret_proof, timeouts, retries, usage headers, error map, redaction
├─ version.ts           META_GRAPH_VERSION and the three base URLs (the only file with a literal "v26.0")
├─ oauth.ts             connect start/callback, state cookie
├─ tokens.ts            encrypt/decrypt via lib/crypto.ts, token health
├─ assets.ts            asset listing and selection
├─ preflight.ts         MetaPreflightV1
├─ money.ts             MetaMinor, ilsToMetaMinor, metaMinorToIls (the only conversion point)
├─ presets.ts           NICHE_AD_PRESETS, SEASON_AD_PRESETS
├─ eligibility.ts       adEligibility(project, variants)
├─ rate-limit.ts        per-ad-account gate, write lock, budget guard
├─ errors-he.ts         Meta error code → our code + Hebrew
├─ review-feedback-he.ts REVIEW_FEEDBACK_HE
├─ explain-fallback.ts  deterministic Hebrew explanations
├─ rules.ts · insights.ts · leads.ts · signed-request.ts · webhooks.ts · caps.ts
├─ health/checks.ts     deterministic health checks (§15)
├─ campaigns/{build,prepare,publish,edit,status}.ts
├─ publish/{instagram,facebook}.ts
└─ mock/*               fixtures + MSW handlers + mock consent page data
lib/social/{caption,calendar}.ts
lib/landing/{content,slug,limits,privacy,render}.ts
lib/plan/{generate,fallback}.ts
lib/workflows/{meta-connect-sync,meta-prepare-campaign,meta-lead-ingest,social-publish,meta-data-deletion,meta-health-check,monthly-plan-generate}.ts
lib/cron/{meta-insights-hourly,meta-insights-backfill,meta-review-poll,social-publish,social-insights,meta-token-health,meta-rules,meta-leads-backfill,weekly-summary}.ts
lib/api/contracts/{meta,campaigns,leads,social,landing,plan}.ts
components/{campaigns,leads,publish,landing,plan,integrations}/
app/(app)/app/{campaigns,leads,publish,landing-pages,plan}/… · app/(app)/app/settings/integrations/meta/
app/(public)/b/[slug]/{page.tsx,privacy/page.tsx}
app/dev/mock-meta-login/page.tsx   (404 in production)
scripts/{lint-meta,meta-smoke}.ts
```

### קריטריוני קבלה
- [ ] `lint:copy` נכשל על "ROAS", "CPM" או "Advantage+" במפתח שאינו `*.advanced.*`, ועל "תוצאות מובטחות" בכל מפתח.
- [ ] עם כל שבעת הדגלים כבויים: אף פריט ניווט, נתיב API או מסך מהחלק הזה לא נגיש (404), וקמפיין פעיל במטא לא משתנה.
- [ ] כל מחרוזת שמשתמשת במונחים של §1.4 משתמשת בצורה הקנונית (בדיקת snapshot על `messages/he.json`).

---

## §2. ארכיטקטורה, גרסה ולקוח ה-Graph

### 2.1 האפליקציה במטא

- **אפליקציה אחת מסוג Business**, בבעלות תיק העסק (business portfolio) של {{LEGAL_ENTITY_NAME}}. מוצרים: Facebook Login for Business, ‏Marketing API, ‏Webhooks, ‏Instagram API with Facebook Login. התראות הוואטסאפ למשתמשים שלנו נשארות באפליקציה ו-WABA **נפרדים** (חלק 06 §13, משתני `WHATSAPP_*`), כדי שהיקף ה-App Review של אפליקציית השיווק יישאר נקי.
- "Require App Secret" דולק. כל קריאה מהשרת שולחת `appsecret_proof = HMAC-SHA256(access_token, META_APP_SECRET)` בהקסה; `META_APP_SECRET` הוא רשימה מופרדת בפסיקים: חותמים בראשון ומאמתים webhooks מול כולם (`secretList`, ‏`hmacVerifyAny`, חלק 06 §15.5).
- `META_PROVIDER = meta | mock`. בפרודקשן `mock` אסור מהרגע ש-`meta_connect` דולק (`lib/env.ts` נכשל באתחול).

### 2.2 נעיצת גרסה ומדיניות שדרוג (`lib/meta/version.ts`)

```ts
// lib/meta/version.ts — the ONLY file allowed to contain a literal Graph version
import { env } from "@/lib/env";
export const META_GRAPH_VERSION = env.META_GRAPH_VERSION;              // "v26.0" (released 2026-07-29)
export const GRAPH = (path: string) => `https://graph.facebook.com/${META_GRAPH_VERSION}/${path.replace(/^\//, "")}`;
export const RUPLOAD_VIDEO = (id: string) => `https://rupload.facebook.com/video-upload/${META_GRAPH_VERSION}/${id}`;
export const RUPLOAD_IG = (id: string) => `https://rupload.facebook.com/ig-api-upload/${META_GRAPH_VERSION}/${id}`;
export const OAUTH_DIALOG = `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth`;
```

- **`scripts/lint-meta.ts`** (רץ ב-`pnpm lint`) נכשל על: מחרוזת `v2[0-9]\.0` מחוץ ל-`lib/meta/version.ts` ול-`.env*`; המחרוזות `instagram_actor_id`, ‏`instagram_story_id`, ‏`smart_promotion_type`; כל בקשה למיקום Instagram Explore (`explore`, ‏`explore_home` בתוך `instagram_positions`); ושימוש בטיפוס `MetaMinor` או בשם שמסתיים ב-`Minor` מחוץ ל-`lib/meta/**`.
- **Runbook R14** (חלק 06 §22): פעם בחודש בודקים את ה-changelog של ה-Marketing API ואת דף השינויים שמחוץ למחזור; משדרגים בתוך 90 יום מגרסה חדשה, ולפחות 60 יום לפני סוף החיים של הגרסה הנעוצה (v24 פקעה למודעות ב-2026-10-06; גרסאות חיות כ-12 חודשים). `contract-live.yml` מריץ פעם בשבוע את `pnpm meta:smoke` מול `META_GRAPH_VERSION`, וגם מול `META_GRAPH_VERSION_NEXT` (משתנה CI) כשהוא מוגדר.

### 2.3 `metaFetch()` — לקוח אחד לכל התעבורה (`lib/meta/client.ts`)

```ts
import "server-only";
import { GRAPH } from "./version";
import { hmacHex, secretList } from "@/lib/crypto";
import { env } from "@/lib/env";
import { mapMetaError, MetaError } from "./errors-he";
import { recordUsage, assertAccountOpen } from "./rate-limit";

export type MetaCallKind = "read" | "write";
export interface MetaCall {
  method: "GET" | "POST" | "DELETE";
  path: string;                                   // "act_123/campaigns", or a full rupload URL
  token: string;                                  // decrypted in memory, never logged
  kind: MetaCallKind;
  params?: Record<string, string | number | boolean | object | undefined>;
  adAccountId?: string;                           // "act_…" → rate-limit gate (§5)
  headers?: Record<string, string>;
  retry?: "interactive" | "background";           // interactive: one retry after 2 s; background: 2 s, 8 s, 30 s
  essential?: boolean;                            // status/insights reads that pass the gate at ≥ 95% (§5)
  signal?: AbortSignal;
}
export interface MetaUsage { buc?: unknown; app?: unknown; account?: unknown }

const RETRYABLE = new Set([1, 2, 4, 17, 32, 341, 613]);
const SENSITIVE = ["access_token", "appsecret_proof", "signed_request", "field_data", "code", "client_secret"];

export async function metaFetch<T>(c: MetaCall): Promise<{ data: T; usage: MetaUsage }> {
  if (c.adAccountId) await assertAccountOpen(c.adAccountId, c.kind, c.essential); // RATE_LIMITED {scope:"meta_account"}
  const proof = hmacHex(secretList(env.META_APP_SECRET)[0], c.token);
  const url = new URL(c.path.startsWith("https://") ? c.path : GRAPH(c.path));
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(c.params ?? {})) {
    if (v === undefined) continue;
    (c.method === "GET" ? url.searchParams : form).set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  }
  url.searchParams.set("appsecret_proof", proof);
  const delays = c.retry === "background" ? [2000, 8000, 30000] : [2000];
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: c.method,
      headers: { Authorization: `Bearer ${c.token}`, ...(c.method === "GET" ? {} : { "content-type": "application/x-www-form-urlencoded" }), ...c.headers },
      body: c.method === "GET" ? undefined : form,
      signal: c.signal ?? AbortSignal.timeout(c.kind === "read" ? 15_000 : 30_000),
    });
    const usage: MetaUsage = {
      buc: parseJsonHeader(res.headers.get("x-business-use-case-usage")),
      app: parseJsonHeader(res.headers.get("x-app-usage")),
      account: parseJsonHeader(res.headers.get("x-ad-account-usage")),
    };
    if (c.adAccountId) await recordUsage(c.adAccountId, usage);
    const json = await res.json().catch(() => ({}));
    if (res.ok && !json.error) return { data: json as T, usage };
    const err = new MetaError(res.status, json.error ?? {});
    const retryable = (res.status >= 500 || RETRYABLE.has(err.code)) && !(err.code === 613 && err.subcode === 1487632);
    if (retryable && attempt < delays.length) { await new Promise((r) => setTimeout(r, delays[attempt])); continue; }
    throw mapMetaError(err, { retryable });                                     // ApiError with our code (§2.4)
  }
}

/** strips secrets and lead data before anything reaches logs or Sentry (beforeSend uses it too) */
export function redactMetaPayload<T>(v: T): T {
  return JSON.parse(JSON.stringify(v, (k, val) => (SENSITIVE.includes(k) ? "[redacted]" : val)));
}
const parseJsonHeader = (h: string | null) => { try { return h ? JSON.parse(h) : undefined; } catch { return undefined; } };
```

- העלאות ל-`rupload.facebook.com` עוברות דרך אותו `metaFetch` עם `path` מלא וכותרת `Authorization: OAuth {token}` (פייסבוק רילס, §13.2); הלקוח לא מוסיף `Bearer` כשהכותרת קיימת.
- `Sentry.beforeSend` ו-`lib/log.ts` מעבירים כל אובייקט שמכיל מפתח מ-`SENSITIVE` דרך `redactMetaPayload`. בדיקת יחידה שולחת שגיאה עם טוקן ומוודאת שהוא לא מופיע בשום פלט.

### 2.4 מיפוי שגיאות (`lib/meta/errors-he.ts`)

| קוד Meta (תת-קוד) | הקוד שלנו | `details` | מה עוד קורה |
|---|---|---|---|
| 190, ‏102, ‏463, ‏467 | `META_NOT_CONNECTED` | `{ reason: "needs_reconnect" }` | `meta_connections.status = needs_reconnect` מיד, התראה ומייל `meta_connection_lost` (§3.5) |
| 200, ‏10, ‏`(#200)` על הרשאה | `META_NOT_CONNECTED` | `{ reason: "missing_permission" }` | כמו למעלה, עם `last_error_code = 'missing_permission'` |
| 100 על משתמש בלי תפקיד, לפני אימות Tech Provider | הפניה `?error=tech_provider` | — | רק בזרימת החיבור |
| 613 (1487632) | `RATE_LIMITED` | `{ scope: "meta_budget", retryAfter }` | בלי ניסיון חוזר |
| 4, ‏17, ‏32, ‏613 אחרי הניסיונות | `RATE_LIMITED` | `{ scope: "meta_account", retryAfter }` | השער של החשבון נסגר (§5) |
| 2207042, ‏9 | `RATE_LIMITED` | `{ scope: "ig_publish_daily", retryAfter }` | — |
| 2207026 | `INVALID_INPUT` | `{ reason: "video_spec" }` | — |
| 1504045 | פנימי | — | `insights.ts` מפצל את טווח התאריכים |
| כל השאר | `META_API_ERROR` | `{ metaCode, metaSubcode?, retryable, userMessageHe? }` | `userMessageHe` מהטבלה `META_ERRORS_HE`, ואם אין — `error_user_msg` של מטא כשהקריאה נשלחה עם `locale=he_IL` [M0-verify שמטא מחזירה טקסט מתורגם] |

```ts
export const META_ERRORS_HE: Record<string, string> = {
  "100": "מטא לא מצאה את מה שביקשנו. ייתכן שהפריט נמחק בחשבון המודעות.",
  "294": "לחשבון המודעות אין הרשאה לפעולה הזו. כדאי לבדוק את ההרשאות בהגדרות העסק במטא.",
  "368": "מטא חסמה זמנית פעולות מהחשבון הזה. כדאי לבדוק את ההתראות במנהל המודעות של מטא.",
  "1487390": "חשבון המודעות מושבת. אפשר לבדוק את הסיבה במנהל המודעות של מטא.",
  "2446079": "הסרטון לא עבר את בדיקת הקובץ של מטא. אפשר להרכיב אותו מחדש לפרסום.",
  default: "מטא החזירה שגיאה. לא בוצע שינוי בקמפיין, ואפשר לנסות שוב בעוד כמה דקות.",
};
```

הקודים שבטבלה חוץ מ-190, ‏200, ‏613 ו-1504045 הם [M0-verify]: בבטא אוספים את הקודים האמיתיים ומשלימים את המפה.

### 2.5 ה-mock (`lib/meta/mock/*`)

- כל נקודת קצה שבשימוש מכוסה ב-handler של MSW עם fixtures ריאליסטיים: שמות בעברית ("מספרת אבי — רמת גן"), חשבון מודעות ב-ILS עם `minimum_budgets`, מעבר `PENDING_REVIEW` ← `ACTIVE` אחרי 90 שניות או ← `DISAPPROVED` כשהטקסט הראשי מכיל `[reject]`, כותרות שימוש (`X-Business-Use-Case-Usage`) עם ערכים שמתקדמים, סימולטור webhook של `leadgen` ו-`in_process_ad_objects`, ומכסת פרסום של אינסטגרם.
- **דף ההסכמה המדומה** `/dev/mock-meta-login` (‏404 בפרודקשן, כמו שער התשלום המדומה בחלק 06 §8.3): מציג "אפליקציית ניסיון מבקשת גישה לעסק שלכם", שלוש אפשרויות (**"אישור"**, **"ביטול"**, **"אישור בלי חשבון מודעות"**) ומחזיר ל-callback עם `code=mock_ok` / `error=access_denied` / `code=mock_no_ad_account`.
- `lib/meta/mock/simulate.ts` מייצא `simulateLead(pageId)` ו-`simulateReview(adId, "approve" | "reject")`, שהבדיקות וה-e2e משתמשים בהם.

### קריטריוני קבלה
- [ ] `pnpm lint` נכשל על `"v25.0"` בקובץ שאינו `lib/meta/version.ts`, על `instagram_actor_id` ועל `explore` בתוך `instagram_positions`.
- [ ] כל קריאת Graph בקוד עוברת דרך `metaFetch` (בדיקה סטטית: אין `fetch("https://graph.facebook.com` מחוץ ל-`client.ts`).
- [ ] שגיאה 190 מנתיב כלשהו מעבירה את החיבור ל-`needs_reconnect` ושולחת מייל אחד בלבד באותו יום (`meta_connection_lost:{connectionId}:{day}`).
- [ ] snapshot של אירוע Sentry משגיאת Meta לא מכיל `access_token`, ‏`appsecret_proof` או `field_data`.
- [ ] `/dev/mock-meta-login` מחזיר 404 כש-`APP_ENV=production`.

---

## §3. חיבור, טוקנים ובדיקת מוכנות

### 3.1 התחלת החיבור — `POST /api/meta/connect/start` (M1)

```ts
// lib/meta/oauth.ts (server-only)
export async function startConnect(ctx: RouteCtx<MetaConnectStartBody, unknown>) {
  await assertMetaAdAccountsLimit(ctx);                      // PLAN_LIMIT {limit:"meta_ad_accounts", max, used} only when this ws has no live connection
  const nonce = randomBytes(24).toString("base64url");
  const state = { nonce, workspaceId: ctx.ws!.id, userId: ctx.user!.id, location: ctx.body.location,
                  returnTo: safeReturnTo(ctx.body.returnTo), termsAccepted: true, iat: Date.now() };
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  const sig = hmacHex(deriveKey("meta-oauth").toString("hex"), payload);
  const cookie = `meta_oauth_state=${payload}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/api/meta/connect; Max-Age=600`;
  const authUrl = `${OAUTH_DIALOG}?` + new URLSearchParams({
    client_id: env.META_APP_ID, config_id: env.META_LOGIN_CONFIG_ID, response_type: "code",
    redirect_uri: `${env.NEXT_PUBLIC_SITE_URL}/api/meta/connect/callback`, state: nonce,
  });
  track("meta_connect_started", { location: ctx.body.location });            // client event mirrored here only for the server log
  return Response.json({ authUrl } satisfies MetaConnectStartResponse, { headers: { "set-cookie": cookie } });
}
const safeReturnTo = (p?: string) => (p && /^\/app\/[a-z0-9/_-]*$/i.test(p) ? p : null);   // no open redirect
```

- `deriveKey` מקבל ערך חדש באיחוד: `"meta-oauth"` (חלק 06 §15.5). אימות העוגייה מנסה גם את המפתחות של `APP_ENCRYPTION_KEY_PREVIOUS`.
- `acceptTerms: true` חובה בגוף (Zod `z.literal(true)`): ההסכמה לתנאי השימוש בפרסום במטא נלקחת בלחיצה על כפתור החיבור (§3.8), ונרשמת בשרת רק כשהחיבור הצליח (§3.2 צעד 7).
- האירוע `meta_connect_started` נשלח מהלקוח (`c`) בלחיצה; השורה בקוד היא לוג שרת בלבד.

### 3.2 החזרה ממטא — `GET /api/meta/connect/callback` (M2)

1. `error=access_denied` ← הפניה `?error=denied`.
2. אימות העוגייה (חתימה ב-`safeEqualHex`, גיל עד 10 דקות) ו-`state` מול `nonce` ב-`timingSafeEqual`; המשתמש המחובר חייב להיות `userId` שבעוגייה, ותפקידו בסביבה עדיין בעלים או מנהל. כשל ← `?error=state_mismatch`. העוגייה נמחקת בכל מקרה.
3. החלפת הקוד: `GET /{v}/oauth/access_token?client_id&client_secret&redirect_uri&code` ← לפי הגדרת ה-FLfB זה **טוקן משתמש-מערכת של אינטגרציה עסקית (BISU)** שלא פג [M0-verify: מבנה התשובה, תוקף, מה מבטל אותו]. כשל ← `?error=exchange_failed`; שגיאה 100 למשתמש בלי תפקיד באפליקציה, לפני אימות Tech Provider ← `?error=tech_provider`.
4. `GET /me?fields=id,name,client_business_id` ← `meta_user_id`, ‏`client_business_id`, ‏`business_name`.
5. רשימת נכסים מהירה (בתוך הבקשה, עד 3 קריאות): `/me/adaccounts?fields=id,name,currency,timezone_name,account_status,funding_source_details{type}`, ‏`/me/accounts?fields=id,name,tasks,access_token,picture{url},instagram_business_account{id,username,profile_picture_url}` [M0-verify אילו edges טוקן BISU קורא]. אין חשבון מודעות ואין עמוד ← `?error=no_assets`, והטוקן לא נשמר.
6. שמירה בטרנזקציה אחת (לקוח סודי): שורת `meta_connections` חיה אחת לסביבה — חיבור מחדש מעדכן את השורה הקיימת (`status = active`, ‏`last_error_* = null`) ומחליף את הטוקנים; שורת `meta_tokens` מסוג `system_user` (`encryptToken`), ושורות `page` לכל עמוד שהגיע עם `access_token`; ‏`meta_assets` לכל נכס (בלי `is_selected`).
7. הסכמה: אם אין לסביבה הסכמה `meta_ads_terms` בגרסה הנוכחית — `recordConsent({ kind: "meta_ads_terms", source: "meta_connect", granted: true, … })` ו-`meta_connections.terms_accepted_at = now()`. ‏`version` = `LEGAL_VERSIONS.meta_ads_terms`, שהוא הגרסה של `/legal/terms` (פרק `#meta`, חלק 02 §10.2).
8. `audit_logs` ‏`meta.connect` (עם `client_business_id`, בלי טוקן) ← `orchestrator.startFlow("metaConnectSync", { connectionId }, { idempotencyKey: "meta-sync:{connectionId}:{granted_at}" })` ← ‏`303` ל-`returnTo` (עם `?meta=connected`) או ל-`/app/settings/integrations/meta?step=assets`.

`meta_connect_completed {has_ad_account, has_page, has_instagram, preflight_ok}` נשלח מהשרת בסוף `metaConnectSync`, ו-`meta_connect_failed {reason}` מהשרת בכל הפניה עם `?error=`.

### 3.3 אחסון ותוקף של טוקנים

- טוקנים נשמרים **רק** ב-`meta_tokens.token_enc`, מוצפנים ב-`encryptToken()` הקיים (AES-256-GCM, ‏`APP_ENCRYPTION_KEY`, הפורמט `v1:{iv_b64}:{tag_b64}:{ct_b64}`). אין מפתח חדש. `scripts/rotate-encryption-key.ts` מצפין מחדש גם את `meta_tokens.token_enc`. לטבלה אין שום הרשאה ל-`anon` או ל-`authenticated`.
- **סוגים:** `system_user` (ראשי, כל קריאות ה-Marketing API) · `page` (אחד לכל עמוד: פרסום רילס בפייסבוק, טופסי לידים, מנוי `leadgen`, קריאת לידים) · `user` (רק אם קריאה תוכיח שהיא דורשת טוקן של אדם [M0-verify]; ארוך-טווח של כ-60 יום, ואחר כך "חברו מחדש").
- `lib/meta/tokens.ts → getToken(connectionId, kind, metaObjectId?)` מפענח בזיכרון בלבד ומחזיר מחרוזת; אין cache בין בקשות.

### 3.4 בחירת נכסים ובדיקת מוכנות (M3, M4, M5)

**בחירה** (`POST /api/meta/assets/select`, בעלים או מנהל): חשבון מודעות אחד, עמוד אחד, חשבון אינסטגרם אחד (אופציונלי), ומספר וואטסאפ עם אישור. הנתיב מסמן `is_selected` (האינדקס החלקי מבטיח אחד לכל סוג), שומר את טוקן העמוד הנבחר, נרשם ל-webhooks של חשבון המודעות (`POST /act_{id}/subscribed_apps`) ושל העמוד (`POST /{page_id}/subscribed_apps?subscribed_fields=leadgen`, רק כש-`meta_lead_forms` דולק; כשל נרשם ב-`preflight.leadgen_subscription`), מריץ את בדיקת המוכנות ורושם `audit_logs` ‏`meta.assets_select`. המספר נשמר כשורת `meta_assets` מסוג `whatsapp_number` עם `whatsapp_e164` ו-`whatsapp_confirmed_at` (רק כש-`whatsappConfirmed: true`).

**בדיקת המוכנות** (`lib/meta/preflight.ts → runPreflight(workspaceId)`, נשמרת ב-`meta_assets.preflight` של חשבון המודעות; ‏M5 מריץ אותה מחדש):

| בדיקה (`check`) | איך בודקים | חוסם את | תיקון בעברית (`app.integrations.meta.checks.{key}`) |
|---|---|---|---|
| `account_disabled` | `account_status != 1` | כל הקמפיינים | "חשבון המודעות לא פעיל. אפשר לבדוק את הסיבה במנהל המודעות של מטא, תחת 'פרטי החשבון'." |
| `currency_not_ils` | `currency != 'ILS'` | כל הקמפיינים | "חשבון המודעות מוגדר ב-{currency}. המטבע נקבע כשפותחים חשבון ואי אפשר לשנות אותו, ולכן צריך לפתוח חשבון מודעות חדש בשקלים ולבחור אותו כאן." |
| `no_payment_method` | `funding_source_details` ריק, או `PENDING_BILLING_INFO` | כל הקמפיינים | "אין אמצעי תשלום בחשבון המודעות. מוסיפים כרטיס בהגדרות התשלום של מטא, והתקציב יחויב שם ישירות." |
| `page_no_advertise_task` | `tasks` של העמוד בלי `ADVERTISE` | כל הקמפיינים | "אין לכם הרשאת פרסום בעמוד הזה. מנהל העמוד יכול לתת אותה בהגדרות העמוד, תחת 'גישה לעמוד'." |
| `ig_not_linked` | לעמוד אין `instagram_business_account` | פרסום רגיל באינסטגרם (בקמפיינים — אזהרה בלבד) | "חשבון האינסטגרם לא מקושר לעמוד הפייסבוק. מקשרים אותו בהגדרות העמוד, תחת 'חשבונות מקושרים'." |
| `whatsapp_not_confirmed` | אין מספר מאושר | "הודעות בוואטסאפ" | "צריך לחבר מספר וואטסאפ עסקי לעמוד הפייסבוק ולאשר אותו כאן. מספר פרטי לא מתאים." |
| `privacy_url_missing` | אין `privacy_policy_url` ואין דף עסק מפורסם | "לידים בטופס" | "טופס לידים במטא חייב קישור למדיניות פרטיות. אפשר להדביק קישור קיים, או לפרסם את 'דף העסק' שכולל מדיניות פרטיות מוכנה." |
| `leads_access` | קריאת ניסיון ל-`/{page_id}/leadgen_forms` נכשלת בהרשאה (Leads Access Manager) | "לידים בטופס" | "צריך לתת ל{{BRAND_NAME}} גישה ללידים בהגדרות העסק במטא: 'הגדרות העסק' ← 'שילובים' ← 'גישה ללידים' ← בחירת העמוד ← הוספת האפליקציה." |
| `lead_terms_not_accepted` | `GET /{page_id}?fields=leadgen_tos_accepted` [M0-verify] | "לידים בטופס" | "צריך לאשר פעם אחת את תנאי מודעות הלידים של מטא עבור העמוד." + קישור לדף התנאים [M0-verify URL] |
| `min_budget_unknown` | `GET /act_{id}/minimum_budgets` נכשל | אזהרה | "לא הצלחנו לקרוא את התקציב המינימלי מהחשבון. נשתמש במינימום של {floor} ליום." |
| `leadgen_subscription` | הרישום ל-`leadgen` נכשל | "לידים בטופס" | "לא הצלחנו לחבר את העמוד לקבלת לידים. כדאי לנסות שוב, ואם זה חוזר — לכתוב לנו." |
| `timezone_not_il` | `timezone_name != 'Asia/Jerusalem'` | אזהרה | "אזור הזמן של חשבון המודעות הוא {timezone}. הדוחות יוצגו לפי אזור הזמן של החשבון." |

```ts
// lib/api/contracts/meta.ts (excerpt; full file in §7.2)
export const PreflightCheckKey = z.enum(["account_disabled","currency_not_ils","no_payment_method","page_no_advertise_task",
  "ig_not_linked","whatsapp_not_confirmed","privacy_url_missing","leads_access","lead_terms_not_accepted","min_budget_unknown",
  "leadgen_subscription","timezone_not_il"]);
export const MetaPreflightV1 = z.object({
  version: z.literal(1),
  checked_at: IsoDateTime,
  ok: z.boolean(),                                                       // no "fail" in the checks that block every campaign
  checks: z.record(PreflightCheckKey, z.object({
    status: z.enum(["ok", "fail", "warn", "skip"]),
    params: z.record(z.string(), z.union([z.string(), z.number()])).optional(),   // {currency}, {timezone}, {floor}
    deep_link: z.url().nullable(),
  })),
  goals: z.object({ whatsapp_messages: z.boolean(), lead_form: z.boolean(), website_traffic: z.boolean(), local_awareness: z.boolean() }),
  min_daily_budget_ils: z.number().positive().nullable(),
}).strict();
```

`META_ACCOUNT_NOT_READY {checks}` (חלק 04 §18.2) מחזיר רק את הבדיקות שנכשלו עבור המטרה המבוקשת, מתוך עשרת הערכים של הקוד (חלק 04 §18.2); `leadgen_subscription` ממופה ל-`leads_access`, ו-`timezone_not_il` לעולם לא חוסם. רשימת הבדיקה הירוקה (`MetaConnectChecklist`) מציגה חמש שורות קבועות — **עמוד פייסבוק · אינסטגרם מקושר · חשבון מודעות בשקלים · אמצעי תשלום · מספר וואטסאפ עסקי מחובר לעמוד** — ומתחתן את שאר הבדיקות רק כשהן לא `ok`.

### 3.5 בריאות החיבור

- **cron יומי** `meta-token-health` (§8.3): ‏`GET /debug_token?input_token={token}&access_token={app_id}|{app_secret}` (`is_valid`, ‏`scopes`, ‏`expires_at`) ו-`GET /me` לכל חיבור `active`, ובנוסף סנכרון נכסים (שמות, `account_status`, ‏`has_funding_source`, ‏`min_budgets`).
- טוקן לא תקין או שגיאה 190 ← `status = needs_reconnect`, ‏`last_error_code = 'token_invalid'`; הרשאה חסרה (200/10) ← `needs_reconnect` עם `missing_permission`. בשני המקרים: התראה באפליקציה (`meta_connection_lost`), מייל `meta_connection_lost` ווואטסאפ `meta_connection_lost_he` (כשהופעל), ובאנר בכל דפי האפליקציה לבעלים ולמנהלים: **"החיבור לפייסבוק ולאינסטגרם נותק. צריך לחבר מחדש."** + **"חיבור מחדש"**.
- **מה ממשיך לעבוד בלי חיבור:** קמפיינים ממשיכים לרוץ במטא ולחייב את אמצעי התשלום של הלקוח. אנחנו לא יכולים להשהות, לעדכן דוחות או לפרסם פוסטים מתוזמנים עד החיבור מחדש — והבאנר והמייל אומרים את זה במפורש.

### 3.6 ניתוק ומחיקת נתונים (M6)

`POST /api/meta/disconnect { purge: "tokens" | "all", confirmText? }` (בעלים או מנהל): `DELETE /me/permissions` [M0-verify ל-BISU] ← `purge_meta_data(ws, purge)` (§6.5) ← `revoked_reason = 'user_disconnect'` ← `audit_logs` ‏`meta.disconnect` (ו-`meta.data_purge` כש-`all`) ← אנליטיקה `meta_disconnected {by: "user"}`. ‏`all` דורש `confirmText === "מחיקה"`, אחרת `INVALID_INPUT {reason: "confirm_text"}`.

### 3.7 ביטול הרשאה ומחיקת מידע מצד מטא

שני ה-callbacks (`POST /api/webhooks/meta/deauthorize`, ‏`POST /api/webhooks/meta/data-deletion`) מקבלים גוף טופס עם `signed_request` ומאומתים ב-`lib/meta/signed-request.ts` (§8.2). ביטול הרשאה ← כל החיבורים עם אותו `meta_user_id` עוברים ל-`revoked` (`meta_deauthorize`) והטוקנים נמחקים. מחיקת מידע ← שורת `meta_data_deletion_requests` עם קוד אישור בן 12 תווים, ה-flow `metaDataDeletion`, ותשובת JSON עם כתובת הסטטוס. דף הסטטוס הציבורי `/meta/data-deletion?code=` (חלק 02, ‏noindex) מציג **"התקבלה"** / **"בטיפול"** / **"הושלמה"**.

### 3.8 מסכים: אינטגרציות, אונבורדינג ורשימת הבדיקה

**`/app/settings/integrations`** — כרטיס לכל אינטגרציה; היום כרטיס אחד, **"פייסבוק ואינסטגרם"**, עם `StatusBadge` (מחובר · צריך חיבור מחדש · לא מחובר) ופעולה ראשית לפי המצב.

**`/app/settings/integrations/meta`** — שלושה מצבים לפי `?step` והמצב בשרת:

1. **לא מחובר** (`step` חסר): כותרת, שלוש שורות "מה אפשר לעשות אחרי החיבור", רשימת ההרשאות ולמה, תיבת התנאים (טקסט בלבד, הלחיצה היא ההסכמה) וכפתור ראשי **"חיבור פייסבוק ואינסטגרם"** (‏M1 ← `window.location = authUrl`). צופה ועורך רואים את הכפתור מושבת עם ה-Tooltip של חלק 03 §1.2.
2. **בחירת נכסים** (`step=assets`): skeleton עד ש-`GET /api/meta/assets` מחזיר `connection.assets_synced_at` (polling כל 2 שניות, עד 60 שניות; אחרי זה — **"זה לוקח יותר זמן מהרגיל"** + "רענון"). שלוש קבוצות `RadioGroup` (חשבון מודעות, עמוד, אינסטגרם), שדה מספר וואטסאפ (`LtrInput kind="phone"`) עם תיבה **"המספר הזה מחובר לעמוד הפייסבוק שבחרתי"**, ושדה קישור למדיניות פרטיות (רק כש-`meta_lead_forms` דולק). כפתור **"שמירה ובדיקה"** (‏M4).
3. **מחובר**: כרטיס חיבור (שם העסק במטא, הנכסים הנבחרים, בדיקה אחרונה), `MetaConnectChecklist`, ופעולות: **"החלפת נכסים"** · **"בדיקה מחדש"** (M5) · **"ניתוק"** · **"מחיקת נתוני מטא"**.

**אונבורדינג, שלב 4 — "חיבור פייסבוק ואינסטגרם"** (רק כש-`meta_connect` דולק; `OnboardingProgress` מציג 4 נקודות; לא חוסם את `completeOnboarding`): אותו תוכן כמו מצב 1 בגרסה מקוצרת, עם `returnTo=/app/onboarding?step=connect`, וקישור **"דילוג, אחבר אחר כך"** שתמיד גלוי.

**דיאלוג הניתוק** (`DisconnectMetaDialog`): כותרת, הסבר שקמפיינים ממשיכים לרוץ, קישור **"להשהות קודם את הקמפיינים"** (← `/app/campaigns?status=active`), ‏`RadioGroup` בין **"רק ניתוק"** ל**"ניתוק ומחיקת כל נתוני מטא מהחשבון"**, ובאפשרות השנייה שדה אישור (**"כדי לאשר, כתבו מחיקה"**). כפתור הסכנה: **"ניתוק"** / **"ניתוק ומחיקה"**.

```json
{
  "app": {
    "integrations": {
      "title": "אינטגרציות",
      "meta": {
        "card_title": "פייסבוק ואינסטגרם",
        "status": { "active": "מחובר", "needs_reconnect": "צריך חיבור מחדש", "revoked": "לא מחובר" },
        "connect": {
          "title": "{g, select, female {חברי את העסק לפייסבוק ולאינסטגרם} male {חבר את העסק לפייסבוק ולאינסטגרם} other {חברו את העסק לפייסבוק ולאינסטגרם}}",
          "benefits": [
            "פרסום רילס בפייסבוק ובאינסטגרם, עכשיו או בתזמון",
            "קמפיין בתשלום מכל סרטון, בארבעה צעדים, בלי מנהל המודעות של מטא",
            "דוח פשוט בעברית: כמה הוצאתם, כמה אנשים ראו וכמה פניות הגיעו"
          ],
          "permissions_title": "ההרשאות שנבקש ולמה",
          "permissions": [
            "לראות את העמודים, את חשבון האינסטגרם ואת חשבון המודעות שתבחרו — כדי לפרסם בשמכם",
            "לפרסם סרטונים בעמוד ובאינסטגרם — רק כשאתם לוחצים על פרסום או קובעים תזמון",
            "ליצור ולנהל קמפיינים בחשבון המודעות — כל קמפיין נוצר מושהה ומתחיל רק באישור שלכם",
            "לקרוא נתוני צפיות ותוצאות — כדי להציג לכם את הדוח",
            "לקבל לידים מטופסי מטא — כדי שיגיעו אליכם מיד"
          ],
          "money_note": "התקציב של הקמפיינים משולם ישירות למטא מאמצעי התשלום שבחשבון המודעות. אנחנו לא לוקחים אחוזים מהתקציב.",
          "terms": "בלחיצה על החיבור מאשרים את <terms>תנאי השימוש לקמפיינים ולפרסום במטא</terms>. אפשר לנתק בכל רגע.",
          "cta": "חיבור פייסבוק ואינסטגרם",
          "skip": "דילוג, אחבר אחר כך"
        },
        "errors": {
          "denied": "החיבור בוטל בחלון של מטא. אפשר לנסות שוב בכל רגע.",
          "no_assets": "לא מצאנו עמוד פייסבוק או חשבון מודעות שאפשר לחבר. צריך להיות מנהל של עמוד עסקי, ואז לנסות שוב.",
          "state_mismatch": "החיבור לא הושלם כי עבר יותר מדי זמן או שהוא התחיל בלשונית אחרת. אפשר להתחיל שוב מכאן.",
          "exchange_failed": "מטא לא אישרה את החיבור הפעם. כדאי לנסות שוב בעוד כמה דקות.",
          "tech_provider": "החיבור לעסקים חדשים עוד לא פתוח לכולם. אפשר לכתוב לנו, ונעדכן כשהוא ייפתח."
        },
        "assets": {
          "title": "{g, select, female {בחרי מה לחבר} male {בחר מה לחבר} other {בחרו מה לחבר}}",
          "loading": "טוענים את הנכסים מהחשבון שלכם…",
          "slow": "זה לוקח יותר זמן מהרגיל",
          "ad_account": "חשבון מודעות",
          "ad_account_hint": "החשבון שממנו מטא תחייב את התקציב",
          "page": "עמוד פייסבוק",
          "instagram": "חשבון אינסטגרם",
          "instagram_none": "בלי אינסטגרם בינתיים",
          "whatsapp": "מספר וואטסאפ עסקי",
          "whatsapp_confirm": "המספר הזה מחובר לעמוד הפייסבוק שבחרתי",
          "privacy_url": "קישור למדיניות הפרטיות של העסק",
          "privacy_url_hint": "חובה לטופסי לידים. אין לכם? 'דף העסק' כולל מדיניות פרטיות מוכנה.",
          "save": "שמירה ובדיקה"
        },
        "checklist": {
          "title": "רשימת בדיקה לפני קמפיין",
          "items": {
            "page": "עמוד פייסבוק",
            "instagram": "אינסטגרם מקושר",
            "ils_account": "חשבון מודעות בשקלים",
            "payment": "אמצעי תשלום",
            "whatsapp": "מספר וואטסאפ עסקי מחובר לעמוד"
          },
          "all_ok": "הכול מוכן. אפשר להעלות סרטון לקמפיין.",
          "fix": "איך מתקנים",
          "recheck": "בדיקה מחדש"
        },
        "connected": {
          "business": "העסק במטא: {businessName}",
          "last_check": "נבדק {relative}",
          "switch_assets": "החלפת נכסים",
          "disconnect": "ניתוק",
          "purge": "מחיקת נתוני מטא"
        },
        "banner_lost": "החיבור לפייסבוק ולאינסטגרם נותק. צריך לחבר מחדש.",
        "banner_lost_detail": "קמפיינים שרצים ממשיכים לרוץ במטא. עד החיבור מחדש אי אפשר להשהות אותם מכאן, לעדכן דוחות או לפרסם פוסטים מתוזמנים.",
        "reconnect": "חיבור מחדש",
        "disconnect_dialog": {
          "title": "לנתק את פייסבוק ואינסטגרם?",
          "body": "קמפיינים שרצים עכשיו ימשיכו לרוץ במטא ולחייב את אמצעי התשלום שבחשבון המודעות. אחרי הניתוק אי אפשר לנהל אותם מכאן.",
          "pause_first": "להשהות קודם את הקמפיינים",
          "only_disconnect": "רק ניתוק",
          "disconnect_and_purge": "ניתוק ומחיקת כל נתוני מטא מהחשבון",
          "purge_note": "יימחקו הדוחות, היסטוריית הקמפיינים, הפוסטים המתוזמנים והלידים שהגיעו מטופסי מטא. לידים מדף העסק נשארים. מטא שומרת עותק משלה של הלידים כ-90 יום.",
          "confirm_label": "כדי לאשר, כתבו מחיקה",
          "confirm_word": "מחיקה",
          "submit": "ניתוק",
          "submit_purge": "ניתוק ומחיקה",
          "done": "החיבור נותק"
        }
      }
    }
  }
}
```

### קריטריוני קבלה
- [ ] עם ה-mock: לחיצה על "חיבור" ← דף ההסכמה המדומה ← "אישור" ← מסך הנכסים מתמלא תוך 5 שניות, ואחרי "שמירה ובדיקה" רשימת הבדיקה ירוקה.
- [ ] `state` שונה מהעוגייה, עוגייה בת 11 דקות או משתמש אחר ← `?error=state_mismatch`, בלי שורה ב-`meta_tokens`.
- [ ] "אישור בלי חשבון מודעות" ב-mock ← `?error=no_assets`, ואין טוקן שמור.
- [ ] שורת `consents` מסוג `meta_ads_terms` עם `source = 'meta_connect'` נכתבת בחיבור הראשון בלבד, בצד השרת, עם IP ו-user agent.
- [ ] `returnTo=https://evil.com` מתעלם ומפנה למסך הנכסים.
- [ ] חשבון ב-USD מסמן `currency_not_ils` וחוסם את כל ארבע המטרות; עמוד בלי `ADVERTISE` חוסם את כולן; בלי מספר מאושר רק "הודעות בוואטסאפ" נחסמת.
- [ ] "ניתוק ומחיקה" בלי המילה "מחיקה" ← `INVALID_INPUT {reason: "confirm_text"}`; עם המילה ← אין שורות ב-`ad_campaigns`, ‏`leads` (מקור `meta_form`) ו-`meta_tokens` לסביבה, ולידים מדף העסק נשארים.

---

## §4. הרשאות ומסלול הבעלים מול Meta

### 4.1 ההרשאות (הגדרת FLfB אחת; Advanced Access לכל אחת ב-App Review)

| הרשאה | למה (נוסח ה-use case ב-App Review, באנגלית כמו שמוגש) | נדרשת מ- |
|---|---|---|
| `business_management` | Read the assets that the client business shared with our system-user token | M9 |
| `pages_show_list` | List the Pages the customer chose during connection | M9 |
| `pages_read_engagement` | Read Page details needed to publish Reels and receive leads | M9 |
| `pages_manage_posts` | Publish the customer's Reels to its own Facebook Page, only on an explicit click or schedule | M9 |
| `read_insights` | Show Page and Reel results in the customer's Hebrew dashboard | M9 |
| `instagram_basic` | Identify the customer's Instagram professional account | M9 |
| `instagram_content_publish` | Publish Reels and Trial Reels to that account, only on an explicit click or schedule | M9 |
| `instagram_manage_insights` | Show Reel metrics, including skip rate, to the customer | M9 |
| `ads_management` | Create paused campaigns, ad sets, creatives and ads; publish them after the owner confirms; pause, resume, change budget; ad-account webhooks; boost a published Reel | הסכמה ב-M9, שימוש ב-M10 |
| `ads_read` | Read Ads Insights for the four-number report | M10 |
| `pages_manage_ads` | Create Instant Forms and ads on the customer's Page | M10 |
| `pages_manage_metadata` | Subscribe the Page to the `leadgen` webhook | M10 |
| `leads_retrieval` | Deliver new leads to the customer's inbox within seconds | M10 |

לא מבקשים: `whatsapp_business_management` (שלב 2), ‏`instagram_business_*` (מסלול ההתחברות של אינסטגרם לא מאפשר מודעות), הרשאות הודעות. שמות ההרשאות המדויקים הם [M0-verify] בלוח האפליקציה. הרשאות FLfB הן "הכול או כלום", ולכן ההגדרה האחת כוללת את כולן כבר מ-M9; עד האישור, רק משתמשים עם תפקיד באפליקציה (הצוות ובודקי הבטא שנוספו כבודקים) יכולים להתחבר.

### 4.2 רשימת המשימות של הבעלים (לא קוד; מתחילה ב-M0, משימה 7 בחלק 06 §24; זמני ההמתנה הם הערכה)

| # | משימה | מתי | זמן המתנה | גמור כש… |
|---|---|---|---|---|
| 1 | פותחים **תיק עסקי במטא** (business portfolio) על שם {{LEGAL_ENTITY_NAME}}, עם שני מנהלים ואימות דו-שלבי לשניהם | M0, שבוע 1 | יום | מזהה התיק רשום ב-`DECISIONS.md` |
| 2 | **אימות העסק** (Business Verification): תעודת התאגדות, הוכחת כתובת, אימות הדומיין {{DOMAIN}} (רשומת DNS או קובץ) | M0, שבוע 1 | 1–4 שבועות [M0-verify] | "Verified" בהגדרות העסק |
| 3 | יוצרים אפליקציה מסוג Business, מוסיפים את מוצרי §2.1, דומייני האפליקציה, "Require App Secret", אייקון ותיאור בעברית ובאנגלית | M0 | יום | `META_APP_ID` |
| 4 | הגדרת FLfB: טוקן מסוג system user, נכסים (עמודים, חשבונות מודעות, חשבונות אינסטגרם) וההרשאות של §4.1 | M0 | יום | `META_LOGIN_CONFIG_ID` |
| 5 | כתובות מדיניות הפרטיות, תנאי השימוש והוראות מחיקת המידע ציבוריות (עברית + תקציר באנגלית לבודקים) | עד M2 (הדפים) / M9 (ה-callback חי) | — | הכתובות בלוח האפליקציה |
| 6 | נכסי בדיקה שלנו: עמוד, חשבון אינסטגרם מקצועי מקושר אליו, חשבון מודעות בשקלים עם אמצעי תשלום, מספר וואטסאפ עסקי מקושר לעמוד, טופס לידים לבדיקה | M0–M8 | 1–3 ימים | המזהים ב-`.env.local` ובסודות ה-CI (`META_SANDBOX_*`) |
| 7 | Webhooks ברמת האפליקציה: `ad_account` (`with_issues_ad_objects`, ‏`in_process_ad_objects`) ו-`page` (`leadgen`), עם `META_WEBHOOK_VERIFY_TOKEN` | M9 | שעה | האתגר (GET) עובר ב-staging |
| 8 | **רמת Full Access של ה-Marketing API**: לפחות 500 קריאות ב-15 יום עם פחות מ-15% שגיאות (השם שונה ב-2026-05-04, בלי הקלטת מסך) — מהחשבונות הפנימיים שלנו (smoke + בטא) | M10 | 15 יום ומעלה | הרמה מוצגת כ-Full Access |
| 9 | **App Review** לכל הרשאה ב-§4.1: נוסח use case, הוראות בדיקה באנגלית, משתמש בדיקה, **הקלטת מסך אחת לכל use case** עם כתוביות באנגלית מעל הממשק העברי (§4.3) | סוף M10 | 2–6 שבועות (לא מאומת) | Advanced Access לכל ההרשאות |
| 10 | **אימות Tech Provider** (אחרי App Review; בלעדיו משתמש בלי תפקיד נכשל בשגיאה 100) | M11 | 1–3 שבועות [M0-verify] | "Verified" |
| 11 | **Data Use Checkup** ו-Data Protection Assessment ביומן התפעול, פעם בשנה, עם אחראי בשם | M11 | — | רשומה ביומן, שם האחראי ב-`DECISIONS.md` |
| 12 | בדיקות שוק: 10 הצעות מחיר אמיתיות מסוכנויות; אימות מחדש של עוגני המחיר (חלק 02, ‏`comparisons.json`); תנאי Lyria לשימוש במודעות [M0-verify] | M8–M10 | — | `comparisons.json` נבדק |

**כלל:** שום קוד לא מחכה לרשימה הזו, אבל ההשקה הציבורית של Meta ב-M11 לא קורית לפני ש-2, 9 ו-10 הושלמו, וקריטריוני הקבלה של M11 בודקים אותם.

### 4.3 הקלטות המסך ל-App Review

כל הקלטה: 1080p, עד 3 דקות, עם עכבר גלוי, כתוביות באנגלית שצרובות מעל הממשק העברי (קובץ `docs/app-review/{id}.srt` לכל הקלטה), על חשבון הבדיקה של §4.2 משימה 6 וה-Graph האמיתי (לא ה-mock). ההקלטות נשמרות ב-`docs/app-review/` עם רשימת ההרשאות שכל אחת מכסה.

| מזהה | Use case | מה רואים, לפי הסדר | הרשאות |
|---|---|---|---|
| (a) `connect` | Connect and choose assets | כניסה ← הגדרות ← "חיבור פייסבוק ואינסטגרם" ← חלון ההרשאות של מטא ← בחירת חשבון מודעות, עמוד ואינסטגרם ← רשימת הבדיקה הירוקה ← ניתוק | `business_management`, `pages_show_list`, `pages_read_engagement`, `instagram_basic` |
| (b) `publish` | Publish a Reel to Facebook and Instagram and show insights | דף פרויקט ← "פרסמו עכשיו" ← דיאלוג הפרסום (טקסט, האשטגים, שתי הפלטפורמות) ← "פורסם" ← פתיחת הרילס באינסטגרם ובפייסבוק ← למחרת: המספרים ב"פרסום ותזמון" | `pages_manage_posts`, `instagram_content_publish`, `read_insights`, `instagram_manage_insights` |
| (c) `campaign` | Create a paused campaign, preview, publish, track status, pause | "העלו לקמפיין" ← ארבעת השלבים ← "הכנה לפרסום" ← תצוגות מקדימות ← סימון התיבה ← "פרסום" ← הסטטוס "בבדיקה של מטא" ← "פעיל" ← "השהיה" ← הצגת אותו קמפיין מושהה במנהל המודעות של מטא | `ads_management`, `ads_read` |
| (d) `leads` | Lead-form campaign, test lead, inbox | קמפיין "לידים בטופס" ← טופס בעברית בתצוגה המקדימה ← Lead Ads Testing Tool שולח ליד בדיקה ← הליד מופיע בתיבה תוך שניות עם התג "ליד בדיקה" ← שינוי סטטוס | `pages_manage_ads`, `pages_manage_metadata`, `leads_retrieval` |
| (e) `boost` | Boost an organic Reel | "פרסום ותזמון" ← הרילס המוביל ← "קדמו את הסרטון הזה" ← בדיקת זכאות ← הבונה כשהוא ממולא מראש ← פרסום מושהה | `ads_management`, `instagram_basic` |

**הוראות הבדיקה לבודקי מטא** (`docs/app-review/test-instructions.md`, באנגלית): כתובת staging, משתמש בדיקה עם סיסמה, הערה שהממשק בעברית ושהכתוביות בהקלטות מתרגמות כל מסך, ותיאור של "Created paused; nothing spends until the owner clicks Publish".

### קריטריוני קבלה
- [ ] `docs/app-review/` מכיל חמש הקלטות, חמישה קובצי SRT ומסמך הוראות, וכל הרשאה ב-§4.1 מופיעה בהקלטה אחת לפחות (בדיקת סקירה ב-M10).
- [ ] קריטריוני הקבלה של M11 (חלק 06 §24) בודקים את משימות 2, 9 ו-10, ומשתמש בלי תפקיד באפליקציה מתחבר בלי שגיאה 100.
- [ ] ביומן התפעול יש רשומה ל-Data Use Checkup עם אחראי ותאריך.

---

## §5. הגבלות קצב, נעילות ותור העבודה

- **מגבלות Business Use Case הן לכל חשבון מודעות.** `lib/meta/rate-limit.ts` שומר שער לכל חשבון ב-Upstash (`meta:acct:{actId}`, ‏JSON עם `pausedUntil` ו-`level`). כל תשובה מעדכנת אותו מהכותרות: כש-`call_count`, ‏`total_cputime` או `total_time` מגיעים ל-75% ומעלה, התור של החשבון (כתיבות, כללים, הכנות ופרסומים) נעצר ל-`max(estimated_time_to_regain_access, 5)` דקות וקריאות ממשיכות (`level = "writes_paused"`); מ-95% ומעלה ממשיכות רק קריאות סטטוס ונתונים שמסומנות `essential: true` — `meta-review-poll`, הסנכרון השעתי ו-C16 (`level = "essential_only"`).
- **ניסיונות חוזרים:** קודים 1, ‏2, ‏4, ‏17, ‏32, ‏341, ‏613 ו-HTTP 5xx, בהמתנה של 2, ‏8 ו-30 שניות ב-flows (בנתיב אינטראקטיבי — ניסיון אחד אחרי 2 שניות), ואז `META_API_ERROR {retryable: true}`. 613 עם תת-קוד 1487632 (שינויי תקציב) לא חוזר.
- **שינויי תקציב: מטא מתירה עד 4 בשעה לכל קבוצת מודעות (ולתקציב קמפיין [M0-verify]).** אנחנו מתירים עד 3 (מרווח ביטחון), לפי `ad_budget_changes_last_hour(campaign)` ביומן השינויים. המחוון בממשק עם debounce של 1.5 שניות ונשלח רק ב"שמירה"; ניסיון רביעי מחזיר `RATE_LIMITED {scope: "meta_budget", retryAfter}`. לעולם לא משנים את מגבלת ההוצאה של חשבון המודעות.
- **מקביליות:** flow כותב אחד לכל חשבון בכל רגע — נעילה ב-Upstash `meta:write:{actId}` (‏`SET NX EX 120`), שנלקחת גם בנתיבי השינוי (C9–C14). ה-QPS שלנו רחוק מ-100 לשנייה.
- **נתונים:** הסנכרון השעתי מקבץ עד 50 מודעות בקריאה (`level=ad`, ‏`time_increment=1`); מילוי לאחור גדול עובר לדוחות אסינכרוניים (`POST …/insights` ← polling על `report_run_id`, שלא נשמר); שגיאה 1504045 ← פיצול הטווח לחצי וניסיון חוזר.
- **לידים:** מגבלת הקריאה (200 × 24 × לידים ב-90 הימים האחרונים, לעמוד ליממה) רחוקה מנפח של עסק קטן; רק backoff.

```ts
// lib/meta/rate-limit.ts (server-only)
export async function assertAccountOpen(actId: string, kind: MetaCallKind, essential = false) {
  const g = await redis.get<{ pausedUntil: number; level: "writes_paused" | "essential_only" }>(`meta:acct:${actId}`);
  if (!g || g.pausedUntil < Date.now()) return;
  if (kind === "read" && (g.level === "writes_paused" || essential)) return;
  throw new ApiError("RATE_LIMITED", { scope: "meta_account", retryAfter: Math.ceil((g.pausedUntil - Date.now()) / 1000) });
}
export async function recordUsage(actId: string, u: MetaUsage) {
  const rows = (u.buc as Record<string, Array<{ call_count: number; total_cputime: number; total_time: number;
    estimated_time_to_regain_access: number }>> | undefined)?.[actId.replace(/^act_/, "")] ?? [];
  const peak = Math.max(0, ...rows.flatMap((r) => [r.call_count, r.total_cputime, r.total_time]));
  if (peak < 75) return;
  const minutes = Math.max(5, ...rows.map((r) => r.estimated_time_to_regain_access ?? 0));
  await redis.set(`meta:acct:${actId}`, { pausedUntil: Date.now() + minutes * 60_000, level: peak >= 95 ? "essential_only" : "writes_paused" },
                  { ex: minutes * 60 });
}
export async function withWriteLock<T>(actId: string, fn: () => Promise<T>): Promise<T> {
  const ok = await redis.set(`meta:write:${actId}`, "1", { nx: true, ex: 120 });
  if (!ok) throw new ApiError("RATE_LIMITED", { scope: "meta_account", retryAfter: 10 });
  try { return await fn(); } finally { await redis.del(`meta:write:${actId}`); }
}
export async function assertBudgetChangeAllowed(campaignId: string) {
  const { data } = await admin().rpc("ad_budget_changes_last_hour", { p_campaign: campaignId });
  if ((data ?? 0) >= 3) throw new ApiError("RATE_LIMITED", { scope: "meta_budget", retryAfter: await secondsUntilOldestChangeExpires(campaignId) });
  return 3 - (data ?? 0);                                     // budgetChangesLeft (C11 response)
}
```

`MetaCall` מקבל גם `essential?: boolean`, ו-`metaFetch` מעביר אותו ל-`assertAccountOpen`. משתמש תמיד רואה אם המודעה אושרה, גם כשהחשבון קרוב למגבלה.

### קריטריוני קבלה
- [ ] תשובת mock עם `call_count: 80` סוגרת את החשבון לכתיבה ל-5 דקות לפחות, וקריאת insights באותו זמן עוברת.
- [ ] שינוי תקציב רביעי בתוך שעה מחזיר `RATE_LIMITED {scope: "meta_budget"}` בעברית, בלי קריאה למטא (בדיקת MSW: אין בקשה רביעית).
- [ ] שתי בקשות "השהיה" מקבילות לאותו חשבון: אחת מצליחה, והשנייה מקבלת `RATE_LIMITED` עם `retryAfter: 10` ומנסה שוב אוטומטית (`lib/api/client.ts`).
- [ ] שגיאה 1504045 בדוח גדול מפצלת את הטווח והדוח משלים.

---

## §6. המיגרציה `0013_meta_integration.sql` (SQL מלא)

המיגרציה רצה **אחרי ההשקה**, ולכן היא קובץ חדש ולא עורכת את `0001`–`0012` (חלק 04 §2.1). היא נכנסת **במיזוג הראשון של M8, יחד עם `0014_trends.sql`**, כי `0014` מוסיף FK לעמודות `trend_template_id` שנוצרות כאן (חלק 04 §2.3, חלק 08 §6.4); לכן הקובץ שלם כבר אז, כולל הטבלאות של M9–M10, וכל שינוי שמתגלה אחר כך נכנס ל-`0015_…`. הסדר בקובץ הוא הסדר של הבלוקים כאן. כללים: שמות ברבים ב-snake_case, `id uuid default gen_random_uuid()`, ‏`created_at`/`updated_at` עם הטריגר `set_updated_at`, ‏`not null` אלא אם צוין אחרת, RLS לפי סביבה דרך `accessible_workspace_ids()`, **כל הכתיבות בשרת בלבד** (הלקוח הסודי, אחרי בדיקת התפקיד בנתיב), הרשאות מפורשות, ו-`revoke execute … from public, anon, authenticated` לכל פונקציה חדשה לפני ה-grant שלה (R9).

**סטיות מכוונות מ"not null"**, כדי שמחיקות לא ייחסמו: הפניות לנכסי מדיה (`render_asset_id`, ‏`thumbnail_asset_id`, ‏`cover_asset_id`) הן `on delete set null` ומותרות כ-NULL, כי `purge_deleted_content` (חלק 04 §9.6) מוחק שורות `assets`; השרת דורש אותן ביצירה ובהכנה. הפניות ל-`profiles` הן `on delete set null`, כמו בשאר המסד.

### 6.1 ערכי enum חדשים וסוגים חדשים

```sql
-- 0013_meta_integration.sql
-- ===== 1. values added to existing enums: used only at runtime, never inside this file (part 04 §3) =====
alter type public.webhook_provider  add value if not exists 'meta';
alter type public.notification_kind add value if not exists 'meta_campaign_live';
alter type public.notification_kind add value if not exists 'meta_ad_rejected';
alter type public.notification_kind add value if not exists 'meta_connection_lost';
alter type public.notification_kind add value if not exists 'lead_received';
alter type public.notification_kind add value if not exists 'spend_cap_warning';
alter type public.notification_kind add value if not exists 'social_post_published';
alter type public.notification_kind add value if not exists 'social_post_failed';
alter type public.notification_kind add value if not exists 'weekly_results';
alter type public.ai_task           add value if not exists 'llm_ads';
alter type public.consent_kind      add value if not exists 'meta_ads_terms';

alter table public.consents drop constraint if exists consents_source_check;
alter table public.consents add constraint consents_source_check
  check (source in ('signup','settings','checkout','newsletter','cookie_banner','likeness_flow','generate','unsubscribe','meta_connect'));

-- ===== 2. new enum types (14) =====
create type public.meta_connection_status as enum ('active','needs_reconnect','revoked');
create type public.meta_token_kind        as enum ('system_user','user','page');
create type public.meta_asset_kind        as enum ('ad_account','page','instagram_account','whatsapp_number');
create type public.ad_goal                as enum ('whatsapp_messages','lead_form','website_traffic','local_awareness');
create type public.ad_campaign_status     as enum ('draft','preparing','ready','in_review','active','paused','with_issues','rejected','completed','error','archived');
create type public.ad_variant_status      as enum ('pending','uploading','ready','in_review','active','paused','rejected','error','archived');
create type public.social_platform        as enum ('instagram','facebook');
create type public.social_post_kind       as enum ('reel','trial_reel');
create type public.social_post_status     as enum ('draft','scheduled','uploading','processing','ready','published','failed','expired','canceled');
create type public.lead_status            as enum ('new','contacted','qualified','won','lost','spam');
create type public.ad_rule_kind           as enum ('pause_expensive_ad','boost_winner','alert_no_results','alert_fatigue','monthly_cap_stop');
create type public.ad_change_source       as enum ('user','rule','system','admin');
create type public.landing_page_status    as enum ('draft','published','unpublished');
create type public.lead_source            as enum ('meta_form','whatsapp','landing_page','manual');
```

### 6.2 חיבור, טוקנים ונכסים

```sql
-- ===== 3. connection, tokens, assets =====
create table public.meta_connections (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.workspaces(id) on delete cascade,
  connected_by       uuid references public.profiles(id) on delete set null,
  meta_user_id       text,                                    -- app-scoped user id; not in the authenticated column grant
  client_business_id text,
  business_name      text check (business_name is null or char_length(business_name) <= 200),
  status             public.meta_connection_status not null default 'active',
  scopes             text[] not null default '{}',
  granted_at         timestamptz not null default now(),
  assets_synced_at   timestamptz,                             -- set by metaConnectSync; the assets screen waits for it
  last_health_at     timestamptz,
  last_error_code    text,                                    -- 'token_invalid' | 'missing_permission' | Meta code
  last_error_he      text check (last_error_he is null or char_length(last_error_he) <= 300),
  revoked_at         timestamptz,
  revoked_reason     text check (revoked_reason is null or revoked_reason in
                       ('user_disconnect','meta_deauthorize','token_invalid','data_deletion','workspace_deleted')),
  terms_accepted_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint meta_connections_revoked check ((status = 'revoked') = (revoked_at is not null))
);
create unique index meta_connections_one_live on public.meta_connections (workspace_id) where status <> 'revoked';
create index meta_connections_ws_idx        on public.meta_connections (workspace_id);
create index meta_connections_meta_user_idx on public.meta_connections (meta_user_id) where meta_user_id is not null;
create index meta_connections_status_idx    on public.meta_connections (status);

create table public.meta_tokens (
  id                uuid primary key default gen_random_uuid(),
  connection_id     uuid not null references public.meta_connections(id) on delete cascade,
  kind              public.meta_token_kind not null,
  meta_object_id    text,                                     -- page id for kind = 'page'
  token_enc         text not null check (token_enc ~ '^v[0-9]+:'),
  scopes            text[] not null default '{}',
  expires_at        timestamptz,
  last_validated_at timestamptz,
  invalid_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint meta_tokens_page_object check (kind <> 'page' or meta_object_id is not null)
);
create unique index meta_tokens_one_per_object on public.meta_tokens (connection_id, kind, coalesce(meta_object_id, ''));

create table public.meta_assets (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references public.workspaces(id) on delete cascade,
  connection_id         uuid not null references public.meta_connections(id) on delete cascade,
  kind                  public.meta_asset_kind not null,
  meta_id               text not null,                        -- act_…, Page id, IG user id, or the E.164 number for whatsapp_number
  name                  text not null default '' check (char_length(name) <= 200),
  picture_url           text,
  is_selected           boolean not null default false,
  currency              text check (currency is null or currency ~ '^[A-Z]{3}$'),
  timezone_name         text,
  account_status        smallint,
  has_funding_source    boolean,
  min_budgets           jsonb,                                -- raw /minimum_budgets; server only (column grant)
  min_daily_budget_ils  numeric(10,2) check (min_daily_budget_ils is null or min_daily_budget_ils > 0),
  page_tasks            text[],
  instagram_username    text,
  linked_page_id        text,
  whatsapp_e164         text check (whatsapp_e164 is null or whatsapp_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_confirmed_at timestamptz,
  privacy_policy_url    text check (privacy_policy_url is null or privacy_policy_url ~ '^https?://'),
  leadgen_subscribed_at timestamptz,
  trial_reels_eligible  boolean,
  reach_summary         jsonb,                                -- ad_account rows: de-duplicated reach of our campaigns per range (§11.1)
  preflight             jsonb not null default '{}' check (jsonb_typeof(preflight) = 'object'),   -- MetaPreflightV1
  last_synced_at        timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (connection_id, kind, meta_id)
);
create unique index meta_assets_one_selected on public.meta_assets (workspace_id, kind) where is_selected;
create index meta_assets_ws_kind_idx on public.meta_assets (workspace_id, kind);
```

### 6.3 פרסום רגיל, קמפיינים, מודעות ונתונים

```sql
-- ===== 4. organic posts (before ad_campaigns: boosts reference them) =====
create table public.social_posts (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  project_id        uuid references public.projects(id) on delete set null,
  version_id        uuid references public.project_versions(id) on delete set null,
  render_asset_id   uuid references public.assets(id) on delete set null,     -- required by the server at creation
  cover_asset_id    uuid references public.assets(id) on delete set null,
  platform          public.social_platform not null,
  kind              public.social_post_kind not null default 'reel',
  status            public.social_post_status not null default 'draft',
  scheduled_at      timestamptz,
  published_at      timestamptz,
  caption_he        text not null default '' check (char_length(caption_he) <= 2000),
  hashtags_he       text[] not null default '{}' check (cardinality(hashtags_he) <= 5),
  share_to_feed     boolean not null default true,
  collaborators     text[] not null default '{}' check (cardinality(collaborators) <= 3),
  location_page_id  text,
  trial_graduation  text check (trial_graduation is null or trial_graduation in ('MANUAL','SS_PERFORMANCE')),
  page_asset_id     uuid references public.meta_assets(id) on delete set null,
  ig_asset_id       uuid references public.meta_assets(id) on delete set null,
  hook_id           text references public.hooks(id) on delete set null,
  trend_template_id uuid,                                                      -- FK added in 0014
  meta_container_id text,
  meta_video_id     text,
  meta_media_id     text,
  meta_post_id      text,
  permalink         text,
  attempts          smallint not null default 0 check (attempts between 0 and 10),
  error_code        text,
  error_subcode     text,
  error_he          text check (error_he is null or char_length(error_he) <= 300),
  ai_notice_ack     boolean not null default false,
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint social_posts_schedule check (status <> 'scheduled' or scheduled_at is not null),
  constraint social_posts_trial    check ((kind = 'trial_reel') = (trial_graduation is not null)),
  constraint social_posts_trial_ig check (kind = 'reel' or platform = 'instagram')
);
create index social_posts_due_idx     on public.social_posts (status, scheduled_at) where status = 'scheduled';
create index social_posts_ws_time_idx on public.social_posts (workspace_id, (coalesce(scheduled_at, created_at)));
create index social_posts_project_idx on public.social_posts (project_id);

create table public.social_post_metrics (
  post_id            uuid not null references public.social_posts(id) on delete cascade,
  captured_at        timestamptz not null,
  views              bigint,
  reach              bigint,
  likes              bigint,
  comments           bigint,
  shares             bigint,
  saves              bigint,
  total_interactions bigint,
  reposts            bigint,
  avg_watch_ms       int,
  total_watch_ms     bigint,
  skip_rate          numeric(6,4) check (skip_rate is null or skip_rate between 0 and 1),
  raw                jsonb,
  primary key (post_id, captured_at)
);

-- ===== 5. campaigns, ads, insights, rules, change log =====
create table public.ad_campaigns (
  id                      uuid primary key default gen_random_uuid(),
  workspace_id            uuid not null references public.workspaces(id) on delete cascade,
  connection_id           uuid references public.meta_connections(id) on delete set null,
  ad_account_asset_id     uuid not null references public.meta_assets(id),
  page_asset_id           uuid not null references public.meta_assets(id),
  ig_asset_id             uuid references public.meta_assets(id) on delete set null,
  project_id              uuid references public.projects(id) on delete set null,
  variant_group_id        uuid,
  source_social_post_id   uuid references public.social_posts(id) on delete set null,
  trend_template_id       uuid,                                               -- FK added in 0014
  season_slug             text references public.seasons(slug) on update cascade on delete set null,
  name                    text not null check (char_length(btrim(name)) between 1 and 80),
  goal                    public.ad_goal not null,
  status                  public.ad_campaign_status not null default 'draft',
  is_split_test           boolean not null default false,
  is_boost                boolean not null default false,
  is_free_test            boolean not null default false,
  daily_budget_ils        numeric(10,2) not null check (daily_budget_ils > 0),
  user_monthly_cap_ils    numeric(10,2) check (user_monthly_cap_ils is null or user_monthly_cap_ils > 0),
  start_at                timestamptz,
  end_date                date,                                               -- Asia/Jerusalem calendar date
  geo                     jsonb not null check (geo ?& array['mode']),        -- GeoTargetV1 (§9.8)
  age_min                 smallint not null default 18 check (age_min between 18 and 65),
  age_max                 smallint not null default 65 check (age_max between 18 and 65),
  advantage_audience      boolean not null default true,
  placements              text not null default 'advantage' check (placements in ('advantage','reels_stories')),
  destination             jsonb not null default '{}' check (jsonb_typeof(destination) = 'object'),
                          -- {whatsapp_e164?, website_url?, landing_page_id?, lead_form_id?, phone_e164?, utm_override?}
  cta_type                text not null default 'LEARN_MORE' check (cta_type in
                            ('WHATSAPP_MESSAGE','SIGN_UP','GET_QUOTE','BOOK_NOW','LEARN_MORE','SHOP_NOW','CONTACT_US','CALL_NOW')),
  creative_features_optin boolean not null default false,
  quality_leads           boolean not null default false,
  meta_campaign_id        text,
  meta_adset_id           text,
  configured_status       text,
  effective_status        text,
  review_feedback         jsonb,
  issues_info             jsonb,                                              -- {issues:[…], advantage: advantage_state_info}
  last_error_code         text,
  reach_summary           jsonb,                                              -- {"7d":{reach,frequency,synced_at},"14d":…,"30d":…,"lifetime":…}
  prepared_at             timestamptz,
  published_at            timestamptz,
  first_active_at         timestamptz,
  paused_at               timestamptz,
  ended_at                timestamptz,
  last_synced_at          timestamptz,
  created_by              uuid references public.profiles(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint ad_campaigns_age check (age_min <= age_max),
  constraint ad_campaigns_boost check (not (is_boost and is_split_test))
);
create index ad_campaigns_ws_status_idx on public.ad_campaigns (workspace_id, status);
create index ad_campaigns_live_idx      on public.ad_campaigns (status) where status in ('in_review','active','with_issues','preparing');
create index ad_campaigns_meta_idx      on public.ad_campaigns (meta_campaign_id) where meta_campaign_id is not null;
create index ad_campaigns_project_idx   on public.ad_campaigns (project_id);
create unique index ad_campaigns_one_free_test on public.ad_campaigns (workspace_id) where is_free_test and published_at is not null;

create table public.ad_variants (
  id                        uuid primary key default gen_random_uuid(),
  campaign_id               uuid not null references public.ad_campaigns(id) on delete cascade,
  workspace_id              uuid not null references public.workspaces(id) on delete cascade,
  position                  smallint not null check (position between 1 and 3),
  label_he                  text not null check (char_length(label_he) between 1 and 40),
  project_id                uuid references public.projects(id) on delete set null,
  render_asset_id           uuid references public.assets(id) on delete set null,      -- 9:16, required by prepare
  feed_render_asset_id      uuid references public.assets(id) on delete set null,      -- 1:1 when it exists
  thumbnail_asset_id        uuid references public.assets(id) on delete set null,      -- poster (frame at 1.2 s)
  hook_id                   text references public.hooks(id) on delete set null,
  workspace_hook_id         uuid references public.workspace_hooks(id) on delete set null,
  hook_text_he              text not null default '' check (char_length(hook_text_he) <= 160),
  trend_template_id         uuid,                                                      -- FK added in 0014
  hook_variant_key          text check (hook_variant_key is null or hook_variant_key in ('A','B','C')),
  primary_text_he           text not null default '' check (char_length(primary_text_he) <= 500),
  headline_he               text not null default '' check (char_length(headline_he) <= 60),
  description_he            text check (description_he is null or char_length(description_he) <= 60),
  source_instagram_media_id text,
  object_story_id           text,
  meta_video_id             text,
  meta_feed_video_id        text,
  meta_image_hash           text,
  meta_creative_id          text,
  meta_ad_id                text,
  ad_name                   text not null default '',
  status                    public.ad_variant_status not null default 'pending',
  configured_status         text,
  effective_status          text,
  review_feedback           jsonb,
  is_winner                 boolean not null default false,
  winner_at                 timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  unique (campaign_id, position)
);
create index ad_variants_ws_idx         on public.ad_variants (workspace_id);
create index ad_variants_meta_ad_idx    on public.ad_variants (meta_ad_id) where meta_ad_id is not null;
create index ad_variants_meta_video_idx on public.ad_variants (meta_video_id) where meta_video_id is not null;
create unique index ad_variants_one_winner on public.ad_variants (campaign_id) where is_winner;

create table public.ad_insights_daily (
  variant_id         uuid not null references public.ad_variants(id) on delete cascade,
  date               date not null,                           -- ad-account time zone date, as Meta reports it
  workspace_id       uuid not null references public.workspaces(id) on delete cascade,
  campaign_id        uuid not null references public.ad_campaigns(id) on delete cascade,
  spend_ils          numeric(12,2) not null default 0 check (spend_ils >= 0),
  impressions        bigint not null default 0,
  reach              bigint not null default 0,               -- per ad per day; never summed across ads (§11.1)
  frequency          numeric(8,4),
  clicks             bigint not null default 0,
  link_clicks        bigint not null default 0,
  landing_page_views bigint not null default 0,
  video_3s_plays     bigint not null default 0,
  thruplays          bigint not null default 0,
  p25                bigint not null default 0,
  p50                bigint not null default 0,
  p75                bigint not null default 0,
  p95                bigint not null default 0,
  p100               bigint not null default 0,
  avg_watch_ms       int,
  leads              int not null default 0,
  conversations      int not null default 0,
  results            int not null default 0,                  -- per goal (§11.1)
  cpm_ils            numeric(10,2),
  ctr                numeric(8,4),
  raw                jsonb,                                   -- nulled after 90 days (pg_cron purge-meta-raw)
  synced_at          timestamptz not null default now(),
  primary key (variant_id, date)
);
create index ad_insights_ws_date_idx       on public.ad_insights_daily (workspace_id, date);
create index ad_insights_campaign_date_idx on public.ad_insights_daily (campaign_id, date);

create table public.ad_rules (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  campaign_id       uuid references public.ad_campaigns(id) on delete cascade,   -- null only for monthly_cap_stop (workspace scope)
  kind              public.ad_rule_kind not null,
  enabled           boolean not null default false,
  params            jsonb not null default '{}' check (jsonb_typeof(params) = 'object'),
  last_evaluated_at timestamptz,
  last_fired_at     timestamptz,
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint ad_rules_scope check ((kind = 'monthly_cap_stop') = (campaign_id is null))
);
create unique index ad_rules_one_per_kind on public.ad_rules
  (workspace_id, coalesce(campaign_id, '00000000-0000-0000-0000-000000000000'::uuid), kind);

create table public.ad_change_log (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  campaign_id     uuid not null references public.ad_campaigns(id) on delete cascade,
  variant_id      uuid references public.ad_variants(id) on delete set null,
  source          public.ad_change_source not null,
  actor_id        uuid references public.profiles(id) on delete set null,
  rule_id         uuid references public.ad_rules(id) on delete set null,
  action          text not null check (action in ('prepare','publish','pause','resume','budget_change','end','duplicate',
                    'boost_winner','rule_pause','rule_budget','user_cap_pause','status_sync','creative_swap')),
  before          jsonb,
  after           jsonb,
  meta_error_code text,
  created_at      timestamptz not null default now()
);
create index ad_change_log_campaign_idx on public.ad_change_log (campaign_id, created_at desc);
create index ad_change_log_ws_idx       on public.ad_change_log (workspace_id, created_at desc);
```

### 6.4 טפסים, דף העסק, לידים, תקרות, בדיקות ותוכניות

```sql
-- ===== 6. lead forms, landing pages, leads =====
create table public.lead_forms (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  page_asset_id uuid not null references public.meta_assets(id),
  campaign_id   uuid references public.ad_campaigns(id) on delete set null,
  meta_form_id  text not null,
  name          text not null check (char_length(name) between 1 and 100),
  locale        text not null default 'HE_IL',
  spec          jsonb not null check (jsonb_typeof(spec) = 'object'),       -- LeadFormSpecV1 (§12.1)
  status        text not null default 'active' check (status in ('active','archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (page_asset_id, meta_form_id)
);
create index lead_forms_ws_idx on public.lead_forms (workspace_id);

create table public.landing_pages (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  brand_kit_id      uuid references public.brand_kits(id) on delete set null,
  slug              text not null unique check (char_length(slug) between 3 and 40 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
                      and slug <> all (array['admin','api','app','b','www','new','edit','privacy','login','help','support',
                                             'legal','meta','test','null','undefined','kdimon','trends'])),
  status            public.landing_page_status not null default 'draft',
  content           jsonb not null default '{}' check (jsonb_typeof(content) = 'object'),   -- LandingPageContentV1 (draft)
  published_content jsonb,                                    -- snapshot served at /b/[slug]; public media URLs filled in
  indexable         boolean not null default false,
  show_branding     boolean not null default true,            -- derived by the server (§14.1); never set by the client
  generated_at      timestamptz,
  published_at      timestamptz,
  views_count       int not null default 0 check (views_count >= 0),
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint landing_pages_published check (status <> 'published' or (published_content is not null and published_at is not null))
);
create index landing_pages_ws_idx on public.landing_pages (workspace_id, status);

create table public.leads (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  campaign_id       uuid references public.ad_campaigns(id) on delete set null,
  variant_id        uuid references public.ad_variants(id) on delete set null,
  lead_form_id      uuid references public.lead_forms(id) on delete set null,
  landing_page_id   uuid references public.landing_pages(id) on delete set null,
  source            public.lead_source not null default 'meta_form',
  meta_leadgen_id   text unique,
  meta_ad_id        text,
  meta_created_time timestamptz,
  is_test           boolean not null default false,
  full_name         text check (full_name is null or char_length(full_name) <= 200),
  first_name        text check (first_name is null or char_length(first_name) <= 100),
  phone_e164        text check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  email             extensions.citext,
  city              text check (city is null or char_length(city) <= 100),
  answers           jsonb not null default '[]' check (jsonb_typeof(answers) = 'array'),   -- [{key, label_he, value}]
  consent           jsonb,                                    -- {marketing_opt_in, notice_version, text_he}
  status            public.lead_status not null default 'new',
  notes_he          text check (notes_he is null or char_length(notes_he) <= 1000),
  assigned_to       uuid references public.profiles(id) on delete set null,
  contacted_at      timestamptz,
  reminder_sent_at  timestamptz,
  received_at       timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint leads_meta_ref check (source <> 'meta_form' or meta_leadgen_id is not null)
);
create index leads_ws_received_idx on public.leads (workspace_id, received_at desc);
create index leads_ws_status_idx   on public.leads (workspace_id, status);
create index leads_campaign_idx    on public.leads (campaign_id);
create index leads_landing_idx     on public.leads (landing_page_id) where landing_page_id is not null;

-- ===== 7. managed spend, deletion requests, health checks, monthly plans =====
create table public.managed_spend_monthly (
  billing_workspace_id uuid not null references public.workspaces(id) on delete cascade,
  month                date not null check (extract(day from month) = 1),   -- first day of the Asia/Jerusalem month
  spend_ils            numeric(12,2) not null default 0 check (spend_ils >= 0),
  cap_ils              numeric(12,2),
  warned_80_at         timestamptz,
  reached_at           timestamptz,
  updated_at           timestamptz not null default now(),
  primary key (billing_workspace_id, month)
);

create table public.meta_data_deletion_requests (
  id                uuid primary key default gen_random_uuid(),
  meta_user_id      text not null,
  confirmation_code text not null unique check (confirmation_code ~ '^[A-Z2-7]{12}$'),
  status            text not null default 'pending' check (status in ('pending','processing','completed')),
  connection_ids    uuid[] not null default '{}',
  received_at       timestamptz not null default now(),
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.ad_health_reports (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  connection_id uuid references public.meta_connections(id) on delete set null,
  period_start  date not null,
  period_end    date not null,
  status        text not null default 'running' check (status in ('running','succeeded','failed')),
  checks        jsonb not null default '[]' check (jsonb_typeof(checks) = 'array'),    -- HealthCheckResult[] (§15.2)
  report        jsonb,                                        -- HealthCheckReportV1 (§18.6)
  score         smallint check (score is null or score between 0 and 100),
  error_code    text,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz,
  constraint ad_health_reports_period check (period_end >= period_start),
  constraint ad_health_reports_done check (status <> 'succeeded' or (report is not null and score is not null))
);
create index ad_health_reports_ws_idx on public.ad_health_reports (workspace_id, created_at desc);

create table public.content_plans (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  month        date not null check (extract(day from month) = 1),
  inputs       jsonb not null default '{}' check (jsonb_typeof(inputs) = 'object'),
               -- {niche_slug, goal, area, budget_comfort_ils, auto_next_month, meta_ads_available}
  summary_he   text check (summary_he is null or char_length(summary_he) <= 300),
  status       text not null default 'generating' check (status in ('generating','ready','failed','archived')),
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index content_plans_one_current on public.content_plans (workspace_id, month) where status in ('generating','ready');
create index content_plans_ws_idx on public.content_plans (workspace_id, month desc);

create table public.content_plan_items (
  id                uuid primary key default gen_random_uuid(),
  plan_id           uuid not null references public.content_plans(id) on delete cascade,
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  planned_for       date not null,
  kind              text not null check (kind in ('video','trend','campaign','post')),
  title_he          text not null check (char_length(title_he) between 2 and 80),
  why_he            text check (why_he is null or char_length(why_he) <= 160),
  hook_id           text references public.hooks(id) on delete set null,
  trend_template_id uuid,                                     -- FK added in 0014
  season_slug       text references public.seasons(slug) on update cascade on delete set null,
  daily_budget_ils  numeric(10,2) check (daily_budget_ils is null or daily_budget_ils > 0),   -- kind = 'campaign'
  prefill           jsonb not null default '{}' check (jsonb_typeof(prefill) = 'object'),   -- CreateProjectBody / CreateCampaignBody seed
  project_id        uuid references public.projects(id) on delete set null,
  social_post_id    uuid references public.social_posts(id) on delete set null,
  campaign_id       uuid references public.ad_campaigns(id) on delete set null,
  status            text not null default 'planned' check (status in ('planned','in_progress','done','skipped')),
  sort_order        smallint not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint content_plan_items_budget check (kind = 'campaign' or daily_budget_ils is null)
);
create index content_plan_items_plan_idx on public.content_plan_items (plan_id, planned_for);
create index content_plan_items_ws_idx   on public.content_plan_items (workspace_id, planned_for);
```

### 6.5 פונקציות וטריגרים

```sql
-- ===== 8. updated_at triggers for the new tables =====
do $$
declare t text;
begin
  foreach t in array array['meta_connections','meta_tokens','meta_assets','social_posts','ad_campaigns','ad_variants','ad_rules',
                           'lead_forms','landing_pages','leads','managed_spend_monthly','meta_data_deletion_requests',
                           'content_plans','content_plan_items'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ===== 9. same-workspace guard (defence in depth; all writes are server-side) =====
create or replace function public.meta_same_workspace_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_table_name in ('ad_variants','ad_insights_daily','ad_change_log') then
    if not exists (select 1 from public.ad_campaigns c where c.id = new.campaign_id and c.workspace_id = new.workspace_id) then
      perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'cross_workspace'));
    end if;
  elsif tg_table_name = 'leads' then
    if (new.campaign_id is not null and not exists (select 1 from public.ad_campaigns c
                                                    where c.id = new.campaign_id and c.workspace_id = new.workspace_id))
       or (new.landing_page_id is not null and not exists (select 1 from public.landing_pages p
                                                           where p.id = new.landing_page_id and p.workspace_id = new.workspace_id)) then
      perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'cross_workspace'));
    end if;
  elsif tg_table_name = 'content_plan_items' then
    if not exists (select 1 from public.content_plans p where p.id = new.plan_id and p.workspace_id = new.workspace_id) then
      perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'cross_workspace'));
    end if;
  end if;
  return new;
end $$;

create trigger ad_variants_ws_guard        before insert or update of campaign_id, workspace_id on public.ad_variants
  for each row execute function public.meta_same_workspace_guard();
create trigger ad_insights_ws_guard        before insert on public.ad_insights_daily
  for each row execute function public.meta_same_workspace_guard();
create trigger ad_change_log_ws_guard      before insert on public.ad_change_log
  for each row execute function public.meta_same_workspace_guard();
create trigger leads_ws_guard              before insert or update of campaign_id, landing_page_id, workspace_id on public.leads
  for each row execute function public.meta_same_workspace_guard();
create trigger content_plan_items_ws_guard before insert or update of plan_id, workspace_id on public.content_plan_items
  for each row execute function public.meta_same_workspace_guard();

-- ===== 10. Realtime: workspace:{id} broadcasts (ids and statuses only; part 04 §14) =====
create or replace function public.broadcast_meta_change()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_event text; v_payload jsonb;
begin
  if tg_table_name = 'ad_campaigns' then
    v_event := 'campaign.updated';
    v_payload := jsonb_build_object('id', new.id, 'status', new.status, 'effective_status', new.effective_status, 'updated_at', new.updated_at);
  elsif tg_table_name = 'leads' then
    v_event := 'lead.created';
    v_payload := jsonb_build_object('id', new.id, 'campaign_id', new.campaign_id, 'received_at', new.received_at);
  else
    v_event := 'social_post.updated';
    v_payload := jsonb_build_object('id', new.id, 'status', new.status, 'platform', new.platform, 'updated_at', new.updated_at);
  end if;
  perform realtime.send(v_payload, v_event, 'workspace:' || new.workspace_id::text, true);
  return null;
exception when others then
  raise warning 'broadcast_meta_change failed on %: %', tg_table_name, sqlerrm;   -- never fail a write over a broadcast
  return null;
end $$;

create trigger ad_campaigns_broadcast_insert after insert on public.ad_campaigns
  for each row execute function public.broadcast_meta_change();
create trigger ad_campaigns_broadcast_update after update of status, effective_status on public.ad_campaigns
  for each row when (old.status is distinct from new.status or old.effective_status is distinct from new.effective_status)
  execute function public.broadcast_meta_change();
create trigger leads_broadcast_insert after insert on public.leads
  for each row execute function public.broadcast_meta_change();
create trigger social_posts_broadcast_insert after insert on public.social_posts
  for each row execute function public.broadcast_meta_change();
create trigger social_posts_broadcast_update after update of status on public.social_posts
  for each row when (old.status is distinct from new.status)
  execute function public.broadcast_meta_change();

-- ===== 11. managed spend (caps) =====
-- internal: the plan's managed-spend cap of the billing workspace; null = no cap
create or replace function public._managed_spend_cap_ils(p_ws uuid)
returns numeric
language sql stable security definer set search_path = ''
as $$
  select ((select pl.limits from public._workspace_plan(p_ws) pl) ->> 'meta_monthly_spend_cap_ils')::numeric;
$$;

-- granted to authenticated: R39 check first (owner/admin of p_ws; agency owners/admins are admins of client workspaces)
create or replace function public.meta_spend_summary(p_ws uuid)
returns table (month date, spend_ils numeric, cap_ils numeric, pct numeric, state text)
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_bws   uuid;
  v_month date := date_trunc('month', now() at time zone 'Asia/Jerusalem')::date;
  v_grace int  := coalesce((select (s.value #>> '{}')::int from public.app_settings s where s.key = 'meta_spend_cap_grace_days'), 7);
  v_row   public.managed_spend_monthly;
  v_cap   numeric;
  v_spend numeric;
begin
  if (select auth.uid()) is not null and not (public.has_role(p_ws, '{owner,admin}') or public.is_platform_admin()) then
    return;                                                   -- no rows: nothing is learned about a foreign workspace
  end if;
  v_bws := public._billing_workspace_id(p_ws);
  if v_bws is null then return; end if;
  v_cap := public._managed_spend_cap_ils(v_bws);
  select * into v_row from public.managed_spend_monthly m where m.billing_workspace_id = v_bws and m.month = v_month;
  v_spend := coalesce(v_row.spend_ils, 0);
  month     := v_month;
  spend_ils := v_spend;
  cap_ils   := v_cap;
  pct       := case when v_cap > 0 then round(v_spend / v_cap * 100, 1) end;
  state     := case
                 when v_cap is null or (v_cap = 0 and v_spend = 0) or v_spend < v_cap * 0.8 then 'ok'
                 when v_spend < v_cap then 'warn'
                 when v_row.reached_at is not null and v_row.reached_at < now() - make_interval(days => v_grace) then 'grace_over'
                 else 'reached'
               end;
  return next;
end $$;

-- service role (hourly cron): month-to-date spend per billing workspace; the free test campaign is excluded (Meta spend_cap caps it)
create or replace function public.refresh_managed_spend(p_month date)
returns int
language plpgsql security definer set search_path = ''
as $$
declare v_n int;
begin
  insert into public.managed_spend_monthly as m (billing_workspace_id, month, spend_ils, cap_ils, updated_at)
  select s.bws, p_month, s.spend, public._managed_spend_cap_ils(s.bws), now()
  from (
    select public._billing_workspace_id(d.workspace_id) as bws, sum(d.spend_ils) as spend
    from public.ad_insights_daily d
    join public.ad_campaigns c on c.id = d.campaign_id and not c.is_free_test
    where d.date >= p_month and d.date < (p_month + interval '1 month')::date
    group by 1
  ) s
  where s.bws is not null
  on conflict (billing_workspace_id, month)
  do update set spend_ils = excluded.spend_ils, cap_ils = excluded.cap_ils, updated_at = now();
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- service role: successful budget changes in the last hour (Meta allows 4; we allow 3 — §5)
create or replace function public.ad_budget_changes_last_hour(p_campaign uuid)
returns int
language sql stable security definer set search_path = ''
as $$
  select count(*)::int
  from public.ad_change_log l
  where l.campaign_id = p_campaign
    and l.created_at > now() - interval '1 hour'
    and l.meta_error_code is null
    and (l.action in ('budget_change','rule_budget') or (l.action = 'boost_winner' and l.after ? 'daily_budget_ils'));
$$;

-- ===== 12. purges =====
-- service role: 'tokens' = disconnect; 'all' = also every Meta mirror of the workspace (landing-page leads stay)
create or replace function public.purge_meta_data(p_ws uuid, p_scope text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_scope not in ('tokens','all') then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'purge_scope'));
  end if;
  delete from public.meta_tokens t using public.meta_connections c
   where t.connection_id = c.id and c.workspace_id = p_ws;
  update public.meta_connections
     set status = 'revoked', revoked_at = coalesce(revoked_at, now()), revoked_reason = coalesce(revoked_reason, 'user_disconnect')
   where workspace_id = p_ws and status <> 'revoked';
  update public.meta_assets set is_selected = false where workspace_id = p_ws and is_selected;
  update public.ad_rules set enabled = false where workspace_id = p_ws and enabled;
  if p_scope = 'all' then
    delete from public.leads             where workspace_id = p_ws and source = 'meta_form';
    delete from public.lead_forms        where workspace_id = p_ws;
    delete from public.ad_rules          where workspace_id = p_ws;
    delete from public.ad_campaigns      where workspace_id = p_ws;   -- cascades: variants, insights, change log, campaign rules
    delete from public.social_posts      where workspace_id = p_ws;   -- cascades: metrics
    delete from public.ad_health_reports where workspace_id = p_ws;
    delete from public.meta_assets       where workspace_id = p_ws;
    update public.meta_connections set meta_user_id = null, client_business_id = null where workspace_id = p_ws;
  end if;
end $$;

-- pg_cron only: leads older than 24 months (Meta forms and landing pages alike)
create or replace function public.purge_leads()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v_n int;
begin
  delete from public.leads where received_at < now() - interval '24 months';
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ===== 13. public landing page (anon + authenticated; returns only published, public content) =====
create or replace function public.landing_page_public(p_slug text)
returns table (slug text, content jsonb, show_branding boolean, indexable boolean, published_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select lp.slug, lp.published_content, lp.show_branding, lp.indexable, lp.published_at, lp.updated_at
  from public.landing_pages lp
  join public.workspaces w on w.id = lp.workspace_id and w.deleted_at is null
  where lp.slug = lower(btrim(p_slug)) and lp.status = 'published' and lp.published_content is not null;
$$;
```

`landing_page_public` לא מתחילה בבדיקת גישה (R39) כי היא מחזירה בכוונה רק תוכן ציבורי שהעסק פרסם — בלי מזהה סביבה, בלי מזהה הדף, בלי הטיוטה ובלי שדה פרטי. זו הפונקציה היחידה בחלק הזה שמוענקת ל-`anon`.

### 6.6 RLS, הרשאות טבלה והרשאות פונקציה

```sql
-- ===== 14. RLS on every new table; explicit privileges; all writes server-only =====
do $$
declare t text;
begin
  foreach t in array array['meta_connections','meta_tokens','meta_assets','social_posts','social_post_metrics','ad_campaigns',
                           'ad_variants','ad_insights_daily','ad_rules','ad_change_log','lead_forms','landing_pages','leads',
                           'managed_spend_monthly','meta_data_deletion_requests','ad_health_reports','content_plans',
                           'content_plan_items'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

grant select (id, workspace_id, connected_by, client_business_id, business_name, status, scopes, granted_at, assets_synced_at,
              last_health_at, last_error_code, last_error_he, revoked_at, revoked_reason, terms_accepted_at, created_at, updated_at)
  on public.meta_connections to authenticated;                                      -- not meta_user_id
grant select (id, workspace_id, connection_id, kind, meta_id, name, picture_url, is_selected, currency, timezone_name, account_status,
              has_funding_source, min_daily_budget_ils, page_tasks, instagram_username, linked_page_id, whatsapp_e164,
              whatsapp_confirmed_at, privacy_policy_url, leadgen_subscribed_at, trial_reels_eligible, reach_summary, preflight,
              last_synced_at, created_at, updated_at)
  on public.meta_assets to authenticated;                                           -- not min_budgets
grant select (variant_id, date, workspace_id, campaign_id, spend_ils, impressions, reach, frequency, clicks, link_clicks,
              landing_page_views, video_3s_plays, thruplays, p25, p50, p75, p95, p100, avg_watch_ms, leads, conversations, results,
              cpm_ils, ctr, synced_at)
  on public.ad_insights_daily to authenticated;                                     -- not raw
grant select (post_id, captured_at, views, reach, likes, comments, shares, saves, total_interactions, reposts, avg_watch_ms,
              total_watch_ms, skip_rate)
  on public.social_post_metrics to authenticated;                                   -- not raw
grant select on public.social_posts, public.ad_campaigns, public.ad_variants, public.ad_rules, public.ad_change_log,
                public.lead_forms, public.landing_pages, public.leads, public.ad_health_reports, public.content_plans,
                public.content_plan_items
  to authenticated;
-- meta_tokens, meta_data_deletion_requests, managed_spend_monthly: no grants at all (spend is read through meta_spend_summary)

create policy meta_connections_select_member   on public.meta_connections   for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy meta_assets_select_member        on public.meta_assets        for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy social_posts_select_member       on public.social_posts       for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy social_post_metrics_select_member on public.social_post_metrics for select to authenticated
  using (post_id in (select p.id from public.social_posts p where p.workspace_id in (select public.accessible_workspace_ids())));
create policy ad_campaigns_select_member       on public.ad_campaigns       for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy ad_variants_select_member        on public.ad_variants        for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy ad_insights_select_member        on public.ad_insights_daily  for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy ad_rules_select_member           on public.ad_rules           for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy ad_change_log_select_member      on public.ad_change_log      for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy lead_forms_select_member         on public.lead_forms         for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy landing_pages_select_member      on public.landing_pages      for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy leads_select_member              on public.leads              for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy ad_health_reports_select_member  on public.ad_health_reports  for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy content_plans_select_member      on public.content_plans      for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));
create policy content_plan_items_select_member on public.content_plan_items for select to authenticated using (workspace_id in (select public.accessible_workspace_ids()));

-- ===== 15. function privileges (R9: explicit revoke for every function this file creates, then the grants) =====
revoke execute on function public.meta_same_workspace_guard()           from public, anon, authenticated;
revoke execute on function public.broadcast_meta_change()               from public, anon, authenticated;
revoke execute on function public._managed_spend_cap_ils(uuid)          from public, anon, authenticated;
revoke execute on function public.meta_spend_summary(uuid)              from public, anon, authenticated;
revoke execute on function public.refresh_managed_spend(date)           from public, anon, authenticated;
revoke execute on function public.ad_budget_changes_last_hour(uuid)     from public, anon, authenticated;
revoke execute on function public.purge_meta_data(uuid, text)           from public, anon, authenticated;
revoke execute on function public.purge_leads()                         from public, anon, authenticated, service_role;
revoke execute on function public.landing_page_public(text)             from public, anon, authenticated;
grant  execute on function public.meta_spend_summary(uuid)  to authenticated;
grant  execute on function public.landing_page_public(text) to anon, authenticated;
```

### 6.7 pg_cron, אחסון ו-Realtime

```sql
-- ===== 16. pg_cron (2 new jobs; 13 after this file, 14 after 0014) =====
select cron.schedule('purge-meta-raw', '35 3 * * *', $$
  update public.ad_insights_daily   set raw = null where raw is not null and date < current_date - 90;
  update public.social_post_metrics set raw = null where raw is not null and captured_at < now() - interval '90 days';
  delete from public.ad_health_reports where created_at < now() - interval '12 months';
  delete from public.meta_data_deletion_requests where status = 'completed' and completed_at < now() - interval '3 years';
$$);
select cron.schedule('purge-leads', '40 4 1 * *', $$select public.purge_leads()$$);
```

- **אחסון:** אין bucket חדש. הסרטונים מגיעים למטא דרך כתובות חתומות ל-`renders` עם `SIGNED_TTL.pipeline` (6 שעות, מעל המינימום של שעתיים) או בהעלאה מתחדשת; תמונות ממוזערות מנכס ה-`poster` (פריים ב-1.2 שניות), ופוסטר 1:1 דרך `PosterStill` כשיש רינדור 1:1. **נתיב ציבורי חדש** ב-`public-media`: `landing/{landing_page_id}/hero.mp4` · `poster.jpg` · `captions.vtt` · `logo.{png|webp|svg}` — נכתב רק בפרסום של דף העסק, ונמחק בהסרה מפרסום ובמחיקה (§14.5).
- **Realtime** (ערוץ קיים `workspace:{workspaceId}`, ‏`realtime_topic_allowed` לא משתנה): `campaign.updated {id, status, effective_status, updated_at}` · `lead.created {id, campaign_id, received_at}` · `social_post.updated {id, status, platform, updated_at}`.

### 6.8 בדיקות pgTAP (`supabase/tests/11_meta_rls.sql`)

| מקרה | מצופה |
|---|---|
| חבר בסביבה A קורא `ad_campaigns`, ‏`leads`, ‏`social_posts` של B | 0 שורות |
| צופה קורא `leads` של הסביבה שלו | מצליח (הלידים שייכים לעסק) |
| `authenticated` מנסה `select token_enc from meta_tokens` / `select * from meta_data_deletion_requests` / `select * from managed_spend_monthly` | שגיאת הרשאה |
| `select meta_user_id from meta_connections`, ‏`select min_budgets from meta_assets`, ‏`select raw from ad_insights_daily` | שגיאת הרשאה על העמודה |
| `insert`/`update`/`delete` של `authenticated` על כל אחת מ-18 הטבלאות | שגיאת הרשאה |
| `meta_spend_summary(B)` כעורך של B / כמנהל של B / כמשתמש זר | 0 שורות / שורה אחת / 0 שורות |
| `landing_page_public('slug')` כ-`anon`: דף `draft` / `published` / `published` בסביבה שנמחקה | 0 / 1 / 0 שורות |
| `has_function_privilege('service_role', 'public.purge_leads()', 'execute')` | `false` |
| allow-list (חלק 04 §25.2) | מוסיפה בדיוק את `meta_spend_summary(uuid)` (authenticated) ו-`landing_page_public(text)` (anon, authenticated) |
| `ad_variants` עם `workspace_id` שונה משל הקמפיין | `INVALID_INPUT {reason:"cross_workspace"}` |
| שני `is_selected` מאותו סוג באותה סביבה / שני חיבורים חיים | הפרת ייחודיות |
| `purge_meta_data(ws,'all')` | אין קמפיינים, פוסטים, טפסים ונכסים; לידים `landing_page` נשארים; `meta_user_id` מתאפס |
| `ad_budget_changes_last_hour` עם שני שינויים, אחד עם `meta_error_code` | 1 |

### קריטריוני קבלה
- [ ] `pnpm db:reset` עם `0013` עובר, ו-`select count(*) from pg_type t join pg_namespace n on n.oid = t.typnamespace where n.nspname = 'public' and t.typtype = 'e'` מחזיר 50 (36 + 14); אחרי `0014` — 58.
- [ ] `select jobname from cron.job` מכיל את `purge-meta-raw` ואת `purge-leads` (13 משימות אחרי הקובץ הזה).
- [ ] אף טבלה חדשה בלי RLS, ואף מדיניות `to public` (הבדיקות של חלק 04 §12).
- [ ] כל מקרי §6.8 עוברים ב-`pnpm db:test`.
- [ ] עדכון `status` של קמפיין שולח `campaign.updated` לערוץ `workspace:{id}` בלבד, וכשל של `realtime.send` לא מפיל את העדכון.

---

## §7. נתיבי ה-API וחוזי Zod

המוסכמות של חלק 04 §18: עטיפת `route()`, ‏Zod, ‏`{ error: { code, message_he, details } }`, מעטפות ב-camelCase ו-DTO-ים ב-snake_case, `Idempotency-Key` כשמסומן. הרשאות: **member**, **editor+**, **owner/admin** של הסביבה מעוגיית `ws`. כל נתיב תחת `/api/meta/*`, ‏`/api/campaigns/*`, ‏`/api/leads/*`, ‏`/api/social/*`, ‏`/api/landing-pages/*`, ‏`/api/plan/*` מחזיר `404 NOT_FOUND` כשהדגל שלו כבוי (§1.5), ו-`META_NOT_CONNECTED` כשאין חיבור חי או נכסים נבחרים (לא חל על דף העסק, על הלידים ועל התוכנית).

### 7.1 טבלת הנתיבים

| # | Method · Path | הרשאה | Idem. | קצב | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|---|
| M1 | `POST /api/meta/connect/start` | owner/admin | — | `meta_write` | `200 { authUrl }` (גוף `MetaConnectStartBody`) | `PLAN_LIMIT` (`meta_ad_accounts`) |
| M2 | `GET /api/meta/connect/callback?code=&state=` | user (עוגייה) | — | default | `303` ← מסך הנכסים או `returnTo` | הפניה `?error=…` |
| M3 | `GET /api/meta/assets` | member | — | `meta_read` | `200 MetaAssetsResponse` | `META_NOT_CONNECTED` |
| M4 | `POST /api/meta/assets/select` | owner/admin | — | `meta_write` | `200 { preflight }` | `INVALID_INPUT`, `META_API_ERROR`, `PLAN_LIMIT` (`meta_ad_accounts`) |
| M5 | `POST /api/meta/preflight` | member | — | `meta_read` | `200 { preflight }` | `META_NOT_CONNECTED` |
| M6 | `POST /api/meta/disconnect` | owner/admin | — | `meta_write` | `200 { status: "revoked" }` | `INVALID_INPUT` (`confirm_text`) |
| M7 | `GET /api/meta/geo/search?q=` | member | — | `meta_read` | `200 { items: GeoOption[] }` | — |
| M8 | `GET /api/meta/dashboard?range=7d\|14d\|30d` | member | — | `meta_read` | `200 MetaDashboardResponse` | — |
| HC1 | `POST /api/meta/health-check` | owner/admin | — | `health_check` | `202 { reportId }` | `PLAN_LIMIT` (`health_checks_per_month`), `META_NOT_CONNECTED`, `RATE_LIMITED` |
| HC2 | `GET /api/meta/health-check/latest` | member | — | default | `200 { report, usedThisMonth, max }` | — |
| C1 | `GET /api/campaigns?status=&cursor=` | member | — | default | `200 { items, nextCursor }` | — |
| C2 | `POST /api/campaigns` | editor+ | — | `meta_write` | `201 { campaignId }` | `NOT_FOUND`, `AD_NOT_ELIGIBLE`, `PLAN_LIMIT` (`meta_active_campaigns`, `meta_split_test`) |
| C3 | `GET /api/campaigns/[id]` | member | — | default | `200 { campaign, variants, changeLog }` | `NOT_FOUND` |
| C4 | `PATCH /api/campaigns/[id]` | editor+ | — | default | `200 { campaign }` | `EDIT_CONFLICT` (`stale`, `not_draft`), `INVALID_INPUT` (`below_min_budget`, `radius_out_of_range`) |
| C5 | `POST /api/campaigns/[id]/copy` | editor+ | **כן** | `llm` | **NDJSON** `AdCopyV1` (0 קרדיטים) | `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE` |
| C6 | `POST /api/campaigns/[id]/prepare` | owner/admin | **כן** | `meta_write` | `202 { runId }` | `META_ACCOUNT_NOT_READY`, `AD_NOT_ELIGIBLE`, `MODERATION_BLOCKED`, `ELECTION_POLICY_BLOCKED`, `PLAN_LIMIT` (`meta_monthly_spend_cap_ils`) |
| C7 | `GET /api/campaigns/[id]/previews` | member | — | `meta_read` | `200 { previews }` (מטמון 30 דק׳) | `INVALID_INPUT` (`not_ready`) |
| C8 | `POST /api/campaigns/[id]/publish` | owner/admin | **כן** | `meta_write` | `200 { status: "in_review" }` | כמו C6 + `META_API_ERROR` |
| C9 | `POST /api/campaigns/[id]/pause` | editor+ | — | `meta_write` | `200 { status }` | `META_API_ERROR` |
| C10 | `POST /api/campaigns/[id]/resume` | owner/admin | — | `meta_write` | `200 { status }` | `PLAN_LIMIT`, `META_ACCOUNT_NOT_READY` |
| C11 | `POST /api/campaigns/[id]/budget` | owner/admin | — | שומר DB | `200 { campaign, budgetChangesLeft }` | `RATE_LIMITED` (`meta_budget`), `PLAN_LIMIT`, `INVALID_INPUT` (`below_min_budget`) |
| C12 | `POST /api/campaigns/[id]/end` | owner/admin | — | `meta_write` | `200 { status: "completed" }` | — |
| C13 | `POST /api/campaigns/[id]/duplicate` | editor+ | — | `meta_write` | `201 { campaignId }` | `PLAN_LIMIT` |
| C14 | `POST /api/campaigns/[id]/boost-winner` | owner/admin | **כן** | `meta_write` | `200 { campaign }` | `INVALID_INPUT` (`no_winner_yet`), `RATE_LIMITED` (`meta_budget`) |
| C15 | `GET /api/campaigns/[id]/insights?range=` | member | — | default | `200 CampaignInsightsResponse` | — |
| C16 | `POST /api/campaigns/[id]/insights/refresh` | member | — | `meta_refresh` | `202` | `RATE_LIMITED` |
| C17 | `POST /api/campaigns/[id]/explain` | member | — | `llm` | **NDJSON** `InsightExplainV1` (0 קרדיטים; מטמון 6 שעות) | `PROVIDER_UNAVAILABLE` |
| C18 | `GET` · `PUT /api/campaigns/[id]/rules` | member · owner/admin | — | default | `200 { rules }` | `PLAN_LIMIT` (`meta_auto_rules`), `NOT_FOUND` |
| L1 | `GET /api/leads?status=&campaignId=&source=&from=&to=&cursor=` | member | — | default | `200 { items, counts, nextCursor }` | — |
| L2 | `PATCH /api/leads/[id]` | editor+ | — | default | `200 { lead }` | `NOT_FOUND`, `PLAN_LIMIT` (`meta_lead_inbox`) |
| L3 | `DELETE /api/leads/[id]` | owner/admin | — | default | `204` | — |
| L4 | `GET /api/leads/export.csv?from=&to=&status=` | owner/admin | — | `leads_export` | `200 text/csv` (UTF-8 עם BOM, כותרות בעברית) | `PLAN_LIMIT` (`meta_lead_inbox`) |
| S1 | `POST /api/social/posts` | editor+ | **כן** | `social_publish` | `201 { postIds }` | `INVALID_INPUT` (`video_spec`, `hashtags_max`, `schedule_past`, `quiet_day`), `PLAN_LIMIT` (`social_scheduled_max`), `RATE_LIMITED` (`ig_publish_daily`, `fb_reels_daily`) |
| S2 | `GET /api/social/calendar?from=&to=` | member | — | default | `200 CalendarResponse` | — |
| S3 | `PATCH /api/social/posts/[id]` | editor+ | — | default | `200 { post }` (מתוזמן בלבד) | `EDIT_CONFLICT` (`not_scheduled`) |
| S4 | `POST /api/social/posts/[id]/cancel` | editor+ | — | default | `200 { status: "canceled" }` | `EDIT_CONFLICT` |
| S5 | `POST /api/social/posts/[id]/retry` | editor+ | — | `social_publish` | `202` | `INVALID_INPUT` (`not_failed`) |
| S6 | `GET /api/social/posts/[id]/boost-eligibility` | member | — | `meta_read` | `200 { eligible, reasonHe? }` | `META_API_ERROR` |
| LP1 | `GET /api/landing-pages` | member | — | default | `200 { items, allowance }` | — |
| LP2 | `POST /api/landing-pages` | editor+ | **כן** | `llm` | **NDJSON** `LandingPageContentV1`; ‏`done.landingPageId` (10 קרדיטים, `landing.generate`) | `INSUFFICIENT_CREDITS`, `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE`, `INVALID_INPUT` (`too_many_pages`) |
| LP3 | `POST /api/landing-pages/[id]/generate` | editor+ | **כן** | `llm` | **NDJSON**, יצירה מחדש (10 קרדיטים) | כמו LP2 |
| LP4 | `PATCH /api/landing-pages/[id]` | editor+ | — | default | `200 { page }` (עריכת טקסט חינם) | `EDIT_CONFLICT` (`stale`), `INVALID_INPUT` (`slug_invalid`, `slug_taken`, `slug_reserved`), `MODERATION_BLOCKED` |
| LP5 | `DELETE /api/landing-pages/[id]` | owner/admin | — | default | `204` | — |
| LP6 | `POST /api/landing-pages/[id]/publish` | owner/admin | — | default | `200 { page, url }` | `PLAN_LIMIT` (`landing_pages`), `INVALID_INPUT` (`legal_identity_missing`, `no_contact_channel`), `MODERATION_BLOCKED` |
| LP7 | `POST /api/landing-pages/[id]/unpublish` | owner/admin | — | default | `200 { page }` | — |
| LP8 | `POST /api/b/[slug]/lead` | public | — | `landing_lead` | `204` | `INVALID_INPUT`, `RATE_LIMITED`, `NOT_FOUND` |
| LP9 | `POST /api/b/[slug]/view` | public | — | — (מניעת כפילות, §14.5) | `204` | — |
| PL1 | `POST /api/plan/generate` | editor+ | **כן** | `plan_generate` | **NDJSON** `MonthlyPlanV1`; ‏`done.planId` (0 קרדיטים) | `RATE_LIMITED`, `PROVIDER_UNAVAILABLE` |
| PL2 | `GET /api/plan/current?month=` | member | — | default | `200 { plan, items }` | — |
| PL3 | `PATCH /api/plan/items/[id]` | editor+ | — | default | `200 { item }` | `NOT_FOUND`, `INVALID_INPUT` (`quiet_day`, `outside_month`) |

הנתיב הקיים `POST /api/projects/[id]/post-caption` (חלק 04 §19.2 #20) עובר ל-`post.caption.v2` ומחזיר `{ post_caption_he, hashtags_he, first_line_cta_he }`. הנתיבים LP3 (יצירה מחדש בתשלום) ו-LP9 (ספירת צפיות בדף שמוגש ב-ISR) הם החלטה של החלק הזה (§24).

### 7.2 החוזים (`lib/api/contracts/{meta,campaigns,leads,social,landing,plan}.ts`)

```ts
import { z } from "zod/v4";
import { Uuid, IsoDateTime, Slug, HookId, HeText } from "./common";
import { IsraeliPhone, HttpUrl } from "@/lib/validation/il";
import { Hashtag } from "@/lib/ai/schemas/script";
import { type Row } from "@/lib/supabase/enums";
import { InsightAction } from "@/lib/ai/schemas/ads";
import { LandingPageContentV1 } from "@/lib/landing/content";             // §14.2
// MetaPreflightV1 and PreflightCheckKey live in meta.ts too (§3.4)

// ---------- meta.ts ----------
export const ConnectLocation = z.enum(["onboarding", "settings", "project", "campaign_builder", "publish"]);
export const MetaConnectStartBody = z.object({ location: ConnectLocation, returnTo: z.string().max(200).optional(), acceptTerms: z.literal(true) }).strict();
export const MetaConnectStartResponse = z.object({ authUrl: z.url() });
const AssetDTO = z.looseObject({ id: Uuid, kind: z.enum(["ad_account", "page", "instagram_account", "whatsapp_number"]), meta_id: z.string(), name: z.string(), is_selected: z.boolean() });
export const MetaAssetsResponse = z.object({
  connection: z.looseObject({ id: Uuid, status: z.enum(["active", "needs_reconnect", "revoked"]), business_name: z.string().nullable(), assets_synced_at: IsoDateTime.nullable() }).nullable(),
  adAccounts: z.array(AssetDTO), pages: z.array(AssetDTO), instagramAccounts: z.array(AssetDTO),
  selected: z.object({ adAccountId: Uuid.nullable(), pageId: Uuid.nullable(), instagramId: Uuid.nullable(), whatsappE164: z.string().nullable() }),
  preflight: MetaPreflightV1.nullable(),
});
export const MetaAssetSelectBody = z.object({
  adAccountId: Uuid, pageId: Uuid, instagramId: Uuid.optional(),
  whatsappE164: IsraeliPhone.optional(), whatsappConfirmed: z.boolean().optional(), privacyPolicyUrl: HttpUrl.optional(),
}).strict().refine((b) => !b.whatsappE164 || b.whatsappConfirmed === true, { path: ["whatsappConfirmed"], params: { key: "required" } });
export const MetaDisconnectBody = z.object({ purge: z.enum(["tokens", "all"]), confirmText: z.string().max(20).optional() }).strict();
export const GeoOption = z.object({ key: z.string(), type: z.enum(["city", "region", "country"]), nameHe: z.string(), regionHe: z.string().nullable(),
  center: z.object({ lat: z.number(), lng: z.number() }).nullable() });
export const SpendSummary = z.object({ month: z.iso.date(), spendIls: z.number(), capIls: z.number().nullable(), pct: z.number().nullable(),
  state: z.enum(["ok", "warn", "reached", "grace_over"]), graceDaysLeft: z.number().int().nullable() });
export const Kpis = z.object({ spendIls: z.number(), reach: z.number().int(), results: z.number().int(), resultLabel: z.enum(["whatsapp", "leads", "visits", "views_3s", "mixed"]),
  costPerResultIls: z.number().nullable(), costPer1000ReachIls: z.number().nullable(),
  deltas: z.object({ spendIls: z.number().nullable(), reach: z.number().nullable(), results: z.number().nullable(), costPerResultIls: z.number().nullable() }) });
export const DashboardAction = z.object({ kind: z.enum(["fix_rejected_ad", "boost_winner", "reconnect", "leads_waiting", "cap_warning", "quiet_day"]), campaignId: Uuid.nullable(), count: z.number().int().nullable() });
export const MetaDashboardResponse = z.object({ spendSummary: SpendSummary.nullable(), kpis: Kpis, campaigns: z.array(z.looseObject({ id: Uuid })), actions: z.array(DashboardAction) });

// ---------- campaigns.ts ----------
export const AdGoal = z.enum(["whatsapp_messages", "lead_form", "website_traffic", "local_awareness"]);
export const MetaCtaType = z.enum(["WHATSAPP_MESSAGE", "SIGN_UP", "GET_QUOTE", "BOOK_NOW", "LEARN_MORE", "SHOP_NOW", "CONTACT_US", "CALL_NOW"]);
export const GeoTargetV1 = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("radius"), center: z.object({ lat: z.number().min(29).max(34), lng: z.number().min(34).max(36), labelHe: HeText(2, 80) }), radiusKm: z.number().int().min(1).max(80) }),
  z.object({ mode: z.literal("cities"), cities: z.array(z.object({ key: z.string(), nameHe: HeText(2, 60), radiusKm: z.number().int().min(17).max(80).optional() })).min(1).max(10) }),
  z.object({ mode: z.literal("country") }),
]);
export const CreateCampaignBody = z.object({
  projectId: Uuid.optional(), variantGroupId: Uuid.optional(), socialPostId: Uuid.optional(),
  goal: AdGoal.optional(), seasonSlug: Slug.optional(), duplicateOf: Uuid.optional(), planItemId: Uuid.optional(),
}).strict().refine((b) => [b.projectId, b.variantGroupId, b.socialPostId, b.duplicateOf].filter(Boolean).length <= 1, { params: { key: "custom" } });
export const CampaignDraftPatch = z.object({
  ifUnmodifiedSince: IsoDateTime,
  name: HeText(1, 80).optional(), goal: AdGoal.optional(), geo: GeoTargetV1.optional(),
  ageMin: z.number().int().min(18).max(65).optional(), ageMax: z.number().int().min(18).max(65).optional(), advantageAudience: z.boolean().optional(),
  dailyBudgetIls: z.number().positive().multipleOf(0.01).optional(), userMonthlyCapIls: z.number().positive().nullable().optional(),
  startAt: IsoDateTime.nullable().optional(), endDate: z.iso.date().nullable().optional(),
  placements: z.enum(["advantage", "reels_stories"]).optional(), qualityLeads: z.boolean().optional(), creativeFeaturesOptin: z.boolean().optional(),
  ctaType: MetaCtaType.optional(),
  destination: z.object({ whatsappE164: IsraeliPhone.optional(), websiteUrl: HttpUrl.optional(), landingPageId: Uuid.optional(), phoneE164: IsraeliPhone.optional(),
    utmOverride: z.string().max(300).optional() }).strict().optional(),
  variants: z.array(z.object({ id: Uuid, primaryTextHe: z.string().max(500).optional(), headlineHe: z.string().max(40).optional(),
    descriptionHe: z.string().max(30).nullable().optional() }).strict()).max(3).optional(),
  leadForm: z.object({ questions: z.array(z.enum(["EMAIL", "CITY"])).max(2), custom: z.array(z.object({ labelHe: HeText(2, 80),
    kind: z.enum(["short_answer", "multiple_choice"]), options: z.array(HeText(1, 40)).max(6).optional() })).max(3),
    marketingOptIn: z.boolean() }).strict().optional(),
}).strict();
export const PublishCampaignBody = z.object({ confirmSpend: z.literal(true) }).strict();
export const BudgetChangeBody = z.object({ dailyBudgetIls: z.number().positive().multipleOf(0.01) }).strict();
export const BoostWinnerBody = z.object({ variantId: Uuid, raiseBudgetPct: z.union([z.literal(0), z.literal(10), z.literal(20)]) }).strict();
export const DuplicateBody = z.object({ newHooks: z.boolean().optional() }).strict();
export const AdRuleKind = z.enum(["pause_expensive_ad", "boost_winner", "alert_no_results", "alert_fatigue", "monthly_cap_stop"]);
export const AdRulesBody = z.object({ rules: z.array(z.object({ kind: AdRuleKind, enabled: z.boolean(), params: z.record(z.string(), z.union([z.number(), z.boolean(), z.null()])) }).strict()).max(5) }).strict();
export type AdRuleDTO = { id: string; kind: z.infer<typeof AdRuleKind>; scope: "campaign" | "workspace"; enabled: boolean; params: Record<string, number | boolean | null>; last_fired_at: string | null };
export type CampaignDTO = Omit<Row<"ad_campaigns">, "issues_info"> & { spend_summary?: z.infer<typeof SpendSummary> };
export type AdVariantDTO = Row<"ad_variants">;
export type CampaignListItemDTO = Pick<Row<"ad_campaigns">, "id" | "name" | "goal" | "status" | "daily_budget_ils" | "published_at" | "end_date"> & { kpis7d: z.infer<typeof Kpis>; thumbnail_url: string | null };
export const CampaignInsightsResponse = z.object({
  kpis: Kpis,
  daily: z.array(z.object({ date: z.iso.date(), spendIls: z.number(), results: z.number().int(), impressions: z.number().int() })),
  variants: z.array(z.object({ variantId: Uuid, impressions: z.number().int(), hookRate: z.number().nullable(), holdRate: z.number().nullable(),
    results: z.number().int(), costPerResultIls: z.number().nullable(), isWinner: z.boolean() })),
  sampleReady: z.boolean(), freshness: z.object({ syncedAt: IsoDateTime.nullable(), canRefreshAt: IsoDateTime.nullable() }),
});

// ---------- leads.ts ----------
export const LeadStatus = z.enum(["new", "contacted", "qualified", "won", "lost", "spam"]);
export const LeadPatchBody = z.object({ status: LeadStatus.optional(), notesHe: z.string().max(1000).nullable().optional(),
  assignedTo: Uuid.nullable().optional(), contacted: z.boolean().optional() }).strict();
export type LeadDTO = Omit<Row<"leads">, "meta_leadgen_id"> & { campaign_name: string | null; hook_text_he: string | null; landing_slug: string | null };
export const LeadFormSpecV1 = z.object({
  version: z.literal(1), name: HeText(1, 100), locale: z.literal("HE_IL"),
  questions: z.array(z.object({ type: z.enum(["FULL_NAME", "PHONE", "EMAIL", "CITY", "CUSTOM"]), key: z.string().regex(/^[a-z_]{2,30}$/),
    label_he: z.string().max(80).nullable(), options: z.array(z.string().max(40)).max(6).nullable() })).min(2).max(7),
  intro: z.object({ headline_he: z.string().max(60), text_he: z.string().max(200) }),
  privacy_policy: z.object({ url: z.url(), link_text_he: z.string().max(70) }),
  thank_you: z.object({ title_he: z.string().max(60), body_he: z.string().max(200), button: z.enum(["whatsapp", "call", "website"]), button_value: z.string() }),
  marketing_opt_in: z.object({ enabled: z.boolean(), text_he: z.string().max(200) }),
}).strict();

// ---------- social.ts ----------
export const CreateSocialPostBody = z.object({
  projectId: Uuid, versionId: Uuid.optional(), platforms: z.array(z.enum(["instagram", "facebook"])).min(1).max(2),
  kind: z.enum(["reel", "trial_reel"]), scheduledAt: IsoDateTime.nullable(), captionHe: z.string().max(2000), hashtagsHe: z.array(Hashtag).max(5),
  shareToFeed: z.boolean(), collaborators: z.array(z.string().regex(/^[A-Za-z0-9._]{1,30}$/)).max(3), locationPageId: z.string().optional(),
  trialGraduation: z.enum(["MANUAL", "SS_PERFORMANCE"]).optional(), coverAssetId: Uuid.optional(), aiNoticeAck: z.boolean(),
}).strict().refine((b) => b.kind === "reel" || (b.platforms.length === 1 && b.platforms[0] === "instagram" && !!b.trialGraduation), { params: { key: "custom" } });
export const SocialPostPatch = z.object({ scheduledAt: IsoDateTime.optional(), captionHe: z.string().max(2000).optional(), hashtagsHe: z.array(Hashtag).max(5).optional() }).strict();
export type SocialPostDTO = Omit<Row<"social_posts">, "meta_container_id">;
export const CalendarResponse = z.object({ posts: z.array(z.looseObject({ id: Uuid })), campaigns: z.array(z.looseObject({ id: Uuid })),
  seasons: z.array(z.looseObject({ slug: Slug })), quietDays: z.array(z.iso.date()), planItems: z.array(z.looseObject({ id: Uuid })) });
export const BoostEligibilityResponse = z.object({ eligible: z.boolean(), reasonHe: z.string().optional() });

// ---------- landing.ts (§14) and plan.ts (§16) ----------
export const CreateLandingPageBody = z.object({ brandKitId: Uuid.optional(), projectId: Uuid.optional(), slug: Slug.min(3).max(40).optional() }).strict();
export const RegenerateLandingBody = z.object({ keep: z.array(z.enum(["benefits", "services", "faq"])).max(3).optional() }).strict();
export const LandingPagePatch = z.object({ ifUnmodifiedSince: IsoDateTime, content: LandingPageContentV1.optional(),
  slug: Slug.min(3).max(40).optional(), indexable: z.boolean().optional(), brandKitId: Uuid.optional() }).strict();
export const PublicLeadBody = z.object({ fullName: HeText(2, 120), phone: IsraeliPhone, email: z.email().optional(), city: z.string().max(100).optional(),
  message: z.string().max(600).optional(), marketingOptIn: z.boolean(), elapsedMs: z.number().int().min(0),
  website: z.literal("").optional() }).strict();                    // honeypot + time-to-fill (§14.6)
export const GeneratePlanBody = z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
  inputs: z.object({ goal: z.enum(["more_whatsapp", "more_leads", "more_visits", "awareness"]), area: z.enum(["neighborhood", "city", "region", "country"]),
    budgetComfortIls: z.union([z.literal(0), z.literal(30), z.literal(40), z.literal(70), z.literal(100)]), autoNextMonth: z.boolean() }).strict() }).strict();
export const PlanItemPatch = z.object({ status: z.enum(["planned", "in_progress", "done", "skipped"]).optional(), plannedFor: z.iso.date().optional(),
  projectId: Uuid.optional(), socialPostId: Uuid.optional(), campaignId: Uuid.optional() }).strict();
```

### קריטריוני קבלה
- [ ] כל נתיב בטבלה קיים, עטוף ב-`route()` עם `RouteId` בצורה `meta.connect_start`, ‏`campaigns.prepare` וכו׳, ומחזיר 404 כשהדגל שלו כבוי (בדיקת חוזה לכל נתיב).
- [ ] `MetaAssetSelectBody` עם מספר וואטסאפ בלי `whatsappConfirmed: true` ← `INVALID_INPUT` עם `issues[0].path = ["whatsappConfirmed"]`.
- [ ] `CampaignDraftPatch` עם `headlineHe` באורך 41 ← `INVALID_INPUT`; ‏`GeoTargetV1` עם `radiusKm: 0` ← `INVALID_INPUT {reason: "radius_out_of_range"}` (המיפוי בנתיב).
- [ ] `CreateSocialPostBody` עם `kind: "trial_reel"` ושתי פלטפורמות ← `INVALID_INPUT`.
- [ ] ‏`lib/api/client.ts` מפענח כל תשובה בסכמה שלה, ו-DTO-ים לא כוללים `token_enc`, ‏`meta_user_id`, ‏`min_budgets` או `raw` (בדיקת טיפוסים).

---

## §8. Webhooks, crons ו-workflows

### 8.1 `GET` ו-`POST /api/webhooks/meta` (`lib/meta/webhooks.ts`)

```ts
export async function GET(req: NextRequest) {                                  // subscription challenge
  const q = req.nextUrl.searchParams;
  const ok = q.get("hub.mode") === "subscribe"
    && safeEqualHex(sha256Hex(q.get("hub.verify_token") ?? ""), sha256Hex(env.META_WEBHOOK_VERIFY_TOKEN));   // constant time
  return ok ? new Response(q.get("hub.challenge") ?? "", { headers: { "content-type": "text/plain" } }) : new Response(null, { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await readRaw(req, 1_000_000);                                  // 413 above 1 MB (part 04 §22.1)
  const sig = (req.headers.get("x-hub-signature-256") ?? "").replace(/^sha256=/, "");
  if (!hmacVerifyAny(secretList(env.META_APP_SECRET), raw, sig)) {
    await recordInvalidSignature("meta", "unknown");                           // webhook_events row, no payload
    return apiError("WEBHOOK_INVALID_SIGNATURE");
  }
  const body = JSON.parse(raw) as MetaWebhookBody;
  for (const entry of body.entry ?? []) for (const ch of entry.changes ?? []) {
    const externalId = externalIdFor(body.object, entry, ch);
    const claim = await claimWebhook({ provider: "meta", externalId, eventType: `${body.object}.${ch.field}`, signatureValid: true, payload: redactMetaPayload(ch) });
    if (claim.state === "duplicate") continue;
    try { await routeChange(body.object, entry, ch); await finishWebhook(claim.id, "processed"); }
    catch (e) { await finishWebhook(claim.id, "failed", String(e)); }
  }
  return new Response(null, { status: 200 });                                 // always fast; heavy work only in flows
}

const externalIdFor = (obj: string, e: MetaEntry, c: MetaChange) =>
  c.field === "leadgen" ? `leadgen:${c.value.leadgen_id}`
  : c.field === "with_issues_ad_objects" ? `issues:${c.value.id}:${e.time}`
  : c.field === "in_process_ad_objects" ? `inproc:${c.value.id}:${c.value.status_name}`
  : `${obj}:${e.id}:${c.field}:${e.time}`;

async function routeChange(obj: string, e: MetaEntry, c: MetaChange) {
  if (obj === "page" && c.field === "leadgen")
    return orchestrator().startFlow("metaLeadIngest", { leadgenId: c.value.leadgen_id, pageId: c.value.page_id }, { idempotencyKey: `lead:${c.value.leadgen_id}` });
  if (obj === "ad_account" && c.field === "with_issues_ad_objects") return refreshObjectStatus(c.value.id);   // notifies on DISAPPROVED / WITH_ISSUES
  if (obj === "ad_account" && c.field === "in_process_ad_objects")
    return orchestrator().resume(`meta-obj:${c.value.id}`, { kind: "meta_object", objectId: c.value.id, statusName: c.value.status_name });
  if (obj === "user" && c.field === "permissions") return markMissingPermission(e.id, c.value);            // [M0-verify] that FLfB delivers it
  return "ignored";
}
```

- `refreshObjectStatus(id)` קורא `GET /{id}?fields=effective_status,configured_status,review_feedback,issues_info` (טוקן המערכת של החשבון), מעדכן את המודעה או הקמפיין, ושולח התראות לפי §10.1.
- `ExternalEvent` (חלק 05 §19.1) מקבל וריאנט חדש: `{ kind: "meta_object"; objectId: string; statusName: string }`.
- `payload` שנשמר ב-`webhook_events` עובר `redactMetaPayload`; ה-`leadgen` מכיל רק מזהים, ולכן אין בו מידע אישי.

### 8.2 `signed_request`: ביטול הרשאה ומחיקת מידע (`lib/meta/signed-request.ts`)

```ts
export function parseSignedRequest(sr: string): { user_id: string; algorithm: "HMAC-SHA256"; issued_at: number } {
  const [sigB64, payloadB64] = sr.split(".", 2);
  if (!sigB64 || !payloadB64) throw new ApiError("WEBHOOK_INVALID_SIGNATURE");
  const expected = secretList(env.META_APP_SECRET).map((s) => createHmac("sha256", s).update(payloadB64).digest());
  const got = Buffer.from(sigB64, "base64url");
  if (!expected.some((e) => e.length === got.length && timingSafeEqual(e, got))) throw new ApiError("WEBHOOK_INVALID_SIGNATURE");
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  if (payload.algorithm !== "HMAC-SHA256" || typeof payload.user_id !== "string") throw new ApiError("WEBHOOK_INVALID_SIGNATURE");
  return payload;
}
// POST /api/webhooks/meta/data-deletion
const code = base32Random(12);                                                  // [A-Z2-7]{12}
await admin.from("meta_data_deletion_requests").insert({ meta_user_id: p.user_id, confirmation_code: code, connection_ids: ids });
await orchestrator().startFlow("metaDataDeletion", { requestId }, { idempotencyKey: `meta-del:${p.user_id}:${p.issued_at}` });
return Response.json({ url: `https://${BRAND.domain}/meta/data-deletion?code=${code}`, confirmation_code: code });
```

**ביטול הרשאה:** כל חיבור עם אותו `meta_user_id` ← `revoked` (`meta_deauthorize`), הטוקנים נמחקים, `audit_logs` ‏`meta.deauthorize`, אנליטיקה `meta_disconnected {by: "meta_deauthorize"}`, ומייל `meta_connection_lost` לבעלים. **מחיקת מידע** (`metaDataDeletion`): מחיקת טוקנים, `meta_user_id = null`, מחיקת המזהים האישיים של אותו משתמש פייסבוק; סטטיסטיקת קמפיינים של העסק והלידים של הלקוח הם המידע של הלקוח, ונשארים עד שבעלי הסביבה מוחקים אותם ⚖️ [Counsel]; ‏`status = completed`, ‏`audit_logs` ‏`meta.data_deletion`.

**מנויים:** ברמת האפליקציה פעם אחת (משימת בעלים 7 ב-§4.2); לכל לקוח בבחירת הנכסים (§3.4).

### 8.3 Crons (Vercel Cron; ‏`lib/cron/{name}.ts`; ‏Bearer `CRON_SECRET`; נעילת Upstash; Sentry Cron Monitor)

| נתיב | לוח (UTC) | נעילה | מה הוא עושה |
|---|---|---|---|
| `/api/cron/meta-insights-hourly` | `20 * * * *` | 50 דק׳ | נתונים למודעות שהיו פעילות ב-48 השעות האחרונות: היום ואתמול, `time_increment=1`, `level=ad`, `use_unified_attribution_setting=true` [M0-verify]; `reach_summary` של הקמפיינים ושל חשבון המודעות (§11.1); ‏`refresh_managed_spend(החודש)`; ‏`enforceSpendCaps()` (80%/100%, §17 סעיף 3); תקרות אישיות של קמפיינים (§10.4) |
| `/api/cron/meta-insights-backfill` | `40 0 * * *` | 50 דק׳ | 28 הימים האחרונים למודעות שהיו פעילות ב-35 הימים האחרונים (מטא מעדכנת נתונים עד 28 יום אחורה); דוחות אסינכרוניים לחשבונות גדולים |
| `/api/cron/meta-review-poll` | `*/15 * * * *` | 12 דק׳ | אובייקטים ב-`PENDING_REVIEW`, ‏`IN_PROCESS`, ‏`WITH_ISSUES`, ‏`PREAPPROVED` וסטטוס עיבוד של סרטונים ← הסטטוסים שלנו (§10.1); ‏`ACTIVE` ראשון ← `meta_campaign_live`; ‏`DISAPPROVED` ← `meta_ad_rejected`; קמפיין שעבר את `end_date` ← `completed` |
| `/api/cron/social-publish` | `*/5 * * * *` | 4 דק׳ | פוסטים `scheduled` עם `scheduled_at <= now() + 10 min` ← `socialPublish(postId)` (מפתח `social:{postId}:{attempt}`); ה-flow ישן עד המשבצת |
| `/api/cron/social-insights` | `50 * * * *` | 40 דק׳ | צילומי מצב של פרסום רגיל אחרי שעה, 6 שעות, 24 שעות, 72 שעות, 7 ימים, ואז פעם ביום עד יום 28 |
| `/api/cron/meta-token-health` | `10 3 * * *` | 30 דק׳ | §3.5 לכל חיבור `active`, וסנכרון נכסים |
| `/api/cron/meta-rules` | `45 * * * *` | 40 דק׳ | הערכת כללים מופעלים (§10.4) |
| `/api/cron/meta-leads-backfill` | `20 1 * * *` | 30 דק׳ | `GET /{form_id}/leads` מה-`meta_created_time` האחרון לטפסים של קמפיינים שהיו פעילים ב-90 יום; לידים חסרים נכנסים עם התראת סיכום אחת (בלי הצפה) |
| `/api/cron/weekly-summary` | `0 6 * * 0` | 50 דק׳ | הסיכום השבועי (§11.5); אידמפוטנטיות `weekly_results:{ws}:{isoWeek}` |

ה-cron העשירי של קמפיינים וטרנדים, `trends-lifecycle`, שייך לחלק 08. ה-cron הקיים `/api/cron/reminders` (חלק 04 §23) מקבל צעד חדש — **תוכנית חודשית:** ביום הראשון של חודש ישראלי, לכל סביבה עם `monthly_plan` דולק שבתוכנית האחרונה שלה `inputs.auto_next_month = true` ← `startFlow("monthlyPlanGenerate", { workspaceId, month }, { idempotencyKey: "plan:{ws}:{month}" })`.

### 8.4 Workflows (‏`lib/workflows/*.ts`, ‏`orchestrator().startFlow(name, input, { idempotencyKey })`)

| Flow | מי מפעיל | צעדים (כל אחד `"use step"`) |
|---|---|---|
| `metaConnectSync(connectionId)` | M2 | רשימת נכסים ← upsert ל-`meta_assets` ← טוקני עמודים ← בדיקת זכאות ל-Trial Reels ← בדיקת מוכנות ← `assets_synced_at` ← `meta_connect_completed` |
| `metaPrepareCampaign(campaignId)` | C6 | ראו הקוד למטה |
| `metaLeadIngest({ leadgenId, pageId })` | webhook | §12.2 |
| `socialPublish(postId)` | cron / S1 "עכשיו" | §13.1–§13.2 |
| `metaDataDeletion(requestId)` | webhook | §8.2 |
| `metaHealthCheck(reportId)` | HC1 | §15.3 |
| `monthlyPlanGenerate({ workspaceId, month })` | `reminders` | §16.3 (אותה פונקציה כמו PL1, בלי זרימה לדפדפן) |

```ts
// lib/workflows/meta-prepare-campaign.ts
import { sleep, createHook } from "workflow";
export async function metaPrepareCampaign(campaignId: string) {
  "use workflow";
  try {
    const gates = await gatesStep(campaignId);            // preflight, adEligibility, moderation.ad.v1, cap, election mode → throws ApiError
    for (const v of gates.variants) {
      const videoId = await uploadVideoStep(campaignId, v.id);          // POST /act_{id}/advideos file_url=signed renders URL (6 h); fallback resumable
      const ready = await waitVideoReady(videoId);                     // hook meta-obj:{videoId} or poll every 30 s, cap 20 min
      if (!ready) throw new PrepareError("video_processing_timeout");
      await thumbnailStep(campaignId, v.id);                           // POST /act_{id}/adimages (poster bytes) → image_hash
    }
    if (gates.goal === "lead_form") await leadFormStep(campaignId);    // POST /{page_id}/leadgen_forms (Page token)
    await campaignStep(campaignId);                                    // PAUSED; reuses meta_campaign_id on retry
    await adSetStep(campaignId);                                       // PAUSED
    for (const v of gates.variants) { await creativeStep(campaignId, v.id); await adStep(campaignId, v.id); }   // PAUSED
    await markReadyStep(campaignId);                                   // status ready, prepared_at, change log "prepare"
  } catch (e) {
    await markErrorStep(campaignId, toPrepareError(e));                // status error, last_error_code; every Meta id already stored
  }
}
async function waitVideoReady(videoId: string) {
  const hook = createHook<{ statusName: string }>({ token: `meta-obj:${videoId}` });
  for (let i = 0; i < 40; i++) {                                       // 40 × 30 s = 20 min
    const r = await Promise.race([hook, sleep("30s").then(() => null)]);
    if (r?.statusName === "SUCCESS" || (await videoStatusStep(videoId)) === "ready") return true;
    if ((await videoStatusStep(videoId)) === "error") return false;
  }
  return false;
}
```

כל מזהה של מטא נשמר **ברגע שהוא חוזר** (`meta_video_id`, ‏`meta_campaign_id`, ‏`meta_adset_id`, ‏`meta_creative_id`, ‏`meta_ad_id`), וניסיון חוזר משתמש בהם במקום ליצור כפילות. שום אובייקט לא נשאר חצי-נוצר בלי רשומה אצלנו.

### קריטריוני קבלה
- [ ] `GET /api/webhooks/meta` עם `hub.verify_token` נכון ← הטקסט של `hub.challenge`; עם טוקן שגוי ← 403.
- [ ] `POST` עם חתימה שגויה ← 401 `WEBHOOK_INVALID_SIGNATURE` ושורת `webhook_events` בלי payload; אותו `leadgen_id` פעמיים ← flow אחד וליד אחד.
- [ ] `signed_request` שנחתם בסוד הישן אחרי רוטציה (`META_APP_SECRET="new,old"`) מתקבל; חתימה שגויה ← 401.
- [ ] callback של מחיקת מידע מחזיר `{url, confirmation_code}` עם קוד בתבנית `^[A-Z2-7]{12}$`, ודף הסטטוס מציג "הושלמה" בסוף ה-flow.
- [ ] `vercel.json` מכיל את תשעת ה-crons של הטבלה (ועם `trends-lifecycle` של חלק 08 — עשרה), וכל אחד מחזיר `{ skipped: "locked" }` בהרצה מקבילה.
- [ ] כשל בהעלאת הסרטון השני ב-`metaPrepareCampaign` משאיר `status = error`; "ניסיון חוזר" לא מעלה שוב את הסרטון הראשון (בדיקת MSW: בקשת `advideos` אחת לסרטון הראשון).

---

## §9. בונה הקמפיינים: כניסות, ארבעה צעדים, ברירות מחדל ומודעות

### 9.1 כניסות וזרימה

נכנסים מדף הפרויקט (**"העלו לקמפיין"**), מקבוצת גרסאות (3 הוקים ← בדיקה מפוצלת), מפוסט רגיל שפורסם (**"קדמו את הסרטון הזה"**), מכרטיס "המנצח" בדשבורד, מכרטיס עונה, מפריט בתוכנית החודשית ומ"שכפול". `/app/campaigns/new?project=&group=&post=&season=&duplicate=&plan_item=` קורא `POST /api/campaigns` (C2), שיוצר `draft` עם ברירות המחדל של §9.8 ומחזיר `{ campaignId }`, ואז `router.replace("/app/campaigns/{id}?step=goal")`. **`/app/campaigns/[campaignId]`** מציג את הבונה כל עוד הסטטוס הוא `draft`, ‏`preparing`, ‏`ready` או `error` (לפני פרסום), ואת דף הקמפיין (§11.2) בכל סטטוס אחר. אירוע `campaign_builder_opened {source}` בכניסה, `campaign_draft_created {goal, split_test, source}` מהשרת.

**עריכת טיוטה:** כל שינוי נשלח ב-C4 עם `ifUnmodifiedSince`, ‏debounce של 800ms לטקסט ומיד לבחירות. C4 מתקבל בסטטוסים שלפני הפרסום (`draft`, ‏`ready`, ‏`error`); עריכה בקמפיין `ready` מחזירה אותו ל-`draft` (צריך "הכנה לפרסום" מחדש, והאובייקטים המושהים במטא מתעדכנים בהכנה הבאה). בכל סטטוס אחר — `EDIT_CONFLICT {reason: "not_draft"}`.

**פריסה:** בדסקטופ — `BuilderStepper` למעלה (מטרה · מי ואיפה · תקציב · סקירה ופרסום), תוכן הצעד ב-7 עמודות ההתחלה, ובעמודות הסוף כרטיס סיכום דביק: תצוגת טלפון של המודעה הראשונה (תמונה ממוזערת, ההוק, הטקסט הראשי), המטרה, האזור, התקציב והערכה חודשית. במובייל — החלטה אחת למסך, הסיכום נפתח ב-`Drawer` מכפתור **"סיכום"**, ו-`WizardFooter` דביק עם **"המשך"** / **"חזרה"**. "הגדרות מתקדמות" מקופלות בכל צעד.

### 9.2 צעד 1 — מטרה

ארבעה כרטיסים (`GoalCard`, ‏`RadioGroup` נגיש), עם שורת הסבר, התווית "מומלץ לעסק שלכם" לפי ה-preset (§9.8), וסיבה כשהכרטיס לא זמין (מתוך `preflight.goals` ומהדגלים). בחירה ב"כניסות לאתר" בלי אתר ובלי דף עסק מפורסם מציגה את הסיבה עם הפעולה **"יצירת דף העסק"** (← `/app/landing-pages`, §14.8).

### 9.3 צעד 2 — מי ואיפה

`AreaPicker` עם שלוש לשוניות: **"סביב העסק"** (שבבי רדיוס 3 · 5 · 10 · 15 · 25 ק״מ, ומותאם אישית 1–80), **"ערים"** (חיפוש M7, עד 10, כל עיר עם רדיוס 17–80 אופציונלי) ו**"כל הארץ"**. המרכז נלקח מחיפוש המיקום של מטא לכתובת או לעיר של העסק [M0-verify שהתוצאות כוללות קואורדינטות]; בלי קואורדינטות "סביב העסק" מושבת עם הסבר. אין אריחי מפה ב-MVP. מתחת: מחוון טווח גילאים (ברירת מחדל מה-preset) ומתג **"תנו למטא למצוא את הקהל המתאים (מומלץ)"** (`advantage_audience`). כשהמתג דולק, מטא מתייחסת לגיל כהמלצה ומקבלת רק מינימום 18–25 ומקסימום 65: בחירה של מינימום מעל 25 או מקסימום מתחת ל-65 פותחת אישור **"הגבלת גיל קשיחה מצמצמת את הקהל"**, ובאישור המתג נכבה.

### 9.4 צעד 3 — תקציב

`BudgetPresetPicker` מ-`app_settings.meta_budget_presets_ils` (₪30 · **₪40 מומלץ** · ₪70 · ₪100) ומותאם אישית, לפחות `max(min_daily_budget_ils, floor)` (‏`floor` = ₪20); הערכה חודשית (יומי × 30) או סכום כולל עד תאריך הסיום; משך: **"עד שמפסיקים"** או תאריך סיום (ברירת מחדל 7 ימים בקמפיין הראשון של הסביבה); **"תקרה חודשית שלי"** (אופציונלי; כשמגיעים אליה הקמפיין מושהה אוטומטית, §10.4); `SpendCapMeter` של התוכנית (בעלים ומנהלים בלבד; לעורך — **"את התקציב מאשרים בעלים או מנהל של הסביבה"**); השורה הכנה על חריגה יומית [M0-verify מול הכלל העדכני של מטא]; ותג הכסף. **בתוכנית החינמית** זה קמפיין הניסיון: אותם שבבים, ושורה **"קמפיין ניסיון אחד, עד {testCap} בסך הכול. מטא תעצור אותו אוטומטית בסכום הזה."** אין הבטחת תוצאות, ואין הערכת "כמה פניות תקבלו" עד שיש לנו נתונים משלנו.

### 9.5 צעד 4 — סקירה ופרסום

1. **המודעות** (`AdVariantCard` לכל גרסה, עד 3): תמונה ממוזערת (נגן בלחיצה), ההוק, טקסט ראשי, כותרת ותיאור מ-`ads.copy.v1` (C5 רץ אוטומטית בכניסה הראשונה לצעד, `glow-ai` ו-**"כותבים טקסטים…"**), כולם ניתנים לעריכה, עם מונה תווים לפי נספח E §12 (טקסט ראשי 125 גלויים מתוך 500, כותרת 40, תיאור 30), ו-**"טקסט חדש · חינם"** לכל מודעה. השרת שולח `campaign_copy_generated {variants}`.
2. **סיכום:** הנעה לפעולה, יעד (המספר בוואטסאפ, האתר, דף העסק או הטופס), אזור, תקציב, תאריכים. בטופס לידים — עורך קצר של השאלות (שם וטלפון קבועים, מייל ועיר אופציונליים, עד 3 שאלות משלכם) ותצוגה של מסך התודה.
3. **בדיקת מדיניות** (`PolicyCheckPanel`): רצה ב"הכנה לפרסום" (C6). בעיה חוסמת מוצגת ליד השדה עם `fix_he` והציטוט; אזהרה מוצגת בצהוב עם **"אפשר להמשיך"**.
4. **הכנה ותצוגות:** הכפתור הראשי **"הכנה לפרסום"** (C6, בעלים ומנהלים) ← `preparing` עם רשימת שלבים חיה (**"מעלים את הסרטונים למטא"** · **"מטא מעבדת את הסרטונים"** · **"יוצרים את הקמפיין, מושהה"**) ← `ready` ← `MetaPreviewFrame` בלשוניות (פיד בפייסבוק · פיד באינסטגרם · רילס באינסטגרם · סטורי · רילס בפייסבוק).
5. **אישור:** תיבה **"הבנתי שהתקציב ייגבה על ידי מטא מאמצעי התשלום שבחשבון המודעות"**, ואז הכפתור **"פרסום"** (C8). אחרי הלחיצה ← דף הקמפיין עם `CampaignStatusTimeline` (**"נוצר · נשלח לבדיקה של מטא · אושר · פעיל"**), בלי זמן מובטח. C8 מריץ שוב את השערים האחרונים (חיבור, מוכנות, תקרה, מצב בחירות, זכאות), מעביר ל-`ACTIVE` את המודעות, את קבוצת המודעות ואת הקמפיין [M0-verify סדר], וכותב `publish` ביומן, ‏`audit_logs` ‏`meta.campaign_publish` ו-`campaign_published {goal, budget_bucket, variants, area_mode, season}`.

**עורך** יכול לבנות טיוטה, לבקש טקסטים ולראות תצוגות; "הכנה לפרסום" ו"פרסום" מושבתים עם ה-Tooltip של חלק 03 §1.2, ולידם **"העתקת קישור לטיוטה"** כדי לשלוח לבעלים.

**תצוגות מקדימות בבטחה:** C7 מחזיר לכל מיקום את ה-HTML של מטא; השרת שולף ממנו רק את `src` של ה-iframe, מוודא שהמארח הוא `www.facebook.com`, ומחזיר `{ variantId, placement, src }`. הלקוח מציג `<iframe src sandbox="allow-scripts allow-same-origin allow-popups" referrerpolicy="no-referrer" loading="lazy">` — לעולם לא `dangerouslySetInnerHTML`. ‏CSP `frame-src https://www.facebook.com` רק בנתיב הבונה (חלק 06 §15.3).

### 9.6 הגדרות מתקדמות (מקופלות)

**"רק רילס וסטוריז"** (`publisher_platforms` ומיקומים מפורשים [M0-verify איות הערכים]) · **"לידים איכותיים יותר"** (`QUALITY_LEAD`, עם ההסבר "מטא תוסיף שלב אישור בטופס. יהיו פחות לידים, אבל רציניים יותר.") · **"תנו למטא לשפר את המודעה אוטומטית"** (`creative_features_optin`, כבוי; ההסבר: "מטא עשויה לחתוך, להאריך או לשנות את הטקסט. זה עלול לפגוע בכתוביות העבריות.") · הנעה לפעולה מותאמת · פרמטרי UTM. כאן בלבד מותר להזכיר Advantage+ עם הסבר בשורה.

### 9.7 קופי הבונה

```json
{
  "app": {
    "campaigns": {
      "builder": {
        "steps": { "goal": "מטרה", "audience": "מי ואיפה", "budget": "תקציב", "review": "סקירה ופרסום" },
        "summary": "סיכום",
        "goal": {
          "title": "{g, select, female {מה את רוצה שיקרה?} male {מה אתה רוצה שיקרה?} other {מה אתם רוצים שיקרה?}}",
          "whatsapp_messages": { "label": "הודעות בוואטסאפ", "hint": "אנשים שרואים את המודעה שולחים לכם הודעה בלחיצה" },
          "lead_form": { "label": "לידים בטופס", "hint": "טופס קצר בתוך פייסבוק ואינסטגרם, והפרטים מגיעים אליכם מיד" },
          "website_traffic": { "label": "כניסות לאתר", "hint": "שולחים אנשים לאתר שלכם או לדף העסק" },
          "local_awareness": { "label": "חשיפה לאזור", "hint": "כמה שיותר אנשים באזור שלכם רואים את הסרטון" },
          "recommended": "מומלץ לעסק שלכם",
          "unavailable": {
            "whatsapp_not_confirmed": "צריך לחבר מספר וואטסאפ עסקי לעמוד",
            "no_website": "צריך כתובת אתר או דף עסק מפורסם",
            "flag_off": "לא זמין כרגע",
            "lead_setup": "צריך להשלים את ההגדרות של טופס הלידים"
          },
          "create_landing": "יצירת דף העסק"
        },
        "audience": {
          "tabs": { "radius": "סביב העסק", "cities": "ערים", "country": "כל הארץ" },
          "radius_km": "{n} ק״מ",
          "custom_radius": "רדיוס אחר",
          "no_coordinates": "לא מצאנו את המיקום המדויק של העסק. אפשר לבחור ערים או את כל הארץ.",
          "cities_search": "חיפוש עיר",
          "cities_max": "אפשר לבחור עד 10 ערים",
          "age": "גילאים",
          "age_range": "{min}–{max}",
          "advantage": "תנו למטא למצוא את הקהל המתאים (מומלץ)",
          "advantage_hint": "מטא תראה את המודעה גם לאנשים מחוץ לטווח הגילאים, כשהיא מזהה שהם מתאימים. הגיל שבחרתם נשאר המלצה.",
          "hard_age_title": "הגבלת גיל קשיחה מצמצמת את הקהל",
          "hard_age_body": "כדי להגביל גילאים בדיוק, המתג 'תנו למטא למצוא את הקהל המתאים' ייכבה. אפשר להחזיר אותו בכל רגע.",
          "hard_age_confirm": "הגבלה קשיחה",
          "hard_age_cancel": "השארת ההמלצה"
        },
        "budget": {
          "title": "כמה להוציא ביום?",
          "recommended": "מומלץ",
          "custom": "סכום אחר",
          "min": "התקציב היומי המינימלי בחשבון הזה הוא {min}",
          "monthly_estimate": "בערך {monthly} לחודש",
          "total_estimate": "עד {endDate}: בערך {total} בסך הכול",
          "duration": "כמה זמן?",
          "until_stopped": "עד שמפסיקים",
          "until_date": "עד תאריך",
          "user_cap": "תקרה חודשית שלי",
          "user_cap_hint": "כשהקמפיין מגיע לסכום הזה בחודש, נשהה אותו אוטומטית ונעדכן אתכם.",
          "daily_note": "מטא יכולה להוציא ביום מסוים קצת יותר מהתקציב היומי, אבל לא יותר מהממוצע השבועי.",
          "money_badge": "התקציב משולם ישירות למטא מהכרטיס שלכם. אנחנו לא לוקחים אחוזים.",
          "editor_note": "את התקציב מאשרים בעלים או מנהל של הסביבה",
          "free_test": "קמפיין ניסיון אחד, עד {testCap} בסך הכול. מטא תעצור אותו אוטומטית בסכום הזה."
        },
        "review": {
          "writing": "כותבים טקסטים…",
          "ad_label": "מודעה {key}",
          "primary_text": "טקסט ראשי",
          "headline": "כותרת",
          "description": "תיאור",
          "counter": "{used}/{max}",
          "visible_hint": "בערך {n} התווים הראשונים מופיעים לפני 'עוד'",
          "new_copy": "טקסט חדש · חינם",
          "cta": "כפתור",
          "destination": "לאן זה מוביל",
          "lead_form_title": "הטופס",
          "lead_form_fixed": "שם מלא וטלפון — תמיד בטופס",
          "lead_form_add": "הוספת שאלה",
          "policy_title": "בדיקה לפני מטא",
          "policy_ok": "לא מצאנו בעיה. מטא תבדוק בעצמה לפני שהמודעה רצה.",
          "policy_warn_continue": "אפשר להמשיך",
          "prepare": "הכנה לפרסום",
          "preparing_steps": ["מעלים את הסרטונים למטא", "מטא מעבדת את הסרטונים", "יוצרים את הקמפיין, מושהה"],
          "previews": "ככה זה ייראה",
          "placements": { "MOBILE_FEED_STANDARD": "פיד בפייסבוק", "INSTAGRAM_STANDARD": "פיד באינסטגרם", "INSTAGRAM_REELS": "רילס באינסטגרם", "INSTAGRAM_STORY": "סטורי", "FACEBOOK_REELS_MOBILE": "רילס בפייסבוק" },
          "confirm": "הבנתי שהתקציב ייגבה על ידי מטא מאמצעי התשלום שבחשבון המודעות",
          "publish": "פרסום",
          "after_publish": "נשלח לבדיקה של מטא. נעדכן אתכם כשהקמפיין יאושר.",
          "copy_link": "העתקת קישור לטיוטה",
          "prepare_failed": "ההכנה לא הושלמה: {reasonHe}. שום דבר לא פורסם, ואפשר לנסות שוב.",
          "retry": "ניסיון חוזר"
        },
        "advanced": {
          "title": "הגדרות מתקדמות",
          "reels_only": "רק רילס וסטוריז",
          "quality_leads": "לידים איכותיים יותר",
          "quality_leads_hint": "מטא תוסיף שלב אישור בטופס. יהיו פחות לידים, אבל רציניים יותר.",
          "creative_features": "תנו למטא לשפר את המודעה אוטומטית",
          "creative_features_hint": "מטא עשויה לחתוך, להאריך או לשנות את הטקסט. זה עלול לפגוע בכתוביות העבריות.",
          "advantage_explain": "ההגדרות האוטומטיות של מטא (Advantage+) בוחרות קהל, מיקומים וחלוקת תקציב. אצלנו הן דולקות כברירת מחדל.",
          "utm": "פרמטרי מעקב לאתר (UTM)"
        }
      }
    }
  }
}
```

### 9.8 ברירות מחדל ו-presets (`lib/meta/presets.ts`)

```ts
export type AdPreset = { goal: AdGoal; geoMode: "radius" | "cities" | "country"; radiusKm?: number; ageMin: number; ageMax: number;
  dailyBudgetIls: number; cta: MetaCtaType };
const SERVICE: AdPreset = { goal: "whatsapp_messages", geoMode: "radius", radiusKm: 10, ageMin: 18, ageMax: 65, dailyBudgetIls: 40, cta: "WHATSAPP_MESSAGE" };
const REGULATED: AdPreset = { goal: "lead_form", geoMode: "radius", radiusKm: 15, ageMin: 25, ageMax: 65, dailyBudgetIls: 50, cta: "GET_QUOTE" };
export const NICHE_AD_PRESETS: Record<string, AdPreset> = {       // keyed by niche slug, falls back to the category default
  "barbers-salons": { ...SERVICE, radiusKm: 5, ageMax: 55 },
  restaurants: { ...SERVICE, radiusKm: 5 },
  dentists: { ...REGULATED, cta: "BOOK_NOW" }, "aesthetic-clinics": { ...REGULATED, cta: "BOOK_NOW" },
  lawyers: REGULATED, "insurance-agents": REGULATED, "mortgage-advisors": REGULATED,
  "real-estate": { ...REGULATED, geoMode: "cities", radiusKm: undefined },
  ecommerce: { goal: "website_traffic", geoMode: "country", ageMin: 18, ageMax: 65, dailyBudgetIls: 40, cta: "SHOP_NOW" },
  "renovation-contractors": { ...SERVICE, radiusKm: 25 }, "home-services": { ...SERVICE, radiusKm: 25 }, "movers-storage": { ...SERVICE, radiusKm: 25 },
};
export const SEASON_AD_PRESETS: Record<string, { copyAngleEn: string; defaultDays: number; trendSlugs: string[] }> = {
  "rosh-hashana": { copyAngleEn: "new-year fresh start, holiday prep", defaultDays: 14, trendSlugs: ["day-in-the-life", "price-reveal"] },
  sukkot: { copyAngleEn: "family time, holiday activities", defaultDays: 7, trendSlugs: ["pov-deadpan"] },
  hanukkah: { copyAngleEn: "gifts and treats, eight days", defaultDays: 10, trendSlugs: ["price-reveal", "asmr-process"] },
  "black-friday": { copyAngleEn: "true discount only, clear end date", defaultDays: 5, trendSlugs: ["price-reveal"] },
  "pre-passover": { copyAngleEn: "cleaning, renovation and prep before the holiday", defaultDays: 21, trendSlugs: ["before-after-snap", "quick-how-to"] },
  passover: { copyAngleEn: "holiday hosting and outings", defaultDays: 7, trendSlugs: ["day-in-the-life"] },
  summer: { copyAngleEn: "summer plans and heat", defaultDays: 30, trendSlugs: ["pov-deadpan", "quick-how-to"] },
  "back-to-school": { copyAngleEn: "routine is back, getting organised", defaultDays: 14, trendSlugs: ["myth-vs-fact"] },
  "tu-beav": { copyAngleEn: "couples, gifts, date night", defaultDays: 7, trendSlugs: ["pov-deadpan"] },
};
```

- התאריך המוצע להתחלה נגזר מ-`seasons.starts_on − promo_lead_days`, והסיום מ-`ends_on`. ביום שקט (`holocaust-memorial-day`, ‏`memorial-day`) אין הצעות עונתיות; התחלה מתוזמנת ליום שקט מציגה אזהרה; וקמפיינים שרצים מציגים את הבאנר **"היום יום שקט. כדאי לשקול להשהות את הקמפיין"** (לעולם לא השהיה אוטומטית). בתקופת בחירות (`app_settings.election_mode`) תוכן פוליטי נחסם ב-`ELECTION_POLICY_BLOCKED`.

### 9.9 מיפוי מטרה ← מטא (`lib/meta/campaigns/build.ts`, ‏ODAX, ‏v26.0)

| מטרה | `objective` | `destination_type` | `optimization_goal` | `promoted_object` | CTA (ברירת מחדל · מותרים) | "פנייה" בדוח |
|---|---|---|---|---|---|---|
| `whatsapp_messages` | `OUTCOME_ENGAGEMENT` | `WHATSAPP` | `CONVERSATIONS` [M0-verify מול `IMPRESSIONS` בדוגמה של מטא] | `{ page_id, whatsapp_phone_number? }` | `WHATSAPP_MESSAGE` עם `value.app_destination = "WHATSAPP"` [M0-verify] | `onsite_conversion.messaging_conversation_started_7d` ← "פניות בוואטסאפ" |
| `lead_form` | `OUTCOME_LEADS` | `ON_AD` | `LEAD_GENERATION` (או `QUALITY_LEAD`) | `{ page_id }` | `SIGN_UP` · `GET_QUOTE` · `BOOK_NOW` · `LEARN_MORE` עם `value.lead_gen_form_id` [M0-verify] | `lead` / `onsite_conversion.lead_grouped` [M0-verify] ← "לידים" |
| `website_traffic` | `OUTCOME_TRAFFIC` | `WEBSITE` | `LANDING_PAGE_VIEWS` (חלופה `LINK_CLICKS` [M0-verify דרישת פיקסל]) | — | `LEARN_MORE` · `BOOK_NOW` · `SHOP_NOW` · `CONTACT_US` | `landing_page_view` ← "כניסות לאתר" |
| `local_awareness` | `OUTCOME_AWARENESS` | — | `REACH` (מתקדם: `THRUPLAY`) | — | `LEARN_MORE` · `CALL_NOW` (עם טלפון) · `WHATSAPP_MESSAGE` [M0-verify] | `video_3s_plays` ← "צפו לפחות 3 שניות" |

```ts
export function buildCampaignParams(c: CampaignRow, offset = 100) {
  return { name: c.name, objective: GOAL_MAP[c.goal].objective, status: "PAUSED", special_ad_categories: [], buying_type: "AUCTION",
    daily_budget: ilsToMetaMinor(c.daily_budget_ils, offset), bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    ...(c.is_free_test ? { spend_cap: ilsToMetaMinor(testCapIls, offset) } : {}) };           // [M0-verify spend_cap minimum]
}
export function buildAdSetParams(c: CampaignRow, ids: { campaignId: string; pageId: string; whatsapp?: string }) {
  return { name: `${c.name} · קהל`, campaign_id: ids.campaignId, status: "PAUSED", billing_event: "IMPRESSIONS",
    optimization_goal: c.goal === "lead_form" && c.quality_leads ? "QUALITY_LEAD" : GOAL_MAP[c.goal].optimization,
    ...(GOAL_MAP[c.goal].destination ? { destination_type: GOAL_MAP[c.goal].destination } : {}),
    promoted_object: GOAL_MAP[c.goal].promoted(ids),
    targeting: { geo_locations: geoToMeta(c.geo), age_min: c.age_min, age_max: c.age_max,
      targeting_automation: { advantage_audience: c.advantage_audience ? 1 : 0 },                      // always sent
      ...(c.placements === "reels_stories" ? { publisher_platforms: ["facebook", "instagram"], facebook_positions: ["facebook_reels", "story"],
          instagram_positions: ["reels", "story"] } : {}) },                                             // never Explore
    start_time: c.start_at ?? undefined, end_time: c.end_date ? endOfDayIL(c.end_date) : undefined };
}
// lib/meta/money.ts — the only conversion point; MetaMinor exists only inside lib/meta/**
export type MetaMinor = number & { readonly __brand: "MetaMinor" };
export const ilsToMetaMinor = (ils: number, offset = 100) => Math.round(ils * offset) as MetaMinor;
export const metaMinorToIls = (v: string | number, offset = 100) => Number(v) / offset;
```

תמיד ביצירה: `status: "PAUSED"`; ‏`special_ad_categories: []` (טרגוט בישראל לא דורש קטגוריה מיוחדת [M0-verify]); תקציב Advantage+ ברמת הקמפיין; קמפיין הניסיון מקבל גם `spend_cap` של ₪300; בלי החרגות טרגוט מפורט; שעות ההתחלה והסיום לפי שעון ישראל. ‏`advantage_state_info` מהתשובה נשמר ב-`issues_info.advantage` למסך האדמין. UTM לאתר: `utm_source=meta&utm_medium=paid_social&utm_campaign=kdm_{campaignShortId}&utm_content={hookKey}`.

### 9.10 מודעות וקריאייטיב

- **רינדורים:** ‏9:16 חובה (רילס, סטוריז, ופיד כשאין 1:1); ‏1:1 אופציונלי לפיד, דרך התאמת נכסים לפי מיקום (`asset_feed_spec` + `asset_customization_rules`) [M0-verify]. בלי 1:1 הבונה מציע **"הוספת פורמט 1:1 · {n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}"** (`render.extra_format`) או ממשיך עם 9:16. ‏4:5 לא נכנס עד שיהיה ערך כזה ב-`aspect_ratio`.
- **בדיקת קובץ** (`assertMetaVideoSpec`, ‏`@remotion/media-parser`): ‏MP4, ‏H.264, ‏AAC 48 kHz עד 128 kbps, ‏`+faststart`, עד 25 Mbps, ‏3–90 שניות, 1080×1920 (פרופיל `meta_reels`, חלק 05 §20.11). כשל ← `AD_NOT_ELIGIBLE {reason: "video_spec"}` עם **"הרכבה מחדש לפרסום · {n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}"**.
- `object_story_spec = { page_id, instagram_user_id, video_data: { video_id, image_hash, message, title, call_to_action } }`; ‏`degrees_of_freedom_spec.creative_features_spec` מגדיר במפורש כל תכונה: `video_auto_crop`, ‏`video_uncrop`, ‏`video_filter`, ‏`text_optimizations`, ‏`image_animation` ב-`OPT_OUT`, ו-`inline_comment` ב-`OPT_IN`; המתג המתקדם הופך את הקבוצה הראשונה. לעולם לא `instagram_actor_id`.
- **שם המודעה:** `KDM|{templateSlug או "-"}|{hookKey}|{position}|{yyyymmdd}`.
- **טקסט:** `ads.copy.v1` (§18.1). המשתמש עורך הכול; כל עריכה עוברת `moderation.ad.v1` ב-C6.

### 9.11 בדיקת שלושה הוקים והמנצח

- קמפיין אחד, קבוצת מודעות אחת, עד שלוש מודעות; כל מודעה היא פרויקט אחד מקבוצת גרסאות (חלק 05 §18.9) — סצנת ההוק שונה בתמונה ובקריינות, לא רק בכיתוב, כי מטא מתייחסת למודעות כמעט זהות כאחת. תבניות טרנד מספקות שלוש גרסאות הוק עם רעיון פיתיון שונה (חלק 08). שער התוכנית `meta_split_test`; בחינם (`hook_variants_max = 1`) יש מודעה אחת.
- **המנצח:** אחרי `app_settings.meta_min_sample` (כל מודעה ≥ 1,000 חשיפות, ≥ 3 ימים, וסך הכול ≥ 5 פניות במטרות של פניות) — הדירוג לפי עלות לפנייה, ובשוויון לפי "עצרו לצפות". `is_winner` נקבע; לפני כן כתוב **"עדיין מוקדם לקבוע מנצח"**.

### קריטריוני קבלה
- [ ] עם ה-mock: פרויקט עם 3 הוקים ← "העלו לקמפיין" ← ארבעת הצעדים ← "הכנה לפרסום" ← תצוגות מקדימות ← סימון ← "פרסום" ← "בבדיקה של מטא", וכל האובייקטים נוצרו `PAUSED` לפני ה-`ACTIVE` (בדיקת MSW על סדר הבקשות).
- [ ] מינימום מעל 25 עם המתג דולק פותח את דיאלוג "הגבלת גיל קשיחה" ומכבה את המתג רק באישור.
- [ ] תקציב מתחת ל-`max(min_daily_budget_ils, 20)` ← `INVALID_INPUT {reason: "below_min_budget"}` והשדה מסומן.
- [ ] `ilsToMetaMinor(49.99) === 4999`, ‏`metaMinorToIls("5000") === 50`, וה-lint נכשל על `MetaMinor` מחוץ ל-`lib/meta/**`.
- [ ] תצוגה מקדימה שה-`src` שלה לא ב-`www.facebook.com` לא מוצגת; אין `dangerouslySetInnerHTML` בבונה.
- [ ] בחינם הבונה מציג מודעה אחת, את שורת קמפיין הניסיון, ו-`spend_cap` של ₪300 נשלח למטא.

---

## §10. סטטוסים, הסברי דחייה, עריכות, כללים, קידום ושער הבטיחות

### 10.1 סטטוסים (`lib/meta/campaigns/status.ts`) ו-`StatusBadge kind="campaign" | "ad"`

| `effective_status` במטא | שלנו | תווית (גוון) |
|---|---|---|
| (מקומי) | `draft` / `preparing` / `ready` | טיוטה (neutral) / בהכנה (progress) / מוכן לפרסום (success) |
| `PENDING_REVIEW`, ‏`IN_PROCESS`, ‏`PREAPPROVED` | `in_review` | בבדיקה של מטא (waiting) |
| `ACTIVE` | `active` | פעיל (success) |
| `PAUSED`, ‏`CAMPAIGN_PAUSED`, ‏`ADSET_PAUSED` | `paused` | מושהה (neutral) |
| `WITH_ISSUES`, ‏`PENDING_BILLING_INFO` | `with_issues` | דורש טיפול (warning) |
| `DISAPPROVED` | `rejected` | נדחה (danger) |
| עבר תאריך הסיום / הסתיים | `completed` | הסתיים (neutral) |
| כשל בהכנה | `error` | שגיאה (danger) |
| `ARCHIVED`, ‏`DELETED` | `archived` | בארכיון (neutral) |

סטטוס הקמפיין = הסטטוס "הטוב" ביותר של המודעות (מודעה פעילה אחת ← הקמפיין פעיל). ‏`ACTIVE` ראשון ← `first_active_at`, התראה ומייל `meta_campaign_live`, אנליטיקה `campaign_review_result {result: "active"}`. ‏`DISAPPROVED` ← מייל `meta_ad_rejected` לכל מודעה (מפתח עם hash של הסיבה), `campaign_review_result {result: "rejected", reason_code}`. ‏`PENDING_BILLING_INFO` או בעיית `account_status` ← **"חסר אמצעי תשלום בחשבון המודעות"** עם קישור להגדרות התשלום של מטא [M0-verify URL].

### 10.2 הסברי דחייה בעברית (`lib/meta/review-feedback-he.ts`)

```ts
type FixAction = "edit_copy" | "new_video" | "contact_support" | "none";
export const REVIEW_FEEDBACK_HE: Record<string, { titleHe: string; fixHe: string; action: FixAction }> = {
  personal_attributes: { titleHe: "הטקסט פונה למאפיין אישי של הצופה", fixHe: "מטא לא מאשרת משפטים כמו 'סובלים מ…?'. כדאי לכתוב על השירות במקום על הצופה.", action: "edit_copy" },
  misleading_claims:   { titleHe: "טענה שנראית מוגזמת או מטעה", fixHe: "כדאי להסיר הבטחות ומספרים שאי אפשר להוכיח, ולכתוב מה בדיוק מקבלים.", action: "edit_copy" },
  before_after:        { titleHe: "תמונות 'לפני ואחרי' בנושא גוף או בריאות", fixHe: "בנושאי גוף ובריאות מטא מגבילה לפני ואחרי. אפשר להשתמש בסרטון שמראה את התהליך.", action: "new_video" },
  health_body_image:   { titleHe: "תוכן שעלול לפגוע בדימוי גוף", fixHe: "כדאי להתמקד בחוויה ובשירות, בלי התייחסות למראה או למשקל של הצופה.", action: "edit_copy" },
  landing_page:        { titleHe: "הדף שהמודעה מובילה אליו לא עובד", fixHe: "צריך לוודא שהקישור נפתח, מתאים למה שכתוב במודעה ולא מבקש התקנה.", action: "edit_copy" },
  business_practices:  { titleHe: "מטא חוששת מנוהל עסקי לא תקין", fixHe: "כדאי לבדוק שהמחיר, התנאים ופרטי העסק ברורים. אם זו טעות, אפשר לערער במנהל המודעות של מטא.", action: "contact_support" },
  prohibited_content:  { titleHe: "מוצר או שירות שמטא אוסרת או מגבילה", fixHe: "חלק מהמוצרים לא ניתנים לפרסום במטא, או רק בתנאים. אפשר לבדוק את מדיניות הפרסום של מטא.", action: "contact_support" },
  deceptive_ui:        { titleHe: "המודעה מחקה התראה או כפתור של מערכת", fixHe: "פורמט כזה מתאים רק לפרסום רגיל. אפשר ליצור סרטון חדש מאותו טרנד בלי ההתראה המזויפת.", action: "new_video" },
  political:           { titleHe: "תוכן פוליטי או נושא חברתי שנוי במחלוקת", fixHe: "מודעות כאלה דורשות אישור מיוחד של המפרסם במטא, ואנחנו לא מפרסמים אותן.", action: "none" },
  intellectual_property: { titleHe: "מוזיקה או תוכן מוגן בזכויות יוצרים", fixHe: "אפשר להרכיב מחדש עם מוזיקה מקורית שמותרת לפרסום.", action: "new_video" },
};
export const reviewFallbackHe = (reason: string) => `מטא לא אישרה את המודעה. הסיבה שמטא נתנה: ${reason}`;
```

שמות המפתחות ממופים מ-`review_feedback` (שם השדה [M0-verify]: `review_feedback` או `ad_review_feedback`) לפי מילות מפתח בתוך הסיבה; בבטא אוספים סיבות אמיתיות ומרחיבים. כפתורי הפעולה בכרטיס הדחייה: `edit_copy` ← **"שכפול עם טקסט חדש"** · `new_video` ← **"סרטון חדש מאותו פרויקט"** · `contact_support` ← **"איך מערערים"** (מדריך קצר בעזרה).

### 10.3 עריכות בקמפיין חי

| פעולה | מי | מה קורה במטא | יומן / ביקורת / אנליטיקה |
|---|---|---|---|
| **"השהיה"** (C9) | editor+ | `status=PAUSED` ברמת הקמפיין | `pause` · `meta.campaign_pause` · `campaign_paused {by:"user"}` |
| **"המשך"** (C10) | owner/admin | `status=ACTIVE`; נבדקים חיבור, מוכנות, תקרת התוכנית ו-`meta_active_campaigns` | `resume` · `meta.campaign_resume` · `campaign_resumed` |
| **תקציב** (C11) | owner/admin | `daily_budget` ברמת הקמפיין, עם השומר של §5; הוספה נחסמת אחרי תקופת החסד של התקרה | `budget_change` · `meta.campaign_budget` · `campaign_budget_changed {direction, by:"user"}` |
| **"סיום"** (C12) | owner/admin | `PAUSED` במטא + `completed` אצלנו (לעולם לא `ARCHIVED`, שאי אפשר לבטל) | `end` · `meta.campaign_end` · `campaign_ended` |
| **"שכפול"** (C13) | editor+ | טיוטה חדשה עם אותן הגדרות, עם הוקים חדשים כשמבקשים | `duplicate` |

עריכת קריאייטיב או טקסט בקמפיין חי לא מוצעת ב-MVP (היא מחזירה את המודעה לבדיקה); במקומה **"שכפול עם טקסט חדש"**. שינוי תקציב מציג את ההערה **"שינוי גדול מאפס חלק מהלמידה של מטא. מומלץ לשנות עד 20% בכל פעם"** ואת **"{n, plural, one {נשאר שינוי תקציב אחד} two {נשארו שני שינויי תקציב} other {נשארו # שינויי תקציב}} בשעה הקרובה"** (`budgetChangesLeft`).

### 10.4 כללים אוטומטיים (דגל `meta_auto_rules`; ‏`plans.limits.meta_auto_rules` = כמה מותר להפעיל בכל סביבה)

| `kind` | היקף | פרמטרים (ברירת מחדל) | פעולה | מעקות |
|---|---|---|---|---|
| `pause_expensive_ad` | קמפיין | `{ maxCostPerResultIls: null, minSpendIls: 60, days: 3 }` (‏null = פי 2 מהחציון של הקמפיין) | משהה את המודעה | לעולם לא את המודעה הפעילה האחרונה |
| `boost_winner` | קמפיין | `{ raisePct: 20, minResults: 5, days: 3 }` | ‏+20% לתקציב כשעלות הפנייה של המנצח ≤ 0.8 × החציון | פעם ב-72 שעות לכל היותר, אף פעם לא מעל תקרת התוכנית או התקרה האישית, נספר בשומר התקציב |
| `alert_no_results` | קמפיין | `{ hours: 48, minSpendIls: 40 }` | התראה בלבד | — |
| `alert_fatigue` | קמפיין | `{ frequency7d: 3.5, ctrDropPct: 30 }` | התראה **"הגיע הזמן לסרטון חדש"** + **"גרסה חדשה מאותו טרנד"** | — |
| `monthly_cap_stop` | **סביבה** (`campaign_id = null`) | `{ capIls: null, resumeNextMonth: false }` (‏`capIls` חובה בהפעלה) | משהה את כל הקמפיינים כשההוצאה החודשית של הסביבה מגיעה לתקרה שהמשתמש קבע | רק תקרה שהמשתמש קבע, אף פעם לא תקרת התוכנית |

- הערכה כל שעה (`meta-rules`) על הנתונים המסונכרנים. כל פעולה ← `ad_change_log` (`source = rule`, ‏`rule_pause` / ‏`rule_budget` / ‏`user_cap_pause`), התראה באפליקציה (סוג `system`, קישור לקמפיין) ושורה בסיכום השבועי; ‏`auto_rule_fired {kind}`. הפעלה וכיבוי — `auto_rule_toggled {kind, on}` ו-`audit_logs` ‏`meta.rule_toggle`.
- **התקרה האישית של קמפיין** (`user_monthly_cap_ils`, צעד 3) אינה כלל ולא נספרת במגבלה: הסנכרון השעתי משהה את הקמפיין כשההוצאה שלו בחודש מגיעה אליה (`user_cap_pause`, ‏`source = system`, ‏`campaign_paused {by: "user_cap"}`), ושולח התראה ומייל `spend_cap_warning` בווריאנט `user_cap` (§20).
- C18 מחזיר את כללי הקמפיין ואת `monthly_cap_stop` של הסביבה (`scope: "workspace"`); ‏PUT שומר כל כלל לפי ההיקף שלו. מעבר למגבלה ← `PLAN_LIMIT {limit: "meta_auto_rules", max, used}`.

### 10.5 קידום המנצח (C14) וקידום פוסט רגיל (S6 + C2)

- **"הגבירו את המנצח"** (גם כקישור עמוק: העוגן `#winner` בדף הקמפיין, מהדשבורד ומהמיילים): משהה את שאר המודעות, ומעלה את התקציב ב-10% או ב-20% אם בחרו (נספר בשומר), כותב `boost_winner`, ‏`campaign_winner_boosted {by: "user"}`, ומציע **"צרו עוד 3 גרסאות מהמנצח"** (קבוצת גרסאות חדשה מאותה תבנית ומשפחת הוק). לפני המדגם ← `INVALID_INPUT {reason: "no_winner_yet"}`.
- **"קדמו את הסרטון הזה"** (פוסט שפורסם דרכנו): באינסטגרם `GET /{ig_media_id}?fields=boost_eligibility_info,boost_ads_list`; לא זכאי ← סיבה בעברית (למשל **"המוזיקה בסרטון לא מאושרת לקידום"**); זכאי ← הבונה ממולא מראש, `is_boost = true`, מודעה אחת עם `source_instagram_media_id` + `instagram_user_id` (+ CTA [M0-verify לקריאייטיב מפוסט קיים]). בפייסבוק `object_story_id = {page_id}_{post_id}` (‏`post_id` מ-`GET /{video_id}?fields=post_id` [M0-verify]). ‏`boost_eligibility_checked {eligible}`. רילס שפורסמו דרכנו נושאים רק מוזיקה מורשית, ולכן בדרך כלל זכאים.

### 10.6 שער הבטיחות למודעות (`lib/meta/eligibility.ts → adEligibility(project, variants)`)

חוסם ב-`AD_NOT_ELIGIBLE {reason}`, לפי הסדר (הקופי ב-`errors.AD_NOT_ELIGIBLE.byReason.*`, חלק 03 §1.4):

1. `organic_only_template` — לתבנית הטרנד `ad_safety = 'organic_only'` ← **"הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים."**
2. `deceptive_ui` — שכבה מסוג `fake_ui` בסצנה כלשהי, בלי קשר לתבנית.
3. `missing_consent` — תבנית `needs_consent` (או ב-`extra_gates`), או צילום מודרך עם אנשים, בלי ההצהרה `people_on_camera_consent`.
4. `needs_ai_label` — תבנית `needs_ai_label` ו-`projects.ai_label = false` (פרויקט מתבנית כזו נוצר עם `ai_label = true`, חלק 08 §19, ולכן זה קורה רק כשהתווית כובתה בעורך) ← הבונה מציע **"הוספת תווית 'נוצר באמצעות AI' והרכבה מחדש"**.
5. `music_not_licensed` — מוזיקה שהמשתמש העלה בלי הצהרת רישיון.
6. `political` / `special_category` — `moderation.ad.v1` מזהה תוכן פוליטי או חברתי (תמיד חסום, ובתקופת בחירות גם `ELECTION_POLICY_BLOCKED`), או תוכן שמטא עשויה לסווג כקטגוריה מיוחדת (דיור, תעסוקה, אשראי — בישראל לא נדרשת היום קטגוריה [M0-verify]); הזיהוי מציג אזהרה וחוסם רק תוכן פוליטי.
7. `video_spec`, ‏`no_render_9x16`.

השער רץ ב-C2 (כדי שהממשק יציג מיד את המצב המושבת), ב-C6 וב-C8. בדף הפרויקט פרויקט שאינו זכאי מציג את "העלו לקמפיין" מושבת עם הסיבה.

### קריטריוני קבלה
- [ ] `simulateReview(adId, "reject")` עם סיבה שמכילה "personal attributes" ← כרטיס "הטקסט פונה למאפיין אישי של הצופה" עם "שכפול עם טקסט חדש", ומייל `meta_ad_rejected` אחד.
- [ ] סיבה לא מוכרת ← "מטא לא אישרה את המודעה. הסיבה שמטא נתנה: …".
- [ ] `pause_expensive_ad` לא משהה את המודעה הפעילה האחרונה (בדיקת יחידה); `boost_winner` לא רץ פעמיים בתוך 72 שעות ולא עובר את תקרת התוכנית.
- [ ] `monthly_cap_stop` בלי `capIls` ← `INVALID_INPUT`; עם תקרה שנחצתה ← כל הקמפיינים הפעילים מושהים ונרשמים ביומן.
- [ ] פרויקט מתבנית T4 (`organic_only`) לא מגיע לשלב "הכנה לפרסום" (`AD_NOT_ELIGIBLE {reason: "organic_only_template"}`).
- [ ] "סיום" לא שולח `ARCHIVED` למטא, והקמפיין ניתן לשכפול.

---

## §11. דשבורד ודוחות

### 11.1 ארבעת המספרים (`KpiTile`, תמיד בסדר הזה)

| אריח | חישוב | "מה זה?" |
|---|---|---|
| **כמה הוצאתם** | Σ `spend_ils` (‏₪) | "הסכום שמטא חייבה בתקופה, לפי חשבון המודעות שלכם" |
| **כמה אנשים ראו** | `reach` ללא כפילויות: ברמת קמפיין מ-`ad_campaigns.reach_summary`, ברמת הסביבה מ-`meta_assets.reach_summary` (קריאה ברמת החשבון עם סינון לקמפיינים שלנו) — **לעולם לא סכום של מודעות או של ימים** | "אנשים שונים שראו את המודעות לפחות פעם אחת" |
| **כמה פניות** — לפי המטרה: **"פניות בוואטסאפ"** · **"לידים"** · **"כניסות לאתר"** · בחשיפה **"צפו לפחות 3 שניות"** | Σ `results` | "מטא סופרת פנייה כשמישהו התחיל שיחה, השאיר פרטים או נכנס לאתר אחרי שראה מודעה" |
| **כמה עלתה כל פנייה** · בחשיפה **"עלות ל-1,000 אנשים"** | הוצאה ÷ פניות · הוצאה ÷ reach × 1,000 | "ההוצאה חלקי מספר הפניות. כשיש מעט פניות, המספר הזה עוד לא יציב" |

לכל אריח: שינוי מול התקופה הקודמת באותו אורך (חץ עם אייקון וטקסט, לא צבע בלבד), ובלי פניות — **"—"** ולא 0. ברמת הסביבה (`/app/campaigns`), כשיש קמפיינים במטרות שונות, האריח השלישי הוא **"כמה פניות"** והפירוט לפי מטרה מופיע ב-Tooltip (`resultLabel: "mixed"`).

### 11.2 `/app/campaigns` ו-`/app/campaigns/[campaignId]`

**`/app/campaigns` (דשבורד):** שורת טווח (**7 ימים · 14 ימים · 30 יום**, נשמר ב-`localStorage['campaigns.report.range']`) · `SpendCapMeter` (בעלים ומנהלים) · ארבעת האריחים · **"מה כדאי לעשות עכשיו"** (פעולות מ-M8: מודעה שנדחתה, מנצח שאפשר להגביר, חיבור שנותק, לידים שמחכים, תקרה, יום שקט) · רשימת הקמפיינים (`CampaignCard`: שם, `StatusBadge`, מטרה, תקציב יומי, ארבעה מספרים מקוצרים) עם סינון לפי סטטוס · כרטיס **"בדיקת דופק"** כשיש חשבון מודעות עם היסטוריה (§15) · ריק: **"עוד אין קמפיינים"** + **"העלו לקמפיין את הסרטון האחרון"** (ראשי) ו**"לכל הפרויקטים"**.

**`/app/campaigns/[campaignId]` (אחרי פרסום):** כותרת (שם עריך, `StatusBadge`, `CampaignStatusTimeline`, פעולות: **"השהיה"** / **"המשך"** · **"תקציב"** · תפריט: **"שכפול"**, **"סיום"**) · ארבעת האריחים · כרטיס **"מה זה אומר?"** (§11.3) · **"השוואת הוקים"** (`HookComparisonTable`: תמונה ממוזערת, ההוק, חשיפות, **"עצרו לצפות"** = `video_3s_plays ÷ impressions`, **"נשארו עד הסוף"** = `thruplays ÷ video_3s_plays`, פניות, עלות לפנייה, תג **"המנצח"** רק אחרי המדגם; מיפוי השדות [M0-verify לכל action ב-v26]) · גרף יומי (עמודות הוצאה + קו פניות; `Chart` של חלק 01: `dir="ltr"`, וטבלה חלופית מתחתיו) · לשוניות **"כללים"** (§10.4), **"יומן שינויים"**, **"פרטים"** (אזור, גילאים, מיקומים, יעד, ‏UTM). שורת עדכניות: **"עודכן לפני {minutes, plural, one {דקה} two {שתי דקות} other {# דקות}}"** + **"רענון"** (C16, פעם ב-15 דקות), והערה **"נתוני מטא יכולים להתעדכן עד 28 יום אחורה"**. ‏`campaign_report_viewed {range}`.

**כללי נתונים:** ‏`use_unified_attribution_setting=true` [M0-verify]; לעולם לא `7d_view`/`28d_view` (הוסרו ב-2026-01-12); ייחוס ברירת המחדל של מטא; **בלי פילוחים ב-MVP** (מכשיר, שעה ותדירות דורשים הסכמה בחשבונות שאינם מכירות מאז 2026-08-03); הוצאה בשקלים בלבד; **בלי השוואה ללקוחות אחרים** (רק אחרי [Counsel] ו-`cross_customer_benchmarks.enabled`, עם k ≥ 5).

### 11.3 "מה זה אומר?" (C17, ‏`ads.insight_explain.v1`)

2–4 משפטים קצרים ועד שתי המלצות מתוך **רשימה סגורה**, כל אחת מקושרת לכפתור:

| `action` | כפתור |
|---|---|
| `wait_more_data` | **"מחכים עוד קצת"** (סוגר את ההמלצה) |
| `raise_budget_20` | **"העלאת תקציב ב-20%"** (C11) |
| `boost_winner` | **"הגבירו את המנצח"** (C14) |
| `pause_ad` | **"השהיית המודעה"** |
| `new_variants_from_winner` | **"עוד 3 גרסאות מהמנצח"** |
| `fix_rejected_ad` | **"תיקון המודעה"** |
| `extend_end_date` | **"הארכת הקמפיין"** |
| `reply_to_whatsapp_fast` | **"איך עונים מהר בוואטסאפ"** (מדריך) |
| `check_lead_form` | **"בדיקת הטופס"** |

מעקות: לעולם לא מבטיח ולא חוזה תוצאות; אין מספרים של "ממוצע בתחום"; **כל מספר בפלט חייב להופיע בקלט** (ולידציה סמנטית; כשל ← תבנית דטרמיניסטית מ-`lib/meta/explain-fallback.ts`); לפני המדגם הפעולה היחידה המותרת היא `wait_more_data`; אף פרט של ליד לא נכנס לפרומפט (רק ספירות). מטמון של 6 שעות לקמפיין ולטווח (Upstash `meta:explain:{campaignId}:{range}:{dataHash}`). ‏`campaign_explained`.

```ts
// lib/meta/explain-fallback.ts — used when the model is unavailable or fails validation
export function explainFallback(i: ExplainInput): InsightExplainV1 {
  if (!i.sampleReady) return { mode: i.mode, sentences_he: [
    `עד עכשיו הוצאתם ${i.f.spend} והמודעות הגיעו ל-${i.f.reach} אנשים.`,
    "מטא עדיין לומדת למי להראות את המודעות, ולכן מוקדם לקבוע מה עובד." ], recommendations: [
    { action: "wait_more_data", variant_key: null, reason_he: "כדאי לחכות לפחות 3 ימים מתחילת הקמפיין לפני שמשנים משהו." } ], numbers_used: [i.f.spend, i.f.reach] };
  return { mode: i.mode, sentences_he: [
    `הוצאתם ${i.f.spend}, ${i.f.reach} אנשים ראו את המודעות והגיעו ${i.f.results} ${i.f.resultNounHe}.`,
    i.winner ? `ההוק "${i.winner.hookHe}" הביא פנייה ב-${i.winner.cpr}, הכי זול מבין המודעות.` : `כל פנייה עלתה בממוצע ${i.f.cpr}.` ],
    recommendations: i.winner ? [{ action: "boost_winner", variant_key: i.winner.key, reason_he: "אפשר להעביר את התקציב למודעה שעובדת הכי טוב." }] : [],
    numbers_used: [i.f.spend, i.f.reach, i.f.results, i.winner?.cpr ?? i.f.cpr] };
}
```

(`i.f` הם המספרים כבר מעוצבים — `formatIls`, ‏`formatInteger` — וה-`resultNounHe` מגיע מ-ICU plural בצד השרת; המחרוזות האלה הן ברירת מחדל טכנית ועוברות את `lint` כמו כל קופי.)

### 11.4 יומן שינויים

כל שורה: מתי · מי (שם, **"כלל אוטומטי"** או **"המערכת"**) · מה, בעברית: `prepare` **"הקמפיין הוכן במטא, מושהה"** · `publish` **"נשלח לבדיקה של מטא"** · `pause` **"הושהה"** · `resume` **"חודש"** · `budget_change` **"התקציב היומי שונה מ-{before} ל-{after}"** · `end` **"הסתיים"** · `duplicate` **"שוכפל לטיוטה חדשה"** · `boost_winner` **"המנצח הוגבר"** · `rule_pause` **"כלל אוטומטי השהה מודעה"** · `rule_budget` **"כלל אוטומטי העלה את התקציב"** · `user_cap_pause` **"הושהה כי הגיע לתקרה החודשית שקבעתם"** · `status_sync` **"הסטטוס במטא עודכן: {statusLabel}"** · `creative_swap` **"הקריאייטיב הוחלף"**. שגיאה של מטא בפעולה מוצגת בשורה עם `META_ERRORS_HE`.

### 11.5 הסיכום השבועי (`/api/cron/weekly-summary`, ראשון 06:00 UTC)

נשלח לבעלים ולמנהלים עם `notification_prefs.kinds.weekly_results`, רק לסביבות שהייתה בהן הוצאה או פוסט שפורסם בשבוע: מייל `weekly_results` (ווואטסאפ `weekly_results_he` כש-`whatsapp_notify` והסכמה). ‏`weekly_summary_sent {channel}`.

```ts
export const WeeklySummaryV1 = z.object({
  isoWeek: z.string().regex(/^\d{4}-W\d{2}$/), range: z.object({ from: z.iso.date(), to: z.iso.date() }),
  kpis: Kpis,                                                         // last 7 days vs the week before
  winner: z.object({ campaignId: Uuid, hookTextHe: z.string(), thumbnailUrl: z.url(), costPerResultIls: z.number() }).nullable(),
  bestReel: z.object({ postId: Uuid, platform: z.enum(["instagram", "facebook"]), views: z.number().int(), permalink: z.url() }).nullable(),
  recommendation: z.object({ action: InsightAction, reasonHe: z.string() }).nullable(),     // ads.insight_explain.v1 with mode "weekly"
  automations: z.array(z.object({ kind: AdRuleKind, campaignName: z.string(), count: z.number().int() })),
  newLeads: z.number().int(),
});
```

### קריטריוני קבלה
- [ ] "כמה אנשים ראו" בקמפיין עם 3 מודעות שווה ל-`reach_summary` של הקמפיין, ולא לסכום של המודעות (בדיקה עם fixture שבו הסכום גדול מה-reach).
- [ ] פלט של `ads.insight_explain.v1` עם מספר שלא בקלט ← מוצג הטקסט של `explainFallback`, והאירוע נרשם כ-warning.
- [ ] לפני המדגם "מה זה אומר?" מציע רק "מחכים עוד קצת", ותג "המנצח" לא מוצג.
- [ ] הגרף מלווה בטבלה נגישה עם אותם ערכים; צבע לא מעביר מידע לבד.
- [ ] המייל השבועי לא נשלח לסביבה בלי הוצאה ובלי פוסטים בשבוע, ונשלח פעם אחת לכל `isoWeek`.

---

## §12. לידים

### 12.1 טופס מיידי (`LeadFormSpecV1`, נוצר ב-`metaPrepareCampaign` דרך `POST /{page_id}/leadgen_forms`)

`locale: "HE_IL"`; שאלות: `FULL_NAME` ו-`PHONE` (חובה), ‏`EMAIL` ו-`CITY` אופציונליים, עד 3 שאלות משלכם (תשובה קצרה או בחירה, בעברית); פתיח (כותרת עד 60, טקסט עד 200); `privacy_policy: { url: meta_assets.privacy_policy_url (או דף הפרטיות של דף העסק, §14.7), link_text: "מדיניות הפרטיות של {businessName}" עד 70 }`; מסך תודה (כותרת, טקסט, כפתור: וואטסאפ / חיוג / אתר); תיבת הסכמה שיווקית אופציונלית (כבויה כברירת מחדל): **"מאשרים לקבל עדכונים ומבצעים מאת {businessName}"**. תצוגת RTL ב-iOS וב-Android היא [M0-verify על מכשיר].

### 12.2 קליטה (`metaLeadIngest`, ‏`lib/meta/leads.ts`)

webhook ← `GET /{leadgen_id}?fields=created_time,field_data,ad_id,form_id,campaign_id,is_organic,platform` (טוקן העמוד) ← נרמול: טלפון ישראלי ל-E.164 (`normalizePhoneIL`), חיתוך רווחים, `first_name` מהמילה הראשונה של השם, תוויות עבריות לשאלות שלכם מתוך `lead_forms.spec`, הסכמה שיווקית ל-`consent` ← `insert` (ייחודי לפי `meta_leadgen_id`) ← Realtime `lead.created` ← התראות (§12.4) ← `sleep(app_settings.lead_notify.untouched_reminder_min)` ← תזכורת אם הליד עדיין `new`. לידים מכלי הבדיקה של מטא נשמרים עם `is_test = true` ומקבלים את התג **"ליד בדיקה"** [M0-verify איך מטא מסמנת ליד בדיקה]. שגיאת הרשאה (Leads Access Manager) ← בדיקת המוכנות `leads_access` והתראה לבעלים. ‏`lead_received {source}` מהשרת, עם `source` מתוך `lead_source`.

### 12.3 תיבת הלידים (`/app/leads`, מובייל קודם)

סינון (סטטוס, קמפיין, מקור — **"טופס במטא"** / **"דף העסק"**, תאריך); `LeadCard`: שם, טלפון (בתצוגת LTR) עם **"התקשרו"** (`tel:`), **"וואטסאפ"** (`https://wa.me/{e164}?text=` עם ההודעה המוכנה **"היי {firstName}, כאן {businessName}. קיבלנו את הפנייה שלכם ונשמח לעזור."**), מייל, תשובות, המקור (קמפיין + הוק, או "דף העסק"), זמן יחסי; בורר סטטוס (**חדש · יצרנו קשר · רלוונטי · נסגר · לא רלוונטי · ספאם**), הערות (עד 1,000), אחראי; שינוי סטטוס לכמה לידים; ייצוא CSV (בעלים ומנהלים, `audit_logs` ‏`leads.export`, ‏`leads_exported {count_bucket}`); מחיקה (בעלים ומנהלים, `leads.delete`) עם הדיאלוג **"למחוק את הליד? הוא יימחק מהחשבון ב{{BRAND_NAME}}. מטא שומרת עותק משלה של לידים מטפסים כ-90 יום."** מיני-CRM בלבד: בלי צינורות מכירה ובלי רצפי הודעות. בתוכנית החינמית הלידים, הכפתורים וההתראות עובדים; סטטוס, הערות, אחראי ו-CSV נעולים עם הקופי של `meta_lead_inbox`. ‏`lead_status_changed {to}`. מונה לא-נקראו בניווט (**"לידים"**) = לידים `new`.

### 12.4 התראות

התראה באפליקציה `lead_received` מיד; מייל `lead_new` לכל ליד, ומעל 5 לידים ב-10 דקות — מייל סיכום אחד (`lead_digest:{ws}:{10min}`); וואטסאפ `lead_new_he` כשהופעל (שם פרטי, טלפון לפי `app_settings.lead_notify.include_phone_in_whatsapp` ⚖️, קישור); אחרי 15 דקות בלי טיפול — תזכורת באפליקציה ובמייל (`lead_new` בווריאנט `reminder`). שעות השקט של וואטסאפ (חלק 06 §13.3) חלות גם כאן; ההתראה באפליקציה והמייל יוצאים מיד.

### 12.5 פרטיות

הלקוח הוא **בעל השליטה** בלידים שלו, ואנחנו **מעבדים** (`/legal/dpa`, ⚖️ [Counsel]). המידע נשמר ב-Supabase בפרנקפורט, 24 חודשים מ-`received_at` (`purge-leads`) אלא אם נמחק קודם; מחיקה אצלנו לא מוחקת את העותק של מטא (כ-90 יום), והדיאלוג אומר את זה; לידים לא משמשים לשיווק שלנו, לא מצטרפים בין לקוחות ולא נשלחים ל-LLM; ‏`field_data` מנוקה מ-Sentry ומהלוגים; ייצוא נרשם; בקשות של נושאי מידע מופנות לעסק, ואנחנו עוזרים דרך התמיכה.

### קריטריוני קבלה
- [ ] `simulateLead(pageId)` ← הליד בתיבה ובפעמון תוך פחות מ-60 שניות, עם טלפון ב-E.164 ושם פרטי.
- [ ] אותו `leadgen_id` משני מקורות (webhook ומילוי לילי) ← שורה אחת והתראה אחת.
- [ ] שישה לידים ב-10 דקות ← חמישה מיילים בודדים ומייל סיכום אחד, לא שישה.
- [ ] ייצוא CSV נפתח באקסל בעברית תקינה (BOM), וכותרות העמודות בעברית.
- [ ] צופה רואה לידים ויכול להתקשר; לא יכול לשנות סטטוס או למחוק (403 עם הקופי של חלק 03).

---

## §13. פרסום רגיל, תזמון ולוח התוכן

### 13.1 רילס באינסטגרם (`lib/meta/publish/instagram.ts`, מסלול Facebook Login)

`POST /{ig_user_id}/media` עם `media_type=REELS`, ‏`video_url` (כתובת חתומה ל-`renders`, ‏6 שעות, נשמרת עד `FINISHED`), ‏`caption`, ‏`share_to_feed`, ‏`cover_url` (הפוסטר שלנו) או `thumb_offset`, ‏`collaborators` (עד 3), ‏`location_id` (מזהה העמוד של העסק כשיש לו כתובת [M0-verify]), ‏`trial_params` ל-Trial Reels (`MANUAL` | `SS_PERFORMANCE`, איות המפתח [M0-verify]) ← polling על `status_code` (`IN_PROGRESS`/`FINISHED`/`ERROR`/`EXPIRED`/`PUBLISHED`) כל 30 שניות עד 15 דקות (`EXPIRED` ← יצירה מחדש פעם אחת) ← `sleep` עד המשבצת ← `media_publish` (2207089 ← עד 3 ניסיונות) ← `permalink`, ‏`media_product_type`. Trial Reels מוצעים רק כש-`meta_assets.trial_reels_eligible` (נבדק בניסיון הראשון), עם ההסבר שההחלטה להציג לכל העוקבים נעשית באפליקציית אינסטגרם.

### 13.2 רילס בפייסבוק (`lib/meta/publish/facebook.ts`)

`POST /{page_id}/video_reels upload_phase=start` ← `rupload.facebook.com` עם `Authorization: OAuth {pageToken}` ו-`file_url` ← polling על `status` ← `upload_phase=finish video_state=PUBLISHED description=…`; ‏3–90 שניות [M0-verify אחרי השינוי של 2025, "כל הסרטונים הם רילס"].

### 13.3 מפרט, טקסט ומגבלות

- **מפרט** (פרופיל `meta_reels`): ‏MP4/H.264, ‏AAC 48 kHz עד 128 kbps, עד 25 Mbps (אנחנו עד 20), ‏30 פריימים לשנייה, ‏9:16 ב-1080×1920, ‏moov בהתחלה, 3–90 שניות, עד 300MB; נבדק לפני כל קריאה (`INVALID_INPUT {reason: "video_spec"}`).
- **בונה הטקסט** (`lib/social/caption.ts`): עד 2,000 תווים (המגבלה של אינסטגרם 2,200), **עד 5 האשטגים** (מנוקים: בלי ׳ ״ - וניקוד, קו תחתון במקום רווח), הנעה לפעולה בשורה הראשונה (`first_line_cta_he`), ושורות שמתחילות בספרה, אימוג׳י, ₪ או אות לטינית מקבלות U+200F; מספרי טלפון וכתובות עטופים ב-U+2066…U+2069. **הסימנים האלה נוצרים בקוד בזמן הפרסום, ולעולם לא נכתבים בקובצי הקופי.** בלי @mentions (משתמשים ב-collaborators). מקור הטקסט: `post.caption.v2` (§18.4).
- **מכסות יומיות בזמן ריצה:** באינסטגרם `GET /{ig_user_id}/content_publishing_limit?fields=config,quota_usage` לפני כל פרסום (התיעוד אומר 100 או 50 — לא מקודדים); אצלנו `app_settings.social_daily_caps` (25 ביום לחשבון אינסטגרם, 25 לעמוד; בפייסבוק המתועד הוא 30 רילס ב-24 שעות מתגלגלות, נספר במסד) ← `RATE_LIMITED {scope: "ig_publish_daily" | "fb_reels_daily", retryAfter}`. מפת שגיאות: 190 חיבור מחדש, 200/10 הרשאה, 9/2207042 מכסה יומית, 2207026 פורמט, 2207089 עד 3 ניסיונות. כשל סופי ← `SOCIAL_PUBLISH_FAILED {platform, metaCode?, subcode?}` ב-`social_posts.error_code`, התראה, מייל `social_post_failed` ו-`social_post_failed {platform, error_code}`.

### 13.4 דיאלוג הפרסום (`/app/publish/new?project=` ומדף הפרויקט: **"פרסמו עכשיו"**)

מתגי פלטפורמה (**אינסטגרם · פייסבוק**, לכל אחת טקסט ותזמון נפרדים אם רוצים), הטקסט וההאשטגים (מ-`post.caption.v2`, ניתנים לעריכה, מונה), **"להציג גם בפיד"**, בחירת שער, שותפים לפוסט, מיקום, **"עכשיו"** או תאריך ושעה (שעון ישראל), מתג **"Trial Reel: להציג קודם למי שלא עוקב"**, הודעת ה-AI (§13.6), ואזהרת יום שקט. שורה אחת ב-`social_posts` לכל פלטפורמה. ‏`social_post_scheduled {platforms, kind, immediate}`; ‏`social_post_published {platform, kind}` מהשרת.

### 13.5 מתזמן משלנו

לשתי הפלטפורמות (באינסטגרם אין תזמון ב-API; בתזמון הטבעי של פייסבוק לא משתמשים): ה-cron כל 5 דקות מתחיל את `socialPublish` 10 דקות לפני המשבצת; קונטיינרים לא נוצרים יותר מ-10 דקות מראש (הם פגים אחרי 24 שעות). הממשק אומר **"פוסטים שמתוזמנים מכאן לא יופיעו ברשימת התזמונים באפליקציית אינסטגרם"**. ביטול ועריכה עד `uploading`. בתוכנית החינמית עד 3 פוסטים עתידיים (`social_scheduled_max`).

### 13.6 נתוני פרסום רגיל, טבלת המובילים והודעת ה-AI

- **נתונים** (cron, §8.3): באינסטגרם `views, reach, likes, comments, shares, saved, total_interactions, ig_reels_avg_watch_time, ig_reels_video_view_total_time, reels_skip_rate` (לעולם לא `plays`, ‏`impressions`, ‏`video_views`); בפייסבוק `blue_reels_play_count, fb_reels_total_plays, fb_reels_replay_count, post_video_avg_time_watched`. **"הסרטונים שעובדים הכי טוב"** ב-`/app/publish`, לפי הוק ותבנית טרנד, עם **"קדמו את הסרטון הזה"** ועם המשפט **"הסרטון הזה הביא הכי הרבה צפיות. להפוך אותו לקמפיין?"**. ‏`reels_skip_rate` ריק ← **"אין עדיין מספיק צפיות"**. אוצר המילים של פרסום רגיל ושל קמפיינים נשאר נפרד.
- **מטא-דאטה של AI:** צעד ה-finalize שומר `comment=ai-generated` ומוסיף XMP `Iptc4xmpExt:DigitalSourceType` (`compositeWithTrainedAlgorithmicMedia` כשמשולבת מדיה של הלקוח, `trainedAlgorithmicMedia` כשהכול AI) [M0-verify את הכלי בסביבת ה-finalize]; לא מוחקים ולא מזייפים מטא-דאטה, ולא משווקים "עקיפת תווית ה-AI". בדיאלוג הפרסום ובסקירת הקמפיין (ניתן לסגירה, `localStorage['announcement.dismissed.meta-ai-notice']`): **"הסרטון כולל תוכן שנוצר ב-AI. מטא עשויה להוסיף לו תווית 'AI info'. בסרטון שנראה מציאותי, המדיניות של מטא מבקשת לסמן את זה."**

### 13.7 לוח התוכן (`/app/publish`, חודש ושבוע — `localStorage['publish.calendar.view']`)

`CalendarGrid` עם פוסטים מתוזמנים ומפורסמים, טווחי קמפיינים, עונות מ-`seasons` (עם רמז `promo_lead_days` ותבניות טרנד מתאימות), ימי שקט (חסומים לתזמון חדש; פוסטים קיימים מקבלים אזהרה), הערת תקופת בחירות, ופריטי "תוכנית 30 יום" (§16) כמשבצות מתוכננות. הכפתור **"תכנון חודש"**: עם `monthly_plan` — פותח את `/app/plan`; בלעדיו — `lib/social/calendar.ts → suggestSlots(month)` מציע 8 משבצות מהעונות ומטרנדים של השבוע, בלי עלות AI.

### קריטריוני קבלה
- [ ] רילס שפורסם "עכשיו" מופיע באינסטגרם ובפייסבוק, ופוסט מתוזמן לעוד 30 דקות מתפרסם בטווח של ±2 דקות (M9).
- [ ] טקסט עם 6 האשטגים ← `INVALID_INPUT {reason: "hashtags_max"}`; שורה שמתחילה ב-"₪99" יוצאת למטא עם U+200F בתחילתה, וב-`messages/he.json` אין U+200F.
- [ ] `content_publishing_limit` נקרא לפני כל פרסום (MSW), וכש-`quota_usage` מלא ← `RATE_LIMITED {scope: "ig_publish_daily"}`.
- [ ] קונטיינר שפג (`EXPIRED`) נוצר מחדש פעם אחת; כשל שני ← `failed` עם מייל.
- [ ] יום הזיכרון חסום לתזמון חדש בלוח, עם הסבר.

---

## §14. "דף העסק" — דף נחיתה אוטומטי לעסק בלי אתר (M10, דגל `landing_pages`)

### 14.1 מה, למי, ומה עולה כסף

הרבה עסקים קטנים בלי אתר. המערכת בונה דף אחד בעברית מערכת המותג, מהנישה (`niches` + `niche_extras`), מהסרטון הכי טוב של העסק ומהפרטים שהעסק אישר, כדי שלמטרות "כניסות לאתר" ו"לידים בטופס" יהיה יעד. **זה פיצ׳ר בתשלום (החלטת המייסד מ-2026-10-17, שגוברת על הטיוטה שבה דף אחד היה חינם):**

| תוכנית | דפים מפורסמים (`plans.limits.landing_pages`) | `show_branding` |
|---|---|---|
| חינם | 0 — **תצוגה מקדימה בלבד** (עם סימן מים "תצוגה מקדימה", בלי פרסום). סביבה חינמית שרכשה חבילת קרדיטים (`has_paid = true`) רשאית לפרסם דף אחד | `true`: בתחתית "נבנה עם {{BRAND_NAME}}" |
| בסיס | 1 | `false` |
| עסק | 3 | `false` |
| סוכנות | 1 לכל סביבה (של הסוכנות ושל כל לקוח) | `false` |

- **יצירה ויצירה מחדש:** 10 קרדיטים (`landing.generate`, ‏`credit_costs`), גם בתצוגה המקדימה בחינם (מתוך קרדיטי הניסיון). **עריכת טקסט, פרסום והסרה מפרסום — חינם.**
- המגבלה נספרת בפרסום (דפים `published` בסביבה); עד 10 שורות לסביבה בכל מצב (`INVALID_INPUT {reason: "too_many_pages"}`). ‏`lib/landing/limits.ts → landingAllowance(ws)` מחזיר `{ max, published, previewOnly, showBranding }`, ו-`max` נלקח מ-`landingPageLimit(ws)` של חלק 06 §2.7 (חינם ← 0, ו-1 אחרי רכישת חבילה; שאר התוכניות ← `plans.limits.landing_pages`).
- **בשנמוך תוכנית** (חלק 06 §5.4): דפים שכבר מפורסמים **נשארים באוויר**, כי ייתכן שקמפיין פעיל מפנה אליהם. הדפים שפורסמו ראשונים, עד המכסה החדשה, נשארים לעריכה; השאר לקריאה בלבד, ופרסום של דף נוסף נחסם עד שהמספר יורד למכסה. `show_branding` נגזר בזמן הצגה, ולכן בתוכנית החינמית "נבנה עם {{BRAND_NAME}}" חוזר מיד.
- דומיין משלכם (למשל `www.mybusiness.co.il`) — מפת דרכים (§23), לא v1.

### 14.2 `LandingPageContentV1` (`lib/landing/content.ts`; גם הסכמה של `landing.copy.v1`)

```ts
export const LandingPageContentV1 = z.object({
  version: z.literal(1),
  hero: z.object({ video_asset_id: Uuid.nullable(), poster_asset_id: Uuid.nullable(), h1_he: HeText(4, 60), subline_he: HeText(10, 140) }),
  benefits_he: z.array(HeText(4, 80)).length(3),
  services: z.array(z.object({ name_he: HeText(2, 40), description_he: z.string().max(120).nullable(),
    price_from_ils: z.number().positive().nullable() })).max(8),                       // shown as "החל מ-₪X"; only from confirmed facts
  hours: z.array(z.object({ days_he: HeText(2, 30), hours: z.string().regex(/^\d{2}:\d{2}–\d{2}:\d{2}$|^סגור$/) })).max(7),
  location: z.object({ address_he: z.string().max(160).nullable(), city_he: z.string().max(60).nullable(), waze_url: z.url().nullable() }),
  contact: z.object({ whatsapp_e164: z.string().nullable(), phone_e164: z.string().nullable(), whatsapp_prefill_he: z.string().max(200).nullable() }),
  lead_form: z.object({ enabled: z.boolean(), fields: z.array(z.enum(["full_name", "phone", "email", "city", "message"])).min(2),
    submit_label_he: HeText(2, 24), thank_you_he: HeText(4, 140), marketing_opt_in: z.boolean() }),
  faq: z.array(z.object({ q_he: HeText(4, 100), a_he: HeText(4, 400) })).max(5),
  legal: z.object({ business_name: HeText(1, 120), id_label: z.enum(["ח״פ", "ע״מ", "ע״פ"]).nullable(), id_number: z.string().regex(/^\d{9}$/).nullable(),
    address_he: z.string().max(160).nullable(), privacy_email: z.email().nullable() }),
  seo: z.object({ title_he: HeText(4, 60), description_he: HeText(10, 155) }),
}).strict();
```

השדות של `hours`, ‏`location`, ‏`contact`, ‏`legal` ו-`price_from_ils` **לא באים מהמודל**: הוולידציה הסמנטית דורסת אותם מ-`business_profiles` ומהעובדות המאושרות (`facts`), ומחיר בלי עובדה מאושרת נמחק. הפרטים המשפטיים (שם רשום, ח״פ או עוסק, כתובת, מייל לפרטיות) נאספים בעורך ונדרשים לפני פרסום (`INVALID_INPUT {reason: "legal_identity_missing"}`); בלי וואטסאפ, טלפון וטופס — `no_contact_channel`.

### 14.3 יצירה (LP2 / LP3)

שערים (דגל, תפקיד, עד 10 שורות) ← `begin_spend(ws, 10, "landing.generate", ref, "spend:landing:{key}:{attempt}")` ← איסוף ההקשר: `business_profiles`, ערכת המותג, הנישה ו-`niche_extras`, הסרטון (הפרויקט שנבחר, ואם לא — הרינדור האחרון שהצליח עם `hook_score` הגבוה ביותר) ← `landing.copy.v1` (§18.5), זורם כ-NDJSON ← ולידציה ודריסת העובדות ← `moderation.brief.v1` על כל הטקסטים ← שמירת `content` ו-`generated_at` ← `commit_spend` ← `done { landingPageId }`. כל כשל ← `refund_reservation` (**"הפעולה נכשלה. הקרדיטים הוחזרו."**). כתובת ברירת המחדל: תעתיק לטיני של שם העסק (`lib/landing/slug.ts`, טבלת תעתיק קבועה), עם סיומת `-2`, `-3` בהתנגשות. ‏`landing_page_created` מהשרת.

### 14.4 המסכים

**`/app/landing-pages` ("דף העסק"):** כרטיס לכל דף (תמונה ממוזערת, `StatusBadge kind="landing_page"`: טיוטה · מפורסם · הוסר מפרסום, הכתובת, צפיות, לידים) · ראשי: **"יצירת דף העסק · 10 קרדיטים"** · ריק: **"אין לכם אתר? בונים דף עסק בדקה"** + שורת הסבר.
**`/app/landing-pages/[id]` (עורך):** תצוגה חיה (טלפון ומחשב) בעמודות הסוף; בהתחלה טופס לפי מקטעים — סרטון פתיחה, כותרת, משפט משנה, שלושה יתרונות, שירותים, שעות, מיקום, יצירת קשר, טופס, שאלות נפוצות, **"פרטים משפטיים"**; שדה הכתובת **"{{DOMAIN}}/b/"** + `slug`; מתג **"לאפשר לגוגל למצוא את הדף"** (`indexable`); שמירה אוטומטית (LP4); **"פרסום"** · **"הסרה מפרסום"** · **"יצירה מחדש · 10 קרדיטים"** (עם בחירה מה להשאיר). בחינם בלי רכישה: סימן מים על התצוגה, **"פרסום"** מושבת, והשורה **"דף העסק זמין בתוכניות בתשלום"** + **"השוואת תוכניות"**.

### 14.5 הדף הציבורי `/b/[slug]` ו-`/b/[slug]/privacy`

- **ISR** עם תג `landing:{slug}` (`revalidateTag` בפרסום, בהסרה ובפרסום מחדש). `noindex` (מטא + `X-Robots-Tag`) אלא אם `indexable`; כש-`indexable`: JSON-LD `LocalBusiness` וכניסה ל-sitemap. בלי עוגיות ובלי סקריפט אנליטיקה בדפים האלה.
- **מבנה (RTL, צבעי ערכת המותג אחרי בדיקת ניגודיות):** סרטון פתיחה (שקט, עם כתוביות VTT ופוסטר, עוצר ב-`prefers-reduced-motion`) · כותרת ומשפט משנה · שלושה יתרונות · שירותים עם **"החל מ-{price}"** · שעות · כתובת עם **"ניווט בוויז"** · טופס · שאלות נפוצות · תחתית: שם העסק, המזהה, הכתובת, **"מדיניות הפרטיות"**, ו**"נבנה עם {{BRAND_NAME}}"** רק כש-`show_branding`. במובייל פס תחתון דביק: **"וואטסאפ"** · **"חיוג"**.
- **פרסום (LP6):** העתקת הסרטון, הפוסטר, ה-VTT והלוגו ל-`public-media/landing/{id}/` ← `published_content` עם הכתובות הציבוריות ← `status = published`, ‏`published_at`, ‏`show_branding` ← `audit_logs` ‏`landing.publish` ← `landing_page_published`. **הסרה (LP7):** `unpublished`, מחיקת הקבצים הציבוריים, ‏`landing.unpublish`.
- **צפיות (LP9):** הדף שולח beacon אחד בטעינה; השרת מונע כפילות ב-Upstash (`lpview:{pageId}:{ipHash}`, ‏30 דקות; ה-IP עובר hash עם מלח יומי ולא נשמר), מעלה את `views_count`, ושולח `landing_page_viewed` לאנליטיקה במדגם של 10%, עם `distinct_id = landing:{pageId}` ובלי שום מזהה של המבקר.

### 14.6 טופס הלידים הציבורי (LP8)

`PublicLeadBody` (§7.2); honeypot `website` (ערך ← 204 בשקט); `elapsedMs` מתחת ל-3 שניות ← 204 בשקט; bucket `landing_lead` (10 בשעה ל-IP); טלפון ישראלי חובה. מעל הכפתור: **"השליחה מעבירה את הפרטים אל {businessName} כדי שיחזרו אליכם. פרטים ב<privacy>מדיניות הפרטיות</privacy>."** ותיבה לא מסומנת **"מאשרים לקבל עדכונים ומבצעים מאת {businessName}"** כש-`marketing_opt_in` דולק. ‏`leads` עם `source = 'landing_page'`, ‏`landing_page_id`, ‏`consent = { marketing_opt_in, notice_version, text_he }` ← התראות של §12.4 ← `landing_page_lead_submitted`. תודה: `thank_you_he`. Turnstile לא בשימוש ב-v1 (נגישות, ובלי ספק חדש); אם יופיע ספאם — runbook והחלטה ב-`DECISIONS.md`.

### 14.7 הודעת הפרטיות של העסק (`/b/[slug]/privacy`, ‏`lib/landing/privacy.ts`) ⚖️ [Counsel]

תבנית אחת, גרסה `notice_version = "2026-10-17"`, שהמשתנים שלה מגיעים מ-`published_content.legal`. הנוסח שמוצג:

> **מדיניות הפרטיות של {businessName}**
>
> **מי אנחנו.** {businessName} ({idLabel} {idNumber}), {addressHe}. לכל שאלה על המידע שלכם: {privacyEmail}.
>
> **איזה מידע נאסף.** כשממלאים את הטופס בדף הזה נאספים השם, מספר הטלפון ומה שבחרתם להוסיף (מייל, עיר והודעה). אם סימנתם שאתם מאשרים לקבל עדכונים, נרשמת גם ההסכמה הזו.
>
> **למה.** כדי לחזור אליכם לגבי הפנייה, לתאם שירות ולתת הצעת מחיר. עדכונים ומבצעים יישלחו רק אם אישרתם, ואפשר לבקש להפסיק בכל רגע.
>
> **מי מעבד את המידע.** הדף והטופס מופעלים באמצעות {{BRAND_NAME}} ({{LEGAL_ENTITY_NAME}}), שמעבדת את המידע בשמנו ולפי הוראותינו בלבד, ושומרת אותו בשרתים באיחוד האירופי. היא לא משתמשת בו לשיווק שלה ולא מעבירה אותו לאחרים.
>
> **כמה זמן.** עד 24 חודשים מהפנייה, אלא אם ביקשתם למחוק קודם.
>
> **הזכויות שלכם.** אפשר לעיין במידע, לבקש לתקן אותו או למחוק אותו, בפנייה ל-{privacyEmail}. אינכם חייבים למסור את המידע, אבל בלי טלפון לא נוכל לחזור אליכם.
>
> **עדכון אחרון:** {publishedDate}.

שורות בלי ערך (למשל בלי `idNumber`) מושמטות, לא מוצגות ריקות; פרסום בלי `privacyEmail` חוסם (`legal_identity_missing`). הנוסח ממתין לאישור עורך דין ונרשם בחלק 06 §25.

### 14.8 החיבור לבונה הקמפיינים

כש-`business_profiles.website_url` ריק ויש דף מפורסם, היעד של "כניסות לאתר" הוא `https://{{DOMAIN}}/b/{slug}` (עם UTM), וב"לידים בטופס" קישור הפרטיות של הטופס הוא `/b/{slug}/privacy` (כש-`privacy_policy_url` ריק). בלי דף מפורסם, שני הכרטיסים מציעים **"יצירת דף העסק"**.

### קריטריוני קבלה
- [ ] בחינם בלי רכישה: יצירה מורידה 10 קרדיטים, התצוגה עם סימן מים, ו-LP6 מחזיר `PLAN_LIMIT {limit: "landing_pages", max: 0}`; אחרי רכישת חבילה — פרסום אחד עם "נבנה עם {{BRAND_NAME}}".
- [ ] בתוכנית בסיס, פרסום דף שני ← `PLAN_LIMIT {limit: "landing_pages", max: 1, used: 1}`; עריכת טקסט לא מורידה קרדיטים.
- [ ] מחיר שאינו בעובדות המאושרות לא מופיע בדף, גם אם המודל כתב אותו (בדיקת ולידציה).
- [ ] `/b/{slug}` של דף שהוסר מפרסום ← 404 תוך דקה (ISR), והקבצים ב-`public-media/landing/{id}/` נמחקו.
- [ ] שליחה עם honeypot מלא או אחרי פחות מ-3 שניות ← 204 בלי שורה; שליחה תקינה ← ליד עם `source = 'landing_page'` ומייל `lead_new`.
- [ ] הדף עומד ב-Lighthouse ≥ 90 במובייל ובבדיקות הנגישות של חלק 06 §18.5, ואין בו עוגיות.

---

## §15. "בדיקת דופק" — בדיקה חינמית לחשבון מודעות קיים (M10, דגל `meta_health_check`)

### 15.1 מה ולמי

לעסקים בצמיחה שכבר מפרסמים. אחרי החיבור (`ads_read`), ה-flow `metaHealthCheck` קורא 90 יום של הקמפיינים והמודעות של הלקוח עצמו, מריץ בדיקות דטרמיניסטיות, ו-`ads.health_check.v1` כותב דוח בעברית פשוטה: **"איפה הכסף נשרף"** ועד 5 תיקונים, כל אחד עם פעולה בלחיצה לבונה שלנו כשאפשר. **בלי השוואה ללקוחות אחרים.** מכסה: `health_checks_per_month` (חינם 1, בסיס 2, עסק 4, סוכנות 4 לכל לקוח) ו-bucket `health_check` (פעם ביום לסביבה); 0 קרדיטים (`meta.health_check`). הקריאה לפעולה באתר (חלק 02): **"בדיקת דופק חינם לחשבון המודעות שלכם"** ← הרשמה ← חיבור ← `/app/campaigns/health`.

### 15.2 הבדיקות (`lib/meta/health/checks.ts`)

| `check_key` | תנאי (בתקופה) | חומרה | `wasted_ils` |
|---|---|---|---|
| `zero_result_spend` | קבוצת מודעות או מודעה עם הוצאה ≥ ₪100 ו-0 פניות | high | ההוצאה שלהן |
| `high_frequency` | מודעה פעילה עם תדירות 7 ימים > 3 | medium | — |
| `low_ctr` | ‏CTR נמוך מחצי מהחציון של החשבון עצמו (≥ 1,000 חשיפות) | medium | — |
| `creative_fatigue` | מודעה פעילה שהקריאייטיב שלה בן יותר מ-30 יום | medium | — |
| `no_video_creatives` | אין אף מודעה פעילה עם וידאו | high | — |
| `fragmented_budget` | ≥ 4 קבוצות מודעות פעילות עם תקציב יומי מתחת ל-₪20 כל אחת | medium | — |
| `advantage_audience_off` | קבוצות עם `advantage_audience = 0` | low | — |
| `learning_limited` | קבוצות בשלב למידה מוגבל [M0-verify את השדה] | medium | — |
| `billing_issues` | `account_status != 1` או `PENDING_BILLING_INFO` | high | — |
| `no_reels_placements` | מיקומים מפורשים בלי רילס | low | — |

כל תוצאה: `{ key, status: "pass" | "issue" | "not_applicable", severity, wasted_ils, evidence: Record<string, number>, objects: [{ level, meta_id, name }] }` (נשמר ב-`ad_health_reports.checks`). **הציון** דטרמיניסטי: 100 פחות 20 לכל high, ‏10 לכל medium, ‏5 לכל low, מינימום 0; ‏`score_bucket` = `lt40` · `40_69` · `gte70`.

### 15.3 ה-flow והמסך

HC1 ← שורת `ad_health_reports` (`running`) ← `metaHealthCheck(reportId)`: קריאות `GET /act_{id}/insights` (‏`level=adset` ו-`level=ad`, 90 יום, דוח אסינכרוני כשצריך), ‏`GET /act_{id}/adsets?fields=daily_budget,targeting{targeting_automation,publisher_platforms},effective_status` ו-`GET /act_{id}/ads?fields=creative{object_type,video_id},created_time,effective_status` ← הבדיקות ← `ads.health_check.v1` (עם fallback דטרמיניסטי מטבלת הבדיקות) ← `succeeded`, התראה (`system`), מייל `health_check_ready`, ‏`health_check_completed {score_bucket, issues_count}`.

**`/app/campaigns/health`:** טבעת ציון (`Num` + טקסט, לא צבע בלבד) עם הכיתוב **"הערכה לפי הנתונים של החשבון שלכם — לא השוואה לעסקים אחרים"** · **"איפה הכסף נשרף"** (עד 3 שורות עם סכומים) · עד 5 כרטיסי תיקון (כותרת, למה, איך, וכפתור לפי `action`: **"קמפיין חדש מסרטון"** · **"בונה הקמפיינים עם וואטסאפ"** · **"סרטון חדש מטרנד"** · **"איך מאחדים תקציב"** · **"תיקון אמצעי התשלום"**) ← `health_check_fix_clicked {check}` · **"בדיקה חדשה"** (עם המכסה: **"{used} מתוך {max, plural, one {בדיקה אחת} two {שתי בדיקות} other {# בדיקות}} החודש"**) · ריק: **"עוד לא בדקנו את חשבון המודעות"** + **"בדיקת דופק חינם"** (‏`health_check_started` בלחיצה). חשבון בלי היסטוריה ← **"בחשבון הזה עוד אין מספיק נתונים לבדיקה. אחרי כמה ימים של קמפיין אפשר לבדוק."** (בלי לספור במכסה).

### קריטריוני קבלה
- [ ] fixture עם קבוצת מודעות שהוציאה ₪250 בלי פניות ← `zero_result_spend` עם `wasted_ils: 250`, והציון יורד ב-20.
- [ ] שתי בדיקות באותו יום ← `RATE_LIMITED {scope: "health_check"}`; חמישית בחודש בתוכנית עסק ← `PLAN_LIMIT {limit: "health_checks_per_month"}`.
- [ ] הדוח לא מכיל מספר שלא נמצא בתוצאות הבדיקות (ולידציה סמנטית), ולא מזכיר עסקים אחרים.
- [ ] שורות `ad_health_reports` בנות יותר מ-12 חודשים נמחקות ב-`purge-meta-raw`.

---

## §16. "תוכנית 30 יום" (M9, דגל `monthly_plan`; הממשק בלוח התוכן)

### 16.1 מה

אחרי האונבורדינג, ובכל חודש לפי בקשה, `plan.month.v1` בונה תוכנית ל-30 יום: כ-12 פריטי תוכן (שילוב של תבניות טרנד, הוקים של הנישה ועונות מהלוח הישראלי, בלי ימי שקט ובלי תוכן פוליטי בתקופת בחירות) ועוד 1–2 הצעות קמפיין עם תקציב יומי מתוך `meta_budget_presets_ils` (רק כש-`meta_ads` זמין לסביבה). כל פריט נכנס ללוח `/app/publish` כמשבצת מתוכננת. 0 קרדיטים (`plan.generate`), ‏bucket `plan_generate` (3 ביום לסביבה).

### 16.2 הזרימה (`lib/plan/generate.ts`, ‏PL1 ו-`monthlyPlanGenerate`)

קלט: הנישה מהסביבה, ובפעם הראשונה טופס קצר ב-`/app/plan` — **"מה הכי חשוב החודש?"** (יותר פניות בוואטסאפ · יותר לידים · יותר כניסות · שיכירו אותנו), **"איפה הלקוחות?"** (שכונה · עיר · אזור · כל הארץ), **"כמה נוח לכם להוציא על פרסום ביום?"** (בלי פרסום בתשלום · ₪30 · ₪40 · ₪70 · ₪100) ← מועמדים: הוקים של הנישה (לפי פופולריות), תבניות טרנד מ-`trend_feed()` (חלק 08), עונות בחודש, ימי שקט ← `plan.month.v1` (§18.7) ← ולידציה (תאריכים בתוך החודש ולא בימי שקט, מזהים רק מהמועמדים, 10–14 פריטי תוכן, עד 2 קמפיינים, תקציבים מהרשימה) ← כשל ← `lib/plan/fallback.ts` (אותו `suggestSlots` של §13.7, מורחב ל-12) ← שמירה: התוכנית הקודמת של אותו חודש עוברת ל-`archived` ← `monthly_plan_generated`. מייל `monthly_plan_ready` נשלח רק ביצירה האוטומטית בתחילת החודש.

### 16.3 המסך `/app/plan` ("התוכנית שלי")

בלי תוכנית לחודש, או עם `?setup=1` (הקישור מהדף הראשי ומהאונבורדינג, חלק 03 §5), הדף נפתח בשלוש השאלות של §16.2. כותרת החודש ותקציר התוכנית · רשימה לפי שבועות; לכל פריט: תאריך, סוג (**סרטון · טרנד · קמפיין · פוסט**), כותרת, "למה", ו**"צרו בקליק"** — הדף קורא `POST /api/projects` עם `prefill` של הפריט (או `trendSlug` + `src: "trend"`), אחר כך `PATCH /api/plan/items/[id] { status: "in_progress", projectId }`, ומעביר לשלב שחזר (‏`plan_item_started {kind}`); בקמפיין ← `/app/campaigns/new?plan_item={id}`; בפוסט ← דיאלוג הפרסום · **"דילוג"** · **"שינוי תאריך"** (בורר תאריך; גרירה בלוח היא קיצור לאותה פעולה). פריט עובר ל-`done` כשהפוסט שלו פורסם, כשהקמפיין שלו פורסם, או כשהפרויקט שלו הגיע ל-`done` (‏`plan_item_completed {kind}`). מתג **"תוכנית חדשה אוטומטית בתחילת כל חודש"** (`inputs.auto_next_month`) ו**"תוכנית חדשה"** (PL1).

### קריטריוני קבלה
- [ ] תוכנית לחודש עם יום הזיכרון לא כוללת פריט בתאריך הזה, ופריט שהמודל שם בו נדחה בוולידציה.
- [ ] בלי `meta_ads` אין פריטי קמפיין בתוכנית.
- [ ] כשל של המודל מחזיר תוכנית מ-`fallback.ts` עם 12 פריטים, בלי שגיאה למשתמש.
- [ ] "צרו בקליק" יוצר פרויקט אחד בלבד גם בלחיצה כפולה, והפריט מקושר אליו.

---

## §17. מגבלות התוכנית שנוגעות למטא

1. **ניהול Meta כלול בכל תוכנית, 0% מהתקציב**; ההוצאה משולמת תמיד מהכרטיס של הלקוח ישירות למטא. השקה, ניהול ודוחות לא עולים קרדיטים.
2. **מפתחות `plans.limits` חדשים** (חלק 04 seed; ‏`PLAN_LIMIT.details.limit` משתמש בשמות האלה):

| מפתח | חינם | בסיס ₪119 | עסק ₪289 | סוכנות ₪990 |
|---|---|---|---|---|
| `meta_ad_accounts` (חשבונות מודעות מחוברים בכל סביבת החיוב) | 1 | 1 | 2 | 15 |
| `meta_active_campaigns` (`in_review`, ‏`active`, ‏`with_issues`; אזהרה ביצירת טיוטה, חסימה בפרסום ובחידוש) | 1 | 2 | ללא הגבלה | ללא הגבלה |
| `meta_monthly_spend_cap_ils` (הוצאה מנוהלת בחודש ישראלי, כל הקמפיינים) | 0 | 3,000 | 15,000 | 100,000 |
| `meta_test_spend_ils` (קמפיין ניסיון אחד לכל החיים, `spend_cap` במטא) | 300 | 0 | 0 | 0 |
| `meta_split_test` | לא | כן | כן | כן |
| `meta_auto_rules` (כללים פעילים בסביבה) | 0 | 2 | 5 | 5 |
| `meta_lead_inbox` (סטטוסים, הערות, אחראי, CSV; צפייה, חיוג, וואטסאפ והתראות — בכל תוכנית) | לא | כן | כן | כן |
| `social_scheduled_max` (פוסטים עתידיים בבת אחת) | 3 | 30 | ללא הגבלה | ללא הגבלה |
| `landing_pages` (מפורסמים בסביבה) | 0 (תצוגה מקדימה; 1 אחרי רכישת חבילה) | 1 | 3 | 1 לכל סביבה |
| `health_checks_per_month` | 1 | 2 | 4 | 4 לכל לקוח |

   בסוכנות: חיבור אחד לכל סביבת לקוח, והתקרות מסוכמות על הסוכנות.
3. **אכיפת התקרה** (`enforceSpendCaps`, כל שעה, דרך `meta_spend_summary`): 80% ← באנר ומייל `spend_cap_warning` (פעם בחודש, `warned_80_at`); 100% ← **לעולם לא משהים מודעות של הלקוח**; ‏`reached_at` נרשם, ואחרי תקופת חסד של 7 ימים (`meta_spend_cap_grace_days`) נחסמים השקות, חידושים והגדלות תקציב (`PLAN_LIMIT {limit: "meta_monthly_spend_cap_ils", cap, used}`), עם הצעת שדרוג. אין תוספת מעבר לתקרה ואין "בדיקת מומחה" ב-MVP. ‏`spend_cap_banner_shown {pct}`.
4. **שורות `credit_costs` של החלק הזה:** `ads.copy` 0 (‏`call`, "טקסטים למודעה (3 גרסאות)", ‏$0.01) · `ads.insight` 0 (‏`call`, "הסבר בעברית לתוצאות הקמפיין", ‏$0.005) · `meta.health_check` 0 (‏`call`, "בדיקת דופק לחשבון המודעות", ‏$0.02) · `plan.generate` 0 (‏`call`, "בניית תוכנית 30 יום", ‏$0.02) · **`landing.generate` 10** (‏`page`, "בניית דף העסק (יצירה או יצירה מחדש)", ‏$0.03). התוויות הן של חלק 04 §16.4, שהוא הקנוני. פעולות חינמיות מוגנות ב-buckets ולא בקרדיטים.

### קריטריוני קבלה
- [ ] `plans.json` מכיל את עשרת המפתחות עם הערכים של הטבלה, ו-`REQUIRED_ACTION_KEYS` כולל את חמש השורות.
- [ ] 100% מהתקרה לא משנה אף `status` במטא; אחרי 7 ימים "המשך" ו"פרסום" מחזירים `PLAN_LIMIT` והשהיה עדיין עובדת.
- [ ] קמפיין ניסיון שני בחינם ← `PLAN_LIMIT {limit: "meta_test_spend_ils"}` (האינדקס `ad_campaigns_one_free_test`).

---

## §18. הפרומפטים (הטקסט המלא)

המבנה של חלק 05 §8: `system` סטטי בעברית בלי משתנים (cache), כל המשתנים ב-`buildUser` בתוך תגיות, תוכן של משתמש עובר `sanitizeForPrompt`, ו-`sys.hebrew_style.v1` הוא הבלוק הראשון בכל תבנית יצירתית (`moderation.ad.v1` מקבלת את `#core`). הסכמות: Zod ב-`lib/ai/schemas/{ads,landing,plan}.ts`; ה-JSON Schema הקפדני שנשלח לספק הוא בדיוק מה שמופיע כאן (קובצי snapshot ב-`lib/ai/schemas/json/`), ובדיקת החוזה של חלק 05 §11.1 משווה ביניהם. רישום המזהים, הנתיבים וה-`ai_task` — חלק 05 §8.1. שמות ה-Zod: `AdCopyV1` ↔ `ad_copy_v1.json` · `InsightExplainV1` ↔ `insight_explain_v1.json` · `AdPolicyCheckV1` ↔ `ad_policy_check_v1.json` · `PostCaptionV2` ↔ `post_caption_v2.json` · `LandingPageContentV1` ↔ `landing_page_content_v1.json` · `HealthCheckReportV1` ↔ `health_check_report_v1.json` · `MonthlyPlanV1` ↔ `monthly_plan_v1.json`.

| תבנית | נתיב | `ai_task` | טמפ׳ | `maxOutputTokens` | קלט מקס׳ (תווים) | קרדיטים |
|---|---|---|---|---|---|---|
| `ads.copy.v1` | `llm.ads` | `llm_ads` | 0.7 | 2,000 | 8,000 | 0 (`ads.copy`) |
| `ads.insight_explain.v1` | `llm.ads` | `llm_ads` | 0.3 | 900 | 4,000 | 0 (`ads.insight`) |
| `moderation.ad.v1` | `llm.cheap` | `llm_moderation` | 0 | 800 | 6,000 | 0 |
| `post.caption.v2` | הנתיב של v1 (`llm.script`) | של v1 | 0.8 | 900 | 6,000 | 0 |
| `landing.copy.v1` | `llm.script` | `llm_ads` | 0.6 | 3,000 | 10,000 | 10 (`landing.generate`) |
| `ads.health_check.v1` | `llm.ads` | `llm_ads` | 0.3 | 1,500 | 6,000 | 0 (`meta.health_check`) |
| `plan.month.v1` | `llm.script` | `llm_utility` | 0.7 | 3,000 | 9,000 | 0 (`plan.generate`) |

### 18.1 `ads.copy.v1` — טקסטים למודעות

**System:**

```text
אתם קופירייטרים של מודעות בפייסבוק ובאינסטגרם לעסקים קטנים בישראל. אתם מקבלים סרטון מוכן (ההוק, תקציר התסריט והעובדות של העסק) וכותבים לכל מודעה טקסט ראשי, כותרת ותיאור, ובקמפיין של טופס לידים גם את הטקסטים של הטופס.

כללים:
1. כל מודעה ב-<variants> מקבלת טקסט משלה שממשיך את ההוק שלה. אל תפתחו שתי מודעות באותו משפט.
2. primary_text_he: עד 500 תווים, ו-125 התווים הראשונים עומדים בפני עצמם, כי זה מה שרואים לפני "עוד". משפט ראשון קצר שממשיך את ההוק, משפט שאומר מה מקבלים, ומשפט אחרון עם הנעה אחת לפעולה.
3. headline_he: עד 40 תווים, בלי סימן קריאה. description_he: עד 30 תווים, או null.
4. ההנעה לפעולה לפי <goal>: whatsapp_messages — הודעה בוואטסאפ ("שלחו לנו הודעה בוואטסאפ"); lead_form — השארת פרטים; website_traffic — כניסה לאתר; local_awareness — ביקור או בלי בקשה. cta_type רק מתוך <allowed_cta>.
5. רק עובדות מ-<facts>. אין מחיר, הנחה, מספר לקוחות, דירוג או זמן תגובה שלא כתובים שם, ואין "נשארו מקומות" בלי עובדה.
6. אין הבטחה לתוצאה ("תקבלו יותר לקוחות", "מובטח"), אין "הכי" בלי הוכחה, ואין סופרלטיבים בנישות שב-<compliance>.
7. לא פונים למאפיין אישי של הצופה: לא "סובלים מ…?", לא "בגיל שלכם", לא מצב בריאותי, כלכלי, משפחתי, דת או נטייה. כותבים על השירות, לא על הצופה.
8. בלי האשטגים, בלי @ ובלי קישורים. עד 2 אימוג׳ים במודעה, רק בסוף משפט ולעולם לא בתחילת שורה.
9. פנייה לפי <audience_gender> (plural — רבים), רמת שפה לפי <register>.
10. כשיש <season>, הזווית שב-<season_angle> נכנסת למשפט הראשון או השני, בלי לשנות עובדות.
11. כש-<goal> הוא lead_form, מחזירים גם lead_form: intro_headline_he עד 60 תווים, intro_text_he עד 200 ("ממלאים שם וטלפון, ונחזור אליכם…"), thank_you_title_he עד 60, ו-thank_you_body_he עד 200 שאומר מה יקרה עכשיו, בלי זמן מובטח. אחרת lead_form הוא null.
12. כשיש <previous_copy>, כתבו ניסוח אחר באמת, לא שינוי של מילה אחת.
```

```ts
buildUser: (i) => [
  jsonTag("goal", i.goal), jsonTag("allowed_cta", i.allowedCta),
  jsonTag("business", { name: i.business.business_name, city: i.business.city, niche: i.nicheSlug, services: i.business.services.slice(0, 5) }),
  jsonTag("facts", i.confirmedFacts), jsonTag("compliance", i.complianceRules),
  jsonTag("audience_gender", i.audienceGender), jsonTag("register", i.register),
  jsonTag("season", i.seasonSlug ?? null), tag("season_angle", i.seasonAngleEn ?? ""),
  jsonTag("variants", i.variants.map((v) => ({ key: v.key, hook_he: sanitizeForPrompt(v.hookTextHe, 200), script_summary_he: sanitizeForPrompt(v.scriptSummaryHe, 600) }))),
  tag("previous_copy", i.previous ? sanitizeForPrompt(JSON.stringify(i.previous), 1500) : ""),
  "כתבו טקסטים לכל מודעה לפי הסכמה ad_copy_v1.",
].join("\n\n"),
validate: (o, i) => [...sameKeys(o.variants, i.variants), ...noHashtagsOrMentions(o), ...maxEmoji(o, 2), ...numbersInFacts(o, i.confirmedFacts),
  ...personalAttributes(o), ...lintHe(o), ...(i.goal === "lead_form" ? requireLeadForm(o) : forbidLeadForm(o))],
```

`lib/ai/schemas/json/ad_copy_v1.json`:

```json
{"type":"object","additionalProperties":false,"required":["variants","lead_form"],
 "properties":{
  "variants":{"type":"array","description":"One item per input variant, same keys","items":{"type":"object","additionalProperties":false,
    "required":["variant_key","primary_text_he","headline_he","description_he","cta_type"],
    "properties":{
      "variant_key":{"type":"string","enum":["A","B","C"]},
      "primary_text_he":{"type":"string","description":"Max 500 chars; first 125 chars stand alone"},
      "headline_he":{"type":"string","description":"Max 40 chars, no exclamation mark"},
      "description_he":{"type":["string","null"],"description":"Max 30 chars"},
      "cta_type":{"type":"string","enum":["WHATSAPP_MESSAGE","SIGN_UP","GET_QUOTE","BOOK_NOW","LEARN_MORE","SHOP_NOW","CONTACT_US","CALL_NOW"]}}}},
  "lead_form":{"type":["object","null"],"additionalProperties":false,
    "required":["intro_headline_he","intro_text_he","thank_you_title_he","thank_you_body_he"],
    "properties":{
      "intro_headline_he":{"type":"string","description":"Max 60 chars"},
      "intro_text_he":{"type":"string","description":"Max 200 chars"},
      "thank_you_title_he":{"type":"string","description":"Max 60 chars"},
      "thank_you_body_he":{"type":"string","description":"Max 200 chars"}}}}}
```

### 18.2 `ads.insight_explain.v1` — "מה זה אומר?"

**System:**

```text
אתם מסבירים לבעלי עסקים קטנים, בעברית פשוטה, מה קרה בקמפיין שלהם בפייסבוק ובאינסטגרם. אתם מקבלים מספרים שכבר חושבו ועוצבו, ומחזירים 2 עד 4 משפטים קצרים ועד שתי המלצות.

כללים:
1. משתמשים רק במספרים שמופיעים ב-<numbers>, בדיוק כמו שהם כתובים שם, כולל ₪ ופסיקים. לא מחשבים מספרים חדשים, לא מעגלים ולא כותבים אחוזים שלא מופיעים.
2. השמות הקבועים: "כמה הוצאתם", "כמה אנשים ראו", "פניות" (או המילה שב-<result_noun>), "כמה עלתה כל פנייה", "עצרו לצפות", "נשארו עד הסוף". בלי ראשי תיבות ובלי מונחים באנגלית.
3. לא מבטיחים ולא חוזים: לא "תקבלו", לא "בטוח", לא "בשבוע הבא יהיו". אפשר "כדאי לשקול", "נראה ש…", "עדיין מוקדם לדעת".
4. אין השוואה לעסקים אחרים, לממוצע בתחום או ל"נורמה".
5. כש-<sample_ready> הוא false: המשפט השני מסביר שמטא עדיין לומדת למי להראות את המודעות, ויש המלצה אחת בלבד: wait_more_data.
6. recommendations: עד 2, רק מתוך <allowed_actions>. לכל אחת reason_he של משפט אחד שמסביר למה לפי המספרים. variant_key רק כשההמלצה היא על מודעה מסוימת, אחרת null.
7. כש-<mode> הוא weekly: המשפט הראשון מסכם את השבוע מול השבוע הקודם לפי <deltas>.
8. numbers_used: כל מחרוזת מספר שכתבתם, בדיוק כמו בטקסט.
9. ברבים או ניטרלי, בלי סימני קריאה.
```

```ts
buildUser: (i) => [
  jsonTag("mode", i.mode), jsonTag("goal", i.goal), tag("result_noun", i.resultNounHe), jsonTag("sample_ready", i.sampleReady),
  jsonTag("numbers", i.f),                                   // pre-formatted strings only: {"spend":"₪412","reach":"3,120","results":"14","cpr":"₪29.40",…}
  jsonTag("variants", i.variants.map((v) => ({ key: v.key, hook_he: sanitizeForPrompt(v.hookTextHe, 160), hook_rate: v.hookRate, hold_rate: v.holdRate,
    results: v.results, cpr: v.cpr, status: v.status }))),
  jsonTag("deltas", i.deltas), jsonTag("allowed_actions", i.allowedActions),   // computed by lib/meta/insights.ts, never by the model
  "הסבירו לפי הסכמה insight_explain_v1.",
].join("\n\n"),
validate: (o, i) => [...numbersSubset(o, i.f), ...actionsSubset(o, i.allowedActions), ...(i.sampleReady ? [] : onlyWait(o)), ...noPromises(o), ...lintHe(o)],
```

`allowedActions`: ‏`wait_more_data` תמיד; ‏`boost_winner` ו-`new_variants_from_winner` רק כשיש מנצח; ‏`fix_rejected_ad` רק כשיש מודעה שנדחתה; ‏`extend_end_date` רק כשהסיום בעוד יומיים או פחות; ‏`reply_to_whatsapp_fast` רק במטרת וואטסאפ; ‏`check_lead_form` רק בטופס לידים; ‏`raise_budget_20` רק אחרי המדגם ובלי תקרה שנוצלה; ‏`pause_ad` רק כשעלות הפנייה של מודעה גבוהה מפי 2 מהחציון. אף פרט של ליד לא נכנס — רק ספירות.

`lib/ai/schemas/json/insight_explain_v1.json`:

```json
{"type":"object","additionalProperties":false,"required":["mode","sentences_he","recommendations","numbers_used"],
 "properties":{
  "mode":{"type":"string","enum":["campaign","weekly"]},
  "sentences_he":{"type":"array","description":"2-4 short Hebrew sentences, max 160 chars each","items":{"type":"string"}},
  "recommendations":{"type":"array","description":"0-2 items from allowed_actions","items":{"type":"object","additionalProperties":false,
    "required":["action","variant_key","reason_he"],
    "properties":{
      "action":{"type":"string","enum":["wait_more_data","raise_budget_20","boost_winner","pause_ad","new_variants_from_winner","fix_rejected_ad","extend_end_date","reply_to_whatsapp_fast","check_lead_form"]},
      "variant_key":{"type":["string","null"],"enum":["A","B","C",null]},
      "reason_he":{"type":"string","description":"One sentence, max 140 chars"}}}},
  "numbers_used":{"type":"array","description":"Every number string used, verbatim","items":{"type":"string"}}}}
```

### 18.3 `moderation.ad.v1` — בדיקת מדיניות למודעה

**מתי רצה:** ב-C6 וב-C8 על כל הטקסטים (ראשי, כותרת, תיאור, ההוק, הטקסט שעל המסך, טקסטי הטופס), וב-LP6 על תוכן דף העסק. בדיקה דטרמיניסטית קודמת (`quickPolicyCheck` + רשימת המאפיינים האישיים) עוצרת מקרים ברורים בלי מודל. כשל טכני חוסם עם `PROVIDER_UNAVAILABLE` — לא מאשרים בעיוורון.

**System** (עם `sys.hebrew_style.v1#core`):

```text
אתם בודקים מודעות לפני שהן נשלחות לבדיקה של מטא, לפי מדיניות הפרסום של מטא ולפי חוק הגנת הצרכן בישראל. אתם מקבלים את הטקסטים של המודעות, ולפעמים גם את ההוק, את הטקסט שעל המסך ואת טקסטי הטופס, ומחזירים רשימת בעיות.

סמנו בעיה בכל אחד מהמקרים, עם code, severity, השדה, ציטוט מדויק קצר ותיקון בעברית:
- personal_attributes (block): פנייה או רמיזה למאפיין אישי של הצופה — בריאות גופנית או נפשית, משקל, גיל, מצב כלכלי או חובות, דת, מוצא, נטייה מינית, מצב משפחתי, רישום פלילי. "סובלים מכאבי גב?" אסור; "טיפולי גב בתל אביב" מותר.
- guaranteed_results (block): הבטחת תוצאה, החלמה, רווח או זכייה, "מובטח".
- misleading_claim (block): טענה או מספר שאי אפשר לאמת מתוך <facts>, "הכי זול" או "הכי טוב" בלי הוכחה.
- invented_price (block): מחיר, הנחה או מבצע שלא מופיעים ב-<facts>.
- before_after (warn; block כשהנישה ב-<niche> רפואית או אסתטית): לפני ואחרי של גוף, עור, משקל או בריאות.
- health_body_image (warn): מסר שמבייש מראה או גוף.
- fake_urgency (block): "נשארו X מקומות", "רק היום", "עד חצות" בלי עובדה ב-<facts>.
- deceptive_ui (block): טקסט שמחקה התראה, הודעת מערכת, כפתור סגירה או שיחה נכנסת.
- prohibited_product (block): נשק, סמים, הימורים, טבק וסיגריות אלקטרוניות, תוספים עם טענה רפואית, הלוואה "בלי בדיקה".
- restricted_product (warn): אלכוהול, היכרויות, מטבעות קריפטו, ייעוץ פיננסי — מותר רק בתנאים של מטא.
- political_social (block): בחירות, מפלגות, מועמדים, חקיקה, מחלוקת חברתית או ביטחונית, מלחמה, חטופים.
- profanity (warn): קללות או ביטויים גסים.
- third_party_ip (warn): מותג של אחרים, שם של אדם מוכר, שם של שיר.
- other (warn): כל דבר אחר שמטא צפויה לדחות.

איך מחליטים:
1. political הוא true כשיש בעיה מסוג political_social. allowed הוא false כשיש בעיה אחת לפחות בחומרת block.
2. special_category: housing, employment, credit או financial_products כשהמודעה עוסקת בהם, אחרת none. זה לא חוסם.
3. quote_he הוא ציטוט מדויק מהטקסט, עד 80 תווים. fix_he הוא משפט אחד ברבים שמציע ניסוח מותר.
4. בספק בנושא פוליטי — block. בספק בכל נושא אחר — warn.
5. summary_he: משפט אחד כש-allowed הוא false, אחרת null.
```

```ts
buildUser: (i) => [
  jsonTag("niche", { slug: i.nicheSlug, compliance_flag: i.complianceFlag }), jsonTag("facts", i.confirmedFacts), jsonTag("election_mode", i.electionMode),
  jsonTag("ads", i.ads.map((a) => ({ key: a.key, primary_text: sanitizeForPrompt(a.primaryTextHe, 600), headline: sanitizeForPrompt(a.headlineHe, 80),
    description: a.descriptionHe ? sanitizeForPrompt(a.descriptionHe, 60) : null, hook_he: sanitizeForPrompt(a.hookTextHe, 160),
    onscreen_he: a.onscreen.map((t) => sanitizeForPrompt(t, 80)) }))),
  jsonTag("lead_form", i.leadForm ?? null),
  "בדקו לפי המדיניות והחזירו JSON לפי הסכמה ad_policy_check_v1.",
].join("\n\n"),
```

`lib/ai/schemas/json/ad_policy_check_v1.json`:

```json
{"type":"object","additionalProperties":false,"required":["allowed","political","special_category","issues","summary_he"],
 "properties":{
  "allowed":{"type":"boolean"},
  "political":{"type":"boolean"},
  "special_category":{"type":"string","enum":["none","housing","employment","credit","financial_products"]},
  "issues":{"type":"array","items":{"type":"object","additionalProperties":false,
    "required":["code","severity","field","variant_key","quote_he","fix_he"],
    "properties":{
      "code":{"type":"string","enum":["personal_attributes","guaranteed_results","misleading_claim","invented_price","before_after","health_body_image","fake_urgency","deceptive_ui","prohibited_product","restricted_product","political_social","profanity","third_party_ip","other"]},
      "severity":{"type":"string","enum":["block","warn"]},
      "field":{"type":"string","enum":["primary_text","headline","description","hook","onscreen","lead_form","landing"]},
      "variant_key":{"type":["string","null"],"enum":["A","B","C",null]},
      "quote_he":{"type":"string","description":"Exact excerpt, max 80 chars"},
      "fix_he":{"type":"string","description":"One sentence, max 160 chars"}}}},
  "summary_he":{"type":["string","null"]}}}
```

התוצאה ← `allowed = false` ← `MODERATION_BLOCKED {reason_he: summary_he, categories}`; ‏`political` ← גם `AD_NOT_ELIGIBLE {reason: "political"}`, ובתקופת בחירות `ELECTION_POLICY_BLOCKED`; אזהרות מוצגות ב-`PolicyCheckPanel`.

### 18.4 `post.caption.v2` — טקסט לפוסט (מחליף את v1 בנתיב הקיים)

**System:**

```text
אתם מנהלי הסושיאל של העסק. אתם כותבים את הטקסט שיעלה עם הסרטון לרשת.

כללים:
1. first_line_cta_he: השורה הראשונה של הפוסט, עד 90 תווים — הנעה אחת לפעולה, זהה לזו של הסרטון, עם הערוץ ("שלחו לנו הודעה בוואטסאפ, ונשלח את המחירון"). היא שונה מההוק של הסרטון.
2. post_caption_he: מתחיל בדיוק ב-first_line_cta_he, ואחריו פסקה אחת או שתיים קצרות על מה שרואים בסרטון ומה מקבלים. עד 600 תווים בסך הכול.
3. אותה פנייה ואותה רמת שפה של הסרטון. בלי ביטויים אסורים, בלי המצאות ובלי מספרים שלא מופיעים ב-<facts>.
4. בלי אימוג׳ים, בלי @, בלי קישורים ובלי האשטגים בתוך הטקסט. מספר טלפון רק אם הוא ב-<contact>.
5. hashtags_he: ב-reels וב-facebook — 3 עד 5; בשאר הפלטפורמות 3 עד 8. כל אחד מתחיל ב-#, בלי רווחים (קו תחתון במקום רווח), בלי גרש, גרשיים, מקף או ניקוד. שילוב של הנישה, העיר והשירות; לכל היותר שניים באנגלית; בלי האשטגים כלליים ובלי פוליטיים.
6. התאמה ל-<platform>: באינסטגרם שורות קצרות; בפייסבוק מותר משפט הסבר נוסף; בלינקדאין בלי סלנג.
```

```ts
buildUser: (i) => [
  jsonTag("platform", i.platform), jsonTag("script", pick(i.script, ["hook", "beats", "cta", "post_caption_he"])),
  jsonTag("project", { audience_gender: i.audienceGender, register: i.register }), jsonTag("facts", i.confirmedFacts),
  jsonTag("contact", availableContactFields(i.business)), jsonTag("city", i.business.city ?? null),
].join("\n\n"),
validate: (o, i) => [...startsWith(o.post_caption_he, o.first_line_cta_he), ...hashtagCount(o, i.platform), ...hashtagShape(o), ...lintHe(o)],
```

`lib/ai/schemas/json/post_caption_v2.json`:

```json
{"type":"object","additionalProperties":false,"required":["post_caption_he","hashtags_he","first_line_cta_he"],
 "properties":{
  "post_caption_he":{"type":"string","description":"Starts with first_line_cta_he; max 600 chars"},
  "hashtags_he":{"type":"array","description":"3-5 for reels/facebook, 3-8 otherwise; no spaces, geresh, gershayim, hyphen or niqqud","items":{"type":"string"}},
  "first_line_cta_he":{"type":"string","description":"One CTA with its channel, max 90 chars"}}}
```

### 18.5 `landing.copy.v1` — דף העסק

**System:**

```text
אתם כותבים דף נחיתה של עמוד אחד לעסק קטן בישראל שאין לו אתר. אנשים מגיעים לדף אחרי שלחצו על מודעה או על קישור, והדף צריך להסביר בתוך כמה שניות מה העסק עושה, איפה, ואיך פונים אליו.

כללים:
1. hero.h1_he: עד 60 תווים — מה העסק נותן ולמי או איפה ("מספרה לגברים בלב רמת גן"). בלי שם העסק בתחילת הכותרת ובלי סימן קריאה.
2. hero.subline_he: משפט אחד עד 140 תווים עם היתרון המרכזי מתוך <business> או <niche_hints>.
3. benefits_he: בדיוק 3, כל אחד עד 80 תווים, מוחשיים ושונים זה מזה ("תור בוואטסאפ בלי לחכות על הקו"). בלי "שירות מקצועי ואדיב" ובלי סופרלטיבים.
4. services: רק מתוך <business.services>, עד 8, עם description_he קצר או null. price_from_ils רק כשיש מחיר ב-<facts>, אחרת null.
5. faq: 3 עד 5 שאלות שלקוחות באמת שואלים בנישה (<niche_hints>), עם תשובות שמבוססות רק על <business> ועל <facts>. אין תשובה בעובדות — לא כותבים את השאלה.
6. lead_form: submit_label_he עד 24 תווים ("שלחו לי פרטים"), thank_you_he עד 140 תווים שאומר מה יקרה עכשיו, בלי זמן מובטח. fields תמיד כוללים full_name ו-phone; email, city או message רק כשהם מתאימים לנישה.
7. hours, location, contact, legal: מעתיקים מ-<business> ומ-<facts> כמו שהם, או null. לא ממציאים כתובת, שעות, טלפון או מזהה.
8. seo.title_he עד 60 תווים, seo.description_he עד 155.
9. אין ביקורות, דירוגים, המלצות של לקוחות, מספר לקוחות או "מאז שנת…" אלא אם הם ב-<facts>.
10. פנייה ברבים, רמת שפה לפי <register>.
11. כשיש <previous> ו-<keep>, המקטעים שב-<keep> מוחזרים בדיוק כמו שהם.
```

```ts
buildUser: (i) => [
  jsonTag("business", { name: i.bp.business_name, city: i.bp.city, area: i.bp.area, address: i.bp.address, phone: i.bp.phone, whatsapp: i.bp.whatsapp,
    services: i.bp.services, usp_he: i.bp.usp_he, audience_he: i.bp.audience_he }),
  tag("description", sanitizeForPrompt(i.bp.description_he ?? "", 1500)), jsonTag("facts", i.confirmedFacts),
  jsonTag("niche_hints", { niche: i.nicheSlug, faq_topics: i.nicheExtras.faq_topics, buying_triggers: i.nicheExtras.buying_triggers }),
  jsonTag("register", i.register), jsonTag("video", i.video ? { hook_he: sanitizeForPrompt(i.video.hookTextHe, 160) } : null),
  jsonTag("previous", i.previous ?? null), jsonTag("keep", i.keep ?? []),
  "כתבו את הדף לפי הסכמה landing_page_content_v1.",
].join("\n\n"),
validate: (o, i) => [...overwriteFacts(o, i) /* auto-fix: hours, location, contact, legal, prices from DB */, ...servicesSubset(o, i.bp.services),
  ...noInventedClaims(o, i.confirmedFacts), ...lintHe(o)],
```

ה-JSON Schema הקפדני (`landing_page_content_v1.json`) נגזר מ-`LandingPageContentV1` (§14.2) ב-`toStrictJsonSchema()` ונשמר כ-snapshot; ‏`hero.video_asset_id` ו-`poster_asset_id` מוחזרים כ-null מהמודל ומתמלאים בשרת.

### 18.6 `ads.health_check.v1` — דוח "בדיקת דופק"

**System:**

```text
אתם יועצי פרסום שמסבירים לבעל עסק, בעברית פשוטה, מה מצאה בדיקה אוטומטית של חשבון המודעות שלו בפייסבוק ובאינסטגרם. הבדיקות כבר רצו; אתם רק מנסחים.

כללים:
1. מסתמכים רק על <checks> ועל <numbers>. כל מספר בטקסט מופיע שם בדיוק כמו שהוא. אין השוואה לעסקים אחרים או לממוצע בשוק.
2. headline_he: עד 90 תווים, המסקנה העיקרית ("רוב התקציב הלך למודעות שלא הביאו פניות").
3. summary_he: עד 300 תווים, שניים או שלושה משפטים.
4. money_burn_he: עד 3 שורות, רק לבדיקות עם wasted_ils, מהגדולה לקטנה: מה, כמה ולמה.
5. fixes: עד 5, לפי החומרה (high, אחר כך medium, אחר כך low), רק לבדיקות במצב issue. title_he עד 60 תווים, why_he עד 200, how_he עד 240 עם צעד מעשי אחד. action רק מתוך allowed_actions של אותה בדיקה, ואם אין — none.
6. בלי מונחים באנגלית: "קבוצת מודעות", "כמה לחצו", "כמה פעמים כל אדם ראה".
7. בלי הבטחות ("תחסכו", "תכפילו"). אפשר "כדאי", "אפשר לבדוק".
8. כשאין בעיות: headline_he חיובי וזהיר, ו-fixes ריק.
9. numbers_used: כל מחרוזת מספר שכתבתם.
```

```ts
buildUser: (i) => [
  jsonTag("period", { from: i.periodStart, to: i.periodEnd }), jsonTag("score", i.score),
  jsonTag("checks", i.results.map((r) => ({ key: r.key, status: r.status, severity: r.severity, wasted_ils: r.wastedFormatted, evidence: r.evidenceFormatted,
    allowed_actions: HEALTH_ACTIONS[r.key] }))),
  jsonTag("numbers", i.formattedNumbers),
  "נסחו את הדוח לפי הסכמה health_check_report_v1.",
].join("\n\n"),
validate: (o, i) => [...numbersSubset(o, i.formattedNumbers), ...fixesOnlyForIssues(o, i.results), ...actionsAllowed(o), ...lintHe(o)],
```

`lib/ai/schemas/json/health_check_report_v1.json`:

```json
{"type":"object","additionalProperties":false,"required":["version","headline_he","summary_he","money_burn_he","fixes","numbers_used"],
 "properties":{
  "version":{"type":"integer","enum":[1]},
  "headline_he":{"type":"string","description":"Max 90 chars"},
  "summary_he":{"type":"string","description":"Max 300 chars"},
  "money_burn_he":{"type":"array","description":"0-3 lines","items":{"type":"string"}},
  "fixes":{"type":"array","description":"0-5, ordered by severity","items":{"type":"object","additionalProperties":false,
    "required":["check_key","title_he","why_he","how_he","action"],
    "properties":{
      "check_key":{"type":"string","enum":["zero_result_spend","high_frequency","low_ctr","creative_fatigue","no_video_creatives","fragmented_budget","advantage_audience_off","learning_limited","billing_issues","no_reels_placements"]},
      "title_he":{"type":"string","description":"Max 60 chars"},
      "why_he":{"type":"string","description":"Max 200 chars"},
      "how_he":{"type":"string","description":"Max 240 chars, one practical step"},
      "action":{"type":"string","enum":["create_campaign_from_video","open_builder_whatsapp","new_video_from_trend","enable_advantage_audience","consolidate_budget","fix_billing","add_reels_placements","none"]}}}},
  "numbers_used":{"type":"array","items":{"type":"string"}}}}
```

### 18.7 `plan.month.v1` — "תוכנית 30 יום"

**System:**

```text
אתם מתכננים לעסק קטן בישראל חודש של תוכן ופרסום ברשתות. אתם מקבלים את העסק, את המטרה, את החודש ורשימות סגורות של מועמדים — הוקים, טרנדים ועונות — ומחזירים תוכנית מעשית.

כללים:
1. items: בין 10 ל-14 פריטי תוכן (video, trend, post), ועוד עד 2 פריטי campaign רק כש-<meta_ads_available> הוא true. בערך 3 פריטי תוכן בשבוע, ולא יותר מפריט אחד ביום.
2. planned_for: תאריך בתוך <month>, לא ב-<quiet_days> ולא לפני <today>. פריט של עונה מתוכנן לפני העונה, לפי promo_lead_days שב-<seasons>.
3. video: hook_id מתוך <hooks>. trend: trend_slug מתוך <trends>. post: פרסום של סרטון שתוכנן קודם, ו-source_index הוא המיקום שלו ב-items (מאפס). campaign: daily_budget_ils מתוך <budget_presets> ולא מעל <budget_comfort_ils>, ו-source_index מצביע לסרטון שהקמפיין יקדם.
4. מגוון: לפחות 2 טרנדים כשיש ב-<trends>, לפחות 3 הוקים שונים, ולפחות פריט אחד לכל עונה ב-<seasons> שמתאימה לנישה.
5. title_he: עד 60 תווים, ברור מה עושים ("רילס 'לפני ואחרי' של תספורת"). why_he: עד 140 תווים, למה עכשיו או למה זה מתאים ל-<goal>.
6. summary_he: עד 240 תווים, הרעיון של החודש במשפט או שניים.
7. כש-<election_mode> הוא true — בלי שום נושא פוליטי ובלי רמז לבחירות.
8. בלי הבטחות לתוצאה ובלי מספרים שלא ניתנו לכם.
```

```ts
buildUser: (i) => [
  jsonTag("month", i.month), jsonTag("today", i.todayIL), jsonTag("goal", i.inputs.goal), jsonTag("area", i.inputs.area),
  jsonTag("business", { name: i.bp.business_name, niche: i.nicheSlug, city: i.bp.city, services: i.bp.services.slice(0, 5) }),
  jsonTag("hooks", i.hooks.map((h) => ({ id: h.id, text_he: h.text_he, type: h.hook_type_slug }))),        // top 30 for the niche
  jsonTag("trends", i.trends.map((t) => ({ slug: t.slug, name_he: t.name_he, lifecycle: t.lifecycle, ad_safety: t.ad_safety }))),
  jsonTag("seasons", i.seasons.map((s) => ({ slug: s.slug, name_he: s.name_he, starts_on: s.starts_on, promo_lead_days: s.promo_lead_days }))),
  jsonTag("quiet_days", i.quietDays), jsonTag("election_mode", i.electionMode),
  jsonTag("meta_ads_available", i.metaAdsAvailable), jsonTag("budget_presets", i.presets), jsonTag("budget_comfort_ils", i.inputs.budgetComfortIls),
  "בנו את התוכנית לפי הסכמה monthly_plan_v1.",
].join("\n\n"),
validate: (o, i) => [...datesInMonth(o, i), ...notOnQuietDays(o, i.quietDays), ...idsFromCandidates(o, i), ...counts(o, { content: [10, 14], campaigns: i.metaAdsAvailable ? 2 : 0 }),
  ...budgetsFromPresets(o, i), ...sourceIndexValid(o), ...lintHe(o)],
```

`lib/ai/schemas/json/monthly_plan_v1.json`:

```json
{"type":"object","additionalProperties":false,"required":["version","month","summary_he","items"],
 "properties":{
  "version":{"type":"integer","enum":[1]},
  "month":{"type":"string","description":"YYYY-MM"},
  "summary_he":{"type":"string","description":"Max 240 chars"},
  "items":{"type":"array","description":"10-14 content items plus 0-2 campaign items","items":{"type":"object","additionalProperties":false,
    "required":["planned_for","kind","title_he","why_he","hook_id","trend_slug","season_slug","source_index","daily_budget_ils"],
    "properties":{
      "planned_for":{"type":"string","description":"YYYY-MM-DD inside month"},
      "kind":{"type":"string","enum":["video","trend","campaign","post"]},
      "title_he":{"type":"string","description":"Max 60 chars"},
      "why_he":{"type":"string","description":"Max 140 chars"},
      "hook_id":{"type":["string","null"]},
      "trend_slug":{"type":["string","null"]},
      "season_slug":{"type":["string","null"]},
      "source_index":{"type":["integer","null"],"description":"Index in items of the video a post or campaign uses"},
      "daily_budget_ils":{"type":["number","null"],"description":"Campaign items only, from budget_presets"}}}}}}
```

### קריטריוני קבלה
- [ ] snapshot: ה-`system` של שבע התבניות לא מכיל `${` או `{{`, וכל אחת רשומה ב-`PromptId` (חלק 05 §8.1).
- [ ] בדיקת חוזה: שבעת קובצי ה-JSON זהים לסכמות ה-Zod (כולל ה-snapshot הנגזר של `landing_page_content_v1`), ונכשלת כשמוסיפים שדה לאחד בלבד.
- [ ] evals (חלק 05 §23): 20 קלטים לכל תבנית; 0 מספרים מומצאים ב-`ads.copy.v1`, ‏`ads.insight_explain.v1`, ‏`ads.health_check.v1` ו-`landing.copy.v1`; ‏`moderation.ad.v1` חוסם את "סובלים מכאבי גב?" ומאשר את "טיפולי גב בתל אביב".
- [ ] `post.caption.v2` ל-`reels` מחזיר עד 5 האשטגים בכל 20 הקלטים, ו-`post_caption_he` מתחיל ב-`first_line_cta_he`.
- [ ] `plan.month.v1` לא מחזיר `hook_id` או `trend_slug` שלא היו במועמדים (ולידציה; כשל ← fallback).

---

## §19. מיקרו-קופי של שאר המסכים ומסכי האדמין

**מרחבי השמות שהחלק הזה כותב ב-`messages/he.json`:** `app.integrations.meta.*` (§3.8), ‏`app.campaigns.*` (§9.7 ולמטה), ‏`app.leads.*`, ‏`app.publish.*`, ‏`app.landing.*`, ‏`app.plan.*`, ‏`app.health.*`, ‏`admin.meta.*`. קופי השגיאות של חמשת הקודים החדשים ושל מפתחות `PLAN_LIMIT` החדשים נמצא ב-`errors.*` של חלק 03. משתני כסף (`{spend}`, ‏`{cap}`, ‏`{price}`) מגיעים כבר מעוצבים ב-`formatIls` — בלי ₪ בקובץ. כל ספירה ב-ICU plural (R24).

**מסכי האדמין** (מנהלי פלטפורמה עם MFA, דרך AM1–AM3 של חלק 04 §24.1; לעולם לא טוקנים): **`/admin/meta`** — ספירות לפי סטטוס חיבור, חיבורים שנכשלו בבדיקה האחרונה, השגיאות האחרונות, ו**"בדיקה עכשיו"** לחיבור (AM2, ‏`audit_logs` ‏`meta.admin_health_check`); **`/admin/meta/campaigns`** — מעקב: בבדיקה יותר מ-24 שעות, סיבות דחייה (מקובצות), שגיאות הכנה, המוציאים הגדולים, ו-`issues_info.advantage`; אריחים בדשבורד האדמין: חיבורים, קמפיינים פעילים, לידים ביום, כשלי פרסום.

```json
{
  "app": {
    "campaigns": {
      "title": "קמפיינים",
      "range": { "7d": "7 ימים", "14d": "14 ימים", "30d": "30 יום", "lifetime": "מההתחלה" },
      "kpi": {
        "spend": "כמה הוצאתם", "reach": "כמה אנשים ראו", "results": "כמה פניות", "cpr": "כמה עלתה כל פנייה",
        "result_labels": { "whatsapp": "פניות בוואטסאפ", "leads": "לידים", "visits": "כניסות לאתר", "views_3s": "צפו לפחות 3 שניות" },
        "cost_per_1000": "עלות ל-1,000 אנשים",
        "what_is": {
          "spend": "הסכום שמטא חייבה בתקופה, לפי חשבון המודעות שלכם",
          "reach": "אנשים שונים שראו את המודעות לפחות פעם אחת",
          "results": "מטא סופרת פנייה כשמישהו התחיל שיחה, השאיר פרטים או נכנס לאתר אחרי שראה מודעה",
          "cpr": "ההוצאה חלקי מספר הפניות. כשיש מעט פניות, המספר הזה עוד לא יציב"
        },
        "delta_up": "עלייה של {pct} מהתקופה הקודמת",
        "delta_down": "ירידה של {pct} מהתקופה הקודמת",
        "none": "—"
      },
      "actions_title": "מה כדאי לעשות עכשיו",
      "actions": {
        "fix_rejected_ad": "{count, plural, one {מודעה אחת נדחתה} two {שתי מודעות נדחו} other {# מודעות נדחו}} ואפשר לתקן",
        "boost_winner": "יש הוק מנצח שאפשר להגביר",
        "reconnect": "צריך לחבר מחדש את פייסבוק ואינסטגרם",
        "leads_waiting": "{count, plural, one {ליד אחד מחכה} two {שני לידים מחכים} other {# לידים מחכים}} לתשובה",
        "cap_warning": "התקרה החודשית של התוכנית כמעט נוצלה",
        "quiet_day": "היום יום שקט. כדאי לשקול להשהות את הקמפיין"
      },
      "empty": {
        "title": "עוד אין קמפיינים",
        "body": "{g, select, female {בחרי סרטון מוכן, והקמפיין יהיה מוכן לבדיקה של מטא בכמה דקות.} male {בחר סרטון מוכן, והקמפיין יהיה מוכן לבדיקה של מטא בכמה דקות.} other {בחרו סרטון מוכן, והקמפיין יהיה מוכן לבדיקה של מטא בכמה דקות.}}",
        "cta": "{g, select, female {העלי לקמפיין את הסרטון האחרון} male {העלה לקמפיין את הסרטון האחרון} other {העלו לקמפיין את הסרטון האחרון}}",
        "secondary": "לכל הפרויקטים"
      },
      "cap_meter": {
        "label": "הוצאה מנוהלת החודש",
        "value": "{used} מתוך {cap}",
        "warn": "נוצלו {pct} מהתקרה החודשית של התוכנית.",
        "reached": "התקרה החודשית של התוכנית נוצלה. המודעות ממשיכות לרוץ. {days, plural, one {בעוד יום אחד} two {בעוד יומיים} other {בעוד # ימים}} לא יהיה אפשר להשיק, לחדש או להגדיל תקציב עד החודש הבא.",
        "grace_over": "התקרה החודשית של התוכנית נוצלה. המודעות ממשיכות לרוץ, אבל השקות, חידושים והגדלות תקציב חסומים עד החודש הבא.",
        "upgrade": "שדרוג התוכנית"
      },
      "status": {
        "draft": "טיוטה", "preparing": "בהכנה", "ready": "מוכן לפרסום", "in_review": "בבדיקה של מטא", "active": "פעיל", "paused": "מושהה",
        "with_issues": "דורש טיפול", "rejected": "נדחה", "completed": "הסתיים", "error": "שגיאה", "archived": "בארכיון"
      },
      "timeline": ["נוצר", "נשלח לבדיקה של מטא", "אושר", "פעיל"],
      "report": {
        "pause": "השהיה", "resume": "המשך", "budget": "תקציב", "duplicate": "שכפול", "end": "סיום",
        "explain_title": "מה זה אומר?",
        "explain_loading": "מסבירים את המספרים…",
        "hooks_title": "השוואת הוקים",
        "hook_rate": "עצרו לצפות", "hold_rate": "נשארו עד הסוף", "impressions": "חשיפות", "winner": "המנצח",
        "too_early": "עדיין מוקדם לקבוע מנצח",
        "boost_winner": "{g, select, female {הגבירי את המנצח} male {הגבר את המנצח} other {הגבירו את המנצח}}",
        "boost_dialog_title": "להגביר את ההוק המנצח?",
        "boost_dialog_body": "שתי המודעות האחרות יושהו, וכל התקציב יעבור למודעה שמביאה פניות הכי זולות.",
        "boost_raise": { "0": "בלי שינוי תקציב", "10": "העלאה של 10%", "20": "העלאה של 20%" },
        "more_variants": "צרו עוד 3 גרסאות מהמנצח",
        "chart_title": "הוצאה ופניות לפי יום",
        "chart_table": "הנתונים בטבלה",
        "freshness": "עודכן לפני {minutes, plural, one {דקה} two {שתי דקות} other {# דקות}}",
        "refresh": "רענון",
        "restatement": "נתוני מטא יכולים להתעדכן עד 28 יום אחורה",
        "tabs": { "rules": "כללים", "log": "יומן שינויים", "details": "פרטים" },
        "budget_dialog_title": "שינוי התקציב היומי",
        "budget_learning": "שינוי גדול מאפס חלק מהלמידה של מטא. מומלץ לשנות עד 20% בכל פעם",
        "budget_left": "{n, plural, =0 {אין עוד שינויי תקציב בשעה הקרובה} one {נשאר שינוי תקציב אחד בשעה הקרובה} two {נשארו שני שינויי תקציב בשעה הקרובה} other {נשארו # שינויי תקציב בשעה הקרובה}}",
        "end_dialog_title": "לסיים את הקמפיין?",
        "end_dialog_body": "המודעות יושהו במטא והקמפיין יסומן כהסתיים. אפשר תמיד לשכפל אותו לקמפיין חדש.",
        "rejected_card_title": "מטא לא אישרה את מודעה {key}",
        "billing_missing": "חסר אמצעי תשלום בחשבון המודעות",
        "quiet_day_banner": "היום יום שקט. כדאי לשקול להשהות את הקמפיין"
      },
      "rules": {
        "title": "כללים אוטומטיים",
        "usage": "{used} מתוך {max} כללים פעילים",
        "pause_expensive_ad": "השהיית מודעה יקרה",
        "pause_expensive_ad_hint": "כשמודעה עולה פי 2 מהאחרות אחרי 3 ימים. המודעה הפעילה האחרונה לא מושהית לעולם.",
        "boost_winner": "הגברת המנצח",
        "boost_winner_hint": "העלאה של 20% לתקציב כשמודעה זולה במיוחד. לכל היותר פעם ב-3 ימים, ולא מעל התקרות.",
        "alert_no_results": "התראה כשאין פניות",
        "alert_no_results_hint": "אחרי 48 שעות של הוצאה בלי אף פנייה",
        "alert_fatigue": "התראה על סרטון שנשחק",
        "alert_fatigue_hint": "כשאותם אנשים רואים את הסרטון יותר מדי פעמים",
        "monthly_cap_stop": "תקרה חודשית לכל הקמפיינים",
        "monthly_cap_stop_hint": "כשההוצאה בחודש מגיעה לסכום שתקבעו, כל הקמפיינים מושהים",
        "workspace_scope": "לכל הקמפיינים",
        "fatigue_notice": "הגיע הזמן לסרטון חדש",
        "fatigue_action": "גרסה חדשה מאותו טרנד"
      }
    },
    "leads": {
      "title": "לידים",
      "filters": { "status": "סטטוס", "campaign": "קמפיין", "source": "מקור", "date": "תאריך" },
      "source": { "meta_form": "טופס במטא", "landing_page": "דף העסק", "whatsapp": "וואטסאפ", "manual": "ידני" },
      "status": { "new": "חדש", "contacted": "יצרנו קשר", "qualified": "רלוונטי", "won": "נסגר", "lost": "לא רלוונטי", "spam": "ספאם" },
      "call": "התקשרו", "whatsapp": "וואטסאפ",
      "whatsapp_prefill": "היי {firstName}, כאן {businessName}. קיבלנו את הפנייה שלכם ונשמח לעזור.",
      "test_badge": "ליד בדיקה",
      "notes": "הערות", "assignee": "אחראי", "bulk_status": "שינוי סטטוס · {count, plural, one {ליד אחד} two {שני לידים} other {# לידים}}",
      "export": "ייצוא לקובץ",
      "delete": "מחיקה",
      "delete_dialog": "למחוק את הליד? הוא יימחק מהחשבון ב{{BRAND_NAME}}. מטא שומרת עותק משלה של לידים מטפסים כ-90 יום.",
      "locked": "סטטוסים, הערות וייצוא זמינים בתוכניות בתשלום. הלידים עצמם, החיוג והוואטסאפ זמינים תמיד.",
      "empty": { "title": "עוד אין לידים", "body": "כשמישהו ישאיר פרטים בטופס של מטא או בדף העסק, הליד יופיע כאן מיד." },
      "reminder": "{name} מחכה לתשובה כבר {minutes, plural, one {דקה} two {שתי דקות} other {# דקות}}"
    },
    "publish": {
      "title": "פרסום ותזמון",
      "new": "{g, select, female {פרסמי עכשיו} male {פרסם עכשיו} other {פרסמו עכשיו}}",
      "platforms": { "instagram": "אינסטגרם", "facebook": "פייסבוק" },
      "caption": "הטקסט לפוסט", "hashtags": "האשטגים (עד 5)", "share_to_feed": "להציג גם בפיד", "cover": "תמונת שער",
      "collaborators": "שותפים לפוסט (עד 3)", "location": "מיקום",
      "when": { "now": "עכשיו", "schedule": "בתאריך ושעה" },
      "trial": "Trial Reel: להציג קודם למי שלא עוקב",
      "trial_hint": "ההחלטה אם להציג את הרילס לכל העוקבים נעשית אחר כך באפליקציית אינסטגרם.",
      "ai_notice": "הסרטון כולל תוכן שנוצר ב-AI. מטא עשויה להוסיף לו תווית 'AI info'. בסרטון שנראה מציאותי, המדיניות של מטא מבקשת לסמן את זה.",
      "scheduler_note": "פוסטים שמתוזמנים מכאן לא יופיעו ברשימת התזמונים באפליקציית אינסטגרם",
      "quiet_day_warning": "התאריך הזה הוא יום שקט. לא מתזמנים בו פרסום חדש.",
      "submit_now": "פרסום", "submit_schedule": "תזמון",
      "post_status": { "draft": "טיוטה", "scheduled": "מתוזמן", "uploading": "מעלים", "processing": "בעיבוד", "ready": "מוכן", "published": "פורסם", "failed": "נכשל", "expired": "פג תוקף", "canceled": "בוטל" },
      "retry": "ניסיון חוזר", "cancel": "ביטול התזמון",
      "leaderboard": "הסרטונים שעובדים הכי טוב",
      "leaderboard_boost": "הסרטון הזה הביא הכי הרבה צפיות. להפוך אותו לקמפיין?",
      "boost": "{g, select, female {קדמי את הסרטון הזה} male {קדם את הסרטון הזה} other {קדמו את הסרטון הזה}}",
      "skip_rate_empty": "אין עדיין מספיק צפיות",
      "calendar": { "month": "חודש", "week": "שבוע", "plan_month": "תכנון חודש", "election_note": "תקופת בחירות: בלי תוכן פוליטי" },
      "empty": { "title": "עוד אין פרסומים מכאן", "body": "מפרסמים רילס לפייסבוק ולאינסטגרם עכשיו או בתזמון, ורואים כאן מה עבד." }
    },
    "landing": {
      "title": "דף העסק",
      "create": "יצירת דף העסק · 10 קרדיטים",
      "regenerate": "יצירה מחדש · 10 קרדיטים",
      "status": { "draft": "טיוטה", "published": "מפורסם", "unpublished": "הוסר מפרסום" },
      "address": "כתובת הדף",
      "indexable": "לאפשר לגוגל למצוא את הדף",
      "sections": { "hero": "סרטון פתיחה וכותרת", "benefits": "שלושה יתרונות", "services": "שירותים", "hours": "שעות פתיחה", "location": "מיקום", "contact": "יצירת קשר", "form": "טופס", "faq": "שאלות נפוצות", "legal": "פרטים משפטיים" },
      "price_from": "החל מ-{price}",
      "waze": "ניווט בוויז",
      "publish": "פרסום", "unpublish": "הסרה מפרסום",
      "preview_watermark": "תצוגה מקדימה",
      "paid_only": "דף העסק זמין בתוכניות בתשלום",
      "compare_plans": "השוואת תוכניות",
      "built_with": "נבנה עם {{BRAND_NAME}}",
      "legal_missing": "לפני הפרסום צריך למלא את הפרטים המשפטיים: שם העסק, מספר עוסק או ח״פ, כתובת ומייל לפניות פרטיות.",
      "published_toast": "הדף מפורסם",
      "empty": { "title": "אין לכם אתר? בונים דף עסק בדקה", "body": "דף אחד בעברית עם הסרטון שלכם, השירותים, השעות וכפתור וואטסאפ. אפשר לשלוח אליו קמפיינים." },
      "form": { "privacy_line": "השליחה מעבירה את הפרטים אל {businessName} כדי שיחזרו אליכם. פרטים ב<privacy>מדיניות הפרטיות</privacy>.", "marketing": "מאשרים לקבל עדכונים ומבצעים מאת {businessName}" }
    },
    "plan": {
      "title": "התוכנית שלי",
      "questions": {
        "goal": "מה הכי חשוב החודש?",
        "goal_options": { "more_whatsapp": "יותר פניות בוואטסאפ", "more_leads": "יותר לידים", "more_visits": "יותר כניסות", "awareness": "שיכירו אותנו" },
        "area": "איפה הלקוחות?",
        "area_options": { "neighborhood": "שכונה", "city": "עיר", "region": "אזור", "country": "כל הארץ" },
        "budget": "כמה נוח לכם להוציא על פרסום ביום?",
        "budget_none": "בלי פרסום בתשלום"
      },
      "generate": "בניית התוכנית",
      "generating": "בונים תוכנית לחודש…",
      "kinds": { "video": "סרטון", "trend": "טרנד", "campaign": "קמפיין", "post": "פוסט" },
      "create": "{g, select, female {צרי בקליק} male {צור בקליק} other {צרו בקליק}}",
      "skip": "דילוג", "change_date": "שינוי תאריך",
      "auto": "תוכנית חדשה אוטומטית בתחילת כל חודש",
      "new_plan": "תוכנית חדשה",
      "items_done": "{done} מתוך {total} בוצעו",
      "empty": { "title": "חודש של תוכן, מתוכנן בשבילכם", "body": "שלוש שאלות, ומקבלים לוח של כ-12 סרטונים ופוסטים לפי העונות והטרנדים." }
    },
    "health": {
      "title": "בדיקת דופק",
      "cta": "בדיקת דופק חינם",
      "running": "בודקים את 90 הימים האחרונים בחשבון המודעות…",
      "score": "ציון {score} מתוך 100",
      "score_note": "הערכה לפי הנתונים של החשבון שלכם — לא השוואה לעסקים אחרים",
      "money_burn": "איפה הכסף נשרף",
      "fixes": "מה כדאי לתקן",
      "new_check": "בדיקה חדשה",
      "usage": "{used} מתוך {max, plural, one {בדיקה אחת} two {שתי בדיקות} other {# בדיקות}} החודש",
      "not_enough_data": "בחשבון הזה עוד אין מספיק נתונים לבדיקה. אחרי כמה ימים של קמפיין אפשר לבדוק.",
      "empty": { "title": "עוד לא בדקנו את חשבון המודעות", "body": "בדיקה חינמית של הקמפיינים שכבר רצים: איפה הכסף הולך לאיבוד ומה אפשר לתקן בלחיצה." },
      "actions": { "create_campaign_from_video": "קמפיין חדש מסרטון", "open_builder_whatsapp": "בונה הקמפיינים עם וואטסאפ", "new_video_from_trend": "סרטון חדש מטרנד", "enable_advantage_audience": "איך מפעילים קהל אוטומטי", "consolidate_budget": "איך מאחדים תקציב", "fix_billing": "תיקון אמצעי התשלום", "add_reels_placements": "איך מוסיפים רילס" }
    }
  },
  "admin": {
    "meta": {
      "title": "חיבורי Meta",
      "counts": "{active} פעילים · {needs} צריכים חיבור מחדש · {revoked} מנותקים",
      "failing": "נכשלו בבדיקה האחרונה",
      "check_now": "בדיקה עכשיו",
      "campaigns_title": "מעקב קמפיינים",
      "in_review_long": "בבדיקה יותר מ-24 שעות",
      "rejections": "סיבות דחייה",
      "prepare_errors": "שגיאות הכנה",
      "top_spenders": "הוצאה גבוהה החודש",
      "never_tokens": "טוקנים לא מוצגים כאן אף פעם"
    }
  }
}
```

### קריטריוני קבלה
- [ ] כל `select` על `g` בבלוקים כולל `female`, ‏`male` ו-`other`; כל ספירה ב-plural; אין ₪ צמוד למשתנה (‏`lint:copy`).
- [ ] אין במרחבי השמות של החלק מחרוזת עם הז׳רגון האסור של §1.4 מחוץ ל-`*.advanced.*`, ואף אות שימוש לא צמודה למשתנה של שם (`{businessName}`, ‏`{name}`).
- [ ] מסכי האדמין לא מציגים `token_enc`, ‏`meta_user_id` או מספר טלפון של ליד (בדיקת snapshot של התשובות של AM1–AM3).

---

## §20. מיילים ותבניות וואטסאפ

### 20.1 הקטלוג (שורות חדשות ב-`EmailKey`, חלק 06 §12.4)

| `key` | סוג | מתי | למי | ניתן לכיבוי | מפתח אידמפוטנטיות |
|---|---|---|---|---|---|
| `meta_campaign_live` | notification | `ACTIVE` ראשון | בעלים, מנהלים ומי שפרסם | כן (`meta_campaign_live`) | `meta_campaign_live:{campaignId}` |
| `meta_ad_rejected` | notification | `DISAPPROVED` | מי שפרסם, ובעלים ומנהלים | כן (`meta_ad_rejected`) | `meta_ad_rejected:{variantId}:{reviewHash}` |
| `meta_connection_lost` | transactional | `needs_reconnect` או ביטול מצד מטא | בעלים ומנהלים | **לא** (קמפיינים ממשיכים להוציא כסף) | `meta_connection_lost:{connectionId}:{day}` |
| `lead_new` | notification | ליד חדש · סיכום · תזכורת | בעלים, מנהלים והאחראי | כן (`lead_received`) | `lead_new:{leadId}` · `lead_digest:{ws}:{10min}` · `lead_new:{leadId}:reminder` |
| `weekly_results` | notification | ראשון בבוקר | בעלים ומנהלים | כן (`weekly_results`) | `weekly_results:{ws}:{isoWeek}` |
| `spend_cap_warning` | notification | 80% · 100% · תקרה של קמפיין | בעלים ומנהלים של סביבת החיוב | כן (`spend_cap_warning`) | `spend_cap_warning:{bws}:{month}:{pct}` · `spend_cap_warning:{campaignId}:{month}:user` |
| `social_post_failed` | notification | כשל סופי בפרסום, או פוסט שפג (`expired`) | מי שתזמן | כן (`social_post_failed`) | `social_post_failed:{postId}:{attempt}` |
| `health_check_ready` | transactional | בדיקת הדופק הסתיימה | מי שהפעיל | לא | `health_check_ready:{reportId}` |
| `monthly_plan_ready` | notification (הודעת שירות) | תוכנית נבנתה: ב-1 לחודש, ואחרי האונבורדינג | בעלים ומנהלים | כן (`monthly_plan`), ובנוסף המתג "תוכנית חדשה אוטומטית" | `monthly_plan_ready:{planId}` |

המייל `trends_weekly` (דיוור) שייך לחלק 08. מוסכמות הנוסח של חלק 06 §12.5–§12.6: משתני כסף (`{dailyBudget}`, ‏`{spend}`, ‏`{cap}`) מגיעים מעוצבים עם ₪; פנייה ברבים, וכל צורת רבים מטבלה 12.6 היא ICU `select`; תאריכים ב-`formatDate`. אין מידע אישי של ליד בנושא המייל מעבר לשם הפרטי.

### 20.2 הנוסח המלא

#### `meta_campaign_live`
- **נושא:** הקמפיין "{campaignName}" אושר ופעיל
- **Preheader:** מטא אישרה את המודעות, והן מתחילות להופיע עכשיו.
- **H1:** הקמפיין באוויר
- **גוף:**
  - שלום {firstName},
  - מטא אישרה את הקמפיין "{campaignName}", והמודעות מתחילות להופיע.
  - טבלה: **מטרה** {goalHe} · **תקציב יומי** {dailyBudget} · **אזור** {areaHe} · **עד** {endHe} ("עד שמפסיקים" או תאריך).
  - בימים הראשונים מטא לומדת למי להראות את המודעות, ולכן המספרים קופצים. כדאי לחכות 3 ימים לפני שמשנים משהו.
  - לפי המטרה: וואטסאפ — **"פניות מגיעות ישירות לוואטסאפ של העסק. כדאי לענות מהר: מי שפנה עכשיו מצפה לתשובה."** · טופס — **"כל ליד חדש יגיע אליכם מיד, באפליקציה ובמייל."** · אתר — **"הכניסות לאתר יופיעו בדוח."**
- **כפתור:** לדוח הקמפיין ← `/app/campaigns/{campaignId}`
- **הערה:** התקציב נגבה על ידי מטא מאמצעי התשלום שבחשבון המודעות. אפשר להשהות בכל רגע מהדוח.

#### `meta_ad_rejected`
- **נושא:** מטא לא אישרה מודעה בקמפיין "{campaignName}"
- **Preheader:** {titleHe}. ככה מתקנים.
- **H1:** מודעה אחת לא אושרה
- **גוף:**
  - שלום {firstName},
  - מטא לא אישרה את מודעה {variantKey} בקמפיין "{campaignName}".
  - **הסיבה:** {titleHe}
  - **מה עושים:** {fixHe}
  - {othersRunning, select, true {שאר המודעות בקמפיין ממשיכות כרגיל.} other {זו המודעה היחידה בקמפיין, ולכן הוא לא רץ עכשיו.}} מודעה שלא אושרה לא מוציאה כסף.
- **כפתור:** לתיקון המודעה ← `/app/campaigns/{campaignId}`
- **הערה:** נראה שזו טעות? אפשר לערער במנהל המודעות של מטא, או פשוט להשיב למייל הזה ונעזור.
- `titleHe` ו-`fixHe` מ-`REVIEW_FEEDBACK_HE` (§10.2); בלי מפתח — `titleHe` = "מטא לא פירטה סיבה מוכרת", ו-`fixHe` = הסיבה המקורית של מטא בציטוט.

#### `meta_connection_lost`
- **נושא:** החיבור לפייסבוק ולאינסטגרם נותק
- **Preheader:** הקמפיינים ממשיכים לרוץ במטא. צריך לחבר מחדש כדי לנהל אותם מכאן.
- **H1:** צריך לחבר מחדש
- **גוף:**
  - שלום {firstName},
  - החיבור של {{BRAND_NAME}} לפייסבוק ולאינסטגרם של "{workspaceName}" נותק. הסיבה: {reasonHe}.
  - **מה זה אומר:** קמפיינים שרצים ממשיכים לרוץ במטא ולחייב את אמצעי התשלום שבחשבון המודעות. עד החיבור מחדש אי אפשר להשהות אותם מכאן, הדוחות לא מתעדכנים ופוסטים מתוזמנים לא יתפרסמו.{scheduledCount, plural, =0 {} one { פוסט אחד מתוזמן לימים הקרובים.} two { שני פוסטים מתוזמנים לימים הקרובים.} other { # פוסטים מתוזמנים לימים הקרובים.}}
  - צריך לעצור קמפיין עכשיו? אפשר להשהות אותו ישירות במנהל המודעות של מטא.
- **כפתור:** חיבור מחדש ← `/app/settings/integrations/meta`
- **הערה:** החיבור מחדש לוקח פחות מדקה, ולא מוחק נתונים או קמפיינים.
- `reasonHe`: `token_invalid` — "ההרשאה פגה או בוטלה" · `missing_permission` — "חסרה הרשאה שהחיבור צריך" · `meta_deauthorize` — "האפליקציה הוסרה מהגדרות העסק במטא".

#### `lead_new`
- **נושא:** ליד חדש: {leadFirstName}
- **Preheader:** {sourceHe} · {receivedTime}. כדאי לחזור מהר.
- **H1:** ליד חדש
- **גוף:**
  - שלום {firstName},
  - התקבל ליד חדש. מקור: {sourceHe} (`'הקמפיין "{campaignName}"'` או "דף העסק").
  - טבלה: **שם** {leadFullName} · **טלפון** `<Ltr>`{leadPhone}`</Ltr>` (קישור `tel:`) · **מייל** (אם יש) · **עיר** (אם יש) · התשובות לשאלות · **מאשר לקבל עדכונים:** כן / לא.
  - קישורים מהירים: **התקשרו** (`tel:`) · **וואטסאפ** (`wa.me` עם ההודעה המוכנה של §12.3).
- **כפתור:** לליד באפליקציה ← `/app/leads?lead={leadId}`
- **הערה:** פרטי הליד שייכים לעסק שלכם. אנחנו לא משתמשים בהם ולא מעבירים אותם לאף אחד.
- **וריאנט סיכום** (יותר מ-5 לידים ב-10 דקות): **נושא** "{count, plural, one {ליד חדש} two {שני לידים חדשים} other {# לידים חדשים}} ב-10 הדקות האחרונות" · **H1** "לידים חדשים" · רשימה של עד 10 שורות (שם פרטי · מקור · שעה) ו-"{more, plural, =0 {} one {ועוד ליד אחד} two {ועוד שני לידים} other {ועוד # לידים}}" · **כפתור** "לתיבת הלידים" ← `/app/leads?status=new`.
- **וריאנט תזכורת** (15 דקות בלי טיפול): **נושא** "{leadFirstName} מחכה לתשובה" · **גוף** "הליד הגיע לפני {minutes, plural, one {דקה} two {שתי דקות} other {# דקות}} ועדיין מסומן 'חדש'. מי שפנה עכשיו מצפה לתשובה מהירה." · **כפתור** "לליד באפליקציה".

#### `weekly_results`
- **נושא:** הסיכום השבועי: {rangeHe}
- **Preheader:** {spend} · {reach} אנשים ראו · {resultsPhrase}
- **H1:** מה קרה השבוע
- **גוף:**
  - שלום {firstName},
  - ארבעת המספרים של השבוע (מול השבוע הקודם): **כמה הוצאתם** {spend} · **כמה אנשים ראו** {reach} · **{resultLabel}** {results} · **כמה עלתה כל פנייה** {cpr}, עם חץ ושינוי באחוזים.
  - **ההוק שעבד הכי טוב:** תמונה ממוזערת, "{winnerHook}", פנייה ב-{winnerCpr}. (רק אחרי המדגם.)
  - **הרילס הכי נצפה:** {bestReelViews} צפיות, עם קישור. (רק כשיש.)
  - **המלצה אחת:** {recommendationHe}
  - **מה קרה אוטומטית:** {automationsHe} (רק כשכללים פעלו).
  - **לידים חדשים השבוע:** {newLeads}.
- **כפתור:** לדוח המלא ← `/app/campaigns`
- **הערה:** המספרים לפי מטא, ויכולים להתעדכן עד 28 יום אחורה.
- `resultsPhrase` מגיע מוכן מ-ICU plural (למשל "הגיעו 14 פניות בוואטסאפ").

#### `spend_cap_warning`
- **וריאנט 80%** — **נושא:** נוצלו 80% מהתקרה החודשית · **Preheader:** המודעות ממשיכות לרוץ. ככה זה עובד כשמגיעים לתקרה. · **H1:** קרוב לתקרה החודשית · **גוף:** "החודש נוהלו מכאן קמפיינים ב-{used} מתוך {cap}, התקרה של תוכנית {planName}. המודעות ממשיכות לרוץ כרגיל. גם כשמגיעים לתקרה, המודעות לא נעצרות; {graceDays, plural, one {יום אחד} two {יומיים} other {# ימים}} אחרי זה נחסמות השקות חדשות, חידושים והגדלות תקציב, עד תחילת החודש הבא." · **כפתור:** השוואת תוכניות ← `/app/billing/plans`
- **וריאנט 100%** — **נושא:** התקרה החודשית של התוכנית נוצלה · **Preheader:** המודעות ממשיכות לרוץ. אנחנו לא עוצרים אותן. · **H1:** התקרה החודשית נוצלה · **גוף:** "החודש נוהלו מכאן קמפיינים ב-{used}, והתקרה של תוכנית {planName} היא {cap}. המודעות ממשיכות לרוץ. החל מ-{blockDate} לא יהיה אפשר להשיק קמפיינים חדשים, לחדש קמפיינים מושהים או להגדיל תקציב, עד {resetDate}." · **כפתור:** השוואת תוכניות
- **וריאנט תקרה של קמפיין** — **נושא:** הקמפיין "{campaignName}" הגיע לתקרה החודשית · **H1:** הקמפיין הושהה · **גוף:** "הקמפיין הוציא החודש {spent}, והתקרה החודשית שלו היא {userCap}, ולכן הוא הושהה. אפשר לחדש אותו מהדוח או לשנות את התקרה." · **כפתור:** לדוח הקמפיין
- **הערה (בכולם):** התקרה של התוכנית מגבילה רק את מה שמנוהל מכאן. התקציב עצמו משולם למטא ישירות.

#### `social_post_failed`
- **נושא:** הפוסט לא פורסם {platform, select, instagram {באינסטגרם} facebook {בפייסבוק} other {}}
- **Preheader:** {reasonHe}. אפשר לנסות שוב בלחיצה.
- **H1:** הפוסט לא פורסם
- **גוף:** "הפוסט של "{projectTitle}" שתוזמן ל-{scheduledAt} לא פורסם {platform, select, instagram {באינסטגרם} facebook {בפייסבוק} other {}}. הסיבה: {reasonHe}." · `reasonHe`: 190 — "החיבור לחשבון נותק" · 2207042 — "הגיעה המכסה היומית של פרסומים לחשבון" · 2207026 — "הקובץ לא עבר את בדיקת הפורמט" · אחר — "תקלה אצל מטא".
- **כפתור:** לניסיון חוזר ← `/app/publish?post={postId}`
- **הערה:** הסרטון עצמו שמור בפרויקט, ושום דבר לא נמחק.

#### `health_check_ready`
- **נושא:** בדיקת הדופק של חשבון המודעות מוכנה
- **Preheader:** ציון {score} מתוך 100 · {issuesPhrase}
- **H1:** התוצאות של בדיקת הדופק
- **גוף:** "{headlineHe}" · **איפה הכסף נשרף:** עד 3 שורות מ-`money_burn_he` · **מה כדאי לתקן קודם:** הכותרות של עד 3 תיקונים.
- **כפתור:** לדוח המלא ← `/app/campaigns/health`
- **הערה:** הבדיקה מבוססת רק על הנתונים של החשבון שלכם, בלי השוואה לעסקים אחרים. היא לא שינתה שום דבר בחשבון.
- `issuesPhrase` מ-ICU plural: "{n, plural, =0 {לא מצאנו בעיות} one {דבר אחד שכדאי לבדוק} two {שני דברים שכדאי לבדוק} other {# דברים שכדאי לבדוק}}".

#### `monthly_plan_ready`
- **נושא:** תוכנית החודש מוכנה: {monthName}
- **Preheader:** {itemsCount, plural, other {# פריטים}} לפי העונות והטרנדים של החודש.
- **H1:** חודש של תוכן, מתוכנן
- **גוף:** "{summaryHe}" · שלושת הפריטים הראשונים (תאריך · כותרת) · "כל פריט נפתח בלחיצה, עם ההוק והפרטים כבר בפנים."
- **כפתור:** לתוכנית ← `/app/plan`
- **הערה:** לא צריך תוכנית אוטומטית? אפשר לכבות אותה בדף התוכנית.

### 20.3 תבניות וואטסאפ (הנוסח המאושר — חלק 06 §13.3; כאן: מתי ועם אילו משתנים)

| תבנית (Utility) | מתי | `{{1}}`, `{{2}}`… | קישור |
|---|---|---|---|
| `campaign_live_he` | `ACTIVE` ראשון | שם הקמפיין | `/app/campaigns/{id}` |
| `ad_rejected_he` | `DISAPPROVED` | שם הקמפיין, `titleHe` | `/app/campaigns/{id}` |
| `lead_new_he` | ליד חדש (לא בסיכום) | שם פרטי, טלפון (רק כש-`lead_notify.include_phone_in_whatsapp` ⚖️) או "בתיבת הלידים" | `/app/leads?lead={id}` |
| `weekly_results_he` | ראשון | ההוצאה, מספר הפניות עם התווית | `/app/campaigns` |
| `meta_connection_lost_he` | ניתוק | שם הסביבה | `/app/settings/integrations/meta` |
| `spend_cap_warning_he` | 80% / 100% | האחוז, התקרה | `/app/billing/plans` |

נשלחות רק עם `whatsapp_notify`, מספר מאומת והסכמה לפי `notification_prefs.kinds.{kind}.whatsapp`, בשעות המותרות. קישורים תמיד לדפים באפליקציה, לעולם לא כתובות חתומות.

### קריטריוני קבלה
- [ ] תשע התבניות קיימות ב-React Email עם fixture לכל וריאנט, ו-snapshot מכיל `dir="rtl"` על `html` ועל כל `table`.
- [ ] `lead_new` לליד מדף העסק מציג "מקור: דף העסק"; בסיכום של 6 לידים ← מייל אחד עם 6 שורות.
- [ ] `meta_connection_lost` נשלח גם כשההתראה כבויה בהעדפות, ופעם אחת ביום לכל חיבור.
- [ ] אין ₪ צמוד למשתנה ואין אות שימוש צמודה למשתנה של שם בתבניות (`lint:copy`).
- [ ] וואטסאפ `lead_new_he` לא כולל טלפון כש-`include_phone_in_whatsapp = false`.

---

## §21. ציות

1. **תנאי הפלטפורמה של Meta, מדיניות המפתחים, התנאים המסחריים ותקני הפרסום:** מאושרים ב-Data Use Checkup השנתי; מינימום מידע, בלי מכירה, מחיקה לפי בקשה. נאכף במוצר: ממשק מטעה והתראות מזויפות ← פרסום רגיל בלבד (§10.6); מאפיינים אישיים, טענות מטעות ולפני-ואחרי בבריאות ← `moderation.ad.v1` ונספח E §18; בלי מוזיקה של צד שלישי במודעות.
2. **מודעות פוליטיות וחברתיות:** לא נתמכות ותמיד חסומות (ישראל נכללת בכללי שלמות הבחירות של מטא; נדרשים אישור מפרסם ו-"Paid for by"). ‏`election_mode` (עד 2026-10-28) מחיל את `ELECTION_POLICY_BLOCKED` גם על קמפיינים ופוסטים, ושורת עזרה מסבירה שמודעות כאלה דורשות אישור של המפרסם עצמו במטא.
3. **תוכן שנוצר ב-AI:** §13.6; תבנית `needs_ai_label` מחייבת `projects.ai_label`; בלי אנשים מדברים ומציאותיים שנוצרו ב-AI בתבניות למודעות.
4. **הגנת הצרכן:** בלי הבטחת תוצאות, הערכות מסומנות כהערכות, דחיפות ומחירים רק כשהם נכונים (הצהרות R4), בלי המלצות מזויפות, השוואות לפי כלל המקורות של חלק 02; מטא מסמנת מודעות "ממומן".
5. **פרטיות (תיקון 13):** קטגוריות חדשות — מזהי Meta, טוקנים מוצפנים, ביצועי מודעות, הלידים של הלקוח, צילומים מודרכים של אנשים, דפי העסק — עם מטרות ותקופות שמירה (חלק 06 §11.5: טוקנים עד הניתוק; `raw` של נתונים 90 יום; לידים 24 חודשים; דוחות בדיקת דופק 12 חודשים; בקשות מחיקה של מטא 3 שנים; נתוני פרסום רגיל, תוכניות ודפי עסק — כל עוד הסביבה קיימת; העתקים ב-`public-media/landing/` — עד ההסרה מפרסום). לידים לפי §12.5 (הלקוח בעל השליטה, אנחנו מעבדים, `/legal/dpa`); הודעת הפרטיות של העסק §14.7; מחיקת טוקנים בניתוק; callback ודף סטטוס למחיקה; runbook R7 מכסה טוקנים ולידים.
6. **תוספות לתנאי השימוש** (`/legal/terms#meta`, חלק 02): אנחנו כלי; הלקוח הוא המפרסם ובעל החשבון ומקבל את התנאים של מטא; התקציב מחויב על ידי מטא, ואנחנו לא מחזיקים ולא מחזירים אותו; אין הבטחת תוצאות; הלקוח אחראי לאמת התוכן, לזכויות, להסכמות, לדף היעד ולהודעות ההמשך שלו (חוק הספאם חל עליו); אוטומציות פועלות רק כפי שהלקוח הפעיל; אנחנו רשאים לחסום תוכן לפי המדיניות שלנו ושל מטא; ניתוק בכל רגע; תבניות טרנד הן השראה לפורמט שאנחנו מרנדרים; העלאות חייבות להיות של הלקוח. ההסכמה `meta_ads_terms` נרשמת בשרת בחיבור הראשון.
7. **מידע בין לקוחות:** כבוי (`cross_customer_benchmarks.enabled = false`) עד [Counsel]; אם יאושר — רק נתונים מצטברים, k ≥ 5, גילוי במדיניות הפרטיות ו-opt-out ב-`workspaces.benchmarks_opt_out`.
8. **⚖️ לרשימה של חלק 06 §25:** נוסח ה-DPA; טלפון של ליד בהודעת וואטסאפ; היקף המחיקה בבקשת מחיקה של מטא; הודעת הפרטיות לכל עסק (§14.7); שימוש בשמות Meta/Facebook/Instagram כטקסט; צפיות בדף העסק בלי עוגיות (§14.5).

### קריטריוני קבלה
- [ ] כל אחד משמונת הסעיפים ממופה לשורה בטבלת הבקרה של חלק 06 §11.1, עם בעלים ובדיקה.
- [ ] ⚖️ של הסעיף 8 מופיעים בחלק 06 §25, ו-M11 לא נסגר כשאחד מהם פתוח.

---

## §22. בדיקות

### 22.1 יחידה (Vitest)

`lib/meta/money.ts` (עיגול, offset) · `buildCampaignParams` / `buildAdSetParams` לכל מטרה (snapshot של הגוף, `PAUSED`, ‏`advantage_audience` תמיד נשלח, בלי Explore) · `parseSignedRequest` (תקין, חתימה שגויה, אלגוריתם אחר, רוטציה) · אימות `X-Hub-Signature-256` · `externalIdFor` · `caption.ts` (≤ 5 האשטגים, ניקוי גרשיים, U+200F, U+2066…U+2069) · `assertMetaVideoSpec` · `adEligibility` (כל `reason` לפי הסדר) · הערכת כל חמשת הכללים ומעקותיהם · בחירת המנצח והמדגם · `recordUsage` / `assertAccountOpen` · `explainFallback` · `checks.ts` וחישוב הציון · `landingAllowance` (חינם, חינם עם רכישה, בסיס, סוכנות) · `slug.ts` (תעתיק, מילים שמורות, התנגשות) · ולידציות הפרומפטים (מספרים מומצאים, מזהים מחוץ למועמדים) · `redactMetaPayload`.

### 22.2 חוזה עם MSW (`tests/contract/meta/*.test.ts`)

כל handler ב-`lib/meta/mock/handlers.ts` משתמש ב-fixture מוקלט מ-`tests/fixtures/meta/` (מהספייקים 19–23 של M0, עם נתונים מנוקים). דוגמה (`leadgen.webhook.json`):

```json
{"object":"page","entry":[{"id":"104000000000001","time":1760700000,"changes":[{"field":"leadgen","value":{"leadgen_id":"920000000000001","page_id":"104000000000001","form_id":"880000000000001","adgroup_id":"120200000000003","ad_id":"120200000000003","created_time":1760700000}}]}]}
```

ו-`buc-usage.header.json` (הערך של `X-Business-Use-Case-Usage`):

```json
{"1234567890":[{"type":"ads_management","call_count":80,"total_cputime":20,"total_time":30,"estimated_time_to_regain_access":6}]}
```

### 22.3 e2e (Playwright, ‏`META_PROVIDER=mock`, ‏`ORCHESTRATOR=inline`)

1. **חיבור:** אונבורדינג ← "חיבור פייסבוק ואינסטגרם" ← `/dev/mock-meta-login` ← "אישור" ← בחירת נכסים + וואטסאפ ← רשימת בדיקה ירוקה.
2. **פרסום רגיל:** פרויקט מוכן ← "פרסמו עכשיו" ← שתי פלטפורמות ← "פורסם" (Realtime `social_post.updated`) ← פוסט נוסף מתוזמן לעוד 20 דקות עם שעון מזויף ← פורסם בזמן.
3. **קמפיין:** "העלו לקמפיין" (3 הוקים) ← ארבעת הצעדים ← "הכנה לפרסום" ← תצוגות ← "פרסום" ← "בבדיקה של מטא" ← `simulateReview(approve)` ← "פעיל" ← "השהיה" ← "המשך" ← שינוי תקציב שלוש פעמים, הרביעית נדחית בעברית.
4. **ליד:** קמפיין "לידים בטופס" ← `simulateLead` ← הליד בתיבה ובפעמון תוך פחות מ-60 שניות ← שינוי סטטוס ← ייצוא CSV.
5. **דף העסק:** יצירה (10 קרדיטים) ← עריכה ← פרטים משפטיים ← פרסום ← `/b/{slug}` נטען ← שליחת טופס ← ליד עם מקור "דף העסק".
6. **שליליים:** פרויקט T4 לא עובר את שער הבטיחות; ניתוק עם מחיקה מוחק את נתוני מטא; חשבון ב-USD חוסם השקה.

### 22.4 מול מטא האמיתית (`contract-live.yml`, שבועי)

`pnpm meta:smoke` על חשבון ה-sandbox שלנו: קמפיין, קבוצת מודעות, קריאייטיב ומודעה ב-`PAUSED` ← תצוגות ← נתונים ← מחיקה; גם מול `META_GRAPH_VERSION_NEXT` כשמוגדר. כשל ← התראת אדמין ו-runbook R14.

### 22.5 עומס וידני

200 חשבונות מדומים בתוך נעילת ה-cron השעתי (50 דקות) בלי חריגה ממגבלות הקצב; בדיקה ידנית על מכשירים של טופס `HE_IL` (iOS ו-Android), של תצוגות מטא בעברית ושל `/b/[slug]` בקורא מסך.

### קריטריוני קבלה
- [ ] כל הבדיקות של 22.1–22.3 רצות ב-CI בכל PR, וה-e2e עוברים עם ה-mock בלי רשת חיצונית.
- [ ] fixture חדש מתווסף לכל שגיאת Meta שנמצאה בבטא, עם מקרה בדיקה.
- [ ] ה-smoke השבועי ירוק ארבעה שבועות ברציפות לפני M11.

---

## §23. מפת דרכים אחרי M11 (תיעוד בלבד; מאחורי דגלים כבויים; לא נבנה ב-M8–M11)

1. **בוט וואטסאפ ללידים** (`whatsapp_bot`): תשובות מיידיות ללידים מקמפיינים של וואטסאפ (שאלות נפוצות, מחירון, תיאום) דרך WhatsApp Business Platform Cloud API, רק עם תשובות שהעסק אישר, עם הסרה בכל הודעה; דורש `whatsapp_business_management`, חיבור WABA של הלקוח, ובדיקה של חוק הספאם ומדיניות ההודעות של מטא ⚖️.
2. **סרטון המלצה מביקורת אמיתית** (`review_videos`): ביקורת אמיתית מגוגל או מוואטסאפ הופכת לסרטון — רק עם הוכחת מקור והסכמה מפורשת של הכותב; לעולם לא המלצה שהומצאה ב-AI.
3. **ליווי אנושי לקמפיין** (`human_review`, מוצר חד-פעמי `review-149`, ‏₪149 כולל מע״מ): מומחה בודק את הקמפיין לפני ההשקה. נדחה ל-MVP (עלות תפעול, מוצר חדש); בודקים שוב אחרי הבטא.
4. **תוכנית שותפים** (`partners`): רואי חשבון, יועצים עסקיים, קורסים וקהילות עסקיות מפנים לקוחות תמורת חלק מההכנסה; קישורי מעקב ודוח תשלומים חודשי.
5. **אפליקציה לנייד (PWA + push):** הצעת התקנה, התראות push על לידים חדשים ועל סטטוס קמפיין, צילום מודרך מהטלפון (ה-manifest כבר קיים בחלק 01).
6. **ערוצים נוספים:** טיקטוק, YouTube Shorts ו-Google Business Profile; מצב רב-סניפים וזכיינות; דומיין משלכם לדף העסק.

כל פריט נפתח רק אחרי החלטה ב-`DECISIONS.md`, עם אבן דרך משלו בחלק 06 §24 ("אחרי M11").

### קריטריוני קבלה
- [ ] הדגלים `whatsapp_bot`, ‏`review_videos`, ‏`human_review` ו-`partners` קיימים ב-seed כבויים, ואף קוד לא קורא אותם ב-M8–M11 (בדיקה סטטית).

---

## §24. החלטות מימוש של החלק הזה

1. **עמודות נוספות:** `meta_connections.assets_synced_at` (מסך הנכסים מחכה ל-sync); `meta_assets.reach_summary` ו-`ad_campaigns.reach_summary` (reach בלי כפילויות; אסור לסכם reach); `landing_pages.published_content` ו-`generated_at` (הטיוטה נפרדת ממה שמוגש); `leads.landing_page_id` ו-`leads.consent`; ‏`ad_health_reports.status`, ‏`error_code`, ‏`created_by`, ‏`completed_at`; ‏`content_plans.summary_he`; ‏`content_plan_items.why_he`, ‏`daily_budget_ils`, ‏`prefill`, ‏`sort_order`.
2. **`leads.source`** הוא enum `lead_source` (`meta_form`, ‏`whatsapp`, ‏`landing_page`, ‏`manual`), ולא check על טקסט; `lead_received.source` באנליטיקה מקבל את ערכי ה-enum. ‏`purge_meta_data('all')` מוחק רק לידים `meta_form`.
3. **הפניות לנכסי מדיה** מותרות כ-NULL (`on delete set null`), כדי ש-`purge_deleted_content` לא ייחסם.
4. **`monthly_cap_stop`** הוא כלל ברמת הסביבה (`campaign_id = null`) עם `capIls`; התקרה האישית של קמפיין נאכפת על ידי המערכת ולא נספרת כ"כלל".
5. **עריכת טיוטה** מותרת גם ב-`ready` וב-`error`, ומחזירה ל-`draft`.
6. **תוצאה במטרת חשיפה** = צפיות של 3 שניות (האריח השלישי, §11.1), והאריח הרביעי = עלות ל-1,000 אנשים.
7. **התראות של כללים, בדיקת דופק ותוכנית** משתמשות בסוג ההתראה הקיים `system` (בלי ערכי enum נוספים); "סיכום במייל" של כללים = שורה בסיכום השבועי.
8. **`meta_connection_lost`** לא ניתן לכיבוי; **תזכורת ליד** היא וריאנט של `lead_new`; **תקרה של קמפיין** היא וריאנט של `spend_cap_warning`.
9. **דף העסק:** סביבה חינמית שרכשה חבילה מפרסמת דף אחד עם המיתוג (מימוש של "פרסום דורש תוכנית בתשלום או רכישת חבילה" בהחלטת המייסד); בסוכנות המכסה חלה גם על סביבת הסוכנות עצמה; התצוגה המקדימה בחינם עולה 10 קרדיטים כמו כל יצירה; פרסום והסרה — בעלים ומנהלים; עד 10 דפים לסביבה; ‏`business_profiles.website_url` (ולא `brand_kits`, שאין בו עמודה כזו) קובע אם יש אתר; בלי Turnstile (honeypot + זמן מילוי + קצב); נתיבים נוספים LP3 (יצירה מחדש) ו-LP9 (צפיות).
10. **תוכנית 30 יום:** flow `monthlyPlanGenerate` וצעד בתחילת החודש ב-`/api/cron/reminders`; ‏"תכנון חודש" בלי הדגל נשאר ההצעה הדטרמיניסטית של §13.7.
11. **תצוגות מקדימות** מוצגות דרך ה-`src` של ה-iframe בלבד, אחרי בדיקת מארח, ולא כ-HTML.
12. **שער הקצב** ב-75% עוצר כתיבות וב-95% משאיר רק קריאות `essential`; נעילת כתיבה של 120 שניות לכל חשבון גם בנתיבים.
13. **ניסוח:** "מאשרים לקבל עדכונים ומבצעים מאת {businessName}" במקום אות שימוש לפני המשתנה (R18).

### קריטריוני קבלה
- [ ] כל החלטה ברשימה רשומה ב-`DECISIONS.md` בתחילת M9 (או M10 לדף העסק ולבדיקת הדופק), עם הפניה לסעיף כאן.
- [ ] החלקים שמופיעים ב"רשום ב…" של תלויות בין חלקים עודכנו לפני ה-merge של הקוד שתלוי בהם.

---

## תלויות בין חלקים

- **חלק 00:** שורת `prompt/07-meta-campaigns.md` במפה (M9–M11), שורת הבעלות "Meta: חיבור, טוקנים, קמפיינים, פרסום רגיל, דוחות, לידים, webhooks של Meta → 07", העיקרון "כסף של פרסום: 0% מהתקציב…".
- **חלק 01:** הרכיבים `KpiTile`, ‏`SpendCapMeter`, ‏`HookComparisonTable`, ‏`CampaignStatusTimeline`, ‏`MetaConnectChecklist`, ‏`MetaPreviewFrame`, ‏`BudgetPresetPicker`, ‏`AreaPicker`, ‏`LeadCard`, ‏`CalendarGrid`; ‏`StatusBadge` עם `campaign`, ‏`ad`, ‏`social_post`, ‏`lead` — **רשום בחלק 01 גם** `landing_page` ותיקיות `components/landing|plan|integrations/`; כלל `lint:copy` לז׳רגון האסור מחוץ ל-`*.advanced.*` (§1.4).
- **חלק 02:** `/legal/terms#meta`, ‏`/legal/dpa`, ‏`/meta/data-deletion`, שורות פרטיות ושמירה, CTA "בדיקת דופק חינם", אזכור "דף עסק בלי אתר"; **רשום בחלק 02:** הנתיבים הציבוריים `/b/[slug]` ו-`/b/[slug]/privacy` (מוגדרים כאן, §14.5–§14.7).
- **חלק 03:** נתיבי `/app/campaigns*`, ‏`/app/leads`, ‏`/app/publish*`, ‏`/app/landing-pages*`, ‏`/app/plan`, ‏`/app/campaigns/health`, ‏`/app/settings/integrations/meta`, ‏`/admin/meta*`, ‏`/dev/mock-meta-login` עם "מפורט בחלק 07"; קופי `errors.*` לחמשת הקודים ולמפתחות `PLAN_LIMIT` החדשים (כולל `landing_pages`, ‏`health_checks_per_month`, ‏`meta_test_spend_ils`) ולסיבות `too_many_pages`, ‏`legal_identity_missing`, ‏`no_contact_channel`, ‏`slug_taken`, ‏`slug_reserved`, ‏`outside_month`, ‏`confirm_text`; שלב 4 באונבורדינג; כפתורי דף הפרויקט; **רשום בחלק 03:** מפתחות `localStorage` ‏`campaigns.report.range`, ‏`publish.calendar.view`, ‏`announcement.dismissed.meta-ai-notice`.
- **חלק 04:** אינדקס `0013_meta_integration.sql` ← כאן §6; ספירת enum-ים 50 אחרי 0013 ו-58 אחרי 0014; 18 טבלאות ב-0013; ‏pg_cron 13 ← 14; ה-allow-list מוסיף `meta_spend_summary(uuid)` ו-`landing_page_public(text)`; טבלת הנתיבים (§7.1, כולל LP1–LP9, ‏HC1–HC2, ‏PL1–PL3 — אותם מזהים כמו ב-§21b.3 שם); חמשת קודי השגיאה; ה-buckets ‏`meta_write`, ‏`meta_read`, ‏`meta_refresh`, ‏`social_publish`, ‏`leads_export`, ‏`landing_lead`, ‏`health_check`, ‏`plan_generate`; **רשום בחלק 04:** מפתחות Upstash ‏`meta:acct:{actId}`, ‏`meta:write:{actId}`, ‏`meta:explain:{…}`, ‏`meta:previews:{campaignId}`, ‏`lpview:{pageId}:{ipHash}`; הנתיב הציבורי `public-media/landing/{id}/…`; פעולות הביקורת `landing.publish`, ‏`landing.unpublish`, ‏`landing.delete`; צעד "תוכנית חודשית" ב-`/api/cron/reminders`; ‏`proxy.ts`: ‏`/b/*` ו-`/api/b/*` ציבוריים, ‏`/api/webhooks/meta*` בגוף גולמי; §9.6: ‏`purge_meta_data(ws,'all')`, ביטול ב-Meta והסרת דפי עסק בכל מחיקת סביבה; seed: עשרת מפתחות `plans.limits` של §17, חמש שורות `credit_costs`, ‏`app_settings` התשעה.
- **חלק 05:** שבעת מזהי הפרומפט של כאן ברישום §8.1 (הטקסטים כאן); הנתיב `llm.ads`; ‏`startFlow` עם הזרימות של §8.4 (**רשום בחלק 05:** `metaHealthCheck`, ‏`monthlyPlanGenerate`, והווריאנט `meta_object` ב-`ExternalEvent`); פרופיל `meta_reels`; נקודת `moderation.ad.v1` לפני C6/C8; מטא-דאטה IPTC; ‏`PosterStill` ל-1:1; סימון פריט תוכנית כ-`done` ב-finalize כשהפרויקט מקושר לפריט.
- **חלק 06:** תשעת המיילים (הנוסח כאן, §20) עם המפתחות והווריאנטים; שש תבניות הוואטסאפ (הנוסח שם, המשתנים כאן); 33 אירועי האנליטיקה של קמפיינים, פרסום וטרנדים ו-12 האירועים של דף העסק, בדיקת הדופק, התוכנית וציון ההוק (`lead_received.source` ← `lead_source`); דגלי `meta_*`, ‏`landing_pages`, ‏`meta_health_check`, ‏`monthly_plan` ודגלי מפת הדרכים; משתני `META_*`; ‏CSP `frame-src https://www.facebook.com` בבונה בלבד; `deriveKey("meta-oauth")`; רוטציה של `meta_tokens`; התראות; runbooks R14–R19; M0 משימה 7 וספייקים 19–24, ‏M8–M11 ו"אחרי M11" (§23); שורות שמירה (§21 סעיף 5); ⚖️ של §21 סעיף 8 בחלק 06 §25; **רשום בחלק 06 §2.7 ו-§5.4:** ‏`landingPageLimit(ws)` (חינם + `has_paid` ← 1) ושנמוך שמשאיר דפים מפורסמים באוויר.
- **חלק 08:** FKs מאוחרים ב-`0014` ל-`ad_campaigns`, ‏`ad_variants`, ‏`social_posts` — **וגם `content_plan_items.trend_template_id`**; ‏`trend_feed()` משמש את `plan.month.v1`; ‏`ad_safety`, ‏`extra_gates` ו-`recommended_ad_goal` משמשים את §9–§10; ה-cron ‏`trends-lifecycle` והמייל `trends_weekly` שם.
- **נספח E:** §18 (קופי למודעות) ו-§19 (שפת הדוחות) הם המקור לכללים של §9.5, §11 ו-§18; ‏`LENGTH_LIMITS` החדשים.
