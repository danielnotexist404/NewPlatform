# 13: Infrastructure for a "viral trends" engine (as of 2026-10-17)

> Scope: what {{BRAND_NAME}} ("קדימון") needs to run a team-curated **trend templates** engine. The team finds trending reference videos. The platform analyses each video's opening hook (first ~3 s) and its structure, and turns it into a reusable Hebrew **trend template** that any niche can produce in one click and then publish or launch as a Meta ad.
> Covered here: (1) video understanding through OpenRouter, with an ffmpeg + STT + vision fallback; (2) trend-signal sources we may legally use; (3) Israeli law and platform terms for copying a *format* versus copying *expression*; (4) which formats work for local businesses and how long trends last.
> Paid campaigns are covered in `10-meta-marketing-api.md` and organic publishing in `11-meta-organic-publishing.md`. Model prices for the wider pipeline are in `04-openrouter.md`.

---

## 0. How reliable this report is

- **Method:** 40 web searches (the cap for this topic). WebFetch and curl were blocked, so **no page was opened in full**. Every fact comes from search-result summaries of the pages linked inline.
- **Tags used:**
  - **(official)**: the summary came from the vendor's own docs or site (openrouter.ai, ai.google.dev, developers.facebook.com, ads.tiktok.com, newsroom.tiktok.com, Google's blog).
  - **(secondary)**: a third-party vendor, blog, law-firm note or news site.
  - **(unverified)**: model knowledge, an inference of mine, or sources that conflict. Check it in M0.
- **Versions and dates that matter:**
  - Meta **Graph/Marketing API v26.0** is current. It was released 2026-07-29, and no v27 had been found as of today (see `10-meta-marketing-api.md` §1 and `11-meta-organic-publishing.md` §1).
  - **`google/gemini-3.8-flash`** was released on OpenRouter on 2026-09-02.
  - The **ElevenLabs Scribe v2 discount on OpenRouter ends 2026-10-19 08:00 PT**, two days from now. After that the list price is about 2× (`04-openrouter.md` §4.2).
- **Legal content is not legal advice.** Section 3 is a product-risk map, built from secondary law-firm summaries. An Israeli IP/privacy lawyer must review the rules before launch.

---

## TL;DR

