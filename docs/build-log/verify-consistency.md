# Verify: cross-part consistency (read-only)

Scope: `parts/00…06`, `parts/90-appendices-d-e.md`, `spec.md` (Appendix F incl. §15 errata), `/home/user/NewPlatform/seed/*.json`, `integration-decisions.md` (tie-breaker), `docs/research/*` addenda.
Method: `python3 -I` scripts in `scratchpad/verify/` (`xref.py`, `xref2.py`, `ev.py`, `secref.py`, `selfref2.py`) + manual reading of every hit.

**Counts: 1 blocker · 5 major · 13 minor.**

## What was checked mechanically and passed (no finding)

- **API routes:** every `/api/*` path in P1–P3, P5, P6, AppD/E and the spec resolves to a P4 route (admin `[/id]` forms included). Third-party paths are written with a host.
- **Error codes:** the only codes used are the 22 in P4 `ERROR_CODES`. P3 §1.4 and the §23 JSON cover all 22.
- **Env vars:** every env-like token in all parts is in P6 §20, including the Vercel, CLI and CI groups. The 13 flags match P4 §16.4 and P6 §21.1. The 21 `app_settings` keys match, and every `app_settings.X` used anywhere exists.
- **Emails:** 26 email keys. Every template reference is in P6 §12.4. WhatsApp templates match §13.3.
- **Prompts and models:** 15 prompt IDs match D-130. Task keys match the `model_routes.json` seed, and the 22 registry slugs match `docs/research/04` (verification addendum).
- **Analytics:** every `event {props}` use in P2/P3/P5 matches P6 §14.2 (63 events). Every `location` value is in the P6 enums.
- **DDL:** every `table.column` reference across parts exists in P4 DDL. The enum count (36) matches.
- **Values that agree everywhere:** plan ids, prices, VAT-net values, credit costs, the 23/50/107/478 samples and the refund examples (P2 §10.5 = P6 §10.5, arithmetic re-done). Caption preset ids, WizardStep values, CTA types and the Realtime channels/events (`job:`/`workspace:`, `job.updated`/`step.updated`/`scene.updated`) also agree.
- **Keys and names:** Upstash keys, cookie names, the audit-action list and the pg_cron count (11) agree.
- **Seed files:** key order, enums, placeholders (17), slug and FK references, hook-id regex and suffix-₪ rule all match P4 §16.2. All 10 AppD `ScriptV1`/`StoryboardV1` JSON blocks validate against the P5 §11.1 JSON Schemas and the DB enums.
- **Section references:** every "חלק 0X §N" cross-reference (all parts) resolves to an existing section. Spike numbers (1–18) are consistent.

---

## BLOCKER

### B1. The `…Ils` suffix means "decimal shekels" in some contracts and "integer agorot" in others, so refunds can be 100× too large and payments falsely flagged `amount_mismatch`
- **Where:**
  - **Agorot:**
    - P6 `06-billing-legal-ops.md:528` `VerifiedPaymentEvent.amountIls: Agorot | null`.
    - `:621` `PaymentRecord.amountIls: Agorot; netIls: Agorot; vatIls: Agorot`.
    - `:783-784` `RefundQuote = { paidIls: Agorot; … consumedValueIls: Agorot; feeIls: Agorot; refundIls: Agorot }`.
  - **Decimal ILS:**
    - P6 `:539-542` `createHostedCheckout({ amountIls: number })`, `chargeToken({ amountIls: number })`, `refund({ amountIls: number })`. §5.3 `:372` passes `amountIls: Number(fromAgorot(q.chargeNow))`, which proves these take shekels.
    - P4 `04-data-api.md:2900` `billing_apply_payment(… p_amount_ils numeric …)`, compared with `checkout_sessions.amount_ils numeric(10,2)` (`:1205`).
    - P4 `:5882` API `RefundQuote { paidIls: z.number(), … refundIls: z.number() }` and `PlanChangeResponse.chargeNowIls/newPriceIls` (`:5904`).
- **Defect:**
  - P6 §10.6 step 3 (`:830`) says ``provider.refund({ providerTxnId, amountIls: refund, … })``, where `refund` is the agorot value from `quoteRefund`. `Agorot` is `number & {__brand}` and is assignable to `number`, so TypeScript accepts it. A ₪98.17 refund (9817 agorot) is sent as `amountIls: 9817`.
  - The same naming invites passing `ev.amountIls` (agorot) into `p_amount_ils`. Every checkout would then be flagged `amount_mismatch` and get no grant.
  - The API `RefundQuote` (P3 §15.5 renders `{paid}`/`{refund}` with `formatIls`) gets agorot if the route serializes P6's quote as is, so the UI shows ₪9,817.
