# נספח B — טקסונומיית ההוקים, משפחות ועונות

הנתונים הקנוניים של סוגי ההוקים, המשפחות והמועדים בלוח השיווקי הישראלי. הקבצים `seed/hook_families.json`, ‏`seed/hook_types.json` ו-`seed/seasons.json` נמצאים במאגר. אם הם חסרים, צרו אותם **בדיוק** מבלוקי ה-JSON שבנספח. כל ה-slugs באנגלית וב-kebab-case, והם משמשים גם כמקטעי URL ‏(`/hooks/types/[type]`, ‏`/hooks/season/[season]`).

> **תאריכים:** השדה `date_hint_he` הוא תיאור לבני אדם ולא אומת. תאריכים בפועל (`starts_on`, ‏`ends_on`) מתעדכנים מ-Hebcal או בידי מנהל, ראו חלק 04. בימים שמסומנים `is_quiet_day: true` המערכת עוצרת פרסום שיווקי ומציגה הודעה מתאימה.

## B.1 משפחות (8)

| slug | שם | תיאור |
|---|---|---|
| `curiosity` | סקרנות ומידע מבפנים | הוקים שפותחים פער מידע. הצופה נשאר כדי לקבל את התשובה. |
| `warning` | אזהרות וטעויות | נשענים על הרתיעה מהפסד: מה ישתבש אם לא תדעו. |
| `disruption` | שבירת דפוס ועמדה | פתיחה מפתיעה או עמדה חדה שעוצרת את הגלילה. |
| `relatable` | הזדהות וסיפור | הצופה רואה את עצמו בסיטואציה, בפנייה או בסיפור. |
| `proof` | הוכחה ותוצאות | מראים ולא מספרים: תוצאה, מהפך, נתון או לקוחות אמיתיים. |
| `education` | ערך ולימוד | מבטיחים ערך מוגדר בזמן קצר: רשימה, מדריך או השוואה. |
| `visual` | ויזואל ומאחורי הקלעים | הוקים שעובדים גם בלי סאונד: תנועה, תהליך ומה שקורה מאחורי הדלפק. |
| `action` | הצעה ומעורבות | מזמינים לפעול עכשיו: הצעה מוגבלת או אתגר שמייצר תגובות. |

## B.2 סוגי הוקים (27)

