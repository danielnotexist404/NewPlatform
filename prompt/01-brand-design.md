# חלק 01 — מותג, מערכת עיצוב, RTL ונגישות

החלק הזה מגדיר איך {{BRAND_NAME}} נראה, נשמע, זז ונקרא — בכל מסך, בכל ערכת נושא ובכל גודל מסך. הוא כולל את אישיות המותג וכללי המיקרו-קופי, את כל טוקני העיצוב כקוד (`app/globals.css` ו-`app/fonts.ts`), את אסטרטגיית ערכות הנושא, את הקמת shadcn/ui במצב RTL, את מלאי הרכיבים המלא עם מצבים וממשקי TypeScript, את כללי ה-RTL וה-bidi, את מערכת התנועה, את רשימת הנגישות לפי WCAG 2.2 AA, ואת השפה החזותית: אייקונים, צילום, תמונות ממוזערות, מראה הכתוביות בסרטון, איורי מצבים ריקים, לוגו, favicon ותמונות OG.

כל מה שמוגדר כאן הוא חוזה: חלקים 02 ו-03 משתמשים ברכיבים, בטוקנים ובמחרוזות האלה כפי שהם, וחלק 05 מרנדר את מראה הכתוביות לפי ההגדרות ב-§16. אם נדרש רכיב חדש — הוא נבנה מהטוקנים והכללים של החלק הזה, לא "בצד".

---

## §1. המותג: מיצוב, אישיות וקול

### 1.1 מיצוב (לשימוש פנימי — לא קופי שיווקי)

> **{{BRAND_NAME}}** הופך את השאלה "מה העסק שלכם?" לסרטון תדמית או לרילס מוכן בעברית, תוך דקות: תסריט שמותאם לנישה עם הוק עברי שעובד, ויז׳ואלים, קריינות, כתוביות RTL מדויקות, מוזיקה ולוגו — בשלושה פורמטים. הוא מחליף את עורך הווידאו הפרילנסר, במחיר בשקלים כולל מע״מ ועם חשבונית מס.

המיצוב לא מתפשר על שלושה דברים, וכל החלטת עיצוב נבחנת מולם:

| עמוד תווך | מה זה אומר בפועל בעיצוב |
|---|---|
| **נישה** | המשתמש מתחיל מ"מה העסק שלכם", לא מבחירת מנוע. אייקוני נישה, תוויות נישה על כל סרטון לדוגמה, דוגמאות מהנישה שלו בכל מקום שאפשר. |
| **עברית מושלמת** | כל טקסט עברי — בממשק ובסרטון — נראה כאילו ישראלי עיצב אותו: יישור, פיסוק, מספרים, כתוביות. RTL נכון הוא סימן פרימיום, כי רוב הכלים הגלובליים מזייפים אותו. |
| **תוצאה מוגמרת** | מראים סרטונים מוגמרים עם כתוביות עבריות צרובות, לא "אמנות AI". כל כפתור יצירה מציג עלות. כל כישלון מסביר מה הוחזר. |

### 1.2 אישיות

{{BRAND_NAME}} מתנהג כמו **במאי־מפיק ותיק שעובד בשבילכם**: יודע מה עובד ברשתות, מדבר בגובה העיניים, לא מתרברב, לא מבלבל במונחים טכניים, ותמיד אומר כמה זה עולה.

| אנחנו | אנחנו לא |
|---|---|
| **ישירים וחמים** — דוגרי עם חיוך | צוננים, ביורוקרטיים ("הננו שמחים להציע") |
| **מדויקים ושקופים** — מספרים, עלויות, החזרים | מעורפלים ("ייתכנו חיובים נוספים") |
| **מקומיים** — וואטסאפ, חגים, נישות ישראליות, ₪ | פולקלור וקיטש ("יאללה בלאגן!!") |
| **פרימיום בשקט** — מעט מילים, הרבה תוצאה | מתלהבים ("מהפכה!", "הכי מטורף שיש") |
| **מקצוענים שמסבירים** — "הוק", "קריינות", "כתוביות" | טכנולוגים ("מודל", "רזולוציה", "טוקנים") בממשק הראשי |
| **אחראים** — "לא הצלחנו", "הקרדיטים חזרו אליכם" | מאשימים ("הזנת ערך שגוי") |
| **מכבדים** — אפוליטיים, רגישים לימי זיכרון | הומור על מלחמה, פוליטיקה או עדות |

### 1.3 טון לפי הקשר

| הקשר | טון | דוגמה |
|---|---|---|
| אתר שיווקי | בטוח, חד, מעט שובבות מותרת | "סרטון תדמית מקצועי לעסק שלכם, בלי עורך וידאו." |
| אפליקציה — זרימה רגילה | רגוע, ברור, קצר | "בחרו הוק. אפשר לבחור עד 3 ולקבל גרסה לכל אחד." |
| מצבי AI ("יוצרים") | חי, אופטימי, אומר מה קורה עכשיו | "כותבים את התסריט…", "מקליטים קריינות…" |
| שגיאות | לוקחים אחריות, אומרים מה קרה, מה הוחזר ומה עושים עכשיו | "לא הצלחנו ליצור את סצנה 4. הקרדיטים על הסצנה חזרו אליכם." |
| חיוב וכסף | מדויק, רשמי-חם, בלי אותיות קטנות | "החיוב הבא: ₪289 ב-1 בנובמבר. אפשר לבטל בכל רגע." |
| משפטי | רשמי, פשוט ככל האפשר | "בחשבון חינמי שמעולם לא שילם על מנוי או חבילה, הסרטונים נשמרים 90 יום מיום היצירה." |
| התראות ומיילים | התוצאה קודם | "הסרטון שלכם מוכן: מבצע חנוכה – מספרת שירן" |
| אזהרות ציות | ענייני, לא מפחיד | "שימו לב: בנישה הזו אסור להבטיח תוצאות רפואיות." |
| ימי זיכרון | מאופק, בלי שיווק | "היום יום הזיכרון. השבתנו הצעות קידום לחגים." |

### קריטריוני קבלה
- [ ] כל מסך במוצר עומד בטבלת "אנחנו / אנחנו לא" בסקירת הלשון של M7 (`docs/qa/hebrew-review.md`).
- [ ] אין במוצר אף הבטחה, מונה או המלצה שאינם אמת (בדיקת תוכן ידנית + grep על "אלפי לקוחות", "מספר 1").
- [ ] הודעות שגיאה, AI ו-billing תואמות את טבלת הטון (סקירה לפי `messages/he.json`, namespace אחר namespace).

---

## §2. מיקרו-קופי: כללים, מילון מונחים, Do/Don't

### 2.1 כללי הכתיבה (מחייבים לכל מחרוזת ב-`messages/he.json`)

1. **פנייה ברבים כברירת מחדל** ("בחרו", "שלכם"). אסור לוכסנים ("בחר/י"), נקודה מגדרית ("מוזמנים·ות"), סוגריים מגדריים ("מוזמנים(ות)") וכפילויות ("מאשר או מאשרת"). כשאי אפשר להימנע מפנייה אישית — ענפי ICU לפי `ui_gender_form` (§2.2). החריג היחיד לכפילות: הצהרה משפטית בגוף ראשון שאדם חותם עליה או מקריא אותה (טופס ההסכמה לשימוש בדמות שמורידים להדפסה, חלק 02 §10.8; הצהרת הקול, חלק 06 §11.10). בתוך האפליקציה ההצהרה המוקראת מוצגת בענף ICU לפי `ui_gender_form` כשהוא לא `plural`.
2. **כפתורי פעולה מערכתית בצורת שם פעולה**: "שמירה", "ביטול", "מחיקה", "העתקה", "הורדה", "שיתוף", "המשך", "הקודם", "סגירה". זה עוקף מגדר ונשמע מקצועי.
3. **כפתורי יצירה ו-CTA שיווקיים בציווי רבים**: "צרו סרטון בחינם", "צרו את הסרטון", "נסו שוב".
4. **כשאפשר — ניסוח לא אישי** שעוקף מגדר: "אפשר לנסות שוב", "כדאי להוסיף לוגו", "נשאר רק לבחור מוזיקה".
5. **כל שגיאה עונה על שלוש שאלות**: מה קרה, מה קרה לכסף/לקרדיטים, מה עושים עכשיו. בלי קודים טכניים בטקסט (הקוד נשמר ב-`details` ובלוגים).
6. **כל כפתור שעולה קרדיטים מציג את העלות** ("צרו את הסרטון · 107 קרדיטים") דרך `CostBadge` (§10.8).
7. **מספרים, מחירים, אחוזים, טלפונים ותאריכים בספרות** — תמיד דרך `Num`/`Price` (§10.1–10.2), עם ספרות טבלאיות ובידוד `<bdi>`.
8. **פיסוק עברי תקני**: גרשיים ״ (U+05F4) בראשי תיבות (מע״מ, נדל״ן, עו״ד, ש״ח), גרש ׳ (U+05F3) בקיצורים (שנ׳, דק׳) ובאותיות לועזיות (ג׳, צ׳). מירכאות לציטוט: `"…"` רגילות. שלוש נקודות: התו `…` (U+2026). קו מפריד בין משפטים: ` – ` (en dash עם רווחים). מפריד בין פריטים בשורה: ` · `.
9. **כתיב מלא** ("תוכנית", "צהריים", "מבצע") ו"הכול" (לא "הכל").
10. **סימן קריאה אחד לכל היותר במסך**, ורק ברגע של הצלחה אמיתית. אף פעם לא "!!".
11. **בלי ביטויים מתורגמים וקלישאות.** הרשימה המלאה היא `BANNED_PHRASES` (נספח E §5.2, מיוצאת מ-`lib/ai/prompts/style-data.ts`) — אותה רשימה משמשת את `pnpm lint:copy` (§2.6) ואת מדריך הסגנון של הפרומפטים. אלה דוגמאות: "קחו את העסק לשלב הבא", "פתרון חדשני ומקיף", "בעולם של היום", "זה הזמן ל…", "האם ידעת ש…", "אתה לא תאמין", "חוויית משתמש מושלמת".
12. **בלי אנגלית כשיש עברית טובה**: "יצירה" ולא "Generate", "הורדה" ולא "Download". מילים לועזיות שהשתרשו מותרות: רילס, טיקטוק, הוק, לידים, אינסטגרם, וואטסאפ.
13. **תחילית + מספר לא נשברים בין שורות**: "ב-30 שניות", "ל-3 פורמטים" — דרך `Num` עם `hePrefix` (§10.1).
14. **מילת הפעולה קודם**: "הורדת הסרטון" ולא "הסרטון — להורדה".
15. **אורכים**: כותרת מסך ≤ 6 מילים; תיאור ≤ 2 שורות; טקסט כפתור ≤ 4 מילים (בלי העלות); טוסט ≤ 12 מילים.
16. **"…" רק למצבים שבאמת נמשכים** ("מנתחים את האתר…"), לא כקישוט.
17. **אישור לפני הרס**: שאלה שמזכירה את שם הפריט ואת ההשלכה, וכפתור שמתאר את הפעולה ("מחיקה", לא "כן").
18. **אימוג׳י**: לא בממשק ולא בהודעות מערכת. מותר רק בתוכן שהמשתמש עצמו כותב.
19. **שעות ותאריכים בפורמט ישראלי**: "13 באוקטובר 2026", "14:30", "לפני 5 דקות", "מחר ב-09:00"; השבוע מתחיל ביום ראשון.
20. **מחיר תמיד עם ₪ לפני המספר, בלי רווח, ועם "כולל מע״מ"** בכל מקום שבו מוצג מחיר לצרכן ("₪119 לחודש · כולל מע״מ", "₪95.50", סכום שלילי "−₪50" עם מינוס U+2212). הכלל חל על הממשק, האתר השיווקי, הבלוג, הדפים המשפטיים, המיילים, הודעות הוואטסאפ, מסכי האדמין ושורות החשבונית שאנחנו מנסחים. המימוש: רק `formatIls` / `Price` / `Num` (§2.5, §10.1–10.2) — לעולם לא `Intl.NumberFormat` עם `style: "currency"`, ולעולם לא ₪ שנכתב ידנית ליד מספר ב-`messages/he.json` (משתנה ICU שמעוצב ב-`formatIls`). **החריגים** (פירוט בנספח E §6.1): טקסט ההוקים ב-seed ובפלט של פרומפטי `hooks.*` נכתב "349 ₪" / "{מחיר} ₪"; טקסט שנכנס לסרטון (כותרת ההוק, טקסט על המסך, כתוביות, כרטיס סיום, טקסט הפוסט) עוקב אחרי `brand_kits.shekel_format`; טקסט מוקרא (`vo_tts_he`) לא מכיל ₪ ולא ספרות; מסמכי Morning בפורמט שלהם. המקום היחיד בממשק עם סכום ₪ מילולי: שתי התוויות של בורר הפורמט בעורך ערכת המותג — "₪120" · "120 ₪".

### 2.2 פנייה מגדרית בתוך האפליקציה (`profiles.ui_gender_form`)

המשתמש יכול לבחור בהגדרות איך הממשק פונה אליו: רבים (ברירת מחדל), נקבה או זכר. המנגנון:

- כל מחרוזת נכתבת קודם ברבים. מחרוזות **באפליקציה** שפונות ישירות למשתמש (כותרות שלבים באשף, ברכה בדשבורד, מצבים ריקים, CTA ראשי) כוללות `select` של ICU על הפרמטר `g`:

```json
{
  "wizard": {
    "niche": {
      "title": "{g, select, female {מה העסק שלך?} male {מה העסק שלך?} other {מה העסק שלכם?}}",
      "cta": "{g, select, female {בחרי נישה} male {בחר נישה} other {בחרו נישה}}"
    }
  }
}
```

- הפרמטר `g` מוזרק אוטומטית: `lib/hebrew/ui-gender.ts` מייצא `useUiT(namespace)` (קליינט) ו-`getUiT(namespace)` (שרת), שעוטפים את `useTranslations`/`getTranslations` של next-intl ומוסיפים `g` מתוך `profiles.ui_gender_form` (`plural` ממופה ל-`other`). כשאין משתמש מחובר — תמיד `other`.
- **האתר השיווקי תמיד ברבים** (אין משתמש מזוהה). מיילים — לפי `ui_gender_form` של הנמען.
- שגיאות, מצבי מערכת והמחרוזות המשותפות ב-`common` (§19) נכתבים בניסוח לא אישי, ולכן לא צריכים `select`.
- כש-`female` ו-`male` זהים (כמו בדוגמה, "שלך"), עדיין כותבים את שלושת הענפים — הטסט בודק מבנה, לא תוכן.
- טסט יחידה עובר על `messages/he.json` ומוודא שכל `select` על `g` כולל את שלושת הענפים `female`, `male`, `other`.

### 2.3 מילון מונחים (מחייב)

| מונח בממשק | לא כותבים | הערה |
|---|---|---|
| הוק / הוקים | וו, פתיח, Hook | "ספריית ההוקים" |
| קרדיטים / קרדיט אחד | נקודות, אסימונים, טוקנים | |
| סרטון תדמית | סרט תדמית, פרומו | `brand_promo` |
| רילס | ריל, רילז | יחיד ורבים זהים |
| קריינות | דיבוב, וויס אובר, VO | |
| כתוביות | סאבטייטלים, תרגום | |
| סצנה / סצנות | שוט, קטע | |
| תבנית | טמפלייט | |
| ערכת מותג | ברנד קיט, מיתוג | |
| נישה | קטגוריה, תחום עיסוק | ב-SEO מותר "תחום" |
| יצירה (שם פעולה) | ג׳נרוט, הפקה | "היצירה נכשלה" |
| הרכבה | רינדור | שלב `render` בממשק |
| תצוגה מקדימה | פריוויו | |
| איכות: טיוטה · סטנדרט · פרימיום | Draft, מודל זול/יקר | שמות מודלים רק תחת "מתקדם" |
| ויז׳ואל: תמונות בתנועה · משולב (מומלץ) · וידאו מלא | | `images` · `smart` · `full` |
| סביבת עבודה / סביבת לקוח | וורקספייס | סוכנות |
| ביטול מנוי | הקפאה, עצירת חיוב | הכפתור תמיד בשם הזה |
| כולל מע״מ / לפני מע״מ | +מע"מ | |
| חשבונית מס | קבלה (כשמדובר בחשבונית מס-קבלה) | |
| מנוע | מודל, API | "מנועי ה-AI המובילים" |

סוגי סרטון, תוכניות, רמות איכות ותמהיל ויז׳ואל — בדיוק לפי התוויות בחלק 00 ובנספח F. התוויות של כל ערכי ה-enum מרוכזות במודול אחד, `lib/labels.ts` (מפתחות `common.labels.*`, חלק 02 §1.2), שמשמש את האתר, האפליקציה והאדמין: `brand_promo` סרטון תדמית · `reel_hook` רילס עם הוק · `offer` מבצע / חג · `testimonial` המלצה · `launch` השקה · `recruiting` גיוס עובדים · `explainer` הסבר שירות; `free` חינם · `starter` בסיס · `business` עסק · `agency` סוכנות.

### 2.4 Do / Don't

| מצב | ❌ לא | ✅ כן |
|---|---|---|
| שגיאת יצירה | "שגיאה 500: הבקשה נכשלה" | "לא הצלחנו ליצור את הסצנה. הקרדיטים חזרו אליכם." |
| שדה לא תקין | "הזנת כתובת לא חוקית" | "הכתובת לא נראית תקינה. כדאי לבדוק שאין בה רווחים." |
| שדה חובה | "שדה חובה!" | "צריך למלא את שם העסק" |
| טעינה | "טוען..." | "מנתחים את האתר…" |
| הצלחה | "הפעולה בוצעה בהצלחה" | "נשמר" / "הסרטון מוכן" |
| כפתור יצירה | "צור" | "צרו את הסרטון · 107 קרדיטים" |
| יצירה מחדש של סצנה | "Regenerate" | "יצירה מחדש · 6 קרדיטים" |
| מחיקה | "האם אתה בטוח?" | "למחוק את הפרויקט "מבצע חנוכה"? אי אפשר לשחזר אותו." |
| כפתור במחיקה | "כן" / "לא" | "מחיקה" / "ביטול" |
| מצב ריק | "אין נתונים" | "עוד אין פרויקטים. אפשר להתחיל בסרטון הראשון." |
| לוכסן מגדרי | "הזן/י את המייל" | "הזינו את המייל" |
| קלישאה מתורגמת | "קחו את העסק שלכם לשלב הבא" | "רילס מוכן לשבוע הזה, עם הוק שעוצר גלילה" |
| מחיר | "119 ש"ח" | "₪119 לחודש · כולל מע״מ" |
| ראשי תיבות | נדל"ן (מירכאות ASCII) | נדל״ן (גרשיים U+05F4) |
| זמן יחסי | "2026-10-13T09:12Z" | "לפני 5 דקות" |
| משך | "30 sec" | "30 שנ׳" |
| מספר + תחילית | "ב- 30 שניות" (נשבר בין שורות) | "ב-30 שניות" (`hePrefix`) |
| שם מנוע | "Kling v3.0 Std" בכפתור | "איכות סטנדרט" (שם המנוע רק תחת "מתקדם") |
| המתנה | "אנא המתן" | "זה לוקח בדרך כלל 4–6 דקות. אפשר לסגור את הדף." |
| כסף שהוחזר | "בוצע זיכוי" | "6 קרדיטים חזרו ליתרה שלכם" |
| הגבלת תוכנית | "פיצ׳ר לא זמין" | "איכות פרימיום זמינה בתוכנית עסק ומעלה" |
| כרטיס נדחה | "Transaction declined" | "הכרטיס לא אושר. אפשר לעדכן אמצעי תשלום ולנסות שוב." |
| אנגלית מיותרת | "Upload your logo" | "העלאת לוגו" |
| סימני קריאה | "מוכן!! 🎉" | "הסרטון מוכן" |
| הודעה בימי זיכרון | "מבצע לכבוד יום הזיכרון" | (אין הצעת קידום; באנר מאופק בלבד) |

### 2.5 פורמטים: מספרים, תאריכים, זמן ומטבע (`lib/format/`)

כל הפורמטים עוברים דרך פונקציות אחידות ב-`lib/format/index.ts`. אסור `toLocaleString()` אד-הוק בקומפוננטות.

```ts
// lib/format/index.ts — single source for UI formatting (he-IL, Asia/Jerusalem, ILS)
export const LOCALE = "he-IL" as const;
export const TIME_ZONE = "Asia/Jerusalem" as const;

export function formatInteger(n: number): string;                  // 1,000
export function formatDecimal(n: number, digits?: number): string; // 1.25
export function formatPercent(fraction: number, digits?: number): string; // 0.2 -> "20%"
export function formatSigned(n: number): string;                  // +70 / −50 (U+2212 minus)
export function formatCompact(n: number): string;                 // 12.5K -> "12.5 אלף"
export function formatIls(amount: number, opts?: { agorot?: "auto" | "always" }): string; // "₪119" / "₪1,140" / "₪95.50"
export function formatDuration(totalSec: number): string;          // 30 -> "0:30", 75 -> "1:15"
export function formatDurationWords(totalSec: number): string;     // 30 -> "30 שנ׳", 90 -> "דקה וחצי"
export function formatTimecode(ms: number): string;                // 12400 -> "00:12.4" (mono)
export function formatDate(d: Date | string, style?: "long" | "short" | "numeric"): string; // "13 באוקטובר 2026" / "13.10.2026"
export function formatDateTime(d: Date | string): string;         // "13 באוקטובר 2026, 14:30"
export function formatRelative(d: Date | string, now?: Date): string; // "לפני 5 דקות" / "מחר ב-09:00"
export function formatPhoneIL(raw: string): string;                // "+972501234567" -> "050-123-4567"
export function normalizePhoneIL(raw: string): string | null;      // -> E.164 "+972501234567" or null
```

כללים: `formatIls` מחזיר תמיד ₪ לפני המספר (לא דרך `style: "currency"`, שב-he-IL שם את הסימן אחרי המספר ומוסיף תווי כיווניות), בלי אגורות כשהסכום שלם (`agorot: "always"` מציג תמיד שתי ספרות); ריווח אלפים בפסיק; מינוס טיפוגרפי (U+2212) לפני הסימן בסכומים שליליים ("−₪50"). זו הפונקציה היחידה שמציגה סכום בשקלים. חלק 06 משתמש ב-`formatAgorot(a, opts)` מ-`lib/billing/money.ts`, שעוטפת את הפונקציה הזו (`formatIls(a / 100, opts)`) — קוד חיוב, מיילים ושורות חשבונית קוראים לה; רכיבי React משתמשים ב-`Price`. `formatRelative` משתמש ב-`Intl.RelativeTimeFormat('he', { numeric: 'auto' })` ("אתמול", "מחר"); מעל 7 ימים — תאריך מלא. date-fns v4 עם הלוקאל `he` משמש לחישובים (תחילת שבוע = ראשון), לא לטקסט.

### 2.6 `pnpm lint:copy` (`scripts/lint-copy.ts`)

בודק את `messages/he.json`, את קובצי `content/**/*.{mdx,json}` ואת תבניות המייל (חלק 06 §12). רץ ב-CI לצד `lint:rtl`. שגיאה = exit code 1, עם קובץ, מפתח ושורה.