- **Owner:** P6 (billing types); P4 (API/RPC contracts).
- **Fix:**
  1. Rename every Agorot-typed field to an `…Ag` suffix: `amountAg`, `netAg`, `vatAg`, `paidAg`, `consumedValueAg`, `feeAg`, `refundAg`, `chargeNowAg`, `newPriceAg`. Keep `…Ils` only for decimal shekels.
  2. Add a branded `Ils` type, or make provider params take `Agorot` and convert inside the adapter.
  3. P6 §10.6 step 3: `amountIls: Number(fromAgorot(quote.refundAg))`.
  4. P6 §4.1 step 5: `p_amount_ils: Number(fromAgorot(ev.amountAg))`.
  5. P4 §21.2: state "money fields in API JSON are decimal ILS (`fromAgorot`)".
  6. Add a unit test: refund of ₪98.17 calls `provider.refund` with `98.17`.

---

## MAJOR

### M1. Two incompatible `HookCardDTO` contracts; the public hook card needs fields the API and RPC never return
- **Where:**
  - P2 `02-marketing-site.md:963` defines `export type HookCardDTO` in `lib/hooks/dto.ts`, with nested objects:
    - `niche: { slug, name_he, short_name_he, icon }`
    - `type: { slug, name_he, family_slug, why_it_works_he }`
    - `secondary_type_slug`, `season: { slug, name_he }`, `sample_poster_url`
  - P4 `04-data-api.md:5692` defines `export const HookCardDTO = z.object({...})` in `lib/api/contracts/hooks.ts`. It is flat (`niche_slug, niche_name_he, hook_type_slug, hook_type_name_he, family_slug, season_slug, sample_video_url, popularity`) and has no icon, `short_name_he`, `why_it_works_he`, season name, poster or `secondary_type_slug`.
  - P1 `01-brand-design.md:1517` imports P4's version.
  - P4 `search_hooks` (§11.1, `:3006-3010`) returns only `n_name, t_name, fam…`.
- **Why wrong:** P2 §5.2 needs these fields to render the card: "למה זה עובד: `type.why_it_works_he`", a niche chip with `NicheIcon`, a season chip with its name, and the poster. P4 owns API contracts (P0 §5, D-070), yet the agent gets two different names, shapes and files for one DTO, and the server paths can't fill P2's.
- **Fix:**
  1. P4 §20.3: extend `HookCardDTO` with `niche_icon`, `niche_short_name_he`, `why_it_works_he`, `secondary_type_slug`, `season_name_he` and `sample_poster_url`.
  2. Add the same columns to the `search_hooks` return table, joined from `niches`, `hook_types` and `seasons`.
  3. P2 §5.1: delete the local type and import `HookCardDTO` from `@/lib/api/contracts/hooks`, then rewrite §5.2 field paths to the flat names.

### M2. Agency White label never applies inside client workspaces, and "applies to existing links" contradicts a per-link snapshot
- **Where:**
  - P3 `03-app-ux.md:1696` puts the toggle on the agency page, set by support via `PATCH /api/admin/workspaces/[id]/white-label`, and claims "חל על קישורים חדשים ועל קישורים קיימים". Acceptance (`:1707`): "/approve/[token] של לקוח מציג את הלוגו של הסוכנות ולא מכיל את {{BRAND_NAME}}".
  - P4 `04-data-api.md:5781` sets `show_branding = !workspace.white_label` when the link is created, and stores it in `share_links.show_branding` (`:1365`).
  - The link's `workspace` is the client workspace. `create_workspace` (`:1876`) does not copy `white_label` from the parent, so the client row is always `false`.
  - The flag also survives a downgrade: the P6 §5.4 effects table has no `white_label` row.
- **Why wrong:** The main White label use case (agency → client approval pages and emails) never works. Toggling later doesn't affect existing links, and a downgraded agency keeps unbranded pages.
- **Fix (P4):**
  1. Compute branding at render time: `show_branding = NOT (bw.white_label AND workspace_plan(bw).limits.white_label)` with `bw = billing_workspace_id(link.workspace_id)`.
  2. Drop the snapshot, or treat `share_links.show_branding` as an override only.
  3. Apply the same rule for the P6 §12.1 sender name.
  4. Add a `white_label` row to the P6 §5.4 downgrade table.

