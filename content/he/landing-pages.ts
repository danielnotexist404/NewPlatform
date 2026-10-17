/**
 * Copy for "דף העסק" (spec 07–08 §S.1, §S.7): app list + editor (`app.landingPages.*`), the public
 * business page and its per-business privacy notice (template, ⚖️ [Counsel]). Voice: Appendix E.
 */
import { BRAND } from "@/lib/constants";
import type { BusinessIdType, LandingStatus } from "@/lib/mock/landing-pages";

export const LP_META = {
  list: { title: "דפי עסק", description: "דף אחד בעברית לעסק שאין לו אתר: הסרטון, השירותים, שעות הפתיחה, וואטסאפ וטופס פניות." },
  editor: (name: string) => ({ title: `עריכת דף העסק · ${name}`, description: "עורכים את הטקסטים, רואים תצוגה מקדימה ומפרסמים." }),
  newPage: { title: "דף עסק חדש", description: "יוצרים דף עסק מערכת המותג, מהתחום ומהסרטון הכי טוב שלכם." },
} as const;

export const LP_STATUS: Record<LandingStatus, string> = {
  draft: "טיוטה",
  published: "באוויר",
  unpublished: "הוסר מהאוויר",
};

export const LP_ID_TYPE: Record<BusinessIdType, string> = {
  osek_murshe: "עוסק מורשה",
  osek_patur: "עוסק פטור",
  company: "ח.פ.",
};

export const LP_COST = {
  generate: "יצירה",
  regenerate: "יצירה מחדש",
  preview: "יצירת תצוגה מקדימה",
  credits: (n: number) => (n === 1 ? "קרדיט אחד" : `${n} קרדיטים`),
  note: "יצירה או יצירה מחדש: 10 קרדיטים. עריכת טקסט, פרסום והסרה מהאוויר: חינם.",
} as const;

export const LP_DEMO = {
  label: "מצב הדגמה",
  body: "החליפו תוכנית כדי לראות מה רואים בתוכנית החינמית.",
  starter: "תוכנית בסיס",
  free: "תוכנית חינם",
} as const;

export const LP_GATE = {
  title: "דף העסק זמין בתוכניות בתשלום",
  body: "בתוכנית החינמית אפשר ליצור תצוגה מקדימה עם סימן מים ולראות איך הדף ייראה. כדי לפרסם אותו ולקבל פניות, עוברים לתוכנית בתשלום או רוכשים חבילת קרדיטים.",
  plansCta: "לתוכניות",
  packCta: "רכישת חבילת קרדיטים",
  perPlan: "כמה דפים בכל תוכנית",
  planRow: { free: "תצוגה מקדימה בלבד", perClient: "דף לכל לקוח" },
  locked: "פרסום · בתוכניות בתשלום",
  watermark: "תצוגה מקדימה · לא לפרסום",
} as const;

export const LP_LIST = {
  eyebrow: "דף העסק",
  h1: "דפי עסק",
  lead: "דף אחד בעברית לעסק שאין לו אתר: הסרטון שלכם, השירותים, שעות הפתיחה, וואטסאפ וטופס פניות. כשאין לכם אתר, הקמפיינים שולחים את הלקוחות לכאן.",
  usage: (used: number, limit: number, plan: string) => `${used} מתוך ${limit} ${limit === 1 ? "דף" : "דפים"} ב${plan}`,
  sampleStats: "נתוני דוגמה",
  views: "צפיות",
  leads: "פניות מהטופס",
  updated: (d: string) => `עודכן ב-${d}`,
  publishedOn: (d: string) => `באוויר מ-${d}`,
  edit: "עריכה",
  view: "צפייה בדף",
  copy: "העתקת הכתובת",
  copied: "הכתובת הועתקה",
  addTitle: "דף עסק נוסף",
  addLimit: (plan: string) => `ב${plan} יש מקום לדף עסק אחד. בתוכנית עסק אפשר 3 דפים, ובתוכנית סוכנות דף לכל לקוח.`,
  upgrade: "שדרוג לתוכנית עסק",
  emptyTitle: "עוד אין לכם דף עסק",
  emptyBody: "אנחנו בונים את הדף מערכת המותג, מהתחום ומהסרטון הכי טוב שלכם. אתם רק בודקים את הטקסטים.",
  featuresTitle: "מה יש בדף",
  features: [
    { key: "video", title: "הסרטון שלכם בראש הדף", body: "הרילס הכי טוב שלכם, בלי לחפש עורך אתרים." },
    { key: "services", title: "שירותים ומחירים", body: "\"החל מ-\" רק כשיש מחיר אמיתי." },
    { key: "hours", title: "שעות וכתובת", body: "שעות פתיחה, כתובת וכפתור ניווט בוויז." },
    { key: "contact", title: "וואטסאפ וטלפון", body: "כפתורים קבועים בתחתית המסך בנייד." },
    { key: "form", title: "טופס פניות", body: "כל פנייה נכנסת לתיבת הלידים, עם התג \"דף העסק\"." },
    { key: "privacy", title: "מדיניות פרטיות לעסק", body: "דף פרטיות שנוצר לכל עסק, עם פרטי העסק." },
  ],
} as const;

