# נספח F — המפרט הטכני (באנגלית)

> **Appendix F — architecture spec.** Parts 01–06 and appendices A–E are more detailed and supersede this spec on any conflict; the integration decision log was applied to the parts. Research citations `[R:0X §N]` refer to `docs/research/0X-*.md` in the repository (inside each research file, the "Verification addendum" overrides earlier text). The box below summarizes the known overrides; **§15 Errata (post-integration)** at the end of this appendix lists every superseded item with its replacement and the owning part. Where this spec says "P1–P6", read "Parts 01–06".

> **תיקונים ועדכונים לנספח F — גוברים על הטקסט שלהלן**
>
> הנספח הוא המפרט המקורי. החלקים 01–06 והנספחים A–E מפורטים יותר וגוברים עליו; הרשימה הזו מסכמת את ההבדלים הידועים (הפירוט המלא בסעיף 15).
>
> 1. `[R:0X §Y]` → `docs/research/0X-*.md` (`01-cadabra`, `02-ph-ads`, `03-ph-brand`, `04-openrouter`, `05-stack`, `06-israel`, `07-hooks`, `08-design`, `09-producthunt`); "Verification addendum" wins inside each file.
> 2. §4.5/§6.12 streaming: NDJSON (`partial`/`done`/`error`), no `X-Version-Id` — חלק 04 §18.5, חלק 05 §3.5.
> 3. §4.3/§4.5 `/app/create` lands on a computed step; `POST /api/projects` returns `{ projectId, step }`; `src` values — חלק 03 §6.0, חלק 04 §19.3.
> 4. §4.5 estimate request/response extended (`kind`, `alternatives`, `variants`, `etaRange`, `approximate`, `alreadySpent`) — חלק 04 §19.7.
> 5. §4.5/§6.11 generate returns `{ jobId, variantProjectIds }`; sibling jobs carry `options.afterJobId` and do not count toward concurrency — חלק 04 §10.4, §19.8.
> 6. §5.4/§6.9 Realtime trigger uses `realtime.send` (minimal payload) — חלק 04 §14.
> 7. §5.3 schema additions and NOT NULL relaxations (e.g. `profiles.trial_status`, `notification_prefs`, `workspaces.plan_override`, `niches.short_name_he/sample_scripts/seo_reviewed_at`, `projects.render_options`, `project_versions.moderation`, `credit_costs.credits_long`, `subscriptions.anchor_at/next_grant_at/scheduled_change/past_due_since`, `payments.idempotency_key/confirmation_sent_at`, tables `abuse_reports`, `api_idempotency_keys`, `email_messages`, bucket `invoices`; nullable `trial_claims.user_id`, `workspaces.owner_id`, author columns) — חלק 04 §4–§8.
> 8. §8.2/§8.4 `PromoProps` extensions (`endCard.disclaimersHe`, `licenseTextHe`, `disclaimer`) and caption preset sizes (`poster` 132/112/88) — חלק 05 §20, חלק 01 §16.
> 9. §7.2 new template `moderation.upload.v1`; `seo.niche_intro.v1` also returns `short_name_he`, `landing_intro_he` — חלק 05 §10.
> 10. §10.5/§10.6/§12.1 UI strings are gender-neutral: "צרו את הסרטון · 107 קרדיטים", "יש לי זכאות לתקופת ביטול מורחבת (עד 4 חודשים)", "דילוג לתוכן הראשי", "עצירת אנימציות" — חלק 01 §2.1.
> 11. §12.6 CSP: nonce for dynamic routes, hash for static marketing pages — חלק 06 §15.3.
> 12. §9 environment variables extended — חלק 06 §20.
> 13. §12.10 error codes: 22 (+ `UNAUTHENTICATED`, `EDIT_CONFLICT`, `INTERNAL_ERROR`); i18n namespaces + `auth`, `app`, `admin`, `ops` — חלק 04 §18.2.
> 14. §12.10 email templates: 26 — חלק 06 §12.4.
> 15. §6.1/§10.7 interfaces extended (`JobOrchestrator.status?`, `RenderProvider.startAsync?/poll?`, `PaymentProvider.parseWebhook(raw, headers, url?)`, `getTransactionStatus`, `InvoiceProvider` additions) — חלק 05 §19, חלק 06 §8–§9.
> 16. §11 extra tokens (`--color-on-danger` …); theme set by a blocking script, not by a server cookie read — חלק 01.
> 17. §6.10 `regenerate_scene` re-renders all formats of the last assembly — חלק 05 §18.8.
> 18. §4.4 admin routes + `/admin/seasons`, `/admin/abuse`, `/admin/design`, `/admin/mfa`; admins need MFA (`aal2`) — חלק 03 §22, חלק 06 §15.4.
> 19. §10.6 dunning ends in `expired`; card update in `past_due` retries immediately; 14-day refund closes the subscription — חלק 06 §4–§6, §10.
> 20. §12.9 analytics: 63 events — חלק 06 §14.2.
> 21. §7.3 pagination rule "`poster-condensed`" means preset `poster`.
> 22. §5.7/§12.2 extra pg_cron jobs and retention; free-plan render deletion only for workspaces that never paid — חלק 04 §15, חלק 06 §11.5.
> 23. §8.1 scenes cover the full target duration; the end card (2.5 s + 0.3 s) is appended; VO budget `0.9 × wps × target` — חלק 05 §12.1.
> 24. §10.3 `seats` counts owner/admin/editor only; viewers are free — חלק 04 §9.2.
> 25. §12.6 rate limits extended — חלק 04 §18.6.
> 26. §9 flags: + `billing_checkout`; `music_generate`/`premium_video` are kill switches (entitlements in `plans.limits`) — חלק 06 §21.
> 27. §5.3 `app_settings` keys extended (`hebrew_wps` object, `tts_fallback_voices`, VAT/dunning keys) — חלק 04 §16.4.
> 28. §5.2 `webhook_provider` + `whatsapp` (v2) — חלק 04 §3.
> 29. §7.4 placeholder dictionary: 22 names (15 + `הנחה`, `בעיה` + 5 script-only) — חלק 05 §8.2.
> 30. §8.6 the browser Player loads caption fonts from the same origin — חלק 05 §20.9.
> 31. §5.5 `scenes` are written only on the server (secret client, after the role check, `is_version_locked` and edit moderation); `authenticated` has SELECT only. `startJob` stores `jobs.options.scenes_digest`, and the `keyframe:*`/`clip:*`/`voice`/`render:*` steps recheck it (`assertScenesDigest`; mismatch → `INTERNAL_ERROR`, full refund) — חלק 04 §12.2–§12.4, §19.6, חלק 05 §18.3.
> 32. §4.5/§5.3/§5.5 `consents` are written only on the server through `recordConsent()`; `POST /api/consents` takes a narrowed `ConsentBody` and a `(kind, source)` allow-list; `consents.source` adds the server-only values `generate` and `unsubscribe` (`POST /api/unsubscribe`: suppression row first and independently, then 3 `granted: false` rows for `marketing_*`, always 200) — חלק 04 §8, §12.2–§12.4, §21.4, חלק 06 §11.4, §11.8.
> 33. §5.4/§5.5 member role changes only through the RPC `change_member_role` under the billing-workspace row lock (seat re-check → `PLAN_LIMIT`); invite creation and `accept_invite` take the same lock; no direct `update` on `workspace_members` — חלק 04 §9.5, §12.2–§12.4, §24.2.
> 34. §5.2/§10.7/§12.4 עוסק פטור (exempt mode) is not supported: every charge gets `tax_invoice_receipt`, a refund gets `credit_invoice`; the enum value `receipt` is reserved and never issued (`InvoiceProvider.issue` does not accept it); there is no `business_tax_status` setting or toggle; `{{COMPANY_ID}}` is a ח״פ or an עוסק מורשה number — חלק 06 §9.1–§9.2, חלק 04 §3, §24.1, חלק 03 §22.17, חלק 00 (variables box).

---

**SPEC — {{BRAND_NAME_EN}} ({{BRAND_NAME}}): Hebrew-first AI promo & reels studio**

Version 1.0 · 2026-10-13 · Owner: lead solution architect · Status: **background architecture spec** (it was the source for Parts 01–06 and Appendices A–E, which now supersede it — see the note above and §15).

---

## 0. How to use this spec

- Every writer (P1–P6) reuses the names in this file **verbatim**: table names, enum values, route paths, component names, event names, env vars, prompt IDs, composition IDs, error codes. If a writer needs a new name, it must follow the conventions in §14.3 and must not rename anything defined here.
- Tags: **[R:04 §3.1]** = research file + section that justifies a decision; **[design]** = architect decision; **[M0-verify]** = must be confirmed in the M0 spike before code depends on it (the agent records the result in `DECISIONS.md`).
- Research verification addenda override earlier text in each research file; this spec already applies them (e.g. `alibaba/wan-3.0` not `wan-3`, `openai/gpt-6.1-sol` as OpenAI fallback, Sora removed, AI SDK v7 exists but pin v6, Supabase new keys, Tailwind `inset-s/e`, ₪5,000 allocation-number threshold, election 2026-10-27).
- Brand placeholders, used everywhere and replaced once names are chosen: `{{BRAND_NAME}}` (Hebrew name), `{{BRAND_NAME_EN}}` (Latin name), `{{DOMAIN}}` (e.g. `example.co.il`). Code reads them from `lib/constants.ts` (`BRAND.nameHe`, `BRAND.nameEn`, `BRAND.domain`) — never hard-code.
- Language rule: all user-facing copy is native Hebrew (plural/neutral address by default); code identifiers, DB names, slugs, logs and comments are English.

---

## 1. Product

### 1.1 One-liner and positioning
**{{BRAND_NAME}}** turns "what's your business?" into a finished, on-brand Hebrew promo video ("סרטון תדמית") or short-form reel in minutes: niche-aware script with a proven Hebrew hook, AI visuals, Hebrew voice-over, correct RTL captions, music and logo, exported to 9:16 / 1:1 / 16:9. It replaces the freelance video editor (₪550 per pro-edited reel; ₪15,000–35,000 per SMB promo video [R:06 §2.1]) at a self-serve ₪ price with a Hebrew tax invoice.

