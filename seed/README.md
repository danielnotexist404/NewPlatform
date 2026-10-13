<div dir="rtl" lang="he">

# קובצי Seed: נישות וספריית הוקים

נתוני הפתיחה של הנישות ושל ספריית ההוקים. כל הקבצים נבנים מסקריפט אחד, `seed/scripts/build_seed.py`, שמכיל את נתוני המקור. אותו סקריפט מעדכן גם את הטבלאות ב-`docs/03-hooks-library.md`. לכן לא עורכים את קובצי ה-JSON ידנית: מעדכנים את הסקריפט ומריצים אותו שוב.

```bash
python3 -I seed/scripts/build_seed.py          # בונה את כל הקבצים, מעדכן את המסמך ומריץ בדיקות
python3 -I seed/scripts/build_seed.py --check  # בדיקות בלבד, על הקבצים הקיימים
```

## הקבצים והטבלאות

| קובץ | מה יש בו | טבלה במסד | מפתח | קשרים |
|---|---|---|---|---|
| `niche_categories.json` | 13 קטגוריות של נישות | `niche_categories` | `slug` | — |
| `niches.json` | 36 נישות: 35 השורות של מחקר 06, ושורת הכושר מפוצלת ל-`fitness-trainers` ול-`yoga-pilates` כמו במחקר 07 | `niches` | `slug` | `category_slug` ← `niche_categories.slug` |
| `hook_families.json` | 8 משפחות של סוגי הוקים (תוספת) | `hook_families`, או קבוע בקוד | `slug` | — |
| `hook_types.json` | 27 סוגי הוקים | `hook_types` | `slug` | `family_slug` ← `hook_families.slug` |
| `seasons.json` | 25 מועדים בלוח השיווקי, כולל 2 ימי שקט (תוספת) | `seasons`, או קבוע בקוד | `slug` | `niche_slugs[]` ← `niches.slug` |
| `hooks.json` | 326 הוקים: 298 לפי נישה, 18 עונתיים ו-10 אוניברסליים | `hooks` | `id` | `niche_slug` ← `niches.slug` (או null); `hook_type_slug` ← `hook_types.slug`; `season_slug` ← `seasons.slug` (או null) |
| `niche_extras.json` | 36 שורות, אחת לכל נישה: ערכי ההשקה של עמודות שקיימות רק במסד (תוספת) | `niches` (עמודות DB-only, מצב `fill_if_null`) | `slug` | `slug` ← `niches.slug`, אותה רשימה ובאותו סדר |

שמות השדות בארבעת הקבצים הקנוניים (`niche_categories`, `niches`, `hook_types`, `hooks`) זהים בדיוק לסכמה המוסכמת, ובאותו סדר. `hook_families.json` ו-`seasons.json` הם תוספות: הם מגדירים את הערכים של `family_slug` ושל `season_slug`. אם לא רוצים טבלה בשבילם, אפשר לטעון אותם כקבועים בקוד.

**`niche_extras.json`** (חלק 04 §16.1, שלב 3b) מחזיק את ערכי ההשקה של עמודות הנישה שאינן חלק מהקובץ הקנוני: `{ slug, short_name_he, default_register, default_audience_gender, default_cta, default_music_mood }`. ‏`short_name_he` לקוח מחלק 02 §1.2: צירוף ברבים שאפשר להצמיד אליו את האות ל ("סרטון תדמית למתווכי נדל״ן"). ‏`default_register`, ‏`default_audience_gender` ו-`default_cta` לקוחים מנספח E §3.3, ו-`default_music_mood` הוא `null` בהשקה. ב-`local-politics` כל הערכים `null`, כי הנישה לא פעילה. ה-seed טוען את הקובץ במצב `fill_if_null`: עמודה נכתבת רק כשהיא NULL במסד, ולכן עריכה באדמין לא נדרסת.

**סדר ייבוא:** `niche_categories` ← `niches` ← `niche_extras` ← `hook_families` ← `hook_types` ← `seasons` ← `hooks`. מומלץ upsert לפי המפתח, כדי שהרצה חוזרת לא תיצור כפילויות (ב-`niche_extras`: `fill_if_null`). הסדר שקובע ב-`pnpm db:seed` הוא של חלק 04 §16.1.

## מוסכמות

