/**
 * In-app copy for trends (`app.trends.*`) and the guided filming kit (`app.guided.*`), spec 07–08 §J.
 * Voice: Appendix E (plural address, verbs in copy, action nouns on buttons).
 */
import { withPrefix } from "@/lib/hebrew/text";
import type {
  AdSafety, BeatRole, Framing, GhostKind, HookCheckKey, MusicEnergy, OverlayKind, ProductionMode, TrendStage, VisualSource,
} from "@/lib/mock/trends-app";

export const TRENDS_META = {
  feed: { title: "טרנדים השבוע", description: "פורמטים ויראליים שמותאמים לתחום שלכם: בוחרים טרנד, ואנחנו מפיקים את הסרטון בעברית עם מוזיקה מורשית." },
  detail: (name: string) => ({ title: `${name} · טרנד`, description: `המתכון של הטרנד "${name}": למה זה עובד, הסצנות לפי הסדר, ואיך יוצרים אותו לעסק שלכם.` }),
  shoot: (name: string) => ({ title: `צילום מודרך · ${name}`, description: "שלושה שוטים עם הוראות בעברית, מסגרת עזר על המסך ועריכה אוטומטית." }),
} as const;

export const TRENDS_FEED = {
  eyebrow: "טרנדים",
  h1: "טרנדים השבוע",
  lead: "פורמטים שעובדים עכשיו ברילס, מותאמים לתחום שלכם. בוחרים טרנד, ואנחנו מפיקים את הסרטון בעברית, עם מוזיקה מקורית שמותרת לפרסום.",
  lastDrop: (when: string) => `עדכון אחרון: ${when}`,
  nicheLabel: "התחום שלכם",
  nicheSearch: "חיפוש תחום",
  nicheEmpty: "לא מצאנו תחום כזה. אפשר לנסות מילה אחרת.",
  nicheWorkspace: "התחום של העסק",
  filtersLabel: "סינון טרנדים",
  filters: { all: "הכול", ai: "צרו בקליק", guided: "צלמו בעצמכם", adSafe: "מתאים למודעה" },
  sections: {
    week: { title: "חם עכשיו", sub: "פורמטים חדשים שנכנסו לפיד, לפני שכולם עושים אותם." },
    fit: (niche: string) => ({ title: `קלאסיקות שעובדות ${withPrefix("ב", niche)}`, sub: "פורמטים שעובדים כבר שנים, ומתאימים לתחום שלכם." }),
    fitGeneric: { title: "קלאסיקות שעובדות תמיד", sub: "פורמטים שעובדים כבר שנים." },
    more: { title: "עוד תבניות", sub: "פחות מותאמות לתחום שלכם, אבל אפשר לנסות." },
  },
  empty: { title: "אין טרנדים בסינון הזה", body: "אפשר לנקות את הסינון או לבחור תחום אחר.", clear: "ניקוי הסינון" },
  scoreNote: "ציון הוק: הערכה לפי כללי הוקים — לא הבטחה לתוצאות.",
} as const;

export const TREND_CARD = {
  whyLabel: "למה זה עובד",
  fitLabel: "מתאים לעסק שלכם כי",
  aiCta: "צרו בקליק",
  guidedCta: "צלמו בעצמכם",
  details: "למתכון המלא",
  demoLabel: "דמו שלנו",
  durationLabel: (sec: number) => `${sec} שניות`,
  playLabel: (name: string) => `דמו של הטרנד ${name}`,
} as const;

export const TREND_BADGES = {
  stage: {
    new_this_week: "חדש השבוע",
    peak: "בשיא",
    classic: "קלאסיקה",
    ending_soon: "נגמר בקרוב",
  } satisfies Record<TrendStage, string>,
  endsIn: (days: number) => (days === 1 ? "עוד יום אחד" : `עוד ${days} ימים`),
  production: { ai: "AI מלא", guided: "צילום מודרך", hybrid: "AI או צילום" } satisfies Record<ProductionMode, string>,
  ad: {
    ad_safe: "מתאים למודעה",
    organic_only: "רק לפרסום רגיל",
    needs_consent: "מתאים למודעה",
    needs_ai_label: "מתאים למודעה",
  } satisfies Record<AdSafety, string>,
  adExtra: {
    needs_consent: "באישור המצולמים",
    needs_ai_label: "עם תווית AI",
  } as Partial<Record<AdSafety, string>>,
  adTooltip: {
    ad_safe: "אפשר להעלות את הסרטון כקמפיין בפייסבוק ובאינסטגרם.",
    organic_only: "מתאים לפוסט רגיל בלבד. מטא לא מאשרת מודעות שמחקות הודעות מערכת.",
    needs_consent: "אפשר לפרסם כמודעה אחרי שכל מי שמופיע בצילום הסכים.",
    needs_ai_label: "אפשר לפרסם כמודעה עם התווית \"צולם ב-AI\".",
  } satisfies Record<AdSafety, string>,
  score: "ציון הוק",
  scoreAria: (score: number) => `ציון הוק ${score} מתוך 100`,
} as const;

