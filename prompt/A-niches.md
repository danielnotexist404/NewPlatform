# נספח A — זרע הנישות

הנתונים הקנוניים של הנישות. הקבצים `seed/niche_categories.json` ו-`seed/niches.json` נמצאים במאגר. אם הם חסרים, צרו אותם **בדיוק** מבלוקי ה-JSON שבסוף הנספח. סקריפט ה-seed ‏(`pnpm db:seed`, ראו חלק 04) טוען אותם לטבלאות `niche_categories` ו-`niches` ומאמת אותם ב-Zod מול הצורות הקנוניות.

**סיכום:** 13 קטגוריות, 36 נישות. נישות בעדיפות 1 נכנסות להשקה (עמודי נישה, ספריית הוקים ותבניות). `local-politics` מוחרגת בהשקה ואין לה הוקים (ראו חלק 05, מדיניות תוכן פוליטי).

## A.1 טבלת הנישות

| # | slug | שם | קטגוריה | עדיפות | דגל ציות | הוקים בזרע |
|---|---|---|---|---|---|---|
| 1 | `real-estate` | נדל״ן: מתווכים ומשרדי תיווך | נדל״ן ובית | 1 (השקה) | `real_estate` | 10 |
| 2 | `real-estate-developers` | נדל״ן: יזמים ופרויקטים חדשים | נדל״ן ובית | 1 (השקה) | `real_estate` | 5 |
| 3 | `aesthetic-clinics` | קליניקות אסתטיקה וקוסמטיקה רפואית | יופי וטיפוח | 1 (השקה) | `medical` | 11 |
| 4 | `beauty-nails` | ציפורניים, גבות, ריסים ואיפור | יופי וטיפוח | 1 (השקה) | `none` | 10 |
| 5 | `barbers-salons` | מספרות וברברשופ | יופי וטיפוח | 1 (השקה) | `none` | 10 |
| 6 | `restaurants` | מסעדות, בתי קפה ומאפיות | אוכל ומסעדנות | 1 (השקה) | `other` | 11 |
| 7 | `fitness-trainers` | מאמני כושר וסטודיו לאימון | בריאות, כושר וטיפול | 1 (השקה) | `other` | 10 |
| 8 | `yoga-pilates` | יוגה ופילאטיס | בריאות, כושר וטיפול | 1 (השקה) | `other` | 10 |
| 9 | `renovation-contractors` | קבלני שיפוצים, מטבחים ונגרות | נדל״ן ובית | 1 (השקה) | `other` | 10 |
| 10 | `dentists` | רופאי שיניים ומרפאות שיניים | בריאות, כושר וטיפול | 1 (השקה) | `medical` | 11 |
| 11 | `mortgage-advisors` | יועצי משכנתאות | שירותים מקצועיים ופיננסים | 1 (השקה) | `financial` | 11 |
| 12 | `event-venues` | אולמות וגני אירועים | אירועים ושמחות | 1 (השקה) | `other` | 5 |
| 13 | `ecommerce` | חנויות אונליין ואיקומרס | מסחר וקמעונאות | 1 (השקה) | `other` | 11 |
| 14 | `car-dealers` | סוחרי רכב, מגרשים וליסינג | רכב ותחבורה | 1 (השקה) | `other` | 11 |
| 15 | `auto-services` | מוסכים, מכוני רכב ודיטיילינג | רכב ותחבורה | 2 (הרחבה) | `none` | 5 |
| 16 | `lawyers` | עורכי דין ומשרדי עורכי דין | שירותים מקצועיים ופיננסים | 2 (הרחבה) | `legal` | 10 |
| 17 | `accountants` | רואי חשבון ויועצי מס | שירותים מקצועיים ופיננסים | 2 (הרחבה) | `financial` | 11 |
| 18 | `insurance-agents` | סוכני ביטוח, פנסיה ופיננסים | שירותים מקצועיים ופיננסים | 2 (הרחבה) | `financial` | 11 |
| 19 | `interior-design` | אדריכלות ועיצוב פנים | נדל״ן ובית | 2 (הרחבה) | `none` | 10 |
| 20 | `event-photographers` | צלמי אירועים, משפחה ותדמית | אירועים ושמחות | 2 (הרחבה) | `other` | 11 |
| 21 | `djs-musicians` | DJ, להקות ומוזיקאים לאירועים | אירועים ושמחות | 2 (הרחבה) | `other` | 5 |
| 22 | `zimmers-boutique-hotels` | צימרים, מלונות בוטיק ווילות | תיירות ופנאי | 2 (הרחבה) | `none` | 10 |
| 23 | `tourism-attractions` | תיירות, אטרקציות וסיורים | תיירות ופנאי | 2 (הרחבה) | `none` | 5 |
| 24 | `courses-educators` | מורים פרטיים, קורסים ומאמנים עסקיים | חינוך, הדרכה וילדים | 2 (הרחבה) | `other` | 11 |
| 25 | `therapists` | מטפלים, פסיכולוגים וקואצ׳רים | בריאות, כושר וטיפול | 2 (הרחבה) | `medical` | 11 |
| 26 | `vets-dog-grooming` | וטרינרים, מספרות כלבים ופנסיונים | חיות מחמד | 2 (הרחבה) | `none` | 11 |
| 27 | `driving-schools` | בתי ספר לנהיגה ומורי נהיגה | רכב ותחבורה | 2 (הרחבה) | `other` | 5 |
| 28 | `kids-activities` | גנים, צהרונים, חוגים וקייטנות | חינוך, הדרכה וילדים | 2 (הרחבה) | `other` | 5 |
| 29 | `home-services` | בעלי מקצוע: חשמל, אינסטלציה ומיזוג | נדל״ן ובית | 2 (הרחבה) | `other` | 5 |
| 30 | `movers-storage` | הובלות ואחסון | נדל״ן ובית | 3 (בהמשך) | `none` | 5 |
| 31 | `retail-stores` | חנויות פיזיות: אופנה, אופטיקה, פרחים ויודאיקה | מסחר וקמעונאות | 3 (בהמשך) | `other` | 5 |
| 32 | `catering-chefs` | קייטרינג ושפים פרטיים | אוכל ומסעדנות | 3 (בהמשך) | `other` | 5 |
| 33 | `b2b-startups` | הייטק וסטארטאפים (B2B) | הייטק ו-B2B | 3 (בהמשך) | `other` | 11 |
| 34 | `nonprofits` | עמותות וארגונים חברתיים | קהילה וציבור | 3 (בהמשך) | `other` | 5 |
| 35 | `local-politics` | פוליטיקה ומועמדים | קהילה וציבור | 3 (בהמשך) | `political` | 0 |
| 36 | `physio-nutrition` | פיזיותרפיה, תזונה ורפואה משלימה | בריאות, כושר וטיפול | 3 (בהמשך) | `medical` | 5 |

