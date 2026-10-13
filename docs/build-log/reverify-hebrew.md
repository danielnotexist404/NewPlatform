# Re-verify: Hebrew copy and consumer/legal claims (final, read-only)

**Scope.** I read the user-facing copy in these files:
- P2: the landing page, pricing, FAQ, all 7 legal pages, cookies/newsletter, about/contact, blog, and the niche pages.
- P3: microcopy, `errors.*` (§1.4–1.5 and the §23 JSON), billing, cancel, share and approve.
- P6: emails §12, WhatsApp §13, the checkout disclosure §4.1, and the law map §10.
- P1: §2 and the `common.*` strings in §19.
- App E: §4–§6.
- The App D price strings.
- `PROMPT-QUICKSTART.md`.
- The seed data.

Paths are relative to `scratchpad/build/parts/` and all line numbers come from `grep -n`. Parts win over `spec.md`, and the decision log breaks ties.

**Mechanical scans** (scripts in `scratchpad/rv/`):
- Banned phrases (App E §5.2): 0 hits outside the negative-example tables.
- Raw U+200E/U+200F in bold-quoted or JSON copy: 0.
- U+05BE maqaf in quoted copy: 0.
- Hyphen between a prefix letter and `{{BRAND_NAME}}`, or a prefix letter before a `*Name`/`*Title` variable: 0.
- Count variables without ICU plural: 0 genuine hits. The only remaining hits are the false positives listed in N2.
- `python3 -I seed/scripts/build_seed.py --check` (validate-only mode, no writes): 0 errors, 0 warnings.

**Counts:** 0 blocker · 3 major (new). Every blocker and major from the previous round is FIXED.

---

## A. Previous round's blockers and majors: status

### verify-hebrew.md

| ID | Status | Evidence (current files) |
|---|---|---|
| H-M1 trial claim without limits | **FIXED** | <ul><li>TrustRow `02:431` "{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי". Tooltip `02:436` adds "באיכות טיוטה, עם סימן מים".</li><li>Meta descriptions `02:725` and `02:782`. CTA `02:595`.</li><li>Login row `03:382`. Empty state `03:582` is gated on `plan_id='free' && trial_status='granted' && !has_paid`, with the generic fallback otherwise.</li><li>Pricing `02:1396`/`1407` and FAQ `02:1966`.</li><li>P6 `welcome` email, `06:1147`. No-trial variant at `06:1154`.</li></ul> |
| H-M2 "הכי פופולרי" badge | **FIXED** | <ul><li>`02:1390` "מומלץ"; `01:1611`; `04:1078`, `04:4592`.</li><li>The CI check against the string is at `02:1554`.</li><li>The string now appears only in the App E negative example at `90:3377`.</li></ul> |
| H-M3 "ביטול בלחיצה" | **FIXED** | <ul><li>No "בלחיצה" in any cancellation context. The remaining hits are unsubscribe (RFC 8058) or UI mechanics.</li><li>Mechanism sentence at `02:1529`. `/legal/cancellation` button "ביטול מנוי" at `02:2317`.</li><li>Disclosure at `06:288` matches R17.</li><li>Login trust row `03:382` reads "ביטול אונליין בכל רגע".</li></ul> |
| H-M4 card-storage statement | **FIXED** | R20 wording at `02:1432`, `02:1433` (ByCardOnly), `02:1990`, `02:1993` and Terms 6.2 `02:2111`. Consistent with privacy `02:2193`. |
| H-M5 "free preview" | **FIXED** | <ul><li>HowItWorks `02:529` reads "({previewCredits, plural …})". Note `02:532`: "אסור לתאר את התצוגה המקדימה כחינמית".</li><li>P3 subtitle `03:901` reads "לא עולה קרדיטים נוספים".</li><li>QS `:393` matches.</li></ul> |
| H-M6 hyphen before Hebrew variables | **FIXED** | <ul><li>0 regex hits.</li><li>`BRAND.watermarkHe` is built with `withPrefix` (`02:88`), and `nameHeWith` is at `02:80`.</li><li>Auth templates `04:59`, `04:68`, `04:83` read "ל{{BRAND_NAME}}".</li><li>Emails use "הזמנה מאת {inviterName}" (`06:1379`, `06:1383`) and "מאת {agencyName}" (`06:1360`).</li><li>The lint rule is at `01:199`.</li></ul> |
| H-M7 `vo_he` price vs `shekel_format` | **FIXED** | App D `90:346`, `90:373`, `90:487`, `90:574` and golden row `90:2568` all read "ב-{מחיר} ₪". App E §6.3 at `90:3045` reads "ב-149 ₪ (`suffix`) / ב-₪149 (`prefix`)". |
| H-M8 canonical copy fails lint | **FIXED** (residual note) | <ul><li>0 hits for "זה הזמן לפרסם" and "המשך לשלב הבא" (`03:593` now "כדאי להתחיל לפרסם עכשיו").</li><li>0 hits for "חשבונית מס/קבלה".</li><li>P1 §2.6 has the form-block doubling exemption (`01:198`).</li><li>Residual: P2 §10.8 shows the form at `02:2499–2514` without the `{/* form:start */}`/`{/* form:end */}` markers that the exemption depends on. Add one sentence there. This is minor, because the P1 acceptance fixture forces the markers.</li><li>See also new N2: other lint rules still misfire.</li></ul> |
| H-M9 raw bidi marks in copy | **FIXED** | 0 marks inside bold-quoted or JSON copy. `02:406` uses `<ltr>`. `03:122` and `03:2120` use `<ltr>` per token. The remaining marks are in prose, which R19(d) allows. |
| H-M10 ICU plurals | **FIXED** | <ul><li>`common.*` patterns at `01:2330–2459`.</li><li>P3 toasts `03:235–236`, minutes `03:1154`, degraded scenes `03:1183`, word counter `03:775`, months `03:1620`.</li><li>P6 `low_credits` `06:1341–1350`, `video_ready` degraded block `06:1165`.</li><li>Season countdown `02:1236`.</li></ul> |

