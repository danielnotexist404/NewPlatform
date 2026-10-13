# 09 — Product Hunt deep-dive: AI promo / branding / niche video, video agents, UGC ads and hook tools (2023–Oct 2026)

Research date: 2026-10-13. Author: sub-agent "v-producthunt".

## 0. Method, limits, and how to read this file

- **Tools:** WebSearch only (35 searches, the personal cap; all used). WebFetch/curl are blocked, so **no producthunt.com page was opened directly**. Every number comes from search-result summaries of producthunt.com pages or of third-party PH trackers:
  - **hunted.space** (launch dashboards: date, upvotes, comments, daily rank, "featured" flag, hunter)
  - **aitoolly.com/producthunt-daily** (daily vote tallies)
  - Occasional vendor blogs and launch-guide sites
- **Tracker caveat.** Trackers capture snapshots, so the same launch can show different numbers. Hera Launch, for example, appears as 231 upvotes/#4 in one capture and 455 upvotes/#1 in another. When snapshots conflict, all of them are quoted. A tracker line reading "not featured by Product Hunt yet … cannot win product of the day regardless of upvotes" means the launch never reached PH's featured homepage feed.
- **Tags used:**
  - `[verified: url]`: the fact appeared in that source's search summary
  - `[tracker: url]`: third-party PH tracker data, generally reliable but snapshot-dependent
  - `[unverified]`: single weak source, self-claim, or conflicting data
  - `[corrected: url]`: contradicts an earlier claim in files 02/03 or in the task brief
- **No duplication.** Files **02-ph-ads.md** and **03-ph-brand.md** already profile Creatify, Arcads, MakeUGC, Topview, HeyGen, Higgsfield, Mirage, VidAU, Ava Studio, Viva Labs, AdGen AI, AdCreative, InVideo, PromoAI, Hera, Golpo, Clueso, Jupitrr, CyberCut, CreatorKit, Velo and others. This file adds **new PH listings** and **new PH launch metrics**, and refers back to 02/03 for product details.
- **URL rule.** A `producthunt.com` URL is given only when that exact URL appeared in a search result, or already appeared in 02/03. For tracker-only products, the hunted.space URL is given instead. No PH URLs were constructed or guessed.

---

## 1. Executive summary (the 8 Product Hunt facts that matter for a Hebrew niche promo-video SaaS)