## A.2 `niche_categories.json`

```json
[
  {
    "slug": "real-estate-home",
    "name_he": "נדל״ן ובית",
    "name_en": "Real estate & home",
    "sort_order": 10
  },
  {
    "slug": "beauty-grooming",
    "name_he": "יופי וטיפוח",
    "name_en": "Beauty & grooming",
    "sort_order": 20
  },
  {
    "slug": "health-wellness",
    "name_he": "בריאות, כושר וטיפול",
    "name_en": "Health, fitness & care",
    "sort_order": 30
  },
  {
    "slug": "food-hospitality",
    "name_he": "אוכל ומסעדנות",
    "name_en": "Food & dining",
    "sort_order": 40
  },
  {
    "slug": "events",
    "name_he": "אירועים ושמחות",
    "name_en": "Events & celebrations",
    "sort_order": 50
  },
  {
    "slug": "tourism-leisure",
    "name_he": "תיירות ופנאי",
    "name_en": "Tourism & leisure",
    "sort_order": 60
  },
  {
    "slug": "professional-finance",
    "name_he": "שירותים מקצועיים ופיננסים",
    "name_en": "Professional & financial services",
    "sort_order": 70
  },
  {
    "slug": "commerce",
    "name_he": "מסחר וקמעונאות",
    "name_en": "Commerce & retail",
    "sort_order": 80
  },
  {
    "slug": "automotive",
    "name_he": "רכב ותחבורה",
    "name_en": "Automotive",
    "sort_order": 90
  },
  {
    "slug": "education-kids",
    "name_he": "חינוך, הדרכה וילדים",
    "name_en": "Education & kids",
    "sort_order": 100
  },
  {
    "slug": "pets",
    "name_he": "חיות מחמד",
    "name_en": "Pets",
    "sort_order": 110
  },
  {
    "slug": "tech-b2b",
    "name_he": "הייטק ו-B2B",
    "name_en": "Tech & B2B",
    "sort_order": 120
  },
  {
    "slug": "community-public",
    "name_he": "קהילה וציבור",
    "name_en": "Community & public",
    "sort_order": 130
  }
]
```

## A.3 `niches.json`