### verify-consistency.md

| ID | Status | Evidence |
|---|---|---|
| C-B1 money units | **FIXED** | <ul><li>`RefundQuote` uses `*Ag` (`06:827–828`).</li><li>`toApiRefundQuote` maps to `*Ils` with `toIlsNumber` (`06:853–856`).</li><li>`provider.refund({ amountAg: quote.refundAg })` (`06:879`). `p_amount_ils = fromAgorot(ev.amountAg)` (`06:294`).</li><li>The naming rule is at `06:50`, and the unit test at `06:892`.</li></ul> |
| C-M1 two `HookCardDTO`s | **FIXED** | P2 imports the P4 contract (`02:979–986`). P4 adds the display fields (`04:5970–5980`), and `search_hooks` returns them (`04:3192`, `04:3231–3234`). |
| C-M2 White label snapshot | **FIXED** | <ul><li>`effective_white_label` at `04:1907` and the comment "no branding column" at `04:1374`.</li><li>`resolveShareBranding` is used on `/v` and `/approve` (`03:1259`) and in emails (`06:1071`).</li><li>Downgrade row at `06:441`.</li></ul> |
| C-M3 attestations | **FIXED** | `04:5837–5839`, using `ATTESTED_FLAGS` and `ATTESTATION_LABELS_HE`. |
| C-M4 approval link "ללא הגבלה" | **FIXED** | The approval tab offers 14/30/90 only (`03:1249`, acceptance `03:1281`). Contract comment at `04:6052–6054`. |
| C-M5 free `planAllowance = 0` | **FIXED** | `nullif(pl.monthly_credits, 0)` at `04:2991`. The P1 ring renders only when `planAllowance != null` (`01:1394`). One formula in `lib/billing/credits.ts` (`06:217–241`). |

### verify-technical.md

