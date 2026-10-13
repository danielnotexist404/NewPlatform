# Fix plan — verification round 1

**Inputs:**
- `verify-consistency.md` (C-*): 1 blocker, 5 major, 13 minor.
- `verify-technical.md` (T-*): 9 major, 11 minor.
- `verify-hebrew.md` (H-*): 10 major, 22 minor.

**Method:** I checked every finding against the cited lines with `grep -n`/`sed -n`. Seed files were checked with `python3 -I`. Owner parts and `integration-decisions.md` were the tie-breakers. Parts beat `spec.md`.

**Outcome:**
- Valid: 69 findings.
- Duplicates merged: 2 (T-m7 → C-m4; H-m1 → C-m6).
- Dropped in full: 0.
- Sub-claims dropped or corrected: 3 (T-M5 race, H-m4 breadcrumbs, H-m15 code). Section 1 explains each.

**How to read the edits:**
- Each edit gives an anchor, meaning a quoted text or line number from the current file (line numbers are from 2026-10-13 20:13).
- Each edit then gives the replacement or the intent.
- `Rn` refers to a canonical resolution in §0. Apply the canonical text exactly wherever it is cited.
- Section **FSPEC** covers `spec.md` (Appendix F). Section **SEED** covers `/home/user/NewPlatform/seed/*.json`, which is required as soon as F04-E33 tightens the seed checker.

---

## §0. Canonical resolutions (single source for every edit below)

### R1 — Money units (C-B1)

**Decision:** two units. Each unit has a mandatory name suffix, and conversion happens only at named boundaries.

| Unit | Type | Name suffix | Where it lives |
|---|---|---|---|
| **Decimal shekels** (2 dp, VAT-inclusive unless the name says `net`) | SQL `numeric(10,2)` · TS `number` | `_ils` (SQL) · `Ils` (TS/JSON) | DB columns (unchanged, all 25 `*_ils` columns of P4 DDL) · RPC params `p_*_ils` · **API JSON** (`RefundQuote.*Ils`, `PlanChangeResponse.chargeNowIls/newPriceIls`, admin bodies `{amountIls}`, `refundIls?`) · UI (`Price.amountIls`, `formatIls(amount)`) · analytics (number only) |
| **Integer agorot** | TS `Agorot` (branded) | `Ag` | Only server code in `lib/billing/**` and `lib/invoicing/**`, **and the public interfaces of `PaymentProvider`/`InvoiceProvider`** |

**Justification:**
- DB, API contracts and UI already use decimal ILS everywhere. That means 25 DDL columns, P1 `Price`/`formatIls`, and the P3/P4 contracts. Keeping them means the least churn and no seed or RPC rewrite.
- Billing arithmetic stays integer (P6 rule 1).
- Putting `Agorot` on the provider interfaces means a plain `number` (shekels) can no longer be passed by mistake, because `number` is not assignable to the brand. The Grow adapter converts internally, at the one place where the wire format is known.

**Conversion helpers** (`lib/billing/money.ts`):
- `toAgorot(ils: string | number): Agorot` (exists): use it for DB/API/provider → internal.
- `fromAgorot(a): string` (exists): use it for internal → DB/RPC and provider wire.
- **NEW** `toIlsNumber(a: Agorot): number` = `Number(fromAgorot(a))`: use it for internal → API JSON.

**Renames (every one is mandatory):**

| Old | New | File/§ |
|---|---|---|
| `VerifiedPaymentEvent.amountIls: Agorot \| null` | `amountAg` | P6 §8.1 |
| `PaymentProvider.createHostedCheckout({ amountIls: number })` | `{ amountAg: Agorot }` | P6 §8.1 |
| `PaymentProvider.chargeToken({ amountIls: number })` | `{ amountAg: Agorot }` | P6 §8.1, §4.2 step 3, §5.3 |
| `PaymentProvider.refund({ amountIls: number })` | `{ amountAg: Agorot }` | P6 §8.1, §10.6 step 3 |
| `PaymentRecord.amountIls / netIls / vatIls` | `amountAg / netAg / vatAg` | P6 §9.1 |
| `InvoiceLine.unitPriceGross` | `unitPriceGrossAg` | P6 §9.1 |
| `PlanChangeQuote.chargeNow / newPrice` | `chargeNowAg / newPriceAg` | P6 §5.3 |
| `RefundQuote.paidIls / consumedValueIls / feeIls / refundIls` | `paidAg / consumedValueAg / feeAg / refundAg` | P6 §10.5 |
| `quoteRefund` input `payment.amount / payment.refunded` | `payment.amountAg / payment.refundedAg` | P6 §10.5 |
| `p_quote: q` (raw TS quote into jsonb) | `p_quote: quoteToDb(q)` → `{ charge_now_ils: "98.17", new_price_ils: "…", credits_granted_now, effective_at, new_cycle }` (decimal strings) | P6 §5.3, P4 §10.8 |

**API serializers:**
- `toApiRefundQuote(q)` and `toApiPlanChange(q)` map `*Ag` → `*Ils` via `toIlsNumber`.
- The P4 Zod contracts keep their current `*Ils: z.number()` names.

**Lint and test:**
- ESLint/type-test in `lib/billing/**`, `lib/invoicing/**`: a property typed `Agorot` must end in `Ag`, and a property ending in `Ils` must not be `Agorot`.
- Unit test 1: a ₪98.17 refund → `provider.refund` receives `amountAg: 9817` → Grow request `sum: "98.17"`.
- Unit test 2: a checkout event `amountAg: 28900` vs session `amount_ils = 289.00` → not `amount_mismatch`.
- Unit test 3: API `RefundQuote.refundIls === 98.17`.

### R2 — One `HookCardDTO` (C-M1, C-m10, C-m13 variant)

**Single contract:** P4 §20.3, `lib/api/contracts/hooks.ts`, flat. Keep the current fields and add these:
- `niche_short_name_he: z.string().nullable()`
- `niche_icon: z.string().nullable()` (lucide name)
- `why_it_works_he: z.string().nullable()` (from `hook_types`)
- `secondary_type_slug: Slug.nullable()`
- `season_name_he: z.string().nullable()`
- `sample_poster_url: z.url().nullable()`

**`search_hooks` changes:**
- The return table adds `niche_short_name_he text, niche_icon text, why_it_works_he text, secondary_type_slug text, season_name_he text`.
- Join: `left join public.seasons s on s.slug = b.season_slug` and select `n.short_name_he, n.icon, t.why_it_works_he, b.secondary_type_slug, s.name_he`.

**Poster:**
- `public-media/hooks/{hook_id}.jpg`: the first frame at 1.0 s, written by the admin sample-video upload.
- The mapper `toHookCardDTO(row)` derives `sample_poster_url` from `sample_video_path` (same basename, `.jpg`). It is `null` when there is no video.

**P2 and P1:**
- P2 deletes its local `HookCardDTO`/`HookFacets` and imports `HookCardDTO`, `HookSearchQuery` from `@/lib/api/contracts/hooks`.
- P2 field paths become: `type.name_he`→`hook_type_name_he` · `type.why_it_works_he`→`why_it_works_he` · `niche.icon`→`niche_icon` · `niche.short_name_he`→`niche_short_name_he` · `niche.name_he`→`niche_name_he` · `niche === null`→`niche_slug === null` · `season.name_he`→`season_name_he`.
- `featured`/`has_video` are `"1"` strings (P4).
- `popular` ordering is the P4 one: relevance (when `q`), then `is_featured`, then `hook_popularity.score`, then `id`.
- The full card variant is named `library` (P1), never `default`.

### R3 — White label resolved at render/send time (C-M2)

**SQL:** new `public.effective_white_label(p_ws uuid) returns boolean` (security definer, `search_path=''`, service_role only):

```sql
declare bw uuid := public.billing_workspace_id(p_ws);
begin
  return coalesce((select w.white_label from public.workspaces w where w.id = bw and w.deleted_at is null), false)
     and coalesce(((select pl.limits from public.workspace_plan(bw) pl)->>'white_label')::boolean, false);
end
```

**Removals:**
- Drop the column `share_links.show_branding`.
- Drop the rule "`show_branding = !workspace.white_label`".

**`lib/share/branding.ts` → `resolveShareBranding(link)`:** returns `{ whiteLabel: effective_white_label(link.workspace_id), senderName, senderLogoUrl }`.
- `senderName` is the billing (agency) workspace name for client workspaces, and otherwise the workspace's business name.
- `senderLogoUrl` is the logo of the billing workspace's default brand kit.

**Called by:**
- `/v/[token]` and `/approve/[token]`, at every render.
- `client_approval_request` and the approval-result emails, at send time (sender name and footer, P6 §12.1).

**Consequences:**
- Toggling White label and plan downgrades affect existing links immediately.
- The P3 sentence "חל על קישורים חדשים ועל קישורים קיימים" becomes true.

**Tests:**
- e2e: a client workspace of an agency with WL shows the agency logo and no `{{BRAND_NAME}}`.
- e2e: after a downgrade, the same link shows branding.
- pgTAP: `effective_white_label` returns false when the plan limit is false.

### R4 — Attestations enforced on the server (C-M3)

P4 §19.8 step 3 (and the same check in `…/scenes/[sceneId]/regenerate`), evaluated on the version being generated, which the server reads from `project_versions.script`:
1. `projects.video_type = 'testimonial'` requires `brief.testimonial.consent_attested = true` (D-405) **and** an attestation of kind `testimonial_requires_consent`.
2. Let `flags = script.compliance.flags ∩ ATTESTED_FLAGS`, where `ATTESTED_FLAGS = [testimonial_requires_consent, urgency_must_be_true, results_claim, price_claim, kashrut_claim, minors]`. Each of these flags needs a `brief.attestations[]` row with the same `kind`. The server overwrites `by` with the current user (existing rule) and requires `at ≤ now()`.
3. When something is missing, return `422 MISSING_FACTS { facts: [label…] }`. The labels come from `ATTESTATION_LABELS_HE` (`lib/compliance/attestations.ts`):

| Flag | Label |
|---|---|
| `testimonial_requires_consent` | "אישור בכתב מהלקוח על השימוש בהמלצה" |
| `urgency_must_be_true` | "אישור שההגבלה בזמן או בכמות אמיתית" |
| `results_claim` | "אישור שהתוצאה מבוססת על נתונים אמיתיים" |
| `price_claim` | "אישור שהמחיר נכון ומעודכן" |
| `kashrut_claim` | "אישור שיש תעודת כשרות בתוקף" |
| `minors` | "הסכמה בכתב של ההורים" |

A `reel_hook`/`brand_promo` script flagged `testimonial_requires_consent` now passes once the checkbox (stored in `brief.attestations`) is ticked.

### R5 — Approval links always expire (C-M4)

This is the safer option.
- **Approval tab options:** **"14 יום (ברירת מחדל) · 30 יום · 90 יום"**. There is no "ללא הגבלה".
- **Public tab:** unchanged.
- **P4 `ShareCreateBody` comment:** "omitted → `public_view`: never; `client_approval`: 14. `client_approval` is 1–90 days; a never-expiring approval link does not exist."

### R6 — Free-plan allowance and one formula for "videos left" and the low threshold (C-M5, C-m12)

**`get_credit_summary`:** returns `nullif(pl.monthly_credits, 0)`, where `null` = no monthly allowance (free).

**NEW `lib/billing/credits.ts`** (owner P6):
- `perVideoCredits(planId)`:
  - free → `estimateSample(FREE_VIDEO_SAMPLE)` (30 with the seed);
  - paid → `app_settings.typical_video_credits` (50).
- `videosLeft(balance, planId) = floor(balance / perVideoCredits(planId))`.
- `lowThreshold(summary, planId)`:
  - `summary.planAllowance == null` → `perVideoCredits(planId)`;
  - otherwise → `max(perVideoCredits(planId), ceil(0.15 × planAllowance))`.

**Used by:**
- P1 `CreditsMeter`. The ring is drawn only when `planAllowance != null`; otherwise the pill shows the number only.
- The P3 §1.7 banner and P3 §5.7.
- P4 `/api/cron/reminders` (`balance < lowThreshold`).
- The P6 `low_credits` email.

### R7 — `scenes` are server-written only (T-M1)

**Grants and policies:**
- Add `public.scenes` to the P4 §12.2 "server-only writes" revoke list.
- Drop the policies `scenes_insert`, `scenes_update` and `scenes_delete`. Keep `scenes_select`.
- Scene writes happen only in the P4 §19.6 routes (and P5 steps), with the secret client, **after** `is_version_locked(version_id)` and edit moderation.

**Defense in depth (P5):**
- `startJob` computes `scenes_digest` = sha256 over the ordered `(id, index, is_hook_scene, image_prompt_en, motion_prompt_en, onscreen_text_he, vo_he)` of the version and stores it in `jobs.options.scenes_digest`. This happens after the generate-time moderation in P4 §19.8.
- The steps `keyframe:*`, `clip:*`, `voice` and `render:*` recompute the digest before calling a model.
- On a mismatch: `failJob(INTERNAL_ERROR)` with a full refund and the admin alert `scenes_changed_during_job`. `duration_ms`/`start_ms` are excluded because the captions step rewrites them.

