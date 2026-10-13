# חלק 02 — אתר שיווקי, ספריית הוקים ציבורית ו-SEO

החלק הזה מגדיר כל עמוד ציבורי של {{BRAND_NAME}}: המעטפת הגלובלית (כותרת, פוטר, פס הודעה, כפתור וואטסאפ, באנר עוגיות), דף הבית סקשן אחר סקשן עם קופי סופי, דפי הנישה, ספריית ההוקים הציבורית על כל סוגי העמודים שלה, דוגמאות, תבניות, מחירים, בלוג עם שלושה מאמרים מלאים, אודות, יצירת קשר, שאלות נפוצות ושבעת הדפים המשפטיים בנוסח מלא.
בנוסף מוגדרים כאן כללי ה-SEO (מטא-דאטה, JSON-LD, מפות אתר, robots, תמונות OG, קישור פנימי), תקציבי הביצועים ואירועי האנליטיקה השיווקיים.
כל מחרוזת שמופיעה כאן בעברית היא הנוסח הסופי לשילוב ב-`messages/he.json` או בקובצי ה-MDX — לא טיוטה ולא דוגמה. הדפים המשפטיים מסומנים "טיוטה לבדיקת עורך דין" ומכילים משתנים משפטיים מפורשים בלבד.
העיצוב, הטוקנים והרכיבים המשותפים מוגדרים בחלק 01; כאן משתמשים בהם בשמם (`HookCard`, `VideoTile`, `Price`, `Num` וכו׳) ולא מגדירים אותם מחדש.

---

## §1. תשתית משותפת לאתר השיווקי

### §1.1 קבוצת הנתיבים ואופן הרינדור

כל העמודים הציבוריים נמצאים תחת `app/(marketing)/`, עם `layout.tsx` אחד שמרכיב את `AnnouncementBar`, `MarketingHeader`, `MarketingFooter` ו-`MobileStickyCta`. הנתיבים הם בדיוק אלה שבמבנה הריפו (חלק 00 ונספח F §3–§4.2); החלק הזה הוא הבעלים של רשימת הנתיבים הציבוריים, וקובע את התוכן, ה-H1, הרינדור והאינדוקס של כל אחד.

**אסטרטגיית URL (החלטה):** slugs באנגלית ב-kebab-case, וכותרות, H1, מטא ו-Breadcrumbs בעברית. הסיבה: קישור באנגלית קצר, יציב וקריא כשמשתפים אותו בוואטסאפ, ואילו נתיב בעברית מקודד באחוזים כשמדביקים אותו. גוגל מדרג לפי הכותרת, ה-H1 והתוכן בעברית, ולכן הביטוי שמחפשים ("סרטון תדמית לרופא שיניים", "הוקים לרילס נדל״ן") נכנס ל-`<title>`, ל-H1 ולפתיח. סוגי ההוקים כבר ב-kebab-case ב-seed, כך שקטע ה-URL זהה ל-slug (`/hooks/types/curiosity-gap`) בלי המרה.

תקציר מחייב:

| נתיב | רינדור | revalidate | תגיות מטמון (`revalidateTag`) |
|---|---|---|---|
| `/` | Static + ISR | 3600 | `landing`, `hooks:hotd`, `examples`, `plans`, `credit_costs` |
| `/niches` · `/niches/[niche]` | SSG + ISR (`generateStaticParams` על נישות פעילות) | 86400 | `niches`, `niche:{slug}`, `examples` |
| `/hooks` | SSR (דינמי, כי הפאסטים מגיעים מ-`searchParams`), עם נתונים מהמטמון; פילטרים מתעדכנים בצד לקוח | מטמון נתונים 3600 | `hooks`, `hooks:hotd` |
| `/hooks/[niche]` | SSG + ISR | 21600 | `hooks`, `hooks:niche:{slug}`, `niche:{slug}` |
| `/hooks/[niche]/[type]` | ISR (רק צירופים עם הוק אחד לפחות) | 21600 | `hooks:niche:{slug}` |
| `/hooks/types` · `/hooks/types/[type]` | SSG | 86400 | `hook_types`, `hooks` |
| `/hooks/season/[season]` | ISR | 86400 | `seasons`, `hooks` |
| `/hooks/platform/[platform]` | SSG | 86400 | `hooks` |
| `/hooks/h/[id]` | ISR | 21600 | `hook:{id}` |
| `/examples` | ISR | 3600 | `examples` |
| `/templates` · `/templates/[slug]` | SSG + ISR | 86400 | `templates`, `template:{slug}` |
| `/pricing` | SSG + ISR | 86400 | `plans`, `credit_packs`, `credit_costs`, `app_settings` |
| `/blog` · `/blog/[slug]` · `/blog/tag/[tag]` | SSG | — | (נבנים מחדש בכל פריסה) |
| `/about` · `/contact` (`?topic=` נקרא בצד הלקוח) · `/faq` | SSG | — | — |
| `/legal/{terms,privacy,cancellation,accessibility,ai-policy,likeness-consent,cookies}` (`?v={version}` לגרסה מהארכיון) | דינמי, כי הוא קורא את `?v=` בצד השרת; בלי cookies, וה-MDX של כל הגרסאות מקומפל בזמן ה-build, כך שהרינדור זול | — | — |
| `/accessibility` | הפניה קבועה (308) ל-`/legal/accessibility` (`next.config.ts` → `redirects`) | — | — |
| `/exp/hero/[variant]` | SSG (`b`, `c`), `noindex`, יעד rewrite בלבד מ-`/` (§3.3.2) | 3600 | כמו `/` |
| תמונות OG: `/opengraph-image`, `/niches/[niche]/opengraph-image`, `/hooks/[niche]/opengraph-image`, `/hooks/types/[type]/opengraph-image`, `/hooks/h/[id]/opengraph-image`, `/blog/[slug]/opengraph-image` | `next/og` (§12.5) | כמו העמוד | כמו העמוד |
| `/sitemap.xml` (+ מקטעי `generateSitemaps`) · `/robots.txt` | §12.3 | 3600 | — |

נתיבים ציבוריים שהעמודים שלהם מוגדרים בחלקים אחרים, ונמצאים ברשימה הזו כדי שתהיה מלאה: `/v/[token]` ו-`/v/[token]/opengraph-image` (דף שיתוף, חלק 03 §8), `/approve/[token]` (אישור לקוח, חלק 03 §8.4), `/login` (`?next=&invite=&email=`) · `/auth/callback` · `/auth/confirm` · `/auth/error` (חלק 03 §3), ו-`/unsubscribe` (`?token=`, העמוד מוגדר כאן ב-§11.6). כולם דינמיים ו-`noindex`. הנתיבים `/dev/*` קיימים רק מחוץ לפרודקשן (חלק 06).

כללים:
- עמודי השיווק לא קוראים cookies ולא את הסשן בצד השרת (אחרת הם הופכים לדינמיים). כל מה שתלוי במשתמש (מצב מחובר בכותרת, מועדפים, התאמה אישית של הוקים) נעשה ב"איים" קטנים בצד הלקוח.
- קריאת נתונים נעשית רק דרך `lib/marketing/queries.ts` (מודול `server-only`) עם לקוח Supabase ציבורי ללא cookies (`createStaticClient()` במפתח `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), שקורא רק את הקטלוג הציבורי שמותר ל-`anon` לפי ה-RLS (ראו חלק 04). כל פונקציה עוטפת את השאילתה ב-`unstable_cache(fn, keyParts, { tags, revalidate })` עם התגיות וה-revalidate שבטבלה (בלי `cacheComponents`; `[M0-verify]` ב-Next 16).
- כל פעולת אדמין שמשנה נישה, הוק, דוגמה, תבנית, תוכנית, חבילה או עלות קרדיטים מבטלת את התגיות הרלוונטיות מיד אחרי השמירה (ראו חלק 03, מסכי האדמין): מ-Route Handler או מ-cron דרך `revalidateTag(tag, "max")`, ומ-Server Action שצריך לראות את השינוי מיד (read-your-writes) דרך `updateTag(tag)`. הצורה החד-ארגומנטית `revalidateTag(tag)` לא בשימוש.
- עמודים סטטיים עם מסננים (`/hooks/[niche]`, `/examples`, `/templates`) מטמיעים את כל הרשומות שלהם ב-HTML ומסננים בצד הלקוח (`useSearchParams` בתוך `Suspense`), כדי שיישארו סטטיים. רק `/hooks` (האב, עם חיפוש בכל הספרייה) מרונדר דינמית.
- `generateStaticParams` מחזיר רק נישות עם `is_active = true`. נישה עם `compliance_flag = 'political'` לעולם לא נבנית ולא מקושרת.
- מילים שמורות שאסור שיהיו slug של נישה: `types`, `season`, `platform`, `h`, `new`, `search`. סקריפט ה-seed ובדיקת יחידה ב-`tests/unit/routes.test.ts` נכשלים אם נישה מקבלת slug כזה.

```ts
// lib/marketing/queries.ts (תקציר החוזה)
import "server-only";
export async function getActiveNiches(): Promise<NicheDTO[]>;                 // tags: niches
export async function getNiche(slug: string): Promise<NicheDetailDTO | null>; // tags: niche:{slug}
export async function getHooksForNiche(slug: string): Promise<HookCard[]>;    // tags: hooks:niche:{slug}
export async function searchHooks(f: HookSearchParams): Promise<HookSearchResult>; // RPC search_hooks + search_hooks_facets; טיפוסים מחלק 04 §20.3 (§5.1)
export async function getHookOfTheDay(): Promise<HookCard | null>;            // tags: hooks:hotd
export async function getHookTypes(): Promise<HookTypeDTO[]>;                 // tags: hook_types
export async function getSeasons(): Promise<SeasonDTO[]>;                     // tags: seasons
export async function getPublishedExamples(f?: ExampleFilters): Promise<ExampleDTO[]>; // tags: examples
export async function getPublicTemplates(): Promise<TemplateDTO[]>;           // tags: templates
export async function getPricing(): Promise<PricingDTO>; // plans + packs + credit_costs + vat_rate + typical_video_credits + bitEnabled (§7.3)
export async function getMarketingCounters(): Promise<CountersDTO>;           // מונים אמיתיים בלבד (§3.11)
```

### §1.2 קבועים, משתנים ותוויות

`lib/constants.ts` מרחיב את `BRAND` (ראו חלק 01) בשדות שהאתר השיווקי והדפים המשפטיים צריכים. זה המקום היחיד בקוד שבו מופיעים משתני התוכן שהבעלים ממלא (הרשימה המלאה: חלק 06 §20); כל עמוד, מייל ודף משפטי קורא אותם מכאן. ערכים חסרים לא מוצגים — אם `BRAND.social.tiktok` ריק, האייקון לא מופיע.

```ts
// lib/constants.ts (תוספות לאתר השיווקי ולדפים המשפטיים)
import { withPrefix } from "@/lib/hebrew/text"; // withPrefix(prefix, word): מילה עברית → מוצמד בלי מקף; ספרה או אות לטינית → עם מקף (§5.8)

const NAME_HE = "{{BRAND_NAME}}";           // שם עברי בהגדרה (חלק 00), ולכן אות השימוש מוצמדת בלי מקף

export const BRAND = {
  nameHe: NAME_HE,
  nameHeWith: {                              // צורות מוכנות עם אות שימוש; מחרוזות ICU מקבלות אותן כמשתנה ({inBrand}, {toBrand}, {fromBrand})
    b: withPrefix("ב", NAME_HE),             // "נוצר ב{{BRAND_NAME}}"
    l: withPrefix("ל", NAME_HE),             // "ברוכים הבאים ל{{BRAND_NAME}}"
    m: withPrefix("מ", NAME_HE),             // "מ{{BRAND_NAME}}"
    sh: withPrefix("ש", NAME_HE),
    h: withPrefix("ה", NAME_HE),
    v: withPrefix("ו", NAME_HE),
  },
  watermarkHe: `נוצר ${withPrefix("ב", NAME_HE)}`, // סימן המים בסרטונים החינמיים (חלק 01)
  nameEn: "{{BRAND_NAME_EN}}",
  domain: "{{DOMAIN}}",
  emails: {
    hello: "hello@{{DOMAIN}}",
    support: "support@{{DOMAIN}}",
    privacy: "privacy@{{DOMAIN}}",
    accessibility: "accessibility@{{DOMAIN}}",
    abuse: "abuse@{{DOMAIN}}",
    billing: "billing@{{DOMAIN}}",
    approvals: "approvals@{{DOMAIN}}",       // שולח מיילי אישור לקוח (חלק 06 §12.1)
    news: "news@mail.{{DOMAIN}}",            // שולח הדיוור, מתת-דומיין נפרד (חלק 06 §12.1)
  },
  whatsapp: "{{WHATSAPP_NUMBER}}",          // ספרות בלבד, בפורמט בינלאומי: 9725XXXXXXXX
  phone: "{{SUPPORT_PHONE}}",               // לתצוגה, עטוף ב-<bdi>
  social: { instagram: "", tiktok: "", youtube: "", facebook: "", linkedin: "" },
  legal: {
    entityName: "{{LEGAL_ENTITY_NAME}}",
    companyId: "{{COMPANY_ID}}",
    address: "{{LEGAL_ADDRESS}}",
    effectiveDate: "{{LEGAL_EFFECTIVE_DATE}}",
    jurisdictionCity: "{{JURISDICTION_CITY}}",
    dpoName: "{{DPO_NAME}}",                 // ריק = לא מונה ממונה; המשפט שמזכיר אותו לא מוצג (§10.3)
  },
  a11y: {
    coordinatorName: "{{A11Y_COORDINATOR_NAME}}",
    coordinatorTitle: "{{A11Y_COORDINATOR_TITLE}}",   // "רכז הנגישות" או "רכזת הנגישות"
    coordinatorPhone: "{{A11Y_COORDINATOR_PHONE}}",
    coordinatorEmail: "{{A11Y_COORDINATOR_EMAIL}}",
    statementDate: "{{A11Y_STATEMENT_DATE}}",
    auditDate: "{{A11Y_AUDIT_DATE}}",
    auditor: "{{A11Y_AUDITOR}}",
  },
} as const;

export const WHATSAPP_PREFILL_HE = "היי, יש לי שאלה על {{BRAND_NAME}}";
export const whatsappHref = (text = WHATSAPP_PREFILL_HE) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
```

**אותיות שימוש לפני משתנה (חלק 00 §6.5):** `{{BRAND_NAME}}` הוא שם עברי, ולכן אות השימוש מוצמדת אליו בלי מקף: "נוצר ב{{BRAND_NAME}}", "ברוכים הבאים ל{{BRAND_NAME}}", "מ{{BRAND_NAME}}". בקוד משתמשים ב-`BRAND.nameHeWith` וב-`BRAND.watermarkHe`, ומחרוזת ICU מקבלת משתנה שכבר מוצמד (`{inBrand}`, `{toBrand}`, `{fromBrand}`). משתנה של טקסט עברי שנקבע בזמן ריצה (`{name}`, `{inviterName}`, `{workspaceName}`, `{seasonName}` וכו׳) לא מקבל אות שימוש בכלל, לא מוצמדת ולא עם מקף; מנסחים עם מילה נפרדת ("הזמנה מאת {inviterName}"). ספרות, טקסט לטיני, כתובות מייל ותאריכים מעוצבים שומרים על המקף ("ב-14 באוקטובר"). `lint:copy` נכשל על `[ובלמהשכ]-\{\{BRAND_NAME\}\}` (חלק 01 §2.6). החריג המכוון: `short_name_he` של נישה נכתב מראש כצירוף ברבים שמצמידים אליו את האות ל (בהמשך הסעיף).

תוויות עבריות לערכי enum נמצאות במקום אחד, `lib/labels.ts`, ומפנות למפתחות ב-`messages/he.json` (namespace `common.labels`). האתר השיווקי, האפליקציה ופאנל הניהול משתמשים באותו מודול, ואסור לכתוב את התוויות מחדש בקומפוננטות. זה המקור היחיד גם לשמות הפלטפורמות (`common.labels.platform.*`, למשל `shorts` = "יוטיוב שורטס"); אין מפתח `common.platforms` נפרד.

| enum / שדה | ערך → תווית |
|---|---|
| `platform` | `reels` רילס · `tiktok` טיקטוק · `shorts` יוטיוב שורטס · `facebook` פייסבוק · `youtube` יוטיוב · `whatsapp` סטטוס וואטסאפ · `linkedin` לינקדאין |
| `platform` (אחרי האות ל בכותרות) | `reels` לרילס · `tiktok` לטיקטוק · `shorts` ליוטיוב שורטס · `facebook` לפייסבוק · `youtube` ליוטיוב · `whatsapp` לסטטוס בוואטסאפ |
| `hook_goal` | `awareness` חשיפה · `leads` לידים · `sales` מכירות · `trust` אמון · `engagement` מעורבות |
| `hook_gender` | `neutral` ניסוח ניטרלי · `plural` פנייה ברבים · `female` לשון נקבה · `male` לשון זכר |
| `video_type` | `brand_promo` סרטון תדמית · `reel_hook` רילס עם הוק · `offer` מבצע או חג · `testimonial` המלצה · `launch` השקה · `recruiting` גיוס עובדים · `explainer` הסבר שירות |
| `aspect_ratio` | `9:16` אנכי (רילס, טיקטוק, סטטוס) · `1:1` ריבוע (פיד) · `16:9` רוחבי (אתר, יוטיוב) |
| `quality_tier` | `draft` טיוטה · `standard` סטנדרט · `premium` פרימיום |
| `visual_mix` | `images` תמונות בתנועה · `smart` משולב (מומלץ) · `full` וידאו מלא |
| `templates.structure` | `hpspc` הוק, בעיה, פתרון, הוכחה, הנעה לפעולה · `aida` תשומת לב, עניין, רצון, פעולה · `pas` בעיה, החרפה, פתרון · `bab` לפני, אחרי והגשר ביניהם · `result_first` התוצאה קודם · `brand_story` סיפור המותג |
| `beats.role` | `hook` הוק · `problem` בעיה · `agitate` החרפה · `solution` פתרון · `proof` הוכחה · `offer` הצעה · `cta` הנעה לפעולה · `brand` מותג · `story` סיפור |
| `music_tracks.mood` | `energetic` אנרגטי · `warm` חם · `luxury` יוקרתי · `funny` קליל ומצחיק · `calm` רגוע · `inspiring` מעורר השראה · `urban` אורבני |
| `visual_style` | `cinematic` קולנועי · `ugc` צילום טלפון · `day_in_business` יום בעסק · `before_after` לפני ואחרי · `product` מוצר בפוקוס · `text_motion` טקסט בתנועה |
| caption presets | `bold-pop` פופ · `clean-box` קופסה נקייה · `karaoke` קריוקי · `poster` פוסטר · `news` חדשות · `soft` רך |

**שם קצר לנישה.** שמות הנישות בזרע ארוכים ומתאימים לכרטיס ("נדל״ן: מתווכים ומשרדי תיווך"), אבל לא לביטוי "סרטון תדמית ל…". לכן לטבלה `niches` יש עמודה `short_name_he text` (חלק 04 §5.2) — צירוף ברבים שאפשר להצמיד אליו את האות ל (למשל "מתווכי נדל״ן", "רופאי שיניים"). בכל תבנית כותרת: `ל{short_name_he ?? name_he}`. ערכי ההשקה שבטבלה נכתבים לקובץ `supabase/seed/data/niche_extras.json` ונטענים בשלב 3b של ה-seed במצב `fill_if_null` (חלק 04 §16.1), כך שעריכה באדמין לעולם לא נדרסת. הערכים להשקה:

| slug | `short_name_he` | slug | `short_name_he` |
|---|---|---|---|
| `real-estate` | מתווכי נדל״ן | `real-estate-developers` | יזמי נדל״ן |
| `aesthetic-clinics` | קליניקות אסתטיקה | `beauty-nails` | מכוני יופי וציפורניים |
| `barbers-salons` | מספרות וברברשופים | `restaurants` | מסעדות ובתי קפה |
| `fitness-trainers` | מאמני כושר | `yoga-pilates` | מורי יוגה ופילאטיס |
| `renovation-contractors` | קבלני שיפוצים | `dentists` | רופאי שיניים |
| `mortgage-advisors` | יועצי משכנתאות | `event-venues` | אולמות וגני אירועים |
| `ecommerce` | חנויות אונליין | `car-dealers` | סוחרי רכב |
| `auto-services` | מוסכים ודיטיילינג | `lawyers` | עורכי דין |
| `accountants` | רואי חשבון ויועצי מס | `insurance-agents` | סוכני ביטוח |
| `interior-design` | מעצבי פנים ואדריכלים | `event-photographers` | צלמי אירועים |
| `djs-musicians` | דיג׳ייז ומוזיקאים | `zimmers-boutique-hotels` | צימרים ומלונות בוטיק |
| `tourism-attractions` | אטרקציות וסיורים | `courses-educators` | מורים, קורסים ומאמנים |
| `therapists` | מטפלים ופסיכולוגים | `vets-dog-grooming` | וטרינרים ומספרות כלבים |
| `driving-schools` | בתי ספר לנהיגה | `kids-activities` | גנים, חוגים וקייטנות |
| `home-services` | בעלי מקצוע לבית | `movers-storage` | חברות הובלה ואחסון |
| `retail-stores` | חנויות | `catering-chefs` | קייטרינג ושפים פרטיים |
| `b2b-startups` | חברות B2B וסטארטאפים | `nonprofits` | עמותות |
| `physio-nutrition` | פיזיותרפיסטים ותזונאים | `local-politics` | (לא פעילה; לא מוצגת) |

### §1.3 מרחבי שמות ב-`messages/he.json`

| namespace | מה יש בו |
|---|---|
| `marketing.nav`, `marketing.footer`, `marketing.announcement`, `marketing.sticky` | מעטפת גלובלית (§2) |
| `marketing.home.*` | כל סקשן בדף הבית (§3), כולל וריאנטים לניסוי (`hero.variants.a/b/c`) |
| `marketing.niches.*` | תבניות דפי נישה (§4) |
| `marketing.examples.*`, `marketing.templates.*` | §6 |
| `marketing.pricing.*` | §7 |
| `marketing.faq.items.{id}.q/a` | כל השאלות הנפוצות (§9.3); דף הבית ועמוד המחירים בוחרים לפי מזהה |
| `marketing.contact.*`, `marketing.about.*` | §9 |
| `marketing.consent.*` | באנר עוגיות, הסכמות ועמוד ההסרה מדיוור (§11) |
| `common.labels.*` | תוויות enum (§1.2) — משותף לאתר, לאפליקציה ולאדמין |
| `hooks.*` | ספריית ההוקים הציבורית (§5) — משותף עם הספרייה באפליקציה |
| `legal.*` | כותרות, תוויות ומשתני מסגרת של הדפים המשפטיים; גוף הדפים עצמו ב-`content/legal/*.mdx` |

**סכומים ומספרים בקופי:** בחלק הזה סכום מופיע כ-"₪{x}" כדי שיהיה ברור איך הוא נראה. במימוש, כל סכום בשקלים מוצג דרך `formatIls` / `Price` / `Num` (חלק 01 §2.5): סימן השקל לפני המספר, בלי רווח ("₪119"), והמחרוזת ב-`messages/he.json` מקבלת משתנה ICU שכבר כולל את הסימן (`{todayIls}`) — לא כותבים ₪ ליד משתנה או מספר בקובץ ההודעות. בקובצי `content/**/*.mdx` (דפים משפטיים, בלוג) סכום מילולי מותר, כי לרכיבי ה-MDX אין `Price`/`Num`: כותבים "₪119" (₪ לפני המספר, בלי רווח), ו-`lint:copy` נכשל שם רק על סדר הפוך ("119 ₪") או על "ש״ח" אחרי מספר (חלק 01 §2.6). מירכאות בקופי הן `"…"` רגילות; גרשיים (״) רק בתוך ראשי תיבות (מע״מ, נדל״ן). בלי תווי כיווניות גולמיים בקופי (U+200E/U+200F; גם לא U+05BE, המקף העברי): טוקן לועזי או מספרי בתוך משפט עברי עטוף ב-`<ltr>` (טקסט עשיר של ICU, מרונדר כ-`bdi`) או ב-`Num`, למשל `"…כמו <ltr>@yourbusiness</ltr>."`. סימני כיווניות שמופיעים בפרוזה של המסמך הזה הם עזרי תצוגה בלבד ולא מועתקים לקוד (חלק 00 §6.5).

רשימת ה-namespaces המלאה של הפרויקט: `common`, `marketing`, `hooks`, `wizard`, `editor`, `billing`, `errors`, `emails`, `legal`, `auth`, `app`, `admin`, `ops`. האתר השיווקי משתמש רק ב-`common`, `marketing`, `hooks`, `legal` וב-`wizard.facts.q.*` (תוויות ההתאמה האישית, §5.3).

תוכן ארוך (בלוג, דפים משפטיים, הסברי סוגי הוקים, הקדמות לעונות ולפלטפורמות) נשמר כ-MDX:

```
content/
├─ blog/*.mdx
├─ legal/{terms,privacy,cancellation,accessibility,ai-policy,likeness-consent,cookies}.mdx
├─ legal/archive/{slug}-{version}.mdx  # גרסאות קודמות (§10.1)
├─ about.json                       # מייסדים לעמוד אודות (§9.1); ריק בהשקה
├─ seo/hook-types/{slug}.mdx        # הסבר ארוך לכל סוג הוק (§5.7)
├─ seo/seasons/{slug}.mdx           # הקדמה ייחודית לכל עונה (§5.8)
├─ seo/platforms/{platform}.mdx     # הקדמה לכל פלטפורמה (§5.9)
├─ seo/niche-types/{niche}--{type}.mdx  # אופציונלי: הקדמה ייחודית לצירוף נישה × סוג (§5.6)
├─ testimonials.he.json             # המלצות אמיתיות בלבד (§3.11)
├─ demo-wall.json                   # תוכנית קיר הווידאו (§3.3.6)
└─ newsletter/{issueId}.json        # גיליונות "5 הוקים לשבוע" (חלק 06 §12.5)
```

### §1.4 רכיבים

הרכיבים הקנוניים מחלק 01 (`MarketingHeader`, `AnnouncementBar`, `HeroPromptCard`, `VideoWall`, `EnginesStrip`, `NicheShowcase`, `HowItWorks`, `EditorMath`, `BeforeAfterSlider`, `SavingsCalculator`, `FeatureBento`, `HooksTeaser`, `ShowcaseGallery`, `Testimonials`, `PricingCards`, `CreditCostTable`, `FaqAccordion`, `FinalCtaBand`, `MarketingFooter`, `MobileStickyCta`, `HookCard`, `HookFilters`, `NicheIcon`, `NichePicker`, `SectionHeading`, `GlowCard`, `LegalPage`, `Breadcrumbs`, `JsonLd`, `VideoTile`, `PhoneFrame`, `VideoPlayer`, `Price`, `Num`, `LtrInput`, `DirIcon`, `EmptyState`) משמשים בשמם. החלק הזה מוסיף רכיבים שיווקיים בלבד, בקבצים ב-`components/marketing/` או `components/hooks/` (שם קובץ kebab-case):

| רכיב | תפקיד |
|---|---|
| `HookPersonalizer` | פס "התאימו לעסק שלכם" שממלא placeholders בכל כרטיסי ההוקים בעמוד (§5.3) |
| `PlaceholderChip` | הצגת placeholder לא ממולא או ממולא בתוך טקסט הוק |
| `SignupGateDialog` | דיאלוג "עוד צעד אחד" לפעולות שדורשות חשבון (§5.4) |
| `HookOfTheDay` | כרטיס "הוק היום" בהאב |
| `SeasonRail` | פס העונות הקרובות (האב ההוקים, דף נישה) |
| `NicheGrid` | רשת נישות לפי קטגוריה (`/niches`, האב ההוקים) |
| `SampleScripts` | שלושה תסריטים לדוגמה בדפי נישה והוקים (§4.3) |
| `PlanComparisonTable` | טבלת השוואת תוכניות (§7.4) |
| `BillingCycleToggle` · `VatModeToggle` | חודשי או שנתי · מחירים לעסקים לפני מע״מ (§7) |
| `CookieConsentBanner` · `CookiePreferencesDialog` | §11 |
| `NewsletterForm` | הרשמה לניוזלטר בפוטר ובבלוג (§11.5) |
| `ContactForm` | §9.2 |
| `WhatsAppButton` | כפתור או קישור וואטסאפ אחיד (§2.5) |
| `TrustRow` | שורת האמון מתחת לכרטיס הגיבור |
| `CountersRow` | מונים אמיתיים (§3.11) |
| `QuietDayBanner` | פס יום שקט (§2.1) |
| `BlogCard` · `BlogProse` · `TableOfContents` | §8 |

### §1.5 עמודי שגיאה

- `app/not-found.tsx` (משותף לאתר): כותרת "העמוד הזה נחתך בעריכה". גוף: "חיפשנו בכל הסצנות ולא מצאנו את העמוד שביקשתם. אולי הקישור ישן, ואולי פשוט הוקלדה אות אחת יותר מדי." כפתורים: "לדף הבית" · "לספריית ההוקים" · "צרו סרטון בחינם" (`cta_clicked {location:"not_found"}`). שדה חיפוש הוקים קטן: "או חפשו הוק:".
- `app/error.tsx`: כותרת "משהו השתבש אצלנו". גוף: "זו תקלה שלנו, לא שלכם. רעננו את הדף, ואם זה חוזר — כתבו לנו ונטפל." כפתורים: "רענון" · "דברו איתנו". השגיאה נשלחת ל-Sentry עם `digest`.
- `app/global-error.tsx`: אותו נוסח בתוך `<html lang="he" dir="rtl">` מינימלי, בלי תלות ב-Providers.

**קריטריוני קבלה**
- [ ] `pnpm build` מייצר את כל עמודי הנישה, ההוקים, הסוגים, העונות והפלטפורמות סטטית מתוך ה-seed, בלי קריאה ל-cookies בעמודי השיווק (בדיקה: `next build` מסמן אותם כ-○/● ולא λ).
- [ ] שינוי של הוק באדמין מופיע ב-`/hooks/[niche]` תוך פחות מדקה, דרך `revalidateTag`.
- [ ] אין מחרוזת עברית בקובצי `components/marketing/*` (בדיקת ESLint מותאמת), חוץ מ-`{{BRAND_NAME}}` דרך `BRAND`.
- [ ] אחרי `pnpm db:seed` יש `short_name_he` לכל 35 הנישות הפעילות (מ-`niche_extras.json`, חלק 04 §16.1); בדיקת ה-seed נכשלת אם חסר ערך.
- [ ] ניסיון לבנות נישה עם slug שמור נכשל בבדיקת יחידה.
- [ ] עמוד 404 ועמוד שגיאה מוצגים בעברית, RTL, בשתי ערכות הנושא, ועוברים axe ללא הפרות חמורות.

---

## §2. מעטפת גלובלית

### §2.1 `AnnouncementBar` ופס יום שקט

- גובה 36px, רקע `--color-surface-2`, טקסט `small`. מוצג מעל הכותרת בכל עמודי השיווק, וניתן לסגירה (×, `aria-label="סגירת ההודעה"`). הסגירה נשמרת ב-`localStorage` לפי מזהה ההודעה (`announcement.dismissed.{id}`), עטוף ב-try/catch.
- התוכן מגיע ממפתח `app_settings.marketing_announcement` (`{ "enabled": true, "id": "hooks-library-v1", "text_he": "…", "href": "/hooks" }`). ברירת המחדל בהשקה:
  - טקסט: **"חדש: ספריית הוקים בעברית לפי נישה. מעתיקים בחינם ←"**
  - קישור: `/hooks`
- כשמספר ההוקים המפורסמים ידוע, מותר וריאנט עם מספר אמיתי בלבד, מעוגל כלפי מטה לעשרות: "חדש: {count, plural, other {יותר מ-# הוקים}} בעברית לפי נישה ←" (למשל 320 כשיש 326; הספירה תמיד מעל 100, ולכן מספיקה הצורה `other`).
- **יום שקט:** כשהיום (לפי `Asia/Jerusalem`) נמצא בטווח `starts_on`–`ends_on` של עונה עם `is_quiet_day = true`, ההודעה השיווקית לא מוצגת. במקומה מוצג `QuietDayBanner` בלי כפתור סגירה, בלי צבע זהב ובלי קישור:
  - `memorial-day`: "היום יום הזיכרון לחללי מערכות ישראל ולנפגעי פעולות האיבה. אנחנו מתייחדים עם זכרם."
  - `holocaust-memorial-day`: "היום יום הזיכרון לשואה ולגבורה. אנחנו מתייחדים עם זכר הנספים."
  - אם `app_settings.quiet_day_banner` (`{enabled, text_he, date}`) פעיל ו-`date` הוא היום, `text_he` שלו גובר על הנוסח שלמעלה (אותו מפתח משמש את הבאנר באפליקציה, חלק 03).
  - באותם ימים: `HooksTeaser` מסתיר הוקים עונתיים, כרטיס "הוק היום" מציג את נוסח יום השקט (§5.5), ו-`VideoWall` מוצג כפוסטרים סטטיים בלבד.

### §2.2 `MarketingHeader`

| אזור | תוכן |
|---|---|
| Start (ימין) | לוגו (`{{BRAND_NAME}}`, קישור לדף הבית, `aria-label="{{BRAND_NAME}}, לדף הבית"`) |
| מרכז (דסקטופ) | איך זה עובד · נישות · ספריית הוקים · דוגמאות · מחירים · בלוג |
| End (שמאל) | כפתור הגדרות תצוגה (אייקון) · "התחברות" (ghost) · "צרו סרטון בחינם" (גלולה זהובה) |

- **יעדי הקישורים:** איך זה עובד → `/#how-it-works` · נישות → `/niches` · ספריית הוקים → `/hooks` · דוגמאות → `/examples` · מחירים → `/pricing` · בלוג → `/blog` · התחברות → `/login` · צרו סרטון בחינם → `/login?next=/app/create` (משתמש מחובר: `/app/create`).
- **תפריט נישות (דסקטופ):** "נישות" פותח `NavigationMenu` עם שתי עמודות: 14 הנישות בעדיפות 1 (אייקון + `name_he`, קישור ל-`/niches/[slug]`) ובתחתית "לכל הנישות ←". ללא hover-only: נפתח גם בלחיצה ובמקלדת (Enter/Space/חץ למטה), נסגר ב-Esc ומחזיר פוקוס.
- **כפתור הגדרות תצוגה:** אייקון `SlidersHorizontal`, `aria-label="הגדרות תצוגה"`, פותח Popover עם `ThemeToggle` ("ערכת נושא: כהה · בהירה · לפי המכשיר") ו-`MotionToggle` ("עצירת אנימציות").
- **מצב מחובר:** אי בצד לקוח בודק אם יש סשן Supabase בדפדפן. אם כן, "התחברות" מתחלף ב-"לאפליקציה ←" (`/app`), והכפתור הזהוב מוביל ל-`/app/create`. עד שהבדיקה מסתיימת מוצג המצב הלא-מחובר (בלי קפיצת layout: לשני הכפתורים רוחב מינימלי קבוע).
- **התנהגות:** sticky, גובה 64px, שקוף בראש העמוד וזכוכית (`rgba(18,18,25,.6)` + `blur(16px)`) אחרי גלילה של 24px. `scroll-padding-top: 80px` על `html` כדי שפוקוס ועוגנים לא יוסתרו.
- **מובייל (<1024px):** לוגו, כפתור "צרו סרטון" קומפקטי ("צרו סרטון"), וכפתור המבורגר (`aria-label="פתיחת התפריט"`, `aria-expanded`). התפריט נפתח כ-Sheet מצד ההתחלה (`side="right"`) במסך מלא, עם כל הקישורים, רשימת הנישות המובילות בתוך `Accordion` ("נישות"), הגדרות התצוגה, "דברו איתנו בוואטסאפ" ו-"התחברות". סגירה: כפתור "סגירת התפריט", Esc, או מעבר עמוד.
- הקישור לעמוד הנוכחי מקבל `aria-current="page"` וקו תחתון בזהב.
- אירועים: הכפתור הזהוב שולח `cta_clicked {location:"header"}` (בתפריט הנייד: `mobile_menu`); לאורח, הכפתור הזהוב ו-"התחברות" שולחים גם `signup_started {source:"header"}`.

### §2.3 `MarketingFooter`

מבנה: שורת ניוזלטר, חמש עמודות קישורים (בדסקטופ; במובייל Accordion לכל עמודה חוץ מעמודת המותג), שורה תחתונה.

**שורת הניוזלטר** (רכיב `NewsletterForm`, ראו §11.5):
- כותרת: "5 הוקים לשבוע, ישר למייל"
- תת-כותרת: "פעם בשבוע: חמישה משפטי פתיחה חדשים לנישות שונות, טיפ אחד לרילס, ובלי ספאם."
- שדה מייל (`LtrInput`, placeholder `name@business.co.il`), תיבת הסכמה לא מסומנת, כפתור "הרשמה".

**עמודת המותג:** לוגו · "סרטוני תדמית ורילס בעברית, לפי נישה." · `WhatsAppButton` ("דברו איתנו בוואטסאפ") · אייקוני רשתות (רק אלה שמוגדרים ב-`BRAND.social`, עם `aria-label` כמו "{{BRAND_NAME}} באינסטגרם").

| המוצר | נישות | ספריית ההוקים | משאבים | משפטי ועזרה |
|---|---|---|---|---|
| איך זה עובד (`/#how-it-works`) | 10 הנישות הראשונות בעדיפות 1 לפי `sort_order`, בתווית "סרטון תדמית ל{short_name_he}" | ספריית ההוקים (`/hooks`) | בלוג (`/blog`) | תנאי שימוש |
| דוגמאות | | הוקים ל-6 נישות מובילות ("הוקים ל{short_name_he}") | המדריך לרילס לעסק קטן | מדיניות פרטיות |
| תבניות | | סוגי הוקים (`/hooks/types`) | כמה עולה סרטון תדמית | מדיניות עוגיות |
| מחירים | | הוקים לעונה הקרובה (דינמי: ה-`h1` מה-frontmatter של העונה, למשל "הוקים לוולנטיין"; §5.8) | שאלות נפוצות | הגדרות עוגיות (כפתור שפותח את `CookiePreferencesDialog`) |
| כמה עולה סרטון (`/pricing#credit-costs`) | | הוקים לרילס לעסקים (`/hooks/platform/reels`) | אודות | הצהרת נגישות |
| צרו סרטון בחינם | לכל הנישות ← | | יצירת קשר | מדיניות ביטול והחזרים |
| | | | | **ביטול מנוי** (`/app/billing/cancel`) |
| | | | | מדיניות שימוש הוגן ב-AI |
| | | | | הסכמה לשימוש בדמות ובקול |

- כותרות העמודות הן `<h2>` ויזואלית קטנה (`micro`), כל עמודה ב-`<nav aria-label="…">` עם אותה כותרת.
- הקישור **"ביטול מנוי"** מופיע בכל עמוד, בולט באותה מידה כמו שאר הקישורים המשפטיים (לא אפור יותר, לא קטן יותר). זה הקישור הייעודי והבולט לביטול שסעיף 14ט לחוק הגנת הצרכן דורש באתר שמוכר עסקאות מרחוק (חלק 06 §10.1). משתמש לא מחובר שלוחץ עליו מגיע ל-`/login?next=/app/billing/cancel` עם הודעה "התחברו כדי לבטל את המנוי. אפשר גם לבטל במייל או בטלפון — הפרטים במדיניות הביטול." (הודעה זו מוצגת בעמוד ההתחברות כשה-`next` הוא עמוד הביטול; ראו חלק 03).

**שורה תחתונה:**
- "© {year} {{LEGAL_ENTITY_NAME}}. כל הזכויות שמורות."
- "{{BRAND_NAME}} הוא שם מסחרי של {{LEGAL_ENTITY_NAME}}, ח״פ {{COMPANY_ID}}."
- "כל המחירים באתר בשקלים וכוללים מע״מ (אלא אם מסומן "לפני מע״מ")."
- `ThemeToggle` קומפקטי בצד הסוף.

### §2.4 `MobileStickyCta`

- מובייל בלבד (<768px). גובה 72px, זכוכית, `position: fixed; inset-block-end: 0`.
- Start: כפתור זהוב ברוחב מלא פחות כפתור הוואטסאפ: **"צרו סרטון בחינם"** (יעד כמו בכותרת). End: כפתור אייקון וואטסאפ עגול 48px, `aria-label="דברו איתנו בוואטסאפ"`.
- מופיע רק אחרי שהגיבור יוצא מהמסך (IntersectionObserver על `#hero`), ונעלם כשהפוטר נכנס למסך. בעמודי `/legal/*` ובעמוד `/contact` הוא לא מוצג בכלל.
- `html { scroll-padding-bottom: 88px }` כשהפס פעיל, כדי שאלמנט בפוקוס לעולם לא יוסתר מתחתיו (WCAG 2.4.11).
- אירועים: `cta_clicked {location: "mobile_sticky"}`; לאורח גם `signup_started {source:"mobile_sticky"}`.

### §2.5 וואטסאפ

- `WhatsAppButton` הוא הדרך היחידה לקשר לוואטסאפ, ותמיד דרך `whatsappHref()` (§1.2), עם `target="_blank"` ו-`rel="noopener"`. נוסח ההודעה המוכנה משתנה לפי הקשר:
  - כללי: "היי, יש לי שאלה על {{BRAND_NAME}}"
  - מעמוד המחירים: "היי, אשמח לעזרה בבחירת תוכנית לעסק שלי" (ניסוח בגוף ראשון בלי צורת מגדר, כדי להימנע מלוכסן)
  - מעמוד נישה: "היי, ראיתי את העמוד על סרטונים ל{short_name_he} ואשמח לשמוע איך זה עובד"
  - מעמוד יצירת הקשר, כשנבחר הנושא "נגישות": "היי, אני פונה בנושא נגישות האתר"
- אין בועת וואטסאפ צפה בדסקטופ. בדסקטופ הקישור מופיע בפוטר, בעמוד יצירת הקשר ובעמוד המחירים.
- אם `BRAND.whatsapp` ריק — כל כפתורי הוואטסאפ לא מוצגים (גם בפס הנייד, שאז מציג רק את כפתור היצירה).

**קריטריוני קבלה**
- [ ] ניווט מלא במקלדת בכותרת, בתפריט הנישות ובתפריט הנייד; Esc סוגר ומחזיר פוקוס לכפתור שפתח.
- [ ] הקישור "ביטול מנוי" קיים בפוטר של כל עמוד שיווקי (בדיקת Playwright על כל התבניות).
- [ ] ביום שמסומן כיום שקט, `QuietDayBanner` מחליף את ההודעה, וקיר הווידאו מציג פוסטרים בלבד (בדיקה עם תאריך מדומה).
- [ ] הפס הנייד לא מסתיר אף אלמנט בפוקוס (בדיקת Playwright: Tab בכל העמוד, `getBoundingClientRect` של האלמנט בפוקוס מעל הפס).
- [ ] אין קישור וואטסאפ שבור כש-`BRAND.whatsapp` ריק.
- [ ] אין לוכסנים מגדריים בשום נוסח (בדיקת CI על `messages/he.json` ועל `content/**`: הביטוי `[א-ת]+/(ת|י|ה|ות|ים)(?![א-ת])` לא מופיע).

---

## §3. דף הבית (`/`) — סקשן אחר סקשן

### §3.0 כללים לכל הדף

- סדר הסקשנים קבוע ומחייב: `AnnouncementBar` → `MarketingHeader` → Hero → `EnginesStrip` → `NicheShowcase` → `HowItWorks` → `EditorMath` → `FeatureBento` → `HooksTeaser` → `ShowcaseGallery` → `Testimonials` → `PricingCards` + `CreditCostTable` → `FaqAccordion` → `FinalCtaBand` → `MarketingFooter` → `MobileStickyCta`.
- כל סקשן הוא `<section aria-labelledby="…">` עם `id` קבוע: `hero`, `engines`, `niches`, `how-it-works`, `editor-math`, `features`, `hooks`, `examples`, `testimonials`, `pricing`, `faq`, `start`. כותרת הסקשן היא `<h2>` דרך `SectionHeading` (eyebrow אופציונלי + H2 + תת-כותרת).
- **LCP = טקסט ה-H1**, לא וידאו ולא תמונה. אין `priority` על תמונות בגיבור; פוסטרים של קיר הווידאו נטענים אחרי הצביעה הראשונה.
- לכל היותר שלושה אפקטים כבדים בדף: קיר הווידאו (מרקיז אנכי), ה-pin של "איך זה עובד" (GSAP ScrollTrigger), ומרקיז ההוקים. כל השאר (BorderBeam, spotlight ב-bento, ספירת מספרים ב-`Num animate`) קלים ונטענים בעצלות (`next/dynamic`, `ssr: false` רק לאפקט, לא לתוכן). `NumberTicker` של Magic UI לא בשימוש (חלק 01).
- תחת `prefers-reduced-motion` או "עצירת אנימציות": אין מרקיז, אין pin, אין Lenis, פוסטרים במקום וידאו, ומעברים של עד 150ms בשקיפות בלבד.
- כל כפתור הנעה לפעולה בדף שולח `cta_clicked {location}` (ערכי `location` ב-§14). קישורים לאפליקציה נושאים `src` רק מהערכים `hero`, `final_cta`, `hooks`, `template`, `niche_page` (חלק 04 §19.3).
- הדף נשאר סטטי גם עם פרמטרים: `?niche=` (§3.5) ו-`?newsletter=confirmed|invalid` (§11.5) נקראים באיים בצד הלקוח, וה-canonical תמיד `https://{{DOMAIN}}/`.

### §3.1 `AnnouncementBar`

לפי §2.1. בדף הבית בלבד מותר וריאנט עונתי שמוגדר באדמין (למשל לקראת בלאק פריידיי: "בלאק פריידיי מתקרב: הוקים מוכנים לעסקים שרוצים להספיק ←" עם קישור ל-`/hooks/season/black-friday`). וריאנט עונתי לעולם לא מוצג ביום שקט.

### §3.2 `MarketingHeader`

לפי §2.2, ללא שינוי.

### §3.3 Hero (`#hero`)

#### §3.3.1 פריסה

| מסך | פריסה |
|---|---|
| דסקטופ (≥1024px) | גריד 12 עמודות. עמודות 1–6 מצד ההתחלה (ימין): eyebrow, H1, תת-כותרת, `HeroPromptCard`, `TrustRow`. עמודות 7–12 (שמאל): `VideoWall` — 3 עמודות אנכיות של אריחי 9:16, עם זוהר "אלומת מקרן" זהוב מאחור ומסכות דהייה למעלה ולמטה. |
| טאבלט (768–1023px) | עמודה אחת: טקסט, כרטיס, שורת אמון, ואז קיר וידאו בשתי עמודות בגובה 520px. |
| מובייל (<768px) | טקסט → `HeroPromptCard` → `TrustRow` → שורת מרקיז אופקית אחת (RTL) של אריחים ברוחב 60%. הכרטיס מופיע לפני הווידאו כדי שהפעולה הראשונה תהיה גלויה בלי גלילה (החלטה מתועדת ב-`DECISIONS.md`). |

#### §3.3.2 טקסט — וריאנטים לניסוי A/B

Eyebrow (צ׳יפ קטן, זהה בכל הווריאנטים): **"AI · עברית מלאה · מותאם לנישה שלכם"**

המילה "תדמית" מקבלת גרדיאנט זהב (המילה היחידה בדף עם גרדיאנט). מבנה: `<h1>` עם `<span class="text-gradient-gold">תדמית</span>`.

| וריאנט | H1 | תת-כותרת |
|---|---|---|
| **A (בקרה)** | סרטון **תדמית** מקצועי לעסק שלכם, בלי עורך וידאו. | בוחרים נישה, מדביקים קישור לאתר או לאינסטגרם, ומקבלים סרטון תדמית ורילס עם הוק שעוצר גלילה, קריינות וכתוביות בעברית. תוך דקות, לא שבועות. |
| **B (נישה)** | רילס וסרטון **תדמית** בעברית, שנכתבו בשביל הנישה שלכם. | מספרה, מרפאת שיניים, משרד תיווך או מסעדה: אנחנו יודעים מה עוצר גלילה אצל הלקוחות שלכם, וכותבים, מקריינים ומוסיפים כתוביות, בעברית טבעית. אתם רק בוחרים ומאשרים. |
| **C (מחיר ושפה)** | סרטון **תדמית** ורילס לעסק, בעברית טבעית ובשקלים. | בלי לבחור מנועים, בלי דולרים ובלי עורך: הוק לנישה שלכם, קריינות וכתוביות בעברית, ותוצאה מוכנה לפרסום בשלושה פורמטים. מתחילים בחינם. |

**מנגנון הניסוי (בלי פגיעה ב-LCP ובלי עוגיות לפני הסכמה):**
- הדף `/` נשאר סטטי. הווריאנטים B ו-C הם עמודים סטטיים נוספים בנתיב `app/(marketing)/exp/hero/[variant]/page.tsx` (`generateStaticParams` מחזיר `b`, `c`), שמרנדרים את אותו דף עם `variant` אחר. הנתיב מוגדר `noindex`, לא מקושר ולא נכנס למפת האתר. (תיקייה שמתחילה בקו תחתון אינה נתיב ב-Next.js, ולכן לא משתמשים ב-`_variants`.)
- גולשים בלי הסכמה לאנליטיקה תמיד מקבלים את A. אחרי הסכמה (§11), הבאנר מגריל וריאנט לפי משקלות מ-PostHog feature flag `hero_copy_v1` (ברירת מחדל 34/33/33) ושומר עוגייה `exp_hero` ל-90 יום.
- `proxy.ts` (חלק 04 §17.2) קורא את `exp_hero` רק בבקשות ל-`/`, ורק כשהעוגייה קיימת עושה rewrite ל-`/exp/hero/{variant}` (ל-`a` אין rewrite). שאר עמודי השיווק לא עוברים דרך ה-proxy. ה-canonical של כל הווריאנטים הוא `https://{{DOMAIN}}/`.
- חשיפה נרשמת כאירוע `$feature_flag_called` של PostHog (רק עם הסכמה). מדד ההצלחה הראשי: `signup_completed` באותו סשן; משני: `cta_clicked {location:"hero"}`.
- כשהניסוי מסתיים, הווריאנט המנצח הופך ל-A, העוגייה נמחקת והנתיבים הפנימיים נשארים לניסוי הבא.

#### §3.3.3 `HeroPromptCard`

כרטיס זכוכית, רדיוס 28px, `--color-surface-1`, זוהר זהב בפוקוס-בתוך (`:focus-within`). שלושה חלקים:

**1. בחירת נישה**
- כותרת השדה (תווית גלויה): **"מה העסק שלכם?"**
- שורת צ׳יפים עם אייקון (`role="radiogroup"`, `aria-label="סוג העסק"`), 8 נישות: מתווכי נדל״ן · מספרות וברברשופים · רופאי שיניים · מסעדות ובתי קפה · מכוני יופי וציפורניים · קבלני שיפוצים · מאמני כושר · קליניקות אסתטיקה (התוויות הן `short_name_he`). הצ׳יף התשיעי: **"עוד נישות…"**.
- "עוד נישות…" פותח את `NichePicker` (cmdk בתוך Popover בדסקטופ, Sheet מלמטה במובייל), עם קבוצות לפי קטגוריה ושדה חיפוש:
  - placeholder: "חפשו סוג עסק, למשל: צלם, מוסך, יוגה"
  - אין תוצאות: "לא מצאנו נישה בשם הזה. בחרו "עסק אחר", ונתאים את הסרטון לפי התיאור שלכם."
  - אפשרות קבועה בסוף הרשימה: "עסק אחר (לא ברשימה)" (`nicheSlug = null`).
- בחירת נישה שולחת `niche_selected {niche, location:"hero"}` (רק slug של נישה; "עסק אחר" לא נשלח).

**2. קישור או תיאור**
- תווית: **"קישור לאתר או לאינסטגרם (לא חובה)"**
- שדה `LtrInput` עם `inputMode="url"` ו-`autoComplete="url"`, placeholder: `yourbusiness.co.il או @yourbusiness` (בתוך `LtrInput` עם `dir="ltr"`, בלי סימני כיווניות)
- נרמול לפני בדיקה: חיתוך רווחים; מחרוזת שמתחילה ב-`@` הופכת ל-`https://instagram.com/{handle}`; כתובת בלי פרוטוקול מקבלת `https://`; חייבת להכיל שם מתחם עם נקודה.
- שגיאה (מתחת לשדה, `aria-describedby`, אייקון ולא רק צבע): **"הקישור לא נראה תקין. נסו כתובת כמו <ltr>yourbusiness.co.il</ltr>, או שם משתמש באינסטגרם כמו <ltr>@yourbusiness</ltr>."**
- קישור החלפה מתחת לשדה: **"אין לי אתר — אתאר במילים"**. אחרי ההחלפה, הקישור הופך ל-**"יש לי אתר או אינסטגרם"**.
- במצב תיאור: `textarea` עם תווית גלויה **"ספרו בכמה מילים מה העסק עושה"**, עד 500 תווים, מונה `{n}/500` (עם `Num`). Placeholder מתחלף כל 3.5 שניות (מוסתר מקוראי מסך עם `aria-hidden` על שכבת האנימציה; תחת הפחתת תנועה נשאר הראשון בלבד):
  1. "מספרה לגברים בפלורנטין, פייד וזקן, פתוחים עד 22:00"
  2. "מרפאת שיניים משפחתית ברחובות, מתמחים בילדים ובשתלים"
  3. "קבלן שיפוצי אמבטיות ומטבחים בחיפה ובקריות"
  4. "בית קפה שכונתי בגבעתיים עם מאפים מהתנור שלנו"
  5. "מתווכת נדל״ן ברמת השרון, דירות של 4–5 חדרים"

**3. הנעה לפעולה**
- כפתור זהוב בגובה 56px, ברוחב מלא במובייל: **"צרו את הסרטון הראשון שלי"**
- מתחתיו (`micro`, `--color-muted`): **"חינם · ללא כרטיס אשראי"**
- בלחיצה:
  1. אם יש קישור והוא לא תקין — מציגים את השגיאה ומעבירים פוקוס לשדה. אחרת ממשיכים (נישה, קישור ותיאור אינם חובה).
  2. שומרים טיוטה ב-`localStorage` במפתח `hero_draft_v1`: `{ nicheSlug: string|null, url: string|null, description: string|null, ts: number }` (try/catch; אם השמירה נכשלת ממשיכים בלעדיה).
  3. משתמש מחובר → `/app/create?niche={slug}&src=hero` (בלי נישה: `/app/create?src=hero`). לא מחובר → `/login?next=` עם אותו יעד מקודד ב-`encodeURIComponent`.
  4. `/app/create` (חלק 03 §6.0) קורא את `hero_draft_v1` רק כש-`src=hero` והטיוטה צעירה מ-24 שעות, מעביר את הקישור לחילוץ המותג בשלב `business` (או את התיאור כטקסט חופשי), ומוחק את הטיוטה.
- אירועים: `cta_clicked {location:"hero"}`; לאורח גם `signup_started {source:"hero"}`.

#### §3.3.4 `TrustRow`

ארבעה פריטים, אייקון 16px + טקסט `micro`, מופרדים ב-`·` (רשימה `<ul>` לנגישות):

| אייקון (lucide) | טקסט |
|---|---|
| `Gift` | {trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי |
| `Banknote` | מחירים בשקלים, כולל מע״מ |
| `ReceiptText` | חשבונית מס על כל תשלום |
| `RotateCcw` | החזר קרדיטים אוטומטי על יצירה שנכשלה |

לפריט הראשון יש הערת שוליים נגישה (`Tooltip` שנפתח גם בפוקוס, והטקסט שלו נמצא גם ב-DOM לקוראי מסך): "{trialCredits} קרדיטי ניסיון מספיקים {freeVideos, plural, one {בערך לסרטון קצר אחד} two {בערך לשני סרטונים קצרים} other {בערך ל-# סרטונים קצרים}} באיכות טיוטה, עם סימן מים. סרטון של עד 30 שניות מתמונות בתנועה, עם קליפ AI קצר אחד, עולה כ-{freeVideoCredits} קרדיטים." (`{freeVideoCredits}` = `estimateSample(FREE_VIDEO_SAMPLE, creditCosts)` בזמן הבנייה, כש-`FREE_VIDEO_SAMPLE = { durationSec: 30, quality: "draft", visualMix: "smart", images: 6, clipSeconds: 5, formats: 1 }` מוגדר ב-`lib/marketing/savings.ts`; עם ה-seed התוצאה 30, כמו בנספח F §10.4. `{trialCredits}` = מענק הניסיון מה-seed, 70.) `freeVideos = floor(trialCredits / freeVideoCredits)` (2 עם ה-seed) מחושב בזמן הבנייה, וכל מקום באתר שמזכיר מספר סרטונים לניסיון משתמש בו, תמיד יחד עם "באיכות טיוטה, עם סימן מים" (בדיקת יחידה). הטענה הקצרה בשורת האמון, במטא ובכפתורים היא תמיד בקרדיטים, לא בסרטונים.

#### §3.3.5 `VideoWall`

- **דסקטופ:** 3 עמודות, בכל אחת 6 אריחים (`VideoTile`, 9:16, רדיוס 14px, מסגרת פנימית 1px). עמודה 1 נעה למעלה, 2 למטה, 3 למעלה; מחזור של 45 שניות; מסכות דהייה של 15% למעלה ולמטה. רק אריחים שנראים על המסך מתנגנים (IntersectionObserver), כולם מושתקים, ומושהים ב-`visibilitychange`.
- **מובייל:** שורה אופקית אחת של 8 אריחים, מרקיז RTL (פריטים נכנסים מצד הסוף).
- כל אריח: צ׳יפ נישה בפינה העליונה מצד ההתחלה (למשל "רופאי שיניים"), כתוביות עבריות צרובות בסרטון, ו-`<track kind="captions" srclang="he" label="עברית">` עם קובץ VTT.
- **שליטה:** כפתור בפינה התחתונה מצד הסוף של הקיר, עם אייקון ותווית גלויה: **"עצירת הווידאו"** / **"הפעלת הווידאו"** (`aria-pressed`). הכפתור עוצר גם את התנועה וגם את הניגון. המצב מתואם עם "עצירת אנימציות" הגלובלי.
- **נגישות:** הקיר דקורטיבי. העטיפה מקבלת `aria-hidden="true"` (חוץ מכפתור השליטה, שנמצא מחוץ לעטיפה), ולצדה טקסט מוסתר ויזואלית: "הדגמות קצרות של פתיחות לרילס בנישות שונות: מספרה, מרפאת שיניים, נדל״ן, מסעדה ועוד. סרטונים מלאים, עם נגן וכתוביות, נמצאים בעמוד הדוגמאות." עם קישור ל-`/examples`.
- **מפרט מדיה:** פוסטר AVIF של עד 40KB לאריח (מ-`PosterStill`), קליפ 540×960 H.264 בלי סאונד של עד 1.2MB, לולאה של 4–6 שניות, וגרסת WebM/AV1 כחלופה. אנימטיקים נשמרים ב-bucket `public-media` תחת `demo/wall/{n}-{hook_id}.{mp4|avif|vtt}`, ותוצרים אמיתיים תחת `examples/` (חלק 04 §13.1).
- **תג:** כל אריח שהמקור שלו אנימטיק מקבל בפינה התחתונה מצד ההתחלה את התג **"הדגמה"** (כמו בחלק 01).

#### §3.3.6 תוכנית התוכן של קיר הווידאו (`content/demo-wall.json`)

מקור כל אריח: דוגמה אמיתית מטבלת `examples` (`is_published` ו-`is_featured`) כשקיימת לאותה נישה, באותו מקום בקיר; אחרת אנימטיק של ההוק בלבד, שמרונדר על ידי `scripts/render-demo-videos.ts` (`pnpm demo:render --upload`; קומפוזיציה `Animatic`: לולאה של 4–6 שניות, 540×960, בלי סאונד, גרפיקה בצבעי מותג לדוגמה וכתוביות עבריות אמיתיות, ועוד פוסטר AVIF וקובץ VTT). חמשת סרטוני הדוגמה של נספח D לא משמשים בקיר; הם מוצגים ב-`ShowcaseGallery`, ב-`NicheShowcase` ובבאנר החנוכה (`public-media/demo/examples/`). אנימטיק לא מוצג לעולם כאילו הוא צילום של עסק אמיתי: בקיר הוא מסומן "הדגמה", ובעמוד הדוגמאות "הדגמה (אנימטיק)". ההוקים בקיר נבחרו מתוך הספרייה, ואף אחד מהם לא מציג מספר או דירוג כנתון של עסק מסוים.

| # | עמודה | נישה | מזהה הוק | טקסט על המסך | פריסט כתוביות |
|---|---|---|---|---|---|
| 1 | 1 | `barbers-salons` | `barbers-salons-01` | ביקש "רק לסדר קצת". זה מה שיצא | `poster` |
| 2 | 1 | `dentists` | `dentists-03` | מצחצחים מיד אחרי הקפה? יש לנו בעיה | `clean-box` |
| 3 | 1 | `real-estate` | `real-estate-07` | זה מה שקונים רואים ב-5 השניות הראשונות בדירה שלכם | `bold-pop` |
| 4 | 1 | `restaurants` | `restaurants-01` | אל תבואו אלינו רעבים. ברצינות. | `karaoke` |
| 5 | 1 | `fitness-trainers` | `fitness-trainers-05` | פלאנק 30 שניות. כתבו בתגובות כמה החזקתם | `bold-pop` |
| 6 | 1 | `beauty-nails` | `beauty-nails-03` | הלקוחה הביאה תמונה מפינטרסט. הצלחנו? | `soft` |
| 7 | 2 | `renovation-contractors` | `renovation-contractors-06` | POV: הקבלן אמר "שבועיים". זה היה לפני 4 חודשים | `bold-pop` |
| 8 | 2 | `mortgage-advisors` | `mortgage-advisors-04` | קיבלתם אישור עקרוני? מזל טוב. עכשיו מתחיל המשא ומתן | `news` |
| 9 | 2 | `aesthetic-clinics` | `aesthetic-clinics-04` | מיתוס: טיפולי פנים זה רק לנשים | `soft` |
| 10 | 2 | `zimmers-boutique-hotels` | `zimmers-boutique-hotels-02` | POV: כיביתם את הטלפון לסופ״ש שלם | `soft` |
| 11 | 2 | `car-dealers` | `car-dealers-02` | 3 דברים לבדוק ברכב יד שנייה עוד לפני נסיעת המבחן | `clean-box` |
| 12 | 2 | `djs-musicians` | `djs-musicians-01` | הרגע שבו כל האולם קם לרקוד | `poster` |
| 13 | 3 | `accountants` | `accountants-04` | תפסיקו לשמור קבלות בקופסת נעליים | `news` |
| 14 | 3 | `yoga-pilates` | `yoga-pilates-03` | POV: השיעור הראשון שלכם על רפורמר | `soft` |
| 15 | 3 | `ecommerce` | `ecommerce-02` | אל תקנו את זה אם אתם לא אוהבים מחמאות | `bold-pop` |
| 16 | 3 | `interior-design` | `interior-design-02` | 3 טעויות תאורה שהורסות כל דירה חדשה | `clean-box` |
| 17 | 3 | `vets-dog-grooming` | `vets-dog-grooming-01` | הכלב שלכם עושה את זה? זה לא "סתם חמוד" | `karaoke` |
| 18 | 3 | `lawyers` | `lawyers-03` | מיתוס: צוואה זה רק לאנשים עשירים | `news` |

במובייל משתמשים באריחים 1, 2, 3, 4, 7, 8, 13, 14.

```jsonc
// content/demo-wall.json (מבנה)
{ "tiles": [ { "n": 1, "column": 1, "nicheSlug": "barbers-salons", "hookId": "barbers-salons-01",
               "captionPreset": "poster", "source": "animatic", "exampleSlug": null, "mobile": true } ] }
// מדיה של אנימטיק: public-media/demo/wall/{n}-{hookId}.mp4 · .avif · .vtt (paths.pub.demoWall, חלק 04 §13.4)
```

### §3.4 `EnginesStrip` (`#engines`)

- שורת טקסט מרכזית (`small`, `--color-text-2`): **"מאחורי הקלעים עובדים מנועי AI כמו Veo, Kling ו-Claude, ואנחנו מתאימים מנוע לכל סצנה."** שלושת השמות הם ברירת המחדל: בפועל הם מוזרקים כ-`{engine1}`, `{engine2}`, `{engine3}` מתוך `getEngineWordmarks()` (למטה), כך שהמשפט מזכיר רק מנועים שיש להם נתיב פעיל.
- מתחתיה מרקיז RTL של סימני מילים (wordmarks) **בטקסט בלבד** — Heebo 600, מונוכרום, שקיפות 60%, 100% ב-hover. בלי לוגואים גרפיים של צד שלישי, אלא אם נבדקו הנחיות המותג שלהם והאישור תועד ב-`DECISIONS.md`.
- הרשימה **נגזרת מהנתונים** ולא נכתבת ידנית: הפונקציה `getEngineWordmarks()` עוברת על `model_routes` (primary + fallbacks), משאירה רק דגמים עם `is_enabled = true`, וממפה משפחה לשם תצוגה:

| דפוס slug | שם תצוגה |
|---|---|
| `google/veo-*` | Google Veo |
| `kwaivgi/kling-*` | Kling |
| `bytedance/seedance-*` | Seedance |
| `alibaba/wan-*` | Wan |
| `google/gemini-*-image*` | Nano Banana |
| `elevenlabs/*` | ElevenLabs |
| `anthropic/*` | Claude |
| `google/gemini-*` (טקסט ודיבור) | Gemini |
| `google/lyria-*` | Lyria |
| `openai/*` | OpenAI |

- אם יש 6 שמות או פחות — שורה סטטית בלי מרקיז.
- שורת הסתייגות מתחת (`micro`): **"השמות הם סימנים מסחריים של בעליהם, ומוזכרים רק כדי לתאר את הטכנולוגיה שבה אנחנו משתמשים. אין בכך חסות, שותפות או המלצה מצדם."**
- שורת לוגואים של לקוחות ("עסקים שכבר יוצרים איתנו") **לא קיימת בהשקה**. היא תתווסף רק עם לוגואים של לקוחות אמיתיים שנתנו אישור בכתב.

### §3.5 `NicheShowcase` (`#niches`)

- Eyebrow: "לפי נישה"
- H2: **"כל נישה מקבלת סרטון שנבנה בשבילה"**
- תת-כותרת: **"בחרו סוג עסק ותראו אילו הוקים, איזה תסריט ואיזה סרטון מקבלים. אותו סרטון, בשלושה פורמטים."**
- **פס צ׳יפים** (`role="tablist"`, `aria-label="בחירת נישה"`, גלילה אופקית RTL, חיצי גלילה ב-`DirIcon`): 14 הנישות בעדיפות 1, לפי `sort_order`, עם `NicheIcon` ו-`short_name_he`. ברירת מחדל: הערך מ-`?niche=` אם הוא אחת מהן, אחרת `real-estate`.
- **תוכן הנישה הנבחרת** (`role="tabpanel"`), מעבר `AnimatePresence` של 250ms בשקיפות:
  - Start: שורה אחת מתוך `description_he` של הנישה, ואז 3 כרטיסי `HookCard` בווריאנט `compact` — קודם הוקים מומלצים (`is_featured`), אחר כך לפי פופולריות. בכל כרטיס: העתקה, "צרו סרטון מההוק".
  - End: `PhoneFrame` 9:16 עם סרטון הדוגמה של הנישה (דוגמה מומלצת → `niches.example_video_path` → סרטון הדוגמה מנספח D, למסעדות, לקבלני שיפוצים, ליועצי משכנתאות, לרופאי שיניים ולמכוני ציפורניים, מ-`public-media/demo/examples/` עם התג "הדגמה" → אנימטיק של אריח הקיר של הנישה), ומתחתיו שתי מסגרות קטנות 1:1 ו-16:9 של אותו סרטון, עם הכיתוב **"אותו סרטון, 3 פורמטים"**.
  - שני קישורים: **"לכל ההוקים ל{short_name_he} ←"** (`/hooks/[niche]`) ו-**"סרטון תדמית ל{short_name_he}"** (`/niches/[niche]`). "צרו סרטון מההוק" מוביל ל-`/app/create?niche={slug}&hook={id}&src=hooks` (לאורח — דרך `SignupGateDialog`, §5.4).
- הנתונים של כל 14 הנישות (3 הוקים לכל אחת, ~42 הוקים) מוטמעים ב-HTML הסטטי כ-JSON, כך שהמעבר מיידי. הווידאו נטען רק לנישה הנבחרת.
- הקריאה של `?niche=` נעשית בצד הלקוח (`useSearchParams` בתוך `Suspense`) כדי שהדף יישאר סטטי; החלפת נישה מעדכנת את ה-URL ב-`history.replaceState` בלי גלילה.
- אירועים: `niche_selected {niche, location:"niche_showcase"}`, `hook_copied {hook_id, niche, location:"niche_showcase"}`.

### §3.6 `HowItWorks` (`#how-it-works`)

- Eyebrow: "איך זה עובד"
- H2: **"מעסק לסרטון ב-3 צעדים"**
- דסקטופ: `PhoneFrame` מוצמד (GSAP ScrollTrigger pin) בצד הסוף; שלושת הצעדים נגללים בצד ההתחלה, וכל צעד מחליף את המסך שבטלפון (crossfade של 320ms). מובייל והפחתת תנועה: שלושה כרטיסים זה מתחת לזה, כל אחד עם צילום מסך סטטי.

| # | כותרת הצעד | טקסט | מה רואים בטלפון |
|---|---|---|---|
| 1 | ספרו לנו על העסק | מדביקים קישור לאתר או לאינסטגרם, או מתארים את העסק בכמה מילים. אנחנו שולפים את השם, השירותים, הצבעים והלוגו, ואתם מאשרים או מתקנים. | כתובת URL שהופכת לכרטיס מותג: לוגו, צבעים, שירותים |
| 2 | בחרו הוק וסגנון | מקבלים הוקים שנכתבו לנישה שלכם ובוחרים את המשפט שיפתח את הסרטון. אחר כך קול, סגנון כתוביות ומוזיקה. התסריט נכתב מול העיניים, וכל מילה בו ניתנת לעריכה. | בוחר הוקים, אריחי סגנון, כרטיס קול עם כפתור השמעה |
| 3 | קבלו סרטון מוכן | כותבים תסריט וצופים בתצוגה מקדימה ({previewCredits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}), ורק אחרי שמאשרים את העלות נוצר הסרטון המלא: קריינות וכתוביות בעברית ב-9:16, ב-1:1 וב-16:9, וגם קובץ כתוביות. | הסרטון המוגמר מתנגן עם כתוביות, כפתורי הורדה לשלושת הפורמטים |

- מתחת לצעדים: כפתור משני **"נסו את זה עם העסק שלכם"** שגולל ל-`#hero` ומעביר פוקוס לשדה הנישה (`cta_clicked {location:"how_it_works"}`).
- `previewCredits` = `credit_costs['script.generate'] + credit_costs['storyboard.generate']` (3 עם ה-seed, ולכן "(3 קרדיטים)"), מוזרק בזמן הבנייה מ-`getPricing()`. אסור לתאר את התצוגה המקדימה כחינמית.
- JSON-LD מסוג `HowTo` לסקשן הזה (§12.4).

### §3.7 `EditorMath` (`#editor-math`)

- Eyebrow: "החשבון"
- H2: **"החשבון של עורך הווידאו"**
- תת-כותרת: **"עורך וידאו גובה מאות שקלים על כל רילס, ועוד מחכים לגרסה הראשונה. כאן הגרסה הראשונה מוכנה תוך דקות, ומשלמים בקרדיטים."** אחרי "על כל רילס" מופיע סימון הערת שוליים ¹ שמקושר להערה 1 שמתחת למחשבון.

#### §3.7.1 `BeforeAfterSlider`

- "לפני" בצד ההתחלה (ימין): קולאז׳ של חומרי גלם מהטלפון (תמונות לא ערוכות של עסק לדוגמה, צילום אנכי עקום, תמונת מסך של הודעת וואטסאפ עם רשימת שירותים). תווית: **"לפני: חומרים מהטלפון"**
- "אחרי" בצד הסוף (שמאל): פוסטר וסרטון קצר (מושתק, עם כתוביות) של אותו עסק כרילס מוכן. תווית: **"אחרי: רילס עם הוק, קריינות וכתוביות"**
- ידית: `role="slider"`, `aria-label="השוואה בין לפני לאחרי"`, `aria-valuetext="רואים {x}% מהסרטון המוכן"`. מקשי החצים מזיזים את הידית בכיוון החץ שנלחץ (ויזואלית), Home = הכול "לפני", End = הכול "אחרי". הקובץ של חלק 01 מגדיר את המנגנון; כאן רק התוכן.
- החומרים לסליידר מגיעים מאחת הדוגמאות האמיתיות כשיש; עד אז מאנימטיק של אריח 7 (קבלן שיפוצים) עם תמונות "לפני" שצולמו לצורך ההדגמה ומסומנות **"הדגמה"**.

#### §3.7.2 `SavingsCalculator`

**קלטים**

| שדה | תווית | טווח | ברירת מחדל | `aria-valuetext` |
|---|---|---|---|---|
| `videos` | כמה סרטונים אתם צריכים בחודש? | 1–30, צעד 1 | 8 | "{n, plural, one {סרטון אחד בחודש} two {שני סרטונים בחודש} other {# סרטונים בחודש}}" |
| `pricePerVideo` | כמה אתם משלמים היום על סרטון אחד? | ₪100–₪3,000, צעד ₪50 (סליידר + שדה מספר) | ₪550 | "{n, plural, one {שקל אחד לסרטון} two {שני שקלים לסרטון} other {# שקלים לסרטון}}" |
| `quality` | באיזו איכות? (בקר מקטעים) | "טיוטה · רילס 30 שנ׳" / "סטנדרט · רילס 30 שנ׳" | טיוטה | — |

**חישוב** (`lib/marketing/savings.ts`, טהור ונבדק ביחידה; משתמש באותה פונקציית הערכה כמו כפתורי היצירה כדי שהמספרים יהיו עקביים):

```ts
// lib/marketing/savings.ts
// SAMPLE_PRESETS מוגדר רק בחלק 05 (images15 · draft30 · standard30 · premium60 → 23 / 50 / 107 / 478); אסור להגדיר עותק מקומי.
import { SAMPLE_PRESETS, estimateSample, type SamplePreset } from "@/lib/pipeline/estimate"; // אותה פונקציה של CostBadge

export const FREE_VIDEO_SAMPLE: SamplePreset =
  { durationSec: 30, quality: "draft", visualMix: "smart", images: 6, clipSeconds: 5, formats: 1 }; // 30 עם ה-seed (§3.3.4)

export function computeSavings(i: {
  videos: number; pricePerVideoIls: number; preset: "draft30" | "standard30";
  plans: PlanDTO[]; packs: PackDTO[]; creditCosts: CreditCostMap;
}) {
  const creditsPerVideo = estimateSample(SAMPLE_PRESETS[i.preset], i.creditCosts); // 50 | 107
  const creditsNeeded = i.videos * creditsPerVideo;
  const todayIls = i.videos * i.pricePerVideoIls;
  // לכל תוכנית בתשלום: מחיר חודשי (כולל מע״מ) + צירוף החבילות הזול ביותר שמכסה את החוסר.
  // packs לא פגות, ולכן מותר לצרף אותן. min-cost בעזרת DP קטן על מספרי חבילות (עד 20 מכל סוג).
  const options = i.plans.filter(p => p.id !== "free").map(p => {
    const shortfall = Math.max(0, creditsNeeded - p.monthlyCredits);
    const packCombo = cheapestPackCombo(shortfall, i.packs); // { totalIls, items: [{packId, qty}] }
    return { planId: p.id, totalIls: p.priceMonthlyIls + packCombo.totalIls, packs: packCombo.items };
  });
  const best = options.reduce((a, b) => (b.totalIls < a.totalIls ? b : a));
  const savingMonthlyIls = todayIls - best.totalIls;
  return { creditsPerVideo, creditsNeeded, todayIls, ours: best, savingMonthlyIls, savingYearlyIls: savingMonthlyIls * 12 };
}
```

דוגמאות לבדיקת יחידה (עם המחירים מה-seed): 8 סרטונים × ₪550, טיוטה → 400 קרדיטים → תוכנית בסיס (₪119) → חיסכון ₪4,281 בחודש. 30 סרטונים × ₪550, טיוטה → 1,500 קרדיטים → תוכנית עסק (₪289) + חבילת 500 (₪179) = ₪468 → חיסכון ₪16,032 בחודש. 10 סרטונים × ₪550, סטנדרט → 1,070 קרדיטים → תוכנית עסק (₪289) + חבילת 150 (₪59) = ₪348 → חיסכון ₪5,152 בחודש.

**פלטים** (מתעדכנים מיד, אזור `aria-live="polite"` שמכריז רק אחרי 600ms בלי שינוי):
- **"היום: ₪{today} בחודש"**
- **"עם {{BRAND_NAME}}: ₪{ours} בחודש"** ומתחת, בקטן: "תוכנית {planName}" ואם צריך "+ {qty} × חבילת {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}"
- מספר גדול (`Num animate`, `tabular-nums`, הסכום דרך `formatIls`): **"חיסכון משוער: ₪{saving} בחודש"**, ומתחתיו **"כ-₪{savingYearly} בשנה"**. ליד המילה "משוער" סימון הערת שוליים ⁴ שמקושר להערה 4.
- אם החיסכון 0 או שלילי: במקום המספר הגדול — **"במקרה הזה עורך הווידאו שלכם זול יותר מאיתנו. בכל זאת, אפשר להשוות בעצמכם עם {trialCredits} קרדיטי ניסיון."**
- כפתור: **"התחילו עם {trialCredits} קרדיטים לניסיון"** (`cta_clicked {location:"editor_math"}`).
- שימוש במחשבון שולח `savings_calculated {videos, price_bucket, quality}` פעם אחת לסשן, אחרי 2 שניות בלי שינוי (`price_bucket`: `lt300` / `300_700` / `700_1500` / `gt1500`).

**הערות שוליים** (`<ol>` מתחת למחשבון, מקושרות מהפלט ב-`aria-describedby`; המספרים בטקסט מוזרקים מהנתונים):
1. "ברירת המחדל של ₪550 לסרטון היא מחיר עריכה מקצועית של רילס אחד, לפי מחירון שפורסם באתר natigold.com (נבדק באוקטובר 2026). המחיר שאתם משלמים יכול להיות שונה, ולכן אפשר לשנות אותו."
2. "סרטון תדמית לעסק קטן או בינוני בהפקה מסורתית עולה בדרך כלל ₪15,000–₪35,000, לפי סקירת מחירים לשנת 2026 שפורסמה באתר extra.co.il."
3. "החישוב מניח רילס של 30 שניות: כ-{draftCredits} קרדיטים באיכות טיוטה, או כ-{standardCredits} באיכות סטנדרט, לפי טבלת העלויות בעמוד המחירים. סרטונים ארוכים יותר, איכות פרימיום ופורמטים נוספים צורכים יותר קרדיטים."
4. "המחיר אצלנו מחושב לפי התוכנית החודשית הזולה ביותר שמכסה את הקרדיטים הדרושים, כולל חבילות קרדיטים חד-פעמיות אם צריך, במחירים שכוללים מע״מ. זו הערכה ולא הצעת מחיר."
5. "החישוב לא כולל את הזמן שלכם: לבחור הוק, לאשר תסריט ולהעלות תמונות עדיין לוקח כמה דקות."

לפני ההשקה בעל המוצר מאמת מחדש את מקורות הערות 1–2 ומעדכן את תאריך הבדיקה (משימה ברשימת M7, ראו חלק 06).

### §3.8 `FeatureBento` (`#features`)

- Eyebrow: "מה בפנים"
- H2: **"מה שעורך הווידאו עשה, עכשיו בכמה לחיצות"**
- 8 אריחים בגריד לא אחיד (סדר מהימין). אריח 1 בגודל 2×2 עם `BorderBeam`; spotlight של הסמן רק בדסקטופ ורק בלי הפחתת תנועה. לכל אריח מיקרו-הדגמה בלולאה (וידאו קצר או קומפוזיציית Remotion ב-`@remotion/player` שנטענת בעצלות); תחת הפחתת תנועה — תמונה סטטית.

| # | גודל | כותרת | טקסט | מיקרו-הדגמה |
|---|---|---|---|---|
| 1 | 2×2 | כתוביות בעברית שנראות נכון | כתוביות מימין לשמאל, עם הדגשה של המילה שנאמרת, מספרים ושמות באנגלית במקום הנכון, ושישה סגנונות לבחירה: פופ, קופסה נקייה, קריוקי, פוסטר, חדשות ורך. | `CaptionStyleSample` שמתחלף בין שישת הפריסטים, עם המשפט "מבצע Black Friday עד 50% על כל הטיפולים" |
| 2 | 1×1 | קריינות בעברית | קולות עבריים שנבחרו אחרי האזנה של דוברי עברית, ומילון הגייה לשמות של העסק, של רחובות ושל מוצרים. | 2 כרטיסי קול עם גל קול וכפתור השמעה (רק קולות פעילים עם `sample_path`; אם אין — איור גל קול בלי כפתור) |
| 3 | 1×1 | ערכת מותג | לוגו, צבעים, גופנים וכרטיס סיום שמופיעים בכל סרטון, בלי להגדיר מחדש בכל פעם. | אותו כרטיס סיום שמתחלף בין שלוש ערכות צבע |
| 4 | 1×2 | הוקים לפי נישה | משפטי פתיחה שנכתבו בעברית לנישה שלכם, עם הסבר למה כל אחד עובד ומה רואים בשלוש השניות הראשונות. | ערימת כרטיסי הוק שמתחלפים |
| 5 | 1×1 | 3 פורמטים בלחיצה | אותו סרטון ב-9:16 לרילס, לטיקטוק ולסטטוס, ב-1:1 לפיד וב-16:9 לאתר וליוטיוב, וגם קובץ כתוביות. | מסגרת שעוברת בין שלושת היחסים (Motion layout) |
| 6 | 1×1 | עריכה בסצנות | לא אהבתם סצנה? מחליפים טקסט, משנים סדר או יוצרים מחדש רק אותה, ומשלמים רק על הסצנה החדשה ועל ההרכבה מחדש. | כרטיסי סצנה שמחליפים מקום |
| 7 | 1×1 | קרדיטים שקופים | כל כפתור יצירה מראה כמה הוא עולה לפני הלחיצה. יצירה שנכשלה? הקרדיטים חוזרים אליכם אוטומטית. | `CostBadge` "צרו את הסרטון · 107 קרדיטים" ואחריו טוסט "הקרדיטים חזרו אליכם" |
| 8 | 2×1 | תווית AI ועמידה בכללים | תווית "נוצר באמצעות AI" בלחיצה, תזכורות לכללי הפרסום בנישה שלכם, ובלי המלצות מומצאות או מספרים שלא אישרתם. | תג "נוצר באמצעות AI" בפינת פריים + תג "שימו לב: כללי פרסום לנישה" |

### §3.9 `HooksTeaser` (`#hooks`)

- Eyebrow: "ספריית ההוקים"
- H2: **"ספריית ההוקים בעברית, לפי נישה"**
- תת-כותרת: **"{count, plural, one {משפט פתיחה אחד שנכתב} two {שני משפטי פתיחה שנכתבו} other {# משפטי פתיחה שנכתבו}} בעברית לעסקים ישראליים, לפי נישה, סוג הוק ועונה. מעתיקים בחינם, ואם רוצים — הופכים לסרטון."** (`{count}` = מספר ההוקים המפורסמים. מעל 100 משתמשים במפתח המקביל `subtitleOver`, עם הספירה מעוגלת כלפי מטה לעשרות: "{count, plural, other {יותר מ-# משפטי פתיחה שנכתבו}} בעברית…".)
- שתי שורות מרקיז RTL בכיוונים מנוגדים של `HookCard` בווריאנט `compact` (24 הוקים: מומלצים מנישות שונות + 2–4 הוקים של העונה הקרובה אם היא בחלון הפרסום ואין יום שקט). המרקיז נעצר ב-hover, בפוקוס בתוך השורה, ובעצירת אנימציות. בכל כרטיס: טקסט ההוק, צ׳יפ נישה, צ׳יפ סוג, כפתור העתקה.
- שדה חיפוש (טופס `GET` ל-`/hooks`, פרמטר `q`):
  - תווית: **"חפשו הוק לפי נישה או נושא"**
  - placeholder: "למשל: משכנתא, פילאטיס, בלאק פריידיי"
  - כפתור: **"חיפוש"**
- צ׳יפים מהירים מתחת לשדה: מתווכי נדל״ן · מספרות וברברשופים · רופאי שיניים · מסעדות ובתי קפה · (העונה הקרובה, למשל "בלאק פריידיי") — קישורים ל-`/hooks/[niche]` או ל-`/hooks/season/[season]`.
- כפתור: **"לספרייה המלאה (חינם) ←"** (`cta_clicked {location:"hooks_teaser"}`)
- אירועים: `hook_copied {hook_id, niche, location:"landing_teaser"}` (`niche` = slug או `"universal"`), `hooks_searched {q_length, location:"landing_teaser"}` (בלי `results`, כי החיפוש עצמו רץ בעמוד `/hooks`).

### §3.10 `ShowcaseGallery` (`#examples`)

- **מקור:** קודם דוגמאות אמיתיות (`examples.is_published = true`). כשיש פחות מ-6, משלימים מחמשת סרטוני ההדגמה של נספח D (`public-media/demo/examples/{id}-{9x16|1x1|16x9}.mp4`, פוסטר ו-VTT), כל אחד עם התג **"הדגמה"** ו-`alt` **"סרטון הדגמה: {title_he}"**. דוגמה אמיתית מאותה נישה מחליפה את פריט ההדגמה באותו מקום.
- Eyebrow: "דוגמאות"
- H2: **"סרטונים שנוצרו ב{{BRAND_NAME}}"**
- תת-כותרת (כשכל הפריטים אמיתיים): **"כל סרטון כאן יצא מהמערכת: תסריט, ויז׳ואלים, קריינות וכתוביות. בחרו נישה או פורמט."**
- תת-כותרת (כשיש לפחות פריט הדגמה אחד): **"התסריטים כאן נכתבו במערכת לעסקים לדוגמה, ומוצגים כהדגמה עד שנפרסם כאן סרטונים של לקוחות. בחרו נישה או פורמט."**
- פילטרים (צ׳יפים): "כל הנישות" + עד 6 נישות שיש להן דוגמאות · "כל הפורמטים", "אנכי", "ריבוע", "רוחבי".
- גריד מסונרי של עד 12 אריחים. באריח: פוסטר, צ׳יפ נישה, משך (`0:30` בתוך `Num`), יחס. דסקטופ: ניגון מושתק ב-hover ובפוקוס. מובייל: הקשה פותחת Sheet מלמטה עם `VideoPlayer` (כתוביות פעילות), כותרת הדוגמה, ושני כפתורים: **"צרו סרטון כזה"** (`/app/create?template={template_id}&src=template` אם יש תבנית, אחרת `/app/create?niche={niche_slug}&hook={hook_id}&src=hooks`) ו-**"לכל הדוגמאות"**.
- כפתור בסוף: **"לכל הדוגמאות ←"** (`cta_clicked {location:"landing_gallery"}`)
- אירוע: `example_played {example_id, location:"landing_gallery"}` (`example_id` = `examples.id`, או מזהה נספח D כמו `dentists-brand-60` לפריט הדגמה).

### §3.11 `Testimonials` (`#testimonials`) ו-`CountersRow`

**מדיניות — בלי המלצות מזויפות, בלי מספרים מומצאים:**
- המלצות נטענות מ-`content/testimonials.he.json`. כל רשומה חייבת `consentRef` (הפניה לאישור בכתב של הממליץ, שנשמר מחוץ לריפו) ו-`approvedAt`. הסקשן מוצג **רק אם יש לפחות 3 המלצות מאושרות**; עד אז הוא לא מרונדר בכלל.
- אין שימוש בתמונות מאגר, בשמות בדויים או בציטוטים "מעובדים". מותר לקצר ציטוט רק באישור הממליץ.
- תוצאה כספית ("חסכנו ₪2,400 בחודש על עריכה") מותרת רק אם הממליץ אישר את המספר בכתב.

```jsonc
// content/testimonials.he.json — מבנה. בסביבת פיתוח בלבד נטען content/testimonials.example.json
[
  {
    "id": "t-001",
    "isPlaceholder": false,
    "name": "שם פרטי ושם משפחה כפי שאושר",
    "business": "שם העסק",
    "nicheSlug": "barbers-salons",
    "city": "עיר",
    "quoteHe": "הציטוט המדויק שאושר",
    "outcomeHe": null,
    "photoPath": null,
    "consentRef": "consent/2026-11-02-t-001.pdf",
    "approvedAt": "2026-11-02"
  }
]
```

- `content/testimonials.example.json` מכיל שלוש רשומות עם `"isPlaceholder": true` שהטקסט שלהן הוא **"[דוגמת מבנה — לא לפרסום]"** בכל שדה. בדיקת CI (`scripts/check-content.ts`) נכשלת אם קובץ הייצור מכיל רשומה עם `isPlaceholder: true`, טקסט בסוגריים מרובעים, או רשומה בלי `consentRef`.
- כשהסקשן מוצג: Eyebrow "מהשטח", H2 **"בעלי עסקים מספרים"**, קרוסלת Embla (`direction: 'rtl'`, כפתורי "הקודם"/"הבא" עם `DirIcon`, בלי ניגון אוטומטי). בכרטיס: ציטוט, שם, עסק, עיר, צ׳יפ נישה, ואם יש — שורת התוצאה ותמונה.

**`CountersRow`** (מוצג מתחת להמלצות, או במקומן אם אין המלצות, רק כשיש לפחות 2 מונים שעוברים סף):

| מונה | מקור (`getMarketingCounters`, מתעדכן כל שעה) | סף להצגה | תצוגה |
|---|---|---|---|
| סרטונים שנוצרו | `render_runs` עם `status='succeeded'` | 500 | "{n, plural, other {יותר מ-# סרטונים נוצרו}}" (עיגול כלפי מטה למאות) |
| עסקים שיצרו סרטון | workspaces עם רינדור מוצלח אחד לפחות | 100 | "{n, plural, other {יותר מ-# עסקים}}" |
| נישות | נישות פעילות | תמיד | "{n, plural, one {נישה אחת} two {שתי נישות} other {# נישות}}" |
| הוקים בעברית | הוקים מפורסמים | תמיד | "{n, plural, one {הוק אחד בעברית} two {שני הוקים בעברית} other {# הוקים בעברית}}" |

המספרים מוצגים ב-`Num animate` (ספירה פעם אחת כשהם נכנסים למסך), ותחת הפחתת תנועה מוצגים מיד.

### §3.12 `PricingCards` + `CreditCostTable` (`#pricing`)

- Eyebrow: "מחירים"
- H2: **"מחירים פשוטים, בשקלים"**
- תת-כותרת: **"מתחילים בחינם, בלי כרטיס אשראי. כל המחירים כוללים מע״מ, ומבטלים אונליין בכל רגע."**
- `BillingCycleToggle`: "חודשי" / "שנתי · חיסכון של 20%" (מוצג רק אם דגל `annual_billing` פעיל).
- ארבעת כרטיסי התוכניות זהים לעמוד המחירים (§7.2), כולל `features_he`, באדג׳ **"מומלץ"** לתוכנית עם `plans.is_highlighted` (`business` ב-seed), ו-"≈ N סרטונים בחודש".
- מתחת: שורת ההבטחות (§7.3) וגרסה מקוצרת של `CreditCostTable` עם ארבע הדוגמאות המחושבות בלבד (§7.5).
- כפתור: **"לכל פרטי המחירים ←"** (`/pricing`). מתג מחירים לעסקים (`VatModeToggle`) מוצג רק בעמוד המחירים.
- אירוע: `pricing_viewed {location:"landing"}` כשהסקשן נכנס למסך בפעם הראשונה.

### §3.13 `FaqAccordion` (`#faq`)

- Eyebrow: "שאלות"
- H2: **"שאלות נפוצות"**
- 12 שאלות, לפי המזהים: `what-you-get`, `no-editing`, `hebrew-voice`, `own-media`, `credits`, `failure`, `ownership`, `ai-label`, `invoice-vat`, `cancel`, `accessibility`, `agencies`. הנוסח המלא של כל השאלות והתשובות נמצא בעמוד השאלות הנפוצות (§9.3) — דף הבית שולף לפי מזהה.
- Accordion של Radix: כמה פריטים יכולים להיות פתוחים, chevron בצד הסוף, הכותרת היא כפתור בתוך `<h3>`.
- מתחת: **"לא מצאתם תשובה? לכל השאלות ←"** (`/faq`) ו-**"או כתבו לנו בוואטסאפ"**.
- `FAQPage` JSON-LD עם אותן 12 שאלות (§12.4). אירוע: `faq_expanded {question_id, location:"landing"}`.

### §3.14 `FinalCtaBand` (`#start`)

- פס ברוחב מלא עם זוהר "אלומת מקרן" חזק (בערכה הבהירה: פס בצבע דיו עם טקסט בהיר).
- H2 בגופן התצוגה (Karantina): **"הסרטון הבא של העסק שלכם מתחיל כאן."**
- תת-כותרת: **"בוחרים נישה, מספרים על העסק, ומקבלים תסריט ותצוגה מקדימה תוך דקות. {trialCredits} קרדיטים לניסיון עלינו, בלי כרטיס אשראי."** (`{trialCredits}` מוזרק מה-seed, כמו ב-`TrustRow`, §3.3.4.)
- `NichePicker` מקוצר (combobox אחד, "מה העסק שלכם?") וכפתור **"צרו את הסרטון הראשון שלי"** עם "חינם · ללא כרטיס אשראי". ההתנהגות כמו בגיבור (§3.3.3), עם `src=final_cta`.
- אירועים: `niche_selected {niche, location:"final_cta"}`, `cta_clicked {location:"final_cta"}`; לאורח גם `signup_started {source:"final_cta"}`.

### §3.15 `MarketingFooter` ו-`MobileStickyCta`

לפי §2.3 ו-§2.4.

### §3.16 מטא-דאטה של דף הבית

- `<title>`: **"{{BRAND_NAME}} | סרטון תדמית ורילס לעסק, בעברית ובלי עורך"** (אם האורך עולה על 60 תווים אחרי החלפת השם — "{{BRAND_NAME}} | סרטון תדמית ורילס לעסק בעברית").
- description: **"סרטון תדמית ורילס לעסק שלכם תוך דקות: הוק לנישה, תסריט, קריינות וכתוביות בעברית ב-3 פורמטים. מחירים בשקלים כולל מע״מ. {trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי."**
- JSON-LD: `Organization`, `WebSite` + `SearchAction`, `SoftwareApplication`, `FAQPage`, `HowTo` (§12.4).
- תמונת OG סטטית מעוצבת (`app/opengraph-image.tsx`, §12.5): H1 של וריאנט A, אריחי טלפון, הדומיין.

**קריטריוני קבלה**
- [ ] כל הסקשנים מופיעים בסדר שנקבע, עם `id`-ים קבועים; ניווט ל-`/#how-it-works` גולל למקום הנכון בלי שהכותרת הדביקה תסתיר את ה-H2.
- [ ] LCP (מובייל, 4G מדומה, Lighthouse) הוא ה-H1 ו-< 2.5s; CLS < 0.05 גם אחרי טעינת קיר הווידאו.
- [ ] אורח בלי הסכמה תמיד מקבל וריאנט A ואין עוגיית `exp_hero`; אחרי הסכמה מתקבל וריאנט קבוע לאורך ביקורים.
- [ ] `HeroPromptCard`: שגיאת קישור מוקראת על ידי קורא מסך; `@name` הופך לכתובת אינסטגרם; משתמש לא מחובר מגיע ל-`/login?next=…` והטיוטה זמינה ב-`/app/create` אחרי ההרשמה.
- [ ] `EnginesStrip` מציג רק משפחות של מודלים פעילים; כיבוי מודל באדמין מסיר את שמו אחרי revalidate.
- [ ] `computeSavings` עובר את שלוש הדוגמאות בבדיקת יחידה, ומחזיר את נוסח "עורך הווידאו זול יותר" כשהחיסכון ≤ 0.
- [ ] `Testimonials` לא מרונדר כשיש פחות מ-3 המלצות מאושרות; בדיקת CI נכשלת על רשומת placeholder בקובץ הייצור.
- [ ] `ShowcaseGallery` מציג קודם דוגמאות מפורסמות ומשלים לשש בפריטי ההדגמה של נספח D; כל פריט הדגמה מסומן "הדגמה", וכל עוד יש כזה מוצגת התת-כותרת החלופית.
- [ ] `{freeVideoCredits}` מחושב מ-`FREE_VIDEO_SAMPLE` ומחזיר 30 עם ה-seed. בכל מקום ש"כ-2 סרטונים" מופיע, הוא מלווה ב"באיכות טיוטה, עם סימן מים" ומחושב `floor(trialCredits / freeVideoCredits)` (בדיקת יחידה על `messages/he.json` ועל `content/**`).
- [ ] כפתור "עצירת הווידאו" עוצר גם תנועה וגם ניגון; תחת `prefers-reduced-motion` אין שום תנועה בדף (בדיקת Playwright עם `reducedMotion: 'reduce'`).
- [ ] axe: אפס הפרות חמורות או קריטיות בדף הבית בשתי ערכות הנושא.

---

## §4. דפי נישה

### §4.1 האב הנישות (`/niches`)

- Breadcrumbs: ראשי › נישות
- H1: **"סרטוני תדמית ורילס לפי נישה"**
- פתיח (`body-lg`): **"לכל סוג עסק יש שפה משלו. מספרה לא מדברת כמו משרד עורכי דין, ומסעדה לא מוכרת כמו יועץ משכנתאות. בחרו את הנישה שלכם, ותקבלו הוקים, תסריטים וסגנון שמתאימים לה, כולל כללי הפרסום שחשוב להכיר."**
- שדה סינון בצד לקוח: תווית מוסתרת "סינון נישות", placeholder "חפשו את סוג העסק שלכם". אין תוצאות: "לא מצאנו נישה כזו. אפשר ליצור סרטון לכל עסק — פשוט בחרו "עסק אחר" באשף."
- `NicheGrid`: קטגוריות לפי `niche_categories.sort_order`, כל קטגוריה עם `<h2>` (`name_he`), ובתוכה כרטיסים לפי `niches.sort_order`. קטגוריה שאין בה נישה פעילה לא מוצגת. בכרטיס:
  - `NicheIcon` + `name_he` (כותרת הכרטיס, `<h3>`)
  - `description_he` (שתי שורות, `line-clamp-2`)
  - קישור ראשי: **"סרטון תדמית ←"** (`/niches/[slug]`, שולח `niche_selected {niche, location:"niches_hub"}`); קישור משני: **"{count, plural, one {הוק אחד} two {שני הוקים} other {# הוקים}}"** (`/hooks/[slug]`)
  - תג קטן כשיש `compliance_flag` שאינו `none`: "יש כללי פרסום" (אייקון `ShieldCheck`)
- בתחתית: כרטיס רחב — כותרת **"לא מצאתם את הנישה שלכם?"**, טקסט **"אפשר ליצור סרטון לכל עסק. מתארים את העסק במילים, והמערכת מתאימה את ההוקים והתסריט."**, כפתור **"צרו סרטון לעסק שלי"** (`/app/create`).
- מטא: title **"סרטוני תדמית ורילס לפי נישה | {{BRAND_NAME}}"**; description **"הוקים, תסריטים וסרטונים מוכנים ל-35 סוגי עסקים: נדל״ן, מספרות, רופאי שיניים, מסעדות, קבלני שיפוצים ועוד. בעברית, כולל כללי הפרסום לכל נישה."** (המספר מוזרק מהנתונים).
- JSON-LD: `BreadcrumbList`, `ItemList` של דפי הנישה.

### §4.2 תבנית דף נישה (`/niches/[niche]`)

סדר הסקשנים ומקור כל שדה:

| # | סקשן | תוכן (קופי סופי; `{x}` = שדה) | מקור |
|---|---|---|---|
| 1 | Breadcrumbs | ראשי › נישות › {short_name_he} | — |
| 2 | Hero | Eyebrow: `{category.name_he}` · H1: **"סרטון תדמית ל{short_name_he}"** · פתיח: הפסקה הראשונה של `landing_intro_he` (או `description_he`) · כפתור ראשי **"צרו סרטון ל{short_name_he}"** (`/app/create?niche={slug}&src=niche_page`) · כפתור משני **"לכל ההוקים ל{short_name_he}"** · `TrustRow` · בצד הסוף `PhoneFrame` עם סרטון הנישה | `niches`, `examples` |
| 3 | "מה {short_name_he} מפרסמים" | H2: **"אילו סרטונים כדאי ל{short_name_he} לפרסם"** · כרטיס לכל פריט ב-`video_types_he` · מתחת: **"כל אחד מהם אפשר ליצור באשף: בוחרים מטרה, והתסריט נבנה בהתאם."** | `video_types_he` |
| 4 | פסקאות ההמשך | שאר הפסקאות של `landing_intro_he` (טקסט ייחודי לנישה, 250–400 מילים) | `landing_intro_he` |
| 5 | תסריטים לדוגמה | H2: **"3 תסריטים לדוגמה ל{short_name_he}"** · `SampleScripts` · הערה: **"אלה תסריטים לדוגמה לעסק בדוי. בתסריט שלכם, כל מספר, מחיר או נתון מגיע רק ממה שאתם מאשרים."** | `niches.sample_scripts` |
| 6 | הוקים | H2: **"הוקים ל{short_name_he}"** · 6 כרטיסי `HookCard` (מומלצים קודם) · כפתור **"{count, plural, one {להוק ←} two {לשני ההוקים ←} other {לכל # ההוקים ←}}"** | `hooks` |
| 7 | עונות | H2: **"מתי {short_name_he} מפרסמים יותר"** · רשימת `seasonal_angles_he` · `SeasonRail` של העונות הקרובות שהנישה נמצאת ב-`niche_slugs` שלהן, עם תאריך משוער וקישור לדף העונה | `seasonal_angles_he`, `seasons` |
| 8 | כללי פרסום | (רק אם `compliance_note_he`) כותרת **"כללי פרסום שכדאי להכיר"** · `compliance_note_he` · **"המערכת מוסיפה את ההסתייגויות הנדרשות לנישה ונמנעת מניסוחים בעייתיים, אבל האחריות לתוכן שמתפרסם היא שלכם. במקרה של ספק, כדאי לבדוק מול הגוף המקצועי שלכם."** | `compliance_note_he` |
| 9 | כמה זה עולה | H2: **"כמה עולה סרטון ל{short_name_he}"** · שלוש שורות מתוך הדוגמאות המחושבות (§7.5) עם קישור **"לטבלת העלויות המלאה ←"** · כרטיס תוכנית "עסק" מוקטן | `credit_costs`, `plans` |
| 10 | שאלות | H2: **"שאלות נפוצות על סרטונים ל{short_name_he}"** · `FaqAccordion` (`faq_expanded {question_id, location:"niche_page"}`, `question_id` = `{slug}-{index}`) | `niches.faq` (`[{q_he, a_he}]`) |
| 11 | נישות קשורות | H2: **"נישות קרובות"** · עד 4 כרטיסים מאותה קטגוריה | `niches` |
| 12 | `FinalCtaBand` | עם הנישה בחורה מראש; H2: **"הסרטון הבא של העסק שלכם מתחיל כאן."** | — |

- **ללא תוכן ייחודי ובדוק — לא מאנדקסים:** אם `landing_intro_he` ריק או קצר מ-150 מילים, או ש-`seo_reviewed_at` ריק (הטקסט לא אושר על ידי אדם באדמין), הדף מקבל `noindex,follow`. בהשקה כל נישה בעדיפות 1 חייבת טקסט מלא ומאושר (נבדק ב-CI).
- **נדל״ן ונישות דומות:** לנישות `real-estate`, `real-estate-developers`, `zimmers-boutique-hotels` ו-`event-venues`, הדף מציג תיבת הבהרה קבועה: **"את הנכס או המקום עצמו מציגים רק מצילומים אמיתיים שלכם. ויז׳ואלים שנוצרו ב-AI משמשים לאווירה ולמעברים, לא כתחליף למה שאתם מוכרים."** ב-`real-estate-developers` מתווסף המשפט: **הדמיות מסומנות בכיתוב "הדמיה בלבד".**
- מטא: title = `seo_title_he` או **"סרטון תדמית ל{short_name_he}: רילס והוקים בעברית | {{BRAND_NAME}}"** (קיצור לפי §12.1); description = `seo_description_he` או **"סרטון תדמית ורילס ל{short_name_he} תוך דקות: הוקים לנישה, תסריט, קריינות וכתוביות בעברית. כולל כללי הפרסום לתחום. {trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי."**
- JSON-LD: `BreadcrumbList`, `FAQPage`, `VideoObject` לסרטון הגיבור (אם הוא דוגמה אמיתית).
- תמונת OG: `app/(marketing)/niches/[niche]/opengraph-image.tsx` (§12.5).
- אירועים: `cta_clicked {location:"niche_page_hero"|"niche_page_final"}`, `hook_copied {hook_id, niche, location:"niche_page"}`, `example_played {example_id, location:"niche_page"}`. ה-`FinalCtaBand` בדף נישה מוביל ל-`/app/create?niche={slug}&src=niche_page` (ולא `final_cta`).

### §4.3 שדות התוכן של נישה — מה צריך לכתוב לכל נישה

| שדה | אורך | כללים |
|---|---|---|
| `short_name_he` | 1–4 מילים, עד 40 תווים | צירוף ברבים שאפשר להצמיד אליו את האות ל (§1.2) |
| `seo_title_he` | עד 60 תווים כולל " \| {{BRAND_NAME}}" | הביטוי שמחפשים ("סרטון תדמית לרופא שיניים") בתחילת הכותרת |
| `seo_description_he` | עד 155 תווים (מומלץ 120–155) | הבטחה אחת, פרט ייחודי לנישה, הנעה לפעולה |
| `landing_intro_he` | 250–400 מילים, 3–5 פסקאות (מופרדות בשורה ריקה); ב-Zod 1,300–3,200 תווים | הפסקה הראשונה היא הפתיח בגיבור (עד 40 מילים) |
| `seo_intro_he` | 180–260 מילים; ב-Zod 900–2,200 תווים | לדף `/hooks/[niche]`; שונה מ-`landing_intro_he` |
| `faq` | 4–6 פריטים `[{ "q_he": "…", "a_he": "…" }]` (שאלה עד 120 תווים, תשובה עד 700) | תשובות של 40–90 מילים |
| `sample_scripts` | בדיוק 3 פריטים `SampleScript` | מבנה בהמשך. זה מושג שיווקי נפרד מחמשת התסריטים של נספח D |

**מי כותב את התוכן.** הסקריפט `scripts/generate-niche-seo.ts --niche={slug} | --all [--dry-run]` (`pnpm generate-niche-seo`) מפעיל שני מחוללים: `seo.niche_intro.v1` (חלק 05 §10.12, הפלט `SeoNicheIntroV1`: `seo_title_he`, `seo_description_he`, `seo_intro_he`, `landing_intro_he`, `short_name_he`, `faq`) ו-`script.generate.v1` ל-3 התסריטים לדוגמה של הנישה. הפלט נשמר כטיוטה דרך עזרי ה-API של האדמין, והסקריפט לעולם לא כותב `seo_reviewed_at`: רק אדם שבודק את הטקסט ב-`/admin/niches` (כפתור "נבדק", חלק 03 §22.8) מסמן אותו, וזה מה שמאפשר אינדוקס (§12.2). לנישות בעדיפות 1 הטקסט נכתב או נערך ידנית לפני ההשקה. לנישות `restaurants`, `renovation-contractors`, `mortgage-advisors`, `dentists` ו-`beauty-nails` אפשר לגזור תסריט לדוגמה מנספח D עם `toNicheSampleScript` (`lib/marketing/`); תוכן שנכתב בחלק הזה גובר. התסריטים לדוגמה מופקים עם שלושת ההוקים המומלצים של הנישה ונשמרים כתמצית:

```ts
// niches.sample_scripts (jsonb) — תמצית של ScriptV1 לתצוגה בלבד
type SampleScript = {
  title_he: string;
  video_type: "brand_promo" | "reel_hook" | "offer" | "testimonial" | "launch" | "recruiting" | "explainer";
  duration_sec: 15 | 30 | 45 | 60;
  hook_id: string | null;            // hooks.id
  beats: Array<{ role: string; vo_he: string; onscreen_text_he: string }>;
  cta_text_he: string;
  disclaimers_he: string[];
};
```

`SampleScripts` מציג כל תסריט ככרטיס: כותרת, תגים (סוג סרטון, משך), טבלת ביטים בשלוש עמודות ("שלב", "קריינות", "על המסך"), שורת הנעה לפעולה, הסתייגויות, וכפתור **"צרו סרטון מהתסריט הזה"** (`/app/create?niche={slug}&hook={hook_id}&src=niche_page` בדף נישה, `&src=hooks` בעמוד ההוקים). placeholders מוצגים כ-`PlaceholderChip`. ההסתייגויות כוללות תמיד את הסתייגויות החובה של `COMPLIANCE_RULES` לפי `compliance_flag` של הנישה (חלק 05 §21.3), בדיוק כמו בתסריט אמיתי.

### §4.4 דוגמה מלאה: נדל״ן — מתווכים (`real-estate`)

- `short_name_he`: מתווכי נדל״ן
- `seo_title_he`: **"סרטון תדמית למתווכי נדל״ן: רילס, סיורים והוקים"**
- `seo_description_he`: **"סרטונים למתווכי נדל״ן: סיור בנכס מהצילומים שלכם, מיתוג אישי והוקים שמביאים פניות מקונים וממוכרים. בעברית, עם קריינות וכתוביות, תוך דקות."**
- `default_register`: `warm` · `default_audience_gender`: `plural` · `default_cta`: `whatsapp` (מנספח E §3.3, דרך `niche_extras.json`) · `default_music_mood`: `null` בהשקה (אדמין יכול לקבוע; עד אז הסטוריבורד בוחר מצב רוח)

**`landing_intro_he`** (4 פסקאות):

> קונים ומוכרים מחליטים עם מי לדבר הרבה לפני השיחה הראשונה. הם גוללים, רואים מתווך אחד שמסביר, מראה ומדבר בגובה העיניים, ושומרים את המספר שלו. סרטון קצר וטוב עושה את העבודה הזו בשבילכם, כל שבוע, בלי צלם ובלי עורך.
>
> ב{{BRAND_NAME}} אתם בוחרים מה הסרטון צריך להשיג: סיור בנכס חדש, מדריך שכונה, טיפ למוכרים או סרטון מיתוג אישי שמסביר למה לבחור דווקא בכם. אתם מעלים את הצילומים מהטלפון, בוחרים הוק שעוצר גלילה, והמערכת כותבת תסריט בעברית טבעית, מקריינת, מוסיפה כתוביות מימין לשמאל, מוזיקה ואת הפרטים שלכם בכרטיס הסיום, עם כפתור וואטסאפ. את ההוק בוחרים מתוך הוקים שנכתבו לנדל״ן: אזהרה לקונים לפני חתימה, טעות נפוצה של מוכרים, חשיפה של מחירי העסקאות בשכונה או רגע מוכר מחיפוש דירה. אפשר גם לבקש מה-AI הוקים חדשים לפי העיר והקהל שלכם, ולנסות כמה פתיחות לאותו סרטון כדי לראות איזו מחזיקה את הצופים יותר זמן.
>
> בנדל״ן יש כלל אחד שאנחנו לא מתפשרים עליו: את הנכס עצמו מראים רק מצילומים אמיתיים. ויז׳ואלים שנוצרו ב-AI משמשים לאווירה, למעברים או לרחוב בשעת ערב, לא כתחליף לדירה שאתם משווקים. גם מחירים, ימים על השוק ונתוני עסקאות מופיעים רק אם אישרתם אותם, ואת שם המתווך ומספר הרישיון אפשר להוסיף לכרטיס הסיום בלחיצה. כך גם הקונים וגם המוכרים יודעים שמה שהם רואים בסרטון הוא מה שיפגשו במציאות.
>
> סרטון אחד מספיק לשלושה מקומות: 9:16 לרילס, לטיקטוק ולסטטוס בוואטסאפ, 1:1 לפיד ולקבוצות הפייסבוק של השכונה, ו-16:9 לאתר וליוטיוב. את אותו סרטון אפשר לשלוח גם ישירות למוכרים שמתלבטים, כדוגמה לאיך תשווקו את הנכס שלהם. ברשתות, קביעות חשובה יותר מכמות: עדיף סרטון אחד בשבוע, על נכס חדש או על שאלה שקונים שואלים אתכם שוב ושוב, מחמישה סרטונים בבת אחת ואחריהם חודש של שקט. ולקראת הקיץ, עונת המעברים, ולקראת פסח, מחכים לכם בספרייה הוקים עונתיים מוכנים.

**`seo_intro_he`** (לדף `/hooks/real-estate`, 3 פסקאות):

> מתווך שמפרסם סרטון בשבוע בונה לעצמו מוניטין שאי אפשר לקנות בשלט. אבל רוב הסרטונים בנדל״ן נפתחים באותה צורה: דלת נפתחת, מוזיקה ברקע, ו"דירת 4 חדרים מהממת". הצופה כבר ראה את זה מאה פעם, וגולל הלאה.
>
> ההוקים בעמוד הזה נכתבו כדי לשבור את הדפוס הזה. יש כאן הוקים של רשימה ("3 דברים לבדוק לפני שחותמים על דירה. על השלישי פחות מדברים"), של אזהרה, של תוצאה, של נקודת מבט, של חשיפת מחיר ושל דעה לא פופולרית, ולכל אחד מהם כתוב מה רואים בשלוש השניות הראשונות. אפשר להעתיק אותם כמו שהם, להכניס את העיר ואת שם המשרד בשדות ההתאמה, או להפוך כל הוק לסרטון מלא בלחיצה. שימו לב לשני כללים: מספרים בהוקים הם להמחשה, ובסרטון שלכם צריך להחליף אותם בנתונים אמיתיים; ומחיר מבוקש לא מוצג כאילו הוא מחיר עסקה.
>
> איך בוחרים? אם המטרה היא פניות ממוכרים, התחילו בהוקים של טעות נפוצה או של רושם ראשון, כמו "תפסיקו לתמחר את הדירה שלכם לפי מה שהשכן ביקש". אם אתם רוצים שקונים ישמרו את המספר שלכם, הוקים של רשימה ושל נקודת מבט מתאימים יותר, כי הם נותנים ערך עוד לפני שמישהו צריך מתווך. ובסוף העמוד מחכים הוקים עונתיים לקיץ, עונת המעברים, ולפסח, כשהרבה קונים מתכננים להתחיל בבית חדש.

**`faq`** (נשמר כ-`[{ "q_he": …, "a_he": … }]`):

| שאלה | תשובה |
|---|---|
| מה כדאי שיופיע בסרטון של מתווך נדל״ן? | הוק חד בשלוש השניות הראשונות, צילומים אמיתיים של הנכס או של השכונה, משפט אחד שמסביר למה לפנות אליכם, והנעה לפעולה אחת ברורה, בדרך כלל וואטסאפ. בכרטיס הסיום אפשר להוסיף את שם המתווך ואת מספר הרישיון. כדאי לבדוק מה חוק המתווכים במקרקעין מחייב לגבי פרסום. |
| אפשר ליצור סרטון סיור בנכס בלי צלם? | כן. מצלמים את הנכס בטלפון, באור יום ובתנועה איטית, ומעלים את הקטעים או התמונות. המערכת מסדרת אותם לפי התסריט, מוסיפה תנועה עדינה לתמונות, קריינות וכתוביות. ויז׳ואלים של AI משמשים רק למעברים ולאווירה, לא כתחליף לנכס עצמו. |
| כמה עולה סרטון כזה? | רילס של 30 שניות באיכות טיוטה עולה בערך {draftCredits} קרדיטים, ובאיכות סטנדרט בערך {standardCredits}. בתוכנית "עסק" זה יוצא בערך ₪{draftIls} ו-₪{standardIls} לסרטון, כולל מע״מ. סיור שבנוי בעיקר מהצילומים שלכם זול יותר, כי צריך פחות קליפים של AI. |
| אילו הוקים עובדים הכי טוב לנדל״ן? | הוקים שנותנים ערך לפני שהם מוכרים: אזהרות לקונים, טעויות של מוכרים, חשיפת מחיר בשכונה ונקודת מבט של מי שמחפש דירה. בספריית ההוקים לנדל״ן יש {count, plural, one {הוק אחד כזה} two {שני הוקים כאלה} other {# הוקים כאלה}}, ולכל אחד הסבר למה הוא עובד ומה רואים בשלוש השניות הראשונות. |
| איפה כדאי לפרסם את הסרטון? | ברילס ובטיקטוק כדי להגיע לקונים חדשים, בסטטוס בוואטסאפ ללקוחות שכבר מכירים אתכם, ובקבוצות הפייסבוק של השכונה. את גרסת ה-16:9 שימו באתר ובעמוד הנכס. מכל סרטון מקבלים את שלושת הפורמטים. |

**`sample_scripts`:**

1. **"סיור בנכס: מה קונים רואים קודם"** · `reel_hook` · 30 שניות · הוק `real-estate-07`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | זה מה שקונים רואים בחמש השניות הראשונות בדירה שלכם. | 5 השניות הראשונות |
| בעיה | מסדרון עמוס, אור חלש וריח של בישול, וההחלטה כבר מתחילה להיווצר. | הרושם הראשון נקבע בכניסה |
| פתרון | לכן בכל נכס שאני משווקת, מתחילים מהכניסה: מפנים, מדליקים את כל האורות ופותחים חלונות. | מפנים, מאירים, מאווררים |
| הוכחה | ככה נראית אותה כניסה, אחרי חצי שעה של סידור. | אחרי חצי שעה |
| הנעה לפעולה | רוצים לדעת מה הקונים יראו אצלכם? שלחו לי הודעה בוואטסאפ. | שלחו "בדיקה" בוואטסאפ |

הסתייגות: "המחירים והתמונות להמחשה בלבד." (הסתייגות החובה של נדל״ן, חלק 05 §21.3)

2. **"מיתוג אישי: למה מוכרים בוחרים בי"** · `brand_promo` · 45 שניות · הוק `real-estate-01`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | שלושה דברים לבדוק לפני שחותמים על דירה. על השלישי פחות מדברים. | 3 דברים לבדוק לפני שחותמים על דירה |
| ערך | אחת: מה נמכר בבניין בשנה האחרונה. שתיים: מה כתוב בנסח הטאבו. | 1. עסקאות בבניין, 2. נסח טאבו |
| ערך | ושלוש: כמה הדירה באמת עולה לכם לחודש, כולל ועד בית, ארנונה ותיקונים שמחכים. | 3. העלות החודשית האמיתית |
| מותג | אני מ{שם_העסק}, ואני עובדת ב{עיר} כבר שנים. אצלי שלושת הדברים האלה מגיעים אליכם לפני שאתם מתאהבים בדירה. | {שם_העסק}, {עיר} |
| הנעה לפעולה | מחפשים או מוכרים ב{עיר}? כתבו לי בוואטסאפ, ונקבע שיחה של עשר דקות. | שיחה של 10 דקות בוואטסאפ |

הסתייגויות: "המחירים והתמונות להמחשה בלבד." · "שם המתווכת ומספר הרישיון מופיעים בכרטיס הסיום."

3. **"טיפ למוכרים: אל תתמחרו לפי השכן"** · `explainer` · 30 שניות · הוק `real-estate-05`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | תפסיקו לתמחר את הדירה שלכם לפי מה שהשכן ביקש. | לא לפי השכן |
| בעיה | מחיר מבוקש הוא לא מחיר עסקה. דירה שמתומחרת גבוה מדי יושבת על השוק, והקונים מתחילים לשאול מה לא בסדר. | מחיר מבוקש אינו מחיר עסקה |
| פתרון | מתמחרים לפי עסקאות שנסגרו בפועל, בקומה ובמצב דומים, ולפי מה שקורה בשוק עכשיו. | עסקאות אמיתיות, מצב דומה, עכשיו |
| הנעה לפעולה | רוצים הערכה מבוססת עסקאות לדירה שלכם? שלחו לי את הכתובת בוואטסאפ. | הערכה לפי עסקאות אמיתיות |

הסתייגויות: "המחירים והתמונות להמחשה בלבד." · "ההערכה אינה שמאות מקרקעין."

### §4.5 דוגמה מלאה: רופאי שיניים (`dentists`)

- `short_name_he`: רופאי שיניים
- `seo_title_he`: **"סרטון תדמית לרופא שיניים: רילס והסברים בעברית"**
- `seo_description_he`: **"סרטונים למרפאות שיניים: הסברי טיפולים שמורידים חשש, היכרות עם הצוות וטיפים. בעברית, לפי כללי הפרסום לרופאי שיניים, תוך דקות."**
- `default_register`: `warm` · `default_audience_gender`: `plural` · `default_cta`: `booking` (מנספח E §3.3, דרך `niche_extras.json`) · `default_music_mood`: `null` בהשקה

**`landing_intro_he`** (4 פסקאות):

> רוב המטופלים לא מחפשים רופא שיניים כשהכול בסדר. הם מחפשים כשכואב, כשמפחיד או כשמישהו אמר להם "צריך שתל". באותו רגע, סרטון קצר שמסביר בגובה העיניים מה הולך לקרות על הכיסא שווה יותר מכל מודעה.
>
> ב{{BRAND_NAME}} אפשר להפיק את הסרטונים האלה בלי יום צילום: הסבר על טיפול, שאלות נפוצות לפני השתלה, סיור קצר במרפאה, היכרות עם הצוות או טיפ היגיינה לשבוע. בוחרים הוק, מעלים כמה תמונות של המרפאה ושל הצוות, והמערכת כותבת תסריט רגוע וברור, מקריינת בעברית, מוסיפה כתוביות ומסיימת בהזמנה לקבוע תור. סרטון טוב למרפאה לא צריך להיות מושלם: מספיק שהוא עונה על שאלה אחת שמטופלים שואלים אתכם כל שבוע, מראה את הפנים של מי שיטפל בהם, ומסביר מה הצעד הבא. כשמישהו מגיע לקבוע תור, הוא כבר מכיר את המקום ואת הצוות, והחשש קטן יותר.
>
> פרסום של רופאי שיניים כפוף לכללים, ולכן התסריטים נכתבים בזהירות: בלי הבטחת תוצאה, בלי "ללא כאב", מחירים רק לפי המחירון האמיתי שלכם, ותמונות לפני ואחרי רק בכפוף לכללים ועם ההסתייגות "התמונות להמחשה. התוצאות משתנות מאדם לאדם." בכל סרטון של מרפאה מופיעה ההסתייגות "התוצאות משתנות מאדם לאדם.", ובמודעות ממומנות המערכת מנסחת בגוף שלישי, כדי לא להניח משהו על מצבו הבריאותי של הצופה. כך הסרטון בונה אמון במקום לעורר חשד, ועומד בכללים.
>
> כל סרטון יוצא בשלושה פורמטים ועם קובץ כתוביות, כך שאפשר לשים אותו גם באתר המרפאה בצורה נגישה: את גרסת ה-16:9 בעמוד הטיפול באתר, את האנכית ברילס ובסטטוס, ואת הריבועית בפיד. ואם יש במרפאה כמה רופאים, אפשר להכין לכל אחד מהם סרטון היכרות קצר משלו. ולקראת החזרה ללימודים וסוף השנה, מחכים לכם רעיונות עונתיים: בדיקות לילדים לפני שנת הלימודים, ותזכורת למטופלים לנצל את ההטבות של קופת החולים לפני שהשנה נגמרת.

**`seo_intro_he`** (לדף `/hooks/dentists`, 3 פסקאות):

> הסרטון הטוב ביותר של מרפאת שיניים לא מוכר טיפול. הוא מוריד פחד. הוקים לרופאי שיניים צריכים לעשות את זה כבר במשפט הראשון: לשאול שאלה שכל אחד שאל את עצמו ("מצחצחים מיד אחרי הקפה?"), לנפץ מיתוס, או להבטיח הסבר קצר וברור לפני החלטה גדולה כמו השתלה.
>
> ריכזנו כאן הוקים שנכתבו לנישה, לפי סוגים: אזהרות, שאלות, ניפוץ מיתוסים, מדריכים מהירים וחשיפת מחיר. לכל הוק מצורף תיאור של מה רואים בשלוש השניות הראשונות, ולחלקם הערת פרסום. למשל, במודעה ממומנת עדיף "3 סימנים שאולי צריך טיפול שורש" על פני "3 סימנים שאתם צריכים טיפול שורש", כי מטא עלולה לפסול מודעה שמניחה משהו על מצבו הבריאותי של הצופה. מחירים בהוקים הם להמחשה בלבד, ומפרסמים רק לפי המחירון של המרפאה.
>
> איך משתמשים בהם? בחרו הוק אחד לכל שאלה שמטופלים שואלים אתכם שוב ושוב, והפכו אותו לסרטון של 15 עד 30 שניות. הוקים של שאלה ושל ניפוץ מיתוס מתאימים לרילס ולטיקטוק, כי הם מזמינים תגובות. הוקים של מדריך מהיר, כמו שימוש נכון בחוט דנטלי, עובדים טוב גם ביוטיוב שורטס, כי אנשים מחפשים בדיוק את ההסבר הזה. וכשאתם מצלמים, הראו את המרפאה האמיתית ואת הצוות, לא תמונות מאגר. לפני החזרה ללימודים, שימו לב גם להוקים העונתיים בתחתית העמוד.

**`faq`** (נשמר כ-`[{ "q_he": …, "a_he": … }]`):

| שאלה | תשובה |
|---|---|
| מותר לרופא שיניים לפרסם סרטונים ברשתות? | כן, בכפוף לכללי הפרסום שחלים על רופאי שיניים. באופן כללי: בלי הבטחת תוצאות, בלי סופרלטיבים כמו "הכי טוב", בלי "ללא כאב" ובלי מחירים שאינם מהמחירון. התסריטים אצלנו נכתבים לפי הכללים האלה, אבל האחריות לפרסום היא של המרפאה, וכדאי לבדוק מול הגוף המקצועי במקרה של ספק. |
| אפשר להשתמש בתמונות לפני ואחרי? | רק בכפוף לכללי הפרסום החלים עליכם ובהסכמה בכתב של המטופל. כשמשתמשים בהן, המערכת מוסיפה את ההסתייגות "התמונות להמחשה. התוצאות משתנות מאדם לאדם." חלופה טובה היא סרטון שמראה את התהליך, צעד אחר צעד, בלי להציג תוצאה. |
| איך מצלמים את המרפאה בשביל הסרטון? | בטלפון מספיק. צלמו את חדר הטיפולים באור טבעי, את דלפק הקבלה, את הצוות מחייך (בהסכמתם) וכמה תקריבים של ציוד נקי. המערכת משלבת את הצילומים האלה עם הקריינות והכתוביות. אל תצלמו מטופלים בלי הסכמה בכתב. |
| כמה עולה סרטון הסבר על טיפול? | הסבר של 30 שניות באיכות טיוטה עולה בערך {draftCredits} קרדיטים, ובאיכות סטנדרט בערך {standardCredits}. בתוכנית "עסק" זה בערך ₪{draftIls} עד ₪{standardIls} לסרטון, כולל מע״מ. |
| הסרטונים יכולים להסביר טיפולים מורכבים כמו השתלות? | כן, וזה אחד השימושים הכי טובים שלהם. סרטון של 30–45 שניות שעונה על שאלה אחת ("כמה זמן לוקחת השתלה?") עובד טוב יותר מסרטון ארוך שמנסה להסביר הכול. המערכת מוסיפה הסתייגות שהמידע כללי ואינו תחליף לבדיקה אישית. |

**`sample_scripts`:**

1. **"חוט דנטלי ב-20 שניות"** · `reel_hook` · 30 שניות · הוק `dentists-10`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | אתם משתמשים בחוט דנטלי לא נכון. עשרים שניות ומתקנים. | 20 שניות ומתקנים |
| בעיה | רוב האנשים מכניסים את החוט ישר למטה, ושם הוא נעצר. | לא ישר למטה |
| פתרון | עוטפים את השן בצורת C, מחליקים בעדינות מתחת לקו החניכיים, ועולים למעלה. | צורת C, מתחת לחניכיים, למעלה |
| פתרון | ככה בכל שן, משני הצדדים. פעם ביום, בערב. | פעם ביום |
| הנעה לפעולה | מתי הייתם בבדיקה בפעם האחרונה? קבעו תור דרך הקישור בביו. | לקביעת תור: הקישור בביו |

הסתייגויות: "התוצאות משתנות מאדם לאדם." (הסתייגות החובה של נישה רפואית, חלק 05 §21.3) · "המידע כללי ואינו תחליף לבדיקה אישית."

2. **"5 שאלות לפני השתלה"** · `explainer` · 45 שניות · הוק `dentists-11`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | השתלת שיניים: חמש שאלות שחובה לשאול לפני שמתחילים. | 5 שאלות לפני השתלה |
| ערך | אחת: מי מבצע את ההשתלה ומה הניסיון שלו. שתיים: איזה שתל ולמה דווקא הוא. | 1. מי מבצע, 2. איזה שתל |
| ערך | שלוש: כמה שלבים יש בטיפול וכמה זמן כל שלב. ארבע: מה כלול במחיר ומה לא. | 3. שלבים וזמנים, 4. מה כלול |
| ערך | וחמש: מה קורה אם צריך תיקון אחרי הטיפול. | 5. מה קורה אחרי |
| מותג | ב{שם_העסק} עונים על חמש השאלות האלה בפגישת הייעוץ, לפני שמחליטים. | {שם_העסק} |
| הנעה לפעולה | רוצים לשאול אותן אצלנו? קבעו פגישת ייעוץ דרך הקישור. | קביעת פגישת ייעוץ |

הסתייגויות: "התוצאות משתנות מאדם לאדם." · "המידע כללי ואינו תחליף לבדיקה אישית. התאמת הטיפול נקבעת בבדיקה."

3. **"קפה ומברשת שיניים"** · `reel_hook` · 15 שניות · הוק `dentists-03`

| שלב | קריינות | על המסך |
|---|---|---|
| הוק | מצחצחים מיד אחרי הקפה? יש לנו בעיה. | מיד אחרי הקפה? |
| פתרון | אחרי משקה חומצי, כדאי לשטוף את הפה במים ולחכות קצת לפני הצחצוח. | לשטוף, לחכות, ואז לצחצח |
| הנעה לפעולה | עוד טיפים כאלה? עקבו אחרינו. | עוד טיפים בפרופיל |

הסתייגויות: "התוצאות משתנות מאדם לאדם." · "המידע כללי ואינו תחליף לבדיקה אישית."

**קריטריוני קבלה**
- [ ] `/niches` מציג את כל הנישות הפעילות לפי קטגוריות, בלי `local-politics`; סינון בצד לקוח עובד במקלדת ומודיע על מספר התוצאות (`aria-live`).
- [ ] `/niches/real-estate` ו-`/niches/dentists` מציגים את הטקסטים, התסריטים והשאלות שבסעיף הזה מילה במילה (snapshot test).
- [ ] כל נישה בעדיפות 1 עם `landing_intro_he` של 250–400 מילים, `seo_intro_he` של 180–260 מילים, 4–6 שאלות ב-`faq` (`{q_he, a_he}`), בדיוק 3 תסריטים לדוגמה ו-`seo_reviewed_at` מלא; אחרת CI נכשל. הטקסטים של `real-estate` ו-`dentists` בסעיף הזה עומדים בטווחים (בדיקת יחידה סופרת מילים).
- [ ] נישה בלי טקסט ייחודי ובדוק מקבלת `noindex,follow` ולא נכנסת למפת האתר.
- [ ] כל `SampleScript` כולל את הסתייגויות החובה של `COMPLIANCE_RULES` לנישה, ואין `·` בעמודת "על המסך" (נספח E §9).
- [ ] המספרים `{draftCredits}`, `{draftIls}` וכו׳ בתשובות מחושבים מ-`credit_costs` ו-`plans` בזמן הבנייה ולא כתובים ידנית.
- [ ] תיבת ההבהרה על צילומים אמיתיים מוצגת בארבע הנישות שהוגדרו.

---

## §5. ספריית ההוקים הציבורית

הספרייה היא גם פיצ׳ר, גם מנוע SEO וגם מגנט לידים. העיקרון: **להעתיק — חופשי ובלי הרשמה; להפוך לסרטון, לבקש וריאציות או לשמור — דורש חשבון.** אותם רכיבים (`HookCard`, `HookFilters`, `HookPersonalizer`) משמשים גם בספרייה שבתוך האפליקציה (`/app/hooks`, ראו חלק 03), עם הבדלי הרשאות בלבד.

### §5.1 נתונים וחיפוש

```ts
// lib/hooks/types.ts (טיפוסים נגזרים בלבד)
// אין הגדרה מקומית של HookCardDTO או של טיפוס פאסטים: החוזה היחיד הוא חלק 04 §20.3 (lib/api/contracts/hooks.ts)
import { HookCardDTO, HookSearchQuery, HookSearchResponse } from "@/lib/api/contracts/hooks";
import type { z } from "zod";
export type HookCard = z.infer<typeof HookCardDTO>;            // כרטיס שטוח, כפי שהשרת מחזיר
export type HookSearchParams = z.input<typeof HookSearchQuery>; // הפרמטרים של ה-URL (featured / has_video הם המחרוזת "1")
export type HookSearchResult = z.infer<typeof HookSearchResponse>;

// השדות של HookCardDTO שהאתר משתמש בהם (שמות זהים לחלק 04; אין אובייקטים מקוננים):
//   id, text_he (עם {placeholders}), placeholders,
//   niche_slug (null = הוק כללי), niche_name_he, niche_short_name_he, niche_icon (שם אייקון של lucide),
//   hook_type_slug, hook_type_name_he, family_slug, why_it_works_he (מ-hook_types), secondary_type_slug,
//   platforms, goal, gender, visual_direction_he, season_slug, season_name_he, compliance_note_he, is_featured,
//   sample_video_url (public-media: hooks/{hook_id}.mp4), sample_poster_url (hooks/{hook_id}.jpg, הפריים ב-1.0 שנ׳; null כשאין סרטון),
//   copies_count, generations_count, popularity
```

- **שני מסלולים, אותה פונקציה:** קומפוננטות השרת של `/hooks*` קוראות ישירות ל-RPC `search_hooks` ול-`search_hooks_facets` (חלק 04 §11.1) עם `createStaticClient()`, כדי שהעמודים יישארו ידידותיים ל-ISR; שינוי מסננים בצד הלקוח קורא ל-`GET /api/hooks/search` (ציבורי, bucket `hooks_search`), שמפעיל את אותן שתי פונקציות. אין מסלול חיפוש שלישי, והתוצאות זהות בשני המסלולים. השאילתה מנורמלת לפני החיפוש: הסרת ניקוד, המרת ״ ל-" ו-׳ ל-', כיווץ רווחים. חיפוש של מילה אחת תופס גם `text_he`, גם `name_he` של הנישה וגם של סוג ההוק.
- הפרמטרים ב-URL הם בדיוק: `q`, `type`, `platform`, `goal`, `gender`, `season`, `featured=1`, `has_video=1` (הערך הוא המחרוזת `"1"`, לא boolean, כמו ב-`HookSearchQuery`), `sort=popular|new|most_generated`, `page`. בעמוד `/hooks` מותר גם `niche`; ב-`/hooks/[niche]` הנישה קבועה מהנתיב.
- **כל URL עם פרמטר סינון מקבל `noindex,follow` ו-canonical לנתיב הבסיס** (בלי פרמטרים).
- התשובה כוללת ספירות לכל ערך בכל פאסט (`facets: { type: {slug: n}, platform: {...}, goal, gender, season }`), כדי להציג "(12)" ליד כל אפשרות ולנטרל אפשרויות עם 0.
- מיון `popular`: רלוונטיות (כשיש `q`), ואז `is_featured`, ואז `hook_popularity.score` (העתקות + 3 × יצירות), ואז `id` (חלק 04 §11.1). `new` לפי `created_at`; `most_generated` לפי `generations_count`.

### §5.2 אנטומיה של `HookCard`

```
┌─────────────────────────────────────────────────────────┐
│ [POV] [רילס · טיקטוק] [לידים] [פנייה ברבים]   [☆ שמירה] │  ← שורת צ׳יפים
│                                                         │
│  POV: מצאתם סוף סוף [שיפוץ אמבטיה] ב[חיפה],             │  ← טקסט ההוק (Heebo 700, 20px)
│  ועונים לכם בוואטסאפ תוך 5 דקות                          │     placeholders כ-PlaceholderChip
│                                                         │
│  3 השניות הראשונות: טלפון רוטט, הודעת וואטסאפ נכנסת,     │  ← visual_direction_he
│  חיוך של הקלה                                           │
│  למה זה עובד: הזדהות עם רגע מוכר + הבטחה ספציפית          │  ← why_it_works_he של הסוג
│  ⚠ שימו לב: המספר להמחשה; כתבו את זמן התגובה האמיתי      │  ← compliance_note_he (אם יש)
│  [▶ סרטון לדוגמה]                                       │  ← רק אם יש sample_video_url
│                                                         │
│ [העתקה] [צרו סרטון מההוק ←] [5 וריאציות AI]               │  ← פעולות
│ [שליחה בוואטסאפ] [העתקת קישור]     הועתק 214 פעמים       │  ← מונים אמיתיים בלבד
└─────────────────────────────────────────────────────────┘
```

| אזור | תוכן ופורמט |
|---|---|
| צ׳יפים | צ׳יפ לימון עם תווית "הוק" לסוג (`hook_type_name_he`, למשל "POV"); פלטפורמות כטקסט ("רילס · טיקטוק"); מטרה; ניסוח (רק אם לא `neutral`); עונה (`season_name_he`, אם יש); "לכל עסק" (אם `niche_slug === null`); בעמודים שאינם עמוד נישה — גם צ׳יפ נישה: `NicheIcon` עם `niche_icon` ו-`niche_short_name_he` (או `niche_name_he` אם חסר). בלי אייקונים מסחריים של הפלטפורמות. |
| טקסט | `<blockquote>` (לא כותרת). placeholders לא ממולאים מוצגים כ-`PlaceholderChip` במרקר לימון עם שם השדה ("עיר"); ממולאים — בטקסט רגיל עם קו תחתון מנוקד. מילים לועזיות ומספרים בתוך `<bdi>`. |
| 3 השניות הראשונות | תווית "3 השניות הראשונות:" + `visual_direction_he` (`small`, `--color-text-2`) |
| למה זה עובד | תווית "למה זה עובד:" + `why_it_works_he` (של הסוג, מ-`hook_types`). אם חסר — לא מוצג. |
| הערת פרסום | אייקון `ShieldAlert` + "שימו לב:" + `compliance_note_he`, ברקע `--color-surface-2` |
| סרטון לדוגמה | `VideoTile` 9:16 קטן (`sample_video_url`, פוסטר `sample_poster_url`), ניגון מושתק ב-hover או בפוקוס (דסקטופ) או בהקשה (מובייל), עם כתוביות |
| פעולות | §5.4 |
| מונים | "{n, plural, one {הועתק פעם אחת} two {הועתק פעמיים} other {הועתק # פעמים}}" רק כש-`copies_count ≥ 10`; "{n, plural, one {נוצר סרטון אחד} two {נוצרו שני סרטונים} other {נוצרו # סרטונים}}" רק כש-`generations_count ≥ 5`. בלי מונים מעוגלים כלפי מעלה ובלי "פופולרי!" מומצא. |

**וריאנטים:**
- `library` — כל האזורים (עמודי ספרייה). זה שם הווריאנט המלא בחלק 01; אין וריאנט בשם `default`.
- `compact` — צ׳יפ סוג, צ׳יפ נישה, טקסט, העתקה ו-"צרו סרטון" (מרקיז, NicheShowcase, הוקים דומים).
- `featured` — "הוק היום": טקסט בגודל `h3`, רקע עם זוהר עדין, כל האזורים.

**נגישות:** הכרטיס הוא `<article aria-labelledby>` עם כותרת מוסתרת ויזואלית "הוק מסוג {hook_type_name_he} ל{niche_short_name_he}" (בהוק כללי: "הוק מסוג {hook_type_name_he} לכל עסק"). סדר הטאב: שמירה → העתקה → צרו סרטון → וריאציות → וואטסאפ → העתקת קישור. כל כפתור אייקון עם `aria-label` בעברית.

### §5.3 התאמה אישית (`HookPersonalizer`)

- פס מעל רשימת ההוקים, בכל עמודי הספרייה:
  - כותרת: **"התאימו את ההוקים לעסק שלכם"**
  - שדות בשורה אחת (בעמודה אחת במובייל): `שם_העסק` (placeholder: "למשל: סטודיו ליה"), `עיר` (placeholder: "למשל: רמת גן"), `שירות` (placeholder: "למשל: הסרת שיער בלייזר").
  - קישור: **"עוד שדות"** פותח שדה לכל placeholder אחר מתוך 17 ה-placeholders שמותרים בהוקים (`HOOK_PLACEHOLDERS`, חלק 05 §8.2) שמופיע בהוקים שבעמוד: `שכונה`, `מוצר`, `מחיר`, `סכום`, `מספר`, `זמן`, `חודש`, `קהל_יעד`, `פעולה_שגויה`, `מיתוס`, `לפני`, `אחרי`, `הנחה`, `בעיה`.
  - **תוויות השדות** הן השאלות של `wizard.facts.q.{name}` (מקור אחד לאתר ולאשף; למשל `עיר` ← "באיזו עיר העסק?", `מחיר` ← "מה המחיר? (₪)", `פעולה_שגויה` ← "איזו טעות נפוצה עושים הלקוחות שלכם?"). אין קו תחתון ואין שם טכני בממשק.
  - הערת פרטיות מתחת: **"נשמר רק בדפדפן שלכם. לא נשלח אלינו."**
  - כפתור: **"ניקוי"**.
- כל הקלדה מעדכנת את כל הכרטיסים בעמוד מיד (state משותף ב-context, ללא רינדור מחדש של הרשימה כולה). המילוי עובר דרך `lib/hebrew/placeholders.ts`, כולל כללי הצירוף: "ב{עיר}" עם "השרון" → "בשרון"; "ב{עיר}" עם "תל אביב" → "בתל אביב"; ספרות אחרי אות שימוש מקבלות מקף ("ב-2026").
- הערכים נשמרים ב-`localStorage` במפתח `hook_personalize_v1` (`{ values: Record<PlaceholderName, string>, ts: number }`, try/catch; אם אין גישה — עובד רק לסשן). האפליקציה קוראת את אותו מפתח כדי למלא מראש את שם העסק והעיר באשף (חלק 03 §6.0). אלה שלושת המפתחות היחידים שהאתר שומר ב-`localStorage`: `hero_draft_v1`, `hook_personalize_v1`, `announcement.dismissed.{id}`.
- אירוע `hook_personalized {fields_count}` פעם אחת לסשן, אחרי 2 שניות בלי הקלדה.

### §5.4 פעולות והגבלת גישה

| פעולה | אורח | משתמש מחובר | אירוע אנליטיקה | ספירה בשרת |
|---|---|---|---|---|
| **העתקה** | חופשי | חופשי | `hook_copied {hook_id, niche, location}` | `POST /api/hooks/[id]/event {kind:"copy"}` |
| **צרו סרטון מההוק** | `SignupGateDialog` → הרשמה → `/app/create?hook={id}&src=hooks` | `/app/create?hook={id}&src=hooks` | `hook_create_video_clicked {hook_id}` | `{kind:"generate"}` |
| **5 וריאציות AI** | `SignupGateDialog` | `/app/hooks?source={id}&variations=1` (החיוב — קרדיט אחד, `hooks.generate` — רק כשלוחצים על "כתבו" בדיאלוג באפליקציה) | `hook_variations_requested {hook_id}` | — |
| **"כתבו לי הוקים"** (בלי הוק מקור, §5.5–§5.6) | `SignupGateDialog` | `/app/hooks?generate=1&niche={slug}&q={q}` (פותח את הדיאלוג במצב "הוקים חדשים"; קרדיט אחד לעד 10 הוקים, רק אחרי אישור באפליקציה) | `cta_clicked {location:"hooks_page_cta"}` | — |
| **שמירה** | `SignupGateDialog` | `POST /api/hooks/favorites {hookId, on}` | `hook_favorited {hook_id, on}` | — |
| **שליחה בוואטסאפ** | חופשי | חופשי | `hook_shared {hook_id, channel:"whatsapp"}` | `{kind:"share"}` |
| **העתקת קישור** | חופשי | חופשי | `hook_shared {hook_id, channel:"link"}` | `{kind:"share"}` |

- **העתקה:** מעתיקה את הטקסט **אחרי** ההתאמה האישית. placeholders שלא מולאו נשארים בסוגריים (`{עיר}`). טוסט (Sonner, `dir="rtl"`):
  - כשהכול מולא: **"ההוק הועתק"**
  - כשנשארו שדות: **"ההוק הועתק. נשארו למילוי: {fields}"** (למשל "עיר, שירות")
  - אם ה-Clipboard API נחסם: הטקסט מסומן בתיבה קטנה עם **"סמנו והעתיקו ידנית (Ctrl+C)"**.
- **וואטסאפ:** `https://wa.me/?text=` עם הטקסט המותאם, שתי שורות ריקות, ו-"עוד הוקים כאלה: https://{{DOMAIN}}/hooks/h/{id}".
- **העתקת קישור:** מעתיק `https://{{DOMAIN}}/hooks/h/{id}`; טוסט "הקישור הועתק".
- **`SignupGateDialog`** (Dialog של Radix, פוקוס לכפתור הראשי, Esc סוגר):

| הקשר | כותרת | גוף | כפתור ראשי | כפתור משני |
|---|---|---|---|---|
| צרו סרטון | עוד צעד אחד והסרטון בדרך | כדי להפוך את ההוק לסרטון צריך חשבון. ההרשמה בחינם ובלי כרטיס אשראי, ומקבלים {trialCredits} קרדיטים — מספיק בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים. ההוק שבחרתם יחכה לכם באשף. | הרשמה בחינם והמשך | אולי אחר כך |
| וריאציות | רוצים עוד גרסאות להוק הזה? | ה-AI יכתוב 5 וריאציות להוק, בלשון ובטון של העסק שלכם. צריך חשבון חינמי; זה עולה קרדיט אחד מתוך {trialCredits} קרדיטי הניסיון. | הרשמה בחינם והמשך | אולי אחר כך |
| שמירה | שמרו הוקים לאחר כך | עם חשבון חינמי אפשר לשמור הוקים, לחזור אליהם מכל מכשיר ולהפוך אותם לסרטון כשמתאים לכם. | הרשמה בחינם | אולי אחר כך |
| הוקים חדשים | רוצים הוקים שנכתבו בשביל העסק שלכם? | ה-AI יכתוב עד 10 הוקים חדשים לפי העסק, העיר והקהל שלכם. צריך חשבון חינמי; כתיבת 10 הוקים עולה קרדיט אחד מתוך {trialCredits} קרדיטי הניסיון. | הרשמה בחינם והמשך | אולי אחר כך |

  הכפתור הראשי מוביל ל-`/login?next={יעד מקודד}` ושולח `signup_started {source:"hooks_gate"}`. הטקסט שהגולש הקליד בחיפוש (`q`) עובר רק ב-URL כ-`topicHe` לאפליקציה, ולעולם לא נשלח לאנליטיקה.
- **הגבלת קצב:** `POST /api/hooks/[id]/event` מוגבל ל-60 בקשות בדקה לכתובת IP (bucket `hooks_event`, חלק 04 §18.6); כשל בספירה לא מוצג למשתמש ולא חוסם את ההעתקה.

### §5.5 האב הספרייה (`/hooks`)

**מבנה העמוד:**

1. Breadcrumbs: ראשי › ספריית הוקים
2. H1: **"ספריית ההוקים בעברית: משפטי פתיחה לסרטונים שעוצרים גלילה"**
3. פתיח: **"{count, plural, one {הוק אחד לעסקים ישראליים} two {שני הוקים לעסקים ישראליים} other {# הוקים לעסקים ישראליים}}, לפי נישה, סוג, פלטפורמה ועונה. מעתיקים בחינם, מתאימים לעסק שלכם בשנייה, ואם רוצים — הופכים לסרטון."**
4. שדה חיפוש גדול (תווית: "חיפוש בספרייה", placeholder: "חפשו לפי נישה, נושא או מילה, למשל: משכנתא"), ומתחתיו `HookPersonalizer`.
5. **"מה זה הוק?"** (`<details>` פתוח בדסקטופ, סגור במובייל): **"הוק הוא המשפט, התמונה או הרגע שפותחים את הסרטון ועוצרים את הגלילה. ברשתות מחליטים תוך שניות אם להמשיך לצפות, ולכן ההתחלה חשובה יותר מכל מה שבא אחריה. לפי פייסבוק ונילסן (2016), עד 47% מערך קמפיין וידאו נוצר כבר בשלוש השניות הראשונות. לכל הוק כאן מצורף גם מה רואים בשלוש השניות האלה, ולמה הוא עובד."** + קישור "לכל סוגי ההוקים ←".
6. `HookOfTheDay`.
7. `SeasonRail` — כותרת **"העונות הקרובות"**: 4 העונות הבאות לפי `starts_on`, כל אחת צ׳יפ "{name_he} · {תאריך קצר}" עם קישור לדף העונה. ימי שקט מוצגים אפורים, בלי קישור, עם התווית "יום שקט — לא מפרסמים". `knesset-elections-2026` לא מוצג.
8. **בלי חיפוש ובלי סינון** — סקשנים לגלישה:
   - **"לפי נישה"**: `NicheGrid` קומפקטי (אייקון, `short_name_he`, מספר הוקים), קישור לכל `/hooks/[niche]`.
   - **"לפי סוג הוק"**: 8 כרטיסי משפחה (`hook_families.name_he` + `description_he`), כל אחד עם הסוגים שלו כקישורים ל-`/hooks/types/[type]`.
   - **"הוקים מומלצים"**: 12 הוקים עם `is_featured`, מעורבבים מנישות שונות (סדר קבוע ליום, לפי seed של התאריך, כדי לא לשבור מטמון).
   - **"לפי פלטפורמה"**: צ׳יפים לדפי הפלטפורמות.
   - **"הוקים כלליים לכל עסק"**: 10 ההוקים האוניברסליים.
9. **עם חיפוש או סינון** — תצוגת תוצאות: פאנל `HookFilters` בצד ההתחלה (280px, דביק) בדסקטופ; בראש הרשימה: **"{total, plural, =0 {לא נמצאו הוקים} one {הוק אחד} two {שני הוקים} other {# הוקים}}"** (`aria-live="polite"`), צ׳יפים של מסננים פעילים עם × לכל אחד ו-**"ניקוי הכול"**, ובורר מיון.
10. CTA בתחתית: כרטיס **"לא מצאתם הוק שמתאים בדיוק?"** · **"תנו ל-AI לכתוב 10 הוקים חדשים לעסק שלכם, בלשון ובטון הנכונים. עשרה הוקים עולים קרדיט אחד."** · כפתור **"כתבו לי הוקים"** (`/app/hooks?generate=1&q={q}`, ועם `&niche={slug}` כשיש מסנן נישה; לאורח — `SignupGateDialog` בהקשר "הוקים חדשים", §5.4).

**`HookFilters` — תוויות סופיות:**

| פאסט | תווית | ערכים |
|---|---|---|
| `niche` | נישה | combobox, "כל הנישות" + נישות פעילות |
| `type` | סוג הוק | רשימת בחירה יחידה מקובצת לפי משפחה, "כל הסוגים" |
| `platform` | פלטפורמה | "הכול" · רילס · טיקטוק · יוטיוב שורטס · פייסבוק · יוטיוב · סטטוס וואטסאפ |
| `goal` | מטרה | "הכול" · חשיפה · לידים · מכירות · אמון · מעורבות |
| `gender` | ניסוח | "הכול" · ניסוח ניטרלי · פנייה ברבים · לשון נקבה · לשון זכר |
| `season` | עונה | "בלי עונה מסוימת" + העונות (בלי ימי שקט ובחירות) |
| `featured` | מתג | רק מומלצים |
| `has_video` | מתג | עם סרטון לדוגמה |
| `sort` | מיון | פופולריים · חדשים · הכי הרבה סרטונים |

- ליד כל ערך — מספר התוצאות בסוגריים; ערך עם 0 מנוטרל (`aria-disabled`) ולא מוסתר.
- מובייל: כפתור **"סינון ומיון"** עם תג מספר המסננים הפעילים, פותח Sheet מלמטה; בתחתיתו **"{n, plural, =0 {אין הוקים להצגה} one {הצגת הוק אחד} two {הצגת שני הוקים} other {הצגת # הוקים}}"** ו-**"ניקוי"**.
- כל שינוי מסנן מעדכן את ה-URL (`router.replace`, בלי גלילה), שולח `hooks_filtered {facet, value}` (`value` = ערך enum או slug בלבד) ומחזיר פוקוס למסנן שהשתנה. הבקשה עצמה עוברת דרך `GET /api/hooks/search` (§5.1).
- חיפוש: debounce של 250ms, מינימום 2 תווים; שולח `hooks_searched {q_length, results, location:"hub"}` (בלי טקסט החיפוש עצמו; בעמוד `/hooks/[niche]` — `location:"hook_niche_page"`).
- דפדוף: 24 הוקים לעמוד, כפתור **"עוד הוקים"** בתחתית; אחרי טעינה — הכרזה ב-`aria-live`: "{n, plural, one {נטען עוד הוק אחד} two {נטענו עוד שני הוקים} other {נטענו עוד # הוקים}}", והפוקוס עובר לכרטיס הראשון החדש.

**"הוק היום" (`HookOfTheDay`):**
- נבחר על ידי `/api/cron/hook-of-the-day` (22:02 UTC, חלק 04 §23) ונשמר ב-`app_settings.hook_of_the_day` (`{ "hook_id": "…", "date": "2026-10-14", "history": [{ "hook_id": "…", "date": "…" }] }`, `history` = 60 הבחירות האחרונות), ואחריו `revalidateTag('hooks:hotd', "max")`.
- כלל הבחירה (המימוש בחלק 04 §23): בחירת הוק **להיום** (`todayIL()` בזמן הריצה; ה-cron `2 22 * * *` UTC רץ אחרי חצות שעון ישראל): הוק מפורסם מנישה פעילה שלא מופיע ב-`history`; עדיפות להוק של עונה שתחילתה בתוך `promo_lead_days`, ואחר כך להוקים עם `is_featured`. ביום שקט ה-cron בוחר רק הוק אוניברסלי לא שיווקי **ממשפחת** `education` (`hook_types.family_slug = 'education'`), אבל האתר לא מציג אותו: הכרטיס מציג רק **"היום לא מפרסמים. נחזור מחר עם הוק חדש."**
- הכרטיס: eyebrow **"הוק היום · {יום בשבוע}, {תאריך}"** (למשל "הוק היום · יום ד׳, 14 באוקטובר"), `HookCard` בווריאנט `featured`, וקישור **"להוקים נוספים ל{short_name_he} ←"**.

**מצבים ריקים ושגיאות:**

| מצב | כותרת | גוף | פעולות |
|---|---|---|---|
| אין תוצאות | לא מצאנו הוק כזה | נסו מילה אחרת, הסירו מסנן, או תנו ל-AI לכתוב לכם 10 הוקים חדשים לעסק שלכם. | "ניקוי הסינון" · "כתבו לי הוקים" (`/app/hooks?generate=1&q={q}`, §5.4) |
| שגיאת חיפוש | החיפוש לא עבד הפעם | זו תקלה אצלנו. נסו שוב בעוד רגע. | "ניסיון נוסף" |
| נישה בלי הוקים | עוד לא פרסמנו הוקים לנישה הזו | בינתיים, אלה הוקים כלליים שמתאימים לכל עסק. | (רשימת האוניברסליים) |
| טעינה | (שלד בצורת הכרטיסים הסופיים, 6 כרטיסים) | — | — |

### §5.6 עמוד הוקים לנישה (`/hooks/[niche]`) ולצירוף נישה × סוג (`/hooks/[niche]/[type]`)

**`/hooks/[niche]`** — נכס ה-SEO המרכזי. **אינדוקס** רק כשמתקיימים כל התנאים: `niches.is_active`, `seo_reviewed_at` מלא, `seo_intro_he` של 150 מילים לפחות, ולפחות 8 הוקים מפורסמים לנישה; אחרת `noindex,follow` ו-canonical ל-`/hooks`. עם ה-seed של ההשקה ל-22 נישות יש 10–11 הוקים, ול-13 נישות (למשל `event-venues`, `auto-services`, `nonprofits`) יש 5 בלבד, ולכן הן `noindex` עד שיתווספו הוקים — זה מכוון.

1. Breadcrumbs: ראשי › ספריית הוקים › {short_name_he}
2. H1: **"הוקים לסרטונים ל{short_name_he} – {count, plural, one {משפט פתיחה אחד} two {שני משפטי פתיחה} other {# משפטי פתיחה}} ({year})"** (`year` = השנה הנוכחית לפי `Asia/Jerusalem`, מתעדכנת ב-revalidate)
3. `seo_intro_he` (במובייל: 3 שורות ראשונות ואז "להמשך קריאה", כפתור שפותח — הטקסט כולו ב-HTML מההתחלה)
4. `HookPersonalizer`
5. מסננים מקוצרים (סוג, פלטפורמה, מטרה, ניסוח) — אותו רכיב, בלי פאסט נישה
6. **תצוגה ברירת מחדל:** הוקים מקובצים לפי משפחה, כל קבוצה עם `<h2>` של `hook_families.name_he` ומספר ההוקים; משפחה ריקה לא מוצגת. עם סינון — רשימה שטוחה.
7. H2 **"3 תסריטים לדוגמה ל{short_name_he}"** — `SampleScripts` (§4.3)
8. H2 **"הוקים עונתיים ל{short_name_he}"** — הוקים עם `season_slug` של הנישה, ועוד הוקים עונתיים כלליים של עונות שהנישה נמצאת ב-`niche_slugs` שלהן; מוצג רק אם יש לפחות 2.
9. H2 **"הוקים כלליים שמתאימים גם ל{short_name_he}"** — 4 הוקים אוניברסליים
10. תיבת כללי פרסום (אם יש `compliance_note_he`) — כמו בדף הנישה
11. H2 **"שאלות על הוקים ל{short_name_he}"** — 4 שאלות בתבנית (שונות מהשאלות בדף הנישה, כדי למנוע כפילות תוכן):

| שאלה | תשובה |
|---|---|
| אפשר להשתמש בהוקים האלה בחינם? | כן. מותר להעתיק כל הוק מהספרייה ולהשתמש בו בסרטונים ובפוסטים של העסק שלכם, גם בפרסום ממומן. לא צריך הרשמה כדי להעתיק. הרשמה נדרשת רק כדי להפוך הוק לסרטון או לקבל וריאציות חדשות. |
| איך מתאימים הוק לעסק שלי? | כתבו את שם העסק ואת העיר בשדות "התאימו את ההוקים לעסק שלכם" בראש העמוד, וכל ההוקים יתעדכנו. אחר כך החליפו כל מספר בנתון אמיתי שלכם, ושנו מילה או שתיים כדי שזה יישמע כמוכם. הוק טוב קצר: עד 12 מילים בקריינות ועד 8 מילים על המסך. |
| מה זה "3 השניות הראשונות"? | לכל הוק מצורף תיאור של הפתיחה הוויזואלית: מה רואים על המסך לפני שמישהו מחליט אם לגלול. התנועה מתחילה מהפריים הראשון, והטקסט מופיע על המסך מיד, כי הרבה צופים גוללים בלי סאונד. |
| כמה הוקים כדאי לנסות? | שלושה. מכינים את אותו סרטון עם שלושה הוקים שונים, מפרסמים, ובודקים איזה מהם החזיק את הצופים הכי הרבה זמן. ב{{BRAND_NAME}} אפשר ליצור כמה גרסאות הוק לאותו סרטון, לפי התוכנית. |

12. H2 **"הוקים לנישות קרובות"** — עד 6 נישות מאותה קטגוריה, עם מספר ההוקים
13. כרטיס CTA: **"רוצים 10 הוקים חדשים שנכתבו רק לעסק שלכם?"** · **"ה-AI כותב הוקים לפי השירותים, העיר והקהל שלכם, בלשון הנכונה ובטון שלכם. ההרשמה בחינם, ועשרה הוקים עולים קרדיט אחד."** · כפתור **"כתבו לי הוקים"** (`/app/hooks?generate=1&niche={slug}`; לאורח — `SignupGateDialog`, §5.4; `cta_clicked {location:"hooks_page_cta"}`) · קישור **"סרטון תדמית ל{short_name_he} ←"** (`/niches/[niche]`)

JSON-LD: `BreadcrumbList`, `ItemList` (כל הוק כ-`ListItem` עם `name` = הטקסט ו-`url` = `/hooks/[niche]#{id}`; לכל כרטיס `id={hook.id}` כעוגן), `FAQPage`.
אירועים: `hook_copied {hook_id, niche, location:"hook_niche_page"}`, `hooks_searched {…, location:"hook_niche_page"}`, `hooks_filtered`, `faq_expanded {question_id, location:"hook_niche_page"}`.

**`/hooks/[niche]/[type]`:**
- נבנה רק לצירופים שיש להם הוק אחד לפחות (ראשי או `secondary_type_slug`). צירוף בלי הוקים → 404.
- Breadcrumbs: ראשי › ספריית הוקים › {short_name_he} › {type.name_he}
- H1: **"הוקים מסוג {type.name_he} ל{short_name_he}"**
- פתיח: אם קיים `content/seo/niche-types/{niche}--{type}.mdx` — הוא; אחרת שתי שורות מ-`type.description_he` + "ריכזנו כאן את ההוקים מהסוג הזה ל{short_name_he}."
- רשימת ההוקים · H2 **"הוקים מסוג {type.name_he} בנישות אחרות"** (6) · קישורים ל-`/hooks/types/[type]` ול-`/hooks/[niche]`.
- **אינדוקס:** רק אם יש **לפחות 8 הוקים וקובץ פתיח ייחודי**. אחרת `noindex,follow` ו-canonical ל-`/hooks/[niche]`. עם ה-seed של ההשקה (5–11 הוקים לנישה, פזורים על כמה סוגים) אף צירוף לא עומד בתנאי, ולכן כולם `noindex` עד שהספרייה תגדל — זה מכוון.

### §5.7 סוגי הוקים (`/hooks/types`, `/hooks/types/[type]`)

**`/hooks/types`:**
- H1: **"סוגי הוקים"**
- פתיח: **"יש {count, plural, one {דרך עיקרית אחת} two {שתי דרכים עיקריות} other {# דרכים עיקריות}} לפתוח סרטון, בשמונה משפחות: מסקרנות ואזהרות, דרך הזדהות והוכחה, ועד הצעות שמזמינות לפעול. הכירו אותן, ותדעו לבחור את ההוק הנכון לכל סרטון."**
- לכל משפחה: `<h2>` (`hook_families.name_he`), שורת `description_he`, וכרטיס לכל סוג: `name_he`, `description_he`, דוגמה (`example_he` בתוך `blockquote`), **"{n, plural, one {הוק אחד בספרייה} two {שני הוקים בספרייה} other {# הוקים בספרייה}}"**, קישור **"מה זה ואיך כותבים ←"**.
- מטא: title **"סוגי הוקים: {count, plural, one {דרך אחת} two {שתי דרכים} other {# דרכים}} לפתוח סרטון שעוצר גלילה"**; description **"מדריך לכל סוגי ההוקים לרילס ולטיקטוק: סקרנות, אזהרה, POV, לפני ואחרי, ניפוץ מיתוס ועוד. עם דוגמאות בעברית לכל סוג."**

**`/hooks/types/[type]`:**
- H1: `h1` מה-frontmatter של `content/seo/hook-types/{slug}.mdx`, **חובה לכל סוג** (בדיקת CI ב-`scripts/check-content.ts` נכשלת על סוג בלי `h1`). כך שמות סוגים עם "/" או "X" ב-seed (למשל "לפני / אחרי", "X טעויות") לא נכנסים לכותרת כמו שהם. התבנית **"הוק {name_he}: מה זה ואיך כותבים הוק כזה"** היא ברירת מחדל לסביבת פיתוח בלבד. דוגמאות: `pov` → "הוק POV: מה זה ואיך כותבים הוק כזה"; `stop-doing` → "הוק "תפסיקו לעשות": מה זה ואיך כותבים הוק כזה".
- תוכן מ-`content/seo/hook-types/{slug}.mdx` (חובה לכל סוג לפני השקה, 250–500 מילים), עם הסקשנים: **מה זה** · **למה זה עובד** · **נוסחאות** · **טעויות נפוצות** · **איך כותבים, צעד אחר צעד**.
- סקשנים אוטומטיים: H2 **"דוגמאות מהספרייה"** (6 הוקים מנישות שונות, מומלצים קודם) · H2 **"באילו נישות זה עובד"** (6 הנישות עם הכי הרבה הוקים מהסוג, כקישורים ל-`/hooks/[niche]/[type]`) · H2 **"סוגים קרובים"** (שאר הסוגים באותה משפחה).
- JSON-LD: `BreadcrumbList`, `HowTo` (מהצעדים ב-frontmatter).

```mdx
---
# content/seo/hook-types/pov.mdx — דוגמה מלאה
title: "הוק POV: מה זה ואיך כותבים הוק כזה (עם דוגמאות)"
description: "הוק POV מכניס את הצופה לתוך הסיטואציה. ככה כותבים הוק כזה לעסק: נוסחאות, דוגמאות בעברית וטעויות שכדאי להימנע מהן."
h1: "הוק POV: מה זה ואיך כותבים הוק כזה"
howto:                                   # אותם צעדים כמו בסקשן "איך כותבים, צעד אחר צעד", בתמצית (בדיקת build: אותו מספר צעדים)
  - "בחרו רגע אחד שהלקוחות שלכם חווים רגע לפני שהם מגיעים אליכם, או מיד אחרי."
  - "כתבו אותו בגוף שני רבים, בזמן הווה או בעבר הקרוב, בלי לספר מי אתם."
  - "הוסיפו פרט ספציפי או טוויסט קטן בסוף המשפט."
  - "צלמו מגובה העיניים של הצופה, עם תנועה כבר מהפריים הראשון."
  - "קראו את ההוק בקול, וקצרו אם צריך לנשום באמצע."
---

## מה זה

POV הוא קיצור של Point of View, נקודת מבט. בהוק כזה הצופה לא מסתכל על הסיטואציה מהצד, הוא נמצא בתוכה: "POV: סוף סוף מצאתם דירה עם מרפסת שמש – וגם חנייה". המשפט מתאר רגע שהצופה מכיר או רוצה לחוות, והצילום מראה אותו מגובה העיניים שלו.

## למה זה עובד

כי אנחנו עוצרים על מה שמזכיר לנו את עצמנו. ההזדהות מגיעה לפני שהמוח מספיק לסווג את הסרטון כפרסומת. ובטיקטוק וברילס הפורמט כבר מוכר, כך שהצופה יודע מה הוא הולך לקבל ונשאר לראות איך זה נגמר.

## נוסחאות

1. **POV: <Placeholder name="רגע מוכר מהחיים של הלקוח" />** — "POV: הספר הקבוע שלכם בחופש, ואתם אצל מישהו חדש"
2. **POV: <Placeholder name="הבטחה שהתקיימה" />** — "POV: מצאתם סוף סוף <Placeholder name="שירות" /> ב<Placeholder name="עיר" />, ועונים לכם בוואטסאפ תוך 5 דקות"
3. **POV: <Placeholder name="ציפייה" />, ו<Placeholder name="מה שקרה בפועל" />** — "POV: הזמנתם "רק משהו קטן", והשף החליט אחרת"

## טעויות נפוצות

- לכתוב POV על משהו שקורה לכם ולא לצופה ("POV: אני בעל העסק"). הצופה צריך להיות בתוך הרגע.
- לצלם מהצד. הוק POV מצולם מנקודת המבט של מי שחווה את הרגע.
- להאריך. הוק POV טוב נגמר עד 12 מילים, והטוויסט מגיע בסוף.
- להבטיח משהו שלא נכון. אם כתוב "עונים תוך 5 דקות", זה צריך להיות נכון אצלכם.

## איך כותבים, צעד אחר צעד

1. בחרו רגע אחד שהלקוחות שלכם חווים רגע לפני שהם מגיעים אליכם, או מיד אחרי. לא תהליך שלם, רגע אחד.
2. כתבו אותו בגוף שני רבים, בזמן הווה או בעבר הקרוב, בלי לספר מי אתם. "POV: נכנסתם לדירה ו…" עובד יותר טוב מ"POV: אני מתווכת ו…".
3. הוסיפו פרט ספציפי או טוויסט קטן בסוף המשפט, משהו שרק מי שעבר את זה מזהה.
4. תכננו את הצילום: מגובה העיניים של הצופה, עם תנועה כבר מהפריים הראשון, והמשפט על המסך מיד.
5. קראו את ההוק בקול. אם צריך לנשום באמצע, הוא ארוך מדי.
```

### §5.8 עמוד עונה (`/hooks/season/[season]`)

- נבנה לכל עונה ב-`seasons` **חוץ מ**ימי שקט (`is_quiet_day = true`) ומ-`knesset-elections-2026`; לאלה הנתיב מחזיר 404 ואין אליהם קישור.
- Breadcrumbs: ראשי › ספריית הוקים › עונות › {name_he}
- H1: `h1` מה-frontmatter של `content/seo/seasons/{slug}.mdx`, **חובה לכל עונה שנבנה לה עמוד** (בדיקת CI ב-`scripts/check-content.ts`), כי שמות העונות ב-seed לא בנויים להצמדת ל (אחרת יוצא "הוקים ללפני פסח: ניקיונות ושיפוצים"). האסימון `{year}` בתוך ה-`h1` מוחלף בשנה של `starts_on` (או בשנה הנוכחית אם חסר). דוגמאות: "הוקים לניקיונות ושיפוצים לפני פסח", "הוקים לשנה האזרחית החדשה", "הוקים ליום הרווקים 11.11", "הוקים לתקופה שאחרי החגים", "הוקים לוולנטיין". התבנית "הוקים ל{name_he} {year}" דרך `withPrefix("ל", name)` מ-`lib/hebrew/text.ts` (שם שמתחיל בספרה או באות לטינית מקבל מקף) היא ברירת מחדל לסביבת פיתוח בלבד.
- תיבת מועדים: **"מתי: {starts_on}–{ends_on}"** (פורמט `he-IL`, למשל "27–30 בנובמבר 2026") · **"מתי לפרסם: {publish_window_he}"**. אם `starts_on` ריק — `date_hint_he` עם התווית **"מועד משוער"**. ספירה לאחור בצד לקוח: **"{n, plural, one {עוד יום אחד} two {עוד יומיים} other {עוד # ימים}}"** / **"העונה בעיצומה"** / **"העונה הסתיימה. נחזור אליה בשנה הבאה."**
- פתיח מ-`content/seo/seasons/{slug}.mdx` (150–300 מילים).
- H2 **"הוקים לעונה הזו"** — הוקים עם `season_slug` = העונה.
- H2 **"נישות שהעונה הזו חשובה להן"** — לכל נישה ב-`niche_slugs`: שם, השורות הרלוונטיות מ-`seasonal_angles_he`, 2 הוקים מומלצים של הנישה, וקישור **"לכל ההוקים ל{short_name_he}"**.
- אזהרת יום שקט: אם חלון הפרסום חופף ליום שקט — **"שימו לב: {date} הוא {quiet.name_he}. ביום הזה לא מפרסמים תוכן שיווקי."**
- CTA: **"צרו סרטון לעונה הזו"** → `/app/create?hook={ההוק העונתי הראשון}&season={slug}&src=hooks`.
- **אינדוקס:** אם יש קובץ פתיח, ובסך הכול (הוקים עונתיים + הוקים מוצגים בנישות) לפחות 8 הוקים. אחרת `noindex,follow` (מנגנון "תוכן עבה", §12.2).
- דוגמה מלאה — `content/seo/seasons/black-friday.mdx` (ב-frontmatter: `h1: "הוקים לבלאק פריידיי {year}"`):

> בלאק פריידיי כבר מזמן לא יום אחד. בישראל הוא נמתח על כל נובמבר, ובשבוע שלפני היום עצמו הפיד מתמלא במבצעים שנראים בדיוק אותו דבר. כדי לבלוט, ההוק צריך לעשות משהו אחר מ"עד 50% הנחה": לחשוף, להזהיר, להבטיח משהו ספציפי או לשבור את הציפייה.
>
> ריכזנו כאן הוקים לחנויות אונליין ולחנויות פיזיות, למכוני יופי ולקליניקות, למאמני כושר ולסוחרי רכב — הנישות שהעונה הזו הכי חשובה להן. לכל הוק מצורף מה רואים בשלוש השניות הראשונות, כדי שהסרטון ייראה מוכן גם בלי סאונד.
>
> שני כללים לפני שמתחילים: הנחה מציגים רק אם היא אמיתית ביחס למחיר שהיה לפני המבצע, ו"נשארו X יחידות" כותבים רק אם זה נכון באותו רגע. כך מוכרים בבלאק פריידיי בלי לסכן את האמון של הלקוחות, ובלי להסתבך עם חוק הגנת הצרכן.

### §5.9 עמוד פלטפורמה (`/hooks/platform/[platform]`)

- נבנה לכל ערך של `platform` שיש לו הוק אחד לפחות (`linkedin` לא נבנה בהשקה).
- H1: **"הוקים ל{platform_he} לעסקים"** (התווית "אחרי האות ל" מ-§1.2: "הוקים לרילס לעסקים", "הוקים לסטטוס בוואטסאפ לעסקים").
- פתיח מ-`content/seo/platforms/{platform}.mdx`; הוקים מקובצים לפי קטגוריית נישה (עד 4 לכל קטגוריה, מומלצים קודם) + "לכל ההוקים ל{platform_he} ←" (`/hooks?platform=…`, noindex); CTA **"צרו סרטון ל{platform_he}"**.
- **אינדוקס:** רק כשיש לפחות 12 הוקים לפלטפורמה. בהשקה: `reels`, `tiktok`, `shorts`, `facebook` מאונדקסים; `youtube` ו-`whatsapp` — `noindex,follow` עד שיגיעו ל-12.
- **הפתיחים (נוסח סופי):**

`reels.mdx`:
> ברילס יש לכם שנייה, אולי שתיים, לפני שהאגודל ממשיך לגלול. לכן ההוקים כאן נכתבו לעבוד גם בלי סאונד: משפט קצר שמופיע על המסך מהפריים הראשון, ותמונה שכבר זזה. לעסק מקומי, רילס הוא הדרך הכי ישירה להגיע לאנשים שעוד לא עוקבים אחריכם — שכנים, לקוחות של מתחרים, ומי שמחפש בדיוק את מה שאתם עושים. כל הוק כאן אפשר להפוך לרילס אנכי 9:16 עם קריינות וכתוביות בעברית, ולצרף אליו טקסט מוכן לפוסט.

`tiktok.mdx`:
> בטיקטוק הקהל מחפש אנשים, לא מודעות. ההוקים שעובדים כאן נשמעים כמו מישהו שמדבר אליכם: POV, דעה לא פופולרית, אתגר או סיפור שנפתח באמצע. ריכזנו הוקים לעסקים שרוצים להיראות אמיתיים בטיקטוק, בלי לרקוד ובלי להתחפש. טיפ אחד: כתבו את ההוק גם על המסך וגם בקריינות, כי חלק גדול מהצופים מתחילים לצפות בלי סאונד.

`shorts.mdx`:
> יוטיוב שורטס הוא המקום שבו סרטון קצר ממשיך לעבוד גם שבועות אחרי הפרסום, כי אנשים מגיעים אליו גם מחיפוש. לכן כאן עובדים במיוחד הוקים של ערך: "3 דברים לבדוק", "כמה באמת עולה", "ככה עושים את זה נכון". כל הוק בעמוד הזה אפשר להפוך לסרטון אנכי עם כתוביות בעברית, ולהעלות את אותו סרטון גם לרילס ולטיקטוק.

`facebook.mdx`:
> בפייסבוק הקהל קצת יותר מבוגר, קורא יותר, ומשתף בקבוצות. הוקים שעובדים כאן פונים לקהל מוגדר ("עצמאים?", "גרים ב<Placeholder name="עיר" />?"), מציגים מספר או חשבון, או מספרים סיפור קצר. אם אתם מפרסמים בקבוצות השכונה, השתמשו בגרסת ה-1:1 של הסרטון, ושימו את ההוק גם בשורה הראשונה של הפוסט.

`youtube.mdx`:
> ביוטיוב הרגיל, סרטון התדמית שלכם יושב לצד סרטונים ארוכים, ולכן ההוק צריך להבטיח ערך ברור כבר בכותרת ובשניות הראשונות. ההוקים כאן מתאימים לסרטוני 16:9 לאתר ולערוץ: הסבר, השוואה, הדגמה וסיפור של העסק. כל סרטון מגיע עם קובץ כתוביות שאפשר להעלות ליוטיוב, וזה טוב גם לצופים וגם לנגישות.

`whatsapp.mdx`:
> הסטטוס בוואטסאפ מגיע לאנשים שכבר שמרו את המספר שלכם: לקוחות קבועים, שכנים ומי שפנה פעם. זה קהל חם, ולכן הוקים של מבצע, עדכון או "נפתחה ההרשמה" עובדים כאן במיוחד. שמרו על סרטון קצר, אנכי, עם טקסט גדול ובלי הרבה מילים. וההנעה לפעולה כמעט כותבת את עצמה: "השיבו לסטטוס הזה".

### §5.10 הוק בודד (`/hooks/h/[id]`)

- יעד שיתוף בוואטסאפ ובקישורים. **`noindex`**, ו-canonical ל-`/hooks/[niche]` (להוק אוניברסלי: `/hooks`; להוק עונתי: `/hooks/season/[season]`).
- Breadcrumbs: ראשי › ספריית הוקים › {short_name_he או "הוקים כלליים" או שם העונה} › הוק
- Eyebrow: **"הוק מסוג {hook_type_name_he}"**; H1 = טקסט ההוק (עם `PlaceholderChip`; ההתאמה האישית מעדכנת את הטקסט הגלוי).
- `HookPersonalizer` (רק השדות שבהוק), צ׳יפים, **"3 השניות הראשונות"**, **"למה זה עובד"**, הערת פרסום, סרטון לדוגמה, וכל הפעולות.
- H2 **"איך הופכים את ההוק לסרטון"**: (1) "ממלאים את הפרטים של העסק", (2) "מקבלים תסריט שמתחיל בהוק הזה, ובוחרים קול וסגנון", (3) "מאשרים את העלות ומקבלים סרטון ב-3 פורמטים". כפתור **"צרו סרטון מההוק"**.
- H2 **"הוקים דומים"**: 3 מאותה נישה בסוג אחר + 3 מאותו סוג בנישות אחרות (`compact`).
- תמונת OG ייעודית עם טקסט ההוק (§12.5), כדי שהשיתוף בוואטסאפ ייראה טוב.

### §5.11 כותרות ותיאורים לעמודי הספרייה

כלל אורך: עד 60 תווים לכותרת ועד 155 לתיאור, כולל ערכים מוזרקים. אם הכותרת ארוכה מדי — מסירים את " | {{BRAND_NAME}}"; אם עדיין ארוכה — עוברים לתבנית החלופית. מימוש ב-`lib/seo/metadata.ts#buildTitle()`, עם בדיקת יחידה על כל הנישות, הסוגים, העונות והפלטפורמות מה-seed.

| עמוד | `<title>` | חלופה קצרה | `description` |
|---|---|---|---|
| `/hooks` | ספריית הוקים בעברית: משפטי פתיחה לרילס \| {{BRAND_NAME}} | ספריית הוקים בעברית לרילס ולטיקטוק | {count, plural, one {הוק אחד בעברית} two {שני הוקים בעברית} other {# הוקים בעברית}} לפי נישה, סוג ועונה. מעתיקים בחינם, מתאימים לעסק שלכם בשנייה, והופכים כל הוק לסרטון. |
| `/hooks/[niche]` | הוקים ל{short}: {count, plural, one {משפט פתיחה אחד} two {שני משפטי פתיחה} other {# משפטי פתיחה}} ({year}) | הוקים ל{short} ({year}) | {count, plural, one {הוק אחד} two {שני הוקים} other {# הוקים}} ל{short} לרילס, לטיקטוק ולפייסבוק, עם מה שרואים ב-3 השניות הראשונות ולמה זה עובד. מעתיקים בחינם. |
| `/hooks/[niche]/[type]` | הוקים מסוג {type} ל{short} \| {{BRAND_NAME}} | הוקים מסוג {type} ל{short} | הוקים מסוג {type} ל{short}, עם דוגמאות בעברית, פתיחה ויזואלית והסבר קצר. |
| `/hooks/types` | סוגי הוקים: {count, plural, one {דרך אחת} two {שתי דרכים} other {# דרכים}} לפתוח סרטון | סוגי הוקים לרילס ולטיקטוק | (ראו §5.7) |
| `/hooks/types/[type]` | `title` מה-frontmatter (חובה, CI) | `h1` מה-frontmatter (חובה, CI) | `description` מה-frontmatter (חובה, CI) |
| `/hooks/season/[season]` | {seasonH1}: משפטי פתיחה לעסקים | {seasonH1} | {seasonH1} לעסקים: משפטי פתיחה בעברית לרילס ולטיקטוק, לפי נישה, עם מתי כדאי לפרסם. (`{seasonH1}` = ה-`h1` מה-frontmatter, §5.8) |
| `/hooks/platform/[platform]` | הוקים ל{platform} לעסקים: משפטי פתיחה בעברית | הוקים ל{platform} לעסקים | הוקים ל{platform} לעסקים ישראליים, לפי נישה, עם פתיחה ויזואלית והסבר. מעתיקים בחינם והופכים לסרטון. |
| `/hooks/h/[id]` | {text עד 45 תווים}… \| הוק מסוג {type} | {text עד 55 תווים}… | {text}. {type.description_he קצר} |

**קריטריוני קבלה**
- [ ] אורח מעתיק הוק, ההעתקה כוללת את ההתאמה האישית, נשלח `hook_copied`, ו-`copies_count` עולה (אחרי רענון הפופולריות).
- [ ] "צרו סרטון מההוק" לאורח פותח את `SignupGateDialog`; אחרי הרשמה המשתמש מגיע ל-`/app/create?hook={id}&src=hooks` עם ההוק בחור.
- [ ] כל URL עם פרמטר סינון מחזיר `noindex,follow` ו-canonical לבסיס (בדיקת Playwright על 5 צירופים).
- [ ] `/hooks/[niche]/[type]` עם פחות מ-8 הוקים → `noindex` + canonical לעמוד הנישה; צירוף בלי הוקים → 404.
- [ ] `/hooks/[niche]` של נישה עם 5 הוקים, או בלי `seo_reviewed_at`, מחזיר `noindex,follow` עם canonical ל-`/hooks` ולא נכנס למפת האתר.
- [ ] `/hooks/season/memorial-day`, `/hooks/season/holocaust-memorial-day` ו-`/hooks/season/knesset-elections-2026` מחזירים 404.
- [ ] "הוק היום" מתחלף פעם ביום, לא חוזר על עצמו תוך 60 יום, ומציג את נוסח יום השקט ביום שקט (בדיקה עם תאריך מדומה).
- [ ] `buildTitle` מחזיר כותרת של עד 60 תווים לכל עמוד שנבנה מה-seed.
- [ ] `HookPersonalizer` תומך בכל 17 ה-placeholders של `HOOK_PLACEHOLDERS` (כולל `הנחה` ו-`בעיה` שמופיעים ב-seed), עם התוויות של `wizard.facts.q.*`, ושומר אותם ב-`hook_personalize_v1`.
- [ ] "כתבו לי הוקים" לאורח פותח את `SignupGateDialog` בהקשר "הוקים חדשים", ואחרי ההרשמה מגיע ל-`/app/hooks?generate=1&niche={slug}&q={q}` בלי חיוב.
- [ ] בעמוד הספרייה ובעמוד הוקים לנישה, החיפוש בצד השרת (RPC) ובצד הלקוח (`GET /api/hooks/search`) מחזירים אותן תוצאות לאותם פרמטרים (בדיקת אינטגרציה).
- [ ] TTFB של `/hooks/[niche]` מהמטמון < 300ms.
- [ ] ניווט מלא במקלדת בכל הפעולות של `HookCard`, וכל טוסט מוקרא בקורא מסך.

---

## §6. דוגמאות ותבניות

### §6.1 גלריית הדוגמאות (`/examples`)

- Breadcrumbs: ראשי › דוגמאות
- H1: **"דוגמאות לסרטונים שנוצרו ב{{BRAND_NAME}}"**
- פתיח: **"כל סרטון כאן יצא מהמערכת עצמה: תסריט, ויז׳ואלים, קריינות וכתוביות בעברית, בלי עריכה ידנית אחרי. סננו לפי נישה, פורמט או סוג סרטון, ולחצו על "צרו סרטון כזה" כדי להתחיל מאותה נקודה."**
- **מקור:** רק `examples` עם `is_published = true`. דוגמה שנוצרה לעסק בדוי מצוינת בכותרת שלה, למשל "רילס למספרה (עסק לדוגמה)". דוגמה של עסק אמיתי מתפרסמת רק באישור בכתב של העסק.
- **מסננים** (פרמטרים `?niche=&format=&type=`, כל צירוף `noindex,follow` עם canonical ל-`/examples`): "נישה" (combobox, רק נישות שיש להן דוגמאות) · "פורמט": אנכי 9:16 · ריבוע 1:1 · רוחבי 16:9 · "סוג סרטון": תוויות `video_type`.
- **גריד** מסונרי לפי יחס. באריח: פוסטר AVIF, `title_he`, צ׳יפ נישה, צ׳יפ סוג, משך (`Num`), אייקון יחס. ניגון מושתק ב-hover ובפוקוס בדסקטופ.
- **נגן:** לחיצה פותחת Dialog (דסקטופ) או Sheet (מובייל) עם `VideoPlayer` (כתוביות מ-`captions_vtt_path` פעילות כברירת מחדל, `srclang="he"`), כותרת, ואם יש `hook_id` — **"ההוק בסרטון:"** + הטקסט + קישור **"להוק בספרייה"**. כפתורים: **"צרו סרטון כזה"** (`/app/create?template={template_id}&src=template` אם יש, אחרת `/app/create?niche={niche_slug}&hook={hook_id}&src=hooks`) ו-**"סגירה"**. URL הדיאלוג: `?v={slug}` (מאפשר שיתוף; נסגר ב-Esc וחוזר לאריח).
- **מצב ריק** (אין דוגמאות מפורסמות): כותרת **"הדוגמאות האמיתיות הראשונות בדרך"**, גוף **"אנחנו מפרסמים כאן רק סרטונים שיצאו מהמערכת עצמה. בינתיים, אלה הדגמות (אנימטיק) שנבנו מתסריטים לדוגמה — כך נראה הסרטון לפני שנוצרים הוויז׳ואלים."** ומתחתיו חמשת סרטוני ההדגמה של נספח D באורך מלא (`public-media/demo/examples/`, עם נגן וכתוביות), כל אחד עם התג **"הדגמה (אנימטיק)"**. כפתור: **"צרו את הסרטון הראשון שלכם"**. גם כשיש דוגמאות אמיתיות, פריטי הדגמה שעדיין מוצגים נושאים את אותו תג.
- **מסנן ללא תוצאות:** **"אין עדיין דוגמה שמתאימה לסינון הזה."** + **"ניקוי הסינון"**.
- מטא: title **"דוגמאות לסרטוני תדמית ורילס בעברית | {{BRAND_NAME}}"**; description **"סרטוני תדמית ורילס שנוצרו ב{{BRAND_NAME}} לנישות שונות, עם קריינות וכתוביות בעברית. צפו, סננו לפי נישה ופורמט, וצרו סרטון כזה לעסק שלכם."**
- JSON-LD: `ItemList` של `VideoObject` (§12.4).
- אירועים: `example_played {example_id, location:"examples"}`, `cta_clicked {location:"examples_dialog"}`.

### §6.2 גלריית התבניות (`/templates`)

- Breadcrumbs: ראשי › תבניות
- H1: **"תבניות לסרטוני תדמית ורילס"**
- פתיח: **"כל תבנית היא מבנה שעובד: סדר הסצנות, האורך, הסגנון והמוזיקה. בוחרים תבנית, ממלאים את פרטי העסק, והתסריט נכתב בשבילכם — עם הוק שמתאים לנישה."**
- מסננים (צ׳יפים, בצד לקוח בלבד, בלי שינוי URL): "סוג סרטון" · "נישה" ("לכל הנישות" + נישות שיש להן תבניות) · "משך": 15 · 30 · 45 · 60 שניות · "פורמט".
- כרטיס תבנית: פוסטר (ניגון `preview_path` ב-hover), `name_he`, `description_he` (2 שורות), צ׳יפים: סוג סרטון, "{duration} שנ׳", יחס, תווית המבנה (§1.2), ושורה **"{n, plural, one {מקרדיט אחד} two {משני קרדיטים} other {מ-# קרדיטים}}"** (הערכה באיכות טיוטה לפי ברירות המחדל של התבנית, מ-`estimateSample` של חלק 05 עם ברירות המחדל של התבנית). כפתור: **"התחילו מהתבנית"** (`/app/create?template={id}&src=template`, `cta_clicked {location:"template_card"}`); קישור: **"פרטים ←"** (`/templates/[slug]`).
- מצב ריק: **"אין תבנית שמתאימה לסינון הזה. נסו משך או נישה אחרים, או התחילו מהוק."**
- מטא: title **"תבניות לסרטוני תדמית ורילס | {{BRAND_NAME}}"**; description **"תבניות מוכנות לסרטון תדמית, רילס עם הוק, מבצע, השקה וגיוס עובדים. בוחרים תבנית, ממלאים פרטים, ומקבלים סרטון בעברית."**

### §6.3 עמוד תבנית (`/templates/[slug]`)

1. Breadcrumbs: ראשי › תבניות › {name_he}
2. H1: `name_he`; פתיח: `description_he`
3. נגן תצוגה (`preview_path`, 9:16 או לפי `aspect_ratio`, עם כתוביות)
4. טבלת פרטים (`<dl>`): **סוג סרטון** · **משך** ("{n, plural, one {שנייה אחת} two {שתי שניות} other {# שניות}}") · **פורמט** · **מבנה** · **סגנון ויזואלי** · **סגנון כתוביות** (שם הפריסט) · **מוזיקה** (מצב רוח) · **ויז׳ואל** (תווית `visual_mix`)
5. H2 **"מבנה הסרטון"**: ציר אופקי (בתוך `dir="ltr"` כמו כל ציר זמן, עם תוויות עבריות) של `beat_plan` — לכל ביט: תווית התפקיד (§1.2), "{n} שנ׳", ו-`visual_idea_he`. במובייל — רשימה אנכית.
6. H2 **"הוקים שמתאימים לתבנית"**: 4 הוקים מסוג `default_hook_type_slug` (מנישת התבנית, או כלליים), בווריאנט `compact`.
7. H2 **"כמה זה עולה"**: שלוש שורות — טיוטה, סטנדרט ופרימיום — "≈ {n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}", מחושבות מ-`estimateSample` עם ברירות המחדל של התבנית; הערה: **"כל פורמט נוסף מוסיף 2–3 קרדיטים. העלות המדויקת מוצגת לפני היצירה."**
8. CTA: **"התחילו מהתבנית הזו"** (`/app/create?template={id}&src=template`, `cta_clicked {location:"template_page"}`); H2 **"תבניות נוספות"** (3 מאותו סוג סרטון).
- אירוע: `example_played {example_id, location:"template_page"}` לנגן התצוגה.
- מטא: title **"{name_he}: תבנית לסרטון ב{{BRAND_NAME}}"**; description: `description_he` מקוצר ל-155 תווים.
- JSON-LD: `BreadcrumbList`, `VideoObject` (אם יש תצוגה).

**קריטריוני קבלה**
- [ ] `/examples` לא מציג אף סרטון לקוח שאינו `is_published`; במצב ריק מוצגים חמשת סרטוני ההדגמה של נספח D, כל אחד עם התג "הדגמה (אנימטיק)".
- [ ] דיאלוג הנגן נפתח מ-`?v={slug}`, מלכד פוקוס, נסגר ב-Esc ומחזיר פוקוס לאריח.
- [ ] כל `VideoPlayer` בעמודים האלה כולל `<track kind="captions" srclang="he">`.
- [ ] השורה "מ-… קרדיטים" בכרטיס תבנית זהה לסכום `credits + alreadySpent` שהאשף מציג באישור היצירה לאותן ברירות מחדל (בדיקת יחידה מול `estimateSample`).
- [ ] עמודי התבניות נבנים סטטית לכל `templates.is_public`.

---

## §7. עמוד המחירים (`/pricing`)

### §7.1 ראש העמוד ובקרים

- H1: **"מחירים פשוטים, בשקלים"**
- פתיח: **"מתחילים בחינם, בלי כרטיס אשראי. משלמים בשקלים, מקבלים חשבונית מס, ומבטלים אונליין בכל רגע."**
- שלושה בקרים, בשורה אחת בדסקטופ ובשתי שורות במובייל:
  1. **לשוניות** (`Tabs`): **"מנוי חודשי"** | **"חבילות קרדיטים"**
  2. **`BillingCycleToggle`** (רק בלשונית המנוי, ורק כשהדגל `annual_billing` פעיל): **"חודשי"** / **"שנתי · חיסכון של 20%"**
  3. **`VatModeToggle`** (Switch): **"מחירים לעסקים (לפני מע״מ)"**. כשהוא פעיל מופיעה מעל הכרטיסים הודעה: **"המחירים מוצגים לפני מע״מ, לעסקים בלבד. החיוב בפועל כולל מע״מ בשיעור {vatPercent}%."**
- מצב הבקרים נשמר רק ב-URL (`?cycle=annual&vat=excl`, `router.replace` בלי גלילה), כדי שקישור ששולחים ללקוח יציג את אותו מצב; הבקרים לא נשמרים ב-`localStorage`. ברירת מחדל: חודשי, כולל מע״מ. עם פרמטרים העמוד מקבל `noindex,follow` ו-canonical ל-`/pricing` (§12.2).
- אירוע: `pricing_viewed {location:"pricing_page"}` בטעינה.

### §7.2 כרטיסי התוכניות (`PricingCards`)

הנתונים מ-`plans` (רק `is_public`), לפי `sort_order`. המחיר תמיד מ-DB; הערכים כאן הם ערכי ה-seed.

| | `free` | `starter` | `business` | `agency` |
|---|---|---|---|---|
| שם | חינם | בסיס | עסק | סוכנות |
| `tagline_he` | לנסות בלי להתחייב | לעסק שמפרסם כל שבוע | לעסק שמפרסם כמה פעמים בשבוע | למנהלי סושיאל ולסוכנויות |
| באדג׳ | — | — | **מומלץ** (`is_highlighted`, מסגרת זהב) | — |
| חודשי (כולל מע״מ) | ₪0 | ₪119 | ₪289 | ₪990 |
| שנתי — לחודש (כולל מע״מ) | — | ₪95 | ₪231 | ₪792 |
| שנתי — חיוב שנתי (כולל מע״מ) | — | ₪1,140 | ₪2,772 | ₪9,504 |
| חודשי לפני מע״מ | ₪0 | ₪100.85 | ₪244.92 | ₪838.98 |
| שנתי לחודש לפני מע״מ | — | ₪80.51 | ₪195.76 | ₪671.19 |
| שורת "≈ סרטונים" | כ-2 סרטונים קצרים לניסיון, באיכות טיוטה, עם סימן מים | ≈ 8 סרטונים בחודש | ≈ 20 סרטונים בחודש | ≈ 66 סרטונים בחודש |
| כפתור | התחילו בחינם | בחרו בבסיס | בחרו בעסק | בחרו בסוכנות |

**תצוגת המחיר:**
- חודשי: מספר גדול (`Price`) **"₪119"** + שורה קטנה **"לחודש, כולל מע״מ"**.
- שנתי: **"₪95"** + **"לחודש, בחיוב שנתי של ₪1,140 כולל מע״מ"**; מעל המחיר, בקו חוצה וב-`--color-muted`: **"₪119"** (המחיר החודשי), עם טקסט מוסתר לקוראי מסך "במקום ₪119".
- לעסקים: **"₪100.85"** + **"לחודש + מע״מ"**; בשנתי: **"₪80.51"** + **"לחודש + מע״מ, בחיוב שנתי של ₪966.10 + מע״מ"**.
- החישוב לפני מע״מ: `net = round2(gross / (1 + vat_rate))` ב-`lib/billing/vat.ts`, כש-`vat_rate` נקרא מ-`app_settings` (לעולם לא קבוע בקוד). אגורות מוצגות רק כשהסכום אינו שלם.
- "≈ N סרטונים" = `floor(monthly_credits / typical_video_credits)` (`typical_video_credits` מ-`app_settings`, 50), חוץ מ-`free`, שמציג את `freeVideos = floor(trialCredits / freeVideoCredits)` (2 עם ה-seed, §3.3.4) ב-plural של ICU, תמיד עם "באיכות טיוטה, עם סימן מים".

**רשימת היכולות** (`features_he`, נוסח קנוני; אייקון `Check` שאינו מתהפך, עם טקסט מוסתר "כלול"):
- **חינם:** 70 קרדיטים לניסיון (כ-2 סרטונים קצרים באיכות טיוטה, עם סימן מים) · 720p, פורמט 9:16 · סימן מים של {{BRAND_NAME}} עד התשלום הראשון · גישה מלאה לספריית ההוקים · בלי כרטיס אשראי
- **בסיס:** 400 קרדיטים בחודש (כ-8 סרטונים) · איכות טיוטה וסטנדרט, Full HD · 3 פורמטים: 9:16, 1:1, 16:9 · בלי סימן מים · קריינות וכתוביות בעברית · עד 3 גרסאות הוק לסרטון · 2 יצירות במקביל
- **עסק:** 1,000 קרדיטים בחודש (כ-20 סרטונים) · כל רמות האיכות, כולל פרימיום · מוזיקה מקורית לכל סרטון · עד 5 גרסאות הוק לסרטון · 3 משתמשים ו-3 ערכות מותג · קישורי אישור ללקוח · 3 יצירות במקביל
- **סוכנות:** 3,300 קרדיטים בחודש (כ-66 סרטונים) · עד 15 סביבות לקוח, ערכת מותג לכל לקוח · 10 משתמשים והרשאות · דפי שיתוף בלי המיתוג שלנו (White label) · קישורי אישור ללקוח · 6 יצירות במקביל

בכרטיסי בסיס, עסק וסוכנות מופיעה מעל הרשימה שורה **"כל מה שבתוכנית הקודמת, ועוד:"** — רק אם הרשימה אכן מכילה את כל מה שבקודמת; אחרת לא מוצגת.

**יעדי הכפתורים:**
- חינם: `/login?next=/app/onboarding` (מחובר: `/app`).
- בתשלום: `/app/billing/plans?plan={id}&cycle={cycle}`; לאורח `/login?next=` עם היעד הזה מקודד ב-`encodeURIComponent` (אחרת `&cycle=` נקרא כפרמטר של `/login`). הקופה עצמה נפתחת באפליקציה (חלק 03 וחלק 06), כי היא דורשת בעלות על סביבת העבודה.
- אירועים: `cta_clicked {location:"pricing_card_{planId}"}` (`pricing_card_free` … `pricing_card_agency`); לאורח גם `signup_started {source:"pricing"}`.

### §7.3 שורת ההבטחות ואמצעי התשלום

מתחת לכרטיסים, שש הבטחות עם אייקון (נוסח קנוני):

| אייקון | טקסט |
|---|---|
| `Repeat` | קרדיטים שלא נוצלו עוברים לחודש הבא |
| `RotateCcw` | החזר קרדיטים אוטומטי על יצירה שנכשלה |
| `MousePointerClick` | ביטול מנוי אונליין בכל רגע |
| `ReceiptText` | חשבונית מס לכל תשלום |
| `Banknote` | המחירים כוללים מע״מ |
| `CreditCard` | תשלום בכרטיס אשראי; חבילות קרדיטים גם ב-Bit (כש-`bitEnabled = false`: **"תשלום בכרטיס אשראי"**) |

- שורת אמצעי תשלום (טקסט, בלי לוגואים; `marketing.pricing.bit`): **"כרטיסי אשראי ישראליים ובינלאומיים · Bit לחבילות קרדיטים · התשלום מאובטח ומתבצע בעמוד של חברת הסליקה. אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס."**
- **Bit מוצג רק כשהוא באמת זמין.** Bit מוצע רק לחבילות קרדיטים, ורק כשמשתנה הסביבה `GROW_PAGE_CODE_BIT` מוגדר (אחרי שניסוי ה-M0 מול עמוד הסליקה של Grow אישר את זה). השרת מעביר ל-`/pricing` את הדגל `bitEnabled: boolean` (`getPricing()`), וכשהוא `false` כל מחרוזת שמזכירה Bit מוחלפת בגרסה שלה בלי Bit, ממפתח מקביל עם הסיומת `ByCardOnly`: `marketing.pricing.bit` ← `marketing.pricing.bitByCardOnly` (שורת אמצעי התשלום: **"כרטיסי אשראי ישראליים ובינלאומיים · התשלום מאובטח ומתבצע בעמוד של חברת הסליקה. אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס."**), שורת ההבטחה למעלה, השורה בכרטיסי החבילות (§7.6) והתשובה `pricing-payment-methods` (§9.3). אותו דגל מגיע גם ל-`TopUpDialog` באפליקציה (חלק 03 §15.2).

### §7.4 טבלת השוואה (`PlanComparisonTable`)

H2: **"השוואה מלאה בין התוכניות"**. הטבלה נבנית מ-`plans.limits` דרך מפת תוויות (לא כתובה ידנית), כך שכל שינוי בתוכנית מתעדכן אוטומטית.

| שורה | חינם | בסיס | עסק | סוכנות |
|---|---|---|---|---|
| קרדיטים | 70 לניסיון, פעם אחת | 400 בחודש | 1,000 בחודש | 3,300 בחודש |
| בערך כמה סרטונים | 2 קצרים, באיכות טיוטה, עם סימן מים | 8 בחודש | 20 בחודש | 66 בחודש |
| קרדיטים שלא נוצלו | — | עוברים לחודש אחד נוסף | עוברים לחודש אחד נוסף | עוברים לחודש אחד נוסף |
| אורך סרטון מקסימלי | 30 שניות | 60 שניות | 60 שניות | 60 שניות |
| רמות איכות | טיוטה | טיוטה, סטנדרט | טיוטה, סטנדרט, פרימיום | טיוטה, סטנדרט, פרימיום |
| ויז׳ואל | תמונות בתנועה, משולב (קליפ AI אחד עד 5 שניות) | הכול | הכול | הכול |
| פורמטים בכל יצירה | 1 (9:16) | 3 | 3 | 3 |
| רזולוציה | 720p | 1080p | 1080p | 1080p |
| סימן מים | יש, עד התשלום הראשון | — | — | — |
| קריינות וכתוביות בעברית | ✓ | ✓ | ✓ | ✓ |
| קובצי כתוביות SRT ו-VTT | ✓ | ✓ | ✓ | ✓ |
| מוזיקה מהספרייה | ✓ | ✓ | ✓ | ✓ |
| מוזיקה מקורית לכל סרטון | — | — | ✓ | ✓ |
| גרסאות הוק לסרטון | 1 | עד 3 | עד 5 | עד 5 |
| יצירות במקביל | 1 | 2 | 3 | 6 |
| תקרת קרדיטים יומית | 70 | 400 | 800 | 2,500 |
| פרויקטים | עד 3 | ללא הגבלה | ללא הגבלה | ללא הגבלה |
| משתמשים ¹ | 1 | 1 | 3 | 10 |
| ערכות מותג | 1 | 1 | 3 | ללא הגבלה (אחת לכל לקוח) |
| סביבות לקוח | — | — | — | עד 15 |
| קישורי אישור ללקוח | — | — | ✓ | ✓ |
| דפי שיתוף בלי המיתוג שלנו | — | — | — | ✓ |
| ספריית ההוקים | ✓ | ✓ | ✓ | ✓ |
| חשבונית מס | על כל רכישת חבילה | ✓ | ✓ | ✓ |

- הערת שוליים לשורת המשתמשים (מתחת לטבלה, מקושרת ב-`aria-describedby`): **"¹ צופים — ללא הגבלה. המכסה סופרת בעלים, מנהלים ועורכים; צופים יכולים לצפות בפרויקטים ולהוריד סרטונים, ולא נספרים בה."** (`seats_used`, חלק 04 §9.2)
- `<table>` אמיתית: `<caption>` מוסתר ("השוואה בין תוכניות {{BRAND_NAME}}"), כותרות עמודה `scope="col"`, כותרות שורה `scope="row"`. ✓ עם טקסט מוסתר "כלול", "—" עם טקסט מוסתר "לא כלול".
- כותרת העמודות דביקה בגלילה אנכית. במובייל: עמודת התוויות דביקה בצד ההתחלה וגלילה אופקית של עמודות התוכניות, עם רמז גלילה ("גללו הצידה כדי לראות את כל התוכניות") שמוצג פעם אחת.

### §7.5 "כמה עולה סרטון" (`CreditCostTable`, עוגן `#credit-costs`)

- H2: **"כמה עולה סרטון?"**
- פתיח: **"כל פעולה עולה מספר קבוע של קרדיטים, ואת המחיר המדויק רואים לפני כל לחיצה על "צרו". אלה כמה דוגמאות נפוצות:"**

**דוגמאות מחושבות** (מחושבות בזמן הבנייה מ-`credit_costs` עם `SAMPLE_PRESETS` ו-`estimateSample` של `lib/pipeline/estimate.ts`, חלק 05 §14.2 — המפתחות `images15`, `draft30`, `standard30`, `premium60`; הערכים כאן הם תוצאת ה-seed):

| סרטון | מה כולל | קרדיטים | בערך בשקלים, בתוכנית עסק |
|---|---|---|---|
| רילס 15 שניות, תמונות בתנועה | 4 תמונות באיכות סטנדרט, תסריט, קריינות, הרכבה | **23** | כ-₪7 |
| רילס 30 שניות, טיוטה | 6 תמונות, 15 שניות של קליפים, תסריט, קריינות, הרכבה | **50** | כ-₪14 |
| רילס 30 שניות, סטנדרט | 6 תמונות, 15 שניות של קליפים באיכות סטנדרט, תסריט, קריינות, הרכבה | **107** | כ-₪31 |
| סרטון תדמית 60 שניות, פרימיום | 10 תמונות, 36 שניות של קליפים באיכות פרימיום, תסריט, קריינות, הרכבה | **478** | כ-₪138 |

שורה מתחת לטבלה: **"כל פורמט נוסף (1:1 או 16:9): עוד 2 קרדיטים לסרטון של עד 30 שניות, או 3 לסרטון ארוך יותר."**
הערת שוליים לעמודת השקלים (מתחת לטבלה, מקושרת מכותרת העמודה ב-`aria-describedby`): **"הסכום בשקלים מחושב לפי מחיר הקרדיט בתוכנית עסק (₪289 ל-1,000 קרדיטים, כולל מע״מ), ומעוגל לשקל. בתוכניות אחרות ובחבילות, המחיר לקרדיט שונה."**

**מחירון הפעולות** (`<details>` "למחירון המלא לפי פעולה", מתוך `credit_costs.label_he`; ערכי `label_he` ל-seed):

| `action_key` | `label_he` | קרדיטים |
|---|---|---|
| `script.generate` | כתיבת תסריט (כולל 3 הצעות הוק) | 2 |
| `storyboard.generate` | בניית סטוריבורד | 1 |
| `hooks.generate` | עד 10 הוקים חדשים | 1 |
| `brand.extract` | חילוץ פרטי המותג מהאתר | חינם |
| `scene.rewrite` | שכתוב סצנה | חינם |
| `voice.preview` | השמעת קול לדוגמה | חינם |
| `captions.transcribe` | סנכרון כתוביות לקריינות | חינם |
| `music.library` | מוזיקה מהספרייה | חינם |
| `image.draft` / `image.standard` / `image.premium` | תמונה לסצנה: טיוטה / סטנדרט / פרימיום | 2 / 4 / 7 |
| `clip.draft` / `clip.standard` / `clip.premium` | קליפ וידאו, לכל שנייה: טיוטה / סטנדרט / פרימיום | 2 / 5 / 11 |
| `voice.tts` | קריינות, לכל 15 שניות שהתחילו | 1 |
| `music.generate` | מוזיקה מקורית לסרטון | 5 |
| `render.base` | הרכבת הסרטון, פורמט ראשון (עד 30 שניות / 31–60 שניות) | 3 / 5 |
| `render.extra_format` | פורמט נוסף (עד 30 שניות / 31–60 שניות) | 2 / 3 |

פעולות "חינם" מוגבלות בקצב (למשל עד 5 חילוצי מותג ביום), כדי למנוע ניצול לרעה. פעולות מאחורי דגל כבוי (`avatar.second`) לא מוצגות.

**"איך זה עובד" — שלוש נקודות מתחת:**
- **"רואים מחיר לפני כל יצירה."** כל כפתור יצירה מציג את העלות, ולפני יצירת סרטון מופיע אישור עם פירוט.
- **"משלמים רק על מה שהצליח."** יצירה שנכשלה מחזירה את כל הקרדיטים אוטומטית; סצנה שנבנתה מתמונה במקום וידאו מחזירה את קרדיטי הקליפ; ביטול באמצע מחייב רק את מה שהסתיים.
- **"עורכים בלי לשלם על הכול מחדש."** "עריכת טקסט, סדר ומשך בעורך לא עולה קרדיטים, ורואים את השינוי מיד בנגן. כדי לקבל קובץ מעודכן משלמים רק על ההרכבה מחדש ({rerenderCredits, plural, one {מקרדיט אחד} two {משני קרדיטים} other {מ-# קרדיטים}}), ואם טקסט הקריינות השתנה — גם על הקלטה מחדש. יצירה מחדש של סצנה אחת עולה רק את הסצנה ואת ההרכבה מחדש."

`rerenderCredits` = `credit_costs['render.base'].credits` (3 עם ה-seed, ולכן "(מ-3 קרדיטים)"), מוזרק בזמן הבנייה מ-`getPricing()` כמו `previewCredits` (§3.6). אסור לכתוב שעריכה, שינוי סדר או שינוי טקסט "לא עולים קרדיטים" בלי לציין שהקובץ המעודכן דורש הרכבה מחדש בתשלום.

### §7.6 לשונית "חבילות קרדיטים"

- פתיח: **"לא רוצים מנוי? קונים קרדיטים פעם אחת. הם לא פגים, ואפשר לקנות אותם גם על גבי מנוי קיים."**

| `id` | `name_he` | קרדיטים | מחיר (כולל מע״מ) | לפני מע״מ | שורת "≈" |
|---|---|---|---|---|---|
| `pack-150` | חבילת 150 | 150 | ₪59 | ₪50 | ≈ 3 סרטונים |
| `pack-500` | חבילת 500 | 500 | ₪179 | ₪151.69 | ≈ 10 סרטונים |
| `pack-1500` | חבילת 1,500 | 1,500 | ₪449 | ₪380.51 | ≈ 30 סרטונים |

- בכל כרטיס: **"הקרדיטים לא פגים"**, **"תשלום בכרטיס אשראי או ב-Bit"** (בלי Bit: **"תשלום בכרטיס אשראי"**), **"התשלום הראשון מסיר את סימן המים"**; כפתור **"קנו חבילה"** → `/app/billing?topup={packId}` (לאורח: `/login?next=` עם היעד מקודד ב-`encodeURIComponent`).
- אירוע: `cta_clicked {location:"pricing_pack_{credits}"}` — לפי מספר הקרדיטים (`pricing_pack_150`, `pricing_pack_500`, `pricing_pack_1500`), לא לפי ה-`id`.

### §7.7 ביטול ומע״מ — תיבת אמון

כרטיס רחב מתחת לטבלאות, כותרת **"בלי התחייבות, בלי אותיות קטנות"**:
- **"ביטול אונליין בכל רגע."** "מבטלים מעמוד החיוב: לוחצים "ביטול מנוי" ומאשרים, בלי שיחת שימור. בלי מסכי שכנוע, ושאלת הסיבה היא רשות. החיובים נעצרים מיד, והחשבון ממשיך לעבוד עד סוף התקופה ששולמה. אפשר לבטל גם במייל או בטלפון."
- **"14 יום להתחרט."** "ב-14 הימים הראשונים אחרי התשלום הראשון על תוכנית, או אחרי קניית חבילה, אפשר לבטל ולקבל החזר, בניכוי שווי הקרדיטים שנוצלו ודמי ביטול של 5% או ₪100, הנמוך מביניהם."
- **"מחירים כוללים מע״מ."** "כל מחיר באתר כולל מע״מ בשיעור {vatPercent}% (אלא אם מסומן "לפני מע״מ"), ועל כל תשלום נשלחת חשבונית מס במייל. עסקים יכולים להוסיף מספר עוסק או ח״פ לפרטי החיוב, ובחשבונית מעל הסף של רשות המסים (₪5,000 לפני מע״מ, מ-1 ביוני 2026) נבקש מספר הקצאה." (הסכום בשקלים נקרא מ-`app_settings.allocation_threshold_schedule`, לא כתוב בקוד.)
- קישורים: **"למדיניות הביטול וההחזרים"** · **"לתנאי הקרדיטים"** (`/legal/terms#credits`).

### §7.8 שאלות על מחירים

H2 **"שאלות על מחירים ותשלום"**. מזהי השאלות ב-`marketing.faq.items` (נוסח מלא ב-§9.3): `credits`, `pricing-how-many-videos`, `pricing-rollover`, `pricing-packs-expire`, `failure`, `pricing-upgrade`, `pricing-annual`, `pricing-refund-14`, `invoice-vat`, `pricing-payment-methods`, `pricing-watermark`, `cancel`.

### §7.9 מטא ו-JSON-LD

- title: **"מחירים: סרטון תדמית ורילס בשקלים, כולל מע״מ | {{BRAND_NAME}}"** (קיצור לפי §5.11: "מחירים בשקלים, כולל מע״מ | {{BRAND_NAME}}")
- description: **"מתחילים בחינם עם {trialCredits} קרדיטים לניסיון. תוכניות מ-₪119 לחודש כולל מע״מ, חבילות קרדיטים שלא פגות, חשבונית מס וביטול אונליין בכל רגע."** (המחירים והקרדיטים מוזרקים)
- JSON-LD: `Product` + `AggregateOffer` (`priceCurrency: "ILS"`, `lowPrice: 0`, `highPrice` = התוכנית היקרה, `offerCount`), ו-`Offer` לכל תוכנית וחבילה עם `price` כולל מע״מ ו-`priceSpecification.valueAddedTaxIncluded: true`; `FAQPage` לשאלות שבעמוד. בלי `aggregateRating`.

**קריטריוני קבלה**
- [ ] כל מחיר בעמוד נקרא מ-DB; שינוי `price_monthly_ils` באדמין מתעדכן אחרי revalidate, כולל JSON-LD.
- [ ] `VatModeToggle` מציג את המחירים לפני מע״מ לפי `app_settings.vat_rate` (בדיקת יחידה: 18% → ₪100.85 ל-₪119); שינוי השיעור ל-17% משנה את כל המספרים בלי שינוי קוד.
- [ ] אחרי רענון העמוד, המצב חוזר לברירת המחדל אלא אם ה-URL מכיל `cycle`/`vat` (אין שמירה ב-`localStorage`).
- [ ] `?cycle=annual&vat=excl` פותח את העמוד במצב הנכון.
- [ ] הדוגמאות ב"כמה עולה סרטון" מחושבות ומחזירות 23 / 50 / 107 / 478 עם ה-seed (snapshot).
- [ ] הטבלה עוברת axe ונקראת נכון ב-NVDA (שורה, עמודה, "כלול" או "לא כלול").
- [ ] כש-`GROW_PAGE_CODE_BIT` לא מוגדר (`bitEnabled = false`), אף מחרוזת באתר לא מזכירה Bit, ומוצגות גרסאות ה-`ByCardOnly` (שורת ההבטחה, שורת אמצעי התשלום, כרטיסי החבילות, `pricing-payment-methods`, תנאי השימוש 6.2).
- [ ] אירועי הכפתורים בלשונית החבילות הם `pricing_pack_150` / `pricing_pack_500` / `pricing_pack_1500`.
- [ ] Lighthouse מובייל ל-`/pricing`: ביצועים ≥ 90, נגישות 100, SEO 100.
- [ ] הבאדג׳ בכרטיס המודגש הוא "מומלץ" (לפי `plans.is_highlighted`); המחרוזת "הכי פופולרי" לא מופיעה בקוד, ב-`messages/he.json` או ב-`content/**` (בדיקת CI). החזרה שלה דורשת בדיקת נתונים (הכי הרבה מנויים פעילים בתשלום ב-90 הימים האחרונים) ורשומה ב-`DECISIONS.md`.
- [ ] אין "בלחיצה" בהקשר של ביטול באף מחרוזת; כפתור הביטול נקרא בדיוק "ביטול מנוי".

---

## §8. בלוג (`/blog`, `/blog/[slug]`, `/blog/tag/[tag]`)

### §8.1 מוסכמות MDX

- קובץ לכל מאמר: `content/blog/{slug}.mdx`, slug באנגלית kebab-case. נבנה ב-`@next/mdx` עם `gray-matter` לקריאת ה-frontmatter, ונבדק ב-Zod (`lib/content/blog.ts`). שדה חסר או ארוך מדי מפיל את ה-build.

```ts
// lib/content/blog.ts
export const BlogFrontmatter = z.object({
  title: z.string().max(80),                 // H1 של המאמר
  seoTitle: z.string().max(60).optional(),   // <title>; ברירת מחדל: title
  description: z.string().min(110).max(155),
  date: z.iso.date(),                        // תאריך פרסום
  updated: z.iso.date().optional(),
  author: z.string().default("צוות {{BRAND_NAME}}"),
  tags: z.array(z.enum(["hooks", "reels", "pricing", "niches", "guides", "video-marketing"])).min(1),
  niches: z.array(z.string()).default([]),   // slugs; נבדקים מול niches
  cover: z.object({ src: z.string(), alt: z.string().min(10) }),
  cta: z.object({ kind: z.enum(["create", "hooks", "pricing"]), niche: z.string().optional() }),
  draft: z.boolean().default(false),         // draft לא נבנה בפרודקשן
});
```

- **תוויות תגיות:** `hooks` הוקים · `reels` רילס · `pricing` מחירים ותקציב · `niches` לפי נישה · `guides` מדריכים · `video-marketing` שיווק בווידאו. עמוד תגית: H1 **"מאמרים על {tag}"**, רשימת `BlogCard`.
- **זמן קריאה:** `ceil(words / 200)` דקות, מוצג "{n, plural, one {דקת קריאה אחת} two {שתי דקות קריאה} other {# דקות קריאה}}".
- **רכיבים זמינים בתוך MDX** (רק אלה; כל רכיב אחר נכשל ב-build):

| רכיב | שימוש |
|---|---|
| `<HookEmbed id="real-estate-01" />` | `HookCard` בווריאנט `compact` עם העתקה ו"צרו סרטון" |
| `<HookList niche="real-estate" type="pov" limit={6} />` | רשימת הוקים מהספרייה |
| `<Callout kind="tip\|warning\|note" title="…">…</Callout>` | תיבת הדגשה |
| `<CtaBox kind="create\|hooks\|pricing" niche="…" />` | כרטיס הנעה לפעולה אחיד בסוף מאמר |
| `<SampleCost preset="images15\|draft30\|standard30\|premium60" />` | "בערך {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}} (כ-₪{ils} בתוכנית עסק)", מחושב בזמן הבנייה מ-`SAMPLE_PRESETS` ו-`estimateSample` (`lib/pipeline/estimate.ts`, חלק 05 §14.2) |
| `<ExampleVideo slug="…" />` | נגן של דוגמה מפורסמת (עם כתוביות) |
| `<Figure src alt caption />` | תמונה עם כיתוב (`next/image`, AVIF) |
| `<Sources>…</Sources>` | רשימת מקורות בסוף מאמר, עם קישורים `rel="nofollow noopener"` |
| `<Placeholder name="עיר" />` | שדה placeholder בתוך נוסחה או דוגמה (מרונדר כ-`PlaceholderChip`, §1.4); משמש גם בקובצי `content/seo/**` |

- **כללי כתיבה:** H1 רק מה-`title`; בתוך המאמר `##` ו-`###` בלבד. פנייה ברבים. אין מספר, מחיר או נתון בלי מקור ב-`<Sources>` או בלי שהוא מחושב מהמערכת. אין ביטויים מרשימת האיסור של מדריך הסגנון (נספח E). קישורים פנימיים יחסיים (`/hooks/real-estate`), לפחות שניים בכל מאמר לעמודי נישה או הוקים.
- **סוגריים מסולסלים ומשתנים ב-MDX:** ב-MDX, `{…}` הוא ביטוי JavaScript. לכן placeholder של הוק בתוך טקסט נכתב כ-`<Placeholder name="עיר" />`, או בבריחה (`\{עיר\}`), ולעולם לא כ-`{עיר}`. בדיקת build ב-`scripts/check-content.ts` נכשלת על `{` לא מוברח שאחריו אות עברית בכל `content/**/*.mdx`. משתני התוכן `{{…}}` (`{{BRAND_NAME}}`, `{{DOMAIN}}` והמשתנים המשפטיים, §10.1) מוחלפים בזמן הבנייה בתוסף remark אחד (`lib/content/remark-content-vars.ts`, מוגדר ב-`next.config.ts` עבור `@next/mdx`) שרץ על **כל** `content/**/*.mdx`: בלוג, דפים משפטיים, סוגי הוקים, עונות ופלטפורמות. התוסף מחליף כל צומת ביטוי (`mdxTextExpression` / `mdxFlowExpression`) שהערך שלו הוא `{NAME}` בטקסט מתוך `BRAND` (§1.2), ומפיל את ה-build על שם לא מוכר; אותה החלפה רצה על מחרוזות ה-frontmatter ב-`gray-matter`.
- **עיצוב:** `BlogProse` — רוחב קריאה 68ch, גוף 18px, line-height 1.8, H2 עם מרווח עליון 2.5em. `TableOfContents` מה-H2-ים: דביק בצד הסוף בדסקטופ (≥1280px), מתקפל בראש המאמר במובייל ("בכתבה הזו").
- **מבנה עמוד מאמר:** Breadcrumbs (ראשי › בלוג › {title}) · תגיות · H1 · שורת מטא ("{author} · {date} · {n, plural, one {דקת קריאה אחת} two {שתי דקות קריאה} other {# דקות קריאה}}"; "עודכן ב-{updated}" אם יש) · תמונת שער · תוכן · `CtaBox` · "מאמרים נוספים" (3, לפי תגיות משותפות) · `NewsletterForm`.
- **האב הבלוג:** H1 **"הבלוג של {{BRAND_NAME}}"**, פתיח **"מדריכים, הוקים ומספרים אמיתיים על סרטונים לעסקים בישראל. בלי באזוורדס."**, צ׳יפים של תגיות, רשימת `BlogCard` (שער, כותרת, תיאור, תאריך, זמן קריאה), 12 לעמוד.
- **JSON-LD:** `BlogPosting` (headline, description, image, datePublished, dateModified, author ו-publisher מסוג `Organization`, `inLanguage: "he"`), `BreadcrumbList`.

### §8.2 מאמר 1 — `content/blog/real-estate-hooks.mdx`

```mdx
---
title: "7 הוקים שעובדים לנדל״ן, ואיך להפוך כל אחד מהם לרילס"
seoTitle: "7 הוקים לנדל״ן שעוצרים גלילה, עם דוגמאות"
description: "שבעה משפטי פתיחה למתווכי נדל״ן: מה רואים בשלוש השניות הראשונות, למה כל אחד עובד, ואיך מתאימים אותו לנכס שלכם בלי להסתבך בפרסום."
date: "2026-10-20"
tags: ["hooks", "niches", "reels"]
niches: ["real-estate"]
cover: { src: "/media/blog/real-estate-hooks.avif", alt: "מתווכת מצלמת סרטון אנכי בסלון מואר של דירה למכירה" }
cta: { kind: "hooks", niche: "real-estate" }
---

רוב סרטוני הנדל״ן נפתחים באותה צורה: דלת נפתחת, מוזיקה אופטימית, ומשפט כמו "דירת 4 חדרים מהממת במיקום מעולה". הבעיה היא לא הדירה. הבעיה היא שהצופה כבר ראה את הפתיחה הזו מאה פעם, והאגודל שלו ממשיך לגלול.

הוק הוא המשפט והתמונה שפותחים את הסרטון. בנדל״ן יש לו תפקיד אחד: לגרום למי שגולל לחשוב "רגע, זה נוגע אליי". ריכזנו כאן שבעה הוקים מספריית ההוקים לנדל״ן, עם מה שרואים על המסך בשלוש השניות הראשונות, למה כל אחד עובד ואיך מתאימים אותו לעסק שלכם.

## 1. הרשימה: "3 דברים לבדוק לפני שחותמים"

<HookEmbed id="real-estate-01" />

המספר שלוש מבטיח ערך מוגדר בזמן קצר, והמשפט השני פותח פער: מה הדבר השלישי שפחות מדברים עליו? מי שמחפש דירה יישאר עד הסוף כדי לגלות.

על המסך רואים יד עם עט שקופאת מעל חוזה, ושלושה מספרים שקופצים בזה אחר זה. כדי שזה יעבוד, שלושת הדברים צריכים להיות אמיתיים ושימושיים: נסח טאבו, עסקאות קודמות בבניין, והעלות החודשית האמיתית של הדירה. סרטון כזה בונה אמון לפני שהוא מבקש משהו.

## 2. התוצאה קודם: "הדירה הזאת נמכרה"

<HookEmbed id="real-estate-02" />

פותחים בסוף הטוב, ומבטיחים לספר איך הגעתם אליו. מוכרים שחושבים לפנות למתווך רוצים לשמוע בדיוק את זה. על המסך: מדבקת "נמכר" שנדבקת בזום מהיר על שלט "למכירה".

<Callout kind="warning" title="רק נתון אמיתי">
מספר הימים חייב להיות אמיתי, ממכירה שאתם יכולים להראות. אם אין לכם נתון כזה, בחרו הוק אחר. מספר מומצא בסרטון הוא פרסום מטעה, ובנדל״ן גם קונים וגם מוכרים בודקים.
</Callout>

## 3. נקודת מבט: "POV: סוף סוף מצאתם"

<HookEmbed id="real-estate-03" />

הצופה לא רואה דירה, הוא רואה את עצמו נכנס אליה. הוק POV עובד כי הוא מתאר רגע שכל מי שחיפש דירה מכיר, ומוסיף בסוף את הפרט שכולם רוצים. המצלמה מתקדמת מגובה העיניים אל מרפסת מוארת.

כדי להתאים אותו לאזור שלכם, החליפו את הפרט האחרון במה שהקונים אצלכם הכי מחפשים: חנייה בתל אביב, ממ״ד בדרום, קרבה לבית ספר בשכונה חדשה.

## 4. חשיפת מחיר: "כמה באמת עולה"

<HookEmbed id="real-estate-04" />

זו השאלה שכולם שואלים ואף אחד לא עונה עליה ישר, ולכן היא עוצרת גלילה. על המסך המתווכת מחזיקה שלט עם מספר מטושטש, ואצבע מתקרבת כדי לחשוף אותו.

הכלל כאן חשוב במיוחד: משתמשים בנתוני עסקאות שנסגרו, לא במחירים מבוקשים. מחיר מבוקש אינו מחיר עסקה, ואסור להציג אותו כאילו הוא כזה. אם תכתבו את העיר בשדה ההתאמה בספרייה, ההוק יתעדכן מיד.

## 5. פקודה ישירה: "תפסיקו לתמחר לפי השכן"

<HookEmbed id="real-estate-05" />

פקודה ישירה שנוגעת בטעות שהרבה מוכרים עושים. היא מעוררת מעט התנגדות, וזה בדיוק מה שגורם להמשיך לצפות. אחרי ההוק, תנו את התשובה בשני משפטים: איך כן מתמחרים. וסיימו בהצעה פשוטה, למשל "שלחו לי את הכתובת בוואטסאפ, ואחזור אליכם עם הערכה לפי עסקאות אמיתיות".

## 6. פער סקרנות: "חמש השניות הראשונות"

<HookEmbed id="real-estate-07" />

ההוק הזה מדבר אל מוכרים, ומשתמש בעיקרון שכולם מכירים מהרשתות: הרושם הראשון נקבע מהר. מצלמת גוף נכנסת בדלת אל מסדרון עמוס נעליים ומעילים, והצופה מבין לבד מה הבעיה. בהמשך הסרטון מראים את אותה כניסה אחרי חצי שעה של סידור. זה סרטון שמוכרים שולחים זה לזה.

## 7. דעה לא פופולרית: "בית פתוח זה בזבוז זמן"

<HookEmbed id="real-estate-10" />

עמדה מקצועית חדה מביאה תגובות, ותגובות מביאות חשיפה. אבל היא עובדת רק אם היא באמת שלכם, ואם אתם מסבירים מה עובד במקום. על המסך: בית פתוח ריק עם בלונים, והמתווך נכנס לפריים ומפוצץ בלון. לא צריך להיות מתלהמים. מספיק להיות כנים.

## איך בוחרים את ההוק הנכון

לא כל הוק מתאים לכל מטרה. אם אתם רוצים פניות ממוכרים, הוקים 2, 5 ו-6 מדברים אליהם ישירות: תוצאה, טעות נפוצה ורושם ראשון. אם אתם רוצים שקונים ישמרו את המספר שלכם, הוקים 1, 3 ו-4 נותנים להם ערך עוד לפני שהם צריכים מתווך. והוק 7 מתאים כשכבר יש לכם קהל קטן שמגיב, ואתם רוצים שהוא יגדל.

עוד כלל אצבע: הוק בגוף שני רבים ("אתם", "שלכם") מתאים כמעט לכל קהל. אם אתם עובדים בעיקר עם זוגות צעירים או עם משקיעים, אפשר לפנות אליהם במפורש כבר במילה הראשונה: "זוגות צעירים?", "למשקיעים:". פנייה מדויקת עוצרת את האנשים הנכונים ומסננת את מי שלא רלוונטי, וזה חוסך לכם שיחות מיותרות.

## לפני שמפרסמים: שלושה כללים לנדל״ן

1. **הנכס אמיתי.** את הדירה עצמה מראים רק מצילומים שלכם. ויז׳ואלים שנוצרו ב-AI מתאימים לאווירה, למעברים ולרחוב בערב, לא כתחליף לנכס.
2. **המספרים אמיתיים.** מחירים, ימים על השוק ומספר עסקאות מופיעים רק אם יש לכם נתון שאפשר להראות.
3. **פרטי המתווך.** חוק המתווכים במקרקעין עוסק גם בפרסום. בדקו אם אתם צריכים לציין שם ומספר רישיון, והוסיפו אותם לכרטיס הסיום.

## איך הופכים הוק לרילס

בוחרים את ההוק, מעלים חמישה עד שמונה צילומים או קטעים קצרים מהנכס, והמערכת כותבת תסריט של 30 שניות שמתחיל בהוק, מקריינת בעברית, מוסיפה כתוביות ומסיימת בכפתור וואטסאפ. מאותו סרטון מקבלים גרסה אנכית לרילס ולסטטוס, ריבועית לקבוצות הפייסבוק ורוחבית לאתר.

כדאי לנסות את אותו סרטון עם שניים או שלושה הוקים שונים, ולבדוק איזה מהם מחזיק את הצופים יותר זמן. אחרי כמה שבועות תדעו בדיוק איזה סוג פתיחה עובד אצל הקהל שלכם, ותוכלו לבנות עליו.

<CtaBox kind="hooks" niche="real-estate" />
```

### §8.3 מאמר 2 — `content/blog/promo-video-cost-2026.mdx`

```mdx
---
title: "כמה עולה סרטון תדמית ב-2026, ואיך לחסוך בלי להיראות זול"
seoTitle: "כמה עולה סרטון תדמית ב-2026? מחירים אמיתיים"
description: "טווחי המחירים של סרטון תדמית ורילס ערוך בישראל ב-2026, מה מזיז את המחיר, מתי שווה לשלם על הפקה, ושבע דרכים לחסוך בלי לפגוע בתוצאה."
date: "2026-10-22"
tags: ["pricing", "video-marketing", "guides"]
niches: []
cover: { src: "/media/blog/promo-video-cost-2026.avif", alt: "שולחן עבודה עם מחשבון, טלפון שמצלם ותסריט מודפס" }
cta: { kind: "pricing" }
---

על השאלה "כמה עולה סרטון תדמית" עונים בדרך כלל במילה אחת: "תלוי". זה נכון, אבל זה לא עוזר למי שצריך לתכנן תקציב. אז אספנו את המחירים שמפורסמים בשוק הישראלי ב-2026, הסברנו מה מזיז אותם, ובדקנו איפה אפשר לחסוך בלי שהסרטון ייראה כמו פשרה.

## השורה התחתונה

| מה | טווח מחירים |
|---|---|
| סרטון תדמית בהפקה מלאה | ₪5,000 עד ₪60,000 ויותר. רוב העסקים הקטנים והבינוניים משלמים ₪15,000–₪35,000 |
| חבילת תדמית בסיסית | החל מ-₪3,500 |
| סרטון קצר עם קריינות (45–60 שניות) בהפקה חסכונית | החל מ-₪1,200 |
| עריכה בלבד של סרטון עסקי באורך 1–3 דקות | ₪800–₪4,000, או ₪80–₪300 לכל דקה מוגמרת |
| עריכה מקצועית של רילס אחד | בסביבות ₪550 |

המחירים נאספו ממחירונים וממדריכים שפרסמו ספקים ישראליים, ונבדקו באוקטובר 2026. המקורות מופיעים בסוף הכתבה. הם לא הצעת מחיר, ולא תמיד ברור מהם אם המחיר כולל מע״מ, אז כדאי לשאול.

## מה מזיז את המחיר

- **ימי צילום וצוות.** צלם אחד עם טלפון ליום אחד זה עולם אחר מצוות עם תאורה, סאונד ובמאי. כל יום צילום נוסף מכפיל חלק גדול מהעלות.
- **תסריט.** סרטון בלי תסריט טוב יוצא ארוך, משעמם, ונגמר בלי לבקש מהצופה כלום. קופירייטר טוב עולה כסף, ושווה אותו.
- **אנשים מול המצלמה.** שחקנים, קריין מקצועי או דוגמנים מוסיפים עלות, וגם זמן תיאום.
- **מוזיקה ורישוי.** מוזיקה בלי רישיון מתאים יכולה להביא להשתקת הסרטון ברשתות. ספריות עם רישיון מסחרי עולות כסף.
- **גרפיקה ואנימציה.** כתוביות מעוצבות, לוגו מונפש וכרטיס סיום הם עוד שעות עבודה.
- **סבבי תיקונים.** "עוד שינוי קטן" הוא המשפט היקר ביותר בעולם הווידאו. בדקו כמה סבבים כלולים.
- **פורמטים.** גרסה אנכית לרילס, ריבועית לפיד ורוחבית לאתר הן לפעמים שלוש עבודות עריכה נפרדות.

## מתי שווה לשלם על הפקה

יש מקרים שבהם אין תחליף לצוות צילום: סרטון שמציג אנשים אמיתיים ומקום אמיתי ברמה קולנועית, סרטון למשקיעים או לכנס, או קמפיין טלוויזיה. גם הכלים הכי טובים לא מכירים את הצוות שלכם, ולא יצלמו את המרפאה, את המטבח או את הדירה האמיתיים. אם הסרטון הוא הפנים של העסק לשנים הקרובות, השקעה בהפקה יכולה להיות החלטה נכונה.

אבל רוב העסקים לא צריכים סרטון אחד מושלם. הם צריכים סרטון קצר וטוב כל שבוע, לרילס, לטיקטוק ולסטטוס בוואטסאפ. ושם, הפקה מלאה לכל סרטון פשוט לא מחזיקה כלכלית. ובסרטונים קצרים, מה שעובד הוא הרבה פעמים דווקא מה שנראה אמיתי ופשוט: בעל העסק שמדבר למצלמה, תהליך עבודה מצולם מקרוב, או לקוח מרוצה שהסכים להופיע. את אלה לא צריך צוות כדי לצלם.

## שבע דרכים לחסוך בלי להיראות זול

1. **הגדירו מטרה אחת.** "שיכירו אותנו" זו לא מטרה. "שיקבעו תור לייעוץ" זו מטרה. סרטון עם מטרה אחת קצר יותר, ולכן זול יותר.
2. **קצרו.** רילס של 30 שניות עובד טוב יותר מסרטון של שתי דקות שאף אחד לא מסיים, ועולה פחות לערוך.
3. **צלמו בעצמכם.** טלפון עדכני, אור יום מהחלון ותנועה איטית מספיקים לרוב הסרטונים ברשתות. מה שחשוב הוא שהצילומים אמיתיים.
4. **יום צילום אחד, הרבה סרטונים.** אם כבר מזמינים צלם, תכננו מראש עשרה סרטונים קצרים מאותו יום, ולא סרטון אחד.
5. **כתבו את ההוק קודם.** שלוש השניות הראשונות קובעות אם יצפו בכל השאר. הוק טוב חוסך תקציב פרסום, כי סרטון שעוצר גלילה צריך פחות כסף כדי להגיע לאנשים.
6. **שלבו צילום אמיתי עם AI.** את המקום, הצוות והעבודה צלמו בעצמכם. את המעברים, האווירה, הקריינות והכתוביות אפשר להפיק בכלים אוטומטיים.
7. **אל תשלמו על כל פורמט בנפרד.** בקשו מראש גרסה אנכית, ריבועית ורוחבית מאותה עבודה, או השתמשו בכלי שמייצא את שלושתן יחד.

## איך מבקשים הצעת מחיר נכונה

כשפונים לספק, כדאי לבקש הצעה שמפרטת: כמה ימי צילום, כמה סבבי תיקונים, אילו פורמטים, האם המוזיקה ברישיון מסחרי, האם הכתוביות כלולות, והאם המחיר כולל מע״מ. בקשו לראות שלושה סרטונים שהספק הפיק לעסקים בגודל שלכם, ולא רק את סרטון הדגל שלו. ושאלו למי שייכים חומרי הגלם. אם בעוד חצי שנה תרצו לערוך מהם רילס חדש, תצטרכו אותם, ועדיף לדעת את זה מראש ולא לגלות שהם נמחקו.

## ומה עם סרטון ב-AI?

כלים כמו {{BRAND_NAME}} כותבים תסריט, יוצרים ויז׳ואלים, מקריינים בעברית, מוסיפים כתוביות ומרכיבים את הסרטון, תוך דקות. רילס של 30 שניות באיכות טיוטה עולה אצלנו <SampleCost preset="draft30" />, ובאיכות סטנדרט <SampleCost preset="standard30" />, כולל מע״מ.

זה לא תחליף להפקה קולנועית, וזה גם לא מתיימר להיות. זו דרך להפיק הרבה סרטונים קצרים, לבדוק אילו הוקים עובדים, ולפרסם בקביעות בלי לחכות לעורך. הכי טוב לשלב: להעלות צילומים אמיתיים של העסק, ולתת למערכת לעשות את כל השאר.

<Sources>
- סקירת מחירי סרטוני תדמית לשנת 2026, extra.co.il
- מחירון חבילות תדמית, vivistudio.co.il
- מחירון סרטונים קצרים עם קריינות, smartpush.co.il
- מחירי עריכת וידאו 2026, aviv-malka.com
- מחירון עריכת רילס, natigold.com
</Sources>

<CtaBox kind="pricing" />
```

### §8.4 מאמר 3 — `content/blog/reels-guide-small-business.mdx`

```mdx
---
title: "המדריך לרילס לעסק קטן: מהרעיון ועד הפרסום"
seoTitle: "המדריך לרילס לעסק קטן: מהרעיון ועד הפרסום"
description: "איך עושים רילס לעסק קטן שעוצר גלילה: הוק בשלוש השניות הראשונות, מבנה של 30 שניות, כתוביות בעברית, הנעה לפעולה, קצב פרסום ומה מודדים."
date: "2026-10-27"
tags: ["reels", "guides", "hooks"]
niches: []
cover: { src: "/media/blog/reels-guide-small-business.avif", alt: "בעלת עסק מחזיקה טלפון אנכי מול דלפק של בית קפה" }
cta: { kind: "create" }
---

רילס הוא היום הדרך הכי ישירה של עסק קטן להגיע לאנשים שעוד לא מכירים אותו. לא צריך ציוד, לא צריך עוקבים ולא צריך להיות "יוצרי תוכן". צריך להבין כמה כללים פשוטים, ולהתמיד. המדריך הזה עובר עליהם לפי הסדר: מהרעיון, דרך הצילום והכתוביות, ועד הפרסום והמדידה.

## 1. שלוש השניות הראשונות

ברשתות מחליטים מהר. לפי מחקר של פייסבוק ונילסן מ-2016, עד 47% מערך קמפיין וידאו נוצר כבר בשלוש השניות הראשונות. וטיקטוק מדווחת שביותר מ-63% מהסרטונים עם שיעור ההקלקה הגבוה ביותר, המסר המרכזי או המוצר מופיעים כבר בשלוש השניות הראשונות.

המסקנה: אל תפתחו בלוגו, ב"שלום לכולם" או בשם העסק. פתחו בהוק, משפט קצר שנוגע במשהו שהצופה רוצה, מפחד ממנו או סקרן לגביו, ועם תמונה שכבר זזה. "אל תלבינו שיניים לפני שאתם יודעים את זה" עובד. "מרפאת שיניים משפחתית מזמינה אתכם" לא.

## 2. מבנה של 30 שניות

לרוב העסקים, 15 עד 30 שניות מספיקות. מבנה שעובד כמעט תמיד:

1. **הוק** (0–3 שניות): המשפט שעוצר.
2. **הבעיה** (3–8): מה הצופה מרגיש או מפסיד.
3. **הפתרון** (8–20): מה אתם עושים, מראים ולא רק מספרים.
4. **הוכחה** (20–25): תוצאה אמיתית, תהליך או רגע מהעבודה.
5. **הנעה לפעולה** (25–30): דבר אחד שהצופה צריך לעשות עכשיו.

אם הסרטון ארוך יותר, בדקו מה אפשר לחתוך. כמעט תמיד אפשר.

## 3. טקסט על המסך וכתוביות

הרבה אנשים גוללים בלי סאונד, ולכן ההוק צריך להופיע גם על המסך, כבר בפריים הראשון. עד שמונה מילים, בשתי שורות לכל היותר. כתוביות לאורך כל הסרטון עוזרות גם לצופים בלי סאונד וגם לנגישות.

בעברית יש כמה דברים לשים לב אליהם: הכתוביות צריכות לרוץ מימין לשמאל גם כשיש בהן מספר, מחיר או מילה באנגלית; לא חותכים מילה באמצע שורה; ולא מנפישים אות אחר אות, כי האותיות הסופיות נשברות. אם הכלי שלכם מהפך את הסדר של "₪99" או של "Black Friday", החליפו כלי.

## 4. איפה לא לשים טקסט

הממשק של הרשתות מכסה חלקים מהמסך: שם החשבון והכיתוב למטה, כפתורי הלייק והשיתוף בצד. שמרו את ההוק בשליש העליון-מרכזי של המסך, את הכתוביות מעט מתחת לאמצע, ואל תשימו שום דבר חשוב בחלק התחתון של המסך או בפס הכפתורים שבצד.

## 5. לשון ופנייה

בעברית כל משפט "בוחר" מגדר. אם הקהל שלכם מעורב, פנו ברבים: "תבדקו", "שלחו לנו". אם הוא ברור, פנו אליו ישירות. אבל לא בצורות כפולות עם לוכסן, שבהן כותבים זכר ונקבה באותה מילה, לא בקריינות ולא על המסך. זה נראה כמו טופס, לא כמו סרטון. ובקריינות, כתבו מספרים במילים: "שלוש שעות", "שלושה ימים". כך הקריין לא יטעה.

## 6. הנעה לפעולה אחת

סרטון שמבקש שלושה דברים לא מקבל אף אחד מהם. לעסק מקומי, ההנעה הכי יעילה היא בדרך כלל וואטסאפ: "שלחו לנו 'תור' בוואטסאפ". אפשר גם "השיבו לסטטוס הזה", "שמרו את הסרטון" או "הקישור בביו". בחרו אחת, ושימו אותה גם בקריינות וגם על המסך.

## 7. קצב ולוח שנה

עדיף רילס אחד טוב בשבוע, כל שבוע, מחמישה סרטונים בשבוע אחד ואז שקט של חודש. התחילו בקצב שתוכלו לעמוד בו. השתמשו בלוח השנה הישראלי: "אחרי החגים", בלאק פריידיי, חנוכה, לפני פסח והחזרה ללימודים הם רגעים שבהם הקהל כבר מחפש. ובימים כמו יום הזיכרון ויום השואה — לא מפרסמים תוכן שיווקי.

## 8. AI ותיוג

אם הסרטון כולל תמונות או קטעים ריאליסטיים שנוצרו ב-AI, מטא, טיקטוק ויוטיוב מבקשות לסמן זאת, ולפעמים מסמנות בעצמן. תיוג לא פוגע בסרטון טוב. מה שפוגע הוא תחושה שמשהו מזויף: לקוחה מרוצה שלא קיימת, או מספר שלא נכון. על אלה לא מתפשרים.

## 9. מה מודדים

אל תסתכלו רק על לייקים. בתובנות של כל רשת אפשר לראות כמה מהצופים המשיכו לצפות אחרי השניות הראשונות. זה המדד שאומר לכם אם ההוק עובד. נסו את אותו סרטון עם שני הוקים שונים, השוו אחרי כמה ימים, ושמרו את מה שעבד.

## 10. כשנגמרים הרעיונות

כמעט לכל עסק יש מאגר רעיונות שהוא לא משתמש בו. הנה כמה נקודות פתיחה שעובדות כמעט בכל נישה:

- שאלה שלקוחות שואלים כל שבוע, ותשובה בשלושה משפטים.
- טעות נפוצה בתחום שלכם, ואיך נמנעים ממנה.
- מאחורי הקלעים: איך נראה הבוקר בעסק לפני שהלקוחות מגיעים.
- לפני ואחרי של עבודה אמיתית, באישור הלקוח.
- מיתוס בתחום שלכם, ומה נכון באמת.
- היכרות עם אחד מאנשי הצוות, בהסכמתו.
- מה כולל השירות, ולמי הוא לא מתאים.

לכל אחד מהרעיונות האלה יש הוקים מוכנים בספריית ההוקים, לפי נישה, שאפשר להעתיק ולהתאים לעסק שלכם בכמה שניות.

## צ׳קליסט לפני פרסום

- ההוק מופיע בשלוש השניות הראשונות, גם בקול וגם על המסך
- הסרטון נמשך 30 שניות או פחות, ואין בו רגע מת
- יש כתוביות, והן תקינות מימין לשמאל
- אין טקסט חשוב בחלק התחתון של המסך
- יש הנעה לפעולה אחת ברורה
- כל מספר, מחיר והמלצה בסרטון אמיתיים
- אם יש תוכן AI ריאליסטי, הוא מסומן

<Sources>
- פייסבוק ונילסן, פברואר 2016: עד 47% מערך קמפיין וידאו בשלוש השניות הראשונות, about.fb.com
- TikTok for Business, "9 creative tips to drive auction ad performance", ads.tiktok.com
</Sources>

<CtaBox kind="create" />
```

**קריטריוני קבלה**
- [ ] שלושת המאמרים נבנים, עוברים את סכמת ה-frontmatter, ומופיעים ב-`/blog` ובעמודי התגיות שלהם.
- [ ] כל `HookEmbed` מצביע על הוק קיים ומפורסם; מזהה שגוי מפיל את ה-build.
- [ ] `SampleCost` מציג ערכים זהים לטבלת "כמה עולה סרטון" בעמוד המחירים.
- [ ] בכל מאמר יש לפחות 2 קישורים פנימיים לעמודי נישה או הוקים, ו-`BlogPosting` תקין ב-Rich Results Test.
- [ ] מאמר עם `draft: true` לא נבנה בפרודקשן ולא נכנס למפת האתר.
- [ ] ספירת מילים: כל אחד משלושת המאמרים בין 700 ל-1,000 מילים (בדיקת יחידה ב-`tests/unit/content.test.ts`).

---

## §9. אודות, יצירת קשר ושאלות נפוצות

### §9.1 אודות (`/about`)

- Breadcrumbs: ראשי › אודות
- H1: **"בנינו את {{BRAND_NAME}} כי לכל עסק מגיע סרטון טוב"**
- **פתיח:**

> בעל עסק קטן בישראל עושה הכול לבד: עונה ללקוחות בוואטסאפ, מנהל את היומן, מוציא חשבוניות, ובין לבין אמור גם "להעלות תוכן". סרטון טוב עלה עד היום אלפי שקלים או שבוע של עבודה מול עורך. ובכלים הבינלאומיים, העברית נשמעה מתורגמת, הכתוביות התהפכו, והמחיר היה בדולרים.
>
> {{BRAND_NAME}} נולד כדי לסגור את הפער הזה. אתם מספרים מה העסק עושה ולמי, ומקבלים סרטון תדמית או רילס בעברית טבעית: הוק שנכתב לנישה שלכם, קריינות, כתוביות מימין לשמאל, מוזיקה והלוגו שלכם — מוכן לפרסום, בשלושה פורמטים.

- **H2 "מה חשוב לנו"** — שישה כרטיסים:

| כותרת | טקסט |
|---|---|
| עברית כשפת אם | כל משפט נכתב בעברית מלכתחילה, לא מתורגם. פנייה נכונה, מספרים שנשמעים נכון בקריינות, וכתוביות שלא מתהפכות כשיש בהן מחיר או מילה באנגלית. |
| תוצאה, לא עוד כלי | אנחנו לא מבקשים מכם לבחור בין מנועי AI. אנחנו בוחרים בשבילכם, ומחזירים סרטון מוכן לפרסום. |
| אמת בפרסום | המערכת לא ממציאה מספרים, ביקורות או "נשארו 3 מקומות". וגם באתר שלנו: אין מונים מנופחים, אין המלצות מומצאות ואין לוגואים של לקוחות שלא עבדו איתנו. |
| מחיר שקוף | שקלים, כולל מע״מ, עם חשבונית מס. כל כפתור מראה כמה הוא עולה, יצירה שנכשלה מחזירה קרדיטים, ומבטלים אונליין בכל רגע. |
| נגישות מהיסוד | האתר והאפליקציה נבנים לפי WCAG 2.2 ברמה AA, וכל סרטון יוצא עם קובץ כתוביות, כדי שגם האתר שלכם יהיה נגיש. |
| פרטיות | המידע נשמר בשרתים באירופה (חלק מהעיבוד אצל ספקים בארה״ב), לא משמש לאימון מודלים, ואפשר להוריד או למחוק אותו בכל רגע. |

- **H2 "מי אנחנו"**: **"{{BRAND_NAME}} מפותח ומופעל בישראל על ידי {{LEGAL_ENTITY_NAME}}. אנחנו עונים בעברית, מוציאים חשבונית מס ישראלית, ומכירים את לוח השנה שלכם — מאחרי החגים ועד לפני פסח."** אם `content/about.json` מכיל `founders` (שם, תפקיד, תמונה, משפט אחד) — מוצג כרטיס לכל אחד; אם הרשימה ריקה — הבלוק לא מוצג.
- **H2 "רוצים לדבר?"**: **"שאלה, רעיון או שיתוף פעולה — נשמח לשמוע."** כפתורים: **"דברו איתנו"** (`/contact`) · **"צרו סרטון בחינם"** (`cta_clicked {location:"about"}`).
- מטא: title **"אודות {{BRAND_NAME}}: סרטונים לעסקים, בעברית"**; description **"{{BRAND_NAME}} הופך כל עסק ישראלי לסרטון תדמית ורילס בעברית טבעית, תוך דקות ובמחיר שקוף בשקלים. מי אנחנו ומה חשוב לנו."**
- JSON-LD: `Organization` (מלא), `BreadcrumbList`.

### §9.2 יצירת קשר (`/contact`)

- Breadcrumbs: ראשי › יצירת קשר
- H1: **"דברו איתנו"**
- פתיח: **"שאלה לפני שמתחילים, תקלה במוצר, או בקשה בנושא פרטיות ונגישות — אנחנו כאן. אנחנו עונים בימים א׳–ה׳, ומשתדלים לחזור באותו יום."**
- **ערוצים** (כרטיסים, לפני הטופס):

| כרטיס | טקסט | פעולה |
|---|---|---|
| וואטסאפ | הדרך הכי מהירה לשאלה קצרה | "פתחו שיחה בוואטסאפ" |
| מייל כללי | לכל שאלה, הצעה או שיתוף פעולה | `hello@{{DOMAIN}}` (קישור `mailto:`, בתוך `<bdi>`) |
| תמיכה למשתמשים | תקלה בחשבון, ביצירה או בחיוב | `support@{{DOMAIN}}` |
| ביטול מנוי | הכי מהיר: כפתור "ביטול מנוי" בעמוד החיוב. אפשר גם במייל, בטלפון או בטופס שכאן | "לביטול מנוי" (`/app/billing/cancel`) |
| נגישות | {{A11Y_COORDINATOR_TITLE}}: {{A11Y_COORDINATOR_NAME}} | "להצהרת הנגישות" |
| פרטיות | בקשות עיון, תיקון ומחיקה של מידע | `privacy@{{DOMAIN}}` |

- **טופס (`ContactForm`)** → `POST /api/contact`:

| שדה | תווית | סוג | חובה | הודעת שגיאה |
|---|---|---|---|---|
| `name` | שם מלא | טקסט, `autocomplete="name"` | כן, 2–80 תווים | "כתבו את השם שלכם (לפחות 2 תווים)." |
| `email` | מייל | `LtrInput`, `type="email"` | כן | ריק: "כתבו כתובת מייל כדי שנוכל לחזור אליכם." · לא תקין: "כתובת המייל לא נראית תקינה. בדקו שוב, למשל name@business.co.il" |
| `phone` | טלפון (לא חובה) | `LtrInput`, `type="tel"` | לא | "מספר הטלפון לא נראה תקין. אפשר לכתוב <ltr>050-1234567</ltr> או <ltr>+972-50-1234567</ltr>." |
| `topic` | על מה תרצו לדבר? | Select | כן | "בחרו נושא, כדי שהפנייה תגיע לאדם הנכון." |
| `message` | ההודעה | textarea, מונה תווים | כן, 10–5,000 תווים (כמו `ContactBody`, חלק 04 §21.4) | קצר: "ספרו לנו קצת יותר (לפחות 10 תווים)." · ארוך: "ההודעה ארוכה מדי. אפשר עד 5,000 תווים." |
| `marketingOptIn` | "אשמח לקבל מדי פעם עדכונים והצעות במייל. אפשר להסיר בכל רגע." | Checkbox **לא מסומן** | לא | — |
| `website` | (honeypot, מוסתר מכולם כולל קוראי מסך, `tabindex="-1"`, `autocomplete="off"`) | — | — | בקשה עם ערך נדחית בשקט (204) |

- **`?topic=`** בכתובת (למשל `/contact?topic=accessibility` מהצהרת הנגישות) בוחר מראש את הנושא, רק אם הערך ברשימה.
- **ערכי `topic`:** `sales` "שאלה לפני שמתחילים" · `support` "תמיכה במוצר" · `accessibility` "נגישות" · `privacy` "פרטיות ומידע אישי" · `cancellation` "ביטול מנוי או החזר" · `press` "עיתונות ושיתופי פעולה".
- **טקסט עזר דינמי לפי נושא** (מתחת ל-Select, `aria-live="polite"`):
  - `cancellation`: **"הדרך המהירה ביותר: כפתור "ביטול מנוי" בעמוד החיוב באפליקציה. אפשר לבטל גם כאן — כתבו את כתובת המייל של החשבון, ונשלח אישור ביטול למייל."**
  - `accessibility`: **"פניות בנושא נגישות: {{A11Y_COORDINATOR_TITLE}}, {{A11Y_COORDINATOR_NAME}}, {{A11Y_COORDINATOR_PHONE}}, {{A11Y_COORDINATOR_EMAIL}}. כדאי לציין באיזה עמוד נתקלתם בבעיה ובאיזה דפדפן או טכנולוגיה מסייעת השתמשתם."**
  - `privacy`: **"לבקשת עיון, תיקון או מחיקה, כתבו מאיזו כתובת מייל נרשמתם. ייתכן שנבקש לאמת את זהותכם לפני שנמסור מידע."**
- **הודעת פרטיות מתחת לטופס** (סעיף 11, קצרה): **"נשתמש בפרטים רק כדי לחזור אליכם ולטפל בפנייה. השם, המייל, הנושא וההודעה נדרשים כדי שנוכל לענות; בלעדיהם לא נוכל לטפל בפנייה. הפרטים נשמרים אצלנו ואצל ספקי השירות שלנו, כמפורט ב<מדיניות הפרטיות>."**
- **כפתור:** **"שליחה"** · בזמן שליחה: **"שולחים…"** (מנוטרל, `aria-busy`).
- **הצלחה** (מחליף את הטופס, הפוקוס עובר לכותרת): כותרת **"קיבלנו, תודה!"** · **"נחזור אליכם למייל {email} בהקדם. בינתיים, אפשר להציץ בשאלות הנפוצות."** · כפתור **"לשאלות הנפוצות"**.
- **שגיאות שרת:** `RATE_LIMITED` → **"שלחתם כמה פניות ברצף. נסו שוב בעוד כמה דקות, או כתבו לנו בוואטסאפ."** · אחרת → **"משהו השתבש בשליחה. נסו שוב, או כתבו לנו ל-hello@{{DOMAIN}}."**
- כשמסומן `marketingOptIn` — נשלח מייל אישור הרשמה כפול (`newsletter_confirm`), כמו בטופס הניוזלטר. ההסכמה `marketing_email` נרשמת ב-`consents` (`source: "newsletter"`) רק אחרי הלחיצה על קישור האישור (חלק 04 §21.4).
- פנייה בנושא `cancellation` נכנסת ל-`contact_messages` ומסומנת לטיפול בתור ביטולים בפאנל הניהול. היעד: ביטול ומייל אישור באותו יום עסקים, ולכל המאוחר תוך שלושה ימי עסקים מקבלת הפנייה (חלק 06 §10.2, ראו גם §10.5).
- אירוע: `contact_submitted {topic}`.
- מטא: title **"יצירת קשר | {{BRAND_NAME}}"**; description **"שאלה, תמיכה, ביטול מנוי, נגישות או פרטיות — כתבו לנו בוואטסאפ, במייל או בטופס, ונחזור אליכם בהקדם."**

### §9.3 שאלות נפוצות (`/faq`)

- Breadcrumbs: ראשי › שאלות נפוצות
- H1: **"שאלות נפוצות"**
- פתיח: **"כל מה ששואלים אותנו לפני שמתחילים, ואחרי. לא מצאתם? כתבו לנו."**
- שדה סינון (צד לקוח): תווית "חיפוש בשאלות", placeholder "למשל: ביטול, חשבונית, קריינות". אין תוצאות: **"לא מצאנו שאלה כזו. כתבו לנו, ונענה."**
- קטגוריות (כל אחת `<h2>` + `FaqAccordion`), ובסוף העמוד כפתור **"לא מצאתם תשובה? דברו איתנו"**.
- JSON-LD: `FAQPage` עם כל השאלות.
- הערכים בסוגריים מסולסלים (`{draftCredits}` וכו׳) מוזרקים בזמן הבנייה מ-`credit_costs`, `plans` ו-`app_settings`.

**איך זה עובד**

| מזהה | שאלה | תשובה |
|---|---|---|
| `what-you-get` | מה בדיוק מקבלים? | סרטון מוכן לפרסום: תסריט בעברית שנכתב לנישה שלכם, הוק לפתיחה, ויז׳ואלים שנוצרו ב-AI או מהתמונות שלכם, קריינות בעברית, כתוביות מימין לשמאל, מוזיקה, הלוגו שלכם וכרטיס סיום עם הנעה לפעולה. מקבלים קובץ MP4 בפורמט 9:16, ובתוכניות בתשלום גם ב-1:1 וב-16:9, ולצדו קובצי כתוביות SRT ו-VTT וטקסט מוכן לפוסט. |
| `no-editing` | צריך לדעת לערוך וידאו? | לא. בוחרים נישה, מספרים על העסק או מדביקים קישור, בוחרים הוק ומאשרים את התסריט. את העריכה, את הסנכרון של הכתוביות לקריינות ואת ההרכבה עושה המערכת. אם רוצים לשנות משהו אחר כך, משנים טקסט או מחליפים סצנה, בלי ציר זמן מסובך. |
| `how-long` | כמה זמן לוקח לקבל סרטון? | התסריט מתחיל להיכתב מול העיניים תוך שניות, והתצוגה המקדימה מוכנה מיד. היצירה עצמה לוקחת בדרך כלל כמה דקות, ותלויה באורך הסרטון ובאיכות שבחרתם. אפשר לסגור את הדף בינתיים: נשלח לכם מייל כשהסרטון מוכן. |
| `own-media` | אפשר להשתמש בתמונות ובסרטונים שלי? | כן, ומומלץ. אפשר להעלות תמונות וסרטונים מהטלפון, ואנחנו משלבים אותם בסצנות, גם עם תנועה עדינה לתמונות. עסקים שמצלמים את המקום האמיתי, את הצוות ואת העבודה מקבלים סרטונים אמינים יותר. אם מופיעים בצילומים לקוחות או ילדים, צריך את ההסכמה שלהם, ושל ההורים, לפני הפרסום. |
| `free` | מה כולל המסלול החינמי? | {trialCredits} קרדיטים לניסיון, שמספיקים בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים, בפורמט 9:16 וברזולוציית 720p. גישה מלאה לספריית ההוקים, ובלי כרטיס אשראי. אין חיוב אוטומטי בסוף הניסיון: אם תרצו להמשיך, תבחרו תוכנית בעצמכם. |
| `restricted` | יש תוכן שאי אפשר ליצור? | כן. אנחנו לא יוצרים תעמולה פוליטית, סרטונים עם דמות או קול של אנשים אמיתיים בלי הסכמתם, תוכן מיני או פוגעני, וגם לא המלצות לקוחות מומצאות או מספרים שלא אישרתם. בנישות מפוקחות, כמו רפואה, משפט ופיננסים, המערכת מוסיפה את ההסתייגויות הנדרשות ונמנעת מהבטחת תוצאות. הפירוט במדיניות השימוש ההוגן ב-AI. |

**עברית, קול וכתוביות**

| מזהה | שאלה | תשובה |
|---|---|---|
| `hebrew-voice` | הקריינות בעברית נשמעת טבעית? | בחרנו את הקולות אחרי האזנה של דוברי עברית, והתסריט נכתב מראש כך שיישמע טוב בקול: מספרים במילים, מגדר נכון ובלי משפטים מתורגמים. אם מילה מסוימת יוצאת לא נכון, למשל שם של העסק או של רחוב, מוסיפים אותה למילון ההגייה פעם אחת, והיא תיאמר נכון בכל הסרטונים הבאים. אפשר גם לוותר על קריינות ולהשאיר כתוביות ומוזיקה. |
| `faq-genders` | הסרטון יכול לפנות לנשים, לגברים או לכולם? | כן. בוחרים למי פונים — ברבים (ברירת המחדל), לנשים או לגברים — ואם הקול המקריין הוא של אישה או של גבר. התסריט נכתב בהתאם, כולל פעלים בגוף ראשון כמו "אני ממליצה" או "אני ממליץ", ובלי צורות כפולות עם לוכסן. |
| `faq-english-words` | מה עם שמות באנגלית, מספרים ומחירים? | המערכת מזהה מילים באנגלית, מספרים, מחירים ומספרי טלפון, ושומרת על הסדר הנכון שלהם בתוך שורה בעברית, גם בכתוביות. בקריינות, מספרים נאמרים במילים, ושמות לועזיים נכתבים לקריין באותיות עבריות כדי שיישמעו נכון. אם משהו עדיין לא נשמע טוב, מוסיפים אותו למילון ההגייה. |
| `accessibility` | הכתוביות נגישות? אפשר לקבל קובץ כתוביות? | כן. כל סרטון יוצא עם כתוביות צרובות בעברית, ובנוסף עם קובצי SRT ו-VTT שאפשר להעלות ליוטיוב, לפייסבוק או לנגן באתר שלכם. זה עוזר לצופים בלי סאונד, ולעסקים שצריכים לעמוד בתקן הנגישות הישראלי באתר שלהם. |

**קרדיטים ותשלום**

| מזהה | שאלה | תשובה |
|---|---|---|
| `credits` | איך עובדים הקרדיטים? | כל פעולה עולה מספר קבוע של קרדיטים, ואת המחיר רואים לפני כל לחיצה. רילס של 30 שניות באיכות טיוטה עולה בערך {draftCredits} קרדיטים, ובאיכות סטנדרט בערך {standardCredits}. קרדיטים של מנוי מתחדשים כל חודש, ומה שלא נוצל עובר לחודש הבא. קרדיטים מחבילה חד-פעמית לא פגים בכלל. |
| `pricing-how-many-videos` | כמה סרטונים יוצאים מכל תוכנית? | זה תלוי באורך ובאיכות. כדי שיהיה קל להשוות, אנחנו מחשבים לפי רילס של 30 שניות באיכות טיוטה (בערך {draftCredits} קרדיטים): בתוכנית בסיס יוצאים {starterVideos, plural, other {כ-# סרטונים}} בחודש, בעסק כ-{businessVideos} ובסוכנות כ-{agencyVideos}. סרטון באיכות סטנדרט עולה בערך {standardCredits} קרדיטים, וסרטון תדמית של 60 שניות באיכות פרימיום בערך {premiumPromoCredits}. את העלות המדויקת רואים לפני כל יצירה. |
| `pricing-rollover` | מה קורה לקרדיטים שלא ניצלתי? | קרדיטים של המנוי שלא נוצלו עוברים לחודש הבא, ותקפים עד סופו. כלומר, כל הקצאה חודשית תקפה חודשיים. כשמשתמשים בקרדיטים, המערכת מנצלת קודם את אלה שיפוגו ראשונים, כדי שלא תפסידו כלום. בעמוד החיוב תמיד רואים כמה קרדיטים יפוגו בקרוב ומתי. |
| `pricing-packs-expire` | קרדיטים מחבילה חד-פעמית פגים? | לא. קרדיטים שקניתם בחבילה נשארים בחשבון כל עוד החשבון קיים, גם בלי מנוי, גם אחרי ביטול מנוי וגם אם התוכנית שלכם חוזרת לחינמית. |
| `failure` | מה קורה אם יצירה נכשלת? | הקרדיטים חוזרים אליכם אוטומטית, בלי לפנות לאף אחד. אם רק סצנה אחת לא הצליחה, בונים אותה מתמונה בתנועה במקום וידאו, מחזירים את הקרדיטים על הקליפ ומסמנים לכם את זה בפרויקט. ואם ביטלתם יצירה באמצע, משלמים רק על השלבים שכבר הסתיימו. |
| `pricing-upgrade` | אפשר לשדרג או לעבור לתוכנית קטנה יותר? | כן, בכל רגע, מעמוד החיוב. שדרוג נכנס לתוקף מיד: משלמים רק על יתרת הימים בתקופה הנוכחית, ומקבלים את הקרדיטים הנוספים באופן יחסי. מעבר ממנוי חודשי לשנתי נכנס לתוקף בסוף החודש, או מיד אם תבחרו בכך. מעבר לתוכנית קטנה יותר, או משנתי לחודשי, נכנס לתוקף בסוף התקופה ששולמה, והקרדיטים שכבר קיבלתם נשארים לפי התוקף שלהם. |
| `pricing-annual` | איך עובד מנוי שנתי? | משלמים פעם בשנה, בהנחה של 20% לעומת המחיר החודשי, והקרדיטים מגיעים כל חודש באותו יום, בדיוק כמו במנוי חודשי. שבעה ימים לפני החידוש השנתי נשלח לכם מייל תזכורת. אפשר לבטל בכל עת: החידוש לא יתבצע, ואם תבקשו, נחזיר את החלק היחסי על החודשים שעוד לא התחילו, לפי מדיניות הביטול. |
| `invoice-vat` | יש חשבונית מס? המחירים כוללים מע״מ? | כן וכן. כל המחירים באתר בשקלים וכוללים מע״מ (אלא אם מסומן "לפני מע״מ"), ועל כל תשלום נשלחת אליכם במייל חשבונית מס. עסקים יכולים לראות את המחירים לפני מע״מ בעמוד המחירים ולהוסיף מספר עוסק או ח״פ לפרטי החיוב, ובחשבונית שעוברת את הסף של רשות המסים לבקשת מספר הקצאה, אנחנו מבקשים אותו בשבילכם. |
| `pricing-payment-methods` | איך אפשר לשלם? | בכרטיס אשראי, ישראלי או בינלאומי. חבילות קרדיטים אפשר לשלם גם ב-Bit. התשלום מתבצע בעמוד מאובטח של חברת הסליקה. אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס. תשלומים (פריסה) על מנוי שנתי עוד לא זמינים. |
| `pricing-watermark` | מה זה סימן המים בתוכנית החינמית? | בסרטונים שנוצרים לפני התשלום הראשון מופיעים סימן מים קטן של {{BRAND_NAME}} בפינה, ושורה "נוצר ב{{BRAND_NAME}}" בכרטיס הסיום. התשלום הראשון, על מנוי או על חבילת קרדיטים, מסיר אותם מכל הסרטונים שתיצרו מאותו רגע. סרטון קודם אפשר להרכיב מחדש בלי סימן מים, בעלות ההרכבה בלבד. |

- **גרסה בלי Bit** (`marketing.faq.items.pricing-payment-methods.aByCardOnly`, מוצגת כש-`bitEnabled = false`, §7.3): **"בכרטיס אשראי, ישראלי או בינלאומי. התשלום מתבצע בעמוד מאובטח של חברת הסליקה. אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס. תשלומים (פריסה) על מנוי שנתי עוד לא זמינים."**

**ביטול והחזרים**

| מזהה | שאלה | תשובה |
|---|---|---|
| `cancel` | איך מבטלים מנוי? | אונליין, בכל רגע: מבטלים מעמוד החיוב באפליקציה, לוחצים "ביטול מנוי" ומאשרים, בלי שיחת שימור. קישור ישיר לביטול יש גם בתחתית כל עמוד באתר. אחרי הביטול לא יהיו חיובים נוספים, והחשבון ממשיך לעבוד עד סוף התקופה ששולמה. אפשר לבטל גם במייל או בטלפון. ב-14 הימים הראשונים אחרי תשלום אפשר גם לבקש החזר כספי, לפי מדיניות הביטול. |
| `pricing-refund-14` | אפשר לקבל החזר כספי? | כן. ב-14 הימים הראשונים אחרי תשלום על תוכנית או חבילה אפשר לבטל ולקבל החזר, בניכוי שווי הקרדיטים שכבר נוצלו ודמי ביטול של 5% או ₪100, הנמוך מביניהם. את הסכום המדויק רואים לפני שמאשרים. אנשים עם מוגבלות, אזרחים ותיקים ועולים חדשים זכאים בנסיבות מסוימות לתקופה של עד ארבעה חודשים. הפרטים במדיניות הביטול וההחזרים. |
| `faq-refund-extended` | מי זכאי לתקופת ביטול מורחבת? | אנשים עם מוגבלות, אזרחים ותיקים (בני 65 ומעלה) ועולים חדשים, כשהעסקה נעשתה תוך שיחה עם נציג שלנו — כולל בצ׳אט או במייל — זכאים לבטל תוך ארבעה חודשים במקום 14 יום. מסמנים את זה בתהליך הביטול, ונציג יחזור אליכם לטפל בבקשה. |

**זכויות, תוכן ו-AI**

| מזהה | שאלה | תשובה |
|---|---|---|
| `ownership` | למי שייכים הסרטונים? | לכם, ככל שהחוק מאפשר. אתם יכולים לפרסם אותם בכל מקום, גם בפרסום ממומן, ולהשתמש בהם גם אחרי שהמנוי מסתיים. בתוכנית החינמית מופיע סימן מים של {{BRAND_NAME}} עד התשלום הראשון. הפרטים המלאים בתנאי השימוש. |
| `ai-label` | צריך לסמן שהסרטון נוצר ב-AI? | ככל שידוע לנו, בישראל אין כיום חובה כללית בחוק לסמן פרסומת מסחרית שנוצרה ב-AI (לתעמולת בחירות יש כללים מיוחדים, ואנחנו לא יוצרים תוכן כזה). אבל מטא, טיקטוק ויוטיוב דורשות לסמן תוכן ריאליסטי שנוצר או שונה ב-AI, ולפעמים מסמנות אותו בעצמן. אצלנו מוסיפים תווית "נוצר באמצעות AI" בלחיצה, ולפני ההורדה מקבלים תזכורת קצרה לכללים של כל פלטפורמה. |
| `faq-music-rights` | מותר להשתמש במוזיקה בסרטונים? | כן. כל רצועה בספריית המוזיקה שלנו נוצרה בשבילנו או נרכשה ברישיון שמאפשר שימוש מסחרי בסרטונים שלכם, כולל ברשתות ובפרסום ממומן. גם מוזיקה מקורית שנוצרת לסרטון מיועדת לשימוש בו. אי אפשר להפיץ את קובצי המוזיקה בנפרד מהסרטון. |
| `faq-real-people` | אפשר ליצור סרטון עם הפנים או הקול שלי? | אפשר להעלות צילומים וסרטונים שלכם ושל העסק, והם ישולבו בסרטון. אווטאר דיגיטלי ושיבוט קול עדיין לא זמינים. כשיהיו, רק האדם עצמו יוכל ליצור אותם, אחרי הסכמה מוקלטת שאפשר לבטל בכל רגע. אנחנו לא יוצרים דמות או קול של אדם אחר, ובוודאי לא של אישי ציבור. |

**פרטיות, אבטחה ונגישות**

| מזהה | שאלה | תשובה |
|---|---|---|
| `faq-data-training` | אתם מאמנים מודלים על התוכן שלי? | לא. אנחנו לא משתמשים בתוכן, בתמונות או בפרטי העסק שלכם כדי לאמן מודלים, והבקשות לספקי ה-AI נשלחות בהגדרה שמונעת מהם לשמור אותן לצורך אימון. הפרטים במדיניות הפרטיות. |
| `faq-data-location` | איפה נשמר המידע שלי? | מסד הנתונים והקבצים שלנו מאוחסנים בשרתים באירופה (פרנקפורט, גרמניה), ושם גם רצים השרתים של האתר. ספקי ה-AI וחלק משירותי התשתית פועלים בארצות הברית, ולכן חלק מהמידע עובר לשם לצורך עיבוד. הרשימה המלאה של ספקי המשנה נמצאת במדיניות הפרטיות. |
| `faq-delete-account` | איך מוחקים את החשבון והמידע? | בהגדרות, תחת "פרטיות", אפשר להוריד עותק של כל המידע שלכם וגם למחוק את החשבון. המחיקה כוללת את הפרויקטים, הקבצים והסרטונים, ומסתיימת תוך 30 יום. חשבוניות ורשומות תשלום נשמרות כל עוד חוקי המס מחייבים. |
| `faq-site-accessibility` | האתר נגיש? | אנחנו בונים ובודקים את האתר והאפליקציה לפי WCAG 2.2 ברמה AA, שמחמירה יותר מהדרישה של התקן הישראלי ת״י 5568. אין לנו תוסף נגישות צף, כי הנגישות בנויה בתוך האתר עצמו. אם נתקלתם בבעיה, כתבו לרכז הנגישות שלנו — הפרטים בהצהרת הנגישות. |

- `faq-data-training` נשען על כך שכל בקשה ל-OpenRouter, גם לנקודות המדיה, נשלחת עם `provider: { data_collection: "deny" }` (חלק 05 §4) `[M0-verify]`. אם ספייק ה-M0 מראה שנקודת מדיה דוחה את השדה, השדה מושמט רק בה, ההחלטה נרשמת ב-`DECISIONS.md`, והנוסח כאן ובמדיניות הפרטיות (§10.3, סעיפים 6 ו-8) מתעדכן באותו PR.

**סוכנויות וצוותים**

| מזהה | שאלה | תשובה |
|---|---|---|
| `agencies` | זה מתאים גם לסוכנויות ולמנהלי סושיאל? | בהחלט. בתוכנית הסוכנות יש עד 15 סביבות לקוח, ערכת מותג נפרדת לכל לקוח, עד 10 משתמשים, קישורי אישור שהלקוח פותח בלי להירשם, ודפי שיתוף בלי המיתוג שלנו. הקרדיטים מנוהלים במקום אחד, וכל לקוח רואה רק את שלו. |
| `faq-client-approval` | איך עובד אישור לקוח? | בתוכניות עסק וסוכנות שולחים ללקוח קישור לסרטון. הלקוח צופה, מאשר או מבקש שינויים עם הערה, בלי להירשם. אתם מקבלים התראה ומייל ברגע שהוא החליט, וכל ההיסטוריה נשמרת בפרויקט. |
| `faq-team-seats` | אפשר לעבוד כצוות? | כן. בתוכנית עסק יש עד 3 משתמשים, ובסוכנות עד 10, וצופים לא נספרים במכסה. לכל משתמש יש הרשאה: בעלים, מנהל, עורך או צופה. רק בעלים ומנהלים רואים חיובים, ורק עורכים ומעלה יכולים ליצור סרטונים ולהוציא קרדיטים. |

**קריטריוני קבלה**
- [ ] טופס יצירת הקשר: כל הודעת שגיאה מקושרת לשדה ב-`aria-describedby`, הפוקוס עובר לשדה השגוי הראשון, וה-honeypot לא נחשף לקורא מסך.
- [ ] `marketingOptIn` לא מסומן כברירת מחדל; כשהוא מסומן נשלח מייל אישור כפול, ושורת `consents` נרשמת רק אחרי האישור.
- [ ] `/faq` מציג את כל 34 השאלות, עם `FAQPage` תקין, והסינון מכריז על מספר התוצאות.
- [ ] כל מספר בסוגריים מסולסלים בתשובות מוזרק מהנתונים; בדיקת CI נכשלת אם נשאר `{` לא מוחלף ב-HTML הסופי.
- [ ] `content/about.json` ריק → אין בלוק מייסדים ואין כותרת ריקה.

---

## §10. הדפים המשפטיים

### §10.1 מסגרת משותפת (`LegalPage`)

- שבעה דפים, כל אחד קובץ ב-`content/legal/{slug}.mdx`, מרונדרים בתבנית אחת `LegalPage` תחת `/legal/{slug}`: `terms`, `privacy`, `cancellation`, `accessibility`, `ai-policy`, `likeness-consent`, `cookies`. הפניה קבועה אחת (`next.config.ts` → `redirects`, 308): `/accessibility` → `/legal/accessibility` (§1.1). ⚖️ כל שבעת הדפים הם טיוטה שממתינה לאישור עורך דין, ורשומים ברשימת ההחלטות שממתינות לאישור בחלק 06 §25.
- **הערות למפתח בתוך הנוסח:** בנוסחים שבסעיפים §10.2–§10.8, סימוני ⚖️ ו-`[M0-verify]` והערות בסוגריים שמפנות לחלקים אחרים במסמך הזה (למשל "(חלק 06 §10.1)") הן הוראות למפתח, ולא נכנסות לקובצי ה-MDX. כל השאר הוא הנוסח שמוצג.
- **תנאי הקרדיטים** הם פרק נפרד בתוך תנאי השימוש, עם עוגן קבוע `#credits` (`/legal/terms#credits`), ועמוד המחירים והאפליקציה מקשרים אליו ישירות.

```yaml
# frontmatter לכל דף משפטי
title: "תנאי שימוש"
slug: "terms"
version: "2026-10-13"                  # תאריך (YYYY-MM-DD, ואפשר סיומת .n); נרשם ב-consents.version — אותו פורמט ש-ConsentBody מקבל (חלק 04 §21.4)
effectiveDate: "{{LEGAL_EFFECTIVE_DATE}}"
reviewStatus: "draft"                  # draft | approved
material: false                        # true בגרסה שמשנה מהותית; מפעיל terms_update וקבלה מחדש (חלק 06 §11.12)
summary:                               # תיבת "בקצרה" בראש הדף
  - "…"
```

- **מבנה העמוד:** Breadcrumbs (ראשי › {title}) · H1 · שורת מטא "בתוקף מ-{effectiveDate} · גרסה {version}" · **באנר טיוטה** (כל עוד `reviewStatus: "draft"`): **"טיוטה לבדיקת עורך דין. הנוסח טרם אושר סופית, ועשוי להשתנות לפני ההשקה."** · תיבת **"בקצרה"** עם ה-`summary` ושורה **"התקציר נועד לנוחותכם. הנוסח המחייב הוא הנוסח המלא שלמטה."** · תוכן עניינים מה-H2 · התוכן · **"גרסאות קודמות"** (קישורים ל-`content/legal/archive/{slug}-{version}.mdx`, מוצגים ב-`/legal/{slug}?v={version}` עם `noindex`) · תיבת יצירת קשר.
- טיפוגרפיה של קריאה ארוכה (68ch, גוף 18px), כותרות ממוספרות, עוגן לכל H2 (`id` באנגלית קבוע, למשל `#credits`, `#retention`, `#subprocessors`).
- **שער השקה:** `scripts/check-content.ts --launch` (רץ ב-CI על ענף `main` לפני פריסת פרודקשן ב-M7) נכשל אם יש דף משפטי עם `reviewStatus: "draft"`, או אם נשאר בקוד, בתוכן או בדפים משפטיים משתנה `{{…}}` כלשהו מרשימת משתני התוכן של חלק 06 §20 (חוץ מ-`{{VERCEL_TEAM_SLUG}}`, שאינו בקוד, ו-`{{DPO_NAME}}`, שמותר להשאיר ריק: המשפט שמזכיר אותו מוסתר). האישור המשפטי (תאריך, שם עורך הדין) נרשם ב-`DECISIONS.md`.
- **משתנים משפטיים ותפעוליים:** קובצי ה-MDX כוללים את המשתנים כמו שהם (`{{LEGAL_ENTITY_NAME}}`, `{{COMPANY_ID}}`, `{{LEGAL_ADDRESS}}`, `{{LEGAL_EFFECTIVE_DATE}}`, `{{SUPPORT_PHONE}}`, `{{JURISDICTION_CITY}}`, `{{DPO_NAME}}`, `{{A11Y_COORDINATOR_TITLE}}` ("רכז הנגישות" או "רכזת הנגישות"), `{{A11Y_COORDINATOR_NAME}}`, `{{A11Y_COORDINATOR_PHONE}}`, `{{A11Y_COORDINATOR_EMAIL}}`, `{{A11Y_STATEMENT_DATE}}`, `{{A11Y_AUDIT_DATE}}`, `{{A11Y_AUDITOR}}`, וגם `{{BRAND_NAME}}`, `{{DOMAIN}}`), ותוסף ה-remark המשותף לכל קובצי ה-MDX (§8.1) מחליף אותם בזמן הבנייה מתוך `BRAND` ב-`lib/constants.ts` (§1.2) — אין קובץ משתנים נוסף. אם `BRAND.legal.dpoName` ריק (לא מונה ממונה הגנת פרטיות), המשפט שמזכיר אותו לא מוצג.
- **הסכמות:** בכניסה הראשונה נרשמות הסכמות `terms` ו-`privacy` עם `version` של הדף (`source: "signup"`); בקופה — `terms` (`source: "checkout"`); ביצירה הראשונה — `ai_content_policy` בצד השרת (`source: "generate"`, חלק 04 §19.8). גרסה עם `material: true` מפעילה את מייל `terms_update` 14 יום לפני התחולה ואת דיאלוג הקבלה מחדש באפליקציה (חלק 06 §11.12).

### §10.2 תנאי שימוש (`/legal/terms`)

`summary`:
- "{{BRAND_NAME}} הוא שירות ליצירת סרטונים בעזרת AI, שמופעל על ידי {{LEGAL_ENTITY_NAME}}."
- "הסרטונים שאתם יוצרים שייכים לכם, ככל שהחוק מאפשר. האחריות לתוכן שאתם מפרסמים היא שלכם."
- "משלמים בקרדיטים, רואים את המחיר לפני כל יצירה, ויצירה שנכשלה מחזירה את הקרדיטים."
- "אפשר לבטל מנוי בכל רגע, אונליין מעמוד החיוב. ב-14 הימים הראשונים אחרי תשלום אפשר גם לקבל החזר."
- "אסור להשתמש בשירות לתעמולה פוליטית, להטעיה, או ליצירת דמות או קול של אדם בלי הסכמתו."

**1. מי אנחנו ועל מה התנאים חלים**
1.1. השירות {{BRAND_NAME}} ("השירות") מופעל על ידי {{LEGAL_ENTITY_NAME}}, ח״פ {{COMPANY_ID}}, שכתובתה {{LEGAL_ADDRESS}} ("החברה" או "אנחנו").
1.2. התנאים חלים על כל שימוש באתר {{DOMAIN}}, באפליקציה, בספריית ההוקים, בדפי השיתוף ובכל שירות אחר שלנו. מדיניות הפרטיות, מדיניות הביטול וההחזרים, מדיניות השימוש ההוגן ב-AI, מדיניות ההסכמה לשימוש בדמות ובקול ומדיניות העוגיות הן חלק בלתי נפרד מהתנאים.
1.3. התנאים כתובים בלשון רבים לשם הנוחות, ופונים לכל המגדרים באופן שווה.
1.4. פתיחת חשבון או שימוש בשירות מהווים הסכמה לתנאים. אם אינכם מסכימים להם, אנא אל תשתמשו בשירות.

**2. הגדרות**
"חשבון" — החשבון האישי שלכם בשירות. "סביבת עבודה" — מרחב שבו נשמרים פרויקטים, ערכות מותג וקרדיטים, ושאפשר לשתף בו משתמשים נוספים. "התוכן שלכם" — כל מה שאתם מוסרים לשירות: טקסטים, קישורים, פרטי העסק, תמונות, סרטונים, לוגו והקלטות. "תוצרים" — מה שהשירות יוצר עבורכם: הוקים, תסריטים, תמונות, קליפים, קריינות, כתוביות, מוזיקה וסרטונים. "קרדיטים" — יחידות השימוש בשירות, כמפורט בפרק 5. "תוכנית" — המסלול שבחרתם (חינם, בסיס, עסק או סוכנות).

**3. הרשמה וחשבון**
3.1. השירות מיועד לבני 18 ומעלה, לשימוש לצורכי עסק, מקצוע או פעילות שיווקית.
3.2. עליכם למסור פרטים נכונים ולשמור על הגישה לתיבת המייל ולחשבון ה-Google שבהם אתם מתחברים. פעולות שנעשות מהחשבון שלכם נחשבות כפעולות שלכם.
3.3. בעלי סביבת עבודה אחראים לפעולות של המשתמשים שהם מזמינים אליה ולהרשאות שהם נותנים להם. סוכנות שמנהלת סביבות לקוח אחראית לקבל מכל לקוח את הזכויות וההסכמות הנדרשות לתוכן שהיא מעלה בשמו.
3.4. קרדיטי הניסיון ניתנים פעם אחת לכל כתובת מייל (ולכל אדם). פתיחת חשבונות נוספים כדי לקבל אותם שוב, או כל ניסיון אחר לעקוף את המגבלה, יביאו לביטול הקרדיטים שהתקבלו כך.

**4. השירות**
4.1. השירות מאפשר ליצור סרטוני תדמית וסרטונים קצרים לרשתות, על בסיס פרטי העסק שלכם, הוק שבחרתם ותוכן שהעליתם, בעזרת מודלים של בינה מלאכותית של ספקים חיצוניים, ולהוריד ולשתף אותם.
4.2. התוצרים נוצרים באופן אוטומטי. הם עשויים לכלול טעויות, אי-דיוקים, הגייה שגויה או תוצאה שונה מזו שציפיתם לה. לפני כל פרסום עליכם לבדוק את התסריט, את הנתונים, את הקריינות ואת הוויז׳ואלים.
4.3. אנחנו רשאים לשנות, לשפר, להחליף ספקים ומודלים, להוסיף או להסיר יכולות. שינוי כזה לא יפגע בקרדיטים שכבר שולמו. שינוי מהותי לרעה בתוכנית בתשלום יימסר לכם במייל לפחות 30 יום מראש, ותוכלו לבטל ולקבל החזר יחסי על התקופה שנותרה.
4.4. אנחנו משתדלים שהשירות יהיה זמין ותקין, אך ייתכנו הפסקות לצורך תחזוקה, תקלות אצלנו או אצל ספקים. נודיע מראש על תחזוקה מתוכננת ככל האפשר.
4.5. שמירת קבצים: בסביבת עבודה שמעולם לא שולם בה דבר (תוכנית חינמית בלי מנוי ובלי חבילה), סרטונים מוכנים נשמרים 90 יום מיום יצירתם. מהתשלום הראשון — על מנוי או על חבילת קרדיטים — הסרטונים נשמרים כל עוד החשבון קיים, גם אם בהמשך חזרתם לתוכנית החינמית. מומלץ לשמור עותק של כל סרטון שחשוב לכם.

**5. תנאי הקרדיטים** (עוגן `#credits`)
5.1. **מהו קרדיט.** קרדיט הוא יחידת שימוש בשירות. אין לו ערך כספי, הוא אינו ניתן להמרה לכסף, למכירה או להעברה לחשבון אחר. בתוכנית הסוכנות, הקרדיטים של הסוכנות משמשים גם את סביבות הלקוח שלה.
5.2. **איך מקבלים קרדיטים.** (א) קרדיטי ניסיון: 70 קרדיטים, פעם אחת, בהרשמה. (ב) קרדיטי מנוי: הקצאה בתחילת כל תקופת חיוב; במנוי שנתי — הקצאה חודשית באותו יום בכל חודש. (ג) קרדיטי חבילה: בקנייה חד-פעמית. (ד) קרדיטי הטבה או פיצוי, לפי התנאים שיימסרו עמם.
5.3. **תוקף.** קרדיטי מנוי תקפים עד סוף החודש שאחרי תקופת החיוב שבה הוקצו, כלומר מה שלא נוצל עובר לחודש אחד נוסף. קרדיטי חבילה וקרדיטי ניסיון אינם פגים כל עוד החשבון קיים. לקרדיטי הטבה יכול להיות תוקף אחר, שיימסר עמם.
5.4. **סדר הניצול.** בכל שימוש ננצל קודם את הקרדיטים שתוקפם יפוג ראשון, ובין קרדיטים עם אותו תוקף — את הוותיקים יותר.
5.5. **עלות הפעולות.** העלות של כל פעולה מפורטת במחירון שבעמוד המחירים, ומוצגת לכם לפני כל פעולה שעולה קרדיטים. לפני יצירת סרטון מוצג אישור עם פירוט העלות. שינוי במחירון לא יחול על פעולה שכבר אישרתם. על העלאת מחיר של פעולה נודיע באתר ובמייל לפחות 14 יום מראש.
5.6. **שמירה וחיוב בפועל.** בתחילת יצירה נשמרים בחשבון הקרדיטים שהוערכו לה. בסיומה מחויבים רק הקרדיטים של השלבים שבוצעו, והיתרה חוזרת אליכם. אם היצירה דרשה בפועל יותר קרדיטים מההערכה, ההפרש על חשבוננו.
5.7. **החזר קרדיטים אוטומטי.** (א) יצירה שנכשלה בגלל תקלה טכנית — כל הקרדיטים שלה חוזרים. (ב) סצנה שלא הצלחנו ליצור כווידאו ובנינו מתמונה בתנועה — קרדיטי הקליפ חוזרים. (ג) יצירה שביטלתם באמצע — מחויבים רק השלבים שהסתיימו. ההחזר מופיע בפירוט הקרדיטים בעמוד החיוב.
5.8. **מגבלות.** לכל תוכנית יש תקרת שימוש יומית ומספר מרבי של יצירות במקביל, כמפורט בעמוד המחירים. פעולות שאינן עולות קרדיטים מוגבלות בקצב כדי למנוע ניצול לרעה.
5.9. **בסיום.** אחרי ביטול מנוי, קרדיטי המנוי ממשיכים לשמש אתכם עד סוף התקופה ששולמה ולפי תוקפם. מעבר לתוכנית החינמית לא פוגע בקרדיטי חבילה. מחיקת החשבון מוחקת את כל הקרדיטים, ולכן אם מגיע לכם החזר כספי לפי מדיניות הביטול, בקשו אותו לפני המחיקה.
5.10. **ניצול לרעה.** קרדיטים שהתקבלו במרמה, בטעות טכנית ברורה או בניגוד לתנאים — אנחנו רשאים לבטל אותם, אחרי שנודיע לכם.

**6. מחירים, תשלום וחשבוניות**
6.1. המחירים באתר בשקלים חדשים וכוללים מע״מ. המחירים לפני מע״מ מוצגים לעסקים לצורך מידע בלבד.
6.2. התשלום מתבצע בכרטיס אשראי בעמוד תשלום מאובטח של חברת הסליקה. חבילות קרדיטים אפשר לשלם גם ב-Bit, אם האפשרות מוצגת בעמוד התשלום. איננו שומרים את מספר הכרטיס המלא: רק אסימון (טוקן) לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס.
6.3. מנוי מתחדש אוטומטית בסוף כל תקופה, עד שתבטלו אותו. החיוב מתבצע ביום החידוש. במנוי שנתי נשלח לכם מייל תזכורת 7 ימים לפני החידוש.
6.4. אם חיוב נכשל, נודיע לכם במייל וננסה שוב אחרי יום, שלושה ימים ושבעה ימים. אם החיוב לא יצליח, החשבון יעבור לתוכנית החינמית, וקרדיטי החבילה יישמרו.
6.5. שדרוג נכנס לתוקף מיד, בחיוב יחסי על יתרת התקופה ובתוספת יחסית של קרדיטים; חיוב יחסי של פחות מ-₪5 לא נגבה. מעבר ממנוי חודשי לשנתי נכנס לתוקף בסוף התקופה החודשית, או מיד אם תבחרו בכך (אז משלמים את הסכום השנתי המלא, והקרדיטים מהחודש הנוכחי נשארים לפי התוקף שלהם). מעבר לתוכנית קטנה יותר, או ממנוי שנתי לחודשי, נכנס לתוקף בסוף התקופה ששולמה.
6.6. על כל תשלום תונפק חשבונית מס ותישלח במייל. לעסקים, כשהחוק מחייב, נבקש מרשות המסים מספר הקצאה לחשבונית.
6.7. על שינוי במחיר של תוכנית נודיע במייל לפחות 30 יום מראש. שינוי שנובע רק משינוי בשיעור המע״מ שנקבע בחוק יחול מהחיוב הראשון שאחרי תאריך התחולה, ונודיע עליו לפחות 7 ימים לפני החיוב הזה, או מיד כשהשינוי הוכרז בפחות זמן מזה. השינוי לא יחול על תקופה ששולמה, ותוכלו לבטל לפני שייכנס לתוקף.
6.8. מבצעים והטבות כפופים לתנאים שיפורסמו עמם. אם הטבה כוללת מחיר מוזל לתקופה מוגבלת, נודיע לכם לפחות 7 ימים לפני שהמחיר ישתנה.

**7. ביטול והחזרים**
אפשר לבטל מנוי בכל עת: בכפתור "ביטול מנוי" באפליקציה או בקישור שבתחתית כל עמוד באתר, במייל או בטלפון. הכללים המלאים — כולל ביטול תוך 14 יום, ביטול מנוי שנתי ותקופת ביטול מורחבת — מפורטים במדיניות הביטול וההחזרים, שהיא חלק מהתנאים.

**8. התוכן שלכם והתוצרים**
8.1. **התוכן שלכם נשאר שלכם.** אתם מצהירים שיש לכם את כל הזכויות וההסכמות הנדרשות לתוכן שאתם מוסרים, כולל צילומים, לוגו, סימני מסחר, מוזיקה שהעליתם, והסכמה של כל אדם מזוהה שמופיע בו.
8.2. **הרשאה אלינו.** אתם מעניקים לנו הרשאה שאינה בלעדית להשתמש בתוכן שלכם רק לצורך הפעלת השירות עבורכם: אחסון, עיבוד, העברה לספקי ה-AI לצורך יצירת התוצרים, וגיבוי. ההרשאה מסתיימת כשהתוכן נמחק. לא נשתמש בתוכן שלכם או בתוצרים שלכם כדי לאמן מודלים, ולא נפרסם אותם כדוגמה או בשיווק שלנו בלי הסכמה מפורשת בכתב.
8.3. **התוצרים.** ככל שהדין מאפשר, הזכויות בתוצרים שייכות לכם, ואתם רשאים להשתמש בהם לכל מטרה חוקית, גם בפרסום ממומן וגם אחרי סיום המנוי. ייתכן שתוצרים שנוצרו בעזרת AI לא יהיו מוגנים בזכויות יוצרים, ואיננו מתחייבים לבלעדיות: משתמשים אחרים עשויים לקבל תוצרים דומים, במיוחד כשמשתמשים באותו הוק מהספרייה.
8.4. **סימן מים.** סרטונים שנוצרים לפני התשלום הראשון כוללים סימן מים של {{BRAND_NAME}} ושורה "נוצר ב{{BRAND_NAME}}" בכרטיס הסיום. אסור להסיר אותם בדרך אחרת.
8.5. **ספריית ההוקים.** הטקסטים בספרייה, הסיווג שלהם וההסברים שייכים לנו. אתם רשאים להשתמש בכל הוק, בחינם, בתוכן השיווקי של העסק שלכם, גם בפרסום ממומן. אסור להעתיק את הספרייה או חלק ניכר ממנה כמאגר, לפרסם אותה מחדש, למכור אותה או לאסוף ממנה מידע באופן אוטומטי.
8.6. **מוזיקה.** מוזיקה מהספרייה שלנו, ומוזיקה מקורית שנוצרה לסרטון, ניתנת לכם ברישיון לשימוש בתוך הסרטון שנוצר בשירות בלבד. אסור לחלץ אותה ולהפיץ אותה בנפרד.
8.7. **שאר השירות.** התבניות, העיצוב, הקוד, הסימנים והתוכן באתר שייכים לנו או לבעלי הרישיון שלנו.

**9. שימוש מותר ואחריות לתוכן**
9.1. השימוש בשירות כפוף למדיניות השימוש ההוגן ב-AI ולמדיניות ההסכמה לשימוש בדמות ובקול.
9.2. אתם המפרסמים של הסרטונים, ואתם אחראים לכך שהם עומדים בדין ובכללים החלים עליכם, ובהם: איסור פרסום מטעה לפי חוק הגנת הצרכן; כללי הפרסום של מקצועות מוסדרים (רפואה, רפואת שיניים, עריכת דין, ייעוץ פיננסי, ביטוח, תיווך מקרקעין, טיפול נפשי); כללי כשרות והגרלות; הוראות חוק התקשורת לגבי דברי פרסומת שאתם שולחים; והכללים של הרשתות החברתיות, כולל סימון תוכן שנוצר ב-AI.
9.3. המערכת משתמשת רק במספרים, במחירים ובעובדות שאישרתם, ומסמנת בתסריט כל נתון שחסר. האחריות לוודא שכל עובדה בסרטון נכונה היא שלכם.
9.4. אנחנו רשאים לחסום יצירה, להסיר תוכן או לבטל קישור שיתוף שמפרים את התנאים או את הדין, ונודיע לכם על כך ככל האפשר.

**10. ספקים חיצוניים**
השירות נעזר בספקים חיצוניים, ובהם OpenRouter וספקי המודלים שאליהם הוא מנתב, ספק הסליקה, ספק החשבוניות וספקי תשתית, כמפורט במדיניות הפרטיות. ייתכן שחלק מתנאיהם יחולו על השימוש בתוצרים. איננו אחראים לשירותים של צדדים שלישיים שאליהם אתם מעלים את הסרטונים, כמו רשתות חברתיות.

**11. פרטיות**
אנחנו מעבדים מידע אישי לפי מדיניות הפרטיות.

**12. הגבלת אחריות**
12.1. השירות ניתן כמות שהוא ולפי זמינותו. ככל שהדין מתיר, איננו מתחייבים שהתוצרים יתאימו לצורך מסוים או ישיגו תוצאה עסקית מסוימת.
12.2. ככל שהדין מתיר, לא נהיה אחראים לנזק עקיף או תוצאתי, לאובדן רווחים, הכנסות או מוניטין, הנובעים מהשימוש בשירות או מפרסום התוצרים.
12.3. ככל שהדין מתיר, האחריות הכוללת שלנו לא תעלה על הסכום ששילמתם לנו ב-12 החודשים שקדמו לאירוע שבגללו נוצרה האחריות. ההגבלה לא חלה על נזק שנגרם בזדון או ברשלנות חמורה שלנו, ואינה גורעת מזכויות שאינן ניתנות להתניה לפי חוק הגנת הצרכן.
12.4. התוצרים, ההוקים ותוכן הבלוג אינם ייעוץ משפטי, רפואי, פיננסי או מקצועי אחר.

**13. שיפוי**
תשפו אותנו על נזק והוצאות סבירות (כולל שכר טרחת עורך דין) שנגרמו לנו בגלל תביעה של צד שלישי הנובעת מתוכן שמסרתם לשירות או מפרסום שלכם בניגוד לדין או לתנאים, ובלבד שנודיע לכם על התביעה בהקדם ונאפשר לכם להתגונן מפניה.

**14. השעיה וסיום**
14.1. אתם רשאים להפסיק להשתמש בשירות ולמחוק את החשבון בכל עת, בהגדרות.
14.2. אנחנו רשאים להשעות או לסגור חשבון במקרה של הפרה מהותית של התנאים, חשד סביר למרמה או לסיכון אבטחה, או אם הדין מחייב זאת. למעט במקרה דחוף, נודיע לכם מראש ונאפשר לתקן את ההפרה.
14.3. בסגירת חשבון שלא בגלל הפרה שלכם, נאפשר לכם להוריד את התוצרים במשך 30 יום, ונחזיר את החלק היחסי של תשלום ששולם מראש על תקופה שלא נוצלה.

**15. שינויים בתנאים**
נעדכן את התנאים מעת לעת. על שינוי מהותי נודיע באתר ובמייל לפחות 14 יום לפני שייכנס לתוקף. אם השינוי פוגע בכם ואינכם מסכימים לו, תוכלו לבטל את המנוי לפני כניסתו לתוקף ולקבל החזר יחסי על התקופה ששולמה ולא נוצלה. המשך שימוש אחרי כניסת השינוי לתוקף מהווה הסכמה לו.

**16. דין וסמכות שיפוט**
על התנאים יחול הדין הישראלי. סמכות השיפוט הייחודית נתונה לבתי המשפט המוסמכים ב{{JURISDICTION_CITY}}, בלי לגרוע מזכותו של צרכן להגיש תביעה בבית המשפט שהדין מאפשר לו.

**17. שונות**
אם נוותר על זכות במקרה מסוים, לא יהיה בכך ויתור עליה במקרה אחר. אם הוראה בתנאים תימצא בלתי תקפה, שאר ההוראות יעמדו בתוקפן. אנחנו רשאים להעביר את זכויותינו לפי התנאים במסגרת מיזוג, רכישה או העברת פעילות, בהודעה לכם ובלי לפגוע בזכויותיכם.

**18. יצירת קשר**
{{LEGAL_ENTITY_NAME}}, {{LEGAL_ADDRESS}} · מייל: hello@{{DOMAIN}} · טלפון: {{SUPPORT_PHONE}} · או בטופס יצירת הקשר באתר.

### §10.3 מדיניות פרטיות (`/legal/privacy`)

`summary`:
- "אנחנו אוספים רק מה שצריך כדי ליצור לכם סרטונים, לחייב ולשמור על החשבון."
- "התוכן שלכם נשלח לספקי AI רק כדי ליצור את מה שביקשתם, ולא משמש לאימון מודלים."
- "המידע נשמר בשרתים באירופה; חלק מהספקים פועלים בארצות הברית."
- "אנליטיקה רק בהסכמה. דיוור שיווקי רק בהסכמה, ואפשר להסיר בלחיצה."
- "אפשר לעיין במידע, לתקן, להוריד עותק ולמחוק את החשבון בכל עת."

**1. מי אחראי למידע**
בעלת השליטה במידע היא {{LEGAL_ENTITY_NAME}}, ח״פ {{COMPANY_ID}}, {{LEGAL_ADDRESS}}. לכל פנייה בנושא פרטיות: privacy@{{DOMAIN}}. ממונה הגנת הפרטיות: {{DPO_NAME}}. (המשפט האחרון מוצג רק אם מונה ממונה, §10.1.)
המדיניות הזו היא גם ההודעה שסעיף 11 לחוק הגנת הפרטיות, התשמ״א-1981, מחייב, כפי שתוקן בתיקון 13 (בתוקף מ-14 באוגוסט 2025).

**2. על מה המדיניות חלה**
המדיניות חלה על מבקרים באתר, על משתמשים רשומים ועל אנשי קשר שפונים אלינו. כשאתם מעלים לשירות מידע על אנשים אחרים — למשל צילומים של עובדים או של לקוחות שלכם — אתם אחראים לכך שיש לכם בסיס חוקי והסכמה לכך, ואנחנו מעבדים את המידע הזה בשבילכם ולפי הוראותיכם.

**3. איזה מידע אנחנו אוספים** (עוגן `#data`)

| סוג המידע | דוגמאות | מאיפה | האם חובה, ומה קורה בלעדיו |
|---|---|---|---|
| פרטי חשבון | שם, מייל, תמונת פרופיל, טלפון אם מסרתם | מכם, או מ-Google אם התחברתם דרכו | מייל — חובה; בלעדיו אי אפשר לפתוח חשבון |
| פרטי העסק | שם העסק, נישה, עיר, שירותים, צבעים, לוגו, פרטי קשר עסקיים, נתונים שאישרתם | מכם, או מהאתר או מהאינסטגרם שקישרתם | לא חובה; בלעדיו הסרטונים יהיו כלליים יותר |
| התוכן שלכם | תמונות, סרטונים, טקסטים, לוגו | מכם | לא חובה |
| תוצרים | תסריטים, קריינות, כתוביות, סרטונים | נוצרים בשירות | — |
| פרטי תשלום וחיוב | שם המשלם, מייל, כתובת, מספר עוסק, ח״פ או ת״ז לחשבונית, ארבע ספרות אחרונות ותוקף הכרטיס, אסימון תשלום | מכם ומחברת הסליקה; מספר הכרטיס המלא נשאר אצל חברת הסליקה בלבד | חובה לרכישה; פרטי החשבונית נדרשים לפי דיני המס |
| מידע טכני ושימוש | כתובת IP, סוג דפדפן ומכשיר, יומני פעולות ושגיאות | נאסף אוטומטית | נדרש לאבטחה ולתפעול; אי אפשר להשתמש בשירות בלעדיו |
| אנליטיקה | אילו עמודים ופעולות שימשו אתכם, בלי תוכן אישי | עוגיות ואירועים | רק בהסכמה; בלעדיה השירות עובד כרגיל |
| תקשורת | פניות, תכתובות תמיכה, משוב | מכם | לא חובה |
| הסכמות | מה הסכמתם, מתי, לאיזו גרסה, מאיזה IP | נרשם אוטומטית | נדרש כדי להוכיח את ההסכמה |

איננו אוספים ביודעין מידע בעל רגישות מיוחדת. שיבוט קול ואווטאר דיגיטלי, שכרוכים במידע ביומטרי, אינם זמינים כיום. אם יושקו, הם יחייבו הסכמה נפרדת ומפורשת, כמפורט במדיניות ההסכמה לשימוש בדמות ובקול.

**4. למה אנחנו משתמשים במידע**
כדי לספק את השירות ולנהל את החשבון; כדי ליצור את התוצרים, כולל העברת התוכן הרלוונטי לספקי ה-AI; כדי לחייב, להפיק חשבוניות ולעמוד בחובות מס; כדי לתת תמיכה; כדי לאבטח את השירות ולמנוע הונאה וניצול לרעה, כולל מניעת קבלה כפולה של קרדיטי ניסיון; כדי לשפר את השירות על בסיס נתונים מצרפיים; כדי לשלוח לכם עדכונים שיווקיים — רק אם הסכמתם; וכדי לעמוד בדרישות הדין.

**5. האם חובה למסור מידע**
אינכם חייבים על פי חוק למסור לנו מידע, והמסירה תלויה ברצונכם. עם זאת, בלי כתובת מייל לא נוכל לפתוח לכם חשבון, בלי פרטי תשלום לא תוכלו לרכוש, ופרטים לחשבונית נדרשים לפי דיני המס. בלי פרטי העסק השירות יעבוד, אבל הסרטונים יהיו פחות מותאמים לכם.

**6. עם מי אנחנו משתפים מידע** (עוגן `#subprocessors`)
איננו מוכרים מידע אישי. אנחנו מעבירים מידע רק לספקים שעוזרים לנו להפעיל את השירות, במידה הנדרשת לתפקידם ובכפוף להתחייבויות חוזיות לשמירה על המידע:

| ספק | תפקיד | מיקום עיקרי |
|---|---|---|
| Supabase | מסד נתונים, אחסון קבצים והזדהות | האיחוד האירופי (פרנקפורט) |
| Vercel | אירוח האתר, הרצת השרתים, תזמור המשימות והרכבת הסרטונים | האתר והשרתים: האיחוד האירופי (פרנקפורט). הרכבת הסרטונים: באזור ש-Vercel Sandbox מאפשר, ייתכן שבארצות הברית `[M0-verify]`. החברה פועלת מארצות הברית |
| Vercel Speed Insights | מדדי ביצועים אנונימיים של האתר | ארצות הברית ומדינות נוספות |
| OpenRouter | ניתוב הבקשות לספקי ה-AI | ארצות הברית |
| ספקי המודלים דרך OpenRouter (בין היתר Anthropic, Google, OpenAI, ElevenLabs, Kuaishou, ByteDance, Alibaba) | יצירת טקסט, תמונות, וידאו, קריינות, תמלול ומוזיקה | ארצות הברית ומדינות נוספות, בהתאם לספק שאליו מנותבת הבקשה |
| Grow | סליקת תשלומים ושמירת אסימוני תשלום | ישראל |
| Morning (חשבונית ירוקה) | הפקת חשבוניות | ישראל |
| Resend | שליחת מיילים | ארצות הברית |
| PostHog | אנליטיקה, רק בהסכמה | האיחוד האירופי |
| Sentry | ניטור שגיאות | האיחוד האירופי |
| Upstash | הגבלת קצב בקשות (כתובות IP) | האיחוד האירופי |
| Google | התחברות עם חשבון Google, אם בחרתם בה | ארצות הברית |
| Amazon Web Services | גיבויים מוצפנים של מסד הנתונים והקבצים (S3) | האיחוד האירופי (פרנקפורט) |
| Meta (WhatsApp) | הודעות שירות בוואטסאפ, רק אם הפעלתם אותן בהגדרות (כשהאפשרות תושק) | ארצות הברית ומדינות נוספות |

מה מקבל כל ספק AI: למודלי הטקסט נשלחים פרטי העסק והבריף שמסרתם; למודלי התמונה והווידאו — תיאור חזותי באנגלית ותמונת הפתיחה של הסצנה, בלי פרטי הקשר שלכם; למודל הקריינות — טקסט הקריינות, שעשוי לכלול פרטי קשר עסקיים שבחרתם להקריא; למודל התמלול — קובץ הקריינות; לחילוץ פרטי המותג — התוכן הציבורי של האתר או של עמוד האינסטגרם שקישרתם; לבדיקת התאמה למדיניות — הבריף, התסריט, ותמונות שהעליתם (בסרטון — הפריים הראשון), כדי לוודא שהן לא מפרות את מדיניות השימוש ההוגן ב-AI. הבקשות נשלחות בהגדרה שמונעת מספקים לשמור את התוכן לצורך אימון מודלים `[M0-verify]` (§9.3).
בנוסף, נמסור מידע לרשויות כשהדין מחייב, ליועצים מקצועיים שלנו בחובת סודיות, ולגוף שירכוש את הפעילות במקרה של מיזוג או מכירה, בכפוף למדיניות זו. את רשימת הספקים העדכנית נפרסם תמיד בעמוד הזה.

**7. העברת מידע אל מחוץ לישראל**
חלק מהספקים פועלים מחוץ לישראל, באיחוד האירופי ובארצות הברית. ההעברה נעשית בהתאם לתקנות הגנת הפרטיות (העברת מידע למאגרי מידע שמחוץ לגבולות המדינה), התשס״א-2001, בין היתר למדינות שחלים בהן דיני הגנת מידע מתאימים, ובכפוף להתחייבויות חוזיות של הספקים לשמירה על המידע.

**8. בינה מלאכותית**
אנחנו לא מאמנים מודלים על התוכן שלכם. התוכן נשלח לספקי AI רק כדי ליצור את התוצרים שביקשתם. על כל קריאה לספק AI אנחנו שומרים מטא-נתונים (איזה מודל, עלות, זמן ותוצאה) לצורך חיוב, בקרת עלויות ותמיכה, בלי לשמור את תוכן הבקשה מעבר למה שנשמר ממילא בפרויקט שלכם. כשתשובה של מודל נכשלת בבדיקה האוטומטית, נשמר קטע קצר ממנה לצורך איתור התקלה, והוא נמחק אחרי 30 יום.

**9. כמה זמן אנחנו שומרים מידע** (עוגן `#retention`)

| מידע | תקופת שמירה |
|---|---|
| חשבון, פרטי עסק, ערכות מותג | כל עוד החשבון פעיל; נמחקים תוך 30 יום ממחיקת החשבון |
| פרויקטים שמחקתם | 30 יום, ואז נמחקים לצמיתות |
| סרטונים בסביבת עבודה שמעולם לא שולם בה דבר (תוכנית חינמית בלי מנוי ובלי חבילה) | 90 יום מיום היצירה |
| סרטונים וקבצים בסביבת עבודה ששולם בה לפחות פעם אחת | כל עוד החשבון קיים, גם אחרי חזרה לתוכנית החינמית |
| קובץ ייצוא של המידע שלכם | 7 ימים מיום הפקתו |
| רשומות תשלום, חשבוניות (כולל קובצי ה-PDF), יומן הקרדיטים ובקשות החזר | 7 שנים לפחות, כנדרש לפי דיני המס; בסביבה שנמחקה הן נשמרות בלי פרטים מזהים מעבר לנדרש בחוק |
| מטא-נתונים של קריאות AI | 24 חודשים; קטעי איתור תקלות — 30 יום |
| יומני הודעות מספקים (webhooks) | 90 יום |
| פניות, תכתובות תמיכה ודיווחים על שימוש לרעה | 24 חודשים |
| יומן שליחת מיילים | 24 חודשים |
| יומן פעולות מערכת (ביקורת) | 36 חודשים; פעולות שקשורות לתשלומים, חשבוניות, מנויים, החזרים וקרדיטים — 7 שנים |
| רישומי הסכמה | כל עוד החשבון קיים, ועוד 7 שנים אחרי סגירת החשבון או ביטול ההסכמה; הסכמה שניתנה בלי חשבון (למשל הרשמה לניוזלטר) — 7 שנים מביטולה; בחירה בבאנר העוגיות בלי חשבון — 7 שנים מהבחירה |
| סימון קבלת קרדיטי ניסיון (גיבוב מוצפן בלבד, בלי המייל עצמו) | 5 שנים |
| נתוני אנליטיקה (PostHog) | 12 חודשים |
| יומני שגיאות (Sentry) | 90 יום |
| גיבויים של מסד הנתונים | גיבוי יומי ושחזור לנקודת זמן — 7 ימים; גיבוי שבועי מוצפן — 30 יום; הגיבוי האחרון של כל חודש — 12 חודשים |
| גיבויים של קבצים (העלאות, ערכות מותג וסרטונים) | גיבוי שבועי מוצפן; קובץ שנמחק מהשירות נמחק גם מהגיבוי תוך 37 ימים לכל היותר (עד 7 ימים עד הגיבוי הבא, ועוד 30 יום). עותק החשבוניות נשמר 7 שנים, כמו החשבוניות עצמן |

**10. אבטחת מידע**
אנחנו נוקטים אמצעים סבירים ומקובלים לאבטחת המידע, בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017, ובהם: הפרדה מלאה בין סביבות עבודה ברמת מסד הנתונים, הצפנה בתעבורה ובאחסון, הצפנה נוספת של אסימוני תשלום, הרשאות גישה מצומצמות לצוות, תיעוד פעולות רגישות, ובדיקות אבטחה. אף מערכת אינה חסינה לחלוטין. במקרה של אירוע אבטחה חמור נפעל לפי הדין, כולל דיווח לרשות להגנת הפרטיות והודעה לנפגעים כשנדרש.

**11. הזכויות שלכם**
לפי חוק הגנת הפרטיות, אתם זכאים לעיין במידע שלכם, ולבקש לתקן או למחוק מידע שאינו נכון, שלם, ברור או מעודכן. בנוסף, אנחנו מאפשרים לכם להוריד עותק של המידע ולמחוק את החשבון בעצמכם, בהגדרות תחת "פרטיות". אתם יכולים לבטל בכל עת הסכמה שנתתם — לדיוור שיווקי, לאנליטיקה או לכל הסכמה אחרת — בלי שהדבר יפגע בשימוש בשירות. לבקשות: privacy@{{DOMAIN}}. נשיב תוך 30 יום, וייתכן שנבקש לאמת את זהותכם לפני שנמסור מידע. אם אינכם מרוצים מהטיפול, אתם רשאים לפנות לרשות להגנת הפרטיות.

**12. דיוור שיווקי**
נשלח לכם דברי פרסומת רק אם הסכמתם לכך במפורש, בתיבה נפרדת שאינה מסומנת מראש. כל דבר פרסומת יסומן "פרסומת", יכלול את פרטי השולח וקישור להסרה בלחיצה אחת. הודעות שירות — כמו "הסרטון מוכן", קבלות וחשבוניות — נשלחות בנפרד, ואינן דיוור שיווקי.

**13. עוגיות**
אנחנו משתמשים בעוגיות הכרחיות להפעלת השירות, ובעוגיות אנליטיקה רק בהסכמה. הפירוט במדיניות העוגיות.

**14. קטינים**
השירות אינו מיועד לבני פחות מ-18. העלאת צילומים של קטינים מותרת רק בהסכמה בכתב של ההורים, ובאחריות המעלה.

**15. שינויים במדיניות**
על שינוי מהותי נודיע באתר ובמייל לפני שייכנס לתוקף. גרסאות קודמות זמינות בתחתית העמוד.

**16. יצירת קשר**
privacy@{{DOMAIN}} · {{LEGAL_ENTITY_NAME}}, {{LEGAL_ADDRESS}}.

### §10.4 מדיניות עוגיות ואנליטיקה (`/legal/cookies`)

`summary`:
- "עוגיות הכרחיות — רק כדי שהאתר והחשבון יעבדו."
- "אנליטיקה וניסויים — רק אם אישרתם."
- "אין לנו עוגיות פרסום ואין פיקסלים של רשתות חברתיות."
- "אפשר לשנות את הבחירה בכל רגע, בקישור "הגדרות עוגיות" בתחתית כל עמוד."

**1. מה זה עוגיות**
עוגיות הן קבצים קטנים שהאתר שומר בדפדפן שלכם. בנוסף, אנחנו שומרים בדפדפן (ב-localStorage) כמה פרטים שנוחים לכם, כמו הפרטים שהזנתם בהתאמת ההוקים. המידע הזה נשאר בדפדפן שלכם, ונשלח אלינו רק כשממשיכים ליצירת סרטון.

**2. העוגיות שאנחנו משתמשים בהן**

| קטגוריה | שם | למה | תוקף | צריך הסכמה? |
|---|---|---|---|---|
| הכרחיות | `sb-*` | שמירת ההתחברות לחשבון | עד היציאה מהחשבון | לא |
| הכרחיות | `ws` | סביבת העבודה הנוכחית באפליקציה | שנה | לא |
| הכרחיות | `theme` | ערכת הנושא שבחרתם (כהה, בהירה או לפי המכשיר) | שנה | לא |
| הכרחיות | `motion` | ההעדפה שלכם לגבי אנימציות ("עצירת אנימציות") | שנה | לא |
| הכרחיות | `sidebar_state` | אם התפריט הצדדי באפליקציה פתוח או מקופל | 7 ימים | לא |
| הכרחיות | `consent_v1` | הבחירה שלכם לגבי עוגיות | שנה | לא |
| אנליטיקה | `ph_*` (PostHog) | הבנת השימוש באתר ובאפליקציה, בלי תוכן אישי | שנה | **כן** |
| אנליטיקה (ניסויים) | `exp_hero` | הצגת גרסה אחידה של דף הבית בניסוי | 90 יום | **כן** (אותה הסכמה כמו אנליטיקה) |

**3. מידע שנשמר בדפדפן בלבד**
`hook_personalize_v1` (הפרטים שהזנתם בהתאמת ההוקים, למשל שם העסק והעיר) · `hero_draft_v1` (הנישה, הקישור או התיאור שהזנתם בדף הבית, עד 24 שעות) · `announcement.dismissed.{id}` (הודעות שסגרתם). באפליקציה נשמרים גם שני פרטים זמניים ב-sessionStorage, שנמחקים בסגירת הלשונית: `reauth_draft_v1` (מה שהקלדתם כשהחיבור פג, כדי שלא יאבד אחרי התחברות מחדש) ו-`signup_marketing_v1` (הבחירה שלכם לגבי דיוור במהלך ההרשמה). אין מידע נוסף בדפדפן.

**4. עוגיות של צדדים שלישיים**
כשאתם עוברים לעמוד התשלום של חברת הסליקה, היא עשויה לשמור עוגיות משלה, לפי המדיניות שלה. אנחנו לא משתמשים בעוגיות פרסום ולא בפיקסלים של רשתות חברתיות. אם נוסיף כאלה בעתיד, נעדכן את המדיניות ונבקש את הסכמתכם קודם.

**5. איך משנים את הבחירה**
בכל עמוד, בתחתית, יש קישור "הגדרות עוגיות". ביטול הסכמה לאנליטיקה מוחק את עוגיות האנליטיקה ומפסיק את האיסוף מאותו רגע. אפשר גם לחסום או למחוק עוגיות בהגדרות הדפדפן; חסימת עוגיות הכרחיות תמנע התחברות לחשבון.

**6. יצירת קשר**
privacy@{{DOMAIN}}.

### §10.5 מדיניות ביטול והחזרים (`/legal/cancellation`)

בראש הדף, לפני תיבת "בקצרה": כפתור ראשי בולט **"ביטול מנוי"** (`/app/billing/cancel`; בדיוק כמו במילון המונחים של חלק 01), ומתחתיו המנגנון: **"מבטלים מעמוד החיוב: לוחצים "ביטול מנוי" ומאשרים, בלי שיחת שימור."** ולצד הכפתור **"או במייל: billing@{{DOMAIN}} · בטלפון: {{SUPPORT_PHONE}}"**.

`summary`:
- "מבטלים מנוי בכל רגע: בכפתור, במייל או בטלפון. החיובים נעצרים מיד."
- "החשבון ממשיך לעבוד עד סוף התקופה ששולמה."
- "ב-14 הימים הראשונים אחרי תשלום אפשר לבטל ולקבל החזר, בניכוי מה שנוצל ודמי ביטול של 5% או ₪100, הנמוך מביניהם."
- "במנוי שנתי אפשר לקבל החזר יחסי על החודשים שעוד לא התחילו."
- "יצירה שנכשלה מחזירה קרדיטים אוטומטית, בלי לבקש."

**1. ביטול מנוי**
1.1. **איך מבטלים.** בכל אחת מהדרכים האלה, לבחירתכם: (א) בכפתור "ביטול מנוי" בעמוד החיוב באפליקציה, או בקישור "ביטול מנוי" שבתחתית כל עמוד באתר; (ב) במייל ל-billing@{{DOMAIN}}; (ג) בטלפון {{SUPPORT_PHONE}}; (ד) בטופס יצירת הקשר באתר, בנושא "ביטול מנוי או החזר". (הקישור הייעודי בכל עמוד והכפתור בעמוד החיוב מממשים את סעיף 14ט לחוק הגנת הצרכן, וקבלת ביטול במייל ובטלפון — את סעיף 13ד; חלק 06 §10.1.)
1.2. **מה לכתוב.** בביטול דרך הכפתור לא צריך לכתוב דבר. בביטול במייל, בטלפון או בטופס, ציינו שם מלא ואת כתובת המייל של החשבון, כדי שנזהה אתכם. אם תרצו, אפשר לציין גם מספר תעודת זהות או ח״פ.
1.3. **מתי הביטול נכנס לתוקף.** ביטול בכפתור נכנס לתוקף מיד: לא יהיו חיובים נוספים. ביטול במייל, בטלפון או בטופס ייכנס לתוקף לא יאוחר משלושה ימי עסקים מקבלת ההודעה. אם תבקשו שהביטול ייכנס לתוקף במועד מאוחר יותר, נכבד את בקשתכם.
1.4. **מה קורה אחרי הביטול.** החשבון והתוכנית ממשיכים לפעול עד סוף התקופה ששולמה, וקרדיטי המנוי זמינים לכם עד אז, לפי תוקפם. בסוף התקופה החשבון עובר לתוכנית החינמית. קרדיטים שקניתם בחבילה נשארים. הסרטונים שלכם נשמרים לפי מדיניות שמירת הקבצים בתנאי השימוש.
1.5. **אישור.** מיד עם הביטול נשלח אליכם מייל שמאשר את הביטול ואת המועד שבו הוא נכנס לתוקף.
1.6. **חיוב שיצא אחרי שביקשתם לבטל.** אם הודעת הביטול שלכם הגיעה אלינו לפני חיוב החידוש, אבל החיוב יצא בכל זאת בתוך שלושת ימי העסקים, נחזיר אותו במלואו, בלי דמי ביטול, ונפיק חשבונית זיכוי.

**2. ביטול מנוי שנתי**
2.1. אפשר לבטל מנוי שנתי בכל עת, באותן דרכים. החידוש השנתי הבא לא יתבצע.
2.2. מעבר ל-14 הימים הראשונים (סעיף 3), תוכלו לבקש החזר יחסי על החודשים שעוד לא התחילו. ההחזר מחושב כך: הסכום ששילמתם, פחות מספר החודשים שהתחילו כפול המחיר החודשי במנוי השנתי. החודש הנוכחי נחשב כחודש שהתחיל. במקרה כזה, הגישה לתוכנית והקצאות הקרדיטים מסתיימות בסוף החודש הנוכחי.
2.3. **דוגמה:** מנוי שנתי בתוכנית עסק, ₪2,772. ביקשתם לבטל במהלך החודש הרביעי. ארבעה חודשים התחילו: 4 × ₪231 = ₪924. ההחזר: ₪2,772 − ₪924 = **₪1,848**. הקרדיטים שכבר קיבלתם נשארים עד סוף החודש הנוכחי, והקצאות חדשות לא יתווספו.

⚖️ סעיף 2 (החזר יחסי במנוי שנתי, `annual_prorata`) הוא ברירת מחדל שממתינה לאישור עורך דין (חלק 06 §25) ומוצג כפי שהוא עד האישור.

**3. ביטול עסקה תוך 14 יום**
3.1. **על מה זה חל.** על התשלום הראשון בתוכנית בתשלום (חודשית או שנתית), על התשלום הראשון אחרי שדרוג לתוכנית גבוהה יותר (ואז המנוי כולו נסגר), ועל כל קנייה של חבילת קרדיטים — תוך 14 יום מיום התשלום או מיום שקיבלתם את אישור העסקה במייל, המאוחר מביניהם. על תשלומי חידוש של מנוי (עסקה מתמשכת) הסעיף לא חל: מבטלים קדימה, לפי סעיף 1.
3.2. **איך מחושב ההחזר.** הסכום ששילמתם, פחות שווי הקרדיטים שנוצלו מתוך הרכישה הזו (לפי המחיר לקרדיט באותה רכישה: המחיר חלקי מספר הקרדיטים), פחות דמי ביטול בשיעור 5% מהמחיר או ₪100, הנמוך מביניהם. את הסכום המדויק רואים בתהליך הביטול לפני שמאשרים.
3.3. **דוגמה 1:** תוכנית בסיס, ₪119 ל-400 קרדיטים. ניצלתם 50 קרדיטים. המחיר לקרדיט: ₪0.2975, ולכן שווי הניצול ₪14.88. דמי הביטול: 5% מ-₪119 = ₪5.95. ההחזר: ₪119 − ₪14.88 − ₪5.95 = **₪98.17**.
3.4. **דוגמה 2:** חבילת 500 קרדיטים, ₪179, שלא נוצלה כלל. דמי הביטול: ₪8.95. ההחזר: **₪170.05**.
3.5. **בלי דמי ביטול.** לא ייגבו דמי ביטול אם הביטול נובע מפגם בשירות, מאי-התאמה בינו לבין מה שתואר, או מכך שלא סיפקנו את השירות.
3.6. **מתי מקבלים את הכסף.** ההחזר יבוצע לאמצעי התשלום שבו שילמתם, תוך 14 יום מקבלת הודעת הביטול, ותונפק חשבונית זיכוי. לפני ההחזר, הקרדיטים שנותרו מאותה רכישה יוסרו מהחשבון. אם מדובר במנוי, הוא ייסגר מיד, והחשבון יעבור לתוכנית החינמית.

**4. תקופת ביטול מורחבת**
4.1. אנשים עם מוגבלות, אזרחים ותיקים (בני 65 ומעלה) ועולים חדשים זכאים לבטל עסקה תוך ארבעה חודשים מיום העסקה, במקום 14 יום, אם העסקה נעשתה תוך שיחה עם נציג שלנו — כולל שיחה בצ׳אט או התכתבות במייל.
4.2. כדי לממש את הזכות, סמנו בתהליך הביטול את התיבה "יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)", או כתבו לנו. נציג יחזור אליכם לטפל בבקשה. ייתכן שנבקש מסמך שמאמת את הזכאות. חישוב ההחזר זהה לסעיף 3.

**5. החזר קרדיטים (לא כספי)**
5.1. יצירה שנכשלה בגלל תקלה טכנית — כל הקרדיטים שלה חוזרים לחשבון אוטומטית.
5.2. סצנה שלא הצלחנו ליצור כווידאו ובנינו מתמונה בתנועה — קרדיטי הקליפ חוזרים.
5.3. יצירה שביטלתם באמצע — מחויבים רק השלבים שהסתיימו, והשאר חוזר.
5.4. אם לדעתכם קרדיטים לא הוחזרו כמו שצריך, כתבו לנו ונבדוק.

**6. תקלות מצדנו**
אם השירות לא היה זמין לתקופה משמעותית, או שהייתה בו תקלה מהותית שמנעה מכם להשתמש בו, כתבו לנו. נבדוק ונציע פיצוי הוגן — בקרדיטים או בהחזר כספי, לפי העניין.

**7. מה לא מוחזר בכסף**
קרדיטי ניסיון וקרדיטי הטבה אינם ניתנים להמרה לכסף. קרדיטים שנוצלו אינם מוחזרים, למעט במקרים המפורטים בסעיף 5.

**8. יצירת קשר**
billing@{{DOMAIN}} · {{SUPPORT_PHONE}} · טופס יצירת הקשר באתר. אנחנו מטפלים בבקשות ביטול והחזר בימי עסקים, לפי המועדים שבמדיניות הזו.

### §10.6 הצהרת נגישות (`/legal/accessibility`)

`summary`:
- "האתר והאפליקציה נבנים לפי תקן ישראלי 5568 ולפי WCAG 2.2 ברמה AA."
- "אפשר להשתמש בכל השירות במקלדת ובקורא מסך, ויש עצירת אנימציות."
- "כל סרטון שיווקי באתר כולל כתוביות, וכל סרטון שאתם יוצרים יוצא גם עם קובץ כתוביות."
- "נתקלתם בבעיה? פנו ל{{A11Y_COORDINATOR_TITLE}}, ונטפל."

**1. המחויבות שלנו**
{{BRAND_NAME}} רואה בנגישות חלק בסיסי מהמוצר, ולא תוספת. אנחנו פועלים כדי שכל אדם, עם מוגבלות או בלעדיה, יוכל להשתמש באתר ובאפליקציה באופן עצמאי, נוח ושוויוני.

**2. רמת הנגישות**
האתר והאפליקציה נבנו כדי לעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ובתקן הישראלי ת״י 5568 ברמה AA, שמבוסס על הנחיות WCAG 2.0. בפועל, אנחנו בונים ובודקים לפי הנחיות WCAG 2.2 ברמה AA, שהן מחמירות יותר.

**3. מה עשינו**
- מבנה סמנטי עם כותרות, אזורים ותוויות, שפה מוגדרת (עברית) וכיוון מימין לשמאל.
- ניווט מלא במקלדת, כולל אשף היצירה, עורך הסצנות (שינוי סדר סצנות במקלדת) ונגן הווידאו, וקישור "דילוג לתוכן הראשי" בכל עמוד.
- סימון פוקוס ברור, שלא מוסתר מאחורי הכותרת הדביקה או פס הכפתורים התחתון.
- ניגודיות צבעים לפי הדרישות, בערכה הכהה ובערכה הבהירה, ומידע שאינו מועבר באמצעות צבע בלבד.
- טפסים עם תוויות גלויות והודעות שגיאה בעברית שמקושרות לשדה.
- כתוביות בעברית לכל סרטון שיווקי שיש בו דיבור, ותיאור טקסטואלי לסרטוני הדגמה בלי דיבור.
- כפתור לעצירת סרטונים מתנגנים, ואפשרות "עצירת אנימציות" גלובלית; האתר מכבד את הגדרת "הפחתת תנועה" של המכשיר.
- תמיכה בהגדלת טקסט עד 200% ובתצוגה בטלפון, בלי אובדן תוכן.
- הודעות מצב (למשל התקדמות יצירת סרטון) מוקראות לקוראי מסך.
- איננו משתמשים בתוסף נגישות צף. הנגישות בנויה בקוד של האתר עצמו.

**4. נגישות הסרטונים שאתם יוצרים**
כל סרטון שנוצר בשירות כולל כתוביות צרובות בעברית, ובנוסף קובצי כתוביות SRT ו-VTT להורדה. כך תוכלו לפרסם את הסרטונים גם באתר שלכם באופן נגיש. אפשר להגדיל את הכתוביות בהגדרות הנגישות באפליקציה.

**5. סביבות שנבדקו**
הבדיקות נעשו בדפדפנים Chrome, Firefox, Safari ו-Edge בגרסאותיהם העדכניות; עם קורא המסך NVDA ב-Windows, VoiceOver ב-macOS וב-iOS, ו-TalkBack ב-Android; ובניווט במקלדת בלבד.

**6. מגבלות ידועות**
- עמוד התשלום המאובטח מופעל על ידי חברת הסליקה, ונגישותו באחריותה. אם נתקלתם בקושי בתשלום, נשמח לעזור לכם להשלים את הרכישה בטלפון.
- חשבוניות PDF מופקות על ידי ספק החשבוניות, וייתכן שאינן נגישות במלואן. אפשר לבקש מאיתנו עותק נגיש.
- בסרטונים שאתם יוצרים לא נוצר תיאור קולי באופן אוטומטי.
- ציר הזמן בעורך הסצנות מוצג משמאל לימין, כמקובל בתוכנות עריכה. כל הפעולות בו זמינות גם מרשימת הסצנות ומהמקלדת.
אנחנו ממשיכים לשפר את הנגישות. אם מצאתם בעיה שלא מופיעה כאן, נשמח לדעת.

**7. פנייה בנושא נגישות**
{{A11Y_COORDINATOR_TITLE}}: {{A11Y_COORDINATOR_NAME}} · טלפון: {{A11Y_COORDINATOR_PHONE}} · מייל: {{A11Y_COORDINATOR_EMAIL}}. אפשר לפנות גם בטופס יצירת הקשר באתר, בנושא "נגישות" (`/contact?topic=accessibility`). כדי שנוכל לעזור מהר, ציינו את כתובת העמוד, מה ניסיתם לעשות, ובאיזה דפדפן או טכנולוגיה מסייעת השתמשתם. נחזור אליכם בהקדם.

**8. הסדרי נגישות פיזיים**
ל{{BRAND_NAME}} אין משרד לקבלת קהל. כל השירות ניתן באינטרנט, בטלפון ובמייל.

**9. עדכון ההצהרה**
ההצהרה עודכנה ב-{{A11Y_STATEMENT_DATE}}. בדיקת הנגישות האחרונה בוצעה ב-{{A11Y_AUDIT_DATE}} על ידי {{A11Y_AUDITOR}}.

### §10.7 מדיניות שימוש הוגן ב-AI (`/legal/ai-policy`)

`summary`:
- "השירות נועד ליצור סרטונים שיווקיים אמיתיים לעסקים."
- "אסור: תעמולה פוליטית, התחזות, דמות או קול של אדם בלי הסכמתו, תוכן מיני או פוגעני, ופרסום מטעה."
- "המערכת לא ממציאה מספרים, ביקורות או המלצות, ומוסיפה הסתייגויות בנישות מפוקחות."
- "תוכן ריאליסטי שנוצר ב-AI כדאי לסמן, ובחלק מהרשתות חובה."
- "מצאתם שימוש לרעה? דווחו ל-abuse@{{DOMAIN}}."

**1. למה המדיניות קיימת**
בינה מלאכותית מאפשרת ליצור סרטון משכנע בדקות. זה כוח גדול, והוא מחייב אחריות. המדיניות הזו קובעת מה מותר ומה אסור ליצור ב{{BRAND_NAME}}, ואיך אנחנו אוכפים את זה.

**2. מה מותר — ומומלץ**
סרטוני תדמית, רילס ומודעות לעסק שלכם; הסברים על שירותים ומוצרים; מבצעים אמיתיים; תוכן עונתי; סרטוני גיוס עובדים; סרטונים עם צילומים שלכם ושל אנשים שנתנו הסכמה; תוכן לימודי בתחום המקצועי שלכם.

**3. מה אסור**
3.1. **תעמולה פוליטית ובחירות.** אסור ליצור תעמולת בחירות או תוכן פוליטי מכל סוג: סרטונים של מועמדים, מפלגות או רשימות, קריאה להצביע או לא להצביע, ותוכן על נבחרי ציבור. החסימה קיימת תמיד, ובתקופת בחירות היא מוחמרת. ועדת הבחירות המרכזית קבעה כללים לגילוי תעמולת בחירות שהיא זיוף עמוק — כללי הבחירות (דרכי תעמולה) (קיום חובת הגילוי לגבי תעמולת בחירות שהיא זיוף עמוק), התשפ״ו-2026 — והשירות שלנו אינו מיועד לתוכן כזה בכלל.
3.2. **התחזות וזיוף עמוק.** אסור ליצור דמות, פנים או קול של אדם אמיתי בלי הסכמתו המפורשת, ואסור בכל מקרה ליצור דמות או קול של אישי ציבור, פוליטיקאים, ידוענים או משפיענים.
3.3. **קטינים.** אסור כל תוכן שמציג קטינים באופן מיני, מבזה או מסוכן. השירות לא יוצר דמויות של ילדים. צילומים אמיתיים של קטינים מותרים רק בהסכמה בכתב של ההורים.
3.4. **תוכן מיני מפורש** ועירום.
3.5. **שנאה, הסתה ואלימות:** תוכן שמסית או משפיל על רקע דת, לאום, מוצא, מגדר, נטייה מינית, מוגבלות או גיל; האדרת אלימות או טרור; הומור על מלחמה, טרור או שכול.
3.6. **פעילות לא חוקית:** נשק, סמים, הימורים לא חוקיים, הונאות ופירמידות.
3.7. **פרסום מטעה:** המלצות או ביקורות מומצאות; "לקוחות" שאינם קיימים; מספרים, דירוגים, מחירים או הנחות שאינם נכונים; דחיפות כוזבת ("נשארו 3 מקומות" כשזה לא נכון); תמונות "לפני ואחרי" מזויפות; הבטחת תוצאות רפואיות, משפטיות או פיננסיות.
3.8. **הפרת זכויות:** לוגו, סימן מסחר, מוזיקה, צילום או תוכן של אחרים שאין לכם זכות להשתמש בו.
3.9. **ספאם:** שימוש בסרטונים לשליחת דברי פרסומת בלי הסכמת הנמענים, בניגוד לחוק התקשורת.
3.10. **עקיפת מנגנונים:** ניסיון לעקוף את מערכות הבטיחות, את סימן המים או את מגבלות קרדיטי הניסיון.
3.11. **מידע אישי של אחרים** בלי בסיס חוקי, כולל פרטים מזהים של לקוחות בלי הסכמתם.

**4. נישות מפוקחות**
בנישות שיש להן כללי פרסום, המערכת מסמנת את התוכן, מוסיפה את ההסתייגויות הנדרשות ונמנעת מניסוחים בעייתיים. ההנחיות הן כלליות ואינן מחליפות בדיקה שלכם מול הכללים החלים עליכם:

| נישה | מה המערכת עושה |
|---|---|
| רפואה, רפואת שיניים, אסתטיקה, פיזיותרפיה ותזונה | לא מבטיחה תוצאות, לא כותבת "ללא כאב", מוסיפה לכל סרטון "התוצאות משתנות מאדם לאדם." (ובתוכן לפני ואחרי: "התמונות להמחשה. התוצאות משתנות מאדם לאדם."), ומנסחת מודעות בגוף שלישי |
| עריכת דין | לשון מכובדת, בלי הבטחת תוצאה, בלי "הכי טוב" ובלי המלצות לקוחות; מוסיפה "המידע כללי ואינו מהווה ייעוץ משפטי." |
| ייעוץ פיננסי, משכנתאות, ביטוח וחשבונאות | בלי הבטחת תשואה, חיסכון או אישור; מוסיפה "המידע אינו מהווה ייעוץ או המלצה.", ולצד דוגמה מספרית גם "הסימולציה להמחשה בלבד." |
| תיווך נדל״ן | מזכירה להוסיף שם ומספר רישיון; מחיר מבוקש לא מוצג כמחיר עסקה; מוסיפה "המחירים והתמונות להמחשה בלבד." |
| טיפול רגשי | בלי המלצות מטופלים ובלי הבטחת תוצאה |
| מזון | לא כותבת "כשר" בלי שאישרתם תעודת כשרות בתוקף |
| הגרלות ותחרויות | מזכירה לפרסם תקנון |
| ילדים וחינוך | לא יוצרת ילדים בתמונות AI (מראה את המקום, את הצוות ואת הפעילות), ומזכירה שנדרשת הסכמת הורים לכל צילום של קטינים |

**5. סימון תוכן שנוצר ב-AI**
ככל שידוע לנו, בישראל אין כיום חובה כללית בחוק לסמן פרסומת מסחרית שנוצרה ב-AI (לתעמולת בחירות יש כללים מיוחדים, סעיף 3.1). מטא, טיקטוק ויוטיוב דורשות לסמן תוכן ריאליסטי שנוצר או שונה ב-AI, ולעיתים מסמנות אותו בעצמן. בשירות אפשר להוסיף תווית "נוצר באמצעות AI" לכל סרטון, ולפני ההורדה מוצגת תזכורת לכללי הפלטפורמות. אנחנו ממליצים לא להסיר מהקובץ נתונים שמציינים שהוא נוצר ב-AI.

**6. איך אנחנו אוכפים**
6.1. כל בריף, כל תסריט וכל תמונה או סרטון שאתם מעלים עוברים בדיקה אוטומטית לפני שהם משמשים ליצירה. אם יש בעיה, היצירה נחסמת ומוצג הסבר בעברית. יצירה שנחסמה לא עולה קרדיטים.
6.2. דיווחים על שימוש לרעה נבדקים על ידי אדם.
6.3. לפי חומרת ההפרה: אזהרה, הסרת תוכן או ביטול קישור שיתוף, השעיית החשבון, או סגירתו. במקרים חמורים, או כשהדין מחייב, נעביר מידע לרשויות.

**7. דיווח על שימוש לרעה**
אם נתקלתם בסרטון שנוצר ב{{BRAND_NAME}} ומפר את המדיניות — במיוחד אם הוא משתמש בדמות או בקול שלכם בלי הסכמה — לחצו על "דיווח על הסרטון" בתחתית דף השיתוף, או כתבו ל-abuse@{{DOMAIN}} עם קישור לסרטון ותיאור קצר. נבדוק כל דיווח תוך 2 ימי עסקים, ובמקרה של שימוש בדמות בלי הסכמה, נשבית קודם את קישור השיתוף ורק אחר כך נבדוק.

**8. המגבלות של AI**
מודלים של בינה מלאכותית עלולים לטעות, להטות או ליצור תוצר דומה לתוצר שקיבל משתמש אחר. בדקו כל סרטון לפני שאתם מפרסמים אותו.

**9. שינויים**
נעדכן את המדיניות לפי הצורך, ונודיע על שינוי מהותי באתר ובמייל.

### §10.8 מדיניות הסכמה לשימוש בדמות ובקול (`/legal/likeness-consent`)

`summary`:
- "מותר להעלות צילומים של אנשים רק אם הם הסכימו, ובכתב."
- "צילומים של קטינים — רק בהסכמה בכתב של ההורים."
- "שיבוט קול ואווטאר עדיין לא זמינים. כשיהיו, רק האדם עצמו יוכל ליצור אותם."
- "יש לנו טופס הסכמה מוכן להורדה, לעובדים וללקוחות."
- "מישהו השתמש בדמות שלכם בלי רשות? כתבו לנו ונטפל מיד."

**1. למה המדיניות קיימת**
לפי חוק הגנת הפרטיות, שימוש בשמו, בתמונתו או בקולו של אדם למטרת רווח, בלי הסכמתו, הוא פגיעה בפרטיות. בנוסף, מידע ביומטרי — כמו טביעת קול או מאפייני פנים שמשמשים לשיבוט — הוא מידע בעל רגישות מיוחדת. לכן אנחנו מקפידים על הסכמה בכל מקום שבו אדם מופיע בסרטון.

**2. מה זמין היום**
היום אפשר להעלות לשירות צילומים וסרטונים שבהם מופיעים אנשים, ולשלב אותם בסרטונים. שיבוט קול ואווטאר דיגיטלי אינם זמינים כיום. השירות לא יוצר דמויות של אנשים אמיתיים, והוויז׳ואלים שה-AI יוצר אינם מבוססים על אדם מסוים.

**3. כשאתם מעלים צילומים של אנשים**
3.1. לפני העלאה של צילום או סרטון שבו מופיע אדם שאפשר לזהות, עליכם לקבל ממנו הסכמה בכתב לשימוש בדמותו ובקולו בסרטונים השיווקיים של העסק.
3.2. בצילום של קטין נדרשת הסכמה בכתב של ההורים או של האפוטרופוס.
3.3. בסרטון המלצה של לקוח נדרשים ציטוט אמיתי והסכמה בכתב של הלקוח. אסור ליצור המלצה בשם לקוח שלא אמר אותה.
3.4. באפליקציה, בהעלאה הראשונה בכל סשן, תתבקשו לסמן: **"מי שמופיע בצילומים נתן הסכמה לשימוש בהם בפרסום (ואם מופיעים ילדים — ההורים שלהם הסכימו בכתב)."** (אותו נוסח כמו בחלק 03 §6.) בלי הסימון ההעלאה לא מתחילה, והאישור נשמר עם הזמן והמשתמש.

**4. טופס הסכמה לשימוש בדמות ובקול**
אפשר להוריד את הטופס כקובץ PDF (`public/legal/model-release-he.pdf`, מופק מהנוסח שבהמשך על ידי `scripts/build-legal-pdfs.ts`) או להדפיס אותו ישירות מהעמוד (סגנון הדפסה ייעודי). נוסח הטופס:

ב-`content/legal/likeness-consent.mdx` הטופס עטוף בסמנים `{/* form:start */}` ו-`{/* form:end */}` בדיוק כמו כאן, וחובה לשמור עליהם (גם ב-`scripts/build-legal-pdfs.ts`, שמפיק את ה-PDF מהטקסט שביניהם): החריג של חלק 01 §2.6 לכפילויות ("מסכים או מסכימה") חל רק על הטקסט שבין הסמנים, ובלעדיהם `lint:copy` נכשל.

{/* form:start */}

> **טופס הסכמה לשימוש בדמות ובקול בתוכן שיווקי**
>
> שם העסק: ________________ (להלן: "העסק")
> שם המשתתף או המשתתפת: ________________ מספר זהות: ________________
>
> 1. אני מסכים או מסכימה שהעסק יצלם אותי, או ישתמש בצילומים ובהקלטות שבהם אני מופיע או מופיעה, וכן בשמי, לצורך הפקת סרטונים ותוכן שיווקי של העסק.
> 2. התוכן ישמש את העסק ברשתות החברתיות, באתר האינטרנט שלו, בהודעות לקוחות ובפרסום ממומן, לצורך שיווק העסק בלבד.
> 3. ידוע לי שהתוכן עשוי לעבור עריכה, כולל שילוב כתוביות, קריינות, מוזיקה וויז׳ואלים שנוצרו בעזרת בינה מלאכותית, ובלבד שהעריכה לא תציג אותי באופן מטעה או משפיל, ולא תשים בפי דברים שלא אמרתי.
> 4. אני רשאי או רשאית לבטל את ההסכמה בכל עת בהודעה בכתב לעסק. מרגע הביטול, העסק לא יפרסם תוכן חדש שבו אני מופיע או מופיעה, ויסיר בתוך זמן סביר תוכן קיים מהערוצים שבשליטתו.
> 5. לא קיבלתי ולא אקבל תמורה בעד ההסכמה, אלא אם סוכם אחרת בכתב: ________________
>
> חתימה: ________________ תאריך: ________________
>
> **למשתתף קטין (מתחת לגיל 18) — הסכמת ההורה או האפוטרופוס:**
> אני, ________________, מספר זהות ________________, ההורה או האפוטרופוס של הקטין או הקטינה ________________, מסכים או מסכימה לאמור לעיל בשמם.
> חתימה: ________________ תאריך: ________________

{/* form:end */}

**5. שיבוט קול ואווטאר (כשיושקו)**
5.1. רק האדם עצמו יוכל ליצור שיבוט של קולו או אווטאר של דמותו, מתוך החשבון שלו.
5.2. לפני היצירה, האדם יקריא ויקליט הצהרת הסכמה, ויסמן תיבת הסכמה נפרדת. נוסח ההצהרה (הנוסח הקנוני בחלק 06 §11.10; מוצג לפי המגדר שהדובר בחר בהגדרות, ובלי בחירה — בנוסח הכפול "מאשר או מאשרת", שמותר בהצהרה שאדם מקריא בעצמו):
> "אני, [שם מלא], מאשרת ל{{BRAND_NAME}} ליצור קול דיגיטלי שלי, לשימוש העסק [שם העסק] בלבד. אני יודעת שאפשר לבטל את ההסכמה בכל עת."
> "אני, [שם מלא], מאשר ל{{BRAND_NAME}} ליצור קול דיגיטלי שלי, לשימוש העסק [שם העסק] בלבד. אני יודע שאפשר לבטל את ההסכמה בכל עת."
5.3. ייתכן שנבקש אימות זהות נוסף. לא נאפשר שיבוט של אישי ציבור, ידוענים או קטינים.
5.4. ההקלטה וההסכמה יישמרו כראיה כל עוד השיבוט קיים, ולתקופה שהדין מחייב אחר כך.
5.5. אפשר לבטל את ההסכמה בכל עת בהגדרות. עם הביטול, נמחק את השיבוט אצלנו ונבקש מהספק למחוק אותו אצלו. סרטונים שכבר נוצרו נשארים בחשבון, והאחריות להמשך השימוש בהם היא של בעל החשבון.

**6. דיווח על שימוש בלי הסכמה**
אם הדמות או הקול שלכם הופיעו בסרטון שנוצר ב{{BRAND_NAME}} בלי הסכמתכם, כתבו ל-abuse@{{DOMAIN}} או ל-privacy@{{DOMAIN}}, עם קישור לסרטון אם יש לכם. נשבית מיד את קישור השיתוף, נבדוק את הפנייה ונעדכן אתכם.

**7. שמירה ואבטחה**
רישומי ההסכמה, וכשיושקו גם ההקלטות והשיבוטים, נשמרים בהצפנה, עם גישה מוגבלת לצוות, ונמחקים לפי מדיניות הפרטיות.

**קריטריוני קבלה**
- [ ] שבעת הדפים קיימים בנתיבים `/legal/{terms,privacy,cancellation,accessibility,ai-policy,likeness-consent,cookies}`, עם באנר הטיוטה, תיבת "בקצרה", תוכן עניינים וגרסה.
- [ ] `/accessibility` מפנה (308) ל-`/legal/accessibility`.
- [ ] `/legal/terms#credits` גולל לפרק תנאי הקרדיטים, וכל הקישורים "לתנאי הקרדיטים" באתר ובאפליקציה מצביעים אליו.
- [ ] הכפתור "ביטול מנוי" (בדיוק, כמו במילון המונחים) מופיע בראש `/legal/cancellation` ומוביל ל-`/app/billing/cancel`.
- [ ] הדוגמאות המספריות בסעיפים 2.3, 3.3 ו-3.4 של מדיניות הביטול זהות לתוצאת `lib/billing/refunds.ts` עם אותם קלטים (בדיקת יחידה).
- [ ] `scripts/check-content.ts --launch` נכשל כשיש דף בסטטוס `draft` או כשנשאר משתנה `{{…}}` כלשהו מהרשימה של חלק 06 §20.
- [ ] בהרשמה נרשמות הסכמות `terms` ו-`privacy` עם ה-`version` של הדפים, בפורמט התאריך ש-`ConsentBody` מקבל (גרסה כמו `1.0` נכשלת בבדיקת יחידה).
- [ ] רשימת העוגיות ב-`content/legal/cookies.mdx` זהה בדיוק לעוגיות שהדפדפן מקבל בפועל לפני הסכמה ואחריה (בדיקת Playwright, חלק 06 §11.7), ורשימת ה-`localStorage` כוללת רק את שלושת המפתחות של §5.3, ורשימת ה-`sessionStorage` רק את `reauth_draft_v1` ו-`signup_marketing_v1`.
- [ ] טבלת השמירה ב-`/legal/privacy#retention` זהה לטבלה בחלק 06 §11.5, ורשימת ספקי המשנה זהה ל-`docs/legal/subprocessors.md`.
- [ ] אף נוסח משפטי מוצג לא כולל `⚖️`, `[M0-verify]` או הפניה ל"חלק 0X".
- [ ] `model-release-he.pdf` נוצר ב-build ונפתח כ-PDF עם עברית תקינה מימין לשמאל.
- [ ] רשימת ספקי המשנה בעמוד הפרטיות תואמת את משתני הסביבה ואת הספקים שמוגדרים בפועל (בדיקת סקירה ידנית ב-M7).

---

## §11. באנר עוגיות, הסכמות וניוזלטר

### §11.1 עקרונות

- לפני שהגולש בחר — **שום סקריפט אנליטיקה לא נטען**: PostHog לא מאותחל, לא נשלחים אירועים, לא נשמרות עוגיות שאינן הכרחיות, ואין הגרלת וריאנט לניסוי.
- יש קטגוריה אחת שדורשת הסכמה: **"אנליטיקה ושיפור האתר"** (PostHog + עוגיית הניסוי `exp_hero`), שממופה ל-`consent_kind = 'analytics_cookies'`. אין עוגיות פרסום.
- הבאנר אינו "קיר": הוא לא חוסם את העמוד, לא מלכד פוקוס, ואפשר להמשיך לגלוש בלי לבחור (ואז נשארים במצב "רק הכרחיות").
- אם הדפדפן שולח Global Privacy Control (`navigator.globalPrivacyControl === true`), ברירת המחדל היא "כבוי", והבאנר מציג שורה נוספת: **"זיהינו שביקשתם בדפדפן לא לעקוב אחריכם, ולכן האנליטיקה כבויה."**

### §11.2 `CookieConsentBanner`

- מיקום ויזואלי: דסקטופ — כרטיס בפינה התחתונה מצד ההתחלה (ימין), רוחב מרבי 440px; מובייל — פס מלא בתחתית. כל עוד הבאנר פתוח, `MobileStickyCta` מוסתר.
- מיקום ב-DOM: מיד אחרי `SkipLink`, כ-`<section role="region" aria-labelledby="consent-title">`, כדי שמשתמשי מקלדת ייתקלו בו מוקדם. הכותרת מוכרזת פעם אחת ב-`aria-live="polite"`.
- **נוסח:**
  - כותרת: **"עוגיות, בקצרה"**
  - גוף: **"אנחנו משתמשים בעוגיות הכרחיות כדי שהאתר יעבוד. בהסכמתכם, נשתמש גם בעוגיות אנליטיקה כדי להבין איך משתמשים באתר ולשפר אותו. אין לנו עוגיות פרסום."** + קישור **"מדיניות העוגיות"**
  - כפתורים, באותו גודל ובאותה בולטות: **"מאשרים הכול"** · **"רק הכרחיות"**; וקישור-כפתור **"הגדרות"** שפותח את `CookiePreferencesDialog`.

### §11.3 `CookiePreferencesDialog`

- נפתח מהבאנר ומהקישור "הגדרות עוגיות" בפוטר (וגם מ-`/app/settings/privacy`). Dialog של Radix, מלכד פוקוס, Esc סוגר.
- כותרת: **"הגדרות עוגיות"**; פתיח: **"בחרו אילו עוגיות לאפשר. אפשר לשנות את הבחירה בכל רגע."**

| קטגוריה | תיאור | בקר |
|---|---|---|
| הכרחיות | "שומרות על ההתחברות, על סביבת העבודה ועל ההעדפות שלכם. בלעדיהן האתר לא יעבוד." | Switch פעיל ומנוטרל, עם הטקסט "תמיד פעילות" |
| אנליטיקה ושיפור האתר | "עוזרות לנו להבין אילו עמודים ופיצ׳רים משמשים אתכם, ולבדוק גרסאות שונות של עמודים — בלי תוכן אישי. הנתונים נשמרים באירופה." | Switch |

- כפתורים: **"שמירת הבחירה"** (ראשי) · **"מאשרים הכול"**. אחרי שמירה — טוסט **"ההגדרות נשמרו"**.

### §11.4 התנהגות ושמירה

```ts
// lib/consent/cookies.ts
export type ConsentState = { v: 1; analytics: boolean; ts: string };   // עוגייה consent_v1, שנה, SameSite=Lax, Secure
export async function setConsent(analytics: boolean) {
  writeConsentCookie({ v: 1, analytics, ts: new Date().toISOString() });
  await fetch("/api/consents", { method: "POST", body: JSON.stringify({
    kind: "analytics_cookies", granted: analytics, version: COOKIES_POLICY_VERSION, source: "cookie_banner" }) });
  if (analytics) { await initPostHog(); assignExperiments(); }          // EU host, persistence: "cookie"
  else { posthog?.opt_out_capturing(); deleteCookies(/^ph_/); deleteCookie("exp_hero"); }
}
```

- `COOKIES_POLICY_VERSION` = `version` מה-frontmatter של `/legal/cookies`. שינוי גרסה מהותי מציג את הבאנר שוב.
- משתמש מחובר: `POST /api/consents` משייך את ההסכמה ל-`user_id` (צד שרת), כך שהיא מופיעה בהגדרות הפרטיות שלו.
- שגיאה ב-`/api/consents` לא חוסמת את הבחירה המקומית; הבקשה נשלחת שוב בטעינה הבאה.

### §11.5 `NewsletterForm` (פוטר ובלוג)

- שדה: **"מייל"** (`LtrInput`, `type="email"`, placeholder `name@business.co.il`).
- תיבת הסכמה **לא מסומנת**: **"אני רוצה לקבל במייל את "5 הוקים לשבוע" ועדכונים מ{{BRAND_NAME}}. אפשר להסיר בכל רגע."**
- כפתור: **"הרשמה"**.
- שגיאות: מייל ריק או לא תקין — **"כתובת המייל לא נראית תקינה."** · תיבה לא מסומנת — **"כדי שנשלח לכם את הניוזלטר, סמנו את תיבת ההסכמה."** · הגבלת קצב — **"נראה שכבר נרשמתם לפני רגע. בדקו את תיבת המייל."**
- הצלחה: **"כמעט סיימנו: שלחנו לכם מייל לאישור ההרשמה."** → `POST /api/newsletter {email, consent:true}` שולח `newsletter_confirm`; ההסכמה `marketing_email` נרשמת (`source: "newsletter"`) רק אחרי הלחיצה על קישור האישור. אירוע `newsletter_subscribed` בצד הלקוח כשהטופס נשלח בהצלחה.
- כל מייל שיווקי שנשלח לרשימה: שורת נושא שמתחילה ב-"פרסומת:", פרטי השולח וקישור הסרה בלחיצה (`/unsubscribe?token=`), כמוגדר בחלק 06 §11.8. (חוק התקשורת, סעיף 30א, מאפשר פיצוי של עד ₪1,000 לכל הודעה שנשלחה בלי הסכמה, ולכן אין חריגים.)
- **חזרה מקישור האישור:** `GET /api/newsletter/confirm` מפנה ל-`/?newsletter=confirmed` או ל-`/?newsletter=invalid` (חלק 04 §21.1). אי קטן בדף הבית קורא את הפרמטר, מציג טוסט ומסיר את הפרמטר מה-URL (`history.replaceState`):
  - `confirmed`: **"ההרשמה אושרה. "5 הוקים לשבוע" יגיעו אליכם פעם בשבוע."**
  - `invalid`: **"קישור האישור פג או לא תקין. אפשר להירשם שוב בתחתית העמוד."**

### §11.6 עמוד ההסרה מדיוור (`/unsubscribe`)

- דינמי, `noindex`, בלי `MobileStickyCta` ובלי באנר עוגיות; הטוקן מגיע ב-`?token=` מקישור ההסרה שבתחתית כל מייל שיווקי (חלק 06 §12.3).
- H1: **"הסרה מרשימת התפוצה"**; גוף: **"לחיצה על הכפתור תפסיק את שליחת המיילים השיווקיים מ{{BRAND_NAME}} לכתובת הזו. מיילים על החשבון — קבלות, סרטון מוכן והודעות חיוב — ימשיכו להגיע."**
- כפתור: **"הסרה מהרשימה"** → `POST /api/unsubscribe?token=` (חלק 04 §21.4; אותו נתיב שמשמש את ההסרה בלחיצה אחת של תוכנות הדואר, RFC 8058). בזמן שליחה: **"מסירים…"**.
- הצלחה: **"הוסרתם מרשימת התפוצה. לא נשלח לכם יותר מיילים שיווקיים."** + קישור **"לדף הבית"**. הודעה חוזרת על כתובת שכבר הוסרה מציגה את אותו נוסח.
- טוקן לא תקין או חסר (`400`): **"הקישור להסרה לא תקין. אפשר לכתוב לנו ל-privacy@{{DOMAIN}}, ונסיר אתכם ידנית."**
- הגבלת קצב (`429`, bucket `unsubscribe`): **"היו כמה ניסיונות ברצף. נסו שוב בעוד דקה."**

**קריטריוני קבלה**
- [ ] לפני בחירה אין אף בקשה ל-`eu.i.posthog.com` ואין עוגיות `ph_*` (בדיקת Playwright על רשת ועוגיות).
- [ ] "רק הכרחיות" ו"מאשרים הכול" זהים בגודלם ובבולטותם; הבאנר נגיש במקלדת ולא מלכד פוקוס.
- [ ] ביטול הסכמה מוחק את `ph_*` ואת `exp_hero` ומפסיק שליחת אירועים מיד.
- [ ] כל בחירה נרשמת ב-`consents` עם `version` ו-`source: "cookie_banner"`.
- [ ] עם GPC פעיל, ברירת המחדל כבויה וההודעה המתאימה מוצגת.
- [ ] טופס הניוזלטר לא נשלח בלי סימון ההסכמה, וההסכמה נרשמת רק אחרי אישור כפול.
- [ ] `/?newsletter=confirmed` מציג את טוסט האישור פעם אחת, מסיר את הפרמטר מה-URL, והעמוד נשאר סטטי עם canonical ל-`/`.
- [ ] `/unsubscribe?token={valid}` מסיר את הכתובת (`email_suppressions` + שורת `consents` עם `granted: false`) ומציג את נוסח ההצלחה; טוקן שגוי מציג את נוסח השגיאה.

---

## §12. SEO

### §12.1 מטא-דאטה (`lib/seo/metadata.ts`)

```ts
// lib/seo/metadata.ts
export function buildMetadata(i: {
  title: string; titleShort?: string; description: string; path: string;
  noindex?: boolean; ogImage?: string; type?: "website" | "article"; publishedTime?: string;
}): Metadata {
  const url = new URL(i.path, env.NEXT_PUBLIC_SITE_URL).toString();   // https://{{DOMAIN}}/…, בלי לוכסן בסוף
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: buildTitle(i.title, i.titleShort),          // ≤ 60 תווים; מסיר " | {{BRAND_NAME}}" ואז עובר לקצר
    description: clamp(i.description, 155),            // חיתוך במילה שלמה + "…"
    alternates: { canonical: url },
    robots: i.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { url, siteName: BRAND.nameHe, locale: "he_IL", type: i.type ?? "website",
                 title: i.title, description: i.description, images: i.ogImage ? [i.ogImage] : undefined },
    twitter: { card: "summary_large_image" },
  };
}
```

- כל עמוד ציבורי מגדיר `generateMetadata` דרך `buildMetadata` בלבד.
- כותרת עד 60 תווים, תיאור עד 155, שניהם ייחודיים לכל URL שמאונדקס. בדיקת CI (`tests/seo/unique-meta.test.ts`) עוברת על כל ה-URL-ים במפות האתר ונכשלת על כפילות או חריגה.
- `lang="he"`, `dir="rtl"`; אין `hreflang` (שפה אחת).
- אימות Search Console ו-Bing נעשה ברשומת DNS, לא בתגית מטא.

### §12.2 כללי אינדוקס ו"תוכן עבה"

| עמוד | ברירת מחדל | תנאי לאינדוקס |
|---|---|---|
| `/`, `/niches`, `/hooks`, `/hooks/types`, `/examples`, `/templates`, `/pricing`, `/blog`, `/about`, `/contact`, `/faq`, `/legal/*` | index | — |
| `/niches/[niche]` | index | `is_active`, `seo_reviewed_at` מלא ו-`landing_intro_he` ≥ 150 מילים |
| `/hooks/[niche]` | index | **כל** התנאים: `is_active`, `seo_reviewed_at` מלא, `seo_intro_he` ≥ 150 מילים, ולפחות 8 הוקים מפורסמים. אחרת `noindex,follow` ו-canonical ל-`/hooks` |
| `/hooks/[niche]/[type]` | noindex,follow | ≥ 8 הוקים **וגם** קובץ פתיח ייחודי |
| `/hooks/types/[type]` | index | קובץ MDX קיים |
| `/hooks/season/[season]` | index | קובץ פתיח קיים ולפחות 8 הוקים מוצגים |
| `/hooks/platform/[platform]` | index | ≥ 12 הוקים |
| `/hooks/h/[id]` | noindex | — (canonical לעמוד האב) |
| `/templates/[slug]` | index | `is_public` |
| `/blog/[slug]`, `/blog/tag/[tag]` | index | לא `draft`; עמוד תגית עם 2 מאמרים לפחות |
| כל URL עם פרמטרי סינון (`?q=`, `?type=` וכו׳), `?v=`, `?cycle=`, `?vat=`, `?topic=` | noindex,follow | canonical לבסיס |
| `/` עם `?niche=`, `?newsletter=` או `?src=` | index (אותו HTML סטטי) | canonical תמיד ל-`/` |
| `/exp/*`, `/v/*`, `/approve/*`, `/unsubscribe`, `/login`, `/auth/*`, `/dev/*` | noindex | — (`/dev/*` מחזיר 404 בפרודקשן) |

- הפונקציה `isIndexable(page)` ב-`lib/seo/indexing.ts` מחשבת את התנאים, ומשמשת גם את `generateMetadata` וגם את `sitemap.ts`, כך שעמוד `noindex` לעולם לא נכנס למפת האתר.
- **פריסות שאינן פרודקשן:** כש-`VERCEL_ENV !== "production"`, כל תגובה מקבלת `X-Robots-Tag: noindex, nofollow` (`next.config.ts` → `headers`), ו-`robots.ts` מחזיר `Disallow: /`.
- **דומיין קנוני:** `https://{{DOMAIN}}` בלי www; `www.{{DOMAIN}}` מפנה (308) בהגדרות הדומיין ב-Vercel. נתיבים באותיות קטנות, בלי לוכסן בסוף (`trailingSlash: false`).

### §12.3 מפות אתר ו-robots

```ts
// app/sitemap.ts
export async function generateSitemaps() {
  return [{ id: "static" }, { id: "niches" }, { id: "hooks" }, { id: "hook-types" }, { id: "seasons" }, { id: "blog" }];
}
export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  switch (id) {
    case "static":     return staticPages();          // /, /niches, /hooks, /examples, /templates(+[slug]), /pricing, /about, /contact, /faq, /legal/*
    case "niches":     return nichePages();           // /niches/[niche] שעומדים ב-isIndexable
    case "hooks":      return hookNichePages();       // /hooks/[niche] + /hooks/[niche]/[type] מאונדקסים + /hooks/platform/*
    case "hook-types": return hookTypePages();        // /hooks/types + /hooks/types/[type]
    case "seasons":    return seasonPages();          // /hooks/season/[season]
    case "blog":       return blogPages();            // /blog, /blog/[slug], /blog/tag/[tag]
  }
  return [];
}
```

- `lastModified` = `updated_at` של הרשומה (או `updated`/`date` של המאמר); בלי `changeFrequency` ו-`priority`.
- `app/robots.ts` מפרט כל מפה (`https://{{DOMAIN}}/sitemap/{id}.xml`) ואוסר `/app`, `/admin`, `/api`, `/v`, `/approve`, `/exp`, `/dev`. [M0-verify] את מבנה ה-URL המדויק של `generateSitemaps` ב-Next 16; אם אין אינדקס מפות אוטומטי, מוסיפים `app/sitemap-index.xml/route.ts` שמחזיר `<sitemapindex>` ומפנים אליו גם מ-robots.

```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app", "/admin", "/api", "/v", "/approve", "/exp", "/dev"] }],
    sitemap: SITEMAP_IDS.map((id) => `https://${BRAND.domain}/sitemap/${id}.xml`),
    host: `https://${BRAND.domain}`,
  };
}
```

### §12.4 JSON-LD (`lib/seo/jsonld.ts`, `components/seo/JsonLd.tsx`)

- `JsonLd` מרנדר `<script type="application/ld+json">` עם `JSON.stringify(data).replace(/</g, "\\u003c")` (כדי שמחרוזת כמו `</script>` לא תסגור את התגית). זה בלוק נתונים שהדפדפן לא מריץ, ולכן הוא לא דורש nonce או hash של CSP: בעמודי השיווק הסטטיים אין קריאה ל-`headers()` (שהייתה הופכת אותם לדינמיים), ובנתיבים הדינמיים (`/v/*`, `/approve/*`) מותר להוסיף `nonce` מ-`x-nonce` (חלק 06 §15.3). כל פונקציה מחזירה אובייקט מוקלד (`schema-dts`).
- **אין שום נתון מומצא:** בלי `aggregateRating`, בלי `review`, בלי ספירת משתמשים.

| פונקציה | איפה | שדות עיקריים |
|---|---|---|
| `organization()` | כל העמודים (layout שיווקי) | `@type: Organization`, `name: {{BRAND_NAME}}`, `alternateName: {{BRAND_NAME_EN}}`, `url`, `logo` (`/icons/logo-512.png`), `sameAs` (רק רשתות מוגדרות), `contactPoint: { contactType: "customer support", email: support@{{DOMAIN}}, areaServed: "IL", availableLanguage: ["he"] }`, `legalName: {{LEGAL_ENTITY_NAME}}` |
| `website()` | דף הבית | `@type: WebSite`, `inLanguage: "he"`, `potentialAction: SearchAction` עם `target: "https://{{DOMAIN}}/hooks?q={search_term_string}"` |
| `softwareApplication(pricing)` | דף הבית, `/pricing` | `@type: SoftwareApplication`, `applicationCategory: "MultimediaApplication"`, `operatingSystem: "Web"`, `inLanguage: "he"`, `offers: AggregateOffer` (ILS, `lowPrice: 0`, `highPrice`, `offerCount`) |
| `product(pricing)` | `/pricing` | `@type: Product` + `offers: AggregateOffer` ו-`Offer` לכל תוכנית וחבילה, `priceCurrency: "ILS"`, `priceSpecification.valueAddedTaxIncluded: true` |
| `breadcrumb(items)` | כל עמוד עם Breadcrumbs | `BreadcrumbList`, שמות בעברית, URL-ים מוחלטים |
| `faqPage(items: { q_he: string; a_he: string }[])` | דף הבית, `/faq`, `/pricing`, דפי נישה והוקים | `FAQPage` (לטובת המשתמשים; אין ציפייה לתוצאה עשירה). שאלות מ-`messages/he.json` (`marketing.faq.items.{id}.q/a`) מומרות לאותו מבנה לפני הקריאה |
| `itemListHooks(hooks, url)` | עמודי הוקים | `ItemList` של `ListItem` עם `name` = טקסט ההוק ו-`url` = `{url}#{hook.id}` |
| `videoObject(v)` | `/examples`, דפי נישה ותבנית, `ExampleVideo` | `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration` (ISO 8601, למשל `PT30S`), `contentUrl`, `inLanguage: "he"`, `isFamilyFriendly: true` |
| `howTo(steps)` | דף הבית (איך זה עובד), `/hooks/types/[type]` | `HowTo` עם `step: HowToStep[]` (שם + טקסט) |
| `blogPosting(post)` | `/blog/[slug]` | `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` + `publisher` מסוג `Organization`, `inLanguage: "he"`, `mainEntityOfPage` |

### §12.5 תמונות Open Graph

- `next/og` (`ImageResponse`, 1200×630) עם Heebo מ-`public/fonts/Heebo-{800,500}.ttf` (נטען ב-`fetch(new URL(..., import.meta.url))`). מכיוון שתמיכת ה-bidi של Satori חלשה, כל מחרוזת עברית עוברת סידור חזותי לפני הרינדור:

```ts
// lib/seo/og.ts
import bidiFactory from "bidi-js";
const bidi = bidiFactory();
/** מחזיר את המחרוזת בסדר חזותי (משמאל לימין) כדי ש-Satori ירנדר אותה נכון בכיוון LTR. */
export function toVisualOrder(line: string): string {
  const levels = bidi.getEmbeddingLevels(line, "rtl");
  const flips = bidi.getReorderSegments(line, levels);
  const chars = [...line];
  for (const [start, end] of flips) chars.splice(start, end - start + 1, ...chars.slice(start, end + 1).reverse());
  const mirrored = bidi.getMirroredCharactersMap(line, levels);   // סוגריים ומירכאות
  mirrored.forEach((ch, i) => { chars[i] = ch; });
  return chars.join("");
}
/** שבירת שורות לפי מילים (לא לפי אותיות), עד maxChars לשורה, לפני הסידור החזותי. */
export function wrapWords(text: string, maxChars: number, maxLines: number): string[];
```

- כל שורה נשברת קודם לפי מילים (`wrapWords`), ורק אחר כך עוברת `toVisualOrder`, ומרונדרת ב-`<div style={{ direction: "ltr", textAlign: "right" }}>`. [M0-verify] על הסט `tests/fixtures/bidi-strings.json`; אם התוצאה לא תקינה, עוברים לגיבוי: תמונות סטטיות מ-`PosterStill` ב-`public-media/og/{type}/{slug}.png`, שנוצרות ב-`scripts/generate-niche-seo.ts`, וההחלטה נרשמת ב-`DECISIONS.md`.
- **תבניות:**

| קובץ | תוכן התמונה |
|---|---|
| `app/opengraph-image.tsx` | רקע `#08080C`, אלומת זהב בפינה העליונה מצד ההתחלה, H1 של וריאנט A ("תדמית" בזהב), 3 מסגרות טלפון מעומעמות, `{{DOMAIN}}` |
| `app/(marketing)/niches/[niche]/opengraph-image.tsx` | אייקון הנישה, "סרטון תדמית ל{short_name_he}", הוק מומלץ אחד בצ׳יפ לימון, `{{BRAND_NAME}}` |
| `app/(marketing)/hooks/[niche]/opengraph-image.tsx` | "{count, plural, one {הוק אחד} two {שני הוקים} other {# הוקים}} ל{short_name_he}", 2 הוקים לדוגמה |
| `app/(marketing)/hooks/types/[type]/opengraph-image.tsx` | ה-`h1` מה-frontmatter של הסוג (§5.7), `example_he` |
| `app/(marketing)/hooks/h/[id]/opengraph-image.tsx` | טקסט ההוק בגדול (עד 3 שורות), צ׳יפ סוג, "ספריית ההוקים של {{BRAND_NAME}}" |
| `app/(marketing)/blog/[slug]/opengraph-image.tsx` | כותרת המאמר, תגית, `{{BRAND_NAME}}` |

(תמונת ה-OG של דף השיתוף, `/v/[token]/opengraph-image`, מוגדרת בחלק 03 §8 ומשתמשת באותם `toVisualOrder` ו-`wrapWords`.)

- `alt` לכל תמונה (`export const alt`) בעברית, זהה לטקסט הראשי שבתמונה.
- בדיקת Playwright: צילום של 4 תמונות OG והשוואה לתמונות זהב (`tests/e2e/og.spec.ts`).

### §12.6 כללי קישור פנימי

1. **אין עמוד יתום.** כל URL במפת האתר נגיש בלחיצות מדף הבית תוך 3 קפיצות לכל היותר. בדיקת CI זוחלת את האתר המקומי מהדף הראשי ומשווה לרשימת מפות האתר.
2. **נישה ↔ הוקים:** כל `/niches/[niche]` מקשר ל-`/hooks/[niche]`, וכל `/hooks/[niche]` מקשר חזרה, עם טקסט עוגן טבעי בעברית ("לכל ההוקים למתווכי נדל״ן", "סרטון תדמית למתווכי נדל״ן").
3. **נישות קרובות:** כל עמוד נישה ועמוד הוקים לנישה מקשר ל-4–6 נישות מאותה קטגוריה.
4. **סוגים:** כל `HookCard` בעמודים המלאים מקשר את צ׳יפ הסוג ל-`/hooks/types/[type]`; כל עמוד סוג מקשר ל-6 עמודי נישה × סוג.
5. **עונות:** האב ההוקים ועמודי הנישה מקשרים לעונות הקרובות; כל עמוד עונה מקשר לנישות שלה.
6. **פוטר:** 10 נישות, 6 עמודי הוקים לנישה, העונה הקרובה, דף פלטפורמה אחד, סוגי הוקים, ושלושת המאמרים המרכזיים.
7. **בלוג:** כל מאמר מקשר ל-2 עמודי נישה או הוקים לפחות, וכל עמוד נישה מציג עד 2 מאמרים שמסומנים בנישה שלו ("מהבלוג").
8. **Breadcrumbs** בכל עמוד חוץ מדף הבית, עם `BreadcrumbList`.
9. קישורים לעמודי `noindex` (סינון, `/hooks/h/[id]`) מותרים לגולשים, אבל לא מופיעים בפוטר ובתפריטים.
10. טקסט עוגן לעולם לא "לחצו כאן" או "קראו עוד" לבד; תמיד תיאור של היעד.

**קריטריוני קבלה**
- [ ] כל עמוד מאונדקס עובר Rich Results Test בלי שגיאות JSON-LD.
- [ ] אין כפילות כותרות או תיאורים בין עמודים מאונדקסים; אין כותרת מעל 60 תווים.
- [ ] עמוד שאינו עומד ב-`isIndexable` מקבל `noindex,follow` ואינו מופיע באף מפת אתר.
- [ ] פריסת Preview מחזירה `X-Robots-Tag: noindex, nofollow`.
- [ ] תמונות OG בעברית מוצגות בסדר הנכון (בדיקת snapshot), כולל מספרים ומילים באנגלית.
- [ ] זחילת CI לא מוצאת עמודים יתומים או קישורים שבורים.

---

## §13. ביצועים (Core Web Vitals) בעמודי השיווק

### §13.1 תקציבים

| עמוד | LCP (מובייל, 4G) | CLS | INP | JS ראשוני (gzip) | TTFB | Lighthouse מובייל (ביצועים / נגישות / SEO) |
|---|---|---|---|---|---|---|
| `/` | < 2.5s (אלמנט: H1) | < 0.05 | < 200ms | ≤ 170KB | < 400ms | ≥ 90 / 100 / 100 |
| `/hooks/[niche]` | < 2.0s (H1) | < 0.05 | < 200ms | ≤ 130KB | < 300ms (מטמון ISR) | ≥ 90 / 100 / 100 |
| `/hooks` | < 2.5s | < 0.05 | < 200ms | ≤ 150KB | < 400ms | ≥ 90 / 100 / 100 |
| `/pricing` | < 2.0s | < 0.05 | < 200ms | ≤ 130KB | < 300ms | ≥ 90 / 100 / 100 |
| `/niches/[niche]` | < 2.5s | < 0.05 | < 200ms | ≤ 150KB | < 300ms | ≥ 90 / 100 / 100 |
| `/blog/[slug]`, `/legal/*`, `/faq` | < 1.8s | < 0.02 | < 200ms | ≤ 100KB | < 300ms | ≥ 95 / 100 / 100 |

### §13.2 כללים

- **גופנים:** Heebo משתנה, `subsets: ['hebrew','latin']`, `display: 'swap'`, preload רק ל-Heebo. Karantina נטען רק בעמודים שמשתמשים בו (דף הבית, `FinalCtaBand`), ו-JetBrains Mono לא נטען בעמודי שיווק.
- **תמונות:** `next/image` עם AVIF/WebP, `sizes` מדויק, `remotePatterns` ל-`*.supabase.co`. כל מדיה בתוך קופסה עם `aspect-ratio` קבוע (אפס הזזת פריסה).
- **וידאו:** `preload="none"`, `poster` תמיד, ניגון רק כשנראה (IntersectionObserver), עצירה ב-`visibilitychange`. אין וידאו לפני הצביעה הראשונה.
- **אפקטים:** GSAP, Lenis, Magic UI ו-Aceternity נטענים ב-`next/dynamic` רק בעמודים שבהם הם משמשים, ולא נטענים בכלל תחת הפחתת תנועה. מרקיז ב-CSS transforms, לא ב-JS לכל פריים.
- **Remotion Player** לא נטען בעמודי שיווק, חוץ ממיקרו-הדגמות ב-bento שנטענות בעצלות כשהן נכנסות למסך.
- **סקריפטים של צד שלישי:** אף אחד לפני הסכמה, חוץ מ-Vercel Speed Insights (נטען מאותו דומיין, `/_vercel/speed-insights/*`, אנונימי ובלי עוגיות). PostHog נטען אחרי הסכמה, ב-`requestIdleCallback`.
- **סקשנים מתחת לקפל:** `content-visibility: auto` עם `contain-intrinsic-size` מותאם.
- **מדידה:** Lighthouse CI על כל PR (פריסת Preview) לשישה URL-ים: `/`, `/hooks`, `/hooks/real-estate`, `/pricing`, `/niches/dentists`, `/blog/real-estate-hooks`, עם `lighthouse-budget.json` שנכשל על חריגה. מדידת שדה: Vercel Speed Insights (`@vercel/speed-insights`, מדדים אנונימיים בלי עוגיות, כמו בחלק 06 §17 ובטבלת ספקי המשנה, §10.3). לא שולחים מדדי ביצועים כאירועי PostHog, כי הם לא ברשימת האירועים הקנונית.

**קריטריוני קבלה**
- [ ] Lighthouse CI עובר את כל התקציבים בטבלה על פריסת Preview.
- [ ] בניתוח ה-bundle (`@next/bundle-analyzer`), דף הבית לא טוען GSAP/Lenis/Remotion במסלול הראשוני.
- [ ] תחת `prefers-reduced-motion` לא נטענים קובצי האפקטים בכלל (בדיקת רשת ב-Playwright).

---

## §14. אנליטיקה שיווקית

- כל האירועים עוברים דרך `track()` המוקלד ב-`lib/analytics/events.ts`, שהוא no-op עד שניתנה הסכמה (§11). שמות ב-snake_case; **אין מידע מזהה במאפיינים**: לא מייל, לא טקסט חיפוש, לא שם עסק, לא ערכי התאמה אישית.
- הרשימה הקנונית של כל 63 האירועים, עם המאפיינים המדויקים והצד (לקוח או שרת), נמצאת בחלק 06 §14.2 (`lib/analytics/events.ts`). הטבלה כאן היא תת-הקבוצה שהאתר השיווקי שולח, וכל שורה בה זהה לשורה המקבילה שם; `?` מסמן מאפיין אופציונלי. מאפייני-העל (`app_env`, `release`, `theme`, `reduced_motion`, `is_mobile`) מתווספים אוטומטית לכל אירוע (חלק 06 §14.1). בנוסף נשלחים רק אירועי ה-PostHog המובנים `$pageview` (ידנית, במעבר עמוד) ו-`$feature_flag_called` (ניסוי הגיבור).

| אירוע | מאפיינים | מתי נשלח |
|---|---|---|
| `cta_clicked` | `location: CtaLocation` (הערכים השיווקיים בהמשך) | לחיצה על כל כפתור הנעה לפעולה |
| `signup_started` | `method?: "google" \| "magic_link" \| "phone"`, `source?: SignupSource` (`header` · `hero` · `hooks_gate` · `pricing` · `final_cta` · `mobile_sticky` · `login`) | מעבר לעמוד ההתחברות מכפתור באתר |
| `niche_selected` | `niche`, `location: NicheLocation` (באתר: `hero` · `niche_showcase` · `final_cta` · `niches_hub`) | בחירת נישה |
| `hook_copied` | `hook_id`, `niche` (slug או `"universal"`), `location: HookLocation` (באתר: `hub` · `niche_page` · `hook_niche_page` · `single_hook` · `landing_teaser` · `niche_showcase` · `blog`) | העתקת הוק |
| `hook_personalized` | `fields_count: int` | פעם לסשן, אחרי הקלדה ב-`HookPersonalizer` |
| `hook_create_video_clicked` | `hook_id` | "צרו סרטון מההוק" |
| `hook_variations_requested` | `hook_id: string \| null` | "5 וריאציות AI" (באתר תמיד עם `hook_id`) |
| `hook_shared` | `hook_id`, `channel: "whatsapp" \| "link"` | שיתוף הוק |
| `hook_favorited` | `hook_id`, `on: boolean` | שמירת הוק (משתמש מחובר) |
| `hooks_searched` | `q_length: int`, `results?: int`, `location` (`hub` · `landing_teaser` · `hook_niche_page`; `app_hooks` באפליקציה) | חיפוש בספרייה, בלי הטקסט |
| `hooks_filtered` | `facet` (`niche` · `type` · `platform` · `goal` · `gender` · `season` · `featured` · `has_video` · `sort`), `value` (ערך enum או slug בלבד) | שינוי מסנן |
| `savings_calculated` | `videos: int`, `price_bucket` (`lt300` · `300_700` · `700_1500` · `gt1500`), `quality` (`draft` · `standard`) | שימוש במחשבון החיסכון |
| `faq_expanded` | `question_id`, `location` (`landing` · `faq_page` · `pricing_page` · `niche_page` · `hook_niche_page`) | פתיחת שאלה |
| `example_played` | `example_id`, `location` (`landing_gallery` · `examples` · `niche_page` · `template_page`) | ניגון דוגמה |
| `contact_submitted` | `topic` (ערכי `topic` של `ContactBody`) | שליחת טופס יצירת הקשר |
| `pricing_viewed` | `location` (`landing` · `pricing_page`; `app` באפליקציה) | צפייה במחירים |
| `newsletter_subscribed` | — | שליחת טופס ניוזלטר מוצלחת |
| `motion_toggled` | `on: boolean` | "עצירת אנימציות" |
| `theme_changed` | `theme: "dark" \| "light" \| "system"` | החלפת ערכת נושא |

**ערכי `location` ל-`cta_clicked` באתר** (תת-קבוצה של `CtaLocation`, חלק 06 §14.3): `header` · `mobile_menu` · `hero` · `how_it_works` · `editor_math` · `hooks_teaser` · `landing_gallery` · `final_cta` · `mobile_sticky` · `niche_page_hero` · `niche_page_final` · `hooks_page_cta` · `examples_dialog` · `template_card` · `template_page` · `pricing_card_free` · `pricing_card_starter` · `pricing_card_business` · `pricing_card_agency` · `pricing_pack_150` · `pricing_pack_500` · `pricing_pack_1500` · `blog_cta` · `about` · `not_found`. ערכי החבילות נבנים ממספר הקרדיטים של החבילה, ולא מה-`id` שלה.

**משפכים שמוגדרים ב-PostHog** (כתובים כקוד ב-`docs/analytics.md` ומוגדרים ידנית בלוח):
1. **ספרייה → הרשמה:** `$pageview` של `/hooks*` → `hook_copied` או `hook_create_video_clicked` → `signup_started` → `signup_completed` (יעד: ≥ 2.5% מצפיות בספרייה להרשמה).
2. **דף הבית → סרטון ראשון:** `$pageview /` → `cta_clicked {hero}` → `signup_completed` → `generation_confirmed` → `video_downloaded`.
3. **מחירים → רכישה:** `pricing_viewed` → `cta_clicked {pricing_card_*}` → `checkout_started` → `checkout_completed`.
4. **ניסוי הגיבור:** פילוח של משפך 2 לפי `hero_copy_v1`.

**קריטריוני קבלה**
- [ ] כל אירוע בטבלה מוגדר בטיפוסים, ושליחת אירוע לא מוגדר נכשלת ב-typecheck.
- [ ] בדיקת יחידה מוודאת שאף מאפיין לא מכיל מייל, URL עם פרמטרים או טקסט חופשי.
- [ ] לפני הסכמה `track()` לא שולח דבר (בדיקת Playwright על הרשת).

---

## תלויות בין חלקים

- **חלק 01:** הרכיבים הקנוניים של §1.4 (`HookCard`, `VideoTile`, `PhoneFrame`, `Price`, `Num animate`, `LegalPage`, `JsonLd` ועוד), `formatIls` (₪ לפני המספר), הבסיס של `BRAND`, התג "הדגמה", תוויות פריסטי הכתוביות ו-`Watermark`.
- **חלק 03:** הפרמטרים של `/app/create` (`niche`, `hook`, `template`, `season`, `src` ∈ `hero` · `final_cta` · `hooks` · `template` · `niche_page`), קריאת `hero_draft_v1` ו-`hook_personalize_v1`; `/app/hooks?source={id}&variations=1` ו-`/app/hooks?generate=1&niche=&q=`; `/app/billing/plans?plan=&cycle=` ו-`/app/billing?topup=`; הודעת ההקשר ב-`/login?next=/app/billing/cancel`; דף השיתוף `/v/[token]` (כולל תמונת ה-OG שלו) ו-`/approve/[token]`; כפתור "נבדק" ב-`/admin/niches` שכותב `seo_reviewed_at`; הדגל `bitEnabled` ב-`TopUpDialog`; הקופי של `wizard.facts.q.*` ושל תיבת ההסכמה בהעלאה.
- **חלק 04:** עמודות הנישה (`short_name_he`, `seo_*`, `landing_intro_he`, `faq` במבנה `{q_he, a_he}`, `sample_scripts`, `seo_reviewed_at`) והקובץ `niche_extras.json` (`fill_if_null`); `search_hooks` + `search_hooks_facets` ו-`GET /api/hooks/search`; החוזים `HookCardDTO`, `HookSearchQuery` ו-`HookSearchResponse` ב-`lib/api/contracts/hooks.ts` (§20.3), שהאתר מייבא ולא מגדיר מחדש; `POST /api/hooks/[id]/event`, `POST /api/hooks/favorites`; `POST /api/contact`, `POST /api/newsletter`, `GET /api/newsletter/confirm` (הפניה 303 ל-`/?newsletter=`), `POST /api/unsubscribe`, `POST /api/consents` (גרסה בפורמט תאריך); מפתחות `app_settings` (`marketing_announcement`, `hook_of_the_day` עם `history`, `typical_video_credits`, `vat_rate`, `allocation_threshold_schedule`, `quiet_day_banner`); ה-cron `hook-of-the-day`; נתיבי `public-media` (`examples/`, `hooks/`, `og/`, `demo/wall/`, `demo/examples/`); ה-buckets של §18.6; ה-rewrite של `exp_hero` ב-`proxy.ts`; ערכי ה-seed של התוכניות, החבילות ו-`credit_costs.label_he`.
- **חלק 05:** `SAMPLE_PRESETS`, `SamplePreset` ו-`estimateSample` (23 / 50 / 107 / 478 עם ה-seed); `seo.niche_intro.v1` (`SeoNicheIntroV1`) ו-`script.generate.v1` לתוכן הנישות; `HOOK_PLACEHOLDERS`, `PLACEHOLDERS` ו-`applyShekel` ב-`lib/hebrew/placeholders.ts`; `withPrefix` ב-`lib/hebrew/text.ts`; הסתייגויות החובה של `COMPLIANCE_RULES`; `data_collection: "deny"` בכל בקשה (`[M0-verify]` לנקודות המדיה).
- **חלק 06:** קטלוג האירועים (§14.2) והטיפוסים (§14.3); רשימת העוגיות (§11.7) וטבלת השמירה (§11.5), שזהות לדפי העוגיות והפרטיות כאן; `docs/legal/subprocessors.md`; דוגמאות ההחזר של `lib/billing/refunds.ts` (= מדיניות הביטול); `GROW_PAGE_CODE_BIT` ← `bitEnabled`; רשימת משתני התוכן (§20) ושער `check-content.ts --launch`; רשימת ⚖️ ב-§25 (כל הדפים המשפטיים, החזר יחסי במנוי שנתי, ניסוח Bit); המיילים `newsletter_confirm`, `terms_update`, `price_change_notice`; CSP (hash לעמודים הסטטיים, nonce לדינמיים).
- **נספח D:** חמשת סרטוני ההדגמה (`pnpm demo:render --upload` ← `public-media/demo/examples/`) לגלריה, ל-`NicheShowcase` ולעמוד הדוגמאות; האנימטיקים של קיר הווידאו; `toNicheSampleScript`.
- **נספח E:** ברירות המחדל לנישה (§3.3, דרך `niche_extras.json`); כללי הפיסוק (בלי `·` על המסך, בלי כוכבית להערות שוליים, מירכאות רגילות); `BANNED_PHRASES` שגם הקופי השיווקי עובר מולו ב-`lint:copy`.
- **נספח F:** בסיס הנתיבים, דף הבית וה-SEO (§4.2, §11.7, §12.8); בכל סתירה, החלק הזה גובר.