| כלל | מה נתפס | רמה |
|---|---|---|
| ביטויים אסורים | כל ביטוי מ-`BANNED_PHRASES` (מיובא מ-`lib/ai/prompts/style-data.ts` — אין רשימה מקומית) | שגיאה |
| מגדר | לוכסן בין אותיות עבריות (`[א-ת]/[א-ת]`), נקודה מגדרית (`·ות`, `.ות`), סוגריים מגדריים (`(ה)`, `(ות)`, `(ית)`), כפילויות "X או Xת"/"X או Xה" — חוץ ממפתחות ברשימת החריגים של §2.1 סעיף 1 | שגיאה |
| פיסוק | `!!`, `...` במקום `…`, מירכאות ASCII `"` בתוך מילה עברית (נדל"ן), "הכל" | שגיאה |
| מטבע | ₪ צמוד לספרה בטקסט קבוע (חוץ משתי תוויות `shekel_format`, §2.1 סעיף 20); "ש״ח"/"ש"ח" אחרי מספר | שגיאה |
| מע״מ | "18%" או "17%" כתובים ידנית (שיעור המע״מ מגיע מ-`app_settings.vat_rate`, חלק 06) | שגיאה |
| טקסט זמני | התאמה לביטויים `\bT[B]D\b`, `\blor[e]m\b` (בלי רגישות לאותיות) ו-`\bTODO\b`, וטקסט בסוגריים מרובעים בערכים (חוץ מקובצי `*.example.json`, ש-`scripts/check-content.ts` של חלק 02 בודק) | שגיאה |
| אנגלית | ערך ב-`messages/he.json` בלי אף אות עברית, חוץ מרשימת היתר (שמות מותג ומנועים, "Black Friday", קודי מקשים) | אזהרה |

### קריטריוני קבלה
- [ ] `pnpm lint:copy` ירוק על הריפו, ונכשל על פיקסצ׳ר שמכיל כל אחד מהכללים בטבלה (`tests/fixtures/copy-lint/*.json`).
- [ ] `lint-copy.ts` מייבא את `BANNED_PHRASES` ולא מחזיק רשימה משלו (grep על ביטוי מהרשימה בתוך `scripts/`).
- [ ] כל `select` על `g` כולל `female`/`male`/`other`; בפרופיל עם `ui_gender_form='female'` הדשבורד והאשף פונים בנקבה.
- [ ] אין ב-`components/` אף מחרוזת עברית ישירה (ESLint `no-literal-string` לעברית; חריג: משתני המותג).
- [ ] `lib/format` מכוסה בבדיקות יחידה לכל פונקציה, כולל ₪ שלילי ("−₪50"), 0, אלפים, אגורות (`agorot: "always"`), אחוזים ו-`formatPhoneIL` עם `+972`, `972` ו-`05X`; `formatAgorot(9550)` מחזיר "₪95.50".

---

## §3. כיוון חזותי: "בכורה" (כהה, ברירת מחדל) ו"אור יום" (בהירה)

### 3.1 ההחלטה

**"בכורה" (Premiere) היא שפת המותג, האתר והאפליקציה, בערכת נושא כהה כברירת מחדל.** לצידה ערכת נושא בהירה מלאה בהשראת "אור יום": רקע נייר חם ודיו שחור, כשזהב המקרן נשאר צבע המילוי של הכפתור הראשי. הסיבות: וידאו בולט על רקע כמעט-שחור; זהב (ולא סגול) מבדיל אותנו מאתרי ה-AI-video הגלובליים; עורכי וידאו מקצועיים הם כהים מטבעם.

**האווירה:** ערב בכורה בקולנוע תל-אביבי. אולם שחור, אלומת זהב של מקרן, ורוד של שטיח אדום, הילה סגולה, גרעין של פילם 35 מ״מ, ותמונות סטילס בפורמט קולנועי.

**עיקרון התנועה:** "המצלמה זזה, לא הרהיטים" — תנועה רק כשהיא מספרת משהו (וידאו, התקדמות, מעבר בין שלבים), אף פעם לא כקישוט שחוזר על עצמו בכל רכיב.

### 3.2 אפקטים חתימתיים (רק בערכה הכהה)

| אפקט | מפרט | איפה | מגבלות |
|---|---|---|---|
| אלומת מקרן | `radial-gradient(60% 50% at var(--beam-x) 0%, rgb(255 181 71 / .18), transparent 70%)`; `--beam-x` = 25% ב-RTL (צד הסוף, שמאל), 75% ב-LTR | מאחורי ה-hero, `FinalCtaBand`, תמונות OG | אחת לכל אזור |
| הילת after-glow | שני radial: ורוד `rgb(255 79 123 / .14)` ב-20%/80%, סגול `rgb(142 123 255 / .12)` ב-85%/70% | סקשנים מרכזיים בדף הבית | לא באפליקציה |
| מילה בגרדיאנט זהב | `linear-gradient(180deg,#FFD58A,#FFB547 60%,#E8902A)` עם `background-clip:text` | **מילה אחת** ב-H1 ("תדמית") | בערכה בהירה הופך לסימון מרקר לימון |
| זכוכית | `--color-glass` + `backdrop-filter: blur(16px) saturate(140%)` + קו תחתון `rgb(255 255 255 / .06)` | `MarketingHeader` אחרי גלילה, `MobileStickyCta`, מסגרת התצוגה המקדימה | רק על UI צף |
| גרעין פילם | SVG `feTurbulence` (baseFrequency .8, numOctaves 2) ב-5% ו-`mix-blend-mode: overlay` | שכבת `film-grain` במעטפת השיווקית בלבד | כבוי בבהירה, ב-`data-motion="reduce"` וב-`prefers-reduced-transparency` |
| אריחי פילם | רדיוס 14px, קו פנימי 1px `--color-frame`, ב-hover קרן גבול זהב (`BorderBeam`) | `VideoTile` בשיווק | ב-app: רק `elev-2` ב-hover |
| חשיפת לטרבוקס | פסים שחורים שמתכווצים מ-2.39:1 ליחס הסופי, 900ms | וידאו ראשי ב-`ShowcaseGallery`/`NicheShowcase` | לא על אלמנט ה-LCP; כבוי ב-reduce |
| סריקת מקרן על ה-CTA | הבהוב זהב אלכסוני על כפתור ה-CTA הראשי כל 6 שניות | CTA אחד בכל דף שיווקי | כבוי ב-reduce |

**ערכה בהירה:** בלי גרעין ובלי זוהר. צללים רכים, כרטיסי "נייר" עם קו 1px, ומרקר לימון מתחת למילות מפתח (`linear-gradient(transparent 62%, #FFE14D 62%)` עם `box-decoration-break: clone`).

**כמה אפקטים כבדים בדף:** לכל היותר 3 "כבדים" (וידאו אוטומטי ברצף, גלילה מוצמדת של GSAP, canvas/WebGL, `PlaceholdersAndVanishInput`). בדף הבית: `VideoWall` + `HowItWorks` המוצמד + `Compare` של `EditorMath`. כל השאר CSS בלבד.

### קריטריוני קבלה
- [ ] בדף הבית מופעלים לכל היותר 3 אפקטים כבדים, וכולם נטענים בעצלות אחרי ה-LCP.
- [ ] הגרדיאנט הזהוב מופיע על מילה אחת בלבד בכל דף.
- [ ] בערכה הבהירה אין גרעין, אין `glow` ואין אלומת מקרן (צילום Playwright בשתי הערכות).

---

## §4. טוקני עיצוב: `app/globals.css`

### 4.1 עקרונות

- **Tailwind CSS v4.3+, CSS-first.** כל הטוקנים ב-`@theme`. אין `tailwind.config.js`. (`inset-s-*`/`inset-e-*` נוספו ב-v4.2, ומ-v4.3 הקנוניזציה ממירה את `start-*`/`end-*` הישנים אליהם — לכן המינימום הוא 4.3.)
- **שכבות CSS (cascade layers):** Tailwind v4 משתמש בשכבות נייטיב `theme → base → components → utilities`, וכלל שנכתב **מחוץ** לשכבה גובר על כל כלל שבתוך שכבה, בלי קשר לספציפיות. לכן: משתנים שהערכה הבהירה דורסת יושבים ב-`@layer base` (לא ב-`:root` חשוף), ודריסה של utility מותאם (`glass`, `bg-projector`, `text-gold-gradient`) נכתבת בתוך ה-`@utility` עצמו ולא ב-`@layer components`.
- **הערכה הכהה היא ערכי ברירת המחדל** ב-`@theme`. הערכה הבהירה דורסת את אותם משתנים תחת `:root[data-theme="light"]`. רכיבים כמעט אף פעם לא צריכים `dark:`/`light:` — הם משתמשים בטוקנים.
- **הפלטה הדיפולטית של Tailwind מאופסת** (`--color-*: initial`), כדי שאי אפשר יהיה לכתוב `bg-red-500` "בטעות". צבע שלא קיים כטוקן — לא קיים.
- **שמות ה-utilities:** טוקן צבע `--color-X` מייצר `text-X` / `bg-X` / `border-X` (למשל `text-text-2`, `bg-surface-2`, `border-border-strong`, `text-primary-text`, `text-muted`). בטבלאות של החלק הזה מוזכר שם הטוקן בלי הקידומת (`text-2`, `surface-3`). `text-small`/`text-micro` הם גדלי גופן (`--text-*`), לא צבעים.
- **גשר ל-shadcn/ui** ב-`@theme inline`: השמות ש-shadcn מצפה להם (`background`, `foreground`, `card`, `primary-foreground`, `input`, `ring`…) מצביעים על הטוקנים שלנו.
- **`--color-muted` הוא צבע טקסט** (מטא, כיתובים), כפי שמוגדר בנספח F §11.2. לכן אסור `bg-muted` (ב-shadcn זה רקע): `scripts/lint-rtl.ts` חוסם אותו, ובכל רכיב shadcn מחליפים ל-`bg-surface-2` (§8.4).
- **צללים וזוהר** מוגדרים כמשתני CSS רגילים לכל ערכה, עם utilities ייעודיות (`elev-1/2/3`, `glow-primary`, `glow-ai`), כי Tailwind מטמיע ערכי `--shadow-*` של ה-theme בזמן build ואז אי אפשר לדרוס אותם לפי ערכה.

### 4.2 הקובץ המלא

```css
/* app/globals.css — design tokens & base styles.
   Dark ("Premiere") is the default theme; light overrides live under :root[data-theme="light"]. */
@import "tailwindcss";

/* ---------- Variants ---------- */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
@custom-variant light (&:where([data-theme="light"], [data-theme="light"] *));
@custom-variant reduced (&:where([data-motion="reduce"], [data-motion="reduce"] *));

/* ---------- Color tokens (dark = default) ---------- */
@theme static {
  --color-*: initial;
  --color-white: #FFFFFF;
  --color-black: #000000;

  --color-bg: #08080C;
  --color-surface-1: #121219;
  --color-surface-2: #1A1A24;
  --color-surface-3: #23232F;
  --color-border: #2A2A38;          /* decorative hairlines only */
  --color-border-strong: #686884;   /* inputs, toggles: >= 3:1 */
  --color-text: #F5F4F0;
  --color-text-2: #A3A3B5;
  --color-muted: #8A8AA0;           /* TEXT color for meta/captions — never a background */
  --color-primary: #FFB547;         /* projector gold: CTA fill */
  --color-primary-hover: #FFC56B;
  --color-on-primary: #0A0A0F;      /* ink on gold 11.24:1 */
  --color-primary-text: #FFB547;    /* gold used as text */
  --color-focus: #FFB547;
  --color-rose: #FF4F7B;
  --color-violet: #8E7BFF;
  --color-link: #8E7BFF;
  --color-success: #3DDC97;
  --color-danger: #FF6B6B;
  --color-on-danger: #0A0A0F;       /* ink on #FF6B6B 7.12:1 (white fails: 2.78:1) */
  --color-lemon: #FFE14D;           /* on-primary ink on lemon 15.17:1 */
  --color-glass: rgb(18 18 25 / 0.6);
  --color-overlay: rgb(4 4 8 / 0.72);
  --color-frame: rgb(255 255 255 / 0.08);
}

/* ---------- shadcn/ui bridge + fonts + aspect (resolved at use site) ---------- */
@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-card: var(--color-surface-1);
  --color-card-foreground: var(--color-text);
  --color-popover: var(--color-surface-2);
  --color-popover-foreground: var(--color-text);
  --color-primary-foreground: var(--color-on-primary);
  --color-secondary: var(--color-surface-2);
  --color-secondary-foreground: var(--color-text);
  --color-muted-foreground: var(--color-muted);
  --color-accent: var(--color-surface-3);
  --color-accent-foreground: var(--color-text);
  --color-destructive: var(--color-danger);
  --color-destructive-foreground: var(--color-on-danger);
  --color-input: var(--color-border-strong);
  --color-ring: var(--color-focus);
  --color-sidebar: var(--color-surface-1);
  --color-sidebar-foreground: var(--color-text);
  --color-sidebar-primary: var(--color-primary);
  --color-sidebar-primary-foreground: var(--color-on-primary);
  --color-sidebar-accent: var(--color-surface-3);
  --color-sidebar-accent-foreground: var(--color-text);
  --color-sidebar-border: var(--color-border);
  --color-sidebar-ring: var(--color-focus);
  --color-chart-1: var(--color-primary);
  --color-chart-2: var(--color-violet);
  --color-chart-3: var(--color-rose);
  --color-chart-4: var(--color-success);
  --color-chart-5: var(--color-text-2);

  --font-sans: var(--font-heebo), "Arial Hebrew", "Noto Sans Hebrew", Arial, system-ui, sans-serif;
  --font-display: var(--font-karantina), var(--font-heebo), "Arial Hebrew", sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "SFMono-Regular", Menlo, monospace;

  --aspect-reel: var(--ar-reel);
  --aspect-feed: var(--ar-feed);
  --aspect-square: var(--ar-square);
  --aspect-wide: var(--ar-wide);
  --aspect-cine: var(--ar-cine);
}

/* ---------- Scale tokens (theme-independent) ---------- */
@theme {
  --breakpoint-*: initial;
  --breakpoint-xs: 24.375rem;  /* 390px  mobile baseline */
  --breakpoint-sm: 40rem;      /* 640px  kept only because shadcn primitives use sm: */
  --breakpoint-md: 48rem;      /* 768px  */
  --breakpoint-lg: 64rem;      /* 1024px */
  --breakpoint-xl: 80rem;      /* 1280px */
  --breakpoint-2xl: 96rem;     /* 1536px */

  /* Hebrew-tuned defaults used by shadcn primitives */
  --text-xs: 0.8125rem;  --text-xs--line-height: 1.4;
  --text-sm: 0.9375rem;  --text-sm--line-height: 1.6;
  --text-base: 1.0625rem; --text-base--line-height: 1.7;
  --text-lg: 1.1875rem;  --text-lg--line-height: 1.7;

  /* Brand type scale */
  --text-display: clamp(3.25rem, 2rem + 6vw, 7.5rem);   --text-display--line-height: 0.98; --text-display--font-weight: 700;
  --text-h1: clamp(2.25rem, 1.6rem + 3vw, 4.25rem);     --text-h1--line-height: 1.08;      --text-h1--font-weight: 800;
  --text-h2: clamp(1.75rem, 1.3rem + 2vw, 3rem);        --text-h2--line-height: 1.15;      --text-h2--font-weight: 700;
  --text-h3: clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem);  --text-h3--line-height: 1.25;      --text-h3--font-weight: 700;
  --text-body-lg: 1.1875rem; --text-body-lg--line-height: 1.7;
  --text-body: 1.0625rem;    --text-body--line-height: 1.7;
  --text-small: 0.9375rem;   --text-small--line-height: 1.6;
  --text-micro: 0.8125rem;   --text-micro--line-height: 1.4;   --text-micro--font-weight: 600;

  --radius-xs: 6px;   /* badges */
  --radius-sm: 10px;  /* inputs, chips, segmented controls */
  --radius-md: 14px;  /* cards, video tiles */
  --radius-lg: 20px;  /* panels, modals, sheets */
  --radius-xl: 28px;  /* hero prompt card */
  /* pills (CTAs, credits meter) use rounded-full */

  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);

  --animate-marquee: marquee var(--marquee-duration, 40s) linear infinite;
  --animate-marquee-y: marquee-y var(--marquee-duration, 45s) linear infinite;
  --animate-shimmer: shimmer 1.6s linear infinite;
  --animate-sweep: projector-sweep 6s var(--ease-in-out) infinite;
  --animate-pulse-dot: pulse-dot 1.4s var(--ease-in-out) infinite;

  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(var(--marquee-shift)); } }
  @keyframes marquee-y { from { transform: translateY(0); } to { transform: translateY(calc(-50% - var(--marquee-gap, 16px) / 2)); } }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  @keyframes projector-sweep { 0%, 82% { background-position: 150% 0; } 100% { background-position: -50% 0; } }
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
}

/* ---------- Raw variables (non-Tailwind) + light theme ----------
   Everything that the light theme overrides MUST live in a layer: an unlayered :root rule
   would beat the layered :root[data-theme="light"] rule regardless of specificity. */
@layer base {
  :root {
    color-scheme: dark;
    --ar-reel: 9 / 16; --ar-feed: 4 / 5; --ar-square: 1 / 1; --ar-wide: 16 / 9; --ar-cine: 2.39 / 1;

    --z-base: 0; --z-sticky: 40; --z-dropdown: 50; --z-overlay: 60; --z-modal: 70; --z-toast: 80;

    --duration-hover: 120ms; --duration-press: 200ms; --duration-panel: 320ms;
    --duration-reveal: 600ms; --duration-letterbox: 900ms; --duration-reduced: 150ms;

    --shadow-1: 0 1px 0 rgb(255 255 255 / .04) inset, 0 1px 2px rgb(0 0 0 / .6);
    --shadow-2: 0 8px 24px rgb(0 0 0 / .45), 0 1px 0 rgb(255 255 255 / .05) inset;
    --shadow-3: 0 24px 64px rgb(0 0 0 / .6);
    --glow-primary: 0 0 0 1px rgb(255 181 71 / .5), 0 8px 32px rgb(255 181 71 / .25);
    --glow-ai: 0 0 0 1px rgb(142 123 255 / .45), 0 0 40px rgb(142 123 255 / .2);

    --beam-x: 25%;               /* end side in RTL */
    --header-h: 0px;             /* set per shell below */
    --bottom-bar-h: 0px;
    --marquee-gap: 16px;
    --marquee-shift: calc(-50% - var(--marquee-gap) / 2);   /* LTR: content moves toward the left */
  }
  :root[dir="ltr"] { --beam-x: 75%; }
  :root[dir="rtl"] { --marquee-shift: calc(50% + var(--marquee-gap) / 2); } /* RTL: items enter from the end (left) */

  /* Shell heights drive scroll-padding so sticky bars never hide focused elements (WCAG 2.4.11) */
  :root:has([data-shell="marketing"]) { --header-h: 64px; }
  :root:has([data-shell="app"]) { --header-h: 56px; }
  @media (max-width: 47.99rem) {
    :root:has([data-shell="marketing"]) { --bottom-bar-h: 72px; }  /* MobileStickyCta */
    :root:has([data-shell="app"]) { --bottom-bar-h: 64px; }        /* MobileTabBar */
  }

  /* ---------- Light theme (same layer, higher specificity => wins) ---------- */
  :root[data-theme="light"] {
    color-scheme: light;
    --color-bg: #FAF7F2;
    --color-surface-1: #FFFFFF;
    --color-surface-2: #F1ECE4;
    --color-surface-3: #E9E2D7;
    --color-border: #E4DDD1;
    --color-border-strong: #8C8577;
    --color-text: #16140F;
    --color-text-2: #5A554C;
    --color-muted: #6F6A60;          /* allowed on bg / surface-1 / surface-2 only (4.18:1 on surface-3) */
    --color-primary: #FFB547;        /* fill only, always with ink text */
    --color-primary-hover: #FFC56B;
    --color-on-primary: #0A0A0F;
    --color-primary-text: #9A5B00;   /* 5.08:1 on paper */
    --color-focus: #1F3DFF;          /* ultramarine ring, 6.20:1 on paper */
    --color-rose: #C2185B;
    --color-violet: #5B47E0;
    --color-link: #5B47E0;
    --color-success: #0B7A53;
    --color-danger: #C62F1D;
    --color-on-danger: #FFFFFF;
    --color-lemon: #FFE14D;
    --color-glass: rgb(255 255 255 / 0.72);
    --color-overlay: rgb(22 20 15 / 0.42);
    --color-frame: rgb(22 20 15 / 0.08);

    --shadow-1: 0 1px 2px rgb(22 20 15 / .06);
    --shadow-2: 0 6px 20px rgb(22 20 15 / .08);
    --shadow-3: 0 20px 50px rgb(22 20 15 / .12);
    --glow-primary: 0 6px 20px rgb(22 20 15 / .10);
    --glow-ai: 0 0 0 1px rgb(91 71 224 / .35);
  }

  @media (prefers-contrast: more) {
    :root, :root[data-theme="light"] { --color-text-2: var(--color-text); --color-border: var(--color-border-strong); }
  }

  html {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    scroll-padding-top: calc(var(--header-h) + 8px);
    scroll-padding-bottom: calc(var(--bottom-bar-h) + 8px);
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  body { background: var(--color-bg); font-size: var(--text-body); line-height: 1.7; min-height: 100dvh; }
  h1, h2, h3, h4 { text-wrap: balance; letter-spacing: 0; }
  p, li, dd, figcaption { text-wrap: pretty; }
  * { hyphens: none; letter-spacing: 0; }
  em, i, cite { font-style: normal; font-weight: 700; }
  bdi, .num { font-variant-numeric: tabular-nums; }
  code, kbd, samp, pre { font-family: var(--font-mono); direction: ltr; unicode-bidi: isolate; }
  ::selection { background: color-mix(in oklab, var(--color-primary) 35%, transparent); color: var(--color-text); }
  :focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  [hidden] { display: none !important; }
}

/* ---------- Brand utilities ---------- */
@utility num { font-variant-numeric: tabular-nums; }
@utility elev-1 { box-shadow: var(--shadow-1); }
@utility elev-2 { box-shadow: var(--shadow-2); }
@utility elev-3 { box-shadow: var(--shadow-3); }
@utility glow-primary { box-shadow: var(--glow-primary); }
@utility glow-ai { box-shadow: var(--glow-ai); }
@utility glass {
  background: var(--color-glass);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  backdrop-filter: blur(16px) saturate(140%);
  @media (prefers-reduced-transparency: reduce) {
    background: var(--color-surface-1); -webkit-backdrop-filter: none; backdrop-filter: none;
  }
}
@utility container-marketing { width: 100%; max-width: 1240px; margin-inline: auto; padding-inline: 16px; @media (width >= 48rem) { padding-inline: 24px; } }
@utility reading { max-width: 68ch; }
@utility frame-tile { border-radius: var(--radius-md); box-shadow: inset 0 0 0 1px var(--color-frame); overflow: hidden; }
/* Light-theme overrides of custom utilities live INSIDE the utility (utilities layer beats components layer) */
@utility bg-projector {
  background-image: radial-gradient(60% 50% at var(--beam-x) 0%, rgb(255 181 71 / .18), transparent 70%);
  [data-theme="light"] & { background-image: none; }            /* light: no projector beam */
}
@utility bg-afterglow {
  background-image: radial-gradient(40% 40% at 20% 80%, rgb(255 79 123 / .14), transparent), radial-gradient(35% 35% at 85% 70%, rgb(142 123 255 / .12), transparent);
  [data-theme="light"] & { background-image: none; }
}
@utility text-gold-gradient {
  background-image: linear-gradient(180deg, #FFD58A, #FFB547 60%, #E8902A);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
  [data-theme="light"] & {                                         /* light: lemon highlighter instead of gold text */
    background-image: linear-gradient(transparent 62%, var(--color-lemon) 62%);
    -webkit-background-clip: border-box; background-clip: border-box; color: var(--color-text);
  }
}
@utility shimmer-ai {
  background-image: linear-gradient(90deg, var(--color-surface-2) 0%, color-mix(in oklab, var(--color-violet) 22%, var(--color-surface-2)) 50%, var(--color-surface-2) 100%);
  background-size: 200% 100%;
  animation: var(--animate-shimmer);
}

@layer components {
  /* Film grain — marketing shell only */
  .film-grain { position: relative; isolation: isolate; }
  .film-grain::after {
    content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: .05; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  :root[data-theme="light"] .film-grain::after, :root[data-motion="reduce"] .film-grain::after { display: none; }
  @media (prefers-reduced-transparency: reduce) {
    .film-grain::after { display: none; }   /* .glass handles this inside its @utility */
  }

  /* Long-read typography: blog, legal, hooks intros (both themes) */
  .prose-he { max-width: 68ch; font-size: 1.125rem; line-height: 1.75; color: var(--color-text); }
  .prose-he :where(h2) { font-size: var(--text-h2); line-height: 1.15; font-weight: 700; margin-block: 2.2em .6em; }
  .prose-he :where(h3) { font-size: var(--text-h3); line-height: 1.25; font-weight: 700; margin-block: 1.8em .5em; }
  .prose-he :where(p, ul, ol, blockquote, table, pre, figure) { margin-block: 0 1.1em; }
  .prose-he :where(ul) { list-style: disc; padding-inline-start: 1.4em; }
  .prose-he :where(ol) { list-style: decimal; padding-inline-start: 1.4em; }
  .prose-he :where(li) { margin-block: .35em; }
  .prose-he :where(a) { color: var(--color-link); text-decoration: underline; text-underline-offset: .22em; text-decoration-thickness: 1px; }
  .prose-he :where(a:hover) { text-decoration-thickness: 2px; }
  .prose-he :where(blockquote) { border-inline-start: 3px solid var(--color-primary); padding-inline-start: 1em; color: var(--color-text-2); }
  .prose-he :where(strong, b) { font-weight: 700; }
  .prose-he :where(code) { font-size: .9em; background: var(--color-surface-2); border-radius: var(--radius-xs); padding: .1em .35em; }
  .prose-he :where(table) { width: 100%; border-collapse: collapse; font-size: 1rem; }
  .prose-he :where(th, td) { border-block-end: 1px solid var(--color-border); padding: .6em .8em; text-align: start; vertical-align: top; }
  .prose-he :where(th) { color: var(--color-text-2); font-weight: 600; }
  .prose-he :where(hr) { border: 0; border-block-start: 1px solid var(--color-border); margin-block: 2.5em; }
}

/* ---------- Reduced motion: OS preference OR the global toggle ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: var(--duration-reduced) !important; scroll-behavior: auto !important;
  }
}
:root[data-motion="reduce"] *, :root[data-motion="reduce"] *::before, :root[data-motion="reduce"] *::after {
  animation-duration: .01ms !important; animation-iteration-count: 1 !important;
  transition-duration: var(--duration-reduced) !important; scroll-behavior: auto !important;
}

/* ---------- Forced colors (Windows High Contrast) ---------- */
@media (forced-colors: active) {
  .text-gold-gradient { background: none; color: CanvasText; }
  .frame-tile { outline: 1px solid CanvasText; }
  :focus-visible { outline-color: Highlight; }
}
```

> הערת M0 [M0-verify]: `@theme static` (פליטת כל משתני הצבע גם כשאין להם utility בשימוש), `@custom-variant` עם בורר `:where`, ו-CSS מקונן בתוך `@utility` (`[data-theme="light"] &`, `@media`) הם תחביר Tailwind v4. בודקים ב-build של M0 שהמחלקות `bg-projector`, `text-gold-gradient` ו-`glass` מקבלות את הדריסה בבהירה וב-`prefers-reduced-transparency`. אם גרסה מותקנת מתנהגת אחרת — מתעדים ב-`DECISIONS.md` ומשמרים את אותם שמות טוקנים ו-utilities.

### 4.3 טבלת ניגודיות (מחושבת לפי WCAG 2.x)

| זוג (טקסט / רכיב על רקע) | כהה | בהירה | סף נדרש |
|---|---|---|---|
| `text` על `bg` / `surface-1` / `surface-3` | 18.17 / 16.94 / 14.10 | 17.22 / 18.40 / 14.31 | 4.5 |
| `text-2` על `bg` / `surface-2` / `surface-3` | 8.06 / 6.95 / 6.26 | 6.92 / 6.29 / 5.75 | 4.5 |
| `muted` על `bg` / `surface-2` / `surface-3` | 5.93 / 5.11 / 4.60 | 5.03 / 4.57 / **4.18 ✗** | 4.5 |
| `primary-text` על `bg` / `surface-2` / `surface-3` | 11.38 / 9.82 / 8.83 | 5.08 / 4.61 / **4.22 ✗** (5.43 על `surface-1`) | 4.5 |
| `on-primary` על `primary` (כפתור ראשי) / על `primary-hover` | 11.24 / 12.65 | 11.24 / 12.65 | 4.5 |
| `on-primary` על `lemon` (תג "הוק", `PlaceholderChip`) | 15.17 | 15.17 | 4.5 |
| `on-danger` על `danger` (כפתור מסוכן) | 7.12 | 5.49 | 4.5 |
| `rose` כטקסט על `bg` / `surface-2` | 6.34 / 5.47 | 5.50 / 4.99 | 4.5 |
| `violet` / `link` על `bg` / `surface-2` | 6.12 / 5.28 | 5.74 / 5.22 | 4.5 |
| `success` / `danger` כטקסט על `bg` | 11.31 / 7.20 | 5.01 / 5.14 | 4.5 |
| `success` / `danger` כטקסט על `surface-2` | 9.76 / 6.22 | 4.55 / 4.67 | 4.5 |
| `border-strong` (גבול שדה) על `surface-1` / `surface-2` / `bg` | 3.46 / 3.21 / 3.71 | 3.66 / 3.11 / 3.43 | 3.0 |
| טבעת פוקוס (`focus`) על `bg` / `surface-2` | 11.38 / 9.82 | 6.20 / 5.63 | 3.0 |
| זהב `primary` כאינדיקטור לא-טקסטואלי (מילוי `Progress`, טבעת `CreditsMeter`, טבעת "נבחר") על `bg` | 11.38 | **1.64 ✗** → `primary-text` 5.08 | 3.0 |
| ירוק וואטסאפ `#25D366` (אייקון) על `bg` | 10.08 | **1.86 ✗** → `currentColor` | 3.0 |

**כללים שנובעים מהטבלה:**
1. בערכה הבהירה `muted` ו-`primary-text` לא יושבים על `surface-3` (hover/selected) — שם משתמשים ב-`text-2` (5.75).
2. `border` (קו דקורטיבי, 1.42/1.26) לעולם לא הגבול היחיד שמזהה שדה, מתג או צ׳קבוקס — רק `border-strong`.
3. זהב (`primary`) כטקסט בערכה הבהירה — רק דרך `primary-text`. הכפתור הראשי נשאר זהב עם דיו בשתי הערכות; בבהירה מוסיפים לו `inset 0 0 0 1px rgb(22 20 15 / .18)` כדי שגבולו ייראה על הנייר (הטקסט שבתוכו מזהה אותו, ולכן הגבול הוא שיפור ולא דרישה).
4. כפתור מסוכן: מילוי `danger` עם `on-danger` (דיו בכהה, לבן בבהירה). לבן על `#FF6B6B` נכשל (2.78:1).
5. כתוביות בסרטון: הניגודיות מובטחת בקו מתאר או בקופסה (§16), לא בצבע לבד.
6. **אינדיקטורים לא-טקסטואליים (WCAG 1.4.11):** כל מקום שבו הזהב מסמן מצב או ערך בלי טקסט לידו — מילוי `Progress variant="default"`, טבעת `CreditsMeter`, טבעת `selected` של `Card`/`SceneCard`, הפס הפעיל ב-`SidebarNav` — משתמש ב-`primary-text` ולא ב-`primary` (בכהה הם זהים; בבהירה `primary` הוא 1.64:1 בלבד).
7. `WhatsAppIcon` בירוק המותג רק על משטח כהה; בערכה הבהירה ועל כל משטח בהיר — מונוכרום `currentColor`.

`tests/unit/contrast.test.ts` קורא את `app/globals.css`, מחלץ את ערכי שתי הערכות ומחשב מחדש כל זוג בטבלה (פונקציית luminance לפי WCAG ב-`lib/format/contrast.ts`, שמשמשת גם את אזהרות ערכת המותג): זוג רגיל חייב לעבור את הסף, וזוג שמסומן ✗ חייב להישאר מתחתיו — כך שינוי טוקן שמשנה את המצב מכשיל את הטסט ומחייב לעדכן את הטבלה ואת הכללים.

### קריטריוני קבלה
- [ ] `pnpm build` עובר עם הקובץ כפי שהוא; `bg-red-500` (או כל צבע דיפולטי) לא מייצר CSS.
- [ ] `contrast.test.ts` ירוק לכל זוגות הטבלה בשתי הערכות.
- [ ] החלפת `data-theme` ב-DevTools מחליפה את כל הממשק בלי רענון ובלי רכיב "תקוע" בצבע הכהה.
- [ ] ב-`prefers-contrast: more` טקסט משני הופך לטקסט ראשי והקווים מתחזקים.

---

## §5. טיפוגרפיה עברית

### 5.1 `app/fonts.ts`

```ts
// app/fonts.ts — UI fonts via next/font (self-hosted at build, no runtime request to Google)
import { Heebo, Karantina, JetBrains_Mono } from "next/font/google";

/** UI + body. Variable font (100–900); we use 400–900. Preloaded: it renders the LCP H1. */
export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Arial Hebrew", "Noto Sans Hebrew", "Arial", "sans-serif"],
});

/** Display: 1–3 huge words or big numbers only. Static font, 700 only. */
export const karantina = Karantina({
  subsets: ["hebrew", "latin"],
  weight: ["700"],
  variable: "--font-karantina",
  display: "swap",
  preload: false,
  fallback: ["Arial Hebrew", "sans-serif"],   // Heebo comes next in --font-display (§4.2); "Heebo" by name is not installed locally
});

/** Mono: timecodes, IDs, JSON in admin. Latin only (timecodes are LTR). */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
```

**גופני הכתוביות וערכת המותג בדפדפן** (Rubik, Suez One, Fredoka, Assistant, Secular One — Heebo ו-Karantina כבר נטענים ב-`app/fonts.ts`) נטענים **רק** במסכים שמציגים כתוביות או תצוגה מקדימה, מקובץ נפרד שמשתמש באותו דפוס של `next/font`. הקבצים נבנים לתוך האתר ומוגשים מאותו origin — זו דרישה של ה-CSP (`font-src 'self' data:`, חלק 06 §15.3), ולכן בדפדפן **אסור** `@remotion/google-fonts` (הוא טוען מ-Google בזמן ריצה). `@remotion/google-fonts` משמש רק בסביבת הרינדור (`remotion/fonts.ts`, חלק 05 §20.9).

```ts
// components/video/caption-fonts.ts — browser only: CaptionPreview, LivePreviewPhone (Remotion Player), editor player, BrandKitEditor.
// Same-origin files via next/font (CSP font-src 'self'). Never imported by app/layout.tsx or marketing pages.
import { Rubik, Suez_One, Fredoka, Assistant, Secular_One } from "next/font/google";
import { heebo, karantina } from "@/app/fonts";

// next/font requires literal options in every call (no spread of a shared object).
const rubik = Rubik({ subsets: ["hebrew", "latin"], weight: ["800"], display: "swap", preload: false, variable: "--font-rubik" });
const suezOne = Suez_One({ subsets: ["hebrew", "latin"], weight: ["400"], display: "swap", preload: false, variable: "--font-suez-one" });
const fredoka = Fredoka({ subsets: ["hebrew", "latin"], weight: ["600"], display: "swap", preload: false, variable: "--font-fredoka" });
const assistant = Assistant({ subsets: ["hebrew", "latin"], weight: ["700", "800"], display: "swap", preload: false, variable: "--font-assistant" });
const secularOne = Secular_One({ subsets: ["hebrew", "latin"], weight: ["400"], display: "swap", preload: false, variable: "--font-secular-one" });

/** Same keys as FONTS in remotion/fonts.ts (Part 05) and as the brand-kit font list. Values = real CSS family names. */
export const CAPTION_FONT_FAMILIES = {
  Heebo: heebo.style.fontFamily,
  Rubik: rubik.style.fontFamily,
  Karantina: karantina.style.fontFamily,
  "Suez One": suezOne.style.fontFamily,
  Fredoka: fredoka.style.fontFamily,
  Assistant: assistant.style.fontFamily,
  "Secular One": secularOne.style.fontFamily,
} as const;
export type CaptionFontKey = keyof typeof CAPTION_FONT_FAMILIES;
/** Class names to put on the preview wrapper so the @font-face rules are in scope. */
export const captionFontsClassName = [rubik, suezOne, fredoka, assistant, secularOne].map((f) => f.variable).join(" ");
```

- `CaptionPreview` ממפה את `font.family` של `CAPTION_PRESETS` (§16.2) דרך `CAPTION_FONT_FAMILIES`. בנגן Remotion בדפדפן (`LivePreviewPhone`, נגן העורך) הקומפוזיציה מקבלת את אותה מפה במקום `FONTS` של `remotion/fonts.ts` — הקומפוזיציה עצמה לא קוראת ל-`loadFont` בדפדפן (המימוש בחלק 05 §20.9).
- לתמונות OG נשמרים קובצי TTF סטטיים של Heebo 600/800 ב-`public/fonts/` (ל-`next/og`).

### 5.2 סולם הטיפוגרפיה

| טוקן (`text-*`) | גודל | גובה שורה | משקל | משפחה | שימוש |
|---|---|---|---|---|---|
| `display` | `clamp(3.25rem, 2rem + 6vw, 7.5rem)` | 0.98 | 700 | Karantina | 1–3 מילים ענקיות, מספרים גדולים (מחשבון חיסכון, FinalCtaBand) |
| `h1` | `clamp(2.25rem, 1.6rem + 3vw, 4.25rem)` | 1.08 | 800 | Heebo | כותרת דף אחת (אלמנט ה-LCP בדף הבית) |
| `h2` | `clamp(1.75rem, 1.3rem + 2vw, 3rem)` | 1.15 | 700 | Heebo | כותרות סקשן |
| `h3` | `clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem)` | 1.25 | 700 | Heebo | כותרות כרטיס ותת-סקשן |
| `body-lg` | 19px | 1.7 | 400 | Heebo | פסקת משנה ב-hero, מבואות |
| `body` | 17px | 1.7 | 400 | Heebo | טקסט רץ, ברירת מחדל |
| `small` | 15px | 1.6 | 400/500 | Heebo | טקסט עזר, טבלאות, תפריטים |
| `micro` | 13px | 1.4 | 600 | Heebo | תגיות, badges, תוויות |
| long-read (`.prose-he`) | 18px | 1.75 | 400 | Heebo | בלוג, משפטי, מבואות הוקים (68ch) |
| mono | 13–15px | 1.4 | 400/600 | JetBrains Mono | קודי זמן, מזהים |

באפליקציה (מסכים צפופים) `h1` של מסך הוא `text-h3` עד `text-h2` — `h1` הענק שמור לשיווק. שדות קלט לעולם לא מתחת ל-16px (מונע זום אוטומטי ב-iOS).

### 5.3 כללי סדר דפוס בעברית (מחייבים)

1. **אין `letter-spacing` על עברית**, לא חיובי ולא שלילי (הבסיס מאפס אותו לכל אלמנט). מותר רק על תוויות לועזיות בלבד ובמונו.
2. **אין `uppercase`** (בעברית אין אותיות גדולות). הדגשה = משקל, צבע, קופסת הדגשה או מרקר.
3. **אין הטיה מלאכותית**: `em`, `i` ו-`cite` מוצגים כמודגשים (700), לא נטויים. `italic` חסום ב-lint.
4. **שבירת שורות**: `text-wrap: balance` לכותרות, `pretty` לפסקאות; בלי מקפי שבירה (`hyphens: none`).
5. **תחילית + מספר / מילה לועזית** נשארים צמודים: "ב-2026", "ל-Reels" — `whitespace-nowrap` דרך `Num hePrefix` או `<span className="whitespace-nowrap">`.
6. **ספרות טבלאיות** (`tabular-nums`) לקרדיטים, מחירים, טיימרים, טבלאות — מובנה ב-`Num`/`Price` וב-`bdi`.
7. **גופן תצוגה (Karantina)** — רגע אחד לכל מסך, 1–3 מילים או מספר. לעולם לא לפסקה, לכפתור או לטקסט מתחת ל-40px.
8. **ניקוד** — רק בהערות הגייה (`PronunciationTable`); Heebo תומך בניקוד, אבל גובה השורה בטבלה הזו עולה ל-1.9.
9. **מירכאות וגרשיים** — לפי §2.1 סעיף 8. אסור `"` ASCII בתוך מילה עברית (נדל"ן) — זה גם שובר JSON/HTML.
10. **אנגלית בתוך עברית** — מילה לועזית בודדת לא צריכה גופן אחר (Heebo כולל לטינית). ביטוי לועזי ארוך מקבל `lang="en"` לקוראי מסך.

### 5.4 רישוי גופנים

- כל גופני הממשק והכתוביות הם Google Fonts ברישיון SIL OFL — מותרים גם בווב וגם **צרובים בתוך סרטוני לקוחות** שמרונדרים בשרת.
- גופנים מסחריים של יציקות ישראליות (למשל Almoni/Ploni) — שדרוג עתידי **לווב בלבד**. אסור לצרוב אותם בסרטונים בלי רישיון וידאו בכתב מהיציקה: ברישיונות שהיציקה מפרסמת יש רישיון ווב ורישיון אפליקציה, ולא נמצא רישיון לרינדור וידאו — שואלים בכתב לפני כל שימוש כזה.
- ב-MVP, `brand_kits.heading_font` ו-`body_font` נבחרים **רק** מתוך שבעת הגופנים הפתוחים (Heebo, Rubik, Assistant, Secular One, Suez One, Fredoka, Karantina — חלק 03 §12.2), וה-bucket `brand-assets` מקבל תמונות בלבד. גופן מותג שהלקוח מעלה, עם הצהרת רישיון להטמעה בווידאו, הוא פיצ׳ר של v2 (חלק 03, חלק 05 §20.9).

### קריטריוני קבלה
- [ ] בדף הבית נטענים רק Heebo (preload) ו-Karantina; Rubik/Suez One/Fredoka/Assistant/Secular One לא נטענים מחוץ לבוחר הכתוביות, לערכת המותג, ל-`LivePreviewPhone` ולעורך (בדיקת רשת ב-Playwright).
- [ ] במסכי האשף והעורך אין אף בקשה ל-`fonts.googleapis.com` או ל-`fonts.gstatic.com`, ואין הפרת CSP של `font-src` (Playwright מאזין ל-`securitypolicyviolation`).
- [ ] CLS < 0.05 בדף הבית (fallback מותאם של next/font).
- [ ] `lint:rtl` נכשל על `tracking-*` (חוץ מ-`font-mono`), `uppercase`, `italic`.
- [ ] טקסט "ב-2026 עד 50% ב-Black Friday" לא נשבר בין התחילית למספר ב-320px.

---

## §6. ערכות נושא: כהה, בהירה, לפי המכשיר

### 6.1 האסטרטגיה

| נושא | החלטה |
|---|---|
| ערכים | `dark` (ברירת מחדל) · `light` · `system` — `profiles.theme` |
| שמירה | עוגייה `theme` (שנה, `Path=/`, `SameSite=Lax`, לא `HttpOnly`), ולמשתמש מחובר גם `profiles.theme` |
| מה נכתב על `<html>` | `data-theme="dark\|light"` (הערך **הפתור**) ו-`data-theme-pref="dark\|light\|system"` |
| מניעת הבהוב | השרת מרנדר `data-theme="dark"`. סקריפט חוסם קטן (`ThemeScript`) ב-`<head>` קורא את העוגייה ופותר `system` לפני הציור הראשון |
| למה לא לקרוא עוגייה ב-layout | `cookies()` ב-root layout היה הופך כל דף שיווקי לדינמי ושובר ISR ו-TTFB של דפי ההוקים. הסקריפט נותן אותה תוצאה בלי הבהוב |
| CSP | תוכן הסקריפט קבוע, ולכן הוא מורשה לפי hash: `'sha256-…'` של `THEME_SCRIPT_SOURCE` נכלל **בשתי** גרסאות ה-CSP של חלק 06 §15.3 — גם ב-CSP הסטטי של דפי השיווק (`next.config.ts`) וגם ב-CSP עם ה-nonce של הנתיבים הדינמיים (`proxy.ts`). ה-root layout משותף ולא קורא `headers()`, ולכן הסקריפט לא מקבל nonce; עם `'strict-dynamic'` דפדפנים עדיין מכבדים hash של סקריפט inline |
| מערכת | `system` נפתר דרך `matchMedia('(prefers-color-scheme: light)')` ומאזין לשינויים בזמן אמת |
| משתמש מחובר במכשיר חדש | `AppShell` מקבל את `profiles.theme` מהשרת; אם שונה מהעוגייה — מעדכן עוגייה ו-attribute מיד בטעינה |
| מיילים, OG, Remotion | לא תלויים בערכת הנושא: מיילים בהירים עם כותרת כהה (חלק 06), OG תמיד כהה (§18), סרטונים לפי ערכת המותג של הלקוח |
| `theme-color` | `viewport.themeColor`: `#08080C` ל-dark, `#FAF7F2` ל-light (לפי `prefers-color-scheme`); כשהמשתמש בחר ערכה ששונה ממערכת ההפעלה, `ThemeProvider` מעדכן את `<meta name="theme-color">` לפי הערך הפתור |
| אנליטיקה | `setPref` שולח `theme_changed { theme }`; `ThemeProvider` ו-`MotionPreference` מעדכנים את מאפייני-העל `theme` ו-`reduced_motion` של PostHog (חלק 06 §14.1) — רק אחרי הסכמה לעוגיות אנליטיקה |

אותו מנגנון משמש להעדפת התנועה: עוגייה `motion` (`system` | `reduce`, שנה) → `data-motion="full|reduce"` (ראו §12). שלוש העוגיות של החלק הזה — `theme`, `motion` ו-`sidebar_state` (של shadcn) — הן עוגיות הכרחיות שלא דורשות הסכמה, ומופיעות ברשימת העוגיות של חלק 06 §11.7 ושל `/legal/cookies`.

### 6.2 קוד

```tsx
// components/a11y/theme-script.tsx — server component, rendered in <head>. Constant content => CSP hash.
const CODE = `(()=>{try{var d=document.documentElement,c=document.cookie;function g(k){var m=c.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}
var p=g('theme')||'dark';if(p!=='light'&&p!=='system')p='dark';
var r=p==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p;
d.dataset.theme=r;d.dataset.themePref=p;d.style.colorScheme=r;
var mo=g('motion');d.dataset.motion=(mo==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches)?'reduce':'full'}catch(e){}})()`;
export function ThemeScript() {
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: CODE }} />;
}
export const THEME_SCRIPT_SOURCE = CODE; // sha256 goes into BOTH CSPs: next.config.ts (static pages) and proxy.ts (nonce routes)
```

```tsx
// app/layout.tsx (excerpt — P6 adds Sentry/analytics wiring)
import "./globals.css";
import type { Viewport } from "next";
import { getMessages } from "next-intl/server";
import { heebo, karantina, jetbrains } from "./fonts";
import { ThemeScript } from "@/components/a11y/theme-script";
import { SkipLink } from "@/components/a11y/skip-link";
import { MotionPreference } from "@/components/a11y/motion-preference";
import { Providers } from "./providers";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { getDir } from "@/lib/hebrew/bidi";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080C" },
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = DEFAULT_LOCALE;        // "he"
  const dir = getDir(locale);           // "rtl"
  const messages = await getMessages(); // static request config => pages stay SSG/ISR
  return (
    <html lang={locale} dir={dir} data-theme="dark" data-motion="full" suppressHydrationWarning
      className={`${heebo.variable} ${karantina.variable} ${jetbrains.variable}`}>
      <head><ThemeScript /></head>
      <body>
        <SkipLink />
        <Providers locale={locale} dir={dir} messages={messages}>
          <MotionPreference>{children}</MotionPreference>
        </Providers>
      </body>
    </html>
  );
}
```

```ts
// components/a11y/theme-provider.tsx — public API (client)
export type ThemePref = "dark" | "light" | "system";
export interface ThemeContextValue {
  pref: ThemePref;                       // what the user chose
  resolved: "dark" | "light";            // what is painted
  setPref(pref: ThemePref): void;        // writes cookie + data-theme(+pref) + color-scheme;
                                         // if signed in: persists profiles.theme via the settings action (Part 03);
                                         // emits analytics `theme_changed { theme }`
}
export function useTheme(): ThemeContextValue;
```

`ThemeProvider` קורא את המצב ההתחלתי מ-`document.documentElement.dataset` (לא מ-state ראשוני משלו, כדי לא ליצור אי-התאמת hydration), ומאזין ל-`matchMedia` כש-`pref === "system"`. מעבר בין ערכות לא מפעיל transitions: לפני ההחלפה מוסיפים ל-`<html>` מחלקה `theme-switching` עם `* { transition: none !important }` ומסירים אותה בפריים הבא.

### קריטריוני קבלה
- [ ] טעינה קרה עם `theme=light` בעוגייה: אין פריים כהה (Playwright: צילום מסך בזמן `domcontentloaded` + בדיקת `data-theme` לפני hydration).
- [ ] `system` עוקב אחרי שינוי הגדרת מערכת ההפעלה בלי רענון.
- [ ] דפי `/hooks/[niche]` ו-`/niches/[niche]` נשארים SSG/ISR (`next build` מציג אותם כסטטיים).
- [ ] משתמש שקבע `light` בפרופיל ונכנס ממכשיר חדש רואה בהירה אחרי טעינת `/app` הראשונה, והעוגייה מתעדכנת.
- [ ] האירוע `theme_changed` נשלח עם `{ theme }` בכל שינוי.
- [ ] ב-`/app` (CSP עם nonce) וב-`/` (CSP סטטי) הסקריפט רץ בלי הפרת CSP, ושינוי של תו אחד ב-`CODE` בלי עדכון ה-hash מכשיל בדיקת e2e (`securitypolicyviolation`).

---

## §7. פריסה, ריווח, רדיוסים, הגבהה ושכבות

### 7.1 גריד ומידות

| נושא | ערך |
|---|---|
| גריד | 12 עמודות; `gap-6` (24px) בדסקטופ, `gap-4` (16px) במובייל |
| רוחב שיווקי | `container-marketing`: עד 1240px, ריפוד צדדי 16/24px |
| אפליקציה | נוזלית; תוכן מסך עד 1440px; טפסים והגדרות עד 720px |
| קריאה ארוכה | `reading` / `.prose-he`: עד 68ch, גוף 18px |
| קצב סקשנים | 96–128px בדסקטופ, 64–80px במובייל (`py-16 md:py-24 xl:py-32`) |
| נקודות שבירה | `xs` 390 · `sm` 640 (רק ל-shadcn) · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536 |
| סולם ריווח | 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px (כפולות `0.25rem` של Tailwind) |
| יחסי מסגרת | `aspect-reel` 9/16 · `aspect-feed` 4/5 · `aspect-square` 1/1 · `aspect-wide` 16/9 · `aspect-cine` 2.39/1 (קישוטי בלבד) |
| גבהים קבועים | Header שיווקי 64px · TopBar באפליקציה 56px · AnnouncementBar 36px · MobileStickyCta 72px · MobileTabBar 64px · Sidebar 248px / 72px מכווץ |
| גודל מטרה | מינימום 32×32px לכל רכיב אינטראקטיבי (WCAG מחייב 24); כפתורי אייקון 40px כברירת מחדל |

### 7.2 רדיוסים

| טוקן | ערך | שימוש |
|---|---|---|
| `rounded-xs` | 6px | badges, תגיות, `kbd` |
| `rounded-sm` | 10px | שדות קלט, chips, בקרי סגמנט, כפתורי סרגל כלים |
| `rounded-md` | 14px | כרטיסים, אריחי וידאו, כרטיסי סצנה, פופאוברים |
| `rounded-lg` | 20px | פאנלים, מודאלים, sheets |
| `rounded-xl` | 28px | כרטיס ה-prompt ב-hero |
| `rounded-full` | 999px | **כל כפתורי הטקסט** (pills), מד הקרדיטים, כפתורי אייקון עגולים |

### 7.3 הגבהה (Elevation)

| רמה | Utility | כהה | בהירה | שימוש |
|---|---|---|---|---|
| 0 | — | רקע `bg` | רקע `bg` | עמוד |
| 1 | `bg-surface-1 elev-1` | קו פנימי עליון + צל קצר | צל 1px | כרטיסים, sidebar |
| 2 | `bg-surface-2 elev-2` | צל 24px | צל 20px | פופאוברים, תפריטים, hover של כרטיס |
| 3 | `bg-surface-2 elev-3` | צל 64px | צל 50px | מודאלים, sheets, `PhoneFrame` |
| זוהר ראשי | `glow-primary` | טבעת זהב + הילה | צל רך | hover של CTA ראשי |
| זוהר AI | `glow-ai` | טבעת סגולה + הילה | טבעת סגולה דקה | כרטיס/סצנה במצב "יוצרים" |

במצב כהה, היררכיה נבנית מ**בהירות המשטח + קו**, לא מצל בלבד: כל שכבה עולה מ-`surface-1` ל-`surface-2` ל-`surface-3`.

### 7.4 שכבות Z

| שכבה | ערך | מה |
|---|---|---|
| base | 0 | תוכן |
| grain | 1 | `film-grain::after` (לא תופס לחיצות) |
| sticky | 40 | Header, TopBar, MobileStickyCta, MobileTabBar, WizardFooter |
| dropdown | 50 | תפריטים, פופאוברים, טולטיפים, Combobox |
| overlay | 60 | רקע של מודאל/Sheet (`--color-overlay`) |
| modal | 70 | Dialog, Sheet, Drawer, CommandMenu |
| toast | 80 | Sonner |

### קריטריוני קבלה
- [ ] אין באפליקציה ערך `z-[…]` שרירותי (grep); רק `z-0/10/40/50/60/70/80`.
- [ ] כל רכיב אינטראקטיבי ≥ 32×32px (בדיקת Playwright שסורקת `button, a, [role=button], input[type=checkbox]` ומודדת `getBoundingClientRect`, עם רשימת חריגים לקישורים בתוך טקסט רץ).
- [ ] במובייל, פוקוס על שדה בתחתית המסך לא מוסתר ע״י `MobileStickyCta`/`MobileTabBar` (בדיקת `scroll-padding`).

---

## §8. shadcn/ui במצב RTL

### 8.1 צעדי הקמה (M0)

1. **יצירה:** `pnpm dlx shadcn@latest create` עם הסגנון **`radix-nova`** ו-RTL פעיל (הדגל `--rtl`, שקיים ב-`create` וב-`init` מאז תמיכת ה-RTL של ינואר 2026). אם הפרויקט כבר קיים — `pnpm dlx shadcn@latest init --rtl` עם אותו סגנון, כך ש-`components.json` מקבל `"rtl": true`. ההמרה האוטומטית ל-RTL ב-CLI (מחלקות פיזיות → לוגיות, יישור טקסט, props כיווניים, היפוך אייקונים נתמכים) עובדת רק בפרויקטים שנוצרו ב-`shadcn create` עם הסגנונות החדשים (`radix-nova`, `base-nova` …).
2. **`components.json`:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "rtl": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/lib/react-hooks"
  }
}
```

   ה-alias `hooks` מצביע על `lib/react-hooks` כדי שלא יתבלבל עם `components/hooks/` (רכיבי ספריית ההוקים של המוצר). אף קובץ לא מייבא מ-`@/hooks` (כלל ESLint `no-restricted-imports`). מודולים של חלקים אחרים שהם React hooks לפי שמם (`lib/realtime/use-job-channel.ts`, `lib/ai/client/use-ndjson-object.ts`) נשארים במקומם.
3. **מחיקת הטוקנים של shadcn:** ה-CLI מוסיף ל-`globals.css` בלוקים `:root { --background: oklch(…) }`, `.dark { … }`, `@theme inline { --color-background: var(--background) … }` ו-`@custom-variant dark (&:is(.dark *))`. מוחקים את כולם — הגשר שלנו (§4.2) מחליף אותם.
4. **ספק כיוון:** עוטפים את האפליקציה ב-`DirectionProvider` של shadcn עם `direction="rtl"` (מתווסף דרך ה-CLI לפי מדריך ה-RTL של shadcn ל-Next.js). אם הרכיב לא זמין בגרסה המותקנת — עוטפים ב-`Direction.Provider dir="rtl"` מהחבילה `radix-ui`. הספק לא קובע את ה-attribute של ה-HTML, ולכן `dir` ו-`lang` נשארים על `<html>`. מתעדים ב-`DECISIONS.md` [M0-verify].
5. **הוספת הפרימיטיבים** (§8.3) עם `shadcn add`, ואחרי כל הוספה: `pnpm lint:rtl` + סקירת diff ידנית, כי ההמרה האוטומטית לא מושלמת.
6. **רכיבים מבחוץ** (Magic UI, Aceternity) מותקנים דרך ה-registry של shadcn. אחרי ההתקנה מריצים פעם אחת `pnpm dlx shadcn@latest migrate rtl <path>` על הקבצים החדשים (הפקודה לא אידמפוטנטית לגמרי — מריצים פעם אחת וסוקרים את ה-diff), ואז עוברים ידנית על כל `left/right/ml/mr/pl/pr/text-left/text-right/translate-x`; אנימציות כיווניות עוברות למשתני הכיוון (`--marquee-shift` ב-§4.2, `slideFromStart`/`stepTransition` ב-§12.2).
7. **בדיקת עשן:** דף `/admin/design` (גלריית רכיבים) מציג כל פרימיטיב בכל variant ומצב, בשתי הערכות. הגישה כמו לכל `/admin`: `platform_admin_status() = 'ok'` (מנהל פלטפורמה עם אימות דו-שלבי, חלק 04 §9.2 ו-§17.2); אחרת 404 או הפניה ל-`/admin/mfa`. Playwright מצלם אותו ב-RTL ומריץ עליו axe (בסביבת הבדיקה, עם משתמש אדמין של ה-seed).

### 8.2 `app/providers.tsx`

```tsx
"use client";
import { useState } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/a11y/theme-provider";
import { LiveAnnouncer } from "@/components/a11y/live-announcer";
import { PostHogProvider } from "@/lib/analytics/client";

