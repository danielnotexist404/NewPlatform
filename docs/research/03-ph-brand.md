# 03 — Product Hunt & Market Leaders: AI Promo / Brand / Explainer / Niche Video Generators (2024–2026)

Research date: 2026-10-13. Author: research sub-agent "ph-brand".

## 0. Method, limits, and how to read this file

- **Tools used:** WebSearch only (page fetching is blocked by network policy). About 45 searches were run before the **shared web-search budget for this workflow turn ran out**. Some planned lookups were not run: Product Hunt upvote counts for Creatify, Revid, Hedra, and Higgsfield, the Golden Kitty 2025 winners, and Pika, Luma, Hailuo, Krea, Freepik, and Magic Hour feature pages. Those gaps are marked below.
- **Pricing caveat:** Almost all 2026 pricing came from third-party aggregators and reviews, and they often **disagree**. Each figure is quoted with its source and the range is shown. Check each vendor's live pricing page before relying on any number.
- **Labels:** *(unverified)* means the claim is single-source, self-reported by the vendor, or from my background knowledge (training data through roughly mid-2026) and was not re-checked in this session. *(BK)* means background knowledge only.

---

## 1. Executive summary (the 10 things that matter for a Hebrew-first niche promo-video SaaS)

1. **The winning 2026 pattern is "URL → Brand DNA → campaign".** Google's free **Pomelli** (Google Labs + DeepMind, launched 28 Oct 2025) reads a website and builds a "Business DNA" profile: colors, fonts, tone. Its **Animate** feature (Jan 2026) turns static marketing visuals into on-brand video using **Veo 3.1**. Sources: [buildfastwithai](https://blog.buildfastwithai.com/what-is-google-pomelli-ai), [dataslayer](https://www.dataslayer.ai/blog/google-pomelli-ai), [geeky-gadgets](https://www.geeky-gadgets.com/ai-marketing-campaigns-pomelli/). Promo.com's **PromoAI** does the same for SMBs, pulling the logo, brand colors, and business info from the website and producing "a month's worth of videos" ([hunted.space](https://www.hunted.space/product/promo-com/launches/promoai), [toolquestor](https://toolquestor.com/it/tool/promoai)). A free Google product now covers this, so **Hebrew, local niches, and done-for-you quality** are where a new product can stand out.
2. **Organizing templates by industry is the established SMB pattern.** Promo.com groups templates by industry (real estate, restaurants, e-commerce, fitness) ([chatcut](https://chatcut.io/blog/best-promo-video-maker), [promo.com](https://promo.com/)). Most newer AI-native tools organize by **use case or input type** instead (URL → ad, menu → video, listing photos → tour) and publish **one SEO landing page per niche** (Revid `/tools/…`, Mootion `/use-cases/…`, Hera `/use-cases/…` and `/audiences/…`, Opus `/agent/workflows/ai-video-generator-for-restaurant-owners`).
3. **The "agent" UX has replaced the wizard.** InVideo's agent takes a prompt and returns a finished cut (script, stock or generated footage, VO, subtitles, music) that you refine with follow-up prompts ([lumalabs news](https://lumalabs.ai/news/invideo-ai), [fast.io](https://fast.io/resources/invideo-ai-review-2026/)). The same pattern appears in Agent Opus ([eesel](https://www.eesel.ai/blog/opusclip)) and in Hera's "Prompt to change anything — or fine-tune every detail yourself" ([hera.video](https://hera.video/)).
4. **Most of these products wrap the same few third-party models.** InVideo reportedly uses Sora 2, Veo 3.1, Kling 3.0, Seedance 2.5, Nano Banana Pro, and ElevenLabs music *(unverified, review-sourced)* ([yespress](https://yespress.io/products/invideo-ai), [pixverse blog](https://pixverse.ai/en/blog/best-ai-video-generators)). Pippit (CapCut/ByteDance) runs on Seedance 2.5 *(unverified)* ([tlinky](https://tlinky.com/pippit-ai-review/)). Pictory sells "AI credits" for Veo 3.1 ([creatify blog](https://creatify.ai/blog/pictory-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay)). Building on OpenRouter puts you on the same underlying models.
5. **OpenRouter has had a video API since April 2026.** It is asynchronous: you submit a job, get a task ID, and poll for the result. A capability endpoint, `/api/v1/videos/models`, returns supported resolutions, durations, aspect ratios, and pricing. The day-one models were Seedance 2.0/1.5, Veo 3.1, Wan 2.7/2.6, and Sora 2 Pro, and Kling Video O1 was added soon after ([OpenRouter blog](https://openrouter.ai/blog/announcements/video-generation/), [OpenRouter tutorial](https://openrouter.ai/blog/tutorials/video-generation-api/), [collection](https://openrouter.ai/collections/video-models), [kucoin news](https://www.kucoin.com/news/flash/openrouter-launches-video-generation-api-integrating-sora-2-veo-3-1-seedance)). "HeyGen Video" is also listed on OpenRouter ([openrouter.ai/heygen/heygen-video-1](https://openrouter.ai/heygen/heygen-video-1)).
6. **Do not build on Sora.** OpenAI announced the shutdown on 24 Mar 2026. The app went offline 26 Apr 2026 and the API ended 24 Sep 2026 ([NBC News](https://www.nbcnews.com/tech/tech-news/openai-shuttering-sora-video-generating-service-rcna264989), [Forbes](https://www.forbes.com/sites/ronschmelzer/2026/03/24/openai-discontinues-ai-video-gen-app-sora/), [futurum](https://futurumgroup.com/insights/openai-sora-discontinuation-what-the-end-of-a-platform-means-for-enterprise-ai-strategy/)).
7. **Hebrew is a real gap.** Kling 3.0's native audio covers only EN/ZH/JA/KO/ES ([atlascloud](https://www.atlascloud.ai/blog/tips/kling-3.0-review-features-pricing-ai-alternatives)). None of the searches confirmed Hebrew in Synthesia, Fliki, or InVideo. Hebrew RTL captions are offered as standalone tools: Submagic ([submagic](https://www.submagic.co/auto-subtitle-generator/hebrew-subtitles)), Kapwing ([kapwing](https://www.kapwing.com/subtitles/video/hebrew)), Simplified with explicit RTL formatting ([simplified](https://simplified.com/subtitle-generator/hebrew)), Flixier, and Sonix. **Recommendation:** generate visuals without speech, then add Hebrew VO (TTS) and RTL captions in your own compositing layer, for example Remotion. A dental-marketing source describes a "Claude Code + Remotion" workflow ([periospot](https://www.periospot.com/blog/dental-video-marketing-without-a-video-editor)).
8. **Hooks and variations are now productized.** Arcads' core loop is: type a hook, pick an actor, get a 30–60 s ad, then test about 4 hook variants per winner ([eesel](https://eesel.ai/blog/arcads-ai-pricing), [aifunnelinsider](https://aifunnelinsider.com/arcads-ai-review-2026/)). Higgsfield Ads Studio produces up to 20 variations per product at 4 credits per ad and **shows the total cost before the batch runs** ([higgsfield blog](https://higgsfield.ai/blog/higgsfield-ads-studio)). Submagic adds "hook titles" as on-screen text but does **not** generate hook ideas ([hooked.so](https://www.hooked.so/compare/submagic-pricing)). A **per-niche hook library** is therefore a real open space.
9. **Vertical-specific players are winning big verticals.** Real estate has Reel-E, AutoReel, VideoTour.ai, Amplifiles, and BetterSpace. Automotive has Cars.com AI Inventory Video Ads (launched 27 Apr 2026), Phyron, and Covideo VIN Reels. Restaurants have ngram (menu PDF → video), Vivideo, and Vidio.ai. E-commerce has Shopify apps such as OmniGen, Provid.AI, and Videomate. (Sources in §6.)
10. **Israeli local signals.** CapCut, VEED, and Pippit have Hebrew-localized pages ([capcut he-il](https://www.capcut.com/he-il/tools/ai-video-generator), [veed he-IL](https://www.veed.io/he-IL/tools/ai-video), [pippit he-il](https://www.pippit.ai/he-il/tools/text-to-animation-generator)). Israeli agencies sell "סרטון תדמית AI" as a service: [vdo.guru](https://www.vdo.guru/he/%D7%A1%D7%A8%D7%98%D7%95%D7%9F-%D7%AA%D7%93%D7%9E%D7%99%D7%AA-ai/) claims 1,500+ business examples, and [2site](https://2site.co.il/%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%A1%D7%A8%D7%98%D7%95%D7%9F-ai-%D7%91%D7%A2%D7%91%D7%A8%D7%99%D7%AA/) offers Hebrew scripting and narration. The government SMB agency **מעוף (sba.org.il)** runs a course, "הכנת סרטוני תדמית לעסק באמצעות AI" ([sba.org.il](https://www.sba.org.il/hb/MaofServices/courses/Pages/11619.aspx)). Demand is validated, and local competitors are mostly services rather than self-serve SaaS. The Israeli competitor livinginmovie/Cadabra is covered in file 01.

---

## 2. Product Hunt findings (what I could verify)

| Product on PH | Tagline / description (as found) | Launch info | Source |
|---|---|---|---|
| **InVideo AI** | "Invideo AI — Idea to Video" | 7 Feb 2023. InVideo company on PH since 2020, 3 launches. Reviewers say InVideo AI is a separate subscription with its own credits. No PH listing found for v3 or v4. | [producthunt.com/products/invideo](https://www.producthunt.com/products/invideo), [reviews](https://www.producthunt.com/products/invideo/reviews) |
| **Promo.com — PromoAI** | "The World's Easiest Video Maker, Now with AI✨". A month's worth of branded videos (copy, Getty/iStock footage, music) from your website. | Nov 2023 per search summary *(unverified month)* | [PH](https://www.producthunt.com/products/promo-com?launch=promoai), [hunted.space](https://www.hunted.space/product/promo-com/launches/promoai), [press release Feb 2024](https://markets.financialcontent.com/wss/article/marketersmedia-2024-2-22-promoai-empowers-small-businesses-to-efficiently-launch-and-manage-social-media-campaigns-with-advanced-ai-tool) |
| **Hera Launch** (hera.video) | "Create studio-quality launch videos with AI". Launch videos in seconds from one prompt. | 30 Apr 2026, **416 votes**, Featured | [PH Daily mirror](https://producthunt.programnotes.cn/en/p/product-hunt-daily-2026-05-01/), [hera.video](https://hera.video/) |
| **Creatify** | "The AI Video Ad Maker". Product URL → script, visuals, VO. Reviewers complain about credit confusion, expiring credits, and no refunds. | Date and upvotes not retrieved (search budget exhausted) | [PH](https://www.producthunt.com/products/creatify) |
| **Golpo** | "The most powerful AI video generator for explainer videos". Docs → narrated whiteboard explainer. | Only 1 review. One commenter found pricing high for some regions. | [PH](https://www.producthunt.com/products/golpo) |
| **VidAU** | "All-in-One AI Video Ad Solution for Performance Marketing". Product link or script → ad with avatars, VO, subtitles. Some users worry templates are generic. | — | [PH](https://www.producthunt.com/products/vidau) |
| **Clueso** | "Create stunning product videos in minutes with AI". Screen recording → polished demo. | — | [PH](https://www.producthunt.com/products/clueso) |
| **Jupitrr AI** | "All-in-one video marketing built for coaches & consultants" (a niche-specific positioning) | One commenter suspected fake 5-star reviews | [PH](https://www.producthunt.com/products/jupitrr) |
| **CyberCut AI** | "AI video studio for viral social clips". Free; team said paid tiers not before Spring 2026. | — | [PH](https://www.producthunt.com/products/cybercut) |
| **CreatorKit** | "Create high-performing videos with AI clones, in minutes." | — | [PH](https://www.producthunt.com/products/creatorkit) |
| **Velo** | "AI video infrastructure to explain, train, and sell faster" | — | [PH](https://www.producthunt.com/products/velo-4) |
| **TrendVideo AI** | "AI video generator can make monetizable videos" | — | [PH](https://www.producthunt.com/products/trendvideo-ai?launch=trendvideo-ai) |
| **Text to Video AI** / **AI-powered video creator** | "No more need for film crews, studios, or post-production" | — | [PH 1](https://www.producthunt.com/products/text-to-video-ai), [PH 2](https://www.producthunt.com/products/ai-powered-video-creator) |

**Product Hunt meta-observations:**
- PH has a "Video editing — Reviewed & Ranked for 2026" category page ([PH category](https://www.producthunt.com/categories/video-editing)) and active forum threads such as "What's the best AI video generator?" ([PH forum](https://www.producthunt.com/p/general/what-s-the-best-ai-video-generator)) and "How do you make your Product Hunt launch video?" ([PH forum](https://www.producthunt.com/p/general/how-do-you-make-your-product-hunt-launch-video)).
- "Product Hunt launch video" is itself a niche that tools target with dedicated pages: [Fliki](https://fliki.ai/features/product-hunt-launch-video-maker), [Revid](https://www.revid.ai/tools/create-product-hunt-videos), [Mootion](https://www.mootion.com/use-cases/en/product-hunt-video-generator), [GenMotion](https://genmotion.dev/use-cases/product-hunt), [Hera](https://hera.video/blog/ai-motion-graphics-for-product-hunt-launch). This is evidence of a **"one landing page per niche"** programmatic-SEO strategy.
- **Not retrieved (budget exhausted):** Golden Kitty 2025 video-category winners; PH upvote counts for Creatify, Revid, Hedra, Higgsfield, Pika, Luma, and InVideo v3/v4.

---

## 3. Tool profiles — general business / promo / explainer generators

### 3.1 InVideo AI (invideo.io)
- **What it is:** a prompt → finished-video agent. It writes the script, selects stock (16M clips in some reviews, "10M+" in others) or generates footage, and adds VO, subtitles, and music. You edit with follow-up prompts ([lumalabs news](https://lumalabs.ai/news/invideo-ai), [fast.io](https://fast.io/resources/invideo-ai-review-2026/)). One source says the v4 agent can produce **up to 30 minutes of video from one prompt**, and that the Individual plan includes "200+ AI models" *(unverified)* ([maxaeo](https://maxaeo.ai/ai-tools/tool/invideo-ai/), [zebracat](https://www.zebracat.ai/post/my-invideo-review)). Naming is inconsistent: reviews mention "Agent One" and "Agent Two" ([yespress](https://yespress.io/products/invideo-ai)).
- **Models (review-sourced, unverified):** Sora 2, Veo 3.1, Kling 3.0, Seedance 2.5, Nano Banana Pro (image), ElevenLabs (music) ([yespress](https://yespress.io/products/invideo-ai), [pixverse](https://pixverse.ai/en/blog/best-ai-video-generators)). Sora 2 is now discontinued (§7).
- **Brand kit:** a review says it stores logo, colors, and fonts. A competitor calls branding a weakness. Tier availability is unclear: Plus+ per [tickerr](https://tickerr.ai/pricing/invideo), but that data is about 6 months old.
- **Pricing (2026, conflicting):** Free with watermark. Plus about $17/mo annual ($200/yr) per Zebracat, or $25/mo monthly per Tickerr. Max and Generative tiers vary by source. Credits don't roll over and top-ups are available ([zebracat](https://www.zebracat.ai/post/my-invideo-review), [tickerr](https://tickerr.ai/pricing/invideo), [capterra](https://www.capterra.com/p/180680/InVideo/pricing/), [saasworthy](https://www.saasworthy.com/product/invideo-io/pricing)).
- **Niche organization:** not industry-first. It is prompt-first, with a general template library. *(BK)*
- **Hebrew:** not verified.

### 3.2 Pictory (pictory.ai)
- **Inputs:** script, **URL**, image, or **PPT** → video, capped at 30 min on paid tiers ([creatify blog](https://creatify.ai/blog/pictory-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay)).
- **Brand kits by tier:** Trial 1 / Starter 1 / Professional 5 / Team 10 / Enterprise unlimited.
- **Pricing (2026):** Starter $29/mo ($25 annual), Professional $59/mo ($35 annual, 600 export minutes), Team $199/mo ($119 annual), Enterprise custom. Annual plans are non-refundable ([creatify blog](https://creatify.ai/blog/pictory-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay), [toolsforhumans](https://www.toolsforhumans.ai/ai-tools/pictory)).
- **Generative add-on:** a separate "AI Credits" balance for generative video. 50 credits buy only **2.5 s of Veo 3.1**, which shows how expensive premium generation is (same source).

### 3.3 Synthesia
- **Category:** avatar-presenter video (training, explainers).
- **Pricing (mid-2026):** Free. Starter about $18–19/mo (about $14–18 annual). Creator about $64/mo annual or $89/mo monthly (another source says $69). Enterprise custom. Starter includes 1,200 monthly credits that don't roll over ([creatify blog](https://creatify.ai/blog/synthesia-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay), [knowlify](https://www.knowlify.com/articles/synthesia-pricing), [toolradar](https://toolradar.com/tools/synthesia/pricing)).
- **Scale:** 230–240+ stock avatars, 140–160+ languages. Searches did not confirm **Hebrew**. A Hebrew affiliate guide (netik.co.il) rates Synthesia the best tool it tested and cites "120 languages" ([netik](https://www.netik.co.il/%D7%A1%D7%A8%D7%98%D7%95%D7%9F-%D7%95%D7%99%D7%93%D7%90%D7%95-%D7%9C%D7%A2%D7%A1%D7%A7-%D7%91%D7%A2%D7%96%D7%A8%D7%AA-%D7%91%D7%99%D7%A0%D7%94-%D7%9E%D7%9C%D7%90%D7%9B%D7%95%D7%AA%D7%99%D7%AA/)). I believe Synthesia lists Hebrew *(BK, unverified)*.

### 3.4 Fliki
- **Category:** text/blog → video with a large TTS library. 75–80+ languages, 1,300–2,000+ voices. Paid tiers add voice cloning and avatars ([toolsforhumans](https://www.toolsforhumans.ai/ai-tools/fliki), [toolradar](https://toolradar.com/tools/fliki/pricing)).
- **Pricing (2026, conflicting):** Free 60 credit-min/mo with watermark. Standard $21/mo annual (another source: $28, verified June 2026). Premium $66/mo ([toolradar](https://toolradar.com/tools/fliki/pricing), [top50aitools](https://top50aitools.com/pricing/fliki)).
- Has a dedicated "Product Hunt launch video maker from your URL" page ([fliki](https://fliki.ai/features/product-hunt-launch-video-maker)). Hebrew and brand kit were not verified.

### 3.5 Lumen5
- **Workflow:** paste a blog URL, article, or script. The AI analyzes it, suggests a narrative, and generates a **storyboard** ([pexo](https://pexo.ai/blog/lumen5-review-0719)). Brand presets cover colors, fonts, logos, and watermarks ([codaone](https://www.codaone.ai/tools/lumen5), [capterra](https://capterra.com/p/167719/Lumen5/)).
- **Pricing (checked 29 May 2026):** Community free (3 videos/mo, 720p, branded), Basic $29/mo, Starter $79/mo, Professional $199/mo, Teams above that ([toolradar](https://toolradar.com/tools/lumen5), [subger](https://subger.com/en/service/lumen5)).
- **Criticism:** "template-locked editing and steep pricing" ([pexo](https://pexo.ai/blog/lumen5-review-0719)).

### 3.6 Promo.com (+ PromoAI)
- **Templates organized by industry:** real estate, restaurants, e-commerce, fitness ([chatcut](https://chatcut.io/blog/best-promo-video-maker)). Focus on Facebook/social ads ([promo.com](https://promo.com/)). Footage from Getty Images and iStock ([hunted.space](https://www.hunted.space/product/promo-com/launches/promoai)).
- **PromoAI:** from a URL it extracts brand colors, logo, and business info, then generates a month of social videos with copy and music ([toolquestor](https://toolquestor.com/it/tool/promoai)). CEO Tom More calls it a "copilot for social media marketing" ([press release](https://markets.financialcontent.com/wss/article/marketersmedia-2024-2-22-promoai-empowers-small-businesses-to-efficiently-launch-and-manage-social-media-campaigns-with-advanced-ai-tool)).
- **Pricing (conflicting):** about $49–60/mo per reviews; Capterra and GetApp say "from US$199/month flat" ([coldiq](https://coldiq.com/tools/promo), [chatcut](https://chatcut.io/blog/best-promo-video-maker), [getapp](https://www.getapp.com/marketing-software/a/promocom/)).
- **Relevance:** Promo.com has a Wikipedia page ([wiki](https://en.wikipedia.org/wiki/Promo.com)). I believe it is an Israeli-founded company (Slidely, Tel Aviv) *(BK, unverified)*. It is the closest Western analogue to a "niche promo video for SMB" product.

### 3.7 Animoto
- **Pricing:** from US$16/mo, 3 plans, free version (GetApp updated Mar 2026) ([getapp](https://www.getapp.com/all-software/a/animoto/), [capterra.ca](https://www.capterra.ca/software/158773/animoto)). Real estate is a top user industry. Reviewers complain about price increases and auto-renewal. Industry-specific templates were not verified.

### 3.8 VEED
- **Pricing (2026, conflicting; price increase 22 Jul 2026):** tiers renamed to Creator / Pro / Studio, roughly $10–20 / $21–44 / $35–70 per month (annual vs monthly). Pro includes 30,000 AI credits per year, up to 144 h of AI voice per year, and multiple brand kits ([usagepricing](https://usagepricing.com/blueprint/veed-ai), [magichour](https://magichour.ai/blog/veed-pricing), [dupple](https://dupple.com/pricing/veed)).
- **Hebrew:** a Hebrew-localized AI video tool page exists ([veed.io/he-IL](https://www.veed.io/he-IL/tools/ai-video)). AI Playground model list not retrieved.

### 3.9 Canva (Magic Media / "Create a Video Clip")
- **"Create a Video Clip"** runs on **Google Veo 3**: 8 s, 16:9, synced audio, one video per prompt. Free users get 5 lifetime 4-second silent clips on an older model ([amrytt](https://amrytt.com/canva-ai-video-review/), [morphed](https://morphed.app/blog/canva-ai-video-generator-pricing)).
- **Pro price (conflicting):** $12.99–$18/mo or about $120/yr. Veo counts as an "Ultra" AI feature, roughly 20 clips/mo max on Pro per one source ([eesel](https://www.eesel.ai/blog/canva-ai-pricing), [gptprompts](https://gptprompts.ai/ai-pricing/canva-ai-pricing)).
- **Strength:** brand kit and templates *(BK)*. Weakness: very short single clips, so it is not a full promo-video generator.

### 3.10 Steve AI
- **Animation/explainer generator.** From $20/user/mo, range $20–80/mo across 4 plans, free version available ([capterra](https://capterra.com/p/253410/Steve-AI/), [softwareadvice](https://www.softwareadvice.com/artificial-intelligence/steve-ai-profile/reviews/)). Reviewers complain about download caps ("15 downloads"). No industry template list found.

### 3.11 Visla
- **Inputs:** idea, script, PDF/PPT, or footage → video. Business tier adds Private Stock with AI labeling, full brand kits, SSO, and custom avatars and voice clones.
- **Pricing:** Free. Pro $18/mo ($9 annual). Business $59/mo ($38.94 annual) ([visla blog](https://www.visla.us/blog/listicles/best-ai-video-generators-for-business-in-2026/), [vantaige](https://vantaige.io/es/ai-tool/visla)). Rated 3.0/5 by toolsforhumans ([toolsforhumans](https://www.toolsforhumans.ai/ai-tools/visla-ai-video-generator)).

### 3.12 Vidnoz
- **Library:** 2,500–3,200+ templates, 800–1,900+ avatars, about 140 languages, 2,000+ voices, one-click translation.
- **Pricing:** free daily credits; paid from about $13.50–$29.99/mo ([toolsforhumans](https://www.toolsforhumans.ai/ai-tools/vidnoz-ai), [getcoai](https://getcoai.com/tool-detail/vidnoz/165397/), [vozo](https://www.vozo.ai/blogs/9-best-vidnoz-ai-alternatives-for-ai-video-creation-2026)).

### 3.13 Revid.ai
- **Positioning:** short-form/viral generator. Search → script → vertical video. Has tool pages per niche or input, e.g. Shopify product URL → video with script, VO, and captions ([revid shopify](https://www.revid.ai/tools/create-video-for-shopify-website)) and PH launch videos ([revid PH](https://www.revid.ai/tools/create-product-hunt-videos)).
- **Pricing and reviews:** Capterra lists "from US$49", founded 2024, 2.5/5 from 2 reviews ([capterra](https://www.capterra.com/p/10022239/revid-ai/)). Pricing details are unverified.

### 3.14 Opus Clip + Agent Opus
- **Opus Clip** (long → short clipping): Free, Starter $15, Pro $29/mo ($14.50 annual), Business custom. 1 credit per uploaded minute ([quso blog](https://quso.ai/blog/opus-clip-pricing), [eesel](https://www.eesel.ai/blog/opusclip)).
- **Agent Opus** (prompt, script, outline, or **blog URL** → produced video with scripting, VO, motion graphics, editing): Free 60 credits/mo, Pro $29/mo ($348/yr), Max $129/mo ($1,548/yr). Generation is billed in 10-second increments ([eesel](https://www.eesel.ai/blog/opusclip), [aiandrealtors](https://aiandrealtors.com/review-opusclip)).
- **Niche page:** "AI Video Generator for Restaurant Owners" workflow ([opus.pro](https://www.opus.pro/agent/workflows/ai-video-generator-for-restaurant-owners)).

### 3.15 Mootion
- **Styles:** photorealistic, 3D cartoon, comic; VO and multi-language. Character consistency is reportedly still broken as of June 2026 ([zplatform](https://zplatform.ai/lifetime-deals/mootion-lifetime-deal-review/)).
- **Pricing:** Standard $15/mo, free 200 credits. A single Veo 3 generation can use up to 9,500 credits, more than the Tier 3 monthly allowance of 8,000 (same source, [tooljunction](https://www.tooljunction.io/ai-tools/mootion/company)).
- **Use-case pages:** food marketing, PH launch videos ([mootion food](https://www.mootion.com/use-cases/en/ai-video-maker-for-food-marketing)).

### 3.16 LTX Studio (Lightricks — Israeli company *(BK)*)
- **Core strength is storyboarding:** script → scenes with camera angles and thumbnails, then refine. Also text/image-to-video, style customization, camera motion, and keyframes ([toolsforhumans](https://toolsforhumans.ai/ai-tools/ltx-studio), [vidmuse](https://vidmuse.ai/blog/ltx-studio-review)).
- **Own model LTX-2.3:** native portrait 1080×1920, HDR, audio-to-video, up to 20 s clips *(unverified)*.
- **Pricing:** free one-time 800 "computing seconds"; Lite ~$15, Standard ~$35, Pro ~$125/mo, Enterprise ([aitoolsatlas](https://aitoolsatlas.ai/tools/ltx-studio/pricing), [g2](https://www.g2.com/products/ltx/pricing)). One skeptical review says many features are "roadmap promises" ([stork](https://www.stork.ai/de/ltx)). LTX Studio has a Wikipedia page ([wiki](https://en.wikipedia.org/wiki/LTX_Studio)).

### 3.17 Hera (hera.video)
- **Positioning:** an "AI motion designer" for infographics, explainers, UI animation, and branded video. Text, timing, motion, colors, and assets stay editable ([hera.video](https://hera.video/)). Has `/use-cases/` and `/audiences/` SEO pages ([product-launch-videos](https://hera.video/use-cases/product-launch-videos), [startup-launch-teams](https://hera.video/audiences/startup-launch-teams)).
- **Recommended storyboard structure for a 14 s launch video:** 0–2 s category + main benefit, 2–8 s core use case, 8–14 s three proof or feature cards ([hera blog](https://hera.video/blog/ai-motion-graphics-for-product-hunt-launch)). This is a useful pattern for "hook → value → proof → CTA" templates.

---

## 4. Ad / UGC / e-commerce generators (adjacent but highly relevant)

| Tool | Key mechanics | Pricing (2026) | Sources |
|---|---|---|---|
| **Creatify** | Product/Shopify URL → pulls images, title, description → multiple video variations. Avatars: 300 on Starter, 1,500+ on Pro. 5 credits per 15 s. | Free 10 credits/mo; Starter $39 (100 credits); Pro $99 (300 credits). Third-party figures vary. | [creatify pricing](https://creatify.ai/pricing), [zeely](https://zeely.ai/blog/creatify-ai-review/), [heygen blog](https://www.heygen.com/blog/best-ai-video-tools-ecommerce-product-videos) |
| **Arcads** | Hook → actor (1,000–1,500 AI actors) → 30–60 s talking-head ad. Hook A/B testing is the core loop. | Lite $29 (no talking actors); Starter $110 list ($77 promo); ~$11/video; no free trial; /pricing returned 404 as of Jul 2026. | [creatify blog](https://creatify.ai/blog/arcads-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay), [eesel](https://eesel.ai/blog/arcads-ai-pricing), [wireflow](https://www.wireflow.ai/blog/arcads-pricing) |
| **Topview** | "AI video agent". URL → video; **Product Avatar** where the presenter holds the product; 30+ languages; canvas and drama studio. | Pro $16/mo annual (960 credits/yr); Business $44/mo (3,000 credits) *(unverified)* | [aitoolsatlas](https://aitoolsatlas.ai/tools/topview-ai), [yespress](https://yespress.io/topview-ai), [shhots](https://shhots.ai/blog/topview-ai-alternatives/) |
| **Pippit** (CapCut/ByteDance) | Product link, images, or script → marketing content; schedules to connected social accounts; Video Agent, Image Agent, avatars. Seedance 2.5 engine (added 11 Aug 2026; 30 s single take, up to 4K) *(unverified)*. | Free 150 credits/week; Starter ~$24–36/mo (or $120/yr promo) | [tlinky](https://tlinky.com/pippit-ai-review/), [xpay](https://www.xpay.sh/agent-ready-index/pippit-ai/) |
| **Higgsfield** | Ads Studio: 4 credits/ad (~$0.20), up to 20 variations per product, **cost shown before the batch**. Marketing Studio: URL → product videos. | Plans conflict: Starter $15–19, Plus $39–59, Ultra $99–129 (prices rose mid-2026) | [higgsfield blog](https://higgsfield.ai/blog/higgsfield-ads-studio), [layer3labs](https://www.layer3labs.io/guides/higgsfield-ai-pricing), [aifunnelinsider](https://aifunnelinsider.com/higgsfield-ai-review-2026/) |
| **Captions → Mirage** | Rebranded Sep 2025 into an AI video research lab plus the Captions app. AI Ad Generator from a product link. Raised $75M in Mar 2026; ~3.2M downloads, $28.4M in-app revenue. | iOS: Basic $9.99, Max $24.99/mo (500 credits) *(unverified)* | [TechCrunch](https://techcrunch.com/2025/09/04/captions-rebrands-as-mirage-expands-beyond-creator-tools-to-ai-video-research), [cxodigitalpulse](https://www.cxodigitalpulse.com/?p=48900), [hooked.so](https://www.hooked.so/compare/captions-ai-pricing) |
| **Argil** | Personal AI clone avatar videos with an API. | Classic $39, Pro $149, Scale $499/mo; 5-day trial | [argil pricing](https://argil.ai/pricing), [argil blog](https://argil.ai/blog/runway-pricing-plans) |
| **Google Pomelli** | URL → **Business DNA** (colors, fonts, tone) → campaigns. Animate (Veo 3.1, Jan 2026), Photoshoot (Feb 2026), Catalog (product list URL). 170+ countries by Mar 2026. **Free** (Labs). | Free | [buildfastwithai](https://blog.buildfastwithai.com/what-is-google-pomelli-ai), [dataslayer](https://www.dataslayer.ai/blog/google-pomelli-ai), [zeniteq](https://www.zeniteq.com/google-s-pomelli-catalog-lets-you-turn-any-product-list-into-a-full-ai-campaign-c6ovod) |
| **Submagic** | Captions/editing for talking-head footage: 35+ animated caption styles ("Hormozi", "MrBeast"), 48+ languages, **Hebrew subtitles page**, Storyblocks B-roll, hook titles, Magic Clips add-on (~$12–19/mo). | Free 3 videos; Starter $19 ($12 annual), 15 videos; Pro $39 ($23), 40 videos; Business+API $69 ($41), 100 videos, 4K | [hooked.so](https://www.hooked.so/compare/submagic-pricing), [toolsforhumans](https://www.toolsforhumans.ai/ai-tools/submagic), [submagic he](https://www.submagic.co/auto-subtitle-generator/hebrew-subtitles) |

---

## 5. Foundation video models (what the wrappers run on) — 2026 status

| Model | Status / key facts | Price signals | Sources |
|---|---|---|---|
| **Google Veo 3.1** (Standard / Fast / Lite) | Native audio. Powers Canva clips (Veo 3), Pomelli Animate, InVideo, Pictory credits, and Google Flow. No free API tier. Flow: 50 free credits/day for non-subscribers (Jul 2026); Google AI Pro = 1,000 Flow credits/mo. | Gemini API per second: Standard $0.40 (720p/1080p), $0.60 (4K); Fast $0.10 / $0.12 / $0.30; Lite $0.05 / $0.08 | [ai.google.dev pricing](https://ai.google.dev/gemini-api/docs/pricing), [magichour](https://magichour.ai/blog/veo-3-pricing), [veopricing](https://www.veopricing.com/veo-3-1-api-providers/) |
| **"Gemini Omni Flash"** | Reportedly now the recommended default video model on the Gemini API, ~$0.10/s at 720p *(single third-party source, unverified)*. | ~$0.10/s | [magichour](https://magichour.ai/blog/veo-3-pricing) (summary) |
| **Kling 3.0** (Kuaishou) | Stable release 7 Feb 2026. Multi-shot ("AI director"), element and multi-image references, subject consistency. Native audio in **5 languages only (EN, ZH, JA, KO, ES)**. 3–15 s clips. Later: 3.0 Turbo, Omni upgrade. Kling Video O1 on OpenRouter. | 1080p ~$0.112/s without audio, ~$0.168/s with audio (Magic Hour); Krea std $0.176/s, pro $0.235/s, 4K $0.441/s | [wiki](https://en.wikipedia.org/wiki/Kling_AI), [krea](https://www.krea.ai/blog/kling-3-0-api-access-guide-pricing-code-examples-for-multi-shot-ai-video), [magichour](https://magichour.ai/blog/kling-ai-pricing), [atlascloud](https://www.atlascloud.ai/blog/tips/kling-3.0-review-features-pricing-ai-alternatives) |
| **Seedance 2.0 / 2.5** (ByteDance) | 2.0 launched ~12 Feb 2026. Joint audio-video; up to 9 images + 3 videos + 3 audio refs per request; 4–15 s; up to 1080p; aspect ratios 21:9 to 9:16. On OpenRouter from ~15 Apr 2026. Copyright controversy (MPA). **2.5** is among OpenRouter's top models in Oct 2026 and is Pippit's engine *(unverified)*. | 2.0 ~$0.14/s on OpenRouter (May 2026) | [NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/seedance-2-0-bytedances-multimodal-audio-video-ai-model/), [segmind](https://blog.segmind.com/seedance-2-0-release-date-and-global-access-guide/), [kucoin](https://www.kucoin.com/news/flash/openrouter-launches-video-generation-api-integrating-sora-2-veo-3-1-seedance) |
| **Runway Gen-4.5 / Aleph 2.0** | Gen-4.5 for generation; Aleph 2.0 for video-to-video editing. Plans: Free (125 one-time credits), Standard $15 (625 credits), Pro $35 (2,250 credits), Max $95. | Gen-4.5 12 credits/s; Aleph 2.0 28 credits/s | [creatify blog](https://creatify.ai/blog/runway-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay), [aiproductivity](https://aiproductivity.ai/pricing/runway/) |
| **OpenAI Sora 2** | **Discontinued.** App closed 26 Apr 2026; API ended 24 Sep 2026. | — | [NBC](https://www.nbcnews.com/tech/tech-news/openai-shuttering-sora-video-generating-service-rcna264989), [Forbes](https://www.forbes.com/sites/ronschmelzer/2026/03/24/openai-discontinues-ai-video-gen-app-sora/) |
| **Wan 2.6 / 2.7** (Alibaba) | On OpenRouter at launch. Open-weights lineage *(BK)*. | Not retrieved | [OpenRouter blog](https://openrouter.ai/blog/announcements/video-generation/) |
| **LTX-2.3** (Lightricks) | Portrait 1080×1920, HDR, audio-to-video, up to 20 s *(unverified)* | — | [toolsforhumans](https://toolsforhumans.ai/ai-tools/ltx-studio) |
| **HeyGen Video** | Listed as a model on OpenRouter; among top OpenRouter video models in Oct 2026 by adoption *(unverified)* | — | [openrouter heygen](https://openrouter.ai/heygen/heygen-video-1) |
| **Hailuo / MiniMax, Luma Ray, Pika, Hedra** | Not researched in this session (budget exhausted). Known before mid-2026 *(BK, unverified)*: Hailuo 02/2.3 (image-to-video, popular for cheap high motion); Luma Ray2/Ray3 (Dream Machine); Pika 2.x (Pikaffects/Pikascenes, consumer-effects focus); Hedra Character-3 (talking-character avatars). | — | — |
| **Image models** | Nano Banana Pro (Gemini image) cited as used in InVideo *(unverified)*. Image-first then animate (Pomelli Photoshoot → Animate) is a common pipeline. | — | [yespress](https://yespress.io/products/invideo-ai) |

**Implications for an OpenRouter build:**
- Use `/api/v1/videos/models` to fill a model picker dynamically.
- Treat generation as async jobs: Supabase table plus a Vercel cron or queue for polling.
- Tier the models for cost: Veo 3.1 Lite or Fast for drafts, Standard for finals, Kling or Seedance as alternatives.
- Plan for most premium tools charging 5–40× retail markup over these per-second API costs (compare Pictory's 50 credits = 2.5 s of Veo 3.1).

---

## 6. Vertical / niche-specific tools found

### Real estate (most crowded vertical)
- **Reel-E:** exports horizontal, vertical, and square, each branded and unbranded ([reel-e](https://www.reel-e.ai/blog/best-ai-real-estate-video-generators)).
- **AutoReel:** drone-style flythroughs, imports photos from Zillow (same source).
- **VideoTour.ai:** 2-minute turnaround. **PhotoAIVideo:** room-by-room walk-through camera moves (same source).
- **Amplifiles:** $1.50 per photo; 10–15 photos → 1080p video with VO ([amplifiles](https://www.amplifiles.ai/blog/ai-real-estate-video-tools-compared)).
- **BetterSpace:** virtual staging, motion, branded titles, music, VO ([betterspace](https://www.betterspace.ai/ai-real-estate-video)).
- **MeltFlex:** stages the room first, then builds a walkthrough ([meltflexai](https://www.meltflexai.com/blog/best-ai-video-generators-real-estate)).
- Others: [realestatevideo.io](https://realestatevideo.io/), [reeltourstudio](https://www.reeltourstudio.com/blog/best-ai-video-generator-for-real-estate), [imastudio](https://www.imastudio.com/ai-real-estate-video-generator). Industry news: [startuphub](https://www.startuphub.ai/ai-news/artificial-intelligence/2026/ai-real-estate-listing-video-generator-shifts-agent-workflows-toward-automation).

### Restaurants / food
- **ngram:** menu PDF, image, or text → video with dish callouts and VO; G2 4.6/5 from 20 reviews ([ngram](https://www.ngram.com/tools/ai-restaurant-video-maker)).
- **Vivideo:** dish photo or menu → captioned vertical reels; "30+ AI models" ([vivideo](https://vivideo.ai/solutions/ai-video-for-restaurants)).
- **Vidio.ai:** type an offer → promo ([vidio](https://www.vidio.ai/tools/restaurant-marketing-video-maker)).
- **Morphic:** shot-by-shot generation, then assembly ([morphic](https://morphic.com/resources/videos/restaurant-promo-video-videos)).
- Agent Opus, ImagineArt (5 s clips), FlexClip, Dreamina/CapCut, Mootion, [videoai.me](https://videoai.me/industries/food-restaurant).
- **Caveat:** AI food shots often look artificial. Animating the business's real dish photos (image-to-video) is safer.

### Dental / clinics / medical
- **HeyGen:** dental-specific templates and avatars ([heygen](https://www.heygen.com/video/dental-briefing-video-maker)).
- **Synthesia, Zoice** ([aiavatar blog](https://aiavatar.business.blog/2026/04/03/best-ai-avatar-generator-for-dentists/)).
- **FluxNote:** uses Kling and Veo ([fluxnote](https://fluxnote.io/blog/how-dentists-can-create-marketing-videos-with-ai-in-2026)).
- **PerioSpot Video Studio** and a Remotion workflow ([periospot](https://www.periospot.com/blog/dental-video-marketing-without-a-video-editor)).
- **ZSky** dental template ([zsky](https://zsky.ai/templates/dental-clinic)); **TrueFan** automation ([truefan](https://www.truefan.ai/blogs/dentist-video-marketing-automation)).
- **Use cases:** procedure explainers (implants, orthodontics), office tours, avatar-hosted patient testimonials (with consent).
- **Regulatory note:** medical testimonial and advertising rules need local (Israeli Ministry of Health) checking. Not researched.

### Automotive dealers
- **Cars.com AI Inventory Video Ads:** VIN-level; reads the inventory feed and builds 3D renderings from photos plus price, mileage, and specs. Launched 27 Apr 2026. Claims a 47% lift in influenced sales (company-reported) ([cars.com IR](https://investor.cars.com/2026-04-27-Cars-coms-New-First-of-Its-Kind-AI-Video-Solution-Turns-Every-Vehicle-Into-High-Intent-Sales-Engine), [autoremarketing](https://www.autoremarketing.com/ar/technology/cars-coms-ai-video-pilot-shows-strong-early-results/)).
- **Phyron:** 4,000+ dealers in 30 countries; TikTok VIN ads in closed alpha ([am-online](https://www.am-online.com/news/phyron-brings-ai-powered-vin-level-video-ads-to-tiktok)).
- **Covideo VIN Reels; MotorCast AI:** NHTSA spec data; dealer plan $249/mo annual ([motorcastai](https://www.motorcastai.com/)).

### E-commerce / Shopify
- **OmniGen:** product page → avatar ad in 25+ languages ([apps.shopify.com/ai-video-generator](https://apps.shopify.com/ai-video-generator)).
- **Provid.AI:** auto-publishes to product pages; bulk mode ([provid.ai](https://provid.ai/)).
- **Videomate:** listed 3 Feb 2026 ([apps.shopify.com/video-mate](https://apps.shopify.com/video-mate)).
- **Vidify** ([apps.shopify.com/vidify](https://apps.shopify.com/vidify)); Creatify, Revid, Topview (URL → ad).

### Other niche positionings seen
- Coaches and consultants (Jupitrr AI).
- SaaS product demos and onboarding (Clueso, Hera, Velo).
- Training and internal explainers (Golpo, Synthesia).
- Product Hunt / startup launches (Hera, Fliki, Revid, Mootion, GenMotion).

---

## 7. Hebrew / RTL / Israel-specific findings
- **Captions:**
  - Submagic: Hebrew subtitles burned into MP4 ([submagic](https://www.submagic.co/auto-subtitle-generator/hebrew-subtitles)).
  - Kapwing ([kapwing](https://www.kapwing.com/subtitles/video/hebrew)).
  - Flixier: 103 languages ([flixier](https://flixier.com/tools/auto-subtitle-generator/hebrew-subtitles)).
  - Sonix: 85–99% accuracy ([sonix](https://sonix.ai/auto-caption-hebrew-videos)).
  - Simplified: explicit **RTL formatting**, SRT/VTT/burn-in, "98%" self-reported ([simplified](https://simplified.com/subtitle-generator/hebrew)).
  - Maestra: Hebrew subtitles ([maestra](https://maestra.ai/tools/subtitle-generator/hebrew-subtitles)).
- **Voice:**
  - Maestra: Hebrew VO and voice cloning ([maestra](https://maestra.ai/tools/video-dubber/hebrew-voice-over)).
  - SpeechGen: 91 Hebrew voices, bidirectional Hebrew/English text support ([speechgen](https://speechgen.io/en/tts-hebrew/)).
  - ElevenLabs multilingual Hebrew support *(BK, unverified)*.
- **Hebrew text-to-video:** Simplified claims a Hebrew AI video generator ([simplified](https://simplified.com/ai-video-generator/hebrew)).
- **Hebrew UI from big players:** CapCut, VEED, Pippit (links in §1).
- **Local services (competition and validation):**
  - vdo.guru: AI promo-video production, "1,500+ examples" ([vdo.guru](https://www.vdo.guru/he/ai/)).
  - 2site: Hebrew AI videos with Hebrew narration ([2site](https://2site.co.il/%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%A1%D7%A8%D7%98%D7%95%D7%9F-ai-%D7%91%D7%A2%D7%91%D7%A8%D7%99%D7%AA/)).
  - haisagee guide ([haisagee](https://www.haisagee.co.il/ai-marketing-video/)).
  - netik guide recommending Synthesia ([netik](https://www.netik.co.il/%D7%A1%D7%A8%D7%98%D7%95%D7%9F-%D7%95%D7%99%D7%93%D7%90%D7%95-%D7%9C%D7%A2%D7%A1%D7%A7-%D7%91%D7%A2%D7%96%D7%A8%D7%AA-%D7%91%D7%99%D7%A0%D7%94-%D7%9E%D7%9C%D7%90%D7%9B%D7%95%D7%AA%D7%99%D7%AA/)).
  - **מעוף / SBA** government course on AI promo videos, covering copywriting and storyboards ([sba.org.il](https://www.sba.org.il/hb/MaofServices/courses/Pages/11619.aspx)).
- **Conclusion:** no global leader advertises a first-class **Hebrew end-to-end pipeline** (Hebrew script, Hebrew VO, RTL animated captions, Israeli niche hooks). That is the differentiation.

---

## (a) Comparison table

Legend: ✅ = confirmed by a cited source in this file; ◐ = partial or tier-limited; ❓ = not verified; ✗ = reportedly absent. Prices are USD and come from third-party 2026 sources (see §3–4). "Entry paid" is the lowest paid tier found.

| Tool | Core input → output | Industry/niche templates | Brand kit | URL → script | Storyboard / scene editor | Stock + AI b-roll | VO / avatars | Caption styles | Multi-aspect (9:16/1:1/16:9) | Hebrew | Entry paid (2026) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| InVideo AI | Prompt → agent → full video | ◐ (general templates) | ◐ (tier unclear) | ❓ | ✅ (prompt edits) | ✅ 10–16M stock + Veo/Kling/Seedance | ✅ VO / ❓ avatars | ✅ subtitles | ❓ (BK: yes) | ❓ | ~$17–25/mo |
| Pictory | Script/URL/PPT → video | ❓ | ✅ 1/5/10/∞ by tier | ✅ | ✅ (BK) | ✅ + Veo 3.1 credits | ✅ (BK) | ❓ | ❓ | ❓ | $29/mo ($25 annual) |
| Synthesia | Script → avatar video | ◐ (BK) | ✅ (BK) | ❓ | ✅ slide-scene (BK) | ◐ | ✅ 230+ avatars, 140–160 langs | ◐ | ✅ (BK) | ❓ (BK: likely) | ~$18–19/mo |
| Fliki | Text/blog → video | ❓ | ❓ | ◐ blog → video | ✅ scenes (BK) | ✅ (BK) | ✅ 1,300–2,000 voices | ❓ | ❓ | ❓ | $21–28/mo |
| Lumen5 | Blog URL → storyboard → video | ◐ templates | ✅ presets | ✅ | ✅ storyboard | ✅ (BK) | ◐ | ❓ | ❓ | ❓ | $29/mo |
| Promo.com / PromoAI | Website → month of videos | ✅ by industry | ✅ auto-extracted | ✅ | ◐ template edit | ✅ Getty/iStock | ❓ | ❓ | ✅ (BK) | ❓ | ~$49–199/mo |
| Animoto | Photos/clips → templated video | ◐ | ✅ (BK) | ✗ (BK) | ✅ (BK) | ✅ Getty (BK) | ◐ | ❓ | ✅ (BK) | ❓ | $16/mo |
| VEED | Editor + AI tools | ❓ | ✅ Pro | ❓ | ✅ timeline | ✅ (BK) | ✅ AI voice | ✅ (BK) | ✅ (BK) | ◐ Hebrew UI | ~$10–20/mo |
| Canva | Design suite + Veo clip | ✅ huge template library (BK) | ✅ | ✗ | ✅ | ✅ stock + Veo 3 (8 s) | ◐ | ◐ | ✅ | ◐ (BK: UI) | ~$13–18/mo |
| Steve AI | Script → animated explainer | ❓ | ❓ | ❓ | ✅ (BK) | ✅ | ✅ | ❓ | ❓ | ❓ | $20/mo |
| Visla | Idea/script/PDF/PPT → video | ❓ | ✅ Business | ❓ | ✅ (BK) | ✅ Private Stock | ✅ avatars, clones | ❓ | ❓ | ❓ | $18/mo ($9 annual) |
| Vidnoz | Template/avatar videos | ◐ 2,500–3,200 templates | ❓ | ❓ | ◐ | ◐ | ✅ 800–1,900 avatars, 140 langs | ❓ | ❓ | ❓ | ~$13.5–30/mo |
| Revid.ai | Topic/URL → viral short | ✅ per-niche tool pages | ❓ | ✅ (Shopify URL) | ❓ | ✅ (BK) | ✅ VO | ✅ captions | ◐ vertical | ❓ | from $49 (Capterra) |
| Agent Opus | Prompt/script/blog URL → video | ✅ workflow pages (e.g. restaurants) | ✅ auto branding (restaurant page) | ✅ | ◐ | ✅ motion graphics | ✅ VO | ✅ (BK) | ✅ Reels/TikTok/Shorts | ❓ | $29/mo |
| Mootion | Prompt → animated story | ✅ use-case pages | ❓ | ❓ | ❓ | ✅ incl. Veo 3 | ✅ multi-lang | ❓ | ❓ | ❓ | $15/mo |
| LTX Studio | Script → storyboard → shots | ❓ | ❓ | ❓ | ✅ core strength | ✅ own LTX-2.3 + partners | ◐ | ❓ | ✅ native portrait | ❓ | ~$15/mo |
| Hera | Prompt → motion graphics | ✅ use-case/audience pages | ✅ brand colors | ❓ | ✅ editable timing | ✗ (motion design) | ❓ | ✅ editable text | ❓ | ❓ | ❓ |
| Creatify | Product URL → ad variants | ◐ (e-com) | ✅ (BK) | ✅ core | ✅ (BK) | ✅ | ✅ 300–1,500 avatars | ✅ (BK) | ✅ (BK) | ❓ | $39/mo |
| Arcads | Hook + actor → UGC ad | ✗ | ❓ | ✗ | ✗ | ✗ | ✅ 1,000–1,500 actors | ❓ | ❓ | ❓ | $29 / $77–110 |
| Topview | URL/image/prompt → ad | ◐ | ❓ | ✅ | ✅ canvas | ✅ | ✅ product avatar, 30+ langs | ❓ | ❓ | ❓ | $16/mo annual |
| Pippit | Product link → content + scheduling | ◐ (e-com) | ✅ (BK) | ✅ | ✅ | ✅ Seedance 2.5 | ✅ avatars | ✅ (BK) | ✅ (BK) | ◐ Hebrew UI | ~$24–36/mo |
| Higgsfield | Product/URL → ad batch | ◐ | ❓ | ✅ (Marketing Studio) | ❓ | ✅ multi-model | ✅ | ❓ | ❓ | ❓ | $15–19/mo |
| Google Pomelli | URL → Business DNA → campaign + Animate | ✗ (DNA-driven) | ✅ auto | ✅ | ◐ | ✅ Veo 3.1 animate | ✗ | ❓ | ❓ | ❓ (170+ countries) | Free |
| Submagic | Talking head → captioned short | ✗ | ✅ custom templates (Business) | ✗ | ◐ | ✅ Storyblocks b-roll | ✗ | ✅ 35+ styles | ✅ (BK) | ✅ Hebrew subtitles | $19/mo ($12 annual) |
| Argil | Clone avatar → social videos | ✗ | ❓ | ❓ | ◐ | ◐ | ✅ clone avatars | ✅ (BK) | ✅ (BK) | ❓ | $39/mo |

---

## (b) Every niche / vertical seen being targeted

**Explicitly seen in sources:**
- Real estate / property listings, including virtual staging and drone-style tours
- Restaurants and food (menus, specials, dish reels)
- E-commerce / Shopify product pages and TikTok Shop
- Fitness (Promo.com industry templates)
- Dental clinics (procedure explainers, office tours, testimonials)
- Medical / healthcare marketing generally
- Automotive dealers (VIN-level inventory ads, luxury rentals, private sellers)
- Coaches and consultants
- SaaS and startups (product launch videos, Product Hunt launches, UI animation, demos, onboarding)
- Corporate training and internal explainers (whiteboard)
- Performance marketing / paid social ads (UGC, hooks, A/B variants)
- Social media managers and agencies (month-of-content calendars)
- Small businesses generally ("video maker for business")
- Creators and influencers (viral shorts, captions, clipping)
- Infographics and data explainers

**Commonly targeted by template libraries but not specifically verified here** *(BK, unverified)*:
- Beauty salons and spas, barbers
- Lawyers
- Insurance and finance
- Education and online courses
- Events and weddings
- Travel and hospitality / hotels
- Gyms and personal trainers
- Construction and home services (contractors, cleaning, HVAC)
- Nonprofits
- Real estate developers / new projects
- Recruiting / employer branding
- Pet services
- Fashion

**Israel-relevant niche suggestions:** פרויקטים של נדל"ן/יזמים, קליניקות אסתטיקה ושיניים, מסעדות/בתי קפה, עורכי דין, יועצי משכנתאות, מאמני כושר, חנויות אונליין, אולמות אירועים, צימרים/תיירות פנים, מוסכים/סוכנויות רכב, קורסים דיגיטליים, הייטק/סטארטאפים (השקות).

---

## (c) Top 15 product / UX patterns to copy

1. **URL → "Business DNA" onboarding.** Paste a website or Instagram link, then auto-extract logo, colors, fonts, tone, services, and USP. Show the result as an editable brand card before generating anything (Pomelli, PromoAI, Creatify, Topview).
2. **Niche-first entry point.** Step 1 is "What's your business?" with a large icon grid of niches. Each niche preloads script structure, hooks, shot list, music mood, and CTA (Promo.com industries; Opus, Mootion, and Revid niche pages).
3. **Goal / format picker.** Choose promo (תדמית), short ad, testimonial, offer/sale, launch, or explainer, plus a duration chip (15/30/60 s) and platform presets (Reels/TikTok 9:16, Feed 1:1 or 4:5, YouTube 16:9).
4. **Hook library per niche,** with **hook → actor/voice → variant** batching and A/B (Arcads loop; Higgsfield's 20 variations; Submagic hook titles). Publish the hooks publicly as an SEO asset.
5. **Agent draft + chat refinement.** Generate a complete first cut, then let users revise in natural language ("make it more energetic", "replace scene 3") (InVideo agent, Agent Opus, Hera).
6. **Scene-card storyboard editor.** Each scene is a card with script line, visual (stock, generated, or uploaded), duration, and transition. Allow per-scene regenerate and swap (Lumen5, LTX Studio).
7. **Timed narrative skeletons.** For example: 0–2 s hook, 2–8 s core value, 8–14 s proof or feature cards, last 3 s CTA with logo outro (Hera's launch storyboard).
8. **Hybrid media sourcing.** Stock first (cheap), user photos animated by image-to-video (authentic), and premium AI b-roll only where needed (Promo Getty/iStock, Submagic Storyblocks, Pictory Veo credits, Pomelli Animate).
9. **Credit wallet with up-front cost preview.** Show "this video ≈ N credits" before rendering. Charge per generated second by model tier (Higgsfield batch cost preview; Agent Opus 10-second increments; Creatify 5 credits / 15 s).
10. **Model picker with sensible defaults.** Hide models behind "Draft / Standard / Premium" quality modes, mapped to Veo Lite/Fast vs Standard vs Kling or Seedance. Offer an advanced tab for power users (InVideo's multi-model approach; OpenRouter `/videos/models`).
11. **Animated caption style presets.** Ship 10–35 named styles with word-by-word highlight and emoji, built **RTL-correct for Hebrew** (Submagic's 35+ styles).
12. **Brand kit enforced everywhere.** Logo intro/outro, colors, fonts, watermark, lower-thirds, CTA end card. Tier the number of brand kits for agencies (Pictory 1/5/10/∞; VEED multiple kits on Pro; Lumen5 presets).
13. **Export pack.** One click produces 9:16 + 1:1 + 16:9, branded and unbranded versions, plus SRT (Reel-E's horizontal/vertical/square × branded/unbranded).
14. **"Month of content" calendar + scheduling.** Generate 8–30 videos per month from one brief and schedule to connected socials (PromoAI's month of videos; Pippit scheduling).
15. **Input-specific "makers".** Examples: menu PDF → video, listing photos → tour, product URL → ad, VIN/model → car video, before/after photos → clinic reel. Give each its own landing page and SEO (ngram, Amplifiles, Cars.com, Creatify).

Honorable mentions:
- Freemium with watermark plus API tier for agencies (Submagic Business+API, Argil API).
- Avatar presenter "holding the product" (Topview).
- Bulk generation for catalogs (Provid.AI).
- Agencies/white-label seats (Argil Scale, Higgsfield Team).

---

## (d) Underlying video / image / audio models these tools use (as reported)

| Tool | Models reported | Source |
|---|---|---|
| InVideo AI | Sora 2 (now dead), Veo 3.1, Kling 3.0, Seedance 2.5, Nano Banana Pro (image), ElevenLabs (music) *(unverified)* | [yespress](https://yespress.io/products/invideo-ai), [pixverse](https://pixverse.ai/en/blog/best-ai-video-generators) |
| Canva | Google Veo 3 ("Create a Video Clip") | [amrytt](https://amrytt.com/canva-ai-video-review/) |
| Google Pomelli | Veo 3.1 (Animate) + Google image models | [buildfastwithai](https://blog.buildfastwithai.com/what-is-google-pomelli-ai) |
| Pictory | Veo 3.1 via AI credits | [creatify blog](https://creatify.ai/blog/pictory-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay) |
| Pippit (CapCut) | Seedance 2.5 *(unverified)* | [tlinky](https://tlinky.com/pippit-ai-review/) |
| Mootion | Veo 3 (premium credit cost) | [zplatform](https://zplatform.ai/lifetime-deals/mootion-lifetime-deal-review/) |
| FluxNote (dental) | Kling + Google Veo | [fluxnote](https://fluxnote.io/blog/how-dentists-can-create-marketing-videos-with-ai-in-2026) |
| Vivideo (restaurants) | "30+ AI models" (unnamed) | [vivideo](https://vivideo.ai/solutions/ai-video-for-restaurants) |
| LTX Studio | Own LTX-2.3 + "partner models" | [toolsforhumans](https://toolsforhumans.ai/ai-tools/ltx-studio) |
| Submagic | Storyblocks stock for b-roll (not generative) | [hooked.so](https://www.hooked.so/compare/submagic-pricing) |
| Promo.com | Getty Images / iStock stock (not generative) | [hunted.space](https://www.hunted.space/product/promo-com/launches/promoai) |
| Higgsfield, Krea, Freepik, Magic Hour | Multi-model aggregators: Kling, Veo, Seedance, Wan, MiniMax, etc. *(BK, unverified)*. Krea publishes Kling 3.0 API guides ([krea](https://www.krea.ai/blog/kling-3-0-api-access-guide-pricing-code-examples-for-multi-shot-ai-video)); Magic Hour publishes Veo and Kling pricing guides ([magichour](https://magichour.ai/blog/veo-3-pricing)). | — |
| OpenRouter catalogue (relevant to this build) | Seedance 2.0/1.5 (and 2.5 by Oct 2026), Veo 3.1 (incl. Lite), Wan 2.7/2.6, Kling Video O1, HeyGen Video; Sora 2 Pro (likely removed after 24 Sep 2026) | [OpenRouter blog](https://openrouter.ai/blog/announcements/video-generation/), [collection](https://openrouter.ai/collections/video-models) |

**Audio:**
- Veo 3.1, Kling 3.0, and Seedance 2.x generate native audio. Kling's native speech languages exclude Hebrew.
- ElevenLabs is the commonly cited music/voice layer *(unverified)*.
- For Hebrew, plan a separate TTS step (vendor to be validated by another research file) and an RTL caption renderer.

---

## 8. Open gaps (not verified due to search budget exhaustion)
- Product Hunt upvote counts and launch dates for Creatify, Revid, Hedra, Higgsfield, Pika, Luma, Kling, and InVideo v3/v4; Golden Kitty 2025 winners.
- Official (first-party) pricing pages for every tool. All prices above are third-party and conflicting.
- Hebrew support in Synthesia, HeyGen, InVideo, Fliki, Creatify, and in Veo 3.1 native audio.
- Current feature pages for Pika, Luma Dream Machine (Ray3), Hailuo/MiniMax, Hedra, Krea, Freepik, Magic Hour, Wonder Studio, Kapwing AI, and Quso (ex-Vidyo.ai).
- Seedance 2.5 specs and "Gemini Omni Flash", each single-source.