**Test:** pgTAP shows that an `authenticated` insert, update or delete on `scenes` is denied.

### R8 — Interactive LLM credits: reserve → capture, deadlines inside `maxDuration`, orphan sweeper (T-M3)

**SQL (P4 §10.3):** replace `spend_credits` with two functions, both `security definer` and service_role only:
- `begin_spend(p_ws, p_amount, p_action_key, p_ref, p_idem, p_daily_cap default null) returns uuid`:
  - `reserve_credits` on the billing workspace, then set `action_key`/`ref`;
  - the status stays `open`;
  - amount 0 → `null`.
- `commit_spend(p_reservation uuid, p_idem text)`:
  - captures the full amount (`p_idem||':capture'`), then settles (`p_idem||':settle'`);
  - it is idempotent.

**Flow:** gates → `begin_spend` → model call(s) → persist version/hooks → `commit_spend` → `complete_idempotency_key`. Any error leads to `refund_reservation(res, 'refund:'||res, 'הפעולה נכשלה. הקרדיטים הוחזרו.')`.

**Deadlines:**
- Interactive AI routes get `maxDuration = 300`.
- `RunContext.deadlineAt` = request start + 240 000 ms.
- Per-attempt timeout = `min(POLICY[endpoint].timeoutMs, deadlineAt − now − 5 000)`.
- No new attempt and no `repairOnce` when less than 30 s remain. The route then fails and refunds.
- Every AI SDK call (`generateText`/`streamText`/`generateObject`/`streamObject`) sets `maxRetries: 0`. Our loop and OpenRouter `models[]` do the retrying.
- `abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(deadlineAt − now)])`.

**Idempotency:**
- `in_progress` is treated as live for **6 minutes** (`maxDuration` + 60 s). That gives `claim_idempotency_key` `interval '6 minutes'` and the P4 §18.7 table "פחות מ-6 דקות".

**Sweeper (`/api/cron/sweep-jobs`, new step "orphaned interactive spends"):**
- `credit_reservations` where `job_id is null and status = 'open' and created_at < now() - interval '6 minutes'` → `refund_reservation(id, 'refund:'||id, 'הפעולה לא הושלמה. הקרדיטים הוחזרו.')`.
- `api_idempotency_keys` that are `in_progress` and older than 6 minutes → `failed`.
- If the function was killed after persisting but before `commit_spend`, the user keeps the output free. That is fail-safe by design.

**P4 §18.7 last sentence becomes:** "…ניסיון חוזר עם אותו מפתח מקבל `attempt + 1` ומפתח קרדיטים חדש; השמירה של הניסיון הקודם הוחזרה ב-catch, או על ידי ה-sweeper (§23) אם הפונקציה נקטעה."

### R9 — Function `EXECUTE` privileges (T-M4)