| slug | שם | משפחה | תיאור | דוגמה |
|---|---|---|---|---|
| `curiosity-gap` | פער סקרנות | סקרנות ומידע מבפנים | פותח פער בין מה שהצופה יודע לבין מה שהוא רוצה לדעת. התשובה מגיעה רק בהמשך הסרטון. | הדבר הראשון שאני בודקת בדירה – וזה לא הקירות |
| `pattern-interrupt` | שבירת דפוס | שבירת דפוס ועמדה | פתיחה לא צפויה, ויזואלית או מילולית, שקוטעת את קצב הגלילה. | אל תבואו אלינו רעבים. ברצינות. |
| `negative-warning` | אזהרה | אזהרות וטעויות | נשען על הטיית השליליות ועל הרתיעה מהפסד: מה ישתבש אם לא תדעו את זה. | אל תלבינו שיניים לפני שאתם יודעים את זה |
| `stop-doing` | תפסיקו לעשות X | אזהרות וטעויות | פקודה ישירה להפסיק הרגל נפוץ. מעוררת התנגדות וסקרנות. | תפסיקו לשמור קבלות בקופסת נעליים |
| `mistakes` | X טעויות | אזהרות וטעויות | רשימה ממוספרת של טעויות נפוצות: שילוב של רשימה ואזהרה. | 3 טעויות תאורה שהורסות כל דירה חדשה |
| `listicle` | רשימה ממוספרת | ערך ולימוד | מספר קונקרטי (3, 5, 7) שמבטיח ערך מוגדר וזמן צפייה צפוי. | 3 תרגילים שמחליפים שעה בחדר כושר |
| `pov` | POV / נקודת מבט | הזדהות וסיפור | מכניס את הצופה לסיטואציה מוכרת שקל להזדהות איתה. חזק במיוחד בטיקטוק וברילס. | POV: הקבלן אמר "שבועיים". זה היה לפני 4 חודשים |
| `before-after` | לפני / אחרי | הוכחה ותוצאות | חשיפה מיידית של מהפך ויזואלי. | אמבטיה משנות ה-80 ← 10 ימי עבודה |
| `result-first` | התוצאה קודם | הוכחה ותוצאות | פותחים בתוצאה המרשימה, ורק אחר כך מספרים איך הגענו אליה. | הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה |
| `question` | שאלה | סקרנות ומידע מבפנים | שאלה שהצופה עונה עליה בראש, ומרגיש שהיא מופנית אליו. | כל כמה זמן באמת צריך לקלח כלב? |
| `callout` | פנייה לקהל | הזדהות וסיפור | פנייה מדויקת לקהל היעד, כדי שהאנשים הנכונים יעצרו. | עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך |
| `bold-claim` | טענה נועזת | שבירת דפוס ועמדה | הצהרה חזקה ומפתיעה שהסרטון מוכיח בהמשך. | סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר |
| `statistic` | נתון / מספר | הוכחה ותוצאות | נתון מספרי חד שיוצר הקשר ואמינות. חייב להיות אמיתי ומתועד. | הצוות שלכם מאבד 6 שעות בשבוע על דוחות |
| `story` | סיפור | הזדהות וסיפור | פתיחה מאמצע הסיפור, עם דמות ומתח. | הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪ |
| `challenge` | אתגר | הצעה ומעורבות | מזמין את הצופה לנסות, לנחש או להתמודד, ומייצר תגובות. | פלאנק 30 שניות. כתבו בתגובות כמה החזקתם |
| `demonstration` | הדגמה | הוכחה ותוצאות | מראים את המוצר או השירות בפעולה, בזמן אמת, בלי הסברים מיותרים. | דמו של 30 שניות: מעלים קובץ, יוצא דוח |
| `social-proof` | הוכחה חברתית | הוכחה ותוצאות | לקוחות, ביקורות, מספרים ותגובות אמיתיות. | ביקורת אמיתית, בלי תסריט ובלי עריכה |
| `controversy` | דעה לא פופולרית | שבירת דפוס ועמדה | עמדה מקצועית שנויה במחלוקת שפותחת דיון בתגובות. | דעה לא פופולרית: בית פתוח זה בזבוז זמן |
| `myth-busting` | ניפוץ מיתוס | שבירת דפוס ועמדה | מציגים אמונה נפוצה ומפריכים אותה. | מיתוס: אם לא כואב – אין עששת |
| `insider-secret` | סוד מקצועי | סקרנות ומידע מבפנים | "מה שאנשי המקצוע לא מספרים": תחושה של גישה למידע מבפנים. | קבלן מגלה: איפה "חוסכים" בשיפוצים בלי שתשימו לב |
| `price-reveal` | חשיפת מחיר | סקרנות ומידע מבפנים | עונה על השאלה שכולם רוצים לשאול: כמה זה עולה. | כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח |
| `comparison` | השוואה (X מול Y) | ערך ולימוד | שתי אפשרויות זו מול זו, לרוב במסך מפוצל. | שכירות או משכנתא? עשינו את החשבון |
| `behind-the-scenes` | מאחורי הקלעים | ויזואל ומאחורי הקלעים | חושפים את מה שקורה מאחורי הדלפק, במטבח או בסטודיו. | שישי בצהריים אצלנו: 280 סועדים, מטבח אחד |
| `day-in-life` | יום בחיים | הזדהות וסיפור | רצף מהיר של יום עבודה אמיתי, אנושי ומעורר הזדהות. | יום בחיים של סוכן ביטוח, וזה לא רק טפסים |
| `how-to` | מדריך מהיר | ערך ולימוד | מבטיחים ללמד משהו שימושי בזמן קצוב. | אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים |
| `satisfying-visual` | ויזואל ממכר | ויזואל ומאחורי הקלעים | הוק ויזואלי טהור: תנועה, מרקם, טיים-לאפס. עובד גם בלי סאונד. | פייד מושלם ב-60 שניות |
| `urgency-offer` | דחיפות / הצעה | הצעה ומעורבות | הצעה מוגבלת בזמן או בכמות, רק כשהיא אמיתית. | נשארו 2 סופ״שים פנויים בחודש הבא |

## B.3 עונות ומועדים (25)