| ID | Status | Evidence |
|---|---|---|
| T-M1 `scenes` writable | **FIXED** | `public.scenes` is in the server-only revoke list (`04:3701`). Only `scenes_select` remains (`04:3884`). |
| T-M2 forged consents | **FIXED** | `public.consents` is in the revoke list (`04:3702`). Only `consents_select_own` remains (`04:3951`). |
| T-M3 interactive credit loss | **FIXED** | <ul><li>`begin_spend`/`commit_spend`/`sweep_orphaned_spends` at `04:2779–2814`.</li><li>`maxDuration = 300`, `deadlineAt` and `maxRetries: 0` at `05:255` and `05:360`.</li><li>6-minute window at `04:5428`.</li></ul> |
| T-M4 PUBLIC `EXECUTE` | **FIXED** | Global revoke at `04:294`, per-schema at `04:295`. Corrected sentence at `04:4007`. |
| T-M5 seat bypass | **FIXED** | `revoke update on public.workspace_members` at `04:3711`. `change_member_role` with a lock at `04:2131` and `04:2237–2238`. pgTAP at `04:2407`. |
| T-M6 expiry duplicate keys | **FIXED** | `credit_grants.expired_at` at `04:1125` and `04:2461`. `expire:cap:{grantId}:{ref}` at `04:2424`. `clock_timestamp()` at `04:2428`. |
| T-M7 `low_credits` as advertising | **FIXED** | <ul><li>The email has no price, pack or plan, and its CTA is "לעמוד החיוב" (`06:1341–1350`).</li><li>Classification at `06:1011`. ⚖️ row at `06:2874`.</li><li>The `welcome` no-trial variant is neutral (`06:1154`).</li></ul> |
| T-M8 staging webhooks and crons | **FIXED** | Bypass parameter at `06:610` and `06:2152`. `staging-crons.yml` at `06:2243`. |
| T-M9 DB network restrictions | **FIXED** | Off at launch, with compensating controls (`04:49`). |

---

## B. New MAJOR findings

### N1. The pricing page says text edits and scene reordering cost no credits, but a paid re-render is needed to get the edited video
- **Where:** `02-marketing-site.md:1511` (§7.5 "איך זה עובד"): **"עורכים בלי לשלם על הכול מחדש."** שינוי טקסט ומעבר סצנות לא עולים קרדיטים; יצירה מחדש של סצנה אחת עולה רק את הסצנה ואת ההרכבה מחדש.
- **Why it is wrong:**
  - Any change to on-screen text, order, duration or captions in an assembled video becomes a `rerender` job. It costs `render.base` (3/5) plus `render.extra_format` × (n−1), plus TTS if the voiceover text changed. Sources:
    - the P2 price list itself (`02:1503–1504`);
    - P3 §9 primary button "הרכבה מחדש · {n} קרדיטים" (`03:1297`) and acceptance "עם עלות של הרכבה בלבד" (`03:1356`);
    - P4 §19.8 `render` (`04:5850`);
    - P5 §18 `rerender` (`05:2954`);
    - QS `:408` "מה עולה בהרכבה … הרכבה בלבד".
  - On the page that states prices, this misstates the price. It is the same class as H-M5, and it falls under Consumer Protection Law §2 (misleading about price) and App E §2 "אמת לפני הכול".
  - The FeatureBento tile at `02:620` already words this correctly.
- **Fix (P2 §7.5, and the matching bullet wherever it is reused):** replace the bullet with
  > **"עורכים בלי לשלם על הכול מחדש."** "עריכת טקסט, סדר ומשך בעורך לא עולה קרדיטים, ורואים את השינוי מיד בנגן. כדי לקבל קובץ מעודכן משלמים רק על ההרכבה מחדש ({rerenderCredits, plural, one {מקרדיט אחד} two {משני קרדיטים} other {מ-# קרדיטים}}), ואם טקסט הקריינות השתנה — גם על הקלטה מחדש. יצירה מחדש של סצנה אחת עולה רק את הסצנה ואת ההרכבה מחדש."

  `rerenderCredits` = `credit_costs['render.base'].credits` (3 with the seed), injected at build like `previewCredits`.

### N2. The R24 plural rule and the currency rule in `lint:copy` cannot work against the canonical copy, so CI is red or the rule is a no-op
- **Where:**
  - `01-brand-design.md:200`, rule "ספירה בלי plural": `\{[a-zA-Z]+\} [א-ת]+(ים|ות)\b` (repeated in the P3 acceptance `03:2202`).
  - `01-brand-design.md:203`, rule "מטבע": "₪ צמוד לספרה בטקסט קבוע (חוץ משתי תוויות `shekel_format`)".
  - Both rules run on `messages/he.json`, `content/**/*.{mdx,json}` and the email templates (`01:192`).
