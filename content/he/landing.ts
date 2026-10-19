/**
 * Home page copy (2026 light redesign). Short lines on purpose: max ~12 words per sub-line.
 * Claims rules of spec 07–08 §A.3–§A.4 still apply: no guaranteed results, "אחרי בדיקה של מטא" wherever
 * "live" is implied, no competitor names, and the only money comparison is COMPARISON_CLAIMS[0] (sourced, dated).
 */
import { PLANS } from "@/lib/data/plans";
import { BRAND } from "@/lib/constants";

const nf = new Intl.NumberFormat("he-IL");
const ils = (n: number) => `₪${nf.format(n)}`;

/* ---------- Values injected into copy (build time, from the seed) ---------- */
export const TRIAL_CREDITS = PLANS.find((p) => p.id === "free")?.oneTimeCredits ?? 70;
const STARTER = PLANS.find((p) => p.id === "starter")!;
const BUSINESS = PLANS.find((p) => p.id === "business")!;
const AGENCY = PLANS.find((p) => p.id === "agency")!;
export const STARTING_PRICE = STARTER.monthlyIls;


export const LANDING = {
  meta: {
    title: `${BRAND.nameHe} | סרטון מוכן וקמפיין בפייסבוק ובאינסטגרם, בלחיצה`,
    description: `בוחרים נישה, מקבלים סרטון בעברית ומעלים אותו כקמפיין לפייסבוק ולאינסטגרם. בלי סוכנות, 0% מתקציב הפרסום. ${TRIAL_CREDITS} קרדיטים לניסיון, בלי כרטיס אשראי.`,
  },

  promo: {
    badge: "חדש",
    text: "מעלים סרטון כקמפיין לפייסבוק ולאינסטגרם בלחיצה",
    textShort: "סרטון לקמפיין בלחיצה",
    href: "/campaigns",
    dismiss: "סגירת ההודעה",
  },

  hero: {
    title: "סרטון מוכן וקמפיין באוויר.",
    accent: "בלחיצה אחת.",
    sub: `בלי עורך וידאו ובלי סוכנות. החל מ-${ils(STARTER.monthlyIls)} לחודש.`,
    ctaPrimary: "צרו סרטון ראשון בחינם",
    ctaSecondary: "איך זה עובד",
    trust: `${TRIAL_CREDITS} קרדיטים לניסיון · בלי כרטיס אשראי`,
    phonesLabel: "דוגמאות לרילס עם הוק בעברית, לפי נישה (הדגמה)",
    badgeLive: "הקמפיין עלה לאוויר",
    badgeLiveSub: "אחרי בדיקה של מטא",
  },

  how: {
    title: "איך זה עובד?",
    subtitle: "שלושה צעדים. בלי ידע בשיווק.",
    steps: [
      { title: "בוחרים נישה והוק", text: "מתחילים מהתחום שלכם ומפתיחה שעוצרת גלילה." },
      { title: "מקבלים סרטון בעברית", text: "תסריט, קריינות וכתוביות. מוכן לפרסום." },
      { title: "מעלים כקמפיין", text: "בוחרים תקציב יומי ולוחצים פרסום." },
    ],
    stepLabel: "שלב",
    mock: {
      search: "מספרה",
      nicheQ: "מה העסק שלכם?",
      niches: ["מספרות", "מסעדות", "רופאי שיניים", "נדל״ן"],
      hooksTitle: "הוקים מומלצים",
      checklist: ["קריינות", "כתוביות", "מוזיקה"],
      budgetTitle: "תקציב יומי",
      budgets: [30, 40, 70],
      platforms: ["פייסבוק", "אינסטגרם"],
      publish: "פרסום הקמפיין",
      review: "עולה אחרי בדיקה של מטא",
    },
  },

  dash: {
    title: "הדשבורד הכי פשוט שראיתם",
    subtitle: "ארבעה מספרים. בלי ז׳רגון.",
    windowTitle: "קמפיינים",
    period: "7 הימים האחרונים",
    active: "פעיל",
    badge: "דוגמה להמחשה",
    kpis: { spend: "כמה הוצאתם", reach: "כמה אנשים ראו", results: "כמה פניות", cpr: "כמה עלתה כל פנייה" },
    chartTitle: "פניות לפי יום",
    hooksTitle: "איזה הוק עבד",
    winner: "המנצח",
    leads: "פניות",
    disclaimer: "המספרים להמחשה בלבד. לא תוצאות של עסק אמיתי ולא הבטחה לתוצאות.",
    cta: "קמפיינים בפייסבוק ובאינסטגרם",
  },

  reels: {
    title: "סרטונים שעוצרים גלילה",
    subtitle: "הוקים אמיתיים מהספרייה, לכל נישה.",
    label: "דוגמאות לסרטונים לפי נישה (הדגמה)",
    cta: "לכל הדוגמאות",
  },

  pricing: {
    title: "מחיר קבוע. בלי הפתעות.",
    subtitle: "0% מתקציב הפרסום. ביטול בכל רגע.",
    perMonth: "לחודש",
    annual: (n: number) => `או ${ils(n)} לחודש בחיוב שנתי`,
    cta: (name: string) => `מתחילים עם ${name}`,
    recommended: "מומלץ",
    features: {
      starter: [`כ-${STARTER.approxVideos} סרטונים בחודש`, "Full HD, בלי סימן מים", `קמפיינים עד ${ils(STARTER.meta.monthlySpendCapIls)} בחודש`, "דף עסק אחד"],
      business: [`כ-${BUSINESS.approxVideos} סרטונים בחודש`, "פרימיום ומוזיקה מקורית", `קמפיינים עד ${ils(BUSINESS.meta.monthlySpendCapIls)} בחודש`, "בדיקת 3 הוקים במקביל"],
      agency: [`כ-${AGENCY.approxVideos} סרטונים בחודש`, "עד 15 לקוחות, 10 משתמשים", `קמפיינים עד ${ils(AGENCY.meta.monthlySpendCapIls)} בחודש`, "דפי שיתוף בלי המיתוג שלנו"],
    } as Record<string, string[]>,
    note: `המחירים כוללים מע״מ · ${TRIAL_CREDITS} קרדיטים חינם לניסיון`,
    all: "להשוואה המלאה",
  },

  faq: {
    title: "שאלות קצרות",
    all: "לכל השאלות",
    items: [
      { id: "no-editing", q: "צריך לדעת לערוך וידאו?", a: "לא. בוחרים נישה והוק, מאשרים תסריט, והמערכת מרכיבה סרטון עם קריינות וכתוביות. שינויים עושים בטקסט." },
      { id: "meta-who-pays", q: "מי משלם למטא על הפרסום?", a: "אתם, ישירות, מאמצעי התשלום שבחשבון המודעות שלכם. אנחנו לא גובים ולא מחזיקים את הכסף הזה." },
      { id: "meta-fee", q: "אתם לוקחים אחוז מתקציב הפרסום?", a: `לא. 0% מתקציב הפרסום. משלמים רק את המחיר הקבוע של התוכנית, כולל מע״מ.` },
      { id: "meta-guarantee", q: "אתם מבטיחים לידים או תוצאות?", a: "לא, ואף אחד לא יכול להבטיח את זה בכנות. אנחנו נותנים סרטון לפי כללי הוקים, הגדרות מומלצות ודוח ברור." },
      { id: "cancel", q: "איך מבטלים מנוי?", a: "אונליין, בכל רגע, מעמוד החיוב ובלי שיחת שימור. ב-14 הימים הראשונים אחרי תשלום אפשר לבקש החזר." },
    ],
  },

  finalCta: {
    title: "הסרטון הבא שלכם מתחיל כאן",
    subtitle: `${TRIAL_CREDITS} קרדיטים לניסיון. בלי כרטיס אשראי.`,
    cta: "צרו סרטון ראשון בחינם",
    secondary: "לכל המחירים",
  },

  /* Spec §G.1 / §L.5 — DashboardPreview, always labelled as a sample */
  dashboard: {
    badge: "דוגמה להמחשה",
    windowTitle: "קמפיינים",
    periodLabel: "7 הימים האחרונים",
    statusActive: "פעיל",
    kpis: {
      spend: { label: "כמה הוצאתם", hint: "כמה מטא גבתה מהכרטיס שלכם על הקמפיין בתקופה הזאת." },
      reach: { label: "כמה אנשים ראו", hint: "כמה אנשים שונים ראו את המודעה לפחות פעם אחת." },
      results: { label: "כמה פניות", sublabel: "פניות בוואטסאפ", hint: "כמה אנשים התחילו שיחה איתכם בוואטסאפ מהמודעה." },
      cpr: { label: "כמה עלתה כל פנייה", hint: "התקציב שהוצאתם, חלקי מספר הפניות." },
    },
    whatIsIt: "מה זה?",
    chartTitle: "הוצאה ופניות לפי יום",
    chartSpend: "הוצאה (₪)",
    chartResults: "פניות",
    chartTableSummary: "טבלת הנתונים של הגרף",
    dayCol: "יום",
    hooksTitle: "איזה הוק עבד",
    hookCols: { hook: "ההוק", hookRate: "עצרו לצפות", results: "פניות", cpr: "עלות לפנייה" },
    winner: "המנצח",
    actions: ["שינוי תקציב", "השהיה", "הגבירו את המנצח"],
    actionsLabel: "פעולות לדוגמה",
    sentence: (spend: string, results: number, hook: string) =>
      `השבוע הוצאתם ${spend}, ו-${results} אנשים פנו אליכם בוואטסאפ. ההוק שהביא הכי הרבה פניות, במחיר הנמוך ביותר לפנייה: ${hook}`,
    disclaimer: "המספרים בדוגמה הזאת להמחשה בלבד. הם לא תוצאות של עסק אמיתי, ולא הבטחה לתוצאות.",
    summaryLabel: "סיכום בעברית פשוטה",
  },
} as const;