1. **Video input through OpenRouter works today.**
   - **How to send it:** add a `video_url` content part on `POST /api/v1/chat/completions`. The part takes either a URL or a base64 `data:` URL ([OpenRouter video inputs](https://openrouter.ai/docs/guides/overview/multimodal/videos), official).
   - **The catch:** URL support depends on the provider. Gemini on **AI Studio accepts only YouTube links**, and Gemini on **Vertex accepts no video URLs at all, only base64** (same source).
   - **Rule:** always send a short, base64-encoded MP4 clip that we trimmed ourselves.
2. **Default model: `google/gemini-3.8-flash`.**
   - It accepts video, images, audio and files and returns text. It has a 1,048,576-token context and costs **$0.75 / $3.75 per M tokens**. Providers are Google Vertex and Google AI Studio ([OpenRouter](https://openrouter.ai/google/gemini-3.8-flash), official).
   - **Cost:** one hook analysis is about **$0.01–0.03**. With `google/gemini-3.1-pro-preview` ($2 / $12) it is about $0.07.
3. **Gotcha: Gemini samples video at 1 frame per second by default** ([Gemini tokens](https://ai.google.dev/gemini-api/docs/tokens), official; [s-anand](https://www.s-anand.net/blog/how-does-gemini-process-videos/), secondary). A 3-second hook is therefore only about 3 frames, which is too coarse to see cuts every 0.3–0.8 s.
   - **Fix:** send a "hook package" with three parts: the trimmed clip, 12–16 ffmpeg keyframes (scene changes plus every 250 ms in 0–3 s) as `image_url` parts with timestamps, and a word-timestamped transcript from `elevenlabs/scribe-v2`.
   - The same package degrades cleanly to images plus transcript for models without video input.
4. **Trend signals: no official API covers commercial trends outside the EU.**
   - **TikTok Creative Center** (trends by region, which includes Israel, plus a curated Top Ads set) is free in the browser but has **no official API**. Scraping is against TikTok's terms ([TikTok help](https://ads.tiktok.com/help/article/creative-center), official; [ConductAtlas on TikTok ToS](https://conductatlas.com/platform/tiktok/tiktok-terms-of-service/prohibition-on-scraping-and-data-extraction/), secondary).
   - **TikTok Research API:** academic and non-profit only, no commercial use. **TikTok Commercial Content API:** EU only.
   - **Meta Ad Library API:** returns all ad types only for ads delivered in the **EU (and UK)**. Elsewhere it returns only political and issue ads ([ads_archive reference](https://developers.facebook.com/docs/graph-api/reference/ads_archive/), official).
   - **YouTube** retired its Trending page on **2025-07-21** ([9to5Google](https://9to5google.com/?p=680733), secondary).
   - **Google Trends API** is still an application-only **alpha**, announced 2025-07-24 ([Google Search Central](https://developers.google.cn/search/blog/2025/07/trends-api), official).
   - **Result:** curation is a human, in-browser job. The engine starts from **admin-entered references**, not crawlers.
5. **Legal line: copy the format, never the expression.**
   - Israeli copyright protects **expression, not ideas** (Copyright Act 2007 §5). The Supreme Court confirmed this in Ziso (2013) and Guetta (2018) ([RCIP](https://rcip.co.il/articles/supreme-court-overturns-district-court-reaffirming-that-expressions-not-ideas-are-copyrightable/), [DWO](https://dwo.co.il/no-copyright-protection-for-an-idea-in-a-play-supreme-court/), secondary).
   - **Caveat:** a Tel Aviv District Court held that a detailed TV format reduced to material form *can* be protected (Brodesky v. Armosa) ([RCIP](https://rcip.co.il/en/articles/updates-on-protection-of-television-formats-and-advertising-campaigns), secondary). So the engine must **abstract to mechanics and regenerate every word, shot and note**.
   - **Faces and voices:** using a person's name, picture or voice for profit without consent infringes the **Privacy Protection Law §2(6)** ([WIPO Lex](https://www.wipo.int/wipolex/en/legislation/details/15372), official translation). So templates never reuse the reference creator's face or voice, and never create a lookalike.
6. **Music is the hard blocker.**
   - Trending in-app songs are **not licensed for commercial use**. TikTok business accounts are locked to the **Commercial Music Library**, which is licensed for TikTok only. Meta's **Sound Collection** is the only cleared in-app library for Meta, and it works only inside Meta's apps ([Soundstripe](https://www.soundstripe.com/blogs/why-can-i-only-use-commercial-sounds-on-tiktok), [Osborne Clarke](https://www.osborneclarke.com/insights/use-music-social-media-platforms-what-businesses-and-creators-need-know-about-usage), secondary).
   - We **burn the audio into our own MP4**, so no in-app library helps us.
   - **Rule:** trend templates carry a **music brief** (tempo, mood, drop point), never a track. The music bed comes from `music.default` (Lyria 3 Pro, $0.08 per song) or a licensed stock library.
7. **Lifespan:**
   - A 2026 Publicis Groupe APAC + TikTok study found **nearly half of TikTok trends die within 5 days**, and only a small minority stay relevant past 2 weeks. The median in Australia is **3 days** ([Marketing-Interactive](https://www.marketing-interactive.com/only-a-fraction-of-tiktok-trends-last-beyond-two-weeks-publicis-groupe-finds), [AdNews](https://www.adnews.com.au/news/tiktok-trends-in-australia-last-just-three-days-on-average), secondary).
   - Format-type content lasts longer. For example, self-transformation content has a 27-day median in Australia (same source).
   - **Product consequence:** concentrate on **format-level and evergreen trends with weekly fresh twists**, not sound or meme moments, which we cannot license anyway.
8. **Close the loop with Meta data.**
   - Tag every ad and Reel with `template_slug` + `hook_slug`.
   - Aggregate hook rate (3-s plays ÷ impressions), hold rate and cost per lead per template across customers, with a minimum sample.
   - Rank the weekly feed by what is actually working in Israel. Competitors such as Motion already sell AI hook-tactic tagging plus hook-rate reporting ([Motion releases](https://motionapp.com/releases), official). We can give SMBs the same insight inside the Hebrew dashboard.

---

## 1. Video understanding through OpenRouter

### 1.1 API shape

- **Endpoint:** the normal chat endpoint `POST https://openrouter.ai/api/v1/chat/completions`, with a content part of type **`video_url`**. Its `url` can be a public URL or a **base64 data URL** ([OpenRouter video inputs](https://openrouter.ai/docs/guides/overview/multimodal/videos), [older path](https://openrouter.ai/docs/features/multimodal/videos), official).
- **Provider caveats (official, same page):**
  - OpenRouter sends video **URLs** only to providers that explicitly support them.
  - **Google Gemini on AI Studio supports only YouTube links.**
  - **Google Gemini on Vertex AI does not support video URLs.** Use base64 data URLs.
  - Because `google/gemini-3.8-flash` is served by **both** Vertex and AI Studio ([model page](https://openrouter.ai/google/gemini-3.8-flash)), a URL request may fail or reroute depending on which provider OpenRouter picks. **Base64 works on both, so it is the only portable choice.**
- **API only.** Video upload is not available in the OpenRouter chatroom UI (same page).
- **MIME types:** `video/mp4`, `video/mpeg`, `video/mov`, `video/webm`. This list comes from a docs mirror, not openrouter.ai ([mirror](https://api3.shopot.ai/docs/guides/overview/multimodal/videos.md), secondary). Note that it says `video/mov`, not `video/quicktime`. **Always transcode to H.264 MP4** and send `data:video/mp4;base64,…`.
- **Billing:** video is billed as **input tokens**, scaled by duration and resolution, and support varies by model ([multimodal overview](https://openrouter.ai/docs/guides/overview/multimodal/overview), official).
- **Size cap:** OpenRouter's own cap on base64 payload size was **not found**. Its guidance for oversized files is to compress, lower resolution or frame rate, or trim ([videos page](https://openrouter.ai/docs/guides/overview/multimodal/videos), official). → **[M0-verify]**
- **Batch API:** a third-party guide says OpenRouter Batch is **text-only** (image, audio, video and file content are rejected) (unverified; `04-openrouter.md` §1). So trend analysis runs in **real time, not batch**.
- **Part shape:** the exact nested shape is assumed to mirror `image_url`: `{ "type": "video_url", "video_url": { "url": "data:video/mp4;base64,..." } }` (unverified, model knowledge). → **[M0-verify]** with one real call.
- **AI SDK:** whether the AI SDK's OpenRouter provider passes `video_url` parts through is unknown. Part 05 already has a typed `fetch` client for non-text modalities, so route video analysis through it (inference).

### 1.2 Which models take video input (OpenRouter, Oct 2026)

| Slug | Video in? | Price per M tokens (in / out) | Notes | Source |
|---|---|---|---|---|
| **`google/gemini-3.8-flash`** (dated `-20260902`) | **Yes** (text, image, video, files/PDF, audio → text) | **$0.75 / $3.75**; batch variant about half | 1,048,576 ctx; providers: Google Vertex and Google AI Studio; released 2026-09-02 | [OpenRouter](https://openrouter.ai/google/gemini-3.8-flash) (official) |
| `google/gemini-3.1-pro-preview` (alias `~google/gemini-pro-latest`) | Yes (per aggregator) | $2 / $12 | Best Gemini "Pro" on OR as of the 04 report | [computeprices](https://computeprices.com/providers/openrouter/models/gemini-3-1-pro) (secondary), `04-openrouter.md` |
| `google/gemini-3.6-flash` | Yes (per aggregator) | **Conflict:** $0.75 in vs $1.50 / $7.50 | Older Flash. Prefer 3.8 | [llmreference](https://www.llmreference.com/model/gemini-3.6-flash/openrouter), [computeprices](https://computeprices.com/providers/openrouter/models/gemini-3-6-flash) (secondary) |
| `google/gemini-2.5-pro` | Yes | $1.25 / $10 | Legacy | [llmreference](https://www.llmreference.com/model/gemini-2.5-pro/openrouter), [computeprices](https://computeprices.com/providers/openrouter/models/gemini-2-5-pro) (secondary) |
| `qwen/qwen3-vl-32b-instruct`, `qwen/qwen3-vl-8b-instruct` | The model description says video. **OR's modality field was not confirmed** | not retrieved | Possible cheap fallback. Check `architecture.input_modalities` | [OpenRouter](https://openrouter.ai/models/qwen/qwen3-vl-32b-instruct) (official page, field not seen) |
| Anthropic / OpenAI chat models | No video input (unverified, model knowledge) | — | Use them only on the **frames + transcript** fallback (§1.5) | — |

**Recommendation:**
- Add a new route **`llm.video`**. Primary: `google/gemini-3.8-flash`. Fallback: `google/gemini-3.1-pro-preview`.
- Add a second route **`llm.vision_frames`** for the no-video fallback. Primary: `anthropic/claude-sonnet-5.5`, which is already the Hebrew copywriter. Fallback: `google/gemini-3.8-flash` with images only.
- At M0, call `GET /api/v1/models` and keep only models whose `architecture.input_modalities` contains `"video"` (field name unverified). Store the result in `model_registry.capabilities.video_in`.

### 1.3 How Gemini "sees" video: token math and the 1-fps trap

- **Default sampling is 1 frame per second.**
  - Gemini 2.5: frames cost **258 tokens** each and audio costs **32 tokens/s**, about **300 tokens/s** at default resolution and about 100 at low ([s-anand summary of Google's guide](https://www.s-anand.net/blog/how-does-gemini-process-videos/), secondary).
  - Google's tokens page states a flat **263 tokens/s** ([Gemini tokens](https://ai.google.dev/gemini-api/docs/tokens), official).
- **Gemini 3 media resolution** ([media resolution docs](https://ai.google.dev/gemini-api/docs/media-resolution), official):
  - **Video:** **70 tokens per frame** at default, low and medium (low and medium are treated the same), and **280 tokens per frame at `high`**.
  - **Audio:** about **25 tokens/s** on Gemini 3 vs 32 on Gemini 2.5 (search summary of the same page).
  - Google recommends `high` only for dense text (OCR) or small details. That is relevant for reading the reference's **on-screen text**.
  - Per-part `media_resolution` is **Gemini 3 only**. Whether OpenRouter passes the parameter through is unknown. → **[M0-verify]**
- **Custom fps / clipping (`videoMetadata.fps`, `start_offset`, `end_offset`)** exists in Google's native API (unverified, model knowledge, not found in searches). Assume **OpenRouter does not forward it**, and trim and resample ourselves with ffmpeg.
- **"Agentic video" mode:** a Sept 2026 docs changelog says Gemini 3.7 / 3.6 / 3.5 Flash-Lite can navigate the timeline and load only the transcript, frames or audio they need, instead of 1-fps static processing. One blog claims up to 88% fewer tokens ([techdevnotes changelog mirror](https://techdevnotes.com/releases/gemini-docs/20260901-180346Z-4a33992aa23f), [howaiworks](https://howaiworks.ai/blog/google-gemini-agentic-video-2026), secondary). This is irrelevant for 5–8 s clips and is not a dependency.
- **Why 1 fps is a problem for hooks.** Viral hooks often cut every 0.3–1.0 s, flash text for under 1 s, or depend on a single transition frame such as a hand covering the lens or a snap. At 1 fps the model sees 3 frames of a 3-second hook and **will hallucinate the pacing**. Mitigations, best first:
  1. **Hook package** (recommended):
     - the 0–6 s clip at native speed, which gives motion and audio gist;
     - plus **12–16 JPEG keyframes** as `image_url` parts, each preceded by a text part `t=0.25s`;
     - plus the **Scribe v2 transcript with word timestamps**;
     - plus **ffmpeg-measured facts** (cut timestamps, loudness peaks) as text.
     The model then reasons over ground-truth timing instead of guessing.
  2. **Slow-motion trick** (unverified idea, untested): re-encode 0–4 s at 4× slower (`setpts=4.0*PTS`, audio dropped) so that 1-fps sampling gives an effective 4 fps. Send the original audio separately as an audio part or as the transcript, and tell the model to divide timestamps by 4.
  3. A **direct Google Gemini API** client with `videoMetadata.fps` is the escape hatch only if 1–2 fail QA. It breaks the "all AI through OpenRouter" rule, so it needs a founder decision.
- **Cost estimate per hook analysis** (my arithmetic on the prices above; image token cost per frame on Gemini 3 at default was not found, so I assume about 258–1,120 tokens per frame):
  - Clip: 6 s × (70 + 25) ≈ 570 tokens.
  - Frames: 16 × about 300–1,100 ≈ 5k–18k tokens.
  - Transcript plus prompt: about 3k tokens.
  - **Total input:** ≤ 22k tokens. On `gemini-3.8-flash` that is ≈ **$0.017** in plus 2k out ≈ $0.0075, so **about $0.025 per analysis**. On `gemini-3.1-pro-preview` it is about $0.07.
  - A full-length structure pass (60 s at 1 fps, default resolution) adds about 60 × 95 ≈ 5.7k tokens, about $0.005.
  - **Analysis cost is negligible.** The admin's time is the real cost.

### 1.4 File-size and length limits

- **Gemini native API** ([video understanding](https://ai.google.dev/gemini-api/docs/video-understanding), [Google blog: new file limits](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-new-file-limits/), official):
  - **inline data < 100 MB**, raised from 20 MB (base64; limits vary by type);
  - **Files API** up to **2 GB free / 20 GB paid**;
  - GCS registration 2 GB per file;
  - **public YouTube URLs**;
  - Gemini 2.5+ accepts **up to 10 videos per request** (translated docs copy).
  - **Unlisted YouTube videos:** Firebase docs say "public or unlisted" ([Firebase AI Logic](https://firebase.google.com/docs/ai-logic/input-file-requirements?api=vertex)), but a Google forum thread says unlisted is not supported ([forum](https://discuss.ai.google.dev/t/request-allow-gemini-api-to-analyze-unlisted-youtube-videos/105083)). (Conflict.)
- **Through OpenRouter:** the max base64 size is unknown, and the Files API and GCS options are not exposed (unverified). → **Design for ≤ 8 MB base64 per request.**
  - 6 s at 720×1280 H.264 CRF 28 ≈ 1–2 MB (≈ 1.4–2.7 MB base64).
  - A 60-s structure pass at 480p, CRF 32, 15 fps is ≈ 4–6 MB (unverified estimate).
- **Vercel functions:** request bodies are limited to about 4.5 MB (unverified, model knowledge). So the **admin's reference upload never goes through a function body**. Use a Supabase signed upload URL, which is already the pattern in Part 04 §20, and let the workflow step read from Storage.

### 1.5 Preprocessing and fallback pipeline (ffmpeg + STT + vision)

All of this runs inside a Vercel Workflow step with `ffmpeg-static`, which Part 05 already uses for audio concat and loudnorm. The commands are standard ffmpeg (unverified syntax; test at M0):

```bash
# 0) Normalise: H.264 MP4, ≤720p short side, 30 fps, keep audio
ffmpeg -i ref.any -vf "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)',fps=30" -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 96k ref.mp4
# 1) Hook clip 0–6 s (and an optional 60-s structure clip at 480p/15fps)
ffmpeg -ss 0 -t 6 -i ref.mp4 -c copy hook.mp4
# 2) Scene-change timestamps (cuts) in the first 6 s
ffmpeg -i hook.mp4 -vf "select='gt(scene,0.30)',showinfo" -an -f null - 2> scenes.log
# 3) Dense frames for 0–3 s (every 250 ms) + one frame per detected cut
ffmpeg -i hook.mp4 -t 3 -vf fps=4 -q:v 3 f_%03d.jpg
# 4) Audio for STT and loudness/onset cues
ffmpeg -i hook.mp4 -vn -ac 1 -ar 16000 hook.wav
ffmpeg -i hook.mp4 -af "ebur128=peak=true,silencedetect=n=-35dB:d=0.25" -f null - 2> audio.log
```

- **Transcript:** `elevenlabs/scribe-v2` via `POST /api/v1/audio/transcriptions` with `response_format: "verbose_json"`. It gives word timestamps and audio-event tags, at $0.000031/s until 2026-10-19 and about $0.000061/s after (`04-openrouter.md` §4.2). A 6-s clip costs a fraction of a cent. Use `language` auto-detect, because references are often English, Spanish or Arabic.
- **Frames-only fallback:** when `llm.video` fails or the model lacks video input, send the same frames and transcript to `llm.vision_frames` with the same JSON schema. This is the "send images to a vision model" path from the brief.
- **Dedup:** store a perceptual hash (for example, an average hash of frames 0, 1 s and 2 s) on each reference, so two admins don't analyse the same trend twice (inference).

### 1.6 Output: `TrendAnalysis` JSON (proposal, Zod plus strict JSON Schema)

```ts
TrendAnalysis = {
  reference_id: uuid,
  hook_window_ms: number,                       // where the hook "lands" (usually 1500–3500)
  shots: [{ t0_ms, t1_ms, shot_type: "selfie"|"pov_hands"|"wide"|"closeup"|"screen"|"text_card"|"split"|"greenscreen",
            camera: "static"|"handheld"|"push_in"|"pull_out"|"whip_pan"|"orbit"|"top_down",
            subject: string, transition_out: "hard_cut"|"jump_cut"|"hand_cover"|"snap"|"whip"|"match_cut"|"none" }],
  on_screen_text: [{ t0_ms, t1_ms, text_original: string, lang: string, role: "hook_line"|"label"|"caption"|"cta",
                     position: "top"|"center"|"bottom", style: "bold_caps"|"tiktok_bubble"|"comment_reply"|"subtitle" }],
  spoken: { first_line: string|null, speaker: "on_camera"|"voiceover"|"none", lang: string },
  audio: { music_present: boolean, music_mood: string, est_bpm: number|null, drop_at_ms: number|null,
           beat_synced_cuts: boolean, sfx: [{ t_ms, kind: "whoosh"|"pop"|"ding"|"record_scratch"|"asmr"|... }],
           is_trending_sound_likely: boolean },
  pacing: { cuts_in_first_3s: number, avg_shot_ms: number },
  hook_type: HookTypeSlug,                     // from Appendix B.2 (27 types), e.g. "pov", "before-after"
  hook_family: HookFamilySlug,                 // B.1
  format_name_en: string, format_name_he: string,   // e.g. "POV skit" / "POV:"
  mechanics: string[],                         // WHY it works, abstracted: "deadpan text over mundane action creates a curiosity gap"
  beats: [{ order, purpose: "hook"|"setup"|"turn"|"payoff"|"cta", duration_ms, description_abstract }],
  production: { needs_person_on_camera: boolean, can_be_full_ai: boolean, shots_customer_can_film: string[] },
  niche_fit: [{ niche_slug, score_0_5, angle_he }],
  risk_flags: ("creator_face"|"creator_voice"|"copyrighted_music"|"third_party_logo"|"minor"|"political_or_war"|
               "medical_claim"|"testimonial_format"|"dangerous_stunt")[],
  do_not_copy: string[]                        // concrete expression elements that must NOT appear in templates
}
```

A **second step** (`llm.script`, Claude Sonnet 5.5, Hebrew) turns `mechanics` + `beats` into a `trend_template`:
- new Hebrew hook lines per niche;
- a shot list;
- on-screen text in RTL;
- a music brief;
- 3 hook variants for A/B.

A **similarity guard** then rejects any template whose text has high n-gram overlap with `on_screen_text.text_original` or `spoken.first_line`. Generic markers such as "POV:" are whitelisted (my design; see §3).

---

## 2. Trend-signal sources a SMB-focused team can use legally

### 2.1 Source-by-source

| Source | What it gives | Official API? | Israel? | How we may use it |
|---|---|---|---|---|
| **TikTok Creative Center: Trends** (hashtags, songs, creators, videos; by region and industry; 7/30/120-day windows) | Rising hashtags and sounds, top creators, trending videos | **No public API.** Third-party scrapers call its internal JSON ([Apify actor](https://apify.com/datapeak/tiktok-creative-center), secondary). Unauthenticated access caps hashtag results (secondary) | **Israel is in the country dropdown** ([Creative Center hashtag page](https://ads.tiktok.com/business/creativecenter/hashtag/eid), official) | **Manual browsing by an admin.** Free, no ad account needed; fuller data needs sign-in ([TikTok help](https://ads.tiktok.com/help/article/creative-center), official; [Metricool](https://metricool.com/tiktok-creative-center/), secondary). The **songs list includes tracks not approved for commercial use**. A "business use approved" filter reportedly exists ([AdMapix](https://www.admapix.com/blog/ad-intelligence/tiktok-creative-center-tutorial), [AdCreate](https://adcreate.com/blog/tiktok-creative-center-find-trending-ads), secondary) |
| **TikTok Creative Center: Top Ads** | A **curated, advertiser-authorised** set of high-performing ads, not a full archive (secondary, same sources) | No | Region list for Top Ads not confirmed for IL → **[M0-verify]** | Best single source of *ad* hooks (as opposed to organic ones). Use US/UK/EU Top Ads for formats, then localise |
| **TikTok Research API** | Public video and account data | Yes, but **academic / non-profit only; commercial use prohibited**; about 4-week approval, about 1,000 requests/day (secondary) ([TikTok dev changelog](https://developers.tiktok.com/docs/en/changelog), official; [xpoz](https://www.xpoz.ai/blog/guides/tiktok-research-api-limits-access-and-alternatives/), [datashake](https://www.datashake.com/blog/tiktok-data-coverage-in-2026-what-social-intelligence-teams-need-to-know), secondary) | — | **Not usable** by us |
| **TikTok Commercial Content API** | Ad transparency data | Yes | **EU (EEA/UK/CH) only**, launched July 2023 ([TikTok dev changelog](https://developers.tiktok.com/docs/en/changelog), official; [AdMapix](https://www.admapix.com/blog/ad-intelligence/tiktok-creative-center-tutorial), secondary) | Optional. EU ads only |
| **TikTok Next 2026 trend report** (2026-01-14) | Yearly macro signals: **"Reali-TEA"** (honesty and relatability over escapism), **"Curiosity Detours"**, **"Emotional ROI"** (a clear reason to buy) ([TikTok newsroom](https://newsroom.tiktok.com/introducing-tiktok-next-2026-our-trend-forecast-for-marketers-for-the-year-ahead?lang=en), [PDF](https://ads.tiktok.com/business/library/TikTok_Next_2026_Trend_Report.pdf), official; [Gigazine](https://gigazine.net/gsc_news/en/20260124-tiktok-trend-report), secondary) | — | Global | Creative direction for the whole library (§4.2). TikTok also points marketers to *TikTok One Insights Spotlight* and *Market Scope* (access unverified) |
| **Meta Ad Library (UI)** facebook.com/ads/library | **Every active ad** in any country, searchable. One vendor says commercial ads are visible for about 90 days and political ads for 7 years ([AdMapix](https://www.admapix.com/blog/ad-intelligence/meta-ads-library-api-developers), secondary) | — | **Yes (UI)** | **Manual**: the admin searches Hebrew keywords per niche and pastes the ad link as a *link-only* reference. Good for seeing which Israeli SMB ads have run longest (longevity is a weak proxy for performance; inference) |
| **Meta Ad Library API** `GET /v26.0/ads_archive` | `ad_type=ALL` returns all topics, but **ads that reached no EU location come back only if they are political or issue ads** ([ads_archive reference](https://developers.facebook.com/docs/graph-api/reference/ads_archive/), official). Third-party guides say SIEP ads are kept 7 years globally and **all ads in EU+UK for 1 year**. They also say queries need `search_terms` or `search_page_ids` ([adsuploader](https://adsuploader.com/blog/facebook-ad-library-api), [growthfolks](https://growthfolks.io/advertising/meta-ad-library), secondary). Country codes are ISO (GB, GR) ([Mozilla EU ad report](https://adtransparency.mozilla.org/eu/methods/), secondary). Meta stopped serving **new political ads in the EU from Oct 2025 (TTPA)** (secondary) | Yes; needs identity confirmation | **Israeli commercial ads: not returned** | Optional EU-format discovery job only. Not worth building in v1 |
| **Instagram** (Reels audio "trending" arrow, Professional Dashboard, **Edits app**) | Edits has an **Inspiration tab** to save trending Reels and audio to collections, an **Ideas** tab with weekly suggestions, retention graphs, and free 4K export ([Planoly](https://planoly.com/blog/instagrams-edits-app-review), [PostEverywhere](https://posteverywhere.ai/blog/what-is-instagram-edits), secondary) | **No trending-audio or trends API** (none found) | Yes (in-app) | Manual. The admin uses Edits / Reels on a team account. Audio found there is still **not licensed for our ads** (§3.4) |
| **YouTube** | **Trending page retired 2025-07-21**, replaced by category charts (Trending Music Videos, Weekly Top Podcast Shows, Trending Movie Trailers) and the **Inspiration tab in YouTube Studio** ([9to5Google](https://9to5google.com/?p=680733), [Net Influencer](https://www.netinfluencer.com/youtube-phases-out-trending-page-shifts-to-category-specific-charts-amid-changing-viewer-habits/), [Storyboard18](https://www.storyboard18.com/brand-marketing/youtube-retires-trending-page-after-nearly-a-decade-75844.htm), secondary) | Data API `videos.list?chart=mostPopular` still exists? (unverified) | — | **Public YouTube Shorts are the one source the AI can read "by link"**: Gemini on AI Studio accepts public YouTube URLs ([OpenRouter](https://openrouter.ai/docs/guides/overview/multimodal/videos), official), so no download is needed. Pin the AI Studio provider for this call |
| **Google Trends** (web) and **Trends API (alpha)** | API announced **2025-07-24**: consistently scaled interest, **1,800 days** back, daily/weekly/monthly/yearly, regional filters, **no "Trending Now"**; access by application ([Google Search Central](https://developers.google.cn/search/blog/2025/07/trends-api), official; [SEJ](https://www.searchenginejournal.com/google-trends-api-alpha-launching-breaking-news/551935/), secondary). **Still alpha** in Aug 2026 with no pricing (third-party) ([konabayev](https://konabayev.com/blog/google-trends-api-landscape-2026/), secondary) | Alpha, gated | `geo=IL` in the UI | Apply for alpha access (commercial use form). Meanwhile, the admin checks seasonal demand per niche in the UI and links it to `seasons.json` |
| **Trend newsletters/pages** | **Later:** weekly "Instagram Reels trends" with *how to use* and business-friendly audio notes. Its latest edition in the results was Jan 2026 ([Later](https://later.com/blog/instagram-reels-trends), secondary). **SocialPilot:** monthly trending sounds, updated 2026-09-15 to 10-10 ([SocialPilot](https://socialpilot.co/blog/instagram-reels-trends/), secondary). **HeyOrca:** Fridays ([HeyOrca](https://heyorca.com/blog/social-media-planning/trending-audio-for-reels-tiktok), secondary) | — | Global | Reading only. Their *format* descriptions are ideas, but don't copy their text |
| **Ad-spy / swipe-file tools** | **Foreplay:** save ads from ad libraries to boards; $49–59/mo (prices conflict). **Minea:** TikTok/Meta/Pinterest ad spy on Premium, $49–99/mo. **Kalodata:** TikTok Shop GMV and creators, about $46–49/mo. **Trendpop:** now under Collab, enterprise pricing. **TrendTok:** mobile app predicting rising sounds and hashtags by adoption velocity. **PiPiAds:** from $49/mo ([Segwise roundup](https://segwise.ai/blog/tiktok-adspy-tools-creative-discovery.md), [TrendTrack](https://www.trendtrack.io/blog-post/minea-vs-pipiads-vs-trendtrack), [Capterra Kalodata](https://www.capterra.com/p/10013207/Kalodata/), [GetApp Trendpop](https://www.getapp.com/marketing-software/a/trendpop/), [Argil](https://argil.ai/blog/viral-finder), secondary). **Flick:** nothing found (unverified) | Some have exports (unverified) | Mostly US/EU | Optional paid seat for the curation team (Foreplay or Minea). Check each tool's ToS before analysing its saved videos (they may themselves be scraped) |
| **Creative analytics (hook tagging)** | **Motion:** AI Tagging of every ad into 8 default categories incl. *visual format, messaging angle, hook tactic, headline tactic*; reports hook rate, hold rate and conversion by concept ([Motion releases](https://motionapp.com/releases), official; [Omniconvert](https://www.omniconvert.com/nexus/compare/motion-vs-vidmob/), secondary). **Superads:** "Hook Score". **Segwise, VidMob:** element tagging ([Segwise](https://segwise.ai/blog/best-hook-tagging-analysis-tools-2026), secondary) | — | — | **Benchmark for our results dashboard**: we tag at creation time, so no AI tagging after the fact is needed |
| **Israeli local** | TikTok Israel's 2025 recap event (Tel Aviv Museum). Ness & Stilla's "רשימת קניות" was among the most-listened TikTok songs of 2025 ([ice.co.il](https://www.ice.co.il/social/news/article/1098118), secondary). Calcalist notes that humour and trends win on TikTok and that Reels audiences expect a different language ([Calcalist](https://www.calcalist.co.il/shopping/article/hjkdrivtc), secondary). No 2026 Israeli SMB trend list was found | — | IL | Hebrew humour, local sounds as *mood references only* (copyrighted) |

### 2.2 How trend products present a trend (pattern to borrow)

Across Later, SocialPilot, Edits and the ad-spy tools above (secondary), a trend item usually shows:
1. a name;
2. an example video;
3. the audio;
4. **why it works**;
5. **how to make it** (steps);
6. a **business-friendly** flag;
7. platform(s);
8. a **lifecycle stage** (rising / peak / fading, from TrendTok-style velocity scoring);
9. a weekly refresh.

Our card adds what none of them do (inference):
- **"צרו בקליק"** for *your* niche;
- a **licensed** music bed already applied;
- the option to **launch it as a Meta ad** and later see **its hook rate and cost per lead** across similar businesses.

CapCut is the closest "one-click trend template" product. Its trending templates often lose their sound because of music rights ([CapCut help](https://www.capcut.com/help/templates-and-trends?pageNo=4), official). Since 2026-01-22 its Materials License splits assets into "Dual Use" and "Non-commercial", and no rights are granted to its built-in music for commercial videos ([autoae](https://autoae.online/blog/is-capcut-free-for-commercial-use), [fluxnote](https://fluxnote.io/guides/capcut-questions-answered), secondary). **This is our positioning hook:** "a trend template that is legal for ads, in Hebrew, with the campaign built in."

---

## 3. Legal and ethical rules (Israel + platform terms)

### 3.1 Format vs expression (Israeli Copyright Act 2007)

- **§5: ideas are not protected, only their expression.** The line is "vague and often arbitrary" ([RCIP on formats and campaigns](https://rcip.co.il/en/articles/updates-on-protection-of-television-formats-and-advertising-campaigns), secondary). The 2007 Act protects expression, not ideas ([IPWatchdog](https://ipwatchdog.com/2012/03/14/big-brother-sues-israeli-reality-show-for-copying/id=22722/), secondary).
- **Supreme Court:**
  - *Petah Tikva Municipality v. Ziso* (2013) overturned an infringement finding over a business *idea* (dog-dropping DNA testing) and reaffirmed expression-only protection ([RCIP](https://rcip.co.il/articles/supreme-court-overturns-district-court-reaffirming-that-expressions-not-ideas-are-copyrightable/), secondary).
  - *Guetta v. Mittelpunkt* (2018): no copyright in the idea of a play ([DWO](https://dwo.co.il/no-copyright-protection-for-an-idea-in-a-play-supreme-court/), secondary).
- **TV formats:** *Brodesky v. Armosa* (Tel Aviv District Court) held that a format can be protected **if it is an idea reduced to material form** with enough detail. That case concerned the game show "Upgrade" ([RCIP](https://rcip.co.il/en/articles/updates-on-protection-of-television-formats-and-advertising-campaigns), secondary). Its appellate status was not checked. → **[M0-verify with counsel]**
- **Product reading** (inference, not legal advice):
  - A *structure* is an idea. "POV: text over a mundane situation, then a twist reveal at 2 s" is one. So are "before → hand-over-lens → after" and "rate 5 things 1–10".
  - **Reproducing a specific video's concrete expression is the risk zone.** That means its exact lines, the same shot sequence with the same jokes, its on-screen copy, its music, or its characters.
  - Hence the "abstract → regenerate" pipeline, the `do_not_copy` list and the similarity guard (§1.6).

### 3.2 Fair use and the act of analysing a reference

- **§19** is a US-style open fair-use clause ("such as" list). Israel was the second country after the Philippines to adopt US-style fair use in its statute ([infojustice](https://infojustice.org/?p=20276), [Haifa Univ. library](https://lib.haifa.ac.il/en/copyright-fair-use/), [eScholarship](https://escholarship.org/uc/item/08x5q57c), secondary).
- **Ministry of Justice opinion, Dec 2022:** using copyrighted works to **train ML** is *likely* fair use under §19. §22 (incidental use) and §26 (ephemeral copies) may also apply. The opinion **does not cover outputs**, and **does not cover** training on a few creators to build a tool that competes with them ([law.co.il](https://www.law.co.il/en/news/2022/12/22/fair-use-of-copyrighted-content-for-aiml-training/), [Pearl Cohen](https://www.pearlcohen.com/israeli-ministry-of-justice-opines-on-fair-use-of-copyrighted-content-for-ai-ml-training/), [Herzog](https://herzoglaw.co.il/en/news-and-insights/ministry-of-justice-opinion-on-the-use-of-copyrighted-works-for-machine-learning-purposes/), [infojustice](https://infojustice.org/?p=44989), secondary).
- **Product reading** (inference):
  - Analysing a lawfully obtained reference to extract *mechanics* is well within the spirit of that opinion.
  - **Showing the reference video to customers is not.** Customers see only *our own* demo renders, plus at most an outbound link or official embed of the original post.
  - Keep reference files private (admin-only bucket) with a retention limit.

### 3.3 Faces, voices, names: Privacy Protection Law 1981 §2(6)

- Using a person's **name, appellation, picture or voice for profit** without consent is an infringement of privacy ([WIPO Lex](https://www.wipo.int/wipolex/en/legislation/details/15372), official translation; [Knobbe translation](https://www.knobbe.com/sites/default/files/2021-04/Privacy-Law.pdf), secondary).
- A **2026 Petah Tikva district** decision lists the elements: use without consent, plus a purpose of gain, plus real injury ([afiklaw](https://www.afiklaw.com/caselaw/19927/5), secondary). What counts as "for profit" was long open ([2jk on Shertzer v. Samira](https://2jk.org/english/?p=224), secondary).
- An Israeli deepfake/likeness bill was **not found** in search (unverified). The Performers and Broadcasters Rights Law (1984) may also protect recorded performances (unverified, model knowledge).
- **Rules:**
  - never reuse the creator's face, voice, name or handle;
  - no voice cloning of anyone except the customer, with recorded consent;
  - no "make it look like @creator";
  - AI avatars only from licensed stock (for example `heygen/avatar-iv`'s licensed avatars) or the customer.

### 3.4 Music: why trend templates must use licensed or AI music

- **TikTok:**
  - The general sound library is licensed for personal, non-commercial use.
  - **Business accounts are locked to the Commercial Music Library**: 1M+ pre-cleared tracks, usable in organic brand posts and paid TikTok ads, but **TikTok only**.
  - Businesses can upload their own licensed music after a Music Usage Confirmation.
  - Sources: [Soundstripe](https://www.soundstripe.com/blogs/why-can-i-only-use-commercial-sounds-on-tiktok), [Foxi Music](https://www.foximusic.com/blog/?p=411), [bundle.social](https://bundle.social/tiktok-commercial-music-library), [Thematic](https://hellothematic.com/music-rules-tiktok-instagram-youtube/) (secondary).
- **Meta:**
  - The **Sound Collection** (about 14,000 tracks per third parties) is pre-cleared for commercial use **on Facebook and Instagram only**, and may not be used apart from Meta's products.
  - Meta's Music Guidelines prohibit commercial or non-personal use of in-app music without your own licence.
  - Boosting a post with a restricted track forces you to replace or mute it.
  - "No 10-second rule" exists.
  - Sources: [Osborne Clarke](https://www.osborneclarke.com/insights/use-music-social-media-platforms-what-businesses-and-creators-need-know-about-usage), [Foxi Music](https://www.foximusic.com/blog/instagram-reels-music-copyright-legal-guide/), [Foxi ads](https://www.foximusic.com/blog/?p=587), [Third Chair](https://usethirdchair.com/blog/instagram-reels-audio-library-what-brands-need-to-know), [Arlington support page](https://supportcenter.arlingtonproperties.net/support/solutions/articles/154000246554-social-media-music-usage-guidelines-business-accounts-) (secondary). The 2022 rollout was limited to some ad formats ([MBW](https://musicbusinessworldwide.com/meta-offers-royalty-free-music-library-to-instagram-reels-advertisers), secondary).
- **Our situation:**
  - We **render audio into the MP4** (Remotion) and publish through the API.
  - An in-app licence does not attach to a file we upload, and the API has no music-ID parameter (only `audio_name` renames original audio; `11-meta-organic-publishing.md` §3).
  - **So any recognisable trending song in our MP4 is unlicensed for ads.**
- **AI music:**
  - Lyria 3 Pro on OpenRouter costs $0.08/song (`04-openrouter.md` §4.3).
  - Every track carries a **SynthID** watermark.
  - Lyria's safety filters block specific artist voices and copyrighted lyrics.
  - **Commercial rights depend on the access route's terms** and are "still being clarified" per third parties ([invideo Lyria guide](https://invideo.io/blog/lyria-ai-music-generator/), [invideo AI music copyright](https://invideo.io/blog/ai-music-copyright-comparison/), [anthemcreation](https://anthemcreation.com/en/artificial-intelligence/lyria-3-ai-music-google-deepmind/), secondary). → **[M0-verify]** the Google and OpenRouter output terms for ad use, or license a stock library with an API as plan B (not researched).
- **Template rule:**
  - store a **music brief** (`mood`, `bpm` range, `drop_at_ms`, `energy_curve`, `sfx` cues);
  - never store the reference's audio;
  - show the UI note: "בטרנד המקורי יש שיר מוגן; אצלנו נוצרת מוזיקה מקורית ומותרת לפרסום".

### 3.5 Platform terms: no downloading or scraping

- **TikTok:**
  - The US terms (§3.4) bar extracting data with automated software without TikTok's **written approval**.
  - The EEA wording ties the ban to commercial purposes.
  - The realistic consequence is account or access restriction, with possible legal action.
  - Sources: [ConductAtlas](https://conductatlas.com/platform/tiktok/tiktok-terms-of-service/prohibition-on-scraping-and-data-extraction/), [AIMultiple](https://research.aimultiple.com/tiktok-scraping/) (secondary).
- **Instagram / Meta:**
  - The ToU bar collecting information in an automated way without express permission ([court-filed copy of Instagram ToU](https://www.lb7.uscourts.gov/documents/19-1861URL1Termsofuse.pdf); [Open Terms Archive memo](https://opentermsarchive.org/en/memos/instagram-blocks-data-retrieval-and-clarifies-what-information-it-retrieves/)).
  - Meta's **Automated Data Collection Terms** (effective 2024-10-07 per a vendor) require express written permission ([vorplabs](https://vorplabs.com/agent-tools/instagram-api), secondary).
  - **Bonus risk:** we are a Meta app with ads permissions. Violating Meta terms could cost us the Marketing API access that the whole product depends on (inference).
- **Rules:**
  - **no** yt-dlp, downloaders, Apify actors or headless scraping of TikTok, Instagram or Facebook;
  - a reference enters only via:
    1. **admin upload with a recorded `rights_basis`**: own content, licensed, written partner permission, or customer-owned video. Screen recordings of third-party posts are a grey zone; restrict them to internal analysis with legal sign-off. → **[M0-verify with counsel]**
    2. **public YouTube URL** analysed by Gemini directly (Google-sanctioned path, no download);
    3. **link-only**: URL plus the admin's own structured notes (the admin fills the `TrendAnalysis` form by hand while watching in the browser, with AI help from the text notes only).

### 3.6 AI disclosure on Meta

- Meta shows an **"AI info"** disclosure in "About this ad". It is automatic for Meta's own generative tools and detected via **C2PA** for third-party tools ([Social Media Today](https://socialmediatoday.com/news/meta-adds-updated-disclosure-tags-for-ai-generated-ads/824658), [Marketing Dive](https://marketingdive.com/news/sociable-meta-adds-updated-disclosure-tags-for-ai-generated-ads/824833), [TechWyse](https://www.techwyse.com/news/industry-news/google-meta-ai-ad-disclosure-labels), secondary).
- A 2026 blog claims mandatory labelling and rejections for undisclosed photorealistic AI people ([Common Thread](https://commonthreadco.com/blogs/coachs-corner/meta-ai-ad-labels-mandatory-disclosure-ecommerce-2026), secondary). (unverified)
- **Rules:**
  - don't strip C2PA or SynthID metadata in render;
  - self-disclose wherever the API exposes a flag. → **[M0-verify]** the field name on v26.0; see doc 11 for organic.

### 3.7 Template red lines (product policy; my synthesis)

1. **Fake testimonials and street interviews.** Formats like "street interview", "customer reaction" or "review" must use **real customer footage with consent**. An AI-generated person presented as a real customer is a fabricated review: it is misleading advertising under Israeli consumer-protection law (unverified section) and against Meta ad policy (unverified).
   - AI actors **may** perform clearly fictional skits (POV, "the ick"), with a "המחשה" label when photorealistic.
2. **Sensitive Israeli topics.** No trend that rides the war, hostages, IDF, Memorial Day / Holocaust Remembrance Day, terror events or politics. Ship a blocklist plus `risk_flags.political_or_war` → auto-reject.
3. **Minors.** No AI-generated minors, and no references featuring minors.
4. **Third-party marks.** No other brands' logos or products in templates.
5. **Health and regulated niches.** Inherit Part 05's niche compliance rules, for example no before/after for medical aesthetics where restricted (unverified per niche).
6. **Dangerous stunts or challenges.** Reject.

---

## 4. What makes trend formats work for local businesses

### 4.1 Lifespan (sets the product's refresh cadence)

- **Publicis Groupe APAC + TikTok (2026, 7 markets):**
  - **nearly half of trends disappear within 5 days**, and only a small minority stay relevant past 2 weeks;
  - trends that spread across 3+ countries rest on shared emotions, everyday behaviours and repeatable cues ([Marketing-Interactive](https://www.marketing-interactive.com/only-a-fraction-of-tiktok-trends-last-beyond-two-weeks-publicis-groupe-finds), secondary).
- **Australia:**
  - **median 3 days**; 55.9% vanish within a work week;
  - *self-transformation* content has a **27-day** median;
  - NZ lifestyle/vlog content has a **74-day** median vs a **29-day** US benchmark ([AdNews](https://www.adnews.com.au/news/tiktok-trends-in-australia-last-just-three-days-on-average), secondary).
- **Practitioners:** most trends peak **7–10 days** after breaking, and cultural-moment trends last 2–3 weeks ([SocialPilot](https://www.socialpilot.co/blog/tiktok-trends), secondary). Spate's 3-year study finds trend interest more durable when measured against Google search ([Spate](https://www.spate.nyc/the-life-cycle-of-a-trend-report-2024), secondary).
- **Three lifecycle classes for templates** (my synthesis):

| Class | Typical life | Examples | Fit for us |
|---|---|---|---|
| `moment` (sound, meme, dance) | 3–10 days | A specific song or a meme phrase | **Mostly no.** The music is unlicensed, and an SMB ad flight outlives it. Use it only as a *visual twist* without the sound |
| `format` (a structure with a fresh twist) | 2–8 weeks | "Things in my X that just make sense", "the ick of [profession]", "rate it 1–10" | **Core of the weekly feed** |
| `evergreen` | Years | POV, before/after, day-in-the-life, ASMR process, listicle, myth vs fact, price reveal | **Library backbone.** Refresh the *skin* (text style, transition, pacing) weekly |

- **Fields per template:**
  - `lifecycle_class`;
  - `first_seen_at`;
  - `peak_expected_at`;
  - `retire_after` (default: moment +10 d, format +56 d, evergreen none);
  - an auto-retire job;
  - "promote to evergreen" when cross-customer performance holds.

### 4.2 Why the first 3 seconds, and what the 2026 platforms reward

- **Hook timing:**
  - "47% of a video campaign's value is delivered in the first 3 seconds" is attributed to Meta-commissioned Nielsen research. The original was not found (unverified) ([Vidico](https://vidico.com/news/facebook-video-ad-best-practices-that-actually-work-2026/), [Adligator](https://adligator.com/blog/short-form-video-ads-facebook-instagram), secondary).
- **Meta Reels research** ([Search Engine Land](https://searchengineland.com/meta-native-reels-ads-can-lift-purchase-intent-5-3x-465615), secondary):
  - **branding and messaging in the first 5 s** makes an ad 1.7× more likely to reach the top purchase-intent tier;
  - **multiple brand appearances** give 1.8×;
  - **speech + music** gives 2.0× for brand interest.
  - → Templates put the business name or logo in the first 5 s, but **after** the hook line, plus a voice-over or on-camera line plus a music bed. A logo must not be frame 1. This resolves the "logo at 3 s" vendor advice ([you.com summary](https://for.you.com/posts/meta-ad-hook-rules-clash-over-3-seconds-vs-7-seconds-1b7a4958), secondary).
- **Mute viewing:**
  - "85% watched on mute" is an old vendor statistic (unverified).
  - In any case, the hook must work **visually with Hebrew on-screen text** (Part 05 RTL captions).
- **Hook-rate benchmarks:**
  - about 25–30% is good and 40%+ is elite (vendor) ([Segwise](https://segwise.ai/blog/analyze-hook-patterns-video-ads), secondary);
  - hook rate = 3-s plays ÷ impressions; hold rate = ThruPlays ÷ 3-s plays (`10-meta-marketing-api.md` §insights).
- **TikTok Next 2026:**
  - **Reali-TEA** (real over polished), **Curiosity Detours** and **Emotional ROI** (newsroom and PDF above).
  - Vendor guides agree: behind-the-scenes, UGC-style and founder-led content beats polish, and short how-tos benefit from TikTok-as-search ([Anijam TikTok trends](https://www.anijam.ai/blog/tiktok-trends/), [Swarmify](https://swarmify.com/blog/social-media-video-formats/), [EICTA](https://www.eicta.iitk.ac.in/knowledge-hub/digital-marketing/short-video-marketing-strategy-2026), secondary).
  - **Implication:** every template should offer **"צלמו בעצמכם"**, a phone shot-list the customer films in 2 minutes with on-screen framing guides. AI then fills B-roll, captions, music and the edit. **Full AI** is the alternative, not the only path.
- **Instagram tactics:**
  - **Trial Reels** test with non-followers first (doc 11 §3.5). That is the natural organic A/B for 3 hook variants.
  - Saves and shares are stronger signals than likes ([Inro](https://www.inro.social/blog/how-instagram-reels-work-2025), [Anijam Reels](https://www.anijam.ai/blog/instagram-reels-trends/), secondary).

### 4.3 Format catalogue for Israeli SMBs (seed for `trend_templates`)

Evidence for 2025–2026 is cited where found. Rows marked † are general format knowledge **(unverified for 2026 virality)**. The admin should confirm with current Creative Center and Reels examples before publishing.

| # | Format (EN / HE) | Hook mechanic in 0–3 s | Beats | Best niches | Customer films vs AI | `hook_type` (B.2) | Class | Notes / risk |
|---|---|---|---|---|---|---|---|---|
| 1 | **POV** / "POV:" | Deadpan on-screen line over a mundane, relatable situation; a curiosity gap from the title alone ([Anijam Reels](https://www.anijam.ai/blog/instagram-reels-trends/), [Videotto](https://videotto.com/blog/instagram-reels-ideas-for-business), secondary) | Line → situation → twist → brand | All (contractors, dentists, cafés) | Either. AI skit OK (fictional) | `pov` | evergreen | Hebrew humour, "דוגרי" |
| 2 | **Before / After transition** (hand over lens, snap, swipe) | Show the "before" for under 1 s, a transition on the beat, then the reveal ([Mojo](https://mojo-app.com/instagram-reels/10-proven-reels-ideas-for-local-businesses/), [Anijam](https://www.anijam.ai/blog/instagram-reels-trends/), secondary) | Before → transition → after → price/CTA | Salons, cleaning, renovation, detailing, landscaping | **Customer films** (real results only) | `before-after` | evergreen | **Never** AI-fake an "after". Medical aesthetics restricted |
| 3 | **Dramatic reveal** (horizontal → vertical, product reveal) | An action, then the reveal synced to audio ([Anijam](https://www.anijam.ai/blog/instagram-reels-trends/), secondary) | Tease → reveal → detail shots | Restaurants (dish), retail, real estate | Either | `result-first` | format | — |
| 4 | **Day in the life** / "יום בחיים של…" | Fast montage plus a time stamp, "06:30 — opening the bakery" † | 5–8 micro-shots → reflection → CTA | Service businesses, clinics, studios | Customer films (Reali-TEA) | `day-in-life` | evergreen | Self-transformation/vlog content lasts longer (AU/NZ data above) |
| 5 | **ASMR process / silent review** | Close-up texture plus crisp sound, no talking; "silent reviews" reportedly beat talking heads for products ([TLinky](https://tlinky.com/?p=12566), secondary) | Raw → process → finished | Bakeries, nails, barbers, car wash, packaging | Customer films; AI SFX | `satisfying-visual` | evergreen | Works on mute |
| 6 | **Behind the counter** / מאחורי הקלעים | "What actually happens at 13:00 on Friday" ([Swarmify](https://swarmify.com/blog/social-media-video-formats/), secondary) | Chaos → system → result | Restaurants, workshops | Customer films | `behind-the-scenes` | evergreen | — |
| 7 | **Myth vs fact** / "מיתוס:" | State a myth, then bust it in the first seconds ([Anijam Reels](https://www.anijam.ai/blog/instagram-reels-trends/), secondary) | Myth → "wrong" → why → tip | Professionals (accountants, dentists, trainers) | Either (talking head or AI) | `myth-busting` | evergreen | Claims must be true (Part 05 compliance) |
| 8 | **Things I wish I knew before…** / "דברים שהייתי רוצה לדעת לפני ש…" † | A regret framing plus a number | 3 items → CTA | Renovation, weddings, real estate, mortgages | Either | `mistakes` / `listicle` | evergreen | — |
| 9 | **Rate it 1–10** / "מדרגים" † | The first rating appears on screen at 1 s | 4–5 items, each with a score → "the 10/10 is ours" | Restaurants, cosmetics, gyms | Either | `listicle` | format | Don't rate competitors by name |
| 10 | **The ick (of a profession)** / "האייק של…" † | "The ick of every plumber:" plus a comedic close-up | 3 icks → "what we do instead" | Trades, salons, dating-adjacent services | AI skit OK | `relatable`/`pov` | format | Self-deprecating, never about customers |
| 11 | **Tell me you're X without telling me** / "תגידו שאתם X בלי להגיד" † | An insider visual joke | 3 visual clues → reveal | Any profession | Either | `callout` | format | — |
| 12 | **Reply to a comment** (comment bubble overlay) / "עונים לתגובה" † | A comment-sticker graphic in the first frame | Question → answer → CTA | All (best for FAQs and objections) | Talking head or AI VO | `question` | evergreen | Use **real** comments with permission, or a clearly generic one |
| 13 | **Green-screen react** † | The person over a screenshot (myth, review, price list) | Point at it → explain → tip | Professionals | Customer films (Edits has green screen; [Planoly](https://planoly.com/blog/instagrams-edits-app-review), secondary) | `controversy`/`myth-busting` | evergreen | Never show a third-party post screenshot with an identifiable person (privacy) |
| 14 | **Price reveal / "what ₪100 gets you"** / "כמה זה עולה באמת" † | A big number on screen in the first second | Number → breakdown → offer | Restaurants, services, real estate | Either | `price-reveal` | evergreen | Prices must be current (consumer law) |
| 15 | **Expectation vs reality** / "ציפייה מול מציאות" † | Split screen | Funny "expectation" → real result | Travel, renovation, cosmetics | Either | `comparison` | format | — |
| 16 | **Red flag / green flag** / "דגל אדום / דגל ירוק" † | A flag emoji plus a claim | 3 red → 3 green → "we're green" | Contractors, garages, clinics | Either | `negative-warning` | format | No naming of competitors |
| 17 | **Unboxing / packing orders** / "אורזים הזמנות" † | Hands plus satisfying packaging plus an order counter | Order → pack → ship | E-commerce, florists, bakeries | Customer films | `satisfying-visual` | evergreen | — |
| 18 | **Street interview** / "סקר רחוב" † | A mic in frame plus a question | Q → answers → brand | Cafés, gyms, events | **Real people only**, with signed releases | `question`/`social-proof` | format | **Hard rule: no AI "interviewees"** (§3.7) |
| 19 | **Customer reaction / testimonial** † | A real reaction face at frame 1 | Reaction → result → quote | All | **Real customers only** | `social-proof` | evergreen | Written consent per §2(6) |
| 20 | **"As a [profession], I'd never…"** / "בתור X אני אף פעם לא…" † | Authority plus a forbidden-list framing | 3 nevers → CTA | Dentists, electricians, trainers | Talking head or AI VO | `insider-secret` | evergreen | — |
| 21 | **Get ready with me (GRWM)** † | Mirror shot plus a hook line | Steps with products → final look | Salons, cosmetics, fashion | Customer films | `how-to`/`demonstration` | evergreen | — |
| 22 | **Quick how-to** / "מדריך מהיר" | A promise of value in X seconds ([Anijam TikTok](https://www.anijam.ai/blog/tiktok-trends/), secondary) | Promise → 3 steps → CTA | All | Either | `how-to` | evergreen | Search-friendly captions |

### 4.4 Hebrew and Israeli adaptation notes (inference unless cited)

- **Language:**
  - Hebrew hook lines;
  - English trend tags stay in English where Israeli creators keep them (POV, GRWM, ick). This is common usage, but confirm per template;
  - RTL text styles with an LTR-safe "POV:".
- **CTA:** WhatsApp is the default (matches the Click-to-WhatsApp objective in doc 10).
- **Timing:** align the weekly drop with the Israeli week (publish **Sunday 08:00 Asia/Jerusalem**) and with `seasons.json` holidays (B.3). Avoid national mourning days entirely (see §3.7).
- **Tone:** humour works on TikTok, while Reels audiences expect a different register ([Calcalist](https://www.calcalist.co.il/shopping/article/hjkdrivtc), secondary). Each template carries `platform_tone: { reels, tiktok }` variants.

---

## 5. Proposed engine design (synthesis for the build prompt)

```
Admin "Trend Studio" ──► trend_references (rights_basis, source_url, asset)  ──►  workflow trendAnalyze(refId)
   │                                                                                 1 normalise+trim (ffmpeg)
   │                                                                                 2 STT  stt.default (scribe-v2, verbose_json)
   │                                                                                 3 keyframes + scene cuts + loudness (ffmpeg)
   │                                                                                 4 llm.video  (gemini-3.8-flash; fallback llm.vision_frames)
   │                                                                                 5 abstraction → mechanics/beats, do_not_copy, risk_flags
   │                                                                                 6 llm.script → Hebrew template per niche + 3 hook variants + music brief
   │                                                                                 7 similarity guard + risk gate
   ▼                                                                                 8 render 2–3 demo videos (existing videoPipeline)
Admin review/approve ──► trend_templates(status=published, week=YYYY-WW) ──► customer feed "טרנדים השבוע"
                                                                                  │  "צרו בקליק" → project prefilled (niche angle, hook variant A/B/C)
                                                                                  │  publish organic (doc 11) / launch ad (doc 10)
Meta insights (daily) ──► ad/reel ↔ template map ──► trend_template_stats (hook rate, hold rate, CPL; k ≥ 5 businesses)
                                                         └─► feed ranking "🔥 עובד עכשיו בתחום שלך", auto-retire, promote-to-evergreen
```

**Additional ideas** that make the offer stronger (founder asked for these):
1. **"מה ההוק שלך?"** A customer uploads *their own* past video (their rights, so the risk is low) and gets a Hebrew hook score with 3 rewritten hooks. This is a great free-trial and lead-magnet feature that reuses the same `trendAnalyze` pipeline.
2. **Weekly WhatsApp or email "3 טרנדים לעסק שלך השבוע"**, with a deep link to one-click create. Uses the WhatsApp templates from doc 14.
3. **Hook A/B by default.** Every template produces 3 hook variants:
   - **paid:** launched as 3 ads in one ad set;
   - **organic:** published as Trial Reels;
   - after the minimum sample, the dashboard says "הוק B ניצח: עלות לליד ₪14 במקום ₪22", with a "הגבירו תקציב למנצח" button.
4. **Benchmarks across customers.** "בעסקים כמו שלך התבנית הזו הביאה ליד ב-₪X בממוצע." Requirements: k-anonymity (k ≥ 5 businesses), aggregate-only, and disclosure in the ToS/privacy policy (Part 06).
5. **Shot-list mode with an on-screen ghost overlay and teleprompter.** Real footage plus AI polish fits "Reali-TEA" and avoids the fake-testimonial trap.
6. **Trend lifecycle badges:**
   - "חדש השבוע";
   - "בשיא";
   - "קלאסיקה" (evergreen);
   - "נגמר בקרוב" with an expiry countdown, which creates urgency to use the trend now.

---

## Implications for the build prompt

1. **New model routes (Part 05 §6, F §7.1, seed `model_routes.json`):**
   - `llm.video`: primary `google/gemini-3.8-flash`, fallback `google/gemini-3.1-pro-preview`; `params.structured = "json_schema_strict"`, `temperature 0.2`, `max_output_tokens 4000`.
   - `llm.vision_frames`: primary `anthropic/claude-sonnet-5.5`, fallback `google/gemini-3.8-flash`.
   - New `ai_generations.task` values: `llm_trend_analysis`, `llm_trend_template`, `llm_hook_score` (customer self-analysis).
   - **0 customer credits** for admin analysis. The customer "hook score" feature costs N credits (pricing TBD).
2. **Request shape:**
   - chat completions with content parts `text`, `video_url` (**always `data:video/mp4;base64,…`, never a remote URL**, except a public YouTube URL with the provider pinned to AI Studio), `image_url` (JPEG frames, each preceded by a `t=…ms` text part), and the transcript as text;
   - send through the typed `fetch` client, not the AI SDK, until the SDK's support for `video_url` is verified;
   - **no Batch API** for media.
3. **Preprocessing step `lib/pipeline/steps/trend-preprocess.ts`** (ffmpeg-static):
   - normalise to H.264 MP4 ≤ 720p;
   - `hook.mp4` = 0–6 s;
   - optional `structure.mp4` = full length, capped at 90 s, 480p, 15 fps;
   - frames at 4 fps for 0–3 s plus one per scene cut (cap 16);
   - `scene>0.30` cut list;
   - `ebur128` / `silencedetect` cue list;
   - **cap the base64 request at ~8 MB**; downscale or shorten if larger.
4. **Upload limits for references:**
   - MIME `video/mp4|quicktime|webm`;
   - ≤ 200 MB and ≤ 3 min;
   - Supabase signed upload to a **private bucket `trend-refs/`** (admin RLS only);
   - **retention 30 days**, then delete the file and keep only the analysis JSON, the perceptual hash and the source URL, unless `rights_basis = own_content|licensed|partner_permission`.
5. **Tables (Part 04):**
   - `trend_references`: id, created_by, `source_platform` (tiktok|instagram|facebook|youtube|meta_ad_library|tiktok_top_ads|other), `source_url`, `asset_id` (nullable), `rights_basis` (enum: `own_content`, `licensed`, `partner_permission`, `customer_owned`, `public_youtube_url`, `link_only_notes`), `rights_note`, `phash`, `region` (IL/US/…), `observed_at`, `retention_until`.
   - `trend_analyses`: reference_id, model, cost_usd, `analysis` jsonb (§1.6 schema), `risk_flags[]`, version.
   - `trend_templates`: slug, name_he, description_he, `why_it_works_he`, `hook_type`, `hook_family`, `lifecycle_class` (moment|format|evergreen), `first_seen_at`, `peak_expected_at`, `retire_after`, `niches[]`, `beats` jsonb, `shot_list` jsonb, `hook_variants` jsonb (3+), `music_brief` jsonb, `platform_tone` jsonb, `demo_asset_ids[]`, `status` (draft|review|published|retired), `published_week`, `requires_real_footage` bool, `requires_real_people_consent` bool.
   - `trend_template_uses`: workspace_id, project_id, template_slug, hook_variant.
   - `trend_template_stats_daily`: template_slug, niche, date, impressions, video_3s, thruplay, leads, spend, businesses_count. Show it only when businesses_count ≥ 5.
6. **Ad and Reel tagging:**
   - every ad created from a template stores `template_slug` + `hook_slug` + `variant` in our `ads` mapping table, and in the ad name `KDM|{template}|{hook}|{variant}|{date}`;
   - organic Reels store the same in `publications`;
   - the insights sync (doc 10) joins on it.
7. **Guards (Part 05 moderation):**
   - **similarity guard**: reject templates whose Hebrew or translated text shares ≥ 6-gram overlap, or embedding cosine ≥ 0.9, with the reference's on-screen text or spoken line (thresholds TBD at M0);
   - **risk gate**: any `risk_flags` in {`political_or_war`, `minor`, `dangerous_stunt`} → auto-reject;
   - `testimonial_format` → `requires_real_people_consent = true`, and AI-person generation is blocked for that template;
   - `creator_face|creator_voice` → generation prompts must not describe the creator.
8. **Music:**
   - templates hold only a `music_brief`; render uses `music.default` (Lyria) or a licensed library;
   - **block** any user attempt to upload a "trending song" for an ad (checkbox: "יש לי רישיון לשימוש מסחרי במוזיקה הזו");
   - show the Hebrew explainer from §3.4.
9. **No scraping:**
   - the build must not include TikTok/IG/FB downloaders, scrapers or Apify integrations;
   - Creative Center, Ad Library, Edits and Google Trends are admin browser tools, and the Trend Studio has a "paste link + notes" form.
10. **Admin "Trend Studio" (Part 03 admin):**
    - reference intake with a rights form;
    - analysis viewer (timeline of shots, text and audio cues);
    - template editor (Hebrew, per niche);
    - demo render;
    - weekly publish scheduler (Sunday 08:00 Asia/Jerusalem);
    - lifecycle dashboard with auto-retire.
11. **Customer UX (Part 03):**
    - "טרנדים השבוע" feed, filterable by niche and lifecycle;
    - card: demo video, למה זה עובד, מתאים לעסק שלך כי…, badge, "צרו בקליק" / "צלמו בעצמכם (רשימת צילומים)";
    - after creation: "פרסמו כרילס" / "השיקו כמודעה" / "בדקו 3 הוקים".
12. **Dashboard (doc 10):**
    - "איזה הוק עובד" per template and variant;
    - hook rate and hold rate definitions as in doc 10;
    - cross-customer benchmark tile (k ≥ 5).
13. **Copy and legal pages (Part 06):**
    - the ToS must say that customers own the rights to their uploads;
    - aggregate, anonymised performance data powers benchmarks (opt-out);
    - no fake testimonials;
    - AI-generated content is disclosed.
14. **Costs:**
    - admin analysis is about $0.03–0.10 per reference;
    - budget guard: `trend.max_analysis_usd = 0.50`;
    - the monthly admin cap is configurable.
15. **Seeds:** ship ~22 evergreen and format templates from §4.3 as `trend_templates.json`, mapped to Appendix B hook types, with `status = draft` until the admin attaches demos.

## Open questions / [M0-verify] items

1. **[M0-verify]** Exact `video_url` part JSON shape on OpenRouter, and whether `media_resolution` (Gemini 3) and any fps or offset hint pass through.
2. **[M0-verify]** OpenRouter max request size for base64 video, and the per-provider behaviour (Vertex vs AI Studio) for `google/gemini-3.8-flash`. Is a provider pin needed for public YouTube URLs, and what is the provider slug?
3. **[M0-verify]** `GET /api/v1/models` field that lists `video` input (`architecture.input_modalities`?), and whether `qwen/qwen3-vl-*` actually accept video on OR.
4. **[M0-verify]** QA the 1-fps limitation: does the hook package (clip + 4 fps frames + transcript) produce accurate cut counts and text timing on 20 labelled references? Is the slow-motion trick needed?
5. **[M0-verify]** Image-token cost per frame on Gemini 3.8 Flash at default vs `high` (for Hebrew/English OCR of on-screen text).
6. **[Counsel]** Is admin screen-recording of a public TikTok/IG post, stored privately for internal analysis only, acceptable under §19 fair use and the platforms' terms, or must references be limited to own, licensed, partner or customer content, public YouTube URLs and link-only notes?
7. **[Counsel]** Brodesky v. Armosa appellate status. How close can a "format" template get before it is format infringement? Is a similarity threshold defensible?
8. **[Counsel]** Consumer-protection exposure of AI actors in skit formats (POV, the ick). Is a "המחשה" label enough? Confirm the hard ban on AI testimonials and street interviews.
9. **[M0-verify]** Lyria 3 Pro output licence for **paid ads** when called through OpenRouter (Google's generative AI terms and indemnity). Plan B: a licensed stock-music API (not researched: Epidemic, Soundstripe, Artlist).
10. **[M0-verify]** Meta v26.0: the field for self-disclosing AI-generated creative on ads and Reels. Does C2PA survive our Remotion render and Meta's transcode?
11. **[M0-verify]** TikTok Creative Center **Top Ads** region list: is Israel included? Is the "approved for business use" song filter still present?
12. **[M0-verify]** Google Trends API alpha: apply with the commercial form. Get timeline, quota and price.
13. **[M0-verify]** YouTube Data API `chart=mostPopular` after the Trending page retirement. Does it still return regional (IL) results? Is it useful for Shorts?
14. **Open:** should we ever publish to TikTok? The scope here is Meta only. TikTok's Commercial Music Library would only matter if we upload to TikTok, and even then our burned-in music must be our own licence.
15. **Open:** curation staffing. Who curates 5–10 templates per week, which paid tools (Foreplay vs Minea) to buy, and should Hebrew sources (Israeli creators' public Reels) be link-only?
16. **Open:** benchmark privacy. Do aggregated cross-customer stats need explicit consent under the Israeli Privacy Protection Law amendment 13 (in force 2025; unverified) and Part 06's DPA?
17. **Open:** the ElevenLabs Scribe v2 discount ends 2026-10-19. Re-price `stt.default`, or compare `openai/whisper-large-v3` ($0.000008/s) for Hebrew accuracy.
