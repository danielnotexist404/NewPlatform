# Verify — technical & factual accuracy + security (read-only)

Scope: parts 00–06 and 90 against `docs/research/04-openrouter.md`, `05-stack.md` and `06-israel.md`. Each file's Verification addendum was treated as overriding the text before it. Every line number below comes from `grep -n` on `scratchpad/build/parts/*`.

**Counts:** 0 blocker · 9 major · 11 minor.

**Checked and correct (no finding):**
- **OpenRouter:**
  - Endpoints: `/chat/completions`, `/images`, `/videos` (202 response and polling), `/videos/{id}/content` with Bearer, `/audio/speech` (raw bytes), and `/audio/transcriptions` with `input_audio{data,format}`.
  - Headers: `HTTP-Referer` and `X-OpenRouter-Title`. The deprecated `usage.include` is not used.
  - Video webhooks: the `X-OpenRouter-Signature` and `X-OpenRouter-Idempotency-Key` headers, four terminal statuses, raw-body verification, and `[M0-verify]` on the `t=…,v1=…` format.
  - All route slugs (`gpt-6.1-sol`, `wan-3.0`, `claude-opus-5`, no Sora) and the list prices. ElevenLabs is budgeted at list price after the discount ends at 2026-10-19 15:00Z.
- **Stack:**
  - AI SDK v6 with provider v2 pinned. Next 16 `proxy.ts` on Node.
  - Vercel: 300/800/1800-beta, 4.5 MB, Pro required.
  - Supabase: new keys, every function `security definer` with `set search_path = ''`. Realtime private channels with `realtime.messages` policies and `realtime.send` (`[M0-verify]`).
  - Remotion license terms, Sandbox limits, and Edge limits.
- **Credit engine:** lock order, re-checks under the lock, and idempotency. I hand-traced the reserve, capture, settle and refund paths.
- **Israel:** VAT examples recomputed and correct; 18% read from `app_settings`; allocation schedule of ₪10k then ₪5k from 2026-06-01; IS 5568 = WCAG 2.0 AA; ₪1M exemption; Amendment 13 from 2025-08-14; ss.13ד and 14ט; 5% or ₪100; 4-month extended period; ₪1,000 per spam message; "פרסומת:"; election mode ends 2026-10-28 23:59 +02:00 (Israel is on IST after 2026-10-25).

---

## MAJOR

