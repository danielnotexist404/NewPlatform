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

const creditsLine = (p: (typeof PLANS)[number]) => `${nf.format(p.monthlyCredits)} קרדיטים בחודש · כ-${p.approxVideos} סרטונים`;

export const LANDING = {
  meta: {
    title: `${BRAND.nameHe} | סרטון מוכן וקמפיין בפייסבוק ובאינסטגרם, בלחיצה`,
    description: `בוחרים נישה, מקבלים סרטון בעברית ומעלים אותו כקמפיין לפייסבוק ולאינסטגרם. בלי סוכנות, 0% מתקציב הפרסום. ${TRIAL_CREDITS} קרדיטים לניסיון, בלי כרטיס אשראי.`,
  },

  promo: {
    badge: "חדש",
    text: "מעלים סרטון כקמפיין לפייסבוק ולאינסטגרם בלחיצה",
    textShort: "מעלים סרטון כקמפיין בלחיצה",
    href: "/campaigns",
    dismiss: "סגירת ההודעה",
  },

  hero: {
    eyebrow: "סרטונים וקמפיינים ב-AI, בעברית",
    title: "סרטון מוכן וקמפיין באוויר",
    accentLead: "בלחיצה אחת,",
    accentBefore: "החל מ-",
    accentAfter: " לחודש",
    sub: ["בלי עורך וידאו, בלי סוכנות ובלי מנהל המודעות של מטא.", "מחיר קבוע, ו-0% מתקציב הפרסום."],
    ctaPrimary: "צרו סרטון ראשון בחינם",
    ctaSecondary: "ראו איך זה עובד",
    trust: [`${TRIAL_CREDITS} קרדיטים לניסיון`, "בלי כרטיס אשראי", "ביטול בכל רגע"],
    phonesLabel: "דוגמאות לרילס עם הוק בעברית, לפי נישה (הדגמה)",
    demo: "דוגמה",
    views: "צפיות",
    typingLabel: "הוק מתחלף",
    badgeLive: "הקמפיין אושר ועלה לאוויר",
    badgeLiveSub: "פייסבוק ואינסטגרם",
    badgeLeads: "פניות בוואטסאפ השבוע",
  },

  niches: {
    label: "לכל עסק",
    all: "לכל הנישות",
  },

  how: {
    eyebrow: "איך זה עובד",
    title: "איך זה עובד?",
    subtitle: "ארבעה צעדים. בלי ידע בשיווק ובלי עורך וידאו.",
    steps: [
      { title: "בוחרים נישה והוק", text: "מתחילים מהתחום שלכם ומפתיחה שעוצרת גלילה." },
      { title: "מקבלים סרטון בעברית", text: "תסריט, קריינות, כתוביות ומוזיקה. מוכן לפרסום." },
      { title: "מעלים כקמפיין", text: "בוחרים תקציב יומי ולוחצים פרסום. עולה אחרי בדיקה של מטא." },
      { title: "רואים תוצאות", text: "ארבעה מספרים פשוטים, בעברית. בלי ז׳רגון." },
    ],
    stepLabel: "שלב",
    mock: {
      nicheQ: "מה העסק שלכם?",
      hooksTitle: "הוקים מומלצים",
      picked: "נבחר",
      rendering: "מרכיבים את הסרטון",
      checklist: ["תסריט בעברית", "קריינות", "כתוביות מימין לשמאל", "מוזיקה מקורית"],
      budgetTitle: "תקציב יומי",
      budgets: [30, 40, 70],
      platforms: ["פייסבוק", "אינסטגרם"],
      goal: "מטרה: הודעות בוואטסאפ",
      publish: "פרסום הקמפיין",
      review: "עולה לאוויר אחרי בדיקה של מטא",
      demo: "דוגמה",
    },
  },

  dash: {
    eyebrow: "דשבורד",
    title: "הדשבורד הכי פשוט שראיתם",
    subtitle: "ארבעה מספרים שכל בעל עסק מבין במבט.",
    bullets: [
      { title: "בלי ז׳רגון", text: "כמה הוצאתם, כמה ראו, כמה פנו." },
      { title: "רואים מה עבד", text: "איזה הוק הביא הכי הרבה פניות." },
      { title: "שולטים בלחיצה", text: "משנים תקציב או עוצרים, מכאן." },
    ],
    windowTitle: "קמפיינים",
    period: "7 הימים האחרונים",
    active: "פעיל",
    badge: "דוגמה להמחשה",
    kpis: { spend: "כמה הוצאתם", reach: "כמה אנשים ראו", results: "כמה פניות", cpr: "כמה עלתה כל פנייה" },
    chartTitle: "פניות לפי יום",
    hooksTitle: "איזה הוק עבד",
    winner: "המנצח",
    perLead: "לפנייה",
    leads: "פניות",
    actions: ["שינוי תקציב", "השהיה"],
    disclaimer: "המספרים להמחשה בלבד. לא תוצאות של עסק אמיתי ולא הבטחה לתוצאות.",
    cta: "לכל הפרטים על קמפיינים",
  },

  trends: {
    eyebrow: "טרנדים",
    title: "טרנדים של השבוע",
    subtitle: "פורמטים שתופסים ברשת, מותאמים לעסק שלכם.",
    cta: "לכל הטרנדים",
    prev: "הטרנד הקודם",
    next: "הטרנד הבא",
    legal: "מעתיקים את המבנה, לא את הסרטון.",
    demo: "הדגמה",
    items: [
      { slug: "bait-and-sign", name: "פיתיון ושלט", line: "רגע דרמטי, קאט, ושלט בכתב יד עם ההצעה.", tag: "מתאים למודעה", tone: "ok", niche: "מסעדות", sign: "בואו לאכול אצלנו. אנחנו בחולון" },
      { slug: "behind-the-viral", name: "מאחורי הקלעים", line: "הצוות באמצע משהו מוזר. סקרנות עד הסוף.", tag: "מתאים למודעה, באישור המצולמים", tone: "ok", niche: "מסעדות", sign: "מאחורי הקלעים" },
      { slug: "almost-got-me-reveal", name: "כמעט נפגעתי", line: "פיזיקה בלתי אפשרית שגורמת לצפות שוב.", tag: "מתאים למודעה, עם תווית AI", tone: "ok", niche: "הובלות", sign: "צולם ב-AI" },
      { slug: "fake-system-popup", name: "התראה מזויפת", line: "התראה קופצת בדיוק כשהאוכל נוחת.", tag: "לפוסט רגיל בלבד", tone: "warn", niche: "מסעדות", sign: "סוללה חלשה · נותרו 10%" },
    ],
  },

  pricing: {
    eyebrow: "מחירים",
    title: "מחיר קבוע. בלי הפתעות.",
    subtitle: "משלמים לנו מנוי, ולמטא רק על הפרסום עצמו.",
    cycleLabel: "מחזור חיוב",
    monthly: "חודשי",
    annual: "שנתי",
    save: (pct: number) => `חיסכון ${pct}%`,
    perMonth: "לחודש",
    billedAnnual: (total: string) => `${total} בחיוב שנתי`,
    billedMonthly: "חיוב חודשי, ביטול בכל רגע",
    cta: (name: string) => `מתחילים עם ${name}`,
    recommended: "מומלץ",
    features: {
      starter: [creditsLine(STARTER), "Full HD, בלי סימן מים", "3 פורמטים: 9:16, 1:1, 16:9", `קמפיינים עד ${ils(STARTER.meta.monthlySpendCapIls)} בחודש`, "דף עסק אחד", "קריינות וכתוביות בעברית"],
      business: [creditsLine(BUSINESS), "כל רמות האיכות, כולל פרימיום", "מוזיקה מקורית לכל סרטון", `קמפיינים בלי הגבלה, עד ${ils(BUSINESS.meta.monthlySpendCapIls)} בחודש`, "בדיקת 3 הוקים במקביל", "3 דפי עסק ותיבת לידים"],
      agency: [creditsLine(AGENCY), "עד 15 סביבות לקוח", `קמפיינים עד ${ils(AGENCY.meta.monthlySpendCapIls)} בחודש`, "10 משתמשים והרשאות", "דפי שיתוף בלי המיתוג שלנו", "קישורי אישור ללקוח"],
    } as Record<string, string[]>,
    trial: { title: "רוצים קודם לנסות?", text: `${TRIAL_CREDITS} קרדיטים חינם, בלי כרטיס אשראי.`, cta: "מתחילים בחינם" },
    note: "המחירים כוללים מע״מ · 0% מתקציב הפרסום",
    all: "להשוואה המלאה",
  },

  agency: {
    eyebrow: "למה אנחנו",
    title: "עדיין משלמים לסוכנות?",
    subtitle: "הסרטון והקמפיין, במחיר של מנוי.",
    tiles: [
      { key: "save", title: "חיסכון", text: `אצלנו החל מ-${ils(STARTER.monthlyIls)} לחודש, בלי אחוזים מהתקציב.` },
      { key: "no-skill", title: "בלי ידע בשיווק", text: "ההגדרות המומלצות לנישה שלכם כבר מוכנות." },
      { key: "minutes", title: "תוך דקות", text: "תסריט ותצוגה מקדימה תוך דקות, לא תוך שבוע." },
      { key: "hebrew", title: "הכול בעברית", text: "סרטון, כתוביות, דשבורד ותמיכה. מימין לשמאל." },
    ],
    compareThem: "סוכנות או מנהל סושיאל",
    compareThemValue: "בערך ₪1,500–₪6,000 בחודש",
    compareUs: BRAND.nameHe,
    compareUsValue: `החל מ-${ils(STARTER.monthlyIls)} בחודש`,
    footnote: "דמי ניהול חודשיים לפני תקציב הפרסום, לפי מקורות פומביים מ-2025. הערכה, לא הצעת מחיר.",
    sourcesLabel: "מקורות",
  },

  faq: {
    eyebrow: "שאלות",
    title: "יש שאלות?",
    subtitle: "התשובות הקצרות. כל השאר בעמוד השאלות.",
    all: "לכל השאלות",
    items: [
      { id: "no-editing", q: "צריך לדעת לערוך וידאו?", a: "לא. בוחרים נישה והוק, מאשרים תסריט, והמערכת עורכת, מוסיפה קריינות וכתוביות ומרכיבה את הסרטון. שינויים עושים בטקסט, בלי ציר זמן." },
      { id: "meta-who-pays", q: "מי משלם למטא על הפרסום?", a: "אתם, ישירות. מטא גובה את התקציב מאמצעי התשלום שבחשבון המודעות שלכם. אנחנו לא גובים, לא מחזיקים ולא מחזירים את הכסף הזה." },
      { id: "meta-fee", q: "אתם לוקחים אחוז מתקציב הפרסום?", a: `לא. 0% מתקציב הפרסום. משלמים רק את המחיר הקבוע של התוכנית, כולל מע״מ. לכל תוכנית יש תקרת תקציב חודשית, למשל ${ils(STARTER.meta.monthlySpendCapIls)} בתוכנית בסיס.` },
      { id: "meta-what-i-need", q: "צריך ניסיון במנהל המודעות של מטא?", a: "לא. צריך עמוד פייסבוק עסקי, חשבון אינסטגרם מקצועי וחשבון מודעות עם אמצעי תשלום. לכל דבר שחסר יש הסבר בעברית בזמן החיבור." },
      { id: "meta-guarantee", q: "אתם מבטיחים לידים או תוצאות?", a: "לא, ואף אחד לא יכול להבטיח את זה בכנות. אנחנו נותנים סרטון שנבנה לפי כללי הוקים, הגדרות מומלצות לנישה ודוח שמראה בדיוק מה קרה." },
      { id: "cancel", q: "איך מבטלים מנוי?", a: "אונליין, בכל רגע, מעמוד החיוב ובלי שיחת שימור. קישור לביטול יש גם בתחתית כל עמוד. ב-14 הימים הראשונים אחרי תשלום אפשר לבקש החזר, לפי מדיניות הביטול." },
    ],
  },

  finalCta: {
    title: "הסרטון הבא של העסק שלכם מתחיל כאן",
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
