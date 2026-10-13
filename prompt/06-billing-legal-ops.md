# חלק 06 — חיוב, תשלומים, משפט, אבטחה, בדיקות ופריסה

החלק הזה מגדיר את כל מה שהופך את המוצר מאב־טיפוס לעסק שאפשר להפעיל בישראל: מנוע חיוב משלנו (תוכניות, תקופות, הענקות חודשיות, חבילות, יחסיות, כשלי חיוב), ספק סליקה (Grow) וספק חשבוניות (Morning) מאחורי ממשקים עם מימושי mock מלאים, ביטולים והחזרים לפי חוק הגנת הצרכן, ורשימת תאימות משפטית מלאה (נגישות, פרטיות ותיקון 13, ספאם, מס, AI, בחירות).
אחריהם: כל מיילי המערכת בעברית סופית, התראות וואטסאפ, תוכנית אנליטיקה, בקרות אבטחה, ניטור והתראות עלות, תקציבי ביצועים, אסטרטגיית בדיקות, CI/CD וסביבות, משתני סביבה ודגלים, runbooks, מוסכמות הריפו, אבני הדרך M0–M7 ורשימת "הגדרת גמור" שמסיימת את הפרויקט.
הסכמה, הפונקציות והחוזים של נתיבי ה-API נמצאים בחלק 04; כאן הלוגיקה העסקית שיושבת מעליהם, והכללים שכל שאר החלקים נבדקים מולם.
**שום דבר בחלק הזה אינו ייעוץ משפטי או חשבונאי.** כל סעיף שמסומן ⚖️ עובר אישור של עורך דין ישראלי (צרכנות, פרטיות, IP) ושל רואה חשבון לפני ההשקה, והתוצאה נרשמת ב-`DECISIONS.md`.

---

## §1. מנוע החיוב: עקרונות, מבנה ומושגים

### 1.1 ההחלטה

אנחנו מריצים **מנוע חיוב משלנו** (`lib/billing/engine.ts`) ולא את מודול המנויים של חברת הסליקה. הסיבה: קרדיטים, הענקות חודשיות עם גלגול, יחסיות בשדרוג, מנויים שנתיים עם הענקה חודשית וסביבות לקוח של סוכנות — כל אלה חייבים לחיות במקום אחד שאנחנו שולטים בו ובודקים אותו. מחברת הסליקה צריך רק ארבעה דברים: עמוד תשלום מאובטח שמחזיר אסימון (PCI SAQ-A — מספר כרטיס לעולם לא נוגע בשרתים שלנו), חיוב לפי אסימון, החזר, ו-webhook מאומת. Stripe עדיין לא תומך בעסקים שרשומים בישראל (נכון ליולי 2026, `docs/research/05-stack.md`), ולכן כל boilerplate מבוסס Stripe לא רלוונטי.

### 1.2 מבנה הקבצים

הקבצים שבנספח F נשמרים; החדשים מסומנים ★ (לפי מוסכמות השמות של נספח F §14.3). בכל החלק הזה ★ מסמן שם שנוסף ביחס לנספח F; כשמדובר באובייקט במסד הנתונים, ההגדרה שלו בחלק 04 והפניה אליה מופיעה ליד.

```
lib/billing/
├─ types.ts          # Agorot, BillingCustomer, PaymentRecord, ChargeResult, RefundResult, VerifiedPaymentEvent, InvoiceLine
├─ money.ts       ★  # toAgorot / fromAgorot / toIlsNumber / formatAgorot — all arithmetic in integer agorot (…Ag)
├─ credits.ts     ★  # creditMath(): perVideoCredits / videosLeft / lowThreshold (§2.6) — pure, client-safe; getCreditMath() in credits.server.ts
├─ vat.ts            # vatRateAt(date), splitGross(gross, rate) — never a literal 0.18 in code
├─ clock.ts       ★  # injectable now(); tests pass a fixed clock
├─ periods.ts     ★  # periodBounds(anchor, cycle, n), grantWindow(anchor, k) — Asia/Jerusalem calendar math
├─ business-days.ts ★ # isBusinessDay(), addBusinessDays() — Sun–Thu minus app_settings.non_business_days (§10.2)
├─ legal.ts       ★  # CANCEL_FEE_RATE, CANCEL_FEE_CAP_AG, DISTANCE_DAYS, EXTENDED_DAYS (§10.4)
├─ plans.ts       ★  # getPlan(), getPack(), planRank(), limitsOf()
├─ engine.ts         # startCheckout, handlePaymentEvent, runBillingCron, chargeDue, retryPastDue, retryPastDueNow, grantAnnualMonthly,
│                    # changePlan, cancel, resume, applyScheduledChanges, reconcilePendingCheckouts
├─ proration.ts   ★  # quotePlanChange()
├─ refunds.ts        # quoteRefund(), executeRefund()
├─ dunning.ts     ★  # retry schedule + email variants
├─ fraud.ts       ★  # velocity checks, chargeback handling
├─ providers.ts   ★  # getPaymentProvider() — by env PAYMENT_PROVIDER
├─ grow.ts           # Grow adapter
└─ mock.ts           # complete mock gateway (dev, preview, e2e)
lib/invoicing/
├─ types.ts · morning.ts · mock.ts
├─ lines.ts       ★  # Hebrew invoice lines (§9.3)
└─ issue.ts       ★  # invoicePayment workflow, issueWithLookup(), retry policy (§9.5)
```

### 1.3 כללי יסוד (נאכפים בקוד ובבדיקות)

| # | כלל | איך נאכף |
|---|---|---|
| 1 | **כל חשבון כספי במספרים שלמים של אגורות** (`type Agorot = number & { __brand: "agorot" }`). המרה מ/אל `numeric(10,2)` רק בגבול ה-DB, דרך `toAgorot()` / `fromAgorot()`. עיגול: חצי למעלה, לאגורה. **שמות — שתי יחידות, עם סיומת חובה:** שקלים עשרוניים (2 ספרות אחרי הנקודה, כולל מע״מ אלא אם השם אומר `net`) — `_ils` ב-SQL ו-`Ils` ב-TS/JSON: עמודות ה-DB, פרמטרי RPC (`p_*_ils`), ה-JSON של ה-API (`RefundQuote.*Ils`, `PlanChangeResponse.chargeNowIls`/`newPriceIls`, גופי האדמין `{amountIls}`) והממשק (`Price`, `formatIls`); אגורות שלמות (`Agorot`) — `Ag`, רק בקוד שב-`lib/billing/**` וב-`lib/invoicing/**` ובממשקים הציבוריים של `PaymentProvider`/`InvoiceProvider`. ההמרה רק בגבולות עם שם: `toAgorot()` (DB / API / ספק ← פנימי), `fromAgorot()` (פנימי ← DB/RPC ופורמט הסכום של הספק), `toIlsNumber()` (פנימי ← JSON של ה-API). המתאם של כל ספק ממיר לפורמט שלו בפנים. | ESLint אוסר `parseFloat` ו-`toFixed` בתוך `lib/billing/**`, חוץ מ-`money.ts`; כלל ESLint ובדיקת טיפוסים ב-`lib/billing/**` וב-`lib/invoicing/**`: מאפיין מטיפוס `Agorot` חייב להסתיים ב-`Ag`, ומאפיין שמסתיים ב-`Ils` לא יכול להיות `Agorot` (`number` לא ניתן להשמה ל-`Agorot`, ולכן שקלים לא מגיעים לספק בטעות); בדיקות יחידה לכל נוסחה ולכל גבול (§18.2) |
| 2 | **המחירים במסד כוללים מע״מ** (`plans.price_monthly_ils`, `credit_packs.price_ils`). מע״מ מחושב לאחור מהמחיר הכולל, בשיעור שתקף **ביום החיוב**. | `splitGross()` הוא המקום היחיד שמחשב מע״מ |
| 3 | **שיעור המע״מ לא כתוב בקוד.** הוא נקרא מ-`app_settings.vat_rate` (היום 0.18), עם שינוי עתידי אופציונלי ב-`app_settings.vat_rate_next` (`{ "rate": <number>, "effective_from": "YYYY-MM-DD" }`). | `scripts/lint-billing.ts` נכשל על הליטרלים `0.18`, `1.18`, `18%` מחוץ ל-seed ולבדיקות |
| 4 | **קרדיטים מוענקים רק מתוך webhook מאומת או מתוך ה-cron**, לעולם לא מדף החזרה מהסליקה ולא מהדפדפן. | בדיקת e2e: רענון `/app/billing/return` לא מעניק פעמיים |
| 5 | **כל פעולה כספית אידמפוטנטית** עם מפתח קנוני (1.5). שורת `payments` נוצרת **לפני** הקריאה לספק. | אילוצי `unique` + בדיקות "משלוח כפול" |
| 6 | **אסור לחייב שוב אחרי timeout עמום.** קודם שואלים את הספק מה קרה לפי המפתח שלנו; רק תשובה מפורשת "לא בוצע" מאפשרת ניסיון חדש. | בדיקת חוזה עם fixture של timeout |
| 7 | **כל חישוב זמן חיוב לפי `Asia/Jerusalem`**, עם `@date-fns/tz` (`TZDate`). תאריכים במיילים ובממשק בפורמט `he-IL`. | בדיקות סביב מעבר שעון (סוף מרץ / סוף אוקטובר) ו-31 בחודש |
| 8 | **החיוב תמיד על סביבת החיוב** (`billing_workspace_id(ws)`): סביבת לקוח של סוכנות לא מחזיקה מנוי, אסימון או חשבוניות. | חלק 04 §21.2 (403 `billing_on_parent`) |
| 9 | **שום סכום לא מוצג בלי "כולל מע״מ"** לצרכן; לפרופיל עסקי מוצגת גם שורת "לפני מע״מ". | רכיב `Price` (חלק 01 §10.2) |

### 1.4 `money.ts` ו-`vat.ts`

```ts
// lib/billing/money.ts
export type Agorot = number & { readonly __brand: "agorot" };
export const ag = (n: number) => { if (!Number.isInteger(n)) throw new Error("agorot must be integer"); return n as Agorot; };
export const toAgorot = (ils: string | number): Agorot => ag(Math.round(Number(ils) * 100));   // boundary in: DB / API / provider → internal
export const fromAgorot = (a: Agorot): string => (a / 100).toFixed(2);                          // boundary out: internal → DB/RPC (p_*_ils) and provider wire format
export const toIlsNumber = (a: Agorot): number => Number(fromAgorot(a));                        // boundary out: internal → API JSON (…Ils fields) only
export const roundHalfUp = (x: number): Agorot => ag(Math.sign(x) * Math.round(Math.abs(x)));
// The ONLY ILS display formatter is formatIls() of part 01 §2.5 (₪ prefix, no Intl currency style).
// Billing code, emails and invoice-line builders call formatAgorot; React UI uses <Price>.
export const formatAgorot = (a: Agorot, opts?: { agorot?: "auto" | "always" }) => formatIls(a / 100, opts);   // 11900 → "₪119"

// lib/billing/vat.ts
export async function vatRateAt(date: Date): Promise<number> {
  const s = await getSettings(["vat_rate", "vat_rate_next"]);                // cached 60 s
  const next = s.vat_rate_next as { rate: number; effective_from: string } | null;
  if (next && date >= startOfDayIL(next.effective_from)) return next.rate;
  return s.vat_rate as number;
}
export function splitGross(gross: Agorot, rate: number): { netAg: Agorot; vatAg: Agorot } {
  const net = roundHalfUp(gross / (1 + rate));
  return { netAg: net, vatAg: ag(gross - net) };                           // netAg + vatAg === gross, always
}
```

דוגמאות שחייבות לעבור בבדיקות (`tests/unit/billing/vat.test.ts`):

| מחיר כולל מע״מ | שיעור | לפני מע״מ | מע״מ |
|---|---|---|---|
| ₪119.00 | 0.18 | ₪100.85 | ₪18.15 |
| ₪289.00 | 0.18 | ₪244.92 | ₪44.08 |
| ₪990.00 | 0.18 | ₪838.98 | ₪151.02 |
| ₪9,504.00 (סוכנות שנתי) | 0.18 | ₪8,054.24 | ₪1,449.76 |
| ₪59.00 | 0.18 | ₪50.00 | ₪9.00 |
| ₪350.50 (יחסיות) | 0.18 | ₪297.03 | ₪53.47 |

### 1.5 מפתחות אידמפוטנטיות של החיוב

בנוסף למפתחות הקנוניים של נספח F (§6.4: `grant:plan:{subscriptionId}:{periodStartISO}`, `grant:pack:{paymentId}`, `grant:admin:{auditLogId}`):

| פעולה | מפתח | איפה נשמר |
|---|---|---|
| חיוב ראשון ממסלול הקופה | `checkout:{checkoutSessionId}` | `payments.idempotency_key` ★ |
| חידוש מנוי | `renew:{subscriptionId}:{periodEndISO}` (סוף התקופה שמסתיימת) | `payments.idempotency_key`, ונשלח לספק כמזהה הזמנה |
| ניסיון חוזר אחרי כשל | אותו מפתח `renew:…` + `:r{retryCount}` לספק בלבד | `payments.provider_payload.attempts[]` |
| שדרוג מיידי | `plan_change:{subscriptionId}:{toPlan}:{requestIdempotencyKey}` | `payments.idempotency_key` |
| הענקה יחסית בשדרוג | `grant:plan_change:{paymentId}` | `credit_ledger.idempotency_key` |
| הענקה חודשית במנוי שנתי | `grant:plan:{subscriptionId}:{grantPeriodStartISO}` | `credit_ledger.idempotency_key` |
| החזר כספי | `refund:{refundRequestId}` | ספק + `refund_requests.id` |
| הסרת קרדיטים בהחזר | `revoke:{refundRequestId}:{grantId}` | `credit_ledger.idempotency_key` |
| הסרת יתרה מדלי בידי אדמין | `revoke:admin:{auditLogId}` | `credit_ledger.idempotency_key` |
| הסרת קרדיטים ב-chargeback | `revoke:chargeback:{paymentId}:{grantId}` | `credit_ledger.idempotency_key` |
| שחזור קרדיטים שפגו בזמן תקלה | `grant:rollover:{incidentId}:{workspaceId}` | `credit_ledger.idempotency_key` |
| פקיעה בתקרת הגלגול (§2.4) | `expire:cap:{grantId}:{grantingKey}` (`grantingKey` = מפתח ההענקה שמפעילה את התקרה) | `credit_ledger.idempotency_key` (חלק 04 §10.1) |
| חשבונית לתשלום | `invoice:{paymentId}:{docType}` | `invoices` + מזהה חיצוני אצל Morning (שדה הערה פנימית) |

`payments.idempotency_key` (‏`text unique`, ‏NULL מותר) ו-`payments.confirmation_sent_at` מוגדרות בחלק 04 §7. שורת `payments` נוצרת בסטטוס `pending` עם `provider_txn_id = 'pending:' || id`, ומתעדכנת למזהה האמיתי כשהספק עונה — כך אילוץ ה-`unique (provider, provider_txn_id)` של נספח F נשמר. ערכי `payments.failure_reason`: ‏`declined`, ‏`card_expired`, ‏`insufficient_funds`, ‏`invalid_token`, ‏`provider_error`, ‏`amount_mismatch`, ‏`chargeback`.

### 1.6 מצב המנוי

```
              checkout (webhook מאומת)
   (אין מנוי) ─────────────────────────► active ──────────────── renew ok ────────┐
                                           │  ▲                                   │
                     חידוש נכשל            │  │ חיוב עבר (ניסיון חוזר / כרטיס חדש) │
                                           ▼  │                                   │
                                        past_due ── 3 ניסיונות חוזרים נכשלו (יום 7) ──► expired ──► (free)
                                           │
   active + cancel_at_period_end=true ─────┴── current_period_end עבר ──► canceled ──► (free)
   active ── החזר כספי (14 יום / יחסי) ──► canceled מיד (current_period_end = now) ──► (free)
```

- `active` עם `cancel_at_period_end = true` הוא "בוטל, פעיל עד סוף התקופה". ה-UI מציג אותו כ"בוטל" (חלק 03 §15.1).
- `canceled` ו-`expired` הם סופיים לשורה. מנוי חדש = שורה חדשה (האינדקס החלקי `subscriptions_one_live` מאפשר את זה).
- בכל מעבר ל-`canceled`/`expired`: `workspaces.plan_id = 'free'` באותה טרנזקציה, ומיד אחריו `enforce_plan_limits(ws)` (חלק 04 §9.5b); `has_paid` נשאר `true` (סימן המים לא חוזר למי ששילם אי־פעם, לפי נספח F §10.5).

### 1.7 העמודות שהמנוע צריך (הוגדרו בחלק 04 §7, מיגרציה `0005`)

| טבלה | עמודה | שימוש | הגדרה |
|---|---|---|---|
| `subscriptions` | `anchor_at timestamptz not null default now()` | עוגן לחישוב תקופות (שומר על "31 בחודש" אחרי פברואר) | חלק 04 §7 |
| `subscriptions` | `next_grant_at timestamptz NULL` | ההענקה החודשית הבאה במנוי שנתי (האינדקס `subscriptions_next_grant_idx`) | חלק 04 §7 |
| `subscriptions` | `scheduled_change jsonb NULL` | `{ plan_id, cycle, requested_at, requested_by }` — הורדת תוכנית או מעבר מחזור בסוף התקופה | חלק 04 §7 |
| `subscriptions` | `past_due_since timestamptz NULL` | תחילת הגבייה החוזרת (dunning) | חלק 04 §7 |
| `payments` | `idempotency_key text unique NULL` | 1.5 | חלק 04 §7 |
| `payments` | `confirmation_sent_at timestamptz NULL` | מתי נשלח אישור העסקה (פותח את חלון 14 הימים, §10) | חלק 04 §7 |

הפונקציות שהמנוע קורא להן (כולן `security definer`, ‏`execute` ל-`service_role` בלבד): `billing_apply_payment`, ‏`billing_apply_renewal`, ‏`billing_apply_plan_change` (חלק 04 §10.8 — חתימות; הלוגיקה המחייבת: §4.1, §4.2, §5.3 כאן), ‏`revoke_grant_remaining` (חלק 04 §10.3), ‏`enforce_plan_limits` (חלק 04 §9.5b), ‏`grant_credits` ו-`credit_invariant_violations` (חלק 04 §10).

### קריטריוני קבלה
- [ ] `grep -rE "0\.18|1\.18" lib app --include=*.ts --include=*.tsx` לא מחזיר כלום מחוץ ל-seed ולבדיקות (`pnpm lint:billing`).
- [ ] כל טבלת הדוגמאות ב-1.4 עוברת, ו-`net + vat === gross` בבדיקת property-based על 10,000 סכומים אקראיים.
- [ ] אין ב-`lib/billing` שימוש ב-`Number.prototype.toFixed` לחישוב (רק לעיצוב בגבול ה-DB).
- [ ] מעבר `canceled`/`expired` מעדכן את `workspaces.plan_id` באותה טרנזקציה (בדיקת SQL).

---

## §2. תוכניות, תקופות והענקות חודשיות

### 2.1 התוכניות (מקור אמת: `plans.json` ב-seed, חלק 04 §16.4, לפי נספח F §10.2)

| `id` | שם | חודשי (כולל מע״מ) | שנתי (שווה ערך לחודש) | שנתי (סכום החיוב) | קרדיטים בחודש | מקסימום מושבים |
|---|---|---|---|---|---|---|
| `free` | חינם | ₪0 | — | — | 70 חד־פעמי (ניסיון) | 1 |
| `starter` | בסיס | ₪119 | ₪95 | ₪1,140 | 400 | 1 |
| `business` | עסק | ₪289 | ₪231 | ₪2,772 | 1,000 | 3 |
| `agency` | סוכנות | ₪990 | ₪792 | ₪9,504 | 3,300 | 10 |

סכום החיוב השנתי = `price_annual_monthly_ils × 12`, מחושב ב-`plans.ts` (לא נשמר בנפרד). מושב = חבר בתפקיד `owner`, `admin` או `editor` (בסביבת החיוב ובסביבות הלקוח שלה) או הזמנה ממתינה לתפקיד `admin`/`editor`; צופים לא נספרים ואינם מוגבלים (`seats_used`, חלק 04 §9.2). שינוי מחיר באדמין חל רק על מנויים חדשים: `subscriptions.price_ils` ו-`vat_rate` ננעלים ברגע הרכישה (חריג יחיד — שינוי שיעור מע״מ, §9.7).

### 2.2 חשבון תקופות (`lib/billing/periods.ts`)

- **העוגן** (`anchor_at`) הוא רגע התשלום הראשון. תקופה `n` מתחילה ב-`addMonths(anchor, n)` (חודשי) או `addYears(anchor, n)` (שנתי), בשעון ישראל. כך מנוי שהתחיל ב-31 בינואר מתחדש ב-28 (או 29) בפברואר וחוזר ל-31 במרץ, ולא "נגרר" ל-28 לתמיד.
- **שעת החיוב:** אותה שעה ביום כמו העוגן. ה-cron רץ כל שעה (`5 * * * *`), ולכן החיוב בפועל מתבצע עד שעה אחרי `next_charge_at`.
- **הענקות חודשיות במנוי שנתי:** תאריכי ההענקה הם `addMonths(anchor, k)` ל-`k = 0…11` בתוך השנה; `next_grant_at` מצביע להבאה. ההענקה הראשונה (`k = 0`) קורית עם התשלום.

```ts
// lib/billing/periods.ts
export function periodBounds(anchor: Date, cycle: BillingCycle, n: number) {
  const tz = "Asia/Jerusalem";
  const a = new TZDate(anchor, tz);
  const start = cycle === "monthly" ? addMonths(a, n) : addYears(a, n);
  const end = cycle === "monthly" ? addMonths(a, n + 1) : addYears(a, n + 1);
  return { start: new Date(start), end: new Date(end) };
}
export function grantWindow(anchor: Date, k: number) {           // monthly grant window inside an annual term
  const { start, end } = periodBounds(anchor, "monthly", k);
  return { start, end, expiresAt: new Date(addMonths(new TZDate(end, "Asia/Jerusalem"), 1)) };
}
```

### 2.3 הענקת המכסה החודשית

| אירוע | מה מוענק | `expires_at` | מפתח | `ref` |
|---|---|---|---|---|
| תשלום ראשון / חידוש של מנוי חודשי | `monthly_credits` של התוכנית | סוף התקופה + חודש | `grant:plan:{subId}:{periodStartISO}` | `ref_type='payment'`, `ref_id=paymentId` |
| תשלום שנתי (חודש ראשון) | `monthly_credits` | סוף חלון ההענקה + חודש | `grant:plan:{subId}:{grantStartISO}` | `ref_type='payment'` |
| כל חודש נוסף במנוי שנתי (cron) | `monthly_credits` | סוף החלון + חודש | `grant:plan:{subId}:{grantStartISO}` | `ref_type='subscription'`, `ref_id=subId` |
| שדרוג מיידי (§5) | הפרש יחסי | כמו ההענקה הנוכחית | `grant:plan_change:{paymentId}` | `ref_type='payment'` |

תיאור ההענקה ביומן (`description_he`): **"מכסה חודשית — תוכנית {planName} ({fromDate}–{toDate})"**; ביחסיות: **"תוספת יחסית בשדרוג לתוכנית {planName}"**.

### 2.4 גלגול קרדיטים ("קרדיטים שלא נוצלו עוברים לחודש הבא")

- הגלגול **ממומש דרך התוקף**: כל הענקת מכסה פגה חודש אחרי סוף התקופה שלה. בתקופה החדשה עומדים לרשותכם המכסה החדשה ומה שנשאר מהקודמת; סדר הצריכה (הדלי שפג ראשון) מבטיח שהשאריות מהחודש הקודם נצרכות קודם. אין צורך ב"העברה" פעילה, ולכן אין סיכוי לגלגול כפול.
- **תקרת גלגול** (`app_settings.rollover_cap_multiplier`, היום 1): ברגע כל הענקת מכסה (בתוך פונקציות `billing_apply_*` ובהענקה החודשית של מנוי שנתי, לפני ההענקה עצמה), סך `remaining` של דליי `plan_cycle`/`rollover` שעדיין בתוקף (לפני ההענקה) לא יעלה על `multiplier × max(monthly_credits של התוכנית הקודמת, של החדשה)`. עודף פג מיד דרך `cap_rollover(ws, cap, grantingKey)` (חלק 04 §10.2; `cap` = הערך שלמעלה, `grantingKey` = מפתח האידמפוטנטיות של ההענקה שמפעילה את התקרה), שכותב שורת `expire` במפתח `expire:cap:{grantId}:{grantingKey}` עם התיאור **"קרדיטים מעבר לתקרת הגלגול"**; פקיעה טבעית מאוחרת של אותו דלי כותבת `expire:{grantId}`, בלי התנגשות מפתחות. בפועל, עם התוקף של חודש אחד, התקרה תופסת רק חריגות (הענקות ידניות, תקלות) — היא רשת ביטחון ולא מנגנון עיקרי.
- **ערכי `grant_source = 'rollover'` / `ledger_kind = 'grant_rollover'`** משמשים פעולה אחת: **"שחזור קרדיטים שפגו"** — כשתקלה מצדנו מנעה מלקוח לנצל קרדיטים לפני שפגו, הסקריפט `scripts/restore-expired-credits.ts --incident={id} --from={ISO} --to={ISO} [--dry-run]` (runbook R1) מעניק לכל סביבה שנפגעה דלי `rollover` (‏`ref_type = 'incident'`, ‏`ref_id = incidentId`) בגובה מה שפג בחלון התקלה, עם תוקף חדש של 30 יום ותיאור **"שחזור קרדיטים שפגו בזמן תקלה"**. מפתח: `grant:rollover:{incidentId}:{workspaceId}`.
- **בביטול או בשנמוך** הקרדיטים שכבר הוענקו נשארים עד תוקפם (חלק 03 §15.3, §15.5). אחרי החזר כספי — הקרדיטים שנותרו מאותו תשלום מוסרים (§10).

### 2.5 קרדיטי ניסיון

70 קרדיטים (`app_settings.free_trial_credits`), פעם אחת לכל מייל מנורמל, בלי כרטיס ובלי המרה אוטומטית לתשלום — ולכן אין "תזכורת לפני חיוב" ואין חיוב בסוף ניסיון. ההענקה ב-`handle_new_user` (חלק 04 §9.4), בלי תוקף. סימן מים עד התשלום הראשון. מניעת ניצול לרעה: §7.

### 2.6 יתרה בסרטונים וסף "יתרה נמוכה" (`lib/billing/credits.ts` ★)

זו הנוסחה האחת ל"בערך N סרטונים" ולסף "יתרה נמוכה". משתמשים בה `CreditsMeter` (חלק 01; הטבעת מצוירת רק כש-`planAllowance != null`, ובלי מכסה מוצג רק המספר), הבאנר והכרטיסים של חלק 03 (§1.7, §5.7), `/api/cron/reminders` (חלק 04 §23: נשלח כש-`balance < lowThreshold`) והמייל `low_credits` (§12.5). אין חישוב מקומי בשום רכיב, נתיב או מייל.

```ts
// lib/billing/credits.ts ★ — pure (no I/O, no "server-only"), so client components may import it: the one exception to the
// lib/billing/** client-import ban (§23.1). Inputs = credit_costs + app_settings.typical_video_credits, read on the server by
// getCreditMath() (lib/billing/credits.server.ts, cached 60 s) and passed to client components by the app layout.
import { estimateSample, type CreditCostMap } from "@/lib/pipeline/estimate";   // part 05 §14.2
import { FREE_VIDEO_SAMPLE } from "@/lib/marketing/savings";                      // part 02 §3.3.4 — 30 credits with the seed

export function creditMath(i: { creditCosts: CreditCostMap; typicalVideoCredits: number }) {   // typical_video_credits = 50 (seed)
  const perVideoCredits = (planId: PlanId): number =>
    planId === "free" ? estimateSample(FREE_VIDEO_SAMPLE, i.creditCosts) : i.typicalVideoCredits;
  return {
    perVideoCredits,
    videosLeft: (balance: number, planId: PlanId): number => Math.floor(Math.max(0, balance) / perVideoCredits(planId)),
    // planAllowance = get_credit_summary.plan_allowance: null = no monthly allowance (free), never 0 (part 04 §10.5)
    lowThreshold: (summary: { planAllowance: number | null }, planId: PlanId): number =>
      summary.planAllowance == null
        ? perVideoCredits(planId)
        : Math.max(perVideoCredits(planId), Math.ceil(0.15 * summary.planAllowance)),
  };
}
```

`videosLeft(balance, planId)` ו-`lowThreshold(summary, planId)` שבשאר החלקים הן הפונקציות שמוחזרות מ-`creditMath(...)` (בשרת: `(await getCreditMath()).videosLeft(…)`). עם ה-seed: בתוכנית החינמית `perVideoCredits = 30`, ולכן 70 קרדיטי הניסיון = 2 סרטונים, והסף הוא 30; בבסיס (מכסה 400) הסף הוא `max(50, 60) = 60`; בעסק (1,000) — 150; בסוכנות (3,300) — 495.

### קריטריוני קבלה
- [ ] מנוי שהתחיל ב-2027-01-31 10:00 שעון ישראל מתחדש ב-2027-02-28 10:00 וב-2027-03-31 10:00 (בדיקת יחידה).
- [ ] מנוי שנתי מקבל 12 הענקות בדיוק בשנה, כל אחת עם תוקף "סוף החלון + חודש", ומפתח כפול לא יוצר הענקה שנייה.
- [ ] אחרי חידוש, יתרה = שארית החודש הקודם + המכסה החדשה; ההזמנה הבאה צורכת קודם מהשארית (בדיקת SQL מול `reserve_credits`).
- [ ] תקרת הגלגול לא פוגעת בשנמוך: מעבר מסוכנות לבסיס עם 2,000 קרדיטים שנותרו לא מפיג אף קרדיט.
- [ ] `lib/billing/credits.ts` מחזיר את ערכי 2.6 עם ה-seed, ו-`CreditsMeter`, הבאנר, `/api/cron/reminders` והמייל `low_credits` משתמשים בו בלבד (בדיקת יחידה + סקירה).

---

## §3. חבילות קרדיטים וסדר הצריכה

### 3.1 החבילות

| `id` | קרדיטים | מחיר (כולל מע״מ) | לפני מע״מ | מחיר לקרדיט | תוקף |
|---|---|---|---|---|---|
| `pack-150` | 150 | ₪59 | ₪50.00 | ₪0.39 | לא פג |
| `pack-500` | 500 | ₪179 | ₪151.69 | ₪0.36 | לא פג |
| `pack-1500` | 1,500 | ₪449 | ₪380.51 | ₪0.30 | לא פג |

- זמינות בכל תוכנית, כולל חינם. רכישה ראשונה מסמנת `workspaces.has_paid = true` (מסיר סימן מים מהיצירות הבאות).
- תשלום: כרטיס אשראי, ו-Bit רק בחבילות ורק כש-`GROW_PAGE_CODE_BIT` מוגדר (וספייק M0 של Grow אישר אותו [M0-verify]). השרת מעביר `bitEnabled: boolean` ל-`/pricing`, ל-`TopUpDialog` ולקופי של הקופה; כשהוא `false`, המחרוזות שמזכירות Bit מוצגות בגרסת "כרטיס בלבד" שלהן (מפתחות `…ByCardOnly`, חלק 02 §7.3, §7.6). בחבילות **לא שומרים אסימון** (אין `saveToken`), כדי שרכישה חד־פעמית לא תיצור אמצעי תשלום שמור בלי שהתבקש.
- ההענקה: `grant_credits(ws, credits, 'topup', null, 'payment', paymentId, 'grant:pack:{paymentId}', 'רכישת חבילת קרדיטים ({credits})')` (המספר בסוגריים, בלי צורת רבים שתלויה בו; הסכום מופיע גם בעמודת השינוי ביומן).

### 3.2 סדר הצריכה (תזכורת לחוזה של חלק 04 §10)

1. הדלי שפג ראשון (`expires_at asc`), ואז הישן ביותר; דליים בלי תוקף (חבילות, ניסיון) — אחרונים.
2. בפועל: שארית החודש הקודם ← המכסה הנוכחית ← קרדיטי ניסיון וחבילות.
3. סביבת לקוח של סוכנות צורכת מהיתרה של הסוכנות (`billing_workspace_id`).
4. התקרה היומית (`limits.daily_credit_cap`) נאכפת בתוך `reserve_credits` ומחזירה ‏403 `PLAN_LIMIT` עם `{ limit: "daily_credit_cap" }`.

### קריטריוני קבלה
- [ ] רכישת חבילה בתוכנית חינם מעניקה קרדיטים בלי תוקף ומסירה את סימן המים מהרינדור הבא.
- [ ] רכישת חבילה לא יוצרת שורת `payment_methods`.
- [ ] עם 30 קרדיטים ממכסה שפגה בעוד 3 ימים ו-150 מחבילה, יצירה של 50 קרדיטים צורכת 30 מהמכסה ו-20 מהחבילה.

---

## §4. מחזור החיים של מנוי

### 4.1 רכישה ראשונה (קופה ← webhook ← הפעלה)

1. **`POST /api/billing/checkout {kind:"subscription", planId, cycle}`** (חוזה ושגיאות: חלק 04 §21.1–§21.2). בדיקות עסקיות, לפי הסדר: הדגל `billing_checkout` פעיל ו-`app_settings.maintenance_mode.enabled` כבוי (אחרת ‏503 `MAINTENANCE {until:null, scope:"checkout"}`); `billing_profiles` קיים (אחרת ‏400 `INVALID_INPUT {reason:"billing_profile_required"}`); הדגל `annual_billing` פעיל למנוי שנתי (אחרת `{reason:"annual_disabled"}`); אין מנוי חי (אחרת `{reason:"use_plan_change"}`, והממשק פותח את דיאלוג שינוי התוכנית); בדיקות הונאה (§7.2: ‏403 `FORBIDDEN {reason:"checkout_temporarily_blocked"}`, ‏429 `RATE_LIMITED {scope:"checkout"}` או `{scope:"topup_daily"}`).
2. יצירת `checkout_sessions` (`amount_ils` = חודשי, או `price_annual_monthly_ils × 12`), ואז `provider.createHostedCheckout({ sessionId, amountAg: toAgorot(session.amount_ils), saveToken: true, description, customer, successUrl, cancelUrl, webhookUrl })`. תיאור החיוב (מופיע בעמוד התשלום ובדף החיוב של הכרטיס): **"{{BRAND_NAME}} — מנוי תוכנית {planName} ({cycleHe})"**, כש-`cycleHe` = "חודשי" / "שנתי".
3. **גילוי לפני תשלום** (עסקת מכר מרחוק — §10.1): הדיאלוג שלפני ההפניה מציג, מעל הכפתור, את הבלוק הזה (מחרוזות `billing.disclosure.*`):
   - **"₪{price} {cycleSuffix}, כולל מע״מ. החיוב מתחדש אוטומטית עד שתבטלו."** (`cycleSuffix` = "לחודש" / "לשנה")
   - **"אפשר לבטל בכל רגע: בעמוד החיוב, במייל או בטלפון. אחרי ביטול לא יהיו חיובים נוספים."**
   - **"ב-14 הימים הראשונים אפשר לבטל ולקבל החזר, בניכוי שווי הקרדיטים שנוצלו ודמי ביטול של עד 5% (ולא יותר מ-{feeCap})."**
   - **"חשבונית מס תישלח למייל {billingEmail}."**
   - תיבת סימון **לא מסומנת** וחובה: **"קראתי את {תנאי השימוש} ואת {מדיניות הביטול}, והם מקובלים עליי."** ← שורת `consents` מסוג `terms` עם `source = 'checkout'` והגרסה הנוכחית, שנכתבת בשרת בנתיב הקופה (`recordConsent()`, §11.4). בלי סימון הכפתור מושבת, ומתחת מופיע **"כדי להמשיך לתשלום צריך לאשר את התנאים."** אותו בלוק ואותה תיבה מופיעים גם ב-`TopUpDialog` וב-`PlanChangeDialog` (חלק 03 §15.2–§15.3).
   - בחבילת קרדיטים — אותו בלוק בלי שורת החידוש, ועם **"קרדיטים מחבילה לא פגים."**
4. **Webhook** (`/api/webhooks/payments/grow` — מופע של ה-Route Handler האחד `app/api/webhooks/payments/[provider]/route.ts`, חלק 04 §22.4) ← `adapter.parseWebhook(raw, req.headers, new URL(req.url))` (אימות `?k=&s=` ושאילתה חוזרת, §8.2) ← `billingEngine.handlePaymentEvent(ev)`.
5. `handlePaymentEvent` לאירוע `payment.succeeded` קורא לפונקציית SQL אטומית אחת, `billing_apply_payment` (חתימה: חלק 04 §10.8; הסכום נשלח כ-`p_amount_ils = fromAgorot(ev.amountAg)`, בשקלים עשרוניים), שמתנהגת לפי `checkout_sessions.kind` ומחזירה `{payment_id, subscription_id, credits_granted, status: 'succeeded'|'amount_mismatch'|'duplicate'}`. בסשן מנוי (`subscription`), בטרנזקציה אחת:
   - מאמתת שהסכום שהתקבל = `checkout_sessions.amount_ils` (אי־התאמה ← `payments.failure_reason = 'amount_mismatch'`, בלי הענקה, התראה לאדמין);
   - מכניסה `payments` (`kind = subscription_initial`, `status = succeeded`, מע״מ מפוצל לפי `vatRateAt(now)`, `idempotency_key = checkout:{sessionId}`);
   - שומרת `payment_methods` (אסימון מוצפן ב-AES-256-GCM, §15.5; `is_default = true`; הקודם — `deleted_at`);
   - יוצרת `subscriptions` (`active`, `anchor_at = now`, תקופה ראשונה, `next_charge_at = current_period_end`, במנוי שנתי `next_grant_at = addMonths(anchor, 1)`, `price_ils` ו-`vat_rate` נעולים);
   - מעדכנת `workspaces.plan_id`, `has_paid = true`;
   - מעניקה את המכסה (2.3) ומסמנת את `checkout_sessions.status = 'completed'`.

   **בסשן חבילה (`topup`):** אותה בדיקת סכום ואותה שורת `payments` (`kind = topup`, `pack_id`), הענקת `grant:pack:{paymentId}` (3.1), ‏`has_paid = true`, בלי `payment_methods`. **בסשן עדכון כרטיס (`update_card`):** אין שורת `payments` (`payment_id: null`); נשמר `payment_methods` חדש כברירת מחדל, הקודם מסומן `deleted_at`, ו-`subscriptions.payment_method_id` מתעדכן. אם המנוי ב-`past_due` — מיד אחרי ה-RPC, `handlePaymentEvent` מתחיל workflow קצר `retryPastDueNow(subscriptionId)` (כדי שתשובת ה-webhook תישאר מתחת ל-2 שניות, §17), שמבצע `chargeToken` אחד על התקופה שבחוב עם אותו מפתח `renew:{subscriptionId}:{periodEndISO}`, ובהצלחה ← `billing_apply_renewal` (§6.1).
6. מחוץ לטרנזקציה: workflow קצר `invoicePayment(paymentId)` (Vercel Workflows, עם ניסיונות חוזרים — §9.5) מפיק חשבונית, מעתיק PDF ל-bucket `invoices`, שולח את המייל `payment_receipt` (§12) ומעדכן `payments.confirmation_sent_at`. אירועי שרת (בכפוף להסכמה, §14): `checkout_completed`, ובחבילה גם `topup_purchased`.

### 4.2 חידוש (`/api/cron/billing-renewals`, כל שעה)

סדר הפעולות בכל ריצה (נעילת Upstash `cron:billing-renewals`, כל שלב בבאצ׳ים של 50 עם `for update skip locked`):

```ts
// app/api/cron/billing-renewals/route.ts → lib/billing/engine.ts
export async function runBillingCron(now = clock.now()) {
  const r = { reconciled: 0, scheduled: 0, ended: 0, charged: 0, failed: 0, downgraded: 0, granted: 0 };
  r.reconciled = await reconcilePendingCheckouts(now);   // sessions 'created' 10 min–48 h old → provider status query → apply (§8.4)
  r.scheduled  = await applyScheduledChanges(now);       // scheduled_change with current_period_end <= now (BEFORE charging)
  r.ended      = await endCanceledSubscriptions(now);    // cancel_at_period_end and current_period_end <= now → canceled, plan free
  r.charged    = await chargeDue(now);                   // active, !cancel_at_period_end, next_charge_at <= now
  r.failed     = await retryPastDue(now);                // past_due, next_charge_at <= now (§6)
  r.downgraded = await expireExhaustedDunning(now);      // past_due with all retries failed → expired, plan free
  r.granted    = await grantAnnualMonthly(now);          // annual active, next_grant_at <= now and < current_period_end
  return r;
}
```

- כש-`app_settings.renewals_paused = true` (runbook R3), `chargeDue` ו-`retryPastDue` מדלגים בלי לשנות סטטוס, ו-`expireExhaustedDunning` לא מסיים מנוי שהניסיון האחרון שלו עוד לא התבצע בפועל — תקופת החסד מתארכת במשך ההשהיה. שאר השלבים רצים כרגיל. כשההשהיה מוסרת, הריצה הבאה מחייבת את כל מה שהגיע מועדו.
- `endCanceledSubscriptions` ו-`expireExhaustedDunning` קוראים ל-`enforce_plan_limits(ws)` אחרי המעבר לתוכנית החינמית (§1.6).
- הנתיב רץ כל שעה (`5 * * * *`, ‏`maxDuration = 300`, נעילה `cron:billing-renewals`, חלק 04 §23). כל שלב מעבד באצ׳ים עד שנגמר הזמן, ומה שלא הספיק ממשיך בריצה הבאה.

**חידוש מנוי בודד (`chargeOne`):**
1. `insert into payments (… status 'pending', kind 'subscription_renewal', idempotency_key 'renew:{subId}:{periodEndISO}') on conflict do nothing`. התנגשות ← השורה הקיימת קובעת: `succeeded` ← דילוג; `pending` מעל 15 דקות ← שאילתת סטטוס אצל הספק (כלל 6 ב-1.3).
2. סכום: `subscriptions.price_ils` (נעול). מע״מ: לפי `vatRateAt(now)`; אם השיעור השתנה מאז הנעילה — §9.7.
3. `provider.chargeToken({ tokenRef: decrypt(token_enc), amountAg: toAgorot(sub.price_ils), description: "{{BRAND_NAME}} — חידוש מנוי תוכנית {planName}", idempotencyKey })`.
4. הצלחה ← RPC `billing_apply_renewal(p_payment, p_txn, p_payload)` (חלק 04 §10.8): `payments.status = succeeded`; התקופה מתקדמת (`current_period_start = old end`, `current_period_end = periodBounds(anchor, cycle, n+1).end`); `next_charge_at = current_period_end`; `retry_count = 0`; `past_due_since = null`; הענקת המכסה (2.3); במנוי שנתי `next_grant_at = addMonths(new start, 1)`. אחר כך `invoicePayment(paymentId)` ואירוע השרת `subscription_renewed {plan_id, cycle}`.
5. כישלון ← §6. תשובה עמומה (`ok: "unknown"`) ← השורה נשארת `pending`, וההחלטה מחכה לשאילתת הסטטוס (כלל 6 ב-1.3, צעד 1 בריצה הבאה).

### 4.3 סיום מנוי שבוטל

`endCanceledSubscriptions`: `status = 'canceled'`, `workspaces.plan_id = 'free'`, ואז `enforce_plan_limits(ws)`. מגבלות התוכנית החינמית חלות מעכשיו (§5.4, חלק 03 §15.3: חברים עודפים ← צופים; ערכות מותג עודפות לא מוצעות לסרטונים חדשים; סביבות לקוח ← קריאה בלבד). אין מייל נוסף (האישור נשלח ברגע הביטול). התראה באפליקציה מסוג `system`: **"המנוי לתוכנית {planName} הסתיים, והחשבון עבר לתוכנית החינמית. הפרויקטים והקרדיטים שנותרו נשארים."**

### 4.4 חידוש מנוי שבוטל (`POST /api/billing/resume`)

לפני `current_period_end`: מאפס `cancel_at_period_end`, `canceled_at`, `cancel_reason`, `cancel_channel`; החיוב הבא כרגיל. אחרי שהמנוי הסתיים — אין "resume"; זו רכישה חדשה דרך הקופה. אחרי החזר כספי — אין resume. רישום: `audit_logs` ‏`billing.resume`.

### קריטריוני קבלה
- [ ] רכישת מנוי ב-mock: שורת `payments` אחת, `payment_methods` אחת עם `token_enc` מוצפן, `subscriptions` פעיל, הענקה אחת, חשבונית אחת, מייל אחד — גם כשה-webhook נשלח 3 פעמים.
- [ ] webhook עם סכום שונה מהסשן לא מעניק קרדיטים ומייצר התראת אדמין.
- [ ] הרצת ה-cron פעמיים באותה שעה לא מחייבת פעמיים (המפתח `renew:` + נעילה).
- [ ] timeout מדומה בחיוב לפי אסימון לא גורם לחיוב שני; אחרי שאילתת הסטטוס החיוב מסומן נכון.
- [ ] תיבת אישור התנאים בקופה לא מסומנת מראש, הכפתור מושבת בלעדיה, והסימון נרשם ב-`consents` עם `source='checkout'`.
- [ ] `resume` לפני סוף התקופה מחזיר את החיוב הבא; אחרי סוף התקופה מחזיר `INVALID_INPUT {reason:"not_cancelable_state"}`.

---

## §5. שדרוג, שנמוך ויחסיות

### 5.1 הכללים

| # | מעבר | מתי | חיוב עכשיו | קרדיטים עכשיו | מה קורה לתקופה |
|---|---|---|---|---|---|
| 1 | חודשי ← חודשי גבוה יותר | מיד | `(P_new − P_old) × f` | `⌈(C_new − C_old) × f⌉` | לא משתנה; החידוש הבא במחיר החדש |
| 2 | שנתי ← שנתי גבוה יותר | מיד | `(A_new − A_old) × f_year` | `⌈(C_new − C_old) × f_month⌉` לחלון ההענקה הנוכחי | לא משתנה; ההענקות הבאות בגובה החדש |
| 3 | חודשי ← שנתי (אותה תוכנית או גבוהה יותר) | **בסוף התקופה** כברירת מחדל; או "עכשיו" לבחירה | ברירת מחדל: 0 עכשיו, `A_new` בסוף התקופה. "עכשיו": `A_new` מלא | ברירת מחדל: כלום עכשיו. "עכשיו": `C_new` (החודש הראשון בשנתי) | "עכשיו": עוגן חדש = עכשיו, שנה מלאה. הקרדיטים מהחודש הנוכחי נשארים עד תוקפם |
| 4 | שנתי ← חודשי (כל תוכנית) | בסוף השנה | 0 | 0 | `scheduled_change` |
| 5 | ← תוכנית נמוכה יותר (באותו מחזור, או מחודשי לשנתי) | בסוף התקופה | 0 עכשיו; בסוף התקופה — המחיר החדש (`A_new` בשנתי) | 0 | `scheduled_change`; מגבלות התוכנית החדשה חלות מהחידוש |
| 6 | ← חינם | זה ביטול | — | — | §10 |
| 7 | כל שינוי כשהמנוי `past_due` | חסום | — | — | `INVALID_INPUT {reason:"past_due"}` — קודם מעדכנים כרטיס |

הגדרות: `P` = מחיר חודשי כולל מע״מ, `A` = סכום שנתי כולל מע״מ, `C` = `monthly_credits`. `f = (current_period_end − now) / (current_period_end − current_period_start)`, בשניות, מעוגל ל-4 ספרות ומוגבל ל-[0, 1]. `f_month` מחושב באותו אופן על חלון ההענקה הנוכחי. סכום החיוב מעוגל לאגורה (חצי למעלה). **חיוב יחסי מתחת ל-₪5.00 לא נגבה** (השדרוג נכנס לתוקף בלי חיוב, והקרדיטים היחסיים ניתנים) — כדי לא להפיק חשבוניות של שקלים בודדים.

שינוי מתוזמן ושדרוג מיידי: שדרוג מיידי מבטל `scheduled_change` קיים. שנמוך מתוזמן חדש מחליף את הקודם. ביטול מבטל כל `scheduled_change`. בקשה לתוכנית ולמחזור הנוכחיים בזמן שיש `scheduled_change` מבטלת את השינוי המתוזמן ומחזירה ‏200 עם `immediate: true`, ‏`chargeNowIls: 0`; אותה בקשה בלי שינוי מתוזמן ← ‏400 `INVALID_INPUT {reason:"same_plan"}` (חלק 04 §21.2).

`PlanChangeBody.when` (‏`"now" | "period_end"`) נשלח רק במעבר 3; בשאר המעברים העמודה "מתי" שלמעלה קובעת, ו-`when` שנשלח בהם לא משפיע. ‏`dryRun: true` מחזיר את ההצעה (`PlanChangeResponse`, כולל `newCycle` ו-`newPriceIls`) בלי לשנות דבר.

### 5.2 דוגמאות (חייבות לעבור ב-`tests/unit/billing/proration.test.ts`)

| תרחיש | נתונים | חיוב עכשיו | קרדיטים עכשיו |
|---|---|---|---|
| עסק ← סוכנות, חודשי | 15 מתוך 30 ימים נותרו (`f = 0.5`) | (990 − 289) × 0.5 = **₪350.50** | (3,300 − 1,000) × 0.5 = **1,150** |
| בסיס ← עסק, חודשי | 10 מתוך 31 ימים (`f = 0.3226`) | 170 × 0.3226 = **₪54.84** | ⌈600 × 0.3226⌉ = **194** |
| עסק ← סוכנות, שנתי | עברו 100 מתוך 365 ימים (`f_year = 0.7260`); 20 מתוך 30 ימים נותרו בחלון (`f_month = 0.6667`) | (9,504 − 2,772) × 0.7260 = **₪4,887.43** | ⌈2,300 × 0.6667⌉ = **1,534** |
| בסיס ← עסק ביום האחרון | שעה אחרונה (`f = 0.0014`) | 170 × 0.0014 = ₪0.24 ← **₪0 (מתחת לסף)** | ⌈600 × 0.0014⌉ = **1** |
| עסק חודשי ← עסק שנתי "עכשיו" | אמצע החודש | **₪2,772** | **1,000** (ו-500 שנותרו מהחודשי נשארים עד תוקפם) |

### 5.3 הקוד

```ts
// lib/billing/proration.ts
export type PlanChangeQuote = {
  immediate: boolean; effectiveAt: Date; chargeNowAg: Agorot; creditsGrantedNow: number; newPriceAg: Agorot;
  newCycle: BillingCycle; downgradeImpacts: Array<{ limit: "seats" | "brand_kits" | "client_workspaces"; current: number; allowed: number }>;
  blockedReason: null | "past_due" | "same_plan" | "annual_disabled";
};
export async function quotePlanChange(sub: SubscriptionRow, to: { planId: PlanId; cycle: BillingCycle; when?: "now" | "period_end" }, now: Date): Promise<PlanChangeQuote>;
// DB/RPC boundary (part 04 §10.8): decimal-shekel strings, never a raw TS object in jsonb
export const quoteToDb = (q: PlanChangeQuote) => ({ charge_now_ils: fromAgorot(q.chargeNowAg), new_price_ils: fromAgorot(q.newPriceAg),
  credits_granted_now: q.creditsGrantedNow, effective_at: q.effectiveAt.toISOString(), new_cycle: q.newCycle });
// API boundary (part 04 §21.2 PlanChangeResponse keeps chargeNowIls / newPriceIls)
export const toApiPlanChange = (q: PlanChangeQuote) => ({ effectiveAt: q.effectiveAt.toISOString(), chargeNowIls: toIlsNumber(q.chargeNowAg),
  creditsGrantedNow: q.creditsGrantedNow, immediate: q.immediate, newCycle: q.newCycle, newPriceIls: toIlsNumber(q.newPriceAg),
  downgradeImpacts: q.downgradeImpacts });

// lib/billing/engine.ts
export async function changePlan(i: { workspaceId: string; actorId: string; planId: PlanId; cycle: BillingCycle; when?: "now" | "period_end"; requestKey: string }) {
  const now = clock.now();
  const sub = await loadLiveSubscription(billingWorkspaceId(i.workspaceId));      // active | past_due, for update
  const q = await quotePlanChange(sub, i, now);
  if (q.blockedReason) throw new ApiError("INVALID_INPUT", { reason: q.blockedReason });
  if (!q.immediate) return scheduleChange(sub, i, q);                     // scheduled_change + email plan_change_scheduled + audit billing.plan_change
  if (q.chargeNowAg > 0) {
    const pay = await insertPendingPayment({ kind: "plan_change", idempotencyKey: `plan_change:${sub.id}:${i.planId}:${i.requestKey}`,
                                             amountAg: q.chargeNowAg, quote: quoteToDb(q) });   // amount_ils = fromAgorot(amountAg); the DB-form quote is kept in provider_payload.quote for reconciliation
    const res = await provider.chargeToken({ tokenRef: decryptToken(sub.payment_method.token_enc), amountAg: q.chargeNowAg,
                                             description: `{{BRAND_NAME}} — שדרוג לתוכנית ${getPlan(i.planId).name_he}`, idempotencyKey: pay.idempotency_key });
    const final = res.ok === "unknown" ? await resolveUnknownCharge(pay) : res;    // getTransactionStatus, up to 3 polls in ~10 s
    if (final === "still_unknown") throw new ApiError("PROVIDER_UNAVAILABLE");    // row stays pending; the hourly reconcile applies it later
    if (final.ok !== true) return handlePlanChangeFailure(pay, final);           // PAYMENT_FAILED, nothing changes
    await rpc("billing_apply_plan_change", { p_subscription: sub.id, p_payment: pay.id, p_txn: final.providerTxnId, p_quote: quoteToDb(q), p_actor: i.actorId });
    await startWorkflow("invoicePayment", pay.id);
  } else {
    await rpc("billing_apply_plan_change", { p_subscription: sub.id, p_payment: null, p_txn: null, p_quote: quoteToDb(q), p_actor: i.actorId });
  }
}
```

- **התשובה ב-API:** `POST /api/billing/plan-change` מחזיר `toApiPlanChange(q)` (גם ב-`dryRun`), כך ש-`chargeNowIls` ו-`newPriceIls` הם שקלים עשרוניים (חלק 04 §21.2); בתוך המנוע הכול ב-`…Ag`.
- **`requestKey`** = הכותרת `Idempotency-Key` שהממשק שולח בכל אישור; בלעדיה — `sha256(subscriptionId, planId, cycle, when, current_period_start)`, כך שלחיצה כפולה לא מחייבת פעמיים.
- **תשובה עמומה בחיוב:** אחרי 3 שאילתות סטטוס בלי תשובה מפורשת, הלקוח מקבל ‏503 `PROVIDER_UNAVAILABLE`, ושורת `payments` נשארת `pending` עם ההצעה. הריצה הבאה של `billing-renewals` שואלת את הספק (שורות `pending` מעל 15 דקות, 4.2 צעד 1): הצלחה ← `billing_apply_plan_change` עם ההצעה השמורה וחשבונית; כישלון ← `failed`, ושום דבר לא משתנה.
- אחרי הצלחה: `audit_logs` ‏`billing.plan_change` ואירוע השרת `plan_changed {from_plan, to_plan, immediate}`.

`billing_apply_plan_change` (חתימה: חלק 04 §10.8): מעדכן `subscriptions.plan_id`, `price_ils` (המחיר הציבורי הנוכחי של התוכנית החדשה, נעול), `billing_cycle` (ובמעבר 3 "עכשיו": `anchor_at`, `current_period_start/end`, `next_charge_at`, `next_grant_at`), `workspaces.plan_id`, מנקה `scheduled_change`, מעניק `grant:plan_change:{paymentId}` (או `grant:plan:{subId}:{startISO}` במעבר 3), ובהורדת תוכנית קורא ל-`enforce_plan_limits(ws, p_actor)` ומחזיר את `demoted`.

### 5.4 החלת שנמוך מתוזמן (`applyScheduledChanges`)

רץ ב-cron **לפני** החיוב: לכל מנוי שה-`scheduled_change` שלו הגיע (`current_period_end <= now`), קורא ל-`billing_apply_plan_change(p_subscription, null, null, quoteToDb(quote), scheduled_change.requested_by)`, שמעדכן תוכנית, מחזור ו-`price_ils` (המחיר הציבורי הנוכחי של התוכנית החדשה), ובמעבר מחזור — `anchor_at = current_period_end`, ואז מפעיל את `enforce_plan_limits`. אחר כך החידוש הרגיל מחייב במחיר החדש. השפעות על המגבלות (נאכפות בזמן ריצה, לא במחיקה):

| מגבלה | מה קורה | איפה |
|---|---|---|
| `seats` | קודם מבוטלות הזמנות ממתינות לתפקידי `admin`/`editor` (החדשה קודם), ואם עדיין יש חריגה — החברים העודפים (המצטרפים האחרונים, לעולם לא הבעלים) עוברים לתפקיד `viewer`, שלא תופס מושב | פונקציית SQL ‏`enforce_plan_limits(p_ws)` (חלק 04 §9.5b) + `audit_logs` ‏`member.role_change` עם `metadata.reason = 'plan_downgrade'` |
| `brand_kits` | הערכה הדיפולטית + הוותיקות ביותר עד המגבלה זמינות; השאר נשמרות לקריאה ולא מוצעות לסרטונים חדשים | `lib/workspace/limits.ts` (`availableBrandKits()`) |
| `client_workspaces` | סביבות לקוח עוברות לקריאה בלבד (אין יצירה, יש צפייה והורדה); `generate` ו-`render` מחזירים ‏403 `PLAN_LIMIT {limit:"client_workspaces", reason:"client_workspace_read_only"}` | `canGenerate(ws)` ב-`lib/workspace/limits.ts`, נבדק ב-`generate` וב-`render` (חלק 04 §19.8) |
| `max_formats`, `quality_tiers`, `max_duration_sec` | חלים על יצירות חדשות; פרויקטים קיימים נשמרים | `estimate` ו-`generate` (חלק 05) |
| `white_label` | הסתרת המיתוג לא נשמרת בקישור: היא נקבעת בכל הצגה ובכל שליחה לפי `effective_white_label(ws)` (חלק 04 §9). שנמוך לתוכנית בלי White label (או כיבוי המתג) מחזיר מיד את המיתוג לקישורי שיתוף ואישור קיימים ולמיילי אישור שנשלחים מעכשיו, וחזרה לתוכנית עם White label מסתירה אותו שוב — כך המשפט של חלק 03, "חל על קישורים חדשים ועל קישורים קיימים", נכון | `resolveShareBranding(link)` ב-`lib/share/branding.ts`, שנקרא ב-`/v/[token]`, ב-`/approve/[token]` ובמיילי האישור (§12.1) |

### 5.5 קופי (משלים את `PlanChangeDialog` של חלק 03 §15.3)

- **מעבר מחודשי לשנתי** — בורר שני מצבים (RadioGroup בשם **"מתי לעבור?"**, ממופה ל-`when`):
  - **"מסוף החודש"** (`period_end`) — **"לא תחויבו עכשיו. ב-{periodEnd} יתבצע חיוב שנתי של ₪{annualTotal}, ומאז תקבלו {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}} בכל חודש."** (ברירת מחדל)
  - **"מעכשיו"** (`now`) — **"תחויבו עכשיו ב-₪{annualTotal} על שנה שמתחילה היום, ותקבלו מיד {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}. הקרדיטים שכבר קיבלתם החודש נשארים, אבל על הימים שנותרו בחודש הנוכחי אין החזר."**
  - כפתור: **"מעבר לשנתי"** / **"מעבר לשנתי · ₪{annualTotal}"**.
- **שדרוג שנתי** — **"תחויבו עכשיו ב-₪{chargeNow} על הזמן שנותר עד {periodEnd}, ותקבלו {credits, plural, one {קרדיט אחד נוסף} two {שני קרדיטים נוספים} other {# קרדיטים נוספים}} כבר החודש. מהחודש הבא תקבלו {newMonthlyCredits} קרדיטים בכל חודש."**
- **חיוב מתחת לסף** — **"השדרוג נכנס לתוקף מיד, בלי חיוב נוסף עד החידוש הבא."**
- **חסום ב-`past_due`** — **"אי אפשר לשנות תוכנית כשיש חיוב שלא עבר. עדכנו אמצעי תשלום, ואז נוכל לשנות."**

### קריטריוני קבלה
- [ ] כל שורות 5.2 עוברות בבדיקות יחידה עם שעון קבוע.
- [ ] שדרוג עם כרטיס שנדחה מחזיר `PAYMENT_FAILED`, ולא משנה תוכנית, מחיר או קרדיטים.
- [ ] `dryRun: true` מחזיר בדיוק את מה שהביצוע יעשה (אותו `chargeNowAg`, ובתשובה אותו `chargeNowIls`, אותם קרדיטים) — בדיקה שמשווה בין השניים.
- [ ] שנמוך מתוזמן מוחל לפני החידוש, והחידוש מחויב במחיר של התוכנית החדשה.
- [ ] אחרי שנמוך מעסק לבסיס עם 3 חברים: הבעלים נשאר, שני האחרונים שהצטרפו הופכים לצופים, ויש שורת `audit_logs` לכל אחד.

---

## §6. כשלי חיוב ו-dunning

### 6.1 לוח הזמנים

`D` = מועד החידוש המקורי (`next_charge_at` לפני הכישלון). הלוח נקבע ב-`app_settings.dunning_retry_days` (חלק 04 §16.4; ברירת מחדל `[1, 3, 7]`, לפי נספח F §10.6). כל כישלון שולח גם את אירוע השרת `subscription_payment_failed {attempt}` (‏`attempt` = 1–4).

| ניסיון | מתי | אם נכשל | מייל | באפליקציה |
|---|---|---|---|---|
| 0 | `D` | `status = past_due`, `past_due_since = D`, `retry_count = 1`, `next_charge_at = D + 1d` | `payment_failed` (וריאנט `first`) | התראת `payment_failed` + `PolicyBanner` לבעלים ולמנהלים |
| 1 | `D + 1d` | `retry_count = 2`, `next_charge_at = D + 3d` | `payment_failed` (`second`) | אותו באנר, עם התאריך הבא |
| 2 | `D + 3d` | `retry_count = 3`, `next_charge_at = D + 7d` | `payment_failed` (`last_warning`) | באנר אדום |
| 3 | `D + 7d` | `status = expired`, `workspaces.plan_id = 'free'` | `payment_failed` (`final`) | התראה: המנוי הסתיים |

- **בזמן `past_due`** החשבון ממשיך לעבוד עם מגבלות התוכנית ששולמה ועם הקרדיטים שכבר ביתרה (תקופת חסד של עד 7 ימים). **המכסה של התקופה החדשה לא מוענקת** עד שהחיוב עובר — ואז היא מוענקת מיד, לתקופה שמתחילה ב-`D`, עם התוקף הרגיל (סוף התקופה + חודש, 2.3), כך שאין "פרס" על איחור ואין קנס.
- **הצלחה בכל ניסיון** ← `billing_apply_renewal` כרגיל (התקופה נמדדת מ-`D`, לא מיום התשלום), `past_due_since = null`, מייל `payment_receipt`, הבאנר נעלם.
- **עדכון כרטיס** (`checkout {kind:"update_card"}`): עמוד התשלום של הספק שומר אסימון חדש **בלי לגבות כסף** — אימות כרטיס בלי סכום, ואם הספק לא תומך בזה, עסקת J5 (בדיקת מסגרת של ₪1 שלא נגבית). שתי האפשרויות נבדקות בספייק M0 (§8.2, נקודה 9) [M0-verify]; אם אף אחת מהן לא קיימת ב-Grow, זה חוסם באותה מידה כמו היכולות 4–7 שם. בעסקת J5 הדיאלוג מציג לפני ההפניה: **"כדי לאמת את הכרטיס, חברת האשראי תבצע בדיקת מסגרת של {verifyAmount}. הסכום לא ייגבה."**
- **עדכון כרטיס ב-`past_due`:** אחרי שה-webhook שמר את הכרטיס (4.1, סשן `update_card`), `handlePaymentEvent` מתחיל מיד את `retryPastDueNow(subscriptionId)`, שמבצע `chargeToken` אחד על התקופה שבחוב, עם אותו מפתח `renew:{subscriptionId}:{periodEndISO}` (כך שלא ייתכן חיוב כפול מול ניסיון חוזר של ה-cron); הצלחה ← `billing_apply_renewal`; כישלון ← לא מקדם את `retry_count`, הלוח הרגיל ממשיך (עכשיו עם הכרטיס החדש), והכרטיס נשאר שמור. דף החזרה מציג את התוצאה (חלק 03 §15.4).
- **סיבת הדחייה** ממופה לניסוח ידידותי (לא מציגים קודים של חברת האשראי):

| `ChargeResult.kind` | סיומת לשורת המייל (`reasonSuffix`) |
|---|---|
| `card_expired` | " כי תוקף הכרטיס פג" |
| `insufficient_funds`, `declined` | " כי חברת האשראי סירבה לחיוב" |
| `invalid_token` | " כי פרטי הכרטיס השמור כבר לא תקפים" |
| `provider_error` | "" (בלי סיבה; ונסמן לבדיקה) |

- `provider_error` (תקלה אצל הספק, לא סירוב) **לא נספר** כניסיון: הסטטוס לא משתנה (חידוש שנכשל כך נשאר `active`), `next_charge_at` מתקדם בשעה, ומנסים שוב עד 6 פעמים; רק אחר כך נכנסים ללוח הרגיל. ראו runbook R3.
- **כרטיס שעומד לפוג:** ה-cron `reminders` יוצר 14 יום לפני החיוב הבא התראה באפליקציה (סוג `system`): **"תוקף הכרטיס שמסתיים ב-{last4} יפוג לפני החיוב הבא ב-{date}. כדאי לעדכן אמצעי תשלום."**

### 6.2 `PolicyBanner` במצב `past_due` (לבעלים ולמנהלים, בכל דפי האפליקציה)

- וריאנט רגיל: **"החיוב על המנוי לא עבר. ננסה שוב ב-{nextRetry}. כדי שהמנוי לא יסתיים ב-{finalDate}, כדאי לעדכן אמצעי תשלום."** + כפתור **"עדכון אמצעי תשלום"**.
- ניסיון אחרון: **"זה הניסיון האחרון: אם החיוב ב-{finalDate} לא יעבור, המנוי יסתיים והחשבון יעבור לתוכנית החינמית."**
- עורכים וצופים לא רואים את הבאנר.

### קריטריוני קבלה
- [ ] סימולציית 4 כישלונות עם שעון מזויף: 4 מיילים בוריאנטים הנכונים, מעבר ל-`expired` ביום 7, `plan_id = 'free'`, קרדיטי חבילות נשארים.
- [ ] הצלחה בניסיון 2: התקופה החדשה מתחילה ב-`D` (לא ביום התשלום), והמכסה מוענקת פעם אחת.
- [ ] `provider_error` לא מקדם את `retry_count`.
- [ ] עדכון כרטיס ב-`past_due` שומר את האסימון החדש ומחייב מיד את התקופה שבחוב עם מפתח ה-`renew:` שלה; webhook כפול, או ריצת cron באותה שעה, לא מחייבים פעמיים.
- [ ] עדכון כרטיס שלא ב-`past_due` לא יוצר שורת `payments` ולא גובה כסף (ב-mock: אסימון חדש, `is_default = true`, הקודם עם `deleted_at`).

---

## §7. מניעת ניצול לרעה והונאה

### 7.1 קרדיטי ניסיון

| שכבה | מנגנון | תגובה |
|---|---|---|
| מייל מנורמל | `trial_claims.email_hash` (‏HMAC עם pepper; Gmail בלי נקודות ובלי `+tag`), חלק 04 §9.4 | `trial_status = 'already_claimed'` — בלי קרדיטים |
| דומיין זמני | `app_settings.disposable_email_domains` | `disposable_email` |
| טלפון (כשהדגל `phone_otp` פעיל) | `trial_claims.phone_hash` | כמו מייל |
| קצב לפי IP | בכניסה הראשונה (`ensureFirstLogin`): מונה Upstash `trial:ip:{ip}` (24 שעות) | מעל 3 — **סימון בלבד** (`abuse_reports` עם `source='system'`, `reason='other'`, `details='trial_velocity'`; חלק 04 §8), בלי שלילה אוטומטית: ברשתות סלולר בישראל משתמשים רבים חולקים IP (CGNAT) |
| ערך נמוך לניצול | התוכנית החינמית: סימן מים, 720p, טיוטה בלבד, קליפ AI אחד עד 5 שניות, תקרה יומית 70 | — |
| כלי אדמין | חסימת משתמש (`user.ban`) והסרת היתרה מדלי הניסיון (`POST /api/admin/credits/revoke-grant` ← `revoke_grant_remaining`) | נרשם ב-`audit_logs` (`user.ban`, ‏`credits.revoke`) |

### 7.2 תשלומים

| סיכון | בקרה |
|---|---|
| בדיקת כרטיסים גנובים בעמוד התשלום | מגבלת `billing` (‏10/שעה לסביבה, חלק 04 §18.6) + מגבלה ★ `checkout_ip` של 20/שעה ל-IP; **3 תשלומים שנכשלו בשעה בסביבה אחת ← חסימת קופה ל-24 שעות** (מונה Upstash `checkout:fail:{ws}`; ‏403 `FORBIDDEN {reason:"checkout_temporarily_blocked"}`), קופי: **"זיהינו כמה ניסיונות תשלום שנכשלו, ולכן הקופה נעולה זמנית ל-24 שעות. אם זו טעות, כתבו לנו ל-billing@{{DOMAIN}}."** |
| 3D Secure | מופעל בעמוד התשלום של Grow לפי ברירת המחדל שלהם [M0-verify] |
| רכישות חבילה חריגות | יותר מ-6 חבילות ב-24 שעות לסביבה ← ‏429 `RATE_LIMITED {scope:"topup_daily"}` + התראת אדמין (סוכנות אמיתית תפנה אלינו ונעלה את המגבלה ידנית) |
| חיוב חוזר שנוי במחלוקת (chargeback) | כשמגיעה הודעה מהספק (webhook מסוג `chargeback` אם קיים [M0-verify]) או בסימון ידני באדמין (`POST /api/admin/billing/payments/[id]/chargeback`, ‏audit `payment.chargeback`, חלק 04 §24.1): `payments.status = 'refunded'`, `failure_reason = 'chargeback'`; `revoke_grant_remaining` לכל דלי שנוצר מהתשלום (מפתח `revoke:chargeback:{paymentId}:{grantId}`); סגירה מיידית של המנוי (`status = 'canceled'`, ‏`current_period_end = now()`, תוכנית חינמית); התראת אדמין. האדמין מחליט אם לחסום (`user.ban`) |
| ניצול חוזר של ביטול 14 יום | זכות חוקית — לא חוסמים. ההחזר ממילא מנכה את שווי הקרדיטים שנוצלו. סביבה עם 3 החזרים או יותר ב-6 חודשים מסומנת לבדיקה ידנית ⚖️ |
| גניבת אסימון | האסימון מוצפן (§15.5), לא נשלח לדפדפן, לא נרשם בלוגים, וחיוב לפי אסימון קורה רק בשרת מתוך המנוע |

### 7.3 שימוש לרעה ביצירה

ניהול תוכן (§15.9), תקרות יומיות, מגבלת מקביליות, מגן התקציב הגלובלי (חלק 05 §7.3), ודיווחים ציבוריים מעמודי השיתוף (`abuse_reports`, חלק 03 §22.19).

### קריטריוני קבלה
- [ ] הרשמה שנייה עם `Name.Surname+x@gmail.com` אחרי `namesurname@gmail.com` לא מקבלת קרדיטים.
- [ ] 3 תשלומי mock שנכשלו בשעה חוסמים את הקופה של הסביבה ל-24 שעות, עם הקופי הנכון.
- [ ] סימון chargeback באדמין מסיר את הקרדיטים שנותרו מהתשלום, סוגר את המנוי ונרשם ב-`audit_logs` עם הפעולה `payment.chargeback`; סימון שני של אותו תשלום לא מסיר שוב (מפתחות `revoke:chargeback:`).

---

## §8. ממשק `PaymentProvider`, מתאם Grow ו-mock

### 8.1 הטיפוסים

החתימות של נספח F (§10.7) נשמרות, והתוספות (★) תואמות-אחורה. הממשקים שכאן הם הקנוניים וגוברים על נספח F.

```ts
// lib/billing/types.ts
export type BillingCustomer = {
  name: string; email: string; phone?: string | null;
  vatId?: string | null; isBusiness: boolean;
  address?: string | null; city?: string | null; zip?: string | null;
};
export type CardMeta = { brand: "visa" | "mastercard" | "isracard" | "amex" | "diners" | "other"; last4: string; expMonth: number; expYear: number; holderName?: string | null };

export type ChargeResult =
  | { ok: true; providerTxnId: string; approvalCode?: string | null; raw: unknown }
  | { ok: false; kind: "declined" | "card_expired" | "insufficient_funds" | "invalid_token" | "provider_error"; retryable: boolean; providerMessage?: string; raw: unknown }
  | { ok: "unknown"; raw: unknown };                       // timeout / 5xx without a definite answer → getTransactionStatus()

export type RefundResult = { ok: true; providerRefundId: string; raw: unknown } | { ok: false; providerMessage?: string; raw: unknown };

export type VerifiedPaymentEvent = {
  eventType: "payment.succeeded" | "payment.failed" | "payment.canceled" | "refund.succeeded" | "chargeback";
  externalId: string;                  // stable per event: `${providerTxnId ?? providerSessionRef}:${eventType}`
  sessionRef: string | null;           // our checkout_sessions.id, echoed back via a custom field
  providerSessionRef: string | null;
  providerTxnId: string | null;
  amountAg: Agorot | null;             // the gateway's decimal sum → toAgorot() inside the adapter
  installments: number;
  method: "card" | "bit" | "apple_pay" | "google_pay" | "other";
  card: CardMeta | null;
  tokenRef: string | null;             // plaintext gateway token: encrypt immediately, never log, never persist raw
  failureMessage: string | null;
  raw: unknown;                        // redacted (no token, no PAN fragments beyond last4) → payments.provider_payload
};

// money in = Agorot (…Ag): a plain number (shekels) is not assignable to the brand. Each adapter converts to its own wire
// format (Grow: fromAgorot(amountAg) → "98.17").
export interface PaymentProvider {
  readonly name: "grow" | "mock";
  createHostedCheckout(i: { sessionId: string; amountAg: Agorot; description: string; customer: BillingCustomer; saveToken: boolean;
    successUrl: string; cancelUrl: string; webhookUrl: string; methods?: Array<"card" | "bit"> }): Promise<{ redirectUrl: string; providerSessionRef: string }>;
  chargeToken(i: { tokenRef: string; amountAg: Agorot; description: string; idempotencyKey: string; customer?: BillingCustomer }): Promise<ChargeResult>;
  refund(i: { providerTxnId: string; amountAg: Agorot; reason: string; idempotencyKey?: string }): Promise<RefundResult>;
  parseWebhook(rawBody: string, headers: Headers, url?: URL): Promise<VerifiedPaymentEvent>;   // ★ url: for the ?k=&s= token (part 04 §22.4 passes new URL(req.url))
  getTransactionStatus(i: { providerSessionRef?: string; providerTxnId?: string; idempotencyKey?: string }): Promise<VerifiedPaymentEvent | null>;   // ★
  deleteToken?(tokenRef: string): Promise<void>;                                                // ★ optional; used on account deletion
}
```

`lib/billing/providers.ts` בוחר מימוש לפי `PAYMENT_PROVIDER`. `lib/env.ts` אוסר `mock` כש-`APP_ENV=production` (האפליקציה לא עולה).

### 8.2 מתאם Grow (`lib/billing/grow.ts`) — מה לבנות ומה לאמת

Grow (לשעבר משולם) מתעד במרכז המפתחים הרשמי שלו חיוב לפי אסימון, מנויים מנוהלים ו-webhooks לכל תוצאת תשלום. **שמות הנקודות, השדות והקידוד לא אומתו מול התיעוד במסגרת המחקר.** הטבלה הבאה היא נקודת פתיחה לפי ה-API ההיסטורי של משולם ("Light Server"); כל שורה מסומנת [M0-verify], והתוצאה נרשמת ב-`DECISIONS.md` לפני שבונים עליה.

| פעולה בממשק | קריאה מועמדת ב-Grow [M0-verify] | פרמטרים עיקריים | מה לוקחים מהתשובה |
|---|---|---|---|
| `createHostedCheckout` | `POST {GROW_API_BASE_URL}/createPaymentProcess` (form-data) | `userId`, `pageCode`, אימות (`apiKey`), `sum` (= `fromAgorot(amountAg)`, למשל `"98.17"`), `paymentNum=1`, `description`, `successUrl`, `cancelUrl`, `notifyUrl` (ב-preview וב-staging עם פרמטר ה-bypass, §19.1), `pageField[fullName]`, `pageField[email]`, `pageField[phone]`, `cField1=sessionId`, `cField2=workspaceId`, דגל שמירת אסימון | `data.url` (הפניה), `data.processId`, `data.processToken` → `provider_session_ref` |
| `parseWebhook` | notify (POST) שמגיע ל-`notifyUrl` | `data.transactionId`, `data.processId`, `data.sum` (← `toAgorot` ← `amountAg`), `data.cardSuffix`, `data.cardBrand`, `data.cardExp`, `data.customFields.cField1`, אסימון הכרטיס | **לא סומכים על התוכן.** מאמתים `?k=` ושואלים את Grow מחדש (שורה הבאה) |
| (אימות ואישור) | `getPaymentProcessInfo` / `getTransactionInfo`, ו-`approveTransaction` אם Grow דורש אישור סופי אחרי notify | `processId`, `processToken` / `transactionId` | סטטוס, סכום, מזהה עסקה, אסימון — מקור האמת |
| `chargeToken` | נקודת "חיוב לפי אסימון" של Grow (token billing) | אסימון, `sum` (= `fromAgorot(amountAg)`), תיאור, מזהה ההזמנה שלנו (`idempotencyKey`) בשדה מותאם | `transactionId` או קוד דחייה |
| `refund` | `refundTransaction` | `transactionId`, `refundSum` (= `fromAgorot(amountAg)`; תומך בהחזר חלקי) | מזהה ההחזר |
| `getTransactionStatus` | שאילתה לפי `processId` / `transactionId`, ואם אפשר לפי השדה המותאם שלנו | — | אירוע מנורמל או `null` |
| Bit | עמוד תשלום נפרד (`GROW_PAGE_CODE_BIT` ★) או פרמטר אמצעי תשלום | — | רק בחבילות (בלי אסימון), ורק כש-`GROW_PAGE_CODE_BIT` מוגדר; אחרת `bitEnabled = false` והאתר מציג את גרסאות "כרטיס בלבד" (3.1) |
| אימות כרטיס (`update_card`) | עמוד שמירת כרטיס בלי סכום, או עסקת J5 (בדיקת מסגרת של ₪1 שלא נגבית) | `saveToken`, סכום 0 או J5 | אסימון + פרטי כרטיס, בלי `transactionId` נגבה (6.1) |

**כללי המתאם:**
1. **כתובת ה-notify** כוללת סוד: `${SITE_URL}/api/webhooks/payments/grow?k=${hmacSign(secrets[0], sessionId)}&s=${sessionId}`, כש-`secrets` הוא `GROW_WEBHOOK_SECRET` מפוצל לפי פסיקים (רוטציה: R12). האימות ב-`hmacVerifyAny(secrets, sessionId, k)` (‏`timingSafeEqual` מול כל ערך, §15.5). אם Grow שולח גם חתימה בכותרת [M0-verify] — מאמתים גם אותה. ב-`preview` וב-`staging` נוסף לכתובת גם `&x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}` (§19.1), כדי שה-notify יעבור את Vercel Authentication; בפרודקשן — לעולם לא.
2. **מקור האמת הוא השאילתה החוזרת**, לא גוף ה-notify: סכום, סטטוס ומזהה עסקה נלקחים מהתשובה של Grow לשאילתה. אי־התאמה בין השניים ← `WEBHOOK_INVALID_SIGNATURE` ושורת `webhook_events` עם `signature_valid=false`.
3. **אימות כפול של סכום:** סכום שאושר (`ev.amountAg`) ≠ `toAgorot(checkout_sessions.amount_ils)` ← לא מעניקים (4.1; בתוך ה-SQL ההשוואה היא על `p_amount_ils = fromAgorot(ev.amountAg)`).
4. **אסימון הכרטיס** מוצפן מיד (`encryptToken`) ולעולם לא נכתב ל-`provider_payload`, ללוג או ל-Sentry. `redactGrowPayload()` מסיר `cardToken`, `token`, ושדות כרטיס מלבד ארבע ספרות אחרונות ותוקף.
5. **זמני תגובה:** timeout של 15 שניות ליצירת עמוד ולחיוב; `ok: "unknown"` על timeout או 5xx בחיוב; לעולם לא ניסיון חוזר עיוור.
6. **שגיאות:** קודי דחייה ממופים ל-`ChargeResult.kind` בטבלה `GROW_DECLINE_MAP` שנבנית בספייק M0 מתוך תשובות אמיתיות של ה-sandbox.
7. **עמוד התשלום** מוגדר בלוח הבקרה של Grow בעברית, עם הלוגו שלנו, ופתוח בהפניה מלאה (לא iframe) — כך Bit, Apple Pay ו-Google Pay עובדים גם במובייל. תשלומים (installments) כבויים בהשקה (`paymentNum=1`); בתשלומים במנוי שנתי מטפלים ב-v2.
8. **קידוד:** בקשות כ-`multipart/form-data` או `application/x-www-form-urlencoded`, לפי מה שהספייק יאשר; תשובות JSON. כל הקריאות דרך `growFetch()` אחד שרושם `requestId`, משך וסטטוס, בלי גוף.

**ספייק M0 (`scripts/spikes/grow.ts`) חייב לאמת ולתעד:** (1) יצירת עמוד והפניה; (2) מבנה ה-notify, ואם יש חתימה; (3) האם צריך `approveTransaction`; (4) קבלת אסימון ושמירתו; (5) חיוב לפי אסימון והתשובה בסירוב (לפחות 3 קודים); (6) החזר מלא וחלקי; (7) שאילתת סטטוס לפי המזהים שלנו; (8) Bit בעמוד התשלום; (9) אימות כרטיס בלי סכום, ואם אין — עסקת J5 של ₪1 שלא נגבית; (10) התנהגות כשה-notify לא נענה ב-200 (כמה ניסיונות חוזרים, באיזה מרווח). אם אחת מהיכולות 4–7 או 9 לא קיימת ב-Grow — עוצרים, מתעדים, ובוחרים מתאם חלופי (Cardcom / Sumit / PayPlus) לפי נספח F §10.7. שאר הקוד לא משתנה.

### 8.3 מתאם mock (`lib/billing/mock.ts`)

מימוש מלא שמתנהג כמו ספק אמיתי, לפיתוח, ל-preview ולבדיקות e2e:

- `createHostedCheckout` מחזיר `redirectUrl = ${SITE_URL}/dev/mock-gateway/${sessionId}`. הדף (`app/(dev)/dev/mock-gateway/[sessionId]/page.tsx`) ו-`/dev/mock-invoice/[n].pdf` (9.6) קיימים רק כש-`APP_ENV !== "production"` (והדף של הקופה — רק כש-`PAYMENT_PROVIDER=mock`): בפרודקשן `proxy.ts` מחזיר 404 לכל `/dev/*` (חלק 04 §17.2), ובנוסף שומר בזמן בנייה בתוך הדף מחזיר `notFound()`. הדפים ב-`noindex`, ו-`robots.txt` חוסם `/dev`.
- **נוסח הדף:** כותרת **"עמוד תשלום לבדיקות"** · תיבת אזהרה: **"זו סביבת פיתוח. לא יבוצע חיוב אמיתי, ושום פרט לא נשלח לחברת אשראי."** · שורת הסכום: **"לתשלום: ₪{amount} · {description}"** · בחירת תרחיש (Radio):

| תרחיש | כרטיס בדיקה | תוצאה |
|---|---|---|
| **"תשלום מצליח"** | `4580 0000 0000 0000` | `payment.succeeded`, אסימון `mock_tok_ok_{rand}` |
| **"כרטיס נדחה"** | `4000 0000 0000 0002` | `payment.failed` ("declined") |
| **"תוקף הכרטיס פג"** | `4000 0000 0000 0069` | `payment.failed` ("card_expired") |
| **"Bit (הדמיה)"** (רק בחבילות) | — | `payment.succeeded`, `method: "bit"`, בלי אסימון |
| **"שמירת כרטיס בלבד"** (רק ב-`update_card`) | `4580 0000 0000 0000` | אסימון חדש בלי חיוב |
| **"תשובה מאוחרת"** | `4580 0000 0000 0010` | הצלחה אחרי 20 שניות (בודק את מצב "מאשרים…" בדף החזרה) |

  כפתורים: **"לתשלום"** · **"ביטול וחזרה"** (ל-`cancelUrl`).
- אחרי "לתשלום": השרת שולח POST חתום ל-`/api/webhooks/payments/mock` (HMAC-SHA256 עם מפתח שנגזר ב-HKDF מ-`APP_ENCRYPTION_KEY`, info `"mock-gateway"`), בעיכוב אקראי של 0–3 שניות, ומפנה את הדפדפן ל-`successUrl`. כפתורים לבדיקות (מוצגים רק כש-`APP_ENV` הוא `local` או `test`): **"שליחת ה-webhook פעמיים"** ו-**"בלי webhook"** (בודק את `reconcilePendingCheckouts`, 8.4).
- `chargeToken` דטרמיניסטי לפי סיומת האסימון: `_ok` ← הצלחה; `_decline` ← `declined`; `_nofunds` ← `insufficient_funds`; `_expired` ← `card_expired`; `_timeout` ← `ok: "unknown"` (ואז `getTransactionStatus` מחזיר הצלחה); `_flaky` ← `provider_error` פעמיים ואז הצלחה.
- `refund` תמיד מצליח (חוץ מ-`providerTxnId` שמתחיל ב-`mock_refund_fail`).
- כל קריאה נרשמת במערך בזיכרון שהמודול מייצא (`mockGatewayLog`), כדי שבדיקות יחידה וחוזה יוכלו לבדוק מה נשלח. בדיקות e2e בודקות את התוצאה במסד (`payments`, ‏`webhook_events`, ‏`checkout_sessions`), כי הזיכרון לא משותף בין תהליכים.

### 8.4 התאמה תקופתית (`reconcilePendingCheckouts`)

webhook שהלך לאיבוד לא אמור להשאיר לקוח ששילם בלי קרדיטים. בכל ריצה של `billing-renewals`: סשנים בסטטוס `created` בגיל 10 דקות עד 48 שעות ← `provider.getTransactionStatus({ providerSessionRef })` ← אם הספק מאשר הצלחה, מריצים את אותו `handlePaymentEvent` (אידמפוטנטי). סשנים מעל 48 שעות בלי תשלום ← `expired`. כל התאמה שמצאה תשלום שלא דווח נרשמת בלוג (`log.warn("billing reconcile found an unreported payment", {...})`; זו לא פעולת ביקורת) ומעלה מונה שמופיע ב-`/admin/billing` (אם המונה גדל, ה-webhook שבור — R3).

### קריטריוני קבלה
- [ ] ספייק Grow הסתיים, ו-`DECISIONS.md` מתעד את 10 הנקודות של 8.2 עם בקשות ותשובות לדוגמה (מושחרות).
- [ ] `PAYMENT_PROVIDER=mock` עם `APP_ENV=production` נכשל בעליית האפליקציה (`lib/env.ts`), ו-`/dev/mock-gateway/*` ו-`/dev/mock-invoice/*` מחזירים 404 בפרודקשן.
- [ ] notify של Grow עם `?k=` שגוי ← 401; עם `?k=` נכון אבל סכום ששונה בגוף ← לא מעניק (כי השאילתה החוזרת קובעת).
- [ ] אף לוג, אירוע Sentry או `provider_payload` לא מכיל אסימון כרטיס (בדיקת יחידה על `redactGrowPayload` + חיפוש בלוגים של e2e).
- [ ] webhook שנחסם בכוונה (ב-mock) מושלם על ידי `reconcilePendingCheckouts` בריצה הבאה, בלי הענקה כפולה.

---

## §9. מע״מ, חשבוניות, `InvoiceProvider` ומתאם Morning

### 9.1 הממשק

```ts
// lib/invoicing/types.ts
export type InvoiceLine = { descriptionHe: string; quantity: number; unitPriceGrossAg: Agorot };   // gross per unit, incl. VAT
export type PaymentRecord = {
  id: string; kind: PaymentKind; amountAg: Agorot; netAg: Agorot; vatAg: Agorot; vatRate: number; paidAt: Date;   // toAgorot(payments.*_ils)
  method: "card" | "bit" | "apple_pay" | "google_pay" | "other"; card: { brand: string; last4: string } | null;
  installments: number; providerTxnId: string;
};
export interface InvoiceProvider {
  readonly name: "morning" | "mock";
  // amounts arrive as Agorot (…Ag); the Morning adapter sends fromAgorot(…) as income[].price / payment[].price
  issue(i: { doc: "tax_invoice_receipt" | "credit_invoice"; payment: PaymentRecord; customer: BillingCustomer; lines: InvoiceLine[];
             vatRate: number; requestAllocationNumber: boolean;
             linkedProviderDocId?: string | null;    // ★ credit_invoice → the original document
             reference: string }):                    // ★ "invoice:{paymentId}:{docType}" — written to the document's internal remarks, used to find it after a timeout
    Promise<{ docNumber: string; allocationNumber: string | null; pdfUrl: string; providerDocId: string }>;
  findByReference?(reference: string): Promise<{ docNumber: string; allocationNumber: string | null; pdfUrl: string; providerDocId: string } | null>;   // ★
  getDocument?(providerDocId: string): Promise<{ allocationNumber: string | null; pdfUrl: string }>;                                                    // ★
}
```

### 9.2 איזה מסמך, מתי

| אירוע | מסמך (`invoice_doc_type`) | הערות |
|---|---|---|
| כל תשלום מוצלח (מנוי, חידוש, שדרוג, חבילה) | `tax_invoice_receipt` (חשבונית מס-קבלה) | תמיד: העסק הוא עוסק מורשה או חברה |
| החזר כספי | `credit_invoice` (חשבונית זיכוי) מקושרת למסמך המקורי | על סכום ההחזר בלבד |
| תשלום של 0 (חיוב יחסי מתחת לסף) | אין מסמך | אין תשלום |

**עוסק פטור לא נתמך:** האתר, הקופה ותנאי השימוש מבטיחים חשבונית מס על כל תשלום ומחירים כולל מע״מ, ולכן אין מצב שמפיק `receipt` (קבלה בלבד). ערך ה-enum `receipt` שמור ולא מונפק. מעבר לעוסק פטור מחייב החלטת מוצר ⚖️ (רו״ח + עו״ד צרכנות) ושינוי של כל הנוסחים האלה.

**עיתוי:** המסמך מופק מיד אחרי שהתשלום אושר (workflow `invoicePayment`, יעד: פחות מ-2 דקות), ונשלח במייל `payment_receipt` עם PDF מצורף. המסמך הוא גם **אישור העסקה בכתב** שחוק הגנת הצרכן דורש בעסקת מכר מרחוק (§10.1), ולכן המייל שמלווה אותו כולל את פרטי העסק, השירות, המחיר, תנאי החיוב ותנאי הביטול (§12.5).

### 9.3 שורות המסמך (עברית, `lib/invoicing/lines.ts`)

| `payment_kind` | `descriptionHe` |
|---|---|
| `subscription_initial` / `subscription_renewal` (חודשי) | **"מנוי {{BRAND_NAME}} — תוכנית {planName}, חודשי, {periodStart}–{periodEnd} ({credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}})"** |
| אותו דבר (שנתי) | **"מנוי {{BRAND_NAME}} — תוכנית {planName}, שנתי, {periodStart}–{periodEnd} ({credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}} בכל חודש)"** |
| `plan_change` | **"שדרוג מנוי {{BRAND_NAME}} לתוכנית {planName} — חיוב יחסי ל-{periodStart}–{periodEnd} ({credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}})"** |
| `topup` | **"חבילת {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}} ל{{BRAND_NAME}}"** |
| `credit_invoice` | **"זיכוי בגין ביטול עסקה — {originalDescription}"** |

תאריכים בפורמט `dd.MM.yyyy`. שורה אחת לכל מסמך, כמות 1. שם הלקוח, מספר עוסק/ח״פ/ת״ז, מייל וכתובת — מ-`billing_profiles` **ברגע התשלום** (תמונת מצב נשמרת ב-`invoices.customer`; שינוי מאוחר בפרטים לא משנה מסמך שהופק, כפי שחלק 03 §15.1 מבטיח). בלי `billing_profiles` מלא אי אפשר להגיע לקופה (חלק 04 §21.2).

### 9.4 מספרי הקצאה (חשבוניות ישראל)

- **מתי:** חשבונית מס ללקוח עסקי (`is_business = true` עם `vat_id`), כשהסכום **לפני מע״מ** מגיע לסף שתקף ביום ההפקה או עובר אותו (בקשה בסכום שבדיוק על הסף לא מזיקה, ולכן הבדיקה היא `>=`). הסף נקרא מ-`app_settings.allocation_threshold_schedule` (חלק 04 §16.4):

```json
[{ "from": "2026-01-01", "ils": 10000 }, { "from": "2026-06-01", "ils": 5000 }]
```

- **היום (מ-2026-06-01): ₪5,000 לפני מע״מ.** בתוכניות שלנו זה פוגע בעיקר ב**סוכנות שנתי** (₪9,504 כולל מע״מ = ₪8,054.24 לפני מע״מ). עסק שנתי (₪2,349.15 לפני מע״מ) ושדרוגים יחסיים בדרך כלל מתחת לסף — אבל ההחלטה תמיד מחושבת, לא מקודדת לפי תוכנית.
- **איך:** `requestAllocationNumber = customer.isBusiness && !!customer.vatId && net >= thresholdAt(issueDate)`. Morning מבקשת את המספר מרשות המסים (שע״ם) אוטומטית מעל הסף [M0-verify: האם יש פרמטר מפורש, והיכן המספר מופיע בתשובה או ב-webhook]. המספר נשמר ב-`invoices.allocation_number` ומופיע בחשבונית, במייל וב-`InvoiceList`.
- **כשל בקבלת מספר** (למשל מספר העוסק של הלקוח לא מוכר ברשות): המסמך מופק בלי המספר; התראת אדמין; מייל ללקוח מתוך תבנית `invoice_ready` עם בלוק **"לא קיבלנו עדיין מספר הקצאה מרשות המסים לחשבונית הזו. כדאי לוודא שמספר העוסק בפרטי החיוב נכון; נעדכן ונשלח חשבונית מעודכנת כשהמספר יתקבל."** ⚖️ רו״ח: נוהל בקשה בדיעבד.

### 9.5 הפקה, ניסיונות חוזרים וכשלים (`lib/invoicing/issue.ts`)

```ts
// workflow: invoicePayment(paymentId) — "use workflow"
export async function invoicePayment(paymentId: string) {
  "use workflow";
  const ctx = await step(loadInvoiceContext, paymentId);            // payment, customer snapshot, lines, doc type, threshold
  if (ctx.existingInvoiceId) return ctx.existingInvoiceId;          // idempotent
  const doc = await step(issueWithLookup, ctx);                     // retries 1m, 5m, 15m, 1h, 6h (RetryableError)
  const invoiceId = await step(saveInvoiceRow, ctx, doc);           // invoices row, unique (provider, provider_doc_id)
  await step(copyPdfToStorage, invoiceId, doc.pdfUrl);              // invoices/{ws}/{invoice_id}.pdf, content-type check application/pdf, ≤ 10 MB
  await step(sendReceiptEmail, paymentId, invoiceId);               // payment_receipt (PDF attached) → payments.confirmation_sent_at;
                                                                    // if the invoicePending receipt already went out → invoice_ready instead
                                                                    // refund rows: refund_processed with the credit invoice (§10.6)
  return invoiceId;
}
async function issueWithLookup(ctx: InvoiceContext) {
  "use step";
  const found = await invoices.findByReference?.(ctx.reference);    // after an ambiguous timeout never issue twice
  if (found) return found;
  return invoices.issue({ ...ctx.issueInput, reference: ctx.reference });
}
```

- **30 דקות בלי חשבונית:** בדיקת ההתראות (§16.4, "תשלום בלי חשבונית") שולחת ללקוח את `payment_receipt` בוריאנט `invoicePending` (§12.5) עם אותו מפתח `payment_receipt:{paymentId}`, ומעדכנת `payments.confirmation_sent_at` (זה מסמך הגילוי, §10.1). כשהמסמך מופק בהמשך, הצעד האחרון של ה-workflow רואה שהקבלה כבר נשלחה ושולח במקומה את `invoice_ready` עם ה-PDF.
- **אחרי 5 כישלונות:** התשלום מופיע ב-`/admin/billing` תחת **"תשלומים בלי חשבונית"** (חלק 03 §22.15) ונשלחת התראת אדמין. מסמך שהופק ידנית בממשק של Morning משויך דרך **"צירוף חשבונית שהופקה ידנית"** (`POST /api/admin/billing/payments/[id]/invoice`, ‏multipart: ‏PDF, ‏`docNumber`, ‏`allocationNumber?`, ‏`docType`; חלק 04 §24.1): שורת `invoices` עם `provider = 'manual'`, ‏`provider_doc_id = 'manual:{docNumber}'`, ה-PDF ב-`invoices/{ws}/{invoiceId}.pdf`, ‏audit `invoice.attach` ומייל `invoice_ready`. ה-PDF עולה בגוף הבקשה, ולכן הוא מוגבל ל-4MB (מגבלת הגוף של Vercel היא 4.5MB, §19.6): מעל 4MB ← ‏400 `INVALID_INPUT` ‏`{ reason: "too_large" }`, והממשק חוסם קובץ כזה עוד לפני השליחה (חלק 04 §18.1, §24.1; חלק 03 §22.15). חשבוניות של Morning קטנות בהרבה. Runbook R5.
- **סכומים:** אנחנו מחשבים נטו ומע״מ (`splitGross`) ושולחים ל-Morning את המחיר הכולל עם סימון "כולל מע״מ" [M0-verify שם השדה: `vatType` ברמת השורה/המסמך]. אחרי ההפקה משווים את סכומי המסמך לשלנו; פער של יותר מאגורה אחת ← התראה ותיקון ידני (לא מפיקים מסמך שני אוטומטית).

### 9.6 מתאם Morning (`lib/invoicing/morning.ts`) — מה לבנות ומה לאמת

ה-API של Morning (לשעבר חשבונית ירוקה) הוא REST עם JWT. הפרטים הבאים מבוססים על מקורות משניים ומסומנים [M0-verify]:

| נושא | הנחת עבודה [M0-verify] |
|---|---|
| כתובות בסיס | ייצור `https://api.greeninvoice.co.il/api/v1`; sandbox נפרד — שניהם דרך `MORNING_API_BASE_URL`, לא בקוד. כל הנתיבים בטבלה יחסיים לכתובת הזו |
| אימות | `POST ${MORNING_API_BASE_URL}/account/token` עם `{ id: MORNING_API_KEY_ID, secret: MORNING_API_KEY_SECRET }` ← `{ token, expires }`; מטמון בזיכרון עד דקה לפני התפוגה; `Authorization: Bearer` |
| הפקת מסמך | `POST ${MORNING_API_BASE_URL}/documents` עם `type`, `lang: "he"`, `currency: "ILS"`, `client { name, taxId, emails, address, city, zip, country: "IL", add: false }`, `income [{ description, quantity, price, currency, vatType }]`, `payment [{ type, price, date, cardType, cardNum, dealType, numPayments }]`, `remarks` (המפתח שלנו), ולזיכוי — `linkedDocumentIds` |
| קודי סוג מסמך | 320 = חשבונית מס-קבלה · 330 = חשבונית זיכוי (305 = חשבונית מס ו-400 = קבלה — לא בשימוש) |
| אמצעי תשלום במסמך | 3 = כרטיס אשראי (עם `cardType` ו-4 ספרות); Bit — קוד "אפליקציית תשלום" או "אחר" לפי מה שהספייק יראה |
| תשובה | `{ id, number, url: { he, origin } }` ← `providerDocId`, `docNumber`, `pdfUrl` |
| שליחת מייל של Morning ללקוח | **כבויה** — המייל שלנו מצרף את ה-PDF (מונע כפילות) |
| Webhooks | אם קיימים — מעדכנים מספר הקצאה ו-PDF (`/api/webhooks/invoices/morning`, חלק 04 §22.5), עם אימות בשאילתה חוזרת |

`lib/invoicing/mock.ts`: מחזיר `docNumber = "MOCK-{yyyy}-{seq:5}"`, מספר הקצאה דמה (`"MOCK-ALLOC-{seq}"`) רק כשהתבקש, ו-`pdfUrl` לקובץ `tests/fixtures/invoices/sample-he.pdf` (חשבונית לדוגמה בעברית שמוגשת מ-`/dev/mock-invoice/[n].pdf` בסביבות שאינן פרודקשן). מצבי כשל לבדיקות: `customer.name` שמתחיל ב-`"כשל"` ← שגיאה זמנית פעמיים ואז הצלחה.

**ספייק M0 (`scripts/spikes/morning.ts`) מאמת:** אימות וקבלת טוקן; הפקת 320 עם מחיר כולל מע״מ והשוואת הסכומים; הפקת 330 מקושרת; מספר הקצאה ב-sandbox (לקוח עסקי, נטו מעל ₪5,000); חיפוש מסמך לפי `remarks`; כתובת PDF והאם היא דורשת אימות; webhooks; ביטול שליחת המייל של Morning.

### 9.7 שינוי שיעור המע״מ

המחירים לצרכן כוללים מע״מ, ולכן שינוי בשיעור הוא החלטה עסקית ומשפטית ולא רק טכנית ⚖️. מדיניות ברירת המחדל (ממומשת ב-`scripts/vat-change.ts`, ראו runbook R10): **המחיר לפני מע״מ לא משתנה, והמחיר הכולל מתעדכן לפי השיעור החדש**, מעוגל לשקל שלם, החל מהחיוב הראשון שאחרי תאריך התחולה; מנויים פעילים מקבלים מייל `price_change_notice` לפחות 7 ימים לפני החיוב הראשון במחיר החדש (ומיד, אם השינוי הוכרז בפחות זמן מזה). `vat_rate_next` נקבע מראש, כך שחיובים אחרי התאריך מחושבים נכון גם לפני שהמחירים עודכנו.

### 9.8 מחוץ לתחום בהשקה

לקוחות מחוץ לישראל (ייצוא שירותים בשיעור אפס) — כולם מטופלים כלקוחות ישראלים; נרשם ב-`DECISIONS.md`. מע״מ על שירותים מיובאים (OpenRouter וספקים בדולרים) — טיפול חשבונאי של רו״ח, לא בקוד.

### קריטריוני קבלה
- [ ] תשלום ב-sandbox של Morning מפיק חשבונית מס-קבלה עם מע״מ 18% שסכומיה זהים ל-`splitGross` עד האגורה.
- [ ] רכישת סוכנות שנתי ללקוח עסקי עם מספר עוסק מבקשת מספר הקצאה; אותה רכישה ללקוח פרטי — לא.
- [ ] שינוי `allocation_threshold_schedule` בבדיקה (תאריך הפקה 2026-03-01, נטו ₪8,054) לא מבקש מספר (סף ₪10,000 אז), ובתאריך 2026-07-01 — מבקש.
- [ ] timeout מדומה בהפקה לא יוצר שני מסמכים (`findByReference`).
- [ ] שינוי `billing_profiles` אחרי תשלום לא משנה את `invoices.customer` של המסמך שכבר הופק.
- [ ] `vat_rate_next` עם תאריך עתידי משנה את המע״מ רק בחיובים שאחרי התאריך.

---

## §10. ביטול, החזרים ודיני הגנת הצרכן

### 10.1 המסגרת המשפטית שהקוד מממש ⚖️

| מקור | מה הוא דורש | איך אנחנו עומדים בזה |
|---|---|---|
| חוק הגנת הצרכן, ס׳ 13ד (עסקה מתמשכת) | הצרכן רשאי לבטל בכל עת — בטלפון, פנים אל פנים, בדואר רשום, במייל או בפקס אם יש לעסק; החיוב נפסק **תוך 3 ימי עסקים** מקבלת ההודעה (6 בדואר רשום); אתר העסק חייב לפרסם את דרכי הביטול | כפתור בעמוד החיוב (מיידי), מייל ל-billing@{{DOMAIN}}, טלפון {{SUPPORT_PHONE}}, טופס יצירת הקשר; דרכי הביטול מפורסמות ב-`/legal/cancellation` ובפוטר |
| ס׳ 14ט | ביטול **באותה דרך שבה נעשתה העסקה**, וקישור ייעודי ובולט לביטול באתר | הקישור "ביטול מנוי" בפוטר של כל עמוד, בעמוד החיוב ובמדיניות הביטול; הביטול באפליקציה = 2 לחיצות (חלק 03 §15.5) |
| ס׳ 14ג (עסקת מכר מרחוק) | גילוי לפני העסקה ומסמך גילוי בכתב אחריה; ביטול תוך **14 יום** מהעסקה או מקבלת מסמך הגילוי (המאוחר); דמי ביטול עד **5% או ₪100, הנמוך**; בשירות — תשלום על מה שנצרך; בלי דמי ביטול בפגם, באי־התאמה או באי־אספקה | גילוי בקופה (4.1 סעיף 3); `payment_receipt` כמסמך הגילוי (`confirmation_sent_at`); `quoteRefund()` |
| תקופת ביטול מורחבת | **4 חודשים** לאנשים עם מוגבלות, לבני 65 ומעלה ולעולים חדשים, כשהעסקה כללה שיחה (כולל צ׳אט או מייל) | תיבת "יש לי זכאות לתקופת ביטול מורחבת" ← `refund_requests` (`extended_4m`) לטיפול ידני תוך 2 ימי עסקים |
| ס׳ 17ב (הצגת מחיר) | מחיר לצרכן כולל מע״מ | `Price` + "כולל מע״מ" בכל מקום; מתג B2B ב-`/pricing` לעסקים בלבד |
| תקופת הטבה (v2) | הודעה לפני שהמחיר משתנה (החובה המדויקת לא אומתה במחקר — לבדיקת עורך דין) | `price_change_notice` 7 ימים לפני (גם בשינוי מע״מ, 9.7) |
| חוק החוזים האחידים | אין שינוי חד־צדדי בלי הודעה, אין הגבלת אחריות גורפת | תנאי השימוש (חלק 02 §10.2) — לבדיקת עורך דין |

### 10.2 ערוצי הביטול ומתי הוא נכנס לתוקף

| ערוץ | מה קורה | תוקף | `cancel_channel` |
|---|---|---|---|
| כפתור "ביטול המנוי" באפליקציה | `POST /api/billing/cancel` | מיידי: לא יהיו חיובים נוספים | `app` |
| קישור "ביטול מנוי" בפוטר / במדיניות | `/app/billing/cancel` (לא מחוברים ← `/login?next=/app/billing/cancel` עם הודעת ההקשר של חלק 03 §3.1) | כמו הכפתור | `app` |
| מייל ל-billing@{{DOMAIN}} | תור "בקשות ביטול" באדמין; האדמין מבצע "ביטול בשם הלקוח" (חלק 03 §22.15) עם אסמכתה | **יעד: באותו יום עסקים; חובה: עד 3 ימי עסקים** | `email` |
| טלפון {{SUPPORT_PHONE}} | אותו דבר; הנציג מתעד שעה ושם | כמו מייל | `phone` |
| טופס יצירת הקשר בנושא "ביטול מנוי או החזר" | `contact_messages.topic = 'cancellation'` ← התראת אדמין עם מועד אחרון | כמו מייל | `email` |

- **ימי עסקים** (`lib/billing/business-days.ts` ★): ראשון עד חמישי, בלי חגים ומועדים שבהם עסקים סגורים (רשימה שנתית ב-`app_settings.non_business_days`, חלק 04 §16.4; מתעדכנת מ-Hebcal או ידנית, runbook R11). ה-SLA מחושב מרגע קבלת ההודעה; התראה לאדמין כשנותר יום עסקים אחד.
- **מה קורה בביטול:** `cancel_at_period_end = true`, `canceled_at = now`, `cancel_reason`, `cancel_channel`, ניקוי `scheduled_change`; מייל `subscription_canceled` מיד; התוכנית והקרדיטים פעילים עד `current_period_end`; ב-cron — מעבר ל-`canceled` ול-`free` (4.3). `audit_logs`: ‏`billing.cancel` (בעלים) או `subscription.cancel_on_behalf` (אדמין); אירוע השרת `subscription_canceled {reason}` (‏`CancelReason`, חלק 04 §21.2).
- ביטול שמגיע **אחרי** שחיוב החידוש כבר יצא (בתוך חלון 3 ימי העסקים): אם הביטול התקבל לפני החיוב — מחזירים את החיוב במלואו (`reason_code = 'technical'`, בלי דמי ביטול) ומפיקים חשבונית זיכוי ⚖️.

### 10.3 זכאות להחזר כספי

| תשלום | תוך 14 יום (`distance_14d`) | 14 יום עד 4 חודשים | אחרי |
|---|---|---|---|
| תשלום ראשון במנוי (`subscription_initial`, חודשי או שנתי) | ✓ אוטומטי בזרימת הביטול | `extended_4m` (ידני, למי שזכאי) | — |
| שדרוג (`plan_change`) — "התשלום הראשון על התוכנית החדשה" | ✓ (המנוי כולו נסגר) ⚖️ | `extended_4m` | — |
| חבילת קרדיטים (`topup`) | ✓ דרך `POST /api/billing/refund-request` | `extended_4m` | — |
| חידוש (`subscription_renewal`) | — (עסקה מתמשכת: מבטלים קדימה) | — | — |
| מנוי שנתי, אחרי 14 הימים | — | `annual_prorata` אוטומטי: החזר על החודשים שלא התחילו ⚖️ | `annual_prorata` |
| כל תשלום, כשהשירות לא סופק או כשהייתה תקלה מהותית | `technical` (ידני, בלי דמי ביטול) | `technical` | `technical` |
| מחווה | `goodwill` (אדמין) | | |

"14 יום" נספרים מהמאוחר מבין התשלום (`payments.created_at`) לבין `payments.confirmation_sent_at` (`DISTANCE_DAYS`), ו"4 חודשים" — באותו אופן (`EXTENDED_DAYS = 122`). ⚖️ = החלטת מדיניות שממתינה לאישור (§25).

### 10.4 החישוב (`lib/billing/refunds.ts`)

```ts
export type RefundReason = "distance_14d" | "extended_4m" | "technical" | "goodwill" | "annual_prorata";
export type RefundQuote = { paymentId: string; reasonCode: RefundReason; paidAg: Agorot; creditsConsumed: number;
  consumedValueAg: Agorot; feeAg: Agorot; refundAg: Agorot; creditsToRevoke: number; accessEndsAt: Date };

export function quoteRefund(i: {
  payment: { id: string; kind: PaymentKind; amountAg: Agorot; refundedAg: Agorot; createdAt: Date; confirmationSentAt: Date | null };   // toAgorot(amount_ils / refunded_ils)
  creditsInPurchase: number;             // monthly: monthly_credits · annual: 12 × monthly_credits · topup: pack credits · plan_change: prorated grant
  creditsConsumed: number;               // Σ (amount − remaining) over the grants created from this payment (annual: all grants of the term)
  creditsRemaining: number;              // Σ remaining over those grants
  reason: RefundReason; now: Date;
  annual?: { monthlyPriceAg: Agorot; monthsStarted: number; currentWindowEnd: Date };
}): RefundQuote {
  const paid = ag(i.payment.amountAg - i.payment.refundedAg);
  const base = { paymentId: i.payment.id, reasonCode: i.reason, paidAg: paid, creditsConsumed: i.creditsConsumed };
  if (i.reason === "annual_prorata") {
    const keep = ag(i.annual!.monthlyPriceAg * i.annual!.monthsStarted);          // the current month counts as started
    return { ...base, consumedValueAg: keep, feeAg: ag(0), refundAg: ag(Math.max(0, paid - keep)),
             creditsToRevoke: 0, accessEndsAt: i.annual!.currentWindowEnd };       // future monthly grants simply stop
  }
  const unit = i.creditsInPurchase > 0 ? i.payment.amountAg / i.creditsInPurchase : 0;   // price per credit in THIS purchase
  const consumedValue = ag(Math.min(paid, roundHalfUp(i.creditsConsumed * unit)));
  const fee = i.reason === "technical" || i.reason === "goodwill" ? ag(0)
            : ag(Math.min(roundHalfUp(i.payment.amountAg * CANCEL_FEE_RATE), CANCEL_FEE_CAP_AG));   // 5% or ₪100, the lower
  return { ...base, consumedValueAg: consumedValue, feeAg: fee,
           refundAg: ag(Math.max(0, paid - consumedValue - fee)), creditsToRevoke: i.creditsRemaining, accessEndsAt: i.now };
}
// API boundary (part 04 §21.2 RefundQuote keeps …Ils): GET /api/billing/cancel/quote, POST /api/billing/cancel and
// POST /api/billing/refund-request return toApiRefundQuote(q) — e.g. refundAg 9817 → refundIls 98.17
export const toApiRefundQuote = (q: RefundQuote) => ({ paymentId: q.paymentId, reasonCode: q.reasonCode, paidIls: toIlsNumber(q.paidAg),
  creditsConsumed: q.creditsConsumed, consumedValueIls: toIlsNumber(q.consumedValueAg), feeIls: toIlsNumber(q.feeAg),
  refundIls: toIlsNumber(q.refundAg) });
```

הקבועים (`CANCEL_FEE_RATE = 0.05`, ‏`CANCEL_FEE_CAP_AG = 10_000` אגורות, ‏`DISTANCE_DAYS = 14`, ‏`EXTENDED_DAYS = 122`) הם הגבלות חוקיות ולא מחירים, ולכן מותרים בקוד — אבל מוגדרים פעם אחת ב-`lib/billing/legal.ts`, עם הערה שמפנה לסעיף בחוק.

### 10.5 דוגמאות (זהות לדוגמאות במדיניות הביטול, חלק 02 §10.5)

| תרחיש | שולם | נוצל | שווי הניצול | דמי ביטול | **החזר** |
|---|---|---|---|---|---|
| בסיס חודשי, 50 מתוך 400 קרדיטים | ₪119 | 50 × ₪0.2975 | ₪14.88 | ₪5.95 | **₪98.17** |
| חבילת 500, לא נוצלה | ₪179 | 0 | ₪0 | ₪8.95 | **₪170.05** |
| סוכנות חודשי, לא נוצל | ₪990 | 0 | ₪0 | ₪49.50 | **₪940.50** |
| עסק שנתי בתוך 14 יום, 300 מתוך 12,000 | ₪2,772 | 300 × ₪0.231 | ₪69.30 | ₪100.00 (5% = ₪138.60, התקרה ₪100) | **₪2,602.70** |
| עסק שנתי, ביטול בחודש הרביעי (`annual_prorata`) | ₪2,772 | 4 חודשים × ₪231 | ₪924 | ₪0 | **₪1,848** |
| חבילת 150 שנוצלה במלואה | ₪59 | 150 | ₪59 (מוגבל לשולם) | ₪2.95 | **₪0** — הממשק מציג "אין סכום להחזר" |
| בסיס חודשי, `technical` | ₪119 | 50 | ₪14.88 | ₪0 | **₪104.12** |

### 10.6 ביצוע ההחזר (`executeRefund`, workflow)

תנאי מוקדם: **אין יצירות פעילות בסביבת החיוב** (שמירות `open`), כדי שחישוב הניצול יהיה סופי. אם יש — בזרימת הביטול תיבת ההחזר מושבתת עם ההסבר **"אפשר לבקש החזר אחרי שהיצירה הפעילה תסתיים."** (חלק 03 §15.5); את המנוי עצמו אפשר לבטל כבר עכשיו.

1. `refund_requests` נוצרת בסטטוס `approved` (בקשה עצמית מסוג `distance_14d` או `annual_prorata`, כשהחישוב תואם להצעה שהוצגה) או `requested` (ידנית — מחכה לאדמין).
2. **קודם מסירים קרדיטים** (שלא ינוצלו בזמן ההחזר): `revoke_grant_remaining(grantId, 'revoke:{refundRequestId}:{grantId}', 'הסרת קרדיטים בעקבות החזר כספי', actorId)` (חלק 04 §10.3) לכל דלי שנוצר מהתשלום (`ref_type = 'payment'`, ‏`ref_id = paymentId`; שורת `adjustment` שלילית). קרדיטים שמורים לעבודה פתוחה כבר מחוץ ל-`remaining`, ולכן עבודות שרצות לא נפגעות.
3. `provider.refund({ providerTxnId, amountAg: quote.refundAg, reason, idempotencyKey: 'refund:{refundRequestId}' })` (מתאם Grow שולח `refundSum: fromAgorot(amountAg)`, למשל `"98.17"`); כישלון ← 3 ניסיונות חוזרים (5 ד׳, 30 ד׳, 2 ש׳), ואז התראת אדמין (R3). החוק נותן 14 יום; היעד שלנו — אותו יום.
4. שורת `payments` חדשה מסוג `refund` (`status = succeeded`, הסכום החיובי `amount_ils = fromAgorot(quote.refundAg)`, `provider_txn_id` = מזהה ההחזר); בתשלום המקורי `refunded_ils += fromAgorot(quote.refundAg)` ו-`status = refunded` / `partially_refunded`.
5. `invoicePayment` על שורת ה-`refund` ← `credit_invoice` מקושרת למסמך המקורי.
6. המנוי: `distance_14d` / `extended_4m` / `technical` של תשלום מנוי ← `status = canceled`, `current_period_end = now`, `workspaces.plan_id = 'free'`, ‏`enforce_plan_limits(ws)`, בלי `resume`. החזר על חבילה לא משנה את המנוי. `annual_prorata` ← `cancel_at_period_end = true`, `current_period_end = accessEndsAt` (סוף חלון ההענקה הנוכחי), `next_grant_at = null`.
7. `refund_requests.status = 'paid'`, `handled_at`; מייל `refund_processed` עם חשבונית הזיכוי מצורפת; `audit_logs` ‏`payment.refund` (מבצע: המערכת או האדמין); אירוע השרת `refund_requested {reason_code}` נשלח בזמן הבקשה, ו-`refund_completed {reason_code}` כאן (§14).
8. **דחייה** (רק בבקשות ידניות, עם סיבה חובה): `status = 'rejected'`, מייל `refund_rejected` עם הסיבה שהאדמין כתב. אסור לדחות בקשה של `distance_14d` שעומדת בתנאים.

### 10.7 מחיקת חשבון וסביבה

מחיקת חשבון או סביבה מבטלת מנוי פעיל בסוף התקופה (`cancel_at_period_end = true`) **בלי החזר אוטומטי** (חלק 04 §21.3); בתוך 14 יום מהתשלום הראשון, דיאלוג המחיקה מציג גם: **"שילמתם ב-14 הימים האחרונים. אפשר לבקש החזר לפני המחיקה בעמוד החיוב."** + קישור ל-`/app/billing/cancel` (חלק 03 §16.4). אסימון הכרטיס נמחק (`payment_methods.deleted_at`, `provider.deleteToken` אם קיים). רשומות תשלום וחשבוניות נשמרות 7 שנים (§11.5).

### קריטריוני קבלה
- [ ] כל שורות 10.5 עוברות ב-`tests/unit/billing/refunds.test.ts`, וההצעה ב-`GET /api/billing/cancel/quote` זהה לביצוע.
- [ ] החזר של ₪98.17 (השורה הראשונה ב-10.5): `provider.refund` מקבל `amountAg: 9817`, בקשת Grow נשלחת עם `refundSum: "98.17"`, ו-`toApiRefundQuote(q).refundIls === 98.17` (בדיקת יחידה).
- [ ] החזר עצמי בתוך 14 יום: הקרדיטים שנותרו מוסרים **לפני** הקריאה לספק, נוצרת שורת `payments` מסוג `refund`, חשבונית זיכוי, מייל, והמנוי נסגר מיד.
- [ ] ביטול במייל שהאדמין רשם עם `cancel_channel='email'` שולח את אותו מייל אישור עם הערוץ הנכון.
- [ ] בקשה ידנית שלא טופלה תוך 2 ימי עסקים מסומנת באדום בתור ומייצרת התראה.
- [ ] בתוך 14 יום, עם יצירה פעילה, תיבת ההחזר מושבתת עם ההסבר, והביטול עצמו עדיין אפשרי.
- [ ] `annual_prorata` לא מסיר קרדיטים קיימים, מפסיק הענקות עתידיות ומסיים את הגישה בסוף החודש הנוכחי.

---

## §11. רשימת התאימות המשפטית ⚖️

כל שורה כאן היא דרישה שנבדקת לפני ההשקה (M7). המסמכים עצמם (תנאי שימוש, פרטיות, ביטול, נגישות, AI, דמות וקול, עוגיות) כתובים בחלק 02 §10; כאן — מה המערכת חייבת לעשות כדי שהמסמכים יהיו נכונים.

### 11.1 טבלת הבקרה

| מזהה | תחום | דרישה | מימוש | בדיקה | חוסם השקה |
|---|---|---|---|---|---|
| L-01 | נגישות | ת״י 5568 (= WCAG 2.0 AA) לפי תקנה 35; אנחנו בונים ובודקים ל-WCAG 2.2 AA | חלק 01 §13 | axe בכל דף (§18.5) + ביקורת ידנית של מורשה נגישות | ✓ |
| L-02 | נגישות | הצהרת נגישות עם רמה, פערים ידועים, תאריך ביקורת ופרטי רכז הנגישות | `/legal/accessibility` (חלק 02 §10.6) | משתני `{{A11Y_COORDINATOR_*}}` הוחלפו | ✓ |
| L-03 | נגישות | כתוביות לכל וידאו שיווקי, עצירת תנועה, בלי תוסף נגישות צף | חלק 01, חלק 02 | Playwright: לכל `<video>` שיווקי יש `<track srclang="he">` | ✓ |
| L-04 | פרטיות | הודעת איסוף לפי ס׳ 11 המתוקן (זהות ופרטי קשר, מטרות, חובה או רשות, תוצאות סירוב, נמענים, העברה לחו״ל, זכויות) | `/legal/privacy` | בדיקת עורך דין | ✓ |
| L-05 | פרטיות | יומן הסכמות מלא | `consents` (11.4) | בדיקת e2e לכל מקור הסכמה | ✓ |
| L-06 | פרטיות | עיון, תיקון, ייצוא ומחיקה | §11.6 | e2e של ייצוא ומחיקה | ✓ |
| L-07 | פרטיות | אבטחת מידע לפי התקנות (2017): מסמך הגדרות מאגר, נוהל אבטחה, בקרת גישה, תיעוד, סקר סיכונים, דיווח על אירוע חמור | `docs/security/*` + §15 | המסמכים קיימים וחתומים | ✓ |
| L-08 | פרטיות | הסכמי עיבוד מידע (DPA) עם כל ספק משנה | רשימה ב-`docs/legal/subprocessors.md` (זהה לחלק 02 §10.3) | DPA חתום או מאושר לכל ספק | ✓ |
| L-09 | פרטיות | אזור אחסון מתועד (EU-Frankfurt) והעברה לחו״ל לפי תקנות 2001 | Supabase `eu-central-1`, Vercel `fra1`, Sentry, PostHog ו-Upstash באיחוד האירופי; ספקים בארה״ב (OpenRouter, ספקי המודלים, Resend) מפורטים במדיניות הפרטיות; הרכבת הסרטונים ב-Vercel Sandbox רצה באזור ש-Sandbox מאפשר, ייתכן שבארצות הברית [M0-verify ספייק 18] — וכך היא מופיעה בטבלת ספקי המשנה (חלק 02 §10.3, סעיף 6) וב-`docs/legal/subprocessors.md`; אם יתברר שהאזור הוא `fra1`, מעדכנים את שלושתם | בדיקת הגדרות | ✓ |
| L-10 | פרטיות | `data_collection: "deny"` בכל בקשה ל-OpenRouter (המדיניות מתחייבת לכך); בנקודות המדיה [M0-verify] — אם נקודה דוחה את השדה, משמיטים אותו רק בה, מתעדים ב-`DECISIONS.md` ומעדכנים באותו PR את ניסוח מדיניות הפרטיות | חלק 05 §4 | בדיקת חוזה על גוף הבקשה | ✓ |
| L-11 | עוגיות | אנליטיקה רק בהסכמה, בלי טעינה לפני בחירה, GPC | חלק 02 §11 | Playwright על רשת ועוגיות | ✓ |
| L-12 | ספאם | הסכמה מפורשת לא מסומנת מראש, "פרסומת" בנושא, פרטי שולח, הסרה בלחיצה | §11.8, §12 | בדיקות יחידה על שליחת דיוור | ✓ |
| L-13 | צרכנות | ביטול אונליין (שתי לחיצות, בלי שיחת שימור), קישור בפוטר, אישור במייל, 3 ימי עסקים | §10 | e2e ביטול | ✓ |
| L-14 | צרכנות | גילוי לפני עסקה, מסמך גילוי אחריה, ביטול 14 יום ודמי ביטול | §4.1, §10 | בדיקות יחידה + e2e | ✓ |
| L-15 | צרכנות | מחירים כולל מע״מ | `Price` | בדיקת snapshot לעמוד המחירים | ✓ |
| L-16 | מס | חשבונית מס-קבלה לכל תשלום, מספר הקצאה מעל הסף, מע״מ קונפיגורבילי | §9 | בדיקות sandbox | ✓ |
| L-17 | AI | תווית "נוצר באמצעות AI" אופציונלית, צ׳קליסט ייצוא, מטא־דאטה | §11.9 | e2e על הצ׳קליסט | ✓ |
| L-18 | דמות וקול | בלי שיבוט קול/אווטאר בהשקה; כשיופעלו — זרימת הסכמה מתועדת | §11.10 | הדגלים כבויים בפרודקשן | ✓ |
| L-19 | העלאות | הצהרת הסכמה בהעלאת צילומים של אנשים, ובקטינים — הסכמת הורים | חלק 03, `assets.metadata.consent_attested` | e2e | ✓ |
| L-20 | בחירות | חסימת תעמולה ופוליטיקאים, מצב בחירות עד 2026-10-28 23:59 | §11.11 | בדיקת מודרציה + `ELECTION_POLICY_BLOCKED` | ✓ |
| L-21 | תנאים | רישום קבלת התנאים עם גרסה; קבלה מחדש בשינוי מהותי | §11.12 | בדיקת `consents` | ✓ |
| L-22 | פרסום מטעה | כל טענה שיווקית שלנו מגובה (חיסכון, מחירי שוק) עם הערת שוליים | חלק 02 §3.7 | בדיקת תוכן | ✓ |
| L-23 | תעשיות מפוקחות | דגלי ציות לפי נישה, הסתייגויות חובה, ניסוחים חסומים | חלק 05 §9, נספח A | בדיקות פרומפט | ✓ |
| L-24 | קטינים | השירות מגיל 18 | תנאי השימוש | — | ✓ |
| L-25 | תוכן משפטי | אף דף משפטי בסטטוס `draft` ואף משתנה משפטי לא מוחלף בפרודקשן | `scripts/check-content.ts --launch` (חלק 02) | שער ב-CI של פריסת פרודקשן | ✓ |

### 11.2 נגישות — מה עוד חשוב לדעת

- הבסיס החוקי הוא ת״י 5568 חלק 1 (2021), שהוא תרגום של WCAG 2.0 ברמה AA; אין עדכון רשמי ל-2.1/2.2. אנחנו מצהירים על "עמידה בת״י 5568 ושאיפה ל-WCAG 2.2 AA" — ניסוח ההצהרה בחלק 02.
- פטור "נטל כבד" אוטומטי קיים לגופים שמחזורם השנתי עד ₪1,000,000; **אנחנו לא נשענים עליו** — מוצר שמוכר מנויים יחצה אותו, והחשיפה (פיצוי בלי הוכחת נזק של עד כ-₪50,000 לתביעה, ותביעות ייצוגיות) גבוהה מדי.
- ביקורת נגישות ידנית ב-M7 (קורא מסך NVDA/VoiceOver בעברית, מקלדת בלבד, הגדלה 200%), והתאריך נכנס להצהרה. פניות בנושא נגישות (`contact_messages.topic = 'accessibility'`) מקבלות מענה תוך 5 ימי עסקים.

### 11.3 פרטיות: תיקון 13 (בתוקף מ-2025-08-14)

| שאלה | התשובה בהשקה | מתי לבדוק שוב |
|---|---|---|
| חובה למנות ממונה הגנת פרטיות (DPO)? | חובה חלה על גופים ציבוריים, סוחרי מידע, ומי שעיסוקו העיקרי ניטור שיטתי בהיקף ניכר או עיבוד מידע בעל רגישות מיוחדת בהיקף ניכר. בהשקה אין עיבוד ביומטרי, והעיבוד שלנו אינו ניטור — **ככל הנראה לא חובה; מומלץ למנות בעל תפקיד מתנדב** (השם ב-`{{DPO_NAME}}`, חלק 02), שאינו המנכ״ל, מנהל ה-IT או מנהל אבטחת המידע ⚖️ | לפני הפעלת `voice_clone` או `avatar` |
| חובת רישום מאגר? | אחרי התיקון הרישום צומצם בעיקר לסוחרי מידע ולגופים ציבוריים — **ככל הנראה לא חלה עלינו** ⚖️. בכל מקרה מחזיקים "מסמך הגדרות מאגר" | אם נעבד מידע רגיש בהיקף גדול (חובת הודעה אפשרית) |
| רמת אבטחה לפי תקנות 2017? | מתייחסים כרמת אבטחה **בינונית** (הזהיר מבין האפשרויות הסבירות): נוהל אבטחה, בקרת גישה מבוססת תפקיד, תיעוד גישה, סקר סיכונים שנתי, בדיקת חדירות לפני השקה ⚖️ | כל שנה |
| מידע בעל רגישות מיוחדת? | לא נאסף ביודעין. קול ופנים לשיבוט הם כנראה מידע ביומטרי ← הסכמה נפרדת, הערכת השפעה, ואולי DPO | לפני v2 ביומטרי |
| הנחיות הרשות על AI (טיוטה, 28.4.2025) | שקיפות על השימוש ב-AI, בסיס חוקי, אי־אימון על תוכן לקוחות | כשתפורסם גרסה סופית |

תיעוד חובה ב-`docs/legal/` (נוצר ב-M7, באחריות המייסד עם עורך הדין): `database-definition.md` (מטרות, סוגי מידע, מקורות, העברות, מיקום, בעלי הרשאה), `security-procedure.md`, `risk-assessment-{yyyy}.md`, `incident-response.md` (= runbook R7), `subprocessors.md`.

### 11.4 יומן ההסכמות (`consents`)

| `kind` | מתי נרשם | `source` | `version` | הערות |
|---|---|---|---|---|
| `terms`, `privacy` | כניסה ראשונה; שוב בכל קבלה מחדש | `signup` | `version` מה-frontmatter של הדף | הנוסח בחלק 03 §3.1 |
| `terms` | כל רכישה (קופה, חבילה, שינוי תוכנית בתשלום) | `checkout` | גרסת תנאי השימוש (מדיניות הביטול היא חלק מהתנאים בהפניה, ולכן כל שינוי בה מעלה גם את גרסת התנאים) | תיבה לא מסומנת (§4.1) |
| `ai_content_policy` | יצירה ראשונה (שורה בדיאלוג האישור: **"ביצירה אתם מאשרים את {מדיניות השימוש ההוגן ב-AI}."**) | `generate` | גרסת `/legal/ai-policy` | נרשם **בשרת** בתוך `POST /api/projects/[id]/generate` (חלק 04 §19.8) כשאין למשתמש שורה בגרסה הנוכחית; `ConsentBody` הציבורי לא מקבל `generate`. השורה בדיאלוג בלי תיבת סימון (חלק 03 §6.10) |
| `marketing_email` | תיבה בהרשמה, בהגדרות, או אישור כפול בניוזלטר | `signup` / `settings` / `newsletter` | גרסת מדיניות הפרטיות | ביטול = שורה חדשה `granted=false` + `email_suppressions` |
| `marketing_email`, `marketing_sms`, `marketing_whatsapp` (ביטול) | קישור ההסרה במייל: POST חד-קליקי (RFC 8058) או הטופס של `/unsubscribe` (`POST /api/unsubscribe`, חלק 04 §21.4) | `unsubscribe` | גרסת מדיניות הפרטיות | שלוש שורות `granted=false`, אחת לכל סוג, אחרי שורת `email_suppressions` שנכתבת קודם ובנפרד; התשובה תמיד 200. נרשם **בשרת** בלבד; `ConsentBody` הציבורי לא מקבל `unsubscribe` |
| `analytics_cookies` | בחירה בבאנר העוגיות, או שינוי בהגדרות הפרטיות | `cookie_banner` / `settings` | גרסת `/legal/cookies` | אנונימי מותר (חלק 04 §21.4) |
| `marketing_sms`, `marketing_whatsapp` | לא בשימוש בהשקה | — | — | שמורים ל-v2 |
| `biometric_voice`, `biometric_likeness` | זרימת הדמות והקול (v2) | `likeness_flow` | גרסת `/legal/likeness-consent` | `evidence_path` = הקלטת ההצהרה |

**מי כותב:** כל שורת `consents` נכתבת בשרת דרך `recordConsent()` (`lib/consents/record.ts`, בלקוח הסודי); אין INSERT ישיר מהדפדפן (הטבלה ברשימת "כתיבה רק מהשרת" ואין לה policy של insert, חלק 04 §12.2, §12.4). השרת קובע `ip` (`ipAddress(req)`), `user_agent`, `created_at = now()` ו-`version = LEGAL_VERSIONS[kind]`; גרסה שהלקוח שלח ושונה מהנוכחית ← 400 `INVALID_INPUT {reason:"version_mismatch"}`. `POST /api/consents` (חלק 04 §21.4) מקבל רק את הצירופים האלה של (`kind`, `source`): `marketing_email` / `marketing_sms` / `marketing_whatsapp` עם `signup` / `settings` / `newsletter`, ו-`analytics_cookies` עם `cookie_banner` / `settings`; כל צירוף אחר ← 400 `INVALID_INPUT`. שאר הסוגים נכתבים רק בשרת: `terms`/`privacy` בהרשמה — `ensureFirstLogin`; `terms` עם `source = 'checkout'` — נתיב הקופה; `ai_content_policy` — `generate`; ביטול `marketing_*` מקישור הסרה (`source = 'unsubscribe'`) — `POST /api/unsubscribe`; `biometric_*` — נתיב הדמות והקול (v2).

כל שורה כוללת `ip` ו-`user_agent`. שורות לא מתעדכנות (חוץ מ-`revoked_at` ומ-`subject_closed_at`, שנחתם בסגירת החשבון); ביטול = שורה חדשה. שורות של משתמש קיים לא נמחקות לעולם. בסגירת חשבון `prepare_user_deletion` חותמת `consents.subject_closed_at`, ואחר כך `user_id` מתאפס (`on delete set null`); השורה נשמרת בלי פרופיל ובלי תוכן עד שעברו **7 שנים מסגירת החשבון** (תקופת ההתיישנות), ואז `purge_support_data()` מוחקת אותה (חלק 04 §11.4, §15). הסכמה בלי חשבון (מייל בלבד, למשל ניוזלטר) נשמרת 7 שנים **מביטול ההסכמה** (או מהשורה המאוחרת שהחליפה אותה); שורות אנונימיות של באנר העוגיות, שאי אפשר לקשר לבחירה מאוחרת — 7 שנים מהרישום.

### 11.5 תקופות שמירה (מקור אמת: הטבלה הזו; חלק 02 §10.3 מציג אותה בעברית פשוטה)

| מידע | תקופה | מנגנון |
|---|---|---|
| חשבון, פרטי עסק, ערכות מותג | כל עוד החשבון פעיל; 30 יום אחרי מחיקה | workflow `accountDeletion` (חלק 04 §9.6) |
| פרויקטים שנמחקו | 30 יום | pg_cron `mark-retention` + `/api/cron/cleanup` (חלק 04 §15, §23) |
| סרטונים בסביבה שמעולם לא שילמה (`has_paid = false`, תוכנית חינמית) | 90 יום מהיצירה | אותו מנגנון: `mark_retention` מסמן רק כש-`workspace_plan(ws).id = 'free'` **וגם** `has_paid = false` (חלק 04 §11.4) ⚖️ |
| סרטונים וקבצים בסביבה ששילמה לפחות פעם אחת | כל עוד החשבון קיים, גם אחרי חזרה לתוכנית החינמית | — |
| קובץ ייצוא | 7 ימים | `cleanup` |
| `webhook_events.payload` | 90 יום | pg_cron `purge-webhook-payloads` |
| `ai_generations` | 24 חודשים; `meta` (קטעי איתור תקלות) — 30 יום | pg_cron `purge-ai-generations` (חודשי) ו-`purge-ai-generation-meta` (יומי), חלק 04 §15 |
| `contact_messages`, `abuse_reports` | 24 חודשים | pg_cron `purge-support-data` (חודשי), חלק 04 §15 |
| `email_messages` (יומן שליחות) | 24 חודשים | אותה משימה |
| `audit_logs` | 36 חודשים; פעולות `payment.*`, ‏`invoice.*`, ‏`refund_request.*`, ‏`subscription.*`, ‏`billing.*`, ‏`credits.*` — 7 שנים | pg_cron `purge-audit-logs` (חודשי, חלק 04 §15; הטריגר `prevent_audit_mutation` מתיר רק לה למחוק, חלק 04 §10.6) |
| תשלומים, חשבוניות (כולל ה-PDF), יומן הקרדיטים, בקשות החזר | 7 שנים לפחות (דיני מס) | לא נמחקים; בסביבה שנמחקה השורות נשמרות בלי פרטים מזהים מעבר לנדרש (חלק 04 §9.6) |
| `consents` | כל עוד החשבון קיים, ועוד 7 שנים אחרי סגירת החשבון (`subject_closed_at`) או ביטול ההסכמה; הסכמה בלי חשבון (מייל בלבד) — 7 שנים מביטולה; שורות אנונימיות של באנר העוגיות — 7 שנים מהרישום | `purge-support-data` (11.4; חלק 04 §11.4) |
| `trial_claims` (גיבוב בלבד) | 5 שנים | אותה משימה |
| PostHog | 12 חודשים | הגדרת הפרויקט ב-PostHog |
| Sentry | 90 יום | הגדרת הארגון |
| גיבויים | מסד הנתונים: גיבוי יומי + PITR של 7 ימים (Supabase); גיבוי לוגי שבועי — 30 יום, והגיבוי האחרון של כל חודש — 12 חודשים. קבצים (`brand-assets`, `uploads`, `renders`): סנכרון שבועי ל-S3 עם גרסאות; גרסה שנמחקה או הוחלפה נשמרת 30 יום, כך שקובץ שנמחק בשירות נעלם מהגיבוי לכל המאוחר 37 ימים אחרי המחיקה. עותק של bucket החשבוניות — 7 שנים | §15.11 |

### 11.6 בקשות של נושאי מידע

- **בשירות עצמי:** ייצוא (`POST /api/account/export` ← קובץ ZIP, בדרך כלל תוך שעה; הקובץ זמין 7 ימים) ומחיקה (`POST /api/account/delete`) — חלק 04 §21.3.
- **במייל ל-privacy@{{DOMAIN}}:** עיון, תיקון, התנגדות לדיוור, שאלות. האדמין פותח `data_requests` ידני; **SLA: 30 יום** (יעד: 7). זיהוי: הבקשה חייבת להגיע מכתובת המייל של החשבון, או שהמבקש מאשר קישור שנשלח אליה.
- **מחיקה אצל ספקים:** Resend — מחיקת איש קשר; PostHog — מחיקת ה-person (`DELETE https://eu.posthog.com/api/projects/{posthogProjectId}/persons/{personId}` או `posthog-node` [M0-verify]); Sentry — אין PII (§16.1); Grow — מחיקת אסימון אם קיים API [M0-verify]; Morning — רשומת הלקוח נשמרת לפי דיני מס; OpenRouter — `data_collection: "deny"`: ניתוב רק לספקים שלא אוספים ולא מאמנים על הנתונים, ככל שהספק מאפשר (זו לא התחייבות לאפס שמירה).
- כל בקשה נרשמת ב-`audit_logs` (`privacy.request`) עם סוג, תאריך ותוצאה.

### 11.7 עוגיות

חלק 02 §11 הוא המימוש, וזו הרשימה הקנונית (אין עוגיות אחרות):

| קבוצה | עוגיות | הערות |
|---|---|---|
| הכרחיות (בלי הסכמה) | `sb-*` (התחברות של Supabase) · `ws` (סביבת העבודה הנוכחית, `HttpOnly`, ‏`Lax`, שנה) · `theme` (`dark\|light\|system`, שנה, לא `HttpOnly`) · `motion` (`system\|reduce`, שנה) · `sidebar_state` (shadcn) · `consent_v1` (`{v:1, analytics, ts}`, שנה) | נשמרות גם לפני בחירה בבאנר |
| רק אחרי הסכמה לאנליטיקה | `ph_*` (PostHog) · `exp_hero` (קבוצת הניסוי בדף הבית, חלק 02) | ביטול ההסכמה מוחק אותן |

`content/legal/cookies.mdx` מפרט בדיוק את הרשימה הזו, ובדיקת Playwright משווה את שמות העוגיות שהדפדפן רואה בפועל (לפני הסכמה ואחריה) לרשימה בדף.

### 11.8 חוק הספאם (חוק התקשורת, ס׳ 30א)

- **חל על:** מייל, SMS, פקס, חיוג אוטומטי — וככל הנראה גם וואטסאפ והודעות מיידיות (לא אומת במחקר; מתייחסים אליהן כאילו החוק חל ⚖️). **פיצוי בלי הוכחת נזק: עד ₪1,000 להודעה**, ותביעות ייצוגיות נפוצות.
- **מה נחשב דיוור שיווקי אצלנו:** הניוזלטר "5 הוקים לשבוע", הודעות על פיצ׳רים, מבצעים והטבות. **מה לא:** קבלות, סרטון מוכן, כשלי חיוב, אישורי ביטול, הזמנות לצוות, אישור לקוח, `low_credits` — הודעת שירות עובדתית: יתרה, מועד חידוש וקישור לעמוד החיוב, בלי מחירים, בלי חבילה או תוכנית מוצעת ובלי כפתור רכישה ⚖️ (ואפשר לכבות אותה בהגדרות ההתראות; §25).
- **כללים שהקוד אוכף** (`lib/email/send.ts`):
  1. תבנית מסוג `marketing` נשלחת רק לכתובת עם הסכמה `marketing_email` בתוקף (השורה האחרונה `granted = true`) ושאינה ב-`email_suppressions`.
  2. הנושא חייב להתחיל ב-**"פרסומת:"** — אחרת `sendEmail` זורק שגיאה (בדיקת יחידה).
  3. בגוף: שם השולח ({{LEGAL_ENTITY_NAME}}), כתובת ({{LEGAL_ADDRESS}}) ומייל ליצירת קשר, וקישור הסרה ברור שהטקסט שלו מתאר את היעד: **"הסרה מרשימת התפוצה"**; בכותרות: `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058).
  4. הסרה מטופלת מיד ומסונכרנת ל-Resend (`POST /api/unsubscribe`, חלק 04 §21.4): קודם, ובנפרד מכל השאר, שורת `email_suppressions` (`reason = 'unsubscribe'`); אחר כך `recordConsent({ …, granted: false, source: 'unsubscribe' })` לכל אחד מ-`marketing_email`, `marketing_sms` ו-`marketing_whatsapp` (§11.4). כשל ברישום ההסכמה לא מבטל את ההסרה, והתשובה לנמען תמיד 200.
  5. לא משתמשים בחריג "לקוח קיים" ולא בבקשת הסכמה חד־פעמית לעסקים — רק הסכמה מפורשת.
  6. וואטסאפ ו-SMS שיווקיים — לא בהשקה (§13).
- **הלקוחות שלנו כמפרסמים:** כשמשתמש משתף סרטון בוואטסאפ או מפרסם מודעה, הוא המפרסם. תנאי השימוש מחייבים אותו לעמוד בחוק (חלק 02 §10.2).

### 11.9 תוכן שנוצר ב-AI

- `projects.ai_label` (ברירת מחדל כבוי; פעיל תמיד בסרטוני אווטאר ב-v2) מוסיף את התגית **"נוצר באמצעות AI"** (שכבת `AiLabel`).
- צ׳קליסט הייצוא (חלק 03 §8) מזכיר שמטא, טיקטוק ויוטיוב מחייבים סימון של תוכן ריאליסטי שנוצר ב-AI.
- מטא־דאטה: `comment=ai-generated` בקובץ ה-MP4 [M0-verify]; C2PA — v2. אם נשרת משתמשים באיחוד האירופי, סעיף 50 של ה-AI Act (מ-2026-08-02) מחייב סימון — מחוץ לתחום בהשקה (קהל ישראלי), נרשם ב-`DECISIONS.md`.
- אין תבניות של "המלצות" מפוברקות: סצנת המלצה דורשת ציטוט אמיתי והצהרת הסכמה (חלק 03 §6.12).

### 11.10 דמות, קול והסכמה (v2, מאחורי `avatar` / `voice_clone`)

לפני הפעלת הדגלים בפרודקשן חייבים: (1) הערכה משפטית וייעוץ לגבי DPO; (2) זרימת `likeness_flow`: הקלטת הצהרה בקול של האדם עצמו — **"אני, {fullName}, מאשר או מאשרת ל{{BRAND_NAME}} ליצור קול דיגיטלי שלי, לשימוש העסק {businessName} בלבד. אני יודע או יודעת שאפשר לבטל את ההסכמה בכל עת."** — נשמרת ב-bucket פרטי (`consents.evidence_path`). זו הצהרה בגוף ראשון שהאדם מקריא, ולכן הכפל "מאשר או מאשרת" מותר בה (בדומה לטופס ההסכמה ב-PDF, חלק 02 §10.8); באפליקציה הטקסט מוצג ב-ICU `select` לפי `ui_gender_form` כשהוא לא `plural`, כך שכל אחד מקריא רק את הצורה שלו. בנוסף, תיבת סימון נפרדת ולא מסומנת: **"אני האדם שמופיע בהקלטה, והתנאים במדיניות ההסכמה לשימוש בדמות ובקול מקובלים עליי."** ההקלטה בדפדפן דורשת להתיר מיקרופון (ובאווטאר גם מצלמה) רק בנתיב הזרימה הזו: `Permissions-Policy` של הנתיב הזה הוא `microphone=(self), camera=(self)` (§15.3); (3) חסימת דמויות ציבוריות וקטינים; (4) ביטול שמוחק את הקול/הדמות אצל הספק ומסמן `likeness_profiles.revoked_at`; (5) תיעוד כל יצירה (מי, מתי, מה) לטיפול בתלונות.

### 11.11 בחירות לכנסת (2026-10-27) וימים רגישים

- תעמולת בחירות אינה שימוש נתמך. **תמיד** (לא רק בבחירות): `moderation.brief.v1` חוסם תוכן קמפיין ופוליטיקאים אמיתיים; נישה פוליטית (`compliance_flag = 'political'`) לא פעילה.
- **מצב בחירות** (`app_settings.election_mode = { enabled: true, until: "2026-10-28T23:59:00+02:00" }`): כל קטגוריה פוליטית מחזירה `ELECTION_POLICY_BLOCKED` (451) עם ההסבר של חלק 03. אחרי התאריך המצב כבה מעצמו (ההשוואה בקוד, לא פעולה ידנית); המדיניות הקבועה נשארת.
- `/legal/ai-policy` מפנה ל**כללי הבחירות (דרכי תעמולה) (קיום חובת הגילוי לגבי תעמולת בחירות שהיא זיוף עמוק), התשפ״ו-2026**, שמחייבים הודעה בכתב או סמל על תעמולת בחירות שנוצרה ב-AI (זיוף עמוק); הסמל לא תקף לתוכן קולי. מועד התחולה של הכללים לא אומת במחקר ⚖️.
- ימי שקט (יום השואה, יום הזיכרון): באנר, בלי הצעות עונתיות, בלי דיוור שיווקי (תזמון הניוזלטר מדלג עליהם).

### 11.12 קבלת תנאים וגרסאות

- לכל דף משפטי `version` (תאריך, למשל `2026-10-13`) ב-frontmatter; גרסאות קודמות נשמרות ב-`content/legal/archive/` ומקושרות מתחתית הדף.
- **שינוי מהותי** (מסומן `material: true` בגרסה החדשה): מייל `terms_update` 14 יום לפני התחולה, ובכניסה הראשונה אחרי התחולה — דיאלוג קבלה מחדש: **"עדכנו את {תנאי השימוש}. השינויים העיקריים: {summary}. השימוש בשירות מהיום כפוף לגרסה החדשה."** + **"הבנתי, ממשיכים"** ← שורת `consents` חדשה. עד לחיצה — אפשר לצפות ולהוריד, אבל לא ליצור.
- **זכויות בתוצרים:** הלקוח הבעלים של התוצרים במידה שהדין מאפשר; לנו רישיון לתבניות ולהוקים; אין התחייבות לזכויות יוצרים בתוצר AI; מוזיקה — רק מספרייה שנוצרה בזכויות מסחריות או ברישיון (`music_tracks.license_note`); גופנים בסרטונים — רק OFL או רישיון הטמעה מתועד. הודעות על הפרת זכויות מטופלות דרך `abuse_reports` (`reason='copyright'`; מהטופס בעמוד השיתוף `source='share_page'`, ממייל לתמיכה `source='support'`) תוך 2 ימי עסקים.

### קריטריוני קבלה
- [ ] כל 25 שורות 11.1 מסומנות בקובץ `docs/legal/launch-checklist.md` עם קישור לראיה (בדיקה, צילום, מסמך חתום).
- [ ] `sendEmail` עם תבנית `marketing` ונושא שלא מתחיל ב"פרסומת:" נכשל; לכתובת בלי הסכמה — לא נשלח ונרשם `skipped_no_consent`.
- [ ] INSERT ישיר של `authenticated` ל-`consents` נדחה (pgTAP); `POST /api/consents` עם `kind: "terms"`, עם `source: "checkout"` או עם `source: "unsubscribe"` מחזיר 400.
- [ ] הסרה בלחיצה אחת (`POST /api/unsubscribe?token=`, בלי עוגיות ובלי `Origin`) מחזירה 200 וכותבת שורת `email_suppressions` אחת ו-3 שורות `consents` עם `granted=false` ו-`source='unsubscribe'` (pgTAP: ה-insert הזה מצליח כ-`service_role`; בדיקת API: חלק 04 §25.5); כשרישום ההסכמה נכשל — עדיין 200, וההסרה נשמרה.
- [ ] משימות הניקוי של pg_cron (`purge-ai-generation-meta`, ‏`purge-ai-generations`, ‏`purge-support-data`, ‏`purge-audit-logs`; חלק 04 §15) קיימות ונבדקות עם נתונים מתוארכים: שורת `audit_logs` מסוג `invoice.attach` בת 4 שנים שורדת, ושורת `consents` של משתמש קיים בת 8 שנים לא נמחקת.
- [ ] אחרי 2026-10-28 23:59 שעון ישראל `ELECTION_POLICY_BLOCKED` לא מוחזר, אבל בריף של קמפיין עדיין נחסם ב-`MODERATION_BLOCKED`.
- [ ] שינוי `material: true` בגרסת התנאים מציג את דיאלוג הקבלה מחדש פעם אחת ונרשם ב-`consents`.

---

## §12. מיילי מערכת: Resend + React Email

### 12.1 תשתית ושליחה

```ts
// lib/email/send.ts
export async function sendEmail<K extends EmailKey>(i: {
  key: K; to: string | string[]; data: EmailData[K];
  userId?: string | null; workspaceId?: string | null;
  idempotencyKey: string;                        // e.g. "payment_receipt:{paymentId}" — unique in email_messages
  attachments?: Array<{ filename: string; content: Buffer; contentType: "application/pdf" }>;
  replyTo?: string;
}): Promise<{ status: "sent" | "skipped_duplicate" | "skipped_suppressed" | "skipped_no_consent" | "skipped_pref" | "skipped_allowlist"; id?: string }>;
```

- **רישום התבניות** (`lib/email/templates/index.ts`): לכל `key` — רכיב React Email, `category` (`auth` · `transactional` · `notification` · `marketing` · `internal`), `notificationKind` (אם יש — מכבד את `profiles.notification_prefs.kinds.{kind}.email`; מפתח חסר = פעיל; `payment_failed` ו-`invite` נשלחים תמיד, חלק 04 §4), `subject(data)`, `preheader(data)`, `from`.
- **שולחים:** מערכת — `EMAIL_FROM` (`{{BRAND_NAME}} <hello@{{DOMAIN}}>`), עם `Reply-To` = `EMAIL_REPLY_TO` (חיוב: `billing@{{DOMAIN}}`); אישור לקוח — `"{agencyName} דרך {{BRAND_NAME}}" <approvals@{{DOMAIN}}>` (כש-`resolveShareBranding(link).whiteLabel`: `"{agencyName}"`), עם `Reply-To` = מי שיצר את קישור האישור. `{agencyName}` = `resolveShareBranding(link).senderName`: שם סביבת החיוב (הסוכנות) כשהקישור שייך לסביבת לקוח, ואחרת שם העסק של הסביבה; השם והמיתוג נקבעים בזמן השליחה, לא בזמן יצירת הקישור (חלק 04 §20.5); דיוור — `{{BRAND_NAME}} <news@mail.{{DOMAIN}}>` מתת־דומיין נפרד, כדי שמוניטין הדיוור לא יפגע במיילי המערכת. כל הכתובות מ-`BRAND.emails.*` (`lib/constants.ts`).
- **DNS:** SPF ו-DKIM (Resend) לשני הדומיינים; DMARC `p=none` בשבועיים הראשונים עם דוחות, ואז `p=quarantine`.
- **יומן שליחות** `email_messages` (חלק 04 §8): `id`, ‏`template_key` (= `EmailKey`), ‏`to_email citext`, ‏`user_id NULL`, ‏`workspace_id NULL`, ‏`idempotency_key text unique`, ‏`resend_id NULL`, ‏`status` — `queued|sent|delivered|bounced|complained|failed|skipped_suppressed|skipped_no_consent|skipped_pref|skipped_allowlist`, ‏`error NULL`, ‏`created_at`, ‏`updated_at`. ‏`skipped_duplicate` הוא רק ערך החזרה של `sendEmail`: המפתח הייחודי מונע שורה שנייה. היומן משמש כהוכחה (למשל שאישור הביטול נשלח), למניעת כפילויות ולתצוגה באדמין (קריאה למנהלי פלטפורמה בלבד, כתיבה רק מהשרת). ה-webhook של Resend (חלק 04 §22.6) מעדכן `status`. נשמר 24 חודשים (§11.5).
- **חסימות:** `bounce` ← לא שולחים כלום לכתובת; `complaint` ← לא שולחים דיוור והתראות, אבל כן מיילים שהחוק או החשבון מחייבים (קבלות, אישורי ביטול, כשל חיוב, מחיקת חשבון, ייצוא מידע); `unsubscribe` ← רק דיוור נחסם.
- **אידמפוטנטיות:** `email_messages.idempotency_key` ייחודי; בנוסף נשלחת כותרת `Idempotency-Key` ל-Resend [M0-verify]. מעקב פתיחות והקלקות **כבוי** בכל המיילים (פרטיות ואמון).
- **שגיאות:** 3 ניסיונות חוזרים עם השהיה (חלק מה-step שקורא ל-`sendEmail`); כשל סופי ← `status = failed`, Sentry, ובמיילים קריטיים (קבלה, אישור ביטול) — התראת אדמין.
- **תצוגה ובדיקה:** `pnpm emails:dev` (שרת התצוגה של React Email) עם fixture לכל תבנית ולכל וריאנט; בדיקות snapshot ל-HTML ולטקסט.

### 12.2 כללי HTML למייל בעברית (RTL)

1. `<Html lang="he" dir="rtl">`; בכל `<table>` גם `dir="rtl"`, ובכל `<td>` ‏`align="right"` + `style="text-align:right"` — Outlook לשולחן העבודה מתעלם מ-`direction` ב-CSS של `body`.
2. פריסה בטבלאות בלבד (רכיבי `Section`/`Row`/`Column` של React Email), בלי flex ובלי grid; רוחב מרבי 560px; עמודה אחת במובייל.
3. סגנונות inline בלבד, מאובייקטים ב-`lib/email/styles.ts`. לא משתמשים ב-Tailwind במיילים (מחלקות לוגיות לא נתמכות בלקוחות מייל).
4. גופן: `Heebo, Arial, 'Segoe UI', Tahoma, sans-serif` (Heebo נטען ב-`<Font>` — Apple Mail ו-iOS מכבדים, Gmail נופל ל-Arial). גוף 16px/1.7, כותרת 24px במשקל 800, טקסט משני 14px. בלי `letter-spacing`, בלי אותיות מוטות.
5. **רצפים משמאל לימין** (מיילים, כתובות, טלפונים, 4 ספרות של כרטיס, מספרי מסמך, יחסי מסך כמו 9:16) עטופים ב-`<span dir="ltr">`; כשרצף כזה מסיים משפט, מוסיפים `&rlm;` אחרי סימן הפיסוק. רכיב עזר `<Ltr>` ב-`lib/email/components.tsx`.
6. כפתורים "חסיני Outlook" (`<Button>` של React Email): רקע `#FFB547`, טקסט `#0A0A0F` במשקל 700, ריפוד 14×28, פינות 999px; טקסט הכפתור הוא פועל ברור.
7. ערכת צבעים בהירה בלבד (רקע `#FAF7F2`, כרטיס לבן, טקסט `#16140F`, משני `#5A554C`), `<meta name="color-scheme" content="light only">`. הלוגו ב-PNG שקוף עם קו מתאר עדין, כדי שלא ייעלם כשלקוח מייל הופך צבעים.
8. תמונות מ-`https://{{DOMAIN}}` או `public-media` בלבד, עם `width`/`height` ו-`alt` בעברית; שום מידע חשוב לא נמצא רק בתמונה.
9. Preheader (`<Preview>`) עד 90 תווים. נושא עד כ-60 תווים, בלי אימוג׳י ובלי סימני קריאה כפולים. דיוור — "פרסומת:" בתחילת הנושא.
10. טקסט נקי מקביל (`render(el, { plainText: true })`) לכל מייל; קישורים מופיעים בו במלואם.
11. נגישות: `role="presentation"` לטבלאות פריסה, טקסט קישור שמתאר את היעד, ניגודיות AA, גופן מינימלי 14px.
12. **פנייה:** מיילים למשתמש רשום מכבדים את `profiles.ui_gender_form`. ברירת המחדל (וכל נמען חיצוני — לקוח מאשר, מוזמן, מנוי ניוזלטר) — רבים. הנוסח שלהלן כתוב ברבים, וכל מחרוזת עם פנייה היא ICU `select` ב-`messages/he.json` (`emails.*`) לפי טבלת ההמרה ב-12.6. `lib/hebrew/lint.ts` נכשל אם מחרוזת ב-`emails.*` מכילה אחת מצורות הרבים שבטבלה בלי שלושת הענפים.
13. בדיקה ידנית בכל אבן דרך שמוסיפה מייל: Gmail (ווב ואנדרואיד), Apple Mail (iOS), Outlook (ווב ו-Windows) — צילומי מסך ב-`docs/qa/emails/`.

### 12.3 השלד המשותף (`EmailLayout`)

- **כותרת:** הלוגו (`alt="{{BRAND_NAME}}"`), מקושר ל-`https://{{DOMAIN}}`.
- **כרטיס תוכן:** כותרת (H1), פסקאות, טבלת פרטים (אופציונלי), כפתור אחד ראשי לכל היותר, הערה קטנה.
- **תחתית מערכת:** **"המייל נשלח לכתובת {email} בקשר לחשבון ב{{BRAND_NAME}}."** · במיילים מסוג `notification`: קישור **"ניהול ההתראות"** (`/app/settings/notifications`) · **"{{LEGAL_ENTITY_NAME}} · {{LEGAL_ADDRESS}}"** · **"שאלות? אפשר פשוט להשיב למייל הזה."**
- **תחתית דיוור:** כל שורות תחתית המערכת, ובנוסף: **"קיבלתם את המייל כי נרשמתם לעדכונים מ{{BRAND_NAME}} ב-{consentDate}."** + קישור **"הסרה מרשימת התפוצה"** (ל-`/unsubscribe?token=`) ושורת יצירת קשר: **"hello@{{DOMAIN}} · {{SUPPORT_PHONE}}"**.
- **תחתית לנמען חיצוני (אישור לקוח):** **"המייל נשלח לבקשת {agencyName}. לא ציפיתם למייל הזה? אפשר להתעלם ממנו."** וכש-`resolveShareBranding(link).whiteLabel` כבוי, גם **"נשלח באמצעות {{BRAND_NAME}}."**

### 12.4 קטלוג התבניות

| `key` | סוג | מתי | למי | ניתן לכיבוי | מפתח אידמפוטנטיות | צרופה |
|---|---|---|---|---|---|---|
| `magic_link` | auth | כניסה | המשתמש | — | (Supabase) | — |
| `welcome` | transactional | כניסה ראשונה | המשתמש | לא | `welcome:{userId}` | — |
| `video_ready` | notification | עבודה הצליחה | מי שהפעיל | כן (`job_succeeded`) | `video_ready:{jobId}` | — |
| `video_failed_refunded` | notification | עבודה נכשלה | מי שהפעיל | כן (`job_failed`) | `video_failed:{jobId}` | — |
| `payment_receipt` | transactional | חשבונית הופקה (או 30 ד׳ בלי חשבונית) | מייל החיוב (ובעלים אם שונה) | לא | `payment_receipt:{paymentId}` | PDF |
| `invoice_ready` ★ | transactional | חשבונית שהתעכבה / מספר הקצאה עודכן | מייל החיוב | לא | `invoice_ready:{invoiceId}:{version}` | PDF |
| `payment_failed` | transactional | חידוש נכשל (4 וריאנטים) | בעלים + מנהלים | לא | `payment_failed:{subId}:{periodEndISO}:{attempt}` | — |
| `subscription_canceled` | transactional | ביטול (כל ערוץ) | בעלים + מייל החיוב | לא | `subscription_canceled:{subId}` | — |
| `renewal_upcoming` | transactional | 7 ימים לפני חידוש שנתי | בעלים + מייל החיוב | לא | `renewal_upcoming:{subId}:{periodEndISO}` | — |
| `plan_change_scheduled` ★ | transactional | שנמוך או מעבר מחזור נקבע | בעלים | לא | `plan_change_scheduled:{subId}:{requestedAtISO}` | — |
| `price_change_notice` ★ | transactional | שינוי מחיר (מע״מ; הטבה ב-v2) | בעלים + מייל החיוב | לא | `price_change:{subId}:{effectiveISO}` | — |
| `refund_request_received` ★ | transactional | בקשת החזר ידנית | בעלים | לא | `refund_received:{refundRequestId}` | — |
| `refund_processed` ★ | transactional | ההחזר בוצע | מייל החיוב | לא | `refund_processed:{refundRequestId}` | PDF זיכוי |
| `refund_rejected` ★ | transactional | בקשה ידנית נדחתה | בעלים | לא | `refund_rejected:{refundRequestId}` | — |
| `low_credits` | notification | יתרה נמוכה (פעם בשבוע לכל היותר) | בעלים + מנהלים | כן (`credits_low`) | `low_credits:{ws}:{isoWeek}` | — |
| `client_approval_request` | transactional | נוצר קישור אישור עם מייל ללקוח | הלקוח המאשר | — | `approval_request:{shareLinkId}` | — |
| `approval_received` | notification | הלקוח החליט | יוצר הקישור | כן (`approval_received`) | `approval_received:{approvalId}` | — |
| `team_invite` | transactional | הזמנה | המוזמן | — | `team_invite:{inviteId}` | — |
| `data_export_ready` | transactional | הייצוא מוכן | המשתמש | לא | `data_export:{requestId}` | — |
| `account_deleted` | transactional | המחיקה הושלמה | הכתובת שנשמרה | לא | `account_deleted:{userId}` | — |
| `terms_update` ★ | transactional | שינוי מהותי במסמך משפטי | כל המשתמשים הפעילים | לא | `terms_update:{doc}:{version}:{userId}` | — |
| `newsletter_confirm` | transactional | הרשמה לניוזלטר | הכתובת | — | `newsletter_confirm:{emailHash}:{day}` | — |
| `newsletter_weekly` ★ | **marketing** | שליחה ידנית (`pnpm send-newsletter`; אין נתיב אדמין ב-MVP) | בעלי הסכמה בתוקף | הסרה בלחיצה | `newsletter:{issueId}:{emailHash}` | — |
| `admin_alert` ★ | internal | התראה תפעולית | `ADMIN_EMAILS` | — | `alert:{kind}:{bucket}` | — |
| `support_contact` ★ | internal | טופס יצירת הקשר, וגם דיווח על תוכן מעמוד שיתוף (נושא "דיווח על תוכן", נשלח ל-`BRAND.emails.abuse`) | תיבת התמיכה | — | `contact:{messageId}` · `abuse:{abuseReportId}` | — |
| `security_notice` ★ | transactional | אירוע אבטחה, שליחה ידנית אחרי אישור משפטי (R7) | המשתמשים שנפגעו | לא | `security_notice:{incidentId}:{userId}` | — |

**26 מפתחות; `EmailKey` (`lib/email/templates/index.ts`) הוא האיחוד שלהם**, ו-`email_messages.template_key` מקבל רק אותם. `magic_link` הוא תבנית Supabase (חלק 04 §1.3) ולא נשלח דרך `sendEmail`. `admin_alert` נכתב באנגלית (פנימי, כמו הלוגים); כל השאר — בעברית, במרחב `emails.*` של `messages/he.json`. תבניות WhatsApp (v2) — §13.3.

### 12.5 הנוסח המלא

הסוגריים המסולסלים הם משתנים; `{{BRAND_NAME}}` ו-`{{DOMAIN}}` מגיעים מ-`BRAND`. תאריכים: `formatDate` / `formatDateTime` של חלק 01 §2.5 (למשל "13 בנובמבר 2026", ועם שעה "13 בנובמבר 2026, 14:30"). סכומים: ₪ לפני המספר, שתי ספרות אחרי הנקודה רק כשיש אגורות.
**מוסכמת סכומים בנוסח (מחייבת לכל החלק):** `₪{amount}` בנוסח שכאן מסמן משתנה סכום. ב-`messages/he.json` כותבים רק `{amount}`, והערך מגיע מעוצב מ-`formatAgorot` (כבר עם ₪ בתחילתו). אסור לכתוב ₪ בקובץ ההודעות ליד משתנה (חלק 01 §2.1; ₪ כפול הוא באג שבדיקת ה-snapshot תופסת). גם סכומים קבועים שמופיעים בנוסח — תקרת דמי הביטול ₪100 (`CANCEL_FEE_CAP_AG`), מחיר החבילה הזולה ₪59 (מה-seed), בדיקת המסגרת ₪1 — מגיעים כמשתנים (`{feeCap}`, `{minPackPrice}`, `{verifyAmount}`), כדי ששינוי במחיר או בחוק לא ידרוש עריכת מחרוזות.

#### `welcome`
- **נושא:** ברוכים הבאים ל{{BRAND_NAME}}
- **Preheader:** {trialCredits} קרדיטים לניסיון כבר בחשבון. ככה מתחילים.
- **H1:** החשבון מוכן
- **גוף:**
  - שלום {firstName},
  - טוב שהגעתם. בחשבון כבר מחכים {trialCredits} קרדיטים לניסיון — מספיק בערך {trialVideos, plural, one {לסרטון קצר אחד} two {לשני סרטונים קצרים} other {ל-# סרטונים קצרים}} באיכות טיוטה, עם סימן מים, בלי כרטיס אשראי. (`trialVideos` = `videosLeft(trialCredits, "free")`, §2.6; 2 עם ה-seed.)
  - ככה יוצרים את הסרטון הראשון:
    1. בוחרים נישה ומדביקים קישור לאתר או לאינסטגרם של העסק. אין אתר? מספיק לתאר את העסק במשפט.
    2. בוחרים הוק — משפט פתיחה שעוצר גלילה — מתוך ההצעות לנישה.
    3. מאשרים את התסריט ומקבלים סרטון עם קריינות וכתוביות בעברית.
- **כפתור:** ליצירת הסרטון הראשון ← `/app/create`
- **הערה:** לפני כל יצירה מוצג כמה קרדיטים היא עולה, ויצירה שנכשלה מחזירה את הקרדיטים אוטומטית.
- **וריאנט בלי קרדיטי ניסיון** (`trial_status ≠ granted`) — הפסקה השנייה מוחלפת: "טוב שהגעתם. הפעם החשבון נפתח בלי קרדיטי ניסיון, כי {reasonHe}. פרטים על קרדיטים ותוכניות נמצאים בעמוד החיוב." · `reasonHe`: `already_claimed` — "כתובת המייל הזו כבר קיבלה קרדיטים לניסיון"; `disposable_email` — "כתובות מייל זמניות לא מקבלות קרדיטי ניסיון". הכפתור: **"לעמוד החיוב"** ← `/app/billing` (בלי הצעת רכישה, כמו ב-`low_credits`). ב-`no_identifier` (הרשמה בלי כתובת מייל, חלק 03 §3.5) אין למי לשלוח, ולכן `welcome` לא נשלח.

#### `video_ready`
- **נושא:** הסרטון "{projectTitle}" מוכן
- **Preheader:** {formatsHe}, עם קריינות וכתוביות בעברית. מוכן להורדה ולשיתוף.
- **H1:** הסרטון מוכן
- **גוף:**
  - שלום {firstName},
  - הסרטון "{projectTitle}" מוכן לצפייה ולהורדה {formatsHe}, עם כתוביות צרובות וקובץ כתוביות נפרד (SRT).
  - (תמונת הפוסטר, מקושרת לפרויקט, `alt="פוסטר הסרטון {projectTitle}"`)
- **כפתור:** לצפייה בסרטון ← `/app/projects/{projectId}`
- **בלוק סצנות שהוחלפו** (רק כש-`degradedCount > 0`): שימו לב: {degradedCount, plural, one {סצנה אחת נבנתה} two {שתי סצנות נבנו} other {# סצנות נבנו}} מתמונה בתנועה במקום מקליפ וידאו, {refundedCredits, plural, one {והקרדיט ששמרנו לווידאו חזר ליתרה} other {ו-# הקרדיטים ששמרנו לווידאו חזרו ליתרה}}. אפשר ליצור {degradedCount, plural, one {אותה} other {אותן}} מחדש בעורך.
- **לפני שמפרסמים:**
  - לבדוק שהמחירים, הטלפון והכתובת בסרטון נכונים.
  - סרטון עם אנשים או מקומות שנראים אמיתיים? באינסטגרם, בטיקטוק וביוטיוב צריך לסמן אותו כתוכן שנוצר ב-AI.
  - באתר העסק כדאי להעלות גם את קובץ הכתוביות — זה חלק מהנגשת הסרטון.
- **הערה:** היצירה עלתה {credits, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}. {balance, plural, =0 {היתרה ריקה} one {ביתרה נשאר קרדיט אחד} two {ביתרה נשארו שני קרדיטים} other {ביתרה נשארו # קרדיטים}}.
- `formatsHe` הוא הביטוי כולו, עם יחסי המסך עטופים ב-`<Ltr>`: כמה פורמטים — "בפורמטים 9:16, 1:1 ו-16:9" (מחוברים ב"," וב"ו-"); פורמט יחיד — "בפורמט 9:16". ב-Preheader הוא מופיע בתחילת המשפט כמו שהוא.

#### `video_failed_refunded`
- **נושא:** היצירה של "{projectTitle}" לא הושלמה. הקרדיטים חזרו
- **Preheader:** {credits, plural, one {הקרדיט חזר ליתרה} other {כל # הקרדיטים חזרו ליתרה}}. ניסיון חוזר ישתמש במה שכבר נוצר.
- **H1:** היצירה לא הושלמה
- **גוף:**
  - שלום {firstName},
  - היצירה של "{projectTitle}" נעצרה בשלב {stageHe}, בגלל {reasonHe}.
  - **{credits, plural, one {הקרדיט שנשמר ליצירה חזר ליתרה} other {כל # הקרדיטים שנשמרו ליצירה חזרו ליתרה}}. לא בוצע חיוב.**
  - בניסיון חוזר נשתמש בכל מה שכבר הצליח, כמו הקריינות והתמונות, כך שהוא יהיה מהיר יותר ולא יחייב שוב על החלקים האלה.
- **כפתור:** לניסיון חוזר ← `/app/projects/{projectId}/jobs/{jobId}`
- **הערה:** אם זה קורה שוב, אפשר פשוט להשיב למייל הזה ונבדוק מה קרה.
- `stageHe` (לפי `jobs.stage`): `queued` "ההתחלה" · `voice` "הקריינות" · `captions` "הכתוביות" · `keyframes`/`clips` "יצירת הסצנות" · `music` "המוזיקה" · `render` "ההרכבה" · `finalize` "הסיום".
- `reasonHe` (לפי `error_code`): `PROVIDER_UNAVAILABLE` "עומס זמני אצל ספקי ה-AI" · `PROVIDER_TIMEOUT` "חריגה מזמן היצירה המרבי" · `TTS_FAILED` "תקלה ביצירת הקריינות" · `RENDER_FAILED` "תקלה בהרכבת הסרטון" · `VIDEO_JOB_FAILED` "תקלה ביצירת התמונות לסצנות" · אחר — "תקלה טכנית אצלנו".

#### `payment_receipt`
- **נושא:** {docTypeHe} {docNumber} מ{{BRAND_NAME}} · וריאנט `invoicePending`: התשלום ל{{BRAND_NAME}} התקבל
- **Preheader:** ₪{amount} כולל מע״מ · {lineShort}
- **H1:** התשלום התקבל, תודה
- **גוף:**
  - שלום {customerName},
  - לפי סוג התשלום:
    - מנוי חודשי ראשון: המנוי לתוכנית {planName} פעיל. {monthlyCredits} קרדיטים כבר ביתרה, ובכל חודש יתווספו עוד {monthlyCredits}. החיוב הבא: {nextChargeDate}, ₪{nextAmount} כולל מע״מ.
    - מנוי שנתי: המנוי השנתי לתוכנית {planName} פעיל עד {periodEnd}. {monthlyCredits} קרדיטים כבר ביתרה, ובכל חודש יתווספו עוד {monthlyCredits}.
    - חידוש: המנוי לתוכנית {planName} חודש לתקופה {periodStart}–{periodEnd}, ו-{monthlyCredits} קרדיטים נוספו ליתרה.
    - שדרוג: השדרוג לתוכנית {planName} נכנס לתוקף. {credits, plural, one {קרדיט אחד נוסף ליתרה} two {שני קרדיטים נוספו ליתרה} other {# קרדיטים נוספו ליתרה}}. מ-{nextChargeDate} החיוב יהיה ₪{nextAmount} {cycleSuffix}.
    - חבילה: {credits, plural, one {קרדיט אחד נוסף ליתרה} two {שני קרדיטים נוספו ליתרה} other {# קרדיטים נוספו ליתרה}}. קרדיטים מחבילה לא פגים.
    - תשלום ראשון אי-פעם (תוספת): סימן המים הוסר מהסרטונים הבאים.
  - **פרטי העסקה** (טבלה):

    | | |
    |---|---|
    | מסמך | {docTypeHe} {docNumber} |
    | מספר הקצאה | {allocationNumber} (רק כשיש) |
    | תאריך | {paidAt} |
    | פירוט | {lineDescription} |
    | לפני מע״מ | ₪{net} |
    | מע״מ ({vatPercent}%) | ₪{vat} |
    | סה״כ ששולם | ₪{amount} |
    | אמצעי תשלום | כרטיס {cardBrandHe} שמסתיים ב-{last4} · או: Bit |
    | העסק | {{LEGAL_ENTITY_NAME}}, ח״פ {{COMPANY_ID}}, {{LEGAL_ADDRESS}} |

  - החשבונית מצורפת כקובץ PDF, והיא זמינה גם בעמוד החיוב. · וריאנט `invoicePending`: החשבונית תישלח במייל נפרד בשעות הקרובות.
- **כפתור:** לעמוד החיוב ← `/app/billing`
- **תיבת "ביטול והחזרים"** (מסמך הגילוי):
  - במנויים: אפשר לבטל את המנוי בכל רגע — בכפתור "ביטול מנוי" בעמוד החיוב, בקישור "ביטול מנוי" בתחתית האתר, במייל ל-billing@{{DOMAIN}} או בטלפון {{SUPPORT_PHONE}}. אחרי ביטול לא יהיו חיובים נוספים.
  - בתשלום ראשון, בשדרוג ובחבילה: עד {refundDeadline} אפשר לבטל את העסקה ולקבל החזר, בניכוי שווי הקרדיטים שנוצלו ודמי ביטול של 5% (ולא יותר מ-{feeCap}). הפרטים במדיניות הביטול. (קישור ל-`/legal/cancellation`)
- `cardBrandHe`: ויזה · מאסטרקארד · ישראכרט · אמריקן אקספרס · דיינרס · אשראי (`other`), כך שהשורה היא "כרטיס ויזה שמסתיים ב-…" או "כרטיס אשראי שמסתיים ב-…".
- `docTypeHe` (לפי `invoices.doc_type`): ב-`payment_receipt` תמיד **"חשבונית מס-קבלה"** (`tax_invoice_receipt`; כל תשלום מקבל אותה, §9.2, ועוסק פטור לא נתמך). ב-`invoice_ready` אחרי צירוף ידני של זיכוי (חלק 04 §24.1) — **"חשבונית זיכוי"** (`credit_invoice`). אין ערך עבור `receipt`, כי הוא לא מונפק. המשתנה נשאר כדי שהנוסח יהיה במקום אחד: אותו ערך בנושא, בטבלה ובמייל `invoice_ready`.
- `monthlyCredits` = `plans.monthly_credits` של התוכנית (קבוע מה-seed, ברשימת החריגים של כלל הרבים ב-`lint:copy`); `credits` בשדרוג ובחבילה — ICU `plural`.

#### `invoice_ready`
- **נושא:** {docTypeHe} {docNumber} מ{{BRAND_NAME}}
- **H1:** החשבונית מצורפת
- **גוף:** שלום {customerName}, · מצורפת החשבונית על התשלום מ-{paidAt} בסך ₪{amount}. · (כשעודכן מספר הקצאה) החשבונית עודכנה עם מספר ההקצאה {allocationNumber} מרשות המסים. · (כשמספר ההקצאה לא התקבל) לא קיבלנו עדיין מספר הקצאה מרשות המסים לחשבונית הזו. כדאי לוודא שמספר העוסק בפרטי החיוב נכון; נשלח חשבונית מעודכנת כשהמספר יתקבל.
- **כפתור:** לעמוד החיוב

#### `payment_failed`
| וריאנט | נושא | Preheader |
|---|---|---|
| `first` | החיוב על המנוי ב{{BRAND_NAME}} לא עבר | החשבון ממשיך לעבוד. ננסה שוב ב-{nextRetryDate}. |
| `second` | עדיין לא הצלחנו לחייב את המנוי ב{{BRAND_NAME}} | הניסיון הבא: {nextRetryDate}. עדכון כרטיס יחייב מיד. |
| `last_warning` | ניסיון אחרון לחידוש המנוי ב{{BRAND_NAME}} ב-{finalDate} | אם החיוב לא יעבור, המנוי יסתיים. |
| `final` | המנוי ב{{BRAND_NAME}} הסתיים כי החיוב לא עבר | הפרויקטים והסרטונים נשמרו. אפשר לחדש בכל רגע. |

- **H1:** `first`/`second`: החיוב לא עבר · `last_warning`: ניסיון אחרון · `final`: המנוי הסתיים
- **גוף (`first`, `second`, `last_warning`):**
  - שלום {firstName},
  - ניסינו לחייב את הכרטיס שמסתיים ב-{last4} ב-₪{amount} עבור תוכנית {planName}, והחיוב לא עבר{reasonSuffix}.
  - `first`: החשבון ממשיך לעבוד כרגיל. ננסה לחייב שוב ב-{nextRetryDate}.
  - `second`: זה הניסיון השני שלא עבר. ננסה שוב ב-{nextRetryDate}.
  - `last_warning`: אם החיוב ב-{finalDate} לא יעבור, המנוי יסתיים והחשבון יעבור לתוכנית החינמית. הפרויקטים והסרטונים יישמרו.
  - אפשר לעדכן אמצעי תשלום כבר עכשיו — ננסה לחייב מיד, ולא יהיו חיובים כפולים.
  - **כפתור:** עדכון אמצעי תשלום ← `/app/billing`
  - **הערה:** עד שהחיוב יעבור, המכסה החודשית החדשה לא נכנסת ליתרה. הקרדיטים שכבר ביתרה זמינים כרגיל.
- **גוף (`final`):**
  - שלום {firstName},
  - ניסינו לחייב את הכרטיס ארבע פעמים מאז {dueDate}, ולא הצלחנו. לכן המנוי לתוכנית {planName} הסתיים, והחשבון עבר לתוכנית החינמית.
  - על התקופה שלא שולמה לא בוצע חיוב.
  - מה נשאר בחשבון: הפרויקטים, הסרטונים וערכות המותג; קרדיטים מחבילות; וקרדיטים מהמנוי — עד {expiresAt}.
  - **כפתור:** חידוש המנוי ← `/app/billing/plans?plan={planId}&cycle={cycle}`

#### `subscription_canceled`
- **נושא:** אישור ביטול המנוי ב{{BRAND_NAME}}
- **Preheader:** לא יהיו חיובים נוספים. החשבון פעיל עד {periodEnd}. (עם החזר: ההחזר בסך ₪{refund} בטיפול.)
- **H1:** המנוי בוטל
- **גוף:**
  - שלום {firstName},
  - קיבלנו את בקשת הביטול, והמנוי לתוכנית {planName} בוטל.
  - טבלה: **תאריך הביטול** {canceledAt} · **אופן הביטול** {channelHe} · **מספר אסמכתה** {reference} · **חיובים נוספים** לא יהיו · **החשבון פעיל עד** {periodEnd} (עם החזר: "הוא עבר כבר עכשיו לתוכנית החינמית")
  - מה קורה עכשיו (בלי החזר):
    - עד {periodEnd} החשבון ממשיך לעבוד בתוכנית {planName}, ואז יעבור לתוכנית החינמית.
    - קרדיטים מהמנוי זמינים עד {expiresAt}. קרדיטים מחבילות לא פגים.
    - הפרויקטים, הסרטונים וערכות המותג נשארים בחשבון גם בתוכנית החינמית.
  - **בלוק החזר (14 יום):** ביקשתם החזר על התשלום מ-{paidAt}. כך הוא מחושב: שולם ₪{paid} · {creditsUsed, plural, =0 {שווי הקרדיטים שנוצלו} one {שווי הקרדיט שנוצל} other {שווי # הקרדיטים שנוצלו}} ₪{consumed} · דמי ביטול ₪{fee} · **סכום ההחזר ₪{refund}**. כיוון שביקשתם החזר, המנוי נסגר כבר עכשיו, והקרדיטים שנותרו מהתשלום הזה הוסרו. ההחזר יבוצע לכרטיס שבו שילמתם, בדרך כלל תוך כמה ימי עסקים ולא יאוחר מ-14 יום, ותישלח חשבונית זיכוי.
  - **בלוק החזר יחסי (שנתי):** ביקשתם החזר יחסי על המנוי השנתי. {monthsStarted, plural, one {חודש אחד כבר התחיל} two {חודשיים כבר התחילו} other {# חודשים כבר התחילו}} (₪{keep}), ולכן ההחזר הוא ₪{refund}. הגישה לתוכנית {planName} תסתיים ב-{accessEnds}, ואחרי התאריך הזה לא יתווספו קרדיטים חודשיים.
  - **בלוק זכאות מורחבת:** קיבלנו גם את הבקשה לתקופת ביטול מורחבת. נציג יחזור אליכם תוך 2 ימי עסקים, עד {slaDate}, כדי להשלים את ההחזר.
  - **בלוק חידוש** (בלי החזר ולפני סוף התקופה): התחרטתם? עד {periodEnd} אפשר לחדש את המנוי בעמוד החיוב, באותו מחיר. **כפתור:** חידוש המנוי ← `/app/billing`
- **הערה:** כדאי לשמור את המייל הזה כאישור על הביטול.
- `channelHe`: `app` "בעמוד החיוב באפליקציה" · `email` "במייל" · `phone` "בטלפון". `reference`: `C-{yyMMdd}-{4 תווים ראשונים של מזהה המנוי באותיות גדולות}`.

#### `renewal_upcoming`
- **נושא:** המנוי השנתי ב{{BRAND_NAME}} יתחדש ב-{renewalDate}
- **Preheader:** חיוב של ₪{amount} כולל מע״מ. אפשר לבטל עד אז אונליין בעמוד החיוב.
- **H1:** תזכורת: חידוש שנתי
- **גוף:**
  - שלום {firstName},
  - המנוי השנתי לתוכנית {planName} יתחדש אוטומטית ב-{renewalDate}, בחיוב של ₪{amount} כולל מע״מ בכרטיס שמסתיים ב-{last4}.
  - (כשיש נתונים) בשנה האחרונה {videosCount, plural, one {נוצר בחשבון סרטון אחד} two {נוצרו בחשבון שני סרטונים} other {נוצרו בחשבון # סרטונים}}, {creditsUsed, plural, one {ונוצל קרדיט אחד} two {ונוצלו שני קרדיטים} other {ונוצלו # קרדיטים}}.
  - רוצים להמשיך? לא צריך לעשות כלום.
  - לא רוצים לחדש? אפשר לבטל עד {renewalDate} אונליין בעמוד החיוב, ולא תחויבו.
- **כפתור:** לעמוד החיוב · **קישור משני:** ביטול מנוי ← `/app/billing/cancel`

#### `plan_change_scheduled`
- **נושא:** המעבר לתוכנית {newPlanName} ייכנס לתוקף ב-{effectiveDate}
- **H1:** המעבר נקבע
- **גוף:**
  - שלום {firstName},
  - קבענו את המעבר מתוכנית {currentPlanName} לתוכנית {newPlanName} ({cycleHe}). עד {effectiveDate} הכול נשאר כמו שהוא.
  - מ-{effectiveDate} החיוב יהיה ₪{newPrice} {cycleSuffix} כולל מע״מ, ובכל חודש {newCredits, plural, one {יתווסף קרדיט אחד} two {יתווספו שני קרדיטים} other {יתווספו # קרדיטים}}. הקרדיטים שכבר ביתרה נשארים לפי התוקף שלהם.
  - (כשיש השפעות) מה ישתנה: {impactsList} — אותם ניסוחים כמו בדיאלוג (חלק 03 §15.3).
  - שיניתם את דעתכם? אפשר לבטל את המעבר בעמוד החיוב עד {effectiveDate}.
- **כפתור:** לעמוד החיוב

#### `price_change_notice`
- **נושא:** עדכון במחיר המנוי ב{{BRAND_NAME}} מ-{effectiveDate}
- **H1:** עדכון מחיר
- **גוף:**
  - שלום {firstName},
  - (מע״מ) בעקבות שינוי שיעור המע״מ מ-{oldVat}% ל-{newVat}%, המחיר של תוכנית {planName} יהיה ₪{newPrice} {cycleSuffix} כולל מע״מ, במקום ₪{oldPrice}. השינוי יחול מהחיוב ב-{effectiveDate}. המחיר לפני מע״מ לא משתנה.
  - (הטבה, v2) תקופת ההטבה מסתיימת ב-{promoEnds}. מהחיוב ב-{effectiveDate} המחיר יהיה ₪{newPrice} {cycleSuffix} כולל מע״מ.
  - אפשר להמשיך בלי לעשות כלום, או לבטל את המנוי בכל רגע אונליין בעמוד החיוב, בלי עלות.
- **כפתור:** לעמוד החיוב

#### `refund_request_received`
- **נושא:** קיבלנו את בקשת ההחזר
- **H1:** הבקשה התקבלה
- **גוף:**
  - שלום {firstName},
  - קיבלנו ב-{requestedAt} את בקשת ההחזר על התשלום מ-{paidAt} (₪{amount}). מספר הבקשה: {reference}.
  - נציג יחזור אליכם תוך 2 ימי עסקים, עד {slaDate}. (זכאות מורחבת) ייתכן שנבקש מסמך שמאמת את הזכאות לתקופת הביטול המורחבת.
  - שימו לב: קרדיטים מהרכישה הזו שתנצלו עד הטיפול בבקשה ינוכו מסכום ההחזר.
- **כפתור:** לעמוד החיוב

#### `refund_processed`
- **נושא:** ההחזר בסך ₪{refund} בוצע
- **Preheader:** חשבונית זיכוי {docNumber} מצורפת.
- **H1:** ההחזר בוצע
- **גוף:**
  - שלום {customerName},
  - ההחזר על התשלום מ-{paidAt} בוצע ב-{refundedAt}, לכרטיס שמסתיים ב-{last4}. (Bit: לחשבון ה-Bit שממנו שילמתם.)
  - הזיכוי מופיע בדרך כלל בפירוט החיובים תוך מחזור חיוב אחד או שניים, לפי חברת האשראי.
  - טבלה: שולם ₪{paid} · שווי הקרדיטים שנוצלו ₪{consumed} · דמי ביטול ₪{fee} · **הוחזר ₪{refund}**
  - חשבונית זיכוי {docNumber} מצורפת.
  - (כשהוסרו קרדיטים) {creditsRevoked, plural, one {קרדיט אחד שנותר מהרכישה הוסר מהיתרה} two {שני קרדיטים שנותרו מהרכישה הוסרו מהיתרה} other {# קרדיטים שנותרו מהרכישה הוסרו מהיתרה}}.
  - (במנוי) המנוי לתוכנית {planName} נסגר, והחשבון עבר לתוכנית החינמית. · (שנתי יחסי) הגישה לתוכנית {planName} תסתיים ב-{accessEnds}.
- **כפתור:** לעמוד החיוב

#### `refund_rejected`
- **נושא:** עדכון על בקשת ההחזר ב{{BRAND_NAME}}
- **H1:** בדקנו את בקשת ההחזר
- **גוף:**
  - שלום {customerName},
  - בדקנו את בקשת ההחזר על התשלום מ-{paidAt} (₪{amount}), ולא נוכל לאשר אותה, מהסיבה הזו:
  - (ציטוט) {reasonHe}
  - אם לדעתכם נפלה טעות, או שיש פרטים שלא ידענו, אפשר להשיב למייל הזה ונבדוק שוב.
  - מצב המנוי: {subscriptionStatusHe} ("המנוי בוטל ויסתיים ב-{periodEnd}" · "המנוי פעיל" · "אין מנוי פעיל").
- **כפתור:** לעמוד החיוב

#### `low_credits`
- **נושא:** {balance, plural, one {נשאר קרדיט אחד} two {נשארו שני קרדיטים} other {נשארו # קרדיטים}} ב{{BRAND_NAME}}
- **Preheader:** {videosLeft, plural, =0 {פחות מסרטון קצר אחד} one {בערך סרטון קצר אחד} other {בערך # סרטונים קצרים}}. עדכון על היתרה בחשבון.
- **H1:** היתרה נמוכה
- **גוף:**
  - שלום {firstName},
  - ביתרה של "{workspaceName}" {balance, plural, one {נשאר קרדיט אחד} two {נשארו שני קרדיטים} other {נשארו # קרדיטים}} — {videosLeft, plural, =0 {פחות מסרטון קצר אחד} one {בערך סרטון קצר אחד} other {בערך # סרטונים קצרים}}.
  - (מנוי) המכסה החודשית ({monthlyCredits} קרדיטים) מתחדשת ב-{resetDate}. · (חינם) בתוכנית החינמית אין מכסה חודשית.
- **כפתור:** לעמוד החיוב ← `/app/billing`
- **הערה:** לא רוצים לקבל את ההתראה הזו? אפשר לכבות אותה בהגדרות ההתראות.
- **הודעת שירות, לא דיוור** (§11.8 ⚖️, §25): בלי מחירים, בלי חבילה או תוכנית מוצעת ובלי כפתור רכישה, ולכן בלי "פרסומת:" ובלי קישור הסרה של ס׳ 30א; הכיבוי בהגדרות ההתראות נשאר. פרטים על חבילות ותוכניות נמצאים בעמוד החיוב.
- `videosLeft` = `videosLeft(balance, planId)` מ-`lib/billing/credits.ts` (§2.6). המייל נשלח כש-`balance < lowThreshold(summary, planId)` (`/api/cron/reminders`, חלק 04 §23), לכל היותר פעם בשבוע.

#### `client_approval_request`
- **נושא:** סרטון לאישור: "{projectTitle}"
- **Preheader:** {agencyName} מבקשים את האישור שלכם. צפייה ואישור בלי הרשמה.
- **H1:** יש סרטון שמחכה לאישור
- **גוף:**
  - שלום {approverName}, (בלי שם: שלום,)
  - התקבל סרטון לאישור מאת {agencyName}: "{projectTitle}".
  - (כשיש) ההודעה שצורפה: {senderNote}
  - אפשר לצפות בסרטון, לאשר אותו או לבקש שינויים — בלי להירשם ובלי סיסמה.
- **כפתור:** לצפייה ולאישור ← `https://{{DOMAIN}}/approve/{token}`
- **הערה:** הקישור בתוקף עד {expiresAt}. (בקישור ללא תוקף — בלי השורה הזו.)
- **מקור המשתנים:** `POST /api/share` עם `kind: "client_approval"` ו-`approverEmail` (חלק 04 §20.5) שולח את המייל מתוך הבקשה עצמה, כי הטוקן הגולמי לא נשמר: `{approverName}` ← `ShareCreateBody.approverName` (`share_links.approver_name`), `{senderNote}` ← `senderNote` (`share_links.sender_note`), `{agencyName}` ← `resolveShareBranding(link).senderName` (שם הסוכנות בסביבת לקוח, אחרת שם העסק; נקבע בזמן השליחה, §12.1), `{expiresAt}` ← `share_links.expires_at`. הנמען = `approverEmail`.

#### `approval_received`
- **נושא:** `approved` — הסרטון "{projectTitle}" אושר · `changes_requested` — התקבלה בקשת שינויים לסרטון "{projectTitle}"
- **H1:** הסרטון אושר · יש בקשת שינויים
- **גוף:**
  - שלום {firstName},
  - `approved`: התקבל אישור לסרטון "{projectTitle}" מאת {approverName}, ב-{decidedAt}.
  - `changes_requested`: התקבלה בקשת שינויים מאת {approverName}, ב-{decidedAt}. אפשר לערוך את הסצנות, להרכיב מחדש ולשלוח קישור אישור חדש.
  - (כשיש) ההערה שצורפה: {comment}
- **כפתור:** לפרויקט ← `/app/projects/{projectId}` · ב-`changes_requested`: לעורך ← `/app/projects/{projectId}/editor`

#### `team_invite`
- **נושא:** הזמנה להצטרף ל"{workspaceName}" ב{{BRAND_NAME}}
- **Preheader:** הזמנה מאת {inviterName} לעבוד יחד על הסרטונים של "{workspaceName}".
- **H1:** הזמנה להצטרף לצוות
- **גוף:**
  - שלום,
  - התקבלה הזמנה מאת {inviterName} להצטרף לסביבת העבודה "{workspaceName}" ב{{BRAND_NAME}}, בתפקיד {roleHe}.
  - `admin`: מנהלים יכולים לנהל את הצוות, את הקרדיטים ואת החיובים. · `editor`: עורכים יכולים ליצור ולערוך סרטונים. · `viewer`: צופים יכולים לצפות בסרטונים ולהוריד אותם.
- **כפתור:** הצטרפות ← `https://{{DOMAIN}}/login?invite={token}&email={urlencodedEmail}&next=/app` (`email` רק ממלא מראש את השדה; `before_send` של PostHog מסיר `invite` ו-`email`; אחרי ההתחברות `/auth/callback` קורא ל-`POST /api/invites/accept`, חלק 04 §1.3)
- **הערה:** ההזמנה בתוקף עד {expiresAt}. לא מכירים את {inviterName}? אפשר להתעלם מהמייל.

#### `data_export_ready`
- **נושא:** העותק של המידע מ{{BRAND_NAME}} מוכן
- **Preheader:** הקובץ זמין להורדה עד {expiresAt}.
- **H1:** העותק מוכן להורדה
- **גוף:**
  - שלום {firstName},
  - העותק של המידע שהתבקש ב-{requestedAt} מוכן: פרטי החשבון, הפרויקטים, ההסכמות{invoicesClause} והקבצים. (`invoicesClause` לבעלים ולמנהלים: ", החשבוניות")
  - מטעמי אבטחה, ההורדה זמינה רק אחרי התחברות לחשבון.
- **כפתור:** להורדה ← `/app/settings/privacy`
- **הערה:** הקובץ יימחק אוטומטית ב-{expiresAt}. לא ביקשתם עותק? כתבו לנו מיד ל-privacy@{{DOMAIN}}.

#### `account_deleted`
- **נושא:** החשבון ב{{BRAND_NAME}} נמחק
- **H1:** החשבון נמחק
- **גוף:**
  - שלום,
  - לבקשתכם, החשבון שמשויך לכתובת {email} נמחק ב-{deletedAt}.
  - מה נמחק: הפרופיל, סביבות העבודה שבבעלותכם, הפרויקטים, הסרטונים והקבצים. עותקים בגיבויים המוצפנים נמחקים כשתקופת השמירה של הגיבוי מסתיימת, לכל המאוחר אחרי 12 חודשים, ולא משמשים לשחזור החשבון.
  - מה נשמר: רשומות תשלום וחשבוניות, כפי שדיני המס מחייבים (7 שנים), ורישומי ההסכמות — בלי פרופיל ובלי תוכן.
  - מנויים פעילים בוטלו, ולא יהיו חיובים נוספים.
  - לא ביקשתם למחוק את החשבון? כתבו לנו מיד ל-privacy@{{DOMAIN}}.
  - תודה שהייתם איתנו.

#### `terms_update`
- **נושא:** עדכון ל"{docTitle}" של {{BRAND_NAME}}
- **H1:** עדכנו את {docTitle}
- **גוף:**
  - שלום {firstName},
  - עדכנו את {docTitle}. הגרסה החדשה תיכנס לתוקף ב-{effectiveDate}.
  - השינויים העיקריים: {summaryItems} (רשימה של 2–5 שורות שנכתבות עם השינוי)
  - את הגרסה המלאה, וגם את הגרסה הקודמת, אפשר לקרוא באתר.
  - אם לא תרצו להמשיך לפי הגרסה החדשה, אפשר לבטל את המנוי בכל רגע לפני {effectiveDate}, ולא תחויבו יותר.
- **כפתור:** לגרסה החדשה ← `/legal/{doc}`
- `docTitle`: "תנאי השימוש" · "מדיניות הפרטיות" · "מדיניות הביטול וההחזרים" · "מדיניות השימוש ההוגן ב-AI".

#### `newsletter_confirm`
- **נושא:** אישור ההרשמה לעדכונים מ{{BRAND_NAME}}
- **Preheader:** עוד לחיצה אחת, ומתחילים לשלוח את 5 ההוקים לשבוע.
- **H1:** עוד צעד אחד
- **גוף:**
  - קיבלנו בקשה לרשום את {email} ל"5 הוקים לשבוע" ולעדכונים מ{{BRAND_NAME}}.
  - כדי שנתחיל לשלוח, צריך לאשר את ההרשמה.
- **כפתור:** אישור ההרשמה ← `https://{{DOMAIN}}/api/newsletter/confirm?token={token}`
- **הערה:** הקישור בתוקף 7 ימים. לא נרשמתם? אפשר להתעלם מהמייל — בלי אישור לא נשלח שום דבר.

#### `newsletter_weekly` (דיוור — חוק הספאם חל)
- **נושא:** פרסומת: 5 הוקים לשבוע — {themeHe}
- **Preheader:** {firstHookTeaser}
- **H1:** 5 הוקים לשבוע: {themeHe}
- **מבנה:** פתיח של 1–2 משפטים (נכתב בכל גיליון) · 5 כרטיסי הוק (טקסט ההוק, סוג ההוק, נישה, קישור **"להעתקה ולהפיכה לסרטון"** ← `/hooks/h/{id}?utm_source=newsletter&utm_medium=email&utm_campaign={issueId}`) · **"טיפ השבוע"** (פסקה) · כפתור **"לכל ההוקים לנישה שלכם"** ← `/hooks/{niche}`.
- **תחתית דיוור** מלאה (12.3), כולל קישור הסרה בלחיצה, ובכותרות `List-Unsubscribe` + `List-Unsubscribe-Post`.
- **תוכן הגיליון:** `content/newsletter/{issueId}.json` — `{ themeHe, introHe, hookIds (בדיוק 5), tipHe, nicheCta }`, מאומת ב-Zod (`NewsletterIssue`); ההוקים חייבים להיות `published`.
- **שליחה:** `pnpm send-newsletter --issue={id} [--dry-run]` (`tsx scripts/send-newsletter.ts`) מתחיל workflow ‏`sendNewsletter(issueId)`: בדיקת הסכמה וחסימות לכל נמען **בזמן השליחה**, באצ׳ים לפי מגבלות Resend, רק בימים א׳–ה׳ בין 10:00 ל-19:00, לא בשבת, בחג או ביום שקט. אין נתיב אדמין לשליחה ב-MVP.

#### `support_contact` (פנימי)
- **נושא:** פנייה חדשה מהאתר: {topicHe} · {name}
- **גוף:** שם, מייל (`<Ltr>`), טלפון, נושא, ההודעה, משתמש (קישור לאדמין, אם מחובר), מועד אחרון לטיפול (בנושאי ביטול: 3 ימי עסקים; נגישות: 5; דיווח על תוכן: 2, ומיד בחשד לפגיעה בקטינים). `Reply-To` = הפונה.
- **דיווח על תוכן** (`POST /api/abuse-reports`, חלק 04 §20.6): אותה תבנית עם הנושא **"דיווח על תוכן: {reasonHe}"**, קישור לשורת `abuse_reports` ב-`/admin/abuse` ולעמוד השיתוף, ונשלח ל-`BRAND.emails.abuse`.

#### `admin_alert` (פנימי, באנגלית)
- **Subject:** `[{appEnv}] {severity} {kind}: {summary}` (למשל `[production] P1 renewals_failed: 6/20 renewals failed`).
- **גוף:** מה נמדד, הסף, החלון, הערכים האחרונים, קישור ללוח `/admin` הרלוונטי ולקובץ ה-runbook (`docs/runbooks/R{n}-{slug}.md`). בלי מידע אישי ובלי סודות; מזהים בלבד.

### 12.6 טבלת המרת פנייה (ICU `select` של `ui_gender_form`)

| רבים (`other`) | נקבה (`female`) | זכר (`male`) |
|---|---|---|
| ברוכים הבאים | ברוכה הבאה | ברוך הבא |
| טוב שהגעתם | טוב שהגעת | טוב שהגעת |
| שימו לב | שימי לב | שים לב |
| ולא תחויבו | ולא תחויבי | ולא תחויב |
| ביקשתם / לבקשתכם | ביקשת / לבקשתך | ביקשת / לבקשתך |
| שילמתם | שילמת | שילמת |
| תנצלו | תנצלי | תנצל |
| תרצו | תרצי | תרצה |
| רוצים | רוצה | רוצה |
| התחרטתם | התחרטת | התחרטת |
| שיניתם את דעתכם | שינית את דעתך | שינית את דעתך |
| לדעתכם | לדעתך | לדעתך |
| בבעלותכם | בבעלותך | בבעלותך |
| אליכם | אלייך | אליך |
| שהייתם | שהיית | שהיית |
| כתבו לנו | כתבי לנו | כתוב לנו |
| נרשמתם / קיבלתם | נרשמת / קיבלת | נרשמת / קיבלת |

כל השאר בנוסח כתוב בצורות ניטרליות ("אפשר", "כדאי", "לבדוק") ולא משתנה.

### קריטריוני קבלה
- [ ] כל 26 התבניות קיימות (25 ב-React Email, ו-`magic_link` כתבנית Supabase), עם fixture לכל וריאנט, ו-`pnpm emails:dev` מציג את ה-25.
- [ ] snapshot של ה-HTML מכיל `dir="rtl"` על `html` ועל כל `table`, ואין בו `left`/`right` ב-CSS מלבד `text-align:right`.
- [ ] `payment_receipt` כולל את כל שדות "פרטי העסקה" ואת תיבת הביטול; ב-sandbox ה-PDF מצורף.
- [ ] שליחה כפולה עם אותו `idempotencyKey` מחזירה `skipped_duplicate` ולא יוצרת שורה שנייה ב-`email_messages`.
- [ ] אין ב-`messages/he.json` (`emails.*`, ‏`billing.*`) סימן ₪ צמוד למשתנה או למספר (בדיקת `lint:copy`), וה-snapshot של `payment_receipt` מכיל "₪119" ולא "₪₪".
- [ ] כתובת עם `complaint` מקבלת `subscription_canceled` אבל לא `low_credits` ולא דיוור.
- [ ] משתמש עם `ui_gender_form = 'female'` מקבל "ביקשת" במקום "ביקשתם"; נמען חיצוני תמיד מקבל רבים.
- [ ] בדיקה ידנית ב-Gmail, Apple Mail ו-Outlook מתועדת בצילומים, בלי שבירת כיוון במספרים, במיילים וביחסי מסך.

---

## §13. וואטסאפ ו-SMS

### 13.1 עקרונות

- **בהשקה: אין הודעות וואטסאפ או SMS יזומות**, חוץ מקוד הכניסה בטלפון כשהדגל `phone_otp` פעיל (v2). התראות וואטסאפ — מאחורי הדגל `whatsapp_notify` (כבוי), להפעלה אחרי ההשקה.
- **רק הודעות שירות**, רק אחרי הסכמה מפורשת ואימות המספר, ורק בתבניות מאושרות מראש (WhatsApp Business Platform, קטגוריית Utility). **שיווק בוואטסאפ או ב-SMS — לא**, וגם כשיוחלט על כך בעתיד: הסכמה נפרדת (`marketing_whatsapp` / `marketing_sms`), "פרסומת" בתחילת ההודעה, ודרך הסרה בכל הודעה (פיצוי של עד ₪1,000 להודעה).
- **ספק:** WhatsApp Cloud API של Meta ישירות, או ספק BSP ישראלי — החלטה ב-`DECISIONS.md` בזמן ההפעלה. משתני סביבה ★: `WHATSAPP_PROVIDER` (`meta_cloud` | `mock`), `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_APP_SECRET` (אימות `X-Hub-Signature-256` ב-`POST /api/webhooks/whatsapp`, ואתגר האימות של Meta ב-`GET` של אותו נתיב — חלק 04 §22.6; דגל כבוי ← 404).

### 13.2 הסכמה ואימות (בהגדרות ההתראות, כשהדגל פעיל)

- עמודת "וואטסאפ" בטבלת ההתראות (חלק 03 §16.2), ומעליה: שדה **"מספר וואטסאפ"** (`LtrInput kind="phone"`) ותיבה **לא מסומנת**: **"אני רוצה לקבל לוואטסאפ במספר {phone} הודעות שירות על החשבון: סרטון מוכן, יצירה שנכשלה, תשובה של לקוח וחיוב שלא עבר. בלי פרסומות. אפשר להפסיק בכל רגע כאן, או בשליחת המילה "הסרה"."**
- אימות: `POST /api/account/whatsapp/start { phone }` שולח קוד בן 6 ספרות בתבנית `verify_code_he` (ה-hash שלו ב-Upstash `wa:verify:{userId}`, ‏10 דקות; עד 5 בשעה, bucket ‏`whatsapp_verify`), ושדה **"קוד האימות"** + **"אימות"** קוראים ל-`POST /api/account/whatsapp/confirm { code }` (חלק 04 §21.3). שגיאה (`INVALID_INPUT {reason:"code_invalid"}`): **"הקוד לא נכון או שפג תוקפו."** הפסקה: `POST /api/account/whatsapp/opt-out`.
- שמירה: `profiles.notification_prefs.whatsapp = { phone_e164, verified_at, opted_in_at, opted_out_at }` (רק נתיבי האימות וה-webhook כותבים את תת-האובייקט הזה) + `audit_logs` ‏`notifications.whatsapp_opt_in` / `notifications.whatsapp_opt_out` (עם IP ו-user agent) כראיה. העדפות הערוצים לכל סוג התראה נשמרות ב-`notification_prefs.kinds` (`{ [kind]: { email, whatsapp } }`; חלק 04 §4).

### 13.3 התבניות (לאישור מראש אצל Meta, שפה `he`)

הנוסח נשמר ב-`messages/he.json` תחת `ops.whatsapp.*` ומוגש ל-Meta כמו שהוא; `{{BRAND_NAME}}` מוחלף בשם האמיתי לפני ההגשה, ו-`{{1}}`, `{{2}}`… הם המשתנים של Meta. `verify_code_he` שייכת לקטגוריית Authentication, שבה Meta מכתיבה את הנוסח בעצמה (קוד, אזהרה שלא למסור אותו ותוקף) [M0-verify שהקטגוריה זמינה בעברית]; הנוסח שבטבלה הוא היעד, והשאר בקטגוריית Utility.

| שם התבנית | גוף | משתנים |
|---|---|---|
| `verify_code_he` | קוד האימות שלכם ל{{BRAND_NAME}}: {{1}}. הקוד תקף ל-10 דקות. לא מוסרים אותו לאף אחד. | קוד |
| `video_ready_he` | הסרטון "{{1}}" מוכן לצפייה ולהורדה: {{2}} | שם הפרויקט, קישור |
| `job_failed_he` | היצירה של "{{1}}" לא הושלמה, וכל הקרדיטים חזרו ליתרה. לניסיון חוזר: {{2}} | שם, קישור |
| `approval_received_he` | התקבלה תשובה מהלקוח על הסרטון "{{1}}": {{2}}. לפרטים: {{3}} | שם, "אושר" / "התבקשו שינויים", קישור |
| `payment_failed_he` | החיוב על המנוי ב{{BRAND_NAME}} לא עבר. החשבון ממשיך לעבוד, וננסה שוב ב-{{1}}. לעדכון אמצעי תשלום: {{2}} | תאריך, קישור |

- תשובה אוטומטית ל"הסרה" או "STOP" (בתוך חלון 24 השעות): **"הוסרתם מהתראות הוואטסאפ של {{BRAND_NAME}}. אפשר להפעיל אותן שוב בהגדרות."**
- **שעות שקטות:** לא שולחים בין 21:00 ל-08:00, בשבת, בחגים ובימי שקט — ההודעה נדחית לחלון המותר הבא (התראות שירות אינן דחופות; המייל יוצא כרגיל).
- הקישורים בהודעות הם לדפים באפליקציה שדורשים התחברות; לעולם לא כתובות חתומות לקבצים.

### 13.4 SMS

רק קוד כניסה (Supabase Send SMS Hook, חלק 04 §22.6), כשהדגל `phone_otp` פעיל. ספק SMS ישראלי לפי `SMS_PROVIDER`; שם שולח אלפאנומרי `{{BRAND_NAME_EN}}` (עד 11 תווים) [M0-verify מול הספק שייבחר].

### קריטריוני קבלה
- [ ] עם הדגל כבוי — אין עמודת וואטסאפ, ואף קוד לא שולח הודעה.
- [ ] עם הדגל פעיל ו-mock: אין שליחה לפני אימות; "הסרה" מכבה מיד ונרשמת; הודעה שנוצרה ב-22:30 נשלחת ב-08:00.
- [ ] webhook של וואטסאפ עם חתימה שגויה ← 401.

---

## §14. אנליטיקה (PostHog)

### 14.1 עקרונות

- **PostHog EU** (`NEXT_PUBLIC_POSTHOG_HOST = https://eu.i.posthog.com`), **רק בהסכמה** (חלק 02 §11): לפני בחירה בבאנר — אין סקריפט, אין עוגיות, אין אירועים. ביטול הסכמה — `opt_out_capturing()`, מחיקת `ph_*`.
- הגדרות הלקוח: `autocapture: false`, `capture_pageview: false` (שולחים `$pageview` ידנית בכל מעבר נתיב), `disable_session_recording: true`, `person_profiles: "identified_only"`, `persistence: "cookie"`. בפרויקט ב-PostHog: "Discard client IP data" פעיל, שמירת נתונים 12 חודשים.
- **אין מידע מזהה במאפיינים:** לא מייל, לא שם, לא טלפון, לא טקסט חופשי (חיפוש, הוקים, הערות), לא ערכי התאמה אישית. `before_send` מנקה מ-`$current_url` ומ-`$referrer` את הפרמטרים `token`, `t`, `k`, `s`, `invite`, `q`, `email`, `session`. כל אירוע עובר סכמת Zod (14.3); אירוע או מאפיין לא מוגדר — שגיאת טיפוסים.
- **זהות:** `distinct_id` = מזהה המשתמש ב-Supabase (UUID פסאודונימי), `identify` רק אחרי התחברות ורק בהסכמה; `reset()` ביציאה. **קבוצות:** `posthog.group("workspace", workspaceId, { plan_id, type, niche_slug, created_month })` — מאפשר את מדד הכוכב הצפוני לכל סביבת עבודה.
- **מאפייני-על:** כל אירוע לקוח נושא `app_env`, `release` (‏SHA קצר מ-`VERCEL_GIT_COMMIT_SHA`), `theme`, `reduced_motion`, `is_mobile`; בתוך `/app` ו-`/admin` גם `plan_id`, `workspace_type`, `role`, `ui_gender_form`. אירועי שרת נושאים `app_env` ו-`release`.
- **אירועי שרת** (`posthog-node`, ‏`lib/analytics/server.ts`): נשלחים רק אם ההסכמה האחרונה של המשתמש ל-`analytics_cookies` חיובית (מטמון ב-Upstash, מפתח `consent:{userId}`, ל-10 דקות). בפונקציות serverless: `after(() => posthog.flush())` מ-`next/server` (או `captureImmediate`), כדי לא לאבד אירועים.
- **מדדים עסקיים** (הכנסות, החזרים, עלויות, רווח, אחוז הצלחה של יצירות) **לא נמדדים ב-PostHog** — הם מחושבים מבסיס הנתונים בלוחות האדמין (חלק 03 §22.1, §22.5), כי PostHog רואה רק משתמשים שהסכימו.
- **ניסויים:** דגלי PostHog רק לניסויי שיווק: `hero_copy_v1` (חלק 02) עם העוגייה `exp_hero`, שנקבעת רק אחרי הסכמה, ו-rewrite מ-`/` ל-`/exp/hero/[variant]` (‏`noindex`) ב-`proxy.ts` (חלק 04 §17.2). לעולם לא לגישה לפיצ׳רים בתשלום — לזה יש `feature_flags` (§21). דגלי PostHog אינם `feature_flags`.

### 14.2 קטלוג האירועים (רשימה מלאה וקנונית)

63 אירועים, snake_case. "צד": `c` = לקוח (`track`), `s` = שרת (`trackServer`). המאפיינים מדויקים; `?` = אופציונלי. מאפיינים מסוג enum משתמשים ברשימות של 14.3. **אף פעם** לא טקסט חופשי, מייל, שם, טלפון, מחרוזת חיפוש או ערך של placeholder. "מקור" = איפה האירוע הוגדר לראשונה (נספח F §12.9, חלק 02, חלק 03 או החלק הזה).

| # | אירוע | מאפיינים | צד | מקור |
|---|---|---|---|---|
| 1 | `signup_started` | `method?: "google"\|"magic_link"\|"phone"`, `source?: SignupSource` | c | נספח F / 02 / 03 |
| 2 | `signup_completed` | `method` | s | נספח F |
| 3 | `onboarding_completed` | `niche: slug\|null` | c | נספח F |
| 4 | `niche_selected` | `niche`, `location: NicheLocation` | c | נספח F / 02 / 03 |
| 5 | `hook_copied` | `hook_id`, `niche: slug\|"universal"`, `location: HookLocation` | c | נספח F / 02 / 03 |
| 6 | `hook_personalized` | `fields_count: int` | c | נספח F / 02 |
| 7 | `hook_create_video_clicked` | `hook_id` | c | נספח F |
| 8 | `hook_variations_requested` | `hook_id: string\|null` (‏`null` = הוקים חדשים בלי הוק מקור) | c | נספח F |
| 9 | `hook_shared` | `hook_id`, `channel: "whatsapp"\|"link"` | c | 02 |
| 10 | `hook_favorited` | `hook_id`, `on: boolean` | c | 03 |
| 11 | `hooks_searched` | `q_length: int`, `results?: int`, `location: "hub"\|"landing_teaser"\|"niche_page"\|"hook_niche_page"\|"app_hooks"` | c | 02 |
| 12 | `hooks_filtered` | `facet: "niche"\|"type"\|"platform"\|"goal"\|"gender"\|"season"\|"featured"\|"has_video"\|"sort"`, `value: string` (ערך enum או slug בלבד) | c | 02 |
| 13 | `savings_calculated` | `videos: int`, `price_bucket: "lt300"\|"300_700"\|"700_1500"\|"gt1500"`, `quality: "draft"\|"standard"` | c | 02 |
| 14 | `faq_expanded` | `question_id`, `location: "landing"\|"faq_page"\|"pricing_page"\|"niche_page"\|"hook_niche_page"` | c | 02 |
| 15 | `example_played` | `example_id`, `location: "landing_gallery"\|"examples"\|"niche_page"\|"template_page"` | c | 02 |
| 16 | `contact_submitted` | `topic` (ה-enum של `ContactBody.topic`) | c | 02 |
| 17 | `pricing_viewed` | `location: "landing"\|"pricing_page"\|"app"` | c | נספח F / 02 |
| 18 | `cta_clicked` | `location: CtaLocation` | c | נספח F / 02 / 03 |
| 19 | `newsletter_subscribed` | — | c | נספח F |
| 20 | `brand_extracted` | `success: boolean` | c | נספח F |
| 21 | `wizard_step_viewed` | `step: WizardStep` | c | 03 |
| 22 | `wizard_step_completed` | `step: WizardStep` | c | נספח F |
| 23 | `fast_path_used` | — | c | נספח F |
| 24 | `missing_facts_resolved` | `count: int`, `action: "confirmed"\|"replaced"\|"removed"\|"mixed"` | c | 03 |
| 25 | `hook_selected` | `source: "library"\|"ai"\|"own"`, `count: int` (1 + מספר הגרסאות) | c | 03 |
| 26 | `variant_group_created` | `count: int` | c | 03 |
| 27 | `script_generated` | `model_served`, `ms: int` | s | נספח F |
| 28 | `storyboard_generated` | `model_served`, `ms: int` | s | נספח F |
| 29 | `preview_played` | — | c | נספח F |
| 30 | `generation_confirmed` | `credits`, `quality`, `visual_mix`, `duration: 15\|30\|45\|60`, `formats: AspectRatio[]` | c (אחרי ‏202 מ-`generate`; השרת לא שולח) | נספח F |
| 31 | `generation_completed` | `job_id`, `duration_ms`, `cost_usd`, `degraded_scenes: int` | s | נספח F |
| 32 | `generation_failed` | `stage: JobStage`, `error_code: ErrorCode` | s | נספח F |
| 33 | `generation_canceled` | `stage: JobStage` | c | 03 |
| 34 | `scene_regenerated` | `what: "visual"\|"clip"\|"keyframe"` | c | נספח F |
| 35 | `scene_rewritten` | `instruction: "shorter"\|"energetic"\|"formal"\|"custom"` | c | 03 |
| 36 | `scene_reordered` | — | c | 03 |
| 37 | `rerender_started` | `formats: AspectRatio[]` | c | 03 |
| 38 | `project_duplicated` | — | c | 03 |
| 39 | `export_opened` | — | c | 03 |
| 40 | `video_downloaded` | `format: AspectRatio` | c | נספח F |
| 41 | `captions_downloaded` | `type: "srt"\|"vtt"` | c | נספח F |
| 42 | `share_link_created` | `kind: "public_view"\|"client_approval"` | c | נספח F |
| 43 | `client_approval_submitted` | `decision: "approved"\|"changes_requested"` | s (בשם יוצר הקישור, רק בהסכמתו) | נספח F |
| 44 | `checkout_started` | `kind: CheckoutKind`, `plan_id?`, `pack_id?`, `cycle?` | c | נספח F |
| 45 | `checkout_completed` | `kind: CheckoutKind`, `plan_id: string\|null`, `pack_id: string\|null`, `cycle: BillingCycle\|null`, `amount_ils: number` | s | נספח F |
| 46 | `topup_purchased` | `pack_id` | s | נספח F |
| 47 | `credits_low_shown` | `location: "dashboard"\|"wizard"\|"billing"\|"banner"` | c | נספח F |
| 48 | `subscription_canceled` | `reason: CancelReason` | s | נספח F |
| 49 | `refund_requested` | `reason_code` | s | נספח F |
| 50 | `subscription_renewed` | `plan_id`, `cycle` | s | 06 |
| 51 | `subscription_payment_failed` | `attempt: int` | s | 06 |
| 52 | `plan_changed` | `from_plan`, `to_plan`, `immediate: boolean` | s | 06 |
| 53 | `refund_completed` | `reason_code` | s | 06 |
| 54 | `motion_toggled` | `on: boolean` | c | נספח F |
| 55 | `theme_changed` | `theme: "dark"\|"light"\|"system"` | c | נספח F |
| 56 | `brand_kit_saved` | `fields: ("logo"\|"colors"\|"fonts"\|"captions"\|"intro"\|"end_card"\|"watermark"\|"voice"\|"music")[]` | c | 03 |
| 57 | `upload_completed` | `kind: "upload_image"\|"upload_video"\|"logo"\|"brand_image"` | c | 03 |
| 58 | `member_invited` | `role: "admin"\|"editor"\|"viewer"` | c | 03 |
| 59 | `client_workspace_created` | — | c | 03 |
| 60 | `notification_clicked` | `kind: NotificationKind` | c | 03 |
| 61 | `data_export_requested` | — | c | 03 |
| 62 | `account_delete_requested` | — | c | 03 |
| 63 | `shortcuts_opened` | — | c | 03 |

- **מותר בנוסף** (מובנים של PostHog, לא ב-`EVENTS`): `$pageview` (נשלח ידנית בכל מעבר נתיב) ו-`$feature_flag_called` (ניסויי PostHog). שום אירוע אחר לא נשלח.
- **אירועי שרת לא נשלחים מהלקוח** — גם לא `subscription_canceled`, `refund_requested` ו-`storyboard_generated`, שהממשק עלול "לרצות" לשלוח.
- **איפה נשלחים אירועי השרת של החיוב:** `checkout_completed` ו-`topup_purchased` — 4.1 צעד 6; `subscription_renewed` — 4.2 צעד 4; `subscription_payment_failed` — 6.1; `plan_changed` — 5.3; `subscription_canceled` — 10.2; `refund_requested` ו-`refund_completed` — 10.6. אירועי הצנרת (`script_generated`, `storyboard_generated`, `generation_completed`, `generation_failed`) — חלק 05; `signup_completed` — `ensureFirstLogin()` (‏`lib/auth/first-login.ts`, חלק 03 §3.4); `client_approval_submitted` — `POST /api/approvals/[token]`.

### 14.3 הקוד

```ts
// lib/analytics/events.ts — every event of 14.2, and nothing else
export const SignupSource = z.enum(["header", "hero", "hooks_gate", "pricing", "final_cta", "mobile_sticky", "login"]);
export const NicheLocation = z.enum(["hero", "niche_showcase", "final_cta", "niches_hub", "onboarding", "wizard"]);
export const HookLocation = z.enum(["hub", "niche_page", "hook_niche_page", "single_hook", "landing_teaser", "niche_showcase",
  "blog", "dashboard", "app_hooks"]);
export const CtaLocation = z.enum(["header", "mobile_menu", "hero", "how_it_works", "editor_math", "hooks_teaser", "landing_gallery",
  "final_cta", "mobile_sticky", "niche_page_hero", "niche_page_final", "hooks_page_cta", "examples_dialog", "template_card",
  "template_page", "pricing_card_free", "pricing_card_starter", "pricing_card_business", "pricing_card_agency",
  "pricing_pack_150", "pricing_pack_500", "pricing_pack_1500",              // credit count, never "pricing_pack_pack-150"
  "blog_cta", "about", "not_found", "share_page", "dashboard_quickstart", "dashboard_fast_path", "dashboard_season", "app_templates"]);
export const CheckoutKind = z.enum(["subscription", "topup", "update_card", "plan_change"]);
// Imported, never re-declared here (part 04): WizardStep, AspectRatio — lib/api/contracts/common.ts; CancelReason —
// lib/api/contracts/billing.ts; JobStage, BillingCycle, NotificationKind — ENUMS in lib/supabase/enums.ts; ErrorCode — lib/errors.ts.

export const EVENTS = {
  signup_started: z.strictObject({ method: z.enum(["google", "magic_link", "phone"]).optional(), source: SignupSource.optional() }),
  generation_confirmed: z.strictObject({ credits: z.number().int(), quality: z.enum(ENUMS.quality_tier),
    visual_mix: z.enum(ENUMS.visual_mix), duration: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
    formats: z.array(z.enum(ENUMS.aspect_ratio)) }),
  checkout_completed: z.strictObject({ kind: CheckoutKind, plan_id: z.string().nullable(),
    pack_id: z.string().nullable(), cycle: z.enum(ENUMS.billing_cycle).nullable(), amount_ils: z.number() }),
  // … all 63 events of 14.2, one strictObject each
} as const satisfies Record<string, z.ZodType>;
export type EventName = keyof typeof EVENTS;
export const SERVER_ONLY_EVENTS = ["signup_completed", "script_generated", "storyboard_generated", "generation_completed",
  "generation_failed", "client_approval_submitted", "checkout_completed", "topup_purchased", "subscription_canceled",
  "refund_requested", "subscription_renewed", "subscription_payment_failed", "plan_changed", "refund_completed"] as const;

// lib/analytics/client.ts — no-op until consent; server-only events are a type error here
export function track<E extends Exclude<EventName, (typeof SERVER_ONLY_EVENTS)[number]>>(event: E, props: z.input<(typeof EVENTS)[E]>) {
  if (!hasAnalyticsConsent()) return;
  const parsed = EVENTS[event].safeParse(props);
  if (!parsed.success) { if (process.env.NODE_ENV !== "production") throw parsed.error; return; }
  posthog.capture(event, parsed.data);
}
// lib/analytics/server.ts
export async function trackServer<E extends EventName>(userId: string, event: E, props: z.input<(typeof EVENTS)[E]>, o?: { workspaceId?: string }) {
  if (!(await userAnalyticsConsent(userId))) return;                 // latest analytics_cookies consent, cached in Upstash consent:{userId} for 10 min
  ph.capture({ distinctId: userId, event, properties: { ...EVENTS[event].parse(props), app_env: env.APP_ENV, release: RELEASE },
               groups: o?.workspaceId ? { workspace: o.workspaceId } : undefined });
}
```

### 14.4 משפכים ולוחות

משפכי השיווק (ספרייה ← הרשמה, דף הבית ← סרטון ראשון, מחירים ← רכישה, ניסוי הגיבור) מוגדרים בחלק 02 §14. בנוסף:

| # | משפך / לוח | הגדרה | יעד |
|---|---|---|---|
| 5 | **הפעלה** | `signup_completed` ← `onboarding_completed` ← `wizard_step_completed{step:"script"}` ← `generation_confirmed` ← `generation_completed` ← `video_downloaded`, בתוך 24 שעות | ≥ 45% (נספח F §1.5) |
| 6 | **נשירה באשף** | `wizard_step_viewed` לפי סדר `WizardStep`, פילוח לפי `fast_path_used` | זיהוי השלב עם הנשירה הגבוהה |
| 7 | **יתרה נמוכה ← רכישה** | `credits_low_shown` ← `checkout_started{kind:"topup"}` ← `topup_purchased` | מעקב |
| 8 | **ביטולים** | פילוח `subscription_canceled` לפי `reason`, ושימור לפי תוכנית | מעקב חודשי |
| לוח | **הכוכב הצפוני** | (`video_downloaded` + `share_link_created`) לכל סביבת עבודה פעילה בשבוע (קבוצת `workspace`) | מגמה עולה |
| לוח | **איכות היצירה (UX)** | `generation_failed` לפי `error_code` ו-`stage`, `degraded_scenes` ממוצע, `script_generated.ms` p50 | השוואה ללוח האדמין |
| לוח | **ספריית ההוקים ו-SEO** | צפיות `/hooks*`, `hook_copied`, `hook_create_video_clicked`, המרה להרשמה ≥ 2.5% | |
| לוח | **שימור** | שימור שבועי לפי קוהורטת הרשמה, ברמת `workspace` | |

ההגדרות נשמרות כקוד ב-`docs/analytics.md` (שם, אירועים, מסננים), כדי שאפשר יהיה לבנות אותן מחדש בפרויקט PostHog חדש.

### קריטריוני קבלה
- [ ] בדיקת Playwright: לפני הסכמה אין בקשה ל-`eu.i.posthog.com`; אחרי "מאשרים הכול" — `$pageview` אחד לכל מעבר נתיב.
- [ ] בדיקת יחידה: כל אירוע ב-`EVENTS` נדחה כשמוסיפים לו `email` או מחרוזת עם `@`.
- [ ] `trackServer` לא שולח למשתמש שההסכמה האחרונה שלו שלילית.
- [ ] `before_send` מסיר `?token=` ו-`?invite=` מכתובות.
- [ ] `docs/analytics.md` מכיל את 8 המשפכים (1–4 בחלק 02 §14, 5–8 כאן) ואת 4 הלוחות.
- [ ] `Object.keys(EVENTS).length === 63`, ושמותיהם זהים לטבלה ב-14.2 (בדיקת יחידה מול רשימה קבועה); קריאה ל-`track()` עם אירוע מ-`SERVER_ONLY_EVENTS` היא שגיאת טיפוסים (`tsd`/`expectTypeOf`).

---

## §15. אבטחה

### 15.1 מודל איומים (תקציר)

| נכס | איום עיקרי | בקרות |
|---|---|---|
| אסימוני תשלום | גניבה מהמסד או מהלוגים | הצפנה (15.5), אין עמודה ללקוח (`token_enc` בלי grant), ניקוי לוגים |
| קרדיטים (= כסף) | עקיפת חיוב, מרוץ, שליחה כפולה | פונקציות SQL עם נעילות, אידמפוטנטיות, ledger בלי עדכון (חלק 04 §10) |
| תקציב OpenRouter | ניצול לרעה, לולאה, מודל יקר | תקרות יומיות, מקביליות, מגן תקציב, התראות (§16.4) |
| תוכן לקוחות | גישה בין סביבות (IDOR), קישורי שיתוף | RLS, `can_access_workspace`, טוקנים מגובבים, כתובות חתומות קצרות |
| פאנל ניהול | השתלטות על חשבון מנהל | `is_platform_admin` + MFA חובה (15.4), יומן ביקורת |
| webhooks | זיוף אירועי תשלום/וידאו | חתימה + טוקן + שאילתה חוזרת + אידמפוטנטיות (15.7) |
| שרתי פנים | SSRF דרך חילוץ מותג | `safeFetch` (15.8) |
| מוניטין | שימוש לרעה בתוכן (פוליטיקה, דמויות, מין) | מודרציה, דיווחים, בחירות (15.9) |

### 15.2 מיפוי OWASP Top 10 (2021)

| קטגוריה | איך מטופלת | איפה נבדק |
|---|---|---|
| A01 Broken Access Control | RLS על כל טבלה; בדיקת תפקיד בעטיפת `route()`; `proxy.ts` חוסם `/admin`; כתובות קבצים רק דרך `/api/assets/[id]/url` אחרי בדיקת גישה; אין מזהי סביבה ב-URL | pgTAP (חלק 04 §25), בדיקות API עם סביבה זרה (404) |
| A02 Cryptographic Failures | TLS בלבד + HSTS; AES-256-GCM לאסימונים; HKDF למפתחות משנה; גיבוב טוקנים של הזמנות ושיתוף; אין מספר כרטיס במערכת | בדיקות יחידה ל-`lib/crypto.ts` |
| A03 Injection | supabase-js עם פרמטרים; RPC עם טיפוסים; אין SQL דינמי מקלט; Zod על כל קלט; React מקודד פלט; SVG מנוקה; הזרקת פרומפט — חלק 05 §8 | בדיקות פאזינג קלות על נתיבי חיפוש |
| A04 Insecure Design | שמירת קרדיטים לפני הוצאה, `capture` לא עובר את השמירה, שערי עובדות, מגן תקציב, ביטול בלי חיוב כפול | בדיקות מקביליות |
| A05 Security Misconfiguration | CSP וכותרות (15.3); הגדרות Supabase (חלק 04 §1.2); מפתחות ישנים מושבתים; `mock` חסום בפרודקשן | בדיקת כותרות ב-e2e, `check-env` |
| A06 Vulnerable Components | lockfile, `pnpm audit --prod`, Renovate שבועי, גרסה זהה לכל חבילות Remotion | CI |
| A07 Identification & Authentication Failures | Supabase Auth, קישור קסם חד־פעמי לשעה, rotation של refresh tokens, מגבלות קצב על auth, MFA למנהלים | בדיקות e2e |
| A08 Software & Data Integrity Failures | אימות webhooks; GitHub Actions מקובעות ל-SHA; `--frozen-lockfile`; סקריפטי התקנה רק מרשימת היתר (`pnpm.onlyBuiltDependencies`) | CI |
| A09 Security Logging & Monitoring Failures | `audit_logs`, `webhook_events`, Sentry, התראות (§16) | בדיקת קיום שורות ביקורת |
| A10 SSRF | `safeFetch` לחילוץ מותג; ל-OpenRouter ולמרנדר נשלחות רק כתובות חתומות שלנו | בדיקות יחידה עם כתובות פנימיות |
| LLM (OWASP LLM Top 10) | הזרקת פרומפט: תוכן משתמש מסומן כנתונים (חלק 05 §8); פלט מאומת ב-Zod לפני שימוש; למודל אין כלים עם השפעה ("excessive agency"); מגבלות טוקנים ועלות | בדיקות פרומפט |

### 15.3 כותרות ו-CSP

- **CSP עם nonce** לנתיבים דינמיים (`/app`, `/admin`, `/login`, `/auth/*`, `/v/*`, `/approve/*`, `/unsubscribe`): `proxy.ts` מייצר nonce לכל בקשה ומעביר אותו בכותרת `x-nonce` (הקוד והתנאים: חלק 04 §17.2). גם בענף הזה נכלל ה-hash של `THEME_SCRIPT_SOURCE` (חלק 01 §6.2), כי ה-root layout המשותף לא מקבל nonce.
- **CSP סטטי** לדפי השיווק (ISR): nonce היה הופך אותם לדינמיים, ולכן הם מקבלים את ה-CSP מ-`next.config.ts`, עם ה-`sha256` של `THEME_SCRIPT_SOURCE`. סקריפטי JSON-LD הם בלוקי נתונים שהדפדפן לא מריץ, ולכן לא צריכים היתר. **[M0-verify] סקריפטי ה-inline ש-Next מזריק לדפים סטטיים** (נתוני ה-RSC, `self.__next_f.push(…)`) משתנים מדף לדף ולא ניתנים ל-hash מראש. בספייק M0 (ספייק 16, "M0 — יסודות וניסויי אימות") מאמתים אחת משתי דרכים, ובודקים אותה ב-e2e שמאזין ל-`securitypolicyviolation` בדף הבית ובדף נישה: (א) `experimental.sri` של Next 16 יחד עם ה-hash — ברירת המחדל; או (ב) רק אם (א) נכשלת: הכותרת **האוכפת** בדפים הסטטיים מקבלת `'unsafe-inline'` בלי hash (בדפדפנים מודרניים hash או nonce מבטלים את `'unsafe-inline'`), ולצידה נשלחת אותה מדיניות **עם** ה-hash ככותרת `Content-Security-Policy-Report-Only`, שמדווחת ל-Sentry; בדפים האלה אין קלט משתמש שמוצג בלי קידוד. כך ה-hash של `THEME_SCRIPT_SOURCE` נמצא בשני הענפים בכל מצב (חלק 01 §6.2, D-214). ההחלטה נרשמת ב-`DECISIONS.md`, ו-`staticCspHeaders` מקבלת אותה כפרמטר `mode` (`"sri_hash"` | `"unsafe_inline"`).

```ts
// lib/security/csp.ts
// The THEME_SCRIPT_SOURCE hash is part of BOTH branches (part 01 §6.2, D-214): the nonce branch (proxy.ts) and the static
// branch (next.config.ts). `relaxInline` exists only for the ENFORCED copy of M0 fallback (b); see staticCspHeaders below.
// Supabase origin = the host of NEXT_PUBLIC_SUPABASE_URL (the project host, or the custom domain auth.{{DOMAIN}}, part 04 §1.2),
// never a *.supabase.co wildcard; next.config.ts images.remotePatterns uses the same host.
const supabaseHost = () => new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
export function buildCsp(o: { nonce?: string; themeHash: string; env: AppEnv; relaxInline?: boolean }) {
  const sb = supabaseHost();
  const script = o.nonce
    ? `'self' 'nonce-${o.nonce}' '${o.themeHash}' 'strict-dynamic'`          // theme script has no nonce (shared root layout) → hash
    : o.relaxInline ? `'self' 'unsafe-inline'`                                // fallback (b), enforced copy only: a hash would disable it
    : `'self' '${o.themeHash}'`;                                              // static branch: hash (+ experimental.sri, M0 decision (a))
  return [
    `default-src 'self'`,
    `script-src ${script} https://eu-assets.i.posthog.com`,
    `style-src 'self' 'unsafe-inline'`,                                           // Radix/Motion inline styles
    `img-src 'self' data: blob: https://${sb}`,
    `media-src 'self' blob: https://${sb}`,
    `font-src 'self' data:`,                                                      // all fonts self-hosted, incl. caption fonts in the Player
    `connect-src 'self' https://${sb} wss://${sb} https://eu.i.posthog.com https://eu-assets.i.posthog.com`,
    `frame-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`, `object-src 'none'`,
    `worker-src 'self' blob:`,
    o.env === "production" ? `upgrade-insecure-requests` : ``,
    `report-to csp`, `report-uri ${sentryCspReportUrl()}`,                    // report-uri: fallback for browsers without report-to
  ].filter(Boolean).join("; ");
}
// every response that carries a CSP also gets: Reporting-Endpoints: csp="<sentryCspReportUrl()>"
// sentryCspReportUrl() is derived from NEXT_PUBLIC_SENTRY_DSN: https://{host}/api/{projectId}/security/?sentry_key={publicKey}

// [M0-verify, spike 16] static (ISR) marketing routes — used by next.config.ts headers(); mode = the decision in DECISIONS.md
export function staticCspHeaders(themeHash: string, env: AppEnv, mode: "sri_hash" | "unsafe_inline" = "sri_hash") {
  return mode === "sri_hash"
    ? [{ key: "Content-Security-Policy", value: buildCsp({ themeHash, env }) }]
    : [{ key: "Content-Security-Policy", value: buildCsp({ themeHash, env, relaxInline: true }) },
       { key: "Content-Security-Policy-Report-Only", value: buildCsp({ themeHash, env }) }];   // hash kept; violations → Sentry
}
```

- **מקור Supabase:** `buildCsp` גוזר את `https://<host>` ואת `wss://<host>` מ-`NEXT_PUBLIC_SUPABASE_URL` (ל-`img-src`, `media-src` ו-`connect-src`), ו-`images.remotePatterns` ב-`next.config.ts` משתמש באותו host. כך דומיין מותאם (`auth.{{DOMAIN}}`, חלק 04 §1.2) עובד בלי שינוי, ואין wildcard של `*.supabase.co`.
- Sentry נשלח דרך `tunnelRoute: "/monitoring"` (מאותו origin), ולכן לא נדרש ב-`connect-src`. עמוד התשלום של Grow נפתח בהפניה מלאה, ולא ב-iframe — `frame-src 'none'` נשמר.
- בשבוע הראשון בפרודקשן: `Content-Security-Policy-Report-Only` עם דיווח ל-Sentry; אחרי שבוע בלי הפרות לגיטימיות — אכיפה (M7).
- **כותרות נוספות** (כל התשובות): `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (פרודקשן בלבד) · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()` (חריג אחד ב-v2: בנתיב זרימת ההסכמה לדמות ולקול — `microphone=(self), camera=(self)`, §11.10) · `Cross-Origin-Opener-Policy: same-origin` · `X-Frame-Options: DENY`.
- **CSRF:** עוגיות `SameSite=Lax`, ובעטיפת `route()` בדיקת `Origin` לכל בקשה משנה (מול `NEXT_PUBLIC_SITE_URL` וכתובת ה-preview). חריגים: webhooks, cron, `POST /api/unsubscribe` (RFC 8058, בלי עוגיות).

### 15.4 זהות והרשאות

- הרשאות בשרת תמיד (עטיפת `route()` + RLS כשכבה שנייה); הסתרה בממשק היא נוחות (חלק 03 §1.2).
- **MFA חובה למנהלי פלטפורמה:** `/admin` דורש `is_platform_admin` **וגם** session ברמת `aal2` (TOTP של Supabase Auth). ב-SQL זה נאכף ב-`is_platform_admin()`, ו-`proxy.ts` קורא ל-`platform_admin_status()` (‏`'none' | 'needs_mfa' | 'ok'`; חלק 04 §9.2, §17.2): `none` ← 404, ‏`needs_mfa` ← הפניה ל-`/admin/mfa`, ‏`ok` ← ממשיכים. TOTP מופעל בפרויקט (`[auth.mfa.totp] enroll_enabled = true, verify_enabled = true`, חלק 04 §1.2, §1.4).
- **`/admin/mfa`** ★ (נגיש ב-`aal1`, מופיע ברשימת נתיבי האדמין של חלק 03 §22.0): בלי factor רשום — `supabase.auth.mfa.enroll({ factorType: "totp" })` ← QR; עם factor — `mfa.challenge` ← `mfa.verify`; אחרי הצלחה רענון ה-session והפניה ל-`next` או ל-`/admin`. נוסח: כותרת **"אימות דו-שלבי למנהלים"** · בהרשמה ראשונה: **"כדי להיכנס לפאנל הניהול צריך להפעיל אימות דו-שלבי. סרקו את הקוד באפליקציית אימות (כמו Google Authenticator או 1Password) והקלידו את הקוד בן 6 הספרות."** · כשכבר יש factor: **"הקלידו את הקוד בן 6 הספרות מאפליקציית האימות."** · שדה **"קוד מהאפליקציה"** · כפתור **"הפעלה"** (בהרשמה) או **"אימות"** · שגיאה: **"הקוד לא נכון. כדאי לוודא שהשעה בטלפון מדויקת."**
- כל חשבונות הספקים (GitHub, Vercel, Supabase, OpenRouter, Grow, Morning, Resend, PostHog, Sentry, Upstash, AWS לגיבויים) — עם 2FA, הרשאות מינימליות, ורשימת בעלי גישה ב-`docs/security/access.md`.

### 15.5 סודות והצפנה

- סודות רק במשתני הסביבה של Vercel (Production / Preview / Development נפרדים) וב-GitHub Secrets (CI בלבד). `.env.local` ב-`.gitignore`; gitleaks ב-CI ו-pre-commit.
- **`lib/crypto.ts`:**

```ts
// AES-256-GCM, 12-byte random IV; output "v{n}:{iv_b64}:{tag_b64}:{ct_b64}"
export function encryptToken(plain: string): string;
export function decryptToken(enc: string): string;              // tries APP_ENCRYPTION_KEY, then APP_ENCRYPTION_KEY_PREVIOUS ★
export function deriveKey(info: "email-tokens" | "mock-gateway" | "share-tokens"): Buffer;   // HKDF-SHA256 from APP_ENCRYPTION_KEY
export function hmacHex(secret: string, data: string): string;
export function hmacSign(secret: string, data: string): string;                  // = hmacHex; callers pass secrets[0]
export function hmacVerifyAny(secrets: string[], data: string, mac: string): boolean;   // timingSafeEqual against every secret
export function secretList(v: string): string[];               // "new,old" → ["new","old"] (OPENROUTER_CALLBACK_TOKEN_SECRET, GROW_WEBHOOK_SECRET)
export function safeEqualHex(a: string, b: string): boolean;   // crypto.timingSafeEqual on equal-length buffers
```

- **רוטציה** (כל 12 חודשים, או מיד בחשד): מפתח חדש ל-`APP_ENCRYPTION_KEY`, הישן ל-`APP_ENCRYPTION_KEY_PREVIOUS` ★, `scripts/rotate-encryption-key.ts` מצפין מחדש את כל `payment_methods.token_enc` לגרסה החדשה, ואחרי ריצה נקייה מוחקים את הישן. טוקני הסרה מדיוור חייבים לעבוד לתמיד (חלק 04 §21.4), ולכן האימות שלהם מנסה את כל המפתחות שב-`APP_ENCRYPTION_KEY_PREVIOUS` (רשימה מופרדת בפסיקים). אותו כלל חל על כל אימות שמשתמש במפתח נגזר (`deriveKey`). הסודות `OPENROUTER_CALLBACK_TOKEN_SECRET` ו-`GROW_WEBHOOK_SECRET` מקבלים גם הם רשימה מופרדת בפסיק: חותמים בראשון ומאמתים מול כולם (`hmacVerifyAny`; runbook R12).
- מפתח OpenRouter אחד לכל סביבה, עם **מגבלת אשראי למפתח** בלוח של OpenRouter (preview: ‏$20 ליום; פרודקשן: פי 1.5 מהתקציב היומי).

### 15.6 הגבלות קצב

הטבלה המלאה, כולל ה-buckets שהחיוב צריך (`billing`, ‏`checkout_ip`) והמגבלה העסקית `topup_daily`, נמצאת בחלק 04 §18.6.

### 15.7 אימות webhooks (סיכום)

| ספק | אימות | הגנה נוספת | אידמפוטנטיות |
|---|---|---|---|
| OpenRouter (וידאו) | `X-OpenRouter-Signature` (HMAC-SHA256, חלון 5 דקות) [M0-verify] | `?t=` HMAC לכל צעד | `X-OpenRouter-Idempotency-Key` |
| רינדור | `?t=` HMAC של `renderRunId` | — | `${renderRunId}:${status}` |
| Grow | `?k=` HMAC של מזהה הסשן (`hmacVerifyAny` מול `GROW_WEBHOOK_SECRET`) + חתימה אם קיימת [M0-verify] | **שאילתה חוזרת ל-API** + בדיקת סכום | `grow:{txnId}:{eventType}` + `unique (provider, provider_txn_id)` |
| Morning | שאילתה חוזרת ל-API [M0-verify חתימה] | — | `morning:{docId}:{eventType}` |
| Resend | Svix (`svix-signature`, `RESEND_WEBHOOK_SECRET`) | — | `svix-id` |
| Supabase Send SMS Hook | Standard Webhooks (`SEND_SMS_HOOK_SECRET`) | דגל `phone_otp` | `webhook-id` |
| WhatsApp (v2) | `POST`: ‏`X-Hub-Signature-256` (`WHATSAPP_APP_SECRET`); ‏`GET`: אתגר האימות של Meta (`hub.verify_token` שנגזר ב-HMAC מאותו סוד) | דגל `whatsapp_notify` (כבוי ← 404) | מזהה ההודעה |

כולם: גוף גולמי, `timingSafeEqual`, גוף עד 1MB, ושורת `webhook_events` עם `signature_valid=false` בכשל (חלק 04 §22.1).

### 15.8 הגנת SSRF בחילוץ מותג (`lib/security/safe-fetch.ts`)

`POST /api/brand/extract` מקבל URL מהמשתמש ומושך אותו מהשרת — המקום המסוכן ביותר ל-SSRF. כל משיכה של כתובת חיצונית (הדף, הלוגו, `og:image`) עוברת רק דרך `safeFetch`:

```ts
export async function safeFetch(rawUrl: string, o: { accept: "html" | "image"; maxBytes: number; timeoutMs?: number; maxRedirects?: number }): Promise<{ finalUrl: string; contentType: string; body: Buffer }>;
```

1. **פירוק ונרמול:** רק `http:`/`https:`; בלי `user:pass@`; פורט ריק, 80 או 443 בלבד; שם מארח ב-punycode; דחייה של `localhost`, ‏`*.localhost`, ‏`*.local`, ‏`*.internal`, ‏`metadata.google.internal` ושל כתובת IP מילולית (גם בכתיב עשרוני/הקסדצימלי/אוקטלי).
2. **DNS:** `dns.promises.lookup(host, { all: true, verbatim: true })`; **כל** כתובת שחוזרת נבדקת עם `ipaddr.js` — דחייה אם `range()` שונה מ-`unicast` (פרטי, loopback, link-local `169.254.0.0/16` כולל מטא־דאטה של ענן, CGNAT `100.64.0.0/10`, multicast, שמור, `::1`, `fc00::/7`, `fe80::/10`, IPv4-mapped של כל אלה, `64:ff9b::/96`).
3. **נעילת IP (מניעת DNS rebinding):** החיבור עצמו נעשה לכתובת שנבדקה — `undici.Agent` עם `connect.lookup` שמחזיר רק אותה, ו-SNI/`Host` של השם המקורי.
4. **הפניות:** ידניות (`redirect: "manual"`), עד 3, וכל `Location` עובר מחדש את שלבים 1–3.
5. **תגובה:** `content-type` מרשימת היתר (`text/html`, `application/xhtml+xml` לדף; `image/png|jpeg|webp|svg+xml|x-icon` ללוגו); קריאה בזרם עם תקרת בתים (דף 2MB, תמונה 5MB) וזמן כולל של 8 שניות; בלי עוגיות; `User-Agent: {{BRAND_NAME_EN}}-BrandBot/1.0 (+https://{{DOMAIN}}/legal/terms)`.
6. **אחרי המשיכה:** HTML נפרס בשרת (`parse5`/`cheerio`), בלי הרצת JS; לוגו רסטר מקודד מחדש ל-PNG (`sharp`) כדי לנקות מטען חבוי; SVG מנוקה (חלק 04 §13.2).
7. **אינסטגרם/פייסבוק:** רק מטא־דאטה ציבורי (`og:*`); לא מתחברים, לא עוקפים חסימות.
8. **שגיאות** חוזרות למשתמש כהודעה אחת בלי פרטים טכניים: **"לא הצלחנו לקרוא את הכתובת הזו. אפשר לנסות כתובת אחרת, או למלא את הפרטים ידנית."**

### 15.9 מודרציה ושימוש לרעה

| שכבה | מה | תגובה |
|---|---|---|
| בריף ותסריט | `moderation.brief.v1` (חלק 05) — פוליטיקה, דמויות ציבוריות, קטינים, מין, שנאה, אלימות, הבטחות רפואיות/פיננסיות | `MODERATION_BLOCKED` עם סיבה בעברית; במצב בחירות `ELECTION_POLICY_BLOCKED` |
| העלאות | magic bytes, גודל, ניקוי SVG (חלק 04 §13.2); ★ `moderation.upload.v1` (`llm.cheap` עם תמונה, חלק 05 §10.14) בתוך `POST /api/uploads/complete` (חלק 04 §20.2), ל-`upload_image` ולפריים הראשון של `upload_video` (לא ללוגו ולתמונות מותג): עירום ומין, מין עם קטינים, אלימות קשה, סמלי שנאה, דמות ציבורית מוכרת, נשק. תקלה אצל הספק ← הנכס נשמר עם `moderation: {pending: true}`, לא נכנס לרינדור, ונבדק שוב ב-`cleanup` | חסימה: ‏422 `MODERATION_BLOCKED {reason_he, categories}`, הקובץ נמחק, `metadata.upload_state='rejected'`, הודעה: **"לא נוכל להשתמש בקובץ הזה, כי הוא לא עומד במדיניות השימוש. אם זו טעות, כתבו לנו."** · חשד לפגיעה בקטינים: חסימה, שמירת ראיה ב-bucket מוגבל, דיווח לפי הדין, חסימת המשתמש ⚖️ |
| הצהרות בהעלאה | אנשים מזוהים — הצהרת הסכמה; קטינים — הסכמת הורים (חלק 03) | `assets.metadata.consent_attested` |
| פלט | מסנני הבטיחות של ספקי המודלים; הנחיית "בלי אנשים אמיתיים ובלי ילדים" בכל פרומפט תמונה (חלק 05) | — |
| דפים ציבוריים | `/v/[token]` ו-`/approve/[token]` ב-`noindex`, עם **"דיווח על הסרטון"** (`abuse_reports`) | טיפול תוך 2 ימי עסקים; מיידי בחשד לפגיעה בקטינים או לשימוש בדמות בלי הסכמה |

### 15.10 יומן ביקורת

- **שמות הפעולות:** רק מהרשימה הקנונית של חלק 04 §24.1 (‏regex `^[a-z_]+(\.[a-z_]+)+$`; אין שמות אחרים). כל פעולות האדמין נרשמות שם. מתוך הרשימה, פעולות של משתמשים שנרשמות גם הן: `billing.cancel`, ‏`billing.resume`, ‏`billing.plan_change`, ‏`member.role_change` (גם עם `metadata.reason` = `invite_accepted` / `ownership_transfer` / `plan_downgrade`), ‏`privacy.request`, ‏`notifications.whatsapp_opt_in`, ‏`notifications.whatsapp_opt_out`; הענקת אדמין ראשונה מ-`ADMIN_EMAILS` היא `user.admin_grant` עם `metadata.source = 'admin_emails_bootstrap'`; פתיחת אירוע אבטחה — `security.incident` (R7).
- **פעולות שמתועדות בטבלה שלהן ולא ביומן הביקורת:** הזמנות (`workspace_invites`), החלפת כרטיס (`payment_methods`, `checkout_sessions`), קישורי שיתוף (`share_links`), בקשות ייצוא ומחיקה (`data_requests`) והרשמת MFA (טבלאות ה-MFA של Supabase Auth). לכל אחת יש `created_at` ומבצע, ולכן אין צורך בשם פעולה נוסף.
- **שדות:** מבצע, פעולה, יעד, סביבה, IP, `metadata` עם לפני/אחרי (בלי סודות ובלי אסימונים) וסיבה.
- **שלמות:** הטריגר `prevent_audit_mutation()` (חלק 04 §10.6) חוסם `update`, `delete` ו-`truncate` גם למפתח הסודי (`AUDIT_LOG_IMMUTABLE`), חוץ מ-`purge_audit_logs()`, שמדליקה הגדרת טרנזקציה (`app.allow_audit_purge`) ומוחקת רק שורות שעבר זמן השמירה שלהן (§11.5).

### 15.11 גיבויים, PITR ושחזור

| שכבה | מה | תדירות ושמירה | יעד |
|---|---|---|---|
| Supabase | גיבוי יומי (כלול ב-Pro) | 7 ימים | — |
| Supabase PITR | שחזור לנקודת זמן (תוספת בתשלום, מופעלת ב-M7 לפני לקוחות משלמים) | 7 ימים | RPO ≤ 5 דקות |
| גיבוי לוגי ★ | GitHub Action `backup.yml` (ראשון 03:00 שעון ישראל; ב-cron של GitHub, שעובד ב-UTC: `0 0 * * 0`): `pg_dump -Fc` עם תפקיד הקריאה בלבד `backup_reader` (חלק 04 §15b; מחרוזת החיבור בסוד `BACKUP_DB_URL`) ← הצפנה ב-`age` ← S3 ב-`eu-central-1` עם Object Lock | שבועי, 30 יום; הגיבוי האחרון בכל חודש — 12 חודשים | הגנה מטעות אנוש ומהשבתת חשבון |
| קבצים ★ | **גיבויי Supabase לא כוללים את Storage.** `backup-storage.yml`: סנכרון `invoices` מדי יום (נשמר 7 שנים), ו-`brand-assets`, `uploads`, `renders` מדי שבוע ל-S3 עם גרסאות (`aws s3 sync --delete`; כלל lifecycle ‏`NoncurrentVersionExpiration` של 30 יום) | `invoices` — 7 שנים; השאר — גרסה שנמחקה או הוחלפה נשמרת 30 יום, כלומר קובץ שנמחק בשירות נעלם מהגיבוי לכל המאוחר 37 ימים אחרי המחיקה (הערך שמופיע ב-§11.5 ובמדיניות הפרטיות, חלק 02 §10.3) | |
| Redis (Upstash) | לא מקור אמת (מגבלות קצב ומונה תקציב שמסונכרן מה-DB) | ללא גיבוי | |

- אם הפרויקט לא מאפשר להעניק `BYPASSRLS` ל-`backup_reader` [M0-verify], ‏`backup.yml` משתמש במחרוזת החיבור של `postgres` שבסוד `SUPABASE_DB_URL_PRODUCTION`, וההחלטה נרשמת ב-`DECISIONS.md` (חלק 04 §15b).
- **הגבלות רשת למסד הפרודקשן (Network Restrictions של Supabase): כבויות בהשקה.** `backup.yml` ו-`migrate-production` (ב-`release.yml`) רצים על runners של GitHub, שאין להם IP יציא קבוע, והגבלה לפי IP הייתה חוסמת אותם. בקרות מפצות: אכיפת SSL פעילה; סיסמת `postgres` חזקה, שמוחלפת כל רבעון ואחרי כל שינוי בצוות; `backup_reader` בהרשאות מינימליות; מחרוזות החיבור רק בסודות GitHub; אין פרטי חיבור ישירים ל-5432 במחשבי מפתחים (`supabase db` דרך התחברות ה-CLI). הפעלת ההגבלה דורשת קודם runner עם IP יציא קבוע (self-hosted או larger runner) ברשימת ההיתר. ההחלטה נרשמת ב-`DECISIONS.md`, והיא פריט פתוח ב-§25.
- סודות הגיבוי (GitHub בלבד) ★: `BACKUP_DB_URL`, `BACKUP_S3_BUCKET`, `BACKUP_AWS_ACCESS_KEY_ID`, `BACKUP_AWS_SECRET_ACCESS_KEY`, `BACKUP_AWS_REGION` (`eu-central-1`), `BACKUP_AGE_RECIPIENT` (המפתח הפרטי לפענוח נשמר אצל המייסד, מחוץ לכל מערכת).
- **תרגיל שחזור רבעוני:** שחזור הגיבוי האחרון לפרויקט Supabase זמני (או מקומי), `pnpm db:test`, `credit_invariant_violations()` = 0, השוואת ספירות שורות; תיעוד ב-`docs/runbooks/restore-drill-{yyyy-mm}.md`. יעד RTO: 4 שעות. runbook R9.

### 15.12 שרשרת אספקה ובדיקת חדירות

- `pnpm install --frozen-lockfile`; `pnpm.onlyBuiltDependencies` (pnpm 10 חוסם סקריפטי התקנה כברירת מחדל): רק `esbuild`, `sharp`, `@sentry/cli`, `supabase` ומה שהספייק יוסיף, עם הסבר ב-`DECISIONS.md`.
- Renovate: קבוצות שבועיות; חבילות `remotion` ו-`@remotion/*` תמיד יחד ובאותה גרסה מדויקת; `ai` ו-`@openrouter/ai-sdk-provider` נעולות (נספח F §2, חלק 05 §3) — עדכון ראשי רק עם ספייק.
- CI: `pnpm audit --prod --audit-level=high` (כישלון על high/critical בלי חריגה מתועדת), gitleaks, CodeQL (הגדרת ברירת המחדל של GitHub).
- **לפני השקה (M7):** בדיקת חדירות חיצונית, או לפחות הערכה מובנית לפי OWASP ASVS רמה 1, עם תיקון כל ממצא בחומרה גבוהה. הממצאים נשמרים ב-`docs/security/pentest-{yyyy}.md`.

### קריטריוני קבלה
- [ ] בדיקת e2e על כותרות: CSP קיים בכל דף; בדפי `/app` יש nonce; בדפי שיווק סטטיים אין nonce והם נשארים ISR; ב-`/`, ב-`/hooks/real-estate` וב-`/app` אין אף אירוע `securitypolicyviolation`, והאפליקציה עוברת hydration.
- [ ] משתמש שאינו מנהל פלטפורמה מקבל 404 ב-`/admin`, ומנהל בלי `aal2` מופנה ל-`/admin/mfa` ומשם, אחרי קוד נכון, חוזר ל-`next`.
- [ ] `safeFetch` דוחה (בדיקות יחידה): `http://127.0.0.1`, `http://[::1]`, `http://169.254.169.254/latest/meta-data`, `http://2130706433`, `http://0x7f.1`, דומיין שמפנה (DNS) ל-`10.0.0.5`, והפניה 302 מכתובת ציבורית לכתובת פנימית.
- [ ] `update audit_logs …` ו-`delete from audit_logs …` נכשלים גם עם המפתח הסודי (`AUDIT_LOG_IMMUTABLE`), ו-`purge_audit_logs()` מוחקת רק שורות שעבר זמנן.
- [ ] `decryptToken` מפענח טוקן שהוצפן במפתח הקודם אחרי רוטציה, ו-`rotate-encryption-key` מעביר את כולם לגרסה החדשה.
- [ ] `backup.yml` רץ ב-staging, והקובץ המוצפן ניתן לשחזור (תועד תרגיל ראשון ב-M7).

---

## §16. תצפיתיות, לוגים והתראות

### 16.1 Sentry

- `@sentry/nextjs` עם `instrumentation.ts` (שרת ו-edge) ו-`instrumentation-client.ts`; `withSentryConfig` ב-`next.config.ts`; אזור נתונים באיחוד האירופי (DSN של `de.sentry.io`).
- `environment = APP_ENV`, `release = VERCEL_GIT_COMMIT_SHA`; מפות מקור מועלות בבנייה ונמחקות מהפלט (`sourcemaps.deleteSourcemapsAfterUpload: true`).
- `sendDefaultPii: false`; `beforeSend` / `beforeSendTransaction` (`lib/sentry/scrub.ts`): מסירים עוגיות, כותרות `authorization`, `apikey`, `cookie`, `x-openrouter-*`, פרמטרים `token|t|k|s|invite|session`, ומחליפים מיילים וטלפונים ישראליים בהודעות ב-`[redacted]`.
- `tracesSampleRate`: פרודקשן 0.1, preview 1.0. Session Replay כבוי. `tunnelRoute: "/monitoring"` (מוחרג מבדיקות ההתחברות ב-`proxy.ts`).
- תגיות: `job_id`, `step_key`, `workspace_id`, `route`, `error_code`. שגיאות צנרת מקובצות לפי `error_code` + `step_key` (fingerprint).
- **Cron Monitors:** `Sentry.withMonitor` לכל נתיב cron (לוח זמנים מ-`vercel.json`), כדי שריצה שלא קרתה תתריע.
- **Uptime Monitors** של Sentry ל-`/`, `/hooks/real-estate` ו-★ `/api/health`.
- שמירה: 90 יום.

### 16.2 לוגים (`lib/log.ts`)

```ts
type LogFields = { requestId?: string; route?: string; userId?: string; workspaceId?: string; jobId?: string; stepKey?: string;
                   provider?: string; durationMs?: number; status?: number; errorCode?: string; [k: string]: unknown };
export const log = {
  info: (msg: string, f?: LogFields) => emit("info", msg, f),
  warn: (msg: string, f?: LogFields) => emit("warn", msg, f),
  error: (msg: string, f?: LogFields & { err?: unknown }) => emit("error", msg, f),
  child: (base: LogFields) => ({ /* same API, merged fields */ }),
};
// emit → one JSON line: { ts, level, msg, env, release, ...redact(fields) }
```

- `redact()` מסיר מפתחות שתואמים `/token|secret|password|authorization|apikey|cookie|card|pan|cvv/i`, ומחליף מיילים וטלפונים ב-`[redacted]`. **אסור** לרשום גופי webhooks, גופי בקשות תשלום, טקסטים של פרומפטים או תסריטים (רק אורך ו-hash).
- דגימה: `GET /api/hooks/search` ו-`estimate` — 1% מהבקשות המוצלחות; שגיאות — תמיד.
- אירועים שחייבים להישמר לאורך זמן נשמרים **במסד**, לא רק בלוג: `webhook_events`, `audit_logs`, `ai_generations`, `job_steps`, `email_messages`. לוגי Vercel הם לטווח קצר; העברה (log drain) לספק חיצוני תתווסף רק בהחלטה מתועדת.

### 16.3 `/api/health` ★

החוזה המלא בחלק 04 §21.5: `GET`, ציבורי, bucket ‏`health` (60 לדקה ל-IP), מחוץ ל-matcher של `proxy.ts`, ‏`cache-control: no-store`, בלי סודות ובלי גרסאות של תלויות: `{ ok, db: "ok" | "error", redis: "ok" | "error", version, time }`. ‏`db` = `rpc("health_ping")` עם המפתח הציבורי; `redis` = `PING`; זמן קצוב של 2 שניות לכל בדיקה; `version` = 7 התווים הראשונים של `VERCEL_GIT_COMMIT_SHA`. ‏503 (אותו גוף, `ok: false`) כשאחת מהבדיקות נכשלה. זה הנתיב שה-Uptime Monitor של Sentry בודק (16.1).

### 16.4 התראות

מנוע: `lib/ops/alerts.ts` (`evaluateAlerts()`), רץ בתוך `/api/cron/sweep-jobs` (שרץ כל דקה) בדקות שמתחלקות ב-5 (ובדיקות יומיות בתוך `cleanup`), עם מניעת כפילויות ב-Upstash (`SET alert:{kind}:{bucket} NX EX {ttl}`). ערוצים: מייל `admin_alert` ל-`ADMIN_EMAILS`, התראה באפליקציה (`notifications` מסוג `system`) למנהלי פלטפורמה, ואריח אדום בלוח `/admin`. התראות Sentry (שגיאות, cron, זמינות) — דרך Sentry, עם אפליקציית המובייל לדחופות.

| חומרה | תגובה |
|---|---|
| P0 | מיד, בכל שעה (השבתה, כסף, אבטחה) |
| P1 | תוך שעה בשעות פעילות |
| P2 | באותו יום |
| P3 | סיכום שבועי |

| התראה | תנאי | חלון | חומרה | Runbook |
|---|---|---|---|---|
| אחוז הצלחה נמוך | `succeeded / (succeeded + failed)` < 95% עם 10 עבודות לפחות | 60 ד׳ | P1 | R1 / R4 |
| עבודות תקועות | עבודה `running` מעל 30 ד׳ בלי heartbeat, או 5+ צעדי קליפ ב-`waiting_external` מעל 20 ד׳ | 5 ד׳ | P1 | R4 |
| כשלי רינדור | 3+ `render_runs` שנכשלו | 30 ד׳ | P1 | R4 |
| שגיאות OpenRouter | מעל 20% `error`/`timeout` ב-`ai_generations` למשימה (20 קריאות לפחות) | 15 ד׳ | P1 | R1 |
| שימוש בגיבוי | `fallback_used` מעל 30% בנתיב | 60 ד׳ | P2 | R2 |
| מודל בנתיב פעיל יצא משימוש | `sync-models` סימן | יומי | P1 | R2 |
| תקציב יומי | 70% / 90% / 100% (חלק 05 §7.3) | יום | P2 / P1 / P0 | R6 |
| **חריגת הוצאה שעתית** | הוצאה בשעה האחרונה > max($5, פי 3 מהממוצע של אותה שעה ב-7 הימים הקודמים) | שעה | P1 | R6 |
| **חריגת הוצאה של סביבה** | סביבה עם הוצאה היום מעל $20 וגם פי 5 מהממוצע היומי שלה ב-30 יום | שעה | P2 | R6 |
| עבודה יקרה מהצפוי | עלות עבודה > פי 2 משווי הקרדיטים שנשמרו (חלק 05) | לכל עבודה | P3 | R6 (סיכום שבועי) |
| שחיקת רווח | עלות 24 שעות ÷ (הקרדיטים שנצרכו × $0.02, עלות היעד לקרדיט) > 1.2 | יומי | P2 | R6 שלב 5 (בדיקת `credit_costs`) |
| יתרת OpenRouter נמוכה | יתרה < 3 ימי הוצאה ממוצעת [M0-verify נקודת יתרה ב-API] | שעה | P1 | R6 |
| webhooks של תשלום | 3+ `webhook_events` של `payment` בסטטוס `failed`, או `reconcilePendingCheckouts` מצא תשלום שלא דווח | שעה | P1 | R3 |
| אחוז השלמת קופה | `completed / created` < 50% עם 10 סשנים לפחות | 6 שעות | P2 | R3 |
| כשלי חידוש | מעל 20% מהחידושים בריצה נכשלו (5 לפחות) | לריצה | P1 | R3 |
| תשלום בלי חשבונית | תשלום מוצלח מעל 30 ד׳ בלי `invoices` (ובאותה בדיקה נשלח ללקוח `payment_receipt` בוריאנט `invoicePending`, §9.5) | 15 ד׳ | P1 | R5 |
| SLA ביטול | פנייה בנושא ביטול שלא טופלה ונותר יום עסקים אחד | שעה | P1 (חוקי) | §10.2 |
| SLA החזר | בקשת החזר ידנית מעל 2 ימי עסקים | יומי | P2 | §10.6 |
| מיילים | מעל 5% `failed`/`bounced` בשעה, או כשל בשליחת קישורי כניסה | שעה | P2 / P0 | R8 |
| שגיאות אפליקציה | מעל 50 שגיאות ב-5 דקות בפרודקשן (Sentry) | 5 ד׳ | P1 | לפי המקור: R1 (ספק AI), R9 (מסד), אחרת rollback (§19.5) |
| cron שלא רץ | Sentry Cron Monitor | — | P1 | R3 (`billing-renewals`), R4 (`sweep-jobs`); השאר — הרצה ידנית מ-`/admin` (`POST /api/admin/ops/cron`) |
| זמינות | `/api/health` נכשל בשתי בדיקות רצופות | — | P0 | R9 |
| מסד נתונים | CPU מעל 80% ל-15 דקות או דיסק מעל 80% (התראות Supabase) | — | P1 | R9 |
| **סטייה בקרדיטים** | `credit_invariant_violations()` מחזירה שורות (בדיקה שעתית) | שעה | P0 | `billing_checkout` כבוי ו-`renewals_paused`, `maintenance_mode` אם הסטייה גדלה, ובדיקה מול היומן (R9 לשחזור) |

### קריטריוני קבלה
- [ ] שגיאה יזומה בנתיב בדיקה מופיעה ב-Sentry עם `release` נכון, בלי עוגיות ובלי מייל בגוף.
- [ ] כל cron ב-`vercel.json` מופיע כ-Cron Monitor ב-Sentry.
- [ ] בדיקת יחידה: `redact()` מסיר `cardToken`, ‏`Authorization` ומייל מתוך אובייקט מקונן.
- [ ] סימולציה של כל התראה בטבלה (עם נתוני בדיקה) שולחת מייל אחד בלבד גם כשהתנאי נמשך שעה.
- [ ] `/api/health` מחזיר 503 כש-Redis לא זמין.

---

## §17. תקציבי ביצועים

| תחום | מדד | תקציב | איך נמדד |
|---|---|---|---|
| שיווק | LCP (4G, אנדרואיד בינוני) | < 2.5 ש׳ | Lighthouse CI (נייד) + Vercel Speed Insights (שטח) |
| | CLS | < 0.05 | אותו דבר |
| | INP | < 200ms | Speed Insights |
| | TTFB בדפי הוקים מ-ISR | < 300ms | Lighthouse CI + בדיקת עומס |
| | JS בדף הבית (gzip) | ≤ 170KB | `scripts/check-bundle.ts` / LHCI `resource-summary` |
| | JS בדפי הוקים ונישה | ≤ 150KB | אותו דבר |
| | פוסטרים AVIF / קליפים בגיבור | ≤ 40KB / ≤ 1.2MB | בדיקת נכסים ב-CI |
| | Lighthouse נייד: ביצועים / נגישות / SEO | ≥ 90 / 100 / 100 (`/`, `/hooks/[niche]`, `/pricing`) | LHCI assertions |
| אפליקציה | דשבורד אינטראקטיבי | < 2 ש׳ | Playwright trace על preview |
| | JS של מעטפת האפליקציה | ≤ 250KB | בדיקת bundle |
| | Remotion Player | נטען רק באשף ובעורך (`dynamic(() => import(...), { ssr: false })`) | בדיקה שהחבילה לא ב-chunk של `/app` |
| | טוקנים ראשונים של תסריט | < 3 ש׳ | מדידה בשרת (`script_generated.ms`) |
| API (p95) | `GET /api/hooks/search` | < 300ms | בדיקת עומס |
| | `POST …/estimate` | < 200ms | |
| | `GET /api/jobs/[id]` | < 150ms | |
| | `POST /api/billing/checkout` | < 1.5 ש׳ (כולל הספק) | |
| | אישור webhook תשלום / וידאו | < 2 ש׳ / < 500ms | |
| | תוצאת חילוץ מותג | < 20 ש׳ | |
| מסד | שאילתה p95 | < 50ms | `pg_stat_statements` (סקירה ב-M7) |
| | `reserve_credits` | < 20ms | בדיקת מקביליות |
| צנרת | 30 ש׳ סטנדרט, מקצה לקצה | p50 < 6 ד׳, p95 < 12 ד׳ | `generation_completed.duration_ms` + לוח אדמין |
| | רינדור 30 ש׳ 1080p לפורמט | p50 < 90 ש׳ | `render_runs.render_ms` |
| | הצלחת רינדור / הצלחת יצירה | ≥ 99% / ≥ 97% | לוח אדמין |

`.lighthouserc.json` מריץ את הדפים `/`, `/hooks/real-estate`, `/niches/dentists`, `/pricing` (פריסט נייד) על כתובת ה-preview, עם assertions שמכשילות את ה-PR. `scripts/check-bundle.ts` קורא את פלט הבנייה [M0-verify את מבנה הפלט של Turbopack ב-Next 16; אם אין נתוני גודל לכל נתיב — נשענים על `resource-summary:script:size` של LHCI].

### קריטריוני קבלה
- [ ] LHCI רץ על כל PR מול ה-preview ונכשל כשתקציב נשבר.
- [ ] בדיקה ש-`@remotion/player` לא נטען ב-`/app` (הדשבורד) — רק באשף ובעורך.
- [ ] דוח ביצועי מסד מ-`pg_stat_statements` ב-M7 בלי שאילתה מעל 50ms p95 בנתיבים החמים.

---

## §18. אסטרטגיית בדיקות

### 18.1 השכבות

| שכבה | כלי | איפה | מתי רץ | מה מכסה |
|---|---|---|---|---|
| יחידה | Vitest (node; jsdom לרכיבים) | `tests/unit/**` | כל PR | חישובים, נרמול עברית, bidi, כתוביות, חיוב, הצפנה, אנליטיקה, מיילים |
| חוזה | Vitest + MSW + fixtures מוקלטים | `tests/contract/**` | כל PR | בוני הבקשות והמפענחים של OpenRouter, Grow, Morning, Resend; נתיבי API (חלק 04 §25.5) |
| מסד | pgTAP (`supabase test db`) + מקביליות ב-Vitest | `supabase/tests/*.sql`, `tests/contract/credits.concurrency.test.ts` | כל PR | RLS, פונקציות קרדיטים, אחסון, Realtime (חלק 04 §25) |
| e2e | Playwright | `tests/e2e/**` | כל PR (על build מקומי), smoke על preview ו-staging | זרימות מלאות ב-RTL |
| נגישות | `@axe-core/playwright` + בדיקות מקלדת | `tests/e2e/a11y/**` | כל PR | WCAG 2.2 AA אוטומטי |
| ויזואלי | Playwright `toHaveScreenshot` + השוואת stills של Remotion | `tests/visual/**` | כל PR (בקונטיינר Linux קבוע) | bidi בסרטון, תמונות OG, גלריית הרכיבים בשתי הערכות |
| עומס | tsx (צנרת) + k6 (HTTP) | `tests/load/**` | M5, M7, ולפני שינוי תשתית | 20 עבודות במקביל, דפים ונתיבים חמים |
| ידני | בדיקת שפה בידי דובר עברית כשפת אם, קוראי מסך, מכשירים | `docs/qa/**` | M2, M3, M5, M7 | איכות השפה, נגישות אמיתית |

**ספי כיסוי** (`vitest --coverage`, נכשל מתחת): `lib/billing/**` ו-`lib/credits/**` — 95% שורות; `lib/captions/**`, `lib/hebrew/**`, `lib/security/**` — 90%; כל השאר — 75%.

### 18.2 בדיקות יחידה מחייבות

| מודול | מקרים |
|---|---|
| `lib/billing/vat.ts`, `money.ts` | טבלת 1.4; property-based (`fast-check`) — `net + vat = gross`; שיעור עתידי לפי תאריך; כלל השמות של 1.3 כלל 1 (מאפיין `Agorot` מסתיים ב-`Ag`, מאפיין `…Ils` אינו `Agorot`; בדיקת טיפוסים עם `expectTypeOf`) |
| גבולות הכסף (`money.ts`, `grow.ts`, `refunds.ts`, `proration.ts`) | החזר של ₪98.17 ← `provider.refund` מקבל `amountAg: 9817` ← בקשת Grow עם `refundSum: "98.17"`; אירוע קופה עם `amountAg: 28900` מול סשן עם `amount_ils = 289.00` ← לא `amount_mismatch`; `toApiRefundQuote(q).refundIls === 98.17`; `quoteToDb(q).charge_now_ils` הוא מחרוזת עשרונית (`"350.50"`) |
| `lib/billing/credits.ts` | עם ה-seed: חינם ← `perVideoCredits = 30`, `videosLeft(70) = 2`, `lowThreshold = 30`; בסיס (מכסה 400) ← `lowThreshold = 60`; סוכנות (3,300) ← 495; `planAllowance = null` לא מחלק ולא נשבר |
| `lib/billing/periods.ts` | 31 בחודש, שנה מעוברת, מעבר שעון (2026-10-25, 2027-03-26), עוגן בשעה 23:30 |
| `lib/billing/proration.ts` | טבלת 5.2; חסימה ב-`past_due`; סף ₪5 |
| `lib/billing/refunds.ts` | טבלת 10.5; 14 יום לפי `confirmation_sent_at`; תשלום שכבר הוחזר חלקית |
| `lib/billing/dunning.ts` | הלוח `[1,3,7]`, `provider_error` לא נספר, וריאנטים של מיילים |
| `lib/billing/grow.ts` | `redactGrowPayload`, מיפוי קודי דחייה, אימות `?k=` |
| `lib/invoicing/*` | שורות בעברית (9.3), סף הקצאה לפי תאריך, `findByReference` אחרי timeout |
| `lib/pipeline/estimate.ts` | `estimateSample(SAMPLE_PRESETS.*)` מחזיר 23 / 50 / 107 / 478 מה-seed (נספח F §10.4, חלק 05 §14.2), כולל `render.base` ארוך |
| `lib/captions/*` | יישור ל-script, דפדוף (מספר+יחידה לא נשבר), SRT/VTT בעברית |
| `lib/hebrew/*` | placeholders עם ב+ה, נרמול ״/׳, ניקוד, lint של לוכסנים מגדריים וביטויים אסורים |
| `lib/security/safe-fetch.ts` | רשימת הדחייה ב-§15 |
| `lib/crypto.ts` | הצפנה/פענוח, רוטציה, טוקני מייל עם מפתח קודם |
| `lib/analytics/events.ts` | דחיית PII, סכמה לכל אירוע |
| `lib/email/*` | snapshot לכל תבנית ווריאנט; "פרסומת:" חובה בדיוור; `dir="rtl"`; טקסט נקי |
| `lib/flags.ts` | סדר עדיפויות (env ← סביבה ← תוכנית ← כללי), env לא גובר בפרודקשן |
| `lib/env.ts` | `mock` אסור בפרודקשן; כל משתנה חובה חסר — שגיאה ברורה |

### 18.3 בדיקות חוזה עם fixtures מוקלטים

- **מבנה fixture** (`tests/fixtures/{openrouter,grow,morning,resend}/{scenario}.json`):

```json
{ "provider": "morning", "scenario": "document-320-vat-included", "recordedAt": "2026-10-20T09:12:00Z", "note": "sandbox",
  "request":  { "method": "POST", "url": "${MORNING_API_BASE_URL}/documents", "headers": { "authorization": "[redacted]" }, "body": { "type": 320 } },
  "response": { "status": 200, "headers": { "content-type": "application/json" }, "body": { "id": "…", "number": "…" } } }
```

- **הקלטה:** `pnpm fixtures:record --provider=morning --scenario=document-320-vat-included` (`scripts/record-fixtures.ts`) רץ **רק מקומית** עם מפתחות sandbox, מעביר כל בקשה ותשובה דרך `lib/testing/redact.ts` (טוקנים, אסימונים, מיילים, מספרי עוסק אמיתיים), ושומר. ב-CI אין מפתחות אמיתיים.
- **מה נבדק:** (1) בוני הבקשות שלנו מפיקים גוף זהה ל-fixture (snapshot, בלי שדות משתנים); (2) המפענחים (Zod) מקבלים את התשובות המוקלטות; (3) מיפוי שגיאות (402, 429, 5xx, timeout) ל-`ErrorCode` / `ChargeResult`.
- **תרחישים מינימליים:**
  - OpenRouter (כל הנתיבים יחסיים ל-`${OPENROUTER_BASE_URL}`): צ׳אט עם `json_schema`; צ׳אט שבו שירת מודל הגיבוי; 429; תשובה בלי `usage.cost` (סינתטית); `/images` עם `b64_json`; `/videos` ‏202; poll במצבים `in_progress`/`completed`/`failed`/`expired`; הורדת תוכן (MP4 קטן); webhook חתום (סינתטי, לפי הפורמט שאומת ב-M0); `/audio/speech`; `/audio/transcriptions` ‏`verbose_json` בעברית; `/models`; `/videos/models`; `/generation`.
  - Grow (אחרי הספייק): יצירת עמוד; notify; שאילתה חוזרת; `approveTransaction` (אם קיים); חיוב לפי אסימון — הצלחה, סירוב, תוקף פג; החזר מלא וחלקי; שאילתת סטטוס.
  - Morning: טוקן; 320 כולל מע״מ; 330 מקושרת; תשובה עם מספר הקצאה; חיפוש לפי `remarks`; שגיאת ולידציה.
  - Resend: שליחה; webhook מסוג `email.bounced` ו-`email.complained` (חתימת Svix).
- **בדיקת סטייה שבועית** (`contract-live.yml`, יום שני 06:00): מפענחת את `/models` ו-`/videos/models` האמיתיים, מריצה קריאת `llm.cheap` אחת עם `json_schema` (פחות מ-$0.001), ופונה ל-sandbox של Grow ו-Morning. סטייה ← issue אוטומטי ב-GitHub עם ההבדלים.

### 18.4 e2e (Playwright)

**סביבת הריצה ב-CI:** `next build && next start` מקומי + `supabase start` + `pnpm db:seed`, עם הערכים האלה (בקובץ `.env.ci` שנשמר בריפו, בלי סודות):

| משתנה | ערך ב-e2e |
|---|---|
| `OPENROUTER_BASE_URL` | `http://localhost:4010/api/v1` — שרת ה-mock ★ `tests/mocks/openrouter-server.ts` (Node, מגיש fixtures לפי תרחיש, שולח webhooks חתומים בסוד בדיקה אחרי השהיה, ועונה ל-`GET /health`) |
| `PAYMENT_PROVIDER` / `INVOICE_PROVIDER` | `mock` / `mock` |
| `ORCHESTRATOR` / `RENDER_PROVIDER` | `inline` / `local` עם ★ `RENDER_SCALE=0.25` (רינדור 270×480, מהיר) |
| `EMAIL_PROVIDER` ★ | `smtp` אל Mailpit/Inbucket של Supabase המקומי; הבדיקות קוראות מיילים מה-API שלו [M0-verify איזה מהשניים בגרסת ה-CLI] |
| `APP_ENV` | `test` |

**הגדרות:** `locale: "he-IL"`, `timezoneId: "Asia/Jerusalem"`; פרויקטים: `desktop-chrome` (1440×900), `mobile-safari` (iPhone 14), `mobile-chrome` (Pixel 7). איתור רכיבים **רק לפי תפקיד ושם נגיש בעברית** (`getByRole("button", { name: "המשך" })`) — כך כל בדיקה מאמתת גם את התוויות. התחברות: בדיקה אחת דרך קישור קסם אמיתי מ-Mailpit; השאר דרך `loginAs(page, email)` (`auth.admin.generateLink` ← `/auth/confirm`).

**המסלול המלא של האשף (`wizard-happy-path.spec.ts`, mock AI):**
1. `/hooks/real-estate` ← כרטיס ההוק הראשון ← **"צרו סרטון מההוק"** ← הפניה ל-`/login` עם הודעת ההקשר של האשף.
2. התחברות בקישור קסם (Mailpit) ← האשף בשלב `business`, עם ההוק שמור.
3. `business`: **"שם העסק"**, **"אין לי אתר"**, תיאור קצר ← **"המשך"**. ‏`niche` (ממולא: נדל״ן) ← **"המשך"**. ‏`goal`: **"רילס עם הוק"**, 30 שניות, 9:16 בלבד ← **"המשך"**. ‏`hook`: ההוק מסומן ← **"המשך"**. (המשתמש חדש ובתוכנית החינמית: טיוטה, פורמט אחד, עד 30 שניות ו-70 קרדיטי ניסיון — §2.5. מסלול בתשלום עם שלושה פורמטים נבדק ב-`paid-generation.spec.ts`.)
4. `script`: תסריט בזרם (fixture מנספח D) — הטקסט מכיל את ההוק; `MissingFactsPanel` דורש למלא **{מחיר}** ← מילוי ← **"המשך"**.
5. `style` (טיוטה, משולב, פופ) ← `voice` ← `music` (ספרייה) ← `preview`: נגן האנימטיק גלוי; `CostBadge` שווה בדיוק לתשובת `/estimate` (50 קרדיטים, כמו `SAMPLE_PRESETS.draft30`).
6. **"צרו את הסרטון · {n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}"** (כאן: "צרו את הסרטון · 50 קרדיטים") ← `ConfirmGenerateDialog` ← אישור ← עמוד ההתקדמות: `StageList` מתקדם; תוך 3 דקות — **"מוכן"**.
7. היתרה ירדה בדיוק בסכום שנלכד (`credits_captured`); מייל `video_ready` עם הנושא הנכון ב-Mailpit.
8. עמוד הפרויקט: הורדת MP4 של 9:16 (`content-type: video/mp4`; לפי `@remotion/media-parser` המשך בין 27 ל-36 שניות — היעד ועוד כרטיס הסיום, בחלון −10%/+20% של נספח F §8.1), סימן מים בפינה, SRT עם טקסט עברי וחותמות זמן, VTT.
9. בכל שלב: axe בלי הפרות `serious`/`critical`, ו-`<html dir="rtl">`. בדיקת כיוון: בפוטר האשף, ה-x של **"הקודם"** גדול מזה של **"המשך"** (התחלה = ימין).

**שאר הבדיקות:**

| קובץ | מה בודק |
|---|---|
| `auth-onboarding.spec.ts` | קישור קסם וקוד בן 6 ספרות (הדבקה), אונבורדינג, 70 קרדיטים, `consents` של `terms`/`privacy` |
| `trial-abuse.spec.ts` | Gmail עם נקודות ו-`+tag` — בלי קרדיטים, כרטיס ההסבר הנכון |
| `fast-path.spec.ts` | "צרו לי הכל אוטומטית" מ-`business` עד אישור |
| `degraded-scene.spec.ts` | קליפ שנכשל פעמיים ← סצנה מתמונה בתנועה, הקרדיטים חזרו, ההודעה בעמוד הפרויקט |
| `job-failure-refund.spec.ts` | כשל TTS ← `failed`, החזר מלא, מייל `video_failed_refunded`, ניסיון חוזר בלי חיוב כפול |
| `billing-topup.spec.ts` | חבילה ב-mock ← "מאשרים…" ← "התשלום התקבל", קרדיטים, חשבונית mock, מייל עם PDF; webhook כפול לא מעניק פעמיים |
| `billing-subscription.spec.ts` | רכישת בסיס (תיבת התנאים חובה) ← שדרוג לעסק (הצעת המחיר היחסית) ← ביטול ב-2 לחיצות ← מייל אישור; הצעת החזר בתוך 14 יום |
| `billing-past-due.spec.ts` | סביבה ב-`past_due` (seed): באנר לבעלים ולמנהלים בלבד; עדכון כרטיס שומר אסימון ומחייב מיד את החוב (מפתח `renew:`), ודף החזרה מציג "ניסינו לחייב שוב, והחיוב עבר." |
| `paid-generation.spec.ts` | סביבה עם מנוי בסיס (seed): סטנדרט, 9:16 + 1:1 + 16:9, שלושה קבצים להורדה בלי סימן מים |
| `plan-change.spec.ts` | הצעת `dryRun` זהה לביצוע; שדרוג באמצע חודש מחייב לפי §5.2; הורדת תוכנית נקבעת לסוף התקופה ומבטלת את עצמה בבקשה לתוכנית הנוכחית |
| `cancel-refund.spec.ts` | ביטול עם בקשת החזר בתוך 14 יום: הקרדיטים שנותרו מוסרים, חשבונית זיכוי ב-mock, מייל `refund_processed`, המנוי נסגר; עם יצירה פעילה תיבת ההחזר מושבתת |
| `team-roles.spec.ts` | הזמנה, צופה לא יוצר, עורך לא רואה חיוב, מנהל לא מבטל |
| `agency-client.spec.ts` | סביבת לקוח צורכת מהסוכנות; `/app/billing` בלקוח מציג "מנוהל בסוכנות" |
| `share-approve.spec.ts` | קישור אישור, החלטה מ-`/approve/[token]`, מייל `approval_received` |
| `hooks-library.spec.ts` | העתקה, התאמה אישית, `noindex` בפאסטים, canonical |
| `consent.spec.ts` | אין PostHog לפני הסכמה, GPC, ביטול מוחק עוגיות |
| `election-mode.spec.ts` | בריף פוליטי ← 451 עם ההסבר; אחרי `until` ← `MODERATION_BLOCKED` |
| `privacy-account.spec.ts` | ייצוא (מייל + הורדה), חסימת מחיקה לבעלים עם צוות, מחיקה ומייל |
| `security-headers.spec.ts` | CSP, HSTS (staging), nonce בדפים דינמיים, אפס `securitypolicyviolation`, 404 ל-`/dev/*` בפרודקשן-דמה |
| `admin-mfa.spec.ts` | משתמש רגיל ← 404 ב-`/admin`; מנהל בלי `aal2` ← `/admin/mfa` ← קוד TOTP (סוד בדיקה) ← `/admin`; פעולת אדמין נרשמת ב-`audit_logs` |

**תגיות:** `@smoke` (הרשמה, דף הבית, ספריית ההוקים, עמוד מחירים, `/api/health`) רץ על כל preview ו-staging; `@billing-sandbox` רץ רק ב-staging מול Grow ו-Morning sandbox; `@readonly` רץ בפרודקשן אחרי כל פריסה.

### 18.5 נגישות אוטומטית

`tests/e2e/a11y/pages.spec.ts` עובר על כל תבניות הדפים הציבוריים (`/`, `/niches`, `/niches/[niche]`, `/hooks`, `/hooks/[niche]`, `/hooks/types/[type]`, `/hooks/season/[season]`, `/hooks/platform/[platform]`, `/examples`, `/templates/[slug]`, `/pricing`, `/blog/[slug]`, `/about`, `/contact`, `/faq`, 7 הדפים המשפטיים, `/login`, `/v/[token]`, `/approve/[token]`, `/unsubscribe`) ועל מסכי האפליקציה המרכזיים (דשבורד, כל שלב באשף, דיאלוג האישור, התקדמות, פרויקט, עורך, ספריות, ערכת מותג, חיוב, ביטול, הגדרות, צוות) — **בשתי הערכות, דסקטופ ומובייל, ועם `reducedMotion: "reduce"`**. תגיות axe: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; כישלון על `serious`/`critical`; `moderate` נרשם בדוח. בנוסף, `keyboard.spec.ts`: האשף כולו במקלדת בלבד; סידור סצנות בעורך במקלדת (רווח, חצים, רווח); מיקוד נראה ולא מוסתר מתחת לכותרת הדביקה; `Esc` סוגר דיאלוגים ומחזיר מיקוד.

### 18.6 RLS ובידוד

הסוויטה של חלק 04 §25 (pgTAP + מקביליות) היא הבסיס. מעליה, ב-`tests/contract/api/isolation.test.ts`: לכל נתיב שמקבל מזהה — משתמש מסביבה אחרת מקבל 404 (לא 403, כדי לא לחשוף קיום), כולל `/api/assets/[id]/url`, `/api/jobs/[id]`, `/api/billing/invoices/[id]`, ונתיבי האחסון החתומים.

### 18.7 בדיקות עומס

- **צנרת** (`tests/load/pipeline.ts`): מול staging, עם ★ שרת mock של OpenRouter שנפרס כפרויקט Vercel נפרד (`tools/mock-openrouter`, השהיות ריאליות: תמונה 4–12 ש׳, וידאו 60–180 ש׳ עם webhook, TTS ‏3–8 ש׳; 5% כשלים מוזרקים בקליפים) ועם רינדור אמיתי ב-Sandbox. יוצר 20 סביבות עם 2,000 קרדיטים, מפעיל 20 עבודות `full_generate` במקביל (30 ש׳, סטנדרט, 3 פורמטים) וממתין. **קבלה:** לפחות 19 מצליחות (וכשל רק מוזרק), כל כשל קליפ מוזרק הופך לסצנה מתמונה ולא לכשל עבודה, `credit_invariant_violations()` = 0, אין שמירה פתוחה בסוף, p95 מקצה לקצה < 12 ד׳, אפס 5xx ב-webhooks, CPU של המסד < 70%, אפס שגיאות ריצה ב-Workflows. הדוח נשמר ב-`docs/qa/load-{date}.md`.
- **HTTP** (`tests/load/http.k6.js`): `/hooks/real-estate` ב-100 בקשות לשנייה למשך 2 ד׳ (p95 TTFB < 300ms, אפס שגיאות); `/api/hooks/search` ב-50 לשנייה (p95 < 300ms); `estimate` מאומת ב-20 לשנייה (p95 < 200ms).

### 18.8 בדיקות ידניות

- **עברית** (M2, M5, M7): בודק שפה שעברית היא שפת האם שלו עובר על כל `messages/he.json`, המיילים, הדפים המשפטיים, הזרע, ו-20 בריפים בבדיקה עיוורת של מודלי התסריט (נספח F §7.1); ממצאים ב-`docs/qa/hebrew-review.md`, לפי נספח E.
- **קוראי מסך** (M7): NVDA עם Chrome ו-Firefox ב-Windows, VoiceOver ב-iOS Safari — הרשמה, אשף, עמוד פרויקט, ביטול מנוי.
- **מכשירים:** iPhone (Safari), אנדרואיד (Chrome), דסקטופ Chrome/Edge/Firefox/Safari; מיילים — §12.2 סעיף 13.

### קריטריוני קבלה
- [ ] `pnpm test`, `pnpm test:contract`, `pnpm db:test`, `pnpm test:e2e`, `pnpm test:a11y` ירוקים ב-CI על `main`.
- [ ] המסלול המלא של האשף עובר בשלושת הפרויקטים של Playwright, בפחות מ-6 דקות לכל ריצה.
- [ ] אין ב-repo מפתח אמיתי בתוך fixture (gitleaks + בדיקת `redact`).
- [ ] בדיקת הסטייה השבועית רצה בהצלחה לפחות פעם אחת לפני ההשקה.
- [ ] דוח עומס של M7 עומד בכל תנאי 18.7.

---

## §19. CI/CD, סביבות ומיגרציות

### 19.1 הסביבות

| סביבה | Vercel | Supabase | תשלום / חשבוניות | OpenRouter | תזמור / רינדור | מייל | הגנה |
|---|---|---|---|---|---|---|---|
| `local` | `pnpm dev` | `supabase start` | `mock` / `mock` | שרת mock מקומי, או מפתח dev עם מגבלה של $5 ליום | `inline` / `local` | `smtp` ← Mailpit | — |
| `preview` | פריסת Preview לכל PR | פרויקט staging | `mock` / `mock` | מפתח preview (מגבלה $20 ליום) | `vercel-workflow` / `vercel-sandbox` | Resend, רק לכתובות ב-★ `EMAIL_ALLOWLIST` | Vercel Authentication + Protection Bypass for Automation |
| `staging` | סביבה מותאמת `staging` ב-`staging.{{DOMAIN}}` | פרויקט staging | Grow sandbox / Morning sandbox | מפתח staging | כמו פרודקשן | Resend, עם allowlist | Vercel Authentication + Protection Bypass for Automation |
| `production` | Production ב-`{{DOMAIN}}` | פרויקט production | `grow` / `morning` | מפתח פרודקשן | `vercel-workflow` / `vercel-sandbox` | Resend | ציבורי |

- `APP_ENV` ★ (`local` | `test` | `preview` | `staging` | `production`) קובע התנהגויות: חסימת `mock`, הצגת `/dev/*`, `EMAIL_ALLOWLIST`, דגימת Sentry, HSTS.
- **`EMAIL_ALLOWLIST`** (רשימת סיומות וכתובות, למשל `@{{DOMAIN}},qa.inbox@gmail.com`): מחוץ לפרודקשן, מייל לכתובת שלא ברשימה לא נשלח, ונרשם `skipped_allowlist` — כך preview לא ישלח בטעות מייל ללקוח אמיתי.
- סביבת staging משמשת גם לבדיקות עומס, לבדיקות sandbox של תשלומים ולתרגיל השחזור.
- **webhooks ו-cron מאחורי ההגנה:** כש-`APP_ENV` הוא `preview` או `staging`, כל כתובת callback שאנחנו נותנים לספק מקבלת `x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}`: `callbackUrlFor` של OpenRouter (ב-staging מחזיר כתובת; ב-preview עדיין `null`, וה-sweeper עושה polling), `notifyUrl` של Grow (§8.2), וכתובות ה-webhook של Resend ו-Morning שנרשמות ל-staging. בפרודקשן לעולם לא: `lib/env.ts` מתעלם מהמשתנה כש-`APP_ENV=production` (`callbackBypassParam()` מחזיר אז מחרוזת ריקה). Vercel Cron רץ רק בפריסות פרודקשן, ולכן ב-staging ה-crons מופעלים מ-`staging-crons.yml` (§19.3) עם `CRON_SECRET_STAGING` וכותרת ה-bypass; `smoke-staging` קורא בעצמו ל-`/api/cron/billing-renewals` אם רכישת ה-sandbox לא הוחלה תוך 60 שניות. [M0-verify ספייק 12: Vercel Cron רק בפרודקשן; POST של Grow, OpenRouter ו-Resend עובר עם פרמטר ה-bypass]

### 19.2 ענפים ו-PR

- Trunk-based: `main` תמיד ניתן לפריסה. ענפים: `m{n}/{topic}` (עבודה של אבן דרך), `fix/{topic}`, `chore/{topic}`, `docs/{topic}`. Squash merge, כותרת ה-PR היא הודעת הקומיט (Conventional Commits, §23).
- **בדיקות חובה למיזוג:** `static`, `unit`, `db`, `build`, `e2e` (3 שארדים), `visual`, `security`, ו-LHCI על ה-preview. Vercel מוסיף ל-PR הערה עם כתובת ה-preview.

### 19.3 GitHub Actions

```yaml
# .github/workflows/ci.yml — every job starts with the composite action .github/actions/setup
# (checkout + pnpm/action-setup + setup-node 22 with pnpm cache + `pnpm install --frozen-lockfile`); all actions pinned by SHA
name: ci
on: { pull_request: {}, push: { branches: [main] } }
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }
jobs:
  static:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: pnpm typecheck && pnpm lint && pnpm lint:rtl && pnpm lint:copy && pnpm lint:billing && pnpm format:check
      - run: pnpm check-env --example            # .env.example covers every variable in lib/env.ts
  unit:
    needs: static
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: pnpm test --coverage
      - run: pnpm test:contract
  db:
    needs: static
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - uses: supabase/setup-cli@<sha>
      - run: supabase start
      - run: pnpm db:reset && pnpm db:seed && pnpm db:seed          # idempotent twice
      - run: pnpm db:lint && pnpm db:test
      - run: pnpm db:types && git diff --exit-code lib/supabase/database.types.ts
      - run: pnpm vitest run tests/contract/credits.concurrency.test.ts
  build:
    needs: static
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: pnpm build
        env: { APP_ENV: test }
  e2e:
    needs: [build, db]
    runs-on: ubuntu-latest          # no job container: `supabase start` needs the runner's Docker daemon
    strategy: { matrix: { shard: [1, 2, 3] } }
    steps:
      - uses: ./.github/actions/setup
      - run: cat .env.ci >> "$GITHUB_ENV"     # committed, no secrets: the e2e values of §18.4 (APP_ENV=test, mock providers, …)
      - uses: supabase/setup-cli@<sha>
      - run: pnpm exec playwright install --with-deps chromium webkit
      - run: supabase start && pnpm db:seed
      - run: pnpm build && (pnpm start & pnpm tsx tests/mocks/openrouter-server.ts &)   # app on :3000, OpenRouter mock on :4010
      - run: pnpm exec wait-on http://localhost:3000/api/health http://localhost:4010/health
      - run: pnpm test:e2e --shard=${{ matrix.shard }}/3
      - uses: actions/upload-artifact@<sha>
        if: failure()
        with: { name: playwright-report-${{ matrix.shard }}, path: playwright-report }
  visual:
    needs: [build, db]
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: cat .env.ci >> "$GITHUB_ENV"
      - uses: supabase/setup-cli@<sha>
      - run: supabase start && pnpm db:seed
      - run: pnpm build && (pnpm start &) && pnpm exec wait-on http://localhost:3000/api/health
      # screenshots run inside the pinned Playwright image (fixed fonts → stable pixels), against the app on the host network
      - run: >
          docker run --rm --network host -v "$PWD":/work -w /work
          mcr.microsoft.com/playwright:<pinned-version>-noble
          sh -c "corepack enable && pnpm test:visual"
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
      - run: pnpm audit --prod --audit-level=high
      - uses: gitleaks/gitleaks-action@<sha>
```

| Workflow | טריגר | מה עושה |
|---|---|---|
| `ci.yml` | PR, push ל-`main` | כמתואר |
| `preview-checks.yml` | `deployment_status` (Preview הצליח) | LHCI + Playwright `@smoke` מול כתובת ה-preview, עם ★ `VERCEL_AUTOMATION_BYPASS_SECRET` לעקיפת ההגנה |
| `release.yml` | push ל-`main` אחרי ש-`ci` עבר | `migrate-staging` ← `deploy-staging` ← `smoke-staging` (`@smoke` + `@billing-sandbox`; אם רכישת ה-sandbox לא הוחלה תוך 60 שניות, הוא קורא בעצמו ל-`/api/cron/billing-renewals`) ← **אישור ידני** (GitHub Environment `production` עם reviewer) ← `migrate-production` (על runner של GitHub בלי IP קבוע, ולכן הגבלות הרשת של המסד כבויות, §15.11) ← `deploy-production` (`vercel build --prod` + `vercel deploy --prebuilt --prod`) ← `smoke-production` (`@readonly`) ← שחרור ב-Sentry ותגית `v0.{m}.{patch}` |
| `backup.yml` / `backup-storage.yml` | cron שבועי / יומי | §15.11 (רצים על runners של GitHub; מחרוזות החיבור רק בסודות) |
| `staging-crons.yml` ★ | cron `*/10 * * * *` | קורא ל-`/api/cron/{sweep-jobs,billing-renewals,reminders,cleanup,hook-of-the-day}` ב-`staging.{{DOMAIN}}` עם `Authorization: Bearer ${CRON_SECRET_STAGING}` וכותרת `x-vercel-protection-bypass` (Vercel Cron רץ רק בפרודקשן, §19.1) |
| `contract-live.yml` | cron שבועי | §18.3 |
| `eval-prompts.yml` | cron לילי + `workflow_dispatch` | `pnpm eval:prompts` מול הנתיבים הפעילים, תקציב $5 להרצה, עם סוד `OPENROUTER_API_KEY` של staging (חלק 05 §23.5) |
| `codeql.yml` | הגדרת ברירת המחדל של GitHub | סריקת קוד |

- `vercel.json` כולל `"git": { "deploymentEnabled": { "main": false } }`, כדי ש-push ל-`main` **לא** יפרוס לפרודקשן לבד; הפריסה עוברת רק דרך `release.yml`, אחרי המיגרציות והאישור. פריסות Preview ל-PR נשארות אוטומטיות [M0-verify את המפתח ואת פריסת הסביבה המותאמת `staging` ב-CLI].
- כל ה-Actions מקובעות ל-SHA. סודות ה-CI ★: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF_STAGING`, `SUPABASE_PROJECT_REF_PRODUCTION`, `SUPABASE_DB_URL_STAGING`, `SUPABASE_DB_URL_PRODUCTION`, `SENTRY_AUTH_TOKEN`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `CRON_SECRET_STAGING` (= `CRON_SECRET` של staging, ל-`staging-crons.yml`), וסודות הגיבוי — `BACKUP_DB_URL` ו-`BACKUP_*` (§15.11, §20). ‏`contract-live.yml` ו-`eval-prompts.yml` רצים ב-GitHub Environment ‏`staging`, עם מפתחות ה-sandbox וה-staging תחת אותם שמות כמו בזמן ריצה (`OPENROUTER_API_KEY`, ‏`GROW_*`, ‏`MORNING_*`).

### 19.4 מיגרציות בפריסה

- התהליך המקומי בחלק 04 §2. בפריסה: **מיגרציה לפני קוד**, ולכן כל מיגרציה חייבת להיות **תואמת לגרסה הקודמת של הקוד** (expand ← פריסה ← contract במיגרציה נפרדת בפריסה הבאה). PR שמוחק או משנה שם של עמודה שהקוד הנוכחי עדיין קורא — נדחה בסקירה.
- מילוי נתונים (backfill) — סקריפט נפרד ואידמפוטנטי ב-`scripts/backfill/*.ts`, לא בתוך המיגרציה, כשמדובר ביותר מ-10,000 שורות.
- **Supabase Branching** (DB נפרד לכל PR שמשנה את `supabase/**`) — אופציונלי, אחרי ספייק [M0-verify: עלות, סנכרון המפתחות החדשים ל-Vercel, ושהוא לא מחיל מיגרציות על פרודקשן מחוץ ל-`release.yml`]. בלעדיו: preview עובד מול staging, ומיגרציות של PR נבדקות ב-CI על מסד מקומי בלבד; PR עם מיגרציה מוחל על staging רק אחרי מיזוג.
- **אסור** להריץ מיגרציות "down" בפרודקשן. תיקון = מיגרציה קדימה.

### 19.5 חזרה לאחור

- **קוד:** `vercel rollback` (או promote לפריסה הקודמת) — מיידי, ובטוח כי המיגרציות תואמות לאחור.
- **פיצ׳ר:** כיבוי דגל (§21) או מצב תחזוקה.
- **נתונים:** מיגרציית תיקון; PITR רק בהשחתת נתונים (R9).

### 19.6 מגבלות הפלטפורמה, תוכניות ורישיונות

העובדות כאן אומתו במחקר (`docs/research/05-stack.md`, ה-"Verification addendum" גובר על הטקסט שלפניו). כל מספר שמופיע כאן נכנס ל-`DECISIONS.md` עם תאריך הבדיקה.

| נושא | העובדה | מה זה אומר אצלנו |
|---|---|---|
| תוכנית Vercel | Hobby מיועד לשימוש לא מסחרי בלבד; Pro עולה $20 למושב, עם $20 שימוש כלול | כל הסביבות על **Vercel Pro**, באזור `fra1` (ליד Supabase `eu-central-1`) |
| משך ריצה של פונקציה | Hobby עד 300 שניות; ב-Pro ברירת המחדל 300 שניות, ואפשר להגדיר עד 800 (GA); משך מורחב של עד 30 דקות (1,800 שניות) רק ב-opt-in | נתיבי API לא עוברים 300: נתיבי AI אינטראקטיביים 300 עם תקציב זמן פנימי של 240 שניות (חלק 05 §2.2), `generate`/`render` 60, cron ‏300 (חלק 04 §18.5). עבודה ארוכה רצה בצעדי Vercel Workflows; צעד הרינדור משתמש במשך המורחב של עד 30 דקות (opt-in), שמוגדר ב-`vercel.json → functions` לנתיבי הצעדים של WDK (`.well-known/workflow/*`) |
| גודל גוף בקשה ותשובה | 4.5MB, מגבלה קשיחה בכל התוכניות | העלאות עוברות ישירות ל-Supabase Storage בכתובות חתומות או ב-TUS (חלק 04 §20.2); מדיה לא חוזרת לדפדפן כ-base64 (חלק 05 §1.3); ה-PDF של חשבונית ידנית — עד 4MB (§9.5); webhooks — עד 1MB |
| Vercel Workflows | GA מ-2026-04-16; ‏$0.02 לכל 1,000 אירועי Workflow, ‏$0.50 ל-GB שנכתב, ‏$0.50 ל-GB לחודש שנשמר | עלות תשתית שמופיעה בלוח העלויות באדמין, ולא נכנסת ל-COGS לקרדיט |
| Vercel Sandbox | ‏1 vCPU או מספר זוגי בין 2 ל-32 (לפי התוכנית), ‏2GB לכל vCPU; תקרות 45 דקות / 5 שעות | רינדור Remotion עם 4 vCPU ו-20 דקות (`REMOTION_SANDBOX_VCPUS`, ‏`REMOTION_SANDBOX_TIMEOUT_MS`); אזור הריצה [M0-verify ספייק 18] — ייתכן שבארצות הברית. ל-Sandbox עוברים ה-`PromoProps` (כתובות חתומות ל-6 שעות לקטעים, לקריינות, ללוגו ולהעלאות, ופרטי העסק שבכרטיס הסיום), ולכן מיקום הנתונים מתועד כך במדיניות הפרטיות (חלק 02 §10.3, סעיף 6), ב-L-09 (§11.1) ובחלק 05 §19.2 |
| Supabase | Pro ‏$25 לחודש; PITR הוא תוספת בתשלום; המפתחות הישנים (`anon`/`service_role`) יוצאים משימוש בסוף 2026 | רק `sb_publishable_…` ו-`sb_secret_…` (§20); PITR מופעל ב-M7 לפני לקוחות משלמים (§15.11) |
| רישיון Remotion | חינם לארגון של עד 3 עובדים. מעל זה — רישיון חברה: Creators ‏$25 למושב לחודש, Automators ‏$0.01 לרינדור עם מינימום $100 לחודש, Enterprise מ-$500 לחודש | בהשקה (עד 3 עובדים) אין תשלום. ביום שהחברה עוברת 3 עובדים — רוכשים רישיון Automators (רינדור אוטומטי בשרת הוא בדיוק המקרה הזה), מגדירים `REMOTION_LICENSE_KEY` [M0-verify איך המפתח מועבר ל-`@remotion/vercel`], ומוסיפים את העלות לעלויות הקבועות (נספח F §10.5). ההחלטה והתאריך נרשמים ב-`DECISIONS.md` |
| סליקה | Stripe לא תומך בעסקים שרשומים בישראל (נכון ליולי 2026); ל-Grow יש מרכז מפתחים רשמי עם חיוב לפי אסימון ומנויים מנוהלים | Grow מאחורי `PaymentProvider` (§8), עם חלופות Cardcom / Sumit / PayPlus |

### קריטריוני קבלה
- [ ] פרויקט ה-Vercel בתוכנית Pro, ואף `app/api/**/route.ts` לא מגדיר `maxDuration` מעל 300; החריג היחיד הוא נתיבי הצעדים של WDK (`.well-known/workflow/*`), שמוגדרים ב-`vercel.json → functions` (בדיקת יחידה `tests/unit/route-config.test.ts` שסורקת רק את `app/api/**/route.ts`).
- [ ] אין נתיב API שמקבל או מחזיר גוף מעל 4MB (בדיקת חוזה עם קובץ של 5MB ← 413 או העלאה ישירה ל-Storage).
- [ ] push ל-`main` לא פורס לפרודקשן בלי אישור ידני, והמיגרציות של פרודקשן רצות רק מתוך `release.yml`.
- [ ] preview לא שולח מייל לכתובת מחוץ ל-`EMAIL_ALLOWLIST` (בדיקה עם כתובת דמה).
- [ ] `smoke-staging` כולל רכישת חבילה מול Grow sandbox וחשבונית מ-Morning sandbox.
- [ ] ב-staging, `staging-crons.yml` מריץ את ה-crons, ו-notify של Grow sandbox ו-webhook של OpenRouter מגיעים דרך פרמטר ה-bypass; בפרודקשן אף כתובת callback לא מכילה `x-vercel-protection-bypass`.
- [ ] תרגיל rollback אחד בוצע ב-staging ותועד.

---

## §20. משתני סביבה

זו הרשימה הקנונית והמלאה של משתני הסביבה (בסיס: נספח F §9). `lib/env.ts` מאמת ב-Zod בעלייה (שרת ולקוח בנפרד) את כל משתני זמן הריצה, ו-`scripts/check-env.ts` מוודא ש-`.env.example` מכיל כל משתנה (עם הערות באנגלית). משתנים של CI בלבד ושל Supabase CLI בלבד מופיעים ב-`.env.example` כהערות, אבל לא ב-`lib/env.ts`. ★ = נוסף ביחס לנספח F. "L / P / S / Prod" = local · preview · staging · production.

| משתנה | צד | L | P | S | Prod | תיאור |
|---|---|---|---|---|---|---|
| `APP_ENV` ★ | שרת + `NEXT_PUBLIC_APP_ENV` | ✓ | ✓ | ✓ | ✓ | `local` · `test` · `preview` · `staging` · `production` |
| `NEXT_PUBLIC_SITE_URL` | ציבורי | ✓ | ✓ | ✓ | ✓ | `https://{{DOMAIN}}`; ב-preview — כתובת Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | ציבורי | ✓ | ✓ | ✓ | ✓ | כתובת פרויקט Supabase (`eu-central-1`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ציבורי | ✓ | ✓ | ✓ | ✓ | `sb_publishable_…` |
| `SUPABASE_SECRET_KEY` | שרת | ✓ | ✓ | ✓ | ✓ | `sb_secret_…` — לעולם לא בדפדפן |
| `SUPABASE_PROJECT_REF`, `SUPABASE_DB_URL` | CI | — | — | — | — | מיגרציות, טיפוסים, בדיקות מקביליות |
| `OPENROUTER_API_KEY` | שרת | ✓ | ✓ | ✓ | ✓ | מפתח אחד לכל סביבה, עם מגבלת אשראי |
| `OPENROUTER_BASE_URL` | שרת | ✓ | ✓ | ✓ | ✓ | ברירת מחדל `https://openrouter.ai/api/v1`; ב-e2e — שרת ה-mock |
| `OPENROUTER_APP_URL` / `OPENROUTER_APP_TITLE` | שרת | ✓ | ✓ | ✓ | ✓ | כותרות שיוך: `https://{{DOMAIN}}`, `{{BRAND_NAME_EN}}` |
| `OPENROUTER_WEBHOOK_SECRET` | שרת | ✓ | ✓ | ✓ | ✓ | סוד חתימת webhooks של וידאו |
| `OPENROUTER_CALLBACK_TOKEN_SECRET` | שרת | ✓ | ✓ | ✓ | ✓ | HMAC לטוקני `?t=` (וידאו ורינדור). **רשימה מופרדת בפסיק לרוטציה**: חותמים בראשון, מאמתים מול כולם (§15.5, R12) |
| `OPENROUTER_DAILY_BUDGET_USD` | שרת | ✓ | ✓ | ✓ | ✓ | גיבוי ל-`app_settings.openrouter_daily_budget_usd` |
| `ORCHESTRATOR` | שרת | ✓ | ✓ | ✓ | ✓ | `vercel-workflow` · `inline` (בדיקות בלבד). הערך `trigger` שמור ל-v2 ומתקבל רק בעמודה `jobs.orchestrator`, לא כאן |
| `RENDER_PROVIDER` | שרת | ✓ | ✓ | ✓ | ✓ | `vercel-sandbox` · `lambda` · `local` |
| `RENDER_SCALE` ★ | שרת (בדיקות) | ✓ | — | — | — | מכפיל רזולוציה לרינדור מקומי בבדיקות (ברירת מחדל 1) |
| `REMOTION_SANDBOX_VCPUS` / `REMOTION_SANDBOX_TIMEOUT_MS` | שרת | — | ✓ | ✓ | ✓ | 4 / 1,200,000 |
| `BLOB_READ_WRITE_TOKEN` | שרת | — | ✓ | ✓ | ✓ | רק אם `@remotion/vercel` כותב ל-Blob |
| `REMOTION_LICENSE_KEY` | שרת | — | — | אופציונלי | אופציונלי | נדרש רק כשהחברה עוברת 3 עובדים (רישיון Automators, §19.6) |
| `REMOTION_AWS_*`, `REMOTION_LAMBDA_FUNCTION_NAME`, `REMOTION_SERVE_URL` | שרת | — | — | — | אופציונלי | חלופת Lambda בלבד |
| `TRIGGER_SECRET_KEY` | שרת | — | — | — | אופציונלי | חלופת Trigger.dev (v2) |
| `PAYMENT_PROVIDER` | שרת | ✓ | ✓ | ✓ | ✓ | `grow` · `mock` (‏`mock` אסור בפרודקשן) |
| `GROW_API_BASE_URL`, `GROW_API_KEY`, `GROW_USER_ID`, `GROW_PAGE_CODE`, `GROW_WEBHOOK_SECRET` | שרת | — | — | ✓ | ✓ | Grow — sandbox ב-staging [M0-verify שמות]. `GROW_WEBHOOK_SECRET` הוא **רשימה מופרדת בפסיק לרוטציה** (§8.2, R12) |
| `GROW_PAGE_CODE_BIT` ★ | שרת | — | — | אופציונלי | אופציונלי | עמוד תשלום ל-Bit; בלעדיו Bit מוסתר |
| `INVOICE_PROVIDER` | שרת | ✓ | ✓ | ✓ | ✓ | `morning` · `mock` |
| `MORNING_API_BASE_URL`, `MORNING_API_KEY_ID`, `MORNING_API_KEY_SECRET` | שרת | — | — | ✓ | ✓ | Morning — sandbox ב-staging |
| `APP_ENCRYPTION_KEY` | שרת | ✓ | ✓ | ✓ | ✓ | 32 בתים ב-base64 (AES-256-GCM + HKDF) |
| `APP_ENCRYPTION_KEY_PREVIOUS` ★ | שרת | — | — | אופציונלי | אופציונלי | מפתחות קודמים (פענוח בלבד), מופרדים בפסיק |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO` | שרת | אופציונלי | ✓ | ✓ | ✓ | `{{BRAND_NAME}} <hello@{{DOMAIN}}>` |
| `RESEND_WEBHOOK_SECRET` ★ | שרת | — | ✓ | ✓ | ✓ | אימות Svix (חלק 04 §22.6) |
| `EMAIL_PROVIDER` ★ | שרת | ✓ | ✓ | ✓ | ✓ | `resend` · `smtp` · `log` (‏`smtp`/`log` אסורים בפרודקשן) |
| `SMTP_URL` ★ | שרת | ✓ | — | — | — | Mailpit/Inbucket מקומי |
| `EMAIL_ALLOWLIST` ★ | שרת | — | ✓ | ✓ | — | נמענים מותרים מחוץ לפרודקשן |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | שרת | ✓ | ✓ | ✓ | ✓ | הגבלות קצב, נעילות, מונה תקציב (אזור EU) |
| `CRON_SECRET` | שרת | ✓ | ✓ | ✓ | ✓ | Bearer של Vercel Cron (ב-staging: של `staging-crons.yml`, שמחזיק את אותו ערך בסוד `CRON_SECRET_STAGING`) |
| `VERCEL_AUTOMATION_BYPASS_SECRET` ★ | שרת (משתנה מערכת של Vercel) | — | ✓ | ✓ | **מתעלמים** | Protection Bypass for Automation: נוסף כ-`x-vercel-protection-bypass` לכתובות callback ו-webhook ב-preview וב-staging (§19.1); `lib/env.ts` מתעלם ממנו כש-`APP_ENV=production` |
| `REVALIDATE_SECRET` | שרת | ✓ | ✓ | ✓ | ✓ | revalidate מהאדמין |
| `TRIAL_HASH_PEPPER` | שרת | ✓ | ✓ | ✓ | ✓ | זהה לסוד ה-Vault `trial_hash_pepper` |
| `ADMIN_EMAILS` | שרת | ✓ | ✓ | ✓ | ✓ | מנהלי פלטפורמה בכניסה ראשונה + נמעני התראות |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | מעורב | — | ✓ | ✓ | ✓ | שגיאות ומפות מקור (EU) |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | ציבורי | — | ✓ | ✓ | ✓ | `https://eu.i.posthog.com` |
| `SMS_PROVIDER`, `SMS_API_KEY`, `SEND_SMS_HOOK_SECRET` | שרת | — | — | דגל | דגל | קוד כניסה בטלפון (`phone_otp`) |
| `WHATSAPP_PROVIDER`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_APP_SECRET` ★ | שרת | — | — | דגל | דגל | התראות וואטסאפ (`whatsapp_notify`) |
| `FEATURE_*` | שרת | ✓ | ✓ | — | **מתעלמים** | עקיפה מקומית של `feature_flags` (מתעלמים כש-`APP_ENV=production`, §21.2) |
| `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_GIT_COMMIT_SHA` | מסופק על ידי Vercel (קריאה בלבד) | — | ✓ | ✓ | ✓ | `VERCEL_GIT_COMMIT_SHA` ← `release` ב-Sentry, ב-PostHog וב-`/api/health` |
| `SUPABASE_AUTH_GOOGLE_CLIENT_ID`, `SUPABASE_AUTH_GOOGLE_SECRET` | Supabase CLI מקומי בלבד (`env()` ב-`supabase/config.toml`, חלק 04 §1.4) | ✓ | — | — | — | Google OAuth בפיתוח מקומי; בפרויקטים המנוהלים הוא מוגדר ב-Dashboard |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF_STAGING`, `SUPABASE_PROJECT_REF_PRODUCTION`, `SUPABASE_DB_URL_STAGING`, `SUPABASE_DB_URL_PRODUCTION`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `CRON_SECRET_STAGING` | סודות GitHub (CI בלבד) | — | — | — | — | מיגרציות, פריסה, בדיקות על preview ו-crons של staging (§19.3) |
| `BACKUP_DB_URL` ★ | סוד GitHub (CI בלבד) | — | — | — | — | מחרוזת חיבור Postgres של פרויקט הפרודקשן עם התפקיד לקריאה בלבד `backup_reader` (חלק 04 §15b), ל-`pg_dump -Fc` ב-`backup.yml`; לא נכנס ל-`lib/env.ts` ולא ל-Vercel. אם `BYPASSRLS` לא ניתן ל-`backup_reader` [M0-verify], ‏`backup.yml` משתמש ב-`SUPABASE_DB_URL_PRODUCTION` במקומו (§15.11) |
| `BACKUP_S3_BUCKET`, `BACKUP_AWS_ACCESS_KEY_ID`, `BACKUP_AWS_SECRET_ACCESS_KEY`, `BACKUP_AWS_REGION`, `BACKUP_AGE_RECIPIENT` | סודות GitHub (CI בלבד) | — | — | — | — | גיבויים ל-S3 ב-`eu-central-1` והצפנה ב-`age` (§15.11) |

```ts
// lib/env.ts (server part, excerpt)
const Server = z.object({
  APP_ENV: z.enum(["local", "test", "preview", "staging", "production"]),
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_"),
  OPENROUTER_API_KEY: z.string().min(20),
  APP_ENCRYPTION_KEY: z.string().refine((v) => Buffer.from(v, "base64").length === 32, "must be 32 bytes base64"),
  PAYMENT_PROVIDER: z.enum(["grow", "mock"]),
  INVOICE_PROVIDER: z.enum(["morning", "mock"]),
  EMAIL_PROVIDER: z.enum(["resend", "smtp", "log"]).default("resend"),
  ORCHESTRATOR: z.enum(["vercel-workflow", "inline"]),
  RENDER_PROVIDER: z.enum(["vercel-sandbox", "lambda", "local"]),
  VERCEL_AUTOMATION_BYPASS_SECRET: z.string().optional(),   // read only via callbackBypassParam(), which returns "" when APP_ENV=production (§19.1)
  // …
}).superRefine((e, ctx) => {
  if (e.APP_ENV !== "production") return;
  const bad: Array<[boolean, string]> = [
    [e.PAYMENT_PROVIDER === "mock", "PAYMENT_PROVIDER=mock in production"],
    [e.INVOICE_PROVIDER === "mock", "INVOICE_PROVIDER=mock in production"],
    [e.EMAIL_PROVIDER !== "resend", "EMAIL_PROVIDER must be resend in production"],
    [e.ORCHESTRATOR !== "vercel-workflow", "ORCHESTRATOR must be vercel-workflow in production"],
    [e.RENDER_PROVIDER === "local", "RENDER_PROVIDER=local in production"],
  ];
  for (const [cond, msg] of bad) if (cond) ctx.addIssue({ code: "custom", message: msg });
});
```

Google OAuth ו-SMTP של Supabase בפרויקטים המנוהלים מוגדרים ב-Dashboard של Supabase, לא ב-env של האפליקציה (חלק 04 §1.2).

### 20.1 משתני תוכן שהבעלים ממלא (`{{…}}`)

אלה אינם משתני סביבה: הם קבועים ב-`lib/constants.ts` (`BRAND.*`), שהבעלים ממלא לפני ההשקה. `scripts/check-content.ts --launch` (חלק 02) מכשיל את פריסת הפרודקשן אם נשאר אחד מהם בלי ערך (חוץ מ-`{{DPO_NAME}}` ו-`{{VERCEL_TEAM_SLUG}}`, ראו למטה).

| משתנה | שימוש |
|---|---|
| `{{BRAND_NAME}}`, `{{BRAND_NAME_EN}}`, `{{DOMAIN}}` | שם המותג בעברית ובאנגלית, הדומיין |
| `{{LEGAL_ENTITY_NAME}}`, `{{COMPANY_ID}}`, `{{LEGAL_ADDRESS}}` | פרטי העסק בחשבוניות, במיילים ובדפים המשפטיים |
| `{{LEGAL_EFFECTIVE_DATE}}`, `{{JURISDICTION_CITY}}` | תנאי השימוש |
| `{{DPO_NAME}}` | מדיניות הפרטיות (§11.3). ריק מותר: אז המשפט על בעל התפקיד מוסתר, ו-`check-content --launch` לא נכשל עליו |
| `{{A11Y_COORDINATOR_NAME}}`, `{{A11Y_COORDINATOR_TITLE}}`, `{{A11Y_COORDINATOR_PHONE}}`, `{{A11Y_COORDINATOR_EMAIL}}`, `{{A11Y_STATEMENT_DATE}}`, `{{A11Y_AUDIT_DATE}}`, `{{A11Y_AUDITOR}}` | הצהרת הנגישות (L-02) |
| `{{WHATSAPP_NUMBER}}`, `{{SUPPORT_PHONE}}` | יצירת קשר, ביטול בטלפון (§10.2) |
| `{{VERCEL_TEAM_SLUG}}` | רק ברשימת כתובות ההפניה המותרות של Supabase Auth (חלק 04 §1.2); לא נקרא בזמן ריצה ולא נמצא ב-`BRAND` |

### קריטריוני קבלה
- [ ] `pnpm check-env --example` נכשל כשמוסיפים משתנה ל-`lib/env.ts` בלי להוסיף אותו ל-`.env.example`.
- [ ] עלייה עם `APP_ENV=production` ו-`EMAIL_PROVIDER=log` נכשלת עם הודעה ברורה.
- [ ] אין משתנה עם `NEXT_PUBLIC_` שמכיל סוד (בדיקה על רשימת השמות).
- [ ] `check-content --launch` נכשל כשנשאר ב-`lib/constants.ts` או בדפים המשפטיים משתנה מ-20.1 בלי ערך, חוץ מ-`{{DPO_NAME}}` (ריק מותר; המשפט שמזכיר אותו מוסתר) ו-`{{VERCEL_TEAM_SLUG}}` (לא נמצא בקוד).
- [ ] עלייה עם `OPENROUTER_CALLBACK_TOKEN_SECRET="new,old"` חותמת ב-`new` ומאמתת גם `?t=` שנחתם ב-`old`.

---

## §21. דגלי פיצ׳רים והגדרות מערכת

### 21.1 הדגלים (`feature_flags`)

הרשימה הקנונית (13 דגלים); ערכי ה-seed (`feature_flags.json`, חלק 04 §16.4, מצב `insert_missing`) זהים בכל הסביבות. הבדל בין סביבות נעשה רק במשתני `FEATURE_*` (§21.2), שלא פועלים בפרודקשן — לעולם לא בקובצי seed שונים. דגלי PostHog לניסויים (`hero_copy_v1`) אינם דגלים כאן.

| מפתח | ערך ב-seed | `plans` | תיאור (מוצג באדמין) |
|---|---|---|---|
| `phone_otp` | כבוי | — | "כניסה עם קוד SMS לטלפון" |
| `avatar` | כבוי | `business`, `agency` | "סרטונים עם אווטאר מדבר (דורש זרימת הסכמה)" |
| `voice_clone` | כבוי | `business`, `agency` | "שיבוט קול (דורש זרימת הסכמה והערכה משפטית)" |
| `stock_broll` | כבוי | — | "וידאו מספריית סטוק" |
| `chat_edit` | כבוי (מקומית: `FEATURE_CHAT_EDIT=1`) | — | "עריכת סרטון במילים" |
| `music_generate` | פעיל | — (ההרשאה ב-`plans.limits.music_generate`; הדגל הוא מתג חירום) | "מוזיקה מקורית לכל סרטון" |
| `premium_video` | פעיל | — (ההרשאה ב-`plans.limits.quality_tiers`; הדגל הוא מתג חירום) | "איכות וידאו פרימיום" |
| `whatsapp_notify` | כבוי | — | "התראות שירות בוואטסאפ" |
| `annual_billing` | פעיל | — | "מנוי שנתי בעמוד המחירים ובקופה" |
| `hook_submissions` | כבוי | — | "הצעת הוקים מהקהל" |
| `format_4x5` | כבוי | — | "פורמט 4:5" |
| `maintenance_mode` | כבוי | — | "עקיפה מקומית בלבד — מקור האמת הוא `app_settings.maintenance_mode`" (חלק 04 §16.4) |
| `billing_checkout` ★ | פעיל | — | "קופה פתוחה לרכישות חדשות. כיבוי עוצר רכישות חדשות בלי לגעת במנויים קיימים" (כבוי ← ‏503 `MAINTENANCE {scope:"checkout"}`) |

### 21.2 `lib/flags.ts`

```ts
export async function isEnabled(key: FlagKey, ctx: { workspaceId?: string | null; planId?: PlanId | null } = {}): Promise<boolean> {
  if (env.APP_ENV !== "production") {
    const o = process.env[`FEATURE_${key.toUpperCase()}`];
    if (o === "1" || o === "0") return o === "1";                    // local/dev override only
  }
  const f = await getFlag(key);                                      // in-memory cache 30 s; revalidateTag("flags", "max") on admin update
  if (!f) return false;
  if (ctx.workspaceId && f.workspace_ids?.includes(ctx.workspaceId)) return true;   // explicit allow-list wins
  if (!f.enabled) return false;
  if (f.plans?.length && (!ctx.planId || !f.plans.includes(ctx.planId))) return false;
  return true;
}
```

הממשק מקבל את הדגלים הרלוונטיים מהשרת (props/context) — אין קריאה ישירה לטבלה מהדפדפן, ופיצ׳ר כבוי נאכף גם בנתיב ה-API. חריג אחד: `isEnabled("maintenance_mode")` מחזיר `true` אם `app_settings.maintenance_mode.enabled` דולק **או** הדגל המקומי דולק (חלק 04 §16.4).

### 21.3 מתגי חירום והגדרות מערכת

| מתג | איפה | מה עושה |
|---|---|---|
| מצב תחזוקה | `app_settings.maintenance_mode` (`{ enabled, until, message_he }`) | עוצר יצירות חדשות ורכישות (`MAINTENANCE`), יצירות שרצות ממשיכות, באנר |
| עצירת AI | מפתח Upstash `or:halt` (חלק 05 §2.3, §7.3) | כל קריאה חדשה ל-OpenRouter ← `PROVIDER_UNAVAILABLE`; נקבע מהאדמין או ידנית |
| חידושים | `app_settings.renewals_paused` | עוצר חיובי חידוש בלי לשנות סטטוס (§4.2, R3) |
| מצב בחירות | `app_settings.election_mode` | §11.11 |
| באנר יום שקט | `app_settings.quiet_day_banner` | §11.11 |
| קופה | `feature_flags.billing_checkout` | §21.1 |

מפתחות `app_settings` שהחלק הזה הוא הבעלים שלהם. הרשימה המלאה (21 מפתחות), ערכי ה-seed וסכמות ה-Zod (`lib/settings/schema.ts`) — בחלק 04 §16.4; עורך ההגדרות באדמין (חלק 03 §22.17) מציג את כולם.

| מפתח | ערך ב-seed (חלק 04 §16.4) | שימוש |
|---|---|---|
| `vat_rate` | `0.18` | §1.3 |
| `vat_rate_next` | `null` | שינוי מע״מ עתידי (§1.3, R10) |
| `rollover_cap_multiplier` | `1` | תקרת הגלגול (§2.4) |
| `free_trial_credits` | `70` | §2.5 |
| `allocation_threshold_schedule` | `[{"from":"2026-01-01","ils":10000},{"from":"2026-06-01","ils":5000}]` | §9.4 |
| `dunning_retry_days` | `[1, 3, 7]` | §6.1 |
| `non_business_days` | תאריכי החגים בישראל ל-12 החודשים הבאים (ISO) | §10.2, R11 |
| `renewals_paused` | `false` | עצירת חיובי חידוש בזמן תקלה אצל הספק (R3) |
| `maintenance_mode` | `{"enabled": false, "until": null, "message_he": null}` | מצב תחזוקה (מקור האמת; `message_he` גובר על באנר ברירת המחדל, §22) |
| `election_mode` | `{"enabled": true, "until": "2026-10-28T23:59:00+02:00"}` | §11.11 |

### קריטריוני קבלה
- [ ] `FEATURE_AVATAR=1` לא מפעיל את הדגל כש-`APP_ENV=production`.
- [ ] כיבוי `billing_checkout` מחזיר מ-`/api/billing/checkout` את ‏503 `MAINTENANCE {until: null, scope: "checkout"}`, וחידושים ממשיכים לרוץ.
- [ ] `feature_flags` אחרי `db:seed` מכיל בדיוק את 13 המפתחות של 21.1, עם אותם ערכים בכל הסביבות.
- [ ] שינוי דגל באדמין נרשם ב-`audit_logs` (`flag.update`) ומשפיע תוך 30 שניות.

---

## §22. Runbooks

כל runbook נשמר גם כקובץ ב-`docs/runbooks/R{n}-{slug}.md`, ואחרי כל אירוע נכתב סיכום ב-`docs/incidents/{yyyy-mm-dd}-{slug}.md` (מה קרה, ציר זמן, השפעה, סיבת שורש, מה משנים). **כלל לכל האירועים:** קודם עוצרים נזק כספי וחשיפת מידע, אחר כך משחזרים שירות, ואחר כך מתקנים. כל פעולת אדמין בזמן אירוע נרשמת ב-`audit_logs` עם `metadata.incident_id` (`incident_id` = שם קובץ הסיכום, למשל `2026-11-02-openrouter-outage`).

**מחרוזות באנר מוכנות** (`app_settings.maintenance_mode.message_he` / `PolicyBanner`, `messages/he.json` → `ops.banners.*`):

| מפתח | נוסח |
|---|---|
| `aiOutage` | יש כרגע תקלה אצל אחד מספקי ה-AI שלנו, ולכן יצירות חדשות מושהות. שום דבר לא אבד: יצירה שלא תושלם תחזיר את הקרדיטים אוטומטית. נעדכן כאן כשהכול יחזור לעבוד. |
| `aiSlow` | יש עומס אצל אחד מספקי הווידאו, ולכן יצירות לוקחות יותר זמן מהרגיל. אפשר לסגור את הדף — נשלח מייל כשהסרטון מוכן. |
| `paymentsDelayed` | יש עיכוב באישור תשלומים מחברת הסליקה. אם כבר שילמתם, לא צריך לשלם שוב — הקרדיטים יתווספו אוטומטית ברגע שהאישור יגיע. |
| `checkoutPaused` | רכישות חדשות מושהות לזמן קצר. מנויים קיימים והקרדיטים שביתרה עובדים כרגיל. |
| `emailDelayed` | יש עיכוב בשליחת מיילים. אפשר להיכנס עם Google, או לנסות לשלוח קישור שוב בעוד כמה דקות. |
| `maintenance` | המערכת בתחזוקה קצרה, עד {until}. העבודה שלכם שמורה. (בלי `until`: "המערכת בתחזוקה קצרה. העבודה שלכם שמורה.") |

### R1 — תקלה או האטה ב-OpenRouter

| שלב | פעולה |
|---|---|
| זיהוי | התראות "שגיאות OpenRouter" ו"אחוז הצלחה נמוך"; עמוד הסטטוס של OpenRouter; קפיצה ב-429/5xx ב-`ai_generations` |
| אבחון | האם התקלה במודל או ספק אחד (מסננים לפי `model_served`) או ב-OpenRouter כולו? |
| מודל/ספק אחד | `/admin/models` ← החלפת ה-primary בנתיב לגיבוי הבא (נרשם `model.route_update`) ← "בדיקה" לנתיב (חלק 05 §6.4) ← באנר `aiSlow` אם יש האטה |
| OpenRouter כולו | `or:halt` (עוצר התחלות חדשות לפני שמירת קרדיטים) ← באנר `aiOutage`. עבודות שרצות: ניסיונות חוזרים של Workflows; קליפים ממתינים ממשיכים ב-polling; עבודה שעוברת 120 דקות מ-`started_at` נכשלת ומחזירה קרדיטים אוטומטית |
| התאוששות | הסרת `or:halt` והבאנר; ברשימת העבודות שנכשלו בחלון התקלה — **"ניסיון חוזר"** מהאדמין (`job.retry`, משתמש בנכסים שהצליחו) או מייל ללקוחות; קרדיטים שפגו בחלון התקלה — שחזור כדלי `rollover` עם `scripts/restore-expired-credits.ts` (§2.4) |
| אחרי | סיכום אירוע; בדיקה אם צריך לשנות סדר גיבויים או timeouts |

### R2 — מודל יצא משימוש (למשל Sora, שהוסר מ-OpenRouter ב-2026-09-24)

| שלב | פעולה |
|---|---|
| זיהוי | `sync-models` מסמן `deprecated_at` או מודל שנעלם מנתיב פעיל ← התראת P1; שגיאות "model not found" |
| מיידי | `/admin/models`: הגיבוי הבא הופך ל-primary; המודל הישן מושבת; "בדיקה" לנתיב; וידוא יכולות (משכים, יחסי מסך, `frame_images`, רזולוציה) מול `capabilities` |
| כסף | השוואת עלות המחליף ל-`credit_costs`; אם הוא יקר יותר — עדכון `credit_costs` (חל רק על הערכות חדשות) או בחירה במודל זול יותר; מעקב אחרי התראת שחיקת רווח |
| עבודות באמצע | צעד שנכשל עובר אוטומטית לגיבוי (חלק 05); אין פעולה ידנית |
| אחרי | עדכון `model_routes` ב-seed, רשומה ב-`DECISIONS.md`; אם השתנה מודל טקסט — בדיקה עיוורת קצרה (5 בריפים) לפני שהשינוי קבוע |

### R3 — כשלים ב-webhooks של תשלום / Grow לא זמין

| שלב | פעולה |
|---|---|
| זיהוי | התראות webhooks וקופה; לקוחות "שילמתי ולא קיבלתי"; `checkout_sessions` תקועים ב-`created`; `reconcilePendingCheckouts` מוצא תשלומים |
| אבחון | `webhook_events` של `payment`: `signature_valid=false` ← סוד או כתובת notify השתנו (בדרך כלל אחרי רוטציה); `failed` ← באג אצלנו (Sentry); אין שורות בכלל ← Grow לא שולח |
| מיידי | "התאמת תשלומים עכשיו" באדמין (`POST /api/admin/ops/cron {name:"billing-renewals"}`, ‏audit `ops.cron_run`; מתחיל ב-`reconcilePendingCheckouts`), שמשלים לפי שאילתות סטטוס בלי תלות ב-webhook; באנר `paymentsDelayed` בעמוד החיוב |
| Grow לא זמין | `billing_checkout` כבוי + באנר `checkoutPaused`. חידושים: `provider_error` לא נספר כניסיון (§6.1); אם התקלה מעל 6 שעות — `app_settings.renewals_paused = true` (ה-cron מדלג על חיובים בלי לשנות סטטוס; תקופת החסד מתארכת, §4.2) |
| חיוב כפול | איתור לפי `payments` עם אותו סשן או אותה תקופה ← החזר מלא של הכפילות (`technical`, בלי דמי ביטול) + חשבונית זיכוי + מייל אישי |
| התאוששות | הדלקת `billing_checkout`, `renewals_paused = false`, הרצת ה-cron, וידוא שאין סשן תקוע |

### R4 — עבודות תקועות

| מקרה | פעולה ב-`/admin/jobs/[id]` |
|---|---|
| קליפ ב-`waiting_external` הרבה זמן | **"בדיקת סטטוס עכשיו"** (polling לפי `provider_job_id`) ← אם הושלם: `resume`; אם הספק איבד את העבודה: סימון הצעד כנכשל ← גיבוי או סצנה מתמונה |
| ריצת Workflow מתה | ה-sweeper מפעיל מחדש פעם אחת; אחר כך **"ניסיון חוזר"** יוצר עבודה חדשה שמשתמשת בנכסים שהצליחו |
| רינדור תקוע ב-Sandbox | ביטול ה-run ← רינדור מחדש של הפורמט (`render.extra_format` לא מחויב שוב: הקרדיטים של הצעד נשמרו בשמירה) |
| שגיאת מסד/פונקציה | Sentry לפי `job_id`; תיקון ← ניסיון חוזר |
| החזר | עבודה שנכשלה מחזירה אוטומטית; **"החזר מלא בכפייה"** (`job.force_refund`) כשצריך |

### R5 — Morning לא זמין / חשבוניות לא מופקות

תשלומים ממשיכים; `invoicePayment` מנסה שוב (§9.5); אחרי 30 דקות הלקוח מקבל `payment_receipt` בוריאנט `invoicePending`. מעל 24 שעות — הפקה ידנית בממשק של Morning ושיוך באדמין (**"צירוף חשבונית שהופקה ידנית"**: `POST /api/admin/billing/payments/[id]/invoice` עם מספר המסמך וה-PDF ← שורת `invoices` עם `provider = 'manual'` + `invoice_ready`; ‏audit `invoice.attach`). החשבונית חייבת לצאת סמוך לתשלום — כל עיכוב מעל יום עסקים מתועד ⚖️ רו״ח.

### R6 — מגן התקציב הופעל / קפיצה בעלויות

1. `/admin/costs`: 5 הסביבות ו-5 העבודות היקרות היום, לפי מודל.
2. ניצול לרעה ← חסימת המשתמש, הורדת `daily_credit_cap` בעקיפה לסביבה (`workspaces.plan_override`), דיווח.
3. באג (לולאה, ניסיונות חוזרים בלי סוף) ← `or:halt`, תיקון, הסרה.
4. צמיחה אמיתית ← העלאת `openrouter_daily_budget_usd` ומגבלת המפתח ב-OpenRouter, טעינת יתרה.
5. אחרי: השוואת COGS בפועל ל-`credit_costs`; עדכון אם הרווח ירד מתחת ל-65%.

### R7 — אירוע אבטחת מידע ⚖️

| שלב | פעולה |
|---|---|
| סיווג | חמור = חשיפה או חשד לחשיפה של מידע אישי, אסימוני תשלום, תוכן לקוחות או גישת אדמין. פתיחת האירוע נרשמת ב-`audit_logs` כפעולה `security.incident` עם `metadata.incident_id` |
| בלימה (שעה ראשונה) | רוטציה של המפתח שנחשף (R12) · `auth.admin.signOut(…, "global")` למשתמשים שנפגעו · השבתת חשבונות שנפרצו · `maintenance_mode` אם צריך · שמירת ראיות (ייצוא לוגים, `audit_logs`, צילום מסד) לפני שינויים |
| הערכה | איזה מידע, כמה נושאי מידע, מאיזו תקופה, האם מוצפן |
| דיווח | ברשות להגנת הפרטיות — באירוע חמור, ללא דיחוי ולפי התקנות (2017) ותיקון 13 ⚖️; לספקים רלוונטיים (Grow אם אסימונים בסיכון); לנפגעים — כשנדרש |
| הודעה לנפגעים | נושא: **"הודעה על אירוע אבטחת מידע ב{{BRAND_NAME}}"** · גוף: **"שלום {firstName}, ב-{date} זיהינו {whatHappened}. המידע שעלול היה להיחשף: {dataTypes}. מה עשינו: {actions}. מה כדאי לעשות: {userActions}. אנחנו מצטערים על כך, וממשיכים לבדוק. לשאלות: privacy@{{DOMAIN}}."** (תבנית `security_notice` ★, נשלחת ידנית אחרי אישור עורך דין) |
| אחרי | סיכום אירוע, עדכון סקר הסיכונים ונוהל האבטחה |

### R8 — מיילים לא נשלחים / קפיצה בחזרות

- **קישורי כניסה לא נשלחים = P0:** באנר `emailDelayed` ב-`/login` (Google לא מושפע); בדיקת עמוד הסטטוס של Resend ומגבלות ה-SMTP של Supabase; אם Resend לא זמין מעל 30 דקות — מעבר של ה-SMTP של Supabase לספק גיבוי שהוגדר מראש (החלטה ב-M7, למשל Amazon SES ב-`eu-central-1`; הפרטים במנהל הסיסמאות). ספק כזה הוא ספק משנה, ולכן הוא נכנס לרשימה ב-`docs/legal/subprocessors.md` ובמדיניות הפרטיות כבר כשהוא מוגדר, לא ביום התקלה.
- **קפיצה בחזרות או בתלונות:** בדיקת SPF/DKIM/DMARC, רשימת החסימות, ותוכן שנשלח לאחרונה; עצירת דיוור עד לבירור.

### R9 — Supabase לא זמין / שחזור נתונים

- **השבתה:** עמוד הסטטוס של Supabase; באנר `maintenance` אם השירות חלקי; Workflows מנסים שוב; אין פעולה אחרת.
- **השחתת נתונים:** (1) `maintenance_mode` (עוצר כתיבות של משתמשים); (2) קביעת רגע היעד; (3) עדיפות: שחזור לפרויקט חדש מ-PITR והעתקת הטבלאות שנפגעו בלבד; שחזור במקום רק אם הנזק רחב (מאבד כתיבות אחרי רגע היעד — תשלומים שנכנסו בינתיים משוחזרים מ-Grow דרך `reconcilePendingCheckouts` ומחשבוניות Morning); (4) `pnpm db:test` + `credit_invariant_violations()` על התוצאה; (5) הסרת התחזוקה; (6) הודעה ללקוחות שנפגעו.

### R10 — שינוי שיעור המע״מ

1. כשהשינוי פורסם: `vat_rate_next = { rate, effective_from }`.
2. `scripts/vat-change.ts --rate=… --from=… --dry-run` ← דוח מחירים חדשים (נטו קבוע, כולל מע״מ מעוגל לשקל) לתוכניות, לחבילות ולמנויים פעילים ← אישור רו״ח ועורך דין.
3. `price_change_notice` למנויים, לפחות 7 ימים לפני החיוב הראשון במחיר החדש.
4. ביום התחולה ב-00:00 שעון ישראל: `--apply` (מעדכן `plans`, `credit_packs` ו-`subscriptions.price_ils`), revalidate ל-`/pricing`, בדיקה שהמחירים בעמוד, בקופה ובחשבוניות תואמים; בדיקה שאין בתוכן אזכור קשיח של "18%" (`pnpm lint:copy`).

### R11 — סוף מצב בחירות, ימי שקט ועונות

- `election_mode` כבה לבד ב-`until`; לוודא בבוקר שאחרי (2026-10-29) שהבאנר ירד, שהנישה הפוליטית עדיין לא פעילה, ולסקור את יומני המודרציה של התקופה.
- פעם בשנה (אוגוסט): עדכון תאריכי העונות וימי השקט מ-Hebcal ב-`/admin/seasons`, ושל `non_business_days`.

### R12 — רוטציית סודות

| סוד | איך | השפעה בזמן הרוטציה |
|---|---|---|
| `SUPABASE_SECRET_KEY` | מפתח חדש לכל צרכן ב-Supabase ← Vercel ← פריסה ← ביטול הישן | אין (מפתחות נפרדים לכל צרכן) |
| `OPENROUTER_API_KEY` | מפתח חדש עם אותה מגבלה ← פריסה ← ביטול הישן | אין |
| `OPENROUTER_CALLBACK_TOKEN_SECRET`, `GROW_WEBHOOK_SECRET` | ערך חדש **בתחילת רשימה מופרדת בפסיק** ("חדש,ישן") — חותמים בראשון, מאמתים מול כולם; אחרי 48 שעות מסירים את הישן | אין |
| `OPENROUTER_WEBHOOK_SECRET` | עדכון בהגדרות OpenRouter ובפריסה באותו רגע | webhooks בודדים עלולים להיכשל; ה-sweeper משלים ב-polling |
| `APP_ENCRYPTION_KEY` | §15.5 (`APP_ENCRYPTION_KEY_PREVIOUS` + `rotate-encryption-key`) | אין |
| `CRON_SECRET` | עדכון ב-Vercel ופריסה (Vercel Cron שולח את הערך העדכני) | ריצה אחת עלולה להיכשל |
| מפתחות Grow / Morning / Resend / Upstash | חדש ← Vercel ← פריסה ← ביטול | אין |
| `TRIAL_HASH_PEPPER` | **לא מחליפים** (שבירת מניעת הכפילויות); רק בחשיפה — ואז גם בסוד ה-Vault | הרשמות כפולות אפשריות |

### R13 — Chargeback והונאה

§7.2: סימון באדמין (`POST /api/admin/billing/payments/[id]/chargeback`, ‏audit `payment.chargeback`) ← הסרת קרדיטים שנותרו מהתשלום ← סגירת המנוי ← בדיקה של שאר התשלומים מאותו כרטיס או סביבה ← חסימה אם יש דפוס ← תיעוד מול Grow עם הראיות (חשבונית, יומן שימוש, `consents` של הקופה).

### קריטריוני קבלה
- [ ] 13 ה-runbooks קיימים ב-`docs/runbooks/`, וכל התראה בטבלה של §16.4 מפנה ל-runbook או לסעיף טיפול מפורש.
- [ ] R1, R3 ו-R9 תורגלו ב-staging לפני ההשקה (כולל `or:halt`, `billing_checkout` כבוי, ושחזור), עם תיעוד.
- [ ] כל מחרוזות הבאנר קיימות ב-`messages/he.json` תחת `ops.banners`.

---

## §23. מוסכמות הריפו

### 23.1 שמות

| דבר | מוסכמה | דוגמה |
|---|---|---|
| קבצי רכיבים | kebab-case, ייצוא PascalCase | `components/billing/plan-change-dialog.tsx` ← `PlanChangeDialog` |
| hooks של React | `use-*.ts`; hooks כלליים ב-`lib/react-hooks/` (ה-alias של shadcn), hooks של תחום ליד המודול שלהם; אף פעם לא `@/hooks` | `lib/realtime/use-job-channel.ts` ← `useJobChannel` · `lib/ai/client/use-ndjson-object.ts` ← `useNdjsonObject` |
| מודולי שרת | `import "server-only"` בראש כל קובץ שנוגע בסודות | `lib/billing/engine.ts` |
| Route Handlers | `app/api/**/route.ts`, רק דרך `route()` | — |
| בדיקות | `tests/unit/**/*.test.ts`, `tests/contract/**`, `tests/e2e/**/*.spec.ts`, `supabase/tests/NN_*.sql` | `tests/unit/billing/refunds.test.ts` |
| מיגרציות | `NNNN_snake_name.sql`; עד ההשקה עמודות וטבלאות חדשות נכנסות לקובץ הנושאי הקיים (חלק 04 §2.1) | `0012_ops_roles.sql` |
| מסד | snake_case, טבלאות ברבים | `email_messages` |
| enum, אירועי אנליטיקה | snake_case | `subscription_renewed` |
| קודי שגיאה | UPPER_SNAKE | `PAYMENT_FAILED` |
| משתני סביבה | UPPER_SNAKE; ציבוריים עם `NEXT_PUBLIC_` | `GROW_PAGE_CODE_BIT` |
| מפתחות i18n | מרחבי השם: `common`, `marketing`, `hooks`, `wizard`, `editor`, `billing`, `errors`, `emails`, `legal`, `auth`, `app`, `admin`, `ops` (כולל `ops.banners`, `ops.whatsapp`); תת-מפתחות camelCase; משתני ICU ב-ASCII camelCase | `billing.disclosure.renewal` |
| פעולות ביומן הביקורת | dot.namespaced, רק מהרשימה הקנונית (חלק 04 §24.1) | `billing.plan_change` |
| מפתחות אידמפוטנטיות | `{action}:{ids}` (§1.5, נספח F §6.4) | `renew:{subId}:{periodEndISO}` |
| מפתחות Upstash | רק מהרשימה של חלק 04 §18.6 | `checkout:fail:{ws}` |

TypeScript: `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`; אין `any` (ESLint `no-explicit-any` כשגיאה); אין `default export` מלבד קבצי Next (`page`, `layout`, `opengraph-image` וכו׳), קובצי הגדרה (`*.config.ts`) ותבניות React Email (שרת התצוגה דורש אותו); `console.*` אסור (יש `log`); `no-restricted-imports` מונע ייבוא של `lib/**/server*` ו-`lib/billing/**` מרכיבי לקוח, חוץ מ-`lib/billing/credits.ts` (טהור, בלי סודות, §2.6).

### 23.2 קומיטים וענפים

- **Conventional Commits** באנגלית, בגוף ציווי: `type(scope): summary`. סוגים: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`. ה-scope הוא אבן הדרך (`m0`…`m7`) לעבודת אבן דרך, או התחום (`billing`, `pipeline`, `hooks`, `a11y`, `rtl`, `db`, `email`, `legal`) לתיקונים.
- דוגמאות: `feat(m0): bootstrap Next 16, RTL tokens and spikes` · `feat(m6): Grow checkout, renewals and Morning invoices` · `fix(billing): never re-charge after an ambiguous gateway timeout`.
- לפחות קומיט אחד לכל אבן דרך (`feat(mX): …`), וכל קומיט על `main` עובר `pnpm typecheck && pnpm lint && pnpm test`.
- גוף הקומיט מסביר **למה**; כשיש החלטה — `Refs: DECISIONS.md#2026-10-20-grow-webhook-verification`.

### 23.3 `DECISIONS.md`

```md
## 2026-10-20 · Grow webhook verification
- **ההחלטה:** מאמתים notify של Grow בטוקן `?k=` ובשאילתה חוזרת ל-getPaymentProcessInfo; גוף ה-notify לא נחשב מקור אמת.
- **חלופות שנשקלו:** חתימה בכותרת (לא קיימת ב-sandbox); IP allowlist (Grow לא מפרסם טווחים).
- **הסיבה:** תוצאת ספייק M0 (scripts/spikes/grow.ts, ריצה מ-2026-10-20).
- **השפעה:** `lib/billing/grow.ts`; כל webhook עולה קריאת API אחת נוספת.
- **[M0-verify] שנסגר:** נספח F §10.7, חלק 06 §8.2 שורה 2.
```

הפורמט קבוע (חלק 00): תאריך · נושא · ההחלטה · חלופות · הסיבה · השפעה. כל `[M0-verify]` במסמכים נסגר ברשומה כזו; `pnpm check-decisions` ★ מוודא שלכל תגית `[M0-verify]` ברשימה `docs/m0-verify.md` יש רשומה.

### 23.4 `CHANGELOG.md`

Keep a Changelog, באנגלית, לפי גרסה (`0.{milestone}.{patch}` עד ההשקה, `1.0.0` בהשקה הציבורית), עם הקטגוריות Added / Changed / Fixed / Security. רשומה לכל אבן דרך, ותגית Git תואמת.

### 23.5 תבנית PR (`.github/pull_request_template.md`)

```md
## What & why
## Screenshots (dark + light, desktop + 390px)
## Checklist
- [ ] typecheck · lint · lint:rtl · lint:copy · tests green
- [ ] Hebrew copy written in final form (no placeholder or dummy text), plural/neutral address, Appendix E
- [ ] RTL: logical classes only, bidi checked for numbers/₪/Latin
- [ ] a11y: keyboard path, focus, labels, axe clean
- [ ] Migrations backward-compatible (expand/contract); types regenerated
- [ ] New env vars in lib/env.ts + .env.example; new flags/settings seeded
- [ ] Analytics events typed in lib/analytics/events.ts (no PII)
- [ ] DECISIONS.md / CHANGELOG.md updated where relevant
- [ ] No secrets, tokens or real customer data in code, fixtures or logs
```

### 23.6 סקריפטים (`package.json`)

| סקריפט | פקודה / תפקיד |
|---|---|
| `dev` · `build` · `start` | Next |
| `typecheck` | `tsc --noEmit` |
| `lint` · `lint:rtl` · `lint:copy` ★ · `lint:billing` ★ | ESLint · מחלקות פיזיות (חלק 01 §9.3) · עברית (חלק 01 §2.6: `BANNED_PHRASES`, לוכסנים מגדריים, סימוני טקסט זמני וטקסט דמה, ₪ צמוד למשתנה, אזכור קשיח של שיעור מע״מ) · ליטרלים של מע״מ בקוד (`scripts/lint-billing.ts`) |
| `format` · `format:check` | Prettier |
| `test` · `test:watch` · `test:contract` · `test:e2e` · `test:a11y` · `test:visual` · `test:load` | §18 |
| `test:pipeline` ★ | חלק 05 §23.1 |
| `eval:prompts` ★ | `tsx scripts/eval-prompts.ts` (חלק 05) |
| `db:*` · `seed:sync` | חלק 04 §2.2, §16.1 (`seed:sync` מעתיק את קובצי `/seed` ל-`supabase/seed/data/` אחרי `build_seed.py --check`) |
| `models:sync` · `demo:render` (`--upload` מעלה ל-`public-media`) | חלק 05, נספח D |
| `upload-static-media` ★ | `tsx scripts/upload-static-media.ts` — SFX ותמונת הבדיקה ל-`public-media` (חלק 04 §13) |
| `generate-niche-seo` ★ | `tsx scripts/generate-niche-seo.ts --niche={slug}\|--all [--dry-run]` (חלק 02 §4.3) |
| `send-newsletter` ★ | `tsx scripts/send-newsletter.ts --issue={id} [--dry-run]` (§12.5) |
| `fixtures:record` ★ | §18.3 |
| `emails:dev` ★ | שרת התצוגה של React Email |
| `check-env` · `check-content` · `check-decisions` ★ | §20 · חלק 02 · 23.3 |
| `analyze` | `ANALYZE=1 next build` |

סקריפטים תפעוליים שרצים ישירות ב-`tsx` (לא ב-`package.json`): `scripts/vat-change.ts` (R10), `scripts/rotate-encryption-key.ts` (§15.5), `scripts/restore-expired-credits.ts` (§2.4), `scripts/record-fixtures.ts` (דרך `fixtures:record`), `scripts/spikes/*.ts` (M0).

### 23.7 מבנה `docs/`

`docs/analytics.md` · `docs/m0-verify.md` · `docs/runbooks/R1…R13` (וגם `restore-drill-{yyyy-mm}.md`) · `docs/incidents/` · `docs/security/{access,threat-model,pentest-yyyy}.md` · `docs/legal/{launch-checklist,database-definition,security-procedure,risk-assessment-yyyy,incident-response,subprocessors}.md` · `docs/qa/{hebrew-review,emails,load-*}.md` · `docs/eval/listening-list.md` ו-`docs/eval/hebrew-review-m7.md` (נספח E §13.4) · `docs/launch/definition-of-done.md` (§25) · ומחקרי הרקע שכבר בריפו (`docs/research/`; בכל קובץ ה-"Verification addendum" גובר על מה שלפניו). בשורש הריפו: `DECISIONS.md`, `CHANGELOG.md`, `README.md`.

### קריטריוני קבלה
- [ ] `commitlint` ב-CI דוחה כותרת PR שלא בפורמט.
- [ ] ESLint נכשל על `console.log`, על `any` ועל ייבוא של `lib/billing` מרכיב `"use client"` (חוץ מ-`lib/billing/credits.ts`).
- [ ] `pnpm check-decisions` ירוק ב-M0 (כל פריט מהרשימה נסגר).

---

## §24. אבני הדרך M0–M7

אבני הדרך מנספח F (§13), עם המשימות המלאות. אבן דרך מסתיימת רק כשכל קריטריון שלה מסומן, `pnpm typecheck && pnpm lint && pnpm test` ירוקים, ה-e2e והנגישות הרלוונטיים עוברים, `DECISIONS.md` ו-`CHANGELOG.md` עודכנו, ויש קומיט `feat(mX): …`.

### M0 — יסודות וניסויי אימות

**משימות:**
1. ריפו pnpm, Next 16 (≥ 16.1), React 19.2, TypeScript strict; Tailwind 4.3 עם הטוקנים של חלק 01; shadcn ‏`radix-nova` עם `rtl: true`; `DirectionProvider`; גופנים; next-intl עם `he`; `lib/constants.ts` (`BRAND`).
2. `lib/env.ts` + `.env.example` + `check-env`; ESLint, Prettier, `lint:rtl`, `lint:copy`, `lint:billing`; Vitest, Playwright, MSW; Sentry (EU, tunnel); שלד `ci.yml`.
3. Vercel Pro (`fra1`; Hobby אסור לשימוש מסחרי, §19.6) עם preview/staging/production והגנת Vercel Authentication + Protection Bypass for Automation; Supabase staging ו-production (`eu-central-1`, מפתחות חדשים); Upstash (EU); דומיין שולח ב-Resend; ריפו ב-GitHub עם branch protection.
4. `DECISIONS.md`, `CHANGELOG.md`, `README.md` (עברית קצרה), `docs/m0-verify.md` (כל תגיות `[M0-verify]` מכל החלקים).
5. **ספייקים** (`scripts/spikes/*.ts`, כל אחד עם רשומה ב-`DECISIONS.md`): (1) נעילת AI SDK והספק; (2) צ׳אט OpenRouter עם `json_schema` ו-`models[]`; (3) `/videos` ← פורמט חתימת ה-webhook המדויק ← הורדה מאומתת; (4) מבנה המילים של Scribe ‏`verbose_json` בעברית; (5) Eleven v4 בעברית עם רמזי ניקוד; (6) hooks ו-sleep של WDK; (7) `@remotion/vercel` עם fixture כתוביות בעברית; (8) `next/og` בעברית; (9) Grow (10 הנקודות של §8.2) ו-Morning (§9.6); ובנוסף ★: (10) Resend — `Idempotency-Key`, צרופות, תצוגה ב-Gmail/Outlook; (11) Supabase CLI — קידומות מיגרציה ו-API של Mailpit/Inbucket; (12) Vercel — `git.deploymentEnabled`, פריסה לסביבה מותאמת מה-CLI, Vercel Cron רק בפריסות פרודקשן, ו-POST של Grow, OpenRouter ו-Resend שעובר את Vercel Authentication עם פרמטר ה-bypass (§19.1); (13) נתוני גודל bundle של Turbopack; (14) נקודת יתרה של OpenRouter; (15) מטא־דאטה `comment=ai-generated` ב-MP4; (16) CSP סטטי מול סקריפטי ה-inline של Next 16 (`experimental.sri` עם ה-hash, או החלופה של `'unsafe-inline'` בכותרת האוכפת + ה-hash ב-Report-Only, §15.3); (17) WhatsApp — זמינות תבנית Authentication בעברית (v2, אפשר לדחות עד הפעלת הדגל); (18) אופן העברת `REMOTION_LICENSE_KEY` ל-`@remotion/vercel` ואזור הריצה של Sandbox (§19.6).
6. **פריטי `[M0-verify]` מהחלקים האחרים** שנכנסים ל-`docs/m0-verify.md` ונסגרים כמו השאר: `realtime.send` (חלק 04 §14; חלופה `broadcast_changes`); `BYPASSRLS` ל-`backup_reader` (חלק 04 §15b); שמות הקולות של `tts_fallback_voices` (חלק 05); `data_collection: "deny"` בנקודות המדיה של OpenRouter (חלק 05 §4); `input_references` ב-`/images` ו-`/images/models` (חלק 05 §4.1); Batch API של OpenRouter (חלק 05); ואימות כרטיס בלי סכום או J5 ב-Grow (§6.1).

**קריטריוני קבלה:**
- [ ] `pnpm dev` מציג עמוד עברי RTL בשתי הערכות; `pnpm typecheck && pnpm lint && pnpm test` עוברים.
- [ ] לכל פריט ב-`docs/m0-verify.md` יש תוצאה מתועדת (`pnpm check-decisions`).
- [ ] קיים MP4 מהספייק עם כתוביות עבריות תקינות.
- [ ] ספייק Grow הוכיח: עמוד תשלום, אסימון, חיוב לפי אסימון, החזר, שאילתת סטטוס ואימות כרטיס בלי גבייה — או שנבחר מתאם חלופי ותועד.
- [ ] דף הבית ודף `/app` עולים בלי הפרת CSP, לפי ההחלטה של ספייק 16.
- [ ] ספייק Morning הפיק 320 ו-330 ב-sandbox עם סכומים תואמים.

### M1 — שכבת הנתונים

**משימות:** כל חלק 04 (מיגרציות `0001`–`0012`, enum-ים, RLS, פונקציות, טריגרים, אחסון, Realtime, pg_cron, טיפוסים, seed עם נספחים A–C ו-`niche_extras.json`), כולל האובייקטים שהחלק הזה צריך: העמודות של §1.7, הטבלה `email_messages`, הפונקציות `billing_apply_payment`, `billing_apply_renewal`, `billing_apply_plan_change` (גוף מלא לפי §4.1, §4.2, §5.3–§5.4 כאן; החתימות בחלק 04 §10.8), `revoke_grant_remaining`, `enforce_plan_limits`, `platform_admin_status`, `health_ping`, הטריגר `prevent_audit_mutation`, משימות הניקוי של §11.5, התפקיד `backup_reader`, ומפתחות `app_settings` ודגלי `feature_flags` של §21.

**קריטריוני קבלה:**
- [ ] `supabase db reset && pnpm db:seed` עובר פעמיים ברצף.
- [ ] בדיקות RLS מוכיחות בידוד מלא בין סביבות (פרויקטים, נכסים, יומן, אחסון), ו-anon קורא רק קטלוג מפורסם.
- [ ] פונקציות הקרדיטים עוברות את בדיקות המקביליות; היומן ויומן הביקורת לא ניתנים לשינוי.
- [ ] `billing_apply_payment` אטומית: כשל באמצע (בבדיקה) לא משאיר מנוי בלי הענקה או הענקה בלי תשלום.

### M2 — אתר שיווקי וספריית הוקים

**משימות:** כל חלק 02; באנר העוגיות ו-`consents`; אירועי השיווק ב-`lib/analytics/events.ts`; LHCI ב-CI; הדפים המשפטיים בטיוטה עם משתנים; `check-content`; תשתית המיילים (§12.1–§12.3, `sendEmail`, `email_messages`, webhook של Resend) עם `newsletter_confirm` ו-`support_contact` (טופס יצירת הקשר והניוזלטר צריכים אותם).

**קריטריוני קבלה:**
- [ ] Lighthouse נייד ≥ 90 / 100 / 100 ב-`/`, `/hooks/[niche]`, `/pricing`; axe בלי הפרות חמורות.
- [ ] כל דפי הנישות וההוקים נבנים סטטית מה-seed; אין טקסט דמה (בדיקת CI).
- [ ] fixtures של bidi מוצגים נכון; לפני הסכמה אין PostHog.

### M3 — התחברות, אונבורדינג, סביבות עבודה ומותג

**משימות:** חלק 03 §2–§4, §11–§12, §16–§17 וחלק 04 הרלוונטי; המיילים `magic_link` (תבנית Supabase, חלק 04 §1.3), `welcome`, `team_invite`, `data_export_ready`, `account_deleted`; `safeFetch` לחילוץ מותג; MFA למנהלים (`/admin/mfa`); הגבלות קצב; רישום הסכמות בהרשמה; ייצוא ומחיקה.

**קריטריוני קבלה:**
- [ ] משתמש חדש ← אונבורדינג ← דשבורד בפחות מ-2 דקות, עם 70 קרדיטים ושורות `consents`.
- [ ] עורך מוזמן רואה רק את הסביבה שלו; חילוץ מותג מזרים התקדמות ונחסם לכתובות פנימיות (§15.8).
- [ ] העלאה מעל 50MB עוברת ב-TUS; מחיקת חשבון מוחקת נתונים ושולחת מייל.
- [ ] חמשת המיילים נבדקו ידנית ב-Gmail, Apple Mail ו-Outlook.

### M4 — האשף ושכבת הטקסט של ה-AI

**משימות:** חלק 05 (רישום מודלים, פרומפטים, סכמות, מודרציה, הוקים, תסריט, סטוריבורד, שכתוב, הערכה, אנימטיק, נתיב מהיר, שער עובדות) וחלק 03 §6; אירועי האשף; fixtures של OpenRouter לצ׳אט.

**קריטריוני קבלה:**
- [ ] מ-`/hooks/[niche]` ← "צרו סרטון מההוק" ← אשף ממולא ← תסריט בזרם תוך פחות מ-3 שניות ← סטוריבורד ← אנימטיק עם כתוביות, הכול בעברית וב-RTL.
- [ ] כל פלט LLM עובר Zod; קרדיטים נגבים ומוחזרים נכון בכשל (MSW).
- [ ] `estimate` מחזיר 23 / 50 / 107 / 478 לתרחישי הדוגמה.

### M5 — צנרת היצירה והרינדור

**משימות:** חלק 05 במלואו (תזמור, צעדים, webhook, אירוח מחדש, כתוביות, מוזיקה, Remotion, Sandbox, סיום, Realtime, עורך, החלפת סצנה, sweeper, עלויות, מגן תקציב) וחלק 03 §7–§9; המיילים `video_ready`, `video_failed_refunded`, `client_approval_request`, `approval_received` ו-`admin_alert`; התראות הצנרת (§16.4); ★ `moderation.upload.v1` (חלק 05 §10.14); בדיקת עומס ראשונה ב-staging.

**קריטריוני קבלה:**
- [ ] ב-preview: סרטון סטנדרט של 30 ש׳ ב-9:16, 1:1 ו-16:9 לשלוש נישות, עם כתוביות ו-bidi נכונים, קריינות, הנמכת מוזיקה וכרטיס סיום עם לוגו; p50 < 6 ד׳.
- [ ] הריגת קליפ באמצע הופכת רק את הסצנה שלו לתמונה בתנועה ומחזירה את הקרדיטים שלו; webhooks כפולים לא עושים כלום; כשל עבודה מחזיר 100%.
- [ ] בדיקת העומס הראשונה (10 עבודות) עברה בלי סטייה בקרדיטים.

### M6 — חיוב, סוכנות ואדמין

**משימות:** §1–§10 של החלק הזה (מנוע, Grow + mock, Morning + mock, חידושים, dunning, יחסיות, ביטול, החזרים, חשבוניות, מניעת הונאה), מיילי החיוב (`payment_receipt`, `invoice_ready`, `payment_failed`, `subscription_canceled`, `renewal_upcoming`, `plan_change_scheduled`, `price_change_notice`, `refund_request_received`, `refund_processed`, `refund_rejected`, `low_credits`), חלק 03 §15, §18, §22 (אדמין מלא כולל לוח עלויות, "התאמת תשלומים עכשיו", chargeback, צירוף חשבונית ידנית, הסרת יתרה מדלי), חלק 04 §21–§22, §24.1; אירועי השרת של החיוב (§14.2); בדיקות e2e של החיוב (`billing-*`, `plan-change`, `cancel-refund`); `smoke-staging` מול sandbox.

**קריטריוני קבלה:**
- [ ] רכישה ב-sandbox מעניקה קרדיטים פעם אחת (גם עם webhook כפול), מפיקה חשבונית עם מע״מ 18%, ומבקשת מספר הקצאה כשהנטו ≥ ₪5,000 ללקוח עסקי.
- [ ] כפתור הביטול עוצר חידושים מיד ושולח מייל אישור; הצעת ההחזר תואמת את `refunds.ts`.
- [ ] שדרוג מחייב לפי §5.2; שנמוך מוחל בסוף התקופה; 4 כישלונות חיוב מובילים ל-`expired` עם 4 מיילים.
- [ ] אדמין יכול לנסות שוב עבודה או להחזיר עליה, להחזיר תשלום, לסמן chargeback, לצרף חשבונית ידנית ולהתאים קרדיטים, וכל פעולה נרשמת בשם הקנוני שלה.
- [ ] webhook שנחסם בכוונה ב-mock מושלם על ידי "התאמת תשלומים עכשיו" בלי הענקה כפולה.
- [ ] סביבת לקוח של סוכנות צורכת מהיתרה של הסוכנות; White label מסתיר את המיתוג בעמוד השיתוף ובמייל האישור.

### M7 — הקשחה והשקה

**משימות:** סקירת אבטחה ובדיקת חדירות (או ASVS L1), CSP באכיפה, סקירת הגבלות קצב; בדיקת עומס מלאה (20 עבודות במקביל); ביקורת נגישות ידנית והצהרה; סקירת עורך דין ורו״ח, כולל כל ההחלטות שממתינות לאישור (§25), והחלפת כל המשתנים המשפטיים (`check-content --launch`); בדיקה של כל הטקסטים בידי דובר עברית כשפת אם, עם חתימה ב-`docs/eval/hebrew-review-m7.md` (הטופס של נספח E); בדיקת השמיעה של נספח E §13.4 יחד עם הבדיקה העיוורת של הקולות, ומיפוי `voices` (התוצאות ב-`docs/eval/listening-list.md`); המיילים `terms_update`, `security_notice` ו-`newsletter_weekly`; בדיקת רישיון Remotion (§19.6); הפקת ספריית המוזיקה; סרטוני דוגמה ו-`examples` מרינדורים אמיתיים; לוחות והתראות; PITR + גיבויים + תרגיל שחזור; runbooks ותרגולם; ערכת Product Hunt (סרטון דמו באנגלית, גלריה, תגובת מייסד); smoke בפרודקשן.

**קריטריוני קבלה:**
- [ ] כל סעיפי "הגדרת גמור" (§25) מסומנים.
- [ ] אפס באגים בדרגה P0/P1 פתוחים.
- [ ] התראות התקציב והזמינות מחוברות ונבדקו.
- [ ] `docs/eval/hebrew-review-m7.md` ו-`docs/eval/listening-list.md` חתומים, עם תוצאה לכל קול פעיל.
- [ ] smoke בפרודקשן עובר; `DECISIONS.md` שלם.

### קריטריוני קבלה (לכל אבני הדרך)
- [ ] לכל אבן דרך יש קומיט `feat(mX): …`, רשומה ב-`CHANGELOG.md` ותגית `v0.{m}.0`.
- [ ] אף אבן דרך לא התחילה לפני שכל הקריטריונים של הקודמת סומנו (נבדק בהיסטוריית ה-PR-ים).
- [ ] כל `[M0-verify]` שנוגע לאבן הדרך נסגר ב-`DECISIONS.md` לפני שהקוד שתלוי בו מוזג.

---

## §25. הגדרת "גמור" — רשימת הבדיקה המלאה

**מוצר**
- [ ] בעל עסק נרשם מהטלפון (קישור קסם או Google) ומגיע לדשבורד עם 70 קרדיטים בפחות מ-2 דקות.
- [ ] מ-`/hooks/[niche]` אפשר להגיע לסרטון מוכן בפחות מ-10 דקות (p50), בלי ידע בעריכה.
- [ ] כל 9 שלבי האשף, הנתיב המהיר ושער העובדות עובדים, עם שמירה אוטומטית לכל שלב.
- [ ] סרטון מתקבל ב-9:16, 1:1 ו-16:9, עם SRT, VTT ופוסטר.
- [ ] העורך מאפשר לשנות טקסט, לסדר מחדש, ליצור מחדש סצנה ולהרכיב מחדש — ומחייב רק על מה שהשתנה.
- [ ] גרסאות הוק (A/B) נוצרות כפרויקטים אחים עם נכסים משותפים.
- [ ] קישורי שיתוף ואישור לקוח עובדים, כולל White label בתוכנית סוכנות.
- [ ] סוכנות מנהלת עד 15 סביבות לקוח, שכולן צורכות מהיתרה שלה.

**עברית ושפה**
- [ ] אין ב-repo טקסט זמני, טקסט דמה או טקסט ממשק באנגלית (`lint:copy`).
- [ ] כל טקסט בממשק נמצא ב-`messages/he.json`; פנייה ברבים או ניטרלית כברירת מחדל, וגרסאות מגדר לפי `ui_gender_form`.
- [ ] אין לוכסנים מגדריים ואין ביטויים מרשימת האיסור, בממשק, במיילים, בפרומפטים וב-seed.
- [ ] בודק שפה שעברית היא שפת האם שלו אישר את הממשק, המיילים, הדפים המשפטיים והזרע (`docs/qa/hebrew-review.md`), וחתם על סקירת M7 בטופס של נספח E (`docs/eval/hebrew-review-m7.md`).
- [ ] בדיקת השמיעה של נספח E §13.4 והבדיקה העיוורת של הקולות הושלמו, עם תוצאה לכל קול ב-`docs/eval/listening-list.md`.
- [ ] 20 בריפים בבדיקה עיוורת: התסריטים נשמעים כמו קופי ישראלי ולא כמו תרגום.
- [ ] קריינות בעברית: מספרים במילים עם התאמה במין, טלפונים ספרה-ספרה, ראשי תיבות מפורקים; מילון ההגייה משפיע.
- [ ] כתוביות: עמודים לפי הכללים, מספר+יחידה לא נשברים, bidi נכון ב-fixtures (תמונות זהב עוברות).
- [ ] שום טקסט עברי לא מצויר בתוך תמונה או קליפ של AI.

**עיצוב ו-RTL**
- [ ] כיוון "בכורה" כהה כברירת מחדל וערכה בהירה מלאה, בלי הבהוב בטעינה.
- [ ] `lint:rtl` נקי — מחלקות לוגיות בלבד.
- [ ] אייקונים כיווניים מתהפכים; נגן, ציר זמן, play/pause ו-₪ לא.
- [ ] מספרים, מחירים, טלפונים ולטינית עטופים ב-`<bdi>` (`Num`, `Price`, `LtrInput`).
- [ ] מצבי טעינה בצורת התוכן, מצבים ריקים מעוצבים, ושגיאות שאומרות מה קרה ומה הוחזר.
- [ ] כל כפתור יצירה מציג את עלותו בקרדיטים.
- [ ] גלריית `/admin/design` מציגה כל רכיב בכל מצב בשתי הערכות, עם snapshot ב-CI.
- [ ] תנועה מאופקת; "עצירת אנימציות" ו-`prefers-reduced-motion` מכובדים בכל מקום.

**נגישות**
- [ ] axe: אפס הפרות `serious`/`critical` בכל תבנית דף, בשתי הערכות, בדסקטופ ובמובייל.
- [ ] כל האשף, העורך והנגן ניתנים להפעלה במקלדת בלבד, עם מיקוד נראה שלא מוסתר.
- [ ] לכל וידאו שיווקי יש כתוביות עבריות (`<track>`) ובקרת עצירה.
- [ ] יעדי מגע ≥ 24×24 (בפועל ≥ 32); ניגודיות לפי טבלת חלק 01.
- [ ] הודעות שגיאה בעברית מקושרות לשדות, ולא בצבע בלבד; הדבקה מותרת בקודים.
- [ ] בדיקה ידנית עם NVDA ו-VoiceOver עברה.
- [ ] הצהרת נגישות מפורסמת עם רמה, פערים, תאריך ביקורת ופרטי רכז הנגישות.
- [ ] אין תוסף נגישות צף.

**משפט ותאימות** ⚖️
- [ ] שבעת הדפים המשפטיים אושרו על ידי עורך דין, וכל המשתנים המשפטיים הוחלפו (`check-content --launch`).
- [ ] "ביטול מנוי" בפוטר של כל עמוד, בעמוד החיוב ובמדיניות; ביטול ב-2 לחיצות עם מייל אישור.
- [ ] ביטול במייל או בטלפון מטופל תוך פחות מ-3 ימי עסקים, עם התראת SLA.
- [ ] גילוי לפני עסקה, תיבת תנאים לא מסומנת בקופה, ומסמך גילוי (`payment_receipt`) אחרי.
- [ ] החזר 14 יום ודמי ביטול (5% / ₪100) לפי `refunds.ts`; תקופה מורחבת של 4 חודשים בטיפול ידני.
- [ ] מחירים כולל מע״מ בכל מקום; מע״מ קונפיגורבילי.
- [ ] חשבונית מס-קבלה לכל תשלום; מספר הקצאה מעל הסף לעסקים; חשבונית זיכוי לכל החזר.
- [ ] מדיניות פרטיות עם רכיבי ס׳ 11 המתוקן; DPA עם כל ספקי המשנה; מסמכי אבטחת המידע קיימים.
- [ ] יומן הסכמות מלא (תנאים, פרטיות, AI, דיוור, עוגיות) עם גרסה, IP ומקור.
- [ ] דיוור: "פרסומת:" בנושא, פרטי שולח, הסרה בלחיצה (RFC 8058), רק עם הסכמה.
- [ ] תוכן פוליטי ופוליטיקאים חסומים; מצב בחירות פעיל עד 2026-10-28 23:59.
- [ ] תווית AI, צ׳קליסט ייצוא, הצהרות הסכמה בהעלאת אנשים; שיבוט קול ואווטאר כבויים.
- [ ] כל 25 שורות §11.1 מסומנות ב-`docs/legal/launch-checklist.md` עם ראיה.
- [ ] כל ההחלטות שבטבלה "החלטות שממתינות לאישור עורך דין / רו״ח" (למטה) אושרו בכתב או שונו, והתוצאה רשומה ב-`DECISIONS.md`.

**החלטות שממתינות לאישור עורך דין / רו״ח** ⚖️ — ממומשות כברירת מחדל, ולא עולות לפרודקשן ציבורי לפני אישור:

| # | החלטה | מי מאשר | איפה ממומש |
|---|---|---|---|
| 1 | החזר יחסי על מנוי שנתי אחרי 14 הימים (`annual_prorata`): החודשים שהתחילו במחיר החודשי של המנוי השנתי, בלי דמי ביטול | עו״ד צרכנות | §10.3–§10.5, `lib/billing/refunds.ts`; חלק 02 §10.5 |
| 2 | החזר של 14 יום גם על תשלום שדרוג סוגר את המנוי כולו | עו״ד צרכנות | §10.3, §10.6 צעד 6; חלק 02 §10.5 |
| 3 | מעבר מחודשי לשנתי "מעכשיו" בלי החזר על יתרת החודש (הקרדיטים נשמרים) | עו״ד צרכנות | §5.1 מעבר 3, §5.5 |
| 4 | סימון (לא חסימה) של סביבה עם 3 החזרים או יותר ב-6 חודשים | עו״ד צרכנות | §7.2 |
| 5 | מדיניות שינוי מע״מ: המחיר לפני מע״מ קבוע, והמחיר הכולל מתעדכן | עו״ד + רו״ח | §9.7, R10; חלק 02 §10.2 (6.7) |
| 6 | טיפול בחשד לפגיעה בקטינים בהעלאות (חסימה, שמירת ראיה, דיווח) | עו״ד | §15.9; חלק 05 §10.14 |
| 7 | DPO, רישום מאגר ורמת אבטחה (בינונית) | עו״ד פרטיות | §11.3; `docs/legal/*` |
| 8 | החזר מלא כשהביטול התקבל לפני חיוב שיצא בתוך חלון 3 ימי העסקים | עו״ד צרכנות | §10.2 |
| 9 | פטור ממחיקת סרטונים אחרי 90 יום לסביבות ששילמו אי־פעם | עו״ד פרטיות | §11.5; חלק 04 §11.4 (`mark_retention`); חלק 02 §10.3 |
| 10 | מילת האישור "מחיקה" בדיאלוג מחיקת החשבון | עו״ד | חלק 04 §21.3; חלק 03 §16.4 |
| 11 | כל הדפים המשפטיים (תנאים, פרטיות, ביטול, נגישות, AI, דמות וקול, עוגיות) | עו״ד | חלק 02 §10 |
| 12 | הניסוח על Bit בתנאי השימוש ("אם האפשרות מוצגת בעמוד התשלום") | עו״ד | חלק 02 §10.2 (6.2); §3.1, §8.2 |
| 13 | סוג המסמך (חשבונית מס-קבלה בלבד; עוסק פטור לא נתמך) ושורות החשבונית | רו״ח | §9.2–§9.3 |
| 14 | נוהל בקשת מספר הקצאה בדיעבד, ועיכוב חשבונית מעל יום עסקים | רו״ח | §9.4, R5 |
| 15 | וואטסאפ כ"דבר פרסומת" לפי ס׳ 30א, ומועד התחולה של כללי הבחירות על זיוף עמוק (שניהם לא אומתו במחקר) | עו״ד | §11.8, §11.11, §13 |
| 16 | `low_credits` כהודעת שירות ולא "דבר פרסומת": בלי מחירים, בלי חבילה או תוכנית מוצעת ובלי כפתור רכישה, ולכן בלי הסכמה, בלי "פרסומת:" ובלי קישור הסרה של ס׳ 30א (הכיבוי בהגדרות ההתראות נשאר) | עו״ד | §11.8, §12.5 (`low_credits`) |

**פריט פתוח (לא משפטי):** הגבלות הרשת של מסד הפרודקשן כבויות בהשקה (§15.11). הפעלתן מחכה ל-runner עם IP יציא קבוע ברשימת ההיתר, וההחלטה רשומה ב-`DECISIONS.md`.

**אבטחה ופרטיות**
- [ ] RLS על כל טבלה, ובדיקות בידוד ירוקות; סביבה זרה מקבלת 404.
- [ ] סודות רק בשרת; אין `NEXT_PUBLIC_` עם סוד; gitleaks נקי.
- [ ] אסימוני תשלום מוצפנים, לא נרשמים בלוגים, ורוטציה תורגלה.
- [ ] CSP באכיפה, HSTS, וכל הכותרות של §15.3.
- [ ] כל webhook מאומת (חתימה/טוקן/שאילתה חוזרת) ואידמפוטנטי.
- [ ] `safeFetch` חוסם את כל רשימת ה-SSRF.
- [ ] MFA חובה למנהלי פלטפורמה; כל פעולת אדמין ביומן ביקורת שאינו ניתן לשינוי.
- [ ] הגבלות קצב פעילות, ותקרות יומיות ומגן תקציב נבדקו.
- [ ] בדיקת חדירות (או ASVS L1) הושלמה בלי ממצאים חמורים פתוחים.
- [ ] PITR פעיל, גיבויים שבועיים מוצפנים ל-S3, ותרגיל שחזור תועד.
- [ ] אכיפת SSL במסד הפרודקשן פעילה; הגבלות הרשת כבויות בהשקה עם הבקרות המפצות של §15.11, והפריט הפתוח רשום ב-`DECISIONS.md`.

**ביצועים**
- [ ] LCP < 2.5 ש׳, CLS < 0.05, INP < 200ms בדפי השיווק (נייד).
- [ ] JS בדף הבית ≤ 170KB; Remotion Player נטען רק באשף ובעורך.
- [ ] דפי הוקים מ-ISR עם TTFB < 300ms תחת 100 בקשות לשנייה.
- [ ] סרטון סטנדרט של 30 ש׳: p50 < 6 ד׳, p95 < 12 ד׳.
- [ ] הצלחת יצירה ≥ 97%, הצלחת רינדור ≥ 99% בשבוע שלפני ההשקה.
- [ ] אין שאילתה חמה מעל 50ms p95.

**SEO**
- [ ] לכל דף מאונדקס יש כותרת עברית ≤ 60 תווים, תיאור ≤ 155, canonical ו-H1 עברי.
- [ ] דפי פאסטים ושילובים דלים ב-`noindex,follow` עם canonical לבסיס.
- [ ] מפות אתר מחולקות, `robots` חוסם `/app`, `/admin`, `/api`, `/v`, `/approve`, `/exp`, `/dev`.
- [ ] JSON-LD תקין (Organization, WebSite+SearchAction, BreadcrumbList, ItemList, VideoObject, Product+AggregateOffer).
- [ ] תמונות OG בעברית תקינה (bidi) לנישות, לסוגי הוקים, להוקים ולבלוג.
- [ ] לכל דף נישה מאונדקס יש פתיח ייחודי שנבדק על ידי אדם.

**חיוב**
- [ ] רכישת מנוי, חבילה ושדרוג עובדות מקצה לקצה ב-Grow sandbox וב-mock.
- [ ] webhook כפול לא מעניק פעמיים; webhook שאבד מושלם בהתאמה התקופתית.
- [ ] חידושים חודשיים ושנתיים, והענקה חודשית במנוי שנתי, לפי העוגן ושעון ישראל.
- [ ] גלגול קרדיטים חודש אחד, וסדר צריכה מהדלי שפג ראשון.
- [ ] Dunning: 4 ניסיונות, 4 מיילים, `expired` ביום 7, תקופת חסד בלי הענקה.
- [ ] יחסיות לפי §5.2; `dryRun` זהה לביצוע.
- [ ] החזרים מסירים קרדיטים לפני ההחזר, מפיקים חשבונית זיכוי ושולחים מייל.
- [ ] אף פעם לא חיוב שני אחרי timeout עמום.
- [ ] `mock` לא ניתן להפעלה בפרודקשן.
- [ ] לוח האדמין מציג תשלומים, החזרים, חשבוניות, מנויים בכשל ורווחיות.
- [ ] `credit_invariant_violations()` ריקה בפרודקשן, עם בדיקה שעתית.
- [ ] כל שורות התאימות של §11.1 שנוגעות לחיוב מסומנות עם ראיה.
- [ ] עדכון כרטיס לא גובה כסף, וב-`past_due` מחייב מיד את החוב פעם אחת; Bit מוצג רק בחבילות וכש-`GROW_PAGE_CODE_BIT` מוגדר.
- [ ] chargeback, החזר ידני וצירוף חשבונית ידנית עובדים מהאדמין ונרשמים בשמות הקנוניים (`payment.chargeback`, ‏`payment.refund`, ‏`invoice.attach`).
- [ ] כל 26 תבניות המייל קיימות, וכל מייל חיוב נבדק ידנית ב-Gmail, Apple Mail ו-Outlook.

**אנליטיקה**
- [ ] `lib/analytics/events.ts` מכיל בדיוק את 63 האירועים של §14.2, ואירועי שרת לא נשלחים מהלקוח.
- [ ] לפני הסכמה אין PostHog, אין עוגיות `ph_*` ואין `exp_hero`; אירועי שרת נשלחים רק למי שהסכים.
- [ ] אין PII בשום מאפיין (בדיקת יחידה), ו-`docs/analytics.md` מכיל את 8 המשפכים ו-4 הלוחות.

**צנרת AI**
- [ ] כל הקריאות ל-AI עוברות דרך OpenRouter מהשרת בלבד, עם `data_collection: "deny"` וכותרות שיוך.
- [ ] רישום המודלים מסונכרן יומית ולא מפעיל מודל לבד; נתיבים ניתנים לעריכה באדמין.
- [ ] כל פלט LLM מאומת ב-Zod; שגיאות ממופות לקודים עם הודעה עברית.
- [ ] webhooks של וידאו מאומתים לפי הפורמט שנבדק ב-M0, עם polling כגיבוי.
- [ ] קליפ שנכשל הופך לסצנה מתמונה בתנועה עם החזר קרדיטים; עבודה נכשלת רק לפי הכללים.
- [ ] כל קריאה נרשמת ב-`ai_generations` עם עלות (או NULL + הערכה, אף פעם 0).
- [ ] מגן התקציב, התראות העלות והחריגות פעילים ונבדקו.
- [ ] מודרציה על בריף, תסריט והעלאות; מצב בחירות.
- [ ] Runbooks של תקלת ספק ומודל שיצא משימוש תורגלו.
- [ ] עלות ממוצעת לקרדיט נמוכה מ-$0.02 בפועל (רווח גולמי ≥ 65%).

**בדיקות**
- [ ] יחידה, חוזה, מסד, e2e, נגישות וויזואלי — ירוקים ב-CI על `main`.
- [ ] ספי הכיסוי של §18.1 נשמרים.
- [ ] המסלול המלא של האשף עובר בשלושת הפרויקטים של Playwright.
- [ ] בדיקות הבידוד והמקביליות של הקרדיטים רצות 20 פעמים בלי כישלון.
- [ ] בדיקת עומס של 20 עבודות במקביל עברה, ודוח נשמר.
- [ ] fixtures מוקלטים לכל ספק, בלי סודות.
- [ ] בדיקת הסטייה השבועית מול הספקים פעילה.
- [ ] בדיקות ידניות (עברית, קוראי מסך, מכשירים, מיילים) מתועדות.

**פריסה ותפעול**
- [ ] פרודקשן על Vercel Pro (`fra1`) ו-Supabase Pro (`eu-central-1`), עם מפתחות API חדשים בלבד.
- [ ] `release.yml`: מיגרציות לפני קוד, אישור ידני לפרודקשן, smoke אחרי כל פריסה.
- [ ] כל משתני הסביבה מתועדים ב-`.env.example` ומאומתים ב-`lib/env.ts`.
- [ ] דגלים ומתגי חירום (`maintenance_mode`, `or:halt`, `billing_checkout`) נבדקו.
- [ ] Sentry עם מפות מקור, Cron Monitors ו-Uptime; כל ההתראות של §16.4 מחוברות.
- [ ] 13 runbooks קיימים, ו-R1, R3, R9 תורגלו.
- [ ] Remotion: רישיון מתאים לגודל החברה (חינם עד 3 עובדים; מעבר לזה Automators, §19.6), ו-`REMOTION_LICENSE_KEY` מוגדר כשצריך.
- [ ] אף `app/api/**/route.ts` לא מגדיר `maxDuration` מעל 300 (החריג היחיד: נתיבי הצעדים של WDK, `.well-known/workflow/*`, שמוגדרים ב-`vercel.json → functions`), ואף גוף בקשה לא עובר 4MB (§19.6).
- [ ] מגבלת אשראי לכל מפתח OpenRouter; יתרה מספיקה ל-7 ימים.
- [ ] `README.md` מסביר התקנה, סביבות ופריסה; `DECISIONS.md` ו-`CHANGELOG.md` שלמים.
- [ ] ערכת ההשקה (Product Hunt) מוכנה, וסרטוני הדוגמה באתר הם רינדורים אמיתיים של המוצר.

### קריטריוני קבלה
- [ ] הרשימה הזו מועתקת ל-`docs/launch/definition-of-done.md`, וכל סעיף מסומן עם קישור לראיה (בדיקה ירוקה, צילום, דוח או מסמך חתום).
- [ ] סעיפי ⚖️ מסומנים רק אחרי אישור בכתב של עורך הדין או רואה החשבון, שמצורף ב-`docs/legal/`.
- [ ] אין פריסת פרודקשן ציבורית (הסרת ההגנה מהדומיין) לפני שכל הסעיפים מסומנים.

---

## תלויות בין חלקים

- **חלק 00:** פורמט `DECISIONS.md` וסדר העדיפויות בין המסמכים; הרשימה המלאה של משתני התוכן `{{…}}` נמצאת כאן ב-§20.1.
- **חלק 01:** `formatIls` (§2.5) היא המעצבת היחידה של ₪, ו-`formatAgorot` כאן עוטפת אותה; `Price`, ‏`Num`, ‏`LtrInput`; ה-hash של `THEME_SCRIPT_SOURCE` (§6.2) נכנס לשני ענפי ה-CSP (§15.3); ‏`font-src 'self'` לגופני הכתוביות בנגן; `lint:rtl` ו-`lint:copy` (§2.6, §9.3); העוגיות `theme`, ‏`motion`, ‏`sidebar_state` (§11.7).
- **חלק 02:** הדפים המשפטיים (§10) משקפים את §10–§11 כאן: דוגמאות ההחזר של מדיניות הביטול = §10.5, טבלת השמירה = §11.5, רשימת העוגיות = §11.7, ספקי המשנה = `docs/legal/subprocessors.md`; ‏`bitEnabled` נגזר מ-`GROW_PAGE_CODE_BIT` (מחרוזות `…ByCardOnly`); אירועי השיווק הם שורות של §14.2 (עם `SignupSource` ו-`CtaLocation` של §14.3); ‏`check-content --launch` בודק את משתני §20.1.
- **חלק 03:** מסכי החיוב (§15) מציגים את בלוק הגילוי ותיבת התנאים (§4.1), את הבורר "מתי לעבור?" (§5.5), את באנר `past_due` ואת תוצאת עדכון הכרטיס (§6), ואת זרימת הביטול וההחזר (§10.6–§10.7); ‏`/admin/mfa` (§15.4); כלי האדמין לחיוב (chargeback, צירוף חשבונית ידנית, הסרת יתרה מדלי, "התאמת תשלומים עכשיו"); קטלוג האירועים של §14.2, כולל ההפרדה בין אירועי לקוח לאירועי שרת; מחרוזות `ops.banners` (§22).
- **חלק 04:** האובייקטים שהמנוע נשען עליהם — עמודות `subscriptions` ו-`payments` (§7), ‏`email_messages` ו-`abuse_reports.source` (§8), ‏`platform_admin_status` (§9.2), ‏`enforce_plan_limits` (§9.5b), ‏`revoke_grant_remaining` (§10.3), החתימות של `billing_apply_*` (§10.8; הגוף נכתב לפי §4–§5 כאן), ‏`prevent_audit_mutation` (§10.6), משימות הניקוי (§15), ‏`backup_reader` (§15b), ‏`app_settings` ו-`feature_flags` (§16.4), ‏`proxy.ts` (§17.2), ‏`maxDuration` (§18.5), מגבלות הקצב ומפתחות Upstash (§18.6), חוזי החיוב, החשבון וה-WhatsApp (§21), ‏`/api/health` (§21.5), ה-webhooks (§22.4–§22.6), נתיבי ה-cron (§23), ‏Admin API ורשימת פעולות הביקורת הקנונית (§24.1).
- **חלק 05:** ‏`moderation.upload.v1` (§10.14); ‏`data_collection: "deny"` (§4); מגן התקציב ו-`or:halt` (§2.3, §7.3); ‏`SAMPLE_PRESETS` ו-`estimateSample` (§14.2); אירועי הצנרת של §14.2 כאן; ‏`eval:prompts` ו-`test:pipeline` (§23); הרינדור ב-Vercel Sandbox ו-`REMOTION_LICENSE_KEY` (§19.6 כאן).
- **נספחים:** נספח D — ה-fixtures של בדיקות ה-e2e ו-`demo:render`; נספח E §13.4 — בדיקת השמיעה וטופס סקירת העברית של M7; נספח F — הבסיס, והחלק הזה גובר עליו בממשקי `PaymentProvider`/`InvoiceProvider`, ב-26 תבניות המייל, ב-63 האירועים, במשתני הסביבה, בדגלים וב-CSP.