export function Providers({ children, locale, dir, messages }: {
  children: React.ReactNode; locale: string; dir: "rtl" | "ltr"; messages?: AbstractIntlMessages;
}) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } }));
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Jerusalem">
      <DirectionProvider direction={dir}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <PostHogProvider>
              <TooltipProvider delayDuration={300}>
                <LiveAnnouncer>{children}</LiveAnnouncer>
                <Toaster dir={dir} position="top-center" closeButton duration={5000} />
              </TooltipProvider>
            </PostHogProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
```

### 8.3 פרימיטיבים, וריאנטים ומצבים

| פרימיטיב (`components/ui/`) | וריאנטים / גדלים של המותג | מצבים חובה | הערות RTL ונגישות |
|---|---|---|---|
| `Button` | `primary` (זהב+דיו, `glow-primary` ב-hover) · `secondary` (surface-2 + קו `border-strong`) · `outline` · `ghost` · `destructive` (danger + on-danger) · `link` (`text-link`, קו תחתון) · גדלים `sm` 32 · `md` 40 · `lg` 48 · `xl` 56 (CTA ב-hero) · `icon-sm` 32 · `icon` 40 · `icon-lg` 48 | default · hover · active (`scale-[.98]`) · focus-visible · disabled · **loading** (spinner במקום האייקון, הטקסט נשאר, רוחב קבוע, `aria-busy`) | pill (`rounded-full`); prop `cost?: number` מוסיף `CostBadge variant="suffix"`; disabled שצריך הסבר = `aria-disabled` + Tooltip |
| `Input`, `Textarea` | `md` 44px · `lg` 52px · `rounded-sm` · `bg-surface-2` · קו `border-strong` | default · hover · focus (טבעת) · invalid (`aria-invalid` + קו danger + הודעה) · disabled · read-only | `text-start`; ל-LTR משתמשים ב-`LtrInput`; Textarea עם `field-sizing: content` ומונה תווים ב-`Num` |
| `Field` / `Label` / הודעת שגיאה | תווית מעל השדה, טקסט עזר `text-small text-muted`, שגיאה עם אייקון `CircleAlert` | — | שגיאה מקושרת `aria-describedby`; "(רשות)" ליד שדות לא חובה במקום כוכבית לחובה |
| `Select`, `Combobox` (Popover + Command) | `md`/`lg` | פתוח · ריק ("לא מצאנו… ") · טוען | `align="start"`; חיפוש מנרמל ניקוד וגרשיים |
| `Checkbox`, `RadioGroup`, `Switch` | RadioGroup גם כ"כרטיסי בחירה" (`card`) | checked · indeterminate · disabled · invalid | Switch: מצב "פעיל" = הכדור בצד הסוף (שמאל); לוודא את ה-transform אחרי `shadcn add` |
| `Slider` | `default` | — | **RTL כברירת מחדל** (מינימום מימין); סליידרים של זמן/מדיה עטופים ב-`dir="ltr"`; `aria-valuetext` בעברית |
| `Tabs` | `underline` (ברירת מחדל) · `pills` | active · disabled | סדר הטאבים מימין; חצים מנווטים לפי הכיוון החזותי |
| `ToggleGroup` | `segmented` (רקע surface-2, נבחר surface-3) | — | לבוחרי פורמט 9:16/1:1/16:9 ואיכות |
| `Dialog`, `AlertDialog` | `md` 480 · `lg` 640 · `xl` 880 | פתיחה/סגירה עם fade+scale .98 (200ms) | כפתור ראשי בסוף (שמאל), ביטול בהתחלה (ימין) — סדר DOM: ביטול ואז ראשי; פוקוס חוזר לטריגר |
| `Sheet` | `side="right"` = צד ההתחלה (תפריט מובייל, sidebar מובייל) · `side="left"` = צד הסוף (פאנל מאפיינים במובייל) · `side="bottom"` | — | כותרת חובה (גם אם `sr-only`) |
| `Drawer` | מגירה תחתונה במובייל (נגן מלא, תצוגה מקדימה מורחבת) | — | ידית גרירה + כפתור סגירה גלוי |
| `DropdownMenu`, `ContextMenu` | — | — | `align="end"` לתפריטי kebab; פריט מסוכן בצבע `danger` עם אייקון |
| `Popover`, `HoverCard`, `Tooltip` | Tooltip: `bg-surface-3 text-small`, השהיה 300ms | — | Tooltip לא מכיל מידע שאין דרך אחרת להגיע אליו; לא על אלמנט disabled (עוטפים) |
| `Command` | ל-`CommandMenu` (⌘K / Ctrl+K) ולבוחרים | ריק · טוען | `dir` על השורש; תוצאות מקובצות |
| `Accordion`, `Collapsible` | `FaqAccordion`, הגדרות מתקדמות | — | ה-chevron בסוף השורה (שמאל), מסתובב 180° (לא שיקוף) |
| `Badge` | `neutral` · `primary` · `lemon` (הוק) · `violet` (AI) · `success` · `danger` · `outline` | — | `rounded-xs`, `text-micro`; לא מעבירים מידע בצבע בלבד |
| `Card` | `surface-1`, `rounded-md`, `elev-1`; `interactive` (hover → surface-2 + `elev-2`) | selected (טבעת 1px בצבע `primary-text` — זהב בכהה, חום-זהב בבהירה; §4.3 כלל 6) | כרטיס לחיץ = `<a>`/`<button>` אחד שעוטף, לא div עם onClick |
| `Skeleton` | `bg-surface-2`, pulse | — | בגאומטריה הסופית; `aria-hidden`, והמכל `aria-busy="true"` |
| `Progress` | `default` (מילוי `primary-text`, §4.3 כלל 6) · `ai` (סגול + shimmer) | indeterminate | **מתמלא מההתחלה (ימין)**; `aria-valuetext` "45%" |
| `Spinner` | 16/20/24 | — | רק בתוך כפתור או אזור קטן; לעולם לא כמצב טעינה של מסך (Skeleton) |
| `Table` | `default` · `dense` | ריק · טוען · שגיאה | עמודה ראשונה מימין; עמודות מספריות `text-end` + `num` |
| `Breadcrumb` | — | — | מפריד `DirIcon name="next"` |
| `Pagination` | — | — | "הקודם" מימין, "הבא" משמאל עם `DirIcon` |
| `Sidebar` | ראו `SidebarNav` | — | `side="right"` (התחלה) |
| `Carousel` (Embla) | — | — | `opts={{ direction: "rtl" }}` + `dir="rtl"` על ה-viewport |
| `Chart` (Recharts) | צבעי `chart-1…5` | ריק · טוען | עטוף ב-`dir="ltr"` (§9.5) |
| `Sonner` | `success` · `error` · `info` · `loading` | — | `dir="rtl"`, `top-center`, 5 שניות; שגיאה 8 שניות; כפתור פעולה אחד לכל היותר |
| `Kbd` | — | — | `dir="ltr"`, `font-mono` |
| `Empty` | בסיס ל-`EmptyState` (§10.11) | — | — |
| `Avatar`, `Separator`, `ScrollArea`, `InputOTP` (v2) | — | — | ScrollArea: הפס בצד הסוף; InputOTP מאפשר הדבקה |

### 8.4 תיקונים אחרי התקנה (קודמוד ידני, נבדק ב-`lint:rtl`)

| מוצאים ברכיבי shadcn | מחליפים ל- | למה |
|---|---|---|
| `bg-muted`, `hover:bg-muted/50` | `bg-surface-2`, `hover:bg-surface-3` | `muted` אצלנו הוא צבע טקסט |
| `dark:bg-input/30`, `dark:…` של shadcn | ערכי טוקן ישירים (`bg-surface-2`) | ה-dark שלנו הוא ברירת המחדל |
| `rounded-md` על Input/Select/Textarea | `rounded-sm` | שדות = 10px |
| `rounded-md` על Button | `rounded-full` | כל כפתורי הטקסט הם pills |
| `text-sm` בכפתורים ובתפריטים | נשאר (15px אצלנו) | הסולם כבר מותאם לעברית |
| `start-*` / `end-*` (מיקום) | `inset-s-*` / `inset-e-*` | `inset-s/e` נוספו ב-Tailwind 4.2; מ-4.3 `start/end` הם שמות לגאסי שהקנוניזציה ממירה |
| `rtl:rotate-180` על חצים | `DirIcon` | שם סמנטי במקום טרנספורם |
| `slide-in-from-left/right` | `slide-in-from-start/end` | אנימציית כניסה לוגית |

### קריטריוני קבלה
- [ ] `components.json` זהה למופיע למעלה; `pnpm lint:rtl` ירוק על `components/ui/`.
- [ ] `/admin/design` מציג את כל הפרימיטיבים בשתי הערכות, ו-axe לא מוצא בו הפרות serious/critical.
- [ ] DropdownMenu, Tabs, Slider ו-RadioGroup מגיבים למקשי החצים לפי הכיוון החזותי ב-RTL (בדיקת e2e).
- [ ] אין בפרויקט `@radix-ui/react-direction` לצד הספק של shadcn — ספק כיוון אחד בלבד.

---

## §9. RTL ו-bidi

### 9.1 כללי היסוד

1. `<html lang="he" dir="rtl">` פעם אחת, ב-root layout. ה-`dir` נגזר מהלוקאל (`getDir` ב-`lib/hebrew/bidi.ts`: `he`/`ar` → `rtl`, אחרת `ltr`), כדי ש-`ar`/`ru`/`en` יעבדו בעתיד בלי שינוי רכיבים.
2. **רק מאפיינים לוגיים**: `ms/me/ps/pe`, `inset-s-*/inset-e-*`, `text-start/end`, `border-s/e`, `rounded-s/e` (ו-`rounded-ss/se/es/ee`), `float-start/end`, `scroll-ms/me`. ב-CSS: `margin-inline-*`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`, `text-align: start/end`.
3. `gap-*` במקום `space-x-*`. flex ו-grid מתהפכים לבד.
4. **אזורי LTR מכוונים** עטופים ב-`dir="ltr"` ומסומנים בהערה `{/* ltr-zone: reason */}`: נגן וידאו, ציר הזמן בעורך, גלי קול, גרפים, קוד/JSON, שדות LTR.
5. **טקסט מעורב** תמיד מבודד: מספרים ומחירים דרך `Num`/`Price`; מילה או ביטוי לועזי בתוך משפט עברי דרך התגית `<ltr>` בהודעות (§9.4); אף פעם לא מסתמכים על כך ש"זה ייראה בסדר".
6. **תוכן משתמש לא ידוע** (שם עסק, תיאור חופשי, תגובה של לקוח באישור, שם קובץ) — `dir="auto"`. **תוכן עברי שאנחנו מייצרים או מאחסנים** (הוקים, תסריטים, כתוביות) — `dir="rtl"` מפורש. הסיבה: הוק שמתחיל ב-"POV:" היה מזוהה כ-LTR ב-`dir="auto"` ומוצג הפוך.
7. כש-`unicode-bidi: plaintext` בשימוש (כתוביות ב-Remotion), כל טוקן לועזי או מספרי **חייב** להיות עטוף ב-`<bdi>` — בידודים לא נספרים בזיהוי התו החזק הראשון, וכך "POV: הקבלן אמר 'שבועיים'" נשאר פסקה מימין לשמאל.
8. RLM (U+200F) נוסף אחרי פיסוק בסוף שורה שבאה אחרי רצף LTR (`appendRlm` ב-`lib/hebrew/bidi.ts`).

