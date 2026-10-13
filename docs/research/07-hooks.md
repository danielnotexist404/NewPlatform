# 07 — Hooks: research and a Hebrew seed HOOKS library

Research date: 2026-10-13. Part A covers the research (English with Hebrew terms). Part B is the creative deliverable, written in native Hebrew.

## How to read this file (important limitation)

**This agent could not run a single web search.** All 4 searches I sent in parallel came back with "web search budget used up". The cap is 200 searches per turn, shared by every agent in the workflow, and sibling agents had already used it. WebFetch, curl and wget are blocked by network policy. So:

| Label | Meaning | Trust level |
|---|---|---|
| **[S]** | Sourced **in this same research run** by sibling files `02-ph-ads.md` and `03-ph-brand.md`, from search-result summaries. The URL is given inline. | Medium–high. These come from search summaries, not from fetched pages. |
| **[PK]** | **Prior knowledge** (training data up to about mid-2026), **not re-verified in this run**. Treat it as **(unverified)**. Where I give a URL, it is the canonical location as I remember it, and I did not re-check it. | Low–medium. Verify before you publish numbers. |
| **[D]** | A design recommendation or synthesis by me. It makes no external factual claim. | n/a |

Every number in Part A marked [PK] needs a follow-up search before it appears in marketing copy. **§A12** lists the exact searches to run when budget is available.

---

## Executive summary