### M3. Testimonial and compliance attestations: server rule deadlocks non-testimonial videos and ignores `brief.attestations`
- **Where:**
  - P4 `04-data-api.md:5566` (generate step 3): "סרטון המלצה (`brief.testimonial` קיים, **או דגל `testimonial_requires_consent` בתסריט**) בלי `brief.testimonial.consent_attested = true` ← 422 MISSING_FACTS".
  - P3 `03-app-ux.md:675` shows the "ההמלצה" card (`brief.testimonial`) only when `video_type = testimonial`.
  - P3 `:775,786` turns the script flag into a checkbox stored in `brief.attestations` (kind `testimonial_requires_consent`). "בלי סימון — אי אפשר ליצור" is client-side only.
  - P5 `:3392` and AppE `:3338` say the flag requires a row in `brief.attestations`.
- **Why wrong:**
  - A `reel_hook`/`brand_promo` script that the LLM flags `testimonial_requires_consent` can never be generated. The user ticks the attestation, but the server checks `brief.testimonial.consent_attested`, which no UI can set for that type.
  - Conversely, no server-side check exists for `urgency_must_be_true`, `results_claim`, `price_claim`, `kashrut_claim` or `minors`. These are legal-truthfulness controls enforced only in the browser.
- **Fix (P4 §19.8 step 3):**
  1. Require `brief.testimonial.consent_attested = true` only when `video_type = 'testimonial'`.
  2. For every `ScriptV1.compliance.flags ∩ {testimonial_requires_consent, urgency_must_be_true, results_claim, price_claim, kashrut_claim, minors}`, require a matching `brief.attestations[].kind`.
  3. Otherwise return `422 MISSING_FACTS {facts:[<Hebrew label per flag>]}`. Add the labels to P3 §1.4.

### M4. The "ללא הגבלה" expiry option for client-approval links is impossible
- **Where:**
  - P3 `03-app-ux.md:1203` offers **"תוקף": 14 יום (ברירת מחדל) / 30 / ללא הגבלה** and sends `expiresInDays?`. For public links, P3 `:1198` says "בלי `expiresInDays` = ללא הגבלה".
  - P4 `04-data-api.md:5769` has `expiresInDays: z.number().int().min(1).max(90).optional(), // default: public_view never, client_approval 14`.
- **Why wrong:** Choosing "ללא הגבלה" on an approval link silently creates a 14-day link. The client's link dies while the agency believes it is permanent.
- **Fix:** One of:
  - P4: `expiresInDays: z.number().int().min(1).max(90).nullable().optional()`, where `null` means never (both kinds) and omitted means the per-kind default.
  - P3: drop "ללא הגבלה" from the approval tab and offer 14/30/90.

### M5. Free plan returns `planAllowance = 0`, not `null`, so the low-credit banner never fires and the meter ring divides by zero
- **Where:**
  - P4 `04-data-api.md:2755` `get_credit_summary` returns `(select pl.monthly_credits from workspace_plan(v_b) pl)`. For `free` that is `0` (seed `:4462`).
  - P1 `01-brand-design.md:1376,1381` declares `planAllowance: number | null` with "lowThreshold default: 15% of planAllowance, or 30 credits **when planAllowance is null**". The ring is `balance / planAllowance`.
  - P3 `03-app-ux.md:216` shows the banner when `balance < lowThreshold`.
- **Why wrong:** For every free or trial user (the largest cohort) `lowThreshold = 0`, so the "קרדיטים נמוכים" banner and `credits_low_shown` never fire. The pill ring computes `x/0`.
- **Fix:** One of:
  - P4: `nullif(pl.monthly_credits, 0)` and document "null = no monthly allowance".
  - P1: treat `0` like `null`.
- Also see m12 (email and app use different thresholds and per-video math).

---

## MINOR

### m1. Appendix F errata contradict the parts
- **Where:**
  - `spec.md:1260` E18: "the admin invoice upload (multipart, **10 MB**)". P4 `:4876`, `:6223` and P6 `:697`, `:2207` cap it at **4MB** because of Vercel's 4.5MB body limit.
  - `spec.md:1257` E15: `POST /api/share → 201 { url, shareLinkId, expiresAt }`. P4 `:5623` adds `emailSent`.
- **Fix:** E18: "multipart, PDF ≤ 4 MB (Vercel 4.5 MB body limit)". E15: add `emailSent`.