- **Why it is wrong:**
  1. **Plural rule, as written, never fires.** `lint-copy.ts` is TypeScript. In a JS RegExp, `\b` is defined over ASCII `\w`, and Hebrew letters are not `\w`. So `…(ים|ות)\b` cannot match before a space, punctuation or end of string. The required fixture ("`{n}` ואחריו "הוקים" … נכשל", `01:209`) would fail.
  2. **Plural rule, once fixed** (e.g. with `(?![א-ת])`), flags canonical non-count strings, because any variable followed by a verb or noun ending in ים/ות matches:
     - `06:1267` "לתוכנית {planName} **תסתיים**"
     - `06:1249` and `06:337` "{planName} **הסתיים**"
     - `06:1211` "{cardBrandHe} **שמסתיים**" and `03:1529` "{brand} **שמסתיים**"
     - `06:1356` "{agencyName} **מבקשים**"
     - `06:1226` "{allocationNumber} **מרשות**"
     - `06:1394` "{invoicesClause} **והקבצים**"
     - `03:1679` and `06:1497` "{phone} **הודעות** שירות"
     - `02:1983` "{businessVideos} **ובסוכנות**"
  3. **Currency rule:** in MDX, the copy must contain literal amounts, and the MDX component allow-list (`02:1584–1596`) has no `Price`/`Num` to replace them. Yet the rule flags every literal amount in content:
     - legal examples `02:2337` "₪2,772" and `02:2344` "₪119 ל-400 קרדיטים … ₪98.17";
     - Terms 6.5 "₪5" (`02:2114`);
     - blog `02:1716` "₪5,000 עד ₪60,000" and `02:1720` "₪550".

     P3 (`03:1640`) and P6 (`06:1480`) already limit this check to `messages/he.json`. P1 is the outlier.
  4. Result: the coding agent either ships a rule that silently does nothing, or gets a red CI on owner-approved copy and invents ad-hoc exemptions. This is the same failure class as H-M8.
