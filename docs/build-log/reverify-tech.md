# Re-verify: technical, security and consistency (final, read-only)

**Lens:**
- **Data and API:** P4 DDL, RLS, function privileges and API contracts.
- **AI:** P5 OpenRouter calls and the pipeline.
- **Ops:** P6 billing, env and CI.
- **Canonical resolutions:**
  - R1: money units
  - R3: white label
  - R7: scenes
  - R8: credits
  - R9: function privileges
  - R10: consents
  - R12: seats
- **Quickstart:** consistency with the parts on plans, prices, models and routes.

**Scope:**
- `parts/00…06`, `parts/90-appendices-d-e.md` and `spec.md` (Appendix F).
- `/home/user/NewPlatform/PROMPT-QUICKSTART.md`.
- `/home/user/NewPlatform/seed/*`.
- Tie-breakers: `fix-plan.md` (R1–R40) and `integration-decisions.md`.

All line numbers come from `grep -n` on the current files (2026-10-13, after the 22:10 edits). Nothing was edited.

**Counts: 0 blocker · 1 major** (new). All 25 blocker and major items from the previous round are **FIXED**: 1 + 5 consistency, 9 technical and 10 Hebrew.

## Method

### Code, seeds and routes
- **Seeds:** I copied `seed/` and `docs/` to scratch and re-ran `python3 -I seed/scripts/build_seed.py` there.
  - The output is byte-identical to the repo: all 7 JSON files and `docs/03-hooks-library.md`.
  - Validation reports 0 errors and 0 warnings.
  - Counts: 13 / 36 / 8 / 27 / 25 / 326. These match P4 §16 acceptance, the QS and spec E7.
- **JSON blocks:** all 32 JSON code blocks in the parts parse.
- **P3 `errors` JSON:**
  - It covers all 22 codes, and each has a `body`.
  - It has the R27 `byReason` keys: `idempotency_key_reused`, `body_too_large`, `code_invalid`, `version_mismatch`, `bad_origin` and `request_in_progress`.
  - It has the `byLimit` keys `quality_tiers.byRequired` and `client_workspaces.{none|max}`.
- **API routes:** I cross-referenced every `/api/*` path in P0–P6, AppD/E, the spec and the QS against P4 §19–§24, with `[x]` and `a|b` expanded. Every remaining hit is an OpenRouter path or an admin route that exists in the P4 §24.1 table.
- **Env vars:** every `env.X` and `process.env.X` in every file, and every env var listed in the QS, is in P6 §20. The only one not in §20 is `NODE_ENV`, which is a platform variable.

### Quickstart against the parts (plans, prices, models, routes)
- **Plans and prices** match P4 §16.4 `plans.json`:
  - Monthly ₪119 / ₪289 / ₪990, and annual ₪95 / ₪231 / ₪792. The ×12 totals ₪1,140, ₪2,772 and ₪9,504 are right, and so is the 20% saving.
  - Credits 400 / 1,000 / 3,300, which gives ≈ 8 / 20 / 66 videos at 50 credits each.
  - Seats 1 / 1 / 3 / 10 and client workspaces 15.
  - Hook variants, concurrency and daily caps.
  - Packs 150/₪59 · 500/₪179 · 1500/₪449.
  - All 18 `credit_costs` rows.
- **Model routes:** the QS §8.2 table equals `model_routes.json` (P4 §16.5).
- **Money examples recomputed:**
  - With `FREE_VIDEO_SAMPLE`, the free plan's per-video cost is 30 credits (12 + 10 + 2 + 3 + 3), so 70 credits ≈ 2 videos.
  - The `lowThreshold` values are 30 / 60 / 150 / 495 (P6:241).

### Security and other items read by hand
- I read the §12 grants, policies and guards in P4.
- Functions I read in full:
  - the §9.2 helpers (R39 checks);
  - `accept_invite`, `change_member_role` and `invite_seat_guard`;
  - `_expire_due_grants`, `_return_to_grants` and `cap_rollover`;
  - `begin_spend`, `commit_spend` and `sweep_orphaned_spends`;
  - `claim_idempotency_key`, `create_job_and_reserve` and `get_credit_summary`.
