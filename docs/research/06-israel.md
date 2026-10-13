# 06: Israeli market research for a Hebrew-first AI promo-video and reels SaaS (2025–2026)

*Research date: 2026-10-13. Scope: pricing in the Israeli market, Israeli competitors and adjacent players, social platforms, niches, Hebrew-language challenges, and legal/regulatory issues for an Israeli SaaS that generates סרטוני תדמית, רילס and short ads per niche with AI (React + Node on Vercel + Supabase, AI calls through OpenRouter).*

---

## 0. Method and limitations (read first)

- **I made zero successful live searches in this run.** Every WebSearch call returned "web search budget used up (limit 200 per turn, shared by every agent)". Direct page fetching (WebFetch, curl) is blocked by network policy. I did not try to get around either limit.
- So the claims in this file come from three kinds of source, each tagged:
  - **[S]**: a fact with a URL that a **sibling research agent in this same workflow** found by search, recorded in `01-cadabra.md`, `02-ph-ads.md`, `03-ph-brand.md` or `04-openrouter.md`. It is snippet-level evidence; the URL is given inline.
  - **(unverified-MK)**: model knowledge (training data to about mid-2026), **not re-checked** in this run. Treat it as a strong lead, not a citation.
  - **(estimate)** / **(inference)**: my own reasoning or ballpark figures.
- **Verify before launch:** (1) everything in §7 (legal) with an Israeli lawyer or accountant; (2) the social-platform numbers in §4 against *DataReportal "Digital 2026: Israel"*; (3) freelancer price ranges in §2.2–2.4 by sampling 10–20 Israeli editors and agencies; (4) the holiday dates in §5.3 against hebcal.com.
- I found **nothing** on "Web Leviosa AI videos" (the task named it). With no search budget I could not look it up, so it is **not covered**.
- **Update 2026-10-13 (verification pass):** a second agent ran 38 web searches (WebSearch only, snippet level) against the legal, tax, election, social-stats, price and competitor claims. Checked claims now carry **[verified: url]** or **[corrected: url]** tags inline; see the **Verification addendum** at the end of the file for the summary and what is still unverified.

---

## 1. Executive summary: 14 takeaways