- **slugs:** אנגלית ב-kebab-case בכל הקבצים, כולל סוגי ההוקים (`curiosity-gap` ולא `curiosity_gap` כמו בטיוטת המחקר).
- **מזהה הוק:** `<niche_slug>-NN`, ‏`seasonal-<season_slug>-NN` או `universal-NN`. זה מפתח טקסט יציב. אם בטבלה יש עמודת uuid, שומרים את ה-`id` כעמודה ייחודית נוספת.
- **ערכים מותרים:**
  - `platforms`: `reels`, `tiktok`, `shorts`, `facebook`, `youtube`, `whatsapp`
  - `goal`: `awareness`, `leads`, `sales`, `trust`, `engagement`
  - `gender`: `neutral`, `plural`, `male`, `female`
  - `compliance_flag`: `none`, `medical`, `legal`, `financial`, `real_estate`, `alcohol`, `political`, `other`
  - `priority`: 1 (השקה), 2 (הרחבה), 3 (בהמשך)
- **placeholders:** `text_he` יכול לכלול `{עיר}`, `{שירות}` וכדומה. מערך `placeholders` מכיל אותם בלי סוגריים, לפי סדר ההופעה. המילון המלא נמצא במסמך, בפרק 11.
- **טיפוגרפיה:** גרשיים ״ (U+05F4) בראשי תיבות וגרש ׳ (U+05F3). בחיפוש מנרמלים אותם ל-" ול-'. מחיר נכתב כמספר ואחריו ₪ ("349 ₪"). חץ התקדמות: ←.
- **מספרים בהוקים הם דוגמאות.** לפני פרסום מחליפים אותם בנתונים האמיתיים של העסק.
- **אייקונים:** שמות של `lucide-react`. כולם נבדקו מול `lucide-react@0.460.0`.

## מה הבדיקות אוכפות

- מזהים ו-slugs ייחודיים ותקינים; אין טקסט הוק כפול.
- כל הפניה קיימת: `category_slug`, ‏`family_slug`, ‏`niche_slug`, ‏`hook_type_slug`, ‏`season_slug`, ‏`niche_slugs`.
- כל הערכים מתוך הרשימות המותרות, ושמות השדות בסדר הקנוני.
- `placeholders` תואם בדיוק לטקסט, וכל placeholder קיים במילון.
- עברית: בלי נקודה מגדרית (·), בלי לוכסנים מגדריים, בלי החץ → (בעברית חץ התקדמות הוא ←), בלי `"` או `'` בין שתי אותיות עבריות (`HE004`: גרשיים ״ וגרש ׳ בראשי תיבות, וגם לא אות שימוש צמודה למירכאות כמו ל"עמלות"), בלי 46 הביטויים האסורים של נספח E §5.2 (`HE001`), בלי `...` (`HE023`), בלי רווח לפני סימן פיסוק (`HE024`), בלי סימני כיווניות או מקף עברי, וכתיב "הכול".
- הוקים: עד 12 מילים (`HE010`; מילה היא רצף שיש בו אות או ספרה, כך ש-"–" ו-"₪" לבדם לא נספרים), בלי סוגריים (`HE025`), סימן ₪ אחרי הסכום ("349 ₪", "{מחיר} ₪"), 3–160 תווים, רק 17 ה-placeholders הראשונים של המילון, ו-`visual_direction_he` עד 20 מילים.
- `niche_extras`: שורה אחת לכל נישה, באותו סדר; `short_name_he` חובה בכל נישה פעילה, 1–4 מילים ועד 40 תווים, בלי כפילויות; `default_register`, ‏`default_audience_gender`, ‏`default_cta` ו-`default_music_mood` מתוך הערכים המותרים של חלק 04; ב-`local-politics` הכול `null`.
- בדיקת עקביות מגדר (היוריסטית): פנייה ברבים מול הערך שב-`gender`.
- לכל נישה יש הוקים, חוץ מ-`local-politics`. הנישה הזו מוחרגת בהשקה, ובכוונה אין לה הוקים.

## הערות לבנייה

- **לינקדאין** אינו ערך מותר ב-`platforms`. בנישת B2B ההמלצה ללינקדאין מופיעה בתיאור הנישה. כדאי להוסיף `linkedin` בגרסה הבאה של הסכמה.
- **סוג משני:** במחקר לחלק מההוקים יש גם סוג משני. הסכמה שומרת רק את `hook_type_slug` הראשי. הסוג המשני מופיע רק בטבלאות המסמך.
- **תאריכים:** השדה `date_hint_he` ב-`seasons.json` הוא תיאור לבני אדם, ולא אומת. התאריכים בפועל מגיעים בזמן ריצה מ-API של לוח עברי (למשל Hebcal). בימים עם `is_quiet_day: true` המתזמן עוצר כל פרסום שיווקי.

</div>