1. **Hooks are a proven standalone product category, and every library found is English and TikTok/e-commerce-centric.** Examples:
   - Hooked.so: 752+ hooks in 24 categories, from $29/mo or $89 one-time (2026) [S] (https://www.hooked.so/hooks)
   - ContentHooks: search by niche, built from videos with 1M+ views [S] (https://www.contenthooks.ai/hook-library)
   - Socialync: hooks ranked by tested retention [S] (https://www.socialync.io/viral-hooks-library)
   - Zeely: 130+ "hook formats" by industry [S] (https://zeely.ai/automated-ad-creation/)

   No Hebrew, Israel-specific or local-service-niche library was found [S, 02-ph-ads.md]. That gap is the opportunity.
2. **The "3-second rule" is real at the metric level, but some of its famous statistics are old.**
   - Meta counts a "video play" at 3 seconds [PK]. TikTok reports 2-second and 6-second views [verified: https://ads.tiktok.com/help/article/video-play].
   - The most-cited data is dated. Facebook (with Nielsen, Feb 2016) said **up to** 47% of a video campaign's value is delivered in the first 3 s and **up to** 74% in the first 10 s. Some summaries describe these as shares of ad-recall / awareness lift rather than generic "value" [corrected: https://about.fb.com/es/news/2016/02/capta-la-atencion-con-nuevas-funcionalidades-para-anuncios-de-video/ , https://salesforce.com/content/blogs/us/en/2016/02/facebook-video-ads-global.html]. TikTok's own auction-ads creative tips say **more than 63%** of the highest-CTR videos highlight the key message or product in the first 3 s. TikTok gives no date or method for this [verified: https://ads.tiktok.com/business/en-US/blog/9-creative-tips-to-drive-auction-ad-performance].
   - Use these as directional, not current.
3. **A hook has three layers, and the best openings stack all three in second 0–1** [D/PK]:
   - **visual** (motion or a pattern break in frame 1)
   - **text** (5–8 words of on-screen Hebrew)
   - **verbal** (the first sentence of the voiceover)

   The platform should generate all three per hook. That is why every hook in Part B carries a "first 3 seconds visual" direction.
4. **Default structure for SMB promo videos: Hook → Problem → Solution → Proof → CTA** (HPSPC). It maps onto AIDA and PAS. It also matches the 0–2 s / 2–8 s / 8–14 s pattern a sibling file found in Hera's storyboard guidance [S] (https://hera.video/blog/ai-motion-graphics-for-product-hunt-launch).
5. **Lengths:**
   - Reels and YouTube Shorts both allow up to 3 minutes now [PK].
   - TikTok's own ad guidance is 21–34 s for In-Feed ads [PK].
   - For Israeli SMBs: 7–15 s for awareness and retargeting, 20–35 s for leads, 45–90 s for a "סרטון תדמית" on the website or YouTube [D].
6. **Hebrew is a technical moat.** Render all Hebrew text and captions deterministically (Remotion/FFmpeg), never inside the AI video model [S, 01-cadabra.md, 04-openrouter.md]. Keep text inside platform safe zones. For Meta Reels that is roughly the top 14%, bottom 35% and 6% on each side [PK].
7. **Israeli local-business CTAs should be WhatsApp-first:**
   - Click-to-WhatsApp
   - "כתבו 'מחיר' בתגובות" (comment-to-DM automation)
   - "שלחו 3 תמונות"
   - Waze navigation
   - "שמרו / שלחו למי שצריך" for awareness

   Instagram has said sends (shares) per reach is a top ranking signal [PK].
8. **Paid-ads policy risk.** Meta's "personal attributes" policy rejects ads that assert or imply health or financial status ("סובלים מחרדה?", "יש לכם חובות?") [PK]. Before/after content for weight loss and medical treatments is restricted on Meta and TikTok and by Israeli professional rules [PK]. Each hook therefore carries a compliance flag where relevant (§A11).
9. **The UX to copy** is a faceted library: niche × hook type × platform × goal × gender × season. Each hook card has "העתק / צור סרטון מההוק / 5 וריאציות". SEO pages go at `/hooks/[niche]` and, only where content is thick enough, `/hooks/[niche]/[type]`. This guards against Google's March 2024 "scaled content abuse" policy [PK].
10. **Part B delivers:**
    - 27 hook types (JSON-ready)
    - 220 Hebrew hooks across 22 Israeli niches, each tagged
    - 10 seasonal hooks
    - 10 universal templates with `{placeholders}`
    - 3 full 30-second scripts, plus one JSON storyboard in the schema from `04-openrouter.md`

---

# PART A — RESEARCH

## A1. Why hooks work: the psychology behind each hook family

| Mechanism | What the hook does | Root (academic / classic) | Source |
|---|---|---|---|
| **Information gap / curiosity** | Opens a gap between what viewers know and want to know, so they keep watching to close it | Loewenstein, "The Psychology of Curiosity" (1994), *Psychological Bulletin* 116(1) | [PK] https://doi.org/10.1037/0033-2909.116.1.75 |
| **Open loops (Zeigarnik effect)** | Unfinished tasks or stories are remembered and pull attention ("ומספר 3 – אף אחד לא בודק") | Zeigarnik (1927) | [PK] (classic; no URL) |
| **Negativity bias / loss aversion** | Warnings and mistakes ("הטעות שעולה 120 אלף") weigh more than gains | Baumeister et al., "Bad Is Stronger Than Good" (2001); Kahneman & Tversky, Prospect Theory (1979) | [PK] https://doi.org/10.1037/1089-2680.5.4.323 ; https://doi.org/10.2307/1914185 |
| **Orienting response / pattern interrupt** | Sudden motion, sound or an incongruent image triggers automatic attention and stops the scroll | Sokolov's orienting reflex (1960s); used in NLP and advertising practice | [PK] |
| **Self-relevance (call-out)** | Hearing your own label ("עצמאים", "אם אתם ב{עיר}") cuts through noise, as with the cocktail-party effect | Cherry (1953), *JASA* 25(5) | [PK] https://doi.org/10.1121/1.1907229 |
| **Social proof** | "400 מנות בשבוע", reviews, "4.8 בגוגל" reduce risk | Cialdini, *Influence* (1984) | [PK] |
| **Specificity and numbers** | "3 דברים", "9 ימים", "₪38,000" signal concrete value and a predictable time cost | Practitioner consensus in copywriting | [PK] |
| **Identity / relatable POV** | The viewer sees themselves in the scene ("POV: הקבלן אמר שבועיים") and shares it to say "זה אני" | Practitioner; aligns with Instagram's focus on sends | [PK] |

**Hook-writing frameworks from practitioners** [PK, unverified]:
- Alex Hormozi's *$100M Leads* (2023) groups openers into call-outs/labels, questions (yes/no and open), conditionals ("אם... אז..."), commands, statements, exclamations, lists and narratives.
- The "hook → retain → reward" loop is widely used in YouTube creator education.
- Exact attributions are unverified.

---

## A2. The 3-second rule: what the platforms measure, and the data

### What each platform counts in the first seconds

| Platform | Early-attention metric | Later-attention metric | Notes | Source |
|---|---|---|---|---|
| **Meta (Facebook / Instagram ads)** | **3-second video plays** | **ThruPlay** = 15 s watched, or the whole video if shorter; average watch time; video plays at 25/50/75/95/100% | Practitioners derive **Hook rate** (thumb-stop ratio) = 3-s plays ÷ impressions and **Hold rate** = ThruPlays (or 15-s views) ÷ 3-s plays | ThruPlay definition (played to completion or for at least 15 s, whichever comes first; for videos of 15 s or less, the viewer must reach the end) [verified-snippet, third-party: https://www.jonloomer.com/?p=36498 , https://www.tryvizup.com/blog/meta-ads-video-views-objective-2026]. One source claims 97% of length counts as completion for short videos; this is unconfirmed. 3-second play and the percentile metrics remain [PK]. |
| **TikTok ads** | **2-second video views**: plays of **at least 2 s within one impression session; replays excluded** (swiping away and back counts as a new impression) | **6-second video views**: plays of **at least 6 s, OR a full play if the video is shorter than 6 s, OR at least one engagement in the first 6 s** (the "focused view" definition); average play time; 25/50/75/100% | TikTok also shows second-by-second retention for top ads in Creative Center [PK] | [verified: https://ads.tiktok.com/help/article/video-play] (definitions); Creative Center [PK] https://ads.tiktok.com/business/creativecenter/ |
| **YouTube Shorts** | **"Viewed vs. swiped away"** (YouTube Studio) | Average view duration / % viewed; "engaged views" | Since **31 Mar 2025**, Shorts "views" count every start or replay with no minimum watch time. The older, stricter count lives on as **"engaged views"** and is used for YPP eligibility and Shorts revenue sharing. The API switched to the new view definition on 30 Apr 2025 | [verified-snippet, third-party creator guides: https://www.creatoressentials.com/glossary/shorts-engaged-views/ , https://1of10.com/blog/youtube-shorts-analytics/]. "Viewed vs. swiped away" is confirmed as a Shorts analytics percentage [verified-snippet: https://www.shortimize.com/blog/youtube-shorts-retention-rate]. YouTube Help was not seen directly. |
| **Instagram Reels (organic)** | Watch time and "skip rate" (Instagram added skip-rate insights to Reels in 2025) | Likes per reach, **sends per reach**, saves | Adam Mosseri (Jan 2025) named watch time, likes per reach and sends per reach as the top signals | [PK] (unverified) |

### Data points about the opening seconds (dated; the 47%/74% and 63% rows were verified 2026-10-13, the rest remain [PK])

| Claim | Year / scope | Caveat | Source |
|---|---|---|---|
| People recall mobile-feed content after **0.25 s** of exposure | Facebook IQ, 2016 | Pre-Reels feed study | [PK] https://www.facebook.com/business/news/insights/capturing-attention-feed-video-creative |
| **Up to 47%** of a video campaign's value is delivered in the first **3 s** and **up to 74%** in the first **10 s** | Facebook + Nielsen, **Feb 2016** | Old and feed-based, but still widely cited. Wording varies: Salesforce's 2016 summary frames it as ad-recall / brand-awareness lift. A related Facebook stat says 65% of people who watch the first 3 s watch at least 10 s, and 45% watch 30 s [verified-snippet: https://www.marketingdive.com/news/facebook-offers-tips-for-converting-tv-ads-to-mobile/448510/] | [corrected/verified: https://about.fb.com/es/news/2016/02/capta-la-atencion-con-nuevas-funcionalidades-para-anuncios-de-video/ , https://salesforce.com/content/blogs/us/en/2016/02/facebook-video-ads-global.html] |
| **More than 63%** of the highest-CTR TikTok videos highlight the key message or product in the first **3 s** | TikTok for Business, "9 creative tips to drive auction ad performance" (also a PDF, "Auction Ads Creative Tips"). **Year not stated** (the "about 2021" is unverified) | TikTok-reported, with no method or sample. Some secondary sites misquote it as "63% of all successful ads" | [verified: https://ads.tiktok.com/business/en-US/blog/9-creative-tips-to-drive-auction-ad-performance , https://ads.tiktok.com/business/library/Auction_Ads_Creative_Tips.pdf] |
| **88%** of TikTok users say sound is essential to the TikTok experience | TikTok / Kantar, 2021 | Self-reported survey | [PK] |
| **69%** watch video with sound **off** in public; viewers are **80%** more likely to finish a video when captions are available | Verizon Media + Publicis Media, US, 2019 | Old; US only | [PK] |
| The "8-second goldfish attention span" | Microsoft Canada, 2015 | **A myth.** BBC and others traced it to an unsourced figure. Do not use it. | [PK] https://www.bbc.com/news/health-38896790 |

### Practitioner benchmarks (unverified, for internal targets only)

| Metric | Commonly quoted target | Notes |
|---|---|---|
| Hook rate (Meta) | about **25–35%**, with 30%+ called "good" | Varies widely by placement, niche and audience temperature [PK] |
| Hold rate | No reliable universal benchmark found | Compare against your own baseline [D] |
| YouTube Shorts "viewed" share | about 70%+ is often called strong; under 30% suggests a weak hook | Third-party creator guides only. YouTube publishes no official benchmark [verified-snippet: https://www.shortimize.com/blog/youtube-shorts-retention-rate] |

**[D] Product implication:** store `hook_rate` and `hold_rate` per generated variant (once users connect Meta/TikTok), and rank library hooks by real Israeli performance, not by these generic benchmarks. That becomes a data moat.

---

## A3. Visual, text and verbal hooks (plus audio)

| Layer | What it is | Rules that tend to work [D/PK] | How our platform generates it [D] |
|---|---|---|---|
| **Visual hook** | Frame 1 to second 1.5: motion, an unexpected object, an extreme close-up, a before/after split, a "result first" shot, a satisfying process | Movement in frame 1 (no static logo intro); a face or hands in the shot; strong contrast; no fade-in from black; start mid-action | `image_prompt_en` + `motion_prompt_en` for scene 1, built from the hook's "visual direction" field |
| **Text hook** | On-screen Hebrew headline shown **from frame 0** | 5–8 words, at most 2 lines, a large bold font, high contrast (stroke or box), in the safe zone; it may differ slightly from the VO wording | Deterministic Remotion layer (not baked into AI video) |
| **Verbal hook** | The first VO sentence | Under 2.5 s spoken; it starts with the payload ("אל תחתמו...", not "היי, אני..."); no greeting or name first | TTS (Hebrew voice) with a pronunciation dictionary |
| **Audio hook** | SFX or a beat drop at 0.0–0.3 s (sizzle, a slam, a record scratch) or a trending sound | Sync the cut to the beat; avoid a silent first second | Music library + SFX layer in the render |

**"Stacked hook" principle** [D/PK practitioner]: the viewer should get the same idea three ways in the first second. For example:
- They **see** a ₪120,000 figure smash on screen.
- They **read** "הטעות של 120 אלף ₪".
- They **hear** "רוב המוכרים עושים את הטעות הזאת בשבוע הראשון".

**Visual-only hooks** (satisfying, ASMR, time-lapse, transformations) work sound-off and across languages. They suit Facebook feed and beauty, barbering and cleaning niches. Vmake ("Earth Zoom, Angel Wings" effects) and the "Hook" iOS app sell libraries of exactly these [S] (https://vmake.ai/visual-hook, https://apps.apple.com/us/app/hook-viral-video-content/id6737547221).

---

## A4. Hook-type taxonomy (summary)

The full taxonomy (27 types with Hebrew names, descriptions and examples, JSON-ready) is in **Part B, §B1**. It covers every type the brief asked for:
- curiosity gap, pattern interrupt, negative/warning, "stop doing X", POV, before/after, question, bold claim, statistic, story, challenge, "3 things" listicle, demonstration, social proof, controversy

It adds types that recur in competitor tools:
- myth-busting, call-out, insider secret, price reveal, comparison, behind-the-scenes, day-in-the-life, how-to, satisfying visual, urgency/offer, result-first, mistakes list

Competitors that tag hook styles:
- Mirage Ad Studio: question / stat / problem-solution [S] (https://help.mirage.app/docs/project/ad-studio)
- Higgsfield: "stunt" vs "subtle" hook picklists [S] (https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-marketing-studio/SKILL.md)
- Hooked.so: 24 categories [S]

**[D] Recommendation:** tag each hook with **one primary type** plus an optional secondary type, and add an orthogonal **tone** tag (רציני / הומור / רגשי / סמכותי / "stunt" vs "subtle").

---

## A5. Video structures

### Frameworks

| Framework | Steps | Best for | Notes |
|---|---|---|---|
| **HPSPC** (our default) | Hook → Problem → Solution → Proof → CTA | 15–45 s promo/lead videos for service SMBs | A practical merge of AIDA and PAS [D] |
| **AIDA** | Attention → Interest → Desire → Action | Product and offer ads | A classic, attributed to E. St. Elmo Lewis (about 1898) [PK] |
| **PAS** | Problem → Agitate → Solution | Pain-driven services (lawyers, insurance, renovations) | Classic direct response [PK] |
| **BAB** | Before → After → Bridge | Transformations (aesthetics, fitness, design, renovations) | Classic copywriting [PK] |
| **ABCD** (Google/YouTube) | Attract, Brand, Connect, Direct | YouTube and Shorts ads | Google cites Kantar research showing ads that follow ABCD lift short-term sales likelihood (about +30%) [PK] https://www.thinkwithgoogle.com/ (exact page not re-checked) |
| **Hook → Retain → Reward** | Open strong, keep re-hooking every 3–5 s, pay off the promise | Organic educational Reels/TikToks | Creator-education framework [PK] |
| **Result-first** | Show the end result, then rewind ("ככה הגענו לזה") | Before/after niches | [D] |

### Timed templates the generator should use [D]

| Length | Structure (seconds) |
|---|---|
| **7–8 s** (bumper / retarget) | 0–2 hook (visual+text) · 2–6 single proof/result · 6–8 CTA + logo |
| **15 s** | 0–3 hook · 3–6 problem · 6–11 solution/demo · 11–13 proof · 13–15 CTA |
| **30 s** (default) | 0–3 hook · 3–7 problem/agitate · 7–19 solution (2–3 beats) · 19–25 proof (review, number, face) · 25–30 CTA |
| **45–60 s** | 0–3 hook · 3–10 problem · 10–35 solution as 3 points, each with a mini re-hook · 35–50 proof · 50–60 CTA |
| **60–90 s "סרטון תדמית"** (website / YouTube / Facebook) | 0–5 emotional opener (founder line or result) · 5–20 who we are and why · 20–50 process / what's included · 50–75 testimonials / numbers · 75–90 brand promise + CTA |

A sibling file found the same pattern in Hera's launch-video storyboard: 0–2 s category + benefit, 2–8 s use case, 8–14 s proof cards [S] (https://hera.video/blog/ai-motion-graphics-for-product-hunt-launch).

**Re-hooks** [D]: in anything longer than 20 s, insert a pattern change every 3–5 s (cut, zoom, new text line, SFX). A mid-video "וזה החלק החשוב" line works as an open-loop refresh.

---

## A6. Ideal lengths per platform and per goal

### Platform limits and guidance

| Platform | Max upload (organic) | Ad guidance | Organic SMB sweet spot [D] | Source |
|---|---|---|---|---|
| **Instagram Reels** | **3 min** (since Jan 2025) | Meta has long advised short, mobile-first video, with 15 s or less often recommended for feed/Stories ads | 7–30 s | [PK] Mosseri announcement, Jan 2025 (URL not re-checked) |
| **Facebook** | Long video allowed; Meta said in 2025 that videos uploaded to Facebook would be shown as Reels | Same as Meta above | 15–45 s; older Israeli audiences tolerate 60 s+ for trust content [D] | [PK] (unverified) |
| **TikTok** | Up to 10 min recorded in-app; longer uploads have been tested | **21–34 s** recommended for In-Feed ads | 9–35 s | [PK] TikTok Ads best practices (URL not re-checked) |
| **YouTube Shorts** | **3 min** (since 15 Oct 2024) | ABCD for Shorts ads | 15–45 s | [PK] YouTube blog (URL not re-checked) |
| **Website / YouTube long-form "תדמית"** | n/a | n/a | 60–120 s | [D] |

### By goal [D]

| Goal | Length | Hook families that fit | CTA style |
|---|---|---|---|
| **awareness** | 7–20 s | pattern_interrupt, pov, satisfying_visual, challenge, controversy | Soft: "שמרו", "שלחו למי שצריך", "עקבו" |
| **leads** | 20–40 s | callout, negative_warning, mistakes, price_reveal, question | Medium: WhatsApp, "כתבו X בתגובות", lead form |
| **sales** | 10–30 s | result_first, before_after, demonstration, urgency_offer, social_proof | Hard: "הזמינו עכשיו", a coupon, a limited offer |
| **trust** | 30–90 s | story, insider_secret, myth_busting, behind_the_scenes, day_in_life | Soft→medium: "קבעו שיחת היכרות" |

---

## A7. On-screen text best practices, with Hebrew/RTL specifics

**General** [D/PK]:
1. Show the text hook **from frame 0**. Never open on a logo.
2. 5–8 words per line, at most 2 lines, one idea per screen. Every text card stays on screen at least about 1.2 s.
3. Burn in captions (karaoke-style, word by word, highlighting the active word). Many viewers watch muted (see the 2019 data in §A2, which is old).
4. Contrast: white text with a 4–6 px dark stroke, or a solid brand-color box behind the text.
5. **Safe zones** (1080×1920):
   - Meta Reels ads: keep about **14% at the top, 35% at the bottom and 6% on each side** clear of key text and logos [PK, Meta Business Help Center, URL not re-checked].
   - TikTok: avoid the right-hand icon column and the bottom caption area [PK].
   - **[D] Rule:** keep the hook text between about 15% and 55% of the frame height, centered.
6. Numbers beat words: "₪38,000", "9 ימים", "3 טעויות".
7. Put the logo in the CTA frame only, plus an optional small watermark after second 3.

**Hebrew-specific** [D]:
- **Fonts:** Heebo, Assistant, Rubik and Noto Sans Hebrew for body and captions; Secular One, Karantina or Fredoka (Hebrew) for display. Avoid thin weights on video.
- **Bidi:**
  - Mixed Hebrew + numbers + ₪ + English brand names breaks order.
  - Wrap Latin/number runs in Unicode isolates (FSI U+2068 … PDI U+2069), or render each run as a separate `<span dir="ltr">` with `unicode-bidi: isolate`.
  - Pick one shekel convention ("120 ₪" or "₪120") and lock it in the brand kit.
- **Never let the AI video/image model draw Hebrew.** Models garble it. Generate textless footage and overlay the text in Remotion [S, 01-cadabra.md §10.6; 04-openrouter.md].
- **TTS:** keep a per-workspace pronunciation dictionary (brand names, slang, stress), with optional niqqud only for ambiguous words.
- **Gender:** default to plural ("אתם/תבדקו"). Offer automatic male/female variants of both the **speaker** ("אני בודק/בודקת") and the **audience**.
- **Register:** native Israeli marketing tone is short, direct and slightly informal ("ברצינות", "בלי אותיות קטנות", "נשבע לכם" only for casual brands). Avoid translated-sounding constructions such as "האם ידעת ש..." and "אתה לא תאמין...".

---

## A8. CTA patterns for Israeli local businesses

| CTA | Hebrew wording examples | Best for | Tech / notes |
|---|---|---|---|
| **WhatsApp** | "שלחו וואטסאפ – עונים תוך דקות", "שלחו 3 תמונות ותקבלו הצעת מחיר" | Almost every service SMB in Israel | Meta Click-to-WhatsApp ads; a wa.me deep link with prefilled text. WhatsApp is the dominant messaging app in Israel [PK, unverified figure] |
| **Comment keyword → auto-DM** | "כתבו 'מחיר' בתגובות ונשלח לכם בפרטי" | Leads, lead magnets, price lists | Instagram/Messenger automation via Meta partners such as ManyChat [PK] https://manychat.com |
| **Link in bio / booking** | "לינק לתורים בביו", "קבעו תור אונליין" | Barbers, beauty, clinics, fitness | Booking tools; UTM per video [D] |
| **Call** | "חייגו עכשיו" | Urgent services (locksmiths, vets, lawyers) | Call ads / click-to-call |
| **Navigate** | "נווטו אלינו בוויז" | Restaurants, shops, zimmers | Waze link / Google Maps |
| **Lead form** | "השאירו פרטים לבדיקה ללא עלות" | Insurance, mortgage, renovation, B2B | Meta Instant Forms [PK] |
| **Save / Send** (soft) | "שמרו את הסרטון לפני שתחתמו", "שלחו למי שמחפש דירה" | Awareness/education | Feeds the sends/saves signals [PK] |
| **Offer with deadline** | "עד יום חמישי בלבד", "נשארו 4 מקומות" | Sales, seasonal | Must be true: misleading-ad rules (חוק הגנת הצרכן) [PK] |

**[D] Platform feature:** a CTA picker per goal that auto-builds the end card, the WhatsApp prefill text ("היי, ראיתי את הסרטון על {שירות}...") and UTM tags.

---

## A9. Hook libraries, swipe files and ad-intelligence tools: how they organize hooks

### Hook libraries and hook generators

| Tool | What it is | How it is organized / filtered | Size | Price (date) | Source |
|---|---|---|---|---|---|
| **Hooked** (hooked.so) | Hooks database + course + AI UGC studio | By **category** (24) | 752+ TikTok hooks (a 2026 roundup independently says "more than 750 hooks catalogued and growing" [verified-snippet: https://programminginsider.com/12-tools-libraries-behind-todays-most-popular-hooks/]) | from $29/mo or $89 one-time (2026) [S; price not re-confirmed] | [S] https://www.hooked.so/hooks |
| **ContentHooks** | Hooks pulled from videos with 1M+ views | **Search by niche/topic**; top 20 results free with no login (an SEO/lead-gen pattern) | n/a | Free tier | [S] https://www.contenthooks.ai/hook-library (a 2026-10-13 re-search found no independent mention; still sourced only from 02-ph-ads.md) |
| **Hookest** (new, found 2026-10-13) | Viral hook library for short-form video, backed by performance data, with an API | Filter by about 14 categories (cars, fashion, food, travel…) | n/a | API: Builder $29/mo (1,000 credits), Growth $99 (5,000), Scale $299 (25,000); launched on Product Hunt Sep 2026 (single review source) | [verified-snippet: https://chatgate.ai/post/hookest , https://appsumo.com/products/hookest/] |
| **hookugc.com** | Hook library + AI generator | Library + 10 free AI generations/mo | 500+ | Free + paid | [S] https://hookugc.com/hook-library |
| **Socialync** | Viral hooks library | **Ranked by tested retention** | 64+ | Free | [S] https://www.socialync.io/viral-hooks-library |
| **MakeHooks** | Hook generator | 30 variations from **5 frameworks** | n/a | Free | [S] https://makehooks.com/ |
| **Vmake Visual Hook** | *Visual* effect hooks | By effect (Earth Zoom, Angel Wings…) | n/a | n/a | [S] https://vmake.ai/visual-hook |
| **Hook – Viral Video Content** (iOS) | Archive of trending visual hooks and transitions | By trend | n/a | $2.99/wk, $5.99/mo, $19.99/yr | [S] https://apps.apple.com/us/app/hook-viral-video-content/id6737547221 |
| **UGC Warehouse** | AI UGC hook *clips* | Clip catalog | 100+ | Paid | [S] https://ugcwarehouse.com |
| **ViralHooks.org** | Hook library + AI video | n/a | n/a | Free → $10+ (unverified) | [S] https://blog.wask.co/digital-marketing/viral-hooks-library/ |
| **HookLab** (several unrelated products) | hooklabapp.com: UGC brief + 15-s TikTok script; hooklabstudio.com: hook + caption generator with a saved-hooks library; GitHub `Elwyun/hooklab-ai`: 8 hook frameworks, remix/bookmark, CSV export | By framework | n/a | n/a | [S] https://github.com/Elwyun/hooklab-ai |
| **"Hookly"** | **Could not verify** a product by this exact name in this run | — | — | — | (unverified) |

### Hooks inside ad generators

| Tool | Hook feature | Source |
|---|---|---|
| **Zeely** | "130+ smart hook formats", 100+ industry templates, AIDA/PAS copy | [S] https://zeely.ai/automated-ad-creation/ |
| **Higgsfield Marketing Studio** | Hook picklist per preset (9 hooks: 4 "stunt", 5 "subtle", as of 2026-05-18) | [S] https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-marketing-studio/SKILL.md |
| **Mirage (Captions) Ad Studio** | Hook / one-liner / CTA remixes; styles: question, stat, problem/solution; $799/mo | [S] https://help.mirage.app/docs/project/ad-studio |
| **Creatify** | Script writer with 5–10 variants and platform-specific hooks; Inspiration library **by industry/style/platform**; AdClone copies an ad's *structure* | [S] https://creatify.ai/features/ad-clone |
| **Arcads** | Core loop: hook × actor matrix, testing about 4 hook variants per winner | [S, 03-ph-brand.md] https://eesel.ai/blog/arcads-ai-pricing |

### Swipe-file and ad-intelligence tools

| Tool | What it does / how users browse | Price | Source |
|---|---|---|---|
| **Foreplay** | Chrome extension saves ads (Meta Ad Library, TikTok, LinkedIn) into a **Swipe File** with boards and tags. **Discovery** is a searchable ad database filtered by niche, format, platform, language and run time. **Spyder** tracks competitor brands. **Briefs** turns saved ads into creative briefs. Auto-transcripts let you search hooks by text. | $49–59/mo; Workflow $149–175 [S] | price [S] https://admanage.ai/blog/foreplay-alternatives ; features [PK] https://www.foreplay.co |
| **Atria** | Ad library + analytics + AI generation | $129–159 Core; $269–329 Plus [S] | [S] https://www.gethookd.ai/learn/atria-ai-reviews-pricing-alternatives-is-this-facebook-ad-tool-legit/ |
| **GetHookd** | Budget swipe file | about $19/mo (unverified) [S] | [S] https://superscale.ai/learn/digital-ad-intelligence/ |
| **Quickads** | 30M+ ad library with performance scores and hook analysis ("steal winning hooks") | $99+/mo [S] | [S] https://www.quickads.ai/adslibrary |
| **Minea** | E-commerce ad spy for Meta, TikTok and Pinterest ads, plus influencer and product research. Filters by country, language, date, engagement, media type, CTA and store platform. | Not verified | [PK] https://www.minea.com |
| **Kalodata** | TikTok **Shop** analytics: products, shops, creators, **videos ranked by GMV**, livestreams. Filters by category, country and date. Useful to study hooks of top-selling TikTok Shop videos. Limited relevance to Israeli service SMBs. | Not verified | [PK] https://www.kalodata.com |
| **Meta Ad Library** (free) | Search by keyword or advertiser. Filters: country (Israel), ad category, active/inactive, platform (FB/IG/Messenger/Audience Network), media type, date range, language. **Practitioner heuristic:** ads running 30+ days are probably profitable winners. For non-EU countries like Israel, only basic data is shown (no spend or reach for commercial ads). | Free | [PK] https://www.facebook.com/ads/library/ |
| **TikTok Creative Center – Top Ads** (free) | Filters: region, industry, campaign objective, ad format, period (7/30/180 days); sort by reach, CTR or likes. The detail page shows **second-by-second engagement/retention** and labels script segments (hook, selling point, CTA). Also has Trend Discovery (sounds, hashtags) and a script generator. Whether Israel is a selectable region is unverified. | Free | [PK] https://ads.tiktok.com/business/creativecenter/ |
| **Google Ads Transparency Center** (free) | YouTube/Google ads by advertiser, region and format | Free | [PK] https://adstransparency.google.com/ |
| **Motion** | Creative analytics that report hook rate, hold rate and similar metrics per creative | Not verified | [PK] https://motionapp.com |

### Browsing dimensions across these tools, and whether we copy them [D]

| Dimension | Who uses it | Copy? |
|---|---|---|
| **Niche / industry** | ContentHooks, Zeely, Creatify, TikTok Top Ads (industry) | **Yes, as the primary axis** (SEO pages per niche) |
| **Hook category / framework** | Hooked (24 categories), MakeHooks (5), HookLab (8), Mirage (styles) | **Yes, as the secondary axis** (27 types) |
| **Platform** | Creatify, Foreplay, Meta/TikTok libraries | Yes (reels / tiktok / shorts / facebook, plus linkedin for B2B) |
| **Goal / objective** | TikTok Top Ads (objective), Zeely | Yes (awareness / leads / sales / trust) |
| **Performance rank** | Socialync (retention), Quickads (scores), TikTok (CTR) | Yes, later: rank by real Israeli hook rate from connected accounts |
| **Visual vs verbal** | Vmake / Hook iOS (visual only) vs text libraries | Yes, as a "modality" facet: talking head / b-roll / screen recording / UGC / satisfying |
| **Tone** | Higgsfield (stunt/subtle), Mirage (tones) | Yes |
| **Season / event** | Rare | **Yes, a differentiator:** Israeli holidays calendar |
| **Gender** | Nobody (English is mostly gender-neutral) | **Yes, a Hebrew-specific differentiator** |
| **Example video** | Hooked, UGC Warehouse, TikTok Top Ads | Yes: an AI-generated sample per hook (cheap draft model) |

---

## A10. UX blueprint for the public Hebrew hooks library [D]

### URL map and SEO page types

| URL | Page | H1 example | Index? |
|---|---|---|---|
| `/hooks` | Hub: search, facets, featured, hook of the day | "ספריית ההוקים בעברית: משפטי פתיחה לסרטונים שעוצרים גלילה" | Yes |
| `/hooks/[niche]` e.g. `/hooks/dentists` | Niche page: 50–200 hooks, an intro, 3 sample scripts, FAQ, related niches | "הוקים לסרטונים לרופאי שיניים – 120 משפטי פתיחה (2026)" | Yes (main SEO asset) |
| `/hooks/[niche]/[type]` e.g. `/hooks/real-estate/pov` | Niche × type | "הוקים מסוג POV לנדל״ן" | **Only if at least 8 unique hooks plus a unique intro**; otherwise noindex |
| `/hooks/types/[type]` | Type explainer + best examples across niches | "מה זה הוק POV ואיך כותבים אחד" | Yes |
| `/hooks/season/[event]` e.g. `/hooks/season/black-friday` | Seasonal | "הוקים לבלאק פריידיי 2026" | Yes; refresh yearly |
| `/hooks/platform/[platform]` | Platform | "הוקים לטיקטוק לעסקים" | Yes |
| `/hooks/h/[id]` | Single hook (share target) | — | Noindex, or canonical to the niche page unless it has an example video and an explanation |

**Slugs:** English slugs (stable, clean when shared) with Hebrew titles and H1s. Hebrew URLs can help Israeli SERP CTR but are percent-encoded when shared. Decide once and stay consistent.

**SEO hygiene:**
- Google's March 2024 spam policy on **scaled content abuse** targets mass-produced, low-value pages [PK] https://developers.google.com/search/blog/2024/03/core-update-spam-policies. Every indexed page needs unique, useful text, examples and a sample video, not just a list.
- FAQ rich results were limited to authoritative government and health sites in Aug 2023 [PK] https://developers.google.com/search/blog/2023/08/howto-faq-changes. Keep FAQs for users; don't expect rich results.
- Use `ItemList`, `BreadcrumbList`, and `VideoObject` for sample videos.

### Facets (filters) and sorting

**Facets:**
- נישה
- סוג הוק
- פלטפורמה
- מטרה
- מגדר (ניטרלי / פונה לנשים / פונה לגברים / דובר·ת)
- טון (רציני, הומור, רגשי, סמכותי)
- מודאליות (טוקינג-הד, בי-רול, הקלטת מסך, UGC, ויזואל ממכר)
- עונה/חג
- "בטוח לפרסום ממומן" (compliance-safe toggle)
- "יש סרטון לדוגמה"

**Sort:**
- פופולרי (copies + generations)
- חדש
- הכי הרבה סרטונים נוצרו
- hook rate (once telemetry exists)

### Hook card anatomy

```
┌──────────────────────────────────────────────┐
│ [סוג: POV]  [Reels·TikTok]  [לידים]  [ניטרלי] │
│                                              │
│  "POV: הקבלן אמר 'שבועיים'. זה היה לפני       │
│   4 חודשים"                                  │
│                                              │
│  3 שניות ראשונות: סלון מכוסה אבק, דפי לוח     │
│  שנה עפים                                     │
│  ▶ (תצוגת סרטון לדוגמה במעבר עכבר, מושתק)     │
│                                              │
│ [העתקה] [צרו סרטון מההוק ←] [5 וריאציות AI]   │
│ [שמירה] [שליחה בוואטסאפ]   נוצרו 312 סרטונים  │
└──────────────────────────────────────────────┘
```

- **Inline personalization:** typing the business name and city fills `{עיר}`, `{שם_העסק}` and similar fields live on every card (no login). This is a strong "aha" moment.
- **Gating:** copying is free; "צרו סרטון", "5 וריאציות" and "הורידו את כל 50 ההוקים" require signup or a WhatsApp opt-in.
- **Growth loops:**
  - Hook of the day (ISR, daily cron, see `05-stack.md`)
  - A weekly WhatsApp channel or newsletter "5 הוקים לשבוע"
  - User-submitted hooks with moderation
  - An embeddable widget for agencies
  - Every generated video shows "הוק מתוך ספריית {brand}" in the share page
- **Learning loop:** the card shows the type and why it works ("למה זה עובד: פער סקרנות + מספר ספציפי"). Users learn, and the brand gains authority.

### Minimal Supabase schema for the library

```sql
create table hook_types (
  slug text primary key,              -- 'curiosity_gap'
  name_he text not null, name_en text not null,
  description_he text not null, example_he text not null,
  sort int default 0
);
create table niches (
  slug text primary key,              -- 'dentists'
  name_he text not null, name_en text not null,
  seo_title_he text, intro_he text,   -- unique per page (anti thin-content)
  compliance_notes_he text
);
create table hooks (
  id uuid primary key default gen_random_uuid(),
  niche_slug text references niches(slug),          -- null = universal
  season_slug text,                                  -- 'black-friday', 'rosh-hashana' ...
  type_primary text not null references hook_types(slug),
  type_secondary text references hook_types(slug),
  text_he text not null,                             -- may contain {placeholders}
  placeholders text[] default '{}',
  platforms text[] not null check (platforms <@ array['reels','tiktok','shorts','facebook','linkedin']),
  goal text not null check (goal in ('awareness','leads','sales','trust')),
  gender text not null default 'neutral' check (gender in ('neutral','female','male','speaker_female','speaker_male')),
  tone text, modality text,
  visual_3s_he text not null,                        -- first-3-seconds visual direction
  compliance_flag text,                              -- 'before_after_medical','personal_attributes','results_claim','urgency_must_be_true',...
  status text not null default 'published',
  copies int default 0, generations int default 0,
  hook_rate numeric,                                 -- aggregated from connected ad accounts (later)
  created_at timestamptz default now()
);
create index on hooks (niche_slug, type_primary);
create index on hooks using gin (platforms);
alter table hooks enable row level security;
create policy "public read published" on hooks for select using (status = 'published');
```

---

## A11. Compliance flags for regulated niches and paid ads

All of the following is [PK] **(unverified)**. Have an Israeli lawyer confirm it before you build hard blocks.

| Area | Risk | What we know (unverified) | Product behavior [D] |
|---|---|---|---|
| **Meta "personal attributes" policy** (paid ads) | Ads that assert or imply the viewer's health, financial status, age and similar attributes get rejected ("סובלים מחרדה?", "יש לכם חובות?") | [PK] Meta Advertising Standards | Flag `personal_attributes`; auto-rewrite to third person for ads ("הרבה אנשים עם חרדה...") |
| **Before/after: weight loss and medical/aesthetic** | Meta and TikTok restrict before/after imagery for weight loss and health; Israeli medical advertising rules may restrict it further | [PK] | Flag `before_after_medical`; require a disclaimer; offer a "process" alternative |
| **Lawyers** | כללי לשכת עורכי הדין (פרסומת), התשס"א-2000 limit advertising style and content (e.g., promising results, superlatives, comparisons) | [PK] https://www.israelbar.org.il | Block "הכי טוב", "מבטיחים לנצח"; add "המידע כללי ואינו מהווה ייעוץ משפטי" |
| **Doctors, dentists, aesthetic clinics** | Israeli Ministry of Health advertising rules for medical professionals | [PK] | No pain-free or result guarantees; check before/after use |
| **Insurance, mortgage, finance** | Regulated by רשות שוק ההון, ביטוח וחיסכון (insurance agents); financial-advice disclaimers | [PK] | Auto-disclaimer: "אין באמור ייעוץ… סימולציה להמחשה" |
| **Therapists** | Professional ethics codes generally forbid client testimonials and outcome promises | [PK] | Disable "testimonial" types for this niche; add a crisis-line footer option (ער"ן 1201) |
| **All niches: numbers and urgency** | Misleading advertising is prohibited (חוק הגנת הצרכן); fake reviews are prohibited | [PK] | Hooks with numbers ask the user for *real* figures; "נשארו X מקומות" requires confirmation |

---

## A12. What could not be verified, and the next searches to run

Search budget was exhausted before this agent ran. When budget is available, run these to upgrade the [PK] items:
1. ~~`Facebook IQ 47% value first three seconds video campaign`~~ **Done 2026-10-13** (Facebook + Nielsen, Feb 2016; "up to" wording)
2. ~~`TikTok 63% highest CTR key message first 3 seconds`~~ **Done 2026-10-13** (TikTok auction-ads creative tips; year not stated)
3. `TikTok in-feed ads recommended length 21-34 seconds 2026`
4. `Meta Reels ads safe zone 14% top 35% bottom 2026`
5. `Instagram skip rate insights Reels 2025 Mosseri sends per reach`
6. ~~`YouTube Shorts view count change March 31 2025 engaged views`~~ **Done 2026-10-13** (third-party sources only; YouTube Help not seen)
7. `Facebook all videos become Reels 2025`
8. `Foreplay pricing 2026 Discovery Spyder features`, `Minea pricing 2026`, `Kalodata pricing 2026 countries`
9. `TikTok Creative Center Top Ads Israel region`
10. `"Hookly" hooks app` (identity)
11. `כללי לשכת עורכי הדין פרסומת 2026`, `משרד הבריאות פרסום לפני אחרי אסתטיקה`, `פרסום רופאי שיניים תקנות`
12. `hook rate benchmark 2026 Meta ads thumbstop ratio`


---

# PART B — CREATE: a Hebrew seed library (ספריית הוקים ראשונית)

## B0. Conventions (legend)

- **פלטפורמות:** `R` = Instagram Reels (`reels`), `T` = TikTok (`tiktok`), `S` = YouTube Shorts (`shorts`), `F` = Facebook feed/Reels (`facebook`). For B2B, also consider `linkedin`.
- **מטרה (goal):** `awareness` / `leads` / `sales` / `trust`.
- **hook_type:** the slug from the taxonomy in §B1. When two slugs appear (`a+b`), the first is the **primary** type and the second is secondary.
- **מגדר:**
  - `—` = ניטרלי / רבים (the default)
  - `נ׳` = פונה לנשים או מתאר אישה
  - `ז׳` = פונה לגברים או מתאר גבר
  - `דוברת`/`דובר` = only the speaker's grammatical gender is fixed
  - The generator should offer an automatic switch for each of these.
- **3 שניות ראשונות:** what we see on screen in the first 3 seconds. It feeds `image_prompt_en` / `motion_prompt_en` for scene 1. Hebrew text is **always** an overlay, never part of the AI image.
- **Numbers inside hooks** (₪, days, percentages) are **illustrative**. The generator must swap in the business's real numbers or switch to a non-numeric version (see §A11).
- **[compliance]** = check before using as a paid ad (§A11).

---

## B1. Hook taxonomy (27 types)

### Table

| # | slug | name_he | name_en | description_he | example |
|---|---|---|---|---|---|
| 1 | `curiosity_gap` | פער סקרנות | Curiosity gap | פותח פער בין מה שהצופה יודע למה שהוא רוצה לדעת. התשובה מגיעה רק בהמשך הסרטון | "הדבר הראשון שאני בודקת בדירה – וזה לא הקירות" |
| 2 | `pattern_interrupt` | שבירת דפוס | Pattern interrupt | פתיחה לא צפויה (ויזואלית או מילולית) שקוטעת את קצב הגלילה | "אל תבואו אלינו רעבים. ברצינות." |
| 3 | `negative_warning` | אזהרה / הוק שלילי | Negative / warning | נשען על הטיית השליליות ושנאת ההפסד: מה ישתבש אם לא תדעו את זה | "אל תלבינו שיניים לפני שאתם יודעים את זה" |
| 4 | `stop_doing` | "תפסיקו לעשות X" | Stop doing X | פקודה ישירה להפסיק הרגל נפוץ. מעוררת התנגדות וסקרנות | "תפסיקו לשמור קבלות בקופסת נעליים" |
| 5 | `mistakes` | X טעויות | Mistakes list | רשימה ממוספרת של טעויות נפוצות: שילוב של רשימה ואזהרה | "3 טעויות תאורה שהורסות כל דירה חדשה" |
| 6 | `listicle` | רשימה ממוספרת ("3 דברים") | Listicle | מספר קונקרטי שמבטיח ערך מוגדר וזמן צפייה צפוי | "3 תרגילים שמחליפים שעה בחדר כושר" |
| 7 | `pov` | POV / נקודת מבט | POV | מכניס את הצופה לסיטואציה מוכרת ומזדהה. חזק בטיקטוק וברילס | "POV: הקבלן אמר 'שבועיים'. זה היה לפני 4 חודשים" |
| 8 | `before_after` | לפני / אחרי | Before / after | חשיפה מיידית של טרנספורמציה ויזואלית | "אמבטיה משנות ה-80 → 10 ימי עבודה" |
| 9 | `result_first` | התוצאה קודם | Result first | פותחים בתוצאה המרשימה ואז מספרים איך הגענו אליה | "הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה" |
| 10 | `question` | שאלה | Question | שאלה שהצופה עונה עליה בראש ומרגיש שהיא עליו | "כל כמה זמן באמת צריך לקלח כלב?" |
| 11 | `callout` | פנייה לקהל | Call-out | מזהה במדויק את קהל היעד כדי שהאנשים הנכונים יעצרו | "עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך" |
| 12 | `bold_claim` | טענה נועזת | Bold claim | הצהרה חזקה ומפתיעה שהסרטון "מוכיח" בהמשך | "סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר" |
| 13 | `statistic` | נתון / מספר | Statistic | נתון מספרי חד שמייצר הקשר ואמינות. חייב להיות אמיתי | "הצוות שלכם מאבד 6 שעות בשבוע על דוחות" |
| 14 | `story` | סיפור | Story | פתיחה באמצע סיפור, עם דמות ומתח | "הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪" |
| 15 | `challenge` | אתגר | Challenge | מזמין את הצופה לנסות, לנחש או להתמודד. מייצר תגובות | "פלאנק 30 שניות. כתבו בתגובות כמה החזקתם" |
| 16 | `demonstration` | הדגמה | Demonstration | מראים את המוצר או השירות עובד בזמן אמת, בלי הסברים | "דמו של 30 שניות: מעלים קובץ, יוצא דוח" |
| 17 | `social_proof` | הוכחה חברתית | Social proof | לקוחות, ביקורות, מספרים ותגובות אמיתיות | "ביקורת אמיתית, בלי תסריט ובלי עריכה" |
| 18 | `controversy` | דעה לא פופולרית | Controversy / hot take | עמדה מקצועית שנויה במחלוקת שפותחת דיון | "דעה לא פופולרית: בית פתוח זה בזבוז זמן" |
| 19 | `myth_busting` | ניפוץ מיתוס | Myth busting | מציגים אמונה נפוצה ומפריכים אותה | "מיתוס: אם לא כואב – אין עששת" |
| 20 | `insider_secret` | סוד מקצועי | Insider secret | "מה שאנשי המקצוע לא מספרים": תחושה של גישה למידע פנימי | "קבלן מגלה: איפה 'חוסכים' בשיפוצים בלי שתשימו לב" |
| 21 | `price_reveal` | חשיפת מחיר | Price reveal | עונה על השאלה שכולם רוצים לשאול: כמה זה עולה | "כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח" |
| 22 | `comparison` | השוואה (X מול Y) | Comparison | שתי אפשרויות זו מול זו, לרוב במסך מפוצל | "שכירות או משכנתא? עשינו את החשבון" |
| 23 | `behind_the_scenes` | מאחורי הקלעים | Behind the scenes | חושפים את מה שקורה מאחורי הדלפק, במטבח או בסטודיו | "שישי בצהריים אצלנו: 280 סועדים, מטבח אחד" |
| 24 | `day_in_life` | יום בחיים | Day in the life | רצף מהיר של יום עבודה אמיתי: אנושי ומזדהה | "יום בחיים של סוכן ביטוח (זה לא רק טפסים)" |
| 25 | `how_to` | מדריך מהיר | How-to | מבטיחים ללמד משהו שימושי בזמן קצוב | "אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים" |
| 26 | `satisfying_visual` | ויזואל ממכר | Satisfying visual / ASMR | הוק ויזואלי טהור: תנועה, מרקם, טיים-לאפס. עובד גם בלי סאונד | "פייד מושלם ב-60 שניות" |
| 27 | `urgency_offer` | דחיפות / הצעה | Urgency / offer | הצעה מוגבלת בזמן או בכמות. רק כשהיא אמיתית | "נשארו 2 סופ"שים פנויים בחודש הבא" |

### JSON (seed for the `hook_types` table)

```json
[
  {"slug":"curiosity_gap","name_he":"פער סקרנות","name_en":"Curiosity gap","description_he":"פותח פער בין מה שהצופה יודע למה שהוא רוצה לדעת. התשובה מגיעה רק בהמשך הסרטון","example":"הדבר הראשון שאני בודקת בדירה – וזה לא הקירות"},
  {"slug":"pattern_interrupt","name_he":"שבירת דפוס","name_en":"Pattern interrupt","description_he":"פתיחה לא צפויה (ויזואלית או מילולית) שקוטעת את קצב הגלילה","example":"אל תבואו אלינו רעבים. ברצינות."},
  {"slug":"negative_warning","name_he":"אזהרה / הוק שלילי","name_en":"Negative / warning","description_he":"נשען על הטיית השליליות ושנאת ההפסד: מה ישתבש אם לא תדעו את זה","example":"אל תלבינו שיניים לפני שאתם יודעים את זה"},
  {"slug":"stop_doing","name_he":"תפסיקו לעשות X","name_en":"Stop doing X","description_he":"פקודה ישירה להפסיק הרגל נפוץ. מעוררת התנגדות וסקרנות","example":"תפסיקו לשמור קבלות בקופסת נעליים"},
  {"slug":"mistakes","name_he":"X טעויות","name_en":"Mistakes list","description_he":"רשימה ממוספרת של טעויות נפוצות: שילוב של רשימה ואזהרה","example":"3 טעויות תאורה שהורסות כל דירה חדשה"},
  {"slug":"listicle","name_he":"רשימה ממוספרת","name_en":"Listicle (3 things)","description_he":"מספר קונקרטי שמבטיח ערך מוגדר וזמן צפייה צפוי","example":"3 תרגילים שמחליפים שעה בחדר כושר"},
  {"slug":"pov","name_he":"POV / נקודת מבט","name_en":"POV","description_he":"מכניס את הצופה לסיטואציה מוכרת ומזדהה. חזק בטיקטוק וברילס","example":"POV: הקבלן אמר 'שבועיים'. זה היה לפני 4 חודשים"},
  {"slug":"before_after","name_he":"לפני / אחרי","name_en":"Before / after","description_he":"חשיפה מיידית של טרנספורמציה ויזואלית","example":"אמבטיה משנות ה-80 → 10 ימי עבודה"},
  {"slug":"result_first","name_he":"התוצאה קודם","name_en":"Result first","description_he":"פותחים בתוצאה המרשימה ואז מספרים איך הגענו אליה","example":"הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה"},
  {"slug":"question","name_he":"שאלה","name_en":"Question","description_he":"שאלה שהצופה עונה עליה בראש ומרגיש שהיא עליו","example":"כל כמה זמן באמת צריך לקלח כלב?"},
  {"slug":"callout","name_he":"פנייה לקהל","name_en":"Call-out","description_he":"מזהה במדויק את קהל היעד כדי שהאנשים הנכונים יעצרו","example":"עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך"},
  {"slug":"bold_claim","name_he":"טענה נועזת","name_en":"Bold claim","description_he":"הצהרה חזקה ומפתיעה שהסרטון מוכיח בהמשך","example":"סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר"},
  {"slug":"statistic","name_he":"נתון / מספר","name_en":"Statistic","description_he":"נתון מספרי חד שמייצר הקשר ואמינות. חייב להיות אמיתי","example":"הצוות שלכם מאבד 6 שעות בשבוע על דוחות"},
  {"slug":"story","name_he":"סיפור","name_en":"Story","description_he":"פתיחה באמצע סיפור, עם דמות ומתח","example":"הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪"},
  {"slug":"challenge","name_he":"אתגר","name_en":"Challenge","description_he":"מזמין את הצופה לנסות, לנחש או להתמודד. מייצר תגובות","example":"פלאנק 30 שניות. כתבו בתגובות כמה החזקתם"},
  {"slug":"demonstration","name_he":"הדגמה","name_en":"Demonstration","description_he":"מראים את המוצר או השירות עובד בזמן אמת, בלי הסברים","example":"דמו של 30 שניות: מעלים קובץ, יוצא דוח"},
  {"slug":"social_proof","name_he":"הוכחה חברתית","name_en":"Social proof","description_he":"לקוחות, ביקורות, מספרים ותגובות אמיתיות","example":"ביקורת אמיתית, בלי תסריט ובלי עריכה"},
  {"slug":"controversy","name_he":"דעה לא פופולרית","name_en":"Controversy / hot take","description_he":"עמדה מקצועית שנויה במחלוקת שפותחת דיון","example":"דעה לא פופולרית: בית פתוח זה בזבוז זמן"},
  {"slug":"myth_busting","name_he":"ניפוץ מיתוס","name_en":"Myth busting","description_he":"מציגים אמונה נפוצה ומפריכים אותה","example":"מיתוס: אם לא כואב – אין עששת"},
  {"slug":"insider_secret","name_he":"סוד מקצועי","name_en":"Insider secret","description_he":"מה שאנשי המקצוע לא מספרים: תחושה של גישה למידע פנימי","example":"קבלן מגלה: איפה 'חוסכים' בשיפוצים בלי שתשימו לב"},
  {"slug":"price_reveal","name_he":"חשיפת מחיר","name_en":"Price reveal","description_he":"עונה על השאלה שכולם רוצים לשאול: כמה זה עולה","example":"כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח"},
  {"slug":"comparison","name_he":"השוואה","name_en":"Comparison (X vs Y)","description_he":"שתי אפשרויות זו מול זו, לרוב במסך מפוצל","example":"שכירות או משכנתא? עשינו את החשבון"},
  {"slug":"behind_the_scenes","name_he":"מאחורי הקלעים","name_en":"Behind the scenes","description_he":"חושפים את מה שקורה מאחורי הדלפק, במטבח או בסטודיו","example":"שישי בצהריים אצלנו: 280 סועדים, מטבח אחד"},
  {"slug":"day_in_life","name_he":"יום בחיים","name_en":"Day in the life","description_he":"רצף מהיר של יום עבודה אמיתי: אנושי ומזדהה","example":"יום בחיים של סוכן ביטוח (זה לא רק טפסים)"},
  {"slug":"how_to","name_he":"מדריך מהיר","name_en":"How-to","description_he":"מבטיחים ללמד משהו שימושי בזמן קצוב","example":"אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים"},
  {"slug":"satisfying_visual","name_he":"ויזואל ממכר","name_en":"Satisfying visual / ASMR","description_he":"הוק ויזואלי טהור: תנועה, מרקם, טיים-לאפס. עובד גם בלי סאונד","example":"פייד מושלם ב-60 שניות"},
  {"slug":"urgency_offer","name_he":"דחיפות / הצעה","name_en":"Urgency / offer","description_he":"הצעה מוגבלת בזמן או בכמות. רק כשהיא אמיתית","example":"נשארו 2 סופ\"שים פנויים בחודש הבא"}
]
```


---

## B2. Hook library by niche (22 niches × 10 hooks)

> Columns: # · הוק · hook_type · פלטפורמות · מטרה · מגדר · 3 שניות ראשונות (מה רואים)

### 1. נדל"ן — `real-estate`
SEO: "הוקים לסרטוני נדל"ן: משפטי פתיחה למתווכים ויזמים (2026)". Compliance: prices are illustrative. Do not present an "asking price" as a "deal price".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | לפני שאתם חותמים על דירה – תבדקו את 3 הדברים האלה. על השלישי מתווכים פחות אוהבים לדבר | listicle+curiosity_gap | R,T,S | trust | — | יד עם עט קופאת מעל חוזה, 3 מספרים קופצים על המסך |
| 2 | הדירה הזאת נמכרה תוך 9 ימים. ככה עשינו את זה | result_first | R,F | leads | — | מדבקת "נמכר" נדבקת בזום מהיר על שלט "למכירה" |
| 3 | POV: סוף סוף מצאתם דירה עם מרפסת שמש – וגם חניה | pov | R,T | awareness | — | דלת נפתחת אל מרפסת מוארת, צילום יד שמתקדם פנימה |
| 4 | כמה באמת עולה דירת 4 חדרים ב{עיר} השנה? המספר לא מה שחשבתם | price_reveal | R,T,S,F | leads | — | מתווך·ת מחזיק·ה שלט עם מספר מטושטש, אצבע מתקרבת לחשוף |
| 5 | תפסיקו לתמחר את הדירה שלכם לפי מה שהשכן ביקש | stop_doing | F,R | leads | — | מחיר על שלט נמחק בקו אדום, המתווך·ת מניד·ה ראש למצלמה |
| 6 | הטעות של 120 אלף ₪ שהרבה מוכרים עושים כבר בשבוע הראשון | negative_warning | F,R | leads | — | "₪120,000" באדום מתנפץ על המסך, המתווך·ת מצביע·ה עליו |
| 7 | זה מה שקונים רואים ב-5 השניות הראשונות בדירה שלכם | curiosity_gap+pov | R,T | leads | — | מצלמת גוף נכנסת בדלת למסדרון עמוס נעליים ומעילים |
| 8 | למשקיעים: דירה קטנה במרכז או גדולה בפריפריה? | comparison+question | F,S | trust | — | מסך מפוצל: בניין לבן במרכז מול בית עם גינה |
| 9 | סיור של 30 שניות בפנטהאוז שעוד לא עלה לאתרים | behind_the_scenes+curiosity_gap | R,T,S | awareness | — | דלתות מעלית נפתחות ישר לסלון עם נוף, רחפן יוצא מהחלון |
| 10 | דעה לא פופולרית: בית פתוח זה בזבוז זמן. הנה מה שעובד במקום | controversy | R,T,F | trust | — | בית פתוח ריק עם בלונים, המתווך·ת נכנס·ת לפריים ומפוצץ·ת בלון |

### 2. מסעדות — `restaurants`
SEO: "הוקים לסרטונים למסעדות ובתי קפה". Compliance: ratings and "400 מנות בשבוע" must be real.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | אל תבואו אלינו רעבים. ברצינות. | pattern_interrupt | R,T | awareness | — | מגש ענק נטרק על שולחן עץ בהילוך איטי, אדים עולים |
| 2 | המנה הזאת יוצאת מהמטבח 400 פעם בשבוע. הנה למה | social_proof+curiosity_gap | R,T,S | sales | — | תקריב של רוטב שנשפך על המנה, רחש מהמחבת |
| 3 | POV: הזמנתם "רק משהו קטן" והשף החליט אחרת | pov | R,T | awareness | — | צילום מלמעלה, השולחן מתמלא במנות בטיים-לאפס |
| 4 | שישי בצהריים אצלנו: 280 סועדים, מטבח אחד | behind_the_scenes+statistic | R,T,S | awareness | — | להבה מתפרצת מהווק, פתקי הזמנות נפלטים מהמדפסת |
| 5 | 3 מנות שהצוות שלנו אוכל בכל משמרת (ואף אחד לא מזמין) | listicle+insider_secret | R,T | sales | — | ידיים של הצוות "חוטפות" מנה מהפס בפינת המטבח |
| 6 | הבצק הזה תופח 48 שעות לפני שהוא מגיע לשולחן | demonstration+satisfying_visual | R,T,S | trust | — | תקריב בצק נמתח, דלת התנור נפתחת עם ענן אדים |
| 7 | כמה עולה ארוחה זוגית מלאה אצלנו? נחשו בתגובות | price_reveal+challenge | R,T,F | sales | — | שתי כוסות יין מתנגשות, תווית מחיר מטושטשת בפינה |
| 8 | אם אתם ב{עיר} ומחפשים איפה לאכול הערב – שמרו את הסרטון | callout | R,T,F | awareness | — | שלט הניאון של המסעדה נדלק בלילה, קאטים מהירים |
| 9 | ניסינו להכין את השניצל הכי גדול ב{עיר}. זה מה שיצא | challenge | T,R,S | awareness | — | שניצל ענק נשלף מהשמן וגולש מעבר לצלחת |
| 10 | ביקורת אמיתית, בלי תסריט ובלי עריכה | social_proof | R,F | trust | — | סועד·ת באמצע ביס, מהנהן·ת עם פה מלא, כיתוב "בלי תסריט" |

### 3. קליניקות אסתטיקה — `aesthetic-clinics`
SEO: "הוקים לסרטונים לקליניקות אסתטיקה ורפואה אסתטית". Compliance: **[compliance]** before/after and injectables are regulated (§A11). Avoid any result guarantee.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | הטעות שגורמת לבוטוקס להיראות "עשוי" | negative_warning | R,T,F | trust | — | המטפל·ת מחזיק·ה מראה מול מטופלת, הפריים קופא |
| 2 | 3 שאלות שחובה לשאול לפני שמזריקים חומצה היאלורונית | listicle | R,F,S | trust | — | מגש סטרילי, יד בכפפה מרימה 3 אצבעות |
| 3 | תפסיקו לחפש "הכי זול" כשמדובר בפנים שלכם | stop_doing | R,F | trust | — | תווית "₪199" נקרעת לשניים מול המצלמה |
| 4 | מיתוס: טיפולי פנים זה רק לנשים | myth_busting | R,T | awareness | — | גבר שוכב על מיטת טיפולים, פוקח עין ומרים גבה למצלמה |
| 5 | מה באמת קורה לעור ב-24 השעות שאחרי פילינג | curiosity_gap+how_to | R,T,S | trust | — | מאקרו של מרקם עור, שעון 24:00 מתחיל לרוץ |
| 6 | POV: חזרתם מטיפול וכולם שואלים מאיזו חופשה חזרתם | pov | R,T | awareness | — | במשרד, עמית·ה מסתכל·ת פעמיים בהפתעה |
| 7 | טיפול אחד. בלי פילטר, באותה תאורה | before_after | R,F | leads | — | מסך מפוצל עם מחוון נגרר, אותה תאורה ואותה זווית **[compliance]** |
| 8 | שואלים אותי אם זה כואב. הנה התשובה הכנה | question | R,T,F | trust | — | המטפל·ת מוריד·ה כפפות ומתיישב·ת מול המצלמה |
| 9 | יום בקליניקה: 11 מטופלות, אפס תוצאות "מוגזמות" | day_in_life+statistic | R,T | awareness | נ׳ | טיים-לאפס של חדר טיפולים, הדלת נפתחת ונסגרת |
| 10 | הדבר הראשון שאני בודקת אצל כל מטופלת – וזה לא הקמטים | curiosity_gap+insider_secret | R,T,S | trust | נ׳ (דוברת+קהל) | מנורת זכוכית מגדלת נדלקת, תקריב על העיניים |

### 4. רופאי שיניים — `dentists`
SEO: "הוקים לסרטונים לרופאי שיניים ומרפאות שיניים". Compliance: **[compliance]** before/after and prices (§A11). Do not say "ללא כאב" as a guarantee.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | אל תלבינו שיניים לפני שאתם יודעים את זה | negative_warning | R,T,S | trust | — | ערכת הלבנה ביד, חותמת X אדומה נוחתת עליה |
| 2 | 3 סימנים שאתם צריכים טיפול שורש (השלישי מפתיע) | listicle+curiosity_gap | R,F,S | leads | — | הרופא·ה מחזיק·ה דגם שן ומרים·ה 3 אצבעות |
| 3 | מצחצחים מיד אחרי הקפה? יש לנו בעיה | question+pattern_interrupt | R,T | awareness | — | כוס קפה ליד מברשת שיניים, יד חוטפת את המברשת |
| 4 | פוחדים מרופא שיניים? ככה זה נראה מהכיסא אצלנו | callout+pov | R,F | leads | — | צילום POV מהכיסא: תקרה עם מסך שמקרין סדרה, תאורה רכה |
| 5 | ככה נראה חיוך אחרי 6 חודשים של יישור שקוף | before_after | R,T,F | leads | — | קשתית שקופה יוצאת לאט, חשיפת חיוך **[compliance]** |
| 6 | מיתוס: אם לא כואב – אין עששת | myth_busting | R,T,S | trust | — | צילום רנטגן על מסך, עיגול אדום מסמן נקודה |
| 7 | כמה באמת עולה שתל ב-2026? בלי אותיות קטנות | price_reveal | F,R,S | leads | — | הרופא·ה כותב·ת מספר על לוח ומסתיר·ה אותו ביד |
| 8 | הילד שלכם בוכה בדרך לרופא שיניים? תראו מה קרה פה | callout+story | F,R | trust | — | ילד צוחק על הכיסא מול בובת שן |
| 9 | רופא שיניים מגיב: הלבנה עם פחם מטיקטוק | controversy+myth_busting | T,R,S | awareness | ז׳ (ניתן להחליף ל"רופאת") | מסך ירוק: הרופא מול סרטון הטרנד, מרים גבה |
| 10 | אתם משתמשים בחוט דנטלי לא נכון. 20 שניות ומתקנים | how_to | R,T,S | awareness | — | דגם שיניים ענק, חוט נכנס בתנועה הנכונה |

### 5. עורכי דין — `lawyers`
SEO: "הוקים לסרטונים לעורכי דין ומשרדי עורכי דין". Compliance: **[compliance]** Bar advertising rules (§A11). No "הכי", no result promises; add "המידע כללי ואינו מהווה ייעוץ משפטי".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | פוטרתם? אל תחתמו על כלום לפני שאתם צופים בזה | negative_warning+callout | R,F,T | leads | — | מעטפה "מכתב פיטורים" על שולחן, יד מרחיקה את העט |
| 2 | חתמתם על חוזה שכירות? תבדקו את הסעיף הזה עכשיו | callout+curiosity_gap | R,F | trust | — | מרקר צהוב מסמן סעיף בחוזה, תקריב |
| 3 | מיתוס: צוואה זה רק לאנשים עשירים | myth_busting | F,R | trust | — | עורך·ת הדין קורע·ת דף שכתוב עליו "רק לעשירים" |
| 4 | השאלה שאני מקבל כל שבוע: מה קורה לדירה אחרי גירושים? | question | F,R,S | leads | דובר (ניתן "מקבלת") | הטלפון מציג הודעת וואטסאפ מטושטשת על השולחן |
| 5 | סיפור אמיתי (בשינוי פרטים): הודעת וואטסאפ אחת כמעט עלתה ללקוח 400 אלף ₪ | story | F,R | trust | — | בועת וואטסאפ מוגדלת על המסך, הפרטים מטושטשים |
| 6 | הסכם ממון מול "אנחנו סומכים אחד על השני" | comparison | R,T | awareness | — | שתי טבעות על שולחן מול מסמך חתום |
| 7 | כמה עולה עורך דין לעסקת דירה? הנה הטווח האמיתי | price_reveal | F,R,S | leads | — | מחשבון על שולחן משרד, עורך·ת הדין מקליד·ה |
| 8 | קיבלתם מכתב התראה? השעון כבר מתקתק. 3 צעדים ראשונים | negative_warning+how_to | F,R | leads | — | מעטפה עם חותמת אדומה, צליל תקתוק שעון |
| 9 | מה שלא מספרים לכם על הסכמי פשרה | insider_secret | R,F,S | trust | — | עורך·ת הדין סוגר·ת את דלת המשרד ומתקרב·ת למצלמה |
| 10 | POV: קניתם דירה על הנייר והקבלן מאחר בשנה | pov+callout | R,T,F | leads | — | אתר בנייה ריק עם עגורן עומד, דפי לוח שנה עפים |

### 6. רואי חשבון ויועצי מס — `accountants`
SEO: "הוקים לסרטונים לרואי חשבון ויועצי מס". Compliance: keep the information general. Tax rules change, so the generator must avoid citing specific thresholds unless the user supplies them.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | עצמאים? יש סיכוי טוב שאתם משלמים יותר מס ממה שצריך | callout+bold_claim | F,R | leads | — | ארנק פתוח, שטרות עפים ממנו בהילוך איטי |
| 2 | 5 הוצאות מוכרות שהרבה עצמאים שוכחים לדווח | listicle | F,R,S | leads | — | קבלות נופלות על שולחן, רואה החשבון תופס אחת באוויר |
| 3 | פתחתם עסק? ההחלטה הראשונה מול מס הכנסה יכולה לעלות אלפי שקלים | negative_warning+callout | F,R | leads | — | מפתח מסתובב במנעול של חנות חדשה, ואז טופס רשמי על השולחן |
| 4 | תפסיקו לשמור קבלות בקופסת נעליים | stop_doing | R,T | awareness | — | קופסת נעליים מתהפכת, קבלות מתפזרות, טלפון סורק אחת |
| 5 | קיבלתם מכתב ממס הכנסה? לנשום. הנה 3 צעדים | callout+how_to | F,R | leads | — | יד מחזיקה מעטפה רשמית שרועדת קלות |
| 6 | הטעות הכי יקרה שראיתי השנה (ולא, זה לא היה לקוח שלי) | story+negative_warning | F,R,S | trust | — | רואה החשבון מסובב·ת מסך למצלמה, מספר אדום גדול |
| 7 | שכירים: יכול להיות שמגיע לכם כסף בחזרה ואתם בכלל לא יודעים | callout+curiosity_gap | F,R,T | leads | — | המחאה מחליקה לאט לתוך הפריים |
| 8 | דוח שנתי ב-60 שניות: מה זה, ולמה זה חשוב לכם | how_to | R,S | awareness | — | שעון עצר מתחיל לרוץ, רואה החשבון ליד לוח לבן |
| 9 | יום לפני הדדליין של הדוחות אצלנו במשרד | behind_the_scenes+day_in_life | R,T | awareness | — | ערימות תיקים, כוסות קפה, מחוגי שעון במהירות כפולה |
| 10 | דעה לא פופולרית: אל תבחרו רואה חשבון לפי המחיר | controversy | F,R | trust | — | רואה החשבון מסתובב·ת בכיסא אל המצלמה |

### 7. מאמני כושר — `fitness-trainers`
SEO: "הוקים לסרטונים למאמני כושר ואימון אישי". Compliance: **[compliance]** weight-loss before/after is restricted in paid ads on Meta and TikTok (§A11). Add "התוצאות משתנות מאדם לאדם".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | רוצים בטן שטוחה? תפסיקו לעשות כפיפות בטן | stop_doing+controversy | R,T,S | awareness | — | מתאמן·ת עושה כפיפות בטן, המאמן·ת נכנס·ת לפריים עם יד "עצור" |
| 2 | 3 תרגילים שמחליפים שעה בחדר כושר | listicle+bold_claim | R,T,S | awareness | — | ברפי מהיר עם טיימר ענק על המסך |
| 3 | POV: השבוע הראשון שלכם באימון אישי | pov | R,T | leads | — | מתאמן·ת חושש·ת בכניסה לחדר הכושר, כיף מהמאמן·ת |
| 4 | ירדה 14 קילו בלי לוותר על הפיתה של שישי. ככה | result_first+social_proof | R,F | leads | נ׳ | מתאמנת מחזיקה ג'ינס ישן ורחב מול המראה **[compliance]** |
| 5 | פלאנק 30 שניות. כתבו בתגובות כמה החזקתם | challenge | T,R,S | awareness | — | פלאנק עם ספירה לאחור גדולה באמצע המסך |
| 6 | הטעות שהורסת לכם את הברכיים בסקוואט | negative_warning | R,T,S | trust | — | סקוואט מהצד, קו אדום מסמן ברכיים שבורחות קדימה |
| 7 | אין לכם זמן להתאמן? יש לכם 12 דקות? | question+callout | R,F | leads | — | טיימר מיקרוגל על 12:00, חיתוך לאימון בסלון |
| 8 | מיתוס: משקולות "מנפחות" נשים | myth_busting | R,T,S | awareness | — (הנושא ממוקד נשים) | מתאמנת מרימה דדליפט ומחייכת למצלמה |
| 9 | ככה נראית ארוחת בוקר של מאמן כושר (לא מה שחשבתם) | curiosity_gap+day_in_life | R,T | awareness | ז׳ (ניתן "מאמנת") | צלחת שקשוקה עם פיתה במקום חזה עוף, מבט מופתע |
| 10 | 90 יום: אותו אדם, אותה מראה, אותה תאורה | before_after | R,T,F | sales | — | סלפי מראה מפוצל עם מעבר ניגוב **[compliance]** |

### 8. יוגה ופילאטיס — `yoga-pilates`
SEO: "הוקים לסרטונים לסטודיו ליוגה ופילאטיס".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | גב תפוס מהמחשב? 4 תנועות שאפשר לעשות בלי לקום מהכיסא | callout+how_to | R,F,S | awareness | — | אדם ליד שולחן עבודה מסובב כתפיים, המצלמה מתקרבת |
| 2 | פילאטיס מכשירים או מזרן? רוב האנשים בוחרים לא נכון | comparison | R,F | leads | — | מסך מפוצל: רפורמר מול מזרן |
| 3 | POV: השיעור הראשון שלכם על רפורמר | pov | R,T | leads | — | כפות רגליים על הבר, הקרון מחליק לאט |
| 4 | תפסיקו לעצור את הנשימה בתרגיל הזה | stop_doing | R,T,S | trust | — | תקריב של פנים עם לחיים נפוחות, ואז נשיפה |
| 5 | ככה נראה הסטודיו ב-6:30 בבוקר | behind_the_scenes+satisfying_visual | R,T | awareness | — | אור זריחה דרך החלון על מזרנים שנפרשים |
| 6 | אמרו לי שיוגה זה "רק מתיחות". אז עשיתי את זה | challenge+pattern_interrupt | R,T,S | awareness | — | המדריך·ה עולה לעמידת ידיים מתוך ישיבה |
| 7 | 3 חודשים, פעמיים בשבוע. זה מה שהשתנה ביציבה | result_first+before_after | R,F | leads | — | צילום פרופיל, קו יציבה גרפי שמתיישר |
| 8 | בדיקה של 10 שניות: מגיעים לבהונות בלי לכופף ברכיים? | challenge | T,R,S | awareness | — | אדם מתכופף קדימה ולא מגיע, טיימר 10 שניות |
| 9 | התרגיל שכולם שונאים בשיעור – והכי צריכים | curiosity_gap | R,T | awareness | — | כל הכיתה נאנחת ביחד באמצע תרגיל |
| 10 | שיעור ניסיון עלינו. רק תבואו עם בגדים נוחים | urgency_offer | F,R | leads | — | יד הופכת שלט עץ "שיעור ניסיון" בכניסה לסטודיו |

### 9. ברברשופ ומספרות — `barbers-salons`
SEO: "הוקים לסרטונים לברברשופ ומספרות".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | ביקש "רק לסדר קצת". זה מה שיצא | before_after+story | R,T | awareness | ז׳ (לקוח) | הכיסא מסתובב לאט לחשיפה מול המראה |
| 2 | התספורת הזאת מתאימה רק ל-3 צורות פנים | listicle+curiosity_gap | R,T,S | trust | — | הספר·ית מחזיק·ה מראה, קווי מתאר של צורות פנים מופיעים |
| 3 | תפסיקו לחפוף כל יום. הספר שלכם מתחנן | stop_doing | R,T | awareness | — | יד לוקחת בקבוק שמפו מהמקלחת |
| 4 | פייד מושלם ב-60 שניות | satisfying_visual+demonstration | T,R,S | awareness | — | מכונת תספורת מצולמת מלמעלה בהאצה, שיער נופל |
| 5 | כמה צריכה לעלות תספורת טובה? ולמה לא 40 ₪ | price_reveal+controversy | R,T,F | sales | — | מטבעות על הדלפק, הספר·ית מניד·ה ראש |
| 6 | POV: הספר הקבוע שלכם בחופש ואתם אצל מישהו חדש | pov | T,R | awareness | — | לקוח בכיסא, העיניים מתרחבות במראה |
| 7 | 3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים | listicle+insider_secret | R,S | trust | ז׳ (ספר; ניתן "ספרית") | מספריים נעצרים באוויר ליד השיער |
| 8 | מה ששיער מתולתל צריך – ואף אחד לא אמר לכם | insider_secret+callout | R,T | sales | — | תקריב תלתלים, טיפת מוצר נלחצת על כף היד |
| 9 | תספורת לחתונה: מתי לקבוע תור? (רמז: לא יום לפני) | question+how_to | R,F | leads | — | חתן בחליפה על הכיסא, שעון על הקיר |
| 10 | שעה אחת של שישי בבוקר אצלנו במספרה | day_in_life+behind_the_scenes | R,T | awareness | — | טיים-לאפס של מספרה מלאה, מוזיקה קצבית |

### 10. ביוטי וציפורניים — `beauty-nails`
SEO: "הוקים לסרטונים לקוסמטיקאיות, ציפורניים וגבות". Most of this audience is female, so gender-fixed phrasing is marked.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | לק ג'ל שמחזיק 4 שבועות? הכל בהכנה | insider_secret+curiosity_gap | R,T | trust | — | מאקרו של שיוף והכנת הציפורן |
| 2 | תפסיקו לקלף את הג'ל לבד. ברצינות | stop_doing+negative_warning | R,T | trust | — | יד מקלפת ג'ל, X אדום קופץ |
| 3 | הלקוחה הביאה תמונה מפינטרסט. הצלחנו? | challenge+before_after | R,T,S | awareness | נ׳ | טלפון עם תמונת ההשראה מוחזק ליד יד מוכנה |
| 4 | צבע העונה – ומי כדאי שתוותר עליו | curiosity_gap | R,T | awareness | נ׳ | מניפת דוגמאות צבע נפתחת |
| 5 | בניית ציפורן מאפס. 30 שניות של רוגע | satisfying_visual | T,R,S | awareness | — | מאקרו של פיסול ג'ל בקצב איטי, סאונד ASMR |
| 6 | 3 סימנים שהמכשירים אצל המניקוריסטית לא עוקרו | listicle+negative_warning | R,F | trust | נ׳ (מניקוריסטית) | שקית עיקור אטומה נפתחת מול המצלמה |
| 7 | גבות אחרי מיקרובליידינג: יום 1 מול יום 30 | before_after+comparison | R,T,F | leads | — | מסך מפוצל של אותה גבה |
| 8 | כמה זמן באמת לוקחת בניית ציפורניים? שמנו טיימר | demonstration+statistic | R,T | awareness | — | יד לוחצת "התחל" על שעון עצר שעל השולחן |
| 9 | POV: יש לכם אירוע בעוד יומיים ואין תור בשום מקום | pov+urgency_offer | R,T,F | leads | — | גלילה בטלפון: "אין תורים פנויים", ואז משבצת פנויה מהבהבת |
| 10 | חזרה אחרי 3 שבועות. זה מה שנשאר מהלק | social_proof | R,F | trust | נ׳ | לקוחה מציגה את הציפורניים למצלמה באור יום |

### 11. קבלני שיפוצים — `renovation-contractors`
SEO: "הוקים לסרטונים לקבלני שיפוצים". Compliance: prices are illustrative; testimonials need written consent.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | המטבח הזה עלה 38 אלף ₪. נחשו מה החלפנו | price_reveal+curiosity_gap | R,F | leads | — | שוט רחב של מטבח חדש, ניגוב למטבח הישן |
| 2 | 3 דברים שאסור לחתום עליהם מול קבלן שיפוצים | listicle+negative_warning | F,R,S | trust | — | חוזה על השיש, יד עם עט מהססת |
| 3 | קבלן מגלה: איפה "חוסכים" בשיפוצים בלי שתשימו לב | insider_secret | F,R,T | trust | ז׳ (קבלן) | הקבלן דופק על קיר, צליל חלול, אריח נשלף |
| 4 | אמבטיה משנות ה-80 → 10 ימי עבודה | before_after | R,F,T | leads | — | פטיש מנפץ אריח ורוד, ענן אבק קופא בפריים |
| 5 | תפסיקו לבחור קבלן לפי ההצעה הכי זולה | stop_doing | F,R | trust | — | 3 הצעות מחיר על שולחן, הזולה מתקמטת |
| 6 | POV: הקבלן אמר "שבועיים". זה היה לפני 4 חודשים | pov | R,T,F | leads | — | סלון מכוסה אבק, דפי לוח שנה עפים |
| 7 | רטיבות בקיר? זה מה שבאמת מסתתר מאחוריו | curiosity_gap+demonstration | F,R,S | leads | — | מד לחות מצפצף על הקיר, ואז פתיחה של הטיח |
| 8 | דירת 4 חדרים, צביעה מלאה, יום עבודה אחד | satisfying_visual+demonstration | R,T,S | awareness | — | טיים-לאפס של רולרים ששוטפים קירות בצבע |
| 9 | כמה עולה שיפוץ ב-2026? מחירים אמיתיים מהשטח | price_reveal+statistic | F,R,S | leads | — | הקבלן·ית מחזיק·ה לוח כתיבה, המחירים מטושטשים |
| 10 | הלקוחות חזרו הביתה אחרי השיפוץ. תסתכלו על הפנים | social_proof+story | R,F | trust | — | דלת נפתחת, משפחה נעצרת בהלם |

### 12. עיצוב פנים — `interior-design`
SEO: "הוקים לסרטונים למעצבי ומעצבות פנים".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | סלון של 20 מטר שנראה כמו 35 – בלי להזיז קיר | bold_claim+result_first | R,T,F | leads | — | חשיפה בעדשה רחבה, דחיפה איטית פנימה |
| 2 | 3 טעויות תאורה שהורסות כל דירה חדשה | mistakes | R,T,S | trust | — | לחיצת מתג: אור לבן וקר מתחלף לאור חם |
| 3 | תפסיקו לקנות שטיח קטן מדי | stop_doing | R,T | awareness | — | שטיח קטנטן בחדר ענק, המעצב·ת גורר·ת פנימה שטיח גדול |
| 4 | POV: קיבלתם מפתח לדירה ריקה. מאיפה בכלל מתחילים? | pov+question | R,T,F | leads | — | דירה לבנה וריקה, הד של צעדים |
| 5 | אותו חדר, 3 תקציבים: 5, 15 ו-40 אלף ₪ | comparison+price_reveal | R,T,S,F | leads | — | מסך מחולק לשלושה עם שלוש הדמיות |
| 6 | הדבר הראשון שאני בודקת כשאני נכנסת לדירה – וזה לא הקירות | curiosity_gap+insider_secret | R,T | trust | דוברת (ניתן "בודק") | המעצבת מסיטה וילון ומסתכלת על כיוון האור |
| 7 | מטבח בדירה שכורה – בלי לשפץ ובלי לאבד את הפיקדון | before_after+how_to | R,T | awareness | — | יד מדביקה טפט נשלף על חזית ארון |
| 8 | הטרנד שהגיע הזמן להיפרד ממנו | controversy | R,T | awareness | — | המעצב·ת זורק·ת כרית מהספה אל מחוץ לפריים |
| 9 | הדמיה מול מציאות: יצא כמו שתכננו? | comparison+social_proof | R,F,S | trust | — | הדמיה תלת-ממדית מתמזגת לצילום אמיתי מאותה זווית |
| 10 | איך בוחרים צבע לקיר? פחות מ-30 שניות | how_to | R,S | awareness | — | דוגמאות צבע מודבקות בסלוטייפ על הקיר |

### 13. יועצי משכנתאות — `mortgage-advisors`
SEO: "הוקים לסרטונים ליועצי משכנתאות". Compliance: **[compliance]** add "אין באמור ייעוץ פיננסי / סימולציה להמחשה". Savings numbers must be real cases.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | אותה משכנתא, שני תמהילים – והפרש שיכול להגיע למאות אלפי שקלים | statistic+bold_claim | F,R,S | leads | — | שתי ערימות מטבעות זהות, אחת מתחילה לצמוח מהר |
| 2 | תפסיקו להגיע לבנק בלי הצעה מתחרה ביד | stop_doing | F,R | leads | — | זוג נכנס לסניף בידיים ריקות, היועץ·ת מגיש·ה להם תיקייה |
| 3 | 3 מסלולים שחובה להבין לפני שחותמים על משכנתא | listicle | F,R,S | trust | — | שלושה עמודים צבעוניים נבנים בגרפיקה |
| 4 | קיבלתם אישור עקרוני? מזל טוב. עכשיו מתחיל המשא ומתן | callout+pattern_interrupt | F,R,T | leads | — | קונפטי על מכתב האישור, ואז צליל "עצירת תקליט" |
| 5 | מיתוס: "אני לקוח של הבנק 20 שנה, יתנו לי את הריבית הכי טובה" | myth_busting | F,R | trust | — | כרטיס אשראי ישן על השולחן, היועץ·ת מניד·ה ראש |
| 6 | מחזור משכנתא: מתי זה משתלם ומתי זה סתם עמלות | comparison+how_to | F,R,S | leads | — | מאזניים מתנדנדים בין "חיסכון" ל"עמלות" |
| 7 | זוג מ{עיר} חסך {סכום} ₪ בפגישה אחת. ככה זה נראה | social_proof+story | F,R | leads | — | זוג ליד שולחן עושה "כיף", מסמכים פרושים **[compliance]** |
| 8 | 25 או 30 שנה? השאלה שהרבה עונים עליה לא נכון | question+curiosity_gap | F,R,T | awareness | — | שני לוחות שנה מתהפכים זה מול זה |
| 9 | מה שלא תמיד מספרים לכם בפגישה הראשונה בבנק | insider_secret | F,R,S | trust | — | פגישה בבנק, היועץ·ת לוחש·ת למצלמה מהצד |
| 10 | שכירות או משכנתא? עשינו את החשבון על דירה של 2 מיליון | comparison+statistic | F,R,S | awareness | — | מסך מפוצל: צרור מפתחות מול קבלה על שכר דירה |

### 14. סוכני ביטוח — `insurance-agents`
SEO: "הוקים לסרטונים לסוכני ביטוח". Compliance: **[compliance]** regulated by רשות שוק ההון (§A11). Hook 8 touches on financial vulnerability, so consider third-person phrasing for paid ads.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | יכול להיות שאתם משלמים פעמיים על אותו ביטוח בריאות | negative_warning+bold_claim | F,R | leads | — | שתי פוליסות זהות נערמות זו על זו |
| 2 | מתי בפעם האחרונה בדקתם מה יש לכם ב"הר הביטוח"? | question+callout | F,R | leads | — | טלפון עם חיפוש באתר, הסוכן·ת מצביע·ה על המסך |
| 3 | 3 שאלות לפני שעושים ביטוח חיים למשכנתא | listicle | F,R,S | trust | — | מפתחות בית מונחים על פוליסה מקופלת |
| 4 | סיפור אמיתי: תאונה, אשפוז – ופוליסה שלא כיסתה את מה שחשבו | story | F,R | trust | — | מסדרון בית חולים, דף פוליסה ביד |
| 5 | ביטוח רכב: "הכי זול" ו"הכי משתלם" זה לא אותו דבר | comparison | F,R,T | awareness | — | שני מפתחות רכב זה לצד זה |
| 6 | תפסיקו לחדש ביטוח אוטומטית בלי לבדוק | stop_doing | F,R | leads | — | מייל חידוש, אצבע מרחפת מעל "אישור" |
| 7 | נזילה מהשכן מלמעלה – מי משלם? | question+curiosity_gap | F,R,T | leads | — | טיפות מים נוטפות מהתקרה לתוך דלי |
| 8 | עצמאים: אם לא תעבדו חודש – מי משלם את החשבונות? | callout+negative_warning | F,R | leads | — | כיסא משרדי ריק, חשבונות נערמים על השולחן |
| 9 | יום בחיים של סוכן ביטוח (זה לא רק טפסים) | day_in_life | R,T | trust | ז׳ (ניתן "סוכנת") | הסוכן נוהג, ואז נכנס לבית של משפחה עם כוס קפה |
| 10 | בדקנו תיק ביטוחי של זוג צעיר ב-10 דקות. זה מה שמצאנו | demonstration+result_first | F,R,S | leads | — | גרפיקה של טבלה עם שורות שמסומנות באדום |

### 15. חנויות אונליין ואיקומרס — `ecommerce`
SEO: "הוקים לסרטונים לחנויות אונליין ומותגי איקומרס". Compliance: delivery and price claims must be true. Reviews must be real.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | נגמר לנו המלאי פעמיים החודש. הנה למה | social_proof+curiosity_gap | R,T,F | sales | — | מדף ריק, ואז ארגזים חדשים נפתחים |
| 2 | אל תקנו את זה אם אתם לא אוהבים מחמאות | pattern_interrupt | R,T | sales | — | חשיפת מוצר בהילוך איטי עם תאורה דרמטית |
| 3 | 3 סיבות שלקוחות מזמינים שוב (השנייה הפתיעה אותנו) | listicle+social_proof | R,F | trust | — | ביקורות קופצות על המסך אחת אחרי השנייה |
| 4 | אורזים איתכם הזמנה ל{עיר} | behind_the_scenes+satisfying_visual | T,R,S | awareness | — | צילום מלמעלה של אריזה: נייר טישו, מדבקה, סרט |
| 5 | מבחן קיצון: זרקנו אותו מקומה שנייה | demonstration+challenge | T,R,S | sales | — | נפילה בהילוך איטי, המוצר פוגע ברצפה |
| 6 | POV: הזמנתם בבוקר וזה כבר אצלכם בערב | pov | R,T,F | sales | — | פעמון בדלת, שליח מגיש חבילה **[compliance: רק אם נכון]** |
| 7 | בחנויות: 349 ₪. אצלנו? תגללו עד הסוף | price_reveal+curiosity_gap | R,T,F | sales | — | תווית מחיר בחנות נמחקת בקו |
| 8 | ביקורת אמיתית, לא ממומנת – ישר מהוואטסאפ | social_proof | R,F | trust | — | צילום מסך של שיחת וואטסאפ גולל, הפרטים מטושטשים |
| 9 | ככה זה נראה אחרי 100 כביסות | demonstration+comparison | R,T,S | trust | — | פריט חדש מול פריט משומש, זה לצד זה |
| 10 | עשינו טעות בייצור – והלקוחות דווקא התאהבו | story+pattern_interrupt | R,T | awareness | — | המייסד·ת מחזיק·ה פריט פגום ומחייך·ת |

### 16. סוחרי רכב — `car-dealers`
SEO: "הוקים לסרטונים לסוחרי רכב ומגרשי רכב".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | 40 אלף ק"מ על השעון – ותראו מה מצאנו כשהרמנו אותו | curiosity_gap+demonstration | R,F,S | trust | — | הרכב עולה על מגבה, פנס מאיר את החלק התחתון |
| 2 | 3 דברים לבדוק ברכב יד שנייה עוד לפני נסיעת המבחן | listicle | F,R,S | trust | — | יד בודקת עומק צמיג, מוט שמן נשלף |
| 3 | תפסיקו לבחור רכב לפי הצבע. ברצינות | stop_doing | R,T | awareness | — | שורת רכבים צבעוניים, איש·אשת המכירות טופח·ת על המצח |
| 4 | POV: יצאתם מהמגרש עם הרכב הראשון שלכם | pov | R,T | sales | — | ידיים על ההגה, מפתחות מתנדנדים, כביש פתוח |
| 5 | כמה באמת מקבלים על טרייד-אין? | price_reveal+insider_secret | F,R | leads | — | שני רכבים זה מול זה, מחשבון ביד |
| 6 | חשמלי או היברידי? עשינו חשבון על 3 שנים | comparison+statistic | F,R,S | awareness | — | מסך מפוצל: תקע טעינה מול אקדח דלק |
| 7 | הלקוח ניסה להוריד 10 אלף ₪. זה מה שקרה | story+curiosity_gap | R,T | awareness | ז׳ (לקוח) | לחיצת יד שקופאת באמצע |
| 8 | נכנס הבוקר למגרש: סיור של 30 שניות | behind_the_scenes+demonstration | R,F,S | sales | — | צילום גימבל סביב רכב מבריק |
| 9 | מיתוס: רכב שהיה בליסינג הוא תמיד בחירה גרועה | myth_busting | F,R | trust | — | פתק "ליסינג = רע" נקרע |
| 10 | מה חשוב לכם יותר: קילומטראז' או שנתון? | question | F,R,T | awareness | — | תקריב של מד המרחק מול סמל השנתון |

### 17. מורים וקורסים דיגיטליים — `courses-educators`
SEO: "הוקים לסרטונים למורים, מרצים וקורסים דיגיטליים". Compliance: job and income outcomes need "התוצאות אישיות". Scarcity must be real.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | עבדתי באקסל 10 שנים. זה הקיצור שהייתי רוצה לדעת ביום הראשון | story+insider_secret | R,T,S | leads | — | הקלטת מסך עם תקריב מקלדת, קיצור נלחץ |
| 2 | תפסיקו לשנן מילים באנגלית. תעשו את זה במקום | stop_doing | R,T | leads | — | כרטיסיות עפות באוויר |
| 3 | 3 טעויות שכל מי שמתחיל פייתון עושה | mistakes | T,R,S | trust | — | קוד עם קווים אדומים מתחת לשגיאות |
| 4 | רוצים לעבור להייטק אחרי 35? תקשיבו רגע | callout | F,R | leads | — | אדם מול לפטופ במטבח בלילה, אור המסך על הפנים **[compliance: גיל = personal attribute]** |
| 5 | שיעור של 60 שניות: איך כותבים פרומפט שבאמת עובד | how_to+demonstration | R,T,S | awareness | — | צ'אט על המסך, הקלדה מהירה, התוצאה מופיעה |
| 6 | בוגרת הקורס קיבלה הצעת עבודה אחרי 5 שבועות. ככה | social_proof+story | F,R | leads | נ׳ | מייל עם הצעת עבודה בטלפון **[compliance]** |
| 7 | מיתוס: צריך להיות "טובים במתמטיקה" בשביל לתכנת | myth_busting | R,T,S | awareness | — | נוסחאות מתמטיות נמחקות מהלוח |
| 8 | כמה דקות ביום באמת צריך כדי ללמוד שפה חדשה? | question+statistic | R,T | awareness | — | טיימר מטבח על 15:00 |
| 9 | ההרשמה נסגרת ביום ראשון ונשארו 12 מקומות | urgency_offer | F,R | sales | — | גרפיקה של כיסאות שמתמלאים אחד אחד **[compliance: רק אם נכון]** |
| 10 | 30 יום, 15 דקות ביום: לימדתי את עצמי גיטרה | challenge+before_after | T,R,S | awareness | — | יום 1: אקורד צורם → יום 30: שיר שלם |

### 18. מטפלים רגשיים — `therapists`
SEO: "הוקים לסרטונים למטפלים רגשיים, פסיכותרפיסטים ומאמנים". Compliance: **[compliance]** no client testimonials and no outcome promises (§A11). Hooks 1 and 2 touch on mental health, so use third-person phrasing in paid ads. Option: a footer line "במצב מצוקה: ער"ן 1201".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | מתעוררים עייפים גם אחרי 8 שעות שינה? אולי זה לא רק עייפות | callout+curiosity_gap | R,F | awareness | — | שעון מעורר מצלצל, אדם בוהה בתקרה |
| 2 | 3 משפטים שאנשים עם חרדה שומעים כל הזמן – ולא עוזרים | listicle | R,T,F | awareness | — | בועות דיבור צצות סביב דמות ונעלמות |
| 3 | מיתוס: טיפול זה רק למי ש"משהו לא בסדר" איתו | myth_busting | R,F,S | trust | — | חדר טיפול רגוע, שתי כורסאות, אור חלון רך |
| 4 | מה קורה בפגישה הראשונה? בלי מסתורין | how_to+behind_the_scenes | R,F | leads | — | POV: נכנסים לחדר, הדלת נסגרת בעדינות |
| 5 | 30 שניות של נשימה לרגע שהכל עולה | demonstration+how_to | R,T,S | awareness | — | עיגול נשימה מונפש מתרחב ומתכווץ |
| 6 | תפסיקו להגיד לעצמכם "אחרים עוברים דברים יותר קשים" | stop_doing | R,T | awareness | — | משפט בכתב יד נמחק בקו עדין |
| 7 | איך יודעים שזה המטפל המתאים? | question | F,R | trust | — (ניתן "המטפלת") | המטפל·ת יושב·ת באור חם, מבט ישיר למצלמה |
| 8 | POV: אמרתם בקול משהו שהחזקתם בפנים שנים | pov | R,T | awareness | — | כורסה ריקה, קרן אור שזזה לאט על הרצפה |
| 9 | עצב או דיכאון? ההבדל בשפה פשוטה | comparison | R,F,S | awareness | — | מסך מפוצל: חלון גשום מול חלון עם קרן שמש |
| 10 | מה מטפלים עושים כשקשה להם? | curiosity_gap+behind_the_scenes | R,T | trust | — | המטפל·ת הולך·ת לבד על חוף בשקיעה |

### 19. צלמי אירועים — `event-photographers`
SEO: "הוקים לסרטונים לצלמי חתונות ואירועים".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | הרגע הזה נמשך שנייה וחצי. כמעט פספסנו אותו | story+curiosity_gap | R,T | awareness | — | פריים שקפא על רגע מרגש, אפקט הרצה לאחור |
| 2 | 3 רגעים בחתונה שזוגות מצטערים שלא צולמו | listicle+negative_warning | R,F | leads | — | מונטאז' מהיר של רגעים קטנים בהילוך איטי |
| 3 | POV: אתם הצלם בחתונה של 600 איש, והכלה נעלמה | pov | T,R | awareness | — | ריצה בין האורחים, מצלמה רועדת |
| 4 | איך יצא הצילום הזה? מאחורי הקלעים | behind_the_scenes | R,T,S | awareness | — | זום-אאוט מהתמונה הסופית אל סט מבולגן עם פנס של טלפון |
| 5 | תפסיקו לבקש "רק תמונות טבעיות". הנה למה | stop_doing+controversy | R,T | trust | — | זוג קפוא בפוזה מול זוג שצוחק בספונטניות |
| 6 | כמה עולה צלם חתונות ב-2026? ולמה הפער יכול להגיע לפי 3 | price_reveal | F,R | leads | — | שני תיקי מצלמה עם תוויות מחיר |
| 7 | אותו זוג, אותו מקום: טלפון מול צלם מקצועי | comparison+before_after | R,T,S | leads | — | מסך מפוצל, אותה תמונה בשתי איכויות |
| 8 | השעה הכי טובה לצילומי זוגיות בישראל? לא בצהריים | insider_secret+how_to | R,T | trust | — | הבזק שמש של שעת הזהב מבעד לעצים |
| 9 | בת מצווה, 4 שעות, 2,300 תמונות. אלה נכנסו לאלבום | statistic+behind_the_scenes | R,F | awareness | — | גלילה מהירה בגריד של תמונות בתוכנת עריכה |
| 10 | אמא של הכלה ראתה את האלבום. זו הייתה התגובה | social_proof+story | F,R | trust | נ׳ (הדמות) | אישה מדפדפת באלבום ומוחה דמעה |

### 20. צימרים ומלונות בוטיק — `zimmers-boutique-hotels`
SEO: "הוקים לסרטונים לצימרים ומלונות בוטיק". Compliance: availability ("נשארו 2 סופ"שים") must be real.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | ג'קוזי מול הנוף הזה. בלי פילטר | bold_claim+satisfying_visual | R,T,F | sales | — | רחפן בדחיפה איטית אל ג'קוזי בזריחה |
| 2 | POV: כיביתם את הטלפון לסופ"ש שלם | pov | R,T | awareness | — | טלפון נופל לסלסלת קש, ערסל מתנדנד |
| 3 | 3 דברים לבדוק לפני שמזמינים צימר (את השלישי כמעט אף אחד לא בודק) | listicle+curiosity_gap | F,R | trust | — | יד פותחת לאט דלת עץ |
| 4 | כמה עולה סופ"ש זוגי אצלנו – כולל ארוחת בוקר? | price_reveal | F,R | sales | — | מגש ארוחת בוקר מונח על המיטה, תג המחיר מוסתר |
| 5 | מה קורה פה ב-6 בבוקר | behind_the_scenes+day_in_life | R,T | awareness | — | המארח·ת אופה לחם, ערפל מעל הגבעות |
| 6 | התמונות באתר מול המציאות. בדקנו | comparison+social_proof | R,F,T | trust | — | טלפון עם תמונת המודעה מורם מול הנוף האמיתי |
| 7 | הזוג הזה הגיע לסופ"ש אחד וחזר עוד 4 פעמים באותה שנה | social_proof+story | F,R | trust | — | דפי ספר האורחים מתדפדפים |
| 8 | נשארו 2 סופ"שים פנויים בחודש הבא | urgency_offer | F,R | sales | — | לוח שנה, שני תאריכים פנויים מהבהבים |
| 9 | אל תבואו לפה אם אתם לא מוכנים לשקט אמיתי | pattern_interrupt | R,T | awareness | — | שוט סטטי של עמק, בלי מוזיקה, רק ציוץ ציפורים |
| 10 | חופשה עם ילדים שגם ההורים נחים בה? יש דבר כזה | callout+question | F,R | leads | — | ילדים בבריכה, הורים בערסל עם קפה |

### 21. וטרינרים וטיפוח כלבים — `vets-dog-grooming`
SEO: "הוקים לסרטונים לווטרינרים, מספרות כלבים ופט-שופ".

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | הכלב שלכם עושה את זה? זה לא "סתם חמוד" | curiosity_gap+negative_warning | R,T,F | awareness | — | כלב גורר את הישבן על השטיח |
| 2 | 3 מאכלים מהמטבח שמסוכנים לכלבים (השני נמצא כמעט בכל בית) | listicle | R,T,F,S | awareness | — | ענבים, שוקולד ובצל על השיש, כלב מרחרח |
| 3 | חצי שנה בלי מספריים → כלב חדש | before_after+satisfying_visual | T,R,S | awareness | — | כלב עם פרווה סבוכה, ואז כלב פלאפי שמתנער |
| 4 | POV: הכלב שלכם מבין שנכנסתם לחניה של הווטרינר | pov | T,R | awareness | — | עיני הכלב נפתחות לרווחה במושב האחורי |
| 5 | תפסיקו לגזור ציפורניים בלי לבדוק את הנקודה הזאת | stop_doing+how_to | R,S | trust | — | תקריב ציפורן, פנס מאיר את כלי הדם |
| 6 | ככה נראית בדיקה שנתית מבפנים | behind_the_scenes | R,F | trust | — | ווטרינר·ית עם סטטוסקופ על כלב רגוע |
| 7 | מיתוס: אף חם = כלב חולה | myth_busting | R,T,S | awareness | — | יד נוגעת באף של כלב |
| 8 | שרב בחוץ? בדיקה של 5 שניות לפני שיוצאים לטיול | how_to+demonstration | R,T,F | awareness | — | כף יד על אספלט, טיימר 5 שניות |
| 9 | אמבטיה וייבוש לגולדן של 40 קילו | satisfying_visual | T,R,S | awareness | — | התנערות בהילוך איטי, טיפות מים מתפזרות |
| 10 | כל כמה זמן באמת צריך לקלח כלב? | question | R,T,F | leads | — | כלב בורח מהאמבטיה עם קצף על הגב |

### 22. סטארטאפ B2B — `b2b-startups`
SEO: "הוקים לסרטונים לסטארטאפים וחברות B2B". Platform note: add `linkedin` for this niche. Compliance: numeric claims ("6 שעות", "14 ימים ל-2") need a source or a case study.

| # | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | הצוות שלכם מאבד 6 שעות בשבוע על דוחות. עשינו את החשבון | statistic+callout | F,R,S (+LinkedIn) | leads | — | שעון מסתובב מעל גיליונות אקסל |
| 2 | תפסיקו לנהל מכירות באקסל | stop_doing | F,R (+LinkedIn) | leads | — | קובץ אקסל נגרר אל הפח |
| 3 | דמו של 30 שניות: מעלים קובץ, יוצא דוח | demonstration | F,R,S (+LinkedIn) | sales | — | הקלטת מסך, הסמן גורר קובץ לחלון |
| 4 | סמנכ"ל הכספים שלנו ביקש שלא נעלה את הסרטון הזה | pattern_interrupt+curiosity_gap | R,T | awareness | — | מנהל·ת נכנס·ת לפריים ומכסה את העדשה ביד |
| 5 | מה {מספר} חברות למדו כשעברו לאוטומציה | social_proof | F,S (+LinkedIn) | trust | — | קיר לוגואים של לקוחות מתאסף |
| 6 | POV: יום ראשון בבוקר, 47 מיילים, ואף אחד לא יודע מה הסטטוס | pov | R,T (+LinkedIn) | awareness | — | התראות מייל מציפות את המסך |
| 7 | 3 שאלות לשאול כל ספק SaaS לפני שחותמים על שנה | listicle | F,S (+LinkedIn) | trust | — | המייסד·ת כותב·ת "3" על לוח לבן |
| 8 | לקוח שלנו קיצר תהליך מ-14 ימים ל-2. זה מה שהשתנה | result_first+social_proof | F,R,S (+LinkedIn) | leads | — | ציר זמן גרפי שמתכווץ |
| 9 | דעה לא פופולרית: עוד דאשבורד לא יפתור לכם את הבעיה | controversy | F,R (+LinkedIn) | awareness | — | המייסד·ת סוגר·ת לפטופ מלא גרפים |
| 10 | ככה נראה ספרינט אצלנו מבפנים | behind_the_scenes | R,T,S (+LinkedIn) | trust | — | קיר פתקים צבעוניים, סטנדאפ של הצוות |


---

## B3. Seasonal Israeli hooks (10)

All seasonal hooks are niche-agnostic templates. The generator adapts them to the business's niche. **Holiday dates should come from a Hebrew-calendar API (for example the Hebcal REST API, https://www.hebcal.com, [PK]), not be hard-coded.** Black Friday 2026 falls on **27 Nov 2026**, with Cyber Monday on 30 Nov 2026 (computed from the 4th Thursday of November).

| # | עונה / חג | הוק | hook_type | פלטפורמות | מטרה | מגדר | 3 שניות ראשונות | מתי לפרסם |
|---|---|---|---|---|---|---|---|---|
| 1 | ראש השנה | לפני שמרימים כוסית: מתנה לראש השנה שלא תגיע ישר לארון | curiosity_gap | R,F | sales | — | קופסת מתנה נפתחת, רימון ודבש בפנים | 3–4 שבועות לפני |
| 2 | סוכות / חול המועד | חול המועד מתקרב: 3 דברים לעשות ב{עיר} בלי פקקים ובלי תורים | listicle | R,T,F | awareness | — | סוכה מוארת בלילה, ואז כביש ריק בבוקר | שבועיים לפני |
| 3 | חנוכה | 8 נרות, 8 הפתעות. הנר הראשון נדלק עכשיו | urgency_offer | R,T,F | sales | — | נר ראשון נדלק בחנוכייה, המוצר או השירות ברקע | מערב נר ראשון ועד סוף החג |
| 4 | פורים | התחפשנו ליום אחד לעסק אחר. זה מה שקרה | pattern_interrupt | T,R | awareness | — | הצוות בתחפושות של מקצוע אחר (שף עם מספריים של ספר) | שבוע לפני |
| 5 | פסח | ניקיונות פסח: הטעות שגוזלת לכם שעתיים כל יום | negative_warning | R,F,T | awareness | — | ארון חומרי ניקוי עולה על גדותיו | 3 שבועות לפני |
| 6 | יום העצמאות | על האש: הנתח שכולם מזמינים וכמעט אף אחד לא יודע להכין | insider_secret | R,T,F,S | sales | — | להבה מתפרצת מהמנגל, דגל ישראל ברקע | שבוע לפני |
| 7 | ט"ו באב | ט"ו באב: מתנה שאומרת "חשבתי עלייך" ולא "נזכרתי ברגע האחרון" | pattern_interrupt+callout | R,F | sales | נ׳ (ניתן "עליך") | יד מסתירה מתנה מאחורי הגב | 10 ימים לפני |
| 8 | חזרה ללימודים (1 בספטמבר) | 1 בספטמבר בעוד שבועיים. רשימת הקניות שחוסכת לכם {סכום} ₪ | listicle+statistic | F,R | sales | — | תיק גב מתרוקן על השולחן, ציוד מתפזר | אמצע אוגוסט |
| 9 | החופש הגדול | 10 שבועות של "משעמם לי" מתחילים עכשיו. הנה התוכנית | callout+how_to | F,R | leads | — | ילדים צונחים על הספה בבת אחת | סוף יוני |
| 10 | בלאק פריידיי (27.11.2026) | בלאק פריידיי: איך מזהים "מבצע" שהוא בעצם העלאת מחיר | insider_secret+negative_warning | R,T,F | trust (→sales) | — | תווית מחיר מתהפכת וחושפת מחיר גבוה יותר מאחור | שבוע לפני ועד סייבר מאנדיי |

Optional extras for the calendar: 11.11 (יום הרווקים), Tu BiShvat, Valentine's Day, יום המשפחה, the end-of-December sales and "סוף שנת המס". Add them as more seasonal hooks in the DB.

---

## B4. Universal hooks with placeholders (10)

| # | תבנית | hook_type | פלטפורמות | מטרה | placeholders | 3 שניות ראשונות |
|---|---|---|---|---|---|---|
| 1 | גרים ב{עיר} ומחפשים {שירות}? עצרו שנייה | callout | R,T,F | leads | עיר, שירות | שלט של העיר או נוף מזוהה של {עיר}, קאט לבעל·ת העסק |
| 2 | {מספר} טעויות שכמעט כל מי שמחפש {שירות} עושה | mistakes | R,T,S,F | trust | מספר, שירות | בעל·ת העסק מרים·ה {מספר} אצבעות, X אדום ראשון קופץ |
| 3 | כמה באמת עולה {שירות} ב{עיר}? בלי אותיות קטנות | price_reveal | R,F,S | leads | שירות, עיר | מחשבון או לוח עם מספר מטושטש, אצבע מתקרבת |
| 4 | תפסיקו {פעולה_שגויה}. תעשו את זה במקום | stop_doing | R,T,S | awareness | פעולה_שגויה | הפעולה השגויה מבוצעת, יד נכנסת לפריים ועוצרת אותה |
| 5 | POV: מצאתם סוף סוף {שירות} ב{עיר} שעונה בוואטסאפ תוך 5 דקות | pov | R,T | leads | שירות, עיר | טלפון רוטט, הודעת וואטסאפ נכנסת, חיוך של הקלה |
| 6 | ככה {קהל_יעד} חסכו {סכום} ₪ תוך {זמן} | result_first+social_proof | F,R | leads | קהל_יעד, סכום, זמן | המספר {סכום} ₪ נבנה על המסך בספירה מהירה |
| 7 | מיתוס: {מיתוס}. האמת? | myth_busting | R,T,S | trust | מיתוס | המשפט {מיתוס} מופיע על המסך ונקרע לשניים |
| 8 | {שם_העסק} ב-30 שניות: מה אנחנו עושים, ולמי זה לא מתאים | pattern_interrupt+curiosity_gap | R,F,S | awareness | שם_העסק | הלוגו נכנס, ואז חותמת "לא לכולם" |
| 9 | לפני: {לפני}. אחרי {זמן}: {אחרי} | before_after | R,T,F | sales | לפני, אחרי, זמן | מסך מפוצל עם מעבר ניגוב |
| 10 | נשארו {מספר} מקומות ב{חודש} במחיר {מחיר} ₪ | urgency_offer | F,R | sales | מספר, חודש, מחיר | לוח שנה עם משבצות שנסגרות אחת אחרי השנייה **[compliance: רק אם נכון]** |

### Placeholder dictionary

| Placeholder | Meaning | Example value | Grammar rule [D] |
|---|---|---|---|
| `{עיר}` | City or area | תל אביב, באר שבע, השרון | Prefixes attach directly: "ב{עיר}" → "בתל אביב". For "השרון": "ב{עיר}" → "בשרון" (drop the ה׳ after ב/ל/כ) |
| `{שכונה}` | Neighborhood | פלורנטין, רמת אביב | Same rule |
| `{שירות}` | Service | השתלות שיניים, שיפוץ אמבטיה | Store an indefinite form plus a definite form (`service_def`) |
| `{מוצר}` | Product | כרית אורתופדית | Store gender (ז/נ) for agreement |
| `{מחיר}` / `{סכום}` | Price / amount in ₪ | 249 / 12,000 | Format with a thousands separator and one ₪ convention per brand |
| `{מספר}` | Count | 3, 5, 7 | Odd numbers 3/5/7 are recommended for lists. Use a hyphen before digits with a prefix: "ב-2026" |
| `{זמן}` | Duration | 10 ימים, חודשיים | Plural agreement |
| `{חודש}` | Month | נובמבר | — |
| `{קהל_יעד}` | Audience (plural) | עצמאים, זוגות צעירים | **Always plural**, so verbs agree ("חסכו") |
| `{שם_העסק}` | Business name | — | Wrap Latin names in bidi isolates (§A7) |
| `{פעולה_שגויה}` | Wrong action (infinitive or gerund) | לשמור קבלות בקופסה | It must read naturally after "תפסיקו" |
| `{מיתוס}` | A common myth | "צוואה זה רק לעשירים" | — |
| `{לפני}` / `{אחרי}` | Before / after state | "מטבח משנות ה-90" / "מטבח מודרני" | — |

---

## B5. Three full 30-second sample scripts

Each script shows what the platform would output after the user picks a niche, a hook and a goal: scene-by-scene timing, the visual (to be generated by AI image/video models via OpenRouter, **without text**), the on-screen Hebrew text (rendered by Remotion), and the voiceover (Hebrew TTS).

### Script 1 — מסעדה / גריל-בר שכונתי (`restaurants`)

- **Hook:** "אל תבואו אלינו רעבים. ברצינות." (`pattern_interrupt`)
- **Format:** 9:16, 30 s, Reels + TikTok
- **Goal:** sales (table reservations via WhatsApp)
- **Voice:** young and energetic, gender of choice
- **Music:** upbeat Mizrahi-pop instrumental at about 115 BPM, with a beat drop at 0:03
- **Structure:** HPSPC

| זמן | ויז'ואל (מה רואים) | טקסט על המסך | קריינות (VO) | סאונד |
|---|---|---|---|---|
| 0:00–0:03 | מגש מעורב ענק נטרק על שולחן עץ בהילוך איטי, אדים ועשן עולים, זום-אין מהיר | **אל תבואו אלינו רעבים.** | "אל תבואו אלינו רעבים. ברצינות." | חבטה + רחש גריל |
| 0:03–0:07 | שיפודים מסתובבים על גחלים, ניצוצות עפים, ידי השף מברישות שמן | הכל על גחלים. מול העיניים. | "כי אצלנו הכל נצלה על גחלים, ממש מול העיניים שלכם." | דרופ של הביט |
| 0:07–0:11 | חיתוך לניגוד: צלחת לבנה ענקית עם מנה זעירה באור אפור וקר, ואז חזרה לשולחן שלנו המלא בצבע | נמאס ממנה קטנה במחיר גדול? | "נמאס לכם מצלחת ענקית עם מנה קטנה?" | צליל "ווּמפ" |
| 0:11–0:19 | צילום מלמעלה: השולחן מתמלא בסלטים, פיתות חמות מהטאבון, שיפודים וצ'יפס, ידיים מושיטות מכל הכיוונים | ארוחה זוגית מלאה – {מחיר} ₪ | "אצלנו ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} שקל. ויוצאים מפוצצים." | — |
| 0:19–0:25 | סועדים צוחקים, אחד מהנהן עם פה מלא, כוכבי דירוג מונפשים | {דירוג} בגוגל · {מספר} ביקורות | "ולא רק אנחנו אומרים את זה." | — |
| 0:25–0:30 | חזית המסעדה בלילה, שלט הניאון נדלק, הלוגו נכנס, אייקון וואטסאפ גרפי | שולחן להערב? שלחו וואטסאפ ← לינק בביו · {כתובת} | "שולחן להערב? שלחו וואטסאפ, אנחנו עונים תוך דקות." | סיום מוזיקלי |

Compliance: `{דירוג}` and `{מספר}` must be pulled from the real Google Business profile. If they are not available, replace the scene with a customer quote.

**The JSON the LLM step would return** (it follows the `storyboard` schema in `04-openrouter.md`; the fields `start_sec`, `vo_he` and `sfx` are **proposed optional extensions**, not part of that schema):

```json
{
  "hook": "אל תבואו אלינו רעבים. ברצינות.",
  "voiceover": "אל תבואו אלינו רעבים. ברצינות. כי אצלנו הכל נצלה על גחלים, ממש מול העיניים שלכם. נמאס לכם מצלחת ענקית עם מנה קטנה? אצלנו ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} שקל. ויוצאים מפוצצים. ולא רק אנחנו אומרים את זה. שולחן להערב? שלחו וואטסאפ, אנחנו עונים תוך דקות.",
  "scenes": [
    {"index":1,"start_sec":0,"duration_sec":3,
     "image_prompt_en":"Overhead-angled close shot of a huge mixed-grill platter landing on a rustic wooden table, steam and smoke rising, warm tungsten light, shallow depth of field, vertical 9:16, no text, no letters",
     "motion_prompt_en":"slow-motion impact as the platter hits the table, quick push-in, steam swirling",
     "onscreen_text_he":"אל תבואו אלינו רעבים.",
     "vo_he":"אל תבואו אלינו רעבים. ברצינות.","sfx":"plate_slam+sizzle"},
    {"index":2,"start_sec":3,"duration_sec":4,
     "image_prompt_en":"Skewers of meat and vegetables turning over glowing charcoal, sparks flying, chef's hands brushing oil, night grill-bar ambience, vertical, no text",
     "motion_prompt_en":"handheld close-up, sparks rising, slight rack focus to the skewers",
     "onscreen_text_he":"הכל על גחלים. מול העיניים.",
     "vo_he":"כי אצלנו הכל נצלה על גחלים, ממש מול העיניים שלכם.","sfx":"beat_drop"},
    {"index":3,"start_sec":7,"duration_sec":4,
     "image_prompt_en":"A tiny portion of food centered on an oversized white plate, cold grey lighting, minimalist fine-dining look, vertical, no text",
     "motion_prompt_en":"static shot, then a fast whip-pan transition to the right",
     "onscreen_text_he":"נמאס ממנה קטנה במחיר גדול?",
     "vo_he":"נמאס לכם מצלחת ענקית עם מנה קטנה?","sfx":"whoosh"},
    {"index":4,"start_sec":11,"duration_sec":8,
     "image_prompt_en":"Top-down view of a wooden table filling with Israeli salads, hot taboon pitas, skewers and fries, many hands reaching in, vibrant colors, vertical, no text",
     "motion_prompt_en":"stop-motion style time-lapse of dishes appearing one after another, hands reaching in",
     "onscreen_text_he":"ארוחה זוגית מלאה – {מחיר} ₪",
     "vo_he":"אצלנו ארוחה זוגית מלאה: סלטים, פיתות מהטאבון ושיפודים לבחירה, ב-{מחיר} שקל. ויוצאים מפוצצים.","sfx":""},
    {"index":5,"start_sec":19,"duration_sec":6,
     "image_prompt_en":"Friends laughing at a busy neighborhood grill-bar table, one person nodding with a full mouth, candid documentary look, warm light, vertical, no text",
     "motion_prompt_en":"gentle handheld drift, natural laughter moment",
     "onscreen_text_he":"{דירוג} בגוגל · {מספר} ביקורות",
     "vo_he":"ולא רק אנחנו אומרים את זה.","sfx":""},
    {"index":6,"start_sec":25,"duration_sec":5,
     "image_prompt_en":"Exterior of a small grill-bar at night, glowing neon sign without readable letters, people at outdoor tables, vertical, no text",
     "motion_prompt_en":"slow dolly-in toward the entrance as the neon flickers on",
     "onscreen_text_he":"שולחן להערב? שלחו וואטסאפ ← לינק בביו",
     "vo_he":"שולחן להערב? שלחו וואטסאפ, אנחנו עונים תוך דקות.","sfx":"music_outro"}
  ],
  "cta": "שולחן להערב? שלחו וואטסאפ ← לינק בביו"
}
```

### Script 2 — קבלן שיפוצים / שיפוץ חדרי רחצה (`renovation-contractors`)

- **Hook:** "האמבטיה הזאת עמדה ככה 40 שנה" (`before_after`)
- **Format:** 9:16 for Reels; 4:5 export for the Facebook feed; 30 s
- **Goal:** leads (photos sent via WhatsApp)
- **Voice:** grounded and trustworthy (the owner's voice, or TTS in the owner's gender)
- **Music:** light build-up; impact SFX on the transition
- **Structure:** BAB → PAS → proof → CTA

| זמן | ויז'ואל (מה רואים) | טקסט על המסך | קריינות (VO) | סאונד |
|---|---|---|---|---|
| 0:00–0:03 | פטיש 5 קילו פוגע באריח ורוד משנות ה-80, ענן אבק קופא בפריים | **40 שנה ככה.** | "האמבטיה הזאת עמדה ככה ארבעים שנה..." | נפץ + פריז |
| 0:03–0:06 | מעבר whip-pan לאותה זווית בדיוק: חדר רחצה מודרני, אריחים גדולים, תאורה חמה, מקלחון זכוכית | **10 ימי עבודה.** | "...עד שנתנו לה עשרה ימים." | "ווש" + אקורד פתוח |
| 0:06–0:11 | חדר מאובק באמצע שיפוץ, טלפון מצלצל על ארגז כלים ואף אחד לא עונה | הפחד מספר 1 בשיפוץ? | "הפחד הכי גדול בשיפוץ? קבלן שנעלם באמצע." | צלצול טלפון חוזר |
| 0:11–0:20 | מונטאז' תהליך: לוח זמנים על טאבלט, שכבת איטום נמרחת, פלס מונח על אריח, צילום מסך של עדכון יומי בוואטסאפ עם תמונה | שלוש שורות מתחלפות: לוח זמנים חתום בחוזה / עדכון יומי בוואטסאפ / אחריות {מספר} שנים | "אצלנו יש לוח זמנים חתום בחוזה, עדכון עם תמונות כל יום בוואטסאפ, ואחריות כתובה על העבודה." | קצב בונה |
| 0:20–0:25 | בעל·ת הבית נכנס·ת לחדר המוכן, מעביר·ה יד על המשטח ומחייך·ת למצלמה | "סיימו יום לפני הזמן" – {שם_לקוח}, {עיר} | (קול הלקוח·ה): "הם סיימו יום לפני הזמן. לא האמנתי." | — |
| 0:25–0:30 | הלוגו, ואז טלפון עם צ'אט וואטסאפ שבו נשלחות 3 תמונות | שלחו 3 תמונות של החדר ← הצעת מחיר תוך 24 שעות | "שלחו לנו שלוש תמונות של החדר בוואטסאפ, ותקבלו הצעת מחיר תוך 24 שעות." | סיום |

Compliance: the testimonial in 0:20–0:25 needs a real client's written consent. Otherwise use a text-only quote with an initial, or drop the scene. "10 ימי עבודה" and the warranty length must match the real offer.

### Script 3 — יועץ·ת משכנתאות (`mortgage-advisors`)

- **Hook:** "אותה משכנתא. הפרש של מאות אלפי ₪." (`statistic`)
- **Format:** 9:16, 30 s, Reels + Shorts + Facebook
- **Goal:** leads (comment keyword → auto-DM with a calculator)
- **Presenter:** a talking-head avatar of the advisor (for example HeyGen Avatar IV via OpenRouter, driven by your own Hebrew TTS audio, per `04-openrouter.md`) plus motion graphics
- **Structure:** statistic hook → insight → explanation → insider → CTA

| זמן | ויז'ואל (מה רואים) | טקסט על המסך | קריינות (VO) | סאונד |
|---|---|---|---|---|
| 0:00–0:03 | שתי ערימות זהות של מטבעות שקל על רקע נקי; אחת מתחילה לצמוח מהר כלפי מעלה (גרפיקה תלת-ממדית) | **אותה משכנתא. הפרש של מאות אלפי ₪.** | "אותה דירה, אותו סכום, ושני זוגות שישלמו הפרש של מאות אלפי שקלים." | צליל מטבעות + "רייזר" |
| 0:03–0:07 | היועץ·ת (אווטאר או צילום) במשרד מואר מסתובב·ת אל המצלמה | ההבדל? התמהיל. | "ההבדל הוא לא הבנק. זה התמהיל." | — |
| 0:07–0:16 | אנימציה: שלושה עמודים צבעוניים נבנים זה אחר זה – פריים, קבועה לא צמודה, משתנה כל 5 – וכל עמוד נדלק בתורו | פריים · קבועה לא צמודה · משתנה כל 5 | "פריים, קבועה לא צמודה, משתנה כל חמש. כל שינוי קטן בחלוקה ביניהם משנה את ההחזר החודשי ואת הסכום שתחזירו בסוף." | "טיק" על כל עמוד |
| 0:16–0:22 | הצעות משני בנקים על השולחן, יד מקיפה בעיגול אדום הבדל בריבית | הבנק לא ישווה בשבילכם | "ואף בנק לא יראה לכם מה הבנק השני מוכן לתת." | — |
| 0:22–0:27 | היועץ·ת מחזיק·ה טלפון עם מחשבון תמהיל על המסך | בדיקת תמהיל – בלי התחייבות | "רוצים לבדוק את התמהיל שלכם?" | — |
| 0:27–0:30 | מסך סיום: לוגו ובועת תגובה מונפשת עם המילה "משכנתא" | כתבו "משכנתא" בתגובות ← נשלח לכם את המחשבון. *המידע אינו מהווה ייעוץ. סימולציה להמחשה.* | "כתבו 'משכנתא' בתגובות, ונשלח לכם את המחשבון בפרטי." | סיום |

Compliance: the "מאות אלפי ₪" figure must come from a documented simulation (loan amount, term, rate assumptions) that the user keeps on file. The disclaimer line is mandatory in this niche (§A11).

---

## B6. Bonus: system prompt for the platform's hook generator

This is a Hebrew system prompt for the OpenRouter LLM step that generates new hooks per niche into the `hooks` table. Pair it with `response_format: json_schema`, as in `04-openrouter.md`.

```text
אתם קופירייטרים ישראלים בכירים שמתמחים בסרטונים קצרים (Reels, TikTok, Shorts, פייסבוק) לעסקים קטנים ובינוניים בישראל.
משימה: לכתוב {N} הוקים (משפטי פתיחה ל-3 השניות הראשונות) לנישה "{niche_he}" עבור העסק "{business_name}" ב{city}.

כללים:
1. עברית ישראלית טבעית, קצרה וישירה. לא תרגום מאנגלית. בלי "האם ידעת ש", בלי "אתה לא תאמין".
2. עד 12 מילים להוק. המילה הראשונה כבר נושאת את המסר. בלי ברכות ובלי שם העסק בפתיחה.
3. ברירת מחדל בלשון רבים ("אתם"). אם ההוק ממוגדר – סמנו gender.
4. כל הוק מקבל hook_type אחד מהרשימה: {taxonomy_slugs}, ולכל היותר סוג משני אחד.
5. לכל הוק כתבו visual_3s_he: משפט אחד שמתאר מה רואים ב-3 השניות הראשונות. תנועה מהפריים הראשון, בלי לוגו, בלי טקסט בתוך התמונה.
6. אסור להמציא מספרים, ביקורות או זמינות. אם צריך מספר, השתמשו ב-placeholder ({מחיר}, {סכום}, {מספר}).
7. ציות: בלי הבטחת תוצאות, בלי "הכי טוב" לעורכי דין ולרופאים, בלי פנייה שמניחה מצב בריאותי או כלכלי של הצופה (מדיניות "personal attributes" של Meta). לפני/אחרי רפואי או ירידה במשקל – סמנו compliance_flag.
8. גוון: לפחות 6 סוגי הוקים שונים בכל סט של 10. שלבו awareness, leads, sales ו-trust.
9. התאימו פלטפורמות: TikTok לקהל צעיר ולהומור, פייסבוק לקהל 35+ ולתוכן אמון, LinkedIn ל-B2B.
החזירו JSON בלבד לפי הסכמה.
```

---

## Sources

From sibling files in this run [S]:
- https://www.hooked.so/hooks
- https://www.contenthooks.ai/hook-library
- https://hookugc.com/hook-library
- https://www.socialync.io/viral-hooks-library
- https://makehooks.com/
- https://vmake.ai/visual-hook
- https://apps.apple.com/us/app/hook-viral-video-content/id6737547221
- https://ugcwarehouse.com
- https://blog.wask.co/digital-marketing/viral-hooks-library/
- https://zeely.ai/automated-ad-creation/
- https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-marketing-studio/SKILL.md
- https://help.mirage.app/docs/project/ad-studio
- https://creatify.ai/features/ad-clone
- https://www.quickads.ai/adslibrary
- https://admanage.ai/blog/foreplay-alternatives
- https://www.gethookd.ai/learn/atria-ai-reviews-pricing-alternatives-is-this-facebook-ad-tool-legit/
- https://superscale.ai/learn/digital-ad-intelligence/
- https://github.com/Elwyun/hooklab-ai
- https://eesel.ai/blog/arcads-ai-pricing
- https://hera.video/blog/ai-motion-graphics-for-product-hunt-launch

Prior knowledge, not re-checked in this run [PK]:
- https://doi.org/10.1037/0033-2909.116.1.75
- https://doi.org/10.1037/1089-2680.5.4.323
- https://doi.org/10.2307/1914185
- https://doi.org/10.1121/1.1907229
- https://www.facebook.com/business/news/insights/capturing-attention-feed-video-creative
- https://www.bbc.com/news/health-38896790
- https://ads.tiktok.com/business/creativecenter/
- https://www.facebook.com/ads/library/
- https://adstransparency.google.com/
- https://www.foreplay.co
- https://www.minea.com
- https://www.kalodata.com
- https://motionapp.com
- https://manychat.com
- https://www.thinkwithgoogle.com/
- https://developers.google.com/search/blog/2024/03/core-update-spam-policies
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
- https://www.israelbar.org.il
- https://www.hebcal.com

---

## Verification addendum (2026-10-13)

*Scope: Part A statistics only. A second agent checked them with live WebSearch at snippet level. Part B was not touched.*

**Corrected**
- **Facebook 47% / 74%:** the source is Facebook with Nielsen, **February 2016**, and the wording is "**up to** 47%… **up to** 74%". Some contemporary summaries (Salesforce 2016) describe it as the share of ad-recall / brand-awareness lift, not generic "value". Quote it as "up to 47% of the campaign value (Facebook/Nielsen, 2016)". https://about.fb.com/es/news/2016/02/capta-la-atencion-con-nuevas-funcionalidades-para-anuncios-de-video/ ; https://salesforce.com/content/blogs/us/en/2016/02/facebook-video-ads-global.html
- **TikTok 63%:** the source is TikTok for Business's "9 creative tips to drive auction ad performance" (also a PDF), which says "**more than 63%**" of the **highest-CTR** videos highlight the key message or product in the first 3 s. The year "about 2021" and the "Marketing Science" attribution are unconfirmed; no method is given. https://ads.tiktok.com/business/en-US/blog/9-creative-tips-to-drive-auction-ad-performance

**Newly verified**
- **TikTok 2-s view:** at least 2 s in one impression session, replays excluded. **6-s view:** at least 6 s, or a full play if the video is under 6 s, or at least one engagement within 6 s. https://ads.tiktok.com/help/article/video-play
- **Meta ThruPlay:** played to completion or for at least 15 s, whichever comes first (third-party sources). https://www.jonloomer.com/?p=36498
- **YouTube Shorts:** since 31 Mar 2025, views count every start or replay. "Engaged views" keeps the old count for YPP and revenue. The API followed on 30 Apr 2025. "Viewed vs. swiped away" is a Shorts analytics metric, and the 70% "good" threshold is folklore from third-party blogs (third-party sources only). https://www.creatoressentials.com/glossary/shorts-engaged-views/ ; https://www.shortimize.com/blog/youtube-shorts-retention-rate
- **Related Facebook stat:** 65% of people who watch the first 3 s watch at least 10 s, and 45% watch 30 s. https://www.marketingdive.com/news/facebook-offers-tips-for-converting-tv-ads-to-mobile/448510/
- **Hooked.so:** "750+ hooks" is independently corroborated. https://programminginsider.com/12-tools-libraries-behind-todays-most-popular-hooks/
- **New competitor:** **Hookest**, a performance-backed hook library with an API (about 14 categories; $29/$99/$299 API tiers; Product Hunt Sep 2026; single review source). https://chatgate.ai/post/hookest

**Still unverified ([PK])**
- Meta's 3-second play definition and percentile metrics (from an official Meta page)
- The 0.25 s Facebook recall figure
- TikTok/Kantar 88% sound
- Verizon/Publicis 69% / 80%
- Hook-rate benchmarks
- The Instagram skip-rate and Mosseri signals
- Reels/Shorts length limits and the TikTok 21–34 s guidance
- Meta safe-zone percentages
- Hooked.so pricing and its 24 categories
- ContentHooks details: a re-search found no independent mention
- All §A11 compliance items