### 9.2 מה מתהפך ומה לעולם לא

| רכיב / אלמנט | ב-RTL | מימוש |
|---|---|---|
| פריסת עמוד, עמודות, סדר גריד | מתהפך (התחלה = ימין) | מאפיינים לוגיים |
| Sidebar באפליקציה, תפריט מובייל | בצד ימין | `side="right"` |
| חיצי הקודם/הבא, chevrons, פירורי לחם, עימוד | מתהפכים | `DirIcon` |
| `WizardStepper` | שלב 1 מימין; הקו מתמלא מימין לשמאל | flex לוגי |
| `WizardFooter` | "הקודם" מימין (חץ →), "המשך" משמאל (חץ ←) | `DirIcon back/forward` |
| קרוסלות (Embla) | מתחילות מימין, "הבא" זז שמאלה | `direction: "rtl"` |
| מרקיז אופקי | פריטים נכנסים מצד הסוף (שמאל) | `--marquee-shift` חיובי ב-RTL |
| מרקיז אנכי (`VideoWall`) | לא רלוונטי — לא מתהפך | — |
| טאבים, Tabs list | סדר מימין | Radix + `dir` |
| יישור פופאובר `align="start"` | ימין | Radix |
| Switch | "פעיל" = הכדור משמאל | Radix + בדיקה |
| סליידר כללי (מהירות קריינות, מחשבון חיסכון) | מינימום מימין | Radix `dir` |
| פס התקדמות כללי (התקדמות יצירה, מכסה) | מתמלא מימין | `Progress` |
| Undo / Redo | הגליפים מוחלפים (בטל מצביע ימינה) | `DirIcon undo/redo` |
| שליחה, תשובה, יציאה מהחשבון | מתהפכים | `DirIcon send/reply/logout` |
| כותרת תחתונה של דיאלוג | ראשי משמאל, ביטול מימין | סדר DOM |
| סליידר לפני/אחרי (`BeforeAfterSlider`) | "לפני" מימין, "אחרי" משמאל; חץ שמאלה חושף יותר "אחרי" | §13 |
| **כפתורי מדיה: נגן, השהה, דילוג, הרצה קדימה/אחורה** | **לא מתהפכים** | lucide ישיר |
| **סרגל ההתקדמות של הנגן, עוצמת שמע, בקרות הנגן** | **LTR** | `dir="ltr"` |
| **ציר הזמן בעורך (`TimelineLite`), סרגל זמן, ידיות חיתוך, גלי קול** | **LTR, זמן 0 משמאל** | `dir="ltr"`; תוויות עבריות בתוך `dir="rtl"` |
| **קודי זמן ומשכים** | LTR, מונו | `Num format="timecode"` |
| **מספרים, ₪, %, טלפונים, תאריכים בספרות** | לא משתקפים; מבודדים | `Num`, `Price` |
| **שדות טלפון/מייל/URL/קופון/ח.פ.** | ערך LTR, מיושר לקצה הטופס (ימין) | `LtrInput` |
| **גרפים** | ציר X ב-LTR (ישן משמאל), ציר Y בצד ימין | §9.5 |
| **לוגואים** (שלנו, של לקוחות, של מנועים, וואטסאפ) | לעולם לא | — |
| **וי, שעון, זכוכית מגדלת, לוכסן, קישור חיצוני** | לא מתהפכים | lucide ישיר |
| **אייקוני חפצים** (טלפון, מצלמה, מיקרופון, מספריים, רכב — כולל אייקוני נישה) | לא מתהפכים | `NicheIcon` |
| **התקדמות מעגלית** (טבעת קרדיטים, spinner) | עם כיוון השעון, לא מתהפכת | — |
| **שכבת אזורים בטוחים 9:16** (עמודת הכפתורים של הרשת) | צד ימין פיזי — לא מתהפכת | `PhoneFrame` |
| **תוכן וידאו ותמונות** | לעולם לא משקפים מדיה ב-CSS | — |
| **הדגשת מילה בכתוביות** | מתקדמת לפי סדר הדיבור (מימין לשמאל) | חלק 05 |

### 9.3 `scripts/lint-rtl.ts` (רץ ב-`pnpm lint:rtl` וב-CI)

סורק `app/`, `components/`, `lib/`, `content/` (קבצי `.ts`, `.tsx`, `.css`, `.mdx`), וכלל תווי ה-bidi סורק גם את `messages/` ואת `remotion/`. שגיאה = exit code 1.

| כלל | ביטוי (מחלקות Tailwind) | תיקון | רמה |
|---|---|---|---|
| margin/padding פיזיים | `\b-?m[lr]-`, `\bp[lr]-`, `\bscroll-[mp][lr]-` | `ms/me`, `ps/pe`, `scroll-ms/me` | שגיאה |
| מיקום פיזי | `\b-?(left\|right)-(\d\|px\|auto\|full\|\[\|1/2)` | `inset-s-*` / `inset-e-*` | שגיאה |
| מיקום לגאסי | `\b-?(start\|end)-(\d\|px\|auto\|full\|\[)` | `inset-s-*` / `inset-e-*` | שגיאה |
| יישור טקסט | `\btext-(left\|right)\b` | `text-start/end` | שגיאה |
| גבולות ורדיוסים | `\bborder-[lr](-\|\b)`, `\brounded-([lr]\|tl\|tr\|bl\|br)(-\|\b)` | `border-s/e`, `rounded-s/e/ss/se/es/ee` | שגיאה |
| float/clear | `\b(float\|clear)-(left\|right)\b` | `-start/-end` | שגיאה |
| אנימציות כיווניות | `slide-(in\|out)-(from\|to)-(left\|right)` | `-start/-end` | שגיאה |
| ריווח ילדים | `\bspace-x-` | `gap-x-*` | אזהרה |
| טרנספורם אופקי בכניסה | `\b-?translate-x-` | Motion עם `slideFromStart(dir)` | אזהרה |
| טוקנים | `\bbg-muted\b`, `\[#[0-9a-fA-F]{3,8}\]` בתוך className | `bg-surface-2`, טוקן | שגיאה |
| טיפוגרפיה עברית | `\buppercase\b`, `\bitalic\b`, `\btracking-` (שלא באותו className עם `font-mono`) | הדגשה במשקל/צבע | שגיאה |
| CSS פיזי | `margin-(left\|right)`, `padding-(left\|right)`, `(^\|[^-])\b(left\|right)\s*:`, `text-align:\s*(left\|right)`, `border-(left\|right)` | מאפיין לוגי | שגיאה |
| תווי bidi חשופים | התווים U+200E, U+200F, U+202A–U+202E, U+2066–U+2069 כתווים גולמיים בקוד, ב-CSS, ב-MDX וב-`messages/he.json` | escape (`"\u200F"`) או הקבועים של `lib/hebrew/bidi.ts` | שגיאה |

**חריגים:** שורה עם הערה `rtl-lint-ignore: <סיבה>` (הסיבה חובה), או קובץ ברשימת allowlist מפורשת בראש הסקריפט: `components/video/video-player.tsx`, `components/editor/timeline-lite.tsx` (אזורי LTR). `remotion/` לא נסרק (סגנונות inline; הכללים שם בחלק 05).

### 9.4 Bidi בהודעות ובקוד

```ts
// lib/hebrew/bidi.ts — UI-side helpers (Part 05 adds caption-specific helpers to the same module)
export type Dir = "rtl" | "ltr";
export function getDir(locale: string): Dir;                 // he/ar -> rtl
export function useDir(): Dir;                               // from next-intl useLocale()
export const LRI = "\u2066", RLI = "\u2067", FSI = "\u2068", PDI = "\u2069", RLM = "\u200F"; // escapes only: raw bidi controls in source trigger "hidden Unicode" warnings and get lost in copy-paste
export function isolate(text: string, dir?: Dir | "auto"): string; // wraps with LRI/RLI/FSI…PDI for plain-text contexts (emails, <title>, aria-label)
export function hasStrongLtr(text: string): boolean;          // Latin letters present
export function appendRlm(text: string): string;             // RLM after trailing punctuation that follows an LTR run
export function splitBidiRuns(text: string): Array<{ text: string; ltr: boolean }>; // for <bdi> wrapping in UI previews
```

```tsx
// lib/hebrew/rich.tsx — shared rich-text tags for next-intl t.rich()
export const richTags = {
  ltr: (chunks: React.ReactNode) => <bdi dir="ltr">{chunks}</bdi>,
  num: (chunks: React.ReactNode) => <bdi dir="ltr" className="num">{chunks}</bdi>,
  b: (chunks: React.ReactNode) => <strong className="font-bold">{chunks}</strong>,
  nowrap: (chunks: React.ReactNode) => <span className="whitespace-nowrap">{chunks}</span>,
};
// usage: t.rich("marketing.announce", richTags)
// he.json: "announce": "חדש: מבצעי <ltr>Black Friday</ltr> עד <num>50%</num> בספריית ההוקים ←"
```

**ב-`<title>`, `aria-label`, `alt` ונושאי מייל** אין HTML — משתמשים ב-`isolate()` (תווי בידוד יוניקוד) לכל רצף לועזי או מספרי.

### 9.5 טפסים, טבלאות, גרפים, קרוסלות

- **טפסים:** תווית עברית מעל השדה. שדות LTR רק דרך `LtrInput` (§10.3). טלפון ישראלי: placeholder "050-123-4567", מקבל `+972`, מוצג בפורמט מקומי. הודעת שגיאה מתחת לשדה, אייקון + טקסט, `aria-describedby`.
- **טבלאות:** עמודה ראשונה מימין; עמודות מספריות `text-end num`; תאריכים בפורמט קצר `13.10.2026`; פעולות שורה בעמודה האחרונה (משמאל) בתפריט kebab.
- **גרפים (Recharts דרך shadcn charts):** המכל `dir="ltr"`; ציר X כרונולוגי משמאל לימין; `YAxis orientation="right"`; תוויות וטולטיפים בעברית בתוך `dir="rtl"`; מספרים בפורמט `lib/format`. גרף לעולם לא היחיד שמציג נתון — יש טבלה או סיכום טקסטואלי לצידו.
- **קרוסלות:** Embla עם `direction: "rtl"`; כפתורי הקודם/הבא עם `DirIcon`; `role="region"` + `aria-roledescription="קרוסלה"`; כל שקופית `aria-roledescription="שקופית"` ו-`aria-label="3 מתוך 8"`.
- **מרקיזים:** עותק התוכן המשוכפל לרצף אינסופי מקבל `aria-hidden="true"` ו-`inert`, כדי שלא יהיו עצירות Tab כפולות; עצירה ב-hover, ב-focus-within ובכפתור השהיה.

### קריטריוני קבלה
- [ ] `pnpm lint:rtl` ירוק; הוספת `ml-4` לרכיב כלשהו מכשילה את ה-CI.
- [ ] `tests/fixtures/bidi-strings.json` מוצג נכון ב-`HookCard`, ב-`CaptionPreview` וב-toast (צילומי Playwright מול golden): "מבצע Black Friday עד 50%!", "₪199 לחודש", "050-123-4567", "POV: הקבלן אמר 'שבועיים'".
- [ ] בכל אזור LTR יש הערת `ltr-zone`; אין בפרויקט `dir="ltr"` בלי הערה (grep).
- [ ] במרקיז של `HooksTeaser` מספר עצירות ה-Tab שווה למספר ההוקים הייחודיים.

---

## §10. רכיבים משותפים ייעודיים (ממשקים והתנהגות)

הרכיבים כאן מוגדרים בחלק הזה ומשמשים את חלקים 02 ו-03 כמו שהם. מיקום הקבצים: פרימיטיבים של המותג ב-`components/ui/` (לצד shadcn, בשמות שלא מתנגשים: `num.tsx`, `price.tsx`, `ltr-input.tsx`, `dir-icon.tsx`, `status-badge.tsx`, `empty-state.tsx`, `marquee.tsx`), רכיבי נגישות ב-`components/a11y/`, וידאו ב-`components/video/`, קרדיטים ב-`components/billing/`. כל מחרוזת מגיעה מ-`messages/he.json` (namespace `common`, §19).

### 10.1 `Num` — מספר מבודד עם ספרות טבלאיות

```ts
// components/ui/num.tsx
export type NumFormat =
  | "integer"   // 1,000
  | "decimal"   // 1.25
  | "percent"   // value is a FRACTION: 0.2 -> "20%"
  | "signed"    // +70 / −50 (ledger deltas)
  | "compact"   // 12.5 אלף
  | "credits"   // integer with grouping, same as "integer" but semantic
  | "duration"  // seconds -> "0:30"
  | "timecode"; // milliseconds -> "00:12.4" (font-mono)

export interface NumProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "prefix"> {
  value: number | null | undefined;
  format?: NumFormat;                 // default "integer"
  fractionDigits?: number;            // decimal / percent
  hePrefix?: "ב" | "ל" | "מ" | "ה" | "ש" | "כ" | "ו"; // renders "ב-30" glued (whitespace-nowrap)
  animate?: boolean;                  // count-up when it enters the viewport / changes; off under reduced motion
  fallback?: string;                  // when value is null/undefined; default "—"
  srLabel?: string;                   // optional full sentence for screen readers, e.g. "240 קרדיטים זמינים"
}
```

- מרנדר `<bdi dir="ltr" className="num">` (או `font-mono` ל-`timecode`). עם `hePrefix`: `<span class="whitespace-nowrap">ב-<bdi>…</bdi></span>`.
- `animate`: Motion `animate()` מ-0 (או מהערך הקודם) לערך החדש ב-600ms `ease-out`; ב-`data-motion="reduce"` — מוצג הערך הסופי מיד. הערך הסופי הוא תמיד מה שקוראי מסך מקבלים (`aria-hidden` על הספרות המתחלפות + טקסט `sr-only` סופי).
- מינוס: U+2212. אפס בפורמט `signed`: "0" בלי סימן.

### 10.2 `Price` — מחיר בשקלים עם מע״מ

```ts
// components/ui/price.tsx
export interface PriceProps {
  amountIls: number;                                   // VAT-inclusive unless vat="excluded" (caller computes net via lib/billing/vat.ts)
  cycle?: "monthly" | "annual_monthly" | "annual_total" | "one_time" | null;
  vat?: "included" | "excluded" | "hidden";            // default "included" -> "כולל מע״מ"
  compareAtIls?: number | null;                        // struck-through original price (annual toggle)
  annualTotalIls?: number | null;                      // with cycle="annual_monthly": "₪1,140 בחיוב שנתי"
  size?: "sm" | "md" | "lg" | "xl";                    // xl = pricing card hero number
  agorot?: "auto" | "always";                          // auto hides .00
  className?: string;
}
```

| גודל | מספר | ₪ | שורת מחזור/מע״מ |
|---|---|---|---|
| `sm` | 15px/600 | אותו גודל | inline, `text-muted` |
| `md` | 19px/700 | אותו גודל | inline |
| `lg` | 32px/800 | 0.6em, מיושר לעליון | שורה מתחת |
| `xl` | 56px/800 (Heebo, לא Karantina) | 0.55em, מיושר לעליון | שורה מתחת, `text-small` |

- מבנה: `[₪119][לחודש]` · `[כולל מע״מ]`. הספרות והסימן בתוך `<bdi dir="ltr" class="num">`, כך שהתצוגה היא תמיד "₪119".
- קוראי מסך: החלק החזותי `aria-hidden`, ולצידו `sr-only` במבנה "119 שקלים לחודש, כולל מע״מ" (ועם `compareAtIls`: "95 שקלים לחודש במקום 119, בחיוב שנתי של 1,140 שקלים, כולל מע״מ").
- `compareAtIls` מוצג כ-`<del>` בצבע `muted` לפני המחיר.
- אין עיגול: המחיר מוצג כפי שהוא בטבלת `plans`/`credit_packs`.

### 10.3 `LtrInput` — שדות שערכם משמאל לימין

```ts
// components/ui/ltr-input.tsx
export type LtrKind = "phone" | "email" | "url" | "coupon" | "vat_id" | "otp" | "hex" | "number";

export interface LtrInputProps extends Omit<React.ComponentProps<"input">, "dir" | "type" | "inputMode"> {
  kind: LtrKind;
  invalid?: boolean;
  size?: "md" | "lg";
  adornment?: React.ReactNode;   // rendered on the physical LEFT inside the LTR box (e.g. "https://", a color swatch)
  normalizeOnBlur?: boolean;     // default true: phone -> 050-123-4567, url -> adds https://, coupon -> UPPERCASE, email -> trim+lowercase
}
```

| `kind` | `type` / `inputMode` / `autoComplete` | placeholder ברירת מחדל | אימות (Zod, הודעה בעברית) |
|---|---|---|---|
| `phone` | `tel` / `tel` / `tel` | "050-123-4567" | נייד/נייח ישראלי או `+972`; "מספר הטלפון לא נראה תקין" |
| `email` | `email` / `email` / `email` | "name@business.co.il" | "כתובת המייל לא נראית תקינה" |
| `url` | `text` / `url` / `url` | "example.co.il" | מקבל בלי `https://`; "הכתובת לא נראית תקינה. כדאי לבדוק שאין בה רווחים." |
| `coupon` | `text` / `text` / `off` | "WELCOME" | אותיות לטיניות וספרות |
| `vat_id` | `text` / `numeric` / `off` | "123456789" | 9 ספרות, כולל ספרת ביקורת (אלגוריתם מספר הזהות, שמשמש גם לח.פ. ולע.מ.); "מספר הזהות או ח.פ. לא תקין" |
| `otp` | `text` / `numeric` / `one-time-code` | — | הדבקה מותרת תמיד (WCAG 3.3.8) |
| `hex` | `text` / `text` / `off` | "#FFB547" | `#RRGGBB` |
| `number` | `text` / `decimal` / `off` | — | לפי השדה |

- תמיד `dir="ltr"`, `text-end` (בקופסה LTR "סוף" = ימין, כך שהערך מיושר לקצה של טופס עברי), `spellCheck={false}`, `autoCapitalize="off"`. גם ה-placeholder מיושר לסוף.
- התווית, טקסט העזר וההודעות — בעברית, מחוץ לשדה, ב-RTL.
- placeholder עברי בשדה LTR (למשל "האתר או האינסטגרם שלכם" ב-hero) נכתב בלי פיסוק בסופו.

### 10.4 `DirIcon` — אייקון כיווני סמנטי

```ts
// components/ui/dir-icon.tsx
import type { LucideProps } from "lucide-react";
export type DirIconName =
  | "next" | "prev"                    // chevrons
  | "forward" | "back"                 // arrows ("המשך" / "הקודם", "לכל ההוקים ←")
  | "first" | "last"                   // pagination
  | "sidebarCollapse" | "sidebarExpand"
  | "undo" | "redo"
  | "send" | "reply" | "logout";
export interface DirIconProps extends Omit<LucideProps, "ref"> { name: DirIconName; }
```

| שם | RTL | LTR |
|---|---|---|
| `next` | `ChevronLeft` | `ChevronRight` |
| `prev` | `ChevronRight` | `ChevronLeft` |
| `forward` | `ArrowLeft` | `ArrowRight` |
| `back` | `ArrowRight` | `ArrowLeft` |
| `first` / `last` | `ChevronsRight` / `ChevronsLeft` | `ChevronsLeft` / `ChevronsRight` |
| `sidebarCollapse` / `sidebarExpand` | `PanelRightClose` / `PanelRightOpen` | `PanelLeftClose` / `PanelLeftOpen` |
| `undo` / `redo` | `Redo2` / `Undo2` (הגליפים מוחלפים) | `Undo2` / `Redo2` |
| `send`, `reply`, `logout` | `SendHorizontal`, `Reply`, `LogOut` עם `-scale-x-100` | ללא היפוך |

הבחירה נעשית לפי `useDir()` (ידוע כבר ב-SSR, ולכן אין אי-התאמת hydration). ברירת מחדל: `size={20}`, `strokeWidth={1.5}`, `aria-hidden`. **אסור** להשתמש ב-`DirIcon` לאייקוני מדיה, וי, לוגו או ₪.

### 10.5 `VideoTile` — אריח וידאו לופ שמתנגן רק כשנראה

```ts
// components/video/video-tile.tsx
export interface VideoTileProps {
  src: string;                                   // MP4 H.264 loop (marketing walls: 540×960, ≤ 1.2 MB, 4–6 s)
  sources?: Array<{ src: string; type: string }>; // optional AV1/WebM first
  poster: string;                                // required: AVIF ≤ 40 KB (marketing) or render poster.jpg
  alt: string;                                   // Hebrew description (see §15.4)
  aspect?: "9:16" | "1:1" | "16:9" | "4:5";      // default "9:16"
  playMode?: "visible" | "hover" | "manual";     // default "visible" (walls); "hover" in galleries/grids; "manual" = poster only
  nicheLabel?: string | null;                    // chip at top-start
  durationSec?: number | null;                   // chip at bottom-end, LTR "0:30"
  badge?: React.ReactNode;                       // e.g. StatusBadge at top-end
  beam?: boolean;                                // gold BorderBeam on hover (marketing only, dark only)
  priority?: boolean;                            // above the fold: eager poster + preload="metadata"
  onOpen?: () => void;                           // makes the tile a button that opens a VideoPlayer dialog/sheet
  className?: string;
}
```

| מצב | התנהגות |
|---|---|
| idle | פוסטר בלבד; `preload="none"` (או `metadata` עם `priority`) |
| visible + תנועה מותרת | `play()` כשלפחות 50% מהאריח גלוי (`IntersectionObserver`, threshold 0.5); `pause()` כשיוצא, ב-`visibilitychange` ובעצירה של `VideoWall` |
| hover (`playMode="hover"`) | ניגון ב-`pointerenter`/`focus`, עצירה וחזרה לפריים 0 ב-`pointerleave`/`blur`; במגע — לא מתנגן אוטומטית |
| reduced motion | אף פעם לא מתנגן לבד; כפתור ▶ קטן בפינה ("ניגון הסרטון") שמנגן בלחיצה |
| error | הפוסטר נשאר, בלי ניסיון חוזר ובלי הודעה (קישוטי) |
| `onOpen` | האריח הוא `<button>` עם `aria-label="צפייה בסרטון: {alt}"`; Enter/Space פותחים |

חזותית: `frame-tile` (רדיוס 14px + קו פנימי `--color-frame`), `object-cover`, שכבת scrim תחתונה (`linear-gradient(to top, rgb(0 0 0 / .55), transparent 35%)`) רק כשיש chips. תמיד `muted`, `playsInline`, `loop`, `disablePictureInPicture`. הווידאו עצמו `aria-hidden` (התיאור ב-`alt` של העוטף). לכל היותר 6 אריחים מתנגנים בבת אחת בעמוד (מנוהל ע״י `VideoWall`).

### 10.6 `PhoneFrame` — מסגרת טלפון

```ts
// components/video/phone-frame.tsx
export interface PhoneFrameProps {
  children: React.ReactNode;              // VideoTile, VideoPlayer, Remotion Player or an image
  size?: "sm" | "md" | "lg";              // screen widths 220 / 300 / 360 px (9:16)
  aspect?: "9:16" | "1:1" | "16:9";       // 1:1 and 16:9 render a "feed post" card instead of a phone
  chrome?: "phone" | "bare";              // bare = rounded screen only (mobile, tight layouts)
  showSafeZones?: boolean;                // overlay for 9:16 (SafeZoneToggle)
  glow?: boolean;                         // projector glow behind (marketing, dark only)
  label?: string;                         // accessible name: role="group" aria-label
  className?: string;
}
```

- טלפון גנרי (לא דגם של יצרן): גוף ברדיוס 44px, מסגרת 10px ב-`surface-3` עם קו `border-strong/40`, "אי" עליון גלולה ברוחב 28%, `elev-3`.
- **שכבת אזורים בטוחים (9:16)**, ביחס למסך 1080×1920, צבועה `rose/10` עם קו מקווקו ותוויות `text-micro`:
  - 0–12% מלמעלה: "ממשק הרשת" · 15–55%: "אזור ההוק" (מתאר ירוק) · 62–78%: "אזור הכתוביות" (מתאר ירוק).
  - 78–100% מלמטה: "כיתוב ופעולות של הרשת" · עמודה פיזית בצד **ימין**, ברוחב 14%, בין 40% ל-85% גובה: "כפתורי הרשת". לא מתהפכת ב-RTL — כך זה נראה באפליקציות עצמן.

### 10.7 `VideoPlayer` — נגן לסרטונים מוגמרים

```ts
// components/video/video-player.tsx
export interface VideoPlayerProps {
  src: string;                                    // signed URL (1 h) or public-media URL
  poster?: string;
  title: string;                                  // Hebrew; region label "נגן וידאו: {title}"
  aspect: "9:16" | "1:1" | "16:9";
  captions?: { src: string; label?: string; default?: boolean } | null; // WebVTT, srclang="he"
  captionsBurnedIn?: boolean;                     // true for our renders: track exists but is off by default
  transcript?: string | null;                     // text alternative, shown in a "תמליל ותיאור הסרטון" disclosure
  allowDownload?: boolean;
  downloadUrl?: string;                           // signed URL with ?download=1
  startMuted?: boolean;                           // default false; never autoplays with sound
  onPlay?: () => void;                            // analytics by caller: preview_played (app) / example_played (marketing)
  onEnded?: () => void;
  className?: string;
}
```

- **בנוי על `<video>` נייטיב עם בקרות שלנו** (בלי תלות בספריית נגן). פס הבקרות עטוף `dir="ltr"` (`ltr-zone: media controls`), משמאל לימין: נגן/השהה · 5 שניות אחורה · 5 שניות קדימה · זמן `0:12 / 0:30` · סרגל התקדמות (Radix Slider, `dir="ltr"`) · השתקה · עוצמה · כתוביות · מהירות (0.75/1/1.25/1.5) · מסך מלא · הורדה.
- תוויות עבריות לכל כפתור (`common.player.*`, §19); הסרגל: `aria-label="מיקום בסרטון"`, `aria-valuetext="0:12 מתוך 0:30"`.
- **מקלדת** (כשהפוקוס בתוך הנגן): רווח/K נגן-השהה · ←/→ 5 שניות (→ תמיד קדימה בזמן, כי הציר LTR) · J/L 10 שניות · Home/End התחלה/סוף · M השתקה · C כתוביות · F מסך מלא · ↑/↓ עוצמה (כשהפוקוס על בקר העוצמה).
- הבקרות נעלמות אחרי 2.5 שניות של ניגון ללא תנועה — **לעולם לא** כשהנגן מושהה או כשיש פוקוס בתוכו.
- כתוביות `<track kind="captions" srclang="he" label="עברית">`; עיצוב `::cue`: Heebo 600, לבן על `rgb(8 8 12 / .78)`; כש-`profiles.larger_captions` — `font-size: 140%`.
- לפני ניגון ראשון: כפתור ▶ גדול במרכז (64px, זהב). iOS: מסך מלא נייטיב. אין autoplay עם קול, אף פעם.
- שגיאה: הפוסטר + הודעה "לא הצלחנו לטעון את הסרטון. אפשר לרענן את הדף ולנסות שוב." + כפתור "נסו שוב".
- `LivePreviewPhone` (Remotion Player) משתמש באותו פס בקרות דרך הרכיב הפנימי `VideoControls`, ולא בבקרות המובנות של ה-Player.

### 10.8 `CostBadge` — עלות בקרדיטים לפני כל יצירה

```ts
// components/billing/cost-badge.tsx
export interface CostLine { actionKey: string; label: string; units: number; credits: number } // label = credit_costs.label_he
export interface CostBadgeProps {
  credits: number | null;          // null while estimating
  balance?: number | null;         // enables the "insufficient" state
  variant?: "suffix" | "chip" | "inline"; // suffix: inside a Button after " · "
  breakdown?: CostLine[];          // shown in a popover ("פירוט העלות")
  free?: boolean;                  // shows "חינם"
  className?: string;
}
```

| מצב | תצוגה | קורא מסך |
|---|---|---|
| estimating | skeleton ברוחב 4ch | "מחשבים עלות…" |
| ready | "107 קרדיטים" / "קרדיט אחד" | "עלות: 107 קרדיטים" |
| free | "חינם" | "חינם, בלי קרדיטים" |
| insufficient (`balance < credits`) | "107 קרדיטים · חסרים 23" בצבע `rose` + `CircleAlert` | "עלות 107 קרדיטים. חסרים 23 קרדיטים ביתרה" |

- בכפתור: `<Button cost={107}>צרו את הסרטון</Button>` → "צרו את הסרטון · 107 קרדיטים". הכפתור לא נחסם במצב insufficient — הלחיצה פותחת את `TopUpDialog` (חלק 03).
- `breakdown` מוצג בפופאובר (לחיצה; גם במגע) כטבלה: תיאור · יחידות · קרדיטים, ושורת סך הכול. המספרים מגיעים מ-`POST /api/projects/[id]/estimate` — לעולם לא מחושבים בקליינט.

### 10.9 `CreditsMeter` — מד הקרדיטים

```ts
// components/billing/credits-meter.tsx
export interface CreditSummary {           // camelCase mapping of the get_credit_summary() row (Part 04 §10.5)
  balance: number; reserved: number; planAllowance: number | null; expiring30d: number; nextResetAt: string | null;
}
export interface CreditsMeterProps {
  summary: CreditSummary | null;           // null = loading
  variant?: "pill" | "card";               // pill in TopBar; card on /app/billing
  lowThreshold?: number;                   // default: 15% of planAllowance, or 30 credits when planAllowance is null
  onTopUp?: () => void;                    // opens TopUpDialog
}
```