1. **There is a large price gap to exploit.** A conventional Israeli סרטון תדמית costs about **₪5,000 to ₪60,000+**, and most SMB promo videos cost **₪15,000 to ₪35,000** [S](https://www.extra.co.il/corporate-video-pricing-2026/). Basic packages start around **₪3,500** [S](https://vivistudio.co.il/) and low-end narrated 45–60 s videos around **₪1,200** [S](https://smartpush.co.il/). A professional edit of one Reel or TikTok costs **₪550** [S](https://natigold.com/promotional-video/). Editing alone costs **₪800 to ₪4,000** per 1–3 minute business video, or **₪80 to ₪300 per finished minute** [S](https://aviv-malka.com/video-editing-pricing-2026/). A self-serve plan at ₪99 to ₪399 a month has an obvious ROI story (inference).
2. **AI "done-for-you" pricing is already public in Israel.** FARO sells AI-presenter ads for **₪490 per video (≤20 s)**, **₪1,290/mo for 3 videos** and **₪2,990/mo for 8 videos plus industry exclusivity** [S](https://faro.co.il/). One marketing source puts AI-assisted promo production at **₪1,000 to ₪4,000**, against **₪5,000 to ₪25,000** for classic production [S](https://www.magic-caricatures.com/).
3. **Hebrew self-serve competitors exist, but none is "niche → finished promo + hooks".**
   - Cadabra / livinginmovie.com is a multi-engine credit tool box with a course: **$19 to $179 credit packs, USD only** [S](https://www.livinginmovie.com/).
   - Sparkiz does Hebrew AI UGC ads: **$49/mo** [S](https://sparkiz.ai/) [verified: https://www.getapp.com/all-software/a/sparkiz/ (third-party listing: Starter $49/mo or ~$42/mo annual, 127 credits ≈ 5 videos; EN/HE/RU)].
   - Kossem does SMB branded content. Paid plans reportedly start at ₪139/mo [S, unverified](https://kossem.co.il/) (2026-10-13: two searches found no independent trace of Kossem; still unverified).
   - Nivra sells image and video credits **from ₪19** [S](https://www.nivra.co.il/) (2026-10-13: not found by independent search; still unverified beyond the sibling's snippet).
   - NitAi is a Hebrew media platform [S](https://nitaimodel.com/) (not found by independent search; unverified). Kolbo.ai is a 100+ model workspace **from $24/mo** [S](https://kolbo.ai/) (conflict: a third-party directory lists Lite $19 / Standard $35 / Professional $69 per month, https://www.aitoolsspace.com/en/tools/kolbo; possibly an older price sheet. Check kolbo.ai/pricing).
4. **Israel produces world-class video-AI companies, but they target global or enterprise buyers, not Hebrew SMBs.** Examples: Lightricks (LTX Studio), D-ID, Hour One (bought by **Wix on 2025-05-23** [S](https://finder.techleap.nl/news/note/wix-acquires-hour-one-boosting-its-generative-ai-ambitions)), Promo.com/Slidely, Idomoo, SundaySky, Magisto (now Vimeo), Wochit, Peech and Deepdub (unverified-MK for the ones without [S]). **Animoto (US) and Typito (India) are not Israeli.**
5. **Demand is validated by the government SMB agency.** מעוף (sba.org.il) runs a course titled "הכנת סרטוני תדמית לעסק באמצעות AI" [S](https://www.sba.org.il/hb/MaofServices/courses/Pages/11619.aspx). Agencies such as vdo.guru (claims 1,500+ business examples) [S](https://www.vdo.guru/he/ai/) and 2site [S](https://2site.co.il/) sell AI promo videos as a service.
6. **WhatsApp is the dominant channel in Israel.** Usage is near-universal among internet users (unverified-MK). Instagram Reels plus Facebook is the core SMB posting stack, TikTok is growing fast, and YouTube has the widest video reach [verified: https://www.statista.com/statistics/1495494/israel-potential-ad-reach-social-media-platform (Feb 2025 ad-reach ranking: YouTube > Facebook > Instagram ≳ TikTok > LinkedIn)]. DataReportal counts **7.01M social media user identities (73.4% of the population, Oct 2025)** and **91.3% internet penetration** [verified: https://datareportal.com/reports/digital-2026-israel]. Facebook *groups* are still a major local-discovery channel (unverified-MK). Every video should export to **9:16 for Reels, TikTok, Shorts and WhatsApp Status**, **1:1 or 4:5 for the feed and Facebook**, and **16:9 for websites and YouTube**.
7. **Niches to launch with** (§5): real estate, aesthetic clinics and cosmetics, beauty (nails, brows, lashes), hair salons and barbershops, restaurants and cafés, fitness studios and trainers, renovation contractors, dentists, mortgage advisors, event venues, e-commerce shops, and car dealers.
8. **Israeli seasonality is distinctive.** The year runs through the Tishrei holidays (Sept–Oct), **Black Friday (Nov 27, 2026)** and 11.11, **Hanukkah (Dec 4–12, 2026)**, Purim, the **pre-Pesach** renovation and cleaning rush, Pesach, Yom Ha'atzmaut, summer and zimmers, wedding season, and back-to-school on **Sept 1**. There are also **"quiet days"** (Yom HaShoah, Yom HaZikaron) when promotional content should be blocked automatically. Dates in §5.3 are computed and should be verified.
9. **Hebrew is the moat.**
   - Most global ad tools don't list Hebrew: Creatify, Arcads and Predis don't [S](https://help.creatify.ai/en/articles/9348010-supported-languages). HeyGen does market Hebrew TTS [S](https://www.heygen.com/en-gb/text-to-speech/hebrew).
   - Kling 3.0 native audio excludes Hebrew [S](https://www.atlascloud.ai/blog/tips/kling-3.0-review-features-pricing-ai-alternatives).
   - ElevenLabs v4 lists Hebrew [S](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4).
   - The hard problems: pronunciation without niqqud, **gendered grammar**, **bidirectional text (bidi) in captions**, and avoiding "translated-from-English" copy.
10. **Render all Hebrew text yourself** in Remotion or FFmpeg. Image and video models garble Hebrew lettering (inference, consistent with 03/04).
11. **Legal items that change the build:**
    - **Website accessibility** (IS 5568 / WCAG **2.0** AA as the legal baseline, plus an accessibility statement; statutory damages up to ₪50,000 without proof of harm) [verified: https://www.wawsome.com/blog/israel-digital-accessibility-law-is-5568-guide].
    - **Privacy Law Amendment 13**, in force **Aug 14, 2025** [verified: https://www.chamber.org.il/serviceslobby/legal/74023/164240/]: notices, security, administrative fines, and possibly a DPO if you process sensitive (biometric voice or face) data "בהיקף ניכר".
    - **Consumer Protection Law:** cancellation of ongoing transactions takes effect within **3 business days** [verified: https://protocol.co.il/ongoing-transaction-cancellation/]; for online (distance) sales, s.14ט requires cancellation through the same channel, including a dedicated prominent link on the site [corrected attribution: https://www.bizportal.co.il/financialconsumerism/news/article/20042624]; 14-day distance-sale cancellation; prices shown **including 18% VAT**.
    - **Spam law s.30A:** opt-in, a "פרסומת" label, and an unsubscribe option. Damages of up to **₪1,000 per message** without proof of harm [verified: https://www.chamber.org.il/serviceslobby/legal/74023/115485/].
    - **VAT 18% since Jan 1, 2025**, still 18% in 2026 [verified: https://www.malam-payroll.com/%D7%A2%D7%93%D7%9B%D7%95%D7%9F-%D7%A9%D7%99%D7%A2%D7%95%D7%A8%D7%99-%D7%9E%D7%A1-%D7%A9%D7%9B%D7%A8-%D7%9C%D7%A9%D7%A0%D7%AA-2026/].
    - **Israel Invoices (allocation numbers)** for B2B invoices above **₪10,000 from Jan 1, 2026** and **₪5,000 from Jun 1, 2026**, pre-VAT [verified: https://www.gov.il/he/service/request-assignment-number-for-tax-invoice].
12. **Likeness and voice:** under Israeli privacy law, using a person's **name, picture or voice for profit without consent** is a privacy violation (Privacy Protection Law 1981, s.2(6); unverified-MK). Voice-clone and avatar features need **explicit, recorded, revocable consent**.
13. **AI and copyright:** the Ministry of Justice's legal opinion of **Dec 2022** holds that using copyrighted works for **ML training** is generally fair use, with caveats (unverified-MK). Israel has **no general statutory AI-labeling duty** (unverified-MK). Platform rules (Meta, TikTok, YouTube) and misleading-advertising law still apply, and fake AI "customer testimonials" are risky.
14. **Price in ₪, including VAT, with an Israeli tax invoice and Bit or card payments.** That alone beats Cadabra's USD packs for SMB buyers (inference; Cadabra pricing [S](https://www.livinginmovie.com/)).

---

## 2. What Israeli businesses pay today

### 2.1 Promo video production (סרטון תדמית): sourced anchors

| Offering | Price (₪) | Notes | Source |
|---|---|---|---|
| Promo video, overall range (2026) | ₪5,000 (basic smartphone shoot) to ₪60,000+ (premium) | Most SMB promo videos cost ₪15,000–₪35,000 | [S] https://www.extra.co.il/corporate-video-pricing-2026/ |
| Basic promo package | from ₪3,500 | | [S] https://vivistudio.co.il/ |
| Low-end 45–60 s narrated promo | from ₪1,200 | | [S] https://smartpush.co.il/ |
| AI-assisted promo production | ₪1,000–₪4,000 | Compared with ₪5,000–₪25,000 for classic production; a vendor marketing claim | [S] https://www.magic-caricatures.com/ |
| Editing only, 1–3 min business video | ₪800–₪4,000, or ₪80–₪300 per finished minute | 2026 pricing article | [S] https://aviv-malka.com/video-editing-pricing-2026/ |
| Editing shift (8 hours) | ₪2,500 | VIVI studio | [S] via 01-cadabra.md |
| One Reel or TikTok edited by a pro | ₪550 | | [S] https://natigold.com/promotional-video/ |
| Business promo video, 2–3 min (entry level) | from ₪3,000–₪4,000 | Midrag guide, undated; consistent with the ₪3,500 VIVI anchor | [verified: https://www.midrag.co.il/Content/Tip/11772] |
| Promo/corporate photography, per hour on location | ₪956–₪1,489 | Midrag sector price list; shoot hours, not finished videos; update date not shown | [verified: https://www.midrag.co.il/pages/Agora/Content/SectorPriceList/96] |

### 2.2 Freelance video editors (עורך וידאו פרילנסר): estimates

These are **(estimate / unverified-MK)**. Israeli freelancers rarely publish fixed prices, so validate them by sampling quotes. (2026-10-13: three Hebrew searches for "מחיר עריכת רילס" / "עורך וידאו לרילס מחיר" / reels packages returned no published ₪ per-reel or monthly-package price lists; these ranges remain unverified. Global 2026 guides put social media management at roughly $300–$5,000+/mo, e.g. https://socialbu.com/blog/social-media-management-pricing, which is broadly consistent with §2.3.)

| Service | Typical range (₪, before VAT) | Comment |
|---|---|---|
| Hourly editing rate | ₪100–₪250/hour | Juniors and students at the low end; motion-graphics editors higher |
| One reel (client supplies raw footage, 20–60 s, with subtitles) | ₪150–₪600 | ₪550 for a pro is consistent with [S] natigold |
| Monthly reels package (editing only) | 8 reels ≈ ₪1,500–₪4,000; 12–16 reels ≈ ₪3,000–₪7,000 | Retainers with revisions |
| Shoot day plus edit (videographer, phone or mirrorless) | ₪1,500–₪4,500 per day → 4–10 reels | "יום צילום תוכן" is a common Israeli offer |
| Israeli UGC creator (talking-head testimonial-style ad) | ₪300–₪1,500 per video | Global benchmark: Billo about $59–$99 per video [S](https://billo.app/ugc-platforms/) |
| Hebrew subtitles only | ₪50–₪200 per short video | Increasingly replaced by auto-caption apps |

### 2.3 Social media managers and agencies: reels packages (estimate / unverified-MK)

| Package type | Typical monthly price (₪, before VAT) | What's included |
|---|---|---|
| Freelance social media manager, small business | ₪1,500–₪3,500 | 8–12 posts, stories, 2–4 reels (often from client-shot footage), basic community management |
| Mid-size boutique agency | ₪3,500–₪8,000 | Strategy, 12–20 posts, 4–8 reels, monthly content shoot, campaign management (ad spend extra) |
| Premium agency or production house | ₪8,000–₪25,000+ | Brand strategy, content days, influencer coordination, paid media |
| Paid-ads management (Meta and Google) | ₪1,500–₪5,000 + ad budget | Often sold alongside creative |

**Implication (inference):** a typical micro-business spends **₪2,000–₪6,000 a month** on content plus management. A SaaS at **₪149–₪399/mo** that turns out 10–30 publish-ready Hebrew reels can (a) replace a freelancer for the self-serve owner, or (b) become the production backend for social media managers through an agency plan. Agencies are a strong channel: one manager serves 10–40 SMBs.

### 2.4 Fiverr (an Israeli company, used by Israelis)

- **Fiverr** was founded in Tel Aviv in 2010 and trades on the NYSE as FVRR (unverified-MK, widely known). Israeli businesses use it both in English and for Hebrew-speaking sellers.
- Typical global gig prices for short-form editing are **about $15–$150 per video**. Hebrew-native editors are scarcer and usually charge **about $40–$200 per video** (estimate). Fiverr also launched AI-assisted offerings such as **"Fiverr Go"** [verified existence: https://help.fiverr.com/hc/en-us/articles/32545695445393 (AI personal assistant; launch coverage says it was initially limited to vetted top freelancers in voiceover, design, copywriting and similar categories, https://www.cxodigitalpulse.com/fiverr-launches-ai-platform-fiverr-go-to-empower-freelancers/)]; the **2025** launch year is still unverified.
- **Positioning takeaway:** compete on **speed (minutes, not days), Hebrew quality, and unlimited variations**, not only on price.

### 2.5 AI done-for-you services already selling in Israel [S]

| Vendor | What they sell | Price (₪) | Source |
|---|---|---|---|
| FARO | AI-model video ads with Hebrew speech, music, subtitles and logo | ₪490 single (≤20 s); ₪1,290/mo for 3 videos; ₪2,990/mo for 8 videos + industry exclusivity (launch prices; VAT-exempt business) | https://faro.co.il/ |
| vdo.guru | AI promo-video production, "1,500+ business examples" | not found | https://www.vdo.guru/he/ai/ |
| 2site | Hebrew AI videos with Hebrew scripting and narration | not found | https://2site.co.il/ |
| LogoCraft | AI videos, 3–7 day turnaround | not found | https://mylogocraft.com/ai-videos |
| VideoHead | Video production / AI | not found | https://videohead.co.il/ |

### 2.6 Suggested Israeli pricing ladder (inference; shown including VAT, as consumer law requires for consumer-facing prices; see §7.3)

| Plan | ₪/month incl. VAT | Target | Rationale |
|---|---|---|---|
| Free | ₪0 | Trial | 1–2 watermarked videos plus full access to the hooks library (SEO and lead magnet) |
| בסיסי / Starter | ₪99–₪149 | Freelancer, micro-business | About 8–10 short videos. Cheaper than **one** ₪550 reel |
| עסקי / Business | ₪249–₪399 | SMB posting 3–5 times a week | About 25–40 videos, brand kit, Hebrew VO, multi-format, hook A/B variants |
| סוכנות / Agency | ₪790–₪1,490 | Social media managers | Multiple client workspaces, approval links, white-label |
| Pay-per-video / credit packs | ₪29–₪79 per finished video | Occasional buyers | Mirrors FARO's ₪490 single, but self-serve and about 10× cheaper |
| Done-for-you upsell | ₪490–₪1,500 per video | Owners who won't self-serve | Human QA plus custom shoot or edit; competes directly with FARO |

Israeli buyers expect **תשלומים** (installments) on annual plans, **Bit**, and a **חשבונית מס/קבלה** emailed immediately (unverified-MK, market norm).

---

## 3. Competitors and adjacent players

### 3.1 Hebrew-first self-serve AI creation platforms (direct and near competitors)

| Platform | Positioning | Key features | Pricing (currency, date) | Hebrew | Source |
|---|---|---|---|---|---|
| **Cadabra AI / קאדאברה** (livinginmovie.com) | Hebrew multi-engine "filmmaking lab" plus a course | 30+ engines (Kling 3.0, Seedance 2.0, Hailuo, ElevenLabs, Gemini), 4K, avatars, lip-sync, music, 3D; one credit balance; auto-refund on failed generations | One-time packs: $19/105 credits, $39/220, $69/420, $179/1,200 (homepage snapshot about mid-2026); no subscription | UI, subtitles, narration | [S] https://www.livinginmovie.com/ |
| **Sparkiz** | AI UGC video ads for e-commerce | 100–500+ AI actors, voice clones, lip-sync "strongest in Hebrew" | Trial $3 (Hebrew page: ₪10/50 credits); Starter $49/mo (about 5 videos), Growth $126, Scale $252. [verified: https://www.getapp.com/all-software/a/sparkiz/ for trial $3 = 35 credits (one 15 s video) and Starter $49/mo or ~$42/mo annual = 127 credits ≈ 5 videos; Growth/Scale prices not re-confirmed] | HE/EN/RU [verified: same listing] | [S] https://sparkiz.ai/ , https://www.softwareadvice.com/product/557642-Sparkiz/ |
| **Kossem (קוסם)** | SMB content: branded carousels, images, video, personal AI avatar | Auto-branding | Free start without a card; ₪139/mo, video at ₪229/mo (unverified) | Hebrew UI | [S] https://kossem.co.il/ |
| **Nivra (נִבְרָא)** | Hebrew image and video generation | 12+ models (FLUX, Veo 3, Kling, Runway…), up to 4K | 50 free credits; from ₪19/500 credits; credits don't expire | Hebrew prompts, auto-translated | [S] https://www.nivra.co.il/ |
| **NitAi** | Hebrew AI media: images, video, Hebrew jingles, TTS | Multi-scene video | ₪ credit packs (amounts not found) | Full Hebrew | [S] https://nitaimodel.com/ |
| **Kolbo.AI** | 100+ model creative workspace for teams | Chat, image, video, music, voice, 3D; Premiere plugin | Lite $24/mo, Standard $40, Pro $79 (May 2026 changelog). Conflict: third-party directory lists Lite $19 (2,000 credits), Standard $35 (4,000), Professional $69 (9,000), Enterprise custom (https://www.aitoolsspace.com/en/tools/kolbo; date unknown, possibly pre-May-2026) | RTL and Hebrew captions claimed | [S] https://kolbo.ai/ |
| **Vivideo.ai** | "30+ models in one subscription" | Sora 2, Veo 3.1, Hailuo, Kling | not found | Hebrew pages; Israeli origin unverified | [S] https://vivideo.ai/ |

**White space (inference):** none of these leads with **"choose a niche → get a finished promo, reel set and hooks"**. None publishes a **public Hebrew hooks library per niche**. Cadabra and Kolbo are tool boxes, while FARO and Sparkiz are ad formats for products. Service businesses (dentist, lawyer, contractor, mortgage advisor) are underserved.

### 3.2 Israeli video-tech companies (global players, adjacent)

| Company | HQ / origin | What it does | Relevance and pricing | Source / confidence |
|---|---|---|---|---|
| **Lightricks** | Jerusalem | Facetune, Photoleap, **Videoleap** (mobile editor), **LTX Studio** (storyboard to video), LTX open video models | LTX Studio: free 800 credits; Lite about $15, Standard about $35 (commercial), Pro about $125/mo; English UI | [S] https://en.wikipedia.org/wiki/LTX_Studio , https://omidsaffari.com/blog/ltx-studio-pricing |
| **Hour One** | Tel Aviv | AI avatar text-to-video ("Reals") | **Acquired by Wix, 2025-05-23**. Expect avatar video inside Wix for SMB sites | [S] https://finder.techleap.nl/news/note/wix-acquires-hour-one-boosting-its-generative-ai-ambitions |
| **Wix** | Tel Aviv | Website builder with a video maker and AI site tools; owns Hour One | A big SMB distribution threat if it bundles AI promo video for Israeli Wix sites (inference) | Hour One [S]; the rest unverified-MK |
| **D-ID** | Tel Aviv (founded 2017) | Talking-photo avatars, Creative Reality Studio, API, conversational agents | Subscription tiers from about $5.90/mo to about $196/mo; API plans (unverified-MK, prices change). Hebrew probably works through Azure he-IL voices (unverified-MK) | unverified-MK |
| **Promo.com (Slidely)** | Tel Aviv (unverified-MK) | SMB promo videos with templates by industry; **PromoAI** reads a website and makes "a month's worth of videos" | The closest Western analogue to this product; English-first | [S] https://www.hunted.space/product/promo-com/launches/promoai , https://en.wikipedia.org/wiki/Promo.com |
| **Magisto** | Israel (founded 2009); **acquired by Vimeo in 2019** | AI auto-editing; became Vimeo Create | A historical proof that AI SMB video is a category | unverified-MK |
| **Idomoo** | Israel / NY | Personalized video at scale for enterprises (banks, telcos) | Enterprise; not an SMB competitor | unverified-MK |
| **SundaySky** | Israeli-founded / NY | Personalized and enterprise video creation | Enterprise | unverified-MK |
| **Wochit** | Tel Aviv / NY | AI-assisted video creation for publishers and brands | Media and enterprise | unverified-MK |
| **Peech** | Tel Aviv | AI repurposing of long-form video (webinars, podcasts) into B2B marketing clips | B2B marketing teams | unverified-MK |
| **Deepdub** | Tel Aviv | AI dubbing and emotional TTS for media and entertainment | A possible Hebrew voice partner (verify API availability) | unverified-MK |
| **Fiverr** | Tel Aviv | Freelance marketplace including video editing; AI tools ("Fiverr Go", 2025) | Price anchor (§2.4) | unverified-MK |
| **Kaltura** | Israeli-founded / NY | Enterprise video platform | Not a competitor | unverified-MK |

**Not Israeli (the task brief listed them with question marks):** **Animoto** is US-based, and **Typito** is India-based (both unverified-MK, fairly confident).

### 3.3 Global tools Israelis use that offer Hebrew

| Tool | Hebrew status | Price anchor | Source |
|---|---|---|---|
| HeyGen | Hebrew TTS, lip-synced translation, API narration (marketed); HeyGen Avatar IV available on OpenRouter at $0.05/s | n/a | [S] https://www.heygen.com/en-gb/text-to-speech/hebrew , https://openrouter.ai/heygen/avatar-iv |
| CapCut / Pippit (ByteDance) | Hebrew-localized pages | Pippit about $24–$36/mo | [S] https://www.capcut.com/he-il/tools/ai-video-generator , https://www.pippit.ai/he-il/tools/ai-movie-maker |
| VEED | Hebrew UI page | about $10–$20/mo | [S] https://www.veed.io/he-IL/tools/ai-video |
| Submagic | Hebrew subtitles burned into MP4 | $19/mo | [S] https://www.submagic.co/auto-subtitle-generator/hebrew-subtitles |
| Adobe Firefly | Hebrew page for the AI video generator | n/a | [S] https://www.adobe.com/il_he/products/firefly/features/ai-video-generator.html |
| Freepik | Veo 3.1, Kling 3.0 and ElevenLabs under one plan (Hebrew article) | n/a | [S] https://www.poenta.co.il/article/freepik-ai-tools/ |
| Synthesia | A Hebrew affiliate guide rates it the best tool tested; Hebrew voice support not confirmed | n/a | [S] netik.co.il guide (see 03-ph-brand.md); Hebrew unverified |
| Creatify, Arcads, Predis | **Hebrew not listed** | n/a | [S] https://help.creatify.ai/en/articles/9348010-supported-languages |
| Google Pomelli (free, Labs) | Website → "Business DNA" → on-brand assets; Animate feature uses Veo 3.1 | free | [S] https://blog.buildfastwithai.com/what-is-google-pomelli-ai ; Hebrew unverified |

### 3.4 Israeli AI-video education (competes for the same "save on an editor" buyer) [S]

| Provider | Format | Price | Source |
|---|---|---|---|
| מעוף / SBA: "הכנת סרטוני תדמית לעסק באמצעות AI" | Government-subsidized course | n/a | https://www.sba.org.il/hb/MaofServices/courses/Pages/11619.aspx |
| Let's AI: AI video course | Recorded | ₪2,990 | https://letsai.co.il/product/videoai-workshop/ |
| Dana Israeli: AI video workshop | Recorded | ₪450 (promo) | https://danad.co.il/digitalworkshops/aivideo/ |
| Cadabra course | Hebrew, personal guidance | not found | https://www.livinginmovie.com/ |

**Takeaway (inference):** there is a large population of SMB owners who have been *taught* that AI video is possible but find the tools fiddly. A product built around outcomes ("pick a niche, get the video") converts that population directly. Partnering with course creators (affiliate, about 20–30% revenue share) is a cheap acquisition channel.

---

## 4. Social platforms in Israel

### 4.1 Usage indicators (all unverified-MK; replace with DataReportal *Digital 2026: Israel* and the Israel Internet Association / Bezeq internet report)

**Verified anchors (2026-10-13):**
- DataReportal *Digital 2026: Israel*: **7.01M social media user identities in Oct 2025 (73.4% of the population)**, up from 6.82M in Jan 2025; **internet penetration 91.3%** at end-2025 [verified: https://datareportal.com/reports/digital-2026-israel]. Per-platform figures were not visible in search snippets.
- NapoleonCat (Meta ad-tool audiences, which can include duplicate or inactive accounts): **Facebook ≈ 8.13M (June 2026, 84.8% of population)** [verified: https://stats.napoleoncat.com/facebook-users-in-israel/2026/06/]; **Instagram ≈ 5.88M (Aug 2026, 61.3%)** [verified: https://stats.napoleoncat.com/social-media-users-in-israel/].
- Statista (from DataReportal, Feb 2025): ad-reach ranking **YouTube > Facebook > Instagram (slightly) > TikTok > LinkedIn, Messenger, Snapchat; X last** [verified: https://www.statista.com/statistics/1495494/israel-potential-ad-reach-social-media-platform]. **TikTok ad reach ≈ 44% of the population, 64.9% of adults 18+** (Feb 2025) [verified: https://statista.com/statistics/1379484/tiktok-potential-advertising-reach-in-israel].

| Platform | Approximate reach in Israel (2025–2026) | Main SMB use | Formats that work |
|---|---|---|---|
| **WhatsApp** | Near-universal; about 95%+ of internet users | Customer service, quotes, appointment booking, broadcast lists, **Status**, **Channels**, Business catalog | 9:16 vertical, under 60 s for Status; short promos and "offer of the week" |
| **YouTube** | Widest video reach [verified: #1 by ad reach, Feb 2025, https://www.statista.com/statistics/1495494/israel-potential-ad-reach-social-media-platform], about 6.5–7M users (user count still unverified) | Long promo videos, how-tos, **Shorts** | 16:9 promo (60–120 s), Shorts 9:16 |
| **Facebook** | About 5–5.6M ad reach; older (30+) demographics. [corrected: NapoleonCat counts ≈8.1M Facebook users (June 2026) from Meta ad tools, https://stats.napoleoncat.com/facebook-users-in-israel/2026/06/; Statista ranks Facebook #2 by ad reach after YouTube. Treat 5–5.6M as an underestimate of the ad audience] | Pages, **local groups** (neighborhood, "המלצות על בעלי מקצוע", mothers' groups), Marketplace, lead ads | 1:1 or 4:5 feed video, Reels |
| **Instagram** | About 4–5M ad reach; strongest for beauty, food, fitness and lifestyle. [corrected: NapoleonCat counts ≈5.88M Instagram users (Aug 2026, 61.3% of population), https://stats.napoleoncat.com/social-media-users-in-israel/] | Reels, Stories (polls, links), collaborations with micro-influencers, giveaways | **Reels 9:16, 7–45 s**; carousels; before/after |
| **TikTok** | About 3.5–5M (18+); fast growth, younger. [verified: ad reach ≈44% of population / 64.9% of adults 18+ in Feb 2025 (≈4M+), https://statista.com/statistics/1379484/tiktok-potential-advertising-reach-in-israel] | Trends, humor, "behind the scenes", UGC ads (Spark Ads) | 9:16, hook in the first 1–2 s, native captions |
| **LinkedIn** | About 2.5–3.3M members; tech-heavy | B2B, hi-tech, lawyers, accountants, consultants | Square or vertical talking head with subtitles (most people watch muted), 30–90 s |
| **Telegram** | Very high for news since Oct 2023 | Channels; little SMB marketing | n/a |
| **Google Business Profile, Waze ads** | High intent for local search | Reviews, photos, short videos | Short vertical clips |

### 4.2 What Israeli SMBs actually post (unverified-MK / inference from market practice)

- **Reels with Hebrew burned-in captions**, owner-led talking heads ("הבעלים מדבר"), before/after (beauty, renovations, aesthetics, car detailing), "a day in the life" (בייקרים, ברברים), customer testimonials (המלצות), FAQs (שאלות נפוצות), myth-busting, price/offer announcements ("מבצע לחגים"), new-product drops, behind the scenes.
- **Giveaways (הגרלות)** are popular on Instagram. Israeli law restricts lotteries and games of chance (Penal Law, around s.224–225), so giveaways are usually framed as **contests or quizzes** (unverified-MK; legal check needed). The product's "giveaway hook" templates should carry a disclaimer.
- **WhatsApp-first funnels:** almost every Israeli SMB ad ends with "שלחו לנו וואטסאפ" (click-to-WhatsApp). Every video template should end with a **WhatsApp CTA** and an optional QR code.
- **Local directories with video or ratings:** Easy (איזי), Midrag (מדרג, contractors), Yad2 and Madlan (real estate and cars), Rest (restaurants), Wolt and 10bis (food). All unverified-MK.

### 4.3 Population segments that change creative (unverified-MK; verify with the Central Bureau of Statistics)

| Segment | Approx. share | Creative implication |
|---|---|---|
| Hebrew-speaking Jewish mainstream | about 73% of the population (Jews and others combined, about 79%) | Default |
| **Arab citizens** | about 21% | **Arabic** VO and captions (RTL as well); separate tone and holidays (Ramadan, Eid). A big underserved SMB market |
| **Haredi** (ultra-Orthodox) | about 13–14% of the population, growing | **Modesty norms**: Haredi media typically avoids images of women; no Shabbat publishing; distinct vocabulary. Offer a "מותאם לציבור החרדי" template mode |
| **Russian speakers** | about 12–15% | Russian VO and captions; Sparkiz already offers Russian [S] |
| English-speaking olim / tourists | small but high value | English toggle for real estate, tourism, clinics |

### 4.4 Posting rhythm (unverified-MK)

- The working week is **Sunday–Thursday**. Friday mornings are big for leisure, food and weekend browsing. **Shabbat** (Friday evening to Saturday evening): many businesses and religious audiences don't post. Offer a **"no Shabbat publishing"** scheduler flag.
- Prime times are evenings around 20:00–23:00. Lunch scrolling peaks around 12:00–14:00 (estimate).

---

## 5. Niches: a prioritized list for Israel (35)

**Scoring (inference):** priority weighs (a) number of businesses in Israel, (b) how often they need content, (c) willingness to pay, (d) how visual the business is, and (e) how well AI can produce the content without real footage. **Budget** is the **estimated current spend** on video (unverified estimate). Every niche gets: hooks library, script templates, shot list, music mood, CTA, and compliance notes.

### 5.1 Priority table

| # | Niche (Hebrew) | Tier | Why video | Typical video types | Est. current video spend (₪) | Seasonal hooks | Example Hebrew hook | Compliance flag |
|---|---|---|---|---|---|---|---|---|
| 1 | **נדל"ן: מתווכים ומשרדי תיווך** | A | Every listing needs video; a personal brand wins exclusive listings | Property tour, neighborhood guide, agent brand reel, "נמכר!" | ₪300–₪1,500 per property; ₪2,000–₪6,000/mo for content | Back to school (moving season, summer), Pesach, interest-rate news | "3 דברים שאף מתווך לא יגיד לכם לפני שאתם קונים דירה" | Broker license details in ads (check the Brokers Law) |
| 2 | **נדל"ן: יזמים ופרויקטים חדשים** | A | High-value launches; renderings fit AI well | Project teaser, rendering fly-through, lifestyle | ₪10,000–₪100,000+ per project | Exhibitions, "מחיר למשתכן", campaign launches | "ככה ייראה הבוקר שלכם בעוד שנתיים" | Accurate claims; "הדמיה בלבד" disclaimer |
| 3 | **קליניקות אסתטיקה וקוסמטיקה** (בוטוקס, פילרים, הסרת שיער, טיפולי פנים) | A | Visual, trust-driven, frequent offers | Before/after, treatment explainer, myth-busting, doctor intro | ₪1,500–₪6,000/mo | Pre-summer (hair removal), Rosh Hashana and wedding season, Black Friday | "אל תעשי בוטוקס לפני שאת שומעת את זה" | **Medical advertising rules**; before/after and testimonials restricted (verify) |
| 4 | **ציפורניים, גבות, ריסים, איפור** | A | A huge number of micro-businesses with Instagram-native customers | Close-up transformation, trends, price list, "מקום פנוי השבוע" | ₪300–₪1,500/mo | Holidays, brides season, Valentine's, Tu B'Av | "הלק שמחזיק 4 שבועות? ככה עושים את זה" | Low |
| 5 | **מספרות וברברשופ** | A | Transformations, personality-driven | Before/after, time-lapse, "קאט של השבוע" | ₪300–₪1,500/mo | Back to school haircuts, holidays, weddings | "התספורת שכל גבר בן 30 צריך לנסות" | Low |
| 6 | **מסעדות, בתי קפה, בייקריות** | A | Food is the most visual content; launches and menus | Dish close-ups, chef story, menu promo, events | ₪1,000–₪5,000/mo | Holidays (חגי תשרי, Pesach menus, Shavuot dairy), summer, Valentine's | "המנה שגורמת לאנשים לנסוע שעה בשבילה" | Kashrut claims must be accurate |
| 7 | **מאמני כושר, סטודיו, פילאטיס, יוגה** | A | Results, community, recurring classes | Workout snippets, transformation, trainer intro, schedule | ₪500–₪3,000/mo | January resolutions, pre-summer, after the holidays ("אחרי החגים מתחילים") | "אם יש לך 15 דקות ביום, זה האימון בשבילך" | Health-claim caution |
| 8 | **קבלני שיפוצים, מטבחים, נגרות** | A | Projects are visual; leads are high-value | Before/after, project tour, process, testimonials | ₪500–₪3,000/mo | **Pre-Pesach renovation rush**, after summer | "ככה הפכנו מטבח מ-1995 למטבח חלומות ב-10 ימים" | Licensed contractor (רשם הקבלנים) where relevant |
| 9 | **רופאי שיניים ומרפאות** | A | Fear-reducing explainers; high-value implants and aligners | Procedure explainer, clinic tour, doctor intro, FAQ | ₪1,000–₪5,000/mo | Back to school (kids), year-end health-fund (קופ"ח) benefits | "השתלת שיניים: 5 שאלות שחייבים לשאול לפני" | **Medical / dental advertising rules** (verify) |
| 10 | **יועצי משכנתאות** | A | Educational, trust, high LTV | Explainers, rate updates, myths, client stories | ₪500–₪2,500/mo | Bank of Israel rate decisions, new-year planning | "הריבית ירדה. מה זה אומר על המשכנתא שלכם?" | Financial claims; avoid promises |
| 11 | **אולמות וגני אירועים, הפקות** | A | Venue tours, wedding-season sales | Venue tour, real-wedding highlights, menu | ₪3,000–₪20,000 per year | Wedding season (spring–autumn), engagements after holidays | "ככה נראית חתונה של 400 איש אצלנו" | Couples' consent for real footage |
| 12 | **חנויות אונליין (e-commerce)** | A | Product ads, UGC, high volume | Product demo, UGC ad, unboxing, offer | ₪500–₪5,000/mo | **Black Friday, 11.11**, holidays, back to school | "הפסקתי לחפש מתנות לחג ברגע שגיליתי את זה" | Price and discount display rules |
| 13 | **סוחרי רכב, מגרשי רכב, ליסינג** | A | Every car needs a video; volume | Car walkaround, financing offer, "רכב השבוע" | ₪1,000–₪5,000/mo | Year-end models, January "רכב חדש", summer | "רכב משפחתי עד 100 אלף? אלה 3 האפשרויות" | Price and finance disclosure rules |
| 14 | **מוסכים, מכוני רכב, דיטיילינג** | B | Before/after detailing | Detailing transformation, service tips | ₪300–₪1,500/mo | Pre-holiday trips, winter prep | "ככה ניקינו רכב אחרי חופש גדול עם 3 ילדים" | Low |
| 15 | **עורכי דין** | B | Authority, explainers, LinkedIn | Expert explainer, FAQ, "זכויות שלא ידעתם" | ₪500–₪3,000/mo | Tax-year end, labor-law changes | "פוטרתם? 3 זכויות שהמעסיק לא יספר לכם" | **Bar Association advertising rules** (כללי לשכת עוה"ד (פרסומת)): no result promises (verify) |
| 16 | **רואי חשבון ויועצי מס** | B | Seasonal explainers | Tax tips, deadline reminders | ₪300–₪2,000/mo | Annual report season, **VAT and invoice-rule changes**, year-end | "עוסק פטור? זה מה שמשתנה לכם השנה" | Professional accuracy |
| 17 | **סוכני ביטוח ופיננסים / פנסיה** | B | Education, trust | Explainers, "בדיקת תיק" offers | ₪500–₪2,500/mo | Year-end pension deposits, January | "בדקתם כמה דמי ניהול אתם משלמים?" | Capital Market Authority rules (verify) |
| 18 | **אדריכלות ועיצוב פנים** | B | Portfolio and renderings fit AI | Project reveal, design tips, mood | ₪500–₪3,000/mo | Pre-Pesach, new-apartment season | "3 טעויות עיצוב שעולות ביוקר" | Low |
| 19 | **צלמים (אירועים, משפחה, תדמית)** | B | Portfolio reels | Highlight reel, behind the scenes, offer | ₪200–₪1,000/mo | Weddings, bar/bat mitzvah, holidays (family photos) | "ככה גורמים גם למי ששונא מצלמות לחייך" | Subjects' consent |
| 20 | **DJ, להקות, מוזיקאים לאירועים** | B | Energy, proof | Event highlight, setlist teaser | ₪200–₪1,500/mo | Wedding season, Purim, New Year's Eve (סילבסטר) | "הרגע שבו כל האולם קם לרקוד" | Music licensing (see §7.7) |
| 21 | **צימרים, בתי מלון בוטיק, וילות** | B | Visual escapism; seasonal bookings | Property tour, couples' getaway, weekend deal | ₪1,000–₪10,000 per year | Summer, holidays, Tu B'Av, winter (ג'קוזי) | "צימר עם ג'קוזי מול הנוף, שעה וחצי מתל אביב" | Low |
| 22 | **תיירות, אטרקציות, סיורים** | B | Experiences | Experience teaser, family-day promo | ₪500–₪5,000/mo (seasonal) | Summer vacation, Sukkot, Pesach (חול המועד) | "מה עושים בחול המועד עם ילדים? הנה רעיון" | Low |
| 23 | **מורים פרטיים, קורסים, מאמנים עסקיים** | B | Personal brand, webinars | Expert tips, course promo, testimonials | ₪300–₪2,000/mo | Back to school, exam seasons (בגרויות, פסיכומטרי) | "איך עליתי 100 נקודות בפסיכומטרי ב-3 חודשים" | Results-claim caution |
| 24 | **מטפלים, פסיכולוגים, קואצ'רים** | B | Trust, destigmatizing | Soft explainers, "מתי לפנות לטיפול" | ₪300–₪1,500/mo | Post-holiday stress, back to school | "אם אתם מרגישים שאתם רק שורדים, זה בשבילכם" | Professional ethics; avoid testimonials (verify) |
| 25 | **וטרינרים, מספרות כלבים, פנסיונים** | B | Pets are viral | Grooming before/after, tips | ₪200–₪1,000/mo | Summer (heat), fireworks or holiday stress, vacation pet boarding | "הכלב שלכם מפחד מזיקוקים? 3 טיפים" | Low |
| 26 | **בתי ספר לנהיגה** | B | Young audience on TikTok | Tips, test-day humor, pass rates | ₪200–₪1,000/mo | Summer (age-17 learners), back to school | "5 טעויות שמכשילות בטסט, ואיך להימנע" | Low |
| 27 | **גנים, צהרונים, חוגים, קייטנות** | B | Registration seasons | Facility tour, activity highlights | ₪300–₪2,000 per season | **Registration (Jan–Mar), summer camps (קייטנות)**, back to school | "ככה נראה יום בקייטנה שלנו" | **Minors' images: parental consent** |
| 28 | **בעלי מקצוע: חשמלאים, אינסטלטורים, מיזוג** | B | Trust and speed; Midrag-style reviews | Tips, "עבודה של היום", emergency service | ₪200–₪1,000/mo | **Summer A/C rush**, winter (boilers, leaks) | "המזגן מטפטף? אל תתקשרו לטכנאי לפני שתבדקו את זה" | Licensing for electricians (verify) |
| 29 | **הובלות ואחסון** | C | Moving seasons | Process, tips, price offer | ₪200–₪1,000/mo | Summer (peak moving), before holidays | "ככה אורזים מטבח בלי לשבור כלום" | Low |
| 30 | **חנויות פיזיות: אופנה, אופטיקה, פרחים, יודאיקה** | C | Offers and collections | Collection drops, sales, gift guides | ₪300–₪2,000/mo | Holidays (gifts), Black Friday, Mother's Day (יום המשפחה) | "מתנה לחג ב-100 ש"ח שנראית כמו 500" | Price display |
| 31 | **קייטרינג ושפים פרטיים** | C | Food plus events | Dish reels, event setups | ₪300–₪1,500/mo | Holidays (חג meals), bar/bat mitzvah, Shavuot | "ארוחת חג ל-20 איש בלי לעמוד במטבח" | Kashrut accuracy |
| 32 | **הייטק וסטארטאפים (B2B)** | C | Product explainers, LinkedIn, launches | Explainer, launch video, recruiting | ₪5,000–₪50,000 per video | Funding announcements, conferences, recruiting | "בנינו את זה כי נמאס לנו מ..." | English plus Hebrew; IP |
| 33 | **עמותות ומלכ"רים** | C | Fundraising emotion | Impact story, campaign | ₪1,000–₪10,000 per campaign | **Before Rosh Hashana / Yom Kippur (donation season)**, Hanukkah, crises | "ב-50 ש"ח אתם נותנים ל..." | Section 46 tax-credit wording accuracy |
| 34 | **פוליטיקה מקומית ומועמדים** | C | Campaign volume | Candidate intro, issues, rally clips | Spikes during elections | **Knesset elections on Oct 27, 2026** (Knesset dissolved July 17, 2026) [verified: https://blogs.loc.gov/law/2026/10/falqs-israels-upcoming-election-on-october-27-2026/]; municipal elections (next due 2028, unverified) | "3 דברים שאני אשנה ביום הראשון" | **Elections propaganda law**; deepfake risk. Consider excluding this niche or requiring identity checks |
| 35 | **פיזיותרפיה, דיאטנים, נטורופתיה** | C | Educational | Tips, myths | ₪300–₪1,500/mo | January, pre-summer, after the holidays | "זה המאכל ש'בריא' אבל הורס לכם את הדיאטה" | Health-claim caution |

**Launch recommendation (inference):** start with **8–12 Tier A niches**, each with 50–100 Hebrew hooks and 5–8 video templates. Add **one SEO landing page per niche** (for example "סרטון תדמית לרופא שיניים", "הוקים לרילס נדל"ן"). Expand to Tier B monthly.

### 5.2 Hook archetypes that work in Israeli Hebrew (for the hooks library schema; inference)

| Archetype | Hebrew pattern | Example |
|---|---|---|
| Mistakes / warnings | "X טעויות ש..." / "אל ת... לפני ש..." | "אל תחתמו על משכנתא לפני שתראו את זה" |
| Secret / insider | "מה שאף [מקצוע] לא יגיד לכם" | "מה שאף מתווך לא יגיד לכם על דירות קבלן" |
| POV | "POV: ..." (English loan is common) | "POV: נכנסת לסלון ויצאת עם שיער חדש" |
| Price shock | "כמה באמת עולה..." | "כמה באמת עולה שיפוץ אמבטיה ב-2026?" |
| Before/after | "ככה זה נראה לפני... ועכשיו" | "ככה נראה המטבח לפני. חכו לסוף" |
| Myth-busting | "מיתוס או אמת?" | "בוטוקס רק למבוגרות? מיתוס" |
| Local identity | "[עיר], ..." / "לכל מי שגר ב..." | "רעננה, יש לכם ברבר חדש" |
| Israeli humor / relatable | "רק בישראל..." / "כל ישראלי מכיר את זה..." | "כל ישראלי מכיר את הרגע שהקבלן אומר 'עוד שבוע'" |
| Holiday tie-in | "לפני החג..." | "לפני פסח: 3 תיקונים שחייבים לעשות בבית" |
| Question to the viewer | "גם לכם קורה ש...?" | "גם לכם המזגן מריח מוזר?" |
| Number list | "3 דרכים / 5 סיבות" | "5 סיבות לבחור באולם בצפון" |
| Social proof | "מעל 1,000 לקוחות כבר..." | (must be true; see the misleading-advertising rules in §7) |

The schema should include: niche, archetype, gender form (plural, male or female), register (formal, warm or slang), platform, season tag, CTA, compliance flags, and performance stats (when users opt in).

### 5.3 Israeli marketing calendar, Oct 2026 – Sep 2027

*Hebrew-calendar dates are **computed by me** and must be verified with hebcal.com. Holidays begin the previous evening.*

| Date (approx.) | Occasion | Niches that benefit | Notes |
|---|---|---|---|
| Sep 12–13, 2026 (passed) | ראש השנה 5787 | All; donations; gifts | Next cycle: about Oct 2, 2027 |
| Oct 3, 2026 (passed) | שמחת תורה, end of the Tishrei holidays | "אחרי החגים" restarts: fitness, diets, renovations | The "אחרי החגים" mindset is a strong hook through October |
| Nov 11, 2026 | 11.11 (Singles Day) | E-commerce | |
| **Nov 27, 2026** (Black Friday); Nov 30 (Cyber Monday) | בלאק פריידיי | E-commerce, beauty, clinics, gyms, cars | Very large in Israel; campaigns run all of November |
| **Dec 4–12, 2026** (first candle evening of Dec 4) | חנוכה | Food (סופגניות), kids' activities, gifts, family attractions | |
| Dec 31, 2026 | סילבסטר / New Year's Eve | Bars, DJs, events | Secular audiences |
| Jan 2027 | New calendar year | Fitness, diets, courses, accountants | |
| about Jan 23, 2027 | ט"ו בשבט | Nurseries, healthy food | |
| about Feb 7, 2027 | יום המשפחה (Mother's Day) | Gifts, flowers, beauty | |
| Jan–Mar 2027 | Kindergarten and school registration, summer-camp sign-ups | Kindergartens, after-school programs, private schools | |
| **about Mar 23, 2027** | פורים | Costumes, events, DJs, bakeries (משלוחי מנות) | 5787 is a leap year, so Purim falls in Adar II |
| **Mar–Apr 2027** | **Pre-Pesach** (cleaning, renovations, appliances) | Contractors, cleaning, kitchens, appliances, furniture | One of the biggest service-business peaks |
| **about Apr 21 (evening) – Apr 28, 2027** | פסח | Restaurants (kosher for Pesach), tourism and zimmers (חול המועד) | |
| **about May 4, 2027** | **יום השואה: quiet day** | none | Auto-pause promotional publishing |
| **about May 11, 2027** | **יום הזיכרון: quiet day** | none | Auto-pause |
| about May 12, 2027 | יום העצמאות | BBQ (מנגל), events, patriotic offers | Respectful tone |
| about May 25, 2027 | ל"ג בעומר | Events; weddings resume for religious couples | |
| about Jun 11, 2027 | שבועות | Dairy food, bakeries, cheese shops | |
| Jul–Aug 2027 | Summer vacation (החופש הגדול) | Zimmers, attractions, camps, A/C, moving companies | "The Three Weeks" (about mid-July to Aug 12): fewer religious weddings and events |
| about Aug 18, 2027 | ט"ו באב (Israeli love day) | Romantic getaways, jewelry, beauty | |
| Sep 1, 2027 | Back to school | Kids' retail, driving schools, tutors, haircuts | |
| about Oct 2, 2027 | ראש השנה 5788 | All | |

**Product idea (inference):** a "לוח תוכן ישראלי" (Israeli content calendar) that suggests niche hooks two weeks before each date and **blocks** promotional auto-posting on memorial days and Shabbat (optional).

---

## 6. Hebrew-specific challenges and solutions

### 6.1 Hebrew text-to-speech (TTS)

| Challenge | Detail | Mitigation |
|---|---|---|
| **No niqqud means ambiguous words** | Written Hebrew omits vowels. For example ספר can be sefer, sapar, safar or siper; and בריכה, מגיש, כתבה, חלב are similar cases. TTS guesses from context and gets brand names, surnames and rare words wrong | (1) Have the LLM output a **pronunciation-annotated script**: add niqqud only to ambiguous words, or a phonetic respelling. (2) Keep a **per-business pronunciation dictionary** (brand names, staff names, street names). (3) Optionally run Dicta's **Nakdan** (automatic niqqud, Israeli nonprofit; unverified-MK) before TTS |
| **Stress (milra vs. mil'el)** | Names such as מיכל and יוסי, and slang, are often stressed wrongly | Phonetic respelling in a "say-as" layer; let the user preview and fix with a "תקן הגייה" button |
| **Numbers and gender agreement** | Numbers agree with the noun's gender (שלוש שעות vs. שלושה ימים), and so do prices ("₪99" → "תשעים ותשע שקלים"), dates and phone numbers | The LLM normalizes the script before TTS: spell out numbers in words with the correct gender; phone numbers digit by digit; "₪" → "שקלים" or "ש"ח" |
| **Acronyms with gershayim** | עו"ד, רו"ח, נדל"ן, צה"ל, בע"מ, ש"ח, מע"מ | Expansion dictionary: עו"ד → "עורך דין"; נדל"ן → "נדל"ן" read as a word; מע"מ → "מַעַ"ם" |
| **English words inside Hebrew** | "סייל", "בלאק פריידיי", brand names in Latin letters | Write loanwords in Hebrew letters in VO scripts; keep Latin letters only for on-screen text |
| **Voice quality and accent** | Most Hebrew TTS voices sound like radio announcers or flat. Israeli casual speech (fast, upbeat, "דוגרי") is hard to get. ElevenLabs v4 lists Hebrew [S](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4); Gemini TTS has he-IL in preview [S](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts); Azure (he-IL Avri and Hila) and Google Cloud he-IL WaveNet voices have existed for years (unverified-MK) | Offer **4–8 curated voices** (male and female, young, mature, energetic, calm) after **native-speaker blind tests**. Allow an **owner voice clone, with consent** (§7.8) |
| **Video-model native audio** | Kling 3.0 native speech excludes Hebrew [S](https://www.atlascloud.ai/blog/tips/kling-3.0-review-features-pricing-ai-alternatives) | Generate visuals without speech; add Hebrew VO and lip-sync (e.g. HeyGen Avatar IV through OpenRouter with your own Hebrew audio [S](https://openrouter.ai/heygen/avatar-iv)) in a separate step |
| **Hebrew speech-to-text for captions** | Needed when users upload their own talking-head footage | ElevenLabs Scribe v2 lists Hebrew, about $0.0019/min through OpenRouter [S](https://openrouter.ai/elevenlabs/scribe-v2). The open-source **ivrit.ai** Whisper fine-tunes for Hebrew are an alternative (unverified-MK) |

### 6.2 RTL subtitles and on-screen typography

- **Bidi pitfalls:**
  - Punctuation jumps to the wrong side: a period, "!" or "?" at the end of a Hebrew line appears at the left or right incorrectly when the line ends with Latin text or digits.
  - Parentheses appear mirrored.
  - Phone numbers and prices (₪99) get reordered.
  - "%" placement goes wrong.
  - Mixed Hebrew and English in one line ("מבצע Black Friday עד 50%") gets reordered.
- **Mitigations (inference / engineering practice):**
  - Render captions in **HTML/CSS through Remotion** (Chromium's bidi algorithm) with `direction: rtl; unicode-bidi: plaintext` per line.
  - Wrap Latin and number runs in isolates: `<bdi>`, or Unicode FSI/RLI…PDI (U+2068/U+2067…U+2069).
  - Add RLM (U+200F) after trailing punctuation.
  - If you use FFmpeg/libass, make sure the build has **libfribidi + HarfBuzz**. Test ASS subtitles with Hebrew plus numbers.
- **Word-by-word animated captions** (karaoke highlight) must progress **right to left**, and word timing must map to visual order, not byte order. Do line breaking on whole words. Hebrew has no hyphenation convention in captions.
- **Hebrew fonts:** Google Fonts with Hebrew include **Heebo, Assistant, Rubik, Varela Round, Secular One, Suez One, Frank Ruhl Libre, Noto Sans Hebrew, Alef, Karantina, Bellefair, Amatic SC and Open Sans** (unverified-MK; check each font's Hebrew subset). Offer 6–10 caption style presets built for Hebrew. Note that Hebrew has **no capital letters**, so emphasis comes from weight, color or highlight boxes.
- **Never let image or video models render Hebrew text.** Generate frames without text and overlay Hebrew in the render layer (inference, consistent with [S] 04-openrouter.md §2).
- **Safe zones:** in 9:16, keep captions above the bottom 20–25% and away from the right-side action buttons (Reels and TikTok), which in RTL is where a Hebrew line *starts*. Center captions or offset them slightly left (inference).
- **Accessibility bonus:** burned-in captions plus an exported **SRT/VTT** file help customers meet IS 5568 caption requirements for video on their own websites (§7.1). This is a selling point.

### 6.3 Gendered language (לשון זכר / נקבה / רבים)

- Hebrew imperatives, verbs, adjectives and pronouns are gendered: "תזמין / תזמיני / תזמינו", "אתה מוכן? / את מוכנה? / אתם מוכנים?".
- **Marketing defaults (unverified-MK, market practice):**
  - **Plural (לשון רבים)** is the de facto neutral: "בואו", "תזמינו", "גלו". It is the safest default.
  - **Female singular** works for female-dominant audiences (beauty, nails, aesthetics, many mothers' products): "את מגיעה, אנחנו דואגות לשאר".
  - Slash forms ("הזמן/י", "מוזמנים/ות") read poorly on screen and cannot be spoken. Never use them in VO.
- **The speaker's gender must match the voice:** "אני ממליץ" vs. "אני ממליצה", "אני מאמין/מאמינה". The LLM needs `voice_gender` and `audience_gender` as **explicit inputs**.
- Business self-reference ("אנחנו") is gender-neutral in the present tense only for plural forms ("אנחנו מגיעים" is masculine or mixed plural; a women-run studio may prefer "אנחנו מגיעות").
- **Implementation:** a gender selector in the brief ("פנייה ל: רבים / נשים / גברים", "קריין: גבר / אישה"). Store hooks in a canonical form and have the LLM **re-inflect** them.

### 6.4 Register, slang and English mixing

- Israeli ad tone is **direct, informal, warm and humorous**. Over-formal Hebrew ("הננו שמחים להציע") sounds bureaucratic, while LLM output often sounds **"translated from English"**: clichés such as "קחו את העסק שלכם לשלב הבא", "פתרון חדשני ומקיף", "זה הזמן ל...", "בעולם של היום". The system prompt should ban these.
- **Register presets:** רשמי-מקצועי (lawyers, accountants, clinics), חם-אישי (therapists, small studios), קליל-עממי (restaurants, trades), צעיר-סלנג (barbers, TikTok, nightlife).
- **Common slang and loanwords** used in ads (unverified-MK): יאללה, סבבה, אחלה, תכלס, וואלה, פצצה, מטורף, על הכיפאק, דיל, סייל, וייב, לוק, אאוטפיט, POV, "בלי חרטא" (very casual). Let the user dial slang intensity.
- **Spelling:** use **כתיב מלא** (full spelling: "מבצע", "תוכנית", "צהריים") consistently. Use correct geresh and gershayim (׳ ״ vs. ' "). Handle typographic vs. ASCII quotes carefully because they affect TTS and fonts.
- **Arabic and Russian:** the same pipeline for Arabic (RTL) and Russian VO and captions opens about 30%+ of the population (§4.3). Arabic shares the bidi stack.

### 6.5 Humor, culture and sensitivities

- Relatable Israeli humor themes (inference): קבלנים ש"עוד שבוע", traffic on the Ayalon highway, cost of living (יוקר המחיה), "פראייר" culture, Israeli moms (אמא פולנייה / מרוקאית), Friday-night dinners, army and reserves references, "רק בישראל".
- **Since Oct 7, 2023 and the war that followed:** avoid war or terror jokes. Reservist (מילואימניקים) discounts and solidarity messaging are common, but tone must be respectful. Block promotional content on memorial days (§5.3) (unverified-MK, market practice).
- **Religious sensitivity:** kashrut claims, Shabbat, and modesty templates for Haredi audiences (no women's images, modest dress) (unverified-MK).
- **Political neutrality:** keep the default templates apolitical.

### 6.6 LLM style-guide snippet for Hebrew copy (inference; put it in a cached system prompt)

```
כתוב בעברית ישראלית טבעית, עכשווית וזורמת, כאילו נכתבה במקור בעברית ולא תורגמה.
פנייה: {plural|female|male}. קריין/ית: {male|female}. רמת שפה: {formal|warm|casual|slang}.
אסור: "קחו את העסק לשלב הבא", "פתרון חדשני", "בעולם של היום", "זה הזמן ל", לוכסנים (הזמן/י), סימני קריאה כפולים.
מספרים: כתוב במילים בהתאמת מין בתסריט הקריינות; בכתוביות – ספרות.
ראשי תיבות: פרוש בתסריט הקריינות (עו"ד → עורך דין).
שמות פרטיים ומותגים: הוסף ניקוד חלקי או תעתיק פונטי בסוגריים מרובעים לקריינות.
משפט פתיחה (הוק): עד 8 מילים, ניתן להבנה בלי סאונד, ללא שם העסק.
CTA: סיים בהנעה לפעולה אחת ברורה (וואטסאפ / טלפון / קישור בביו).
```

---

## 7. Legal and regulatory requirements for an Israeli SaaS (2025–2026)

> Everything in this section is **(unverified-MK)** unless it has [S]. It is **not legal advice**. Have an Israeli tech lawyer (privacy, consumer, IP) and an accountant confirm it before launch.

### 7.1 Website accessibility (נגישות אתרים)

- **Law:** חוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, and **תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013**. **Regulation 35** requires internet services offered to the public to comply with **Israeli Standard IS 5568**, which is based on **WCAG 2.0 level AA**, with some exceptions. [verified: https://www.wawsome.com/blog/israel-digital-accessibility-law-is-5568-guide ; Ministry of Education statement template also says IS 5568 = WCAG 2.0 AA, https://meyda.education.gov.il/files/anan_chinuchi/meda_lspakim/tfasim/hazarat_iazran_benose_negishut.pdf]
- **IS 5568 updates:** the Standards Institution has worked on aligning with **WCAG 2.1**, and many Israeli accessibility consultants already audit against **WCAG 2.1 AA** or **2.2 AA**. Build to **WCAG 2.2 AA** to be safe. (2026-10-13: no official 2025–2026 update of Regulation 35 or of IS 5568 Part 1 to WCAG 2.1/2.2 was found; **IS 5568 Part 1 (2021) is a translation of WCAG 2.0** with national additions. **IS 5568 Part 2 (accessibility of digital documents)** was published 28/09/2023 [verified: https://www.sii.org.il/he/lobby/standardization/standard-page?id=6751]. Many Israeli sites voluntarily claim WCAG 2.1 AA in their statements; that is market practice, not the legal baseline. Still confirm with sii.org.il / the Equal Rights Commission.)
- **Accessibility statement (הצהרת נגישות)** required. It should cover the accessibility level, known gaps, and contact details for an accessibility coordinator (רכז/ת נגישות). [verified (secondary): court filings and class-action settlements refer to the regulations' duty to publish an accessibility statement and coordinator details, e.g. https://www.netanya.ac.il/wp-content/uploads/2021/03/תובנה-ייצוגית-בנושא-נגישות.pdf ; general guide: https://www.kolzchut.org.il/he/הנגשת_אתרי_אינטרנט_ואפליקציות_לאנשים_עם_מוגבלות]
- **Enforcement:** compensation **without proof of damage of up to about ₪50,000** (indexed) per claim under the Equal Rights Law, plus a wave of class actions against non-accessible sites. [verified (law-firm/vendor guides, not statute text): https://www.wawsome.com/blog/israel-digital-accessibility-law-is-5568-guide ; https://www.law.co.il/news/2013/11/13/New-website-accessibility-regulations-enacted/ . One secondary guide also mentions a notice-and-cure period (reported as 60 days) before suing; unverified.] Small-business exemptions or relaxations exist by annual turnover. [corrected: Kol Zchut describes an **automatic "heavy economic burden" exemption for bodies whose annual turnover does not exceed ₪1,000,000** (not available to public authorities), plus exemptions for technological infeasibility and low-traffic sites, some of which require applying to the authority, https://www.kolzchut.org.il/he/פטור_מחובת_הנגשה_לאתרי_אינטרנט_ואפליקציות . The earlier "about ₪100,000" figure was not found in any official source; some unofficial guides cite ₪100,000–₪120,000 for a different relief. A funded SaaS will exceed ₪1M quickly, so plan to comply regardless.]
- **Practical build requirements:**
  - Semantic HTML and correct `lang="he" dir="rtl"`.
  - Keyboard navigation and visible focus.
  - Contrast of at least 4.5:1.
  - Form labels and error messages in Hebrew.
  - Captions on all prerecorded video on the marketing site (WCAG 1.2.2). Transcripts or audio description (1.2.5 at AA) for informative videos.
  - Pause controls for auto-playing video (2.2.2).
  - No reliance on color alone.
  - Accessible video editor controls.
  - Don't rely on accessibility overlay widgets alone. They are common in Israel but don't guarantee compliance (unverified-MK; this is the expert consensus).

### 7.2 Privacy: Protection of Privacy Law, Amendment 13

- **Status:** the Knesset passed it in **August 2024**, and it took effect **August 14, 2025**. [verified: https://www.chamber.org.il/serviceslobby/legal/74023/164240/ ; https://www.rsm.global/israel/he/node/228]
- **Key changes relevant to a SaaS:**
  - **Expanded definitions:** "מידע אישי" (personal data) and **"מידע בעל רגישות מיוחדת"** (sensitive data), which includes **biometric identifiers** (likely covering **voice prints** and **face data** used for voice cloning or avatars), health, and more. [verified: the new defined term "מידע בעל רגישות מיוחדת" and "בעל שליטה", https://www.shibolet.com/אישור-תיקון-13-לחוק-הגנת-הפרטיות/ ; that biometric data falls inside it is seen only in secondary sources in this pass, so still check the statutory list]
  - **Administrative fines:** the **Privacy Protection Authority (הרשות להגנת הפרטיות)** can impose substantial fines, scaled by the number of data subjects and the violation type, reaching millions of ₪ for large databases. It also has stronger investigative powers. [verified (law-firm/chamber summaries; sources include https://www.chamber.org.il/serviceslobby/legal/74023/164240/ and https://www.rsm.global/israel/he/node/228): (first time the Authority can impose עיצומים כספיים; amounts vary with violation type, scale and organization, with mitigation for micro and small businesses; can reach millions of ₪). Officers' personal responsibility for oversight is also expanded. The Authority has already imposed a fine under the amended law, per a Shibolet client update: https://www.shibolet.com/%D7%A2%D7%93%D7%9B%D7%95%D7%9F-%D7%9C%D7%A7%D7%95%D7%97%D7%95%D7%AA-%D7%90%D7%9B%D7%99%D7%A4%D7%94-%D7%91%D7%A2%D7%A7%D7%91%D7%95%D7%AA-%D7%AA%D7%99%D7%A7%D7%95%D7%9F-13-%D7%94%D7%A8%D7%A9%D7%95/]
  - **DPO (ממונה הגנת פרטיות)** is mandatory for: public bodies; data brokers; and controllers whose core activities involve **systematic monitoring at large scale** or **processing of sensitive data at large scale**. A platform storing many customers' **voice clones and face avatars** may fall into the last category. Get advice. [verified: https://alliott.co.il/wp-content/uploads/2025/08/תיקון-13-לחוק-הגנת-הפרטיות-מתי-חייבים-למנות-ממונה-פרטיות-ומה-המשמעות-לעסקים.pdf . Details from the Authority's **draft DPO opinion (comments closed 23.9.2025)**: data brokers mainly where the database exceeds 10,000 data subjects; "בהיקף ניכר" is judged by number of subjects, sensitivity, frequency and retention, and targets organizations whose *core* activity is the processing (not ancillary HR data); voluntary appointment recommended in borderline cases; the DPO cannot be the CEO, CTO/IT manager or CISO. Final version of the opinion not confirmed.]
  - **Database registration** is narrowed to mainly data brokers and public bodies. A **notification duty** may apply for large sensitive-data databases (exact thresholds to verify).
  - **Expanded notice duties** when collecting data: purpose, whether provision is mandatory, recipients, and rights. [verified: amended s.11 adds the controller's identity and contact details, the consequences of refusing consent, and data-subject rights (law-firm summaries; sources include https://www.gornitzky.co.il/wp-content/uploads/pdf/post/30434_----------.pdf and https://meitar.com/wp-content/uploads/2025/02/In-honor-of-International-Data-Privacy-Day-–-Key-updates-in-the-field-of-privacy-in-Israel-HEB.pdf)]
- **Data Security Regulations 2017** (תקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017) still apply:
  - Database definition document, security procedures, access control, logging, and periodic risk assessments, depending on the security tier.
  - **Notification of severe security incidents** to the Authority.
- **Cross-border transfers:** the Privacy Protection (Transfer of Data Abroad) Regulations 2001 apply. The EU reaffirmed Israel's **adequacy** status in **January 2024**. Hosting on Supabase or Vercel in the EU or US is common, but you need a lawful transfer basis (contractual commitments). Choose the **Supabase region** deliberately (e.g. EU-Frankfurt) and document it.
- **AI-specific guidance:** the Privacy Protection Authority published (draft) guidance on applying privacy law to **AI systems**, around **2025**, covering transparency, legal basis for training on personal data, and accuracy. [verified: draft published for public comment on **April 28, 2025**; it says the law applies across the AI lifecycle (training and use), including personal data *inferred* by AI systems, and requires a lawful basis at every stage, https://www.shibolet.com/?p=20425 . A final version was **not** found; still verify.]
- **Build implications:**
  - A privacy policy in Hebrew.
  - Granular consent records in Supabase (a `consents` table with timestamp, version, IP and scope).
  - Separate explicit consent for **biometric voice and face** processing.
  - Retention limits and deletion: users can delete voice clones and avatars, with cascading deletion at providers.
  - Row Level Security (RLS) on all tables, encryption at rest, audit logs, and DPAs (data processing agreements) with OpenRouter and downstream model providers. Document **which providers OpenRouter routes to** and their retention or zero-data-retention (ZDR) settings.

### 7.3 Consumer Protection Law: subscriptions, cancellation, price display

- **Ongoing transactions (עסקה מתמשכת, around s.13ד):**
  - The consumer may cancel at any time.
  - The business must **stop charging within 3 business days** of the cancellation notice. [verified: the contract ends within 3 business days of the notice (6 business days if sent by registered mail); the consumer may choose a later date; the notice must include name and ID number, https://protocol.co.il/ongoing-transaction-cancellation/]
  - Cancellation must be possible **through the same channel used to sign up**. For online sign-ups, that means an **online cancellation option (a clear link or button)**, and also by phone and email. [corrected: under **s.13ד** the consumer may cancel, at their choice, orally (phone or in person) or in writing (registered mail, email or fax where the business has them), and a business with a website must **publish the cancellation methods on the site**, https://www.kolzchut.org.il/he/עסקה_מתמשכת . The **"same channel + dedicated, prominent cancellation link on the website"** duty comes from **s.14ט** (cancellation of consumer transactions, including distance sales), https://www.bizportal.co.il/financialconsumerism/news/article/20042624 ; a court upheld a fine against KSP for lacking such a link (s.14ט(ה)(2)), https://law.co.il/media/computer-law/ksp_express.pdf . An online-signup subscription SaaS should assume both sections apply.]
  - **Build: a self-serve "ביטול מנוי" button, prominently placed, that takes effect immediately or within 3 business days, plus a confirmation email.**
  - Pending: a 2025 amendment (reported as "תיקון 70", approved in the Economy Committee) requiring businesses to record sales and cancellation calls; final status unverified (same Bizportal article).
- **Distance sales (עסקת מכר מרחוק, s.14ג):**
  - Cancellation within **14 days** (from receipt of the product or of the transaction details, whichever is later). [verified: https://www.kolzchut.org.il/he/%D7%91%D7%99%D7%98%D7%95%D7%9C_%D7%A2%D7%A1%D7%A7%D7%AA_%D7%9E%D7%9B%D7%A8_%D7%9E%D7%A8%D7%97%D7%95%D7%A7]
  - The cancellation fee is capped at **the lower of 5% or ₪100**. [verified: https://protocol.co.il/cancellation-fee/ ; no fee when cancelling because of a defect or a mismatch with what was described]
  - For services, the consumer pays for the service already consumed.
  - **Extended cancellation (4 months)** applies to **people with disabilities, senior citizens (65+) and new immigrants (עולים חדשים)** when the deal involved a conversation (e.g. a phone sale). [verified (secondary): the conversation can include **chat or email**, which matters for a SaaS with sales chat, https://protocol.co.il/remote-selling-transaction-cancellation/]
  - Certain digital "information" may be exempt once delivered. Get advice on how this applies to consumed AI credits.
- **Free trial to paid:** Israeli law and best practice require clear disclosure, and for deals with a **promotional or benefit period**, notice before the price changes (exact section to verify). Recommended: an email and SMS **7 days before** a trial converts, with no automatic charge unless the user explicitly agreed.
- **Price display:** prices shown to consumers must **include VAT** (s.17ב, as I recall). Showing prices before VAT is acceptable only when clearly targeting businesses. **Show ₪ prices including 18% VAT** on the public pricing page, with a toggle for businesses.
- **Misleading advertising (s.2 and s.7):** applies to your own marketing ("חוסך 90% מעלות עורך וידאו" must be substantiated) and to customers' ads. Add a ToS clause making customers responsible for their ad claims, plus in-product nudges ("אל תציגו המלצות פיקטיביות").
- **Terms of service in Hebrew.** Watch out for the Standard Contracts Law (חוק החוזים האחידים), which voids unfair terms such as unilateral changes without notice or excessive limits on liability.

### 7.4 Anti-spam: Communications Law s.30A (חוק הספאם)

- Applies to advertising sent by **email, SMS, fax, automated dialing**, and (per case law) **WhatsApp or instant messaging**.
- **Requirements:**
  - **Prior express consent (opt-in)**. A pre-checked box is not consent.
  - Exception: existing customers who gave their details during a purchase or negotiation, were offered an opt-out, and receive ads for **similar products**.
  - A **one-time** consent request to a *business* address is allowed.
  - Messages must be labeled **"פרסומת"** at the start (in the email subject line), identify the sender, and include a free, easy **opt-out** ("להסרה").
- **Damages without proof of harm:** up to **₪1,000 per message**. Small claims and class actions are very common in Israel. [verified: https://www.chamber.org.il/serviceslobby/legal/74023/115485/ (also confirms the "פרסומת" label, sender details and simple opt-out). Lead (exact source not pinned; a spam judgment in the law.co.il computer-law archive): the law presumes personal liability of officers and marketing managers unless they show they did everything possible to prevent the violation. The Supreme Court has also dealt with spam class-action settlements (רע"א 335/23 Dabltech, https://law.co.il/media/computer-law/dabltech.pdf). WhatsApp applicability: no ruling surfaced in this pass; still unverified.]
- **Build:**
  - A separate unchecked marketing-consent checkbox at sign-up, logged with a timestamp.
  - Transactional emails (receipts, render-ready notices) kept separate from marketing.
  - "פרסומת" auto-prefixed on marketing campaigns.
  - One-click unsubscribe, and a suppression list synced to the email/SMS provider.
- If the product later lets users send WhatsApp or SMS campaigns with their videos, the **customer is the advertiser**. Your ToS should require them to comply, and the UI should collect consent proof.

### 7.5 Tax: VAT, invoices, Israel Invoices

- **VAT has been 18% since January 1, 2025** (up from 17%). Domestic B2C and B2B sales by an Israeli business carry 18%. **Exported services** to foreign residents may be **zero-rated** (VAT Law s.30(a)(5); conditions apply). [verified: 18% from 1.1.2025 by order published 28.2.2024, still 18% in 2026, https://www.efraty.com/?p=4246 ; https://tool.teamzlab.com/il/maam-vat-2026-calculator/]
- **עוסק פטור** (VAT-exempt small business) annual ceiling: about **₪120,000 for 2025** (verify the 2026 figure). [verified (single source): **₪122,833 for 2026**, per a Bizportal guides-series article (search surfaced https://www.bizportal.co.il/guides/news/article/20039167 and sibling guides; exact article not pinned); confirm on gov.il.] A SaaS with paid ads will quickly exceed this, so register as **עוסק מורשה** or a **חברה בע"מ** (Ltd.) from the start.
- New in 2026 (lead): dealers with annual turnover above **₪500,000** must file detailed periodic VAT reports from **Jan 1, 2026** (https://www.efraty.com/?p=4246; verify with your accountant).
- **Israel Invoices (חשבוניות ישראל, allocation numbers / מספר הקצאה):**
  - B2B tax invoices above a pre-VAT threshold need an **allocation number** from the Tax Authority for the buyer to deduct input VAT.
  - Thresholds: **₪25,000 from May 2024 → ₪20,000 from Jan 2025 → ₪10,000 from Jan 1, 2026 → ₪5,000 from Jun 1, 2026**, following the 2025 Arrangements Law acceleration. [verified (₪20,000 in 2025, ₪10,000 from 1.1.2026, ₪5,000 from 1.6.2026): https://www.gov.il/he/service/request-assignment-number-for-tax-invoice ; thresholds are **pre-VAT**; עוסקים פטורים (receipts only) are not covered, https://www.greeninvoice.co.il/magazine/israel-invoice/ . The May 2024 ₪25,000 step was not re-checked.]
  - **Impact:** most monthly SaaS invoices fall under ₪5,000, so the rule matters for **annual or agency plans** and done-for-you packages. Use an invoicing provider whose API requests allocation numbers automatically.
- **Foreign providers' costs** (OpenRouter in USD): reverse-charge or self-invoice VAT on imported services may apply to the Israeli entity. Ask your accountant. Also budget for **FX exposure**, since revenue is in ₪ and costs are in $.

### 7.6 Payments and invoicing stack (unverified-MK, market norms)

| Need | Israeli options | Notes |
|---|---|---|
| Card processing with recurring billing and tokens | **Cardcom, Tranzila, Grow (formerly Meshulam), PayPlus, Hyp (CreditGuard), iCredit (Rivhit)** | Supports Israeli cards, installments (תשלומים), ₪; most have hosted payment pages and webhooks for Node |
| Bit, Apple Pay, Google Pay | Supported by several of the processors above | Bit is very popular with Israeli consumers |
| Invoices and receipts (חשבונית מס / קבלה), allocation numbers | **Morning (formerly Green Invoice / חשבונית ירוקה), iCount, EZcount, Rivhit, Invoice4U** | APIs issue a Hebrew PDF invoice per charge; some integrate with the processors above |
| Stripe | Historically **not available to Israel-incorporated merchants**. Many startups use a US entity (Stripe Atlas). Verify the current status | Stripe Billing is the easiest to build on, but a US entity complicates Israeli VAT invoices |
| Merchant of record (Paddle, Lemon Squeezy) | Handles global tax; Israeli VAT invoicing to Israeli SMBs may not meet local expectations | Fine for international expansion later |

### 7.7 AI-generated content: copyright, disclosure, deepfakes

- **Training data and fair use:** Israel's **Ministry of Justice** (Office of Legal Counsel and Legislative Affairs) published a **legal opinion in December 2022**. It concluded that using copyrighted works to **train ML models** is generally **permitted under fair use** (Copyright Act 2007, s.19), with exceptions, for example where outputs substitute for specific works or training targets a specific author's style for competing outputs.
- **Ownership of AI outputs:** Israeli copyright protects **original works by human authors**. Purely AI-generated content may not be protected; **human creative input** (script editing, selection, arrangement) strengthens claims. I know of no definitive Israeli ruling as of 2026.
  - **ToS:** customers own the outputs **to the extent the law allows**. You grant a license to anything you own (templates, hooks). Make no IP guarantee for AI outputs. Pass through provider terms (OpenRouter and model vendors' commercial-use terms). [S] notes a competitor reportedly *retains* output ownership; say clearly that **customers own their outputs** (02-ph-ads.md).
- **Music:** use only properly licensed tracks (royalty-free libraries with commercial social-media licenses, or AI music with commercial rights). Israeli collecting societies (ACUM, הפדרציה, EMI/תל"י) enforce rights on public performance; social platforms mute unlicensed music.
- **AI labeling:**
  - Israel has **no general statutory duty** to label AI-generated ads. The government's AI policy (MoJ plus the Innovation Ministry, **"עקרונות מדיניות, רגולציה ואתיקה בתחום הבינה המלאכותית", Dec 2023**) favors sector-based soft regulation. Israel also signed the **Council of Europe Framework Convention on AI (Sept 2024)**.
  - However: **Meta, TikTok and YouTube require labeling of realistic AI-generated or altered content** and apply "AI info" labels automatically through C2PA metadata.
  - The **EU AI Act Article 50** transparency duties (deepfake disclosure, machine-readable marking) apply from **Aug 2, 2026**, if you serve EU users. Check any "Digital Omnibus" postponements.
  - FARO emphasizes platform labeling rules [S](https://faro.co.il/).
  - **Build:** an optional "נוצר באמצעות AI" corner tag, C2PA/metadata preservation, and an export checklist.
- **Fake testimonials:** AI avatars presented as real customers ("לקוחה מרוצה") are misleading advertising (§7.3). Templates should label AI presenters as such or use the owner's consented likeness.
- **Elections and deepfakes:**
  - Election propaganda in Israel is governed by the **Elections (Propaganda Methods) Law, 1959**, which requires identifying the publisher on propaganda.
  - The **Central Elections Committee** has acted against **AI deepfakes** of candidates and requires disclosure. [verified: the Committee issued **"כללי הבחירות (דרכי תעמולה) (קיום חובת הגילוי לגבי תעמולת בחירות שהיא זיוף עמוק), התשפ"ו-2026"**, signed by chair Justice Noam Sohlberg: AI-made or substantially digitally edited propaganda must carry either a written notice or a prescribed symbol (the symbol option does not cover audio), https://www.gov.il/BlobFolder/news/dover_5/he/%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%20%D7%9C%D7%92%D7%91%D7%99%20%D7%A1%D7%99%D7%9E%D7%95%D7%9F%20%D7%AA%D7%A2%D7%9E%D7%95%D7%9C%D7%AA%20%D7%91%D7%97%D7%99%D7%A8%D7%95%D7%AA%20%D7%A9%D7%A0%D7%95%D7%A6%D7%A8%D7%94%20%D7%91%D7%91%D7%99%D7%A0%D7%94%20%D7%9E%D7%9C%D7%90%D7%9B%D7%95%D7%AA%D7%99%D7%AA.pdf ; https://www.gadgety.co.il/?p=366336 . The chair has ordered removal of at least one AI video of a minister during the 2026 campaign (Mako/Globes reports). Exact effective date not confirmed.]
  - **Knesset elections were legally due around Oct 27, 2026.** [verified: the Knesset dissolved on **July 17, 2026** and the election is set for **Oct 27, 2026** (the latest legal date), https://blogs.loc.gov/law/2026/10/falqs-israels-upcoming-election-on-october-27-2026/ ; https://www.britannica.com/event/2026-Israeli-Elections . As of 2026-10-13 that is **two weeks away**, so any launch in this window should block political templates and real-politician likeness or voice outright.]
  - **Recommendation:** block generating real politicians' likeness or voice, and gate the "פוליטיקה" niche behind identity verification, or drop it at launch.

### 7.8 Likeness, voice cloning, avatars: consent

- **Privacy Protection Law s.2(6)** treats *"use of a person's name, appellation, picture or voice for profit"* without consent as a privacy infringement. Israeli courts also recognize a **right of publicity**-type protection for celebrities (through unjust enrichment and case law).
- **Voice and face data used for cloning** are likely **biometric "sensitive data"** under Amendment 13 (§7.2).
- **Build requirements:**
  1. Only the **person themselves** (or their verified authorized representative) can create a voice clone or avatar. Require a **recorded verbal consent statement** in Hebrew (e.g. "אני, [שם], מאשר/ת ל[מוצר] ליצור קול דיגיטלי שלי לשימוש העסק [שם]") plus an ID or selfie match where feasible.
  2. A separate consent checkbox with a timestamp, revocable at any time; deletion cascades to providers.
  3. **Block celebrities and public figures** (name lists plus face-similarity checks if available) and minors.
  4. For **employee or staff likeness** in business videos, provide a downloadable **model-release form in Hebrew** (טופס הסכמה לשימוש בדמות/קול).
  5. For **customer footage** (testimonials, weddings, kids' camps), require written consent. **Minors need parental consent.**
  6. Watermark avatar videos internally and keep generation logs (who, when, what) to respond to complaints.

### 7.9 Sector advertising rules to encode as niche "compliance flags" (verify each)

| Sector | Rule source | Typical restriction to surface in the template |
|---|---|---|
| Physicians, aesthetic medicine | Ministry of Health; Physicians Ordinance and its advertising regulations | Limits on testimonials, unproven claims and promises; before/after possibly restricted; must show the practitioner's license number |
| Dentists | Dentists Ordinance and its advertising rules | Similar to physicians |
| Lawyers | **כללי לשכת עורכי הדין (פרסומת), התשס"א-2000** | Dignified, no promises of results, restrictions on comparative or superlative claims and on testimonials |
| Psychologists, therapists | Psychologists Law and professional ethics | Avoid testimonials and outcome guarantees |
| Real estate brokers | Real Estate Brokers Law, 1996 | Licensing; possibly the broker's name and license in ads |
| Insurance, pension, investment | Capital Market Authority / ISA | Required disclaimers; no guaranteed returns |
| Alcohol | Alcohol harm-prevention and advertising restrictions | No targeting minors; warnings; time and medium restrictions |
| Giveaways (הגרלות) | Penal Law (lotteries / games of chance) | Frame as a skill contest; publish rules (תקנון) |
| Children's products and services | Consumer Protection rules on ads aimed at minors; privacy | Parental consent for minors' images |
| Food | Kashrut fraud law (חוק איסור הונאה בכשרות) | Don't claim "כשר" without valid certification |
| Elections | Elections (Propaganda Methods) Law | Publisher identification; no deepfakes of candidates |

### 7.10 Compliance checklist for the build spec (inference; feed into the website mega-prompt)

1. `lang="he" dir="rtl"`; WCAG 2.2 AA; a Hebrew accessibility statement page; captions on every marketing video; an accessible player.
2. Hebrew legal pages: תנאי שימוש, מדיניות פרטיות (Amendment 13 notice elements), מדיניות ביטול והחזרים, הצהרת נגישות, מדיניות שימוש הוגן ב-AI, and a voice and likeness consent policy.
3. A self-serve **"ביטול מנוי"** button that stops billing within 3 business days or less, with a confirmation email. A trial-ending reminder 7 days in advance.
4. Prices in ₪ **including 18% VAT**; automatic Hebrew tax invoice or receipt per charge; allocation-number support for B2B invoices of ₪5,000 or more.
5. A separate unchecked marketing-consent checkbox; "פרסומת" prefix; one-click unsubscribe; a consent log table.
6. Biometric consent flow for voice clones and avatars; a celebrity and minors block; deletion endpoints.
7. Supabase: RLS everywhere, region choice documented, audit logs, a retention policy, and an incident-response runbook (notification to the Privacy Protection Authority).
8. An "AI-generated" label option; C2PA/metadata preservation; no fake-testimonial templates.
9. Per-niche compliance flags shown in the editor (§7.9).
10. Quiet-day and Shabbat publishing guards in any scheduler.

---

## 8. Israel-specific product implications (inference)

1. **Niche-first onboarding in Hebrew:** "מה העסק שלך?" → niche → goal (תדמית / רילס / מבצע / המלצה / גיוס עובדים) → paste a website or Instagram link, or fill details manually → audience gender and register → voice → output set (9:16, 1:1 and 16:9, plus 3–5 hook variants).
2. **A public Hebrew hooks library** per niche and season, SEO-indexed, with a "צור סרטון מההוק הזה" button. Validated as a product category globally; open in Hebrew [S] 02-ph-ads.md.
3. **A WhatsApp-native CTA end card** and a "send to my WhatsApp" export. A WhatsApp Status-optimized format (≤60 s, 9:16).
4. **An Israeli content calendar** with holiday hooks two weeks ahead, plus memorial-day and Shabbat guards.
5. **Multilingual Israel:** Hebrew plus **Arabic** and **Russian** VO and captions as a paid add-on.
6. **Agency workspace** for social media managers (§2.3), with client approval links ("שלח ללקוח לאישור").
7. **A pronunciation dictionary and a "תקן הגייה" UI**, plus gender and register controls (§6).
8. **Trust:** ₪ pricing including VAT, a Hebrew tax invoice, Bit, a visible cancellation button, a "you own your videos" statement, and real before/after case studies quoting ₪ savings ("חסכתם ₪X על עורך וידאו").

---

## 9. Naming ideas suited to Israel (brainstorm; availability of domains, .co.il, Instagram and trademarks **not checked**)

Avoid the "Cadabra" collision problem (at least six other Cadabra products) [S] 01-cadabra.md. The name should be easy to say in Hebrew and English, short, and available as .co.il and .com.

| Name | Hebrew | Rationale |
|---|---|---|
| **Klip / קליפ** | קליפ | Universal, video-native; probably taken in some form (check) |
| **Reelit / רילית** | רילית | "Reel" plus a Hebrew feminine ending; playful |
| **Tadmit / תדמית AI** | תדמית | Exactly the category keyword (SEO), but generic |
| **Hook.co.il / הוקי** | הוקי | Ties to the hooks library |
| **Sratoni / סרטוני** | סרטוני | "My videos"; very Hebrew |
| **Bamai / במאי** | במאי | "Director": "הבמאי שלך ב-AI" |
| **Sheket Tsilum / שקט, מצלמים!** | שקט מצלמים | Iconic Hebrew film-set phrase; memorable campaign line |
| **Takeit / טייקית** | טייקית | "Take" (film take) with a Hebrew ending |
| **Pitch / פיץ'** | פיץ' | Hebrew slang for a small, cute thing, plus "pitch" in English |
| **Roll / רול** | רול | "Rolling!"; short |
| **Yalla Video / יאללה וידאו** | יאללה | Distinctly Israeli energy |
| **Kalat / קלט** | קלט | "Input", "got it"; short and clever |

My shortlist (inference): **"במאי" (Bamai)**, **"רילית" (Reelit)**, **"יאללה רילס"**, **"שקט מצלמים"** (as a brand or tagline), and **"הוקי"** (for the hooks library sub-brand).

---

## 10. Open questions and verification list

1. DataReportal Digital 2026 Israel: exact users per platform; Bezeq internet report 2025 or 2026 for WhatsApp, TikTok and Instagram penetration.
2. Actual Israeli freelancer and agency prices: sample 20 quotes (Facebook groups such as "פרילנסרים בישראל", Instagram editors, Fiverr Hebrew sellers).
3. Cadabra: per-engine credit costs, signup credits, course price (see 01-cadabra.md §12).
4. "Web Leviosa AI videos": not researched (no search budget).
5. Legal: the current binding IS 5568 version; Amendment 13 DPO thresholds and the status of statutory damages; the s.13ד cancellation details; whether a promotional-period notice duty exists; Israel Invoices thresholds in force since Jun 2026; Stripe availability for Israeli entities; Privacy Protection Authority AI guidance status; Central Elections Committee AI rules and the actual 2026 Knesset election date. (2026-10-13: resolved or partly resolved: IS 5568 baseline = WCAG 2.0 AA with no official update found; Amendment 13 in force 14.8.2025 and DPO criteria per the draft opinion; s.13ד vs s.14ט split; Israel Invoices ₪10,000 → ₪5,000 on 1.6.2026; AI guidance still a draft of 28.4.2025; election on 27.10.2026; CEC deepfake disclosure rules 5786-2026. Still open: promotional-period notice duty, Stripe availability, WhatsApp under the spam law, final DPO opinion, statutory list of "sensitive data".)
6. Sector advertising rules for doctors, dentists, aesthetics, lawyers and brokers: get exact current texts.
7. Hebrew TTS bake-off: ElevenLabs v4 vs. Gemini 3.x Flash TTS vs. Azure he-IL vs. HeyGen, blind-tested by 5+ native speakers on 20 niche scripts (numbers, acronyms, brand names).
8. Hebrew-calendar dates in §5.3: confirm with hebcal.com.

---

## Sources

**Found by sibling agents in this workflow ([S]; snippet-level):**
- Cadabra: https://www.livinginmovie.com/ ; https://missfixtheuniverse.com/mf-project/17826/
- Israeli price anchors: https://www.extra.co.il/corporate-video-pricing-2026/ ; https://vivistudio.co.il/ ; https://smartpush.co.il/ ; https://www.magic-caricatures.com/ ; https://aviv-malka.com/video-editing-pricing-2026/ ; https://natigold.com/promotional-video/
- Israeli AI players: https://faro.co.il/ ; https://sparkiz.ai/ ; https://sparkiz.ai/he/custom-voices/ ; https://www.softwareadvice.com/product/557642-Sparkiz/ ; https://kossem.co.il/ ; https://www.nivra.co.il/ ; https://nitaimodel.com/ ; https://kolbo.ai/ ; https://kolbo.ai/changelog ; https://vivideo.ai/
- Israeli agencies and services: https://www.vdo.guru/he/ai/ ; https://2site.co.il/ ; https://mylogocraft.com/ai-videos ; https://videohead.co.il/ ; https://www.haisagee.co.il/ai-marketing-video/
- Government and education: https://www.sba.org.il/hb/MaofServices/courses/Pages/11619.aspx ; https://letsai.co.il/product/videoai-workshop/ ; https://danad.co.il/digitalworkshops/aivideo/
- Israeli video-tech: https://en.wikipedia.org/wiki/LTX_Studio ; https://omidsaffari.com/blog/ltx-studio-pricing ; https://finder.techleap.nl/news/note/wix-acquires-hour-one-boosting-its-generative-ai-ambitions ; https://en.wikipedia.org/wiki/Promo.com ; https://www.hunted.space/product/promo-com/launches/promoai
- Hebrew support and voice: https://www.heygen.com/en-gb/text-to-speech/hebrew ; https://help.creatify.ai/en/articles/9348010-supported-languages ; https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4 ; https://docs.cloud.google.com/text-to-speech/docs/gemini-tts ; https://openrouter.ai/elevenlabs/scribe-v2 ; https://openrouter.ai/heygen/avatar-iv ; https://www.atlascloud.ai/blog/tips/kling-3.0-review-features-pricing-ai-alternatives ; https://www.submagic.co/auto-subtitle-generator/hebrew-subtitles ; https://simplified.com/subtitle-generator/hebrew
- Hebrew UIs of global tools: https://www.capcut.com/he-il/tools/ai-video-generator ; https://www.veed.io/he-IL/tools/ai-video ; https://www.pippit.ai/he-il/tools/ai-movie-maker ; https://www.adobe.com/il_he/products/firefly/features/ai-video-generator.html ; https://www.poenta.co.il/article/freepik-ai-tools/
- Benchmarks: https://billo.app/ugc-platforms/ ; https://blog.buildfastwithai.com/what-is-google-pomelli-ai

**Model knowledge, to verify (unverified-MK). Official places to check:**
- Accessibility: Israeli Standards Institution (sii.org.il), IS 5568; Commission for Equal Rights of Persons with Disabilities (gov.il)
- Privacy: Privacy Protection Authority (gov.il), Amendment 13 and the Data Security Regulations 2017
- Consumer protection: Consumer Protection and Fair Trade Authority (gov.il); Consumer Protection Law 1981 (nevo.co.il)
- Spam: Communications Law s.30A (nevo.co.il)
- Tax: Israel Tax Authority (gov.il), VAT 18% and "חשבוניות ישראל"
- AI: Ministry of Justice legal opinion on ML and copyright (Dec 2022); AI policy principles (Dec 2023); Council of Europe AI Convention
- Social stats: DataReportal "Digital 2026: Israel"; Israel Internet Association; Bezeq internet report
- Calendar: hebcal.com

---

## Verification addendum (2026-10-13)

*Method: 38 WebSearch calls (Hebrew and English), snippet level only; WebFetch was blocked, so no page was opened in full. Many confirmations come from law-firm, consumer-guide or vendor pages rather than statute text, and that is flagged inline. This is still not legal advice.*

### Corrections (the earlier draft was wrong or incomplete)

| # | Earlier claim | Correction | Source |
|---|---|---|---|
| 1 | Accessibility small-business relief "under about ₪100,000" turnover | Kol Zchut describes an **automatic heavy-economic-burden exemption up to ₪1,000,000 annual turnover** (not for public authorities), plus technological-infeasibility and low-traffic exemptions, some of which need an application. No official source for ₪100,000 was found | https://www.kolzchut.org.il/he/פטור_מחובת_הנגשה_לאתרי_אינטרנט_ואפליקציות |
| 2 | Ongoing-transaction cancellation "through the same channel" under s.13ד | s.13ד lets the consumer cancel by phone, in person, registered mail, email or fax, and requires a business website to **publish** the cancellation methods. The **same-channel + dedicated prominent link** duty is **s.14ט**; a court upheld a fine against KSP for lacking that link | https://www.kolzchut.org.il/he/עסקה_מתמשכת ; https://www.bizportal.co.il/financialconsumerism/news/article/20042624 ; https://law.co.il/media/computer-law/ksp_express.pdf |
| 3 | Facebook ≈5–5.6M and Instagram ≈4–5M ad reach | NapoleonCat (Meta ad-tool data) counts **Facebook ≈8.13M (Jun 2026)** and **Instagram ≈5.88M (Aug 2026)**. The method differs from DataReportal, but the earlier ranges look low | https://stats.napoleoncat.com/facebook-users-in-israel/2026/06/ ; https://stats.napoleoncat.com/social-media-users-in-israel/ |
| 4 | "IS 5568 alignment with WCAG 2.1" implied as under way | No official 2025–2026 update was found. **IS 5568 Part 1 (2021) = WCAG 2.0 AA**, and Part 2 (digital documents) was published 28.9.2023. WCAG 2.1/2.2 claims on Israeli sites are voluntary. Build to 2.2 AA anyway | https://www.sii.org.il/he/lobby/standardization/standard-page?id=6751 ; https://www.wawsome.com/blog/israel-digital-accessibility-law-is-5568-guide |
| 5 | Elections "legally due around late Oct 2026, check status" | Now firm: **Knesset dissolved 17.7.2026; election 27.10.2026**. The CEC issued **deepfake-disclosure rules (5786-2026)** requiring a written notice or symbol on AI-made propaganda | https://blogs.loc.gov/law/2026/10/falqs-israels-upcoming-election-on-october-27-2026/ ; https://www.gadgety.co.il/?p=366336 |
| 6 | Kolbo pricing $24/$40/$79 | A third-party directory shows $19/$35/$69 (Lite/Standard/Professional). This is unresolved and may be an older price sheet | https://www.aitoolsspace.com/en/tools/kolbo |

### Newly verified

- **Accessibility:** Regulation 35 + IS 5568 at AA; statutory damages **up to ₪50,000 without proof of harm** (secondary sources); an accessibility statement and coordinator details are expected (court and settlement documents). https://www.wawsome.com/blog/israel-digital-accessibility-law-is-5568-guide ; https://www.law.co.il/news/2013/11/13/New-website-accessibility-regulations-enacted/
- **Privacy Amendment 13:** in force **14.8.2025**; first-ever administrative fines (up to millions of ₪, with mitigation for small businesses); expanded s.11 notice; new "מידע בעל רגישות מיוחדת" category; DPO for public bodies, data brokers, large-scale monitoring and large-scale sensitive data (draft DPO opinion, comments closed 23.9.2025); the Authority has already imposed a fine under the amendment. https://www.chamber.org.il/serviceslobby/legal/74023/164240/ ; https://alliott.co.il/wp-content/uploads/2025/08/תיקון-13-לחוק-הגנת-הפרטיות-מתי-חייבים-למנות-ממונה-פרטיות-ומה-המשמעות-לעסקים.pdf
- **PPA AI guidance:** a draft was published **28.4.2025**; it covers the full lifecycle and inferred data. No final version was found. https://www.shibolet.com/?p=20425
- **Consumer:** an ongoing transaction ends within **3 business days** (6 by registered mail); the distance-sale cancellation fee is capped at the **lower of 5% or ₪100**; 14 days; **4 months** for people with disabilities, 65+ and new immigrants when the deal involved a conversation, **including chat or email**. https://protocol.co.il/ongoing-transaction-cancellation/ ; https://protocol.co.il/cancellation-fee/ ; https://protocol.co.il/remote-selling-transaction-cancellation/
- **Spam s.30A:** up to **₪1,000 per message** without proof of harm; "פרסומת" label, sender details, simple opt-out. https://www.chamber.org.il/serviceslobby/legal/74023/115485/
- **Tax:** VAT **18%** (since 1.1.2025, still in 2026); Israel Invoices **₪10,000 from 1.1.2026 → ₪5,000 from 1.6.2026, pre-VAT**; עוסק פטור ceiling **₪122,833 for 2026** (single source); detailed periodic VAT reports for turnover above ₪500k from 2026 (lead). https://www.gov.il/he/service/request-assignment-number-for-tax-invoice ; https://www.efraty.com/?p=4246
- **Social:** DataReportal *Digital 2026 Israel*: **7.01M social identities (73.4%, Oct 2025), internet 91.3%**; Feb 2025 ad-reach ranking YouTube > Facebook > Instagram ≳ TikTok; TikTok ≈44% of population and 64.9% of adults. https://datareportal.com/reports/digital-2026-israel ; https://www.statista.com/statistics/1495494/israel-potential-ad-reach-social-media-platform ; https://statista.com/statistics/1379484/tiktok-potential-advertising-reach-in-israel
- **Prices:** Midrag gives a 2–3 minute business promo **from ₪3,000–₪4,000** and promo shoot hours at **₪956–₪1,489/hour** (both undated). https://www.midrag.co.il/Content/Tip/11772 ; https://www.midrag.co.il/pages/Agora/Content/SectorPriceList/96
- **Competitors:** Sparkiz trial $3 (35 credits), **Starter $49/mo** (~$42 annual, 127 credits ≈ 5 videos), EN/HE/RU. https://www.getapp.com/all-software/a/sparkiz/ . Fiverr Go exists as an AI personal assistant, initially for vetted freelancers. https://help.fiverr.com/hc/en-us/articles/32545695445393

### Still unverified after this pass

- **Kossem, Nivra, NitAi, FARO:** independent searches found no trace (Hebrew or English). They rest only on the sibling agents' [S] snippets of their own sites, including FARO's ₪490/₪1,290/₪2,990 prices and Kossem's ₪139/₪229.
- **Israeli freelance reel-editing and social-media-manager ₪ prices (§2.2–2.3):** no published price lists surfaced in three searches. Keep them as estimates and sample real quotes.
- **WhatsApp under spam law s.30A;** the statutory "sensitive data" list (biometric/voice); the final DPO opinion; the promotional-period notice duty; Stripe for Israeli entities; Fiverr Go's 2025 launch date; per-platform DataReportal 2026 numbers (YouTube, LinkedIn, WhatsApp); the accessibility 60-day notice-and-cure claim; the effective date of the CEC deepfake rules.
- Everything else not tagged [verified]/[corrected] (sector advertising rules, copyright opinion of Dec 2022, Hebrew-calendar dates, Israeli video-tech company facts) was **not** re-checked.
- Lead surfaced incidentally, not pinned to a URL: D-ID reportedly agreed to acquire the German firm Simpleshow (~$60M). Verify before use.
