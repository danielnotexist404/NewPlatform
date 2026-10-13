# 08: Design direction for a premium, Hebrew-first (RTL) AI promo-video SaaS (2025–2026)

*Research date: 2026-10-13. Scope: landing-page patterns of top AI-video SaaS sites, Hebrew typography, RTL UI practice, React component resources, app UX for the creation flow, and a concrete design system with two alternative visual directions, a landing-page blueprint and app-screen blueprints.*

---

## 0. Read this first: how reliable this file is

- **I made zero successful live searches.** Every WebSearch call returned "web search budget used up (limit 200 per turn, shared by every agent in it)". Direct page fetching (WebFetch, curl) is blocked by network policy. I did not try to get around either limit. A follow-up run with a fresh search budget can verify the items in §11.
- **Each claim carries one of these tags:**
  - **[S-0X]**: a fact that a sibling research agent in this same workflow found by live search and recorded in `01-cadabra.md` … `06-israel.md` (same folder). The URL is given inline. This is snippet-level evidence.
  - **(unverified-MK)**: from my model knowledge (training data to about mid-2026), **not re-checked** in this run. The URL is the canonical page to check, not proof. Competitor websites redesign often, so treat every description of a competitor's homepage as a *pattern you will probably find*, not a current screenshot.
  - **(design)**: my own proposal or inference. The design system, palettes, blueprints and copy are all (design).