export const TREND_DETAIL = {
  breadcrumbRoot: "טרנדים",
  back: "לכל הטרנדים",
  codeLabel: (code: string) => `טרנד ${code}`,
  why: "למה זה עובד",
  fit: "מתאים לעסק שלכם כי",
  recipe: {
    title: "המתכון",
    sub: "הסצנות לפי הסדר. כל סצנה נוצרת בנפרד ומקבלת טקסט בעברית משלכם.",
    timelineLabel: "ציר הזמן של הטרנד",
    endCard: "כרטיס סיום",
    wholeVideo: "לאורך כל הסרטון",
    transition: "מעבר",
    seconds: "שנ׳",
    visualSource: "מקור התמונה",
    overlay: "שכבה על המסך",
    yourShot: "שוט שאתם מצלמים",
  },
  hooks: {
    title: "3 הוקים לבחירה",
    sub: "כל הוק פותח בתמונה אחרת. בקמפיין הם רצים כשלוש מודעות, ובפרסום רגיל אפשר לבדוק אותם אחד אחרי השני.",
    bait: "הפתיחה",
    line: "שורת ההוק",
  },
  niches: { title: "איך זה נראה בתחומים אחרים", sub: "דוגמאות לטקסט על המסך. הטקסט שלכם נכתב לפי העסק." },
  music: {
    title: "מוזיקה",
    protectedNote: "בטרנד המקורי יש שיר מוגן. אצלנו נוצרת מוזיקה מקורית שמותרת לפרסום.",
    licensedNote: "מוזיקה מקורית או מהספרייה המורשית, שמותרת לפרסום.",
    mood: "אווירה",
    bpm: "קצב",
    energy: "מבנה",
  },
  compliance: { title: "כללים ובטיחות", organicTitle: "רק לפרסום רגיל" },
  score: {
    title: "ציון הוק לדמו",
    caption: "הערכה לפי כללי הוקים — לא הבטחה לתוצאות.",
    passed: "עובר",
    failed: "אפשר לשפר",
    suggestionsTitle: "מה אפשר לשפר",
  },
  create: {
    title: "צרו את הטרנד לעסק שלי",
    sub: "פותחים פרויקט עם המתכון, ההוקים והמוזיקה. אתם מאשרים את הטקסטים לפני שמשהו נוצר.",
    modeLabel: "איך מפיקים",
    nicheLabel: "לאיזה תחום",
    hooksLabel: "3 גרסאות הוק נבחרות מראש",
    cta: "צרו את הטרנד לעסק שלי",
    shotListLink: "הצצה לרשימת הצילומים",
    costTitle: "עלות",
    costSameAsVideo: "כמו כל סרטון. העלות המדויקת מופיעה לפני היצירה.",
    costAutocut: "עריכה אוטומטית: קרדיט אחד לכל קליפ",
    organicNote: "את הסרטון הזה מפרסמים כרילס רגיל, לא כמודעה.",
  },
  modes: {
    ai: { title: "צרו בקליק", body: "ה-AI מפיק את כל הסצנות לפי המתכון. אתם רק מאשרים את הטקסטים.", unavailable: "את הטרנד הזה צריך לצלם, כי הוא בנוי על צילום אמיתי של העסק." },
    guided: { title: "צלמו בעצמכם", body: "רשימת צילומים של 3 שוטים בעברית, מסגרת עזר על המסך ועריכה אוטומטית.", unavailable: "את הטרנד הזה מפיקים ב-AI בלבד." },
  },
} as const;

export const BEAT_ROLE_LABEL: Record<BeatRole, string> = {
  bait: "פיתיון",
  cut: "חיתוך",
  payoff: "פאנץ׳",
  reveal: "חשיפה",
  cta: "הנעה לפעולה",
  label: "תווית",
};

export const VISUAL_SOURCE_LABEL: Record<VisualSource, string> = {
  ai_clip: "קליפ AI",
  ai_image_kenburns: "תמונה בתנועה",
  user_media: "הצילום שלכם",
  brand_card: "כרטיס מותג",
};

export const OVERLAY_LABEL: Record<OverlayKind, string> = {
  sign: "שלט בכתב יד",
  fake_ui: "התראה מזויפת",
  meme_caption: "כיתוב מם",
  bts_label: "תווית \"מאחורי הקלעים\"",
  split_reveal: "מסך מפוצל",
  comment_bubble: "כרטיס תגובה",
  rating: "חותמת ✗ / ✓",
  pov_label: "תווית POV",
  clock: "חותמת שעה",
  sticker: "מדבקה",
  price: "תג מחיר",
};

export const MUSIC_ENERGY_LABEL: Record<MusicEnergy, string> = {
  flat: "אחידה",
  build: "בונה מתח",
  drop: "עם דרופ",
  loop: "לופ",
};