```json
[
  {
    "slug": "real-estate",
    "name_he": "נדל״ן: מתווכים ומשרדי תיווך",
    "name_en": "Real estate agents & brokerages",
    "category_slug": "real-estate-home",
    "icon": "House",
    "description_he": "כל נכס צריך סרטון, ומתווך עם מותג אישי חזק זוכה ביותר בלעדיות. סרטונים קצרים מביאים פניות גם מקונים וגם ממוכרים.",
    "video_types_he": [
      "סיור בנכס",
      "מדריך שכונה",
      "מיתוג אישי למתווך",
      "\"נמכר!\"",
      "טיפים לקונים ולמוכרים"
    ],
    "seasonal_angles_he": [
      "קיץ: עונת המעברים",
      "לפני ה-1 בספטמבר: מעבר דירה לפני שנת הלימודים",
      "פסח: מתחילים בבית חדש",
      "החלטות הריבית של בנק ישראל"
    ],
    "compliance_flag": "real_estate",
    "compliance_note_he": "חוק המתווכים במקרקעין: לבדוק חובת שם ומספר רישיון בפרסום. מחירים בהוקים הם להמחשה, ואין להציג \"מחיר מבוקש\" כאילו הוא \"מחיר עסקה\".",
    "priority": 1,
    "sort_order": 10
  },
  {
    "slug": "real-estate-developers",
    "name_he": "נדל״ן: יזמים ופרויקטים חדשים",
    "name_en": "Real estate developers & new projects",
    "category_slug": "real-estate-home",
    "icon": "Building2",
    "description_he": "השקות של פרויקטים בשווי גבוה, והדמיות שמתאימות מאוד ל-AI. הסרטון מוכר את החלום עוד לפני שהבניין קיים.",
    "video_types_he": [
      "טיזר לפרויקט",
      "טיסת הדמיה",
      "סרטון לייפסטייל",
      "עדכון התקדמות בנייה",
      "סיור בדירה לדוגמה"
    ],
    "seasonal_angles_he": [
      "תערוכות נדל״ן",
      "תוכניות דיור ממשלתיות",
      "פתיחת שלב מכירות חדש"
    ],
    "compliance_flag": "real_estate",
    "compliance_note_he": "טענות מדויקות בלבד, ועל כל הדמיה כיתוב \"הדמיה בלבד\". תנאי תשלום, מועדי מסירה ומבצעים רק כפי שהם מופיעים בחוזה.",
    "priority": 1,
    "sort_order": 20
  },
  {
    "slug": "aesthetic-clinics",
    "name_he": "קליניקות אסתטיקה וקוסמטיקה רפואית",
    "name_en": "Aesthetic & cosmetic clinics",
    "category_slug": "beauty-grooming",
    "icon": "Sparkles",
    "description_he": "תחום ויזואלי שנשען על אמון, עם מבצעים תכופים. סרטון טוב מסביר טיפול, מפרק פחדים ומציג את הצוות.",
    "video_types_he": [
      "הסבר טיפול",
      "ניפוץ מיתוסים",
      "היכרות עם הצוות הרפואי",
      "שאלות ותשובות",
      "לפני ואחרי (בכפוף לכללים)"
    ],
    "seasonal_angles_he": [
      "לפני הקיץ: הסרת שיער",
      "ראש השנה ועונת החתונות",
      "בלאק פריידיי"
    ],
    "compliance_flag": "medical",
    "compliance_note_he": "כללי הפרסום של משרד הבריאות: הגבלות על המלצות, על הבטחת תוצאות ועל תמונות לפני ואחרי, ומספר רישיון בפרסום. אין להבטיח תוצאה או טיפול \"בלי כאב\".",
    "priority": 1,
    "sort_order": 30
  },
  {
    "slug": "beauty-nails",
    "name_he": "ציפורניים, גבות, ריסים ואיפור",
    "name_en": "Nails, brows, lashes & makeup",
    "category_slug": "beauty-grooming",
    "icon": "Brush",
    "description_he": "המון עסקים קטנים, ולקוחות שחיים באינסטגרם. תקריבים, מהפכים וטרנדים עונתיים ממלאים את היומן.",
    "video_types_he": [
      "מהפך בתקריב",
      "טרנדים וצבעי העונה",
      "מחירון",
      "\"מקום פנוי השבוע\"",
      "ASMR של עבודה"
    ],
    "seasonal_angles_he": [
      "לפני החגים",
      "עונת הכלות",
      "ולנטיינז וט״ו באב",
      "בלאק פריידיי"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 1,
    "sort_order": 40
  },
  {
    "slug": "barbers-salons",
    "name_he": "מספרות וברברשופ",
    "name_en": "Barbershops & hair salons",
    "category_slug": "beauty-grooming",
    "icon": "Scissors",
    "description_he": "מהפכים, טיים-לאפס והאישיות של הספר או הספרית. תוכן שבועי קבוע ממלא את היומן.",
    "video_types_he": [
      "לפני ואחרי",
      "טיים-לאפס של תספורת",
      "\"הקאט של השבוע\"",
      "טיפים לטיפוח",
      "מאחורי הקלעים במספרה"
    ],
    "seasonal_angles_he": [
      "חזרה ללימודים",
      "לפני החגים",
      "עונת החתונות"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 1,
    "sort_order": 50
  },
  {
    "slug": "restaurants",
    "name_he": "מסעדות, בתי קפה ומאפיות",
    "name_en": "Restaurants, cafés & bakeries",
    "category_slug": "food-hospitality",
    "icon": "UtensilsCrossed",
    "description_he": "אוכל הוא התוכן הוויזואלי ביותר ברשת. סרטונים קצרים ממלאים שולחנות, משיקים מנות ומקדמים אירועים.",
    "video_types_he": [
      "תקריבי מנות",
      "הסיפור של השף",
      "קידום תפריט",
      "מאחורי הקלעים במטבח",
      "אירועים וערבי נושא"
    ],
    "seasonal_angles_he": [
      "חגי תשרי",
      "תפריט לפסח",
      "שבועות: מאכלי חלב",
      "קיץ",
      "ולנטיינז"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "הצהרת כשרות רק עם תעודה בתוקף (חוק איסור הונאה בכשרות). דירוגים, מספר ביקורות ונתונים כמו \"400 מנות בשבוע\" רק אם הם אמיתיים.",
    "priority": 1,
    "sort_order": 60
  },
  {
    "slug": "fitness-trainers",
    "name_he": "מאמני כושר וסטודיו לאימון",
    "name_en": "Fitness trainers & gyms",
    "category_slug": "health-wellness",
    "icon": "Dumbbell",
    "description_he": "תוצאות, קהילה ושיעורים קבועים. סרטון קצר מוכיח מקצועיות ומביא מתאמנים חדשים לאימון ניסיון.",
    "video_types_he": [
      "קטעי אימון",
      "טיפים לתרגילים",
      "היכרות עם המאמן או המאמנת",
      "סיפורי מתאמנים",
      "מערכת שיעורים"
    ],
    "seasonal_angles_he": [
      "ינואר: החלטות לשנה החדשה",
      "לפני הקיץ",
      "\"אחרי החגים מתחילים\""
    ],
    "compliance_flag": "other",
    "compliance_note_he": "תמונות לפני ואחרי של ירידה במשקל מוגבלות בפרסום ממומן במטא ובטיקטוק. בטענות על תוצאות מוסיפים \"התוצאות משתנות מאדם לאדם\", ולא פונים לצופה בהנחה על מצבו הגופני.",
    "priority": 1,
    "sort_order": 70
  },
  {
    "slug": "yoga-pilates",
    "name_he": "יוגה ופילאטיס",
    "name_en": "Yoga & Pilates studios",
    "category_slug": "health-wellness",
    "icon": "PersonStanding",
    "description_he": "סטודיו שמוכר שקט, יציבה וקהילה. סרטונים רגועים ומדויקים ממלאים שיעורי ניסיון.",
    "video_types_he": [
      "תרגול קצר",
      "הסבר על השיטה",
      "האווירה בסטודיו",
      "השיעור הראשון",
      "מערכת שיעורים ושיעור ניסיון"
    ],
    "seasonal_angles_he": [
      "ינואר",
      "לפני הקיץ",
      "אחרי החגים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "זהירות בטענות בריאות (כאבי גב, יציבה): מנסחים כחוויה ולא כהבטחה, ובפרסום ממומן לא פונים לצופה בהנחה על מצבו הבריאותי.",
    "priority": 1,
    "sort_order": 80
  },
  {
    "slug": "renovation-contractors",
    "name_he": "קבלני שיפוצים, מטבחים ונגרות",
    "name_en": "Renovation contractors, kitchens & carpentry",
    "category_slug": "real-estate-home",
    "icon": "Hammer",
    "description_he": "פרויקטים ויזואליים ולידים בשווי גבוה. מהפך של חדר רחצה או של מטבח הוא אחד הסרטונים החזקים ברשת.",
    "video_types_he": [
      "לפני ואחרי",
      "סיור בפרויקט",
      "תהליך העבודה",
      "המלצות לקוחות",
      "הצעת מחיר בוואטסאפ"
    ],
    "seasonal_angles_he": [
      "לפני פסח: עומס השיפוצים",
      "אחרי הקיץ",
      "\"אחרי החגים\""
    ],
    "compliance_flag": "other",
    "compliance_note_he": "רישום ברשם הקבלנים כשהעבודה מחייבת זאת. מחירים בהוקים הם להמחשה, והמלצות לקוחות רק בהסכמה בכתב.",
    "priority": 1,
    "sort_order": 90
  },
  {
    "slug": "dentists",
    "name_he": "רופאי שיניים ומרפאות שיניים",
    "name_en": "Dentists & dental clinics",
    "category_slug": "health-wellness",
    "icon": "Smile",
    "description_he": "הסברים שמורידים פחד ומביאים פניות לטיפולים יקרים כמו שתלים ויישור שקוף.",
    "video_types_he": [
      "הסבר טיפול",
      "סיור במרפאה",
      "היכרות עם הצוות",
      "שאלות נפוצות",
      "טיפים להיגיינת הפה"
    ],
    "seasonal_angles_he": [
      "חזרה ללימודים: בדיקות לילדים",
      "סוף השנה: ניצול הטבות של קופת החולים"
    ],
    "compliance_flag": "medical",
    "compliance_note_he": "כללי הפרסום לרופאי שיניים דומים לכללים לרופאים: בלי הבטחת תוצאה ובלי \"ללא כאב\", ולפני ואחרי רק בכפוף לכללים. מחירים רק לפי המחירון האמיתי.",
    "priority": 1,
    "sort_order": 100
  },
  {
    "slug": "mortgage-advisors",
    "name_he": "יועצי משכנתאות",
    "name_en": "Mortgage advisors",
    "category_slug": "professional-finance",
    "icon": "Landmark",
    "description_he": "תחום חינוכי עם ערך לקוח גבוה. סרטונים שמסבירים ריבית, מסלולים ותמהיל בונים אמון ומביאים פגישות.",
    "video_types_he": [
      "הסברים",
      "עדכוני ריבית",
      "ניפוץ מיתוסים",
      "סיפורי לקוחות",
      "סימולציות"
    ],
    "seasonal_angles_he": [
      "החלטות הריבית של בנק ישראל",
      "תכנון לשנה החדשה",
      "עונת המעברים בקיץ"
    ],
    "compliance_flag": "financial",
    "compliance_note_he": "בלי הבטחות לחיסכון או לריבית. דיסקליימר חובה: \"אין באמור ייעוץ פיננסי. סימולציה להמחשה בלבד\". סכומי חיסכון רק ממקרים אמיתיים ומתועדים.",
    "priority": 1,
    "sort_order": 110
  },
  {
    "slug": "event-venues",
    "name_he": "אולמות וגני אירועים",
    "name_en": "Event halls & venues",
    "category_slug": "events",
    "icon": "PartyPopper",
    "description_he": "סיורים באולם ורגעים אמיתיים מחתונות מוכרים תאריכים בעונת השמחות.",
    "video_types_he": [
      "סיור באולם",
      "רגעים מחתונה אמיתית",
      "הצגת התפריט",
      "מאחורי הקלעים בהקמה",
      "תאריכים פנויים"
    ],
    "seasonal_angles_he": [
      "עונת החתונות (אביב עד סתיו)",
      "אירוסים אחרי החגים",
      "ל״ג בעומר: חזרת החתונות לזוגות דתיים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "צילום מאירועים אמיתיים רק בהסכמת הזוג והאורחים המזוהים. תאריכים פנויים ומחירים רק אם הם אמיתיים.",
    "priority": 1,
    "sort_order": 120
  },
  {
    "slug": "ecommerce",
    "name_he": "חנויות אונליין ואיקומרס",
    "name_en": "Online stores & e-commerce",
    "category_slug": "commerce",
    "icon": "ShoppingCart",
    "description_he": "מודעות מוצר, תוכן גולשים ונפח גבוה של סרטונים. לכל מוצר כדאי כמה הוקים שונים לבדיקה.",
    "video_types_he": [
      "הדגמת מוצר",
      "סרטון UGC",
      "אנבוקסינג",
      "מבצע",
      "ביקורות לקוחות"
    ],
    "seasonal_angles_he": [
      "בלאק פריידיי וסייבר מאנדיי",
      "11.11",
      "מתנות לחגים",
      "חזרה ללימודים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "הצגת מחיר והנחה לפי חוק הגנת הצרכן: מחיר כולל מע״מ, ו\"מחיר קודם\" רק אם הוא אמיתי. זמני משלוח, מלאי וביקורות רק אם הם אמיתיים.",
    "priority": 1,
    "sort_order": 130
  },
  {
    "slug": "car-dealers",
    "name_he": "סוחרי רכב, מגרשים וליסינג",
    "name_en": "Car dealers & leasing",
    "category_slug": "automotive",
    "icon": "Car",
    "description_he": "כל רכב צריך סרטון, ויש הרבה רכבים. סיורים קצרים והצעות מימון מביאים נסיעות מבחן.",
    "video_types_he": [
      "סיור ברכב",
      "הצעת מימון",
      "\"הרכב של השבוע\"",
      "השוואות",
      "טיפים לקונים"
    ],
    "seasonal_angles_he": [
      "דגמי סוף שנה",
      "ינואר: רכב חדש",
      "קיץ: חופשה משפחתית"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "פרטי מחיר ומימון לפי כללי הגילוי (ריבית, מקדמה, תשלום אחרון). קילומטראז׳, יד ומקור הרכב רק כפי שהם באמת.",
    "priority": 1,
    "sort_order": 140
  },
  {
    "slug": "auto-services",
    "name_he": "מוסכים, מכוני רכב ודיטיילינג",
    "name_en": "Garages, car care & detailing",
    "category_slug": "automotive",
    "icon": "Wrench",
    "description_he": "מהפכי ניקוי ודיטיילינג הם תוכן ממכר, וטיפים לנהגים בונים אמון במוסך.",
    "video_types_he": [
      "מהפך ניקוי",
      "טיפים לתחזוקה",
      "מאחורי הקלעים במוסך",
      "הסבר על תקלה",
      "מחירון שירותים"
    ],
    "seasonal_angles_he": [
      "לפני הנסיעות של החגים",
      "הכנה לחורף",
      "אחרי החופש הגדול"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 2,
    "sort_order": 150
  },
  {
    "slug": "lawyers",
    "name_he": "עורכי דין ומשרדי עורכי דין",
    "name_en": "Lawyers & law firms",
    "category_slug": "professional-finance",
    "icon": "Scale",
    "description_he": "סמכות מקצועית והסברים פשוטים לשאלות מסובכות. סרטון קצר הופך עורך דין למומחה שסומכים עליו. מתאים גם ללינקדאין.",
    "video_types_he": [
      "הסבר של מומחה",
      "שאלות נפוצות",
      "\"זכויות שלא ידעתם\"",
      "סיפור מקרה בשינוי פרטים",
      "סרטון ללינקדאין"
    ],
    "seasonal_angles_he": [
      "סוף שנת המס",
      "שינויי חקיקה ופסיקה חדשה"
    ],
    "compliance_flag": "legal",
    "compliance_note_he": "כללי לשכת עורכי הדין (פרסומת), התשס״א-2000: פרסום מכובד, בלי הבטחת תוצאות, בלי \"הכי טוב\" ובלי השוואות. מוסיפים \"המידע כללי ואינו מהווה ייעוץ משפטי\".",
    "priority": 2,
    "sort_order": 160
  },
  {
    "slug": "accountants",
    "name_he": "רואי חשבון ויועצי מס",
    "name_en": "Accountants & tax advisors",
    "category_slug": "professional-finance",
    "icon": "Calculator",
    "description_he": "הסברים עונתיים על מס, דוחות ומועדים. עצמאים ושכירים מחפשים תשובות פשוטות, ומי שמסביר טוב מקבל את הפנייה.",
    "video_types_he": [
      "טיפים למס",
      "תזכורות למועדים",
      "הסבר על שינויי חקיקה",
      "שאלות נפוצות",
      "מאחורי הקלעים במשרד"
    ],
    "seasonal_angles_he": [
      "עונת הדוחות השנתיים",
      "שינויים במע״מ ובחשבוניות ישראל",
      "סוף שנת המס",
      "ינואר"
    ],
    "compliance_flag": "financial",
    "compliance_note_he": "מידע כללי בלבד, וכללי המס משתנים: לא מצטטים תקרות, שיעורים או מועדים בלי לוודא שהם עדכניים לשנה הנוכחית.",
    "priority": 2,
    "sort_order": 170
  },
  {
    "slug": "insurance-agents",
    "name_he": "סוכני ביטוח, פנסיה ופיננסים",
    "name_en": "Insurance & pension agents",
    "category_slug": "professional-finance",
    "icon": "Umbrella",
    "description_he": "תחום של הסברה ואמון. סרטונים קצרים והצעה ל\"בדיקת תיק\" מביאים פגישות.",
    "video_types_he": [
      "הסברים",
      "הצעה לבדיקת תיק",
      "סיפורי מקרה",
      "השוואות",
      "שאלות נפוצות"
    ],
    "seasonal_angles_he": [
      "הפקדות לפנסיה בסוף השנה",
      "ינואר",
      "חידוש ביטוח הרכב"
    ],
    "compliance_flag": "financial",
    "compliance_note_he": "פיקוח של רשות שוק ההון: דיסקליימר חובה ובלי הבטחת תשואה. בפרסום ממומן לא פונים לצופה בהנחה על מצבו הכלכלי או הבריאותי (מדיניות personal attributes של מטא).",
    "priority": 2,
    "sort_order": 180
  },
  {
    "slug": "interior-design",
    "name_he": "אדריכלות ועיצוב פנים",
    "name_en": "Architects & interior designers",
    "category_slug": "real-estate-home",
    "icon": "Sofa",
    "description_he": "תיק עבודות והדמיות שמתאימים מאוד ל-AI. מהפך של חדר בסרטון קצר מוכר את הסגנון.",
    "video_types_he": [
      "חשיפת פרויקט",
      "טיפים לעיצוב",
      "הדמיה מול מציאות",
      "השראה ואווירה",
      "לפני ואחרי"
    ],
    "seasonal_angles_he": [
      "לפני פסח",
      "עונת המסירות של דירות חדשות"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 2,
    "sort_order": 190
  },
  {
    "slug": "event-photographers",
    "name_he": "צלמי אירועים, משפחה ותדמית",
    "name_en": "Event & family photographers",
    "category_slug": "events",
    "icon": "Camera",
    "description_he": "תיק עבודות חי. רגעים אמיתיים ומאחורי הקלעים מוכרים צלם יותר מכל מחירון.",
    "video_types_he": [
      "רגעים נבחרים מאירוע",
      "מאחורי הקלעים",
      "השוואות",
      "טיפים לזוגות",
      "הצעה עונתית"
    ],
    "seasonal_angles_he": [
      "עונת החתונות",
      "בר ובת מצווה",
      "צילומי משפחה לפני החגים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "תמונות וסרטונים של לקוחות רק בהסכמת המצולמים, ובקטינים (בר ובת מצווה) בהסכמת ההורים.",
    "priority": 2,
    "sort_order": 200
  },
  {
    "slug": "djs-musicians",
    "name_he": "DJ, להקות ומוזיקאים לאירועים",
    "name_en": "DJs, bands & event musicians",
    "category_slug": "events",
    "icon": "Music",
    "description_he": "אנרגיה והוכחה מהשטח. רחבה מלאה בעשר שניות שווה יותר מכל הבטחה.",
    "video_types_he": [
      "רגעי שיא מאירוע",
      "טיזר לסט",
      "מאחורי העמדה",
      "שירים מבוקשים",
      "המלצות זוגות"
    ],
    "seasonal_angles_he": [
      "עונת החתונות",
      "פורים",
      "סילבסטר"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "שימוש בשירים מוקלטים בסרטון מחייב רישיון, או מוזיקה מורשית מספריית הפלטפורמה. צילום אורחים מזוהים רק בהסכמתם.",
    "priority": 2,
    "sort_order": 210
  },
  {
    "slug": "zimmers-boutique-hotels",
    "name_he": "צימרים, מלונות בוטיק ווילות",
    "name_en": "Zimmers, boutique hotels & villas",
    "category_slug": "tourism-leisure",
    "icon": "BedDouble",
    "description_he": "בריחה ויזואלית מהשגרה. נוף, ג׳קוזי ושקט ממלאים סופי שבוע.",
    "video_types_he": [
      "סיור במתחם",
      "חופשה זוגית",
      "דיל לסוף שבוע",
      "מאחורי הקלעים",
      "המלצות אורחים"
    ],
    "seasonal_angles_he": [
      "קיץ",
      "חגים וחול המועד",
      "ט״ו באב",
      "חורף: ג׳קוזי ואח"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 2,
    "sort_order": 220
  },
  {
    "slug": "tourism-attractions",
    "name_he": "תיירות, אטרקציות וסיורים",
    "name_en": "Tourism, attractions & tours",
    "category_slug": "tourism-leisure",
    "icon": "Compass",
    "description_he": "חוויות שמוכרות את עצמן בווידאו. טיזר קצר הופך את השאלה \"מה עושים היום?\" להזמנה.",
    "video_types_he": [
      "טיזר לחוויה",
      "יום כיף למשפחה",
      "המסלול בדקה",
      "המלצות מבקרים",
      "מבצע לחגים"
    ],
    "seasonal_angles_he": [
      "החופש הגדול",
      "חול המועד סוכות ופסח",
      "חנוכה"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 2,
    "sort_order": 230
  },
  {
    "slug": "courses-educators",
    "name_he": "מורים פרטיים, קורסים ומאמנים עסקיים",
    "name_en": "Tutors, courses & business coaches",
    "category_slug": "education-kids",
    "icon": "GraduationCap",
    "description_he": "מותג אישי וידע שאפשר לטעום ממנו. שיעור של 60 שניות הוא הפרסומת הטובה ביותר לקורס.",
    "video_types_he": [
      "טיפ מקצועי",
      "פרומו לקורס",
      "שיעור קצר",
      "סיפורי בוגרים",
      "הזמנה לוובינר"
    ],
    "seasonal_angles_he": [
      "חזרה ללימודים",
      "תקופת הבגרויות והפסיכומטרי",
      "ינואר"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "טענות על תוצאות, עבודה או הכנסה רק אם הן אמיתיות, ועם \"התוצאות אישיות\". \"נשארו X מקומות\" רק אם זה נכון. גיל הוא מאפיין אישי, ולכן לא פונים לפיו בפרסום ממומן.",
    "priority": 2,
    "sort_order": 240
  },
  {
    "slug": "therapists",
    "name_he": "מטפלים, פסיכולוגים וקואצ׳רים",
    "name_en": "Therapists, psychologists & coaches",
    "category_slug": "health-wellness",
    "icon": "HeartHandshake",
    "description_he": "אמון והפחתת סטיגמה. הסברים רכים עוזרים לאנשים להבין מתי ואיך פונים לטיפול.",
    "video_types_he": [
      "הסברים רכים",
      "\"מתי לפנות לטיפול\"",
      "מה קורה בפגישה הראשונה",
      "תרגילי נשימה והרגעה",
      "היכרות עם המטפל או המטפלת"
    ],
    "seasonal_angles_he": [
      "הלחץ שאחרי החגים",
      "חזרה ללימודים"
    ],
    "compliance_flag": "medical",
    "compliance_note_he": "חוק הפסיכולוגים וכללי האתיקה: בלי המלצות של מטופלים ובלי הבטחת תוצאות. בפרסום ממומן מנסחים בגוף שלישי, בלי להניח את מצבו הנפשי של הצופה. אפשר להוסיף שורת סיום: \"במצב מצוקה: ער״ן 1201\".",
    "priority": 2,
    "sort_order": 250
  },
  {
    "slug": "vets-dog-grooming",
    "name_he": "וטרינרים, מספרות כלבים ופנסיונים",
    "name_en": "Vets, dog grooming & boarding",
    "category_slug": "pets",
    "icon": "PawPrint",
    "description_he": "חיות מחמד הן תוכן ויראלי. מהפכי טיפוח וטיפים לבעלים מביאים לקוחות קבועים.",
    "video_types_he": [
      "לפני ואחרי טיפוח",
      "טיפים לבעלי כלבים",
      "מאחורי הקלעים בקליניקה",
      "שאלות נפוצות",
      "פנסיון לחופשות"
    ],
    "seasonal_angles_he": [
      "קיץ: חום ושרב",
      "זיקוקים ורעש בחגים",
      "חופשות: פנסיון לכלבים"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 2,
    "sort_order": 260
  },
  {
    "slug": "driving-schools",
    "name_he": "בתי ספר לנהיגה ומורי נהיגה",
    "name_en": "Driving schools & instructors",
    "category_slug": "automotive",
    "icon": "TrafficCone",
    "description_he": "קהל צעיר שחי בטיקטוק. טיפים, הומור של יום הטסט ואחוזי הצלחה מביאים תלמידים.",
    "video_types_he": [
      "טיפים לטסט",
      "הומור מהשיעורים",
      "\"עבר טסט!\"",
      "הסבר על תמרונים",
      "שאלות נפוצות"
    ],
    "seasonal_angles_he": [
      "קיץ: בני 17 מתחילים ללמוד",
      "חזרה ללימודים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "רוב התלמידים קטינים: מצלמים רק בהסכמת הורים. אחוזי הצלחה בטסט רק לפי נתונים אמיתיים.",
    "priority": 2,
    "sort_order": 270
  },
  {
    "slug": "kids-activities",
    "name_he": "גנים, צהרונים, חוגים וקייטנות",
    "name_en": "Kindergartens, after-school & camps",
    "category_slug": "education-kids",
    "icon": "ToyBrick",
    "description_he": "עונות הרשמה ברורות, והורים שרוצים לראות איך נראה יום אצלכם. סיור ויזואלי חוסך עשר שיחות טלפון.",
    "video_types_he": [
      "סיור במקום",
      "רגעים מהפעילויות",
      "יום בגן או בקייטנה",
      "היכרות עם הצוות",
      "פתיחת ההרשמה"
    ],
    "seasonal_angles_he": [
      "הרשמה לגנים ולקייטנות (ינואר עד מרץ)",
      "קייטנות הקיץ",
      "חזרה ללימודים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "צילום קטינים רק בהסכמת הורים בכתב. מומלץ לצלם ידיים, גב ופעילות, בלי פנים מזוהות.",
    "priority": 2,
    "sort_order": 280
  },
  {
    "slug": "home-services",
    "name_he": "בעלי מקצוע: חשמל, אינסטלציה ומיזוג",
    "name_en": "Home services: electricians, plumbers & A/C",
    "category_slug": "real-estate-home",
    "icon": "PlugZap",
    "description_he": "אמון ומהירות. טיפים קצרים ו\"עבודה של היום\" הופכים בעל מקצוע לאיש המקצוע של השכונה.",
    "video_types_he": [
      "טיפים לבית",
      "\"עבודה של היום\"",
      "שירות חירום",
      "מחירון שקוף",
      "לפני ואחרי"
    ],
    "seasonal_angles_he": [
      "קיץ: עומס במזגנים",
      "חורף: דודים ונזילות",
      "לפני פסח: תיקונים בבית"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "חשמלאים וטכנאי גז: מציינים רישיון כנדרש. טיפים של \"עשו זאת בעצמכם\" רק בפעולות בטוחות, בלי עבודות חשמל או גז.",
    "priority": 2,
    "sort_order": 290
  },
  {
    "slug": "movers-storage",
    "name_he": "הובלות ואחסון",
    "name_en": "Movers & storage",
    "category_slug": "real-estate-home",
    "icon": "Truck",
    "description_he": "עונות מעברים צפויות ופחד גדול מנזק. סרטון שמראה סדר ומקצועיות מוכר הובלה.",
    "video_types_he": [
      "תהליך ההובלה",
      "טיפים לאריזה",
      "הצעת מחיר",
      "טיים-לאפס של יום הובלה",
      "מחסני אחסון"
    ],
    "seasonal_angles_he": [
      "קיץ: שיא המעברים",
      "לפני החגים"
    ],
    "compliance_flag": "none",
    "compliance_note_he": null,
    "priority": 3,
    "sort_order": 300
  },
  {
    "slug": "retail-stores",
    "name_he": "חנויות פיזיות: אופנה, אופטיקה, פרחים ויודאיקה",
    "name_en": "Physical stores: fashion, optics, flowers & Judaica",
    "category_slug": "commerce",
    "icon": "Store",
    "description_he": "קולקציות, מבצעים ומדריכי מתנות. סרטון קצר מביא אנשים מהפיד אל הדלת.",
    "video_types_he": [
      "השקת קולקציה",
      "מבצע",
      "מדריך מתנות",
      "חדש על המדף",
      "מאחורי הקלעים בחנות"
    ],
    "seasonal_angles_he": [
      "מתנות לחגים",
      "בלאק פריידיי",
      "יום המשפחה",
      "ולנטיינז"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "הצגת מחירים לפי חוק הגנת הצרכן: מחיר כולל מע״מ, ו\"מחיר קודם\" או אחוז הנחה רק אם הם אמיתיים.",
    "priority": 3,
    "sort_order": 310
  },
  {
    "slug": "catering-chefs",
    "name_he": "קייטרינג ושפים פרטיים",
    "name_en": "Catering & private chefs",
    "category_slug": "food-hospitality",
    "icon": "ChefHat",
    "description_he": "אוכל ואירועים בסרטון אחד. מנות בתקריב והקמה של אירוע בטיים-לאפס מוכרות את החוויה.",
    "video_types_he": [
      "רילס של מנות",
      "הקמת אירוע",
      "ארוחת חג",
      "היכרות עם השף",
      "תפריטים"
    ],
    "seasonal_angles_he": [
      "ארוחות חג",
      "בר ובת מצווה",
      "שבועות"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "הצהרת כשרות רק עם תעודה בתוקף. צילום אורחים מזוהים רק בהסכמתם.",
    "priority": 3,
    "sort_order": 320
  },
  {
    "slug": "b2b-startups",
    "name_he": "הייטק וסטארטאפים (B2B)",
    "name_en": "Tech startups & B2B",
    "category_slug": "tech-b2b",
    "icon": "Rocket",
    "description_he": "סרטוני הסבר, השקות וגיוס עובדים. סרטון קצר וחד מסביר מוצר מורכב טוב יותר ממצגת, ומתאים במיוחד ללינקדאין.",
    "video_types_he": [
      "סרטון הסבר",
      "סרטון השקה",
      "דמו של המוצר",
      "סיפור לקוח",
      "גיוס עובדים"
    ],
    "seasonal_angles_he": [
      "הודעות על גיוס הון",
      "כנסים ותערוכות",
      "גיוס עובדים"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "טענות מספריות (\"6 שעות\", \"מ-14 ימים ל-2\") צריכות מקור או סיפור לקוח מתועד. לוגואים של לקוחות רק באישור. לרוב צריך גם גרסה באנגלית.",
    "priority": 3,
    "sort_order": 330
  },
  {
    "slug": "nonprofits",
    "name_he": "עמותות וארגונים חברתיים",
    "name_en": "Nonprofits & NGOs",
    "category_slug": "community-public",
    "icon": "HandHeart",
    "description_he": "סיפורי השפעה רגשיים ומדויקים מגייסים תרומות ומתנדבים.",
    "video_types_he": [
      "סיפור השפעה",
      "קמפיין תרומות",
      "יום עם המתנדבים",
      "שקיפות: לאן הולך הכסף",
      "קריאה להתנדבות"
    ],
    "seasonal_angles_he": [
      "לפני ראש השנה ויום כיפור: עונת התרומות",
      "חנוכה",
      "סוף שנת המס"
    ],
    "compliance_flag": "other",
    "compliance_note_he": "ניסוח מדויק של הזיכוי ממס (סעיף 46), רק לעמותה עם אישור בתוקף. סיפורי מוטבים רק בהסכמתם ובשמירה על כבודם, ובקטינים בהסכמת הורים או אפוטרופוס.",
    "priority": 3,
    "sort_order": 340
  },
  {
    "slug": "local-politics",
    "name_he": "פוליטיקה ומועמדים",
    "name_en": "Politics & candidates",
    "category_slug": "community-public",
    "icon": "Vote",
    "description_he": "נפח גבוה בתקופות בחירות, אבל גם סיכון משפטי ותדמיתי גבוה. מומלץ להחריג את הנישה בהשקה.",
    "video_types_he": [
      "היכרות עם המועמד או המועמדת",
      "עמדות בנושאים",
      "קטעים מכנסים"
    ],
    "seasonal_angles_he": [
      "הבחירות לכנסת: 27.10.2026",
      "בחירות מקומיות"
    ],
    "compliance_flag": "political",
    "compliance_note_he": "חוק הבחירות (דרכי תעמולה) וכללי ועדת הבחירות המרכזית לזיוף עמוק (תשפ״ו-2026): סימון חובה לתעמולה שנוצרה ב-AI, זיהוי המפרסם, ואיסור על זיוף דמות של מועמדים. מומלץ להחריג את הנישה בהשקה ולדרוש אימות זהות. אין לה הוקים בספרייה.",
    "priority": 3,
    "sort_order": 350
  },
  {
    "slug": "physio-nutrition",
    "name_he": "פיזיותרפיה, תזונה ורפואה משלימה",
    "name_en": "Physiotherapy, nutrition & complementary health",
    "category_slug": "health-wellness",
    "icon": "Activity",
    "description_he": "תוכן חינוכי שבונה סמכות: טיפים, מיתוסים והסברים פשוטים.",
    "video_types_he": [
      "טיפים",
      "ניפוץ מיתוסים",
      "תרגילים קצרים",
      "מה קורה בפגישה הראשונה",
      "מתכונים בריאים"
    ],
    "seasonal_angles_he": [
      "ינואר",
      "לפני הקיץ",
      "אחרי החגים"
    ],
    "compliance_flag": "medical",
    "compliance_note_he": "זהירות בטענות בריאות: בלי הבטחת ריפוי או ירידה במשקל, ובפרסום ממומן בלי לפנות לצופה בהנחה על מצבו הבריאותי. ברפואה משלימה, בלי טענות טיפוליות שאינן מבוססות.",
    "priority": 3,
    "sort_order": 360
  }
]
```
