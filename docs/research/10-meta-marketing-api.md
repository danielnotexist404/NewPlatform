# 10: Meta Marketing API for a multi-tenant Hebrew SaaS that creates and runs ads for Israeli SMBs (state as of 2026-10-17)

*Research date: 2026-10-17. Scope: everything {{BRAND_NAME}} ("קדימון") needs to (a) connect a customer's Meta business assets, (b) upload the AI-generated video, (c) create, run, pause and edit Facebook/Instagram ad campaigns (WhatsApp messages, Instant-Form leads, website traffic, awareness), (d) publish organic Reels, and (e) show a simple Hebrew results dashboard, including "which hook works best". Stack context: Next.js 16 on Vercel, Supabase, Remotion render, AI through OpenRouter.*

---

## 0. Method and limitations (read first)

- I ran **57 WebSearch queries** (snippet level; WebFetch and curl are blocked by network policy). I did not open full pages. Each claim below cites the URL whose search snippet supported it.
- Tags:
  - **[src](url)**: supported by a search-result snippet of that URL. Meta's own pages (developers.facebook.com, transparency.meta.com, about.fb.com) are authoritative. Third-party blogs are marked "(3rd-party)".
  - **(unverified)**: model knowledge (training data to about mid-2026) or a single weak source that I could not confirm in this run. Treat it as a strong lead and check it in M0.
  - **(inference)**: my own reasoning.
- Meta keeps its docs at two URL roots, the older `developers.facebook.com/docs/...` and the newer `developers.facebook.com/documentation/ads-commerce/...`. Snippets from the two roots sometimes give **different dates for the same thing**. I note those conflicts where I found them.
- Not found or not confirmed in this run: the exact `advantage_state` enum value for Advantage+ *leads* campaigns, the exact CTWA `call_to_action` JSON, the ILS minimum daily budget, an API field for AI disclosure, and whether a Page's linked WhatsApp number can be read through the API. All of these are listed in the final section.

---

## 1. Executive summary: 15 takeaways