/* ---------- Spec §A.4: comparison claims (mirror of content/claims/comparisons.json) ---------- */
export interface ClaimSource { label: string; url: string; accessed_at: string }
export interface ComparisonClaim {
  id: string;
  text_he: string;
  value_range_ils: [number, number] | null;
  unit: "month";
  sources: ClaimSource[];
  reviewed_at: string;
  note_he: string;
}

export const COMPARISON_CLAIMS: ComparisonClaim[] = [
  {
    id: "agency-social-management-monthly",
    text_he: "סוכנות, מנהל סושיאל או פרילנסר לניהול פייסבוק ואינסטגרם או קמפיינים ממומנים",
    value_range_ils: [1500, 6000],
    unit: "month",
    sources: [
      { label: "jett.co.il, מחירון ניהול סושיאל (2025)", url: "https://www.jett.co.il/social-media-management-price/", accessed_at: "2026-10-17" },
      {
        label: "kanmedia.co.il, מחירון שיווק דיגיטלי לעסקים קטנים (2025)",
        url: "https://kanmedia.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-%D7%9C%D7%A2%D7%A1%D7%A7%D7%99%D7%9D-%D7%A7%D7%98%D7%A0%D7%99%D7%9D-%D7%91%D7%99%D7%A9/",
        accessed_at: "2026-10-17",
      },
      {
        label: "bidernet.co.il, מדריך מחירי פרסום בפייסבוק לשנת 2025",
        url: "https://bidernet.co.il/%d7%9e%d7%97%d7%99%d7%a8-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%a4%d7%99%d7%99%d7%a1%d7%91%d7%95%d7%a7-%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%9c%d7%a9%d7%a0%d7%aa-2025/",
        accessed_at: "2026-10-17",
      },
    ],
    reviewed_at: "2026-10-17",
    note_he: "דמי ניהול חודשיים לפני תקציב הפרסום. הערכה לפי מקורות פומביים, לא הצעת מחיר.",
  },
  {
    id: "ad-budget-paid-separately",
    text_he: "תקציב הפרסום משולם לפלטפורמה בנפרד מדמי הניהול",
    value_range_ils: null,
    unit: "month",
    sources: [
      { label: "calliber.co.il, מחירון קמפיינים ממומנים ברשתות", url: "https://calliber.co.il/prices-list/social-media-sponsored-campaigns/", accessed_at: "2026-10-17" },
      { label: "lemel.co.il, מחיר ניהול סושיאל", url: "https://lemel.co.il/social-media-management-price/", accessed_at: "2026-10-17" },
    ],
    reviewed_at: "2026-10-17",
    note_he: "גם אצלנו התקציב משולם ישירות למטא, ואנחנו לא לוקחים ממנו אחוזים.",
  },
];
