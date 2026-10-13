#!/usr/bin/env python3
"""Build and validate the hooks-library seed files.

Single source of truth for:
  seed/niche_categories.json, seed/niches.json, seed/hook_families.json,
  seed/hook_types.json, seed/seasons.json, seed/hooks.json
and for the AUTO regions of docs/03-hooks-library.md.

Run from anywhere:   python3 -I seed/scripts/build_seed.py
Validate only:       python3 -I seed/scripts/build_seed.py --check

Sources: docs/research/07-hooks.md (Part B) and docs/research/06-israel.md
(sec. 5 niches, sec. 5.3 calendar). Hebrew copy was proof-read and edited.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEED = ROOT / "seed"
DOC = ROOT / "docs" / "03-hooks-library.md"

# ---------------------------------------------------------------------------
# Enums (canonical)
# ---------------------------------------------------------------------------
PLATFORMS = ["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"]
PLATFORM_CODES = {"R": "reels", "T": "tiktok", "S": "shorts", "F": "facebook", "Y": "youtube", "W": "whatsapp"}
PLATFORM_HE = {"reels": "רילס", "tiktok": "טיקטוק", "shorts": "שורטס", "facebook": "פייסבוק",
               "youtube": "יוטיוב", "whatsapp": "וואטסאפ"}
GOALS = ["awareness", "leads", "sales", "trust", "engagement"]
GOAL_HE = {"awareness": "חשיפה", "leads": "לידים", "sales": "מכירות", "trust": "אמון", "engagement": "מעורבות"}
GENDERS = ["neutral", "plural", "male", "female"]
GENDER_CODES = {"n": "neutral", "p": "plural", "m": "male", "f": "female"}
GENDER_MARK = {"female": " (נ׳)", "male": " (ז׳)"}
COMPLIANCE_FLAGS = ["none", "medical", "legal", "financial", "real_estate", "alcohol", "political", "other"]
FLAG_HE = {"none": "אין", "medical": "רפואי", "legal": "משפטי", "financial": "פיננסי",
           "real_estate": "נדל״ן", "alcohol": "אלכוהול", "political": "פוליטי", "other": "אחר"}
PRIORITY_HE = {1: "1 – השקה", 2: "2 – הרחבה", 3: "3 – בהמשך"}

# lucide-react icon names used below; verified present in lucide-react@0.460.0 (2026-10-13).
LUCIDE_ICONS = {
    "House", "Building2", "Sparkles", "Brush", "Scissors", "UtensilsCrossed", "Dumbbell",
    "PersonStanding", "Hammer", "Smile", "Landmark", "PartyPopper", "ShoppingCart", "Car",
    "Wrench", "Scale", "Calculator", "Umbrella", "Sofa", "Camera", "Music", "BedDouble",
    "Compass", "GraduationCap", "HeartHandshake", "PawPrint", "TrafficCone", "ToyBrick",
    "PlugZap", "Truck", "Store", "ChefHat", "Rocket", "HandHeart", "Vote", "Activity",
}

# ---------------------------------------------------------------------------
# Niche categories
# ---------------------------------------------------------------------------
CATEGORIES = [
    ("real-estate-home", "נדל״ן ובית", "Real estate & home"),
    ("beauty-grooming", "יופי וטיפוח", "Beauty & grooming"),
    ("health-wellness", "בריאות, כושר וטיפול", "Health, fitness & care"),
    ("food-hospitality", "אוכל ומסעדנות", "Food & dining"),
    ("events", "אירועים ושמחות", "Events & celebrations"),
    ("tourism-leisure", "תיירות ופנאי", "Tourism & leisure"),
    ("professional-finance", "שירותים מקצועיים ופיננסים", "Professional & financial services"),
    ("commerce", "מסחר וקמעונאות", "Commerce & retail"),
    ("automotive", "רכב ותחבורה", "Automotive"),
    ("education-kids", "חינוך, הדרכה וילדים", "Education & kids"),
    ("pets", "חיות מחמד", "Pets"),
    ("tech-b2b", "הייטק ו-B2B", "Tech & B2B"),
    ("community-public", "קהילה וציבור", "Community & public"),
]

# ---------------------------------------------------------------------------
# Niches: all 35 rows of 06 sec. 5.1, with row 7 split into fitness-trainers and
# yoga-pilates as in 07 (36 niches). Order follows 06; priority = tier A/B/C.
# ---------------------------------------------------------------------------
NICHES = [
    dict(slug="real-estate", name_he="נדל״ן: מתווכים ומשרדי תיווך", name_en="Real estate agents & brokerages",
         category_slug="real-estate-home", icon="House", priority=1,
         description_he="כל נכס צריך סרטון, ומתווך עם מותג אישי חזק זוכה ביותר בלעדיות. סרטונים קצרים מביאים פניות גם מקונים וגם ממוכרים.",
         video_types_he=["סיור בנכס", "מדריך שכונה", "מיתוג אישי למתווך", "\"נמכר!\"", "טיפים לקונים ולמוכרים"],
         seasonal_angles_he=["קיץ: עונת המעברים", "לפני ה-1 בספטמבר: מעבר דירה לפני שנת הלימודים", "פסח: מתחילים בבית חדש", "החלטות הריבית של בנק ישראל"],
         compliance_flag="real_estate",
         compliance_note_he="חוק המתווכים במקרקעין: לבדוק חובת שם ומספר רישיון בפרסום. מחירים בהוקים הם להמחשה, ואין להציג \"מחיר מבוקש\" כאילו הוא \"מחיר עסקה\"."),
    dict(slug="real-estate-developers", name_he="נדל״ן: יזמים ופרויקטים חדשים", name_en="Real estate developers & new projects",
         category_slug="real-estate-home", icon="Building2", priority=1,
         description_he="השקות של פרויקטים בשווי גבוה, והדמיות שמתאימות מאוד ל-AI. הסרטון מוכר את החלום עוד לפני שהבניין קיים.",
         video_types_he=["טיזר לפרויקט", "טיסת הדמיה", "סרטון לייפסטייל", "עדכון התקדמות בנייה", "סיור בדירה לדוגמה"],
         seasonal_angles_he=["תערוכות נדל״ן", "תוכניות דיור ממשלתיות", "פתיחת שלב מכירות חדש"],
         compliance_flag="real_estate",
         compliance_note_he="טענות מדויקות בלבד, ועל כל הדמיה כיתוב \"הדמיה בלבד\". תנאי תשלום, מועדי מסירה ומבצעים רק כפי שהם מופיעים בחוזה."),
    dict(slug="aesthetic-clinics", name_he="קליניקות אסתטיקה וקוסמטיקה רפואית", name_en="Aesthetic & cosmetic clinics",
         category_slug="beauty-grooming", icon="Sparkles", priority=1,
         description_he="תחום ויזואלי שנשען על אמון, עם מבצעים תכופים. סרטון טוב מסביר טיפול, מפרק פחדים ומציג את הצוות.",
         video_types_he=["הסבר טיפול", "ניפוץ מיתוסים", "היכרות עם הצוות הרפואי", "שאלות ותשובות", "לפני ואחרי (בכפוף לכללים)"],
         seasonal_angles_he=["לפני הקיץ: הסרת שיער", "ראש השנה ועונת החתונות", "בלאק פריידיי"],
         compliance_flag="medical",
         compliance_note_he="כללי הפרסום של משרד הבריאות: הגבלות על המלצות, על הבטחת תוצאות ועל תמונות לפני ואחרי, ומספר רישיון בפרסום. אין להבטיח תוצאה או טיפול \"בלי כאב\"."),
    dict(slug="beauty-nails", name_he="ציפורניים, גבות, ריסים ואיפור", name_en="Nails, brows, lashes & makeup",
         category_slug="beauty-grooming", icon="Brush", priority=1,
         description_he="המון עסקים קטנים, ולקוחות שחיים באינסטגרם. תקריבים, מהפכים וטרנדים עונתיים ממלאים את היומן.",
         video_types_he=["מהפך בתקריב", "טרנדים וצבעי העונה", "מחירון", "\"מקום פנוי השבוע\"", "ASMR של עבודה"],
         seasonal_angles_he=["לפני החגים", "עונת הכלות", "ולנטיינז וט״ו באב", "בלאק פריידיי"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="barbers-salons", name_he="מספרות וברברשופ", name_en="Barbershops & hair salons",
         category_slug="beauty-grooming", icon="Scissors", priority=1,
         description_he="מהפכים, טיים-לאפס והאישיות של הספר או הספרית. תוכן שבועי קבוע ממלא את היומן.",
         video_types_he=["לפני ואחרי", "טיים-לאפס של תספורת", "\"הקאט של השבוע\"", "טיפים לטיפוח", "מאחורי הקלעים במספרה"],
         seasonal_angles_he=["חזרה ללימודים", "לפני החגים", "עונת החתונות"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="restaurants", name_he="מסעדות, בתי קפה ומאפיות", name_en="Restaurants, cafés & bakeries",
         category_slug="food-hospitality", icon="UtensilsCrossed", priority=1,
         description_he="אוכל הוא התוכן הוויזואלי ביותר ברשת. סרטונים קצרים ממלאים שולחנות, משיקים מנות ומקדמים אירועים.",
         video_types_he=["תקריבי מנות", "הסיפור של השף", "קידום תפריט", "מאחורי הקלעים במטבח", "אירועים וערבי נושא"],
         seasonal_angles_he=["חגי תשרי", "תפריט לפסח", "שבועות: מאכלי חלב", "קיץ", "ולנטיינז"],
         compliance_flag="other",
         compliance_note_he="הצהרת כשרות רק עם תעודה בתוקף (חוק איסור הונאה בכשרות). דירוגים, מספר ביקורות ונתונים כמו \"400 מנות בשבוע\" רק אם הם אמיתיים."),
    dict(slug="fitness-trainers", name_he="מאמני כושר וסטודיו לאימון", name_en="Fitness trainers & gyms",
         category_slug="health-wellness", icon="Dumbbell", priority=1,
         description_he="תוצאות, קהילה ושיעורים קבועים. סרטון קצר מוכיח מקצועיות ומביא מתאמנים חדשים לאימון ניסיון.",
         video_types_he=["קטעי אימון", "טיפים לתרגילים", "היכרות עם המאמן או המאמנת", "סיפורי מתאמנים", "מערכת שיעורים"],
         seasonal_angles_he=["ינואר: החלטות לשנה החדשה", "לפני הקיץ", "\"אחרי החגים מתחילים\""],
         compliance_flag="other",
         compliance_note_he="תמונות לפני ואחרי של ירידה במשקל מוגבלות בפרסום ממומן במטא ובטיקטוק. בטענות על תוצאות מוסיפים \"התוצאות משתנות מאדם לאדם\", ולא פונים לצופה בהנחה על מצבו הגופני."),
    dict(slug="yoga-pilates", name_he="יוגה ופילאטיס", name_en="Yoga & Pilates studios",
         category_slug="health-wellness", icon="PersonStanding", priority=1,
         description_he="סטודיו שמוכר שקט, יציבה וקהילה. סרטונים רגועים ומדויקים ממלאים שיעורי ניסיון.",
         video_types_he=["תרגול קצר", "הסבר על השיטה", "האווירה בסטודיו", "השיעור הראשון", "מערכת שיעורים ושיעור ניסיון"],
         seasonal_angles_he=["ינואר", "לפני הקיץ", "אחרי החגים"],
         compliance_flag="other",
         compliance_note_he="זהירות בטענות בריאות (כאבי גב, יציבה): מנסחים כחוויה ולא כהבטחה, ובפרסום ממומן לא פונים לצופה בהנחה על מצבו הבריאותי."),
    dict(slug="renovation-contractors", name_he="קבלני שיפוצים, מטבחים ונגרות", name_en="Renovation contractors, kitchens & carpentry",
         category_slug="real-estate-home", icon="Hammer", priority=1,
         description_he="פרויקטים ויזואליים ולידים בשווי גבוה. מהפך של חדר רחצה או של מטבח הוא אחד הסרטונים החזקים ברשת.",
         video_types_he=["לפני ואחרי", "סיור בפרויקט", "תהליך העבודה", "המלצות לקוחות", "הצעת מחיר בוואטסאפ"],
         seasonal_angles_he=["לפני פסח: עומס השיפוצים", "אחרי הקיץ", "\"אחרי החגים\""],
         compliance_flag="other",
         compliance_note_he="רישום ברשם הקבלנים כשהעבודה מחייבת זאת. מחירים בהוקים הם להמחשה, והמלצות לקוחות רק בהסכמה בכתב."),
    dict(slug="dentists", name_he="רופאי שיניים ומרפאות שיניים", name_en="Dentists & dental clinics",
         category_slug="health-wellness", icon="Smile", priority=1,
         description_he="הסברים שמורידים פחד ומביאים פניות לטיפולים יקרים כמו שתלים ויישור שקוף.",
         video_types_he=["הסבר טיפול", "סיור במרפאה", "היכרות עם הצוות", "שאלות נפוצות", "טיפים להיגיינת הפה"],
         seasonal_angles_he=["חזרה ללימודים: בדיקות לילדים", "סוף השנה: ניצול הטבות של קופת החולים"],
         compliance_flag="medical",
         compliance_note_he="כללי הפרסום לרופאי שיניים דומים לכללים לרופאים: בלי הבטחת תוצאה ובלי \"ללא כאב\", ולפני ואחרי רק בכפוף לכללים. מחירים רק לפי המחירון האמיתי."),
    dict(slug="mortgage-advisors", name_he="יועצי משכנתאות", name_en="Mortgage advisors",
         category_slug="professional-finance", icon="Landmark", priority=1,
         description_he="תחום חינוכי עם ערך לקוח גבוה. סרטונים שמסבירים ריבית, מסלולים ותמהיל בונים אמון ומביאים פגישות.",
         video_types_he=["הסברים", "עדכוני ריבית", "ניפוץ מיתוסים", "סיפורי לקוחות", "סימולציות"],
         seasonal_angles_he=["החלטות הריבית של בנק ישראל", "תכנון לשנה החדשה", "עונת המעברים בקיץ"],
         compliance_flag="financial",
         compliance_note_he="בלי הבטחות לחיסכון או לריבית. דיסקליימר חובה: \"אין באמור ייעוץ פיננסי. סימולציה להמחשה בלבד\". סכומי חיסכון רק ממקרים אמיתיים ומתועדים."),
    dict(slug="event-venues", name_he="אולמות וגני אירועים", name_en="Event halls & venues",
         category_slug="events", icon="PartyPopper", priority=1,
         description_he="סיורים באולם ורגעים אמיתיים מחתונות מוכרים תאריכים בעונת השמחות.",
         video_types_he=["סיור באולם", "רגעים מחתונה אמיתית", "הצגת התפריט", "מאחורי הקלעים בהקמה", "תאריכים פנויים"],
         seasonal_angles_he=["עונת החתונות (אביב עד סתיו)", "אירוסים אחרי החגים", "ל״ג בעומר: חזרת החתונות לזוגות דתיים"],
         compliance_flag="other",
         compliance_note_he="צילום מאירועים אמיתיים רק בהסכמת הזוג והאורחים המזוהים. תאריכים פנויים ומחירים רק אם הם אמיתיים."),
    dict(slug="ecommerce", name_he="חנויות אונליין ואיקומרס", name_en="Online stores & e-commerce",
         category_slug="commerce", icon="ShoppingCart", priority=1,
         description_he="מודעות מוצר, תוכן גולשים ונפח גבוה של סרטונים. לכל מוצר כדאי כמה הוקים שונים לבדיקה.",
         video_types_he=["הדגמת מוצר", "סרטון UGC", "אנבוקסינג", "מבצע", "ביקורות לקוחות"],
         seasonal_angles_he=["בלאק פריידיי וסייבר מאנדיי", "11.11", "מתנות לחגים", "חזרה ללימודים"],
         compliance_flag="other",
         compliance_note_he="הצגת מחיר והנחה לפי חוק הגנת הצרכן: מחיר כולל מע״מ, ו\"מחיר קודם\" רק אם הוא אמיתי. זמני משלוח, מלאי וביקורות רק אם הם אמיתיים."),
    dict(slug="car-dealers", name_he="סוחרי רכב, מגרשים וליסינג", name_en="Car dealers & leasing",
         category_slug="automotive", icon="Car", priority=1,
         description_he="כל רכב צריך סרטון, ויש הרבה רכבים. סיורים קצרים והצעות מימון מביאים נסיעות מבחן.",
         video_types_he=["סיור ברכב", "הצעת מימון", "\"הרכב של השבוע\"", "השוואות", "טיפים לקונים"],
         seasonal_angles_he=["דגמי סוף שנה", "ינואר: רכב חדש", "קיץ: חופשה משפחתית"],
         compliance_flag="other",
         compliance_note_he="פרטי מחיר ומימון לפי כללי הגילוי (ריבית, מקדמה, תשלום אחרון). קילומטראז׳, יד ומקור הרכב רק כפי שהם באמת."),
    dict(slug="auto-services", name_he="מוסכים, מכוני רכב ודיטיילינג", name_en="Garages, car care & detailing",
         category_slug="automotive", icon="Wrench", priority=2,
         description_he="מהפכי ניקוי ודיטיילינג הם תוכן ממכר, וטיפים לנהגים בונים אמון במוסך.",
         video_types_he=["מהפך ניקוי", "טיפים לתחזוקה", "מאחורי הקלעים במוסך", "הסבר על תקלה", "מחירון שירותים"],
         seasonal_angles_he=["לפני הנסיעות של החגים", "הכנה לחורף", "אחרי החופש הגדול"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="lawyers", name_he="עורכי דין ומשרדי עורכי דין", name_en="Lawyers & law firms",
         category_slug="professional-finance", icon="Scale", priority=2,
         description_he="סמכות מקצועית והסברים פשוטים לשאלות מסובכות. סרטון קצר הופך עורך דין למומחה שסומכים עליו. מתאים גם ללינקדאין.",
         video_types_he=["הסבר של מומחה", "שאלות נפוצות", "\"זכויות שלא ידעתם\"", "סיפור מקרה בשינוי פרטים", "סרטון ללינקדאין"],
         seasonal_angles_he=["סוף שנת המס", "שינויי חקיקה ופסיקה חדשה"],
         compliance_flag="legal",
         compliance_note_he="כללי לשכת עורכי הדין (פרסומת), התשס״א-2000: פרסום מכובד, בלי הבטחת תוצאות, בלי \"הכי טוב\" ובלי השוואות. מוסיפים \"המידע כללי ואינו מהווה ייעוץ משפטי\"."),
    dict(slug="accountants", name_he="רואי חשבון ויועצי מס", name_en="Accountants & tax advisors",
         category_slug="professional-finance", icon="Calculator", priority=2,
         description_he="הסברים עונתיים על מס, דוחות ומועדים. עצמאים ושכירים מחפשים תשובות פשוטות, ומי שמסביר טוב מקבל את הפנייה.",
         video_types_he=["טיפים למס", "תזכורות למועדים", "הסבר על שינויי חקיקה", "שאלות נפוצות", "מאחורי הקלעים במשרד"],
         seasonal_angles_he=["עונת הדוחות השנתיים", "שינויים במע״מ ובחשבוניות ישראל", "סוף שנת המס", "ינואר"],
         compliance_flag="financial",
         compliance_note_he="מידע כללי בלבד, וכללי המס משתנים: לא מצטטים תקרות, שיעורים או מועדים בלי לוודא שהם עדכניים לשנה הנוכחית."),
    dict(slug="insurance-agents", name_he="סוכני ביטוח, פנסיה ופיננסים", name_en="Insurance & pension agents",
         category_slug="professional-finance", icon="Umbrella", priority=2,
         description_he="תחום של הסברה ואמון. סרטונים קצרים והצעה ל\"בדיקת תיק\" מביאים פגישות.",
         video_types_he=["הסברים", "הצעה לבדיקת תיק", "סיפורי מקרה", "השוואות", "שאלות נפוצות"],
         seasonal_angles_he=["הפקדות לפנסיה בסוף השנה", "ינואר", "חידוש ביטוח הרכב"],
         compliance_flag="financial",
         compliance_note_he="פיקוח של רשות שוק ההון: דיסקליימר חובה ובלי הבטחת תשואה. בפרסום ממומן לא פונים לצופה בהנחה על מצבו הכלכלי או הבריאותי (מדיניות personal attributes של מטא)."),
    dict(slug="interior-design", name_he="אדריכלות ועיצוב פנים", name_en="Architects & interior designers",
         category_slug="real-estate-home", icon="Sofa", priority=2,
         description_he="תיק עבודות והדמיות שמתאימים מאוד ל-AI. מהפך של חדר בסרטון קצר מוכר את הסגנון.",
         video_types_he=["חשיפת פרויקט", "טיפים לעיצוב", "הדמיה מול מציאות", "השראה ואווירה", "לפני ואחרי"],
         seasonal_angles_he=["לפני פסח", "עונת המסירות של דירות חדשות"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="event-photographers", name_he="צלמי אירועים, משפחה ותדמית", name_en="Event & family photographers",
         category_slug="events", icon="Camera", priority=2,
         description_he="תיק עבודות חי. רגעים אמיתיים ומאחורי הקלעים מוכרים צלם יותר מכל מחירון.",
         video_types_he=["רגעים נבחרים מאירוע", "מאחורי הקלעים", "השוואות", "טיפים לזוגות", "הצעה עונתית"],
         seasonal_angles_he=["עונת החתונות", "בר ובת מצווה", "צילומי משפחה לפני החגים"],
         compliance_flag="other",
         compliance_note_he="תמונות וסרטונים של לקוחות רק בהסכמת המצולמים, ובקטינים (בר ובת מצווה) בהסכמת ההורים."),
    dict(slug="djs-musicians", name_he="DJ, להקות ומוזיקאים לאירועים", name_en="DJs, bands & event musicians",
         category_slug="events", icon="Music", priority=2,
         description_he="אנרגיה והוכחה מהשטח. רחבה מלאה בעשר שניות שווה יותר מכל הבטחה.",
         video_types_he=["רגעי שיא מאירוע", "טיזר לסט", "מאחורי העמדה", "שירים מבוקשים", "המלצות זוגות"],
         seasonal_angles_he=["עונת החתונות", "פורים", "סילבסטר"],
         compliance_flag="other",
         compliance_note_he="שימוש בשירים מוקלטים בסרטון מחייב רישיון, או מוזיקה מורשית מספריית הפלטפורמה. צילום אורחים מזוהים רק בהסכמתם."),
    dict(slug="zimmers-boutique-hotels", name_he="צימרים, מלונות בוטיק ווילות", name_en="Zimmers, boutique hotels & villas",
         category_slug="tourism-leisure", icon="BedDouble", priority=2,
         description_he="בריחה ויזואלית מהשגרה. נוף, ג׳קוזי ושקט ממלאים סופי שבוע.",
         video_types_he=["סיור במתחם", "חופשה זוגית", "דיל לסוף שבוע", "מאחורי הקלעים", "המלצות אורחים"],
         seasonal_angles_he=["קיץ", "חגים וחול המועד", "ט״ו באב", "חורף: ג׳קוזי ואח"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="tourism-attractions", name_he="תיירות, אטרקציות וסיורים", name_en="Tourism, attractions & tours",
         category_slug="tourism-leisure", icon="Compass", priority=2,
         description_he="חוויות שמוכרות את עצמן בווידאו. טיזר קצר הופך את השאלה \"מה עושים היום?\" להזמנה.",
         video_types_he=["טיזר לחוויה", "יום כיף למשפחה", "המסלול בדקה", "המלצות מבקרים", "מבצע לחגים"],
         seasonal_angles_he=["החופש הגדול", "חול המועד סוכות ופסח", "חנוכה"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="courses-educators", name_he="מורים פרטיים, קורסים ומאמנים עסקיים", name_en="Tutors, courses & business coaches",
         category_slug="education-kids", icon="GraduationCap", priority=2,
         description_he="מותג אישי וידע שאפשר לטעום ממנו. שיעור של 60 שניות הוא הפרסומת הטובה ביותר לקורס.",
         video_types_he=["טיפ מקצועי", "פרומו לקורס", "שיעור קצר", "סיפורי בוגרים", "הזמנה לוובינר"],
         seasonal_angles_he=["חזרה ללימודים", "תקופת הבגרויות והפסיכומטרי", "ינואר"],
         compliance_flag="other",
         compliance_note_he="טענות על תוצאות, עבודה או הכנסה רק אם הן אמיתיות, ועם \"התוצאות אישיות\". \"נשארו X מקומות\" רק אם זה נכון. גיל הוא מאפיין אישי, ולכן לא פונים לפיו בפרסום ממומן."),
    dict(slug="therapists", name_he="מטפלים, פסיכולוגים וקואצ׳רים", name_en="Therapists, psychologists & coaches",
         category_slug="health-wellness", icon="HeartHandshake", priority=2,
         description_he="אמון והפחתת סטיגמה. הסברים רכים עוזרים לאנשים להבין מתי ואיך פונים לטיפול.",
         video_types_he=["הסברים רכים", "\"מתי לפנות לטיפול\"", "מה קורה בפגישה הראשונה", "תרגילי נשימה והרגעה", "היכרות עם המטפל או המטפלת"],
         seasonal_angles_he=["הלחץ שאחרי החגים", "חזרה ללימודים"],
         compliance_flag="medical",
         compliance_note_he="חוק הפסיכולוגים וכללי האתיקה: בלי המלצות של מטופלים ובלי הבטחת תוצאות. בפרסום ממומן מנסחים בגוף שלישי, בלי להניח את מצבו הנפשי של הצופה. אפשר להוסיף שורת סיום: \"במצב מצוקה: ער״ן 1201\"."),
    dict(slug="vets-dog-grooming", name_he="וטרינרים, מספרות כלבים ופנסיונים", name_en="Vets, dog grooming & boarding",
         category_slug="pets", icon="PawPrint", priority=2,
         description_he="חיות מחמד הן תוכן ויראלי. מהפכי טיפוח וטיפים לבעלים מביאים לקוחות קבועים.",
         video_types_he=["לפני ואחרי טיפוח", "טיפים לבעלי כלבים", "מאחורי הקלעים בקליניקה", "שאלות נפוצות", "פנסיון לחופשות"],
         seasonal_angles_he=["קיץ: חום ושרב", "זיקוקים ורעש בחגים", "חופשות: פנסיון לכלבים"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="driving-schools", name_he="בתי ספר לנהיגה ומורי נהיגה", name_en="Driving schools & instructors",
         category_slug="automotive", icon="TrafficCone", priority=2,
         description_he="קהל צעיר שחי בטיקטוק. טיפים, הומור של יום הטסט ואחוזי הצלחה מביאים תלמידים.",
         video_types_he=["טיפים לטסט", "הומור מהשיעורים", "\"עבר טסט!\"", "הסבר על תמרונים", "שאלות נפוצות"],
         seasonal_angles_he=["קיץ: בני 17 מתחילים ללמוד", "חזרה ללימודים"],
         compliance_flag="other",
         compliance_note_he="רוב התלמידים קטינים: מצלמים רק בהסכמת הורים. אחוזי הצלחה בטסט רק לפי נתונים אמיתיים."),
    dict(slug="kids-activities", name_he="גנים, צהרונים, חוגים וקייטנות", name_en="Kindergartens, after-school & camps",
         category_slug="education-kids", icon="ToyBrick", priority=2,
         description_he="עונות הרשמה ברורות, והורים שרוצים לראות איך נראה יום אצלכם. סיור ויזואלי חוסך עשר שיחות טלפון.",
         video_types_he=["סיור במקום", "רגעים מהפעילויות", "יום בגן או בקייטנה", "היכרות עם הצוות", "פתיחת ההרשמה"],
         seasonal_angles_he=["הרשמה לגנים ולקייטנות (ינואר עד מרץ)", "קייטנות הקיץ", "חזרה ללימודים"],
         compliance_flag="other",
         compliance_note_he="צילום קטינים רק בהסכמת הורים בכתב. מומלץ לצלם ידיים, גב ופעילות, בלי פנים מזוהות."),
    dict(slug="home-services", name_he="בעלי מקצוע: חשמל, אינסטלציה ומיזוג", name_en="Home services: electricians, plumbers & A/C",
         category_slug="real-estate-home", icon="PlugZap", priority=2,
         description_he="אמון ומהירות. טיפים קצרים ו\"עבודה של היום\" הופכים בעל מקצוע לאיש המקצוע של השכונה.",
         video_types_he=["טיפים לבית", "\"עבודה של היום\"", "שירות חירום", "מחירון שקוף", "לפני ואחרי"],
         seasonal_angles_he=["קיץ: עומס במזגנים", "חורף: דודים ונזילות", "לפני פסח: תיקונים בבית"],
         compliance_flag="other",
         compliance_note_he="חשמלאים וטכנאי גז: מציינים רישיון כנדרש. טיפים של \"עשו זאת בעצמכם\" רק בפעולות בטוחות, בלי עבודות חשמל או גז."),
    dict(slug="movers-storage", name_he="הובלות ואחסון", name_en="Movers & storage",
         category_slug="real-estate-home", icon="Truck", priority=3,
         description_he="עונות מעברים צפויות ופחד גדול מנזק. סרטון שמראה סדר ומקצועיות מוכר הובלה.",
         video_types_he=["תהליך ההובלה", "טיפים לאריזה", "הצעת מחיר", "טיים-לאפס של יום הובלה", "מחסני אחסון"],
         seasonal_angles_he=["קיץ: שיא המעברים", "לפני החגים"],
         compliance_flag="none", compliance_note_he=None),
    dict(slug="retail-stores", name_he="חנויות פיזיות: אופנה, אופטיקה, פרחים ויודאיקה", name_en="Physical stores: fashion, optics, flowers & Judaica",
         category_slug="commerce", icon="Store", priority=3,
         description_he="קולקציות, מבצעים ומדריכי מתנות. סרטון קצר מביא אנשים מהפיד אל הדלת.",
         video_types_he=["השקת קולקציה", "מבצע", "מדריך מתנות", "חדש על המדף", "מאחורי הקלעים בחנות"],
         seasonal_angles_he=["מתנות לחגים", "בלאק פריידיי", "יום המשפחה", "ולנטיינז"],
         compliance_flag="other",
         compliance_note_he="הצגת מחירים לפי חוק הגנת הצרכן: מחיר כולל מע״מ, ו\"מחיר קודם\" או אחוז הנחה רק אם הם אמיתיים."),
    dict(slug="catering-chefs", name_he="קייטרינג ושפים פרטיים", name_en="Catering & private chefs",
         category_slug="food-hospitality", icon="ChefHat", priority=3,
         description_he="אוכל ואירועים בסרטון אחד. מנות בתקריב והקמה של אירוע בטיים-לאפס מוכרות את החוויה.",
         video_types_he=["רילס של מנות", "הקמת אירוע", "ארוחת חג", "היכרות עם השף", "תפריטים"],
         seasonal_angles_he=["ארוחות חג", "בר ובת מצווה", "שבועות"],
         compliance_flag="other",
         compliance_note_he="הצהרת כשרות רק עם תעודה בתוקף. צילום אורחים מזוהים רק בהסכמתם."),
    dict(slug="b2b-startups", name_he="הייטק וסטארטאפים (B2B)", name_en="Tech startups & B2B",
         category_slug="tech-b2b", icon="Rocket", priority=3,
         description_he="סרטוני הסבר, השקות וגיוס עובדים. סרטון קצר וחד מסביר מוצר מורכב טוב יותר ממצגת, ומתאים במיוחד ללינקדאין.",
         video_types_he=["סרטון הסבר", "סרטון השקה", "דמו של המוצר", "סיפור לקוח", "גיוס עובדים"],
         seasonal_angles_he=["הודעות על גיוס הון", "כנסים ותערוכות", "גיוס עובדים"],
         compliance_flag="other",
         compliance_note_he="טענות מספריות (\"6 שעות\", \"מ-14 ימים ל-2\") צריכות מקור או סיפור לקוח מתועד. לוגואים של לקוחות רק באישור. לרוב צריך גם גרסה באנגלית."),
    dict(slug="nonprofits", name_he="עמותות וארגונים חברתיים", name_en="Nonprofits & NGOs",
         category_slug="community-public", icon="HandHeart", priority=3,
         description_he="סיפורי השפעה רגשיים ומדויקים מגייסים תרומות ומתנדבים.",
         video_types_he=["סיפור השפעה", "קמפיין תרומות", "יום עם המתנדבים", "שקיפות: לאן הולך הכסף", "קריאה להתנדבות"],
         seasonal_angles_he=["לפני ראש השנה ויום כיפור: עונת התרומות", "חנוכה", "סוף שנת המס"],
         compliance_flag="other",
         compliance_note_he="ניסוח מדויק של הזיכוי ממס (סעיף 46), רק לעמותה עם אישור בתוקף. סיפורי מוטבים רק בהסכמתם ובשמירה על כבודם, ובקטינים בהסכמת הורים או אפוטרופוס."),
    dict(slug="local-politics", name_he="פוליטיקה ומועמדים", name_en="Politics & candidates",
         category_slug="community-public", icon="Vote", priority=3,
         description_he="נפח גבוה בתקופות בחירות, אבל גם סיכון משפטי ותדמיתי גבוה. מומלץ להחריג את הנישה בהשקה.",
         video_types_he=["היכרות עם המועמד או המועמדת", "עמדות בנושאים", "קטעים מכנסים"],
         seasonal_angles_he=["הבחירות לכנסת: 27.10.2026", "בחירות מקומיות"],
         compliance_flag="political",
         compliance_note_he="חוק הבחירות (דרכי תעמולה) וכללי ועדת הבחירות המרכזית לזיוף עמוק (תשפ״ו-2026): סימון חובה לתעמולה שנוצרה ב-AI, זיהוי המפרסם, ואיסור על זיוף דמות של מועמדים. מומלץ להחריג את הנישה בהשקה ולדרוש אימות זהות. אין לה הוקים בספרייה."),
    dict(slug="physio-nutrition", name_he="פיזיותרפיה, תזונה ורפואה משלימה", name_en="Physiotherapy, nutrition & complementary health",
         category_slug="health-wellness", icon="Activity", priority=3,
         description_he="תוכן חינוכי שבונה סמכות: טיפים, מיתוסים והסברים פשוטים.",
         video_types_he=["טיפים", "ניפוץ מיתוסים", "תרגילים קצרים", "מה קורה בפגישה הראשונה", "מתכונים בריאים"],
         seasonal_angles_he=["ינואר", "לפני הקיץ", "אחרי החגים"],
         compliance_flag="medical",
         compliance_note_he="זהירות בטענות בריאות: בלי הבטחת ריפוי או ירידה במשקל, ובפרסום ממומן בלי לפנות לצופה בהנחה על מצבו הבריאותי. ברפואה משלימה, בלי טענות טיפוליות שאינן מבוססות."),
]

# ---------------------------------------------------------------------------
# Hook families and the 27 hook types (07 sec. B1, slugs converted to kebab-case)
# ---------------------------------------------------------------------------
FAMILIES = [
    ("curiosity", "סקרנות ומידע מבפנים", "Curiosity & insider info",
     "הוקים שפותחים פער מידע. הצופה נשאר כדי לקבל את התשובה."),
    ("warning", "אזהרות וטעויות", "Warnings & mistakes",
     "נשענים על הרתיעה מהפסד: מה ישתבש אם לא תדעו."),
    ("disruption", "שבירת דפוס ועמדה", "Disruption & bold takes",
     "פתיחה מפתיעה או עמדה חדה שעוצרת את הגלילה."),
    ("relatable", "הזדהות וסיפור", "Relatable & story",
     "הצופה רואה את עצמו בסיטואציה, בפנייה או בסיפור."),
    ("proof", "הוכחה ותוצאות", "Proof & results",
     "מראים ולא מספרים: תוצאה, מהפך, נתון או לקוחות אמיתיים."),
    ("education", "ערך ולימוד", "Value & education",
     "מבטיחים ערך מוגדר בזמן קצר: רשימה, מדריך או השוואה."),
    ("visual", "ויזואל ומאחורי הקלעים", "Visual & behind the scenes",
     "הוקים שעובדים גם בלי סאונד: תנועה, תהליך ומה שקורה מאחורי הדלפק."),
    ("action", "הצעה ומעורבות", "Offers & engagement",
     "מזמינים לפעול עכשיו: הצעה מוגבלת או אתגר שמייצר תגובות."),
]

HOOK_TYPES = [
    ("curiosity-gap", "פער סקרנות", "Curiosity gap", "curiosity",
     "פותח פער בין מה שהצופה יודע לבין מה שהוא רוצה לדעת. התשובה מגיעה רק בהמשך הסרטון.",
     "הדבר הראשון שאני בודקת בדירה – וזה לא הקירות"),
    ("pattern-interrupt", "שבירת דפוס", "Pattern interrupt", "disruption",
     "פתיחה לא צפויה, ויזואלית או מילולית, שקוטעת את קצב הגלילה.",
     "אל תבואו אלינו רעבים. ברצינות."),
    ("negative-warning", "אזהרה", "Negative / warning", "warning",
     "נשען על הטיית השליליות ועל הרתיעה מהפסד: מה ישתבש אם לא תדעו את זה.",
     "אל תלבינו שיניים לפני שאתם יודעים את זה"),
    ("stop-doing", "תפסיקו לעשות X", "Stop doing X", "warning",
     "פקודה ישירה להפסיק הרגל נפוץ. מעוררת התנגדות וסקרנות.",
     "תפסיקו לשמור קבלות בקופסת נעליים"),
    ("mistakes", "X טעויות", "Mistakes list", "warning",
     "רשימה ממוספרת של טעויות נפוצות: שילוב של רשימה ואזהרה.",
     "3 טעויות תאורה שהורסות כל דירה חדשה"),
    ("listicle", "רשימה ממוספרת", "Listicle", "education",
     "מספר קונקרטי (3, 5, 7) שמבטיח ערך מוגדר וזמן צפייה צפוי.",
     "3 תרגילים שמחליפים שעה בחדר כושר"),
    ("pov", "POV / נקודת מבט", "POV", "relatable",
     "מכניס את הצופה לסיטואציה מוכרת שקל להזדהות איתה. חזק במיוחד בטיקטוק וברילס.",
     "POV: הקבלן אמר \"שבועיים\". זה היה לפני 4 חודשים"),
    ("before-after", "לפני / אחרי", "Before / after", "proof",
     "חשיפה מיידית של מהפך ויזואלי.",
     "אמבטיה משנות ה-80 ← 10 ימי עבודה"),
    ("result-first", "התוצאה קודם", "Result first", "proof",
     "פותחים בתוצאה המרשימה, ורק אחר כך מספרים איך הגענו אליה.",
     "הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה"),
    ("question", "שאלה", "Question", "curiosity",
     "שאלה שהצופה עונה עליה בראש, ומרגיש שהיא מופנית אליו.",
     "כל כמה זמן באמת צריך לקלח כלב?"),
    ("callout", "פנייה לקהל", "Call-out", "relatable",
     "פנייה מדויקת לקהל היעד, כדי שהאנשים הנכונים יעצרו.",
     "עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך"),
    ("bold-claim", "טענה נועזת", "Bold claim", "disruption",
     "הצהרה חזקה ומפתיעה שהסרטון מוכיח בהמשך.",
     "סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר"),
    ("statistic", "נתון / מספר", "Statistic", "proof",
     "נתון מספרי חד שיוצר הקשר ואמינות. חייב להיות אמיתי ומתועד.",
     "הצוות שלכם מאבד 6 שעות בשבוע על דוחות"),
    ("story", "סיפור", "Story", "relatable",
     "פתיחה מאמצע הסיפור, עם דמות ומתח.",
     "הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪"),
    ("challenge", "אתגר", "Challenge", "action",
     "מזמין את הצופה לנסות, לנחש או להתמודד, ומייצר תגובות.",
     "פלאנק 30 שניות. כתבו בתגובות כמה החזקתם"),
    ("demonstration", "הדגמה", "Demonstration", "proof",
     "מראים את המוצר או השירות בפעולה, בזמן אמת, בלי הסברים מיותרים.",
     "דמו של 30 שניות: מעלים קובץ, יוצא דוח"),
    ("social-proof", "הוכחה חברתית", "Social proof", "proof",
     "לקוחות, ביקורות, מספרים ותגובות אמיתיות.",
     "ביקורת אמיתית, בלי תסריט ובלי עריכה"),
    ("controversy", "דעה לא פופולרית", "Controversy / hot take", "disruption",
     "עמדה מקצועית שנויה במחלוקת שפותחת דיון בתגובות.",
     "דעה לא פופולרית: בית פתוח זה בזבוז זמן"),
    ("myth-busting", "ניפוץ מיתוס", "Myth busting", "disruption",
     "מציגים אמונה נפוצה ומפריכים אותה.",
     "מיתוס: אם לא כואב – אין עששת"),
    ("insider-secret", "סוד מקצועי", "Insider secret", "curiosity",
     "\"מה שאנשי המקצוע לא מספרים\": תחושה של גישה למידע מבפנים.",
     "קבלן מגלה: איפה \"חוסכים\" בשיפוצים בלי שתשימו לב"),
    ("price-reveal", "חשיפת מחיר", "Price reveal", "curiosity",
     "עונה על השאלה שכולם רוצים לשאול: כמה זה עולה.",
     "כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח"),
    ("comparison", "השוואה (X מול Y)", "Comparison (X vs Y)", "education",
     "שתי אפשרויות זו מול זו, לרוב במסך מפוצל.",
     "שכירות או משכנתא? עשינו את החשבון"),
    ("behind-the-scenes", "מאחורי הקלעים", "Behind the scenes", "visual",
     "חושפים את מה שקורה מאחורי הדלפק, במטבח או בסטודיו.",
     "שישי בצהריים אצלנו: 280 סועדים, מטבח אחד"),
    ("day-in-life", "יום בחיים", "Day in the life", "relatable",
     "רצף מהיר של יום עבודה אמיתי, אנושי ומעורר הזדהות.",
     "יום בחיים של סוכן ביטוח (זה לא רק טפסים)"),
    ("how-to", "מדריך מהיר", "How-to", "education",
     "מבטיחים ללמד משהו שימושי בזמן קצוב.",
     "אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים"),
    ("satisfying-visual", "ויזואל ממכר", "Satisfying visual / ASMR", "visual",
     "הוק ויזואלי טהור: תנועה, מרקם, טיים-לאפס. עובד גם בלי סאונד.",
     "פייד מושלם ב-60 שניות"),
    ("urgency-offer", "דחיפות / הצעה", "Urgency / offer", "action",
     "הצעה מוגבלת בזמן או בכמות, רק כשהיא אמיתית.",
     "נשארו 2 סופ״שים פנויים בחודש הבא"),
]

# ---------------------------------------------------------------------------
# Seasons / Israeli marketing calendar (06 sec. 5.3 + 07 sec. B3). Hebrew-calendar
# dates were computed in the research file and are NOT verified: the product must
# take them from a Hebrew-calendar API (e.g. Hebcal) at runtime.
# ---------------------------------------------------------------------------
SEASONS = [
    dict(slug="after-holidays", name_he="אחרי החגים", name_en="After the holidays",
         date_hint_he="אוקטובר 2026 (אחרי שמחת תורה, 3.10.2026)", publish_window_he="כל אוקטובר",
         niche_slugs=["fitness-trainers", "yoga-pilates", "physio-nutrition", "renovation-contractors", "interior-design", "event-venues", "therapists"],
         is_quiet_day=False, note_he="המסר \"אחרי החגים מתחילים\" חזק לאורך כל אוקטובר."),
    dict(slug="knesset-elections-2026", name_he="הבחירות לכנסת", name_en="Knesset elections",
         date_hint_he="27.10.2026", publish_window_he="—",
         niche_slugs=[], is_quiet_day=False,
         note_he="לא מועד שיווקי: חוסמים תבניות פוליטיות ודמויות של פוליטיקאים אמיתיים. תעמולה שנוצרה ב-AI חייבת סימון לפי כללי ועדת הבחירות."),
    dict(slug="singles-day", name_he="11.11, יום הרווקים", name_en="Singles' Day (11.11)",
         date_hint_he="11.11.2026", publish_window_he="שבוע לפני ועד סוף היום",
         niche_slugs=["ecommerce", "retail-stores"], is_quiet_day=False, note_he=None),
    dict(slug="black-friday", name_he="בלאק פריידיי וסייבר מאנדיי", name_en="Black Friday & Cyber Monday",
         date_hint_he="27.11.2026 (סייבר מאנדיי: 30.11.2026)", publish_window_he="כל נובמבר; שיא משבוע לפני ועד סייבר מאנדיי",
         niche_slugs=["ecommerce", "retail-stores", "beauty-nails", "aesthetic-clinics", "fitness-trainers", "car-dealers"],
         is_quiet_day=False, note_he="אירוע גדול מאוד בישראל. הקמפיינים רצים לאורך כל נובמבר."),
    dict(slug="hanukkah", name_he="חנוכה", name_en="Hanukkah",
         date_hint_he="4–12.12.2026 (הנר הראשון בערב 4.12)", publish_window_he="טיזר שבוע לפני, ואז מהנר הראשון ועד סוף החג",
         niche_slugs=["restaurants", "catering-chefs", "kids-activities", "tourism-attractions", "retail-stores", "ecommerce", "nonprofits"],
         is_quiet_day=False, note_he=None),
    dict(slug="tax-year-end", name_he="סוף שנת המס", name_en="Tax year end",
         date_hint_he="דצמבר 2026 (עד 31.12)", publish_window_he="1–31 בדצמבר",
         niche_slugs=["accountants", "insurance-agents", "nonprofits", "lawyers"], is_quiet_day=False, note_he=None),
    dict(slug="silvester", name_he="סילבסטר", name_en="New Year's Eve",
         date_hint_he="31.12.2026", publish_window_he="שבוע לפני",
         niche_slugs=["djs-musicians", "event-venues", "restaurants"], is_quiet_day=False, note_he="קהל חילוני בעיקר."),
    dict(slug="new-year", name_he="ינואר: שנה אזרחית חדשה", name_en="New calendar year (January)",
         date_hint_he="ינואר 2027", publish_window_he="מסוף דצמבר ועד אמצע ינואר",
         niche_slugs=["fitness-trainers", "yoga-pilates", "physio-nutrition", "courses-educators", "accountants", "car-dealers", "insurance-agents"],
         is_quiet_day=False, note_he=None),
    dict(slug="tu-bishvat", name_he="ט״ו בשבט", name_en="Tu BiShvat",
         date_hint_he="בערך 23.1.2027", publish_window_he="שבוע לפני",
         niche_slugs=["physio-nutrition", "restaurants", "catering-chefs"], is_quiet_day=False, note_he=None),
    dict(slug="registration-season", name_he="עונת ההרשמה לגנים ולקייטנות", name_en="Kindergarten & camp registration",
         date_hint_he="ינואר עד מרץ 2027", publish_window_he="לאורך כל העונה",
         niche_slugs=["kids-activities", "courses-educators"], is_quiet_day=False, note_he=None),
    dict(slug="family-day", name_he="יום המשפחה", name_en="Family Day",
         date_hint_he="בערך 7.2.2027", publish_window_he="10 ימים לפני",
         niche_slugs=["retail-stores", "ecommerce", "beauty-nails", "restaurants"], is_quiet_day=False, note_he=None),
    dict(slug="valentines", name_he="ולנטיינז", name_en="Valentine's Day",
         date_hint_he="14.2.2027", publish_window_he="שבוע לפני",
         niche_slugs=["restaurants", "beauty-nails", "zimmers-boutique-hotels", "retail-stores", "ecommerce"], is_quiet_day=False, note_he=None),
    dict(slug="purim", name_he="פורים", name_en="Purim",
         date_hint_he="בערך 23.3.2027 (שנה מעוברת: אדר ב׳)", publish_window_he="שבוע לפני",
         niche_slugs=["djs-musicians", "event-venues", "restaurants", "retail-stores", "kids-activities"], is_quiet_day=False, note_he=None),
    dict(slug="pre-passover", name_he="לפני פסח: ניקיונות ושיפוצים", name_en="Pre-Passover (cleaning & renovations)",
         date_hint_he="מרץ עד אפריל 2027", publish_window_he="3–4 שבועות לפני פסח",
         niche_slugs=["renovation-contractors", "home-services", "interior-design", "movers-storage", "retail-stores"],
         is_quiet_day=False, note_he="אחד משיאי השנה לעסקי שירות."),
    dict(slug="passover", name_he="פסח וחול המועד", name_en="Passover",
         date_hint_he="בערך 21–28.4.2027", publish_window_he="שבועיים לפני ועד סוף החג",
         niche_slugs=["restaurants", "tourism-attractions", "zimmers-boutique-hotels", "catering-chefs", "real-estate"], is_quiet_day=False, note_he=None),
    dict(slug="holocaust-memorial-day", name_he="יום השואה", name_en="Holocaust Remembrance Day",
         date_hint_he="בערך 4.5.2027", publish_window_he="לא מפרסמים",
         niche_slugs=[], is_quiet_day=True, note_he="יום שקט: עוצרים אוטומטית כל פרסום שיווקי."),
    dict(slug="memorial-day", name_he="יום הזיכרון", name_en="Memorial Day",
         date_hint_he="בערך 11.5.2027", publish_window_he="לא מפרסמים",
         niche_slugs=[], is_quiet_day=True, note_he="יום שקט: עוצרים אוטומטית כל פרסום שיווקי."),
    dict(slug="independence-day", name_he="יום העצמאות", name_en="Independence Day",
         date_hint_he="בערך 12.5.2027", publish_window_he="שבוע לפני; לא ביום הזיכרון עצמו",
         niche_slugs=["restaurants", "catering-chefs", "event-venues", "djs-musicians", "tourism-attractions", "vets-dog-grooming"],
         is_quiet_day=False, note_he="טון מכבד: היום צמוד ליום הזיכרון."),
    dict(slug="lag-baomer", name_he="ל״ג בעומר", name_en="Lag BaOmer",
         date_hint_he="בערך 25.5.2027", publish_window_he="שבוע לפני",
         niche_slugs=["event-venues", "djs-musicians", "event-photographers"], is_quiet_day=False,
         note_he="החתונות חוזרות לזוגות דתיים."),
    dict(slug="shavuot", name_he="שבועות", name_en="Shavuot",
         date_hint_he="בערך 11.6.2027", publish_window_he="שבוע לפני",
         niche_slugs=["restaurants", "catering-chefs", "retail-stores"], is_quiet_day=False, note_he=None),
    dict(slug="summer", name_he="החופש הגדול", name_en="Summer vacation",
         date_hint_he="יולי עד אוגוסט 2027", publish_window_he="מסוף יוני",
         niche_slugs=["zimmers-boutique-hotels", "tourism-attractions", "kids-activities", "home-services", "movers-storage", "real-estate", "driving-schools", "vets-dog-grooming"],
         is_quiet_day=False, note_he="בתקופת \"שלושת השבועות\" (בערך מאמצע יולי עד 12.8) יש פחות חתונות ואירועים בציבור הדתי."),
    dict(slug="tu-beav", name_he="ט״ו באב", name_en="Tu B'Av",
         date_hint_he="בערך 18.8.2027", publish_window_he="10 ימים לפני",
         niche_slugs=["zimmers-boutique-hotels", "beauty-nails", "retail-stores", "restaurants"], is_quiet_day=False, note_he=None),
    dict(slug="back-to-school", name_he="חזרה ללימודים", name_en="Back to school",
         date_hint_he="1.9.2027", publish_window_he="מאמצע אוגוסט",
         niche_slugs=["retail-stores", "ecommerce", "driving-schools", "courses-educators", "barbers-salons", "dentists", "kids-activities"],
         is_quiet_day=False, note_he=None),
    dict(slug="rosh-hashana", name_he="ראש השנה", name_en="Rosh Hashana",
         date_hint_he="בערך 2.10.2027 (ראש השנה תשפ״ח; ראש השנה תשפ״ז היה ב-12–13.9.2026)", publish_window_he="3–4 שבועות לפני",
         niche_slugs=["retail-stores", "ecommerce", "restaurants", "catering-chefs", "nonprofits", "aesthetic-clinics", "beauty-nails", "barbers-salons"],
         is_quiet_day=False, note_he="גם עונת התרומות לעמותות, עד יום כיפור."),
    dict(slug="sukkot", name_he="סוכות וחול המועד", name_en="Sukkot",
         date_hint_he="תשרי, כשבועיים אחרי ראש השנה", publish_window_he="שבועיים לפני",
         niche_slugs=["tourism-attractions", "zimmers-boutique-hotels", "restaurants", "kids-activities"], is_quiet_day=False, note_he=None),
]

# ---------------------------------------------------------------------------
# Placeholder dictionary (07 sec. B4 + additions). Used for validation and the doc.
# (key, meaning, example, grammar rule, used_in)
# ---------------------------------------------------------------------------
PLACEHOLDERS = [
    ("עיר", "עיר או אזור", "תל אביב, באר שבע, השרון",
     "אותיות השימוש נצמדות: \"ב{עיר}\" ← \"בתל אביב\". כשהשם מתחיל בה׳ הידיעה (\"השרון\"), היא נשמטת אחרי ב/ל/כ: \"בשרון\"."),
    ("שכונה", "שכונה", "פלורנטין, רמת אביב", "אותו כלל כמו {עיר}."),
    ("שירות", "השירות", "השתלות שיניים, שיפוץ אמבטיה", "שומרים גם צורה לא מיודעת וגם צורה מיודעת."),
    ("מוצר", "מוצר", "כרית אורתופדית", "שומרים את המין הדקדוקי (זכר או נקבה) כדי שהפעלים יתאימו."),
    ("מחיר", "מחיר ב-₪", "249", "מפריד אלפים, ו-₪ אחרי המספר עם רווח."),
    ("סכום", "סכום ב-₪", "12,000", "כמו {מחיר}."),
    ("מספר", "כמות", "3, 5, 7", "ברשימות עדיף מספר אי-זוגי. אחרי אות שימוש, מקף לפני הספרה: \"ב-3\"."),
    ("זמן", "משך זמן", "10 ימים, חודשיים", "התאמה ברבים."),
    ("חודש", "חודש", "נובמבר", "—"),
    ("קהל_יעד", "קהל יעד, ברבים", "עצמאים, זוגות צעירים", "תמיד ברבים, כדי שהפועל יתאים (\"חסכו\")."),
    ("שם_העסק", "שם העסק", "—", "שם בלטינית עוטפים בבידוד bidi."),
    ("פעולה_שגויה", "פעולה שגויה, בשם פועל", "לשמור קבלות בקופסה", "צריכה להישמע טבעית אחרי \"תפסיקו\"."),
    ("מיתוס", "מיתוס נפוץ", "\"צוואה זה רק לעשירים\"", "—"),
    ("לפני", "המצב לפני", "מטבח משנות ה-90", "—"),
    ("אחרי", "המצב אחרי", "מטבח מודרני ומואר", "—"),
    ("הנחה", "ההטבה במבצע", "20% הנחה, משלוח חינם", "רק הטבה אמיתית, עם כל התנאים."),
    ("בעיה", "הבעיה שהמוצר פותר", "טבלאות אקסל שאף אחד לא מעדכן", "נכתבת אחרי \"נמאס לנו מ\", כך שהמ׳ נצמדת אליה."),
    ("דירוג", "דירוג בגוגל (בתסריטים)", "4.8", "רק מהפרופיל האמיתי של העסק."),
    ("כתובת", "כתובת העסק (בתסריטים)", "רחוב הרצל 12, רמלה", "—"),
    ("שם_לקוח", "שם הלקוח בהמלצה (בתסריטים)", "מיכל כ.", "רק בהסכמה בכתב."),
]

# ---------------------------------------------------------------------------
# Hooks per niche.
# Line format:  text | types | platforms | goal | gender | visual | compliance | flags
#   types:      primary[+secondary]   (only the primary is stored in JSON)
#   platforms:  R=reels T=tiktok S=shorts F=facebook Y=youtube W=whatsapp
#   gender:     p=plural n=neutral f=female m=male
#   compliance: "-" for none
#   flags:      "*" = is_featured ; "s=<season-slug>" ; "-" for none
# Lines 01-10 of the 22 original niches come from 07 sec. B2 (edited);
# a line marked "# 06" comes from the example-hook column of 06 sec. 5.1.
# ---------------------------------------------------------------------------
HOOKS_SRC = {
"real-estate": """
לפני שאתם חותמים על דירה, תבדקו 3 דברים. על השלישי מתווכים פחות אוהבים לדבר | listicle+curiosity-gap | R,T,S | trust | p | יד עם עט קופאת מעל חוזה, שלושה מספרים קופצים על המסך | - | *
הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה | result-first | R,F | leads | n | מדבקת "נמכר" נדבקת בזום מהיר על שלט "למכירה" | מספר הימים חייב להיות נתון אמיתי. | *
POV: סוף סוף מצאתם דירה עם מרפסת שמש – וגם חנייה | pov | R,T | awareness | p | דלת נפתחת אל מרפסת מוארת, המצלמה מתקדמת פנימה מגובה העיניים | - | -
כמה באמת עולה דירת 4 חדרים ב{עיר} השנה? המספר לא מה שחשבתם | price-reveal | R,T,S,F | leads | p | המתווכת מחזיקה שלט עם מספר מטושטש, אצבע מתקרבת כדי לחשוף אותו | המחיר להמחשה; משתמשים בנתוני עסקאות אמיתיים. | -
תפסיקו לתמחר את הדירה שלכם לפי מה שהשכן ביקש | stop-doing | F,R | leads | p | מחיר על שלט נמחק בקו אדום, המתווך מניד בראשו אל המצלמה | - | -
הטעות של 120 אלף ₪ שהרבה מוכרים עושים כבר בשבוע הראשון | negative-warning | F,R | leads | n | המספר 120,000 ₪ באדום מתנפץ על המסך, המתווכת מצביעה עליו | - | -
זה מה שקונים רואים ב-5 השניות הראשונות בדירה שלכם | curiosity-gap+pov | R,T | leads | p | מצלמת גוף נכנסת בדלת אל מסדרון עמוס נעליים ומעילים | - | -
למשקיעים: דירה קטנה במרכז או גדולה בפריפריה? | comparison+question | F,S | trust | n | מסך מפוצל: בניין לבן במרכז העיר מול בית עם גינה | - | -
סיור של 30 שניות בפנטהאוז שעוד לא עלה לאתרים | behind-the-scenes+curiosity-gap | R,T,S | awareness | n | דלתות מעלית נפתחות ישר לסלון עם נוף, רחפן יוצא מהחלון | - | -
דעה לא פופולרית: בית פתוח זה בזבוז זמן. הנה מה שעובד במקום | controversy | R,T,F | trust | n | בית פתוח ריק עם בלונים, המתווך נכנס לפריים ומפוצץ בלון | - | -
""",
"real-estate-developers": """
ככה ייראה הבוקר שלכם בעוד שנתיים | pov+curiosity-gap | R,F,S | leads | p | הדמיה: אור בוקר נכנס מחלון ענק אל מרפסת עם נוף פתוח, כוס קפה מעלה אדים | הדמיה: חובה כיתוב "הדמיה בלבד" על המסך. | *
3 שאלות שחובה לשאול יזם לפני שקונים דירה על הנייר | listicle | F,R,S | trust | n | תוכנית אדריכלית נפרשת על שולחן, יד מקיפה שלוש נקודות בעיגול | - | -
היום זה בור באדמה. ככה זה ייראה בעוד {זמן} | before-after | R,T,F | awareness | n | רחפן מעל בור חפירה, ואז מעבר ניגוב לאותה זווית בהדמיה של הבניין הגמור | הדמיה: חובה כיתוב "הדמיה בלבד" על המסך, ומועד המסירה רק לפי החוזה. | -
דירה מקבלן או יד שנייה? מה באמת משתלם יותר | comparison | F,R,S | trust | n | מסך מפוצל: מפתח חדש עם תווית מול מפתח ישן על מחזיק עור | - | -
נשארו {מספר} דירות בשלב הראשון של הפרויקט | urgency-offer | F,R | sales | n | תוכנית קומות גרפית, הדירות שנמכרו נצבעות אחת אחרי השנייה | רק אם נכון: המספר חייב להתעדכן לפי המלאי בפועל. | -
""",
"aesthetic-clinics": """
הטעות שגורמת לבוטוקס להיראות "עשוי" | negative-warning | R,T,F | trust | n | המטפלת מחזיקה מראה מול מטופלת, הפריים קופא | - | *
3 שאלות שחובה לשאול לפני שמזריקים חומצה היאלורונית | listicle | R,F,S | trust | n | מגש סטרילי, יד בכפפה מרימה שלוש אצבעות | - | -
תפסיקו לחפש "הכי זול" כשמדובר בפנים שלכם | stop-doing | R,F | trust | p | תווית של 199 ₪ נקרעת לשניים מול המצלמה | - | -
מיתוס: טיפולי פנים זה רק לנשים | myth-busting | R,T | awareness | n | גבר שוכב על מיטת טיפולים, פוקח עין ומרים גבה אל המצלמה | - | *
מה באמת קורה לעור ב-24 השעות שאחרי פילינג | curiosity-gap+how-to | R,T,S | trust | n | מאקרו של מרקם העור, שעון של 24 שעות מתחיל לרוץ | - | -
POV: חזרתם מטיפול, וכולם שואלים מאיזו חופשה חזרתם | pov | R,T | awareness | p | במשרד, עמיתה מסתכלת פעמיים בהפתעה | - | -
טיפול אחד. בלי פילטר, באותה תאורה | before-after | R,F | leads | n | מסך מפוצל עם מחוון נגרר, אותה תאורה ואותה זווית | לפני ואחרי בתחום רפואי מוגבל בפרסום ממומן ובכללי משרד הבריאות: לבדוק לפני שימוש, או לעבור לגרסה שמראה את התהליך. | -
שואלים אותי אם זה כואב. הנה התשובה הכנה | question | R,T,F | trust | n | המטפל מוריד כפפות ומתיישב מול המצלמה | אין להבטיח טיפול "בלי כאב". | -
יום בקליניקה: 11 מטופלות, אפס תוצאות "מוגזמות" | day-in-life+statistic | R,T | awareness | f | טיים-לאפס של חדר טיפולים, הדלת נפתחת ונסגרת | - | -
הדבר הראשון שאני בודקת אצל כל מטופלת – וזה לא הקמטים | curiosity-gap+insider-secret | R,T,S | trust | f | מנורת זכוכית מגדלת נדלקת, תקריב על העיניים | - | -
אל תעשי בוטוקס לפני שאת שומעת את זה | negative-warning | R,T,F | trust | f | מזרק סגור מונח על מגש, יד בכפפה מרחיקה אותו מהמצלמה | - | -
""",
"beauty-nails": """
לק ג׳ל שמחזיק 4 שבועות? הכול בהכנה | insider-secret+curiosity-gap | R,T | trust | n | מאקרו של שיוף והכנת הציפורן | - | *
תפסיקו לקלף את הג׳ל לבד. ברצינות | stop-doing+negative-warning | R,T | trust | p | יד מקלפת ג׳ל, X אדום קופץ | - | -
הלקוחה הביאה תמונה מפינטרסט. הצלחנו? | challenge+before-after | R,T,S | awareness | f | טלפון עם תמונת ההשראה מוחזק ליד יד מוכנה לעבודה | - | *
צבע העונה – ולמי הוא פחות יחמיא | curiosity-gap | R,T | awareness | n | מניפת דוגמאות צבע נפתחת | - | -
בניית ציפורן מאפס. 30 שניות של רוגע | satisfying-visual | T,R,S | awareness | n | מאקרו של פיסול ג׳ל בקצב איטי, סאונד ASMR | - | -
3 סימנים שהמכשירים אצל המניקוריסטית לא עוקרו | listicle+negative-warning | R,F | trust | f | שקית עיקור אטומה נפתחת מול המצלמה | - | -
גבות אחרי מיקרובליידינג: יום 1 מול יום 30 | before-after+comparison | R,T,F | leads | n | מסך מפוצל של אותה גבה | - | -
כמה זמן באמת לוקחת בניית ציפורניים? שמנו טיימר | demonstration+statistic | R,T | awareness | n | יד לוחצת "התחל" על שעון עצר שעל השולחן | - | -
POV: יש לכם אירוע בעוד יומיים, ואין תור בשום מקום | pov+urgency-offer | R,T,F | leads | p | גלילה בטלפון: "אין תורים פנויים", ואז משבצת פנויה מהבהבת | - | -
הלקוחה חזרה אחרי 3 שבועות. זה מה שנשאר מהלק | social-proof | R,F | trust | f | לקוחה מציגה את הציפורניים למצלמה באור יום | רק לקוחה אמיתית, בהסכמתה. | -
""",
"barbers-salons": """
ביקש "רק לסדר קצת". זה מה שיצא | before-after+story | R,T | awareness | m | הכיסא מסתובב לאט וחושף את הלקוח מול המראה | - | *
התספורת הזאת מתאימה רק ל-3 צורות פנים | listicle+curiosity-gap | R,T,S | trust | n | הספרית מחזיקה מראה, קווי מתאר של צורות פנים מופיעים | - | -
תפסיקו לחפוף כל יום. ברצינות, השיער שלכם מתחנן | stop-doing | R,T | awareness | p | יד לוקחת בקבוק שמפו מהמקלחת ומחזירה אותו למדף | - | -
פייד מושלם ב-60 שניות | satisfying-visual+demonstration | T,R,S | awareness | n | מכונת תספורת מצולמת מלמעלה בהאצה, שיער נופל | - | *
כמה צריכה לעלות תספורת טובה? ולמה לא 40 ₪ | price-reveal+controversy | R,T,F | sales | n | מטבעות על הדלפק, הספר מניד בראשו | - | -
POV: הספר הקבוע שלכם בחופש, ואתם אצל מישהו חדש | pov | T,R | awareness | p | לקוח בכיסא, העיניים שלו מתרחבות מול המראה | - | -
3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים | listicle+insider-secret | R,S | trust | m | מספריים נעצרים באוויר ליד השיער | - | -
מה ששיער מתולתל צריך – ואף אחד לא אמר לכם | insider-secret+callout | R,T | sales | p | תקריב של תלתלים, טיפת מוצר נלחצת על כף היד | - | -
תספורת לחתונה: מתי לקבוע תור? (רמז: לא יום לפני) | question+how-to | R,F | leads | n | חתן בחליפה על הכיסא, שעון על הקיר | - | -
שישי בבוקר אצלנו במספרה: שעה שלמה ב-30 שניות | day-in-life+behind-the-scenes | R,T | awareness | n | טיים-לאפס של מספרה מלאה, מוזיקה קצבית | - | -
""",
"restaurants": """
אל תבואו אלינו רעבים. ברצינות. | pattern-interrupt | R,T | awareness | p | מגש ענק נוחת בחבטה על שולחן עץ בהילוך איטי, אדים עולים | - | *
המנה הזאת יוצאת מהמטבח 400 פעם בשבוע. הנה למה | social-proof+curiosity-gap | R,T,S | sales | n | תקריב של רוטב שנשפך על המנה, רחש מהמחבת | המספר חייב להיות אמיתי. | *
POV: הזמנתם "רק משהו קטן", והשף החליט אחרת | pov | R,T | awareness | p | צילום מלמעלה: השולחן מתמלא במנות בטיים-לאפס | - | -
שישי בצהריים אצלנו: 280 סועדים, מטבח אחד | behind-the-scenes+statistic | R,T,S | awareness | n | להבה מתפרצת מהווק, פתקי הזמנות נפלטים מהמדפסת | - | -
3 מנות שהצוות שלנו אוכל בכל משמרת – וכמעט אף לקוח לא מזמין | listicle+insider-secret | R,T | sales | n | ידיים של הצוות "חוטפות" מנה מהפס בפינת המטבח | - | -
הבצק הזה תופח 48 שעות לפני שהוא מגיע לשולחן | demonstration+satisfying-visual | R,T,S | trust | n | תקריב של בצק נמתח, דלת התנור נפתחת עם ענן אדים | - | -
כמה עולה ארוחה זוגית מלאה אצלנו? נחשו בתגובות | price-reveal+challenge | R,T,F | engagement | p | שתי כוסות נוקשות זו בזו, תווית מחיר מטושטשת בפינה | - | -
אם אתם ב{עיר} ומחפשים איפה לאכול הערב – זה הסרטון שלכם | callout | R,T,F | awareness | p | שלט הניאון של המסעדה נדלק בלילה, קאטים מהירים | - | -
ניסינו להכין את השניצל הכי גדול ב{עיר}. זה מה שיצא | challenge | T,R,S | awareness | n | שניצל ענק נשלף מהשמן וגולש מעבר לשולי הצלחת | - | -
ביקורת אמיתית, בלי תסריט ובלי עריכה | social-proof | R,F | trust | n | סועדת באמצע ביס מהנהנת עם פה מלא, כיתוב "בלי תסריט" | רק לקוח אמיתי, בהסכמתו לצילום ולפרסום. | -
המנה שגורמת לאנשים לנסוע שעה בשבילה | curiosity-gap+social-proof | R,T,F | sales | n | המנה מסתובבת על מגש בתקריב, ואז קאט לתור בכניסה | - | -
""",
"fitness-trainers": """
רוצים בטן שטוחה? תפסיקו לעשות כפיפות בטן | stop-doing+controversy | R,T,S | awareness | p | מתאמן עושה כפיפות בטן, המאמנת נכנסת לפריים עם יד שמסמנת "עצור" | בפרסום ממומן לא פונים לצופה בהנחה על הגוף שלו; מנסחים כטיפ כללי. | *
3 תרגילים שמחליפים שעה בחדר כושר | listicle+bold-claim | R,T,S | awareness | n | ברפי מהיר עם טיימר ענק על המסך | - | -
POV: השבוע הראשון שלכם באימון אישי | pov | R,T | leads | p | מתאמנת מהססת בכניסה לחדר הכושר, המאמן נותן לה כיף | - | -
ירדה 14 קילו בלי לוותר על ארוחת שישי אצל אמא. ככה | result-first+social-proof | R,F | leads | f | מתאמנת מחזיקה מול המראה ג׳ינס ישן ורחב | לפני ואחרי של ירידה במשקל מוגבל בפרסום ממומן; רק סיפור אמיתי, בהסכמה, עם "התוצאות משתנות מאדם לאדם". | -
פלאנק 30 שניות. כתבו בתגובות כמה החזקתם | challenge | T,R,S | engagement | p | פלאנק עם ספירה לאחור גדולה באמצע המסך | - | *
הטעות שהורסת לכם את הברכיים בסקוואט | negative-warning | R,T,S | trust | p | סקוואט מהצד, קו אדום מסמן ברכיים שבורחות קדימה | - | -
אין לכם זמן להתאמן? יש לכם 12 דקות? | question+callout | R,F | leads | p | טיימר של מיקרוגל על 12:00, ואז קאט לאימון בסלון | - | -
מיתוס: משקולות "מנפחות" נשים | myth-busting | R,T,S | awareness | n | מתאמנת מרימה דדליפט ומחייכת אל המצלמה | - | -
ככה נראית ארוחת בוקר של מאמן כושר (לא מה שחשבתם) | curiosity-gap+day-in-life | R,T | awareness | m | צלחת שקשוקה עם פיתה במקום חזה עוף, מבט מופתע | - | -
90 יום: אותו אדם, אותה מראה, אותה תאורה | before-after | R,T,F | sales | n | סלפי במראה, מסך מפוצל עם מעבר ניגוב | לפני ואחרי של ירידה במשקל מוגבל בפרסום ממומן במטא ובטיקטוק: לבדוק לפני שימוש ולהוסיף "התוצאות משתנות מאדם לאדם". | -
""",
"yoga-pilates": """
גב תפוס מהמחשב? 4 תנועות שאפשר לעשות בלי לקום מהכיסא | callout+how-to | R,F,S | awareness | n | אדם ליד שולחן עבודה מסובב כתפיים, המצלמה מתקרבת | בפרסום ממומן מנסחים בלי להניח את מצבו הבריאותי של הצופה ("4 תנועות לגב בלי לקום מהכיסא"). | *
פילאטיס מכשירים או מזרן? רוב האנשים בוחרים לא נכון | comparison | R,F | leads | n | מסך מפוצל: מכשיר רפורמר מול מזרן | - | -
POV: השיעור הראשון שלכם על רפורמר | pov | R,T | leads | p | כפות רגליים על הבר, הקרון מחליק לאט | - | *
תפסיקו לעצור את הנשימה בתרגיל הזה | stop-doing | R,T,S | trust | p | תקריב של פנים עם לחיים נפוחות, ואז נשיפה | - | -
ככה נראה הסטודיו ב-6:30 בבוקר | behind-the-scenes+satisfying-visual | R,T | awareness | n | אור זריחה נכנס מהחלון אל מזרנים שנפרשים | - | -
אמרו לי שיוגה זה "רק מתיחות". אז עשיתי את זה | challenge+pattern-interrupt | R,T,S | awareness | n | המדריכה עולה לעמידת ידיים מתוך ישיבה | - | -
3 חודשים, פעמיים בשבוע. זה מה שהשתנה ביציבה | result-first+before-after | R,F | leads | n | צילום פרופיל, קו גרפי של היציבה מתיישר | רק סיפור אמיתי, עם "התוצאות משתנות מאדם לאדם". | -
בדיקה של 10 שניות: מגיעים לבהונות בלי לכופף ברכיים? | challenge | T,R,S | engagement | p | אדם מתכופף קדימה ולא מגיע, טיימר של 10 שניות | - | -
התרגיל שכולם שונאים בשיעור – והכי צריכים | curiosity-gap | R,T | awareness | n | כל הכיתה נאנחת יחד באמצע תרגיל | - | -
שיעור ניסיון עלינו. רק תבואו עם בגדים נוחים | urgency-offer | F,R | leads | p | יד הופכת שלט עץ של "שיעור ניסיון" בכניסה לסטודיו | - | -
""",
"renovation-contractors": """
המטבח הזה עלה 38 אלף ₪. נחשו מה החלפנו | price-reveal+curiosity-gap | R,F | leads | p | שוט רחב של מטבח חדש, ניגוב אל המטבח הישן | המחיר חייב להיות אמיתי. | *
3 דברים שאסור לחתום עליהם מול קבלן שיפוצים | listicle+negative-warning | F,R,S | trust | n | חוזה על השיש, יד עם עט מהססת | - | -
קבלן מגלה: איפה "חוסכים" בשיפוצים בלי שתשימו לב | insider-secret | F,R,T | trust | m | הקבלן דופק על קיר, צליל חלול, אריח נשלף | - | -
אמבטיה משנות ה-80 ← 10 ימי עבודה | before-after | R,F,T | leads | n | פטיש מנפץ אריח ורוד, ענן אבק קופא בפריים | משך העבודה חייב להתאים להצעה האמיתית. | *
תפסיקו לבחור קבלן לפי ההצעה הכי זולה | stop-doing | F,R | trust | p | שלוש הצעות מחיר על שולחן, הזולה ביותר מתקמטת | - | -
POV: הקבלן אמר "שבועיים". זה היה לפני 4 חודשים | pov | R,T,F | leads | n | סלון מכוסה אבק, דפי לוח שנה עפים | - | -
רטיבות בקיר? זה מה שבאמת מסתתר מאחוריו | curiosity-gap+demonstration | F,R,S | leads | n | מד לחות מצפצף על הקיר, ואז פתיחה של הטיח | - | -
דירת 4 חדרים, צביעה מלאה, יום עבודה אחד | satisfying-visual+demonstration | R,T,S | awareness | n | טיים-לאפס של רולרים שצובעים קירות שלמים | - | -
כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח | price-reveal+statistic | F,R,S | leads | n | הקבלנית מחזיקה לוח כתיבה, המחירים מטושטשים | - | -
הלקוחות חזרו הביתה אחרי השיפוץ. תסתכלו על הפנים שלהם | social-proof+story | R,F | trust | p | דלת נפתחת, משפחה נעצרת בהלם | צילום לקוחות רק בהסכמה בכתב. | -
""",
"dentists": """
אל תלבינו שיניים לפני שאתם יודעים את זה | negative-warning | R,T,S | trust | p | ערכת הלבנה ביד, חותמת X אדומה נוחתת עליה | - | *
3 סימנים שאתם צריכים טיפול שורש (השלישי מפתיע) | listicle+curiosity-gap | R,F,S | leads | p | הרופאה מחזיקה דגם של שן ומרימה שלוש אצבעות | בפרסום ממומן מנסחים בגוף שלישי ("3 סימנים שאולי צריך טיפול שורש"): פנייה שמניחה מצב בריאותי של הצופה נפסלת במטא. | -
מצחצחים מיד אחרי הקפה? יש לנו בעיה | question+pattern-interrupt | R,T | awareness | p | כוס קפה ליד מברשת שיניים, יד חוטפת את המברשת | - | *
פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו | callout+pov | R,F | leads | p | צילום מנקודת המבט של המטופל: תקרה עם מסך שמקרין סדרה, תאורה רכה | - | -
ככה נראה חיוך אחרי 6 חודשים של יישור שקוף | before-after | R,T,F | leads | n | קשתית שקופה יוצאת לאט וחושפת חיוך | לפני ואחרי בתחום רפואי: לבדוק מול כללי הפרסום ולהוסיף "התוצאות משתנות ממטופל למטופל". | -
מיתוס: אם לא כואב – אין עששת | myth-busting | R,T,S | trust | n | צילום רנטגן על מסך, עיגול אדום מסמן נקודה | - | -
כמה באמת עולה שתל שיניים ב-2026? בלי אותיות קטנות | price-reveal | F,R,S | leads | n | הרופא כותב מספר על לוח ומסתיר אותו ביד | המחיר רק לפי המחירון האמיתי של המרפאה. | -
הילד שלכם בוכה בדרך לרופא שיניים? תראו מה קרה פה | callout+story | F,R | trust | p | ילד צוחק על הכיסא מול בובה בצורת שן | צילום קטינים רק בהסכמת הורים. | -
רופא שיניים מגיב: הלבנה עם פחם מטיקטוק | controversy+myth-busting | T,R,S | awareness | m | מסך ירוק: הרופא מול סרטון הטרנד, מרים גבה | - | -
אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים | how-to | R,T,S | awareness | p | דגם שיניים ענק, החוט נכנס בתנועה הנכונה | - | -
השתלת שיניים: 5 שאלות שחובה לשאול לפני שמתחילים | listicle | F,R,S | trust | n | הרופאה פורשת חמש אצבעות מול צילום פנורמי של הלסת | - | -
""",
"mortgage-advisors": """
אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים | statistic+bold-claim | F,R,S | leads | n | שתי ערימות מטבעות זהות, אחת מתחילה לצמוח מהר | ההפרש חייב להתבסס על סימולציה מתועדת; מוסיפים "סימולציה להמחשה בלבד". | *
תפסיקו להגיע לבנק בלי הצעה מתחרה ביד | stop-doing | F,R | leads | p | זוג נכנס לסניף בידיים ריקות, היועצת מגישה להם תיקייה | - | -
3 מסלולים שחובה להבין לפני שחותמים על משכנתא | listicle | F,R,S | trust | n | שלושה עמודים צבעוניים נבנים בגרפיקה | - | -
קיבלתם אישור עקרוני? מזל טוב. עכשיו מתחיל המשא ומתן | callout+pattern-interrupt | F,R,T | leads | p | קונפטי על מכתב האישור, ואז צליל של תקליט שנעצר | - | *
מיתוס: "אנחנו לקוחות של הבנק 20 שנה, יתנו לנו את הריבית הכי טובה" | myth-busting | F,R | trust | n | כרטיס אשראי ישן על השולחן, היועץ מניד בראשו | - | -
מחזור משכנתא: מתי זה משתלם, ומתי זה סתם עמלות | comparison+how-to | F,R,S | leads | n | מאזניים מתנדנדים בין "חיסכון" ל"עמלות" | - | -
זוג מ{עיר} חסך {סכום} ₪ בפגישה אחת. ככה זה נראה | social-proof+story | F,R | leads | n | זוג ליד שולחן עושה "כיף", מסמכים פרושים | רק מקרה אמיתי ומתועד, בהסכמת הלקוחות. | -
25 או 30 שנה? השאלה שהרבה עונים עליה לא נכון | question+curiosity-gap | F,R,T | awareness | n | שני לוחות שנה מתהפכים זה מול זה | - | -
מה שלא תמיד מספרים לכם בפגישה הראשונה בבנק | insider-secret | F,R,S | trust | p | פגישה בבנק, היועצת לוחשת למצלמה מהצד | - | -
שכירות או משכנתא? עשינו את החשבון על דירה של 2 מיליון ₪ | comparison+statistic | F,R,S | awareness | n | מסך מפוצל: צרור מפתחות מול קבלה על שכר דירה | סימולציה להמחשה בלבד. | -
הריבית ירדה. מה זה אומר על המשכנתא שלכם? | question+callout | F,R,S | leads | p | גרף ריבית עם חץ שיורד, עיתון מתקפל על השולחן | רק אחרי החלטת ריבית אמיתית; להתאים ל"עלתה" או ל"ירדה" לפי החדשות. | -
""",
"event-venues": """
ככה נראית חתונה של 400 איש אצלנו | behind-the-scenes+social-proof | R,T,F | awareness | n | רחפן נכנס מעל רחבה מלאה, האורות נדלקים בדיוק על הביט | צילום מאירוע אמיתי רק בהסכמת הזוג. | *
3 שאלות שזוגות שוכחים לשאול בפגישה באולם – ומצטערים אחר כך | listicle+negative-warning | F,R,S | leads | n | זוג יושב מול חוזה, עט נעצר מעל קו החתימה | - | -
POV: אתם נכנסים לחופה, וכל האורחים קמים | pov | R,T | awareness | p | צילום מגב הזוג: שביל נרות, האורחים קמים משני הצדדים | - | -
מאולם ריק לחתונה מוכנה: 8 שעות הקמה בדקה אחת | satisfying-visual+behind-the-scenes | T,R,S | awareness | n | טיים-לאפס מלמעלה: אולם ריק מתמלא בשולחנות, מפות ופרחים | - | -
מחיר למנה בחתונה: מה באמת נכנס לתוך המספר? | price-reveal+insider-secret | F,R | leads | n | צלחת חגיגית מוגשת, ועליה תווית מחיר מטושטשת | המחיר רק לפי המחירון האמיתי. | -
""",
"ecommerce": """
נגמר לנו המלאי פעמיים החודש. הנה למה | social-proof+curiosity-gap | R,T,F | sales | n | מדף ריק, ואז ארגזים חדשים נפתחים | רק אם נכון. | *
אל תקנו את זה אם אתם לא אוהבים מחמאות | pattern-interrupt | R,T | sales | p | חשיפת מוצר בהילוך איטי בתאורה דרמטית | - | *
3 סיבות שבגללן לקוחות חוזרים אלינו (השנייה הפתיעה אותנו) | listicle+social-proof | R,F | trust | n | ביקורות קופצות על המסך אחת אחרי השנייה | רק ביקורות אמיתיות. | -
אורזים איתכם הזמנה ל{עיר} | behind-the-scenes+satisfying-visual | T,R,S | awareness | p | צילום מלמעלה של אריזה: נייר טישו, מדבקה, סרט | - | -
מבחן קיצון: זרקנו אותו מקומה שנייה | demonstration+challenge | T,R,S | sales | n | נפילה בהילוך איטי, המוצר פוגע ברצפה | - | -
POV: הזמנתם בבוקר, וזה כבר אצלכם בערב | pov | R,T,F | sales | p | פעמון בדלת, שליח מגיש חבילה | רק אם זמן המשלוח הזה מובטח באמת. | -
בחנויות: 349 ₪. אצלנו? חכו לסוף | price-reveal+curiosity-gap | R,T,F | sales | p | תווית מחיר בחנות נמחקת בקו | מחיר ההשוואה חייב להיות אמיתי ועדכני. | -
ביקורת אמיתית, לא ממומנת – ישר מהוואטסאפ | social-proof | R,F | trust | n | צילום מסך של שיחת וואטסאפ נגלל, הפרטים מטושטשים | רק ביקורת אמיתית, בהסכמת הלקוח. | -
ככה זה נראה אחרי 100 כביסות | demonstration+comparison | R,T,S | trust | n | פריט חדש מול פריט משומש, זה לצד זה | - | -
עשינו טעות בייצור – והלקוחות דווקא התאהבו | story+pattern-interrupt | R,T | awareness | n | המייסדת מחזיקה פריט פגום ומחייכת | - | -
הפסקתי לחפש מתנות לחג ברגע שגיליתי את זה | story+curiosity-gap | R,T,F | sales | n | ערימת שקיות מתנה נדחפת הצידה, ואז המוצר נחשף | - | -
""",
"car-dealers": """
40 אלף ק״מ על השעון. תראו מה מצאנו כשהרמנו את הרכב | curiosity-gap+demonstration | R,F,S | trust | p | הרכב עולה על מגבה, פנס מאיר את החלק התחתון | - | *
3 דברים לבדוק ברכב יד שנייה עוד לפני נסיעת המבחן | listicle | F,R,S | trust | n | יד בודקת עומק של צמיג, מוט שמן נשלף | - | *
תפסיקו לבחור רכב לפי הצבע. ברצינות | stop-doing | R,T | awareness | p | שורת רכבים צבעוניים, איש המכירות טופח על המצח | - | -
POV: יצאתם מהמגרש עם הרכב הראשון שלכם | pov | R,T | sales | p | ידיים על ההגה, מפתחות מתנדנדים, כביש פתוח | - | -
כמה באמת מקבלים על טרייד-אין? | price-reveal+insider-secret | F,R | leads | n | שני רכבים זה מול זה, מחשבון ביד | - | -
חשמלי או היברידי? עשינו חשבון על 3 שנים | comparison+statistic | F,R,S | awareness | n | מסך מפוצל: תקע טעינה מול אקדח דלק | החישוב חייב להתבסס על הנחות מפורטות. | -
הלקוח ניסה להוריד 10 אלף ₪. זה מה שקרה | story+curiosity-gap | R,T | awareness | m | לחיצת יד שקופאת באמצע | - | -
נכנס למגרש הבוקר: סיור של 30 שניות | behind-the-scenes+demonstration | R,F,S | sales | n | צילום גימבל סביב רכב מבריק | - | -
מיתוס: רכב שהגיע מליסינג הוא תמיד בחירה גרועה | myth-busting | F,R | trust | n | פתק "ליסינג = רע" נקרע | - | -
מה חשוב לכם יותר: קילומטראז׳ או שנתון? | question | F,R,T | engagement | p | תקריב של מד הקילומטרים, ואז של תווית שנת הייצור | - | -
רכב משפחתי עד 100 אלף ₪? אלה 3 האפשרויות | listicle+callout | F,R,S | leads | n | שלושה רכבים משפחתיים בשורה, מפתחות נזרקים לכל אחד מהם | מחירים רק לפי המלאי והמחירון בפועל. | -
""",
"auto-services": """
ככה ניקינו רכב אחרי חופש גדול עם 3 ילדים | before-after+satisfying-visual | R,T,S | awareness | n | דלת אחורית נפתחת: פירורים, כתמים וצעצועים על המושב, ואז קאט למושב נקי ומבריק | - | *
נדלקה לכם הנורה הזאת? אל תמשיכו לנסוע לפני שאתם צופים בזה | negative-warning+callout | F,R,T | leads | p | תקריב של לוח השעונים, נורה כתומה מהבהבת | - | -
טיפול 15 אלף: מה באמת חייבים להחליף, ומה סתם מוסיפים לחשבון | insider-secret+price-reveal | F,R,S | trust | n | חשבונית ארוכה על הדלפק, מרקר מסמן שורה אחת | - | -
ליטוש בשלושה שלבים. רק תסתכלו על ההשתקפות | satisfying-visual | T,R,S | awareness | p | מכונת פוליש עוברת על מכסה מנוע עמום, וההשתקפות מתחדדת | - | -
3 בדיקות של 5 דקות לפני נסיעה ארוכה בחג | listicle+how-to | F,R | trust | n | יד בודקת לחץ אוויר בצמיג, ואז מוט שמן נשלף | - | -
""",
"lawyers": """
פוטרתם? אל תחתמו על כלום לפני שאתם צופים בזה | negative-warning+callout | R,F,T | leads | p | מעטפה עם מכתב פיטורים על שולחן, יד מרחיקה את העט | - | *
חתמתם על חוזה שכירות? תבדקו את הסעיף הזה עכשיו | callout+curiosity-gap | R,F | trust | p | מרקר צהוב מסמן סעיף בחוזה, תקריב | - | -
מיתוס: צוואה זה רק לאנשים עשירים | myth-busting | F,R | trust | n | עורכת הדין קורעת דף שכתוב עליו "רק לעשירים" | - | *
השאלה שחוזרת אליי כל שבוע: מה קורה לדירה אחרי גירושים? | question | F,R,S | leads | n | טלפון על שולחן מציג הודעת וואטסאפ מטושטשת | - | -
סיפור אמיתי (בשינוי פרטים): הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪ | story | F,R | trust | n | בועת וואטסאפ מוגדלת על המסך, הפרטים מטושטשים | סיפור אמיתי בלבד, בלי פרטים מזהים ובשמירה על חיסיון. | -
הסכם ממון מול "אנחנו סומכים אחד על השני" | comparison | R,T | awareness | n | שתי טבעות על שולחן מול מסמך חתום | - | -
כמה עולה עורך דין לעסקת דירה? הנה הטווח האמיתי | price-reveal | F,R,S | leads | n | מחשבון על שולחן משרד, עורך הדין מקליד | - | -
קיבלתם מכתב התראה? השעון כבר מתקתק. 3 צעדים ראשונים | negative-warning+how-to | F,R | leads | p | מעטפה עם חותמת אדומה, צליל תקתוק של שעון | - | -
מה שלא מספרים לכם על הסכמי פשרה | insider-secret | R,F,S | trust | p | עורכת הדין סוגרת את דלת המשרד ומתקרבת למצלמה | - | -
POV: קניתם דירה על הנייר, והמסירה מתעכבת כבר שנה | pov+callout | R,T,F | leads | p | אתר בנייה ריק עם עגורן עומד, דפי לוח שנה עפים | - | -
""",
"accountants": """
עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך | callout+bold-claim | F,R | leads | p | ארנק פתוח, שטרות עפים ממנו בהילוך איטי | - | *
5 הוצאות מוכרות שהרבה עצמאים שוכחים לדרוש | listicle | F,R,S | leads | n | קבלות נופלות על שולחן, רואת החשבון תופסת אחת באוויר | - | -
פתחתם עסק? ההחלטה הראשונה מול רשות המסים יכולה לעלות לכם אלפי שקלים | negative-warning+callout | F,R | leads | p | מפתח מסתובב במנעול של חנות חדשה, ואז טופס רשמי על השולחן | - | -
תפסיקו לשמור קבלות בקופסת נעליים | stop-doing | R,T | awareness | p | קופסת נעליים מתהפכת, קבלות מתפזרות, טלפון סורק אחת מהן | - | *
קיבלתם מכתב ממס הכנסה? קודם כל, לנשום. הנה 3 צעדים | callout+how-to | F,R | leads | p | יד מחזיקה מעטפה רשמית שרועדת קלות | - | -
הטעות הכי יקרה שראיתי השנה (ולא, זה לא היה לקוח שלי) | story+negative-warning | F,R,S | trust | n | רואה החשבון מסובב מסך אל המצלמה, מספר אדום גדול | - | -
שכירים? יכול להיות שמגיע לכם החזר מס – ואתם בכלל לא יודעים | callout+curiosity-gap | F,R,T | leads | p | המחאה מחליקה לאט לתוך הפריים | - | -
דוח שנתי ב-60 שניות: מה זה, ולמה זה חשוב לכם | how-to | R,S | awareness | p | שעון עצר מתחיל לרוץ, רואת החשבון עומדת ליד לוח לבן | - | -
יום לפני הדדליין של הדוחות אצלנו במשרד | behind-the-scenes+day-in-life | R,T | awareness | n | ערימות תיקים, כוסות קפה, מחוגי שעון במהירות כפולה | - | -
דעה לא פופולרית: אל תבחרו רואה חשבון לפי המחיר | controversy | F,R | trust | p | רואה החשבון מסתובב בכיסא אל המצלמה | - | -
עוסק פטור? זה מה שמשתנה לכם השנה | callout | F,R,S | leads | p | תעודת עוסק פטור על השולחן, לוח שנה מתהפך לשנה הבאה | לוודא שהתקרות והכללים עדכניים לשנת המס הנוכחית. | -
""",
"insurance-agents": """
יכול להיות שאתם משלמים פעמיים על אותו ביטוח בריאות | negative-warning+bold-claim | F,R | leads | p | שתי פוליסות זהות נערמות זו על זו | - | *
מתי בפעם האחרונה בדקתם מה יש לכם ב"הר הביטוח"? | question+callout | F,R | leads | p | טלפון פתוח על אתר החיפוש, הסוכנת מצביעה על המסך | - | -
3 שאלות לפני שעושים ביטוח חיים למשכנתא | listicle | F,R,S | trust | n | מפתחות בית מונחים על פוליסה מקופלת | - | -
סיפור אמיתי: תאונה, אשפוז – ופוליסה שלא כיסתה את מה שחשבו | story | F,R | trust | n | מסדרון בית חולים, דף פוליסה ביד | רק מקרה אמיתי, בלי פרטים מזהים. | -
ביטוח רכב: "הכי זול" ו"הכי משתלם" זה לא אותו דבר | comparison | F,R,T | awareness | n | שני מפתחות רכב זה לצד זה | - | -
תפסיקו לחדש ביטוח אוטומטית בלי לבדוק | stop-doing | F,R | leads | p | מייל של חידוש, אצבע מרחפת מעל "אישור" | - | *
נזילה מהשכן מלמעלה – מי משלם? | question+curiosity-gap | F,R,T | leads | n | טיפות מים נוטפות מהתקרה לתוך דלי | - | -
עצמאים: אם לא תעבדו חודש – מי משלם את החשבונות? | callout+negative-warning | F,R | leads | p | כיסא משרדי ריק, חשבונות נערמים על השולחן | נוגע במצב כלכלי: בפרסום ממומן מנסחים בגוף שלישי ("מה קורה לעצמאי שלא עובד חודש?"). | -
יום בחיים של סוכן ביטוח (זה לא רק טפסים) | day-in-life | R,T | trust | m | הסוכן נוהג, ואז נכנס לבית של משפחה עם כוס קפה | - | -
בדקנו תיק ביטוחי של זוג צעיר ב-10 דקות. זה מה שמצאנו | demonstration+result-first | F,R,S | leads | n | טבלה גרפית עם שורות שמסומנות באדום | - | -
בדקתם כמה דמי ניהול אתם משלמים בפנסיה? | question | F,R,S | leads | p | דוח פנסיה שנתי, מרקר מקיף שורה אחת | - | -
""",
"interior-design": """
סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר | bold-claim+result-first | R,T,F | leads | n | חשיפה בעדשה רחבה, דחיפה איטית פנימה | - | *
3 טעויות תאורה שהורסות כל דירה חדשה | mistakes | R,T,S | trust | n | לחיצה על מתג: אור לבן וקר מתחלף לאור חם | - | *
תפסיקו לקנות שטיח קטן מדי | stop-doing | R,T | awareness | p | שטיח קטנטן בחדר ענק, המעצבת גוררת פנימה שטיח גדול | - | -
POV: קיבלתם מפתח לדירה ריקה. מאיפה בכלל מתחילים? | pov+question | R,T,F | leads | p | דירה לבנה וריקה, הד של צעדים | - | -
אותו חדר, 3 תקציבים: 5, 15 ו-40 אלף ₪ | comparison+price-reveal | R,T,S,F | leads | n | מסך מחולק לשלושה עם שלוש הדמיות | - | -
הדבר הראשון שאני בודקת כשאני נכנסת לדירה – וזה לא הקירות | curiosity-gap+insider-secret | R,T | trust | f | המעצבת מסיטה וילון ובוחנת את כיוון האור | - | -
לשדרג מטבח בדירה שכורה – בלי לשפץ ובלי לאבד את הפיקדון | before-after+how-to | R,T | awareness | n | יד מדביקה טפט נשלף על חזית של ארון | - | -
הטרנד שהגיע הזמן להיפרד ממנו | controversy | R,T | awareness | n | המעצב זורק כרית מהספה אל מחוץ לפריים | - | -
הדמיה מול מציאות: יצא כמו שתכננו? | comparison+social-proof | R,F,S | trust | n | הדמיה תלת-ממדית מתמזגת לצילום אמיתי מאותה זווית | - | -
איך בוחרים צבע לקיר – בפחות מ-30 שניות | how-to | R,S | awareness | n | דוגמאות צבע מודבקות בסלוטייפ על הקיר | - | -
""",
"event-photographers": """
הרגע הזה נמשך שנייה וחצי. כמעט פספסנו אותו | story+curiosity-gap | R,T | awareness | n | פריים שקפא על רגע מרגש, אפקט של הרצה לאחור | - | *
3 רגעים בחתונה שזוגות מצטערים שלא צולמו | listicle+negative-warning | R,F | leads | n | מונטאז׳ מהיר של רגעים קטנים בהילוך איטי | - | *
POV: אתם צלמי החתונה, 600 אורחים, והכלה פשוט נעלמה | pov | T,R | awareness | p | ריצה בין האורחים, המצלמה רועדת | - | -
איך יצא הצילום הזה? מאחורי הקלעים | behind-the-scenes | R,T,S | awareness | n | זום-אאוט מהתמונה הסופית אל סט מבולגן עם פנס של טלפון | - | -
תפסיקו לבקש "רק תמונות טבעיות". הנה למה | stop-doing+controversy | R,T | trust | p | זוג קפוא בפוזה מול זוג שצוחק בספונטניות | - | -
כמה עולה צלם חתונות ב-2026? ולמה הפער יכול להגיע לפי 3 | price-reveal | F,R | leads | n | שני תיקי מצלמה עם תוויות מחיר | - | -
אותו זוג, אותו מקום: טלפון מול צלם מקצועי | comparison+before-after | R,T,S | leads | n | מסך מפוצל, אותה תמונה בשתי רמות איכות | - | -
השעה הכי טובה לצילומי זוגיות בישראל? לא בצהריים | insider-secret+how-to | R,T | trust | n | אור של שעת הזהב מנצנץ מבעד לעצים | - | -
בת מצווה, 4 שעות, 2,300 תמונות. אלה נכנסו לאלבום | statistic+behind-the-scenes | R,F | awareness | n | גלילה מהירה בגריד של תמונות בתוכנת עריכה | צילום קטינים רק בהסכמת ההורים. | -
אמא של הכלה ראתה את האלבום. זו הייתה התגובה | social-proof+story | F,R | trust | f | אישה מדפדפת באלבום ומוחה דמעה | רק תגובה אמיתית, בהסכמה. | -
ככה גורמים גם למי ששונא מצלמות לחייך | how-to | R,T,S | trust | n | אדם מסתיר את הפנים בידיים, ואז פורץ בצחוק מול העדשה | - | -
""",
"djs-musicians": """
הרגע שבו כל האולם קם לרקוד | result-first+social-proof | R,T,F | awareness | n | רחבה חצי ריקה, דרופ, ותוך שנייה כולם קופצים עם ידיים למעלה | שירים מוקלטים בסרטון רק ברישיון. | *
POV: הדיג׳יי שם את השיר של סבתא – והרחבה מתפוצצת | pov | T,R | awareness | n | סבתא בשמלה חגיגית גוררת את הנכדים לרחבה | שירים מוקלטים בסרטון רק ברישיון. | -
3 שירים שאסור לשים בחתונה (השלישי יפתיע אתכם) | controversy+listicle | T,R,S | engagement | p | יד על המיקסר עוצרת את הפיידר באמצע שיר | - | -
פלייליסט מול דיג׳יי שקורא את הרחבה: אותו ערב, תוצאה אחרת | comparison | R,F | leads | n | מסך מפוצל: רמקול עם טלפון מחובר מול עמדת דיג׳יי מוארת | - | -
מאחורי העמדה: ככה נראית חתונה מהצד של הדיג׳יי | behind-the-scenes | R,T,S | trust | n | מצלמה מאחורי הדיג׳יי, מבט אל קהל רוקד ואורות מהבהבים | - | -
""",
"zimmers-boutique-hotels": """
ג׳קוזי מול הנוף הזה. בלי פילטר | bold-claim+satisfying-visual | R,T,F | sales | n | רחפן בדחיפה איטית אל ג׳קוזי בזריחה | - | *
POV: כיביתם את הטלפון לסופ״ש שלם | pov | R,T | awareness | p | טלפון נופל לסלסלת קש, ערסל מתנדנד | - | *
3 דברים לבדוק לפני שמזמינים צימר (את השלישי כמעט אף אחד לא בודק) | listicle+curiosity-gap | F,R | trust | n | יד פותחת לאט דלת עץ | - | -
כמה עולה סופ״ש זוגי אצלנו – כולל ארוחת בוקר? | price-reveal | F,R | sales | n | מגש ארוחת בוקר מונח על המיטה, תג המחיר מוסתר | - | -
מה קורה פה ב-6 בבוקר | behind-the-scenes+day-in-life | R,T | awareness | n | המארחת אופה לחם, ערפל מעל הגבעות | - | -
התמונות באתר מול המציאות. בדקנו | comparison+social-proof | R,F,T | trust | n | טלפון עם תמונת המודעה מורם מול הנוף האמיתי | - | -
הזוג הזה הגיע לסופ״ש אחד, וחזר עוד 4 פעמים באותה שנה | social-proof+story | F,R | trust | n | דפי ספר האורחים מתדפדפים | רק סיפור אמיתי. | -
נשארו 2 סופ״שים פנויים בחודש הבא | urgency-offer | F,R | sales | n | לוח שנה, שני תאריכים פנויים מהבהבים | רק אם נכון: הזמינות חייבת להתאים ליומן בפועל. | -
אל תבואו לפה אם אתם לא מוכנים לשקט אמיתי | pattern-interrupt | R,T | awareness | p | שוט סטטי של עמק, בלי מוזיקה, רק ציוץ ציפורים | - | -
חופשה עם ילדים שגם ההורים נחים בה? יש דבר כזה | callout+question | F,R | leads | n | ילדים בבריכה, הורים בערסל עם קפה | - | -
""",
"tourism-attractions": """
מה עושים בחול המועד עם ילדים? הנה רעיון | question+callout | F,R,T | leads | n | ילדים רצים לעבר שער כניסה צבעוני, ההורים מאחור עם צידנית | - | * s=passover
שעה מ{עיר}, ונראה כמו חו״ל | bold-claim+satisfying-visual | R,T,S | awareness | n | רחפן נחשף מעל צוק או מפל, נוף פתוח עד האופק | - | -
3 פינות ליד {עיר} שרוב המטיילים מפספסים | listicle+insider-secret | R,T,S | awareness | n | שביל צר נפתח אל נקודת תצפית מוסתרת | - | -
POV: הילדים שואלים "מה עושים היום?", והפעם יש לכם תשובה | pov | R,T,F | awareness | p | שלושה ילדים משועממים על ספה, ואז קאט לחיוך ענק במגלשת מים | - | -
כמה עולה יום כיף למשפחה של 5? עשינו את החשבון | price-reveal | F,R | sales | n | חמישה כרטיסי כניסה נפרשים כמו קלפים על שולחן | מחירים רק לפי המחירון האמיתי, כולל מע״מ. | -
""",
"courses-educators": """
עבדתי באקסל 10 שנים. זה הקיצור שהייתי רוצה לדעת ביום הראשון | story+insider-secret | R,T,S | leads | n | הקלטת מסך עם תקריב של מקלדת, קיצור נלחץ | - | *
תפסיקו לשנן מילים באנגלית. תעשו את זה במקום | stop-doing | R,T | leads | p | כרטיסיות עפות באוויר | - | -
3 טעויות שכל מי שמתחיל ללמוד פייתון עושה | mistakes | T,R,S | trust | n | קוד עם קווים אדומים מתחת לשגיאות | - | -
רוצים לעבור להייטק אחרי 35? תקשיבו רגע | callout | F,R | leads | p | אדם מול לפטופ במטבח בלילה, אור המסך על הפנים | גיל הוא מאפיין אישי: בפרסום ממומן לא פונים לפיו, ומנסחים בלי גיל. | -
שיעור של 60 שניות: איך כותבים פרומפט שבאמת עובד | how-to+demonstration | R,T,S | awareness | n | צ׳אט על המסך, הקלדה מהירה, התוצאה מופיעה | - | *
בוגרת הקורס קיבלה הצעת עבודה אחרי 5 שבועות. ככה | social-proof+story | F,R | leads | f | מייל עם הצעת עבודה בטלפון | רק מקרה אמיתי ובהסכמה; מוסיפים "התוצאות אישיות". | -
מיתוס: צריך להיות "טובים במתמטיקה" בשביל לתכנת | myth-busting | R,T,S | awareness | n | נוסחאות מתמטיות נמחקות מהלוח | - | -
כמה דקות ביום באמת צריך כדי ללמוד שפה חדשה? | question+statistic | R,T | awareness | n | טיימר מטבח על 15:00 | - | -
ההרשמה נסגרת ביום ראשון, ונשארו 12 מקומות | urgency-offer | F,R | sales | n | גרפיקה של כיסאות שמתמלאים אחד אחד | רק אם נכון: מועד הסגירה ומספר המקומות. | -
30 יום, 15 דקות ביום: לימדתי את עצמי לנגן בגיטרה | challenge+before-after | T,R,S | awareness | n | יום 1: אקורד צורם ← יום 30: שיר שלם | - | -
איך עליתי 100 נקודות בפסיכומטרי ב-3 חודשים | story+result-first | R,T,S | leads | n | דף ציונים מתהפך, ספרות רצות כלפי מעלה | רק סיפור אמיתי; מוסיפים "התוצאות אישיות". | -
""",
"therapists": """
מתעוררים עייפים גם אחרי 8 שעות שינה? אולי זה לא רק עייפות | callout+curiosity-gap | R,F | awareness | p | שעון מעורר מצלצל, אדם בוהה בתקרה | נוגע בבריאות הנפש: בפרסום ממומן מנסחים בגוף שלישי, בלי להניח את מצבו של הצופה. | -
3 משפטים שאנשים עם חרדה שומעים כל הזמן – ושלא באמת עוזרים | listicle | R,T,F | awareness | n | בועות דיבור צצות סביב דמות ונעלמות | נוגע בבריאות הנפש: לבדוק את הניסוח לפני פרסום ממומן. | *
מיתוס: טיפול זה רק למי ש"משהו לא בסדר" איתו | myth-busting | R,F,S | trust | n | חדר טיפול רגוע, שתי כורסאות, אור חלון רך | - | *
מה קורה בפגישה הראשונה? בלי מסתורין | how-to+behind-the-scenes | R,F | leads | n | מבט מגובה העיניים: נכנסים לחדר, הדלת נסגרת בעדינות | - | -
30 שניות של נשימה, לרגעים שהכול מרגיש יותר מדי | demonstration+how-to | R,T,S | awareness | n | עיגול נשימה מונפש מתרחב ומתכווץ | - | -
תפסיקו להגיד לעצמכם "אחרים עוברים דברים יותר קשים" | stop-doing | R,T | awareness | p | משפט בכתב יד נמחק בקו עדין | - | -
איך יודעים שזה המטפל המתאים? | question | F,R | trust | n | המטפלת יושבת באור חם, מבט ישיר אל המצלמה | - | -
POV: אמרתם בקול משהו שהחזקתם בפנים שנים | pov | R,T | awareness | p | כורסה ריקה, קרן אור שזזה לאט על הרצפה | - | -
עצב או דיכאון? ההבדל בשפה פשוטה | comparison | R,F,S | awareness | n | מסך מפוצל: חלון גשום מול חלון עם קרן שמש | מידע כללי ולא אבחנה; מומלץ לצרף שורת סיום עם קו סיוע. | -
מה מטפלים עושים כשקשה להם? | curiosity-gap+behind-the-scenes | R,T | trust | n | המטפל הולך לבד על חוף בשקיעה | - | -
אם אתם מרגישים שאתם רק שורדים – זה בשבילכם | callout | R,F | awareness | p | אדם יושב ברכב בחנייה רגע לפני שהוא יוצא, ולוקח נשימה עמוקה | נוגע בבריאות הנפש: מתאים לפרסום אורגני; בפרסום ממומן מנסחים בגוף שלישי. | -
""",
"vets-dog-grooming": """
הכלב שלכם עושה את זה? זה לא "סתם חמוד" | curiosity-gap+negative-warning | R,T,F | awareness | p | כלב גורר את הישבן על השטיח | - | *
3 מאכלים מהמטבח שמסוכנים לכלבים (השני נמצא כמעט בכל בית) | listicle | R,T,F,S | awareness | n | ענבים, שוקולד ובצל על השיש, כלב מרחרח | - | *
חצי שנה בלי מספריים ← כלב חדש | before-after+satisfying-visual | T,R,S | awareness | n | כלב עם פרווה סבוכה, ואז כלב רך ונקי שמתנער | - | -
POV: הכלב שלכם מבין שנכנסתם לחנייה של הווטרינר | pov | T,R | awareness | p | עיני הכלב נפתחות לרווחה במושב האחורי | - | -
תפסיקו לגזור ציפורניים בלי לבדוק את הנקודה הזאת | stop-doing+how-to | R,S | trust | p | תקריב של ציפורן, פנס מאיר את כלי הדם | - | -
ככה נראית בדיקה שנתית מבפנים | behind-the-scenes | R,F | trust | n | וטרינרית עם סטטוסקופ על כלב רגוע | - | -
מיתוס: אף חם = כלב חולה | myth-busting | R,T,S | awareness | n | יד נוגעת באף של כלב | - | -
שרב בחוץ? בדיקה של 5 שניות לפני שיוצאים לטיול | how-to+demonstration | R,T,F | awareness | n | כף יד על אספלט חם, טיימר של 5 שניות | - | s=summer
אמבטיה וייבוש לגולדן של 40 קילו | satisfying-visual | T,R,S | awareness | n | התנערות בהילוך איטי, טיפות מים מתפזרות | - | -
כל כמה זמן באמת צריך לקלח כלב? | question | R,T,F | leads | n | כלב בורח מהאמבטיה עם קצף על הגב | - | -
הכלב שלכם מפחד מזיקוקים? 3 טיפים לערב הזה | callout+how-to | R,F,T | awareness | p | כלב מסתתר מתחת למיטה, זיקוקים מרצדים בחלון | - | s=independence-day
""",
"driving-schools": """
5 טעויות שמכשילות בטסט, ואיך להימנע מהן | mistakes | T,R,S | trust | n | מראה צד בתקריב, ואז X אדום קופץ על המסך | - | *
POV: הבוחן נכנס לרכב, ואתם שוכחים איך מתניעים | pov | T,R | awareness | p | יד רועדת מעל המפתח, הבוחן מצמיד דף ללוח כתיבה | - | -
חנייה במקביל ב-3 צעדים. בלי לחץ | how-to | T,R,S | awareness | n | צילום רחפן מלמעלה: רכב נכנס בין שני רכבים חונים בתנועה חלקה | - | -
מיתוס: מי שנכשל בטסט הראשון ינהג פחות טוב | myth-busting | T,R | awareness | n | דף עם המילה "נכשל" מתקמט, ואז מפתחות רכב נזרקים אל כף יד | - | -
כמה שיעורים באמת צריך עד הטסט? | question | F,R,T | leads | n | מונה שיעורים גרפי רץ מעל לוח המחוונים | ממוצעים ואחוזי הצלחה רק לפי הנתונים האמיתיים של בית הספר. | -
""",
"kids-activities": """
ככה נראה יום בקייטנה שלנו | day-in-life | R,F,T | leads | n | טיים-לאפס של יום: אוטובוס מגיע, בריכה, יצירה, ריקוד סיום, הכול מצולם מהגב ומרחוק | צילום ילדים רק בהסכמת הורים; עדיף בלי פנים מזוהות. | * s=summer
3 שאלות שחובה לשאול לפני שרושמים ילד לגן | listicle | F,R | trust | n | יד קטנה ויד של מבוגר על הידית של שער גן צבעוני | - | s=registration-season
POV: הילד שלכם חוזר מהחוג ולא מפסיק לספר | pov | R,F,T | awareness | p | מושב אחורי ברכב, ידיים קטנות מתנופפות בהתרגשות, קסדת אופניים על הברכיים | צילום ילדים רק בהסכמת הורים. | -
ההרשמה לשנה הבאה נפתחה. נשארו {מספר} מקומות בקבוצה | urgency-offer | F,R,W | sales | n | לוח שיבוץ על הקיר, מגנטים צבעוניים מתמלאים אחד אחד | רק אם נכון: המספר חייב להתעדכן. | s=registration-season
מה הילדים באמת עושים פה בין 14:00 ל-17:00? | behind-the-scenes+curiosity-gap | F,R | trust | n | שעון קיר מראה 14:00, ואז מונטאז׳ מהיר של ידיים בפעילות: בצק, לגו, צבעים | - | -
""",
"home-services": """
המזגן מטפטף? אל תתקשרו לטכנאי לפני שתבדקו את זה | negative-warning+how-to | F,R,T | leads | p | טיפות מים נופלות מיחידת מזגן לתוך קערה, צליל טפטוף מוגבר | - | * s=summer
3 סימנים שהגיע הזמן להחליף את הדוד | listicle | F,R | leads | n | דוד חשמלי על הגג, פנס מאיר על כתם חלודה | - | -
כמה עולה להחליף לוח חשמל? מחיר אמיתי, בלי הפתעות | price-reveal | F,R,S | leads | n | דלת של לוח חשמל ישן נפתחת, חוטים מבולגנים | המחיר להמחשה; עבודות חשמל רק על ידי חשמלאי מוסמך. | -
סתימה בכיור? תפסיקו לשפוך לשם כימיקלים | stop-doing | R,T,F | awareness | p | יד שופכת חומר ניקוי לכיור, יד אחרת עוצרת אותה | - | -
נזילה שהשכנים חיפשו חודשיים – ומצאנו אותה בחצי שעה | story+result-first | F,R,T | trust | n | מצלמה תרמית סורקת קיר, כתם כחול מופיע על המסך | - | -
""",
"movers-storage": """
ככה אורזים מטבח בלי לשבור כלום | how-to | R,T,F | awareness | n | צלחות נעטפות בנייר ונכנסות לארגז בעמידה, בקצב מהיר | - | * s=summer
3 טעויות שעולות ביוקר ביום ההובלה | mistakes | F,R,S | trust | n | ארגז מתפרק באוויר, וכוסות נופלות בהילוך איטי | - | -
דירת 4 חדרים, קומה רביעית, בלי מעלית. הפעלנו סטופר | challenge+demonstration | T,R,S | awareness | n | סטופר מתחיל לרוץ, הצוות סוחב ספה בחדר מדרגות צר | - | -
כמה באמת עולה הובלה של דירת 3 חדרים? | price-reveal | F,R | leads | n | משאית הובלה פתוחה, מחשבון מונח על ארגז | המחיר להמחשה; רק מחירון אמיתי. | -
POV: יום לפני ההובלה, ושום דבר עוד לא ארוז | pov | R,T | leads | n | סלון מלא חפצים, ארגז אחד ריק ופתוח באמצע החדר | - | -
""",
"retail-stores": """
מתנה לחג ב-100 ₪ שנראית כמו מתנה של 500 | bold-claim | R,F,W | sales | n | יד מסירה נייר עטיפה בתנועה אחת וחושפת מתנה מהודרת | - | *
חדש על המדף השבוע – וזה לא יישאר פה הרבה זמן | urgency-offer+curiosity-gap | R,F,T | sales | n | יד מניחה פריט על מדף מואר, הפריטים סביבו נעלמים אחד אחד | רק אם נכון: המלאי באמת מוגבל. | -
פריט אחד, 3 לוקים: מהבוקר ועד הערב | how-to | R,T,S | awareness | n | אותה חולצה על קולב מתחלפת בשלושה קאטים מהירים לשלושה סטים שונים | - | -
ככה נבנה זר של יום שישי – מהדלי ועד העטיפה | satisfying-visual+behind-the-scenes | R,T,S | awareness | n | צילום מלמעלה: פרחים נשלפים מדליים ומסתדרים לזר בהאצה | - | -
בוחרים מסגרת למשקפיים? הכלל הפשוט לפי צורת הפנים | how-to | R,F,S | trust | n | שלוש מסגרות מונחות על מראה, יד בוחרת אחת | - | -
""",
"catering-chefs": """
ארוחת חג ל-20 איש, בלי לעמוד במטבח | bold-claim+result-first | F,R,W | sales | n | שולחן חג ארוך מתמלא במגשים בטיים-לאפס, הכיסאות עוד ריקים | הצהרת כשרות רק עם תעודה בתוקף. | *
ככה מקימים שולחן אירוח ל-80 איש תוך שעה | behind-the-scenes+satisfying-visual | R,T,S | awareness | n | טיים-לאפס מלמעלה: שולחן ריק מתמלא בקרשים, גבינות ופירות | - | -
שף פרטי בבית לערב זוגי – כמה זה באמת עולה? | price-reveal | R,F | leads | n | השף מניח צלחת מעוצבת מול זוג בסלון ביתי, תג מחיר מטושטש בפינה | המחיר להמחשה; רק מחירון אמיתי. | -
3 מנות שתמיד נגמרות ראשונות באירוע | listicle+social-proof | R,T,F | sales | n | מגש מתרוקן בהאצה, ידיים חוטפות את הביס האחרון | - | -
POV: האורחים כבר בדלת, והאוכל רק עכשיו נכנס לתנור | pov | R,T | awareness | n | צלצול בדלת, דלת התנור נפתחת על מגש עם בצק שעוד לא נאפה | - | -
""",
"b2b-startups": """
הצוות שלכם מאבד 6 שעות בשבוע על דוחות. עשינו את החשבון | statistic+callout | F,R,S | leads | p | שעון מסתובב מעל גיליונות אקסל | הנתון צריך מקור או סקר לקוחות מתועד. | *
תפסיקו לנהל מכירות באקסל | stop-doing | F,R | leads | p | קובץ אקסל נגרר אל הפח | - | *
דמו של 30 שניות: מעלים קובץ, יוצא דוח | demonstration | F,R,S,Y | sales | n | הקלטת מסך, הסמן גורר קובץ לחלון | - | -
סמנכ״ל הכספים שלנו ביקש שלא נעלה את הסרטון הזה | pattern-interrupt+curiosity-gap | R,T | awareness | n | מנהלת נכנסת לפריים ומכסה את העדשה ביד | - | -
מה {מספר} חברות למדו כשעברו לאוטומציה | social-proof | F,S | trust | n | קיר של לוגואים של לקוחות מתאסף | לוגואים ומספר הלקוחות רק באישור ולפי נתונים אמיתיים. | -
POV: יום ראשון בבוקר, 47 מיילים, ואף אחד לא יודע מה הסטטוס | pov | R,T | awareness | n | התראות מייל מציפות את המסך | - | -
3 שאלות לשאול כל ספק SaaS לפני שחותמים על שנה | listicle | F,S | trust | n | המייסד כותב "3" על לוח לבן | - | -
לקוח שלנו קיצר תהליך מ-14 ימים ל-2. זה מה שהשתנה | result-first+social-proof | F,R,S | leads | n | ציר זמן גרפי שמתכווץ | רק מקרה לקוח מתועד, באישור הלקוח. | -
דעה לא פופולרית: עוד דשבורד לא יפתור לכם את הבעיה | controversy | F,R | awareness | p | המייסדת סוגרת לפטופ מלא גרפים | - | -
ככה נראה ספרינט אצלנו מבפנים | behind-the-scenes | R,T,S | trust | n | קיר פתקים צבעוניים, סטנדאפ של הצוות | - | -
בנינו את המוצר הזה כי נמאס לנו מ{בעיה} | story | F,R,S,Y | awareness | n | המייסדת מוחקת בתנועה אחת תרשים מסובך מלוח לבן | - | -
""",
"nonprofits": """
ככה נראים {סכום} ₪ אחרי שהם מגיעים לשטח | result-first | F,R,W | sales | n | מעטפה נפתחת, ואז קאט לסל מזון מלא שמונח על שולחן במטבח | רק תיאור אמיתי של מה שהתרומה מממנת. | *
הוא הגיע אלינו בלי מקום לישון. זה הוא היום | story+before-after | F,R | trust | m | צללית של נער על ספסל בלילה, ואז אותו נער מחייך בבגדי עבודה ביום | רק סיפור אמיתי, בהסכמת המוטב ובשמירה על כבודו; בקטינים בהסכמת הורים או אפוטרופוס. | -
תורמים לפני סוף השנה? ככה מקבלים על זה זיכוי ממס | how-to | F,R | trust | p | קבלה על תרומה מונחת ליד מחשבון, יד מסמנת וי | רק לעמותה עם אישור סעיף 46 בתוקף; מנסחים בדיוק לפי האישור. | s=tax-year-end
מה באמת קורה עם הכסף שתרמתם? פתחנו את הספרים | behind-the-scenes+curiosity-gap | F,R,S | trust | p | קלסר דוחות נפתח, דפים מתהפכים, גרף עמודות פשוט מופיע | - | -
יום אחד עם המתנדבים שלנו, מ-6 בבוקר | day-in-life | R,F,T | awareness | n | שעון מעורר על 5:45, ואז קאט למחסן מזון שמתמלא בארגזים | - | -
""",
"local-politics": """
""",
"physio-nutrition": """
המאכל ה"בריא" שהורס לא מעט דיאטות | myth-busting+curiosity-gap | R,T,F | awareness | n | יד מושטת לחטיף גרנולה צבעוני, ונעצרת באוויר | - | *
התנוחה שרובנו יושבים בה מול המחשב – ומה היא עושה לגב | curiosity-gap+negative-warning | R,F,S | awareness | n | צילום פרופיל של אדם שקוע בכיסא מול מחשב, קו גרפי מסמן את עמוד השדרה | - | -
מיתוס: פחמימות בערב משמינות | myth-busting | R,T,S | awareness | n | צלחת פסטה ליד שעון שמראה 21:00, חותמת "מיתוס" נוחתת עליה | מידע כללי, לא תחליף לייעוץ תזונתי אישי. | -
3 תרגילים של 2 דקות לכל מי שיושב 8 שעות ביום | listicle+callout | R,F,S | awareness | n | טיימר של 2 דקות על המסך, אדם קם מכיסא משרדי ומתמתח | - | -
מה קורה בפגישה הראשונה אצל פיזיותרפיסט? בלי הפתעות | how-to+behind-the-scenes | F,R | leads | n | דלת קליניקה נפתחת, מיטת טיפולים וכדור פיזיו בפינה | - | -
""",
}

# Seasonal: season | text | types | platforms | goal | gender | visual | compliance | flags
SEASONAL_SRC = """
rosh-hashana | לפני שמרימים כוסית: מתנה לראש השנה שלא תגיע ישר לארון | curiosity-gap | R,F,W | sales | n | קופסת מתנה נפתחת, ובפנים רימון ודבש | - | *
sukkot | חול המועד מתקרב: 3 דברים לעשות ב{עיר} בלי פקקים ובלי תורים | listicle | R,T,F | awareness | n | סוכה מוארת בלילה, ואז כביש ריק בבוקר | - | -
hanukkah | 8 נרות, 8 הפתעות. הנר הראשון נדלק עכשיו | urgency-offer | R,T,F,W | sales | n | הנר הראשון נדלק בחנוכייה, המוצר או השירות ברקע | ההפתעות וההטבות חייבות להיות אמיתיות. | *
purim | התחפשנו ליום אחד לעסק אחר. זה מה שקרה | pattern-interrupt | T,R | awareness | n | הצוות בתחפושות של מקצוע אחר (למשל שף עם מספריים של ספר) | - | -
pre-passover | ניקיונות פסח: הטעות שגוזלת לכם שעתיים כל יום | negative-warning | R,F,T | awareness | p | ארון חומרי ניקוי עולה על גדותיו | - | -
independence-day | על האש: הנתח שכולם מזמינים וכמעט אף אחד לא יודע להכין | insider-secret | R,T,F,S | sales | n | להבה מתפרצת מהמנגל, דגל ישראל ברקע | טון מכבד: לא מפרסמים לפני צאת יום הזיכרון. | -
tu-beav | ט״ו באב: מתנה שאומרת "חשבתי עלייך" ולא "נזכרתי ברגע האחרון" | pattern-interrupt+callout | R,F | sales | f | יד מסתירה מתנה מאחורי הגב | - | -
back-to-school | ה-1 בספטמבר בעוד שבועיים. רשימת הקניות שחוסכת לכם {סכום} ₪ | listicle+statistic | F,R | sales | p | תיק גב מתרוקן על השולחן, ציוד מתפזר | - | -
summer | 10 שבועות של "משעמם לי" מתחילים עכשיו. הנה התוכנית | callout+how-to | F,R | leads | n | ילדים צונחים על הספה בבת אחת | - | -
black-friday | בלאק פריידיי: איך מזהים "מבצע" שהוא בעצם העלאת מחיר | insider-secret+negative-warning | R,T,F | trust | n | תווית מחיר מתהפכת וחושפת מאחוריה מחיר גבוה יותר | - | *
after-holidays | "אחרי החגים" הגיע. אז מאיפה באמת מתחילים? | callout+question | R,F,T | leads | n | פתק "אחרי החגים" נתלש מלוח שנה ונזרק לפח | - | *
singles-day | 11.11, יום הרווקים: 24 שעות של {הנחה} על כל האתר | urgency-offer | R,T,F | sales | n | שעון ספירה לאחור מ-24:00:00 מתחיל לרוץ מעל עגלת קניות | רק אם נכון: ההנחה, משך המבצע וכל התנאים. | -
new-year | ההחלטה לשנה החדשה שמחזיקה גם בפברואר | curiosity-gap | R,F,T | awareness | n | דף ינואר נתלש מלוח שנה וחושף את פברואר | - | -
family-day | יום המשפחה מתקרב: מתנה שכל המשפחה תיהנה ממנה | callout | R,F,W | sales | n | ידיים של שלושה דורות קושרות יחד סרט על קופסת מתנה | - | -
valentines | 14.2 בלי ורד אדום אחד ובלי מסעדה עמוסה. יש רעיון יותר טוב | pattern-interrupt+curiosity-gap | R,T | sales | n | יד מחזירה ורד אדום לדלי, ואז מרימה מעטפה | - | -
pre-passover | לפני פסח: 3 תיקונים בבית שעדיף לסגור עכשיו, ולא בערב החג | listicle+urgency-offer | F,R | leads | n | מגירה תקועה, ברז מטפטף ונורה שרופה מתחלפים בקאטים מהירים | - | -
shavuot | שבועות בדרך: עוגת הגבינה שנגמרת אצלנו ראשונה כל שנה | social-proof | R,F,T,W | sales | n | סכין חותכת עוגת גבינה גבוהה, פירור נופל בהילוך איטי | רק אם נכון. | -
tax-year-end | עד 31.12: 3 פעולות שעוד יכולות להוריד לכם את המס השנה | listicle+urgency-offer | F,R | leads | p | דף דצמבר בלוח שנה, הימים נמחקים אחד אחרי השני עד 31 | מידע כללי; לוודא את הכללים העדכניים לשנת המס. | -
"""

# Universal: text | types | platforms | goal | gender | visual | compliance | flags
UNIVERSAL_SRC = """
גרים ב{עיר} ומחפשים {שירות}? עצרו שנייה | callout | R,T,F | leads | p | שלט של העיר או נוף מוכר של {עיר}, ואז קאט לבעל העסק מול המצלמה | - | *
{מספר} טעויות שכמעט כל מי שמחפש {שירות} עושה | mistakes | R,T,S,F | trust | n | בעלת העסק מרימה {מספר} אצבעות, X אדום ראשון קופץ | - | -
כמה באמת עולה {שירות} ב{עיר}? בלי אותיות קטנות | price-reveal | R,F,S | leads | n | מחשבון או לוח עם מספר מטושטש, אצבע מתקרבת | המחיר רק לפי המחירון האמיתי. | *
תפסיקו {פעולה_שגויה}. תעשו את זה במקום | stop-doing | R,T,S | awareness | p | הפעולה השגויה מתבצעת, יד נכנסת לפריים ועוצרת אותה | - | -
POV: מצאתם סוף סוף {שירות} ב{עיר}, ועונים לכם בוואטסאפ תוך 5 דקות | pov | R,T,W | leads | p | טלפון רוטט, הודעת וואטסאפ נכנסת, חיוך של הקלה | זמן התגובה חייב להיות אמיתי. | -
ככה {קהל_יעד} חסכו {סכום} ₪ תוך {זמן} | result-first+social-proof | F,R | leads | n | הסכום {סכום} ₪ נבנה על המסך בספירה מהירה | רק מקרה אמיתי ומתועד. | -
מיתוס: {מיתוס}. האמת? | myth-busting | R,T,S | trust | n | המשפט {מיתוס} מופיע על המסך ונקרע לשניים | - | -
{שם_העסק} ב-30 שניות: מה אנחנו עושים, ולמי זה לא מתאים | pattern-interrupt+curiosity-gap | R,F,S,Y | awareness | n | הלוגו נכנס, ואז חותמת "לא לכולם" | - | *
לפני: {לפני}. אחרי {זמן}: {אחרי} | before-after | R,T,F | sales | n | מסך מפוצל עם מעבר ניגוב | בנישות רפואיות ובכושר לבדוק את ההגבלות על לפני ואחרי. | -
נשארו {מספר} מקומות ב{חודש} במחיר {מחיר} ₪ | urgency-offer | F,R | sales | n | לוח שנה עם משבצות שנסגרות אחת אחרי השנייה | רק אם נכון: מספר המקומות, החודש והמחיר. | -
"""

PH_RE = re.compile(r"\{([^{}]+)\}")


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------
def _parse_line(line, n_fields):
    parts = [p.strip() for p in line.split(" | ")]
    if len(parts) != n_fields:
        raise SystemExit(f"Bad source line ({len(parts)} fields, expected {n_fields}): {line}")
    return parts


def _parse_flags(flags):
    featured, season = False, None
    if flags != "-":
        for tok in flags.split():
            if tok == "*":
                featured = True
            elif tok.startswith("s="):
                season = tok[2:]
            else:
                raise SystemExit(f"Unknown flag token: {tok}")
    return featured, season


def _placeholders(text):
    out = []
    for m in PH_RE.findall(text):
        if m not in out:
            out.append(m)
    return out


def _make_hook(hid, niche_slug, text, types, plats, goal, gcode, visual, comp, featured, season):
    tlist = types.split("+")
    platforms = []
    for code in plats.split(","):
        code = code.strip()
        if code not in PLATFORM_CODES:
            raise SystemExit(f"{hid}: unknown platform code {code}")
        platforms.append(PLATFORM_CODES[code])
    platforms = [p for p in PLATFORMS if p in platforms]  # canonical order
    if gcode not in GENDER_CODES:
        raise SystemExit(f"{hid}: unknown gender code {gcode}")
    hook = {
        "id": hid,
        "niche_slug": niche_slug,
        "hook_type_slug": tlist[0],
        "text_he": text,
        "platforms": platforms,
        "goal": goal,
        "gender": GENDER_CODES[gcode],
        "visual_direction_he": visual,
        "placeholders": _placeholders(text),
        "season_slug": season,
        "compliance_note_he": None if comp == "-" else comp,
        "is_featured": featured,
    }
    meta = {"secondary_type": tlist[1] if len(tlist) > 1 else None, "extra_types": tlist[2:]}
    return hook, meta


def build_hooks():
    hooks, meta = [], {}
    niche_order = [n["slug"] for n in NICHES]
    for slug in niche_order:
        src = HOOKS_SRC.get(slug, "")
        lines = [l for l in src.strip().splitlines() if l.strip()]
        for i, line in enumerate(lines, 1):
            text, types, plats, goal, g, visual, comp, flags = _parse_line(line, 8)
            featured, season = _parse_flags(flags)
            h, m = _make_hook(f"{slug}-{i:02d}", slug, text, types, plats, goal, g, visual, comp, featured, season)
            hooks.append(h)
            meta[h["id"]] = m
    extra = set(HOOKS_SRC) - set(niche_order)
    if extra:
        raise SystemExit(f"HOOKS_SRC has unknown niches: {extra}")
    counters = {}
    for line in [l for l in SEASONAL_SRC.strip().splitlines() if l.strip()]:
        season, text, types, plats, goal, g, visual, comp, flags = _parse_line(line, 9)
        featured, s2 = _parse_flags(flags)
        counters[season] = counters.get(season, 0) + 1
        h, m = _make_hook(f"seasonal-{season}-{counters[season]:02d}", None, text, types, plats, goal, g,
                          visual, comp, featured, season)
        hooks.append(h)
        meta[h["id"]] = m
    for i, line in enumerate([l for l in UNIVERSAL_SRC.strip().splitlines() if l.strip()], 1):
        text, types, plats, goal, g, visual, comp, flags = _parse_line(line, 8)
        featured, season = _parse_flags(flags)
        h, m = _make_hook(f"universal-{i:02d}", None, text, types, plats, goal, g, visual, comp, featured, season)
        hooks.append(h)
        meta[h["id"]] = m
    return hooks, meta


def build_all():
    categories = [{"slug": s, "name_he": he, "name_en": en, "sort_order": (i + 1) * 10}
                  for i, (s, he, en) in enumerate(CATEGORIES)]
    niches = []
    for i, n in enumerate(NICHES):
        niches.append({
            "slug": n["slug"], "name_he": n["name_he"], "name_en": n["name_en"],
            "category_slug": n["category_slug"], "icon": n["icon"],
            "description_he": n["description_he"], "video_types_he": n["video_types_he"],
            "seasonal_angles_he": n["seasonal_angles_he"], "compliance_flag": n["compliance_flag"],
            "compliance_note_he": n["compliance_note_he"], "priority": n["priority"],
            "sort_order": (i + 1) * 10,
        })
    families = [{"slug": s, "name_he": he, "name_en": en, "description_he": d, "sort_order": (i + 1) * 10}
                for i, (s, he, en, d) in enumerate(FAMILIES)]
    hook_types = [{"slug": s, "name_he": he, "name_en": en, "family_slug": fam, "description_he": d,
                   "example_he": ex, "sort_order": i + 1}
                  for i, (s, he, en, fam, d, ex) in enumerate(HOOK_TYPES)]
    seasons = []
    for i, s in enumerate(SEASONS):
        seasons.append({
            "slug": s["slug"], "name_he": s["name_he"], "name_en": s["name_en"],
            "date_hint_he": s["date_hint_he"], "publish_window_he": s["publish_window_he"],
            "niche_slugs": s["niche_slugs"], "is_quiet_day": s["is_quiet_day"], "note_he": s["note_he"],
            "sort_order": (i + 1) * 10,
        })
    hooks, meta = build_hooks()
    return {
        "niche_categories": categories, "niches": niches, "hook_families": families,
        "hook_types": hook_types, "seasons": seasons, "hooks": hooks,
    }, meta


# ---------------------------------------------------------------------------
# Validation (runs on the JSON files as written to disk)
# ---------------------------------------------------------------------------
KEBAB = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
HOOK_ID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}$")
HEB = "\u05d0-\u05ea"
BANNED = ["האם ידעת", "אתה לא תאמין", "קחו את העסק", "פתרון חדשני", "בעולם של היום", "זה הזמן ל", "!!"]
PLURAL_WORDS = {"אתם", "לכם", "שלכם", "אתכם", "איתכם", "אותכם", "אצלכם", "עליכם", "בשבילכם", "מכם", "אליכם",
                "כתבו", "שמרו", "נחשו", "עצרו", "חכו", "שלחו", "גרים", "מחפשים", "רוצים", "פוחדים",
                "מצחצחים", "מתעוררים", "מגיעים", "תורמים", "בדקתם", "פוטרתם", "חתמתם", "קניתם"}
NOT_PLURAL_TAM = {"סתם", "כתם", "חתם"}

CANON_KEYS = {
    "niche_categories": ["slug", "name_he", "name_en", "sort_order"],
    "niches": ["slug", "name_he", "name_en", "category_slug", "icon", "description_he", "video_types_he",
               "seasonal_angles_he", "compliance_flag", "compliance_note_he", "priority", "sort_order"],
    "hook_types": ["slug", "name_he", "name_en", "family_slug", "description_he", "example_he", "sort_order"],
    "hooks": ["id", "niche_slug", "hook_type_slug", "text_he", "platforms", "goal", "gender",
              "visual_direction_he", "placeholders", "season_slug", "compliance_note_he", "is_featured"],
    "hook_families": ["slug", "name_he", "name_en", "description_he", "sort_order"],
    "seasons": ["slug", "name_he", "name_en", "date_hint_he", "publish_window_he", "niche_slugs",
                "is_quiet_day", "note_he", "sort_order"],
}


def _hebrew_text_issues(s):
    """Typography / style problems in a Hebrew string."""
    issues = []
    if "·" in s:
        issues.append("gender middle-dot (·)")
    if re.search(f"[{HEB}]/[{HEB}]", s):
        issues.append("slash gender form (x/y)")
    if "→" in s:
        issues.append("LTR arrow → (use ←)")
    if "  " in s or s != s.strip():
        issues.append("extra whitespace")
    for b in BANNED:
        if b in s:
            issues.append(f"banned phrase: {b}")
    if re.search(f"[{HEB}]'|'[{HEB}]", s):
        issues.append("ASCII apostrophe next to Hebrew (use geresh ׳)")
    for m in re.finditer(f'([{HEB}]+)"([{HEB}]+)', s):
        before, after = m.group(1), m.group(2)
        if len(before) >= 2 or len(after) == 1:
            issues.append(f"ASCII quote inside acronym {m.group(0)} (use gershayim ״)")
    if s.count('"') % 2:
        issues.append("unbalanced quotation marks")
    if "הכל" in re.findall(f"[{HEB}]+", s):
        issues.append("spelling: הכל -> הכול")
    return issues


def _plural_markers(text):
    """Heuristic: words that address the viewer in 2nd-person plural (prefixes ש/ו/ה/ב/ל/מ/כ stripped)."""
    words = re.findall(f"[{HEB}]+", text)
    hits = []
    for idx, w in enumerate(words):
        if idx and words[idx - 1] in ("הם", "שהם"):
            continue  # 3rd person ("אחרי שהם מגיעים")
        cands = {w}
        if len(w) > 3 and w[0] in "שוהבלמכ":
            cands.add(w[1:])
        if len(w) > 4 and w[0] in "שוהבלמכ" and w[1] in "שוהבלמכ":
            cands.add(w[2:])
        if cands & PLURAL_WORDS:
            hits.append(w)
        elif len(w) >= 5 and w.endswith("תם") and w not in NOT_PLURAL_TAM:
            hits.append(w)
        elif len(w) >= 4 and w.startswith("ת") and w.endswith("ו"):
            hits.append(w)
    return hits


def validate(data):
    errors, warnings = [], []

    def err(m):
        errors.append(m)

    def warn(m):
        warnings.append(m)

    for name, rows in data.items():
        for r in rows:
            if list(r.keys()) != CANON_KEYS[name]:
                err(f"{name}: keys {list(r.keys())} != canonical {CANON_KEYS[name]}")
                break

    def uniq(name, key):
        vals = [r[key] for r in data[name]]
        dup = {v for v in vals if vals.count(v) > 1}
        if dup:
            err(f"{name}: duplicate {key}: {sorted(dup)}")
        return set(vals)

    cat = uniq("niche_categories", "slug")
    nic = uniq("niches", "slug")
    fam = uniq("hook_families", "slug")
    typ = uniq("hook_types", "slug")
    sea = uniq("seasons", "slug")
    uniq("hooks", "id")
    texts = [h["text_he"] for h in data["hooks"]]
    dup_txt = {t for t in texts if texts.count(t) > 1}
    if dup_txt:
        err(f"hooks: duplicate text_he: {sorted(dup_txt)}")

    for name in ("niche_categories", "niches", "hook_families", "hook_types", "seasons"):
        for r in data[name]:
            if not KEBAB.match(r["slug"]):
                err(f"{name}: slug not kebab-case: {r['slug']}")
            for k, v in r.items():
                if k.endswith("_he") and isinstance(v, str):
                    for i in _hebrew_text_issues(v):
                        err(f"{name}/{r['slug']}.{k}: {i}")
                if k.endswith("_he") and isinstance(v, list):
                    for item in v:
                        for i in _hebrew_text_issues(item):
                            err(f"{name}/{r['slug']}.{k}: {i}: {item}")

    hooks_per_niche = {}
    for n in data["niches"]:
        if n["category_slug"] not in cat:
            err(f"niches/{n['slug']}: unknown category_slug {n['category_slug']}")
        if n["icon"] not in LUCIDE_ICONS:
            err(f"niches/{n['slug']}: icon not in verified lucide list: {n['icon']}")
        if n["compliance_flag"] not in COMPLIANCE_FLAGS:
            err(f"niches/{n['slug']}: bad compliance_flag {n['compliance_flag']}")
        if n["priority"] not in (1, 2, 3):
            err(f"niches/{n['slug']}: bad priority {n['priority']}")
        if n["compliance_flag"] != "none" and not n["compliance_note_he"]:
            err(f"niches/{n['slug']}: flag {n['compliance_flag']} needs compliance_note_he")
        if not isinstance(n["sort_order"], int):
            err(f"niches/{n['slug']}: sort_order must be int")
        sentences = [x for x in re.split(r"(?<=[.!?])\s+", n["description_he"].strip()) if x]
        if not 1 <= len(sentences) <= 3:
            warn(f"niches/{n['slug']}: description_he has {len(sentences)} sentences")
        hooks_per_niche[n["slug"]] = 0

    for t in data["hook_types"]:
        if t["family_slug"] not in fam:
            err(f"hook_types/{t['slug']}: unknown family_slug {t['family_slug']}")
    for f in data["hook_families"]:
        if not any(t["family_slug"] == f["slug"] for t in data["hook_types"]):
            err(f"hook_families/{f['slug']}: no hook types")

    for s in data["seasons"]:
        for ns in s["niche_slugs"]:
            if ns not in nic:
                err(f"seasons/{s['slug']}: unknown niche {ns}")
        if not isinstance(s["is_quiet_day"], bool):
            err(f"seasons/{s['slug']}: is_quiet_day must be bool")

    ph_keys = {p[0] for p in PLACEHOLDERS}
    for h in data["hooks"]:
        hid = h["id"]
        if not HOOK_ID.match(hid):
            err(f"hooks/{hid}: bad id format")
        if h["niche_slug"] is not None:
            if h["niche_slug"] not in nic:
                err(f"hooks/{hid}: unknown niche_slug {h['niche_slug']}")
            else:
                hooks_per_niche[h["niche_slug"]] += 1
                if not hid.startswith(h["niche_slug"] + "-"):
                    err(f"hooks/{hid}: id does not start with niche slug")
        if h["hook_type_slug"] not in typ:
            err(f"hooks/{hid}: unknown hook_type_slug {h['hook_type_slug']}")
        if not h["platforms"] or len(set(h["platforms"])) != len(h["platforms"]) \
                or not set(h["platforms"]) <= set(PLATFORMS):
            err(f"hooks/{hid}: bad platforms {h['platforms']}")
        if h["goal"] not in GOALS:
            err(f"hooks/{hid}: bad goal {h['goal']}")
        if h["gender"] not in GENDERS:
            err(f"hooks/{hid}: bad gender {h['gender']}")
        if h["season_slug"] is not None and h["season_slug"] not in sea:
            err(f"hooks/{hid}: unknown season_slug {h['season_slug']}")
        if hid.startswith("seasonal-") and (h["season_slug"] is None or h["niche_slug"] is not None):
            err(f"hooks/{hid}: seasonal hook needs season_slug and null niche_slug")
        if hid.startswith("universal-") and (h["season_slug"] is not None or h["niche_slug"] is not None):
            err(f"hooks/{hid}: universal hook must have null niche_slug and season_slug")
        if not isinstance(h["is_featured"], bool):
            err(f"hooks/{hid}: is_featured must be bool")
        found = _placeholders(h["text_he"])
        if found != h["placeholders"]:
            err(f"hooks/{hid}: placeholders {h['placeholders']} != text {found}")
        for p in found + _placeholders(h["visual_direction_he"]):
            if p not in ph_keys:
                err(f"hooks/{hid}: placeholder {{{p}}} not in dictionary")
        for p in _placeholders(h["visual_direction_he"]):
            if p not in found:
                warn(f"hooks/{hid}: visual uses {{{p}}} that the text does not")
        for k in ("text_he", "visual_direction_he", "compliance_note_he"):
            if h[k]:
                for i in _hebrew_text_issues(h[k]):
                    err(f"hooks/{hid}.{k}: {i}")
        if not h["text_he"] or not h["visual_direction_he"]:
            err(f"hooks/{hid}: empty text or visual")
        nwords = len(h["text_he"].split())
        if nwords > 16:
            warn(f"hooks/{hid}: {nwords} words (long for a hook)")
        markers = _plural_markers(h["text_he"])
        if h["gender"] == "neutral" and markers:
            warn(f"hooks/{hid}: gender=neutral but plural markers {markers}")
        if h["gender"] == "plural" and not markers:
            warn(f"hooks/{hid}: gender=plural but no plural markers found")

    for slug, cnt in hooks_per_niche.items():
        if cnt == 0 and slug != "local-politics":
            err(f"niches/{slug}: has no hooks")
        if slug == "local-politics" and cnt:
            err("niches/local-politics: must have no hooks (excluded at launch)")
    return errors, warnings


# ---------------------------------------------------------------------------
# Doc generation (fills <!-- AUTO:x --> regions in docs/03-hooks-library.md)
# ---------------------------------------------------------------------------
def _cell(s):
    return (s or "").replace("|", "\\|").replace("\n", " ")


def _plat(h):
    return ", ".join(PLATFORM_HE[p] for p in h["platforms"])


def _type_label(h, meta, tmap):
    m = meta[h["id"]]
    label = tmap[h["hook_type_slug"]]["name_he"]
    if m["secondary_type"]:
        label += " + " + tmap[m["secondary_type"]]["name_he"]
    return label


def _hook_cell(h):
    t = f"**{h['text_he']}**" if h["is_featured"] else h["text_he"]
    t += GENDER_MARK.get(h["gender"], "")
    if h["compliance_note_he"]:
        t += " [ציות]"
    return _cell(t)


def render(data, meta):
    tmap = {t["slug"]: t for t in data["hook_types"]}
    fmap = {f["slug"]: f for f in data["hook_families"]}
    cmap = {c["slug"]: c for c in data["niche_categories"]}
    smap = {s["slug"]: s for s in data["seasons"]}
    nmap = {n["slug"]: n for n in data["niches"]}
    hooks = data["hooks"]
    niche_hooks = [h for h in hooks if h["niche_slug"]]
    seasonal = [h for h in hooks if h["id"].startswith("seasonal-")]
    universal = [h for h in hooks if h["id"].startswith("universal-")]
    out = {}

    out["counts"] = (
        f"**בספרייה:** {len(data['niches'])} נישות ב-{len(data['niche_categories'])} קטגוריות · "
        f"{len(data['hook_types'])} סוגי הוקים ב-{len(data['hook_families'])} משפחות · "
        f"**{len(hooks)} הוקים**: {len(niche_hooks)} לפי נישה, {len(seasonal)} עונתיים ו-{len(universal)} אוניברסליים "
        f"({sum(h['is_featured'] for h in hooks)} מסומנים כמומלצים) · {len(data['seasons'])} מועדים בלוח השיווקי."
    )

    lines = ["| משפחה | `family_slug` | מה מאפיין אותה | הסוגים |", "|---|---|---|---|"]
    for f in data["hook_families"]:
        names = ", ".join(t["name_he"] for t in data["hook_types"] if t["family_slug"] == f["slug"])
        lines.append(f"| **{f['name_he']}** | `{f['slug']}` | {_cell(f['description_he'])} | {_cell(names)} |")
    out["families"] = "\n".join(lines)

    lines = ["| # | `slug` | שם | משפחה | תיאור | דוגמה |", "|---|---|---|---|---|---|"]
    for t in data["hook_types"]:
        lines.append(f"| {t['sort_order']} | `{t['slug']}` | **{_cell(t['name_he'])}** | {fmap[t['family_slug']]['name_he']} "
                     f"| {_cell(t['description_he'])} | {_cell(t['example_he'])} |")
    out["hook-types"] = "\n".join(lines)

    lines = ["| נישה | `slug` | דגל | הערת ציות |", "|---|---|---|---|"]
    for n in data["niches"]:
        lines.append(f"| {_cell(n['name_he'])} | `{n['slug']}` | `{n['compliance_flag']}` | {_cell(n['compliance_note_he']) or '—'} |")
    out["compliance-niches"] = "\n".join(lines)

    parts = []
    for c in data["niche_categories"]:
        cn = [n for n in data["niches"] if n["category_slug"] == c["slug"]]
        if not cn:
            continue
        parts.append(f"### {c['name_he']}\n")
        for n in cn:
            nh = [h for h in niche_hooks if h["niche_slug"] == n["slug"]]
            parts.append(f"#### {n['name_he']}\n")
            parts.append(f"`{n['slug']}` · עדיפות {PRIORITY_HE[n['priority']]} · דגל ציות: {FLAG_HE[n['compliance_flag']]} · {len(nh)} הוקים\n")
            parts.append(n["description_he"] + "\n")
            parts.append(f"- **סוגי סרטונים:** {' · '.join(n['video_types_he'])}")
            parts.append(f"- **זוויות עונתיות:** {' · '.join(n['seasonal_angles_he'])}")
            if n["compliance_note_he"]:
                parts.append(f"- **ציות לנישה:** {n['compliance_note_he']}")
            parts.append("")
            if not nh:
                parts.append("> אין הוקים לנישה הזו בספרייה. הנישה מוחרגת בהשקה (ראו §8).\n")
                continue
            parts.append("| # | הוק | סוג | פלטפורמות | מטרה | ויז׳ואל ב-3 שניות |")
            parts.append("|---|---|---|---|---|---|")
            notes = []
            for h in nh:
                num = h["id"].rsplit("-", 1)[1]
                season = f" ({smap[h['season_slug']]['name_he']})" if h["season_slug"] else ""
                parts.append(f"| {num} | {_hook_cell(h)}{_cell(season)} | {_cell(_type_label(h, meta, tmap))} | {_plat(h)} "
                             f"| {GOAL_HE[h['goal']]} | {_cell(h['visual_direction_he'])} |")
                if h["compliance_note_he"]:
                    notes.append(f"- **#{num}:** {h['compliance_note_he']}")
            parts.append("")
            if notes:
                parts.append("**הערות ציות:**\n")
                parts.extend(notes)
                parts.append("")
    out["library"] = "\n".join(parts).rstrip()

    lines = ["### הלוח השיווקי", "",
             "| מועד | `slug` | תאריך (משוער, לא אומת) | מתי לפרסם | נישות שנהנות | הערות |",
             "|---|---|---|---|---|---|"]
    for s in data["seasons"]:
        name = f"**{s['name_he']}** (יום שקט)" if s["is_quiet_day"] else s["name_he"]
        niches = " · ".join(nmap[x]["name_he"] for x in s["niche_slugs"]) or "—"
        lines.append(f"| {_cell(name)} | `{s['slug']}` | {_cell(s['date_hint_he'])} | {_cell(s['publish_window_he'])} "
                     f"| {_cell(niches)} | {_cell(s['note_he']) or '—'} |")
    lines += ["", "### הוקים עונתיים", "",
              "| # | מועד | הוק | סוג | פלטפורמות | מטרה | ויז׳ואל ב-3 שניות |",
              "|---|---|---|---|---|---|---|"]
    notes = []
    for i, h in enumerate(seasonal, 1):
        lines.append(f"| {i:02d} | {smap[h['season_slug']]['name_he']} | {_hook_cell(h)} | {_cell(_type_label(h, meta, tmap))} "
                     f"| {_plat(h)} | {GOAL_HE[h['goal']]} | {_cell(h['visual_direction_he'])} |")
        if h["compliance_note_he"]:
            notes.append(f"- **#{i:02d} (`{h['id']}`):** {h['compliance_note_he']}")
    if notes:
        lines += ["", "**הערות ציות:**", ""] + notes
    out["seasonal"] = "\n".join(lines)

    lines = ["### התבניות", "",
             "| # | תבנית | סוג | פלטפורמות | מטרה | placeholders | ויז׳ואל ב-3 שניות |",
             "|---|---|---|---|---|---|---|"]
    notes = []
    for h in universal:
        num = h["id"].rsplit("-", 1)[1]
        phs = ", ".join("{" + p + "}" for p in h["placeholders"])
        lines.append(f"| {num} | {_hook_cell(h)} | {_cell(_type_label(h, meta, tmap))} | {_plat(h)} | {GOAL_HE[h['goal']]} "
                     f"| {_cell(phs)} | {_cell(h['visual_direction_he'])} |")
        if h["compliance_note_he"]:
            notes.append(f"- **#{num}:** {h['compliance_note_he']}")
    if notes:
        lines += ["", "**הערות ציות:**", ""] + notes
    used = {}
    for h in hooks:
        for p in h["placeholders"]:
            used[p] = used.get(p, 0) + 1
    lines += ["", "### מילון placeholders", "",
              "| placeholder | משמעות | ערך לדוגמה | כלל דקדוק | הוקים שמשתמשים בו |",
              "|---|---|---|---|---|"]
    for key, meaning, example, rule in PLACEHOLDERS:
        n_used = used.get(key, 0)
        usage = str(n_used) if n_used else ("בתסריטים בלבד" if "בתסריטים" in meaning else "0 (שמור למחולל)")
        lines.append(f"| `{{{key}}}` | {_cell(meaning)} | {_cell(example)} | {_cell(rule)} | {usage} |")
    out["universal"] = "\n".join(lines)

    schema = {
        "name": "hooks_batch", "strict": True,
        "schema": {
            "type": "object", "additionalProperties": False, "required": ["hooks"],
            "properties": {"hooks": {"type": "array", "items": {
                "type": "object", "additionalProperties": False,
                "required": ["text_he", "hook_type_slug", "platforms", "goal", "gender",
                             "visual_direction_he", "placeholders", "season_slug", "compliance_note_he"],
                "properties": {
                    "text_he": {"type": "string"},
                    "hook_type_slug": {"type": "string", "enum": [t["slug"] for t in data["hook_types"]]},
                    "platforms": {"type": "array", "items": {"type": "string", "enum": PLATFORMS}},
                    "goal": {"type": "string", "enum": GOALS},
                    "gender": {"type": "string", "enum": GENDERS},
                    "visual_direction_he": {"type": "string"},
                    "placeholders": {"type": "array", "items": {"type": "string"}},
                    "season_slug": {"type": ["string", "null"]},
                    "compliance_note_he": {"type": ["string", "null"]},
                }}}},
        },
    }
    out["schema"] = ("<div dir=\"ltr\">\n\n```json\n" + json.dumps(schema, ensure_ascii=False, indent=2)
                     + "\n```\n\n</div>\n\nהשדות `id`, `niche_slug` ו-`is_featured` לא מגיעים מהמודל: השרת קובע אותם בזמן השמירה.")
    return out


def fill_doc(regions):
    if not DOC.exists():
        print(f"(doc not found, skipped: {DOC})")
        return
    text = DOC.read_text(encoding="utf-8")
    for key, body in regions.items():
        pat = re.compile(rf"(<!-- AUTO:{re.escape(key)} -->)(.*?)(<!-- /AUTO:{re.escape(key)} -->)", re.S)
        if not pat.search(text):
            raise SystemExit(f"doc is missing AUTO region: {key}")
        text = pat.sub(lambda m: m.group(1) + "\n" + body + "\n" + m.group(3), text)
    DOC.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
def main():
    check_only = "--check" in sys.argv
    if not check_only:
        data, meta = build_all()
        for name, rows in data.items():
            (SEED / f"{name}.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    data = {name: json.loads((SEED / f"{name}.json").read_text(encoding="utf-8")) for name in CANON_KEYS}
    errors, warnings = validate(data)
    if not check_only:
        _, meta = build_all()
        fill_doc(render(data, meta))
    hooks = data["hooks"]
    print(f"niche_categories={len(data['niche_categories'])} niches={len(data['niches'])} "
          f"hook_families={len(data['hook_families'])} hook_types={len(data['hook_types'])} "
          f"seasons={len(data['seasons'])} hooks={len(hooks)} "
          f"(niche={sum(1 for h in hooks if h['niche_slug'])}, "
          f"seasonal={sum(1 for h in hooks if h['id'].startswith('seasonal-'))}, "
          f"universal={sum(1 for h in hooks if h['id'].startswith('universal-'))}, "
          f"featured={sum(h['is_featured'] for h in hooks)})")
    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("ERROR", e)
    print(f"validation: {len(errors)} errors, {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