- **pill:** `Zap` + `Num` (היתרה) + טבעת התקדמות SVG (24px, `balance / planAllowance`, בצבע `primary-text`, עם כיוון השעון, לא מתהפכת). מצב נמוך: הטבעת והמספר ב-`rose`; אפס: "0" ב-`rose`. טעינה: skeleton בצורת pill. כפתור עם `aria-label="יתרת קרדיטים: 240. לפירוט"`.
- **הפופאובר / card:** "יתרה" · "שמורים ליצירות שרצות עכשיו" · "יפוגו ב-30 הימים הקרובים" · "המכסה החודשית מתחדשת ב-1 בנובמבר" · כפתורים "רכישת קרדיטים" (primary) ו"כמה עולה כל סרטון?" (link).
- שינוי יתרה (אחרי יצירה או החזר) מונפש עם `Num animate`. ירידה מתחת לסף לא חוסמת יצירה שכבר רצה, אף פעם.

### 10.10 `StatusBadge` — סטטוס עם אייקון וטקסט (לעולם לא צבע בלבד)

```ts
// components/ui/status-badge.tsx
import type { Enums } from "@/lib/supabase/enums";   // Supabase generic helper: Enums<"job_status"> (Part 04 §17.4)
export type StatusBadgeProps =
  | { kind: "project"; status: Enums<"project_stage"> }
  | { kind: "job"; status: Enums<"job_status"> }
  | { kind: "step"; status: Enums<"step_status"> }
  | { kind: "scene"; status: "pending" | "generating" | "ready" | "failed" | "degraded" }   // scenes.status text check
  | { kind: "payment"; status: Enums<"payment_status"> }
  | { kind: "approval"; status: Enums<"approval_status"> }
  | { kind: "subscription"; status: Enums<"subscription_status">; cancelAtPeriodEnd?: boolean; periodEnd?: string }
  | { kind: "refund"; status: "requested" | "approved" | "paid" | "rejected" };          // refund_requests.status text check
// + common: size?: "sm" | "md"; className?: string
```

| גוון | צבע | אייקון |
|---|---|---|
| neutral | `surface-3` / `text-2` | `Circle` |
| progress | `violet` + נקודה פועמת (`animate-pulse-dot`) | נקודה |
| waiting | `primary-text` | `Clock` |
| success | `success` | `Check` |
| warning | `primary-text` | `TriangleAlert` |
| danger | `danger` | `CircleAlert` |

| kind | ערך → תווית (גוון) |
|---|---|
| project | `draft` טיוטה (neutral) · `brief` בהכנה (neutral) · `script` תסריט מוכן (neutral) · `storyboard` סטוריבורד מוכן (neutral) · `voice`/`captions`/`assets`/`render` בתהליך יצירה (progress) · `done` מוכן (success) · `failed` נכשל · הקרדיטים הוחזרו (danger) |
| job | `queued` בתור (waiting) · `running` בתהליך (progress) · `waiting_external` ממתין למנוע (progress) · `succeeded` הושלם (success) · `failed` נכשל (danger) · `canceled` בוטל (neutral) |
| step | `pending` ממתין (neutral) · `running` בעבודה (progress) · `waiting_external` ממתין למנוע (progress) · `succeeded` הושלם (success) · `failed` נכשל (danger) · `skipped` דולג (neutral) · `canceled` בוטל (neutral) · `degraded` הושלם חלקית (warning) |
| scene | `pending` ממתינה (neutral) · `generating` נוצרת… (progress) · `ready` מוכנה (success) · `failed` נכשלה (danger) · `degraded` תמונה בתנועה (warning) |
| payment | `pending` ממתין (waiting) · `succeeded` שולם (success) · `failed` נכשל (danger) · `refunded` הוחזר (neutral) · `partially_refunded` הוחזר חלקית (neutral) |
| approval | `pending` ממתין לאישור (waiting) · `approved` אושר (success) · `changes_requested` התבקשו שינויים (warning) |
| subscription | `active` פעיל (success) · `active` + `cancelAtPeriodEnd` יסתיים ב-{date} (warning) · `past_due` חיוב נכשל (danger) · `canceled` בוטל (neutral) · `expired` הסתיים (neutral) |
| refund | `requested` התקבלה (waiting) · `approved` אושרה (success) · `paid` שולמה (success) · `rejected` נדחתה (danger) |

### 10.11 `EmptyState`

```ts
// components/ui/empty-state.tsx (built on shadcn Empty)
export type EmptyIllustration =
  | "projects" | "library" | "brand" | "hooks-favorites" | "search" | "notifications" | "team"
  | "clients" | "invoices" | "ledger" | "templates" | "queue" | "approval-done" | "error" | "offline" | "not-found";
export interface EmptyStateProps {
  illustration: EmptyIllustration;            // §17
  title: string;                              // ≤ 6 words
  description?: string;                       // ≤ 2 lines
  primaryAction?: { label: string; href?: string; onClick?: () => void; cost?: number };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  size?: "page" | "section" | "inline";       // page: 160px art, centered; section: 112px; inline: 64px, start-aligned
  className?: string;
}
```

ברירות מחדל לקופי (`common.empty.*`, §19; חלק 03 רשאי לדייק לכל מסך באותה רוח, ואם הנוסח שלו פונה ישירות למשתמש — עם `select` לפי §2.2): "עוד אין פרויקטים. אפשר להתחיל בסרטון הראשון." · "לא מצאנו תוצאות. אפשר לנסות מילה אחרת או לנקות את הסינון." · "אין התראות חדשות." · "עוד אין הוקים שמורים. כוכב על הוק שומר אותו כאן."

### 10.12 `CaptionPreview` — תצוגת סגנון כתוביות בלי Remotion

```ts
// components/video/caption-preview.tsx
import type { CaptionPresetId, CaptionBrandColors } from "@/remotion/captions/presets";
export interface CaptionPreviewProps {
  preset: CaptionPresetId;                        // "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft"
  brand?: Partial<CaptionBrandColors>;            // from the brand kit; falls back to preset defaults
  text?: string;                                  // default: common.captions.sample
  format?: "9:16" | "1:1" | "16:9";               // default "9:16"
  animate?: "loop" | "once" | "none";             // pickers: loop on hover/focus; "none" under reduced motion
  backdrop?: "image" | "dark" | "light" | "busy"; // contrast-check backdrops (BrandKitEditor shows all four)
  scale?: number;                                 // CSS scale relative to the 1080px canvas
  showContrastWarning?: boolean;                  // BrandKitEditor: warns when brand colors drop below 4.5:1
}
```

- מרנדר DOM רגיל עם אותם נתוני סגנון שהרינדור משתמש בהם (`CAPTION_PRESETS` מ-`remotion/captions/presets.ts`, §16.2) — מקור אמת אחד, בלי לטעון את Remotion.
- אנימציה: מעבר מילה-מילה לפי תזמון מדומה (350ms למילה) בלולאה של 3 שניות; מילים בלבד, אף פעם לא אותיות.
- אזהרת ניגודיות: "הצבעים של ערכת המותג מקשים לקרוא את הכתוביות. כדאי לבחור צבע הדגשה כהה יותר או את הסגנון "קופסה נקייה"." (מחושבת ב-`lib/format/contrast.ts`).

### 10.13 נגישות ותצוגה: `SkipLink`, `MotionToggle`, `ThemeToggle`, `UtilityMenu`, `LiveAnnouncer`, `MotionPreference`

```ts
// components/a11y/*
export function SkipLink(): JSX.Element;   // first focusable element; href="#main"; label "דילוג לתוכן הראשי"
export interface MotionToggleProps { variant?: "switch" | "menuItem"; }   // label "עצירת אנימציות"
export interface ThemeToggleProps { variant?: "segmented" | "menu"; }     // "כהה" · "בהירה" · "לפי המכשיר"
export function UtilityMenu(): JSX.Element; // header popover "תצוגה ונגישות": ThemeToggle + MotionToggle + link to /legal/accessibility
export function LiveAnnouncer(props: { children: React.ReactNode }): JSX.Element; // two visually-hidden regions: polite + assertive
export function useAnnounce(): (message: string, politeness?: "polite" | "assertive") => void;
export function MotionPreference(props: { children: React.ReactNode }): JSX.Element; // context + Motion's <MotionConfig>
export function useMotionPreference(): { reduced: boolean; source: "os" | "user" | null; setUserReduce(on: boolean): void };
```

- **`SkipLink`:** מוסתר עד פוקוס; בפוקוס — pill זהב בפינה העליונה-התחלתית (ימין), `z-80`. כל layout מרנדר `<main id="main" tabIndex={-1}>`.
- **`MotionToggle`:** כשההגדרה פעילה — עוגייה `motion=reduce`, `data-motion="reduce"`, ולמשתמש מחובר `profiles.reduce_motion=true`; אירוע `motion_toggled { on }` ועדכון מאפיין-העל `reduced_motion` (חלק 06 §14.1). אם מערכת ההפעלה כבר מבקשת הפחתת תנועה — המתג מוצג פעיל ונעול, עם ההסבר "מערכת ההפעלה שלכם מבקשת להפחית תנועה, ולכן האנימציות כבר כבויות."
- **`UtilityMenu`:** כפתור אייקון (`SlidersHorizontal`, `aria-label="תצוגה ונגישות"`) ב-`MarketingHeader` (בסוף, לפני "התחברות") וב-`TopBar` (בסוף, לפני תפריט האווטאר). במובייל — באפליקציה בתוך לשונית "חשבון" של `MobileTabBar`, ובאתר בתוך תפריט ההמבורגר. זה **התחליף המכוון לווידג׳ט נגישות** — אין תוסף נגישות צף.
- **`LiveAnnouncer`:** שני אזורי `aria-live` (`polite`, `assertive`) ב-`sr-only`, שמוזנים דרך `useAnnounce()`. הודעה זהה ברצף נשלחת שוב עם תו רווח מתחלף, כדי שקורא המסך יקריא אותה.
- **`MotionPreference`:** עוטף ב-`<MotionConfig reducedMotion={reduced ? "always" : "user"}>`, מעדכן `data-motion` ומאזין לשינויים ב-`matchMedia`.

### 10.14 `NicheIcon`, `NichePicker`

```ts
// components/niches/niche-icon.tsx
export interface NicheIconProps extends Omit<LucideProps, "ref"> { name: string | null } // niches.icon (lucide name)
// Static map of the 36 seed icons (tree-shakable). Unknown name -> Store. Always aria-hidden.

// components/niches/niche-picker.tsx
export interface NicheOption { slug: string; nameHe: string; icon: string; categorySlug: string; complianceFlag: string; priority: 1 | 2 | 3 }
export interface NichePickerProps {
  niches: NicheOption[];
  value: string | null;
  onChange: (slug: string) => void;
  variant: "combobox" | "grid" | "rail";   // hero / wizard step "niche" / NicheShowcase chips
  popularSlugs?: string[];                 // combobox: 8 chips under the input
  showCompliance?: boolean;                // grid: badge "שימו לב: כללי פרסום לנישה"
  autoFocusSearch?: boolean;
  label?: string;                          // default "מה העסק שלכם?"
}
```