| slug | שם | מתי (תיאור) | חלון פרסום | יום שקט |
|---|---|---|---|---|
| `after-holidays` | אחרי החגים | אוקטובר 2026 (אחרי שמחת תורה, 3.10.2026) | כל אוקטובר | — |
| `knesset-elections-2026` | הבחירות לכנסת | 27.10.2026 | — | — |
| `singles-day` | 11.11, יום הרווקים | 11.11.2026 | שבוע לפני ועד סוף היום | — |
| `black-friday` | בלאק פריידיי וסייבר מאנדיי | 27.11.2026 (סייבר מאנדיי: 30.11.2026) | כל נובמבר; שיא משבוע לפני ועד סייבר מאנדיי | — |
| `hanukkah` | חנוכה | 4–12.12.2026 (הנר הראשון בערב 4.12) | טיזר שבוע לפני, ואז מהנר הראשון ועד סוף החג | — |
| `tax-year-end` | סוף שנת המס | דצמבר 2026 (עד 31.12) | 1–31 בדצמבר | — |
| `silvester` | סילבסטר | 31.12.2026 | שבוע לפני | — |
| `new-year` | ינואר: שנה אזרחית חדשה | ינואר 2027 | מסוף דצמבר ועד אמצע ינואר | — |
| `tu-bishvat` | ט״ו בשבט | בערך 23.1.2027 | שבוע לפני | — |
| `registration-season` | עונת ההרשמה לגנים ולקייטנות | ינואר עד מרץ 2027 | לאורך כל העונה | — |
| `family-day` | יום המשפחה | בערך 7.2.2027 | 10 ימים לפני | — |
| `valentines` | ולנטיין (יום האהבה) | 14.2.2027 | שבוע לפני | — |
| `purim` | פורים | בערך 23.3.2027 (שנה מעוברת: אדר ב׳) | שבוע לפני | — |
| `pre-passover` | לפני פסח: ניקיונות ושיפוצים | מרץ עד אפריל 2027 | 3–4 שבועות לפני פסח | — |
| `passover` | פסח וחול המועד | בערך 21–28.4.2027 | שבועיים לפני ועד סוף החג | — |
| `holocaust-memorial-day` | יום השואה | בערך 4.5.2027 | לא מפרסמים | כן |
| `memorial-day` | יום הזיכרון | בערך 11.5.2027 | לא מפרסמים | כן |
| `independence-day` | יום העצמאות | בערך 12.5.2027 | שבוע לפני; לא ביום הזיכרון עצמו | — |
| `lag-baomer` | ל״ג בעומר | בערך 25.5.2027 | שבוע לפני | — |
| `shavuot` | שבועות | בערך 11.6.2027 | שבוע לפני | — |
| `summer` | החופש הגדול | יולי עד אוגוסט 2027 | מסוף יוני | — |
| `tu-beav` | ט״ו באב | בערך 18.8.2027 | 10 ימים לפני | — |
| `back-to-school` | חזרה ללימודים | 1.9.2027 | מאמצע אוגוסט | — |
| `rosh-hashana` | ראש השנה | בערך 2.10.2027 (ראש השנה תשפ״ח; ראש השנה תשפ״ז היה ב-12–13.9.2026) | 3–4 שבועות לפני | — |
| `sukkot` | סוכות וחול המועד | תשרי, כשבועיים אחרי ראש השנה | שבועיים לפני | — |

## B.4 `hook_families.json`

```json
[
  {
    "slug": "curiosity",
    "name_he": "סקרנות ומידע מבפנים",
    "name_en": "Curiosity & insider info",
    "description_he": "הוקים שפותחים פער מידע. הצופה נשאר כדי לקבל את התשובה.",
    "sort_order": 10
  },
  {
    "slug": "warning",
    "name_he": "אזהרות וטעויות",
    "name_en": "Warnings & mistakes",
    "description_he": "נשענים על הרתיעה מהפסד: מה ישתבש אם לא תדעו.",
    "sort_order": 20
  },
  {
    "slug": "disruption",
    "name_he": "שבירת דפוס ועמדה",
    "name_en": "Disruption & bold takes",
    "description_he": "פתיחה מפתיעה או עמדה חדה שעוצרת את הגלילה.",
    "sort_order": 30
  },
  {
    "slug": "relatable",
    "name_he": "הזדהות וסיפור",
    "name_en": "Relatable & story",
    "description_he": "הצופה רואה את עצמו בסיטואציה, בפנייה או בסיפור.",
    "sort_order": 40
  },
  {
    "slug": "proof",
    "name_he": "הוכחה ותוצאות",
    "name_en": "Proof & results",
    "description_he": "מראים ולא מספרים: תוצאה, מהפך, נתון או לקוחות אמיתיים.",
    "sort_order": 50
  },
  {
    "slug": "education",
    "name_he": "ערך ולימוד",
    "name_en": "Value & education",
    "description_he": "מבטיחים ערך מוגדר בזמן קצר: רשימה, מדריך או השוואה.",
    "sort_order": 60
  },
  {
    "slug": "visual",
    "name_he": "ויזואל ומאחורי הקלעים",
    "name_en": "Visual & behind the scenes",
    "description_he": "הוקים שעובדים גם בלי סאונד: תנועה, תהליך ומה שקורה מאחורי הדלפק.",
    "sort_order": 70
  },
  {
    "slug": "action",
    "name_he": "הצעה ומעורבות",
    "name_en": "Offers & engagement",
    "description_he": "מזמינים לפעול עכשיו: הצעה מוגבלת או אתגר שמייצר תגובות.",
    "sort_order": 80
  }
]
```