- **Fix (P1 §2.6, mirrored in the P3 `03:2202` acceptance):**
  1. **Plural rule:** match on the noun, not on any word. Use `\{[a-zA-Z]+\}\s+(COUNT_NOUNS)(?![א-ת])` outside a `plural` block, where:
     - `COUNT_NOUNS` = קרדיטים|סרטונים|הוקים|סצנות|דקות|שניות|ימים|שבועות|חודשים|מילים|פרויקטים|ערכות|משתמשים|פורמטים|גרסאות|תמונות|קליפים|יצירות|שקלים|פעמים|פרטים|נתונים|תווים|פיקסלים|מקומות|סביבות;
     - the list is exported from `lib/hebrew/count-nouns.ts`, and `HE` lint imports it.
  2. **Plural allow-list:** add `starterVideos`, `businessVideos` and `agencyVideos`. They are seeded and ≥ 3.
  3. **Fixtures:** keep the fixtures. Add one that must pass: "לתוכנית {planName} תסתיים".
  4. **Currency rule:** in `messages/he.json` and the email templates, any ₪ next to a digit or variable is an error (unchanged). In `content/**/*.mdx`, only the wrong order is an error (`\d\s?₪`, or "ש״ח"/"ש"ח" after a number), so "₪119" in legal and blog text passes. State this in the rule row and in the `01:209` acceptance.

### N3. `business_tax_status = 'exempt'` is a supported mode, but the site, checkout and terms hard-code "חשבונית מס" and "כולל מע״מ" (MAJOR, conditional)
- **Where:**
  - **The mode:**
    - P6 §9.2 `06:686`: `receipt` (קבלה) without a VAT split;
    - setting `04:4810` (`licensed | exempt`);
    - admin toggle `03:2007`;
    - `{{COMPANY_ID}}` = "ח״פ או מספר עוסק" (`00:11`).
  - **Hard-coded claims:**
    - TrustRow `02:433` "חשבונית מס על כל תשלום";
    - promises `02:1428` "חשבונית מס לכל תשלום" plus "המחירים כוללים מע״מ";
    - pricing lead `02:1374`;
    - trust box `02:1531` "כולל מע״מ בשיעור {vatPercent}% … נשלחת חשבונית מס";
    - footer `02:309`;
    - Terms 6.1 and 6.6 `02:2110` and `02:2115` "על כל תשלום תונפק חשבונית מס";
    - FAQ `invoice-vat` `02:1989`;
    - `VatModeToggle` net prices `02:1394–1402`;
    - checkout disclosure `06:290` "חשבונית מס תישלח למייל";
    - receipt email VAT rows `06:1208–1209`;
    - the "ח״פ {{COMPANY_ID}}" label `02:308`, `02:2076`, `02:2179`, `06:1212`;
    - QS `:325`, `:556`, `:647`.
- **Why it is wrong:**
  - An עוסק פטור issues only a receipt and charges no VAT.
  - With `exempt` set, every one of these statements becomes false at the point of sale. That breaks Consumer Protection Law §2 and §17ב, and the pre-contract disclosure under §14ג.
  - Showing a VAT component or "לפני מע״מ" prices that the dealer does not collect is also a tax-law problem.
  - The "ח״פ" label is wrong for an individual dealer.
  - P6 itself notes the mode is unlikely (`06:686`, ⚖️ רו״ח), yet the parts make the coding agent build it as an admin toggle with no copy gating.
- **Fix:**
  - **Preferred: remove the mode.**
    - Delete the `exempt` row from P6 §9.2, the `business_tax_status` setting from P4 §16.4 (or pin it to `licensed`), and the toggle from P3 §22.17.
    - Change `00:11` and QS `:10` to: "`{{COMPANY_ID}}` — ח״פ או מספר עוסק מורשה. עוסק פטור לא נתמך: האתר מבטיח חשבונית מס ומחירים כולל מע״מ."
  - **Only if the owner insists on keeping `exempt`:**
    - Add `BRAND.legal.taxDocHe` ("חשבונית מס" | "קבלה"), `BRAND.legal.idLabelHe` ("ח״פ" | "ע״מ") and `pricesIncludeVat: boolean`, all derived from the setting at build time.
    - Make every string above take them as variables.
    - Hide `VatModeToggle` and the VAT rows when exempt.
    - Add a CI check that fails if `exempt` is set while any of these strings is hard-coded.

---

### Checked and found sound (no finding)
- **Cancellation wording:** P2 §7.7 `02:1529`, FAQ `cancel`, `/legal/cancellation` §1, P3 §15.5 (one screen, "רשות" reason, equal buttons) and P6 §10.1–10.2 agree. The 3-business-day rule and the refund of a charge that slipped through are stated (`02:2329`, `02:2332`).
- **14-day refund maths:** ₪98.17, ₪170.05 and ₪1,848 are re-computed and correct. "5% או ₪100, הנמוך" is consistent. The 4-month extended period wording matches §14ג1. Renewals are excluded only in the body (§3.1), and the summary carries "הנוסח המחייב" (`02:2060`).
- **Prices:** VAT-net (₪100.85, ₪80.51, ₪966.10, ₪50.00, ₪151.69, ₪380.51), per-credit (₪0.39, ₪0.36, ₪0.30), the ₪ column (₪7, ₪14, ₪31, ₪138) and the savings examples (₪4,281, ₪16,032, ₪5,152) are all correct. "חיסכון של 20%" is correct for all three plans.
- **Emails (P6 §12.5):** every second-person form is in the §12.6 select table. The R18 "מאת {x}" pattern is followed. `low_credits` is purely factual.
- **Errors:** `errors.*` (P3 §1.4/§23) is impersonal except the 2 documented exceptions. All 22 codes have a title and body. The new `byReason` copy matches R27.
- **Rule consistency:** banned phrases, gender slashes, maqaf and ICU plurals are clean across P2, P3, P6 and QS, and so is the seed (`--check` passes).
