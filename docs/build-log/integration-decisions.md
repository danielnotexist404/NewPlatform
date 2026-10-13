# Integration decisions — build prompt for {{BRAND_NAME}}

Owner: integration lead. Inputs: `integration-notes-all.md`, `ident-report.json`, `routes-report.txt`, `spec.md`, parts 00–06 + 90.
Status: **binding**. Fixers apply every decision literally. When a decision says "P4: add X", the text/DDL given here is the exact text to add (translate surrounding prose to Hebrew in the part's style; identifiers, SQL, TS and JSON stay exactly as written here).

## How to read this log

- **File abbreviations:** P0 = `00-header.md`, P1 = `01-brand-design.md`, P2 = `02-marketing-site.md`, P3 = `03-app-ux.md`, P4 = `04-data-api.md`, P5 = `05-ai-pipeline.md`, P6 = `06-billing-legal-ops.md`, AppD/AppE = `90-appendices-d-e.md`, AppF = `spec.md` shipped as "נספח F".
- Section numbers like "P4 §7" refer to the part's own `§` headings.
- Every decision has: **Issue**, **Resolution** (canonical name/shape/value), **Edits** (per file). "No edit" means the part already matches and is listed only so the master lists are complete.
- After applying all edits, each part's "## הערות לאינטגרציה" section is **deleted** (its content is either applied or superseded here). Exception: items explicitly marked "keep as open decision (⚖️ lawyer/accountant)" are moved into P6 §25 (DoD) as a checklist block "החלטות שממתינות לאישור עורך דין / רו״ח" (see D-243).
- Decision numbering is global; groups are ordered by owner part: Global/P0 → P4 (DB) → P4 (API) → P4 (errors) → P5 → P6 → P3 → P2 → P1 → AppD/AppE → content conventions → master lists of routes/cookies/storage keys → Appendix F errata.

---

# A. Global / P0 (header) — D-001 … D-013

### D-001 — Appendix F is the architecture spec
- **Issue:** `spec.md` ships as an appendix; P0 does not mention it, and P0 §7 precedence has no place for it.
- **Resolution:** Title line of the appendix: `# נספח F — המפרט הטכני (באנגלית)`. It is placed after Appendix E. Precedence (P0 §7) becomes, high → low: (1) P0 principles; (2) the contracts in P4, P5 **and P6** (schema, names, JSON Schemas, billing/legal/security rules); (3) design and UX in P1–P3; (4) Appendices A–E; (5) Appendix F. "Appendix F is the architect's background spec in English. Parts 01–06 and Appendices A–E are more detailed and win on any conflict; the errata box at the top of Appendix F lists the known overrides."
- **Edits:** P0 §6 table: add row `| **נספח F — המפרט הטכני (באנגלית)** | המפרט המקורי של הארכיטקט: החלטות, נימוקים, וחוזים בתמצית. החלקים 01–06 והנספחים A–E מפורטים יותר וגוברים עליו |`. P0 §7: replace the precedence sentence with the 5-level order above. AppF: insert the errata box of §M (D-300) right after the title.

### D-002 — References to "the spec" inside parts
- **Issue:** parts reference the spec as "המפרט §X", "§X במפרט", "במסמך המפרט", "spec §X" (P1 18, P2 7, P3 8, P4 36, P5 22, P6 15, AppD/E 3 occurrences).
- **Resolution:** every reference to the architecture spec becomes a reference to Appendix F. Grammatical mapping: "המפרט" → "נספח F"; "במפרט" → "בנספח F"; "שבמפרט" → "שבנספח F"; "מהמפרט" → "מנספח F"; "למפרט" → "לנספח F"; "במסמך המפרט" → "בנספח F"; in code comments and English text `spec §X` → `Appendix F §X`. Section numbers stay as they are (AppF numbering is unchanged).
- **Do not replace** the word "מפרט" where it means an asset specification (e.g. P1 §15.3 table column "מפרט", "מפרט טכני של קובץ"). Fixers check each hit in context.
- **Edits:** all parts, mechanical. P5 note 16 ("if the spec isn't sent with the prompt…") is resolved: it is sent; no copying needed.

### D-003 — Research citations
- **Issue:** AppF uses `[R:0X §Y]`; readers need the source.
- **Resolution:** `docs/research/` is committed to the repo unchanged. `[R:01]`=`docs/research/01-cadabra.md`, `[R:02]`=`02-ph-ads.md`, `[R:03]`=`03-ph-brand.md`, `[R:04]`=`04-openrouter.md`, `[R:05]`=`05-stack.md`, `[R:06]`=`06-israel.md`, `[R:07]`=`07-hooks.md`, `[R:08]`=`08-design.md`, `[R:09]`=`09-producthunt.md`. In every research file the section "Verification addendum" overrides earlier text in the same file.
- **Edits:** AppF errata box (D-300) item 1 states this mapping. P0 §4 add bullet: "מחקרי הרקע נמצאים ב-`docs/research/`; ההפניות `[R:0X §Y]` בנספח F מצביעות עליהם, ובכל קובץ 'Verification addendum' גובר על מה שלפניו." P6 §23.7 already lists `docs/research/` (no edit).

### D-004 — Where the seeds live
- **Issue:** P0 §6 says appendix files are stored under `supabase/seed/data/`; P4 §16.1 says `/seed` is the source of truth and `pnpm seed:sync` copies.
- **Resolution:** `/seed` (repo root) is the source of truth: `seed/niche_categories.json`, `niches.json`, `hook_families.json`, `hook_types.json`, `seasons.json`, `hooks.json`, `seed/scripts/build_seed.py`, `seed/README.md`. `pnpm seed:sync` copies the six JSON files to `supabase/seed/data/` after `python3 -I seed/scripts/build_seed.py --check`. Business data files (`plans.json`, `credit_packs.json`, …, and the new `niche_extras.json`, D-030) live only in `supabase/seed/data/`.
- **Edits:** P0 §6: replace the sentence after the table with: "קובצי הנספחים A–C נשמרים בריפו ב-`/seed` (מקור האמת), ו-`pnpm seed:sync` מעתיק אותם ל-`supabase/seed/data/` לפני `pnpm db:seed` (חלק 04 §16)." P6 §23.6: add `seed:sync` to the `db:*` row ("`db:*` · `seed:sync` — חלק 04 §2.2, §16.1").

### D-005 — Appendix descriptions in P0 §6
- **Resolution:** A = `niche_categories.json` (13) + `niches.json` (36). B = `hook_families.json` (8), `hook_types.json` (27) and `seasons.json` (25, including 2 quiet days). C = `hooks.json` (326 hooks). D = **five** complete sample scripts (`ScriptV1` + `StoryboardV1`): `restaurants-grill-30`, `renovation-bathroom-30`, `mortgage-mix-30`, `dentists-brand-60`, `nails-hanukkah-15`. E = Hebrew copy style guide.
- **Edits:** P0 §6 rows for B and D accordingly.

### D-006 — External API paths are written as full URLs
- **Issue:** `routes-report.txt` flags `/api/v1/generation?id=`, `/api/v1/videos/{id}/content`, `/api/v1/documents`, `/api/projects/:id/persons/:id` — these are OpenRouter / Morning / PostHog APIs, not ours.
- **Resolution:** any third-party endpoint is written with its host or base-URL variable: `${OPENROUTER_BASE_URL}/generation?id={id}`, `${OPENROUTER_BASE_URL}/videos/{id}/content?index={n}`, `${OPENROUTER_BASE_URL}/models`, `${MORNING_API_BASE_URL}/documents`, `https://eu.posthog.com/api/projects/{posthogProjectId}/persons/{personId}` (or `posthog-node` `deletePerson`). Paths starting with `/api/` without a host always mean **our** Route Handlers.
- **Edits:** P5 (§2, §4.2, §5, §7.4 wherever `/api/v1/...` appears), P6 §9.6 (`/api/v1/documents`), P6 §11.6 line "`DELETE /api/projects/:id/persons/:id`" → "`DELETE https://eu.posthog.com/api/projects/{posthogProjectId}/persons/{personId}` (או `posthog-node`)".

### D-007 — Names are a contract also for this log
- **Resolution:** a name introduced by a decision here is canonical and replaces every synonym listed in that decision. P0 §4 "שמות הם חוזה" applies.
- **Edits:** none.

### D-008 — Agent address vs. UI address
- **Resolution:** P0/P5 address the coding agent in masculine singular ("אתה", "עבור לחלק 01") — allowed, it is not product UI. All product UI, emails and marketing copy follow D-262 (gender-neutral).
- **Edits:** none.

### D-009 — Sample scripts count
- **Resolution:** Appendix D has **five** scripts (D-005). Separately, `niches.sample_scripts` holds **exactly three** `SampleScript` items per active niche (P2 §4.3) — a different, marketing-only concept. Any text saying "שלושת התסריטים של נספח D" is wrong.
- **Edits:** P5 §10 acceptance (line "בכל 3 התסריטים של נספח D") → "בכל חמשת התסריטים של נספח D"; P5 §11 acceptance ("שלושת התסריטים והסטוריבורדים של נספח D") → "חמשת…"; P5 §23.4 item 1 ("שלושת זוגות") → "חמשת זוגות"; P5 §23.4 item 3 ("מרנדר את שלושת התסריטים") → "מרנדר את חמשת התסריטים"; P5 §10.6 `pickSampleScript` sentence → "תסריט מנספח D עם אותו `structure` (לכל מבנה יש דוגמה חוץ מ-`result_first`; ואם יש כמה — מאותה נישה); ל-`result_first` — הדוגמה של `hpspc`."

### D-010 — Brand/legal placeholders registry
- **Issue:** new `{{…}}` variables were introduced by P2/P4/P6.
- **Resolution (complete list of `{{…}}` owner-filled variables):** `{{BRAND_NAME}}`, `{{BRAND_NAME_EN}}`, `{{DOMAIN}}`, `{{LEGAL_ENTITY_NAME}}`, `{{COMPANY_ID}}`, `{{LEGAL_ADDRESS}}`, `{{LEGAL_EFFECTIVE_DATE}}`, `{{JURISDICTION_CITY}}`, `{{DPO_NAME}}`, `{{A11Y_COORDINATOR_NAME}}`, `{{A11Y_COORDINATOR_TITLE}}`, `{{A11Y_COORDINATOR_PHONE}}`, `{{A11Y_COORDINATOR_EMAIL}}`, `{{A11Y_STATEMENT_DATE}}`, `{{A11Y_AUDIT_DATE}}`, `{{A11Y_AUDITOR}}`, `{{WHATSAPP_NUMBER}}`, `{{SUPPORT_PHONE}}`, `{{VERCEL_TEAM_SLUG}}` (Supabase redirect allow-list only; not an app env var). All are read from `lib/constants.ts` (`BRAND.*`) at runtime except `{{VERCEL_TEAM_SLUG}}`. `scripts/check-content.ts --launch` fails the production deploy if any remains unreplaced.
- **Edits:** P0 header box: add one sentence after the table: "משתנים משפטיים ותפעוליים נוספים (`{{LEGAL_ENTITY_NAME}}`, `{{SUPPORT_PHONE}}` וכו׳) מרוכזים ב-`lib/constants.ts`; הרשימה המלאה בחלק 06 §20." P6 §20: add a sub-table "משתני תוכן שהבעלים ממלא" with the list above.

### D-011 — `docs/` files referenced across parts
- **Resolution:** union list in P6 §23.7: `docs/analytics.md`, `docs/m0-verify.md`, `docs/runbooks/R1…R13`, `docs/incidents/`, `docs/security/*`, `docs/legal/*`, `docs/qa/{hebrew-review,emails,load-*}.md`, `docs/eval/listening-list.md`, `docs/eval/hebrew-review-m7.md` (AppD), `docs/research/`, `DECISIONS.md` (repo root), `CHANGELOG.md`.
- **Edits:** P6 §23.7 add the two `docs/eval/*` files.

### D-012 — `[M0-verify]` items introduced by this log
- **Resolution:** every `[M0-verify]` added below is appended to `docs/m0-verify.md` and to the M0 list in P6 §24 (M0 tasks).
- **Edits:** P6 §24 M0: add "פריטי `[M0-verify]` שנוספו ביומן האינטגרציה: `realtime.send`, `backup_reader BYPASSRLS`, שמות הקולות של `tts.alt`, `data_collection` בנקודות המדיה, `input_references` ב-`/images`, `/images/models`, Batch API."

### D-013 — Cross-part values verified consistent (no edit; canonical values recorded)
- **Trial credits:** 70, once per normalized email, no expiry (`app_settings.free_trial_credits`, `plans.free.trial_credits`) — P2, P3, P4, P6 agree.
- **Plans & prices:** free ₪0 · starter ₪119 / ₪95 annual-monthly · business ₪289 / ₪231 · agency ₪990 / ₪792; credits 0 (trial 70) / 400 / 1,000 / 3,300; packs `pack-150` ₪59 · `pack-500` ₪179 · `pack-1500` ₪449; `plans.limits` as P4 §16.4 (= AppF §10.3 + `max_ai_clips`/`max_ai_clip_sec`).
- **Credit costs:** P4 §16.4 table; `estimateSample` = 23 / 50 / 107 / 478.
- **Caption presets:** `bold-pop`, `clean-box`, `karaoke`, `poster`, `news`, `soft` (labels פופ · קופסה נקייה · קריוקי · פוסטר · חדשות · רך) — P1, P2, P4, P5, AppD agree (AppF §7.3 typo, errata item 21).
- **Wizard steps:** `business · niche · goal · hook · script · style · voice · music · preview` — AppF, P3, P4 agree.
- **Realtime:** `realtime.send` (D-061).
- **Render location:** Remotion on Vercel Sandbox (`RENDER_PROVIDER=vercel-sandbox`, 4 vCPU, 20 min), alternatives `lambda` (eu-central-1) and `local` (dev/tests only, forbidden in production) — P0, P5, P6 agree.
- **Model slugs:** exactly AppF §7.1 / P4 §16.5 (`anthropic/claude-sonnet-5.5`, `openai/gpt-6.1-sol`, `google/gemini-3.8-flash`, `google/gemini-3.8-flash:batch`, `anthropic/claude-opus-5`, `google/gemini-3.1-flash-lite-image`, `google/gemini-3.1-flash-image`, `google/gemini-3-pro-image`, `google/veo-3.1-lite`, `alibaba/wan-3.0`, `bytedance/seedance-2.0-fast`, `kwaivgi/kling-v3.0-std`, `bytedance/seedance-2.0`, `google/veo-3.1-fast`, `google/veo-3.1`, `kwaivgi/kling-v3.0-pro`, `elevenlabs/eleven-v4`, `elevenlabs/eleven-v4-turbo`, `google/gemini-3.8-flash-tts`, `elevenlabs/scribe-v2`, `google/lyria-3-pro-preview`, `heygen/avatar-iv`); Sora never routed — P4, P5 agree.
- **Orchestration:** Vercel Workflows (`ORCHESTRATOR=vercel-workflow`; `inline` for tests); Trigger.dev documented v2 alternative.
- **Edits:** none.

---

# B. P4 — database (DDL, functions, triggers, buckets, cron, seed) — D-020 … D-065

### D-020 — Migration placement
- **Issue:** P6 says "migration 0005/0012"; P4 has 0001–0011.
- **Resolution:** nothing has run in staging/prod yet, so every new column/table/function goes into the existing topical file: tenancy → `0002`, catalog → `0003`, projects/jobs → `0004`, credits/billing → `0005`, sharing/ops tables → `0006`, functions/triggers → `0007`, RLS/grants → `0008`, storage → `0009`, realtime → `0010`, pg_cron → `0011`. One new file `0012_ops_roles.sql` holds only the `backup_reader` role (D-047).
- **Edits:** P4 §2.1 tree: add `│  └─ 0012_ops_roles.sql`. P6 §1.7 / note 1: "(מיגרציה `0005`/`0012`)" → "(מיגרציה `0005`)".

### D-021 — `profiles.trial_status` (no change) and its UI
- **Resolution:** column as in P4 §4: `trial_status text check (trial_status in ('granted','already_claimed','disposable_email','no_identifier'))`, NULL until `handle_new_user` runs. `no_identifier` gets its own dashboard card (D-404).
- **Edits:** P4 none. P3 §3.5 (D-404).

### D-022 — `profiles.notification_prefs` shape
- **Issue:** P4 comment `{<notification_kind>: {email, whatsapp}}`; P6 §13.2 stores `notification_prefs.whatsapp = {phone_e164, …}` at the same level.
- **Resolution:** column unchanged (`jsonb not null default '{}'`, object). Canonical shape:
```json
{
  "kinds": { "<notification_kind>": { "email": true, "whatsapp": false } },
  "whatsapp": { "phone_e164": "+9725XXXXXXXX", "verified_at": "ISO|null", "opted_in_at": "ISO|null", "opted_out_at": "ISO|null" }
}
```
Missing `kinds.<kind>` = email on, WhatsApp off. `payment_failed` and `invite` ignore `email:false` (always sent). Zod: `NotificationPrefs` in `lib/api/contracts/account.ts`:
```ts
export const NotificationPrefs = z.strictObject({
  kinds: z.record(z.enum(ENUMS.notification_kind), z.strictObject({ email: z.boolean(), whatsapp: z.boolean() })).default({}),
  whatsapp: z.strictObject({ phone_e164: z.string().regex(/^\+9725\d{8}$/), verified_at: IsoDateTime.nullable(),
    opted_in_at: IsoDateTime.nullable(), opted_out_at: IsoDateTime.nullable() }).optional(),
});
```
`updateProfile` (P4 §24.2) accepts `notificationPrefs: NotificationPrefs.shape.kinds` only (the `whatsapp` sub-object is written only by the WhatsApp verification routes, D-089).
- **Edits:** P4 §4 column comment → `-- {kinds:{<notification_kind>:{email,whatsapp}}, whatsapp?:{phone_e164,verified_at,opted_in_at,opted_out_at}}`; P4 §4 note on `notification_prefs` rewritten accordingly; P4 §24.2 `updateProfile` input. P6 §13.2 "שמירה:" → `profiles.notification_prefs.whatsapp = {…}` stays (now consistent) and add "העדפות הערוצים לכל סוג נשמרות ב-`notification_prefs.kinds`". P3 §16.2 last sentence → "…נשמרות ב-`profiles.notification_prefs.kinds`".

### D-023 — `workspaces.plan_override` (no change)
- **Resolution:** `plan_override jsonb` with keys `plan_id`, `until`, `reason` (P4 §4); `workspace_plan()` honors it while `until > now()`. Admin route `PATCH /api/admin/workspaces/[id]/plan-override` with body `{ planId, until, reason }`, or `{ clear: true }` to remove the override (sets the column to NULL).
- **Edits:** P4 §24.1 row: add "`{ clear: true }` מסיר את ה-override".

### D-024 — Catalog DB-only niche columns (no change)
- **Resolution:** `niches.short_name_he text`, `seo_title_he`, `seo_description_he`, `seo_intro_he`, `seo_reviewed_at timestamptz`, `landing_intro_he`, `faq jsonb default '[]'` with items `{q_he, a_he}`, `sample_scripts jsonb default '[]'` with exactly 3 `SampleScript` items per active niche (P2 §4.3), `default_register`, `default_audience_gender`, `default_music_mood`, `default_cta`, `cover_path`, `example_video_path`, `is_active`. All exist in P4 §5.2.
- **Edits:** none (seed source for some of them: D-030).

### D-025 — `project_versions.moderation` (no change, shape fixed)
- **Resolution:** `moderation jsonb` = `{ allowed, categories, reason_he, kind: "brief"|"hook"|"script", checked_at, prompt_version, input_hash }` (P5 §10.2 + `kind`). Written server-side only.
- **Edits:** P4 §6 column comment → `-- cached ModerationV1 + {kind, checked_at, prompt_version, input_hash}`.

### D-026 — `credit_costs.credits_long`, `credit_reservations.action_key/ref`, `payments.checkout_session_id` (no change)
- **Resolution:** as in P4 §7.
- **Edits:** none.

### D-027 — `subscriptions` billing-engine columns (NEW)
- **Issue:** P6 §1.7 needs four columns not in P4.
- **Resolution — add to `public.subscriptions` in `0005`, after `promo_ends_at`:**
```sql
  anchor_at            timestamptz not null default now(),   -- period anchor (keeps "31st" after February)
  next_grant_at        timestamptz,                          -- annual plans: next monthly allowance grant
  scheduled_change     jsonb check (scheduled_change is null
                         or (scheduled_change ?& array['plan_id','cycle','requested_at','requested_by'])),  -- {plan_id, cycle, requested_at, requested_by}
  past_due_since       timestamptz,                          -- dunning start
```
and index `create index subscriptions_next_grant_idx on public.subscriptions (next_grant_at) where status = 'active' and billing_cycle = 'annual';`
- **Edits:** P4 §7 DDL + a note per column (Hebrew, from the comments). P6 §1.7 table: mark the rows "הוגדר בחלק 04 §7".

### D-028 — `payments` engine columns (NEW)
- **Resolution — add to `public.payments` in `0005`, after `failure_reason`:**
```sql
  idempotency_key      text unique,        -- checkout:{checkoutSessionId} | renew:{subscriptionId}:{periodEndISO} | plan_change:{subscriptionId}:{toPlan}:{requestKey}
  confirmation_sent_at timestamptz,        -- when the transaction confirmation email went out (starts the 14-day window)
```
Documented conventions (P4 §7 notes): a `pending` row is inserted with `provider_txn_id = 'pending:' || id` and updated to the real id when the gateway answers; `failure_reason` values: `declined`, `card_expired`, `insufficient_funds`, `invalid_token`, `provider_error`, `amount_mismatch`, `chargeback`.
- **Edits:** P4 §7 DDL + notes. P6 §1.5 last paragraph: "היא עמודה חדשה (הערות לאינטגרציה)" → "(חלק 04 §7)".

### D-029 — `email_messages` table (NEW)
- **Resolution — add to `0006_sharing_ops.sql` after `email_suppressions`:**
```sql
create table public.email_messages (
  id              uuid primary key default gen_random_uuid(),
  template_key    text not null check (template_key ~ '^[a-z][a-z0-9_]*$'),   -- EmailKey (part 06 §12.4)
  to_email        extensions.citext not null,
  user_id         uuid references public.profiles(id) on delete set null,
  workspace_id    uuid references public.workspaces(id) on delete set null,
  idempotency_key text not null unique,                                        -- e.g. payment_receipt:{paymentId}
  resend_id       text unique,
  status          text not null default 'queued' check (status in ('queued','sent','delivered','bounced','complained','failed',
                                                                  'skipped_suppressed','skipped_no_consent','skipped_pref','skipped_allowlist')),
  error           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index email_messages_to_idx     on public.email_messages (to_email, created_at desc);
create index email_messages_status_idx on public.email_messages (status, created_at);
create index email_messages_user_idx   on public.email_messages (user_id) where user_id is not null;
```
`skipped_duplicate` is a **return value only** of `sendEmail` (the unique key prevents a second row). RLS: enabled, select for platform admins only, no client writes (D-050). `set_updated_at` trigger attached by the 0007 loop. Retention 24 months (D-046).
- **Edits:** P4 §8 DDL + Hebrew note; P4 §12.2 add `public.email_messages` to the "server-only writes" revoke list; P4 §12.4 admin-read loop array: add `'email_messages'`; P4 §12.3 matrix row. P6 §12.1 bullet "יומן שליחות ★ `email_messages` (…)" → "יומן שליחות `email_messages` (חלק 04 §8)…" and remove `skipped_duplicate` from the stored status list (keep it in the `sendEmail` return type).

### D-030 — Seed of niche DB-only defaults: `niche_extras.json` (NEW seed file)
- **Issue:** P2 §1.2 defines `short_name_he` for all 36 niches; AppE §3.3 defines `default_register`, `default_audience_gender`, `default_cta` per niche; P4 seed writes only canonical seed fields, so these never reach the DB.
- **Resolution:** new file `supabase/seed/data/niche_extras.json`, array of `{ slug, short_name_he, default_register, default_audience_gender, default_cta, default_music_mood }` for all 36 niches (`short_name_he` from P2 §1.2; register/audience/cta from AppE §3.3; `default_music_mood` = `null` at launch — set by admins; the storyboard picks a mood otherwise). Seed step 3b (right after `niches.json`), mode **`fill_if_null`**: each column is written only when the DB value is NULL, so admin edits are never overwritten. `local-politics` has `short_name_he = null`, `default_* = null`. Zod `NicheExtrasSchema` in `supabase/seed/schemas.ts`.
- **Edits:** P4 §16.1 table add row `3b | niche_extras.json | חלק 02 §1.2 + נספח E §3.3 | fill_if_null | slug`; P4 §16.2 schema; P4 §5.2 note on `short_name_he` ("מתמלאות דרך האדמין או …") → add "וערכי ההשקה מגיעים מ-`niche_extras.json` (§16.1)"; acceptance: "אחרי `db:seed`, ל-35 נישות פעילות יש `short_name_he`". AppD/E note 9 resolved.

### D-031 — `abuse_reports` (exists) + `source` column (NEW)
- **Issue:** P6 §7.1 writes trial-velocity flags into `abuse_reports` (no share link); P6 §11.12 copyright notices from support.
- **Resolution — add column in `0006`:** `source text not null default 'share_page' check (source in ('share_page','system','support')),` after `workspace_id`. Trial velocity: `source='system', reason='other', details='trial_velocity'`. Everything else as P4 §8.
- **Edits:** P4 §8 DDL + note; P6 §7.1 row "סימון בלבד (`abuse_reports` עם `source='system'`, `reason='other'`, `details='trial_velocity'`)".

### D-032 — `api_idempotency_keys` (no change)
- **Edits:** none.

### D-033 — `ai_generations.meta` (NEW)
- **Resolution — add to `public.ai_generations` in `0004`, after `error_code`:** `meta jsonb check (meta is null or jsonb_typeof(meta) = 'object'),  -- debug on validation failure: {raw_head (≤2000 chars), issues[], prompt_version, input_hash}; nulled after 30 days`. Column is **not** readable by customers: in `0008` replace the table-level select for `authenticated` on `ai_generations` with a column grant that omits `meta`:
```sql
revoke select on public.ai_generations from authenticated;
grant  select (id, workspace_id, job_id, step_id, task, prompt_template_id, model_requested, model_served, fallback_used,
               openrouter_id, endpoint, unit_type, units, prompt_tokens, completion_tokens, cached_tokens, cost_usd,
               cost_estimated_usd, latency_ms, status, error_code, created_at) on public.ai_generations to authenticated;
```
Admin screens read `meta` with the secret client. Nulling job: D-046.
- **Edits:** P4 §6 DDL, §12.2 grants; P5 §22 table row "קטעי דיבאג ★" → reference P4 §6.

### D-034 — `consents.source` gets `generate` (DB only)
- **Issue:** P6 §11.4 records `ai_content_policy` with `source='generate'`.
- **Resolution:** DB check becomes `source in ('signup','settings','checkout','newsletter','cookie_banner','likeness_flow','generate')`. The row is written **server-side** inside `POST /api/projects/[id]/generate` (first generation per user per policy version; secret client, `ip`, `user_agent`), so the public `ConsentBody` enum (P4 §21.4) does **not** accept `generate`.
- **Edits:** P4 §8 DDL; P4 §19.8 generate step list: add step "3b. אם אין למשתמש שורת `consents` מסוג `ai_content_policy` בגרסה הנוכחית של `/legal/ai-policy` — נרשמת שורה (`source='generate'`)". P6 §11.4 row stays; P6 note 9(b) resolved. P3 §6.10: add the line (D-411).

### D-035 — `brand_kits.end_card` keys `logo_bug`, `show_instagram` (default JSON change)
- **Issue:** P5 §20.2 reads `brand_kits.end_card.logo_bug`; P3 §6.9 has an Instagram toggle on the end card; spec PromoProps has `contact.instagram`. P4 default JSON lacks both.
- **Resolution:** `end_card` default becomes
`'{"cta_type":"whatsapp","headline_he":"דברו איתנו עוד היום","show_phone":true,"show_whatsapp":true,"show_website":false,"show_address":false,"show_instagram":false,"show_qr":false,"logo_bug":false,"disclaimer_he":null,"license_text_he":null}'`. Instagram value comes from `business_profiles.instagram_url`.
- **Edits:** P4 §4 DDL; P3 §12.2 BrandKitEditor end-card section: add toggles "אינסטגרם" and "לוגו קטן בפינה (אחרי 3 שניות)" as kit defaults.

### D-036 — `projects.render_options` (NEW) — per-project render overrides
- **Issue:** P3 §6.9 ("preview" step) edits per project: logo bug, intro style, caption position, highlight color, end-card toggles/headline. No column holds them; brand kit values are workspace-wide.
- **Resolution — add to `public.projects` in `0004`, after `ai_label`:**
```sql
  render_options        jsonb not null default '{}' check (jsonb_typeof(render_options) = 'object'),
  -- overrides of the brand kit for this project only:
  -- {logo_bug?, intro_style?: 'none'|'logo_reveal'|'title_card', caption_position?: 'lower'|'middle',
  --  caption_highlight_color?: '#RRGGBB'|null, end_card?: {headline_he?, show_phone?, show_whatsapp?, show_website?,
  --  show_address?, show_instagram?, show_qr?}}
```
Zod `RenderOptions` (strict, all keys optional) in `lib/api/contracts/projects.ts`; `ProjectPatchBody` gains `renderOptions: RenderOptions.optional()` (shallow merge, like `brief`). Resolution order in `buildPromoProps` (P5 §20.2): `projects.render_options.X ?? brand_kits.X ?? default`.
- **Edits:** P4 §6 DDL + note; P4 §19.3 `ProjectPatchBody`; P5 §20.2 code: `logoBug: project.render_options.logo_bug ?? brandKit.end_card?.logo_bug ?? false`, and the same pattern for intro, caption position/highlight, end card fields; P3 §6.9 items 2–4: "נשמר ב-`projects.render_options` (`PATCH /api/projects/[id] {renderOptions}`)".

### D-037 — `projects.brief` canonical shape (contract fix)
- **Issue:** P3 §6.4/§6.12 and P4 §19.3 disagree on `fact_answers` and `variant_hooks`; P5 adds `brief.testimonial`; P3 shows a post-text row that needs regeneration (D-086).
- **Resolution (all keys snake_case, `ProjectBrief` in `lib/api/contracts/projects.ts`):**
```ts
export const ProjectBrief = z.strictObject({
  focus_service: HeText(1, 80).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  offer: z.strictObject({ text_he: HeText(2, 200), valid_until: z.iso.date().nullable(), season_slug: Slug.nullable() }).nullable().optional(),
  cta: z.strictObject({ type: CtaType, target: z.string().trim().max(300).nullable(), keyword: z.string().trim().max(30).nullable(),
    prefill_he: z.string().trim().max(200).nullable(), headline_he: z.string().trim().max(60).nullable() }).nullable().optional(),
  // NON-primary hook variants only; the primary is projects.hook_id / workspace_hook_id / hook_text_he
  variant_hooks: z.array(z.strictObject({ hook_id: HookId.nullable(), workspace_hook_id: Uuid.nullable(), text_he: HeText(3, 160) })).max(4).optional(),
  fact_answers: z.array(z.strictObject({
    slot_id: z.string().max(120),                                          // FactSlot.id (part 03 §6.12)
    kind: z.enum(["placeholder", "numeric_claim", "script_fact"]),
    token: z.string().max(120),
    action: z.enum(["confirmed", "replaced", "removed"]),
    value: z.string().trim().max(120).nullable(),                           // required when action = "replaced"
  })).max(40).optional(),
  // one row per ComplianceChecklist checkbox (part 03 §6.5) = the ScriptV1 compliance flags that require a confirmation
  attestations: z.array(z.strictObject({
    kind: z.enum(["testimonial_requires_consent", "urgency_must_be_true", "results_claim", "price_claim", "kashrut_claim", "minors"]),
    at: IsoDateTime, by: Uuid })).max(10).optional(),
  testimonial: z.strictObject({ quote_he: HeText(5, 400), name_he: HeText(2, 60), consent_attested: z.boolean() }).nullable().optional(),
  audio_mix: z.strictObject({ music_level: z.number().min(0).max(1), ducking: z.boolean(), ducked_level: z.number().min(0).max(1) }).optional(),
  post_caption: z.strictObject({ text_he: z.string().max(1500), hashtags_he: z.array(z.string()).max(8), platform: z.enum(ENUMS.platform),
    generated_at: IsoDateTime }).nullable().optional(),
});
```
`variant_hooks.length ≤ limits.hook_variants_max − 1`. Upload consent stays on the asset (`assets.metadata.consent_attested {by, at}`), not in `attestations`; the P4 kinds `people_consent | testimonial_real | minor_parental_consent` are replaced by the compliance-flag keys above (`minors` covers parental consent; `testimonial_requires_consent` covers a real testimonial and is also required when `brief.testimonial` is set).
- **Edits:** P4 §19.3 replace `ProjectBrief`; P3 §6.4 "שמירה" → "כל ההוקים הנוספים (לא הראשי) ב-`projects.brief.variant_hooks` (`[{hook_id, workspace_hook_id, text_he}]`)"; P3 §6.12 "שמירה ואכיפה" → shape above (`slot_id`, `kind`, `token`, `action`, `value`); P3 note 5 list superseded; P5 §21.3 testimonial unchanged (now in contract).

### D-038 — `jobs.options` canonical shape
- **Issue:** P4 uses `options.after_job_id`; P5 uses `options.waitForJobId`; other keys are camelCase (`formats`, `sceneIds`).
- **Resolution:** `jobs.options` (camelCase, mirrors request bodies): `{ formats: AspectRatio[]; sceneIds?: uuid[]; what?: "visual"|"clip"|"keyframe"; promptOverrideEn?: string; afterJobId?: uuid }`. `afterJobId` is set on hook-variant sibling jobs and points to the primary job.
- **Edits:** P4 §6 column comment → `-- {formats[], sceneIds?, what?, promptOverrideEn?, afterJobId?}`; P4 §10.4 SQL: `j.options ? 'after_job_id'` → see D-040; P4 §19.8 step 6, §23 sweep-jobs row (4), note 8: `options.after_job_id` → `options.afterJobId`. P5 §18.9 and §19.4 item 5: `options.waitForJobId` → `options.afterJobId`.

### D-039 — `job_steps.output` and other free-form JSON keys (documentation only)
- **Resolution:** `job_steps.output` per step key is owned by P5 §18.4 (e.g. `{asset_id, duration_ms, model, fallback_voice, tts_hash}` for `voice`; `{attempts:[{n, model, video_id, status, billed_seconds, pending_submit?}]}` for `clip:*`; `{render_run_id, asset_id, render_ms, still_asset_id?}` for `render:*`; `{poster_asset_id, srt_asset_id, vtt_asset_id, settled}` for `finalize`). `model_registry.capabilities` may contain `image_api: "images"|"chat"`; `model_registry.raw.suspect_missing_at`; `model_routes.params` keys: `temperature`, `structured`, `require_parameters`, `sort`, `max_output_tokens`, `batch`, `resolution`, `generate_audio`, `max_clip_cost_usd`, `language`, `response_format`, `voice_passthrough`. `assets.metadata` keys: `upload_state`, `original_filename`, `probe`, `purge_reason`, `purge_marked_at`, `storage_deleted_at`, `consent_attested: {by, at}`, `moderation: {allowed, categories, checked_at, prompt_version}`.
- **Edits:** P4 §6 notes add one bullet each for `job_steps.output` ("הבעלות על המבנה: חלק 05 §18.4") and `assets.metadata` (list above); P4 §8 `model_registry.capabilities`/`model_routes.params` column comments extended with the keys above.

### D-040 — Hook-variant jobs never count toward concurrency
- **Issue:** P5 note 3: with `starter` (2 concurrent, 3 variants) the 3rd variant is blocked; P4 excludes only *queued* siblings.
- **Resolution:** sibling jobs (`options ? 'afterJobId'`) are excluded from the concurrency count in **every** status; the variant group is billed and limited as one generation. Siblings are still created with `p_max_concurrent` = the plan value (no 1000 hack).
- **Edits:** P4 §10.4 `create_job_and_reserve` count clause → `and not (j.options ? 'afterJobId')`; comment "hook-variant jobs belong to their primary's generation and never count toward concurrency"; P4 §19.8 step 6: remove "`p_max_concurrent = 1000` (הן ממתינות ולא נספרות)" → "(עבודות אחים לא נספרות במקביליות, §10.4)". P5 note 3 resolved.

### D-041 — Author columns become nullable for account deletion
- **Issue:** account deletion relies on purge order; any leftover soft-deleted row with `created_by … on delete restrict` blocks `auth.admin.deleteUser`.
- **Resolution:** in addition to P4's existing relaxations (`workspaces.owner_id`, `trial_claims.user_id`, `checkout_sessions.created_by`, `data_requests.user_id`, `credit_ledger.job_id/actor_id` without FK), these become `uuid references public.profiles(id) on delete set null` (nullable): `projects.created_by`, `project_versions.created_by`, `jobs.requested_by`, `share_links.created_by`, `workspace_hooks.created_by`, `pronunciation_entries.created_by`. `prepare_user_deletion` keeps re-assigning rows in shared workspaces to the owner (attribution); the FK change only makes `deleteUser` safe. RLS insert checks (`created_by = auth.uid()`) are unchanged. UI shows "משתמש שנמחק" for a NULL author (D-428).
- **Edits:** P4 §2–§8 DDL for the six columns; P4 §8 notes paragraph "סטיות NOT NULL מכוונות" (move from note 3 into P4 §9.6 as a bullet list of all ten relaxations). P6 §10.7 / §11.5 already describe anonymized retention (no edit).

### D-042 — `seats_used`: viewers are free
- **Issue:** P6 §5.4 demotes excess members to `viewer` on downgrade, but `seats_used` counts viewers, so demotion frees nothing.
- **Resolution:** a seat = a member with role `owner`, `admin` or `editor` (across the billing workspace and its client workspaces) + a pending invite with role `admin`/`editor`. Viewers and viewer invites are free and unlimited.
- **Edits:** P4 §9.2 `seats_used` body: add `and m.role <> 'viewer'` and `and i.role <> 'viewer'`; comment "viewers do not use seats"; P4 §24.2 `inviteMember` note: seat check only when `role <> 'viewer'`. P3 §17 team page: add helper line "צופים לא נספרים במכסת המשתמשים." under the seats counter. P2 §7.4 comparison table row "משתמשים": add footnote "צופים — ללא הגבלה". P6 §5.4 row unchanged (now effective).

### D-043 — `enforce_plan_limits(p_ws)` (NEW function)
- **Resolution — `0007`, security definer, `search_path=''`, execute: service_role only:**
```sql
create or replace function public.enforce_plan_limits(p_ws uuid, p_actor uuid default null)
returns jsonb   -- {invites_revoked: int, demoted: uuid[]}
```
Logic (billing workspace `p_ws`): `v_max := (workspace_plan(p_ws)).limits->>'seats'`; (1) delete pending invites with role `admin`/`editor`, newest first, while `seats_used(p_ws) > v_max`; (2) demote members with role `admin`/`editor` to `viewer` (never the owner), latest `workspace_members.created_at` first, while over the limit; each demotion inserts `audit_logs (action='member.role_change', actor_id=p_actor, target_type='workspace_member', metadata={reason:'plan_downgrade', user_id, from, to:'viewer'})`. Brand kits and client workspaces are **not** changed in SQL (runtime rules in `lib/workspace/limits.ts`, P6 §5.4). Called by `billing_apply_plan_change` (downgrade), `applyScheduledChanges`, and on subscription end (`canceled`/`expired`).
- **Edits:** P4 §9.5 (new subsection "9.5b אכיפת מגבלות אחרי שנמוך"); P4 §12.6 note "service_role only". P6 §5.4 table: "פונקציית SQL `enforce_plan_limits(p_ws)` (חלק 04 §9.5b)".

### D-044 — `revoke_grant_remaining` (NEW function)
- **Resolution — `0007` (credit engine §10.3), service_role only:**
```sql
create or replace function public.revoke_grant_remaining(p_grant uuid, p_idem text, p_description_he text, p_actor uuid default null)
returns int   -- credits removed (0 if nothing left or already applied)
```
Logic: `_lock_balance(ws of grant)`; if a `credit_ledger` row with `idempotency_key = p_idem` exists → return 0; `v := remaining` (`for update`); if `v = 0` → return 0; `update credit_grants set remaining = 0`; insert ledger `kind='adjustment'`, `delta=-v`, `grant_id=p_grant`, `description_he=p_description_he`, `idempotency_key=p_idem`, `actor_id=p_actor` (balance via the existing ledger trigger). Reserved credits are already outside `remaining`, so open jobs are unaffected. Keys used: `revoke:{refundRequestId}:{grantId}` (refunds), `revoke:admin:{auditLogId}` (admin tool, D-085), `revoke:chargeback:{paymentId}:{grantId}`.
- **Edits:** P4 §10.3 new function + 1 pgTAP case in §25.2 ("revoke פעמיים עם אותו מפתח מחזיר 0 בפעם השנייה; היתרה יורדת בדיוק ב-`remaining`"). P6 §10.6 step 2 references "חלק 04 §10.3".

### D-045 — `billing_apply_*` functions (NEW)
- **Resolution — `0007`, security definer, `search_path=''`, service_role only, each one transaction, idempotent on `payments.idempotency_key` / ledger keys:**
```sql
-- checkout webhook: subscription_initial | topup | update_card (by checkout_sessions.kind)
create or replace function public.billing_apply_payment(
  p_session uuid, p_provider text, p_txn text, p_amount_ils numeric, p_vat_rate numeric,
  p_method jsonb,        -- {token_enc, brand, last4, exp_month, exp_year, holder_name} | null (Bit / no token)
  p_payload jsonb)
returns jsonb  -- {payment_id, subscription_id, credits_granted, status: 'succeeded'|'amount_mismatch'|'duplicate'}

create or replace function public.billing_apply_renewal(p_payment uuid, p_txn text, p_payload jsonb)
returns jsonb  -- {subscription_id, period_start, period_end, credits_granted}

create or replace function public.billing_apply_plan_change(
  p_subscription uuid, p_payment uuid, p_txn text, p_quote jsonb, p_actor uuid)
returns jsonb  -- {plan_id, cycle, credits_granted, demoted}
```
Semantics exactly as P6 §4.1 step 5, §4.2 step 4, §5.3 (`billing_apply_plan_change` calls `enforce_plan_limits` on a downgrade; `p_payment`/`p_txn` NULL when nothing is charged). `p_subscription` is added to the plan-change function because a zero-charge change has no payment row.
- **Edits:** P4 §10 new subsection "10.8 פונקציות מנוע החיוב (המימוש העסקי: חלק 06)" with the three signatures + one-paragraph contract; P6 §5.3 code: `rpc("billing_apply_plan_change", { p_subscription: sub.id, p_payment: …, p_txn: …, p_quote: q, p_actor: i.actorId })` (both calls); P6 §4.1 step 5 "`billing_apply_payment(...)`" → "`billing_apply_payment` (חלק 04 §10.8)".

### D-046 — pg_cron additions (retention) and `0011` count
- **Resolution — add to `0011_cron.sql` (all UTC):**
```sql
select cron.schedule('purge-ai-generation-meta', '25 3 * * *', $$update public.ai_generations set meta = null
                                                                where meta is not null and created_at < now() - interval '30 days'$$);
select cron.schedule('purge-ai-generations',     '10 4 1 * *', $$select public.purge_ai_generations()$$);
select cron.schedule('purge-support-data',       '20 4 1 * *', $$select public.purge_support_data()$$);
select cron.schedule('purge-audit-logs',         '30 4 1 * *', $$select public.purge_audit_logs()$$);
```
Functions (`0007`, security definer, no grants to any API role):
- `purge_ai_generations()` — delete `ai_generations` older than 24 months.
- `purge_support_data()` — delete `contact_messages`, `abuse_reports`, `email_messages` older than 24 months; `consents` with `user_id is null` (closed accounts — `on delete set null` — and anonymous cookie-banner rows) and `created_at < now() - interval '7 years'` (rows of existing users are never purged); `trial_claims` older than 5 years.
- `purge_audit_logs()` — delete `audit_logs` older than 36 months, except actions matching `payment.%`, `invoice.%`, `refund_request.%`, `subscription.%`, `credits.%`, `billing.%` which are kept 7 years (uses the purge GUC of D-048).
The P4 §15 acceptance "בדיוק את שבע המשימות" → "בדיוק את 11 המשימות".
- **Edits:** P4 §15 SQL + table rows + acceptance; P4 §11.4 functions; P6 §11.5 table rows reference "חלק 04 §15".

### D-047 — `backup_reader` role (NEW, `0012_ops_roles.sql`)
- **Resolution:**
```sql
-- 0012_ops_roles.sql — read-only role for the weekly logical backup (part 06 §15.11); LOGIN + password are set manually (runbook R9), never in git
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'backup_reader') then
    create role backup_reader nologin bypassrls;          -- [M0-verify] that the Supabase postgres role may grant BYPASSRLS
  end if;
end $$;
grant usage on schema public to backup_reader;
grant select on all tables in schema public to backup_reader;
grant select on all sequences in schema public to backup_reader;
alter default privileges in schema public grant select on tables to backup_reader;
-- storage objects are backed up by backup-storage.yml (part 06 §15.11); auth.* is covered by Supabase daily backups + PITR
```
Fallback if BYPASSRLS is not grantable: `backup.yml` uses the `postgres` connection string stored only as GitHub secret `SUPABASE_DB_URL_PRODUCTION` (documented in DECISIONS.md).
- **Edits:** P4 §2.1 tree, new §15b "תפקיד גיבוי"; P6 §15.11 row references P4.

### D-048 — Audit log immutability trigger
- **Issue:** P4 revokes UPDATE/DELETE on `audit_logs` from `service_role`; P6 asks for `prevent_audit_mutation()` but also a monthly purge.
- **Resolution — `0007`, next to the ledger triggers:**
```sql
create or replace function public.prevent_audit_mutation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' and coalesce(current_setting('app.allow_audit_purge', true), '') = 'on' then
    return old;                                   -- only purge_audit_logs() sets this (transaction-local)
  end if;
  raise exception 'AUDIT_LOG_IMMUTABLE' using errcode = 'P0001';
end $$;
create trigger audit_logs_no_update_delete before update or delete on public.audit_logs
  for each row execute function public.prevent_audit_mutation();
create trigger audit_logs_no_truncate before truncate on public.audit_logs
  for each statement execute function public.prevent_audit_mutation();
```
`purge_audit_logs()` begins with `perform set_config('app.allow_audit_purge', 'on', true);`. The existing `revoke update, delete, truncate … from service_role` stays. `AUDIT_LOG_IMMUTABLE` is an internal DB code (maps to `INTERNAL_ERROR`, D-101).
- **Edits:** P4 §10.6 (triggers) + §25.2 test "`update audit_logs` נכשל גם עם המפתח הסודי; `purge_audit_logs()` מוחק רק שורות שעבר זמנן". P6 §15.10 bullet references P4.

### D-049 — `is_platform_admin()` requires MFA; `platform_admin_status()` (NEW)
- **Issue:** P6 §15.4 requires `aal2` for `/admin`; P4's function checks only the flag; the proxy needs to tell "no admin" (404) from "admin without MFA" (redirect `/admin/mfa`).
- **Resolution (`0007` §9.2):**
```sql
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select p.is_platform_admin from public.profiles p where p.id = (select auth.uid())), false)
     and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2';
$$;
create or replace function public.platform_admin_status()
returns text language sql stable security definer set search_path = '' as $$   -- 'none' | 'needs_mfa' | 'ok'
  select case
    when not coalesce((select p.is_platform_admin from public.profiles p where p.id = (select auth.uid())), false) then 'none'
    when coalesce((select auth.jwt() ->> 'aal'), 'aal1') <> 'aal2' then 'needs_mfa'
    else 'ok' end;
$$;
```
`platform_admin_status()` is granted to `authenticated`. Supabase Auth: TOTP MFA enabled (dashboard + `config.toml` `[auth.mfa.totp] enroll_enabled = true, verify_enabled = true`).
- **Edits:** P4 §9.2, §12.6 grant list, §1.2 dashboard steps (add "Auth → MFA → TOTP: enabled"), §1.4 `config.toml`, §17.2 proxy (D-090). P6 §15.4 "MFA חובה" bullet references P4.

### D-050 — RLS/grant edits for new objects
- **Resolution:** `email_messages`: RLS on, admin-read via the 0008 loop, server-only writes. `subscriptions`/`payments` new columns: readable by owner/admin like the rest of the row (no change). `projects.render_options`: same as `projects`. `ai_generations.meta`: column excluded (D-033).
- **Edits:** P4 §12.2, §12.3 matrix, §12.4 loop.

### D-051 — Storage: `invoices` bucket (no change) + new `public-media` paths
- **Resolution:** bucket `invoices` as in P4 §13 (private, PDF, 10 MB, server-only; signed URL 5 min only via `GET /api/billing/invoices/[id]`). New `public-media` paths: `sfx/{id}.mp3` — 8 files, `id ∈ whoosh, impact, pop, sizzle, click, riser, cash, camera_shutter` (= `scenes.sfx` minus `none`); `tests/keyframe-9x16.png` (fixed input for `POST /api/admin/models/test`). Both uploaded by `scripts/upload-static-media.ts` from `supabase/seed/media/` (committed, license recorded in `supabase/seed/media/LICENSES.md`: CC0 or self-produced). Demo media for the marketing site also live in `public-media`: `demo/wall/{n}-{hook_id}.{mp4|avif|vtt}` and `demo/examples/{id}-{9x16|1x1|16x9}.mp4`, `{id}-poster.jpg`, `{id}.vtt`, `{id}-loop.mp4` (D-708); the only repo file is `public/media/demo/logo-demo.svg`.
- **Edits:** P4 §13.1 public-media path list (add `sfx/`, `tests/`, `demo/wall/`, `demo/examples/`), §13.4 `paths.pub` (`sfx: (id) => \`sfx/${id}.mp3\``, `testKeyframe: () => "tests/keyframe-9x16.png"`, `demoWall: (n, hookId, ext) => \`demo/wall/${n}-${hookId}.${ext}\``, `demoExample: (file) => \`demo/examples/${file}\``); P5 note 14 resolved (no `/admin/music` change).

### D-052 — `app_settings` master list (owner P4 seed; Zod per key)
- **Issue:** keys added by P2, P5, P6 are not all in P4 §16.4; some shapes changed.
- **Resolution:** `lib/settings/schema.ts` exports `APP_SETTINGS: Record<AppSettingKey, z.ZodType>`; `PUT /api/admin/settings/[key]` validates with it; readers use `getSetting(key)` (cached 60 s). Seed (`insert_missing`) values:

| key | seed value | Zod / meaning | owner |
|---|---|---|---|
| `vat_rate` | `0.18` | number 0–1 | P6 |
| `vat_rate_next` | `null` (JSON null) | `{rate:number, effective_from:"YYYY-MM-DD"} \| null` | P6 |
| `fx_usd_ils` | `3.70` | number | P4 |
| `election_mode` | `{"enabled": true, "until": "2026-10-28T23:59:00+02:00"}` | `{enabled, until}` | P5/P6 |
| `quiet_day_banner` | `{"enabled": false, "text_he": null, "date": null}` | | P2/P3 |
| `maintenance_mode` | `{"enabled": false, "until": null, "message_he": null}` | source of truth (flag = local override) | P4/P6 |
| `marketing_announcement` | as P4 §16.4 | `{enabled, id, text_he, href}` | P2 |
| `hook_of_the_day` | `{"hook_id": null, "date": null, "history": []}` | `history`: `[{hook_id, date}]`, last 60 | P2/P4 |
| `hebrew_wps` | `{"default": 2.4, "by_voice": {}}` | object; code also accepts a bare number | P5 |
| `tts_fallback_voices` | `{"google/gemini-3.8-flash-tts": {"female": null, "male": null}}` | `{[model_slug]: {female: string\|null, male: string\|null}}`; filled by admin after the M0 spike; `null` → fallback unavailable → `TTS_FAILED` | P5 |
| `openrouter_daily_budget_usd` | `150` | number | P5 |
| `free_trial_credits` | `70` | int | P4/P6 |
| `rollover_cap_multiplier` | `1` | number | P6 |
| `typical_video_credits` | `50` | int | P2/P3 |
| `prompt_versions` | `{}` | `{[family]: "vN"}` | P5 |
| `disposable_email_domains` | list in file | string[] | P4 |
| `allocation_threshold_schedule` | `[{"from":"2026-01-01","ils":10000},{"from":"2026-06-01","ils":5000}]` | ascending by `from` | P6 |
| `business_tax_status` | `"licensed"` | enum per P6 §9.2 | P6 |
| `dunning_retry_days` | `[1, 3, 7]` | int[] | P6 |
| `non_business_days` | Israeli holiday dates for the next 12 months (ISO dates) | string[] | P6 |
| `renewals_paused` | `false` | boolean | P6 |

- **Edits:** P4 §16.4 `app_settings.json` table: change `hebrew_wps`, `hook_of_the_day` values; add `tts_fallback_voices`, `vat_rate_next`, `allocation_threshold_schedule`, `business_tax_status`, `dunning_retry_days`, `non_business_days`, `renewals_paused`; add the `lib/settings/schema.ts` sentence. P3 §22.17: the settings editor lists **all** keys of this table, grouped (כללי · AI · חיוב · שיווק · תפעול), each with a form generated from its Zod schema. P6 §21.3 key table: replace "★" markers with "(חלק 04 §16.4)". P5 §15.7 last sentence → "(ה-seed כותב את צורת האובייקט; הקוד קורא גם מספר)".

### D-053 — `feature_flags` master list
- **Resolution (seed `insert_missing`; `plans` / `workspace_ids` null unless stated):** `phone_otp` false · `avatar` false, plans `{business,agency}` · `voice_clone` false, plans `{business,agency}` · `stock_broll` false · `chat_edit` false · `music_generate` **true** (plans null — entitlement comes from `plans.limits.music_generate`; the flag is a kill switch) · `premium_video` **true** (plans null — entitlement from `limits.quality_tiers`) · `whatsapp_notify` false · `annual_billing` **true** · `hook_submissions` false · `format_4x5` false · `maintenance_mode` false (local override only) · `billing_checkout` **true** (kill switch for new purchases; off → `MAINTENANCE {scope:"checkout"}`). Per-environment differences (e.g. `chat_edit` on in local) are done with `FEATURE_*` env overrides, never with different seed files. PostHog experiment flags (`hero_copy_v1`) are **not** feature flags.
- **Edits:** P4 §16.4 `feature_flags.json` line: add `billing_checkout` **true** and the `plans` values for `avatar`/`voice_clone`. P6 §21.1 table: `music_generate`/`premium_video` plan column → "— (המגבלה ב-`plans.limits`)"; `chat_edit` defaults column → "כבוי (מקומית: `FEATURE_CHAT_EDIT=1`)".

### D-054 — `plans.limits` keys (no change, usage clarified)
- **Resolution:** keys exactly as P4 §16.4: `seats, client_workspaces, brand_kits, max_duration_sec, quality_tiers, visual_mix, max_ai_clips, max_ai_clip_sec, max_formats, max_resolution, watermark, concurrent_jobs, daily_credit_cap, music_generate, hook_variants_max, approval_links, white_label, projects_max`; `null` = unlimited. `watermark` applies only while `workspaces.has_paid = false`. P5's prompt variable `max_ai_clip_seconds` is **derived** (D-140), not a limit key.
- **Edits:** P5 §14.1 (D-140); P3 §1.5 (D-401).

### D-055 — `refund_requests.reason_code` (no change)
- **Resolution:** `distance_14d | extended_4m | technical | goodwill | annual_prorata` (P4 §7). ⚖️ `annual_prorata` stays subject to lawyer approval (D-243).
- **Edits:** none.

### D-056 — `credit_grants.ref_type` values
- **Resolution:** `user | subscription | payment | audit_log | reservation_return | promo | incident`. Plan grants from a payment: `ref_type='payment', ref_id=paymentId`; annual monthly grants: `ref_type='subscription', ref_id=subscriptionId`; rollover restore after an outage: `ref_type='incident'`.
- **Edits:** P4 §7 column comment.

### D-057 — `mark_retention` exempts paying workspaces
- **Issue:** P4 note 11a / P6 note 14: free-plan render deletion after 90 days also hits workspaces that bought a pack or had a subscription.
- **Resolution:** renders are marked for deletion after 90 days only when `workspace_plan(ws).id = 'free'` **and** `workspaces.has_paid = false`. Workspaces that ever paid keep renders while the account exists.
- **Edits:** P4 §11.4 `mark_retention` where-clause `and not w.has_paid`; P4 §15 table text; P6 §11.5 row "סרטונים בתוכנית החינמית" → "90 יום מהיצירה — רק בסביבות שמעולם לא שילמו (`has_paid = false`)"; P2 privacy (D-505); P3 cancel flow (D-415); remove the open item from P4 note 11a.

### D-058 — Account deletion confirmation word (no change)
- **Resolution:** `AccountDeleteBody = { confirmText: "מחיקה" }` (P4 §21.3); P3 copy already asks to type "מחיקה".
- **Edits:** none.

### D-059 — `CancelReason` (no change)
- **Resolution:** `too_expensive | not_using_enough | missing_feature | video_quality | switched_tool | one_time_project | other | unspecified` mapped 1:1 to the seven radio options of P3 §15.5 in order + `unspecified` when none is chosen.
- **Edits:** P3 §15.5: append the `value` next to each radio label.

### D-060 — Search: `search_hooks(p_has_video)` + `search_hooks_facets` (no change)
- **Edits:** none (P2 note 4 resolved by P4 §11.1).

### D-061 — Realtime: `realtime.send` (decision)
- **Issue:** spec §5.4 says `realtime.broadcast_changes`; P4 §14 uses `realtime.send(payload, event, topic, private)` for a minimal payload.
- **Resolution:** `realtime.send` is canonical (minimal payload rule of AppF §6.9); fallback `broadcast_changes` only if the M0 spike shows `realtime.send` is unavailable `[M0-verify]`. Channels `job:{jobId}`, `workspace:{workspaceId}`; events `job.updated`, `step.updated`, `scene.updated`. Client wrapper names: `subscribeJob` (P4 `lib/realtime/subscribe.ts`) used by P3 hook `useJobChannel` (`lib/realtime/use-job-channel.ts`) and `useWorkspaceChannel`.
- **Edits:** AppF errata (D-300 item 6). P3 §1.8: "`useJobChannel` עוטף את `subscribeJob` (חלק 04 §14.2)".

### D-062 — Version locking (no change)
- **Resolution:** a version is locked once any job references it (any status); before that, the server may update `script`/`source` (draft). Editing a locked version forks (`POST /api/projects/[id]/versions`).
- **Edits:** none.

### D-063 — Seed: `plans.tagline_he` and `credit_packs.name_he`/`credit_costs.label_he`
- **Resolution:** values in P4 §16.4 are canonical (P2 §7.2/§7.5/§7.6 proposed them and P4 adopted them). Any P2 text that differs is changed to P4's value.
- **Edits:** P2 §7.2/§7.5/§7.6 — fixer compares and aligns literally.

### D-064 — Trial pepper and email-token keys (no change)
- **Resolution:** Vault secret `trial_hash_pepper` == env `TRIAL_HASH_PEPPER`; email tokens HKDF from `APP_ENCRYPTION_KEY` (info `"email-tokens"`); mock gateway HMAC HKDF info `"mock-gateway"`.
- **Edits:** P6 §20 `TRIAL_HASH_PEPPER` row already says so (no edit).

### D-065 — Enum additions: exactly one
- **Resolution:** the only enum change is the value `'whatsapp'` appended to `webhook_provider` (D-074), written directly in `0001` (pre-launch). Everything else new is a text check (`consents.source`, `abuse_reports.source`, `email_messages.status`). P4 §3 acceptance "36 enum types" stays (no new type).
- **Edits:** P4 §3 (via D-074).

---

# C. P4 — API route contracts (master list) — D-070 … D-099 (D-078/D-079 unused)

### D-070 — MASTER LIST of Route Handlers (owner: P4)
Every `/api/*` path used anywhere in P1–P6/AppD–E must appear here and in P4 with a contract. "NEW" rows must be added to P4 (summary table of the section given + Zod contract + errors). "CHG" rows change an existing P4 contract (see the referenced decision). Rate-limit bucket names refer to P4 §18.6 (incl. D-096).

**§19 — projects, AI text, generation, jobs**

| # | Method · Path | Auth | Idem. | Bucket | Success | Status |
|---|---|---|---|---|---|---|
| 1 | `POST /api/projects` | editor | — | default | `201 { projectId, step }` | CHG (D-094) |
| 2 | `PATCH /api/projects/[id]` | editor | — | default | `200 { project }` | CHG (`renderOptions`, D-036; `brief` shape D-037) |
| 3 | `POST /api/projects/[id]/duplicate` | editor | — | default | `201 { projectId }` | — |
| 4 | `POST /api/projects/[id]/versions` | editor | — | default | `201 { versionId, version }` | — |
| 5 | `POST /api/brand/extract` | user | — | `brand_extract` | SSE | — |
| 6 | `GET /api/projects/[id]/hooks` | member | — | — | `200 { hooks }` | — |
| 7 | `POST /api/projects/[id]/hooks` | editor | required | `llm` | **NDJSON** `HookBatchV1` | CHG (D-071) |
| 8 | `POST /api/projects/[id]/script` | editor | required | `llm` | **NDJSON** `ScriptV1` | CHG (D-071) |
| 9 | `POST /api/projects/[id]/script/beats/[index]/rewrite` | editor | — | `rewrite` | `200 { versionId, beat }` | — |
| 10 | `POST /api/projects/[id]/script/inflect` | editor | — | `inflect` | `200 { versionId }` | — |
| 11 | `POST /api/projects/[id]/storyboard` | editor | required | `llm` | `200 { versionId, storyboard, scenes }` | — |
| 12 | `PATCH /api/projects/[id]/scenes/[sceneId]` | editor | — | default | `200 { scene }` | — |
| 13 | `DELETE /api/projects/[id]/scenes/[sceneId]` | editor | — | default | `200 { scenes }` | — |
| 14 | `POST /api/projects/[id]/scenes/reorder` | editor | — | default | `200 { scenes }` | — |
| 15 | `POST /api/projects/[id]/scenes/[sceneId]/rewrite` | editor | — | `rewrite` | `200 { scene }` | — |
| 16 | `POST /api/projects/[id]/estimate` | member | — | `estimate` | `200 Estimate` | CHG (D-091) |
| 17 | `POST /api/projects/[id]/generate` | editor | required | `generate` | `202 { jobId, variantProjectIds }` | CHG (D-034, D-095) |
| 18 | `POST /api/projects/[id]/scenes/[sceneId]/regenerate` | editor | required | `generate` | `202 { jobId }` | — |
| 19 | `POST /api/projects/[id]/render` | editor | required | `generate` | `202 { jobId }` | — |
| 20 | `POST /api/projects/[id]/post-caption` | editor | — | `rewrite` | `200 { post_caption_he, hashtags_he }` | **NEW** (D-086) |
| 21 | `POST /api/projects/[id]/edit-plan` | editor · flag `chat_edit` | — | `rewrite` | `200 { plan: EditPlanV1 }` | **NEW, v2** (D-087) |
| 22 | `GET /api/jobs/[id]` | member | — | — | `200 { job, steps, scenes }` | — |
| 23 | `POST /api/jobs/[id]/cancel` | editor | — | default | `200 { status }` | — |

**§20 — uploads, assets, hooks library, voices, models, sharing, approvals, invites**

| # | Method · Path | Auth | Bucket | Success | Status |
|---|---|---|---|---|---|
| 1 | `POST /api/uploads/sign` | editor | `uploads` | `200 { assetId, bucket, path, signedUrl, token, resumable }` | — |
| 2 | `POST /api/uploads/complete` | editor | default | `200 { asset }` | CHG (upload moderation, D-154) |
| 3 | `GET /api/assets/[id]/url` (`?download=1`) | member | default | `200 { url, expiresAt }` | — |
| 4 | `GET /api/hooks/search` | public | `hooks_search` | `200 { items, total, facets, page, pageSize }` | — (D-076) |
| 5 | `POST /api/hooks/[id]/event` | public | `hooks_event` | `204` | — |
| 6 | `POST /api/hooks/favorites` | user | default | `200 { on }` | — |
| 7 | `POST /api/hooks/variations` | editor · Idem. | `llm` | **NDJSON** `HookBatchV1` | CHG (D-071, D-088) |
| 8 | `POST /api/hooks/inflect` | user | `inflect` | `200 { text_he }` | — |
| 9 | `POST /api/voices/preview` | user | `voice_preview` | `200 { url, expiresAt }` | — |
| 10 | `GET /api/models/options` | user | default | `200 { qualityTiers, advanced? }` | — |
| 11 | `POST /api/share` | editor | `share` | `201 { url, shareLinkId, expiresAt }` | — |
| 12 | `POST /api/approvals/[token]` | public + token | `approvals` | `200 { status }` | — |
| 13 | `POST /api/abuse-reports` | public | `public_forms` | `204` | CHG (`source`, D-031) |
| 14 | `POST /api/invites/accept` | user | default | `200 { workspaceId }` | — |

**§21 — billing, account, consents, public forms, ops**

| # | Method · Path | Auth | Bucket | Success | Status |
|---|---|---|---|---|---|
| 1 | `POST /api/billing/checkout` | owner/admin | `billing` + `checkout_ip` | `200 { redirectUrl, sessionId }` | CHG (D-093) |
| 2 | `GET /api/billing/checkout/[sessionId]` | owner/admin | default | `200 CheckoutStatus` | — |
| 3 | `POST /api/billing/cancel` | owner | `billing` | `200 { effectiveAt, refundQuote, refundRequestId }` | — |
| 4 | `GET /api/billing/cancel/quote` | owner | default | `200 { effectiveAt, refundEligible, refundQuote }` | — |
| 5 | `POST /api/billing/resume` | owner | `billing` | `200 { status, cancelAtPeriodEnd }` | — |
| 6 | `POST /api/billing/refund-request` | owner | `billing` | `201 { refundRequestId, quote }` | — |
| 7 | `POST /api/billing/plan-change` | owner | `billing` | `200 PlanChangeResponse` | CHG (D-092) |
| 8 | `GET /api/billing/invoices/[id]` | owner/admin | default | `302` (signed, 5 min) | — |
| 9 | `POST /api/account/export` | user | `account` | `202 { requestId }` | — |
| 10 | `POST /api/account/delete` | user | `account` | `202 { requestId }` | CHG (status 400 for `transfer_ownership_first`, D-097) |
| 11 | `POST /api/account/whatsapp/start` | user · flag `whatsapp_notify` | `whatsapp_verify` | `204` | **NEW, v2** (D-089) |
| 12 | `POST /api/account/whatsapp/confirm` | user · flag | `whatsapp_verify` | `200 { verifiedAt }` | **NEW, v2** |
| 13 | `POST /api/account/whatsapp/opt-out` | user · flag | default | `204` | **NEW, v2** |
| 14 | `POST /api/consents` | public / user | `consents` | `204` | — (D-034: no `generate`) |
| 15 | `POST /api/contact` | public | `public_forms` | `204` | — |
| 16 | `POST /api/newsletter` | public | `public_forms` | `204` | — |
| 17 | `GET /api/newsletter/confirm?token=` | public + token | `unsubscribe` | `303` | CHG (bucket, D-096) |
| 18 | `POST /api/unsubscribe?token=` | public + token | `unsubscribe` | `200` | CHG (bucket, D-096) |
| 19 | `GET /api/health` | public | `health` | `200 { ok, db, redis, version, time }` / `503` | **NEW** (D-075) |

**§22 — webhooks** (no session; raw body; `webhook_events` idempotency)

| Path | Provider (`webhook_provider`) | Instances | Status |
|---|---|---|---|
| `POST /api/webhooks/openrouter/video` | `openrouter` | — | — |
| `POST /api/webhooks/render` | `render` | — | — |
| `POST /api/webhooks/payments/[provider]` | `payment` | `/grow` (prod/staging), `/mock` (local/preview/e2e only) | CHG (D-072) |
| `POST /api/webhooks/invoices/[provider]` | `invoice` | `/morning`, `/mock` | — (D-073) |
| `POST /api/webhooks/resend` | `resend` | — | — |
| `POST /api/auth/hooks/send-sms` | — | flag `phone_otp` | — |
| `POST /api/webhooks/whatsapp` (+ `GET` for Meta verification challenge) | `whatsapp` (new enum value, D-074) | flag `whatsapp_notify` | **NEW, v2** (D-074) |

**§23 — cron** (`GET`, `Authorization: Bearer $CRON_SECRET`): `/api/cron/sweep-jobs`, `/api/cron/billing-renewals`, `/api/cron/sync-models`, `/api/cron/hook-of-the-day`, `/api/cron/reminders`, `/api/cron/cleanup` — no change.

**§24.1 — admin** (all P4 rows stay; additions):

| Method · Path | Body | Audit action | Status |
|---|---|---|---|
| `POST /api/admin/models/test` | `{ taskKey, slug? }` | — (logs `ai_generations` without `workspace_id`) | **NEW** (D-083) |
| `GET /api/admin/abuse` | `?status=&source=&page=` | — | **NEW** (D-084) |
| `POST /api/admin/ops/cron` | `{ name: "sweep-jobs"\|"billing-renewals"\|"sync-models"\|"hook-of-the-day"\|"reminders"\|"cleanup" }` | `ops.cron_run` | **NEW** (D-082) |
| `POST /api/admin/credits/revoke-grant` | `{ grantId, reasonHe }` | `credits.revoke` | **NEW** (D-085) |
| `POST /api/admin/billing/payments/[id]/chargeback` | `{ reasonHe }` | `payment.chargeback` | **NEW** (D-085) |
| `POST /api/admin/billing/payments/[id]/invoice` | `multipart/form-data`: `pdf` (≤ 10 MB, `application/pdf`), `docNumber`, `allocationNumber?`, `docType` | `invoice.attach` | **NEW** (D-085) |
| `PATCH /api/admin/workspaces/[id]/plan-override` | `{ planId, until, reason } \| { clear: true }` | `workspace.plan_override` | CHG (D-023) |

- **Edits:** P4 §19.2, §20.1, §21.1, §22.6, §24.1 summary tables + the contracts referenced. P4 §18.1: add the only two exceptions to "JSON only": `POST /api/admin/billing/payments/[id]/invoice` (multipart, 10 MB) and webhooks (raw).

### D-071 — Streaming format: NDJSON (supersedes "AI SDK object stream")
- **Issue:** AppF §4.5 and P4 §18.5 say `streamObject(...).toTextStreamResponse()` consumed by `experimental_useObject` with an `X-Version-Id` header; P5 §3.5 defines NDJSON with `partial`/`done`/`error` events. In AI SDK v6 `streamObject` is deprecated (P5 §3.2), and a text stream cannot carry a typed mid-stream error or the refund result.
- **Resolution:** `POST /api/projects/[id]/hooks`, `POST /api/projects/[id]/script`, `POST /api/hooks/variations` answer `200` with `Content-Type: application/x-ndjson; charset=utf-8`, one JSON object per line:
```ts
// lib/api/contracts/stream.ts
export const StreamEvent = <T extends z.ZodType>(partial: T) => z.discriminatedUnion("type", [
  z.object({ type: z.literal("partial"), data: partial }),                     // deep-partial of the schema, throttled ≥ 80 ms
  z.object({ type: z.literal("done"), versionId: Uuid.nullable(), modelServed: z.string(), credits: z.number().int(),
             workspaceHookIds: z.array(Uuid).optional() }),                   // versionId: script only; workspaceHookIds: hooks/variations
  z.object({ type: z.literal("error"), error: z.object({ code: z.string(), message_he: z.string(),
             details: z.record(z.string(), z.unknown()).optional() }) }),   // details.refunded = credits returned
]);
```
Headers set before the body: `X-Request-Id`, `X-Credits-Spent`. `X-Version-Id` is **removed** (the version id arrives in `done`). Errors before the stream starts are normal JSON error responses with HTTP status. Client: `lib/ai/client/use-ndjson-object.ts` (`useNdjsonObject(schema)`), owned by P5 and used by P3. `experimental_useObject` is not used.
- **Edits:** P4 §18.5 table row "AI SDK object stream" → "NDJSON" with the contract above; P4 §19.2 rows 7–8 ("זרם … + `X-Version-Id`") → "NDJSON; `done.versionId`"; P4 §19.5 code comment "headers X-Version-Id (pre-allocated uuid)" → "versionId in the `done` event"; P4 §19 acceptance "וכותרת `X-Version-Id` שתואמת" → "ואירוע `done` עם `versionId` שתואם"; P4 §20.3 comment "streamed HookBatchV1" → "NDJSON stream of HookBatchV1". P5 §3.5: add `workspaceHookIds` to `done`. P3: wherever the wizard/script/hook screens describe streaming, name the hook `useNdjsonObject`. AppF errata item 2.

### D-072 — Payments webhook route and `parseWebhook(raw, headers, url)`
- **Resolution:** one Route Handler `app/api/webhooks/payments/[provider]/route.ts`; `/api/webhooks/payments/grow` and `/api/webhooks/payments/mock` are its instances (P6 text keeps naming them). The handler passes `new URL(req.url)` as 3rd argument: `adapter.parseWebhook(raw, req.headers, new URL(req.url))` (Grow `?k=&s=` verification). `PaymentProvider.parseWebhook(rawBody: string, headers: Headers, url?: URL)`.
- **Edits:** P4 §22.4 code line; P6 §8.1 interface (already has `url?`); AppF errata (interfaces, item 15).

### D-073 — Invoices webhook route
- **Resolution:** `app/api/webhooks/invoices/[provider]/route.ts`; instances `/morning`, `/mock`. Same 404 rule as payments when `provider !== env.INVOICE_PROVIDER`.
- **Edits:** P4 §22.5: add the 404 sentence; P6 §9.6 already uses `/api/webhooks/invoices/morning` (no edit).

### D-074 — WhatsApp webhook (v2)
- **Resolution:** `GET /api/webhooks/whatsapp` answers Meta's verification challenge (`hub.mode=subscribe`, `hub.verify_token` = HMAC-derived token from `WHATSAPP_APP_SECRET`, returns `hub.challenge`); `POST /api/webhooks/whatsapp` verifies `X-Hub-Signature-256` (HMAC-SHA256 of the raw body with `WHATSAPP_APP_SECRET`), handles delivery statuses and inbound "הסרה" (→ `notification_prefs.whatsapp.opted_out_at = now()`, audit `notifications.whatsapp_opt_out`). Flag `whatsapp_notify` off → 404. Idempotency: `webhook_events` needs a provider value → **add `'whatsapp'` to enum `webhook_provider`** — this is the only enum change in this log and is made directly in `0001` (pre-launch). P4 §3 acceptance stays 36 types (value, not type).
- **Edits:** P4 §3 enum `webhook_provider as enum ('openrouter','payment','invoice','resend','render','whatsapp')`; P4 §22.6 table row; P6 §13.1/§15.7 reference P4 §22.6. (D-065 is amended accordingly: one enum value added.)

### D-075 — `GET /api/health`
- **Resolution:** public, bucket `health` (60/min/IP), excluded from `proxy.ts` matcher, `cache-control: no-store`. Response `{ ok: boolean, db: "ok"|"error", redis: "ok"|"error", version: string /* VERCEL_GIT_COMMIT_SHA short */, time: ISO }`; DB check = `supabase.rpc("health_ping")` where `create function public.health_ping() returns int language sql stable as $$ select 1 $$;` granted to `anon` (add to `0007`/§12.6); Redis = `PING`. `503` when either fails. No secrets, no versions of dependencies.
- **Edits:** P4 new §21.5 "בריאות המערכת" + `health_ping` in §9.1 and grant in §12.6; P4 §18.6 bucket row; P6 §16.3 references P4 §21.5.

### D-076 — Hooks search: route **and** RPC (both)
- **Resolution:** server components of `/hooks*` (P2) call `search_hooks`/`search_hooks_facets` directly with `createStaticClient()` (ISR-friendly); client-side facet changes call `GET /api/hooks/search`. Same function, same results. No other search path.
- **Edits:** P2 §5.1: state both explicitly; P4 §20.3 bullet already matches.

### D-077 — Kept as is
- `GET /api/jobs/[id]` (polling fallback), `GET /api/assets/[id]/url` (`?download=1` → `Content-Disposition: attachment`), `GET /api/projects/[id]/hooks`, `POST /api/admin/hooks/batch`, `POST /api/consents` — all stay; no replacement by other routes.
- **Edits:** none.

### D-080 — Upload complete runs image moderation
- See D-154 (contract in P4 §20.2, logic in P5).

### D-081 — Abuse report body
- **Resolution:** `AbuseReportBody = z.strictObject({ shareToken: z.string().min(20).max(200), reason: z.enum(["likeness","copyright","hate","political","other"]), details: z.string().trim().max(2000).optional(), email: z.email().optional(), website: z.literal("").optional() })`; server resolves `share_link_id`, `project_id`, `workspace_id`; `source='share_page'`; `ip` stored; email to `BRAND.emails.abuse` (template `support_contact` with topic "דיווח על תוכן").
- **Edits:** P4 §20.6 contract (align if different).

### D-082 — `POST /api/admin/ops/cron`
- **Issue:** P6 R3 uses `/api/admin/ops/cron?name=billing-renewals` to run reconciliation now; P4 has only `GET /api/admin/ops/cron` (history).
- **Resolution:** `GET /api/admin/ops/cron` = last 20 failed pg_cron runs (from `cron.job_run_details`) + the last run of each Vercel cron (from the Upstash key `cron:last:{name}` that each cron route writes; no new table); `POST /api/admin/ops/cron { name }` invokes the same handler function in-process (shared module `lib/cron/{name}.ts`), honoring the Upstash lock; audit `ops.cron_run`. The admin billing button "התאמת תשלומים עכשיו" calls `POST … {name:"billing-renewals"}` (which runs `reconcilePendingCheckouts` first).
- **Edits:** P4 §23 add "כל cron כותב `cron:last:{name}` (JSON: `startedAt`, `ms`, `ok`, `summary`) ל-Upstash"; P4 §24.1 row; P6 R3 row "(`POST /api/admin/ops/cron {name:"billing-renewals"}`)"; P3 §22.15 button target.

### D-083 — `POST /api/admin/models/test`
- **Resolution:** contract per P5 §6.4 `{ taskKey: string, slug?: string }` → `200 { ok, modelServed, latencyMs, costUsd, output }` (output: text/JSON for LLM, signed URL for media); not billed; `ai_generations` row with `workspace_id = null`. Rate: `admin` bucket.
- **Edits:** P4 §24.1 row; P3 §22.6 "בדיקה" button → this route.

### D-084 — `GET /api/admin/abuse`
- **Resolution:** list with filters `status`, `source`, pagination 50; `PATCH /api/admin/abuse/[id] { status, notes }` (exists). Actioning a report may call `POST /api/admin/share-links/[id]/revoke` (exists).
- **Edits:** P4 §24.1 row; P3 §22.19 data source.

### D-085 — Admin billing tools
- **Resolution:** (a) `POST /api/admin/credits/revoke-grant { grantId: Uuid, reasonHe: HeText(5,300) }` → audit row first, then `revoke_grant_remaining(grantId, 'revoke:admin:{auditLogId}', reasonHe, actorId)` → `200 { removed }`. (b) `POST /api/admin/billing/payments/[id]/chargeback { reasonHe }` → `payments.status='refunded'`, `failure_reason='chargeback'`, `revoke_grant_remaining` for every grant with `ref_type='payment' and ref_id=paymentId` (key `revoke:chargeback:{paymentId}:{grantId}`), subscription canceled immediately (`status='canceled'`, `current_period_end=now()`, `workspaces.plan_id='free'`), admin alert; audit `payment.chargeback`. (c) `POST /api/admin/billing/payments/[id]/invoice` (multipart) → stores PDF at `invoices/{ws}/{invoiceId}.pdf`, inserts `invoices` row with `provider='manual'`, `provider_doc_id='manual:{docNumber}'`; audit `invoice.attach`; sends `invoice_ready`.
- **Edits:** P4 §24.1 rows; P6 §7.2 chargeback row → "(`POST /api/admin/billing/payments/[id]/chargeback`, audit `payment.chargeback`)" (replaces "`payment.refund` עם `metadata.reason='chargeback'`" in P6 §7 acceptance too); P6 §9.5 manual invoice → route (c); P3 §22.15/§22.16 buttons.

### D-086 — `POST /api/projects/[id]/post-caption`
- **Issue:** `post.caption.v1` ("regenerate social post text", AppF §7.2) has no route; P3 shows post text only as copy.
- **Resolution:** body `{ versionId: Uuid, platform: z.enum(ENUMS.platform) }`; free (0 credits), bucket `rewrite` (shared 50/day); runs `post.caption.v1`; stores the result in `projects.brief.post_caption` (versions may be locked) and returns `200 { post_caption_he, hashtags_he }`. `DownloadsPanel` shows `brief.post_caption` when present, else `version.script.post_caption_he`.
- **Edits:** P4 §19.5 contract + §19.2 row; P5 §3.4 table row `post.caption` → "`POST /api/projects/[id]/post-caption`"; P3 §8.1 downloads row "טקסט לפוסט": add secondary button **"כתיבה מחדש · חינם"** with a platform `Select` (רילס · טיקטוק · פייסבוק · לינקדאין).

### D-087 — `POST /api/projects/[id]/edit-plan` (v2, flag `chat_edit`)
- **Resolution:** body `{ versionId, instructionHe: HeText(3, 500) }` → `200 { plan: EditPlanV1 }` (no DB write, free, bucket `rewrite`); applying = existing routes (`PATCH …/scenes/[sceneId]`, `…/regenerate`). Flag off → 404.
- **Edits:** P4 §19.5 contract + row; P3 §9.5 data source sentence.

### D-088 — `POST /api/hooks/variations` without a source hook
- **Issue:** P2 links `/app/hooks?generate=1&niche=&q=` ("let AI write 10 new hooks for your business"); the route requires `sourceHookId`.
- **Resolution:** `HookVariationsBody = z.strictObject({ sourceHookId: z.union([HookId, Uuid]).optional(), nicheSlug: Slug.optional(), topicHe: HeText(2, 80).optional(), count: z.number().int().min(3).max(10), gender: z.enum(ENUMS.hook_gender).optional(), register: z.enum(ENUMS.register).optional() })`; without `sourceHookId` it runs `hooks.generate.v1` on the workspace business profile (+ `nicheSlug`/`topicHe`) instead of variations. Same price (`hooks.generate`, 1 credit), same storage (`workspace_hooks`, `project_id = null`). `topicHe` is free text → never sent to analytics.
- **Edits:** P4 §20.3 contract; P3 §14 (D-418).

### D-089 — WhatsApp verification routes (v2)
- **Resolution:** `POST /api/account/whatsapp/start { phone }` (E.164 via `normalizePhoneIL`, sends template `verify_code_he` with a 6-digit code stored hashed in Upstash `wa:verify:{userId}` for 10 min, max 5/hour) → `204`; `POST /api/account/whatsapp/confirm { code }` → writes `notification_prefs.whatsapp = {phone_e164, verified_at, opted_in_at}` + audit `notifications.whatsapp_opt_in` → `200 { verifiedAt }`; `POST /api/account/whatsapp/opt-out` → `opted_out_at`, audit `notifications.whatsapp_opt_out`. All 404 when flag off.
- **Edits:** P4 §21 contracts + rows; P6 §13.2 references them.

### D-090 — `proxy.ts` behavior and matcher
- **Resolution:** matcher adds `"/v/:path*"`, `"/approve/:path*"`, `"/unsubscribe"`, `"/dev/:path*"`; the API exclusion regex also excludes `health`: `"/api/((?!webhooks/|cron/|hooks/search|auth/hooks/|health).*)"`. Behavior: (1) CSP nonce for dynamic routes (`/app`, `/admin`, `/login`, `/auth/*`, `/v/*`, `/approve/*`, `/unsubscribe`) → header `x-nonce` (P6 §15.3); (2) `/dev/*` → 404 when `APP_ENV === "production"`; (3) `/admin*`: `platform_admin_status()` → `none` → rewrite 404; `needs_mfa` → redirect `/admin/mfa` (except when already on `/admin/mfa`); `ok` → continue; (4) `/` → `marketingExperiments` (hero A/B rewrite to `/exp/hero/[variant]` only when cookie `exp_hero` exists); (5) existing session refresh/login redirects. Marketing pages other than `/` stay outside the proxy.
- **Edits:** P4 §17.2 proxy code + bullets; P6 §15.3 references P4 §17.2.

### D-091 — Estimate response adds `alreadySpent`
- **Resolution:** `EstimateResponse` gains `alreadySpent: z.number().int().nonnegative()` (= credits of `script.generate` + `storyboard.generate` already spent on this project's current version, from `estimate().alreadySpent`); `credits` remains "what will be reserved now".
- **Edits:** P4 §19.7; P3 §6.10 (D-412).

### D-092 — Plan change body/response
- **Resolution:** `PlanChangeBody = z.strictObject({ planId: z.enum(["free","starter","business","agency"]), cycle: z.enum(ENUMS.billing_cycle), when: z.enum(["now","period_end"]).optional(), dryRun: z.boolean().default(false) })` (default `when` per P6 §5.1 rules); `PlanChangeResponse` adds `newCycle: z.enum(ENUMS.billing_cycle)` and `newPriceIls: z.number()`; request for the current plan **and** cycle while a `scheduled_change` exists → cancels the scheduled change and returns `200` with `immediate: true, chargeNowIls: 0` (not `same_plan`). Without a scheduled change → `400 INVALID_INPUT {reason:"same_plan"}`. `past_due` → `400 {reason:"past_due"}`.
- **Edits:** P4 §21.2 contracts + bullets; P3 §15.3 `PlanChangeDialog` toggle "מסוף החודש / מעכשיו" maps to `when` (D-414).

### D-093 — Checkout errors and kill switch
- **Resolution:** `POST /api/billing/checkout` errors: `400 INVALID_INPUT` reasons `billing_profile_required | annual_disabled | use_plan_change` (subscription when a live one exists); `403 FORBIDDEN {reason:"checkout_temporarily_blocked"}` (3 failed payments in 1 h in the workspace → 24 h block, P6 §7.2); `429 RATE_LIMITED {scope:"checkout"}` (bucket `checkout_ip`) or `{scope:"topup_daily"}` (> 6 packs / 24 h); `503 MAINTENANCE {until:null, scope:"checkout"}` when flag `billing_checkout` is off or `app_settings.maintenance_mode.enabled`.
- **Edits:** P4 §21.1 row 1 errors; P6 §21.1 acceptance "מחזיר … את `MAINTENANCE` עם `until`" → "`MAINTENANCE {scope:"checkout"}`".

### D-094 — `CreateProjectBody.src`
- **Resolution:** `src: z.enum(["hero","final_cta","onboarding","hooks","template","dashboard","niche_page"]).optional()`. Query `/app/create?src=` uses the same values. Unknown value → ignored (not an error).
- **Edits:** P4 §19.3; P3 §6.0 parameter list (add `final_cta`, `template`, `niche_page`); P2 §… links use only these values.

### D-095 — `generation_confirmed` is a client event only
- **Resolution:** sent by `ConfirmGenerateDialog` after `202` (P3 §6.10, AppF §12.9). The server does not send it.
- **Edits:** P4 §19.8 step 8: delete "אירוע `generation_confirmed` בצד השרת".

### D-096 — Rate-limit buckets (master, owner P4 §18.6)
- **Resolution:** P4 table + these rows: `checkout_ip` — `POST /api/billing/checkout` — IP — 20/hour; `admin` — `/api/admin/*` — user — 120/min; `unsubscribe` — `POST /api/unsubscribe`, `GET /api/newsletter/confirm` — IP — 30/min (they leave `public_forms`); `health` — `GET /api/health` — IP — 60/min; `whatsapp_verify` — `/api/account/whatsapp/start|confirm` — user — 5/hour; `rewrite` adds `…/post-caption` and `…/edit-plan`. `details.scope` copy keys for P3: `checkout`, `topup_daily`, `whatsapp_verify` (D-102). Webhooks: no rate limit, body ≤ 1 MB.
- **Edits:** P4 §18.6 table; P6 §15.6 → "הטבלה המלאה בחלק 04 §18.6" only.

### D-097 — One HTTP status per error code
- **Issue:** P4 §21.3 ("422 `INVALID_INPUT` transfer_ownership_first") and P5 §15.6 ("422 INVALID_INPUT no_active_voice") contradict `ERROR_STATUS.INVALID_INPUT = 400`.
- **Resolution:** the status always comes from `ERROR_STATUS` (`INVALID_INPUT` = 400). Those two places become 400. A testimonial without `brief.testimonial.consent_attested` → `422 MISSING_FACTS { facts: ["אישור הלקוח על ההמלצה"] }`.
- **Edits:** P4 §21.3; P5 §15.6 item 1; P5 §21.3 + acceptance ("נחסם ב-422" → "נחסם ב-422 `MISSING_FACTS`").

### D-098 — Team invite link
- **Resolution:** `https://{{DOMAIN}}/login?invite={token}&email={urlencoded email}&next=/app`; `email` only pre-fills the field (PostHog `before_send` strips `invite`, `email`); after login `/auth/callback` calls `POST /api/invites/accept`.
- **Edits:** P4 §1.3 last bullet; P6 §12.5 `team_invite` button URL; P3 §17 "קבלת הזמנה" line.

### D-099 — Server Actions (no new ones)
- **Resolution:** P4 §24.2 list stays; `updateProfile` input per D-022.

---

# D. P4 — error codes (master list) — D-100 … D-104

### D-100 — MASTER LIST of API error codes (owner P4 `lib/errors.ts`; copy owner P3 `messages/he.json → errors.*`)

| Code | HTTP | `details` | Where it comes from |
|---|---|---|---|
| `INSUFFICIENT_CREDITS` | 402 | `{ needed, balance }` | reserve/spend/debit |
| `PLAN_LIMIT` | 403 | `{ limit, max?, required?, cap?, used?, reason? }` (`limit` ∈ `plans.limits` keys; `reason:"client_workspace_read_only"` with `limit:"client_workspaces"`) | API checks |
| `CONCURRENCY_LIMIT` | 409 | `{ max, running }` | `create_job_and_reserve` |
| `RATE_LIMITED` | 429 | `{ scope, retryAfter }` + `Retry-After` header | Upstash buckets, `daily_credit_cap` uses `PLAN_LIMIT` |
| `MODERATION_BLOCKED` | 422 | `{ reason_he, categories }` | moderation (brief/hook/script/prompt/upload) |
| `ELECTION_POLICY_BLOCKED` | 451 | `{ until }` | election mode |
| `MISSING_FACTS` | 422 | `{ facts: string[] }` (Hebrew labels) | facts gate, testimonial consent |
| `PROVIDER_UNAVAILABLE` | 503 | `{ refunded? }` | OpenRouter, `or:halt`, Upstash fail-closed |
| `PROVIDER_TIMEOUT` | 504 | — | jobs/steps |
| `VIDEO_JOB_FAILED` | 502 | — | jobs |
| `TTS_FAILED` | 502 | — | jobs |
| `RENDER_FAILED` | 502 | — | jobs |
| `BUDGET_GUARD` | 503 | — | `assertBudget()` |
| `INVALID_INPUT` | 400 | `{ issues: [{path, key, params}] }` or `{ reason, ... }` | Zod / business rules |
| `NOT_FOUND` | 404 | — | |
| `FORBIDDEN` | 403 | `{ requiredRoles }` or `{ reason }` | roles, billing, checkout block |
| `PAYMENT_FAILED` | 402 | `{ providerMessage? }` | gateway |
| `WEBHOOK_INVALID_SIGNATURE` | 401 | — | webhooks |
| `MAINTENANCE` | 503 | `{ until, scope?: "checkout" }` | `app_settings.maintenance_mode`, flag `billing_checkout` |
| `UNAUTHENTICATED` | 401 | — | no/expired session |
| `EDIT_CONFLICT` | 409 | `{ reason: "stale"\|"version_locked"\|"duplicate", currentUpdatedAt? }` | optimistic concurrency |
| `INTERNAL_ERROR` | 500 | `{ requestId }` | unexpected |

22 codes total = AppF §12.10 (19) + `UNAUTHENTICATED`, `EDIT_CONFLICT`, `INTERNAL_ERROR`. No other code may be returned in `error.code`.
- **Edits:** P4 §18.2 `details` paragraph: add `PLAN_LIMIT.reason`, `MAINTENANCE.scope`, `PROVIDER_UNAVAILABLE.refunded`. AppF errata item 13.

### D-101 — Internal DB exception names are not API codes
- **Resolution:** `LEDGER_BALANCE_MISMATCH` (P4 §10.6) and `AUDIT_LOG_IMMUTABLE` (D-048) are raised with SQLSTATE `P0001` but are not in `ERROR_CODES`; `fromDbError` maps them to `INTERNAL_ERROR` and Sentry gets the original message. P5's `OrErrorCode` values (`bad_request`, `unauthorized`, `insufficient_credits`, `moderation_flagged`, `not_found`, `timeout`, `rate_limited`, `upstream_error`, `network`, `invalid_response`) are internal and mapped per P5 §2.3.
- **Edits:** P4 §18.2 one sentence after `fromDbError`.

### D-102 — Reason/scope registry and copy keys (P3)
- **Resolution:** P3 `messages/he.json` gets these maps (exact Hebrew):
  - `errors.INVALID_INPUT.byReason`: `idempotency_key_required` "משהו השתבש בשליחה. רעננו את הדף ונסו שוב." · `url_blocked` "לא הצלחנו לפתוח את הכתובת הזו. אפשר למלא את הפרטים ידנית." · `hook_scene_required` "אי אפשר למחוק את סצנת ההוק. אפשר לערוך אותה או להחליף את ההוק." · `hook_scene_first` "סצנת ההוק נשארת ראשונה. אפשר להזיז את שאר הסצנות." · `not_cancelable` "היצירה כבר הסתיימה, אז אין מה לעצור." · `mime_not_allowed` "סוג הקובץ הזה לא נתמך. אפשר להעלות JPG, ‏PNG, ‏WEBP, ‏HEIC, ‏MP4 או MOV." · `too_large` "הקובץ גדול מדי. הגודל המרבי: {max}." · `not_uploaded` "ההעלאה לא הושלמה. נסו להעלות שוב." · `content_mismatch` "תוכן הקובץ לא תואם לסוג שלו. שמרו אותו מחדש ונסו שוב." · `too_small` "התמונה קטנה מדי. צריך לפחות {min} פיקסלים בצלע הקצרה." · `too_long` "הסרטון ארוך מדי. אפשר להעלות עד 10 דקות." · `no_render` "קודם יוצרים את הסרטון, ואז אפשר לשתף אותו." · `billing_profile_required` "לפני התשלום צריך למלא פרטים לחשבונית." · `annual_disabled` "מנוי שנתי לא זמין כרגע. אפשר לבחור מנוי חודשי." · `same_plan` "זו כבר התוכנית שלכם." · `use_plan_change` "כבר יש לכם מנוי פעיל. אפשר להחליף תוכנית בעמוד התוכניות." · `past_due` "יש חיוב שלא עבר. אחרי עדכון אמצעי התשלום אפשר להחליף תוכנית." · `no_active_subscription` "אין מנוי פעיל לבטל." · `not_cancelable_state` "אי אפשר לחדש את המנוי הזה. אפשר לבחור תוכנית חדשה." · `not_eligible` "התשלום הזה לא עומד בתנאי ההחזר. אפשר לכתוב לנו ונבדוק." · `confirm_text` "כדי לאשר צריך להקליד את המילה "מחיקה"." · `transfer_ownership_first` (the existing P3 §16.4 copy) · `no_active_voice` "אין כרגע קולות זמינים. אפשר ליצור בלי קריינות."
  - `errors.FORBIDDEN.byReason`: `billing_on_parent` "החיוב מנוהל בחשבון הסוכנות." · `invite_email_mismatch` "ההזמנה נשלחה לכתובת מייל אחרת. התחברו עם הכתובת שקיבלה את ההזמנה." · `checkout_temporarily_blocked` (P6 §7.2 copy verbatim).
  - `errors.EDIT_CONFLICT.byReason`: `stale` (existing P3 copy) · `version_locked` "הגרסה הזו כבר שימשה ליצירה, אז השינוי נשמר כגרסה חדשה." · `duplicate` "הפריט הזה כבר קיים."
  - `errors.PLAN_LIMIT.byLimit` additions: `max_ai_clips` and `max_ai_clip_sec` = the `visual_mix` copy · `max_resolution` "Full HD זמין מתוכנית בסיס." · `byReason.client_workspace_read_only` "סביבת הלקוח במצב קריאה בלבד מאז שינוי התוכנית. אפשר לצפות ולהוריד, וליצור שוב אחרי מעבר לתוכנית סוכנות."
  - `errors.RATE_LIMITED.byScope` additions: `checkout` "היו כמה ניסיונות תשלום ברצף. אפשר לנסות שוב בעוד {retryAfter}." · `topup_daily` "הגעתם למספר הרכישות המרבי ליממה. כתבו לנו ונגדיל את המגבלה." · `whatsapp_verify` "שלחנו כבר כמה קודים. אפשר לבקש קוד חדש בעוד {retryAfter}."
  - `errors.MAINTENANCE.byScope.checkout` "הרכישות מושהות לזמן קצר. המנוי והקרדיטים שלכם ממשיכים לעבוד כרגיל."
- **Edits:** P3 §1.4 (new sub-table "וריאנטים לפי `details`"), §1.5, §23 JSON excerpt.

### D-103 — `UNAUTHENTICATED` and `INTERNAL_ERROR` copy
- **Resolution:** P3 §1.4 rows: `UNAUTHENTICATED` 401 — title "החיבור פג" — body "צריך להתחבר שוב כדי להמשיך. מה שעשיתם נשמר." — action "התחברות" (opens the session-expired dialog of P3 §1, return to the same step). `INTERNAL_ERROR` 500 — title/body = `errors.unknown.title/body` + `errors.supportCode` with `details.requestId`.
- **Edits:** P3 §1.4 table + §23 JSON.

### D-104 — `fromDbError` duplicates
- **Resolution:** `23505` → `EDIT_CONFLICT {reason:"duplicate"}` stays (P4). No change.

---

# E. P5 — AI pipeline — D-130 … D-156

### D-130 — MASTER LIST of prompt template IDs (owner P5 `lib/ai/prompts/*`)

| ID | Task key | Output schema | Credits | Notes |
|---|---|---|---|---|
| `sys.hebrew_style.v1` | — | — | — | shared system block; sub-block `sys.hebrew_style.v1#core` (sections 8, 10, 13) for `moderation.*` and `brand.extract.v1` — a block, not an ID |
| `brand.extract.v1` | `llm.cheap` | `BrandProfileV1` | 0 | |
| `moderation.brief.v1` | `llm.cheap` | `ModerationV1` | 0 | kinds: brief, hook, script, image_prompt, instruction |
| `moderation.upload.v1` | `llm.cheap` (image input) | `ModerationV1` | 0 | **NEW** (D-154) |
| `hooks.generate.v1` | `llm.hooks` | `HookBatchV1` | 1 (`hooks.generate`) | also used by `/api/hooks/variations` without a source (D-088) |
| `hooks.inflect.v1` | `llm.cheap` | `{ variants: [{gender, text_he}] }` | 0 | |
| `hooks.library_batch.v1` | `llm.batch` | `HookBatchV1` | — (admin) | |
| `script.generate.v1` | `llm.script` / `llm.premium` | `ScriptV1` | 2 (`script.generate`) | |
| `storyboard.generate.v1` | `llm.storyboard` / `llm.premium` | `StoryboardV1` | 1 | |
| `scene.rewrite.v1` | `llm.script` | `SceneRewriteV1` | 0 | also beat rewrite and the facts-gate "rephrase without the number" (`instruction:"custom"`, fixed text P5 §10.8) |
| `tts.normalize.v1` | `llm.cheap` | `TtsNormalizeV1` | 0 | |
| `captions.emphasis.v1` | `llm.cheap` | `{ pages: [{index, emphasis_word_indices}] }` | 0 | |
| `post.caption.v1` | `llm.script` | `PostCaptionV1` | 0 | route D-086 |
| `seo.niche_intro.v1` | `llm.script` | `SeoNicheIntroV1` (extended, D-153) | — (admin) | |
| `edit.chat.v1` | `llm.script` | `EditPlanV1` | per actions | v2, flag `chat_edit`, route D-087 |

`prompt_versions` family keys = the ID without `.vN` (e.g. `"script.generate": "v2"`). `PromptId` union in P5 §8.1 must include `moderation.upload.v1`. `ai_generations.task` for both moderation templates = `llm_moderation`.
- **Edits:** P5 §8.1 union, §8.4 budget table row `moderation.upload.v1 | llm.cheap | 0 | 400 | image + 500 chars | 0`, new §10.14 (D-154); AppF errata item 9.

### D-131 — Placeholder dictionary (owner P5 `lib/hebrew/placeholders.ts`)
- **Issue:** AppF dictionary has 15; seed uses `{הנחה}`, `{בעיה}`; P5 adds 5 script-only names; P3 `MissingFactsPanel` has questions for only 5.
- **Resolution:** `lib/hebrew/placeholders.ts` exports `ALLOWED_PLACEHOLDERS` (22, order below), `HOOK_PLACEHOLDERS = ALLOWED_PLACEHOLDERS.slice(0, 17)`, and `PLACEHOLDERS: Record<PlaceholderName, { kind: "fact" | "profile" | "free"; autofill: string | null; unit: "ils"|"percent"|"count"|"duration"|"rating"|"text"; hookAllowed: boolean }>`. The question text lives in `messages/he.json` under `wizard.facts.q.{name}` (P3 owns the copy below verbatim).

| # | Name | Kind | Auto-fill source (when present) | Unit | Hooks? | `wizard.facts.q.*` (P3 MissingFactsPanel / HookPersonalizer label) |
|---|---|---|---|---|---|---|
| 1 | `עיר` | profile | `business_profiles.city` | text | ✓ | "באיזו עיר העסק?" |
| 2 | `שכונה` | profile | `business_profiles.area` | text | ✓ | "באיזו שכונה או אזור?" |
| 3 | `שירות` | profile | `brief.focus_service` → first `business_profiles.services[].name_he` | text | ✓ | "איזה שירות מציגים בסרטון?" |
| 4 | `מוצר` | profile | `brief.focus_service` | text | ✓ | "איזה מוצר מציגים בסרטון?" |
| 5 | `מחיר` | fact | `brief.offer` / `business_profiles.facts` (key `price*`) | ils | ✓ | "מה המחיר? (₪)" |
| 6 | `סכום` | fact | `business_profiles.facts` | ils | ✓ | "מה הסכום? (₪)" |
| 7 | `מספר` | fact | `business_profiles.facts` | count | ✓ | "מה המספר?" |
| 8 | `זמן` | fact | `business_profiles.facts` | duration | ✓ | "כמה זמן? (למשל: 3 חודשים)" |
| 9 | `חודש` | profile | month of `brief.offer.valid_until`, else the current Hebrew month name | text | ✓ | "באיזה חודש?" |
| 10 | `קהל_יעד` | profile | `business_profiles.audience_he` | text | ✓ | "למי הסרטון מיועד? (למשל: זוגות צעירים)" |
| 11 | `שם_העסק` | profile | `business_profiles.business_name` | text | ✓ | "מה שם העסק?" |
| 12 | `פעולה_שגויה` | free | — | text | ✓ | "איזו טעות נפוצה עושים הלקוחות שלכם?" |
| 13 | `מיתוס` | free | — | text | ✓ | "איזה מיתוס נפוץ יש בתחום שלכם?" |
| 14 | `לפני` | free | — | text | ✓ | "איך זה נראה לפני?" |
| 15 | `אחרי` | free | — | text | ✓ | "איך זה נראה אחרי?" |
| 16 | `הנחה` | fact | `brief.offer` | percent or ils | ✓ | "מה גובה ההנחה?" |
| 17 | `בעיה` | free | — | text | ✓ | "איזו בעיה העסק פותר?" |
| 18 | `דירוג` | fact | `business_profiles.facts` (key `google_rating`) | rating | scripts only | "מה הדירוג? (למשל 4.8)" |
| 19 | `כתובת` | profile | `business_profiles.address` | text | scripts only | "מה הכתובת?" |
| 20 | `שם_לקוח` | fact | `brief.testimonial.name_he` | text | scripts only | "מה השם שיופיע עם ההמלצה? (רק באישור)" |
| 21 | `מספר_רישיון` | fact | `business_profiles.facts` (key `license_number`) | text | scripts only | "מה מספר רישיון התיווך?" |
| 22 | `מילה` | profile | `brief.cta.keyword` | text | scripts only | "איזו מילה יכתבו בתגובות?" |

Rules: (1) `kind:"fact"` placeholders are always `FactSlot` `placeholder` items in the facts gate (P3 §6.12 rule 1 set = names 5, 6, 7, 8, 16, 18, 20, 21). (2) `profile`/`free` placeholders are filled automatically when the source exists; otherwise they also appear in `MissingFactsPanel` with their question (the server rejects any open `{…}` at `POST /generate`). (3) Hook seed validation accepts only names 1–17 (`{צבע}` fails). (4) Prefix grammar ("ב{עיר}" + "השרון" → "בשרון") per AppF §7.4 / P5.
- **Edits:** P5 §8.2 add `PLACEHOLDERS` metadata export; P3 §6.12 rule 1 list → "placeholders מסוג `fact` (חלק 05 `PLACEHOLDERS`): מחיר · סכום · מספר · זמן · הנחה · דירוג · שם_לקוח · מספר_רישיון"; P3 §6.12 question bullet → replaced by the table (all 22, keys `wizard.facts.q.{name}`); P2 §5.3 `HookPersonalizer` fields use the same labels for names 1–17; P4 §16 seed acceptance unchanged.

### D-132 — ₪ placement helper
- **Resolution:** `applyShekel(text: string, format: "prefix" | "suffix"): string` is exported from `lib/hebrew/placeholders.ts` (AppE §6.1 location). It rewrites `349 ₪` ↔ `₪349` and `{מחיר} ₪` ↔ `₪{מחיר}`; it never touches `vo_tts_he`. P5 `buildPromoProps` imports it from there.
- **Edits:** P5 §20.2 import line + bullet "`applyShekel` (מ-`lib/hebrew/placeholders.ts`)". See D-260 for the global rule.

### D-133 — CTA keyword quotes
- **Resolution:** quotation marks around the comment keyword are ASCII double quotes: end card `כתבו "{מילה}" בתגובות` / `כתבי "{מילה}" בתגובות` / `כתוב "{מילה}" בתגובות`; VO display line `כתבו "{מילה}" בתגובות, ונשלח לכם את הפרטים בפרטי.`; `vo_tts_he` strips the quotes (AppD note 5). Gershayim (״) are used only inside acronyms. In TS source use template literals so no escaping is needed.
- **Edits:** P5 §12.4 `CTA_DEFAULTS` row `comment_keyword` (both columns). P5 §15.2 `normalizeForTts` rule 14: "מחיקת סוגריים, אימוג׳ים **ומירכאות `"`**".

### D-134 — Banned phrases single source
- **Resolution:** `BANNED_PHRASES` (AppE §5.2, exported from `lib/ai/prompts/style-data.ts`) is the single list for the lint (`HE001`), the UI copy lint (`pnpm lint:copy`, P1 §2.1 item 11) and section 11 of `sys.hebrew_style.v1`. The style guide string is built at module load: section 11 = a fixed lead-in sentence + `BANNED_PHRASES.map((p) => "- " + p).join("\n")`. The P5 §9 text shows section 11 as that lead-in plus the rendered list; the "verbatim" rule applies to everything else. The snapshot test covers the built string; the "no `${` / `{{` in system" test runs on the built string.
- **Edits:** P5 §9 section 11 + acceptance; P1 §2.1 item 11: "הרשימה המלאה: `BANNED_PHRASES` (נספח E §5.2); אלה דוגמאות"; AppE §5.2: ensure the seven P1 examples ("קחו את העסק לשלב הבא", "פתרון חדשני ומקיף", "בעולם של היום", "זה הזמן ל…", "האם ידעת ש…", "אתה לא תאמין", "חוויית משתמש מושלמת") are in the list — add any missing ones and update the count "45" everywhere in AppE (§5.2 heading/acceptance, note 3) to the new total.

### D-135 — Word budget vs. end card
- **Issue:** P5 §12.1 subtracts 2.5 s of end card from the VO budget while `S02`/`B03` require scenes to sum to the target; AppF §8.1 appends the end card (2.5 s + 0.3 s tail) after the scenes.
- **Resolution:** scenes cover the full target; the end card is outside it (final length = target + 2.8 s, inside AppF's −10%/+20% window). VO budget ≈ `0.9 × wps × target`. Table (wps 2.4): 15 s ≈ 32 words · 30 s ≈ 65 · 45 s ≈ 97 · 60 s ≈ 130; typical beats unchanged.
- **Edits:** P5 §12.1 formula sentence + table; AppD note 13 resolved (no AppD change).

### D-136 — `jobs.options.afterJobId`
- See D-038/D-040. **Edits:** P5 §18.9, §19.4.

### D-137 — Status codes in P5
- See D-097 (`no_active_voice` → 400; testimonial → `422 MISSING_FACTS`).

### D-138 — `buildPromoProps` sources
- **Resolution:** per-project overrides from `projects.render_options` (D-036), then brand kit, then defaults. `endCard.contact.instagram` from `business_profiles.instagram_url` when `show_instagram`. `PromoProps` extensions accepted as canonical (AppF errata item 8): `endCard.disclaimersHe: string[]`, `endCard.licenseTextHe: string | null`, `disclaimer: { textHe: string; showOn: "end_card" | "all" } | null`. `disclaimer.showOn = "all"` by default when `compliance_flag = 'financial'` and the script has compliance flag `price_claim` (AppD note 12).
- **Edits:** P5 §20.2 code + bullets; P5 §21.3 financial rule.

### D-139 — Hook title line limits
- **Resolution:** `HookTitle`/`OverlayTexts` enforce AppE §12: ≤ 22 / 24 / 32 characters per line for 9:16 / 1:1 / 16:9, max 2 lines; auto-shrink font up to 15% before overflow; beyond that the editor shows a warning (P3 §9.3: "הטקסט ארוך מדי לשתי שורות בפורמט {format}. כדאי לקצר."). Constants `LENGTH_LIMITS` from `lib/ai/prompts/style-data.ts`.
- **Edits:** P5 §20.5; P3 §9.3 + §6.9 scene list.

### D-140 — `max_ai_clip_seconds` is derived from plan limits
- **Resolution:** `maxAiClipSeconds = min(mixCap(visual_mix, target), limits.max_ai_clips == null ? Infinity : limits.max_ai_clips * limits.max_ai_clip_sec)`, plus per-clip caps: number of `ai_clip` scenes ≤ `limits.max_ai_clips` and each billed clip ≤ `limits.max_ai_clip_sec` (when not null). The "free: one clip ≤ 5 s, hook scene only" sentence becomes a consequence of the free plan's limits, not a special case in code.
- **Edits:** P5 §14.1 table cell for `smart` and algorithm step 3; P5 §10.7 input comment.

### D-141 — `estimateSample` and `SAMPLE_PRESETS`
- **Resolution:** `SAMPLE_PRESETS` is exported from `lib/pipeline/estimate.ts` (P5) with four keys used across marketing: `images15` `{durationSec:15, quality:"standard", visualMix:"images", images:4, clipSeconds:0, formats:1}` → 23; `draft30` `{30,"draft","smart",6,15,1}` → 50; `standard30` `{30,"standard","smart",6,15,1}` → 107; `premium60` `{60,"premium","full",10,36,1}` → 478. `estimateSample(p: SamplePreset, costs)` — `SamplePreset` includes optional `visualMix`. P2 imports it (no local definition).
- **Edits:** P5 §14.2 signature + constant; P2 §3.7.2 code: delete the local `SAMPLE_PRESETS`, `import { SAMPLE_PRESETS, estimateSample } from "@/lib/pipeline/estimate"`.

### D-142 — AppD/E technical notes accepted (P5 edits)
- **Resolution / Edits:** (a) `NOUN_GENDER` (P5 §15.4) adds construct forms `ימי`, `שנות`, `חודשי`, `שעות`, `שבועות` with their gender. (b) `normalizeForTts` rule 14 strips `"` (D-133). (c) `buildKeyframePrompt` (P5 §13): skip a segment already present in `image_prompt_en` (case-insensitive), clamp to 110 words **before** appending the fixed suffix `no text, no letters, no logos, no watermark`; the `cinematic` style anchor no longer fixes the lens ("35mm lens" removed from `STYLE_ANCHORS.cinematic`; lens comes from the shot rule 10). (d) Trigram similarity `S13` treats Hebrew letters as word characters (same as `pg_trgm` with UTF-8). (e) `S15` hashtags: reject space, geresh, gershayim and niqqud inside a hashtag (AppE §10).
- **Edits:** P5 §13.2, §13 code, §15.2, §15.4, §11.3 `S13`/`S15`.

### D-143 — Secret rotation in verification helpers
- **Resolution:** `OPENROUTER_CALLBACK_TOKEN_SECRET` and `GROW_WEBHOOK_SECRET` may hold a comma-separated list; sign with the first, verify against all (`lib/crypto.ts` `hmacSign(secrets[0], …)` / `hmacVerifyAny(secrets, …)` with `timingSafeEqual`). Applies to `?t=` tokens (P5 §5.1, §19.2 render) and Grow `?k=` (P6 §8.2).
- **Edits:** P5 §5.1/§5.2 code; P4 §22.1 rule 2 sentence.

### D-144 — ICU variable in Hebrew UI copy
- **Issue:** P5 §21.4 copy "התיאור כולל {בעיה}" uses a Hebrew name that looks like a placeholder.
- **Resolution:** ICU variables in `messages/he.json` are ASCII camelCase: `{issueHe}`.
- **Edits:** P5 §21.4.

### D-145 — `data_collection: "deny"` on media endpoints `[M0-verify]`
- **Resolution:** sent on every OpenRouter request (chat and media). If a media endpoint rejects the field (M0 spike), it is omitted for that endpoint only, recorded in `DECISIONS.md`, and P2's privacy wording (§10.3) and FAQ `faq-data-training` are updated in the same PR.
- **Edits:** P5 §4 intro; P2 §10.3 add a `[M0-verify]` marker next to the sentence.

### D-146 — `regenerate_scene` re-renders all formats (accepted)
- **Resolution:** one regeneration = new media for the scene + one render pass over all formats of the last successful assembly; the estimate includes `render.base` + `render.extra_format × (n−1)`; shown before confirmation.
- **Edits:** P3 §9.4 `RegenerateSceneDialog` cost line "כולל הרכבה מחדש של {formats} הפורמטים"; AppF errata item 17.

### D-147 — Capture/refund pairs (accepted)
- **Resolution:** degradation does `capture` + `refund` pairs with keys `capture:{jobId}:{stepKey}` / `refund:{jobId}:{stepKey}`; the ledger UI hides `capture` rows by default (P3 §15.1, already).
- **Edits:** none.

### D-148 — Fonts in the browser Player
- **Resolution:** `@remotion/google-fonts` is used only in the render environment; the browser Player loads caption fonts from the same origin through `components/video/caption-fonts.ts` (P1) — required by CSP `font-src 'self' data:`.
- **Edits:** P5 §20.9 one bullet.

### D-149 — Interfaces extended (accepted)
- **Resolution:** `JobOrchestrator.status?()`, `RenderProvider.startAsync?()/poll?()`, `RenderInput.still` (P5 §19) and the `PaymentProvider`/`InvoiceProvider` additions (P6 §8–§9) are canonical; AppF §6.1/§10.7 signatures are superseded (errata item 15).
- **Edits:** AppF errata only.

### D-150 — `hebrew_wps` shape
- See D-052. **Edits:** P5 §15.7 last sentence.

### D-151 — `tts_fallback_voices`
- See D-052. Voice names for `google/gemini-3.8-flash-tts` are filled by an admin after the M0 TTS spike `[M0-verify]`; when the value for the needed gender is `null`, the fallback is skipped and the step fails with `TTS_FAILED` after the primary's retries.
- **Edits:** P5 §15.6 item 2.

### D-152 — SFX library
- See D-051 (`public-media/sfx/{id}.mp3`, 8 ids = `scenes.sfx` values except `none`).
- **Edits:** P5 §17.3 path reference.

### D-153 — `seo.niche_intro.v1` output extended
- **Issue:** P2 §4.3 expects the generator to also draft `short_name_he` and `landing_intro_he`.
- **Resolution:** `SeoNicheIntroV1 = { seo_title_he ≤60, seo_description_he ≤155, seo_intro_he (180–260 words; Zod 900–2,200 chars), landing_intro_he (250–400 words, 3–5 paragraphs; Zod 1,300–3,200 chars), short_name_he (1–4 words, ≤ 40 chars), faq: 4–6 × {q_he ≤120, a_he ≤700} }`. Prompt rules 6–7 added for the two new fields (plural form usable after ל־ for `short_name_he`). Output is saved as a draft; `seo_reviewed_at` is set only by a human in `/admin/niches`. `scripts/generate-niche-seo.ts` (P2) also creates `sample_scripts` (3 per niche) with `script.generate.v1`.
- **Edits:** P5 §10.12 rules + JSON schema + Zod (§11.2); P2 §4.3 sentence names both generators.

### D-154 — Upload moderation (`moderation.upload.v1`)
- **Resolution:** runs inside `POST /api/uploads/complete` for `upload_image` (the stored JPEG) and `upload_video` (first frame extracted with `@remotion/media-parser`/ffmpeg) — not for `logo`/`brand_image`. Input: the image (signed URL, 10 min) + the upload's file name; system prompt: block sexual/nudity, sexual content involving minors (also triggers an admin alert), graphic violence, hate symbols, real public figures, weapons; output `ModerationV1`. Allowed → `assets.metadata.moderation = {allowed:true, categories:[], checked_at, prompt_version}`; blocked → object deleted, `metadata.upload_state='rejected'`, response `422 MODERATION_BLOCKED { reason_he, categories }`. Provider error → the asset is kept but marked `moderation: {pending: true}` and re-checked by the `cleanup` cron before it can be used in a render (`plan.ts` ignores pending assets).
- **Edits:** P5 new §10.14 (full system text in Hebrew, same style as §10.2) + §21.1 table row "העלאות"; P4 §20.2 `complete` steps + error list; P6 §15.9 references P5 §10.14.

### D-155 — Streaming client hook
- See D-071. **Edits:** P5 §3.5 add `workspaceHookIds` to `done`; P5 §1.2 file list already has `lib/ai/client/use-ndjson-object.ts`.

### D-156 — `pickSampleScript` and examples count
- See D-009.

---

# F. P6 — billing, legal, ops, analytics, env — D-200 … D-222, D-243

### D-200 — MASTER LIST of analytics events (owner P6 §14.2 + `lib/analytics/events.ts`)
- **Issue:** AppF §12.9 (33 events) + P2 ★7 + P3 ★19 + P6 ★4; P6 §14.2 lists P2/P3 events as "לפי חלק 02/03" without properties; P3/P6 disagree on some sides.
- **Resolution:** P6 §14.2 is replaced by this table (63 events, snake_case). `c` = client (`track`), `s` = server (`trackServer`). Properties are exact; `?` = optional. Enum-valued properties use the lists in D-202. No free text, emails, names, phones, search strings or placeholder values ever.

| # | Event | Properties | Side | Origin |
|---|---|---|---|---|
| 1 | `signup_started` | `method?: "google"\|"magic_link"\|"phone"`, `source?: SignupSource` | c | F/P2/P3 |
| 2 | `signup_completed` | `method` | s | F |
| 3 | `onboarding_completed` | `niche: slug\|null` | c | F |
| 4 | `niche_selected` | `niche`, `location: NicheLocation` | c | F/P2/P3 |
| 5 | `hook_copied` | `hook_id`, `niche: slug\|"universal"`, `location: HookLocation` | c | F/P2/P3 |
| 6 | `hook_personalized` | `fields_count: int` | c | F/P2 |
| 7 | `hook_create_video_clicked` | `hook_id` | c | F |
| 8 | `hook_variations_requested` | `hook_id: string\|null` (null = generate without source, D-088) | c | F |
| 9 | `hook_shared` | `hook_id`, `channel: "whatsapp"\|"link"` | c | P2 |
| 10 | `hook_favorited` | `hook_id`, `on: boolean` | c | P3 |
| 11 | `hooks_searched` | `q_length: int`, `results?: int`, `location: "hub"\|"landing_teaser"\|"niche_page"\|"app_hooks"` | c | P2 |
| 12 | `hooks_filtered` | `facet: "niche"\|"type"\|"platform"\|"goal"\|"gender"\|"season"\|"featured"\|"has_video"\|"sort"`, `value: string` (enum value or slug only) | c | P2 |
| 13 | `savings_calculated` | `videos: int`, `price_bucket: "lt300"\|"300_700"\|"700_1500"\|"gt1500"`, `quality: "draft"\|"standard"` | c | P2 |
| 14 | `faq_expanded` | `question_id`, `location: "landing"\|"faq_page"\|"pricing_page"\|"niche_page"` | c | P2 |
| 15 | `example_played` | `example_id`, `location: "landing_gallery"\|"examples"\|"niche_page"\|"template_page"` | c | P2 |
| 16 | `contact_submitted` | `topic` (ContactBody topic enum) | c | P2 |
| 17 | `pricing_viewed` | `location: "landing"\|"pricing_page"\|"app"` | c | F/P2 |
| 18 | `cta_clicked` | `location: CtaLocation` | c | F/P2/P3 |
| 19 | `newsletter_subscribed` | — | c | F |
| 20 | `brand_extracted` | `success: boolean` | c | F |
| 21 | `wizard_step_viewed` | `step: WizardStep` | c | P3 |
| 22 | `wizard_step_completed` | `step: WizardStep` | c | F |
| 23 | `fast_path_used` | — | c | F |
| 24 | `missing_facts_resolved` | `count: int`, `action: "confirmed"\|"replaced"\|"removed"\|"mixed"` | c | P3 |
| 25 | `hook_selected` | `source: "library"\|"ai"\|"own"`, `count: int` | c | P3 |
| 26 | `variant_group_created` | `count: int` | c | P3 |
| 27 | `script_generated` | `model_served`, `ms: int` | s | F |
| 28 | `storyboard_generated` | `model_served`, `ms: int` | s | F |
| 29 | `preview_played` | — | c | F |
| 30 | `generation_confirmed` | `credits`, `quality`, `visual_mix`, `duration: 15\|30\|45\|60`, `formats: AspectRatio[]` | c | F (D-095) |
| 31 | `generation_completed` | `job_id`, `duration_ms`, `cost_usd`, `degraded_scenes: int` | s | F |
| 32 | `generation_failed` | `stage: JobStage`, `error_code: ErrorCode` | s | F |
| 33 | `generation_canceled` | `stage: JobStage` | c | P3 |
| 34 | `scene_regenerated` | `what: "visual"\|"clip"\|"keyframe"` | c | F |
| 35 | `scene_rewritten` | `instruction: "shorter"\|"energetic"\|"formal"\|"custom"` | c | P3 |
| 36 | `scene_reordered` | — | c | P3 |
| 37 | `rerender_started` | `formats: AspectRatio[]` | c | P3 |
| 38 | `project_duplicated` | — | c | P3 |
| 39 | `export_opened` | — | c | P3 |
| 40 | `video_downloaded` | `format: AspectRatio` | c | F |
| 41 | `captions_downloaded` | `type: "srt"\|"vtt"` | c | F |
| 42 | `share_link_created` | `kind: "public_view"\|"client_approval"` | c | F |
| 43 | `client_approval_submitted` | `decision: "approved"\|"changes_requested"` | s (as the link creator, only with their consent) | F |
| 44 | `checkout_started` | `kind: "subscription"\|"topup"\|"update_card"\|"plan_change"`, `plan_id?`, `pack_id?`, `cycle?` | c | F |
| 45 | `checkout_completed` | `kind`, `plan_id: string\|null`, `pack_id: string\|null`, `cycle: BillingCycle\|null`, `amount_ils: number` | s | F |
| 46 | `topup_purchased` | `pack_id` | s | F |
| 47 | `credits_low_shown` | `location: "dashboard"\|"wizard"\|"billing"\|"banner"` | c | F |
| 48 | `subscription_canceled` | `reason: CancelReason` | s | F |
| 49 | `refund_requested` | `reason_code` | s | F |
| 50 | `subscription_renewed` | `plan_id`, `cycle` | s | P6 |
| 51 | `subscription_payment_failed` | `attempt: int` | s | P6 |
| 52 | `plan_changed` | `from_plan`, `to_plan`, `immediate: boolean` | s | P6 |
| 53 | `refund_completed` | `reason_code` | s | P6 |
| 54 | `motion_toggled` | `on: boolean` | c | F |
| 55 | `theme_changed` | `theme: "dark"\|"light"\|"system"` | c | F |
| 56 | `brand_kit_saved` | `fields: ("logo"\|"colors"\|"fonts"\|"captions"\|"intro"\|"end_card"\|"watermark"\|"voice"\|"music")[]` | c | P3 |
| 57 | `upload_completed` | `kind: "upload_image"\|"upload_video"\|"logo"\|"brand_image"` | c | P3 |
| 58 | `member_invited` | `role: "admin"\|"editor"\|"viewer"` | c | P3 |
| 59 | `client_workspace_created` | — | c | P3 |
| 60 | `notification_clicked` | `kind: NotificationKind` | c | P3 |
| 61 | `data_export_requested` | — | c | P3 |
| 62 | `account_delete_requested` | — | c | P3 |
| 63 | `shortcuts_opened` | — | c | P3 |

Also allowed (PostHog built-ins, not in `EVENTS`): `$pageview` (sent manually on route change), `$feature_flag_called` (PostHog experiments). Server-only events above must **not** be sent from the client (P3 removes client-side `subscription_canceled`, `refund_requested`, `storyboard_generated`).
- **Edits:** P6 §14.2 replace table; P6 §14.3 `EVENTS` comment "every event in 14.2" stays; P2 §14 table: keep its rows but each must equal this table (fix `hooks_searched` `results?` optional; `pricing_viewed` locations); P3 §1.9 list → "(רשימה מלאה וקנונית בחלק 06 §14.2)"; P3 §6.9 "בסיום: אירוע `storyboard_generated`" → delete (server event); P3 §15.5 "אירועים: `subscription_canceled {reason}`, ו-`refund_requested`" → "(אירועי שרת, חלק 06 §14.2)"; P3 §14 `hook_favorited {on}` → `{hook_id, on}`; P3 §9 scene regenerate → `scene_regenerated {what}`.

### D-201 — Super properties and groups
- **Resolution:** every client event carries `app_env`, `release`, `theme`, `reduced_motion`, `is_mobile`; inside `/app` and `/admin` also `plan_id`, `workspace_type`, `role`, `ui_gender_form`. Server events carry `app_env`, `release`. Group: `posthog.group("workspace", workspaceId, { plan_id, type, niche_slug, created_month })`.
- **Edits:** P6 §14.1 "מאפייני-על" bullet; P3 §1.9 second bullet → reference P6.

### D-202 — Enum lists for analytics properties
- **Resolution (TS unions in `lib/analytics/events.ts`):**
  - `SignupSource`: `header | hero | hooks_gate | pricing | final_cta | mobile_sticky | login`.
  - `NicheLocation`: `hero | niche_showcase | final_cta | niches_hub | onboarding | wizard`.
  - `HookLocation`: `hub | niche_page | hook_niche_page | single_hook | landing_teaser | niche_showcase | blog | dashboard | app_hooks`.
  - `CtaLocation`: `header | mobile_menu | hero | how_it_works | editor_math | hooks_teaser | landing_gallery | final_cta | mobile_sticky | niche_page_hero | niche_page_final | hooks_page_cta | examples_dialog | template_card | template_page | pricing_card_free | pricing_card_starter | pricing_card_business | pricing_card_agency | pricing_pack_150 | pricing_pack_500 | pricing_pack_1500 | blog_cta | about | not_found | share_page | dashboard_quickstart | dashboard_fast_path | dashboard_season | app_templates`.
  Pack locations use the credit count (`pricing_pack_150`), **not** `pricing_pack_pack-150`.
- **Edits:** P2 §14 `cta_clicked` location list (`pricing_pack_pack-150/500/1500` → `pricing_pack_150/500/1500`); P2 §14 `signup_started` sources; P6 §14.3 type definitions.

### D-203 — Experiments
- **Resolution:** PostHog flag `hero_copy_v1` + cookie `exp_hero` (set only after analytics consent) + route `app/(marketing)/exp/hero/[variant]` (noindex), rewrite from `/` in `proxy.ts` (D-090). Never used for paid features.
- **Edits:** none beyond D-090.

### D-204 — Money formatting function names
- **Issue:** P1 `lib/format/index.ts` exports `formatIls(amount: number)` with ₪ prefix; P6 `lib/billing/money.ts` exports another `formatIls(a: Agorot)` using `Intl` currency (₪ suffix + bidi marks).
- **Resolution:** the only ILS display formatter is P1's `formatIls(amount: number, opts?)` (prefix, no Intl currency style). P6 `money.ts` drops its `formatIls` and exports `formatAgorot(a: Agorot, opts?: { agorot?: "auto" | "always" }) => formatIls(a / 100, opts)`. Billing code, emails and invoice-line builders use `formatAgorot`/`formatIls`; React UI uses `Price`.
- **Edits:** P6 §1.4 code + comment; any P6 call to `formatIls(agorot)` → `formatAgorot(...)`.

### D-205 — MASTER LIST of environment variables (owner P6 §20; AppF §9 base)
- **Resolution:** P6 §20 table stays and gains the groups below. `lib/env.ts` validates runtime vars; CI-only and CLI-only vars are listed in `.env.example` comments but not in `lib/env.ts`.
  - **Public:** `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
  - **Server runtime:** `APP_ENV`, `SUPABASE_SECRET_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, `OPENROUTER_APP_URL`, `OPENROUTER_APP_TITLE`, `OPENROUTER_WEBHOOK_SECRET`, `OPENROUTER_CALLBACK_TOKEN_SECRET` (comma list, D-143), `OPENROUTER_DAILY_BUDGET_USD`, `ORCHESTRATOR` (`vercel-workflow`|`inline`; `trigger` reserved for v2 and accepted by `jobs.orchestrator` only), `RENDER_PROVIDER`, `RENDER_SCALE` (tests), `REMOTION_SANDBOX_VCPUS`, `REMOTION_SANDBOX_TIMEOUT_MS`, `BLOB_READ_WRITE_TOKEN`, `REMOTION_LICENSE_KEY`, `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION`, `REMOTION_LAMBDA_FUNCTION_NAME`, `REMOTION_SERVE_URL`, `TRIGGER_SECRET_KEY`, `PAYMENT_PROVIDER`, `GROW_API_BASE_URL`, `GROW_API_KEY`, `GROW_USER_ID`, `GROW_PAGE_CODE`, `GROW_PAGE_CODE_BIT`, `GROW_WEBHOOK_SECRET` (comma list), `INVOICE_PROVIDER`, `MORNING_API_BASE_URL`, `MORNING_API_KEY_ID`, `MORNING_API_KEY_SECRET`, `APP_ENCRYPTION_KEY`, `APP_ENCRYPTION_KEY_PREVIOUS`, `EMAIL_PROVIDER`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `SMTP_URL`, `EMAIL_ALLOWLIST`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CRON_SECRET`, `REVALIDATE_SECRET`, `TRIAL_HASH_PEPPER`, `ADMIN_EMAILS`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SMS_PROVIDER`, `SMS_API_KEY`, `SEND_SMS_HOOK_SECRET`, `WHATSAPP_PROVIDER` (`meta_cloud`|`mock`), `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_APP_SECRET`, `FEATURE_*` (ignored when `APP_ENV=production`).
  - **Provided by Vercel (read-only):** `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_GIT_COMMIT_SHA` (→ `release`).
  - **Local Supabase CLI only** (`supabase/config.toml` `env()`): `SUPABASE_AUTH_GOOGLE_CLIENT_ID`, `SUPABASE_AUTH_GOOGLE_SECRET`.
  - **CI / GitHub secrets only:** `SUPABASE_PROJECT_REF`, `SUPABASE_DB_URL` (local/CI test DB), `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF_STAGING`, `SUPABASE_PROJECT_REF_PRODUCTION`, `SUPABASE_DB_URL_STAGING`, `SUPABASE_DB_URL_PRODUCTION`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `BACKUP_S3_BUCKET`, `BACKUP_AWS_ACCESS_KEY_ID`, `BACKUP_AWS_SECRET_ACCESS_KEY`, `BACKUP_AWS_REGION`, `BACKUP_AGE_RECIPIENT`.
- **Edits:** P6 §20 table: add rows for the Vercel-provided, CLI-only and CI-only groups (reference §19.3/§15.11 instead of repeating); mark `OPENROUTER_CALLBACK_TOKEN_SECRET`/`GROW_WEBHOOK_SECRET` "רשימה מופרדת בפסיק לרוטציה". P4 §1.4 `config.toml` comment lists the two CLI vars. AppF errata item 12.

### D-206 — MASTER LIST of email template keys (owner P6 §12.4)
- **Resolution:** `EmailKey` = `magic_link` (Supabase template, P4 §1.3) · `welcome` · `video_ready` · `video_failed_refunded` · `payment_receipt` · `invoice_ready` · `payment_failed` · `subscription_canceled` · `renewal_upcoming` · `plan_change_scheduled` · `price_change_notice` · `refund_request_received` · `refund_processed` · `refund_rejected` · `low_credits` · `client_approval_request` · `approval_received` · `team_invite` · `data_export_ready` · `account_deleted` · `terms_update` · `newsletter_confirm` · `newsletter_weekly` · `admin_alert` · `support_contact` · `security_notice` (26 = AppF 15 + 11). Abuse reports and contact form both use `support_contact` with `topic`. WhatsApp templates (v2, Meta-approved, language `he`): `video_ready_he`, `job_failed_he`, `approval_received_he`, `payment_failed_he`, `verify_code_he`. Copy namespace `emails.*`; WhatsApp copy namespace `ops.whatsapp.*`.
- **Edits:** P6 §12.4 add one line "26 מפתחות; `EmailKey` הוא האיחוד שלהם"; AppF errata item 14.

### D-207 — Rate limits
- See D-096 (owner P4 §18.6). **Edits:** P6 §15.6 replaced by a reference.

### D-208 — MASTER LIST of audit actions (owner P4 §24.1; regex `^[a-z_]+(\.[a-z_]+)+$`)
- **Resolution:** `user.ban`, `user.unban`, `user.admin_grant`, `user.admin_revoke`, `workspace.plan_override`, `workspace.white_label`, `workspace.soft_delete`, `workspace.restore`, `member.role_change`, `job.retry`, `job.cancel`, `job.force_refund`, `model.toggle`, `model.sync`, `model.route_update`, `prompt.activate`, `niche.update`, `season.update`, `hook.create`, `hook.update`, `hook.publish`, `hook.archive`, `hook.batch_generate`, `template.update`, `example.publish`, `voice.update`, `music.approve`, `payment.refund`, `payment.chargeback`, `invoice.attach`, `refund_request.approve`, `refund_request.reject`, `subscription.retry_charge`, `subscription.cancel_on_behalf`, `billing.cancel`, `billing.resume`, `billing.plan_change`, `plan.update`, `pack.update`, `credits.adjust`, `credits.revoke`, `credit_cost.update`, `settings.update`, `flag.update`, `share_link.revoke`, `abuse.action`, `ops.cron_run`, `privacy.request`, `notifications.whatsapp_opt_in`, `notifications.whatsapp_opt_out`, `security.incident`. Retention 7 years for prefixes `payment.`, `invoice.`, `refund_request.`, `subscription.`, `billing.`, `credits.`; others 36 months (D-046).
- **Edits:** P4 §24.1 intro: "הרשימה הקנונית של פעולות הביקורת" + list; P3 note 7 list superseded; P6 R7 "`audit_logs` עם `metadata.incident_id`" → "`security.incident` עם `metadata.incident_id`"; D-046 `purge_audit_logs` exception list includes `invoice.%`.

### D-209 — Consent checkbox wording (gender-neutral)
- **Issue:** P6 §4.1 "ואני מאשר או מאשרת אותם" and P3 §12.3 "ואני מסכים או מסכימה" use gender doubling, banned by P1 §2.1 / AppE §4.2.
- **Resolution:** checkboxes: **"קראתי את {תנאי השימוש} ואת {מדיניות הביטול}, והם מקובלים עליי."** (checkout/top-up/plan change) and **"אני האדם שמופיע בהקלטה, והתנאים במדיניות ההסכמה לשימוש בדמות ובקול מקובלים עליי."** (likeness, v2). Exception: first-person legal declarations that a person signs or reads aloud — the model-release PDF (P2 §10.8) and the spoken voice statement (P6 §11.10) — may keep "מאשר או מאשרת" / "מסכים או מסכימה"; in-app, the spoken statement is rendered with ICU `select` on `ui_gender_form` when it is not `plural`.
- **Edits:** P6 §4.1, §11.10; P3 §12.3 line 2, §15.2/§15.3 checkboxes (same text as P6).

### D-210 — Billing engine contracts referenced by P6
- See D-027, D-028, D-043–D-045, D-072, D-092, D-093. **Edits:** P6 §1.7 table "חלק 04 §7"; P6 §5.3 RPC args.

### D-211 — Retention and backups text
- **Resolution:** free-plan render deletion only for never-paid workspaces (D-057). Backups: daily Supabase backups 7 days + PITR 7 days; weekly logical backup kept 30 days, and the last backup of each month kept 12 months; `invoices` storage synced daily and kept 7 years.
- **Edits:** P6 §11.5 rows (renders, backups) consistent with §15.11; P2 privacy retention table (D-505).

### D-212 — Package scripts
- **Resolution:** P6 §23.6 adds `seed:sync` (P4), `send-newsletter` (`tsx scripts/send-newsletter.ts`), `upload-static-media` (D-051), `generate-niche-seo` (`tsx scripts/generate-niche-seo.ts`, P2), `eval:prompts` (`tsx scripts/eval-prompts.ts`, P5), `test:pipeline` (P5 §23.1). `demo:render` gains `--upload` (D-708).
- **Edits:** P6 §23.6 table.

### D-213 — M7 checklist additions
- **Resolution:** add AppE §13.4 listening test (with the voices blind test) and `docs/eval/hebrew-review-m7.md` sign-off to M7 and to the DoD.
- **Edits:** P6 §24 M7, §25.

### D-214 — CSP
- **Resolution:** P6 §15.3 split (nonce for dynamic routes via `proxy.ts`, hash for static marketing with `THEME_SCRIPT_SOURCE` sha256) is canonical; supersedes AppF §12.6 "CSP with nonces" (errata item 11). `media-src`/`img-src` include `https://*.supabase.co` (demo media in `public-media`, D-708).
- **Edits:** none beyond D-090.

### D-215 — Bit visibility
- **Resolution:** Bit is offered only for credit packs and only when `GROW_PAGE_CODE_BIT` is set (and the M0 Grow spike confirmed it). The server passes `bitEnabled: boolean` to `/pricing`, `TopUpDialog` and checkout copy. When false, the marketing strings that mention Bit (`marketing.pricing.bit`, the promise row "תשלום בכרטיס אשראי; חבילות קרדיטים גם ב-Bit", FAQ `pricing-payment-methods`) render their card-only variant (`…ByCardOnly` keys). Terms §6.2 mention Bit conditionally ("אם האפשרות מוצגת בעמוד התשלום").
- **Edits:** P2 §7.3/§7.6/FAQ/§10.2 (add the card-only variants); P3 §15.2 trust line; P6 §8.2 Bit row.

### D-216 — Downgrade effects
- See D-042, D-043. Client workspaces after downgrade: read-only, `generate`/`render` return `403 PLAN_LIMIT {limit:"client_workspaces", reason:"client_workspace_read_only"}`; extra brand kits stay readable but are not offered for new videos (`availableBrandKits()`).
- **Edits:** P6 §5.4 table cells reference the error; P3 §18 client list badge "קריאה בלבד".

### D-217 — 14-day refund on a subscription payment (accepted from P3 note 9a)
- **Resolution:** closes the subscription immediately (`status='canceled'`, `current_period_end = now()`, plan → free) and revokes the remaining credits of that payment's grants (D-044). `annual_prorata` keeps access to the end of the current month and stops future grants (P6 §10.6).
- **Edits:** none (P6 already); ⚖️ item in D-243.

### D-218 — Card update in `past_due` retries immediately (accepted from P3 note 9d)
- **Resolution:** a successful `update_card` checkout for a workspace with a `past_due` subscription triggers one immediate `chargeToken` for the due period (same `renew:` key) inside `handlePaymentEvent`; on success → `billing_apply_renewal`.
- **Edits:** P6 §6.1 add the sentence (if not present); P3 §15.1 banner copy unchanged.

### D-219 — Dunning end state and other P6 gap decisions (accepted)
- **Resolution:** end of dunning = `expired` (not `canceled`); `grant_source='rollover'` only for restoring credits expired during an outage; rollover cap vs. `max(old, new)` monthly credits; Bit only for packs, no token; allowance during `past_due` is deferred until the charge succeeds.
- **Edits:** AppF errata item 19.

### D-220 — `/admin/mfa`
- **Resolution:** page owned by P6 §15.4 (copy) and listed in P3 §22.0 admin routes; reachable with `aal1`; enroll/verify TOTP with Supabase `mfa.enroll`/`challenge`/`verify`, then redirect to `next` or `/admin`.
- **Edits:** P3 §22.0 route list; P4 D-049/D-090.

### D-221 — Newsletter sending (no route)
- **Resolution:** `pnpm send-newsletter --issue={id} [--dry-run]` starts workflow `sendNewsletter(issueId)`; issue content in `content/newsletter/{issueId}.json` (`{ themeHe, introHe, hookIds[5], tipHe, nicheCta }`, validated with Zod). No admin route in MVP.
- **Edits:** P6 §12.5 `newsletter_weekly` "שליחה" bullet: add the content file path.

### D-222 — Sub-processors list (P2 privacy page)
- **Resolution:** add AWS (encrypted backups in S3 `eu-central-1`), Vercel Speed Insights (anonymous performance metrics) and Meta (WhatsApp, only when `whatsapp_notify` is on) to the sub-processor list; `docs/legal/subprocessors.md` mirrors it.
- **Edits:** P2 §10.3; P6 §23.7 already lists the doc.

### D-243 — Open decisions for a lawyer / accountant (⚖️) — moved to P6 §25
- **Resolution:** the following stay as implemented defaults but are listed in a P6 §25 block "החלטות שממתינות לאישור עורך דין / רו״ח" (each with owner and the file/section that implements it): (1) annual pro-rata refund (`annual_prorata`, P6 §10.3); (2) 14-day refund also on an upgrade payment closes the whole subscription; (3) monthly→annual "now" without refund of the unused month (credits kept); (4) flag (not block) workspaces with ≥ 3 refunds in 6 months; (5) VAT-change policy (net price fixed, P6 §9.7); (6) handling suspected harm to minors (upload moderation alert, D-154); (7) DPO, database registration, security level; (8) full refund when cancellation arrived before a charge that went out within the 3-business-day window; (9) render retention exemption for paying workspaces (D-057); (10) "מחיקה" confirmation word; (11) all legal pages in P2 §10 (marked for review); (12) Bit wording in terms.
- **Edits:** P6 §25 new block; remove the same items from P2/P3/P4/P6 integration notes.

---

# G. Content conventions (owner AppE for copy rules, P1 for UI implementation) — D-260 … D-268

### D-260 — ONE ₪ rule (with spelled-out exceptions)
- **Rule:** the shekel sign comes **before** the number, no space: **"₪119"**, "₪1,140", "₪95.50", negative "−₪50" (U+2212). Applies to: all product UI, marketing site, blog, legal pages, emails, WhatsApp texts, admin (₪ amounts), invoice-line text we generate, analytics (numbers only, no sign). Implementation: P1 `formatIls` / `Price` / `Num` only (D-204); never `Intl.NumberFormat` with `style:"currency"`; never a hand-written "₪" next to a number in `messages/he.json` (ICU variable formatted by `formatIls`).
- **Exception 1 — hooks seed (Appendix C, `/seed/hooks.json`, `hooks.text_he`, `workspace_hooks.text_he` produced by `hooks.*` prompts):** suffix with a space, "349 ₪", and the placeholder form "{מחיר} ₪" (seed README convention; `build_seed.py --check` and the AppE lint fail on "₪349" inside hook text).
- **Exception 2 — videos:** every on-screen / display text that enters a render (hook title, overlay text, captions display text, `vo_he`, `vo_full_he`, end card, post caption) follows `brand_kits.shekel_format` (`prefix` = default "₪120"; `suffix` = "120 ₪"). `applyShekel()` (D-132) rewrites library hooks when they enter a project, and `buildPromoProps` applies it once more before render. The two option labels in the brand-kit editor show both forms literally ("₪120" · "120 ₪") — the only place a literal ₪ amount appears in UI strings.
- **Exception 3 — spoken text:** `vo_tts_he` never contains ₪ or digits: "מאה עשרים שקל" / "מאה ועשרים שקלים" per AppE §6 and P5 `numberToHebrew`.
- **Exception 4 — third-party documents:** Morning renders its own PDFs; we don't control their format.
- **Edits:** P1 §2.1 item 20 / §2.5 (reference this rule); P2 copy — fixer greps for "\d+ ₪" and "ש״ח" in marketing copy and converts to prefix; P5 §9 section 4 (already per `shekel_format`); P6 §12.5 (already prefix); AppE §6.1 table matches this (no edit); AppC/seed unchanged; P1 note 11 / AppD note 8 resolved.

### D-261 — Quotation marks, gershayim, geresh
- **Rule:** quotation = ASCII `"…"`; gershayim `״` (U+05F4) only inside acronyms (נדל״ן, מע״מ, עו״ד, ש״ח); geresh `׳` (U+05F3) for abbreviations and foreign sounds (שנ׳, ג׳); never ASCII `"` inside a Hebrew word; ellipsis `…` (U+2026); en dash with spaces ` – ` between clauses; `·` as an inline list separator. In JSON, quotation marks are escaped `\"`; in TS use template literals for Hebrew strings that contain `"`.
- **Edits:** P5 `CTA_DEFAULTS` (D-133); P2/P3 copy — fixer greps `״` used as quotation marks around words (pattern `״[^״ ]+״`) and converts to `"…"`; AppE §9 (no edit).

### D-262 — Gender-neutral UI address
- **Rule (P1 §2.1, AppE §4):** plural imperative for CTAs and creation buttons ("צרו", "נסו שוב"); action nouns for system buttons ("שמירה", "ביטול", "הורדה", "דילוג", "עצירה"); impersonal phrasing when possible ("אפשר…", "כדאי…"); `ui_gender_form` (`plural` default, `female`, `male`) selects ICU branches where address is unavoidable; no slashes ("בחר/י"), no gender dots, no parentheses, no doublings ("מאשר או מאשרת") — except signed/spoken legal declarations (D-209).
- **Canonical replacements of AppF strings:** "דלג לתוכן הראשי" → **"דילוג לתוכן הראשי"**; "עצור אנימציות" → **"עצירת אנימציות"**; "צור · 107 קרדיטים" → **"צרו את הסרטון · 107 קרדיטים"**; "אני זכאי/ת לתקופת ביטול מורחבת (4 חודשים)" → **"יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)"**; the page/nav label "צור קשר" → **"יצירת קשר"** (CTA buttons that open the form: **"דברו איתנו"**).
- **Edits:** P1 §5 component table row `CancelSubscriptionFlow` ("אני זכאי/ת…" → new text); P2 §2.3 footer column, §9 heading/breadcrumbs/H1/meta ("צור קשר" → "יצירת קשר"; §9.1 button "צור קשר" → "דברו איתנו"), §10.6 accessibility statement ("דלג לתוכן הראשי" → "דילוג לתוכן הראשי"); P6 §4.1 checkbox (D-209); AppF errata item 10. Fixers grep every part for the masculine singular imperatives `לחץ|בחר|צור|הירשם|התחבר|נסה|שלח|הורד|דלג|עצור|הזן|הקלד|גלה|קבל` at the start of quoted UI strings and fix any remaining hit.

### D-263 — Banned phrases
- See D-134 (single source `BANNED_PHRASES`, AppE §5.2).

### D-264 — FAQ JSON shape
- **Rule:** every FAQ stored as data uses `{ "q_he": "…", "a_he": "…" }` (`niches.faq`, `SeoNicheIntroV1.faq`, JSON-LD builder input). Static FAQ pages built from `messages/he.json` use keys `marketing.faq.items.{questionId}.q` / `.a` (ICU strings, not data).
- **Edits:** P2 §4.3 table (`[{ "q": "…", "a": "…" }]` → `[{ "q_he": "…", "a_he": "…" }]`), §4.4 and §4.5 example JSON keys, `lib/seo/jsonld.ts` `faqPage(items: {q_he, a_he}[])`.

### D-265 — Numbers, dates, durations
- **Rule:** one formatting module `lib/format` (P1 §2.5): thousands comma, tabular digits, `<bdi>` isolation, `formatDate` "13 באוקטובר 2026", `formatDurationWords` "30 שנ׳". Emails use the same functions.
- **Edits:** none.

### D-266 — Sample scripts
- See D-009 (AppD: five; `niches.sample_scripts`: three per niche).

### D-267 — Placeholders
- See D-131 (22 names; 17 allowed in hooks; questions in `wizard.facts.q.*`).

### D-268 — Brand names in content
- **Rule:** `{{BRAND_NAME}}` etc. in code come only from `BRAND` (`lib/constants.ts`); in JSON data (`features_he`, prompts) the literal `{{BRAND_NAME}}` is replaced at render time. No change.

---

# H. Master lists — app routes, admin, dev, cookies, storage keys, Redis keys — D-280 … D-287

### D-280 — Marketing routes (owner P2 §1.1; AppF §4.2 base)
`/` · `/niches` · `/niches/[niche]` · `/hooks` · `/hooks/[niche]` · `/hooks/[niche]/[type]` · `/hooks/types` · `/hooks/types/[type]` · `/hooks/season/[season]` · `/hooks/platform/[platform]` · `/hooks/h/[id]` · `/examples` (detail = dialog, no route) · `/templates` · `/templates/[slug]` · `/pricing` (anchors `#credit-costs`) · `/blog` · `/blog/[slug]` · `/blog/tag/[tag]` · `/about` · `/contact` (`?topic=`) · `/faq` · `/legal/{terms,privacy,cancellation,accessibility,ai-policy,likeness-consent,cookies}` (`?v={version}` for archived versions) · `/accessibility` → 308 `/legal/accessibility` · `/v/[token]` · `/v/[token]/opengraph-image` · `/approve/[token]` · `/unsubscribe` (`?token=`) · `/login` (`?next=&invite=&email=`) · `/auth/callback` · `/auth/confirm` · `/auth/error` · `/exp/hero/[variant]` (noindex, rewrite target only) · OG: `/niches/[niche]/opengraph-image`, `/hooks/[niche]/opengraph-image`, `/hooks/types/[type]/opengraph-image`, `/hooks/h/[id]/opengraph-image`, `/blog/[slug]/opengraph-image` · `/sitemap.xml` (+ `generateSitemaps` segments; `[M0-verify]` index) · `/robots.txt`. Robots disallow `/app`, `/admin`, `/api`, `/v`, `/approve`, `/exp`, `/dev`.
- **Edits:** P2 §1.1 table: add `/exp/hero/[variant]`, the OG routes and `/accessibility` redirect; P2 §12.3 robots list adds `/exp`, `/dev`.

### D-281 — App routes and accepted query parameters (owner P3)
`/app` (`#queue`) · `/app/onboarding` · `/app/create` (`?template=&hook=&workspaceHook=&niche=&type=&season=&fast=1&src=` — `src` per D-094) · `/app/projects` · `/app/projects/[projectId]` · `/app/projects/[projectId]/create/[step]` · `/app/projects/[projectId]/jobs/[jobId]` · `/app/projects/[projectId]/editor` · `/app/library` · `/app/brand` · `/app/brand/[kitId]` · `/app/templates` · `/app/hooks` (`?niche=&season=&source=&variations=1&generate=1&q=`) · `/app/billing` (`?topup={packId}&checkout=canceled`) · `/app/billing/plans` (`?plan=&cycle=`) · `/app/billing/cancel` · `/app/billing/return` (`?session=`) · `/app/team` · `/app/clients` · `/app/settings` · `/app/settings/notifications` · `/app/settings/accessibility` · `/app/settings/privacy` · `/app/settings/pronunciation`. Path segment name is `[projectId]` everywhere (not `[id]`) for pages; API routes keep `[id]`.
- **Edits:** P3 §6.0 params; P3 §14 (`generate`, `q`); P6 links `"/app/projects/{projectId}..."` ✓; P3 internal mentions of `/app/projects/[id]` → `[projectId]`.

### D-282 — Admin routes (owner P3 §22; AppF §4.4 base)
`/admin` · `/admin/mfa` (P6) · `/admin/models` · `/admin/prompts` · `/admin/niches` · `/admin/seasons` · `/admin/hooks` · `/admin/templates` · `/admin/examples` · `/admin/voices` · `/admin/music` · `/admin/users` · `/admin/workspaces/[id]` · `/admin/jobs` · `/admin/jobs/[id]` · `/admin/billing` · `/admin/credits` (`?ws={id}`) · `/admin/settings` · `/admin/audit` · `/admin/costs` · `/admin/abuse` · `/admin/design` (P1 component gallery). All require `platform_admin_status() = 'ok'` except `/admin/mfa` (`needs_mfa` allowed).
- **Edits:** P3 §22.0 route list; AppF errata item 18.

### D-283 — Dev-only routes (owner P6)
`/dev/mock-gateway/[sessionId]` and `/dev/mock-invoice/[n].pdf` — exist only when `APP_ENV !== "production"` (404 in production via `proxy.ts` and a build-time guard in the page).
- **Edits:** P6 §8.3 sentence; D-090.

### D-284 — Cookies (owner P6 §11.7; implemented P1/P2/P4)
Strictly necessary (no consent): `sb-*` (Supabase auth), `ws` (current workspace, HttpOnly, Lax, 1 year), `theme` (`dark|light|system`, 1 year, not HttpOnly), `motion` (`system|reduce`, 1 year), `sidebar_state` (shadcn), `consent_v1` (`{v:1, analytics, ts}`, 1 year). After analytics consent only: `ph_*` (PostHog), `exp_hero` (experiment bucket). `content/legal/cookies.mdx` lists exactly these; a Playwright test compares.
- **Edits:** P2 §10.4 cookie table aligned; P6 §11.7 list adds `exp_hero`, `ph_*` (after consent).

### D-285 — Browser storage keys (owner P2/P3)
`localStorage`: `hero_draft_v1` (≤ 24 h), **`hook_personalize_v1`** (renamed from `hooks.personalize.v1`, which collides visually with prompt IDs), `announcement.dismissed.{id}`; nothing else. All wrapped in try/catch.
- **Edits:** P2 §5.3 and §10.4 (storage list), P3 §6.0 ("`hooks.personalize.v1`" → "`hook_personalize_v1`").

### D-286 — Feature flags
- See D-053 (13 keys).

### D-287 — Upstash key prefixes (owner P4 §18.6, documentation)
`rl:{bucket}:{scope}:{id}` · `cron:{name}` (lock; P5 §19.4 `sweep:lock` → `cron:sweep-jobs`) · `cron:last:{name}` (D-082) · `or:halt` (P5 §2.3) · `or:spend:{yyyy-mm-dd}` (budget guard counter, P5 §7.3) · `alert:{kind}:{bucket}` (P6 §16.4) · `trial:ip:{ip}` (P6 §7.1) · `wa:verify:{userId}` (D-089) · `hookevt:{ip}:{hookId}:{kind}` (P4 §20.3 dedupe) · `consent:{userId}` (P6 §14.1 cache, 10 min) · `checkout:fail:{ws}` (P6 §7.2 counter).
- **Edits:** P4 §18.6 add the list as a note; P5 §19.4 `sweep:lock` → `cron:sweep-jobs` (the lock is taken by the shared cron wrapper of P4 §23); the fixer aligns any other differently named key in P5/P6 to these names.

---

# I. P3 — app UX & admin — D-400 … D-432

### D-400 — Error copy
- See D-100/D-102/D-103. **Edits:** P3 §1.4 (rows `UNAUTHENTICATED`, `INTERNAL_ERROR`; "variants by `details`" sub-table), §1.5 (new `byLimit` rows), §23 JSON excerpt (add `byReason`, `byScope`, `UNAUTHENTICATED`, `INTERNAL_ERROR`), §1 acceptance "כל קוד שגיאה מ-§12.10 של המפרט" → "כל 22 הקודים של חלק 04 §18.2".

### D-401 — Plan-limit copy rows
- See D-102 (`max_ai_clips`, `max_ai_clip_sec`, `max_resolution`, `client_workspace_read_only`). **Edits:** P3 §1.5.

### D-402 — `MissingFactsPanel` / `detectFactSlots`
- **Resolution:** (1) questions for all 22 placeholders from D-131 (`wizard.facts.q.{name}`); (2) rule-1 set = `fact` placeholders (D-131); (3) new exemption (AppD note 6) in rule 2: a digit ≤ 10 that directly follows an imperative verb and precedes a plural noun that is not a unit of time, money or percent ("שלחו 3 תמונות") is **not** a `numeric_claim`; (4) `FactSlot.id` format stays `${source}:${beatIndex ?? "hook"}:${token}` and is stored as `fact_answers[].slot_id` (D-037); `action` values `confirmed | replaced | removed` ("זה נכון אצלנו" = `confirmed`); (5) the "rephrase without the number" option uses `scene.rewrite.v1` with `instruction:"custom"` (P5 §10.8 fixed text); (6) unit tests run on all 326 seed hooks **and** the five AppD scripts.
- **Edits:** P3 §6.12.

### D-403 — Hook step storage
- **Resolution:** primary hook in `projects.hook_id` / `workspace_hook_id` + `hook_text_he`; additional variants only in `brief.variant_hooks` (`[{hook_id, workspace_hook_id, text_he}]`, D-037). `hook_selected {source, count}` where `count` = 1 + variants.
- **Edits:** P3 §6.4 "שמירה".

### D-404 — Trial card for `no_identifier`
- **Resolution:** P3 §3.5 table adds row: מקרה "הרשמה בלי כתובת מייל" — title **"החשבון נפתח בלי קרדיטי ניסיון"** — body **"קרדיטי ניסיון ניתנים להרשמה עם כתובת מייל. אפשר לרכוש חבילת קרדיטים או לבחור תוכנית."**
- **Edits:** P3 §3.5.

### D-405 — Testimonial inputs
- **Resolution:** when `video_type = 'testimonial'`, step `goal` shows a card "ההמלצה" with: **"ציטוט ההמלצה, במילים של הלקוח"** (textarea, 5–400 chars) → `brief.testimonial.quote_he`; **"השם שיופיע עם ההמלצה"** (2–60 chars) → `name_he`; checkbox **"יש לנו אישור בכתב מהלקוח להשתמש בהמלצה ובשם"** → `consent_attested`. Without it, `generate` → `422 MISSING_FACTS` (D-097). Disabled for niches where P5 `COMPLIANCE_RULES` disables testimonials (e.g. `therapists`).
- **Edits:** P3 §6.3 (+ acceptance), §6.9 footer hint text stays.

### D-406 — Enum labels location
- **Resolution:** labels move from `lib/marketing/labels.ts` / `marketing.labels` to **`lib/labels.ts` / `common.labels`** (used by marketing, app and admin).
- **Edits:** P2 §1.2 paragraph + references; P3 note 1 resolved.

### D-407 — i18n namespaces
- **Resolution:** `common`, `marketing`, `hooks`, `wizard`, `editor`, `billing`, `errors`, `emails`, `legal`, `auth`, `app`, `admin`, `ops` (`ops.banners`, `ops.whatsapp`).
- **Edits:** P2 §1.3 list, P3 §1 list, P6 §12 mention; AppF errata item 13.

### D-408 — Deep links accepted by the app
- See D-281. **Edits:** P3 §6.0, §14 (`?generate=1&niche=&q=` opens `HookVariationsDialog` in "new hooks" mode without a source hook, `count` 10, `topicHe` prefilled from `q`; nothing is charged until "כתבו 10 הוקים · קרדיט אחד" is clicked), §15 (`?topup=`, `?plan=&cycle=`), login (`?invite=&email=&next=`).

### D-409 — Streaming consumption
- **Resolution:** hooks, script and variations screens use `useNdjsonObject` (D-071); show the last `partial`; replace on `done`; on `error` show `errors.{code}` and "הקרדיטים חזרו" when `details.refunded > 0`; retry with a **new** `Idempotency-Key`.
- **Edits:** P3 §6.4, §6.5, §14.

### D-410 — `POST /api/projects` returns the landing step
- **Resolution:** as P4 §19.3 (`{ projectId, step }`); P3 §6.0 table is the source of the rules (`lib/wizard/progress.ts`).
- **Edits:** none.

### D-411 — `ConfirmGenerateDialog` AI policy line
- **Resolution:** add, above the buttons, the line **"ביצירה אתם מאשרים את {מדיניות השימוש ההוגן ב-AI}."** (link `/legal/ai-policy`, opens in a new tab); no checkbox. The server records the consent on `generate` (D-034).
- **Edits:** P3 §6.10.

### D-412 — Cost lines in `ConfirmGenerateDialog`
- **Resolution:** main cost = `estimate.credits`; secondary line **"כולל התסריט שכבר נוצר: {total} קרדיטים בסך הכול"** where `total = credits + alreadySpent` (D-091); per-variant lines when `variants.count > 1`.
- **Edits:** P3 §6.10 "עלות".

### D-413 — Billing dialogs (from P6 note 9)
- **Resolution:** (a) `TopUpDialog` and `PlanChangeDialog` show the P6 §4.1 disclosure block (`billing.disclosure.*`) and the unchecked mandatory checkbox (D-209 text) before redirect; (b) in `CancelSubscriptionFlow` the refund checkbox is disabled while a generation of the workspace is running, with helper **"אפשר לבקש החזר אחרי שהיצירה הפעילה תסתיים."**; (c) the account-deletion dialog shows the refund line when the first payment is within 14 days: **"שילמתם ב-14 הימים האחרונים. אפשר לבקש החזר לפני המחיקה בעמוד החיוב."** + link `/app/billing/cancel`.
- **Edits:** P3 §15.2, §15.3, §15.5, §16.4.

### D-414 — `PlanChangeDialog` timing toggle
- **Resolution:** monthly → annual shows RadioGroup **"מתי לעבור?"**: **"מסוף החודש"** (`when:"period_end"`, default) · **"מעכשיו"** (`when:"now"`, with the P6 §5.5 copy); other changes follow P6 §5.1 (no toggle). Uses `dryRun:true` for the quote.
- **Edits:** P3 §15.3.

### D-415 — Cancel flow content
- **Resolution:** (1) delete the sentence "בתוכנית החינמית סרטונים מוכנים נשמרים 90 יום, אז כדאי להוריד את מה שחשוב לכם." (paying workspaces are exempt, D-057); (2) add an **annual pro-rata block** when the subscription is annual and past 14 days: **"המנוי השנתי יסתיים בסוף החודש הנוכחי, ותקבלו החזר יחסי על {months} החודשים שלא התחילו: ₪{refund}."** (`refundQuote.reasonCode = "annual_prorata"`); (3) the extended-eligibility checkbox text **"יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)"** (already).
- **Edits:** P3 §15.5.

### D-416 — Admin additions
- **Resolution:** `/admin/billing`: buttons **"התאמת תשלומים עכשיו"** (`POST /api/admin/ops/cron {name:"billing-renewals"}`), **"צירוף חשבונית שהופקה ידנית"** (upload dialog → D-085c), **"סימון כהחזר חיוב (chargeback)"** (D-085b, confirm dialog with reason). `/admin/credits`: per-grant action **"הסרת היתרה מהדלי"** (D-085a). `/admin/abuse`: list from `GET /api/admin/abuse` with `source` filter. `/admin/models`: "בדיקה" → `POST /api/admin/models/test`. `/admin/settings`: editor for every key of D-052 + all flags of D-053. `/admin` dashboard: cron tile from `GET /api/admin/ops/cron`. Admin shell: banner when MFA is missing is impossible (redirect, D-090).
- **Edits:** P3 §22.1, §22.6, §22.15, §22.16, §22.17, §22.19.

### D-417 — Per-project render settings in the preview step
- **Resolution:** the "מותג", "כתוביות" (position/highlight) and "כרטיס סיום" controls of §6.9 save to `projects.render_options` via `PATCH /api/projects/[id] {renderOptions}` (D-036); "איפוס לערכת המותג" link clears the key. Instagram toggle shown only when `business_profiles.instagram_url` exists.
- **Edits:** P3 §6.9 items 2–4; editor §9.3 if it duplicates these controls.

### D-418 — `/app/hooks?generate=1`
- See D-408/D-088. **Edits:** P3 §14 + acceptance "`/app/hooks?generate=1&niche=dentists` פותח את הדיאלוג במצב 'הוקים חדשים' בלי לחייב; לחיצה מחייבת קרדיט אחד ושומרת עד 10 שורות ב-`workspace_hooks`".

### D-419 — Team page seats
- See D-042. **Edits:** P3 §17 seats counter "{used} מתוך {max} משתמשים" + helper "צופים לא נספרים במכסת המשתמשים."

### D-420 — Notification settings
- See D-022, D-089. **Edits:** P3 §16.2 storage sentence; WhatsApp column + verification block when `whatsapp_notify` is on (copy from P6 §13.2).

### D-421 — Editor line-length warning
- See D-139. **Edits:** P3 §9.3 (onscreen text field) and §6.9 scene list.

### D-422 — Onboarding sample strings
- **Resolution:** `app.onboarding.samples.{audience}.{register}` (3 × 4 = 12 strings) are taken from AppE §3.2 (registers) inflected per AppE §4.4.
- **Edits:** P3 §4.3/§4.4 reference AppE.

### D-423 — Post text regeneration
- See D-086. **Edits:** P3 §8.1.

### D-424 — Analytics alignment
- See D-200/D-201/D-202. **Edits:** P3 §1.9, §3.5, §5.8, §6.*, §14, §15.5 per D-200.

### D-425 — Realtime client
- See D-061. **Edits:** P3 §1.8.

### D-426 — Ledger UI (no change)
- `capture` rows hidden by default (already).

### D-427 — Audit action names
- See D-208. **Edits:** P3 note 7 removed; P3 §22.18 filter list uses D-208.

### D-428 — Deleted author label
- **Resolution:** where a creator/author is shown and the FK is NULL (D-041): **"משתמש שנמחק"** (`common.deletedUser`).
- **Edits:** P3 §8.1 (versions/approvals), §9.2 (`VersionList`), §10 (project card "נוצר על ידי"), admin tables.

### D-429 — Hook-number compliance notes (P3 note 11)
- **Resolution:** no seed change in MVP. `/admin/hooks` "בדיקות" board flags published hooks whose `detectFactSlots` finds a `numeric_claim` and whose `compliance_note_he` is NULL; the public `HookCard` already shows "המספרים לדוגמה" via the facts gate in the app.
- **Edits:** P3 §22.10 one bullet.

### D-430 — Indexing gate for `/hooks/[niche]`
- **Resolution:** indexable only when **all** hold: `niches.is_active`, `seo_reviewed_at IS NOT NULL`, `seo_intro_he` present (≥ 150 words), ≥ 8 published hooks. Otherwise `noindex,follow` + canonical to `/hooks`. Same thick-content minimums as P2 §12.2 for season (8) and platform (12) pages.
- **Edits:** P2 §12.2 table; P3 §22.8 "נבדק" toggle sets `seo_reviewed_at = now()` and calls `revalidateTag('niche:{slug}')`.

### D-431 — Admin UI language for money
- **Resolution:** ₪ amounts in admin follow D-260 (prefix); USD costs `$0.084` LTR mono (P3 §22.0, already).
- **Edits:** none.

### D-432 — Custom brand fonts (v2)
- **Resolution:** out of MVP (P3 note 12 accepted); `brand-assets` stays image-only.
- **Edits:** none.

---

# J. P2 — marketing site — D-500 … D-517

### D-500 — FAQ data shape
- See D-264. **Edits:** P2 §4.3, §4.4, §4.5, `lib/seo/jsonld.ts`.

### D-501 — Storage key rename
- See D-285 (`hook_personalize_v1`). **Edits:** P2 §5.3, §10.4.

### D-502 — Gender-neutral strings
- See D-262 ("יצירת קשר", "דילוג לתוכן הראשי", "דברו איתנו"). **Edits:** P2 §2.3, §9.1–§9.2, §10.6, §1.3 namespace key names if they embed "contact".

### D-503 — Labels module
- See D-406. **Edits:** P2 §1.2.

### D-504 — Savings calculator presets
- See D-141. **Edits:** P2 §3.7.2 and every consumer ("כמה עולה סרטון", template cards, blog `SampleCost`, FAQ answers) import `SAMPLE_PRESETS` from `lib/pipeline/estimate.ts`; unit test still expects 23/50/107/478.

### D-505 — Privacy & cookies page facts
- **Resolution:** retention table per P6 §11.5 after D-057/D-211 (renders of never-paid free workspaces: 90 days; backups: weekly 30 days + monthly 12 months; invoices storage 7 years); sub-processors per D-222; cookie table per D-284; `data_collection: "deny"` sentence with `[M0-verify]` (D-145).
- **Edits:** P2 §10.3, §10.4.

### D-506 — Video wall media
- See D-708. **Edits:** P2 §3.3.5 "מפרט מדיה" → "אנימטיקים תחת `public-media/demo/wall/`, תוצרים אמיתיים תחת `public-media/examples/`"; tile badge **"הדגמה"** (P1 wording) and on `/examples` **"הדגמה (אנימטיק)"**.

### D-507 — Bit
- See D-215. **Edits:** P2 §7.3, §7.6, FAQ `pricing-payment-methods`, terms §6.2.

### D-508 — Analytics
- See D-200/D-202. **Edits:** P2 §14 (`pricing_pack_*` values, `signup_started.source`, `results?`, `faq_expanded`/`example_played` location lists).

### D-509 — App deep links from marketing
- See D-094/D-281. **Edits:** P2 links use `src ∈ {hero, final_cta, hooks, template, niche_page}`; hooks "AI hooks" CTA → `/app/hooks?generate=1&niche={slug}&q={q}` (through `SignupGateDialog` when anonymous); variations → `/app/hooks?source={hookId}&variations=1`; pricing → `/app/billing/plans?plan={planId}&cycle={cycle}` and `/app/billing?topup={packId}`.

### D-510 — Hero draft handoff (no change)
- `localStorage['hero_draft_v1']` (≤ 24 h) read by `/app/create?src=hero` (P3 §6.0).

### D-511 — Hooks search path
- See D-076.

### D-512 — Indexing gates
- See D-430. **Edits:** P2 §12.2.

### D-513 — Pricing copy equals seed
- See D-063.

### D-514 — OG routes (owner P2)
- See D-280. **Edits:** P2 §12.5 list adds `/hooks/h/[id]/opengraph-image` and `/hooks/[niche]/opengraph-image` (already in P2 note 20 → move into §12.5).

### D-515 — Annual pro-rata in cancellation policy
- **Resolution:** stays in `/legal/cancellation` §2 as written, marked ⚖️ (D-243).
- **Edits:** none.

### D-516 — `HookPersonalizer` placeholders
- See D-131 (names 1–17, labels from `wizard.facts.q.*` reused as `hooks.personalize.fields.*` or imported directly).
- **Edits:** P2 §5.3.

### D-517 — Niche content generation script
- See D-153. `scripts/generate-niche-seo.ts --niche={slug}|--all [--dry-run]` writes drafts through the admin API helpers (never sets `seo_reviewed_at`).
- **Edits:** P2 §4.3.

---

# K. P1 — brand & design system — D-600 … D-611

### D-600 — `formatIls` is the only ILS formatter
- See D-204/D-260. **Edits:** P1 §2.5 note "(חלק 06 משתמש ב-`formatAgorot` שעוטפת את הפונקציה הזו)".

### D-601 — `CancelSubscriptionFlow` row
- See D-262. **Edits:** P1 component table row text.

### D-602 — Extra tokens (accepted)
- `--color-on-danger`, `--color-link`, `--color-glass`, `--color-overlay`, `--color-frame` are canonical additions to AppF §11.2 (errata item 16). `bg-muted` blocked in `lint:rtl` → `bg-surface-2`.
- **Edits:** none.

### D-603 — `/admin/design` (accepted)
- Listed in D-282. **Edits:** none in P1.

### D-604 — Theme without server cookie reads (accepted)
- Server renders `data-theme="dark"`, `ThemeScript` fixes before paint; CSP hash of `THEME_SCRIPT_SOURCE` (P6 §15.3). Supersedes AppF "theme attribute set server-side" (errata item 16).
- **Edits:** none.

### D-605 — Duplicate `BrandCard` names (accepted)
- `components/brand/brand-card.tsx` (app) and `remotion/layers/BrandCard.tsx` (render) keep their names; import with alias when both are used.
- **Edits:** none.

### D-606 — shadcn hooks alias
- `"hooks": "@/lib/react-hooks"`; no code may import from `@/hooks`. P3/P5 module names (`lib/realtime/use-job-channel.ts`, `lib/ai/client/use-ndjson-object.ts`) are unaffected.
- **Edits:** none.

### D-607 — Breakpoints (accepted)
- `xs: 390px` added; `sm: 640px` kept for shadcn primitives only.
- **Edits:** none.

### D-608 — Number animation
- `Num animate` replaces Magic UI `NumberTicker` everywhere (P2 calculator, counters).
- **Edits:** none.

### D-609 — Banned phrases reference
- See D-134. **Edits:** P1 §2.1 item 11 + acceptance (`lint:copy` imports `BANNED_PHRASES`).

### D-610 — Caption safe zones & presets (accepted)
- P1 §16 safe zones (captions 6% left to 16% right in 9:16, `AiLabel` top-right, free `Watermark` top-left) and `CAPTION_PRESETS` (incl. `poster` 132/112/88 px) are canonical; P5 reads them (already). AppF §8.4 size range superseded for `poster` (errata item 8).
- **Edits:** none.

### D-611 — Platform chips (accepted)
- `HookCard` shows platform text chips, never social logos.
- **Edits:** none.

---

# L. Appendices D & E — D-700 … D-713

### D-700 — Five examples
- See D-005/D-009. **Edits:** none in AppD.

### D-701 — `BANNED_PHRASES` count
- See D-134. **Edits:** AppE §5.2 (+ acceptance count), AppE notes.

### D-702 — Niche defaults table → seed
- See D-030. **Edits:** AppE §3.3 intro sentence: "…נטענים ל-DB מהקובץ `supabase/seed/data/niche_extras.json` (חלק 04 §16.1, מצב `fill_if_null`)".

### D-703 — ₪ table
- AppE §6.1 matches D-260 (no edit). AppD examples 1 (`suffix`) and 5 (`prefix`) stay.

### D-704 — Quotes
- AppE §9 matches D-261 (no edit).

### D-705 — `detectFactSlots` exemption
- Accepted into P3 (D-402). **Edits:** AppD: the examples may keep numbers in words; no change.

### D-706 — End card and word budget
- See D-135. **Edits:** none in AppD.

### D-707 — Line lengths
- See D-139. **Edits:** none in AppE.

### D-708 — Demo media location and the video wall
- **Issue:** AppD §9.1 writes demo renders to `public/media/demo/` and places them in `VideoWall` columns; P2 §3.3.6 defines an 18-tile wall plan (`content/demo-wall.json`) with media in `public-media`.
- **Resolution:** (1) The **wall** is P2's `content/demo-wall.json` (18 tiles). `scripts/render-demo-videos.ts` renders each tile as a 4–6 s hook-only `Animatic` loop (540×960, no sound) + AVIF poster + VTT and uploads to `public-media/demo/wall/{n}-{hook_id}.{mp4|avif|vtt}`. (2) The **five AppD examples** render full length in the formats of the AppD §9.1 table to `public-media/demo/examples/{id}-{9x16|1x1|16x9}.mp4`, `{id}-poster.jpg`, `{id}.vtt`, `{id}-loop.mp4`, and are used by `ShowcaseGallery`, `NicheShowcase` (restaurants, renovation, mortgage, dentists, nails) and the Hanukkah seasonal banner — **not** by `VideoWall`. (3) The neutral demo logo stays in the repo: `public/media/demo/logo-demo.svg`. (4) `pnpm demo:render --upload` uploads (secret key, `upsert`); without `--upload` files go to `.demo-out/` for review. (5) Real `examples` rows replace a demo item at the same place when published.
- **Edits:** AppD §9.1 steps 3 and table ("איפה מופיעה": remove `VideoWall` columns; keep the other placements); AppD §1.2 file list (paths); P2 §3.3.5–§3.3.6 media paths; P4 §13.1 `public-media` paths add `demo/wall/*`, `demo/examples/*`.

### D-709 — Listening test
- See D-213.

### D-710 — Niche sample scripts from AppD
- `toNicheSampleScript` (`lib/marketing/`) may derive one of the three `niches.sample_scripts` for `restaurants`, `renovation-contractors`, `mortgage-advisors`, `beauty-nails` (and `dentists`); content already written in P2 wins.
- **Edits:** none.

### D-711 — Onboarding samples
- See D-422.

### D-712 — Hashtags rule
- See D-142(e).

### D-713 — AppD fixture keys
- Fixture-only keys (`demo_placeholder_values`, `demo_placeholder_values_spoken`, `words_per_second`, fact keys like `google_rating`, `featured_project`, `bathroom_duration`, `quote_turnaround`, `hanukkah_hours`, `gel_price`, `license_number`, `years_experience`) are test data, not DB columns. `words_per_second` = `hebrew_wps.default` at fixture time (2.4). Fact keys used by placeholders auto-fill (`google_rating`, `license_number`) are the canonical `business_profiles.facts[].key` values (D-131).
- **Edits:** none.

---

# M. Appendix F (spec) — errata box — D-300

### D-300 — Errata box inserted at the top of Appendix F
- **Resolution:** right after `# נספח F — המפרט הטכני (באנגלית)` insert a Hebrew box titled **"תיקונים ועדכונים לנספח F — גוברים על הטקסט שלהלן"** with a short intro ("הנספח הוא המפרט המקורי. החלקים 01–06 והנספחים A–E מפורטים יותר וגוברים עליו; הרשימה הזו מסכמת את ההבדלים הידועים") and these numbered items (each one line, with the part § that wins). The spec body itself is **not** edited.
  1. `[R:0X §Y]` → `docs/research/0X-*.md` (mapping D-003); "Verification addendum" wins inside each file.
  2. §4.5/§6.12 streaming: NDJSON (`partial`/`done`/`error`), no `X-Version-Id` — חלק 04 §18.5, חלק 05 §3.5.
  3. §4.3/§4.5 `/app/create` lands on a computed step; `POST /api/projects` returns `{ projectId, step }`; `src` values — חלק 03 §6.0, חלק 04 §19.3.
  4. §4.5 estimate request/response extended (`kind`, `alternatives`, `variants`, `etaRange`, `approximate`, `alreadySpent`) — חלק 04 §19.7.
  5. §4.5/§6.11 generate returns `{ jobId, variantProjectIds }`; sibling jobs carry `options.afterJobId` and do not count toward concurrency — חלק 04 §10.4, §19.8.
  6. §5.4/§6.9 Realtime trigger uses `realtime.send` (minimal payload) — חלק 04 §14.
  7. §5.3 schema additions and NOT NULL relaxations (e.g. `profiles.trial_status`, `notification_prefs`, `workspaces.plan_override`, `niches.short_name_he/sample_scripts/seo_reviewed_at`, `projects.render_options`, `project_versions.moderation`, `credit_costs.credits_long`, `subscriptions.anchor_at/next_grant_at/scheduled_change/past_due_since`, `payments.idempotency_key/confirmation_sent_at`, tables `abuse_reports`, `api_idempotency_keys`, `email_messages`, bucket `invoices`; nullable `trial_claims.user_id`, `workspaces.owner_id`, author columns) — חלק 04 §4–§8.
  8. §8.2/§8.4 `PromoProps` extensions (`endCard.disclaimersHe`, `licenseTextHe`, `disclaimer`) and caption preset sizes (`poster` 132/112/88) — חלק 05 §20, חלק 01 §16.
  9. §7.2 new template `moderation.upload.v1`; `seo.niche_intro.v1` also returns `short_name_he`, `landing_intro_he` — חלק 05 §10.
  10. §10.5/§10.6/§12.1 UI strings are gender-neutral: "צרו את הסרטון · 107 קרדיטים", "יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)", "דילוג לתוכן הראשי", "עצירת אנימציות" — חלק 01 §2.1.
  11. §12.6 CSP: nonce for dynamic routes, hash for static marketing pages — חלק 06 §15.3.
  12. §9 environment variables extended — חלק 06 §20.
  13. §12.10 error codes: 22 (+ `UNAUTHENTICATED`, `EDIT_CONFLICT`, `INTERNAL_ERROR`); i18n namespaces + `auth`, `app`, `admin`, `ops` — חלק 04 §18.2.
  14. §12.10 email templates: 26 — חלק 06 §12.4.
  15. §6.1/§10.7 interfaces extended (`JobOrchestrator.status?`, `RenderProvider.startAsync?/poll?`, `PaymentProvider.parseWebhook(raw, headers, url?)`, `getTransactionStatus`, `InvoiceProvider` additions) — חלק 05 §19, חלק 06 §8–§9.
  16. §11 extra tokens (`--color-on-danger` …); theme set by a blocking script, not by a server cookie read — חלק 01.
  17. §6.10 `regenerate_scene` re-renders all formats of the last assembly — חלק 05 §18.8.
  18. §4.4 admin routes + `/admin/seasons`, `/admin/abuse`, `/admin/design`, `/admin/mfa`; admins need MFA (`aal2`) — חלק 03 §22, חלק 06 §15.4.
  19. §10.6 dunning ends in `expired`; card update in `past_due` retries immediately; 14-day refund closes the subscription — חלק 06 §4–§6, §10.
  20. §12.9 analytics: 63 events — חלק 06 §14.2.
  21. §7.3 pagination rule "`poster-condensed`" means preset `poster`.
  22. §5.7/§12.2 extra pg_cron jobs and retention; free-plan render deletion only for workspaces that never paid — חלק 04 §15, חלק 06 §11.5.
  23. §8.1 scenes cover the full target duration; the end card (2.5 s + 0.3 s) is appended; VO budget `0.9 × wps × target` — חלק 05 §12.1.
  24. §10.3 `seats` counts owner/admin/editor only; viewers are free — חלק 04 §9.2.
  25. §12.6 rate limits extended — חלק 04 §18.6.
  26. §9 flags: + `billing_checkout`; `music_generate`/`premium_video` are kill switches (entitlements in `plans.limits`) — חלק 06 §21.
  27. §5.3 `app_settings` keys extended (`hebrew_wps` object, `tts_fallback_voices`, VAT/dunning keys) — חלק 04 §16.4.
  28. §5.2 `webhook_provider` + `whatsapp` (v2) — חלק 04 §3.
  29. §7.4 placeholder dictionary: 22 names (15 + `הנחה`, `בעיה` + 5 script-only) — חלק 05 §8.2.
  30. §8.6 the browser Player loads caption fonts from the same origin — חלק 05 §20.9.
- **Edits:** AppF top (only this box).

---

# N. Per-file index (which decisions each fixer must apply)

| File | Decisions |
|---|---|
| P0 `00-header.md` | D-001, D-002, D-003, D-004, D-005, D-010 |
| P1 `01-brand-design.md` | D-002, D-134, D-204, D-260, D-262, D-600–D-611 (edits only in D-600, D-601, D-609) |
| P2 `02-marketing-site.md` | D-002, D-042, D-063, D-076, D-094, D-131, D-141, D-145, D-153, D-200, D-202, D-215, D-222, D-260–D-264, D-280, D-284, D-285, D-406, D-407, D-430, D-500–D-517, D-708 |
| P3 `03-app-ux.md` | D-002, D-022, D-035, D-036, D-037, D-042, D-059, D-061, D-071, D-082–D-088, D-091, D-092, D-094, D-098, D-100–D-103, D-131, D-139, D-146, D-200–D-202, D-208, D-209, D-215, D-216, D-220, D-260–D-262, D-281, D-282, D-285, D-400–D-432 |
| P4 `04-data-api.md` | D-002, D-020–D-065, D-070–D-104, D-130, D-143, D-154, D-208, D-280–D-287, D-708 |
| P5 `05-ai-pipeline.md` | D-002, D-006, D-009, D-038, D-040, D-071, D-086, D-087, D-097, D-130–D-156, D-260, D-261, D-287 |
| P6 `06-billing-legal-ops.md` | D-002, D-004, D-006, D-010–D-012, D-020, D-022, D-027–D-031, D-043–D-049, D-052, D-053, D-057, D-072, D-082, D-085, D-089, D-090, D-093, D-096, D-200–D-243, D-283, D-284 |
| AppD/E `90-appendices-d-e.md` | D-002, D-134, D-700–D-713 |
| AppF `spec.md` | D-001, D-300 (box only; body unchanged) |

Final step for every fixer: delete the part's "## הערות לאינטגרציה" section (D-243 items move to P6 §25), then grep the part for every old name listed in this log (`after_job_id`, `waitForJobId`, `X-Version-Id`, `toTextStreamResponse`, `experimental_useObject`, `hooks.personalize.v1`, `pricing_pack_pack-`, `"q": `, `max_ai_clip_seconds` as a limit key, `formatIls(` on agorot, `צור קשר`, `דלג לתוכן`, `עצור אנימציות`, `זכאי/ת`, `מאשר או מאשרת`, `/api/v1/` without host, `sweep:lock`, "שלושת התסריטים") and confirm zero stale hits.