- Webhooks: the P5 §5 verifier and callback, and the P4 §22.2 OpenRouter webhook.
- P6 §19 CI/CD and the staging flow.

---

## A. Previous round: blocker and major items

| ID | Item | Status | Evidence (current lines) |
|---|---|---|---|
| **C-B1** | `…Ils` meant both decimal shekels and agorot, giving 100× refunds and false `amount_mismatch` | **FIXED** | **Rule:** P6:50 states the two-unit rule, with an ESLint and type rule.<br>**Provider interfaces:** `VerifiedPaymentEvent.amountAg: Agorot \| null` (P6:569). `createHostedCheckout`, `chargeToken` and `refund` take `amountAg: Agorot` (P6:582-585).<br>**Internal types:** `PaymentRecord.amountAg/netAg/vatAg` (P6:664). `RefundQuote` uses `…Ag` (P6:828-850), and `toApiRefundQuote` converts with `toIlsNumber` (P6:853-856).<br>**Call sites:** refund step `amountAg: quote.refundAg` (P6:879). `p_amount_ils = fromAgorot(ev.amountAg)` (P6:294; P4:3139, 3160).<br>**API:** `PlanChangeResponse` and `RefundQuote` stay `*Ils` and are documented as decimal (P4:6166-6171, 6191-6199).<br>**Tests:** P6:892, 2021. |
| **C-M1** | Two `HookCardDTO` contracts | **FIXED** | **One flat contract** (P4:5967-5981) with `niche_icon`, `niche_short_name_he`, `why_it_works_he`, `secondary_type_slug`, `season_name_he` and `sample_poster_url`.<br>**RPC:** `search_hooks` returns those columns, with a `seasons` join (P4:3224-3269).<br>**Consumers:** P2 imports the contract and defines no local type (P2:979-982). P1 uses the flat contract (P1:1525, 1549). Variant `library` (P1:2476).<br>**Ordering:** `popular` order is rank, then featured, then popularity, then id (P4:3265, 6010). |
| **C-M2** | White label snapshot was never applied in client workspaces | **FIXED** | **Storage:** no branding column on `share_links` (P4:1374).<br>**SQL:** `effective_white_label` reads the billing workspace's toggle and plan limit (P4:1907-1915).<br>**Resolution:** `resolveShareBranding` runs on every render and every email send (P4:6067, 6070; P3:1259, 1267, 1275, 1744; P6:1071, 1101).<br>**Downgrade:** row in the P6 §5.4 table (P6:441).<br>**Tests:** e2e after downgrade (P3:1280), pgTAP (P4:6722). |
| **C-M3** | Attestation deadlock; flags not enforced on the server | **FIXED** | **Server rule:** P4:5836-5841 uses `assertAttestations` on the server-read script and `ATTESTED_FLAGS`, and `testimonial` requires both checks. It also runs in `regenerate` (P4:5849).<br>**UI:** the checkbox writes both fields (P3:724, 831).<br>**P5:** P5:3481-3483, 3527-3528. |
| **C-M4** | "ללא הגבלה" on approval links | **FIXED** | **UI:** 14 / 30 / 90 only (P3:1249, 1281).<br>**Contract:** comment at P4:6052-6054.<br>**DB:** check `share_links_approval_expires` (P4:1386). |
| **C-M5** | Free plan `planAllowance = 0` | **FIXED** | **SQL:** `nullif(pl.monthly_credits, 0)` (P4:2991, 3044).<br>**UI:** the ring is drawn only when `planAllowance != null` (P1:1382, 1394).<br>**Shared math:** one `perVideoCredits` / `videosLeft` / `lowThreshold` (P6:217-241), used at P3:258 and 611, P4:6476 and P6:1343-1352. |
| **T-M1** | Editors could write `scenes` directly | **FIXED** | **Grants:** `public.scenes` is in the server-only revoke (P4:3701).<br>**Policies:** only `scenes_select`; insert, update and delete are dropped (P4:3884-3887). P4:5776 restates this.<br>**Defense in depth:** `scenes_digest` with `assertScenesDigest` (P5:2895, 2985). |
| **T-M2** | Users could forge `consents` rows | **FIXED** | **Grants:** `public.consents` is in the server-only revoke (P4:3702), and there is no insert policy (P4:3951-3952).<br>**Writer:** `recordConsent()` with the `(kind, source)` allow-list and a narrowed `ConsentBody` (P4:6238-6261; P6:965).<br>**Test:** P6:1048. |
| **T-M3** | Interactive LLM credits lost on timeout | **FIXED** | **SQL:** `begin_spend` / `commit_spend` / `sweep_orphaned_spends` (P4:2779-2833).<br>**Flow:** P4:5733-5739. `maxDuration = 300` with `deadlineAt` at 240 s, `maxRetries: 0` and `AbortSignal.any` (P5:163-255, 355-396). No repair round when less than 30 s remain (P5:378).<br>**Timing:** `in_progress` lasts 6 min (P4:3351, 5428). Sweeper step at P4:6472 and P5:3072.<br>**§18.7 sentence corrected:** P4:5431. |
| **T-M4** | No global revoke of PUBLIC `EXECUTE` | **FIXED** | **0001:** global plus per-schema `alter default privileges` (P4:294-295).<br>**Text:** the §12.6 wording is corrected and the per-migration rule is stated, with a pgTAP allow-list (P4:4007-4009). Note: the 0009 and 0010 SQL samples show only the `grant`, without the explicit `revoke`. There is no exposure, because the defaults and the pgTAP allow-list cover them. |
| **T-M5** | Seat bypass via `update role` | **FIXED** | **Grants:** `revoke update on workspace_members` and no update policy (P4:3711, 3785).<br>**RPC:** `change_member_role` locks the billing row and re-checks seats (P4:2131-2172).<br>**Same lock in:** `accept_invite` (P4:2111), the invite trigger `invite_seat_guard` (P4:2178-2195) and `enforce_plan_limits` (P4:2255).<br>**Caller:** `changeMemberRole` uses the RPC (P4:6551). |
| **T-M6** | Credit expiry could hit a duplicate key | **FIXED** | **Expiry:** `credit_grants.expired_at` and `clock_timestamp()` (P4:2448-2465). `_return_to_grants` refills only live grants (P4:2471-2503).<br>**Cap:** `cap_rollover` with key `expire:cap:{grantId}:{ref}` (P4:2508-2546, 2424; P6:115, 207).<br>**Isolation:** `expire_credit_grants` runs a sub-block per workspace (P4:2897-2916).<br>**Test:** pgTAP at P4:6683. |
| **T-M7** | `low_credits` was advertising | **FIXED** | **Copy:** factual only, with no price, pack or plan pitch and the button "לעמוד החיוב" (P6:1341-1350).<br>**Classification:** P6:1011.<br>**`welcome` no-trial variant:** fixed too (P6:1152). |
| **T-M8** | Staging could not receive webhooks or run crons | **FIXED** | **Bypass:** added in staging only (P5:649-657, 714; P6:610, 2152).<br>**Crons:** `staging-crons.yml` and `CRON_SECRET_STAGING` (P6:2243, 2249, 2285, 2329-2330).<br>**`[M0-verify]`:** added (P0:130). |
| **T-M9** | Network restriction to "CI IPs" fails on hosted runners | **FIXED** | Network restrictions are off at launch, with compensating controls and an open item (P4:49; P6:1859, 2242). |
| **H-M1** | Free-trial claim without its limits | **FIXED** | **Wording:** credits wording in TrustRow and meta (P2:431, 725, 782; P3:382). "כ-2 סרטונים" always comes with "באיכות טיוטה, עם סימן מים" (P2:1396, 1407; P4:4730; QS:540).<br>**Empty state:** shown only to granted-trial users (P3:582). |
| **H-M2** | "הכי פופולרי" badge | **FIXED** | "מומלץ" (P1:1611; P2:696, 1554; QS:537). There is no "הכי פופולרי" outside the CI rule. |
| **H-M3** | "ביטול בלחיצה" | **FIXED** | There are 0 hits for בלחיצה in a cancellation context. The canonical wording is at P2:1529 and 1541, the QS and P3:382. |
| **H-M4** | Card-storage statement | **FIXED** | Canonical R20 wording at P2:1432, 1433, 1990 and 1993. |
| **H-M5** | "Free preview" claim | **FIXED** | P2:529-532 states `previewCredits`, and P3:901 says "לא עולה קרדיטים נוספים". |
| **H-M6** | Hyphen between a prefix letter and a Hebrew variable | **FIXED** | **Scan:** 0 hits for `[ובלמהשכ]-{{BRAND_NAME}}` and for prefix + `{…Name}` in all files.<br>**Rule and lint:** P1:74, 199. Watermark text "נוצר ב{{BRAND_NAME}}" (P1:2138). |
| **H-M7** | `vo_he` price with "שקל" | **FIXED** | AppD:346, 373 and 487 now read "ב-{מחיר} ₪". There are 0 hits for "ב-{מחיר} שקל" or "ב-149 שקל". |
| **H-M8** | Banned phrases, "/" between Hebrew letters, MDX doublings | **FIXED** | **Phrases:** "כדאי להתחיל לפרסם עכשיו" (P3:593) and "השלב הבא" (P3:1795).<br>**Invoice type:** "חשבונית מס-קבלה" (P3:1546), with 0 hits for "חשבונית מס/קבלה".<br>**Doublings:** file-level exemption at P1:198. |
| **H-M9** | Raw bidi marks in copy | **FIXED** | **Scan:** U+200E/U+200F/U+05BE inside `**"…"**` copy and in JSON blocks give 0 hits.<br>**Replacement:** `<ltr>` used at P2:406 and 1927. Rule at P2:187. |
| **H-M10** | Counts without ICU plural | **FIXED** | **Patterns:** canonical forms at P1:2256 and 2342-2458.<br>**Scan:** a regex for `{x} <Hebrew plural>` outside `plural` finds only false positives: allow-listed constants, `{planName}`, `{phone}` and similar. |