### M1 — Editors can rewrite `scenes` directly through PostgREST, bypassing the version lock, moderation and election mode
- **Where:**
  - P4 §12.3 line 3487: `` `scenes` | member … | editor+ | editor+ | owner/admin ``
  - P4 §12.4 lines 3627–3640 (`scenes_insert`, `scenes_update` check only the project's workspace and role)
  - P4 §12.2: no column-level narrowing for `scenes`
  - P4 §11.3: no guard trigger on `scenes`
- **Why it is wrong:**
  - The version lock ("a version is locked for edits (script and scenes) once any job used it") and the moderation of edited prompts exist only in the Route Handler (P4 §19.6: `409 version_locked`; `imagePromptEn` "מתקדם" only).
  - With the publishable key and their own JWT, an editor can run `update scenes set image_prompt_en=…, onscreen_text_he=…, status='ready', clip_asset_id=…` at any time, including on a version that a running job is using.
  - The pipeline reads scenes from the DB in every step (P5 §18.1 invariant 5), so unmoderated image prompts and on-screen Hebrew text reach the image model and Remotion. That includes real politicians during election mode (P6 L-20, §11.11) and sexual content.
  - The integrity rules of P4 §19.6 are also lost: hook scene first, duration 1.5–12 s versus the DB's 0.5–20 s, `userAssetId` kinds.
  - The P4 review already closed the same class of hole for `project_versions`, `share_links` and `assets` (review-p4 B19–B21) but missed `scenes`.
- **Fix (P4 owns this):**
  - `revoke insert, update, delete on public.scenes from authenticated;` and drop `scenes_insert`, `scenes_update` and `scenes_delete`. Scene writes go only through `PATCH/POST/DELETE …/scenes*`, which use the secret client after `is_version_locked` and moderation.
  - Alternatively, add a `scenes_guard` BEFORE UPDATE trigger that, when `auth.uid()` is not null, raises `EDIT_CONFLICT {version_locked}` if `is_version_locked(old.version_id)` and forbids changes to `status`, `keyframe_asset_id`, `clip_asset_id`, `degraded_reason` and `start_ms`.
  - P5 §18.1/§21: `startJob` snapshots the scene prompts and on-screen texts into `PipelinePlan` after the generate-time moderation, and steps use the snapshot.
  - Add pgTAP: an editor's direct `update scenes … image_prompt_en` on a locked version fails.

### M2 — Users can forge consent records (`consents` INSERT open to `authenticated`)
- **Where:**
  - P4 §12.4 line 3703: `create policy consents_insert_own … with check (user_id = (select auth.uid()) …)`
  - P4 §12.3 line 3498
  - `consents` is not in the "server-only writes" revoke list of §12.2
  - DDL lines 1426–1442: `ip`, `user_agent`, `created_at`, `source`, `kind` and `evidence_path` are all client-settable
- **Why it is wrong:**
  - The consent log is the legal evidence for spam-law opt-in (s.30A), Amendment-13 notices and biometric consent (P6 §11.4, L-05).
  - A user can insert `kind='biometric_voice', source='likeness_flow', evidence_path='…'`, `kind='terms', source='checkout'`, or a back-dated `created_at` and a fake `ip`.
  - P6 §11.4 says `ai_content_policy` is written "**בשרת** … `ConsentBody` הציבורי לא מקבל `generate`". The open table grant defeats that.
  - P4 already exposes `POST /api/consents` (rate-limit bucket `consents`, line 5118), so the direct grant is unnecessary.
- **Fix:**
  - `revoke insert on public.consents from authenticated; drop policy consents_insert_own;`
  - Every consent row is written server-side: `ip` from `ipAddress(req)`, `user_agent` from the header, `created_at = now()`, and an allow-list of `(kind, source)` pairs per route. `biometric_*` is written only by the likeness flow, `ai_content_policy` only by generate, and `terms/checkout` only by checkout.
  - Add pgTAP: an authenticated INSERT into `consents` is denied.

### M3 — Interactive LLM credits are lost when the function times out (timeouts exceed `maxDuration`, and nothing reconciles orphaned spends)
- **Where:**
  - P5 §3.4 line 393: "`spend_credits(…)` **לפני** הקריאה". `spend_credits` (P4 §10.3) does reserve, capture and settle immediately.
  - P5 §2.2 line 150: `chat: { timeoutMs: 110_000, maxAttempts: 3 … }`
  - P5 §3.2 `repairOnce()` adds a second, non-streamed call.
  - The AI SDK `generateText`/`streamText` default to `maxRetries: 2`, and P5 never sets it.
  - P4 §18.5 line 5095: "נתיבי AI אינטראקטיביים 120 שניות"
  - P4 §18.7 line 5167: "תשובת 5xx או זרם שנקטע ← `'failed'` … הניסיון הקודם כבר הוחזר (`refund_reservation`)"
  - P4 §11.2 line 3101: a stale `in_progress` is simply re-run with `attempt+1`
- **Why it is wrong:**
  - One `chat` attempt is allowed 110 s inside a 120 s function, plus retries, OpenRouter `models[]` fallbacks and the repair round. A slow Sonnet script with 6,000 `max_tokens` plus repair easily passes 120 s.
  - When Vercel kills the invocation, the `catch → refund_reservation` never runs.
  - The reservation stays settled (captured), and the idempotency row turns stale after 5 minutes. The retry gets a new credits key, so the user pays twice and the first charge is never refunded.
  - This violates principle 11 in P00 §3 ("יצירה שנכשלה מחזירה קרדיטים אוטומטית") and makes the P4 §18.7 claim false.
- **Fix:**
  1. Give every interactive call a deadline budget: route `maxDuration = 300` (P6 allows up to 300), AI SDK `maxRetries: 0` (OpenRouter `models[]` already falls back), `abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(T)])` with T leaving room for repair, and `POLICY.chat` around 90 s with 1 attempt.
  2. Do not capture before the call. Use `reserve_credits` before, then `capture_credits` and `settle_reservation` only after a valid JSON is persisted, and `refund_reservation` on error. An orphaned reservation then stays `open`.
  3. Add a sweeper step to `/api/cron/sweep-jobs`. It finds interactive reservations (`job_id is null`, `status = 'open'`, or `api_idempotency_keys.status = 'in_progress'` and older than `maxDuration + 60 s`), runs `refund_reservation(res, 'refund:'||res, …)`, and marks the key `failed`.
  4. Correct the P4 §18.7 sentence.

### M4 — The "functions are private by default" guarantee is false; PUBLIC keeps EXECUTE on every function created after 0008
- **Where:**
  - P4 §3 line 287: `alter default privileges in schema public revoke execute on functions from public, anon, authenticated;`
  - P4 §12.6 line 3757: "ה-`revoke … on all functions` … לא חל עליהן … ברירת המחדל שנקבעה ב-0001 … דואגת שהן ייווצרו פרטיות"
- **Why it is wrong:**
  - Postgres grants EXECUTE to PUBLIC by **global** default.
  - A per-schema `ALTER DEFAULT PRIVILEGES … IN SCHEMA … REVOKE` cannot remove a global default. The Postgres docs say: "you cannot revoke privileges per-schema if they are granted globally … Per-schema REVOKE is only useful to reverse the effects of a previous per-schema GRANT".
  - So every function created in 0009–0012 and in every future migration (0013+, v2 likeness, billing patches) is callable by `anon` and `authenticated` through `/rest/v1/rpc` via PUBLIC.
  - That includes `security definer` functions that run as `postgres`. Today's exposure is small (`storage_ws`, `storage_upload_allowed`, `realtime_topic_allowed`), but the documented safety net does not exist.
  - The acceptance test only probes `reserve_credits`.
- **Fix:**
  - In 0001, also run the global form without `in schema`: `alter default privileges revoke execute on functions from public;`. Keep the per-schema revoke for Supabase's per-schema grants to `anon`/`authenticated`.
  - End every later migration with an explicit `revoke execute on function … from public, anon, authenticated;` before its own grants.
  - Add pgTAP that lists every `public` function where `has_function_privilege('anon', p.oid, 'execute')` and compares it to the exact allow-list of §12.6.

### M5 — Seat limits can be bypassed by updating `workspace_members.role` directly (and `accept_invite` has a race)
- **Where:**
  - P4 §12.2 `grant update (role) on public.workspace_members to authenticated`
  - P4 §12.4 line 3523 `members_update_admin` (only `role <> 'owner'`)
  - P4 §24.2: `changeMemberRole` "העלאה מ-`viewer` ל-`editor`/`admin` בודקת את מגבלת `seats`". The check is in app code only, and the action uses the user client.
  - P4 §9.5 `accept_invite`: the seat check locks only the invite row.
- **Why it is wrong:**
  - Since D-042, viewers are free and unlimited. An owner or admin can invite any number of viewers, then run `update workspace_members set role='editor'` via PostgREST. That gives unlimited paid seats on a 1-seat plan (₪119 instead of ₪289/₪990).
  - `enforce_plan_limits` runs only on downgrade.
  - Two concurrent `accept_invite` calls for different invites can both pass `v_used >= v_seats`.
- **Fix:**
  - Revoke `update(role)` from `authenticated`. Add a `security definer` RPC `change_member_role(p_ws, p_user, p_role)` that:
    - takes `_lock_balance(billing_workspace_id(p_ws))`, or a `select … for update` on the billing `workspaces` row;
    - re-checks `seats_used < seats` when moving from viewer to a seat role;
    - forbids `owner`;
    - writes `audit_logs`.
  - Take the same lock in `accept_invite` before counting.
  - Add pgTAP: a direct UPDATE fails, and two concurrent accepts on the last seat produce one success and one `PLAN_LIMIT`.

### M6 — Credit expiry can hit a duplicate key that blocks a workspace and the nightly expiry job
- **Where:**
  - P4 §10.2 line 2322: `_expire_due_grants` inserts the ledger key `'expire:' || g.id`. The ledger has a `unique` on `idempotency_key` (DDL line 1257).
  - P4 §10.2 line 2347: `_return_to_grants` decides whether a grant is still valid with `g.expires_at > now()`, where `now()` is the transaction start time.
  - P6 §2.4 line 204, rollover cap: "עודף פג מיד (שורת `expire` …)". No key and no SQL helper are defined, and the canonical key list in P4 §10.1 offers only `expire:{grantId}`.
- **Why it is wrong:**
  - **Failure mode (a):** an implementer writes the partial rollover-cap expiry with `expire:{grantId}`. When the rest of that grant expires naturally, `_expire_due_grants` raises a unique violation.
  - **Failure mode (b):** a transaction that started just before a grant's `expires_at` and waited on the balance lock still sees `now() < expires_at`. While `expire_credit_grants()` (one transaction for all workspaces) holds that lock and expires the grant, the waiting transaction then refills the already-expired grant. On the next run, `expire:{grantId}` collides.
  - In both cases, every `reserve_credits` and `debit_credits` for that workspace fails, because both call `_expire_due_grants` first. The whole nightly `expire_credit_grants()` also aborts for every tenant.
  - The P4 acceptance criterion ("ו-`expire_credit_grants` לא נכשל על מפתח כפול") does not cover either path.
- **Fix:**
  - Add `credit_grants.expired_at timestamptz` and set it in `_expire_due_grants`.
  - In `_return_to_grants`, treat `expired_at is not null or expires_at <= clock_timestamp()` as expired, which sends the credits to a new 7-day bucket.
  - Give partial expiries their own key `expire:cap:{grantId}:{grantingIdemKey}`, written by a P4-owned helper `cap_rollover(p_ws, p_cap, p_ref)`.
  - Optionally make `expire_credit_grants()` commit per workspace, by looping from the cron caller or using a procedure with `commit`.
  - Add pgTAP for "return after expiry" and "cap, then natural expiry".

### M7 — The `low_credits` email is advertising under s.30A but is sent as transactional
- **Where:**
  - P6 §11.8 line 959: "**מה לא:** … `low_credits` (עובדתי, בלי הנחות ובלי מבצעים…)"
  - P6 §12.5 line 1294, in the same email: "כדי להמשיך בלי לחכות: חבילת קרדיטים מ-₪{minPackPrice}…; או תוכנית {nextPlanName}, עם {nextPlanCredits} קרדיטים בחודש", with the button "רכישת קרדיטים ← `?topup=pack-500`"
  - Similar pitch in the `welcome` no-trial variant, line 1101: "אפשר להתחיל עם חבילה של {minPackCredits} קרדיטים ב-₪{minPackPrice}"
- **Why it is wrong:**
  - Under s.30A, a "דבר פרסומת" is any message meant to encourage buying a product. Israeli courts treat mixed service-and-promotion messages as advertising.
  - The email pushes priced packs and a plan upgrade, goes out weekly through `/api/cron/reminders`, and is sent without `marketing_email` consent, without the "פרסומת:" prefix and without the s.30A unsubscribe.
  - Exposure is up to ₪1,000 per message, and class actions are common (06-israel §7.4, verified). P6 rule 5 also refuses the existing-customer exception.
- **Fix:**
  - Make `low_credits` purely factual: balance, reset date, and a neutral link "לעמוד החיוב", with no prices, no pack or plan pitch and no purchase CTA.
  - Alternatively, classify it as `marketing`, so it needs consent plus "פרסומת:" plus List-Unsubscribe.
  - Apply the same treatment to the `welcome` no-trial variant, for example "אפשר לרכוש קרדיטים בעמוד החיוב".
  - Mark ⚖️ for the lawyer.

### M8 — Staging cannot receive webhooks and does not run crons, so the billing smoke test and load test cannot pass
- **Where:**
  - P6 §19.1 line 2083: staging protection is "Vercel Authentication"
  - P5 §5.1 line 622: "ב-`staging`/`production` OpenRouter שולח אותם לכתובת הציבורית" (`callbackUrlFor` returns a URL in staging)
  - P6 §8.2: Grow `notifyUrl` points at `SITE_URL`
  - P6 §19.3: `release.yml` → `smoke-staging (@smoke + @billing-sandbox)`; DoD "smoke-staging כולל רכישת חבילה מול Grow sandbox"
  - P6 §18.7: the load test runs on staging
- **Why it is wrong:**
  - Vercel Authentication answers 401 to every unauthenticated request, so Grow sandbox notifies, OpenRouter callbacks and Resend events never reach the app.
  - The only recovery is `reconcilePendingCheckouts` inside the `billing-renewals` cron. Vercel Cron Jobs run only on production deployments (verify in M0; the research does not cover it). So in staging the purchase is never applied, and `sweep-jobs` and `cleanup` never run either.
- **Fix:**
  - In staging, append `x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}` to `callbackUrlFor`, the Grow `notifyUrl` and the Resend webhook URL (or set the Vercel protection bypass for automation).
  - Add a GitHub Actions schedule, or `POST /api/admin/ops/cron` calls in `smoke-staging`, that hits `/api/cron/*` on staging with `CRON_SECRET` and the bypass header.
  - State this in P6 §19.1 and add it to the M0 verify list.

### M9 — The production DB network restriction to "CI IPs" does not work with GitHub-hosted runners
- **Where:**
  - P4 §1.2 line 49: "Network restrictions לפרודקשן (רק IP-ים של CI ושל המפתחים לחיבור ישיר ל-5432…)"
  - P6 §19.3: `migrate-production` runs inside `release.yml` on `ubuntu-latest`
  - P6 §15.11: `backup.yml` runs `pg_dump` from GitHub Actions
- **Why it is wrong:**
  - GitHub-hosted runners have no stable egress IPs (they draw from large, changing Azure ranges).
  - Once the restriction is on, production migrations and the weekly logical backup cannot connect. Supabase network restrictions also apply to the pooler.
  - The release pipeline and DR plan of P6 would fail on first run, or someone would quietly turn the restriction off.
- **Fix:** pick one and record it in `DECISIONS.md`:
  - run `migrate-production` and `backup.yml` on a runner with a static egress IP (self-hosted, or GitHub larger runners with static IPs) and allow-list it; or
  - do not enable network restrictions, and rely on SSL, a strong password, the `backup_reader` least privilege and secret-only connection strings.
  - Update P4 §1.2 item 14 and P6 §15.11 to match.

---

## MINOR

### m1 — Wrong Vercel default duration; the "≤ 300 s" DoD conflicts with the render step
- P5 §18 line 2681: "800 שניות כברירת מחדל ב-Pro". The research (05-stack §3.2, addendum) says Pro **default 300 s, max 800 s (GA)**, with 1,800 s as a beta opt-in. **Fix:** "ברירת מחדל 300, אפשר להגדיר עד 800".
- P6 lines 2215 and 2887 ("אף נתיב/פונקציה לא מגדיר `maxDuration` מעל 300") contradict the Sandbox render step. That step needs the 30-minute extended step duration, configured according to P5 line 2803 through `vercel.json → functions` for `.well-known/workflow/*`. **Fix:** state the explicit exception (the WDK step routes and the env opt-in), and limit the unit test to `app/api/**/route.ts`.

### m2 — The `lib/crypto.ts` helper has two names
P6 §15.5 line 1729 defines `splitSecrets(v)`. P4 lines 6008, 6058, 6081 and 6097, P4 cross-reference line 6460 ("`lib/crypto.ts` (`hmacSign`, `hmacVerifyAny`, `secretList` …)") and P5 lines 610 and 613 import `secretList`. Names are contracts (P00 §6.5). **Fix:** rename it to `secretList` in P6 §15.5. P6 is the owner, and the other parts already agree on `secretList`.

### m3 — The OpenRouter signature verifier is specified twice, differently
P4 §22.2 has `verifyOpenRouterSignature(raw, header, secret, toleranceSec = 300)` and allows multiple `v1=` values. P5 §5.2 has `(rawBody, header, secret, nowMs = Date.now())`, and its `Object.fromEntries` parse keeps only the last `v1`, so with several `v1` values (rotation) a valid signature can be rejected. **Fix:** keep one signature (P5 owns `lib/ai/openrouter/webhook.ts`; P4 should only reference it) and parse every `v1` value, accepting if any matches.

### m4 — The Remotion font loader contradicts its own CSP rule
P5 §20.9 calls `heebo(...)`, `rubik(...)` and the others at module top level (line 3257). They run in the browser Player too and inject `@font-face` rules pointing at `fonts.gstatic.com`. CSP `font-src 'self' data:` blocks those, which leads to CSP violations, fallback fonts and possible `delayRender` stalls. The prose says the file "בוחר בין השניים לפי `getRemotionEnvironment().isRendering`". **Fix:** wrap the calls in `loadRenderFonts()` and call it only when `getRemotionEnvironment().isRendering`. Export only family names otherwise.

### m5 — The CSP hard-codes `*.supabase.co`, but P4 recommends a Supabase custom domain
P6 §15.3 lines 1682 and 1685 allow only `https://*.supabase.co` and `wss://*.supabase.co`. P4 §1.2 line 36 recommends "Custom Domain (`auth.{{DOMAIN}}`)". If it is adopted, `NEXT_PUBLIC_SUPABASE_URL` changes and Realtime, signed media and storage uploads are blocked. **Fix:** derive the Supabase origin and `wss` origin from `NEXT_PUBLIC_SUPABASE_URL` in `buildCsp` and in `next/image` `remotePatterns`.

### m6 — The sweeper's 60-minute cap and restart rules conflict with the pipeline's own budgets
- P4 §23 line 6176 (3) and P5 §19.4 line 3004 fail any job running for more than 60 minutes, with a **full refund**. P5's own worst case is longer: 2 clip attempts × 15 min, plus 3 sequential renders × 20 min, plus the rest, which comes to about 95 minutes.
- If WDK cancel is unavailable (`[M0-verify]`), the run continues. `runStep` only checks `canceled_at`, and `finalize` then flips the job back to `succeeded` on a refunded reservation, so the video is free and the state is inconsistent.
- P5 §19.4 (2) restarts "dead or unknown" runs without cancelling the old one. Both runs can then execute the same non-clip steps, and the new run re-creates hook tokens `or-video:{videoId}` that may already be registered.
- Naming mismatch: `error_detail.restarts` (P4) versus `error_detail.restarted` (P5).
- **Fix:**
  - Set the cap from the budgets (for example 120 min) or make it stage-aware.
  - Make `runStep` and `finalize` abort when `jobs.status in ('failed','canceled')`.
  - Always call `orchestrator.cancel` before a restart.
  - Pick one field name.

### m7 — Hook-of-the-day picks the wrong date
P4 §23 line 6179 says "בחירת הוק **למחר** (תאריך ישראלי)", and the cron runs at `2 22 * * *` UTC. That is 00:02 IST or 01:02 IDT, which is already the new Israeli day. Read literally (`todayIL()+1`), the stored `date` is a day ahead: the card shows tomorrow's date, and the quiet-day rule (no marketing hook on Yom HaZikaron) applies to the wrong day. **Fix:** "the hook for `todayIL()` at run time (the cron fires just after Israeli midnight)". Add a unit test around 2026-10-25 (IDT→IST) and around a quiet day.

### m8 — Understated legal fact about the election deepfake rules
P6 §11.11 line 984: "השם הרשמי ומועד התחולה של הכללים לא אומתו במחקר". The research **verified** the name: "כללי הבחירות (דרכי תעמולה) (קיום חובת הגילוי לגבי תעמולת בחירות שהיא זיוף עמוק), התשפ״ו-2026", requiring a written notice or a symbol, where the symbol cannot be used for audio (06-israel §7.7 and addendum correction 5). Only the effective date is unverified. **Fix:** cite the name in `/legal/ai-policy` and keep ⚖️ only for the effective date.

### m9 — Overclaim that OpenRouter keeps no data
P6 §11.6 line 942: "OpenRouter — אין שמירה (`data_collection: "deny"`)". `data_collection: "deny"` only restricts routing to providers whose policies do not collect or train on data. It is not zero data retention, and the research (06-israel §7.2) asks to document provider retention and ZDR. P5 line 3452 words this correctly ("ככל שהספק מאפשר"). **Fix:** align P6 with P5's wording. Optionally evaluate the OpenRouter ZDR routing option in an M0 spike before claiming "no retention" anywhere.

### m10 — Next.js 16 caching API is underspecified and partly outdated (not covered by research; verify in M0)
P2 line 47 ("קוראת ל-`revalidateTag`"), P4 line 6179, P5 line 708 and P6 line 2359 use a single-argument `revalidateTag(tag)`. In Next.js 16 the single-argument form is deprecated: it requires a cacheLife profile (`revalidateTag(tag, 'max')`), and `updateTag()` is the read-your-writes API in Server Actions. P2 §1 says each query is "עוטפת … במטמון עם התגיות" without naming the primitive. Picking `"use cache"` with `cacheTag` (which needs `cacheComponents`) is incompatible with the route-segment `revalidate` values in the P2 table. **Fix:** state the primitive (for example `unstable_cache(fn, key, { tags, revalidate })` with no `cacheComponents`, or Cache Components with `cacheLife`), and use `revalidateTag(tag, "max")` or `updateTag(tag)` consistently. Add this to spike 1.

### m11 — `security definer` helpers granted to `authenticated` lack access checks
P4 §12.6 line 3743 grants `workspace_plan(uuid)`, `billing_workspace_id(uuid)` and `is_version_locked(uuid)` to `authenticated`. They return another tenant's plan or override, its parent agency id, and whether a version has jobs, for any UUID. The leak is low impact because UUIDs are unguessable, but it breaks the tenant-isolation principle. **Fix:** add `if not can_access_workspace(...) then return null`. Alternatively keep them service-only and expose `get_credit_summary`-style wrappers that already check access.

---

## Notes for the orchestrator (not defects)
- I found no blocker. The worst problems are M1 (moderation and election-mode bypass by a malicious editor), M3 (silent credit loss on slow LLM calls) and M4 (a false privilege-default guarantee). These are the ones to fix before M1/M4 coding starts.
- The research does **not** cover these items, which I flagged from platform knowledge and which should go into `docs/m0-verify.md`:
  - Vercel Cron running only on production (M8)
  - Next 16 `revalidateTag` and `updateTag` (m10)
  - the `pg_default_acl` global-versus-schema semantics (M4; standard Postgres behavior, but worth a pgTAP check)