1. **Pin Graph/Marketing API `v26.0`.** It was released **2026-07-29** [src](https://developers.facebook.com/blog/post/2026/07/29/introducing-graph-api-v26-and-marketing-api-v26/). v25.0 came out on 2026-02-18 [src](https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25) and v24.0 on 2025-10-08 [src](https://developers.facebook.com/blog/post/2025/10/08/introducing-graph-api-v24-and-marketing-api-v24/). The Marketing API changelog lists **v24.0 as available until 2026-10-06**, so it has already expired for ads [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog.md). No v27 was announced in the search results as of today; the cadence (Jan/May/Oct 2025, Feb/Jul 2026) points to roughly Oct–Dec 2026 (inference).
2. **Marketing API versions live about one year, not two.** v22 ran until 2026-02-19 and v23 until 2026-06-09 [src](https://developers.facebook.com/docs/graph-api/changelog/versions). Build a **version-upgrade runbook** and keep the version in an environment variable.
3. **Advantage+ is now the default, and legacy ASC/AAC creation is gone.** v24 blocked creation of new legacy Advantage+ Shopping (ASC) and App (AAC) campaigns. v25 blocked create and update, and that block reached **all versions on 2026-05-19**. v26 pauses the remaining legacy ASC/AAC campaigns [src](https://developers.facebook.com/blog/post/2026/02/13/asc-and-aac-deprecation-mapi-v25/). A campaign now counts as "Advantage+" when it has Advantage+ campaign budget, Advantage+ audience and Advantage+ placements together (`advantage_state_info`) [src](https://developers.facebook.com/blog/post/2025/06/03/advantage-plus-campaign-experience-for-sales-and-app/). For us this is good news: "simple" and "what Meta wants" are now the same setup.
4. **Detailed-targeting exclusions were removed in January 2025** [src](https://developers.facebook.com/blog/post/2025/01/21/removal-of-detailed-targeting-exclusions/). **Since v23.0, new ad sets must send `targeting_automation.advantage_audience` = 1 or 0**, or they error for non-default targeting [src](https://developers.secure.facebook.com/blog/post/2025/06/13/marketing-api-changes-to-advantage-plus-audience-behaviors/).
5. **Access model: a "business" type app with Facebook Login for Business (`config_id`) issuing Business Integration System User (BISU) tokens.** The token is tied to the client's business portfolio, can only reach the assets the client picked, and is revoked when the client removes the app [src](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business).
6. **Four separate gates before real customers can connect:**
   - Business Verification of our company.
   - App Review (Advanced Access) for each permission.
   - **Tech Provider access verification**, which is required when other businesses use an app that holds `ads_management` or `business_management` [src](https://developers.facebook.com/documentation/development/release/access-verification).
   - **Marketing API "Full Access" tier.** It was renamed on 2026-05-04 from "Ads Management Standard Access". The threshold is now 500 calls in 15 days at under 15% errors, and the screencast requirement is gone [src](https://developers.meta.com/blog/updates-to-ads-management-standard-access-feature/).
7. **The "Limited Access" tier is for development only.** It is heavily rate-limited per ad account. Only "Full Access" may manage an unlimited number of live advertisers' ad accounts [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization).
8. **Rate limits are counted per ad account per Business Use Case.** Other hard limits [src](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting):
   - 100 QPS per app and ad account for create/edit calls.
   - **An ad set's budget can change at most 4 times per hour** (error 613/1487632). The budget slider in the UI must be debounced.
   - The account spending limit can change at most 10 times per day.
9. **Video upload:** ad-account video upload is a resumable flow (start, then upload bytes to `rupload.facebook.com`, then poll `status`, then finish), and the docs say only uploads to ad accounts are supported [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/videoads/fbvideoads). A `video_data` creative needs a thumbnail (`image_hash` or `image_url`) [src](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-video-data/).
10. **Click-to-WhatsApp:**
    - Settings: `destination_type=WHATSAPP`, `optimization_goal=CONVERSATIONS` under `OUTCOME_ENGAGEMENT`. `promoted_object.page_id` is required and the WhatsApp number is optional [src](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp).
    - The Page must be linked to a **WhatsApp Business** number; personal numbers don't work (3rd-party) [src](https://www.wati.io/en/blog/create-click-to-whatsapp-ads/).
11. **Instant-Form lead ads:**
    - Ad set: `OUTCOME_LEADS` + `destination_type=ON_AD` + `LEAD_GENERATION` or `QUALITY_LEAD` [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/create).
    - Forms: created with `POST /{page_id}/leadgen_forms`, and **`locale` supports `HE_IL`** [src](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/).
    - Lead delivery: the `leadgen` webhook carries only a `leadgen_id`, and you fetch the lead data with a second call [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving).
12. **Insights changes in 2026:**
    - **7-day-view and 28-day-view attribution windows stopped being returned on 2026-01-12** [src](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/).
    - Unique metrics and hourly breakdowns are limited to 13 months of history, frequency breakdowns to 6 months (same source).
    - **From 2026-08-03 some breakdowns need an opt-in on "non-sales-supported" accounts**, which describes most Israeli SMBs [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/out-of-cycle-changes/occ-2026.md).
    - Data refreshes every ~15 minutes and is stable after 28 days [src](https://developers.facebook.com/docs/marketing-api/insights/best-practices).
13. **Special Ad Categories are not mandatory for an Israeli advertiser targeting Israel.**
    - Housing, employment and credit rules apply to the US, Canada and parts of Europe, and FINANCIAL_PRODUCTS_SERVICES to the US [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/special-ad-category).
    - **Political and social-issue ads in Israel need authorization and a "Paid for by" disclaimer.** Israel is named explicitly in Meta's election-integrity rules [src](https://transparency.meta.com/en-us/policies/ad-standards/SIEP-advertising/SIEP).
    - We should **block political content** entirely.
14. **AI labelling:** from **2026-06-01** Meta auto-detects third-party generative-AI media in ads (C2PA and similar signals) and shows "AI info" in the "About this ad" menu. AI disclosure is *mandatory* only for some social-issue, election and political ads [src](https://about.fb.com/news/2026/02/meta-prepares-for-2026-us-midterms/).
15. **Money:**
    - The customer's ad account pays Meta directly through its own `funding_source`. We never touch ad spend.
    - `funding_source` is read-only through the API, and adding a card goes through a Meta dialog [src](https://developers.secure.facebook.com/docs/marketing-apis/guides/javascript-ads-dialog-for-payments).
    - A Meta Business Partner badge is **not** needed to build on the Marketing API (3rd-party) [src](https://www.stackmatix.com/blog/meta-business-partner-program).

---

## 2. API versions, deprecation cadence and breaking changes (2025–2026)

### 2.1 Version timeline

| Version | Released | Marketing API "available until" | Source |
|---|---|---|---|
| v22.0 | 2025-01-21 | 2026-02-19 | [src](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog/version22.0) |
| v23.0 | 2025-05-29 | 2026-06-09 | [src](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog/version23.0/) |
| v24.0 | 2025-10-08 | **2026-10-06** (one changelog page; another mirror says TBD) | [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog.md) |
| v25.0 | 2026-02-18 | TBD | [src](https://developers.facebook.com/docs/graph-api/changelog/version25.0) |
| **v26.0** | **2026-07-29** | TBD | [src](https://developers.facebook.com/docs/graph-api/changelog/version26.0) |
| v27.0 | not found in search on 2026-10-17 | — | (unverified; inference: Oct–Dec 2026) |

- **The general Graph API** promises at least two years per version (3rd-party) [src](https://www.ayrshare.com/solutions/meta-graph-api-versioning-survival-kit-staying-ahead-of-v21-v22-and-beyond/). The **Marketing API window is about 12 months** (table above). A third-party report says Graph v20.0 was deprecated 2026-09-24 and v21.0 goes on 2027-01-21 [src](https://www.relevantaudience.com/meta/meta-graph-api-v26-commerce-endpoints/) (3rd-party).
- **"Out-of-cycle" changes apply to all versions at once** and are listed separately [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/out-of-cycle-changes/occ-2026). They must be monitored too.

### 2.2 Changes that matter to us, by version

**v22.0 (Jan 2025)**
- `instagram_actor_id` was replaced by **`instagram_user_id`** on adcreatives, ads and generatepreviews. `instagram_story_id` became `source_instagram_media_id`, and `effective_instagram_story_id` became `effective_instagram_media_id`. The legacy fields have been gone from all versions since **2025-09-09** [src](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog/version22.0) [src](https://developers.facebook.com/blog/post/2025/08/11/instagram-marketing-api-update/).
- The **Standard Enhancements bundle was retired**. Advantage+ creative features are now opted in or out one at a time in `degrees_of_freedom_spec.creative_features_spec` with `enroll_status: OPT_IN|OPT_OUT`. For single-video ads the sub-features are `video_auto_crop`, `text_optimizations` and `inline_comment`. An ineligible OPT_IN is dropped silently [src](https://developers.facebook.com/blog/post/2025/01/17/marketing-api-v22-impacts-to-advantage-plus-creative-enhancements/) [src](https://developers.facebook.com/docs/marketing-api/creative/advantage-creative/get-started).
- **Detailed-targeting exclusions removed** (announced 2025-01-21). New exclusions return an error. Existing ones are stripped on the next edit. `excluded_custom_audiences` still works [src](https://developers.facebook.com/blog/post/2025/01/21/removal-of-detailed-targeting-exclusions/).

**v23.0 (May 2025)**
- `advantage_audience` is required or defaults on ad-set creation. Non-default age, gender, custom-audience or detailed targeting without the relaxation settings raises an error unless the flag is sent [src](https://developers.secure.facebook.com/blog/post/2025/06/13/marketing-api-changes-to-advantage-plus-audience-behaviors/).
- With Advantage+ audience on, `age_min` accepts only 18–25 and `age_max` is fixed at 65. The values become *suggestions* [src](https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-expansion/advantage-audience/).
- **Advantage+ campaign experience** (June 2025) adds `advantage_state_info` with `advantage_state` (`ADVANTAGE_PLUS_SALES`, `ADVANTAGE_PLUS_APP` or `DISABLED`), `advantage_budget_state`, `advantage_audience_state` and `advantage_placement_state` [src](https://developers.facebook.com/blog/post/2025/06/03/advantage-plus-campaign-experience-for-sales-and-app/). The docs page is titled "…for Sales, App, and Leads". `OUTCOME_LEADS` is the objective for an "Advantage+ leads campaign", and Advantage+ placements is the API default [src](https://developers.facebook.com/docs/marketing-api/advantage-campaigns). The leads `advantage_state` enum value was not confirmed (unverified).

**v24.0 (Oct 2025)**
- `placement_soft_opt_out`: for Sales and Leads objectives only, Meta may spend up to 5% on each placement you excluded [src](https://developers.facebook.com/blog/post/2025/10/08/introducing-graph-api-v24-and-marketing-api-v24/).
- Website destination optimisation (Meta may choose the landing page) (same source).
- Legacy ASC/AAC creation blocked on v24+ [src](https://developers.facebook.com/blog/post/2025/10/08/upcoming-asc-and-aac-mapi-deprecation-migration-options-to-advantage-plus/).
- **Insights attribution change announced** (effective 2026-01-12), see §6 [src](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/).

**v25.0 (Feb 2026)**
- ASC/AAC create, duplicate and update are blocked (`smart_promotion_type` is no longer usable). The block extended to **all versions on 2026-05-19** [src](https://developers.facebook.com/blog/post/2026/02/13/asc-and-aac-deprecation-mapi-v25/).
- Failed async insights reports now return detailed errors [src](https://developers.facebook.com/blog/post/2026/01/08/enhanced-error-messaging-for-ads-insights-async-api/).
- Page Insights: a "viewers" metric replaces legacy reach (target end of June 2026). This affects organic Page metrics, not ads [src](https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25).

**Non-versioned change, 2026-05-04**
- The Marketing API Access Tier was renamed and the threshold lowered (§3.4) [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog).

**v26.0 (Jul 2026)**
- The **Instagram Explore Feed placement was removed**: requesting it returns an error. Requests for Messenger Stories succeed but the placement is silently dropped [src](https://adligator.com/blog/meta-graph-api-v26-placement-changes) (3rd-party, consistent with the Meta changelog summary).
- New or copied ad sets with **special-ad-category constrained targeting must send `advantage_audience` explicitly** [src](https://developers.facebook.com/docs/graph-api/changelog/version26.0).
- **WhatsApp Status ads**: expanded identity, targeting, optimisation and creative support (same source). This is relevant to us because Israelis use WhatsApp Status heavily (inference). Track it for phase 2.
- Remaining legacy ASC/AAC campaigns are paused [src](https://developers.facebook.com/blog/post/2026/02/13/asc-and-aac-deprecation-mapi-v25/).
- Commerce Order Management endpoints and five legacy protocol behaviours are removed from **all versions on 2026-10-27** [src](https://developers.facebook.com/blog/post/2026/07/29/introducing-graph-api-v26-and-marketing-api-v26/). We don't use these (inference).

**Out-of-cycle changes in 2026** [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/out-of-cycle-changes/occ-2026.md)
- **2026-06-28:** new Advantage+ creative features **Image Animation, Video Filter and Video Uncrop**, set per creative in `degrees_of_freedom_spec.creative_features_spec`, all versions.
- **2026-08-03:** the `impression_device`, `hourly_stats_aggregated_by_audience_time_zone` and `frequency_value` breakdowns need an **opt-in for non-sales-supported ad accounts**, which an admin requests in Ads Manager. Synchronous calls without the opt-in may return nothing.

### 2.3 Andromeda and creative diversification (delivery guidance, not API)

- Andromeda is Meta's ad-retrieval stage. It narrows millions of candidate ads to thousands before ranking (3rd-party summary of Meta's Dec 2024 engineering post) [src](https://novoads.ai/blog/creative-diversity-meta-ads).
- Meta's 2025 guidance moved the main lever from niche targeting to **creative diversification**. Ads that look alike are treated as variations of a single creative, so **distinct concepts count, not the number of ad objects** [src](https://www.jonloomer.com/meta-andromeda-creative-diversification/) (3rd-party) [src](https://www.jonloomer.com/meta-andromeda/) (3rd-party).
- The old "≤6 ads per ad set" advice was dropped [src](https://www.jonloomer.com/meta-andromeda-creative-diversification/) (3rd-party).
- **Implication for trend templates (inference):** a "hook test" should vary the *first 3 seconds visually and conceptually*, for example question vs. shock stat vs. before/after vs. POV. Three versions of the same clip with different caption text are not a real test.

### 2.4 Strategic risk (context)

- Meta is pushing end-to-end AI ad generation inside Ads Manager, and its own generative tools get labelled automatically [src](https://socialmediatoday.com/news/meta-adds-updated-disclosure-tags-for-ai-generated-ads/824658). Our moat is **Hebrew quality, niche and trend templates, and a far simpler Hebrew UX**, not access to automation (inference).

---

## 3. Access, permissions and compliance for an app that manages other businesses' ads

### 3.1 Login and tokens

- **Facebook Login for Business (FLfB)** is Meta's preferred login for tech providers [src](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business).
  - You create a **configuration** in the App Dashboard: token type, asset types and permissions. The login is launched with `config_id` instead of `scope` [src](https://singhamandeep.com/?p=1487) (3rd-party).
  - The app must be a **Business-type app**, owned by *our* business portfolio, separate from any client's.
  - Permissions are all-or-nothing: the user grants every requested permission or none.
- **Two token types:**
  - **BISU (business integration system user) token.** Use it for automated server-side work on client assets with no user present: scheduled insights pulls, budget changes, webhooks follow-up. It is tied to the client's business and limited to the assets the client designated. Read the client business id with `GET /me?fields=client_business_id`. The client revokes it under Business Settings → Integrations → Connected Apps → Remove app [src](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business).
  - **User access token.** Short-lived, exchanged for a long-lived one of about 60 days. System-user tokens are described as non-expiring and less likely to be invalidated [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authentication). Page tokens derived from a user token break when the user changes password or loses the Page role [src](https://bundle.social/blog/facebook-page-access-token) (3rd-party).
- **Recommendation:** BISU token as the primary credential per tenant, plus an optional user token for actions Meta ties to a person (unverified which ones apply in practice). Store tokens encrypted (Supabase Vault). Send `appsecret_proof` on server calls (unverified, model knowledge).

### 3.2 Permissions we will request (Advanced Access via App Review)

| Permission | Why | Source |
|---|---|---|
| `ads_management` | create/edit campaigns, ad sets, creatives, ads; ad-account webhooks | [src](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account) |
| `ads_read` | insights. `ads_management` probably covers reads; request both for clarity | (unverified) |
| `business_management` | read the client business's assets; needed with BISU tokens | [src](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business) (in the template's recommended set) |
| `pages_show_list`, `pages_read_engagement` | list and read Pages; also needed for lead retrieval and Reels publishing | [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving) |
| `pages_manage_ads` | ads and lead forms on the Page | [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving) |
| `pages_manage_metadata` | subscribe the Page to the `leadgen` webhook | [src](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen) |
| `leads_retrieval` | read lead data | [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving) |
| `pages_manage_posts` | publish organic Reels to the FB Page | [src](https://developers.facebook.com/docs/video-api/guides/reels-publishing) |
| `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights` | IG identity, organic Reels, IG insights (Instagram API *with Facebook Login*) | [src](https://developers.facebook.com/documentation/instagram-platform/content-publishing) (exact scope names unverified) |
| `whatsapp_business_management` | **phase 2 only**: CTWA welcome-message sequences on the client's WABA | [src](https://developers.facebook.com/documentation/business-messaging/whatsapp/ctwa/welcome-message-sequences/) |

The newer `instagram_business_*` scopes belong to "Instagram API with Instagram Login" and can't be used to run ads. Use the Facebook Login path (unverified, model knowledge).

### 3.3 Verification and review gates (all needed before the first external customer)

1. **Business Verification** of our Israeli company. It is required for apps that request Advanced Access or let other businesses reach their own data [src](https://products.zetaglobal.com/selligent/EN/Content/Engage/Admin%20Configuration/Details/MetaTechProviderAccessVerificationProcess.htm) (vendor doc quoting Meta).
2. **App Review** for each permission, with use-case descriptions and test instructions. Requirements: privacy policy URL, data-deletion callback, and a test user or test ad account (unverified for the exact checklist).
3. **Tech Provider access verification.**
   - Who: any business whose app *will be used by other businesses* and needs `ads_management`, `ads_read`, `business_management`, Instagram or WhatsApp permissions and others.
   - It is independent of App Review.
   - Without it, a grant from a user who has no role on the app fails with **error code 100**. Users with a role on the app are exempt, which is why testing works but production fails.
   - Verified status is lost if the business becomes restricted or the app is disconnected [src](https://developers.facebook.com/documentation/development/release/access-verification).
   - Order (2022 rule): business verification first, then App Review, then access verification [src](https://developers.facebook.com/blog/post/2022/06/02/access-verification-process-for-tech-provider-apps/).
4. **Marketing API Access Tier: Full Access** (§3.4).
5. **Data Use Checkup (DUC)** every year for apps with live use cases or Advanced Access. Separate data-handling questions and a Data Protection Assessment can arrive as "required actions" in the dashboard [src](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/data-use-checkup). Missing a DUC loses API access (same source).
6. **Platform Terms and Developer Policies.** Certified in the DUC. The rules on combining data across advertisers are an open question (§11).

### 3.4 Marketing API access tiers (as of 2026-05-04)

- **Renamed on 2026-05-04:**
  - "Ads Management Standard Access" became **"Marketing API Access Tier"**.
  - "Standard" became **Limited Access**, and "Advanced" became **Full Access**.
  - The permission identifier didn't change, so no code changes are needed [src](https://developers.meta.com/blog/updates-to-ads-management-standard-access-feature/).
- **Full Access qualification:** ≥500 Marketing API calls in the past 15 days (was 1,500) and an error rate under 15% over the last 500 calls. The screen-recording requirement was removed (same source).
- **Limited:** the default tier, heavily rate-limited per ad account, *"for development only, not for production apps running for live advertisers"*.
- **Full:** lightly rate-limited, with an unlimited number of ad accounts, provided you hold `ads_read` or `ads_management` from each one [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization).
- **M0 plan (inference):** run our own internal ad accounts and pages through the full flow (create PAUSED objects, previews, insights pulls) to reach 500 clean calls in 15 days before opening the beta.

### 3.5 Rate limits

Source for this section unless marked: [src](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting).

- **Business Use Case (BUC) limits are per ad account.** All Ads Management endpoints share one quota per ad account.
- **Header:** `X-Business-Use-Case-Usage` carries `call_count`, `total_cputime`, `total_time` and `estimated_time_to_regain_access`. `X-App-Usage` also exists (3rd-party) [src](https://singhamandeep.com/meta-graph-api-rate-limits-error-codes-quota/).
- **Ads Management hourly quota:** two snippets disagree.
  - One version: "300 + 40 × active ads" (Limited) vs "100 000 + 40 × active ads" (Full).
  - Another snippet names the tiers dev vs standard.
  - Either way, Full Access is about 300× more headroom (verify in M0).
- **Scoring:** a read costs 1 point and a write 3 points.
  - Limited: max score 60, decay 300 s, block 300 s.
  - Full: block 60 s. A max of about 9,000 is reported by a 3rd party [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization).
- **Create/edit throttle:** 100 QPS per app and ad account for campaigns, ad sets and ads.
- **Budget edits: 4 per ad set per hour.** Going over blocks budget changes on that ad set for an hour, with error 613, subcode 1487632.
- **Account spending-limit edits:** 10 per day.
- **Insights:** the quota depends on the tier and on the business that owns the app. Hitting it gives error code 4. The async report error 1504045 means the report was too large [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/best-practices).
- **Leads read limit:** 200 × 24 × (leads created in the past 90 days) per Page per 24 h [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving).

---

## 4. Creating a video ad end to end

### 4.1 Order of operations (recommended)

```
0. Pre-flight
   - ad account: account_status, currency, timezone_name, funding_source
   - Page: tasks include ADVERTISE
   - IG account linked
   - WhatsApp linked (for CTWA)
   - minimum budgets: GET /act_{id}/minimum_budgets
1. Upload video
   POST /act_{id}/advideos   (or the resumable video_ads flow)  → video_id
   poll GET /{video_id}?fields=status  until video_status = ready
2. Upload thumbnail
   POST /act_{id}/adimages  → image_hash
   (frame taken from the hook at ~0.5 s, rendered by Remotion)
3. [Lead objective only] POST /{page_id}/leadgen_forms  → form_id
4. POST /act_{id}/campaigns       status=PAUSED                       → campaign_id
5. POST /act_{id}/adsets          status=PAUSED                       → adset_id
6. POST /act_{id}/adcreatives     object_story_spec{ video_data }     → creative_id
7. GET  /{creative_id}/previews   (or /act_{id}/generatepreviews)
   → show in-app previews (Reels, Feed, Stories)
8. POST /act_{id}/ads  status=PAUSED → user taps "הפעל" → POST /{ad_id} status=ACTIVE
   (also set the campaign and ad set to ACTIVE)
9. Webhooks plus polling of effective_status
   → "בבדיקה" → "פעיל" / "נדחה" (with reason)
```

### 4.2 Video upload

- **Official resumable flow** [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/videoads/fbvideoads):
  1. Start at the ad-account `video_ads` endpoint with `upload_phase=start`. This returns a `video_id` and upload URL.
  2. Send the bytes to `rupload.facebook.com/...` keyed by the video id.
  3. Poll `GET /{video_id}?fields=status`. It returns `video_status` (processing, ready, error, expired) plus progress for the uploading, processing and publishing phases. `bytes_transferred` lets you resume.
  4. Call `upload_phase=finish`.
  - "Only uploading videos to ad accounts is supported" for this flow.
- **Older chunked flow on `/act_{id}/advideos`** (3rd-party connector doc) [src](https://www.withone.ai/knowledge/meta/conn_mod_def%3A%3AGKRjtRsW_dY%3A%3A-DzRZc5aRdCUjqK0XPw4fQ/md): `upload_phase=start|transfer|finish|cancel` with `upload_session_id`, `start_offset` and `video_file_chunk`. Widely used; the docs disagree on which flow is current.
- **Simplest option for us (unverified):** `POST /act_{id}/advideos` with `file_url=<signed Supabase/R2 URL>`. Meta pulls the file, and Remotion outputs are small (≤60 s, around 10–40 MB). **M0-verify** that `file_url` still works on v26 and which flow Meta now recommends.
- **Never create the creative before the video is `ready`.** Use the `in_process_ad_objects` webhook or polling (§4.7).

### 4.3 Campaign

- **`objective`** takes one of the six ODAX values: `OUTCOME_AWARENESS`, `OUTCOME_TRAFFIC`, `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_SALES` or `OUTCOME_APP_PROMOTION` [src](https://developers.facebook.com/docs/graph-api/changelog/non-versioned-changes/jan-31-2022/).
- **`special_ad_categories`** is a required array; send `[]` when none apply. Add `special_ad_category_country` when declaring one (unverified, model knowledge, standard API behaviour).
- **`buying_type`:** AUCTION, the default (unverified).
- **Advantage+ campaign budget** (formerly CBO): set `daily_budget` or `lifetime_budget` and `bid_strategy=LOWEST_COST_WITHOUT_CAP` on the **campaign**. This is one of the three Advantage+ components [src](https://developers.facebook.com/docs/marketing-api/advantage-campaigns).
- **Without a campaign budget**, newer versions may require `is_adset_budget_sharing_enabled` to be set explicitly on the campaign (unverified, M0-verify).
- **Budgets are in the account currency's minor unit.** ILS has **offset 100**, so `daily_budget: 5000` means ₪50.00 [src](https://developers.facebook.com/docs/marketing-api/currencies) [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/bidding/overview/budgets.md).
- **Minimum budgets:** read-only `GET /act_{id}/minimum_budgets`. It returns per-currency minimum daily budgets by optimisation type (high-frequency, impressions, low-frequency, video views) [src](https://developers.facebook.com/docs/marketing-api/reference/minimum-budget). No ILS figure was found. Fetch and cache per account, and never hard-code. A rough USD floor of about $1/day for impression goals is reported by a 3rd party (unverified).

### 4.4 Ad set

| Our Hebrew preset | objective | destination_type | optimization_goal | promoted_object | Source |
|---|---|---|---|---|---|
| **הודעות בוואטסאפ** | `OUTCOME_ENGAGEMENT` (also possible under LEADS/SALES) | `WHATSAPP` | `CONVERSATIONS` | `{page_id[, whatsapp_phone_number]}` | [src](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp) [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-multidestination) |
| **לידים בטופס מיידי** | `OUTCOME_LEADS` | `ON_AD` | `LEAD_GENERATION` (or `QUALITY_LEAD`) | `{page_id}` | [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/create) |
| **הודעות במסנג'ר / אינסטגרם** | `OUTCOME_ENGAGEMENT` | `MESSENGER` / `INSTAGRAM_DIRECT` | `CONVERSATIONS` | `{page_id}` | [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-multidestination) |
| **כניסות לאתר** | `OUTCOME_TRAFFIC` | `WEBSITE` | `LANDING_PAGE_VIEWS` (or `LINK_CLICKS`) | — | [src](https://influee.co/blog/meta-campaign-objectives) (3rd-party) |
| **חשיפה / צפיות בסרטון** | `OUTCOME_AWARENESS` (or ENGAGEMENT) | — | `REACH` or `THRUPLAY` | — | (unverified, model knowledge) |

- **Conflict:** the CTWA guide's own sample uses `optimization_goal: IMPRESSIONS`, while the multidestination guides use `CONVERSATIONS` [src](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp). Use CONVERSATIONS and verify in M0.
- **`billing_event`:** IMPRESSIONS, which is the safe default for all of the above (unverified).
- **Targeting for Israeli SMBs:**
  - `geo_locations.countries: ["IL"]`, or `custom_locations: [{latitude, longitude, radius, distance_unit: "kilometer"}]` around the business address.
  - Radius around coordinates: 1–80 km, default 16 km. City-based radius: 17–80 km (3rd-party) [src](https://help.hunchads.com/en/articles/8999725-location-targeting-for-automated-campaigns).
  - City keys come from `GET /search?type=adgeolocation&location_types=["city"]&q=<Hebrew or English city>` (unverified).
  - Always send `targeting_automation: {advantage_audience: 1}` (or 0) on create [src](https://developers.secure.facebook.com/blog/post/2025/06/13/marketing-api-changes-to-advantage-plus-audience-behaviors/).
  - With 1, age becomes a suggestion: `age_min` 18–25 only, `age_max` 65 [src](https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-expansion/advantage-audience/). For SMBs like a kids' class or a retirement product, explain in Hebrew that age is a suggestion, or set advantage_audience=0 to keep hard age limits (inference).
  - No detailed-targeting exclusions (§2.2).
- **Placements:**
  - Omitting `publisher_platforms` and positions means **Advantage+ placements**, the API default and the third Advantage+ component [src](https://developers.facebook.com/docs/marketing-api/advantage-campaigns).
  - Explicit Reels-only: `publisher_platforms: ["facebook","instagram"]`, `facebook_positions: ["facebook_reels"]`, `instagram_positions: ["reels"]` (unverified enum spellings).
  - Don't request Instagram Explore Feed on v26 [src](https://adligator.com/blog/meta-graph-api-v26-placement-changes).
  - `placement_soft_opt_out` exists for Sales and Leads [src](https://developers.facebook.com/blog/post/2025/10/08/introducing-graph-api-v24-and-marketing-api-v24/).

### 4.5 Ad creative (video)

```json
{
  "name": "kadimon-<tenant>-<template>-<variant>",
  "object_story_spec": {
    "page_id": "<PAGE_ID>",
    "instagram_user_id": "<IG_USER_ID>",
    "video_data": {
      "video_id": "<VIDEO_ID>",
      "image_hash": "<THUMB_HASH>",
      "message": "<primary text, Hebrew>",
      "title": "<headline, Hebrew>",
      "call_to_action": { "type": "WHATSAPP_MESSAGE", "value": { "app_destination": "WHATSAPP" } }
    }
  },
  "degrees_of_freedom_spec": {
    "creative_features_spec": {
      "video_auto_crop":    { "enroll_status": "OPT_OUT" },
      "text_optimizations": { "enroll_status": "OPT_OUT" },
      "inline_comment":     { "enroll_status": "OPT_IN" }
    }
  }
}
```

- **`video_data`:** `image_hash` (an image already in the account library) or `image_url` (Meta copies it into the library; avoid CDN URLs) serves as the thumbnail. `call_to_action` is optional [src](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-video-data/).
- **`object_story_spec`** requires `page_id` [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-whatsapp). Identity on Instagram is `instagram_user_id` [src](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog/version22.0). If a business has no IG account, Meta can use a Page-backed IG identity (unverified).
- **CTA types we need:** `WHATSAPP_MESSAGE`, `SIGN_UP` (or `LEARN_MORE`/`GET_QUOTE` for leads, with `value.lead_gen_form_id`), `LEARN_MORE`/`BOOK_NOW`/`CONTACT_US` for website, and `CALL_NOW`. Messenger video ads use `value: {app_destination: "MESSENGER"}` [src](https://developers.facebook.com/documentation/business-messaging/messenger-platform/ads). The exact WhatsApp `app_destination` JSON and the lead-form CTA shape were **not confirmed** (unverified, M0-verify).
- **Advantage+ creative features:** set every feature explicitly (OPT_IN or OPT_OUT) [src](https://developers.facebook.com/docs/marketing-api/creative/advantage-creative/get-started). The 2026 additions (**video_filter, video_uncrop, image_animation**) are out-of-cycle and apply to all versions [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/out-of-cycle-changes/occ-2026.md).
  - **Default OPT_OUT** for `video_auto_crop`, `video_uncrop` and `video_filter`: they can cut off or extend burned-in Hebrew captions and change the brand look.
  - **Default OPT_OUT** for `text_optimizations` unless every text field is Hebrew we control.
  - Offer a toggle "תן למטא לשפר אוטומטית" (inference).
- **Reels:** using an *existing organic reel* as an ad works via `source_instagram_media_id` with `instagram_user_id`. Eligible reels must be under 90 s, full-screen 9:16, with no third-party copyrighted music, GIFs, interactive stickers or camera filters, and not shared to Facebook [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/creative/reels-ads). This is the basis for a **"קדם את הרילס הזה"** (boost) button.
- **Reels specs and safe zones (3rd-party):** 1080×1920. Keep the top ~14%, the bottom ~20–35% and about 6% on each side clear of text and logos. Meta reportedly unified the Stories and Reels safe zones in March 2026 [src](https://billo.app/blog/meta-ads-safe-zones) [src](https://houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories-reels/) (unverified with Meta).

### 4.6 Ad

- `POST /act_{id}/ads` with `{name, adset_id, creative: {creative_id}, status: "PAUSED"}`. Activate later.
- Statuses:
  - `configured_status`: what we set.
  - `effective_status`: what is actually happening, for example ACTIVE, PAUSED, PENDING_REVIEW, DISAPPROVED, PREAPPROVED, PENDING_BILLING_INFO, CAMPAIGN_PAUSED, ADSET_PAUSED, IN_PROCESS, WITH_ISSUES, ARCHIVED (enum list unverified). `WITH_ISSUES` dates from v3.2 [src](https://developers.secure.facebook.com/ads/blog/post/2018/11/27/with-issues-status-blog/).
  - The rejection reason comes from `review_feedback`, also written as `ad_review_feedback` (field name to verify). Meta's webhook guide says to GET `effective_status`, `configured_status` and `review_feedback` after a notification [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ads-webhooks/with-issues-ad-objects).
- **Editing:**
  - Pause or resume: `POST /{campaign|adset|ad id} status=PAUSED|ACTIVE`.
  - Budget: `POST /{adset_id | campaign_id} daily_budget=<agorot>`, at most 4 per hour per ad set.
  - Editing the creative of a live ad sends it back to review (unverified, standard behaviour).

### 4.7 Getting notified (ads webhooks)

- **Ad Account webhooks** [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ads-webhooks/ads-webhooks-overview) [src](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts):
  - **`with_issues_ad_objects`**: an object (campaign, ad set or ad) entered an issue state, *including disapproval*. The payload carries id, level, `error_code`, `error_summary` and `error_message`.
  - **`in_process_ad_objects`**: an object, including a *creative*, left IN_PROCESS. The payload has `status_name`. Use it to continue the pipeline after video or creative processing.
- **Setup:**
  1. Subscribe the app once with an **app access token** (object `ad_account`, our callback URL).
  2. For each tenant, call `POST /act_{id}/subscribed_apps` with an **ad-account admin token**.
  - The app needs `ads_management` and edit rights on the account [src](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account).
- **There is no "ad approved" event.** Keep a **polling fallback** of `effective_status` for objects in PENDING_REVIEW, every 10–15 minutes (inference). Meta reviews most ads within 24 hours (unverified, Meta Help Center wording).

---

## 5. Click-to-WhatsApp and lead ads

### 5.1 Click-to-WhatsApp (CTWA): the default preset for Israel

- **Requirements:**
  - A **WhatsApp Business number** (Business app or Cloud API) **linked to the Facebook Page**: Page settings → WhatsApp → number → OTP. Personal numbers aren't supported, and the WhatsApp destination doesn't appear until the link is live.
  - If the Page and the WhatsApp account are in different Business Managers, the owner must accept a binding request [src](https://www.wati.io/en/blog/create-click-to-whatsapp-ads/) [src](https://helpdocs.ycloud.com/help-center/ctwa-click-to-whatsapp-ad/meta-ctwa-ads/create-click-to-whatsapp-ad-ctwa) (3rd-party).
- **API:** see the §4.4 table.
  - `promoted_object.page_id` is required and the WhatsApp number is optional [src](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp).
  - The default greeting is a fixed phrase and can be customised (same source; exact field unverified, possibly `page_welcome_message`).
- **Phase 2 (needs the client's WABA on our app):**
  - **Welcome-message sequences** are created on the WABA's `welcome_message_sequences` edge and referenced from the creative's `asset_feed_spec.additional_data.partner_app_welcome_message_flow_id`. Requires `whatsapp_business_management` [src](https://developers.facebook.com/documentation/business-messaging/whatsapp/ctwa/welcome-message-sequences/).
  - Inbound CTWA conversations then carry referral data (`source_id`, `ctwa_clid`), which allows true per-ad attribution of chats (same source).
- **For SMBs on the WhatsApp Business *app* (most Israeli SMBs; inference):**
  - Chats land on the owner's phone. We can only report Meta's "messaging conversations started" metric from Insights.
  - Message content and lead quality aren't visible to us. That is fine for the MVP.

### 5.2 Lead ads (Instant Forms)

- **Create:** `POST /{page_id}/leadgen_forms`. The edge can't be read directly [src](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/).
  - `questions`: predefined types like FULL_NAME, PHONE, EMAIL, CITY, plus custom questions.
  - `privacy_policy: {url, link_text ≤70 chars}`: a bad URL or text over 70 characters causes errors.
  - **`locale` enum includes `HE_IL`**. Predefined questions then render in Hebrew [src](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/).
  - The newer reference also shows an `is_lead_capture_ai_agent_enabled` flag (same source).
  - Whether the form renders RTL was not confirmed (unverified). Test on device.
- **The business needs a privacy-policy URL.** We can offer a generated Hebrew privacy-policy page per business, after legal review (inference).
- **Form limits:** about 15 questions per form and about 100 saved forms per Page (3rd-party) [src](https://www.relevantaudience.com/facebook-ads/facebook-lead-ads-instant-forms-guide/) (unverified).
- **Retrieve leads:**
  1. Subscribe the Page: `POST /{page_id}/subscribed_apps?subscribed_fields=leadgen` with a Page token from someone who can perform **ADVERTISE** on the Page.
  2. Each webhook carries only a `leadgen_id`. Fetch `GET /{leadgen_id}` → `field_data` [src](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving).
  3. Backfill through `GET /{form_id}/leads`.
  - Permissions: `leads_retrieval`, `pages_manage_metadata`, `pages_show_list`, `pages_read_engagement`, `ads_management` [src](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen).
  - If the Page uses **Leads Access Manager**, our app or system user must be granted access explicitly (same source).
  - Leads can be downloaded for about 90 days after submission (3rd-party) [src](https://www.relevantaudience.com/facebook-ads/facebook-lead-ads-instant-forms-guide/).
- **Common failure:** a new Page gets no lead events because the Page→app subscription is missing or the token lacks permissions [src](https://developers.secure.facebook.com/community/threads/382216358262902).
- **Product idea (inference):** forward each new lead to the business owner's WhatsApp or email in Hebrew within seconds, using our own transactional WhatsApp template (see part 06 §13.3). This is the "wow" moment that Ads Manager doesn't give SMBs.

---

## 6. Insights API for the Hebrew dashboard

### 6.1 Calls

- **Synchronous:** `GET /act_{id}/insights?level=ad&time_increment=1&date_preset=last_7d&fields=...`. Also on `/{campaign|adset|ad id}/insights`.
- **Async (large ranges or many accounts):** `POST .../insights`, which returns a `report_run_id`. Poll it, then read the results.
  - The `report_run_id` expires after 30 days; don't store it.
  - Data refreshes every ~15 minutes and stops changing after 28 days [src](https://developers.facebook.com/docs/marketing-api/insights/best-practices).
  - From v25, failed async jobs return detailed errors [src](https://developers.facebook.com/blog/post/2026/01/08/enhanced-error-messaging-for-ads-insights-async-api/).
- **Recommendation (inference):** a nightly sync for yesterday and the trailing 28 days (data keeps changing for 28 days), plus "refresh now" with a 15-minute cache.

### 6.2 Fields for an SMB dashboard

Field names are standard Ads Insights fields (model knowledge). **Verify each on v26 in M0.**

| Hebrew label | Field(s) | Notes |
|---|---|---|
| הוצאה | `spend` | Account currency (ILS), returned as a decimal string (unverified) |
| חשיפות / אנשים שראו / תדירות | `impressions`, `reach`, `frequency` | Unique metrics are limited to 13 months of history; frequency breakdowns to 6 months [src](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) |
| עלות ל-1,000 חשיפות / אחוז הקלקה | `cpm`, `ctr`, `inline_link_clicks`, `inline_link_click_ctr`, `cost_per_inline_link_click` | |
| צפיות 3 שניות (Hook) | `actions[action_type=video_view]` | (unverified) This is Meta's "3-second video plays". `video_play_actions` counts *starts*. Unique 3-second views are being deprecated (3rd-party) [src](https://intercom.help/measurestudio/en/articles/15217822-facebook-metrics-deprecation-faq) |
| צפיות מלאות (ThruPlay) | `video_thruplay_watched_actions`, `cost_per_thruplay` | The DMA breakdown isn't available for thruplay [src](https://developers.facebook.com/docs/marketing-api/insights/breakdowns) |
| נשארו עד 25/50/75/95/100% | `video_p25_watched_actions` … `video_p100_watched_actions`, `video_avg_time_watched_actions` | (unverified) |
| לידים / עלות לליד | `actions` and `cost_per_action_type` with `lead` / `onsite_conversion.lead_grouped` | (unverified action-type strings) |
| שיחות וואטסאפ / עלות לשיחה | `actions` and `cost_per_action_type` with `onsite_conversion.messaging_conversation_started_7d` | (unverified). A "conversation" folds the follow-up messages within 7 days into one (3rd-party) [src](https://affectgroup.com/blog/meta-ads-lead-generation-metrics-leads-cpl-qualified-and-converted-leads/) |

**Derived hook metrics** (inference; these are what the "which hook works best" view shows):
- **Hook rate** = 3-s plays ÷ impressions.
- **Hold rate** = ThruPlays ÷ 3-s plays.
- **Cost per result** = spend ÷ leads or conversations.
- Rank variants only after a **minimum sample**, for example ≥1,000 impressions and ≥3 days per ad, and say in Hebrew when a result isn't conclusive yet.

### 6.3 Attribution and breakdowns

- Since **2026-01-12** the API no longer returns `7d_view` or `28d_view`.
  - The remaining windows are 1d_click, 7d_click, 28d_click, 1d_ev (engaged view) and 1d_view.
  - Third parties report that requests for removed windows return *empty data*, not an error [src](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) [src](https://dataslayer.ai/blog/meta-ads-attribution-window-removed-january-2026).
  - Request `use_unified_attribution_setting=true` so numbers match Ads Manager (unverified parameter name).
- Third parties report that since **March 2026** only link clicks, not likes or shares, count as click-through attribution [src](https://www.conversios.io/blog/meta-attribution-window-changes-2026-fix-your-tracking/) (unverified).
- **Breakdowns we need:** none for the MVP. Per-ad level is enough to compare hooks.
  - Device, hourly and frequency breakdowns need an **opt-in** on non-sales-supported accounts from 2026-08-03 [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/out-of-cycle-changes/occ-2026.md). Avoid them in the MVP.
  - Error 1504041 means an invalid breakdown combination [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights/error-codes).

### 6.4 Organic Reels metrics (Pages and IG)

- Page Insights moved to "viewers" and "media views" metrics during 2026. Legacy reach was retired around June 2026 [src](https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25) [src](https://ecorpit.com/meta-ads-legacy-metrics-media-views-viewers-migration-2026/) (3rd-party).
- Keep the organic and paid metric vocabularies separate in the UI (inference).

---

## 7. Special Ad Categories, political ads and AI disclosure

### 7.1 Special Ad Categories (SAC)

- **Values:** `HOUSING`, `EMPLOYMENT`, `FINANCIAL_PRODUCTS_SERVICES` (successor of `CREDIT`), `ISSUES_ELECTIONS_POLITICS` [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/special-ad-category).
- **Geography:**
  - FINANCIAL_PRODUCTS_SERVICES has been **required since 2025-01-14 for advertisers based in, or targeting, the US**.
  - The credit policy applies to the **US, Canada and parts of Europe** (same source).
  - Housing and employment follow the US/Canada (and certain Europe) scope (3rd-party) [src](https://www.data-axle.com/resources/blog/meta-special-ad-categories-rules/).
  - **No source showed a global expansion to Israel.** An Israeli real-estate agent or mortgage advisor targeting Israel doesn't need to declare a SAC. Still send `special_ad_categories: []` (inference, M0-verify).
- **When a SAC applies:**
  - Minimum radius is 15 mi / 25 km in the US and Canada, 15 km in Europe.
  - No ZIP codes, no lookalikes, restricted detailed targeting, fixed age and gender (3rd-party) [src](https://help.hunchads.com/en/articles/8999725-location-targeting-for-automated-campaigns).
  - On v26, `advantage_audience` must be explicit for SAC-constrained ad sets [src](https://developers.facebook.com/docs/graph-api/changelog/version26.0).

### 7.2 Social-issue, election and political ads (SIEP) in Israel

- **Policy** [src](https://transparency.meta.com/en-us/policies/ad-standards/SIEP-advertising/SIEP):
  - Advertisers located in, or targeting, **designated countries** must complete Meta's **authorization** (ID verification) and add a verified **"Paid for by"** disclaimer. Ads without one are disapproved.
  - The scope is broad: candidates, parties, elections, *and social issues*.
  - **Israel is named explicitly** in the election-integrity rules (no discouraging voting, no premature victory claims), alongside the US, Brazil, India, Mexico and the UK.
  - The EU banned SIEP ads under TTPA [src](https://ppc.land/meta-blocks-political-ads-in-eu-as-ttpa-regulation-takes-effect).
- **Israeli elections are due by late October 2026** (see 06-israel.md; inference that SIEP enforcement and scrutiny are high right now).
- **Product rule (inference):**
  - Don't support SIEP ads.
  - Add a content check in script generation (part 05) that refuses political or social-issue content.
  - Send `special_ad_categories: []` only for commercial ads.
  - Show a Hebrew note that political ads need personal Meta authorization and aren't supported.

### 7.3 AI-generated content disclosure

- Meta **automatically** applies an "AI info" label when advertisers use Meta's own generative tools (background generation, image generation, add animation) [src](https://socialmediatoday.com/news/meta-adds-updated-disclosure-tags-for-ai-generated-ads/824658).
- **From 2026-06-01** Meta also uses automated detection (C2PA and similar standards) to label ad media made or edited with **third-party** generative-AI tools. The label appears in the "About this ad" or three-dot menu.
- Advertisers **must** disclose AI use in certain SIEP ads [src](https://about.fb.com/news/2026/02/meta-prepares-for-2026-us-midterms/).
- Claims that undisclosed AI in *commercial* ads is grounds for rejection come from blogs only (3rd-party) [src](https://www.cinerads.com/blog/ai-ugc-facebook-ad-policy) (unverified).
- **Implications for our pipeline (inference):**
  - Clips from OpenRouter video models may carry C2PA or watermarks. A Remotion re-encode will probably **strip C2PA**, so labelling becomes unpredictable.
  - Decide in M0: keep provenance (store the generation log and, if possible, write a C2PA manifest), and/or offer an "AI disclosure" toggle if the API exposes one. No API field was found (M0-verify).
  - **Photorealistic AI people saying things** in an ad carries the highest policy risk. Prefer brand footage, stock or clearly stylised visuals for testimonial-style hooks.

---

## 8. Payment: who pays for media

- **The SMB's own ad account pays Meta directly** (card, PayPal and so on). We never collect, hold or resell ad spend (inference, consistent with how third-party ad tools describe it) [src](https://help.easyadsapp.com/en/article/how-to-add-a-payment-method-to-an-ad-account-jetl2j).
- **`funding_source`** on the ad account is **read-only**: it holds the id of the current payment method. `funding_source_details` needs the MANAGE task. If neither is present, there is no payment method [src](https://developers.secure.facebook.com/community/threads/1139523857787868) [src](https://developers.secure.facebook.com/docs/marketing-apis/guides/javascript-ads-dialog-for-payments).
- **Meta's "JavaScript Ads Dialog for Payments"** (FB.ui) lets a user add a payment method from inside a partner app. Check that it is still supported; otherwise deep-link to Meta Billing (unverified for 2026 support).
- **New ad accounts** may start with limited payment options or spending limits. Some tools report that API campaign creation from third-party tools only works after some account history (3rd-party) [src](https://help.metricool.com/meta-ads-campaign-errors-and-troubleshooting-7o5qe) (unverified).
- **Statuses to surface in Hebrew:** `PENDING_BILLING_INFO`, and `account_status` values such as DISABLED or UNSETTLED (unverified enum values).
- **Meta Business Partner badge:** an optional, separate programme with spend thresholds. It is **not required** to use the Marketing API; most Marketing API apps aren't badged (3rd-party) [src](https://www.stackmatix.com/blog/meta-business-partner-program).
  - What *is* required is App Review, Tech Provider verification and the Full Access tier (§3).
  - The alternative agency model, where we run ads from our own credit line and invoice the client, adds credit risk, VAT and money-transmission questions. **Avoid it** (inference).
- **VAT:** Meta invoices the Israeli advertiser directly. Any Israeli VAT on Meta's invoice is between the SMB and Meta, not part of our billing (unverified; see 06-israel.md §7).

---

## 9. Organic publishing (Reels and posts) from the same video

- **Facebook Page Reels** [src](https://developers.facebook.com/docs/video-api/guides/reels-publishing):
  1. `POST /{page_id}/video_reels?upload_phase=start` → `video_id` and upload URL.
  2. Upload to `rupload.facebook.com`.
  3. Poll `GET /{video_id}?fields=status`, which has uploading, processing and publishing phases plus `bytes_transfered` for resume.
  4. `POST /{page_id}/video_reels?upload_phase=finish&video_state=PUBLISHED&description=...`.
  - Needs a Page token with `pages_show_list`, `pages_read_engagement` and `pages_manage_posts`.
  - Limit is reportedly **30 API Reels per rolling 24 h per Page** (3rd-party) [src](https://singhamandeep.com/?p=1532) (unverified).
- **Instagram Reels** [src](https://developers.facebook.com/documentation/instagram-platform/content-publishing):
  1. Create a container with `media_type=REELS`, `video_url` and `caption`.
  2. Poll it until `FINISHED`.
  3. Call `media_publish`.
  - Limit: **100 API-published posts per 24 h** per account, enforced at `media_publish`. Some Meta text and the `content_publishing_limit` endpoint reportedly show 50, so check `GET /{ig_id}/content_publishing_limit` live [src](https://bundle.social/blog/instagram-api-rate-limits) (3rd-party).
  - Use MP4, H.264 and AAC (3rd-party) [src](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/).
- **"Post organically, then boost the winner"** (inference): publish the Reel organically, read its organic metrics, then promote the best one as an ad through `source_instagram_media_id` (§4.5). Most SMBs already understand this flow from the "Boost" button.

---

## 10. Endpoint cheat-sheet (v26.0)

| Step | Call | Token |
|---|---|---|
| Who am I / client business | `GET /me?fields=id,name,client_business_id` | BISU |
| Ad accounts | `GET /me/adaccounts?fields=id,name,currency,timezone_name,account_status,funding_source,amount_spent,spend_cap` (unverified for BISU) | BISU |
| Pages | `GET /me/accounts?fields=id,name,access_token,tasks,instagram_business_account` (unverified for BISU) | BISU / user |
| Min budgets | `GET /act_{id}/minimum_budgets` | BISU |
| City search | `GET /search?type=adgeolocation&location_types=["city"]&q=...` (unverified) | any |
| Video upload | `POST /act_{id}/advideos` (`file_url` or resumable) → `GET /{video_id}?fields=status` | BISU |
| Thumbnail | `POST /act_{id}/adimages` → `image_hash` | BISU |
| Lead form | `POST /{page_id}/leadgen_forms` | Page token |
| Campaign | `POST /act_{id}/campaigns` | BISU |
| Ad set | `POST /act_{id}/adsets` | BISU |
| Creative | `POST /act_{id}/adcreatives` | BISU |
| Preview | `GET /{creative_id}/previews?ad_format=INSTAGRAM_REELS` (ad_format enum unverified) | BISU |
| Ad | `POST /act_{id}/ads` | BISU |
| Pause / budget | `POST /{object_id}` with `status` or `daily_budget` | BISU |
| Review status | `GET /{ad_id}?fields=effective_status,configured_status,review_feedback,issues_info` | BISU |
| Ad-account webhooks | app: `POST /{app_id}/subscriptions` (object=ad_account); tenant: `POST /act_{id}/subscribed_apps` | app / admin |
| Lead webhooks | `POST /{page_id}/subscribed_apps?subscribed_fields=leadgen`; then `GET /{leadgen_id}` | Page token |
| Insights | `GET /act_{id}/insights?level=ad&time_increment=1&fields=...` or async `POST` | BISU |
| FB Reel | `POST /{page_id}/video_reels` (start / finish) | Page token |
| IG Reel | `POST /{ig_id}/media` (REELS) → `POST /{ig_id}/media_publish` | Page/IG token |

---

## Implications for the build prompt

These are concrete requirements to add to prompt parts 03 (app UX), 04 (data/API), 05 (AI pipeline) and 06 (billing/legal/ops). Hebrew UI labels are suggestions.

### A. Configuration and versioning
1. `META_GRAPH_VERSION="v26.0"` in env. All Graph calls go through one `metaFetch()` wrapper that injects the version, `appsecret_proof` and retries, and parses the `X-Business-Use-Case-Usage`/`X-App-Usage` headers.
2. **Upgrade runbook in part 06:** check the Marketing API changelog and the Out-of-Cycle page monthly. Upgrade within 3 months of each release, because a Marketing API version lives about 12 months. Add a CI smoke test that creates PAUSED campaign, ad set, creative and ad objects on a sandbox ad account against the next version.
3. The Meta app is **Business-type**. Products: Facebook Login for Business, Marketing API, Webhooks, Instagram API with Facebook Login. WhatsApp is phase 2.

### B. Compliance milestones (M0, before beta), in order
1. Business Verification of the Israeli company.
2. Privacy policy, terms and a data-deletion callback URL on the marketing site (part 02), with a Hebrew page plus an English version for reviewers.
3. App Review for the §3.2 permissions, with a test account and a screencast of each use case in an English-UI build or with captions.
4. **Tech Provider access verification.** Without it, production users get error 100.
5. **Full Access tier:** generate 500+ clean calls in 15 days at under 15% errors on internal accounts.
6. Put the yearly **DUC** and Data Protection Assessment in the ops calendar.

### C. Connect flow (UX in 03, data in 04)
1. Button "חבר את פייסבוק ואינסטגרם" → FLfB with `config_id`. Requested assets: Pages, ad accounts, Instagram accounts. Token type: system-user (BISU).
2. The server exchanges `code` for a BISU token, reads `client_business_id`, and lists assets. The user picks **one Page, one ad account and one IG account** per brand.
3. **Pre-flight checklist, with Hebrew fixes for each failure:**
   - Ad account `account_status` is active.
   - `currency` is ILS. Warn if not, because currency is fixed at account creation (unverified).
   - `funding_source` exists; if not → "הוסף אמצעי תשלום במטא" (payments dialog or deep link).
   - Page `tasks` include ADVERTISE.
   - IG is linked.
   - WhatsApp is linked to the Page (manual confirmation plus help article if the API can't read it).
   - Cache `minimum_budgets`.
4. **New tables:**
   - `meta_connections`: tenant_id, client_business_id, encrypted token, token_type, scopes, status, connected_at, revoked_at.
   - `meta_assets`: type (ad_account / page / ig / wa), meta_id, name, currency, timezone, status JSON.
   - `ad_campaigns`: our wrapper with preset, budget_agorot, geo JSON, Meta ids, configured_status, effective_status, review_feedback.
   - `ad_variants`: ad_id ↔ video render ↔ trend_template_id ↔ hook_id.
   - `ad_insights_daily`: ad_id, date, spend, impressions, reach, frequency, link_clicks, video_3s, thruplay, p25–p100, leads, conversations, cpm, ctr, raw JSON.
   - `leads`.
   - `meta_webhook_events`: an idempotent log.
   - Use RLS by tenant.
5. **Revocation:** when a token fails with an OAuthException or the client removes the app, mark the connection revoked and show "החיבור למטא נותק — חבר מחדש".

### D. The Hebrew campaign builder (03)
1. **Three steps only.**
   - (1) Goal: "הודעות בוואטסאפ" (default) / "לידים בטופס" / "כניסות לאתר" / "חשיפה".
   - (2) Who and where: city plus radius slider of 1–80 km, default 10–15 km around the business address; age as a suggestion; "תן למטא למצוא את הקהל" on by default.
   - (3) Budget: ₪/day presets such as ₪30/₪50/₪100, validated against `minimum_budgets`, plus "עד תאריך" or ongoing. Show estimated results with honest Hebrew ranges, never promises.
2. **Mapping:** use the §4.4 table. Defaults are Advantage+ campaign budget, Advantage+ audience = 1 and Advantage+ placements, so that `advantage_state` ≠ DISABLED wherever the objective supports it. Always send `special_ad_categories: []` and `targeting_automation.advantage_audience`.
3. **Always create everything PAUSED**, show the Reels/Feed/Stories previews, and activate only on "פרסם עכשיו". Status chips: "בבדיקה של מטא", "פעיל", "נדחה — הנה למה ומה לתקן" (with a review_feedback→Hebrew mapping table), "מושהה", "חסר אמצעי תשלום".
4. **Manage:** pause/resume; budget edit debounced, with a client-side "4 changes/hour" guard and a Hebrew message; duplicate with a new hook.
5. **Hook test mode:** one ad set with 3–5 ads, each a *different trend hook* (Andromeda: distinct concepts). Show the winner after the minimum sample. Optional phase 2: Meta's A/B test API (unverified).

### E. Creative pipeline (05)
1. **Render masters:** 9:16 1080×1920 H.264/AAC MP4, 6–30 s (≤60 s). Optional 4:5 and 1:1 for feed placements via placement asset customization (unverified).
2. **All Hebrew text is burned in inside the safe zone:** top 14%, bottom 35%, sides 6%. The hook payoff must land in the first 3 s.
3. **Export a thumbnail JPG** from the hook frame and upload it through `/adimages`.
4. **Upload the video** by signed URL or resumable upload. Wait for `ready` via webhook or poll before creating the creative.
5. **Default `creative_features_spec`:** OPT_OUT for video_auto_crop, video_uncrop, video_filter and text_optimizations; OPT_IN for inline_comment; toggle in advanced settings. Re-check the list after every Out-of-Cycle update.
6. **Primary text and headline** are generated in Hebrew by the copy model. Primary text ≤125 characters recommended (unverified), headline ≤40 (unverified). The CTA comes from a preset-specific allowed list.
7. **Script guardrails:** refuse political or social-issue content, and keep claims compliant with Meta ad standards (health, finance, before/after). Flag sensitive niches (aesthetic clinics, finance, real estate) with policy hints.
8. **Provenance:** store the model, prompt and clip ids per render, for the AI-disclosure decision in M0.

### F. Webhooks and jobs (04/06)
1. **`/api/webhooks/meta`:** GET verification (`hub.challenge`) and POST signature check (`X-Hub-Signature-256` with the app secret; unverified header name). Enqueue the event and answer 200 quickly.
2. **Subscriptions:** app-level `ad_account` fields `with_issues_ad_objects` and `in_process_ad_objects`; per tenant `POST /act_{id}/subscribed_apps`; per Page `leadgen`.
3. **Cron (Vercel Cron / Supabase pg_cron):**
   - Every 10–15 min: poll PENDING_REVIEW and IN_PROCESS objects.
   - Hourly: insights for active ads, today only.
   - Nightly: insights for the trailing 28 days with `time_increment=1`.
   - Use one queue per ad account to respect BUC limits, with exponential back-off from the headers.
4. **Lead pipeline:** webhook → `GET /{leadgen_id}` → store → notify the owner in Hebrew (WhatsApp template or email). A nightly backfill through `/{form_id}/leads` catches missed webhooks.

### G. Dashboard (03)
1. **KPI tiles:** הוצאה (₪), אנשים שראו, צפיות 3 שניות, שיחות וואטסאפ / לידים, עלות לשיחה / לליד, CTR.
2. **"איזה הוק עובד הכי טוב":** per-ad table with hook rate, hold rate and cost per result, a "winner" badge only after the minimum sample, and a "הגבר תקציב למנצח" action.
3. **Attribution:** use the unified attribution setting, never 7d_view or 28d_view. Add a Hebrew footnote "נתוני מטא מתעדכנים עד 28 יום אחורה".
4. **No device, hourly or frequency breakdowns in the MVP** (opt-in needed since 2026-08-03).

### H. Organic (03/05)
1. "פרסם כרילס" to the FB Page (`video_reels`) and IG (REELS container), with a scheduler that respects the ~30/day (FB, unverified) and 50–100/day (IG) limits.
2. "קדם את הרילס הזה" turns an organic IG reel into an ad through `source_instagram_media_id`, if it is eligible (<90 s, 9:16, no copyrighted music).

### I. Billing and legal (06)
1. **We never touch ad spend.** The subscription price is separate. The terms of service must say ad spend is billed by Meta to the customer.
2. **Cross-tenant data:** don't use one tenant's ad performance to benefit another until §11 Q1 is resolved. Trend-template "global winners" must come from our own curated or test accounts or from opted-in aggregated data cleared by legal.
3. **Political ads are prohibited** in our terms of service and blocked in the product.

### J. Trend-template system (05; cross-cuts with 07-hooks.md)
1. **Trend template record:** `{id, source_ref (internal; don't republish third-party videos), hook_type, first_3s_beats[], on-screen text pattern, pacing, audio_mood, niches[], meta_presets_recommended[]}`.
2. **One click** produces 3 distinct hook variants for the tenant's niche, ready for "hook test mode".
3. **Don't reuse copyrighted trending audio** in *ads*: commercial music needs licensing, and Reels with third-party music aren't eligible as ads [src](https://developers.facebook.com/documentation/ads-commerce/marketing-api/creative/reels-ads). Use licensed or AI-generated music.

---

## Open questions / [M0-verify] items

1. **[M0-verify] Platform Terms on cross-advertiser data.** Can we use aggregated, anonymised ad performance from many tenants to rank trend templates for everyone? Check Meta Platform Terms §3, the Developer Policies and the Marketing API terms; get a legal opinion.
2. **[M0-verify] v27.0 release date** and any changes to video_data, CTWA or Advantage+. Re-check the changelog the week development starts.
3. **[M0-verify] Video upload path on v26:** `/act_{id}/advideos` with `file_url`, chunked `start/transfer/finish`, or the documented `video_ads` plus `rupload` resumable flow. Which is recommended, and what are the file limits?
4. **[M0-verify] Exact CTWA creative JSON:** `call_to_action.type=WHATSAPP_MESSAGE` and `value.app_destination=WHATSAPP`, plus whether `promoted_object.whatsapp_phone_number` is needed when the Page has several numbers. How do we set a Hebrew greeting (page_welcome_message?) without a WABA?
5. **[M0-verify]** Can the API detect whether a Page has a linked WhatsApp number (a Page field)? If not, we need a manual confirmation step.
6. **[M0-verify]** `optimization_goal` for CTWA: CONVERSATIONS vs the IMPRESSIONS shown in one Meta sample.
7. **[M0-verify]** The `advantage_state` value for Advantage+ *leads* campaigns, and whether ENGAGEMENT/WhatsApp campaigns can be "Advantage+" at all.
8. **[M0-verify]** Whether `is_adset_budget_sharing_enabled` is required when we don't use a campaign budget.
9. **[M0-verify] ILS minimum daily budgets** per optimisation goal (call `minimum_budgets` on a real ILS account), and the cheapest sensible preset.
10. **[M0-verify]** Insights field and action-type strings on v26: `video_view` (3-s plays), `video_thruplay_watched_actions`, `video_p*_watched_actions`, `lead` vs `onsite_conversion.lead_grouped`, `onsite_conversion.messaging_conversation_started_7d`; and that `use_unified_attribution_setting` exists.
11. **[M0-verify]** The Ads Management BUC hourly formula and score limits for Full vs Limited (two snippets disagree: 300 vs 100,000 base).
12. **[M0-verify]** Does Instant Form UI render **RTL** for `HE_IL` forms on iOS and Android, and do custom Hebrew questions display correctly? Test on a real device.
13. **[M0-verify]** Is there a Marketing API field to self-disclose AI-generated media on a creative? Does a Remotion re-encode strip the C2PA from AI clips, and do we want to write our own C2PA manifest?
14. **[M0-verify]** Is the payments dialog (FB.ui `ads_payment`) still supported in 2026, or must we deep-link to Meta Billing? How should we handle new-account spending limits and prepaid-only accounts in Israel?
15. **[M0-verify]** Do BISU tokens expire? What exactly invalidates them (password change, removal from Connected Apps, a 90-day policy)? Do any ad actions still require a *user* token?
16. **[M0-verify]** Is Israel on Meta's designated-country list for SIEP authorization? The policy names Israel in the election-integrity rules, but I didn't see the authorization country list. Check the current Israeli-election-period restrictions as well.
17. **[M0-verify]** Exact placement enum spellings (`facebook_reels`, `instagram_positions: reels`), the remaining placements after v26, and `generatepreviews` `ad_format` values for Reels.
18. **[M0-verify]** Organic publishing limits: FB Page Reels per 24 h (30?) and IG `content_publishing_limit` (50 vs 100), plus max Reel length via the API.
19. **[M0-verify]** Should SMBs on the WhatsApp Business *app* (not the Cloud API) be offered an upgrade path to a WABA connected to our app (welcome sequences, `ctwa_clid` attribution, lead CRM)? What would it cost, and does it need Tech Provider status in WhatsApp terms?
20. **[Open]** Whether to offer Meta's A/B test (split test) API for the "hook test", or rely on in-ad-set delivery and our own minimum-sample rule. Andromeda delivery is uneven by design.
21. **[Open]** Review-feedback to Hebrew mapping: collect the real rejection reasons during beta and write Hebrew fix guidance for each.