- **Computed facts.** I calculated every WCAG contrast ratio quoted in §6 with the WCAG 2.x relative-luminance formula, so those numbers are exact for the hex codes given.
- **Update 2026-10-13 (verification pass):** a second agent ran 35 live searches (snippet-level, no page fetches) and re-tagged claims in place as **[verified: URL]** or **[corrected: URL]**. Anything still marked (unverified-MK) was not checked. See the "Verification addendum (2026-10-13)" at the end of this file.
- **Cadabra / livinginmovie.com visual design is unknown.** The sibling report could not retrieve its colors, fonts, theme or hero style [S-01] (https://www.livinginmovie.com/). Open the site manually and note its visual design before you finalize the brand, so the new product looks clearly different.

---

## 1. TL;DR: the design decisions that matter

1. **Video-first, dark-leaning, "cinema" aesthetic for the marketing hero.** The leading AI-video sites (Runway, Higgsfield, Pika, Captions/Mirage, Krea) mostly sell with **real generated output on screen in the first viewport**: autoplay walls, marquees or a full-bleed reel (unverified-MK). For an Israeli SMB product, the hero must show **finished Hebrew business videos** (Hebrew captions, niche examples), not abstract AI art.
2. **Outcome-first hero input.** Put the first step of the wizard inside the hero: a **niche picker plus a "paste your website / Instagram link" box**, with "or describe your business" as the fallback. The market's core flow is "paste a URL, get N videos" [S-02] (https://creatify.ai/, https://www.heygen.com/tool/url-to-video, https://higgsfield.ai/blog/best-ai-platforms-create-ads-from-url). Niche-first entry is the product's differentiator [S-03].
3. **Two visual directions (pick one, §6):**
   - **A, "בכורה" (Premiere):** near-black, a projector-gold primary, rose/violet glow, film grain, Heebo plus Karantina. Premium and cinematic, so the videos pop.
   - **B, "אור יום" (Daylight):** warm paper white, ink black, ultramarine primary, coral and lemon accents, Frank Ruhl Libre plus Assistant. Friendly and editorial, for non-tech SMB owners.
   - **My recommendation:** **A for the brand, marketing site and app (dark default), with a full light mode.** Use B's warmth only on long-read SEO pages (hooks, niches, blog) if you want. (design)
4. **RTL done properly is a premium signal in Israel.** Use logical CSS everywhere, mirror only *directional* icons, keep the **media player and timeline LTR**, isolate numbers and Latin text with `<bdi>`, set phone/email/URL inputs to `dir="ltr"`, and set carousels and marquees to RTL. Most global tools fake RTL, so getting it right shows (design; RTL mechanics are unverified-MK, see §4).
5. **Accessibility is legal, not optional, in Israel.** Commercial sites must comply with IS 5568, which is based on WCAG 2.0 AA. Build to **WCAG 2.2 AA** [S-06, itself unverified-MK]. This changes the design: a pause control on autoplay walls, `prefers-reduced-motion` fallbacks, captions on every marketing video, 4.5:1 text contrast, visible focus, a sticky CTA that must not hide focused elements, and a Hebrew הצהרת נגישות page.
6. **Stack for the look:** Tailwind v4 plus shadcn/ui (Radix `DirectionProvider dir="rtl"`) as the base. shadcn/ui has had **first-class RTL support since January 2026** (`rtl: true` in `components.json`, `shadcn migrate rtl` for existing components) [verified: https://ui.shadcn.com/docs/changelog/2026-01-rtl]. Add Magic UI, Aceternity UI, Motion Primitives and React Bits for hero effects, **Motion** (formerly Framer Motion, independent since 12 Nov 2024) for UI motion [verified: https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion], **GSAP** (100% free including SplitText, MorphSVG and other former Club plugins, commercial use included) only for scroll storytelling [verified: https://webflow.com/blog/gsap-becomes-free], **Lenis** for smooth scroll, and **Remotion Player** for in-app live previews. Magic UI, Aceternity, Motion Primitives and Remotion specifics remain unverified-MK; see §5.
7. **The app's "wow" moments:**
   - a **live 9:16 phone preview** that updates as the user moves through the wizard (Remotion Player, no render cost) [S-05] (https://www.remotion.dev/docs/player)
   - **streamed script text** while the video clips generate
   - **scene cards** that move from blurred placeholder to playing clip in real time (Supabase Realtime) [S-05]
   - a **cost preview on every Generate button**
   - **automatic credit refunds on failure**, which Cadabra advertises [S-01] (https://www.livinginmovie.com/)

---

## 2. Landing-page patterns used by top AI-video SaaS sites

### 2.1 Site-by-site pattern notes

> All rows are **(unverified-MK)**, remembered patterns up to about mid-2026. Each site redesigns several times a year, so open each URL and screenshot the hero before committing. Rows marked [S-0X] contain a searched fact.

| Site | Theme | What the hero / sections typically look like | Pattern worth stealing |
|---|---|---|---|
| **Runway** (runwayml.com) | Dark, editorial | Full-bleed cinematic video, minimal nav, a large but restrained headline. Product announcements (Gen-4 family, "Aleph", world models) appear as large film-still cards. Separate areas for research, "Runway Studios" and the AI Film Festival. Feels like a film studio, not a SaaS. | Restraint: one hero reel, huge whitespace, film-festival credibility. Use **"Showcase" as editorial content**, not a feature list. |
| **Pika** (pika.art) | Playful, bright accents on dark | Meme-friendly, colorful, effect-led ("Pikaffects"-style one-click effects), with short looping clips of objects squishing, exploding and so on. Copy is casual. | **One-click effect tiles** with looping previews. Suits a "Hooks/visual hooks" gallery. |
| **Higgsfield** (higgsfield.ai) | Dark, dense | Feed-like grid of many autoplaying generated clips and presets, heavy on camera-motion and ad presets, with a neon-ish accent. Marketing Studio presets (UGC, Unboxing, TV Spot…) appear as visual cards [S-02] (https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-marketing-studio/SKILL.md). Click-to-Ad starts from a product URL [S-02] (https://higgsfield.ai/blog/best-ai-platforms-create-ads-from-url). Scale (self-reported in a Higgsfield job post): "$700M annual revenue run rate, 30M+ users" [verified-snippet, self-reported: https://jobs.accel.com/companies/higgsfield-ai-2/jobs/92593188-cx-graphic-designer]. The homepage visual description is still unverified; a 2026 search found no design review of it. | **Preset gallery as the product.** Each tile is a looping example plus a "use this" button. Hook dropdowns live inside presets [S-02]. |
| **HeyGen** (heygen.com) | Mostly light, with purple/blue gradient accents (theme may have changed) | Avatar video in the hero, "Get started free" plus "Book a demo", an enterprise logo wall, G2-style badges, use-case tabs (marketing, L&D, sales), and a languages showcase. Hebrew TTS/translation pages exist [S-02] (https://www.heygen.com/en-gb/text-to-speech/hebrew). A HeyGen web product-designer job post says the role ships "A/B tests and landing page variants" for the marketing site, so expect the hero to change often [verified-snippet: https://www.builtinsf.com/job/product-designer-web/11337316]. No 2026 design review of the homepage was found. | **Use-case tabs** that swap the demo video. A **language/voice showcase** with play buttons (Hebrew voice samples here). |
| **Synthesia** (synthesia.io) | Light, corporate, clean | Avatar presenter video, a prominent free-trial CTA, a large logo wall and enterprise trust (security, compliance), and a template gallery. | **Enterprise trust row** (security, invoices, data residency). Translate to "חשבונית מס, תשלום בשקלים, שרתים באירופה". |
| **Creatify** (creatify.ai) | Light with saturated accents | URL-to-video ad maker. Self-described "#1 AI video ad maker" and claims "Product Hunt #1 Product of the Day" [S-02] (https://creatify.ai/, https://www.producthunt.com/products/creatify). Grid of vertical ad examples, avatar casting, batch mode. 2026 third-party reviews confirm the core flow: the product URL is scraped for images, benefits and pricing, then turned into avatar ad drafts with batch variations. They report Starter at about $39/mo (100 credits), Pro at about $99/mo, a watermark-only free plan, and G2 4.8/5 from about 1,495 reviews [verified-snippet: https://zeely.ai/blog/creatify-ai-review/ , https://vidmuse.ai/blog/creatify-ai-review , https://www.g2.com/sellers/creatify-labs-inc]. The homepage visual style is still unverified. | **URL box in the hero** and a **wall of 9:16 ads**. PH reviewers complain about confusing and expiring credits [S-02]. 2026 reviews add that Creative Agent / Ad Flow credit costs "cannot be predicted before running" and that many negative reviews are about billing and refunds [verified-snippet: same review URLs]. So design pricing to be transparent. |
| **Arcads** (arcads.ai) | Light/neutral | Wall of AI UGC actor faces / talking-head clips, actor library, "write a script → pick actors → get videos". Directory listings in 2026 cite **1,000+ AI actors and 35+ languages** (older reviews say about 300 actors) and a Starter plan around $110/mo (one source) [verified-snippet: https://vantaige.io/ai-tool/arcads , https://www.tooljunction.io/ai-tools/arcads]. Hero layout still unverified. | **Actor/presenter grid with hover-play.** For us: a Hebrew presenter and voice grid. |
| **Captions → Mirage** (captions.ai / mirage.app) | Dark, Apple-like | Phone mockups, crisp product UI, high-end typography. Rebranded to Mirage in Sep 2025 [S-02] (https://en.wikipedia.org/wiki/Captions_(app)). | **Phone-frame product shots** with captions animating, plus a polished caption-style picker. |
| **InVideo AI** (invideo.io) | Dark purple gradient | A **prompt box in the hero** ("give any topic…") with example prompt chips, multi-model positioning, and a big gallery. | **Prompt-in-hero with chip suggestions** that rotate (an animated placeholder). |
| **Krea** (krea.ai) | Light/minimal, bold black type | Product-UI-forward. Real-time generation demos, model list, tool grid (image, video, enhancer, realtime). | **Tool grid as navigation**, and a **model-logo strip** stating "all top models in one place". |
| **Freepik** (freepik.com, AI suite) | Light | A giant search/prompt bar, an AI tools grid, and one subscription bundling multiple models. Hebrew-language coverage notes that Freepik bundles Veo 3.1, Kling 3.0 and ElevenLabs under one plan [S-01] (https://www.poenta.co.il/article/freepik-ai-tools/). | **"All engines, one plan"** messaging. Cadabra uses the same promise: "כל המנועים המובילים במסך אחד" [S-01]. |
| **Cadabra / livinginmovie.com** | **Unknown** (not retrievable) [S-01] | From indexed snippets, the page sections are a Hebrew hero ("פלטפורמה ליצירת סרטים בעברית"), "30+ מנועים", "עברית מלאה: ממשק, כתוביות וקריינות", "עד 4K", a creation-lab section, a course section ("הקורס הגדול בישראל"), 4 USD credit packs ($19/$39/$69/$179), FAQ ("מה בעצם מקבלים?") and a blog of Hebrew engine guides [S-01] (https://www.livinginmovie.com/). Re-searched 2026-10-13: the page title is "קאדאברה · Cadabra AI, פלטפורמה ליצירת סרטים בעברית". The page sells **pay-per-creation, not a monthly subscription**, with one credit balance across all engines (30+, including a Google engine), refunds for technically failed generations, and an advanced course plus Hebrew blog [verified-snippet: https://www.livinginmovie.com/]. **Colors, fonts and hero media are still unknown**: search snippets don't describe visuals, so open the site manually. | What to beat: **no niche flows, no hooks, USD pricing, an engine-picker UX** [S-01]. Our page should lead with *outcomes per niche* and **₪ pricing incl. VAT**. |

### 2.2 Cross-site pattern catalog (what to build, with an RTL note for each)

| Pattern | Seen at (unverified-MK) | Why it works | RTL / Hebrew note (design) |
|---|---|---|---|
| **Autoplay video wall / vertical marquee** (2–4 columns of 9:16 clips scrolling in opposite directions) | Higgsfield, Creatify, Arcads | Proof of quality in under 1 s. Video is the product. | In RTL, put the text column on the **right** (start) and the wall on the **left** (end). Columns can scroll vertically, which needs no mirroring. Add a visible ⏸ "עצור אנימציה" button (WCAG 2.2.2). |
| **Horizontal marquee** (logos, hook cards) | Most SaaS sites | Social proof, density | In RTL, mirror the keyframe direction so items enter from the end (left) (§4.5). |
| **Prompt / URL box in the hero** | InVideo, Creatify, Krea, Freepik | Turns the hero into step 1 of activation | The input is RTL for descriptions and `dir="ltr"` for URLs. Rotate Hebrew placeholder examples by niche. |
| **Before/after slider** | AI enhancers, upscalers | Shows the transformation | For us: **"raw phone footage / photos" vs "finished reel"**, or **"עורך וידאו: 5 ימים, ₪1,500" vs "כאן: 5 דקות, ₪29"**. The handle drag must follow RTL (§4.6). |
| **Bento grid of features** | Linear-style SaaS, Magic UI and Aceternity templates | Scannable, premium, mixes media and text | Uneven tiles; each tile has a looping micro-demo. Order the tiles from the right. |
| **Model logos strip** ("Powered by Veo, Kling, Seedance, ElevenLabs…") | Krea, Freepik, Higgsfield, Cadabra (engine names in copy) [S-01] | Borrowed credibility | Use **text wordmarks or approved logos only**. Check each vendor's brand guidelines (nominative use). The OpenRouter model roster is in [S-04] (https://openrouter.ai/blog/insights/image-to-video-models-compared/). |
| **Social-proof counters** (number ticker) | Most | Momentum | Use **only true numbers** (Israeli consumer-protection rules on misleading advertising [S-06]). Show numbers in `<bdi>` with tabular numerals. |
| **Pricing with credits** | All | Monetization | Show **₪ incl. VAT**, "≈ N סרטונים" per plan, cost per video type, rollover and the auto-refund promise [S-01][S-02]. |
| **FAQ accordion** | All | Objection handling plus SEO (FAQPage schema) | Put chevrons at the end (left) side. Do not mirror the chevron rotation. |
| **Sticky CTA** (header CTA plus mobile bottom bar) | Most | Conversion | Must not cover focused elements (WCAG 2.2 SC 2.4.11). Add `scroll-padding-bottom` equal to the bar height. |
| **Theme** | Dark: Runway, Higgsfield, Pika, Mirage, InVideo. Light: HeyGen, Synthesia, Creatify, Krea, Freepik | Dark makes video pop and reads "pro tool". Light reads "friendly, business". | Recommendation in §1.3. |
| **Glow, gradients, noise, glass** | Widespread in 2024–2026 AI SaaS | A "premium AI" signal | Use them sparingly: one radial glow per section, 4–6% grain, glass only on floating UI (nav, preview chrome). |
| **3D (Spline)** | Some AI landing pages | Novelty | Expensive (JS weight, GPU). Use **at most one** Spline scene, lazy-loaded behind a poster image, and skip it on mobile and under reduced motion (§5.2). |

---

## 3. Hebrew typography

### 3.1 Google Fonts with Hebrew: a shortlist for this product

> Filter at https://fonts.google.com/?subset=hebrew. **Verification status (2026-10-13):** most rows below were checked by live search against Google Fonts "about" pages or Fontsource (which mirrors Google Fonts subsets and weights). Rows still tagged (unverified-MK) were not checked. All families here are SIL OFL unless noted.

| Family | Style | Weights (approx.) | Best use here | Notes |
|---|---|---|---|---|
| **Heebo** | Neo-grotesk sans; extends Roboto's Latin to Hebrew. Hebrew drawn by **Oded Ezer**, font files mastered by **Meir Sadan** [corrected/expanded: https://fontsource.org/fonts/heebo/about] | Variable 100–900 (variable since May 2020) [verified: https://fontsource.org/fonts/heebo/about] | **UI and body; bold headlines (800–900)** | Neutral and very legible. Latin is Roboto-like, but vertical metrics differ from Roboto because the Hebrew is primary. Nov 2023 update fixed Hebrew bugs [verified: https://fontsource.org/fonts/heebo/about]. The safest workhorse. Also available in Remotion via `@remotion/google-fonts/Heebo` [S-05]. |
| **Assistant** | Humanist sans. Hebrew by **Ben Nathan** (Hafontia), drawn to match Adobe's Source Sans Pro Latin (Paul Hunt) [verified: https://fonts.google.com/specimen/Assistant/about] | 200–800, variable (wght) [verified: https://fontsource.org/fonts/assistant/about] | Body and UI, warmer than Heebo | Excellent for long reading (SEO hook pages). |
| **Rubik** | Slightly rounded-corner sans. Latin by Hubert & Fischer; **Hebrew redesigned by Meir Sadan (2015)** [corrected: https://awesome.ecosyste.ms/projects/github.com%2Fgooglefonts%2Frubik] | Variable 300–900 (unverified-MK) | Friendly headlines and UI | A huge Israeli-web cliché, so it feels "local but common". **Rubik display spin-offs:** Hebrew is confirmed for **Rubik Glitch** and **Rubik Glitch Pop** [verified: https://www.figma.com/fonts/rubik-glitch/ , https://www.figma.com/fonts/rubik-glitch-pop/]. For **Rubik Spray Paint, Rubik Doodle Shadow, Rubik Wet Paint and Rubik Dirt**, Hebrew is plausible (they derive from Rubik) but **still unverified**; check each family's subset list before using it in a caption preset. |
| **Noto Sans Hebrew** | Neutral sans | Variable 100–900 (weights unverified-MK) | Body with **nikud**, fallback | On Google Fonts [verified: https://fonts.google.com/specimen/Noto+Sans+Hebrew/about]. Reliable glyph coverage. |
| **IBM Plex Sans Hebrew** | Technical grotesk (IBM) | 100–700 (7 static weights) [verified: https://fontsource.org/fonts/ibm-plex-sans-hebrew/about] | Dashboards and numbers-heavy UI | Added to Google Fonts in 2021 [verified-snippet: https://luc.devroye.org/fonts-92635.html]. Pairs with IBM Plex Mono for timecodes. |
| **Secular One** | Single-weight **humanist sans** by **Michal Sahar**, intended "for text as well as branding" (not a heavy display face) [corrected: https://fontsource.org/fonts/secular-one/about] | 400 only [verified] | Punchy headlines and caption presets | June 2023 update enlarged the glyph set. A single weight limits it. |
| **Suez One** | Heavy display serif by Michal Sahar; Hebrew inspired by calligraphy; meant for headlines and display [verified: https://fontsource.org/fonts/suez-one/about] | 400 only [verified] | Editorial / "news" caption preset | |
| **Varela Round** | Rounded sans | 400 only (unverified-MK) | Kids, family and soft niches (גני ילדים, bakery) | Not re-checked. |
| **Karantina** | Condensed poster display by **Rony Koch** (Tel Aviv), drawn during the COVID-19 lockdowns; on Google Fonts since 2021 [verified: https://fontsource.org/fonts/karantina/about , https://www.sessions.edu/notes-on-design/free-font-friday-karantina/] | 300/400/700, static (not variable); subsets hebrew, latin, latin-ext [verified: https://fontsource.org/fonts/karantina/cdn] | **Huge hero words, numbers, movie-poster titles** | Condensed with a tall x-height, so it fits huge Hebrew words. Use sparingly. |
| **Bellefair** | High-contrast elegant display. Latin by **Nick Shinn** (Shinntype), Hebrew by **Liron Lavi Turkenich** [verified: https://fontsource.org/fonts/bellefair/about] | 400 only [verified-snippet: https://www.serbyte.net/fonts/bellefair] | Luxury niches (wedding halls, jewelry, real estate) | Display only. |
| **Frank Ruhl Libre** | Classic Hebrew serif, open-source revival of Frank-Rühl by **Yanek Iontef** (Fontef) [verified: https://fonts.google.com/specimen/Frank+Ruhl+Libre/about] | 7 weights Light–Black; **variable since Nov 2022**, 300–900 [verified: https://fonts.google.com/specimen/Frank+Ruhl+Libre/about] | **Editorial headlines** (Direction B), quotes | Supports nikud [S-05, not re-checked]. Note: the Fontsource npm package ships only 300/400/500/700/900 by default. |
| **Alef** | Clean screen sans by **Hagilda with Mushon Zer-Aviv**, funded by the Israel Internet Association; on Google Fonts since 2013 [verified: https://fontsource.org/fonts/alef/about , https://github.com/danielrosehill/Awesome-Hebrew-Fonts] | 400/700 [verified] | Body fallback | Confirms **Hagilda** (הגילדה) as an Israeli type collective, co-founded in 2002 by Michal Sahar and Danny Meirav [verified-snippet: https://luc.devroye.org/fonts-57645.html]. Nikud support is partial (some diacritic features missing) [verified-snippet: https://opensiddur.org/help/fonts/]. |
| **Amatic SC** | Hand-drawn condensed (Hebrew included) | 400/700 (unverified-MK) | Handwritten accents only | Not re-checked. Low legibility; never for body. |
| **Fredoka** | Rounded, playful. Latin by Milena Brandão; **Hebrew by Ben Nathan (Hafontia)** [verified: https://fonts.google.com/specimen/Fredoka/about , https://rightfontapp.com/family/fredoka] | Variable, **two axes: width (wdth) and weight (wght)**, 300–700; subsets hebrew, latin, latin-ext [verified: https://fontsource.org/fonts/fredoka/cdn] | Playful niches, stickers | Hebrew subset confirmed. |
| **Playpen Sans Hebrew** | Handwriting-style sans from **TypeTogether's Playpen Sans superfamily**; alternate glyphs rotate automatically as you type for a natural hand-drawn look [verified: https://fontsource.org/fonts/playpen-sans-hebrew/about] | Variable 100–800 [verified: https://fontsource.org/fonts/playpen-sans-hebrew/about] | Notes and annotations in the UI ("טיפ:") | On Google Fonts (OFL) and also Adobe Fonts [verified: https://fonts.adobe.com/fonts/playpen-sans-hebrew]. |
| **Open Sans** (includes the former "Open Sans Hebrew") | Humanist sans | Variable 300–800 | Neutral body | **Hebrew merged into the main Open Sans family in March 2021**, when it became variable [verified: https://fontsource.org/fonts/open-sans/about , https://wikipedia.com/wiki/Open_Sans]. The old standalone "Open Sans Hebrew" was a Google Fonts Early Access family; its Hebrew is credited to Yanek Iontef [verified-snippet: https://opensiddur.org/help/fonts/]. |
| Also: **Miriam Libre** (Michal Sahar, 2015, a revival of the 1908 Miriam typeface [verified-snippet: https://luc.devroye.org/fonts-57645.html]), **David Libre**, **Arimo/Tinos/Cousine** (metric-compatible), **Noto Serif Hebrew**, **Noto Rashi Hebrew** (semi-cursive "Rashi" style based on 15th-century Sephardic writing, meant for emphasis alongside Noto Serif Hebrew; on Google Fonts [verified: https://fontsource.org/fonts/noto-rashi-hebrew/about]) | | | Fallbacks, legal pages | |

### 3.2 Premium Israeli foundries (commercial; partly verified 2026-10-13)

| Foundry / family | What I know | Use | Verify |
|---|---|---|---|
| **AlefAlefAlef (AAA)**: **Ploni**, **Almoni** (and Almoni variants such as Neue / Tzar) | The best-known contemporary Israeli retail sans families. "Ploni Almoni" is Hebrew for "John Doe", which fits a pair of families from one foundry. Widely used by Israeli tech and brands. | Swap-in upgrade for headlines and UI in Direction A (Almoni) or B (Ploni) | Webfont license **and** a video-embedding / app-rendering license, because you will burn fonts into rendered MP4s via Remotion [S-05]. **Verified license facts:** AAA's EULA has a **Web license** (live text on one domain incl. subdomains, the domain and font server must be owned by the licensee, capped by monthly page views, about 1M/month in the base tier, no embedding that lets visitors edit the design) and an **App license** (one app, up to 50k installs) [verified: https://alefalefalef.co.il/en/more/license/]. **No AAA video / broadcast license was found by search**, so ask the foundry in writing before rendering Ploni/Almoni into customer MP4s. Ploni and Almoni are published by AlefAlefAlef [verified: https://www.fontshop.com/families/almoni , https://www.fontshop.com/families/ploni]. |
| **Masterfont**: **Simpler** (often seen as "Simpler Pro"). ~~Narkis family (Zvi Narkiss)~~ **[corrected: since 2019, Fontef is the exclusive distributor of Zvi Narkiss's typefaces; see the Fontef row: https://fonts.adobe.com/foundries/fontef]** | Masterfont is a long-standing Israeli foundry (not re-checked). Simpler is a popular clean Hebrew sans in Israeli UI. **Designer not verified.** The brief's guess that Ellen Lupton designed it is almost certainly wrong: she is a US design writer and curator, not a Hebrew type designer. | Corporate/clean UI alternative | License terms and who designed it |
| **Hagilda (הגילדה)** | Israeli type collective, co-founded 2002 by Michal Sahar and Danny Meirav; co-created **Alef** (free, on Google Fonts) with Mushon Zer-Aviv [verified: https://fontsource.org/fonts/alef/about , https://luc.devroye.org/fonts-57645.html] | Retail families for a distinct brand voice | Catalog and licensing (not checked) |
| **Fontef** | **Verified:** independent Tel Aviv foundry founded by **Yanek Iontef in 1994** (designer of Frank Ruhl Libre and of the Hebrew in Open Sans). Exclusive distributor of **Zvi Narkiss's** classic Hebrew typefaces since 2019; its **Narkissim** revival (Regular, Bold) is on Adobe Fonts, which is cleared for personal and commercial use within Adobe's terms. Fontef sells other licenses on its own site [verified: https://fonts.adobe.com/foundries/fontef , https://fonts.adobe.com/fonts/narkissim , https://fontstand.com/foundries/fontef] | Classic/editorial Hebrew (Narkiss revivals) for Direction B | Fontef's own license terms for video/server rendering (not found) |
| **Hafontia** (Ben Nathan) | **Verified:** Ben Nathan drew the Hebrew of **Assistant** and **Fredoka** on Google Fonts [verified: https://fonts.google.com/specimen/Assistant/about , https://rightfontapp.com/family/fredoka]. Amatic SC's Hebrew attribution was not re-checked. | Retail families | Catalog and licensing |
| **Fontbit ("Fb"-prefixed families)**, **"Polin"** | **Still not verified.** I could not confirm Fontbit's catalog or which foundry makes "Polin". | | Search each foundry before relying on it |

**Licensing rule (design):** any font that appears **inside generated videos** (captions, titles, lower thirds) needs a license that allows **embedding in distributed video and server-side rendering for customers**. Many retail licenses are web-only. Start with Google Fonts (OFL), which allows this, and add commercial families later.

### 3.3 Pairings that look premium

| Role | Direction A, "בכורה" (dark cinema) | Direction B, "אור יום" (light editorial) | Paid upgrade |
|---|---|---|---|
| Hero display (very large words, numbers) | **Karantina 700** (poster-condensed), used for 1–3 words only | **Frank Ruhl Libre 900** | Almoni (bold/black) / Ploni Black |
| Headlines H1–H3 | **Heebo 800** (H1) / 700 (H2–H3) | **Frank Ruhl Libre 700** | Almoni / Ploni |
| UI and body | **Heebo 400/500/600** | **Assistant 400/600/700** | Ploni / Simpler |
| Numbers (credits, prices, timers) | Heebo with `tabular-nums` (Roboto-derived digits are typically tabular; verify) | Assistant with `tabular-nums` | n/a |
| Mono (timecodes, IDs, API) | **JetBrains Mono** or **IBM Plex Mono** (Latin only, which is fine because timecodes are LTR) | Same | n/a |
| In-video caption presets (Remotion) | Heebo 900, Secular One, Rubik 800, Karantina 700, Suez One, Rubik Glitch / Spray Paint | Same set | Licensed families |

**Mixing in a separate Latin font (optional, design):** list the Latin font *first* and the Hebrew font second, e.g. `font-family: "Inter", "Heebo", system-ui, sans-serif;`. Inter has no Hebrew glyphs (unverified-MK), so Hebrew falls through to Heebo while Latin and digits use Inter. Mismatched x-heights look cheap, so fix them with `size-adjust` in a custom `@font-face`, or simply **use the Hebrew family's own Latin** (Heebo, Assistant and Rubik all ship Latin). For an MVP, use one family per role.

### 3.4 Hebrew typesetting rules (implementation)

- **Line-height:**
  - Body 1.65–1.75. Hebrew letters have few ascenders and sit on a tall, even band, so dense setting looks heavy. Leave room for nikud if you use it.
  - Headlines 1.1–1.2.
  - Huge display (Karantina) 0.95–1.05.
  - Captions in video 1.15–1.25. (design; standard practice)
- **Body size:** 17–18px on desktop, 16–17px on mobile. Many Hebrew faces look smaller than Latin at the same px. (design)
- **No `letter-spacing` on Hebrew**, positive or negative. It breaks the texture, and per-letter spans break final forms ך ם ן ף ץ [S-05]. Tracking is fine on Latin-only labels and mono timecodes.
- **No `text-transform: uppercase`.** Hebrew has no case [S-06]. For emphasis use weight, color, a highlight box (`box-decoration-break: clone`) or an underline marker.
- **Avoid synthetic italics.** Hebrew has no native italic tradition, and the browser's faux-oblique looks broken. Never use `<em>` for styling; style `em` as `font-style: normal; font-weight: 700`.
- **Text animation:** split by **word**, never by character (Hebrew shaping and final letters) [S-05]. Configure React Bits / GSAP SplitText accordingly (`type: "words"`).
- **Wrapping:** use `text-wrap: balance` for headlines and `text-wrap: pretty` for paragraphs. Do not hyphenate (no Hebrew hyphenation convention [S-06]).
- **Numbers and units:** `font-variant-numeric: tabular-nums` for credits, timers and pricing tables. Format with `Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' })` [S-05]. Keep "₪" placement consistent site-wide.
- **Quotes and gershayim:** use the proper characters: ״ (gershayim, U+05F4) in abbreviations such as נדל״ן and ש״ח, and ׳ (geresh, U+05F3). A plain `"` inside Hebrew words can break JSON/HTML escaping and looks amateur.

---

## 4. RTL UI best practices (with code)

> Mechanics marked (unverified-MK) are long-standing browser and Material/Apple guidance. Tailwind and Radix specifics come from [S-05]. The 2026-10-13 pass verified the shadcn/Radix setup and **corrected the Tailwind `start-*`/`end-*` naming** (§4.1, §5.1).

### 4.1 Document and layout
- Set `<html lang="he" dir="rtl">` once in the root layout [S-05].
- **Only logical properties:** `margin-inline-start/end`, `padding-inline`, `inset-inline-start`, `border-inline-start`, `border-start-start-radius`, `text-align: start/end`. In Tailwind v4 these are `ms-* me-* ps-* pe-* inset-s-* inset-e-* text-start text-end border-s border-e rounded-s-* rounded-e-*`. **[corrected: https://tailwindcss.com/docs/top-right-bottom-left , https://releases.sh/tailwind-css/tailwind-css/changelog]** Tailwind **v4.2** added `inset-s-*` / `inset-e-*` (plus `inset-bs-*` / `inset-be-*`) for `inset-inline-start/end`, and the **v4.3** canonicalization rewrites the older `start-*` / `end-*` positioning utilities to `inset-s-*` / `inset-e-*`. The current docs use `inset-s-0`, `inset-e-4`. Use the `inset-s/e` names in new code. `ms/me/ps/pe` are unaffected. The `rtl:` / `ltr:` variants work on any utility but only when an ancestor (normally `<html>`) carries a `dir` attribute [verified-snippet: https://stevekinney.com/courses/tailwind/flexbox-multi-directional-layouts]. Lint-ban physical `ml- mr- pl- pr- left- right- text-left text-right` except in deliberate LTR zones [S-05].
- Use `gap-*` instead of `space-x-*` [S-05]. Flex and grid follow `dir` automatically.
- **Sidebar on the right (start)**, the primary action at the **end** of a dialog footer (left), and back navigation pointing **→** (right). (unverified-MK; this matches Material bidi guidance)

### 4.2 What to mirror, and what not to mirror (unverified-MK; see Material Design "Bidirectionality")

| Mirror (flip in RTL) | Do NOT mirror |
|---|---|
| Back/forward arrows, chevrons in breadcrumbs, "next step" arrows, pagination | **Media controls: ▶ play, ⏩ fast-forward, ⏮.** They represent tape direction, not reading direction. |
| Sidebar collapse icon, drawer slide direction, list indentation | **The video player progress bar and the editor timeline.** Keep them LTR (time flows left to right in every NLE: Premiere, CapCut). Wrap them in `dir="ltr"` and keep Hebrew labels inside. |
| Progress steppers (step 1 on the right) | Checkmarks, clocks, logos, brand marks, the ₪ sign |
| Carousels and marquees (start at the right) | Icons depicting real-world objects (a phone, a camera) |
| "Send" paper-plane icon (debatable; mirror it so it points toward the end) | Charts with numeric x-axes (keep them LTR, since numbers read LTR anyway [S-05]) |
| Undo/redo (swap visually: "undo" points to the end side) | Slash and division icons, the search magnifier (convention: do not flip) |

Tailwind implementation: `<ChevronLeft className="rtl:-scale-x-100" />`, or better, use **semantic names** in your icon wrapper (`<Icon name="next" />`) that resolve to ChevronLeft in RTL and ChevronRight in LTR.

### 4.3 Bidi: mixed Hebrew, numbers, English and brand names
- Wrap every run that may be LTR inside a Hebrew sentence in **`<bdi>`**: model names ("Veo 3.1"), prices ("₪49"), percentages, phone numbers, emails and English hooks ("POV:"). Otherwise punctuation and parentheses jump to the wrong side [S-06].
- Set **`dir="auto"`** on user-generated content (business names, prompts, hook text) [S-05].
- Add RLM (U+200F) after trailing punctuation that follows Latin text in the same line [S-06].
- **In-video captions:** Remotion (Chromium) with `direction: rtl; unicode-bidi: plaintext` per line [S-05][S-06]. Animate word-by-word highlights **right to left** [S-06].
- Never let image or video models render Hebrew text. Overlay all Hebrew in the render layer [S-06].

### 4.4 Forms
- **Phone, email, URL, coupon, credit-card, ח.פ./ע.מ. number:** `dir="ltr"` with **`text-end`** (in an LTR box, end = right), so the value is LTR but still aligned to the RTL form's edge. Add `inputMode="tel"`, `autoComplete="tel"` and so on. Labels stay Hebrew and RTL. (design)
- Israeli phone placeholder "050-123-4567". Accept `+972`, but display local format.
- Put the error message under the field with an icon plus text (not color alone), linked with `aria-describedby`. Write error messages in polite, gender-neutral Hebrew (use plural: "נא להזין…").
- **Gendered UI copy:** prefer plural or neutral forms ("בחרו נישה", "התחילו עכשיו"), or let users choose their form in their profile [S-06].

### 4.5 Carousels and marquees
- **Embla:** `useEmblaCarousel({ direction: 'rtl' })` with `dir="rtl"` on the viewport [S-05]. **Swiper:** `dir="rtl"` on the container (unverified-MK).
- **CSS marquee** (Magic UI's Marquee or your own), direction-aware:

```css
@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(calc(-50% - var(--gap)/2)) } }
[dir="rtl"] .marquee-track { animation-direction: reverse; } /* items enter from the end (left) */
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
.marquee:hover .marquee-track, .marquee:focus-within .marquee-track { animation-play-state: paused; }
```

### 4.6 Before/after slider in RTL
- With `react-compare-slider` (unverified-MK) or Aceternity "Compare", put the **"before"** state on the **right** (where the reader starts) and the **"after"** state on the left. Drag left reveals "after". Arrow keys: ← increases "after" in RTL. Test keyboard behavior and set `aria-valuetext` in Hebrew ("72% אחרי"). (design)

### 4.7 Video player in RTL
- Keep the control bar layout and scrubber **LTR** (wrap in `dir="ltr"`). Translate tooltips and aria-labels to Hebrew ("נגן", "השהה", "השתק", "כתוביות", "מסך מלא"). Captions track `srclang="he"`. (design, consistent with §4.2)
- Every **marketing** video with speech needs captions (WCAG 1.2.2). Autoplaying, looping or moving content over 5 s needs a pause control (2.2.2) [S-06].

### 4.8 Accessibility checklist that changes the design (WCAG 2.2 AA; Israeli IS 5568 baseline)
Legal context: IS 5568 is based on WCAG 2.0 AA under Regulation 35. Many consultants audit to 2.1/2.2 AA. Statutory damages can reach about ₪50,000 per claim without proof of damage [S-06, unverified-MK]. WCAG 2.2 success criteria are from the W3C Recommendation (Oct 2023, unverified-MK; https://www.w3.org/TR/WCAG22/).

| Requirement | Design implication |
|---|---|
| 1.4.3 contrast 4.5:1 (text), 1.4.11 3:1 (UI components, input borders, focus rings) | All palette pairs in §6 are pre-computed. **Input borders need the "strong border" token (≥3:1)**, not the decorative hairline. |
| 2.4.7 focus visible / 2.4.11 focus not obscured (AA, new in 2.2) | A 2px focus ring in the primary color plus a 2px offset. The sticky header and mobile CTA bar must not cover focused items: `scroll-padding-top: var(--header-h); scroll-padding-bottom: var(--cta-bar-h)`. |
| 2.5.8 target size ≥ 24×24 CSS px (AA, new in 2.2) | Chips, scene-card icon buttons and timeline handles are at least 32px (design). |
| 2.2.2 pause, stop, hide | A global "עצור אנימציות" toggle in the header and a ⏸ on every video wall. Persist it in localStorage. |
| 2.3.3 / `prefers-reduced-motion` | Swap the video wall for static posters, turn off Lenis, parallax and marquee motion, and replace transitions with ≤150 ms opacity fades. |
| 1.2.2 captions | Burned-in captions plus a `<track>`. Export SRT/VTT for customers, which is also a selling point for *their* IS 5568 compliance [S-06]. |
| 3.3.8 accessible authentication (AA, new in 2.2) | Allow paste into OTP fields and offer magic link / Google sign-in. |
| Skip link | "דלג לתוכן הראשי" as the first focusable element. |
| הצהרת נגישות page | Accessibility level, known gaps, coordinator contact [S-06]. **Do not rely on an overlay widget** [S-05][S-06]. |

---

## 5. React component libraries and resources (all unverified-MK unless tagged)

### 5.1 Foundations
| Library | Role | RTL status / notes | Where to verify |
|---|---|---|---|
| **Tailwind CSS v4** | Styling, CSS-first `@theme` tokens | Logical utilities plus `rtl:`/`ltr:` variants [S-05]. Use `inset-s-*` / `inset-e-*` rather than `start-*` / `end-*` from v4.2–4.3 on [corrected: https://tailwindcss.com/docs/top-right-bottom-left] (§4.1). | https://tailwindcss.com/docs |
| **shadcn/ui** | Copy-in components on Radix or Base UI. The new styles come in both flavors (e.g. `radix-nova`, `base-nova`) [verified: https://ui.shadcn.com/docs/rtl] | **[verified: https://ui.shadcn.com/docs/changelog/2026-01-rtl , https://ui.shadcn.com/docs/rtl]** First-class RTL support shipped in **January 2026** (Arabic, Hebrew, Persian are named). Details: (1) set **`rtl: true` in `components.json`**; the CLI then rewrites physical classes (`left-*`/`right-*`) to logical ones, adjusts directional props and text alignment, and flips supported icons with `rtl:rotate-180`. (2) The automatic CLI transform works only for projects created with **`shadcn create`** using the new styles (`base-nova`, `radix-nova`, …); other styles follow the migration guide. (3) For existing components, run **`shadcn migrate rtl`** (optionally with a path or glob). It is reportedly not fully idempotent, so run it once and review the diff [verified-snippet: https://www.assistant-ui.com/docs/rtl]. (4) Wrap the app in shadcn's **`DirectionProvider` with `direction="rtl"`** and set `dir="rtl"` plus `lang` on `<html>`. Framework-specific pages exist (`/docs/rtl/next`, `/docs/rtl/start`). | https://ui.shadcn.com/docs/rtl , https://www.radix-ui.com/primitives/docs/utilities/direction-provider |
| **Radix Primitives** | Accessible behaviors | **[verified: https://www.radix-ui.com/docs/primitives/utilities/direction-provider]** Wrapping the app in Radix's direction provider makes all primitives adjust to `dir`. The current docs import it from the **`radix-ui` umbrella package as `Direction.Provider dir="rtl"`**; the standalone `@radix-ui/react-direction` `DirectionProvider` (used in §9.1) is the older per-package import. A `useDirection` hook is also exported. The provider does not set the HTML attribute, so still set `dir` on `<html>` for CSS and Tailwind `rtl:` selectors [verified-snippet: https://www.assistant-ui.com/docs/rtl]. | radix-ui.com |
| **Lucide** (`lucide-react`) / **Phosphor** (`@phosphor-icons/react`, 6 weights incl. duotone) / **Tabler** | Icons | Flip directional icons only (§4.2). Phosphor duotone gives a premium feel in Direction A. | lucide.dev, phosphoricons.com |
| **Sonner** | Toasts | Set `dir="rtl"` and position `top-center` / `bottom-left` [S-05] | sonner.emilkowal.ski |
| **cmdk** | Command palette (⌘K "חפש נישה, הוק, פרויקט") | Set `dir` on the root | cmdk.paco.me |
| **react-hook-form + zod** | Wizard forms | Hebrew zod messages | |
| **TanStack Query** | Polling fallback for jobs (5 s) [S-05] | | |
| **dnd-kit** | Reordering scene cards | Horizontal sorting must account for RTL. Test it. | dndkit.com |

### 5.2 Motion and "premium" effects
| Library | Use it for | Notes |
|---|---|---|
| **Motion** (formerly Framer Motion; renamed late 2024, `import { motion } from "motion/react"`) | UI transitions, layout animations (wizard steps, scene cards), `AnimatePresence`, `useReducedMotion()` | The default motion library. Make x-offsets direction-aware (§9.4). https://motion.dev **[verified: https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion , https://motion.dev/docs/migration]** Framer Motion became the independent project **Motion on 12 Nov 2024**, covering React and vanilla JS. Framer is its first official sponsor. Migrate by installing `motion` and importing from `motion/react`; the upgrade guide reports no breaking changes for React in v12. |
| **GSAP** (+ ScrollTrigger, SplitText) | Scroll storytelling sections (the "how it works" pinned sequence) | **[verified, with a date correction: https://webflow.com/blog/gsap-becomes-free , https://gsap.com/blog/3-13/]** GSAP is **100% free for everyone, including commercial use and all former Club plugins (SplitText, MorphSVG and others)**. Webflow **acquired GSAP in fall 2024** (not 2025); the free-for-all announcement came with **GSAP 3.13 in 2025**. The `gsap-trial` npm package is deprecated, and the normal `gsap` package now contains every plugin [verified: https://npmjs.com/package/gsap-trial]. SplitText was rewritten: about 50% smaller, with built-in screen-reader accessibility and masking for reveal effects. The original team (Jack, Cassie, Rodrigo) still maintains it. Read the license text before launch. Use SplitText in **words** mode only for Hebrew. https://gsap.com |
| **Lenis** (darkroom.engineering, package `lenis`, `lenis/react`) | Smooth scroll on the marketing site only | Disable under reduced motion and inside the app (it fights scrollable panels). https://lenis.darkroom.engineering **[partly verified: https://npmjs.com/package/lenis , https://cdn.jsdelivr.net/npm/lenis@1.3.18/README.md]** The npm package is `lenis` by darkroom.engineering, and its README points to separate `lenis/react` docs. It also ships `lenis/snap`. GSAP integration: call `ScrollTrigger.update` on Lenis scroll events and drive Lenis from `gsap.ticker`. Versions seen in Oct 2026 are 1.3.x; a "v2" is mentioned by one aggregator but was not confirmed. |
| **Spline** (`@splinetool/react-spline`) | One optional 3D object (e.g. a floating clapperboard or film reel) | Lazy-load after LCP, use a poster image, skip on mobile. https://spline.design |
| **Magic UI** (magicui.design) | Marquee, Bento Grid, Number Ticker, Border Beam, Shine Border, Shimmer Button, Animated Beam, Blur Fade, Text Animate, Hero Video Dialog, iPhone/Safari mockups, Dot/Grid patterns, Particles, Magic Card | shadcn-registry install (`npx shadcn@latest add "https://magicui.design/r/<name>"`). Check each component for physical `left/right` classes and convert them. 2026 comparisons describe Magic UI as "polished and opinionated", built on Motion, with MIT-licensed free components and a paid Pro tier of templates [verified-snippet: https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026 , https://designrevision.com/alternatives/magic-ui]. |
| **Aceternity UI** (ui.aceternity.com) | Spotlight, Aurora/Background Beams, Lamp, **Placeholders and Vanish Input** (a perfect hero prompt box), **Compare** (before/after), Infinite Moving Cards, Hero Parallax, Container Scroll Animation, Focus Cards, Sticky Scroll Reveal, Floating Dock | Heavy effects; use 2–3 at most. Several assume LTR. 2026 comparisons describe Aceternity as focused on "dark, dramatic" 3D and glass effects, built on Motion, with copy-paste install; teams often pair a few Aceternity hero effects with Magic UI for the rest [verified-snippet: https://www.pkgpulse.com/guides/aceternity-ui-vs-magic-ui-vs-shadcn-animated-react-2026 , https://designrevision.com/alternatives/magic-ui]. |
| **Motion Primitives** (motion-primitives.com) | Text Effect, Text Shimmer ("מייצר…"), Animated Number / Sliding Number (credits), Morphing Dialog (template preview), Transition Panel (wizard), Progressive Blur, Infinite Slider, Glow Effect | Lightweight, Motion-based. |
| **React Bits** (reactbits.dev) | Backgrounds (Aurora, Silk, Iridescence, Light Rays, Dark Veil, Threads), Masonry, Circular/Dome gallery, Spotlight Card, Tilted Card, Shiny/Gradient/Blur Text | Text effects split by character by default, so **switch to words for Hebrew**. WebGL backgrounds need a static fallback. **2026 status [verified-snippet: https://www.pkgpulse.com/guides/react-bits-animated-components-2026 , https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026]:** described as the fastest-growing of the three (about 37K GitHub stars and 110+ components in one snapshot, vs about 28K for Aceternity and 20K for Magic UI). It installs through the **shadcn CLI**, has no hard Motion dependency (CSS animations, plus GSAP, Three.js or Matter.js only where needed), and has a paid **React Bits Pro** (https://pro.reactbits.dev). **License caution:** one source lists React Bits as MIT + Commons Clause. Verify this in the repo before shipping. |
| **Origin UI** | Large set of shadcn-style inputs, steppers, timelines, file upload, sliders | Reportedly moved under the coss.com umbrella in 2025 (unverified). |
| **Tremor** (acquired by Vercel, Jan 2025) | Usage and credits charts in billing and analytics | Recharts-based with no native RTL. Keep charts LTR [S-05]. |
| **Lottie / dotLottie, Rive** | Micro-animations (a clapperboard "rendering" loader, success confetti) | Rive suits an interactive "director" mascot. |

### 5.3 Video components
| Component | Use | Notes |
|---|---|---|
| **Remotion Player** (`@remotion/player`) | **Live preview in the wizard and editor.** Plays the exact composition that will be rendered, with no render cost [S-05]. | The core of the editor. Same props JSON as the render job [S-05]. |
| **Native `<video>`** + IntersectionObserver | Galleries, hover-play tiles, hero wall | `muted playsInline loop preload="none" poster=…`. Play only when ≥50% visible. Pause off-screen. |
| **Vidstack** (`@vidstack/react`) / **Media Chrome** | Full player for finished videos (custom skin, captions, keyboard) | Reportedly converging into **Video.js v10** (2025–2026). Check the current recommended package. https://vidstack.io , https://www.media-chrome.org |
| **Mux Player** (`@mux/mux-player-react`) | Only if you host on Mux Video (HLS, analytics) | Tied to Mux playback IDs. Probably overkill for an MVP that stores in Supabase or R2 [S-05]. |
| **wavesurfer.js** | Voice and music waveform previews | Keep the waveform LTR (it is a timeline). |

### 5.4 "Generation in progress" patterns
- **Stage stepper** fed by Supabase Realtime Broadcast (`job:{id}`) with a 5 s polling fallback [S-05]. Stages in Hebrew: תסריט → קריינות → סצנות → מוזיקה → הרכבה → מוכן.
- **Streaming text first.** The script and hook variants stream token by token (Vercel AI SDK via OpenRouter [S-05]) while the slow video jobs queue. The user reads and edits instead of watching a spinner.
- **Scene cards with live states:** `queued` (skeleton with shimmer) → `generating` (blurred keyframe image from the image model, an animated border beam, and "~40 שנ׳") → `ready` (the clip autoplays muted) → `failed` (a red outline, "נסו שוב", and "הקרדיטים הוחזרו" [S-01]).
- **ETA and permission to leave:** "אפשר לסגור את החלון. נשלח לכם מייל ו-WhatsApp כשהסרטון מוכן" (email via Resend [S-05]).
- **Queue card** in the dashboard: thumbnail, stage, % progress, cancel button and credits reserved.
- **Skeletons** match final geometry (9:16 cards, text lines of real lengths). Never use a generic spinner for more than 1 s.

---

## 6. Proposed design system: two alternative visual directions

> Everything in §6 is **(design)**. The contrast ratios were computed in this run with the WCAG 2.x formula.

### 6.0 Shared foundations (both directions)
- **Grid:** 12 columns, max content width 1240px (marketing) and fluid (app). Gutters are 24px desktop and 16px mobile. Section vertical rhythm is 96–128px desktop and 64–80px mobile.
- **Breakpoints:** 390 (mobile baseline), 768, 1024, 1280, 1536.
- **Spacing scale (px):** 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- **Type scale** (fluid; Hebrew-tuned line heights):

| Token | Size | Line-height | Weight (A / B) |
|---|---|---|---|
| `display` | `clamp(3.25rem, 2rem + 6vw, 7.5rem)` | 0.98 | Karantina 700 / Frank Ruhl 900 |
| `h1` | `clamp(2.25rem, 1.6rem + 3vw, 4.25rem)` | 1.08 | Heebo 800 / Frank Ruhl 700 |
| `h2` | `clamp(1.75rem, 1.3rem + 2vw, 3rem)` | 1.15 | Heebo 700 / Frank Ruhl 700 |
| `h3` | `clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem)` | 1.25 | Heebo 700 / Assistant 700 |
| `body-lg` | 1.1875rem (19px) | 1.7 | 400 |
| `body` | 1.0625rem (17px) | 1.7 | 400 |
| `small` | 0.9375rem (15px) | 1.6 | 400/500 |
| `micro` (labels, badges) | 0.8125rem (13px) | 1.4 | 600 |

- **Z-layers:** base 0, sticky 40, dropdown 50, overlay 60, modal 70, toast 80.
- **Aspect tokens:** `--ar-reel: 9/16`, `--ar-feed: 4/5`, `--ar-square: 1/1`, `--ar-wide: 16/9`, `--ar-cine: 2.39/1` (decorative letterbox).
- **Motion tokens:** see each direction. Shared rules:
  1. UI feedback ≤ 200 ms.
  2. Entrances 320–600 ms, scroll reveals **once**, stagger 40–60 ms.
  3. Never animate layout during typing.
  4. Under reduced motion, everything becomes ≤ 150 ms opacity.
  5. Horizontal entrance offsets are **direction-aware**: the inline-start offset is `+x` in RTL.

### 6.1 Direction A: "בכורה" (Premiere), dark cinematic (recommended)

**Mood:** a premiere night in a Tel Aviv cinema. A black hall, the projector's gold beam, red-carpet rose, a violet afterglow, 35mm grain, letterboxed film stills.

**Palette (hex, with contrast on the main background #08080C):**

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#08080C` | Page background | n/a |
| `--surface-1` | `#121219` | Cards, nav glass base | n/a |
| `--surface-2` | `#1A1A24` | Raised cards, inputs | n/a |
| `--surface-3` | `#23232F` | Hover, selected | n/a |
| `--border` | `#2A2A38` | Decorative hairlines only | 1.42 (decorative) |
| `--border-strong` | `#686884` | Input borders, toggles (UI ≥3:1) | 3.46 on s1, 3.21 on s2 |
| `--text` | `#F5F4F0` | Primary text (warm white) | 18.17 |
| `--text-2` | `#A3A3B5` | Secondary text | 8.06 (7.51 on s1, 6.95 on s2) |
| `--text-muted` | `#8A8AA0` | Captions, meta | 5.93 (5.53 on s1, 5.11 on s2) |
| `--primary` (projector gold) | `#FFB547` | Primary CTA fill, focus ring, key highlights | 11.38 as text on bg |
| `--on-primary` | `#0A0A0F` | Text on gold buttons | 11.24 on gold |
| `--primary-hover` | `#FFC56B` | | ink 12.65 |
| `--rose` | `#FF4F7B` | Secondary accent, "live" and "REC" dots, glow | 6.34 |
| `--violet` | `#8E7BFF` | Tertiary glow, links on dark, AI-state shimmer | 6.12 |
| `--success` | `#3DDC97` | | 11.31 |
| `--danger` | `#FF6B6B` | | 7.20 |
| `--grain-opacity` | `0.05` | Noise overlay | n/a |

**Signature gradients and effects:**
- **Projector beam:** `radial-gradient(60% 50% at 70% 0%, rgba(255,181,71,.18), transparent 70%)` placed top-left in RTL (the "end" side, behind the video wall).
- **Afterglow:** `radial-gradient(40% 40% at 20% 80%, rgba(255,79,123,.14), transparent), radial-gradient(35% 35% at 85% 70%, rgba(142,123,255,.12), transparent)`.
- **Gold text highlight for the key word in H1:** `background: linear-gradient(180deg,#FFD58A,#FFB547 60%,#E8902A); -webkit-background-clip:text; color:transparent`. Use it on one word only, e.g. "תדמית".
- **Glass nav:** `background: rgba(18,18,25,.6); backdrop-filter: blur(16px) saturate(140%); border-bottom: 1px solid rgba(255,255,255,.06)`.
- **Grain:** a fixed full-screen `::after` with an SVG `feTurbulence` (baseFrequency .8, numOctaves 2) data-URI at 5% opacity and `mix-blend-mode: overlay`. Set `pointer-events: none` and turn it off under `prefers-reduced-transparency` if available.
- **Film frame cards:** video tiles get `border-radius: 14px`, a 1px inner border `rgba(255,255,255,.08)` and, on hover, a gold "border beam" (Magic UI Border Beam).
- **Letterbox reveal:** hero or showcase videos enter with black bars that shrink from 2.39:1 to the final ratio (GSAP, 600 ms).

**Typography:** Karantina 700 (display words), Heebo 800/700 (headings), Heebo 400–600 (UI/body), JetBrains Mono (timecodes). Paid upgrade: Almoni.

**Radii:** `--r-xs 6px` (badges), `--r-sm 10px` (inputs, chips), `--r-md 14px` (cards, video tiles), `--r-lg 20px` (panels, modals), `--r-xl 28px` (hero prompt box), `--r-pill 999px` (CTA buttons, credit meter).

**Shadows and glows (dark UIs use glow plus border rather than drop shadow):**
- `--shadow-1: 0 1px 0 rgba(255,255,255,.04) inset, 0 1px 2px rgba(0,0,0,.6)`
- `--shadow-2: 0 8px 24px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.05) inset`
- `--shadow-3: 0 24px 64px rgba(0,0,0,.6)`
- `--glow-primary: 0 0 0 1px rgba(255,181,71,.5), 0 8px 32px rgba(255,181,71,.25)` (primary CTA hover)
- `--glow-ai: 0 0 0 1px rgba(142,123,255,.45), 0 0 40px rgba(142,123,255,.2)` (generating state)

**Motion principles:** "the camera moves, not the furniture."
- Easing: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`. Spring for UI: `{ type: "spring", stiffness: 380, damping: 32 }`.
- Durations: 120 ms (hover), 200 ms (press, toggle), 320 ms (panels), 600 ms (hero reveals), 900 ms (letterbox).
- Signature moves: a slow (40–60 s per loop) vertical video-wall drift, a letterbox reveal, a gold "projector sweep" shimmer on the primary CTA every 6 s (paused under reduced motion), and number tickers for counters.
- Forbidden: bouncing, rotating 3D cards on every element, and per-letter Hebrew animation.

**Imagery style:**
- Real Israeli business scenes, generated or shot: a hairdresser in Florentin, a dental clinic, a falafel stand, a renovation site. Use warm practical light and a shallow depth of field.
- Always **9:16 phone frames with Hebrew captions burned in**, to prove Hebrew quality.
- No AI-generated Hebrew text inside images [S-06].
- No "AI brain / robot" clichés.

### 6.2 Direction B: "אור יום" (Daylight), warm editorial light

**Mood:** a Tel Aviv design-studio morning. Off-white paper, ink, an ultramarine stamp, coral and lemon highlighter marks like a creative director's storyboard.

**Palette (contrast on `--bg` #FAF7F2 unless noted):**

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#FAF7F2` | Page background (warm paper) | n/a |
| `--surface-1` | `#FFFFFF` | Cards | n/a |
| `--surface-2` | `#F1ECE4` | Sunken areas, chips | n/a |
| `--border` | `#E4DDD1` | Decorative hairlines | 1.26 (decorative) |
| `--border-strong` | `#8C8577` | Input borders (UI ≥3:1) | 3.43 on bg, 3.66 on white |
| `--text` (ink) | `#16140F` | Primary text | 17.22 (18.40 on white) |
| `--text-2` | `#5A554C` | Secondary | 6.92 (6.29 on s2) |
| `--text-muted` | `#6F6A60` | Meta | 5.03 (5.38 on white) |
| `--primary` (ultramarine) | `#1F3DFF` | CTA fill, links, focus ring | 6.20 as text; white-on-blue 6.63 |
| `--on-primary` | `#FFFFFF` | | 6.63 |
| `--coral` | `#FF7A59` | Accent fills **with ink text** (ink on coral 7.17; white on coral fails) | n/a |
| `--coral-text` | `#C2410C` | Coral used as text | 4.85 |
| `--lemon` | `#FFE14D` | Highlighter behind key words, "hook" badges (ink on lemon 14.14) | n/a |
| `--success` | `#0B7A53` | | 5.01 |
| `--danger` | `#C62F1D` | | 5.14 |

**Signature effects:**
- A **highlighter marker** under key Hebrew words: an SVG path or a `linear-gradient(transparent 60%, #FFE14D 60%)` with `box-decoration-break: clone`.
- **Storyboard paper cards** with a subtle 1px border and a soft shadow, plus "taped" corners on hero tiles.
- Hand-drawn arrows (Playpen Sans Hebrew annotations) pointing from a hook to a video.
- A large ink-black **footer band** as the dark counterpoint.

**Typography:** Frank Ruhl Libre 900/700 (display, headings), Assistant 400–700 (UI/body), Playpen Sans Hebrew (annotations only). Paid upgrade: Ploni.

**Radii:** `6 / 8 / 12 / 16 / 24 / pill`. Slightly tighter than A, for a print feel.

**Shadows:** `--shadow-1: 0 1px 2px rgba(22,20,15,.06)`, `--shadow-2: 0 6px 20px rgba(22,20,15,.08)`, `--shadow-3: 0 20px 50px rgba(22,20,15,.12)`, and a hover lift of `translateY(-2px)`.

**Motion principles:** "paper and ink."
- Shorter and calmer: 150 / 250 / 400 ms with `cubic-bezier(.2,.8,.2,1)`.
- Highlighter strokes draw in (`stroke-dashoffset`, 500 ms) when a section enters.
- Cards slide 12px from inline-start.
- Use no glows. Use no WebGL backgrounds.

**Imagery style:** daylight, bright natural color, phone mockups on paper backgrounds, owner portraits (with consent), and a sticker-style niche icon set (Phosphor duotone recolored to ink and coral).

### 6.3 Which to choose
| Criterion | A, "בכורה" | B, "אור יום" |
|---|---|---|
| Video pops / premium feel | ★★★ | ★★ |
| Friendliness for non-tech SMB owners (cosmetics, contractors) | ★★ | ★★★ |
| Differentiation from global AI-video sites (which are mostly dark or purple) | ★★ (gold instead of purple helps) | ★★★ |
| Long-form SEO readability (hooks and niche pages) | ★★ | ★★★ |
| Effort / performance | Heavier (video, glow, grain) | Lighter |

**Recommendation (design):** use **A** as the brand and app default, with a complete **light theme** that borrows B's paper background and ink text but keeps A's gold primary as a button fill with ink text (11.24:1). For gold-colored *text* on light, use dark amber `#9A5B00` (5.08:1 on #FAF7F2, 5.43:1 on white); the lighter `#B86E00` fails at 3.73:1. Alternatively, ship B if you position the product as "the friendly Israeli SMB tool". Test both with 5 to 10 target SMB owners using a static hero mock.

### 6.4 Tokens as code (Tailwind v4, Direction A, with light-mode overrides)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: var(--font-heebo), system-ui, sans-serif;
  --font-display: var(--font-karantina), var(--font-heebo), sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  --color-bg: #08080C;
  --color-surface-1: #121219;
  --color-surface-2: #1A1A24;
  --color-surface-3: #23232F;
  --color-border: #2A2A38;
  --color-border-strong: #686884;
  --color-text: #F5F4F0;
  --color-text-2: #A3A3B5;
  --color-muted: #8A8AA0;
  --color-primary: #FFB547;
  --color-primary-hover: #FFC56B;
  --color-on-primary: #0A0A0F;
  --color-rose: #FF4F7B;
  --color-violet: #8E7BFF;
  --color-success: #3DDC97;
  --color-danger: #FF6B6B;

  --radius-xs: 6px; --radius-sm: 10px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px;

  --ease-out: cubic-bezier(.22,1,.36,1);
  --ease-in-out: cubic-bezier(.65,0,.35,1);
}

:root { color-scheme: dark; }
html { scroll-padding-top: 80px; scroll-padding-bottom: 88px; }
body { background: var(--color-bg); color: var(--color-text); font-size: 1.0625rem; line-height: 1.7; }
h1,h2,h3 { text-wrap: balance; letter-spacing: 0; }
p { text-wrap: pretty; }
em { font-style: normal; font-weight: 700; }
.num { font-variant-numeric: tabular-nums; }
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 6px; }

/* light mode (user toggle or OS) */
[data-theme="light"] {
  color-scheme: light;
  --color-bg: #FAF7F2; --color-surface-1: #FFFFFF; --color-surface-2: #F1ECE4; --color-surface-3: #E9E2D7;
  --color-border: #E4DDD1; --color-border-strong: #8C8577;
  --color-text: #16140F; --color-text-2: #5A554C; --color-muted: #6F6A60;
  --color-primary-text: #9A5B00; /* gold as TEXT on light: 5.08:1 on paper; gold #FFB547 stays the button FILL with ink text */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: 150ms !important; scroll-behavior: auto !important; }
}
```

```ts
// app/fonts.ts (next/font; subsets per [S-05])
import { Heebo, Karantina, JetBrains_Mono } from "next/font/google";
export const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo", display: "swap" });
export const karantina = Karantina({ subsets: ["hebrew", "latin"], weight: ["700"], variable: "--font-karantina", display: "swap" });
export const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
```

---

## 7. Landing-page blueprint (section by section)

> (design) Hebrew copy is a suggested draft that uses plural or neutral forms. The brand name is a placeholder, **[שם]**.
> Layout notes use RTL terms: "start" is right, "end" is left.

### 7.0 Global page rules
- `<html lang="he" dir="rtl">`, skip link, a sticky glass header (64px) and a mobile sticky CTA bar (72px).
- **Performance budget:**
  - LCP element = the **H1 text**, not video. Target LCP < 2.5 s on 4G.
  - Hero media loads **after** first paint: posters are AVIF at ≤ 40 KB each, and clips are 540×960 H.264 at ≤ 1.2 MB, 4–6 s loops, with WebM/AV1 alternatives.
  - Play only the clips that are visible. Pause them on `visibilitychange`.
- A global "עצור אנימציות" toggle (WCAG 2.2.2) in the header's utility menu.

### 7.1 Announcement bar (optional, 36px)
- Example: "חדש: ספריית 1,000 הוקים בעברית לפי נישה ←" (the arrow is mirrored, pointing to the end). Dismissible (×).

### 7.2 Header
- **Start (right):** logo (wordmark plus a small clapperboard or gold-beam icon).
- **Center:** nav links: איך זה עובד · נישות · ספריית הוקים · דוגמאות · מחירים · בלוג.
- **End (left):** "התחברות" (ghost) plus "צרו סרטון בחינם" (gold pill).
- Behavior: transparent at the top, glass after 24px of scroll. On mobile, a hamburger opens a full-screen sheet from the start side (`side="right"` [S-05]).

### 7.3 Hero (above the fold)
- **Layout (desktop):** a 12-column grid.
  - **Start columns 1–6 (right): copy and input.**
  - **End columns 7–12 (left): a video wall** of 3 vertical marquee columns of 9:16 videos (column 1 drifts up, column 2 down, column 3 up; 45 s per loop; top and bottom fade masks). Each tile shows a niche label chip ("מספרה", "נדל״ן", "מרפאת שיניים") and burned-in Hebrew captions. The gold projector-beam glow sits behind it.
- **Mobile:** copy first, then a single horizontal RTL marquee row of 9:16 tiles at 60% width, then the input.
- **Copy:**
  - Eyebrow chip: "AI · עברית מלאה · מותאם לנישה שלכם"
  - H1 (Heebo 800, gold-gradient word): "סרטון **תדמית** מקצועי לעסק שלכם, בלי עורך וידאו."
  - Sub (text-2, 19px): "בוחרים נישה, מדביקים קישור לאתר או לאינסטגרם, ומקבלים סרטון תדמית ורילס עם הוקים שעובדים, קריינות וכתוביות בעברית. תוך דקות, לא שבועות."
- **Hero input card** (radius 28px, surface-1 glass, glow on focus):
  1. A **niche combobox** ("מה העסק שלכם?") with icon chips for the 8 most popular niches, plus "עוד נישות…".
  2. A **URL field** (`dir="ltr"`, `text-end`) with the placeholder "האתר או האינסטגרם שלכם", and a toggle link "אין לי אתר: אתאר במילים", which swaps in a textarea with an animated rotating placeholder (Aceternity "Placeholders and Vanish Input" style; rotation stops under reduced motion).
  3. The **CTA** "צרו את הסרטון הראשון שלי" (gold pill, 56px tall) with an inline cost hint: "חינם · ללא כרטיס אשראי".
- **Trust micro-row** under the card (icons plus text, 13px): "2 סרטונים ראשונים בחינם" · "מחירים בשקלים כולל מע״מ" · "חשבונית מס" · "החזר קרדיטים אוטומטי על יצירה שנכשלת". The ILS/VAT/invoice combination answers Cadabra's USD-only weakness [S-01]. Auto-refund parity with Cadabra [S-01].
- **Controls:** a ⏸/▶ button at the wall's bottom-end corner ("עצרו את הווידאו"). Captions are burned in, so muted autoplay is fine.

### 7.4 Engines and logos strip
- "מופעל על ידי מנועי ה-AI המובילים בעולם": a horizontal marquee (RTL) of wordmarks, e.g. Veo 3.1, Kling 3.0, Seedance 2.0, Hailuo, ElevenLabs (the OpenRouter roster is in [S-04]). Monochrome at 60% opacity; full color on hover.
- If customer logos exist, put a second row underneath: "עסקים שכבר יוצרים איתנו". Use only real customers.
- Legal: nominative use of third-party marks only. Check each brand's guidelines.

### 7.5 "Pick your niche" interactive showcase (the differentiator)
- H2: "כל נישה מקבלת סרטון שנבנה בשבילה"
- **Layout:** a **niche tab rail** at the top: horizontally scrollable RTL chips with icons (30–60 niches from [S-06]: מספרה, קוסמטיקאית, נדל״ן, עורך דין, מסעדה, מאמן כושר, קבלן שיפוצים, מרפאת שיניים, חנות אונליין, צימר, בית קפה, יועץ משכנתאות, גן אירועים…). The selected niche shows:
  - **Start:** 3 hook cards (lemon "הוק" badge, archetype tag such as "טעויות" / "POV" / "לפני-אחרי" from [S-06] §5.2, a copy button, and "צרו סרטון מההוק").
  - **End:** a 9:16 phone frame playing that niche's example video, plus 2 smaller 1:1 and 16:9 variants underneath ("אותו סרטון, 3 פורמטים").
- Transition: Motion `AnimatePresence` crossfade of 250 ms. The URL updates to `?niche=dental` for shareability.
- CTA: "לכל ההוקים של [נישה] ←", linking to `/hooks/[niche]` (SEO page).

### 7.6 How it works (3 steps, pinned scroll on desktop)
- H2: "מעסק לסרטון ב-3 צעדים"
- GSAP ScrollTrigger pins a phone frame on the end side. The steps scroll on the start side, and each step swaps the phone screen:
  1. "ספרו לנו על העסק": the URL turns into a brand card (logo, colors and services auto-extracted [S-02][S-03]).
  2. "בחרו הוק וסגנון": a hook picker, style thumbnails and a voice sample with play.
  3. "קבלו סרטון מוכן": the render completes and the video plays with Hebrew captions; download buttons for 9:16, 1:1 and 16:9.
- On mobile and under reduced motion: three stacked cards with static screenshots.

### 7.7 Before/after: "the editor math"
- Left/right split with a **before/after slider** (RTL rules in §4.6). Before (right) is raw phone clips and photos from the business; after (left) is the finished reel.
- Underneath, a **savings calculator**:
  - Sliders: "כמה סרטונים בחודש?" (1–30) and "כמה אתם משלמים היום לסרטון?" (default ₪550, the price of a pro-edited Reel per an Israeli source [S-01] https://natigold.com/promotional-video/).
  - Output: "חיסכון חודשי משוער: ₪X" using an animated number ticker.
  - Add a footnote with sources and assumptions. A promo video in Israel typically costs ₪15,000–35,000 for an SMB [S-01] (https://www.extra.co.il/corporate-video-pricing-2026/).
- Copy: "עורך וידאו: 3–7 ימים ומאות שקלים לסרטון. כאן: דקות, וקרדיטים." Keep every claim defensible.

### 7.8 Feature bento grid (6–8 tiles)
- H2: "כל מה שעורך הווידאו עשה, עכשיו אוטומטי"
- Tiles, each with a looping micro-demo:
  1. **Large (2×2): "כתוביות בעברית שנראות נכון"**: animated RTL word-by-word captions with style presets (Heebo, Secular One, Rubik Spray…).
  2. **"קריינות בעברית"**: voice cards with waveforms and play buttons (ElevenLabs v4 Hebrew [S-04] https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4).
  3. **"ערכת מותג"**: logo, colors and fonts applied to intro, outro and lower thirds.
  4. **"הוקים לפי נישה"**: stacked hook cards.
  5. **"3 פורמטים בלחיצה"**: 9:16, 1:1 and 16:9 frames morphing (Motion layout).
  6. **"עריכה בסצנות"**: storyboard cards being reordered.
  7. **"קרדיטים שקופים"**: a cost preview chip plus "החזר אוטומטי על כישלון" [S-01].
  8. **"תווית תוכן AI ועמידה בכללים"**: a compliance flags badge per niche [S-06].
- Style: surface-1 tiles, a Magic Card spotlight hover (cursor glow) on desktop only, and a Border Beam on the large tile.

### 7.9 Hooks library teaser (SEO funnel)
- H2: "ספריית ההוקים הגדולה בעברית"
- Two RTL marquee rows of hook cards moving in opposite directions (paused on hover and focus). Each card shows the hook text (Heebo 700, 20px), niche, archetype and platform icons, and a copy button.
- A search input: "חפשו הוק לפי נישה…", which navigates to `/hooks?q=`.
- CTA: "לספרייה המלאה (חינם)". Hook libraries are a proven lead magnet, and none exist in Hebrew [S-02].

### 7.10 Showcase gallery
- A masonry grid (React Bits Masonry or CSS columns) of 12–18 videos with filters: נישה · פורמט · מטרה (תדמית / רילס / מבצע / המלצה / גיוס עובדים [S-06]).
- **Hover-play** on desktop. On mobile, tap opens a full-screen player sheet with "צרו סרטון כזה" (template deep link).
- Every tile shows the niche, the length and "נוצר ב-X דקות" (only if measured).

### 7.11 Testimonials and proof
- A case-study carousel (Embla RTL): owner photo, business, quote, and a ₪ outcome ("חסכנו ₪2,400 בחודש על עריכה"). Use real testimonials only; fake testimonials are prohibited [S-06].
- A counter row (number ticker, `<bdi>`): videos created, businesses, niches, hooks. Use true figures only.

### 7.12 Pricing
- H2: "מחירים פשוטים, בשקלים"
- A monthly/annual toggle (annual "חסכו 20%"), and a "חבילות חד-פעמיות" tab for people who don't want a subscription (Cadabra sells packs only [S-01]).
- **4 cards** (the plan names and numbers are placeholders for the pricing research):
  - "חינם" (2 videos with a watermark)
  - "עסק"
  - "צמיחה" (highlighted with a gold border and a "הכי פופולרי" badge)
  - "סוכנות" (client workspaces)
- Each card shows: the price **₪ incl. VAT** in large tabular numerals, the "≈ N סרטונים בחודש" translation of credits, a feature list with check icons (not mirrored), and a CTA.
- Under the cards:
  - a **credit cost table** per output type ("רילס 15 שנ׳ ≈ X קרדיטים", "סרטון תדמית 60 שנ׳ ≈ Y")
  - the promises: "קרדיטים לא פגים / עוברים לחודש הבא", "החזר אוטומטי", "ביטול בלחיצה", "חשבונית מס"
  - a payment logos row (credit cards, Bit), per local payment practice [S-05][S-06].
- These answer the most common competitor complaints: confusing or expiring credits and hard cancellation [S-02].

### 7.13 FAQ
- An accordion with 8–12 questions and FAQPage JSON-LD. Suggested questions:
  - "האם הסרטונים שלי?"
  - "איך עובדים הקרדיטים?"
  - "מה קורה אם יצירה נכשלת?"
  - "האם הקריינות נשמעת טבעית בעברית?"
  - "אפשר להעלות צילומים שלי?"
  - "איך מבטלים?"
  - "האם צריך לסמן שהסרטון נוצר ב-AI?"
  - "יש חשבונית מס?"
  - "האם יש התאמה לנגישות?"

### 7.14 Final CTA band
- Full-width with a strong projector-beam glow (A) or the ink band (B).
- H2 (display font): "הסרטון הבא של העסק שלכם מוכן בעוד 5 דקות."
- A repeat of the niche combobox and CTA.

### 7.15 Footer
- 4–5 columns:
  - Product
  - **Niches** (internal SEO links to `/niches/[slug]`)
  - **Hooks** (to `/hooks/[slug]`)
  - Resources (blog, Hebrew guides)
  - Company and legal: תנאי שימוש, מדיניות פרטיות, מדיניות ביטול והחזרים, **הצהרת נגישות**, מדיניות שימוש הוגן ב-AI [S-06]
- Social and WhatsApp links, and a newsletter signup with a separate unchecked marketing-consent checkbox (anti-spam law [S-06]).

### 7.16 Mobile sticky CTA bar
- 72px tall, glass. Start: "צרו סרטון חינם" (gold). End: a WhatsApp icon button ("דברו איתנו"). It appears after the hero leaves the viewport and hides when the footer is visible. `scroll-padding-bottom` makes sure focused elements are never hidden (WCAG 2.4.11).

### 7.17 Other public templates (same system)
- `/hooks` and `/hooks/[niche]`: an H1 such as "הוקים לסרטונים ל[נישה]", filters (archetype, platform, gender form, season [S-06]), hook cards, "צרו סרטון מההוק", and a related-niches block. Use ISR [S-05].
- `/niches/[niche]`: a niche landing page with a hero video for the niche, a "סרטון תדמית ל[נישה]" section, 3 example scripts, hooks, pricing and FAQ.
- `/templates/[slug]`, `/blog/[slug]` (Direction B typography for long reads), `/compare/[competitor]` ("X מול [שם]" SEO pages [S-02]).

---

## 8. App-screen blueprints

### 8.1 App shell
- **Desktop:**
  - **Start (right):** a collapsible sidebar, 248px or 72px collapsed. Items: בית · סרטון חדש (primary) · פרויקטים · תבניות · ספריית הוקים · ערכת מותג · נכסים (מדיה) · לוח תוכן (later) · צוות ולקוחות (agency) · חיוב וקרדיטים · הגדרות.
  - **Top bar:**
    - a workspace switcher (agency clients) at the start
    - a global search (⌘K, cmdk) in the center
    - at the end, the **credits meter pill** ("⚡ 240" with a ring showing the % of the monthly allowance; click opens a popover with usage, the top-up CTA and the cost table), notifications, a theme toggle and an avatar menu.
- **Mobile:** a bottom tab bar (בית · פרויקטים · **＋** · הוקים · חשבון), where ＋ opens the wizard as a full-screen flow.
- A **low-credit state**: the pill turns rose at < 15% and a dismissible banner offers a top-up. Never block an in-progress job.

### 8.2 Home / dashboard
- A hero card: "שלום [שם] 👋, מה יוצרים היום?" with a niche-aware quick start: 3 big buttons, "סרטון תדמית", "רילס עם הוק" and "מבצע / חג", plus a "הוק השבוע לנישה שלכם" card.
- **In-progress queue** (when jobs exist): horizontal cards with a thumbnail, stage, progress bar, ETA and a cancel button.
- **Recent projects:** a 9:16 grid with hover-play, status badges (טיוטה / בתהליך / מוכן / נכשל: הקרדיטים הוחזרו) and a kebab menu (שכפל, הורד, שתף לאישור לקוח, מחק).
- **Upcoming holidays:** a rail of "חגים קרובים" with hooks two weeks ahead, plus memorial-day guards [S-06].

### 8.3 New-video wizard (the core flow)
- **Layout (desktop):**
  - **Start (right) 7 columns:** the step content.
  - **End (left) 5 columns:** a sticky **live phone preview** (Remotion Player at 9:16, with a 1:1 / 16:9 toggle) that updates on every choice, a "≈ X קרדיטים" cost estimate, and estimated length.
  - **Top:** a horizontal stepper (step 1 at the right), clickable for completed steps.
  - **Bottom bar:** "הקודם" (start side, → icon) and "המשך" (end side, ← icon; primary).
  - State autosaves on each step (a draft project).
- **Mobile:** the steps run full screen, and the preview collapses into a floating mini-phone (tap to expand into a bottom sheet).

| # | Step | UI | Notes |
|---|---|---|---|
| 1 | **העסק שלכם** | A URL field (LTR) with a "נתחו" button. Extracted results appear as an **editable brand card**: logo, colors (swatches), name, services (chips), city, phone (LTR) and tone. Fallback: "אין אתר? מלאו ידנית". | URL to brand DNA is the market's standard [S-02][S-03]. Stream the extraction progress in text lines ("מצאנו לוגו ✓", "זיהינו 3 שירותים ✓"). |
| 2 | **נישה** | A large icon grid with search (30–60 niches), pre-selected from step 1. Show "שימו לב: כללי פרסום לנישה" compliance flags (medical, legal, finance) [S-06]. | The niche preloads hooks, script structure, music mood and CTA conventions [S-03]. |
| 3 | **מטרה ופורמט** | Goal cards: תדמית / רילס / מבצע / המלצה / השקה / גיוס עובדים. Duration chips 15 / 30 / 60 s. Platform presets (Reels, TikTok, Feed 4:5, YouTube 16:9). An "all 3 formats" toggle. | Goal × duration sets the narrative skeleton (hook 0–2 s, value, proof, CTA) [S-03]. |
| 4 | **הוק** | 6–10 generated hook cards for this niche, plus a "מהספרייה" tab. Each card shows the archetype tag, a strength meter (a heuristic "חוזק ההוק"), gender-form and register toggles (זכר / נקבה / רבים; רשמי / חם / סלנג) [S-06], and "צור עוד" / "כתבו בעצמכם". Multi-select creates variants ("3 הוקים = 3 גרסאות"), with the cost shown. | Hook variants for A/B testing are a top-15 market pattern [S-02][S-03]. |
| 5 | **תסריט** | A streamed script, split into **scenes** with a time code chip each (LTR timecodes in mono). Inline editing, a "שכתב" menu per scene (קצר יותר / אנרגטי יותר / רשמי יותר), and a word counter vs duration (Hebrew TTS speed ≈ words per second; calibrate). | A structured JSON storyboard comes from the LLM through OpenRouter [S-04]. |
| 6 | **סגנון** | Visual style thumbnails with hover-play: UGC, cinematic, "יום בעסק", לפני-אחרי, מוצר, טקסט-אנימציה, and an avatar presenter (premium). A media-source toggle: "צילומים שלי" (upload; animate photos via image-to-video) / "B-roll AI" / stock. Quality mode: טיוטה / סטנדרט / פרימיום, mapped to model tiers and shown as a cost delta. | Hide model names behind quality modes, with an "מתקדם" disclosure for power users [S-03]. Model prices are in [S-04]. |
| 7 | **קול** | Voice cards (gender, age, tone), each with a play sample of *their own script's first line* (generated on demand at small cost, or use a cached generic sample). Speed slider. A "תקן הגייה" dictionary link [S-06]. A no-voice option (captions plus music only). | Hebrew TTS via ElevenLabs v4 or Gemini TTS through OpenRouter [S-04]. |
| 8 | **מוזיקה** | Mood chips (אנרגטי / חם / יוקרתי / מצחיק / רגוע), a track list with waveforms (LTR) and play buttons, and a ducking-under-voice toggle. | Music via Lyria on OpenRouter, or a licensed library [S-04]. |
| 9 | **תצוגה מקדימה** | A full Remotion Player preview with captions, a caption style picker (8–10 Hebrew presets), brand elements (logo intro/outro, end card with phone or WhatsApp CTA), a safe-zone overlay toggle for 9:16 [S-06], and the final cost summary. | No render cost until the user confirms [S-05]. AI clips may still be placeholder keyframes at this point (cheap image model), with the real clips generated on Render. |
| 10 | **יצירה** | A confirmation modal: "היצירה תעלה 38 קרדיטים (נשארו 202). יצירה שנכשלת מחזירה קרדיטים אוטומטית." Then the progress screen (§8.5). | Credits are reserved in a DB transaction [S-05]. |

- **Shortcut path ("מהיר"):** after step 1, a "צרו לי הכל אוטומטית" button skips steps 2–8 with smart defaults and goes straight to preview. Expert users get the full wizard. (design)

### 8.4 Storyboard / scene editor (after the first render, or opened from a project)
- **Layout:**
  - **Center:** the player (Remotion Player, 9:16, LTR controls).
  - **Start (right) panel, 360px:** a vertical list of **scene cards**. Each has a thumbnail, script line, duration chip, type badge (וידאו AI / צילום שלי / סטוק / טקסט), drag handle and a "⟳ צור מחדש · 6 קרדיטים" button. Selecting a card opens its properties.
  - **End (left) panel, 320px, tabs:** סצנה (prompt, media swap, duration, transition) · טקסט וכתוביות (caption style, highlight color, position) · מותג · קול · מוזיקה.
  - **Bottom: a timeline-lite (LTR)** with 4 tracks: Scenes (blocks), Voice (waveform), Music (waveform with ducking), Captions (word chips). Trim handles are scene-level only, not frame-accurate (it's "lite"). Snap to beats is optional.
- **Chat dock** (collapsible, bottom-start): "בקשו שינוי במילים" (e.g. "תעשה את סצנה 3 יותר אנרגטית", "תחליף את המוזיקה למשהו יוקרתי"). The agent proposes a diff (highlighted changes on the cards) with "אשר" / "בטל". Agent plus chat refinement is a 2025–2026 standard [S-02][S-03].
- **Header actions:** project name (editable), undo/redo, "שתף לאישור לקוח" (agency), "ייצא" (formats, branded / unbranded, SRT) [S-03], and "צור מחדש" with the total cost.

### 8.5 Render progress screen
- A large centered **phone frame**. Its screen shows the most advanced artifact available: first the streamed script text, then keyframe stills, then clips as they finish.
- A vertical **stage list** at the start with icons and states (✓ done, a shimmer for active, a gray clock for queued): תסריט ✓ → קריינות ✓ → סצנות (3/6) → מוזיקה → הרכבה וכתוביות → מוכן. Each stage shows elapsed time. Above it: an overall progress bar and ETA.
- Below that, a **scene strip**: six 9:16 mini-cards transitioning skeleton → blurred still → playing clip (Supabase Realtime Broadcast [S-05]).
- Copy: "אפשר לסגור את הדף. נעדכן אתכם במייל וב-WhatsApp כשהסרטון מוכן." with a "קחו אותי לדשבורד" button.
- On failure: a rose card with "משהו השתבש בסצנה 4. הקרדיטים (6) הוחזרו ליתרה." [S-01] and the actions "נסו שוב" / "החליפו סצנה" / "דברו איתנו".
- On success: confetti (Lottie, skipped under reduced motion), the final player, and the download buttons per format.

### 8.6 Projects / generation history
- A filter bar: niche, goal, format, status, date, search.
- Grid or list toggle. Grid tiles are 9:16, 4 to 6 per row on desktop, with hover-play, a status badge, length, created date (`Intl.RelativeTimeFormat('he')` [S-05]) and credits used.
- Bulk actions: download, move to client workspace, delete.
- Empty state: an illustration plus "עוד אין פרויקטים. בואו ניצור את הסרטון הראשון", with niche quick-starts.

### 8.7 Templates gallery
- Tabs by goal, a niche filter, and a masonry of hover-play tiles. Click opens a **Morphing Dialog** (Motion Primitives): a large player, a "what's inside" list (hook, scenes, style, voice) and "השתמשו בתבנית", which deep-links to wizard step 4 with prefilled choices.

### 8.8 Hooks library (in-app)
- The same data as the public pages, plus personal features: favorites ★, "השתמשו בהוק" (deep-link to the wizard), and "הוקים שהצליחו לכם" (performance, when connected, opt-in [S-06]).
- Filters: niche, archetype, platform, gender form, register, season.
- Card: the hook text, an example video thumbnail, the archetype badge, copy, and use.

### 8.9 Brand kit
- Sections:
  - Logo (light/dark variants, auto background removal)
  - Colors (extracted plus editable; contrast warnings for caption text over brand colors)
  - Fonts (choose from licensed Hebrew fonts; preview in a caption)
  - Intro/outro templates
  - Lower-third style
  - End card: CTA type (WhatsApp, phone, website, address) and a QR option
  - Watermark
  - Default voice
  - Default music mood
  - **Presenter / fixed character** (consent flow for likeness and voice [S-06])
- Agency plan: multiple brand kits, one per client [S-03].
- A live preview of a sample reel with the kit applied (Remotion Player).

### 8.10 Credits and billing
- A balance card (big tabular number), a monthly-allowance ring and a rollover note.
- A usage chart (Tremor, LTR) by type (רילס / תדמית / הוקים / קול).
- A **ledger table** (reserve / capture / refund rows [S-05]) with links to projects.
- Plan cards with upgrade and downgrade, credit packs, and invoices (חשבונית מס PDF download).
- A **"ביטול מנוי"** button that is visible and self-serve [S-06].

### 8.11 Settings, team and agency
- Profile (gender form preference for UI copy), notification channels (email, WhatsApp), language (Hebrew; Arabic and Russian later [S-06]), accessibility preferences (reduce motion, high contrast, larger captions in the editor), team roles, client workspaces with approval links ("שלח ללקוח לאישור" [S-06]), and API keys (later).

### 8.12 Microcopy and state rules
- **Voice:** direct, warm, plural Hebrew. Avoid "בקשה נכשלה". Write "לא הצלחנו ליצור את הסצנה. הקרדיטים חזרו אליכם".
- **Numbers:** always `<bdi>` with tabular numerals. Prices show "₪" and "כולל מע״מ".
- **Every Generate button shows its cost** ("צור · 6 קרדיטים") [S-02][S-03].
- **Destructive actions** need a confirmation modal with the name typed only for workspace deletion.
- **Loading:** a skeleton matching the final geometry. The Text Shimmer "יוצרים…" is used only for AI states.

---

## 9. Implementation snippets (design, unverified against current library versions)

### 9.1 Root layout
```tsx
// app/layout.tsx
// Verified 2026-10-13: Radix docs now show `import { Direction } from "radix-ui"` + <Direction.Provider dir="rtl">;
// the per-package import below still works. If you use shadcn's own RTL setup (rtl: true in components.json),
// use its DirectionProvider with direction="rtl" instead (https://ui.shadcn.com/docs/rtl).
import { DirectionProvider } from "@radix-ui/react-direction";
import { heebo, karantina, jetbrains } from "./fonts";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${karantina.variable} ${jetbrains.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">דלג לתוכן הראשי</a>
        <DirectionProvider dir="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
```

### 9.2 Visible-only autoplay video tile (respects reduced motion and the global pause)
```tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
export function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current; if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.5 });
    io.observe(v); return () => io.disconnect();
  }, [reduce]);
  return (
    <video ref={ref} src={reduce ? undefined : src} poster={poster} muted playsInline loop preload="none"
      aria-label={label} className="aspect-[9/16] w-full rounded-[14px] object-cover" />
  );
}
```

### 9.3 Direction-aware icon
```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
export const NextIcon = (p: any) => <ChevronLeft {...p} className={`rtl:scale-x-100 ltr:-scale-x-100 ${p.className ?? ""}`} />;
// In RTL "next" points left (toward the end). Never flip Play, Check or logos.
```

### 9.4 Direction-aware Motion variants
```ts
export const slideFromStart = (dir: "rtl" | "ltr") => ({
  hidden: { opacity: 0, x: dir === "rtl" ? 24 : -24 }, // start = right in RTL
  show:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
});
```

### 9.5 LTR field inside an RTL form
```tsx
<label htmlFor="phone">טלפון</label>
<input id="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel"
  className="text-end border border-[--color-border-strong] rounded-[10px] h-12 px-4" placeholder="050-123-4567" />
```

### 9.6 Caption style preset (Remotion side; Hebrew-safe)
```tsx
<div style={{ direction: "rtl", unicodeBidi: "plaintext", fontFamily: heeboFamily, fontWeight: 900,
  fontSize: 64, lineHeight: 1.2, letterSpacing: 0, textAlign: "center" }}>
  {words.map((w, i) => <span key={i} style={{ color: i === active ? "#FFB547" : "#fff" }}>{w}{" "}</span>)}
</div>
// Animate per WORD, never per letter (final forms ך ם ן ף ץ) [S-05]; wrap numbers/Latin in <bdi> [S-06].
```

---

## 10. Do / Don't summary

**Do**
- Show **real Hebrew business videos** in the first viewport. Captions in Hebrew prove the moat [S-02][S-03].
- Lead with **niche → URL → video**. Put the cost and ₪ incl. VAT everywhere.
- Use logical CSS, `<bdi>`, an LTR timeline and LTR inputs for phone, email and URL.
- Give every motion a reduced-motion fallback and every autoplay a pause control.
- Keep one display font moment per screen. Everything else is Heebo/Assistant.

**Don't**
- Don't let AI models render Hebrew text in frames [S-06].
- Don't use letter-spacing, uppercase, faux italics or per-letter animation on Hebrew.
- Don't show fake counters, testimonials or logos [S-06].
- Don't stack 5 Aceternity effects in one page, and don't run WebGL backgrounds on mobile.
- Don't expose model names as the primary choice. Quality modes come first [S-03].
- Don't rely on an accessibility overlay widget [S-05][S-06].

---

## 11. Verification checklist (to run when search or fetch is available, or manually)

1. Screenshot the current hero and sections of Higgsfield, Runway, Pika, HeyGen, Synthesia, Creatify, Arcads, Mirage, InVideo, Krea, Freepik and **livinginmovie.com** (theme, palette, fonts, hero type). **Still open (2026-10-13):** web search returns no reliable visual descriptions of these homepages. Only business facts were verified (§2.1). This must be done by hand with a browser.
2. livinginmovie.com: its colors, fonts, dark/light theme and hero media, so the new brand looks clearly different [S-01 gap]. **Still open**; only the title and pay-per-creation model were verified.
3. ~~Google Fonts: confirm the Hebrew subset and weights for Karantina, Fredoka, Playpen Sans Hebrew, Open Sans (Hebrew merged)~~ **Done 2026-10-13** (§3.1). Still open: Hebrew in Rubik Spray Paint / Doodle Shadow / Wet Paint / Dirt (Rubik Glitch and Glitch Pop are confirmed).
4. Confirm that Heebo and Assistant support `tnum` (tabular figures).
5. The AAA (Ploni / Almoni), Masterfont (Simpler), Fontef (Narkiss), Hagilda and Fontbit catalogs: licensing for **web plus server-side video rendering**. **Partly done:** AAA web and app license terms are verified, but no video license was found. Fontef is identified (Yanek Iontef, 1994; Narkiss distributor since 2019). Still open: the maker of "Polin", Simpler's designer, and every foundry's video-rendering terms.
6. ~~shadcn/ui RTL docs status and the Base UI option.~~ **Done 2026-10-13:** RTL shipped Jan 2026; base-nova / radix-nova styles (§5.1).
7. ~~Motion package; GSAP licensing; Lenis package name~~ **Done 2026-10-13** (§5.2). Still open: test SplitText `type: "words"` with Hebrew final forms.
8. The Vidstack → Video.js v10 status. Which React player package to use in Oct 2026.
9. Magic UI, Aceternity and React Bits: check each component used for physical `left/right` classes, and test it in RTL.
10. Material Design bidirectionality guidance on media controls (confirm the "do not mirror" list).
11. IS 5568's current version and whether it references WCAG 2.1 or 2.2 (sii.org.il). Confirm the accessibility-statement requirements [S-06].
12. Trademark and logo-usage rules for the "powered by" strip (Google Veo, Kling, ByteDance Seedance, MiniMax Hailuo, ElevenLabs, OpenRouter).
13. Calibrate the Hebrew TTS speaking rate (words per second) for the script-length meter.
14. Run a 5–10 person SMB preference test: Direction A vs B hero mock.

---

## Sources

**Sibling research files (same folder; the URLs inside them were found by live search in this workflow):**
- `01-cadabra.md`: https://www.livinginmovie.com/ ; https://www.poenta.co.il/article/freepik-ai-tools/ ; https://www.extra.co.il/corporate-video-pricing-2026/ ; https://natigold.com/promotional-video/
- `02-ph-ads.md`: https://creatify.ai/ ; https://www.producthunt.com/products/creatify ; https://www.heygen.com/tool/url-to-video ; https://www.heygen.com/en-gb/text-to-speech/hebrew ; https://higgsfield.ai/blog/best-ai-platforms-create-ads-from-url ; https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-marketing-studio/SKILL.md ; https://en.wikipedia.org/wiki/Captions_(app) ; hook libraries: https://www.hooked.so/hooks , https://www.contenthooks.ai/hook-library
- `03-ph-brand.md`: UX pattern list (niche-first entry, scene-card storyboard, quality modes, caption presets, export pack, brand kits)
- `04-openrouter.md`: https://openrouter.ai/blog/insights/image-to-video-models-compared/ ; https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4 ; https://openrouter.ai/docs/guides/overview/multimodal/video-generation
- `05-stack.md` (itself unverified, KB-tagged): https://www.remotion.dev/docs/player ; https://ui.shadcn.com/docs/rtl ; https://www.radix-ui.com/primitives/docs/utilities/direction-provider ; https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support ; https://nextjs.org/docs/app/api-reference/components/font ; https://supabase.com/docs/guides/realtime/broadcast
- `06-israel.md` (legal and RTL sections are unverified-MK): accessibility (IS 5568), RTL subtitle bidi, hook archetypes, compliance checklist

**Where to verify the unverified-MK claims (not opened in this run):**
- https://fonts.google.com/?subset=hebrew
- https://www.w3.org/TR/WCAG22/
- https://m3.material.io/foundations/layout/understanding-layout/bidirectionality-rtl (Material bidi guidance; exact URL may differ)
- https://motion.dev ; https://gsap.com ; https://lenis.darkroom.engineering ; https://spline.design
- https://magicui.design ; https://ui.aceternity.com ; https://motion-primitives.com ; https://reactbits.dev ; https://tremor.so
- https://vidstack.io ; https://www.media-chrome.org ; https://www.mux.com/player
- https://lucide.dev ; https://phosphoricons.com ; https://www.embla-carousel.com
- https://runwayml.com ; https://pika.art ; https://higgsfield.ai ; https://www.heygen.com ; https://www.synthesia.io ; https://www.arcads.ai ; https://mirage.app ; https://invideo.io ; https://www.krea.ai ; https://www.freepik.com

---

## Verification addendum (2026-10-13)

**Method:** 35 live WebSearch queries, read at snippet level (no page fetches, since WebFetch and curl are blocked). Claims were re-tagged in place. **[verified: URL]** means the search result directly supported the claim. **[verified-snippet: URL]** means a secondary or third-party source supported it. **[corrected: URL]** means the original text was wrong or out of date and has been fixed.

### Corrections (the original text was wrong or outdated)
1. **Tailwind logical positioning utilities.** `start-*` / `end-*` are legacy. Tailwind v4.2 added `inset-s-*` / `inset-e-*`, and the v4.3 canonicalization rewrites `start-*` → `inset-s-*` and `end-*` → `inset-e-*`. §4.1 and §5.1 are fixed. https://tailwindcss.com/docs/top-right-bottom-left ; https://releases.sh/tailwind-css/tailwind-css/changelog
2. **Narkiss typefaces are distributed by Fontef, not Masterfont.** Fontef, Yanek Iontef's Tel Aviv foundry founded in 1994, has been the exclusive distributor since 2019; its Narkissim revival is on Adobe Fonts. https://fonts.adobe.com/foundries/fontef
3. **GSAP timeline.** Webflow acquired GSAP in **fall 2024**. GSAP became 100% free (all plugins, commercial use) with v3.13 in 2025. https://webflow.com/blog/gsap-becomes-free
4. **Secular One** is a single-weight *humanist sans* meant for text as well as branding, not a "heavy display" face. https://fontsource.org/fonts/secular-one/about
5. **Rubik's Hebrew** was redesigned by Meir Sadan (2015); Hubert & Fischer drew the Latin. **Heebo's** Hebrew was drawn by Oded Ezer and mastered by Meir Sadan. https://fontsource.org/fonts/heebo/about
6. **shadcn RTL wording.** The original said RTL was "reportedly announced around early 2026 [KB-low]". It is confirmed: a January 2026 changelog. shadcn's own `DirectionProvider` takes `direction="rtl"`, while Radix's takes `dir="rtl"`. https://ui.shadcn.com/docs/changelog/2026-01-rtl

### Newly verified
- **Google Fonts Hebrew families** (subset and weights): Heebo (variable 100–900), Assistant (200–800 variable, Ben Nathan), Karantina (Rony Koch; static 300/400/700), Frank Ruhl Libre (variable 300–900 since Nov 2022, Yanek Iontef), Bellefair (Shinn and Lavi Turkenich, 400), Suez One and Secular One (Michal Sahar, 400), Alef (Hagilda and Mushon Zer-Aviv, 400/700), Fredoka (Hebrew by Ben Nathan; wdth + wght axes), Playpen Sans Hebrew (TypeTogether, variable 100–800), IBM Plex Sans Hebrew (100–700, since 2021), Open Sans (Hebrew merged March 2021), Noto Rashi Hebrew, Noto Sans Hebrew, Rubik Glitch and Rubik Glitch Pop. URLs are in §3.1.
- **AlefAlefAlef license:** the web license covers one owned domain, capped by page views; the app license covers up to 50k installs. **No video license was found.** https://alefalefalef.co.il/en/more/license/
- **shadcn/ui RTL:** `rtl: true` in components.json, `shadcn migrate rtl`, and the CLI auto-transform only for the new styles (base-nova, radix-nova). https://ui.shadcn.com/docs/rtl
- **Radix:** `Direction.Provider` from `radix-ui`, or `DirectionProvider` from `@radix-ui/react-direction`. https://www.radix-ui.com/docs/primitives/utilities/direction-provider
- **Motion:** independent since 12 Nov 2024; imported from `motion/react`. https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion
- **React Bits / Magic UI / Aceternity:** 2026 positioning, React Bits' shadcn-CLI install and possible Commons Clause license. https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026
- **Lenis:** the package is `lenis`, with `lenis/react` and `lenis/snap`. https://npmjs.com/package/lenis
- **Competitor business facts** (not visuals): Creatify's pricing, G2 rating and billing complaints; Arcads at 1,000+ actors and 35+ languages; Higgsfield's self-reported $700M run-rate; Cadabra's pay-per-creation model, credits across all engines and refunds on technical failure. URLs are in §2.1.

### Still unverified
- **Every visual description of competitor homepages** in §2.1 (theme, hero layout, sections) for Runway, Pika, Higgsfield, HeyGen, Synthesia, Creatify, Arcads, Mirage, InVideo, Krea and Freepik. Searches found no design reviews or gallery entries. Screenshot them by hand.
- **livinginmovie.com visual style** (colors, fonts, theme).
- **Rubik Spray Paint / Doodle Shadow / Wet Paint / Dirt** Hebrew subsets; Varela Round and Amatic SC details; Heebo and Assistant `tnum` support.
- **Masterfont** (Simpler's designer), **Fontbit**, **"Polin"**; any foundry's terms for server-side video rendering.
- **Motion Primitives, Origin UI / coss.com, Tremor–Vercel, Vidstack → Video.js v10, Remotion Player** specifics.
- **WCAG / IS 5568** legal items in §4.8 (outside this pass's scope).
