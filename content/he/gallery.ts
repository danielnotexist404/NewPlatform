/**
 * /examples and /templates copy (Part 02 §6.1–§6.3, verbatim where it exists).
 * Labels for enums come from lib/labels.ts; structure/beat/style/mood labels from Part 02 §1.2.
 */
import { BRAND } from "@/lib/constants";
import type { BeatRole, CaptionPreset, MusicMood, Structure, VisualStyle } from "@/lib/mock/gallery";

export const EXAMPLES_PAGE = {
  meta: {
    title: "דוגמאות לסרטוני תדמית ורילס בעברית",
    description: `סרטוני תדמית ורילס שנוצרו ב${BRAND.nameHe} לנישות שונות, עם קריינות וכתוביות בעברית. צפו, סננו לפי נישה ופורמט, וצרו סרטון כזה לעסק שלכם.`,
  },
  breadcrumb: "דוגמאות",
  h1: `דוגמאות לסרטונים שנוצרו ב${BRAND.nameHe}`,
  intro: `כל סרטון כאן יצא מהמערכת עצמה: תסריט, ויז׳ואלים, קריינות וכתוביות בעברית, בלי עריכה ידנית אחרי. סננו לפי נישה, פורמט או סוג סרטון, ולחצו על "צרו סרטון כזה" כדי להתחיל מאותה נקודה.`,
  emptyTitle: "הדוגמאות האמיתיות הראשונות בדרך",
  emptyBody:
    "אנחנו מפרסמים כאן רק סרטונים שיצאו מהמערכת עצמה. בינתיים, אלה הדגמות (אנימטיק) שנבנו מתסריטים לדוגמה — כך נראה הסרטון לפני שנוצרים הוויז׳ואלים.",
  demoTag: "הדגמה (אנימטיק)",
  emptyCta: "צרו את הסרטון הראשון שלכם",
  filters: {
    label: "סינון דוגמאות",
    niche: "נישה",
    nicheAll: "כל הנישות",
    format: "פורמט",
    formatAll: "כל הפורמטים",
    type: "סוג סרטון",
    typeAll: "כל הסוגים",
    none: "אין עדיין דוגמה שמתאימה לסינון הזה.",
    clear: "ניקוי הסינון",
    results: (n: number) => (n === 1 ? "דוגמה אחת" : `${n} דוגמאות`),
  },
  formatLabels: { "9:16": "אנכי 9:16", "1:1": "ריבוע 1:1", "16:9": "רוחבי 16:9" } as const,
  dialog: {
    hookLabel: "ההוק בסרטון:",
    hookLink: "להוק בספרייה",
    cta: "צרו סרטון כזה",
    close: "סגירה",
    scenes: "הסצנות",
    playerNote: "סרטון ההדגמה עצמו יופיע כאן, עם כתוביות בעברית. בינתיים מוצגים הסצנות והטקסט שעל המסך.",
    formats: "פורמטים",
    open: (title: string) => `צפייה בסרטון: ${title}`,
  },
  moreTitle: "רוצים להתחיל ממבנה מוכן?",
  moreTemplates: "לכל התבניות",
  moreTrends: "לטרנדים",
};