---

## B. New findings

### MAJOR N1 — The one-click unsubscribe must write a `consents` row, but the DB check allows no source value for it

**Where:**
- **The DB check.** `04-data-api.md:1444`:
  > `source text not null check (source in ('signup','settings','checkout','newsletter','cookie_banner','likeness_flow','generate'))`
- **Unsubscribe in P4.** `04-data-api.md:6264` (`POST /api/unsubscribe`):
  > "מוסיף `email_suppressions (reason 'unsubscribe')`, שורת `consents` עם `granted: false` לכל ערוץ שיווקי"
- **The only consent writer.** `04-data-api.md:6261` makes `recordConsent({ …, kind, granted, source, req })` the only writer. A source is mandatory.
- **Unsubscribe in P6.** `06-billing-legal-ops.md:1016`, rule 4:
  > "הסרה מטופלת מיד (`email_suppressions` + שורת `consents` עם `granted=false`)"
- **Acceptance test.** `02-marketing-site.md:2624` requires the `consents` row on `/unsubscribe`.

**Why it is wrong:**
- **No source fits.** No part says which `source` the unsubscribe row uses, and none of the 7 allowed values fits. `source` is `text` with a CHECK, not an enum, so `db:types` produces `string` and TypeScript cannot catch a wrong value.
- **Likely failure.** The natural choice, `source: 'unsubscribe'` (or `'email_link'`), fails with `23514 check_violation`. The RFC 8058 one-click POST and the `/unsubscribe` form then return 5xx. This is the opt-out channel that s.30A requires (P6 §11.8, R17 keeps "הסרה בלחיצה" as literally one click).
- **Exposure.** At best the suppression row persists and the person still sees an error. At worst everything runs in one transaction, the unsubscribe is lost, and later marketing mail is exposed to ₪1,000 per message.
- **Workarounds corrupt the record.** Picking `'newsletter'` or `'settings'` writes a false provenance into the consent log. P6 §11.4 calls that log the legal evidence.

