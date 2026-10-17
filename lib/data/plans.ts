/**
 * Plans, packs and credit costs (Appendix F §10, spec 07–08 §K and §S.7). Prices in ₪ INCLUDING 18% VAT.
 * Source of truth at runtime will be the `plans` / `credit_packs` / `credit_costs` tables (Part 04 seed);
 * this module mirrors the seed so the marketing site renders before the database exists.
 */
export type PlanId = "free" | "starter" | "business" | "agency";

export interface Plan {
  id: PlanId;
  nameHe: string;
  monthlyIls: number;
  annualMonthlyIls: number | null;
  annualTotalIls: number | null;
  monthlyCredits: number;
  oneTimeCredits?: number;
  approxVideos: number;
  badgeHe?: string;
  taglineHe: string;
  featuresHe: string[];
  meta: {
    adAccounts: number;
    activeCampaigns: number | null;
    monthlySpendCapIls: number;
    testSpendIls: number;
  };
  landingPages: number | "per_client";
  healthChecksPerMonth: number;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    nameHe: "חינם",
    monthlyIls: 0,
    annualMonthlyIls: null,
    annualTotalIls: null,
    monthlyCredits: 0,
    oneTimeCredits: 70,
    approxVideos: 2,
    taglineHe: "לנסות בלי להתחייב",
    featuresHe: [
      "70 קרדיטים לניסיון (כ-2 סרטונים קצרים באיכות טיוטה, עם סימן מים)",
      "איכות טיוטה, 720p, פורמט 9:16",
      "גישה מלאה לספריית ההוקים",
      "פרסום רגיל לאינסטגרם ולפייסבוק",
      "קמפיין ניסיון אחד עד ₪300",
      "בלי כרטיס אשראי",
    ],
    meta: { adAccounts: 1, activeCampaigns: 1, monthlySpendCapIls: 0, testSpendIls: 300 },
    landingPages: 0,
    healthChecksPerMonth: 1,
  },
  {
    id: "starter",
    nameHe: "בסיס",
    monthlyIls: 119,
    annualMonthlyIls: 95,
    annualTotalIls: 1140,
    monthlyCredits: 400,
    approxVideos: 8,
    taglineHe: "לעסק שמתחיל לפרסם",
    featuresHe: [
      "400 קרדיטים בחודש (כ-8 סרטונים)",
      "איכות טיוטה וסטנדרט, Full HD",
      "3 פורמטים: 9:16, 1:1, 16:9",
      "בלי סימן מים",
      "קמפיינים בפייסבוק ובאינסטגרם, עד ₪3,000 תקציב בחודש",
      "דף עסק אחד",
      "קריינות וכתוביות בעברית",
    ],
    meta: { adAccounts: 1, activeCampaigns: 2, monthlySpendCapIls: 3000, testSpendIls: 0 },
    landingPages: 1,
    healthChecksPerMonth: 2,
  },
  {
    id: "business",
    nameHe: "עסק",
    monthlyIls: 289,
    annualMonthlyIls: 231,
    annualTotalIls: 2772,
    monthlyCredits: 1000,
    approxVideos: 20,
    badgeHe: "מומלץ",
    taglineHe: "לעסק שצומח",
    featuresHe: [
      "1,000 קרדיטים בחודש (כ-20 סרטונים)",
      "כל רמות האיכות, כולל פרימיום",
      "מוזיקה מקורית לכל סרטון",
      "קמפיינים בלי הגבלת כמות, עד ₪15,000 תקציב בחודש",
      "בדיקת 3 הוקים במקביל וכללים אוטומטיים",
      "3 דפי עסק ו-3 משתמשים",
      "תיבת לידים מלאה",
    ],
    meta: { adAccounts: 2, activeCampaigns: null, monthlySpendCapIls: 15000, testSpendIls: 0 },
    landingPages: 3,
    healthChecksPerMonth: 4,
  },
  {
    id: "agency",
    nameHe: "סוכנות",
    monthlyIls: 990,
    annualMonthlyIls: 792,
    annualTotalIls: 9504,
    monthlyCredits: 3300,
    approxVideos: 66,
    taglineHe: "למנהלי סושיאל וסוכנויות",
    featuresHe: [
      "3,300 קרדיטים בחודש (כ-66 סרטונים)",
      "עד 15 סביבות לקוח, ערכת מותג ודף עסק לכל לקוח",
      "קמפיינים עד ₪100,000 תקציב בחודש",
      "10 משתמשים והרשאות",
      "דפי שיתוף בלי המיתוג שלנו (White label)",
      "קישורי אישור ללקוח",
    ],
    meta: { adAccounts: 15, activeCampaigns: null, monthlySpendCapIls: 100000, testSpendIls: 0 },
    landingPages: "per_client",
    healthChecksPerMonth: 4,
  },
];

export const PLAN_PROMISES_HE = [
  "0% מתקציב הפרסום: התקציב עובר ישירות מהכרטיס שלכם למטא",
  "קרדיטים שלא נוצלו עוברים לחודש הבא",
  "החזר קרדיטים אוטומטי על יצירה שנכשלה",
  "ביטול מנוי אונליין בכל רגע",
  "חשבונית מס לכל תשלום",
  "המחירים כוללים מע״מ",
];

export const CREDIT_PACKS = [
  { id: "pack-150", credits: 150, priceIls: 59 },
  { id: "pack-500", credits: 500, priceIls: 179 },
  { id: "pack-1500", credits: 1500, priceIls: 449 },
] as const;

/** "How much does a video cost" examples (Appendix F §10.4). */
export const VIDEO_COST_EXAMPLES = [
  { labelHe: "רילס 15 שניות, תמונות בתנועה", credits: 23 },
  { labelHe: "רילס 30 שניות, איכות טיוטה", credits: 50 },
  { labelHe: "רילס 30 שניות, איכות סטנדרט", credits: 107 },
  { labelHe: "סרטון תדמית 60 שניות, פרימיום", credits: 478 },
  { labelHe: "דף עסק (יצירה או יצירה מחדש)", credits: 10 },
] as const;

export const VAT_RATE = 0.18;