export const LP_EDITOR = {
  back: "דפי עסק",
  autosave: "השינויים נשמרים אוטומטית",
  viewToggle: { edit: "עריכה", preview: "תצוגה מקדימה" },
  publish: "פרסום",
  unpublish: "הסרה מהאוויר",
  republish: "פרסום מחדש",
  view: "צפייה בדף",
  slug: {
    label: "כתובת הדף",
    help: "אותיות באנגלית, מספרים ומקפים. 3–40 תווים.",
    errors: {
      format: "רק אותיות קטנות באנגלית, מספרים ומקף בין מילים.",
      length: "הכתובת צריכה להיות באורך 3–40 תווים.",
      reserved: "הכתובת הזאת שמורה. נסו כתובת אחרת.",
      taken: "הכתובת הזאת כבר תפוסה. נסו כתובת אחרת.",
    },
    available: "הכתובת פנויה",
  },
  sections: {
    hero: { title: "סרטון בראש הדף", help: "בוחרים אחד מהסרטונים המוכנים שלכם." },
    headline: { title: "כותרת ומשפט פתיחה" },
    benefits: { title: "3 יתרונות" },
    services: { title: "שירותים ומחירים", help: "\"החל מ-\" מופיע רק כשממלאים מחיר. השאירו ריק כשאין מחיר קבוע." },
    hours: { title: "שעות פתיחה" },
    address: { title: "כתובת וניווט" },
    contact: { title: "וואטסאפ וטלפון" },
    form: { title: "טופס פניות", help: "הפניות נכנסות לתיבת הלידים עם התג \"דף העסק\"." },
    faq: { title: "שאלות נפוצות" },
    legal: { title: "פרטי העסק בתחתית הדף", help: "חובה להציג את זהות העסק. דף מדיניות הפרטיות נוצר אוטומטית לפי הפרטים האלה." },
  },
  fields: {
    h1: "כותרת ראשית",
    subline: "משפט פתיחה",
    benefit: (n: number) => `יתרון ${n}`,
    serviceName: "שם השירות",
    serviceDesc: "תיאור קצר",
    servicePrice: "החל מ-₪",
    servicePriceHelp: "רשות",
    addService: "הוספת שירות",
    removeService: (name: string) => `מחיקת השירות ${name || "בלי שם"}`,
    hoursOpen: "פתיחה",
    hoursClose: "סגירה",
    hoursClosed: "סגור",
    street: "רחוב ומספר",
    city: "עיר",
    waze: "קישור לניווט בוויז",
    whatsapp: "מספר וואטסאפ",
    whatsappPrefill: "הודעה מוכנה בוואטסאפ",
    phone: "טלפון",
    formName: "שם מלא",
    formPhone: "טלפון",
    formEmail: "מייל",
    formMessage: "הודעה חופשית",
    formTime: "מתי נוח שנחזור אליכם",
    required: "חובה",
    submitLabel: "הטקסט בכפתור",
    faqQ: "שאלה",
    faqA: "תשובה",
    addFaq: "הוספת שאלה",
    removeFaq: (n: number) => `מחיקת שאלה ${n}`,
    faqCount: (n: number, max: number) => `${n} מתוך ${max}`,
    legalName: "השם הרשמי של העסק",
    idType: "סוג העסק",
    idNumber: "מספר עוסק או ח.פ.",
    privacyLink: "דף מדיניות הפרטיות (טיוטה)",
    counter: (n: number, max: number) => `${n}/${max}`,
  },
  preview: {
    label: "תצוגה מקדימה של הדף",
    open: "פתיחה בכתובת הדף",
    mobile: "נייד",
  },
  publishDialog: {
    title: "פרסום דף העסק",
    body: (url: string) => `הדף יעלה לכתובת ${url}. הפרסום חינם, ואפשר להוריד אותו בכל רגע.`,
    checks: ["פרטי העסק מופיעים בתחתית הדף", "דף מדיניות פרטיות לעסק נוצר אוטומטית", "פניות מהטופס נכנסות לתיבת הלידים"],
    missingTitle: "לפני הפרסום חסר:",
    missing: { slug: "כתובת תקינה לדף", h1: "כותרת ראשית", contact: "וואטסאפ או טלפון", legal: "השם הרשמי של העסק" },
    confirm: "פרסום הדף",
    cancel: "ביטול",
    toast: "הדף באוויר",
  },
  unpublishDialog: {
    title: "להוריד את הדף מהאוויר?",
    body: "הדף יפסיק להיות זמין בכתובת שלו. הפניות שכבר הגיעו נשארות בתיבת הלידים, ואפשר לפרסם שוב בכל רגע, בחינם.",
    confirm: "הסרה מהאוויר",
    cancel: "ביטול",
    toast: "הדף הוסר מהאוויר",
  },
  regenerateDialog: {
    title: "יצירה מחדש של הדף",
    body: "נכתוב מחדש את הכותרת, משפט הפתיחה והיתרונות לפי ערכת המותג והתחום. הטקסטים האלה יוחלפו, ושאר הפרטים נשארים.",
    cancel: "ביטול",
    toast: "יצרנו גרסה חדשה לטקסטים",
  },
  generating: ["קוראים את ערכת המותג ואת פרטי העסק", "כותבים כותרת ומשפט פתיחה", "בוחרים 3 יתרונות ושאלות נפוצות", "מסדרים שירותים, שעות וכתובת"],
  generatingLabel: "יוצרים את הדף…",
} as const;