**Owner:** P4 (DDL and the `recordConsent` contract), with P6 §11.4/§11.8 (the consent-log rules).

**Fix:**
1. **DDL.** In `04-data-api.md:1444`, add `'unsubscribe'` to the `consents.source` check. Server-only, like `generate`.
2. **Route.** In `04-data-api.md:6264`, state the call exactly:
   - For each `kind` in `marketing_email | marketing_sms | marketing_whatsapp`, call `recordConsent({ email, userId: <if the email maps to a profile>, kind, granted: false, source: 'unsubscribe', req })`.
   - Insert `email_suppressions` **first and independently**, so a consent-write error never undoes the opt-out.
   - Always answer 200.
3. **Consent table.** In the P6 §11.4 table (`06-billing-legal-ops.md:960`), add `unsubscribe` as the withdrawal source for `marketing_*`.
4. **`ConsentBody`.** Leave `ConsentBody.source` (P4:6242) unchanged. `unsubscribe` is never accepted from `POST /api/consents`.
5. **Tests.**
   - pgTAP: `insert … source = 'unsubscribe'` succeeds for the service role.
   - API test: a one-click POST to `/api/unsubscribe?token=` writes 1 suppression row and 3 `granted = false` consent rows with `source = 'unsubscribe'`, and returns 200.