1. 0001 runs both the global and the per-schema form:
   - `alter default privileges revoke execute on functions from public;` (global; removes the PUBLIC default for functions created by the migration role);
   - `alter default privileges in schema public revoke execute on functions from public, anon, authenticated;` (kept for Supabase's per-schema grants).
2. Every migration from 0009 on ends with an explicit `revoke execute on function … from public, anon, authenticated;` for each function it creates, before its own `grant`.
3. pgTAP **allow-list test**:
   - It selects every `public` function where `has_function_privilege('anon', oid, 'execute')` or `('authenticated', …)`.
   - The set must equal exactly the §12.6 allow-list plus `storage_ws`, `storage_upload_allowed`, `realtime_topic_allowed` and `change_member_role` (R12).
4. Rewrite the §12.6 sentence that claims 0001's default "דואגת שהן ייווצרו פרטיות". The truth is "הן נוצרות פרטיות בזכות ה-revoke הגלובלי ב-0001 וה-revoke המפורש בסוף כל מיגרציה; בדיקת ה-allow-list אוכפת".

### R10 — Consents are written by the server only (T-M2)

**Grants and policies:**
- Add `public.consents` to the server-only revoke list.
- Drop `consents_insert_own`. Keep `consents_select_own`.

**`lib/consents/record.ts` → `recordConsent({ userId, workspaceId?, email?, kind, granted, source, req })`:**
- It uses the secret client.
- `ip` comes from `ipAddress(req)` and `user_agent` from the header.
- `created_at = now()` and `version = LEGAL_VERSIONS[kind]`. A client-sent version is validated equal, or rejected with `400 INVALID_INPUT {reason:"version_mismatch"}`.

**`POST /api/consents` allow-list of `(kind, source)`:**
- `marketing_email|marketing_sms|marketing_whatsapp` × `settings|signup|newsletter`.
- `analytics_cookies` × `cookie_banner|settings`.
- Everything else → 400.

**Where the other consent kinds are written:**
- `terms`/`privacy` at signup are written by `ensureFirstLogin` (server).
- `terms` with source `checkout` is written by the checkout route.
- `biometric_*` is written only by the likeness route (v2).
- `ai_content_policy` is written only by `generate`.

**`ConsentBody` narrows:**
- `kind: z.enum(["marketing_email","marketing_sms","marketing_whatsapp","analytics_cookies"])`
- `source: z.enum(["signup","settings","newsletter","cookie_banner"])`

**Test:** pgTAP shows that an authenticated INSERT into `consents` is denied.

### R11 — `low_credits` stays transactional, with the promotion stripped (T-M7)

This is a service notice about the account. It carries no price, pack, plan pitch or purchase CTA, so it needs no consent, no "פרסומת:" prefix and no s.30A unsubscribe. It keeps the existing opt-out from notification settings. ⚖️ lawyer check.

**Canonical copy:**
- **נושא:** "נשארו {balance, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}} ב{{BRAND_NAME}}"
- **Preheader:** "{videosLeft, plural, =0 {פחות מסרטון קצר אחד} one {בערך סרטון קצר אחד} other {בערך # סרטונים קצרים}}. עדכון על היתרה בחשבון."
- **H1:** "היתרה נמוכה"
- **גוף:**
  - "שלום {firstName},"
  - "ביתרה של "{workspaceName}" נשארו {balance, plural, …} — {videosLeft, plural, =0 {פחות מסרטון קצר אחד} one {בערך סרטון קצר אחד} other {בערך # סרטונים קצרים}}."
  - subscription: "המכסה החודשית ({monthlyCredits} קרדיטים) מתחדשת ב-{resetDate}."
  - free: "בתוכנית החינמית אין מכסה חודשית."
- **כפתור:** "לעמוד החיוב" → `/app/billing` (no `?topup`)
- **הערה:** unchanged opt-out line.

**Removed:** the "כדי להמשיך בלי לחכות: חבילת קרדיטים…" line, `minPackPrice`, `nextPlanName`, `nextPlanCredits`, `?topup=pack-500`.

**`welcome` variant with no trial:** "טוב שהגעתם. הפעם החשבון נפתח בלי קרדיטי ניסיון, כי {reasonHe}. פרטים על קרדיטים ותוכניות נמצאים בעמוד החיוב."

### R12 — Seats: role changes only through an RPC with a lock (T-M5)

**Grants:**
- Revoke `grant update (role) on public.workspace_members to authenticated`.
- Drop the policy `members_update_admin`.

**NEW `public.change_member_role(p_ws uuid, p_user uuid, p_role public.member_role) returns void`** (security definer, granted to `authenticated`):
- The caller must be owner or admin of `p_ws`.
- `p_role <> 'owner'`, and the target must not be the owner.
- It locks `select … from workspaces where id = billing_workspace_id(p_ws) for update`.
- Going from `viewer` to `editor`/`admin`, it re-checks `seats_used(bw) < limits.seats`; otherwise `PLAN_LIMIT {limit:"seats", max}`.
- It writes `audit_logs member.role_change`.

**`accept_invite` and invite creation** (`inviteMember`) take the same billing-workspace row lock before counting.

**P4 §24.2:** `changeMemberRole` calls `rpc("change_member_role")` with the user client.

**pgTAP:**
- A direct `update workspace_members set role` is denied.
- A role change past the seat limit returns `PLAN_LIMIT`.

**Sub-claim dropped:** "two concurrent `accept_invite` exceed seats". `seats_used` already counts pending admin/editor invites, so concurrent accepts cannot exceed the seat limit. The real race is at invite creation, which the lock above covers.

### R13 — Credit expiry without duplicate keys (T-M6)

**Schema:**
- `credit_grants.expired_at timestamptz` (new).

**`_expire_due_grants(p_ws)`:**
- It selects `remaining > 0 and expired_at is null and expires_at <= clock_timestamp()`.
- It sets `remaining = 0, expired_at = clock_timestamp()` and writes the ledger key `expire:{grantId}`, unchanged.

**`_return_to_grants`:**
- It refills the source grant only if `g.expired_at is null and g.expires_at > clock_timestamp()`.
- Otherwise it creates the 7-day `reservation_return` bucket (existing branch).

**NEW P4-owned helper `cap_rollover(p_ws uuid, p_cap int, p_ref text)`:**
- It is called inside `billing_apply_*` before a plan grant.
- Partial expiries write the key `expire:cap:{grantId}:{p_ref}`, where `p_ref` = the granting idempotency key, with the description "קרדיטים מעבר לתקרת הגלגול".
- Add the key to the §10.1 canonical list.

**`expire_credit_grants()`:**
- It loops per workspace in a `begin … exception when others then log` sub-block, so one tenant can never abort the whole run.

**pgTAP:**
- "return after natural expiry" → new bucket, and the next run causes no unique violation.
- "cap, then natural expiry" → no unique violation.

### R14 — Staging receives webhooks and runs crons (T-M8)

**Callback URLs:**
- When `APP_ENV ∈ {preview, staging}`, callback URLs append `x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}`.
- This covers OpenRouter `callbackUrlFor` (staging returns a URL; preview still returns `null`), the Grow `notifyUrl`, and the Resend and Morning webhook URLs registered for staging.
- Never in production: `lib/env.ts` ignores the variable when `APP_ENV=production`.

**Env:**
- `VERCEL_AUTOMATION_BYPASS_SECRET` is a Vercel system variable, preview/staging only. Add it to the P6 §20 runtime table.

**NEW `.github/workflows/staging-crons.yml`:**
- Schedule `*/10 * * * *`.
- It calls `/api/cron/{sweep-jobs,billing-renewals,reminders,cleanup,hook-of-the-day}` on `staging.{{DOMAIN}}` with `Authorization: Bearer ${CRON_SECRET_STAGING}` and the bypass header.
- `smoke-staging` calls `/api/cron/billing-renewals` itself if the sandbox purchase is not applied within 60 s.

**CI secret:** `CRON_SECRET_STAGING`.

**M0-verify:**
- Vercel Cron runs only on production deployments.
- Grow/OpenRouter/Resend POSTs pass with the bypass query parameter.

### R15 — Production DB network restrictions: off at launch, documented (T-M9)

GitHub-hosted runners have no stable egress IP, and the release (`migrate-production`) and `backup.yml` run there. So network restrictions stay **off** at launch.

Compensating controls:
- SSL enforcement on;
- a strong `postgres` password, rotated each quarter and after staff changes;
- `backup_reader` with least privilege;
- connection strings only in GitHub secrets;
- no direct-5432 credentials on developer machines (developers use `supabase db` through the CLI login).

Enabling the restriction requires a runner with a static egress IP (self-hosted or a larger runner) allow-listed first. Record this in `DECISIONS.md` and keep it as an open item in P6 §25.

### R16 — Free-trial claims state their limits (H-M1)

**Canonical strings:**
- **TrustRow and login trust row:** **"{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי"**. The TrustRow tooltip keeps the limits: "{trialCredits} קרדיטי ניסיון מספיקים בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים. …".
- **Meta descriptions** (home, niche): end with **"{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי."**
- **CTA:** **"התחילו עם {trialCredits} קרדיטים לניסיון"**.

**Wherever "two videos" stays:** it always appears together with **"באיכות טיוטה, עם סימן מים"**, and the number is `floor(trialCredits / freeVideoCredits)` (ICU plural).

**P3 projects empty state:**
- The trial sentence is shown only if `plan_id='free' && trial_status='granted' && !has_paid`: **"{trialCredits} קרדיטי הניסיון כבר בחשבון: מספיק בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים."**
- Otherwise: **"בוחרים הוק, מאשרים תסריט, ומקבלים סרטון מוכן עם קריינות וכתוביות בעברית."**

### R17 — Truthful cancellation wording (H-M3)

The product is "ביטול מנוי" plus one confirmation, two clicks, no retention call, from the billing page; a logged-out user logs in first.

**Canonical strings:**
- **Short promise:** **"ביטול אונליין בכל רגע"**.
- **In a sentence:** "…ומבטלים אונליין בכל רגע."
- **Mechanism (stated once on pricing/FAQ/cancellation page):** **"מבטלים מעמוד החיוב: לוחצים "ביטול מנוי" ומאשרים, בלי שיחת שימור."**
- **Pre-payment disclosure (P6 §4.1):** **"אפשר לבטל בכל רגע: בעמוד החיוב, במייל או בטלפון. אחרי ביטול לא יהיו חיובים נוספים."**
- **Button on `/legal/cancellation`:** **"ביטול מנוי"**, exactly as in the P1 glossary.

**Retired:** the word "בלחיצה" in any cancellation context. "הסרה בלחיצה" for one-click unsubscribe under RFC 8058 stays, because it is literally one click.

### R18 — Prefix letters before variables (H-M6)

1. `{{BRAND_NAME}}` = `BRAND.nameHe`, which is Hebrew by definition (P0), so the prefix letter attaches **without a hyphen**:
   - "נוצר ב{{BRAND_NAME}}"
   - "ברוכים הבאים ל{{BRAND_NAME}}"
   - "מ{{BRAND_NAME}}"
   - "ש{{BRAND_NAME}}"
2. In code, `BRAND.nameHeWith = { b, l, m, sh, h, v }` and `BRAND.watermarkHe` are built with `withPrefix()` from `lib/hebrew/text.ts` (P2 §5.8). ICU strings receive pre-joined variables (`{inBrand}`, `{toBrand}`, `{fromBrand}`).
3. **Runtime Hebrew-text variables** never take a prefix letter, whether the letter is joined or hyphenated. This covers `{name}`, `{inviterName}`, `{approverName}`, `{agencyName}`, `{senderName}`, `{ownerName}`, `{workspaceName}`, `{seasonName}`. Rephrase with a free-standing word instead:
   - "הזמנה מאת {inviterName}"
   - "התקבל סרטון לאישור מאת {agencyName}"
   - "להעביר את הבעלות אל {name}"
   - "אפשר לבקש מהבעלים של הסביבה, {ownerName}"
   - "אישור מאת {approverName}"
   - `"{workspaceName}"` in quotes after a prefix is fine: `ל"{workspaceName}"`.
4. Digits, Latin, emails and formatted dates keep the hyphen: "ב-14 באוקטובר", "ל-dana@x.co".
5. `lint:copy` error rules:
   - `[ובלמהשכ]-\{\{BRAND_NAME\}\}`;
   - `[ובלמהשכ]-?\{[A-Za-z]*(Name|name|Title|title)\}`, except inside `withPrefix`.
6. Supabase auth templates and WhatsApp templates are pasted literally, so they get "ב{{BRAND_NAME}}" written out.

### R19 — Copy that passes the parts' own lint (H-M8, H-M9, H-m22)

**(a) Banned phrases:**
- "זה הזמן לפרסם" → **"כדאי להתחיל לפרסם עכשיו"**.
- "המשך לשלב הבא" → **"השלב הבא"**.

**(b) Invoice wording:**
- Marketing, FAQ, terms, emails, QS → **"חשבונית מס"**.
- The doc-type label for `tax_invoice_receipt` (P3 invoices table, receipt email row, P6 tables) → **"חשבונית מס-קבלה"**, matching the P1 glossary.
- There is never a "/" between Hebrew letters.

**(c) Doublings:** P1 §2.6 gets a file-level exemption from the doubling rule for the form blocks only of `content/legal/likeness-consent.mdx` and `content/legal/voice-declaration.mdx` (between `{/* form:start */}` and `{/* form:end */}`).

**(d) Raw bidi marks:**
- No raw U+200E/U+200F inside copy.
- Latin or number tokens are wrapped with ICU rich text `<ltr>…</ltr>` (rendered via `bdi`) or `Num`.
- P0 states that marks in prose are rendering aids only.

**(e) Hebrew maqaf:** no U+05BE in user-facing copy. Use "-" or rephrase. `lint:copy` errors on it in messages, MDX and emails.

### R20 — Card-storage statement (H-M4)

**"אנחנו לא שומרים את מספר הכרטיס המלא: רק אסימון לחיוב המנוי, ארבע ספרות אחרונות ותוקף, לזיהוי הכרטיס."**

### R21 — Highlighted plan badge (H-M2)

- The badge text is **"מומלץ"**, driven by `plans.is_highlighted`.
- "הכי פופולרי" is not used at launch. Re-introducing it requires a data check (most active paid subscriptions over 90 days) and a `DECISIONS.md` entry.

### R22 — `vo_he` price follows `shekel_format` (H-M7; D-260)

- App E §6.3 `vo_he` cell → "ב-149 ₪ (`suffix`) / ב-₪149 (`prefix`)".
- App D example 1 (`shekel_format = suffix`) `vo_he` → "…ב-{מחיר} ₪."
- The spoken `vo_tts_he` is unchanged ("במאה ארבעים ותשע שקל").

### R23 — Preview cost (H-M5)

- **P2 HowItWorks step 3:** "כותבים תסריט וצופים בתצוגה מקדימה ({previewCredits} קרדיטים), ורק אחרי שמאשרים את העלות נוצר הסרטון המלא: קריינות וכתוביות בעברית ב-9:16, ב-1:1 וב-16:9, וגם קובץ כתוביות."
  - `previewCredits` = `credit_costs['script.generate'] + credit_costs['storyboard.generate']` (3), injected at build.
- **P3 preview subtitle:** **"הצפייה בתצוגה המקדימה לא עולה קרדיטים נוספים: הסצנות מוצגות כגרפיקה בצבעי המותג, והוויז׳ואל האמיתי ייווצר אחרי האישור."**

### R24 — ICU plurals for every count (H-M10)

Every user-facing string with a variable that counts a noun uses `{n, plural, one {…} two {…} other {# …}}`.

**Canonical patterns (put them in P1 `common.*` and reuse them):**
- credits: `{n, plural, one {קרדיט אחד} two {שני קרדיטים} other {# קרדיטים}}`
- refund toast: `{n, plural, one {הקרדיט חזר ליתרה} other {# קרדיטים חזרו ליתרה}}`
- days: `{n, plural, one {עוד יום אחד} two {עוד יומיים} other {עוד # ימים}}`
- minutes: `{n, plural, one {נשארה בערך דקה} two {נשארו בערך שתי דקות} other {נשארו בערך # דקות}}`
- scenes: `{n, plural, one {סצנה אחת נבנתה} two {שתי סצנות נבנו} other {# סצנות נבנו}}`
- videos: `{n, plural, =0 {פחות מסרטון קצר אחד} one {בערך סרטון קצר אחד} other {בערך # סרטונים קצרים}}`

**Exempt:** constants that are seeded and ≥ 3 (`trialCredits`, `monthlyCredits`, `allowance`, `draftCredits`, `standardCredits`, `freeVideoCredits`, `newMonthlyCredits`), listed as a `lint:copy` allow-list.

**`lint:copy` rule:** `\{[a-zA-Z]+\} [א-ת]+(ים|ות)\b` outside `plural` is an error.

### R25 — Error copy is impersonal (H-m11; P1 §2.2)

**Replacements:**
- "לא חויבתם" → **"לא בוצע חיוב."**
- "שלא תחכו" → rephrase without address.
- "ביקשתם"/"שלחתם" → passive ("התבקש"/"נשלח").
- "הגעתם ל…" → "…נוצלה" ("המכסה היומית נוצלה ({cap}).").
- "התחלתם" → "…התחיל".
- "אתם הבעלים" → "לבעלים של הסביבה…".
- "בתוכנית שלכם" → "בתוכנית הנוכחית".

**Scope:** `errors.*` (P3 §1.4 table and §23 JSON) and the matching QS strings.

### R26 — Hook of the day (C-m4 = T-m7)

- **Pick rule:** "בחירת הוק **להיום** (`todayIL()` בזמן הריצה; ה-cron ‏`2 22 * * *` UTC רץ אחרי חצות שעון ישראל)".
- **Quiet day:** "ביום שקט — רק הוק אוניברסלי לא שיווקי **ממשפחת** `education` (`hook_types.family_slug = 'education'`)".
- **Unit tests:** around 2026-10-25 (IDT→IST) and around a quiet day.

### R27 — Error copy keys match what the server sends (C-m2, C-m3)

**`PLAN_LIMIT`:**
- `PLAN_LIMIT.body` = **"התוכנית הנוכחית לא כוללת את האפשרות הזו."**
- `byLimit.quality_tiers.byRequired.{starter|business}`: the copy of the old `quality_tiers_standard`/`_premium`, chosen by `details.required`.
- `byLimit.client_workspaces.{none|max}`: `none` when `details.max === 0` or is missing, otherwise `max`.
- Add the mapping function `planLimitCopyKey(details)` to P3 §1.5.

**New `byReason` copy:**

| Key | Copy |
|---|---|
| `INVALID_INPUT.byReason.idempotency_key_reused` | **"הבקשה כבר נשלחה עם פרטים אחרים. כדאי לרענן את הדף ולנסות שוב."** |
| `INVALID_INPUT.byReason.body_too_large` | **"הבקשה גדולה מדי. אפשר לקצר את הטקסט או לחלק אותו."** |
| `INVALID_INPUT.byReason.code_invalid` | **"הקוד לא נכון או שפג תוקפו."** |
| `INVALID_INPUT.byReason.version_mismatch` | **"גרסת המסמך התעדכנה. כדאי לרענן את הדף ולאשר שוב."** |
| `FORBIDDEN.byReason.bad_origin` | **"הבקשה נחסמה מטעמי אבטחה. כדאי לרענן את הדף ולנסות שוב."** |
| `EDIT_CONFLICT.byReason.request_in_progress` | **"הבקשה הקודמת עוד בטיפול. עוד רגע ננסה שוב."** |

**Unit test:**
- Every `reason:"…"` literal in `lib/**` has a `byReason` key.
- Internal-only reasons (`no_route`, `no_usable_model`, `halted`, `not_billing_workspace`) are exempt via an allow-list and use the generic body.

### R28 — Browser storage disclosure (C-m5, H-m13 cookies)

**Allowed storage:**
- **localStorage** (D-285): unchanged.
- **sessionStorage**: exactly `reauth_draft_v1` and `signup_marketing_v1`, which are deleted when the tab closes. They are listed in P3 §0, P2 §10.4 section 3 and FSPEC E46.

**Offline copy (no persistent queue):**
- Banner: **"אין חיבור לאינטרנט. השינויים יישלחו כשהחיבור יחזור, כל עוד הלשונית פתוחה."**
- Toast: **"יישלח כשהחיבור יחזור. הלשונית צריכה להישאר פתוחה."**

**Cookies §1:** "…המידע הזה נשאר בדפדפן שלכם, ונשלח אלינו רק כשממשיכים ליצירת סרטון."

### R29 — End-card headline: 6 words, at most 30 characters (C-m13)

- App E is the source.
- Zod max 30, plus a word-count refine ≤ 6, in P4 `brief.cta.headline_he` and `RenderOptions.headline_he`, and in P5 `end_card.headline_he`.
- P3 says "עד 6 מילים (30 תווים)".

### R30 — `VIDEO_JOB_FAILED` (C-m9)

- **P5 §18.6:** keyframes failing on more than 50% of scenes → `VIDEO_JOB_FAILED`. `PROVIDER_UNAVAILABLE` stays for no route, halt and budget.
- **P3 copy:** **"לא הצלחנו ליצור תמונות ליותר מחצי מהסצנות. {credits, plural, one {הקרדיט חזר ליתרה} other {כל # הקרדיטים חזרו ליתרה}}. אפשר לנסות שוב בעוד כמה דקות."** The "switch to images" advice is dropped.
- **P6 `reasonHe`:**
  - `VIDEO_JOB_FAILED` → "תקלה ביצירת התמונות לסצנות";
  - `PROVIDER_UNAVAILABLE` → "עומס זמני אצל ספקי ה-AI".

### R31 — Sweeper cap and restarts (T-m6)

- **Long-running jobs:** the cap is **120 minutes** from `started_at` (P4 §23 item 3, P5 §19.4 item 3).
- **Restart:** "dead or unknown" → `orchestrator.cancel(run_id)` first, then `start`.
- **Counter field:** `jobs.error_detail.restarts` (int; second restart → fail). Remove `restarted`.
- **Guards:** `runStep` and `finalize` read `jobs.status` and abort (no capture, no `succeeded`) when it is `failed` or `canceled`.

### R32 — Vercel durations (T-m1)

- **P5 wording:** "ברירת מחדל 300 שניות ב-Pro, ואפשר להגדיר עד 800 (GA); צעד הרינדור משתמש במשך המורחב של עד 30 דקות (opt-in)".
- **P6 DoD:** "אף `app/api/**/route.ts` לא מגדיר `maxDuration` מעל 300; החריג היחיד הוא נתיבי הצעדים של WDK (`.well-known/workflow/*`), שמוגדרים ב-`vercel.json → functions`".
- **Unit test:** scans only `app/api/**/route.ts`.

### R33 — Crypto names (T-m2, T-m3)

- `lib/crypto.ts` exports `secretList(v)`. `splitSecrets` is retired.
- `verifyOpenRouterSignature` has one owner, P5 §5.2: `(rawBody: string, header: string | null, secret: string, opts?: { nowMs?: number; toleranceSec?: number }) => boolean`. It parses **every** `v1=` value and accepts the signature if any of them matches, with a 300 s tolerance.
- P4 §22.2 only imports it.

### R34 — Remotion fonts (T-m4)

- `remotion/fonts.ts` exports `FONT_FAMILIES` (names only) and `loadRenderFonts()`, which wraps the `@remotion/google-fonts` calls.
- `loadRenderFonts()` is called only when `getRemotionEnvironment().isRendering`.
- The Player uses the self-hosted `@font-face` (CSP `font-src 'self' data:`).

### R35 — CSP Supabase origin (T-m5)

- `buildCsp` derives `https://<host>` and `wss://<host>` from `NEXT_PUBLIC_SUPABASE_URL` for `img-src`, `media-src` and `connect-src`.
- `next.config` `images.remotePatterns` uses the same host.
- The custom domain `auth.{{DOMAIN}}` then works unchanged.

### R36 — Election rules name (T-m8)

- Cite **"כללי הבחירות (דרכי תעמולה) (קיום חובת הגילוי לגבי תעמולת בחירות שהיא זיוף עמוק), התשפ״ו-2026"**: a written notice or a symbol, and the symbol is not valid for audio.
- ⚖️ stays only on the effective date.

### R37 — OpenRouter retention wording (T-m9)

- P6 §11.6: "OpenRouter — `data_collection: "deny"`: ניתוב רק לספקים שלא אוספים ולא מאמנים על הנתונים, ככל שהספק מאפשר (זו לא התחייבות לאפס שמירה)".
- Optional M0 spike: ZDR routing.

### R38 — Next 16 caching (T-m10, [M0-verify] spike 1)

- **Data cache:** `unstable_cache(fn, keyParts, { tags, revalidate })`, without `cacheComponents`.
- **Invalidation:** `revalidateTag(tag, "max")` from Route Handlers and crons; `updateTag(tag)` in Server Actions that need read-your-writes.
- Every `revalidateTag('x')` becomes `revalidateTag('x', "max")`.

### R39 — Security-definer helpers check access (T-m11)

- `workspace_plan`, `billing_workspace_id` and `is_version_locked` start with: `if (select auth.uid()) is not null and not (public.can_access_workspace(<ws>) or public.is_platform_admin()) then return null; end if;`
- For `is_version_locked`, the workspace comes via version → project.
- Service-role calls (`auth.uid()` null) are unaffected.

### R40 — `{{DPO_NAME}}` may stay empty (C-m13)

- P6 `check-content --launch` exempts `{{DPO_NAME}}` ("ריק מותר; המשפט מוסתר") and `{{VERCEL_TEAM_SLUG}}`.

---

## §1. Findings table

| ID | Source · severity | Valid? | Resolution |
|---|---|---|---|
| C-B1 | consistency · blocker | ✅ Verified: P6:528, 539-542, 621, 783-784, 830 vs P4:2900, 5882 | R1 |
| C-M1 | consistency · major | ✅ P2:963 vs P4:5692; `search_hooks` returns no icon, why or season name | R2 |
| C-M2 | consistency · major | ✅ P4:5781 snapshot; `create_workspace` doesn't copy WL; P6 §5.4 has no row | R3 |
| C-M3 | consistency · major | ✅ P4:5566 vs P3:775-786 | R4 |
| C-M4 | consistency · major | ✅ P3:1203 vs P4:5769 | R5 |
| C-M5 | consistency · major | ✅ P4:2755 returns 0 for free; P1:1381 | R6 |
| C-m1 | consistency · minor | ✅ spec E18 10 MB vs 4 MB; E15 missing `emailSent` | FSPEC |
| C-m2 | consistency · minor | ✅ P3:2002-2020 | R27 |
| C-m3 | consistency · minor | ✅ reasons are absent from P3; `request_in_progress` added too | R27 |
| C-m4 | consistency · minor | ✅ P4:6179, 6167 | R26 |
| C-m5 | consistency · minor | ✅ P3:33, 76-77, 200, 344; P2:2294 | R28 |
| C-m6 | consistency · minor | ✅ P2:421, 1956 | F02-E11/E19 |
| C-m7 | consistency · minor | ✅ P6:859; §18.5 = axe | F06 |
| C-m8 | consistency · minor | ✅ P6:1574; WizardStep is in `common.ts`, CancelReason in `billing.ts` | F06 |
| C-m9 | consistency · minor | ✅ P5 §18.6 never raises `VIDEO_JOB_FAILED` | R30 |
| C-m10 | consistency · minor | ✅ P2:993 vs P4:3016; boolean vs `"1"` | R2 |
| C-m11 | consistency · minor | ✅ P2:1157; P6:1502, 1505 | F02, F06 |
| C-m12 | consistency · minor | ✅ P3:566 vs P6:1297 vs P4:6180 | R6 |
| C-m13 | consistency · minor | ✅ variant name; headline 30/50/60/8 words; DPO | R2, R29, R40 |
| T-M1 | technical · major | ✅ P4:3487, 3627-3640; no revoke on `scenes` | R7 |
| T-M2 | technical · major | ✅ P4:3703; `consents` is not server-only; P4:5968 "דרך הלקוח שלו" | R10 |
| T-M3 | technical · major | ✅ P5:150 (110 s × 3), P4:5095 (120 s), `spend_credits` captures up front | R8 |
| T-M4 | technical · major | ✅ P4:287 per-schema revoke only; Postgres global default to PUBLIC | R9 |
| T-M5 | technical · major | ✅ role bypass (P4 §12.2 `grant update (role)`). ⚠️ The race sub-claim is dropped: `seats_used` counts pending invites, so the race is at invite creation | R12 |
| T-M6 | technical · major | ✅ P4:2322, 2347 (`now()`), P6:204 (no key) | R13 |
| T-M7 | technical · major | ✅ P6:959 vs 1294-1295 | R11 |
| T-M8 | technical · major | ✅ P6:2083 Vercel Authentication; crons only on production | R14 |
| T-M9 | technical · major | ✅ P4:49; P6 §15.11/§19.3 run on GitHub-hosted runners | R15 |
| T-m1 | technical · minor | ✅ P5:2681 "800 כברירת מחדל"; research §3.2 says default 300 | R32 |
| T-m2 | technical · minor | ✅ P6:1729 `splitSecrets` vs P4/P5 `secretList` | R33 |
| T-m3 | technical · minor | ✅ P4:6033 vs P5:628; `fromEntries` keeps only the last `v1` | R33 |
| T-m4 | technical · minor | ✅ P5:3249-3257 top-level `loadFont` | R34 |
| T-m5 | technical · minor | ✅ P6:1682-1685; P4 §1.2 recommends a custom domain | R35 |
| T-m6 | technical · minor | ✅ P4:6176, P5:3003-3004 (`restarts` vs `restarted`) | R31 |
| T-m7 | technical · minor | ✅ **duplicate of C-m4** (merged) | R26 |
| T-m8 | technical · minor | ✅ P6:984; the name is verified in research 06 §7.7 | R36 |
| T-m9 | technical · minor | ✅ P6:942 "אין שמירה" | R37 |
| T-m10 | technical · minor | ✅ (platform knowledge, not research) → [M0-verify] | R38 |
| T-m11 | technical · minor | ✅ P4 §12.6 grants with no access check | R39 |
| H-M1 | hebrew · major | ✅ P2:416, 579, 698, 709, 766; P3:337, 537; P6:1094; QS:325, 354 | R16 |
| H-M2 | hebrew · major | ✅ P2:680, 1384; P1:1588; QS:535 | R21 |
| H-M3 | hebrew · major | ✅ 22 hits across P0/P2/P3/P6/AppE/QS (P3:1558 "נגיש בלחיצה אחת" is about page access, not changed) | R17 |
| H-M4 | hebrew · major | ✅ P2:1426, 1980, 1983 vs 2101, 2183 | R20 |
| H-M5 | hebrew · major | ✅ P2:514; P3:856 | R23 |
| H-M6 | hebrew · major | ✅ about 60 hits (list in F01–F06, QS, FSPEC) | R18 |
| H-M7 | hebrew · major | ✅ AppD:346, 487, 574, 2568; AppE:3044 vs AppE:3016, P5:1008, D-260 | R22 |
| H-M8 | hebrew · major | ✅ P3:548, 1746; slashes in P2/P3/P6/QS; MDX doublings | R19 |
| H-M9 | hebrew · major | ✅ in copy: P2:389, 391, 1917; P3:117, 425, 431, 1391, 2061 (P2:2861 and P3:33 are prose) | R19 |
| H-M10 | hebrew · major | ✅ about 50 reachable strings (python scan) | R24 |
| H-m1 | hebrew · minor | ✅ **duplicate of C-m6** (merged) | F02 |
| H-m2 | hebrew · minor | ✅ P2:364 | F02 |
| H-m3 | hebrew · minor | ✅ P3:509, 573 | F03 |
| H-m4 | hebrew · minor | ✅ calques. ⚠️ The row "פירורי לחם" is **dropped**: it is the established Hebrew accessibility term (IS 5568 audits, gov.il) and screen-reader users know it | F01, F02, F03 |
| H-m5 | hebrew · minor | ✅ P3:548, 1452; P2:140, 753, 757, 762, 310; P6:1158; P3:1482 | F02, F03, F06 |
| H-m6 | hebrew · minor | ✅ seasons seed names make "הוקים ללפני פסח…" | F02 (frontmatter `h1`), SEED |
| H-m7 | hebrew · minor | ✅ 7 type names contain "/" or "X" | F02 |
| H-m8 | hebrew · minor | ✅ P3:428 | F03 |
| H-m9 | hebrew · minor | ✅ terminology drift (counts verified) | F01–F03, QS |
| H-m10 | hebrew · minor | ✅ P3:704-710 vs P5:2145-2151 | F03 |
| H-m11 | hebrew · minor | ✅ P3 §1.4 "לא חויבתם" ×6 etc. vs P1:102 | R25 |
| H-m12 | hebrew · minor | ✅ P2:365, 469, 594; P3:848; P1:129 (+ P2:1071) | F01, F02, F03, QS |
| H-m13 | hebrew · minor | ✅ P2:1888, 2278, 294/1525 | R28, F02 |
| H-m14 | hebrew · minor | ✅ AppE:3275, 3283 | FAPPX |
| H-m15 | hebrew · minor | ✅ the hooks break the rules (my count is 5 > 12 tokens: real-estate-01 14, mortgage-advisors-05 13, zimmers-03 13, lawyers-05 12 + ₪, restaurants-05 12 + dash; 10 hooks have parentheses). ⚠️ Corrected: `HE009` is "digits in `vo_tts_he`", not parentheses. The new code is `HE020` | F04, F05, FAPPX, SEED |
| H-m16 | hebrew · minor | ✅ P2:1205-1207, 1263, 1746 (MDX `{}` = JS expressions) | F02 |
| H-m17 | hebrew · minor | ✅ P1:144 vs P3:534 | F01 |
| H-m18 | hebrew · minor | ✅ P1:2374; P2:999 ♡ vs P1:1925 `Star` | F01, F02 |
| H-m19 | hebrew · minor | ✅ P3:1115 | F03 |
| H-m20 | hebrew · minor | ✅ P6:1165, 257 hard-code ₪100; P4:66-67 table/td have no direction | F04, F06 |
| H-m21 | hebrew · minor | ✅ P2:2009, 1462, 1171, 1108; P3:1570, 525 | F02, F03 |
| H-m22 | hebrew · minor | ✅ P2:147, 279, 2393; P6:1146; P3 admin "דו־שלבי" in quoted UI | R19 |

**Totals:**
- 71 findings, 69 unique and valid, 2 duplicates merged, 0 dropped in full.
- 3 sub-claims dropped or corrected: T-M5 race, H-m4 "פירורי לחם", H-m15 code.

---

## §2. Per-file edits

### F00 — `parts/00-header.md` (7 edits)

1. **§3 principle 11 (line 61):** "וביטול מנוי אפשרי בלחיצה." → "וביטול מנוי אונליין בכל רגע, בלי שיחת שימור." (R17)
2. **Lines 47, 57, 209:**
   - "ביטול בלחיצה" → "ביטול אונליין בכל רגע";
   - "ומבטל בלחיצה אם ירצה" → "ומבטל אונליין מעמוד החיוב אם ירצה". (R17)
3. **§6.5, new bullet "יחידות כסף הן חלק מהשם":**
   - `_ils`/`Ils` = שקלים עשרוניים (DB, RPC, API, UI);
   - `Ag` = אגורות שלמות (`Agorot`) רק בקוד החיוב ובממשקי הספקים;
   - המרה רק ב-`toAgorot`/`fromAgorot`/`toIlsNumber` (חלק 06 §1.4).
   (R1)
4. **§6.5, new bullet "תווים נסתרים":** U+200E/U+200F and the Hebrew maqaf U+05BE that appear in this document's prose are rendering aids. Strings in quotes are copy-ready without them. Never copy them into code, `messages/he.json`, MDX or templates. `lint:rtl`/`lint:copy` fail on them. (R19)
5. **§6.5, new bullet "אותיות שימוש לפני משתנה":** state rules 1, 3 and 4 of R18 in one sentence. (R18)
6. **§6.2 `[M0-verify]` list:** append these items:
   - Vercel Cron runs only on production, and the staging protection bypass (R14);
   - `revalidateTag(tag, profile)`/`updateTag` in Next 16 (R38);
   - the global `pg_default_acl` for functions (R9).
7. **Placeholder table, `{{DPO_NAME}}` row (line 15):** append "(ריק מותר: `check-content --launch` לא נכשל עליו, חלק 06 §23)". (R40)

### F01 — `parts/01-brand-design.md` (16 edits)

1. **§2.6 `lint:copy` table:** add these rows:
   - (a) the R18 prefix-hyphen regexes → שגיאה;
   - (b) the R24 plural regex with its allow-list → שגיאה;
   - (c) U+05BE in messages, MDX or emails → שגיאה;
   - (d) the file-level exemption from the doubling rule for the form blocks of `content/legal/likeness-consent.mdx` and `voice-declaration.mdx` (R19c).
2. **Glossary row "מנוע" (line 129):** the example "מנועי ה-AI המובילים" → "מנועי AI כמו Veo ו-Kling". (H-m12)
3. **Line 144 (delete example):** "…? אי אפשר לשחזר אותו." → **"למחוק את הפרויקט "מבצע חנוכה"? אפשר לשחזר אותו תוך 30 יום דרך התמיכה."** (H-m17)
4. **§10.9 `CreditSummary.planAllowance` comment:** "null = no monthly allowance (free; `get_credit_summary` maps 0 → null)". (R6)
5. **§10.9 `lowThreshold` comment:** "default: `lowThreshold(summary, planId)` from `lib/billing/credits.ts` (Part 06 §2.6)". (R6)
6. **§10.9 pill (line 1386):** "the ring is rendered only when `planAllowance != null`; otherwise number only". (R6)
7. **§10.15 `HookCardProps`:**
   - Delete "(Part 02 calls it "default")".
   - Add the field-to-zone mapping per R2: `hook_type_name_he`, `niche_icon` + `niche_short_name_he`, `season_name_he`, `why_it_works_he`, `sample_poster_url`. (R2)
8. **§11.2 `PricingCards` row (line 1588):**
   - "חסכו 20%" → "שנתי · חיסכון של 20%";
   - badge "הכי פופולרי" → **"מומלץ"**;
   - "בחירה בתוכנית עסק" → "בחרו בעסק". (R21, H-m9)
9. **`MobileStickyCta` (line 1593):** "צרו סרטון חינם" → "צרו סרטון בחינם". (H-m9)
10. **Icon map (line 1911) and app nav label:** "בית" → "ראשי", the `/app` label everywhere. (H-m9)
11. **Line 2115, watermark:** "נוצר ב-{{BRAND_NAME}}" → "נוצר ב{{BRAND_NAME}}" (`BRAND.watermarkHe`). (R18)
12. **§19 JSON:**
    - `"label": "ערכת צבעים"` (line 2270) → "ערכת נושא";
    - `"storyboard": "סטוריבורד מוכן"` (line 2361) → "הסצנות מוכנות". (H-m9)
13. **§19 JSON `favorites` (line 2374):** → **"עוד אין הוקים שמורים. לחיצה על הכוכב בכרטיס של הוק שומרת אותו כאן."** (H-m18)
14. **§19 JSON:** delete `common.platforms` (line 2390); platform labels come only from `common.labels.platform.*` (`lib/labels.ts`, P2 §1.2). (H-m9)
15. **§19 `common.credits.*`:**
    - Add the R24 canonical plural patterns, including `two`.
    - Acceptance (line 2455): "כל מחרוזת שסופרת שם עצם משתמשת ב-plural עם `one`/`two`/`other`". (R24)
16. **§2.5 `formatIls`:** add a note that it takes **decimal shekels** (`Ils`), and that `formatAgorot` is the only entry point for `Agorot`. (R1)

### F02 — `parts/02-marketing-site.md` (40 edits)

1. **§1.2 `BRAND`:** add `nameHeWith` and `watermarkHe` (built with `withPrefix`), plus the R18 rule sentence. (R18)
2. **§1, line 47:** name the caching primitive and the invalidation calls per R38. (R38)
3. **§1.3 copy conventions (around line 172):** "בלי תווי כיווניות גולמיים בקופי; טוקן לועזי או מספרי עטוף ב-`<ltr>` או `Num`". (R19)
4. **Niche table:**
   - line 140 `yoga-pilates` short name → **"מורי יוגה ופילאטיס"**;
   - line 147 "די־ג׳ייז ומוזיקאים" → **"דיג׳ייז ומוזיקאים"**. (H-m5, H-m22)
5. **Labels:**
   - line 123 "מבצע / חג" → "מבצע או חג";
   - line 130 "סגנון UGC" → "צילום טלפון";
   - lines 254, 300 → "צרו סרטון בחינם";
   - line 119: the single source is `lib/labels.ts` (shorts = "יוטיוב שורטס"). (H-m9)
6. **Footer:**
   - line 279 "ל־6" → "ל-6";
   - line 294 "כל המחירים באתר בשקלים וכוללים מע״מ." → append "(אלא אם מסומן "לפני מע״מ")". (H-m22, H-m13)
7. **Line 310, WhatsApp prefill:** → **"היי, ראיתי את העמוד על סרטונים ל{short_name_he} ואשמח לשמוע איך זה עובד"**. (H-m5)
8. **Hero:**
   - line 364 "ומכתבים את זה" → "ומוסיפים כתוביות, בעברית טבעית";
   - line 365 "בעברית מושלמת" → "בעברית טבעית". (H-m2, H-m12)
9. **Lines 389, 391, 1917:** remove the LRM; `<ltr>@yourbusiness</ltr>`, `<ltr>+972-50-1234567</ltr>`. (R19d)
10. **TrustRow line 416, `Gift`:** → R16 TrustRow string. (R16)
11. **Line 421 tooltip:**
    - "מספיקים לבערך שני סרטונים" → "מספיקים בערך לשני סרטונים";
    - "70" → `{trialCredits}`. (C-m6, R16)
12. **Line 469 `EnginesStrip`:** → **"מאחורי הקלעים עובדים מנועי AI כמו Veo, Kling ו-Claude, ואנחנו מתאימים מנוע לכל סצנה."** (the list comes from active routes). (H-m12)
13. **Line 514 HowItWorks step 3:** → R23 P2 string. (R23)
14. **EditorMath:**
    - line 578 → "…בכל זאת, אפשר להשוות בעצמכם עם {trialCredits} קרדיטי ניסיון.";
    - line 579 → "התחילו עם {trialCredits} קרדיטים לניסיון". (R16)
15. **Line 594 H2:** → **"מה שעורך הווידאו עשה, עכשיו בכמה לחיצות"**. (H-m12)
16. **Prefix-hyphen fixes per R18 at lines 626, 811, 883, 1151, 1318, 1326, 1351, 1981, 2116, 2401, 2416, 2457, 2509, 2510, 2516, 2588, 2600:**
    - "ב-{{BRAND_NAME}}" → "ב{{BRAND_NAME}}";
    - "מ-{{BRAND_NAME}}" → "מ{{BRAND_NAME}}";
    - "ל-{{BRAND_NAME}}" → "ל{{BRAND_NAME}}". (R18)
17. **Cancellation:**
    - lines 678, 1368, 1535, 1886: "ומבטלים בלחיצה"/"וביטול בלחיצה" → "ומבטלים אונליין בכל רגע"/"וביטול אונליין בכל רגע";
    - line 1421 → "ביטול מנוי אונליין בכל רגע";
    - line 1523: heading "ביטול בלחיצה." → "ביטול אונליין בכל רגע.", with body = the R17 mechanism;
    - line 1989 FAQ `cancel`: "בלחיצה:" → "אונליין, בכל רגע:" + mechanism;
    - line 2062 Terms summary: "בלחיצה" → "אונליין מעמוד החיוב";
    - lines 2307, 2525: button "ביטול מנוי בלחיצה" → "ביטול מנוי". (R17)
18. **Lines 680, 1384:** badge → **"מומלץ"**. Add acceptance: "המחרוזת "הכי פופולרי" לא מופיעה בקוד". (R21)
19. **Trial wording:**
    - line 698 subtitle: "שני הסרטונים הראשונים עלינו." → "{trialCredits} קרדיטים לניסיון עלינו, בלי כרטיס אשראי.";
    - lines 709, 766 meta: "2 סרטונים ראשונים בחינם." → R16 meta ending;
    - line 722 acceptance: rewrite to "בכל מקום ש"כ-2 סרטונים" מופיע, הוא מלווה ב"באיכות טיוטה, עם סימן מים" ומחושב `floor(trialCredits / freeVideoCredits)`";
    - line 1068 → "…ומקבלים {trialCredits} קרדיטים — מספיק בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים.";
    - line 1956 FAQ: "לבערך" → "בערך לשני". (R16, C-m6)
20. **Line 762 FinalCtaBand:** → **"הסרטון הבא של העסק שלכם מתחיל כאן."** (H-m5)
21. **§5.1 (lines 961-993):**
    - Delete `HookCardDTO`/`HookFacets`.
    - Import from `@/lib/api/contracts/hooks`.
    - Ordering bullet: "`popular`: רלוונטיות (כשיש `q`), ואז `is_featured`, ואז `hook_popularity.score`, ואז `id` (חלק 04 §11.1)".
    - Params: `featured=1`/`has_video=1` as the strings `"1"`. (R2, C-m10)
22. **§5.2 table (lines 1018-1029):** rewrite the field paths per R2. Variant `default` → `library` (line 1027). (R2, C-m13)
23. **Line 999 mock:** "♡ שמירה" → "☆ שמירה". (H-m18)
24. **Line 1071:** "הוקים שנכתבו רק בשבילכם?" → "הוקים שנכתבו בשביל העסק שלכם?" (H-m12)
25. **Line 1108 sort label:** "הכי הרבה סרטונים נוצרו" → "הכי הרבה סרטונים". (H-m21)
26. **Line 1157:** `hooks_searched` and `faq_expanded` → `location:"hook_niche_page"`. (C-m11)
27. **Line 1171 intro:** → **"יש {count} דרכים עיקריות לפתוח סרטון, בשמונה משפחות:"** (H-m21)
28. **Hook-type pages:**
    - line 1176: frontmatter `h1` becomes **mandatory** for every type (CI check in `check-content`), with fallback **"הוק {name_he}: מה זה ואיך כותבים הוק כזה"**;
    - lines 1184, 1186 `pov.mdx`: title → "הוק POV: מה זה ואיך כותבים הוק כזה (עם דוגמאות)", h1 → "הוק POV: מה זה ואיך כותבים הוק כזה";
    - the line 1291 table row follows the same rule. (H-m4, H-m7)
29. **MDX braces:**
    - lines 1205-1207 and 1263: write placeholders as `<Placeholder name="רגע מוכר מהחיים של הלקוח" />` (or escape `\{…\}`);
    - line 1746 blog: `{{BRAND_NAME}}` is replaced by a remark plugin that runs on **all** `content/**/*.mdx`;
    - add a build check: no unescaped `{` with a Hebrew letter in MDX. (H-m16)
30. **Season pages:**
    - line 1229 H1: frontmatter `h1` in `content/seo/seasons/{slug}.mdx` is mandatory (CI). The `withPrefix` template is dev fallback only;
    - examples: "הוקים לניקיונות ושיפוצים לפני פסח", "הוקים לשנה האזרחית החדשה", "הוקים ליום הרווקים 11.11", "הוקים לתקופה שאחרי החגים", "הוקים לוולנטיין";
    - line 1232 H2 "הוקים ל{name_he}" → "הוקים לעונה הזו". (H-m6)
31. **R24 plural conversion, all lines:** 241, 538, 667, 670, 739, 832, 1024, 1082, 1093, 1111, 1114, 1172, 1230 ("עוד {n} ימים" → days pattern), 1287, 1288, 1336, 1345, 1348, 1358, 1575, 1584, 1591, 2751. (R24)
32. **Lines 1426, 1980, 1983:** card-storage sentence → R20. (R20)
33. **Line 1462:** → "גללו הצידה כדי לראות את כל התוכניות". (H-m21)
34. **Invoice wording:** "חשבונית מס/קבלה" at lines 1525, 1979, 2105 → "חשבונית מס". Line 1525 also gets the "(אלא אם מסומן "לפני מע״מ")" clause. (R19b, H-m13)
35. **Line 1888 About:** → **"המידע נשמר בשרתים באירופה (חלק מהעיבוד אצל ספקים בארה״ב), לא משמש לאימון מודלים, ואפשר להוריד או למחוק אותו בכל רגע."** (H-m13)
36. **Line 2009:** "שמחמירה מהדרישה" → "שמחמירה יותר מהדרישה". (H-m21)
37. **Terms:**
    - line 2097 (5.10) → "…— אנחנו רשאים לבטל אותם, אחרי שנודיע לכם.";
    - line 2134 (12.1) → "השירות ניתן כמות שהוא ולפי זמינותו." (H-m4)
38. **Cookies:**
    - line 2278 → R28 cookies sentence;
    - line 2294 section 3: add the two sessionStorage keys "(נמחקים בסגירת הלשונית)". (R28)
39. **Line 2393:** delete "(אודיו־דסקריפשן)". (H-m22)
40. **§10.5/§14 analytics notes:** add `hook_niche_page` wherever the location enum for library pages is listed. (C-m11)

### F03 — `parts/03-app-ux.md` (44 edits)

1. **§0, line 33 storage rule:** add the sessionStorage allow-list (`reauth_draft_v1`, `signup_marketing_v1`). (R28)
2. **Offline copy:**
    - line 76 banner → R28 banner;
    - line 200 `app.toast.offlineQueued` → R28 toast;
    - line 77: keep "מה שעשיתם נשמר" (sessionStorage restores it). (R28)
3. **§1.4 error table and §23 JSON, all rows:** apply R25 impersonal forms. For example `INSUFFICIENT_CREDITS` (line 85) → "היצירה הזו עולה {needed, plural, one {קרדיט אחד} other {<num>#</num> קרדיטים}}, וביתרה יש <num>{balance}</num>. לא בוצע חיוב. אפשר לרכוש חבילת קרדיטים, או לבחור איכות או אורך שעולים פחות." (R25, R24)
4. **`VIDEO_JOB_FAILED`, line 94 and JSON line 2048:** → R30 copy. (R30)
5. **`NOT_FOUND` CTA, lines 99 and 2081:** "חזרה לבית" → "חזרה לדף הראשי". (H-m4)
6. **Lines 117 and 2061:** remove the RLMs from "JPG, PNG, WEBP, HEIC, MP4 או MOV". (R19d)
7. **§1.4/§1.5 and JSON:** add the R27 `byReason` rows and the unit test. (R27)
8. **§1.5 `PLAN_LIMIT`:**
    - add `body`;
    - replace the `quality_tiers_premium`/`_standard` and `client_workspaces_plan`/`_max` keys with `byLimit.quality_tiers.byRequired.*` / `byLimit.client_workspaces.{none,max}`;
    - add `planLimitCopyKey(details)`;
    - "הגעתם ל-15 סביבות לקוח" → "נוצלו כל 15 סביבות הלקוח בתוכנית". (R27, R25)
9. **`MISSING_FACTS` row:** the body lists `{facts}` (bulleted). Note that attestation labels come from `ATTESTATION_LABELS_HE` (R4).
10. **Lines 193, 194, toasts:** → R24 credits patterns. (R24)
11. **Line 216, low-credits banner:**
    - "נשארו {balance} קרדיטים" → plural;
    - the trigger is `balance < lowThreshold(summary, planId)`;
    - `videos` = `videosLeft()`. (R6, R24)
12. **Line 337, login trust rows:** → **"{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי"** · "מחירים בשקלים, כולל מע״מ" · **"ביטול אונליין בכל רגע"**. Delete the >35 swap sentence, because the line no longer claims a video count. (R16, R17)
13. **R18 prefix fixes:**
    - line 340 "כניסה ל-{{BRAND_NAME}}" → "כניסה ל{{BRAND_NAME}}";
    - lines 871, 1213 "נוצר ב-{{BRAND_NAME}}" → "נוצר ב{{BRAND_NAME}}";
    - line 1525 "ש-{{BRAND_NAME}}" → "ש{{BRAND_NAME}}";
    - rephrase per R18.3 at lines 62 (`ל-{ownerName}`), 1227 (`מ-{senderName}`), 1405, 1614 (`ל-{name}` ×2 → "אל {name}"), 1677 (`מ-{inviterName}` → "ממי שהזמין אתכם, {inviterName}"). (R18)
14. **Lines 425, 431, 1391:** remove the LRM; `<ltr>@yourbusiness</ltr>`, `<ltr>#RRGGBB</ltr>`. (R19d)
15. **Line 428:** ToggleGroup "ז׳ · נ׳" → **"זכר · נקבה"**; tooltip → **"עוזר לנו לכתוב נכון: "השיפוץ החדש" או "הבנייה החדשה"."** (H-m8)
16. **Line 509 greeting:** 17:00–23:59 **"ערב טוב, {firstName}"**; 00:00–04:59 **"שלום, {firstName}"**. Line 573 test → "ב-23:00 "ערב טוב"". (H-m3)
17. **"סרטון ב-3 קליקים" at lines 309, 518, 648, 908:** → "סרטון ב-3 לחיצות". (H-m9)
18. **Dashboard wording:** user-facing "דשבורד" (lines 416, 458, 478, §7 "חזרה לדשבורד") → "ראשי" / "חזרה לדף הראשי"; nav "בית" (line 280) → "ראשי". (H-m9)
19. **Line 525:** "{credits} קרדיטים שמורים" → "שוריינו {credits, plural, one {קרדיט אחד} other {# קרדיטים}}". (H-m21, R24)
20. **Line 537, projects empty state:** → R16 conditional. (R16)
21. **Season wording:**
    - line 548: "זה הזמן לפרסם" → "כדאי להתחיל לפרסם עכשיו"; "מתחיל ב-{date}" → "החל מ-{date}";
    - line 1452: "{seasonName} מתחיל ב-{date}" → "{seasonName}: החל מ-{date}". (R19a, H-m5)
22. **Line 566 (§5.7):** the `videos` formula → "`videosLeft(balance, planId)` מ-`lib/billing/credits.ts` (חלק 06 §2.6)". (R6)
23. **Labels:** line 672 "מבצע / חג" → "מבצע או חג"; line 803 "סגנון UGC" → "צילום טלפון". (H-m9)
24. **§6.3 `CtaPicker` table (lines 704-710):** copy the P5 `CTA_DEFAULTS` texts:
    - `call` "התקשרו עכשיו";
    - `lead_form` "השאירו פרטים";
    - `save_share` "שמרו ושלחו למי שצריך". (H-m10)
25. **Line 786, attestations paragraph:** "בלי סימון — אי אפשר ליצור" → append "והשרת אוכף את אותו כלל (חלק 04 §19.8 שלב 3; `422 MISSING_FACTS`)". (R4)
26. **Line 730:** "{n} מילים" → plural. (R24)
27. **Line 848:** "רק בשבילכם" → "לסרטון הזה". (H-m12)
28. **Line 856, preview subtitle:** → R23 P3 string. (R23)
29. **Lines 868, 1395:** "עד 8 מילים" → "עד 6 מילים (30 תווים)". (R29)
30. **Line 897:** "חסרים {missing} קרדיטים." → plural. (R24)
31. **Lines 1109, 1110:**
    - "נשארו בערך {minutes} דקות" → the minutes pattern;
    - "כמעט שם" → "עוד רגע";
    - "אנחנו עדיין על זה." → "זה לוקח יותר מהרגיל, והיצירה ממשיכה." (H-m4, R24)
32. **Line 1115:** "~{seconds} שנ׳" → "כ-{seconds} שנ׳" (`common.time.approxSeconds`). (H-m19)
33. **Lines 1125, 1138, 1145:** refunded/scenes plurals. (R24)
34. **Lines 1196-1203:** the approval tab expiry options → R5 (14/30/90). (R5)
35. **Branding lines 1199, 1211, 1213, 1229, 1234:** `show_branding` → `resolveShareBranding(link).whiteLabel`. Acceptance at line 1234 uses the same name. (R3)
36. **Lines 1467, 1531:** "ביטול בלחיצה" / "אפשר לבטל בכל רגע, בלחיצה." → "ביטול אונליין בכל רגע" / "אפשר לבטל אונליין בכל רגע." (R17)
37. **Line 1482:** "{brand} שמסתיים ב-{last4}" → "כרטיס {brand} שמסתיים ב-{last4}". (H-m5)
38. **Line 1499:** doc-type label "חשבונית מס/קבלה" → "חשבונית מס-קבלה"; the empty-state text → "חשבונית מס". (R19b)
39. **Line 1570:** → "ההחזר יוצא תוך 14 יום לכל היותר (בדרך כלל באותו יום) לכרטיס שבו שילמתם". (H-m21)
40. **Line 1573:** "על {months} החודשים" → `{months, plural, one {על החודש} two {על החודשיים} other {על # החודשים}}`. (R24)
41. **Lines 1696, 1705, White label:**
    - append to the explanation: "בלי תוכנית סוכנות פעילה הדפים חוזרים להציג את המיתוג שלנו";
    - acceptance: add a downgrade case. (R3)
42. **Line 1746:** "המשך לשלב הבא" → "השלב הבא". (R19a)
43. **Lines 1794-1841, admin quoted UI:** "דו־שלבי" → "דו-שלבי". (R19e)
44. **Team and cross-refs:**
    - line 1669 `changeMemberRole` → "(RPC `change_member_role`, חלק 04 §9.5)" (R12);
    - line 2131 cross-ref "2 סרטונים ראשונים בחינם" → "{trialCredits} קרדיטים לניסיון (R16)". (R12, R16)

### F04 — `parts/04-data-api.md` (36 edits)

1. **§1.2 item 14 (line 49):** "Network restrictions לפרודקשן (…)" → the R15 text, with compensating controls and the `DECISIONS.md` note. (R15)
2. **§1.3 Supabase auth templates:**
    - lines 59, 68, 83 → "ל{{BRAND_NAME}}" / "ב{{BRAND_NAME}}";
    - line 6139 OTP template likewise;
    - magic-link HTML: `<table role="presentation" dir="rtl" …>` and `<td align="right" style="text-align:right">`. (R18, H-m20)
3. **§3 0001 (line 287):** add the global `alter default privileges revoke execute on functions from public;` above the per-schema line and fix the comment. (R9)
4. **DDL `credit_grants` (line ~1110):** add `expired_at timestamptz`. (R13)
5. **DDL `credit_reservations` (lines 1129-1130):** comments "spend_credits only" → "begin_spend only". (R8)
6. **DDL `share_links` (line 1365):** delete `show_branding`. (R3)
7. **§9 helpers (lines 1778, 1825, 3229):** apply the R39 access check to `billing_workspace_id`, `workspace_plan` and `is_version_locked`. (R39)
8. **§9.5 `accept_invite` (line 2013):** add the billing-row lock before `seats_used`. Add `change_member_role` (full body per R12). Invite creation takes the same lock. (R12)
9. **§9 new function `effective_white_label(p_ws)`** (R3 body); service_role only. (R3)
10. **§10.1 key list:** add `expire:cap:{grantId}:{ref}` and `spend:{scope}:{key}:{attempt}` (`begin_spend`, plus `:capture`/`:settle` by `commit_spend`). (R13, R8)
11. **§10.2:**
    - `_expire_due_grants` (line 2307): `clock_timestamp()` plus `expired_at`;
    - `_return_to_grants` (line 2347): the condition per R13;
    - new `cap_rollover(p_ws, p_cap, p_ref)`. (R13)
12. **`expire_credit_grants()` (line 2665):** a per-workspace sub-block with an exception handler. (R13)
13. **§10.3 `spend_credits` (line 2591):** replace it with `begin_spend` + `commit_spend` (R8). Also update:
    - the table row at line 2883 ("פעולת LLM אינטראקטיבית");
    - lines 5465, 5469;
    - pgTAP lines 6338, 6373. (R8)
14. **§10.5 `get_credit_summary` (line 2755):** `nullif(pl.monthly_credits, 0)` plus the doc line "null = אין מכסה חודשית". (R6)
15. **§10.8:**
    - `billing_apply_payment` doc: "`p_amount_ils` בשקלים עשרוניים (`fromAgorot(ev.amountAg)`)";
    - `billing_apply_plan_change`: "`p_quote` = `quoteToDb(q)` עם `charge_now_ils`/`new_price_ils` עשרוניים";
    - `billing_apply_*` call `cap_rollover` (R13). (R1, R13)
16. **§11.1 `search_hooks` (lines 2976-3020):** add the R2 return columns and the `seasons` join. (R2)
17. **§11.2 `claim_idempotency_key` (around line 3099):** `interval '5 minutes'` → `interval '6 minutes'`. (R8)
18. **§12.2 grants (lines 3431-3459):**
    - add `public.scenes` and `public.consents` to the server-only revoke list;
    - delete `grant update (role) on public.workspace_members to authenticated` (and the preceding revoke stays). (R7, R10, R12)
19. **§12.3 matrix:**
    - `scenes` (line 3487): insert/update/delete → "שרת בלבד (§19.6)";
    - `consents` (line 3498): insert → "שרת בלבד (§21.4)";
    - `workspace_members` update → "RPC `change_member_role`". (R7, R10, R12)
20. **§12.4:** drop the policies `scenes_insert`, `scenes_update`, `scenes_delete` (lines 3627-3640), `consents_insert_own` (line 3703) and `members_update_admin` (line 3523). (R7, R10, R12)
21. **§12.6 (lines 3727-3757):**
    - grant `change_member_role(uuid, uuid, public.member_role)` to authenticated;
    - rewrite the sentence at line 3757 per R9;
    - add the per-migration revoke rule. (R9, R12)
22. **§13.1 `public-media` path list (line 3780):** add `hooks/{hook_id}.jpg` (poster). (R2)
23. **§16 seed checker (around line 4296):**
    - `HookSeed.superRefine`: `HE010`, at most 12 words, counting tokens that contain a letter or digit (not "–" or "₪");
    - `HE020`: no `(` or `)` in `text_he`;
    - `plans.is_highlighted` comment "→ התג "מומלץ"". (H-m15, R21)
24. **§18.5 (line 5095):** "נתיבי AI אינטראקטיביים 120 שניות" → "300 שניות, עם תקציב זמן פנימי של 240 שניות (חלק 05 §2.2)". (R8)
25. **§18.7 (lines 5160-5167):** "פחות מ-5 דקות" → "פחות מ-6 דקות"; rewrite the last sentence per R8. (R8)
26. **§19.6 scene routes:** state that writes use the secret client after `is_version_locked` and edit moderation, since there is no direct-table path any more. (R7)
27. **§19.8 step 3 (line 5566):** replace the testimonial sentence with R4 (1)–(3). Add the same check to step 3 of `regenerate`. (R4)
28. **§20.3 `HookCardDTO` (line 5692):** add the fields (R2) and the `toHookCardDTO(row)` mapper note (poster derivation). (R2)
29. **§20.5:**
    - `ShareCreateBody.expiresInDays` comment → R5;
    - line 5781: replace "`show_branding = !workspace.white_label`" with "המיתוג נקבע בזמן הצגה ושליחה: `resolveShareBranding(link)` ← `effective_white_label(link.workspace_id)` (§9)";
    - line 5786 (`/v`, `/approve`) reads it at every render. (R5, R3)
30. **§21.2:**
    - add the note "שדות כסף ב-JSON הם שקלים עשרוניים (`…Ils`), מסודרים ב-`toIlsNumber`; בקוד החיוב הפנימי — `Agorot` (`…Ag`)";
    - `RefundQuote`/`PlanChangeResponse` comments → serialized by `toApiRefundQuote`/`toApiPlanChange`. (R1)
31. **§21.4:**
    - `ConsentBody` narrowed per R10;
    - line 5968 "דרך הלקוח שלו" → "`recordConsent()` בלקוח הסודי, עם allow-list של (kind, source)";
    - line 1619 unchanged. (R10)
32. **§22.2 (line 6033):** replace the declaration with `import { verifyOpenRouterSignature } from "@/lib/ai/openrouter/webhook"` (canonical signature in Part 05 §5.2; it accepts any of several `v1=`). (R33)
33. **§23 crons:**
    - `sweep-jobs` (line 6176): item (2) "ביטול הריצה הקודמת ואז הפעלה מחדש; `error_detail.restarts`"; item (3) "60 דקות" → "120 דקות"; new item (5) orphaned interactive spends (R8);
    - `hook-of-the-day` (line 6179): R26 text;
    - `reminders` (line 6180): "`balance < lowThreshold(summary, planId)` (`lib/billing/credits.ts`)";
    - `revalidateTag('hooks:hotd')` → `revalidateTag('hooks:hotd', "max")`. (R31, R8, R26, R6, R38)
34. **§24.2 (line 6252):** `changeMemberRole` → "`rpc('change_member_role')` עם הלקוח של המשתמש (בדיקת המושבים בתוך הפונקציה, בנעילה)". (R12)
35. **§25 pgTAP, add:**
    - the execute allow-list test;
    - authenticated writes on `scenes` denied;
    - authenticated INSERT on `consents` denied;
    - direct role UPDATE denied, plus `change_member_role` past seats → `PLAN_LIMIT`;
    - expiry "return after expiry" and "cap, then natural expiry";
    - a `begin_spend` without commit is refunded by the sweeper function;
    - `effective_white_label` true/false by plan. (R7–R13, R3)
36. **§1.2/§17 env note:** `NEXT_PUBLIC_SUPABASE_URL` may be the custom domain, and CSP and `remotePatterns` derive from it (R35).

### F05 — `parts/05-ai-pipeline.md` (17 edits)

1. **§2.2 `RunContext` (line 316):**
    - add `deadlineAt?: number`;
    - `orFetch` computes the per-attempt timeout per R8;
    - add the sentence "every AI SDK call sets `maxRetries: 0`". (R8)
2. **§3.2 `runStructured`/`repairOnce` (lines 322-365):** repair only if `deadlineAt − now ≥ 30 000`; otherwise throw `PROVIDER_TIMEOUT`, which leads to a refund. (R8)
3. **§3.4 table (lines 388-400):**
    - `spend_credits(…)` **לפני** → "`begin_spend(…)` לפני הקריאה; `commit_spend(res)` אחרי ששמירת הגרסה הצליחה; בכשל `refund_reservation`; פונקציה שנקטעה ← ה-sweeper מחזיר אחרי 6 דקות";
    - line 398 "שלפני `spend_credits`" → "שלפני `begin_spend`";
    - acceptance at line 430 → the same flow, plus a test that a killed route is refunded by the sweeper. (R8)
4. **§5.1 `callbackUrlFor` (lines 616-622, 662):**
    - `preview` → `null` (unchanged);
    - `staging` → URL + `&x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}`;
    - production → no bypass;
    - update the prose and acceptance. (R14)
5. **§5.2 (lines 625-643):** the R33 canonical signature, parsing all `v1` values. Add a test with two `v1` values. (R33)
6. **Line 708:** `revalidateTag("ai:registry")` → `revalidateTag("ai:registry", "max")`. (R38)
7. **§9 section 4 (line 1008):** add "הדוגמאות (few-shots) עוקבות אחרי אותו כלל" (consistency with R22; no change to the rule).
8. **§11.1 (line 1957):** `end_card.headline_he` → `.max(30)` plus a refine of at most 6 words. (R29)
9. **§18 (line 2681):** duration wording → R32. (R32)
10. **§18.2 `startJob` (line 2702 comment):** "immutable PipelinePlan (ids only) + `jobs.options.scenes_digest`" (R7). Add the digest check paragraph to §18.3/§18.4 for the `keyframe`, `clip`, `voice` and `render` steps. (R7)
11. **§18.3 `runStep` (line 2808):** before `markRunning`, `if (await jobTerminal(jobId)) throw new CanceledError(jobId)` (status `failed`/`canceled`). `finalize` makes the same check and never sets `succeeded` on a terminal job. (R31)
12. **§18.6 table (line 2868):** the >50% keyframes row → `VIDEO_JOB_FAILED` / `errors.VIDEO_JOB_FAILED`. (R30)
13. **§19.4 sweeper (lines 3000-3006):**
    - (2) → "`orchestrator.cancel(run_id)` ואז `orchestrator.start(jobId)`; `error_detail.restarts += 1`; ב-2 ← `failJob(PROVIDER_TIMEOUT)`";
    - (3) 60 → 120 minutes;
    - new (7) orphaned interactive spends (R8). (R31, R8)
14. **§20.9 fonts (lines 3243-3265):** `loadRenderFonts()` per R34; the prose matches. (R34)
15. **Watermark lines 3215, 3279:** "נוצר ב-{{BRAND_NAME}}" → "נוצר ב{{BRAND_NAME}}". (R18)
16. **§21.3 (line 3392):** align with R4. Testimonial requires `consent_attested` **and** the attestation; other flagged scripts require only the attestation. (R4)
17. **HE lint table (lines 3484-3505):** add `HE020 | סוגריים בהוק, בטקסט על המסך או בקריינות | error`. Lines 1304/HookBatch validation also runs `HE020`. (H-m15)

### F06 — `parts/06-billing-legal-ops.md` (40 edits)

1. **§1.4 `money.ts` (lines 49-70):**
    - add `toIlsNumber`;
    - rule 1 gets a "naming" sentence (R1 table);
    - add the ESLint naming rule and the R1 unit tests to §18.2. (R1)
2. **§2.4 rollover cap (line 204):** "עודף פג מיד (שורת `expire` …)" → "…דרך `cap_rollover(ws, cap, grantingKey)` (חלק 04 §10.2), מפתח `expire:cap:{grantId}:{grantingKey}`". (R13)
3. **§2, new subsection §2.6 `lib/billing/credits.ts`:** `perVideoCredits`, `videosLeft`, `lowThreshold` (R6 formulas), referenced by P1/P3/P4. (R6)
4. **§4.1 disclosure (lines 255-258):**
    - line 256 → R17 disclosure sentence;
    - line 257 "(ולא יותר מ-₪100)" → "(ולא יותר מ-{feeCap})";
    - line 258 "חשבונית מס/קבלה תישלח" → "חשבונית מס תישלח". (R17, H-m20, R19b)
5. **§4.1 step 5 (line 262):** add "הסכום נשלח כ-`p_amount_ils = fromAgorot(ev.amountAg)`". (R1)
6. **§4.2 `chargeOne` step 3 (line 299):** `amountIls` → `amountAg: toAgorot(sub.price_ils)`. (R1)
7. **§5.3 code (lines 355-380):**
    - `PlanChangeQuote` fields → `chargeNowAg`/`newPriceAg`;
    - `q.chargeNow` → `q.chargeNowAg` (lines 369-372);
    - `amountIls: Number(fromAgorot(q.chargeNow))` → `amountAg: q.chargeNowAg`;
    - `p_quote: q` → `p_quote: quoteToDb(q)` (both calls);
    - line 339 stays (API `newPriceIls`). (R1)
8. **§5.4 table (after line 400):** add the `white_label` row (R3 consequence text). (R3)
9. **§8.1 types (lines 520-545):** `VerifiedPaymentEvent.amountAg`; `PaymentProvider` methods take `amountAg: Agorot`. (R1)
10. **§8.2 Grow table (lines 557-560):**
    - `sum` = `fromAgorot(amountAg)`;
    - `parseWebhook` maps `data.sum` → `toAgorot`;
    - `notifyUrl` gets the bypass parameter in staging (R14). (R1, R14)
11. **§9.1 (lines 619-621):** rename the `InvoiceLine`/`PaymentRecord` fields per R1. (R1)
12. **§10.5 (lines 783-806):** rename the `RefundQuote` fields and `quoteRefund` input. The API route returns `toApiRefundQuote(q)`. (R1)
13. **§10.6:**
    - step 3 (line 830): `amountIls: refund` → `amountAg: quote.refundAg`;
    - step 4: `refunded_ils += refund` → `refunded_ils += fromAgorot(quote.refundAg)`;
    - add the ₪98.17 unit test. (R1)
14. **§10, L-01 (line 859):** "(§18.6)" → "(§18.5)". (C-m7)
15. **§10, L-13 (line 871):** "ביטול בלחיצה" → "ביטול אונליין (שתי לחיצות, בלי שיחת שימור)". (R17)
16. **§11.4:**
    - consents: "כל שורת `consents` נכתבת בשרת דרך `recordConsent()`; אין INSERT ישיר מהדפדפן";
    - add the (kind, source) allow-list. (R10)
17. **§11.6 (line 942):** OpenRouter wording → R37. (R37)
18. **§11.8 (line 959):** the `low_credits` definition → "`low_credits` — הודעת שירות עובדתית: יתרה, מועד חידוש וקישור לעמוד החיוב, בלי מחירים, בלי חבילה או תוכנית מוצעת ובלי כפתור רכישה ⚖️". (R11)
19. **§11.11 (line 984):** cite the rules' name per R36. (R36)
20. **§12.1 senders (line 1018) and footer (line 1048):** "ב-White label" → "כש-`resolveShareBranding(link).whiteLabel`". `{agencyName}` = the billing (agency) workspace name. (R3)
21. **R18 prefix fixes in email, WhatsApp and legal copy:**
    - lines 655, 978, 1046, 1047, 1089, 1135, 1169, 1177-1180, 1200, 1219, 1242, 1276, 1287, 1334, 1345, 1369, 1373, 1452, 1456, 2482 → "ב{{BRAND_NAME}}" / "ל{{BRAND_NAME}}" / "מ{{BRAND_NAME}}";
    - lines 1305, 1317, 1318, 1324, 1328 → "מאת {agencyName}" / "מאת {approverName}" / "הזמנה מאת {inviterName}";
    - line 1323 `ל-"{workspaceName}"` → `ל"{workspaceName}"`. (R18)
22. **`welcome`:**
    - line 1089 subject → "ברוכים הבאים ל{{BRAND_NAME}}";
    - line 1094 → "…{trialCredits} קרדיטים לניסיון — מספיק בערך לשני סרטונים קצרים באיכות טיוטה, עם סימן מים, בלי כרטיס אשראי.";
    - line 1101 no-trial variant → R11 variant text (delete `minPackCredits`/`minPackPrice`). (R16, R11)
23. **`video_ready` (lines 1112, 1117), plural:** `degradedCount` scenes, `refundedCredits`, `credits`. (R24)
24. **`video_failed_refunded` `reasonHe` (line 1132):** per R30. (R30)
25. **Invoice wording at lines 641, 709, 728, 874, 1135, 1151, 1169, 2778:**
    - document-type mentions → "חשבונית מס-קבלה";
    - generic → "חשבונית מס". (R19b)
26. **Line 1146:** "אי־פעם" → "אי-פעם". (R19e)
27. **Line 1158:** "{cardBrandHe} שמסתיים ב-{last4}" → "כרטיס {cardBrandHe} שמסתיים ב-{last4}". (H-m5)
28. **Line 1165:** "ולא יותר מ-₪100" → "ולא יותר מ-{feeCap}". (H-m20)
29. **Cancellation emails (lines 1220, 1227, 1248):** "בלחיצה" → "אונליין בעמוד החיוב". (R17)
30. **`low_credits` (lines 1286-1297):** replace it with the R11 canonical template. `videosLeft` = `videosLeft(balance, planId)`. (R11, R6, R24)
31. **R24 plurals:** lines 232, 405-408, 652-655, 1112, 1117, 1141-1145, 1212, 1225, 1236, 1271, 2015. (R24)
32. **§14.2:** add `hook_niche_page` to the `location` of `hooks_searched` (line 1502) and `faq_expanded` (line 1505). (C-m11)
33. **Line 1574:** "imported from lib/supabase/enums.ts and lib/errors.ts" → "WizardStep, AspectRatio: `lib/api/contracts/common.ts`; CancelReason: `lib/api/contracts/billing.ts`; JobStage, BillingCycle, NotificationKind: `ENUMS` ב-`lib/supabase/enums.ts`; ErrorCode: `lib/errors.ts`". (C-m8)
34. **§15.3 CSP (lines 1682-1685):** derive the Supabase origin per R35. (R35)
35. **§15.5 (line 1729):** `splitSecrets` → `secretList`. (R33)
36. **§15.11 and §19.3:** DB network restriction per R15; `backup.yml` and `migrate-production` notes. (R15)
37. **§19.1 (line 2083) and §19.3:**
    - staging row protection → "Vercel Authentication + Protection Bypass for Automation";
    - the bypass rule;
    - new workflow `staging-crons.yml`;
    - `smoke-staging` calls `billing-renewals`;
    - CI secret `CRON_SECRET_STAGING` (lines 2184, 2274);
    - §20 runtime env `VERCEL_AUTOMATION_BYPASS_SECRET` (preview/staging). (R14)
38. **Lines 2215, 2887:** apply the `maxDuration` exception for the WDK step routes and the test scope per R32. (R32)
39. **Line 2324:** `check-content --launch` exempts `{{DPO_NAME}}`. (R40)
40. **Line 2359:** `revalidateTag(...)` → `revalidateTag(..., "max")`. Add to §25 open decisions:
    - ⚖️ `low_credits` classification (R11);
    - the DB network restriction (R15). (R38, R11, R15)

### FAPPX — `parts/90-appendices-d-e.md` (11 edits)

1. **App D ex. 1 `vo_he` (lines 346, 487):** "…ב-{מחיר} שקל. ויוצאים מפוצצים." → "…ב-{מחיר} ₪. ויוצאים מפוצצים." (R22)
2. **Line 574:** "בקריינות לתצוגה: `ב-{מחיר} שקל`" → "בקריינות לתצוגה: `ב-{מחיר} ₪` (לפי `shekel_format`)". (R22)
3. **Golden table (line 2568), row 1:** input → `ב-{מחיר} ₪` (the output "במאה ארבעים ותשע שקל" is unchanged). (R22)
4. **App E §6.3 "מחיר" row (line 3044), `vo_he` cell:** → "ב-149 ₪ (`suffix`) / ב-₪149 (`prefix`)". (R22)
5. **App E §9 (line 3143), hyphen row:** add "אחרי אות שימוש לפני משתנה עברי (`{{BRAND_NAME}}`, שמות) — בלי מקף; לפני שם שמגיע בזמן ריצה — מנסחים בלי אות שימוש (חלק 00 §6.5)". (R18)
6. **App E §12 (line 3223) length/punctuation table:** add the row "סוגריים בהוק, בטקסט על המסך או בקריינות | `HE020`". (H-m15)
7. **App E §13.2 niqqud:** line 3275 "בְּרֵכָה" → "בְּרֵיכָה"; line 3283 "בֹּקֶר" → "בּוֹקֶר". (H-m14)
8. **App E (line 3338), testimonial rule:** align with R4 (testimonial: `consent_attested` **and** the attestation; other scripts with the flag: the attestation only; the server enforces it). (R4)
9. **App E (line 3392) row 20:** "₪119 לחודש · כולל מע״מ · ביטול בלחיצה" → "…· ביטול אונליין בכל רגע". (R17)
10. **App E §11.3/acceptance (line 3216):** add "כותרת כרטיס הסיום: Zod `max(30)` + עד 6 מילים בחלקים 04 ו-05". (R29)
11. **App E copy rules section:** add the ICU plural rule (R24) and the "no raw bidi marks / no maqaf in copy" rule (R19d/e) to the acceptance list.

### QS — `/home/user/NewPlatform/PROMPT-QUICKSTART.md` (22 edits)

1. **Lines 73, 85:** "ביטול בלחיצה" → "ביטול אונליין בכל רגע". (R17)
2. **Line 246:** "נוצר ב-{{BRAND_NAME}}" → "נוצר ב{{BRAND_NAME}}"; line 340 "שנוצרו ב-{{BRAND_NAME}}" → "שנוצרו ב{{BRAND_NAME}}". (R18)
3. **Line 322:** "בעברית מושלמת" → "בעברית טבעית". (H-m12)
4. **Line 325 TrustRow:** "2 סרטונים ראשונים בחינם" → "{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי". (R16)
5. **Line 328 EnginesStrip:** → the F02-E12 string. (H-m12)
6. **Line 336:** H2 → "מה שעורך הווידאו עשה, עכשיו בכמה לחיצות". (H-m12)
7. **Line 344:** "ומבטלים בלחיצה" → "ומבטלים אונליין בכל רגע". (R17)
8. **Line 354:** meta description ending → "{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי." (R16)
9. **Line 375:** "מבצע / חג" → "מבצע או חג". (H-m9)
10. **Line 386:** "חוזר לדשבורד" → "חוזר לדף הראשי". (H-m9)
11. **Line 392:** "סרטון ב-3 קליקים" → "סרטון ב-3 לחיצות". Add after the preview step "(3 קרדיטים: תסריט + סצנות; הצפייה עצמה לא עולה קרדיטים נוספים)". (H-m9, R23)
12. **Line 396 (ConfirmGenerateDialog):** "יישארו {balance} קרדיטים", "{credits} קרדיטים", "חסרים {missing} קרדיטים" → ICU plural note "(כל ספירה ב-ICU plural)". (R24)
13. **Line 400:** "נשארו בערך {minutes} דקות" → the minutes plural; "כל {credits} הקרדיטים חזרו" → plural. (R24)
14. **§7.3 (line ~446):** "כתיבה לטבלאות כספיות, לעבודות, ליומנים ולהגדרות" → "…, לעבודות, **לסצנות, להסכמות**, ליומנים ולהגדרות". Add "שינוי תפקיד חבר רק דרך `change_member_role`". (R7, R10, R12)
15. **§7.4 functions (line 450):**
    - `spend_credits` → "`begin_spend` / `commit_spend` (פעולות LLM אינטראקטיביות: שמירה לפני, חיוב אחרי שמירת התוצר)";
    - add `effective_white_label`, `change_member_role`, `cap_rollover`;
    - add the bullet "פונקציות פרטיות כברירת מחדל: revoke גלובלי ב-0001 + revoke בכל מיגרציה + בדיקת allow-list". (R8, R3, R12, R13, R9)
16. **Line 535:** "(**הכי פופולרי**)" → "(**מומלץ**)". (R21)
17. **Line 554 promises:** "ביטול מנוי בלחיצה" → "ביטול מנוי אונליין בכל רגע". (R17)
18. **Line 559:** after "כל חשבון כספי באגורות שלמות" add "(`Agorot`, שמות `…Ag`; במסד, ב-API ובממשק — שקלים עשרוניים `…_ils`/`…Ils`; ממשקי הספקים מקבלים `Agorot` והמתאם ממיר)". (R1)
19. **Lines 562, 644:** "חשבונית מס/קבלה לכל תשלום" → "חשבונית מס לכל תשלום (מסמך מסוג חשבונית מס-קבלה)". (R19b)
20. **Line 569:** consents → "…— נכתבות בשרת בלבד, עם גרסה, IP ומקור". (R10)
21. **Line 573 emails:** add "`low_credits` הוא הודעת שירות עובדתית בלי מחירים ובלי הצעת רכישה ⚖️". Add a §9.3 bullet: "עמוד האישור ומייל האישור קובעים White label בזמן הצגה (תוכנית הסוכנות הנוכחית)". (R11, R3)
22. **New one-line items:**
    - in the wizard rules, "בדיקת אישורי הציות (`brief.attestations`) נאכפת גם בשרת (`422 MISSING_FACTS`)" (R4);
    - in the share section, "קישור אישור לקוח: 14/30/90 יום, תמיד עם תוקף" (R5). (R4, R5)

### FSPEC — `spec.md` (Appendix F errata) (9 edits)

1. **E15 (line 1257):** `POST /api/share` → `201 { url, shareLinkId, expiresAt, emailSent }`. (C-m1)
2. **E18 (line 1260):** "multipart, 10 MB" → "multipart, PDF ≤ 4 MB (Vercel 4.5 MB body limit)". (C-m1)
3. **Line 463 `share_links`:** delete `show_branding …`. Add "branding resolved at render time (`effective_white_label`)". (R3)
4. **Line 501:** `spend_credits` → `begin_spend` + `commit_spend` (R8 semantics). (R8)
5. **Line 654:** "`maxDuration` 120 s" → "300 s with a 240 s internal deadline". (R8)
6. **Lines 996, 1003:** "(הכי פופולרי)" / badge → "מומלץ". (R21)
7. **Lines 224, 898, 928:** prefix-hyphen fixes per R18. Line 1005 "ביטול בלחיצה" → "ביטול אונליין בכל רגע". (R18, R17)
8. **E46 (storage):** add the two sessionStorage keys. (R28)
9. **Add errata row E-R1:** "Money units: `_ils`/`Ils` decimal, `Ag` integer agorot internal (Part 06 §1.4)". (R1)

### SEED — `/home/user/NewPlatform/seed/*.json` (3 edits; required together with F04-E23)

1. **`hooks.json`, rewrite** (keeping `placeholders: []`, numbers and compliance notes):
    - `real-estate-01` → "3 דברים לבדוק לפני שחותמים על דירה. על השלישי פחות מדברים"
    - `mortgage-advisors-05` → "מיתוס: "20 שנה אנחנו בבנק, יתנו לנו את הריבית הכי טובה""
    - `zimmers-boutique-hotels-03` → "3 דברים לבדוק לפני שמזמינים צימר. השלישי נשכח כמעט תמיד"
    - `lawyers-05` → "מקרה אמיתי, בשינוי פרטים: וואטסאפ אחד כמעט עלה ללקוח 400 אלף ₪"
    - `barbers-salons-09` → "תספורת לחתונה: מתי לקבוע תור? רמז: לא יום לפני"
    - `fitness-trainers-09` → "ככה נראית ארוחת בוקר של מאמן כושר, וזה לא מה שחשבתם"
    - `dentists-02` → "3 סימנים שאולי צריך טיפול שורש. השלישי מפתיע"
    - `ecommerce-03` → "3 סיבות שבגללן לקוחות חוזרים אלינו. השנייה הפתיעה גם אותנו"
    - `accountants-06` → "הטעות הכי יקרה שראיתי השנה. ולא, זה לא היה לקוח שלי"
    - `insurance-agents-09` → "יום בחיים של סוכן ביטוח, וזה לא רק טפסים"
    - `djs-musicians-03` → "3 שירים שאסור לשים בחתונה. השלישי יפתיע אתכם"
    - `vets-dog-grooming-02` → "3 מאכלים מהמטבח שמסוכנים לכלבים. השני נמצא כמעט בכל בית"
2. **`seasons.json`:** "ולנטיינז" → "ולנטיין (יום האהבה)". Its SEO page uses frontmatter `h1` "הוקים לוולנטיין".
3. **`niche_extras.json` short names** (generated from the P2 niche table): `yoga-pilates` → "מורי יוגה ופילאטיס"; `djs-musicians` → "דיג׳ייז ומוזיקאים".

---

## §3. Post-edit grep checklist (must return 0 hits unless noted)

- **Money:** `amountIls: Agorot|paidIls: Agorot|refundIls: Agorot|netIls: Agorot|amountIls: number` in P6; `spend_credits` in all files (incl. spec, QS); `show_branding` in all files.
- **Hooks:** `type HookCardDTO` in P2; `variant.*"default"` for `HookCard`.
- **Hebrew:**
  - `[ובלמהשכ]-\{\{BRAND_NAME\}\}` in all files;
  - `בלחיצה` near ביטול/לבטל/מבטל in all files (P3:1558 page-access phrase allowed);
  - `הכי פופולרי` outside App E's negative example (AppE:3373);
  - `חשבונית מס/קבלה`;
  - `לבערך`, `זה הזמן לפרסם`, `המשך לשלב הבא`, `לא חויבתם`, `מושלמת`, `המובילים בעולם`;
  - `2 סרטונים ראשונים בחינם`, `תצוגה מקדימה בחינם`, `בלי עלות:`.
- **Bidi and maqaf:** U+200E/U+200F inside `**"…"**` or JSON string copy (python scan from verify); U+05BE inside quoted copy.
- **SQL:** `interval '5 minutes'` in `claim_idempotency_key`; `consents_insert_own`; `scenes_update`; `grant  update (role)`.
- **Misc names:** `splitSecrets`; `error_detail.restarted`; `revalidateTag\('[^']*'\)` (single-argument form); `60 דקות` in the sweeper rows.