export const LP_NEW = {
  title: "יוצרים את דף העסק",
  sub: "אנחנו כותבים את הדף מהפרטים שכבר יש לכם במערכת. אחר כך אתם עורכים כל מילה, בחינם.",
  sources: [
    { key: "brand", title: "ערכת המותג", body: "שם העסק, צבעים ולוגו" },
    { key: "niche", title: "התחום", body: "מסעדות ובתי קפה" },
    { key: "video", title: "הסרטון הכי טוב", body: "רילס \"פיתיון ושלט\"" },
    { key: "facts", title: "פרטי העסק", body: "כתובת, שעות, וואטסאפ וטלפון" },
  ],
  truthNote: "אנחנו לא ממציאים ביקורות, מחירים או מבצעים. מה שלא מופיע בפרטי העסק נשאר ריק.",
  limitTitle: "יש לכם כבר דף עסק",
  limitBody: (plan: string) => `ב${plan} יש מקום לדף עסק אחד, והוא כבר בשימוש. אפשר ליצור מחדש את הדף הקיים, או לשדרג לתוכנית עסק ולקבל 3 דפים.`,
  toExisting: "לדף הקיים",
} as const;

/** Public business page (`/b/[slug]`). */
export const LP_PUBLIC = {
  sampleRibbon: "דף לדוגמה · העסק בדף הזה בדיוני",
  sampleToast: "זה דף לדוגמה. בדף אמיתי הכפתור פותח שיחה עם העסק.",
  previewToast: "בתצוגה המקדימה הכפתורים והטופס לא שולחים כלום.",
  whatsapp: "וואטסאפ",
  whatsappLong: "שלחו וואטסאפ",
  call: "התקשרו",
  callLong: "חייגו אלינו",
  play: "הפעלת הסרטון",
  pause: "עצירת הסרטון",
  benefitsTitle: "למה אצלנו",
  servicesTitle: "מה אפשר לקבל",
  priceFrom: "החל מ-",
  hoursTitle: "שעות פתיחה",
  closed: "סגור",
  openNow: "פתוח עכשיו",
  closedNow: "סגור עכשיו",
  addressTitle: "איך מגיעים",
  waze: "ניווט בוויז",
  formTitle: "השאירו פרטים ונחזור אליכם",
  formSub: "הפרטים מגיעים ישירות לעסק.",
  form: {
    name: "שם מלא",
    phone: "טלפון",
    email: "מייל",
    message: "מה תרצו שנדע?",
    time: "מתי נוח שנחזור אליכם?",
    timeOptions: ["בבוקר", "בצהריים", "בערב", "לא משנה"],
    consent: "אפשר לחזור אליי בטלפון או בוואטסאפ לגבי הפנייה.",
    marketing: "מאשרים לקבל מהעסק עדכונים ומבצעים (לא חובה).",
    privacy: "מדיניות הפרטיות",
    errors: {
      name: "כתבו שם, כדי שנדע איך לפנות אליכם.",
      phone: "צריך מספר טלפון ישראלי, למשל 050-0000000.",
      email: "כתובת המייל לא נראית תקינה.",
      consent: "צריך לאשר שאפשר לחזור אליכם.",
    },
    sending: "שולחים…",
    successTitle: "תודה, קיבלנו!",
    successBody: "הפרטים הגיעו לעסק, ונחזור אליכם בהקדם.",
    successSample: "(בדף לדוגמה הפרטים לא נשלחים לשום מקום.)",
    again: "שליחת פנייה נוספת",
  },
  faqTitle: "שאלות נפוצות",
  footer: {
    privacy: "מדיניות פרטיות",
    controller: "הפרטים שנשלחים בדף מגיעים לעסק, והוא אחראי עליהם.",
    builtWith: `נבנה עם ${BRAND.nameHe}`,
  },
  stickyLabel: "יצירת קשר מהירה",
} as const;

