# 12: Competitors that create the ad AND launch/manage it on Meta (as of 2026-10-17)

> Scope: tools that both **generate ad creative (ideally video)** and **launch, manage and report on Meta (Facebook/Instagram) campaigns** for small businesses. Meta's own AI is covered first because it is the biggest competitor. The report also covers Israeli players, Israeli agency fees, budgets and cost-per-lead benchmarks, then lists 20 UX and feature ideas to copy and a recommended ₪ pricing model for the {{BRAND_NAME}} ("קדימון") Meta-management feature.
> Sibling reports: `11-meta-organic-publishing.md` covers organic Reels publishing, insights and "boost the winner". The sibling Meta Ads/Marketing API report covers endpoint mechanics in depth. This file covers the **market** and the **product decisions** that follow from it.

---

## 0. How reliable this report is

- **Method:** 45 web searches (my full cap). WebFetch and curl are blocked by network policy, so I opened no page in full. Every fact comes from the search-result snippets of the pages linked inline.
- **Tags used:**
  - **[official]**: the snippet came from the vendor's own docs or newsroom (Meta developers or newsroom, Wix help center, Canva help, Hunch roadmap, Zeely help).
  - **[secondary]**: trade press or an independent review site.
  - **[competitor-authored]**: a pricing or review page written by a rival vendor (Superscale, Ryze, Creatify about Zeely, NovoAds and others). They are useful for numbers, but biased.
  - **(unverified)**: sources conflict, or the claim comes from my own model knowledge. Confirm it in M0.
- **Pricing caveat:** Almost no vendor in this space publishes stable prices. Most figures below come from third-party trackers (PricingSaaS, Superscale, Toolradar), captured on different dates in 2026. Treat them as **orders of magnitude**, not quotes.
- **Israel caveat:** Five Hebrew searches found **no** published ₪ price lists for agency or freelance Meta-ads management and **no** Hebrew CPL benchmark articles. The only quantitative Israeli ad-cost data I found comes from one vendor dataset (SuperAds, in USD). The Israeli fee numbers below are therefore estimates, carried over from `06-israel.md`, plus US 2026 benchmarks.
- **FX assumption:** ₪3.7 = $1 and ₪4.2 = €1 wherever I convert (unverified, check the rate at build time). Israeli VAT is 18% (since 2025-01-01, model knowledge).

---

## 1. Executive summary

1. **Meta itself is the main competitor, and it is moving fast.** By October 2026, Meta has:
   - made **Advantage+ Creative video generation (static image → video ad) generally available**;
   - opened **Ads Creative Studio** to more advertisers;
   - rolled out an **AI business assistant inside Ads Manager** to EMEA and other regions "with local-language support" (April 2026);
   - announced, at Advertising Week (2026-10-06), **agentic actions in test**: plan and create a campaign, generate images and text, change targeting or budget, all by chat.

   It also runs an official **Ads MCP server** (`mcp.facebook.com/ads`), opened to any developer with a Meta app in July 2026. The WSJ-reported goal of "upload a product image + a budget, Meta does the rest" by end-2026 is **partly real and partly still in test**. Sources: §2.
2. **What Meta still does not give an Israeli SMB** (my inference from the sources):
   - I found **no evidence that Meta's generative copy and video features support Hebrew**; three searches came back empty. Treat it as unsupported until M0 proves otherwise.
   - Ads Manager is still complex. Reviews cite "steep learning curve, frequent UI changes, hard to reach human support".
   - There is no niche-specific Hebrew hook library and no "trend template" catalogue.
   - Meta's tools are for paid ads only: they "do not create organic content or publish to other platforms" ([kompozy](https://kompozy.io/news/meta-ai-ad-creation-tools-ad-week-2026), secondary).
   - There is no Hebrew, ₪, WhatsApp-first result language ("פניות בוואטסאפ, ₪ לפנייה").
3. **The "create + launch" category exists, but no one targets Hebrew or Israel.** The SMB players with built-in launch are:
   - **Zeely**: about 12% of ad spend, plus a subscription; it collects the ad spend itself.
   - **Wix Facebook & Instagram Ads**: 15% of every payment is Wix's fee.
   - **Creatify**: credits, plus the AdMax and **AI Media Buyer** agent, launched June–July 2026.
   - **Omneky** and **Pencil**: credit or generation plans.
   - **AdEspresso**: launch and A/B testing, no AI video.

   Optimisers such as **Madgicx**, **Bïrch** (formerly Revealbot) and the Israeli **AdScale** price by spend tier, or charge 2% of spend plus a fee. Enterprise tools (**Smartly**, **Hunch**) start at about €2,500–€5,000 a month.