- `combobox`: shadcn Combobox (Popover+Command); חיפוש שמנרמל ניקוד, גרשיים (״→") ורווחים; תוצאות מקובצות לפי `niche_categories`; אפשרות אחרונה "לא מצאתם? תארו את העסק במילים".
- `grid`: כרטיסי אייקון 3/4/6 בעמודה (מובייל/טאבלט/דסקטופ) עם חיפוש מעל; בחירה = RadioGroup (חצים מנווטים, רווח בוחר).
- `rail`: chips בגלילה אופקית RTL עם `scroll-snap`; הנבחר — `bg-primary text-on-primary`.

### 10.15 `HookCard`, `HookFilters`

```ts
// components/hooks/hook-card.tsx
import type { HookCardDTO } from "@/lib/api/contracts/hooks";          // Zod contract, Part 04 §20.3
import type { PlaceholderName } from "@/lib/hebrew/placeholders";       // Part 05 §8.2; hooks only ever contain the 17 HOOK_PLACEHOLDERS
import type { HookLocation } from "@/lib/analytics/events";             // Part 06 §14.3
export interface HookCardProps {
  hook: HookCardDTO;
  variant: "library" | "compact" | "featured" | "picker";
  // library  = full card (all zones; Part 02 calls it "default") · compact = type + niche chips, text, copy (+ "צרו סרטון" only when onCreateVideo is passed)
  // featured = hook of the day (text in h3 size, soft glow) · picker = selectable card inside the wizard (HookPicker)
  selected?: boolean;                                // picker: multi-select (variants)
  personalization?: Partial<Record<PlaceholderName, string>> | null; // fills {placeholders} live via lib/hebrew/placeholders.ts (prefix grammar)
  strength?: 1 | 2 | 3 | 4 | 5 | null;               // only for AI-written workspace_hooks ("חוזק 4 מתוך 5")
  aiWritten?: boolean;                               // tag "נכתב בשבילכם" (workspace_hooks)
  showVideo?: boolean;                               // sample_video_url as VideoTile (hover / tap)
  onCopy?: (text: string) => void;                   // copies the personalized text; event hook_copied {hook_id, niche, location}
  onCreateVideo?: () => void;                        // "צרו סרטון מההוק"
  onFavorite?: (on: boolean) => void;                // signed-in only; event hook_favorited {hook_id, on}
  onVariations?: () => void;                         // "5 וריאציות · קרדיט אחד" (gated by Part 02/03)
  onShare?: (channel: "whatsapp" | "link") => void;  // event hook_shared {hook_id, channel}
  menuItems?: React.ReactNode;                       // extra DropdownMenu items (e.g. "התאמת הפנייה" in /app/hooks)
  location: HookLocation;                            // analytics `location` (Part 06 §14.3)
}
```

- אנטומיה (הקופי, המונים והגייטינג המלאים — חלק 02 §5.2): צ׳יפ לימון עם שם סוג ההוק (`bg-lemon text-on-primary`, 15.17:1) · צ׳יפים של פלטפורמות **בטקסט** (רילס · טיקטוק · שורטס · פייסבוק · יוטיוב · וואטסאפ; לא לוגואים) · טקסט ההוק ב-`<blockquote>` (Heebo 700, 20px, `dir="rtl"`) — placeholder שלא מולא מוצג כ-`PlaceholderChip` במרקר לימון עם שם השדה ("עיר"), ומולא — בטקסט רגיל עם קו תחתון מנוקד · "מה רואים ב-3 השניות הראשונות" (`visual_direction_he`, `text-small`, `text-2`) · הערת ציות כשקיימת · פעולות: "העתקה" ("הועתק" למשך 2 שניות, והכרזה דרך `useAnnounce`), "צרו סרטון מההוק", כוכב, ושאר הפעולות שהועברו ב-props.
- `picker`: הכרטיס הוא checkbox (`role="checkbox"`, `aria-checked`); כש-`strength` קיים — מד "חוזק" (1–5 נקודות + הטקסט "חוזק 4 מתוך 5", הנקודות `aria-hidden`).
- `compact` בתוך מרקיז (`HooksTeaser`): בלי `onCreateVideo`, כלומר טקסט + צ׳יפים + העתקה בלבד; העותק המשוכפל של המרקיז `aria-hidden` + `inert` (§9.5).
- `HookFilters` (`components/hooks/hook-filters.tsx`): chips מרובי-בחירה לכל פאסט (סוג · פלטפורמה · מטרה · פנייה · עונה), שורת חיפוש, מיון, ו"ניקוי הסינון". במובייל — Sheet מתחתית עם כפתור "הצגת {n} הוקים". הסנכרון ל-URL ושמות הפאסטים — חלק 02.

### 10.16 `SectionHeading`, `GlowCard`, `LegalPage`, `Breadcrumbs`, `JsonLd`

| רכיב | Props עיקריים | חזותית והתנהגות |
|---|---|---|
| `SectionHeading` (`components/layout/`) | `eyebrow?`, `title: ReactNode`, `subtitle?`, `as?: "h1"\|"h2"\|"h3"` (ברירת מחדל `h2`), `align?: "start"\|"center"`, `display?: boolean` (Karantina), `highlight?: string` (מילה אחת → `text-gold-gradient`), `reveal?: boolean` | eyebrow כ-chip `text-micro` ב-`surface-2`; `reveal` מפעיל `WordReveal` (§12.4) — **לעולם לא על ה-H1 של ה-hero** |
| `GlowCard` | `glow?: "primary"\|"ai"\|"none"`, `spotlight?: boolean`, `interactive?: boolean`, `as?` | `surface-1` + `rounded-md`; `spotlight` = הילה שעוקבת אחרי הסמן (דסקטופ, כהה, בלי reduce) |
| `LegalPage` | `title`, `updatedAt`, `version`, `children` (MDX) | `.prose-he`; תוכן עניינים דביק בצד הסוף (שמאל) מ-`lg`; "עודכן לאחרונה: 13 באוקטובר 2026 · גרסה 1.0"; ידידותי להדפסה |
| `Breadcrumbs` | `items: { label: string; href?: string }[]` | `nav aria-label="פירורי לחם"`; מפריד `DirIcon name="next"`; הפריט האחרון `aria-current="page"`; JSON-LD נפרד דרך `JsonLd` |
| `JsonLd` (`components/seo/`) | `data: object \| object[]`, `nonce?` | `<script type="application/ld+json">` עם escape ל-`<`; התוכן — חלק 02 |

### קריטריוני קבלה
- [ ] לכל רכיב ב-§10 יש קובץ, טיפוסים כמו כאן, ו-story בדף `/admin/design` עם כל המצבים.
- [ ] בדיקות יחידה: `Num` (כל הפורמטים, `hePrefix`), `Price` (טקסט sr מלא), `LtrInput` (נרמול טלפון/URL), `DirIcon` (מיפוי RTL/LTR), `StatusBadge` (כל ערך enum ממופה — טסט שעובר על `ENUMS` מ-`lib/supabase/enums.ts`, ועל ערכי ה-check של `scenes.status` ו-`refund_requests.status`, ונכשל על ערך חסר).
- [ ] `VideoTile`: ב-`data-motion="reduce"` שום וידאו לא מנגן לבד (Playwright סופר `video:not([paused])`).
- [ ] `VideoPlayer`: כל הפעולות זמינות במקלדת; axe ירוק; `::cue` גדל ב-`larger_captions`.
- [ ] `CostBadge` מופיע על כל כפתור שמוציא קרדיטים (grep על `Idempotency-Key` בקליינט מול שימוש ב-`cost`).

---

## §11. מלאי הרכיבים המלא

שמות הרכיבים קנוניים (PascalCase), קבצים ב-kebab-case (`hook-card.tsx` מייצא `HookCard`). הטבלאות מגדירות את המבנה החזותי, הווריאנטים, המצבים וה-Props. הקופי של כל מסך — חלק 02 (שיווק) וחלק 03 (אפליקציה).

### 11.1 רכיבים משותפים (מוגדרים ב-§10)

`SkipLink` · `MotionToggle` · `ThemeToggle` · `DirIcon` · `Num` · `Price` · `LtrInput` · `VideoTile` · `PhoneFrame` · `VideoPlayer` · `CostBadge` · `CreditsMeter` · `EmptyState` · `StatusBadge` · `HookCard` · `HookFilters` · `NicheIcon` · `NichePicker` · `SectionHeading` · `GlowCard` · `LegalPage` · `Breadcrumbs` · `JsonLd`. רכיבי תשתית נוספים מהחלק הזה: `ThemeScript`, `ThemeProvider`, `MotionPreference`, `UtilityMenu`, `LiveAnnouncer`, `CaptionPreview`, `Marquee`, `WordReveal`, `BrandLogo`, `WhatsAppIcon`.

### 11.2 רכיבי האתר השיווקי (`components/marketing/`)

| רכיב | תפקיד ומבנה | וריאנטים | מצבים | Props · RTL ונגישות |
|---|---|---|---|---|
| `MarketingHeader` | לוגו בהתחלה (ימין) · ניווט במרכז · בסוף: `UtilityMenu`, "התחברות" (ghost), CTA ראשי | שקוף למעלה → `glass` אחרי 24px גלילה; מובייל: המבורגר → `Sheet side="right"` | scrolled · תפריט פתוח · מחובר (ה-CTA הופך ל"לאפליקציה") | `navItems`, `signedIn`; `nav aria-label="ראשי"`; `aria-current="page"`; 64px, `sticky top-0 z-40`; עוטף את הדף ב-`data-shell="marketing"` |
| `AnnouncementBar` | פס 36px מעל ה-header, טקסט + חץ ← + סגירה × | default · quiet-day (מוחלף ב-`quiet_day_banner`, בלי לינק שיווקי) | visible · dismissed (נשמר ב-`localStorage` במפתח `announcement.dismissed.{id}`, עטוף ב-try/catch; בלי גישה — נסגר עד הרענון הבא) | `id`, `message` (rich), `href`; כפתור סגירה `aria-label="סגירת ההודעה"` |
| `HeroPromptCard` | כרטיס `rounded-xl` ב-`glass` עם `glow-primary` ב-focus-within: `NichePicker combobox` → `LtrInput kind="url"` → מתג "אין לי אתר" שמחליף ל-textarea עם placeholder מתחלף → CTA בגודל `xl` → "חינם · ללא כרטיס אשראי" | url · describe | idle · focus · submitting (כפתור loading) · שגיאת שדה | `niches`, `defaultNiche`, `onSubmit`; ה-placeholder המתחלף (Aceternity PlaceholdersAndVanishInput) מתחלף **במילים** ונעצר ב-focus וב-reduce; התווית לא תלויה ב-placeholder |
| `VideoWall` | 3 עמודות מרקיז אנכי של `VideoTile` (למעלה / למטה / למעלה, 45 שנ׳ ללולאה) עם מסכות fade; במובייל — שורת מרקיז אופקית RTL של אריחים ברוחב 60% | desktop · mobile | playing · paused (משתמש) · reduced (גריד פוסטרים סטטי) | `items: { src, poster, alt, nicheLabel, demo?: boolean }[]` — עד שיש `examples` אמיתיים, אריחי האנימטיק של `content/demo-wall.json` (חלק 02 §3.3.6) עם התווית "הדגמה" (`common.hookCard.demo`); כפתור ⏸/▶ בפינה התחתונה-סופית: "עצירת הווידאו" / "הפעלת הווידאו"; לכל היותר 6 מתנגנים |
| `EnginesStrip` | שורת wordmarks טקסטואליים של מנועים (שימוש נומינטיבי, בלי לוגואים שלא אושרו), מונוכרום 60% | marquee · static | reduced → static | `lang="en"` על כל שם; הערת שוליים קטנה על בעלות השמות (קופי — חלק 02) |
| `NicheShowcase` | `NichePicker rail` · 3 `HookCard compact` בהתחלה · `PhoneFrame` עם דוגמה בסוף + שני אריחים קטנים 1:1 ו-16:9 | — | loading (skeleton) · אין דוגמה (פוסטר אנימטיק) | `niches`, `initialNiche`, `examplesByNiche`; `?niche=` מתעדכן ב-`router.replace` בלי גלילה; crossfade 250ms |
| `HowItWorks` | 3 צעדים ב-`<ol>`; בדסקטופ `PhoneFrame` מוצמד בצד הסוף (GSAP ScrollTrigger) ומסך הטלפון מתחלף לפי הצעד | pinned (lg+) · stacked | reduced/mobile → כרטיסים סטטיים | הצמדה לא מסתירה פוקוס; כל צעד נגיש בלי גלילה מונפשת |
| `EditorMath` | `BeforeAfterSlider` (Aceternity Compare מומר) + `SavingsCalculator` (שני סליידרים RTL + תוצאה ב-`Num animate`) + הערות שוליים עם מקורות | — | ערכי ברירת מחדל (₪550 לסרטון) | הסליידר: `role="slider"`, "לפני" מימין, `aria-valuetext="72% אחרי"`; חלופה ללחיצה על המסלול (WCAG 2.5.7) |
| `FeatureBento` | 8 אריחים; האריח הגדול (2×2) ראשון בהתחלה (ימין); לכל אריח מיקרו-דמו בלולאה | — | reduced → פריים סטטי | `BorderBeam` על האריח הגדול; spotlight בדסקטופ בלבד; כל דמו `aria-hidden` עם תיאור טקסטואלי |
| `HooksTeaser` | 2 שורות מרקיז RTL בכיוונים מנוגדים של `HookCard marquee` + חיפוש → `/hooks?q=` + CTA | — | paused ב-hover/focus/כפתור · reduced → שתי שורות גלילה ידנית | העותק המשוכפל `aria-hidden` + `inert`; כפתור "עצירת התנועה" |
| `ShowcaseGallery` | Masonry (CSS columns) של `VideoTile playMode="hover"` + chips סינון (נישה · פורמט · מטרה); במובייל לחיצה פותחת `Drawer` עם `VideoPlayer` ו"צרו סרטון כזה" | — | loading · מסונן-ריק · לא מרונדר כשלא מתקיים כלל ההצגה של חלק 02 §3.10 | `examples` מפורסמים; פריט הדגמה (מדוגמאות נספח D) רק עם התווית "הדגמה", ודוגמה אמיתית מחליפה אותו באותו מקום כשהיא מתפרסמת |
| `Testimonials` | קרוסלת Embla RTL: תמונה, עסק, ציטוט, תוצאה | — | **לא מרונדר בכלל** כשאין המלצות אמיתיות | `items`; קרוסלה נגישה (§9.5) |
| `PricingCards` | 4 כרטיסים; `ToggleGroup` חודשי/שנתי ("חסכו 20%"); מתג "מחירים לעסקים (לפני מע״מ)"; `business` מודגש: גבול זהב + badge "הכי פופולרי" | monthly · annual · b2b | — | `Price size="xl"`; רשימת פיצ׳רים עם `Check` (לא מתהפך); ה-CTA מתאר את התוכנית ("בחירה בתוכנית עסק") |
| `CreditCostTable` | טבלה: סוג סרטון · משך · איכות · קרדיטים; במובייל כרטיסים | — | — | מספרים ב-`Num`; `caption` לטבלה |
| `FaqAccordion` | Accordion (`type="multiple"`); chevron בסוף השורה | — | — | `items: { id: string; q_he: string; a_he: string }[]` (אותו מבנה כמו `niches.faq` ו-`faqPage()` ב-`lib/seo/jsonld.ts`; בעמודים סטטיים הערכים נשלפים מ-`marketing.faq.items.{id}.q/.a`), `location` לאירוע `faq_expanded`; כמה פריטים יכולים להיות פתוחים; הכותרת היא כפתור בתוך `<h3>`; JSON-LD דרך `JsonLd` |
| `FinalCtaBand` | פס ברוחב מלא עם `bg-projector` חזק, H2 בגופן תצוגה, `NichePicker combobox` + CTA | — | — | H2 עם `display` (Karantina) — רגע התצוגה היחיד בדף מלבד ה-hero |
| `MarketingFooter` | 4–5 עמודות: מוצר · נישות · הוקים · משאבים · חברה ומשפטי (כולל "הצהרת נגישות" ו"ביטול מנוי"); ניוזלטר עם צ׳קבוקס הסכמה **לא מסומן** | — | שליחת ניוזלטר: idle · submitting · success · error | `footer` עם `nav aria-label="קישורים בתחתית"`; `LtrInput kind="email"` |
| `MobileStickyCta` | פס 72px `glass` מתחת ל-`md`: בהתחלה CTA "צרו סרטון חינם", בסוף כפתור וואטסאפ | — | מופיע אחרי שה-hero יוצא מהמסך; נעלם כשה-footer נראה | `WhatsAppIcon` + `aria-label="דברו איתנו בוואטסאפ"`; `z-40`; `scroll-padding-bottom` |

### 11.3 רכיבי האפליקציה (`components/layout|wizard|editor|video|billing|brand|team/`)

| רכיב | תפקיד ומבנה | וריאנטים | מצבים | Props · RTL ונגישות |
|---|---|---|---|---|
| `AppShell` | `data-shell="app"`; `SidebarNav` (התחלה) + `TopBar` + `<main id="main">`; `MobileTabBar` מתחת ל-`md`; משבצת לבאנרים (יום שקט, בחירות, תחזוקה) | — | sidebar פתוח/מכווץ (עוגיית `sidebar_state`) | מקבל `profile` (theme, ui_gender_form) ומסנכרן עוגיות |
| `SidebarNav` | shadcn Sidebar `side="right"`, 248/72px; "סרטון חדש" ככפתור ראשי; פריט פעיל: פס 2px בקצה ההתחלה (`border-s-2 border-primary-text`) | expanded · collapsed (אייקונים + Tooltip) | "לקוחות" רק בתוכנית סוכנות | `nav aria-label="ניווט באפליקציה"`, `aria-current="page"`; אייקונים לפי §14.2 |
| `TopBar` | 56px: `WorkspaceSwitcher` (התחלה) · טריגר ⌘K במרכז ("חיפוש נישה, הוק או פרויקט" + `Kbd`) · בסוף: `CreditsMeter`, `NotificationBell`, `UtilityMenu`, תפריט אווטאר | — | — | `header`; במובייל: לוגו + `CreditsMeter` + התראות בלבד |
| `WorkspaceSwitcher` | Popover + Command: הסביבה הנוכחית (אות ראשונה + שם `dir="auto"`), קבוצות "הסביבה שלי" / "לקוחות"; "סביבת לקוח חדשה" לסוכנות | — | טוען · ריק | מחליף את עוגיית `ws` דרך השרת; `aria-label="החלפת סביבת עבודה"` |
| `CommandMenu` | cmdk ב-Dialog: פעולות · פרויקטים · נישות · הוקים · הגדרות | — | ריק (`common.empty.search`: "לא מצאנו תוצאות. אפשר לנסות מילה אחרת או לנקות את הסינון.") · טוען | Ctrl+K / ⌘K; `dir="rtl"`; הפריט הנבחר מוכרז |
| `MobileTabBar` | 64px: בית · פרויקטים · ＋ · הוקים · חשבון; ＋ עיגול זהב 52px | — | — | תוויות תמיד גלויות; `aria-current`; ＋ `aria-label="סרטון חדש"` |
| `WizardStepper` | 9 שלבים (`business · niche · goal · hook · script · style · voice · music · preview`) ב-`<ol>`; שלב 1 מימין; שלבים שהושלמו לחיצים | desktop · compact ("שלב 3 מתוך 9 · …" + פס התקדמות) | הושלם · נוכחי · עתידי (לא לחיץ) | `aria-current="step"`; תוויות השלבים — חלק 03 |
| `WizardFooter` | פס דביק: "הקודם" (התחלה, secondary, `DirIcon back`) · מחוון שמירה · "המשך" (סוף, primary, `DirIcon forward`, `cost` כשהשלב מוציא קרדיטים) | — | saving ("שומרים…") · saved ("נשמר") · error ("לא נשמר. ננסה שוב בעוד רגע") | `z-40`; Enter בשדה אחרון (לא textarea) = "המשך" רק כשהשלב תקין |
| `LivePreviewPhone` | `PhoneFrame` + Remotion Player (טעינה עצלה) + `VideoControls`; `ToggleGroup` 9:16/1:1/16:9; `SafeZoneToggle`; `CostBadge chip` + משך משוער | desktop (5 עמודות בסוף, sticky) · mobile (מיני-טלפון צף בפינה התחתונה-סופית → `Drawer`) | ריק (גרדיאנט בצבעי המותג + "התצוגה המקדימה תופיע כאן") · טוען · מנגן · reduced (בלי autoplay) | `aria-label="תצוגה מקדימה של הסרטון"`; גופני הכתוביות מ-`caption-fonts.ts` (§5.1), לא מ-`@remotion/google-fonts` |
| `BrandCard` | כרטיס עריכה לתוצאת `BrandProfileV1`: לוגו · צבעים (swatches + `LtrInput hex`) · שם (`dir="auto"`) · שירותים (chips) · עיר · טלפון (`LtrInput phone`) · טון · עובדות לאישור | — | streaming (שורות "מצאנו לוגו" מופיעות אחת-אחת) · שגיאה ("לא הצלחנו לקרוא את האתר. אפשר למלא ידנית.") · ערוך | שורות ההתקדמות ב-`aria-live="polite"`; עובדה לא מאושרת לא נכנסת לתסריט. **שימו לב:** לא לבלבל עם שכבת Remotion `remotion/layers/BrandCard.tsx` |
| `HookPicker` | טאבים "הוקים בשבילכם" · "מהספרייה" · "כתבו בעצמכם"; גריד `HookCard picker`; סיכום "3 הוקים = 3 גרסאות · +N קרדיטים"; "עוד הוקים" עם `cost` | — | streaming (skeletons בגאומטריית כרטיס) · מקסימום נבחר (שאר הכרטיסים `aria-disabled` + הסבר) · שגיאה | `max={limits.hook_variants_max}`; מתגי פנייה ורמת שפה |
| `ScriptEditor` | רשימת beats: chip תפקיד · chip קוד זמן (מונו, LTR) · קריינות (textarea) · טקסט על המסך (מונה ≤ 8 מילים) · תפריט "שכתוב" (קצר יותר · אנרגטי יותר · רשמי יותר · הוראה משלכם); מד אורך מול משך | — | streaming (`aria-busy`, הכרזה בסוף בלבד) · placeholder חסר (`{מחיר}` מסומן "צריך למלא") · rewriting | `textarea dir="rtl"`; קוד זמן ב-`Num format="duration"` |
| `QualityModePicker` | RadioGroup כרטיסים: טיוטה · סטנדרט · פרימיום, עם הפרש עלות; "מתקדם" (Collapsible) מציג שמות מנועים | — | נעול לפי תוכנית (מנעול + "זמין בתוכנית עסק") | `aria-describedby` להפרש העלות |
| `VisualMixPicker` | RadioGroup כרטיסים: תמונות בתנועה · משולב (מומלץ) · וידאו מלא, עם איור לופ קטן והפרש עלות | — | נעול או מוגבל לפי `plans.limits` (`visual_mix`, `max_ai_clips`, `max_ai_clip_sec`) — בתוכנית החינמית זה יוצא קליפ AI אחד של עד 5 שנ׳; ההסבר ליד הכרטיס, לא רק מנעול | איורים `aria-hidden` |
| `VoicePicker` | כרטיסי קול (שם, מגדר, גיל, טון) + "השמעת דוגמה"; סליידר מהירות (RTL); "בלי קריינות"; קישור "תיקון הגייה" | — | מנגן (גל קול LTR) · טוען · אין קולות (אפשרות "בלי קריינות" בלבד) | RadioGroup; כפתור הדוגמה `aria-pressed` |
| `MusicPicker` | chips של מצב רוח; שורות רצועה: נגן · שם · מצב רוח · משך · גל קול (LTR); "מוזיקה מקורית לסרטון" עם `cost`; "בלי מוזיקה" | — | מנגן · נעול לפי תוכנית | רק רצועה אחת מתנגנת בכל רגע |
| `CaptionPresetPicker` | 6 כרטיסים עם `CaptionPreview` (לופ ב-hover/focus): פופ · קופסה נקייה · קריוקי · פוסטר · חדשות · רך; בורר צבע הדגשה; מיקום (תחתון / אמצע) | — | נבחר · reduced (סטטי) | RadioGroup; טוען את `caption-fonts.ts` |
| `SafeZoneToggle` | Switch "הצגת אזורים בטוחים" + Tooltip הסבר | — | — | שולט ב-`PhoneFrame.showSafeZones` |
| `ConfirmGenerateDialog` | סיכום (פורמטים, משך, איכות, ויז׳ואל, גרסאות) · `CostBadge` עם פירוט · שורה משנית "כולל התסריט שכבר נוצר: {total} קרדיטים בסך הכול" · "אחרי היצירה יישארו 202 קרדיטים" · הבטחת ההחזר · שורת מדיניות ה-AI מעל הכפתורים (קישור ל-`/legal/ai-policy` בלשונית חדשה, בלי צ׳קבוקס) · "צרו את הסרטון · 107 קרדיטים" / "חזרה לעריכה" (הנוסחים המלאים — חלק 03 §6.10) | — | insufficient (הראשי הופך ל"רכישת קרדיטים") · חסום מדיניות (בחירות / יום שקט) · submitting | פוקוס ראשוני על כפתור "חזרה לעריכה" (פעולה שעולה כסף לא מקבלת פוקוס אוטומטי) |
| `RenderProgress` | טלפון במרכז עם התוצר המתקדם ביותר; `Progress variant="ai"` + זמן משוער; `StageList`; `SceneStrip`; "אפשר לסגור את הדף. נשלח לכם מייל כשהסרטון מוכן." | — | running · waiting_external · degraded (הודעה לכל סצנה) · failed (כרטיס danger + פעולות) · succeeded (נגן + הורדות; קונפטי רק בלי reduce) | הכרזות `aria-live` לפי §13.3 |
| `StageList` | `<ol>` של שלבים: ✓ · נקודה פועמת · שעון · ✕, עם זמן שעבר | vertical · compact | — | `aria-current="step"` על הפעיל |
| `SceneStrip` | שורה אופקית (RTL) של מיני-כרטיסי 9:16: skeleton → keyframe מטושטש (`blur-md` + `shimmer-ai`) → קליפ מתנגן | — | failed · degraded (badge "תמונה בתנועה") | כל כרטיס `aria-label="סצנה 3: מוכנה"` |
| `SceneCard` | תמונה ממוזערת · "סצנה 3" · שורת תסריט · chip משך · badge מקור (וידאו AI / תמונה בתנועה / צילום שלכם / כרטיס מותג) · ידית גרירה · תפריט (יצירה מחדש עם `cost` · החלפת מדיה · הזזה למעלה · הזזה למטה · מחיקה) | list · strip | default · selected (טבעת `primary-text`) · generating (`glow-ai`) · failed · degraded · dragging (`elev-3`, scale 1.02) | ידית: `button aria-label="הזזת סצנה 3"`; "הזזה למעלה/למטה" = חלופה לגרירה (WCAG 2.5.7) |
| `SceneList` | רשימה אנכית ממוינת (dnd-kit + KeyboardSensor), 360px בצד ההתחלה | — | ריק · טוען | הכרזות גרירה בעברית (§13.4) |
| `ScenePropertiesPanel` | טאבים: סצנה · טקסט וכתוביות · מותג · קול · מוזיקה; 320px בצד הסוף | desktop · mobile (`Sheet side="left"` = צד הסוף) | אין סצנה נבחרת (`common.empty.selectScene`: "אפשר לבחור סצנה ולערוך אותה כאן") | כולל שדה משך מספרי (חלופה לידיות החיתוך) |
| `TimelineLite` | `dir="ltr"`: סרגל זמן (מונו) · ראש ניגון · 4 מסלולים: סצנות · קריינות (גל) · מוזיקה (גל + ducking) · כתוביות (chips מילים); תוויות המסלולים בעברית בעמודה השמאלית | — | ניגון · סצנה נבחרת · reduced (בלי גלילה אוטומטית) | בלוק סצנה פוקוסבילי: ←/→ = סצנה קודמת/הבאה בזמן; ידית חיתוך `role="slider"` (←/→ 0.1 שנ׳, Shift = שנייה) |
| `ExportDialog` | צ׳קבוקסים לפורמטים (9:16 · 1:1 · 16:9); רשימת הורדות: MP4 לכל פורמט, SRT, VTT, פוסטר; תזכורת סימון AI | — | מכין · מוכן · קישור פג (רענון) | גדלי קבצים ב-`Num` |
| `ShareDialog` | טאבים "צפייה ציבורית" / "אישור לקוח"; מתג הורדה; תוקף; קישור (`LtrInput kind="url" readOnly`) + "העתקה"; שיתוף לוואטסאפ; ביטול קישור | — | יוצר · נוצר · בוטל | הודעת "הקישור הועתק" דרך `useAnnounce` |
| `ApprovalPanel` | שדה שם (של מי שמאשר), הערה, "אישור הסרטון" (primary) / "בקשת שינויים" (secondary) | public (`/approve/[token]`) · internal (דף פרויקט) | ממתין · אושר · התבקשו שינויים | שם `dir="auto"`; הערה עם מונה תווים |
| `BrandKitEditor` | סקשנים: לוגו (בהיר/כהה) · צבעים · גופנים (רק 7 הגופנים הפתוחים, §5.4) · סגנון כתוביות · intro · כרטיס סיום · סימן מים · פורמט מחיר בסרטון (`shekel_format`: "₪120" · "120 ₪") · קול · מוזיקה; תצוגה חיה (`LivePreviewPhone`) | — | שמירה · אזהרת ניגודיות (`CaptionPreview` על 4 רקעים) | צבעים: swatch + `LtrInput hex` + שם הצבע לקוראי מסך |
| `PronunciationTable` | טבלה: מונח · איך לומר (ניקוד, גובה שורה 1.9) · הערה · השמעה · מחיקה; שורת הוספה | — | ריק · שומר | מונח `dir="rtl"`; השמעה מגבילה קצב (חלק 04) |
| `LedgerTable` | טבלה: תאריך · תיאור · שינוי (`Num format="signed"`, ירוק/אדום + סימן) · יתרה · קישור לפרויקט | — | ריק · טוען · עימוד | הצבע לא נושא את המידע לבד — הסימן +/− נושא |
| `PlanCards` | גרסת האפליקציה של `PricingCards` עם "התוכנית שלכם", שדרוג/שנמוך ותאריך תחולה | — | נוכחית · זמינה · נעולה | — |
| `TopUpDialog` | 3 חבילות (`pack-150` · `pack-500` · `pack-1500`) עם `Price` ומחיר לקרדיט; "קרדיטים מחבילה לא פגים"; בלוק הגילוי הנאות לפני תשלום (`billing.disclosure.*`, חלק 06 §4.1) וצ׳קבוקס חובה **לא מסומן** "קראתי את {תנאי השימוש} ואת {מדיניות הביטול}, והם מקובלים עליי."; Bit מוצג רק כש-`bitEnabled` (חלק 06 §8.2) | — | redirecting ("מעבירים לעמוד התשלום המאובטח…") · הכפתור הראשי `aria-disabled` עד סימון הצ׳קבוקס, עם הסבר | הצ׳קבוקס עם `aria-describedby` לבלוק הגילוי |
| `CancelSubscriptionFlow` | שלבים: סיבה (Radio) · פרטים · הצעת החזר (`Price`; במנוי שנתי אחרי 14 יום — בלוק החזר יחסי) · צ׳קבוקס "יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)" · אישור "ביטול המנוי" (destructive) · מסך אישור עם תאריך | — | submitting · done · צ׳קבוקס ההחזר מושבת בזמן שיצירה של הסביבה רצה (עם ההסבר "אפשר לבקש החזר אחרי שהיצירה הפעילה תסתיים.") | נגיש בתוך 2 לחיצות מ-`/app/billing`; בלי טקסט אשמה ובלי כפתורים מטעים; הנוסחים המלאים — חלק 03 §15.5 |
| `InvoiceList` | טבלה: מספר מסמך (`Num`) · תאריך · סוג · סכום (`Price sm`) · הורדת PDF | — | ריק · טוען | כפתור הורדה עם `aria-label` שכולל את מספר המסמך |
| `MembersTable` | טבלה: אווטאר · שם (`dir="auto"`) · מייל (`dir="ltr"`) · תפקיד (Select) · סטטוס הזמנה · פעולות; דיאלוג הזמנה | — | ריק · הזמנה ממתינה · נשלח | — |
| `ClientWorkspacesTable` | טבלה: לקוח · ערכת מותג · פרויקטים · פעילות אחרונה · קרדיטים החודש · "מעבר לסביבה" | — | ריק · נוצר | — |
| `NotificationBell` | Popover: רשימת התראות עם אייקון לפי `notification_kind`, זמן יחסי, "סימון הכול כנקרא" | — | ריק · לא נקראו (נקודה `rose` + מספר) | `aria-label="התראות, 3 חדשות"`; עדכון בזמן אמת לא מוכרז בקול |

### קריטריוני קבלה
- [ ] כל רכיב בטבלאות קיים בשם ובנתיב המוגדרים, ומופיע ב-`/admin/design` לפחות במצב ברירת המחדל.
- [ ] כל מצב שמופיע בעמודת "מצבים" ניתן להפעלה ב-`/admin/design` (props או fixtures).
- [ ] `Testimonials` לא מרונדר כשאין נתונים; `ShowcaseGallery` מוסתר מתחת ל-6 דוגמאות.
- [ ] גרירה בכל מקום במוצר (סצנות, סליידר לפני/אחרי, ידיות חיתוך) כוללת חלופה בלי גרירה.

---

## §12. מערכת התנועה

### 12.1 טוקנים

| טוקן | ערך | שימוש |
|---|---|---|
| `hover` | 120ms `ease-out` | צבע, רקע, קו ב-hover |
| `press` | 200ms | לחיצה (`scale .98`), מתגים, צ׳קבוקסים |
| `panel` | 320ms `ease-out` | פופאובר, Sheet, Dialog, טאבים, מעבר בין שלבי האשף |
| `reveal` | 600ms `ease-out` | כניסת סקשנים בשיווק, חשיפת מילים |
| `letterbox` | 900ms `ease-in-out` | חשיפת לטרבוקס של וידאו ראשי |
| `reduced` | ≤150ms, opacity בלבד | כל תנועה תחת reduce |
| spring של UI | `{ type: "spring", stiffness: 380, damping: 32 }` | layout animations (כרטיסי סצנה, החלפת פורמט) |
| stagger | 40–60ms | רשימות וגרידים בכניסה, פעם אחת |
| מרחק כניסה | 16px (כרטיסים) · 24px (סקשנים) · לעולם לא מעל 32px | |
| מרקיז | 40–60 שנ׳ ללולאה; קיר וידאו 45 שנ׳ | |
| הבהוב CTA | כל 6 שניות | CTA ראשי אחד בדף שיווקי |

### 12.2 `lib/motion.ts`

```ts
// lib/motion.ts — Motion (motion/react) presets. Direction-aware: "from start" = +x in RTL.
import type { Transition, Variants } from "motion/react";
export const duration = { hover: 0.12, press: 0.2, panel: 0.32, reveal: 0.6, letterbox: 0.9, reduced: 0.15 } as const;
export const ease = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] } as const;
export const spring: Transition = { type: "spring", stiffness: 380, damping: 32 };
export const stagger = { tight: 0.04, normal: 0.05, loose: 0.06 } as const;

const startX = (dir: "rtl" | "ltr", d: number) => (dir === "rtl" ? d : -d);

export const slideFromStart = (dir: "rtl" | "ltr", distance = 24): Variants => ({
  hidden: { opacity: 0, x: startX(dir, distance) },
  show: { opacity: 1, x: 0, transition: { duration: duration.reveal, ease: ease.out } },
});
export const slideFromEnd = (dir: "rtl" | "ltr", distance = 24): Variants => ({
  hidden: { opacity: 0, x: -startX(dir, distance) },
  show: { opacity: 1, x: 0, transition: { duration: duration.reveal, ease: ease.out } },
});
export const fadeUp = (distance = 16): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } },
});
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.reduced } },
};
/** Wizard step change: forward moves content toward the END side (left in RTL). */
export const stepTransition = (dir: "rtl" | "ltr", forward: boolean): Variants => {
  const s = startX(dir, 32) * (forward ? 1 : -1);
  return {
    enter: { opacity: 0, x: s },
    center: { opacity: 1, x: 0, transition: { duration: duration.panel, ease: ease.out } },
    exit: { opacity: 0, x: -s, transition: { duration: 0.2, ease: ease.out } },
  };
};
/** Returns `reducedFade` when motion is reduced (OS or toggle). */
export function useVariants(v: Variants): Variants;
```

### 12.3 כללים לפי ספרייה

| ספרייה | מותר | אסור / חובה |
|---|---|---|
| **Motion** (`motion@^12`, `motion/react`) | כל תנועת UI: מעברי שלבים, `AnimatePresence`, layout של כרטיסי סצנה, החלפת פורמט בתצוגה המקדימה, כניסת רשימות | חובה דרך `lib/motion.ts`; `MotionConfig reducedMotion` מוגדר ב-`MotionPreference`; אסור לאנימציה לשנות layout בזמן הקלדה |
| **GSAP + ScrollTrigger** (`gsap@^3.13`) | רק `HowItWorks` המוצמד (ולכל היותר סקשן נוסף אחד בשיווק) | `gsap.matchMedia()` עם `(prefers-reduced-motion: no-preference)` **וגם** בדיקת `data-motion`; SplitText רק `type: "words"`; טווינים אופקיים מוכפלים ב-`dir === "rtl" ? -1 : 1`; לא נטען באפליקציה |
| **Lenis** (`lenis@^1.3`) | גלילה חלקה באתר השיווקי בלבד | לא נטען תחת reduce; לא באפליקציה (מתנגש עם פאנלים נגללים); מסונכרן עם `ScrollTrigger.update` ו-`gsap.ticker` |
| **Magic UI** (`Marquee`, `BorderBeam`, `NumberTicker`, `BentoGrid`, `BlurFade`) | שיווק; `NumberTicker` מוחלף ב-`Num animate` | מותקנים דרך ה-registry ועוברים המרת RTL (§8.1 סעיף 6); `Marquee` משתמש ב-`--marquee-shift` שלנו |
| **Aceternity** (`PlaceholdersAndVanishInput`, `Compare`) | ה-hero וה-`EditorMath` בלבד | אפקט ה"היעלמות" של ה-input — מילים, לא אותיות; `Compare` עם כיוון RTL ומקלדת |
| **CSS** | hover, focus, shimmer, pulse, מרקיז | רק `transform` ו-`opacity` (לא אנימציה של `width/height/top/left`) |

**אסור בכל מקום:** קפיצות (bounce/overshoot), סיבובי כרטיסים בתלת-ממד, parallax על טקסט, אנימציה של אות-אחר-אות בעברית, תנועה אינסופית בלי כפתור עצירה, אנימציה על אלמנט ה-LCP.

### 12.4 אנימציית טקסט מילה-מילה (`WordReveal`)

```tsx
// components/motion/word-reveal.tsx
export interface WordRevealProps {
  text: string;                       // Hebrew; Latin/number runs are detected and kept as one <bdi> token
  as?: "h2" | "h3" | "p" | "span";
  stagger?: number;                   // default 0.05 s
  once?: boolean;                     // default true (reveal once when 40% visible)
  className?: string;
}
```

- מפצל **לפי רווחים בלבד** (`splitBidiRuns` + רווחים); כל מילה `inline-block` עם `opacity 0→1` ו-`y 8→0` ב-`reveal`. לעולם לא אותיות (אותיות סופיות ך ם ן ף ץ, ניקוד, ריצות לועזיות).
- נגישות: הטקסט המלא ב-`sr-only`, והעותק המונפש `aria-hidden` — קורא מסך שומע משפט אחד, לא מילים בודדות.
- תחת reduce: הטקסט מוצג מיד, בלי פיצול.
- **לא** משמש על ה-H1 של ה-hero (אלמנט ה-LCP) ולא על טקסט מעל 20 מילים.

### 12.5 חלופות ל-reduce (OS או "עצירת אנימציות")

| אפקט | התנהגות רגילה | תחת reduce |
|---|---|---|
| `VideoWall`, `VideoTile` | ניגון אוטומטי כשנראה | פוסטרים סטטיים + כפתור ▶ לכל אריח |
| מרקיזים (הוקים, מנועים) | גלילה אינסופית | שורות סטטיות עם גלילה ידנית ו-`scroll-snap` |
| `HowItWorks` | הצמדה + החלפת מסכים | 3 כרטיסים מוערמים עם צילומי מסך |
| חשיפת לטרבוקס | 900ms | המצב הסופי מיד |
| הבהוב CTA, `BorderBeam`, spotlight | פעילים | כבויים; `BorderBeam` → קו זהב סטטי 1px |
| `Num animate` / ספירה | ספירה 600ms | הערך הסופי מיד |
| כניסות סקשנים (`BlurFade`, `WordReveal`) | slide/fade | opacity 150ms |
| Lenis | פעיל | כבוי (גלילה נייטיב) |
| Placeholder מתחלף ב-hero | מתחלף כל 3 שניות | placeholder קבוע |
| shimmer של "יוצרים…" | גל סגול נע | צבע סגול קבוע + הטקסט "יוצרים…" |
| כרטיסי סצנה (skeleton → תמונה → קליפ) | מעבר מטושטש | החלפה מיידית; קליפים לא מתנגנים לבד |
| `LivePreviewPhone` (Remotion Player) | ניגון אוטומטי מושתק בכניסה לשלב התצוגה המקדימה | פריים ראשון + כפתור ▶ |
| קונפטי בסיום יצירה | Lottie קצר | כבוי |
| Toasts | slide + fade | fade |
| גרעין פילם | 5% | כבוי |

### 12.6 בקרת השהיה לתנועה אוטומטית (WCAG 2.2.2)

- כל תנועה שנמשכת יותר מ-5 שניות (קיר וידאו, מרקיזים, דמו בלולאה באריחי bento, התצוגה המקדימה באשף) מקבלת כפתור עצירה **גלוי** ליד התנועה עצמה, או נעצרת לבד אחרי 5 שניות.
- `VideoWall` ו-`HooksTeaser`: כפתור ⏸/▶ (40px, `glass`) בפינה התחתונה-סופית של הסקשן, עם `aria-pressed` ותווית שמתחלפת: "עצירת הווידאו" ↔ "הפעלת הווידאו", "עצירת התנועה" ↔ "הפעלת התנועה".
- המתג הגלובלי "עצירת אנימציות" ב-`UtilityMenu` עוצר הכול בבת אחת ונשמר בעוגייה (ובפרופיל למשתמש מחובר).
- hover ו-focus-within עוצרים מרקיז; יציאה מהטאב (`visibilitychange`) עוצרת כל וידאו.

### קריטריוני קבלה
- [ ] עם `prefers-reduced-motion: reduce` (Playwright `reducedMotion: "reduce"`) ובלעדיו + `motion=reduce`: אין אף `video` מתנגן, אין `animation-play-state: running` על מרקיז, ו-Lenis לא מאותחל.
- [ ] אין ב-codebase פיצול טקסט לאותיות (grep על `split("")`, `type: "chars"`, `Array.from(text)` ברכיבי UI).
- [ ] ה-H1 בדף הבית גלוי בפריים הראשון (LCP < 2.5 שנ׳ במובייל 4G, Lighthouse).
- [ ] לכל תנועה מעל 5 שניות יש כפתור עצירה גלוי שעובד במקלדת.
- [ ] האירוע `motion_toggled { on }` נשלח בכל שינוי של המתג.

---

## §13. נגישות: WCAG 2.2 AA (הבסיס החוקי: ת״י 5568 = WCAG 2.0 AA)

### 13.1 עקרונות

- **הבסיס החוקי** בישראל הוא תקנה 35 ות״י 5568 (WCAG 2.0 ברמה AA). **בונים ובודקים לפי WCAG 2.2 AA**, שמכסה את 2.0 ומוסיף את מה שבודקים מקצועיים מחפשים היום.
- **אין ווידג׳ט נגישות צף ואין "תוסף נגישות".** הנגישות מובנית בקוד. מה שמשתמשים מחפשים בווידג׳טים כאלה זמין אצלנו כהגדרות אמיתיות: ערכת צבעים (כהה/בהירה), "עצירת אנימציות", כתוביות גדולות יותר בנגן (`/app/settings/accessibility`), וזום של הדפדפן שעובד עד 200% בלי שבירה.
- **הצהרת נגישות** ב-`/legal/accessibility` (התוכן — חלק 02 §10.6): יעד WCAG 2.2 AA ועמידה בת״י 5568, פערים ידועים, תאריך הבדיקה האחרונה, ופרטי הקשר לפניות בנושא נגישות (`{{A11Y_COORDINATOR_TITLE}}`, `{{A11Y_COORDINATOR_NAME}}`, `{{A11Y_COORDINATOR_PHONE}}`, `{{A11Y_COORDINATOR_EMAIL}}`). קישור אליה ב-footer, ב-`UtilityMenu` ובתפריט האווטאר.
- **מסמכים להורדה:** PDF שאנחנו מפיקים בעצמנו (טופס ההסכמה לשימוש בדמות, חלק 02 §10.8) הוא PDF מתויג — שפת מסמך `he`, כותרות מסומנות, סדר קריאה נכון וטקסט אמיתי (לא תמונה) — לפי ת״י 5568 חלק 2 (נגישות מסמכים דיגיטליים, 2023). חשבוניות מ-Morning הן מסמכי צד שלישי.
- **ערך למשתמשים שלנו:** כל ייצוא כולל SRT ו-VTT, כדי שהעסקים יעמדו בת״י 5568 באתרים שלהם.

### 13.2 רשימת בדיקה לפי קריטריון הצלחה

| SC | דרישה | איך זה ממומש אצלנו | איך בודקים |
|---|---|---|---|
| 1.1.1 | חלופת טקסט | `alt` עברי לכל תמונה תוכנית (§15.4); דקורטיבי `alt=""`; אייקונים `aria-hidden`; כפתורי אייקון עם `aria-label` | axe + סקירה |
| 1.2.1–1.2.2 | כתוביות לווידאו מוקלט | כל וידאו שיווקי עם דיבור: כתוביות צרובות **וגם** `<track srclang="he">`; סרטוני המוצר — צרובות + קובצי SRT/VTT | בדיקת `track` בכל `VideoPlayer` שיווקי |
| 1.2.3 | חלופה לווידאו מוקלט | דוגמאות ב-`/examples` ובדפי נישה: "תמליל ותיאור הסרטון" (`transcript`) | ידני |
| 1.2.5 | תיאור קולי (AA) | סרטון שיווקי עם דיבור נבנה כך שהקריינות אומרת את כל המידע החיוני (ההוק, ההצעה, ההנעה לפעולה); מידע חיוני שמופיע רק על המסך מתווסף לקריינות לפני פרסום. אנימטיקים בלי קול בקיר הווידאו הם קישוט (`aria-hidden`, נעצרים לפי 2.2.2) | ידני, ב-M7 |
| 1.4.2 | שליטה בשמע | אין ניגון אוטומטי עם קול באף מקום; וידאו אוטומטי תמיד `muted` | Playwright |
| 1.3.1 | מבנה ויחסים | landmarks (`header`, `nav`, `main`, `footer`, `aside`); כותרות ברצף; טבלאות עם `th`/`caption`; טפסים עם `label` | axe |
| 1.3.2 | רצף משמעותי | סדר DOM = סדר הקריאה ב-RTL; אין `order`/`flex-row-reverse` שמשנה סדר קריאה | ידני + Tab |
| 1.3.4 | כיוון מסך | עובד ב-portrait וב-landscape | Playwright |
| 1.3.5 | מטרת קלט | `autoComplete` נכון (`email`, `tel`, `name`, `organization`, `url`, `one-time-code`) | סקירה |
| 1.4.1 | לא רק צבע | סטטוסים עם אייקון + טקסט; שינויי יתרה עם סימן +/−; שגיאות עם אייקון | סקירה |
| 1.4.3 / 1.4.11 | ניגודיות 4.5:1 / 3:1 | טבלת §4.3 + `contrast.test.ts`; גבולות שדות `border-strong` | טסט יחידה + axe |
| 1.4.4 / 1.4.10 | הגדלה ו-reflow | 200% זום בלי אובדן תוכן; 320px בלי גלילה אופקית (חוץ מציר הזמן ומרקיזים) | Playwright ב-320px |
| 1.4.12 | ריווח טקסט | שום רכיב לא נחתך כשמגדילים line-height/word-spacing (בלי גבהים קבועים לטקסט) | bookmarklet ידני |
| 1.4.13 | תוכן ב-hover/focus | Tooltip נסגר ב-Esc, נשאר כשהסמן עליו, לא מכיל מידע בלעדי | ידני |
| 2.1.1 / 2.1.2 | מקלדת, בלי מלכודות | כל הזרימות כולל אשף, גרירת סצנות, נגן וציר זמן; Esc יוצא מכל שכבה | e2e מקלדת-בלבד |
| 2.1.4 | קיצורי מקש בודד | קיצורי הנגן פעילים רק כשהפוקוס בתוך הנגן | סקירה |
| 2.2.1 | זמן מוגבל | אין timeouts שמוחקים עבודה; האשף שומר אוטומטית | — |
| 2.2.2 | השהיה, עצירה | §12.6 | Playwright |
| 2.3.1 | הבהובים | אין הבהוב מעל 3 פעמים בשנייה (גם המעבר `flash` בסרטון מוגבל לפריים אחד) | סקירה |
| 2.4.1 | דילוג על בלוקים | `SkipLink` "דילוג לתוכן הראשי" — הרכיב הפוקוסבילי הראשון | Playwright: Tab ראשון |
| 2.4.2 | כותרת דף | `<title>` עברי ייחודי לכל דף ולכל שלב באשף ("הוק · סרטון חדש · {{BRAND_NAME}}") | טסט |
| 2.4.3 | סדר פוקוס | פוקוס עובר לכותרת השלב באשף (`tabIndex={-1}`); מודאלים מחזירים פוקוס לטריגר | e2e |
| 2.4.4 | מטרת קישור | אין "לחצו כאן"; קישורי "עוד" עם `aria-label` מלא | axe + סקירה |
| 2.4.5 | כמה דרכים | ניווט ראשי, חיפוש (`CommandMenu` באפליקציה, חיפוש ההוקים באתר), פירורי לחם ומפת אתר | סקירה |
| 2.4.6 | כותרות ותוויות | כותרות מתארות; תוויות מעל שדות | סקירה |
| 2.4.7 | פוקוס גלוי | `outline` 2px + offset 2px (`--color-focus`): זהב בכהה, אולטרמרין בבהירה | צילום |
| 2.4.11 | פוקוס לא מוסתר | `scroll-padding` לפי `--header-h` ו-`--bottom-bar-h` (§4.2) | Playwright |
| 2.5.3 | תווית בשם | השם הנגיש מתחיל בטקסט הגלוי ("צרו את הסרטון · 107 קרדיטים" → `aria-label` לא משנה סדר) | סקירה |
| 2.5.7 | תנועות גרירה | חלופה בלי גרירה לכל גרירה (§11.3) | e2e |
| 2.5.8 | גודל מטרה | מינימום 32×32 (§7.1) | Playwright |
| 3.1.1 / 3.1.2 | שפה | `lang="he"`; ביטויים לועזיים ארוכים `lang="en"` | axe |
| 3.2.1 / 3.2.2 | אין שינוי הקשר מפתיע | בחירה ב-Select לא מנווטת; "המשך" מפורש | סקירה |
| 3.2.3 / 3.2.4 | ניווט וזיהוי עקביים | אותו `MarketingHeader`/`AppShell` בכל דף; אותו אייקון ואותה תווית לאותה פעולה (§14.2, `common.actions.*`) | סקירה |
| 3.2.6 | עזרה עקבית | "צריכים עזרה?" (וואטסאפ + `/contact`) באותו מקום: footer באתר, תפריט אווטאר באפליקציה | סקירה |
| 3.3.1 / 3.3.3 | זיהוי שגיאות והצעות | הודעה בעברית מתחת לשדה, `aria-invalid`, `aria-describedby`, הצעת תיקון | e2e |
| 3.3.2 | תוויות והוראות | פורמט נדרש מוצג מראש (טלפון: "050-123-4567") | סקירה |
| 3.3.4 | מניעת שגיאות (כספי) | `ConfirmGenerateDialog`, אישור רכישה, ביטול מנוי עם מסך סיכום | e2e |
| 3.3.7 | הזנה חוזרת | פרטי העסק מתמלאים מהפרופיל בכל אשף | e2e |
| 3.3.8 | אימות נגיש | קישור קסם ו-Google; שדות OTP מאפשרים הדבקה; אין CAPTCHA (honeypot) | e2e |
| 4.1.2 | שם, תפקיד, ערך | Radix/shadcn; רכיבים מותאמים עם ARIA מלא (`role="slider"`, `aria-pressed`, `aria-checked`) | axe |
| 4.1.3 | הודעות סטטוס | toasts (Sonner) ו-`LiveAnnouncer` להתקדמות יצירה, העתקה ושמירה | NVDA ידני |

### 13.3 הכרזות חיות בזמן יצירה (`RenderProgress`, `ScriptEditor`, `BrandCard`)

הכרזות רק ב**אבני דרך**, לא על כל אחוז ולא על כל טוקן:

| אירוע | הכרזה | רמה |
|---|---|---|
| התחלת יצירה | "היצירה התחילה. זה לוקח בדרך כלל 4–6 דקות." | polite |
| שלב הסתיים | "הקריינות מוכנה" · "הכתוביות מוכנות" · "כל הסצנות מוכנות" · "המוזיקה מוכנה" · "ההרכבה התחילה" | polite |
| סצנה ירדה לתמונה בתנועה | "סצנה 4 נבנתה מתמונה בתנועה. הקרדיטים על הקליפ חזרו ליתרה." | polite |
| הצלחה | "הסרטון מוכן. אפשר לצפות ולהוריד." | polite |
| כישלון | "היצירה נכשלה. כל הקרדיטים חזרו ליתרה." | assertive (`role="alert"`) |
| סיום סטרימינג של תסריט | "התסריט מוכן לעריכה" | polite |
| ניתוח אתר הסתיים | "סיימנו לנתח את האתר. אפשר לבדוק ולתקן את הפרטים." | polite |
| העתקת הוק / קישור | "ההוק הועתק" / "הקישור הועתק" | polite |

### 13.4 גרירת סצנות במקלדת (dnd-kit) — מחרוזות בעברית

```ts
// components/editor/scene-list.a11y.ts — passed to <DndContext accessibility={…}>
export const sceneDndA11y = (t: (k: string, v?: Record<string, unknown>) => string) => ({
  screenReaderInstructions: { draggable: t("common.dnd.instructions") },
  announcements: {
    onDragStart: ({ active }) => t("common.dnd.start", { n: label(active) }),
    onDragOver: ({ active, over }) => over ? t("common.dnd.over", { n: label(active), pos: pos(over), total: total() }) : t("common.dnd.outside", { n: label(active) }),
    onDragEnd: ({ active, over }) => over ? t("common.dnd.end", { n: label(active), pos: pos(over) }) : t("common.dnd.cancel", { n: label(active) }),
    onDragCancel: ({ active }) => t("common.dnd.cancel", { n: label(active) }),
  },
});
```

הטקסטים עצמם ב-§19 (`common.dnd.*`). `KeyboardSensor` עם `sortableKeyboardCoordinates`; ברשימה אנכית ↑/↓ מזיזים, ב-`SceneStrip` האופקי ← = מקום הבא (לכיוון הסוף ב-RTL).

### 13.5 מפת מקלדת

| הקשר | מקשים |
|---|---|
| גלובלי | Tab / Shift+Tab · Esc סוגר שכבה עליונה · Ctrl+K / ⌘K פותח `CommandMenu` |
| אשף | Enter בשדה אחרון = "המשך" (כשהשלב תקין, לא ב-textarea) · כותרת השלב מקבלת פוקוס בכל מעבר |
| `HookPicker` / כרטיסי Radio | חצים בין אפשרויות, רווח בוחר/מסמן |
| `SceneList` | רווח/Enter על הידית מרים · ↑/↓ מזיז · רווח משחרר · Esc מבטל |
| `VideoPlayer` | רווח/K · ←/→ 5 שנ׳ · J/L 10 שנ׳ · Home/End · M · C · F |
| `TimelineLite` | ←/→ סצנה קודמת/הבאה **בזמן** (הציר LTR) · ידית חיתוך: ←/→ 0.1 שנ׳, Shift+←/→ שנייה |
| `BeforeAfterSlider` | ← מגדיל את "אחרי" (ב-RTL), → מקטין · Home/End |
| קרוסלות | כפתורי הקודם/הבא · ←/→ כשהפוקוס בקרוסלה (← = הבא ב-RTL) |

### 13.6 טפסים

- תווית גלויה לכל שדה (placeholder לעולם לא מחליף תווית). שדות לא-חובה מסומנים "(רשות)".
- שגיאה: מתחת לשדה, אייקון `CircleAlert` + טקסט, `aria-invalid="true"`, `aria-describedby` שמצביע גם על טקסט העזר וגם על השגיאה.
- בשליחה כושלת של טופס ארוך (הגדרות, ערכת מותג, חיוב): סיכום שגיאות בראש הטופס (`role="alert"`) עם קישורים לשדות, והפוקוס עובר לסיכום. בטופס קצר — הפוקוס עובר לשדה השגוי הראשון.
- הודעות Zod מתורגמות לעברית מרכזית ב-`errors.validation.*` (המפה וה-`zod-he.ts` — חלק 04 §18.3).

### 13.7 בדיקות

- **אוטומטי:** `pnpm test:a11y` — `@axe-core/playwright` על כל תבניות הדפים הציבוריים (בית, `/niches`, `/niches/[niche]`, `/hooks`, `/hooks/[niche]`, `/hooks/types/[type]`, `/pricing`, `/examples`, `/blog/[slug]`, כל דפי `/legal/*`, `/v/[token]`, `/approve/[token]`) ועל מסכי מפתח באפליקציה (דשבורד, כל 9 שלבי האשף, `ConfirmGenerateDialog`, `RenderProgress`, עורך, חיוב, ביטול מנוי), **בשתי ערכות הנושא** וגם עם `reducedMotion`. אפס הפרות serious/critical.
- **ידני (בכל אבן דרך מ-M2, ומלא ב-M7):** NVDA + Chrome ו-VoiceOver + Safari ב-iOS על: הרשמה, אשף מלא, יצירה עד הורדה, רכישה, ביטול מנוי. מעבר מקלדת-בלבד. זום 200%. 320px. Windows High Contrast (`forced-colors`).
- **בדיקת עברית לקוראי מסך:** מחירים נקראים "119 שקלים לחודש", מספרים בתוך משפט לא מתהפכים, "POV:" לא קופץ לסוף המשפט.

### קריטריוני קבלה
- [ ] `pnpm test:a11y` ירוק בכל הדפים והמסכים ברשימה, בשתי הערכות.
- [ ] Tab ראשון בכל דף מגיע ל-"דילוג לתוכן הראשי", ו-Enter מעביר פוקוס ל-`#main`.
- [ ] אין בפרויקט סקריפט או רכיב של ווידג׳ט נגישות צד-שלישי (grep על שמות ספקים נפוצים ב-`package.json` וב-`<script src>`).
- [ ] הכרזות §13.3 נשמעות ב-NVDA בזמן יצירה אמיתית (מתועד בדוח ה-a11y של M5).
- [ ] סצנה ניתנת להזזה למקום אחר בעזרת מקלדת בלבד, עם הכרזות בעברית.

---

## §14. איקונוגרפיה

### 14.1 כללים

- **ספרייה אחת: `lucide-react`.** ייבוא בשם (`import { Mic } from "lucide-react"`), לעולם לא ייבוא דינמי של כל הספרייה. `strokeWidth={1.5}`, גדלים 16 (בתוך טקסט קטן), **20 (ברירת מחדל ב-UI)**, 24 (ניווט, אריחי פיצ׳רים). צבע `currentColor`.
- אייקון ליד טקסט — `aria-hidden`. כפתור אייקון בלבד — `aria-label` עברי + Tooltip עם אותו טקסט.
- אייקונים כיווניים רק דרך `DirIcon` (§10.4). אייקוני מדיה, וי, זכוכית מגדלת ושעון — לא מתהפכים.
- **בלי לוגואים של רשתות חברתיות בממשק** (גם לא אייקוני מותג מספריית אייקונים כלשהי): שימוש בלוגו כפוף להנחיות המותג של כל רשת. פלטפורמות מוצגות כ-chips טקסטואליים. החריג היחיד: וואטסאפ — `WhatsAppIcon` (`components/brand/whatsapp-icon.tsx`, הגליף הרשמי לפי הנחיות המותג של Meta, לא מתהפך): ירוק `#25D366` רק על משטח כהה (10.08:1 על `bg`), ובערכה הבהירה או על משטח בהיר — מונוכרום `currentColor` (הירוק על נייר הוא 1.86:1, §4.3 כלל 7).
- אייקוני נישה מגיעים מ-`niches.icon` דרך `NicheIcon` (מפה סטטית של 36 האייקונים ב-`seed/niches.json`; טסט מוודא שכל שם קיים ב-`lucide-react` המותקן; שם לא מוכר → `Store`).
- אין אייקונים של רובוט, מוח, מעגלים חשמליים או "ניצוצות" **כסמל ל-AI** (`Bot`, `Brain*`, `Cpu`, `Sparkles`, `WandSparkles` וכו׳). מצב AI מסומן בסגול ובטקסט ("יוצרים…"), לא באייקון קלישאתי. `Sparkles` מופיע רק כאייקון הנישה של מרפאות אסתטיקה (`aesthetic-clinics` ב-seed), כחפץ ולא כסמל ל-AI.

### 14.2 מפת אייקונים סמנטית (מחייבת)

| מושג | אייקון | | מושג | אייקון |
|---|---|---|---|---|
| בית | `House` | | קרדיטים | `Zap` |
| סרטון חדש / הוספה | `Plus` | | יצירה (פעולת AI) | `Wand` |
| פרויקטים | `FolderOpen` | | יצירה מחדש | `RefreshCw` |
| תבניות | `LayoutTemplate` | | קריינות / קול | `Mic` |
| ספריית הוקים / הוק | `Magnet` | | מוזיקה | `Music` |
| ערכת מותג | `Palette` | | כתוביות | `Captions` |
| ספריית מדיה | `Images` | | סרטון תדמית | `Clapperboard` |
| צוות | `Users` | | רילס / 9:16 | `Smartphone` |
| לקוחות (סוכנות) | `Briefcase` | | 1:1 | `Square` |
| חיוב וקרדיטים | `CreditCard` | | 16:9 | `RectangleHorizontal` |
| הגדרות | `Settings` | | העלאה | `Upload` |
| התראות | `Bell` | | הורדה | `Download` |
| חיפוש | `Search` | | שיתוף | `Share2` |
| תצוגה ונגישות | `SlidersHorizontal` | | העתקה / הועתק | `Copy` / `Check` |
| ערכה כהה / בהירה / מערכת | `Moon` / `Sun` / `Monitor` | | מועדף | `Star` |
| נגן / השהה | `Play` / `Pause` | | עריכה | `Pencil` |
| 5 שנ׳ אחורה / קדימה | `RotateCcw` / `RotateCw` | | מחיקה | `Trash2` |
| השתקה / קול | `VolumeX` / `Volume2` | | ידית גרירה | `GripVertical` |
| מסך מלא / יציאה | `Maximize` / `Minimize` | | תפריט פעולות | `Ellipsis` |
| מהירות | `Gauge` | | נעול לפי תוכנית | `Lock` |
| סצנה | `Film` | | אישור לקוח | `BadgeCheck` |
| טקסט על המסך | `Type` | | חשבונית | `Receipt` |
| חיתוך | `Scissors` | | פרטיות | `Shield` |
| אתר / טלפון / כתובת / QR | `Globe` / `Phone` / `MapPin` / `QrCode` | | שגיאה / אזהרה / מידע | `CircleAlert` / `TriangleAlert` / `Info` |
| זמן / תאריך | `Clock` / `Calendar` | | קישור | `Link` |

### קריטריוני קבלה
- [ ] אין ב-`package.json` ספריית אייקונים נוספת מלבד `lucide-react`.
- [ ] כל `button` שמכיל רק `svg` כולל `aria-label` (כלל ESLint מותאם או בדיקת axe).
- [ ] `NicheIcon` מכסה את כל 36 ערכי `icon` ב-`seed/niches.json` (טסט שקורא את הקובץ).
- [ ] אין ייבוא של `Bot`, `Brain*`, `Sparkles` או `WandSparkles` מחוץ ל-`components/niches/niche-icon.tsx` (grep).

---

## §15. צילום, ויז׳ואלים ותמונות ממוזערות

### 15.1 כיוון צילומי

| נושא | כן | לא |
|---|---|---|
| נושאים | עסקים ישראליים אמיתיים או ריאליסטיים: מספרה בפלורנטין, מרפאת שיניים, דוכן פלאפל, אתר שיפוצים, סטודיו פילאטיס, משרד עו״ד | "עובדים מחייכים מול לפטופ", לחיצות ידיים, גרפים עולים |
| אור | אור מעשי חם (3000–4000K), חלון, נורות במקום; עומק שדה רדוד | אור סטודיו שטוח, תאורה כחולה-קרה של "טכנולוגיה" |
| אנשים | מבוגרים בלבד; מגוון ישראלי אמיתי (חילונים, דתיים, ערבים, יוצאי אתיופיה, דוברי רוסית); ידיים בעבודה | ילדים; ידוענים; פנים שנוצרו ב-AI כ"לקוחות" |
| טקסט בתמונה | אין. שלטים מטושטשים או ריקים | עברית שנוצרה ע״י מודל תמונה (תמיד שבורה) |
| AI | אין רובוטים, מוחות, מעגלים זוהרים | קלישאות "בינה מלאכותית" |
| עיבוד | חם, ניגודיות בינונית, שחורים עשירים; גרעין עדין בכהה | פילטרים רוויים, HDR |
| הוכחה | **תמיד בתוך `PhoneFrame` 9:16 עם כתוביות עבריות צרובות** — זה ה-moat | תמונת סטוק בלי מוצר |

### 15.2 מה מותר להציג כ"תוצר"

- **רק תוצרים אמיתיים של המוצר** (`examples` עם `is_published`). אף פעם לא וידאו סטוק שמתחזה לתוצר.
- עד שיש תוצרים אמיתיים: **סרטוני אנימטיק** (קומפוזיציית `Animatic` של חלק 05 — גרפיקה בתנועה בצבעי מותג, כתוביות עבריות אמיתיות, מוזיקה מהספרייה) שמרונדרים ב-`scripts/render-demo-videos.ts` (`pnpm demo:render`, ועם `--upload` — העלאה ל-`public-media`):
  - **קיר הווידאו** (`VideoWall`): 18 האריחים של `content/demo-wall.json` (חלק 02 §3.3.6) — לולאות של 4–6 שנ׳ עם ההוק בלבד, 540×960, בלי סאונד.
  - **חמש הדוגמאות של נספח D**: באורך מלא ובפורמטים של נספח D §9, ל-`NicheShowcase`, ל-`ShowcaseGallery` ולבאנר העונתי של חנוכה — לא לקיר הווידאו.
  - כל אריח כזה מסומן בתווית **"הדגמה"** (`common.hookCard.demo`); בעמוד `/examples` — "הדגמה (אנימטיק)". דוגמה אמיתית שמתפרסמת (`examples`) מחליפה פריט הדגמה באותו מקום.
- אין מונים, המלצות או לוגואים של לקוחות שלא קיימים (חלק 00 §3, עיקרון 9).

### 15.3 תמונות ממוזערות ופוסטרים

| נכס | מפרט | מקור |
|---|---|---|
| פוסטר רינדור | JPEG, יחס הפורמט, פריים ב-1.2 שנ׳ (ההוק כבר על המסך, לא פריים שחור) | `PosterStill` / `renderStill` (חלק 05) |
| פוסטר לקיר הווידאו | AVIF ≤ 40KB, 540×960 | `public-media/demo/wall/{n}-{hook_id}.avif` (אנימטיק) או פוסטר של `examples` אמיתי |
| קליפ לקיר | MP4 H.264 540×960, 4–6 שנ׳, ≤ 1.2MB, בלי סאונד, לופ חלק (+ `.vtt` תיאורי) | `public-media/demo/wall/{n}-{hook_id}.mp4` (אנימטיק) או `public-media/examples/` |
| דוגמאות נספח D | MP4 לכל פורמט + `-poster.jpg` + `.vtt` + `-loop.mp4` | `public-media/demo/examples/{id}-{9x16\|1x1\|16x9}.mp4` ושאר הקבצים באותה תיקייה |
| לוגו הדמו | SVG ניטרלי | `public/media/demo/logo-demo.svg` (הקובץ היחיד בריפו) |
| עטיפת נישה | AVIF 1200×1500 (4:5) + חיתוך 9:16; `niches/{slug}/cover.avif` | צילום / תמונת AI בלי טקסט לפי §15.1, מאושרת ע״י אדמין |
| אריח פרויקט באפליקציה | פוסטר הרינדור; chips: נישה (למעלה-התחלה), סטטוס (למעלה-סוף), משך (למטה-סוף, LTR) | — |
| מצב בתהליך | keyframe מטושטש (`blur-md`) עם `shimmer-ai` עד שהקליפ מוכן | — |

כל אריח: `frame-tile`, `object-cover`, scrim תחתון רק כשיש chips. גרידים מעורבים (9:16 לצד 16:9) — Masonry לפי יחס אמיתי, לעולם לא חיתוך של 16:9 ל-9:16 בתצוגה.

### 15.4 טקסט חלופי

תבנית: **[סוג סרטון] לדוגמה ל[נישה]: [מה רואים], [פרט מבדל].** למשל: "רילס לדוגמה למספרה: תספורת גברים לפני ואחרי, עם כתוביות בעברית." עטיפת נישה: "מרפאת שיניים מוארת באור חם, כיסא טיפולים ומסך". תמונה דקורטיבית (רקעים, גרדיאנטים) — `alt=""`.

### קריטריוני קבלה
- [ ] אין בפרויקט נכסי וידאו בתיקיות שיווק שאינם `examples` מפורסמים או אנימטיק מ-`pnpm demo:render` (בדיקת מקור ב-`scripts/check-media.ts` או סקירה ב-M7).
- [ ] כל פוסטר של קיר הווידאו (`public-media/demo/wall/`, ופוסטרי הקיר של `examples`) ≤ 40KB וכל קליפ קיר ≤ 1.2MB (`scripts/check-media.ts` על המניפסט שנוצר ב-`pnpm demo:render --upload`).
- [ ] כל אריח שמציג אנימטיק נושא את התווית "הדגמה" (Playwright על דף הבית ו-`/examples`).
- [ ] כל `VideoTile` ו-`img` תוכני עם `alt` לפי התבנית (סקירה + axe).

---

## §16. מראה הכתוביות בסרטון (6 סגנונות)

החלק הזה מגדיר **איך הכתוביות נראות**. חלק 05 מגדיר את העימוד (`CaptionTrackV1`), התזמון והרינדור ב-Remotion, וקורא את נתוני הסגנון מאותו קובץ: `remotion/captions/presets.ts`. אותם נתונים משמשים את `CaptionPreview` באפליקציה (§10.12).

### 16.1 טבלת הסגנונות

ערכי הגודל לקנבס של 1080px רוחב (16:9: לגובה 1080). הגדלים בטווח של נספח F §8.4 (64–84 / 56–72 / 48–60); `poster` הוא החריג המוצהר ("ענק", 132/112/88), והערכים כאן גוברים על הנספח.

| ID | שם | גופן | גודל 9:16 / 1:1 / 16:9 | גובה שורה | טקסט | ניגודיות | מילה פעילה | כניסה | מילים לעמוד | מתאים ל- |
|---|---|---|---|---|---|---|---|---|---|---|
| `bold-pop` | פופ (ברירת מחדל) | Heebo 900 | 84 / 72 / 60 | 1.15 | לבן | קו 6px `#08080C` (90%) + צל `0 4px 18px rgb(0 0 0 / .45)` | קופסה בצבע ההדגשה (ברירת מחדל זהב `#FFB547`), רדיוס 12, ריפוד `.04em .2em`, טקסט דיו, בלי קו | כל מילות העמוד: opacity 0→1 + scale .86→1, 100ms; הקופסה עוברת בין מילים ב-80ms fade | ≤ 3 | רוב הנישות, רילס |
| `clean-box` | קופסה נקייה | Heebo 700 | 64 / 56 / 48 | 1.25 | לבן או דיו — אוטומטית לפי הניגודיות מול הקופסה | קופסה מעוגלת בצבע `secondary` של המותג ב-88% (ברירת מחדל `#08080C`), רדיוס 14, ריפוד `.12em .45em`, `box-decoration-break: clone` | פס סימון 0.12em מתחת למילה, בצבע ההדגשה (ברירת מחדל `primary`) | העמוד: opacity 120ms | 2 שורות × 22 תווים | מרפאות, נדל״ן, B2B |
| `karaoke` | קריוקי | Rubik 800 | 72 / 64 / 52 | 1.2 | לבן | קו 5px `#08080C` (85%) | מילים שנאמרו מתמלאות בצבע `accent` של המותג (ברירת מחדל `#FF4F7B`) ונשארות מלאות עד סוף העמוד — ברמת מילה, לפי סדר הדיבור (מימין לשמאל) | מעבר צבע 80ms | 2 × 22 | אוכל, אירועים, כושר |
| `poster` | פוסטר | Karantina 700 | 132 / 112 / 88 | 0.98 | לבן | צל `0 6px 24px rgb(0 0 0 / .55)` + קו 3px `#08080C` (70%) | המילה הפעילה בצבע ההדגשה | כל מילה: scale .7→1 + opacity, 120ms | 1–2 | הוקים, נישות אנרגטיות, מבצעים |
| `news` | חדשות | Suez One 400 | 64 / 56 / 48 | 1.25 | לבן | פס תחתון `rgb(8 8 12 / .82)` (או `secondary` של המותג ב-90%), רדיוס 10, ברוחב אזור הכתוביות, עם פס צבע `primary` של 10px **בצד ההתחלה (ימין)** | המילה הפעילה בצבע `primary` של המותג (אם הניגודיות מול הפס < 4.5 — קו תחתון לבן במקום) | העמוד: opacity 120ms; הפס עצמו נכנס פעם אחת ב-200ms | 2 × 22 (משפטים רגועים) | עו״ד, רו״ח, יועצים, מרפאות |
| `soft` | רך | Fredoka 600 | 68 / 60 / 50 | 1.2 | דיו `#16140F` | בועה פסטלית: `color-mix(in oklab, accent 20%, white)`, רדיוס 32, ריפוד `.14em .5em` | המילה הפעילה: scale 1.06 ורקע פסטל עמוק יותר (`accent` 34%) — בלי קפיצה | העמוד: opacity + scale .92→1, 120ms, `ease-out` (בלי overshoot) | 2 × 22 | משפחה, גני ילדים, מאפיות, יופי |

**כללים משותפים לכל הסגנונות:** `direction: rtl`, `unicode-bidi: plaintext` לכל שורה, טוקנים לועזיים/מספריים בתוך `<bdi>`, `letter-spacing: 0`, בלי `uppercase` ובלי הטיה, שבירת שורה רק בין מילים, יישור למרכז, תנועה **לפי מילה בלבד** (opacity/scale), אף פעם לא לפי אות. תחילית + מספר ("ב-2026"), "₪99" ו-"50%" לא נשברים.

### 16.2 נתוני הסגנון (קוד — מקור אמת אחד)

```ts
// remotion/captions/presets.ts — style DATA (rendering lives in remotion/layers/CaptionsLayer.tsx, Part 05)
export type CaptionPresetId = "bold-pop" | "clean-box" | "karaoke" | "poster" | "news" | "soft";
export type CaptionFormat = "9:16" | "1:1" | "16:9";
export interface CaptionBrandColors { primary: string; secondary: string; accent: string; text: string; highlight: string | null }
type C = (b: CaptionBrandColors) => string;

export interface CaptionPresetStyle {
  id: CaptionPresetId;
  nameHe: string;
  font: { family: "Heebo" | "Rubik" | "Karantina" | "Suez One" | "Fredoka"; weight: 400 | 600 | 700 | 800 | 900 };
  sizePx: Record<CaptionFormat, number>;
  lineHeight: number;
  paging: { maxWords: number | null; maxLines: 1 | 2; maxCharsPerLine: number };
  text: C;                                        // resolved with ensureContrast() against the box/bar when present
  stroke: { px: number; color: string } | null;
  shadow: string | null;
  box: { bg: C; radiusPx: number; padEm: [number, number] } | null;   // per line, box-decoration-break: clone
  bar: { bg: C; radiusPx: number; stripPx: number; strip: C } | null; // news only; strip on inline-start
  active:
    | { kind: "box"; bg: C; text: C; radiusPx: number }
    | { kind: "underline"; color: C; thicknessEm: number }
    | { kind: "fill"; color: C }                   // karaoke: spoken words stay filled
    | { kind: "color"; color: (b: CaptionBrandColors) => string | null;   // null => use fallbackUnderline
        fallbackUnderline?: { color: string; thicknessEm: number } }
    | { kind: "scale"; to: number; bg: C };
  entrance: { unit: "page" | "word"; ms: number; fromScale: number | null };
  defaultPosition: "lower" | "middle";
}

const ink = "#0A0A0F";
export const CAPTION_PRESETS: Record<CaptionPresetId, CaptionPresetStyle> = {
  "bold-pop": {
    id: "bold-pop", nameHe: "פופ", font: { family: "Heebo", weight: 900 },
    sizePx: { "9:16": 84, "1:1": 72, "16:9": 60 }, lineHeight: 1.15,
    paging: { maxWords: 3, maxLines: 2, maxCharsPerLine: 22 },
    text: () => "#FFFFFF", stroke: { px: 6, color: "rgba(8,8,12,.9)" }, shadow: "0 4px 18px rgba(0,0,0,.45)",
    box: null, bar: null,
    active: { kind: "box", bg: (b) => b.highlight ?? "#FFB547", text: (b) => onColor(b.highlight ?? "#FFB547"), radiusPx: 12 },
    entrance: { unit: "page", ms: 100, fromScale: 0.86 }, defaultPosition: "lower",
  },
  "clean-box": {
    id: "clean-box", nameHe: "קופסה נקייה", font: { family: "Heebo", weight: 700 },
    sizePx: { "9:16": 64, "1:1": 56, "16:9": 48 }, lineHeight: 1.25,
    paging: { maxWords: null, maxLines: 2, maxCharsPerLine: 22 },
    text: (b) => onColor(b.secondary), stroke: null, shadow: null,
    box: { bg: (b) => withAlpha(b.secondary, 0.88), radiusPx: 14, padEm: [0.12, 0.45] }, bar: null,
    active: { kind: "underline", color: (b) => b.highlight ?? b.primary, thicknessEm: 0.12 },
    entrance: { unit: "page", ms: 120, fromScale: null }, defaultPosition: "lower",
  },
  karaoke: {
    id: "karaoke", nameHe: "קריוקי", font: { family: "Rubik", weight: 800 },
    sizePx: { "9:16": 72, "1:1": 64, "16:9": 52 }, lineHeight: 1.2,
    paging: { maxWords: null, maxLines: 2, maxCharsPerLine: 22 },
    text: () => "#FFFFFF", stroke: { px: 5, color: "rgba(8,8,12,.85)" }, shadow: null, box: null, bar: null,
    active: { kind: "fill", color: (b) => b.highlight ?? b.accent },
    entrance: { unit: "word", ms: 80, fromScale: null }, defaultPosition: "lower",
  },
  poster: {
    id: "poster", nameHe: "פוסטר", font: { family: "Karantina", weight: 700 },
    sizePx: { "9:16": 132, "1:1": 112, "16:9": 88 }, lineHeight: 0.98,
    paging: { maxWords: 2, maxLines: 2, maxCharsPerLine: 14 },
    text: () => "#FFFFFF", stroke: { px: 3, color: "rgba(8,8,12,.7)" }, shadow: "0 6px 24px rgba(0,0,0,.55)", box: null, bar: null,
    active: { kind: "color", color: (b) => b.highlight ?? "#FFB547" },
    entrance: { unit: "word", ms: 120, fromScale: 0.7 }, defaultPosition: "lower",
  },
  news: {
    id: "news", nameHe: "חדשות", font: { family: "Suez One", weight: 400 },
    sizePx: { "9:16": 64, "1:1": 56, "16:9": 48 }, lineHeight: 1.25,
    paging: { maxWords: null, maxLines: 2, maxCharsPerLine: 22 },
    text: () => "#FFFFFF", stroke: null, shadow: null, box: null,
    bar: { bg: (b) => (b.secondary ? withAlpha(b.secondary, 0.9) : "rgba(8,8,12,.82)"), radiusPx: 10, stripPx: 10, strip: (b) => b.primary },
    active: { kind: "color", color: (b) => ensureContrast(b.primary, b.secondary, 4.5),   // brand primary if >= 4.5:1 on the bar
              fallbackUnderline: { color: "#FFFFFF", thicknessEm: 0.1 } },                // else: white underline (text is already white)
    entrance: { unit: "page", ms: 120, fromScale: null }, defaultPosition: "lower",
  },
  soft: {
    id: "soft", nameHe: "רך", font: { family: "Fredoka", weight: 600 },
    sizePx: { "9:16": 68, "1:1": 60, "16:9": 50 }, lineHeight: 1.2,
    paging: { maxWords: null, maxLines: 2, maxCharsPerLine: 22 },
    text: () => "#16140F", stroke: null, shadow: "0 6px 18px rgba(0,0,0,.18)",
    box: { bg: (b) => mix(b.accent, "#FFFFFF", 0.2), radiusPx: 32, padEm: [0.14, 0.5] }, bar: null,
    active: { kind: "scale", to: 1.06, bg: (b) => mix(b.accent, "#FFFFFF", 0.34) },
    entrance: { unit: "page", ms: 120, fromScale: 0.92 }, defaultPosition: "lower",
  },
};
// helpers (lib/format/contrast.ts): onColor(bg) -> "#FFFFFF" | ink by contrast; ensureContrast(fg, bg, min) -> fg | null; withAlpha; mix
```

### 16.3 אזורים בטוחים ומיקום

| פורמט | אזור ההוק (`HookTitle`) | כתוביות "תחתון" | כתוביות "אמצע" | אסור |
|---|---|---|---|---|
| 9:16 (1080×1920) | 15%–55% גובה | 62%–78% גובה | 46%–58% גובה | 0–12% עליונים, 22% תחתונים, עמודה פיזית ימנית ברוחב 14% בין 40% ל-85% |
| 1:1 (1080×1080) | 12%–50% | 70%–88% | 44%–56% | 6% מכל קצה |
| 16:9 (1920×1080) | 10%–45% | 74%–90% | 44%–56% | 5% מכל קצה |

- **רוחב בלוק הכתוביות:** ב-9:16 — בין 6% מהקצה השמאלי ל-16% מהקצה הימני (רוחב 78%, ממורכז בתוך האזור) כדי לא לגעת בעמודת הכפתורים של הרשת; ב-1:1 וב-16:9 — 80% ממורכז. הטקסט ממורכז בתוך הבלוק.
- **סימן AI** ("נוצר באמצעות AI", אם הופעל) — chip קטן בפינה העליונה-ימנית (ב-9:16 ב-8% גובה, inset 5%), Heebo 600 בגודל 26px, לבן 90% על `rgb(8 8 12 / .62)`, רדיוס מלא. הניגודיות מחושבת למקרה הגרוע — פריים לבן לגמרי מתחת ל-chip: 5.03:1 (עם `.45` היא הייתה 2.90:1 בלבד).
- **סימן המים של התוכנית החינמית** ("נוצר ב-{{BRAND_NAME}}") — בפינה העליונה-שמאלית (8% גובה, inset 5%), `BrandLogo` סמל 28px + טקסט Heebo 600 26px, לבן 90% על `rgb(8 8 12 / .62)` (אותו חישוב). שני הסימנים לא נוגעים באזור ההוק ובאזור הכתוביות.

### 16.4 ניגודיות וצבעי מותג

- הניגודיות של טקסט הכתוביות מול הרקע מובטחת בקו מתאר (`bold-pop`, `karaoke`, `poster`), בקופסה (`clean-box`, `soft`) או בפס (`news`) — לא תלויה בווידאו.
- `onColor()` בוחר לבן או דיו לפי מה שנותן ניגודיות גבוהה יותר מול צבע הקופסה, ו-`ensureContrast()` מחליף צבע הדגשה שנופל מתחת ל-4.5:1 (מול הקופסה/הפס) בחלופה בטוחה.
- `BrandKitEditor` מציג את הכתוביות על 4 רקעים (תמונה, כהה, בהיר, "עמוס") ומזהיר כשצבעי המותג שוברים את הניגודיות (§10.12). האזהרה לא חוסמת שמירה; הרינדור תמיד מתקן.

### קריטריוני קבלה
- [ ] `CaptionStyleSample` של כל 6 הסגנונות × 3 פורמטים עם הפיקסצ׳רים של `bidi-strings.json` תואם לתמונות golden ב-CI (חלק 05 מריץ).
- [ ] `CaptionPreview` ו-Remotion משתמשים באותו `CAPTION_PRESETS` (אין שכפול ערכים; טסט שמשווה snapshot).
- [ ] ערכת מותג עם `secondary: "#FFFFFF"` ו-`highlight: "#FFE14D"` מפיקה כתוביות `clean-box` בדיו על קופסה לבנה ו-underline שעבר `ensureContrast`.
- [ ] אף כתובית ב-9:16 לא נכנסת ל-22% התחתונים או לעמודה הימנית (בדיקת bounding box על frames ברינדור הבדיקה).
- [ ] ערכת מותג עם `primary: "#FFE14D"` ו-`secondary: "#FFFFFF"` מפיקה ב-`news` מילה פעילה עם קו תחתון לבן (לא צבע), גם ב-`CaptionPreview` וגם ברינדור.
- [ ] ב-still של פריים לבן לגמרי, הטקסט של `AiLabel` ושל סימן המים עומד ב-4.5:1 מול ה-chip (בדיקת פיקסלים בטסט הרינדור של חלק 05).

---

## §17. איורי מצבים ריקים

### 17.1 סגנון

- **קו דק, לא דמויות:** איורי SVG בקו 1.5px (תואם ל-lucide), עם מוטיבים של קולנוע ווידאו — סליל פילם, קלאפר, מסגרת 9:16, כרטיס סצנה, אלומת מקרן, גל קול.
- **צבע:** קווים ב-`currentColor` (`text-2`); מילוי אחד בהדגשה — `primary` ב-12% שקיפות; נקודת אור אחת `violet` ב-20% בכהה (בבהירה — `lemon` ב-60%). מתחלף לבד עם ערכת הנושא דרך משתני CSS.
- **בלי פנים, בלי דמויות, בלי רובוטים, בלי טקסט בתוך האיור.**
- **טכני:** קומפוננטת React אחת לכל איור ב-`components/ui/illustrations/`, `viewBox="0 0 160 120"`, ≤ 3KB, `aria-hidden`, בלי אנימציה (מותר "נשימה" עדינה של נקודת האור רק בלי reduce).

### 17.2 מלאי

| מפתח | מוטיב | איפה |
|---|---|---|
| `projects` | שלוש מסגרות 9:16 ריקות בשורה, האמצעית עם ▶ | `/app/projects`, דשבורד |
| `library` | ערימת תמונות + חץ העלאה | `/app/library` |
| `brand` | פלטת צבעים + מסגרת לוגו מקווקוות | `/app/brand` |
| `hooks-favorites` | מגנט + כוכב | `/app/hooks` (מועדפים) |
| `search` | זכוכית מגדלת מעל סליל פילם | חיפוש ריק בכל מקום |
| `notifications` | פעמון שקט עם גל קטן | `NotificationBell` |
| `team` | שלושה כיסאות במאי | `/app/team` |
| `clients` | תיק + שלוש כרטיסיות | `/app/clients` |
| `invoices` | קבלה מגולגלת עם ₪ | `InvoiceList` |
| `ledger` | עמודת מטבעות + ברק | `LedgerTable` |
| `templates` | גריד 2×2 של מסגרות | `/app/templates` |
| `queue` | קלאפר סגור + שעון | תור היצירות הריק בדשבורד |
| `approval-done` | מסגרת 9:16 עם וי גדול | `/approve/[token]` אחרי החלטה |
| `error` | סליל פילם קרוע (קו שבור) | `error.tsx`, כשלים |
| `offline` | אנטנה עם קו חוצה | אין חיבור |
| `not-found` | מסגרת 9:16 ריקה עם "?" כצורה גרפית | `not-found.tsx` |

### קריטריוני קבלה
- [ ] 16 האיורים קיימים, כל אחד ≤ 3KB, ונראים נכון בשתי הערכות (צילום ב-`/admin/design`).
- [ ] אף איור לא מכיל `<text>` או פנים.

---

## §18. לוגו, favicon ותמונות OG

### 18.1 הלוגו הזמני (עד שיעוצב לוגו סופי)

- **סמל:** "אלומת מקרן" — עדשה עגולה בצד ימין ואלומה שמתרחבת שמאלה, כלומר **קדימה** בכיוון הקריאה העברי. הסמל קבוע ולא מתהפך בשום הקשר.
- **Wordmark:** `BRAND.nameHe` ב-Heebo 800 (טקסט חי, לא מצויר), גובה האותיות ≈ 62% מגובה הסמל, רווח 0.35× הסמל. גרסה לטינית: `BRAND.nameEn` ב-Heebo 800.
- **Lockups:** עברי — הסמל מימין, השם משמאלו. לטיני — הסמל משמאל, השם מימינו. אלה שני lockups מוגדרים; אף אחד מהם לא נוצר ע״י היפוך של השני.

```tsx
// components/brand/logo.tsx
export interface BrandLogoProps {
  variant?: "full" | "symbol" | "full-en";   // full = Hebrew lockup
  tone?: "brand" | "mono-light" | "mono-dark"; // brand: gold tile + ink beam; mono-light: white; mono-dark: ink
  size?: number;                              // symbol height in px (default 28)
  className?: string;
}
// Symbol SVG (32×32):
// <rect width="32" height="32" rx="8" fill="#FFB547"/>
// <path d="M19 13.6 L7 9 V23 L19 18.4 Z" fill="#0A0A0F"/>
// <circle cx="23.5" cy="16" r="3" fill="#0A0A0F"/>
```

| כלל | ערך |
|---|---|
| מרווח נקי | חצי מגובה הסמל מכל צד |
| גודל מינימלי | סמל 16px (favicon); lockup מלא — רוחב 96px |
| רקעים מותרים | `bg` כהה (סמל זהב + שם `text`), נייר בהיר (סמל זהב + שם דיו), על וידאו/תמונה — רק `mono-light` עם scrim |
| אסור | היפוך, סיבוב, מתיחה, צל, גרדיאנט על השם, צבעים מחוץ לטבלה, הצבה על וידאו בלי scrim, שינוי היחס בין הסמל לשם |
| בסרטוני לקוחות | הלוגו **שלנו** מופיע רק בסימן המים של התוכנית החינמית (§16.3). הלוגו של הלקוח מופיע ב-`EndCard` וב-`LogoBug` (חלק 05) |

### 18.2 Favicon ואייקוני אפליקציה

| קובץ | מפרט |
|---|---|
| `app/icon.svg` | הסמל (אריח זהב + אלומה בדיו) |
| `app/favicon.ico` | 16/32/48 מאותו סמל |
| `app/apple-icon.png` | 180×180, אריח זהב מלא עד הקצוות (בלי שקיפות) |
| `app/manifest.ts` | `name: BRAND.nameHe`, `short_name`, `lang: "he"`, `dir: "rtl"`, `start_url: "/app"`, `display: "standalone"`, `background_color` ו-`theme_color` `#08080C`; אייקונים 192 ו-512, ועוד 512 `maskable` עם 20% ריווח בטוח |

### 18.3 תמונות OG (1200×630)

תמיד בערכה הכהה, בכל סוג דף. התוכן לכל נתיב (כותרת, eyebrow) — חלק 02; התבנית החזותית אחידה: `components/seo/og-template.tsx` (פונקציה שמחזירה JSX ל-`ImageResponse`) ו-`lib/seo/og.ts` (חלוקת שורות + סידור חזותי עם `bidi-js`).

| אלמנט | מפרט |
|---|---|
| רקע | `#08080C` + אלומת זהב בפינה העליונה-שמאלית (צד הסוף) ב-22% + הילה ורודה עדינה בפינה התחתונה-ימנית |
| מסגרת | קו 1px `rgb(255 255 255 / .06)` ב-inset 24px, רדיוס 28 |
| eyebrow | למעלה-ימין: chip ב-`#1A1A24`, רדיוס מלא, Heebo 600 26px בזהב (למשל שם הנישה או "ספריית ההוקים") |
| כותרת | Heebo 800, 68px (56px מעל 24 תווים בשורה), גובה שורה 1.12, `#F5F4F0`, עד 3 שורות, מיושרת לימין, רוחב 640px בצד ימין; מילה אחת בזהב מותרת |
| שורת משנה | Heebo 500 30px, `#A3A3B5`, שורה אחת |
| ויז׳ואל | בצד שמאל: כרטיס 9:16 (260×462, רדיוס 22) עם עטיפת הנישה או תמונת הוק + כתובית לדוגמה צרובה; בלי הטיה |
| מיתוג | למטה-ימין: `BrandLogo full` (סמל 56px); למטה-שמאל: `{{DOMAIN}}` ב-Heebo 600 26px `#8A8AA0` |
| bidi | שבירת שורות לוגית לפי מילים (מדידה משוערת לפי תווים), ואז `toVisualOrder()` לכל שורה ורינדור ב-`direction: ltr` + `text-align: right` (Satori לא מיישם bidi בעצמו) [M0-verify] |
| גיבוי | PNG סטטי מ-`PosterStill` ב-`public-media/og/{type}/{slug}.png` |

### קריטריוני קבלה
- [ ] הסמל לא מתהפך באף מקום (grep על `scale-x` ו-`rotate` סביב `BrandLogo`; צילום RTL/LTR).
- [ ] Lighthouse PWA/manifest ללא שגיאות; ה-favicon מוצג בכרום, ספארי ופיירפוקס.
- [ ] צילום Playwright של OG לנישה, לסוג הוק ולפוסט בלוג תואם golden, והעברית בו בסדר הנכון (כולל "₪199" ו-"Black Friday").

---

## §19. מחרוזות הבסיס: `messages/he.json` → `common`

ה-namespace `common` שייך לחלק הזה ומשמש את כל הרכיבים המשותפים. חלקים 02–06 מוסיפים namespaces משלהם — הרשימה המלאה: `common`, `marketing`, `hooks`, `wizard`, `editor`, `billing`, `errors`, `emails`, `legal`, `auth`, `app`, `admin`, `ops` (`ops.banners`, `ops.whatsapp`) — ומשתמשים במפתחות כאן במקום לשכפל אותם. שני תתי-מפתחות של `common` מוגדרים בחלקים אחרים: `common.labels.*` (תוויות ה-enum, `lib/labels.ts`, חלק 02 §1.2) ו-`common.deletedUser` (חלק 03; הערך מופיע כאן). מספרים מוצגים דרך התגית `<num>` (§9.4), וסכומים בשקלים — רק כמשתנה שעוצב ב-`formatIls` (§2.1 סעיף 20).

```json
{
  "common": {
    "a11y": {
      "skipToContent": "דילוג לתוכן הראשי",
      "mainNav": "ראשי",
      "appNav": "ניווט באפליקציה",
      "footerNav": "קישורים בתחתית",
      "breadcrumbs": "פירורי לחם",
      "openMenu": "פתיחת התפריט",
      "closeMenu": "סגירת התפריט",
      "close": "סגירה",
      "dismiss": "סגירת ההודעה",
      "displaySettings": "תצוגה ונגישות",
      "accessibilityStatement": "הצהרת נגישות",
      "newTab": "(נפתח בלשונית חדשה)",
      "optional": "(רשות)",
      "loading": "בטעינה",
      "carousel": "קרוסלה",
      "slide": "שקופית",
      "slideOf": "{current} מתוך {total}",
      "help": "צריכים עזרה?",
      "whatsapp": "דברו איתנו בוואטסאפ"
    },
    "motion": {
      "toggle": "עצירת אנימציות",
      "toggleHint": "עוצר תנועה, וידאו שמתנגן לבד ואפקטים. ההגדרה נשמרת במכשיר הזה, ואם התחברתם — גם בחשבון.",
      "osReduced": "מערכת ההפעלה שלכם מבקשת להפחית תנועה, ולכן האנימציות כבר כבויות.",
      "pauseVideos": "עצירת הווידאו",
      "playVideos": "הפעלת הווידאו",
      "pauseMotion": "עצירת התנועה",
      "playMotion": "הפעלת התנועה",
      "playThis": "ניגון הסרטון"
    },
    "theme": {
      "label": "ערכת צבעים",
      "dark": "כהה",
      "light": "בהירה",
      "system": "לפי המכשיר"
    },
    "player": {
      "region": "נגן וידאו: {title}",
      "watch": "צפייה בסרטון: {title}",
      "play": "ניגון",
      "pause": "השהיה",
      "replay": "ניגון מההתחלה",
      "back5": "5 שניות אחורה",
      "forward5": "5 שניות קדימה",
      "seek": "מיקום בסרטון",
      "timeOf": "{current} מתוך {total}",
      "mute": "השתקה",
      "unmute": "ביטול השתקה",
      "volume": "עוצמת שמע",
      "captionsOn": "הצגת כתוביות",
      "captionsOff": "הסתרת כתוביות",
      "captionsTrack": "עברית",
      "speed": "מהירות ניגון",
      "speedNormal": "רגילה",
      "fullscreen": "מסך מלא",
      "exitFullscreen": "יציאה ממסך מלא",
      "download": "הורדה",
      "transcript": "תמליל ותיאור הסרטון",
      "error": "לא הצלחנו לטעון את הסרטון. אפשר לרענן את הדף ולנסות שוב.",
      "preview": "תצוגה מקדימה של הסרטון",
      "previewEmpty": "התצוגה המקדימה תופיע כאן"
    },
    "credits": {
      "count": "{count, plural, one {קרדיט אחד} other {<num>#</num> קרדיטים}}",
      "cost": "עלות: {count, plural, one {קרדיט אחד} other {<num>#</num> קרדיטים}}",
      "free": "חינם",
      "freeSr": "חינם, בלי קרדיטים",
      "estimating": "מחשבים עלות…",
      "missing": "{missing, plural, one {חסר קרדיט אחד} other {חסרים <num>#</num>}}",
      "insufficientSr": "עלות: {count, plural, one {קרדיט אחד} other {# קרדיטים}}. {missing, plural, one {חסר קרדיט אחד} other {חסרים # קרדיטים}} ביתרה.",
      "breakdown": "פירוט העלות",
      "total": "סך הכול",
      "meterLabel": "יתרת קרדיטים: {balance}. לפירוט",
      "balance": "יתרה",
      "reserved": "שמורים ליצירות שרצות עכשיו",
      "expiring": "יפוגו ב-30 הימים הקרובים",
      "resetsOn": "המכסה החודשית מתחדשת ב-{date}",
      "afterGeneration": "{balance, plural, one {אחרי היצירה יישאר קרדיט אחד} other {אחרי היצירה יישארו <num>#</num> קרדיטים}}",
      "low": "הקרדיטים עומדים להיגמר",
      "topUp": "רכישת קרדיטים",
      "costTable": "כמה עולה כל סרטון?",
      "refundPromise": "יצירה שנכשלת מחזירה את הקרדיטים אוטומטית."
    },
    "price": {
      "perMonth": "לחודש",
      "perYear": "לשנה",
      "billedAnnually": "<num>{amount}</num> בחיוב שנתי",
      "oneTime": "תשלום חד-פעמי",
      "vatIncluded": "כולל מע״מ",
      "vatExcluded": "לפני מע״מ",
      "srAmount": "{amount} שקלים",
      "srInstead": "במקום {amount} שקלים"
    },
    "actions": {
      "save": "שמירה",
      "saving": "שומרים…",
      "saved": "נשמר",
      "notSaved": "לא נשמר. ננסה שוב בעוד רגע",
      "cancel": "ביטול",
      "delete": "מחיקה",
      "edit": "עריכה",
      "copy": "העתקה",
      "copied": "הועתק",
      "download": "הורדה",
      "upload": "העלאה",
      "share": "שיתוף",
      "next": "המשך",
      "back": "הקודם",
      "close": "סגירה",
      "confirm": "אישור",
      "retry": "נסו שוב",
      "learnMore": "לפרטים",
      "showMore": "הצגת עוד",
      "showLess": "הצגת פחות",
      "clearFilters": "ניקוי הסינון",
      "generate": "צרו את הסרטון",
      "regenerate": "יצירה מחדש",
      "moveUp": "הזזה למעלה",
      "moveDown": "הזזה למטה",
      "backToEdit": "חזרה לעריכה"
    },
    "status": {
      "project": { "draft": "טיוטה", "brief": "בהכנה", "script": "תסריט מוכן", "storyboard": "סטוריבורד מוכן", "inProgress": "בתהליך יצירה", "done": "מוכן", "failed": "נכשל · הקרדיטים הוחזרו" },
      "job": { "queued": "בתור", "running": "בתהליך", "waiting_external": "ממתין למנוע", "succeeded": "הושלם", "failed": "נכשל", "canceled": "בוטל" },
      "step": { "pending": "ממתין", "running": "בעבודה", "waiting_external": "ממתין למנוע", "succeeded": "הושלם", "failed": "נכשל", "skipped": "דולג", "canceled": "בוטל", "degraded": "הושלם חלקית" },
      "scene": { "pending": "ממתינה", "generating": "נוצרת…", "ready": "מוכנה", "failed": "נכשלה", "degraded": "תמונה בתנועה" },
      "payment": { "pending": "ממתין", "succeeded": "שולם", "failed": "נכשל", "refunded": "הוחזר", "partially_refunded": "הוחזר חלקית" },
      "approval": { "pending": "ממתין לאישור", "approved": "אושר", "changes_requested": "התבקשו שינויים" },
      "subscription": { "active": "פעיל", "endsOn": "יסתיים ב-{date}", "past_due": "חיוב נכשל", "canceled": "בוטל", "expired": "הסתיים" },
      "refund": { "requested": "התקבלה", "approved": "אושרה", "paid": "שולמה", "rejected": "נדחתה" }
    },
    "empty": {
      "projects": "עוד אין פרויקטים. אפשר להתחיל בסרטון הראשון.",
      "search": "לא מצאנו תוצאות. אפשר לנסות מילה אחרת או לנקות את הסינון.",
      "notifications": "אין התראות חדשות.",
      "favorites": "עוד אין הוקים שמורים. כוכב על הוק שומר אותו כאן.",
      "selectScene": "אפשר לבחור סצנה ולערוך אותה כאן"
    },
    "hookCard": {
      "badge": "הוק",
      "firstSeconds": "מה רואים <nowrap>ב-3</nowrap> השניות הראשונות",
      "createVideo": "צרו סרטון מההוק",
      "favorite": "שמירה במועדפים",
      "unfavorite": "הסרה מהמועדפים",
      "strength": "חוזק {value} מתוך 5",
      "mustFill": "צריך למלא",
      "demo": "הדגמה"
    },
    "platforms": {
      "reels": "רילס",
      "tiktok": "טיקטוק",
      "shorts": "שורטס",
      "facebook": "פייסבוק",
      "youtube": "יוטיוב",
      "whatsapp": "וואטסאפ",
      "linkedin": "לינקדאין"
    },
    "captions": {
      "sample": "ככה ייראו הכתוביות בסרטון שלכם",
      "contrastWarning": "הצבעים של ערכת המותג מקשים לקרוא את הכתוביות. כדאי לבחור צבע הדגשה כהה יותר או את הסגנון \"קופסה נקייה\".",
      "presets": { "bold-pop": "פופ", "clean-box": "קופסה נקייה", "karaoke": "קריוקי", "poster": "פוסטר", "news": "חדשות", "soft": "רך" },
      "positionLower": "תחתון",
      "positionMiddle": "אמצע",
      "safeZones": "הצגת אזורים בטוחים",
      "zoneHook": "אזור ההוק",
      "zoneCaptions": "אזור הכתוביות",
      "zonePlatformTop": "ממשק הרשת",
      "zonePlatformBottom": "כיתוב ופעולות של הרשת",
      "zonePlatformButtons": "כפתורי הרשת"
    },
    "dnd": {
      "instructions": "כדי להזיז סצנה: רווח או Enter על הידית מרימים אותה, החצים מזיזים אותה, ורווח נוסף משחרר. Escape מבטל.",
      "start": "סצנה {n} הורמה.",
      "over": "סצנה {n} נמצאת עכשיו במקום {pos} מתוך {total}.",
      "outside": "סצנה {n} מחוץ לרשימה.",
      "end": "סצנה {n} הונחה במקום {pos}.",
      "cancel": "ההזזה בוטלה. סצנה {n} חזרה למקומה.",
      "handle": "הזזת סצנה {n}"
    },
    "live": {
      "started": "היצירה התחילה. זה לוקח בדרך כלל 4–6 דקות.",
      "voiceReady": "הקריינות מוכנה",
      "captionsReady": "הכתוביות מוכנות",
      "scenesReady": "כל הסצנות מוכנות",
      "musicReady": "המוזיקה מוכנה",
      "renderStarted": "ההרכבה התחילה",
      "sceneDegraded": "סצנה {n} נבנתה מתמונה בתנועה. הקרדיטים על הקליפ חזרו ליתרה.",
      "done": "הסרטון מוכן. אפשר לצפות ולהוריד.",
      "failed": "היצירה נכשלה. כל הקרדיטים חזרו ליתרה.",
      "scriptReady": "התסריט מוכן לעריכה",
      "brandExtracted": "סיימנו לנתח את האתר. אפשר לבדוק ולתקן את הפרטים.",
      "hookCopied": "ההוק הועתק",
      "linkCopied": "הקישור הועתק",
      "canLeave": "אפשר לסגור את הדף. נשלח לכם מייל כשהסרטון מוכן."
    },
    "deletedUser": "משתמש שנמחק",
    "time": {
      "seconds": "{n} שנ׳",
      "minutes": "{n} דק׳",
      "approxSeconds": "כ-{n} שנ׳",
      "durationOf": "{current} מתוך {target}"
    }
  }
}
```

### קריטריוני קבלה
- [ ] כל מפתח שרכיבי §10–§11 משתמשים בו קיים ב-`common` (טסט שמחפש `t("common.…")` בקוד ומוודא קיום).
- [ ] אין כפילויות: חלקים אחרים לא מגדירים מחדש "שמירה", "ביטול", "הועתק" וכו׳ (grep על ערכים זהים מחוץ ל-`common`, עם רשימת חריגים).
- [ ] `count`, `cost`, `missing`, `insufficientSr` ו-`afterGeneration` ב-`credits` מציגים צורת יחיד עבור 1 ("קרדיט אחד", "חסר קרדיט אחד", "יישאר קרדיט אחד") ו-"2 קרדיטים" עבור 2 (טסט ICU עם לוקאל `he`, כולל הקטגוריה `two` שנופלת ל-`other`).

---

## תלויות בין חלקים

- **נספח F:** הסטיות של החלק הזה מנספח F — מחרוזות בפנייה ניטרלית ("דילוג לתוכן הראשי", "עצירת אנימציות", "צרו את הסרטון · 107 קרדיטים"), הטוקנים הנוספים (`--color-on-danger`, `--color-link`, `--color-glass`, `--color-overlay`, `--color-frame`), ערכת נושא דרך סקריפט חוסם במקום קריאת עוגייה בשרת, ומידות `poster` (132/112/88) — רשומות בתיבת התיקונים של נספח F, והחלק הזה גובר.
- **חלק 02:** משתמש ברכיבים, בטוקנים וב-`common` כמו שהם. `HookCard variant="library"` הוא מה שחלק 02 §5.2 מתאר כ-"default"; ב-`HooksTeaser` — `compact` בלי `onCreateVideo`. `HookPersonalizer` מעביר ערכים לפי שם ה-placeholder (`personalization`). `FaqAccordion` מקבל `{ id, q_he, a_he }`. תוויות ה-enum ב-`lib/labels.ts` (`common.labels.*`, §1.2 שם). מדיה של הדגמה: `content/demo-wall.json` (§3.3.6) והתווית "הדגמה"; `ShowcaseGallery` לפי כלל ההצגה של §3.10. תוכן הצהרת הנגישות (§10.6) וה-PDF המתויג של טופס ההסכמה (§10.8).
- **חלק 03:** הנוסחים המלאים של המסכים (`ConfirmGenerateDialog` §6.10, `TopUpDialog` §15.2, `CancelSubscriptionFlow` §15.5, `BrandKitEditor` §12.2 עם 7 הגופנים הפתוחים), ענפי `select` לפי `ui_gender_form`, `common.deletedUser`, `errors.*`, ו-`larger_captions` = הגדלת `::cue` ל-140% בנגן בלבד. `/admin/design` ברשימת נתיבי האדמין (§22.0).
- **חלק 04:** `Enums<…>` ו-`ENUMS` מ-`lib/supabase/enums.ts` (§17.4); `HookCardDTO` (§20.3); `get_credit_summary()` (ממופה ל-camelCase); `errors.validation.*` (§18.3); `platform_admin_status()` ו-`proxy.ts` לגישה ל-`/admin/design` (§9.2, §17.2); עמודות `profiles.theme`, `reduce_motion`, `larger_captions`, `ui_gender_form`; `POST /api/projects/[id]/estimate` ל-`CostBadge`.
- **חלק 05:** קורא את `CAPTION_PRESETS` (§16.2, כולל `fallbackUnderline` של `news`), את האזורים הבטוחים ואת `AiLabel`/`Watermark` (§16.3, chip ב-`.62`), ואת `onColor`/`ensureContrast` מ-`lib/format/contrast.ts`; בנגן בדפדפן — `CAPTION_FONT_FAMILIES` מ-`components/video/caption-fonts.ts` (§5.1) ולא `@remotion/google-fonts` (חלק 05 §20.9); מוסיף עזרי כתוביות ל-`lib/hebrew/bidi.ts`; מספק `HOOK_PLACEHOLDERS` (`lib/hebrew/placeholders.ts`), `BANNED_PHRASES` (`lib/ai/prompts/style-data.ts`, לפי נספח E §5.2) ואת קומפוזיציית `Animatic` לסרטוני ההדגמה.
- **חלק 06:** ה-sha256 של `THEME_SCRIPT_SOURCE` נכלל בשני ה-CSP של §15.3 (גם בענף ה-nonce של `buildCsp`); `font-src 'self' data:`; העוגיות `theme`, `motion`, `sidebar_state` ברשימת העוגיות ההכרחיות (§11.7); האירועים `theme_changed`, `motion_toggled` ומאפייני-העל `theme`, `reduced_motion` (§14); `formatAgorot` עוטפת את `formatIls`; `lint:rtl` ו-`lint:copy` בסקריפטים וב-CI (§23.6); סקירת הלשון של M7 (`docs/qa/hebrew-review.md`).
- **נספחים D ו-E:** כלל ה-₪ והחריגים שלו (E §6.1), `BANNED_PHRASES` (E §5.2), חמש הדוגמאות של נספח D כאנימטיק עם התווית "הדגמה" (D §9).