/** Per-business privacy notice template (⚖️ [Counsel]) — marked "טיוטה" until counsel approves. */
export const LP_PRIVACY = {
  meta: (name: string) => ({ title: `מדיניות פרטיות · ${name}`, description: `איך העסק מטפל בפרטים שנשלחים בדף שלו.` }),
  draftBadge: "טיוטה",
  draftBanner: "⚖️ טיוטה לבדיקה משפטית. הנוסח עוד לא בתוקף ואינו ייעוץ משפטי.",
  h1: "מדיניות פרטיות",
  back: "חזרה לדף העסק",
  sections: (b: { name: string; legalName: string; idLabel: string; idNumber: string; address: string }) => [
    {
      title: "מי אחראי על המידע",
      body: `${b.legalName} (${b.idLabel} ${b.idNumber}), ${b.address}, אחראי על המידע שנשלח בדף הזה. ${BRAND.nameHe} מארחת את הדף ואת הטופס, ומטפלת במידע רק בשם העסק ולפי ההוראות שלו.`,
    },
    {
      title: "איזה מידע נאסף",
      body: "שם וטלפון, ולפי מה שתבחרו גם מייל, הודעה ושעה נוחה לחזרה. בנוסף נאסף מידע טכני בסיסי שנדרש כדי להפעיל את הדף ולמנוע הודעות זבל, כמו כתובת IP.",
    },
    {
      title: "למה הוא נאסף",
      body: "כדי שהעסק יחזור אליכם לגבי הפנייה. עדכונים ומבצעים נשלחים רק אם סימנתם שאתם מסכימים לכך, ואפשר לבטל בכל רגע.",
    },
    {
      title: "מי עוד רואה אותו",
      body: `רק העסק, ${BRAND.nameHe} שמפעילה את הפלטפורמה, וספקי האחסון שלה. המידע לא נמכר, ולא משמש לשיווק של ${BRAND.nameHe}.`,
    },
    {
      title: "איפה ולכמה זמן",
      body: "המידע נשמר בשרתים באיחוד האירופי, עד 24 חודשים מיום הפנייה, אלא אם העסק מוחק אותו לפני כן.",
    },
    {
      title: "הזכויות שלכם",
      body: "אפשר לבקש לעיין במידע, לתקן אותו או למחוק אותו. הבקשה נשלחת לעסק בטלפון או בוואטסאפ שמופיעים בדף, ואנחנו עוזרים לעסק לטפל בה.",
    },
  ],
  updated: "עדכון אחרון: טיוטה, עוד לא בתוקף",
} as const;