### m2. P3 `errors` JSON does not match its own rules
- **Where:** `03-app-ux.md:2002-2020`.
- **Defect:**
  - `PLAN_LIMIT` has no `body`, but the acceptance at `:257` requires `title` and `body` for all 22 codes.
  - The `byLimit` keys `quality_tiers_premium`/`quality_tiers_standard` and `client_workspaces_plan`/`client_workspaces_max` are not values of `details.limit`. The server sends `limit:"quality_tiers", required:"business"` (a plan id, P4 `:5590`), and no mapping rule is given.
- **Fix:** Add `PLAN_LIMIT.body`, then one of:
  - key the variants by what the server sends (`byLimit.quality_tiers.byRequired.{starter|business}`, `byLimit.client_workspaces.{none|max}`);
  - add an explicit mapping table in §1.5.

### m3. Error `reason` values thrown by P4 have no P3 copy
- **Where:**
  - P4 `:2701`, `:5140`, `:5165` `INVALID_INPUT {reason:"idempotency_key_reused"}`.
  - P4 `:5051` `{reason:"body_too_large"}`.
  - P4 `:5050` `FORBIDDEN {reason:"bad_origin"}`.
  - P4 `:5848` / P6 `:1443` `{reason:"code_invalid"}` (P6 has the text "הקוד לא נכון או שפג תוקפו.").
  - None of these is in P3 `errors.*.byReason` (`03-app-ux.md:115-140`, JSON `:2002+`).
- **Why wrong:** `FORBIDDEN`'s generic body "הפעולה זמינה ל{roles}…" has no `requiredRoles` for `bad_origin`, so the UI renders a broken sentence.
- **Fix:** Add `INVALID_INPUT.byReason.{idempotency_key_reused, body_too_large, code_invalid}` and `FORBIDDEN.byReason.bad_origin` ("הבקשה נחסמה מטעמי אבטחה. רעננו את הדף ונסו שוב."). Add a unit test that every `reason` literal in `lib/**` has a `byReason` key.

### m4. The hook-of-the-day cron picks the wrong day and the wrong taxonomy level
- **Where:** P4 `04-data-api.md:6179`: "בחירת הוק **למחר** (תאריך ישראלי) … ביום שקט (מחר) — רק הוק אוניברסלי … **מסוג** `education`". Schedule `2 22 * * *` UTC (`:6163`).
- **Why wrong:**
  - 22:02 UTC is 00:02/01:02 Israel time, already the new Israeli day. Picking "tomorrow" stores `date` = D+1 during day D. P2 `:1119` shows "הוק היום · {date}" with tomorrow's date, and the quiet-day check runs one day off (Memorial Day sensitivity).
  - `education` is a hook **family** in `seed/hook_families.json`, not a type, and P2 `:1118` says "ממשפחת `education`". A `hook_type_slug='education'` query returns nothing.
- **Fix:** "בחירת הוק **להיום** (התאריך הישראלי בזמן הריצה)", and "ממשפחת `education` (`hook_types.family_slug = 'education'`)".

### m5. Browser-storage rules and disclosures are incomplete
- **Where:**
  - P3 `03-app-ux.md:33`, `:77`, `:344` use `sessionStorage['reauth_draft_v1']` (form drafts) and `sessionStorage['signup_marketing_v1']`.
  - D-285 and spec E46 list only the localStorage keys. The P2 cookie policy `02-marketing-site.md:2294` says "**אין מידע נוסף בדפדפן**".
  - P3 `:76` and `:200` copy "השינויים נשמרים אצלכם" / "**נשמר במכשיר.** נשלח כשהחיבור יחזור", but no persistent store is allowed for the offline queue.
- **Why wrong:** The legal page is inaccurate. The UI promises device persistence that closing the tab would lose.
- **Fix:**
  - P2 §10.4 section 3: list the two sessionStorage keys ("נמחקים בסגירת הלשונית").
  - P3: change the copy to "השינויים יישלחו כשהחיבור יחזור. אל תסגרו את הלשונית." or explicitly allow an IndexedDB/localStorage key and list it in D-285, P2 and AppF E46.

### m6. Hebrew copy: "מספיקים **לבערך** שני סרטונים" is ungrammatical
- **Where:** P2 `02-marketing-site.md:421` (TrustRow footnote) and `:1956` (FAQ `free`).
- **Fix:** "מספיקים **בערך לשני** סרטונים קצרים…" (or "לכשני סרטונים").

### m7. P6 L-01 points to the wrong test section
- **Where:** `06-billing-legal-ops.md:859` "axe בכל דף (§18.6)". §18.6 is "RLS ובידוד"; axe is §18.5.
- **Fix:** Change to §18.5.