Positioning (do not dilute): **niche × Hebrew × finished outcome**, not "an engine picker" (Cadabra's model [R:01 §0, §10.1]) and not generic "URL → video" (commoditized on Product Hunt, incl. free Google Pomelli [R:09 §5.1, R:03 §1.1]). Moats: (1) Hebrew-perfect text/voice layer rendered deterministically [R:04 §2, R:06 §6]; (2) the public SEO Hebrew hooks library per niche [R:07 §A10, R:02 §5.3]; (3) Israeli niches, seasons, compliance flags [R:06 §5, §7.9]; (4) ₪ pricing incl. VAT + חשבונית מס + Bit [R:06 §1.14].

### 1.2 Personas
| ID | Persona | Context | Primary jobs |
|---|---|---|---|
| `persona_owner` | **בעל/ת עסק קטן** (e.g. cosmetician in Ra'anana, renovation contractor in Haifa, neighborhood grill-bar) | No editor, posts 1–4×/week, WhatsApp-first, spends ₪300–₪3,000/mo on content [R:06 §5.1]; often no website | "Give me a ready Reel for this week's offer", "a סרטון תדמית for my site", "say it in Hebrew that sounds like me" |
| `persona_agency` | **מנהל/ת סושיאל / סוכנות בוטיק** | Serves 10–40 SMBs, ₪1,500–₪8,000/mo per client retainer [R:06 §2.3] | Volume, per-client brand kits, client approval links, hook A/B variants, white-label share pages |
| `persona_marketer` | **משווק/ת in-house** (mid-size SMB, clinic chain, B2B startup) | Has brand guidelines, needs 16:9 for site/YouTube + vertical for paid social | Brand consistency, premium quality, multi-format export, SRT for accessibility (IS 5568) |

### 1.3 Jobs-to-be-done (ranked)
1. Create a publish-ready Hebrew reel from a niche + a hook in < 10 minutes, without editing skills.
2. Create a 45–60 s "סרטון תדמית" for website/YouTube/Facebook with brand identity.
3. Find a proven Hebrew opening line ("הוק") for my niche, copy it, or turn it into a video in one click.
4. Produce 3 formats + captions file in one go; download or share to WhatsApp.
5. Fix one scene/line without redoing everything; pay only for what changes.
6. (Agency) Run many clients, get client approval, keep each brand consistent.
7. Pay in ₪ with an invoice, see costs before generating, cancel in one click.

### 1.4 Scope: MVP vs v2
| Area | MVP (launch) | v2 (behind flags or later) |
|---|---|---|
| Marketing | Landing, niches hub + niche pages, public hooks library (all SEO page types §4.2), examples, templates, pricing, blog (MDX), about, contact, FAQ, 7 legal pages | `/compare/[competitor]`, hook submissions, embeddable hooks widget |
| Auth | Email magic link, Google OAuth | Phone OTP via Send SMS Hook (`FEATURE_PHONE_OTP`) |
| Creation | URL → brand profile, 9-step wizard, fast path, streaming script, storyboard, animatic preview, hook variants (≤5) | Chat-edit agent (`FEATURE_CHAT_EDIT`), batch variant matrix > 5, AdClone |
| Media | AI keyframes, AI clips (draft/standard/premium), user photo/video upload + photo animation, Hebrew TTS, word-timed captions, music library + Lyria generation, Remotion render 9:16/1:1/16:9, SRT/VTT, poster | Talking-head avatar (`FEATURE_AVATAR`, HeyGen Avatar IV), voice clone (`FEATURE_VOICE_CLONE`), stock b-roll (`FEATURE_STOCK_BROLL`), 4:5 format, Arabic/Russian VO |
| Editing | Storyboard editor: text edit, reorder, per-scene regenerate, swap media, caption preset, music swap, re-render | Frame-accurate trimming, keyframe text animation editor |
| Collaboration | Team seats & roles, agency client workspaces, client approval links, white-label share page | Comments on frames, scheduling/publishing, social account connect + hook-rate analytics |
| Billing | 4 plans, annual toggle, 3 top-up packs, Grow gateway, Morning invoices, self-serve cancel, 14-day refund flow, credit ledger UI | Cardcom / Sumit adapters, installments on annual, done-for-you upsell |
| Notifications | Email (Resend) + in-app | WhatsApp notifications (`FEATURE_WHATSAPP_NOTIFY`) |
| Admin | Models registry, routes, prompts viewer/tester, niches, hooks CRUD + AI batch, templates, examples, voices, music library, users/workspaces, jobs inspector (retry/refund), payments/refunds, credits adjust, settings/flags, audit, cost dashboard | Experiments, cohort analytics |

### 1.5 Success metrics
North star: **videos downloaded or shared per active workspace per week**. Activation: first video downloaded within 24 h of signup (target ≥ 45%). Time-to-first-video (signup → render done) p50 < 10 min. Generation success rate (jobs succeeded / jobs started, excluding user cancels) ≥ 97%. Blended gross margin ≥ 65% (§10). Hooks library → signup conversion ≥ 2.5%.

---

## 2. Tech stack (final)

"React + Node.js" is satisfied by **Next.js** (React 19 UI, Node.js runtime for all server code — Route Handlers, Server Actions, workflows) on Vercel; Next.js is chosen over Vite SPA + Express because the public hooks/niche pages need SSR/ISR for SEO and one deployable covers site, app and API [R:05 §3.1].

| Layer | Decision | Packages (pin majors; exact versions in lockfile) | Why / notes |
|---|---|---|---|
| Runtime | Node.js 22 LTS on **Vercel Pro**, Fluid Compute, region **`fra1`** | `engines.node >=22` | Hobby is non-commercial [R:05 §3.2]; fra1 co-located with Supabase eu-central-1 [R:05 §3.3] |
| Framework | **Next.js 16 App Router**, Turbopack, React 19.2, TypeScript strict | `next@16` (≥16.1), `react@19.2`, `react-dom@19.2`, `typescript` (latest stable supported by Next 16) | `proxy.ts` replaces `middleware.ts`; `next lint` removed → run ESLint CLI [R:05 §3.1] |
| Styling | **Tailwind CSS v4.3+**, CSS-first `@theme`, logical utilities only (`ms/me/ps/pe`, `inset-s-*/inset-e-*`, `text-start/end`, `border-s/e`, `rounded-s/e`) | `tailwindcss@^4.3`, `@tailwindcss/postcss` | `start-*/end-*` are legacy → `inset-s/e` [R:08 addendum 1] |
| Components | **shadcn/ui** created with `shadcn create` style **`radix-nova`**, `rtl: true` in `components.json`; app wrapped in shadcn `DirectionProvider direction="rtl"` (Radix `Direction.Provider` underneath) | `shadcn@latest` (CLI), `radix-ui` | First-class RTL since Jan 2026 [R:05 §8, R:08 §5.1] |
| Icons | **lucide-react** (seed `niches.icon` uses Lucide names) | `lucide-react` | Directional icons flip via `DirIcon` (§11.7) |
| Motion | **Motion** for UI; **GSAP + ScrollTrigger** for 1–2 marketing scroll sections; **Lenis** marketing only | `motion@^12` (`motion/react`), `gsap@^3.13`, `lenis@^1.3` | GSAP fully free incl. SplitText (words mode only) [R:08 §5.2] |
| Effects | Magic UI (Marquee, BorderBeam, NumberTicker, BentoGrid, BlurFade), Aceternity (PlaceholdersAndVanishInput, Compare) copied via shadcn registry and converted to logical classes | — | ≤ 3 heavy effects per page [R:08 §10] |
| UI utilities | Embla (RTL carousel), Sonner (toasts, `dir="rtl"`), cmdk (⌘K), react-hook-form + zod, TanStack Query (5 s polling fallback), dnd-kit (scene reorder), Recharts via shadcn charts (LTR) | `embla-carousel-react@^8`, `sonner`, `cmdk`, `react-hook-form@^7`, `@hookform/resolvers`, `@tanstack/react-query@^5`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts` | [R:08 §5.1] |
| i18n | **next-intl v4**, single locale `he`, no locale prefix, all strings in `messages/he.json`; `dir` derived from locale (ready for `ar`, `ru`, `en`) | `next-intl@^4` | [R:05 §8] |
| Dates/numbers | `Intl` (`he-IL`, `Asia/Jerusalem`, ILS), date-fns v4 + `he` locale | `date-fns@^4` | Week starts Sunday [R:05 §8] |
| Validation | **zod** — use the major required by `@remotion/zod-types`' peer dependency; if Remotion still requires zod 3, use `zod@3.25.x` and import from `zod/v4` only where Remotion is not involved [M0-verify] | `zod` | JSON Schemas for OpenRouter are generated from Zod (`z.toJSONSchema` or `zod-to-json-schema`) and snapshot-tested |
| DB / Auth / Storage / Realtime | **Supabase Pro**, region **eu-central-1 (Frankfurt)**, new API keys `sb_publishable_…` / `sb_secret_…` | `@supabase/supabase-js@^2`, `@supabase/ssr`, Supabase CLI | Legacy `anon/service_role` deprecated by end of 2026 [R:05 §6.1] |
| AI text | **AI SDK v6 + `@openrouter/ai-sdk-provider` v2** (pinned). Upgrade to `ai@7` + provider v3 only after `npm view @openrouter/ai-sdk-provider peerDependencies` accepts v7 [M0-verify] | `ai@^6`, `@openrouter/ai-sdk-provider@^2` | [R:05 §11.27, addendum] |
| AI media | Own typed `fetch` client for OpenRouter `/images`, `/videos`, `/audio/speech`, `/audio/transcriptions`, `/models`, `/videos/models` | — | OpenRouter-specific async endpoints [R:05 §3.3] |
| Orchestration | **Vercel Workflows (Workflow DevKit, GA 2026-04-16)** — default. Alternative behind `JobOrchestrator` interface: **Trigger.dev v4** (adapter in v2) | `workflow` (GA major), `workflow/next` | §6.1 |
| Render | **Remotion 4** rendered on **Vercel Sandbox** via `@remotion/vercel` — default. Alternative behind `RenderProvider`: **Remotion Lambda (eu-central-1)** | `remotion`, `@remotion/player`, `@remotion/vercel`, `@remotion/captions`, `@remotion/google-fonts`, `@remotion/fonts`, `@remotion/media-parser`, `@remotion/transitions`, `@remotion/zod-types`, `@remotion/bundler`, `@remotion/cli` — **all the same exact version** | [R:05 §3.3, §5.1] |
| Temp render output | Vercel Blob **only if** `@remotion/vercel` requires it; the finalize step copies to Supabase Storage and deletes the blob | `@vercel/blob` | [R:05 §5.1] |
| Rate limiting | Upstash Redis (Vercel Marketplace) + Postgres quotas | `@upstash/ratelimit`, `@upstash/redis` | Protects OpenRouter spend [R:05 §9] |
| Email | **Resend + React Email** (RTL templates); Resend also as Supabase custom SMTP | `resend`, `@react-email/components` | Default Supabase SMTP is rate-limited [R:05 §6.1] |
| Payments | **Grow** (default `PaymentProvider`); Cardcom / Sumit / PayPlus adapters later | REST via `fetch` | §10.7 |
| Invoices | **Morning (Green Invoice) API** (default `InvoiceProvider`) | REST via `fetch` | Automated allocation numbers [R:05 §7.3] |
| Analytics | PostHog EU cloud, consent-gated | `posthog-js`, `posthog-node` | [R:05 §9] |
| Errors | Sentry | `@sentry/nextjs` | |
| OG images | `next/og` (`ImageResponse`) + Heebo TTF + `bidi-js` visual reordering; fallback Remotion `renderStill` per niche | `bidi-js` | Satori's bidi support is weak [design][M0-verify] |
| Content | Blog + legal pages as MDX in repo | `@next/mdx` + `gray-matter` | Versioned legal copy |
| Testing | Vitest (unit/contract), Playwright (e2e) + `@axe-core/playwright`, MSW (OpenRouter/Grow/Morning mocks), pgTAP or SQL tests for RLS | `vitest`, `@playwright/test`, `@axe-core/playwright`, `msw` | |
| Tooling | pnpm, ESLint flat config, Prettier, `tsx`, custom `scripts/lint-rtl.ts` (bans physical classes) | | |

---

## 3. Repository structure

```
/
├─ app/
│  ├─ layout.tsx                       # <html lang="he" dir="rtl" data-theme>, fonts, Providers, SkipLink, MotionPreference
│  ├─ globals.css                      # Tailwind v4 @theme tokens (§11)
│  ├─ providers.tsx                    # DirectionProvider, QueryClient, ThemeProvider, NextIntlClientProvider, PostHogProvider
│  ├─ not-found.tsx · error.tsx · global-error.tsx · robots.ts · sitemap.ts · manifest.ts
│  ├─ (marketing)/
│  │  ├─ layout.tsx                    # MarketingHeader, MarketingFooter, MobileStickyCta, AnnouncementBar
│  │  ├─ page.tsx                      # landing (§4.2)
│  │  ├─ niches/page.tsx · niches/[niche]/page.tsx · niches/[niche]/opengraph-image.tsx
│  │  ├─ hooks/page.tsx · hooks/[niche]/page.tsx · hooks/[niche]/[type]/page.tsx
│  │  ├─ hooks/types/page.tsx · hooks/types/[type]/page.tsx
│  │  ├─ hooks/season/[season]/page.tsx · hooks/platform/[platform]/page.tsx · hooks/h/[id]/page.tsx
│  │  ├─ examples/page.tsx · templates/page.tsx · templates/[slug]/page.tsx · pricing/page.tsx
│  │  ├─ blog/page.tsx · blog/[slug]/page.tsx · blog/tag/[tag]/page.tsx
│  │  ├─ about/page.tsx · contact/page.tsx · faq/page.tsx
│  │  └─ legal/{terms,privacy,cancellation,accessibility,ai-policy,likeness-consent,cookies}/page.tsx
│  ├─ (auth)/login/page.tsx · auth/callback/route.ts · auth/confirm/route.ts · auth/error/page.tsx
│  ├─ (share)/v/[token]/page.tsx · approve/[token]/page.tsx · unsubscribe/page.tsx
│  ├─ (product)/app/                   # URL prefix /app — auth-gated AppShell
│  │  ├─ layout.tsx · page.tsx (dashboard) · onboarding/page.tsx · create/page.tsx
│  │  ├─ projects/page.tsx · projects/[projectId]/page.tsx
│  │  ├─ projects/[projectId]/create/[step]/page.tsx
│  │  ├─ projects/[projectId]/editor/page.tsx · projects/[projectId]/jobs/[jobId]/page.tsx
│  │  ├─ library/page.tsx · brand/page.tsx · brand/[kitId]/page.tsx · templates/page.tsx · hooks/page.tsx
│  │  ├─ billing/page.tsx · billing/plans/page.tsx · billing/cancel/page.tsx · billing/return/page.tsx
│  │  ├─ team/page.tsx · clients/page.tsx
│  │  └─ settings/{page.tsx, notifications, accessibility, privacy, pronunciation}/page.tsx
│  ├─ (admin)/admin/                   # is_platform_admin only
│  │  ├─ page.tsx · models/page.tsx · prompts/page.tsx · niches/page.tsx · hooks/page.tsx · templates/page.tsx
│  │  ├─ examples/page.tsx · voices/page.tsx · music/page.tsx · users/page.tsx · workspaces/[id]/page.tsx
│  │  └─ jobs/page.tsx · jobs/[id]/page.tsx · billing/page.tsx · credits/page.tsx · settings/page.tsx · audit/page.tsx · costs/page.tsx
│  └─ api/                             # Route Handlers (§4.5)
├─ components/
│  ├─ ui/ (shadcn) · layout/ · a11y/ · marketing/ · hooks/ · niches/ · wizard/ · editor/ · video/ · billing/ · brand/ · team/ · admin/ · seo/
├─ remotion/
│  ├─ index.ts (registerRoot) · Root.tsx · schema.ts (PromoPropsSchema) · fonts.ts · rtl.ts
│  ├─ compositions/ Promo.tsx · Animatic.tsx · PosterStill.tsx · CaptionStyleSample.tsx
│  ├─ layers/ SceneLayer.tsx · KenBurnsImage.tsx · ClipLayer.tsx · BrandCard.tsx · HookTitle.tsx · CaptionsLayer.tsx · LowerThird.tsx · LogoBug.tsx · EndCard.tsx · AiLabel.tsx · Watermark.tsx · AudioMix.tsx
│  └─ captions/ presets.ts · paginate.ts
├─ lib/
│  ├─ env.ts · constants.ts · flags.ts · log.ts · errors.ts · ratelimit.ts · crypto.ts · idempotency.ts
│  ├─ supabase/ server.ts · browser.ts · admin.ts · proxy.ts · database.types.ts (generated)
│  ├─ auth/ · workspace/ · storage/ (paths.ts, signed.ts, upload.ts)
│  ├─ ai/ openrouter/{http.ts,chat.ts,images.ts,videos.ts,audio.ts,models.ts,webhook.ts} · aisdk.ts · registry.ts · cost.ts · moderation.ts
│  │      tasks/{brand.ts,script.ts,storyboard.ts,hooks.ts,rewrite.ts,image.ts,video.ts,tts.ts,stt.ts,music.ts,avatar.ts}
│  │      prompts/{index.ts, *.ts (one file per prompt ID §7.2)} · schemas/{brand.ts,script.ts,storyboard.ts,hooks.ts,captions.ts,moderation.ts}
│  ├─ pipeline/ workflow.ts · steps/*.ts · plan.ts · estimate.ts · state.ts
│  ├─ orchestrator/ types.ts · vercel-workflow.ts · inline.ts · index.ts
│  ├─ render/ types.ts · vercel-sandbox.ts · lambda.ts · local.ts · props.ts · index.ts
│  ├─ captions/ align.ts · paginate.ts · subtitles.ts (SRT/VTT)
│  ├─ credits/ · billing/ (types.ts, grow.ts, mock.ts, engine.ts, vat.ts, refunds.ts) · invoicing/ (types.ts, morning.ts, mock.ts)
│  ├─ hebrew/ placeholders.ts · inflect.ts · bidi.ts · text.ts · numbers.ts
│  ├─ format/ · seo/ (metadata.ts, jsonld.ts, og.ts) · analytics/ (events.ts, client.ts, server.ts) · email/ (send.ts, templates/*.tsx)
├─ messages/he.json
├─ content/ blog/*.mdx · legal/*.mdx
├─ supabase/
│  ├─ config.toml · migrations/ (0001_extensions_enums.sql … numbered, §5) · tests/*.sql
│  └─ seed/ seed.ts · data/{niche_categories,niches,hook_families,hook_types,seasons,hooks,plans,credit_packs,credit_costs,model_registry,model_routes,voices,music_tracks,templates,app_settings,feature_flags}.json
├─ scripts/ sync-models.ts · render-demo-videos.ts · generate-niche-seo.ts · lint-rtl.ts · check-env.ts
├─ tests/ unit/ · contract/ · e2e/ · fixtures/bidi-strings.json · fixtures/openrouter/*.json
├─ public/ media/demo/ · fonts/Heebo-*.ttf (OG) · icons/
├─ proxy.ts · next.config.ts (withWorkflow, withSentryConfig, withNextIntl) · vercel.json · components.json
├─ DECISIONS.md · README.md · .env.example
```

---

## 4. Routes

### 4.1 URL strategy (decision)
**English kebab-case slugs, Hebrew titles/H1/meta/breadcrumbs.** Justification: stable, short and readable when shared on WhatsApp (the dominant Israeli channel), whereas Hebrew paths are percent-encoded when pasted [R:07 §A10, R:06 §1.6]; Google ranks on Hebrew title/H1/content; one consistent rule avoids duplicate URLs. The Hebrew phrase people search ("סרטון תדמית לרופא שיניים", "הוקים לרילס נדל"ן") goes into `<title>`, H1 and intro [R:06 §5.1]. Reserved words that may never be niche slugs: `types`, `season`, `platform`, `h`, `new`, `search`. Hook-type slugs are already kebab-case in the seed (`curiosity-gap` → `/hooks/types/curiosity-gap`), so URL segment = slug (no conversion).

### 4.2 Public marketing routes
| Path | Page (Hebrew H1 pattern) | Rendering | Index |
|---|---|---|---|
| `/` | Landing (sections §11.9) | Static + ISR 1 h | yes |
| `/niches` | "סרטוני תדמית ורילס לפי נישה" — category groups | SSG + ISR 24 h | yes |
| `/niches/[niche]` | "סרטון תדמית ל{name_he}" — hero video, video types, 3 sample scripts, hooks teaser, pricing, FAQ, compliance note | SSG (`generateStaticParams` over active niches) + ISR 24 h | yes |
| `/hooks` | "ספריית ההוקים בעברית: משפטי פתיחה לסרטונים שעוצרים גלילה" — search, facets, featured, hook of the day | SSR first page + client facets | yes (base only) |
| `/hooks/[niche]` | "הוקים לסרטונים ל{name_he} – {count} משפטי פתיחה ({year})" — intro (`niches.seo_intro_he`), all hooks, sample scripts, FAQ, related niches | SSG + ISR 6 h | yes (main SEO asset) |
| `/hooks/[niche]/[type]` | "הוקים מסוג {type.name_he} ל{name_he}" | ISR | **only if ≥ 8 hooks and a unique intro**; else `noindex,follow` + canonical to `/hooks/[niche]` [R:07 §A10] |
| `/hooks/types` · `/hooks/types/[type]` | "סוגי הוקים" · "מה זה הוק {name_he} ואיך כותבים אחד" | SSG | yes |
| `/hooks/season/[season]` | "הוקים ל{season.name_he} {year}" | ISR 24 h | yes |
| `/hooks/platform/[platform]` | "הוקים ל{platform_he} לעסקים" | SSG | yes |
| `/hooks/h/[id]` | Single hook share target | ISR | `noindex`, canonical → niche page |
| `/examples` | "דוגמאות לסרטונים שנוצרו ב{{BRAND_NAME}}" (filters `?niche=&format=&type=`) | ISR 1 h | yes (base) |
| `/templates` · `/templates/[slug]` | Templates gallery / detail | SSG + ISR | yes |
| `/pricing` | "מחירים פשוטים, בשקלים" | SSG + ISR | yes |
| `/blog` · `/blog/[slug]` · `/blog/tag/[tag]` | MDX blog (long-read typography) | SSG | yes |
| `/about` · `/contact` · `/faq` | About / contact form / FAQ | SSG | yes |
| `/legal/terms` | תנאי שימוש | SSG | yes |
| `/legal/privacy` | מדיניות פרטיות (Amendment 13 notice elements) | SSG | yes |
| `/legal/cancellation` | מדיניות ביטול והחזרים | SSG | yes |
| `/legal/accessibility` | הצהרת נגישות (alias redirect `/accessibility`) | SSG | yes |
| `/legal/ai-policy` | מדיניות שימוש הוגן ב-AI | SSG | yes |
| `/legal/likeness-consent` | מדיניות הסכמה לשימוש בדמות ובקול | SSG | yes |
| `/legal/cookies` | מדיניות עוגיות ואנליטיקה | SSG | yes |
| `/v/[token]` | Public share page of a render (player, captions, "צרו סרטון כזה") | Dynamic | `noindex` |
| `/approve/[token]` | Client approval page (approve / request changes) | Dynamic | `noindex` |
| `/unsubscribe` | One-click marketing unsubscribe (`?token=`) | Dynamic | `noindex` |
| `/login` · `/auth/callback` · `/auth/confirm` · `/auth/error` | Auth | Dynamic | `noindex` |

Hooks facets are query params on `/hooks` and `/hooks/[niche]`: `q`, `type`, `platform`, `goal`, `gender`, `season`, `featured=1`, `has_video=1`, `sort=popular|new|most_generated`, `page`. Any URL with facet params is `noindex,follow` with canonical to the base path.

### 4.3 App routes (auth required; prefix `/app`)
| Path | Screen | Notes |
|---|---|---|
| `/app` | Dashboard: greeting + quick starts (סרטון תדמית / רילס עם הוק / מבצע או חג), in-progress queue, recent projects, "הוק השבוע לנישה שלכם", upcoming seasons rail | [R:08 §8.2] |
| `/app/onboarding` | 3 steps: business (URL or manual) → niche → audience/register/voice gender; grants nothing (trial granted at signup) | sets `profiles.onboarding_completed_at` |
| `/app/create` | Creates a draft project (from `?template=`, `?hook=`, `?niche=`) then redirects to step `business` | `POST /api/projects` |
| `/app/projects/[projectId]/create/[step]` | Wizard. `step` ∈ `business · niche · goal · hook · script · style · voice · music · preview` (enum `WizardStep`); confirm dialog `ConfirmGenerateDialog` starts generation | live preview pane |
| `/app/projects/[projectId]/jobs/[jobId]` | Render progress (`RenderProgress`) | Realtime `job:{jobId}` |
| `/app/projects/[projectId]` | Project page: player, format tabs, downloads (MP4 per format, SRT, VTT, poster), share/approval links, versions, credits spent | |
| `/app/projects/[projectId]/editor` | Storyboard editor (scene list, player, properties tabs, timeline-lite) | [R:08 §8.4] |
| `/app/projects` | Projects grid/list with filters | |
| `/app/library` | Media library: uploads, logos, generated keyframes/clips, renders; upload dropzone | |
| `/app/brand` · `/app/brand/[kitId]` | Brand kits list / editor with live preview | plan-limited count |
| `/app/templates` | Templates gallery (deep-link to wizard `hook` step) | |
| `/app/hooks` | In-app hooks library with favorites, personalization, "השתמשו בהוק" | |
| `/app/billing` · `/app/billing/plans` · `/app/billing/cancel` · `/app/billing/return` | Balance, ledger, invoices, plans, packs, cancel flow, hosted-page return | |
| `/app/team` | Members, roles, invites, seats | |
| `/app/clients` | Agency: client workspaces list, create, switch | agency plan |
| `/app/settings` (+ `/notifications`, `/accessibility`, `/privacy`, `/pronunciation`) | Profile, UI gender form, theme; channels; reduce motion / larger captions; consents, export, delete; pronunciation dictionary | |

Current workspace = cookie `ws` (validated server-side against membership); `WorkspaceSwitcher` changes it. URLs do not contain workspace IDs.

### 4.4 Admin routes (`profiles.is_platform_admin = true`; `/admin` blocked by `proxy.ts` otherwise)
`/admin` (KPIs, today's OpenRouter spend vs budget, job success rate) · `/admin/models` (registry, enable/disable, set defaults per task key, sync now) · `/admin/prompts` (view prompt templates by ID, run a test with sample brief, compare models) · `/admin/niches` · `/admin/hooks` (CRUD, status, featured, AI batch generate per niche → review queue) · `/admin/templates` · `/admin/examples` · `/admin/voices` (map curated voices to provider voice IDs, record samples) · `/admin/music` (generate library tracks with Lyria, approve) · `/admin/users` · `/admin/workspaces/[id]` · `/admin/jobs` · `/admin/jobs/[id]` (steps, AI generations, costs, retry, force-refund) · `/admin/billing` (payments, refund requests, invoices) · `/admin/credits` (manual grant/adjust with reason → `audit_logs`) · `/admin/settings` (app settings, feature flags, election mode, quiet days) · `/admin/audit` · `/admin/costs` (cost per job, per model, per workspace; margin).

### 4.5 API Route Handlers
Conventions: JSON bodies validated by Zod; errors as `{ error: { code: ErrorCode, message_he: string, details?: object } }` with proper HTTP status; auth via Supabase session cookie (`@supabase/ssr`) unless noted; workspace from `ws` cookie checked with `can_access_workspace`; mutations that spend credits require header `Idempotency-Key` (UUID v4). Server Actions are used only for simple form saves (settings, brand kit fields, business profile); everything streamed, called by webhooks/cron, or spending credits is a Route Handler.

| Method · Path | Auth | Request | Response |
|---|---|---|---|
| `POST /api/projects` | user (editor+) | `{ templateId?, hookId?, workspaceHookId?, nicheSlug?, videoType? }` | `201 { projectId, step: "business" }` |
| `PATCH /api/projects/[id]` | editor+ | partial `ProjectBriefPatch` (any wizard field) | `200 { project }` |
| `POST /api/projects/[id]/duplicate` | editor+ | `{}` | `201 { projectId }` |
| `POST /api/brand/extract` | user | `{ url }` | **SSE stream** of `{type:"progress", label_he}` then `{type:"result", profile: BrandProfileV1}`; free, 5/day/workspace |
| `POST /api/projects/[id]/hooks` | editor+ · Idempotency-Key | `{ count: 6..10, sourceHookId? }` | streamed `HookBatchV1` partials; spends `hooks.generate` |
| `POST /api/projects/[id]/script` | editor+ · Idempotency-Key | `{ hookText?, regenerate?: boolean }` | streamed `ScriptV1` partials (AI SDK object stream); spends `script.generate` |
| `POST /api/projects/[id]/storyboard` | editor+ · Idempotency-Key | `{ versionId }` | `200 { versionId, storyboard: StoryboardV1, scenes }`; spends `storyboard.generate` |
| `POST /api/projects/[id]/scenes/[sceneId]/rewrite` | editor+ | `{ instruction: "shorter"\|"energetic"\|"formal"\|"custom", customText? }` | `200 { scene }` (free, 50/day) |
| `POST /api/projects/[id]/estimate` | member | `{ versionId, formats[], quality, visualMix }` | `200 { credits, breakdown: [{actionKey, units, credits}], balance, sufficient }` |
| `POST /api/projects/[id]/generate` | editor+ · Idempotency-Key | `{ versionId, formats[] }` | `202 { jobId }` · `402 INSUFFICIENT_CREDITS` · `409 CONCURRENCY_LIMIT` · `451 ELECTION_POLICY_BLOCKED` |
| `POST /api/projects/[id]/scenes/[sceneId]/regenerate` | editor+ · Idempotency-Key | `{ what: "visual"\|"clip"\|"keyframe", promptOverrideEn? }` | `202 { jobId }` |
| `POST /api/projects/[id]/render` | editor+ · Idempotency-Key | `{ versionId, formats[] }` (re-render after edits, no new AI media) | `202 { jobId }` |
| `GET /api/jobs/[id]` | member | — | `200 { job, steps[], scenes[] }` (polling fallback, 5 s) |
| `POST /api/jobs/[id]/cancel` | editor+ | `{}` | `200 { status }` |
| `POST /api/uploads/sign` | editor+ | `{ kind: "upload_image"\|"upload_video"\|"logo", mime, bytes, filename }` | `200 { assetId, bucket, path, signedUrl, token }` (direct-to-Storage; TUS for > 6 MB) |
| `POST /api/uploads/complete` | editor+ | `{ assetId }` | `200 { asset }` (probes dims/duration with `@remotion/media-parser`) |
| `GET /api/assets/[id]/url` | member | `?download=1` | `200 { url, expiresAt }` (signed, 1 h) |
| `GET /api/hooks/search` | public | facets as query | `200 { items: HookCardDTO[], total, facets }` |
| `POST /api/hooks/[id]/event` | public (rate-limited by IP) | `{ kind: "copy"\|"generate"\|"share" }` | `204` |
| `POST /api/hooks/favorites` | user | `{ hookId, on: boolean }` | `200` |
| `POST /api/voices/preview` | user | `{ voiceId, text? (≤ 120 chars) }` | `200 { url }` (cached; 20/day) |
| `GET /api/models/options` | user | — | `200 { qualityTiers: [...], enabled: boolean per tier, creditsPerUnit }` (no model names unless "מתקדם") |
| `POST /api/share` | editor+ | `{ projectId, kind: "public_view"\|"client_approval", allowDownload, expiresInDays? }` | `201 { url }` |
| `POST /api/approvals/[token]` | public with token | `{ decision: "approved"\|"changes_requested", name, comment? }` | `200` |
| `POST /api/billing/checkout` | owner/admin | `{ kind: "subscription", planId, cycle } \| { kind: "topup", packId } \| { kind: "update_card" }` | `200 { redirectUrl }` (hosted page) |
| `POST /api/billing/cancel` | owner | `{ reason, details?, requestRefund?: boolean, extendedEligibility?: boolean }` | `200 { effectiveAt, refundQuote? }` |
| `GET /api/billing/invoices/[id]` | owner/admin | — | `302` to signed PDF URL |
| `POST /api/billing/plan-change` | owner | `{ planId, cycle }` | `200 { effectiveAt, chargeNowIls }` |
| `POST /api/account/export` · `POST /api/account/delete` | user | `{}` / `{ confirmText }` | `202` |
| `POST /api/consents` | public/user | `{ kind, granted, version, source }` | `204` |
| `POST /api/contact` | public (captcha-free honeypot + rate limit) | `{ name, email, phone?, topic, message, marketingOptIn: false }` | `204` |
| `POST /api/newsletter` | public | `{ email, consent: true }` | `204` (double opt-in email) |
| `POST /api/webhooks/openrouter/video` | **OpenRouter signature** + per-step token `?t=` | raw body (`video.generation` event) | `204`; `401` bad signature |
| `POST /api/webhooks/render` | HMAC token `?t=` | `{ renderRunId, status, progress, outputPath?, error? }` | `204` |
| `POST /api/webhooks/payments/[provider]` | provider verification (signature or server-side re-query) | raw provider payload | `200` (idempotent) |
| `POST /api/webhooks/invoices/[provider]` | provider verification | raw | `200` |
| `GET /api/cron/sweep-jobs` | `Authorization: Bearer $CRON_SECRET` | — | `200 { swept }` |
| `GET /api/cron/billing-renewals` · `/sync-models` · `/hook-of-the-day` · `/reminders` · `/cleanup` | CRON_SECRET | — | `200` |
| `/api/admin/*` | platform admin | CRUD for §4.4 | — |
| `/.well-known/workflow/*` | WDK internal (generated by `withWorkflow`) | — | — |

`vercel.json` crons: `sweep-jobs` `* * * * *`; `billing-renewals` `5 * * * *`; `sync-models` `10 1 * * *`; `hook-of-the-day` `2 22 * * *` (≈ 00:02/01:02 Israel); `reminders` `0 7 * * *`; `cleanup` `30 2 * * *`.

---

## 5. Database (Supabase Postgres)

### 5.1 Conventions
- Schema `public`; snake_case; plural table names; every table has `created_at timestamptz not null default now()`; mutable tables have `updated_at` maintained by trigger `set_updated_at()`.
- IDs: `uuid primary key default gen_random_uuid()` unless noted (seed catalog tables use text slugs as PK; `hooks.id` is the canonical text ID such as `real-estate-01`).
- Extensions: `pgcrypto`, `citext`, `pg_trgm`, `pg_cron`, `pg_net` (optional), `supabase_vault`.
- Migrations: `supabase/migrations/0001_extensions_enums.sql`, `0002_tenancy.sql`, `0003_catalog.sql`, `0004_projects_jobs.sql`, `0005_credits_billing.sql`, `0006_sharing_ops.sql`, `0007_functions.sql`, `0008_rls.sql`, `0009_storage.sql`, `0010_realtime.sql`, `0011_cron.sql`. Types generated to `lib/supabase/database.types.ts` (`supabase gen types typescript`).
- RLS is **enabled on every table**; policies always `to authenticated` (or `anon` for public catalog reads) and wrap `auth.uid()` as `(select auth.uid())`; every policy column is indexed [R:05 §6.2].

### 5.2 Enums
```
workspace_type      : personal | business | agency | client
member_role         : owner | admin | editor | viewer
compliance_flag     : none | medical | legal | financial | real_estate | alcohol | political | other
platform            : reels | tiktok | shorts | facebook | youtube | whatsapp | linkedin   (linkedin reserved for B2B; unused by the launch seed)
hook_goal           : awareness | leads | sales | trust | engagement
hook_gender         : neutral | plural | male | female
audience_gender     : plural | female | male
voice_gender        : male | female
register            : formal | warm | casual | slang
video_type          : brand_promo | reel_hook | offer | testimonial | launch | recruiting | explainer
aspect_ratio        : '9:16' | '1:1' | '16:9'
quality_tier        : draft | standard | premium
visual_mix          : images | smart | full
visual_source       : ai_clip | ai_image_kenburns | user_media | user_photo_animated | brand_card | stock_broll
project_stage       : draft | brief | script | storyboard | voice | captions | assets | render | done | failed
job_kind            : full_generate | regenerate_scene | rerender
job_status          : queued | running | waiting_external | succeeded | failed | canceled
job_stage           : queued | voice | captions | keyframes | clips | music | render | finalize | done
step_status         : pending | running | waiting_external | succeeded | failed | skipped | canceled | degraded
asset_kind          : logo | brand_image | upload_image | upload_video | keyframe | clip | voiceover | music | sfx | render | poster | captions_json | captions_srt | captions_vtt | thumbnail | export_zip
asset_source        : upload | openrouter | render | system | library
ai_task             : llm_brand | llm_script | llm_storyboard | llm_hooks | llm_rewrite | llm_moderation | llm_utility | image | video | tts | stt | music | avatar
model_task          : llm | image | video | tts | stt | music | avatar
ledger_kind         : grant_trial | grant_plan | grant_rollover | purchase | promo | reserve | capture | release | refund | adjustment | expire
grant_source        : trial | plan_cycle | rollover | topup | promo | admin | goodwill
reservation_status  : open | settled | refunded
billing_cycle       : monthly | annual
subscription_status : active | past_due | canceled | expired
payment_kind        : subscription_initial | subscription_renewal | topup | plan_change | refund
payment_status      : pending | succeeded | failed | refunded | partially_refunded
invoice_doc_type    : tax_invoice_receipt | receipt | credit_invoice
consent_kind        : terms | privacy | marketing_email | marketing_sms | marketing_whatsapp | analytics_cookies | biometric_voice | biometric_likeness | ai_content_policy
webhook_provider    : openrouter | payment | invoice | resend | render
share_kind          : public_view | client_approval
approval_status     : pending | approved | changes_requested
notification_kind   : job_succeeded | job_failed | credits_low | payment_failed | approval_received | invite | system
```
TypeScript mirrors live in `lib/supabase/enums.ts` (generated types re-exported) — never redeclare string unions by hand.

### 5.3 Tables
Notation: `column type [NULL] [= default] — note`. Columns are NOT NULL unless marked NULL.

**A. Identity & tenancy**

`profiles` — `id uuid PK FK auth.users on delete cascade` · `full_name text NULL` · `avatar_url text NULL` · `phone text NULL` · `ui_gender_form audience_gender = 'plural'` (how the UI addresses this user) · `theme text = 'dark'` check in (`dark`,`light`,`system`) · `reduce_motion bool = false` · `larger_captions bool = false` · `is_platform_admin bool = false` · `last_workspace_id uuid NULL FK workspaces` · `onboarding_completed_at timestamptz NULL` · `trial_claimed_at timestamptz NULL` · `deleted_at timestamptz NULL` · timestamps.

`workspaces` — `id` · `name text` · `slug text unique` · `type workspace_type = 'business'` · `parent_workspace_id uuid NULL FK workspaces` (agency → client) · `owner_id uuid FK profiles` · `plan_id text FK plans = 'free'` · `has_paid bool = false` (any successful payment ever; removes watermark) · `white_label bool = false` · `default_brand_kit_id uuid NULL` · `niche_slug text NULL FK niches` · `deleted_at timestamptz NULL` · timestamps. Indexes: `(owner_id)`, `(parent_workspace_id)`. Client workspaces bill to the parent agency (credits are consumed from the **parent's** balance; see `billing_workspace_id()` §5.4).

`workspace_members` — PK `(workspace_id, user_id)` · `role member_role` · `invited_by uuid NULL` · `created_at`. Index `(user_id)`.

`workspace_invites` — `id` · `workspace_id` · `email citext` · `role member_role` · `token_hash text unique` · `invited_by uuid` · `expires_at timestamptz` · `accepted_at timestamptz NULL` · `created_at`.

`business_profiles` — `workspace_id uuid PK FK` · `business_name text` · `niche_slug text NULL FK niches` · `city text NULL` · `area text NULL` · `website_url text NULL` · `instagram_url text NULL` · `facebook_url text NULL` · `phone text NULL` · `whatsapp text NULL` · `address text NULL` · `services jsonb = '[]'` (`[{name_he, name_def_he, gender: "m"|"f"}]` for placeholder grammar [R:07 §B4]) · `usp_he text NULL` · `description_he text NULL` · `audience_he text NULL` · `audience_gender audience_gender = 'plural'` · `register register = 'warm'` · `preferred_cta text NULL` · `facts jsonb = '[]'` (real, user-confirmed facts: `[{key, label_he, value}]` e.g. rating, reviews count, years, price — the only numbers scripts may state) · `extracted_from_url text NULL` · `updated_at`.

`brand_kits` — `id` · `workspace_id` · `name text` · `is_default bool = false` (partial unique index: one default per workspace) · `logo_asset_id uuid NULL FK assets` · `logo_dark_asset_id uuid NULL` · `colors jsonb = '{"primary":"#FFB547","secondary":"#08080C","accent":"#FF4F7B","text":"#FFFFFF"}'` · `heading_font text = 'Heebo'` · `body_font text = 'Heebo'` · `caption_preset text = 'bold-pop'` · `caption_highlight_color text NULL` · `intro_style text = 'none'` (`none|logo_reveal|title_card`) · `end_card jsonb` (`{cta_type, headline_he, show_phone, show_whatsapp, show_website, show_address, show_qr}`) · `watermark jsonb = '{"enabled":false,"position":"bottom-end","opacity":0.7}'` · `lower_third_style text = 'glass'` · `default_voice_id text NULL FK voices` · `default_music_mood text NULL` · `shekel_format text = 'prefix'` (`prefix` "₪120" | `suffix` "120 ₪") · timestamps.

`voices` — `id text PK` (e.g. `he-f-noa`) · `display_name_he text` · `gender voice_gender` · `age_band text` (`young|adult|mature`) · `tone_he text` · `model_slug text` (e.g. `elevenlabs/eleven-v4`) · `provider_voice_id text NULL` (admin maps after blind test) · `sample_path text NULL` · `is_active bool = false` · `sort_order int`. Curate 4–8 Hebrew voices after native-speaker blind tests [R:06 §6.1].

`pronunciation_entries` — `id` · `workspace_id` · `term text` · `say_as text` (respelling or partial niqqud) · `note text NULL` · `created_by` · `created_at` · unique `(workspace_id, term)`.

**B. Public catalog (seeded; canonical shapes)**

`niche_categories` — `slug text PK` · `name_he` · `name_en` · `sort_order int`.

`niches` — canonical fields **exactly**: `slug text PK` (kebab) · `name_he` · `name_en` · `category_slug text FK niche_categories` · `icon text` (lucide-react name) · `description_he` · `video_types_he text[]` · `seasonal_angles_he text[]` · `compliance_flag compliance_flag` · `compliance_note_he text NULL` · `priority smallint check (1..3)` · `sort_order int`; DB-only extras: `is_active bool = true` (political niche → false at launch) · `seo_title_he text NULL` · `seo_description_he text NULL` · `seo_intro_he text NULL` (unique ≥ 150-word intro for `/hooks/[niche]`) · `landing_intro_he text NULL` (for `/niches/[niche]`) · `faq jsonb = '[]'` · `default_register register NULL` · `default_audience_gender audience_gender NULL` · `default_music_mood text NULL` · `default_cta text NULL` · `cover_path text NULL` · `example_video_path text NULL` · timestamps.

`hook_families` — `slug text PK` · `name_he` · `name_en` · `description_he` · `sort_order int`. Seeded from `seed/hook_families.json` (8 families; the seed script fails loudly on any `family_slug` missing here): `curiosity` סקרנות ומידע מבפנים · `warning` אזהרות וטעויות · `disruption` שבירת דפוס ועמדה · `relatable` הזדהות וסיפור · `proof` הוכחה ותוצאות · `education` ערך ולימוד · `visual` ויזואל ומאחורי הקלעים · `action` הצעה ומעורבות [R:07 §A1].

`hook_types` — canonical fields **exactly**: `slug text PK` (the 27 **kebab-case** slugs of the seed `hook_types.json`, e.g. `curiosity-gap`, `negative-warning`, `before-after`, `urgency-offer`) · `name_he` · `name_en` · `family_slug text FK hook_families` · `description_he` · `example_he` · `sort_order int`; extra `why_it_works_he text NULL`.

`seasons` — canonical seed fields: `slug text PK` · `name_he` · `name_en` · `date_hint_he text` (human description, unverified) · `publish_window_he text` · `niche_slugs text[]` (FK-checked by the seed script) · `is_quiet_day bool = false` · `note_he text NULL` · `sort_order int`; extra runtime columns: `starts_on date NULL` · `ends_on date NULL` (next occurrence; refreshed yearly from the Hebcal API or by an admin — never trust `date_hint_he` for scheduling) · `promo_lead_days int = 14`. Canonical slugs (exactly `seed/seasons.json`): `after-holidays`, `knesset-elections-2026`, `singles-day`, `black-friday`, `hanukkah`, `tax-year-end`, `silvester`, `new-year`, `tu-bishvat`, `registration-season`, `family-day`, `valentines`, `purim`, `pre-passover`, `passover`, `independence-day`, `lag-baomer`, `shavuot`, `summer`, `tu-beav`, `back-to-school`, `rosh-hashana`, `sukkot`; quiet days (no marketing publishing, scheduler pauses): `holocaust-memorial-day`, `memorial-day`. Seed script normalizes aliases (`pesach`→`passover`, `rosh-hashanah`→`rosh-hashana`, `chanukah`→`hanukkah`, `yom-haatzmaut`→`independence-day`, `yom-hazikaron`→`memorial-day`, `yom-hashoah`→`holocaust-memorial-day`) and fails loudly on unknown slugs. `knesset-elections-2026` is a sensitive period (see §12.5), not a promo season. Dates: Black Friday 2026-11-27, Hanukkah 2026-12-04→12-12 [R:06 §5.3].

`hooks` — canonical fields **exactly**: `id text PK` · `niche_slug text NULL FK niches` (NULL = universal) · `hook_type_slug text FK hook_types` · `text_he text` (may contain `{placeholders}`) · `platforms platform[]` · `goal hook_goal` · `gender hook_gender` · `visual_direction_he text` · `placeholders text[] = '{}'` · `season_slug text NULL FK seasons` · `compliance_note_he text NULL` · `is_featured bool = false`; extras: `secondary_type_slug text NULL FK hook_types` · `status text = 'published'` (`draft|published|archived`) · `source text = 'seed'` (`seed|admin|ai_batch`) · `sample_video_path text NULL` · `copies_count int = 0` · `generations_count int = 0` · timestamps. Indexes: `(niche_slug, hook_type_slug)`, `gin(platforms)`, `(season_slug)`, `(is_featured) where is_featured`, `gin(text_he gin_trgm_ops)`. Materialized view `hook_popularity(hook_id, score)` = copies + 3 × generations, refreshed every 30 min.

`hook_favorites` — PK `(user_id, hook_id)` · `workspace_id` · `created_at`.

`workspace_hooks` (private AI variations) — `id` · `workspace_id` · `project_id NULL` · `text_he` · `hook_type_slug` · `gender hook_gender` · `goal hook_goal` · `platforms platform[]` · `visual_direction_he` · `why_it_works_he` · `strength smallint` (1–5) · `source_hook_id text NULL FK hooks` · `created_by` · `created_at`.

`templates` — `id` · `slug text unique` · `name_he` · `description_he` · `niche_slug NULL` · `video_type video_type` · `goal hook_goal` · `structure text` (`hpspc|aida|pas|bab|result_first|brand_story`) · `duration_sec smallint` (15|30|45|60) · `aspect_ratio aspect_ratio` · `visual_style text` · `visual_mix visual_mix` · `caption_preset text` · `music_mood text` · `default_hook_type_slug text NULL` · `beat_plan jsonb` (`[{role, est_duration_sec, visual_idea_he}]`) · `preview_path NULL` · `poster_path NULL` · `is_public bool` · `sort_order int` · timestamps.

`examples` — `id` · `slug unique` · `title_he` · `niche_slug` · `video_type` · `aspect_ratio` · `duration_sec` · `video_path` · `poster_path` · `captions_vtt_path` · `hook_id NULL` · `template_id NULL` · `is_featured bool` · `is_published bool = false` · `sort_order` · `created_at`. **Only real outputs of the product** (never stock "AI-looking" fakes).

`music_tracks` — `id` · `title_he` · `mood text` (`energetic|warm|luxury|funny|calm|inspiring|urban`) · `bpm int NULL` · `duration_ms int` · `path text` (bucket `public-media`, `music-library/{mood}/{id}.mp3`) · `source text` (`lyria|licensed`) · `license_note text` · `is_active bool` · `sort_order`.

**C. Projects & generation**

`projects` — `id` · `workspace_id` · `created_by` · `title text` · `niche_slug NULL FK` · `video_type video_type = 'reel_hook'` · `goal hook_goal = 'leads'` · `platforms platform[] = '{reels,tiktok}'` · `primary_aspect aspect_ratio = '9:16'` · `extra_aspects aspect_ratio[] = '{}'` · `duration_target_sec smallint = 30` check in (15,30,45,60) · `quality_tier quality_tier = 'standard'` · `visual_mix visual_mix = 'smart'` · `visual_style text = 'cinematic'` (`cinematic|ugc|day_in_business|before_after|product|text_motion`) · `audience_gender = 'plural'` · `voice_gender = 'female'` · `register = 'warm'` · `brand_kit_id NULL` · `voice_id text NULL FK voices` · `voice_speed numeric(3,2) = 1.00` · `no_voice bool = false` · `music_mode text = 'library'` (`library|generate|none`) · `music_track_id NULL` · `music_mood text NULL` · `caption_preset text = 'bold-pop'` · `ai_label bool = false` · `hook_id text NULL FK hooks` · `workspace_hook_id uuid NULL` · `hook_text_he text NULL` · `brief jsonb = '{}'` (snapshot: business facts, free-text notes, offer, CTA target) · `template_id NULL` · `variant_group_id uuid NULL` (hook A/B siblings) · `variant_of_project_id uuid NULL` · `stage project_stage = 'draft'` · `wizard_step text = 'business'` · `current_version_id uuid NULL` · `latest_job_id uuid NULL` · `is_archived bool = false` · `deleted_at NULL` · timestamps. Indexes `(workspace_id, updated_at desc)`, `(workspace_id, stage)`.

`project_versions` — `id` · `project_id FK cascade` · `version int` · `script jsonb` (`ScriptV1`) · `storyboard jsonb NULL` (`StoryboardV1`) · `caption_track jsonb NULL` (`CaptionTrackV1`) · `voiceover_asset_id NULL` · `source text` (`ai|user_edit|rewrite`) · `created_by` · `created_at` · unique `(project_id, version)`. Versions are immutable snapshots; editing creates a new version (copy-on-write) and re-uses unchanged scene assets.

`scenes` — `id` · `project_id` · `version_id FK cascade` · `index smallint` · `beat_index smallint` · `duration_ms int` · `start_ms int NULL` (set after voice alignment) · `visual_source visual_source` · `image_prompt_en text` · `motion_prompt_en text` · `negative_prompt_en text` · `camera text` · `onscreen_text_he text` · `text_position text` (`top|center|bottom|none`) · `vo_he text` · `transition_in text` · `sfx text` · `kenburns text` · `focal_x numeric = 0.5` · `focal_y numeric = 0.5` · `is_hook_scene bool` · `hook_type_slug text NULL` · `keyframe_asset_id NULL` · `clip_asset_id NULL` · `user_asset_id NULL` · `status text = 'pending'` (`pending|generating|ready|failed|degraded`) · `degraded_reason text NULL` · timestamps · unique `(version_id, index)`.

`assets` — `id` · `workspace_id` · `project_id NULL FK set null` · `scene_id NULL` · `kind asset_kind` · `source asset_source` · `bucket text` · `path text` · `mime text` · `bytes bigint` · `width int NULL` · `height int NULL` · `duration_ms int NULL` · `aspect_ratio NULL` · `model_slug text NULL` · `ai_generation_id NULL` · `sha256 text NULL` · `metadata jsonb = '{}'` · `is_deleted bool = false` · `created_by NULL` · `created_at` · unique `(bucket, path)`. Indexes `(workspace_id, kind, created_at desc)`, `(project_id)`.

`jobs` — `id` · `workspace_id` · `billing_workspace_id` · `project_id` · `version_id` · `kind job_kind` · `status job_status = 'queued'` · `stage job_stage = 'queued'` · `progress smallint = 0` (0–100) · `idempotency_key text unique` · `orchestrator text` (`vercel-workflow|inline|trigger`) · `run_id text NULL` · `reservation_id uuid NULL` · `credits_estimated int` · `credits_captured int = 0` · `cost_usd_total numeric(12,6) = 0` · `cost_has_estimates bool = false` · `options jsonb` (`{formats[], sceneIds[]}`) · `error_code text NULL` · `error_message_he text NULL` · `error_detail jsonb NULL` · `requested_by` · `started_at NULL` · `heartbeat_at NULL` · `finished_at NULL` · `canceled_at NULL` · timestamps. Indexes `(workspace_id, created_at desc)`, `(status, heartbeat_at)`.

`job_steps` — `id` · `job_id FK cascade` · `step_key text` (`voice`, `captions`, `keyframe:{sceneId}`, `clip:{sceneId}`, `music`, `render:{aspect}`, `finalize`) · `scene_id NULL` · `status step_status = 'pending'` · `attempt smallint = 0` · `model_slug NULL` · `provider_job_id text NULL` (OpenRouter video id; partial unique) · `hook_token text NULL` · `input jsonb` · `output jsonb NULL` · `credits int = 0` · `cost_usd numeric(12,6) NULL` · `error_code NULL` · `error_message NULL` · `started_at NULL` · `finished_at NULL` · timestamps · unique `(job_id, step_key)`.

`render_runs` — `id` · `job_id` · `project_id` · `aspect_ratio` · `provider text` (`vercel-sandbox|lambda|local`) · `provider_run_id NULL` · `status text` (`queued|rendering|uploading|succeeded|failed`) · `progress numeric = 0` · `output_asset_id NULL` · `props_hash text` · `render_ms int NULL` · `cost_usd_estimated numeric NULL` · `error NULL` · `started_at` · `finished_at NULL`.

`ai_generations` (cost & audit of every AI call) — `id` · `workspace_id NULL` · `job_id NULL` · `step_id NULL` · `task ai_task` · `prompt_template_id text NULL` · `model_requested text` · `model_served text NULL` · `fallback_used bool = false` · `openrouter_id text NULL` · `endpoint text` (`chat|images|videos|speech|transcriptions`) · `unit_type text` (`tokens|image|second|char|song`) · `units numeric NULL` · `prompt_tokens int NULL` · `completion_tokens int NULL` · `cached_tokens int NULL` · `cost_usd numeric(12,6) NULL` (from `usage.cost`; NULL = unknown, never 0) · `cost_estimated_usd numeric(12,6) NULL` (from registry pricing) · `latency_ms int` · `status text` (`ok|error|timeout`) · `error_code NULL` · `created_at`. Indexes `(created_at)`, `(workspace_id, created_at)`, `(task, created_at)`.

**D. Credits & billing**

`plans` — `id text PK` (`free|starter|business|agency`) · `name_he` · `tagline_he` · `price_monthly_ils numeric(10,2)` (incl. VAT) · `price_annual_monthly_ils numeric(10,2) NULL` (incl. VAT, per-month equivalent) · `monthly_credits int` · `trial_credits int = 0` · `limits jsonb` (§10.3 keys) · `features_he jsonb` (string[] for pricing cards) · `is_public bool` · `is_highlighted bool` · `sort_order` · timestamps.

`credit_packs` — `id text PK` (`pack-150|pack-500|pack-1500`) · `name_he` · `credits int` · `price_ils numeric(10,2)` (incl. VAT) · `is_active bool` · `sort_order`.

`credit_costs` — `action_key text PK` (§10.4) · `credits int` · `unit text` · `label_he text` · `cogs_usd_per_unit numeric(10,5)` · `notes text NULL` · `updated_at` · `updated_by NULL`. Admin-editable; estimates always read this table.

`credit_grants` (buckets) — `id` · `workspace_id` · `source grant_source` · `amount int` · `remaining int check (remaining >= 0)` · `expires_at timestamptz NULL` (NULL = never) · `ref_type text NULL` · `ref_id text NULL` · `created_at`. Index `(workspace_id, expires_at nulls last, created_at) where remaining > 0`. Consumption order: earliest `expires_at` first, then oldest.

`credit_reservations` — `id` · `workspace_id` · `job_id NULL` · `amount int` · `captured int = 0` · `refunded int = 0` · `status reservation_status = 'open'` · `allocations jsonb` (`[{grant_id, amount}]`) · `idempotency_key text unique` · `created_at` · `settled_at NULL`.

`credit_ledger` (append-only) — `id bigint generated always as identity PK` · `workspace_id` · `delta int` · `kind ledger_kind` · `balance_after int` · `grant_id NULL` · `reservation_id NULL` · `job_id NULL` · `payment_id NULL` · `description_he text` · `idempotency_key text unique` · `actor_id uuid NULL` · `created_at`. Update/delete blocked by trigger `prevent_ledger_mutation()` and revoked privileges. Semantics: `reserve` = −N; `capture` = 0 (records the amount consumed by a step; informational); `release` = +unused; `refund` = +refunded; grants/purchases = +N; `expire` = −remaining.

`workspace_balances` — `workspace_id PK` · `balance int = 0` (= SUM(delta)) · `reserved int = 0` (open reservations not yet captured) · `lifetime_granted int = 0` · `lifetime_spent int = 0` · `updated_at`. Maintained only by the AFTER INSERT trigger on `credit_ledger`.

`subscriptions` — `id` · `workspace_id` (partial unique where `status in ('active','past_due')`) · `plan_id FK` · `billing_cycle` · `status subscription_status` · `price_ils numeric(10,2)` (locked, incl. VAT) · `vat_rate numeric(5,4)` · `current_period_start` · `current_period_end` · `cancel_at_period_end bool = false` · `canceled_at NULL` · `cancel_reason text NULL` · `cancel_channel text NULL` (`app|email|phone`) · `payment_method_id NULL` · `provider text` · `provider_ref text NULL` · `next_charge_at NULL` · `retry_count smallint = 0` · `last_charge_error NULL` · `promo_ends_at NULL` · timestamps.

`payment_methods` — `id` · `workspace_id` · `provider` · `token_enc text` (AES-256-GCM with `APP_ENCRYPTION_KEY`; gateway token, never PAN) · `brand text` · `last4 text` · `exp_month smallint` · `exp_year smallint` · `holder_name NULL` · `is_default bool` · `created_at` · `deleted_at NULL`.

`payments` — `id` · `workspace_id` · `subscription_id NULL` · `kind payment_kind` · `status payment_status` · `amount_ils numeric(10,2)` (incl. VAT) · `amount_net_ils` · `vat_ils` · `vat_rate` · `currency text = 'ILS'` · `installments smallint = 1` · `provider` · `provider_txn_id text` · `provider_payload jsonb` · `plan_id NULL` · `pack_id NULL` · `credits_granted int = 0` · `refunded_ils numeric(10,2) = 0` · `failure_reason NULL` · timestamps · unique `(provider, provider_txn_id)`.

`invoices` — `id` · `workspace_id` · `payment_id` · `provider` · `doc_type invoice_doc_type` · `doc_number text` · `allocation_number text NULL` · `pdf_path text NULL` · `provider_doc_id text` · `amount_ils` · `vat_ils` · `customer jsonb` (`{name, vat_id, email, address, is_business}`) · `issued_at` · `created_at` · unique `(provider, provider_doc_id)`.

`billing_profiles` — `workspace_id PK` · `legal_name` · `vat_id text NULL` (ח.פ / ע.מ / ת.ז) · `is_business bool = false` · `email citext` · `address_line NULL` · `city NULL` · `zip NULL` · `phone NULL` · `updated_at`.

`checkout_sessions` — `id` · `workspace_id` · `kind text` (`subscription|topup|update_card|plan_change`) · `plan_id NULL` · `billing_cycle NULL` · `pack_id NULL` · `amount_ils numeric(10,2)` · `provider` · `provider_session_ref NULL` · `status text` (`created|completed|failed|expired`) · `created_by` · `created_at` · `completed_at NULL`.

`refund_requests` — `id` · `workspace_id` · `payment_id` · `reason_code text` (`distance_14d|extended_4m|technical|goodwill`) · `credits_consumed int` · `consumed_value_ils numeric` · `fee_ils numeric` · `refund_ils numeric` · `status text` (`requested|approved|paid|rejected`) · `notes NULL` · `handled_by NULL` · `created_at` · `handled_at NULL`.

**E. Sharing & collaboration**

`share_links` — `id` · `workspace_id` · `project_id` · `version_id NULL` · `kind share_kind` · `token_hash text unique` · `allow_download bool = false` · `expires_at NULL` · `view_count int = 0` · `created_by` · `created_at` · `revoked_at NULL`. Branding is resolved at render time (`effective_white_label`), not stored on the link.

`approvals` — `id` · `share_link_id` · `project_id` · `version_id` · `status approval_status = 'pending'` · `approver_name text` · `approver_email citext NULL` · `comment_he text NULL` · `decided_at NULL` · `created_at`.

`notifications` — `id` · `user_id` · `workspace_id NULL` · `kind notification_kind` · `title_he` · `body_he` · `link text NULL` · `read_at NULL` · `created_at`.

**F. Compliance & operations**

`consents` — `id` · `user_id NULL` · `workspace_id NULL` · `email citext NULL` · `kind consent_kind` · `version text` · `granted bool` · `source text` (`signup|settings|checkout|newsletter|cookie_banner|likeness_flow`) · `ip inet NULL` · `user_agent text NULL` · `evidence_path text NULL` · `created_at` · `revoked_at NULL`.
`email_suppressions` — `email citext PK` · `reason text` (`unsubscribe|bounce|complaint`) · `created_at`.
`trial_claims` — `id` · `email_hash text unique` (normalized: lowercased, Gmail dots/`+tag` stripped, SHA-256 + pepper) · `phone_hash text unique NULL` · `user_id` · `created_at`.
`audit_logs` — `id bigint identity` · `workspace_id NULL` · `actor_id NULL` · `action text` (dot-namespaced, e.g. `credits.adjust`, `job.force_refund`, `member.role_change`, `model.toggle`, `settings.update`) · `target_type` · `target_id` · `metadata jsonb` · `ip inet NULL` · `created_at`.
`webhook_events` — `id` · `provider webhook_provider` · `external_id text` · `event_type text` · `signature_valid bool` · `payload jsonb NULL` · `status text` (`received|processed|failed|ignored`) · `error NULL` · `received_at` · `processed_at NULL` · unique `(provider, external_id)`.
`model_registry` — `slug text PK` · `task model_task` · `display_name_he` · `family text` · `is_enabled bool = false` · `tiers quality_tier[] = '{}'` · `pricing jsonb` (normalized: `{per_m_input, per_m_output, per_image, per_second: {"480p","720p","1080p"}, per_m_chars, per_song}` + raw `pricing_skus`) · `capabilities jsonb` (`supported_durations, supported_resolutions, supported_aspect_ratios, supported_frame_images, generate_audio, max_chars, structured_outputs`) · `raw jsonb` · `source text` (`openrouter_models|openrouter_videos_models|manual`) · `deprecated_at NULL` · `last_synced_at NULL` · `notes_he NULL` · `updated_at` · `updated_by NULL`.
`model_routes` — `task_key text PK` (§7.1) · `primary_slug text FK model_registry` · `fallback_slugs text[]` · `params jsonb` · `updated_at` · `updated_by NULL`.
`app_settings` — `key text PK` · `value jsonb` · `description text` · `updated_at` · `updated_by NULL`. Keys: `vat_rate` (0.18), `fx_usd_ils` (3.70), `election_mode` (`{"enabled":true,"until":"2026-10-28T23:59:00+02:00"}`), `hebrew_wps` (2.4 words/s, auto-calibrated per voice), `openrouter_daily_budget_usd`, `free_trial_credits` (70), `rollover_cap_multiplier` (1), `typical_video_credits` (50), `quiet_day_banner`, `maintenance_mode`.
`feature_flags` — `key text PK` · `enabled bool` · `plans text[] NULL` · `workspace_ids uuid[] NULL` · `description` · `updated_at`. Env `FEATURE_*` overrides for local/dev.
`contact_messages` — `id` · `name` · `email citext` · `phone NULL` · `topic text` (`sales|support|accessibility|privacy|cancellation|press`) · `message` · `user_id NULL` · `status text = 'new'` · `created_at`.
`data_requests` — `id` · `user_id` · `kind text` (`export|delete`) · `status text` · `result_path NULL` · `created_at` · `completed_at NULL`.
`likeness_profiles` (v2, flagged) — `id` · `workspace_id` · `person_name` · `kind text` (`voice|avatar`) · `consent_id FK consents` · `source_asset_id` · `provider_ref NULL` · `status text` · `revoked_at NULL` · `created_at`.

### 5.4 SQL functions (all `security definer`, `set search_path = ''`)
| Function | Purpose | Callable by |
|---|---|---|
| `is_member(ws uuid) → bool` | membership check (stable) | authenticated |
| `has_role(ws uuid, roles member_role[]) → bool` | role check | authenticated |
| `can_access_workspace(ws uuid) → bool` | member of `ws` **or** owner/admin/editor of its parent agency workspace | authenticated |
| `billing_workspace_id(ws uuid) → uuid` | parent agency id for client workspaces, else `ws` | authenticated |
| `is_platform_admin() → bool` | `profiles.is_platform_admin` for `auth.uid()` | authenticated |
| `create_workspace(p_name text, p_type workspace_type, p_parent uuid default null) → uuid` | workspace + owner membership + balance row + default brand kit | authenticated |
| `handle_new_user()` trigger on `auth.users` insert | profile, first workspace (type `business`, name "העסק שלי", renamed in onboarding), owner membership, balance row, default brand kit, trial grant via `trial_claims` (once per normalized email; bootstrap `ADMIN_EMAILS` handled server-side on first login) | trigger |
| `accept_invite(p_token text) → uuid` | validates hash/expiry, inserts membership | authenticated |
| `grant_credits(p_ws, p_amount, p_source grant_source, p_expires_at, p_ref_type, p_ref_id, p_idem, p_description_he) → bigint` | new grant bucket + ledger row | service_role |
| `reserve_credits(p_ws uuid, p_amount int, p_job uuid, p_idem text) → uuid` | `select … for update` on `workspace_balances`; raises `INSUFFICIENT_CREDITS` (SQLSTATE `P0001`, message = code); allocates from grants FIFO-by-expiry; ledger `reserve` (−amount) | service_role |
| `capture_credits(p_reservation uuid, p_amount int, p_idem text, p_description_he text) → void` | marks consumption; cannot exceed reserved; ledger `capture` (0) | service_role |
| `settle_reservation(p_reservation uuid, p_idem text) → int` | releases uncaptured remainder back to source grants; ledger `release` (+); status `settled` | service_role |
| `refund_reservation(p_reservation uuid, p_idem text, p_reason_he text) → int` | full refund (captured + uncaptured); status `refunded`; ledger `refund` (+) | service_role |
| `refund_credits(p_reservation uuid, p_amount int, p_idem text, p_reason_he text) → void` | partial refund of captured credits (failed scene inside a successful job) | service_role |
| `begin_spend(p_ws, p_amount, p_action_key, p_ref text, p_idem text, p_daily_cap int default null) → uuid` + `commit_spend(p_reservation uuid, p_idem text)` | interactive LLM actions: `begin_spend` reserves before the model call (status stays `open`; amount 0 → `null`); `commit_spend` captures and settles after the output is persisted (idempotent); `refund_reservation` on failure; the sweeper refunds open reservations without a job older than 6 minutes | service_role |
| `expire_credit_grants() → int` | zeroes expired buckets; ledger `expire` | pg_cron |
| `get_credit_summary(p_ws uuid) → table(balance, reserved, plan_allowance, expiring_30d, next_reset_at)` | UI meter | authenticated (member) |
| `search_hooks(p_q text, p_niche text, p_type text, p_platform platform, p_goal hook_goal, p_gender hook_gender, p_season text, p_featured bool, p_sort text, p_limit int, p_offset int) → setof hooks + total` | public search with trigram | anon, authenticated |
| `increment_hook_event(p_hook_id text, p_kind text) → void` | copies/generations counters | service_role (API rate-limits) |
| `ledger_apply_balance()` trigger | AFTER INSERT on `credit_ledger` → upsert `workspace_balances` | trigger |
| `prevent_ledger_mutation()` trigger | BEFORE UPDATE/DELETE on `credit_ledger` → raise | trigger |
| `broadcast_job_change()` trigger | AFTER INSERT/UPDATE on `jobs`, `job_steps`, `scenes` → `realtime.broadcast_changes('job:' \|\| job_id, …)` and on `jobs` also `'workspace:' \|\| workspace_id` | trigger |
| `set_updated_at()` trigger | updated_at | trigger |

Credit mutation functions are `revoke execute … from public, anon, authenticated` and called only server-side with the secret key.

### 5.5 RLS (policy summary; every policy `to authenticated` unless "anon")
| Table | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| `profiles` | own row; platform admin all | update own (except `is_platform_admin`, `trial_claimed_at` — column-level revoke) |
| `workspaces` | `can_access_workspace(id)` | insert via `create_workspace()`; update owner/admin; delete owner (soft) |
| `workspace_members` | `can_access_workspace(workspace_id)` | owner/admin manage; a user may delete own membership. **Superseded — see Part 04 §9.5, §12.2–§12.4 (errata E-R12):** no `update` grant and no `update` policy for `authenticated`; role changes only through RPC `change_member_role` (seat check under the billing-row lock); insert only via `accept_invite`; owner/admin delete and self-delete never touch the `owner` row |
| `workspace_invites` | owner/admin of ws | owner/admin |
| `business_profiles`, `brand_kits`, `pronunciation_entries`, `workspace_hooks`, `hook_favorites` | `can_access_workspace` (favorites: own) | editor+ (`has_role(ws, '{owner,admin,editor}')`) |
| `projects`, `project_versions`, `scenes` | `can_access_workspace` | editor+ insert/update; owner/admin delete; versions immutable (no update). **`scenes` superseded — see Part 04 §12.2–§12.4, §19.6 (errata E-R7):** SELECT only (`scenes_select`); no insert/update/delete grant or policy for `authenticated`; scenes are written only server-side (secret client) by the Part 04 §19.6 routes and the Part 05 steps |
| `assets` | `can_access_workspace` | insert only for `kind in (logo, brand_image, upload_image, upload_video)` by editor+; all generated kinds service-only |
| `jobs`, `job_steps`, `render_runs`, `ai_generations` | `can_access_workspace` (ai_generations: owner/admin only) | service-only |
| `credit_grants`, `credit_reservations`, `credit_ledger`, `workspace_balances` | `can_access_workspace(billing_workspace_id(ws))` for owner/admin; balances readable by all members | service-only |
| `subscriptions`, `payment_methods` (no `token_enc` column grant), `payments`, `invoices`, `billing_profiles`, `checkout_sessions`, `refund_requests` | owner/admin of billing workspace | service-only (billing_profiles: owner/admin update) |
| `share_links`, `approvals` | `can_access_workspace` | editor+ create/revoke links; approvals inserted service-side from token route |
| `notifications` | own | update own (`read_at`) |
| `consents` | own | insert own; service for anonymous. **Superseded — see Part 04 §12.2–§12.4, §21.4 (errata E-R10):** no insert grant and no insert policy (`consents_select_own` only); every row, signed-in or anonymous, is written server-side by `recordConsent()` |
| `niche_categories`, `niches` (`is_active`), `hook_families`, `hook_types`, `seasons`, `hooks` (`status='published'`), `templates` (`is_public`), `examples` (`is_published`), `music_tracks` (`is_active`), `plans` (`is_public`), `credit_packs` (`is_active`), `credit_costs`, `voices` (`is_active`) | **anon + authenticated** | platform admin only |
| `model_registry`, `model_routes`, `app_settings`, `feature_flags`, `audit_logs`, `webhook_events`, `trial_claims`, `contact_messages`, `data_requests`, `email_suppressions` | platform admin (none for others) | service/admin |
| `realtime.messages` | topic `job:{id}` → job's workspace `can_access_workspace`; topic `workspace:{id}` → `can_access_workspace(id)` (uses `realtime.topic()`) | none (server broadcasts via trigger) |

### 5.6 Storage buckets & paths
| Bucket | Public | Max file | Writers | Path convention |
|---|---|---|---|---|
| `brand-assets` | no | 20 MB (png, jpeg, webp, svg) | editor+ (signed upload) | `{workspace_id}/brand/{kit_id}/{asset_id}.{ext}` |
| `uploads` | no | 500 MB (mp4, mov, jpeg, png, webp, heic) | editor+ (signed upload; TUS > 6 MB) | `{workspace_id}/uploads/{asset_id}.{ext}` |
| `generated` | no | — | service only | `{workspace_id}/{project_id}/keyframes/{scene_id}-{attempt}.png` · `/clips/{scene_id}-{attempt}.mp4` · `/voice/v{version}.mp3` · `/music/{asset_id}.mp3` · `/captions/v{version}.json` |
| `renders` | no | — | service only | `{workspace_id}/{project_id}/{job_id}/{aspect}.mp4` (aspect as `9x16`, `1x1`, `16x9`) · `poster.jpg` · `captions.srt` · `captions.vtt` |
| `public-media` | **yes** | — | admin/service | `examples/{id}.mp4` · `hooks/{hook_id}.mp4` · `niches/{slug}/cover.avif` · `music-library/{mood}/{id}.mp3` · `og/{type}/{slug}.png` · `voices/{voice_id}.mp3` |
| `exports` | no | — | service | `{user_id}/{request_id}.zip` (7-day TTL) |

Storage RLS on `storage.objects`: SELECT where `can_access_workspace((storage.foldername(name))[1]::uuid)` for private buckets; INSERT for `brand-assets`/`uploads` only by editor+ of that workspace. Signed URLs: viewing 1 h; inputs passed to OpenRouter or the renderer 6 h (longer than any render) [R:05 §6.3].

### 5.7 Scheduled jobs
pg_cron (SQL only, UTC): `expire-credit-grants` `15 21 * * *`; `refresh-hook-popularity` `*/30 * * * *`; `purge-webhook-payloads` `0 3 * * 0` (null payloads older than 90 days); `expire-share-links` `0 4 * * *`; `mark-retention` `20 3 * * *` (flags free-plan renders > 90 days and soft-deleted projects > 30 days; storage deletion done by `/api/cron/cleanup`). HTTP jobs run on Vercel Cron (§4.5).

### 5.8 Seeds
`pnpm db:seed` runs `supabase/seed/seed.ts` (tsx, secret key): validates each JSON with Zod against the canonical shapes, then upserts in order `hook_families → niche_categories → niches → hook_types → seasons → hooks → plans → credit_packs → credit_costs → model_registry → model_routes → voices → music_tracks → templates → app_settings → feature_flags`. Idempotent; unknown FK values abort with a list. Canonical seed shapes (Appendices A–C produce these files; field names are fixed):
- `niches.json`: `{ slug, name_he, name_en, category_slug, icon, description_he, video_types_he, seasonal_angles_he, compliance_flag, compliance_note_he, priority, sort_order }`
- `niche_categories.json`: `{ slug, name_he, name_en, sort_order }`
- `hook_types.json`: `{ slug, name_he, name_en, family_slug, description_he, example_he, sort_order }`
- `hooks.json`: `{ id, niche_slug, hook_type_slug, text_he, platforms, goal, gender, visual_direction_he, placeholders, season_slug, compliance_note_he, is_featured }`
Seeds also include §10 plans/packs/costs, §7.1 model registry + routes, and empty-but-valid `voices`/`music_tracks` (admin populates; UI handles zero rows gracefully with a "no voice" option and an admin warning).

---

## 6. Generation pipeline

### 6.1 Orchestration decision
**Default: Vercel Workflows (Workflow DevKit) for durable orchestration + Remotion rendered on Vercel Sandbox (`@remotion/vercel`).** Both are documented, Vercel-native and satisfy the user's "Vercel + Supabase" constraint with no third compute vendor: Workflows is GA since 2026-04-16 with `"use workflow"`/`"use step"` and automatic step retries, steps can run up to 30 min on Pro (opt-in) [R:05 §3.3 corrected]; Sandbox runs up to 5 h on Pro with 2–32 vCPU and Remotion officially ships `@remotion/vercel` + a template [R:05 §3.3, §5.1]. Trigger.dev v4 was the research's first pick mainly for long CPU-heavy tasks and ffmpeg [R:05 §4.2]; with the render moved to Sandbox, the remaining pipeline is I/O-bound (LLM calls, async video jobs, downloads), which Workflows handles, so Trigger.dev is **not clearly better** here. It stays the documented alternative behind the same interface.

```ts
// lib/orchestrator/types.ts
export interface JobOrchestrator {
  name: "vercel-workflow" | "inline" | "trigger";
  start(jobId: string): Promise<{ runId: string }>;               // starts videoPipeline(jobId)
  resume(token: string, payload: ExternalEvent): Promise<void>;     // completes a waiting hook (clip / render)
  cancel(jobId: string, runId: string): Promise<void>;
}
// lib/render/types.ts
export interface RenderProvider {
  name: "vercel-sandbox" | "lambda" | "local";
  render(input: RenderInput, onProgress: (p: number) => Promise<void>): Promise<RenderResult>; // uploads to Supabase `renders`
}
```
- `ORCHESTRATOR=vercel-workflow` (prod) | `inline` (tests/local: runs steps sequentially in-process; hooks resolved by polling). `RENDER_PROVIDER=vercel-sandbox` (prod) | `local` (dev: `@remotion/renderer` on the developer machine) | `lambda` (scale-out, eu-central-1, never `il-central-1` [R:05 §5.1]).
- [M0-verify] WDK APIs used: `"use workflow"`, `"use step"`, `sleep()`, `createHook({ token })` + `resumeHook(token, payload)` (or `createWebhook()`), `FatalError`/`RetryableError`, `start()` from `workflow/api`, `withWorkflow()` in `next.config.ts`. If hook APIs differ, keep semantics: a step waits for an external event identified by a deterministic token, with a durable-sleep polling fallback.
- [M0-verify] `@remotion/vercel` API (`renderMediaOnVercel()` + `onProgress`, Blob output). The render step is configured for the extended 30-min duration. Output is copied to Supabase `renders` and the temporary Blob deleted.

### 6.2 Project state machine (`projects.stage`)
```
draft ──(wizard steps business/niche/goal/hook saved)──► brief
brief ──(POST /script ok)──► script ──(POST /storyboard ok)──► storyboard
storyboard ──(POST /generate → job running)──► voice ──► captions ──► assets ──► render ──► done
any of voice|captions|assets|render ──(job failed, credits refunded)──► failed ──(retry)──► voice
done ──(user edits text/reorders → new version)──► storyboard ──(rerender / regenerate_scene)──► … ──► done
```
Execution order rationale [design]: voice and captions run **before** expensive clips because (a) the measured VO timing sets each scene's final duration, so clips are requested at the right length, and (b) cheap failures (TTS) surface before money is spent on video. Keyframe images start in parallel with voice to save wall-clock time; `projects.stage` shows the earliest unfinished stage. `jobs.stage` is the finer-grained machine.

### 6.3 Job state machine (`jobs.status` / `jobs.stage`)
```
queued ─► running(stage: voice ─► captions ─► keyframes* ─► clips ─► music ─► render ─► finalize) ─► succeeded
               │                      (*keyframes start at t0 in parallel)        
               ├─ waiting_external (stage clips|render, while awaiting OpenRouter/Sandbox events)
               ├─ failed   (non-recoverable error or timeout → refund_reservation)
               └─ canceled (user cancel → capture completed steps, settle remainder)
```
Progress weights: voice 10 · captions 5 · keyframes 15 · clips 45 · music 5 · render 18 · finalize 2 (`jobs.progress` = weighted sum of finished/partial steps).

### 6.4 Start (`POST /api/projects/[id]/generate`)
1. Validate plan limits (duration, quality tier, formats, concurrency `limits.concurrent_jobs`, daily cap), election/quiet-day policy (§12.5), moderation verdict cached on the version.
2. `estimate = lib/pipeline/estimate.ts(version, formats, quality, visualMix)` from `credit_costs` (§10.4) — identical function powers the UI cost badge. VO length is estimated from word count ÷ `hebrew_wps`; clip seconds from scene durations rounded up to the model's supported durations. Captures never exceed the reservation: if actual usage is higher (e.g. longer VO), the difference is absorbed, never charged afterwards.
3. Insert `jobs` (`idempotency_key` from header; a duplicate key returns the existing job, HTTP 202) → `reserve_credits(billing_ws, estimate, job.id, 'reserve:'||job.id)` → `orchestrator.start(job.id)` → store `run_id`. On `INSUFFICIENT_CREDITS` return 402 with `{ needed, balance }` and the UI opens the top-up dialog.

**Canonical idempotency keys** (`lib/idempotency.ts`): job `Idempotency-Key` header → `jobs.idempotency_key`; ledger `reserve:{jobId}` · `capture:{jobId}:{stepKey}` · `settle:{reservationId}` · `refund:{reservationId}` · `refund:{jobId}:{stepKey}` (partial) · `spend:{requestKey}` · `grant:trial:{userId}` · `grant:plan:{subscriptionId}:{periodStartISO}` · `grant:pack:{paymentId}` · `grant:admin:{auditLogId}` · `expire:{grantId}`; steps unique `(job_id, step_key)`; webhooks unique `(provider, external_id)` (OpenRouter `X-OpenRouter-Idempotency-Key`, gateway transaction ID); payments unique `(provider, provider_txn_id)`.

### 6.5 Steps (inside `videoPipeline(jobId)`; each `"use step"`, idempotent, skip if `job_steps.status='succeeded'`)
| Step key | Input | Output | Route (§7.1) | Timeout | Retries | Credits (capture) |
|---|---|---|---|---|---|---|
| `voice` | `script.vo_tts_he`, voice, speed, pronunciation dictionary applied | `generated/…/voice/v{n}.mp3`, duration | `tts.default` (fallback `tts.alt`) | 120 s | 3 (exp. backoff 2/8/30 s) | `voice.tts` × ceil(sec/15) |
| `captions` | VO audio + known script words | `CaptionTrackV1` in `project_versions.caption_track`; scene `start_ms/duration_ms` | `stt.default` (`verbose_json`), fallback deterministic alignment | 120 s | 2 | 0 |
| `keyframe:{sceneId}` | `image_prompt_en` + brand palette hint + aspect, **no text** | PNG in `generated/…/keyframes` | `image.{tier}` | 120 s | 2 (then fallback model) | `image.{tier}` |
| `clip:{sceneId}` | keyframe signed URL as `frame_images[0]` (`first_frame`), `motion_prompt_en`, duration = smallest supported ≥ scene duration (cap at model max), resolution per tier, aspect, `generate_audio:false`, `callback_url` | MP4 re-hosted in `generated/…/clips` | `video.{tier}` | submit 30 s; await 15 min per attempt | 1 resubmit on `failed/expired` with next fallback model; then **degrade** | `clip.{tier}` × billed seconds |
| `music` | library track by mood, or Lyria prompt from mood/BPM | MP3 asset | `music.default` (only if `music_mode='generate'`) | 180 s | 2 | `music.generate` or 0 |
| `render:{aspect}` | `PromoProps` (§8.2) with 6 h signed URLs | MP4 in `renders`, `render_runs` row | `RenderProvider` | 20 min | 1 | `render.base` (first) / `render.extra_format` |
| `finalize` | outputs | poster (`renderStill` at 1.2 s), SRT + VTT, asset rows, `settle_reservation`, notifications, analytics | — | 60 s | 3 | 0 |

Concurrency inside a job: keyframes 4 in parallel; clip submissions 3 in parallel (respect OpenRouter 429 with backoff). Global per-workspace concurrency via `limits.concurrent_jobs`.

**Degradation rule** (never fail the whole video for one clip): after the retry with a fallback model fails, the scene switches to `ai_image_kenburns` using its keyframe, `scenes.status='degraded'`, the clip's credits are refunded with `refund_credits`, and the project page shows "סצנה 4 נבנתה מתמונה בתנועה במקום וידאו. הקרדיטים על הקליפ הוחזרו." A job fails only if voice (with `no_voice=false`), all keyframes of > 50% scenes, or the render fails after retries.

### 6.6 OpenRouter video: submit, webhook, re-host
- Submit `POST https://openrouter.ai/api/v1/videos` with `{model, prompt, duration, resolution, aspect_ratio, generate_audio:false, frame_images:[{type:"image_url", image_url:{url}, frame_type:"first_frame"}], callback_url, seed?}` → HTTP 202 `{id, polling_url, status:"pending"}`. Store `provider_job_id` **immediately**; never auto-resubmit after an ambiguous network timeout (a submit spends money) — instead poll by ID if one was returned, else mark the step failed and let the retry policy decide [R:04 §3.1].
- `callback_url = ${SITE_URL}/api/webhooks/openrouter/video?t=${hmac(OPENROUTER_CALLBACK_TOKEN_SECRET, stepId)}&s=${stepId}` (defence in depth on top of the signature [R:05 §11.4]).
- Webhook handler: read **raw body** → verify `X-OpenRouter-Signature` with `OPENROUTER_WEBHOOK_SECRET` (HMAC-SHA256; documented format `t=<ts>,v1=<hex>`; 5-min replay window [M0-verify against the official cookbook and record the exact signed string]) → verify `?t` token → insert `webhook_events(provider='openrouter', external_id = X-OpenRouter-Idempotency-Key)`; duplicate → `204` → `orchestrator.resume('or-video:'+videoId, {status})` → `204`. Handles all terminal statuses `completed | failed | cancelled | expired` [R:04 §3.1].
- Fallback: the step's durable wait races a polling loop (`GET polling_url` resolved against `https://openrouter.ai`, every 30 s after the first 3 min); `/api/cron/sweep-jobs` also polls `waiting_external` clip steps older than 5 min and resumes them.
- Re-host: `GET /api/v1/videos/{id}/content?index=0` **with `Authorization: Bearer`** (URLs are not presigned) → stream/buffer → upload to `generated/{ws}/{project}/clips/{sceneId}-{attempt}.mp4` (content-type check `video/*`, size ≤ 200 MB) → probe with `@remotion/media-parser` → `assets` row → `scenes.clip_asset_id`. Never give OpenRouter URLs to the browser or renderer [R:04 §3.1, R:05 §11.3].
- Keyframe URLs sent in `frame_images` are Supabase **signed URLs (6 h)**; they must return 200 with an image content type, no redirects [R:04 §3.1].

### 6.7 Images, audio, music specifics
- Images: `POST /api/v1/images` `{model, prompt, aspect_ratio, resolution:"1K"}` — **always set resolution explicitly** (billing gotcha) — decode `data[0].b64_json` server-side, upload, never return base64 to the browser (4.5 MB limit) [R:04 §2.1, R:05 §3.2]. Gemini image models may be called via chat `modalities:["image","text"]` + `image_config.image_size` if `/images` rejects them [M0-verify].
- TTS: `POST /api/v1/audio/speech` `{model, input, voice, response_format:"mp3"}` → raw bytes. Inputs > 9,000 chars are split on sentence boundaries (Eleven v4 max 10,000 chars) [R:04 §4.1].
- STT: `POST /api/v1/audio/transcriptions` JSON `{model:"elevenlabs/scribe-v2", input_audio:{data:<base64 no prefix>, format:"mp3"}, language:"he", response_format:"verbose_json"}` [R:04 §7.6 corrected]. Word shape is unverified → `lib/captions/align.ts` normalizes any of `words[] | segments[].words[]` and **aligns recognized words to the known script tokens** (Levenshtein on normalized Hebrew without niqqud/punctuation); missing timestamps are interpolated by character length; if STT fails entirely, distribute the VO duration across script words proportionally to character count (`source: "alignment_fallback"`).
- Music: `google/lyria-3-pro-preview` via chat completions with audio output [M0-verify call shape]; trimmed/faded in Remotion. Library tracks are pre-generated by admin (≈ 60 tracks × $0.08) and reused for free [R:04 §4.3].

### 6.8 Cost tracking
Every OpenRouter call writes `ai_generations` with `usage.cost` (always present for chat; optional for images; video cost read from poll body if present) — missing cost ⇒ `cost_usd = NULL` and `cost_estimated_usd` from `model_registry.pricing` × units [R:04 §1.7]. Deprecated `usage:{include:true}` is never sent. Attribution headers on every request: `HTTP-Referer: https://{{DOMAIN}}`, `X-OpenRouter-Title: {{BRAND_NAME_EN}}` [R:04 §1.2]. `jobs.cost_usd_total` = sum of step costs; admin `/admin/costs` shows COGS vs captured credits per job.
**Budget guard:** before any media call, `lib/ai/cost.ts#assertBudget()` sums today's `ai_generations` cost; above `openrouter_daily_budget_usd` new jobs return `503 BUDGET_GUARD` (running jobs continue) and an alert email goes to admins.

### 6.9 Progress to UI
DB trigger `broadcast_job_change()` sends to private channels `job:{jobId}` (events `job.updated`, `step.updated`, `scene.updated`) and `workspace:{workspaceId}` (`job.updated` for dashboard queue); the client calls `supabase.realtime.setAuth()` before subscribing; TanStack Query polls `GET /api/jobs/[id]` every 5 s whenever the socket is not `SUBSCRIBED` [R:05 §6.4]. Payloads carry only ids, statuses, progress, stage, and asset ids (clients fetch signed URLs via `/api/assets/[id]/url`).

### 6.10 Cancellation, sweeper, failure
- Cancel: `jobs.canceled_at` set → workflow checks between steps → in-flight OpenRouter jobs are left to finish (no cancel API assumed) but results discarded; captured = completed steps; `settle_reservation`.
- `/api/cron/sweep-jobs` (every minute): (1) clip steps `waiting_external` > 5 min → poll & resume; (2) jobs with `heartbeat_at` older than 10 min while `running` → ask orchestrator for run status; if dead, restart from the first unfinished step (idempotent) once, then fail; (3) jobs running > 60 min → `failed` with `PROVIDER_TIMEOUT`.
- Failure: `jobs.status='failed'`, `error_code`, Hebrew `error_message_he`, `refund_reservation` (100% of the job's credits) [R:01 §11], email `video_failed_refunded`, in-app notification, project `stage='failed'`. Retry creates a new job that re-uses every succeeded asset (no double OpenRouter spend).
- Per-scene regenerate (`regenerate_scene`): reserves only that scene's keyframe/clip + one re-render; on failure refunds that reservation.

### 6.11 Hook variants (A/B)
Selecting N hooks (≤ `limits.hook_variants_max`) in the wizard creates N sibling projects sharing `variant_group_id` (the first is the primary). The storyboard is generated once; each variant gets its own hook scene (on-screen hook, hook VO line, hook visual) while non-hook scenes **re-use the primary's keyframe/clip assets** (asset IDs copied; no new AI media). Extra-variant cost = hook scene image/clip + full VO + captions + render — shown as "3 הוקים = 3 גרסאות · +N קרדיטים" before confirming. Variant jobs start only after the primary job's non-hook clips succeed.

### 6.12 Interactive (non-job) AI calls
Script, storyboard, hook variations, brand extraction and scene rewrites run in Route Handlers (Node, `maxDuration` 300 s with a 240 s internal deadline) with AI SDK streaming; they use `begin_spend` → model call → persist → `commit_spend` with an idempotency key and `refund_reservation` on failure. Moderation (`moderation.brief.v1`, cheap model) runs on the brief and on generated script text before storyboard; a block returns `MODERATION_BLOCKED` with a Hebrew reason.

---

## 7. AI layer and contracts

### 7.1 Model registry defaults (`model_routes` seed) — slugs verified in [R:04 §9.13]
All calls go through OpenRouter (`https://openrouter.ai/api/v1`) with one server-side key. `model_registry` is synced daily from `GET /api/v1/models` and `GET /api/v1/videos/models` (`/api/v1/images/models` if available) by `/api/cron/sync-models`; the sync **never auto-enables** a model and flags deprecations (e.g. Sora removed 2026-09-24) [R:04 §0.2]. Admin edits routes in `/admin/models`. Users see quality tiers (טיוטה / סטנדרט / פרימיום), not model names, unless they open "מתקדם" [R:03 §c.10].

| task_key | Primary | Fallbacks (`models[]` for chat; sequential for media) | Params / unit cost (list) |
|---|---|---|---|
| `llm.script` | `anthropic/claude-sonnet-5.5` | `openai/gpt-6.1-sol`, `google/gemini-3.8-flash` | json_schema strict, `provider.require_parameters:true`, temp 0.8; $2/$10 per M tok |
| `llm.storyboard` | `anthropic/claude-sonnet-5.5` | `openai/gpt-6.1-sol`, `google/gemini-3.8-flash` | temp 0.5 |
| `llm.hooks` | `anthropic/claude-sonnet-5.5` | `openai/gpt-6.1-sol`, `google/gemini-3.8-flash` | temp 0.9 |
| `llm.premium` | `anthropic/claude-opus-5` | `anthropic/claude-sonnet-5.5` | used for script/storyboard when `quality_tier='premium'`; $5/$25 |
| `llm.cheap` | `google/gemini-3.8-flash` | `openai/gpt-6.1-sol` | moderation, brand extraction, TTS normalization, emphasis, SEO drafts; $0.75/$3.75 |
| `llm.batch` | `google/gemini-3.8-flash:batch` (dated form `google/gemini-3.8-flash-20260902:batch`) | — | admin bulk hook generation via Batch API (beta, text-only; ≈ half price) [R:04 §1.8] |
| `image.draft` | `google/gemini-3.1-flash-lite-image` | `google/gemini-3.1-flash-image` | 1K, aspect per project |
| `image.standard` | `google/gemini-3.1-flash-image` | `google/gemini-3.1-flash-lite-image` | 1K; ≈ $0.067/image |
| `image.premium` | `google/gemini-3-pro-image` | `google/gemini-3.1-flash-image` | 2K; ≈ $0.134/image |
| `video.draft` | `google/veo-3.1-lite` | `alibaba/wan-3.0`, `bytedance/seedance-2.0-fast` | 720p, no audio; $0.03/s |
| `video.standard` | `kwaivgi/kling-v3.0-std` | `bytedance/seedance-2.0`, `google/veo-3.1-fast` | 720p, no audio, 3–15 s, 9:16/1:1/16:9; $0.084/s |
| `video.premium` | `google/veo-3.1` | `kwaivgi/kling-v3.0-pro`, `google/veo-3.1-fast` | 1080p, no audio; $0.20/s |
| `tts.default` | `elevenlabs/eleven-v4` | `google/gemini-3.8-flash-tts` | Hebrew `heb`; list ≈ $80/M chars |
| `tts.preview` | `elevenlabs/eleven-v4-turbo` | `google/gemini-3.8-flash-tts` | half the v4 rate |
| `tts.alt` | `google/gemini-3.8-flash-tts` | — | $0.50/$9 per M tok |
| `stt.default` | `elevenlabs/scribe-v2` | (deterministic alignment) | `verbose_json`; ≈ $0.004/min list |
| `music.default` | `google/lyria-3-pro-preview` | (library track) | $0.08/song |
| `avatar.default` (flag) | `heygen/avatar-iv` | — | $0.05/s; own Hebrew audio input |

Notes: (1) **ElevenLabs is 50% off on OpenRouter only until 2026-10-19 08:00 PT** — all credit math uses list prices [R:04 §0.1, §9.6]. (2) Kling native audio excludes Hebrew → `generate_audio:false` everywhere; Hebrew VO is always our TTS [R:06 §6.1]. (3) Durations/aspects per model come from `capabilities.supported_durations/aspect_ratios`; out-of-range requests are rejected before submit. (4) Run the native-speaker blind test (20 briefs) on script models before launch [R:04 §1.9]. (5) Pin exact slugs, never `~…-latest` aliases [R:04 §1.5].

Client code: `lib/ai/aisdk.ts` (AI SDK v6 + `createOpenRouter({ apiKey, headers })`, model settings carrying `models` fallbacks and `provider.require_parameters` via provider options/extraBody [M0-verify]); `lib/ai/openrouter/*.ts` typed fetch for media; every call goes through `lib/ai/registry.ts#route(taskKey)` and `lib/ai/cost.ts#record()`.

### 7.2 Prompt templates (IDs are canonical; P5 writes the full Hebrew text)
Each template lives in `lib/ai/prompts/{id}.ts` exporting `{ id, version, taskKey, schemaName, system, buildUser(input) }`. The shared style guide is a cached system block (Anthropic `cache_control: ephemeral`) [R:04 §1.6].

| ID | Task key | Output schema | Purpose |
|---|---|---|---|
| `sys.hebrew_style.v1` | — | — | Shared Hebrew copy rules (§7.4), prepended to all creative prompts |
| `brand.extract.v1` | `llm.cheap` | `BrandProfileV1` | Website/Instagram text + meta → business profile, services, tone, colors guess |
| `moderation.brief.v1` | `llm.cheap` | `ModerationV1` | Policy check on brief/script (political, public figures, minors, sexual, hate, medical promises) |
| `hooks.generate.v1` | `llm.hooks` | `HookBatchV1` | 6–10 hooks for a project (≥ 6 distinct types per 10) [R:07 §B6] |
| `hooks.inflect.v1` | `llm.cheap` | `{ variants: [{gender, text_he}] }` | Re-inflect a hook to plural/female/male and speaker gender |
| `hooks.library_batch.v1` | `llm.batch` | `HookBatchV1` | Admin bulk generation per niche → review queue (status `draft`) |
| `script.generate.v1` | `llm.script` / `llm.premium` | `ScriptV1` | Brief + hook + facts → script beats, VO, on-screen text, CTA |
| `storyboard.generate.v1` | `llm.storyboard` / `llm.premium` | `StoryboardV1` | Script → scenes with English visual prompts, sources, timing |
| `scene.rewrite.v1` | `llm.script` | `{ vo_he, onscreen_text_he }` | Shorter / more energetic / more formal / custom |
| `tts.normalize.v1` | `llm.cheap` | `{ vo_tts_he }` | Only if digits/Latin remain in `vo_tts_he` |
| `captions.emphasis.v1` | `llm.cheap` | `{ pages: [{index, emphasis_word_indices}] }` | One keyword per caption page |
| `post.caption.v1` | `llm.script` | `{ post_caption_he, hashtags_he }` | Regenerate social post text |
| `seo.niche_intro.v1` | `llm.script` | `{ seo_title_he, seo_description_he, seo_intro_he, faq }` | Admin drafts; human review before publish |
| `edit.chat.v1` (v2) | `llm.script` | `EditPlanV1` | Natural-language edits → diff on scenes |

### 7.3 JSON Schemas (strict-mode compatible: every object `additionalProperties:false`, every property required, nullability via type unions; numeric ranges in descriptions because some providers ignore `minimum/maximum` [R:04 §1.3]; always re-validate with Zod)

**`script_v1`** (`ScriptV1`)
```json
{"type":"object","additionalProperties":false,
 "required":["title_he","video_type","goal","structure","target_duration_sec","audience_gender","voice_gender","register","hook","beats","cta","vo_full_he","vo_tts_he","post_caption_he","hashtags_he","compliance"],
 "properties":{
  "title_he":{"type":"string","description":"Internal project title, max 60 chars"},
  "video_type":{"type":"string","enum":["brand_promo","reel_hook","offer","testimonial","launch","recruiting","explainer"]},
  "goal":{"type":"string","enum":["awareness","leads","sales","trust","engagement"]},
  "structure":{"type":"string","enum":["hpspc","aida","pas","bab","result_first","brand_story"]},
  "target_duration_sec":{"type":"integer","enum":[15,30,45,60]},
  "audience_gender":{"type":"string","enum":["plural","female","male"]},
  "voice_gender":{"type":"string","enum":["male","female"]},
  "register":{"type":"string","enum":["formal","warm","casual","slang"]},
  "hook":{"type":"object","additionalProperties":false,
    "required":["text_he","onscreen_he","hook_type_slug","source_hook_id","visual_direction_he"],
    "properties":{
      "text_he":{"type":"string","description":"Spoken hook, max 12 words, payload first, no greeting, no business name"},
      "onscreen_he":{"type":"string","description":"On-screen hook text, max 8 words, max 2 lines"},
      "hook_type_slug":{"type":"string","description":"One of the 27 hook_types slugs"},
      "source_hook_id":{"type":["string","null"],"description":"hooks.id if adapted from the library"},
      "visual_direction_he":{"type":"string","description":"What we see in the first 3 seconds; motion from frame 1; no text in image"}}},
  "beats":{"type":"array","description":"3-10 beats in timeline order; durations must sum to target_duration_sec ±10%",
    "items":{"type":"object","additionalProperties":false,
      "required":["index","role","vo_he","onscreen_text_he","est_duration_sec","visual_idea_he"],
      "properties":{
        "index":{"type":"integer"},
        "role":{"type":"string","enum":["hook","problem","agitate","solution","proof","offer","cta","brand","story"]},
        "vo_he":{"type":"string","description":"Voice-over line for this beat; empty string if none"},
        "onscreen_text_he":{"type":"string","description":"Max 8 words, max 2 lines; empty string if none"},
        "est_duration_sec":{"type":"number","description":"1.5-12 seconds"},
        "visual_idea_he":{"type":"string","description":"Short Hebrew description of the visual for the user"}}}},
  "cta":{"type":"object","additionalProperties":false,"required":["type","text_he","vo_he"],
    "properties":{
      "type":{"type":"string","enum":["whatsapp","call","link_in_bio","booking","navigate","lead_form","comment_keyword","save_share","visit_site"]},
      "text_he":{"type":"string","description":"End-card text, max 8 words"},
      "vo_he":{"type":"string"}}},
  "vo_full_he":{"type":"string","description":"Full VO as displayed to the user (digits allowed)"},
  "vo_tts_he":{"type":"string","description":"TTS-ready VO: numbers as words with gender agreement, phone digits one by one, acronyms expanded, loanwords in Hebrew letters, optional niqqud on ambiguous words, no brackets, no emojis"},
  "post_caption_he":{"type":"string","description":"Social caption, 1-3 short paragraphs"},
  "hashtags_he":{"type":"array","items":{"type":"string"},"description":"3-8 hashtags, Hebrew or common English"},
  "compliance":{"type":"object","additionalProperties":false,"required":["flags","disclaimers_he","needs_user_facts"],
    "properties":{
      "flags":{"type":"array","items":{"type":"string","enum":["before_after_medical","personal_attributes","results_claim","urgency_must_be_true","testimonial_requires_consent","price_claim","kashrut_claim","financial_disclaimer","legal_disclaimer","minors","political"]}},
      "disclaimers_he":{"type":"array","items":{"type":"string"},"description":"Mandatory on-screen disclaimers for the niche"},
      "needs_user_facts":{"type":"array","items":{"type":"string"},"description":"Placeholders like {מחיר} that the user must fill with real facts or remove"}}}}}
```

**`storyboard_v1`** (`StoryboardV1`)
```json
{"type":"object","additionalProperties":false,
 "required":["aspect_ratio","total_duration_sec","visual_style","scenes","music","end_card"],
 "properties":{
  "aspect_ratio":{"type":"string","enum":["9:16","1:1","16:9"]},
  "total_duration_sec":{"type":"integer","description":"Sum of scene durations, equals the script target ±10%"},
  "visual_style":{"type":"string","enum":["cinematic","ugc","day_in_business","before_after","product","text_motion"]},
  "scenes":{"type":"array","description":"3-12 scenes in order",
   "items":{"type":"object","additionalProperties":false,
    "required":["index","beat_index","duration_sec","visual_source","image_prompt_en","motion_prompt_en","negative_prompt_en","camera","focal_point","onscreen_text_he","text_position","vo_he","transition_in","sfx","kenburns","is_hook_scene","hook_type_slug","user_media_hint_he"],
    "properties":{
     "index":{"type":"integer"},
     "beat_index":{"type":"integer","description":"Index of the script beat this scene illustrates"},
     "duration_sec":{"type":"number","description":"1.5-8 seconds; hook scene 2-3.5 seconds"},
     "visual_source":{"type":"string","enum":["ai_clip","ai_image_kenburns","user_media","user_photo_animated","brand_card","stock_broll"],"description":"Respect the allowed sources list given in the user message"},
     "image_prompt_en":{"type":"string","description":"Photoreal keyframe prompt in English. Must end with: no text, no letters, no logos, no watermark. No real or famous people, no children"},
     "motion_prompt_en":{"type":"string","description":"Camera and subject motion for image-to-video; movement from frame 1"},
     "negative_prompt_en":{"type":"string"},
     "camera":{"type":"string","enum":["static","push_in","pull_out","pan_left","pan_right","tilt_up","tilt_down","handheld","orbit","drone"]},
     "focal_point":{"type":"object","additionalProperties":false,"required":["x","y"],"properties":{"x":{"type":"number","description":"0-1 from left"},"y":{"type":"number","description":"0-1 from top"}}},
     "onscreen_text_he":{"type":"string","description":"Max 8 words; empty string for none"},
     "text_position":{"type":"string","enum":["top","center","bottom","none"]},
     "vo_he":{"type":"string","description":"VO fragment spoken during this scene; concatenation of all scenes equals vo_full_he"},
     "transition_in":{"type":"string","enum":["cut","fade","whip","zoom","slide","wipe","flash"]},
     "sfx":{"type":"string","enum":["none","whoosh","impact","pop","sizzle","click","riser","cash","camera_shutter"]},
     "kenburns":{"type":"string","enum":["zoom_in","zoom_out","pan_start","pan_end","none"]},
     "is_hook_scene":{"type":"boolean"},
     "hook_type_slug":{"type":["string","null"]},
     "user_media_hint_he":{"type":["string","null"],"description":"What the user should upload for this scene if visual_source is user_media"}}}},
  "music":{"type":"object","additionalProperties":false,"required":["mood","energy","bpm_hint","beat_drop_at_sec"],
    "properties":{
      "mood":{"type":"string","enum":["energetic","warm","luxury","funny","calm","inspiring","urban"]},
      "energy":{"type":"string","enum":["low","medium","high"]},
      "bpm_hint":{"type":["integer","null"]},
      "beat_drop_at_sec":{"type":["number","null"]}}},
  "end_card":{"type":"object","additionalProperties":false,"required":["headline_he","cta_type","show_logo","contact_fields"],
    "properties":{
      "headline_he":{"type":"string"},
      "cta_type":{"type":"string","enum":["whatsapp","call","link_in_bio","booking","navigate","lead_form","comment_keyword","save_share","visit_site"]},
      "show_logo":{"type":"boolean"},
      "contact_fields":{"type":"array","items":{"type":"string","enum":["phone","whatsapp","website","address","instagram"]}}}}}}
```
The user message passes `allowed_visual_sources`, `max_ai_clip_seconds` (from plan × `visual_mix`: `images`→0; `smart`→ hook scene + ≤ 50% of duration; `full`→ all), and `has_user_media[]`.

**`hook_batch_v1`** (`HookBatchV1`; items map 1:1 to the canonical `hooks` shape + 2 extras)
```json
{"type":"object","additionalProperties":false,"required":["hooks"],
 "properties":{"hooks":{"type":"array","description":"6-10 hooks; at least 6 distinct hook_type_slug values per 10",
  "items":{"type":"object","additionalProperties":false,
   "required":["text_he","hook_type_slug","secondary_type_slug","platforms","goal","gender","visual_direction_he","placeholders","season_slug","compliance_note_he","why_it_works_he","strength"],
   "properties":{
    "text_he":{"type":"string","description":"Max 12 words; placeholders in {braces} only from the allowed list"},
    "hook_type_slug":{"type":"string"},
    "secondary_type_slug":{"type":["string","null"]},
    "platforms":{"type":"array","items":{"type":"string","enum":["reels","tiktok","shorts","facebook","youtube","whatsapp"]}},
    "goal":{"type":"string","enum":["awareness","leads","sales","trust","engagement"]},
    "gender":{"type":"string","enum":["neutral","plural","male","female"]},
    "visual_direction_he":{"type":"string","description":"What we see in the first 3 seconds"},
    "placeholders":{"type":"array","items":{"type":"string"},"description":"Names without braces, e.g. עיר, שירות"},
    "season_slug":{"type":["string","null"]},
    "compliance_note_he":{"type":["string","null"]},
    "why_it_works_he":{"type":"string","description":"One sentence: the mechanism (e.g. פער סקרנות + מספר ספציפי)"},
    "strength":{"type":"integer","description":"1-5 heuristic hook strength"}}}}}}
```

**`caption_track_v1`** (`CaptionTrackV1`; produced by deterministic code `lib/captions/paginate.ts`, optionally enriched by `captions.emphasis.v1`)
```json
{"type":"object","additionalProperties":false,"required":["language","source","duration_ms","words","pages"],
 "properties":{
  "language":{"type":"string","enum":["he"]},
  "source":{"type":"string","enum":["scribe","alignment_fallback"]},
  "duration_ms":{"type":"integer"},
  "words":{"type":"array","items":{"type":"object","additionalProperties":false,
    "required":["i","text","start_ms","end_ms","confidence","scene_index","is_ltr"],
    "properties":{"i":{"type":"integer"},"text":{"type":"string"},"start_ms":{"type":"integer"},"end_ms":{"type":"integer"},
      "confidence":{"type":["number","null"]},"scene_index":{"type":"integer"},
      "is_ltr":{"type":"boolean","description":"Latin/number token rendered inside a bdi isolate"}}}},
  "pages":{"type":"array","items":{"type":"object","additionalProperties":false,
    "required":["index","start_ms","end_ms","lines","emphasis_word_indices"],
    "properties":{"index":{"type":"integer"},"start_ms":{"type":"integer"},"end_ms":{"type":"integer"},
      "lines":{"type":"array","items":{"type":"array","items":{"type":"integer"}},"description":"1-2 lines of word indices"},
      "emphasis_word_indices":{"type":"array","items":{"type":"integer"}}}}}}}
```
Pagination rules: ≤ 3 words/page for `bold-pop`/`poster-condensed`, ≤ 2 lines × 22 characters otherwise; break at punctuation; page 0.6–2.2 s; never split a number+unit ("₪99", "50%"), a prefix-attached token ("ב-2026"), or a placeholder value; gaps > 400 ms end a page. Words are mapped to `@remotion/captions` `Caption {text,startMs,endMs,timestampMs,confidence}` for the renderer [R:05 §5.1].

**`brand_profile_v1`** (`BrandProfileV1`): `{ business_name, niche_slug_guess: string|null, city: string|null, services: [{name_he, gender: "m"|"f"|null}], usp_he: string|null, tone: "formal"|"warm"|"casual"|"slang", audience_gender: "plural"|"female"|"male", phone: string|null, whatsapp: string|null, address: string|null, colors_hex: string[], logo_url: string|null, facts: [{label_he, value}] }` — facts are suggestions the user must confirm. **`moderation_v1`**: `{ allowed: boolean, categories: ("political"|"public_figure"|"minors"|"sexual"|"hate"|"violence"|"medical_claim"|"financial_promise"|"weapons"|"other")[], reason_he: string|null }`.

### 7.4 Hebrew generation rules (summary; P5 expands into `sys.hebrew_style.v1`)
1. Natural, contemporary Israeli Hebrew written as original copy, never translated; ban list includes "קחו את העסק לשלב הבא", "פתרון חדשני ומקיף", "בעולם של היום", "זה הזמן ל…", "האם ידעת ש…", "אתה לא תאמין", double exclamation marks [R:06 §6.4, R:07 §A7].
2. Address form from `audience_gender` (default plural "אתם/תבדקו"); first-person verbs agree with `voice_gender` ("אני ממליצה"); never slash forms ("הזמן/י") in VO or on screen [R:06 §6.3].
3. Register from `register` preset (formal / warm / casual / slang) with niche defaults (lawyers formal; barbers slang).
4. Hook: payload first, ≤ 12 spoken words, ≤ 8 on-screen words, no greeting, no business name, readable without sound [R:06 §6.6, R:07 §A3].
5. Numbers: on-screen as digits with the brand's ₪ convention; in `vo_tts_he` as words with correct gender agreement ("שלוש שעות", "שלושה ימים"); phone digits one by one; "₪" → "שקלים"/"ש״ח" [R:06 §6.1].
6. Acronyms expanded in VO (עו״ד → עורך דין); loanwords in Hebrew letters in VO, Latin allowed on screen; full spelling (כתיב מלא); typographic geresh/gershayim (׳ ״).
7. **No invented facts**: prices, ratings, review counts, client numbers, guarantees, scarcity only from `business_profiles.facts` or the brief; otherwise use a placeholder listed in `compliance.needs_user_facts` — the wizard blocks generation until each is filled or removed [R:07 §A11].
8. Niche compliance: apply `niches.compliance_flag` rules (no result promises for medical/legal/financial; mandatory disclaimers such as "המידע אינו מהווה ייעוץ" for finance/law; no testimonials for therapists; Meta "personal attributes" → third person) [R:06 §7.9, R:07 §A11].
9. CTA: one clear action, WhatsApp-first for local services [R:07 §A8].
10. Culture: respectful, apolitical; no war/terror humor; no promotional tone on quiet days [R:06 §6.5].
11. Visual prompts in English, photoreal Israeli context where relevant, **never request text in images**, no real/famous people, no minors [R:04 §2.2].
Placeholders follow the dictionary of [R:07 §B4] (`{עיר}`, `{שכונה}`, `{שירות}`, `{מוצר}`, `{מחיר}`, `{סכום}`, `{מספר}`, `{זמן}`, `{חודש}`, `{קהל_יעד}`, `{שם_העסק}`, `{פעולה_שגויה}`, `{מיתוס}`, `{לפני}`, `{אחרי}`); `lib/hebrew/placeholders.ts` applies prefix grammar (ב+ה drop: "ב{עיר}" with "השרון" → "בשרון").

---

## 8. Remotion (video assembly)

### 8.1 Compositions (`remotion/Root.tsx`)
| Composition ID | Size | Use |
|---|---|---|
| `PromoVertical` | 1080×1920 | 9:16 Reels/TikTok/Shorts/WhatsApp Status |
| `PromoSquare` | 1080×1080 | 1:1 feed / Facebook |
| `PromoWide` | 1920×1080 | 16:9 website / YouTube |
| `Animatic` | per `format` | Free preview before generation (gradients in brand colors, scene text, estimated captions, library music, logo) and the landing-page demo wall |
| `PosterStill` | per `format` (Still) | Poster/thumbnail; OG fallback per niche |
| `CaptionStyleSample` | 1080×1080 (loop 3 s) | Caption preset picker thumbnails |

All three Promo IDs render the same component `PromoComposition` with `fps: 30`; `calculateMetadata` sets `durationInFrames` from props (sum of scene durations aligned to VO + end card 2.5 s + 0.3 s tail; targets 15/30/45/60 s, final allowed range target −10%/+20%). The **same components** run in the browser via `@remotion/player` (wizard preview, editor, landing animatic) — zero render cost [R:05 §5.1].

### 8.2 Props (`remotion/schema.ts` → `PromoPropsSchema`, Zod; `lib/render/props.ts` builds it)
```ts
type PromoProps = {
  version: 1;
  format: "9:16" | "1:1" | "16:9";
  fps: 30;
  scenes: Array<{
    index: number; startMs: number; durationMs: number;
    source: { type: "clip" | "image" | "user_video" | "user_image" | "brand_card"; url: string | null;
              kenburns: "zoom_in"|"zoom_out"|"pan_start"|"pan_end"|"none"; focal: { x: number; y: number };
              fit: "cover" | "blur_pad"; playbackRate: number };
    overlayText: { textHe: string; position: "top"|"center"|"bottom"|"none" } | null;
    transitionIn: "cut"|"fade"|"whip"|"zoom"|"slide"|"wipe"|"flash";
    isHookScene: boolean;
  }>;
  hookTitle: { textHe: string; showUntilMs: number } | null;   // frame-0 text hook
  captions: { enabled: boolean; preset: CaptionPresetId; highlightColor: string; pages: CaptionPage[]; words: CaptionWord[]; position: "lower"|"middle" };
  audio: { voUrl: string | null; voVolume: number; musicUrl: string | null; musicBaseVolume: number; musicDuckedVolume: number;
           duckAttackMs: number; duckReleaseMs: number; sfx: Array<{ id: string; atMs: number; url: string; volume: number }> };
  brand: { logoUrl: string | null; colors: { primary: string; secondary: string; accent: string; text: string };
           headingFont: FontId; bodyFont: FontId; lowerThird: "glass"|"solid"|"none"; logoBug: boolean };
  endCard: { durationMs: number; headlineHe: string; ctaType: CtaType; contact: { phone?: string; whatsapp?: string; website?: string; address?: string; instagram?: string }; showLogo: boolean; qrUrl?: string | null };
  aiLabel: { enabled: boolean; textHe: "נוצר באמצעות AI" };
  watermark: { enabled: boolean; textHe: string };             // free plan: "נוצר ב{{BRAND_NAME}}"
  safeZone: { debugOverlay: boolean };
};
```

### 8.3 Layers (bottom → top)
`SceneLayer` (`ClipLayer` for video with `OffthreadVideo`, `KenBurnsImage` for stills, `BrandCard` for text-only scenes; `@remotion/transitions` for `transitionIn`) → color grade & vignette → `HookTitle` (frame 0, never a logo intro) → scene `overlayText` → `CaptionsLayer` → `LowerThird` / `LogoBug` (logo bug after 3 s, optional) → `EndCard` (logo + CTA + contact; logo appears only here) → `AiLabel` (corner tag) → `Watermark` (free plan). `AudioMix`: VO at 1.0; music base 0.35, ducked to 0.12 while words are active (volume callback from caption word timings, 150 ms attack / 400 ms release); SFX 0.6; 300 ms music fade-out.

**Re-framing secondary formats** (clips are generated once, in `primary_aspect`; if a model does not support the primary aspect — e.g. 1:1 — request the nearest supported one, 9:16 for vertical-first or 16:9 otherwise, and re-frame): 9:16 → 16:9 and 9:16 → 1:1 use `blur_pad` (contain + blurred, darkened copy as background); 16:9 → 9:16 uses `cover` with `focal_point`; images always `cover` with focal point. No extra AI cost per extra format, only `render.extra_format` credits.

### 8.4 Caption presets (`remotion/captions/presets.ts`; IDs canonical)
| ID | Hebrew name | Font (Google, OFL) | Look |
|---|---|---|---|
| `bold-pop` | פופ | Heebo 900 | White text, 6 px dark stroke + soft shadow; active word in gold `#FFB547` box with ink text; ≤ 3 words/page; default |
| `clean-box` | קופסה נקייה | Heebo 700 | Text on rounded semi-opaque brand-color box (`box-decoration-break: clone`), active word underline marker |
| `karaoke` | קריוקי | Rubik 800 | All words white; spoken words fill with brand accent progressively (word-level, right-to-left by DOM order) |
| `poster` | פוסטר | Karantina 700 | Huge condensed 1–2 word pages, scale-in per word; for hooks and energetic niches |
| `news` | חדשות | Suez One | Lower-third bar with brand color strip, calm sentence pages; for professional niches (lawyers, accountants, clinics) |
| `soft` | רך | Fredoka 600 | Rounded pastel bubble, gentle pop; for family, kids, bakeries, beauty |
Each preset defines: font family/weight, size per format (9:16: 64–84 px; 1:1: 56–72; 16:9: 48–60), line-height 1.15–1.25, colors (from brand kit where noted), stroke/box, active-word style, entrance animation (≤ 120 ms per word, opacity/scale only), max words per page. Contrast of caption text over background ≥ 4.5:1 is guaranteed by stroke/box, and the brand kit editor warns when brand colors would break it.

### 8.5 RTL / bidi rules in compositions
Root `AbsoluteFill` has `direction: "rtl"`; every text node `unicode-bidi: plaintext`; tokens flagged `is_ltr` (Latin words, numbers, %, ₪ amounts, phone numbers, URLs) are wrapped in `<bdi>`; RLM (U+200F) appended after trailing punctuation that follows an LTR run; **animate per word, never per letter** (final forms ך ם ן ף ץ), `letterSpacing: 0`, no uppercase/italic; line breaks only at word boundaries; no hyphenation; captions centered with max-width 80% and 6% side margins; 9:16 safe zones: hook text between 15% and 55% of height, captions between 62% and 78%, nothing in the bottom 22% or the side action column [R:05 §5.1, R:06 §6.2, R:07 §A7]. A fixture set `tests/fixtures/bidi-strings.json` (e.g. "מבצע Black Friday עד 50%!", "₪199 לחודש", "050-123-4567", "POV: הקבלן אמר 'שבועיים'") is rendered as stills in CI and compared to golden images.

### 8.6 Fonts
`remotion/fonts.ts` loads via `@remotion/google-fonts/{Heebo,Rubik,Karantina,SuezOne,Fredoka,Assistant,SecularOne}` with `subsets: ['hebrew','latin']` and only needed weights; custom brand fonts via `@remotion/fonts` `loadFont({family,url})` only when the workspace attests a video-embedding license (commercial Israeli foundries often lack one) [R:08 §3.2, R:05 §8].

### 8.7 Render settings per plan
| Plan | Resolution | Codec / quality | Formats per generation | Extras |
|---|---|---|---|---|
| free | 720p (`scale` 2/3 of 1080 base) | H.264 `crf 26`, AAC 128 k | 1 (9:16) | Watermark + end slate "נוצר ב{{BRAND_NAME}}" |
| starter | 1080p | H.264 `crf 20`, AAC 192 k | up to 3 | — |
| business | 1080p | H.264 `crf 19`, AAC 192 k | up to 3 | — |
| agency | 1080p | H.264 `crf 18`, AAC 192 k | up to 3 | white-label share pages |
Common: 30 fps, `yuv420p`, `imageFormat: "jpeg"` (quality 85), concurrency = sandbox vCPUs (default 4), `x264Preset: "medium"`, MP4 metadata `comment=ai-generated` if supported [M0-verify]. Poster = `renderStill` at 1.2 s. SRT/VTT generated in Node from `CaptionTrackV1` (no render).

### 8.8 Where it renders
Default `RENDER_PROVIDER=vercel-sandbox` (`@remotion/vercel`, 4 vCPU, timeout 20 min; est. ≈ $0.03–0.08 per 30–60 s render at $0.128/vCPU-h) [R:05 §3.3]. Alternative `lambda` (`renderMediaOnLambda`, region `eu-central-1`, raise concurrency quota first). Local `local` for development and `scripts/render-demo-videos.ts`. Remotion license: free while the company has ≤ 3 employees; afterwards the "Automators" license ($0.01/render, $100/month minimum) — budget it in COGS (§10.5) and pass `REMOTION_LICENSE_KEY` if required [R:05 §5.1].

---

## 9. Environment variables, secrets, flags

`lib/env.ts` validates all variables with Zod at boot (`scripts/check-env.ts` in CI). Server-only modules import `server-only`. `.env.example` lists everything below with Hebrew-free English comments. One OpenRouter key per environment, each with a credit limit [R:04 §1.7].

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | `https://{{DOMAIN}}` (preview: Vercel URL) |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL (eu-central-1) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | `sb_publishable_…` |
| `SUPABASE_SECRET_KEY` | server | `sb_secret_…` (sent as `apikey` header by supabase-js; never in browser) |
| `SUPABASE_PROJECT_REF`, `SUPABASE_DB_URL` | CI only | migrations, type generation |
| `OPENROUTER_API_KEY` | server | single key for all AI |
| `OPENROUTER_BASE_URL` | server | default `https://openrouter.ai/api/v1` |
| `OPENROUTER_APP_URL` / `OPENROUTER_APP_TITLE` | server | attribution headers (`https://{{DOMAIN}}`, `{{BRAND_NAME_EN}}`) |
| `OPENROUTER_WEBHOOK_SECRET` | server | workspace signing secret for video webhooks |
| `OPENROUTER_CALLBACK_TOKEN_SECRET` | server | HMAC for per-step `?t=` tokens (also render callbacks) |
| `OPENROUTER_DAILY_BUDGET_USD` | server | fallback for `app_settings.openrouter_daily_budget_usd` |
| `ORCHESTRATOR` | server | `vercel-workflow` \| `inline` |
| `RENDER_PROVIDER` | server | `vercel-sandbox` \| `lambda` \| `local` |
| `REMOTION_SANDBOX_VCPUS` / `REMOTION_SANDBOX_TIMEOUT_MS` | server | 4 / 1,200,000 |
| `BLOB_READ_WRITE_TOKEN` | server | only if `@remotion/vercel` writes to Vercel Blob |
| `REMOTION_LICENSE_KEY` | server | Remotion company license (when > 3 employees) |
| `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION` (= `eu-central-1`), `REMOTION_LAMBDA_FUNCTION_NAME`, `REMOTION_SERVE_URL` | server | Lambda alternative only |
| `TRIGGER_SECRET_KEY` | server | Trigger.dev alternative only (v2) |
| `PAYMENT_PROVIDER` | server | `grow` \| `mock` (later `cardcom`, `sumit`, `payplus`) |
| `GROW_API_BASE_URL`, `GROW_API_KEY`, `GROW_USER_ID`, `GROW_PAGE_CODE`, `GROW_WEBHOOK_SECRET` | server | names per developers.grow.business [M0-verify]; sandbox in preview |
| `INVOICE_PROVIDER` | server | `morning` \| `mock` |
| `MORNING_API_BASE_URL`, `MORNING_API_KEY_ID`, `MORNING_API_KEY_SECRET` | server | Green Invoice API (sandbox in preview) |
| `APP_ENCRYPTION_KEY` | server | 32-byte base64 key for AES-256-GCM (payment tokens) |
| `RESEND_API_KEY`, `EMAIL_FROM` (`{{BRAND_NAME}} <hello@{{DOMAIN}}>`), `EMAIL_REPLY_TO` | server | email |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | server | rate limiting |
| `CRON_SECRET` | server | Vercel Cron bearer |
| `REVALIDATE_SECRET` | server | on-demand ISR from admin |
| `TRIAL_HASH_PEPPER` | server | pepper for `trial_claims` hashes |
| `ADMIN_EMAILS` | server | bootstrap platform admins on first login |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | mixed | errors + source maps |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (`https://eu.i.posthog.com`) | public | analytics (consent-gated) |
| `SMS_PROVIDER`, `SMS_API_KEY`, `SEND_SMS_HOOK_SECRET` | server | phone OTP via Supabase Send SMS Hook (flag) |
| `FEATURE_*` | server | local overrides of `feature_flags` |
Google OAuth client ID/secret and custom SMTP (Resend) are configured in the Supabase dashboard, not in app env.

Feature flags (`feature_flags` keys): `phone_otp`, `avatar`, `voice_clone`, `stock_broll`, `chat_edit`, `music_generate` (on), `premium_video` (on), `whatsapp_notify`, `annual_billing` (on), `hook_submissions`, `format_4x5`, `maintenance_mode`. Election mode and quiet-day banner live in `app_settings`.

---

## 10. Plans, pricing and credits

### 10.1 Unit-cost basis (list prices, Oct 2026) [R:04 §§1–6]
LLM script+storyboard ≈ $0.03–0.05 per project · image standard $0.067, draft ≈ $0.039 (Nano Banana 2 Lite, $30/M image tokens ≈ 1.3K tokens), premium $0.134 · clip draft $0.03/s, standard $0.084/s, premium $0.20/s · TTS Eleven v4 list ≈ $80/M chars (≈ $0.036 per 30 s VO) · STT ≈ $0.004/min · Lyria $0.08/song · render on Sandbox ≈ $0.03–0.08 + Remotion $0.01 · OpenRouter card top-up fee 5.5% on all AI spend [R:04 §1.7]. FX `fx_usd_ils = 3.70`; VAT 18% (configurable, never hard-coded) [R:05 §7.1].

**Credit rule:** 1 credit ≈ **$0.02 of list COGS including the 5.5% fee**, rounded up per action. Every paid plan sells a credit for ≈ $0.066–0.068 net of VAT ⇒ **≈ 70% gross margin at 100% utilization on monthly plans** (≈ 62–64% on annual), before breakage (unused credits).

### 10.2 Plans (prices in ₪ **including 18% VAT**; `plans` seed)
| id | name_he | Monthly | Annual (per-month equiv., −20%) | Credits | Net/month (÷1.18) | Max COGS (credits × $0.02 × 3.70) | Gross margin (monthly / annual) |
|---|---|---|---|---|---|---|---|
| `free` | חינם | ₪0 | — | 70 one-time (trial) | — | ₪5.2 per signup (CAC) | — |
| `starter` | בסיס | ₪119 | ₪95 (₪1,140/yr) | 400 / month | ₪100.85 | ₪29.6 | 70.6% / 63.2% |
| `business` | עסק (מומלץ) | ₪289 | ₪231 (₪2,772/yr) | 1,000 / month | ₪244.92 | ₪74.0 | 69.8% / 62.2% |
| `agency` | סוכנות | ₪990 | ₪792 (₪9,504/yr) | 3,300 / month | ₪838.98 | ₪244.2 | 70.9% / 63.6% |
Positioning against the market: Starter is cheaper than one pro-edited reel (₪550) [R:06 §2.1]; Business sits in the ₪249–399 band [R:06 §2.6]; Agency within ₪790–1,490; all far below FARO's ₪1,290–2,990 done-for-you [R:06 §2.5]. "≈ N סרטונים בחודש" uses `typical_video_credits = 50` (a 30 s draft-quality reel): Starter ≈ 8, Business ≈ 20, Agency ≈ 66. Agency annual (₪8,054 before VAT) exceeds the ₪5,000 pre-VAT threshold → the invoice requires an **allocation number** (מספר הקצאה) for business buyers [R:06 §7.5].

**Canonical `features_he` (pricing cards; P2 may polish wording but not change facts):**
- `free` **חינם** — "70 קרדיטים לניסיון (כ-2 סרטונים קצרים)" · "איכות טיוטה, 720p, פורמט 9:16" · "סימן מים של {{BRAND_NAME}}" · "גישה מלאה לספריית ההוקים" · "בלי כרטיס אשראי".
- `starter` **בסיס** — "400 קרדיטים בחודש (כ-8 סרטונים)" · "איכות טיוטה וסטנדרט, Full HD" · "3 פורמטים: 9:16, 1:1, 16:9" · "בלי סימן מים" · "קריינות וכתוביות בעברית" · "עד 3 גרסאות הוק לסרטון" · "2 יצירות במקביל".
- `business` **עסק** (badge "מומלץ") — "1,000 קרדיטים בחודש (כ-20 סרטונים)" · "כל רמות האיכות, כולל פרימיום" · "מוזיקה מקורית לכל סרטון" · "עד 5 גרסאות הוק לסרטון" · "3 משתמשים ו-3 ערכות מותג" · "קישורי אישור ללקוח" · "3 יצירות במקביל".
- `agency` **סוכנות** — "3,300 קרדיטים בחודש (כ-66 סרטונים)" · "עד 15 סביבות לקוח, ערכת מותג לכל לקוח" · "10 משתמשים והרשאות" · "דפי שיתוף בלי המיתוג שלנו (White label)" · "קישורי אישור ללקוח" · "6 יצירות במקביל".
- Shared promises under the cards: "קרדיטים שלא נוצלו עוברים לחודש הבא" · "החזר קרדיטים אוטומטי על יצירה שנכשלה" · "ביטול אונליין בכל רגע" · "חשבונית מס לכל תשלום" · "המחירים כוללים מע״מ" · "תשלום בכרטיס אשראי; חבילות קרדיטים גם ב-Bit" (Bit only for one-off pack purchases, if Grow's hosted page supports it [M0-verify]; subscriptions are card-token based).

### 10.3 Plan limits (`plans.limits` keys)
| key | free | starter | business | agency |
|---|---|---|---|---|
| `seats` | 1 | 1 | 3 | 10 |
| `client_workspaces` | 0 | 0 | 0 | 15 |
| `brand_kits` | 1 | 1 | 3 | unlimited (1 per client) |
| `max_duration_sec` | 30 | 60 | 60 | 60 |
| `quality_tiers` | draft | draft, standard | draft, standard, premium | draft, standard, premium |
| `visual_mix` | images, smart (≤ 1 AI clip ≤ 5 s) | all | all | all |
| `max_formats` | 1 | 3 | 3 | 3 |
| `max_resolution` | 720p | 1080p | 1080p | 1080p |
| `watermark` | true (unless `has_paid`) | false | false | false |
| `concurrent_jobs` | 1 | 2 | 3 | 6 |
| `daily_credit_cap` | 70 | 400 | 800 | 2,500 |
| `music_generate` | false | false | true | true |
| `hook_variants_max` | 1 | 3 | 5 | 5 |
| `approval_links` | false | false | true | true |
| `white_label` | false | false | false | true |
| `projects_max` | 3 | unlimited | unlimited | unlimited |

### 10.4 Credit cost table (`credit_costs` seed)
| action_key | credits | unit | COGS check (list, incl. 5.5%) |
|---|---|---|---|
| `script.generate` | 2 | call (incl. 3 hook suggestions) | ≈ $0.03 |
| `storyboard.generate` | 1 | call | ≈ $0.02 |
| `hooks.generate` | 1 | batch of up to 10 | ≈ $0.01 |
| `brand.extract` · `scene.rewrite` · `voice.preview` · `captions.transcribe` · `music.library` | 0 | — (rate-limited) | < $0.01 |
| `image.draft` / `image.standard` / `image.premium` | 2 / 4 / 7 | image | $0.041 / $0.071 / $0.141 |
| `clip.draft` / `clip.standard` / `clip.premium` | 2 / 5 / 11 | billed second | $0.032 / $0.089 / $0.211 |
| `voice.tts` | 1 | started 15 s of VO | ≈ $0.019 |
| `music.generate` | 5 | song | $0.084 |
| `render.base` | 3 (≤ 30 s) / 5 (31–60 s) | first format | ≈ $0.05 / $0.09 |
| `render.extra_format` | 2 (≤ 30 s) / 3 (31–60 s) | each extra format | ≈ $0.04 / $0.06 |
| `avatar.second` (flag) | 3 | second | $0.053 |
Worked examples (shown on `/pricing` as "כמה עולה סרטון"): **reel 15 s "תמונות בתנועה"** (4 standard images) = 3 + 16 + 1 + 3 = **23**; **reel 30 s draft** (6 draft images, 15 s draft clips) = 3 + 12 + 30 + 2 + 3 = **50**; **reel 30 s standard** (6 images, 15 s standard clips) = 3 + 24 + 75 + 2 + 3 = **107**; **סרטון תדמית 60 s premium** (10 premium images, 36 s premium clips) = 3 + 70 + 396 + 4 + 5 = **478**; each extra format +2/+3. Free flow (draft images, ≤ 1 × 5 s draft clip) ≈ 30 credits ⇒ 70 trial credits cover about two short videos in draft quality with a watermark; the claim is worded "{trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי" (Part 02 §3.3).

### 10.5 Rules
- **Top-up packs** (any plan, incl. free): `pack-150` ₪59 · `pack-500` ₪179 · `pack-1500` ₪449 (net per credit $0.090 / $0.082 / $0.069 ⇒ 78% / 76% / 71% margin). Pack credits **never expire**. Buying a pack sets `workspaces.has_paid` (removes watermark).
- **Monthly credits** are granted each billing period (annual plans: monthly grants on the same day each month) with `expires_at = period_end + 1 month` — i.e. unused credits roll over one month ("קרדיטים עוברים לחודש הבא") [R:08 §7.12, R:02 §5.15]. Consumption order: soonest-expiring first.
- **Trial:** 70 credits, once per normalized email (and phone if collected), no card, no automatic conversion (so no "trial ends" charge); watermark until first payment [R:06 §2.6, R:01 §10.4].
- **Refunds of credits:** technical failure ⇒ 100% of the job's credits back automatically; degraded scene ⇒ that clip's credits back; user cancel ⇒ only completed steps charged [R:01 §11].
- **Show cost before every generation** (`CostBadge` "צור · 107 קרדיטים") and confirm in `ConfirmGenerateDialog` [R:02 §5.15].
- Remotion license and infra (Vercel Pro $20/seat, Supabase Pro $25, Upstash, Resend, Sentry, PostHog) are fixed costs tracked outside per-credit COGS.

### 10.6 Subscription lifecycle & Israeli consumer law [R:06 §7.3]
- Checkout on the gateway's hosted page (PCI SAQ-A); we store only the gateway token (encrypted), brand, last4, expiry. Our own billing engine (`lib/billing/engine.ts`) charges tokens on `next_charge_at` via `/api/cron/billing-renewals`; failed charge ⇒ `past_due`, retries at +1 d, +3 d, +7 d, emails each time, then downgrade to `free` (purchased pack credits remain).
- Upgrades apply immediately (prorated charge for the remaining days; new allowance granted pro rata); downgrades at period end.
- **"ביטול מנוי"** is a prominent self-serve button in `/app/billing` and linked from the footer and `/legal/cancellation` (s.14ט "same channel + dedicated link"); also accepted by email/phone (s.13ד). Effect: no further charges (`cancel_at_period_end=true`), access until period end — well inside the 3-business-day stop-charging rule; immediate confirmation email with the cancellation date.
- **14-day distance-sale cancellation** for the first payment of a plan/pack: refund = paid − value of credits consumed (at that plan's per-credit price) − cancellation fee = min(5%, ₪100); computed in `lib/billing/refunds.ts`, shown before confirming; executed via gateway refund + credit invoice (חשבונית זיכוי). A checkbox "אני זכאי/ת לתקופת ביטול מורחבת (4 חודשים)" (people with disabilities, 65+, new immigrants when the deal involved a conversation incl. chat/email) opens a `refund_requests` row for manual handling.
- Promotional periods (coupons, discounted first months — v2): notice email 7 days before the price changes.
- Prices are always displayed incl. VAT with "כולל מע״מ"; B2B toggle on `/pricing` shows "לפני מע״מ" values for businesses only.

### 10.7 Payment & invoice providers (decision)
**Default `PaymentProvider` = Grow** (formerly Meshulam): the only Israeli gateway in the research whose **token billing, managed recurring payments and per-payment-outcome webhooks are verified in official developer docs** [R:05 §7.3], supports Bit and Israeli cards; we run our own billing engine, so we need only hosted tokenization + charge-by-token + refund + webhook. **Default `InvoiceProvider` = Morning (Green Invoice)**: Israeli invoicing leader, REST API with sandbox, issues חשבונית מס-קבלה and requests allocation numbers automatically above the threshold [R:05 §7.3]. Stripe is not available to Israeli entities [R:05 §7.2]. Alternatives (adapters, v2): Cardcom (clearing + built-in documents), Sumit (clearing + recurring + accounting in one vendor), PayPlus (+ Morning).
```ts
interface PaymentProvider {
  createHostedCheckout(i: { sessionId: string; amountIls: number; description: string; customer: BillingCustomer; saveToken: boolean; successUrl: string; cancelUrl: string; webhookUrl: string }): Promise<{ redirectUrl: string; providerSessionRef: string }>;
  chargeToken(i: { tokenRef: string; amountIls: number; description: string; idempotencyKey: string }): Promise<ChargeResult>;
  refund(i: { providerTxnId: string; amountIls: number; reason: string }): Promise<RefundResult>;
  parseWebhook(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent>;   // verify signature or re-query the gateway
}
interface InvoiceProvider {
  issue(i: { doc: "tax_invoice_receipt" | "receipt" | "credit_invoice"; payment: PaymentRecord; customer: BillingCustomer; lines: InvoiceLine[]; vatRate: number; requestAllocationNumber: boolean }): Promise<{ docNumber: string; allocationNumber: string | null; pdfUrl: string; providerDocId: string }>;
}
```
`mock` implementations of both are complete (used in dev, preview and e2e). Every payment webhook is idempotent on `(provider, provider_txn_id)`; a successful payment ⇒ `payments` row → `grant_credits` → invoice issued and PDF copied to Storage → email with the PDF link.

---

## 11. Design system

### 11.1 Direction (decision)
**Direction A "בכורה" (Premiere) — dark cinematic — is the brand, marketing and app default, with a complete light theme** ("אור יום"-inspired paper background + ink text, keeping the gold primary as a button fill) [R:08 §1.3, §6.3]. Why: generated video pops on near-black; gold (not purple) differentiates from global AI-video sites; video editors are conventionally dark. Theme options: `dark` (default) / `light` / `system`, toggle in header utility menu and `/app/settings`, persisted in `profiles.theme` and a cookie (no flash: theme attribute set server-side on `<html data-theme>`). Long-read pages (blog, legal, hooks intros) use a reading width of 68ch and body 18px in either theme.

### 11.2 Color tokens (contrast pre-computed in [R:08 §6.1])
| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--color-bg` | `#08080C` | `#FAF7F2` | page background |
| `--color-surface-1` | `#121219` | `#FFFFFF` | cards, glass nav base |
| `--color-surface-2` | `#1A1A24` | `#F1ECE4` | raised cards, inputs |
| `--color-surface-3` | `#23232F` | `#E9E2D7` | hover/selected |
| `--color-border` | `#2A2A38` | `#E4DDD1` | decorative hairlines only |
| `--color-border-strong` | `#686884` | `#8C8577` | input borders, toggles (≥ 3:1) |
| `--color-text` | `#F5F4F0` | `#16140F` | primary text |
| `--color-text-2` | `#A3A3B5` | `#5A554C` | secondary text |
| `--color-muted` | `#8A8AA0` | `#6F6A60` | meta, captions |
| `--color-primary` | `#FFB547` | `#FFB547` (fill only) | primary CTA fill, focus ring (dark) |
| `--color-primary-hover` | `#FFC56B` | `#FFC56B` | |
| `--color-on-primary` | `#0A0A0F` | `#0A0A0F` | text on gold (11.24:1) |
| `--color-primary-text` | `#FFB547` | `#9A5B00` | gold used as text (light: 5.08:1) |
| `--color-focus` | `#FFB547` | `#1F3DFF` | focus ring (light uses ultramarine for 3:1+ on paper) |
| `--color-rose` | `#FF4F7B` | `#C2185B` | "live/REC", low-credit state, secondary accent |
| `--color-violet` | `#8E7BFF` | `#5B47E0` | AI-generating shimmer, links on dark |
| `--color-success` | `#3DDC97` | `#0B7A53` | |
| `--color-danger` | `#FF6B6B` | `#C62F1D` | |
| `--color-lemon` | `#FFE14D` | `#FFE14D` | "הוק" badges / highlighter (ink text 14.14:1) |
Effects (dark): projector-beam radial gradient `rgba(255,181,71,.18)` top-end; afterglow rose/violet radials; gold gradient text on **one** H1 word ("תדמית"); glass nav `rgba(18,18,25,.6)` + `blur(16px)`; film grain SVG noise at 5% (off under reduced motion/transparency); film-frame video tiles radius 14 px with 1 px inner border `rgba(255,255,255,.08)`; letterbox reveal 2.39:1 → final ratio (900 ms) [R:08 §6.1]. Light theme: no grain, no glow; soft shadows; highlighter marker under key words.

### 11.3 Typography (Google Fonts, OFL; `next/font/google`, `display: swap`)
| Role | Family | Weights | Subsets |
|---|---|---|---|
| UI + body | **Heebo** (variable) → `--font-heebo` | 400, 500, 600, 700, 800, 900 | `hebrew`, `latin` |
| Display (1–3 huge words, numbers) | **Karantina** → `--font-karantina` | 700 | `hebrew`, `latin` |
| Mono (timecodes, IDs) | **JetBrains Mono** → `--font-jetbrains` | 400, 600 | `latin` |
| Video captions (Remotion only) | Heebo, Rubik, Karantina, Suez One, Fredoka, Assistant, Secular One | per preset | `hebrew`, `latin` |
Type scale [R:08 §6.0]: `display clamp(3.25rem,2rem+6vw,7.5rem)/0.98` · `h1 clamp(2.25rem,1.6rem+3vw,4.25rem)/1.08 Heebo 800` · `h2 clamp(1.75rem,1.3rem+2vw,3rem)/1.15 700` · `h3 clamp(1.25rem,1.1rem+0.8vw,1.625rem)/1.25 700` · `body-lg 19px/1.7` · `body 17px/1.7` · `small 15px/1.6` · `micro 13px/1.4 600`. Rules: no `letter-spacing` on Hebrew, no uppercase, no faux italics (`em` = bold), `text-wrap: balance` headings / `pretty` paragraphs, no hyphenation, `tabular-nums` for credits/prices/timers, typographic ׳ ״ [R:08 §3.4]. Paid upgrade path (later): Almoni/Ploni for web only — never burned into videos without a written video license [R:08 §3.2].

### 11.4 Layout, radii, shadows, motion
- Grid 12 columns; marketing max width 1240 px; gutters 24/16 px; section rhythm 96–128 px desktop / 64–80 px mobile; breakpoints 390, 768, 1024, 1280, 1536; aspect tokens `--ar-reel 9/16`, `--ar-feed 4/5`, `--ar-square 1/1`, `--ar-wide 16/9`.
- Radii: `--radius-xs 6px` badges · `--radius-sm 10px` inputs, chips · `--radius-md 14px` cards, video tiles · `--radius-lg 20px` panels, modals · `--radius-xl 28px` hero prompt card · `999px` pills (CTAs, credit meter).
- Shadows (dark): `--shadow-1 0 1px 0 rgba(255,255,255,.04) inset, 0 1px 2px rgba(0,0,0,.6)` · `--shadow-2 0 8px 24px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.05) inset` · `--shadow-3 0 24px 64px rgba(0,0,0,.6)` · `--glow-primary 0 0 0 1px rgba(255,181,71,.5), 0 8px 32px rgba(255,181,71,.25)` · `--glow-ai 0 0 0 1px rgba(142,123,255,.45), 0 0 40px rgba(142,123,255,.2)`. Light: `0 1px 2px rgba(22,20,15,.06)` / `0 6px 20px rgba(22,20,15,.08)` / `0 20px 50px rgba(22,20,15,.12)`.
- Z-layers: base 0, sticky 40, dropdown 50, overlay 60, modal 70, toast 80.
- Motion: "the camera moves, not the furniture". Easing `--ease-out cubic-bezier(.22,1,.36,1)`, `--ease-in-out cubic-bezier(.65,0,.35,1)`, UI spring `{stiffness:380, damping:32}`; durations 120 (hover) / 200 (press) / 320 (panels) / 600 (hero reveals) / 900 ms (letterbox); scroll reveals once, stagger 40–60 ms; horizontal entrance offsets are direction-aware (inline-start = +x in RTL); forbidden: bounce, 3D card spins, per-letter Hebrew animation. `prefers-reduced-motion` **or** the global "עצור אנימציות" toggle ⇒ all motion becomes ≤ 150 ms opacity, autoplay walls show posters, Lenis/GSAP/marquees off [R:08 §6.0–6.1, §4.8].

### 11.5 Components & libraries
shadcn/ui (`radix-nova`, RTL) is the base for all primitives; brand variants via `cva`. Custom shared components (canonical names; P1 defines, P2/P3 reuse): `SkipLink`, `MotionToggle`, `ThemeToggle`, `DirIcon`, `Num` (wraps numbers/prices in `<bdi>` with tabular nums), `Price` (₪ incl. VAT label), `LtrInput` (phone/email/URL/coupon/ID fields `dir="ltr"` + `text-end`), `VideoTile` (visible-only autoplay, poster, pause), `PhoneFrame`, `VideoPlayer` (LTR controls, Hebrew labels, captions track), `CostBadge`, `CreditsMeter`, `EmptyState`, `StatusBadge`, `HookCard`, `HookFilters`, `NicheIcon`, `NichePicker`, `SectionHeading`, `GlowCard`, `LegalPage`, `Breadcrumbs`, `JsonLd`. Marketing: `MarketingHeader`, `AnnouncementBar`, `HeroPromptCard`, `VideoWall`, `EnginesStrip`, `NicheShowcase`, `HowItWorks`, `EditorMath` (`BeforeAfterSlider` + `SavingsCalculator`), `FeatureBento`, `HooksTeaser`, `ShowcaseGallery`, `Testimonials`, `PricingCards`, `CreditCostTable`, `FaqAccordion`, `FinalCtaBand`, `MarketingFooter`, `MobileStickyCta`. App: `AppShell`, `SidebarNav`, `TopBar`, `WorkspaceSwitcher`, `CommandMenu`, `MobileTabBar`, `WizardStepper`, `WizardFooter`, `LivePreviewPhone`, `BrandCard`, `HookPicker`, `ScriptEditor`, `QualityModePicker`, `VisualMixPicker`, `VoicePicker`, `MusicPicker`, `CaptionPresetPicker`, `SafeZoneToggle`, `ConfirmGenerateDialog`, `RenderProgress`, `StageList`, `SceneStrip`, `SceneCard`, `SceneList`, `ScenePropertiesPanel`, `TimelineLite`, `ExportDialog`, `ShareDialog`, `ApprovalPanel`, `BrandKitEditor`, `PronunciationTable`, `LedgerTable`, `PlanCards`, `TopUpDialog`, `CancelSubscriptionFlow`, `InvoiceList`, `MembersTable`, `ClientWorkspacesTable`, `NotificationBell`.
Mirroring rules: mirror back/next arrows, chevrons, steppers, carousels/marquees, sidebar side (start = right); **never** mirror play/pause/seek icons, the video scrubber and editor timeline (wrap in `dir="ltr"`, Hebrew labels), checkmarks, logos, ₪, real-world object icons; numeric charts stay LTR [R:08 §4.2]. Sheet "start" side = `side="right"`; Sonner `dir="rtl"`; Embla `direction:'rtl'`.

### 11.6 Iconography & imagery
lucide-react, 1.5 px stroke, 20/24 px; niche icons from `niches.icon`. Imagery: real-looking Israeli business scenes (hairdresser in Florentin, dental clinic, falafel stand, renovation site), warm practical light, shallow depth of field, always shown inside 9:16 phone frames **with burned-in Hebrew captions** to prove the moat; no AI-rendered Hebrew text in images, no robot/brain clichés, no fake logos/testimonials/counters [R:08 §6.1, §10]. Landing demo wall uses real product renders once available (`examples`), otherwise **Animatic demo videos** rendered by `scripts/render-demo-videos.ts` from the Appendix D sample scripts (brand-color motion graphics + real Hebrew captions + library music) — never stock footage pretending to be output.

### 11.7 Landing page sections (order; P2 writes final copy) [R:08 §7]
`AnnouncementBar` (optional: "חדש: ספריית הוקים בעברית לפי נישה ←") → `MarketingHeader` (logo start · nav: איך זה עובד · נישות · ספריית הוקים · דוגמאות · מחירים · בלוג · end: התחברות + "צרו סרטון בחינם") → **Hero** (start: eyebrow chip, H1 "סרטון **תדמית** מקצועי לעסק שלכם, בלי עורך וידאו.", sub, `HeroPromptCard` = niche combobox + URL field (LTR) + "אין לי אתר" textarea toggle + CTA "צרו את הסרטון הראשון שלי" + "חינם · ללא כרטיס אשראי"; trust row: {trialCredits} קרדיטים לניסיון, בלי כרטיס אשראי · מחירים בשקלים, כולל מע״מ · חשבונית מס על כל תשלום · החזר קרדיטים אוטומטי על יצירה שנכשלה; end: `VideoWall` 3 vertical marquees with pause) → `EnginesStrip` (nominative mention of underlying engines) → `NicheShowcase` (niche chip rail; 3 hook cards + phone frame + 1:1/16:9 variants; `?niche=` in URL) → `HowItWorks` (3 steps, pinned phone on desktop) → `EditorMath` (before/after + savings calculator, default ₪550/reel, footnoted sources) → `FeatureBento` (8 tiles: כתוביות בעברית · קריינות בעברית · ערכת מותג · הוקים לפי נישה · 3 פורמטים · עריכה בסצנות · קרדיטים שקופים · תווית AI ועמידה בכללים) → `HooksTeaser` (2 RTL marquee rows + search → `/hooks?q=`) → `ShowcaseGallery` → `Testimonials` (real only; hidden until real ones exist) → `PricingCards` + `CreditCostTable` → `FaqAccordion` → `FinalCtaBand` → `MarketingFooter` (product, niches, hooks, resources, legal incl. הצהרת נגישות + ביטול מנוי link, newsletter with unchecked consent) → `MobileStickyCta` (72 px; "צרו סרטון חינם" + WhatsApp). LCP element = H1 text (< 2.5 s on 4G); hero media loads after first paint (AVIF posters ≤ 40 KB; clips 540×960 ≤ 1.2 MB, 4–6 s loops).

### 11.8 App shell & key screens [R:08 §8]
Desktop: start-side collapsible sidebar (248/72 px): בית · סרטון חדש (primary) · פרויקטים · תבניות · ספריית הוקים · ערכת מותג · ספריית מדיה · צוות · לקוחות (agency) · חיוב וקרדיטים · הגדרות; top bar: `WorkspaceSwitcher` (start), ⌘K search (center), `CreditsMeter` pill + notifications + theme + avatar (end). Mobile: `MobileTabBar` (בית · פרויקטים · ＋ · הוקים · חשבון). Wizard: step content in start 7 columns, sticky `LivePreviewPhone` (Remotion Player, 9:16 with 1:1/16:9 toggle, cost estimate) in end 5 columns; stepper step 1 at the right; footer "הקודם" (start) / "המשך" (end); autosave per step; "צרו לי הכל אוטומטית" fast path after step `business`. Editor: player center, `SceneList` start 360 px, properties tabs end 320 px (סצנה · טקסט וכתוביות · מותג · קול · מוזיקה), `TimelineLite` bottom (LTR, 4 tracks). Render progress: phone frame showing the most advanced artifact, `StageList` (תסריט ✓ → קריינות → כתוביות → סצנות (3/6) → מוזיקה → הרכבה → מוכן), `SceneStrip`, "אפשר לסגור את הדף. נשלח לכם מייל כשהסרטון מוכן."
Microcopy: direct, warm, plural Hebrew; errors say what happened and what was refunded ("לא הצלחנו ליצור את הסצנה. הקרדיטים חזרו אליכם"); every Generate button shows its cost; destructive actions confirm; skeletons match final geometry; "יוצרים…" shimmer only for AI states [R:08 §8.12].

---

## 12. Compliance and non-functional requirements

### 12.1 Accessibility
Legal baseline IS 5568 = WCAG 2.0 AA (Regulation 35); **build and test to WCAG 2.2 AA** [R:06 §7.1 corrected]. Requirements: semantic landmarks, `lang="he" dir="rtl"`, skip link "דלג לתוכן הראשי", full keyboard support incl. wizard, scene list (dnd-kit keyboard sensor) and player; visible focus ring 2 px + 2 px offset; focus not obscured by sticky header/CTA bar (`scroll-padding`); targets ≥ 24×24 px (we use ≥ 32); contrast per §11.2; error messages in Hebrew linked via `aria-describedby`, never color alone; OTP/magic-link flows allow paste (3.3.8); captions + `<track srclang="he">` on every marketing video; pause control for any motion > 5 s and the global "עצור אנימציות"; `prefers-reduced-motion` honored; Hebrew `aria-label`s on all icon buttons; live regions announce job progress milestones politely. **No accessibility overlay widget.** `/legal/accessibility` states level (WCAG 2.2 AA target, IS 5568 compliance), known gaps, date of last audit, coordinator name/phone/email (placeholders `{{A11Y_COORDINATOR_*}}` filled by the owner). Product feature: every export includes SRT/VTT so customers meet IS 5568 on their own sites [R:06 §6.2]. CI: `@axe-core/playwright` on all public templates and key app screens (zero serious/critical violations).

### 12.2 Privacy (Protection of Privacy Law, Amendment 13, in force 2025-08-14) [R:06 §7.2]
Hebrew privacy policy with the expanded s.11 notice elements (controller identity/contact, purposes, whether providing data is mandatory, consequences of refusal, recipients incl. AI sub-processors via OpenRouter, cross-border transfers to EU/US, retention, data-subject rights); `consents` log for every consent (terms, privacy, marketing, analytics, biometric); data export (`/api/account/export`, ZIP within 7 days) and deletion (cascades to Storage; providers notified where applicable); retention: free-plan renders 90 days, deleted projects purged after 30 days, webhook payloads 90 days, `ai_generations` 24 months (no prompts containing personal data beyond the brief); Supabase region eu-central-1 documented; DPAs with Supabase, Vercel, OpenRouter, Resend, PostHog, Sentry, Grow, Morning; data-security procedures per the 2017 Data Security Regulations (access control, logging via `audit_logs`, incident-response runbook incl. notifying the Privacy Protection Authority). Biometric features (voice clone, avatar) are **off at launch**; when enabled (v2) they require the likeness consent flow (§12.3) and a DPO assessment.

### 12.3 Likeness, voice and AI content
Only the person themself may create a voice/avatar likeness: recorded Hebrew consent statement + checkbox + revocation; block celebrities/public figures and minors; downloadable Hebrew model-release form for staff/customers appearing in uploads; uploads of identifiable customers/children require the uploader's attestation of written (parental) consent [R:06 §7.8]. AI labeling: optional "נוצר באמצעות AI" corner tag (`projects.ai_label`; default ON for avatar videos), export checklist reminding that Meta/TikTok/YouTube require labeling realistic AI content; no fake-testimonial templates — testimonial scenes require real quote + consent attestation [R:06 §7.7]. Terms: customers own their outputs to the extent the law allows; customers are responsible for ad claims (misleading-advertising law) [R:06 §7.3, §7.7].

### 12.4 Consumer, spam, tax
Covered in §10.6 (cancellation, 14-day refund, VAT-inclusive prices). Anti-spam s.30A: separate **unchecked** marketing checkbox at signup/newsletter, logged; marketing emails prefixed "פרסומת" in the subject, sender details, one-click unsubscribe (`/unsubscribe`, `email_suppressions` synced to Resend); transactional emails separate [R:06 §7.4]. Tax: חשבונית מס-קבלה per charge via Morning; allocation number for B2B invoices ≥ ₪5,000 before VAT; VAT rate from `app_settings` [R:06 §7.5].

### 12.5 Elections, quiet days, sector rules
Knesset election **2026-10-27** [R:06 §7.7 verified]. Policy: political propaganda is not a supported use case — no political niche active at launch (`niches.is_active=false` for any `compliance_flag='political'` niche), `moderation.brief.v1` blocks political campaign content and real politicians/public figures at all times; while `app_settings.election_mode.enabled` (until 2026-10-28 23:59 Israel time), any political category returns `ELECTION_POLICY_BLOCKED` with an explanation; CEC deepfake-disclosure rules (5786-2026) are cited in `/legal/ai-policy`. Quiet days (`seasons.is_quiet_day`: Yom HaShoah, Yom HaZikaron): dashboard banner, seasonal promo suggestions suppressed. Sector compliance: `niches.compliance_flag` drives editor badges ("שימו לב: כללי פרסום לנישה"), mandatory disclaimers and blocked phrasings (§7.4.8) [R:06 §7.9, R:07 §A11].

### 12.6 Security
RLS on every table; secret key and OpenRouter key only on the server (`server-only`); Zod validation on every input; CSRF-safe (same-site cookies + origin check on mutations); CSP with nonces (allow Supabase, PostHog EU, Sentry, gateway hosted page origin, `blob:` media); HSTS; signed URLs short-lived; uploads type/size-checked server-side and re-probed; webhooks verified (signature + token + idempotency); rate limits (Upstash sliding window): auth 10/10 min/IP, `/api/hooks/*` events 60/min/IP, brand extract 5/day/workspace, rewrites 50/day, voice previews 20/day, generate 10/hour/workspace + plan concurrency; daily credit cap per plan and global OpenRouter budget guard; abuse: disposable-email blocklist for trials, one trial per normalized email; admin actions audited; payment tokens encrypted (AES-256-GCM); dependency audit in CI; secrets only in Vercel env (Production/Preview/Development separated).

### 12.7 Performance budgets
Marketing: LCP < 2.5 s (4G, mid-range Android), CLS < 0.05, INP < 200 ms, JS ≤ 170 KB gzip on landing (effects lazy-loaded), images AVIF/WebP via `next/image` with `remotePatterns` for `*.supabase.co`; hooks pages TTFB < 300 ms from ISR cache. App: dashboard interactive < 2 s; Remotion Player lazy-loaded only on wizard/editor; first script tokens stream < 3 s; 30 s standard video end-to-end p50 < 6 min, p95 < 12 min; render success ≥ 99%.

### 12.8 SEO
Programmatic pages only where content is thick: every indexed niche/hook page has a unique intro (`seo_intro_he`, human-reviewed), real hooks, sample scripts, FAQ, related links — guarding against scaled-content-abuse [R:07 §A10]. Metadata via `generateMetadata` (Hebrew title ≤ 60 chars, description ≤ 155), canonical URLs, `hreflang` not needed (single locale). Sitemaps: `app/sitemap.ts` index + `generateSitemaps` segments (static, niches, hooks, hook-types, seasons, blog). Robots disallow `/app`, `/admin`, `/api`, `/v`, `/approve`. JSON-LD: `Organization`, `WebSite` + `SearchAction` (→ `/hooks?q=`), `BreadcrumbList`, `ItemList` (hooks), `VideoObject` (examples/sample videos), `FAQPage` (for users; no rich-result expectation), `Product` + `AggregateOffer` (pricing, ILS). OG images: `opengraph-image.tsx` per niche/hook-type/blog via `next/og` with Heebo TTF and `bidi-js` reordering; Playwright snapshot test; fallback static PNGs from `PosterStill` in `public-media/og/` [M0-verify]. "Hook of the day" revalidated by cron (`revalidateTag('hooks:hotd', "max")`).

### 12.9 Analytics events (PostHog; snake_case; consent-gated; no PII in properties)
`signup_started`, `signup_completed {method}`, `onboarding_completed {niche}`, `niche_selected {niche, location}`, `hook_copied {hook_id, niche, location}`, `hook_personalized`, `hook_create_video_clicked {hook_id}`, `hook_variations_requested`, `brand_extracted {success}`, `wizard_step_completed {step}`, `fast_path_used`, `script_generated {model_served, ms}`, `storyboard_generated`, `preview_played`, `generation_confirmed {credits, quality, visual_mix, duration, formats}`, `generation_completed {job_id, duration_ms, cost_usd, degraded_scenes}`, `generation_failed {stage, error_code}`, `scene_regenerated`, `video_downloaded {format}`, `captions_downloaded {type}`, `share_link_created {kind}`, `client_approval_submitted {decision}`, `pricing_viewed`, `checkout_started {kind, plan_id|pack_id, cycle}`, `checkout_completed`, `subscription_canceled {reason}`, `refund_requested`, `credits_low_shown`, `topup_purchased {pack_id}`, `cta_clicked {location}`, `newsletter_subscribed`, `motion_toggled {on}`, `theme_changed {theme}`. Server-side events for payments and jobs via `posthog-node`. Definitions in `lib/analytics/events.ts` (typed).

### 12.10 Errors, logging, email, i18n
Sentry for client/server/edge with release + source maps, PII scrubbing, job/step IDs as tags. Structured JSON logs (`lib/log.ts`) with `requestId`, `jobId`, `workspaceId`. Error codes (canonical, Hebrew messages in `messages/he.json` → `errors.*`): `INSUFFICIENT_CREDITS`, `PLAN_LIMIT`, `CONCURRENCY_LIMIT`, `RATE_LIMITED`, `MODERATION_BLOCKED`, `ELECTION_POLICY_BLOCKED`, `MISSING_FACTS`, `PROVIDER_UNAVAILABLE`, `PROVIDER_TIMEOUT`, `VIDEO_JOB_FAILED`, `TTS_FAILED`, `RENDER_FAILED`, `BUDGET_GUARD`, `INVALID_INPUT`, `NOT_FOUND`, `FORBIDDEN`, `PAYMENT_FAILED`, `WEBHOOK_INVALID_SIGNATURE`, `MAINTENANCE`. Emails (React Email, RTL, Heebo fallback stack, plain-text twin): `magic_link` (Supabase template), `welcome`, `video_ready`, `video_failed_refunded`, `payment_receipt` (invoice link), `payment_failed`, `subscription_canceled`, `renewal_upcoming` (annual: 7 days before), `low_credits`, `client_approval_request`, `approval_received`, `team_invite`, `data_export_ready`, `account_deleted`, `newsletter_confirm`. i18n: all UI strings in `messages/he.json` (namespaced by area: `common`, `marketing`, `hooks`, `wizard`, `editor`, `billing`, `errors`, `emails`, `legal`), no string literals in components except brand placeholders; `dir` from locale.

---

## 13. Milestones (build in order; one commit — or more — per milestone, message `feat(mX): …`; each ends with typecheck + lint + tests green and an updated `DECISIONS.md`)

| # | Milestone | Scope | Acceptance criteria |
|---|---|---|---|
| **M0** | Foundations & spikes | pnpm repo, Next 16 + TS strict, Tailwind v4.3 tokens, shadcn `radix-nova` RTL, `DirectionProvider`, fonts, `lib/env.ts`, ESLint/Prettier + `lint-rtl`, Vitest/Playwright/MSW scaffolding, Sentry, Vercel project (fra1, Pro), Supabase project (eu-central-1, new keys), `.env.example`, `DECISIONS.md`. **Spikes** (scripts in `scripts/spikes/`, results recorded): (1) AI SDK/provider peer-dep pin; (2) OpenRouter chat with `json_schema` + `models[]` fallbacks; (3) `/videos` submit → webhook signature exact format → authenticated download; (4) Scribe `verbose_json` Hebrew word shape; (5) Eleven v4 Hebrew TTS with niqqud hints; (6) WDK hook/sleep APIs; (7) `@remotion/vercel` render of a Hebrew caption fixture; (8) `next/og` Hebrew rendering; (9) Grow + Morning sandbox calls | `pnpm dev` shows an RTL Hebrew page in both themes; `pnpm typecheck && pnpm lint && pnpm test` pass; every [M0-verify] item in this spec has a recorded outcome; a spike MP4 with correct Hebrew captions exists |
| **M1** | Data layer | All migrations (§5), enums, RLS, functions, triggers, storage buckets/policies, realtime policies, pg_cron, generated types, `supabase/seed` with Appendices A–C JSON + plans/packs/costs/models/routes/settings/flags | `supabase db reset && pnpm db:seed` succeeds twice (idempotent); RLS tests prove cross-workspace isolation (member A cannot read B's projects/assets/ledger/storage), anon can read only published catalog; credit functions pass concurrency tests (parallel reserves never overdraw); ledger is append-only |
| **M2** | Public site & hooks library | Landing (all §11.7 sections, final Hebrew copy), niches hub + pages, hooks hub/niche/type/season/platform/single pages with facets, search, personalization, copy, examples, templates, pricing (+ cost table, B2B toggle), blog (≥ 3 real articles from P2), about, contact, FAQ, 7 legal pages, sitemaps, JSON-LD, OG images, analytics consent banner | Lighthouse (mobile) ≥ 90 performance / 100 accessibility / 100 SEO on landing, `/hooks/[niche]`, `/pricing`; axe zero serious; all niche/hook pages statically generated from seed; no lorem ipsum anywhere (CI grep); bidi fixtures render correctly |
| **M3** | Auth, onboarding, workspace, brand | Magic link + Google, `proxy.ts` session refresh, `handle_new_user` trial grant, onboarding, AppShell, workspace switcher, team invites/roles, business profile, brand extract (`/api/brand/extract`), brand kit editor with live preview, uploads (signed, TUS), media library, credits meter, notifications, settings incl. privacy/export/delete, pronunciation dictionary | New user → onboarding → dashboard in < 2 min with 70 credits; invited editor sees only their workspace; brand extraction streams progress and produces an editable card; uploads > 50 MB succeed via TUS; account deletion removes data |
| **M4** | Wizard & AI text layer | Model registry + routes + sync cron, prompts (P5), schemas, `aisdk.ts`, moderation, hooks generation, script (streamed), storyboard, scene rewrite, estimate, `Animatic` preview in `LivePreviewPhone`, fast path, missing-facts gate, templates & hook deep-links | From `/hooks/[niche]` "צרו סרטון מההוק" → wizard prefilled → streamed Hebrew script in < 3 s first tokens → storyboard → animatic preview with captions, all in Hebrew RTL; Zod validation of every LLM output; credits spent/refunded correctly on failure (tested with MSW) |
| **M5** | Generation pipeline & render | Orchestrator (Vercel Workflows + inline), all steps §6.5, OpenRouter media clients, webhook route, re-hosting, captions alignment/pagination, music library + Lyria, Remotion `Promo*` compositions + 6 caption presets, Sandbox render provider, finalize (poster, SRT/VTT), realtime progress UI, project page, exports, share/approval links, storyboard editor (edit, reorder, regenerate scene, re-render), degradation, sweeper, cost tracking, budget guard | End-to-end on preview deploy: a 30 s standard 9:16 + 1:1 + 16:9 video for 3 niches completes with correct Hebrew captions/bidi, VO, music ducking, logo end card; p50 < 6 min; killing a clip mid-way degrades only that scene and refunds its credits; duplicate webhook deliveries are no-ops; job failure refunds 100% |
| **M6** | Billing, agency, admin | Plans/packs checkout (Grow + mock), webhook → payments → grants → Morning invoices, renewals cron, past-due flow, upgrade/downgrade, cancel flow + 14-day refund quote, invoices list, ledger UI; agency client workspaces + white-label share; full admin panel (§4.4) incl. cost dashboard | Sandbox purchase grants credits once (idempotent), issues an invoice PDF with VAT 18% and allocation-number request when ≥ ₪5,000 pre-VAT; cancel button stops renewals immediately with confirmation email; admin can retry/refund a job and every admin action is audited |
| **M7** | Hardening & launch | Security review, rate limits, CSP, load test of pipeline (20 concurrent jobs), a11y audit + statement, legal copy review placeholders, native-speaker QA of all Hebrew (UI, prompts, seeds), voice blind test & voice mapping, music library generation, demo/example videos from real renders, monitoring dashboards/alerts, backups/PITR, runbooks, Product Hunt kit (English demo) [R:09 §5.2] | All Definition-of-Done items (P6) checked; zero P0/P1 bugs; error budget alerts wired; production smoke test passes; DECISIONS.md complete |

---

## 14. Writer assignment (prompt parts P1–P6 + appendices)

### 14.1 Shared rules for all writers
- Output language: **Hebrew prose** for the build prompt (native, professional, natural), with code identifiers, paths, table/enum/route/component names, env vars and JSON in English exactly as in this spec. Use `{{BRAND_NAME}}`, `{{BRAND_NAME_EN}}`, `{{DOMAIN}}` placeholders; never invent a brand name.
- Never contradict research tagged [verified]/[corrected]; cite the decision, not the research file, inside the prompt (the coding agent will not have the research files).
- Each part starts with its heading `# חלק 0X — …`, a 3–5 line purpose summary, then numbered sections; tables preferred for specs; every UI string the agent must ship is written out in final Hebrew (no "TBD", no lorem ipsum).
- Cross-references use section anchors of the form "ראו חלק 04 §3" — part numbers: 01 = P1 … 06 = P6.

### 14.2 Parts
| Part | Title (Hebrew heading) | Must cover (spec §) | Research to mine | Key deliverables |
|---|---|---|---|---|
| **P1** | `# חלק 01 — מותג, מערכת עיצוב, RTL ונגישות` | §1.1, §2 (UI rows), §11 (all), §12.1, §8.4–8.5 (caption look only), §14.3 | 08 §1, §3, §4, §5, §6 (A + light), §9, §10; 05 §8; 06 §6.2, §7.1 | `globals.css` tokens (dark + light) as code, `fonts.ts`, theme strategy, shadcn RTL setup, component inventory (§11.5) with states/variants, RTL/bidi rules + mirroring table, motion system + reduced motion, a11y checklist (WCAG 2.2 AA), iconography/imagery, microcopy & voice rules, Hebrew typography rules, `Num/Price/LtrInput/DirIcon/VideoTile/VideoPlayer` specs |
| **P2** | `# חלק 02 — אתר שיווקי, ספריית הוקים ציבורית ו-SEO` | §4.1–4.2, §11.7, §10.2–10.5 (pricing page content), §12.4 (consent UI), §12.8, §12.9 (marketing events) | 08 §2, §7; 07 §A9–A10, §B2–B5; 06 §1, §2, §5, §7; 01 §10–11; 02 §5–6; 03 (c); 09 §5 | Landing section-by-section with **final Hebrew copy** (H1, subs, CTAs, FAQ answers, trust row, bento tile texts, savings-calculator copy with footnotes), niche page template copy, hooks hub/niche/type/season/platform page templates + facet UI + `HookCard` anatomy + personalization + gating, examples, templates, pricing page copy (plans, features_he, cost table, promises, B2B toggle), blog (3 full articles + MDX conventions), about, contact, FAQ, **all 7 legal pages in Hebrew** (marked for lawyer review, with `{{LEGAL_ENTITY_NAME}}`, `{{COMPANY_ID}}`, `{{A11Y_COORDINATOR_*}}` placeholders), metadata/JSON-LD/sitemaps/OG rules |
| **P3** | `# חלק 03 — חוויית האפליקציה ופאנל הניהול` | §4.3–4.4, §6.2–6.3 & §6.9–6.10 (UX implications), §8.1 (preview), §10.3–10.6 (billing UI), §11.8, §12.3, §12.5 (UI), §12.10 (error copy) | 08 §5.4, §8; 02 §5; 03 (c); 06 §6.3, §8; 07 §A10 (in-app), §A8 (CTA picker) | Every screen: purpose, layout (RTL), components, states (empty/loading/error/success), exact Hebrew microcopy, validation messages, analytics events: onboarding, dashboard, wizard (each of the 9 steps + confirm dialog + fast path + missing-facts gate), render progress, project page/export/share/approval, editor, library, brand kit, templates, in-app hooks, billing/credits/cancel/refund flow, settings, team, clients (agency), notifications, admin panel screens |
| **P4** | `# חלק 04 — שכבת הנתונים: Supabase, RLS, אחסון ו-API` | §5 (all), §4.5, §6.4, §6.9 (realtime), §10.4–10.5 (credit functions), §12.6 (RLS/security parts) | 05 §2.3, §4.1, §6; 07 §A10 schema (superseded by canonical shapes) | Full DDL for all tables/enums/indexes, RLS policies SQL, functions (credit functions with locking, `can_access_workspace`, search), triggers (balance, broadcast, ledger immutability), storage buckets + policies, realtime policies, pg_cron SQL, seed script contract + JSON validation, Route Handler contracts (Zod request/response per endpoint), Supabase clients (`server/browser/admin`), `proxy.ts` session refresh, idempotency helpers, RLS test suite |
| **P5** | `# חלק 05 — שכבת ה-AI וצנרת הווידאו` | §6 (all), §7 (all), §8 (all), §10.1, §12.5 (moderation) | 04 (all, esp. §1, §3, §4, §6, §7, §9); 05 §4–5; 06 §6; 07 §A3, §A5–A8, §B5–B6 | OpenRouter clients (chat via AI SDK, images, videos, audio, models), registry + sync, routes, **all prompt templates in full Hebrew** (IDs §7.2) incl. `sys.hebrew_style.v1`, Zod + JSON schemas, workflow + steps + orchestrator/render interfaces, webhook verification, re-hosting, captions alignment & pagination, TTS normalization, music, Remotion compositions/layers/presets/props, degradation & retry policy, cost tracking, budget guard, moderation |
| **P6** | `# חלק 06 — חיוב, תשלומים, משפט, אבטחה, בדיקות ופריסה` | §9, §10 (all), §12 (all except design), §13, §2 (tooling), §3 (repo conventions) | 05 §7, §10–12; 06 §2.6, §7; 04 §1.7 | Billing engine + Grow/Morning adapters (+ mock), checkout/renewal/cancel/refund logic with legal rules, VAT/invoices/allocation numbers, emails list + templates spec, analytics plan, security controls, rate limits, env vars table, feature flags, testing strategy (unit/contract/e2e/a11y/RLS/load), CI/CD (GitHub Actions + Vercel previews), migrations workflow, monitoring/alerts, runbooks, repo conventions (naming, commits, branches), milestones M0–M7 with acceptance criteria, **Definition of Done** checklist |
| **00** | `# חלק 00 — פתיח` (written by architect) | — | — | Already in `parts/00-header.md` |
| **App. A** | `# נספח A — זרע הנישות` | §5.3 B, §5.8 | 06 §5; hooks agent | `niche_categories.json` + `niches.json` (canonical shapes) |
| **App. B** | `# נספח B — טקסונומיית ההוקים` | §5.3 B (families, types) | 07 §A1, §A4, §B1 | `hook_types.json` (+ family dictionary if different) |
| **App. C** | `# נספח C — זרע ההוקים` | §5.3 B, §5.8, §7.4 placeholders | 07 §B2–B4 | `hooks.json` |
| **App. D** | `# נספח D — תסריטים לדוגמה` | §7.3 (ScriptV1/StoryboardV1 shapes) | 07 §B5 | 3+ sample scripts as `ScriptV1` + `StoryboardV1` JSON (used by tests, animatic demos, prompt few-shots) |
| **App. E** | `# נספח E — מדריך סגנון לקופי בעברית` | §7.4 | 06 §6; 07 §A7–A8 | Style guide used by UI copy and `sys.hebrew_style.v1` |

### 14.3 Cross-part naming conventions (reuse verbatim)
- **Tables/enums/functions:** exactly §5 (e.g. `projects`, `project_versions`, `scenes`, `jobs`, `job_steps`, `credit_ledger`, `credit_grants`, `credit_reservations`, `workspace_balances`, `model_registry`, `model_routes`, `reserve_credits`, `capture_credits`, `settle_reservation`, `refund_reservation`, `begin_spend`, `commit_spend`, `can_access_workspace`).
- **Routes:** exactly §4 (public English slugs; app under `/app`; admin under `/admin`; API under `/api`; webhooks `/api/webhooks/openrouter/video`, `/api/webhooks/render`, `/api/webhooks/payments/[provider]`; cron `/api/cron/*`). Wizard steps: `business · niche · goal · hook · script · style · voice · music · preview`.
- **Components:** PascalCase names listed in §11.5 / §11.7 / §11.8; files kebab-case (`hook-card.tsx` exports `HookCard`). Remotion: compositions `PromoVertical`, `PromoSquare`, `PromoWide`, `Animatic`, `PosterStill`, `CaptionStyleSample`; layers per §8.3.
- **Caption presets:** `bold-pop`, `clean-box`, `karaoke`, `poster`, `news`, `soft`.
- **Quality/mix labels:** `draft` טיוטה · `standard` סטנדרט · `premium` פרימיום; `images` תמונות בתנועה · `smart` משולב (מומלץ) · `full` וידאו מלא.
- **Video types (Hebrew labels):** `brand_promo` סרטון תדמית · `reel_hook` רילס עם הוק · `offer` מבצע / חג · `testimonial` המלצה · `launch` השקה · `recruiting` גיוס עובדים · `explainer` הסבר שירות.
- **Plans (Hebrew):** `free` חינם · `starter` בסיס · `business` עסק · `agency` סוכנות. Packs `pack-150`, `pack-500`, `pack-1500`.
- **Realtime:** channels `job:{jobId}`, `workspace:{workspaceId}`; events `job.updated`, `step.updated`, `scene.updated`.
- **Analytics events:** §12.9 (snake_case). **Error codes:** §12.10 (UPPER_SNAKE). **Emails:** §12.10 template keys. **Prompt IDs:** §7.2. **Task keys:** §7.1. **Credit action keys:** §10.4. **Env vars:** §9. **Storage paths:** §5.6. **Feature flags:** §9.
- **Seeds:** canonical JSON shapes §5.8; hook-type slugs kebab-case (27, exactly as in `seed/hook_types.json`); niche/season/category slugs kebab-case; hook IDs `{niche-slug}-{nn}` (universal: `universal-{nn}`, seasonal: `seasonal-{season-slug}-{nn}` — exactly as in `seed/hooks.json`).
- **Hebrew terminology (UI):** "הוק" (not "וו"), "קרדיטים", "ערכת מותג", "סרטון תדמית", "רילס", "קריינות", "כתוביות", "סצנה", "תבנית", "סוכנות", "לקוחות", "ביטול מנוי", "כולל מע״מ", "חשבונית מס".

---

## 15. Errata (post-integration)

This section lists every known place where the text above was superseded while Parts 01–06 and Appendices A–E were integrated. Each row gives the spec section, what it said, what is canonical now, and the part that owns the full contract — open that part before implementing. "Box #n" refers to the numbered box at the top of this appendix. A name introduced in the "Now" column is canonical and replaces the old name verbatim. If a row and the owning part ever disagree, the part wins.

### 15.1 Status, conventions and milestones

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E1 | Header, §0 | "Single source of truth"; "writers reuse the names in this file verbatim" | Background spec only. Names are canonical as written in the parts' master lists: API routes (Part 04 §18–§24), marketing routes (Part 02 §1.1), app and admin routes (Part 03 §6.0, §22.0), error codes (Part 04 §18.2), analytics events (Part 06 §14.2), env vars (Part 06 §20), email keys (Part 06 §12.4), prompt IDs (Part 05 §8.1), audit actions (Part 04 §24.1), settings and flags (Part 04 §16.4, Part 06 §21) | Part 00 §5 |
| E2 | §0, §14.1 | Three brand placeholders; "the coding agent will not have the research files" | 19 owner-filled `{{…}}` variables, read only from `BRAND` in `lib/constants.ts` (except `{{VERCEL_TEAM_SLUG}}`); `scripts/check-content.ts --launch` blocks production while any is unfilled. `docs/research/` ships in the repository (box #1) | Part 00 (variables box), Part 06 §20.1 |
| E3 | §13 | Milestone table with 9 M0 spikes | Full tasks and acceptance in Part 06 §24: 18 M0 spikes in `scripts/spikes/`, every `[M0-verify]` collected in `docs/m0-verify.md` and closed in `DECISIONS.md` (`pnpm check-decisions`); M1 migrations `0001`–`0012`; every milestone also updates `CHANGELOG.md` and is tagged `v0.{m}.0`. Definition of Done incl. the ⚖️ lawyer/accountant block: Part 06 §25 | Part 06 §24–§25 |
| E4 | §14 | Writer assignment; "App. B = `hook_types.json`"; "App. D = 3+ sample scripts" | Historical (the parts exist). Appendix B = `hook_families.json` (8) + `hook_types.json` (27) + `seasons.json` (25, incl. 2 quiet days); Appendix C = `hooks.json` (326); Appendix D = five scripts (`restaurants-grill-30`, `renovation-bathroom-30`, `mortgage-mix-30`, `dentists-brand-60`, `nails-hanukkah-15`) — a different concept from the three marketing `niches.sample_scripts` per niche | Part 00 §4, Appendix D §1 |

### 15.2 Repository, seeds and media (§3, §5.8)

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E5 | §3 | Tree without `/seed`, `docs/`, prompt files, `CHANGELOG.md` | The repository already holds `prompt/`, `PROMPT.md`, `PROMPT-QUICKSTART.md` (read-only), `docs/research/` (read-only) and `/seed`. The agent adds `CHANGELOG.md`, `docs/m0-verify.md` and the rest of `docs/`, `scripts/spikes/`, `.github/` | Part 00 §4, Part 06 §23.7 |
| E6 | §3, §5 | `supabase/migrations/0001_… numbered` | Exactly the topical files `0001`–`0011` plus `0012_ops_roles.sql` (role `backup_reader`); until launch, new columns go into the existing topical file | Part 04 §2.1, §15b |
| E7 | §3, §5.8 | Seed JSON produced directly under `supabase/seed/data/` | `/seed` (repo root) is the source of truth for Appendices A–C, built by `seed/scripts/build_seed.py` (never edit the JSON by hand); `pnpm seed:sync` runs `build_seed.py --check` and copies the six files to `supabase/seed/data/` before `pnpm db:seed`. New seed file `niche_extras.json` (mode `fill_if_null`: `short_name_he`, `default_register`, `default_audience_gender`, `default_cta`, `default_music_mood`). Expected counts: 8 families, 13 categories, 36 niches, 27 types, 25 seasons, 326 hooks | Part 04 §2.2, §16.1 |
| E8 | §3 | `public/media/demo/` for demo videos | Demo media live in the Storage bucket `public-media` (`demo/wall/*` for the 18-tile wall of `content/demo-wall.json`, `demo/examples/*` for the five Appendix D renders), uploaded by `pnpm demo:render --upload`; only `public/media/demo/logo-demo.svg` stays in the repo | Appendix D §9.1, Part 02 §3.3, Part 04 §13.1 |
| E9 | §3 | `lib/`, `app/`, `scripts/` lists | Additions include `lib/ai/client/use-ndjson-object.ts` (`useNdjsonObject`), `lib/react-hooks/` (shadcn hooks alias; never `@/hooks`), `lib/settings/schema.ts` (`APP_SETTINGS`, Zod per key), `lib/labels.ts` (enum labels), `lib/billing/money.ts` (`formatAgorot`); `app/(marketing)/exp/hero/[variant]`; dev-only `/dev/mock-gateway/[sessionId]` and `/dev/mock-invoice/[n].pdf` (404 in production); scripts `seed-sync.ts`, `check-content.ts`, `lint-copy.ts`, `lint-billing.ts`, `upload-static-media.ts`, `send-newsletter.ts`, `eval-prompts.ts`, `spikes/*.ts` | Part 06 §23.1, §23.6; Part 05 §3.5; Part 04 §16.4; Part 02 §1.2 |

### 15.3 Routes and API (§4)

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E10 | §4.2 | Marketing route table | Adds `/exp/hero/[variant]` (noindex rewrite target of the hero experiment), the per-page `opengraph-image` routes and `/accessibility` → 308 `/legal/accessibility`. Page and nav label "צור קשר" → **"יצירת קשר"** (buttons that open the form: "דברו איתנו") | Part 02 §1.1 |
| E11 | §4.2 | `/niches/[niche]` "3 sample scripts" | The three marketing `niches.sample_scripts` of that niche (not Appendix D) | Part 02 §4.3 |
| E12 | §4.3 | `/app/create` from `?template=`, `?hook=`, `?niche=` then step `business` | Box #3. Accepted query: `?template=&hook=&workspaceHook=&niche=&type=&season=&fast=1&src=`; `src` ∈ `hero`, `final_cta`, `onboarding`, `hooks`, `template`, `dashboard`, `niche_page`. `/app/hooks` also accepts `?generate=1&q=`. Page segments use `[projectId]` (API routes keep `[id]`) | Part 03 §6.0, §14 |
| E13 | §4.4 | Admin gated by `profiles.is_platform_admin` | Box #18. `proxy.ts` calls `platform_admin_status()`: `none` → 404, `needs_mfa` → `/admin/mfa`, `ok` → continue; `is_platform_admin()` also requires `aal2` | Part 03 §22.0, Part 04 §17.2, Part 06 §15.4 |
| E14 | §4.5, §6.12 | Script/hooks streamed as "AI SDK object stream" consumed by `experimental_useObject`, with `X-Version-Id` | Box #2. `POST /api/projects/[id]/hooks`, `POST /api/projects/[id]/script` and `POST /api/hooks/variations` answer `application/x-ndjson` (`partial` / `done` with `versionId`, `modelServed`, `credits` / `error`); client hook `useNdjsonObject`. `POST /api/brand/extract` stays SSE | Part 04 §18.5, Part 05 §3.5 |
| E15 | §4.5 | Response shapes | `GET /api/hooks/search` → `{ items, total, facets, page, pageSize }`; `POST /api/uploads/sign` adds `resumable`; `POST /api/voices/preview` → `{ url, expiresAt }`; `POST /api/share` → `201 { url, shareLinkId, expiresAt, emailSent }`; `POST /api/approvals/[token]` → `{ status }`; `POST /api/hooks/favorites` → `{ on }`; `POST /api/billing/checkout` → `{ redirectUrl, sessionId }` (errors: `billing_profile_required`, `annual_disabled`, `use_plan_change`, `checkout_temporarily_blocked`, `MAINTENANCE {scope:"checkout"}`); `POST /api/billing/cancel` → `{ effectiveAt, refundQuote, refundRequestId }`; `POST /api/billing/plan-change` body `{ planId, cycle, when?, dryRun }` → `PlanChangeResponse`; estimate and generate: box #4, #5 | Part 04 §19–§21 |
| E16 | §4.5 | Route table | Added routes (full contracts in Part 04): `POST /api/projects/[id]/versions`; `PATCH`/`DELETE /api/projects/[id]/scenes/[sceneId]`; `POST /api/projects/[id]/scenes/reorder`; `POST /api/projects/[id]/script/beats/[index]/rewrite`; `POST /api/projects/[id]/script/inflect`; `POST /api/projects/[id]/post-caption` (free, runs `post.caption.v1`); `POST /api/projects/[id]/edit-plan` (v2, flag `chat_edit`); `GET /api/projects/[id]/hooks`; `POST /api/hooks/variations` (with or without `sourceHookId`); `POST /api/hooks/inflect`; `POST /api/abuse-reports`; `POST /api/invites/accept`; `GET /api/billing/checkout/[sessionId]`; `GET /api/billing/cancel/quote`; `POST /api/billing/resume`; `POST /api/billing/refund-request`; `POST /api/account/whatsapp/{start,confirm,opt-out}` (v2); `GET /api/newsletter/confirm`; `POST /api/unsubscribe`; `GET /api/health`; `POST /api/webhooks/resend`; `GET`/`POST /api/webhooks/whatsapp` (v2); `POST /api/auth/hooks/send-sms` (flag `phone_otp`); admin: `POST /api/admin/models/test`, `GET /api/admin/abuse`, `POST /api/admin/ops/cron`, `POST /api/admin/credits/revoke-grant`, `POST /api/admin/billing/payments/[id]/chargeback`, `POST /api/admin/billing/payments/[id]/invoice` (multipart), `PATCH /api/admin/workspaces/[id]/plan-override` | Part 04 §19–§24 |
| E17 | §4.5 | Payment/invoice webhooks | One handler per kind: `app/api/webhooks/payments/[provider]/route.ts` (instances `/grow`, `/mock`) calling `parseWebhook(raw, headers, new URL(req.url))`; `app/api/webhooks/invoices/[provider]/route.ts` (`/morning`, `/mock`); a provider other than the configured one → 404 | Part 04 §22.4–§22.5 |
| E18 | §4.5 | "JSON bodies"; statuses per route | JSON only, except webhooks (raw body) and the admin invoice upload (multipart, PDF ≤ 4 MB (Vercel 4.5 MB body limit)). Each error code has exactly one HTTP status (`INVALID_INPUT` is always 400; a testimonial without consent is `422 MISSING_FACTS`) | Part 04 §18.1–§18.2 |

### 15.4 Database (§5)

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E19 | §5.3 | Table definitions | Box #7, plus: `ai_generations.meta` (debug, not readable by customers, nulled after 30 days); `consents.source` + `generate` (written server-side on the first generation per AI-policy version; not accepted by `POST /api/consents`) and + `unsubscribe` (server-only, row E-R10); `abuse_reports.source` (`share_page`, `system`, `support`); `brand_kits.end_card` + `logo_bug`, `show_instagram`; canonical `ProjectBrief` (snake_case: `variant_hooks`, `fact_answers`, `attestations`, `testimonial`, `audio_mix`, `post_caption`); `jobs.options` camelCase `{ formats, sceneIds?, what?, promptOverrideEn?, afterJobId? }`; `profiles.notification_prefs` = `{ kinds, whatsapp? }`; author columns `on delete set null` | Part 04 §4–§8, §19.3 |
| E20 | §5.4 | Function list | Adds `enforce_plan_limits`, `revoke_grant_remaining`, `billing_apply_payment`, `billing_apply_renewal`, `billing_apply_plan_change`, `platform_admin_status`, `health_ping`, `purge_ai_generations`, `purge_support_data`, `purge_audit_logs` and the trigger `prevent_audit_mutation` (audit log immutable). `realtime.broadcast_changes` → `realtime.send` (box #6); `broadcast_changes` only as the documented fallback if the M0 spike fails | Part 04 §9–§11, §14 |
| E21 | §5.6 | Bucket paths | `public-media` adds `sfx/{id}.mp3` (8 ids), `tests/keyframe-9x16.png`, `demo/wall/*`, `demo/examples/*`; private bucket `invoices` (PDF, 10 MB, signed URL 5 min only via `GET /api/billing/invoices/[id]`) | Part 04 §13 |
| E22 | §5.7 | 5 pg_cron jobs; `mark-retention` flags all free-plan renders | Box #22: 11 jobs, adding `purge-ai-generation-meta`, `purge-ai-generations`, `purge-support-data`, `purge-audit-logs`; renders are marked only in workspaces that never paid (`has_paid = false`) | Part 04 §15, Part 06 §11.5 |
| E-R7 | §5.5, §6.5 | `scenes`: editor+ insert/update, owner/admin delete (direct table writes from the browser) | Box #31. `scenes` is on the server-only revoke list and keeps only `scenes_select`; there is no insert/update/delete policy. Scene writes happen only with the secret client: in the Part 04 §19.6 routes and `POST /api/projects/[id]/versions`, after the role check, `is_version_locked(versionId)` (`409 EDIT_CONFLICT {reason:"version_locked"}`) and edit moderation, and in the Part 05 pipeline steps. Defense in depth: `startJob` computes `scenes_digest` = sha256 over the ordered `(id, index, is_hook_scene, image_prompt_en, motion_prompt_en, onscreen_text_he, vo_he)` into `jobs.options.scenes_digest`; `keyframe:*`, `clip:*`, `voice` and `render:*` recompute it (`assertScenesDigest`) before calling a model; a mismatch → `failJob(INTERNAL_ERROR)` with a full refund and the admin alert `scenes_changed_during_job` (`start_ms`/`duration_ms` excluded). pgTAP: an `authenticated` insert, update or delete on `scenes` is denied | Part 04 §12.2–§12.4, §19.6; Part 05 §18.3 |
| E-R10 | §4.5, §5.3, §5.5, §12.4 | `consents`: "insert own; service for anonymous"; `POST /api/consents` body `{ kind, granted, version, source }`; one-click unsubscribe writes only `email_suppressions` | Box #32. `consents` is on the server-only revoke list (only `consents_select_own`); every row is written by `recordConsent({ userId, workspaceId?, email?, kind, granted, source, req })` (`lib/consents/record.ts`, secret client; server sets `ip`, `user_agent`, `created_at`, `version = LEGAL_VERSIONS[kind]`, a different client version → `400 INVALID_INPUT {reason:"version_mismatch"}`). `POST /api/consents` accepts only `marketing_email\|marketing_sms\|marketing_whatsapp` × `signup\|settings\|newsletter` and `analytics_cookies` × `cookie_banner\|settings`; the other kinds are written by their own server routes (`ensureFirstLogin`, checkout, `generate`, likeness v2). `consents.source` adds the server-only `unsubscribe`: `POST /api/unsubscribe` (RFC 8058 one-click and the `/unsubscribe` form) first inserts `email_suppressions (reason 'unsubscribe')` on its own, then calls `recordConsent({ …, granted: false, source: 'unsubscribe' })` for each `marketing_*` kind (3 rows), and always answers 200; a consent-write failure never undoes the opt-out. `ConsentBody` never accepts `generate` or `unsubscribe` | Part 04 §8, §12.2–§12.4, §21.4, §25; Part 06 §11.4, §11.8 |
| E-R12 | §5.4, §5.5 | `workspace_members`: owner/admin manage roles with a direct update | Box #33. No `update` grant and no `update` policy on `workspace_members`. Role changes go only through `change_member_role(p_ws, p_user, p_role)` (security definer, granted to `authenticated`): caller is owner/admin, `p_role <> 'owner'`, the `owner` row is never changed (ownership moves only via `transfer_workspace_ownership`); it locks the billing-workspace row (`_lock_billing_workspace`) and, from `viewer` to `editor`/`admin`, re-checks `seats_used` against `limits.seats` → `PLAN_LIMIT {limit:"seats", max}`; it writes `audit_logs` `member.role_change`. `accept_invite`, invite creation (`workspace_invites_seat_guard`) and `enforce_plan_limits` take the same lock before counting. The Server Action `changeMemberRole` calls the RPC with the user client. pgTAP: a direct `update … set role` fails with `42501` | Part 04 §9.5, §12.2–§12.4, §12.6, §24.2, §25.2 |

### 15.5 Pipeline, AI and rendering (§6–§8)

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E23 | §6.4 | Idempotency key list | Adds the billing keys `checkout:{checkoutSessionId}`, `renew:{subscriptionId}:{periodEndISO}`, `plan_change:{subscriptionId}:{toPlan}:{requestKey}`, `revoke:{refundRequestId}:{grantId}`, `revoke:admin:{auditLogId}`, `revoke:chargeback:{paymentId}:{grantId}`. Generate also records the `ai_content_policy` consent row; `generation_confirmed` is sent by the client only | Part 06 §1.5, Part 04 §10, §19.8 |
| E24 | §6.6, §6.7, §7.1 | OpenRouter endpoints written as `/api/v1/…` (`/api/v1/videos/{id}/content`, `/api/v1/images`, `GET /api/v1/models`) | Always `${OPENROUTER_BASE_URL}/…` (e.g. `${OPENROUTER_BASE_URL}/videos/{id}/content?index={n}`). A path that starts with `/api/` and has no host always means our own Route Handlers | Part 05 §2, §4 |
| E25 | §6.6, §9 | `OPENROUTER_CALLBACK_TOKEN_SECRET` single value | Comma-separated list for rotation: sign with the first, verify against all (same for `GROW_WEBHOOK_SECRET`) | Part 05 §5.1, Part 06 §20 |
| E26 | §6.6, §6.7 | Privacy of provider calls | Every OpenRouter request sends `data_collection: "deny"`; acceptance on media endpoints is `[M0-verify]` | Part 05 §4 |
| E27 | §6.10 | Sweeper | Lock key `cron:sweep-jobs` (Upstash key list in Part 04 §18.6); `regenerate_scene`: box #17 | Part 05 §19.4 |
| E28 | §6.11 | Variant jobs start after the primary | Box #5; extra hooks stored in `projects.brief.variant_hooks` | Part 04 §19.8, Part 03 §6.4 |
| E29 | §7.1 | `tts.alt` fallback | Voice names come from `app_settings.tts_fallback_voices`, filled after the M0 TTS spike; `null` for the needed gender → no fallback, step fails with `TTS_FAILED` | Part 05 §15.6, Part 04 §16.4 |
| E30 | §7.2 | Prompt IDs | Box #9; the canonical list of 15 IDs (incl. `moderation.upload.v1` and `edit.chat.v1` for v2) | Part 05 §8.1 |
| E31 | §7.3 | `max_ai_clip_seconds`; `SeoNicheIntroV1` | Box #21. `max_ai_clip_seconds` is derived from `plans.limits.max_ai_clips` × `max_ai_clip_sec` and `visual_mix` (not a limit key); `SeoNicheIntroV1` extended | Part 05 §14.1, §10.12 |
| E32 | §7.4 | Hebrew rules summary | Box #29. ₪ before the number ("₪119") everywhere, with spelled-out exceptions: hook seed text ("349 ₪"), video text per `brand_kits.shekel_format` via `applyShekel()`, spoken `vo_tts_he` in words. Quotation marks are ASCII `"…"`, gershayim only inside acronyms. `BANNED_PHRASES` is the single list | Appendix E §5–§9, Part 05 §8.2, Part 01 §2 |
| E33 | §8.1, §8.2 | Durations; props | Box #23, #8. Per-project overrides in `projects.render_options`, resolved project → brand kit → default | Part 05 §12.1, §20.2 |
| E34 | §8.4, §8.5 | Hook title length | ≤ 22 / 24 / 32 characters per line for 9:16 / 1:1 / 16:9, max 2 lines, up to 15% auto-shrink, then an editor warning (`LENGTH_LIMITS`) | Part 05 §20.5, Appendix E §12 |

### 15.6 Configuration, billing, design and compliance (§9–§12)

| # | Spec § | Was | Now | Owner |
|---|---|---|---|---|
| E35 | §9 | Env var table | Box #12. Adds e.g. `APP_ENV`/`NEXT_PUBLIC_APP_ENV`, `GROW_PAGE_CODE_BIT`, `APP_ENCRYPTION_KEY_PREVIOUS`, `EMAIL_PROVIDER`, `RESEND_WEBHOOK_SECRET`, `SMTP_URL`, `EMAIL_ALLOWLIST`, and separate groups for Vercel-provided, Supabase-CLI-only and CI-only variables | Part 06 §20 |
| E36 | §9 | Feature flag list | Box #26. 13 keys incl. `billing_checkout`; per-environment differences only through `FEATURE_*` overrides; `hero_copy_v1` is a PostHog experiment, not a flag | Part 04 §16.4, Part 06 §21 |
| E37 | §10.3, §10.5 | `plans.limits`; money display | Limits add `max_ai_clips`, `max_ai_clip_sec`; `watermark` applies only while `has_paid = false`; seats box #24. The only ILS formatter is `formatIls` (₪ prefix, no `Intl` currency style); agorot via `formatAgorot` | Part 04 §16.4, Part 01 §2.5, Part 06 §1.4 |
| E38 | §10.6 | Dunning ends in a downgrade to `free`; fixed +1/+3/+7 days | Box #19. Retry days from `app_settings.dunning_retry_days` (`[1, 3, 7]`), end state `expired`; plan changes take `when: "now" \| "period_end"` | Part 06 §4–§6 |
| E39 | §10.7 | Grow supports Bit | Box #15. Bit is offered only for credit packs and only when `GROW_PAGE_CODE_BIT` is set (confirmed in the M0 Grow spike) | Part 06 §8.2 |
| E40 | §11, §12.1 | Tokens; UI strings | Box #16, #10 | Part 01 |
| E41 | §12.2 | Retention and backups | Free-plan renders deleted after 90 days only in never-paid workspaces; daily backups 7 days + PITR 7 days; weekly logical backup kept 30 days and the last one of each month kept 12 months; invoices kept 7 years | Part 06 §11.5, §15.11 |
| E42 | §12.6 | CSP, rate limits, admin access | Box #11, #25; admins need MFA (`aal2`) | Part 06 §15, Part 04 §18.6 |
| E43 | §12.8 | Robots disallow `/app`, `/admin`, `/api`, `/v`, `/approve` | Also `/exp`, `/dev` | Part 02 §12.3 |
| E44 | §12.9 | 33 events; "server-side events for payments and jobs" | Box #20. Sides are fixed per event: e.g. `storyboard_generated`, `subscription_canceled`, `refund_requested`, `checkout_completed`, `client_approval_submitted` are server events; `generation_confirmed` is client-only; `cta_clicked` pack locations are `pricing_pack_150`, `pricing_pack_500`, `pricing_pack_1500` | Part 06 §14.2 |
| E45 | §12.10 | 19 error codes, 15 emails, 9 i18n namespaces | Box #13, #14. WhatsApp templates (v2, Meta-approved, `he`): `video_ready_he`, `job_failed_he`, `approval_received_he`, `payment_failed_he`, `verify_code_he`. Audit actions only from the canonical list | Part 04 §18.2, §24.1; Part 06 §12.4, §13.3 |
| E46 | §4.3, §12.4 | Cookies and browser storage | Cookies: `sb-*`, `ws`, `theme`, `motion`, `sidebar_state`, `consent_v1`; after analytics consent only: `ph_*`, `exp_hero`. `localStorage`: `hero_draft_v1`, `hook_personalize_v1`, `announcement.dismissed.{id}`; `sessionStorage` (deleted when the tab closes): `reauth_draft_v1`, `signup_marketing_v1` — nothing else; the offline edit queue stays in tab memory only | Part 06 §11.7, Part 02 §10.4, Part 03 §0 |
| E47 | §5.2, §10.7, §12.4 | `invoice_doc_type` includes `receipt`; `InvoiceProvider.issue` accepts `doc: "receipt"`; a business-tax-status (עוסק פטור / exempt) mode was considered | Box #34. עוסק פטור is not supported, because the site, the checkout and the terms promise a חשבונית מס on every payment and prices that include VAT. Every successful charge gets `tax_invoice_receipt` and every refund a `credit_invoice`; `receipt` stays in the enum but is never issued (`InvoiceProvider.issue` takes only `tax_invoice_receipt \| credit_invoice`; the admin manual invoice upload rejects `docType: receipt` with `400 INVALID_INPUT`). There is no `business_tax_status` setting and no admin toggle (if the key still exists it is pinned to `licensed` and shown read-only). `{{COMPANY_ID}}` is a ח״פ or an עוסק מורשה number. Switching to עוסק פטור needs a ⚖️ product decision (accountant + consumer lawyer) and a rewrite of every VAT and invoice statement | Part 06 §9.1–§9.2, §25; Part 04 §3, §24.1; Part 03 §22.17; Part 00 (variables box) |
| E-R1 | §5.3, §10.5 | Money amounts without a stated unit | Money units: `_ils`/`Ils` decimal, `Ag` integer agorot internal (Part 06 §1.4). Decimal shekels (2 dp, incl. VAT unless named `net`) in every DB column (`*_ils numeric(10,2)`), RPC param (`p_*_ils`), API JSON field (`*Ils`) and UI value; integer agorot (`Agorot`, suffix `Ag`) only inside `lib/billing/**`, `lib/invoicing/**` and on the `PaymentProvider`/`InvoiceProvider` interfaces; conversion only via `toAgorot`/`fromAgorot`/`toIlsNumber` | Part 06 §1.3–§1.4, §8.1, §10.5 |