export const TEMPLATES_PAGE = {
  meta: {
    title: "תבניות לסרטוני תדמית ורילס",
    description: "תבניות מוכנות לסרטון תדמית, רילס עם הוק, מבצע, השקה וגיוס עובדים. בוחרים תבנית, ממלאים פרטים, ומקבלים סרטון בעברית.",
  },
  breadcrumb: "תבניות",
  h1: "תבניות לסרטוני תדמית ורילס",
  intro: "כל תבנית היא מבנה שעובד: סדר הסצנות, האורך, הסגנון והמוזיקה. בוחרים תבנית, ממלאים את פרטי העסק, והתסריט נכתב בשבילכם — עם הוק שמתאים לנישה.",
  sampleTag: "דוגמה",
  filters: {
    label: "סינון תבניות",
    type: "סוג סרטון",
    niche: "נישה",
    nicheAll: "לכל הנישות",
    duration: "משך",
    format: "פורמט",
    all: "הכול",
    empty: "אין תבנית שמתאימה לסינון הזה. נסו משך או נישה אחרים, או התחילו מהוק.",
    clear: "ניקוי הסינון",
    results: (n: number) => (n === 1 ? "תבנית אחת" : `${n} תבניות`),
  },
  seconds: (n: number) => `${n} שנ׳`,
  fromCredits: (n: number) => (n === 1 ? "מקרדיט אחד" : n === 2 ? "משני קרדיטים" : `מ-${n} קרדיטים`),
  start: "התחילו מהתבנית",
  details: "פרטים",
  forAll: "לכל הנישות",
};

export const TEMPLATE_PAGE = {
  facts: {
    type: "סוג סרטון",
    duration: "משך",
    format: "פורמט",
    structure: "מבנה",
    style: "סגנון ויזואלי",
    captions: "סגנון כתוביות",
    music: "מוזיקה",
    visual: "ויז׳ואל",
  },
  durationValue: (n: number) => (n === 1 ? "שנייה אחת" : n === 2 ? "שתי שניות" : `${n} שניות`),
  structureTitle: "מבנה הסרטון",
  beatSeconds: (n: number) => `${n} שנ׳`,
  hooksTitle: "הוקים שמתאימים לתבנית",
  hooksLink: "לכל ההוקים מהסוג הזה",
  costTitle: "כמה זה עולה",
  costRow: (n: number) => (n === 1 ? "≈ קרדיט אחד" : n === 2 ? "≈ שני קרדיטים" : `≈ ${n} קרדיטים`),
  costNote: "כל פורמט נוסף מוסיף 2–3 קרדיטים. העלות המדויקת מוצגת לפני היצירה.",
  cta: "התחילו מהתבנית הזו",
  moreTitle: "תבניות נוספות",
  previewTag: "תצוגה לדוגמה",
  previewNote: "תצוגת התבנית בווידאו תופיע כאן. בינתיים: ההוק והמבנה.",
};

export const STRUCTURE_LABEL: Record<Structure, string> = {
  hpspc: "הוק, בעיה, פתרון, הוכחה, הנעה לפעולה",
  aida: "תשומת לב, עניין, רצון, פעולה",
  pas: "בעיה, החרפה, פתרון",
  bab: "לפני, אחרי והגשר ביניהם",
  result_first: "התוצאה קודם",
  brand_story: "סיפור המותג",
};

export const BEAT_ROLE_LABEL: Record<BeatRole, string> = {
  hook: "הוק",
  problem: "בעיה",
  agitate: "החרפה",
  solution: "פתרון",
  proof: "הוכחה",
  offer: "הצעה",
  cta: "הנעה לפעולה",
  brand: "מותג",
  story: "סיפור",
};

export const VISUAL_STYLE_LABEL: Record<VisualStyle, string> = {
  cinematic: "קולנועי",
  ugc: "צילום טלפון",
  day_in_business: "יום בעסק",
  before_after: "לפני ואחרי",
  product: "מוצר בפוקוס",
  text_motion: "טקסט בתנועה",
};

export const MUSIC_MOOD_LABEL: Record<MusicMood, string> = {
  energetic: "אנרגטי",
  warm: "חם",
  luxury: "יוקרתי",
  funny: "קליל ומצחיק",
  calm: "רגוע",
  inspiring: "מעורר השראה",
  urban: "אורבני",
};

export const CAPTION_PRESET_LABEL: Record<CaptionPreset, string> = {
  "bold-pop": "פופ",
  "clean-box": "קופסה נקייה",
  karaoke: "קריוקי",
  poster: "פוסטר",
  news: "חדשות",
  soft: "רך",
};
