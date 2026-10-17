/** Hebrew labels for enum values — the single source for marketing, app and admin (Part 02 §1.2). */
export const PLATFORM_LABEL = {
  reels: "רילס",
  tiktok: "טיקטוק",
  shorts: "יוטיוב שורטס",
  facebook: "פייסבוק",
  youtube: "יוטיוב",
  whatsapp: "סטטוס וואטסאפ",
  linkedin: "לינקדאין",
} as const;

export const PLATFORM_LABEL_L = {
  reels: "לרילס",
  tiktok: "לטיקטוק",
  shorts: "ליוטיוב שורטס",
  facebook: "לפייסבוק",
  youtube: "ליוטיוב",
  whatsapp: "לסטטוס בוואטסאפ",
  linkedin: "ללינקדאין",
} as const;

export const GOAL_LABEL = {
  awareness: "חשיפה",
  leads: "לידים",
  sales: "מכירות",
  trust: "אמון",
  engagement: "מעורבות",
} as const;

export const GENDER_LABEL = {
  neutral: "ניסוח ניטרלי",
  plural: "פנייה ברבים",
  female: "לשון נקבה",
  male: "לשון זכר",
} as const;

export const VIDEO_TYPE_LABEL = {
  brand_promo: "סרטון תדמית",
  reel_hook: "רילס עם הוק",
  offer: "מבצע או חג",
  testimonial: "המלצה",
  launch: "השקה",
  recruiting: "גיוס עובדים",
  explainer: "הסבר שירות",
} as const;

export const QUALITY_LABEL = { draft: "טיוטה", standard: "סטנדרט", premium: "פרימיום" } as const;
export const VISUAL_MIX_LABEL = { images: "תמונות בתנועה", smart: "משולב (מומלץ)", full: "וידאו מלא" } as const;
export const ASPECT_LABEL = {
  "9:16": "אנכי (רילס, טיקטוק, סטטוס)",
  "1:1": "ריבוע (פיד)",
  "16:9": "רוחבי (אתר, יוטיוב)",
} as const;

export const CAMPAIGN_GOAL_LABEL = {
  whatsapp: "הודעות בוואטסאפ",
  lead_form: "לידים בטופס",
  traffic: "כניסות לאתר",
  awareness: "חשיפה לאזור",
} as const;

export type Platform = keyof typeof PLATFORM_LABEL;
export type HookGoal = keyof typeof GOAL_LABEL;
export type HookGender = keyof typeof GENDER_LABEL;