1. **PH rewards "launch videos for founders," not "promo videos for local businesses."** The 2025–2026 PH winners in AI video are mostly:
   - **launch/demo video makers:** Hera Launch (#1 Product of the Day, 30 Apr 2026) and Pexo (top of the 30 Sep 2026 daily list, 398 votes)
   - **ad agents:** Ava Studio (#3), Topview (#1), HeyGen Video Agent (#3)
   - **editing agents:** Levio by Jupitrr (#1, 706 upvotes)

   Vertical SMB tools sit at or near the bottom of the leaderboard:
   - **Real estate:** Reeloft "not featured"; Real Estate AI 105 upvotes, #22
   - **Restaurants:** Umami AI not featured
   - **URL→promo:** MarketingVideo 0 upvotes, #106

   Sources in §2. The **PH audience is global English-speaking makers**, not Israeli SMB owners. PH is a credibility, backlink and early-adopter channel, not the main acquisition channel for Israeli dentists or restaurants.
2. **The 2025–2026 winning tagline formula is "agent / AI creative team / URL-in → finished video."**
   - Pexo: "autonomous video agent … chooses the right AI model for each step"
   - Ava Studio: "Your AI creative team for video ads"
   - Viva Labs: "Cursor for Short Form Video Ads"
   - Agentmatic: whole launch campaign "from a single brief"
3. **Google Pomelli is on PH, and it did well:** launched 29 Oct 2025, **#4 of the day, 400 upvotes, 16 comments** [tracker: https://www.hunted.space/dashboard/google/launches/pomelli-by-google-labs]. A later "Pomelli 2.0 / Pomelli agent" listing describes "Business DNA" → marketing assets, a brand book and a complete website [tracker: https://hunted.space/product/pomelli-agent]. The free big-tech baseline for URL → on-brand marketing is therefore present on PH.
4. **The Golden Kitty Awards no longer exist.** PH published "RIP Golden Kitty Awards. Long live Orbit Awards" [verified: https://www.producthunt.com/p/producthunt/rip-golden-kitty-awards-long-live-orbit-awards].
   - **Replacement:** **Orbit Awards**, a quarterly series focused on traction, reviews, founder reviews and hands-on testing. The first edition was due "December 1", starting with AI Dictation. Judging criteria include whether a product is global or local.
   - **Date of the change: unverified.** One aggregator says Jan 2025; a PH profile snippet implies mid-2026.
   - **Last confirmed edition:** Golden Kitty **2024**, where the **AI-video category winner was reportedly OpenAI Sora** [unverified, secondary: https://news.aibase.com/news/15198]. Sora itself was shut down in 2026 (file 03).
   - **No "Golden Kitty 2025" video winners exist to cite** [corrected: https://www.producthunt.com/p/producthunt/rip-golden-kitty-awards-long-live-orbit-awards].
5. **Benchmark upvotes for this category are far below what generic launch guides claim.** Guides say #1 of the day "typically needed 1,200–1,800" [unverified: https://hub.causo.ai/guides/product-hunt-launch-2026-realistic-playbook]. In AI video, the observed figures are:
   - **#1 of the day:** ~450–750 upvotes (Hera Launch 455, Levio 706, VideoGen 735, JoggAI 695 and 754)
   - **#3–#4 of the day:** ~170–530 (Creatify Product Video 168 at #4, Pomelli 400 at #4, Ava Studio 274 at #3, Hera v1 531 at #3)
6. **Repeat launching is the norm for leaders.** Each major feature gets its own PH launch, and serious launches are often brought by a well-known hunter.
   - Repeat launches: Creatify has 5 launches, Higgsfield 4 "Launch of the Day" awards plus more, HeyGen relaunches its Video Agent, Hera has launched twice, OpusClip several times (02 + §2).
   - Hunters: Hera's two launches were hunted by **Garry Tan** [tracker: https://hunted.space/product/hera-6/launches/hera-5]; Creatify Product Video by **Kevin William David** [tracker: https://www.hunted.space/product/creatify/launches/creatify-product-video].
7. **Hook tools on PH are small, free and low-traction:**
   - Hooky
   - Viral Hook Generator
   - HookFix
   - ViralHook AI
   - Gala: 50 hooks from a URL, 40 upvotes
   - Hookest: a hook library, $9/mo, PH 24 Sep 2026 per a third party

   None is organized by local-business niche, and none is in Hebrew. Hooks work best as an embedded feature and an SEO/lead-magnet asset, not as a standalone paid product.
8. **No Hebrew or RTL-first AI video product was found on PH** (a `site:producthunt.com Hebrew AI video` search returned no PH pages). This is an **absence of evidence**, not proof of absence [unverified]. It is still the clearest "first" claim the user's product could make on PH (see §5).

---

## 2. (a) Table of Product Hunt listings found in this round (new vs. files 02/03)

Legend:
- **POTD** = Product of the Day.
- **"Not featured"** = the tracker says the launch never reached the PH featured feed.
- In the **Niche** column, "SMB-local" means the product targets local service businesses.

| # | Product (PH name) | PH / tracker URL | Tagline / what it does (as found) | Launch date | Votes / rank / badge | Niche |
|---|---|---|---|---|---|---|
| 1 | **Hera Launch** (hera.video) | [tracker](https://hunted.space/product/hera-6/launches/hera-5); maker profile [PH](https://www.producthunt.com/@leowuhera) | AI motion-graphics launch videos from one prompt | 30 Apr 2026 | **#1 POTD, 455 upvotes, 50 comments** (other snapshots: 231/#4; #3/233 per [creativeainews](https://www.creativeainews.com/articles/hera-launch-ai-product-launch-videos-prompt/)) | SaaS launch videos |
| 2 | **Hera** (v1) | [tracker](https://hunted.space/dashboard/hera-6) | AI motion-graphics video | Aug 2025 | **#3 POTD, 531 upvotes, 124 comments**; hunter Garry Tan | SaaS / brand motion |
| 3 | **Pexo** | [PH](https://producthunt.com/products/pexo-2), [aitoolly](https://aitoolly.com/producthunt-daily/2026-09-30) | "Autonomous video agent". Shapes the story, writes the script, picks the AI model per step, assembles the final cut. **Edits by leaving comments on frames.** Launch discount code. | ~30 Sep 2026 | **Top of aitoolly daily list, 398 votes** (next: Ferndesk 370). Featured flag conflicts; a hunted.space snapshot shows 0 votes/#158 *(conflicting)* | Launch / marketing videos |
| 4 | **Pomelli by Google Labs** | [tracker](https://www.hunted.space/dashboard/google/launches/pomelli-by-google-labs) | Website → "Business DNA" → on-brand campaigns for SMBs | 29 Oct 2025 | **#4 POTD, 400 upvotes, 16 comments** | SMB marketing (free) |
| 5 | **Pomelli 2.0 / Pomelli agent** | [tracker](https://hunted.space/product/pomelli-agent) | Business DNA → marketing assets, brand book, complete website | 2026 (date n/a) | n/a | SMB marketing |
| 6 | **Levio by Jupitrr AI** | [tracker](https://www.hunted.space/product/jupitrr/launches/levio-by-jupitrr-ai); company [PH](https://www.producthunt.com/products/jupitrr) | "AI video editing agent". Chat to edit visuals, captions, **hook text**; no timeline | 21 Jul 2025 | **#1 POTD, 706 upvotes** | Coaches / creators |
| 7 | **Creatify Product Video** | [tracker](https://www.hunted.space/product/creatify/launches/creatify-product-video); [PH](https://www.producthunt.com/products/creatify) | Product URL → video ad | 5 May 2025 | **#4 POTD, 168 upvotes, 110 comments**; hunter Kevin William David | E-commerce ads |
| 8 | **Zeely AI** | [tracker](https://hunted.space/product/zeely-ai) | "AI ad maker for UGC videos and static ads" | 14 May 2026 | **64 upvotes, #55** | SMB sellers |
| 9 | **JoggAI** | [aitoolly](https://aitoolly.com/producthunt-daily/2024-10-04) | AI video ad generator: URL / product visuals → ads, avatars, templates | 4 Oct 2024 | **695 votes, top of daily list** (featured flag inconsistent) | E-commerce ads |
| 10 | **JoggAI 2.0: AI Avatar Generator** | [aitoolly](https://aitoolly.com/producthunt-daily/2025-01-21) | Text → personalized avatars | 21 Jan 2025 | **754 votes, top of daily list** | Avatars for ads |
| 11 | **Agentmatic** | [PH](https://www.producthunt.com/products/agentmatic) | Whole launch campaign from one brief: copy, product images, **short-form video**, email sequences, strategy. 21-day free trial. | n/a | n/a | Launch campaigns |
| 12 | **VIDEO AI ME Social Scheduler** | [PH](https://www.producthunt.com/products/video-ai-me) | "Create videos with AI actors that sound and look real" + scheduling | 27 Apr 2026 (a relaunch is possibly later) | n/a | UGC ads + scheduling |
| 13 | **Adomate** | [PH](https://www.producthunt.com/products/adomate) | "Turn data into winning ads. At scale." | ~Aug 2026 | Page lists **#1 of its launch day** *(unverified, snippet)* | Performance ads |
| 14 | **ChatCut** (AI video editor) | [PH awards](https://www.producthunt.com/products/chatcut-ai-video-editor/awards) | Chat-based AI video editor; has 2026 PH awards | 2026 | Awards page exists (details n/a) | Editing |
| 15 | **MarketingVideo** | [tracker](https://hunted.space/product/marketingvideo) | Paste URL → AI visits site, writes scenario, **composes original music, records VO**, renders animated promo. "Creative" or "Professional" styles. **From $2/video.** | n/a | **0 upvotes, #106, not featured** | SMB / any website |
| 16 | **ReelRun** | [tracker](https://webmail.hunted.space/product/reelrun) | Paste URL → "AI director" studies the site, builds a **brand profile**, cuts a 15–30 s cinematic reel. Free with watermark; **$9 HD export.** | n/a | n/a | SaaS / indie hackers |
| 17 | **URLmotion** | [tracker](https://www.hunted.space/product/urlmotion) | Any URL → branded 60-second explainer in under 2 min | n/a | n/a | Explainers |
| 18 | **CreatView** | [tracker](https://hunted.space/product/creatview) | "AI Video Agent for Films & Ads and Social Videos". Idea, script or product URL → picks models, creates shots | n/a | 0 upvotes (snapshot) | Ads / social |
| 19 | **VideoBud** | [tracker](https://hunted.space/product/videobud) | AI browser agent walks your live web app, records real screens, adds VO → promo, demo, onboarding videos | n/a | n/a | SaaS demos |
| 20 | **Reel Estate** | [PH](https://www.producthunt.com/products/reel-estate/makers) | Property photos → listing videos with motion, music, captions, plus virtual staging | n/a | n/a | **Real estate** |
| 21 | **ChatRealtor** (2nd launch) | [PH forum post](https://www.producthunt.com/p/chatrealtor/second-launch-for-chatrealtor-on-product-hunt) | Paste a Zillow URL, pick photos → short video with AI VO and music, "in 2 minutes" | n/a | n/a | **Real estate** |
| 22 | **Realty World AI** | [tracker](https://hunted.space/product/realty-world-ai) | Listing photos → aerial/drone-style walkthroughs **powered by Kling AI** | n/a | n/a | **Real estate** |
| 23 | **Peachgum AI** | [tracker](https://www.hunted.space/product/peachgum-ai) | Listing photos + style + soundtrack → cinematic short-form video | n/a | n/a | **Real estate** |
| 24 | **Reeloft** | [tracker](https://www.hunted.space/product/reeloft) | Paste a Zillow / Realtor.com / Redfin / Apartments.com / Homes.com URL → import photos → video with music or narration | n/a | **Not featured** | **Real estate** |
| 25 | **Real Estate AI** (MarketAI) | [tracker](https://www.hunted.space/dashboard/realestateai/launches/real-estate-ai) | AI marketing for agents | 18 Oct 2023 | **105 upvotes, 21 comments, #22** | **Real estate** |
| 26 | **Umami AI** | [tracker](https://hunted.space/product/umami-ai) | AI food photography + short promo food videos for restaurants, delivery brands, cafes | n/a | **Not featured** | **Restaurants** |
| 27 | **MerchReel** | [tracker](https://webmail.hunted.space/product/merchreel) | Shopify product → AI video ad, script from product data, AI avatar presenter. 7-day free trial, no card. | n/a | **Not featured** | **E-commerce / Shopify** |
| 28 | **ShowcaseAI** | [tracker](https://www.hunted.space/product/showcaseai) | "Create AI product videos, talking avatars, and high-converting ads in minutes" | n/a | Snippet says "0 upvotes … #3 Product of the Day" (**internally inconsistent**) | E-commerce |
| 29 | **AiAdGen** | [tracker](https://hunted.space/product/aiadgen) | Product photos / prompts → AI video ads for e-commerce and small businesses | n/a | 0 upvotes, #33 | E-commerce / SMB |
| 30 | **UGCad AI** | [tracker](https://www.hunted.space/dashboard/ugcad-ai) | AI UGC video ads; maker claims **50,000+ videos for 2,500+ brands** | n/a | n/a | UGC ads |
| 31 | **"Generate ads for your website"** (UGC AI Video Generator) | [tracker](https://www.hunted.space/product/ugc-ai-video-generator/launches/generate-ads-for-your-website) | Website → UGC ads | n/a | 8 upvotes, #38 | UGC ads |
| 32 | **Pommy AI** | [tracker](https://hunted.space/product/pommy-ai) | "Autopilot" that generates, schedules and optimizes reels, shorts and video ad campaigns | n/a | 0 upvotes, #67 | SMB social autopilot |
| 33 | **SnapReel AI** | [tracker](https://hunted.space/product/snapreel-ai) | "AI that manages your social media — automatically", **$79/mo** | n/a | 0 upvotes, 4 comments, #77 | SMB social |
| 34 | **Hooky** | [PH](https://www.producthunt.com/p/hooky), [makers](https://www.producthunt.com/products/hooky/makers) | Hooks, on-screen text, titles, captions, thumbnail text for Reels/Shorts/TikTok; no signup | n/a | n/a | **Hooks** |
| 35 | **Viral Hook Generator** | [PH](https://www.producthunt.com/products/viral-hook-generator/makers) | Topic → 10 hooks; offline, no account | n/a | n/a | **Hooks** |
| 36 | **ViralHook AI** | [tracker](https://www.hunted.space/product/viralhook-ai-3) | 5 hooks + psychological explanation + script openers; EN/TR | n/a | n/a | **Hooks** |
| 37 | **HookFix** | [tracker](https://hunted.space/product/hookfix) | 6 scored and ranked hook directions per topic | n/a | n/a | **Hooks** |
| 38 | **Gala** | [tracker](https://hunted.space/product/gala-2/launches/gala-3) | **URL → 50 hooks**, "trained on TikTok and Instagram videos" | n/a | 40 upvotes | **Hooks** |
| 39 | **Hookest** | [tracker](https://hunted.space/product/hookest) | Free searchable library of trending TikTok/IG hooks; $9/mo tier | 24 Sep 2026 *(third-party)* | n/a | **Hook library** |
| 40 | **FacelessReels** | [PH](https://www.producthunt.com/p/faceless-reels-generator/faceless-reels-generator) | Topic → research → **fact-checked** faceless reels | n/a | n/a | Faceless shorts |
| 41 | **AutoReels** / **DuReel** | [tracker](https://www.hunted.space/product/autoreels), [tracker](https://www.hunted.space/product/dureel) | "Viral faceless reels in 60 seconds"; ideas, articles, podcasts → Shorts | n/a | Not featured | Faceless shorts |
| 42 | **VideoGen** | [vendor](https://videogen.io/news/product-of-the-day-on-product-hunt) | AI video generator | 6 Sep 2024 | **POTD, 735 upvotes, 206 comments** *(self-reported)* | General |
| 43 | **OpusClip** / **OpusClip Captions** | [tracker](https://webmail.hunted.space/dashboard/opus-clip/launches/opus-clip-ai), [tracker](https://www.hunted.space/product/opus-clip/launches/opusclip-captions) | Long video → viral clips; captions | 11 Jul 2023; 7 Apr 2024 | **#3 POTD, 519 upvotes, 231 comments**; **#2 POTD, 369 upvotes, 75 comments** | Creators |
| 44 | **Synthesia** (2nd launch) | [tracker](https://www.hunted.space/product/synthesia/launches/synthesia-2) | AI avatar video | 17 Sep 2020 | **#1 POTD** | Corporate |

**Already covered in 02/03 (PH metrics there, not repeated):**
- Ava Studio: 29 May 2026, #3, 274 upvotes
- Topview Motion Studio: 30 Aug 2026, #1, ~308–324
- HeyGen Video Agent: 27 Jun 2025, #3
- Higgsfield: 4 Launch-of-the-Day awards
- Mirage Studio: #16
- MakeUGC AI Ad Workflows: 26 May 2026
- VidAU, Viva Labs, Videotok, MagicAds, MoovAI, AdsTurbo, AdsGency, Adkit, AdGen AI, AdCreative, InVideo, PromoAI, Golpo, Clueso, Jupitrr, CyberCut, CreatorKit, Velo, TrendVideo

**Searched but not found on PH:**
- Pippit (CapCut): it has its own newsroom launches (Nov 2024 launch, 2025 rebrand from CapCut Commerce Pro, "Agent Mode" 22 Aug 2025) [verified: https://pippit.capcut.com/business/newsroom/capcut-commerce-pro-rebrands-to-pippit, https://technode.global/prnasia/pippit-launches-agent-mode-a-smart-engine-to-turn-any-idea-into-a-ready-to-share-video/]
- Arcads PH launch metrics
- Revid.ai PH metrics (its own page cites "Product Hunt feedback" and 3M+ sign-ups [unverified: https://www.revid.ai/reviews])
- Tagshop, Quickads, Icon
- Agent Opus
- Hooked.so, ContentHooks
- Any dental / clinic AI video product
- Any Hebrew product
- D-ID, Peech, LTX Studio PH ranks. A LinkedIn post says Hour One "was shared on Product Hunt", without date or rank [unverified].

---

## 3. (b) Top 10 PH listings most relevant to a "niche-based business promo video platform", and why

| Rank | Listing | Why it matters for the user's platform |
|---|---|---|
| 1 | **Pomelli by Google Labs** (#4, 400 upvotes) | The free benchmark. Website → Business DNA → on-brand campaigns, now with Veo-based Animate (file 03) and a 2.0 "agent" that also builds a brand book and website. Any paid "promo from your website" tool must beat it on **Hebrew, local niches, real footage and done-for-you**. It is English-only, in US/CA/AU/NZ beta per MIT Sloan ME ([mitsloanme](https://www.mitsloanme.com/article/google-labs-and-deepmind-unveil-pomelli-an-ai-marketing-tool/)), so Israel is not served yet. |
| 2 | **MarketingVideo** (URL → promo, from $2/video) | Closest functional twin of the user's MVP: URL → scenario → original music → VO → animated promo, with two style presets. **It got 0 upvotes and was not featured.** Lesson: a generic "URL to promo" pitch does not stand out on PH in 2026, so the niche plus Hebrew angle is required. |
| 3 | **Hera / Hera Launch** (#3 in 2025, #1 in 2026) | Shows that **motion-graphics brand videos** (not avatars) can win PH. Template-quality design plus "prompt to change anything". The pattern for a "סרטון תדמית" that looks designed rather than AI-uncanny. |
| 4 | **Pexo** (398 votes, top of day list) | The newest winning UX: an **agent that picks the model per shot** and **edits by commenting on frames**. Directly applicable on OpenRouter's multi-model video API (file 04): route per scene to Veo, Kling, Seedance or Wan. |
| 5 | **ReelRun** (URL → brand profile → 15–30 s reel, $9 HD export) | A pricing model that fits Israeli SMBs: **free watermarked preview, pay per HD export**. Also uses "brand profile" extraction, the same idea as Pomelli's Business DNA. |
| 6 | **Reel Estate / ChatRealtor / Reeloft / Realty World AI / Peachgum** | Real estate is the **most crowded vertical on PH**. All are "listing URL or photos → video". Realty World AI uses Kling for drone-style moves. For Israel, the input equivalent is a **Yad2 / Madlan listing or the agent's own photos**. Expect commodity competition, so differentiate with Hebrew VO, agent branding and per-listing hooks. |
| 7 | **Umami AI** (restaurants; not featured) | The only restaurant-specific PH listing found. AI food photography plus short promo videos. It confirms the vertical is underserved on PH. File 03 warns that AI-generated food looks fake, so **animate the restaurant's real dish photos**. |
| 8 | **Levio by Jupitrr** (#1, 706 upvotes) | A chat-based editing agent that explicitly edits **hook text**. Its parent Jupitrr is positioned for **coaches and consultants**, one of the few niche-positioned video products on PH. Shows niche positioning plus agent UX can hit #1. |
| 9 | **Creatify Product Video** (#4, 168 upvotes, 110 comments) and **Zeely AI** (64 upvotes, #55) | The two biggest SMB ad makers got modest PH results. **PH rank does not track revenue**: Creatify has $9M+ ARR (file 02). The PH launch is a credibility event, not the business. |
| 10 | **Gala** (URL → 50 hooks) and **Hookest** (hook library, $9/mo) | The closest PH analogues to the user's planned **per-niche hooks library**. Both are generic (TikTok/IG trends) and low-traction. The gap is a **niche × language** hook library (Hebrew hooks for dentists, lawyers, real-estate agents, restaurants) wired directly into video generation. |

Honourable mentions:
- **Agentmatic:** a brief becomes the whole campaign; a good model for a "campaign pack" upsell.
- **VideoBud:** a browser agent records the real product; relevant to SaaS-niche customers.
- **Pommy AI / SnapReel:** "autopilot" social posting at $79/mo; a possible retention feature, recurring monthly videos.

---

## 4. (c) Patterns in successful PH launches in this space

### 4.1 Positioning
- **Agent language beats generator language** in 2025–2026: "autonomous video agent" (Pexo), "AI creative team" (Ava Studio), "AI video editing agent" (Levio), "Cursor for …" (Viva Labs), "Video Agent" (HeyGen #3).
- **One input, one finished output.** Every top launch states the input explicitly: a URL, a prompt, a brief, listing photos, or a Shopify product.
- **Specific audience in the tagline wins over "for everyone."** Examples: "launch videos" (Hera), "video ads" (Ava, Creatify), "coaches & consultants" (Jupitrr). Generic "AI video generator" listings (TrendVideo AI, Text to Video AI, AI-powered video creator; file 03) have no notable traction.
- **Editing control is the second headline.** Founders anticipate the "AI output is 80% right" objection by showcasing revision UX:
  - comment-on-frame (Pexo)
  - chat edits (Levio)
  - "Prompt to change anything" (Hera)

### 4.2 Traction mechanics
- **Being "featured" is the gate.** Many vertical and indie launches (Reeloft, Umami AI, MarketingVideo, MerchReel, AutoReels, DuReel) were never featured and so **could not rank at all**, whatever their votes. Featuring depends on PH curation: polished assets, a clear maker story, and no vote-begging.
- **Upvote reality in AI video:** #1 ≈ 450–750, #3–#4 ≈ 170–530 (see §1.5).
- **Comments matter.** Creatify had 110 comments on 168 votes, and 2026 guides say PH ranks on "points" weighted by engagement from active, verified users. They also say vote requests and bursts of votes from new accounts are dampened [unverified, guide claims: https://teract.ai/resources/launch-product-hunt-2026, https://blog.innmind.com/how-to-launch-on-product-hunt-in-2026].
- **Hunters still appear on winning launches** (Garry Tan for Hera, Kevin William David for Creatify). One 2026 guide says the old hunter auto-notification boost is gone [unverified: https://hub.causo.ai/guides/product-hunt-launch-2026-realistic-playbook]. So a hunter adds credibility more than reach.
- **Relaunch every big feature.** Creatify (5 launches: original, Avatar, 2.0, Product Video, AI Media Buyer), Higgsfield (Soul, Product-to-Video, Ads 2.0, Vibe-Motion, Supercomputer, API), HeyGen (Video Agent twice, Avatar V, CLI), Hera (twice), OpusClip (main, Captions). PH lets the same product page accumulate launches and awards.
- **Timing:** guides disagree on the best day.
  - Tuesday/Wednesday has the most engaged traffic.
  - Friday and weekends have less competition.
  - The PH day starts 12:01 AM PT.

  [unverified: https://screenhance.com/blog/product-hunt-launch-checklist-2026, https://www.marketingideas.com/p/how-to-successfully-launch-on-product]

### 4.3 Pricing patterns visible on PH launches
- **Per-video pricing for SMB/indie tools:**
  - MarketingVideo: from $2/video
  - ReelRun: free with watermark, $9 per HD export
  - Sparkiz: $3 first video (file 02)
- **Launch-day discount codes** (Pexo) and **long trials**: Agentmatic 21 days, MerchReel 7 days with no card.
- **Subscriptions for "autopilot" products:** SnapReel $79/mo; Sidewalk Social (not confirmed on PH) Free/$39/$59 for local businesses [unverified: https://ai.g2.com/marketplace/tools/sidewalk-social].
- **Free hook tools as lead magnets** (Hooky, Viral Hook Generator, ViralHook AI), with an occasional cheap library tier (Hookest $9/mo).
- **The most common complaints in PH reviews are about credits.** Creatify reviewers cite confusing credit use and expiring credits (file 02). Transparent per-video pricing is a PH-visible differentiator.

### 4.4 Demo patterns
- **The launch video is made with the product itself.** The tools are literally video generators, and Hera, Fliki, Revid, Mootion and GenMotion all run "Product Hunt launch video" landing pages (file 03).
- **Show the before → after in the gallery:** URL or photos in, finished vertical video out, ideally with a timer ("in 2 minutes": ChatRealtor; "under 2 minutes": URLmotion; "60 seconds": AutoReels).
- **Model transparency as a selling point:** "powered by Kling AI" (Realty World AI); "chooses the right AI model for each step" (Pexo).

---

## 5. (d) Recommendations: how the Hebrew platform should differentiate, and how to launch it on PH

### 5.1 Differentiation (against what PH shows)
1. **Own "niche × Hebrew," not "URL → video."** URL → video is commoditized on PH: MarketingVideo, ReelRun, URLmotion, PromoAI, Pomelli, Creatify. Make the **niche the first screen**: pick a business type (רופא שיניים, עו"ד, מתווך נדל"ן, מסעדה, מכון כושר, קוסמטיקאית, מוסך, קבלן שיפוצים), then each niche gets its own:
   - script structures
   - Hebrew hook bank
   - shot list
   - compliance hints
   - CTA formats (WhatsApp, a call)
2. **Hebrew hook library as both a product feature and an SEO/PH asset.** PH hook tools are generic and English-only. A **Hebrew per-niche hook library** (public, indexable) is defensible content no PH competitor has. Each hook links to "make this video now."
3. **Real-asset-first generation.** For restaurants, clinics and real estate, animate the business's **own photos** with image-to-video, and keep fully generated footage for B-roll. AI food and AI people look fake (file 03), and Umami / Realty World show the image-to-video pattern.
4. **Revision UX à la Pexo/Levio, in Hebrew.** Use a chat or comment-on-frame editor ("תחליף את הפתיח", "קצר ל-15 שניות") instead of a timeline. RTL captions and Hebrew VO are rendered in your own layer (Remotion; files 03/05).
5. **Transparent ILS per-video pricing** with a free watermarked preview (the ReelRun pattern). This avoids the credit-confusion complaints that dominate PH reviews.
6. **Beat Pomelli where it is absent:** Pomelli is free, but English-only and not offered in Israel per its launch coverage. Position as "Pomelli-style Business DNA, but in Hebrew, with video, for Israeli niches."

### 5.2 Launching the Hebrew platform on PH (practical plan)
- **Set expectations.** PH voters are global English-speaking makers, and vertical SMB video tools rarely get featured or ranked (§2 rows 15, 24–27). Use PH for credibility, backlinks, investor and press signal, and the "Product Hunt badge" on the Hebrew landing page. **Do not** count on it for Israeli SMB customers.
- **Pick an English-legible angle**, for example: *"The first AI promo-video studio for right-to-left languages: Hebrew-native voice, RTL captions, and niche hook libraries for local businesses."* "RTL-first" is a global story; Arabic is a natural second language with the same RTL engineering. Avoid a Hebrew-only demo. Show split-screen Hebrew output with English subtitles.
- **Launch in sequence, like Creatify and Higgsfield:**
  1. **Launch 1 (pre-product / lead magnet):** a free "Niche Hooks Library" or hook generator (Hebrew + English), the cheapest way to build a PH follower base. Hook tools are a known PH genre.
  2. **Launch 2 (core):** "Niche promo video agent" with a URL/photos → Hebrew promo demo.
  3. **Later launches:** API, WhatsApp delivery, Arabic, an "autopilot monthly videos" plan.
- **Assets that get featured:**
  - a 30–45 s launch video made by the product itself
  - a gallery with before → after per niche (dentist, restaurant, real-estate listing)
  - a maker first-comment telling the founder story: what Israeli SMBs pay agencies for a סרטון תדמית today. Take real price points from file 06; no price was verified in this round.
  - a clear free tier and a launch-day code
- **Community:** use the Israeli maker community and existing customers to comment substantively, not "upvote please" (guides say vote-begging is penalized [unverified]). A known hunter adds credibility. Aim for **≥ 50 genuine comments**; Creatify got 110 on 168 votes.
- **Benchmarks to target:** a featured launch with **~200–450 upvotes** would put a niche video tool in the #1–#5 range seen in this category (§1.5). That is realistic only with a pre-built list of a few hundred engaged supporters [unverified guide claim: 400+ waiting subscribers ≈ 3–5× top-5 odds, https://hub.causo.ai/guides/product-hunt-launch-2026-realistic-playbook].
- **Awards:** target the **Orbit Awards** (quarterly, traction- and review-based) after accumulating PH reviews. Golden Kitty no longer exists.

---

## Verification addendum (2026-10-13)

**Searches used:** 35 of 35 (personal cap). No producthunt.com page could be fetched, so all data comes from search summaries and PH trackers (hunted.space, aitoolly).

**Newly verified (PH-specific):**
- Golden Kitty Awards retired and replaced by the quarterly Orbit Awards [verified: https://www.producthunt.com/p/producthunt/rip-golden-kitty-awards-long-live-orbit-awards]. Date of the change still unverified (Jan 2025 vs ~mid-2026).
- Pomelli by Google Labs on PH: 29 Oct 2025, #4, 400 upvotes, 16 comments [tracker: https://www.hunted.space/dashboard/google/launches/pomelli-by-google-labs]
- Hera Launch: 30 Apr 2026, #1 POTD, 455 upvotes; Hera v1: Aug 2025, #3, 531 upvotes; hunter Garry Tan [tracker: https://hunted.space/product/hera-6/launches/hera-5]
- Levio by Jupitrr: 21 Jul 2025, #1 POTD, 706 upvotes [tracker: https://www.hunted.space/product/jupitrr/launches/levio-by-jupitrr-ai]
- Creatify Product Video: 5 May 2025, #4, 168 upvotes, 110 comments [tracker: https://www.hunted.space/product/creatify/launches/creatify-product-video]
- Pexo: ~30 Sep 2026, 398 votes, top of aitoolly's daily list [tracker: https://aitoolly.com/producthunt-daily/2026-09-30]. Official POTD not confirmed.
- JoggAI: 695 votes (4 Oct 2024) and 754 votes (21 Jan 2025), top of aitoolly daily lists [tracker: https://aitoolly.com/producthunt-daily/2024-10-04, https://aitoolly.com/producthunt-daily/2025-01-21]
- OpusClip: #3 / 519 upvotes (Jul 2023); OpusClip Captions: #2 / 369 upvotes (Apr 2024) [tracker URLs in §2]
- 20+ new niche PH listings (real estate, restaurants, Shopify, hooks, faceless reels, URL → promo) with URLs in §2.

**Corrections to files 02/03 and to the brief:**
1. **Zeely:** file 02 §1.5 says "no PH launch found". In fact Zeely AI launched on PH on **14 May 2026: 64 upvotes, #55** [corrected: https://hunted.space/product/zeely-ai]
2. **Hera Launch:** file 03 §2 gives "416 votes, Featured". Tracker data shows **455 upvotes and #1 Product of the Day**; other snapshots show 231/#4 and 233/#3 [corrected: https://hunted.space/product/hera-6/launches/hera-5]
3. **Creatify "#1 Product of the Day":** file 02 §1.1 notes this as a self-claim. The May 2025 Creatify Product Video launch was **#4**, not #1. Which launch (if any) earned #1 is still unverified [corrected: https://www.hunted.space/product/creatify/launches/creatify-product-video]
4. **ShowcaseAI:** file 02 §1.22 says "no PH launch found". A hunted.space listing exists, but its data is inconsistent ("0 upvotes … #3 Product of the Day") [corrected/partial: https://www.hunted.space/product/showcaseai]
5. **Brief's "Golden Kitty 2025 video":** no such awards exist. The program was retired for Orbit Awards. The last edition (2024) reportedly gave AI video to Sora [corrected: https://www.producthunt.com/p/producthunt/rip-golden-kitty-awards-long-live-orbit-awards; Sora claim unverified: https://news.aibase.com/news/15198]
6. **Rocketdevs claim** that Dreamina won PH "Product of the Month #1" in 2025: not confirmed by any tracker; it remains [unverified]. Its claim about Levio (POTD) **is** confirmed (see above).

**Still unverified / not found:**
- PH launch metrics for Arcads, Revid.ai, Agent Opus, Pippit, Tagshop, Quickads, Icon, Hooked.so, ContentHooks, D-ID, Peech, LTX Studio, Hour One
- Upvotes for Reel Estate, ChatRealtor, Agentmatic, VIDEO AI ME, ReelRun, URLmotion
- Adomate's "#1 of the day" claim
- Exact Orbit Awards start year
- Whether any Hebrew/RTL AI video product has launched on PH (none found)
- 2026 PH ranking-algorithm claims (points vs. upvotes, hunter notifications, vote dampening) come only from third-party guides, not official PH documentation