### m8. P6 says contract-level Zod enums are imported from the DB enums module
- **Where:** `06-billing-legal-ops.md:1574` "WizardStep, … CancelReason, …: imported from lib/supabase/enums.ts and lib/errors.ts".
- **Why wrong:** `WizardStep` is a Zod enum in `lib/api/contracts/common.ts` (P4 `:5211`) and `CancelReason` is in `lib/api/contracts/billing.ts` (`:5878`). Neither is a DB enum.
- **Fix:** Name the correct modules.

### m9. `VIDEO_JOB_FAILED` copy describes a failure mode P5 never produces
- **Where:**
  - P3 `03-app-ux.md:94`: "מנועי הווידאו נכשלו ביותר מחצי מהסצנות… או לעבור לתמונות בתנועה".
  - P5 `05-ai-pipeline.md:2867-2880`: clip failures always degrade per scene; >50% **keyframe** (image) failures raise `PROVIDER_UNAVAILABLE`. No path raises `VIDEO_JOB_FAILED`.
  - P6 `:1132` emails that case as "עומס זמני אצל ספק **הווידאו**".
- **Fix:** One of:
  - P5: raise `VIDEO_JOB_FAILED` for the >50% keyframe rule;
  - P3/P6: reword so it fits image failures and drop the "switch to images" advice.

### m10. Hook search ordering and parameter types differ between P2 and P4
- **Where:**
  - P2 `:993`: "`popular` לפי `hook_popularity.score`… בתוך תיקו — `is_featured` קודם". P4 `:2942`, `:3016` order by `rnk, is_featured, pop, id`, so featured comes before score.
  - P2 `HookFacets.featured/has_video: boolean` (`:984`) vs P4 `z.enum(["1"])` (`:5686-5687`).
- **Fix:** Align P2 with the P4 RPC order and use the `"1"` string params.

### m11. Analytics `location` values are ambiguous for the same page
- **Where:**
  - On `/hooks/[niche]`, P2 `:1157` sends `hook_copied {location:"hook_niche_page"}` but `hooks_searched` and `faq_expanded` with `location:"niche_page"`.
  - On `/niches/[niche]`, `:760` and `:769` use `niche_page` for those events.
  - P6 §14.2 `hooks_searched` and `faq_expanded` have no `hook_niche_page` value.
- **Why wrong:** The library→signup funnel (P2 §14 #1, P6 §14.4) can't separate the two page types.
- **Fix:** Add `hook_niche_page` to the `hooks_searched.location` and `faq_expanded.location` enums in P6 §14.2/§14.3, and use it in P2 `:1157`.

### m12. "≈ N videos" and the low-credit thresholds use three different formulas
- **Where:**
  - P3 `03-app-ux.md:566`: `perVideo = estimateSample(FREE_VIDEO_SAMPLE)` (30) on free, `typical_video_credits` (50) on paid, "אחיד בכל האפליקציה".
  - P6 `low_credits` email `:1297`: `videosLeft = floor(balance / typical_video_credits)` for all plans.
  - P4 `/api/cron/reminders` (`:6180`): trigger is `< typical_video_credits` or `< 15%`, unlike P1's banner threshold.
- **Why wrong:** A free user with 40 credits sees "מספיק בערך לסרטון קצר אחד" in-app and "פחות מסרטון קצר אחד" in the email.
- **Fix:** Export one `videosLeft(balance, planId)` and one `lowThreshold(summary)` from `lib/billing/credits.ts`, and reference them from P1 §10.9, P3 §5.7, P4 §23 and P6 §12.5.

### m13. P1 and P2 name the full `HookCard` variant differently, and other small length and placeholder mismatches remain
- **Variant name:** P1 `01-brand-design.md:1522` uses `variant: "library" | …`, but P2 `:1026-1027` names the full variant `default`. P2 should use `library`, the P1 type.
- **End-card headline length** differs per part:
  - AppE `90-appendices-d-e.md:3228`: 6 words, ≤ 30 chars.
  - P5 `:1957`: Zod max 50.
  - P3 `:868`, `:1395`: "עד 8 מילים".
  - P4 `RenderOptions` `:5314` and `brief.cta.headline_he` `:5287`: max 60.
  - Fix: use the AppE limit (6 words / 30 chars) in all four places.
- **`{{DPO_NAME}}`:** P0 `00-header.md:15` says it may stay empty, and then the sentence is hidden. P6 `:2324` makes `check-content --launch` fail on any unfilled §20.1 variable except `VERCEL_TEAM_SLUG`. Fix: add `{{DPO_NAME}}` as an explicit exception ("ריק מותר").
