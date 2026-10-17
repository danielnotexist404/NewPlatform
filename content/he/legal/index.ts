import type { LegalDoc, LegalSlug } from "./types";
import { terms } from "./terms";
import { privacy } from "./privacy";
import { cookies } from "./cookies";
import { cancellation } from "./cancellation";
import { accessibility } from "./accessibility";
import { aiPolicy } from "./ai-policy";
import { likenessConsent } from "./likeness-consent";
import { dpa } from "./dpa";

export type { LegalDoc, LegalSlug } from "./types";

/** Order of the legal hub and the "more documents" list. */
export const LEGAL_DOCS: LegalDoc[] = [terms, privacy, cancellation, cookies, accessibility, aiPolicy, likenessConsent, dpa];

export const getLegalDoc = (slug: string): LegalDoc | undefined => LEGAL_DOCS.find((d) => d.slug === (slug as LegalSlug));

/** Frame copy of the legal pages (Part 02 §10.1). */
export const LEGAL_UI = {
  hub: {
    title: "מסמכים משפטיים",
    metaTitle: "מסמכים משפטיים",
    description: "תנאי השימוש, מדיניות הפרטיות, ביטול והחזרים, עוגיות, נגישות, שימוש הוגן ב-AI, הסכמה לשימוש בדמות ובקול והסכם עיבוד המידע.",
    eyebrow: "משפטי",
    lede: "כל המסמכים שמסדירים את השימוש בשירות, בעברית פשוטה ככל האפשר. בראש כל מסמך יש תקציר קצר, והנוסח המלא מחייב.",
    open: "לקריאה",
  },
  badge: "מסמך משפטי",
  effectivePrefix: "בתוקף מ-",
  versionPrefix: "גרסה",
  updatedPrefix: "עודכן לאחרונה:",
  draftTitle: "טיוטה לבדיקת עורך דין",
  draftBody: "טיוטה לבדיקת עורך דין. הנוסח טרם אושר סופית, ועשוי להשתנות לפני ההשקה.",
  pendingNote: "ערכים שמסומנים [יושלם לפני ההשקה] יושלמו לפני העלייה לאוויר.",
  summaryTitle: "בקצרה",
  summaryNote: "התקציר נועד לנוחותכם. הנוסח המחייב הוא הנוסח המלא שלמטה.",
  previousTitle: "גרסאות קודמות",
  previousNone: "זו הגרסה הראשונה של המסמך. כשתתפרסם גרסה חדשה, הגרסאות הקודמות יופיעו כאן.",
  contactTitle: "שאלות על המסמך?",
  contactBody: "כתבו לנו, ונחזור אליכם בימי עסקים.",
  contactForm: "לטופס יצירת הקשר",
  moreTitle: "מסמכים נוספים",
  cancel: {
    button: "ביטול מנוי",
    how: 'מבטלים מעמוד החיוב: לוחצים "ביטול מנוי" ומאשרים, בלי שיחת שימור.',
    orEmail: "או במייל:",
    orPhone: "בטלפון:",
  },
} as const;