## B.5 `hook_types.json`

```json
[
  {
    "slug": "curiosity-gap",
    "name_he": "פער סקרנות",
    "name_en": "Curiosity gap",
    "family_slug": "curiosity",
    "description_he": "פותח פער בין מה שהצופה יודע לבין מה שהוא רוצה לדעת. התשובה מגיעה רק בהמשך הסרטון.",
    "example_he": "הדבר הראשון שאני בודקת בדירה – וזה לא הקירות",
    "sort_order": 1
  },
  {
    "slug": "pattern-interrupt",
    "name_he": "שבירת דפוס",
    "name_en": "Pattern interrupt",
    "family_slug": "disruption",
    "description_he": "פתיחה לא צפויה, ויזואלית או מילולית, שקוטעת את קצב הגלילה.",
    "example_he": "אל תבואו אלינו רעבים. ברצינות.",
    "sort_order": 2
  },
  {
    "slug": "negative-warning",
    "name_he": "אזהרה",
    "name_en": "Negative / warning",
    "family_slug": "warning",
    "description_he": "נשען על הטיית השליליות ועל הרתיעה מהפסד: מה ישתבש אם לא תדעו את זה.",
    "example_he": "אל תלבינו שיניים לפני שאתם יודעים את זה",
    "sort_order": 3
  },
  {
    "slug": "stop-doing",
    "name_he": "תפסיקו לעשות X",
    "name_en": "Stop doing X",
    "family_slug": "warning",
    "description_he": "פקודה ישירה להפסיק הרגל נפוץ. מעוררת התנגדות וסקרנות.",
    "example_he": "תפסיקו לשמור קבלות בקופסת נעליים",
    "sort_order": 4
  },
  {
    "slug": "mistakes",
    "name_he": "X טעויות",
    "name_en": "Mistakes list",
    "family_slug": "warning",
    "description_he": "רשימה ממוספרת של טעויות נפוצות: שילוב של רשימה ואזהרה.",
    "example_he": "3 טעויות תאורה שהורסות כל דירה חדשה",
    "sort_order": 5
  },
  {
    "slug": "listicle",
    "name_he": "רשימה ממוספרת",
    "name_en": "Listicle",
    "family_slug": "education",
    "description_he": "מספר קונקרטי (3, 5, 7) שמבטיח ערך מוגדר וזמן צפייה צפוי.",
    "example_he": "3 תרגילים שמחליפים שעה בחדר כושר",
    "sort_order": 6
  },
  {
    "slug": "pov",
    "name_he": "POV / נקודת מבט",
    "name_en": "POV",
    "family_slug": "relatable",
    "description_he": "מכניס את הצופה לסיטואציה מוכרת שקל להזדהות איתה. חזק במיוחד בטיקטוק וברילס.",
    "example_he": "POV: הקבלן אמר \"שבועיים\". זה היה לפני 4 חודשים",
    "sort_order": 7
  },
  {
    "slug": "before-after",
    "name_he": "לפני / אחרי",
    "name_en": "Before / after",
    "family_slug": "proof",
    "description_he": "חשיפה מיידית של מהפך ויזואלי.",
    "example_he": "אמבטיה משנות ה-80 ← 10 ימי עבודה",
    "sort_order": 8
  },
  {
    "slug": "result-first",
    "name_he": "התוצאה קודם",
    "name_en": "Result first",
    "family_slug": "proof",
    "description_he": "פותחים בתוצאה המרשימה, ורק אחר כך מספרים איך הגענו אליה.",
    "example_he": "הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה",
    "sort_order": 9
  },
  {
    "slug": "question",
    "name_he": "שאלה",
    "name_en": "Question",
    "family_slug": "curiosity",
    "description_he": "שאלה שהצופה עונה עליה בראש, ומרגיש שהיא מופנית אליו.",
    "example_he": "כל כמה זמן באמת צריך לקלח כלב?",
    "sort_order": 10
  },
  {
    "slug": "callout",
    "name_he": "פנייה לקהל",
    "name_en": "Call-out",
    "family_slug": "relatable",
    "description_he": "פנייה מדויקת לקהל היעד, כדי שהאנשים הנכונים יעצרו.",
    "example_he": "עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך",
    "sort_order": 11
  },
  {
    "slug": "bold-claim",
    "name_he": "טענה נועזת",
    "name_en": "Bold claim",
    "family_slug": "disruption",
    "description_he": "הצהרה חזקה ומפתיעה שהסרטון מוכיח בהמשך.",
    "example_he": "סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר",
    "sort_order": 12
  },
  {
    "slug": "statistic",
    "name_he": "נתון / מספר",
    "name_en": "Statistic",
    "family_slug": "proof",
    "description_he": "נתון מספרי חד שיוצר הקשר ואמינות. חייב להיות אמיתי ומתועד.",
    "example_he": "הצוות שלכם מאבד 6 שעות בשבוע על דוחות",
    "sort_order": 13
  },
  {
    "slug": "story",
    "name_he": "סיפור",
    "name_en": "Story",
    "family_slug": "relatable",
    "description_he": "פתיחה מאמצע הסיפור, עם דמות ומתח.",
    "example_he": "הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪",
    "sort_order": 14
  },
  {
    "slug": "challenge",
    "name_he": "אתגר",
    "name_en": "Challenge",
    "family_slug": "action",
    "description_he": "מזמין את הצופה לנסות, לנחש או להתמודד, ומייצר תגובות.",
    "example_he": "פלאנק 30 שניות. כתבו בתגובות כמה החזקתם",
    "sort_order": 15
  },
  {
    "slug": "demonstration",
    "name_he": "הדגמה",
    "name_en": "Demonstration",
    "family_slug": "proof",
    "description_he": "מראים את המוצר או השירות בפעולה, בזמן אמת, בלי הסברים מיותרים.",
    "example_he": "דמו של 30 שניות: מעלים קובץ, יוצא דוח",
    "sort_order": 16
  },
  {
    "slug": "social-proof",
    "name_he": "הוכחה חברתית",
    "name_en": "Social proof",
    "family_slug": "proof",
    "description_he": "לקוחות, ביקורות, מספרים ותגובות אמיתיות.",
    "example_he": "ביקורת אמיתית, בלי תסריט ובלי עריכה",
    "sort_order": 17
  },
  {
    "slug": "controversy",
    "name_he": "דעה לא פופולרית",
    "name_en": "Controversy / hot take",
    "family_slug": "disruption",
    "description_he": "עמדה מקצועית שנויה במחלוקת שפותחת דיון בתגובות.",
    "example_he": "דעה לא פופולרית: בית פתוח זה בזבוז זמן",
    "sort_order": 18
  },
  {
    "slug": "myth-busting",
    "name_he": "ניפוץ מיתוס",
    "name_en": "Myth busting",
    "family_slug": "disruption",
    "description_he": "מציגים אמונה נפוצה ומפריכים אותה.",
    "example_he": "מיתוס: אם לא כואב – אין עששת",
    "sort_order": 19
  },
  {
    "slug": "insider-secret",
    "name_he": "סוד מקצועי",
    "name_en": "Insider secret",
    "family_slug": "curiosity",
    "description_he": "\"מה שאנשי המקצוע לא מספרים\": תחושה של גישה למידע מבפנים.",
    "example_he": "קבלן מגלה: איפה \"חוסכים\" בשיפוצים בלי שתשימו לב",
    "sort_order": 20
  },
  {
    "slug": "price-reveal",
    "name_he": "חשיפת מחיר",
    "name_en": "Price reveal",
    "family_slug": "curiosity",
    "description_he": "עונה על השאלה שכולם רוצים לשאול: כמה זה עולה.",
    "example_he": "כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח",
    "sort_order": 21
  },
  {
    "slug": "comparison",
    "name_he": "השוואה (X מול Y)",
    "name_en": "Comparison (X vs Y)",
    "family_slug": "education",
    "description_he": "שתי אפשרויות זו מול זו, לרוב במסך מפוצל.",
    "example_he": "שכירות או משכנתא? עשינו את החשבון",
    "sort_order": 22
  },
  {
    "slug": "behind-the-scenes",
    "name_he": "מאחורי הקלעים",
    "name_en": "Behind the scenes",
    "family_slug": "visual",
    "description_he": "חושפים את מה שקורה מאחורי הדלפק, במטבח או בסטודיו.",
    "example_he": "שישי בצהריים אצלנו: 280 סועדים, מטבח אחד",
    "sort_order": 23
  },
  {
    "slug": "day-in-life",
    "name_he": "יום בחיים",
    "name_en": "Day in the life",
    "family_slug": "relatable",
    "description_he": "רצף מהיר של יום עבודה אמיתי, אנושי ומעורר הזדהות.",
    "example_he": "יום בחיים של סוכן ביטוח, וזה לא רק טפסים",
    "sort_order": 24
  },
  {
    "slug": "how-to",
    "name_he": "מדריך מהיר",
    "name_en": "How-to",
    "family_slug": "education",
    "description_he": "מבטיחים ללמד משהו שימושי בזמן קצוב.",
    "example_he": "אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים",
    "sort_order": 25
  },
  {
    "slug": "satisfying-visual",
    "name_he": "ויזואל ממכר",
    "name_en": "Satisfying visual / ASMR",
    "family_slug": "visual",
    "description_he": "הוק ויזואלי טהור: תנועה, מרקם, טיים-לאפס. עובד גם בלי סאונד.",
    "example_he": "פייד מושלם ב-60 שניות",
    "sort_order": 26
  },
  {
    "slug": "urgency-offer",
    "name_he": "דחיפות / הצעה",
    "name_en": "Urgency / offer",
    "family_slug": "action",
    "description_he": "הצעה מוגבלת בזמן או בכמות, רק כשהיא אמיתית.",
    "example_he": "נשארו 2 סופ״שים פנויים בחודש הבא",
    "sort_order": 27
  }
]
```