4. **The Israeli market signal is strong.** A Bank Hapoalim survey found that **89% of Israeli business owners run their own advertising**, and that social media marketing is their biggest challenge. Hapoalim now subsidises **Marketeam.ai "Ella"** (organic AI content and publishing) for its business customers: free for 6 months, then **$8 a month instead of $99** ([Maariv](https://www.maariv.co.il/economy/israel/article-1164816), sponsored/secondary). This is the closest local competitor for the organic side. It is a channel model to copy (banks, credit-card clubs), and it confirms that self-serve demand is real.
5. **Recommended positioning:** "יוצרים סרטון טרנדי בעברית בדקה, ומעלים אותו כקמפיין לפייסבוק ואינסטגרם בלי Ads Manager. **0% עמלה מהתקציב.** התקציב משולם ישירות למטא." Use Meta's automation (Advantage+ audience, placements and budget) instead of fighting it. Our value sits **around** it: Hebrew video creative, hook testing, WhatsApp-lead outcomes, plain-Hebrew reporting, and guardrails.
6. **Recommended pricing:** include Meta management in the existing plans with a **managed-spend cap per plan** and **no percentage of spend** (see §8). The differentiator is clear: Zeely takes about 12% and Wix about 15%; Israeli agencies charge roughly ₪1,500–₪5,000 a month (unverified).

---

## 2. Meta's own stack: the biggest competitor

### 2.1 What Meta can auto-generate or automate today (October 2026)

| Capability | Status as of 2026-10 | Source |
|---|---|---|
| **Image → video ad generation** (Advantage+ Creative "video generation") | **Generally available** (announced around Advertising Week, 2026-10-06). Meta's beta claim: advertisers who used it for most of their campaign's ads saw **+10% CTR, +8% CVR** | [techjuice](https://www.techjuice.pk/meta-ai-advertising-tools-advertising-week-2026/), [relevantaudience](https://www.relevantaudience.com/meta/meta-advertising-week-new-york-2026-ad-tools/), [emarketer](https://www.emarketer.com/content/meta-ramps-up-genai-powered-ad-creation-marketers-weigh-consumer-trust) (secondary) |
| **Video Generation 2.0**: several product images → multi-scene video; AI background music | Announced at Cannes 2025 | [searchengineland](https://searchengineland.com/meta-generative-ai-video-advertising-tools-447367), [martech](https://martech.org/metas-announces-genai-video-tools-for-advertisers/), [ppc.land](https://ppc.land/meta-ad-spend-returns-4-13-per-dollar-as-ai-creative-tools-roll-out-at-cannes/) (secondary) |
| **UGC-style videos with AI voiceovers and avatars** | Announced at IAB NewFronts 2026; AI voiceover on existing generated assets in test | [emarketer](https://www.emarketer.com/content/meta-ramps-up-genai-powered-ad-creation-marketers-weigh-consumer-trust) (secondary) |
| **Translation** of headline and primary text, now **also text in image overlays**, in a one-step Ads Manager flow | Live; the languages offered "can differ by advertiser". **Hebrew not confirmed** | [emarketer](https://www.emarketer.com/content/meta-ramps-up-genai-powered-ad-creation-marketers-weigh-consumer-trust), [Jon Loomer](https://www.jonloomer.com/qvt/translate-text-feature/) (secondary) |
| AI dubbing with lip-sync, AI lifestyle backgrounds, pacing-matched music (March 2026) | Reported by a third-party review site only | [rework](https://resources.rework.com/tools/ai-tools/best-ai-tools-for-facebook-instagram-ads-2026) (secondary, unverified) |
| **Ads Creative Studio**: new video concepts and variations, then editing | Expanding from selected partners to more advertisers (2026) | [relevantaudience](https://www.relevantaudience.com/meta/meta-advertising-week-new-york-2026-ad-tools/) (secondary) |
| **AI business assistant in Ads Manager** (24/7 chat, optimisation advice, account-issue help) | Previewed October 2025. Expanded April 2026 to US, **EMEA**, APAC and LatAm "with local-language support". Meta's claims: 20% better resolution of account issues, **−12% cost per result** for small advertisers who applied its advice | [about.fb.com Jan 2026](https://about.fb.com/news/2026/01/2026-ai-drives-performance/) (official), [socialmediatoday](https://www.socialmediatoday.com/news/meta-expands-access-to-ai-business-assistant/818263/), [searchengineland](https://searchengineland.com/meta-business-ai-generative-tools-462970) (secondary) |
| **Agentic assistant**: memory of past campaigns and goals, import of brand guidelines, "plan and create a campaign, generate creative imagery and text, update targeting or change a budget conversationally" with previews and approvals; **scheduled reports and alerts** | **Early testing** (Advertising Week, 2026-10-06) | [socialmediatoday](https://www.socialmediatoday.com/news/meta-introduces-new-ai-powered-tools-at-ad-week-2026/832288/), [relevantaudience](https://www.relevantaudience.com/meta/meta-advertising-week-new-york-2026-ad-tools/) (secondary) |
| **Manus AI** (acquired by Meta) in the Ads Manager Tools menu, for reporting and analysis | Live (2026) | [searchengineland](https://searchengineland.com/meta-adds-manus-ai-tools-into-ads-manager-469410), [socialmediatoday](https://www.socialmediatoday.com/news/meta-launches-manus-ai-integration-in-ads-manager/812288/) (secondary) |
| **Business AI agent** (sales and product-recommendation agent on websites, ads and messaging) | Eligible **US** businesses | [retaildive](https://www.retaildive.com/news/meta-streamlines-ai-use-brands-new-business-agent-creative-tools/802255) (secondary) |
| **Official Ads MCP server** `mcp.facebook.com/ads` plus a CLI | Launched around April 2026 with about 29 tools. Opened to any developer with a Meta app around 2026-07-21 (a "create and manage ads" use case). **Three consent scopes: read-only, read/write, read/write/financial** | [relevantaudience](https://www.relevantaudience.com/meta/meta-ads-mcp-open-to-developers/), [mcp.directory](https://mcp.directory/blog/meta-ads-cli-mcp), [superads](https://www.superads.ai/blog/facebook-ads-mcp) (secondary) |
| **GEM** (Generative Ads Model) central ranking model | Ranking and targeting, not creative. Meta claims +18.9% conversions and +12% CTR | [engineering.fb.com 2026-10-13](https://engineering.fb.com/2026/10/13/ml-applications/generative-ads-model-gem-scaling-frontier-ads-ai/) (official) |
| Scale signal | "In Q4 2025, the combined revenue run-rate of our video generation tools hit **$10 billion**" | [about.fb.com Jan 2026](https://about.fb.com/news/2026/01/2026-ai-drives-performance/) (official) |
| **Full end-to-end automation** (product image + budget → creative, targeting and budget split, personalised per viewer) | Reported by the WSJ in June 2025 as a goal "by end of 2026". 2026 coverage disagrees on whether it is live or still in test | [campaignasia](https://www.campaignasia.com/article/meta-aims-to-fully-automate-ad-creation-with-ai-by-2026/502831), [verdict](https://www.verdict.co.uk/meta-automate-ad-creation/), [forbes 2026-04](https://www.forbes.com/sites/terdawn-deboe/2026/04/25/meta-will-run-your-entire-ad-campaign-with-ai-should-you-let-it/), [dataslayer](https://www.dataslayer.ai/blog/meta-plans-full-ai-advertising-automation-by-2026-what-this-actually-means) (secondary) |
| **AI labelling**: ads whose images or videos were created or significantly edited with **Meta's in-house** generative AI tools get an AI label | Since February 2025 | [about.fb.com](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/) (official); terms: [Ad Creative Generative AI Terms](https://www.facebook.com/legal/terms/ad_creative_generative_ai_terms) (official) |

**Campaign structure:**
- Meta has unified Sales, App and Leads campaigns into the **Advantage+ campaign experience**.
- On the API, a campaign is "Advantage+" when Advantage+ **budget**, **audience** and **placements** are all on. The API reports this as `advantage_state`; the old `smart_promotion_type` flag is gone.
- Legacy ASC/AAC creation was blocked in Marketing API **v24.0** (2025-10-08) and can no longer be created or updated in **v25.0** (2026-02).
- Remaining ASC/AAC campaigns are **paused in v26.0** (estimated September 2026).
- Sources: [developers.facebook.com blog 2025-10-08](https://developers.facebook.com/blog/post/2025/10/08/upcoming-asc-and-aac-mapi-deprecation-migration-options-to-advantage-plus/), [blog 2026-02-13](https://developers.facebook.com/blog/post/2026/02/13/asc-and-aac-deprecation-mapi-v25/), [Advantage+ campaigns doc](https://developers.facebook.com/docs/marketing-api/advantage-campaigns) (official), [ppc.land](https://ppc.land/meta-deprecates-legacy-campaign-apis-for-advantage-structure/) (secondary).
- Graph/Marketing API **v26.0** was released 2026-07-29 and is the latest (see `11-meta-organic-publishing.md` §1).

### 2.2 Where Meta leaves room for {{BRAND_NAME}}

My inferences, each tied to a source where possible:

| Gap | Evidence | Our answer |
|---|---|---|
| **Hebrew generative copy and voice** | No source confirms Hebrew in Advantage+ text generation or translation. Meta says the language list "can differ by advertiser" ([Jon Loomer](https://www.jonloomer.com/qvt/translate-text-feature/)). **(unverified, M0-verify)** | Hebrew-native script, captions, voice and RTL burned-in text. **Default to opting out** of Meta's creative "enhancements" that rewrite text, add music or translate, so Hebrew overlays survive |
| **Complexity** | Ads Manager reviews cite a steep learning curve, frequent UI changes and hard-to-reach support ([CapCut HE guide](https://www.capcut.com/he-il/resource/facebook-ads-manager), secondary) | 3-decision Hebrew wizard (§7) |
| **Hooks and trends** | Meta generates *variations* from the advertiser's own assets. Ads Creative Studio produces "video concepts", but there is no trend-reference catalogue or per-niche hook taxonomy | Trend templates and the hook library (prompt appendices B and C) |
| **Organic + paid in one place** | Meta's AdWeek tools target paid ads only ([kompozy](https://kompozy.io/news/meta-ai-ad-creation-tools-ad-week-2026)) | Publish organically, find the winning hook, boost it (file 11 §7) |
| **Outcome language** | Ads Manager speaks in "results", "cost per result" and "ThruPlays" | "פניות בוואטסאפ", "₪ לפנייה", "הפתיח המנצח", with niche benchmarks |
| **Trust** | SMBs fear an AI that "spends my money" | Drafts created **PAUSED**, explicit approval, hard spend caps, plain-Hebrew change log |

**Risk:** Meta's free tools will keep improving. Meta also exposes the **same** capabilities to third parties (the Marketing API and the Ads MCP). Within 12–24 months, "chat with your ads" will be a commodity. Our durable moat has to be the **Hebrew creative quality, Israeli niche know-how, trend speed, local benchmarks built from our own customers' data, and WhatsApp-first outcomes**, not campaign plumbing.

---

## 3. Competitor profiles

### 3.1 Summary matrix

Legend: ✅ yes, ◐ partial or limited, ✗ no, ? unknown.

| Tool | AI creative (video) | Launches to Meta | Budget / targeting automation | Optimisation rules | Simple reporting | Pricing model | Hebrew |
|---|---|---|---|---|---|---|---|
| **Meta Ads Manager** (Advantage+, assistant) | ✅ image→video, variations | ✅ native | ✅ Advantage+ | ◐ native rules | ◐ complex | Free (ad spend only) | ◐ UI yes (unverified); gen-AI Hebrew ? |
| **Zeely** | ✅ statics, UGC-style video | ✅ built in, human-moderated | ✅ "AI shifts budget to best creatives" | ? | ✅ CTR / ROAS / conversions | Subscription + **~12% of ad spend** (~6% with Booster) | ✗ (unverified) |
| **Creatify** (AdMax, AI Media Buyer) | ✅ avatars, URL→video | ✅ Meta, TikTok, Google, AppLovin (agent) | ✅ via agent | ✅ agent audit / optimise | ◐ chat | Credits: $39 / $99 a month | ◐ (unverified) |
| **AdCreative.ai** | ✅ statics, some video | ? (unconfirmed) | ✗ | ✗ | ◐ creative scoring | From ~$39 a month (unverified) | ? |
| **Madgicx** | ◐ AI ad generator | ✅ | ✅ | ✅ | ✅ | **Spend-tiered** $45–$329+ a month | ✗ |
| **Bïrch / Revealbot** | ✗ | ◐ bulk / rules | ✅ rules | ✅ every ~15 min | ✅ | Spend-tiered from ~$49–$99 a month | ✗ |
| **Pencil** | ✅ | ✅ (reviews) | ◐ | ◐ | ◐ | Generations: $14 / $55 a month; Pro custom | ? |
| **Smartly** | ✅ enterprise | ✅ | ✅ | ✅ | ✅ | **% of media spend**; floor about €5k a month | n/a |
| **Hunch** | ✅ feed-based DCO | ✅ | ◐ (roadmap H2-2026) | ◐ | ◐ | Enterprise, about €2,500 a month+ | n/a |
| **Omneky** | ✅ DCO | ✅ six networks | ◐ | ◐ | ✅ | $25–$99 a month + credits | ? |
| **AdEspresso** (Hootsuite) | ✗ | ✅ | ◐ | ✅ A/B tests | ✅ | $49 a month (spend cap $1k) / $99 / $259+ | ✗ |
| **Canva** | ✅ (templates, AI) | ✅ "publish ads directly" | ✗ | ✗ | ✗ | Inside Canva plans | ✅ UI |
| **Wix FB & IG Ads** | ◐ | ✅ managed | ✅ | ✅ (Wix-run) | ◐ | **15% of every payment**; $79–$4,999 a month | ✅ (Wix is Israeli; availability in Israel unverified) |
| **Google Pomelli** | ✅ assets | ✗ (manual upload) | ✗ | ✗ | ✗ | Free (Labs beta) | ✗ (English, limited countries) |
| **TikTok Symphony + Smart+** | ✅ | n/a (TikTok) | ✅ Smart+ | ✅ | ◐ | Free (ad spend) | ? |
| **AdScale** (Israeli) | ◐ | ✅ Meta + Google | ✅ ML | ✅ | ✅ | **2% of spend + €99–€499 a month** | ? |
| **Marketeam.ai "Ella"** (via Hapoalim) | ✅ content | ✗ organic only (per source) | ✗ | ✗ | ? | $99 a month, or $8 via Hapoalim | ✅ |
| **Solara AI** (Israeli) | ✅ avatar video | ◐ "smart social campaigns" | ? | ? | ? | ? | ✅ |

### 3.2 Zeely: the closest "create → launch" analogue for SMBs

- **What it automates:**
  - The user adds a product, generates static or **UGC-style video** ads and copy, picks a goal and budget, and attaches the creatives.
  - Only **square-format** AI creatives can be used in campaigns ([Zeely help](https://intercom.help/zeely-inc/en/articles/9874321-ad-campaign-launch), official).
  - After payment the campaign is "set up automatically and sent to our expert team for **moderation**". Support checks Meta-policy compliance and links (same help article; [zeely.ai/ai-employee](https://zeely.ai/ai-employee/), official).
  - The campaign is "usually live in **1–6 hours**".
  - Its AI "automatically optimizes delivery and shifts more budget to the creatives that perform best" ([zeely.ai](https://zeely.ai/automated-ad-creation/), official claim).
- **Money flow:** "your ad budget goes to **Zeely account** and then transferred to Meta ad account" ([ecommercefastlane](https://ecommercefastlane.com/zeely-ai-ads-reliability-review/), secondary). Zeely therefore acts as a reseller of ad spend, which is what makes a %-of-spend fee possible.
  - A newer App Store note says users can "connect your Meta account and publish ads directly" ([App Store](https://apps.apple.com/sr/app/id1586861768), official). Both models may coexist (unverified).
- **Pricing:**
  - Subscriptions: Starter $29.95, Plus $49.95, Growth $79.95 a month.
  - **About 12% service fee on ad spend** run through the launcher. The annual **Booster ($39.95 a year) halves it to about 6%**.
  - Exported creative carries no fee.
  - Sources: [creatify blog](https://creatify.ai/blog/zeely-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay) (competitor-authored), [fluxnote](https://fluxnote.io/guides/zeely-pricing) (secondary), [vidmuse](https://vidmuse.ai/blog/zeely-ai-review) (secondary).
  - At ₪3,000 a month of spend that is about ₪360 in fees plus about ₪185 subscription, so about **₪545 a month**.
- **Dashboard:** an analytics tab with **CTR, ROAS, conversions** ([ecommercefastlane](https://ecommercefastlane.com/?p=190645), secondary).
- **Reviews:** Trustpilot shows about 3,000 reviews averaging 4.3, with praise for ease of use. Complaints: **credits forfeited on cancellation**, confusion about plan and trial ([Trustpilot](https://www.trustpilot.com/review/zeely.ai?page=8), [Zeely blog](https://zeely.ai/blog/is-zeely-a-scam/)).
- **Takeaways:** copy the **human moderation option**, the **"live in hours" promise**, and the single flow from product to creative to goal, budget and launch. Avoid the ad-spend reseller model, the opaque percentage fee and credit forfeiture.

### 3.3 Creatify: AdMax and AI Media Buyer (the chat agent)

- **Creative:** URL→video, AI avatars (more than 1,500 actors per [yespress](https://yespress.io/creatify), secondary), Veo-based ads.
  - "Launch Ads to Meta" was added in 2025 ([usagepricing](https://usagepricing.com/blueprint/creatify), secondary).
  - A $15.5M Series A in May 2025 funded **AdMax**, an "end-to-end AI ad agent" (same source; [sacra](https://sacra.com/research/creatify), secondary).
- **AI Media Buyer:** listed in Creatify's own timeline under 2026-06. It reached Product Hunt on **2026-07-13** (#3 Product of the Day, 374 upvotes).
  - It connects to **Meta, Google, AppLovin and TikTok** ad accounts and analytics, and audits, builds, launches and optimises campaigns. It "generates new creatives from your actual winners and launches them, **all through chat**".
  - Later it added OpenAI Ads.
  - Sources: [hunted.space](https://www.hunted.space/product/creatify), [aitoolly](https://aitoolly.com/de/product/ai-media-buyer-by-creatify), [yespress](https://yespress.io/creatify) (secondary).
- **Pricing (mid-2026, conflicting):** free tier with 10 credits (about 2 videos); Starter **$39** a month (100 credits); Pro **$99** a month (300 credits). The annual discount dropped from 50% to 15%. API access is enterprise-only, or $99/$299 depending on source ([fluxnote](https://fluxnote.io/guides/creatify-pricing), [toolradar](https://toolradar.com/tools/creatify/pricing), [wireflow](https://www.wireflow.ai/blog/creatify-pricing), secondary).
- **Takeaways:**
  - "**Make more of your winner**" is the right loop. Our version: a winning hook leads to new variants from the same trend template, which are then launched.
  - A chat agent is now table stakes for English tools, but nobody offers it in **Hebrew**.
  - Reviewer caveat: "cheap abundance still needs an editor with taste" ([yespress](https://yespress.io/creatify)). Curated trend templates are the "taste".

### 3.4 AdCreative.ai

- Mainly a **creative generator with performance scoring**. I could not confirm a direct Meta launch; the claims in the results belong to other tools ([cometly](https://www.cometly.com/post/ai-ad-creation-tool), [adstellar](https://adstellar.ai/blog/what-is-the-best-ai-ad-platform-for-small-businesses), secondary).
- Price "starting at $39/month" ([segwise](https://segwise.ai/blog/best-ai-ad-generators-for-meta-2026), secondary, unverified).
- **Takeaway:** a "creative score" before launch is a cheap trust feature. We can score the hook against the B-hook-taxonomy rules.

### 3.5 Madgicx (Meta-centric optimiser)

- **Pricing is by monthly ad-spend bracket** (PricingSaaS, 2026):

  | Monthly ad spend | Price a month |
  |---|---|
  | Under $1K | $45 |
  | $1K–$2.5K | $69 |
  | $2.5K–$5K | $119 |
  | $5K–$10K | $129 |
  | $10K–$20K | $229 |
  | $20K–$30K | $329 |
  | $30K+ | Not disclosed |

  - The under-$1K tier was **cut from $99 to $45 in late March 2026**.
  - Add-on: Tracking Pro, $49 a month.
  - 7-day trial.
  - Sources: [pricingsaas](https://pricingsaas.com/companies/madgicx), [pricingsaas diff 2026W13](https://pricingsaas.com/companies/madgicx/diffs/2026W13) (secondary), [get-ryze](https://www.get-ryze.ai/blog/madgicx-pricing-2026) (competitor-authored).
- **Reviews:** Trustpilot **about 2/5 across about 268 reviews**. Complaints: charged for **annual plans after cancelling the trial**, refund refusals, hard-to-find cancellation, slow support ([Trustpilot](https://www.trustpilot.com/review/madgicx.com?page=4); cancellation steps: [academy.madgicx.com](https://academy.madgicx.com/lessons/unsubscribe)).
- Israeli origin: widely reported, but **not confirmed in this run (unverified)**.
- **Takeaways:**
  - Spend-tiered pricing is normal in the category.
  - Billing dark patterns destroy trust, so make cancellation a single click. Israeli consumer law also requires easy cancellation (see `06-israel.md`).

### 3.6 Bïrch (formerly Revealbot): a rules engine only

- revealbot.com now redirects to bir.ch. Rules run about **every 15 minutes** across Meta, Google, TikTok and Snap. Examples: "if CPA on this ad set > $40 over the past 3 days → pause"; "if ROAS > 3× → raise budget 20%" ([superscale review](https://superscale.ai/alternatives/revealbot/review), competitor-authored; [hackceleration](https://www.hackceleration.com/labs/review/revealbot), secondary).
- **It does not create ads**: "no statics, no video, no copy".
- **Pricing:** Essential about $49 a month billed annually ($99 monthly) up to $10K spend; Pro about $99. A slider scales the price with spend, with overage charges. 14-day trial ([superscale pricing](https://superscale.ai/alternatives/revealbot/pricing), [toolradar](https://toolradar.com/tools/revealbot/pricing)).
- One reviewer says it pays off only at **about $20K a month of spend or more**; below that, Meta's native rules suffice. Setup takes 60–90 days.
- **Takeaway:** SMBs do not need a rules *engine*. They need **3–5 preset Hebrew rules as toggles** (§7, idea 8).

### 3.7 Pencil (Brandtech)

- Generative creative with performance prediction. Reviews describe direct publishing to Meta, TikTok and Google, and launching and tracking on several networks ([toolsforhumans](https://www.toolsforhumans.ai/ai-tools/pencil-ai), [vidmuse](https://vidmuse.ai/blog/pencil-ai-review), secondary).
- Pricing as of September 2026:

  | Plan | Monthly | Annual billing | Generations |
  |---|---|---|---|
  | Core | $14 | $11 | 50 |
  | Growth | $55 | $44 | 250 |
  | Pro | Custom | Custom | Unlimited |

  Source: [superscale](https://superscale.ai/alternatives/pencil/pricing), competitor-authored. A Pro tier of "around $1,500 a month" is unverified.
- Acquired by The Brandtech Group in 2023. Reviewer rating 3.5/5 ([aiindigo](https://aiindigo.com/blog/pencil-review-2026)).

### 3.8 Smartly (enterprise benchmark only)

- Quote-only. Reportedly a **percentage of media spend**: about a €5,000-a-month floor, sliding to about 3% above €500k a month. Practical minimum about $4–5k a month; "poor fit for SMB" ([superscale](https://superscale.ai/alternatives/smartly/pricing), competitor-authored). Other estimates: $50k–$500k+ a year ([theaiagentindex](https://theaiagentindex.com/agents/smartly-io)).
- "Smartly Synapse" adds planning and execution agents.
- **Takeaway:** it shows the enterprise end of the "% of spend" model. Irrelevant for our customers, but a reference for the agency tier.

### 3.9 Hunch

- Feed-based dynamic creative automation for **Meta and Snapchat**, with TikTok in staged beta in 2026. The 2026 roadmap lists "**intelligent campaign management** in H2 2026" ([hunchads roadmap](https://www.hunchads.com/product-roadmap), official).
- Enterprise "Contact sales". About **€2,500 a month** starting price (unverified) ([admanage review](https://admanage.ai/blog/hunch-ads-review), [subscribed.fyi](https://subscribed.fyi/hunch/review), secondary). Capterra 4.7 from 13 reviews.
- **Takeaway:** product-feed→video ("Catalog Product Videos") is a good later feature for e-commerce niches.

### 3.10 Omneky

- DCO across **Meta, Google, TikTok, YouTube, LinkedIn and Reddit**, with direct launch; connecting ad accounts is free ([omneky blog](https://www.omneky.com/blog/how-to-use-omneky-to-2x-sales), official).
- Credit prices were cut 50–66% in April 2026; a full DCO test set costs about $50–$300. Plans: $99 a month Standard or $79 annual; self-serve $25–$99 ([rework](https://resources.rework.com/tools/ai-tools/best-ai-tools-for-facebook-instagram-ads-2026), secondary). Prices conflict.

### 3.11 AdEspresso (Hootsuite)

- Meta-first campaign creation and **split testing**.

  | Plan | Price a month | Ad-spend limit |
  |---|---|---|
  | Starter | $49 | $1,000 a month |
  | Plus | $99 | Unlimited |
  | Enterprise | From $259 | n/a |

  14-day trial; G2 3.6/5 across 74 reviews ([pricingsaas](https://pricingsaas.com/companies/adespresso), [g2](https://www.g2.com/compare/adespresso-by-hootsuite-vs-facebook-for-business), secondary; [get-ryze](https://www.get-ryze.ai/blog/adespresso-pricing-2026), competitor-authored).
- **Takeaway:** a **managed-spend cap per tier** is an established, accepted pricing lever. It is the model I recommend in §8.

### 3.12 Canva → Meta Ads

- Share → **Meta Ads** → Connect to Meta, then "publish ads **directly** to your Facebook and Instagram business accounts from the editor". It requires **Admin** access in Business Manager for the ad accounts you sync ([Canva help](https://www.canva.com/help/connect-meta-account/), official).
- Budget optimisation and reporting were not found.
- **Takeaway:** Canva is the Israeli SMB's default design tool (unverified, but very likely) and has a Hebrew UI, so "design → publish an ad" is already familiar. Our edge is **video, hooks, outcomes and reporting**.

### 3.13 Wix "Facebook & Instagram Ads by Wix" (an Israeli company)

- A single monthly subscription of **$79–$4,999**. **85% goes to the Meta ad budget and 15% is the Wix fee** "for running your campaign, optimization, testing and more". It renews automatically each month.
- Payments are **non-refundable**; unspent budget carries over. Mid-month increases are prorated. Wix recommends running for at least **2 months**. VAT is not included.
- Sources: [Wix help: budget & subscription FAQ](https://support.wix.com/en/article/facebook-instagram-ads-faqs-about-the-campaign-budget-and-subscription), [refund policy](https://support.wix.com/en/article/facebook-instagram-ads-about-the-refund-policy), [changing budget](https://support.wix.com/en/article/facebook-ads-changing-your-budget-during-a-campaign), [stores FAQ](https://wix.com/wix-lp/stores-paid-ads/faq) (official).
- **Takeaways:**
  - The fee is "hidden inside the budget": at a ₪3,000 payment, ₪450 goes to Wix. Our message can be "**כל שקל מהתקציב הולך למטא**".
  - Wix's simple **monthly-budget mental model** ("₪X a month" rather than a daily budget) suits SMBs. Show both: "₪30 ליום ≈ ₪900 לחודש".

### 3.14 Shopify (Meta's own app)

- Meta's official "Facebook & Instagram" Shopify app (catalog, promotion, targeting) is rated **3.7 across about 4,910 ratings** ([apps.shopify.com](https://apps.shopify.com/facebook?locale=he), official listing).
- This is a channel for e-commerce niches. The rating shows that even Meta's own simplified flows frustrate merchants.

### 3.15 Google Pomelli

- Google Labs with DeepMind, **October 2025**. It builds a "**Business DNA**" from the website URL and then generates campaign ideas and on-brand assets. "Photoshoot" (product image → campaign photography) was added in February 2026.
- **It does not push to Google Ads, track performance or report**; the user uploads the assets manually.
- Beta in English for the US and a few other countries.
- Sources: [dataslayer](https://www.dataslayer.ai/blog/how-to-use-pomelli-for-google-ads-creatives), [cyberclick](https://www.cyberclick.es/numerical-blog/pomelli-que-es-y-como-funciona-la-nueva-ia-de-google-para-marketing) (secondary).
- **Takeaway:** copy the "**Business DNA from URL**" onboarding. Our "brand kit from website/Instagram" step in 03-app-ux should feel this effortless.

### 3.16 TikTok Symphony + Smart+

- Symphony is the generative creative suite: video and image generation, avatars, translation and dubbing. **Creative Studio is GA** for logged-in TikTok for Business users, and all outputs are labelled "AI-generated" ([TikTok blog](https://ads.tiktok.com/business/en-US/blog/tiktok-symphony-ai-creative-suite), official).
- **Smart+** handles targeting, bidding, placements and budget; Symphony does not.
- **Symphony Automation** in Ads Manager (May 2026) offers "Recommended Creatives" from the destination URL and "Automatic Enhancements" (translation and dubbing into 50+ languages).
- The upgraded Smart+ for SMBs offers **full, partial or manual control** ([dataslayer](https://www.dataslayer.ai/blog/tiktok-smart-symphony-2026), [elevarus](https://elevarus.com/tiktok-symphony-automation-smart-plus-playbook-may-2026/), secondary).
- **Takeaway:** the "**full / partial / manual control**" dial is a good UX pattern: default to "אוטומטי", with "אני רוצה לשלוט" available.

### 3.17 Israeli players

| Player | What it is | Pricing | Relevance |
|---|---|---|---|
| **AdScale** (Yokneam, Israel; founded 2014 per one directory, unverified) | ML optimisation of Google Search, Shopping, Display, YouTube, Facebook and Instagram campaigns | **Basic 2% of spend + €99 a month; Pro 2% + €249; Enterprise 2% + €499**; agency €245 for 5 accounts; e-commerce from $39 | Israeli precedent for "% + fee". GetApp 4.5/5 (40). One Trustpilot complaint: no response to issues, refund refused "because ad spend was paid to Google/Meta" ([getapp](https://www.getapp.com.au/software/113187/adscale), [softwareadvice](https://www.softwareadvice.co.uk/software/178342/adscale), [trustpilot](https://it.trustpilot.com/review/adscale.com), secondary) |
| **Marketeam.ai "Ella"** via **Bank Hapoalim** | Virtual AI marketing manager: learns the business, creates designed content, **publishes organically** | $99 a month; Hapoalim customers get 6 months free, then **$8 a month** | Closest Israeli competitor for the organic side, distributed by a bank. Launch campaign by Gitam BBDO with Amos Tamam and "Dr. Shakshuka" ([Maariv](https://www.maariv.co.il/economy/israel/article-1164816), [ice](https://www.ice.co.il/advertising-marketing/news/article/1053931), [ice](https://www.ice.co.il/advertising-marketing/news/article/1049447), sponsored/secondary). Paid-ads capability is not mentioned (unverified) |
| **Solara AI** (Israeli startup) | Websites, **avatar video content**, "smart social media campaigns", 24/7 customer answering, as an alternative to agencies | ? | Direct positioning overlap; depth unknown ([ice.co.il](https://www.ice.co.il/career/news/article/1093997), secondary) |
| **Keywee** (Israeli) | NLP-driven content targeting for publishers | ? | Not SMB-focused ([ynet](https://www.ynet.co.il/digital/technews/article/4960077)) |
| **Wix** (Israeli) | See §3.13 | 15% of payments | Most likely Israeli SMB touchpoint for "ads without an agency" (Israeli availability unverified) |
| Israeli agencies and freelancers | Manual management | See §5.1 | The real incumbent for SMBs who don't self-serve |

The Hebrew searches ("ניהול קמפיינים בפייסבוק לעסקים קטנים אפליקציה", "פלטפורמה לניהול מודעות פייסבוק לעסקים בלי סוכנות") returned **no Israeli self-serve "create + launch" app**. Results were Meta's own tools, CapCut guides and US tools. **This is white space (as far as search shows).**

### 3.18 Others worth a glance (not researched in depth)

- **Ryze AI**: "Paid Ads Autopilot" at a **flat $89 a month, never spend-tiered** (stated in its own guide, competitor-authored, [get-ryze](https://www.get-ryze.ai/blog/madgicx-pricing-2026)). A flat-price precedent.
- **Plai**: SMB, agency and franchise multi-channel automation of setup, targeting and budget. Price unclear (Capterra snippet "$15/user/month", unverified) ([softwareadvice](https://www.softwareadvice.com.au/software/480718/Plai)).
- **AdStellar, AdManage, Superads, Segwise, NovoAds**: English tools, many publishing comparison content. None Hebrew.

---

## 4. Pricing models in the category

| Model | Who | Example numbers | Pros | Cons for us |
|---|---|---|---|---|
| **% of ad spend on top** | Zeely | About 12% (6% with Booster) + $30–$80 a month | Scales with the customer | Feels like a tax; Israelis read it as "you profit when I spend more"; requires reselling ad spend or metering it |
| **% inside the budget** | Wix | 15% of a $79–$4,999 payment | Simple "one price" | Hidden fee; non-refundable; we would have to collect ad money (payments licensing, VAT, refunds) |
| **% + flat fee** | AdScale, Smartly | 2% + €99–€499; Smartly about 3% with a €5k floor | Common with agencies | Complex for SMBs |
| **Spend-tiered flat** | Madgicx, Bïrch | $45 (<$1K) to $329 ($20–30K) | Predictable | Each new bracket feels like a penalty |
| **Flat with a spend cap** | AdEspresso | $49 up to $1k a month of spend; $99 unlimited | Simple, honest | Needs a cap check |
| **Flat, never tiered** | Ryze | $89 a month | Simplest | Leaves money on the table with agencies |
| **Credits / generations** | Creatify, Pencil, Omneky | $39 / $99 a month; $14 / $55 a month | Matches creative cost | Doesn't price the management value |
| **Free (ad spend only)** | Meta, TikTok | Free | Unbeatable price | Complexity, no Hebrew creative |

**Conclusion:** a flat plan with a managed-spend cap plus credits fits our existing plan structure and lets us claim **"0% מהתקציב"** against Zeely, Wix and agencies (§8).

---

## 5. Israeli market numbers

### 5.1 Agency and freelancer fees for managing Meta campaigns

| Source | Figure | Status |
|---|---|---|
| `06-israel.md` §2.3 | Paid-ads management (Meta + Google): **₪1,500–₪5,000 a month + ad budget**; boutique agency including campaign management: ₪3,500–₪8,000 a month | **(estimate, unverified)**. Five Hebrew searches in this run found no published Israeli price lists |
| US 2026 benchmarks | Agency $500–$10,000 a month for "seemingly identical services"; **mid tier $1,500–$3,500 a month** (dedicated strategist, optimisation several times a week); strategy-only $500–$1,200 a month; hybrid models of retainer plus a smaller % of spend are common | [clicksgeek](https://clicksgeek.com/?p=22701), [clicksgeek](https://clicksgeek.com/?p=21302), [lineardesign](https://lineardesign.com/blog/facebook-ad-management-packages-that-wont-break-the-bank/) (secondary) |
| Israeli historical | In 2010, the commission Facebook paid Israeli ad agencies was **15% of budget** | [walla 2010](https://finance.walla.co.il/item/1636214) (secondary, historical only) |
| Israeli earnings proxy | Influencer management at about a third of full time with 2–3 monthly clients yields about **₪8,000 a month** in income | [calcalist](https://www.calcalist.co.il/local_news/article/bjzqxyel3) (secondary; adjacent role) |

**Working assumption (unverified):** an Israeli SMB that outsources Meta ads pays a freelancer **₪1,000–₪2,500 a month** or an agency **₪2,000–₪5,000 a month**, often plus a setup fee, and **sometimes 10–15% of budget** for larger budgets. Validate with 10 quotes in M0 (§Open questions).

### 5.2 Typical SMB daily budgets in Israel

- **No Israeli source was found.**
- Indirect signals:
  - AdEspresso's SMB tier is capped at **$1,000 a month of spend** (about ₪3,700).
  - Madgicx's lowest bracket is **under $1K a month**.
  - Wix plans start at **$79 a month** including fee (about ₪290).
- **Estimate (unverified):** Israeli micro-businesses spend **₪20–₪100 a day (₪600–₪3,000 a month)**; small established businesses **₪100–₪300 a day**.
- Meta's minimum is account- and currency-specific. One source cites about **$1 a day** as a floor for impression-billed ad sets; minimums depend on currency, optimisation and bid strategy, with no published ILS figure ([kepla](https://kepla.notion.site/Budget-too-small-4770978609434e6897faf44def1d20e5), [tryvizup](https://www.tryvizup.com/blog/meta-ads-minimum-budget-requirements-2026), [relevantaudience](https://www.relevantaudience.com/facebook-ads/facebook-ads-cost-how-meta-charges/), secondary).
- An MCP tool exposes "minimum daily and lifetime budgets per ad account by currency and bid strategy" ([policylayer](https://policylayer.com/tools/oliverames-meta-mcp-server/meta-get-minimum-budgets)). The build should **read the minimum from the API**, not hard-code it.
- **Product default:** recommend **₪40 a day** for WhatsApp or lead objectives during a 7-day test. Never allow less than Meta's API minimum. Show "₪40 ליום = כ-₪1,200 לחודש" (heuristic, unverified).

### 5.3 Cost benchmarks for Israel (SuperAds dataset, USD, directional)

| Metric | Israel | Global | Window | Source |
|---|---|---|---|---|
| Median CPC, all industries | **$0.59 → $0.31** (average about $0.58) | about $1.07 | June 2025 → June 2026 | [superads CPC Israel](https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click/israel) |
| Average CPC 2025 | **$0.57** | $1.13 | 2025 | same family of pages |
| CPM, Entertainment | **$8.88** | n/a | 2025 | [superads CPM ent. Israel](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/entertainment/israel) |
| Cost per purchase | **about $31.8** (median) | about $49.8 | June 2025 → June 2026 | [superads CPP Israel](https://www.superads.ai/facebook-ads-costs/cost-per-purchase/israel) |
| CPL, all industries | Below global "for most months", with late-summer and fall spikes | n/a | April 2025 → April 2026 | [superads CPL Israel](https://www.superads.ai/facebook-ads-costs/cost-per-lead/israel) |
| CPL, Marketing & Advertising | 53.23 | 36.74 | September 2024 → May 2025 | [superads](https://www.superads.ai/facebook-ads-costs/cost-per-lead/marketing-advertising/israel) |
| CPL, E-commerce | 52.68 | 37.06 | 12 months | [superads](https://www.superads.ai/facebook-ads-costs/cost-per-lead/e-commerce/israel) |
| CPL, IT services | 16.05 | 35.85 | February → March 2025 | [superads](https://www.superads.ai/facebook-ads-costs/cost-per-lead/it-services-outsourcing/israel) |
| CPL, Manufacturing | 28.98 | 38.59 | April 2025 | [superads](https://www.superads.ai/facebook-ads-costs/cost-per-lead/manufacturing/israel) |
| CPL, Consumer goods / Media / Textiles | 231.59 / 139.25 / 111.0 | about 37 | about 12 months, very volatile | [superads](https://www.superads.ai/facebook-ads-costs/cost-per-lead/consumer-goods/israel) |

- The currency is presumably USD (unverified). The sample sizes are unknown, and the B2C local-service niches we target (salons, clinics, renovators, restaurants) are **not** broken out.
- **Do not show these numbers to customers as "benchmarks for your niche".**
- **Product implication:** benchmarks must come from **our own customers' anonymised results** per niche and city (network effect). Until we have enough data (for example, at least 20 campaigns per niche), show **wide ranges labelled as estimates**.
- Practitioner heuristic (unverified): Israeli local-service WhatsApp-conversation or lead costs are commonly in the **₪15–₪80** range.

---

## 6. Gaps and positioning for {{BRAND_NAME}}

1. **Hebrew-native video creative with hooks**: nobody does it (Meta Hebrew gen-AI unconfirmed; the others are English-first).
2. **Trend templates**: Meta, Creatify and TikTok generate variations of *your* assets. None curates *trending formats* per niche with one-click remakes.
3. **WhatsApp-first outcome**: Israeli SMBs live on WhatsApp. Click-to-WhatsApp ("פניות בוואטסאפ") should be the **default objective** for service niches (inference; consistent with the 06-israel niche analysis).
4. **No reselling of ad spend, 0% fee**: unlike Zeely and Wix. This also avoids the payments, refund and VAT burden of holding ad money.
5. **Organic → paid in one loop**: publish organically, find the winning hook by 3-second hold and skip rate, boost the winner (file 11 §7).
6. **Plain-Hebrew reporting with 4 metrics and one recommendation**: versus Ads Manager's dozens of columns.
7. **Agency tier for Israeli social-media managers**: multi-client, white-label Hebrew reports. Madgicx and AdEspresso serve this in English only.
8. **Distribution like Hapoalim × Marketeam**: bank, credit-card club, Bezeq-B144 or accountant-network bundles (idea, unverified feasibility).

---

## 7. The 20 best UX and feature ideas to copy for a Hebrew "create → launch → manage" flow

1. **Three-decision launch screen** (Zeely, Wix): **מטרה** (פניות בוואטסאפ / טופס לידים / שיחות טלפון / כניסות לאתר / צפיות), **תקציב** (₪ slider showing daily and monthly), **אזור** (radius around the business address on a map, or cities). Everything else is behind "הגדרות מתקדמות".
2. **Niche presets** (our A-niches): for example "מספרה → פניות בוואטסאפ, רדיוס 5 ק"מ, גילאים 18–55, ₪40 ליום". A recommended goal, budget and radius per niche, editable.
3. **Draft-then-approve** (Meta assistant "previews, approvals and controls"; MCP write tools default to PAUSED): every campaign is created **PAUSED** and shown as a phone preview (Feed, Reels, Stories) via Meta ad previews. A single "מפרסמים" button activates it.
4. **Hook A/B test by default** (Creatify "winners → new creatives", AdEspresso split tests): one launch = the same video with **3 different hooks** as 3 ads in one ad set. After 3–5 days or N results, show "הפתיח המנצח" with ₪ per result, and offer "צרו עוד 3 גרסאות מהמנצח".
5. **The control dial** (TikTok Smart+ full / partial / manual): "אוטומטי (מומלץ) / חצי-אוטומטי / ידני". Automatic maps to Advantage+ audience, placements and budget.
6. **Four-number dashboard** (Zeely CTR/ROAS/conversions, simplified further): **הוצאה עד כה ₪, פניות, ₪ לפנייה, % שעצרו לצפות (3 שניות)**, plus one plain sentence ("הקמפיין עובד טוב: ₪22 לפנייה, זול מהממוצע בתחום שלכם").
7. **Weekly Hebrew report on WhatsApp or email** (Meta's "scheduled reports and alerts" test): "השבוע: 37 פניות · ₪21 לפנייה · הפתיח המנצח: 'עצרו! …' · המלצה: להעלות תקציב ב-20%". One tap opens the dashboard.
8. **Preset rules as toggles** (Bïrch logic, without the engine UI):
   - "עצרו מודעה אם ₪ לפנייה גבוה מ-X במשך 3 ימים"
   - "הגדילו תקציב ב-20% למנצח (פעם ב-3 ימים לכל היותר)"
   - "התראה אם לא היו פניות 48 שעות"
   - "התראה על עייפות קריאייטיב"
   - "עצרו הכל אם ההוצאה החודשית הגיעה ל-₪Y"
9. **Big pause and resume** plus **budget edit with a learning-phase warning** ("שינוי גדול עלול לאפס את הלמידה של מטא. מומלץ עד 20%").
10. **Monthly spend cap shown everywhere** (Wix monthly mental model): "תקרה חודשית ₪1,200, נוצלו ₪430". Enforce it with campaign `spend_cap` or ad-set lifetime budgets (verify the field in M0).
11. **Boost the organic winner** (file 11 §7): "הסרטון הזה הביא הכי הרבה צפיות אורגניות. להפוך אותו לקמפיין?"
12. **Lead inbox** (Instant Forms plus WhatsApp counts): leads appear in the app instantly through webhook. "התקשרו עכשיו" and "שלחו וואטסאפ" buttons, a reminder if a lead is untouched for 15 minutes, and CSV or CRM export.
13. **Creative fatigue → one-click refresh** (Creatify, Omneky DCO): when frequency rises or CTR falls, show "הגיע הזמן לסרטון חדש", then generate a new variant from the same trend template and swap it in.
14. **Connection wizard with a green checklist and a Hebrew fix for each failure** (a Canva-style connect flow, made friendlier):
   - Checklist: עמוד פייסבוק ✓, אינסטגרם מקושר ✓, חשבון מודעות ✓, אמצעי תשלום ✓, מספר וואטסאפ מקושר לעמוד ✓.
   - Failures: payment failed, ad account disabled, IG not linked, each with a deep link.
15. **Pre-flight policy check in Hebrew** (Zeely's "expert moderation", automated):
   - Flags Meta-policy risks: personal-attribute phrasing like "את סובלת מ…", before/after health claims, guaranteed-income claims.
   - Auto-detects **special ad categories** (housing, real estate, employment, credit or finance).
   - Optional **"בדיקת מומחה"** human review on paid plans.
16. **Transparent money badge**: "התקציב משולם ישירות למטא מהכרטיס שלכם. אנחנו לא לוקחים אחוזים" (anti-Zeely, anti-Wix). Show Meta's charges separately from our subscription.
17. **Inline plain-Hebrew explanations and niche ranges**: "מה זה ₪ לפנייה?" with a range labelled "הערכה" until our own benchmarks exist.
18. **Agency mode** (Madgicx/AdEspresso): client switcher, white-label PDF and WhatsApp reports with the agency's logo, a **client approval link** before launch, and per-client monthly caps.
19. **Hebrew chat assistant over the customer's own data** (Creatify AI Media Buyer, Meta business assistant): "למה הקמפיין התייקר השבוע?" or "תעלה תקציב ב-₪10 לקמפיין של הטיפולים". Every action is **confirmed** before execution and recorded in a change log. The backend can be the Marketing API, with Meta's Ads MCP as an option (§Implications).
20. **"מה עובד עכשיו בתחום שלכם" trend feed** (Ads Creative Studio concepts; Pomelli "Business DNA"): curated trend templates per niche, showing hook, structure and example. "צרו בגרסה שלכם" leads to a draft campaign in two taps. Pair it with **Business DNA onboarding from the website or Instagram URL** (Pomelli).

**Honourable mentions:**
- Seasonal planner with Israeli holidays (ראש השנה, פסח, בלאק פריידיי, חזרה לבית הספר), with budget suggestions.
- "Live in hours" status timeline (Zeely 1–6 h): בבדיקת מטא → פעיל.
- Mobile-first: owners manage from the phone.
- One-click cancellation and no credit forfeiture surprises (lessons from Madgicx and Zeely complaints).

---

## 8. Recommended pricing for the Meta-management feature (₪, VAT included)

**Principle:** Meta management is **included** in the plans. There is **0% of ad spend**, and ad spend is always paid by the customer's own card directly to Meta. Plans are differentiated by **managed monthly ad spend cap**, **number of ad accounts** and **automation depth**. Video generation keeps consuming credits as today. **Launching, managing and reporting consume no credits.**

| Plan (existing price) | Meta management included | Managed spend cap (sum across campaigns, a month) | Notes |
|---|---|---|---|
| **חינם ₪0** (70 credits) | Connect Meta; build campaign drafts and see previews; **one "הקפצה" (boost) test** of up to ₪300 total spend; organic publishing to 1 page (per file 11 limits) | ₪300 total, once | Shows the magic before payment. No rules, no lead inbox |
| **בסיס ₪119** | 1 business (1 Page, IG and ad account); up to **2 active campaigns**; four-number dashboard; weekly Hebrew report; **2 preset rules**; pause, resume and budget edit; organic → boost | **₪3,000** | Covers most micro-businesses (§5.2) |
| **עסק ₪289** | Unlimited campaigns; **hook A/B tests**; all preset rules; **lead inbox** with WhatsApp/CRM export; creative-fatigue refresh; Hebrew chat assistant; seasonal planner | **₪15,000** | The "replace the freelancer" plan |
| **סוכנות ₪990** | **Up to 10 client ad accounts** (+₪79 a month per extra account); white-label reports; client approval links; per-client caps; team roles | **₪100,000** total | Positioned against Madgicx, AdEspresso and freelancers' tools |
| **Above the cap** | **No percentage.** Upgrade prompt, or add-on "**+₪99 לכל ₪10,000 נוספים**" (about 1%) | n/a | Still far below Zeely's ~12% and Wix's 15% |
| Optional add-on | **"בדיקת מומחה"**: a human reviews the setup and creative before launch, **₪149 per campaign**; or a partner-freelancer marketplace "ליווי חודשי" (revenue share) | n/a | Mirrors Zeely's moderation; converts agency-dependent users |

**Customer comparison at ₪3,000 a month of ad spend** (our estimates, FX ₪3.7 = $1):

| Option | Monthly cost |
|---|---|
| **{{BRAND_NAME}} בסיס** | **₪119** (including Hebrew video creation) |
| Zeely Plus + ~12% fee | about ₪545 |
| Wix | about ₪450 of the ₪3,000 goes to fees, so only about ₪2,550 reaches Meta |
| Israeli freelancer or agency | ₪1,000–₪5,000 (unverified) |
| Madgicx (<$1K bracket) | about ₪167, but no creative and English only |

**Why caps and not percentages:**
- Predictable and honest. It is the AdEspresso precedent ($49 with a $1k spend cap).
- Avoids holding ad money.
- Billing stays a simple flat Israeli subscription with VAT invoices (06-billing).
- It is a natural upsell trigger: when spend grows, the business is succeeding.

**Metering:** sum `spend` from Insights per connected ad account per calendar month (Asia/Jerusalem). Soft-warn at 80% of the cap. At 100%, **never auto-pause the customer's ads**; show an upgrade banner, and block *new* launches only. A grace period of 7 days avoids hurting results.

---

## Implications for the build prompt

**A. Product scope (new module "קמפיינים" in 03-app-ux and 04-data-api)**

1. Flow: **צור → פרסם → נהל**. After render, the result screen gets "פרסמו כקמפיין" next to "פרסמו אורגנית". The campaign wizard follows idea 1 (three decisions), with niche presets (idea 2) and the control dial (idea 5).
2. Default objective by niche:
   - Service niches: **Click-to-WhatsApp** (engagement/messages objective with a WhatsApp destination).
   - Clinics, lawyers, real estate, insurance: **Instant Form leads**.
   - E-commerce: traffic or sales.
3. Every launch creates **3 ads with 3 hooks** of the same video in one ad set (hook A/B, idea 4). Results join on `hook_id`, shared with file 11's organic analytics.
4. All objects are created with **`status: PAUSED`**. Activation happens only after an explicit user click; it is logged with user, time and diff.
5. Dashboard: 4 metrics + 1 sentence + "הפתיח המנצח". A deeper "פירוט" tab offers reach, frequency, CTR, CPM, ThruPlay and 25/50/75/100% video completion.
6. Preset rules (idea 8) are evaluated **hourly** by a background job, not every 15 minutes. That is enough for SMB budgets and kinder to rate limits. Guardrails:
   - Budget raises of at most 20% per 72 h per ad set.
   - Never raise above the plan cap or a user-set monthly cap.
   - Every automatic action goes to a Hebrew change log plus a WhatsApp or email notification.
7. Lead inbox, policy pre-flight, connection checklist, weekly report, agency white-label and approval links (ideas 12–18).
8. Copy everywhere: **"0% מהתקציב · התקציב משולם ישירות למטא"**.

**B. Meta API: version, objects, endpoints** (pin `META_GRAPH_VERSION=v26.0`; see file 11 §1; mechanics to be confirmed against the sibling Meta Ads report)

- **Use the unified Advantage+ structure.** Do not use `smart_promotion_type` or the legacy ASC/AAC APIs: they are paused in v26 ([dev blog 2026-02-13](https://developers.facebook.com/blog/post/2026/02/13/asc-and-aac-deprecation-mapi-v25/)). "Automatic" mode means Advantage+ budget, audience and placements, and the response's `advantage_state` should confirm it ([doc](https://developers.facebook.com/docs/marketing-api/advantage-campaigns)).
- Core endpoints (standard Marketing API; field names unverified where marked):
  - `GET /me/adaccounts?fields=id,name,currency,timezone_name,account_status,disable_reason,amount_spent,spend_cap,business`. Pre-flight requires `currency=ILS`, `account_status=1` and a funding source (unverified field: `funding_source_details`).
  - `POST /act_{id}/advideos`: video upload, resumable for large files (unverified detail). Alternatively reuse the IG or Page video already published organically (file 11 §7).
  - `POST /act_{id}/adcreatives` with `object_story_spec` (page_id, instagram_user_id, `video_data` with `video_id`, thumbnail, message, `call_to_action` e.g. `WHATSAPP_MESSAGE` / `SIGN_UP` / `LEARN_MORE`) (unverified CTA enum values). Set **creative-enhancement opt-outs** (`degrees_of_freedom_spec` / `creative_features_spec`) so Meta does not rewrite Hebrew text, add music or translate unless the user opts in (unverified field names, **M0-verify**).
  - `POST /act_{id}/campaigns` (`objective` in the `OUTCOME_*` family, e.g. `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_TRAFFIC`, `OUTCOME_SALES`; `special_ad_categories` **always sent**, usually `[]`; `status: PAUSED`).
  - `POST /act_{id}/adsets`:
    - Budget: `daily_budget` in **minor units (agorot)** (unverified for ILS).
    - Targeting: `geo_locations.custom_locations` (lat/long + radius km) or cities, plus Advantage+ audience.
    - Delivery: `optimization_goal` (e.g. `CONVERSATIONS` for WhatsApp, `LEAD_GENERATION`), `destination_type` (e.g. `WHATSAPP`, `ON_AD`), `promoted_object.page_id` (all unverified enum names, M0-verify).
  - `POST /act_{id}/ads` (`adset_id`, `creative.creative_id`, `status: PAUSED`).
  - `GET /{creative_id}/previews?ad_format=…` for phone previews (Feed, Reels, Stories formats).
  - `POST /{campaign|adset|ad id}` to change `status` or `daily_budget`.
  - `GET /{id}/insights` with `fields=spend,impressions,reach,frequency,clicks,ctr,cpm,actions,cost_per_action_type,video_play_actions,video_p25_watched_actions…`, plus `level=ad`, `time_increment=1`. The hook rate is 3-second video views (`actions[action_type=video_view]`) divided by impressions (unverified mapping). For WhatsApp the result is "messaging conversations started" (action type `onsite_conversion.messaging_conversation_started_7d`, unverified).
  - Minimum budgets: read per account and currency from the API (an ad-account minimum-budgets edge exists per [policylayer](https://policylayer.com/tools/oliverames-meta-mcp-server/meta-get-minimum-budgets); exact edge name unverified).
  - Instant Forms: `POST /{page_id}/leadgen_forms` (privacy-policy URL required), `GET /{form_id}/leads`, **webhook subscription to Page `leadgen`** for real-time leads (needs `leads_retrieval`).
- **Insights refresh:** hourly for active campaigns (yesterday plus today), and a daily backfill of the last **28 days**, because Meta restates conversions within attribution windows (unverified window). Store `insights_daily(ad_id, date, …)`.
- **Permissions and review** (in the same Facebook Login for Business consent as file 11):
  - Scopes: `ads_management`, `ads_read`, `business_management`, `pages_show_list`, `pages_read_engagement`, `pages_manage_ads`, `pages_manage_metadata` (webhooks), `leads_retrieval`, `instagram_basic` (+ IG publishing scopes from file 11).
  - **Advanced Access** for each, plus App Review with a screencast of connect → create → launch → insights → pause, plus **Business Verification**. Marketing API access-tier and rate-limit uplift ("standard access") is needed before scale (exact tier naming unverified).
- **Ads MCP (`mcp.facebook.com/ads`)** is Meta-hosted, with consent scopes read / read-write / read-write-financial ([relevantaudience](https://www.relevantaudience.com/meta/meta-ads-mcp-open-to-developers/)). Do **not** build the core product on it. Use the Marketing API from our backend for deterministic flows. Evaluate MCP in M0 as an optional backend for the Hebrew chat assistant (idea 19), since it may track Meta's API changes for us.
- **Data model additions (04-data-api):**
  - `meta_connections` (tokens encrypted, scopes, business id)
  - `ad_accounts` (currency, timezone, status, cap)
  - `campaigns` / `ad_sets` / `ads` (mirrors with Meta ids, `created_by`, `launched_at`)
  - `hook_experiments` (video_id, hook_ids[], winner_hook_id, decided_at, rule)
  - `insights_daily`
  - `automation_rules` (preset_key, params, enabled) and `automation_actions_log`
  - `leads` (source form or WhatsApp, PII encrypted, status, assigned_to)
  - `managed_spend_monthly` (for plan caps)

**C. Gotchas to bake in**

1. **Ad account currency and time zone are fixed at creation.** Warn when a customer connects a USD account ("הדוחות יוצגו בדולרים").
2. **Payment method cannot be added via API.** Deep-link to Meta Billing, and re-check before every launch.
3. **Ad review delays and rejections:** show "בבדיקת מטא" status, map rejection reasons to Hebrew guidance, and offer "תקנו ושלחו שוב".
4. **Learning phase:** large or frequent budget or targeting edits reset it, so rules must throttle (§A6).
5. **Special Ad Categories** (housing, employment, credit/finance; scope in Israel unverified) restrict targeting: radius minimums and no age or gender targeting. Auto-detect them for real-estate, recruitment and finance niches (M0-verify which apply to Israeli advertisers).
6. **Meta creative enhancements** can break RTL overlays, swap music or auto-translate. Opt out by default; test in M0.
7. **AI labelling:** Meta labels ads made with *its* gen-AI tools ([about.fb.com 2025-02](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/)). For our own AI videos, follow file 11 §8 (C2PA/"AI info" handling), and keep Israeli consumer-protection disclosure for AI avatars or testimonials.
8. **WhatsApp destination** requires the WhatsApp Business number to be linked to the Facebook Page. The checklist must verify this.
9. **Lead data is personal data** under the Israeli Privacy Protection Law (Amendment 13 in force since August 2025; model knowledge). Encrypt it, set a retention policy, and keep a DPA. Follow-up marketing messages are subject to the anti-spam rules (Communications Law §30A) (unverified specifics, see 06-billing-legal-ops).
10. **We never hold ad spend.** This avoids payment-services licensing, refund disputes (see the AdScale and Wix complaints) and VAT on resold media.
11. **Rate limits:** Marketing API business-use-case limits. Batch requests, use exponential backoff, and cache Insights.
12. **Benchmarks:** do not show SuperAds numbers as niche benchmarks. Build our own from anonymised customer data, with k-anonymity of at least 20 campaigns per niche.

**D. Pricing in 06-billing-legal-ops:** add the managed-spend caps, account limits, free boost test, over-cap add-on and "בדיקת מומחה" add-on from §8. Launching and management consume **no credits**. Metering is by monthly Insights `spend` per connected account.

**E. Marketing site (02):** a comparison block, "קדימון מול סוכנות / Zeely / Wix / Ads Manager", built on the claims "0% מהתקציב", "עברית אמיתית", "מסרטון לקמפיין בדקות" and "דוח בוואטסאפ". **Do not name competitors with unverified numbers**; use generic "סוכנות ממוצעת" ranges labelled as estimates.

---

## Open questions / [M0-verify] items

1. **[M0-verify] Hebrew support in Meta's generative features:** Advantage+ text generation, translation, video generation captions and AI voiceover. Test in a real Israeli ad account. If Meta supports Hebrew well, our creative moat shrinks and we must lean harder on trends, hooks, video quality and UX.
2. **[M0-verify] Exact creative-enhancement opt-out fields** in v26.0 (`degrees_of_freedom_spec` / `creative_features_spec` feature keys). Do the defaults change Hebrew overlays or music?
3. **[M0-verify] Click-to-WhatsApp via API in v26:** the correct `objective`, `optimization_goal`, `destination_type`, CTA type and results `action_type` for "conversations started", and whether the Page↔WhatsApp link can be checked via API.
4. **[M0-verify] Minimum daily budget in ILS** per optimisation goal (read via the API edge; confirm its name), and whether `daily_budget` is in agorot.
5. **[M0-verify] Special Ad Categories** that apply to Israeli advertisers (housing, employment, financial products) and their targeting restrictions in Israel.
6. **[M0-verify] Marketing API access tier and rate limits** for a SaaS serving thousands of small ad accounts, plus App Review requirements for `ads_management` and `leads_retrieval`, and business verification timing.
7. **[M0-verify] Meta's agentic assistant and end-to-end automation:** is it available in Israel, in which languages, and when does it reach general availability? Re-check quarterly. It is the main strategic risk.
8. **[M0-verify] Meta Ads MCP**: is it usable server-side for multi-tenant SaaS (versus per-user desktop agents)? What are its terms, and is the "financial" scope needed for budget edits?
9. **[market] Israeli agency and freelancer fees:** collect 10 real quotes (Midrag, Facebook groups, Fiverr IL) for "ניהול קמפיין פייסבוק לעסק קטן". Confirm or replace ₪1,500–₪5,000.
10. **[market] Typical Israeli SMB daily budgets and CPL by niche:** run 5–10 pilot campaigns across target niches (salon, clinic, renovator, restaurant, real estate) and seed our own benchmarks. SuperAds data is not usable for local B2C niches.
11. **[market] Is Wix's FB & IG Ads product available to Israeli Wix sites?** Price in ₪? It is the most likely local substitute.
12. **[market] Marketeam.ai "Ella":** does it run *paid* Meta campaigns too? What adoption has it had through Hapoalim? Is there a bank or credit-card partnership opportunity for {{BRAND_NAME}}?
13. **[market] Solara AI:** product depth, pricing, and whether it launches paid campaigns.
14. **[pricing] Willingness to pay:** test ₪119 / ₪289 with the managed-spend caps against an alternative "₪49 a month add-on" in a landing-page test. Is ₪3,000 the right בסיס cap?
15. **[pricing] Madgicx Israeli origin and AdScale current prices:** confirm before using them in any comparison copy.
16. **[legal] Lead PII handling** (Amendment 13), anti-spam rules for WhatsApp follow-ups, and disclosure rules for AI avatars or testimonials in ads. Coordinate with 06-billing-legal-ops.
17. **[tech] Insights attribution windows and restatement period** in v26, to size the backfill job (28 days assumed).
