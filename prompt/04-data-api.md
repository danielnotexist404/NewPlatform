# חלק 04 — שכבת הנתונים: Supabase, RLS, אחסון ו-API

החלק הזה הוא החוזה של שכבת הנתונים: איך מקימים את פרויקט ה-Supabase, איך כותבים ומריצים מיגרציות, ה-DDL המלא של כל enum וכל טבלה, כל פונקציות ה-SQL (כולל מנוע הקרדיטים עם נעילת שורות ואידמפוטנטיות), הטריגרים, מדיניות ה-RLS לכל טבלה, האחסון, הרשאות Realtime, משימות pg_cron וסקריפט ה-seed.
בחצי השני מוגדרים לקוחות ה-Supabase ב-Next.js 16, `proxy.ts`, הטיפוסים המחוללים, וכל ה-Route Handlers: שיטה, נתיב, הרשאה, סכמות Zod לבקשה ולתשובה, קודי שגיאה, הגבלות קצב, `Idempotency-Key`, וה-webhooks של OpenRouter, ההרכבה והתשלומים.
בסוף יש תוכנית בדיקות RLS מלאה עם מקרי בדיקה קונקרטיים. כל השמות כאן הם חוזה (חלק 00 §4): טבלאות, עמודות, enum-ים, פונקציות, נתיבים וקודי שגיאה כתובים בדיוק כפי שצריך לממש אותם.
המימוש של הלוגיקה העסקית שיושבת מעל החוזים האלה — הצנרת, הפרומפטים וההרכבה (חלק 05), מנוע החיוב והספקים (חלק 06), המסכים (חלק 03) — מפנה לכאן, ולא להפך.

**הרחבת 2026-10-17** (קמפיינים ופרסום ב-Meta, לידים, מנוע הטרנדים, צילום מודרך, דף העסק, בדיקת דופק, תוכנית 30 יום וציון הוק). ה-SQL המלא של שתי המיגרציות החדשות, הלוגיקה והמסכים נמצאים בחלק 07 (`0013_meta_integration.sql`) ובחלק 08 (`0014_trends.sql`). הרשימות הראשיות נשארות כאן: אינדקס המיגרציות (§2.3), כלל ה-enum-ים (§3), ה-buckets של האחסון (§13.1), אירועי Realtime (§14.1), משימות pg_cron (§15), ה-seed (§16), קודי השגיאה והגבלות הקצב (§18), רשימת האב של הנתיבים (§19.2, §21b), ה-webhooks (§22.6), נתיבי ה-cron (§23), פעולות הביקורת (§24.1) ובדיקות ה-RLS (§25). חלק 04 הוא גם הבעלים של העמודה `project_versions.hook_score` (§2.3, §19.10).

**איך לקרוא את קטעי ה-SQL.** כל בלוק SQL בחלק הזה הוא תוכן אמיתי של קובץ מיגרציה, בסדר שבו הוא צריך להופיע בקובץ. כשכתוב ‏`0004_projects_jobs.sql` מעל בלוק — הבלוק נכנס לקובץ הזה. אין לשנות שמות; מותר לפצל קובץ לקבצים עוקבים אם הוא גדול מדי לביקורת, בתנאי שהסדר נשמר.

---

## §1. הקמת פרויקט Supabase

### 1.1 סביבות

| סביבה | איפה | שימוש | הערות |
|---|---|---|---|
| `local` | `supabase start` (Docker) על מכונת המפתח וב-CI | פיתוח, בדיקות pgTAP, בדיקות e2e | כל המיגרציות + `pnpm db:seed`; ספקים חיצוניים ב-mock |
| `staging` | פרויקט Supabase Pro נפרד, `eu-central-1` | Vercel Preview | נתוני seed + משתמשי בדיקה; מפתחות sandbox של Grow ו-Morning |
| `production` | פרויקט Supabase Pro, `eu-central-1` (Frankfurt) | `{{DOMAIN}}` | PITR פעיל מ-M7; גישת Dashboard רק לבעלי החברה, עם MFA |

אין אזור Supabase בישראל; Frankfurt נבחר כדי לשבת ליד פונקציות Vercel ב-`fra1` (כל קריאה למסד מ-`iad1` מוסיפה מעל 100ms). אזור הנתונים (האיחוד האירופי) מתועד במדיניות הפרטיות (חלק 02, חלק 06).

### 1.2 הגדרות פרויקט (Dashboard), לפי הסדר

1. **יצירה:** ארגון על תוכנית Pro, פרויקט `{{BRAND_NAME_EN}}-production` (ו-`-staging`), אזור `eu-central-1`, סיסמת מסד חזקה שנשמרת במנהל סיסמאות בלבד. מחשוב: Micro ל-staging; Small לפרודקשן לפני ההשקה (M7), ומעקב אחרי CPU ו-IO.
2. **מפתחות API:** משתמשים **רק** במפתחות החדשים. `sb_publishable_…` נכנס ל-`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, ו-`sb_secret_…` ל-`SUPABASE_SECRET_KEY` (Vercel, סביבות Production ו-Preview בנפרד). המפתחות הישנים `anon`/`service_role` יוצאים משימוש עד סוף 2026 — לא מעתיקים אותם לשום מקום, ומשביתים אותם ב-Dashboard ברגע שהאפליקציה עובדת עם החדשים. המפתחות החדשים אינם JWT: הם נשלחים בכותרת `apikey`, ומפתח סודי שנשלח מדפדפן נדחה (401). יוצרים מפתח סודי נפרד לכל צרכן (`vercel-app`, `ci-migrations`, `seed`) כדי שאפשר יהיה לבטל אחד בלי להפיל את השאר.
3. **JWT:** מפעילים מפתחות חתימה אסימטריים (ES256). השרת מאמת את ה-JWT מקומית מול ה-JWKS (`supabase.auth.getClaims()`), בלי קריאת רשת בכל בקשה [M0-verify: שם המתודה בגרסת `@supabase/supabase-js` המותקנת; חלופה: `getUser()`]. תוקף access token: ‏3600 שניות; Refresh token rotation פעיל, reuse interval ‏10 שניות.
4. **Data API:** סכמה חשופה אחת בלבד: `public`. ‏Max rows ‏1000. GraphQL כבוי.
5. **Auth → URL Configuration:** ‏Site URL ‏`https://{{DOMAIN}}`. ‏Redirect URLs (רשימת היתר — כל השאר נדחה):
   - `https://{{DOMAIN}}/auth/callback` · `https://{{DOMAIN}}/auth/confirm`
   - `https://*-{{VERCEL_TEAM_SLUG}}.vercel.app/auth/callback` · `https://*-{{VERCEL_TEAM_SLUG}}.vercel.app/auth/confirm` (staging בלבד; `{{VERCEL_TEAM_SLUG}}` מוחלף בשם הצוות ב-Vercel)
   - `http://localhost:3000/auth/callback` · `http://localhost:3000/auth/confirm` (staging ו-local בלבד)
6. **Auth → Providers:**
   - **Email:** פעיל. כניסה בקישור קסם ובקוד בן 6 ספרות (Email OTP length = 6, ‏OTP expiry = ‏3600 שניות). "Secure email change" פעיל. אין טופס סיסמה במוצר; לא חושפים `signInWithPassword` בשום מקום.
   - **Google:** פעיל. ב-Google Cloud Console: מסך הסכמה עם שם האפליקציה `{{BRAND_NAME}}`, דומיין מורשה `{{DOMAIN}}`, ‏Authorized redirect URI ‏`https://<project-ref>.supabase.co/auth/v1/callback`, ‏scopes ‏`openid email profile`. ה-Client ID וה-Secret נשמרים ב-Dashboard של Supabase בלבד (לא ב-env של האפליקציה). מומלץ לפני ההשקה: Custom Domain ‏(`auth.{{DOMAIN}}`) כדי שמסך ההסכמה של Google יציג את הדומיין שלנו ולא `supabase.co`. כשהוא פעיל, `NEXT_PUBLIC_SUPABASE_URL` = ‏`https://auth.{{DOMAIN}}`; ה-CSP (`buildCsp`) ו-`images.remotePatterns` ב-`next.config` גוזרים ממנו את `https://<host>` ואת `wss://<host>` (ל-`img-src`, ‏`media-src`, ‏`connect-src`), כך שהמעבר לא דורש שינוי קוד (חלק 06 §15.3; ‏§17.1).
   - **Phone:** כבוי. מופעל רק כשדגל `phone_otp` דולק, דרך Send SMS Hook מסוג HTTP שמצביע ל-`https://{{DOMAIN}}/api/auth/hooks/send-sms` (§22.6). לא משתמשים ב-Edge Function לזה.
7. **Auth → SMTP:** ‏Custom SMTP של Resend לפני כל בדיקה עם משתמשים אמיתיים (שולח ברירת המחדל מוגבל לכמה מיילים בשעה ונועד לבדיקות בלבד). Host ‏`smtp.resend.com`, ‏Port ‏465, ‏User ‏`resend`, ‏Password = מפתח Resend ייעודי ל-SMTP, ‏Sender ‏`hello@{{DOMAIN}}`, ‏Sender name ‏`{{BRAND_NAME}}`. דומיין השולח מאומת ב-Resend (SPF, DKIM, DMARC).
8. **Auth → Rate Limits:** מיילים בשעה: 120; אימותי OTP: ‏30 ל-5 דקות לכל IP; רענון טוקן: ‏150 ל-5 דקות לכל IP. המגבלה שלנו על `/auth/callback` ו-`/auth/confirm` (10 ל-10 דקות לכל IP, §18.6) היא שכבה נוספת מעל זה.
9. **Auth → Multi-Factor → TOTP:** פעיל (רישום ואימות). אימות דו-שלבי הוא חובה למנהלי פלטפורמה: `is_platform_admin()` מחזירה `true` רק ב-session ברמת `aal2`, ו-`proxy.ts` מפנה מנהל בלי MFA ל-`/admin/mfa` (§9.2, §17.2, חלק 06 §15.4). למשתמשים רגילים MFA לא נדרש ולא מוצע ב-MVP.
10. **Auth → Email Templates:** ראו 1.3.
11. **Storage:** ‏Global file size limit ‏2 GB (מספיק ל-`exports`; לכל bucket יש מגבלה נמוכה יותר, §13). Image transformations פעיל (Pro) לתמונות ממוזערות בספריית המדיה.
12. **Realtime → Settings:** מבטלים "Allow public access" — רק ערוצים פרטיים (`private: true`), שההרשאה שלהם נקבעת ב-RLS על `realtime.messages` (§14).
13. **Database → Extensions:** לא מפעילים ידנית; המיגרציה הראשונה מפעילה את מה שצריך (§3). **Vault:** יוצרים סוד `trial_hash_pepper` עם אותו ערך כמו `TRIAL_HASH_PEPPER` ב-Vercel:
    ```sql
    select vault.create_secret('<same value as TRIAL_HASH_PEPPER>', 'trial_hash_pepper', 'Pepper for trial_claims hashes');
    ```
    בסביבת local, `supabase/tests/00_helpers.sql` וסקריפט ה-seed יוצרים סוד בדיקה קבוע.
14. **Database → Settings:** ‏SSL enforcement פעיל. **Network restrictions כבויות בהשקה:** ה-runners של GitHub (hosted) אין להם IP יציא קבוע, ושם רצים גם השחרור (`migrate-production`) וגם `backup.yml`, כך שהגבלה לפי IP הייתה חוסמת אותם. בקרות מפצות: SSL enforcement פעיל; סיסמת `postgres` חזקה, שמוחלפת כל רבעון ואחרי כל שינוי בצוות; התפקיד `backup_reader` עם הרשאות מינימליות (§15b); מחרוזות החיבור נמצאות רק ב-GitHub secrets; ואין פרטי חיבור ישיר ל-5432 על מחשבי המפתחים (מפתחים עובדים דרך `supabase db` עם ההתחברות של ה-CLI). כדי להפעיל את ההגבלה צריך קודם runner עם IP יציא קבוע (self-hosted או larger runner) ולהוסיף אותו לרשימת ההיתר. ההחלטה נרשמת ב-`DECISIONS.md` ונשארת פריט פתוח בחלק 06 §25. האפליקציה מדברת עם המסד דרך HTTPS ולא מושפעת. ‏`statement_timeout`: ‏`authenticated` ‏8s, ‏`anon` ‏3s (מוגדר במיגרציה 0008).
15. **Billing:** ‏Spend cap כבוי בפרודקשן (כדי שחריגה לא תשבית את השירות), עם התראות שימוש ב-50%, 80% ו-100% של המכסות. ב-staging ‏Spend cap פעיל.
16. **Backups:** גיבוי יומי (כלול ב-Pro). PITR נרכש ומופעל ב-M7, לפני משתמשים משלמים. הגיבוי הלוגי השבועי רץ עם התפקיד `backup_reader` (§15b); ה-runbook לשחזור נמצא בחלק 06.

**Edge Functions לא בשימוש.** המגבלות שלהן (זמן ריצה של 150 שניות ב-Free ו-400 שניות בתוכנית בתשלום, 2 שניות CPU לבקשה, ‏256MB זיכרון, ו-504 אחרי 150 שניות בלי תשובה — בלי אפשרות להאריך) לא מתאימות לשום דבר כבד אצלנו, וכל הלוגיקה רצה ב-Vercel (Node.js, ‏`fra1`). גם hooks של Auth עוברים ל-Route Handler.

### 1.3 תבניות המייל של Auth (עברית, RTL)

שימו לב: בתבניות של Supabase הסוגריים `{{ .Token }}` הם משתני Go. את `{{BRAND_NAME}}` ו-`{{DOMAIN}}` **מחליפים בערך האמיתי לפני השמירה ב-Dashboard** — אחרת שמירת התבנית נכשלת על שגיאת תבנית. התבנית זהה ל-"Magic Link" ול-"Confirm signup" (שתיהן עוברות דרך `/auth/confirm` עם `type=email`).

- **Subject:** `קישור הכניסה שלכם ל{{BRAND_NAME}}`
- **Body:**

```html
<!doctype html>
<html lang="he" dir="rtl">
  <body style="margin:0;padding:24px;background:#FAF7F2;color:#16140F;direction:rtl;text-align:right;font-family:Heebo,Arial,'Segoe UI',sans-serif;">
    <table role="presentation" dir="rtl" width="100%" style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:14px;padding:32px;direction:rtl;">
      <tr><td align="right" style="text-align:right">
        <h1 style="font-size:24px;margin:0 0 16px;">כניסה ל{{BRAND_NAME}}</h1>
        <p style="font-size:17px;line-height:1.7;margin:0 0 24px;">לחצו על הכפתור כדי להיכנס לחשבון. הקישור תקף לשעה אחת ולכניסה אחת.</p>
        <p style="margin:0 0 24px;">
          <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
             style="display:inline-block;background:#FFB547;color:#0A0A0F;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;">כניסה לחשבון</a>
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">נכנסים ממכשיר אחר? אפשר להקליד את הקוד:</p>
        <p style="font-size:28px;font-weight:800;letter-spacing:4px;margin:0 0 24px;" dir="ltr">{{ .Token }}</p>
        <p style="font-size:13px;color:#6F6A60;margin:0;">לא ביקשתם להיכנס? אפשר להתעלם מהמייל הזה, ושום דבר לא ישתנה בחשבון.</p>
      </td></tr>
    </table>
  </body>
</html>
```

- **Change email address** — Subject: `אישור כתובת המייל החדשה ב{{BRAND_NAME}}`; גוף זהה, עם הכותרת "אישור כתובת מייל חדשה", הטקסט "לחצו כדי לאשר שזו כתובת המייל החדשה שלכם. עד שתאשרו, הכתובת הקודמת נשארת פעילה.", כפתור "אישור הכתובת", והקישור `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change`.
- `/auth/confirm` (חלק 03 §3) מקבל `next` גם כ-URL מלא (מה-`RedirectTo`), ממיר אותו לנתיב יחסי רק אם ה-origin שלו הוא `NEXT_PUBLIC_SITE_URL`, ואחרת משתמש ב-`/app`.
- הזמנות לצוות **לא** עוברות דרך תבנית ה-Invite של Supabase; הן נשלחות מהאפליקציה (מייל `team_invite`, חלק 06) עם הקישור `https://{{DOMAIN}}/login?invite={token}&email={urlencoded email}&next=/app`. ‏`email` רק ממלא מראש את שדה המייל בדף הכניסה (ה-`before_send` של PostHog מסיר את `invite` ואת `email` מכל URL שנשלח); אחרי הכניסה `/auth/callback` קורא ל-`POST /api/invites/accept` (§20.6).

### 1.4 `supabase/config.toml` (local)

```toml
project_id = "{{BRAND_NAME_EN}}"

[api]
port = 54321
schemas = ["public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
major_version = 17

[db.seed]
enabled = false            # seeding is done by `pnpm db:seed` (supabase/seed/seed.ts), never by seed.sql

[realtime]
enabled = true

[storage]
enabled = true
file_size_limit = "2GiB"

[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:3000/auth/callback", "http://localhost:3000/auth/confirm"]
jwt_expiry = 3600
enable_refresh_token_rotation = true
refresh_token_reuse_interval = 10
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true
otp_length = 6
otp_expiry = 3600

[auth.email.template.magic_link]
subject = "קישור הכניסה שלכם"
content_path = "./supabase/templates/magic_link.html"

[auth.email.template.confirmation]
subject = "קישור הכניסה שלכם"
content_path = "./supabase/templates/magic_link.html"

[auth.mfa.totp]
enroll_enabled = true      # platform admins must reach aal2 (§9.2, §17.2)
verify_enabled = true

# env() below reads SUPABASE_AUTH_GOOGLE_CLIENT_ID and SUPABASE_AUTH_GOOGLE_SECRET from the developer's shell:
# local Supabase CLI only — never in lib/env.ts or in Vercel (hosted projects keep them in the Supabase Dashboard)
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
skip_nonce_check = true    # local only

[auth.sms]
enable_signup = false

[inbucket]
enabled = true             # local mail catcher at http://localhost:54324
```

`major_version` חייב להתאים לגרסת Postgres של פרויקט הפרודקשן [M0-verify: הגרסה שהפרויקט נוצר איתה]. ‏`supabase/templates/magic_link.html` הוא התבנית מ-1.3 עם שם המותג מוחלף.

### קריטריוני קבלה
- [ ] ב-Vercel אין אף משתנה עם `anon` או `service_role`; ‏`scripts/check-env.ts` נכשל אם ערך `SUPABASE_SECRET_KEY` לא מתחיל ב-`sb_secret_` או ש-`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` לא מתחיל ב-`sb_publishable_`.
- [ ] כניסה בקישור קסם ממייל שנפתח במכשיר אחר עובדת עם הקוד בן 6 הספרות; המייל מגיע מ-`hello@{{DOMAIN}}` דרך Resend, בעברית ומימין לשמאל.
- [ ] redirect לכתובת שאינה ברשימת ההיתר נדחה על ידי Supabase; `next=https://evil.com` מסתיים ב-`/app`.
- [ ] ערוץ Realtime ציבורי (`private: false`) נדחה בפרודקשן.
- [ ] הסוד `trial_hash_pepper` קיים ב-Vault בכל סביבה, והבדיקה `select count(*) from vault.decrypted_secrets where name = 'trial_hash_pepper'` מחזירה 1.
- [ ] ב-staging, `supabase.auth.mfa.enroll({ factorType: "totp" })` ואחריו `challenge` + `verify` מעלים את ה-session ל-`aal2`, ו-`select public.platform_admin_status()` של מנהל עובר מ-`needs_mfa` ל-`ok`.

---

## §2. מיגרציות: תהליך עבודה עם Supabase CLI

### 2.1 קבצים וסדר

```
supabase/
├─ config.toml
├─ templates/magic_link.html
├─ migrations/
│  ├─ 0001_extensions_enums.sql
│  ├─ 0002_tenancy.sql
│  ├─ 0003_catalog.sql
│  ├─ 0004_projects_jobs.sql
│  ├─ 0005_credits_billing.sql
│  ├─ 0006_sharing_ops.sql
│  ├─ 0007_functions.sql
│  ├─ 0008_rls.sql
│  ├─ 0009_storage.sql
│  ├─ 0010_realtime.sql
│  ├─ 0011_cron.sql
│  ├─ 0012_ops_roles.sql
│  ├─ 0013_meta_integration.sql   (after launch; full SQL in part 07)
│  └─ 0014_trends.sql             (after launch; full SQL in part 08 + the part 04 block of §2.3)
├─ tests/ 00_helpers.sql … 10_billing_ops.sql, 11_meta_rls.sql, 12_trends_rls.sql (§25)
└─ seed/ seed.ts · schemas.ts · data/*.json (§16)
```

- **עד ההשקה, כל אובייקט חדש נכנס לקובץ הנושאי שלו** (מ-`0013` והלאה — קבצים חדשים בלבד, §2.3), כי שום מיגרציה עוד לא רצה ב-staging או בפרודקשן: זהות וסביבות ← `0002`, קטלוג ← `0003`, פרויקטים ועבודות ← `0004`, קרדיטים וחיוב ← `0005`, שיתוף ותפעול ← `0006`, פונקציות וטריגרים ← `0007`, RLS והרשאות ← `0008`, אחסון ← `0009`, Realtime ← `0010`, pg_cron ← `0011`. הקובץ `0012_ops_roles.sql` מכיל רק את התפקיד `backup_reader` (§15b).
- ה-CLI מזהה קבצים לפי התבנית `<מספר>_<שם>.sql` וממיין לפי המספר. [M0-verify] שגרסת ה-CLI המותקנת מקבלת קידומת בת 4 ספרות; אם היא דורשת חותמת זמן בת 14 ספרות, משנים לקידומות `20261013000001_extensions_enums.sql` … באותו סדר ובאותם שמות, ומתעדים ב-`DECISIONS.md`.
- מיגרציה חדשה אחרי ההשקה: `supabase migration new <name>`, ואז שינוי השם לקידומת הבאה (`0013_<name>.sql`). **אסור לערוך מיגרציה שכבר רצה ב-staging או בפרודקשן.** תיקון = מיגרציה חדשה.
- שינוי הרסני (מחיקת עמודה, שינוי סוג) נעשה בשני שלבים: expand (עמודה חדשה + כתיבה כפולה) ← פריסה ← contract (מחיקת הישנה) במיגרציה נפרדת.
- כל טבלה חדשה במיגרציה עתידית חייבת: `enable row level security`, מדיניות מפורשת, טריגר `set_updated_at` אם יש לה `updated_at`, ו-grants מפורשים. בדיקת הסכמה ב-§25 נכשלת אם משהו מזה חסר.

### 2.2 פקודות (`package.json`)

```json
{
  "scripts": {
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase db reset",
    "db:seed": "tsx supabase/seed/seed.ts",
    "seed:sync": "python3 -I seed/scripts/build_seed.py --check && python3 -I seed/scripts/build_trends.py --check && tsx scripts/seed-sync.ts",
    "db:types": "supabase gen types typescript --local --schema public > lib/supabase/database.types.ts && prettier --write lib/supabase/database.types.ts",
    "db:test": "supabase test db",
    "db:lint": "supabase db lint --level warning --fail-on warning",
    "db:diff": "supabase db diff --schema public,storage",
    "db:push": "supabase db push"
  }
}
```

| פקודה | מתי | מה בודקים |
|---|---|---|
| `pnpm db:reset && pnpm db:seed` | אחרי כל שינוי מיגרציה, וב-CI בכל PR | שתי הרצות רצופות של `db:seed` עוברות (אידמפוטנטיות) |
| `pnpm seed:sync` | אחרי כל שינוי ב-`/seed` (נספחים A–C, ותבניות הטרנדים של חלק 08) | `build_seed.py --check` ו-`build_trends.py --check` עוברים, ושמונת קובצי ה-JSON של `/seed` (ששת הקבצים הקנוניים, `niche_extras.json` ו-`trend_templates.json`) זהים לעותקים ב-`supabase/seed/data/` (ב-CI: `git diff --exit-code supabase/seed/data`) |
| `pnpm db:types` | אחרי כל שינוי סכמה | ב-CI: `git diff --exit-code lib/supabase/database.types.ts` — טיפוסים שלא עודכנו מכשילים את ה-PR |
| `pnpm db:lint` | ב-CI | ‏plpgsql_check על כל הפונקציות; אזהרות = שגיאה |
| `pnpm db:test` | ב-CI | כל קובצי pgTAP ב-§25 |
| `pnpm db:diff` | לפני merge | אין drift בין המיגרציות למסד המקומי |
| `supabase link --project-ref $SUPABASE_PROJECT_REF && pnpm db:push` | CI בלבד, על `main`, אחרי שכל הבדיקות ירוקות: קודם staging, ואחרי אישור ידני production | פריסת מיגרציות; זרימת ה-CI המלאה בחלק 06 |

`SUPABASE_DB_URL` (חיבור ישיר, ‏session pooler) משמש רק את ה-CI ואת בדיקות המקביליות ב-Vitest (§25.4); האפליקציה עצמה לא פותחת חיבורי Postgres — כל הגישה עוברת ב-supabase-js מעל HTTPS.

### 2.3 מיגרציות אחרי ההשקה: `0013` ו-`0014`

שתי המיגרציות של הרחבת 2026-10-17 הן קבצים חדשים, ואף אחת מהן לא עורכת קובץ מ-`0001`–`0012`. ה-DDL המלא, ה-RLS, הפונקציות, הטריגרים וה-pg_cron שלהן כתובים בחלקים 07 ו-08. כאן נמצאים האינדקס, הכללים שחלים עליהן, והבלוק היחיד שחלק 04 הוא הבעלים שלו.

| קובץ | הבעלים של ה-SQL | מי משתמש בו | מה יש בו (בקצרה) |
|---|---|---|---|
| `0013_meta_integration.sql` | חלק 07 | הקוד של M9–M10; הקובץ עצמו נכנס כבר במיזוג של M8 (ראו "סדר" למטה) | ערכים חדשים ל-`webhook_provider`, `notification_kind` (8), `ai_task` ו-`consent_kind`; ה-check של `consents.source` נבנה מחדש עם `meta_connect`; 14 enum-ים חדשים (12 של Meta, `landing_page_status`, `lead_source`); 18 טבלאות (14 של Meta, `landing_pages`, `ad_health_reports`, `content_plans`, `content_plan_items`), כולל `leads.source lead_source`; 7 פונקציות (`meta_spend_summary`, `_managed_spend_cap_ils`, `refresh_managed_spend`, `ad_budget_changes_last_hour`, `purge_meta_data`, `purge_leads`, `landing_page_public`); טריגרי Realtime (§14.1); 2 משימות pg_cron (§15) |
| `0014_trends.sql` | חלק 08, ועוד הבלוק של חלק 04 שלמטה | M8 | ערכים ל-`ai_task`; 8 enum-ים; 6 טבלאות; העמודות החדשות ב-`projects`, `scenes` ו-`workspaces`; ה-FK המאוחרים לעמודות `trend_template_id` של `0013`; 3 פונקציות (`trend_feed`, `refresh_trend_template_stats`, `trend_template_benchmark`); ה-bucket `trend-refs` ו-`video/webm` ב-`uploads` (§13.1); משימת pg_cron אחת; העמודה `project_versions.hook_score` |

**סכומים אחרי שתי המיגרציות:** 58 טיפוסי enum (36 + 22), 24 טבלאות חדשות ו-14 משימות pg_cron (11 + 3).

**סדר.** ה-CLI מריץ קבצים לפי המספר, ו-`supabase db push` מסרב להריץ קובץ שהמספר שלו נמוך מהאחרון שכבר רץ (אלא עם `--include-all`). `0014` מוסיף FK לעמודות `trend_template_id` שנוצרות ב-`0013`, ולכן `0013` חייב לרוץ לפניו. מכאן ההחלטה: **שני הקבצים נכנסים יחד במיזוג הראשון של M8.** הטבלאות של Meta, של דף העסק ושל תוכנית 30 יום נוצרות אז ונשארות בלי שימוש עד M9–M10, כי כל הנתיבים שלהן מחזירים 404 כל עוד הדגלים כבויים. לכן `0013` צריך להיות שלם כבר במיזוג של M8, כולל הטבלאות של M9 ו-M10. כל שינוי סכמה שיתגלה אחר כך נכנס לקובץ חדש (`0015_…`), לפי הכלל של §2.1.

**כללים לכל קובץ אחרי ההשקה** (בנוסף ל-§2.1; בדיקות ה-pgTAP של §25.2 אוכפות אותם):
1. **ערכי enum חדשים** יושבים בראש הקובץ, ב-`alter type … add value if not exists …`, ואף משפט באותו קובץ לא משתמש בהם (§3).
2. **טבלה חדשה:** `enable row level security`, ואז `revoke all on public.<table> from anon, authenticated;` ורק אחריו grants מפורשים. ה-revoke הגורף של `0008` חל רק על הטבלאות שהיו קיימות אז, וברירות המחדל של Supabase נותנות לטבלה חדשה ב-`public` את כל ההרשאות ל-`anon` ול-`authenticated` [M0-verify את ה-default ACL בפרויקט]. בכל טבלאות ההרחבה הכתיבה היא בצד השרת בלבד, ולכן אף אחת מהן לא מקבלת `insert`, `update` או `delete` ל-`authenticated`. החריג היחיד הוא העמודה `workspaces.benchmarks_opt_out` (grant עמודה, §12.7).
3. **פונקציה חדשה:** `set search_path = ''`; `revoke execute … from public, anon, authenticated;`; `grant execute … to service_role` רק לפונקציות שהשרת קורא להן; ורק אחר כך ה-grants ל-`anon` או ל-`authenticated` שמופיעים ב-§12.7. פונקציה שמקבלת מזהה סביבה ופתוחה ל-`authenticated` מתחילה בבדיקת הגישה של R39 (`can_access_workspace` או מנהל פלטפורמה), ואחרת מחזירה `null` או אפס שורות.
4. **מפתח זר ל-`profiles`** הוא תמיד `on delete set null`, והעמודה nullable, כדי שמחיקת חשבון לא תיחסם (§9.6). זה כולל את `trend_references.rights_attested_by`.
5. **טריגר ששולח ל-Realtime** בנוי כמו `broadcast_job_change` (§14.1): `security definer`, payload מצומצם, `exception when others` שלא מפיל את הכתיבה, ו-revoke בלי grant.

**הבלוק של חלק 04 בתוך `0014_trends.sql`** (ציון הוק, §19.10). חלק 08 מעתיק אותו כלשונו לסוף הקובץ:

```sql
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

### קריטריוני קבלה
- [ ] `pnpm db:reset && pnpm db:seed && pnpm db:seed` מסתיים בהצלחה על מכונה נקייה.
- [ ] `pnpm db:reset` מריץ את `0001`–`0014` לפי הסדר; הרצה של `0014` על מסד בלי `0013` נכשלת על ה-FK המאוחרים.
- [ ] אחרי `db reset`, עדכון `hook_score = '{"score":72}'` בלקוח הסודי לא משנה את `updated_at` של הגרסה; `'{"score":101}'` ו-`'{"x":1}'` נכשלים ב-check.
- [ ] `pnpm db:types` לא משנה את הקובץ המחויב ב-git אחרי reset.
- [ ] `pnpm db:lint` ו-`pnpm db:test` ירוקים ב-CI; PR שמוסיף טבלה בלי RLS נכשל.
- [ ] ה-CI לא מריץ `db push` לפרודקשן בלי אישור ידני.

---

## §3. הרחבות ו-enum-ים — `0001_extensions_enums.sql`

הרחבות מותקנות בסכמה `extensions` (ברירת המחדל של Supabase), ולכן כל פונקציה עם `set search_path = ''` קוראת להן בשם מלא: `extensions.digest(...)`, `extensions.hmac(...)`, `extensions.word_similarity(...)`, האופרטור `operator(extensions.<%)`, והטיפוס `extensions.citext`.

```sql
-- 0001_extensions_enums.sql
create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext   with schema extensions;
create extension if not exists pg_trgm  with schema extensions;
create extension if not exists pg_cron;                         -- creates schema "cron"
create extension if not exists pg_net   with schema extensions; -- optional; not used by app logic today
create extension if not exists supabase_vault;                  -- preinstalled on hosted projects

create type public.workspace_type      as enum ('personal','business','agency','client');
create type public.member_role         as enum ('owner','admin','editor','viewer');      -- order matters: owner < admin < editor < viewer
create type public.compliance_flag     as enum ('none','medical','legal','financial','real_estate','alcohol','political','other');
create type public.platform            as enum ('reels','tiktok','shorts','facebook','youtube','whatsapp','linkedin');
create type public.hook_goal           as enum ('awareness','leads','sales','trust','engagement');
create type public.hook_gender         as enum ('neutral','plural','male','female');
create type public.audience_gender     as enum ('plural','female','male');
create type public.voice_gender        as enum ('male','female');
create type public.register            as enum ('formal','warm','casual','slang');
create type public.video_type          as enum ('brand_promo','reel_hook','offer','testimonial','launch','recruiting','explainer');
create type public.aspect_ratio        as enum ('9:16','1:1','16:9');
create type public.quality_tier        as enum ('draft','standard','premium');
create type public.visual_mix          as enum ('images','smart','full');
create type public.visual_source       as enum ('ai_clip','ai_image_kenburns','user_media','user_photo_animated','brand_card','stock_broll');
create type public.project_stage       as enum ('draft','brief','script','storyboard','voice','captions','assets','render','done','failed');
create type public.job_kind            as enum ('full_generate','regenerate_scene','rerender');
create type public.job_status          as enum ('queued','running','waiting_external','succeeded','failed','canceled');
create type public.job_stage           as enum ('queued','voice','captions','keyframes','clips','music','render','finalize','done');
create type public.step_status         as enum ('pending','running','waiting_external','succeeded','failed','skipped','canceled','degraded');
create type public.asset_kind          as enum ('logo','brand_image','upload_image','upload_video','keyframe','clip','voiceover','music','sfx','render','poster','captions_json','captions_srt','captions_vtt','thumbnail','export_zip');
create type public.asset_source        as enum ('upload','openrouter','render','system','library');
create type public.ai_task             as enum ('llm_brand','llm_script','llm_storyboard','llm_hooks','llm_rewrite','llm_moderation','llm_utility','image','video','tts','stt','music','avatar');
create type public.model_task          as enum ('llm','image','video','tts','stt','music','avatar');
create type public.ledger_kind         as enum ('grant_trial','grant_plan','grant_rollover','purchase','promo','reserve','capture','release','refund','adjustment','expire');
create type public.grant_source        as enum ('trial','plan_cycle','rollover','topup','promo','admin','goodwill');
create type public.reservation_status  as enum ('open','settled','refunded');
create type public.billing_cycle       as enum ('monthly','annual');
create type public.subscription_status as enum ('active','past_due','canceled','expired');
create type public.payment_kind        as enum ('subscription_initial','subscription_renewal','topup','plan_change','refund');
create type public.payment_status      as enum ('pending','succeeded','failed','refunded','partially_refunded');
create type public.invoice_doc_type    as enum ('tax_invoice_receipt','receipt','credit_invoice');   -- 'receipt' is never issued: עוסק פטור is not supported (part 06 §9.2)
create type public.consent_kind        as enum ('terms','privacy','marketing_email','marketing_sms','marketing_whatsapp','analytics_cookies','biometric_voice','biometric_likeness','ai_content_policy');
create type public.webhook_provider    as enum ('openrouter','payment','invoice','resend','render','whatsapp');   -- whatsapp: v2 (§22.6)
create type public.share_kind          as enum ('public_view','client_approval');
create type public.approval_status     as enum ('pending','approved','changes_requested');
create type public.notification_kind   as enum ('job_succeeded','job_failed','credits_low','payment_failed','approval_received','invite','system');

-- Future functions are private by default; 0008 grants execute explicitly.
-- Postgres grants EXECUTE to PUBLIC on every new function through the GLOBAL default ACL, which a per-schema
-- "revoke" cannot remove. So both forms are needed:
--   1. the global form removes the PUBLIC default for functions created by the migration role;
--   2. the per-schema form is kept for Supabase's per-schema grants to anon/authenticated.
-- This is still not enough on its own: every migration from 0009 on ends with an explicit
-- "revoke execute on function … from public, anon, authenticated;" before its own grant,
-- and the pgTAP allow-list test (§25.2) enforces the result.
alter default privileges revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
```

- `linkedin` שמור לנישות B2B ולא מופיע ב-seed בהשקה; סכמת `HookBatchV1` (חלק 05) לא מתירה אותו עדיין.
- סדר הערכים ב-`member_role` הוא חוזה: `effective_role()` (§9) בוחרת את התפקיד החזק ביותר לפי סדר ה-enum.
- הוספת ערך ל-enum **אחרי ההשקה**: `alter type … add value if not exists '…'` **בראש** קובץ מיגרציה חדש (`0013` והלאה), בתנאי שאף משפט באותו קובץ לא משתמש בערך: לא ברירת מחדל, לא `check`, לא מדיניות, לא תנאי של אינדקס חלקי, לא גוף של פונקציה בשפת `sql` (שנבדק כבר ביצירה), ולא `insert`. ערך חדש לא שמיש לפני שהטרנזקציה שהוסיפה אותו נסגרה, ולכן הוא משמש רק בזמן ריצה, מקוד האפליקציה או מגוף `plpgsql` שמתפענח רק כשהוא רץ. אף פעם לא מוחקים ערך. הערך `whatsapp` ב-`webhook_provider` (ה-webhook של WhatsApp ב-v2) כתוב ישירות ב-`0001`, כי אז שום מיגרציה עוד לא רצה; שאר הערכים שנוספו לפני ההשקה (`consents.source`, `abuse_reports.source`, `email_messages.status`) הם `check` על עמודת טקסט.
- **ערכים שנוספים אחרי ההשקה** (בראש `0013` ו-`0014`, לפי הכלל שלמעלה): `webhook_provider` + `meta`; `notification_kind` + `meta_campaign_live`, `meta_ad_rejected`, `meta_connection_lost`, `lead_received`, `spend_cap_warning`, `social_post_published`, `social_post_failed`, `weekly_results`; `ai_task` + `llm_ads` (ב-`0013`) ו-`llm_trend_analysis`, `llm_trend_template`, `llm_guided` (ב-`0014`); `consent_kind` + `meta_ads_terms`. ה-check של `consents.source` נבנה מחדש ב-`0013` עם `meta_connect` (drop + add של אותו constraint). 22 טיפוסי enum חדשים נוצרים בשני הקבצים (14 ב-`0013`, 8 ב-`0014`), וסך הכול 58 (§2.3).
- המראות ב-TypeScript נוצרים אוטומטית (`Constants.public.Enums.*` ב-`database.types.ts`) ומיוצאים מ-`lib/supabase/enums.ts` (§17.4). לא כותבים איחודי מחרוזות ידנית.

### קריטריוני קבלה
- [ ] `select count(*) from pg_type t join pg_namespace n on n.oid = t.typnamespace where n.nspname = 'public' and t.typtype = 'e'` מחזיר 36 אחרי `0001`–`0012`, ו-58 אחרי `0014`.
- [ ] `select enum_range(null::public.webhook_provider)` אחרי `0013` מסתיים ב-`meta`, ו-`0013` עובר `db reset` על מסד נקי (אף משפט בו לא משתמש בערכים שהוא מוסיף).
- [ ] `select enum_range(null::public.member_role)` מחזיר `{owner,admin,editor,viewer}` בסדר הזה.
- [ ] כל ההרחבות קיימות אחרי `db reset`, ו-`pg_trgm` נמצאת בסכמה `extensions`.

---

## §4. זהות וריבוי דיירים — `0002_tenancy.sql`

**כללים לכל הטבלאות (§4–§8):** ‏snake_case, שמות טבלאות ברבים, `created_at timestamptz not null default now()` בכל טבלה, `updated_at` בכל טבלה שמשתנה (מתוחזק בטריגר `set_updated_at()` שמוצמד ב-0007), מזהה `uuid primary key default gen_random_uuid()` חוץ מטבלאות הקטלוג (מפתח טקסט). כל עמודה היא `not null` אלא אם צוין אחרת. מפתחות זרים שמצביעים על טבלה שנוצרת במיגרציה מאוחרת יותר נוספים בסוף המיגרציה של טבלת היעד ("FK מאוחר"), ומסומנים כאן בהערה.

```sql
-- 0002_tenancy.sql
create table public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  full_name               text check (full_name is null or char_length(full_name) <= 120),
  avatar_url              text,
  phone                   text,
  ui_gender_form          public.audience_gender not null default 'plural',
  theme                   text not null default 'dark' check (theme in ('dark','light','system')),
  reduce_motion           boolean not null default false,
  larger_captions         boolean not null default false,
  is_platform_admin       boolean not null default false,
  last_workspace_id       uuid,                       -- FK below
  onboarding_completed_at timestamptz,
  trial_claimed_at        timestamptz,
  trial_status            text check (trial_status in ('granted','already_claimed','disposable_email','no_identifier')),
  notification_prefs      jsonb not null default '{}' check (jsonb_typeof(notification_prefs) = 'object'),
                          -- {kinds:{<notification_kind>:{email,whatsapp}}, whatsapp?:{phone_e164,verified_at,opted_in_at,opted_out_at}}
  deleted_at              timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table public.workspaces (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null check (char_length(btrim(name)) between 1 and 80),
  slug                 text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'),
  type                 public.workspace_type not null default 'business',
  parent_workspace_id  uuid references public.workspaces(id) on delete restrict,
  owner_id             uuid references public.profiles(id) on delete set null,
  plan_id              text not null default 'free',  -- FK plans in 0005
  has_paid             boolean not null default false,
  white_label          boolean not null default false,
  default_brand_kit_id uuid,                           -- FK below
  niche_slug           text,                           -- FK niches in 0003
  plan_override        jsonb check (plan_override is null or plan_override ?& array['plan_id','until','reason']),
  deleted_at           timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint workspaces_client_parent check ((type = 'client') = (parent_workspace_id is not null)),
  constraint workspaces_owner_present check (owner_id is not null or deleted_at is not null)
);
create index workspaces_owner_idx  on public.workspaces (owner_id);
create index workspaces_parent_idx on public.workspaces (parent_workspace_id);

alter table public.profiles
  add constraint profiles_last_workspace_fk foreign key (last_workspace_id) references public.workspaces(id) on delete set null;

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  role         public.member_role not null,
  invited_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index workspace_members_user_idx on public.workspace_members (user_id);
create unique index workspace_members_one_owner on public.workspace_members (workspace_id) where role = 'owner';

create table public.workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email        extensions.citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role         public.member_role not null check (role <> 'owner'),
  token_hash   text not null unique,                     -- hex(sha256(token)); the raw token exists only in the email
  invited_by   uuid not null references public.profiles(id) on delete cascade,
  expires_at   timestamptz not null default now() + interval '7 days',
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index workspace_invites_ws_idx on public.workspace_invites (workspace_id);
create unique index workspace_invites_pending_email on public.workspace_invites (workspace_id, email) where accepted_at is null;

create table public.business_profiles (
  workspace_id       uuid primary key references public.workspaces(id) on delete cascade,
  business_name      text not null check (char_length(business_name) between 1 and 120),
  niche_slug         text,                                -- FK niches in 0003
  city               text,
  area               text,
  website_url        text,
  instagram_url      text,
  facebook_url       text,
  phone              text,
  whatsapp           text,
  address            text,
  services           jsonb not null default '[]' check (jsonb_typeof(services) = 'array'),  -- [{name_he, name_def_he, gender:"m"|"f"}]
  usp_he             text,
  description_he     text,
  audience_he        text,
  audience_gender    public.audience_gender not null default 'plural',
  register           public.register not null default 'warm',
  preferred_cta      text,
  facts              jsonb not null default '[]' check (jsonb_typeof(facts) = 'array'),     -- [{key, label_he, value}] user-confirmed only
  extracted_from_url text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.brand_kits (
  id                      uuid primary key default gen_random_uuid(),
  workspace_id            uuid not null references public.workspaces(id) on delete cascade,
  name                    text not null check (char_length(btrim(name)) between 1 and 60),
  is_default              boolean not null default false,
  logo_asset_id           uuid,                           -- FK assets in 0004
  logo_dark_asset_id      uuid,                           -- FK assets in 0004
  colors                  jsonb not null default '{"primary":"#FFB547","secondary":"#08080C","accent":"#FF4F7B","text":"#FFFFFF"}'
                          check (colors ?& array['primary','secondary','accent','text']),
  heading_font            text not null default 'Heebo',
  body_font               text not null default 'Heebo',
  caption_preset          text not null default 'bold-pop' check (caption_preset in ('bold-pop','clean-box','karaoke','poster','news','soft')),
  caption_highlight_color text check (caption_highlight_color is null or caption_highlight_color ~ '^#[0-9A-Fa-f]{6}$'),
  intro_style             text not null default 'none' check (intro_style in ('none','logo_reveal','title_card')),
  end_card                jsonb not null default '{"cta_type":"whatsapp","headline_he":"דברו איתנו עוד היום","show_phone":true,"show_whatsapp":true,"show_website":false,"show_address":false,"show_instagram":false,"show_qr":false,"logo_bug":false,"disclaimer_he":null,"license_text_he":null}',
  watermark               jsonb not null default '{"enabled":false,"position":"bottom-end","opacity":0.7}',
  lower_third_style       text not null default 'glass' check (lower_third_style in ('glass','solid','none')),
  default_voice_id        text,                           -- FK voices in 0003
  default_music_mood      text check (default_music_mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  shekel_format           text not null default 'prefix' check (shekel_format in ('prefix','suffix')),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index brand_kits_ws_idx on public.brand_kits (workspace_id);
create unique index brand_kits_one_default on public.brand_kits (workspace_id) where is_default;

alter table public.workspaces
  add constraint workspaces_default_brand_kit_fk foreign key (default_brand_kit_id) references public.brand_kits(id) on delete set null;

create table public.pronunciation_entries (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  term         text not null check (char_length(btrim(term)) between 1 and 60),
  say_as       text not null check (char_length(btrim(say_as)) between 1 and 120),
  note         text check (note is null or char_length(note) <= 200),
  created_by   uuid references public.profiles(id) on delete set null,   -- NULL = author deleted their account (§9.6)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, term)
);
```

הערות:
- **`workspaces.owner_id`** מצביע על בעלי הסביבה, ושורת `owner` ב-`workspace_members` משקפת אותו (שניהם מתעדכנים יחד ב-`transfer_workspace_ownership`, §9). העמודה מותרת כ-NULL **רק** בסביבה שנמחקה (`deleted_at` מלא) — זה מה שמאפשר למחוק משתמש בלי למחוק רשומות פיננסיות שהחוק מחייב לשמור (§9.6).
- **סביבת לקוח** (`type = 'client'`) תמיד עם `parent_workspace_id` של סביבת `agency`; בעליה (`owner_id`) הם בעלי הסוכנות. אין לה בדרך כלל חברים ישירים — הגישה עוברת דרך הסוכנות (`can_access_workspace`, §9).
- **`slug`** נוצר אקראית (`ws-` + 10 תווים hex) ולא נגזר מהשם העברי. הוא לא מופיע ב-URL של האפליקציה (§4.3 בנספח F: סביבה נוכחית = עוגייה `ws`), ומשמש לזיהוי בלוגים ובאדמין.
- **`profiles.trial_status`** נקבע ב-`handle_new_user`: `granted` כשניתנו קרדיטי ניסיון, או הסיבה שלא ניתנו (`already_claimed`, `disposable_email`, `no_identifier`). ‏NULL עד שהטריגר רץ. ממנו הדשבורד בוחר את הכרטיס המתאים (חלק 03 §3.5; ל-`no_identifier` יש כרטיס משלו).
- **`profiles.notification_prefs`** — אובייקט בצורה הקנונית:
  `{ "kinds": { "<notification_kind>": { "email": true, "whatsapp": false } }, "whatsapp": { "phone_e164": "+9725XXXXXXXX", "verified_at": "ISO|null", "opted_in_at": "ISO|null", "opted_out_at": "ISO|null" } }`.
  המפתחות של `kinds` הם ערכי `notification_kind`, ובנוסף מפתח המייל בלבד `monthly_plan` (המייל `monthly_plan_ready`, חלק 06 §12.4; אין לו התראה באפליקציה). מפתח חסר ב-`kinds` = ברירת המחדל: מייל פעיל, וואטסאפ כבוי. ‏`payment_failed` ו-`invite` מתעלמים מ-`email: false` (נשלחים תמיד). סכמת Zod: `NotificationPrefs` ב-`lib/api/contracts/account.ts` (§24.2). המשתמש עורך רק את `kinds` (Server Action `updateProfile`); תת-האובייקט `whatsapp` נכתב רק בנתיבי האימות של WhatsApp (§21.3, v2) וב-webhook של WhatsApp (§22.6).
- **`workspaces.plan_override`** — שינוי תוכנית ידני מהאדמין (`{ "plan_id": "business", "until": "2026-12-31T21:59:59Z", "reason": "…" }`). כל עוד `until` בעתיד, `workspace_plan()` מחזירה את תוכנית ה-override במקום `plan_id`. ‏`PATCH /api/admin/workspaces/[id]/plan-override` עם `{ clear: true }` מאפס את העמודה ל-NULL.
- **`brand_kits.end_card`** — ברירות המחדל של כרטיס הסיום לכל הסביבה: `headline_he` ("דברו איתנו עוד היום"; ה-CTA עצמו נבנה מ-`cta_type`, חלק 05), מתגי `show_*` (כולל `show_instagram`, שהערך שלו נלקח מ-`business_profiles.instagram_url`), ו-`logo_bug` (לוגו קטן בפינה מהשנייה השלישית). פרויקט בודד יכול לדרוס כל אחד מהם ב-`projects.render_options` (§6).

### קריטריוני קבלה
- [ ] אי אפשר ליצור סביבת `client` בלי הורה, ולא סביבה רגילה עם הורה (שתי ההכנסות נכשלות על `workspaces_client_parent`).
- [ ] שתי שורות `owner` לאותה סביבה נכשלות על `workspace_members_one_owner`; שתי ערכות ברירת מחדל נכשלות על `brand_kits_one_default`.
- [ ] הזמנה ממתינה כפולה לאותו מייל באותה סביבה נכשלת; הזמנה עם `role = 'owner'` נכשלת.

---

## §5. קטלוג ציבורי — `0003_catalog.sql`

הצורות של `niche_categories`, `niches`, `hook_families`, `hook_types`, `seasons` ו-`hooks` הן **הצורות הקנוניות של קובצי ה-seed** (נספחים A–C ו-`/seed`), עם עמודות נוספות שקיימות רק במסד ומסומנות "DB-only". ה-seed כותב רק את השדות הקנוניים; עמודות DB-only מקבלות ערך ברירת מחדל בהכנסה ולא נדרסות בהרצה חוזרת (§16).

### 5.1 נרמול עברית לחיפוש

הפונקציה `normalize_he()` היא הבסיס לחיפוש ההוקים (§11.1) ולעמודה המחוללת `hooks.search_text`. היא מסירה ניקוד וטעמים, ממירה גרשיים (״) ומירכאות טיפוגרפיות ל-`"`, גרש (׳) ומירכאות בודדות ל-`'`, מקף עברי (־) ומקפים ארוכים ל-`-`, מורידה אותיות לטיניות לאותיות קטנות ומכווצת רווחים. כך "נדל״ן", ‏"נדל"ן" ו-"נַדְלָ"ן" נמצאים באותו חיפוש.

```sql
-- 0003_catalog.sql
create or replace function public.normalize_he(p text)
returns text
language sql immutable parallel safe
set search_path = ''
as $$
  select btrim(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(lower(coalesce(p, '')), '[־‐-―]', '-', 'g'),   -- maqaf, hyphens, dashes -> '-'
          '[֑-ֽֿ-ׇ]', '', 'g'),                                       -- niqqud + cantillation
        '[״“”„‟″]', '"', 'g'),                               -- gershayim + typographic double quotes
      '[׳‘’‚′`´]', '''', 'g'),                               -- geresh + typographic single quotes
    '\s+', ' ', 'g'));
$$;

create or replace function public.escape_like(p text)
returns text language sql immutable parallel safe set search_path = '' as $$
  select replace(replace(replace(coalesce(p, ''), '\', '\\'), '%', '\%'), '_', '\_');
$$;
```

### 5.2 טבלאות

```sql
create table public.niche_categories (
  slug       text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_he    text not null,
  name_en    text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.niches (
  -- canonical seed fields (exact order of seed/niches.json)
  slug               text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
                                             and slug not in ('types','season','platform','h','new','search','universal')),
  name_he            text not null,
  name_en            text not null,
  category_slug      text not null references public.niche_categories(slug) on update cascade on delete restrict,
  icon               text not null,                                       -- lucide-react component name
  description_he     text not null,
  video_types_he     text[] not null default '{}',
  seasonal_angles_he text[] not null default '{}',
  compliance_flag    public.compliance_flag not null default 'none',
  compliance_note_he text,
  priority           smallint not null check (priority between 1 and 3),
  sort_order         int not null default 0,
  -- DB-only extras
  is_active               boolean not null default true,
  short_name_he           text,                                           -- plural form for "ל…" headings, e.g. "מתווכי נדל״ן"
  seo_title_he            text check (seo_title_he is null or char_length(seo_title_he) <= 60),
  seo_description_he      text check (seo_description_he is null or char_length(seo_description_he) <= 155),
  seo_intro_he            text,                                           -- unique >= 150-word intro for /hooks/[niche]
  seo_reviewed_at         timestamptz,                                    -- /hooks/[niche] is indexable only when set (human review)
  landing_intro_he        text,                                           -- intro for /niches/[niche]
  faq                     jsonb not null default '[]' check (jsonb_typeof(faq) = 'array'),             -- [{q_he, a_he}]
  sample_scripts          jsonb not null default '[]' check (jsonb_typeof(sample_scripts) = 'array'),  -- SampleScript[] (part 02 §4.3)
  default_register        public.register,
  default_audience_gender public.audience_gender,
  default_music_mood      text check (default_music_mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  default_cta             text,
  cover_path              text,
  example_video_path      text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index niches_category_idx on public.niches (category_slug);

create table public.hook_families (
  slug           text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_he        text not null,
  name_en        text not null,
  description_he text not null,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.hook_types (
  slug            text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),  -- the 27 kebab-case slugs; URL segment = slug
  name_he         text not null,
  name_en         text not null,
  family_slug     text not null references public.hook_families(slug) on update cascade on delete restrict,
  description_he  text not null,
  example_he      text not null,
  sort_order      int  not null default 0,
  why_it_works_he text,                                                  -- DB-only
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index hook_types_family_idx on public.hook_types (family_slug);

create table public.seasons (
  slug              text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_he           text not null,
  name_en           text not null,
  date_hint_he      text not null,                   -- human description; never used for scheduling
  publish_window_he text not null,
  niche_slugs       text[] not null default '{}',    -- FK-checked by the seed script and the admin API
  is_quiet_day      boolean not null default false,
  note_he           text,
  sort_order        int not null default 0,
  -- DB-only runtime columns
  starts_on         date,                            -- next occurrence (Hebcal/admin), Israel calendar date
  ends_on           date,
  promo_lead_days   int not null default 14 check (promo_lead_days between 0 and 90),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint seasons_dates check (ends_on is null or starts_on is null or ends_on >= starts_on)
);
create index seasons_niche_slugs_gin on public.seasons using gin (niche_slugs);

create table public.hooks (
  -- canonical seed fields (exact order of seed/hooks.json)
  id                  text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*-[0-9]{2,3}$'),  -- real-estate-01 · universal-01 · seasonal-black-friday-01
  niche_slug          text references public.niches(slug) on update cascade on delete restrict,  -- null = universal
  hook_type_slug      text not null references public.hook_types(slug) on update cascade on delete restrict,
  text_he             text not null check (char_length(text_he) between 3 and 160),
  platforms           public.platform[] not null check (cardinality(platforms) >= 1),
  goal                public.hook_goal not null,
  gender              public.hook_gender not null,
  visual_direction_he text not null,
  placeholders        text[] not null default '{}',
  season_slug         text references public.seasons(slug) on update cascade on delete restrict,
  compliance_note_he  text,
  is_featured         boolean not null default false,
  -- DB-only extras
  secondary_type_slug text references public.hook_types(slug) on update cascade on delete set null,
  status              text not null default 'published' check (status in ('draft','published','archived')),
  source              text not null default 'seed' check (source in ('seed','admin','ai_batch')),
  sample_video_path   text,
  copies_count        int not null default 0 check (copies_count >= 0),
  generations_count   int not null default 0 check (generations_count >= 0),
  search_text         text generated always as (public.normalize_he(text_he)) stored,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index hooks_niche_type_idx   on public.hooks (niche_slug, hook_type_slug);
create index hooks_platforms_gin    on public.hooks using gin (platforms);
create index hooks_season_idx       on public.hooks (season_slug);
create index hooks_featured_idx     on public.hooks (is_featured) where is_featured;
create index hooks_status_niche_idx on public.hooks (status, niche_slug);
create index hooks_search_trgm      on public.hooks using gin (search_text extensions.gin_trgm_ops);

create materialized view public.hook_popularity as
  select h.id as hook_id, (h.copies_count + 3 * h.generations_count)::int as score
  from public.hooks h
  where h.status = 'published';
create unique index hook_popularity_pk        on public.hook_popularity (hook_id);   -- required for REFRESH ... CONCURRENTLY
create index        hook_popularity_score_idx on public.hook_popularity (score desc);

create table public.hook_favorites (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  hook_id      text not null references public.hooks(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, hook_id)
);
create index hook_favorites_ws_idx   on public.hook_favorites (workspace_id);
create index hook_favorites_hook_idx on public.hook_favorites (hook_id);

create table public.workspace_hooks (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.workspaces(id) on delete cascade,
  project_id          uuid,                                     -- FK projects in 0004
  text_he             text not null check (char_length(text_he) between 3 and 160),
  hook_type_slug      text not null references public.hook_types(slug) on update cascade,
  gender              public.hook_gender not null,
  goal                public.hook_goal not null,
  platforms           public.platform[] not null default '{reels}',
  visual_direction_he text not null default '',
  why_it_works_he     text not null default '',
  strength            smallint not null check (strength between 1 and 5),
  source_hook_id      text references public.hooks(id) on delete set null,
  created_by          uuid references public.profiles(id) on delete set null,          -- NULL = author deleted their account
  created_at          timestamptz not null default now()
);
create index workspace_hooks_ws_idx      on public.workspace_hooks (workspace_id, created_at desc);
create index workspace_hooks_project_idx on public.workspace_hooks (project_id);

create table public.templates (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_he                text not null,
  description_he         text not null,
  niche_slug             text references public.niches(slug) on update cascade on delete set null,
  video_type             public.video_type not null,
  goal                   public.hook_goal not null,
  structure              text not null check (structure in ('hpspc','aida','pas','bab','result_first','brand_story')),
  duration_sec           smallint not null check (duration_sec in (15,30,45,60)),
  aspect_ratio           public.aspect_ratio not null default '9:16',
  visual_style           text not null check (visual_style in ('cinematic','ugc','day_in_business','before_after','product','text_motion')),
  visual_mix             public.visual_mix not null default 'smart',
  caption_preset         text not null default 'bold-pop' check (caption_preset in ('bold-pop','clean-box','karaoke','poster','news','soft')),
  music_mood             text not null check (music_mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  default_hook_type_slug text references public.hook_types(slug) on update cascade on delete set null,
  beat_plan              jsonb not null default '[]' check (jsonb_typeof(beat_plan) = 'array'),  -- [{role, est_duration_sec, visual_idea_he}]
  preview_path           text,
  poster_path            text,
  is_public              boolean not null default false,
  sort_order             int not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index templates_niche_idx on public.templates (niche_slug) where is_public;

create table public.examples (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_he          text not null,
  niche_slug        text not null references public.niches(slug) on update cascade on delete restrict,
  video_type        public.video_type not null,
  aspect_ratio      public.aspect_ratio not null,
  duration_sec      smallint not null check (duration_sec between 5 and 90),
  video_path        text not null,          -- public-media: examples/{id}.mp4
  poster_path       text not null,
  captions_vtt_path text not null,          -- every marketing video ships Hebrew captions (IS 5568)
  hook_id           text references public.hooks(id) on delete set null,
  template_id       uuid references public.templates(id) on delete set null,
  is_featured       boolean not null default false,
  is_published      boolean not null default false,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index examples_published_idx on public.examples (niche_slug, sort_order) where is_published;

create table public.music_tracks (
  id           uuid primary key default gen_random_uuid(),
  title_he     text not null,
  mood         text not null check (mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  bpm          int check (bpm is null or bpm between 40 and 220),
  duration_ms  int not null check (duration_ms > 0),
  path         text not null unique,        -- public-media: music-library/{mood}/{id}.mp3
  source       text not null check (source in ('lyria','licensed')),
  license_note text not null,
  is_active    boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index music_tracks_mood_idx on public.music_tracks (mood) where is_active;

create table public.voices (
  id                text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- e.g. he-f-noa
  display_name_he   text not null,
  gender            public.voice_gender not null,
  age_band          text not null check (age_band in ('young','adult','mature')),
  tone_he           text not null,
  model_slug        text not null,                 -- e.g. elevenlabs/eleven-v4 (validated against model_registry by the seed/admin API)
  provider_voice_id text,                          -- mapped by an admin after the native-speaker blind test
  sample_path       text,                          -- public-media: voices/{voice_id}.mp3
  is_active         boolean not null default false,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint voices_active_requires_mapping check (not is_active or provider_voice_id is not null)
);

-- late FKs into the catalog
alter table public.workspaces        add constraint workspaces_niche_fk        foreign key (niche_slug)       references public.niches(slug) on update cascade on delete set null;
alter table public.business_profiles add constraint business_profiles_niche_fk foreign key (niche_slug)       references public.niches(slug) on update cascade on delete set null;
alter table public.brand_kits        add constraint brand_kits_voice_fk        foreign key (default_voice_id) references public.voices(id)   on update cascade on delete set null;
```

הערות:
- **`niches.slug`** לא יכול להיות אחת המילים השמורות של ה-URL (`types`, `season`, `platform`, `h`, `new`, `search`) וגם לא `universal`, שמשמש כערך מיוחד בחיפוש (הוקים בלי נישה).
- **`niches.short_name_he`** ו-**`niches.sample_scripts`** הן עמודות DB-only שחלק 02 משתמש בהן בכותרות ובדפי הנישה; הן לא חלק מקובץ ה-seed הקנוני, ומתמלאות דרך האדמין או `scripts/generate-niche-seo.ts`. ערכי ההשקה של `short_name_he`, ‏`default_register`, ‏`default_audience_gender` ו-`default_cta` מגיעים מ-`niche_extras.json` (§16.1, מצב `fill_if_null`), כך שעריכה באדמין לעולם לא נדרסת. ‏`sample_scripts` = בדיוק שלושה פריטי `SampleScript` לכל נישה פעילה (חלק 02 §4.3) — זה לא קשור לחמשת התסריטים של נספח D.
- **`hooks.search_text`** היא עמודה מחוללת מ-`text_he` המנורמל, ואינדקס ה-trigram יושב עליה (ולא על `text_he` הגולמי), כי החיפוש תמיד משווה טקסט מנורמל. זה עדיין "אינדקס trigram על טקסט ההוק" שנספח F דורש.
- **`hooks.id`** הוא המזהה הטקסטואלי הקנוני. הוקים חדשים מהאדמין או מאצוות AI ממשיכים את המספור של הנישה (`dentists-11`, `dentists-12`…), באמצעות `next_hook_id()` (§11.3).
- **`voices`** — שורה פעילה חייבת `provider_voice_id`. בהשקה ה-seed טוען את רשימת הקולות כלא-פעילה, ומנהל מפעיל אחרי מבחן השמיעה (חלק 05).
- **`hook_popularity`** היא Materialized View בלי RLS (אין בה מידע רגיש); היא מתרעננת כל 30 דקות (§15) ונגישה לקריאה ל-`anon` ול-`authenticated`.

### קריטריוני קבלה
- [ ] `select public.normalize_he('נַדְלָ״ן  POV')` מחזיר `נדל"ן pov`; ‏`select public.normalize_he('מבצע־חג')` מחזיר `מבצע-חג`.
- [ ] הכנסת נישה עם `slug = 'types'` או `'universal'` נכשלת; הכנסת הוק עם `hook_type_slug` שלא קיים נכשלת.
- [ ] `explain` על `select * from hooks where search_text like '%ספר%'` משתמש ב-`hooks_search_trgm` כשהטבלה מכילה את כל ה-seed (אחרי `analyze`).
- [ ] `refresh materialized view concurrently public.hook_popularity` רץ בלי שגיאה.

---

## §6. פרויקטים, גרסאות, סצנות, נכסים ועבודות — `0004_projects_jobs.sql`

```sql
-- 0004_projects_jobs.sql
create table public.projects (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references public.workspaces(id) on delete cascade,
  created_by            uuid references public.profiles(id) on delete set null,   -- NULL = author deleted their account (§9.6)
  title                 text not null default 'סרטון חדש' check (char_length(btrim(title)) between 1 and 80),
  niche_slug            text references public.niches(slug) on update cascade on delete set null,
  video_type            public.video_type not null default 'reel_hook',
  goal                  public.hook_goal not null default 'leads',
  platforms             public.platform[] not null default '{reels,tiktok}',
  primary_aspect        public.aspect_ratio not null default '9:16',
  extra_aspects         public.aspect_ratio[] not null default '{}',
  duration_target_sec   smallint not null default 30 check (duration_target_sec in (15,30,45,60)),
  quality_tier          public.quality_tier not null default 'standard',
  visual_mix            public.visual_mix not null default 'smart',
  visual_style          text not null default 'cinematic' check (visual_style in ('cinematic','ugc','day_in_business','before_after','product','text_motion')),
  audience_gender       public.audience_gender not null default 'plural',
  voice_gender          public.voice_gender not null default 'female',
  register              public.register not null default 'warm',
  brand_kit_id          uuid references public.brand_kits(id) on delete set null,
  voice_id              text references public.voices(id) on update cascade on delete set null,
  voice_speed           numeric(3,2) not null default 1.00 check (voice_speed between 0.80 and 1.20),
  no_voice              boolean not null default false,
  music_mode            text not null default 'library' check (music_mode in ('library','generate','none')),
  music_track_id        uuid references public.music_tracks(id) on delete set null,
  music_mood            text check (music_mood in ('energetic','warm','luxury','funny','calm','inspiring','urban')),
  caption_preset        text not null default 'bold-pop' check (caption_preset in ('bold-pop','clean-box','karaoke','poster','news','soft')),
  ai_label              boolean not null default false,
  render_options        jsonb not null default '{}' check (jsonb_typeof(render_options) = 'object'),
  -- overrides of the brand kit for this project only:
  -- {logo_bug?, intro_style?: 'none'|'logo_reveal'|'title_card', caption_position?: 'lower'|'middle',
  --  caption_highlight_color?: '#RRGGBB'|null, end_card?: {headline_he?, show_phone?, show_whatsapp?, show_website?,
  --  show_address?, show_instagram?, show_qr?}}
  hook_id               text references public.hooks(id) on delete set null,
  workspace_hook_id     uuid references public.workspace_hooks(id) on delete set null,
  hook_text_he          text check (hook_text_he is null or char_length(hook_text_he) <= 160),
  brief                 jsonb not null default '{}' check (jsonb_typeof(brief) = 'object'),
  template_id           uuid references public.templates(id) on delete set null,
  variant_group_id      uuid,
  variant_of_project_id uuid references public.projects(id) on delete set null,
  stage                 public.project_stage not null default 'draft',
  wizard_step           text not null default 'business' check (wizard_step in ('business','niche','goal','hook','script','style','voice','music','preview')),
  current_version_id    uuid,                       -- FK below
  latest_job_id         uuid,                       -- FK below
  is_archived           boolean not null default false,
  deleted_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint projects_extra_aspects_excl_primary check (not (primary_aspect = any (extra_aspects)))
);
create index projects_ws_updated_idx on public.projects (workspace_id, updated_at desc);
create index projects_ws_stage_idx   on public.projects (workspace_id, stage);
create index projects_variant_idx    on public.projects (variant_group_id) where variant_group_id is not null;
create index projects_deleted_idx    on public.projects (deleted_at) where deleted_at is not null;

alter table public.workspace_hooks
  add constraint workspace_hooks_project_fk foreign key (project_id) references public.projects(id) on delete set null;

create table public.project_versions (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.projects(id) on delete cascade,
  version            int not null check (version >= 1),
  script             jsonb not null,                -- ScriptV1 (part 05 §7.3)
  storyboard         jsonb,                         -- StoryboardV1
  caption_track      jsonb,                         -- CaptionTrackV1
  voiceover_asset_id uuid,                          -- FK below
  moderation         jsonb,                         -- cached ModerationV1 + {kind, checked_at, prompt_version, input_hash}
  source             text not null check (source in ('ai','user_edit','rewrite')),
  created_by         uuid references public.profiles(id) on delete set null,       -- NULL = author deleted their account
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),   -- set_updated_at; the ifUnmodifiedSince base of PATCH …/script (§19.5)
  unique (project_id, version)
);

alter table public.projects
  add constraint projects_current_version_fk foreign key (current_version_id) references public.project_versions(id) on delete set null;

create table public.scenes (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.projects(id) on delete cascade,
  version_id         uuid not null references public.project_versions(id) on delete cascade,
  index              smallint not null check (index >= 0),
  beat_index         smallint not null check (beat_index >= 0),
  duration_ms        int not null check (duration_ms between 500 and 20000),
  start_ms           int check (start_ms is null or start_ms >= 0),
  visual_source      public.visual_source not null,
  image_prompt_en    text not null default '',
  motion_prompt_en   text not null default '',
  negative_prompt_en text not null default '',
  camera             text not null default 'static' check (camera in ('static','push_in','pull_out','pan_left','pan_right','tilt_up','tilt_down','handheld','orbit','drone')),
  onscreen_text_he   text not null default '',
  text_position      text not null default 'center' check (text_position in ('top','center','bottom','none')),
  vo_he              text not null default '',
  transition_in      text not null default 'cut' check (transition_in in ('cut','fade','whip','zoom','slide','wipe','flash')),
  sfx                text not null default 'none' check (sfx in ('none','whoosh','impact','pop','sizzle','click','riser','cash','camera_shutter')),
  kenburns           text not null default 'zoom_in' check (kenburns in ('zoom_in','zoom_out','pan_start','pan_end','none')),
  focal_x            numeric(4,3) not null default 0.5 check (focal_x between 0 and 1),
  focal_y            numeric(4,3) not null default 0.5 check (focal_y between 0 and 1),
  is_hook_scene      boolean not null default false,
  hook_type_slug     text references public.hook_types(slug) on update cascade on delete set null,
  keyframe_asset_id  uuid,                          -- FK below
  clip_asset_id      uuid,                          -- FK below
  user_asset_id      uuid,                          -- FK below
  status             text not null default 'pending' check (status in ('pending','generating','ready','failed','degraded')),
  degraded_reason    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (version_id, index)
);
create index scenes_project_idx on public.scenes (project_id);

create table public.ai_generations (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid references public.workspaces(id) on delete set null,
  job_id             uuid,                          -- FK below
  step_id            uuid,                          -- FK below
  task               public.ai_task not null,
  prompt_template_id text,
  model_requested    text not null,
  model_served       text,
  fallback_used      boolean not null default false,
  openrouter_id      text,
  endpoint           text not null check (endpoint in ('chat','images','videos','speech','transcriptions')),
  unit_type          text not null check (unit_type in ('tokens','image','second','char','song')),
  units              numeric,
  prompt_tokens      int,
  completion_tokens  int,
  cached_tokens      int,
  cost_usd           numeric(12,6),                 -- from usage.cost; NULL = unknown (never 0)
  cost_estimated_usd numeric(12,6),                 -- registry pricing x units
  latency_ms         int not null check (latency_ms >= 0),
  status             text not null check (status in ('ok','error','timeout')),
  error_code         text,
  meta               jsonb check (meta is null or jsonb_typeof(meta) = 'object'),
                                                    -- debug on validation failure: {raw_head (≤2000 chars), issues[], prompt_version, input_hash};
                                                    -- nulled after 30 days (§15); never readable by customers (column grant, §12.2)
  created_at         timestamptz not null default now()
);
create index ai_generations_created_idx    on public.ai_generations (created_at);
create index ai_generations_ws_created_idx on public.ai_generations (workspace_id, created_at);
create index ai_generations_task_idx       on public.ai_generations (task, created_at);
create index ai_generations_job_idx        on public.ai_generations (job_id) where job_id is not null;

create table public.assets (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.workspaces(id) on delete cascade,
  project_id       uuid references public.projects(id) on delete set null,
  scene_id         uuid references public.scenes(id) on delete set null,
  kind             public.asset_kind not null,
  source           public.asset_source not null,
  bucket           text not null check (bucket in ('brand-assets','uploads','generated','renders','public-media','exports')),
  path             text not null check (path !~ '(^/|\.\.)'),
  mime             text not null,
  bytes            bigint not null check (bytes >= 0),
  width            int check (width is null or width > 0),
  height           int check (height is null or height > 0),
  duration_ms      int check (duration_ms is null or duration_ms >= 0),
  aspect_ratio     public.aspect_ratio,
  model_slug       text,
  ai_generation_id uuid references public.ai_generations(id) on delete set null,
  sha256           text check (sha256 is null or sha256 ~ '^[0-9a-f]{64}$'),
  metadata         jsonb not null default '{}' check (jsonb_typeof(metadata) = 'object'),  -- keys: see the notes below
  is_deleted       boolean not null default false,
  created_by       uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (bucket, path)
);
create index assets_ws_kind_created_idx on public.assets (workspace_id, kind, created_at desc);
create index assets_project_idx         on public.assets (project_id);
create index assets_pending_idx         on public.assets (created_at) where (metadata->>'upload_state') = 'pending';
create index assets_purge_idx           on public.assets (updated_at) where is_deleted;

alter table public.brand_kits
  add constraint brand_kits_logo_fk      foreign key (logo_asset_id)      references public.assets(id) on delete set null,
  add constraint brand_kits_logo_dark_fk foreign key (logo_dark_asset_id) references public.assets(id) on delete set null;
alter table public.project_versions
  add constraint project_versions_vo_fk  foreign key (voiceover_asset_id) references public.assets(id) on delete set null;
alter table public.scenes
  add constraint scenes_keyframe_fk      foreign key (keyframe_asset_id)  references public.assets(id) on delete set null,
  add constraint scenes_clip_fk          foreign key (clip_asset_id)      references public.assets(id) on delete set null,
  add constraint scenes_user_asset_fk    foreign key (user_asset_id)      references public.assets(id) on delete set null;

create table public.jobs (
  id                   uuid primary key default gen_random_uuid(),
  workspace_id         uuid not null references public.workspaces(id) on delete cascade,
  billing_workspace_id uuid not null references public.workspaces(id) on delete restrict,
  project_id           uuid not null references public.projects(id) on delete cascade,
  version_id           uuid not null references public.project_versions(id) on delete cascade,
  kind                 public.job_kind not null,
  status               public.job_status not null default 'queued',
  stage                public.job_stage not null default 'queued',
  progress             smallint not null default 0 check (progress between 0 and 100),
  idempotency_key      text not null unique,
  orchestrator         text not null check (orchestrator in ('vercel-workflow','inline','trigger')),
  run_id               text,
  reservation_id       uuid,                        -- FK credit_reservations in 0005
  credits_estimated    int not null check (credits_estimated >= 0),
  credits_captured     int not null default 0 check (credits_captured >= 0),
  cost_usd_total       numeric(12,6) not null default 0,
  cost_has_estimates   boolean not null default false,
  options              jsonb not null default '{}' check (jsonb_typeof(options) = 'object'),  -- {formats[], sceneIds?, what?, promptOverrideEn?, afterJobId?}
  error_code           text,
  error_message_he     text,
  error_detail         jsonb,
  requested_by         uuid references public.profiles(id) on delete set null,   -- NULL = requester deleted their account
  started_at           timestamptz,
  heartbeat_at         timestamptz,
  finished_at          timestamptz,
  canceled_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index jobs_ws_created_idx      on public.jobs (workspace_id, created_at desc);
create index jobs_status_heartbeat_idx on public.jobs (status, heartbeat_at);
create index jobs_project_idx         on public.jobs (project_id, created_at desc);
create index jobs_active_billing_idx  on public.jobs (billing_workspace_id) where status in ('queued','running','waiting_external');
create index jobs_version_idx         on public.jobs (version_id);

alter table public.projects
  add constraint projects_latest_job_fk foreign key (latest_job_id) references public.jobs(id) on delete set null;

create table public.job_steps (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null references public.jobs(id) on delete cascade,
  step_key        text not null check (step_key ~ '^(voice|captions|music|finalize|keyframe:[0-9a-f-]{36}|clip:[0-9a-f-]{36}|render:(9x16|1x1|16x9))$'),
  scene_id        uuid references public.scenes(id) on delete set null,
  status          public.step_status not null default 'pending',
  attempt         smallint not null default 0 check (attempt >= 0),
  model_slug      text,
  provider_job_id text,                             -- OpenRouter video id
  hook_token      text,                             -- deterministic WDK hook token, e.g. or-video:{videoId}
  input           jsonb not null default '{}',
  output          jsonb,
  credits         int not null default 0 check (credits >= 0),
  cost_usd        numeric(12,6),
  error_code      text,
  error_message   text,
  started_at      timestamptz,
  finished_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (job_id, step_key)
);
create unique index job_steps_provider_job_uq on public.job_steps (provider_job_id) where provider_job_id is not null;
create unique index job_steps_hook_token_uq   on public.job_steps (hook_token) where hook_token is not null;
create index job_steps_waiting_idx            on public.job_steps (updated_at) where status = 'waiting_external';

alter table public.ai_generations
  add constraint ai_generations_job_fk  foreign key (job_id)  references public.jobs(id)      on delete set null,
  add constraint ai_generations_step_fk foreign key (step_id) references public.job_steps(id) on delete set null;

create table public.render_runs (
  id                 uuid primary key default gen_random_uuid(),
  job_id             uuid not null references public.jobs(id) on delete cascade,
  project_id         uuid not null references public.projects(id) on delete cascade,
  aspect_ratio       public.aspect_ratio not null,
  provider           text not null check (provider in ('vercel-sandbox','lambda','local')),
  provider_run_id    text,
  status             text not null default 'queued' check (status in ('queued','rendering','uploading','succeeded','failed')),
  progress           numeric(5,4) not null default 0 check (progress between 0 and 1),
  output_asset_id    uuid references public.assets(id) on delete set null,
  props_hash         text not null,
  render_ms          int,
  cost_usd_estimated numeric(12,6),
  error              text,
  started_at         timestamptz not null default now(),
  finished_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index render_runs_job_idx on public.render_runs (job_id);
```

הערות:
- **`job_steps.step_key`** נאכף ב-regex: `keyframe:{sceneId}` ו-`clip:{sceneId}` עם uuid, ו-`render:{aspect}` עם `9x16`/`1x1`/`16x9` (אותו כתיב כמו בנתיבי האחסון).
- **`project_versions`** — גרסה היא "טיוטה" כל עוד אף עבודה לא השתמשה בה: השרת רשאי לעדכן בה `script` ו-`source`. מרגע שעבודה כלשהי נוצרה עליה, `script` ו-`source` קפואים (טריגר `project_versions_guard`, §11.3), ועריכה פותחת גרסה חדשה (`POST /api/projects/[id]/versions`, §19). העמודות הנגזרות (`storyboard`, `caption_track`, `voiceover_asset_id`, `moderation`) נכתבות רק בצד השרת. למשתמשים אין הרשאת `update` על הטבלה בכלל. עריכה ידנית של תסריט בגרסת טיוטה עוברת ב-`PATCH /api/projects/[id]/script` (§19.5), ו-`updated_at` (טריגר `set_updated_at`) הוא הבסיס של `ifUnmodifiedSince` שלה.
- **`project_versions.hook_score`** (נוספה ב-`0014`, §2.3) — מטמון של ציון ההוק של הגרסה (§19.10): `{ version: 1, score, checks, suggestions, llm, degraded, input_hash, prompt_version, computed_at }`. נכתבת רק בצד השרת, גם בגרסה נעולה (השומר `project_versions_guard` חוסם רק את `script` ו-`source`), ולא מקדמת את `updated_at`. `input_hash` שלא תואם לסטוריבורד ולכתוביות הנוכחיים של הגרסה = ציון ישן, שמחושב מחדש בקריאה הבאה.
- **`assets.metadata.upload_state`**: ‏`pending` (נוצרה כתובת העלאה) → `ready` (אחרי `complete`) → או `rejected`. העלאה שנשארה `pending` יותר מ-24 שעות נמחקת ב-`/api/cron/cleanup`.
- **מפתחות `assets.metadata`** (כל השאר אסור): `upload_state`, `original_filename`, `probe`, `purge_reason`, `purge_marked_at`, `storage_deleted_at`, `consent_attested: {by, at}` (הסכמה בכתב של מי שמופיע בהעלאה), `moderation: {allowed, categories, checked_at, prompt_version}` — או `{pending: true}` כשהמודרציה של ההעלאה לא רצה בגלל תקלה אצל הספק (§20.2); ובצילום מודרך (מ-`0014`, חלק 08): `guided_shoot_id`, `shot_key`, `source` (`"camera"` או `"file"`; זה לא העמודה `assets.source`), שנכתבים ב-`uploads/sign` (§20.2); ומההרחבה גם `meta_spec: {ok, issues[], checked_at}` ברינדורים של 9:16 ו-1:1 (תוצאת `assertMetaVideoSpec`, נכתבת ב-`finalize`, חלק 05 §18.10, §20.11).
- **`jobs.billing_workspace_id`** הוא `billing_workspace_id(workspace_id)` ברגע היצירה (סוכנות לסביבת לקוח); מגבלת המקביליות נספרת עליו (`jobs_active_billing_idx`).
- **`jobs.options`** (camelCase, כמו גוף הבקשות): `{ formats: AspectRatio[]; sceneIds?: uuid[]; what?: "visual" | "clip" | "keyframe"; promptOverrideEn?: string; afterJobId?: uuid }`. ‏`afterJobId` קיים רק בעבודות של גרסאות הוק (עבודות "אחים") ומצביע על העבודה הראשית; עבודות כאלה לעולם לא נספרות במגבלת המקביליות (§10.4).
- **`job_steps.output`** — המבנה לכל סוג צעד שייך לחלק 05 §18.4 (למשל `{asset_id, duration_ms, model, fallback_voice, tts_hash}` ל-`voice`, ו-`{attempts:[…]}` ל-`clip:*`). השכבה הזו לא מפרשת אותו.
- **`projects.render_options`** — דריסות של ערכת המותג לפרויקט אחד בלבד (מסך התצוגה המקדימה, חלק 03 §6.9): לוגו בפינה, סגנון פתיחה, מיקום והדגשת הכתוביות, וכרטיס הסיום. סדר הפתרון ב-`buildPromoProps` (חלק 05 §20.2): ‏`projects.render_options.X ?? brand_kits.X ?? ברירת מחדל`. נכתב דרך `PATCH /api/projects/[id] { renderOptions }` (מיזוג רדוד, §19.3).
- **`ai_generations.meta`** — קטע דיבאג כשפלט של מודל לא עבר ולידציה (עד 2,000 תווים ראשונים, רשימת ה-issues, גרסת הפרומפט ו-hash הקלט). לקוחות לא יכולים לקרוא את העמודה (הרשאת עמודה ב-§12.2); מסכי האדמין קוראים אותה עם הלקוח הסודי, ומשימת pg_cron מאפסת אותה אחרי 30 יום (§15).
- **עמודות המחבר** (`projects.created_by`, ‏`project_versions.created_by`, ‏`jobs.requested_by`) מותרות כ-NULL, כדי שמחיקת חשבון לא תיחסם (§9.6). הממשק מציג "משתמש שנמחק" כשהמחבר חסר (חלק 03).

### קריטריוני קבלה
- [ ] `step_key = 'clip:abc'` נדחה; `'render:9x16'` ו-`'clip:' || gen_random_uuid()` מתקבלים.
- [ ] מחיקת פרויקט (hard delete באדמין) מוחקת גרסאות, סצנות, עבודות, צעדים והרצות רינדור, ומשאירה את שורות `ai_generations` עם `job_id = null`.
- [ ] שני `provider_job_id` זהים נכשלים על `job_steps_provider_job_uq`.
- [ ] `update projects set render_options = '[]'` נכשל על ה-check; ‏`'{}'` ו-`'{"logo_bug":true}'` מתקבלים.

---

## §7. קרדיטים וחיוב — `0005_credits_billing.sql`

```sql
-- 0005_credits_billing.sql
create table public.plans (
  id                       text primary key check (id ~ '^[a-z][a-z0-9_]{1,30}$'),   -- free | starter | business | agency
  name_he                  text not null,
  tagline_he               text not null default '',
  price_monthly_ils        numeric(10,2) not null check (price_monthly_ils >= 0),        -- incl. VAT
  price_annual_monthly_ils numeric(10,2) check (price_annual_monthly_ils is null or price_annual_monthly_ils >= 0),
  monthly_credits          int not null check (monthly_credits >= 0),
  trial_credits            int not null default 0 check (trial_credits >= 0),
  limits                   jsonb not null check (jsonb_typeof(limits) = 'object'),
  features_he              jsonb not null default '[]' check (jsonb_typeof(features_he) = 'array'),
  is_public                boolean not null default true,
  is_highlighted           boolean not null default false,                               -- -> the "מומלץ" badge on the pricing page
  sort_order               int not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- bootstrap row so signups work before `pnpm db:seed`; the seed upserts the full row
insert into public.plans (id, name_he, tagline_he, price_monthly_ils, monthly_credits, trial_credits, limits, features_he, is_public, sort_order)
values ('free', 'חינם', 'להתחיל בלי כרטיס אשראי', 0, 0, 70,
  '{"seats":1,"client_workspaces":0,"brand_kits":1,"max_duration_sec":30,"quality_tiers":["draft"],"visual_mix":["images","smart"],"max_ai_clips":1,"max_ai_clip_sec":5,"max_formats":1,"max_resolution":"720p","watermark":true,"concurrent_jobs":1,"daily_credit_cap":70,"music_generate":false,"hook_variants_max":1,"approval_links":false,"white_label":false,"projects_max":3}',
  '[]', true, 10)
on conflict (id) do nothing;

alter table public.workspaces
  add constraint workspaces_plan_fk foreign key (plan_id) references public.plans(id) on update cascade;

create table public.credit_packs (
  id         text primary key check (id ~ '^pack-[0-9]+$'),
  name_he    text not null,
  credits    int not null check (credits > 0),
  price_ils  numeric(10,2) not null check (price_ils > 0),   -- incl. VAT
  is_active  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_costs (
  action_key         text primary key check (action_key ~ '^[a-z]+\.[a-z_]+$'),
  credits            int not null check (credits >= 0),
  credits_long       int check (credits_long is null or credits_long >= 0),   -- value for videos longer than 30 s (render.base, render.extra_format)
  unit               text not null,
  label_he           text not null,
  cogs_usd_per_unit  numeric(10,5) not null default 0,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  updated_by         uuid references public.profiles(id) on delete set null
);

create table public.credit_grants (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete restrict,
  source       public.grant_source not null,
  amount       int not null check (amount > 0),
  remaining    int not null check (remaining >= 0),
  expires_at   timestamptz,                         -- null = never
  expired_at   timestamptz,                         -- set once by _expire_due_grants (natural expiry); an expired grant is never refilled (§10.2)
  ref_type     text,                                -- user | subscription | payment | audit_log | reservation_return | promo | incident
  ref_id       text,
  created_at   timestamptz not null default now(),
  constraint credit_grants_remaining_le_amount check (remaining <= amount)
);
create index credit_grants_fifo_idx   on public.credit_grants (workspace_id, expires_at asc nulls last, created_at) where remaining > 0;
create index credit_grants_expiry_idx on public.credit_grants (expires_at) where remaining > 0 and expires_at is not null and expired_at is null;

create table public.credit_reservations (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete restrict,   -- always a billing workspace
  job_id          uuid references public.jobs(id) on delete set null,
  action_key      text,                              -- begin_spend only (credit_costs.action_key)
  ref             text,                              -- begin_spend only, e.g. project:{id}:script
  amount          int not null check (amount > 0),
  captured        int not null default 0 check (captured >= 0),
  refunded        int not null default 0 check (refunded >= 0),
  status          public.reservation_status not null default 'open',
  allocations     jsonb not null default '[]' check (jsonb_typeof(allocations) = 'array'),  -- [{grant_id, amount, returned}]
  idempotency_key text not null unique,
  created_at      timestamptz not null default now(),
  settled_at      timestamptz,
  constraint credit_reservations_captured_le_amount check (captured <= amount),
  constraint credit_reservations_refunded_le_amount check (refunded <= amount)
);
create index credit_reservations_open_idx on public.credit_reservations (workspace_id) where status = 'open';
create index credit_reservations_job_idx  on public.credit_reservations (job_id);

alter table public.jobs
  add constraint jobs_reservation_fk foreign key (reservation_id) references public.credit_reservations(id) on delete set null;

create table public.payment_methods (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete restrict,
  provider     text not null,
  token_enc    text not null,                       -- AES-256-GCM(APP_ENCRYPTION_KEY): "v1:{iv_b64}:{tag_b64}:{ct_b64}"; gateway token, never a PAN
  brand        text not null,
  last4        text not null check (last4 ~ '^[0-9]{4}$'),
  exp_month    smallint not null check (exp_month between 1 and 12),
  exp_year     smallint not null check (exp_year between 2024 and 2100),
  holder_name  text,
  is_default   boolean not null default false,
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
create unique index payment_methods_one_default on public.payment_methods (workspace_id) where is_default and deleted_at is null;

create table public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  workspace_id         uuid not null references public.workspaces(id) on delete restrict,
  plan_id              text not null references public.plans(id) on update cascade,
  billing_cycle        public.billing_cycle not null,
  status               public.subscription_status not null,
  price_ils            numeric(10,2) not null check (price_ils >= 0),     -- locked, incl. VAT
  vat_rate             numeric(5,4) not null check (vat_rate between 0 and 1),
  current_period_start timestamptz not null,
  current_period_end   timestamptz not null,
  cancel_at_period_end boolean not null default false,
  canceled_at          timestamptz,
  cancel_reason        text,
  cancel_channel       text check (cancel_channel in ('app','email','phone')),
  payment_method_id    uuid references public.payment_methods(id) on delete set null,
  provider             text not null,
  provider_ref         text,
  next_charge_at       timestamptz,
  retry_count          smallint not null default 0 check (retry_count between 0 and 10),
  last_charge_error    text,
  promo_ends_at        timestamptz,
  anchor_at            timestamptz not null default now(),   -- period anchor (keeps "31st" after February)
  next_grant_at        timestamptz,                          -- annual plans: next monthly allowance grant
  scheduled_change     jsonb check (scheduled_change is null
                         or (scheduled_change ?& array['plan_id','cycle','requested_at','requested_by'])),  -- {plan_id, cycle, requested_at, requested_by}
  past_due_since       timestamptz,                          -- dunning start
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint subscriptions_period check (current_period_end > current_period_start)
);
create unique index subscriptions_one_live    on public.subscriptions (workspace_id) where status in ('active','past_due');
create index        subscriptions_renewal_idx on public.subscriptions (next_charge_at) where status in ('active','past_due') and not cancel_at_period_end;
create index        subscriptions_next_grant_idx on public.subscriptions (next_grant_at) where status = 'active' and billing_cycle = 'annual';

create table public.checkout_sessions (
  id                   uuid primary key default gen_random_uuid(),
  workspace_id         uuid not null references public.workspaces(id) on delete restrict,
  kind                 text not null check (kind in ('subscription','topup','update_card','plan_change')),
  plan_id              text references public.plans(id) on update cascade,
  billing_cycle        public.billing_cycle,
  pack_id              text references public.credit_packs(id) on update cascade,
  amount_ils           numeric(10,2) not null check (amount_ils >= 0),
  provider             text not null,
  provider_session_ref text,
  status               text not null default 'created' check (status in ('created','completed','failed','expired')),
  created_by           uuid references public.profiles(id) on delete set null,   -- nullable: checkout history outlives deleted accounts
  created_at           timestamptz not null default now(),
  completed_at         timestamptz
);
create index        checkout_sessions_ws_idx  on public.checkout_sessions (workspace_id, created_at desc);
create unique index checkout_sessions_ref_uq  on public.checkout_sessions (provider, provider_session_ref) where provider_session_ref is not null;

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.workspaces(id) on delete restrict,
  subscription_id     uuid references public.subscriptions(id) on delete set null,
  checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  kind                public.payment_kind not null,
  status              public.payment_status not null,
  amount_ils          numeric(10,2) not null,       -- incl. VAT
  amount_net_ils      numeric(10,2) not null,
  vat_ils             numeric(10,2) not null,
  vat_rate            numeric(5,4) not null,
  currency            text not null default 'ILS' check (currency = 'ILS'),
  installments        smallint not null default 1 check (installments between 1 and 36),
  provider            text not null,
  provider_txn_id     text not null,
  provider_payload    jsonb not null default '{}',
  plan_id             text references public.plans(id) on update cascade,
  pack_id             text references public.credit_packs(id) on update cascade,
  credits_granted     int not null default 0 check (credits_granted >= 0),
  refunded_ils        numeric(10,2) not null default 0 check (refunded_ils >= 0),
  failure_reason      text,
  idempotency_key      text unique,        -- checkout:{checkoutSessionId} | renew:{subscriptionId}:{periodEndISO} | plan_change:{subscriptionId}:{toPlan}:{requestKey}
  confirmation_sent_at timestamptz,        -- when the transaction confirmation email went out (starts the 14-day window)
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (provider, provider_txn_id),
  constraint payments_vat_sum check (abs(amount_net_ils + vat_ils - amount_ils) <= 0.01)
);
create index payments_ws_created_idx on public.payments (workspace_id, created_at desc);

create table public.credit_ledger (
  id              bigint generated always as identity primary key,
  workspace_id    uuid not null references public.workspaces(id) on delete restrict,
  delta           int not null,
  kind            public.ledger_kind not null,
  balance_after   int not null check (balance_after >= 0),
  grant_id        uuid references public.credit_grants(id),
  reservation_id  uuid references public.credit_reservations(id),
  job_id          uuid,                              -- informational, no FK (jobs may be purged; the ledger may not)
  payment_id      uuid references public.payments(id),
  description_he  text not null check (char_length(description_he) between 1 and 200),
  idempotency_key text not null unique,
  actor_id        uuid,                              -- informational, no FK
  created_at      timestamptz not null default now(),
  constraint credit_ledger_delta_sign check (
       (kind in ('grant_trial','grant_plan','grant_rollover','purchase','promo') and delta > 0)
    or (kind = 'reserve' and delta < 0)
    or (kind = 'capture' and delta = 0)
    or (kind in ('release','refund') and delta > 0)
    or (kind = 'expire' and delta < 0)
    or (kind = 'adjustment' and delta <> 0))
);
create index credit_ledger_ws_created_idx  on public.credit_ledger (workspace_id, created_at desc);
create index credit_ledger_reservation_idx on public.credit_ledger (reservation_id) where reservation_id is not null;
create index credit_ledger_job_idx         on public.credit_ledger (job_id) where job_id is not null;

create table public.workspace_balances (
  workspace_id     uuid primary key references public.workspaces(id) on delete restrict,
  balance          int not null default 0 check (balance >= 0),   -- = SUM(credit_ledger.delta) = SUM(credit_grants.remaining)
  reserved         int not null default 0 check (reserved >= 0),  -- open reservations: SUM(amount - captured)
  lifetime_granted int not null default 0,
  lifetime_spent   int not null default 0,                         -- left via reserve, net of release/refund (includes `reserved`)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.invoices (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete restrict,
  payment_id        uuid not null references public.payments(id) on delete restrict,
  provider          text not null,
  doc_type          public.invoice_doc_type not null,
  doc_number        text not null,
  allocation_number text,
  pdf_path          text,                            -- invoices bucket: {workspace_id}/{invoice_id}.pdf
  provider_doc_id   text not null,
  amount_ils        numeric(10,2) not null,
  vat_ils           numeric(10,2) not null,
  customer          jsonb not null check (customer ?& array['name','email']),   -- {name, vat_id, email, address, is_business}
  issued_at         timestamptz not null,
  created_at        timestamptz not null default now(),
  unique (provider, provider_doc_id)
);
create index invoices_ws_issued_idx on public.invoices (workspace_id, issued_at desc);

create table public.billing_profiles (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  legal_name   text not null check (char_length(btrim(legal_name)) between 2 and 120),
  vat_id       text check (vat_id is null or vat_id ~ '^[0-9]{9}$'),     -- ח.פ / ע.מ / ת.ז, 9 digits incl. check digit
  is_business  boolean not null default false,
  email        extensions.citext not null,
  address_line text,
  city         text,
  zip          text check (zip is null or zip ~ '^[0-9]{7}$'),
  phone        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.refund_requests (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.workspaces(id) on delete restrict,
  payment_id         uuid not null references public.payments(id) on delete restrict,
  reason_code        text not null check (reason_code in ('distance_14d','extended_4m','technical','goodwill','annual_prorata')),
  credits_consumed   int not null default 0 check (credits_consumed >= 0),
  consumed_value_ils numeric(10,2) not null default 0,
  fee_ils            numeric(10,2) not null default 0,
  refund_ils         numeric(10,2) not null default 0 check (refund_ils >= 0),
  status             text not null default 'requested' check (status in ('requested','approved','paid','rejected')),
  notes              text,
  handled_by         uuid references public.profiles(id) on delete set null,
  created_at         timestamptz not null default now(),
  handled_at         timestamptz
);
create index refund_requests_status_idx on public.refund_requests (status, created_at);
```

הערות:
- **`plans` `free`** נוצרת כבר במיגרציה, כדי ש-`handle_new_user` יעבוד גם לפני ה-seed. ה-seed דורס אותה בשורה המלאה מ-§10 בנספח F (כולל `features_he`). מפתחות `limits` הם המפתחות של §10.3 בנספח F ועוד `max_ai_clips` ו-`max_ai_clip_sec`: `seats, client_workspaces, brand_kits, max_duration_sec, quality_tiers, visual_mix, max_ai_clips, max_ai_clip_sec, max_formats, max_resolution, watermark, concurrent_jobs, daily_credit_cap, music_generate, hook_variants_max, approval_links, white_label, projects_max` (`null` = ללא הגבלה), ומהרחבת 2026-10-17 גם עשרת המפתחות של Meta, דף העסק ובדיקת הדופק (§16.4). `visual_mix` של `free` נשמר כרשימת ערכים מותרים, והמגבלה "קליפ AI אחד של עד 5 שניות" נשמרת ב-`max_ai_clips` וב-`max_ai_clip_sec` (ב-`starter` ומעלה הם `null`). `watermark` חל רק כל עוד `workspaces.has_paid = false`.
- **`subscriptions` — עמודות מנוע החיוב** (המימוש בחלק 06 §1.7): ‏`anchor_at` — עוגן התקופה, כדי שמנוי שהתחיל ב-31 בחודש ימשיך להתחדש ב-31 (או ביום האחרון של חודש קצר) גם אחרי פברואר; ‏`next_grant_at` — במנוי שנתי, מועד ההענקה החודשית הבאה של המכסה (`subscriptions_next_grant_idx` משרת את ה-cron); ‏`scheduled_change` — שינוי תוכנית שנקבע לסוף התקופה (`{plan_id, cycle, requested_at, requested_by}`), ‏NULL כשאין; ‏`past_due_since` — תחילת תהליך הגבייה החוזרת (dunning), מתאפס בחיוב מוצלח.
- **`payments.idempotency_key`** — מפתח ייחודי לכל ניסיון חיוב של המנוע: `checkout:{checkoutSessionId}` · ‏`renew:{subscriptionId}:{periodEndISO}` · ‏`plan_change:{subscriptionId}:{toPlan}:{requestKey}`. ‏**`payments.confirmation_sent_at`** — מתי יצא מייל אישור העסקה (ממנו נספרים 14 ימי הביטול).
- **מוסכמות `payments`:** שורת `pending` נכנסת עם `provider_txn_id = 'pending:' || id` (העמודה `not null`, והייחודיות על `(provider, provider_txn_id)` נשמרת), ומתעדכנת למזהה האמיתי כשהשער עונה. ערכי `failure_reason`: ‏`declined`, ‏`card_expired`, ‏`insufficient_funds`, ‏`invalid_token`, ‏`provider_error`, ‏`amount_mismatch`, ‏`chargeback`.
- **`credit_grants.ref_type`** — `user` (ניסיון) · `subscription` (הענקה חודשית במנוי שנתי, `ref_id = subscriptionId`) · `payment` (הענקה מתשלום, `ref_id = paymentId`) · `audit_log` (אדמין) · `reservation_return` (החזר לדלי שפג) · `promo` · `incident` (שחזור קרדיטים שפגו בזמן תקלה).
- **`credit_costs.credits_long`** — ל-`render.base` ‏(3 / 5) ול-`render.extra_format` ‏(2 / 3): `credits` הוא הערך לסרטון של עד 30 שניות, ו-`credits_long` לסרטון של 31–60 שניות. בשאר הפעולות `credits_long` הוא `null`.
- **`credit_ledger.job_id`** ו-**`actor_id`** הם ללא FK בכוונה: היומן לא נמחק לעולם, גם כשפרויקט נמחק או משתמש מוחק את חשבונו.
- **`billing_profiles.vat_id`** — 9 ספרות; ספרת הביקורת נבדקת ב-Zod (`IsraeliId`, §18.3) ולא ב-SQL.
- **`payments.checkout_session_id`** מקשר תשלום לסשן הקופה שיצר אותו (חלק 06 משתמש בו כדי למפות webhook לסשן).

### קריטריוני קבלה
- [ ] `insert into credit_ledger (…, kind => 'reserve', delta => 5, …)` נכשל על `credit_ledger_delta_sign`.
- [ ] שני מנויים פעילים לאותה סביבה נכשלים על `subscriptions_one_live`.
- [ ] `credit_grants.remaining` לא יכול לעלות על `amount` ולא לרדת מתחת ל-0.
- [ ] משתמש חדש נרשם בהצלחה על מסד שלא הורץ עליו seed (שורת `free` קיימת).
- [ ] `scheduled_change = '{"plan_id":"starter"}'` נכשל על ה-check (חסרים `cycle`, ‏`requested_at`, ‏`requested_by`); שני תשלומים עם אותו `idempotency_key` נכשלים על ה-unique.

---

## §8. שיתוף, תפעול והגדרות — `0006_sharing_ops.sql`

```sql
-- 0006_sharing_ops.sql
create table public.share_links (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null references public.workspaces(id) on delete cascade,
  project_id     uuid not null references public.projects(id) on delete cascade,
  version_id     uuid references public.project_versions(id) on delete set null,
  kind           public.share_kind not null,
  token_hash     text not null unique,              -- hex(sha256(token)); token = 32 random bytes, base64url
  allow_download boolean not null default false,
  -- no branding column: white label is resolved at every render/send by effective_white_label(workspace_id) (§9.2, §20.5)
  expires_at     timestamptz,
  view_count     int not null default 0 check (view_count >= 0),
  -- client_approval only (ShareCreateBody, §20.5): the intended approver and the sender's note; drive the
  -- client_approval_request email (part 06 §12.5: {approverName}, {senderNote}) and the /approve/[token] header
  approver_name  text check (approver_name is null or char_length(btrim(approver_name)) between 2 and 80),
  approver_email extensions.citext,
  sender_note    text check (sender_note is null or char_length(sender_note) <= 300),
  created_by     uuid references public.profiles(id) on delete set null,   -- NULL = author deleted their account
  created_at     timestamptz not null default now(),
  revoked_at     timestamptz,
  constraint share_links_approver_only check (kind = 'client_approval' or (approver_name is null and approver_email is null and sender_note is null)),
  constraint share_links_approval_expires check (kind <> 'client_approval' or expires_at is not null)   -- approval links always expire
);
create index share_links_project_idx on public.share_links (project_id, created_at desc);

create table public.approvals (
  id             uuid primary key default gen_random_uuid(),
  share_link_id  uuid not null references public.share_links(id) on delete cascade,
  project_id     uuid not null references public.projects(id) on delete cascade,
  version_id     uuid not null references public.project_versions(id) on delete cascade,
  status         public.approval_status not null default 'pending',
  approver_name  text not null check (char_length(btrim(approver_name)) between 2 and 80),
  approver_email extensions.citext,
  comment_he     text check (comment_he is null or char_length(comment_he) <= 2000),
  decided_at     timestamptz,
  created_at     timestamptz not null default now()
);
create index approvals_project_idx on public.approvals (project_id, created_at desc);

create table public.abuse_reports (
  id             uuid primary key default gen_random_uuid(),
  share_link_id  uuid references public.share_links(id) on delete set null,
  project_id     uuid references public.projects(id) on delete set null,
  workspace_id   uuid references public.workspaces(id) on delete set null,
  source         text not null default 'share_page' check (source in ('share_page','system','support')),
  reason         text not null check (reason in ('likeness','copyright','hate','political','other')),
  details        text check (details is null or char_length(details) <= 2000),
  reporter_email extensions.citext,
  ip             inet,
  status         text not null default 'new' check (status in ('new','reviewing','actioned','dismissed')),
  notes          text,
  handled_by     uuid references public.profiles(id) on delete set null,
  handled_at     timestamptz,
  created_at     timestamptz not null default now()
);
create index abuse_reports_status_idx on public.abuse_reports (status, created_at);

create table public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  kind         public.notification_kind not null,
  title_he     text not null,
  body_he      text not null,
  link         text check (link is null or link ~ '^/'),        -- in-app relative paths only
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index notifications_user_idx   on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where read_at is null;

create table public.consents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  workspace_id  uuid references public.workspaces(id) on delete set null,
  email         extensions.citext,
  kind          public.consent_kind not null,
  version       text not null,
  granted       boolean not null,
  source        text not null check (source in ('signup','settings','checkout','newsletter','cookie_banner','likeness_flow','generate','unsubscribe')),   -- 'generate', 'unsubscribe': server-only
  ip            inet,
  user_agent    text,
  evidence_path text,
  created_at    timestamptz not null default now(),
  revoked_at    timestamptz,
  subject_closed_at timestamptz,                    -- account closure; stamped by prepare_user_deletion (§9.6), retention clock (§11.4)
  constraint consents_subject check (user_id is not null or email is not null or source = 'cookie_banner')
);
create index consents_user_idx  on public.consents (user_id, kind, created_at desc);
create index consents_email_idx on public.consents (email, kind, created_at desc);

create table public.email_suppressions (
  email      extensions.citext primary key,
  reason     text not null check (reason in ('unsubscribe','bounce','complaint')),
  created_at timestamptz not null default now()
);

create table public.email_messages (
  id              uuid primary key default gen_random_uuid(),
  template_key    text not null check (template_key ~ '^[a-z][a-z0-9_]*$'),   -- EmailKey (part 06 §12.4)
  to_email        extensions.citext not null,
  user_id         uuid references public.profiles(id) on delete set null,
  workspace_id    uuid references public.workspaces(id) on delete set null,
  idempotency_key text not null unique,                                        -- e.g. payment_receipt:{paymentId}
  resend_id       text unique,
  status          text not null default 'queued' check (status in ('queued','sent','delivered','bounced','complained','failed',
                                                                  'skipped_suppressed','skipped_no_consent','skipped_pref','skipped_allowlist')),
  error           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index email_messages_to_idx     on public.email_messages (to_email, created_at desc);
create index email_messages_status_idx on public.email_messages (status, created_at);
create index email_messages_user_idx   on public.email_messages (user_id) where user_id is not null;

create table public.trial_claims (
  id         uuid primary key default gen_random_uuid(),
  email_hash text not null unique,                   -- hex(hmac_sha256(pepper, normalize_email(email)))
  phone_hash text unique,
  user_id    uuid references public.profiles(id) on delete set null,   -- survives account deletion on purpose
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id          bigint generated always as identity primary key,
  workspace_id uuid,
  actor_id    uuid,
  action      text not null check (action ~ '^[a-z_]+(\.[a-z_]+)+$'),  -- credits.adjust, job.force_refund, member.role_change …
  target_type text,
  target_id   text,
  metadata    jsonb not null default '{}',
  ip          inet,
  created_at  timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_ws_idx      on public.audit_logs (workspace_id, created_at desc);
create index audit_logs_action_idx  on public.audit_logs (action, created_at desc);

create table public.webhook_events (
  id              uuid primary key default gen_random_uuid(),
  provider        public.webhook_provider not null,
  external_id     text not null,
  event_type      text not null,
  signature_valid boolean not null,
  payload         jsonb,                             -- nulled after 90 days (pg_cron)
  status          text not null default 'received' check (status in ('received','processed','failed','ignored')),
  error           text,
  received_at     timestamptz not null default now(),
  processed_at    timestamptz,
  created_at      timestamptz not null default now(),
  unique (provider, external_id)
);
create index webhook_events_status_idx on public.webhook_events (status, received_at);

create table public.model_registry (
  slug            text primary key,
  task            public.model_task not null,
  display_name_he text not null,
  family          text not null,
  is_enabled      boolean not null default false,
  tiers           public.quality_tier[] not null default '{}',
  pricing         jsonb not null default '{}',       -- {per_m_input, per_m_output, per_image, per_second:{"480p","720p","1080p"}, per_m_chars, per_song, pricing_skus}
  capabilities    jsonb not null default '{}',       -- supported_durations, supported_resolutions, supported_aspect_ratios, supported_frame_images,
                                                     -- generate_audio, max_chars, structured_outputs, image_api: "images"|"chat"
  raw             jsonb not null default '{}',       -- last payload from /models or /videos/models; raw.suspect_missing_at set by sync-models
  source          text not null check (source in ('openrouter_models','openrouter_videos_models','manual')),
  deprecated_at   timestamptz,
  last_synced_at  timestamptz,
  notes_he        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  updated_by      uuid references public.profiles(id) on delete set null
);

create table public.model_routes (
  task_key       text primary key check (task_key ~ '^[a-z]+\.[a-z_]+$'),
  primary_slug   text not null references public.model_registry(slug) on update cascade,
  fallback_slugs text[] not null default '{}',
  params         jsonb not null default '{}',     -- temperature, structured, require_parameters, sort, max_output_tokens, batch, resolution,
                                                  -- generate_audio, max_clip_cost_usd, language, response_format, voice_passthrough
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references public.profiles(id) on delete set null
);

create table public.app_settings (
  key         text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  value       jsonb not null,
  description text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles(id) on delete set null
);

create table public.feature_flags (
  key           text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  enabled       boolean not null default false,
  plans         text[],
  workspace_ids uuid[],
  description   text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 2 and 80),
  email      extensions.citext not null,
  phone      text,
  topic      text not null check (topic in ('sales','support','accessibility','privacy','cancellation','press')),
  message    text not null check (char_length(message) between 10 and 5000),
  user_id    uuid references public.profiles(id) on delete set null,
  status     text not null default 'new' check (status in ('new','handled','spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.data_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete set null,   -- delete requests outlive the profile
  kind         text not null check (kind in ('export','delete')),
  status       text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  result_path  text,                                 -- exports bucket: {user_id}/{request_id}.zip
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index data_requests_status_idx on public.data_requests (status, created_at);

create table public.likeness_profiles (                -- v2, behind FEATURE voice_clone / avatar
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  person_name     text not null,
  kind            text not null check (kind in ('voice','avatar')),
  consent_id      uuid not null references public.consents(id) on delete restrict,
  source_asset_id uuid references public.assets(id) on delete set null,
  provider_ref    text,
  status          text not null default 'pending' check (status in ('pending','ready','failed','revoked')),
  revoked_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.api_idempotency_keys (
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  scope           text not null,                     -- route id, e.g. projects.script
  key             uuid not null,                     -- Idempotency-Key header (UUID v4)
  user_id         uuid references public.profiles(id) on delete set null,
  request_hash    text not null,                     -- hex(sha256(canonical JSON of params + body))
  status          text not null default 'in_progress' check (status in ('in_progress','completed','failed')),
  attempt         smallint not null default 1 check (attempt between 1 and 20),
  response_status smallint,
  response_body   jsonb,
  resource_id     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  expires_at      timestamptz not null default now() + interval '24 hours',
  primary key (workspace_id, scope, key)
);
create index api_idempotency_keys_expiry_idx on public.api_idempotency_keys (expires_at);
```

הערות:
- **`abuse_reports`** היא טבלה חדשה בשביל "דיווח על הסרטון" בעמוד השיתוף (חלק 03), בדיוק במבנה שחלק 03 הגדיר; ערכי `reason` ממופים לחמש האפשרויות שבדיאלוג (`likeness`, `copyright`, `hate`, `political`, `other`). `ip` נשמר לצורכי הגבלת קצב וחקירת שימוש לרעה בלבד. ‏**`source`**: ‏`share_page` (הדיאלוג בעמוד השיתוף, `POST /api/abuse-reports`), ‏`system` (סימון אוטומטי, למשל קצב חשוד של הרשמות לניסיון: `reason = 'other'`, ‏`details = 'trial_velocity'`, חלק 06 §7.1), ‏`support` (פנייה שהגיעה לתמיכה, למשל הודעה על הפרת זכויות יוצרים, חלק 06 §11.12).
- **`consents.source = 'generate'`** נכתב רק בצד השרת, בתוך `POST /api/projects/[id]/generate` (§19.8), בפעם הראשונה שמשתמש יוצר סרטון תחת גרסה של `/legal/ai-policy` (‏`kind = 'ai_content_policy'`). ה-enum הציבורי של `ConsentBody` (§21.4) **לא** מקבל את הערך הזה.
- **`consents.source = 'unsubscribe'`** נכתב רק בצד השרת, בתוך `POST /api/unsubscribe` (§21.4: הסרה בלחיצה אחת, RFC 8058, והטופס של `/unsubscribe`): שורת `granted = false` לכל אחד מ-`marketing_email`, ‏`marketing_sms` ו-`marketing_whatsapp`. זה המקור של ביטול הסכמה שיווקית מקישור במייל (חלק 06 §11.4). גם את הערך הזה ה-enum של `ConsentBody` **לא** מקבל, ו-`POST /api/consents` דוחה אותו ב-400.
- **`email_messages`** — יומן השליחות של `sendEmail` (חלק 06 §12.1): שורה לכל מייל, ייחודית לפי `idempotency_key` (למשל `payment_receipt:{paymentId}`), כך שמייל לא נשלח פעמיים. ‏`skipped_duplicate` הוא **ערך החזרה בלבד** של `sendEmail` (המפתח הייחודי מונע שורה שנייה) ולא סטטוס שמור. ‏RLS פעיל, קריאה למנהלי פלטפורמה בלבד, בלי כתיבה מהלקוח (§12). נשמר 24 חודשים (§15).
- **`trial_claims.user_id`** מותר כ-NULL (בניגוד ל-NOT NULL שבסיכום שבנספח F), כדי ששורת הניסיון תישאר גם אחרי מחיקת חשבון — אחרת אפשר היה למחוק ולהירשם שוב עם אותו מייל ולקבל 70 קרדיטים נוספים. רשימת כל הסטיות האלה ב-§9.6.
- **`api_idempotency_keys`** משמשת את `lib/idempotency.ts` לכל נתיב שמוציא קרדיטים ואינו יוצר `jobs` (§18.7). השורות נמחקות אחרי 24 שעות (§15).
- **ערכי `app_settings` ו-`feature_flags`** מגיעים מה-seed (§16.4); המיגרציה יוצרת רק את הטבלאות.

### קריטריוני קבלה
- [ ] `notifications.link = 'https://evil.com'` נדחה; `'/app/projects/…'` מתקבל.
- [ ] `webhook_events` עם אותו `(provider, external_id)` פעמיים נכשל על ה-unique.
- [ ] `consents` בלי `user_id` ובלי `email` מתקבל רק כש-`source = 'cookie_banner'`.
- [ ] `consents` עם `source = 'unsubscribe'` ו-`email` מתקבל (שרת בלבד); ‏`source = 'email_link'` נדחה על ה-check (`23514`).
- [ ] שתי שורות `email_messages` עם אותו `idempotency_key` נכשלות; ‏`status = 'skipped_duplicate'` נדחה על ה-check.
- [ ] `abuse_reports` בלי `source` מקבל `share_page`; ‏`source = 'email'` נדחה.

---

## §9. פונקציות: הרשאות, סביבות עבודה וחשבונות — `0007_functions.sql` (חלק א׳)

**כללים לכל הפונקציות:** `security definer`, `set search_path = ''`, כל אובייקט בשם מלא (`public.…`, `extensions.…`, `auth.uid()`), ו-`auth.uid()` עטוף ב-`(select auth.uid())` כשהוא בתוך שאילתה. אחרי היצירה, 0008 מבטל `execute` מכולם ומעניק רק לפי הטבלה ב-§12.6. פונקציות שמתחילות ב-`_` הן פנימיות — אף תפקיד חיצוני לא מקבל עליהן `execute`.

**מוסכמת שגיאות מ-SQL.** כל שגיאה עסקית נזרקת עם `errcode = 'P0001'`, `message` = אחד מ-27 הקודים של `ERROR_CODES` (§18.2: `INSUFFICIENT_CREDITS`, `PLAN_LIMIT`, `FORBIDDEN`…; וגם קודי ההרחבה, כשפונקציה של `0013`/`0014` זורקת אותם), ו-`detail` = JSON. שתי חריגות פנימיות של בסיס הנתונים — `LEDGER_BALANCE_MISMATCH` (§10.6) ו-`AUDIT_LOG_IMMUTABLE` (§10.6) — נזרקות גם הן עם `P0001`, אבל אינן קודי API: `fromDbError` ממפה אותן ל-`INTERNAL_ERROR`. `lib/errors.ts` (§18.2) ממפה את זה לתשובת API: supabase-js מחזיר `error.code = 'P0001'`, `error.message` = הקוד ו-`error.details` = ה-JSON.

### 9.1 עזרים, `set_updated_at` ושגיאות

```sql
-- 0007_functions.sql (part A)
create or replace function public.raise_app_error(p_code text, p_detail jsonb default '{}'::jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  raise exception using errcode = 'P0001', message = p_code, detail = coalesce(p_detail, '{}'::jsonb)::text;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- attach set_updated_at to every public table that has an updated_at column
do $$
declare r record;
begin
  for r in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name and t.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'updated_at'
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', r.table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', r.table_name);
  end loop;
end $$;

-- hooks: counters (copies/generations) must not bump updated_at (it feeds sitemap lastmod)
drop trigger if exists set_updated_at on public.hooks;
create trigger set_updated_at
  before update of niche_slug, hook_type_slug, text_he, platforms, goal, gender, visual_direction_he, placeholders,
                   season_slug, compliance_note_he, is_featured, secondary_type_slug, status, sample_video_path
  on public.hooks for each row execute function public.set_updated_at();

-- GET /api/health (§21.5): cheapest possible round trip; touches no table; granted to anon together with the search helpers (§12.6)
create or replace function public.health_ping()
returns int
language sql stable set search_path = ''
as $$ select 1 $$;

create or replace function public.normalize_email(p text)
returns text
language plpgsql immutable security definer set search_path = ''
as $$
declare v text := lower(btrim(coalesce(p, ''))); l text; d text;
begin
  if position('@' in v) = 0 then return v; end if;
  l := split_part(v, '@', 1);
  d := split_part(v, '@', 2);
  l := split_part(l, '+', 1);                                   -- drop +tag on every domain
  if d in ('gmail.com', 'googlemail.com') then
    l := replace(l, '.', '');
    d := 'gmail.com';
  end if;
  return l || '@' || d;
end $$;
```

### 9.2 הרשאות לפי סביבת עבודה

```sql
-- platform admin = the profile flag AND a session that passed MFA (aal2); without aal2 every admin policy and route denies
create or replace function public.is_platform_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select p.is_platform_admin from public.profiles p
                   where p.id = (select auth.uid()) and p.deleted_at is null), false)
     and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2';
$$;

-- used by proxy.ts to tell "not an admin" (404) from "admin without MFA" (redirect /admin/mfa)
create or replace function public.platform_admin_status()
returns text                                   -- 'none' | 'needs_mfa' | 'ok'
language sql stable security definer set search_path = ''
as $$
  select case
    when not coalesce((select p.is_platform_admin from public.profiles p
                       where p.id = (select auth.uid()) and p.deleted_at is null), false) then 'none'
    when coalesce((select auth.jwt() ->> 'aal'), 'aal1') <> 'aal2' then 'needs_mfa'
    else 'ok' end;
$$;

-- strongest role of the current user in ws: direct membership, or derived from the parent agency
-- (agency owner/admin -> admin in the client workspace; agency editor -> editor; agency viewer -> nothing)
create or replace function public.effective_role(ws uuid)
returns public.member_role
language sql stable security definer set search_path = ''
as $$
  select r from (
    select m.role as r
    from public.workspace_members m
    join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
    where m.workspace_id = ws and m.user_id = (select auth.uid())
    union all
    select case when pm.role in ('owner','admin') then 'admin'::public.member_role else 'editor'::public.member_role end
    from public.workspaces c
    join public.workspaces p on p.id = c.parent_workspace_id and p.deleted_at is null
    join public.workspace_members pm on pm.workspace_id = p.id
    where c.id = ws and c.type = 'client' and c.deleted_at is null
      and pm.user_id = (select auth.uid()) and pm.role in ('owner','admin','editor')
  ) x
  order by r asc            -- enum order: owner < admin < editor < viewer
  limit 1;
$$;

create or replace function public.is_member(ws uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.workspace_members m
                 join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
                 where m.workspace_id = ws and m.user_id = (select auth.uid()));
$$;

create or replace function public.has_role(ws uuid, roles public.member_role[])
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(public.effective_role(ws) = any (roles), false);
$$;

create or replace function public.can_access_workspace(ws uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.effective_role(ws) is not null;
$$;

-- internal twin, unchecked and NOT granted to any API role (§12.6): for security-definer callers whose user may
-- not have access to the workspace yet (accept_invite) and for the seat lock below
create or replace function public._billing_workspace_id(ws uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select case when w.type = 'client' then w.parent_workspace_id else w.id end
  from public.workspaces w where w.id = ws;
$$;

-- granted to authenticated (§12.6), so it checks access first (a signed-in user learns nothing about a foreign
-- workspace); service-role and pg_cron calls (auth.uid() is null) are unaffected
create or replace function public.billing_workspace_id(ws uuid)
returns uuid
language plpgsql stable security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not (public.can_access_workspace(ws) or public.is_platform_admin()) then
    return null;
  end if;
  return public._billing_workspace_id(ws);
end $$;

-- set-returning twins used inside RLS policies: evaluated once per statement (initPlan)
create or replace function public.accessible_workspace_ids()
returns setof uuid
language sql stable security definer set search_path = ''
as $$
  select m.workspace_id
  from public.workspace_members m
  join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
  where m.user_id = (select auth.uid())
  union
  select c.id
  from public.workspaces c
  join public.workspaces p on p.id = c.parent_workspace_id and p.deleted_at is null
  join public.workspace_members pm on pm.workspace_id = p.id
  where c.type = 'client' and c.deleted_at is null
    and pm.user_id = (select auth.uid()) and pm.role in ('owner','admin','editor');
$$;

-- p_roles must be upward-closed: {owner} · {owner,admin} · {owner,admin,editor}
create or replace function public.workspace_ids_with_role(p_roles public.member_role[])
returns setof uuid
language sql stable security definer set search_path = ''
as $$
  select m.workspace_id
  from public.workspace_members m
  join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
  where m.user_id = (select auth.uid()) and m.role = any (p_roles)
  union
  select c.id
  from public.workspaces c
  join public.workspaces p on p.id = c.parent_workspace_id and p.deleted_at is null
  join public.workspace_members pm on pm.workspace_id = p.id
  where c.type = 'client' and c.deleted_at is null and pm.user_id = (select auth.uid())
    and (case when pm.role in ('owner','admin') then 'admin'::public.member_role
              when pm.role = 'editor' then 'editor'::public.member_role end) = any (p_roles);
$$;

-- effective plan of the billing workspace (client workspaces inherit the agency plan; their own plan_id is display-only);
-- an admin plan_override wins while its `until` is in the future. _workspace_plan is the internal unchecked twin (no grants).
create or replace function public._workspace_plan(ws uuid)
returns public.plans
language sql stable security definer set search_path = ''
as $$
  select p.* from public.workspaces w
  join public.plans p on p.id = case when w.plan_override is not null and (w.plan_override->>'until')::timestamptz > now()
                                     then w.plan_override->>'plan_id' else w.plan_id end
  where w.id = public._billing_workspace_id(ws);
$$;

create or replace function public.workspace_plan(ws uuid)
returns public.plans
language plpgsql stable security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not (public.can_access_workspace(ws) or public.is_platform_admin()) then
    return null;
  end if;
  return public._workspace_plan(ws);
end $$;

-- row lock on the billing workspace: every seat check (accept_invite, change_member_role, invite creation through
-- the workspace_invites_seat_guard trigger, enforce_plan_limits) takes it before counting, so concurrent
-- invites, accepts and promotions are counted one at a time. Internal, no grants.
create or replace function public._lock_billing_workspace(ws uuid)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v uuid;
begin
  select w.id into v from public.workspaces w where w.id = public._billing_workspace_id(ws) for update;
  return v;
end $$;

-- seats in use for a billing workspace: distinct owner/admin/editor members of it and its client workspaces
-- + pending admin/editor invites. Viewers (members and invites) do not use seats and are unlimited.
create or replace function public.seats_used(p_billing_ws uuid)
returns int
language sql stable security definer set search_path = ''
as $$
  select (
    (select count(distinct m.user_id) from public.workspace_members m
      join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
      where (w.id = p_billing_ws or w.parent_workspace_id = p_billing_ws)
        and m.role <> 'viewer')
  + (select count(*) from public.workspace_invites i
      join public.workspaces w on w.id = i.workspace_id
      where (w.id = p_billing_ws or w.parent_workspace_id = p_billing_ws)
        and i.accepted_at is null and i.expires_at > now()
        and i.role <> 'viewer')
  )::int;
$$;

-- white label is resolved at render/send time, never stored on a link: the workspace toggle (of the billing
-- workspace, so a client workspace follows its agency) AND the effective plan's limit. A toggle change or a plan
-- downgrade affects existing links immediately. Service role only (§12.6): /v/[token], /approve/[token] and the
-- approval emails call it through resolveShareBranding() (§20.5).
create or replace function public.effective_white_label(p_ws uuid)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare bw uuid := public.billing_workspace_id(p_ws);
begin
  return coalesce((select w.white_label from public.workspaces w where w.id = bw and w.deleted_at is null), false)
     and coalesce(((select pl.limits from public.workspace_plan(bw) pl)->>'white_label')::boolean, false);
end $$;
```

**עזרים פרטיים מול עזרים עם בדיקת גישה.** ‏`billing_workspace_id`, ‏`workspace_plan` ו-`is_version_locked` מוענקים ל-`authenticated` (§12.6), ולכן כל אחד מהם מתחיל בבדיקה: כשיש משתמש מחובר (`auth.uid()` לא null) והוא לא `can_access_workspace` של הסביבה (ב-`is_version_locked` — דרך גרסה ← פרויקט ← סביבה) ולא מנהל פלטפורמה, הפונקציה מחזירה `null`. קריאות של התפקיד הסודי ושל pg_cron (`auth.uid()` הוא null) לא מושפעות. התאומים `_billing_workspace_id` ו-`_workspace_plan` בלי בדיקה ובלי שום הרשאת `execute`; משתמשים בהם רק בתוך פונקציות security definer שהמשתמש שלהן עוד לא חבר בסביבה (`accept_invite`) ובנעילת המושבים `_lock_billing_workspace`.

`can_access_workspace(ws)` הוא ההגדרה הקנונית ("חבר ב-ws, או בעלים, מנהל או עורך בסוכנות האם"), ומשמש בפונקציות, ב-Route Handlers, באחסון וב-Realtime. בתוך מדיניות RLS משתמשים בתאום שמחזיר קבוצה (`workspace_id in (select public.accessible_workspace_ids())`), כי Postgres מחשב אותו פעם אחת לשאילתה במקום פעם לכל שורה. בדיקת שקילות ב-§25 מוודאת ששתי הצורות מחזירות בדיוק אותה תשובה לכל זוג משתמש–סביבה.

**מנהל פלטפורמה = דגל + MFA.** ‏`is_platform_admin()` מחזירה `true` רק כש-`profiles.is_platform_admin` דולק **וגם** ה-JWT של ה-session הוא ברמת `aal2` (אימות דו-שלבי ב-TOTP). מנהל שנכנס בלי MFA הוא משתמש רגיל לכל דבר: מדיניות האדמין ב-RLS, `requirePlatformAdmin()` ו-`/api/admin/*` דוחים אותו. ‏`platform_admin_status()` מחזירה `'none'` / `'needs_mfa'` / `'ok'`, ו-`proxy.ts` משתמש בה כדי להחזיר 404 למי שאינו מנהל ולהפנות מנהל בלי MFA ל-`/admin/mfa` (§17.2).

### 9.3 יצירת סביבת עבודה

```sql
create or replace function public._create_workspace_core(p_owner uuid, p_name text, p_type public.workspace_type, p_parent uuid)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_ws uuid; v_kit uuid; v_owner uuid := p_owner; v_plan text := 'free';
begin
  if p_type = 'client' then
    select w.owner_id, w.plan_id into v_owner, v_plan
    from public.workspaces w where w.id = p_parent and w.type = 'agency' and w.deleted_at is null;
    if v_owner is null then
      perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'parent_not_agency'));
    end if;
  end if;

  insert into public.workspaces (name, slug, type, parent_workspace_id, owner_id, plan_id)
  values (btrim(p_name),
          'ws-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
          p_type,
          case when p_type = 'client' then p_parent end,
          v_owner,
          v_plan)
  returning id into v_ws;

  if p_type <> 'client' then
    insert into public.workspace_members (workspace_id, user_id, role) values (v_ws, v_owner, 'owner');
  end if;

  insert into public.workspace_balances (workspace_id) values (v_ws) on conflict do nothing;

  insert into public.brand_kits (workspace_id, name, is_default)
  values (v_ws, case when p_type = 'client' then left(btrim(p_name), 60) else 'ערכת המותג הראשית' end, true)
  returning id into v_kit;
  update public.workspaces set default_brand_kit_id = v_kit where id = v_ws;

  insert into public.business_profiles (workspace_id, business_name) values (v_ws, left(btrim(p_name), 120));
  return v_ws;
end $$;

create or replace function public.create_workspace(p_name text, p_type public.workspace_type, p_parent uuid default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_uid uuid := (select auth.uid()); v_limit int; v_count int;
begin
  if v_uid is null then perform public.raise_app_error('UNAUTHENTICATED'); end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'name'));
  end if;
  if p_type = 'agency' then                     -- agency type is set only by the billing engine on an agency subscription
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'agency_type_is_billing_managed'));
  end if;

  if p_type = 'client' then
    if not public.has_role(p_parent, array['owner','admin']::public.member_role[]) then
      perform public.raise_app_error('FORBIDDEN', jsonb_build_object('requiredRoles', array['owner','admin']));
    end if;
    select (p.limits->>'client_workspaces')::int into v_limit from public.workspace_plan(p_parent) p;
    select count(*) into v_count from public.workspaces w where w.parent_workspace_id = p_parent and w.deleted_at is null;
    if coalesce(v_limit, 0) <= v_count then
      perform public.raise_app_error('PLAN_LIMIT', jsonb_build_object('limit', 'client_workspaces', 'max', coalesce(v_limit, 0)));
    end if;
  elsif p_parent is not null then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'parent_only_for_client'));
  end if;

  return public._create_workspace_core(v_uid, p_name, p_type, p_parent);
end $$;
```

### 9.4 משתמש חדש (`handle_new_user`) וקרדיטי ניסיון

הטריגר רץ על `auth.users` אחרי הכנסה. הוא יוצר פרופיל, סביבת `business` בשם "העסק שלי" (משתנה באונבורדינג), חברות `owner`, שורת יתרה, ערכת מותג ברירת מחדל ופרופיל עסק, ואז מנסה להעניק קרדיטי ניסיון. **כשל בחלק של הניסיון לעולם לא חוסם הרשמה** — הוא נרשם כאזהרה, והמשתמש מקבל `trial_status` עם הסיבה.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_ws uuid; v_trial int; v_norm text; v_domain text; v_pepper text; v_hash text; v_denied text; v_inserted int;
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (new.id,
          nullif(left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 120), ''),
          nullif(new.raw_user_meta_data->>'avatar_url', ''),
          new.phone)
  on conflict (id) do nothing;

  v_ws := public._create_workspace_core(new.id, 'העסק שלי', 'business', null);
  update public.profiles set last_workspace_id = v_ws where id = new.id;

  begin
    v_trial := coalesce((select (s.value #>> '{}')::int from public.app_settings s where s.key = 'free_trial_credits'), 70);
    if new.email is null then
      v_denied := 'no_identifier';                -- phone-only signup (flagged v2): trial handled server-side by phone hash
    else
      v_norm   := public.normalize_email(new.email);
      v_domain := split_part(v_norm, '@', 2);
      if exists (select 1 from public.app_settings s, jsonb_array_elements_text(s.value) d
                 where s.key = 'disposable_email_domains' and d = v_domain) then
        v_denied := 'disposable_email';
      else
        select ds.decrypted_secret into v_pepper from vault.decrypted_secrets ds where ds.name = 'trial_hash_pepper';
        if v_pepper is null then
          raise warning 'trial_hash_pepper missing from vault; trial not granted for %', new.id;
          v_denied := 'no_identifier';
        else
          v_hash := encode(extensions.hmac(v_norm, v_pepper, 'sha256'), 'hex');
          insert into public.trial_claims (email_hash, user_id) values (v_hash, new.id)
          on conflict (email_hash) do nothing;
          get diagnostics v_inserted = row_count;
          if v_inserted = 1 then
            perform public.grant_credits(v_ws, v_trial, 'trial', null, 'user', new.id::text,
                                         'grant:trial:' || new.id::text, 'קרדיטים לניסיון', null);
            update public.profiles set trial_claimed_at = now(), trial_status = 'granted' where id = new.id;
          else
            v_denied := 'already_claimed';
          end if;
        end if;
      end if;
    end if;
    if v_denied is not null then
      update public.profiles set trial_status = v_denied where id = new.id;
    end if;
  exception when others then
    raise warning 'handle_new_user trial step failed for %: %', new.id, sqlerrm;
  end;

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- seed / health checks against remote projects: the vault schema is not exposed through the Data API (service role only)
create or replace function public.trial_pepper_configured()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from vault.decrypted_secrets ds where ds.name = 'trial_hash_pepper' and ds.decrypted_secret is not null);
$$;
```

- הגיבוב בצד השרת (לטלפון, כשדגל `phone_otp` דולק) משתמש באותה נוסחה: `hex(HMAC-SHA256(key = TRIAL_HASH_PEPPER, message = normalized))` (`lib/auth/trial.ts`).
- רשימת הדומיינים הזמניים נשמרת ב-`app_settings.disposable_email_domains` (מערך JSON; ה-seed טוען רשימה התחלתית של כ-200 דומיינים נפוצים, והאדמין מעדכן).
- הענקת מנהל פלטפורמה ל-`ADMIN_EMAILS` מתבצעת בצד השרת בכניסה הראשונה (`ensureFirstLogin`, חלק 03 §3), עם המפתח הסודי ורישום `audit_logs` ‏(`user.admin_grant` עם `metadata.source = 'admin_emails_bootstrap'`). הדגל לבדו לא פותח את `/admin`: בכניסה הבאה המנהל מתבקש להפעיל MFA (`/admin/mfa`).

### 9.5 הזמנות, מושבים והעברת בעלות

```sql
create or replace function public.accept_invite(p_token text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid()); v_inv public.workspace_invites; v_email text;
  v_billing uuid; v_seats int; v_used int;
begin
  if v_uid is null then perform public.raise_app_error('UNAUTHENTICATED'); end if;

  select * into v_inv from public.workspace_invites
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  for update;
  if not found or v_inv.expires_at < now() then
    perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reason', 'invite_invalid_or_expired'));
  end if;

  if exists (select 1 from public.workspace_members m where m.workspace_id = v_inv.workspace_id and m.user_id = v_uid) then
    update public.workspace_invites set accepted_at = coalesce(accepted_at, now()) where id = v_inv.id;
    return v_inv.workspace_id;                                  -- idempotent
  end if;
  if v_inv.accepted_at is not null then
    perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reason', 'invite_already_used'));
  end if;

  select u.email into v_email from auth.users u where u.id = v_uid;
  if v_email is null or lower(v_email) <> lower(v_inv.email::text) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'invite_email_mismatch'));
  end if;

  if v_inv.role <> 'viewer' then                                -- viewers do not use seats (seats_used)
    -- the invitee has no access to the workspace yet, so the unchecked twins are used (§9.2);
    -- the billing-row lock serializes this count with invite creation and change_member_role
    v_billing := public._lock_billing_workspace(v_inv.workspace_id);
    select (p.limits->>'seats')::int into v_seats from public._workspace_plan(v_billing) p;
    v_used := public.seats_used(v_billing) - 1;                 -- this pending admin/editor invite is already counted
    if v_seats is not null and v_used >= v_seats then           -- null = unlimited
      perform public.raise_app_error('PLAN_LIMIT', jsonb_build_object('limit', 'seats', 'max', v_seats));
    end if;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role, invited_by)
  values (v_inv.workspace_id, v_uid, v_inv.role, v_inv.invited_by);
  update public.workspace_invites set accepted_at = now() where id = v_inv.id;
  update public.profiles set last_workspace_id = v_inv.workspace_id where id = v_uid;
  insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, metadata)
  values (v_inv.workspace_id, v_uid, 'member.role_change', 'workspace_member', v_uid::text,
          jsonb_build_object('reason', 'invite_accepted', 'user_id', v_uid, 'from', null, 'to', v_inv.role));
  return v_inv.workspace_id;
end $$;

-- the only path for role changes: authenticated has no update grant on workspace_members (§12.2) and there is no
-- update policy (§12.4). Ownership moves only through transfer_workspace_ownership.
create or replace function public.change_member_role(p_ws uuid, p_user uuid, p_role public.member_role)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid()); v_from public.member_role; v_bw uuid; v_seats int;
begin
  if v_uid is null then perform public.raise_app_error('UNAUTHENTICATED'); end if;
  if not public.has_role(p_ws, array['owner','admin']::public.member_role[]) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('requiredRoles', array['owner','admin']));
  end if;
  if p_role = 'owner' then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'use_transfer_ownership'));
  end if;

  v_bw := public._lock_billing_workspace(p_ws);                 -- same lock as accept_invite and invite creation
  select m.role into v_from from public.workspace_members m
   where m.workspace_id = p_ws and m.user_id = p_user
   for update;
  if not found then
    perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reason', 'member_not_found'));
  end if;
  if v_from = 'owner' then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'owner_role_is_fixed'));
  end if;
  if v_from = p_role then return; end if;                       -- idempotent

  -- viewer -> editor/admin takes a seat, unless the user already holds one elsewhere in the billing workspace
  if v_from = 'viewer' and not exists (
       select 1 from public.workspace_members m
       join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
       where (w.id = v_bw or w.parent_workspace_id = v_bw) and m.user_id = p_user and m.role <> 'viewer') then
    select (p.limits->>'seats')::int into v_seats from public._workspace_plan(v_bw) p;
    if v_seats is not null and public.seats_used(v_bw) >= v_seats then   -- null = unlimited
      perform public.raise_app_error('PLAN_LIMIT', jsonb_build_object('limit', 'seats', 'max', v_seats));
    end if;
  end if;

  update public.workspace_members set role = p_role where workspace_id = p_ws and user_id = p_user;
  insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, metadata)
  values (p_ws, v_uid, 'member.role_change', 'workspace_member', p_user::text,
          jsonb_build_object('reason', 'role_change', 'user_id', p_user, 'from', v_from, 'to', p_role));
end $$;

-- invite creation (inviteMember inserts through the user client under RLS, §24.2) and a viewer -> admin/editor
-- change of a pending invite take the same billing-row lock before counting, so two concurrent invites
-- cannot overshoot `seats`
create or replace function public.invite_seat_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_bw uuid; v_seats int;
begin
  if new.role = 'viewer' or (tg_op = 'UPDATE' and old.role <> 'viewer') then
    return new;                                                 -- viewers use no seat; admin <-> editor keeps the seat
  end if;
  v_bw := public._lock_billing_workspace(new.workspace_id);
  select (p.limits->>'seats')::int into v_seats from public._workspace_plan(v_bw) p;
  if v_seats is not null and public.seats_used(v_bw) >= v_seats then     -- the new invite is not counted yet
    perform public.raise_app_error('PLAN_LIMIT', jsonb_build_object('limit', 'seats', 'max', v_seats));
  end if;
  return new;
end $$;
create trigger workspace_invites_seat_guard before insert or update of role on public.workspace_invites
  for each row execute function public.invite_seat_guard();

create or replace function public.transfer_workspace_ownership(p_ws uuid, p_new_owner uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_uid uuid := (select auth.uid());
begin
  if not exists (select 1 from public.workspace_members m where m.workspace_id = p_ws and m.user_id = v_uid and m.role = 'owner') then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('requiredRoles', array['owner']));
  end if;
  if p_new_owner = v_uid or not exists (select 1 from public.workspace_members m where m.workspace_id = p_ws and m.user_id = p_new_owner) then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'new_owner_must_be_member'));
  end if;
  update public.workspace_members set role = 'admin' where workspace_id = p_ws and user_id = v_uid;          -- frees the one-owner slot first
  update public.workspace_members set role = 'owner' where workspace_id = p_ws and user_id = p_new_owner;
  update public.workspaces set owner_id = p_new_owner where id = p_ws or (parent_workspace_id = p_ws and type = 'client');
  insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, metadata)
  values (p_ws, v_uid, 'member.role_change', 'workspace_member', p_new_owner::text,
          jsonb_build_object('reason', 'ownership_transfer', 'user_id', p_new_owner, 'to', 'owner',
                             'previous_owner', v_uid, 'previous_owner_to', 'admin'));
end $$;

-- team page: profiles are private (own row only), so member names/emails come through this function
create or replace function public.list_workspace_members(p_ws uuid)
returns table (user_id uuid, role public.member_role, full_name text, avatar_url text, email text, joined_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.can_access_workspace(p_ws) then
    perform public.raise_app_error('FORBIDDEN');
  end if;
  return query
    select m.user_id, m.role, p.full_name, p.avatar_url, u.email::text, m.created_at
    from public.workspace_members m
    join public.profiles p on p.id = m.user_id
    join auth.users u on u.id = m.user_id
    where m.workspace_id = p_ws
    order by m.role asc, m.created_at asc;
end $$;
```

- **שינוי תפקיד עובר רק דרך `change_member_role`.** אין ל-`authenticated` הרשאת `update` על `workspace_members` ואין מדיניות `update` (§12.2, §12.4), כך שאי אפשר לעקוף את מגבלת המושבים בעדכון ישיר. הפונקציה בודקת שהקורא בעלים או מנהל, דוחה `p_role = 'owner'` ושינוי של שורת הבעלים (העברת בעלות: `transfer_workspace_ownership`), ובמעבר מ-`viewer` ל-`editor`/`admin` בודקת מחדש את `seats_used` מול `limits.seats` ← `PLAN_LIMIT` ‏`{ limit: "seats", max }`. כל שינוי נרשם ב-`audit_logs` ‏(`member.role_change`).
- **נעילת מושבים אחת.** ‏`accept_invite`, ‏`change_member_role`, יצירת הזמנה (הטריגר `workspace_invites_seat_guard`) ו-`enforce_plan_limits` נועלים קודם את שורת סביבת החיוב (`_lock_billing_workspace`) ורק אחר כך סופרים. ‏`seats_used` כבר סופר הזמנות ממתינות של `admin`/`editor`, כך ששתי קבלות מקבילות לא יכולות לחרוג; הנעילה סוגרת את המרוץ ביצירת הזמנות ובקידום תפקיד.

### 9.5b אכיפת מגבלות אחרי הורדת תוכנית (`enforce_plan_limits`)

אחרי הורדת תוכנית, מושב "עודף" לא נשאר פתוח: הפונקציה מחזירה את סביבת החיוב למכסת `limits.seats` של התוכנית האפקטיבית. קודם היא מבטלת הזמנות ממתינות של `admin`/`editor` (החדשה ביותר קודם), ואם עדיין יש חריגה — מורידה חברים בתפקיד `admin`/`editor` לתפקיד `viewer` (מי שהצטרף אחרון יורד ראשון; הבעלים לעולם לא). צופים לא תופסים מושב, ולכן ההורדה באמת משחררת מקום. כל הורדה נרשמת ב-`audit_logs`.

```sql
-- service role only: called by billing_apply_plan_change (downgrade), applyScheduledChanges and the end of a
-- subscription (canceled / expired) — part 06 §5.4
create or replace function public.enforce_plan_limits(p_ws uuid, p_actor uuid default null)
returns jsonb   -- {invites_revoked: int, demoted: uuid[]}
language plpgsql security definer set search_path = ''
as $$
declare
  v_ws uuid := public.billing_workspace_id(p_ws);
  v_max int; v_revoked int := 0; v_demoted uuid[] := '{}'; r record;
begin
  perform public._lock_billing_workspace(v_ws);                 -- same lock as every other seat check (§9.2)
  select (p.limits->>'seats')::int into v_max from public.workspace_plan(v_ws) p;
  if v_max is null then                                           -- unlimited
    return jsonb_build_object('invites_revoked', 0, 'demoted', to_jsonb(v_demoted));
  end if;

  -- 1) pending admin/editor invites of the billing workspace and its client workspaces, newest first
  for r in
    select i.id from public.workspace_invites i
    join public.workspaces w on w.id = i.workspace_id
    where (w.id = v_ws or w.parent_workspace_id = v_ws)
      and i.accepted_at is null and i.expires_at > now() and i.role <> 'viewer'
    order by i.created_at desc
  loop
    exit when public.seats_used(v_ws) <= v_max;
    delete from public.workspace_invites where id = r.id;
    v_revoked := v_revoked + 1;
  end loop;

  -- 2) admin/editor members -> viewer (never the owner), latest membership first
  for r in
    select m.workspace_id, m.user_id, m.role from public.workspace_members m
    join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
    where (w.id = v_ws or w.parent_workspace_id = v_ws) and m.role in ('admin','editor')
    order by m.created_at desc
    for update of m
  loop
    exit when public.seats_used(v_ws) <= v_max;
    update public.workspace_members set role = 'viewer' where workspace_id = r.workspace_id and user_id = r.user_id;
    if not (r.user_id = any (v_demoted)) then v_demoted := v_demoted || r.user_id; end if;
    insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, metadata)
    values (r.workspace_id, p_actor, 'member.role_change', 'workspace_member', r.user_id::text,
            jsonb_build_object('reason', 'plan_downgrade', 'user_id', r.user_id, 'from', r.role, 'to', 'viewer'));
  end loop;

  return jsonb_build_object('invites_revoked', v_revoked, 'demoted', to_jsonb(v_demoted));
end $$;
```

- ערכות מותג עודפות וסביבות לקוח **לא** משתנות ב-SQL: הכללים שלהן (ערכות שלא מוצעות לסרטונים חדשים, סביבות לקוח לקריאה בלבד) רצים בזמן ריצה ב-`lib/workspace/limits.ts` (`availableBrandKits()`, `canGenerate(ws)`; חלק 06 §5.4). ‏`generate`/`render` בסביבת לקוח שנעולה כך מחזירים ‏403 `PLAN_LIMIT` ‏`{ limit: "client_workspaces", reason: "client_workspace_read_only" }` (§19.8).
- הפונקציה אידמפוטנטית: קריאה שנייה כשהסביבה כבר בתוך המכסה לא משנה דבר ומחזירה `{ "invites_revoked": 0, "demoted": [] }`.

### 9.6 מחיקת חשבון (בסיס הנתונים)

מחיקת חשבון (`POST /api/account/delete`, §21.3) לא מוחקת רשומות פיננסיות: חשבוניות, תשלומים ויומן הקרדיטים נשמרים 7 שנים לפי דיני המס, וסביבת העבודה עצמה הופכת לשורה אנונימית ונמחקת לוגית. כל השאר — פרויקטים, נכסים, ערכות מותג, פרופיל עסק, מילון הגייה, הוקים פרטיים — נמחק בפועל.

```sql
-- dry run used by the API before accepting a delete request
create or replace function public.user_deletion_blockers(p_user uuid)
returns table (workspace_id uuid, workspace_name text, other_members int)
language sql stable security definer set search_path = ''
as $$
  select w.id, w.name, (select count(*)::int from public.workspace_members m2 where m2.workspace_id = w.id and m2.user_id <> p_user)
  from public.workspace_members m
  join public.workspaces w on w.id = m.workspace_id and w.deleted_at is null
  where m.user_id = p_user and m.role = 'owner'
    and exists (select 1 from public.workspace_members m2 where m2.workspace_id = w.id and m2.user_id <> p_user);
$$;

-- step 1 of the deletion worker (service role); idempotent
create or replace function public.prepare_user_deletion(p_user uuid)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare v_owned uuid[]; r record;
begin
  if exists (select 1 from public.user_deletion_blockers(p_user)) then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'transfer_ownership_first'));
  end if;

  -- workspaces the user owns alone (+ their client workspaces): soft-delete, anonymize, drop personal content
  select coalesce(array_agg(w.id), '{}') into v_owned
  from public.workspaces w
  where w.deleted_at is null
    and (w.id in (select m.workspace_id from public.workspace_members m where m.user_id = p_user and m.role = 'owner')
         or w.parent_workspace_id in (select m.workspace_id from public.workspace_members m where m.user_id = p_user and m.role = 'owner'));

  update public.workspaces set deleted_at = now(), name = 'סביבה שנמחקה', niche_slug = null, white_label = false
   where id = any (v_owned);
  update public.projects set deleted_at = coalesce(deleted_at, now()) where workspace_id = any (v_owned);
  update public.assets set is_deleted = true,
         metadata = metadata || jsonb_build_object('purge_reason', 'account_deleted', 'purge_marked_at', now())
   where workspace_id = any (v_owned) and not is_deleted;
  update public.share_links set revoked_at = coalesce(revoked_at, now()), approver_name = null, approver_email = null, sender_note = null
   where workspace_id = any (v_owned);
  delete from public.business_profiles     where workspace_id = any (v_owned);
  delete from public.pronunciation_entries where workspace_id = any (v_owned);
  delete from public.workspace_hooks       where workspace_id = any (v_owned);
  delete from public.workspace_invites     where workspace_id = any (v_owned);
  delete from public.billing_profiles      where workspace_id = any (v_owned);
  update public.workspaces set default_brand_kit_id = null where id = any (v_owned);
  delete from public.brand_kits            where workspace_id = any (v_owned);

  -- shared workspaces where the user is a non-owner member: hand authored rows to the workspace owner
  for r in select m.workspace_id, w.owner_id from public.workspace_members m
           join public.workspaces w on w.id = m.workspace_id
           where m.user_id = p_user and not (m.workspace_id = any (v_owned)) loop
    update public.projects              set created_by   = r.owner_id where workspace_id = r.workspace_id and created_by = p_user;
    update public.project_versions v    set created_by   = r.owner_id from public.projects p
                                        where v.project_id = p.id and p.workspace_id = r.workspace_id and v.created_by = p_user;
    update public.jobs                  set requested_by = r.owner_id where workspace_id = r.workspace_id and requested_by = p_user;
    update public.share_links           set created_by   = r.owner_id where workspace_id = r.workspace_id and created_by = p_user;
    update public.workspace_hooks       set created_by   = r.owner_id where workspace_id = r.workspace_id and created_by = p_user;
    update public.pronunciation_entries set created_by   = r.owner_id where workspace_id = r.workspace_id and created_by = p_user;
    delete from public.workspace_members where workspace_id = r.workspace_id and user_id = p_user;
  end loop;

  delete from public.hook_favorites where user_id = p_user;
  delete from public.notifications  where user_id = p_user;
  -- consent records are kept 7 years after account closure (purge_support_data, §11.4): start the clock here,
  -- before deleteUser sets user_id to null
  update public.consents set subject_closed_at = coalesce(subject_closed_at, now()) where user_id = p_user;
  update public.profiles set deleted_at = now(), full_name = null, avatar_url = null, phone = null where id = p_user;
  return jsonb_build_object('owned_workspaces', to_jsonb(v_owned));
end $$;

-- step 3 (after the worker removed the storage objects): hard-delete purged content rows
create or replace function public.purge_deleted_content(p_ws uuid)
returns int
language plpgsql security definer set search_path = ''
as $$
declare v_count int;
begin
  delete from public.assets a where a.workspace_id = p_ws and a.is_deleted and (a.metadata ? 'storage_deleted_at');
  delete from public.projects p
   where p.workspace_id = p_ws and p.deleted_at is not null
     and not exists (select 1 from public.assets a where a.project_id = p.id and not (a.metadata ? 'storage_deleted_at'));
  get diagnostics v_count = row_count;
  return v_count;
end $$;
```

סדר העבודה של ה-worker (`/api/cron/cleanup`, §23): ‏`prepare_user_deletion` ← מחיקת אובייקטים מהאחסון לכל נכס עם `purge_reason` וסימון `metadata.storage_deleted_at` ← `purge_deleted_content` לכל סביבה ← `supabase.auth.admin.deleteUser(userId)` (מוחק את `profiles` ב-cascade; ‏`workspaces.owner_id` מתאפס) ← `data_requests.status = 'completed'` ומייל `account_deleted`.

**נתוני Meta ונתוני ההרחבה במחיקת חשבון** (מ-`0013`; הפונקציות בחלק 07). לכל סביבה ב-`owned_workspaces` ש-`prepare_user_deletion` מחזירה, ה-worker מריץ את הצעדים האלה מיד אחריה, לפני מחיקת האובייקטים מהאחסון. כל צעד אידמפוטנטי:
1. **חיבור Meta חי** (`meta_connections.status <> 'revoked'`): ביטול ההרשאות אצל Meta (`DELETE /me/permissions` דרך `lib/meta/tokens.ts`, חלק 07 [M0-verify לטוקן מסוג BISU]), ואז `status = 'revoked'` ו-`revoked_reason = 'workspace_deleted'`. כשל בצד של Meta לא עוצר את המחיקה: הוא נרשם ב-Sentry, והטוקנים נמחקים אצלנו בכל מקרה בצעד 2.
2. **`purge_meta_data(ws, 'all')`** — טוקנים, מראות של קמפיינים ומודעות, תובנות, כללים, יומן שינויים, טפסי לידים, לידים (גם לידים מדף העסק), פוסטים ומדדים.
3. **דף העסק, בדיקת דופק ותוכנית 30 יום:** מחיקת השורות של `landing_pages`, `ad_health_reports` ו-`content_plans` (הפריטים נמחקים ב-cascade) בלקוח הסודי, revalidate של הדפים הציבוריים `/b/[slug]` (חלק 07), כך שהם מחזירים 404 מיד, ומחיקת התיקייה `public-media/landing/{landing_page_id}/` (§13.1).

קמפיינים שרצים במטא ממשיכים לרוץ שם גם אחרי המחיקה, כי הם שייכים לחשבון המודעות של העסק ולא לנו. דיאלוג מחיקת החשבון (חלק 03) אומר את זה ומציע להשהות אותם קודם, בדיוק כמו דיאלוג הניתוק.

**מחיקה לוגית של סביבה מהאדמין** (`POST /api/admin/workspaces/[id]/soft-delete`, §24.1) היא הפיכה (`restore`), ולכן היא מריצה רק את צעד 1 ואת `purge_meta_data(ws, 'tokens')`, ומעבירה את דפי העסק של הסביבה ל-`unpublished`. שאר הנתונים נשמרים עד שחזור הסביבה או עד מחיקת החשבון.

**סטיות NOT NULL מכוונות** — העמודות הבאות, שמצביעות על משתמש, מותרות כ-NULL (או בלי FK בכלל), כדי ש-`deleteUser` לא ייחסם על שורה שנשארה, ובלי למחוק רשומות שהחוק מחייב לשמור:
- `workspaces.owner_id` — ‏NULL רק כש-`deleted_at` מלא (`workspaces_owner_present`); הסביבה שנמחקה נשמרת כשורה אנונימית עם היומן, התשלומים והחשבוניות.
- `trial_claims.user_id` — שורת הניסיון שורדת את מחיקת החשבון, כדי שאי אפשר יהיה להירשם שוב ולקבל 70 קרדיטים נוספים.
- `checkout_sessions.created_by` — היסטוריית הקופה נשמרת.
- `data_requests.user_id` — בקשת המחיקה עצמה שורדת את הפרופיל.
- `credit_ledger.job_id` ו-`credit_ledger.actor_id` — בלי FK בכלל; היומן לא נמחק לעולם.
- `projects.created_by`, ‏`project_versions.created_by`, ‏`jobs.requested_by`, ‏`share_links.created_by`, ‏`workspace_hooks.created_by`, ‏`pronunciation_entries.created_by` — ‏`on delete set null`. ‏`prepare_user_deletion` עדיין מעביר את השורות בסביבות משותפות לבעלי הסביבה (ייחוס); ה-FK רק מבטיח ש-`deleteUser` לא ייכשל על שארית. מדיניות ההכנסה ב-RLS (`created_by = auth.uid()`) לא השתנתה, והממשק מציג "משתמש שנמחק" כשהמחבר חסר.
- עמודות המחבר, המאשר וההקצאה בטבלאות של `0013` ו-`0014` (למשל `meta_connections.connected_by`, `ad_campaigns.created_by`, `leads.assigned_to`, `trend_references.rights_attested_by`, `guided_shoots.attested_by`) — `on delete set null` ו-nullable (§2.3, כלל 4).

### קריטריוני קבלה
- [ ] משתמש חדש מקבל: פרופיל, סביבה אחת מסוג `business` בשם "העסק שלי", חברות `owner`, ערכת מותג ברירת מחדל, יתרה 70 ושורת יומן `grant_trial` אחת.
- [ ] הרשמה שנייה עם `Dana.Levi+promo@gmail.com` אחרי `danalevi@googlemail.com` מקבלת `trial_status = 'already_claimed'` ויתרה 0; ההרשמה עצמה מצליחה. הראשונה קיבלה `trial_status = 'granted'`.
- [ ] כשהסוד `trial_hash_pepper` חסר, ההרשמה מצליחה ומתקבל `trial_status = 'no_identifier'`.
- [ ] `accept_invite` עם מייל שונה מזה של ההזמנה נכשל ב-`FORBIDDEN`; קבלה כפולה מחזירה את אותה סביבה בלי שגיאה; קבלה שעוברת את מכסת המושבים נכשלת ב-`PLAN_LIMIT` עם `{"limit":"seats"}`.
- [ ] עורך בסוכנות מקבל `effective_role = 'editor'` בסביבת לקוח; צופה בסוכנות מקבל `null`.
- [ ] `prepare_user_deletion` למשתמש שבבעלותו סביבה עם חברים נוספים נכשל ב-`INVALID_INPUT` (`transfer_ownership_first`).
- [ ] מחיקת חשבון של בעלים יחיד עם חיבור Meta, לידים ודף עסק שפורסם (ב-mock של Meta): החיבור עובר ל-`revoked` עם `workspace_deleted`, אין שורות ב-`meta_tokens`, `leads` ו-`landing_pages` של הסביבה, ו-`/b/[slug]` מחזיר 404; ריצה שנייה של ה-worker לא נכשלת.
- [ ] משתמש שהיה עורך בסביבה של מישהו אחר ומחק את חשבונו: `auth.admin.deleteUser` מצליח, והשורות שנשארו (פרויקט, גרסה, עבודה, קישור שיתוף) מקבלות מחבר `NULL` או את בעלי הסביבה.
- [ ] `platform_admin_status()` מחזירה `none` למשתמש רגיל, `needs_mfa` למנהל עם JWT ברמת `aal1`, ו-`ok` למנהל ברמת `aal2`; ‏`is_platform_admin()` = `true` רק במקרה האחרון.
- [ ] בתוכנית בסיס (מושב אחד): הזמנה של `viewer` מתקבלת ונכנסת גם כשהמושב תפוס; הזמנה של `editor` נכשלת ב-`PLAN_LIMIT`. ‏`seats_used` לא סופר צופים.
- [ ] `update workspace_members set role` ישיר נכשל בשגיאת הרשאה (`42501`) גם לבעלים; ‏`change_member_role` מ-`viewer` ל-`editor` כשהמושבים מלאים ← `PLAN_LIMIT` ‏`{"limit":"seats"}`; שינוי של שורת הבעלים ← `FORBIDDEN`.
- [ ] משתמש מחובר שאינו חבר בסביבה מקבל `null` מ-`billing_workspace_id`, ‏`workspace_plan` ו-`is_version_locked` שלה; ‏`effective_white_label` מחזיר `false` אחרי הורדה מ-`agency` ל-`business`, גם כש-`workspaces.white_label = true`.
- [ ] `enforce_plan_limits` על סביבה עם בעלים, שני עורכים והזמנת עורך ממתינה, שעברה מ-`business` ל-`starter` (מושב אחד): ההזמנה נמחקת, שני העורכים הופכים ל-`viewer`, הבעלים נשאר `owner`, ונוספות 2 שורות `audit_logs` ‏(`member.role_change`, ‏`reason = 'plan_downgrade'`); קריאה שנייה לא משנה דבר.

---

## §10. מנוע הקרדיטים — `0007_functions.sql` (חלק ב׳)

### 10.1 המודל

| מושג | איפה | כלל |
|---|---|---|
| **יתרה** (`balance`) | `workspace_balances.balance` | = `SUM(credit_ledger.delta)` = `SUM(credit_grants.remaining)`. זו היתרה **הזמינה**: קרדיטים שמורים כבר ירדו ממנה |
| **שמור** (`reserved`) | `workspace_balances.reserved` | = `SUM(amount - captured)` על שמירות `open`. מחושב מחדש בטריגר בכל שורת יומן |
| **דלי** (grant) | `credit_grants` | כל הענקה היא דלי עם `remaining` ו-`expires_at`. צריכה: הדלי שפג ראשון, ואז הישן ביותר (`expires_at asc nulls last, created_at asc`) |
| **שמירה** (reservation) | `credit_reservations` | `amount` נלקח מהדליים מראש (`allocations` = ‏`[{grant_id, amount, returned}]`); `captured` = מה שנצרך; `refunded` = מה שהוחזר בהחזרים |
| **יומן** (ledger) | `credit_ledger` | רק הוספה. `reserve` ‏(−N) · `capture` ‏(0, מתעד צריכה של שלב) · `release` ‏(+לא נוצל) · `refund` ‏(+הוחזר) · הענקות ורכישות (+N) · `expire` ‏(−יתרת דלי) · `adjustment` (±, אדמין) |
| **מפתחות אידמפוטנטיות** | `credit_ledger.idempotency_key`, ‏`credit_reservations.idempotency_key` | לפי §6.4 בנספח F: `reserve:{jobId}` · `capture:{jobId}:{stepKey}` · `settle:{reservationId}` · `refund:{reservationId}` · `refund:{jobId}:{stepKey}` · `spend:{scope}:{key}:{attempt}` (`begin_spend`; ‏`commit_spend` מוסיף `:capture` ו-`:settle`) · `grant:trial:{userId}` · `grant:plan:{subscriptionId}:{periodStartISO}` · `grant:plan_change:{paymentId}` · `grant:pack:{paymentId}` · `grant:admin:{auditLogId}` · `debit:admin:{auditLogId}` · `expire:{grantId}` (פקיעה טבעית, פעם אחת לכל דלי) · `expire:cap:{grantId}:{ref}` (תקרת הגלגול, `cap_rollover`; ‏`ref` = מפתח האידמפוטנטיות של ההענקה) · `revoke:{refundRequestId}:{grantId}` · `revoke:admin:{auditLogId}` · `revoke:chargeback:{paymentId}:{grantId}` |

**סדר נעילות (מונע deadlock):** תמיד `workspace_balances` של סביבת החיוב (`for update`) ← שורת `credit_reservations` ← שורות `credit_grants` לפי סדר הצריכה. כל פונקציה שמשנה קרדיטים נועלת קודם את שורת היתרה; זו נקודת הסריאליזציה לכל סביבת חיוב, ולכן שתי שמירות מקבילות לעולם לא חורגות מהיתרה.

**החזרה לדליים:** קרדיטים שחוזרים (`release`, `refund`) נכנסים לדליים שמהם נלקחו, מהאחרון שהוקצה לראשון (כלומר לדלי שתוקפו הארוך ביותר — הכי נדיב למשתמש). אם הדלי המקורי כבר פג (`expired_at` מולא, או ש-`expires_at` עבר לפי `clock_timestamp()`), הקרדיטים נכנסים לדלי חדש מאותו מקור עם תוקף של 7 ימים (`ref_type = 'reservation_return'`) — כך אף החזר לא "נעלם", ודלי שפג לעולם לא מתמלא מחדש ולא פג פעמיים (המפתח `expire:{grantId}` נכתב פעם אחת בלבד).

**כלל ההגנה של §6.4 בנספח F:** `capture` לעולם לא עובר את גובה השמירה. אם השימוש בפועל גבוה מההערכה (למשל קריינות ארוכה יותר), ההפרש נבלע ולא מחויב בדיעבד.

### 10.2 פונקציות פנימיות

```sql
-- 0007_functions.sql (part B)
create or replace function public._lock_balance(p_ws uuid)
returns int
language plpgsql security definer set search_path = ''
as $$
declare v int;
begin
  insert into public.workspace_balances (workspace_id) values (p_ws) on conflict do nothing;
  select b.balance into v from public.workspace_balances b where b.workspace_id = p_ws for update;
  return v;
end $$;

-- assumes the caller holds the balance lock of p_ws
create or replace function public._expire_due_grants(p_ws uuid)
returns int
language plpgsql security definer set search_path = ''
as $$
declare g record; v_bal int; v_n int := 0;
begin
  for g in
    select c.id, c.remaining from public.credit_grants c
    where c.workspace_id = p_ws and c.remaining > 0 and c.expired_at is null
      and c.expires_at is not null and c.expires_at <= clock_timestamp()
    order by c.id
    for update
  loop
    update public.credit_grants set remaining = 0, expired_at = clock_timestamp() where id = g.id;   -- never refilled again (_return_to_grants)
    select b.balance into v_bal from public.workspace_balances b where b.workspace_id = p_ws;
    insert into public.credit_ledger (workspace_id, delta, kind, balance_after, grant_id, description_he, idempotency_key)
    values (p_ws, -g.remaining, 'expire', v_bal - g.remaining, g.id, 'קרדיטים שפג תוקפם', 'expire:' || g.id::text);
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

-- returns p_amount credits of reservation p_res to its source grants (latest allocation first); caller holds the locks
create or replace function public._return_to_grants(p_res uuid, p_amount int)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  r public.credit_reservations; g public.credit_grants;
  v_allocs jsonb; a jsonb; i int; v_left int := p_amount; v_can int; v_give int;
begin
  if p_amount is null or p_amount <= 0 then return; end if;
  select * into r from public.credit_reservations where id = p_res;
  v_allocs := r.allocations;
  for i in reverse jsonb_array_length(v_allocs) - 1 .. 0 loop
    exit when v_left = 0;
    a := v_allocs -> i;
    v_can := (a->>'amount')::int - coalesce((a->>'returned')::int, 0);
    continue when v_can <= 0;
    v_give := least(v_can, v_left);
    select * into g from public.credit_grants where id = (a->>'grant_id')::uuid for update;
    if g.expired_at is null and (g.expires_at is null or g.expires_at > clock_timestamp()) then
      update public.credit_grants set remaining = remaining + v_give where id = g.id;
    else
      insert into public.credit_grants (workspace_id, source, amount, remaining, expires_at, ref_type, ref_id)
      values (r.workspace_id, g.source, v_give, v_give, now() + interval '7 days', 'reservation_return', r.id::text);
    end if;
    v_allocs := jsonb_set(v_allocs, array[i::text, 'returned'], to_jsonb(coalesce((a->>'returned')::int, 0) + v_give));
    v_left := v_left - v_give;
  end loop;
  if v_left > 0 then
    raise exception 'credit return of % exceeds allocations of reservation %', p_amount, p_res;
  end if;
  update public.credit_reservations set allocations = v_allocs where id = p_res;
end $$;

-- rollover cap (part 06 §2.4). Called inside billing_apply_* (§10.8) BEFORE the plan grant, with the balance lock held;
-- p_cap = rollover_cap_multiplier × max(monthly_credits of the previous plan, of the new plan), p_ref = the idempotency
-- key of the grant being applied. Valid plan_cycle/rollover credits above p_cap expire now, soonest-expiring grant first.
-- A partial expiry has its own key, so the later natural expiry of the same grant (expire:{grantId}) never collides.
create or replace function public.cap_rollover(p_ws uuid, p_cap int, p_ref text)
returns int                                                         -- credits expired
language plpgsql security definer set search_path = ''
as $$
declare g record; v_total int; v_excess int; v_take int; v_bal int; v_done int := 0;
begin
  if p_cap is null or p_cap < 0 or p_ref is null then return 0; end if;
  -- already applied for this grant event: keys are expire:cap:{36-char grantId}:{p_ref}, so p_ref starts at char 49
  if exists (select 1 from public.credit_ledger l
             where l.workspace_id = p_ws and l.kind = 'expire'
               and starts_with(l.idempotency_key, 'expire:cap:') and substr(l.idempotency_key, 49) = p_ref) then
    return 0;
  end if;
  select coalesce(sum(c.remaining), 0)::int into v_total from public.credit_grants c
   where c.workspace_id = p_ws and c.source in ('plan_cycle','rollover') and c.remaining > 0
     and c.expired_at is null and (c.expires_at is null or c.expires_at > clock_timestamp());
  v_excess := v_total - p_cap;
  if v_excess <= 0 then return 0; end if;

  for g in
    select c.id, c.remaining from public.credit_grants c
     where c.workspace_id = p_ws and c.source in ('plan_cycle','rollover') and c.remaining > 0
       and c.expired_at is null and (c.expires_at is null or c.expires_at > clock_timestamp())
     order by c.expires_at asc nulls last, c.created_at asc, c.id
     for update
  loop
    exit when v_excess = 0;
    v_take := least(g.remaining, v_excess);
    update public.credit_grants set remaining = remaining - v_take where id = g.id;   -- expired_at stays null: not a natural expiry
    select b.balance into v_bal from public.workspace_balances b where b.workspace_id = p_ws;
    insert into public.credit_ledger (workspace_id, delta, kind, balance_after, grant_id, description_he, idempotency_key)
    values (p_ws, -v_take, 'expire', v_bal - v_take, g.id, 'קרדיטים מעבר לתקרת הגלגול',
            'expire:cap:' || g.id::text || ':' || p_ref);
    v_excess := v_excess - v_take;
    v_done := v_done + v_take;
  end loop;
  return v_done;
end $$;
```

### 10.3 הענקה, שמירה, חיוב, שחרור והחזר

```sql
create or replace function public.grant_credits(
  p_ws uuid, p_amount int, p_source public.grant_source, p_expires_at timestamptz,
  p_ref_type text, p_ref_id text, p_idem text, p_description_he text, p_actor uuid default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v_ws uuid; v_bal int; v_grant uuid; v_ledger bigint; v_kind public.ledger_kind;
begin
  if p_amount is null or p_amount <= 0 then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'amount'));
  end if;
  select l.id into v_ledger from public.credit_ledger l where l.idempotency_key = p_idem;
  if found then return v_ledger; end if;

  v_ws := public.billing_workspace_id(p_ws);                        -- grants always land on the billing workspace
  if v_ws is null then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('workspace', p_ws)); end if;
  v_bal := public._lock_balance(v_ws);
  select l.id into v_ledger from public.credit_ledger l where l.idempotency_key = p_idem;   -- re-check under the lock
  if found then return v_ledger; end if;

  v_kind := case p_source
              when 'trial'      then 'grant_trial'
              when 'plan_cycle' then 'grant_plan'
              when 'rollover'   then 'grant_rollover'
              when 'topup'      then 'purchase'
              when 'promo'      then 'promo'
              else 'adjustment' end;                                -- admin, goodwill
  insert into public.credit_grants (workspace_id, source, amount, remaining, expires_at, ref_type, ref_id)
  values (v_ws, p_source, p_amount, p_amount, p_expires_at, p_ref_type, p_ref_id)
  returning id into v_grant;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, grant_id, payment_id, description_he, idempotency_key, actor_id)
  values (v_ws, p_amount, v_kind, v_bal + p_amount, v_grant,
          case when p_ref_type = 'payment' then p_ref_id::uuid end,
          p_description_he, p_idem, coalesce(p_actor, (select auth.uid())))
  returning id into v_ledger;
  return v_ledger;
end $$;

create or replace function public.reserve_credits(
  p_ws uuid, p_amount int, p_job uuid, p_idem text,
  p_daily_cap int default null, p_description_he text default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_res uuid; v_bal int; v_used int; v_left int := p_amount; v_take int; v_alloc jsonb := '[]'::jsonb; g record;
begin
  if p_amount is null or p_amount <= 0 then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'amount'));
  end if;
  select r.id into v_res from public.credit_reservations r where r.idempotency_key = p_idem;
  if found then return v_res; end if;
  if public.billing_workspace_id(p_ws) is distinct from p_ws then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'not_billing_workspace'));
  end if;

  perform public._lock_balance(p_ws);
  select r.id into v_res from public.credit_reservations r where r.idempotency_key = p_idem;
  if found then return v_res; end if;

  perform public._expire_due_grants(p_ws);                          -- never spend a bucket that already expired
  select b.balance into v_bal from public.workspace_balances b where b.workspace_id = p_ws;

  if p_daily_cap is not null then
    select coalesce(-sum(l.delta), 0)::int into v_used
    from public.credit_ledger l
    where l.workspace_id = p_ws and l.kind in ('reserve','release','refund')
      and l.created_at >= (date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem');
    if v_used + p_amount > p_daily_cap then
      perform public.raise_app_error('PLAN_LIMIT', jsonb_build_object('limit', 'daily_credit_cap', 'cap', p_daily_cap, 'used', v_used));
    end if;
  end if;

  if v_bal < p_amount then
    perform public.raise_app_error('INSUFFICIENT_CREDITS', jsonb_build_object('needed', p_amount, 'balance', v_bal));
  end if;

  for g in
    select c.id, c.remaining from public.credit_grants c
    where c.workspace_id = p_ws and c.remaining > 0 and (c.expires_at is null or c.expires_at > now())
    order by c.expires_at asc nulls last, c.created_at asc, c.id
    for update
  loop
    exit when v_left = 0;
    v_take := least(g.remaining, v_left);
    update public.credit_grants set remaining = remaining - v_take where id = g.id;
    v_alloc := v_alloc || jsonb_build_array(jsonb_build_object('grant_id', g.id, 'amount', v_take, 'returned', 0));
    v_left := v_left - v_take;
  end loop;
  if v_left > 0 then                                                -- balance and buckets disagree: refuse, never overdraw
    perform public.raise_app_error('INSUFFICIENT_CREDITS',
      jsonb_build_object('needed', p_amount, 'balance', p_amount - v_left, 'reason', 'grant_mismatch'));
  end if;

  insert into public.credit_reservations (workspace_id, job_id, amount, status, allocations, idempotency_key)
  values (p_ws, p_job, p_amount, 'open', v_alloc, p_idem)
  returning id into v_res;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, reservation_id, job_id, description_he, idempotency_key, actor_id)
  values (p_ws, -p_amount, 'reserve', v_bal - p_amount, v_res, p_job,
          coalesce(p_description_he, case when p_job is null then 'שימוש בקרדיטים' else 'קרדיטים שמורים ליצירת סרטון' end),
          p_idem, (select auth.uid()));
  if p_job is not null then
    update public.jobs set reservation_id = v_res where id = p_job;
  end if;
  return v_res;
end $$;

create or replace function public.capture_credits(p_reservation uuid, p_amount int, p_idem text, p_description_he text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare r public.credit_reservations; v_bal int; v_amt int;
begin
  if p_amount is null or p_amount < 0 then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'amount'));
  end if;
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return; end if;
  select * into r from public.credit_reservations where id = p_reservation;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reservation', p_reservation)); end if;

  v_bal := public._lock_balance(r.workspace_id);
  select * into r from public.credit_reservations where id = p_reservation for update;
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return; end if;
  if r.status <> 'open' then return; end if;                        -- late capture after cancel/settle/refund: ignored

  v_amt := least(p_amount, r.amount - r.captured);                  -- never beyond the reservation
  update public.credit_reservations set captured = captured + v_amt where id = r.id;
  if r.job_id is not null then
    update public.jobs set credits_captured = credits_captured + v_amt where id = r.job_id;
  end if;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, reservation_id, job_id, description_he, idempotency_key)
  values (r.workspace_id, 0, 'capture', v_bal, r.id, r.job_id,
          left(format('%s · %s קרדיטים', coalesce(nullif(p_description_he, ''), 'שלב ביצירה'), v_amt), 200), p_idem);
end $$;

create or replace function public.settle_reservation(p_reservation uuid, p_idem text)
returns int
language plpgsql security definer set search_path = ''
as $$
declare r public.credit_reservations; v_bal int; v_unused int;
begin
  select * into r from public.credit_reservations where id = p_reservation;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reservation', p_reservation)); end if;
  v_bal := public._lock_balance(r.workspace_id);
  select * into r from public.credit_reservations where id = p_reservation for update;
  if r.status <> 'open' then return 0; end if;                      -- idempotent

  v_unused := r.amount - r.captured;
  perform public._return_to_grants(r.id, v_unused);
  update public.credit_reservations set status = 'settled', settled_at = now() where id = r.id;   -- before the ledger row: the trigger recomputes `reserved`
  if v_unused > 0 then
    insert into public.credit_ledger (workspace_id, delta, kind, balance_after, reservation_id, job_id, description_he, idempotency_key)
    values (r.workspace_id, v_unused, 'release', v_bal + v_unused, r.id, r.job_id, 'החזרת קרדיטים שלא נוצלו', p_idem);
  end if;
  return v_unused;
end $$;

create or replace function public.refund_reservation(p_reservation uuid, p_idem text, p_reason_he text)
returns int
language plpgsql security definer set search_path = ''
as $$
declare r public.credit_reservations; v_bal int; v_total int;
begin
  select * into r from public.credit_reservations where id = p_reservation;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reservation', p_reservation)); end if;
  v_bal := public._lock_balance(r.workspace_id);
  select * into r from public.credit_reservations where id = p_reservation for update;
  if r.status = 'refunded' then return 0; end if;
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return 0; end if;

  -- open: everything not yet refunded (uncaptured + captured); settled: what was captured and not yet refunded
  v_total := case when r.status = 'open' then r.amount - r.refunded else r.captured - r.refunded end;
  perform public._return_to_grants(r.id, v_total);
  update public.credit_reservations
     set status = 'refunded', refunded = refunded + v_total, settled_at = coalesce(settled_at, now())
   where id = r.id;
  if r.job_id is not null then
    update public.jobs set credits_captured = 0 where id = r.job_id;
  end if;
  if v_total > 0 then
    insert into public.credit_ledger (workspace_id, delta, kind, balance_after, reservation_id, job_id, description_he, idempotency_key)
    values (r.workspace_id, v_total, 'refund', v_bal + v_total, r.id, r.job_id,
            left(coalesce(nullif(p_reason_he, ''), 'החזר קרדיטים'), 200), p_idem);
  end if;
  return v_total;
end $$;

-- partial refund of credits that were CAPTURED for one step (e.g. a degraded scene inside a successful job)
create or replace function public.refund_credits(p_reservation uuid, p_amount int, p_idem text, p_reason_he text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare r public.credit_reservations; v_bal int; v_amt int; v_job uuid; v_step text; v_step_credits int;
begin
  if p_amount is null or p_amount <= 0 then return; end if;
  select * into r from public.credit_reservations where id = p_reservation;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reservation', p_reservation)); end if;
  v_bal := public._lock_balance(r.workspace_id);
  select * into r from public.credit_reservations where id = p_reservation for update;
  if r.status = 'refunded' then return; end if;
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return; end if;

  v_amt := least(p_amount, r.captured - r.refunded);
  -- step-scoped key refund:{jobId}:{stepKey}: only if that step was captured, and never more than it captured
  if p_idem ~ '^refund:[0-9a-f-]{36}:.+$' then
    v_job  := substr(p_idem, 8, 36)::uuid;
    v_step := substr(p_idem, 45);
    if not exists (select 1 from public.credit_ledger l where l.idempotency_key = 'capture:' || v_job::text || ':' || v_step) then
      return;                                                       -- never captured: settle will release it, nothing to refund
    end if;
    select s.credits into v_step_credits from public.job_steps s where s.job_id = v_job and s.step_key = v_step;
    v_amt := least(v_amt, coalesce(v_step_credits, v_amt));
  end if;
  if v_amt <= 0 then return; end if;

  perform public._return_to_grants(r.id, v_amt);
  update public.credit_reservations set refunded = refunded + v_amt where id = r.id;
  if r.job_id is not null then
    update public.jobs set credits_captured = greatest(credits_captured - v_amt, 0) where id = r.job_id;
  end if;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, reservation_id, job_id, description_he, idempotency_key)
  values (r.workspace_id, v_amt, 'refund', v_bal + v_amt, r.id, r.job_id,
          left(coalesce(nullif(p_reason_he, ''), 'החזר קרדיטים על שלב שלא הצליח'), 200), p_idem);
end $$;

-- interactive LLM actions (script, storyboard, hooks): reserve BEFORE the model call, capture only AFTER the output
-- is persisted. Flow (§19.5): gates -> begin_spend -> model call(s) -> persist -> commit_spend -> complete_idempotency_key;
-- any error -> refund_reservation(res, 'refund:' || res, …). A reservation left open (function killed mid-call) is
-- refunded by the sweeper (§23, sweep_orphaned_spends).
create or replace function public.begin_spend(
  p_ws uuid, p_amount int, p_action_key text, p_ref text, p_idem text, p_daily_cap int default null)
returns uuid                                                        -- reservation id; null for a free action
language plpgsql security definer set search_path = ''
as $$
declare v_res uuid; v_label text;
begin
  if p_amount is null or p_amount <= 0 then return null; end if;    -- free actions never touch the ledger
  select c.label_he into v_label from public.credit_costs c where c.action_key = p_action_key;
  v_res := public.reserve_credits(public.billing_workspace_id(p_ws), p_amount, null, p_idem, p_daily_cap, coalesce(v_label, 'שימוש בקרדיטים'));
  update public.credit_reservations set action_key = p_action_key, ref = p_ref where id = v_res and action_key is null;
  return v_res;                                                     -- status stays 'open' until commit_spend
end $$;

-- captures the full amount and settles; idempotent (ledger keys p_idem || ':capture' / ':settle'; a second call is a no-op,
-- and a reservation already refunded by the catch or the sweeper is left alone)
create or replace function public.commit_spend(p_reservation uuid, p_idem text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare r public.credit_reservations; v_label text;
begin
  if p_reservation is null then return; end if;                     -- free action
  select * into r from public.credit_reservations where id = p_reservation;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('reservation', p_reservation)); end if;
  if r.status <> 'open' then return; end if;
  select c.label_he into v_label from public.credit_costs c where c.action_key = r.action_key;
  perform public.capture_credits(r.id, r.amount, p_idem || ':capture', coalesce(v_label, r.action_key));
  perform public.settle_reservation(r.id, p_idem || ':settle');
end $$;

-- sweeper step "orphaned interactive spends" (§23 sweep-jobs; service role only): job-less reservations still open
-- after 6 minutes (maxDuration 300 s + 60 s) are refunded, and in_progress API idempotency keys of the same age
-- become failed. If the function was killed after persisting but before commit_spend, the user keeps the output free
-- (fail-safe by design).
create or replace function public.sweep_orphaned_spends(p_older_than interval default interval '6 minutes')
returns int                                                         -- reservations refunded
language plpgsql security definer set search_path = ''
as $$
declare r record; v_n int := 0;
begin
  for r in
    select c.id from public.credit_reservations c
     where c.job_id is null and c.status = 'open' and c.created_at < now() - p_older_than
     order by c.created_at
     limit 500
  loop
    begin                                                           -- one bad row never stops the sweep
      perform public.refund_reservation(r.id, 'refund:' || r.id::text, 'הפעולה לא הושלמה. הקרדיטים הוחזרו.');
      v_n := v_n + 1;
    exception when others then
      raise warning 'sweep_orphaned_spends: reservation % failed: % (%)', r.id, sqlerrm, sqlstate;
    end;
  end loop;
  update public.api_idempotency_keys
     set status = 'failed', updated_at = now()
   where status = 'in_progress' and updated_at < now() - p_older_than;
  return v_n;
end $$;

-- admin negative adjustment (credits.adjust with a negative amount)
create or replace function public.debit_credits(p_ws uuid, p_amount int, p_idem text, p_description_he text, p_actor uuid default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v_ws uuid := public.billing_workspace_id(p_ws); v_bal int; v_left int := p_amount; v_take int; g record; v_ledger bigint;
begin
  if p_amount is null or p_amount <= 0 then perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'amount')); end if;
  select l.id into v_ledger from public.credit_ledger l where l.idempotency_key = p_idem;
  if found then return v_ledger; end if;
  perform public._lock_balance(v_ws);
  select l.id into v_ledger from public.credit_ledger l where l.idempotency_key = p_idem;   -- re-check under the lock
  if found then return v_ledger; end if;
  perform public._expire_due_grants(v_ws);
  select b.balance into v_bal from public.workspace_balances b where b.workspace_id = v_ws;
  if v_bal < p_amount then
    perform public.raise_app_error('INSUFFICIENT_CREDITS', jsonb_build_object('needed', p_amount, 'balance', v_bal));
  end if;
  for g in select c.id, c.remaining from public.credit_grants c
           where c.workspace_id = v_ws and c.remaining > 0
           order by c.expires_at asc nulls last, c.created_at asc, c.id for update
  loop
    exit when v_left = 0;
    v_take := least(g.remaining, v_left);
    update public.credit_grants set remaining = remaining - v_take where id = g.id;
    v_left := v_left - v_take;
  end loop;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, description_he, idempotency_key, actor_id)
  values (v_ws, -p_amount, 'adjustment', v_bal - p_amount, p_description_he, p_idem, p_actor)
  returning id into v_ledger;
  return v_ledger;
end $$;

-- removes what is left in ONE bucket (refund of a payment, chargeback, admin tool). debit_credits consumes FIFO across
-- buckets and is wrong for this. Reserved credits are already outside `remaining`, so open jobs are not affected.
-- keys: revoke:{refundRequestId}:{grantId} · revoke:admin:{auditLogId} · revoke:chargeback:{paymentId}:{grantId}
create or replace function public.revoke_grant_remaining(p_grant uuid, p_idem text, p_description_he text, p_actor uuid default null)
returns int   -- credits removed (0 if nothing left or already applied)
language plpgsql security definer set search_path = ''
as $$
declare v_ws uuid; v_bal int; v int;
begin
  select g.workspace_id into v_ws from public.credit_grants g where g.id = p_grant;
  if not found then perform public.raise_app_error('NOT_FOUND', jsonb_build_object('grant', p_grant)); end if;
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return 0; end if;

  v_bal := public._lock_balance(v_ws);
  if exists (select 1 from public.credit_ledger l where l.idempotency_key = p_idem) then return 0; end if;   -- re-check under the lock
  select g.remaining into v from public.credit_grants g where g.id = p_grant for update;
  if v = 0 then return 0; end if;

  update public.credit_grants set remaining = 0 where id = p_grant;
  insert into public.credit_ledger (workspace_id, delta, kind, balance_after, grant_id, description_he, idempotency_key, actor_id)
  values (v_ws, -v, 'adjustment', v_bal - v, p_grant,
          left(coalesce(nullif(p_description_he, ''), 'הסרת יתרת קרדיטים'), 200), p_idem, p_actor);
  return v;
end $$;

create or replace function public.expire_credit_grants()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v_ws uuid; v_n int := 0;
begin
  for v_ws in
    select distinct g.workspace_id from public.credit_grants g
    where g.remaining > 0 and g.expired_at is null and g.expires_at is not null and g.expires_at <= clock_timestamp()
    order by 1
  loop
    begin                                                           -- one tenant's error never aborts the whole run
      perform public._lock_balance(v_ws);
      v_n := v_n + public._expire_due_grants(v_ws);
    exception when others then
      raise warning 'expire_credit_grants: workspace % failed: % (%)', v_ws, sqlerrm, sqlstate;
    end;
  end loop;
  return v_n;
end $$;
```

### 10.4 פתיחת עבודה עם שמירה אטומית

`POST /api/projects/[id]/generate`, ‏`…/scenes/[sceneId]/regenerate` ו-`…/render` קוראים לפונקציה אחת שמבצעת את §6.4 בנספח F בטרנזקציה אחת: בדיקת אידמפוטנטיות ← נעילת יתרת החיוב ← בדיקת מקביליות ← הכנסת `jobs` ← `reserve_credits`. אם השמירה נכשלת (`INSUFFICIENT_CREDITS`, `PLAN_LIMIT`), שורת העבודה מתבטלת יחד איתה — לא נשארות עבודות "יתומות".

```sql
create or replace function public.create_job_and_reserve(
  p_workspace uuid, p_project uuid, p_version uuid, p_kind public.job_kind,
  p_idem text, p_options jsonb, p_credits int, p_requested_by uuid, p_orchestrator text,
  p_max_concurrent int, p_daily_cap int default null)
returns table (job_id uuid, reservation_id uuid, created boolean)
language plpgsql security definer set search_path = ''
as $$
#variable_conflict use_variable
declare v_billing uuid := public.billing_workspace_id(p_workspace); v_job uuid; v_res uuid; v_ws uuid; v_active int;
begin
  select j.id, j.reservation_id, j.workspace_id into v_job, v_res, v_ws from public.jobs j where j.idempotency_key = p_idem;
  if v_job is not null then
    if v_ws <> p_workspace then
      perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'idempotency_key_reused'));
    end if;
    return query select v_job, v_res, false;
    return;
  end if;

  perform public._lock_balance(v_billing);
  select j.id, j.reservation_id into v_job, v_res from public.jobs j where j.idempotency_key = p_idem;
  if v_job is not null then
    return query select v_job, v_res, false;
    return;
  end if;

  -- hook-variant jobs belong to their primary's generation and never count toward concurrency (any status);
  -- creating such a sibling (p_options ? 'afterJobId') is therefore never blocked by the limit either
  if not (coalesce(p_options, '{}'::jsonb) ? 'afterJobId') then
    select count(*) into v_active from public.jobs j
    where j.billing_workspace_id = v_billing and j.status in ('queued','running','waiting_external')
      and not (j.options ? 'afterJobId');
    if v_active >= p_max_concurrent then
      perform public.raise_app_error('CONCURRENCY_LIMIT', jsonb_build_object('max', p_max_concurrent, 'running', v_active));
    end if;
  end if;

  insert into public.jobs (workspace_id, billing_workspace_id, project_id, version_id, kind, idempotency_key,
                           orchestrator, credits_estimated, options, requested_by)
  values (p_workspace, v_billing, p_project, p_version, p_kind, p_idem, p_orchestrator, p_credits, coalesce(p_options, '{}'::jsonb), p_requested_by)
  returning id into v_job;

  if p_credits > 0 then
    v_res := public.reserve_credits(v_billing, p_credits, v_job, 'reserve:' || v_job::text, p_daily_cap, null);
  end if;
  update public.projects set latest_job_id = v_job where id = p_project;
  return query select v_job, v_res, true;
end $$;
```

### 10.5 קריאה לממשק ובדיקת עקביות

```sql
create or replace function public.get_credit_summary(p_ws uuid)
returns table (balance int, reserved int, plan_allowance int, expiring_30d int, next_reset_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
declare v_b uuid;
begin
  if not (public.can_access_workspace(p_ws) or public.is_platform_admin()) then
    perform public.raise_app_error('FORBIDDEN');
  end if;
  v_b := public.billing_workspace_id(p_ws);
  return query
    select coalesce(b.balance, 0),
           coalesce(b.reserved, 0),
           (select nullif(pl.monthly_credits, 0) from public.workspace_plan(v_b) pl),   -- null = no monthly allowance (free)
           coalesce((select sum(g.remaining) from public.credit_grants g
                     where g.workspace_id = v_b and g.remaining > 0
                       and g.expires_at > now() and g.expires_at <= now() + interval '30 days'), 0)::int,
           (select case when s.billing_cycle = 'annual' then least(s.next_grant_at, s.current_period_end)
                        else s.current_period_end end            -- next allowance: monthly renewal, or the annual plan's monthly grant
              from public.subscriptions s
             where s.workspace_id = v_b and s.status in ('active','past_due')
             limit 1)
    from public.workspaces w
    left join public.workspace_balances b on b.workspace_id = w.id
    where w.id = v_b;
end $$;

-- admin diagnostics + pgTAP: any row returned is a bug
create or replace function public.credit_invariant_violations()
returns table (workspace_id uuid, balance int, ledger_sum bigint, grants_sum bigint, reserved int, open_held bigint)
language sql stable security definer set search_path = ''
as $$
  select b.workspace_id, b.balance,
         (select coalesce(sum(l.delta), 0) from public.credit_ledger l where l.workspace_id = b.workspace_id),
         (select coalesce(sum(g.remaining), 0) from public.credit_grants g where g.workspace_id = b.workspace_id),
         b.reserved,
         (select coalesce(sum(r.amount - r.captured), 0) from public.credit_reservations r where r.workspace_id = b.workspace_id and r.status = 'open')
  from public.workspace_balances b
  where b.balance <> (select coalesce(sum(l.delta), 0) from public.credit_ledger l where l.workspace_id = b.workspace_id)
     or b.balance <> (select coalesce(sum(g.remaining), 0) from public.credit_grants g where g.workspace_id = b.workspace_id)
     or b.reserved <> (select coalesce(sum(r.amount - r.captured), 0) from public.credit_reservations r where r.workspace_id = b.workspace_id and r.status = 'open');
$$;

-- UsageChart (billing page): net credits consumed per category in a period; owner/admin of the billing workspace
create or replace function public.credit_usage_by_action(p_ws uuid, p_from timestamptz, p_to timestamptz)
returns table (category text, credits bigint)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
declare v_b uuid := public.billing_workspace_id(p_ws);
begin
  if not (public.has_role(v_b, array['owner','admin']::public.member_role[]) or public.is_platform_admin()) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('requiredRoles', array['owner','admin']));
  end if;
  return query
    select coalesce(r.action_key, 'job.' || j.kind::text, 'other') as category,
           sum(greatest(r.captured - least(r.refunded, r.captured), 0))::bigint as credits
    from public.credit_reservations r
    left join public.jobs j on j.id = r.job_id
    where r.workspace_id = v_b and r.created_at >= p_from and r.created_at < p_to
    group by 1
    having sum(greatest(r.captured - least(r.refunded, r.captured), 0)) > 0
    order by 2 desc;
end $$;
```

- **`plan_allowance`** (‏`planAllowance` ב-API) הוא `null` כשאין מכסה חודשית (התוכנית החינמית), ולא 0. ‏`lib/billing/credits.ts` (בעלים: חלק 06) מחשב ממנו את `videosLeft(balance, planId)` ואת `lowThreshold(summary, planId)`: בלי מכסה ← `perVideoCredits(planId)`; עם מכסה ← `max(perVideoCredits(planId), ceil(0.15 × planAllowance))`. אותה נוסחה משמשת את `CreditsMeter` (חלק 01; הטבעת מצוירת רק כש-`planAllowance != null`), את הבאנר בחלק 03 ואת `/api/cron/reminders` (§23).

### 10.6 טריגרים על היומן

```sql
create or replace function public.ledger_apply_balance()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_bal int; v_reserved int;
begin
  insert into public.workspace_balances (workspace_id) values (new.workspace_id) on conflict do nothing;
  select coalesce(sum(r.amount - r.captured), 0)::int into v_reserved
  from public.credit_reservations r where r.workspace_id = new.workspace_id and r.status = 'open';

  update public.workspace_balances b set
    balance          = b.balance + new.delta,
    reserved         = v_reserved,
    lifetime_granted = b.lifetime_granted + case
                         when new.kind in ('grant_trial','grant_plan','grant_rollover','purchase','promo') then new.delta
                         when new.kind = 'adjustment' and new.delta > 0 then new.delta else 0 end,
    lifetime_spent   = b.lifetime_spent + case when new.kind in ('reserve','release','refund') then -new.delta else 0 end,
    updated_at       = now()
  where b.workspace_id = new.workspace_id
  returning b.balance into v_bal;

  if v_bal <> new.balance_after then
    raise exception 'LEDGER_BALANCE_MISMATCH' using errcode = 'P0001',
      detail = jsonb_build_object('expected', new.balance_after, 'actual', v_bal, 'ledger_id', new.id)::text;
  end if;
  return null;
end $$;

create or replace function public.prevent_ledger_mutation()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  raise exception 'credit_ledger is append-only (% blocked)', tg_op using errcode = 'P0001';
end $$;

create trigger credit_ledger_apply_balance after insert on public.credit_ledger
  for each row execute function public.ledger_apply_balance();
create trigger credit_ledger_no_update_delete before update or delete on public.credit_ledger
  for each row execute function public.prevent_ledger_mutation();
create trigger credit_ledger_no_truncate before truncate on public.credit_ledger
  for each statement execute function public.prevent_ledger_mutation();

-- audit_logs: append-only for everyone, including the secret key; only purge_audit_logs() (§11.4) may delete old rows
create or replace function public.prevent_audit_mutation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' and coalesce(current_setting('app.allow_audit_purge', true), '') = 'on' then
    return old;                                   -- only purge_audit_logs() sets this (transaction-local)
  end if;
  raise exception 'AUDIT_LOG_IMMUTABLE' using errcode = 'P0001';
end $$;
create trigger audit_logs_no_update_delete before update or delete on public.audit_logs
  for each row execute function public.prevent_audit_mutation();
create trigger audit_logs_no_truncate before truncate on public.audit_logs
  for each statement execute function public.prevent_audit_mutation();
```

`lifetime_spent` כולל גם את מה שעדיין שמור; "נצרך בפועל" בממשק = `lifetime_spent - reserved`. כל פונקציה שמכניסה שורת יומן מחשבת `balance_after` מתוך השורה הנעולה, והטריגר מוודא שהחישוב תואם — אי-התאמה מפילה את הטרנזקציה כולה, כך שבאג במנוע לא יכול לייצר יתרה שגויה בשקט.

**`audit_logs` בלתי ניתן לשינוי.** הטריגר `prevent_audit_mutation` חוסם `update`, ‏`delete` ו-`truncate` גם מהמפתח הסודי (ה-`revoke … from service_role` ב-§12.2 נשאר כשכבה נוספת). החריג היחיד הוא `purge_audit_logs()` (§11.4), שמדליקה בתחילת הטרנזקציה שלה את ההגדרה המקומית `app.allow_audit_purge` ומוחקת רק שורות שעבר זמן השמירה שלהן. ‏`AUDIT_LOG_IMMUTABLE` ו-`LEDGER_BALANCE_MISMATCH` הן חריגות פנימיות (‏`P0001`) ולא קודי API; ‏`fromDbError` ממפה אותן ל-`INTERNAL_ERROR` (§18.2).

### 10.7 איך הצנרת משתמשת במנוע (חוזה לחלק 05 ולחלק 06)

| רגע | קריאה | מפתח |
|---|---|---|
| התחלת עבודה | `create_job_and_reserve(…)` | `jobs.idempotency_key` = כותרת `Idempotency-Key`; השמירה `reserve:{jobId}` |
| שלב הצליח | `capture_credits(resId, credits, …)` + עדכון `job_steps.credits` **לפני** ה-capture | `capture:{jobId}:{stepKey}` |
| סצנה שהודרדה אחרי שחויבה | `refund_credits(resId, credits, …, 'הקליפ לסצנה {n} הוחלף בתמונה בתנועה. הקרדיטים הוחזרו.')` | `refund:{jobId}:clip:{sceneId}` |
| שלב נכשל ולא חויב | לא קוראים לכלום — `settle_reservation` בסוף משחרר אותו | — |
| עבודה הצליחה / בוטלה | `settle_reservation(resId, …)` | `settle:{reservationId}` |
| עבודה נכשלה | `refund_reservation(resId, …, 'היצירה נכשלה. כל הקרדיטים הוחזרו.')` | `refund:{reservationId}` |
| פעולת LLM אינטראקטיבית | `begin_spend(ws, credits, actionKey, ref, …)` **לפני** הקריאה למודל ← שמירת התוצר ← `commit_spend(resId, key)` (capture ו-settle); בכל כשל `refund_reservation(resId, 'refund:' || resId, 'הפעולה נכשלה. הקרדיטים הוחזרו.')`; שמירה שנשארה פתוחה מעל 6 דקות מוחזרת ב-`sweep_orphaned_spends` (§23) | `spend:{scope}:{idempotencyKey}:{attempt}` (§18.7), ו-`…:capture` / `…:settle` |
| חידוש מנוי / חבילה | `grant_credits(…, 'plan_cycle', period_end + interval '1 month', …)` / `grant_credits(…, 'topup', null, …)` | `grant:plan:{subscriptionId}:{periodStartISO}` / `grant:pack:{paymentId}` |
| התאמה ידנית באדמין | `grant_credits(…, 'admin', …)` או `debit_credits(…)` | `grant:admin:{auditLogId}` / `debit:admin:{auditLogId}` |
| הסרת היתרה מדלי (החזר כספי, chargeback, כלי האדמין) | `revoke_grant_remaining(grantId, key, descriptionHe, actorId)` | `revoke:{refundRequestId}:{grantId}` / `revoke:chargeback:{paymentId}:{grantId}` / `revoke:admin:{auditLogId}` |
| תשלום, חידוש ושינוי תוכנית | `billing_apply_payment` / `billing_apply_renewal` / `billing_apply_plan_change` (§10.8) — הן קוראות ל-`grant_credits` בתוך הטרנזקציה שלהן | `grant:pack:{paymentId}` · `grant:plan:{subscriptionId}:{periodStartISO}` · `grant:plan_change:{paymentId}` |

### 10.8 פונקציות מנוע החיוב (המימוש העסקי: חלק 06)

שלוש פונקציות SQL אטומיות שמנוע החיוב (`lib/billing/engine.ts`, חלק 06) קורא להן עם הלקוח הסודי. כל אחת היא טרנזקציה אחת, `security definer` עם `search_path = ''`, ‏`execute` ל-`service_role` בלבד, ואידמפוטנטית לפי `payments.idempotency_key` ולפי מפתחות היומן — קריאה חוזרת (webhook כפול, cron שרץ פעמיים) מחזירה את אותה תוצאה בלי חיוב או הענקה נוספים. הלוגיקה המלאה כתובה בחלק 06 בסעיפים שמצוינים בכל שורה; כאן החתימות והחוזה.

```sql
-- 0007_functions.sql (part B) — SIGNATURES ONLY. Each body is
--   language plpgsql security definer set search_path = '' as $$ … $$
-- written by the part 06 implementer; the pgTAP cases of §25.2 and part 06 §4–§5 acceptance define the behavior.

-- checkout webhook: subscription_initial | topup | update_card (by checkout_sessions.kind) — part 06 §4.1 step 5
create or replace function public.billing_apply_payment(
  p_session uuid, p_provider text, p_txn text,
  p_amount_ils numeric,  -- decimal shekels, 2 dp: fromAgorot(ev.amountAg); never integer agorot
  p_vat_rate numeric,
  p_method jsonb,        -- {token_enc, brand, last4, exp_month, exp_year, holder_name} | null (Bit / no token)
  p_payload jsonb)
returns jsonb  -- {payment_id, subscription_id, credits_granted, status: 'succeeded'|'amount_mismatch'|'duplicate'}

-- successful renewal charge of a pending payments row — part 06 §4.2 step 4
create or replace function public.billing_apply_renewal(p_payment uuid, p_txn text, p_payload jsonb)
returns jsonb  -- {subscription_id, period_start, period_end, credits_granted}

-- plan change; p_payment / p_txn are NULL when nothing is charged (downgrade, scheduled change, zero proration) — part 06 §5.3
create or replace function public.billing_apply_plan_change(
  p_subscription uuid, p_payment uuid, p_txn text,
  p_quote jsonb,         -- quoteToDb(q): {charge_now_ils: "98.17", new_price_ils: "…", credits_granted_now, effective_at, new_cycle}
  p_actor uuid)
returns jsonb  -- {plan_id, cycle, credits_granted, demoted}

-- every billing_apply_* that grants a plan allowance first calls (same transaction, balance lock held):
--   perform public.cap_rollover(v_billing_ws, v_cap, v_grant_key);   -- §10.2; v_grant_key = the grant's idempotency key
```

**יחידות כסף בחוזה הזה:** כל `p_*_ils` וכל שדה `*_ils` ב-jsonb הם שקלים עשרוניים (‏`numeric(10,2)`, כולל מע״מ), כמו עמודות ה-DDL. קוד החיוב ב-TypeScript עובד ב-`Agorot` שלמים (‏`…Ag`) וממיר בגבול: `p_amount_ils` = ‏`fromAgorot(ev.amountAg)`; ‏`p_quote` = ‏`quoteToDb(q)`, שממיר את `chargeNowAg`/`newPriceAg` ל-`charge_now_ils`/`new_price_ils` עשרוניים (מחרוזות). לעולם לא מעבירים אובייקט TS גולמי ל-jsonb.

- **`billing_apply_payment`** — ‏`p_amount_ils` בשקלים עשרוניים (`fromAgorot(ev.amountAg)`). לפי `checkout_sessions.kind`: מאמתת שהסכום שהתקבל שווה ל-`amount_ils` של הסשן (אחרת שורת `payments` עם `failure_reason = 'amount_mismatch'`, בלי הענקה, ו-`status: 'amount_mismatch'`), מכניסה `payments` עם `idempotency_key = 'checkout:' || p_session` (קיים ← `status: 'duplicate'`), שומרת `payment_methods` כשיש `p_method` (הקודם מסומן `deleted_at`), יוצרת `subscriptions` (מנוי) או מעניקה את החבילה (`grant:pack:{paymentId}`), מעדכנת `workspaces.plan_id` ו-`has_paid = true`, ומסמנת את הסשן `completed`. לפני הענקת מכסה של מנוי: `cap_rollover` (§10.2).
- **`billing_apply_renewal`** — ‏`payments.status = 'succeeded'`, קידום התקופה לפי `anchor_at`, ‏`next_charge_at`, איפוס `retry_count` ו-`past_due_since`, הענקת המכסה (`grant:plan:{subscriptionId}:{periodStartISO}`, ולפניה `cap_rollover` עם המפתח הזה), ובמנוי שנתי `next_grant_at`.
- **`billing_apply_plan_change`** — ‏`p_quote` = ‏`quoteToDb(q)` עם `charge_now_ils`/`new_price_ils` עשרוניים. מעדכנת את התוכנית, המחזור והמחיר הנעול במנוי ובסביבה, מנקה את `scheduled_change`, מעניקה את ההפרש (`grant:plan_change:{paymentId}`, או `grant:plan:{subscriptionId}:{periodStartISO}` במעבר לשנתי "מעכשיו"), קוראת ל-`cap_rollover` לפני ההענקה, ובהורדת תוכנית קוראת ל-`enforce_plan_limits(workspace, p_actor)` (§9.5b) ומחזירה את `demoted`. הפרמטר `p_subscription` קיים כי לשינוי בלי חיוב אין שורת `payments`.

### קריטריוני קבלה
- [ ] `revoke_grant_remaining` פעמיים עם אותו מפתח: הקריאה השנייה מחזירה 0; היתרה יורדת בדיוק ב-`remaining` של הדלי, ושמירה פתוחה של עבודה רצה לא משתנה.
- [ ] `update audit_logs …` ו-`delete from audit_logs …` נכשלים ב-`AUDIT_LOG_IMMUTABLE` גם עם המפתח הסודי; ‏`purge_audit_logs()` מוחקת רק שורות שעבר זמן השמירה שלהן.
- [ ] `create_job_and_reserve` של עבודת אח (`options.afterJobId`) מצליחה גם כשמגבלת המקביליות מלאה, ואחריה עבודה רגילה עדיין נחסמת ב-`CONCURRENCY_LIMIT` עם אותו `running`.
- [ ] `billing_apply_payment` שנקראת פעמיים עם אותו סשן: שורת `payments` אחת, הענקה אחת, ובקריאה השנייה `status: 'duplicate'`.
- [ ] יתרה 100, ‏`reserve 60` ← יתרה 40, ‏`reserved` 60; ‏`capture 25` ← `reserved` 35; ‏`settle` ← יתרה 75, ‏`reserved` 0, שורת `release` של +35.
- [ ] `reserve` כפול עם אותו מפתח מחזיר את אותה שמירה ולא יוצר שורת יומן שנייה.
- [ ] `capture` של 80 על שמירה של 60 מחייב 60 בלבד (התיאור מסתיים ב-"60 קרדיטים").
- [ ] `refund_reservation` על שמירה פתוחה מחזיר את כל הסכום; על שמירה שסולקה — רק את מה שנצרך; קריאה שנייה מחזירה 0.
- [ ] `refund_credits` עם `refund:{jobId}:clip:{sceneId}` בלי `capture` מתאים לא עושה כלום.
- [ ] 50 קריאות `reserve_credits` של 10 במקביל על יתרה 100 — בדיוק 10 מצליחות, והיתרה 0 (בדיקת Vitest, §25.4).
- [ ] `update credit_ledger …` ו-`delete from credit_ledger …` נכשלים גם עם המפתח הסודי.
- [ ] `credit_invariant_violations()` מחזירה אפס שורות אחרי כל בדיקה ב-§25.
- [ ] דלי שפג באמצע עבודה: ההחזר נכנס לדלי חדש עם תוקף של 7 ימים, ו-`expire_credit_grants` לא נכשל על מפתח כפול.

---

## §11. חיפוש הוקים, אידמפוטנטיות, שומרים ותחזוקה — `0007_functions.sql` (חלק ג׳)

### 11.1 חיפוש הוקים (`search_hooks`) ופאסטים

- **נרמול:** השאילתה עוברת `normalize_he()` (ניקוד, ״/׳, מירכאות טיפוגרפיות, מקפים, אותיות לטיניות קטנות), ומושווית ל-`hooks.search_text` שעבר אותו נרמול. כך "נדל"ן" מוצא "נדל״ן", ו-"ג'ל" מוצא "ג׳ל".
- **התאמה:** תת-מחרוזת (`like`, עם בריחה של `%` ו-`_`), או דמיון מילים של trigram (`<%`, סף ברירת המחדל של `pg_trgm.word_similarity_threshold` = 0.6), או התאמה לשם הנישה או לשם סוג ההוק. שני הראשונים משתמשים באינדקס `hooks_search_trgm`.
- **דירוג:** `sort=new` ← לפי `created_at`; ‏`sort=most_generated` ← לפי `generations_count`; ברירת המחדל `popular` ← רלוונטיות (כשיש שאילתה), ואז מומלצים, ואז `hook_popularity.score`.
- **נישה מיוחדת:** `p_niche = 'universal'` מחזיר רק הוקים בלי נישה. הוקים של נישה לא פעילה (`is_active = false`) לא מוחזרים לעולם.
- **סוג:** `p_type` תואם גם לסוג המשני (`secondary_type_slug`).
- **שדות תצוגה:** כל שורה מחזירה גם `niche_short_name_he`, ‏`niche_icon` (שם רכיב lucide), ‏`why_it_works_he` (מ-`hook_types`), ‏`secondary_type_slug` ו-`season_name_he` (join ל-`seasons`), כך שכרטיס ההוק (`HookCardDTO`, §20.3) נבנה משורה אחת בלי שאילתות נוספות.
- **פאסטים:** `search_hooks_facets` מחזירה ספירות לכל ערך **בתוך תוצאות הסינון הנוכחי** (לא ספירה "דיסיונקטיבית"); הממשק מציג ערכים עם 0 כמושבתים.

```sql
-- 0007_functions.sql (part C)
create or replace function public._search_hooks_base(
  p_q text, p_niche text, p_type text, p_platform public.platform, p_goal public.hook_goal,
  p_gender public.hook_gender, p_season text, p_featured boolean, p_has_video boolean)
returns setof public.hooks
language sql stable security definer set search_path = ''
as $$
  select h.*
  from public.hooks h
  join public.hook_types t on t.slug = h.hook_type_slug
  left join public.niches n on n.slug = h.niche_slug
  where h.status = 'published'
    and (h.niche_slug is null or n.is_active)
    and (p_niche is null or h.niche_slug = p_niche or (p_niche = 'universal' and h.niche_slug is null))
    and (p_type is null or h.hook_type_slug = p_type or h.secondary_type_slug = p_type)
    and (p_platform is null or h.platforms @> array[p_platform])
    and (p_goal is null or h.goal = p_goal)
    and (p_gender is null or h.gender = p_gender)
    and (p_season is null or h.season_slug = p_season)
    and (p_featured is null or h.is_featured = p_featured)
    and (p_has_video is null or ((h.sample_video_path is not null) = p_has_video))
    and (p_q is null
         or h.search_text like '%' || public.escape_like(p_q) || '%'
         or p_q operator(extensions.<%) h.search_text
         or public.normalize_he(n.name_he) like '%' || public.escape_like(p_q) || '%'
         or public.normalize_he(t.name_he) like '%' || public.escape_like(p_q) || '%');
$$;

create or replace function public.search_hooks(
  p_q text default null, p_niche text default null, p_type text default null,
  p_platform public.platform default null, p_goal public.hook_goal default null,
  p_gender public.hook_gender default null, p_season text default null,
  p_featured boolean default null, p_sort text default 'popular',
  p_limit int default 24, p_offset int default 0, p_has_video boolean default null)
returns table (
  id text, niche_slug text, niche_name_he text, niche_short_name_he text, niche_icon text,
  hook_type_slug text, hook_type_name_he text, family_slug text, why_it_works_he text, secondary_type_slug text,
  text_he text, platforms public.platform[], goal public.hook_goal, gender public.hook_gender,
  visual_direction_he text, placeholders text[], season_slug text, season_name_he text, compliance_note_he text,
  is_featured boolean, sample_video_path text, copies_count int, generations_count int,
  popularity int, rank real, total_count bigint)
language sql stable security definer set search_path = ''
as $$
  with params as (
    select nullif(left(public.normalize_he(p_q), 80), '') as q,
           least(greatest(coalesce(p_limit, 24), 1), 100) as lim,
           greatest(coalesce(p_offset, 0), 0) as off,
           coalesce(nullif(p_sort, ''), 'popular') as srt
  ),
  base as (
    select b.*, n.name_he as n_name, n.short_name_he as n_short, n.icon as n_icon,
           t.name_he as t_name, t.family_slug as fam, t.why_it_works_he as t_why, s.name_he as s_name,
           coalesce(hp.score, 0) as pop,
           case when params.q is null then 0::real
                when b.search_text like '%' || public.escape_like(params.q) || '%' then 1::real
                else extensions.word_similarity(params.q, b.search_text) end as rnk
    from params,
         public._search_hooks_base(params.q, p_niche, p_type, p_platform, p_goal, p_gender, p_season, p_featured, p_has_video) b
    join public.hook_types t on t.slug = b.hook_type_slug
    left join public.niches n on n.slug = b.niche_slug
    left join public.seasons s on s.slug = b.season_slug
    left join public.hook_popularity hp on hp.hook_id = b.id
  )
  select base.id, base.niche_slug, base.n_name, base.n_short, base.n_icon,
         base.hook_type_slug, base.t_name, base.fam, base.t_why, base.secondary_type_slug,
         base.text_he, base.platforms, base.goal, base.gender, base.visual_direction_he, base.placeholders,
         base.season_slug, base.s_name, base.compliance_note_he, base.is_featured, base.sample_video_path,
         base.copies_count, base.generations_count, base.pop, base.rnk, count(*) over ()
  from base, params
  order by
    case params.srt when 'new' then extract(epoch from base.created_at)
                    when 'most_generated' then base.generations_count::double precision end desc nulls last,
    base.rnk desc, base.is_featured desc, base.pop desc, base.id
  limit (select lim from params) offset (select off from params);
$$;

create or replace function public.search_hooks_facets(
  p_q text default null, p_niche text default null, p_type text default null,
  p_platform public.platform default null, p_goal public.hook_goal default null,
  p_gender public.hook_gender default null, p_season text default null,
  p_featured boolean default null, p_has_video boolean default null)
returns table (facet text, value text, count bigint)
language sql stable security definer set search_path = ''
as $$
  with b as (
    select * from public._search_hooks_base(nullif(left(public.normalize_he(p_q), 80), ''),
                                             p_niche, p_type, p_platform, p_goal, p_gender, p_season, p_featured, p_has_video)
  )
            select 'niche'::text,    coalesce(b.niche_slug, 'universal'), count(*) from b group by 2
  union all select 'type',           b.hook_type_slug,                    count(*) from b group by 2
  union all select 'platform',       pl::text,                            count(*) from b, unnest(b.platforms) pl group by 2
  union all select 'goal',           b.goal::text,                        count(*) from b group by 2
  union all select 'gender',         b.gender::text,                      count(*) from b group by 2
  union all select 'season',         b.season_slug,                       count(*) from b where b.season_slug is not null group by 2
  union all select 'has_video',      (b.sample_video_path is not null)::text, count(*) from b group by 2;
$$;

create or replace function public.increment_hook_event(p_hook_id text, p_kind text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_kind in ('copy', 'share') then
    update public.hooks set copies_count = copies_count + 1 where id = p_hook_id and status = 'published';
  elsif p_kind = 'generate' then
    update public.hooks set generations_count = generations_count + 1 where id = p_hook_id and status = 'published';
  else
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('field', 'kind'));
  end if;
end $$;

-- next free canonical hook id for a niche / season / universal (admin CRUD and AI batches)
create or replace function public.next_hook_id(p_niche text, p_season text default null)
returns text
language sql stable security definer set search_path = ''
as $$
  with pfx as (
    select case when p_niche is not null then p_niche
                when p_season is not null then 'seasonal-' || p_season
                else 'universal' end as p
  )
  select pfx.p || '-' || lpad(n::text, greatest(2, length(n::text)), '0')     -- lpad truncates, so never pad below the length
  from (select pfx.p, coalesce(max((regexp_match(h.id, '-([0-9]{2,3})$'))[1]::int), 0) + 1 as n
        from pfx
        left join public.hooks h on h.id ~ ('^' || pfx.p || '-[0-9]{2,3}$')
        group by pfx.p) pfx;
$$;
```

### 11.2 אידמפוטנטיות של בקשות API

```sql
create or replace function public.claim_idempotency_key(p_ws uuid, p_scope text, p_key uuid, p_user uuid, p_hash text)
returns table (state text, attempt int, response_status int, response_body jsonb, resource_id text)
language plpgsql security definer set search_path = ''
as $$
#variable_conflict use_column
declare k public.api_idempotency_keys; v_rows int; v_attempt int;
begin
  insert into public.api_idempotency_keys (workspace_id, scope, key, user_id, request_hash)
  values (p_ws, p_scope, p_key, p_user, p_hash)
  on conflict (workspace_id, scope, key) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 1 then
    return query select 'new'::text, 1, null::int, null::jsonb, null::text;
    return;
  end if;

  select * into k from public.api_idempotency_keys i
  where i.workspace_id = p_ws and i.scope = p_scope and i.key = p_key
  for update;
  if k.request_hash <> p_hash then
    return query select 'mismatch'::text, k.attempt::int, null::int, null::jsonb, null::text;
  elsif k.status = 'completed' then
    return query select 'completed'::text, k.attempt::int, k.response_status::int, k.response_body, k.resource_id;
  elsif k.status = 'in_progress' and k.updated_at > now() - interval '6 minutes' then   -- maxDuration 300 s + 60 s (§18.7)
    return query select 'in_progress'::text, k.attempt::int, null::int, null::jsonb, null::text;
  else                                                              -- failed with 5xx, or a stale in_progress: run again
    update public.api_idempotency_keys i
       set status = 'in_progress', attempt = i.attempt + 1, updated_at = now(), expires_at = now() + interval '24 hours'
     where i.workspace_id = p_ws and i.scope = p_scope and i.key = p_key
    returning i.attempt into v_attempt;
    return query select 'new'::text, v_attempt, null::int, null::jsonb, null::text;
  end if;
end $$;

create or replace function public.complete_idempotency_key(
  p_ws uuid, p_scope text, p_key uuid, p_status text, p_response_status int, p_response_body jsonb, p_resource_id text)
returns void
language sql security definer set search_path = ''
as $$
  update public.api_idempotency_keys
     set status = p_status, response_status = p_response_status, response_body = p_response_body,
         resource_id = p_resource_id, updated_at = now()
   where workspace_id = p_ws and scope = p_scope and key = p_key;
$$;
```

### 11.3 שומרים (guards) על פרויקטים, גרסאות, פרופילים והפניות בין סביבות

```sql
create or replace function public.projects_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then return new; end if;          -- server (secret key) writes are trusted
  if new.workspace_id <> old.workspace_id or new.created_by is distinct from old.created_by then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'immutable_columns'));
  end if;
  if new.deleted_at is distinct from old.deleted_at
     and not public.has_role(old.workspace_id, array['owner','admin']::public.member_role[]) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('requiredRoles', array['owner','admin']));
  end if;
  if (new.stage, new.current_version_id, new.latest_job_id) is distinct from (old.stage, old.current_version_id, old.latest_job_id) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'server_managed_columns'));
  end if;
  return new;
end $$;
create trigger projects_guard before update on public.projects
  for each row execute function public.projects_guard();

-- a draft version (no job ever used it) may be rewritten by the server; once used, script/source are frozen.
-- created_by is NOT an identity column: prepare_user_deletion re-assigns it and `on delete set null` clears it (§9.6)
create or replace function public.project_versions_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (new.project_id, new.version) is distinct from (old.project_id, old.version) then
    raise exception 'project_versions identity columns are immutable' using errcode = 'P0001';
  end if;
  if (new.script, new.source) is distinct from (old.script, old.source)
     and exists (select 1 from public.jobs j where j.version_id = old.id) then
    raise exception 'version % is used by a job; fork a new version instead', old.id using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger project_versions_guard before update on public.project_versions
  for each row execute function public.project_versions_guard();

-- profiles: the WhatsApp sub-object of notification_prefs is written only by the verification routes / webhook (§21.3, §22.6)
create or replace function public.profiles_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then return new; end if;          -- server (secret key) writes are trusted
  if (new.notification_prefs -> 'whatsapp') is distinct from (old.notification_prefs -> 'whatsapp') then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'server_managed_columns'));
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.profiles_guard();

-- RLS checks the row a user writes, not the ids inside it. A user write may only point at rows of the SAME workspace,
-- otherwise the pipeline (secret key) could pull another tenant's brand kit, media or project into a render or a share page.
create or replace function public._same_ws(p_ws uuid, p_kind text, p_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_id is null or case p_kind
    when 'asset'          then exists (select 1 from public.assets a where a.id = p_id and a.workspace_id = p_ws)
    when 'brand_kit'      then exists (select 1 from public.brand_kits k where k.id = p_id and k.workspace_id = p_ws)
    when 'workspace_hook' then exists (select 1 from public.workspace_hooks h where h.id = p_id and h.workspace_id = p_ws)
    when 'project'        then exists (select 1 from public.projects p where p.id = p_id and p.workspace_id = p_ws)
    else false end;
$$;

create or replace function public.cross_ref_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_ok boolean;
begin
  if (select auth.uid()) is null then return new; end if;          -- server writes validate references in code
  case tg_table_name
    when 'projects' then
      v_ok := public._same_ws(new.workspace_id, 'brand_kit', new.brand_kit_id)
          and public._same_ws(new.workspace_id, 'workspace_hook', new.workspace_hook_id)
          and public._same_ws(new.workspace_id, 'project', new.variant_of_project_id)
          and (tg_op = 'UPDATE' or (new.current_version_id is null and new.latest_job_id is null));   -- server-managed
    when 'scenes' then
      select bool_and(public._same_ws(p.workspace_id, 'asset', x)) into v_ok
      from public.projects p, unnest(array[new.user_asset_id, new.keyframe_asset_id, new.clip_asset_id]) x
      where p.id = new.project_id;
    when 'workspaces' then
      v_ok := public._same_ws(new.id, 'brand_kit', new.default_brand_kit_id);
    when 'brand_kits' then
      v_ok := public._same_ws(new.workspace_id, 'asset', new.logo_asset_id)
          and public._same_ws(new.workspace_id, 'asset', new.logo_dark_asset_id);
  end case;
  if not coalesce(v_ok, false) then
    perform public.raise_app_error('FORBIDDEN', jsonb_build_object('reason', 'cross_workspace_reference'));
  end if;
  return new;
end $$;
create trigger projects_cross_ref   before insert or update on public.projects   for each row execute function public.cross_ref_guard();
create trigger scenes_cross_ref     before insert or update on public.scenes     for each row execute function public.cross_ref_guard();
create trigger workspaces_cross_ref before update           on public.workspaces for each row execute function public.cross_ref_guard();
create trigger brand_kits_cross_ref before insert or update on public.brand_kits for each row execute function public.cross_ref_guard();

-- a version is locked for edits (script and scenes) once any job used it, whatever its status;
-- edits after that fork a new version that re-uses unchanged scene assets.
-- Granted to authenticated (§12.6), so it checks access through version -> project -> workspace first.
create or replace function public.is_version_locked(p_version uuid)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not exists (
       select 1 from public.project_versions v
       join public.projects p on p.id = v.project_id
       where v.id = p_version
         and (public.can_access_workspace(p.workspace_id) or public.is_platform_admin())) then
    return null;
  end if;
  return exists (select 1 from public.jobs j where j.version_id = p_version);
end $$;

-- reorder / compact scene indexes atomically (unique (version_id, index) is not deferrable, index >= 0)
create or replace function public.reindex_scenes(p_version uuid, p_ids uuid[])
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.scenes s where s.version_id = p_version) <> coalesce(array_length(p_ids, 1), 0)
     or exists (select 1 from unnest(p_ids) i(id)
                where not exists (select 1 from public.scenes s where s.id = i.id and s.version_id = p_version)) then
    perform public.raise_app_error('INVALID_INPUT', jsonb_build_object('reason', 'scene_set_mismatch'));
  end if;
  update public.scenes set index = index + 1000 where version_id = p_version;           -- park above any final index
  update public.scenes s set index = (o.ord - 1)::smallint
    from unnest(p_ids) with ordinality as o(id, ord)
   where s.id = o.id and s.version_id = p_version;
end $$;
```

### 11.4 תחזוקה (מופעלות מ-pg_cron, §15)

```sql
create or replace function public.expire_share_links()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v int;
begin
  update public.share_links set revoked_at = expires_at
   where revoked_at is null and expires_at is not null and expires_at < now();
  get diagnostics v = row_count;
  return v;
end $$;

create or replace function public.mark_retention()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v1 int; v2 int;
begin
  -- free-plan renders (and their poster/captions) older than 90 days — only in workspaces that never paid
  -- (a pack or a past subscription exempts the workspace for as long as the account exists)
  update public.assets a
     set is_deleted = true,
         metadata = a.metadata || jsonb_build_object('purge_reason', 'free_plan_retention', 'purge_marked_at', now())
    from public.workspaces w
   where a.workspace_id = w.id
     and not a.is_deleted
     and a.kind in ('render','poster','captions_srt','captions_vtt','thumbnail')
     and a.created_at < now() - interval '90 days'
     and not w.has_paid
     and not (select bw.has_paid from public.workspaces bw where bw.id = public.billing_workspace_id(w.id))
     and (select p.id from public.workspace_plan(w.id) p) = 'free';
  get diagnostics v1 = row_count;

  -- every asset of projects soft-deleted more than 30 days ago
  update public.assets a
     set is_deleted = true,
         metadata = a.metadata || jsonb_build_object('purge_reason', 'project_deleted', 'purge_marked_at', now())
    from public.projects p
   where a.project_id = p.id and not a.is_deleted
     and p.deleted_at is not null and p.deleted_at < now() - interval '30 days';
  get diagnostics v2 = row_count;
  return v1 + v2;
end $$;

-- retention (part 06 §11.5); run monthly by pg_cron as postgres; NO execute grant to any API role (§12.6)
create or replace function public.purge_ai_generations()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v int;
begin
  delete from public.ai_generations where created_at < now() - interval '24 months';
  get diagnostics v = row_count;
  return v;
end $$;

create or replace function public.purge_support_data()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v int; n int := 0;
begin
  delete from public.contact_messages where created_at < now() - interval '24 months';  get diagnostics v = row_count; n := n + v;
  delete from public.abuse_reports    where created_at < now() - interval '24 months';  get diagnostics v = row_count; n := n + v;
  delete from public.email_messages   where created_at < now() - interval '24 months';  get diagnostics v = row_count; n := n + v;
  -- consents: kept 7 years after account closure / consent withdrawal (part 02 privacy §9, part 06 §11.5).
  -- Rows of existing users (user_id not null) are never purged.
  --  * closed account (user_id set null by deleteUser): 7 years after subject_closed_at (stamped by prepare_user_deletion)
  --  * no account, with email (newsletter): 7 years after the row stopped being current — the first later row of the same
  --    email+kind (withdrawal or re-consent), or the row's own created_at when it is itself a withdrawal (granted = false),
  --    or revoked_at; the current granted row is kept
  --  * anonymous cookie-banner row (no user, no email): 7 years after created_at (cannot be linked to a later choice)
  delete from public.consents c
   where c.user_id is null
     and not exists (select 1 from public.likeness_profiles lp where lp.consent_id = c.id)   -- FK restrict (v2 likeness)
     and case
           when c.subject_closed_at is not null then c.subject_closed_at < now() - interval '7 years'
           when c.email is null                 then c.created_at        < now() - interval '7 years'
           else coalesce((select min(w.created_at) from public.consents w
                           where w.user_id is null and w.email = c.email and w.kind = c.kind and w.created_at > c.created_at),
                         case when not c.granted then c.created_at end,
                         c.revoked_at) < now() - interval '7 years'
         end;
  get diagnostics v = row_count; n := n + v;
  delete from public.trial_claims     where created_at < now() - interval '5 years';    get diagnostics v = row_count; n := n + v;
  return n;
end $$;

create or replace function public.purge_audit_logs()
returns int
language plpgsql security definer set search_path = ''
as $$
declare v int;
begin
  perform set_config('app.allow_audit_purge', 'on', true);          -- transaction-local; prevent_audit_mutation lets DELETE through
  delete from public.audit_logs
   where created_at < now() - interval '36 months'
     and not (action like 'payment.%' or action like 'invoice.%' or action like 'refund_request.%'
              or action like 'subscription.%' or action like 'credits.%' or action like 'billing.%')
      or created_at < now() - interval '7 years';                   -- billing actions are kept 7 years
  get diagnostics v = row_count;
  perform set_config('app.allow_audit_purge', 'off', true);
  return v;
end $$;
```

```sql
-- GET /api/admin/ops/cron: the cron schema is not exposed through the Data API, so admins read failures through this function
create or replace function public.cron_recent_failures(p_limit int default 20)
returns table (jobname text, status text, return_message text, start_time timestamptz, end_time timestamptz)
language sql stable security definer set search_path = ''
as $$
  select j.jobname::text, d.status::text, left(d.return_message, 500), d.start_time, d.end_time
  from cron.job_run_details d
  join cron.job j on j.jobid = d.jobid
  where d.status = 'failed'
  order by d.start_time desc
  limit least(greatest(coalesce(p_limit, 20), 1), 100);
$$;
```

- **שמירת נתונים:** `purge_support_data` לא מוחקת אף פעם הסכמה של משתמש קיים. הסכמות של חשבון שנסגר נמחקות 7 שנים אחרי סגירת החשבון (`consents.subject_closed_at`, שנחתם ב-`prepare_user_deletion`); הסכמות בלי חשבון (מייל בלבד) — 7 שנים אחרי שבוטלו או הוחלפו בשורה מאוחרת יותר; שורות אנונימיות מבאנר העוגיות — 7 שנים מהרישום; שורת הסכמה שפרופיל דמות (`likeness_profiles.consent_id`, ‏`on delete restrict`) עדיין מצביע עליה לא נמחקת, כדי שהמשימה לא תיכשל. ‏`purge_audit_logs` שומרת 7 שנים את פעולות `payment.*`, ‏`invoice.*`, ‏`refund_request.*`, ‏`subscription.*`, ‏`credits.*` ו-`billing.*`, ו-36 חודשים את כל השאר.

### קריטריוני קבלה
- [ ] `select count(*) from search_hooks(p_q => 'נדל"ן')` שווה ל-`search_hooks(p_q => 'נדל״ן')` וגדול מ-0 על ה-seed.
- [ ] `search_hooks(p_q => '50%')` לא מתפרש כתבנית `like` (הסימן `%` עובר בריחה).
- [ ] `search_hooks(p_niche => 'local-politics')` מחזיר 0 שורות (נישה לא פעילה).
- [ ] `purge_support_data()`: הסכמה בת 10 שנים של חשבון שנסגר לפני 6 שנים (`subject_closed_at`) נשמרת, ושל חשבון שנסגר לפני 8 שנים נמחקת; הסכמה בת 9 שנים של משתמש קיים נשמרת; שורת ניוזלטר (מייל בלבד) שבוטלה לפני 8 שנים נמחקת, ושורה מאושרת בת 9 שנים שלא בוטלה נשמרת.
- [ ] `search_hooks_facets()` בלי סינון מחזיר בפאסט `niche` את כל הנישות הפעילות עם הוקים, ובפאסט `platform` את ששת הערכים שב-seed.
- [ ] `next_hook_id('dentists')` מחזיר את המספר הבא אחרי המקסימום הקיים (למשל `dentists-11` כשיש 10, ו-`dentists-100` אחרי `dentists-99` — בלי קיטוע ל-`dentists-10`).
- [ ] עורך שמנסה `update projects set deleted_at = now()` נכשל ב-`FORBIDDEN`; בעלים מצליח.
- [ ] `update project_versions set script = …` עם המפתח הסודי מצליח על גרסת טיוטה ונכשל על גרסה שיש לה עבודה; `update project_versions set caption_track = …` מצליח תמיד בצד השרת; למשתמש מחובר אין הרשאת `update` על הטבלה בכלל.
- [ ] `mark_retention()` מסמן רינדור בן 91 יום בסביבה חינמית שלא שילמה מעולם, ולא מסמן אותו רינדור בסביבה חינמית עם `has_paid = true` (קנתה חבילה או הייתה במנוי).
- [ ] אחרי `prepare_user_deletion` ו-`auth.admin.deleteUser`, ‏`project_versions_guard` לא חוסם את איפוס `created_by` (ה-FK ‏`on delete set null` מעדכן את השורה).
- [ ] `claim_idempotency_key` עם אותו מפתח וגוף שונה מחזיר `mismatch`; אחרי `complete … 'completed'` מחזיר `completed` עם התשובה השמורה; אחרי `'failed'` מחזיר `new` עם `attempt = 2`.

---

## §12. RLS, הרשאות טבלה והרשאות פונקציה — `0008_rls.sql`

### 12.1 עקרונות

1. **RLS פעיל על כל טבלה ב-`public`** (גם על טבלאות שרק השרת כותב אליהן). טבלה בלי מדיניות = סגורה לכל מי שאינו `service_role`.
2. כל מדיניות מוגדרת `to authenticated` או `to anon` — אף פעם `to public`.
3. `auth.uid()` תמיד בצורה `(select auth.uid())`, וסינון לפי סביבה תמיד בצורת הקבוצה (`workspace_id in (select public.accessible_workspace_ids())`) — מחושב פעם אחת לשאילתה.
4. כל עמודה שמדיניות מסננת לפיה מאונדקסת (`workspace_id`, `user_id`, `project_id`, `job_id` — ראו האינדקסים ב-§4–§8).
5. **הרשאות עמודה** מצמצמות עוד: גם מדיניות `update` שמתירה שורה לא מאפשרת לשנות עמודות רגישות (`is_platform_admin`, `plan_id`, `token_enc`…).
6. כתיבה לטבלאות כספיות, לעבודות, ליומנים, להגדרות, לקישורי שיתוף, לסצנות (`scenes`) ולהסכמות (`consents`) — **רק בצד השרת** (מפתח סודי), אחרי בדיקת הרשאה ב-Route Handler.
7. **הפניות בתוך שורה:** RLS בודק את השורה שנכתבת, לא את המזהים שבתוכה. הטריגר `cross_ref_guard` (§11.3) דוחה כתיבה של משתמש שמצביעה על ערכת מותג, נכס, הוק פרטי או פרויקט של סביבה אחרת, ו-`profiles_guard` מונע מהמשתמש לכתוב את פרטי ה-WhatsApp המאומתים בעצמו.
8. מנהל פלטפורמה **לא** עוקף RLS באפליקציה; פאנל האדמין עובד דרך `/api/admin/*` עם המפתח הסודי ו-`requirePlatformAdmin()`. מדיניות האדמין כאן מכסה רק את הקטלוג ואת טבלאות התפעול שנספח F מגדיר כך, וגם היא דורשת session ברמת `aal2` (`is_platform_admin()`, §9.2).

קיצורים בטבלה ובקוד: **member** = `workspace_id in (select public.accessible_workspace_ids())` · **editor+** = `workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}'))` · **owner/admin** = `… workspace_ids_with_role('{owner,admin}')`.

### 12.2 הפעלה, grants ו-timeouts

```sql
-- 0008_rls.sql
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', r.tablename);
  end loop;
end $$;

-- explicit table privileges (do not rely on project defaults)
revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.niche_categories, public.niches, public.hook_families, public.hook_types, public.seasons,
                public.hooks, public.templates, public.examples, public.music_tracks, public.plans,
                public.credit_packs, public.credit_costs, public.voices
  to anon;
grant select on public.hook_popularity to anon, authenticated;

-- server-only writes
revoke insert, update, delete on
  public.credit_grants, public.credit_reservations, public.credit_ledger, public.workspace_balances,
  public.jobs, public.job_steps, public.render_runs, public.ai_generations,
  public.subscriptions, public.payment_methods, public.payments, public.invoices, public.checkout_sessions, public.refund_requests,
  public.approvals, public.abuse_reports, public.audit_logs, public.webhook_events, public.trial_claims, public.email_suppressions,
  public.email_messages,
  public.model_registry, public.model_routes, public.app_settings, public.feature_flags,
  public.contact_messages, public.data_requests, public.likeness_profiles, public.api_idempotency_keys,
  public.scenes,                                    -- written only by the §19.6 routes and part 05 steps (secret client)
  public.consents                                   -- written only by recordConsent() (§21.4)
from authenticated;

-- column-level narrowing
revoke update on public.profiles from authenticated;
grant  update (full_name, avatar_url, phone, ui_gender_form, theme, reduce_motion, larger_captions,
               last_workspace_id, onboarding_completed_at, notification_prefs) on public.profiles to authenticated;
revoke update on public.workspaces from authenticated;
grant  update (name, niche_slug, default_brand_kit_id) on public.workspaces to authenticated;
revoke update on public.workspace_members from authenticated;                  -- role changes only via change_member_role (§9.5)
revoke update on public.assets from authenticated;
grant  update (is_deleted) on public.assets to authenticated;
revoke update on public.share_links from authenticated;
grant  update (revoked_at, allow_download, expires_at) on public.share_links to authenticated;
revoke update on public.project_versions from authenticated;                    -- versions change only server-side
revoke insert on public.project_versions from authenticated;                    -- the moderation cache and derived media are server-only
grant  insert (id, project_id, version, script, storyboard, caption_track, source, created_by) on public.project_versions to authenticated;
revoke insert on public.share_links from authenticated;                         -- created only by POST /api/share
revoke update on public.notifications from authenticated;
grant  update (read_at) on public.notifications to authenticated;
revoke select on public.payment_methods from authenticated;
grant  select (id, workspace_id, provider, brand, last4, exp_month, exp_year, holder_name, is_default, created_at, deleted_at)
  on public.payment_methods to authenticated;                    -- token_enc is never readable outside the server
revoke select on public.ai_generations from authenticated;      -- meta (debug excerpts) is server/admin only
grant  select (id, workspace_id, job_id, step_id, task, prompt_template_id, model_requested, model_served, fallback_used,
               openrouter_id, endpoint, unit_type, units, prompt_tokens, completion_tokens, cached_tokens, cost_usd,
               cost_estimated_usd, latency_ms, status, error_code, created_at) on public.ai_generations to authenticated;

-- append-only, even for the secret key
revoke update, delete, truncate on public.credit_ledger, public.audit_logs from service_role;

alter role authenticated set statement_timeout = '8s';
alter role anon          set statement_timeout = '3s';
```

### 12.3 מטריצת המדיניות

| טבלה | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | השורה שלי; מנהל פלטפורמה — הכול | — (טריגר) | השורה שלי (עמודות מותרות בלבד) | — |
| `workspaces` | member | — (`create_workspace`) | owner/admin (שם, נישה, ערכת ברירת מחדל) | — (מחיקה לוגית דרך API) |
| `workspace_members` | member | — (`accept_invite`) | — (RPC `change_member_role`, §9.5: owner/admin, לא שורת `owner`, לא ל-`owner`, בדיקת מושבים בנעילה) | owner/admin (לא `owner`); אני — את החברות שלי (לא `owner`) |
| `workspace_invites` | owner/admin | owner/admin | owner/admin | owner/admin |
| `business_profiles` · `brand_kits` · `pronunciation_entries` · `workspace_hooks` | member | editor+ | editor+ | editor+ |
| `hook_favorites` | שלי | שלי, בסביבה שאני חבר בה | — | שלי |
| `projects` | member | editor+ (`created_by` = אני) | editor+ (+ שומר §11.3) | owner/admin |
| `project_versions` | member (דרך הפרויקט) | editor+ (דרך הפרויקט; בלי `moderation` ו-`voiceover_asset_id`) | — | owner/admin |
| `scenes` | member (דרך הפרויקט) | שרת בלבד (§19.6) | שרת בלבד (§19.6) | שרת בלבד (§19.6) |
| `assets` | member | editor+, רק `logo`/`brand_image`/`upload_image`/`upload_video` במקור `upload` | editor+, רק `is_deleted` של אותם סוגים | — |
| `jobs` · `job_steps` · `render_runs` | member (דרך העבודה) | — | — | — |
| `ai_generations` (בלי `meta`) | owner/admin | — | — | — |
| `credit_grants` · `credit_reservations` · `credit_ledger` | owner/admin של סביבת החיוב | — | — | — |
| `workspace_balances` | member | — | — | — |
| `subscriptions` · `payment_methods` (בלי `token_enc`) · `payments` · `invoices` · `checkout_sessions` · `refund_requests` | owner/admin | — | — | — |
| `billing_profiles` | owner/admin | owner/admin | owner/admin | — |
| `share_links` | member | — (שרת, `POST /api/share`) | editor+ (ביטול, הורדה, תפוגה) | — |
| `approvals` | member (דרך הפרויקט) | — (שרת, מנתיב הטוקן) | — | — |
| `notifications` | שלי | — | שלי (`read_at`) | — |
| `consents` | שלי | שרת בלבד (§21.4) | — | — |
| קטלוג: `niche_categories` · `niches` (`is_active`) · `hook_families` · `hook_types` · `seasons` · `hooks` (`published`) · `templates` (`is_public`) · `examples` (`is_published`) · `music_tracks` (`is_active`) · `plans` (`is_public`) · `credit_packs` (`is_active`) · `credit_costs` · `voices` (`is_active`) | **anon + authenticated** לפי התנאי; מנהל פלטפורמה — הכול | מנהל פלטפורמה | מנהל פלטפורמה | מנהל פלטפורמה |
| `model_registry` · `model_routes` · `app_settings` · `feature_flags` · `audit_logs` · `webhook_events` · `trial_claims` · `contact_messages` · `data_requests` · `email_suppressions` · `email_messages` · `abuse_reports` | מנהל פלטפורמה | — (שרת) | — (שרת) | — (שרת) |
| `likeness_profiles` (v2) | member | — (שרת, אחרי זרימת הסכמה) | — | — |
| `api_idempotency_keys` | — | — | — | — |

**ה"לקוח" בסוכנות:** אין תפקיד `client` ב-`member_role`. סביבת `client` נגישה לבעלים, למנהלים ולעורכים של הסוכנות דרך `effective_role` (בעלים/מנהל ← `admin`, עורך ← `editor`), ואנשי הלקוח עצמם יכולים להיות מוזמנים אליה ישירות כ-`viewer` (צפייה והורדה בלבד). לקוח שלא נרשם כלל עובד רק דרך קישורי `client_approval` (`/approve/[token]`), בלי RLS ובלי חשבון — הגישה נבדקת בנתיב לפי גיבוב הטוקן (§20.6).

### 12.4 המדיניות (SQL מלא)

```sql
-- ===== A. identity & tenancy =====
create policy profiles_select_own   on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_select_admin on public.profiles for select to authenticated using ((select public.is_platform_admin()));
create policy profiles_update_own   on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy workspaces_select_member on public.workspaces for select to authenticated
  using (id in (select public.accessible_workspace_ids()));
create policy workspaces_update_admin on public.workspaces for update to authenticated
  using (id in (select public.workspace_ids_with_role('{owner,admin}')))
  with check (id in (select public.workspace_ids_with_role('{owner,admin}')));

create policy members_select on public.workspace_members for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
-- no update policy: role changes go through change_member_role (§9.5), which checks seats under the billing-row lock
create policy members_delete_admin on public.workspace_members for delete to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')) and role <> 'owner');
create policy members_delete_self on public.workspace_members for delete to authenticated
  using (user_id = (select auth.uid()) and role <> 'owner');

create policy invites_select_admin on public.workspace_invites for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy invites_insert_admin on public.workspace_invites for insert to authenticated
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')) and invited_by = (select auth.uid()));
create policy invites_update_admin on public.workspace_invites for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy invites_delete_admin on public.workspace_invites for delete to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));

-- business_profiles, brand_kits, pronunciation_entries, workspace_hooks: member read, editor+ write
create policy business_profiles_select on public.business_profiles for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy business_profiles_write on public.business_profiles for all to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy brand_kits_select on public.brand_kits for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy brand_kits_write on public.brand_kits for all to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy pronunciation_select on public.pronunciation_entries for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy pronunciation_insert on public.pronunciation_entries for insert to authenticated
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')) and created_by = (select auth.uid()));
create policy pronunciation_update on public.pronunciation_entries for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));
create policy pronunciation_delete on public.pronunciation_entries for delete to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy workspace_hooks_select on public.workspace_hooks for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy workspace_hooks_write on public.workspace_hooks for all to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy hook_favorites_select_own on public.hook_favorites for select to authenticated
  using (user_id = (select auth.uid()));
create policy hook_favorites_insert_own on public.hook_favorites for insert to authenticated
  with check (user_id = (select auth.uid()) and workspace_id in (select public.accessible_workspace_ids()));
create policy hook_favorites_delete_own on public.hook_favorites for delete to authenticated
  using (user_id = (select auth.uid()));

-- ===== B. public catalog =====
create policy niche_categories_read on public.niche_categories for select to anon, authenticated using (true);
create policy niches_read           on public.niches           for select to anon, authenticated using (is_active);
create policy hook_families_read    on public.hook_families    for select to anon, authenticated using (true);
create policy hook_types_read       on public.hook_types       for select to anon, authenticated using (true);
create policy seasons_read          on public.seasons          for select to anon, authenticated using (true);
create policy hooks_read            on public.hooks            for select to anon, authenticated using (status = 'published');
create policy templates_read        on public.templates        for select to anon, authenticated using (is_public);
create policy examples_read         on public.examples         for select to anon, authenticated using (is_published);
create policy music_tracks_read     on public.music_tracks     for select to anon, authenticated using (is_active);
create policy plans_read            on public.plans            for select to anon, authenticated using (is_public);
create policy credit_packs_read     on public.credit_packs     for select to anon, authenticated using (is_active);
create policy credit_costs_read     on public.credit_costs     for select to anon, authenticated using (true);
create policy voices_read           on public.voices           for select to anon, authenticated using (is_active);

do $$
declare t text;
begin
  foreach t in array array['niche_categories','niches','hook_families','hook_types','seasons','hooks','templates',
                           'examples','music_tracks','plans','credit_packs','credit_costs','voices'] loop
    execute format('create policy %I on public.%I for all to authenticated using ((select public.is_platform_admin())) with check ((select public.is_platform_admin()))',
                   t || '_admin_all', t);
  end loop;
end $$;

-- ===== C. projects & generation =====
create policy projects_select on public.projects for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy projects_insert on public.projects for insert to authenticated
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')) and created_by = (select auth.uid()));
create policy projects_update on public.projects for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));
create policy projects_delete on public.projects for delete to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));

-- outer columns are always table-qualified inside sub-selects (project_versions also has a project_id column)
create policy versions_select on public.project_versions for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_versions.project_id
                 and p.workspace_id in (select public.accessible_workspace_ids())));
create policy versions_insert on public.project_versions for insert to authenticated
  with check (created_by = (select auth.uid()) and exists (select 1 from public.projects p where p.id = project_versions.project_id
                 and p.workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}'))));
create policy versions_delete on public.project_versions for delete to authenticated
  using (exists (select 1 from public.projects p where p.id = project_versions.project_id
                 and p.workspace_id in (select public.workspace_ids_with_role('{owner,admin}'))));

create policy scenes_select on public.scenes for select to authenticated
  using (exists (select 1 from public.projects p where p.id = scenes.project_id
                 and p.workspace_id in (select public.accessible_workspace_ids())));
-- no insert/update/delete policies: scenes are written only by the §19.6 routes and part 05 steps with the secret
-- client, after is_version_locked() and edit moderation (and the table is in the server-only revoke list, §12.2)

create policy assets_select on public.assets for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy assets_insert_uploads on public.assets for insert to authenticated
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}'))
              and kind in ('logo','brand_image','upload_image','upload_video') and source = 'upload'
              and bucket in ('brand-assets','uploads') and created_by = (select auth.uid())
              and split_part(path, '/', 1) = workspace_id::text);          -- the object key always starts with the row's workspace
create policy assets_update_uploads on public.assets for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}'))
         and kind in ('logo','brand_image','upload_image','upload_video'))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy jobs_select on public.jobs for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
create policy job_steps_select on public.job_steps for select to authenticated
  using (exists (select 1 from public.jobs j where j.id = job_steps.job_id and j.workspace_id in (select public.accessible_workspace_ids())));
create policy render_runs_select on public.render_runs for select to authenticated
  using (exists (select 1 from public.jobs j where j.id = render_runs.job_id and j.workspace_id in (select public.accessible_workspace_ids())));
create policy ai_generations_select on public.ai_generations for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));

-- ===== D. credits & billing =====
create policy credit_grants_select       on public.credit_grants       for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy credit_reservations_select on public.credit_reservations for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy credit_ledger_select       on public.credit_ledger       for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy workspace_balances_select  on public.workspace_balances  for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));

create policy subscriptions_select     on public.subscriptions     for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy payment_methods_select   on public.payment_methods   for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy payments_select          on public.payments          for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy invoices_select          on public.invoices          for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy checkout_sessions_select on public.checkout_sessions for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy refund_requests_select   on public.refund_requests   for select to authenticated using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy billing_profiles_select on public.billing_profiles for select to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));
create policy billing_profiles_insert on public.billing_profiles for insert to authenticated
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')) and workspace_id = public.billing_workspace_id(workspace_id));
create policy billing_profiles_update on public.billing_profiles for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin}')));

-- ===== E. sharing & collaboration =====
create policy share_links_select on public.share_links for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));
-- no INSERT policy: share links are created only by POST /api/share (secret key) after the plan checks
-- (approval_links, white label) and the project/version/render checks of §20.5
create policy share_links_update on public.share_links for update to authenticated
  using (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')))
  with check (workspace_id in (select public.workspace_ids_with_role('{owner,admin,editor}')));

create policy approvals_select on public.approvals for select to authenticated
  using (exists (select 1 from public.projects p where p.id = approvals.project_id and p.workspace_id in (select public.accessible_workspace_ids())));

create policy notifications_select_own on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy notifications_update_own on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy consents_select_own on public.consents for select to authenticated using (user_id = (select auth.uid()));
-- no insert policy: consents are written only by recordConsent() with the secret client (§21.4)

create policy likeness_select on public.likeness_profiles for select to authenticated
  using (workspace_id in (select public.accessible_workspace_ids()));

-- ===== F. operations: platform admins read, server writes =====
do $$
declare t text;
begin
  foreach t in array array['model_registry','model_routes','app_settings','feature_flags','audit_logs','webhook_events',
                           'trial_claims','contact_messages','data_requests','email_suppressions','email_messages','abuse_reports'] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select public.is_platform_admin()))',
                   t || '_admin_read', t);
  end loop;
end $$;
-- api_idempotency_keys: RLS on, no policy at all (server only)
```

### 12.5 בדיקת `billing_profiles` ופרטי חיוב בסביבת לקוח

פרטי החיוב תמיד שייכים לסביבת החיוב (הסוכנות). מדיניות ההכנסה ל-`billing_profiles` דורשת `workspace_id = billing_workspace_id(workspace_id)`, כך שאי אפשר ליצור פרופיל חיוב לסביבת לקוח בטעות.

### 12.6 הרשאות `execute` לפונקציות

```sql
revoke execute on all functions in schema public from public, anon, authenticated;
grant  execute on all functions in schema public to service_role;

grant execute on function
  public.normalize_he(text),
  public.escape_like(text),
  public.health_ping(),
  public.search_hooks(text, text, text, public.platform, public.hook_goal, public.hook_gender, text, boolean, text, int, int, boolean),
  public.search_hooks_facets(text, text, text, public.platform, public.hook_goal, public.hook_gender, text, boolean, boolean)
to anon, authenticated;

grant execute on function
  public.is_platform_admin(), public.platform_admin_status(), public.effective_role(uuid), public.is_member(uuid),
  public.has_role(uuid, public.member_role[]), public.can_access_workspace(uuid), public.billing_workspace_id(uuid),
  public.accessible_workspace_ids(), public.workspace_ids_with_role(public.member_role[]), public.workspace_plan(uuid),
  public.create_workspace(text, public.workspace_type, uuid), public.accept_invite(text),
  public.transfer_workspace_ownership(uuid, uuid), public.list_workspace_members(uuid),
  public.change_member_role(uuid, uuid, public.member_role),
  public.get_credit_summary(uuid), public.credit_usage_by_action(uuid, timestamptz, timestamptz), public.is_version_locked(uuid)
to authenticated;
-- billing_workspace_id, workspace_plan and is_version_locked check access first and return null otherwise (§9.2, R39)
-- everything else stays service_role-only: credit engine (incl. begin_spend, commit_spend, sweep_orphaned_spends,
-- cap_rollover, revoke_grant_remaining), billing engine (billing_apply_*), effective_white_label, enforce_plan_limits,
-- idempotency, deletion, maintenance, internal _* (_billing_workspace_id, _workspace_plan, _lock_billing_workspace, …)

-- retention jobs run from pg_cron as postgres only; no API role (not even the secret key) may call them
revoke execute on function public.purge_ai_generations(), public.purge_support_data(), public.purge_audit_logs()
  from public, anon, authenticated, service_role;
```

`storage_ws` ו-`storage_upload_allowed` (0009) ו-`realtime_topic_allowed` (0010) מקבלות את ה-grant ל-`authenticated` בסוף המיגרציה שבה הן נוצרות (§13.3, §14.1), כי `grant` על פונקציה שעוד לא קיימת נכשל. ה-`revoke … on all functions` שלמעלה לא חל עליהן, כי הן נוצרות אחריו. הן נוצרות פרטיות בזכות ה-revoke הגלובלי ב-0001 (`alter default privileges revoke execute on functions from public`) וה-revoke המפורש בסוף כל מיגרציה; בדיקת ה-allow-list אוכפת (§25.2).

**כלל לכל מיגרציה מ-0009 והלאה:** כל מיגרציה שיוצרת פונקציה מסתיימת ב-`revoke execute on function public.<name>(<args>) from public, anon, authenticated;` לכל פונקציה שהיא יוצרת, **לפני** ה-`grant` שלה (אם יש). לא סומכים על ברירת המחדל לבד. בדיקת ה-pgTAP של §25.2 בוחרת כל פונקציה ב-`public` ש-`anon` או `authenticated` יכולים להריץ (`has_function_privilege`), והקבוצה חייבת להיות בדיוק רשימת ה-grants שבסעיף הזה ועוד `storage_ws`, `storage_upload_allowed`, `realtime_topic_allowed`, ועוד ארבע הפונקציות של ההרחבה (§12.7).

### 12.7 טבלאות ופונקציות של ההרחבה (`0013`, `0014`)

ה-SQL המלא של המדיניות כתוב בחלקים 07 ו-08, לפי הכללים של §2.3. זו מטריצת החוזה ש-§25.2 בודק:

| טבלה | SELECT ל-`authenticated` | כתיבה | `anon` |
|---|---|---|---|
| `meta_connections` (כל העמודות חוץ מ-`meta_user_id`) · `meta_assets` (חוץ מ-`min_budgets`) · `ad_campaigns` · `ad_variants` · `ad_insights_daily` (חוץ מ-`raw`) · `ad_change_log` · `ad_rules` · `lead_forms` · `social_posts` · `social_post_metrics` (לפי הסביבה של הפוסט) | חבר בסביבה | שרת בלבד | — |
| `leads` | חבר בסביבה, כולל צופים (הצוות של העסק) | שרת בלבד (`PATCH` ו-`DELETE /api/leads/[id]`, §21b) | — |
| `managed_spend_monthly` | אין grant ישיר; בעלים או מנהל של סביבת החיוב קוראים דרך `meta_spend_summary` | שרת בלבד | — |
| `meta_tokens` · `meta_data_deletion_requests` | **אין שום grant** | שרת בלבד | — |
| `landing_pages` | חבר בסביבה | שרת בלבד (נתיבי דף העסק, §21b) | רק דרך `landing_page_public(p_slug)` |
| `ad_health_reports` · `content_plans` · `content_plan_items` | חבר בסביבה | שרת בלבד | — |
| `trend_templates` | כמו `anon`; כל השאר דרך `/api/admin/*` בלקוח הסודי | שרת בלבד (אדמין) | `status = 'published'`, או `status = 'retired'` עם `published_at` (כדי ש-`/trends/[slug]` של טרנד שפרש יישאר זמין, חלק 02 §15, חלק 08 §19), ב-grant עמודות בלי `source_reference_id`, `do_not_copy`, `created_by`, `updated_by` |
| `trend_references` · `trend_analyses` | מנהל פלטפורמה בלבד (`aal2`) | שרת בלבד | — |
| `trend_template_uses` · `guided_shoots` | חבר בסביבה | שרת בלבד | — |
| `trend_template_stats_daily` | אין grant ישיר; רק דרך `trend_template_benchmark` | pg_cron | — |
| `workspaces.benchmarks_opt_out` (עמודה חדשה) | כמו שאר `workspaces` | grant עמודה ל-`update`, תחת מדיניות ה-update הקיימת של `workspaces` (בעלים או מנהל) | — |

| פונקציה | `anon` | `authenticated` | הערה |
|---|---|---|---|
| `landing_page_public(text)` | ✓ | ✓ | מחזירה רק דף `published`, בלי `workspace_id` ובלי `brand_kit_id` |
| `meta_spend_summary(uuid)` | — | ✓ | בדיקת R39; שורות רק לבעלים או למנהל של סביבת החיוב |
| `trend_feed(uuid, text, int, int)` | — | ✓ | בדיקת R39; גם `service_role` (grant מפורש), כי `plan.month.v1` רץ בתהליך (חלק 08 §19) |
| `trend_template_benchmark(uuid, text)` | — | ✓ | שורות רק כש-`cross_customer_benchmarks.enabled` ו-`businesses_count >= k_min` |
| `_managed_spend_cap_ils(uuid)` · `refresh_managed_spend(date)` · `ad_budget_changes_last_hour(uuid)` · `purge_meta_data(uuid, text)` · `refresh_trend_template_stats(date)` | — | — | `service_role` בלבד (grant מפורש) |
| `purge_leads()` | — | — | רצה רק מ-pg_cron: נשללת גם מ-`service_role`, כמו פונקציות ה-`purge_*` של §12.6 |
| פונקציות הטריגר של `0013`/`0014` (שידורי Realtime `broadcast_meta_change`, השומרים `meta_same_workspace_guard`, `projects_trend_guard` ו-`trend_same_workspace_guard`, `updated_at`) | — | — | בלי grant |

### קריטריוני קבלה
- [ ] `select tablename from pg_tables where schemaname = 'public' and not rowsecurity` מחזיר אפס שורות.
- [ ] `select * from pg_policies where schemaname = 'public' and 'public' = any (roles)` מחזיר אפס שורות.
- [ ] `select has_function_privilege('anon', 'public.reserve_credits(uuid,int,uuid,text,int,text)', 'execute')` = `false`; אותו דבר ל-`authenticated`; ‏`service_role` = `true`.
- [ ] משתמש מחובר לא יכול לקרוא `payment_methods.token_enc` (שגיאת הרשאה על העמודה), ולא לעדכן `profiles.is_platform_admin` (שגיאת הרשאה).
- [ ] בעלים שקורא `select meta from ai_generations` מקבל שגיאת הרשאה על העמודה; ‏`select id, cost_usd …` עובד.
- [ ] `has_function_privilege('service_role', 'public.purge_audit_logs()', 'execute')` = `false`; ‏`has_function_privilege('anon', 'public.health_ping()', 'execute')` = `true`.
- [ ] אחרי `0014`: `has_table_privilege('authenticated', 'public.meta_tokens', 'select')` = `false` (וכך גם ל-`anon` ול-`meta_data_deletion_requests`); לאף טבלה של `0013`/`0014` אין `insert`, `update` או `delete` ל-`authenticated`; `has_function_privilege('anon', 'public.landing_page_public(text)', 'execute')` = `true`; `has_function_privilege('service_role', 'public.purge_leads()', 'execute')` = `false`.
- [ ] כל מקרי הבדיקה ב-§25.2 עוברים.

---

## §13. אחסון — `0009_storage.sql`

### 13.1 Buckets

| Bucket | ציבורי | מגבלת קובץ (bucket) | MIME מותרים | כותבים | נתיב |
|---|---|---|---|---|---|
| `brand-assets` | לא | 20MB | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` | עורך+ (כתובת העלאה חתומה) | `{workspace_id}/brand/{kit_id}/{asset_id}.{ext}` |
| `uploads` | לא | 500MB | `video/mp4`, `video/quicktime`, `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `image/heif`; ומ-`0014` גם `video/webm` (צילום במצלמה בדפדפן, ש-`guidedAutocut` ממיר ל-MP4 ב-H.264) | עורך+ (חתומה; TUS מעל 6MB) | `{workspace_id}/uploads/{asset_id}.{ext}` |
| `generated` | לא | 250MB | `image/png`, `image/jpeg`, `image/webp`, `video/mp4`, `audio/mpeg`, `application/json` | שרת בלבד | `{workspace_id}/{project_id}/keyframes/{scene_id}-{attempt}.png` · `/clips/{scene_id}-{attempt}.mp4` · `/voice/v{version}.mp3` · `/music/{asset_id}.mp3` · `/captions/v{version}.json`; ותצוגות קול: `{workspace_id}/voice-previews/{sha256}.mp3`; ובדיקות מודלים מהאדמין: `_admin-tests/{YYYY-MM-DD}/{uuid}.{ext}` (בלי סביבה, ראו מתחת לטבלה) |
| `renders` | לא | 1GB | `video/mp4`, `image/jpeg`, `application/x-subrip`, `text/vtt` | שרת בלבד | `{workspace_id}/{project_id}/{job_id}/{9x16\|1x1\|16x9}.mp4` · `poster.jpg` · `captions.srt` · `captions.vtt` |
| `public-media` | **כן** | 100MB | `video/mp4`, `image/avif`, `image/webp`, `image/png`, `image/jpeg`, `audio/mpeg`, `text/vtt` | אדמין/שרת | `examples/{id}.mp4` · `hooks/{hook_id}.mp4` · `hooks/{hook_id}.jpg` (פוסטר: הפריים ב-1.0 שניות, נכתב עם העלאת סרטון הדוגמה באדמין) · `niches/{slug}/cover.avif` · `music-library/{mood}/{id}.mp3` · `og/{type}/{slug}.png` · `voices/{voice_id}.mp3` · `sfx/{id}.mp3` · `tests/keyframe-9x16.png` · `demo/wall/{n}-{hook_id}.{mp4\|avif\|vtt}` · `demo/examples/{id}-{9x16\|1x1\|16x9}.mp4`, `{id}-poster.jpg`, `{id}.vtt`, `{id}-loop.mp4` · מ-M8: `trends/{slug}/{niche_slug}-{n}.{mp4\|jpg\|vtt}` (רינדורי ההדגמה שלנו לתבניות טרנד, חלק 08) · מ-M10: `landing/{landing_page_id}/hero.{mp4\|jpg\|vtt}` (סרטון הפתיחה של דף עסק שפורסם, למטה) |
| `exports` | לא | 2GB | `application/zip` | שרת בלבד | `{user_id}/{request_id}.zip` (נמחק אחרי 7 ימים) |
| `invoices` | לא | 10MB | `application/pdf` | שרת בלבד | `{workspace_id}/{invoice_id}.pdf` — **אין** מדיניות קריאה; רק `GET /api/billing/invoices/[id]` (בעלים/מנהל) מנפיק כתובת חתומה |
| `trend-refs` (מ-`0014`, ה-SQL בחלק 08) | לא | 200MB | `video/mp4`, `video/quicktime`, `video/webm`, `image/jpeg` | שרת בלבד (העלאה חתומה שמונפקת רק מ-`/api/admin/*`) | `{reference_id}/source.{ext}` · `{reference_id}/hook.mp4` · `{reference_id}/frames/{t_ms}.jpg` — **אין** מדיניות ל-`authenticated`; מסכי האדמין מקבלים כתובות חתומות ל-10 דקות. הקבצים נמחקים אחרי `retention_until` (§23, `cleanup` סעיף 9) |

ה-bucket `invoices` נוסף על אלה שבנספח F: חשבוניות שייכות לבעלים ולמנהלים בלבד, ואילו `generated`/`renders` קריאים לכל חבר בסביבה. כתובת חתומה ל-5 דקות מונפקת רק דרך `GET /api/billing/invoices/[id]`.

**פלט של "בדיקה" מהאדמין** (`POST /api/admin/models/test`, §24.1; חלק 05 §6.4): קובצי המדיה נשמרים ב-`generated` בנתיב `_admin-tests/{YYYY-MM-DD}/{uuid}.{ext}` (תאריך UTC; ‏`ext` ∈ `png`/`jpg`/`webp`/`mp4`/`mp3`, לפי ה-MIME המותרים של ה-bucket), נכתבים בלקוח הסודי ולא נרשמים ב-`assets`. הקטע הראשון אינו uuid, ולכן `storage_ws(name)` מחזירה NULL ומדיניות `"members read workspace media"` לא מתאימה לאף משתמש: הגישה היחידה היא הכתובת החתומה ל-10 דקות שהנתיב מחזיר. ‏`/api/cron/cleanup` (§23, סעיף 8) מוחק כל תיקייה `_admin-tests/{date}` שעברו עליה 7 ימים.

**קבצים סטטיים ב-`public-media`** (מועלים על ידי `scripts/upload-static-media.ts` מ-`supabase/seed/media/`, שנמצא ב-git עם רישיון לכל קובץ ב-`supabase/seed/media/LICENSES.md` — CC0 או הפקה עצמית):
- `sfx/{id}.mp3` — שמונה אפקטים, `id ∈ whoosh, impact, pop, sizzle, click, riser, cash, camera_shutter` (ערכי `scenes.sfx` חוץ מ-`none`).
- `tests/keyframe-9x16.png` — קלט קבוע ל-`POST /api/admin/models/test` (§24.1).
- מדיית הדגמה לאתר השיווק: `demo/wall/{n}-{hook_id}.{mp4|avif|vtt}` (קיר הסרטונים, 18 אריחים) ו-`demo/examples/…` (חמש הדוגמאות של נספח D), שמועלים ב-`pnpm demo:render --upload`. הקובץ היחיד בריפו הוא `public/media/demo/logo-demo.svg`.

**תוספות האחסון של ההרחבה:**
- **אין bucket חדש ל-Meta.** סרטונים מגיעים ל-Meta בכתובת חתומה ל-`renders` עם תוקף של שעתיים לפחות (או בהעלאה ניתנת לחידוש), והתמונה הממוזערת היא נכס ה-`poster` הקיים (הפריים ב-1.2 שניות). כתובת כזו לא נשמרת בשום טבלה ולא נכתבת ללוג.
- **`trend-refs`** ו-`video/webm` ב-`uploads` נוצרים ב-`0014` (`insert … on conflict (id) do update` כמו ב-`0009`, ועדכון של `allowed_mime_types` ל-`uploads`); ה-SQL בחלק 08.
- **רינדורי הדגמה של טרנדים** נוצרים בסביבת הסטודיו `ws-trends-studio` (§16.3, `--studio`), וה-finalize של `POST /api/admin/trends/templates/[id]/demo-render` מעתיק אותם ל-`public-media/trends/{slug}/`. אלה תמיד הרינדורים שלנו, לעולם לא סרטון הייחוס.
- **דף העסק** (`/b/[slug]`) הוא דף ISR ציבורי, ולכן הוא לא יכול להשתמש בכתובת חתומה שפגה. בפרסום (`POST /api/landing-pages/[id]/publish`, §21b) השרת מעתיק את הרינדור שנבחר, את הפוסטר ואת קובץ הכתוביות ל-`public-media/landing/{landing_page_id}/hero.{mp4|jpg|vtt}`. בביטול פרסום, במחיקת הדף ובמחיקת החשבון (§9.6) התיקייה נמחקת. רינדור מעל מגבלת ה-bucket (100MB) לא מועתק, והדף מוצג עם הפוסטר בלבד.

### 13.2 מגבלות לפי סוג נכס (נאכפות בשרת, מעל מגבלת ה-bucket)

| `asset_kind` | Bucket | MIME | מקסימום | בדיקות ב-`/api/uploads/complete` |
|---|---|---|---|---|
| `logo` | `brand-assets` | png · jpeg · webp · svg | 5MB | רסטר: צלע קצרה ≥ 256px; SVG: מנוקה בצד השרת (הסרת `<script>`, `on*`, `foreignObject`, קישורים חיצוניים) ונשמר מחדש; מוצג תמיד ב-`<img>` |
| `brand_image` | `brand-assets` | png · jpeg · webp | 20MB | צלע קצרה ≥ 512px |
| `upload_image` | `uploads` | jpeg · png · webp · heic · heif | 25MB | צלע קצרה ≥ 720px; HEIC/HEIF מומר ל-JPEG (איכות 90) ונשמר במקום המקור [M0-verify ספריית ההמרה ב-Node] |
| `upload_video` | `uploads` | mp4 · quicktime · webm (מ-`0014`) | 500MB | עד 10 דקות, עד 3840px, קודק H.264/HEVC (וב-webm גם VP8/VP9, שמומר ל-H.264 לפני כל שימוש), נבדק עם `@remotion/media-parser`; נשמרים `width`, `height`, `duration_ms` |

הבדיקה לא סומכת על ה-`mime` שהדפדפן הצהיר: היא קוראת את 4KB הראשונים (Range request) ומזהה לפי "magic bytes". אי-התאמה ← מחיקת האובייקט, `metadata.upload_state = 'rejected'`, ותשובת `INVALID_INPUT` עם `details.reason`.

### 13.3 SQL

```sql
-- 0009_storage.sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('brand-assets', 'brand-assets', false, 20971520,   array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('uploads',      'uploads',      false, 524288000,  array['video/mp4','video/quicktime','image/jpeg','image/png','image/webp','image/heic','image/heif']),
  ('generated',    'generated',    false, 262144000,  array['image/png','image/jpeg','image/webp','video/mp4','audio/mpeg','application/json']),
  ('renders',      'renders',      false, 1073741824, array['video/mp4','image/jpeg','application/x-subrip','text/vtt']),
  ('public-media', 'public-media', true,  104857600,  array['video/mp4','image/avif','image/webp','image/png','image/jpeg','audio/mpeg','text/vtt']),
  ('exports',      'exports',      false, 2147483648, array['application/zip']),
  ('invoices',     'invoices',     false, 10485760,   array['application/pdf'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- first path segment as a workspace uuid, or null (safe replacement for (storage.foldername(name))[1]::uuid)
create or replace function public.storage_ws(p_name text)
returns uuid
language sql immutable security definer set search_path = ''
as $$
  select case when split_part(p_name, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
              then split_part(p_name, '/', 1)::uuid end;
$$;

-- an upload is allowed only to a path the API registered (assets row, pending, same user, < 2 h old)
create or replace function public.storage_upload_allowed(p_bucket text, p_name text)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare v_ws uuid := public.storage_ws(p_name);
begin
  if v_ws is null then return false; end if;
  if not ((p_bucket = 'brand-assets' and split_part(p_name, '/', 2) = 'brand')
       or (p_bucket = 'uploads'      and split_part(p_name, '/', 2) = 'uploads')) then
    return false;
  end if;
  if not public.has_role(v_ws, array['owner','admin','editor']::public.member_role[]) then return false; end if;
  return exists (
    select 1 from public.assets a
    where a.bucket = p_bucket and a.path = p_name and a.workspace_id = v_ws
      and a.created_by = (select auth.uid())
      and a.metadata->>'upload_state' = 'pending'
      and a.created_at > now() - interval '2 hours');
end $$;

-- per-migration rule (§12.6): explicit revoke first, then only the grants the storage policies need
revoke execute on function public.storage_ws(text), public.storage_upload_allowed(text, text) from public, anon, authenticated;
grant execute on function public.storage_ws(text), public.storage_upload_allowed(text, text) to authenticated;

create policy "members read workspace media" on storage.objects for select to authenticated
  using (bucket_id in ('brand-assets','uploads','generated','renders')
         and public.storage_ws(name) in (select public.accessible_workspace_ids()));

create policy "users read own exports" on storage.objects for select to authenticated
  using (bucket_id = 'exports' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "editors upload registered media" on storage.objects for insert to authenticated
  with check (bucket_id in ('brand-assets','uploads') and public.storage_upload_allowed(bucket_id, name));

-- no update/delete policies: replacing or removing objects is done by the server (secret key) together with the assets row
```

### 13.4 עזרי TypeScript

```ts
// lib/storage/paths.ts
import type { Enums } from "@/lib/supabase/enums";
type AR = Enums<"aspect_ratio">;
export const BUCKETS = {
  brandAssets: "brand-assets", uploads: "uploads", generated: "generated", renders: "renders",
  publicMedia: "public-media", exports: "exports", invoices: "invoices",
} as const;
export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];
export const aspectSlug = (a: AR) => a.replace(":", "x") as "9x16" | "1x1" | "16x9";

export const paths = {
  brandAsset:   (ws: string, kitId: string, assetId: string, ext: string) => `${ws}/brand/${kitId}/${assetId}.${ext}`,
  upload:       (ws: string, assetId: string, ext: string) => `${ws}/uploads/${assetId}.${ext}`,
  keyframe:     (ws: string, projectId: string, sceneId: string, attempt: number) => `${ws}/${projectId}/keyframes/${sceneId}-${attempt}.png`,
  clip:         (ws: string, projectId: string, sceneId: string, attempt: number) => `${ws}/${projectId}/clips/${sceneId}-${attempt}.mp4`,
  voice:        (ws: string, projectId: string, version: number) => `${ws}/${projectId}/voice/v${version}.mp3`,
  music:        (ws: string, projectId: string, assetId: string) => `${ws}/${projectId}/music/${assetId}.mp3`,
  captionsJson: (ws: string, projectId: string, version: number) => `${ws}/${projectId}/captions/v${version}.json`,
  voicePreview: (ws: string, sha256: string) => `${ws}/voice-previews/${sha256}.mp3`,
  render:       (ws: string, projectId: string, jobId: string, a: AR) => `${ws}/${projectId}/${jobId}/${aspectSlug(a)}.mp4`,
  poster:       (ws: string, projectId: string, jobId: string) => `${ws}/${projectId}/${jobId}/poster.jpg`,
  srt:          (ws: string, projectId: string, jobId: string) => `${ws}/${projectId}/${jobId}/captions.srt`,
  vtt:          (ws: string, projectId: string, jobId: string) => `${ws}/${projectId}/${jobId}/captions.vtt`,
  exportZip:    (userId: string, requestId: string) => `${userId}/${requestId}.zip`,
  invoicePdf:   (ws: string, invoiceId: string) => `${ws}/${invoiceId}.pdf`,
  pub: {
    example:  (id: string) => `examples/${id}.mp4`,
    hook:     (hookId: string) => `hooks/${hookId}.mp4`,
    nicheCover: (slug: string) => `niches/${slug}/cover.avif`,
    music:    (mood: string, id: string) => `music-library/${mood}/${id}.mp3`,
    og:       (type: string, slug: string) => `og/${type}/${slug}.png`,
    voice:    (voiceId: string) => `voices/${voiceId}.mp3`,
    sfx:      (id: string) => `sfx/${id}.mp3`,
    testKeyframe: () => "tests/keyframe-9x16.png",
    demoWall: (n: number, hookId: string, ext: "mp4" | "avif" | "vtt") => `demo/wall/${n}-${hookId}.${ext}`,
    demoExample: (file: string) => `demo/examples/${file}`,
  },
} as const;
```

```ts
// lib/storage/signed.ts  (server-only)
export const SIGNED_TTL = {
  view: 60 * 60,            // app player, thumbnails, share & approval pages
  download: 60 * 60,        // ?download=1 -> Content-Disposition attachment
  pipeline: 6 * 60 * 60,    // OpenRouter frame_images + renderer inputs (longer than any render)
  invoice: 5 * 60,          // 302 from /api/billing/invoices/[id]
} as const;
export async function signedUrl(bucket: Bucket, path: string, ttl: number, opts?: { download?: string }): Promise<{ url: string; expiresAt: string }>;
export function publicMediaUrl(path: string): string; // `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-media/${path}`
```

**כללי כתובות חתומות:**
- כתובת חתומה נוצרת רק בשרת, אחרי שבדקנו שהמשתמש רשאי לקרוא את שורת `assets` (קריאה דרך הלקוח של המשתמש — אם ה-RLS מחזיר את השורה, מותר להנפיק). ההנפקה עצמה עם הלקוח הסודי.
- **לעולם לא שולחים כתובת חתומה במייל** (היא פגה). מיילים מקשרים לדף באפליקציה שמנפיק כתובת טרייה.
- הורדה: `download` = שם קובץ ASCII בטוח: `{{BRAND_NAME_EN}}-{projectId8}-{9x16}.mp4`. [M0-verify] אם Supabase מקודד נכון `filename*=UTF-8''…` לשמות עבריים, מעבירים לשם עברי מהכותרת.
- כתובות OpenRouter אף פעם לא מגיעות לדפדפן או ל-renderer: הקליפים מאוחסנים מחדש ב-`generated` (חלק 05).
- כתובות העלאה חתומות (`createSignedUploadUrl`) תקפות שעתיים (ערך קבוע של Supabase); העלאת TUS משתמשת ב-JWT של המשתמש ובמדיניות ההכנסה שלמעלה [M0-verify: ש-TUS עם `x-upsert: false` דורש רק `insert`].

### קריטריוני קבלה
- [ ] חבר בסביבה A מקבל 400/403 בניסיון `createSignedUrl` ישיר מהדפדפן לנתיב של סביבה B; עם נתיב של A — מצליח.
- [ ] העלאה ישירה (TUS או רגילה) לנתיב שלא נרשם ב-`assets` נדחית; לנתיב שנרשם — מצליחה; צופה נדחה גם בנתיב רשום.
- [ ] קובץ `.exe` ששמו שונה ל-`.png` נדחה ב-`complete` ונמחק מהאחסון.
- [ ] SVG עם `<script>` נשמר בלי הסקריפט.
- [ ] אין דרך לקרוא אובייקט מ-`invoices` או מ-`generated` של סביבה אחרת, גם לא עם שם נתיב מדויק.
- [ ] אחרי `0014`: משתמש מחובר (גם מנהל פלטפורמה) לא יכול לקרוא או לכתוב ב-`trend-refs` דרך ה-Storage API; העלאת `video/webm` ל-`uploads` עם שורת `assets` ממתינה מצליחה.
- [ ] פרסום דף עסק יוצר את `public-media/landing/{id}/hero.mp4`, וביטול הפרסום מוחק אותו.

---

## §14. Realtime — `0010_realtime.sql`

### 14.1 ערוצים ואירועים

| ערוץ (פרטי) | אירוע | נשלח כש… | Payload (רק מזהים, סטטוסים והתקדמות) |
|---|---|---|---|
| `job:{jobId}` | `job.updated` | הכנסה / שינוי `status`, `stage`, `progress`, `error_code`, `canceled_at` ב-`jobs` | `{ id, project_id, kind, status, stage, progress, error_code, finished_at, updated_at }` |
| `job:{jobId}` | `step.updated` | הכנסה / שינוי `status`, `attempt`, `error_code` ב-`job_steps` | `{ id, job_id, step_key, scene_id, status, attempt, error_code, updated_at }` |
| `job:{jobId}` | `scene.updated` | שינוי `status`, נכסים, `visual_source`, `degraded_reason` ב-`scenes` (לעבודה האחרונה של הפרויקט) | `{ id, version_id, index, status, visual_source, keyframe_asset_id, clip_asset_id, user_asset_id, degraded_reason, updated_at }` |
| `workspace:{workspaceId}` | `job.updated` | כמו למעלה (לתור בדשבורד) | אותו payload |
| `workspace:{workspaceId}` | `campaign.updated` (מ-`0013`) | שינוי `status` או `effective_status` ב-`ad_campaigns` | `{ id, status, effective_status, updated_at }` |
| `workspace:{workspaceId}` | `lead.created` (מ-`0013`) | הכנסה ל-`leads` (מטופס של Meta, מדף העסק או מה-backfill) | `{ id, campaign_id, received_at }` — **בלי** שם, טלפון, מייל או תשובות |
| `workspace:{workspaceId}` | `social_post.updated` (מ-`0013`) | שינוי `status` ב-`social_posts` | `{ id, status, platform, updated_at }` |

שלושת האירועים של `0013` משתמשים באותו ערוץ ובאותה הרשאה (`realtime_topic_allowed('workspace:…')` לא משתנה). הטריגרים שלהם כתובים בחלק 07 לפי התבנית של `broadcast_job_change` (§2.3, כלל 5): `after insert` / `after update of status, effective_status` עם תנאי `when` שמדלג על עדכונים שלא שינו את העמודות האלה, ו-`exception when others` שרושם אזהרה ולא מפיל את הכתיבה. backfill שמכניס לידים רבים בבת אחת (`meta-leads-backfill`, §23) שולח אירוע לכל ליד; הלקוח מאחד אותם לרענון אחד של הרשימה.

```sql
-- 0010_realtime.sql
create or replace function public.realtime_topic_allowed(p_topic text)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare v_kind text; v_id uuid;
begin
  if p_topic is null or p_topic !~ '^(job|workspace):[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return false;
  end if;
  v_kind := split_part(p_topic, ':', 1);
  v_id   := split_part(p_topic, ':', 2)::uuid;
  if v_kind = 'workspace' then
    return public.can_access_workspace(v_id);
  end if;
  return exists (select 1 from public.jobs j where j.id = v_id and public.can_access_workspace(j.workspace_id));
end $$;

-- per-migration rule (§12.6): explicit revoke first, then only the grant the Realtime policy needs
revoke execute on function public.realtime_topic_allowed(text) from public, anon, authenticated;
grant execute on function public.realtime_topic_allowed(text) to authenticated;

create policy "members receive job and workspace broadcasts" on realtime.messages
  for select to authenticated
  using (realtime.messages.extension = 'broadcast'
         and (select public.realtime_topic_allowed((select realtime.topic()))));
-- no INSERT policy: browsers can never broadcast; only the trigger below (security definer) sends

create or replace function public.broadcast_job_change()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_job uuid; v_event text; v_payload jsonb;
begin
  if tg_table_name = 'jobs' then
    v_job := new.id; v_event := 'job.updated';
    v_payload := jsonb_build_object('id', new.id, 'project_id', new.project_id, 'kind', new.kind, 'status', new.status,
                                    'stage', new.stage, 'progress', new.progress, 'error_code', new.error_code,
                                    'finished_at', new.finished_at, 'updated_at', new.updated_at);
    perform realtime.send(v_payload, v_event, 'workspace:' || new.workspace_id::text, true);
  elsif tg_table_name = 'job_steps' then
    v_job := new.job_id; v_event := 'step.updated';
    v_payload := jsonb_build_object('id', new.id, 'job_id', new.job_id, 'step_key', new.step_key, 'scene_id', new.scene_id,
                                    'status', new.status, 'attempt', new.attempt, 'error_code', new.error_code,
                                    'updated_at', new.updated_at);
  else
    select p.latest_job_id into v_job from public.projects p where p.id = new.project_id;
    if v_job is null then return null; end if;
    v_event := 'scene.updated';
    v_payload := jsonb_build_object('id', new.id, 'version_id', new.version_id, 'index', new.index, 'status', new.status,
                                    'visual_source', new.visual_source, 'keyframe_asset_id', new.keyframe_asset_id,
                                    'clip_asset_id', new.clip_asset_id, 'user_asset_id', new.user_asset_id,
                                    'degraded_reason', new.degraded_reason, 'updated_at', new.updated_at);
  end if;
  perform realtime.send(v_payload, v_event, 'job:' || v_job::text, true);
  return null;
exception when others then
  raise warning 'broadcast_job_change failed on %: %', tg_table_name, sqlerrm;   -- never fail a pipeline write over a broadcast
  return null;
end $$;

revoke execute on function public.broadcast_job_change() from public, anon, authenticated;   -- trigger-only: no grant

create trigger jobs_broadcast_insert after insert on public.jobs
  for each row execute function public.broadcast_job_change();
create trigger jobs_broadcast_update after update of status, stage, progress, error_code, finished_at, canceled_at on public.jobs
  for each row when (old.status is distinct from new.status or old.stage is distinct from new.stage
                     or old.progress is distinct from new.progress or old.error_code is distinct from new.error_code
                     or old.canceled_at is distinct from new.canceled_at)
  execute function public.broadcast_job_change();
create trigger job_steps_broadcast_insert after insert on public.job_steps
  for each row execute function public.broadcast_job_change();
create trigger job_steps_broadcast_update after update of status, attempt, error_code on public.job_steps
  for each row when (old.status is distinct from new.status or old.attempt is distinct from new.attempt
                     or old.error_code is distinct from new.error_code)
  execute function public.broadcast_job_change();
create trigger scenes_broadcast_update
  after update of status, keyframe_asset_id, clip_asset_id, user_asset_id, visual_source, degraded_reason on public.scenes
  for each row when (old.status is distinct from new.status or old.keyframe_asset_id is distinct from new.keyframe_asset_id
                     or old.clip_asset_id is distinct from new.clip_asset_id or old.user_asset_id is distinct from new.user_asset_id
                     or old.visual_source is distinct from new.visual_source or old.degraded_reason is distinct from new.degraded_reason)
  execute function public.broadcast_job_change();
```

- **ההחלטה:** `realtime.send(payload, event, topic, private)` הוא המנגנון הקנוני (נספח F §5.4 מציין את `realtime.broadcast_changes(…)`, אבל כלל ה-payload המצומצם של §6.9 שם — רק מזהים, סטטוסים והתקדמות — מתקיים רק עם `send`; ‏`broadcast_changes` שולח את כל השורה). [M0-verify] את החתימה של `realtime.send` בפרויקט; רק אם היא לא זמינה, עוברים ל-`realtime.broadcast_changes('job:' || v_job, v_event, tg_op, tg_table_name, tg_table_schema, new, old)` ומתעדים ב-`DECISIONS.md` — ההרשאה זהה כי היא נבדקת על הערוץ, וה-payload פשוט גדול יותר.
- ה-trigger לעולם לא מפיל כתיבה של הצנרת; כשל בשידור נרשם כאזהרה, והלקוח ממשיך לקבל עדכונים מה-polling.

### 14.2 צד הלקוח

```ts
// lib/realtime/subscribe.ts (browser)
import { createClient } from "@/lib/supabase/browser";
import { JobBroadcast, StepBroadcast, SceneBroadcast, CampaignBroadcast, LeadBroadcast, SocialPostBroadcast } from "@/lib/api/contracts/realtime";

export async function subscribeJob(jobId: string, h: {
  onJob: (p: JobBroadcast) => void; onStep: (p: StepBroadcast) => void; onScene: (p: SceneBroadcast) => void;
  onStatus: (s: "SUBSCRIBED" | "CHANNEL_ERROR" | "TIMED_OUT" | "CLOSED") => void;
}) {
  const supabase = createClient();
  await supabase.realtime.setAuth();                                   // must run before subscribe on private channels
  const ch = supabase
    .channel(`job:${jobId}`, { config: { private: true } })
    .on("broadcast", { event: "job.updated" },   ({ payload }) => h.onJob(JobBroadcast.parse(payload)))
    .on("broadcast", { event: "step.updated" },  ({ payload }) => h.onStep(StepBroadcast.parse(payload)))
    .on("broadcast", { event: "scene.updated" }, ({ payload }) => h.onScene(SceneBroadcast.parse(payload)))
    .subscribe((status) => h.onStatus(status));
  return () => { void supabase.removeChannel(ch); };
}

// dashboard queue + the 0013 events: `workspace:{workspaceId}` carries job.updated, campaign.updated, lead.created, social_post.updated
export async function subscribeWorkspace(workspaceId: string, h: {
  onJob: (p: JobBroadcast) => void;
  onCampaign?: (p: CampaignBroadcast) => void;       // campaigns list / campaign page (part 07)
  onLead?: (p: LeadBroadcast) => void;               // leads inbox, sidebar unread badge (part 07, part 03)
  onSocialPost?: (p: SocialPostBroadcast) => void;   // publish calendar (part 07)
  onStatus: (s: "SUBSCRIBED" | "CHANNEL_ERROR" | "TIMED_OUT" | "CLOSED") => void;
}) {
  const supabase = createClient();
  await supabase.realtime.setAuth();
  const ch = supabase
    .channel(`workspace:${workspaceId}`, { config: { private: true } })
    .on("broadcast", { event: "job.updated" }, ({ payload }) => h.onJob(JobBroadcast.parse(payload)))
    .on("broadcast", { event: "campaign.updated" }, ({ payload }) => h.onCampaign?.(CampaignBroadcast.parse(payload)))
    .on("broadcast", { event: "lead.created" }, ({ payload }) => h.onLead?.(LeadBroadcast.parse(payload)))
    .on("broadcast", { event: "social_post.updated" }, ({ payload }) => h.onSocialPost?.(SocialPostBroadcast.parse(payload)))
    .subscribe((status) => h.onStatus(status));
  return () => { void supabase.removeChannel(ch); };
}
```

ה-hooks של React שמעל העטיפות האלה שייכים לחלק 03 §1.8: ‏`useJobChannel` (`lib/realtime/use-job-channel.ts`) עוטף את `subscribeJob`, ו-`useWorkspaceChannel` עוטף את `subscribeWorkspace`.

```ts
// lib/api/contracts/realtime.ts
import { z } from "zod/v4";
import { Constants } from "@/lib/supabase/database.types";
const E = Constants.public.Enums;
export const JobBroadcast = z.object({
  id: z.uuid(), project_id: z.uuid(), kind: z.enum(E.job_kind), status: z.enum(E.job_status), stage: z.enum(E.job_stage),
  progress: z.number().int().min(0).max(100), error_code: z.string().nullable(), finished_at: z.string().nullable(), updated_at: z.string(),
});
export const StepBroadcast = z.object({
  id: z.uuid(), job_id: z.uuid(), step_key: z.string(), scene_id: z.uuid().nullable(), status: z.enum(E.step_status),
  attempt: z.number().int(), error_code: z.string().nullable(), updated_at: z.string(),
});
export const SceneBroadcast = z.object({
  id: z.uuid(), version_id: z.uuid(), index: z.number().int(),
  status: z.enum(["pending", "generating", "ready", "failed", "degraded"]), visual_source: z.enum(E.visual_source),
  keyframe_asset_id: z.uuid().nullable(), clip_asset_id: z.uuid().nullable(), user_asset_id: z.uuid().nullable(),
  degraded_reason: z.string().nullable(), updated_at: z.string(),
});
export type JobBroadcast = z.infer<typeof JobBroadcast>;
export type StepBroadcast = z.infer<typeof StepBroadcast>;
export type SceneBroadcast = z.infer<typeof SceneBroadcast>;

// 0013 (part 07): workspace channel only; ids and statuses, never lead PII
export const CampaignBroadcast = z.object({
  id: z.uuid(), status: z.enum(E.ad_campaign_status), effective_status: z.string().nullable(), updated_at: z.string(),
});
export const LeadBroadcast = z.object({ id: z.uuid(), campaign_id: z.uuid().nullable(), received_at: z.string() });
export const SocialPostBroadcast = z.object({
  id: z.uuid(), status: z.enum(E.social_post_status), platform: z.enum(E.social_platform), updated_at: z.string(),
});
export type CampaignBroadcast = z.infer<typeof CampaignBroadcast>;
export type LeadBroadcast = z.infer<typeof LeadBroadcast>;
export type SocialPostBroadcast = z.infer<typeof SocialPostBroadcast>;
```

- כשהטוקן מתרענן (`onAuthStateChange` עם `TOKEN_REFRESHED`) קוראים שוב ל-`supabase.realtime.setAuth(session.access_token)` [M0-verify אם הגרסה המותקנת עושה זאת אוטומטית].
- כל עוד הסטטוס אינו `SUBSCRIBED`, ‏TanStack Query מושך `GET /api/jobs/[id]` כל 5 שניות (חלק 03 §1.8). אחרי התחברות מחדש — משיכה מלאה אחת, ואז רק אירועים.

### קריטריוני קבלה
- [ ] משתמש מסביבה B שמנסה להירשם ל-`job:{jobId של A}` מקבל `CHANNEL_ERROR` ולא מקבל אף אירוע.
- [ ] עדכון `jobs.progress` מ-10 ל-25 שולח אירוע `job.updated` אחד לכל אחד משני הערוצים; עדכון `heartbeat_at` בלבד לא שולח כלום.
- [ ] `realtime_topic_allowed('job:not-a-uuid')` מחזיר `false` בלי שגיאה.
- [ ] ה-payload לא מכיל `options`, `error_detail`, `input`/`output` של צעדים, או טקסט של פרומפטים.
- [ ] אחרי `0013`: הכנסת ליד שולחת `lead.created` אחד ל-`workspace:{ws}`, וה-payload מכיל בדיוק את המפתחות `id`, `campaign_id`, `received_at`; עדכון `ad_campaigns.status` ל-`active` שולח `campaign.updated` אחד; עדכון של `last_synced_at` בלבד לא שולח כלום; משתמש מסביבה אחרת לא מקבל אף אחד מהם.

---

## §15. משימות מתוזמנות ב-pg_cron — `0011_cron.sql`

כל הזמנים ב-UTC. משימות שצריכות HTTP, ספקים חיצוניים או מחיקת קבצים רצות ב-Vercel Cron (§23); כאן רק SQL טהור.

```sql
-- 0011_cron.sql
select cron.schedule('expire-credit-grants',     '15 21 * * *',  $$select public.expire_credit_grants()$$);
select cron.schedule('refresh-hook-popularity',  '*/30 * * * *', $$refresh materialized view concurrently public.hook_popularity$$);
select cron.schedule('purge-webhook-payloads',   '0 3 * * 0',    $$update public.webhook_events set payload = null
                                                                   where payload is not null and received_at < now() - interval '90 days'$$);
select cron.schedule('expire-share-links',       '0 4 * * *',    $$select public.expire_share_links()$$);
select cron.schedule('mark-retention',           '20 3 * * *',   $$select public.mark_retention()$$);
select cron.schedule('purge-idempotency-keys',   '40 3 * * *',   $$delete from public.api_idempotency_keys where expires_at < now()$$);
select cron.schedule('purge-cron-history',       '50 3 * * 0',   $$delete from cron.job_run_details where end_time < now() - interval '14 days'$$);
select cron.schedule('purge-ai-generation-meta', '25 3 * * *',   $$update public.ai_generations set meta = null
                                                                   where meta is not null and created_at < now() - interval '30 days'$$);
select cron.schedule('purge-ai-generations',     '10 4 1 * *',   $$select public.purge_ai_generations()$$);
select cron.schedule('purge-support-data',       '20 4 1 * *',   $$select public.purge_support_data()$$);
select cron.schedule('purge-audit-logs',         '30 4 1 * *',   $$select public.purge_audit_logs()$$);
```

| משימה | מתי (UTC) | מה |
|---|---|---|
| `expire-credit-grants` | כל יום 21:15 (00:15 שעון קיץ בישראל) | מאפס דליים שפג תוקפם + שורות `expire` |
| `refresh-hook-popularity` | כל 30 דקות | מרענן את `hook_popularity` בלי לנעול קריאות |
| `purge-webhook-payloads` | ראשון 03:00 | מאפס `payload` של webhooks בני יותר מ-90 יום (מדיניות שמירה) |
| `expire-share-links` | כל יום 04:00 | מסמן `revoked_at` לקישורים שעבר `expires_at` שלהם |
| `mark-retention` | כל יום 03:20 | מסמן לניקוי רינדורים בני 90+ יום בסביבות בתוכנית החינמית **שמעולם לא שילמו** (`has_paid = false`), ונכסים של פרויקטים שנמחקו לפני 30+ יום; המחיקה מהאחסון ב-`/api/cron/cleanup` |
| `purge-idempotency-keys` | כל יום 03:40 | מוחק מפתחות אידמפוטנטיות שפגו (24 שעות) |
| `purge-cron-history` | ראשון 03:50 | מנקה היסטוריית ריצות של pg_cron (מומלץ ב-Supabase) |
| `purge-ai-generation-meta` | כל יום 03:25 | מאפס את `ai_generations.meta` (קטעי דיבאג) אחרי 30 יום |
| `purge-ai-generations` | ב-1 לחודש, 04:10 | `purge_ai_generations()`: מוחק שורות `ai_generations` בנות יותר מ-24 חודשים |
| `purge-support-data` | ב-1 לחודש, 04:20 | `purge_support_data()`: ‏`contact_messages`, ‏`abuse_reports` ו-`email_messages` אחרי 24 חודשים; הסכמות — 7 שנים אחרי סגירת החשבון או ביטול ההסכמה (שורות באנר אנונימיות — 7 שנים מהרישום; §11.4); ‏`trial_claims` אחרי 5 שנים |
| `purge-audit-logs` | ב-1 לחודש, 04:30 | `purge_audit_logs()`: ‏36 חודשים, ופעולות חיוב (`payment.*`, ‏`invoice.*`, ‏`refund_request.*`, ‏`subscription.*`, ‏`credits.*`, ‏`billing.*`) — 7 שנים |
| `purge-meta-raw` (`0013`, חלק 07) | כל יום 03:35 (`35 3 * * *`) | מאפס את `raw` ב-`ad_insights_daily` וב-`social_post_metrics` בשורות בנות יותר מ-90 יום |
| `purge-leads` (`0013`, חלק 07) | ב-1 לחודש, 04:40 (`40 4 1 * *`) | `purge_leads()`: מוחק לידים עם `received_at` לפני יותר מ-24 חודשים |
| `refresh-trend-stats` (`0014`, חלק 08) | כל יום 04:50 (`50 4 * * *`) | `refresh_trend_template_stats(p_from)` (הפקודה המדויקת בחלק 08): לא עושה כלום כל עוד `app_settings.cross_customer_benchmarks.enabled = false`, ומדלג על סביבות עם `benchmarks_opt_out` |

**משימות ההרחבה** נקבעות בסוף `0013` ו-`0014` עם אותו `cron.schedule(name, schedule, command)` (בטוח להרצה חוזרת), והפקודות שלהן כתובות בחלקים 07 ו-08. אחרי שתי המיגרציות יש **14 משימות**. השעות נבחרו כך שלא יחפפו את המשימות הקיימות (03:20–03:50, 04:10–04:30). שמירת דוחות בדיקת הדופק (12 חודשים) ובקשות המחיקה של Meta שהושלמו (3 שנים) נעשית בתוך המשימה `purge-meta-raw` של `0013` (חלק 07 §6.7), בלי משימת pg_cron נוספת.

`cron.schedule` עם שם קיים מעדכן את המשימה, ולכן המיגרציה בטוחה להרצה חוזרת. מעקב: `/admin` מציג את 20 הריצות האחרונות שנכשלו (דרך `GET /api/admin/ops/cron`, שקורא ל-`cron_recent_failures()` עם המפתח הסודי — הסכמה `cron` לא חשופה ב-Data API, ולכן הקריאה עוברת דרך פונקציה ב-`public`, §11.4).

### קריטריוני קבלה
- [ ] `select jobname, schedule from cron.job order by jobname` מחזיר בדיוק את 11 המשימות עם הלוחות שלמעלה אחרי `0012`, ובדיוק 14 אחרי `0014`.
- [ ] שורת `leads` עם `received_at` לפני 25 חודשים נמחקת בהרצת `purge-leads`, ושורה בת 23 חודשים נשארת; `refresh_trend_template_stats` מחזירה 0 כל עוד `app_settings.cross_customer_benchmarks.enabled = false`.
- [ ] הרצה ידנית של כל פקודה עוברת בלי שגיאה על מסד עם seed.
- [ ] דלי עם `expires_at` בעבר מתאפס אחרי הרצת `expire-credit-grants`, ו-`credit_invariant_violations()` ריקה.
- [ ] שורת `ai_generations` בת 31 יום עם `meta` מתאפסת אחרי `purge-ai-generation-meta`; שורת `audit_logs` מסוג `payment.refund` בת 4 שנים שורדת את `purge_audit_logs()`, ושורת `model.toggle` בת 4 שנים נמחקת.

---

## §15b. תפקיד גיבוי — `0012_ops_roles.sql`

הגיבוי הלוגי השבועי (חלק 06 §15.11) רץ מ-GitHub Actions עם תפקיד קריאה בלבד, ולא עם סיסמת `postgres`.

```sql
-- 0012_ops_roles.sql — read-only role for the weekly logical backup (part 06 §15.11); LOGIN + password are set manually (runbook R9), never in git
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'backup_reader') then
    create role backup_reader nologin bypassrls;          -- [M0-verify] that the Supabase postgres role may grant BYPASSRLS
  end if;
end $$;
grant usage on schema public to backup_reader;
grant select on all tables in schema public to backup_reader;
grant select on all sequences in schema public to backup_reader;
alter default privileges in schema public grant select on tables to backup_reader;
-- storage objects are backed up by backup-storage.yml (part 06 §15.11); auth.* is covered by Supabase daily backups + PITR
```

- התפקיד נוצר `nologin`; ההפעלה (`alter role backup_reader login password '…'`) נעשית ידנית לפי runbook R9, והסיסמה נשמרת רק ב-GitHub Secrets.
- `bypassrls` נדרש כי RLS פעיל על כל טבלה ב-`public`, ובלעדיו הגיבוי היה ריק. **חלופה** אם הפרויקט לא מאפשר להעניק `BYPASSRLS`: ‏`backup.yml` משתמש במחרוזת החיבור של `postgres` שנשמרת רק בסוד `SUPABASE_DB_URL_PRODUCTION` של GitHub, וההחלטה נרשמת ב-`DECISIONS.md`.

### קריטריוני קבלה
- [ ] `select rolbypassrls, rolcanlogin from pg_roles where rolname = 'backup_reader'` מחזיר `true, false` אחרי `db reset`; הרצה חוזרת של המיגרציה לא נכשלת.
- [ ] כ-`backup_reader`, ‏`select count(*) from public.credit_ledger` מצליח, ו-`insert` לכל טבלה נכשל בשגיאת הרשאה.

---

## §16. סקריפט ה-seed — `supabase/seed/seed.ts`

### 16.1 קבצים, מקור וסדר

`pnpm db:seed` מריץ את `supabase/seed/seed.ts` (‏`tsx`, מפתח סודי, דרך supabase-js). הקבצים ב-`supabase/seed/data/`:

| # | קובץ | מקור | מצב כתיבה | מפתח |
|---|---|---|---|---|
| 1 | `hook_families.json` | `/seed/hook_families.json` (8) | `upsert` | `slug` |
| 2 | `niche_categories.json` | `/seed/niche_categories.json` (13) | `upsert` | `slug` |
| 3 | `niches.json` | `/seed/niches.json` (36) | `upsert` של השדות הקנוניים בלבד | `slug` |
| 3b | `niche_extras.json` | `/seed/niche_extras.json` (36; הערכים מחלק 02 §1.2 ומנספח E §3.3, נבנה ב-`build_seed.py`) | `fill_if_null` | `slug` |
| 4 | `hook_types.json` | `/seed/hook_types.json` (27) | `upsert` של השדות הקנוניים בלבד | `slug` |
| 5 | `seasons.json` | `/seed/seasons.json` (25, כולל 2 ימי שקט) | `upsert` של השדות הקנוניים בלבד | `slug` |
| 6 | `hooks.json` | `/seed/hooks.json` (326) | `upsert` של השדות הקנוניים, **רק לשורות `source = 'seed'`** | `id` |
| 7 | `plans.json` | §16.4 | `upsert` | `id` |
| 8 | `credit_packs.json` | §16.4 | `upsert` | `id` |
| 9 | `credit_costs.json` | §16.4 | `insert_missing` (האדמין עורך; `--force-pricing` דורס) | `action_key` |
| 10 | `model_registry.json` | §16.5 | `insert_missing` (`--force-models` דורס) | `slug` |
| 11 | `model_routes.json` | §16.5 | `insert_missing` (`--force-models` דורס) | `task_key` |
| 12 | `voices.json` | `[]` בהשקה (האדמין ממפה אחרי מבחן השמיעה) | `insert_missing` | `id` |
| 13 | `music_tracks.json` | `[]` בהשקה (האדמין מייצר ב-Lyria ומאשר) | `insert_missing` | `id` |
| 14 | `templates.json` | `[]` או תבניות שנכתבו ב-PR | `insert_missing` | `slug` |
| 14b | `trend_templates.json` | `/seed/trend_templates.json` (12 תבניות טרנד, נבנה ב-`seed/scripts/build_trends.py`; התוכן בחלק 08) | `insert_missing` (האדמין עורך ומפרסם; ה-seed לא דורס) | `slug` |
| 15 | `app_settings.json` | §16.4 | `insert_missing` (הגדרות חיות שייכות לאדמין) | `key` |
| 16 | `feature_flags.json` | §16.4 | `insert_missing` | `key` |

- **הסדר הוא בדיוק הסדר של §5.8 בנספח F**, ועוד שלב 3b מיד אחרי `niches.json` ושלב 14b (תבניות הטרנד של ההרחבה) מיד אחרי `templates.json`. הוא שונה מעט מהסדר שב-`/seed/README.md` (שם `hook_families` אחרי `niches`), ושניהם תקינים כי אין תלות בין המשפחות לנישות; הסדר הקובע הוא של נספח F.
- **`niche_extras.json`** (חדש; `seed/scripts/build_seed.py` בונה אותו אל `/seed/niche_extras.json` ובודק אותו ב-`--check`, ו-`pnpm seed:sync` מעתיק אותו ל-`supabase/seed/data/` כמו את שאר קובצי `/seed`): מערך של `{ slug, short_name_he, default_register, default_audience_gender, default_cta, default_music_mood }` לכל 36 הנישות. ‏`short_name_he` מחלק 02 §1.2; ‏`default_register`, ‏`default_audience_gender` ו-`default_cta` מנספח E §3.3; ‏`default_music_mood` = `null` בהשקה (האדמין קובע; אחרת הסטוריבורד בוחר מצב רוח). ל-`local-politics` כל הערכים `null`. **מצב `fill_if_null`:** כל עמודה נכתבת רק כשהערך במסד הוא NULL, כך שעריכה באדמין לעולם לא נדרסת.
- **"שדות קנוניים בלבד"** = רק המפתחות שבקובץ. עמודות DB-only (`is_active`, `seo_*`, `short_name_he`, `sample_scripts`, `starts_on`, מונים, `status`…) מקבלות ברירת מחדל בהכנסה ראשונה ולא נדרסות אחר כך, כי upsert של PostgREST מעדכן רק את העמודות שנשלחו.
- **`trend_templates.json`** (שלב 14b, אחרי `hook_types` ו-`niches` שהוא מצביע עליהם; הטבלה קיימת רק מ-`0014`): כל 12 השורות נכנסות עם `status = 'draft'`, `demo_assets = []`, `published_week = null` ו-`source_reference_id = null`. הן עוברות ל-`published` רק מהאדמין, אחרי רינדורי ההדגמה (חלק 08). `build_trends.py --check` בונה את הקובץ מחדש בזיכרון ונכשל אם הוא שונה מהקובץ שב-`/seed` או אם שורה לא עוברת את כללי `TrendTemplateV1`.
- **הוקים שנערכו באדמין** מקבלים `source = 'admin'` בעת העריכה, וה-seed מדלג עליהם. הסקריפט מושך מראש את רשימת ה-`id` עם `source <> 'seed'` ומסנן אותם.
- `/seed` (בשורש הריפו) נשאר מקור האמת לנספחים A–C (נבנה מ-`seed/scripts/build_seed.py`); `pnpm seed:sync` מריץ `python3 -I seed/scripts/build_seed.py --check` ו-`python3 -I seed/scripts/build_trends.py --check`, ואז מעתיק את שמונת הקבצים (ששת הקבצים הקנוניים, `niche_extras.json` ו-`trend_templates.json`) ל-`supabase/seed/data/`. לא עורכים את ה-JSON ידנית, לא ב-`/seed` ולא בעותק. קובצי הנתונים העסקיים (`plans.json`, `credit_packs.json`, …, `feature_flags.json`, מ-§16.4–§16.5) קיימים רק ב-`supabase/seed/data/`.

### 16.2 סכמות Zod (`supabase/seed/schemas.ts`)

```ts
import { z } from "zod/v4";
import { Constants } from "../../lib/supabase/database.types";
import { BANNED_PHRASES } from "../../lib/ai/prompts/style-data";   // the single banned-phrase list (appendix E §5.2)
const E = Constants.public.Enums;

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const HOOK_ID = /^[a-z0-9]+(-[a-z0-9]+)*-[0-9]{2,3}$/;
export const RESERVED_NICHE_SLUGS = ["types", "season", "platform", "h", "new", "search", "universal"] as const;
export const SEED_PLATFORMS = ["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"] as const; // linkedin: schema-only
// names 1–17 of the 22 placeholders; must equal HOOK_PLACEHOLDERS of lib/hebrew/placeholders.ts (part 05 §8.2) — a unit test compares
export const HOOK_PLACEHOLDERS = [
  "עיר", "שכונה", "שירות", "מוצר", "מחיר", "סכום", "מספר", "זמן", "חודש", "קהל_יעד",
  "שם_העסק", "פעולה_שגויה", "מיתוס", "לפני", "אחרי", "הנחה", "בעיה",
] as const;
export const SEASON_ALIASES: Record<string, string> = {
  pesach: "passover", "rosh-hashanah": "rosh-hashana", chanukah: "hanukkah",
  "yom-haatzmaut": "independence-day", "yom-hazikaron": "memorial-day", "yom-hashoah": "holocaust-memorial-day",
};

const Slug = z.string().regex(SLUG);
const He = z.string().trim().min(1);
const HeOpt = z.string().trim().min(1).nullable();

/** canonical key order, enforced in addition to the shape (files are generated, order is part of the contract) */
export const KEY_ORDER = {
  niche_categories: ["slug", "name_he", "name_en", "sort_order"],
  niches: ["slug", "name_he", "name_en", "category_slug", "icon", "description_he", "video_types_he", "seasonal_angles_he",
           "compliance_flag", "compliance_note_he", "priority", "sort_order"],
  hook_families: ["slug", "name_he", "name_en", "description_he", "sort_order"],
  hook_types: ["slug", "name_he", "name_en", "family_slug", "description_he", "example_he", "sort_order"],
  seasons: ["slug", "name_he", "name_en", "date_hint_he", "publish_window_he", "niche_slugs", "is_quiet_day", "note_he", "sort_order"],
  hooks: ["id", "niche_slug", "hook_type_slug", "text_he", "platforms", "goal", "gender", "visual_direction_he",
          "placeholders", "season_slug", "compliance_note_he", "is_featured"],
} as const;

export const NicheCategorySeed = z.strictObject({ slug: Slug, name_he: He, name_en: He, sort_order: z.number().int() });

export const NicheSeed = z.strictObject({
  slug: Slug.refine((s) => !(RESERVED_NICHE_SLUGS as readonly string[]).includes(s), "reserved slug"),
  name_he: He, name_en: He, category_slug: Slug,
  icon: z.string().regex(/^[A-Z][A-Za-z0-9]+$/),                    // lucide-react component name
  description_he: He,
  video_types_he: z.array(He).min(1),
  seasonal_angles_he: z.array(He),
  compliance_flag: z.enum(E.compliance_flag),
  compliance_note_he: HeOpt,
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  sort_order: z.number().int(),
});

// DB-only launch defaults (step 3b, fill_if_null)
export const NicheExtrasSchema = z.strictObject({
  slug: Slug,
  short_name_he: HeOpt                                    // plural form usable after "ל…", e.g. "מתווכי נדל״ן"
    .refine((v) => v == null || !/[()]/.test(v), "HE025: parentheses are not allowed in short_name_he")   // same check as build_seed.py
    .refine((v) => v == null || (v.length <= 40 && v.trim().split(/\s+/).length <= 4), "short_name_he: 1-4 words, at most 40 chars"),
  default_register: z.enum(E.register).nullable(),
  default_audience_gender: z.enum(E.audience_gender).nullable(),
  default_cta: z.string().trim().min(1).max(120).nullable(),
  default_music_mood: z.enum(["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]).nullable(),
});

export const HookFamilySeed = z.strictObject({ slug: Slug, name_he: He, name_en: He, description_he: He, sort_order: z.number().int() });

export const HookTypeSeed = z.strictObject({
  slug: Slug, name_he: He, name_en: He, family_slug: Slug, description_he: He, example_he: He, sort_order: z.number().int(),
});

export const SeasonSeed = z.strictObject({
  slug: Slug, name_he: He, name_en: He,
  date_hint_he: He,                   // human text, never parsed
  publish_window_he: He,              // may be "—"
  niche_slugs: z.array(Slug),
  is_quiet_day: z.boolean(),
  note_he: HeOpt,
  sort_order: z.number().int(),
});

export const HookSeed = z.strictObject({
  id: z.string().regex(HOOK_ID),
  niche_slug: Slug.nullable(),
  hook_type_slug: Slug,
  text_he: z.string().trim().min(3).max(160),
  platforms: z.array(z.enum(SEED_PLATFORMS)).min(1),
  goal: z.enum(E.hook_goal),
  gender: z.enum(E.hook_gender),
  visual_direction_he: He,
  placeholders: z.array(z.enum(HOOK_PLACEHOLDERS)),
  season_slug: Slug.nullable(),
  compliance_note_he: HeOpt,
  is_featured: z.boolean(),
}).superRefine((h, ctx) => {
  const found = [...h.text_he.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1]);
  if (JSON.stringify(found) !== JSON.stringify(h.placeholders))
    ctx.addIssue({ code: "custom", path: ["placeholders"], message: `placeholders ${JSON.stringify(h.placeholders)} != text ${JSON.stringify(found)}` });
  if (/[א-ת]\/[א-ת]/.test(h.text_he) || h.text_he.includes("·"))
    ctx.addIssue({ code: "custom", path: ["text_he"], message: "gendered slash/dot form is not allowed" });
  if (h.text_he.includes("→")) ctx.addIssue({ code: "custom", path: ["text_he"], message: "use ← for progress arrows in Hebrew" });
  if (BANNED_PHRASES.some((p) => h.text_he.includes(p)) || h.text_he.includes("!!"))
    ctx.addIssue({ code: "custom", path: ["text_he"], message: "banned phrase (appendix E §5.2)" });
  if (/₪\s?\d|₪\{/.test(h.text_he))
    ctx.addIssue({ code: "custom", path: ["text_he"], message: "hook text uses the suffix form: '349 ₪' / '{מחיר} ₪'" });
  // HE010: at most 12 words; a word = a whitespace token that contains a letter or a digit ("–" and "₪" alone do not count;
  // a placeholder such as {מחיר} counts as one word)
  const words = h.text_he.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));
  if (words.length > 12)
    ctx.addIssue({ code: "custom", path: ["text_he"], message: `HE010: hook has ${words.length} words (max 12)` });
  // HE025 (Part 05 §23.3): no parentheses in hook text (spoken hooks cannot "read" them; rephrase with a comma or a colon)
  if (/[()]/.test(h.text_he))
    ctx.addIssue({ code: "custom", path: ["text_he"], message: "HE025: parentheses are not allowed in hook text" });
  if (!h.niche_slug && !h.season_slug && !h.id.startsWith("universal-"))
    ctx.addIssue({ code: "custom", path: ["id"], message: "hooks without niche/season must be universal-NN" });
  if (h.season_slug && !h.niche_slug && !h.id.startsWith(`seasonal-${h.season_slug}-`))
    ctx.addIssue({ code: "custom", path: ["id"], message: "seasonal hooks must be seasonal-{season}-NN" });
});

const LimitsSchema = z.strictObject({
  seats: z.number().int().min(1), client_workspaces: z.number().int().min(0), brand_kits: z.number().int().min(1).nullable(),
  max_duration_sec: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
  quality_tiers: z.array(z.enum(E.quality_tier)).min(1), visual_mix: z.array(z.enum(E.visual_mix)).min(1),
  max_ai_clips: z.number().int().min(0).nullable(), max_ai_clip_sec: z.number().int().min(0).nullable(),
  max_formats: z.number().int().min(1).max(3), max_resolution: z.enum(["720p", "1080p"]), watermark: z.boolean(),
  concurrent_jobs: z.number().int().min(1), daily_credit_cap: z.number().int().min(1), music_generate: z.boolean(),
  hook_variants_max: z.number().int().min(1).max(5), approval_links: z.boolean(), white_label: z.boolean(),
  projects_max: z.number().int().min(1).nullable(),
  // 2026-10-17 extension (part 07): Meta, organic scheduling, landing pages, health checks. Money keys are decimal shekels (R1)
  meta_ad_accounts: z.number().int().min(0),               // connected ad accounts across the billing workspace
  meta_active_campaigns: z.number().int().min(0).nullable(),
  meta_monthly_spend_cap_ils: z.number().min(0),           // managed spend, all campaigns, Asia/Jerusalem month
  meta_test_spend_ils: z.number().min(0),                  // one lifetime test campaign (Meta spend_cap)
  meta_split_test: z.boolean(), meta_auto_rules: z.number().int().min(0), meta_lead_inbox: z.boolean(),
  social_scheduled_max: z.number().int().min(0).nullable(),
  landing_pages: z.number().int().min(0),                  // published pages per workspace (agency: per client workspace); 0 = preview only, but a free workspace with has_paid may publish 1 (landingPageLimit, part 06 §2.7)
  health_checks_per_month: z.number().int().min(0),        // per workspace per Asia/Jerusalem month (agency: per client workspace)
});
export const PlanSeed = z.strictObject({
  id: z.enum(["free", "starter", "business", "agency"]), name_he: He, tagline_he: He,
  price_monthly_ils: z.number().min(0), price_annual_monthly_ils: z.number().min(0).nullable(),
  monthly_credits: z.number().int().min(0), trial_credits: z.number().int().min(0),
  limits: LimitsSchema, features_he: z.array(He).min(3), is_public: z.boolean(),
  is_highlighted: z.boolean(),                            // → התג "מומלץ"
  sort_order: z.number().int(),
});
export const CreditPackSeed = z.strictObject({
  id: z.string().regex(/^pack-[0-9]+$/), name_he: He, credits: z.number().int().positive(), price_ils: z.number().positive(),
  is_active: z.boolean(), sort_order: z.number().int(),
});
export const REQUIRED_ACTION_KEYS = [
  "script.generate", "storyboard.generate", "hooks.generate", "brand.extract", "scene.rewrite", "voice.preview",
  "captions.transcribe", "music.library", "image.draft", "image.standard", "image.premium", "clip.draft", "clip.standard",
  "clip.premium", "voice.tts", "music.generate", "render.base", "render.extra_format", "avatar.second",
  // 2026-10-17 extension (parts 05, 07, 08)
  "ads.copy", "ads.insight", "trends.analyze", "guided.shotlist", "guided.autocut",
  "landing.generate", "meta.health_check", "plan.generate", "hooks.score",
] as const;
export const CreditCostSeed = z.strictObject({
  action_key: z.string().regex(/^[a-z]+\.[a-z_]+$/), credits: z.number().int().min(0), credits_long: z.number().int().min(0).nullable(),
  unit: He, label_he: He, cogs_usd_per_unit: z.number().min(0), notes: z.string().nullable(),
});
export const ModelRegistrySeed = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]+\/[a-z0-9.:-]+$/), task: z.enum(E.model_task), display_name_he: He, family: He,
  is_enabled: z.boolean(), tiers: z.array(z.enum(E.quality_tier)),
  pricing: z.record(z.string(), z.unknown()), capabilities: z.record(z.string(), z.unknown()),
  source: z.literal("manual"), notes_he: z.string().nullable(),
});
export const ModelRouteSeed = z.strictObject({
  task_key: z.string().regex(/^[a-z]+\.[a-z_]+$/), primary_slug: z.string(), fallback_slugs: z.array(z.string()),
  params: z.record(z.string(), z.unknown()),
});
export const VoiceSeed = z.strictObject({
  id: Slug, display_name_he: He, gender: z.enum(E.voice_gender), age_band: z.enum(["young", "adult", "mature"]), tone_he: He,
  model_slug: z.string(), provider_voice_id: z.string().nullable(), sample_path: z.string().nullable(),
  is_active: z.boolean(), sort_order: z.number().int(),
});
export const MusicTrackSeed = z.strictObject({
  id: z.uuid(), title_he: He, mood: z.enum(["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]),
  bpm: z.number().int().nullable(), duration_ms: z.number().int().positive(),
  path: z.string().regex(/^music-library\/[a-z]+\/[0-9a-f-]{36}\.mp3$/), source: z.enum(["lyria", "licensed"]),
  license_note: He, is_active: z.boolean(), sort_order: z.number().int(),
});
export const TemplateSeed = z.strictObject({
  slug: Slug, name_he: He, description_he: He, niche_slug: Slug.nullable(), video_type: z.enum(E.video_type), goal: z.enum(E.hook_goal),
  structure: z.enum(["hpspc", "aida", "pas", "bab", "result_first", "brand_story"]),
  duration_sec: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]), aspect_ratio: z.enum(E.aspect_ratio),
  visual_style: z.enum(["cinematic", "ugc", "day_in_business", "before_after", "product", "text_motion"]), visual_mix: z.enum(E.visual_mix),
  caption_preset: z.enum(["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"]),
  music_mood: z.enum(["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]), default_hook_type_slug: Slug.nullable(),
  beat_plan: z.array(z.strictObject({
    role: z.enum(["hook", "problem", "agitate", "solution", "proof", "offer", "cta", "brand", "story"]),
    est_duration_sec: z.number().min(1.5).max(12), visual_idea_he: He,
  })).min(3),
  is_public: z.boolean(), sort_order: z.number().int(),
});
export const AppSettingSeed = z.strictObject({ key: z.string().regex(/^[a-z][a-z0-9_]*$/), value: z.unknown(), description: He });
export const FeatureFlagSeed = z.strictObject({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/), enabled: z.boolean(), plans: z.array(z.string()).nullable(),
  workspace_ids: z.array(z.uuid()).nullable(), description: He,
});

// step 14b: the row shape belongs to part 08 (TrendTemplateV1 + the seed-only rules: status "draft", empty demo_assets,
// canonical key order); the seed only imports it and adds the cross-file checks of §16.3
export { TrendTemplateSeed, TREND_TEMPLATE_KEY_ORDER } from "../../lib/trends/seed-schema";
```

### 16.3 האלגוריתם (`supabase/seed/seed.ts`)

```ts
// pnpm db:seed [--dry-run] [--only=hooks,niches] [--force-pricing] [--force-models] [--prune-hooks] [--fixtures] [--studio]
async function main() {
  const env = loadSeedEnv();                 // NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (sb_secret_…)
  guardProduction(env);                      // production URL requires --yes-production; --fixtures is refused in production (--studio is allowed)
  const files = await readAll("supabase/seed/data");            // 18 files; a missing file is an error

  // 1) shape: Zod per row + canonical key order for the eight /seed files (six canonical + niche_extras + trend_templates);
  //    collect ALL errors, then exit(1)
  const parsed = validateShapes(files);      // errors printed as "hooks.json[41].placeholders: …"

  // 2) normalize season aliases (seasons.slug, hooks.season_slug); unknown slug -> error
  normalizeSeasons(parsed);

  // 3) cross-file integrity; any problem aborts with the full list:
  //    unique keys per file · unique hooks.text_he (after normalize_he) · niches.category_slug ∈ categories
  //    hook_types.family_slug ∈ families · hooks.niche_slug ∈ niches|null · hooks.hook_type_slug ∈ types
  //    hooks.season_slug ∈ seasons|null · seasons.niche_slugs ⊂ niches · every non-political niche has ≥ 1 hook
  //    (local-politics has none by design) · model_routes.primary/fallback ∈ model_registry · voices.model_slug ∈ registry
  //    templates.niche_slug / default_hook_type_slug exist · credit_costs covers REQUIRED_ACTION_KEYS
  //    niche_extras: exactly one row per niche slug, no unknown slug
  //    plans: exactly free/starter/business/agency; packs: pack-150/pack-500/pack-1500
  //    trend_templates: exactly 12 rows, unique slug · hook_type_slug ∈ types · niches[] and niche_adaptations[].niche_slug ⊂ niches
  //    (never local-politics) · ≥ 3 hook_variants with distinct keys A/B/C · ≥ 3 niche_adaptations · ad_safety "organic_only"
  //    ⇒ recommended_ad_goal null (fake-system-popup is organic_only) · status "draft" · demo_assets [] · Hebrew text rules of HookSeed
  //    (no gendered slash/dot forms, no banned phrase, "←" not "→")
  //    model_routes: llm.video primary/fallbacks carry capabilities.video_in = true in model_registry
  assertIntegrity(parsed);

  if (flags.dryRun) return printSummary(parsed);

  // 4) write in the Appendix F §5.8 order (+ step 3b); chunks of 200 rows; canonical columns only
  const skipHookIds = await fetchIds("hooks", { neq: ["source", "seed"] });
  await upsert("hook_families", parsed.hook_families, "slug");
  await upsert("niche_categories", parsed.niche_categories, "slug");
  await upsert("niches", parsed.niches, "slug");
  await fillIfNull("niches", parsed.niche_extras, "slug");      // 3b: per row, read current values; update only the NULL columns
  await upsert("hook_types", parsed.hook_types, "slug");
  await upsert("seasons", parsed.seasons, "slug");
  await upsert("hooks", parsed.hooks.filter((h) => !skipHookIds.has(h.id)), "id");
  await upsert("plans", parsed.plans, "id");
  await upsert("credit_packs", parsed.credit_packs, "id");
  await write("credit_costs", parsed.credit_costs, "action_key", flags.forcePricing ? "upsert" : "insert_missing");
  await write("model_registry", parsed.model_registry, "slug", flags.forceModels ? "upsert" : "insert_missing");
  await write("model_routes", parsed.model_routes, "task_key", flags.forceModels ? "upsert" : "insert_missing");
  await write("voices", parsed.voices, "id", "insert_missing");
  await write("music_tracks", parsed.music_tracks, "id", "insert_missing");
  await write("templates", parsed.templates, "slug", "insert_missing");
  await write("trend_templates", parsed.trend_templates, "slug", "insert_missing");   // 14b (table from 0014)
  await write("app_settings", parsed.app_settings, "key", "insert_missing");
  await write("feature_flags", parsed.feature_flags, "key", "insert_missing");

  // 5) post-steps (idempotent)
  await admin.from("niches").update({ is_active: false }).eq("compliance_flag", "political");   // Appendix F §12.5: no political niche at launch
  if (flags.pruneHooks) await archiveSeedHooksMissingFrom(parsed.hooks);                         // status='archived', never delete
  await admin.rpc("refresh_hook_popularity");
  if (flags.fixtures) await seedFixtures();  // local/staging only: users owner@, editor@, viewer@, agency@ + client workspace, 500 credits each
  if (flags.studio) await seedTrendsStudio(); // ws-trends-studio for the trend demo renders (below); allowed in production
  printSummary();                            // inserted / updated / skipped per table
}
```

```sql
-- used by the seed and by the admin "refresh now" action (pg_cron runs the raw statement)
create or replace function public.refresh_hook_popularity()
returns void
language sql security definer set search_path = ''
as $$ refresh materialized view concurrently public.hook_popularity; $$;
```

- `insert_missing` = upsert עם `ignoreDuplicates: true`.
- **סוד ה-Vault ב-local:** כשה-URL הוא `localhost`, הסקריפט מתחבר גם ב-`SUPABASE_DB_URL` (חבילת `pg`) ויוצר את `trial_hash_pepper` מ-`TRIAL_HASH_PEPPER` אם הוא חסר. בסביבות מרוחקות הוא רק בודק שהסוד קיים (`rpc("trial_pepper_configured")`, §9.4), ונכשל עם הוראה ברורה אם לא.
- **Fixtures** (`--fixtures`, לא בפרודקשן): משתמשי בדיקה ב-`auth.admin.createUser({ email_confirm: true })` — `owner@test.local`, `editor@test.local`, `viewer@test.local`, `agency-owner@test.local` (סביבת `agency` + שתי סביבות לקוח), יתרה 500 לכל סביבת חיוב ב-`grant_credits(…, 'promo', …)` עם מפתחות `grant:fixture:{email}`. זה הבסיס לבדיקות e2e ולבדיקות RLS ב-staging.
- **סביבת הסטודיו** (`--studio`, `seedTrendsStudio()`, מותר גם בפרודקשן עם `--yes-production`): סביבה פנימית אחת מסוג `business` עם `slug = 'ws-trends-studio'` והשם "סטודיו הטרנדים", שהבעלים שלה הוא מנהל הפלטפורמה הראשון (`profiles.is_platform_admin`, לפי `created_at`; אין מנהל ← הסקריפט נכשל עם הוראה להיכנס קודם עם כתובת מ-`ADMIN_EMAILS`). הסקריפט יוצר את הסביבה, את החברות `owner` ואת ערכת המותג שלנו כברירת מחדל, קובע `plan_override = {"plan_id":"agency","until":"2099-12-31T21:59:59Z","reason":"trends studio (internal)"}`, ומעניק 5,000 קרדיטים פעם בחודש (`grant_credits(…, 'admin', …, 'grant:studio:{YYYY-MM}')`). הרצה חוזרת לא יוצרת סביבה שנייה ולא מעניקה פעמיים באותו חודש. רינדורי ההדגמה של חלק 08 (`POST /api/admin/trends/templates/[id]/demo-render`) רצים בסביבה הזו, וה-finalize שלהם מעתיק את הקבצים ל-`public-media/trends/{slug}/` (§13.1).
- **השחרור של ההרחבה בפרודקשן:** אחרי `0013` ו-`0014` מריצים `pnpm db:seed --only=plans,credit_costs,app_settings,feature_flags,model_registry,model_routes,trend_templates --yes-production`, ואז `pnpm db:seed --studio --yes-production`. `plans` נכתבים ב-`upsert` (קובץ התוכניות הוא הקנוני, §16.1), ושאר הקבצים ב-`insert_missing`, כך שרק המפתחות, הנתיבים והתבניות החדשים נוספים. עד שהשלב הזה רץ, הקוד קורא מפתח `limits` חסר כערך של התוכנית החינמית (ברירות המחדל של `PlanLimits`), כלומר במצב המחמיר.
- הפלט של `--dry-run` הוא טבלה: קובץ · שורות · שגיאות. CI מריץ `pnpm db:seed --dry-run` על כל PR שנוגע ב-`supabase/seed/` או ב-`/seed`.

### 16.4 תוכן קובצי הנתונים העסקיים

**`plans.json`** (מחירים כולל מע״מ; `features_he` לפי נספח F §10.2, והנוסח כאן קנוני — שורת הניסיון מציינת גם "באיכות טיוטה, עם סימן מים"; `tagline_he` — הערכים כאן הם הקנוניים, וחלק 02 §7.2 מציג אותם כלשונם):

```json
[
  { "id": "free", "name_he": "חינם", "tagline_he": "לנסות בלי להתחייב",
    "price_monthly_ils": 0, "price_annual_monthly_ils": null, "monthly_credits": 0, "trial_credits": 70,
    "limits": { "seats": 1, "client_workspaces": 0, "brand_kits": 1, "max_duration_sec": 30, "quality_tiers": ["draft"],
                "visual_mix": ["images", "smart"], "max_ai_clips": 1, "max_ai_clip_sec": 5, "max_formats": 1, "max_resolution": "720p",
                "watermark": true, "concurrent_jobs": 1, "daily_credit_cap": 70, "music_generate": false, "hook_variants_max": 1,
                "approval_links": false, "white_label": false, "projects_max": 3,
                "meta_ad_accounts": 1, "meta_active_campaigns": 1, "meta_monthly_spend_cap_ils": 0, "meta_test_spend_ils": 300,
                "meta_split_test": false, "meta_auto_rules": 0, "meta_lead_inbox": false, "social_scheduled_max": 3,
                "landing_pages": 0, "health_checks_per_month": 1 },
    "features_he": ["70 קרדיטים לניסיון (כ-2 סרטונים קצרים באיכות טיוטה, עם סימן מים)", "איכות טיוטה, 720p, פורמט 9:16", "סימן מים של {{BRAND_NAME}}",
                    "גישה מלאה לספריית ההוקים", "בלי כרטיס אשראי"],
    "is_public": true, "is_highlighted": false, "sort_order": 10 },
  { "id": "starter", "name_he": "בסיס", "tagline_he": "לעסק שמפרסם כל שבוע",
    "price_monthly_ils": 119, "price_annual_monthly_ils": 95, "monthly_credits": 400, "trial_credits": 0,
    "limits": { "seats": 1, "client_workspaces": 0, "brand_kits": 1, "max_duration_sec": 60, "quality_tiers": ["draft", "standard"],
                "visual_mix": ["images", "smart", "full"], "max_ai_clips": null, "max_ai_clip_sec": null, "max_formats": 3,
                "max_resolution": "1080p", "watermark": false, "concurrent_jobs": 2, "daily_credit_cap": 400, "music_generate": false,
                "hook_variants_max": 3, "approval_links": false, "white_label": false, "projects_max": null,
                "meta_ad_accounts": 1, "meta_active_campaigns": 2, "meta_monthly_spend_cap_ils": 3000, "meta_test_spend_ils": 0,
                "meta_split_test": true, "meta_auto_rules": 2, "meta_lead_inbox": true, "social_scheduled_max": 30,
                "landing_pages": 1, "health_checks_per_month": 2 },
    "features_he": ["400 קרדיטים בחודש (כ-8 סרטונים)", "איכות טיוטה וסטנדרט, Full HD", "3 פורמטים: 9:16, 1:1, 16:9", "בלי סימן מים",
                    "קריינות וכתוביות בעברית", "עד 3 גרסאות הוק לסרטון", "2 יצירות במקביל"],
    "is_public": true, "is_highlighted": false, "sort_order": 20 },
  { "id": "business", "name_he": "עסק", "tagline_he": "לעסק שמפרסם כמה פעמים בשבוע",
    "price_monthly_ils": 289, "price_annual_monthly_ils": 231, "monthly_credits": 1000, "trial_credits": 0,
    "limits": { "seats": 3, "client_workspaces": 0, "brand_kits": 3, "max_duration_sec": 60, "quality_tiers": ["draft", "standard", "premium"],
                "visual_mix": ["images", "smart", "full"], "max_ai_clips": null, "max_ai_clip_sec": null, "max_formats": 3,
                "max_resolution": "1080p", "watermark": false, "concurrent_jobs": 3, "daily_credit_cap": 800, "music_generate": true,
                "hook_variants_max": 5, "approval_links": true, "white_label": false, "projects_max": null,
                "meta_ad_accounts": 2, "meta_active_campaigns": null, "meta_monthly_spend_cap_ils": 15000, "meta_test_spend_ils": 0,
                "meta_split_test": true, "meta_auto_rules": 5, "meta_lead_inbox": true, "social_scheduled_max": null,
                "landing_pages": 3, "health_checks_per_month": 4 },
    "features_he": ["1,000 קרדיטים בחודש (כ-20 סרטונים)", "כל רמות האיכות, כולל פרימיום", "מוזיקה מקורית לכל סרטון",
                    "עד 5 גרסאות הוק לסרטון", "3 משתמשים ו-3 ערכות מותג", "קישורי אישור ללקוח", "3 יצירות במקביל"],
    "is_public": true, "is_highlighted": true, "sort_order": 30 },
  { "id": "agency", "name_he": "סוכנות", "tagline_he": "למנהלי סושיאל ולסוכנויות",
    "price_monthly_ils": 990, "price_annual_monthly_ils": 792, "monthly_credits": 3300, "trial_credits": 0,
    "limits": { "seats": 10, "client_workspaces": 15, "brand_kits": null, "max_duration_sec": 60, "quality_tiers": ["draft", "standard", "premium"],
                "visual_mix": ["images", "smart", "full"], "max_ai_clips": null, "max_ai_clip_sec": null, "max_formats": 3,
                "max_resolution": "1080p", "watermark": false, "concurrent_jobs": 6, "daily_credit_cap": 2500, "music_generate": true,
                "hook_variants_max": 5, "approval_links": true, "white_label": true, "projects_max": null,
                "meta_ad_accounts": 15, "meta_active_campaigns": null, "meta_monthly_spend_cap_ils": 100000, "meta_test_spend_ils": 0,
                "meta_split_test": true, "meta_auto_rules": 5, "meta_lead_inbox": true, "social_scheduled_max": null,
                "landing_pages": 1, "health_checks_per_month": 4 },
    "features_he": ["3,300 קרדיטים בחודש (כ-66 סרטונים)", "עד 15 סביבות לקוח, ערכת מותג לכל לקוח", "10 משתמשים והרשאות",
                    "דפי שיתוף בלי המיתוג שלנו (White label)", "קישורי אישור ללקוח", "6 יצירות במקביל"],
    "is_public": true, "is_highlighted": false, "sort_order": 40 }
]
```

`{{BRAND_NAME}}` בתוך `features_he` נשאר כמשתנה ב-JSON ומוחלף בזמן הצגה מ-`BRAND.nameHe` (`lib/constants.ts`), כמו כל טקסט אחר.

**מפתחות ה-`limits` של ההרחבה** (חלק 07 אוכף אותם; `PLAN_LIMIT.details.limit` משתמש בשמות האלה, §18.2):

| מפתח | חינם | בסיס | עסק | סוכנות | משמעות |
|---|---|---|---|---|---|
| `meta_ad_accounts` | 1 | 1 | 2 | 15 | חשבונות מודעות מחוברים בכל סביבת החיוב (סוכנות: כולל סביבות הלקוח) |
| `meta_active_campaigns` | 1 | 2 | `null` | `null` | קמפיינים פעילים בבת אחת בסביבה (אילו סטטוסים נספרים — חלק 07) |
| `meta_monthly_spend_cap_ils` | 0 | 3,000 | 15,000 | 100,000 | הוצאה מנוהלת בכל הקמפיינים בחודש לפי Asia/Jerusalem (`managed_spend_monthly`; סוכנות: סכום כל הלקוחות) |
| `meta_test_spend_ils` | 300 | 0 | 0 | 0 | קמפיין ניסיון אחד לכל החיים (`is_free_test`, `spend_cap` של Meta) |
| `meta_split_test` | `false` | `true` | `true` | `true` | בדיקת 3 הוקים בקמפיין אחד |
| `meta_auto_rules` | 0 | 2 | 5 | 5 | כללים אוטומטיים שמותר להפעיל בסביבה |
| `meta_lead_inbox` | `false` | `true` | `true` | `true` | ניהול הלידים (סטטוס, הערות, אחראי, CSV); צפייה בלידים, כפתורי חיוג ו-WhatsApp והתראות זמינים בכל תוכנית |
| `social_scheduled_max` | 3 | 30 | `null` | `null` | פוסטים מתוזמנים לעתיד בבת אחת |
| `landing_pages` | 0 | 1 | 3 | 1 | דפי עסק **שפורסמו** בסביבה (סוכנות: בכל סביבת לקוח). בחינם אפשר ליצור תצוגה מקדימה עם סימן מים, בלי לפרסם; סביבה חינמית שרכשה חבילת קרדיטים (`workspaces.has_paid = true`) רשאית לפרסם דף אחד, עם "נבנה עם {{BRAND_NAME}}" (`landingPageLimit(ws)`, חלק 06 §2.1, §2.7). הערך ב-JSON נשאר 0 |
| `health_checks_per_month` | 1 | 2 | 4 | 4 | בדיקות דופק בחודש לפי Asia/Jerusalem בסביבה (סוכנות: בכל סביבת לקוח) |

- **`features_he` לא משתנה.** הטקסטים של Meta, דף העסק ובדיקת הדופק בדף המחירים מוצגים ברכיב נפרד (`PlanMetaFeatures`, חלק 02) רק כשהדגלים שלהם דולקים (שער הטענות), ולכן הם לא נכנסים לשורה הסטטית של התוכנית.
- **סכומים** (`*_ils`) הם שקלים עשרוניים (R1). `null` = ללא הגבלה, כמו בשאר המפתחות.
- **שורת `free` שנוצרת ב-`0005`** לא כוללת את המפתחות האלה עד שה-seed רץ; `PlanLimits` נותן לכל מפתח חדש ברירת מחדל ששווה לערך של `free`, כך ששורה ישנה נקראת במצב המחמיר (§16.3, "השחרור של ההרחבה").

**`credit_packs.json`:** ‏`pack-150` "חבילת 150" · 150 קרדיטים · ₪59 · ‏`pack-500` "חבילת 500" · 500 · ₪179 · ‏`pack-1500` "חבילת 1,500" · 1,500 · ₪449 (כולם `is_active: true`, ‏`sort_order` 10/20/30).

**`credit_costs.json`** (התוויות כאן הן הקנוניות, וחלק 02 §7.5 מציג אותן כלשונן; עלות COGS לפי §10.4 בנספח F):

| `action_key` | `credits` | `credits_long` | `unit` | `label_he` | `cogs_usd_per_unit` |
|---|---|---|---|---|---|
| `script.generate` | 2 | — | `call` | כתיבת תסריט (כולל 3 הצעות הוק) | 0.03 |
| `storyboard.generate` | 1 | — | `call` | בניית סטוריבורד | 0.02 |
| `hooks.generate` | 1 | — | `batch` | עד 10 הוקים חדשים | 0.01 |
| `brand.extract` | 0 | — | `call` | חילוץ פרטי המותג מהאתר | 0.005 |
| `scene.rewrite` | 0 | — | `call` | שכתוב סצנה | 0.005 |
| `voice.preview` | 0 | — | `call` | השמעת קול לדוגמה | 0.005 |
| `captions.transcribe` | 0 | — | `minute` | סנכרון כתוביות לקריינות | 0.004 |
| `music.library` | 0 | — | `track` | מוזיקה מהספרייה | 0 |
| `image.draft` / `image.standard` / `image.premium` | 2 / 4 / 7 | — | `image` | תמונה לסצנה: טיוטה / סטנדרט / פרימיום | 0.041 / 0.071 / 0.141 |
| `clip.draft` / `clip.standard` / `clip.premium` | 2 / 5 / 11 | — | `second` | קליפ וידאו, לכל שנייה: טיוטה / סטנדרט / פרימיום | 0.032 / 0.089 / 0.211 |
| `voice.tts` | 1 | — | `15s` | קריינות, לכל 15 שניות שהתחילו | 0.019 |
| `music.generate` | 5 | — | `song` | מוזיקה מקורית לסרטון | 0.084 |
| `render.base` | 3 | 5 | `format` | הרכבת הסרטון, פורמט ראשון (עד 30 שניות / 31–60 שניות) | 0.05 |
| `render.extra_format` | 2 | 3 | `format` | פורמט נוסף (עד 30 שניות / 31–60 שניות) | 0.04 |
| `avatar.second` | 3 | — | `second` | אווטאר מדבר, לכל שנייה | 0.053 |
| `ads.copy` | 0 | — | `call` | טקסטים למודעה (3 גרסאות) | 0.01 |
| `ads.insight` | 0 | — | `call` | הסבר בעברית לתוצאות הקמפיין | 0.005 |
| `trends.analyze` | 0 | — | `call` | ניתוח סרטון השראה (צוות בלבד) | 0.05 |
| `guided.shotlist` | 0 | — | `call` | רשימת צילומים מותאמת | 0.005 |
| `guided.autocut` | 1 | — | `clip` | עריכה אוטומטית של צילום, לכל קליפ | 0.01 |
| `landing.generate` | 10 | — | `page` | בניית דף העסק (יצירה או יצירה מחדש) | 0.03 |
| `meta.health_check` | 0 | — | `call` | בדיקת דופק לחשבון המודעות | 0.02 |
| `plan.generate` | 0 | — | `call` | בניית תוכנית 30 יום | 0.02 |
| `hooks.score` | 0 | — | `call` | ציון הוק לפני פרסום | 0.002 |

(בקובץ כל שורה עם התווית שלה בנפרד, למשל `image.draft` ← "תמונה לסצנה: טיוטה".) **שורות ההרחבה:** ניהול קמפיינים, פרסום ודוחות לא עולים קרדיטים בכלל; פעולות ה-LLM שעולות 0 מוגנות ב-buckets של הגבלות הקצב (§18.6), לא בקרדיטים. `landing.generate` (10 קרדיטים) נגבה על כל יצירה או יצירה מחדש של דף העסק, גם בתצוגה המקדימה של התוכנית החינמית; עריכת טקסט בעורך, פרסום וביטול פרסום חינמיים. מזהה הפרומפט נשאר `landing.copy.v1` (חלק 07). ערכי ה-COGS של ארבע השורות האחרונות הם הערכה ראשונית לפי הנתיב והמודל, ומתעדכנים לפי `ai_generations` אחרי M10 [M0-verify]. בדיקת יחידה: `estimateSample()` (חלק 05) על ה-seed מחזירה 23 / 50 / 107 / 478 לארבע הדוגמאות של §10.4 בנספח F (`SAMPLE_PRESETS`: `images15`, `draft30`, `standard30`, `premium60`).

**`app_settings.json`** — הרשימה המלאה של המפתחות (30: 21 מההשקה ו-9 של הרחבת 2026-10-17, בסוף הטבלה). לכל מפתח יש סכמת Zod ב-`lib/settings/schema.ts` (`APP_SETTINGS: Record<AppSettingKey, z.ZodType>`); `PUT /api/admin/settings/[key]` מאמת מולה, והקוראים משתמשים ב-`getSetting(key)` (מטמון 60 שניות). עורך ההגדרות באדמין (חלק 03 §22.17) מציג את כל המפתחות, בקבוצות, עם טופס שנבנה מהסכמה.

| `key` | `value` (seed) | צורה / משמעות | `description` |
|---|---|---|---|
| `vat_rate` | `0.18` | מספר 0–1 | VAT rate applied to all ILS prices (never hard-coded) |
| `vat_rate_next` | `null` | `{rate, effective_from: "YYYY-MM-DD"}` או `null` | Announced future VAT rate (part 06 §1.3) |
| `fx_usd_ils` | `3.70` | מספר | USD→ILS rate for COGS and margin reports |
| `election_mode` | `{"enabled": true, "until": "2026-10-28T23:59:00+02:00"}` | `{enabled, until}` | Blocks political content until the end of election day |
| `quiet_day_banner` | `{"enabled": false, "text_he": null, "date": null}` | `{enabled, text_he, date}` | Overrides the default quiet-day banner text |
| `maintenance_mode` | `{"enabled": false, "until": null, "message_he": null}` | מקור האמת (הדגל = עקיפה מקומית) | Pauses new generations (writes return MAINTENANCE) |
| `marketing_announcement` | `{"enabled": true, "id": "hooks-library-v1", "text_he": "חדש: ספריית הוקים בעברית לפי נישה. מעתיקים בחינם ←", "href": "/hooks"}` | `{enabled, id, text_he, href}` | Marketing announcement bar (part 02 §2.1) |
| `hook_of_the_day` | `{"hook_id": null, "date": null, "history": []}` | `history`: ‏`[{hook_id, date}]`, 60 האחרונים | Written by /api/cron/hook-of-the-day |
| `hebrew_wps` | `{"default": 2.4, "by_voice": {}}` | אובייקט; הקוד מקבל גם מספר בודד | Hebrew VO words per second (calibrated per voice) |
| `tts_fallback_voices` | `{"google/gemini-3.8-flash-tts": {"female": null, "male": null}}` | `{[model_slug]: {female, male}}`; ‏`null` = אין גיבוי ← `TTS_FAILED` | Fallback voice names, filled by an admin after the M0 TTS spike |
| `openrouter_daily_budget_usd` | `150` | מספר | Global daily OpenRouter spend guard (BUDGET_GUARD above it) |
| `free_trial_credits` | `70` | שלם | Trial credits granted once per normalized email |
| `rollover_cap_multiplier` | `1` | מספר | Max rollover as a multiple of the monthly allowance |
| `typical_video_credits` | `50` | שלם | Credits of a typical 30 s draft reel, for "≈ N videos" copy |
| `prompt_versions` | `{}` | `{[family]: "vN"}` | Active prompt version per family; empty = latest in code |
| `disposable_email_domains` | `["10minutemail.com", "guerrillamail.com", "mailinator.com", "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc", …]` | מערך מחרוזות | Domains that never receive trial credits (full list in the file) |
| `allocation_threshold_schedule` | `[{"from":"2026-01-01","ils":10000},{"from":"2026-06-01","ils":5000}]` | ממוין עולה לפי `from` | Invoice allocation-number threshold by date (part 06 §9.4) |
| `dunning_retry_days` | `[1, 3, 7]` | מערך שלמים | Days after a failed renewal on which the charge is retried (part 06 §6.1) |
| `non_business_days` | תאריכי החגים בישראל ל-12 החודשים הבאים (ISO) | מערך תאריכים | Holidays for business-day counting (part 06 §10.2) |
| `renewals_paused` | `false` | בוליאני | Pauses renewal charges during a provider incident (runbook R3) |
| `meta_budget_presets_ils` | `{"presets":[30,40,70,100],"recommended":40,"floor":20}` | שקלים עשרוניים (R1); `floor` = הרצפה שלנו לתקציב יומי, והמינימום בפועל הוא הגבוה מבין הרצפה והמינימום של Meta לחשבון (`meta_assets.min_daily_budget_ils`) | Daily budget presets, recommended preset and floor for the campaign builder (part 07) |
| `meta_min_sample` | `{"impressions":1000,"days":3,"results":5}` | לכל מודעה: חשיפות וימים; תוצאות — לכל הקמפיין | Minimum sample before a winner is declared or an action is recommended (part 07) |
| `meta_spend_cap_grace_days` | `7` | שלם | Grace days after the managed-spend cap is reached before new launches are blocked |
| `social_daily_caps` | `{"instagram":25,"facebook":25}` | לחשבון אינסטגרם / לעמוד ביום | Our own daily publishing caps (Meta limits are read at runtime) |
| `trends_weekly_drop` | `{"dow":0,"time":"08:00","tz":"Asia/Jerusalem"}` | `dow`: 0 = יום ראשון | Weekly trend drop slot (part 08) |
| `trend_analysis_limits` | `{"max_usd":0.5,"monthly_usd":50,"max_ref_mb":200,"max_ref_sec":180,"base64_max_mb":8}` | דולרים, מגה-בייט, שניות | Spend and size guards for admin trend analysis (BUDGET_GUARD above them) |
| `trend_ref_retention_days` | `30` | שלם | Days a reference file is kept when its rights basis is not own, licensed, partner or customer-owned |
| `cross_customer_benchmarks` | `{"enabled":false,"k_min":5}` | נשאר `false` עד אישור עורך דין | Cross-customer aggregates (off; minimum number of businesses per row) |
| `lead_notify` | `{"include_phone_in_whatsapp":true,"untouched_reminder_min":15}` | ⚖️ הטלפון בהודעת WhatsApp ממתין לאישור עורך דין (חלק 06) | Lead notification options |

**`feature_flags.json`** (13 דגלים מההשקה, ועוד 11 של ההרחבה בפסקה הבאה — 24 בסך הכול; `plans` ו-`workspace_ids` הם `null` אלא אם צוין אחרת): `phone_otp` false · `avatar` false, `plans: ["business","agency"]` · `voice_clone` false, `plans: ["business","agency"]` · `stock_broll` false · `chat_edit` false · `music_generate` **true** (מתג חירום; ההרשאה עצמה ב-`plans.limits.music_generate`) · `premium_video` **true** (מתג חירום; ההרשאה ב-`limits.quality_tiers`) · `whatsapp_notify` false · `annual_billing` **true** · `hook_submissions` false · `format_4x5` false · `maintenance_mode` false (עקיפה מקומית בלבד) · `billing_checkout` **true** (מתג חירום לרכישות חדשות; כבוי ← 503 `MAINTENANCE` `{ scope: "checkout" }`). מצב התחזוקה נקבע ב-`app_settings.maintenance_mode`; הדגל באותו שם קיים רק לעקיפה מקומית (`FEATURE_MAINTENANCE_MODE`), ו-`lib/flags.ts` מחזיר `true` אם אחד מהם דולק. הבדלים בין סביבות (למשל `chat_edit` דולק מקומית) נעשים רק במשתני `FEATURE_*`, לעולם לא בקובצי seed שונים; ניסויי PostHog (`hero_copy_v1`) אינם דגלים כאן.

**דגלי ההרחבה** (11 נוספים, **כולם `false` ב-seed**; סך הכול 24, כמו הרשימה הראשית של חלק 06 §21.1): טרנדים וצילום — `trends` · `trends_public` · `guided_filming`; Meta — `meta_connect` · `meta_ads` · `meta_lead_forms` · `meta_auto_rules`; התוספות — `landing_pages` · `meta_health_check` · `monthly_plan` · `hook_score`. **דגלי מפת הדרכים** אחרי M11 — `whatsapp_bot` · `review_videos` · `human_review` · `partners` — **לא נזרעים** ב-`feature_flags.json` עד אבן הדרך שבונה אותם (חלק 06 §21.1): `isEnabled` מחזיר `false` לדגל שאין לו שורה, ומסך הדגלים באדמין מציג אותם מתוך הקבוע `ROADMAP_FLAGS` (`lib/flags.ts`) בקבוצה נפרדת, כבויים ונעולים (חלק 03 §22). כל נתיב של דגל כבוי מחזיר 404, חוץ מהחריג של §21b.1: כיבוי `meta_ads` אחרי ההשקה עוצר רק השקות חדשות, וקמפיינים שכבר פורסמו עדיין אפשר לראות, להשהות ולסיים (חלק 06).

### 16.5 רישום המודלים והנתיבים

**`model_routes.json`** — בדיוק לפי §7.1 בנספח F, ועוד שלושת הנתיבים של ההרחבה בסוף (21 נתיבים; `llm.ads` לחלק 07, `llm.video` ו-`llm.vision_frames` לחלק 08, והמימוש של `route()` בחלק 05):

```json
[
  { "task_key": "llm.script",      "primary_slug": "anthropic/claude-sonnet-5.5", "fallback_slugs": ["openai/gpt-6.1-sol", "google/gemini-3.8-flash"], "params": { "temperature": 0.8, "structured": "json_schema_strict", "require_parameters": true } },
  { "task_key": "llm.storyboard",  "primary_slug": "anthropic/claude-sonnet-5.5", "fallback_slugs": ["openai/gpt-6.1-sol", "google/gemini-3.8-flash"], "params": { "temperature": 0.5, "structured": "json_schema_strict", "require_parameters": true } },
  { "task_key": "llm.hooks",       "primary_slug": "anthropic/claude-sonnet-5.5", "fallback_slugs": ["openai/gpt-6.1-sol", "google/gemini-3.8-flash"], "params": { "temperature": 0.9, "structured": "json_schema_strict", "require_parameters": true } },
  { "task_key": "llm.premium",     "primary_slug": "anthropic/claude-opus-5",     "fallback_slugs": ["anthropic/claude-sonnet-5.5"], "params": { "structured": "json_schema_strict", "require_parameters": true } },
  { "task_key": "llm.cheap",       "primary_slug": "google/gemini-3.8-flash",     "fallback_slugs": ["openai/gpt-6.1-sol"], "params": { "temperature": 0.2 } },
  { "task_key": "llm.batch",       "primary_slug": "google/gemini-3.8-flash:batch", "fallback_slugs": [], "params": { "batch": true } },
  { "task_key": "image.draft",     "primary_slug": "google/gemini-3.1-flash-lite-image", "fallback_slugs": ["google/gemini-3.1-flash-image"], "params": { "resolution": "1K" } },
  { "task_key": "image.standard",  "primary_slug": "google/gemini-3.1-flash-image", "fallback_slugs": ["google/gemini-3.1-flash-lite-image"], "params": { "resolution": "1K" } },
  { "task_key": "image.premium",   "primary_slug": "google/gemini-3-pro-image",   "fallback_slugs": ["google/gemini-3.1-flash-image"], "params": { "resolution": "2K" } },
  { "task_key": "video.draft",     "primary_slug": "google/veo-3.1-lite",         "fallback_slugs": ["alibaba/wan-3.0", "bytedance/seedance-2.0-fast"], "params": { "resolution": "720p", "generate_audio": false } },
  { "task_key": "video.standard",  "primary_slug": "kwaivgi/kling-v3.0-std",      "fallback_slugs": ["bytedance/seedance-2.0", "google/veo-3.1-fast"], "params": { "resolution": "720p", "generate_audio": false } },
  { "task_key": "video.premium",   "primary_slug": "google/veo-3.1",              "fallback_slugs": ["kwaivgi/kling-v3.0-pro", "google/veo-3.1-fast"], "params": { "resolution": "1080p", "generate_audio": false } },
  { "task_key": "tts.default",     "primary_slug": "elevenlabs/eleven-v4",        "fallback_slugs": ["google/gemini-3.8-flash-tts"], "params": { "language": "heb", "response_format": "mp3" } },
  { "task_key": "tts.preview",     "primary_slug": "elevenlabs/eleven-v4-turbo",  "fallback_slugs": ["google/gemini-3.8-flash-tts"], "params": { "language": "heb", "response_format": "mp3" } },
  { "task_key": "tts.alt",         "primary_slug": "google/gemini-3.8-flash-tts", "fallback_slugs": [], "params": { "response_format": "mp3" } },
  { "task_key": "stt.default",     "primary_slug": "elevenlabs/scribe-v2",        "fallback_slugs": [], "params": { "language": "he", "response_format": "verbose_json" } },
  { "task_key": "music.default",   "primary_slug": "google/lyria-3-pro-preview",  "fallback_slugs": [], "params": {} },
  { "task_key": "avatar.default",  "primary_slug": "heygen/avatar-iv",            "fallback_slugs": [], "params": {} },
  { "task_key": "llm.ads",           "primary_slug": "anthropic/claude-sonnet-5.5", "fallback_slugs": ["openai/gpt-6.1-sol", "google/gemini-3.8-flash"], "params": { "temperature": 0.7, "structured": "json_schema_strict", "require_parameters": true } },
  { "task_key": "llm.video",         "primary_slug": "google/gemini-3.8-flash",     "fallback_slugs": ["google/gemini-3.1-pro-preview"], "params": { "temperature": 0.2, "structured": "json_schema_strict", "require_parameters": true, "max_output_tokens": 4000 } },
  { "task_key": "llm.vision_frames", "primary_slug": "anthropic/claude-sonnet-5.5", "fallback_slugs": ["google/gemini-3.8-flash"], "params": { "temperature": 0.2, "structured": "json_schema_strict", "require_parameters": true } }
]
```

**`model_registry.json`** — שורה לכל slug שמופיע בנתיבים (23 שורות: 22 מההשקה ו-`google/gemini-3.1-pro-preview`, שנוסף כגיבוי של `llm.video`), `source: "manual"`, `is_enabled: true` לכל מה שבנתיבים חוץ מ-`heygen/avatar-iv` (מאחורי דגל `avatar`). מחירי הרשימה לפי §7.1 בנספח F, במבנה המנורמל של `pricing`; לדוגמה:

```json
[
  { "slug": "anthropic/claude-sonnet-5.5", "task": "llm", "display_name_he": "Claude Sonnet 5.5", "family": "anthropic", "is_enabled": true,
    "tiers": ["draft", "standard"], "pricing": { "per_m_input": 2, "per_m_output": 10 },
    "capabilities": { "structured_outputs": true }, "source": "manual", "notes_he": "ברירת המחדל לתסריטים, לסטוריבורד ולהוקים" },
  { "slug": "kwaivgi/kling-v3.0-std", "task": "video", "display_name_he": "Kling 3.0 Standard", "family": "kling", "is_enabled": true,
    "tiers": ["standard"], "pricing": { "per_second": { "720p": 0.084 } },
    "capabilities": { "supported_durations": [3, 5, 10, 15], "supported_resolutions": ["720p"], "supported_aspect_ratios": ["9:16", "1:1", "16:9"],
                      "supported_frame_images": ["first_frame"], "generate_audio": false }, "source": "manual", "notes_he": null },
  { "slug": "elevenlabs/eleven-v4", "task": "tts", "display_name_he": "ElevenLabs v4", "family": "elevenlabs", "is_enabled": true,
    "tiers": ["draft", "standard", "premium"], "pricing": { "per_m_chars": 80 },
    "capabilities": { "max_chars": 10000 }, "source": "manual", "notes_he": "עברית: heb. מחיר רשימה — ההנחה הזמנית לא נכנסת לחישוב" }
]
```

`capabilities` של מודלי הווידאו בקובץ הם ערכי פתיחה בלבד; `sync-models` (חלק 05) מעדכן אותם מ-`/videos/models` ולעולם לא מפעיל מודל לבד.

**קלט וידאו (`llm.video`):** לשורות `google/gemini-3.8-flash` ו-`google/gemini-3.1-pro-preview` יש `capabilities.video_in: true`, ו-`route("llm.video", { needsVideoInput: true })` (חלק 05) מדלג על כל מודל בלי הדגל הזה. ב-M0 בודקים את הערך מול `GET /api/v1/models` (השדה `architecture.input_modalities` [M0-verify את שם השדה]), ו-`sync-models` שומר אותו. השורה החדשה:

```json
[
  { "slug": "google/gemini-3.1-pro-preview", "task": "llm", "display_name_he": "Gemini 3.1 Pro (תצוגה מקדימה)", "family": "google", "is_enabled": true,
    "tiers": ["standard", "premium"], "pricing": { "per_m_input": 2, "per_m_output": 12 },
    "capabilities": { "structured_outputs": true, "video_in": true }, "source": "manual",
    "notes_he": "גיבוי לניתוח סרטוני השראה (llm.video). מחיר רשימה [M0-verify]" }
]
```

### קריטריוני קבלה
- [ ] `pnpm db:seed` על מסד נקי טוען 8 משפחות, 13 קטגוריות, 36 נישות, 27 סוגים, 25 עונות ו-326 הוקים; הרצה שנייה מדווחת 0 הכנסות ו-0 שינויים.
- [ ] שינוי `category_slug` של נישה ל-`nope` בקובץ גורם ל-`--dry-run` להיכשל עם הודעה שמצביעה על `niches.json[i].category_slug`, ובלי שום כתיבה.
- [ ] הוק עם `season_slug: "pesach"` מנורמל ל-`passover`; הוק עם `season_slug: "xmas"` מכשיל את הריצה.
- [ ] `{הנחה}` ו-`{בעיה}` מתקבלים כ-placeholders; `{צבע}` נכשל.
- [ ] אחרי ה-seed, `local-politics` הוא `is_active = false` ולא מופיע ב-`search_hooks`.
- [ ] עריכה של `credit_costs.credits` באדמין לא נדרסת בהרצה חוזרת של `db:seed` (בלי `--force-pricing`).
- [ ] `--fixtures` נכשל מיד כשה-URL הוא של פרויקט הפרודקשן.
- [ ] אחרי `db:seed`, ל-35 הנישות הפעילות יש `short_name_he`; ‏`short_name_he` שנערך באדמין לא נדרס בהרצה חוזרת (`fill_if_null`).
- [ ] הוק עם `"₪349"` בטקסט נכשל ב-`--dry-run`; ‏`"349 ₪"` ו-`"{מחיר} ₪"` מתקבלים.
- [ ] `app_settings` מכיל בדיוק 30 מפתחות ו-`feature_flags` בדיוק 24 (כל 11 הדגלים של ההרחבה `false`, ואין שורות לארבעת דגלי מפת הדרכים), וכל ערך עובר את הסכמה שלו ב-`lib/settings/schema.ts`.
- [ ] אחרי `db:seed`: 12 שורות ב-`trend_templates`, כולן `draft`, ו-`fake-system-popup` עם `ad_safety = 'organic_only'` ו-`recommended_ad_goal` ריק; 21 שורות ב-`model_routes` ו-23 ב-`model_registry`; `credit_costs` כולל את כל `REQUIRED_ACTION_KEYS`, ו-`landing.generate` = 10.
- [ ] שינוי `niche_slug` של התאמת נישה בתבנית טרנד ל-`nope` מכשיל את `--dry-run` עם הודעה שמצביעה על `trend_templates.json[i]`; תבנית עם 2 גרסאות הוק בלבד נכשלת.
- [ ] `pnpm db:seed --studio` פעמיים יוצר סביבת `ws-trends-studio` אחת והענקה אחת לחודש; בלי מנהל פלטפורמה הוא נכשל בהודעה ברורה.
- [ ] כל ארבע התוכניות ב-`plans.json` עוברות את `LimitsSchema` עם עשרת המפתחות החדשים, ו-`landing_pages` של `free` הוא 0 (החריג של `has_paid` מחושב בקוד, לא ב-seed).

---

## §17. לקוחות Supabase ב-Next.js 16, `proxy.ts` וטיפוסים

### 17.1 ארבעה לקוחות, ומתי משתמשים בכל אחד

| קובץ | פונקציה | מפתח | Session | איפה מותר | שימוש |
|---|---|---|---|---|---|
| `lib/supabase/server.ts` | `createClient()` | publishable | עוגיות (`@supabase/ssr`) | Server Components, Server Actions, Route Handlers | כל קריאה "בשם המשתמש" — RLS אוכף |
| `lib/supabase/browser.ts` | `createClient()` | publishable | עוגיות (דפדפן) | Client Components | Realtime, העלאות TUS, קריאות קלות שמוגנות ב-RLS |
| `lib/supabase/admin.ts` | `createAdminClient()` | **secret** | אין | רק קוד `server-only`: Route Handlers אחרי בדיקת הרשאה, webhooks, cron, workflows, seed | כתיבות כספיות, צנרת, מנוע הקרדיטים, כתובות חתומות |
| `lib/supabase/static.ts` | `createStaticClient()` | publishable | אין (בלי `cookies()`) | דפי שיווק SSG/ISR (`lib/marketing/queries.ts`) | קריאת הקטלוג הציבורי כ-`anon` בלי להפוך את הדף לדינמי |

**`NEXT_PUBLIC_SUPABASE_URL`** יכול להיות `https://<project-ref>.supabase.co` או הדומיין המותאם (`https://auth.{{DOMAIN}}`, §1.2). אף קובץ לא מקודד את המארח: ארבעת הלקוחות, `publicMediaUrl()` (§13.4), ה-CSP (`buildCsp`: ‏`https://<host>` ו-`wss://<host>` ב-`img-src`, ‏`media-src`, ‏`connect-src`) ו-`images.remotePatterns` ב-`next.config` גוזרים אותו מהמשתנה הזה.

**כלל ברזל:** `admin.ts` מייבא `"server-only"` ונבדק ב-ESLint (`no-restricted-imports` מכל קובץ תחת `components/` או קובץ עם `"use client"`). שימוש בלקוח הסודי מותר רק **אחרי** שהקוד בדק הרשאה במפורש (`requireRole`, אימות חתימה או `CRON_SECRET`).

### 17.2 קוד

```ts
// lib/supabase/server.ts
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { env } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Component render: proxy.ts already refreshed the session */ }
      },
    },
  });
}
export type ServerSupabase = Awaited<ReturnType<typeof createClient>>;
```

```ts
// lib/supabase/browser.ts
"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;
export function createClient() {
  client ??= createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  return client;
}
```

```ts
// lib/supabase/admin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { env } from "@/lib/env";

let admin: ReturnType<typeof createClient<Database>> | undefined;
export function createAdminClient() {
  admin ??= createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "x-client-info": `${env.OPENROUTER_APP_TITLE}-server` } },
  });
  return admin;
}
// [M0-verify] the installed @supabase/supabase-js sends an sb_secret_ key as `apikey` (not as a Bearer JWT) and PostgREST maps it to service_role.
```

```ts
// lib/supabase/static.ts — no cookies(), safe inside generateStaticParams / ISR
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { env } from "@/lib/env";

export function createStaticClient() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
```

```ts
// lib/supabase/proxy.ts — session refresh + coarse gating (fine-grained checks live in routes and layouts)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/** requestHeaders: a copy of the request headers that may carry x-nonce / content-security-policy (proxy.ts) */
export async function updateSession(request: NextRequest, requestHeaders: Headers = new Headers(request.headers)) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          requestHeaders.set("cookie", request.headers.get("cookie") ?? "");   // keep the copy in sync with the refreshed session
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

  // Do not run any code between createServerClient and getClaims(): it refreshes an expired session.
  const { data } = await supabase.auth.getClaims();          // [M0-verify] fallback: supabase.auth.getUser()
  const userId = (data?.claims?.sub as string | undefined) ?? null;
  const { pathname, search } = request.nextUrl;

  const withCookies = (res: NextResponse) => { response.cookies.getAll().forEach((c) => res.cookies.set(c)); return res; };
  const notFound = () => withCookies(NextResponse.rewrite(new URL("/__not-found", request.url)));   // renders app/not-found.tsx (404)

  if (!userId && (pathname.startsWith("/app") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return withCookies(NextResponse.redirect(url));
  }
  if (userId && pathname.startsWith("/admin")) {
    const { data: status } = await supabase.rpc("platform_admin_status");      // 'none' | 'needs_mfa' | 'ok' (§9.2)
    if (status !== "ok" && status !== "needs_mfa") return notFound();          // not an admin: the panel does not exist
    if (status === "needs_mfa" && !pathname.startsWith("/admin/mfa")) {        // admin without aal2 → enroll / verify TOTP
      const url = request.nextUrl.clone();
      url.pathname = "/admin/mfa";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return withCookies(NextResponse.redirect(url));
    }
  }
  if (userId && pathname === "/login" && !request.nextUrl.searchParams.has("invite")) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/") && !next.startsWith("//") ? next.split("?")[0] : "/app";
    url.search = next && next.includes("?") ? next.slice(next.indexOf("?")) : "";
    return withCookies(NextResponse.redirect(url));
  }
  return response;
}
```

```ts
// proxy.ts (repo root) — Next.js 16 replaces middleware.ts; the exported function is `proxy`, on the Node.js runtime
import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { marketingExperiments } from "@/lib/seo/experiments";       // part 02: hero A/B rewrite for "/" only, no Supabase
import { buildCsp } from "@/lib/security/csp";                       // part 06 §15.3
import { THEME_SCRIPT_SOURCE } from "@/components/a11y/theme-script"; // part 01 §6.2
import { env } from "@/lib/env";

const THEME_HASH = `sha256-${createHash("sha256").update(THEME_SCRIPT_SOURCE).digest("base64")}`;
// dynamic routes get a per-request nonce; static marketing pages keep the hash-based CSP of next.config.ts
const NONCE_ROUTES = /^\/(app|admin|login|auth|v|approve|unsubscribe)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dev/") && env.APP_ENV === "production") {
    return NextResponse.rewrite(new URL("/__not-found", request.url));     // dev-only pages never exist in production (404)
  }
  if (pathname === "/") return marketingExperiments(request);          // rewrite to /exp/hero/[variant] only when cookie exp_hero exists

  const requestHeaders = new Headers(request.headers);
  let csp: string | null = null;
  if (NONCE_ROUTES.test(pathname)) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    // pathname: part 06 §15.3 adds frame-src https://www.facebook.com only on the campaign builder (Meta ad previews)
    csp = buildCsp({ nonce, themeHash: THEME_HASH, env: env.APP_ENV, pathname });
    requestHeaders.set("x-nonce", nonce);                              // read by layouts via headers() (part 06 §15.3)
    requestHeaders.set("content-security-policy", csp);                // lets Next.js put the nonce on its own scripts
  }
  const response = await updateSession(request, requestHeaders);
  // first production week: the same value goes into Content-Security-Policy-Report-Only instead (part 06 §15.3)
  if (csp) response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/",
    "/app/:path*",
    "/admin/:path*",
    "/login",
    "/auth/:path*",
    "/v/:path*",
    "/approve/:path*",
    "/unsubscribe",
    "/dev/:path*",
    // API: every route except webhooks, cron, the public hooks search, Supabase Auth hooks and the health check
    "/api/((?!webhooks/|cron/|hooks/search|auth/hooks/|health).*)",
  ],
};
```

**מה ה-proxy עושה, לפי הסדר:**
1. `/dev/*` ← ‏404 כש-`APP_ENV === "production"` (בנוסף לשומר בזמן build בדפים עצמם; חלק 06 §8.3).
2. `/` ← `marketingExperiments` בלבד: rewrite ל-`/exp/hero/[variant]` רק כשקיימת עוגיית `exp_hero` (חלק 02). אין שם Supabase ואין nonce.
3. **CSP עם nonce** לנתיבים הדינמיים (`/app`, ‏`/admin`, ‏`/login`, ‏`/auth/*`, ‏`/v/*`, ‏`/approve/*`, ‏`/unsubscribe`): nonce חדש לכל בקשה בכותרת `x-nonce`, וכותרת ה-CSP מ-`buildCsp` (חלק 06 §15.3). דפי השיווק הסטטיים מקבלים CSP מבוסס hash מ-`next.config.ts` (`staticCspHeaders`, חלק 06 §15.3; ה-hash של `THEME_SCRIPT_SOURCE` בשני הענפים; ההתנהגות מול סקריפטי ה-inline של Next [M0-verify ספייק 16]).
4. **`/admin*`**: ‏`platform_admin_status()` = `none` ← rewrite ל-404; ‏`needs_mfa` ← הפניה ל-`/admin/mfa?next=…` (חוץ מכשכבר נמצאים ב-`/admin/mfa`); ‏`ok` ← ממשיכים. הדף `/admin/mfa` (חלק 06 §15.4) נגיש ברמת `aal1`, רושם או מאמת TOTP (`mfa.enroll` / `challenge` / `verify`) ומפנה ל-`next` או ל-`/admin`.
5. רענון ה-session, הפניה ל-`/login` כשאין משתמש ב-`/app` או ב-`/admin`, והפניה מ-`/login` למשתמש מחובר.

- דפי השיווק (חוץ מ-`/`) לא עוברים ב-proxy בכלל, כדי לא להוסיף זמן ל-TTFB ולא לגעת ב-ISR. הכותרת השיווקית מציגה "התחברות"/אווטאר לפי בדיקה בצד הלקוח.
- `GET /api/health` לא עובר ב-proxy (§21.5), וגם לא `/.well-known/workflow/*` (נוצר על ידי `withWorkflow`).
- ה-proxy הוא שכבה גסה. כל Route Handler בודק שוב משתמש, סביבה ותפקיד (§18.4), ו-`app/(admin)/admin/layout.tsx` קורא ל-`platform_admin_status()` ומחזיר `notFound()` לכל ערך שאינו `ok` (חוץ מהדף `/admin/mfa`, שיש לו layout משלו).
- **נתיבי ההרחבה:**
  - `/api/webhooks/meta`, `/api/webhooks/meta/deauthorize` ו-`/api/webhooks/meta/data-deletion` כבר מחוץ ל-matcher (התבנית `webhooks/`). הם קוראים את הגוף הגולמי בעצמם (§22.1), בלי עטיפת Zod על הגוף ובלי בדיקת Origin.
  - `/meta/data-deletion` (דף הסטטוס הציבורי של בקשת מחיקה, `noindex`, חלק 02), `/trends` ו-`/trends/[slug]` (חלק 02), `/b/[slug]` ו-`/b/[slug]/privacy` (דף העסק, חלק 07) הם דפים ציבוריים ב-ISR. הם לא נכנסים ל-matcher ומקבלים את ה-CSP מבוסס ה-hash, כמו שאר דפי השיווק.
  - `POST /api/b/[slug]/lead` עובר ב-proxy כמו כל `/api` (רענון session לא מזיק לבקשה אנונימית). הטופס נשלח מאותו origin, ולכן בדיקת ה-Origin של העטיפה עוברת.
  - `/api/meta/connect/callback` הוא `GET` שחוזר מ-Facebook: אין בו בדיקת Origin, ובמקומה העוגייה החתומה `meta_oauth_state` (`Path=/api/meta/connect`, 10 דקות; חלק 07) והשוואת `state` ב-timing-safe.
  - `/dev/mock-meta-login` נופל תחת הכלל של `/dev/*`, ולכן מחזיר 404 בפרודקשן.

### 17.3 סביבת העבודה הנוכחית (`lib/workspace/current.ts`)

```ts
import "server-only";
export type CurrentWorkspace = {
  id: string; type: Enums<"workspace_type">; role: Enums<"member_role">;
  billingWorkspaceId: string; plan: Tables<"plans">; name: string;
};
/**
 * 1) cookie `ws` (uuid) → effective_role(ws) via the user client; null → ignore the cookie
 * 2) profiles.last_workspace_id → same check
 * 3) first membership by role, then created_at
 * Throws ApiError("FORBIDDEN") when the user has no workspace at all (should never happen after handle_new_user).
 * Resource routes (/api/projects/[id]/…) never use this: they derive the workspace from the resource row.
 */
export async function getCurrentWorkspace(supabase: ServerSupabase): Promise<CurrentWorkspace>;

/** Server Action used by WorkspaceSwitcher */
export async function switchWorkspace(workspaceId: string): Promise<void>; // validates access, sets cookie, updates profiles.last_workspace_id
```

עוגיית `ws`: `httpOnly`, `secure`, `sameSite: "lax"`, `path: "/"`, תוקף שנה. היא לא סוד — רק העדפה; ההרשאה תמיד נבדקת מול `effective_role`.

### 17.4 טיפוסים מחוללים

```bash
pnpm db:types   # supabase gen types typescript --local --schema public > lib/supabase/database.types.ts
```

```ts
// lib/supabase/enums.ts — the only import point for DB types and enum values
export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from "./database.types";
export { Constants } from "./database.types";
export const ENUMS = Constants.public.Enums;        // e.g. z.enum(ENUMS.job_status)
export type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
```

- `Constants` (מערכי הערכים של כל enum) מחולל על ידי ה-CLI בגרסאות הנוכחיות [M0-verify]; אם הוא חסר, `scripts/gen-enum-constants.ts` מייצר אותו מ-`pg_enum` אחרי `db:types`. בשום מקרה לא כותבים את המערכים ידנית.
- עמודות `jsonb` מוקלדות כ-`Json`; הקוד מפענח אותן תמיד דרך סכמת Zod (`ScriptV1`, `StoryboardV1`, `CaptionTrackV1`, `BrandProfileV1`, `PlanLimits`, `ProjectBrief`, `RenderOptions`, `NotificationPrefs`, ומההרחבה גם `HookScoreV1`, `SceneOverlayV1` ושאר הסכמות של חלקים 07 ו-08), ולא ב-cast. ערך שמור שלא עובר את הסכמה (למשל אחרי כתיבה ישירה דרך PostgREST) מטופל כאילו הוא ריק ונרשם בלוג — הוא לא מגיע לרינדור.

### קריטריוני קבלה
- [ ] `grep -r "SUPABASE_SECRET_KEY" components app --include=*.tsx` לא מוצא כלום; build שמייבא את `lib/supabase/admin.ts` מקומפוננטת לקוח נכשל.
- [ ] משתמש לא מחובר שנכנס ל-`/app/projects` מופנה ל-`/login?next=%2Fapp%2Fprojects`; משתמש רגיל שנכנס ל-`/admin` מקבל 404.
- [ ] מנהל פלטפורמה ב-session של `aal1` שנכנס ל-`/admin/jobs` מופנה ל-`/admin/mfa?next=%2Fadmin%2Fjobs`; אחרי אימות TOTP הוא מגיע ל-`/admin/jobs`.
- [ ] בפרודקשן `/dev/mock-gateway/x` ו-`/dev/mock-meta-login` מחזירים 404; ב-preview הם נטענים.
- [ ] בקשת `POST /api/webhooks/meta` לא עוברת ב-proxy (אין עוגיית session בתשובה), ו-`/b/[slug]` נבנה כ-ISR בלי nonce.
- [ ] לתשובה של `/app` יש `Content-Security-Policy` עם `nonce-…` ששונה בין שתי בקשות; ל-`/pricing` אין nonce והדף נשאר ISR; ‏`GET /api/health` לא עובר ב-proxy (אין עוגיית session מתרעננת בתשובה).
- [ ] session שפג תוקפו מתרענן בגלישה ל-`/app` בלי התחברות מחדש (refresh token).
- [ ] דף `/hooks/[niche]` נבנה סטטית (`○`/`●` בפלט ה-build) גם כשהוא קורא מ-Supabase דרך `createStaticClient()`.
- [ ] עוגיית `ws` עם מזהה של סביבה שהמשתמש לא חבר בה מתעלמת ומחזירה את סביבת ברירת המחדל.

---

## §18. מוסכמות ה-API: שגיאות, עטיפת Route, הרשאות, הגבלות קצב ואידמפוטנטיות

### 18.1 כללים

- כל Route Handler נמצא תחת `app/api/**/route.ts`, רץ ב-Node.js (`export const runtime = "nodejs"`, ‏`preferredRegion = "fra1"`), ונבנה רק דרך העטיפה `route()` (18.4). אין handler "חשוף".
- **גוף בקשה:** JSON בלבד (`content-type: application/json`), מקסימום 64KB, מאומת ב-Zod. מפתחות בבקשות ב-camelCase (כמו בנספח F). **שני החריגים היחידים:** `POST /api/admin/billing/payments/[id]/invoice` (‏`multipart/form-data`, קובץ PDF עד 4MB — מתחת למגבלת הגוף של Vercel, 4.5MB, חלק 06 §9.5, §19.6; §24.1), וה-webhooks (גוף גולמי עד 1MB, §22.1).
- **תשובות:** מעטפת ב-camelCase (`{ projectId }`, `{ job, steps, scenes }`, `{ url, expiresAt }`); אובייקטי ישויות (DTO) בשמות העמודות של המסד (snake_case), כדי שיתמזגו ישירות עם payload-ים של Realtime ועם הטיפוסים המחוללים. JSON Schemas קנוניים (`ScriptV1`, `StoryboardV1`, `HookBatchV1`, `CaptionTrackV1`, `BrandProfileV1`) נשארים כמו שהם.
- **שגיאה:** תמיד `{ error: { code, message_he, details? } }` עם סטטוס HTTP מהטבלה ב-18.2. ‏`message_he` הוא גיבוי (מיילים, לוגים, קליינט בלי מפתח); הממשק מציג את `errors.{code}` מ-`messages/he.json` (חלק 03 §1.4).
- **כותרות בכל תשובה:** `x-request-id` (uuid), ‏`cache-control: no-store` (חוץ מ-`GET /api/hooks/search`, ‏18.6).
- **Server Actions** משמשות רק לשמירות טפסים פשוטות (§24.2). כל מה שזורם, מוציא קרדיטים, נקרא מ-webhook או מ-cron — Route Handler.

### 18.2 קודי שגיאה (`lib/errors.ts`)

```ts
export const ERROR_CODES = [
  "INSUFFICIENT_CREDITS", "PLAN_LIMIT", "CONCURRENCY_LIMIT", "RATE_LIMITED", "MODERATION_BLOCKED",
  "ELECTION_POLICY_BLOCKED", "MISSING_FACTS", "PROVIDER_UNAVAILABLE", "PROVIDER_TIMEOUT", "VIDEO_JOB_FAILED",
  "TTS_FAILED", "RENDER_FAILED", "BUDGET_GUARD", "INVALID_INPUT", "NOT_FOUND", "FORBIDDEN", "PAYMENT_FAILED",
  "WEBHOOK_INVALID_SIGNATURE", "MAINTENANCE",
  // added by parts 03/04 (same convention)
  "UNAUTHENTICATED", "EDIT_CONFLICT", "INTERNAL_ERROR",
  // 2026-10-17 extension (parts 07/08): Meta connection, campaigns and organic publishing
  "META_NOT_CONNECTED", "META_ACCOUNT_NOT_READY", "META_API_ERROR", "AD_NOT_ELIGIBLE", "SOCIAL_PUBLISH_FAILED",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export const ERROR_STATUS: Record<ErrorCode, number> = {
  INSUFFICIENT_CREDITS: 402, PLAN_LIMIT: 403, CONCURRENCY_LIMIT: 409, RATE_LIMITED: 429, MODERATION_BLOCKED: 422,
  ELECTION_POLICY_BLOCKED: 451, MISSING_FACTS: 422, PROVIDER_UNAVAILABLE: 503, PROVIDER_TIMEOUT: 504,
  VIDEO_JOB_FAILED: 502, TTS_FAILED: 502, RENDER_FAILED: 502, BUDGET_GUARD: 503, INVALID_INPUT: 400,
  NOT_FOUND: 404, FORBIDDEN: 403, PAYMENT_FAILED: 402, WEBHOOK_INVALID_SIGNATURE: 401, MAINTENANCE: 503,
  UNAUTHENTICATED: 401, EDIT_CONFLICT: 409, INTERNAL_ERROR: 500,
  META_NOT_CONNECTED: 409, META_ACCOUNT_NOT_READY: 409, META_API_ERROR: 502, AD_NOT_ELIGIBLE: 422, SOCIAL_PUBLISH_FAILED: 502,
};

/** server-side Hebrew fallback; the UI shows errors.{code}.title/body from messages/he.json */
export const ERROR_MESSAGE_HE: Record<ErrorCode, string> = {
  INSUFFICIENT_CREDITS: "אין מספיק קרדיטים לפעולה הזו. לא בוצע חיוב.",
  PLAN_LIMIT: "התוכנית הנוכחית לא כוללת את האפשרות הזו.",
  CONCURRENCY_LIMIT: "כבר רצות יצירות במקביל עד המכסה של התוכנית. לא בוצע חיוב.",
  RATE_LIMITED: "היו יותר מדי בקשות בזמן קצר. אפשר לנסות שוב בעוד רגע.",
  MODERATION_BLOCKED: "אי אפשר ליצור את התוכן הזה לפי מדיניות השימוש ב-AI. לא בוצע חיוב.",
  ELECTION_POLICY_BLOCKED: "תוכן פוליטי חסום בתקופת הבחירות. לא בוצע חיוב.",
  MISSING_FACTS: "חסרים נתונים אמיתיים שצריך למלא או להסיר לפני היצירה.",
  PROVIDER_UNAVAILABLE: "מנוע ה-AI לא זמין כרגע. לא בוצע חיוב. אפשר לנסות שוב בעוד כמה דקות.",
  PROVIDER_TIMEOUT: "היצירה לקחה יותר מדי זמן ונעצרה. הקרדיטים חזרו ליתרה.",
  VIDEO_JOB_FAILED: "לא הצלחנו ליצור את הסרטון. הקרדיטים חזרו ליתרה.",
  TTS_FAILED: "לא הצלחנו להקליט את הקריינות. הקרדיטים חזרו ליתרה.",
  RENDER_FAILED: "ההרכבה נכשלה. הקרדיטים חזרו ליתרה.",
  BUDGET_GUARD: "בשעות הקרובות לא מתחילים יצירות חדשות. לא בוצע חיוב, והעבודה נשמרה.",
  INVALID_INPUT: "חלק מהפרטים לא תקינים.",
  NOT_FOUND: "הפריט המבוקש לא נמצא.",
  FORBIDDEN: "אין הרשאה לפעולה הזו.",
  PAYMENT_FAILED: "התשלום לא עבר. לא בוצע חיוב.",
  WEBHOOK_INVALID_SIGNATURE: "חתימת ה-webhook לא תקינה.",
  MAINTENANCE: "המערכת בתחזוקה קצרה. העבודה נשמרה.",
  UNAUTHENTICATED: "צריך להתחבר כדי להמשיך.",
  EDIT_CONFLICT: "התוכן השתנה בזמן העריכה. כדאי לטעון מחדש כדי לראות את הגרסה העדכנית.",
  INTERNAL_ERROR: "משהו השתבש אצלנו. לא בוצע חיוב על הפעולה הזו.",
  META_NOT_CONNECTED: "אין חיבור פעיל לפייסבוק ולאינסטגרם. אפשר לחבר את החשבון בהגדרות, תחת אינטגרציות.",
  META_ACCOUNT_NOT_READY: "חשבון המודעות עדיין לא מוכן לקמפיין. צריך להשלים כמה פרטים לפני הפרסום.",
  META_API_ERROR: "מטא החזירה שגיאה, והפעולה לא הושלמה.",
  AD_NOT_ELIGIBLE: "הסרטון הזה לא מתאים למודעה במטא כמו שהוא. אפשר לתקן לפי ההסבר, או להשתמש בו בפרסום רגיל.",
  SOCIAL_PUBLISH_FAILED: "הפרסום באינסטגרם או בפייסבוק לא הושלם. הסרטון נשמר, ואפשר לנסות שוב.",
};

export class ApiError extends Error {
  constructor(public code: ErrorCode, public details?: Record<string, unknown>, message?: string) {
    super(message ?? code);
  }
}

/** maps a PostgREST/RPC error raised by public.raise_app_error() (SQLSTATE P0001, message = code, detail = JSON) */
export function fromDbError(e: { code?: string; message?: string; details?: string | null }): ApiError {
  if (e.code === "P0001" && e.message && (ERROR_CODES as readonly string[]).includes(e.message)) {
    let details: Record<string, unknown> | undefined;
    try { details = e.details ? JSON.parse(e.details) : undefined; } catch { details = undefined; }
    return new ApiError(e.message as ErrorCode, details);
  }
  if (e.code === "23505") return new ApiError("EDIT_CONFLICT", { reason: "duplicate" });
  if (e.code === "42501" || e.code === "PGRST301") return new ApiError("FORBIDDEN");
  if (e.code === "PGRST116") return new ApiError("NOT_FOUND");
  return new ApiError("INTERNAL_ERROR", undefined, e.message);
}
```

**27 קודים בדיוק** = 19 הקודים של §12.10 בנספח F, ועוד `UNAUTHENTICATED`, `EDIT_CONFLICT` ו-`INTERNAL_ERROR`, ועוד חמשת הקודים של הרחבת 2026-10-17 (`META_NOT_CONNECTED`, `META_ACCOUNT_NOT_READY`, `META_API_ERROR`, `AD_NOT_ELIGIBLE`, `SOCIAL_PUBLISH_FAILED`). אסור להחזיר ב-`error.code` שום קוד אחר. הסטטוס תמיד נלקח מ-`ERROR_STATUS` — לקוד יש סטטוס אחד בלבד (למשל `INVALID_INPUT` הוא תמיד 400, גם בכללים עסקיים).

**`details` לפי קוד** (חוזה עם חלק 03; הטקסטים לכל `reason`/`scope`/`limit` ב-`messages/he.json → errors.*`): `INSUFFICIENT_CREDITS` ← `{ needed, balance }` · `PLAN_LIMIT` ← `{ limit, max?, required?, cap?, used?, reason? }` (`limit` = מפתח של `plans.limits`; ‏`reason: "client_workspace_read_only"` יחד עם `limit: "client_workspaces"`) · `CONCURRENCY_LIMIT` ← `{ max, running }` · `RATE_LIMITED` ← `{ scope, retryAfter }` (שניות; גם בכותרת `Retry-After`; ‏`daily_credit_cap` מחזיר `PLAN_LIMIT`, לא את הקוד הזה) · `MODERATION_BLOCKED` ← `{ reason_he, categories }` · `ELECTION_POLICY_BLOCKED` ← `{ until }` · `MISSING_FACTS` ← `{ facts: string[] }` (תוויות בעברית) · `PROVIDER_UNAVAILABLE` ← `{ refunded? }` (קרדיטים שהוחזרו) · `INVALID_INPUT` ← `{ issues: [{ path, key, params }] }` או `{ reason, … }` · `FORBIDDEN` ← `{ requiredRoles }` או `{ reason }` · `EDIT_CONFLICT` ← `{ reason: "stale" | "version_locked" | "duplicate" | "request_in_progress", currentUpdatedAt? }` (‏`request_in_progress` מטופל אוטומטית ב-`lib/api/client.ts` בניסיון חוזר; אם הוא מגיע לממשק מוצג הטקסט הכללי של `errors.EDIT_CONFLICT`) · `PAYMENT_FAILED` ← `{ providerMessage? }` · `MAINTENANCE` ← `{ until, scope?: "checkout" }` · `INTERNAL_ERROR` ← `{ requestId }`.

**הקודים של ההרחבה** (הקופי לכל `reason`/`check` בחלק 03; ההקשר בחלקים 07 ו-08):

| קוד | סטטוס | `details` | מתי |
|---|---|---|---|
| `META_NOT_CONNECTED` | 409 | `{ reason: "no_connection" \| "no_assets" \| "needs_reconnect" \| "missing_permission" }` | כל נתיב של Meta, קמפיינים, פרסום רגיל ובדיקת דופק כשאין חיבור חי או שלא נבחרו נכסים (§21b.1) |
| `META_ACCOUNT_NOT_READY` | 409 | `{ checks: ("account_disabled" \| "currency_not_ils" \| "no_payment_method" \| "page_no_advertise_task" \| "ig_not_linked" \| "whatsapp_not_confirmed" \| "privacy_url_missing" \| "leads_access" \| "lead_terms_not_accepted" \| "min_budget_unknown")[] }` | הכנה, פרסום וחידוש של קמפיין כשבדיקת המוכנות (`MetaPreflightV1`) נכשלה; `checks` מכיל רק את הבדיקות שנכשלו |
| `META_API_ERROR` | 502 | `{ metaCode, metaSubcode?, retryable, userMessageHe? }` | Meta החזירה שגיאה שלא ממופה לקוד אחר; `retryable: true` אחרי שלושה ניסיונות חוזרים שנכשלו (חלק 07). לעולם לא כולל טוקן, `appsecret_proof` או גוף בקשה |
| `AD_NOT_ELIGIBLE` | 422 | `{ reason: "organic_only_template" \| "deceptive_ui" \| "missing_consent" \| "needs_ai_label" \| "music_not_licensed" \| "political" \| "special_category" \| "video_spec" \| "no_render_9x16" }` | שער הבטיחות של המודעה, לפני כל קריאה ל-Meta |
| `SOCIAL_PUBLISH_FAILED` | 502 | `{ platform: "instagram" \| "facebook", metaCode?, subcode? }` | פרסום רגיל נכשל. נשמר בעיקר ב-`social_posts.error_code` ומגיע לממשק דרך `social_post.updated` (§14.1); כשהוא חוזר בתשובת HTTP — בסטטוס שבטבלה |

**הרחבות לקודים קיימים:**
- `PLAN_LIMIT.limit` מקבל גם את עשרת מפתחות ה-`limits` של ההרחבה (§16.4). ב-`meta_monthly_spend_cap_ils` מגיעים גם `cap` ו-`used` (שקלים עשרוניים); ב-`landing_pages` של סביבה חינמית שלא רכשה חבילה `{ max: 0, required: "starter" }` (אחרי רכישת חבילה המכסה היא 1, ואז `{ max: 1, required: "starter" }`).
- `RATE_LIMITED.scope` מקבל את ה-buckets החדשים של §18.6, ועוד ארבע מגבלות עסקיות שאינן bucket: `meta_budget` (יותר מ-3 שינויי תקציב בשעה לקמפיין), `meta_account` (Meta עצרה זמנית את התור של חשבון המודעות), `ig_publish_daily`, `fb_reels_daily`.
- `NOT_FOUND` ← גם `{ reason: "retired" }` (תבנית טרנד שהוצאה משימוש). נתיב של דגל כבוי מחזיר `NOT_FOUND` בלי `details`, כמו נתיבי ה-WhatsApp של v2 (§21.1).
- `BUDGET_GUARD` ← גם `{ scope: "trend_analysis_limits" }` (ניתוח טרנד מהאדמין מעל `app_settings.trend_analysis_limits`).
- `INVALID_INPUT.reason` מקבל את הערכים שבעמודת השגיאות של §21b ושל §19.2 (#1, #24).

**חריגות פנימיות של בסיס הנתונים אינן קודי API.** ‏`LEDGER_BALANCE_MISMATCH` ו-`AUDIT_LOG_IMMUTABLE` נזרקות עם `P0001` אבל אינן ב-`ERROR_CODES`, ולכן `fromDbError` ממפה אותן ל-`INTERNAL_ERROR` (ההודעה המקורית נשלחת ל-Sentry). גם קודי השגיאה הפנימיים של לקוח OpenRouter (`OrErrorCode`: ‏`bad_request`, ‏`timeout`, ‏`upstream_error`…) ממופים לקודי API לפי חלק 05 §2.3.

`VIDEO_JOB_FAILED`, ‏`TTS_FAILED`, ‏`RENDER_FAILED` ו-`PROVIDER_TIMEOUT` נשמרים בעיקר ב-`jobs.error_code` ומגיעים לממשק דרך Realtime או `GET /api/jobs/[id]`; כשהם חוזרים בתשובת HTTP — בסטטוס שבטבלה.

### 18.3 הודעות ולידציה בעברית (`lib/validation/zod-he.ts`)

```ts
import { z } from "zod/v4";
// keys live in messages/he.json -> errors.validation.*; the server also renders the Hebrew text for message_he
export const VALIDATION_HE = {
  required: "זה שדה חובה",
  invalid_type: "הערך לא תקין",
  too_small_string: "מספר התווים המינימלי הוא {min}",
  too_big_string: "מספר התווים המקסימלי הוא {max}",
  too_small_array: "צריך לבחור לפחות {min}",
  too_big_array: "אפשר לבחור עד {max}",
  too_small_number: "הערך המינימלי הוא {min}",
  too_big_number: "הערך המקסימלי הוא {max}",
  invalid_email: "כתובת המייל לא תקינה",
  invalid_url: "הקישור לא תקין. אפשר להעתיק אותו מהדפדפן, כולל https://",
  invalid_uuid: "מזהה לא תקין",
  invalid_enum: "צריך לבחור אחת מהאפשרויות",
  invalid_phone: "מספר הטלפון לא תקין. לדוגמה: 050-1234567",
  invalid_vat_id: "המספר לא תקין. צריך 9 ספרות, כולל ספרת ביקורת",
  invalid_date: "התאריך לא תקין",
  unrecognized_keys: "נשלחו שדות לא מוכרים",
  custom: "הערך לא תקין",
} as const;
export type ValidationKey = keyof typeof VALIDATION_HE;

export function issueKey(iss: z.core.$ZodIssue): { key: ValidationKey; params: Record<string, unknown> } {
  switch (iss.code) {
    case "invalid_type": return { key: iss.input === undefined ? "required" : "invalid_type", params: {} };
    case "too_small": return { key: iss.origin === "array" || iss.origin === "set" ? "too_small_array"
                                   : iss.origin === "string" ? "too_small_string" : "too_small_number", params: { min: iss.minimum } };
    case "too_big": return { key: iss.origin === "array" || iss.origin === "set" ? "too_big_array"
                                 : iss.origin === "string" ? "too_big_string" : "too_big_number", params: { max: iss.maximum } };
    case "invalid_format": return { key: iss.format === "email" ? "invalid_email" : iss.format === "url" ? "invalid_url"
                                        : iss.format === "uuid" ? "invalid_uuid" : "custom", params: {} };
    case "invalid_value": return { key: "invalid_enum", params: {} };
    case "unrecognized_keys": return { key: "unrecognized_keys", params: { keys: iss.keys } };
    case "custom": return { key: ((iss.params as { key?: ValidationKey } | undefined)?.key) ?? "custom", params: {} };
    default: return { key: "custom", params: {} };
  }
}
export const formatHe = (k: ValidationKey, p: Record<string, unknown>) =>
  VALIDATION_HE[k].replace(/\{(\w+)\}/g, (_, n) => String(p[n] ?? ""));
z.config({ customError: (iss) => { const { key, params } = issueKey(iss as z.core.$ZodIssue); return formatHe(key, params); } });
```

ולידטורים ישראליים משותפים (`lib/validation/il.ts`): `IsraeliPhone` (מנרמל ל-`+9725XXXXXXXX`, מקבל `050-1234567`, `0501234567`, `+972 50 123 4567`; שגיאה `invalid_phone`), ‏`IsraeliId` (‏9 ספרות עם ספרת ביקורת Luhn ישראלית; שגיאה `invalid_vat_id`), ‏`HttpUrl` (‏http/https בלבד, בלי פורט לא סטנדרטי, עד 2048 תווים; מוסיף `https://` כשחסר).

### 18.4 עטיפת ה-Route (`lib/api/route.ts`)

```ts
import "server-only";
export type AuthLevel =
  | "public"          // no session needed (rate-limited by IP)
  | "user"            // any signed-in user
  | "member"          // any role in the resolved workspace
  | "editor"          // owner | admin | editor
  | "owner_admin"     // owner | admin
  | "owner"           // owner only
  | "platform_admin"  // platform_admin_status() = 'ok' (profile flag + aal2 session, §9.2)
  | "cron"            // Authorization: Bearer CRON_SECRET
  | "signed";         // webhooks: the handler verifies the signature itself

type WorkspaceFrom = "none" | "cookie" | { resource: "project" | "job" | "asset" | "share_link"; param: string };

export interface RouteSpec<B extends z.ZodType, Q extends z.ZodType> {
  id: RouteId;                         // e.g. "projects.generate" — used for logs, rate limits, idempotency scope
  auth: AuthLevel;
  workspace?: WorkspaceFrom;           // default: "none" for public/user/cron/signed, "cookie" otherwise
  body?: B; query?: Q;
  maxBodyBytes?: number;               // default 65_536
  rateLimit?: RateRule[];              // §18.6
  idempotency?: "required" | "none";   // §18.7
  allowDuringMaintenance?: boolean;    // reads, webhooks, cron, billing cancel/resume, account — never checkout
  handler: (ctx: RouteCtx<z.infer<B>, z.infer<Q>>) => Promise<Response>;
}

export interface RouteCtx<B, Q> {
  req: NextRequest; requestId: string; params: Record<string, string>;
  body: B; query: Q;
  user: { id: string; email: string | null } | null;
  supabase: ServerSupabase;            // user-scoped (RLS)
  admin: () => AdminSupabase;          // secret key — only after authorization succeeded
  ws: { id: string; role: MemberRole; billingWorkspaceId: string; plan: PlanRow; type: WorkspaceType } | null;
  idem: { key: string; scope: string; attempt: number; requestKey: string } | null;  // requestKey = `${scope}:${key}:${attempt}`
  log: Logger;
}
```

סדר הפעולות בכל בקשה:

1. `requestId` חדש, לוג פתיחה (`lib/log.ts`, JSON מובנה עם `requestId`, `routeId`, `workspaceId`, `jobId` כשיש), תגיות Sentry.
2. **מצב תחזוקה:** כש-`app_settings.maintenance_mode.enabled` (מטמון 30 שניות) ובקשה כותבת שלא מסומנת `allowDuringMaintenance` ← ‏503 `MAINTENANCE` ‏`{ until }`. ב-`POST /api/billing/checkout` התשובה היא `{ until: null, scope: "checkout" }`, גם כשרק הדגל `billing_checkout` כבוי (§21.2).
3. **בדיקת Origin (CSRF):** לכל בקשה כותבת עם `auth` שאינו `cron`/`signed`: הכותרת `Origin` חייבת להיות `NEXT_PUBLIC_SITE_URL`, כתובת ה-Preview של Vercel (`VERCEL_URL`) או `http://localhost:3000` בפיתוח. אחרת ← ‏403 `FORBIDDEN` ‏`{ reason: "bad_origin" }`. עוגיות הסשן `SameSite=Lax`. חריג יחיד: `POST /api/unsubscribe` (‏RFC 8058 — תוכנות מייל שולחות בלי `Origin` ובלי עוגיות; הטוקן החתום הוא ההרשאה).
4. **גוף:** בדיקת `content-type`, קריאה עם תקרת גודל (חריגה ← 400 `INVALID_INPUT` ‏`{ reason: "body_too_large" }`), ‏`JSON.parse`, ‏Zod (`safeParse`). שגיאה ← 400 `INVALID_INPUT` עם `issues` (‏18.3).
5. **זהות:** `supabase.auth.getClaims()`; חסר משתמש ברמה שדורשת ← ‏401 `UNAUTHENTICATED`. ‏`cron`: השוואת `Authorization` ל-`Bearer ${CRON_SECRET}` ב-`timingSafeEqual`. ‏`platform_admin`: ‏`platform_admin_status()` חייב להחזיר `ok` (דגל + `aal2`); אחרת ‏403 `FORBIDDEN`.
6. **סביבה ותפקיד:** `cookie` ← `getCurrentWorkspace` (§17.3); `resource` ← קריאת השורה דרך הלקוח של המשתמש (אם ה-RLS לא מחזיר — 404 `NOT_FOUND`, גם כשהשורה קיימת בסביבה אחרת), ו-`effective_role(row.workspace_id)`. תפקיד לא מספיק ← ‏403 `FORBIDDEN` ‏`{ requiredRoles }`.
7. **הגבלות קצב** (18.6) ← ‏429 `RATE_LIMITED` + `Retry-After`.
8. **אידמפוטנטיות** (18.7).
9. ה-handler. חריגה מסוג `ApiError` ← תשובת שגיאה; שגיאת Supabase ← `fromDbError`; כל דבר אחר ← לוג + Sentry + ‏500 `INTERNAL_ERROR` ‏`{ requestId }`.
10. השלמת רשומת האידמפוטנטיות (תשובות JSON בלבד; זרימות — §18.7).

```ts
// example: app/api/projects/[id]/generate/route.ts
export const runtime = "nodejs";
export const preferredRegion = "fra1";
export const maxDuration = 60;
export const POST = route({
  id: "projects.generate",
  auth: "editor",
  workspace: { resource: "project", param: "id" },
  body: GenerateBody,
  idempotency: "required",
  rateLimit: [RL.generatePerWorkspace],
  handler: async (ctx) => Response.json(await startGeneration(ctx), { status: 202 }),
});
```

### 18.5 מוסכמות זרימה (streaming)

| סוג | נתיבים | פורמט | סיום / שגיאה |
|---|---|---|---|
| **NDJSON** | `POST …/script`, `POST …/hooks`, `POST /api/hooks/variations`; ומההרחבה: `POST /api/campaigns/[id]/copy` (`AdCopyV1`), `POST /api/campaigns/[id]/explain` (`InsightExplainV1`), `POST /api/admin/trends/templates/[id]/explainer` (`TrendExplainerV1`) | `200` עם `Content-Type: application/x-ndjson; charset=utf-8`, אובייקט JSON אחד בכל שורה: `partial` (תצוגה חלקית של הסכמה, לכל היותר כל 80ms) · `done` (פעם אחת, בסוף) · `error`. נצרך ב-`useNdjsonObject(schema)` (`lib/ai/client/use-ndjson-object.ts`, חלק 05 §3.5) | כותרות שנקבעות **לפני** הגוף: `X-Request-Id`, `X-Credits-Spent`. מזהה הגרסה של התסריט מגיע באירוע `done` (`versionId`), לא בכותרת. שגיאה לפני הזרם ← JSON רגיל עם סטטוס. שגיאה באמצע ← אירוע `error` עם `details.refunded` (הקרדיטים כבר הוחזרו ב-`refund_reservation`), והזרם נסגר; הקליינט מאפשר לנסות שוב עם **מפתח חדש** |
| **SSE** | `/api/brand/extract` | `text/event-stream`, שורות `data: {json}\n\n`; אירועים `{type:"progress",key,label_he}` · `{type:"result",profile}` · `{type:"error",error:{code,message_he}}` | heartbeat (`: ping`) כל 10 שניות; תמיד מסתיים ב-`result` או ב-`error` |

```ts
// lib/api/contracts/stream.ts — one line per event
export const StreamEvent = <T extends z.ZodType>(partial: T) => z.discriminatedUnion("type", [
  z.object({ type: z.literal("partial"), data: partial }),                     // deep-partial of the schema, throttled ≥ 80 ms
  z.object({ type: z.literal("done"), versionId: Uuid.nullable(), modelServed: z.string(), credits: z.number().int(),
             workspaceHookIds: z.array(Uuid).optional() }),                   // versionId: script only; workspaceHookIds: hooks/variations
  z.object({ type: z.literal("error"), error: z.object({ code: z.string(), message_he: z.string(),
             details: z.record(z.string(), z.unknown()).optional() }) }),   // details.refunded = credits returned
]);
```

זרם האובייקטים של AI SDK (`streamObject` כזרם טקסט, וה-hook שצורך אותו בדפדפן) לא בשימוש: זרם טקסט לא יכול לשאת שגיאה טיפוסית באמצע הזרם או את תוצאת ההחזר, ו-`streamObject` מסומן כ-deprecated ב-AI SDK v6 (חלק 05 §3.2).

`maxDuration`: נתיבי AI אינטראקטיביים 300 שניות, עם תקציב זמן פנימי של 240 שניות (חלק 05 §2.2; §19.5 שלב 6), `generate`/`render`/`regenerate` 60, שאר הנתיבים 30, webhooks 30, cron 300. בהרחבה: נתיבי ה-NDJSON שלמעלה ו-`POST /api/landing-pages` הם נתיבי AI אינטראקטיביים (300); `POST /api/projects/[id]/hook-score` מחזיר תשובה תוך 5 שניות (§19.10); עבודה מול Meta שלוקחת יותר מכמה שניות (הכנת קמפיין והעלאת הסרטונים, פרסום רגיל, בדיקת דופק) רצה ב-Vercel Workflow, והנתיב רק מתחיל אותה ומחזיר `202`.

### 18.6 הגבלות קצב (Upstash, `lib/ratelimit.ts`)

חלון זז (`Ratelimit.slidingWindow`) לחלונות של דקה/שעה, וחלון קבוע (`fixedWindow`, ‏UTC) לחלונות יומיים. מפתח: `rl:{bucket}:{scope}:{id}`. כשל של Upstash ← **fail-open** לנתיבים ציבוריים זולים, **fail-closed** (‏503 `PROVIDER_UNAVAILABLE`) לנתיבים שמוציאים כסף על AI.

| Bucket | נתיבים | Scope | מגבלה | `details.scope` לקופי |
|---|---|---|---|---|
| `auth` | `/auth/callback`, ‏`/auth/confirm` (בתוך שני ה-Route Handlers, עם `lib/ratelimit.ts`) | IP | 10 / 10 דקות | — |
| `hooks_search` | `GET /api/hooks/search` | IP | 120 / דקה | — |
| `hooks_event` | `POST /api/hooks/[id]/event` | IP | 60 / דקה | — |
| `brand_extract` | `POST /api/brand/extract` | workspace (+ IP: 20 / שעה) | 5 / יום | `brand_extract` |
| `rewrite` | `…/scenes/[sceneId]/rewrite`, ‏`…/script/beats/[index]/rewrite`, ‏`…/post-caption`, ‏`…/edit-plan` | workspace | 50 / יום (משותף) | `rewrite` |
| `inflect` | `/api/hooks/inflect`, ‏`…/script/inflect` | workspace | 50 / יום | `rewrite` |
| `voice_preview` | `POST /api/voices/preview` | workspace | 20 / יום | `voice_preview` |
| `generate` | `…/generate`, `…/regenerate`, `…/render`; ומההרחבה `POST /api/guided/shoots/[id]/autocut` | workspace | 10 / שעה | `generate` |
| `llm` | `…/script`, `…/storyboard`, `…/hooks`, `/api/hooks/variations`; ומההרחבה `POST /api/campaigns/[id]/copy`, `…/explain`, `POST /api/guided/shoots`, `POST /api/landing-pages`, `POST /api/landing-pages/[id]/generate`, `POST /api/projects/[id]/hook-score` | workspace | 60 / שעה | `generate` |
| `estimate` | `…/estimate` | user | 120 / דקה | — |
| `uploads` | `/api/uploads/sign` | workspace | 120 / שעה | — |
| `share` | `POST /api/share` | workspace | 60 / שעה | — |
| `approvals` | `POST /api/approvals/[token]` | IP + token | 10 / שעה | — |
| `public_forms` | `/api/contact`, ‏`/api/newsletter`, ‏`/api/abuse-reports` | IP | 5 / שעה | — |
| `unsubscribe` | `POST /api/unsubscribe`, ‏`GET /api/newsletter/confirm` | IP | 30 / דקה | — |
| `consents` | `POST /api/consents` | IP | 30 / דקה | — |
| `billing` | `/api/billing/checkout`, ‏`plan-change`, ‏`cancel`, ‏`resume`, ‏`refund-request` | workspace | 10 / שעה | — |
| `checkout_ip` | `POST /api/billing/checkout` (בנוסף ל-`billing`) | IP | 20 / שעה | `checkout` |
| `account` | `/api/account/export` · `/api/account/delete` | user | 2 / יום · 3 / יום | — |
| `whatsapp_verify` | `/api/account/whatsapp/start`, ‏`/api/account/whatsapp/confirm` (v2) | user | 5 / שעה | `whatsapp_verify` |
| `meta_write` | כתיבות מול Meta: `POST /api/meta/connect/start`, `…/assets/select`, `…/disconnect`, `POST /api/campaigns`, `…/prepare`, `…/publish`, `…/pause`, `…/resume`, `…/end`, `…/duplicate`, `…/boost-winner` (§21b) | workspace | 30 / דקה | `meta_write` |
| `meta_read` | קריאות מ-Meta: `GET /api/meta/assets`, `POST /api/meta/preflight`, `GET /api/meta/geo/search`, `GET /api/meta/dashboard`, `GET /api/campaigns/[id]/previews`, `GET /api/social/posts/[id]/boost-eligibility` | workspace | 120 / דקה | — |
| `meta_refresh` | `POST /api/campaigns/[id]/insights/refresh` | campaign | 1 / 15 דקות | `meta_refresh` |
| `social_publish` | `POST /api/social/posts`, `…/retry` | workspace | 20 / שעה | `social_publish` |
| `leads_export` | `GET /api/leads/export.csv` | user | 5 / שעה | `leads_export` |
| `trends` | `GET /api/trends`, `GET /api/trends/[slug]` | user | 120 / דקה | — |
| `landing_lead` | `POST /api/b/[slug]/lead` (טופס הלידים הציבורי של דף העסק) | IP | 10 / שעה | `landing_lead` |
| `health_check` | `POST /api/meta/health-check` | workspace | 1 / יום | `health_check` |
| `plan_generate` | `POST /api/plan/generate` | workspace | 3 / יום | `plan_generate` |
| `admin` | `/api/admin/*` | user | 120 / דקה | — |
| `health` | `GET /api/health` | IP | 60 / דקה | — |
| `default` | כל בקשה כותבת אחרת של משתמש מחובר | user | 300 / דקה | — |

מגבלה עסקית שאינה bucket: יותר מ-6 רכישות חבילה ב-24 שעות לסביבה ← ‏429 `RATE_LIMITED` ‏`{ scope: "topup_daily" }` (חלק 06 §7.2). ‏**Webhooks** לא מוגבלים בקצב, אבל הגוף מוגבל ל-1MB וחתימה שגויה נדחית מיד (§22.1).

**ההרחבה:**
- **מגבלות עסקיות שאינן bucket** (הכול 429 `RATE_LIMITED` עם `retryAfter`): `meta_budget` — לכל היותר 3 שינויי תקציב בשעה לקמפיין, נספרים מ-`ad_change_log` ב-`ad_budget_changes_last_hour` (Meta מתירה 4; `POST /api/campaigns/[id]/budget` לא משתמש ב-bucket אחר); `meta_account` — שער ה-BUC של חשבון המודעות (`meta:acct:{actId}`, חלק 07) עצר את התור, ופעולה של משתמש לא יכולה לחכות; `ig_publish_daily` ו-`fb_reels_daily` — המכסה של Meta (נקראת בזמן ריצה) או `app_settings.social_daily_caps`, הנמוך מביניהם.
- **כשל של Upstash:** `meta_write`, `social_publish`, `health_check` ו-`plan_generate` ב-**fail-closed** (503 `PROVIDER_UNAVAILABLE`), כי הם נוגעים בכסף של הלקוח במטא או מפעילים AI; `meta_read`, `trends` ו-`landing_lead` ב-**fail-open** (ה-honeypot של הטופס הציבורי ממשיך לעבוד).
- **נתיבי האדמין** של ההרחבה (`/api/admin/trends/*`, `/api/admin/meta/*`) נמצאים ב-bucket `admin`.

**מפתחות Upstash** (כל המפתחות במערכת; אין אחרים): `rl:{bucket}:{scope}:{id}` (הגבלות קצב) · `cron:{name}` (נעילת cron, §23) · `cron:last:{name}` (הריצה האחרונה של כל cron, §23) · `or:halt` (עצירת AI, חלק 05 §2.3) · `or:spend:{yyyy-mm-dd}` (מונה שומר התקציב, חלק 05 §7.3) · `alert:{kind}:{bucket}` (מניעת הצפת התראות, חלק 06 §16.4) · `trial:ip:{ip}` (קצב הרשמות לניסיון, חלק 06 §7.1) · `wa:verify:{userId}` (קוד אימות WhatsApp, §21.3) · `hookevt:{ip}:{hookId}:{kind}` (מניעת כפילות באירועי הוקים, §20.3) · `consent:{userId}` (מטמון הסכמה לאנליטיקה, 10 דקות, חלק 06 §14.1) · `checkout:fail:{ws}` (מונה תשלומים שנכשלו, חלק 06 §7.2) · מההרחבה (חלק 07): `meta:acct:{actId}` (מצב השער לפי כותרות השימוש של Meta לכל חשבון מודעות) · `meta:write:{actId}` (נעילה של זרימת כתיבה אחת לכל חשבון מודעות, 120 שניות) · `meta:previews:{campaignId}` (התצוגות המקדימות של Meta, 30 דקות) · `meta:explain:{campaignId}:{range}` (ההסבר בעברית לתוצאות, 6 שעות) · `lpview:{pageId}:{ipHash}` (מניעת כפילות בספירת הצפיות של דף העסק, LP9, 30 דקות; ה-IP עובר hash עם מלח יומי, חלק 07 §14.5).

מעבר למגבלות הקצב: תקרת קרדיטים יומית (`daily_credit_cap`, ב-SQL בתוך `reserve_credits`), מגבלת מקביליות (`create_job_and_reserve`) ושומר התקציב הגלובלי (`BUDGET_GUARD`, חלק 05).
IP נלקח מ-`ipAddress(req)` של `@vercel/functions` (ב-Next 16 אין `req.ip`).

### 18.7 אידמפוטנטיות (`lib/idempotency.ts`)

**מתי חובה:** כל נתיב שמוציא קרדיטים — `POST …/hooks`, `…/script`, `…/storyboard`, `…/generate`, `…/scenes/[sceneId]/regenerate`, `…/render`, `/api/hooks/variations`, ומההרחבה `POST /api/landing-pages` ו-`POST /api/landing-pages/[id]/generate` (`landing.generate`) ו-`POST /api/guided/shoots/[id]/autocut` (`guided.autocut`). **בנוסף, כל נתיב שמשנה משהו אצל Meta או מפרסם בשם הלקוח:** `POST /api/campaigns/[id]/prepare`, `…/publish`, `…/boost-winner`, `POST /api/campaigns/[id]/copy`, `POST /api/social/posts` ו-`POST /api/plan/generate` (PL1). הם עוברים דרך `api_idempotency_keys` כמו נתיבי ה-LLM שלמטה, וכשהם מתחילים זרימה (`orchestrator.startFlow`) מפתח הזרימה הוא `{routeId}:{key}`, כך שלחיצה כפולה לא יוצרת קמפיין כפול, פרסום כפול או פוסט כפול. הכותרת `Idempotency-Key` חייבת להיות UUID v4; חסרה או לא תקינה ← 400 `INVALID_INPUT` `{ reason: "idempotency_key_required" }`.

**הקליינט:** מפתח חדש לכל **פעולה יזומה** של המשתמש (לחיצה), ואותו מפתח לכל ניסיון חוזר אוטומטי של אותה לחיצה (רשת שנפלה, 409 `in_progress`). `lib/api/client.ts` עושה את זה אוטומטית.

**נתיבי עבודה** (`generate`, ‏`regenerate`, ‏`render`): הכותרת נשמרת כ-`jobs.idempotency_key` דרך `create_job_and_reserve` (§10.4). מפתח קיים ← אותה עבודה, ‏202, וכותרת `Idempotent-Replayed: true`. מפתח של סביבה אחרת ← 400 `INVALID_INPUT` ‏`{ reason: "idempotency_key_reused" }`.

**נתיבי LLM** (`script`, ‏`storyboard`, ‏`hooks`, ‏`variations`) עוברים דרך `api_idempotency_keys`:

```ts
export async function claimIdempotency(ctx: RouteCtx<unknown, unknown>, scope: RouteId): Promise<
  | { state: "new"; attempt: number; requestKey: string }
  | { state: "completed"; status: number; body: unknown; resourceId: string | null }
  | { state: "in_progress" } | { state: "mismatch" }> {
  const key = parseUuidV4(ctx.req.headers.get("idempotency-key"));               // throws INVALID_INPUT
  const hash = sha256Hex(canonicalJson({ params: ctx.params, body: ctx.body }));  // sorted keys, no whitespace
  const { data, error } = await ctx.admin().rpc("claim_idempotency_key",
    { p_ws: ctx.ws!.id, p_scope: scope, p_key: key, p_user: ctx.user!.id, p_hash: hash }).single();
  if (error) throw fromDbError(error);
  if (data.state === "new") return { state: "new", attempt: data.attempt, requestKey: `${scope}:${key}:${data.attempt}` };
  if (data.state === "completed") return { state: "completed", status: data.response_status!, body: data.response_body, resourceId: data.resource_id };
  return { state: data.state as "in_progress" | "mismatch" };
}
```

| מצב | תשובה |
|---|---|
| `new` | ממשיכים. מפתח הקרדיטים: `spend:{scope}:{key}:{attempt}` |
| `completed` | **שחזור:** אותו סטטוס ואותו גוף JSON שנשמר, עם `Idempotent-Replayed: true`. בנתיבי NDJSON הגוף השמור הוא התוצאה הסופית (`{ versionId, script }` / `{ hooks }`) כ-JSON רגיל (`application/json`), לא זרם — `useNdjsonObject` מטפל בשני הסוגים לפי `Content-Type` |
| `in_progress` (פחות מ-6 דקות: ‏`maxDuration` של 300 שניות ועוד 60) | ‏409 `EDIT_CONFLICT` ‏`{ reason: "request_in_progress" }` + `Retry-After: 2` |
| `mismatch` | ‏400 `INVALID_INPUT` ‏`{ reason: "idempotency_key_reused" }` |

**סיום:** תשובת 2xx או 4xx ← `complete_idempotency_key(…, 'completed', status, body, resourceId)`, אחרי `commit_spend`. תשובת 5xx או זרם שנקטע ← `'failed'`; ניסיון חוזר עם אותו מפתח מקבל `attempt + 1` ומפתח קרדיטים חדש; השמירה של הניסיון הקודם הוחזרה ב-catch, או על ידי ה-sweeper (§23) אם הפונקציה נקטעה.

### 18.8 קליינט טיפוסי (`lib/api/client.ts`)

```ts
export async function api<TRes>(input: { method: "GET" | "POST" | "PATCH" | "DELETE"; path: string; body?: unknown;
  schema: z.ZodType<TRes>; idempotent?: boolean; idemKey?: string; signal?: AbortSignal }): Promise<TRes>;
// - JSON in/out, credentials: "same-origin"
// - idempotent: generates crypto.randomUUID() once per call site invocation and reuses it on retry (max 2 retries on network/409 in_progress)
// - non-2xx: throws ApiClientError { code, status, message_he, details, requestId } parsed with ApiErrorBody
// - 401 UNAUTHENTICATED: emits "session-expired" (part 03 §1.3 dialog)
```

### קריטריוני קבלה
- [ ] בדיקת יחידה עוברת על כל `ERROR_CODES` (27): לכל קוד יש סטטוס, `message_he` ומפתח `errors.{CODE}` ב-`messages/he.json`, ולכל `reason`/`check` של חמשת הקודים החדשים יש מפתח קופי.
- [ ] `fromDbError({ code: "P0001", message: "INSUFFICIENT_CREDITS", details: '{"needed":107,"balance":40}' })` מחזיר ‏402 עם `details` מפוענח; ‏`fromDbError({ code: "P0001", message: "AUDIT_LOG_IMMUTABLE" })` מחזיר ‏500 `INTERNAL_ERROR`.
- [ ] בדיקה סטטית: אין קובץ שמחזיר `error.code` שאינו ב-`ERROR_CODES`, ואין שימוש ב-`toTextStreamResponse`, ב-`experimental_useObject` או בכותרת `X-Version-Id`.
- [ ] זרם `script` מסתיים בשורה `{"type":"done","versionId":…}` שהמזהה שלה שווה ל-`projects.current_version_id`; כשל מדומה של הספק באמצע הזרם מסתיים בשורת `error` עם `details.refunded = 2`.
- [ ] בקשת POST עם `Origin: https://evil.com` נדחית ב-403 בכל נתיב כותב (חוץ מ-webhooks, ‏cron ו-`POST /api/unsubscribe`).
- [ ] שגיאת Zod על `url` מחזירה `issues[0].key = "invalid_url"` ו-`message_he` בעברית.
- [ ] שתי בקשות `generate` עם אותו `Idempotency-Key` (במקביל) יוצרות עבודה אחת ושמירת קרדיטים אחת; השנייה מחזירה 202 עם אותו `jobId`.
- [ ] בקשת `script` שנכשלה ב-503 ונשלחה שוב עם אותו מפתח מחייבת פעם אחת בלבד בסך הכול (היומן מראה `reserve`+`capture`+`refund` לניסיון הראשון ו-`reserve`+`capture` לשני).
- [ ] 6 בקשות `brand/extract` באותו יום מאותה סביבה ← השישית 429 עם `details.scope = "brand_extract"`.
- [ ] שינוי תקציב רביעי באותה שעה לאותו קמפיין ← 429 `{ scope: "meta_budget", retryAfter }`, ובלי קריאה ל-Meta; בדיקת דופק שנייה באותו יום ← 429 `{ scope: "health_check" }`; טופס ליד אחד-עשר מאותו IP בשעה ← 429 `{ scope: "landing_lead" }`.
- [ ] `META_NOT_CONNECTED` מוחזר בסטטוס 409 גם כשהוא נזרק מתוך RPC (`raise_app_error`), ו-`META_API_ERROR` לעולם לא כולל `access_token` או `appsecret_proof` ב-`details` או ב-Sentry (בדיקה עם fixture של Meta).

---

## §19. חוזי ה-API: פרויקטים, תסריט, יצירה ועבודות

כל הסכמות יושבות ב-`lib/api/contracts/*.ts` ומשמשות גם את ה-Route Handler (ולידציה) וגם את `lib/api/client.ts` (טיפוסים ופענוח תשובה). סכמות ה-AI (`ScriptV1`, `StoryboardV1`, `HookBatchV1`, `BrandProfileV1`, `ModerationV1`) מיובאות מ-`lib/ai/schemas/*` (חלק 05).

### 19.1 סכמות משותפות (`lib/api/contracts/common.ts`)

```ts
import { z } from "zod/v4";
import { ENUMS, type Row } from "@/lib/supabase/enums";

export const Uuid = z.uuid();
export const UuidV4 = z.uuid({ version: "v4" });
export const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
export const HookId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*-[0-9]{2,3}$/);
export const IsoDateTime = z.iso.datetime({ offset: true });
export const AspectRatio = z.enum(ENUMS.aspect_ratio);
export const Formats = z.array(AspectRatio).min(1).max(3)
  .refine((a) => new Set(a).size === a.length, { params: { key: "custom" } });
export const WizardStep = z.enum(["business", "niche", "goal", "hook", "script", "style", "voice", "music", "preview"]);
export const CaptionPreset = z.enum(["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"]);
export const MusicMood = z.enum(["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]);
export const VisualStyle = z.enum(["cinematic", "ugc", "day_in_business", "before_after", "product", "text_motion"]);
export const CtaType = z.enum(["whatsapp", "call", "link_in_bio", "booking", "navigate", "lead_form", "comment_keyword", "save_share", "visit_site"]);
export const HeText = (min: number, max: number) => z.string().trim().min(min).max(max);

export const ApiErrorBody = z.object({
  error: z.object({ code: z.string(), message_he: z.string(), details: z.record(z.string(), z.unknown()).optional() }),
});

// entity DTOs = DB rows (snake_case), minus server-only columns
export type ProjectDTO  = Omit<Row<"projects">, "deleted_at">;
export type VersionDTO  = Row<"project_versions">;
export type SceneDTO    = Row<"scenes">;
export type AssetDTO    = Omit<Row<"assets">, "sha256"> & { url?: string | null };
export type JobDTO      = Pick<Row<"jobs">, "id" | "workspace_id" | "project_id" | "version_id" | "kind" | "status" | "stage" | "progress"
  | "credits_estimated" | "credits_captured" | "options" | "error_code" | "error_message_he" | "started_at" | "finished_at"
  | "canceled_at" | "created_at" | "updated_at">;                               // no costs, run ids or error_detail for customers
export type JobStepDTO  = Pick<Row<"job_steps">, "id" | "job_id" | "step_key" | "scene_id" | "status" | "attempt" | "credits"
  | "error_code" | "started_at" | "finished_at" | "updated_at">;                // no input/output/model/provider ids
export const looseRow = z.looseObject({ id: z.string() });                       // client-side shallow check for DTOs
```

### 19.2 תקציר הנתיבים

| # | Method · Path | Auth · סביבה | Idempotency | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|---|
| 1 | `POST /api/projects` | editor · cookie | — | default | `201 { projectId, step }`; מההרחבה גם מתבנית טרנד (`trendSlug`, `productionMode`, `src: "trend"`, §19.3) | `PLAN_LIMIT` (`projects_max`), `NOT_FOUND` (תבנית/הוק; `retired` לתבנית טרנד שהוצאה משימוש), `INVALID_INPUT` (`production_mode_unavailable`) |
| 2 | `PATCH /api/projects/[id]` | editor · project | — | default | `200 { project }` | `EDIT_CONFLICT`, `PLAN_LIMIT`, `INVALID_INPUT` |
| 3 | `POST /api/projects/[id]/duplicate` | editor · project | — | default | `201 { projectId }` | `PLAN_LIMIT` |
| 4 | `POST /api/projects/[id]/versions` | editor · project | — | default | `201 { versionId, version }` | `NOT_FOUND` |
| 5 | `POST /api/brand/extract` | user · cookie | — | `brand_extract` | SSE | `RATE_LIMITED`, `INVALID_INPUT` (`url_blocked`) |
| 6 | `GET /api/projects/[id]/hooks` | member · project | — | — | `200 { hooks }` | — |
| 7 | `POST /api/projects/[id]/hooks` | editor · project | **חובה** | `llm` | **NDJSON** `HookBatchV1`; ‏`done.workspaceHookIds` | `INSUFFICIENT_CREDITS`, `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE` |
| 8 | `POST /api/projects/[id]/script` | editor · project | **חובה** | `llm` | **NDJSON** `ScriptV1`; ‏`done.versionId` | `MISSING_FACTS`, `MODERATION_BLOCKED`, `ELECTION_POLICY_BLOCKED`, `INSUFFICIENT_CREDITS` |
| 8a | `PATCH /api/projects/[id]/script` | editor · project | — | default | `200 { versionId, updatedAt, script, storyboardStale }` | `EDIT_CONFLICT` (`stale`/`version_locked`), `INVALID_INPUT`, `NOT_FOUND` |
| 9 | `POST /api/projects/[id]/script/beats/[index]/rewrite` | editor · project | — | `rewrite` | `200 { versionId, beat }` | `EDIT_CONFLICT` |
| 10 | `POST /api/projects/[id]/script/inflect` | editor · project | — | `inflect` | `200 { versionId }` | — |
| 11 | `POST /api/projects/[id]/storyboard` | editor · project | **חובה** | `llm` | `200 { versionId, storyboard, scenes }` | `MODERATION_BLOCKED`, `INSUFFICIENT_CREDITS` |
| 12 | `PATCH /api/projects/[id]/scenes/[sceneId]` | editor · project | — | default | `200 { scene }` | `EDIT_CONFLICT` (`stale`/`version_locked`) |
| 13 | `DELETE /api/projects/[id]/scenes/[sceneId]` | editor · project | — | default | `200 { scenes }` | `EDIT_CONFLICT`, `INVALID_INPUT` (`hook_scene_required`) |
| 14 | `POST /api/projects/[id]/scenes/reorder` | editor · project | — | default | `200 { scenes }` | `EDIT_CONFLICT`, `INVALID_INPUT` (`hook_scene_first`) |
| 15 | `POST /api/projects/[id]/scenes/[sceneId]/rewrite` | editor · project | — | `rewrite` | `200 { scene }` | `RATE_LIMITED` |
| 16 | `POST /api/projects/[id]/estimate` | member · project | — | `estimate` | `200 Estimate` | `PLAN_LIMIT` (מסומן, לא נזרק) |
| 17 | `POST /api/projects/[id]/generate` | editor · project | **חובה** | `generate` | `202 { jobId, variantProjectIds }` | `402 INSUFFICIENT_CREDITS` · `403 PLAN_LIMIT` (כולל `client_workspace_read_only`) · `409 CONCURRENCY_LIMIT` · `422 MISSING_FACTS` · `422 MODERATION_BLOCKED` · `451 ELECTION_POLICY_BLOCKED` · `503 BUDGET_GUARD` · `503 MAINTENANCE` |
| 18 | `POST /api/projects/[id]/scenes/[sceneId]/regenerate` | editor · project | **חובה** | `generate` | `202 { jobId }` | כמו 17 |
| 19 | `POST /api/projects/[id]/render` | editor · project | **חובה** | `generate` | `202 { jobId }` | כמו 17 (בלי `MISSING_FACTS`) |
| 20 | `POST /api/projects/[id]/post-caption` | editor · project | — | `rewrite` | `200 { post_caption_he, hashtags_he, first_line_cta_he }` (`post.caption.v2`; עד 5 האשטגים ל-`reels` ול-`facebook`) | `RATE_LIMITED`, `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE` |
| 21 | `POST /api/projects/[id]/edit-plan` (v2, דגל `chat_edit`) | editor · project | — | `rewrite` | `200 { plan: EditPlanV1 }` | `NOT_FOUND` (דגל כבוי), `RATE_LIMITED` |
| 22 | `GET /api/jobs/[id]` | member · job | — | — | `200 { job, steps, scenes }` | `NOT_FOUND` |
| 23 | `POST /api/jobs/[id]/cancel` | editor · job | — | default | `200 { status }` | `INVALID_INPUT` (`not_cancelable`) |
| 24 | `POST /api/projects/[id]/hook-score` (דגל `hook_score`) | member · project | — (אידמפוטנטי לפי גרסה) | `llm` | `200 { versionId, hookScore, cached }` (סינכרוני, עד 5 שניות, 0 קרדיטים, §19.10) | `NOT_FOUND` (דגל כבוי, גרסה של פרויקט אחר), `INVALID_INPUT` (`no_storyboard`) |

**נתיבי ההרחבה** (Meta, קמפיינים, לידים, פרסום רגיל, טרנדים, צילום מודרך, דף העסק, בדיקת דופק ותוכנית 30 יום) רשומים ברשימת האב של §21b; נתיבי האדמין שלה ב-§24.1. כאן נשארים רק #1 (יצירה מתבנית טרנד), #20 (גרסה 2 של טקסט הפוסט) ו-#24 (ציון הוק), כי הם חלק מחוזה הפרויקט.

### 19.3 פרויקטים

```ts
// lib/api/contracts/projects.ts
export const CreateProjectBody = z.strictObject({
  templateId: Uuid.optional(),
  hookId: HookId.optional(),
  workspaceHookId: Uuid.optional(),
  nicheSlug: Slug.optional(),
  videoType: z.enum(ENUMS.video_type).optional(),
  seasonSlug: Slug.optional(),                       // /app/create?season=
  fast: z.boolean().optional(),                      // "צרו לי הכל אוטומטית" fast path
  trendSlug: Slug.optional(),                        // /app/create?trend= ; a published, unexpired trend_templates.slug (part 08)
  productionMode: z.enum(["ai", "guided"]).optional(),   // only with trendSlug; default "ai"; "guided" needs flag guided_filming
  // same values as /app/create?src= ; an unknown value is ignored, not an error
  src: z.enum(["hero", "final_cta", "onboarding", "hooks", "template", "dashboard", "niche_page", "trend", "plan"]).optional().catch(undefined),   // "plan" = from a 30-day plan item (part 03 §6.0, part 07 §16.3)
}).refine((b) => !(b.hookId && b.workspaceHookId), { params: { key: "custom" }, path: ["workspaceHookId"] })
  .refine((b) => !b.productionMode || !!b.trendSlug, { params: { key: "custom" }, path: ["productionMode"] });
export const CreateProjectResponse = z.object({ projectId: Uuid, step: WizardStep });
// step = first incomplete step computed by lib/wizard/progress.ts (part 03 §6.0), not always "business"

// end-card headline (appendix E is the source): at most 6 words and 30 characters; same rule in part 05 end_card.headline_he
export const EndCardHeadline = z.string().trim().max(30)
  .refine((v) => v.split(/\s+/).filter(Boolean).length <= 6, { params: { key: "custom" } });

export const ProjectBrief = z.strictObject({
  focus_service: HeText(1, 80).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  offer: z.strictObject({ text_he: HeText(2, 200), valid_until: z.iso.date().nullable(), season_slug: Slug.nullable() }).nullable().optional(),
  cta: z.strictObject({ type: CtaType, target: z.string().trim().max(300).nullable(), keyword: z.string().trim().max(30).nullable(),
    prefill_he: z.string().trim().max(200).nullable(), headline_he: EndCardHeadline.nullable() }).nullable().optional(),
  // NON-primary hook variants only; the primary is projects.hook_id / workspace_hook_id / hook_text_he
  variant_hooks: z.array(z.strictObject({ hook_id: HookId.nullable(), workspace_hook_id: Uuid.nullable(), text_he: HeText(3, 160) })).max(4).optional(),
  fact_answers: z.array(z.strictObject({
    slot_id: z.string().max(120),                                          // FactSlot.id (part 03 §6.12)
    kind: z.enum(["placeholder", "numeric_claim", "script_fact"]),
    token: z.string().max(120),
    action: z.enum(["confirmed", "replaced", "removed"]),
    value: z.string().trim().max(120).nullable(),                           // required when action = "replaced"
  })).max(40).optional(),
  // one row per ComplianceChecklist checkbox (part 03 §6.5) = the ScriptV1 compliance flags that require a confirmation
  attestations: z.array(z.strictObject({
    kind: z.enum(["testimonial_requires_consent", "urgency_must_be_true", "results_claim", "price_claim", "kashrut_claim", "minors",
                  "people_on_camera_consent"]),                            // guided filming with people on camera (part 08)
    at: IsoDateTime, by: Uuid })).max(10).optional(),
  testimonial: z.strictObject({ quote_he: HeText(5, 400), name_he: HeText(2, 60), consent_attested: z.boolean() }).nullable().optional(),
  audio_mix: z.strictObject({ music_level: z.number().min(0).max(1), ducking: z.boolean(), ducked_level: z.number().min(0).max(1) }).optional(),
  post_caption: z.strictObject({ text_he: z.string().max(1500), hashtags_he: z.array(z.string()).max(8), platform: z.enum(ENUMS.platform),
    first_line_cta_he: z.string().trim().max(150).nullable().optional(),   // post.caption.v2
    generated_at: IsoDateTime })
    .refine((c) => !["reels", "facebook"].includes(c.platform) || c.hashtags_he.length <= 5, { params: { key: "custom" }, path: ["hashtags_he"] })
    .nullable().optional(),
});

// per-project overrides of the brand kit (projects.render_options, §6); all keys optional
export const RenderOptions = z.strictObject({
  logo_bug: z.boolean().optional(),
  intro_style: z.enum(["none", "logo_reveal", "title_card"]).optional(),
  caption_position: z.enum(["lower", "middle"]).optional(),
  caption_highlight_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  end_card: z.strictObject({
    headline_he: EndCardHeadline.optional(),
    show_phone: z.boolean().optional(), show_whatsapp: z.boolean().optional(), show_website: z.boolean().optional(),
    show_address: z.boolean().optional(), show_instagram: z.boolean().optional(), show_qr: z.boolean().optional(),
  }).optional(),
});

export const ProjectPatchBody = z.strictObject({
  ifUnmodifiedSince: IsoDateTime.optional(),
  title: HeText(1, 80).optional(),
  nicheSlug: Slug.nullable().optional(),
  videoType: z.enum(ENUMS.video_type).optional(),
  goal: z.enum(ENUMS.hook_goal).optional(),
  platforms: z.array(z.enum(ENUMS.platform)).min(1).max(7).optional(),
  primaryAspect: AspectRatio.optional(),
  extraAspects: z.array(AspectRatio).max(2).optional(),
  durationTargetSec: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]).optional(),
  qualityTier: z.enum(ENUMS.quality_tier).optional(),
  visualMix: z.enum(ENUMS.visual_mix).optional(),
  visualStyle: VisualStyle.optional(),
  audienceGender: z.enum(ENUMS.audience_gender).optional(),
  voiceGender: z.enum(ENUMS.voice_gender).optional(),
  register: z.enum(ENUMS.register).optional(),
  brandKitId: Uuid.nullable().optional(),
  voiceId: Slug.nullable().optional(),
  voiceSpeed: z.number().min(0.8).max(1.2).optional(),
  noVoice: z.boolean().optional(),
  musicMode: z.enum(["library", "generate", "none"]).optional(),
  musicTrackId: Uuid.nullable().optional(),
  musicMood: MusicMood.nullable().optional(),
  captionPreset: CaptionPreset.optional(),
  aiLabel: z.boolean().optional(),
  hookId: HookId.nullable().optional(),
  workspaceHookId: Uuid.nullable().optional(),
  hookTextHe: HeText(3, 160).nullable().optional(),
  templateId: Uuid.nullable().optional(),
  wizardStep: WizardStep.optional(),
  isArchived: z.boolean().optional(),
  brief: ProjectBrief.partial().optional(),         // shallow-merged into projects.brief (keys replaced, not deep-merged)
  renderOptions: RenderOptions.optional(),          // shallow-merged into projects.render_options (top-level keys replaced)
  renderOptionsReset: z.array(z.enum(["logo_bug", "intro_style", "caption_position", "caption_highlight_color", "end_card"]))
    .max(5).optional(),                             // "איפוס לערכת המותג": keys removed BEFORE the merge → brand kit value applies
}).refine((b) => Object.keys(b).some((k) => k !== "ifUnmodifiedSince"), { params: { key: "custom" } });
export const ProjectPatchResponse = z.object({ project: looseRow });
```

**התנהגות `PATCH`:**
- מיפוי camelCase ← עמודה (`qualityTier` ← `quality_tier` …) בטבלה קבועה ב-`lib/api/mappers.ts`; עמודות שהשרת מנהל (`stage`, `current_version_id`, `latest_job_id`) לא חשופות.
- `brief` ו-`renderOptions` מתמזגים מיזוג רדוד (מפתח שנשלח מחליף את הערך הקודם שלו; מפתחות אחרים נשמרים). ‏`renderOptionsReset` מוחק מפתחות מ-`render_options` לפני המיזוג, כך שהערך של ערכת המותג חל שוב. הבקשה כולה מאומתת מול `ProjectBrief` / `RenderOptions` אחרי המיזוג, ונשמרת בכתיבה אחת.
- `brief.variant_hooks.length ≤ limits.hook_variants_max − 1` (הראשי לא נספר שם). ‏`brief.attestations[].by` חייב להיות המשתמש המחובר (השרת דורס אותו); הסכמה על העלאה נשמרת על הנכס (`assets.metadata.consent_attested`), לא כאן.
- `ifUnmodifiedSince` שונה מ-`updated_at` הנוכחי ← ‏409 `EDIT_CONFLICT` ‏`{ reason: "stale", currentUpdatedAt }`.
- **בדיקת תוכנית מוקדמת** (כדי לנעול בקרים בזמן אמת, לא רק ביצירה): `qualityTier` מחוץ ל-`limits.quality_tiers`, ‏`durationTargetSec` מעל `max_duration_sec`, ‏`visualMix` מחוץ ל-`limits.visual_mix`, יותר מ-`max_formats` פורמטים (`primaryAspect` + `extraAspects`), `musicMode = "generate"` בלי `music_generate`, יותר מ-`hook_variants_max - 1` ב-`brief.variant_hooks` ← ‏403 `PLAN_LIMIT` ‏`{ limit, required? }`.
- `voiceId`, ‏`brandKitId`, ‏`musicTrackId`, ‏`templateId`, ‏`hookId`, ‏`workspaceHookId` נבדקים שקיימים ושהם בסביבה הנכונה (או ציבוריים); אחרת ‏400 `INVALID_INPUT` עם `issues` על השדה.
- מעבר `stage` מ-`draft` ל-`brief` נעשה כאן בצד השרת (לקוח סודי) כששלבי `business`, `niche`, `goal`, `hook` הושלמו לפי `lib/wizard/progress.ts`.
- **איזה לקוח כותב:** `PATCH` ו-`POST /api/projects` כותבים דרך הלקוח של המשתמש, כך שה-RLS והשומרים של §11.3 חלים. כתיבה של עמודות שהשרת מנהל (`stage`, ‏`current_version_id`, ‏`latest_job_id`) ושל `project_versions.moderation` — ב-`duplicate`, ב-`versions`, ביצירת תסריט ובשכתובים — עוברת בלקוח הסודי, אחרי שהעטיפה כבר בדקה את ההרשאה על הפרויקט.

**`POST /api/projects` (יצירה):** בודק `projects_max` (ספירת פרויקטים שאינם מחוקים בסביבה). ממלא ברירות מחדל מהתבנית (`video_type`, `goal`, `duration_target_sec`, `visual_style`, `visual_mix`, `caption_preset`, `music_mood`), מההוק (`hook_id`, `hook_text_he`, `niche_slug`), מהנישה (`default_register`, `default_audience_gender`, `default_music_mood`, `default_cta`) ומערכת המותג המוגדרת כברירת מחדל (`brand_kit_id`, `caption_preset`, `default_voice_id`). כש-`hookId` מגיע, `increment_hook_event(hookId, 'generate')` נקרא **רק אחרי** שהיצירה הראשונה של הפרויקט הצליחה (בצנרת), לא כאן.

**יצירה מתבנית טרנד** (`trendSlug`, מ-`0014`; הזרימה המלאה בחלק 08):
- התבנית חייבת להיות `published` ולא אחרי `expires_at`; אחרת 404 `NOT_FOUND` `{ reason: "retired" }`. דגל `trends` כבוי ← 404 בלי `details`.
- `productionMode = "guided"` דורש את הדגל `guided_filming` ותבנית עם `production_mode` `guided` או `hybrid`; אחרת 400 `INVALID_INPUT` `{ reason: "production_mode_unavailable" }`.
- הפרויקט נוצר עם `trend_template_id` ו-`production_mode`, וברירות המחדל באות **קודם** מהתבנית (`default_goal`, `default_video_type`, `default_duration_sec`, `default_visual_style`, `default_caption_preset`, `default_music_mood`, ו-`no_voice` כש-`vo_mode = 'none'`), ואחר כך מהנישה של הסביבה ומערכת המותג, כמו למעלה. גרסאות ההוק של התבנית נבחרות מראש ב-`brief.variant_hooks`, עד `limits.hook_variants_max − 1`.
- באותה כתיבה נוצרת שורת `trend_template_uses` אחת לפרויקט (`niche_slug`, `hook_variant_keys`, `production_mode`), בלקוח הסודי, כי הטבלה נכתבת רק בשרת.
- `projects_max` נבדק כרגיל; ה-`step` שחוזר הוא השלב הראשון שלא הושלם באשף הקיים (אין שלב חדש).

**`POST /api/projects/[id]/duplicate`:** מעתיק את שורת הפרויקט (כותרת + " (עותק)"), את הגרסה הנוכחית כגרסה 1 ואת הסצנות שלה עם אותם `*_asset_id` (בלי ליצור מדיה מחדש), ‏`stage = 'storyboard'` אם היו סצנות, אחרת `'brief'`.

**`POST /api/projects/[id]/versions`** — ‏`{ fromVersionId: Uuid }` ← ‏`201 { versionId, version }`: גרסה חדשה (`source = 'user_edit'`) עם עותק של `script`, ‏`storyboard`, וכל הסצנות (אותם נכסים, `status` כמו במקור; ההעתקה בלקוח הסודי, כי `scenes` נכתבת רק בשרת, §19.6), ו-`projects.current_version_id` מצביע עליה. אם `fromVersionId` אינה הגרסה הנוכחית — מותר (שחזור מגרסה קודמת).

### 19.4 חילוץ מותג (SSE)

```ts
// lib/api/contracts/brand.ts
export const BrandExtractBody = z.strictObject({ url: HttpUrl });     // website or instagram.com/{handle}
export const BrandExtractEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("progress"), key: z.enum(["fetching", "logo_found", "services_found", "contact_found", "tone", "colors"]), label_he: z.string() }),
  z.object({ type: z.literal("result"), profile: BrandProfileV1 }),
  z.object({ type: z.literal("error"), error: z.object({ code: z.string(), message_he: z.string() }) }),
]);
```

| `key` | `label_he` (נשלח מהשרת) |
|---|---|
| `fetching` | פותחים את האתר… |
| `logo_found` | מצאנו לוגו |
| `services_found` | `{n, plural, one {זיהינו שירות אחד} two {זיהינו שני שירותים} other {זיהינו # שירותים}}` |
| `contact_found` | מצאנו טלפון ווואטסאפ (או "מצאנו טלפון" / "מצאנו וואטסאפ" לפי מה שנמצא) |
| `tone` | מזהים את הטון… |
| `colors` | אוספים את צבעי המותג… |

**הגנת SSRF (חובה):** רק `http`/`https`, פורטים 80/443; פתרון DNS ודחייה של כל כתובת פרטית, loopback, link-local, ‏`169.254.0.0/16`, ‏`::1`, ‏`fc00::/7`, ‏`100.64.0.0/10` — גם אחרי כל הפניה (עד 3 הפניות); תקרת 2MB ל-HTML, ‏10 שניות; `User-Agent: {{BRAND_NAME_EN}}Bot/1.0 (+https://{{DOMAIN}}/about)`; בלי עוגיות. נחסם ← אירוע `error` עם `INVALID_INPUT` ו-`message_he` "לא הצלחנו לפתוח את הכתובת הזו. אפשר למלא את הפרטים ידנית." אינסטגרם: רק המטא-דאטה הציבורית של הדף (בלי התחברות ובלי scraping של פוסטים). התוצאה **לא נשמרת אוטומטית** — המשתמש מאשר בכרטיס, והשמירה עוברת ב-Server Action `saveBusinessProfile` (§24.2).

### 19.5 הוקים לפרויקט, תסריט ושכתובים

```ts
// lib/api/contracts/ai.ts
export const ProjectHooksBody = z.strictObject({ count: z.number().int().min(6).max(10), sourceHookId: HookId.optional() });
export const ProjectHooksList = z.object({ hooks: z.array(looseRow) });            // GET: workspace_hooks of the project, newest first
// POST response: NDJSON stream of HookBatchV1 (§18.5). On finish → insert workspace_hooks (project_id, created_by, strength…),
//   then the `done` event carries workspaceHookIds
// replay (Idempotent-Replayed): 200 application/json { hooks: WorkspaceHookDTO[] }

export const ScriptBody = z.strictObject({ hookText: HeText(3, 160).optional(), regenerate: z.boolean().optional() });
// response: NDJSON stream of ScriptV1 (§18.5); header X-Credits-Spent: "2"; the versionId arrives in the `done` event
// on finish: Zod-validate ScriptV1 → insert project_versions (source 'ai', version = max+1) → projects.current_version_id,
//           projects.stage = 'script' (server client) → `done` { versionId, modelServed, credits }.
//           Validation failure after one repair attempt → refund + `error` event PROVIDER_UNAVAILABLE { refunded }.
// replay: 200 application/json { versionId, script: ScriptV1 }

// manual edit of a draft script (part 03 §6.5 autosave, debounce 800ms); free, no AI call, bucket `default`, no Idempotency-Key
export const ScriptBeatEdit = z.strictObject({
  index: z.number().int().min(0).max(9),                         // ScriptV1.beats[].index
  vo_he: z.string().trim().max(400).optional(),
  onscreen_text_he: z.string().trim().max(70).optional(),        // > 8 words = lint warning only (part 03), not an error
  visual_idea_he: z.string().trim().max(300).optional(),
}).refine((b) => b.vo_he !== undefined || b.onscreen_text_he !== undefined || b.visual_idea_he !== undefined,
          { params: { key: "required" } });
export const ScriptPatchBody = z.strictObject({
  versionId: Uuid,                                               // must be projects.current_version_id
  ifUnmodifiedSince: IsoDateTime,                                // project_versions.updated_at the editor loaded
  beats: z.array(ScriptBeatEdit).min(1).max(10),                 // unique index values (refine in the contract file)
});
export const ScriptPatchResponse = z.object({
  versionId: Uuid,                                               // same version (edited in place)
  updatedAt: IsoDateTime,                                        // the next ifUnmodifiedSince
  script: ScriptV1,
  storyboardStale: z.boolean(),                                  // true when the version already had a storyboard
});

export const RewriteInstruction = z.enum(["shorter", "energetic", "formal", "custom"]);
export const BeatRewriteBody = z.strictObject({
  instruction: RewriteInstruction, customText: HeText(2, 200).optional(),
}).refine((b) => b.instruction !== "custom" || !!b.customText, { path: ["customText"], params: { key: "custom" } });
export const BeatRewriteResponse = z.object({
  versionId: Uuid, beat: z.object({ index: z.number().int(), vo_he: z.string(), onscreen_text_he: z.string() }),
});
export const ScriptInflectBody = z.strictObject({
  voiceGender: z.enum(ENUMS.voice_gender).optional(), audienceGender: z.enum(ENUMS.audience_gender).optional(),
}).refine((b) => b.voiceGender || b.audienceGender, { params: { key: "required" } });
export const ScriptInflectResponse = z.object({ versionId: Uuid });               // new version, source = 'rewrite'

export const StoryboardBody = z.strictObject({ versionId: Uuid });
export const StoryboardResponse = z.object({ versionId: Uuid, storyboard: StoryboardV1, scenes: z.array(looseRow) });

export const SceneRewriteBody = BeatRewriteBody;
export const SceneRewriteResponse = z.object({ scene: looseRow });

// "כתיבה מחדש · חינם" of the post text in the downloads panel and in the publish dialog (part 07); 0 credits, bucket `rewrite`.
// From the 2026-10-17 extension it runs post.caption.v2 (part 07 holds the text; part 05 registers it): CTA in the first line,
// at most 5 hashtags for reels/facebook (Instagram API limit), sanitized by lib/social/caption.ts
export const PostCaptionBody = z.strictObject({ versionId: Uuid, platform: z.enum(ENUMS.platform) });
export const PostCaptionResponse = z.object({
  post_caption_he: z.string(), hashtags_he: z.array(z.string()), first_line_cta_he: z.string(),
});
// stored in projects.brief.post_caption {text_he, hashtags_he, platform, first_line_cta_he, generated_at} (the version may be locked);
// the downloads panel shows brief.post_caption when present, else version.script.post_caption_he

// v2, flag chat_edit (flag off → 404): plans edits only, writes nothing, 0 credits, bucket `rewrite`.
// Applying the plan = the existing routes (PATCH …/scenes/[sceneId], …/scenes/[sceneId]/regenerate)
export const EditPlanBody = z.strictObject({ versionId: Uuid, instructionHe: HeText(3, 500) });
export const EditPlanResponse = z.object({ plan: EditPlanV1 });            // EditPlanV1 from lib/ai/schemas (part 05, edit.chat.v1)
```

**שערים לפני כל פעולת LLM שמוציאה קרדיטים** (בסדר הזה; כולם **לפני** `begin_spend`, כך שחסימה לא עולה כלום):
1. `assertBudget()` (חלק 05) ← ‏503 `BUDGET_GUARD`.
2. מצב בחירות + קטגוריה פוליטית (`ELECTION_POLICY_BLOCKED`, ‏451, ‏`{ until }`), ואז `moderation.brief.v1` על התקציר/הטקסט, עם מטמון לפי hash הטקסט ב-`project_versions.moderation` (`{allowed, categories, reason_he, kind, checked_at, prompt_version, input_hash}`; נכתב רק בצד השרת) ← ‏`MODERATION_BLOCKED`, ‏422.
3. שער העובדות (`lib/hebrew/facts.ts`): כל placeholder מסוג `fact` (לפי `PLACEHOLDERS` של חלק 05 §8.2: מחיר · סכום · מספר · זמן · הנחה · דירוג · שם_לקוח · מספר_רישיון) בלי תשובה ב-`brief.fact_answers` ← ‏422 `MISSING_FACTS` ‏`{ facts }` (תוויות בעברית).
4. `begin_spend(ws, credits, actionKey, ref, 'spend:' || requestKey, plan.daily_credit_cap)` ← `resId` (השמירה פתוחה; עוד לא נצרך כלום).
5. הקריאה ל-AI, ואז שמירת התוצר (הגרסה או ההוקים), ורק אחר כך `commit_spend(resId, 'spend:' || requestKey)` (capture מלא ו-settle, אידמפוטנטי) ו-`complete_idempotency_key`. כל כשל בדרך ← `refund_reservation(resId, 'refund:' || resId, 'הפעולה נכשלה. הקרדיטים הוחזרו.')`, ואז תשובת 503/504 — או, אם זרם ה-NDJSON כבר התחיל, אירוע `error` עם `details.refunded` (§18.5). פונקציה שנקטעה באמצע משאירה שמירה פתוחה, וה-sweeper מחזיר אותה אחרי 6 דקות (§23). אם הפונקציה נקטעה אחרי השמירה של התוצר ולפני `commit_spend`, המשתמש מקבל את התוצר בחינם — כשל בטוח בכוונה.
6. **זמנים:** לנתיבי AI אינטראקטיביים `maxDuration = 300`; ‏`RunContext.deadlineAt` = תחילת הבקשה + ‏240 000 ms; ה-timeout של כל ניסיון = `min(POLICY[endpoint].timeoutMs, deadlineAt − now − 5 000)`; כשנשארו פחות מ-30 שניות אין ניסיון חדש ואין `repairOnce` — הנתיב נכשל ומחזיר את הקרדיטים. כל קריאת AI SDK ‏(`generateText`/`streamText`/`generateObject`/`streamObject`) עם `maxRetries: 0` ו-`abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(deadlineAt − now)])`; הניסיונות החוזרים הם של הלולאה שלנו ושל `models[]` ב-OpenRouter (חלק 05 §2.2).

**שכתובים (חינם):** `beats/[index]/rewrite` ו-`scenes/[sceneId]/rewrite` משתמשים ב-`scene.rewrite.v1`; `script/inflect` ב-`hooks.inflect.v1` על כל ביט. אם הגרסה נעולה (`is_version_locked`), השרת מפצל אותה קודם (כמו `POST …/versions`) ומחזיר את `versionId` החדש. גם `post-caption` חינמי ועובר את שער המודרציה (שלב 2) בלבד; הוא לא מפצל גרסה, כי התוצאה נשמרת ב-`projects.brief.post_caption`.

**`PATCH /api/projects/[id]/script` (עריכה ידנית, חינם):** הנתיב היחיד שמשנה טקסט של beats בגרסה קיימת בלי AI (חלק 03 §6.5, §6.12). כללי הגרסאות זהים לעריכת סצנות (§19.6), כדי שהקליינט יטפל בשניהם באותו קוד:
- `versionId` שייכת לפרויקט (אחרת ‏404 `NOT_FOUND`) וחייבת להיות `projects.current_version_id` — אחרת ‏409 `EDIT_CONFLICT` ‏`{ reason: "stale" }`.
- **נעילה:** `is_version_locked(versionId)` ← ‏409 `EDIT_CONFLICT` ‏`{ reason: "version_locked" }` בלי לשנות דבר; הקליינט מפצל (`POST …/versions {fromVersionId}`, ‏`source = 'user_edit'`) וחוזר על אותה בקשה עם ה-`versionId` וה-`updatedAt` החדשים (חלק 03 §9.2). השרת **לא** מפצל כאן מעצמו (בשונה מהשכתובים), כי שמירה אוטומטית שמפצלת בשקט הייתה יוצרת גרסה חדשה בכל הקשה.
- **התנגשות:** `ifUnmodifiedSince` ≠ ‏`project_versions.updated_at` ← ‏409 `EDIT_CONFLICT` ‏`{ reason: "stale", currentUpdatedAt }`.
- **מיזוג:** כל `beats[i]` מחליף רק את השדות שנשלחו ב-beat עם אותו `index` (אינדקס שלא קיים או כפול ← ‏400 `INVALID_INPUT` עם `issues`). אחר כך, בצורה דטרמיניסטית: `vo_full_he` = שרשור `beats[].vo_he` ברווח אחד (‏`S03`, חלק 05 §11.3); ‏`cta.vo_he` = ‏`vo_he` של ה-beat האחרון (‏`S04`); ב-beat הראשון (`role = 'hook'`) — ‏`hook.text_he` ← ‏`vo_he` ו-`hook.onscreen_he` ← ‏`onscreen_text_he` כשנשלחו. ‏`vo_tts_he` לא מחושב כאן: ‏`source` הופך ל-`'user_edit'`, ולכן צעד הקריינות משתמש ב-`normalizeForTts(vo_full_he)` (חלק 05 §15.1). התסריט המלא מאומת שוב ב-`ScriptV1` (Zod בלבד; כללי `lint` הם אזהרות בממשק) ← שגיאה ← ‏400 `INVALID_INPUT` עם `issues` על `beats.{i}.…`.
- **כתיבה:** `update project_versions set script, source = 'user_edit'` בלקוח הסודי (אחרי בדיקת ההרשאה בעטיפה; `project_versions_guard` ממילא חוסם גרסה עם עבודה), כך ש-`updated_at` מתעדכן; אין גרסה חדשה בכל שמירה. ‏`moderation` לא נמחק — ה-`input_hash` שלו כבר לא תואם, ולכן `storyboard`/`generate` מריצים את המודרציה שוב (שלב 2 למעלה). שער העובדות לא רץ כאן; ‏`POST …/generate` אוכף אותו (§19.8).
- **סטוריבורד קיים:** העריכה לא נוגעת ב-`storyboard` ובסצנות. כשלגרסה כבר יש `storyboard`, התשובה מחזירה `storyboardStale: true`, ושלב התצוגה המקדימה (חלק 03 §6.9, "אם אין סטוריבורד עדכני") מציע לבנות אותו מחדש.

### 19.6 עריכת סצנות

```ts
// lib/api/contracts/scenes.ts
export const ScenePatchBody = z.strictObject({
  ifUnmodifiedSince: IsoDateTime,
  onscreenTextHe: z.string().trim().max(80).optional(),           // ≤ 8 words enforced by lib/hebrew/lint.ts (warning, not error)
  voHe: z.string().trim().max(400).optional(),
  textPosition: z.enum(["top", "center", "bottom", "none"]).optional(),
  visualSource: z.enum(ENUMS.visual_source).optional(),
  userAssetId: Uuid.nullable().optional(),
  durationMs: z.number().int().min(1500).max(12000).optional(),
  focalX: z.number().min(0).max(1).optional(),
  focalY: z.number().min(0).max(1).optional(),
  kenburns: z.enum(["zoom_in", "zoom_out", "pan_start", "pan_end", "none"]).optional(),
  transitionIn: z.enum(["cut", "fade", "whip", "zoom", "slide", "wipe", "flash"]).optional(),
  sfx: z.enum(["none", "whoosh", "impact", "pop", "sizzle", "click", "riser", "cash", "camera_shutter"]).optional(),
  camera: z.enum(["static", "push_in", "pull_out", "pan_left", "pan_right", "tilt_up", "tilt_down", "handheld", "orbit", "drone"]).optional(),
  imagePromptEn: z.string().trim().max(1000).optional(),           // "מתקדם" only
  motionPromptEn: z.string().trim().max(600).optional(),
  // 2026-10-17 extension (0014, part 08): text slots of the trend overlay ("טקסט על השלט", "טקסט בהודעה") and user-media trims.
  // Only the Hebrew text of an EXISTING scenes.overlay may change here; kind, position, style and timing stay server-written (R7).
  overlayTexts: z.record(z.string().regex(/^[a-z][a-z0-9_]{0,30}$/), z.string().trim().min(1).max(60)).optional(),
  userMediaInMs: z.number().int().min(0).optional(),
  userMediaOutMs: z.number().int().min(1).optional(),
}).refine((b) => b.userMediaInMs === undefined || b.userMediaOutMs === undefined || b.userMediaOutMs - b.userMediaInMs >= 500,
  { params: { key: "custom" }, path: ["userMediaOutMs"] });
export const SceneDeleteQuery = z.object({ ifUnmodifiedSince: IsoDateTime });
export const SceneReorderBody = z.strictObject({ versionId: Uuid, sceneIds: z.array(Uuid).min(1).max(12), ifUnmodifiedSince: IsoDateTime });
export const ScenesIndexResponse = z.object({ scenes: z.array(z.object({ id: Uuid, index: z.number().int() })) });
```

- **כתיבה רק בשרת:** ל-`authenticated` אין הרשאת כתיבה ל-`scenes` ואין מדיניות `insert`/`update`/`delete` (§12.2, §12.4), כך שאין נתיב ישיר לטבלה. כל כתיבה לסצנות — הנתיבים כאן ו-`POST …/versions` (פיצול), וגם הצעדים של חלק 05 — נעשית בלקוח הסודי, ורק אחרי: (1) בדיקת התפקיד בעטיפה (`editor+`); (2) `is_version_locked(versionId)`; (3) מודרציית העריכה — `imagePromptEn`/`motionPromptEn` עוברים `promptSafety` ו-`moderation.brief.v1` ‏(`kind: image_prompt`, חלק 05 §21.1), וטקסטים בעברית נבדקים שוב ב-`generate` דרך ה-hash של המודרציה (§19.8).
- **נעילת גרסה:** כל שינוי בסצנה של גרסה נעולה ← ‏409 `EDIT_CONFLICT` ‏`{ reason: "version_locked" }`; הקליינט מפצל (`POST …/versions`) וחוזר על הפעולה על הגרסה החדשה (חלק 03).
- `ifUnmodifiedSince` מושווה ל-`scenes.updated_at` (בשינוי סצנה) או ל-`max(updated_at)` של סצנות הגרסה (מחיקה וסידור). התנגשות ← `EDIT_CONFLICT` ‏`{ reason: "stale" }`.
- `userAssetId` חייב להיות `upload_image`/`upload_video` של אותה סביבה; בחירה בו קובעת `visual_source = 'user_media'` (וידאו) או `'user_photo_animated'` (תמונה) אם לא נשלח אחרת.
- **`overlayTexts`** (מ-`0014`): כל מפתח חייב להיות שם של משבצת טקסט שקיימת ב-`scenes.overlay` הנוכחי לפי ה-`kind` שלו (`SceneOverlayV1`, חלק 08), והאורך נבדק מול `LENGTH_LIMITS` של נספח E §12 (למשל `sign_text` 40, `popup_title` 24, `popup_body` 60, `meme_caption` 40). סצנה בלי שכבה, או מפתח שלא קיים בשכבה ← 400 `INVALID_INPUT` `{ reason: "overlay_slot_unknown" }`; טקסט ארוך מדי ← `issues` על `overlayTexts.{slot}`. הטקסט החדש נכנס ל-`scenes_digest` (חלק 05) ועובר מודרציה ב-`generate` כמו כל טקסט אחר בסצנה (§19.8).
- **`userMediaInMs` / `userMediaOutMs`** (מ-`0014`) נשמרים ב-`scenes.user_media_in_ms` / `user_media_out_ms`. מותרים רק כש-`visual_source = 'user_media'` ונכס הווידאו קיים; `out` חייב להיות עד `duration_ms` של הנכס, וקטע של חצי שנייה לפחות. אחרת ← 400 `INVALID_INPUT` `{ reason: "trim_out_of_range" }`. החיתוך האוטומטי של `guidedAutocut` כותב את אותן עמודות בצד השרת, והעורך יכול לתקן אותו כאן.
- סצנת ההוק (`is_hook_scene`) תמיד באינדקס 0: סידור שמזיז אותה ← ‏400 `INVALID_INPUT` ‏`{ reason: "hook_scene_first" }`; מחיקתה ← `{ reason: "hook_scene_required" }`.
- מחיקה וסידור מעדכנים את `index` של כל הסצנות בטרנזקציה אחת (RPC פנימי `reindex_scenes(p_version uuid, p_ids uuid[])`, ‏service_role, §11.3, שמזיז קודם את כל הסצנות לאינדקסים זמניים מעל 1000 — לא שליליים, כי `index >= 0` — כדי לא להתנגש ב-`unique (version_id, index)`).

### 19.7 הערכת עלות

```ts
// lib/api/contracts/estimate.ts
export const EstimateBody = z.strictObject({
  versionId: Uuid.optional(),                                     // absent → estimate from project settings, approximate: true
  kind: z.enum(ENUMS.job_kind).default("full_generate"),
  formats: Formats,
  quality: z.enum(ENUMS.quality_tier),
  visualMix: z.enum(ENUMS.visual_mix),
  sceneIds: z.array(Uuid).max(12).optional(),                     // regenerate_scene
  what: z.enum(["visual", "clip", "keyframe"]).optional(),        // regenerate_scene
  alternatives: z.boolean().default(false),
  variants: z.strictObject({ count: z.number().int().min(1).max(5) }).optional(),
});
export const EstimateResponse = z.object({
  credits: z.number().int().nonnegative(),                        // what will be reserved now
  alreadySpent: z.number().int().nonnegative(),                   // script.generate + storyboard.generate already spent on this version
  approximate: z.boolean(),
  breakdown: z.array(z.object({ actionKey: z.string(), label_he: z.string(), units: z.number(), credits: z.number().int() })),
  balance: z.number().int(),
  sufficient: z.boolean(),
  planViolations: z.array(z.object({ limit: z.string(), required: z.string().nullable() })),   // drives locked controls; never thrown here
  alternatives: z.array(z.object({
    option: z.object({ quality: z.enum(ENUMS.quality_tier).optional(), visualMix: z.enum(ENUMS.visual_mix).optional(), formats: Formats.optional() }),
    credits: z.number().int(), delta: z.number().int(),
  })).optional(),
  variants: z.object({ count: z.number().int(), extraCredits: z.number().int() }).optional(),
  etaRange: z.object({ minSec: z.number().int(), maxSec: z.number().int() }),
});
```

ההערכה מחושבת **רק** ב-`lib/pipeline/estimate.ts` (חלק 05) מתוך `credit_costs` — אותה פונקציה בדיוק משמשת את `generate`, כך שהמספר על הכפתור הוא המספר שנשמר. ‏`credits` הוא מה שיישמר עכשיו; ‏`alreadySpent` (מ-`estimate().alreadySpent`) הוא מה שכבר הוצא על התסריט והסטוריבורד של הגרסה הנוכחית, והדיאלוג מציג "כולל התסריט שכבר נוצר: {credits + alreadySpent} קרדיטים בסך הכול" (חלק 03 §6.10). `balance` = יתרת סביבת החיוב (`get_credit_summary`). `etaRange` מ-`lib/pipeline/eta.ts`.

### 19.8 יצירה, יצירה מחדש של סצנה והרכבה מחדש

```ts
// lib/api/contracts/generate.ts
export const GenerateBody = z.strictObject({ versionId: Uuid, formats: Formats });
export const GenerateResponse = z.object({ jobId: Uuid, variantProjectIds: z.array(Uuid) });

export const RegenerateSceneBody = z.strictObject({
  what: z.enum(["visual", "clip", "keyframe"]),
  promptOverrideEn: z.string().trim().min(10).max(1000).optional(),
});
export const RenderBody = z.strictObject({ versionId: Uuid, formats: Formats });
export const JobStartedResponse = z.object({ jobId: Uuid });
```

**`POST …/generate` — סדר הפעולות** (מרחיב את §6.4 בנספח F):
1. הפרויקט והגרסה שייכים זה לזה; ‏`versionId` היא `current_version_id` (אחרת ‏409 `EDIT_CONFLICT` ‏`{ reason: "stale" }`); יש לגרסה `storyboard` וסצנות.
2. מגבלות תוכנית על הגרסה ועל הבקשה (`quality_tiers`, `max_duration_sec`, `visual_mix` + `max_ai_clips`/`max_ai_clip_sec`, `max_formats`, `music_generate`, `hook_variants_max`) ← `PLAN_LIMIT`. סביבת לקוח שעברה לקריאה בלבד אחרי הורדת תוכנית (`canGenerate(ws)` ב-`lib/workspace/limits.ts`, חלק 06 §5.4) ← ‏403 `PLAN_LIMIT` ‏`{ limit: "client_workspaces", reason: "client_workspace_read_only" }`.
3. מצב תחזוקה, `assertBudget()`, מצב בחירות ומודרציה (מטמון על הגרסה), שער העובדות, ואז **שער האישורים** (`assertAttestations(project, version)` ב-`lib/compliance/attestations.ts`), שנבדק על הגרסה שנוצרת — השרת קורא את `project_versions.script` שלה ולא סומך על הקליינט:
   1. `projects.video_type = 'testimonial'` דורש `brief.testimonial.consent_attested = true` **וגם** שורת `brief.attestations[]` מסוג `testimonial_requires_consent`.
   2. `flags = script.compliance.flags ∩ ATTESTED_FLAGS`, כש-`ATTESTED_FLAGS = [testimonial_requires_consent, urgency_must_be_true, results_claim, price_claim, kashrut_claim, minors]`. כל דגל כזה דורש שורת `brief.attestations[]` עם אותו `kind`. השרת דורס את `by` עם המשתמש המחובר (הכלל הקיים, §19.3) ודורש `at ≤ now()`.
   3. חסר משהו ← ‏422 `MISSING_FACTS` ‏`{ facts: [label…] }`, עם התוויות של `ATTESTATION_LABELS_HE`: `testimonial_requires_consent` ← "אישור בכתב מהלקוח על השימוש בהמלצה" · `urgency_must_be_true` ← "אישור שההגבלה בזמן או בכמות אמיתית" · `results_claim` ← "אישור שהתוצאה מבוססת על נתונים אמיתיים" · `price_claim` ← "אישור שהמחיר נכון ומעודכן" · `kashrut_claim` ← "אישור שיש תעודת כשרות בתוקף" · `minors` ← "הסכמה בכתב של ההורים".

   תסריט `reel_hook`/`brand_promo` שסומן `testimonial_requires_consent` עובר ברגע שתיבת הסימון (שנשמרת ב-`brief.attestations`) מסומנת.
   3b. **הסכמה למדיניות ה-AI:** אם אין למשתמש שורת `consents` מסוג `ai_content_policy` בגרסה הנוכחית של `/legal/ai-policy`, נרשמת שורה דרך `recordConsent()` (`source = 'generate'`, ‏`granted = true`, ‏`ip`, ‏`user_agent`; לקוח סודי, §21.4). השורה בדיאלוג האישור (חלק 03 §6.10) מודיעה על כך; אין תיבת סימון.
4. `credits = estimate(...)`.
5. `create_job_and_reserve(ws, project, version, 'full_generate', key, {formats}, credits, user, ORCHESTRATOR, limits.concurrent_jobs, limits.daily_credit_cap)` — כפילות ← אותה עבודה (202, `Idempotent-Replayed`).
6. **גרסאות הוק** (`brief.variant_hooks`, ‏§6.11 בנספח F): לכל אחת — פרויקט אח (`variant_group_id` משותף, `variant_of_project_id` = הראשי, גרסה עם סצנת הוק משלה ושאר הסצנות עם אותם נכסים), ואז `create_job_and_reserve` עם `options.afterJobId = primaryJobId`, מפתח `{key}:v{n}` ואותו `p_max_concurrent` של התוכנית (עבודות אחים לא נספרות במקביליות, §10.4). קבוצת הגרסאות מחויבת ומוגבלת כיצירה אחת. אם אחת מהן נכשלת ב-`INSUFFICIENT_CREDITS`, כל העבודות שנוצרו בבקשה מבוטלות (`refund_reservation`) והתשובה 402.
7. `orchestrator.start(jobId)` ← `jobs.run_id`, ‏`started_at`; ‏`projects.stage = 'voice'`. כשל בהפעלה ← העבודה `failed` + `refund_reservation` + ‏503 `PROVIDER_UNAVAILABLE`.
8. ‏`202 { jobId, variantProjectIds }`. האירוע `generation_confirmed` נשלח מהלקוח (`ConfirmGenerateDialog`) אחרי ה-202, לא מהשרת.

**`regenerate`:** שלב 3 שלו כולל את אותו שער אישורים (1)–(3) על הגרסה של הסצנה. עבודת `regenerate_scene` עם `options = { formats, sceneIds: [sceneId], what, promptOverrideEn }` (‏`formats` = הפורמטים של ההרכבה המוצלחת האחרונה), והערכה של המדיה החדשה לסצנה + הרכבה מחדש של כל הפורמטים האלה (`render.base` + `render.extra_format × (n−1)`), שמוצגת לפני האישור. הגרסה הנוכחית חייבת להיות כזו שהסצנה שייכת אליה; אם היא נעולה — הצנרת עובדת על פיצול (חלק 05 מחליט; ה-API רק מעביר).
**`render`:** עבודת `rerender` בלי מדיה חדשה, חוץ מ-`voice`/`captions` כשהקריינות, הקול או המהירות השתנו מאז ההרכבה האחרונה (העלות כלולה בהערכה).

### 19.9 עבודות

```ts
// lib/api/contracts/jobs.ts
export const JobResponse = z.object({ job: looseRow, steps: z.array(looseRow), scenes: z.array(looseRow) });
export const CancelJobResponse = z.object({ status: z.enum(ENUMS.job_status) });
```

- `GET /api/jobs/[id]`: ‏`job` (‏`JobDTO`), ‏`steps` (‏`JobStepDTO[]` ממוינים לפי `created_at`), ‏`scenes` (סצנות הגרסה של העבודה). זה נתיב ה-polling (5 שניות) — שאילתה אחת לכל טבלה, בלי כתובות חתומות.
- `POST /api/jobs/[id]/cancel`: מותר כש-`status ∈ {queued, running, waiting_external}`; מגדיר `canceled_at = now()` (לקוח סודי), קורא ל-`orchestrator.cancel`, ומחזיר את הסטטוס הנוכחי. הצנרת מסיימת את השלב הנוכחי, מחייבת רק שלבים שהסתיימו ומסלקת את השמירה (`settle_reservation`, חלק 05). אחרת ← ‏400 `INVALID_INPUT` ‏`{ reason: "not_cancelable" }`.

### 19.10 ציון הוק (`POST /api/projects/[id]/hook-score`, דגל `hook_score`)

הלוגיקה — הבדיקות הדטרמיניסטיות ב-`lib/hooks/score.ts` והפרומפט `hooks.score.v1` על הנתיב `llm.cheap` — שייכת לחלק 05, והממשק (`HookScoreBadge`, הפאנל ו"תקנו בקליק") לחלק 03. כאן החוזה והעמודה `project_versions.hook_score` (§2.3, §6).

```ts
// lib/api/contracts/projects.ts (hook score)
import { HookScoreV1 } from "@/lib/ai/schemas/hooks";     // part 05 §11.2 owns the Zod; it is exactly what the column stores
export const HookScoreBody = z.strictObject({ versionId: Uuid });
export const HookScoreResponse = z.object({
  versionId: Uuid,
  hookScore: HookScoreV1,       // { version: 1, score (int 0–100), checks[], suggestions[] (≤ 3, each with a fix action),
                                //   llm: HookScoreLlmV1 | null, degraded, input_hash, prompt_version, computed_at }
  cached: z.boolean(),          // true = read from the column, nothing recomputed
});
```

1. **הרשאה:** חבר בסביבה של הפרויקט, כולל צופים, כי הציון הוא נתון נגזר והתג מוצג לכולם. דגל כבוי, או גרסה שלא שייכת לפרויקט ← 404.
2. גרסה בלי סטוריבורד ← 400 `INVALID_INPUT` `{ reason: "no_storyboard" }`.
3. **אידמפוטנטיות לפי גרסה:** `input_hash` = sha256 של JSON קנוני של מה שהציון תלוי בו (הסצנות של הסטוריבורד, הכתוביות, פלטפורמת היעד והאורך; הרשימה המדויקת בחלק 05). אם `hook_score.input_hash` שווה ו-`degraded = false`, מחזירים את הערך השמור עם `cached: true`, בלי קריאה למודל.
4. אחרת: השכבה הדטרמיניסטית (בלי רשת), ואז `hooks.score.v1` עם תקציב זמן של 3.5 שניות. כשל או חריגת זמן של המודל אינם שגיאה: התשובה היא 200 עם `llm: null`, `degraded: true` וציון מהשכבה הדטרמיניסטית בלבד, והקריאה הבאה מנסה שוב. כל הנתיב עונה תוך 5 שניות.
5. **כתיבה:** `update project_versions set hook_score = …` בלקוח הסודי, גם בגרסה נעולה, בלי לקדם את `updated_at` (§2.3). שתי קריאות במקביל על אותו קלט כותבות את אותה תוצאה, ולכן האחרונה מנצחת בלי נזק.
6. **עלות:** 0 קרדיטים (`hooks.score`), ב-bucket `llm`. הציון הוא הערכה בלבד: הוא לעולם לא חוסם רינדור, פרסום רגיל או קמפיין. הממשק מציג לידו את המשפט "הערכה לפי כללי הוקים — לא הבטחה לתוצאות." (חלק 03).
7. דמו של תבנית טרנד הוא גרסה רגילה של פרויקט בסביבת הסטודיו (§16.3), ולכן גם הציון שלו נשמר באותה עמודה; איך כרטיס הטרנד מציג אותו — חלק 08.

### קריטריוני קבלה
- [ ] `POST /api/projects` בתוכנית החינמית עם 3 פרויקטים קיימים ← 403 `PLAN_LIMIT` ‏`{ limit: "projects_max", max: 3 }`.
- [ ] `PATCH` עם `qualityTier: "premium"` בתוכנית בסיס ← 403 `PLAN_LIMIT` ‏`{ limit: "quality_tiers", required: "business" }`.
- [ ] `PATCH` עם `ifUnmodifiedSince` ישן ← 409 `EDIT_CONFLICT` עם `currentUpdatedAt`.
- [ ] `POST …/script` בלי `Idempotency-Key` ← 400; עם מפתח ← זרם NDJSON שהשורה הראשונה שלו מגיעה תוך 3 שניות, ואירוע `done` עם `versionId` שתואם לגרסה שנשמרה.
- [ ] `PATCH …/script` על גרסת טיוטה משנה את ה-beat באותה גרסה (אין שורת `project_versions` חדשה), מחשב מחדש את `vo_full_he`, מעביר את `source` ל-`user_edit` ומחזיר `updatedAt` חדש; שליחה חוזרת עם ה-`ifUnmodifiedSince` הישן ← 409 `{ reason: "stale" }`; על גרסה שיש לה עבודה ← 409 `{ reason: "version_locked" }` והתסריט לא השתנה.
- [ ] `POST …/generate` כשהיתרה 40 וההערכה 107 ← 402 עם `{ needed: 107, balance: 40 }`, ואין שורת `jobs` חדשה.
- [ ] `POST …/generate` כשרצות 2 יצירות בתוכנית בסיס ← 409 `CONCURRENCY_LIMIT` ‏`{ max: 2, running: 2 }`.
- [ ] `POST …/generate` עם 2 גרסאות הוק בתוכנית בסיס (2 במקביל) כשכבר רצה יצירה אחת ← ‏202, ‏`variantProjectIds.length = 2`, שלוש עבודות ושלוש שמירות; עבודות האחים (`options.afterJobId`) לא נספרות במקביליות בשום סטטוס.
- [ ] `POST …/generate` ראשון של משתמש יוצר שורת `consents` אחת (`ai_content_policy`, ‏`source = 'generate'`); השני לא יוצר שורה נוספת.
- [ ] `POST …/generate` בפרויקט המלצה בלי `brief.testimonial.consent_attested` ← 422 `MISSING_FACTS` ‏`{ facts: ["אישור בכתב מהלקוח על השימוש בהמלצה"] }`; תסריט עם הדגל `price_claim` בלי שורת `brief.attestations` מתאימה ← ‏422 `{ facts: ["אישור שהמחיר נכון ומעודכן"] }`; אחרי סימון התיבה ← 202. אותו דבר ב-`…/scenes/[sceneId]/regenerate`.
- [ ] `POST …/estimate` אחרי יצירת תסריט וסטוריבורד מחזיר `alreadySpent = 3`.
- [ ] `POST …/post-caption` לא מחייב קרדיטים, שומר `brief.post_caption` עם הפלטפורמה, ועובד גם על גרסה נעולה.
- [ ] `PATCH` עם `renderOptions: { logo_bug: true }` ואחר כך `renderOptionsReset: ["logo_bug"]` משאיר `render_options = {}`.
- [ ] `GET /api/jobs/[id]` של סביבה אחרת ← 404 (לא 403).
- [ ] `PATCH` לסצנה של גרסה שכבר רונדרה ← 409 `{ reason: "version_locked" }`.
- [ ] `POST /api/projects` עם `trendSlug` של תבנית `retired` ← 404 `{ reason: "retired" }`; עם תבנית `published` ← פרויקט עם `trend_template_id`, `production_mode = 'ai'` ושורת `trend_template_uses` אחת; `productionMode: "guided"` כשהדגל `guided_filming` כבוי ← 400 `{ reason: "production_mode_unavailable" }`; `productionMode` בלי `trendSlug` ← 400.
- [ ] `post-caption` עם `platform: "reels"` מחזיר `first_line_cta_he` ולכל היותר 5 האשטגים.
- [ ] `PATCH` לסצנה עם `overlayTexts: { text_he: "…" }` בסצנה בלי שכבה ← 400 `{ reason: "overlay_slot_unknown" }`; `userMediaOutMs` מעבר לאורך הנכס ← 400 `{ reason: "trim_out_of_range" }`.
- [ ] `hook-score` פעמיים על אותה גרסה בלי שינוי ← השנייה `cached: true` ובלי שורת `ai_generations` חדשה; כשהמודל המדומה חורג מהזמן ← 200 עם `degraded: true` תוך 5 שניות; על גרסה שרונדרה — הציון נשמר ו-`updated_at` לא משתנה; צופה מקבל 200, וחבר בסביבה אחרת 404.

---

## §20. חוזי ה-API: העלאות, נכסים, הוקים, קולות, מודלים, שיתוף ואישורים

### 20.1 תקציר

| # | Method · Path | Auth · סביבה | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|
| 1 | `POST /api/uploads/sign` | editor · cookie | `uploads` | `200 { assetId, bucket, path, signedUrl, token, resumable }` | `INVALID_INPUT` (`mime_not_allowed`, `too_large`) |
| 2 | `POST /api/uploads/complete` | editor · asset | default | `200 { asset }` | `INVALID_INPUT` (`not_uploaded`, `content_mismatch`, `too_small`, `too_long`), ‏`MODERATION_BLOCKED` (תמונה/וידאו של משתמש) |
| 3 | `GET /api/assets/[id]/url` | member · asset | default | `200 { url, expiresAt }` | `NOT_FOUND` |
| 4 | `GET /api/hooks/search` | public | `hooks_search` | `200 { items, total, facets, page, pageSize }` | `INVALID_INPUT` |
| 5 | `POST /api/hooks/[id]/event` | public | `hooks_event` | `204` | — (שקט גם בכשל) |
| 6 | `POST /api/hooks/favorites` | user · cookie | default | `200 { on }` | `NOT_FOUND` |
| 7 | `POST /api/hooks/variations` | editor · cookie · **Idempotency** | `llm` | **NDJSON** `HookBatchV1`; ‏`done.workspaceHookIds` | `INSUFFICIENT_CREDITS`, `MODERATION_BLOCKED` |
| 8 | `POST /api/hooks/inflect` | user · cookie | `inflect` | `200 { text_he }` | `RATE_LIMITED` |
| 9 | `POST /api/voices/preview` | user · cookie | `voice_preview` | `200 { url, expiresAt }` | `NOT_FOUND` (קול לא פעיל) |
| 10 | `GET /api/models/options` | user · cookie | default | `200 { qualityTiers, advanced? }` | — |
| 11 | `POST /api/share` | editor · project | `share` | `201 { url, shareLinkId, expiresAt, emailSent }` | `PLAN_LIMIT` (`approval_links`), `INVALID_INPUT` (`no_render`; פרטי מאשר בקישור `public_view`) |
| 12 | `POST /api/approvals/[token]` | public + token | `approvals` | `200 { status }` | `NOT_FOUND` (טוקן לא תקף/פג/בוטל) |
| 13 | `POST /api/abuse-reports` | public | `public_forms` | `204` | `INVALID_INPUT` (נשמר עם `source = 'share_page'`) |
| 14 | `POST /api/invites/accept` | user | default | `200 { workspaceId }` | `NOT_FOUND`, `FORBIDDEN` (`invite_email_mismatch`), `PLAN_LIMIT` (`seats`) |

נתיבי הצילום המודרך (`/api/guided/*`, G1–G4) ונתיבי הטרנדים (`/api/trends*`, T1–T2) רשומים ב-§21b. הם משתמשים ב-`uploads/sign` וב-`uploads/complete` שלמעלה כמו שהם, עם השדות של הצילום המודרך (§20.2).

### 20.2 העלאות ונכסים

```ts
// lib/api/contracts/uploads.ts
export const UPLOAD_RULES = {
  logo:         { bucket: "brand-assets", maxBytes: 5 * 1024 ** 2,   mimes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"] },
  brand_image:  { bucket: "brand-assets", maxBytes: 20 * 1024 ** 2,  mimes: ["image/png", "image/jpeg", "image/webp"] },
  upload_image: { bucket: "uploads",      maxBytes: 25 * 1024 ** 2,  mimes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] },
  upload_video: { bucket: "uploads",      maxBytes: 500 * 1024 ** 2, mimes: ["video/mp4", "video/quicktime", "video/webm"] }, // webm: 0014
} as const;
export const RESUMABLE_THRESHOLD = 6 * 1024 ** 2;

export const UploadSignBody = z.strictObject({
  kind: z.enum(["upload_image", "upload_video", "logo", "brand_image"]),
  mime: z.string().max(100),
  bytes: z.number().int().positive(),
  filename: z.string().trim().min(1).max(200),        // stored in metadata.original_filename; never used as the object key
  brandKitId: Uuid.optional(),                        // required for logo / brand_image
  projectId: Uuid.optional(),                         // optional link (scene media)
  consentAttested: z.boolean().optional(),            // "יש לי הסכמה בכתב מכל מי שמופיע" → metadata.consent_attested {by, at}
  // guided filming (0014, part 08): stored as metadata { guided_shoot_id, shot_key, source }; upload_video only
  guidedShootId: Uuid.optional(),
  shotKey: z.string().regex(/^[a-z0-9_]{1,40}$/).optional(),
  captureSource: z.enum(["camera", "file"]).optional(),
}).superRefine((b, ctx) => {
  const r = UPLOAD_RULES[b.kind];
  if (!(r.mimes as readonly string[]).includes(b.mime)) ctx.addIssue({ code: "custom", path: ["mime"], params: { key: "invalid_enum" } });
  if (b.bytes > r.maxBytes) ctx.addIssue({ code: "custom", path: ["bytes"], params: { key: "too_big_number" } });
  if ((b.kind === "logo" || b.kind === "brand_image") && !b.brandKitId) ctx.addIssue({ code: "custom", path: ["brandKitId"], params: { key: "required" } });
  if (b.guidedShootId && (b.kind !== "upload_video" || !b.shotKey || !b.captureSource))
    ctx.addIssue({ code: "custom", path: ["guidedShootId"], params: { key: "custom" } });
  if (b.mime === "video/webm" && !b.guidedShootId) ctx.addIssue({ code: "custom", path: ["mime"], params: { key: "invalid_enum" } });
});
export const UploadSignResponse = z.object({
  assetId: Uuid, bucket: z.enum(["brand-assets", "uploads"]), path: z.string(),
  signedUrl: z.url(), token: z.string(),
  resumable: z.boolean(),                             // true when bytes > 6 MB → client uses TUS (see below)
});

export const UploadCompleteBody = z.strictObject({ assetId: Uuid });
export const UploadCompleteResponse = z.object({ asset: looseRow });

export const AssetUrlQuery = z.object({ download: z.enum(["1"]).optional() });
export const AssetUrlResponse = z.object({ url: z.url(), expiresAt: IsoDateTime });
```

**זרימת העלאה:**
1. `sign`: בודק כללים, יוצר `assetId`, נתיב (`paths.upload` / `paths.brandAsset` עם סיומת לפי ה-MIME, לא לפי שם הקובץ), שורת `assets` (`source='upload'`, `metadata.upload_state='pending'`, ‏`bytes` המוצהר) דרך הלקוח של המשתמש (RLS), ואז `createSignedUploadUrl(path)` עם הלקוח הסודי.
2. ≤ 6MB: `supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, { contentType: mime })`. ‏> 6MB: ‏`tus-js-client` אל `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable` עם `authorization: Bearer <access_token>`, ‏`apikey: <publishable>`, ‏`x-upsert: false`, ‏metadata ‏`{ bucketName, objectName: path, contentType: mime, cacheControl: "3600" }`, ‏`chunkSize: 6MB`; ה-RLS (`storage_upload_allowed`) מאשר רק את הנתיב הרשום.
3. `complete`: בודק שהאובייקט קיים וגודלו ≤ המגבלה, magic bytes, ‏probe (‏§13.2), מנקה SVG, ממיר HEIC, מעדכן `width/height/duration_ms/aspect_ratio/mime/bytes/sha256`, ‏`upload_state='ready'`. כשל ← מחיקת האובייקט, `upload_state='rejected'`, ‏`is_deleted=true`, ו-400 עם `reason`.
   **מודרציה של העלאות** (`moderation.upload.v1`, חלק 05 §10.14) — רק ל-`upload_image` (ה-JPEG השמור) ול-`upload_video` (הפריים הראשון, שמחולץ ב-`@remotion/media-parser`/ffmpeg); לא ל-`logo` ולא ל-`brand_image`. הקלט: התמונה (כתובת חתומה ל-10 דקות) ושם הקובץ. מותר ← `metadata.moderation = {allowed: true, categories: [], checked_at, prompt_version}`. נחסם ← מחיקת האובייקט, `upload_state='rejected'`, ותשובת ‏422 `MODERATION_BLOCKED` ‏`{ reason_he, categories }` (תוכן מיני שקשור לקטינים מפעיל גם התראת אדמין). תקלה אצל הספק ← הנכס נשמר עם `metadata.moderation = {pending: true}`, ה-cron ‏`cleanup` בודק אותו שוב, ו-`plan.ts` (חלק 05) לא משתמש בנכס כזה ברינדור עד שהבדיקה עוברת.
   **צילום מודרך** (מ-`0014`): `sign` עם `guidedShootId` בודק שהצילום שייך לאותה סביבה ושה-`status` שלו `planning` או `shooting`, ושומר ב-`assets.metadata` את `guided_shoot_id`, `shot_key` ו-`source` (מ-`captureSource`). `video/webm` מתקבל **רק** בזרימה הזו, כי רק `guidedAutocut` ממיר אותו ל-MP4 ב-H.264; ב-`complete` הוא מזוהה לפי חתימת EBML (`1A 45 DF A3`). הקישור לצילום עצמו (`guided_shoots.shots`) נעשה אחרי `complete`, ב-`POST /api/guided/shoots/[id]/shots/[shotKey]` (§21b).
4. `GET /api/assets/[id]/url`: קריאת השורה דרך הלקוח של המשתמש (RLS = ההרשאה); `is_deleted` או `upload_state ≠ ready` ← 404; אחרת כתובת חתומה לשעה (`download` עם שם ASCII כש-`?download=1`). `public-media` ← כתובת ציבורית.

### 20.3 ספריית ההוקים

```ts
// lib/api/contracts/hooks.ts
export const HookSearchQuery = z.object({
  q: z.string().trim().max(80).optional(),
  niche: Slug.optional(),                                   // or "universal"
  type: Slug.optional(),
  platform: z.enum(["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"]).optional(),
  goal: z.enum(ENUMS.hook_goal).optional(),
  gender: z.enum(ENUMS.hook_gender).optional(),
  season: Slug.optional(),
  featured: z.enum(["1"]).optional(),
  has_video: z.enum(["1"]).optional(),
  sort: z.enum(["popular", "new", "most_generated"]).default("popular"),
  page: z.coerce.number().int().min(1).max(50).default(1),
  pageSize: z.coerce.number().int().min(6).max(48).default(24),
});
// THE single hook-card contract (flat). Part 02 and part 03 import it from here; no local copies.
export const HookCardDTO = z.object({
  id: HookId, niche_slug: Slug.nullable(), niche_name_he: z.string().nullable(),
  niche_short_name_he: z.string().nullable(),
  niche_icon: z.string().nullable(),                        // lucide-react component name
  hook_type_slug: Slug, hook_type_name_he: z.string(), family_slug: Slug,
  why_it_works_he: z.string().nullable(),                   // from hook_types
  secondary_type_slug: Slug.nullable(),
  text_he: z.string(), platforms: z.array(z.enum(ENUMS.platform)), goal: z.enum(ENUMS.hook_goal), gender: z.enum(ENUMS.hook_gender),
  visual_direction_he: z.string(), placeholders: z.array(z.string()), season_slug: Slug.nullable(),
  season_name_he: z.string().nullable(),
  compliance_note_he: z.string().nullable(), is_featured: z.boolean(),
  sample_video_url: z.url().nullable(),                     // public-media URL built from sample_video_path
  sample_poster_url: z.url().nullable(),                    // public-media/hooks/{hook_id}.jpg; null when there is no video
  copies_count: z.number().int(), generations_count: z.number().int(), popularity: z.number().int(),
});
export const HookSearchResponse = z.object({
  items: z.array(HookCardDTO), total: z.number().int(), page: z.number().int(), pageSize: z.number().int(),
  facets: z.record(z.enum(["niche", "type", "platform", "goal", "gender", "season", "has_video"]), z.record(z.string(), z.number().int())),
});

export const HookEventBody = z.strictObject({ kind: z.enum(["copy", "generate", "share"]) });
export const HookFavoriteBody = z.strictObject({ hookId: HookId, on: z.boolean() });
export const HookFavoriteResponse = z.object({ on: z.boolean() });

export const HookVariationsBody = z.strictObject({
  sourceHookId: z.union([HookId, Uuid]).optional(),         // library hook id or a workspace_hooks uuid; absent → new hooks
  nicheSlug: Slug.optional(),
  topicHe: HeText(2, 80).optional(),                        // free text → never sent to analytics
  count: z.number().int().min(3).max(10),
  gender: z.enum(ENUMS.hook_gender).optional(),
  register: z.enum(ENUMS.register).optional(),
});
// NDJSON stream of HookBatchV1 (§18.5); on finish → workspace_hooks rows with project_id = null; `done.workspaceHookIds`.
// With sourceHookId: variations of that hook. Without it: hooks.generate.v1 on the workspace business profile (+ nicheSlug/topicHe)
// — the "AI hooks for my business" entry from /app/hooks?generate=1. Same price either way (hooks.generate, 1 credit).

export const HookInflectBody = z.strictObject({
  text: HeText(3, 160), targetGender: z.enum(ENUMS.hook_gender), speakerGender: z.enum(ENUMS.voice_gender).optional(),
});
export const HookInflectResponse = z.object({ text_he: z.string() });
```

- **`toHookCardDTO(row)`** (`lib/hooks/dto.ts`) הוא הממפה היחיד משורת `search_hooks` ל-`HookCardDTO`: ‏`sample_video_url` נבנה מ-`sample_video_path`, ו-`sample_poster_url` נגזר ממנו (אותו שם בסיס, סיומת `.jpg`: ‏`public-media/hooks/{hook_id}.jpg`, הפריים ב-1.0 שניות שנכתב בהעלאת סרטון הדוגמה באדמין); בלי סרטון ← `null`. ‏`featured`/`has_video` בשאילתה הם המחרוזת `"1"`, לא בוליאני. סדר `popular`: רלוונטיות (כשיש `q`), ואז `is_featured`, ואז `hook_popularity.score`, ואז `id`.
- **`GET /api/hooks/search`** קורא ל-`search_hooks` ול-`search_hooks_facets` עם `createStaticClient()` (‏anon, בלי עוגיות) ומחזיר `cache-control: public, s-maxage=300, stale-while-revalidate=3600`. ‏`offset = (page - 1) * pageSize`.
- **`POST /api/hooks/[id]/event`:** ‏`id` חייב להתאים ל-`HookId`; כפילות מאותו IP לאותו הוק ולאותו `kind` בתוך שעה נבלעת (Upstash `SET NX EX 3600`) כדי שהמונים לא ינופחו; אחרת `increment_hook_event` עם הלקוח הסודי. תמיד 204 (גם כשההוק לא קיים), כדי לא לחשוף מידע ולא לשבור את ההעתקה בממשק.
- **`POST /api/hooks/favorites`:** ‏`on: true` ← ‏insert (מתעלם מכפילות) עם `workspace_id` הנוכחי; `false` ← delete. הוק שאינו `published` ← 404.

### 20.4 קולות ומודלים

```ts
// lib/api/contracts/voices.ts
export const VoicePreviewBody = z.strictObject({ voiceId: Slug, text: HeText(2, 120).optional(), speed: z.number().min(0.8).max(1.2).optional() });
export const VoicePreviewResponse = z.object({ url: z.url(), expiresAt: IsoDateTime.nullable() });
// no text → public sample (public-media voices/{id}.mp3, expiresAt null)
// text → tts.preview route; cached at generated/{ws}/voice-previews/{sha256(voiceId|speed|normalized text)}.mp3; signed 1 h; free (voice.preview = 0)

// lib/api/contracts/models.ts
export const ModelOptionsQuery = z.object({ advanced: z.enum(["1"]).optional() });
export const ModelOptionsResponse = z.object({
  qualityTiers: z.array(z.object({
    tier: z.enum(ENUMS.quality_tier),
    label_he: z.enum(["טיוטה", "סטנדרט", "פרימיום"]),
    enabled: z.boolean(),
    reason: z.enum(["plan", "flag", "no_models"]).nullable(),       // why disabled
    creditsPerUnit: z.object({ image: z.number().int(), clipSecond: z.number().int() }),
  })),
  advanced: z.array(z.object({
    tier: z.enum(ENUMS.quality_tier),
    video: z.array(z.object({ slug: z.string(), display_name_he: z.string() })),
    image: z.array(z.object({ slug: z.string(), display_name_he: z.string() })),
  })).optional(),                                                       // only with ?advanced=1 ("מתקדם")
});
```

`enabled` = התוכנית מתירה (`limits.quality_tiers`) ∧ הדגל (`premium_video` לפרימיום) ∧ יש מודל פעיל ב-`model_routes` של `video.{tier}` ו-`image.{tier}`. ‏`creditsPerUnit` מ-`credit_costs` (`image.{tier}`, `clip.{tier}`).

### 20.5 שיתוף

```ts
// lib/api/contracts/share.ts
export const ShareCreateBody = z.strictObject({
  projectId: Uuid,
  kind: z.enum(ENUMS.share_kind),
  allowDownload: z.boolean(),
  // omitted → public_view: never; client_approval: 14. client_approval is 1–90 days (UI: 14 · 30 · 90);
  // a never-expiring approval link does not exist (DB check share_links_approval_expires)
  expiresInDays: z.number().int().min(1).max(90).optional(),
  versionId: Uuid.optional(),                                     // default: current_version_id
  // client_approval only (part 03 §8.2 "שם הלקוח / מייל הלקוח / הודעה ללקוח"); names = part 06 §12.5 template variables
  approverName: HeText(2, 80).optional(),                         // → share_links.approver_name → {approverName}
  approverEmail: z.email().optional(),                            // → share_links.approver_email; present → client_approval_request email
  senderNote: z.string().trim().min(1).max(300).optional(),       // → share_links.sender_note → {senderNote} + quote on /approve/[token]
}).refine((b) => b.kind === "client_approval" || (!b.approverName && !b.approverEmail && !b.senderNote),
          { path: ["kind"], params: { key: "custom" } });
export const ShareCreateResponse = z.object({ url: z.url(), shareLinkId: Uuid, expiresAt: IsoDateTime.nullable(), emailSent: z.boolean() });
```

- השורה נכתבת עם הלקוח הסודי, אחרי בדיקות התוכנית וההרשאה (אין מדיניות `insert` למשתמשים, §12). הטוקן: 32 בתים אקראיים ב-base64url; נשמר רק `sha256` שלו (`share_links.token_hash`). ה-URL: `${SITE_URL}/v/{token}` או `${SITE_URL}/approve/{token}` — מוצג פעם אחת; אפשר ליצור קישור חדש בכל רגע.
- `client_approval` דורש `limits.approval_links` ← אחרת 403 `PLAN_LIMIT`. לקישור `client_approval` תמיד יש תפוגה (ברירת מחדל 14 יום, עד 90); אין קישור אישור בלי הגבלה.
- **מיתוג:** המיתוג נקבע בזמן הצגה ושליחה: `resolveShareBranding(link)` ← `effective_white_label(link.workspace_id)` (§9). ‏`lib/share/branding.ts` מחזיר `{ whiteLabel, senderName, senderLogoUrl }`: ‏`senderName` הוא שם סביבת החיוב (הסוכנות) בסביבת לקוח, ואחרת שם העסק של הסביבה; ‏`senderLogoUrl` הוא הלוגו של ערכת המותג הראשית של סביבת החיוב. אין עמודת מיתוג בקישור, ולכן הפעלה או כיבוי של White label והורדת תוכנית חלים מיד גם על קישורים קיימים. המיילים `client_approval_request` ותוצאות האישור קוראים לאותה פונקציה בזמן השליחה (שם השולח והכותרת התחתונה, חלק 06 §12.1).
- **פרטי המאשר** (`client_approval` בלבד; בקישור `public_view` ← ‏400 `INVALID_INPUT`): ‏`approverName`, ‏`approverEmail` ו-`senderNote` נשמרים ב-`share_links.approver_name` / `approver_email` / `sender_note`. כש-`approverEmail` קיים, אחרי ה-insert נשלח המייל `client_approval_request` (חלק 06 §12.5; מפתח אידמפוטנטיות `approval_request:{shareLinkId}`) עם `{approverName}`, ‏`{agencyName}` (שם העסק/הסוכנות, כמו `senderName` בדף), ‏`{projectTitle}`, ‏`{senderNote}`, ‏`{expiresAt}` והקישור עם הטוקן — הטוקן הגולמי קיים רק בזיכרון של הבקשה הזו, ולכן המייל נשלח ממנה ולא מ-job מאוחר. ‏`emailSent` בתשובה = המייל יצא (`false` כשלא היה מייל, או כש-`sendEmail` דילג/נכשל; הקישור נוצר בכל מקרה). ‏`/approve/[token]` מציג את `sender_note` בציטוט מתחת לכותרת ומשתמש ב-`approver_name` כערך התחלתי לשדה "השם שלכם" (חלק 03 §8.4). המייל של המאשר לא מוצג בדף הציבורי.
- לפרויקט חייב להיות רינדור מוצלח לגרסה ← אחרת 400 `INVALID_INPUT` ‏`{ reason: "no_render" }`.
- דף `/v/[token]` ו-`/approve/[token]` (Server Components) מאתרים את הקישור לפי `sha256(token)` עם הלקוח הסודי, בודקים `revoked_at` ו-`expires_at`, מגדילים `view_count` (פעם אחת לכל צפייה, עם מניעת כפילויות לפי עוגייה), קוראים ל-`resolveShareBranding(link)` **בכל הצגה** (לא נשמר במטמון), ומנפיקים כתובות חתומות לשעה. טוקן לא תקף ← `notFound()`.

### 20.6 אישור לקוח, דיווח והזמנות

```ts
// lib/api/contracts/approvals.ts
export const ApprovalBody = z.strictObject({
  decision: z.enum(["approved", "changes_requested"]),
  name: HeText(2, 80),
  email: z.email().optional(),
  comment: z.string().trim().max(2000).optional(),
}).refine((b) => b.decision === "approved" || (b.comment?.length ?? 0) >= 3, { path: ["comment"], params: { key: "required" } });
export const ApprovalResponse = z.object({ status: z.enum(ENUMS.approval_status) });

export const AbuseReportBody = z.strictObject({
  shareToken: z.string().min(20).max(200),
  reason: z.enum(["likeness", "copyright", "hate", "political", "other"]),
  details: z.string().trim().max(2000).optional(),
  email: z.email().optional(),
  website: z.literal("").optional(),                              // honeypot: any value → silently 204, nothing stored
});

export const InviteAcceptBody = z.strictObject({ token: z.string().min(20).max(100) });
export const InviteAcceptResponse = z.object({ workspaceId: Uuid });
```

- **`POST /api/approvals/[token]`:** הקישור חייב להיות `client_approval`, לא מבוטל ולא פג. מכניס `approvals` (לקוח סודי) עם `version_id` של הקישור, ‏`decided_at = now()`; יוצר `notifications` מסוג `approval_received` לכל עורך+ בסביבה, ושולח מייל `approval_received` (חלק 06). החלטה שנייה על אותה גרסה מאותו קישור מותרת (שורה חדשה; ההיסטוריה נשמרת). אירוע `client_approval_submitted {decision}` בצד השרת.
- **`POST /api/abuse-reports`:** ממפה `shareToken` ל-`share_link_id`, ‏`project_id`, ‏`workspace_id`; שומר `source = 'share_page'` ו-`ip`; שולח מייל ל-`BRAND.emails.abuse` בתבנית `support_contact` עם הנושא "דיווח על תוכן". תמיד 204 (גם כשהטוקן לא נמצא). דיווחים ממקורות אחרים (`system`, ‏`support`) נכתבים בצד השרת בלבד, לא דרך הנתיב הזה.
- **`POST /api/invites/accept`:** עוטף את `accept_invite(p_token)` ומגדיר את עוגיית `ws` לסביבה החדשה. נקרא גם מ-`/auth/callback` כשיש `invite` בכתובת.

### קריטריוני קבלה
- [ ] `uploads/sign` עם `mime: "application/pdf"` ← 400 עם `issues[0].path = ["mime"]`; עם וידאו של 600MB ← 400.
- [ ] `uploads/sign` עם `video/webm` בלי `guidedShootId` ← 400; עם צילום מודרך של אותה סביבה ← 200, ו-`assets.metadata` מכיל `guided_shoot_id`, `shot_key` ו-`source`; עם צילום של סביבה אחרת ← 404.
- [ ] העלאת קובץ של 80MB ב-TUS מצליחה ממובייל (Playwright עם חיתוך רשת באמצע וחידוש).
- [ ] `assets/[id]/url` לנכס של סביבה אחרת ← 404; לנכס `pending` ← 404.
- [ ] `GET /api/hooks/search?q=נדל"ן&platform=tiktok&page=2` מחזיר `page: 2` ו-`facets.platform.tiktok` = `total`.
- [ ] 100 קריאות `copy` מאותו IP לאותו הוק בתוך שעה מגדילות את `copies_count` ב-1.
- [ ] `voices/preview` לקול לא פעיל ← 404; בלי טקסט ← כתובת ציבורית בלי קריאה ל-OpenRouter.
- [ ] `share` עם `kind: "client_approval"` בתוכנית בסיס ← 403 `PLAN_LIMIT` ‏`{ limit: "approval_links" }`.
- [ ] אישור עם טוקן מבוטל ← 404; "בקשת שינויים" בלי הערה ← 400.
- [ ] `uploads/complete` לתמונה שהמודרציה המדומה חוסמת ← 422 `MODERATION_BLOCKED`, האובייקט נמחק, ו-`upload_state = 'rejected'`; ללוגו המודרציה לא נקראת.
- [ ] `hooks/variations` בלי `sourceHookId` עם `nicheSlug: "dentists"` ← זרם NDJSON, קרדיט אחד, ועד 10 שורות `workspace_hooks` עם `project_id = null`.
- [ ] `abuse-reports` בלי `shareToken` ← 400; עם טוקן תקין ← שורה עם `source = 'share_page'`.

---

## §21. חוזי ה-API: חיוב, חשבון, הסכמות וטפסים ציבוריים

הלוגיקה העסקית של החיוב (חישובי מע״מ, יחסיות, החזרים, Grow, Morning) שייכת לחלק 06 (`lib/billing/*`); כאן החוזה, ההרשאות והשגיאות.

### 21.1 תקציר

| # | Method · Path | Auth | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|
| 1 | `POST /api/billing/checkout` | owner_admin · cookie (סביבת החיוב) | `billing` + `checkout_ip` | `200 { redirectUrl, sessionId }` | ‏400 `INVALID_INPUT` (`billing_profile_required`, `annual_disabled`, `use_plan_change`) · ‏403 `FORBIDDEN` (`checkout_temporarily_blocked`) · ‏429 `RATE_LIMITED` (`checkout`, `topup_daily`) · ‏503 `MAINTENANCE` ‏`{ scope: "checkout" }` |
| 2 | `GET /api/billing/checkout/[sessionId]` | owner_admin | default | `200 CheckoutStatus` | `NOT_FOUND` |
| 3 | `POST /api/billing/cancel` | owner | `billing` | `200 { effectiveAt, refundQuote, refundRequestId }` | `INVALID_INPUT` (`no_active_subscription`) |
| 4 | `GET /api/billing/cancel/quote` | owner | default | `200 { effectiveAt, refundEligible, refundQuote }` | — |
| 5 | `POST /api/billing/resume` | owner | `billing` | `200 { status, cancelAtPeriodEnd }` | `INVALID_INPUT` (`not_cancelable_state`) |
| 6 | `POST /api/billing/refund-request` | owner | `billing` | `201 { refundRequestId, quote }` | `INVALID_INPUT` (`not_eligible`) |
| 7 | `POST /api/billing/plan-change` | owner | `billing` | `200 PlanChangeResponse` | `INVALID_INPUT` (`same_plan`, `past_due`), `PAYMENT_FAILED` |
| 8 | `GET /api/billing/invoices/[id]` | owner_admin | default | `302` לכתובת חתומה (5 דקות) | `NOT_FOUND` |
| 9 | `POST /api/account/export` | user | `account` | `202 { requestId }` | `RATE_LIMITED` |
| 10 | `POST /api/account/delete` | user | `account` | `202 { requestId }` | ‏400 `INVALID_INPUT` (`confirm_text`, `transfer_ownership_first`) |
| 11 | `POST /api/account/whatsapp/start` (v2, דגל `whatsapp_notify`) | user | `whatsapp_verify` | `204` | `INVALID_INPUT` (`invalid_phone`), `RATE_LIMITED` (`whatsapp_verify`), ‏404 (דגל כבוי) |
| 12 | `POST /api/account/whatsapp/confirm` (v2, דגל) | user | `whatsapp_verify` | `200 { verifiedAt }` | `INVALID_INPUT` (`code_invalid`), ‏404 (דגל כבוי) |
| 13 | `POST /api/account/whatsapp/opt-out` (v2, דגל) | user | default | `204` | ‏404 (דגל כבוי) |
| 14 | `POST /api/consents` | public / user | `consents` | `204` | `INVALID_INPUT` |
| 15 | `POST /api/contact` | public | `public_forms` | `204` | `INVALID_INPUT` |
| 16 | `POST /api/newsletter` | public | `public_forms` | `204` | `INVALID_INPUT` |
| 17 | `GET /api/newsletter/confirm?token=` | public + token | `unsubscribe` | `303 → /?newsletter=confirmed` | `303 → /?newsletter=invalid` |
| 18 | `POST /api/unsubscribe?token=` | public + token | `unsubscribe` | `200` (RFC 8058 one-click) | `400` טוקן לא תקין |
| 19 | `GET /api/health` | public | `health` | `200 { ok, db, redis, version, time }` | ‏`503` (אותו גוף, `ok: false`) |

הטופס הציבורי של דף העסק (`POST /api/b/[slug]/lead`), חיבור Meta, הקמפיינים, הלידים, הפרסום הרגיל, בדיקת הדופק ותוכנית 30 יום רשומים ב-§21b.

### 21.2 חיוב

```ts
// lib/api/contracts/billing.ts
const PaidPlanId = z.enum(["starter", "business", "agency"]);
const PackId = z.string().regex(/^pack-[0-9]+$/);

export const CheckoutBody = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("subscription"), planId: PaidPlanId, cycle: z.enum(ENUMS.billing_cycle) }),
  z.strictObject({ kind: z.literal("topup"), packId: PackId }),
  z.strictObject({ kind: z.literal("update_card") }),
]);
export const CheckoutResponse = z.object({ redirectUrl: z.url(), sessionId: Uuid });
export const CheckoutStatus = z.object({
  status: z.enum(["created", "completed", "failed", "expired"]),
  kind: z.enum(["subscription", "topup", "update_card", "plan_change"]),
  planId: z.string().nullable(), packId: z.string().nullable(),
  creditsGranted: z.number().int().nullable(), invoiceId: Uuid.nullable(),
  failureMessageHe: z.string().nullable(),
});

export const CancelReason = z.enum(["too_expensive", "not_using_enough", "missing_feature", "video_quality",
                                    "switched_tool", "one_time_project", "other", "unspecified"]);
// money in API JSON = decimal shekels (…Ils, number, 2 dp). Serialized by toApiRefundQuote(q) from the internal
// part 06 RefundQuote (paidAg/consumedValueAg/feeAg/refundAg: Agorot) via toIlsNumber — e.g. refundAg 9817 → refundIls 98.17
export const RefundQuote = z.object({
  paymentId: Uuid, reasonCode: z.enum(["distance_14d", "extended_4m", "technical", "goodwill", "annual_prorata"]),
  paidIls: z.number(), creditsConsumed: z.number().int(), consumedValueIls: z.number(), feeIls: z.number(), refundIls: z.number(),
});
export const CancelBody = z.strictObject({
  reason: CancelReason.default("unspecified"),
  details: z.string().trim().max(500).optional(),
  requestRefund: z.boolean().optional(),
  extendedEligibility: z.boolean().optional(),          // "יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)" → refund_requests row, manual
});
export const CancelResponse = z.object({ effectiveAt: IsoDateTime, refundQuote: RefundQuote.nullable(), refundRequestId: Uuid.nullable() });
export const CancelQuoteResponse = z.object({ effectiveAt: IsoDateTime, refundEligible: z.boolean(), refundQuote: RefundQuote.nullable() });
export const ResumeResponse = z.object({ status: z.enum(ENUMS.subscription_status), cancelAtPeriodEnd: z.boolean() });

export const RefundRequestBody = z.strictObject({ paymentId: Uuid, extendedEligibility: z.boolean().default(false), details: z.string().max(500).optional() });
export const RefundRequestResponse = z.object({ refundRequestId: Uuid, quote: RefundQuote });

export const PlanChangeBody = z.strictObject({
  planId: z.enum(["free", "starter", "business", "agency"]),
  cycle: z.enum(ENUMS.billing_cycle),
  when: z.enum(["now", "period_end"]).optional(),       // only monthly → annual offers a choice; default per part 06 §5.1
  dryRun: z.boolean().default(false),                   // true → quote only, nothing changes (PlanChangeDialog)
});
// serialized by toApiPlanChange(q): chargeNowAg/newPriceAg (Agorot, part 06 §5.3) → chargeNowIls/newPriceIls via toIlsNumber
export const PlanChangeResponse = z.object({
  effectiveAt: IsoDateTime, chargeNowIls: z.number(), creditsGrantedNow: z.number().int(), immediate: z.boolean(),
  newCycle: z.enum(ENUMS.billing_cycle), newPriceIls: z.number(),
  downgradeImpacts: z.array(z.object({ limit: z.string(), current: z.number(), allowed: z.number() })),   // seats, brand_kits, client_workspaces; + meta_ad_accounts, meta_active_campaigns, meta_auto_rules, social_scheduled_max, landing_pages (part 06 §5.3–§5.4)
});
```

- **יחידות כסף:** שדות כסף ב-JSON הם שקלים עשרוניים (`…Ils`), מסודרים ב-`toIlsNumber`; בקוד החיוב הפנימי — `Agorot` (`…Ag`). ההמרה קורית רק בגבולות עם שם: `toAgorot()` מ-DB/API/ספק פנימה, `fromAgorot()` אל DB/RPC ואל פורמט הספק, ו-`toIlsNumber()` אל JSON של ה-API (`lib/billing/money.ts`, חלק 06). הסכמות כאן שומרות את השמות `*Ils: z.number()`.
- **סביבת החיוב:** כל נתיבי החיוב פועלים על `billing_workspace_id(ws)`; מסביבת לקוח ← 403 `FORBIDDEN` ‏`{ reason: "billing_on_parent" }`.
- **פרטי חיוב חובה** לפני `checkout`: שורת `billing_profiles` (שם משפטי ומייל לפחות) ← אחרת 400 `INVALID_INPUT` ‏`{ reason: "billing_profile_required" }`, והממשק פותח את `BillingProfileForm`.
- `cycle: "annual"` כשדגל `annual_billing` כבוי ← 400 `{ reason: "annual_disabled" }`.
- **שגיאות `checkout`:** מנוי (`kind: "subscription"`) כשכבר יש מנוי חי ← 400 `{ reason: "use_plan_change" }` (הממשק פותח את דיאלוג שינוי התוכנית); שלושה תשלומים שנכשלו בשעה אחת בסביבה ← חסימה ל-24 שעות, ‏403 `FORBIDDEN` ‏`{ reason: "checkout_temporarily_blocked" }` (חלק 06 §7.2); bucket ‏`checkout_ip` ← 429 `{ scope: "checkout" }`; יותר מ-6 חבילות ב-24 שעות ← 429 `{ scope: "topup_daily" }`; דגל `billing_checkout` כבוי או `app_settings.maintenance_mode.enabled` ← ‏503 `MAINTENANCE` ‏`{ until: null, scope: "checkout" }`.
- **`plan-change`:** אותה תוכנית ואותו מחזור כשקיים `scheduled_change` ← מבטל את השינוי המתוזמן ומחזיר 200 עם `immediate: true`, ‏`chargeNowIls: 0`. אותה תוכנית ומחזור בלי שינוי מתוזמן ← 400 `{ reason: "same_plan" }`. מנוי ב-`past_due` ← 400 `{ reason: "past_due" }`. ‏`when` נשלח רק במעבר מחודשי לשנתי (בורר "מתי לעבור?" בממשק); בשאר המעברים ברירת המחדל של חלק 06 §5.1 חלה. ‏`dryRun: true` מחזיר את אותה תשובה בלי לשנות דבר.
- `checkout` יוצר `checkout_sessions` (‏`status='created'`, סכום כולל מע״מ מ-`plans`/`credit_packs`), קורא ל-`PaymentProvider.createHostedCheckout` עם `amountAg = toAgorot(session.amount_ils)`, ‏`successUrl = ${SITE_URL}/app/billing/return?session={id}`, ‏`cancelUrl = ${SITE_URL}/app/billing?checkout=canceled`, ‏`webhookUrl = ${SITE_URL}/api/webhooks/payments/{provider}`, ושומר `provider_session_ref`. **הענקת קרדיטים קורית רק ב-webhook** — לעולם לא בדף החזרה.
- `GET /api/billing/invoices/[id]`: קריאת השורה דרך הלקוח של המשתמש (RLS = בעלים/מנהל), ואז ‏302 לכתובת חתומה ל-5 דקות מ-`invoices`.

### 21.3 חשבון

```ts
// lib/api/contracts/account.ts
export const AccountExportBody = z.strictObject({});
export const AccountDeleteBody = z.strictObject({ confirmText: z.literal("מחיקה") });   // the user types the word "מחיקה"
export const DataRequestResponse = z.object({ requestId: Uuid });

// profiles.notification_prefs (§4) — canonical shape
export const NotificationPrefs = z.strictObject({
  kinds: z.record(z.enum([...ENUMS.notification_kind, "monthly_plan"]),     // + the email-only key of monthly_plan_ready (part 06 §12.4)
    z.strictObject({ email: z.boolean(), whatsapp: z.boolean() })).default({}),
  whatsapp: z.strictObject({ phone_e164: z.string().regex(/^\+9725\d{8}$/), verified_at: IsoDateTime.nullable(),
    opted_in_at: IsoDateTime.nullable(), opted_out_at: IsoDateTime.nullable() }).optional(),
});

// v2, flag whatsapp_notify (flag off → 404 on all three)
export const WhatsappStartBody = z.strictObject({ phone: IsraeliPhone });          // normalized by normalizePhoneIL to +9725XXXXXXXX
export const WhatsappConfirmBody = z.strictObject({ code: z.string().regex(/^\d{6}$/) });
export const WhatsappConfirmResponse = z.object({ verifiedAt: IsoDateTime });
```

- **ייצוא:** שורת `data_requests` (`kind='export'`) ← workflow `dataExport(requestId)` (‏`lib/pipeline/account.ts`) שבונה ZIP ב-`exports/{user_id}/{request_id}.zip`: `profile.json`, ‏`workspaces.json` (שבהן המשתמש חבר), ‏`projects/{id}.json` (תסריטים וסטוריבורדים שיצר), ‏`consents.json`, ‏`invoices.json` + קובצי PDF (רק לבעלים/מנהלים), ‏`uploads/` (הקבצים שהעלה) ו-`renders/` (סרטונים סופיים) עד 1.8GB; מעבר לזה `README.txt` בעברית שמסביר שהסרטונים הנותרים זמינים להורדה באפליקציה. מייל `data_export_ready` מקשר ל-`/app/settings/privacy` (שם מונפקת כתובת חתומה לשעה). הקובץ נמחק אחרי 7 ימים.
- **מחיקה:** `user_deletion_blockers(userId)` לא ריק ← 400 `INVALID_INPUT` ‏`{ reason: "transfer_ownership_first", workspaces: [{ id, name, otherMembers }] }`. אחרת `data_requests` (`kind='delete'`), ביטול מנויים פעילים בסביבות שבבעלותו (`cancel_at_period_end = true`, בלי החזר אוטומטי), יציאה מכל ה-sessions (`auth.admin.signOut(userId, 'global')`), ו-workflow `accountDeletion(requestId)` לפי §9.6. ‏202 מיד; המייל `account_deleted` נשלח בסוף.
- **אימות WhatsApp (v2, דגל `whatsapp_notify`):** ‏`POST /api/account/whatsapp/start { phone }` מנרמל את המספר (`normalizePhoneIL`), שולח את תבנית `verify_code_he` עם קוד בן 6 ספרות, ושומר את ה-hash של הקוד ב-Upstash (`wa:verify:{userId}`, ‏10 דקות; לכל היותר 5 בשעה, bucket ‏`whatsapp_verify`) ← ‏204. ‏`POST /api/account/whatsapp/confirm { code }` משווה ב-`timingSafeEqual`, כותב `notification_prefs.whatsapp = { phone_e164, verified_at, opted_in_at }` ו-`audit_logs` ‏`notifications.whatsapp_opt_in` (עם IP ו-user agent) ← ‏`200 { verifiedAt }`; קוד שגוי או שפג ← 400 `INVALID_INPUT` ‏`{ reason: "code_invalid" }` (הטקסט בחלק 06 §13.2). ‏`POST /api/account/whatsapp/opt-out` כותב `opted_out_at = now()` ו-`notifications.whatsapp_opt_out` ← ‏204. רק הנתיבים האלה וה-webhook של WhatsApp (§22.6) כותבים את תת-האובייקט `whatsapp`.

### 21.4 הסכמות וטפסים ציבוריים

```ts
// lib/api/contracts/public.ts
// only the kinds a person grants or withdraws by hand; terms/privacy (ensureFirstLogin, checkout), biometric_* (likeness
// route, v2), ai_content_policy (generate, §19.8) and meta_ads_terms (first Meta connection, source "meta_connect", 0013, part 07)
// are written by their own server routes through recordConsent()
export const ConsentBody = z.strictObject({
  kind: z.enum(["marketing_email", "marketing_sms", "marketing_whatsapp", "analytics_cookies"]),
  granted: z.boolean(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}(\.\d+)?$/),           // must equal LEGAL_VERSIONS[kind], else 400 { reason: "version_mismatch" }
  source: z.enum(["signup", "settings", "newsletter", "cookie_banner"]),   // never "generate" / "unsubscribe" (server-only sources)
});

export const ContactBody = z.strictObject({
  name: HeText(2, 80),
  email: z.email(),
  phone: IsraeliPhone.optional(),
  topic: z.enum(["sales", "support", "accessibility", "privacy", "cancellation", "press"]),
  message: HeText(10, 5000),
  marketingOptIn: z.boolean().default(false),                          // never pre-checked (anti-spam s.30A)
  website: z.literal("").optional(),                                   // honeypot
});

export const NewsletterBody = z.strictObject({ email: z.email(), consent: z.literal(true), website: z.literal("").optional() });
export const EmailTokenQuery = z.object({ token: z.string().min(40).max(600) });
```

- **`POST /api/consents`:** ‏`recordConsent()` בלקוח הסודי, עם allow-list של (kind, source): ‏`marketing_email`/`marketing_sms`/`marketing_whatsapp` × ‏`settings`/`signup`/`newsletter`, ו-`analytics_cookies` × ‏`cookie_banner`/`settings`; כל צירוף אחר ← 400 `INVALID_INPUT`. משתמש מחובר ← `user_id` = הוא. אנונימי ← מותר רק `analytics_cookies` עם `cookie_banner` (בלי `user_id`/`email`). ל-`authenticated` אין הרשאת `insert` על `consents` (§12.2), כך שאין דרך אחרת לכתוב הסכמה.
- **`recordConsent({ userId, workspaceId?, email?, kind, granted, source, req })`** (`lib/consents/record.ts`) היא הכותבת היחידה של `consents`: לקוח סודי; ‏`ip` מ-`ipAddress(req)` ו-`user_agent` מהכותרת; ‏`created_at = now()`; ‏`version = LEGAL_VERSIONS[kind]` — גרסה שנשלחה מהקליינט חייבת להיות שווה לה, אחרת ‏400 `INVALID_INPUT` ‏`{ reason: "version_mismatch" }`. את שאר הסוגים כותבים רק השרתים שלהם: `terms`/`privacy` בהרשמה — `ensureFirstLogin`; ‏`terms` עם `source = 'checkout'` — נתיב ה-checkout; ‏`biometric_*` — נתיב ה-likeness (v2); ‏`ai_content_policy` — ‏`generate` (§19.8); ביטול `marketing_*` מקישור הסרה במייל — ‏`POST /api/unsubscribe` עם `source = 'unsubscribe'` (למטה). ביטול הסכמה = שורה חדשה עם `granted: false` (היסטוריה מלאה, אף פעם לא עדכון).
- **`POST /api/contact`:** honeypot מלא ← 204 בלי לשמור. אחרת `contact_messages` + מייל פנימי לתמיכה (Reply-To = הפונה). `marketingOptIn: true` ← אותה זרימה כמו `newsletter` (אישור כפול). ‏`topic = 'accessibility'` מסומן לרכז הנגישות.
- **`POST /api/newsletter`:** אם המייל ב-`email_suppressions` עם `bounce`/`complaint` ← 204 בלי מייל. אחרת מייל `newsletter_confirm` עם קישור `GET /api/newsletter/confirm?token=…`. ההסכמה `marketing_email` נרשמת **רק** באישור (`source = 'newsletter'`, ‏`email`, ‏`ip`), ושורת `unsubscribe` (אם הייתה) נמחקת מ-`email_suppressions`.
- **`POST /api/unsubscribe?token=`:** תומך ב-`List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058) ובטופס של `/unsubscribe`. טוקן לא תקין ← 400. עם טוקן תקין, בסדר הזה (לקוח סודי):
  1. **קודם, ובנפרד:** `insert into email_suppressions (email, reason) values (<email>, 'unsubscribe') on conflict (email) do nothing`. זו פעולה עצמאית, לא באותה טרנזקציה עם השלבים הבאים, כך שכשל בהמשך לא מבטל את ההסרה.
  2. לכל `kind` מתוך `marketing_email`, ‏`marketing_sms`, ‏`marketing_whatsapp`: ‏`recordConsent({ email, userId, kind, granted: false, source: 'unsubscribe', req })`, כש-`userId` הוא המשתמש ש-`auth.users.email` שלו שווה למייל (אם יש כזה; אחרת `null`). סך הכול 3 שורות `consents`. הערך `'unsubscribe'` מותר ב-check של `consents.source` (§8) ונכתב רק כאן; ‏`ConsentBody` לא מקבל אותו.
  3. סנכרון ההסרה ל-Resend (חלק 06).
  - **התשובה תמיד 200** כשהטוקן תקין, גם אם שלב 2 או 3 נכשל: השגיאה נרשמת בלוג וב-Sentry ולא מגיעה לנמען, וההסרה (שלב 1) כבר שמורה. הסרה חוזרת של אותו מייל מוסיפה שורות `granted: false` חדשות (היסטוריה) ולא נכשלת.
  - מיילי מערכת (קבלות, סרטון מוכן) ממשיכים להישלח.
- **טוקני מייל** (`lib/crypto.ts`): `signEmailToken({ email, purpose: "newsletter_confirm" | "unsubscribe", exp })` = ‏base64url(payload) + "." + base64url(HMAC-SHA256). המפתח נגזר ב-HKDF מ-`APP_ENCRYPTION_KEY` עם info `"email-tokens"`. ‏`newsletter_confirm` תקף 7 ימים; `unsubscribe` לא פג (קישור הסרה חייב לעבוד תמיד), ולכן האימות מנסה גם את המפתחות שב-`APP_ENCRYPTION_KEY_PREVIOUS` (חלק 06 §15.5).

### 21.5 בריאות המערכת (`GET /api/health`)

```ts
// lib/api/contracts/health.ts — public, bucket `health` (60/min/IP), outside the proxy matcher, cache-control: no-store
export const HealthResponse = z.object({
  ok: z.boolean(),
  db: z.enum(["ok", "error"]),        // supabase.rpc("health_ping") with the publishable key (anon)
  redis: z.enum(["ok", "error"]),     // Upstash PING
  version: z.string(),                // VERCEL_GIT_COMMIT_SHA, first 7 characters
  time: IsoDateTime,
});
```

- `200` כששתי הבדיקות עברו; `503` עם אותו גוף (`ok: false`) כשאחת מהן נכשלה. לכל בדיקה זמן קצוב של 2 שניות.
- התשובה לא כוללת סודות, שמות ספקים או גרסאות של תלויות. זה הנתיב שהניטור החיצוני בודק (חלק 06 §16.3).

### קריטריוני קבלה
- [ ] עורך שקורא ל-`POST /api/billing/cancel` ← 403 `FORBIDDEN` ‏`{ requiredRoles: ["owner"] }` (כמו בחלק 03).
- [ ] `checkout` בלי פרטי חיוב ← 400 `billing_profile_required`; עם פרטים ← `redirectUrl` של עמוד הסליקה (או של ה-mock), ושורת `checkout_sessions` בסטטוס `created`.
- [ ] חזרה לדף `/app/billing/return` לפני שה-webhook הגיע מציגה "ממתינים לאישור התשלום" (`status: created`), ואחרי ה-webhook — `completed` עם `creditsGranted`.
- [ ] `account/delete` עם `confirmText: "delete"` ← 400 (`confirm_text`); למשתמש שבבעלותו סביבה עם חברים ← 400 (`transfer_ownership_first`) עם רשימת הסביבות.
- [ ] `checkout` כשהדגל `billing_checkout` כבוי ← 503 `MAINTENANCE` ‏`{ until: null, scope: "checkout" }`; ‏`kind: "subscription"` כשיש מנוי פעיל ← 400 `use_plan_change`.
- [ ] `plan-change` לאותה תוכנית ומחזור בלי שינוי מתוזמן ← 400 `same_plan`; עם שינוי מתוזמן ← 200, ‏`chargeNowIls: 0`, ו-`scheduled_change` מתאפס.
- [ ] `GET /api/health` מחזיר 200 עם `db: "ok"` ו-`redis: "ok"`, בלי עוגיות ובלי `Set-Cookie`; כש-Upstash מדומה כלא זמין ← 503 עם `redis: "error"`.
- [ ] `consents` אנונימי עם `kind: "marketing_email"` ← 400.
- [ ] קישור `unsubscribe` עובד גם אחרי שנה; POST חד-קליקי מחזיר 200 בלי עוגיות ובלי Origin.
- [ ] POST חד-קליקי ל-`/api/unsubscribe?token=` כותב שורת `email_suppressions` אחת (`reason = 'unsubscribe'`) ו-3 שורות `consents` עם `granted = false` ו-`source = 'unsubscribe'` (אחת לכל `marketing_*`), ומחזיר 200; כש-`recordConsent` מדומה ככושל — עדיין 200, ושורת ההסרה קיימת.
- [ ] `POST /api/consents` עם `source: "unsubscribe"` ← 400.

---

## §21b. רשימת האב של נתיבי ההרחבה (2026-10-17)

כל נתיב של ההרחבה רשום כאן: שיטה, נתיב, הרשאה, אידמפוטנטיות, bucket, תשובה ושגיאות עיקריות. הסכמות המלאות ב-Zod והלוגיקה כתובות בחלק 07 (Meta, קמפיינים, לידים, פרסום רגיל, דף העסק, בדיקת דופק, תוכנית 30 יום) ובחלק 08 (טרנדים וצילום מודרך), בקבצים `lib/api/contracts/meta.ts`, `campaigns.ts`, `leads.ts`, `social.ts`, `landing.ts`, `plan.ts`, `trends.ts` ו-`guided.ts` (בדיקת הדופק ב-`meta.ts`). נתיבי האדמין של ההרחבה נמצאים ב-§24.1, ה-webhooks ב-§22.6 וה-cron-ים ב-§23. מזהי השורות (M, C, L, S, LP, HC, PL, T, G) הם המזהים שחלקים 03, 07 ו-08 מפנים אליהם.

### 21b.1 כללים

- **המוסכמות של §18 חלות כמו שהן:** עטיפת `route()`, Zod על כל קלט, מעטפת השגיאה `{ error: { code, message_he, details } }`, מעטפות ב-camelCase ו-DTO בשמות העמודות, ו-`Idempotency-Key` בנתיבים שמסומנים (§18.7). סכומים הם שקלים עשרוניים (`*Ils`, R1). יחידות המטבע של Meta (`MetaMinor`) קיימות רק בתוך `lib/meta/**` ולעולם לא בחוזה של API.
- **הרשאות:** member, editor+ ו-owner/admin של הסביבה, כמו ב-§19.2. נתיבי משאב (`/api/campaigns/[id]`, `/api/leads/[id]`, `/api/social/posts/[id]`, `/api/landing-pages/[id]`, `/api/plan/items/[id]`) גוזרים את הסביבה מהשורה, כמו §17.3; משאב של סביבה אחרת ← 404.
- **DTO ללקוח לעולם לא כולל** את `meta_tokens.token_enc`, `meta_connections.meta_user_id`, `meta_assets.min_budgets`, `ad_insights_daily.raw`, `social_post_metrics.raw`, `trend_templates.source_reference_id` או `trend_templates.do_not_copy`. שני האחרונים מוצגים רק במסכי Trend Studio של האדמין; טוקנים לא מוצגים בשום מקום, גם לא באדמין.
- **דגלים.** כל נתיב מחזיר 404 `NOT_FOUND` (בלי `details`) כל עוד הדגל שלו כבוי:

| נתיבים | דגל |
|---|---|
| `/api/meta/connect/*`, `/api/meta/assets*`, `/api/meta/preflight`, `/api/meta/disconnect`, `/api/meta/geo/*`, `/api/social/*` | `meta_connect` |
| `/api/meta/dashboard`, `/api/campaigns/*` | `meta_ads` (ו-C18 גם `meta_auto_rules`; היעד `lead_form` גם `meta_lead_forms`) |
| `/api/leads/*` | `meta_lead_forms` **או** `landing_pages`, או שיש לסביבה לידים קיימים (הלידים שייכים לעסק, ולכן לא נעלמים כשדגל נכבה) |
| `/api/meta/health-check*` | `meta_health_check` |
| `/api/landing-pages*`, `/api/b/*` (וגם הדפים `/b/[slug]`) | `landing_pages` |
| `/api/plan/*` | `monthly_plan` |
| `/api/trends*` | `trends` |
| `/api/guided/*` | `guided_filming` |
| `POST /api/projects/[id]/hook-score` (§19.10) | `hook_score` |

  נתיבי האדמין של ההרחבה (§24.1) לא תלויים בדגלים, כדי שאפשר יהיה להכין תוכן לפני ההשקה.
- **מתג החירום של `meta_ads`.** כשהדגל נכבה אחרי ההשקה, סביבה שיש לה קמפיין שפורסם (`ad_campaigns.published_at` לא ריק) ממשיכה לקבל את C1, C3, C9 (השהיה), C12 (סיום), C15 ו-M8, כדי שלעולם לא יישארו מודעות רצות בלי כפתור עצירה. כל מה שמשיק או מגדיל הוצאה מחזיר 404. באותו אופן, M6 (ניתוק ומחיקת נתוני Meta) עובד תמיד כשיש חיבור, גם כש-`meta_connect` כבוי.
- **`META_NOT_CONNECTED`** (409) מוחזר מכל נתיב של Meta, קמפיינים, פרסום רגיל ובדיקת דופק כשאין חיבור חי או שלא נבחרו נכסים, חוץ מ-M1, M2 ו-M6. נתיבי הלידים לא דורשים חיבור (לידים מדף העסק קיימים גם בלעדיו).

### 21b.2 Meta, קמפיינים, לידים ופרסום רגיל (חלק 07)

| # | Method · Path | Auth | Idem. | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|---|
| M1 | `POST /api/meta/connect/start` | owner/admin | — | `meta_write` | `200 MetaConnectStartResponse { authUrl }` + העוגייה `meta_oauth_state` | `PLAN_LIMIT` (`meta_ad_accounts`) |
| M2 | `GET /api/meta/connect/callback?code=&state=` | user (העוגייה) | — | default | `303 → /app/settings/integrations/meta?step=assets` (או `returnTo`) | הפניה עם `?error=denied\|no_assets\|state_mismatch\|exchange_failed\|tech_provider` (לא JSON) |
| M3 | `GET /api/meta/assets` | member | — | `meta_read` | `200 MetaAssetsResponse { connection, adAccounts, pages, instagramAccounts, selected, preflight }` | `META_NOT_CONNECTED` |
| M4 | `POST /api/meta/assets/select` | owner/admin | — | `meta_write` | `200 { preflight: MetaPreflightV1 }` (גוף `MetaAssetSelectBody { adAccountId, pageId, instagramId?, whatsappE164?, whatsappConfirmed?, privacyPolicyUrl? }`) | `INVALID_INPUT`, `META_API_ERROR`, `PLAN_LIMIT` (`meta_ad_accounts`) |
| M5 | `POST /api/meta/preflight` | member | — | `meta_read` | `200 { preflight }` | `META_NOT_CONNECTED` |
| M6 | `POST /api/meta/disconnect` | owner/admin | — | `meta_write` | `200 { status: "revoked" }` (גוף `{ purge: "tokens" \| "all", confirmText? }`) | `INVALID_INPUT` (`confirm_text`) |
| M7 | `GET /api/meta/geo/search?q=` | member | — | `meta_read` | `200 { items: GeoOption[] }` | — |
| M8 | `GET /api/meta/dashboard?range=7d\|14d\|30d` | member | — | `meta_read` | `200 MetaDashboardResponse { spendSummary, kpis, campaigns, actions }` | — |
| C1 | `GET /api/campaigns?status=&cursor=` | member | — | default | `200 { items: CampaignListItemDTO[], nextCursor }` | — |
| C2 | `POST /api/campaigns` | editor+ | — | `meta_write` | `201 { campaignId }` (גוף `CreateCampaignBody { projectId? \| variantGroupId? \| socialPostId?, goal?, seasonSlug?, duplicateOf? }`) | `NOT_FOUND`, `AD_NOT_ELIGIBLE`, `PLAN_LIMIT` (`meta_active_campaigns`, `meta_split_test`) |
| C3 | `GET /api/campaigns/[id]` | member | — | default | `200 { campaign: CampaignDTO, variants: AdVariantDTO[], changeLog }` | `NOT_FOUND` |
| C4 | `PATCH /api/campaigns/[id]` | editor+ | — | default | `200 { campaign }` (גוף `CampaignDraftPatch`, טיוטות בלבד, עם `ifUnmodifiedSince`) | `EDIT_CONFLICT` (`stale`, `not_draft`), `INVALID_INPUT` (`below_min_budget`, `radius_out_of_range`) |
| C5 | `POST /api/campaigns/[id]/copy` | editor+ | **חובה** | `llm` | **NDJSON** `AdCopyV1` (`ads.copy.v1`, 0 קרדיטים) | `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE` |
| C6 | `POST /api/campaigns/[id]/prepare` | owner/admin | **חובה** | `meta_write` | `202 { runId }` ← סטטוס `preparing` ← `ready` (Realtime) | `META_ACCOUNT_NOT_READY`, `AD_NOT_ELIGIBLE`, `MODERATION_BLOCKED`, `ELECTION_POLICY_BLOCKED`, `PLAN_LIMIT` (`meta_monthly_spend_cap_ils`) |
| C7 | `GET /api/campaigns/[id]/previews` | member | — | `meta_read` | `200 { previews: [{ variantId, placement, html }] }` (מטמון 30 דקות) | `INVALID_INPUT` (`not_ready`) |
| C8 | `POST /api/campaigns/[id]/publish` | owner/admin | **חובה** | `meta_write` | `200 { status: "in_review" }` (גוף `PublishCampaignBody { confirmSpend: true }`) | כמו C6, ועוד `META_API_ERROR` |
| C9 | `POST /api/campaigns/[id]/pause` | editor+ | — | `meta_write` | `200 { status }` | `META_API_ERROR` |
| C10 | `POST /api/campaigns/[id]/resume` | owner/admin | — | `meta_write` | `200 { status }` | `PLAN_LIMIT` (התקרה), `META_ACCOUNT_NOT_READY` |
| C11 | `POST /api/campaigns/[id]/budget` | owner/admin | — | שומר במסד (`meta_budget`) | `200 { campaign, budgetChangesLeft }` (גוף `BudgetChangeBody { dailyBudgetIls }`) | `RATE_LIMITED` (`meta_budget`), `PLAN_LIMIT`, `INVALID_INPUT` (`below_min_budget`) |
| C12 | `POST /api/campaigns/[id]/end` | owner/admin | — | `meta_write` | `200 { status: "completed" }` | — |
| C13 | `POST /api/campaigns/[id]/duplicate` | editor+ | — | `meta_write` | `201 { campaignId }` (גוף `{ newHooks?: boolean }`) | `PLAN_LIMIT` |
| C14 | `POST /api/campaigns/[id]/boost-winner` | owner/admin | **חובה** | `meta_write` | `200 { campaign }` (גוף `BoostWinnerBody { variantId, raiseBudgetPct: 0 \| 10 \| 20 }`) | `INVALID_INPUT` (`no_winner_yet`), `RATE_LIMITED` (`meta_budget`) |
| C15 | `GET /api/campaigns/[id]/insights?range=` | member | — | default | `200 CampaignInsightsResponse { kpis, daily, variants, sampleReady, freshness }` | — |
| C16 | `POST /api/campaigns/[id]/insights/refresh` | member | — | `meta_refresh` | `202` | `RATE_LIMITED` (`meta_refresh`) |
| C17 | `POST /api/campaigns/[id]/explain` | member | — | `llm` | **NDJSON** `InsightExplainV1` (`ads.insight_explain.v1`, 0 קרדיטים; מטמון 6 שעות לקמפיין ולטווח) | `PROVIDER_UNAVAILABLE` |
| C18 | `GET` · `PUT /api/campaigns/[id]/rules` | member · owner/admin | — | default | `200 { rules: AdRuleDTO[] }` (גוף ה-PUT: `AdRulesBody { rules: [{ kind, enabled, params }] }`) | `PLAN_LIMIT` (`meta_auto_rules`), `NOT_FOUND` (הדגל `meta_auto_rules` כבוי) |
| L1 | `GET /api/leads?status=&campaignId=&from=&to=&cursor=` | member | — | default | `200 { items: LeadDTO[], counts, nextCursor }` | — |
| L2 | `PATCH /api/leads/[id]` | editor+ | — | default | `200 { lead }` (גוף `LeadPatchBody { status?, notesHe?, assignedTo?, contacted? }`) | `NOT_FOUND`, `PLAN_LIMIT` (`meta_lead_inbox`) |
| L3 | `DELETE /api/leads/[id]` | owner/admin | — | default | `204` | — |
| L4 | `GET /api/leads/export.csv?from=&to=&status=` | owner/admin | — | `leads_export` | `200 text/csv` (UTF-8 עם BOM, כותרות בעברית) | `PLAN_LIMIT` (`meta_lead_inbox`) |
| S1 | `POST /api/social/posts` | editor+ | **חובה** | `social_publish` | `201 { postIds }` (גוף `CreateSocialPostBody`) | `INVALID_INPUT` (`video_spec`, `hashtags_max`, `schedule_past`, `quiet_day`), `PLAN_LIMIT` (`social_scheduled_max`), `RATE_LIMITED` (`ig_publish_daily`, `fb_reels_daily`) |
| S2 | `GET /api/social/calendar?from=&to=` | member | — | default | `200 CalendarResponse { posts, campaigns, seasons, quietDays }` (פריטי תוכנית 30 יום מגיעים מ-PL2 ומוצגים באותו לוח) | — |
| S3 | `PATCH /api/social/posts/[id]` | editor+ | — | default | `200 { post }` (מתוזמנים בלבד: שעה, טקסט, האשטגים) | `EDIT_CONFLICT` (`not_scheduled`) |
| S4 | `POST /api/social/posts/[id]/cancel` | editor+ | — | default | `200 { status: "canceled" }` | `EDIT_CONFLICT` |
| S5 | `POST /api/social/posts/[id]/retry` | editor+ | — | `social_publish` | `202` | `INVALID_INPUT` (`not_failed`) |
| S6 | `GET /api/social/posts/[id]/boost-eligibility` | member | — | `meta_read` | `200 BoostEligibilityResponse { eligible, reasonHe? }` | `META_API_ERROR` |

### 21b.3 דף העסק, בדיקת דופק ותוכנית 30 יום (חלק 07)

| # | Method · Path | Auth | Idem. | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|---|
| LP1 | `GET /api/landing-pages` | member | — | default | `200 { items, allowance }` (הדפים של הסביבה, כל הסטטוסים; `allowance` = `landingAllowance(ws)` של חלק 07 §14.1: `{ max, published, previewOnly, showBranding }`) | — |
| LP2 | `POST /api/landing-pages` | editor+ | **חובה** | `llm` | **NDJSON** `LandingPageContentV1`; האירוע `done` כולל `landingPageId` ו-`credits` (`landing.copy.v1`, `landing.generate` = 10 קרדיטים; בסביבה חינמית שלא רכשה חבילה נוצרת תצוגה מקדימה עם סימן מים שאי אפשר לפרסם) | `INSUFFICIENT_CREDITS`, `MODERATION_BLOCKED`, `PROVIDER_UNAVAILABLE`, `INVALID_INPUT` (`too_many_pages`: עד 10 דפים לסביבה בכל מצב) |
| LP3 | `POST /api/landing-pages/[id]/generate` | editor+ | **חובה** | `llm` | **NDJSON** — יצירה מחדש של דף קיים (גוף `RegenerateLandingBody { keep? }`; `landing.generate` = 10 קרדיטים) | כמו LP2 |
| LP4 | `PATCH /api/landing-pages/[id]` | editor+ | — | default | `200 { page }` (עריכת טקסטים בעורך, `slug`, `indexable`; חינם; עם `ifUnmodifiedSince`) | `EDIT_CONFLICT` (`stale`), `INVALID_INPUT` (`slug_invalid`, `slug_taken`, `slug_reserved`), `MODERATION_BLOCKED` |
| LP5 | `DELETE /api/landing-pages/[id]` | owner/admin | — | default | `204` (גם מוחק את `public-media/landing/{id}/`, §13.1) | — |
| LP6 | `POST /api/landing-pages/[id]/publish` | owner/admin | — | default | `200 { page, url }` | `PLAN_LIMIT` (`landing_pages`; בסביבה חינמית שלא רכשה חבילה `{ max: 0, required: "starter" }`), `INVALID_INPUT` (`legal_identity_missing`, `no_contact_channel`), `MODERATION_BLOCKED` |
| LP7 | `POST /api/landing-pages/[id]/unpublish` | owner/admin | — | default | `200 { page }` | — |
| LP8 | `POST /api/b/[slug]/lead` | public | — | `landing_lead` | `204` (honeypot מלא, או טופס שמולא בפחות מ-3 שניות ← 204 בלי לשמור) | `INVALID_INPUT`, `NOT_FOUND` (הדף לא פורסם), `RATE_LIMITED` (`landing_lead`) |
| LP9 | `POST /api/b/[slug]/view` | public | — | — (מניעת כפילות ב-Upstash, `lpview:{pageId}:{ipHash}`, 30 דקות) | `204` (מעלה את `views_count`; `landing_page_viewed` במדגם של 10%) | — |
| HC1 | `POST /api/meta/health-check` | owner/admin | — | `health_check` | `202 { reportId }` (שורת `ad_health_reports` ב-`running`, ואז הזרימה `metaHealthCheck({ reportId })`; 0 קרדיטים) | `META_NOT_CONNECTED`, `PLAN_LIMIT` (`health_checks_per_month`), `RATE_LIMITED` (`health_check`) |
| HC2 | `GET /api/meta/health-check/latest` | member | — | default | `200 { report, usedThisMonth, max }` (`report` = השורה האחרונה של `ad_health_reports` עם `HealthCheckReportV1`, `score`, `period_start`, `period_end`, `created_at`, או `null`) | — |
| PL1 | `POST /api/plan/generate` | editor+ | **חובה** | `plan_generate` | **NDJSON** `MonthlyPlanV1`; האירוע `done` כולל `planId` (`plan.month.v1`, 0 קרדיטים; גוף `GeneratePlanBody { month?, inputs }`, ברירת המחדל היא החודש הנוכחי לפי Asia/Jerusalem) | `RATE_LIMITED` (`plan_generate`), `PROVIDER_UNAVAILABLE` |
| PL2 | `GET /api/plan/current?month=` | member | — | default | `200 { plan, items }` | — |
| PL3 | `PATCH /api/plan/items/[id]` | editor+ | — | default | `200 { item }` (גוף `PlanItemPatch`: `status`, `plannedFor`, `projectId`, `socialPostId`, `campaignId`) | `NOT_FOUND`, `INVALID_INPUT` (`quiet_day`, `outside_month`) |

- **LP8 (הטופס הציבורי):** Zod על הגוף, honeypot `website` כמו בשאר הטפסים הציבוריים (§21.4; אין CAPTCHA, חלק 01), נוסח ההסכמה של הדף (חלק 07), כתיבה ל-`leads` בלקוח הסודי עם `source = 'landing_page'`, ואז Realtime `lead.created`, התראה `lead_received` ומייל `lead_new`. התשובה זהה לכל דף שלא פורסם, כך שאי אפשר לגלות דרכה אילו `slug` קיימים.
- **LP2 ו-LP3:** הקרדיטים נשמרים ב-`begin_spend` לפני הקריאה למודל ונגבים ב-`commit_spend` רק אחרי שהדף נשמר, לפי השערים של §19.5; כשל ← החזר מלא. "החל מ-₪X" ומחירים אחרים נכנסים לדף רק מתוך פרטי העסק שאושרו (נספח E), אף פעם לא מהמודל.

### 21b.4 טרנדים וצילום מודרך (חלק 08)

| # | Method · Path | Auth | Idem. | Rate limit | הצלחה | שגיאות עיקריות |
|---|---|---|---|---|---|---|
| T1 | `GET /api/trends?niche=&lifecycle=&cursor=` | user | — | `trends` | `200 { items: TrendCardDTO[], weekLabel, nextCursor }` (דרך `trend_feed`) | — |
| T2 | `GET /api/trends/[slug]` | user | — | `trends` | `200 { template: TrendTemplateDTO, adaptation: TrendNicheAdaptationV1 \| null, adEligibility }` | `NOT_FOUND` (`retired`) |
| T3 | `POST /api/projects` (#1 של §19.2) | editor+ | — | default | `201 { projectId, step }` עם `trendSlug`, `productionMode`, `src: "trend"` | `NOT_FOUND` (`retired`), `PLAN_LIMIT`, `INVALID_INPUT` (`production_mode_unavailable`) |
| G1 | `POST /api/guided/shoots` | editor+ | — | `llm` | `201 { shootId, shotList: GuidedShotListV1 }` (`guided.shotlist.v1`, 0 קרדיטים; גוף `{ projectId }`) | `NOT_FOUND`, `INVALID_INPUT` (`production_mode_unavailable`: התבנית לא `guided` או `hybrid`) |
| G2 | `POST /api/guided/shoots/[id]/shots/[shotKey]` | editor+ | — | default | `200 { shoot }` (גוף `{ assetId, source: "camera" \| "file" }`, אחרי `/api/uploads/complete`) | `INVALID_INPUT` (`too_short`, `too_long`, `wrong_orientation`) |
| G3 | `POST /api/guided/shoots/[id]/attest` | editor+ | — | default | `200 { shoot }` (גוף `{ peopleConsent: true }`; נרשם גם כ-`brief.attestations` מסוג `people_on_camera_consent`) | — |
| G4 | `POST /api/guided/shoots/[id]/autocut` | editor+ | **חובה** | `generate` | `202 { runId, credits }` (`guided.autocut` × מספר הקליפים) | `INSUFFICIENT_CREDITS`, `INVALID_INPUT` (`missing_shots`, `consent_required`) |

### 21b.5 חריגים ופרטים שחלים על כמה נתיבים

- **M2** הוא הנתיב היחיד שמחזיר הפניה במקום JSON גם בשגיאה: המשתמש חוזר מ-Facebook לדפדפן, ולכן כל כשל הוא `303` למסך האינטגרציות עם `?error=`. ה-`state` מושווה ב-timing-safe לעוגייה החתומה, והעוגייה נמחקת בכל תשובה.
- **L4 (CSV):** `Content-Type: text/csv; charset=utf-8`, BOM בתחילת הקובץ, `Content-Disposition: attachment; filename="leads-{yyyy-mm-dd}.csv"`. תא שמתחיל ב-`=`, `+`, `-` או `@` מקבל גרש בודד בתחילתו (הגנה מהזרקת נוסחאות), וכל ייצוא נרשם ב-`audit_logs` `leads.export` עם מספר השורות בלבד.
- **C7:** ה-HTML של התצוגות המקדימות מגיע מ-Meta ומוצג רק בתוך iframe מבודד במסך הבונה (`frame-src https://www.facebook.com` רק שם, חלק 06). התשובה עצמה `no-store`; המטמון של 30 דקות ב-Upstash (§18.6).
- **פעולות ביקורת** של הנתיבים כאן — לפי הטבלה של §24.1 ("פעולות הביקורת של ההרחבה").

### קריטריוני קבלה
- [ ] בדיקת כיסוי הנתיבים (§25.5) מוצאת את כל הנתיבים של §21b, וכל אחד מהם בנוי ב-`route()` ויש לו קובץ בדיקה.
- [ ] כשכל דגלי ההרחבה כבויים, כל נתיב בטבלאות שלמעלה מחזיר 404 בלי `details`; `/b/[slug]` מחזיר 404.
- [ ] כיבוי `meta_ads` בסביבה עם קמפיין פעיל: C9 ו-C12 עדיין עובדים, ו-C2, C6, C8 ו-C10 מחזירים 404.
- [ ] צופה שקורא ל-C9 או ל-L2 ← 403 `FORBIDDEN` עם `requiredRoles`; עורך שקורא ל-C8 ← 403.
- [ ] LP6 בסביבה חינמית שלא רכשה חבילה ← 403 `PLAN_LIMIT` `{ limit: "landing_pages", max: 0, required: "starter" }`; אחרי רכישת חבילה (`workspaces.has_paid = true`) דף אחד מתפרסם, עם "נבנה עם {{BRAND_NAME}}"; בתוכנית בסיס, פרסום של דף שני ← 403 עם `max: 1`.
- [ ] LP2 או LP3 בלי `Idempotency-Key` ← 400; שתי בקשות עם אותו מפתח ← דף אחד ו-10 קרדיטים פעם אחת; כשל מדומה של המודל ← החזר מלא.
- [ ] C8 פעמיים עם אותו מפתח ← פרסום אחד במטא (ב-mock) ושורת `ad_change_log` `publish` אחת.
- [ ] L4: הקובץ מתחיל ב-BOM, ותא עם `=HYPERLINK("x")` יוצא כ-`'=HYPERLINK("x")`.
- [ ] LP8 עם honeypot מלא ← 204 בלי שורת `leads`; עם טופס תקין ← שורה עם `source = 'landing_page'` ואירוע `lead.created`.

---

## §22. Webhooks

### 22.1 כללים לכל webhook

1. **גוף גולמי קודם:** `const raw = await req.text()` (עד 1MB; מעבר לזה ← 413 בלי עיבוד); אימות חתימה על המחרוזת הגולמית, ורק אחר כך `JSON.parse`. אין עטיפת `route()` עם Zod על הגוף (אבל כן `requestId`, לוגים וטיפול בשגיאות). אין הגבלת קצב על webhooks.
2. **השוואות** ב-`crypto.timingSafeEqual` בלבד. `OPENROUTER_CALLBACK_TOKEN_SECRET`, `GROW_WEBHOOK_SECRET` ו-`META_APP_SECRET` (מ-`0013`) יכולים להכיל רשימה מופרדת בפסיקים לצורך רוטציה: חותמים עם הראשון (`hmacSign(secrets[0], data)`) ומאמתים מול כולם (`hmacVerifyAny(secrets, data, mac)`), כש-`secrets = secretList(value)` מפצל את הערך לפי פסיקים; שלושת העזרים ב-`lib/crypto.ts` (חלק 06 §15.5).
3. **אידמפוטנטיות** דרך `webhook_events` (`unique (provider, external_id)`) ועזר אחד:

```ts
// lib/webhooks/claim.ts
export async function claimWebhook(i: { provider: WebhookProvider; externalId: string; eventType: string; signatureValid: boolean; payload: unknown })
  : Promise<{ state: "new" | "retry"; id: string } | { state: "duplicate" }> {
  // 1) insert … on conflict (provider, external_id) do nothing returning id      → "new"
  // 2) conflict: status in ('processed','ignored')                              → "duplicate"
  // 3) conflict: status = 'failed', or 'received' and received_at < now() - 2 min → set status='received', received_at=now() → "retry"
  // 4) conflict: 'received' and fresh (another delivery is processing right now) → "duplicate"
}
export async function finishWebhook(id: string, status: "processed" | "failed" | "ignored", error?: string): Promise<void>;
```

4. **תשובה מהירה:** עד ~10 שניות; עבודה כבדה (רינדור, הורדת קליפ) לעולם לא קורית בתוך ה-webhook — רק `resume` לתזמור.
5. חתימה לא תקינה ← שורת `webhook_events` עם `signature_valid = false`, ‏`status = 'failed'`, בלי payload, ותשובה 401 `WEBHOOK_INVALID_SIGNATURE`. אירוע חתום ותקין שאין מה לעשות איתו ← `ignored`, 2xx.

### 22.2 `POST /api/webhooks/openrouter/video`

```ts
// verifyOpenRouterSignature has ONE owner: part 05 §5.2 (lib/ai/openrouter/webhook.ts). This part only imports it.
// Canonical signature: (rawBody: string, header: string | null, secret: string,
//                       opts?: { nowMs?: number; toleranceSec?: number }) => boolean
// X-OpenRouter-Signature: "t=<unix seconds>,v1=<hex hmac>[,v1=<hex>…]" — it parses EVERY v1= value and accepts the
// signature if any of them matches (key rotation), with a 300 s tolerance on t.
// [M0-verify] header name, signed string and encoding: part 05 §5.2 owns the spike result (DECISIONS.md).
import { verifyOpenRouterSignature } from "@/lib/ai/openrouter/webhook";

// lib/ai/openrouter/webhook.ts (event shape; validated in spike 3, part 05 §5.2)
export const OpenRouterVideoEvent = z.looseObject({
  type: z.string().optional(),                              // "video.generation" [M0-verify]
  data: z.looseObject({
    id: z.string(),
    status: z.enum(["pending", "in_progress", "completed", "failed", "cancelled", "expired"]),
    error: z.unknown().optional(),
    usage: z.looseObject({ cost: z.number().optional() }).optional(),
  }).optional(),
  id: z.string().optional(), status: z.string().optional(),   // tolerate a flat payload shape
});
export function normalizeVideoEvent(e: z.infer<typeof OpenRouterVideoEvent>): { videoId: string; status: VideoStatus; costUsd: number | null; error: unknown };
```

```ts
// app/api/webhooks/openrouter/video/route.ts
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const url = new URL(req.url);
  const stepId = url.searchParams.get("s");
  const t = url.searchParams.get("t");
  const idemHeader = req.headers.get("x-openrouter-idempotency-key");

  const sigOk = verifyOpenRouterSignature(raw, req.headers.get("x-openrouter-signature"), env.OPENROUTER_WEBHOOK_SECRET);
  const tokenOk = !!stepId && !!t && hmacVerifyAny(secretList(env.OPENROUTER_CALLBACK_TOKEN_SECRET), stepId, t);   // comma list (rotation)
  if (!sigOk || !tokenOk) {
    await recordInvalidWebhook("openrouter", idemHeader, !sigOk ? "bad_signature" : "bad_token");
    return errorResponse("WEBHOOK_INVALID_SIGNATURE");
  }
  const ev = normalizeVideoEvent(OpenRouterVideoEvent.parse(JSON.parse(raw)));
  const claim = await claimWebhook({ provider: "openrouter", externalId: idemHeader ?? `${ev.videoId}:${ev.status}`,
                                     eventType: "video.generation", signatureValid: true, payload: JSON.parse(raw) });
  if (claim.state === "duplicate") return new Response(null, { status: 204 });

  const step = await getStep(stepId);                                   // admin client
  if (!step || step.provider_job_id !== ev.videoId) { await finishWebhook(claim.id, "ignored", "step_mismatch"); return new Response(null, { status: 204 }); }
  if (!["completed", "failed", "cancelled", "expired"].includes(ev.status)) { await finishWebhook(claim.id, "ignored", "non_terminal"); return new Response(null, { status: 204 }); }
  try {
    await orchestrator.resume(`or-video:${ev.videoId}`, { kind: "video", status: ev.status, videoId: ev.videoId, costUsd: ev.costUsd, error: ev.error });
    await finishWebhook(claim.id, "processed");
  } catch (e) {
    await finishWebhook(claim.id, "failed", String(e));                 // the sweeper (§23) polls waiting clip steps anyway
  }
  return new Response(null, { status: 204 });
}
```

- `callback_url` נבנה בצנרת: `${SITE_URL}/api/webhooks/openrouter/video?t=${hmacSign(secrets[0], stepId)}&s=${stepId}` (§6.6 בנספח F; `secrets = secretList(OPENROUTER_CALLBACK_TOKEN_SECRET)`) — שכבת הגנה שנייה מעל החתימה.
- `resume` אחרי שהעבודה כבר הסתיימה או בוטלה הוא no-op בצד התזמור (חלק 05); ה-webhook עדיין עונה 204.
- תשובה 204 גם לכשלים פנימיים אחרי אימות, כדי ש-OpenRouter לא ישלח שוב בלולאה; ה-sweeper משלים מצבים תקועים.

### 22.3 `POST /api/webhooks/render`

```ts
export const RenderWebhookBody = z.strictObject({
  renderRunId: Uuid,
  status: z.enum(["rendering", "uploading", "succeeded", "failed"]),
  progress: z.number().min(0).max(1),
  outputPath: z.string().max(500).optional(),         // renders/{ws}/{project}/{job}/{9x16}.mp4 when succeeded
  error: z.string().max(2000).optional(),
});
```

- אימות: `?t=` נבדק ב-`hmacVerifyAny(secretList(OPENROUTER_CALLBACK_TOKEN_SECRET), renderRunId, t)` (‏`timingSafeEqual`; נחתם ב-`hmacSign(secrets[0], renderRunId)`); שגוי ← 401 `WEBHOOK_INVALID_SIGNATURE`.
- `rendering`/`uploading`: עדכון `render_runs.progress` רק אם הוא גדל (מונוטוני), בלי `webhook_events`. ‏`succeeded`/`failed`: ‏`claimWebhook({ provider: "render", externalId: `${renderRunId}:${status}` })` ← `orchestrator.resume(`render:${renderRunId}`, …)`. ‏204.
- **רק כש-`RENDER_PROVIDER=lambda`** (חלופה, חלק 05 §19.2–§19.3): Remotion Lambda שולח משלוח משלו, לא `RenderWebhookBody`. ה-handler מזהה אותו לפי הכותרת `X-Remotion-Signature` (או `X-Remotion-Status`), מאמת את החתימה ב-`validateWebhookSignature` של `@remotion/lambda` על הגוף הגולמי (הסוד שהועבר ב-`webhook.secret`), ואז **מתרגם** ל-`RenderWebhookBody` לפני ה-Zod ולפני אימות ה-`?t=`: ‏`renderRunId` ← `customData.renderRunId`; ‏`type: "success"` ← ‏`status: "succeeded"`, ‏`progress: 1`, בלי `outputPath` (צעד האיסוף של חלק 05 מעתיק מ-`outputUrl` ב-S3 ל-`renders` וקובע את הנתיב); ‏`"error"` / `"timeout"` ← ‏`status: "failed"`, ‏`progress: 0`, ‏`error` = הודעת השגיאה הראשונה מ-`errors[]` או `"timeout"`. Lambda לא שולח אירועי התקדמות — `progress` מגיע מ-`getRenderProgress` בצעד. משלוח בלי `customData.renderRunId` ← 400 `INVALID_INPUT`. מבנה המשלוח והכותרות [M0-verify ספייק Lambda, רק אם עוברים לחלופה]. ב-`vercel-sandbox` וב-`local` הענף הזה לא קיים בפועל, והגוף תמיד `RenderWebhookBody`.

### 22.4 `POST /api/webhooks/payments/[provider]`

```ts
export async function POST(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const adapter = paymentProviders[provider];                 // "grow" | "mock" (later cardcom/sumit/payplus)
  if (!adapter || provider !== env.PAYMENT_PROVIDER) return errorResponse("NOT_FOUND");
  const raw = await req.text();
  let ev: VerifiedPaymentEvent;
  try { ev = await adapter.parseWebhook(raw, req.headers, new URL(req.url)); }  // signature / ?k= token / server-side re-query [M0-verify Grow]
  catch { await recordInvalidWebhook("payment", null, "unverified"); return errorResponse("WEBHOOK_INVALID_SIGNATURE"); }
  const claim = await claimWebhook({ provider: "payment", externalId: `${provider}:${ev.externalId}`, eventType: ev.eventType,
                                     signatureValid: true, payload: ev.raw });
  if (claim.state === "duplicate") return Response.json({ ok: true });
  try {
    await billingEngine.handlePaymentEvent(ev);              // part 06: payments row (unique provider+txn) → grant_credits → invoice → email
    await finishWebhook(claim.id, "processed");
    return Response.json({ ok: true });
  } catch (e) {
    await finishWebhook(claim.id, "failed", String(e));
    return errorResponse("INTERNAL_ERROR");                  // 500 → the gateway retries; claimWebhook returns "retry" next time
  }
}
```

- `app/api/webhooks/payments/[provider]/route.ts` הוא Route Handler אחד; ‏`/api/webhooks/payments/grow` ו-`/api/webhooks/payments/mock` הם המופעים שלו. החתימה בחלק 06 §8.1: ‏`PaymentProvider.parseWebhook(rawBody: string, headers: Headers, url?: URL)` — ה-URL נדרש לאימות `?k=&s=` של Grow.
- `handlePaymentEvent` אידמפוטנטי בעצמו: `payments` ייחודי על `(provider, provider_txn_id)`, וההענקה במפתח `grant:pack:{paymentId}` / `grant:plan:{subscriptionId}:{periodStartISO}`. משלוח כפול של אותו אירוע לא מעניק פעמיים, גם אם `webhook_events` נמחק.
- נתיב שאינו תואם ל-`PAYMENT_PROVIDER` הפעיל ← 404 (‏`mock` פעיל רק ב-dev, preview ו-e2e).

### 22.5 `POST /api/webhooks/invoices/[provider]`

אותו מבנה: `app/api/webhooks/invoices/[provider]/route.ts`, עם המופעים `/morning` ו-`/mock`, ו-404 כש-`provider !== env.INVOICE_PROVIDER` (כמו בתשלומים). ‏Morning: האירוע מאומת על ידי קריאה חוזרת ל-API של המסמך (`provider_doc_id`) [M0-verify אם יש חתימה]; מעדכן `invoices.allocation_number` ו-`pdf_path` (העתקת ה-PDF ל-`invoices/{ws}/{invoice_id}.pdf`). ‏`external_id = morning:{docId}:{eventType}`. ‏200.

### 22.6 webhooks נוספים

| נתיב | ספק (`webhook_provider`) | אימות | פעולה |
|---|---|---|---|
| `POST /api/webhooks/resend` | `resend` | Svix: `svix-id`, `svix-timestamp`, `svix-signature`, סוד `RESEND_WEBHOOK_SECRET` | `email.bounced` (hard) ← `email_suppressions('bounce')`; ‏`email.complained` ← `('complaint')` + ביטול הסכמות שיווק |
| `POST /api/auth/hooks/send-sms` (דגל `phone_otp`) | — | Standard Webhooks: `webhook-id`, `webhook-timestamp`, `webhook-signature`, סוד `SEND_SMS_HOOK_SECRET` [M0-verify פורמט ה-hook של Supabase] | שליחת SMS דרך `SMS_PROVIDER` בנוסח: "קוד הכניסה שלכם ל{{BRAND_NAME}}: {otp}. הקוד תקף ל-10 דקות. לא מוסרים אותו לאף אחד." ← ‏200 `{}`; דגל כבוי ← 404 |
| `GET` + `POST /api/webhooks/whatsapp` (v2, דגל `whatsapp_notify`) | `whatsapp` | `GET`: אתגר האימות של Meta — `hub.mode=subscribe` ו-`hub.verify_token` שווה לטוקן שנגזר ב-HMAC מ-`WHATSAPP_APP_SECRET` ← מחזיר את `hub.challenge`. ‏`POST`: ‏`X-Hub-Signature-256` = HMAC-SHA256 של הגוף הגולמי עם `WHATSAPP_APP_SECRET`; ‏`external_id` = מזהה ההודעה | סטטוסי מסירה ← לוג; הודעה נכנסת "הסרה" או "STOP" ← `notification_prefs.whatsapp.opted_out_at = now()`, ‏`audit_logs` ‏`notifications.whatsapp_opt_out`, ותשובת ההסרה של חלק 06 §13.3; דגל כבוי ← 404 |
| `GET /api/webhooks/meta` (מ-`0013`) | `meta` | אתגר האימות: `hub.mode = subscribe` ו-`hub.verify_token` שווה ל-`META_WEBHOOK_VERIFY_TOKEN` (השוואה ב-timing-safe) ← `200 text/plain` עם `hub.challenge`; אחרת 403 | אין שורת `webhook_events` |
| `POST /api/webhooks/meta` | `meta` | `X-Hub-Signature-256: sha256=<hex>` = HMAC-SHA256 של הגוף הגולמי, מול כל ערך של `secretList(META_APP_SECRET)`; חתימה שגויה ← 401 `WEBHOOK_INVALID_SIGNATURE` ושורה בלי payload | `claimWebhook` אחד **לכל שינוי** (`entry[].changes[]`), עם `external_id`: `leadgen:{leadgen_id}` · `issues:{object_id}:{entry.time}` · `inproc:{object_id}:{status_name}` · ובכל מקרה אחר `{object}:{entry.id}:{field}:{entry.time}`. `page.leadgen` ← הזרימה `metaLeadIngest`; `ad_account.with_issues_ad_objects` ← רענון סטטוס של האובייקט והתראה על `DISAPPROVED`/`WITH_ISSUES`; `ad_account.in_process_ad_objects` ← `resume('meta-obj:{id}', …)` של `metaPrepareCampaign`; `user.permissions` (אם Meta שולחת אותו [M0-verify]) עם הרשאה נדרשת שהוסרה ← `needs_reconnect`; כל השאר ← `ignored`. תשובה תוך כ-10 שניות; כל עבודה כבדה בזרימות. הלוגיקה בחלק 07 |
| `POST /api/webhooks/meta/deauthorize` | `meta` | גוף טופס עם `signed_request` = `base64url(sig).base64url(payload)`, HMAC-SHA256 עם כל ערך של `META_APP_SECRET`, `payload.algorithm = "HMAC-SHA256"`; חתימה שגויה ← 401 | `external_id = deauth:{user_id}:{issued_at}`; כל החיבורים עם אותו `meta_user_id` עוברים ל-`revoked` (`meta_deauthorize`) והטוקנים נמחקים; `audit_logs` `meta.deauthorize`; אירוע `meta_disconnected {by: "meta_deauthorize"}` ← 200 |
| `POST /api/webhooks/meta/data-deletion` | `meta` | `signed_request`, כמו למעלה | `external_id = deletion:{user_id}:{issued_at}`; שורת `meta_data_deletion_requests` עם `confirmation_code` (12 תווי base32) והזרימה `metaDataDeletion`; `audit_logs` `meta.data_deletion` ← `200 {"url":"https://{{DOMAIN}}/meta/data-deletion?code={code}","confirmation_code":"{code}"}`. משלוח כפול מחזיר את אותו קוד |

הרישום ל-webhooks של Meta: פעם אחת ברמת האפליקציה (משימת בעלים, חלק 07), ולכל לקוח בבחירת הנכסים (M4): `POST /act_{id}/subscribed_apps`, ו-`POST /{page_id}/subscribed_apps?subscribed_fields=leadgen` עם הטוקן של העמוד (רק כש-`meta_lead_forms` דולק). כשל ברישום נשמר ב-`meta_assets.preflight` (`leadgen_subscription`), לא נזרק.

### קריטריוני קבלה
- [ ] webhook של OpenRouter עם חתימה שגויה ← 401, שורת `webhook_events` עם `signature_valid = false`, ושום `resume`.
- [ ] חתימה תקינה אבל `?t=` של צעד אחר ← 401.
- [ ] אותו `X-OpenRouter-Idempotency-Key` פעמיים ← `resume` אחד בלבד; השני 204.
- [ ] webhook של קליפ שהגיע אחרי ביטול העבודה ← 204, בלי חיוב ובלי שינוי בסצנה.
- [ ] webhook תשלום כפול (אותו `txnId`) ← שורת `payments` אחת והענקה אחת; כשל ב-Morning באמצע ← 500, וניסיון חוזר של השער משלים את החשבונית בלי הענקה כפולה.
- [ ] `POST /api/webhooks/payments/mock` בפרודקשן ← 404; ‏`POST /api/webhooks/invoices/mock` כש-`INVOICE_PROVIDER=morning` ← 404.
- [ ] אחרי רוטציה (`OPENROUTER_CALLBACK_TOKEN_SECRET="new,old"`), callback עם `?t=` שנחתם בסוד הישן עדיין מתקבל, וכתובות חדשות נחתמות בסוד החדש.
- [ ] `GET /api/webhooks/whatsapp` כשהדגל כבוי ← 404; כשהוא דולק ועם `hub.verify_token` נכון ← מחזיר את `hub.challenge`.
- [ ] `GET /api/webhooks/meta` עם `hub.verify_token` שגוי ← 403; עם הנכון ← 200 עם `hub.challenge` כטקסט.
- [ ] `POST /api/webhooks/meta` עם `X-Hub-Signature-256` שגוי ← 401 ושורת `webhook_events` עם `signature_valid = false`; אותו `leadgen_id` פעמיים ← ליד אחד והתראה אחת; משלוח עם שני שינויים ← שתי שורות `webhook_events`.
- [ ] אחרי רוטציה (`META_APP_SECRET="new,old"`), webhook וגם `signed_request` שנחתמו בסוד הישן עדיין מתקבלים.
- [ ] `data-deletion` עם `signed_request` תקין ← JSON עם `url` ו-`confirmation_code` שתואם ל-`^[A-Z2-7]{12}$`; משלוח חוזר ← אותו קוד.

---

## §23. נתיבי Cron (Vercel Cron)

כל נתיב: `GET`, ‏`auth: "cron"` (`Authorization: Bearer ${CRON_SECRET}`; אחרת 401 בלי פירוט), ‏`maxDuration = 300`, נעילה ב-Upstash (`SET cron:{name} NX EX {ttl}`) כדי ששתי ריצות לא יחפפו, ותשובת JSON עם סיכום. כל ריצה נרשמת בלוג עם `cron`, משך ותוצאה, וכשל מדווח ל-Sentry (Cron Monitor).

**מודול משותף:** הלוגיקה של כל cron יושבת ב-`lib/cron/{name}.ts`, וה-route הוא עטיפה דקה. העטיפה המשותפת לוקחת את הנעילה `cron:{name}` ובסוף כותבת ל-Upstash את `cron:last:{name}` (‏JSON: `{ startedAt, ms, ok, summary }`). כך `POST /api/admin/ops/cron { name }` (§24.1) מריץ את אותה פונקציה בתוך התהליך, תחת אותה נעילה, ו-`GET /api/admin/ops/cron` מציג את הריצה האחרונה של כל cron בלי טבלה חדשה.

```jsonc
// vercel.json
{
  "crons": [
    { "path": "/api/cron/sweep-jobs",        "schedule": "* * * * *" },
    { "path": "/api/cron/billing-renewals",  "schedule": "5 * * * *" },
    { "path": "/api/cron/sync-models",       "schedule": "10 1 * * *" },
    { "path": "/api/cron/hook-of-the-day",   "schedule": "2 22 * * *" },
    { "path": "/api/cron/reminders",         "schedule": "0 7 * * *" },
    { "path": "/api/cron/cleanup",           "schedule": "30 2 * * *" },
    // 2026-10-17 extension: logic in lib/cron/{name}.ts, specified in part 07 (Meta, social, weekly summary) and part 08 (trends)
    { "path": "/api/cron/meta-insights-hourly",  "schedule": "20 * * * *" },
    { "path": "/api/cron/meta-insights-backfill", "schedule": "40 0 * * *" },
    { "path": "/api/cron/meta-review-poll",      "schedule": "*/15 * * * *" },
    { "path": "/api/cron/social-publish",        "schedule": "*/5 * * * *" },
    { "path": "/api/cron/social-insights",       "schedule": "50 * * * *" },
    { "path": "/api/cron/meta-token-health",     "schedule": "10 3 * * *" },
    { "path": "/api/cron/meta-rules",            "schedule": "45 * * * *" },
    { "path": "/api/cron/meta-leads-backfill",   "schedule": "20 1 * * *" },
    { "path": "/api/cron/weekly-summary",        "schedule": "0 6 * * 0" },
    { "path": "/api/cron/trends-lifecycle",      "schedule": "5 * * * *" }
  ]
}
```

| נתיב | נעילה | מה הוא עושה | תשובה |
|---|---|---|---|
| `/api/cron/sweep-jobs` | 55 ש׳ | (1) צעדי `clip:*` ב-`waiting_external` מעל 5 דקות ← polling ב-OpenRouter לפי `provider_job_id` ו-`resume`; (2) עבודות `running` עם `heartbeat_at` ישן מ-10 דקות ← שאלת התזמור על ה-run; מת או לא ידוע ← ביטול הריצה הקודמת (`orchestrator.cancel(run_id)`) ואז הפעלה מחדש מהצעד הראשון שלא הסתיים (פעם אחת; המונה `jobs.error_detail.restarts`), ובהפעלה מחדש השנייה ← `failed` + `refund_reservation`; (3) עבודות שרצות מעל 120 דקות מ-`started_at` ← `failed` עם `PROVIDER_TIMEOUT` + החזר מלא (‏`runStep` ו-`finalize` קוראים את `jobs.status` ועוצרים, בלי capture ובלי `succeeded`, כשהוא `failed` או `canceled`; חלק 05 §19.4); (4) עבודות אחים (`options.afterJobId`) שהעבודה הראשית שלהן הגיעה לשלב שמאפשר להתחיל (חלק 05) ← `orchestrator.start`; (5) **הוצאות אינטראקטיביות יתומות:** `sweep_orphaned_spends()` (§10.3) — שמירות בלי `job_id` שעדיין `open` אחרי 6 דקות ← `refund_reservation(id, 'refund:' || id, 'הפעולה לא הושלמה. הקרדיטים הוחזרו.')`, ומפתחות `api_idempotency_keys` ב-`in_progress` מעל 6 דקות ← `failed` | `{ swept: { polled, resumed, restarted, timedOut, variantsStarted, orphanedSpendsRefunded } }` |
| `/api/cron/billing-renewals` | 50 דק׳ | חלק 06 §4.2 (`runBillingCron`): התאמת סשנים פתוחים (`reconcilePendingCheckouts`), שינויים מתוזמנים, סיום מנויים שבוטלו, חיוב מנויים ב-`next_charge_at <= now()`, ניסיונות חוזרים ל-`past_due` (לפי `app_settings.dunning_retry_days`), סיום הגבייה החוזרת (`expired`), והענקות חודשיות למנויים שנתיים (`grant:plan:{subscriptionId}:{periodStartISO}`); כש-`app_settings.renewals_paused` דולק, רק שלבי החיוב (חידוש וניסיון חוזר) מדלגים | `{ reconciled, scheduled, ended, charged, failed, downgraded, granted }` |
| `/api/cron/sync-models` | 30 דק׳ | חלק 05: סנכרון `model_registry` מ-`/models` ו-`/videos/models`; לעולם לא מפעיל מודל; מסמן הוצאה משימוש ומתריע לאדמין אם מודל בנתיב פעיל נעלם | `{ added, updated, deprecated, alerts }` |
| `/api/cron/hook-of-the-day` | 10 דק׳ | בחירת הוק **להיום** (`todayIL()` בזמן הריצה; ה-cron ‏`2 22 * * *` UTC רץ אחרי חצות שעון ישראל, גם בשעון קיץ וגם בשעון חורף): `published`, נישה פעילה, לא נבחר ב-60 הימים האחרונים (`app_settings.hook_of_the_day.history`); עדיפות להוקים של עונה שתחילתה בתוך `promo_lead_days`, ואחר כך ל-`is_featured`; ביום שקט — רק הוק אוניברסלי לא שיווקי **ממשפחת** `education` (`hook_types.family_slug = 'education'`); כתיבה ל-`app_settings.hook_of_the_day = { hook_id, date, history }` ו-`revalidateTag('hooks:hotd', "max")` | `{ hookId, date }` |
| `/api/cron/reminders` | 30 דק׳ | `renewal_upcoming` למנויים שנתיים 7 ימים לפני החידוש; `low_credits` כש-`balance < lowThreshold(summary, planId)` (`lib/billing/credits.ts`, §10.5; בלי מכסה חודשית ← עלות סרטון אחד, אחרת `max(perVideoCredits, ceil(0.15 × planAllowance))`), לכל היותר פעם בשבוע לסביבה (לפי `notifications` מסוג `credits_low`); מכבד `email_suppressions` ו-`notification_prefs`; ומ-`0013` גם **תוכנית חודשית:** ביום הראשון של החודש לפי Asia/Jerusalem, לכל סביבה עם הדגל `monthly_plan` שבתוכנית האחרונה שלה `inputs.auto_next_month = true` ← `startFlow("monthlyPlanGenerate", { workspaceId, month }, { idempotencyKey: "plan:{ws}:{month}" })` (חלק 07 §8.3, §16.2), שמסתיים במייל `monthly_plan_ready` | `{ renewalUpcoming, lowCredits, monthlyPlans }` |
| `/api/cron/cleanup` | 50 דק׳ | (1) נכסים עם `is_deleted` ו-`purge_reason` בלי `storage_deleted_at` ← מחיקה מהאחסון (500 לריצה) וסימון; (2) `purge_deleted_content` לכל סביבה שטופלה; (3) העלאות `pending` מעל 24 שעות ← מחיקה; (4) קובצי `exports` מעל 7 ימים ← מחיקה; (5) `data_requests` תקועים (`processing` מעל שעה) ← הפעלה מחדש של ה-workflow; (6) Blob זמני של הרינדור שנשאר (`@remotion/vercel`) ← מחיקה; (7) העלאות עם `metadata.moderation.pending` ← הרצה חוזרת של `moderation.upload.v1` (חסימה ← כמו ב-§20.2); (8) תיקיות `generated/_admin-tests/{date}` בנות יותר מ-7 ימים ← מחיקה (§13.1); (9) מ-`0014`: קובצי ייחוס של טרנדים שעבר `retention_until` שלהם ← מחיקה של כל התיקייה `trend-refs/{reference_id}/` (המקור, `hook.mp4` והפריימים) ו-`trend_references.file_deleted_at = now()`; הניתוח נשאר (דוחות בדיקת הדופק בני 12 חודשים נמחקים ב-pg_cron ‏`purge-meta-raw`, §15) | `{ objectsDeleted, rowsPurged, pendingRemoved, exportsRemoved, requestsRetried, moderationRechecked, adminTestsRemoved, trendRefsDeleted }` |
| `/api/cron/meta-insights-hourly` | 50 דק׳ | תובנות למודעות שהיו פעילות ב-48 השעות האחרונות (היום ואתמול, `time_increment=1`, `level=ad`), ואז `refresh_managed_spend` לחודש הנוכחי והתראות 80% ו-100% של התקרה; חלק 07 | `{ ads, rows, accountsPaused }` |
| `/api/cron/meta-insights-backfill` | 50 דק׳ | 28 הימים האחרונים למודעות שהיו פעילות ב-35 הימים האחרונים (Meta מעדכנת נתונים עד 28 יום אחורה); דוחות אסינכרוניים לחשבונות גדולים; חלק 07 | `{ ads, rows, asyncReports }` |
| `/api/cron/meta-review-poll` | 12 דק׳ | אובייקטים ב-`PENDING_REVIEW`, `IN_PROCESS`, `WITH_ISSUES`, `PREAPPROVED` וסטטוס עיבוד של סרטונים ← הסטטוסים שלנו; `ACTIVE` ראשון ← מייל `meta_campaign_live`; `DISAPPROVED` ← `meta_ad_rejected`; קמפיינים שעבר `end_date` שלהם ← `completed`; חלק 07 | `{ checked, changed, completed }` |
| `/api/cron/social-publish` | 4 דק׳ | פוסטים `scheduled` עם `scheduled_at <= now() + 10 min` ← `socialPublish(postId)` (מפתח `social:{postId}:{attempt}`); הזרימה ישנה עד הזמן; חלק 07 | `{ started }` |
| `/api/cron/social-insights` | 40 דק׳ | מדדי פרסום רגיל אחרי שעה, 6 שעות, 24 שעות, 72 שעות ושבוע, ואחר כך פעם ביום עד היום ה-28; חלק 07 | `{ posts, snapshots }` |
| `/api/cron/meta-token-health` | 30 דק׳ | בדיקת הטוקן לכל חיבור `active` (`debug_token` ו-`/me`) וסנכרון נכסים (שמות, `account_status`, `has_funding_source`, `min_budgets`); טוקן לא תקף ← `needs_reconnect` עם התראה ומייל אחד; חלק 07 | `{ checked, needsReconnect, synced }` |
| `/api/cron/meta-rules` | 40 דק׳ | הערכה של `ad_rules` שהופעלו, על התובנות המסונכרנות; כל פעולה ← `ad_change_log` (`source = 'rule'`); חלק 07 | `{ evaluated, fired }` |
| `/api/cron/meta-leads-backfill` | 30 דק׳ | לידים שחסרים מטפסים של קמפיינים שהיו פעילים ב-90 הימים האחרונים, מאז `meta_created_time` האחרון; התראה מרוכזת אחת ולא התראה לכל ליד; חלק 07 | `{ forms, inserted }` |
| `/api/cron/weekly-summary` | 50 דק׳ | סיכום יום ראשון (מייל `weekly_results`, ו-WhatsApp כשמופעל) רק לסביבות עם הוצאה או פרסום באותו שבוע; מפתח `weekly_results:{ws}:{isoWeek}`; חלק 07 | `{ workspaces, sent }` |
| `/api/cron/trends-lifecycle` | 10 דק׳ | מפרסם תבניות עם `publish_at <= now()` (`status = 'published'`, `published_at`, `published_week`), מוציא משימוש תבניות שעבר `expires_at` שלהן, `revalidateTag('trends', "max")`; ביום ראשון אחרי 08:00 שעון ישראל שולח `trends_weekly` פעם אחת בשבוע ISO; חלק 08 | `{ published, retired, weeklySent }` |

**cron-ים של ההרחבה** (עשרה; סך הכול 16 [M0-verify את מגבלת מספר ה-cron בתוכנית Pro של Vercel]): כולם עוברים דרך אותה עטיפה (`CRON_SECRET`, נעילה `cron:{name}`, `cron:last:{name}`, Sentry Cron Monitor), והלוגיקה שלהם ב-`lib/cron/{name}.ts` לפי חלקים 07 ו-08. כל אחד מסתיים מיד (`{ skipped: "nothing_to_do" }`) כשאין לו עבודה: אין חיבור חי, אין קמפיין שפורסם, אין פוסט מתוזמן, או שהדגל של התחום כבוי ואין נתונים קיימים. ה-cron-ים של הקמפיינים (`meta-insights-*`, `meta-review-poll`, `weekly-summary`) ממשיכים לרוץ כל עוד יש קמפיין שפורסם, גם כש-`meta_ads` כבוי (§21b.1); `meta-rules` רץ רק כש-`meta_auto_rules` דולק, ו-`trends-lifecycle` רק כש-`trends` דולק. הזמנים ב-UTC, ושום cron לא מחזיק את הנעילה יותר מהזמן שבטבלה.

### קריטריוני קבלה
- [ ] קריאה בלי `CRON_SECRET` ← 401; שתי קריאות מקבילות ל-`sweep-jobs` ← השנייה מחזירה `{ skipped: "locked" }`.
- [ ] עבודה עם `heartbeat_at` ישן מ-10 דקות מופעלת מחדש פעם אחת, ובפעם השנייה נכשלת עם החזר מלא.
- [ ] הוק היום לא חוזר על עצמו בתוך 60 יום (בדיקה עם 61 ריצות מדומות).
- [ ] בדיקות יחידה של הוק היום: ריצה ב-22:02 UTC סביב 2026-10-25 (מעבר משעון קיץ לשעון חורף) בוחרת הוק לתאריך הישראלי של אותו יום (`todayIL()`), לא למחר; ביום שקט נבחר רק הוק אוניברסלי ממשפחת `education`.
- [ ] שמירה של `begin_spend` בלי `commit_spend`, בת יותר מ-6 דקות, מוחזרת בריצת `sweep-jobs` הבאה (`orphanedSpendsRefunded: 1`), ומפתח האידמפוטנטיות שלה עובר ל-`failed`.
- [ ] עבודה שרצה יותר מ-120 דקות מ-`started_at` נכשלת עם `PROVIDER_TIMEOUT` והחזר מלא.
- [ ] אחרי `cleanup`, אין אובייקט באחסון לנכס עם `storage_deleted_at`, ואין שורת `assets` שהאובייקט שלה חסר (למעט `rejected`).
- [ ] `vercel.json` מכיל בדיוק 16 cron-ים, ולכל נתיב יש קובץ ב-`lib/cron/`; `social-publish` מתחיל פוסט שמתוזמן לעוד 8 דקות ולא מתחיל פוסט שמתוזמן לעוד 20 דקות; ריצה מקבילה של `meta-insights-hourly` מחזירה `{ skipped: "locked" }`.
- [ ] אחרי `cleanup`: קובץ ייחוס שעבר `retention_until` נמחק מ-`trend-refs` ו-`file_deleted_at` מתמלא, והניתוח שלו עדיין נקרא באדמין; דוח בדיקת דופק בן 13 חודשים נמחק.

---

## §24. Admin API ו-Server Actions

### 24.1 `/api/admin/*`

כל נתיב: `auth: "platform_admin"` (‏`platform_admin_status()` = `ok`, כלומר דגל + session ברמת `aal2`, דרך הלקוח של המשתמש), bucket ‏`admin` (120 לדקה), לקוח סודי לכל השאר, Zod על כל קלט, ו**כל פעולה כותבת יוצרת `audit_logs`** עם `action` מהרשימה הקנונית שלמטה, `actor_id`, ‏`ip`, ‏`target_type`, ‏`target_id` ו-`metadata` עם before/after של השדות שהשתנו. שינוי שנוגע בדפים ציבוריים קורא ל-`revalidateTag(tag, "max")` המתאים (חלק 02).

**הרשימה הקנונית של פעולות הביקורת** (`audit_logs.action`, regex `^[a-z_]+(\.[a-z_]+)+$`; אין שמות אחרים): `user.ban` · `user.unban` · `user.admin_grant` · `user.admin_revoke` · `workspace.plan_override` · `workspace.white_label` · `workspace.soft_delete` · `workspace.restore` · `member.role_change` · `job.retry` · `job.cancel` · `job.force_refund` · `model.toggle` · `model.sync` · `model.route_update` · `prompt.activate` · `niche.update` · `season.update` · `hook.create` · `hook.update` · `hook.publish` · `hook.archive` · `hook.batch_generate` · `template.update` · `example.publish` · `voice.update` · `music.approve` · `payment.refund` · `payment.chargeback` · `invoice.attach` · `refund_request.approve` · `refund_request.reject` · `subscription.retry_charge` · `subscription.cancel_on_behalf` · `billing.cancel` · `billing.resume` · `billing.plan_change` · `plan.update` · `pack.update` · `credits.adjust` · `credits.revoke` · `credit_cost.update` · `settings.update` · `flag.update` · `share_link.revoke` · `abuse.action` · `ops.cron_run` · `privacy.request` · `notifications.whatsapp_opt_in` · `notifications.whatsapp_opt_out` · `security.incident`; ומהרחבת 2026-10-17: `meta.connect` · `meta.disconnect` · `meta.assets_select` · `meta.data_purge` · `meta.deauthorize` · `meta.data_deletion` · `meta.campaign_publish` · `meta.campaign_budget` · `meta.campaign_pause` · `meta.campaign_resume` · `meta.campaign_end` · `meta.rule_toggle` · `meta.admin_health_check` · `leads.export` · `leads.delete` · `landing.publish` · `landing.unpublish` · `landing.delete` · `trend.reference_create` · `trend.reference_file_delete` · `trend.analysis_run` · `trend.template_update` · `trend.template_publish` · `trend.template_retire`.
- שינויי תפקיד שאינם עריכה ידנית נרשמים כ-`member.role_change` עם `metadata.reason`: ‏`invite_accepted` (`accept_invite`), ‏`ownership_transfer` (`transfer_workspace_ownership`), ‏`plan_downgrade` (`enforce_plan_limits`). הענקת אדמין ראשונה מ-`ADMIN_EMAILS` היא `user.admin_grant` עם `metadata.source = 'admin_emails_bootstrap'`.
- שמירה: 7 שנים לפעולות שמתחילות ב-`payment.`, ‏`invoice.`, ‏`refund_request.`, ‏`subscription.`, ‏`billing.`, ‏`credits.`; ‏36 חודשים לכל השאר (`purge_audit_logs`, §11.4).

**פעולות הביקורת של ההרחבה** — רובן נכתבות מנתיבי משתמש ומ-webhooks, לא מהאדמין, ולכן הן מופיעות כאן עם המקור שלהן. `metadata` לעולם לא כולל טוקן, פרטי ליד או את גוף הבקשה ל-Meta; רק מזהים, ערכים לפני ואחרי (למשל `daily_budget_ils`) ו-`requestId`:

| `audit action` | נכתבת כש… |
|---|---|
| `meta.connect` | M2 הצליח (חיבור חדש או חיבור מחדש) |
| `meta.assets_select` | M4 |
| `meta.disconnect` · `meta.data_purge` | M6 (`purge: "tokens"` / `"all"`); וגם במחיקת חשבון (§9.6) |
| `meta.deauthorize` · `meta.data_deletion` | ה-webhooks של §22.6 |
| `meta.campaign_publish` · `meta.campaign_pause` · `meta.campaign_resume` · `meta.campaign_end` | C8 · C9 · C10 · C12, וגם כשכלל אוטומטי משהה (`metadata.source = 'rule'`) |
| `meta.campaign_budget` | C11, C14 עם העלאת תקציב, וכלל `boost_winner` |
| `meta.rule_toggle` | C18 (`PUT`), שורה לכל כלל שהשתנה |
| `meta.admin_health_check` | AM2 |
| `leads.export` · `leads.delete` | L4 (עם מספר השורות בלבד) · L3 |
| `landing.publish` · `landing.unpublish` · `landing.delete` | LP6 · LP7 · LP5 |
| `trend.reference_create` · `trend.analysis_run` · `trend.template_update` · `trend.template_publish` · `trend.template_retire` · `trend.reference_file_delete` | נתיבי האדמין A1–A11 בטבלה למטה, וגם `trends-lifecycle` כשהוא מפרסם או מוציא משימוש (`actor_id = null`, `metadata.source = 'cron'`) |

| Method · Path | גוף / Query | פעולה | `audit action` |
|---|---|---|---|
| `GET /api/admin/kpis` | `?from&to` | KPIs, הוצאת OpenRouter היום מול תקציב, שיעור הצלחה | — |
| `GET /api/admin/models` · `PATCH /api/admin/models/[slug]` | `{ isEnabled?, tiers?, notesHe?, displayNameHe? }` | רישום מודלים | `model.toggle` |
| `POST /api/admin/models/sync` | `{}` | סנכרון מיידי (כמו ה-cron) | `model.sync` |
| `PUT /api/admin/routes/[taskKey]` | `{ primarySlug, fallbackSlugs[], params }` | נתיב משימה; כל slug חייב להיות `is_enabled` | `model.route_update` |
| `POST /api/admin/prompts/test` | `{ promptId, input, models[] }` | הרצת בדיקה (לא נשמר, לא מחויב; נרשם ב-`ai_generations` בלי `workspace_id`) | — |
| `PUT /api/admin/prompts/active` | `{ family, version }` | `app_settings.prompt_versions` | `prompt.activate` |
| `GET/PATCH /api/admin/niches[/slug]` | עמודות DB-only (`is_active`, ‏`seo_*`, ‏`short_name_he`, ‏`sample_scripts`, ‏`faq`, ‏`seo_reviewed_at`, ‏ברירות מחדל) | נישות | `niche.update` |
| `GET/PATCH /api/admin/seasons[/slug]` | `{ startsOn, endsOn, promoLeadDays, noteHe, isQuietDay }` | לוח עונות | `season.update` |
| `GET/POST/PATCH /api/admin/hooks[/id]` | שדות `hooks`; יצירה עם `next_hook_id`; עריכת הוק `seed` מסמנת `source='admin'` | הוקים | `hook.create` · `hook.update` |
| `POST /api/admin/hooks/[id]/publish` · `/archive` | `{}` | סטטוס | `hook.publish` · `hook.archive` |
| `POST /api/admin/hooks/batch` | `{ nicheSlug, count (10..60), typeMix? }` | `hooks.library_batch.v1` ← טיוטות (`status='draft'`, `source='ai_batch'`) לתור בדיקה | `hook.batch_generate` |
| `GET/POST/PATCH /api/admin/templates[/id]` · `/examples[/id]` | השדות של הטבלה | תבניות ודוגמאות | `template.update` · `example.publish` |
| `GET/PATCH /api/admin/voices[/id]` · `POST /api/admin/voices/[id]/sample` | `{ providerVoiceId, isActive, … }` | מיפוי קולות והקלטת דוגמה ל-`public-media/voices/{id}.mp3` | `voice.update` |
| `POST /api/admin/music/generate` · `PATCH /api/admin/music/[id]` | `{ mood, bpm?, promptHe? }` · `{ isActive, titleHe }` | ספריית מוזיקה | `music.approve` |
| `GET /api/admin/users` · `PATCH /api/admin/users/[id]` | `{ ban?: boolean, isPlatformAdmin?: boolean }` | משתמשים (הענקת אדמין רק לכתובות ב-`ADMIN_EMAILS` או ע״י אדמין קיים עם MFA) | `user.ban` · `user.unban` · `user.admin_grant` · `user.admin_revoke` |
| `GET /api/admin/workspaces/[id]` · `PATCH …/plan-override` · `PATCH …/white-label` · `POST …/soft-delete` · `POST …/restore` | `{ planId, until, reason }` או `{ clear: true }` (מאפס את `plan_override` ל-NULL) וכו׳ | סביבות | `workspace.plan_override` · `workspace.white_label` · `workspace.soft_delete` · `workspace.restore` |
| `GET /api/admin/jobs` · `GET /api/admin/jobs/[id]` | פילטרים | עבודות, צעדים, `ai_generations`, עלויות | — |
| `POST /api/admin/jobs/[id]/retry` · `/cancel` · `/force-refund` | `{ reasonHe }` | ניסיון חוזר (עבודה חדשה שממחזרת נכסים), ביטול, `refund_reservation` | `job.retry` · `job.cancel` · `job.force_refund` |
| `GET /api/admin/billing/payments` · `POST /api/admin/billing/payments/[id]/refund` | `{ amountIls, reasonHe }` | החזר דרך השער + חשבונית זיכוי | `payment.refund` |
| `POST /api/admin/billing/payments/[id]/chargeback` | `{ reasonHe: HeText(5, 300) }` | ‏`payments.status = 'refunded'`, ‏`failure_reason = 'chargeback'`; ‏`revoke_grant_remaining` לכל דלי עם `ref_type = 'payment'` ו-`ref_id = paymentId` (מפתח `revoke:chargeback:{paymentId}:{grantId}`); המנוי נסגר מיד (`status = 'canceled'`, ‏`current_period_end = now()`, ‏`workspaces.plan_id = 'free'`); התראת אדמין ← ‏`200 { revoked }` | `payment.chargeback` |
| `POST /api/admin/billing/payments/[id]/invoice` | `multipart/form-data`: ‏`pdf` (עד 4MB, ‏`application/pdf` — הקובץ עובר בגוף הבקשה, ומגבלת הגוף של Vercel היא 4.5MB; מעל 4MB ← ‏400 `INVALID_INPUT` ‏`{ reason: "too_large" }`, ומעל 4.5MB Vercel עונה 413 לפני ה-handler; חלק 06 §9.5), ‏`docNumber`, ‏`allocationNumber?`, ‏`docType` (`tax_invoice_receipt` או `credit_invoice`; ‏`receipt` ← ‏400 `INVALID_INPUT`, כי עוסק פטור לא נתמך, חלק 06 §9.2) | חשבונית שהופקה ידנית: ה-PDF נשמר ב-`invoices/{ws}/{invoiceId}.pdf`, שורת `invoices` עם `provider = 'manual'` ו-`provider_doc_id = 'manual:{docNumber}'`, ומייל `invoice_ready` ← ‏`201 { invoiceId }` | `invoice.attach` |
| `POST /api/admin/billing/refund-requests/[id]/decision` | `{ decision: "approve" \| "reject", refundIls?, notesHe }` | טיפול בבקשות החזר | `refund_request.approve` · `refund_request.reject` |
| `POST /api/admin/billing/subscriptions/[id]/retry-charge` · `/cancel` | `{ channel: "email" \| "phone", reasonHe }` | חיוב חוזר / ביטול בשם הלקוח (ס׳ 13ד) | `subscription.retry_charge` · `subscription.cancel_on_behalf` |
| `PUT /api/admin/plans/[id]` · `PUT /api/admin/packs/[id]` · `PUT /api/admin/credit-costs/[key]` | שדות הטבלה | מחירון | `plan.update` · `pack.update` · `credit_cost.update` |
| `POST /api/admin/credits/adjust` | `{ workspaceId, amount (≠0, -10000..10000), reasonHe }` | חיובי ← `grant_credits(…,'admin',…, 'grant:admin:{auditLogId}')`; שלילי ← `debit_credits(…, 'debit:admin:{auditLogId}')`. שורת היומן נכתבת **לפני** הקריאה כדי שמזהה שלה יהיה המפתח | `credits.adjust` |
| `POST /api/admin/credits/revoke-grant` | `{ grantId: Uuid, reasonHe: HeText(5, 300) }` | "הסרת היתרה מהדלי": שורת `audit_logs` קודם, ואז `revoke_grant_remaining(grantId, 'revoke:admin:{auditLogId}', reasonHe, actorId)` ← ‏`200 { removed }` | `credits.revoke` |
| `PUT /api/admin/settings/[key]` · `PUT /api/admin/flags/[key]` | `{ value }` (Zod לפי מפתח) · `{ enabled, plans?, workspaceIds? }` | הגדרות ודגלים; הדלקת `meta_connect` בפרודקשן כש-`META_PROVIDER=mock` ← 400 `INVALID_INPUT {reason: "meta_mock_in_production"}` (חלק 06 §20) | `settings.update` · `flag.update` |
| `GET /api/admin/abuse` | `?status=&source=&page=` (50 לעמוד) | רשימת דיווחים עם סינון לפי מצב ומקור (`share_page` / `system` / `support`) | — |
| `POST /api/admin/share-links/[id]/revoke` · `PATCH /api/admin/abuse/[id]` | `{ status, notes }` | דיווחים ושיתוף (טיפול בדיווח יכול לבטל את קישור השיתוף) | `share_link.revoke` · `abuse.action` |
| `GET /api/admin/audit` · `GET /api/admin/costs` · `GET /api/admin/ops/cron` · `GET /api/admin/ops/credit-invariants` | פילטרים | יומן ביקורת, עלויות ומרווח, 20 הריצות האחרונות של pg_cron שנכשלו (`cron_recent_failures()`) + הריצה האחרונה של כל cron של Vercel (`cron:last:{name}` ב-Upstash), `credit_invariant_violations()` | — |
| `POST /api/admin/ops/cron` | `{ name: "sweep-jobs" \| "billing-renewals" \| "sync-models" \| "hook-of-the-day" \| "reminders" \| "cleanup" }`, ומההרחבה גם עשרת השמות של §23 (`meta-insights-hourly` … `trends-lifecycle`) | הרצה מיידית של אותה פונקציה (`lib/cron/{name}.ts`) בתוך התהליך, תחת אותה נעילה; הכפתור "התאמת תשלומים עכשיו" שולח `billing-renewals` (שמתחיל ב-`reconcilePendingCheckouts`) ← `200 { summary }` או `{ skipped: "locked" }` | `ops.cron_run` |
| `POST /api/admin/models/test` | `{ taskKey, slug? }` | "בדיקה" של נתיב משימה עם קלט קבוע (חלק 05 §6.4): לא מחויב, נרשם ב-`ai_generations` עם `workspace_id = NULL` ← ‏`200 { ok, modelServed, latencyMs, costUsd, output }` (טקסט/JSON ל-LLM; במדיה — כתובת חתומה ל-10 דקות לקובץ ב-`generated/_admin-tests/{YYYY-MM-DD}/{uuid}.{ext}`, שנמחק אחרי 7 ימים, §13.1) | — |
| `POST /api/admin/revalidate` | `{ tags: string[] }` | revalidate יזום | `settings.update` |
| `POST /api/admin/trends/references` (A1) | `CreateTrendReferenceBody { sourcePlatform, sourceUrl?, rightsBasis, rightsNote, attest: true, file?: { mime, bytes } }` | ייחוס חדש עם בסיס זכויות והצהרה; עם קובץ ← כתובת העלאה חתומה ל-`trend-refs` ← `201 { referenceId, upload? }`; `INVALID_INPUT` (`rights_required`, `scraping_not_allowed`) | `trend.reference_create` |
| `POST /api/admin/trends/references/[id]/complete` (A2) | `{}` | בדיקת הקובץ (עד 180 שניות), phash למניעת כפילות ← `200 { reference }`; `INVALID_INPUT` (`duplicate`, `too_long`) | `trend.reference_create` (`metadata.op = 'complete'`) |
| `POST /api/admin/trends/references/[id]/analyze` (A3) | `{}` | הזרימה `trendAnalyze` ← `202 { analysisId }`; `BUDGET_GUARD` (`trend_analysis_limits`) | `trend.analysis_run` |
| `GET /api/admin/trends/analyses/[id]` (A4) | — | הניתוח, חבילת ההוק וכתובות חתומות לפריימים (10 דקות) ← `200 { analysis, hookPackage, frameUrls }` | — |
| `POST /api/admin/trends/analyses/[id]/draft-template` (A5) | `{}` | `trends.adapt.v1` ← טיוטת תבנית ← `201 { templateId }`; `MODERATION_BLOCKED` (דמיון או סיכון) | `trend.template_update` (`metadata.op = 'draft_from_analysis'`) |
| `PATCH /api/admin/trends/templates/[id]` (A6) | `TrendTemplateV1` חלקי, עם `ifUnmodifiedSince`; וגם `explainer` (`TrendExplainerV1`) ו-`demoAssetPaths` (סינון וסידור מחדש של הקיים בלבד; קובץ שהוסר נמחק מ-`public-media`, חלק 08 §7.4) | עריכת תבנית ← `200 { template }`; `INVALID_INPUT`, `EDIT_CONFLICT` | `trend.template_update` |
| `POST /api/admin/trends/templates/[id]/demo-render` (A7) | `{ nicheSlug }` | עבודה בסביבת `ws-trends-studio` (§16.3); ה-finalize מעתיק ל-`public-media/trends/{slug}/` ← `202 { jobId }`; תבנית `guided` בלי צילום מוכן בסטודיו לאותה נישה ← `INVALID_INPUT` (`guided_footage_required`) | `trend.template_update` (`metadata.op = 'demo_render'`) |
| `POST /api/admin/trends/templates/[id]/publish` (A8) | `{ publishAt? }` | פרסום מיידי או מתוזמן; דורש לפחות נכס הדגמה אחד והסבר ← `200 { status }`; `INVALID_INPUT` (`no_demo`, `missing_explainer`) | `trend.template_publish` |
| `POST /api/admin/trends/templates/[id]/retire` (A9) | `{}` | `status = 'retired'`, `revalidateTag('trends', "max")` ← `200 { status: "retired" }` | `trend.template_retire` |
| `POST /api/admin/trends/templates/[id]/explainer` (A10) | `{}` | **NDJSON** `TrendExplainerV1` (`trends.explainer.v1`); נשמר כטיוטה ב-`explainer` לעריכה | `trend.template_update` (`metadata.op = 'explainer_draft'`) |
| `DELETE /api/admin/trends/references/[id]/file` (A11) | — | מחיקת הקובץ השמור, הניתוח נשאר ← `204` | `trend.reference_file_delete` |
| `GET /api/admin/meta/connections?status=` (AM1) | פילטרים | חיבורים: סטטוס, בדיקה אחרונה ושגיאות, **בלי טוקנים** ← `200 { items }` | — |
| `POST /api/admin/meta/connections/[id]/health-check` (AM2) | `{}` | אותה בדיקה כמו `meta-token-health` לחיבור אחד ← `200 { status }` | `meta.admin_health_check` |
| `GET /api/admin/meta/campaigns?status=&q=` (AM3) | פילטרים | מעקב: סטטוס, סיבות דחייה, הוצאה ושגיאות ← `200 { items }` | — |

### 24.2 Server Actions (שמירות טפסים פשוטות)

כל Server Action: `"use server"`, ‏Zod על הקלט, הלקוח של המשתמש (RLS אוכף), ‏`revalidatePath` של המסך, ותשובה `{ ok: true } | { ok: false, error: { code, message_he, details } }` באותו מבנה שגיאה. בדיקת Origin מובנית ב-Next.js.

| Action (`app/(product)/app/**/actions.ts`) | קלט (Zod) | טבלה | הרשאה |
|---|---|---|---|
| `updateProfile` | `{ fullName?, uiGenderForm?, theme?, reduceMotion?, largerCaptions?, notificationPrefs?: NotificationPrefs.shape.kinds }` (רק `kinds`, שנכתב כ-`{ ...current, kinds }`; תת-האובייקט `whatsapp` נכתב רק בנתיבי האימות, §21.3, ו-`profiles_guard` חוסם שינוי שלו מהלקוח) | `profiles` | השורה שלי |
| `completeOnboarding` | `{ businessName, nicheSlug, websiteUrl?, audienceGender, register, voiceGender }` | `business_profiles`, ‏`workspaces.name/niche_slug`, ‏`profiles.onboarding_completed_at` | עורך+ |
| `saveBusinessProfile` | כל שדות `business_profiles` (כולל `services`, ‏`facts` מאושרים) | `business_profiles` | עורך+ |
| `saveBrandKit` · `setDefaultBrandKit` · `duplicateBrandKit` · `deleteBrandKit` | שדות `brand_kits` (צבעים ב-`#RRGGBB`, גופנים מהרשימה, preset) · מגבלת `brand_kits` | `brand_kits` | עורך+ (מחיקה: לא ערכת ברירת המחדל) |
| `upsertPronunciation` · `deletePronunciation` | `{ term (1..60), sayAs (1..120), note? }` | `pronunciation_entries` | עורך+ |
| `switchWorkspace` | `{ workspaceId }` | עוגיית `ws`, ‏`profiles.last_workspace_id` | חבר |
| `createClientWorkspace` | `{ name }` | `create_workspace(name, 'client', parent)` | בעלים/מנהל בסוכנות |
| `renameWorkspace` | `{ name }` | `workspaces.name` | בעלים/מנהל |
| `inviteMember` · `revokeInvite` · `resendInvite` | `{ email, role: admin\|editor\|viewer }` · מגבלת `seats` (`seats_used`) נבדקת רק כש-`role ≠ viewer` (צופים לא תופסים מושב), בתוך ה-insert: הטריגר `workspace_invites_seat_guard` נועל את שורת סביבת החיוב וסופר (§9.5) ← `PLAN_LIMIT` | `workspace_invites` (טוקן 32 בתים, נשמר `sha256`) + מייל `team_invite` עם הקישור של §1.3 | בעלים/מנהל |
| `changeMemberRole` · `removeMember` · `leaveWorkspace` · `transferOwnership` | `{ userId, role? }` · `changeMemberRole` ← `rpc('change_member_role')` עם הלקוח של המשתמש (בדיקת המושבים בתוך הפונקציה, בנעילה; העלאה מ-`viewer` ל-`editor`/`admin` מעבר למכסה ← `PLAN_LIMIT`) | `change_member_role` (§9.5, + `audit_logs` ‏`member.role_change`) / `workspace_members` (הסרה ועזיבה) / `transfer_workspace_ownership` | בעלים/מנהל (בתוך הפונקציה); הסרה ועזיבה לפי RLS (§12) |
| `saveBillingProfile` | `{ legalName, vatId?, isBusiness, email, addressLine?, city?, zip?, phone? }` | `billing_profiles` (סביבת החיוב) | בעלים/מנהל |
| `markNotificationsRead` | `{ ids?: uuid[] }` (בלי ids = הכול) | `notifications.read_at` | שלי |
| `archiveProject` · `renameProject` | `{ projectId, archived? , title? }` | `projects` | עורך+ |
| `deleteProject` | `{ projectId }` | `projects.deleted_at = now()` (שחזור 30 יום דרך התמיכה) | בעלים/מנהל (שומר §11.3) |
| `deleteUpload` | `{ assetId }` | `assets.is_deleted = true` + `metadata.purge_reason = 'user_deleted'` (השורה נקראת דרך הלקוח של המשתמש לבדיקת ההרשאה; העדכון בלקוח הסודי, כי למשתמש יש הרשאת עמודה רק על `is_deleted`) | עורך+, רק סוגי העלאה |
| `revokeShareLink` | `{ shareLinkId }` | `share_links.revoked_at` | עורך+ |

### קריטריוני קבלה
- [ ] כל נתיב `/api/admin/*` מחזיר 403 למשתמש שאינו מנהל פלטפורמה (בדיקה אוטומטית שעוברת על כל קובצי ה-route תחת `app/api/admin`).
- [ ] כל פעולה כותבת באדמין יוצרת בדיוק שורת `audit_logs` אחת עם `action` מהרשימה.
- [ ] `credits/adjust` עם ‎-50 על יתרה 30 ← 402 `INSUFFICIENT_CREDITS`, ובלי שורת יומן קרדיטים.
- [ ] `inviteMember` של עורך בתוכנית בסיס (מושב אחד) ← `PLAN_LIMIT` ‏`{ limit: "seats", max: 1 }`; הזמנת צופה באותה סביבה מצליחה.
- [ ] `POST /api/admin/credits/revoke-grant` כותב שורת `audit_logs` ‏`credits.revoke` ושורת `adjustment` אחת ביומן; קריאה כפולה לא מסירה פעמיים.
- [ ] `POST /api/admin/ops/cron { name: "billing-renewals" }` בזמן שה-cron רץ ← `{ skipped: "locked" }`; אחרי ריצה, `GET /api/admin/ops/cron` מציג את `cron:last:billing-renewals`.
- [ ] מנהל פלטפורמה עם session ברמת `aal1` מקבל 403 מכל `/api/admin/*`.
- [ ] `POST /api/admin/trends/references` בלי `attest: true` ← 400 `{ reason: "rights_required" }`; עם `sourceUrl` של TikTok ובלי קובץ ובסיס `link_only_notes` ← 201 בלי כתובת העלאה.
- [ ] `GET /api/admin/meta/connections` לא מחזיר אף שדה שמכיל `token` (בדיקה על המפתחות של ה-JSON); AM2 כותב שורת `audit_logs` `meta.admin_health_check` אחת.
- [ ] פרסום דף עסק, פרסום קמפיין וייצוא לידים כותבים כל אחד שורת `audit_logs` אחת עם ה-`action` מהטבלה של ההרחבה, וב-`metadata` שלהן אין שם, טלפון או מייל של ליד.

---

## §25. בדיקות מסד הנתונים: RLS, פונקציות ומקביליות

### 25.1 תשתית

- **pgTAP** דרך `supabase test db` (קבצים ב-`supabase/tests/*.sql`, כל קובץ בטרנזקציה: `begin; select plan(n); … select * from finish(); rollback;`).
- **עזרים** (`supabase/tests/00_helpers.sql`, נטען ראשון; כל קובץ אחר מתחיל ב-`\i supabase/tests/00_helpers.sql` או מסתמך על סדר האלפבית):

```sql
create extension if not exists pgtap with schema extensions;
create schema if not exists tests;

-- create a real auth user (fires handle_new_user) and return its id
create or replace function tests.create_user(p_email text) returns uuid language plpgsql security definer set search_path = '' as $$
declare v uuid := gen_random_uuid();
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at, email_confirmed_at)
  values (v, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', p_email,
          jsonb_build_object('full_name', split_part(p_email, '@', 1)), now(), now(), now());
  return v;
end $$;

create or replace function tests.ws_of(p_user uuid) returns uuid language sql stable security definer set search_path = '' as $$
  select m.workspace_id from public.workspace_members m where m.user_id = p_user and m.role = 'owner' order by m.created_at limit 1;
$$;

-- impersonation: RLS sees exactly what PostgREST would see; p_aal = 'aal2' for platform-admin cases (MFA, §9.2)
create or replace function tests.authenticate_as(p_user uuid, p_aal text default 'aal1') returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', p_user, 'role', 'authenticated', 'aal', p_aal)::text, true);
end $$;
create or replace function tests.authenticate_anon() returns void language plpgsql as $$
begin
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
end $$;
create or replace function tests.as_service() returns void language plpgsql as $$
begin
  perform set_config('role', 'service_role', true);
  perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
end $$;
create or replace function tests.reset_role() returns void language plpgsql as $$
begin
  perform set_config('role', 'postgres', true);
  perform set_config('request.jwt.claims', '', true);
end $$;

grant usage on schema tests to anon, authenticated, service_role;
grant execute on all functions in schema tests to anon, authenticated, service_role;

-- deterministic vault pepper for tests
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'trial_hash_pepper') then
    perform vault.create_secret('test-pepper-not-secret', 'trial_hash_pepper');
  end if;
end $$;
```

### 25.2 מקרי בדיקה (pgTAP)

| קובץ | מקרה | ציפייה |
|---|---|---|
| `01_schema.sql` | RLS פעיל על כל טבלה ב-`public` | 0 טבלאות בלי `rowsecurity` |
| | אין מדיניות `to public` | 0 שורות ב-`pg_policies` עם `public` |
| | כל טבלה עם `updated_at` (חוץ מ-`hooks` ו-`project_versions`, שיש להן טריגר עמודות, §9.1 ו-§2.3) מחוברת ל-`set_updated_at` | 0 חסרות |
| | אף פונקציה `security definer` ב-`public` בלי `search_path` קבוע | 0 (`proconfig` מכיל `search_path=`) |
| | `anon` יכול להריץ רק: `search_hooks`, `search_hooks_facets`, `normalize_he`, `escape_like`, `health_ping`, ומ-`0013` גם `landing_page_public` | רשימה זהה בדיוק |
| | **allow-list של `execute`:** כל פונקציה ב-`public` (`pg_proc` ⋈ `pg_namespace`) שבה `has_function_privilege('anon', oid, 'execute')` או `has_function_privilege('authenticated', oid, 'execute')` | הקבוצה שווה בדיוק לרשימת ה-grants של §12.6 (כולל `change_member_role`) ועוד `storage_ws`, `storage_upload_allowed`, `realtime_topic_allowed`, ועוד ארבע הפונקציות של §12.7 (`landing_page_public`, `meta_spend_summary`, `trend_feed`, `trend_template_benchmark`); כל פונקציה חדשה בלי revoke מפורש נכשלת כאן |
| | `authenticated` לא יכול להריץ `reserve_credits`, `capture_credits`, `settle_reservation`, `refund_reservation`, `refund_credits`, `begin_spend`, `commit_spend`, `sweep_orphaned_spends`, `cap_rollover`, `effective_white_label`, `_billing_workspace_id`, `_workspace_plan`, `_lock_billing_workspace`, `grant_credits`, `debit_credits`, `revoke_grant_remaining`, `create_job_and_reserve`, `claim_idempotency_key`, `prepare_user_deletion`, `enforce_plan_limits`, `billing_apply_payment`, `billing_apply_renewal`, `billing_apply_plan_change`, `cron_recent_failures`, `trial_pepper_configured`, ומההרחבה `_managed_spend_cap_ils`, `refresh_managed_spend`, `ad_budget_changes_last_hour`, `purge_meta_data`, `refresh_trend_template_stats` | `has_function_privilege = false` לכולן |
| | `purge_ai_generations`, `purge_support_data`, `purge_audit_logs`, ומ-`0013` גם `purge_leads`, לא ניתנות להרצה ל-`anon`, ל-`authenticated` וגם לא ל-`service_role` | `false` לכולן |
| | מפתחות זרים שמצביעים על `profiles` עם `on delete restrict` או `no action` (`pg_constraint.confdeltype in ('r','a')`) | 0 (כולם `cascade` או `set null`, §9.6; כולל הטבלאות של `0013`/`0014`, §2.3) |
| | **grants של טבלאות:** כל טבלה ב-`public` ש-`has_table_privilege('anon', t, 'select')` | רק טבלאות הקטלוג של §12.2, `hook_popularity`, ו-`trend_templates` (grant עמודות) |
| | כל טבלה שנוצרה ב-`0013`/`0014` | `has_table_privilege('authenticated', t, 'insert' \| 'update' \| 'delete')` = `false` לכולן; `meta_tokens`, `meta_data_deletion_requests`, `managed_spend_monthly` ו-`trend_template_stats_daily` גם בלי `select` |
| | 36 enum-ים אחרי `0012`, ו-58 אחרי `0014`; `member_role` בסדר `owner,admin,editor,viewer` | ✓ |
| `02_tenancy_rls.sql` | משתמש A (בעלים של WA) ומשתמש B (בעלים של WB) | — |
| | A קורא `projects`, ‏`assets`, ‏`jobs`, ‏`brand_kits` של WB | 0 שורות |
| | A מכניס `projects` עם `workspace_id = WB` | שגיאת RLS (`42501`) |
| | B מזמין את A כ-`viewer` ל-WB; A מקבל את ההזמנה (`accept_invite`) | A רואה את פרויקטי WB; ‏`insert` לפרויקט ב-WB נכשל |
| | B משנה את A ל-`editor` (`change_member_role(WB, A, 'editor')`) | A מכניס פרויקט; `delete` של פרויקט נכשל (0 שורות); `update … set deleted_at` נכשל ב-`FORBIDDEN`; שורת `audit_logs` ‏`member.role_change` |
| | `update workspace_members set role = …` ישיר, גם כ-B (בעלים) | שגיאת הרשאה (`42501`): אין grant ואין מדיניות `update` |
| | A (עורך) קורא ל-`change_member_role(WB, A, 'admin')` | `FORBIDDEN` |
| | A (מנהל) קורא ל-`change_member_role(WB, B, 'admin')` (B בעלים) / עם `p_role = 'owner'` | `FORBIDDEN` (`owner_role_is_fixed`) / `INVALID_INPUT` |
| | תוכנית בסיס (מושב אחד, תפוס על ידי B); B קורא ל-`change_member_role(WB, V, 'editor')` לצופה V | `PLAN_LIMIT` ‏`{"limit":"seats","max":1}`; התפקיד של V לא משתנה |
| | B מכניס `workspace_invites` עם `role = 'editor'` כשהמושבים מלאים | `PLAN_LIMIT` מהטריגר `workspace_invites_seat_guard`; הזמנת `viewer` מצליחה |
| | עורך מכניס, מעדכן או מוחק `scenes` ישירות | שגיאת הרשאה (`42501`) לכל אחת משלוש הפעולות; ‏`select` עובד |
| | A מכניס `consents` ישירות (גם עם `user_id` = A) | שגיאת הרשאה (`42501`); ‏`select` של השורות של A עובד |
| | A (לא חבר ב-WB) קורא ל-`billing_workspace_id(WB)`, ‏`workspace_plan(WB)` ו-`is_version_locked(<גרסה ב-WB>)` | `null` בשלושתן; אותן קריאות כ-`service_role` מחזירות ערכים |
| | A עוזב את WB (`delete` על החברות שלו) | מצליח; אחר כך 0 שורות מ-WB |
| | `profiles`: A קורא את השורה של B | 0 שורות; `list_workspace_members(WB)` מחזיר את שניהם כש-A חבר |
| | A מעדכן `profiles.is_platform_admin = true` | שגיאת הרשאה (`42501`) |
| | מנהל פלטפורמה P: `platform_admin_status()` עם `aal1` / עם `aal2` | `needs_mfa` / `ok`; ‏`profiles_select_admin` מחזיר שורות של אחרים רק עם `aal2` |
| | B (בעלים, תוכנית בסיס עם מושב אחד) מזמין את A כ-`viewer` ואת C כ-`editor` | ההזמנה של A מתקבלת; ההזמנה של C נדחית כבר ביצירה (`PLAN_LIMIT`, ‏`workspace_invites_seat_guard`); הזמנת `editor` שנוצרה כ-`postgres` לפני כן — `accept_invite` שלה נכשל ב-`PLAN_LIMIT`; ‏`seats_used(WB)` = 1 |
| | סוכנות: G (בעלים של WG מסוג `agency`) יוצר לקוח WC; E (עורך ב-WG); V (צופה ב-WG) | E רואה וכותב ב-WC; V לא רואה את WC; ‏`effective_role(WC)` ל-G = `admin` |
| | סביבה שנמחקה לוגית (`deleted_at`) | אף אחד לא רואה אותה דרך RLS |
| | שקילות: לכל זוג (משתמש × סביבה) בנתוני הבדיקה | `ws in accessible_workspace_ids()` ⇔ `can_access_workspace(ws)` |
| `03_catalog_rls.sql` | `anon` קורא `hooks` | רק `published`; הוק `draft` לא מוחזר |
| | `anon` קורא `niches` | `local-politics` לא מוחזרת |
| | `anon` קורא `model_registry`, ‏`app_settings`, ‏`feature_flags`, ‏`plans` לא ציבוריות | 0 שורות / שגיאת הרשאה |
| | `authenticated` (לא אדמין) מעדכן `hooks` | 0 שורות |
| | אדמין פלטפורמה מעדכן `hooks` | מצליח |
| `04_credits.sql` | יתרה 100: `reserve 60` ← `capture 25` ← `settle` | יתרה 75; `reserved` 0; שורות `reserve -60`, ‏`capture 0`, ‏`release +35` |
| | `reserve` של 101 על יתרה 100 | `INSUFFICIENT_CREDITS` עם `{"needed":101,"balance":100}` |
| | `reserve` כפול באותו מפתח | אותו `id`, שורת יומן אחת |
| | `capture` מעל השמירה | נחסם לגובה השמירה |
| | `refund_reservation` על שמירה פתוחה / מסולקת / שהוחזרה | כל הסכום / רק הנצרך / 0 |
| | `refund_credits` עם `refund:{job}:clip:{scene}` בלי `capture` מתאים | אין שינוי |
| | דליים: 30 שפגים מחר + 50 בלי תוקף; `reserve 40` | נלקחים 30 מהדלי שפג ראשון ו-10 מהשני |
| | דלי שפג בזמן שמירה פתוחה, ואז `refund_reservation` | דלי חדש עם תוקף +7 ימים; `expire_credit_grants` עובר |
| | `daily_credit_cap = 70`, שימוש 60 היום, `reserve 20` | `PLAN_LIMIT` ‏`{"limit":"daily_credit_cap"}` |
| | `update`/`delete`/`truncate` על `credit_ledger` (גם כ-`service_role`) | שגיאה |
| | `credit_invariant_violations()` בסוף כל תרחיש | 0 שורות |
| | `begin_spend` של 0 | `null`, בלי שורות; `commit_spend(null, …)` לא עושה כלום |
| | `begin_spend 5` ← `commit_spend` ← `commit_spend` שוב | שמירה `settled` עם `captured = 5`; שורות `reserve -5`, ‏`capture 0` (מפתח `…:capture`); הקריאה השנייה לא מוסיפה שורות |
| | `begin_spend 5` בלי `commit_spend`; ‏`created_at` מוזז 7 דקות אחורה; `sweep_orphaned_spends()` | מחזירה 1; השמירה `refunded`, היתרה חוזרת במלואה, שורת `refund +5` עם "הפעולה לא הושלמה. הקרדיטים הוחזרו."; מפתח `api_idempotency_keys` ב-`in_progress` מאותו גיל ← `failed` |
| | **החזר אחרי פקיעה טבעית:** דלי שפג (`expire_credit_grants` כותב `expire:{grantId}` וממלא `expired_at`), ואז `refund_reservation` של שמירה ישנה ממנו, ואז `expire_credit_grants` שוב | ההחזר נכנס לדלי חדש (`reservation_return`, +7 ימים); הדלי המקורי נשאר עם `remaining = 0`; הריצה השנייה עוברת בלי `23505` |
| | **תקרה ואז פקיעה טבעית:** `cap_rollover(ws, cap, 'grant:plan:s:p1')` מוריד חלק מדלי (`expire:cap:{grantId}:grant:plan:s:p1`), ואחר כך הדלי פג | שתי שורות `expire` עם מפתחות שונים, בלי `23505`; קריאה חוזרת ל-`cap_rollover` עם אותו `p_ref` מחזירה 0 |
| | `expire_credit_grants()` כשסביבה אחת זורקת שגיאה | שאר הסביבות פגות כרגיל; אזהרה בלוג |
| | `get_credit_summary` בתוכנית `free` / ‏`starter` | `plan_allowance` = `null` / ‏400 |
| | `create_job_and_reserve` כש-`concurrent_jobs` מלא | `CONCURRENCY_LIMIT`; אין שורת `jobs` |
| | אותו מצב, עבודת אח עם `options.afterJobId` | נוצרת; ‏`running` בבדיקה הבאה לא כולל אותה |
| | `revoke_grant_remaining` פעמיים עם אותו מפתח | בפעם השנייה 0; היתרה יורדת בדיוק ב-`remaining`; שמירה פתוחה לא משתנה |
| | `create_job_and_reserve` עם יתרה לא מספיקה | `INSUFFICIENT_CREDITS`; אין שורת `jobs` |
| | `handle_new_user` עם אותו מייל מנורמל פעמיים | פעם ראשונה `granted` + 70; שנייה `already_claimed` + 0 |
| `05_storage.sql` | חבר ב-WA קורא `storage.objects` עם נתיב `{WB}/…` | 0 שורות |
| | עורך מכניס אובייקט ב-`uploads/{WA}/uploads/{id}.mp4` בלי שורת `assets` ממתינה | נדחה |
| | אותו דבר עם שורה ממתינה שלו | מצליח; צופה — נדחה; נתיב `{WA}/brand/…` ב-`uploads` — נדחה |
| | `exports/{userA}/x.zip` נקרא על ידי B | 0 שורות |
| | `storage_ws('not-a-uuid/x')` | `null` |
| `06_realtime.sql` | `realtime_topic_allowed('job:{jobA}')` כ-A / כ-B | `true` / `false` |
| | `realtime_topic_allowed('workspace:{WC}')` כעורך בסוכנות | `true` |
| | `realtime_topic_allowed('job:abc')` | `false` בלי שגיאה |
| | עדכון `jobs.heartbeat_at` בלבד | 0 שורות חדשות ב-`realtime.messages` |
| `07_guards.sql` | `update project_versions set script` על גרסה עם עבודה | שגיאה |
| | `update project_versions set created_by = null` (כמו `on delete set null`) על גרסה עם עבודה | מצליח |
| | `update audit_logs set action = 'x.y'` ו-`delete from audit_logs` כ-`service_role` | `AUDIT_LOG_IMMUTABLE` |
| | `purge_audit_logs()` כ-`postgres` עם שורת `model.toggle` בת 37 חודשים ושורת `payment.refund` בת 37 חודשים | הראשונה נמחקת, השנייה נשארת |
| | `reindex_scenes` עם קבוצה לא תואמת | `INVALID_INPUT` |
| | עורך ב-WA מעדכן `projects.brand_kit_id` לערכה של WB | `FORBIDDEN` (`cross_workspace_reference`) |
| | עורך ב-WA מעדכן `scenes.user_asset_id` ישירות | שגיאת הרשאה (`42501`): ‏`scenes` נכתבת רק בשרת (§19.6) |
| | משתמש מעדכן `profiles.notification_prefs` עם `whatsapp.verified_at` | `FORBIDDEN`; עדכון של `kinds` בלבד מצליח |
| | עורך מכניס `project_versions` עם `moderation` / מכניס `share_links` ישירות | שגיאת הרשאה (`42501`) |
| | עורך מכניס `assets` עם `path` שמתחיל בסביבה אחרת | שגיאת RLS |
| | `transfer_workspace_ownership` על ידי מנהל | `FORBIDDEN` |
| `08_search.sql` | `search_hooks('נדל"ן')` = `search_hooks('נדל״ן')` | אותן תוצאות, יותר מ-0 |
| | ניקוד בשאילתה (`סַפָּר`) | אותן תוצאות כמו `ספר` |
| | `p_niche = 'universal'` | רק הוקים בלי נישה (10 ב-seed) |
| | `p_sort = 'new'` | ממוין לפי `created_at desc` |
| | `search_hooks_facets()` | סכום הפאסט `goal` = מספר ההוקים המפורסמים |
| `09_idempotency.sql` | `claim → complete → claim` | `new` ← `completed` עם הגוף השמור |
| | `claim` עם hash אחר | `mismatch` |
| | `claim → complete('failed') → claim` | `new` עם `attempt = 2` |
| | `claim` ← (`updated_at` מוזז 5 דקות אחורה) `claim` ← (מוזז 7 דקות) `claim` | `in_progress` ← `new` עם `attempt = 2` (חלון של 6 דקות) |
| `10_billing_ops.sql` | `enforce_plan_limits` אחרי הורדת תוכנית (בעלים + 2 עורכים + הזמנת עורך, ל-`starter`) | ההזמנה נמחקת, שני העורכים `viewer`, 2 שורות `member.role_change` ‏(`plan_downgrade`); קריאה שנייה — אין שינוי |
| | `mark_retention()` על רינדור בן 91 יום: סביבה חינמית עם `has_paid = false` / `true` | מסומן / לא מסומן |
| | `effective_white_label`: סוכנות עם `white_label = true` בתוכנית `agency` / אותה סוכנות אחרי מעבר ל-`business` / סביבת לקוח של הסוכנות / `white_label = false` | `true` / `false` / `true` (לפי סביבת החיוב) / `false` |
| | `email_messages` עם `idempotency_key` כפול | `23505` |
| | `insert into consents (email, kind, version, granted, source)` עם `source = 'unsubscribe'` ו-`granted = false` כ-`service_role` / אותו דבר עם `source = 'email_link'` | מצליח / `23514` (`check_violation`) |
| | `cron.job` | בדיוק 14 משימות (11 של `0011` ו-3 של ההרחבה) |
| | `backup_reader` (`set role backup_reader`) | `select` על `credit_ledger` מצליח; `insert` נכשל |
| `11_meta_rls.sql` (`0013`) | A (בעלים של WA) ו-B (בעלים של WB); בכל סביבה חיבור, קמפיין, ליד, פוסט, דף עסק, דוח בדיקת דופק ותוכנית | — |
| | A קורא `ad_campaigns`, `leads`, `social_posts`, `landing_pages`, `ad_health_reports`, `content_plans` של WB | 0 שורות |
| | צופה ב-WA קורא `leads` של WA / מעדכן `leads.status` ישירות | שורות / שגיאת הרשאה (`42501`) |
| | `select token_enc from meta_tokens` (גם כבעלים) · `select * from meta_data_deletion_requests` · אותו דבר כ-`anon` | שגיאת הרשאה (`42501`) |
| | `select meta_user_id from meta_connections` · `select min_budgets from meta_assets` · `select raw from ad_insights_daily` | שגיאת הרשאה על העמודה; `select id, status` עובד |
| | `insert`/`update`/`delete` ישיר כ-`authenticated` על כל טבלה של `0013` | שגיאת הרשאה (`42501`) |
| | `select * from managed_spend_monthly` ישיר · `meta_spend_summary(WA)` כבעלים / כעורך / כ-A על WB | שגיאת הרשאה · שורה / 0 שורות / 0 שורות (R39) |
| | `landing_page_public('<slug של טיוטה>')` / `('<slug של דף שפורסם>')` כ-`anon` | 0 שורות / שורה אחת בלי `workspace_id` ו-`brand_kit_id` |
| | `select * from landing_pages` כ-`anon` | שגיאת הרשאה (`42501`) |
| | `insert into leads (…)` כ-`service_role` בלי `source` / עם `source = 'landing_page'` | `source = 'meta_form'` / מצליח |
| | `insert into consents` עם `kind = 'meta_ads_terms'` ו-`source = 'meta_connect'` כ-`service_role` | מצליח; `source = 'meta_oops'` ← `23514` |
| | `webhook_events` עם `provider = 'meta'` | מצליח |
| | `meta_connections`: שתי שורות חיות לאותה סביבה | `23505` (`meta_connections_one_live`) |
| | `purge_meta_data(WA, 'all')` כ-`service_role` | אין שורות ב-`meta_tokens`, `ad_campaigns`, `leads`, `social_posts` של WA; של WB לא השתנה |
| | `has_function_privilege('authenticated', 'public.ad_budget_changes_last_hour(uuid)', 'execute')` | `false` |
| `12_trends_rls.sql` (`0014`) | `anon` קורא `slug, name_he` מ-`trend_templates` | רק `published`, ו-`retired` עם `published_at`; טיוטה לא מוחזרת |
| | `anon` או `authenticated` קוראים `source_reference_id`, `do_not_copy`, `created_by` או `updated_by` | שגיאת הרשאה על העמודה |
| | משתמש רגיל קורא `trend_references` / `trend_analyses`; מנהל פלטפורמה עם `aal1` / עם `aal2` | 0 שורות; 0 / שורות |
| | `select * from trend_template_stats_daily` ישיר | שגיאת הרשאה |
| | `trend_template_benchmark(t, 'restaurants')` כש-`cross_customer_benchmarks.enabled = false` / `true` עם 4 עסקים / עם 5 | 0 / 0 / שורה |
| | `trend_feed(WB)` כ-A / `trend_feed(WA)` כחבר | 0 שורות (R39) / רק `published` שלא פגו, בלי `retired` |
| | `trend_templates` עם `ad_safety = 'organic_only'` ו-`recommended_ad_goal = 'lead_form'` | `23514` |
| | `guided_shoots` ו-`trend_template_uses` של WB כ-A | 0 שורות |
| | עורך מכניס `project_versions` עם `hook_score` | שגיאת הרשאה (`42501`) |
| | `update project_versions set hook_score = '{"score":80}'` כ-`service_role` על גרסה עם עבודה | מצליח, ו-`updated_at` לא השתנה; `set script = …` על אותה גרסה עדיין נכשל |
| | `update workspaces set benchmarks_opt_out = true` כבעלים / כעורך | מצליח / 0 שורות |
| | `storage.objects` ב-`trend-refs` כ-`authenticated` (קריאה והכנסה) | 0 שורות / נדחה |
| | `allowed_mime_types` של `uploads` | מכיל `video/webm` |

### 25.3 נתוני הבדיקה

הבדיקות לא תלויות ב-seed המלא: כל קובץ יוצר משתמשים וסביבות דרך `tests.create_user`, ומכניס שורות קטלוג מינימליות (קטגוריה, נישה, סוג, 3 הוקים) כ-`postgres`. רק `08_search.sql` דורש את ה-seed (מסומן `skip` אם `select count(*) from hooks < 300`), וב-CI הוא רץ אחרי `pnpm db:seed`.

### 25.4 מקביליות (Vitest, ‏`tests/contract/credits.concurrency.test.ts`)

```ts
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL, max: 60 });

test("parallel reserves never overdraw", async () => {
  const ws = await fixtureWorkspaceWithBalance(pool, 100);              // grant_credits(…,'promo',…)
  const results = await Promise.allSettled(Array.from({ length: 50 }, (_, i) =>
    pool.query("select public.reserve_credits($1, 10, null, $2)", [ws, `test:${ws}:${i}`])));
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(10);
  expect(results.filter((r) => r.status === "rejected" && /INSUFFICIENT_CREDITS/.test(String(r.reason)))).toHaveLength(40);
  const { rows } = await pool.query("select balance from public.workspace_balances where workspace_id = $1", [ws]);
  expect(rows[0].balance).toBe(0);
  expect((await pool.query("select * from public.credit_invariant_violations()")).rowCount).toBe(0);
});

test("same idempotency key in parallel creates one reservation", async () => { /* 20 × reserve(ws, 10, null, 'same') → one id, one ledger row */ });
test("capture + settle racing with refund_reservation stays consistent", async () => { /* invariants hold, refunded or settled, never both */ });
test("create_job_and_reserve respects concurrent_jobs under 10 parallel calls", async () => { /* exactly max jobs created */ });
```

### 25.5 בדיקות API (Vitest + MSW, ‏`tests/contract/api/*.test.ts`)

- לכל נתיב ב-§19–§21: בקשה תקינה, בקשה לא תקינה (400 עם `issues`), משתמש לא מחובר (401), תפקיד חסר (403), משאב של סביבה אחרת (404).
- נתיבי קרדיטים: אותו `Idempotency-Key` פעמיים, ומפתח שנעשה בו שימוש עם גוף אחר.
- webhooks: חתימה שגויה, חתימה תקינה, משלוח כפול, אירוע לא סופי — עם fixtures ב-`tests/fixtures/openrouter/*.json` ו-`tests/fixtures/payments/*.json`.
- `POST /api/unsubscribe?token=` (`tests/contract/api/unsubscribe.test.ts`): POST חד-קליקי בלי עוגיות ובלי `Origin` ← 200, שורת `email_suppressions` אחת ו-3 שורות `consents` (`granted = false`, ‏`source = 'unsubscribe'`, אחת לכל `marketing_*`); כש-`recordConsent` זורק — עדיין 200 ושורת ההסרה נשמרה; טוקן לא תקין ← 400.
- בדיקת "כיסוי נתיבים": סקריפט שמוצא כל `route.ts` תחת `app/api` ומוודא שהוא מייצא handler שנבנה ב-`route()` (או ברשימת החריגים: webhooks, ‏`/.well-known/workflow`) ושיש לו לפחות קובץ בדיקה אחד.
- **ההרחבה:** לכל נתיב של §21b — אותם חמישה מקרים, ועוד דגל כבוי (404) ו-`META_NOT_CONNECTED` כשאין חיבור. Meta נבדקת רק מול ה-mock (`META_PROVIDER=mock`, handlers של MSW ו-fixtures ב-`tests/fixtures/meta/*.json`, חלק 07), כולל כותרות שימוש שמפעילות את השער ושגיאות 190, 613 ו-2207042. ה-webhooks של Meta: אתגר עם טוקן נכון ושגוי, חתימה שגויה, משלוח כפול של `leadgen`, ו-`signed_request` לא תקין ב-deauthorize ובמחיקת נתונים. הטופס הציבורי של דף העסק: honeypot, הגבלת קצב ודף שלא פורסם. M2 (`callback`) לא בנוי ב-`route()` הרגיל, כי הוא מחזיר הפניות; הוא ברשימת החריגים ויש לו בדיקה משלו.

### קריטריוני קבלה
- [ ] `pnpm db:test` ירוק ב-CI, וכל שורה בטבלה ב-25.2 ממומשת כ-assertion אחד לפחות.
- [ ] בדיקת המקביליות רצה 20 פעמים ברצף בלי כישלון (flaky = באג).
- [ ] בדיקת כיסוי הנתיבים נכשלת כשמוסיפים `route.ts` חדש בלי `route()` או בלי בדיקה.
- [ ] `11_meta_rls.sql` ו-`12_trends_rls.sql` רצים ב-CI אחרי `db reset`, וכל שורה שלהם ממומשת כ-assertion; בדיקת ה-allow-list ובדיקת ה-grants של הטבלאות נכשלות כשמוסיפים ל-`0013` טבלה בלי `revoke all … from anon, authenticated`.

---

## תלויות בין חלקים

החלק הזה הוא הבעלים של הסכמה, ה-RLS, פונקציות ה-SQL, רשימת הנתיבים, קודי השגיאה, ה-buckets של הגבלות הקצב, מפתחות Upstash, רשימת `app_settings`/`feature_flags` ורשימת פעולות הביקורת. מאז הרחבת 2026-10-17 הוא גם הבעלים של אינדקס המיגרציות שאחרי ההשקה (§2.3), של העמודה `project_versions.hook_score` (§2.3, §19.10) ושל רשימת האב של נתיבי ההרחבה (§21b), בזמן שה-SQL המלא של `0013`/`0014` כתוב בחלקים 07 ו-08. החלקים האחרים צורכים אותם כך:

- **חלק 01:** `THEME_SCRIPT_SOURCE` (`components/a11y/theme-script.tsx`) — ה-hash שלו נכנס ל-CSP ש-`proxy.ts` מייצר (§17.2). סכומים בשקלים בכל מקום עוברים דרך `formatIls` (תחילית: "₪119").
- **חלק 02:** קורא את הקטלוג עם `createStaticClient()` ואת `search_hooks` / `search_hooks_facets` (§11.1), ו-`GET /api/hooks/search` לשינויי פאסטים בדפדפן. משתמש בעמודות ה-DB-only של `niches` ובערכי `niche_extras.json` (§5, §16.1), בטפסים הציבוריים (§21.4), בערכי `src` של `CreateProjectBody` (§19.3), בנתיבי `public-media` של קיר ההדגמה (§13.1), וב-`marketingExperiments` (`lib/seo/experiments.ts`: rewrite ל-`/exp/hero/[variant]` רק כשקיימת עוגיית `exp_hero`), שחלק 02 מממש וה-proxy מפעיל על `/`. ערכי ה-seed של התוכניות, החבילות ו-`credit_costs.label_he` (§16.4) הם הקנוניים. **מההרחבה:** הדפים `/trends`, `/trends/[slug]` ו-`/meta/data-deletion` קוראים מ-`trend_templates` (grant העמודות של `anon`) ומ-`meta_data_deletion_requests` דרך השרת, ונשארים מחוץ ל-proxy (§17.2); `PlanMetaFeatures` מציג את מפתחות ה-`limits` של §16.4, ו-`features_he` לא משתנה. **רשום בחלק 02:** הדף `/meta/data-deletion?code=` קורא את הסטטוס בלקוח הסודי ומציג רק "התקבלה" / "בטיפול" / "הושלמה".
- **חלק 03:** מציג את 27 קודי השגיאה ואת הווריאנטים לפי `reason` / `scope` / `limit` (§18.2) מ-`messages/he.json → errors.*`; צורך זרמי NDJSON דרך `useNdjsonObject` (§18.5); עוטף את `subscribeJob` / `subscribeWorkspace` ב-`useJobChannel` / `useWorkspaceChannel` (§14.2); כותב את `ProjectBrief`, `RenderOptions` ו-`renderOptionsReset` (§19.3); מציג "משתמש שנמחק" כשעמודת מחבר היא NULL (§9.6); מסכי האדמין ו-`/admin/mfa` עובדים מול §24.1 ו-`platform_admin_status()` (§9.2); Server Actions לפי §24.2. **מההרחבה:** מציג את ה-`details` של חמשת הקודים החדשים ואת הערכים החדשים של `PLAN_LIMIT.limit` ושל `RATE_LIMITED.scope` (§18.2, §18.6); צורך את `CampaignBroadcast`, `LeadBroadcast` ו-`SocialPostBroadcast` דרך `useWorkspaceChannel` (§14.2); מציג את `HookScoreBadge` מ-§19.10. **רשום בחלק 03:** הקופי ל-`reason` החדשים של `INVALID_INPUT` (`production_mode_unavailable`, `overlay_slot_unknown`, `trim_out_of_range`, `no_storyboard`, `slug_invalid`, `slug_taken`, `slug_reserved`, ומחלק 07 גם `too_many_pages`, `legal_identity_missing`, `no_contact_channel`, `outside_month`) ול-`scope` של ה-buckets החדשים (`meta_write`, `meta_refresh`, `social_publish`, `leads_export`, `landing_lead`, `health_check`, `plan_generate`); ודיאלוג מחיקת החשבון אומר שקמפיינים שרצים במטא ממשיכים לרוץ שם, ומציע להשהות אותם קודם (§9.6).
- **חלק 05:** מממש את `lib/ai/*`, `estimate()` (כולל `alreadySpent`, §19.7), את מבנה `job_steps.output` (§6), את התחלת עבודות האחים לפי `options.afterJobId` (§10.4, §23), את `buildPromoProps` לפי `projects.render_options` ← ערכת המותג ← ברירת מחדל, את `moderation.upload.v1` ש-`uploads/complete` קורא (§20.2), את `post.caption.v1` ו-`edit.chat.v1` (§19.5), ואת `PLACEHOLDERS` / `HOOK_PLACEHOLDERS` (`lib/hebrew/placeholders.ts`) ו-`BANNED_PHRASES` (`lib/ai/prompts/style-data.ts`) שה-seed מייבא (§16.2). כותב את `ai_generations` (כולל `meta`) וקורא את `hebrew_wps` ו-`tts_fallback_voices`. החוזה עם מנוע הקרדיטים — §10.7. **מההרחבה:** `route()` עם `needsVideoInput` מסנן לפי `model_registry.capabilities.video_in` (§16.5); שלושת הנתיבים `llm.ads`, `llm.video` ו-`llm.vision_frames` קבועים ב-`model_routes.json`; `post.caption.v2` מחזיר `first_line_cta_he` ועד 5 האשטגים (§19.5); `scenes.overlay` וחיתוכי המדיה נכנסים ל-`scenes_digest` (§19.6). **רשום בחלק 05:** `HookScoreV1` (`lib/ai/schemas/hooks.ts`, חלק 05 §11.2) הוא המבנה ששמור ב-`project_versions.hook_score` (§19.10), ו-`lib/hooks/score.ts` מחשב אותו ואת `input_hash`.
- **חלק 06:** כותב את הגוף של `billing_apply_payment` / `billing_apply_renewal` / `billing_apply_plan_change` (§10.8) מעל `lib/billing/engine.ts`; מממש את ספקי התשלום והחשבוניות (`parseWebhook(raw, headers, url?)`, §22.4–§22.5), את `lib/workspace/limits.ts` (`canGenerate`, `availableBrandKits`, §9.5b), את `buildCsp` (`lib/security/csp.ts`), את `lib/crypto.ts` (`hmacSign`, `hmacVerifyAny`, `secretList`, טוקני מייל), את `sendEmail` מעל `email_messages`, את טבלת משתני הסביבה (§20 שם), את תהליכי הגיבוי עם `backup_reader` (§15b) ואת טבלת השמירה של §11.5 שם (= §15 כאן). ההחלטות שממתינות לעורך דין או לרו״ח ונוגעות לחלק הזה (פטור הרינדורים לסביבות שילמו, מילת האישור "מחיקה", `annual_prorata`) רשומות בחלק 06 §25. **מההרחבה:** טבלאות הדגלים (24) וה-`app_settings` (30) של §16.4 הן הרשימות הראשיות של ה-seed, וחלק 06 §21 מתאר אותן; `META_APP_SECRET` נכנס לכלל הרוטציה של §22.1. **רשום בחלק 06:** `buildCsp` מקבל `pathname` (§17.2) ומוסיף `frame-src https://www.facebook.com` רק בבונה הקמפיינים; שורות השמירה של §11.5 שם כוללות גם את דוחות בדיקת הדופק (12 חודשים) ואת `public-media/landing/` (עד ביטול הפרסום).
- **חלק 07 (Meta, קמפיינים, לידים, פרסום רגיל, דף העסק, בדיקת דופק, תוכנית 30 יום):** כותב את ה-SQL המלא של `0013_meta_integration.sql` לפי הכללים של §2.3 ו-§12.7, את החוזים ב-Zod ואת הלוגיקה של הנתיבים ב-§21b.2–§21b.3, את הלוגיקה של ה-webhooks של Meta (§22.6), של ה-cron-ים החדשים של §23 (כולם חוץ מ-`trends-lifecycle`) ושל הזרימות, ואת הטריגרים של אירועי Realtime (§14.1). צורך מכאן: קודי השגיאה ו-`details` (§18.2), ה-buckets והמגבלות העסקיות (§18.6), `claimWebhook` (§22.1), עטיפת ה-cron (§23), `begin_spend`/`commit_spend` ל-`landing.generate` (§19.5), מפתחות ה-`limits` (§16.4) ומפתחות Upstash (§18.6). **רשום בחלק 07:** `0013` נכנס כבר במיזוג של M8 ושלם מראש (§2.3); `revoke all … from anon, authenticated` לכל טבלה חדשה; `purge_leads()` נשללת גם מ-`service_role`; כל FK ל-`profiles` הוא `on delete set null`; `leads.source` הוא `lead_source` עם ברירת המחדל `meta_form`; מזהי הנתיבים LP1–LP9, HC1–HC2, PL1–PL3 ותפקידי ההרשאה שלהם (פרסום דף עסק והרצת בדיקת דופק = owner/admin; LP3 ליצירה מחדש ו-LP9 לספירת צפיות הם החלטה של חלק 07 §24, וחלק 07 §7.1 משתמש באותם מזהים); `landing_page_public` מחזירה דף `published` בלי `workspace_id`; העתקת סרטון הפתיחה ל-`public-media/landing/{id}/` בפרסום ומחיקתו בביטול (§13.1); honeypot ולא CAPTCHA בטופס הציבורי; פעולות הביקורת `landing.publish`/`landing.unpublish`/`landing.delete` ומיפוי שאר הפעולות (§24.1); ה-`external_id` של deauthorize ושל מחיקת נתונים (§22.6); מפתחות המטמון `meta:previews:*` ו-`meta:explain:*`; שמירת `ad_health_reports` ל-12 חודשים בתוך `purge-meta-raw` (§15); וחריג מתג החירום של `meta_ads` ודגלי הלידים (§21b.1).
- **חלק 08 (טרנדים וצילום מודרך):** כותב את ה-SQL המלא של `0014_trends.sql`, ומעתיק לסופו **כלשונו** את הבלוק של חלק 04 (`project_versions.hook_score` והטריגר של `set_updated_at`, §2.3); כותב את החוזים והלוגיקה של §21b.4 ושל נתיבי האדמין A1–A11 (§24.1), את `trends-lifecycle` ואת סעיף 9 של `cleanup` (§23), ואת ה-bucket `trend-refs` (§13.1). **רשום בחלק 08:** `seed/scripts/build_trends.py` מקבל `--check` (§2.2, §16.1); `lib/trends/seed-schema.ts` מייצא את `TrendTemplateSeed` ואת `TREND_TEMPLATE_KEY_ORDER` (§16.2); `trend_references.rights_attested_by` הוא nullable עם `on delete set null`; רינדורי ההדגמה רצים בסביבה `ws-trends-studio` של `pnpm db:seed --studio` (§16.3); משבצות הטקסט של `SceneOverlayV1` הן המפתחות של `overlayTexts` (§19.6).
- **נספחים A–C:** הקבצים ב-`/seed` הם מקור האמת (ומההרחבה גם `/seed/trend_templates.json` של חלק 08); `pnpm seed:sync` מעתיק אותם ל-`supabase/seed/data/`, ו-`pnpm db:seed` טוען אותם (§16).
- **נספח E:** רשימת הביטויים האסורים (§5.2 שם) וברירות המחדל לכל נישה (§3.3 שם, דרך `niche_extras.json`); מגבלות האורך של `LENGTH_LIMITS` (§12 שם) לטקסטים של שכבות הטרנד (§19.6) ולכללי האמת של דף העסק (§21b.3).
- **נספח F:** המפרט המקורי. כשיש סתירה, החלק הזה גובר; תיבת התיקונים בראש נספח F מפנה לכאן בנושאי הזרימה (NDJSON), ‏`afterJobId`, ‏`realtime.send`, תוספות הסכמה, קודי השגיאה, משימות pg_cron, המושבים, הגבלות הקצב, `app_settings` ו-`webhook_provider`.
- **החלטות שנקבעו כאן בהרחבה** (אין להן מקור אחר, וכל חלק שנוגע בהן מפנה לכאן): (1) `0013` ו-`0014` נכנסים יחד במיזוג הראשון של M8, כי ל-`0014` יש FK לעמודות של `0013` (§2.3); (2) `set_updated_at` של `project_versions` עובר לרשימת עמודות בלי `hook_score` (§2.3); (3) כל טבלה חדשה מתחילה ב-`revoke all … from anon, authenticated`, ופונקציה שהשרת קורא לה מקבלת grant מפורש ל-`service_role` (§2.3); (4) `purge_leads` רצה רק מ-pg_cron (§12.7); (5) סרטון הפתיחה של דף העסק מועתק ל-`public-media/landing/{id}/` בפרסום (§13.1); (6) `video/webm` מתקבל רק בצילום מודרך (§20.2); (7) דוחות בדיקת הדופק נמחקים אחרי 12 חודשים בתוך `purge-meta-raw` הקיימת (חלק 07 §6.7, חלק 06 §11.5), ולא במשימה נוספת (§15); (8) נתיבי הלידים פתוחים כשאחד מ-`meta_lead_forms` או `landing_pages` דולק או כשיש לידים, מתג החירום של `meta_ads` משאיר צפייה, השהיה וסיום, ו-M6 (ניתוק) עובד תמיד כשיש חיבור (§21b.1); (9) ארבעת דגלי מפת הדרכים לא נזרעים (הרשימה הראשית של חלק 06 §21.1), וסך הדגלים ב-seed הוא 24 (§16.4); (10) פרסום דף עסק והרצת בדיקת דופק הם owner/admin (כמו חלק 07 §7.1), וציון הוק פתוח ל-member (§21b.3, §19.10); (11) `landing_pages` סופר דפים **שפורסמו** בלבד, ו-`features_he` של התוכניות לא משתנה (§16.4); (12) השמות שנוספו כאן: פעולות הביקורת `landing.*`, מפתחות Upstash `meta:previews:*` ו-`meta:explain:*`, ה-`external_id` `deauth:*` ו-`deletion:*`, וה-`reason` החדשים של `INVALID_INPUT` שברשימה של חלק 03 למעלה.