## B.6 `seasons.json`

```json
[
  {
    "slug": "after-holidays",
    "name_he": "אחרי החגים",
    "name_en": "After the holidays",
    "date_hint_he": "אוקטובר 2026 (אחרי שמחת תורה, 3.10.2026)",
    "publish_window_he": "כל אוקטובר",
    "niche_slugs": [
      "fitness-trainers",
      "yoga-pilates",
      "physio-nutrition",
      "renovation-contractors",
      "interior-design",
      "event-venues",
      "therapists"
    ],
    "is_quiet_day": false,
    "note_he": "המסר \"אחרי החגים מתחילים\" חזק לאורך כל אוקטובר.",
    "sort_order": 10
  },
  {
    "slug": "knesset-elections-2026",
    "name_he": "הבחירות לכנסת",
    "name_en": "Knesset elections",
    "date_hint_he": "27.10.2026",
    "publish_window_he": "—",
    "niche_slugs": [],
    "is_quiet_day": false,
    "note_he": "לא מועד שיווקי: חוסמים תבניות פוליטיות ודמויות של פוליטיקאים אמיתיים. תעמולה שנוצרה ב-AI חייבת סימון לפי כללי ועדת הבחירות.",
    "sort_order": 20
  },
  {
    "slug": "singles-day",
    "name_he": "11.11, יום הרווקים",
    "name_en": "Singles' Day (11.11)",
    "date_hint_he": "11.11.2026",
    "publish_window_he": "שבוע לפני ועד סוף היום",
    "niche_slugs": [
      "ecommerce",
      "retail-stores"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 30
  },
  {
    "slug": "black-friday",
    "name_he": "בלאק פריידיי וסייבר מאנדיי",
    "name_en": "Black Friday & Cyber Monday",
    "date_hint_he": "27.11.2026 (סייבר מאנדיי: 30.11.2026)",
    "publish_window_he": "כל נובמבר; שיא משבוע לפני ועד סייבר מאנדיי",
    "niche_slugs": [
      "ecommerce",
      "retail-stores",
      "beauty-nails",
      "aesthetic-clinics",
      "fitness-trainers",
      "car-dealers"
    ],
    "is_quiet_day": false,
    "note_he": "אירוע גדול מאוד בישראל. הקמפיינים רצים לאורך כל נובמבר.",
    "sort_order": 40
  },
  {
    "slug": "hanukkah",
    "name_he": "חנוכה",
    "name_en": "Hanukkah",
    "date_hint_he": "4–12.12.2026 (הנר הראשון בערב 4.12)",
    "publish_window_he": "טיזר שבוע לפני, ואז מהנר הראשון ועד סוף החג",
    "niche_slugs": [
      "restaurants",
      "catering-chefs",
      "kids-activities",
      "tourism-attractions",
      "retail-stores",
      "ecommerce",
      "nonprofits"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 50
  },
  {
    "slug": "tax-year-end",
    "name_he": "סוף שנת המס",
    "name_en": "Tax year end",
    "date_hint_he": "דצמבר 2026 (עד 31.12)",
    "publish_window_he": "1–31 בדצמבר",
    "niche_slugs": [
      "accountants",
      "insurance-agents",
      "nonprofits",
      "lawyers"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 60
  },
  {
    "slug": "silvester",
    "name_he": "סילבסטר",
    "name_en": "New Year's Eve",
    "date_hint_he": "31.12.2026",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "djs-musicians",
      "event-venues",
      "restaurants"
    ],
    "is_quiet_day": false,
    "note_he": "קהל חילוני בעיקר.",
    "sort_order": 70
  },
  {
    "slug": "new-year",
    "name_he": "ינואר: שנה אזרחית חדשה",
    "name_en": "New calendar year (January)",
    "date_hint_he": "ינואר 2027",
    "publish_window_he": "מסוף דצמבר ועד אמצע ינואר",
    "niche_slugs": [
      "fitness-trainers",
      "yoga-pilates",
      "physio-nutrition",
      "courses-educators",
      "accountants",
      "car-dealers",
      "insurance-agents"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 80
  },
  {
    "slug": "tu-bishvat",
    "name_he": "ט״ו בשבט",
    "name_en": "Tu BiShvat",
    "date_hint_he": "בערך 23.1.2027",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "physio-nutrition",
      "restaurants",
      "catering-chefs"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 90
  },
  {
    "slug": "registration-season",
    "name_he": "עונת ההרשמה לגנים ולקייטנות",
    "name_en": "Kindergarten & camp registration",
    "date_hint_he": "ינואר עד מרץ 2027",
    "publish_window_he": "לאורך כל העונה",
    "niche_slugs": [
      "kids-activities",
      "courses-educators"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 100
  },
  {
    "slug": "family-day",
    "name_he": "יום המשפחה",
    "name_en": "Family Day",
    "date_hint_he": "בערך 7.2.2027",
    "publish_window_he": "10 ימים לפני",
    "niche_slugs": [
      "retail-stores",
      "ecommerce",
      "beauty-nails",
      "restaurants"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 110
  },
  {
    "slug": "valentines",
    "name_he": "ולנטיין (יום האהבה)",
    "name_en": "Valentine's Day",
    "date_hint_he": "14.2.2027",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "restaurants",
      "beauty-nails",
      "zimmers-boutique-hotels",
      "retail-stores",
      "ecommerce"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 120
  },
  {
    "slug": "purim",
    "name_he": "פורים",
    "name_en": "Purim",
    "date_hint_he": "בערך 23.3.2027 (שנה מעוברת: אדר ב׳)",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "djs-musicians",
      "event-venues",
      "restaurants",
      "retail-stores",
      "kids-activities"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 130
  },
  {
    "slug": "pre-passover",
    "name_he": "לפני פסח: ניקיונות ושיפוצים",
    "name_en": "Pre-Passover (cleaning & renovations)",
    "date_hint_he": "מרץ עד אפריל 2027",
    "publish_window_he": "3–4 שבועות לפני פסח",
    "niche_slugs": [
      "renovation-contractors",
      "home-services",
      "interior-design",
      "movers-storage",
      "retail-stores"
    ],
    "is_quiet_day": false,
    "note_he": "אחד משיאי השנה לעסקי שירות.",
    "sort_order": 140
  },
  {
    "slug": "passover",
    "name_he": "פסח וחול המועד",
    "name_en": "Passover",
    "date_hint_he": "בערך 21–28.4.2027",
    "publish_window_he": "שבועיים לפני ועד סוף החג",
    "niche_slugs": [
      "restaurants",
      "tourism-attractions",
      "zimmers-boutique-hotels",
      "catering-chefs",
      "real-estate"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 150
  },
  {
    "slug": "holocaust-memorial-day",
    "name_he": "יום השואה",
    "name_en": "Holocaust Remembrance Day",
    "date_hint_he": "בערך 4.5.2027",
    "publish_window_he": "לא מפרסמים",
    "niche_slugs": [],
    "is_quiet_day": true,
    "note_he": "יום שקט: עוצרים אוטומטית כל פרסום שיווקי.",
    "sort_order": 160
  },
  {
    "slug": "memorial-day",
    "name_he": "יום הזיכרון",
    "name_en": "Memorial Day",
    "date_hint_he": "בערך 11.5.2027",
    "publish_window_he": "לא מפרסמים",
    "niche_slugs": [],
    "is_quiet_day": true,
    "note_he": "יום שקט: עוצרים אוטומטית כל פרסום שיווקי.",
    "sort_order": 170
  },
  {
    "slug": "independence-day",
    "name_he": "יום העצמאות",
    "name_en": "Independence Day",
    "date_hint_he": "בערך 12.5.2027",
    "publish_window_he": "שבוע לפני; לא ביום הזיכרון עצמו",
    "niche_slugs": [
      "restaurants",
      "catering-chefs",
      "event-venues",
      "djs-musicians",
      "tourism-attractions",
      "vets-dog-grooming"
    ],
    "is_quiet_day": false,
    "note_he": "טון מכבד: היום צמוד ליום הזיכרון.",
    "sort_order": 180
  },
  {
    "slug": "lag-baomer",
    "name_he": "ל״ג בעומר",
    "name_en": "Lag BaOmer",
    "date_hint_he": "בערך 25.5.2027",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "event-venues",
      "djs-musicians",
      "event-photographers"
    ],
    "is_quiet_day": false,
    "note_he": "החתונות חוזרות לזוגות דתיים.",
    "sort_order": 190
  },
  {
    "slug": "shavuot",
    "name_he": "שבועות",
    "name_en": "Shavuot",
    "date_hint_he": "בערך 11.6.2027",
    "publish_window_he": "שבוע לפני",
    "niche_slugs": [
      "restaurants",
      "catering-chefs",
      "retail-stores"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 200
  },
  {
    "slug": "summer",
    "name_he": "החופש הגדול",
    "name_en": "Summer vacation",
    "date_hint_he": "יולי עד אוגוסט 2027",
    "publish_window_he": "מסוף יוני",
    "niche_slugs": [
      "zimmers-boutique-hotels",
      "tourism-attractions",
      "kids-activities",
      "home-services",
      "movers-storage",
      "real-estate",
      "driving-schools",
      "vets-dog-grooming"
    ],
    "is_quiet_day": false,
    "note_he": "בתקופת \"שלושת השבועות\" (בערך מאמצע יולי עד 12.8) יש פחות חתונות ואירועים בציבור הדתי.",
    "sort_order": 210
  },
  {
    "slug": "tu-beav",
    "name_he": "ט״ו באב",
    "name_en": "Tu B'Av",
    "date_hint_he": "בערך 18.8.2027",
    "publish_window_he": "10 ימים לפני",
    "niche_slugs": [
      "zimmers-boutique-hotels",
      "beauty-nails",
      "retail-stores",
      "restaurants"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 220
  },
  {
    "slug": "back-to-school",
    "name_he": "חזרה ללימודים",
    "name_en": "Back to school",
    "date_hint_he": "1.9.2027",
    "publish_window_he": "מאמצע אוגוסט",
    "niche_slugs": [
      "retail-stores",
      "ecommerce",
      "driving-schools",
      "courses-educators",
      "barbers-salons",
      "dentists",
      "kids-activities"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 230
  },
  {
    "slug": "rosh-hashana",
    "name_he": "ראש השנה",
    "name_en": "Rosh Hashana",
    "date_hint_he": "בערך 2.10.2027 (ראש השנה תשפ״ח; ראש השנה תשפ״ז היה ב-12–13.9.2026)",
    "publish_window_he": "3–4 שבועות לפני",
    "niche_slugs": [
      "retail-stores",
      "ecommerce",
      "restaurants",
      "catering-chefs",
      "nonprofits",
      "aesthetic-clinics",
      "beauty-nails",
      "barbers-salons"
    ],
    "is_quiet_day": false,
    "note_he": "גם עונת התרומות לעמותות, עד יום כיפור.",
    "sort_order": 240
  },
  {
    "slug": "sukkot",
    "name_he": "סוכות וחול המועד",
    "name_en": "Sukkot",
    "date_hint_he": "תשרי, כשבועיים אחרי ראש השנה",
    "publish_window_he": "שבועיים לפני",
    "niche_slugs": [
      "tourism-attractions",
      "zimmers-boutique-hotels",
      "restaurants",
      "kids-activities"
    ],
    "is_quiet_day": false,
    "note_he": null,
    "sort_order": 250
  }
]
```