export const HOOK_CHECK_LABEL: Record<HookCheckKey, { label: string; fix: string }> = {
  text_by_500ms: { label: "טקסט על המסך כבר בחצי השנייה הראשונה", fix: "להקדים את שורת ההוק לפריים הראשון." },
  motion_in_1s: { label: "תנועה או חיתוך בשנייה הראשונה", fix: "להוסיף תנועת מצלמה איטית או חיתוך בשנייה הראשונה." },
  hook_words: { label: "שורת ההוק עד 9 מילים", fix: "לקצר את שורת ההוק ל-9 מילים לכל היותר." },
  subject_scene1: { label: "פנים או מוצר כבר בסצנה הראשונה", fix: "להכניס את המוצר או את הפנים כבר לסצנה הראשונה." },
  known_hook_type: { label: "סוג הוק מוכר", fix: "לבחור הוק מהספרייה." },
  captions_on: { label: "כתוביות פעילות", fix: "להפעיל כתוביות לשורת ההוק, גם כשאין קריינות." },
  cta_present: { label: "יש הנעה לפעולה", fix: "להוסיף כרטיס סיום עם וואטסאפ." },
  duration_fits: { label: "האורך מתאים לרילס", fix: "לקצר ל-15 או ל-30 שניות." },
  safe_zones: { label: "הטקסט בתוך האזורים הבטוחים", fix: "להזיז את הטקסט פנימה, הרחק מהשוליים." },
};

export const GUIDED = {
  eyebrow: "צילום מודרך",
  back: "חזרה לטרנד",
  progress: (done: number, total: number) => `${done} מתוך ${total} שוטים`,
  forBusiness: (business: string) => `בשביל ${business}`,
  stepsLabel: "רשימת הצילומים",
  shot: (n: number) => `שוט ${n}`,
  framing: { wide: "רחב", medium: "בינוני", closeup: "קרוב", pov: "נקודת מבט" } satisfies Record<Framing, string>,
  ghost: {
    tripod_wide: "כל הצוות בתוך המסגרת",
    hands_table: "הידיים והשולחן בתוך המסגרת",
    face_center: "הפנים בתוך העיגול",
    product_center: "המוצר במרכז",
    cover_lens: "מכסים את כל העדשה",
  } satisfies Record<GhostKind, string>,
  length: (min: number, max: number) => `${min}–${max} שניות`,
  tipsTitle: "טיפים לשוט",
  peopleNote: "יש אנשים בשוט",
  states: { todo: "עוד לא צולם", recording: "מצלמים…", done: "צולם", uploaded: "הועלה" },
  camera: {
    label: "מצלמה עם מסגרת עזר",
    start: "צילום עכשיו",
    stop: "סיום",
    retake: "צילום מחדש",
    rec: "מקליטים",
    permissionNote: "בלחיצה על \"צילום עכשיו\" הדפדפן יבקש גישה למצלמה ולמיקרופון.",
    tooShort: (min: number) => `עוד קצת. השוט צריך לפחות ${min} שניות.`,
    take: (n: number) => `טייק ${n}`,
  },
  upload: {
    title: "או העלאת סרטון",
    drop: "גררו לכאן סרטון, או בחרו מהטלפון",
    choose: "בחירת סרטון",
    formats: "MP4, MOV או WebM",
    notVideo: "אפשר להעלות רק קובץ וידאו.",
    uploading: "מעלים…",
    done: "הועלה",
    replace: "החלפה",
  },
  firstTips: {
    title: "לפני שמתחילים",
    items: ["טלפון לאורך, כמו ברילס.", "האור מול הפנים, לא מאחור.", "ניגוב קטן לעדשה עושה הבדל גדול."],
    dismiss: "הבנתי",
  },
  next: "לשוט הבא",
  prev: "לשוט הקודם",
  consent: {
    label: "כל מי שמופיע בצילומים הסכים להופיע בסרטון ובפרסום שלו.",
    help: "נדרש לפני העריכה, כי יש אנשים בשוטים.",
  },
  autocut: {
    title: "עריכה אוטומטית",
    sub: "אנחנו בוחרים את הטייק הטוב, חותכים, מוסיפים כתוביות בעברית, מוזיקה מורשית וכרטיס סיום.",
    cta: "עריכה אוטומטית",
    cost: (clips: number) => (clips === 1 ? "קרדיט אחד" : `${clips} קרדיטים`),
    costNote: "קרדיט אחד לכל קליפ. הקריינות והרינדור מחושבים כמו בכל סרטון.",
    missing: (n: number) => (n === 1 ? "חסר עוד שוט אחד" : `חסרים עוד ${n} שוטים`),
    stages: [
      "ממירים את הקליפים לפורמט אחיד",
      "מתמללים את הדיבור",
      "בוחרים את הטייק הכי טוב ונקודות חיתוך",
      "מוסיפים תווית, כתוביות ומוזיקה",
    ],
    working: "עורכים…",
    done: "הסרטון מוכן לתצוגה מקדימה",
    doneSub: "אפשר לשנות טקסטים, הוק ומוזיקה לפני הרינדור הסופי.",
    warnings: ["בשוט הראשון הטלפון זז קצת, אז ייצבנו את התמונה.", "מתוך שני טייקים בשוט האחרון בחרנו את הקצר והחד."],
    continue: "המשך לתצוגה מקדימה",
    restart: "צילום מחדש",
    live: (stage: string) => `שלב העריכה: ${stage}`,
  },
  notFound: "לא מצאנו את הצילום הזה.",
} as const;