---

## C. Checked and found correct (no new finding)

### Credits engine (R8, R13)
- **Locking:** `begin_spend` reserves on the billing workspace through `reserve_credits` with the daily cap. `commit_spend` is idempotent (`:capture` / `:settle`) and runs `capture_credits` and `settle_reservation` in one transaction under the balance lock. A late commit after a refund is a no-op (`status <> 'open'`).
- **Sweeper:** `sweep_orphaned_spends` isolates each row and keeps the 6-minute window consistent with `claim_idempotency_key`, the sweeper and the P4 §18.7 table.
- **Expiry:** `_expire_due_grants` and `cap_rollover` can no longer collide on keys. The prefix-dedupe offset is correct: `'expire:cap:'` is 11 characters plus a 36-character UUID plus `':'`, so `substr(…, 49)` starts at the ref.
- **Downgrade:** with cap 3,300, the "agency → starter with 2,000 left" case (P6:247) expires nothing, as the test expects.

### Privileges (R9, R39)
- **Policies:** every function used in RLS, storage and Realtime policies is granted to `authenticated`: `accessible_workspace_ids`, `workspace_ids_with_role`, `is_platform_admin`, `billing_workspace_id`, `storage_*` and `realtime_topic_allowed`.
- **Checked helpers:** `billing_workspace_id`, `workspace_plan` and `is_version_locked` return null to outsiders. The service and pg_cron paths are unaffected.
- **Signup:** `handle_new_user` and `grant_credits` run with `auth.uid()` null, so they are unaffected.
- **Seat checks:** they use the unchecked `_…` twins, which have no grants.

### White label (R3)
- **Service-only:** `effective_white_label` is called only from Server Components and email senders that use the secret client.
- **Client workspaces:** they follow the agency's toggle and its plan.

### Webhooks and OpenRouter
- `verifyOpenRouterSignature` has one owner (P5:669-689). It checks every `v1` value in constant time, uses a 300 s tolerance, and P4:6322-6353 only imports it.
- **Callback token:** `secretList` rotation.
- **Polling:** in preview, the in-workflow loop `waitForVideo` (P5:2802-2813) completes clips without crons.

### Pipeline (R30, R31, R32, R34, R38)
- `VIDEO_JOB_FAILED` is raised for more than 50% keyframe failures (P5:2933, 2983), with P3 copy (P3:96) and P6 `reasonHe` (P6:1185).
- **Sweeper (R31):** 120-minute cap, cancel before restart, `error_detail.restarts`.
- **Function durations (R32):** P5:2736 and P6:2271, 2280.
- **Fonts (R34):** `loadRenderFonts` runs only while rendering (P5:3089, 3317-3332).
- **Caching (R38):** `revalidateTag(tag, "max")` and `updateTag`. There are 0 single-argument calls.

### Billing contracts and seeds
- **Billing contracts:** `quoteToDb` sends decimal strings into jsonb, and `toApiPlanChange` includes `downgradeImpacts`.
- **Seeds:** all 12 planned hook rewrites, "ולנטיין (יום האהבה)", and `yoga-pilates` / `djs-musicians` short names are in the generated JSON, with 0 parenthesized hooks.
