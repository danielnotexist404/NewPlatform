# 04 — OpenRouter capabilities for an AI video-generation SaaS (as of 2026-10-13)

Scope: what OpenRouter (openrouter.ai) can do **today** for a Hebrew-first platform that generates promo/branding videos ("סרטוני תדמית") and short-form social videos per niche, built on React + Node.js on Vercel + Supabase.

Method: about 30 web searches (WebSearch only; direct page fetch was blocked). The shared web-search budget ran out before every planned query had run. Gaps are listed in section 9. Every number below has a source. Prices change often: OpenRouter itself warns that "any figure more than a month old" is "a hint rather than a budget line" ([OpenRouter blog](https://openrouter.ai/blog/insights/image-generation-models-compared/)). Read `usage.cost` from live responses before you set customer prices.

---

## 0. TL;DR (the build prompt depends on these)

1. **One OpenRouter key now covers text, images, video, TTS, STT and music.** In 2026 OpenRouter launched:
   - a **Video Generation API**: async `POST /api/v1/videos` (returns 202 + job id), then poll or receive a webhook, then download. The announcement text is dated **2026-04-15** [corrected: https://openrouter.ai/blog/video-generation (date read from the announcement mirror https://api.ifq.ai/blog/announcements/video-generation/)]; async flow [verified: https://openrouter.ai/docs/guides/overview/multimodal/video-generation].
   - a **Unified Image API**: `POST /api/v1/images`, base64 in `data[0].b64_json`, optional `usage.cost` [verified: https://openrouter.ai/blog/tutorials/image-generation/].
   - **Audio APIs**: `POST /api/v1/audio/speech` and `POST /api/v1/audio/transcriptions`, announced **2026-05-01** with OpenAI GPT-4o Mini TTS, Google Gemini Flash TTS and Mistral Voxtral Mini TTS for speech and Whisper for transcription [verified: https://openrouter.ai/blog/announcements/announcing-audio-apis].
   - **ElevenLabs models**: 9 TTS models and 2 STT models (Scribe v2, Scribe v2 Medical). The earlier "2026-07-24" date was wrong: no July launch was found, and OpenRouter lists Eleven v4 / Scribe v2 as added **2026-10-07** (dated slugs `elevenlabs/eleven-v4-20260930`, `elevenlabs/scribe-v2-20260929`). All ElevenLabs models are 50% off through **2026-10-19 08:00 PT** [corrected: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/, https://openrouter.ai/elevenlabs].
   - **Lyria 3 Pro** music, **$0.08 per song**, released 2026-03-30 [verified: https://openrouter.ai/google/lyria-3-pro-preview].
   - **HeyGen Avatar IV**, a lip-synced talking head from a photo plus a script or audio, at $0.05/s, released 2026-08-24 [verified: https://openrouter.ai/heygen/avatar-iv].
   - a **Batch API** (beta): provider completes within a 24 h window, generally at 50% (sometimes less) of the per-token price, 70+ models; median beta batch finished in 7 min [verified: https://openrouter.ai/blog/announcements/batch-api]. The 2026-09-28 date is still from a third party (unverified) ([releasebot summary](https://releasebot.io/updates/openrouter)). A third-party guide says Batch is **text-only** (image/audio/video/file content rejected) (unverified) ([aireiter](https://aireiter.com/blog/openrouter-batch-api-pricing-guide)).
   - **US in-region routing** alongside EU (2026-09-22), and a **Security Center** for API keys (2026-10-07) (unverified; not re-checked in this round) ([same](https://releasebot.io/updates/openrouter)).
   - **Ownership change:** Stripe has agreed to acquire OpenRouter (reported at about $7–8B; terms not officially disclosed). OpenRouter already used Stripe for billing [verified: https://www.thestack.technology/stripe-acquires-openrouter-setting-up-a-battle-for-ai-routing-business/, https://betanews.com/article/stripe-reportedly-acquiring-ai-gateway-startup-openrouter-for-over-7-billion/]. No API changes were reported.
2. **Sora 2 is gone.** OpenAI shut down the Sora 2 API (the Videos API, `sora-2` and `sora-2-pro`) on **2026-09-24** and named no replacement ([aistackcurrent](https://www.aistackcurrent.com/news/openai-sora-api-shutdown/), [higgsfield](https://higgsfield.ai/blog/sora-api-migration-guide), [heydev](https://heydev.us/blog/openai-model-shutdowns-september-2026-audit-your-app)). Sora 2 Pro was in OpenRouter's launch lineup. OpenRouter's own model page says the model "will be removed on September 24, 2026" [verified: https://openrouter.ai/models/openai/sora-2-pro]. **Do not build on Sora.**
3. **Recommended video models on OpenRouter** (prices per second of output):
   - Veo 3.1 Lite: $0.03–0.08/s (no audio $0.03 at 720p to $0.05 at 1080p; with audio $0.05–0.08) [verified: https://openrouter.ai/google/veo-3.1-lite]
   - Veo 3.1 Fast: $0.08–0.30/s (no audio $0.08 at 720p to $0.25 at 4K; with audio $0.10–0.30) [verified: https://openrouter.ai/google/veo-3.1-fast]
   - Veo 3.1: $0.20–0.60/s (no audio $0.20 at 1080p to $0.40 at 4K; with audio $0.40–0.60), up to 4K. Durations: the guide shows 4/6/8 s but the list-models reference example shows 5/8 s (unverified; read `/api/v1/videos/models`) [verified: https://openrouter.ai/google/veo-3.1]
   - Seedance 2.0: from $0.06726/s at 480p up to $0.7776/s at 4K with audio [verified: https://openrouter.ai/bytedance/seedance-2.0]
   - Seedance 2.5: from $0.1028/s at 480p, 480p/720p, 4–30 s clips [verified: https://openrouter.ai/bytedance/seedance-2.5-20260807]
   - Kling v3.0: $0.084–0.168/s (std $0.084 no audio / $0.126 audio; pro $0.112 / $0.168), 3–15 s, 16:9 / 9:16 / 1:1, released 2026-04-29 [verified: https://openrouter.ai/kwaivgi/kling-v3.0-pro, https://openrouter.ai/kwaivgi/kling-v3.0-std-20260429]
   - Wan 3.0 (slug `alibaba/wan-3.0`): $0.0425/s at 480p to $0.17/s at 1080p, 2–30 s, with an audio track; Wan 3.0 Prime $0.068–0.28/s [corrected: https://openrouter.ai/alibaba/wan-3.0, https://openrouter.ai/alibaba/wan-3.0-prime]
   - Hailuo 2.3: $0.0817/s, 6 or 10 s clips, first-frame input [verified: https://openrouter.ai/minimax/hailuo-2.3]
   
   Sources: [OpenRouter I2V comparison](https://openrouter.ai/blog/insights/image-to-video-models-compared/) and the model pages above.
4. **Hebrew voice-over:** ElevenLabs Eleven v4 lists **Hebrew** (`heb`) among 90+ languages [verified: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4, https://elevenlabs.io/docs/overview/models]. It is available through OpenRouter as `elevenlabs/eleven-v4` (10,000 characters per request) [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/] at **$40/M characters**, a 50% launch discount that runs through 2026-10-19 08:00 PT [discount end verified: same URL]. List price is about $80/M (the $/M figures were not re-read in this round) ([OpenRouter](https://openrouter.ai/elevenlabs/eleven-v4)). Gemini 3.8 Flash TTS is on OpenRouter as `google/gemini-3.8-flash-tts` at $0.50/M input and $9/M output tokens [verified: https://openrouter.ai/google/gemini-3.8-flash-tts]; its Hebrew support comes from Google's docs and was not re-checked ([Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts)).
5. **Hebrew subtitles and word timestamps:** use `elevenlabs/scribe-v2` through OpenRouter at $0.000031/s, about $0.0019/min, which is the discounted price [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/]. Request `response_format: "verbose_json"` to get segments and word timestamps "when the routed provider supports them" [verified: https://openrouter.ai/elevenlabs/scribe-v2/llms.txt]. Whisper with `verbose_json` is described in an OpenRouter tutorial ([OpenRouter tutorial](https://openrouter.ai/blog/tutorials/transcription-on-openrouter/)); a `timestamp_granularities` field was not found in the STT docs (unverified).
6. **OpenRouter does not assemble or edit videos.** It only generates clips. A full 30–60 s promo with Hebrew text overlays, RTL captions, music and logo needs your own render step (Remotion or FFmpeg in a worker). This is an architectural conclusion, not a sourced fact.

---

## 1. Text / LLM via OpenRouter

### 1.1 Core API
| Item | Value | Source |
|---|---|---|
| Base URL | `https://openrouter.ai/api/v1` (OpenAI-compatible; OpenAI SDKs work by changing `baseURL`) | [TTS docs](https://openrouter.ai/blog/announcements/announcing-audio-apis/), [app-attribution docs](https://openrouter.ai/docs/app-attribution) |
| Chat endpoint | `POST https://openrouter.ai/api/v1/chat/completions` | [docs](https://openrouter.ai/docs/structured-outputs) |
| Auth | `Authorization: Bearer <OPENROUTER_API_KEY>` | standard; shown in all OpenRouter examples |
| Official TS SDK | `@openrouter/sdk` is the default TypeScript recommendation; the OpenAI SDK with `defaultHeaders` also works | [docs](https://openrouter.ai/docs/app-attribution) |
| Anthropic Messages-compatible endpoint | Exists. It takes a `fallbacks` parameter (max 3) that cannot be combined with `models` (400 error) | [model-fallbacks docs](https://openrouter.ai/docs/guides/routing/model-fallbacks) |

### 1.2 App attribution headers
- `HTTP-Referer: https://your-domain.co.il`: **required for attribution**. The URL is the app's unique ID. Without it, no app page is created and usage stays out of rankings [verified: https://openrouter.ai/docs/app-attribution].
- `X-OpenRouter-Title: <App name>`: the display name. **The older `X-Title` still works** for backwards compatibility. It must be sent together with `HTTP-Referer`; apps on `localhost` URLs must also send `X-OpenRouter-Title` to be tracked [verified: https://openrouter.ai/docs/app-attribution].
- `X-OpenRouter-Categories`: optional marketplace categories. One page says up to 2; unknown values are dropped silently ([rankings docs](https://openrouter.ai/docs/rankings)).

### 1.3 Structured outputs (JSON Schema)
- `response_format: { type: "json_schema", json_schema: { name, strict: true, schema } }`. With `strict: true`, providers that have a native strict mode enforce the schema exactly; other providers treat it as a strong hint, so **validate with Zod anyway**. A model that does not support structured outputs fails with an error [verified: https://openrouter.ai/docs/guides/features/structured-outputs].
- Support is decided **per endpoint (provider)**, not just per model; check the model's Providers section / `supported_parameters`. Set `provider: { require_parameters: true }` (default `false`) so requests only go to providers that support every parameter in the request. Without it, `response_format` is still used as a soft preference between providers of the same model [verified: https://openrouter.ai/docs/features/provider-routing, https://openrouter.ai/docs/guides/features/structured-outputs].
- Anthropic's structured outputs reportedly do not support numeric constraints such as `minimum`/`maximum`; describe ranges in field descriptions instead (third-party search snippet, source URL not captured; unverified). An OpenRouter blog example sends `require_parameters: true` together with `strict: true` [verified: https://openrouter.ai/blog/insights/confidence-thresholds-for-model-escalation-routing/].
- Streaming with structured outputs is reported to work, with partial JSON streamed until it completes. This comes from a docs mirror, not the official page (unverified) ([mirror](https://api.ifq.ai/docs/structured-outputs)).

### 1.4 Tool calling and streaming
- OpenAI-style `tools` / `tool_choice` and `stream: true` (SSE) are supported on compatible models. This is standard OpenAI-compatible behaviour; I did not re-verify the exact docs page in this run (unverified detail).
- New in 2026: **server tools**. Examples are `openrouter:image_generation`, which gives any model an image-generation tool ([docs](https://openrouter.ai/docs/guides/features/server-tools/image-generation)), and a hosted shell/bash tool plus a Files API (2026-09-09, beta) ([releasebot](https://releasebot.io/updates/openrouter)).

### 1.5 Routing and fallbacks
- **Model fallbacks:** `"models": ["primary", "fallback1", ...]`. OpenRouter tries them in order when it hits context-length errors, moderation flags, rate limits or downtime. You are billed for the model that actually served the request, which the response `model` field reports. In the OpenAI SDK, pass the array via `extra_body` ([docs](https://openrouter.ai/docs/guides/routing/model-fallbacks)).
- **Provider routing object:** `provider: { order: [...], allow_fallbacks: true|false, sort: "price"|"throughput"|"latency", require_parameters: true }`. `require_parameters` (boolean, default false) is [verified: https://openrouter.ai/docs/features/provider-routing]; the other field semantics come from third-party guides; `allow_fallbacks` defaults to true (partially unverified) ([api3 mirror blog](https://api3.shopot.ai/blog/insights/model-routing/), [skills.sh](https://www.skills.sh/jeremylongshore/claude-code-plugins-plus-skills/openrouter-fallback-config)).
- **Aliases:** `~anthropic/claude-sonnet-latest` and `~google/gemini-flash-latest`. These are billed at the price of whichever model serves them, so **pin exact IDs for stable costs** ([OpenRouter](https://openrouter.ai/~google/gemini-flash-latest)).
- **Data residency:** EU and US in-region routing ([releasebot](https://releasebot.io/updates/openrouter)).

### 1.6 Prompt caching
- Caching relies on provider sticky routing. For Anthropic you set `cache_control` breakpoints per message (max 4). Automatic top-level `cache_control` works only when the request goes directly to the Anthropic provider ([docs](https://openrouter.ai/docs/guides/best-practices/prompt-caching)).
- Anthropic cache writes cost 1.25× the input price and reads 0.1× (older docs version; verify) ([docs](https://openrouter.ai/docs/prompt-caching)). Gemini 2.5+ caches implicitly.
- The response reports `usage.prompt_tokens_details.cached_tokens` and `cache_write_tokens` ([docs](https://openrouter.ai/docs/guides/best-practices/prompt-caching)).
- **Use it for:** long, fixed system prompts such as the niche playbook, the brand-voice guide and the Hebrew style guide.

### 1.7 Usage accounting, credits, fees, rate limits, BYOK
- **Cost per request:** **every** response now includes full `usage` automatically (non-streaming: in the body; streaming: in the last SSE message), including `usage.cost` (charged to your account, in credits) and `cost_details.upstream_inference_cost` (BYOK). The old `usage: {include: true}` and `stream_options: {include_usage: true}` flags are **deprecated and have no effect** [corrected: https://openrouter.ai/docs/cookbook/administration/usage-accounting]. Stats can also be fetched later by response `id` via the `/generation` endpoint (same source). If a response arrives without a cost, record it as unknown rather than zero (OpenRouter tutorial advice, same search). For images, `usage.cost` is optional "when available" [verified: https://openrouter.ai/blog/tutorials/image-generation/].
- **Credits / platform fee:**
  - Card (non-crypto) top-ups: 5.5% fee, minimum $0.80 [verified: https://openrouter.ai/blog/announcements/simplifying-our-platform-fee/] (post dated 2025-06-09)
  - Crypto top-ups: 5%, no minimum [verified: same]
  - Business plan: 8% (unverified; third party only)
  - Inference itself is passed through at provider prices with no markup on most models (unverified)

  Sources: [truefoundry](https://www.truefoundry.com/blog/openrouter-pricing), [amnic](https://amnic.com/blogs/openrouter-pricing). The no-markup claim for video is also made by [note.com](https://note.com/lucky_allium8251/n/n87f100b52a20?hl=en) (unverified).
- **BYOK (bring your own provider key):** resolved.
  - Current: allowance measured in list-price inference cost, by plan. Pay-as-you-go gets **$25,000/month** with no BYOK fee; above that, 5% of what the same model/provider would cost on OpenRouter, deducted from credits; Enterprise is custom [verified: https://openrouter.ai/docs/faq, https://openrouter.ai/docs/guides/overview/auth/byok].
  - The October 2025 "1M free BYOK requests/month" policy is superseded; the announcement carries an August 2026 update note saying so [verified: https://openrouter.ai/blog/announcements/1-million-free-byok-requests-per-month/]. One older BYOK docs page still shows the 1M-request wording (stale).
- **Rate limits:**
  - Free (`:free`) model variants: 20 RPM. 50 requests/day if you have bought less than $10 in credits; 1,000/day at $10 or more ([checkthat](https://checkthat.ai/brands/openrouter/pricing), [whichdevtool](https://whichdevtool.com/tools/openrouter/)).
  - Paid models: no fixed public RPM was found in this run (unverified). Plan for 429 errors with retry/backoff and a `models` fallback.
- **Key security:**
  - Keep the key **server-side only**, in Vercel env vars, and never ship it to the React bundle.
  - Use one key per environment with a per-key credit limit.
  - The new Security Center (2026-10-07) can restrict keys to your network ([releasebot](https://releasebot.io/updates/openrouter)).

### 1.8 Batch API (useful for bulk niche/hook generation)
- Bundle requests into one POST. The provider completes within a 24 h window at generally 50% (sometimes less) of the per-token price. It is a **beta** covering 70+ models; in the two-week beta, the median batch finished in 7 minutes and 90% within an hour (observations, not an SLA) [verified: https://openrouter.ai/blog/announcements/batch-api]. Launch date 2026-09-28 per third party (unverified) ([releasebot](https://releasebot.io/updates/openrouter)).
- Limits (third party, unverified): text-only (image/audio/video/file content rejected at validation); a successful submit returns status `validating`; the discount applies to token prices only, so web-search calls bill at standard rates ([aireiter](https://aireiter.com/blog/openrouter-batch-api-pricing-guide)).
- Batch variants also appear as model slugs: `openai/gpt-6.1-sol:batch` at $1/$5 per M tokens [verified: https://openrouter.ai/openai/gpt-6.1-sol:batch], `google/gemini-3.8-flash:batch` at about $0.375/$1.875 [verified: https://openrouter.ai/google/gemini-3.8-flash-20260902:batch], and `anthropic/claude-sonnet-5.5:batch` at $1/$5 (aggregator figure; unverified on OpenRouter) ([OpenRouter](https://openrouter.ai/anthropic/claude-sonnet-5.5:batch), [computeprices](https://computeprices.com/providers/openrouter/models/claude-sonnet-5-5)).
- **Ideal for:** pre-generating the public Hebrew HOOKS library per niche overnight (text only, so images/videos for the library still go through the normal endpoints).

### 1.9 Which models for HEBREW marketing copy and scripts (Oct 2026)
**There is no 2026 Hebrew-specific creative-writing benchmark.** I found none. The Mafat/DICTA [Hebrew LLM Leaderboard](https://huggingface.co/spaces/hebrew-llm-leaderboard/leaderboard) exists, but its current ranking could not be read via search. Its chat-results dataset includes frontier API models such as Claude Haiku 4.5 ([HF dataset](https://huggingface.co/datasets/hebrew-llm-leaderboard/chat-results)). The recommendation is therefore based on general writing leadership plus price. **Run a blind native-speaker test on 20 real briefs before launch.**

| Role | Model (OpenRouter slug) | Price in / out per M tokens | Notes | Source |
|---|---|---|---|---|
| **Primary Hebrew copywriter** (scripts, hooks, CTAs) | `anthropic/claude-sonnet-5.5` | $2 / $10; 1M ctx [verified: https://openrouter.ai/compare/anthropic/claude-sonnet-5.5]; 128K out and cache read $0.20 per aggregator (unverified) | Claude is reported to hold 6 of the top 7 places on the Arena text leaderboard (general, not Hebrew) (unverified) | [OpenRouter](https://openrouter.ai/anthropic/claude-sonnet-5.5), [llmreference](https://www.llmreference.com/model/claude-sonnet-5-5), [benchlm](https://benchlm.ai/blog/posts/chatgpt-vs-claude-vs-gemini-2026) |
| Premium / "pro" tier | `anthropic/claude-opus-5.5` (unverified on OpenRouter) | $4 / $20; released 2026-09-22 per third parties | **No OpenRouter listing for `claude-opus-5.5` was found in this round.** The confirmed OpenRouter Opus slug is `anthropic/claude-opus-5` at **$5 / $25**, released 2026-07-24 [verified: https://openrouter.ai/anthropic/claude-opus-5]. Use `claude-opus-5` until 5.5 shows up in `/api/v1/models` | [metricnexus](https://metricnexus.ai/blog/claude-opus-5-5-benchmarks-pricing), [getmaxim](https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/openrouter/model/claude-opus-5.5) |
| Alternative / fallback | **`openai/gpt-6.1-sol`** (replaces `openai/gpt-6-sol`) | $2 / $10; cache read $0.10; 1.05M ctx; 128K out; released 2026-09-29 [corrected: https://openrouter.ai/openai/gpt-6.1-sol] | `openai/gpt-6-sol` ($2/$10, 1.05M ctx) still exists [verified: https://openrouter.ai/compare/openai/gpt-6-sol:batch]; `gpt-6.1-sol-pro` also exists ([OR compare](https://openrouter.ai/compare/openai/gpt-6.1-sol-pro)). Astra ($10/$50) and Luna ($0.10/$0.50) prices not re-checked (unverified). Third party reports a long-context surcharge above 272K input tokens (unverified) | [OpenRouter](https://openrouter.ai/openai/gpt-6.1-sol), [Astra](https://openrouter.ai/openai/gpt-6-astra), [Luna](https://openrouter.ai/openai/gpt-6-luna) |
| Cheap bulk (hooks library, classification, niche tagging) | `google/gemini-3.8-flash` | $0.75 / $3.75; cache read $0.075; 1M ctx; 65,536 max output; released 2026-09-02; batch variant at half price [verified: https://openrouter.ai/google/gemini-3.8-flash] | Good multimodal input (text/image/video/audio/PDF in); JSON-schema structured outputs supported; served by Google Vertex and AI Studio | [OpenRouter](https://openrouter.ai/google/gemini-3.8-flash) |
| Ultra-cheap utility | `openai/gpt-6-luna` | $0.10 / $0.50 (unverified this round) | For slugging, SEO meta and translation drafts | [OpenRouter](https://openrouter.ai/openai/gpt-6-luna) |
| Long-reasoning planner (storyboard JSON) | `google/gemini-3.1-pro-preview` | $2 / $12; 1,048,576 ctx; 65,536 out | The alias `~google/gemini-pro-latest` currently points to Gemini 3.1 Pro Preview, so no newer Gemini Pro exists on OpenRouter as of this check [verified: https://openrouter.ai/~google/gemini-pro-latest]. Release 2026-02-19 not re-checked | [OpenRouter](https://openrouter.ai/google/gemini-3.1-pro-preview) |

Suggested `models` fallback chain for Hebrew scripts: `["anthropic/claude-sonnet-5.5", "openai/gpt-6.1-sol", "google/gemini-3.8-flash"]` [corrected: https://openrouter.ai/openai/gpt-6.1-sol].

The top OpenRouter models by token volume (DeepSeek V4.1 Flash, GLM 5.3 Flash, MiMo-V2.6-Flash) are cheap Chinese models ([rankings](https://openrouter.ai/rankings)). Their Hebrew quality is unknown and they are not recommended for customer-facing Hebrew copy (unverified).

---

## 2. IMAGE generation via OpenRouter

### 2.1 Two ways to call
**A) Chat completions with output modalities**, used for Gemini "Nano Banana" and GPT-image chat models:
- Request: `modalities: ["image","text"]`. Optional `image_config: { aspect_ratio: "16:9", image_size: "2K" }`. `image_size` values: `1K` (standard, default), `2K`, `4K`; a `0.5K` option is supported by only one Gemini model [verified: https://openrouter.ai/docs/guides/overview/multimodal/image-generation].
- Response: images come in `choices[0].message.images[]` as `{ type: "image_url", image_url: { url: "data:image/png;base64,..." } }`, next to `message.content` text.

Sources: [OpenRouter image docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation), [OpenRouter blog](https://openrouter.ai/blog/tutorials/image-generation-models/), [open-webui issue](https://github.com/open-webui/open-webui/issues/18671), [LiteLLM](https://docs.litellm.ai/docs/providers/openrouter), [ClawHub](https://clawhub.ai/bawerlacher/openrouter-image-generation). The `image_size` field name is now confirmed in OpenRouter's own docs (see above).

**B) Unified Image API**: `POST https://openrouter.ai/api/v1/images` (new in 2026) [verified: https://openrouter.ai/blog/tutorials/image-generation/].
- Required fields: `model` and `prompt`.
- Optional: `input_references`, `aspect_ratio`, `resolution` [verified: https://openrouter.ai/blog/tutorials/image-generation-models/], or `size: "WxH"`. A conflicting `size` plus `resolution`/`aspect_ratio` returns a 400 (not re-checked). A third party lists resolution tiers `512, 768, 1K, 2K, 4K` (unverified) ([picassoia](https://blog.picassoia.com/openrouter-image-generation-models-api-and-pricing)).
- Providers clamp values to the subset they support (not re-checked).
- Response: base64 in `data[0].b64_json` (not a hosted URL), plus optional `usage.cost` "when available" [verified: https://openrouter.ai/blog/tutorials/image-generation/]; `media_type` not re-checked. Streaming is also supported; the completed event carries the same `usage` object [verified: https://openrouter.ai/docs/guides/overview/multimodal/image-generation].
- Discovery: `GET /api/v1/images/models` lists the allowed resolutions and aspect ratios per model (search did not surface this endpoint in this round; unverified). Image-only models often show $0 token prices on model pages, so trust `usage.cost` ([picassoia](https://blog.picassoia.com/openrouter-image-generation-models-api-and-pricing)).

Sources: [API ref](https://openrouter.ai/docs/api/api-reference/images/create-images), [list models](https://openrouter.ai/docs/api/api-reference/images/list-image-generation-models), [announcement](https://openrouter.ai/blog/announcements/image-api/).
- **Billing gotcha:** Seedream 5.0 Pro returned 2K by default and billed the $0.09 high-res rate instead of $0.045 ([image docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation)). Always set the resolution explicitly.

Aspect ratios listed: `1:1, 16:9, 9:16, 4:3, 3:2` (plus `auto`). Gemini supports extended ratios and 1K/2K/4K ([docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation)).

### 2.2 Image models and prices
OpenRouter measured 20 models on 2026-09-11 at 1024×1024 with default settings. The spread was $0.006 to $0.134 per image ([OpenRouter](https://openrouter.ai/blog/insights/image-generation-models-compared/)).

| Model (slug) | Price | Best for | Source |
|---|---|---|---|
| `openai/gpt-image-2` | **$0.006**/image at default/low quality in OpenRouter's test; quality setting moves the same image up to **$0.211** (OpenAI's own low/medium/high examples for 1024² are $0.006 / $0.053 / $0.211). Token prices on OpenRouter: $8/M input, $8/M output [verified: https://openrouter.ai/compare/openai/gpt-image-2/x-ai/grok-imagine-image-quality]; image output $30/M (mirror only; unverified) | Cheapest drafts; strong instruction following | [OpenRouter blog](https://openrouter.ai/blog/insights/image-generation-models-compared/), [model](https://openrouter.ai/openai/gpt-image-2), [costgoat](https://costgoat.com/pricing/openai-images) |
| `openai/gpt-5.4-image-2` | see page (not retrieved) | Chat-style image and text | [OpenRouter](https://openrouter.ai/openai/gpt-5.4-image-2) |
| `google/gemini-3.1-flash-image` (**Nano Banana 2**; GA slug released 2026-06-18; a `google/gemini-3.1-flash-image-preview` slug from 2026-02-26 has the same prices) | $0.50/M input, $3/M text output, **$60/M image-output tokens**; OpenRouter's own test billed **$0.067** for one 1024×1024 PNG [verified: https://openrouter.ai/google/gemini-3.1-flash-image, https://openrouter.ai/blog/insights/image-generation-models-compared/] | Edits, consistent characters, product shots; 1K/2K/4K | [OpenRouter](https://openrouter.ai/google/gemini-3.1-flash-image) |
| `google/gemini-3.1-flash-lite-image` (**Nano Banana 2 Lite**, new) | $0.25/M input, $30/M image output (its FAQ also quotes $1.50/M output; conflict) [verified: https://openrouter.ai/google/gemini-3.1-flash-lite-image] | Cheaper drafts; returned no text in 0 of 2 test calls ([OR blog](https://openrouter.ai/blog/insights/image-generation-models-compared/)) | same |
| `google/gemini-3-pro-image` (Nano Banana Pro; GA slug released 2026-06-18; `google/gemini-3-pro-image-preview` from 2025-11-20 also listed) | $2/M input, **$120/M output** in the page header (its FAQ says $12/M; conflict); pricing is "dynamic" and finalized per job [verified: https://openrouter.ai/google/gemini-3-pro-image]; **$0.134**/image in OpenRouter's test when the reply also needs text | Highest-quality keyframes and text rendering | [OpenRouter blog](https://openrouter.ai/blog/insights/image-generation-models-compared/), [preview page](https://openrouter.ai/google/gemini-3-pro-image-preview) |
| `google/gemini-2.5-flash-image` (Nano Banana v1) | about $0.039 per 1024² image (older figure) | Legacy | [UF docs](https://docs.ai.it.ufl.edu/docs/navigator_models/models/google-gemini-2.5-flash-image) |
| ByteDance Seedream 4.5 | $0.04 flat (another listing says $0.05) | Photoreal marketing stills | [OpenRouter blog](https://openrouter.ai/blog/insights/image-generation-models-compared/) |
| Seedream 5.0 family | from $0.018/image; Pro $0.045 at 1K, $0.09 at high res | Cheap photoreal | same, [docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation) |
| FLUX.2 Pro | $0.03 per **megapixel** | Photoreal and artistic | [OpenRouter blog](https://openrouter.ai/blog/insights/image-generation-models-compared/) |

**Hebrew text inside generated images:** I found no evidence that any of these models renders Hebrew (RTL) text reliably. **Recommendation:** generate images and video **without text**, then overlay Hebrew headlines, captions and CTAs in your own render layer (Remotion/CSS with a Hebrew web font, for example Heebo or Assistant). This is a design recommendation, not a sourced fact.

---

## 3. VIDEO generation via OpenRouter: **AVAILABLE** (launched April 2026)

### 3.1 Facts
- **Launch:** the announcement text is dated **2026-04-15** [corrected: https://openrouter.ai/blog/video-generation (date from the announcement mirror https://api.ifq.ai/blog/announcements/video-generation/)]. Earlier third-party dates of 16 and 22 April are superseded ([kucoin](https://www.kucoin.com/news/flash/openrouter-launches-video-generation-api-integrating-sora-2-veo-3-1-seedance), [note.com](https://note.com/lucky_allium8251/n/n87f100b52a20?hl=en)).
- **Launch lineup:** Seedance 2.0/1.5, Veo 3.1, Wan 2.7/2.6, Sora 2 Pro; text-to-video and image-to-video on day one [verified: https://openrouter.ai/blog/video-generation]. Later additions: Kling (O1, v3.0 on 2026-04-29), Hailuo 2.3 (2026-04-20), Veo 3.1 Lite, Seedance 2.5 (dated slug 2026-08-07), Wan 3.0 / 3.0 Prime (2026-08-24/27), H3 / H3 Max, LTX 2.5, HeyGen, plus `black-forest-labs/flux-3-video`, `black-forest-labs/flux-video-upscale` and `x-ai/grok-imagine-video` (slugs seen on OpenRouter compare pages; prices not retrieved) ([OpenRouter](https://openrouter.ai/blog/announcements/video-generation/), [April spotlight](https://openrouter.ai/blog/announcements/april-release-spotlight/), [OR compare](https://openrouter.ai/compare/alibaba/wan-3.0-prime/black-forest-labs/flux-3-video), [OR compare](https://openrouter.ai/compare/minimax/hailuo-3-max/x-ai/grok-imagine-video)).
- **API shape: asynchronous jobs** [verified: https://openrouter.ai/docs/guides/overview/multimodal/video-generation, https://openrouter.ai/docs/api/api-reference/video-generation/poll-video-generation-status].
  1. `POST https://openrouter.ai/api/v1/videos` with `{model, prompt, ...}` returns **HTTP 202** with `{ id, polling_url, status: "pending" }`. **Submitting starts a real job and spends credits.** The API reference shows `polling_url` as a **relative** path (`/api/v1/videos/job-abc123`) while the guides show a full URL, so resolve it against `https://openrouter.ai`.
  2. Poll `polling_url` (same resource as `GET /api/v1/videos/{id}`) about every 30 s. Statuses: `pending → in_progress → completed | failed | cancelled | expired` (the last three are terminal errors).
  3. On `completed`, the `unsigned_urls[]` array points to `GET /api/v1/videos/{id}/content?index=0`. Despite the name they are **not presigned: this URL requires the `Authorization: Bearer` header**. The endpoint streams binary video from the upstream provider and returns JSON errors (401 on bad auth) [verified: https://openrouter.ai/docs/api/api-reference/video-generation/download-generated-video-content]. So the server must download the file and re-host it, for example in Supabase Storage.

  Sources: [API ref](https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request), [cookbook](https://openrouter.ai/docs/cookbook/video-generation/text-to-video), [skill](https://openrouter.ai/skills/openrouter-video), [code-first tutorial](https://openrouter.ai/blog/tutorials/video-generation-api/).
- **Webhooks: yes** [verified: https://openrouter.ai/docs/cookbook/video-generation/video-generation-webhooks].
  - `callback_url` (HTTPS) per request, which overrides a workspace-level default [verified: https://openrouter.ai/docs/guides/overview/multimodal/video-generation].
  - Needs a **workspace signing secret**. OpenRouter POSTs a `video.generation` event when the job reaches a terminal state (`completed`, `failed`, `cancelled` or `expired`). Each delivery carries `X-OpenRouter-Signature` and `X-OpenRouter-Idempotency-Key` (job id + status). Verify against the **raw request body** before JSON parsing [verified: https://openrouter.ai/docs/cookbook/video-generation/video-generation-webhooks].
  - Signature format `t=<timestamp>,v1=<hex HMAC-SHA256 of timestamp + raw body>` and a ~5-minute replay window come from the official skill summary, not the cookbook text (partially unverified) ([skills.sh openrouter-video](https://skills.sh/openrouterteam/skills/openrouter-video)). Respond 2xx (the cookbook's local test expects 204; bad signature → 401).
  - [corrected] The earlier third-party event names `video.generation.completed` / `video.generation.failed` were incomplete: there are four terminal statuses ([TanStack issue #707](https://github.com/TanStack/ai/issues/707)).
- **Parameters, normalised across providers** [verified: https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request, https://openrouter.ai/docs/guides/overview/multimodal/video-generation]:
  - `model` (required); `prompt` (required for text-to-video; optional for models that can animate from image input alone)
  - `duration` (integer seconds; must be one of the model's `supported_durations`)
  - `resolution` (for example `480p|720p|1080p|4K`)
  - `aspect_ratio` (`16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9, 9:21`), or `size: "WxH"` instead (interchangeable with resolution + aspect_ratio)
  - `generate_audio` (boolean; defaults to the endpoint's capability flag, otherwise false)
  - `seed` (optional; determinism not guaranteed by all providers)
  - `frame_images[]`: each item is `{ type: "image_url", image_url: { url }, frame_type: "first_frame" | "last_frame" }` (TS SDK uses camelCase `imageUrl` / `frameType`). The image must be a **public HTTPS URL** that returns 200 with an image content type (no cookies, HTML redirects or bot checks). Including it switches the request to image-to-video, and it wins over `input_references` [verified: https://openrouter.ai/docs/cookbook/video-generation/image-to-video, https://openrouter.ai/docs/client-sdks/typescript/models/frameimage.md]
  - `input_references`: references for reference-to-video. Accepts image, audio and video references, but audio/video are honoured only by providers that support them, such as BytePlus Seedance 2.0 and newer. Seedance 2.5 accepts up to 50 references (not re-checked) [verified: https://openrouter.ai/docs/cookbook/video-generation/reference-to-video]
  - `callback_url` (see webhooks)
  - provider-specific passthrough options, nested as `provider: { options: { "<provider-slug>": { ... } } }`, for example `"google-vertex": { "negativePrompt": "..." }`. The allowed keys per model are in `allowed_passthrough_parameters` [verified: https://openrouter.ai/docs/projects/docs/cookbook/video-generation/provider-specific-video-options]

  Out-of-range values return 400; validate client-side against `/api/v1/videos/models`. Sources: [API ref](https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request), [skill](https://openrouter.ai/skills/openrouter-video), [reference-to-video cookbook](https://openrouter.ai/docs/projects/docs/cookbook/video-generation/reference-to-video), [provider options cookbook](https://openrouter.ai/docs/cookbook/video-generation/provider-specific-video-options).
- **Discovery:** `GET https://openrouter.ai/api/v1/videos/models` returns a `data[]` array; each entry has `supported_durations` (int[] or null), `supported_resolutions`, `supported_aspect_ratios`, `supported_sizes`, `supported_frame_images`, `generate_audio`, `seed`, `allowed_passthrough_parameters` and **`pricing_skus`** (record of string prices, for example `per-video-second`, `per-video-second-1080p`) [verified: https://openrouter.ai/docs/api/api-reference/video-generation/list-all-video-generation-models, https://openrouter.ai/docs/client-sdks/python/components/videomodel.md]. The docs' example values disagree with each other and with the model pages (for example Veo 3.1 at "0.50"/s), so treat examples as illustrative. **Build the UI and the price table from this endpoint, not from hard-coded lists.**
- **Pricing:** per second of output. OpenRouter is reported to add no markup to provider prices (unverified) ([note.com](https://note.com/lucky_allium8251/n/n87f100b52a20?hl=en)).

### 3.2 Video model table (OpenRouter, Sep–Oct 2026)
| Slug | $/second | Resolution / duration | Audio | Keyframes | Source |
|---|---|---|---|---|---|
| `google/veo-3.1` | $0.20–$0.60 (no audio $0.20 at 1080p → $0.40 at 4K; audio $0.40 → $0.60) [verified: https://openrouter.ai/google/veo-3.1] | up to 4K; 4/6/8 s per guide, 5/8 s in the list-models example (unverified) | native audio (doubles price at 1080p) | first and last frame | [OR comparison](https://openrouter.ai/blog/insights/image-to-video-models-compared/) |
| `google/veo-3.1-fast` | $0.08–$0.30 (no audio $0.08 at 720p → $0.25 at 4K; audio $0.10 → $0.30) [verified: https://openrouter.ai/google/veo-3.1-fast] | 720p–4K; 4/6/8 s (not re-checked) | yes | yes | same |
| `google/veo-3.1-lite` | **$0.03–$0.08** (no audio $0.03 at 720p → $0.05 at 1080p; audio $0.05 → $0.08) [verified: https://openrouter.ai/google/veo-3.1-lite] | 720p/1080p; 4/6/8 s (not re-checked) | yes | first and last frame [verified: https://openrouter.ai/docs/cookbook/video-generation/image-to-video] | same, [I2V cookbook](https://openrouter.ai/docs/cookbook/video-generation/image-to-video) |
| `bytedance/seedance-2.0` | from $0.06726 (480p) up to $0.7776 (4K, audio); lower rate for video-input requests [verified: https://openrouter.ai/bytedance/seedance-2.0] | 480p–4K; 4–15 s | yes | yes | [OR comparison](https://openrouter.ai/blog/insights/image-to-video-models-compared/), [ref-to-video cookbook](https://openrouter.ai/docs/projects/docs/cookbook/video-generation/reference-to-video) |
| `bytedance/seedance-2.0-fast` | from $0.04035 (480p) up to $0.8165 (4K, audio) [verified: https://openrouter.ai/bytedance/seedance-2.0-fast]; the dated slug `seedance-2.0-fast-20260414` shows from $0.0538 / up to $1.089 (conflict) | 4–15 s | yes | yes | same |
| `bytedance/seedance-2.0-mini` | from $0.03363 (unverified: not found on OpenRouter pages in this round) | — | — | — | [OR comparison](https://openrouter.ai/blog/insights/image-to-video-models-compared/) |
| `bytedance/seedance-2.5` | from $0.1028 (480p); video-input requests from $0.06149; OpenRouter 720p rate not found (ByteDance's token formula gives about $0.2311/s at 720p; unverified) [verified: https://openrouter.ai/bytedance/seedance-2.5-20260807] | 480p/720p; **4–30 s**; up to 50 references | yes | yes | [OR](https://openrouter.ai/bytedance/seedance-2.5), [review](https://openrouter.ai/blog/insights/seedance-2-5-review/), [ofox](https://ofox.ai/blog/seedance-2-5-price-audit-bytedance-formula-2026/) |
| `kwaivgi/kling-v3.0-pro` | $0.112 (no audio) / $0.168 (audio) [verified: https://openrouter.ai/kwaivgi/kling-v3.0-pro] | 3–15 s; 16:9, 9:16, 1:1; released 2026-04-29 | optional | first and last frame | [OR comparison](https://openrouter.ai/blog/insights/image-to-video-models-compared/) |
| `kwaivgi/kling-v3.0-std` | $0.084 / $0.126 [verified: https://openrouter.ai/kwaivgi/kling-v3.0-std-20260429] | 720p max; 3–15 s; 16:9, 9:16, 1:1 | optional | first and last frame | [OR compare](https://openrouter.ai/compare/bytedance/seedance-2.5/kwaivgi/kling-v3.0-std), [agenticcommons](https://agenticcommons.xyz/blog/openrouter-image-to-video-four-lines-compared-en/) |
| `kwaivgi/kling-video-o1` | n/a | — | — | — | [OR compare](https://openrouter.ai/compare/kwaivgi/kling-video-o1/minimax/hailuo-2.3) |
| **`alibaba/wan-3.0`** (was listed as `alibaba/wan-3`) | **$0.0425 (480p) – $0.17 (1080p)**; a 15% discount banner was shown | 480p–1080p; 2–30 s | yes (matching audio track) | **first frame only** | [corrected: https://openrouter.ai/alibaba/wan-3.0], dated slug `alibaba/wan-3.0-20260824`, [PraisonAI issue](https://github.com/MervinPraison/PraisonAI/issues/5173) |
| `alibaba/wan-3.0-prime` (new) | $0.068 (480p) – $0.28 (1080p) | 480p–1080p; 2–30 s; "fast-mode" variant | — | first frame | [verified: https://openrouter.ai/alibaba/wan-3.0-prime], dated slug `alibaba/wan-3.0-prime-20260827` |
| `alibaba/wan-2.7` | n/a | n/a | n/a | n/a | mentioned only (in the launch lineup) |
| `minimax/hailuo-2.3` | $0.0817 (flat) [verified: https://openrouter.ai/minimax/hailuo-2.3] | 6 or 10 s; released 2026-04-20 | — | first frame | [OR](https://openrouter.ai/minimax/hailuo-2.3) |
| `minimax/hailuo-3` (H3) | $0.13 video output + $0.04 per reference image (first 5 free) [verified: https://openrouter.ai/minimax/hailuo-3] | open-weights model for multimodal editing and controlled generation | — | — | [OR](https://openrouter.ai/minimax/hailuo-3) |
| `minimax/hailuo-3-max` (H3 Max) | **from $0.05** (previously listed here as from $0.13) | faster variant | — | — | [corrected: https://openrouter.ai/compare/minimax/hailuo-3-max/x-ai/grok-imagine-video] |
| `lightricks/ltx-2.5-fast` | n/a | 2–20 s | — | — | [mer.vin](https://mer.vin/2026/09/which-ai-video-models-actually-take-a-first-and-last-frame/) |
| `runway/gen-4.5` | n/a (OR llms.txt page exists) | — | — | — | [OR](https://openrouter.ai/runway/gen-4.5/llms.txt) |
| `heygen/heygen-video-1` | $0.01 (480p) – $0.045 (2K) (not re-checked) | not an avatar product; dated slug `heygen-video-1-20260930` exists | — | — | [OR](https://openrouter.ai/heygen/heygen-video-1), [dated](https://openrouter.ai/heygen/heygen-video-1-20260930) |
| `heygen/avatar-iv` | **$0.05** (single price; no separate audio-input charge listed) [verified: https://openrouter.ai/heygen/avatar-iv] | 720p/1080p; 16:9, 9:16, 1:1; released 2026-08-24; one provider | photo plus script (HeyGen TTS) **or** your audio file, lip-synced | — | [OR](https://openrouter.ai/heygen/avatar-iv), dated slug [`avatar-iv-20260625`](https://openrouter.ai/heygen/avatar-iv-20260625) |
| ~~`openai/sora-2-pro`~~ | — | — | — | — | **OpenAI API shut down 2026-09-24**; OpenRouter's page says the model "will be removed on September 24, 2026" [verified: https://openrouter.ai/models/openai/sora-2-pro] |

**Cost example:** a 9:16 Reel built from 4 clips of 6 s each (24 s total) on Veo 3.1 Lite costs about $0.72–$1.92. On Veo 3.1 at 1080p with audio ($0.40/s, verified above) the same Reel costs about $9.60. On Wan 3.0 at 480p ($0.0425/s) it is about $1.02. Calculation: price/s × seconds.

**Recommended tiering for the SaaS:**
- **Draft/preview tier:** Seedance 2.0-fast, Wan 3.0 at 480p ($0.0425/s, first frame only) or Veo 3.1 Lite at 720p ($0.03/s without audio). Seedance 2.0-mini was not found on OpenRouter in the re-check (unverified).
- **Standard tier:** Kling v3.0 std or Seedance 2.0 at 720p.
- **Premium tier:** Veo 3.1 at 1080p with native audio, or Seedance 2.5 for longer 15–30 s shots with many reference images. Reference images keep brand and product consistent.

### 3.3 Alternatives if you go outside OpenRouter (lower priority now)
- **fal.ai:**
  - Veo 3.1: $0.20/s without audio and $0.40/s with audio at 720p/1080p; $0.40/$0.60 at 4K; Fast from $0.10/s ([fal](https://fal.ai/models/fal-ai/veo3.1))
  - Kling 3.0 Pro: $0.112 / $0.168 per second, the same as on OpenRouter ([fal learn](https://fal.ai/learn/tools/seedance-2-0-vs-kling-3-0))
  - Seedance 2.0: about $0.30/s standard, $0.24/s fast ([higgsfield](https://higgsfield.ai/blog/seedance-2-0-pricing-2026)); likely at a higher resolution than OpenRouter's 480p floor
  - Queue API (from prior knowledge, **not re-verified in this run**): `POST https://queue.fal.run/{model}` with an optional `?fal_webhook=<url>` returns a `request_id`; poll `/requests/{id}/status` and fetch `/requests/{id}`; header `Authorization: Key $FAL_KEY`
  - Failed requests and queue time are not billed ([teamday](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026))
  - fal is useful for models OpenRouter lacks, such as OmniHuman, sync lipsync and Kling Avatar.
- **Replicate:** Seedance 2.0 at 720p is about $0.18/s ([teamday](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026)).
- **Not researched in this run** (search budget exhausted): Google Gemini API Veo direct, Runway API, Kling API, Luma API.

---

## 4. AUDIO

### 4.1 TTS (voice-over) via OpenRouter
**Endpoint:** `POST https://openrouter.ai/api/v1/audio/speech` [verified: https://openrouter.ai/blog/announcements/announcing-audio-apis] (announced 2026-05-01). It is OpenAI-Audio-Speech-compatible: body `{model, input, voice, response_format}` (body fields not re-checked). It returns **raw audio bytes** you can pipe straight to a file [verified: same], not JSON. Discover models with `GET /api/v1/models?output_modalities=speech` (not re-checked). When you switch provider, change the model and the voice together. Sources: [announcement](https://openrouter.ai/blog/announcements/announcing-audio-apis/), [docs](https://openrouter.ai/docs/guides/overview/multimodal/tts), [tutorial](https://openrouter.ai/blog/tutorials/text-to-speech/).

| Model | Hebrew? | Price | Source |
|---|---|---|---|
| `elevenlabs/eleven-v4` (dated slug `elevenlabs/eleven-v4-20260930`; added to OpenRouter 2026-10-07) | **Yes.** Hebrew is listed in the v4 language list (90+ languages); ISO code `heb` [verified: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4, https://elevenlabs.io/docs/overview/models] | **$40/M characters** on OpenRouter (50% off through 2026-10-19 08:00 PT [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/]; the $/M figures and list price of about $80/M were not re-read). Max 10,000 characters per request [verified: same]; supports audio tags | [ElevenLabs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4), [OR](https://openrouter.ai/elevenlabs/eleven-v4), [OR llms.txt](https://openrouter.ai/elevenlabs/eleven-v4/llms.txt) |
| `elevenlabs/eleven-v4-turbo` (dated `-20260930`) | Yes (v4 and v4 Turbo both 90+) | **Half the v4 rate** [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/], so $20/M characters discounted (list about $40/M). Character limit: OpenRouter pages disagree (10,000 vs 30,000) | [OR](https://openrouter.ai/elevenlabs/eleven-v4-turbo), [eesel](https://www.eesel.ai/blog/eleven-v4-pricing) |
| `elevenlabs/eleven-v3`, `elevenlabs/eleven-v3-conversational`, Multilingual v2, Flash v2.5, `elevenlabs/eleven-turbo-v2` | v3: Hebrew support not explicitly confirmed (unverified). Flash v2.5 supports 32 languages and 40,000 characters per request [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/] | v3 list about $80/M (third party); 5,000 characters per request | [OR llms.txt](https://openrouter.ai/elevenlabs/eleven-v3/llms.txt), [OR v3 conversational](https://openrouter.ai/elevenlabs/eleven-v3-conversational-20260930), [texttolab](https://texttolab.com/blog/elevenlabs-pricing) |
| `google/gemini-3.1-flash-tts-preview` | Hebrew (he-IL) listed as **preview** on Google Cloud (not re-checked) | $1/M input tokens, $20/M output tokens (not re-checked) | [Google Cloud](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts), [OR](https://openrouter.ai/google/gemini-3.1-flash-tts-preview) |
| **`google/gemini-3.8-flash-tts`** (dated `-20260922`; released 2026-09-23) | Hebrew listed per Google (130 languages; not re-checked); #1 in OpenRouter speech rankings (not re-checked) | **$0.50/M input, $9/M output tokens**; 8K context; one provider; 30 prebuilt voices plus Voice Design / Voice Replication via `voice_` ids [verified: https://openrouter.ai/google/gemini-3.8-flash-tts] | [Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts), [OR rankings](https://openrouter.ai/rankings/speech) |
| `openai/gpt-4o-mini-tts-2025-12-15`; Mistral Voxtral Mini TTS | Hebrew quality not verified (unverified) | n/a | GPT-4o Mini TTS and Voxtral Mini TTS were launch providers [verified: https://openrouter.ai/blog/announcements/announcing-audio-apis] |
| Azure he-IL neural voices (`he-IL-AvriNeural`, `he-IL-HilaNeural`) | Long-standing Hebrew voices (from prior knowledge; **not re-verified, search budget exhausted**) | not verified | — |

**Recommendation:** use ElevenLabs v4 (or v4 Turbo for previews) through OpenRouter as the default Hebrew narrator. Offer Gemini 3.8 Flash TTS as a cheaper alternative. A native speaker must QA niqqud-less pronunciation, for example of brand names and numbers. Pre-process numbers and English words in the script with the LLM.

### 4.2 STT and word-level timestamps (for animated Hebrew subtitles)
- **Endpoint:** `POST /api/v1/audio/transcriptions`. JSON body: `{ model, input_audio: { data: "<base64, raw bytes, NO data: URI prefix>", format: "wav"|"mp3"|"flac"|... }, language?: "<ISO-639-1>", temperature?: 0–1, provider?: {...} }`. An OpenAI-style `multipart/form-data` file upload is also accepted, **max 25 MB**; send larger files as base64 JSON. The default response is JSON with the transcript `text` and optional usage [corrected: https://openrouter.ai/docs/guides/overview/multimodal/stt, https://openrouter.ai/docs/api/api-reference/stt/create-transcription.md].
- **`elevenlabs/scribe-v2`** (dated `-20260929`; one provider): word-level timestamps, optional speaker diarization and audio-event tags in 90+ languages [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/]. Hebrew is in ElevenLabs' Scribe language list ([ElevenLabs Hebrew STT](https://elevenlabs.io/speech-to-text/hebrew)). Price is **$0.000031/s, about $0.0019/min** (50% off) [verified: same]; list $0.000061/s (not re-checked). `elevenlabs/scribe-v2-medical` has the same price. Realtime (WebSocket) Scribe is not offered on OpenRouter [verified: same]. The request-option name for diarization is not documented; an unsupported audio option returns 400 ([OR llms.txt](https://openrouter.ai/elevenlabs/scribe-v2/llms.txt)).
- **Word timestamps:** `response_format: "verbose_json"` "can additionally return language, duration, segments, and word timestamps when the routed provider supports them" [verified: https://openrouter.ai/elevenlabs/scribe-v2/llms.txt]. The exact shape of word entries and a `timestamp_granularities` field were not found in the docs (unverified); test with one real Hebrew file before building the caption parser.
- **Whisper:** `openai/whisper-1`, `openai/whisper-large-v3` ($0.000008/s) and `openai/whisper-large-v3-turbo` (not re-checked) ([OR tutorial](https://openrouter.ai/blog/tutorials/transcription-on-openrouter/), [collection](https://openrouter.ai/collections/speech-to-text-models)).
- **Tip:** you already have the script text, so you can align TTS audio to the known text. Scribe word timestamps on your own TTS output give exact caption timing.
- **Not researched in this run:** Deepgram Hebrew support.

### 4.3 Music
- **`google/lyria-3-pro-preview` on OpenRouter:** flat **$0.08 per full-length song**, released 2026-03-30, one provider [verified: https://openrouter.ai/google/lyria-3-pro-preview]; dated slug `google/lyria-3-pro-preview-20260330`. 48 kHz stereo, structured songs (verses/choruses), WAV/MP3; up to about 3-minute songs per a third-party directory (unverified). It is called through chat completions with audio output and streaming (not re-checked) ([OpenClaw docs](https://docs.openclaw.ai/tools/music-generation)). A `:free` variant was not confirmed.
- **Lyria 3 clip model:** about $0.04/clip (third party) ([GitHub issue](https://github.com/openclaw/openclaw/issues/82429)).
- **Google Lyria 3.5:** reportedly $0.08/song on Google directly; may not be on OpenRouter yet ([teamday](https://www.teamday.ai/blog/best-ai-music-models-2026)).
- **ElevenLabs Music v2.5** (2026-09-11): **not on OpenRouter**. The direct API is about $0.15/min (third party) ([teamday](https://www.teamday.ai/blog/best-ai-music-models-2026), [TechCrunch on the earlier model](https://techcrunch.com/2026/05/27/elevenlabss-new-music-generation-model-can-switch-genres-mid-track/)).
- Many video models (Veo 3.1, Kling, Seedance) can generate native audio (SFX and ambience) with `generate_audio: true`. This is not a replacement for a music bed.
- **Not researched:** Suno API, Stable Audio.

---

## 5. Lip-sync / talking avatars (Hebrew)
| Option | Shape | Price | Hebrew | Source |
|---|---|---|---|---|
| **`heygen/avatar-iv` via OpenRouter** | `/api/v1/videos`: input text + image + audio → video; photo plus script **or** audio track. Passthrough options: voice, expressiveness, motion prompt, background removal, captions (passthrough list not re-checked) | **$0.05/s** (about $3/min), single price; 720p/1080p; 16:9, 9:16, 1:1; released 2026-08-24 [verified: https://openrouter.ai/heygen/avatar-iv] | Pass your own ElevenLabs Hebrew audio, so Hebrew does not depend on HeyGen TTS | [OR](https://openrouter.ai/heygen/avatar-iv) |
| HeyGen API direct | credits, pay-as-you-go from $5 | Avatar III about $1/min; Avatar IV photo about $3–4/min; Avatar V twin up to about $7.20/min; translation with lip-sync $2–4/min | Hebrew lip-sync not confirmed (unverified) | [diyai](https://diyai.io/ai-tools/video-generation/heygen-pricing/), [sume](https://www.sume.com/blog/heygen-api-pricing), [G2](https://www.g2.com/articles/heygen-api-pricing) |
| sync.so `lipsync-2-pro` | lip-syncs existing footage to new audio | $0.067–$0.083/s (about $4–5/min), plus a subscription | language-agnostic, audio-driven | [sync.so pricing](https://sync.so/pricing), [docs](https://sync.so/docs/models/lipsync) |
| Hedra Character-3 | portrait plus audio | $0.025/s (540p), $0.05/s (720p), $0.0625/s (1080p), third party | audio-driven | [magichour](https://magichour.ai/blog/guide-to-hedra-ai) |
| OmniHuman 1.5 / Kling Avatar 2.0 | portrait plus audio, up to about 30 s+ | via fal/WaveSpeed/Kie (prices not retrieved) | audio-driven | [piapi](https://piapi.ai/blogs/omnihuman-1-5-vs-kling-ai-avatar), [kie](https://kie.ai/kling-ai-avatar), [WaveSpeed](https://wavespeed.ai/collections/avatar-lipsync) |

None of these were found on OpenRouter except HeyGen.

---

## 6. CAPABILITY MATRIX (definitive recommendation for the build)

| Task | Recommended provider / model | API shape | Approx. cost per unit | Source |
|---|---|---|---|---|
| Niche analysis, storyboard and scene JSON | OpenRouter `anthropic/claude-sonnet-5.5` (fallbacks `openai/gpt-6.1-sol` [corrected from `gpt-6-sol`], `google/gemini-3.8-flash`) | `POST /api/v1/chat/completions` + `response_format.json_schema` (`strict: true`) + `provider.require_parameters: true` + `models[]` | $2/$10 per M tokens (verified); about $0.01–0.03 per storyboard (estimate) | §1 |
| Hebrew hooks, captions, CTAs | same, with prompt caching of the style guide | chat + json_schema | same | §1 |
| Bulk HOOKS library (SEO pages) | `google/gemini-3.8-flash:batch` (verified, about $0.375/$1.875) or `openai/gpt-6.1-sol:batch` ($1/$5, verified); `claude-sonnet-5.5:batch` (aggregator price only) | Batch API (beta, 24 h window, text-only per third party) | generally 50% off | §1.8 |
| Keyframes / product stills | `google/gemini-3.1-flash-image` (Nano Banana 2, about $0.067/image at 1K); `google/gemini-3.1-flash-lite-image` or `openai/gpt-image-2` for cheap drafts; `google/gemini-3-pro-image` for premium | `POST /api/v1/images` (or chat with `modalities` + `image_config.image_size`) | $0.006–$0.134 per image | §2 |
| Image to video (main path) | Draft: `google/veo-3.1-lite` / `bytedance/seedance-2.0-fast` / `alibaba/wan-3.0` (480p). Standard: `kwaivgi/kling-v3.0-std` / `bytedance/seedance-2.0`. Premium: `google/veo-3.1`, `bytedance/seedance-2.5` | `POST /api/v1/videos` (async, 202) → `callback_url` webhook (`X-OpenRouter-Signature`) or polling → `GET /videos/{id}/content` with Bearer auth | $0.03–$0.60 per second | §3 |
| Talking-head presenter | `heygen/avatar-iv` via OpenRouter | `/api/v1/videos` | $0.05/s (verified) | §5 |
| Hebrew voice-over | `elevenlabs/eleven-v4` (premium), `elevenlabs/eleven-v4-turbo` (preview, half the v4 price), `google/gemini-3.8-flash-tts` (alternative; slug and $0.50/$9 per M tokens verified; Hebrew per Google) | `POST /api/v1/audio/speech` → raw audio bytes | $20–$40 per M characters (discount until 2026-10-19 08:00 PT; budget list price after that), so a 60 s script of about 900 characters costs about $0.04 (about $0.07 at list) | §4.1 |
| Word timestamps for RTL captions | `elevenlabs/scribe-v2` | `POST /api/v1/audio/transcriptions` with `input_audio{data,format}` + `response_format: "verbose_json"` | about $0.002/min (discounted) | §4.2 |
| Music bed | `google/lyria-3-pro-preview` (OpenRouter, $0.08/song verified); ElevenLabs Music v2.5 (direct) | chat with audio output; ElevenLabs API | $0.08 per song; about $0.15/min | §4.3 |
| Final assembly (clips, VO, music, Hebrew text, logo, captions) | **Not OpenRouter.** Remotion (React) or FFmpeg on a worker. Recommendation, not researched | your own render job | compute only | — |
| Storage, auth, jobs DB | Supabase (Storage for MP4/PNG, Postgres `jobs` table, Realtime for progress) | — | — | — |

**Approximate cost of one 30 s, 9:16 promo at standard tier:**
- 1 storyboard LLM call: about $0.02
- 5 keyframes on Nano Banana 2: about $0.34 (5 × $0.067 measured by OpenRouter at 1K)
- 5 clips of 6 s on Kling v3.0 std with no audio (30 s × $0.084): about $2.52
- ElevenLabs v4 voice-over: about $0.04 (about $0.07 after the discount ends)
- Scribe captions: about $0.001
- Lyria 3 Pro music: $0.08 per song

**Total: about $3.00 per video before render compute.** All figures are estimates derived from the table above.

---

## 7. Sample requests and responses (as documented; verify field names against the live API)

### 7.1 Text: Hebrew storyboard with json_schema and fallbacks
```http
POST https://openrouter.ai/api/v1/chat/completions
Authorization: Bearer ${OPENROUTER_API_KEY}
HTTP-Referer: https://example.co.il
X-OpenRouter-Title: <AppName>
Content-Type: application/json
```
```json
{
  "models": ["anthropic/claude-sonnet-5.5", "openai/gpt-6.1-sol", "google/gemini-3.8-flash"],
  "provider": { "require_parameters": true, "sort": "latency" },
  "messages": [
    { "role": "system", "content": [
      { "type": "text", "text": "אתה קופירייטר ובמאי וידאו ישראלי בכיר... (מדריך סגנון ארוך)", "cache_control": { "type": "ephemeral" } }
    ]},
    { "role": "user", "content": "נישה: מספרה בתל אביב. מטרה: ריל 30 שניות 9:16. טון: צעיר ואנרגטי." }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "storyboard",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "hook": { "type": "string", "description": "משפט פתיחה ל-3 השניות הראשונות" },
          "voiceover": { "type": "string" },
          "scenes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "index": { "type": "integer" },
                "duration_sec": { "type": "integer" },
                "image_prompt_en": { "type": "string" },
                "motion_prompt_en": { "type": "string" },
                "onscreen_text_he": { "type": "string" }
              },
              "required": ["index", "duration_sec", "image_prompt_en", "motion_prompt_en", "onscreen_text_he"],
              "additionalProperties": false
            }
          },
          "cta": { "type": "string" }
        },
        "required": ["hook", "voiceover", "scenes", "cta"],
        "additionalProperties": false
      }
    }
  }
}
```
Response (OpenAI-compatible shape; the `usage` field values are illustrative):
```json
{
  "id": "gen-...",
  "model": "anthropic/claude-sonnet-5.5",
  "choices": [{ "index": 0, "finish_reason": "stop",
    "message": { "role": "assistant", "content": "{\"hook\":\"...\",\"voiceover\":\"...\",\"scenes\":[...],\"cta\":\"...\"}" } }],
  "usage": { "prompt_tokens": 2100, "completion_tokens": 650, "total_tokens": 2750,
             "prompt_tokens_details": { "cached_tokens": 1800 }, "cost": 0.0089 }
}
```
Notes:
- `content` is a JSON **string**. Parse it, then validate with Zod (strict mode is a strong hint on some providers, not a guarantee [verified: https://openrouter.ai/docs/guides/features/structured-outputs]).
- `model` reports which fallback actually served the request.
- `usage` (with `cost`, in credits) is always returned; do **not** send the deprecated `usage: {include: true}` [verified: https://openrouter.ai/docs/cookbook/administration/usage-accounting].
- The `cache_control` block only matters when Anthropic serves the request.

### 7.2 Image via chat completions (Nano Banana 2)
```json
POST /api/v1/chat/completions
{
  "model": "google/gemini-3.1-flash-image",
  "modalities": ["image", "text"],
  "image_config": { "aspect_ratio": "9:16", "image_size": "2K" },
  "messages": [{ "role": "user", "content": [
    { "type": "text", "text": "Photoreal interior of a modern Tel Aviv barbershop, warm light, no text" },
    { "type": "image_url", "image_url": { "url": "data:image/png;base64,<LOGO_OR_REFERENCE>" } }
  ]}]
}
```
Response:
```json
{ "choices": [{ "message": {
    "role": "assistant",
    "content": "Here is the image.",
    "images": [{ "type": "image_url", "image_url": { "url": "data:image/png;base64,iVBORw0KGgo..." } }]
}}], "usage": { "cost": 0.067 } }
```
(`image_size` accepts `1K` (default), `2K`, `4K` [verified: https://openrouter.ai/docs/guides/overview/multimodal/image-generation]; the cost value is illustrative, based on OpenRouter's 1K test.)

### 7.3 Image via the Unified Image API
```json
POST /api/v1/images
{ "model": "openai/gpt-image-2", "prompt": "Clean product shot of a coffee cup, studio light, no text",
  "resolution": "1K", "aspect_ratio": "1:1" }
```
Response:
```json
{ "data": [{ "b64_json": "iVBORw0...", "media_type": "image/png" }], "usage": { "cost": 0.006 } }
```
(`data[0].b64_json` and optional `usage.cost` [verified: https://openrouter.ai/blog/tutorials/image-generation/]; `media_type` not re-checked.)

### 7.4 Video (image to video, with webhook)
The `frame_images[]` element shape below (`type: "image_url"`, `image_url.url`, `frame_type`) matches the image-to-video cookbook and the SDK `FrameImage` model [verified: https://openrouter.ai/docs/cookbook/video-generation/image-to-video, https://openrouter.ai/docs/client-sdks/typescript/models/frameimage.md]. The keyframe URL must be public HTTPS and return 200 with an image content type, so use a public Supabase bucket or a long-lived signed URL.
```json
POST /api/v1/videos
{
  "model": "kwaivgi/kling-v3.0-std",
  "prompt": "Slow dolly-in on the barber chair, steam rising, cinematic",
  "duration": 5,
  "resolution": "720p",
  "aspect_ratio": "9:16",
  "generate_audio": false,
  "frame_images": [
    { "type": "image_url", "image_url": { "url": "https://<supabase>/storage/v1/object/public/keyframes/s1.png" }, "frame_type": "first_frame" }
  ],
  "callback_url": "https://example.co.il/api/webhooks/openrouter-video"
}
```
Response (HTTP 202; `polling_url` may be relative, so resolve it against `https://openrouter.ai`):
```json
{ "id": "vid_abc123", "polling_url": "/api/v1/videos/vid_abc123", "status": "pending" }
```
Poll response once complete (intermediate status `in_progress`; terminal `completed | failed | cancelled | expired`):
```json
{ "id": "vid_abc123", "status": "completed",
  "unsigned_urls": ["https://openrouter.ai/api/v1/videos/vid_abc123/content?index=0"] }
```
To download, call `GET /api/v1/videos/vid_abc123/content?index=0` with the `Authorization: Bearer` header (the URLs are **not** presigned), stream the binary result to Supabase Storage, and mark the job done [verified: https://openrouter.ai/docs/guides/overview/multimodal/video-generation, https://openrouter.ai/docs/api/api-reference/video-generation/download-generated-video-content]. Other fields of the poll body (for example `progress`, `usage.cost`) were still not seen verbatim (unverified).

Webhook receiver (Vercel route): read the **raw body**, verify `X-OpenRouter-Signature` with the workspace signing secret (HMAC-SHA256; `t=…,v1=…` format per the skill summary), de-duplicate on `X-OpenRouter-Idempotency-Key`, then return 2xx [verified: https://openrouter.ai/docs/cookbook/video-generation/video-generation-webhooks].

### 7.5 Hebrew TTS
```json
POST /api/v1/audio/speech
{ "model": "elevenlabs/eleven-v4", "input": "רוצים לחסוך אלפי שקלים על עורך וידאו? ...", "voice": "<voice_id_or_name>", "response_format": "mp3" }
```
The response is raw `audio/mpeg` bytes.

### 7.6 Transcription with word timestamps
```json
POST /api/v1/audio/transcriptions
{ "model": "elevenlabs/scribe-v2",
  "input_audio": { "data": "<base64 audio, no data: prefix>", "format": "mp3" },
  "language": "he",
  "response_format": "verbose_json" }
```
[corrected: https://openrouter.ai/docs/guides/overview/multimodal/stt] The earlier sample used a `file` field with base64, which is wrong for the JSON body: base64 audio goes in `input_audio.data` with `input_audio.format`. (A file upload is possible only as OpenAI-style multipart/form-data, max 25 MB; OpenAI's convention names that part `file`, but the field name was not re-checked on OpenRouter.) `response_format: "verbose_json"` returns segments and word timestamps when the provider supports them [verified: https://openrouter.ai/elevenlabs/scribe-v2/llms.txt]; `timestamp_granularities` was dropped from the sample because it was not found in OpenRouter's STT docs (unverified). Whisper models use the same endpoint.

---

## 8. Vercel and Supabase implications (engineering notes, not sourced)
- Never call OpenRouter from the browser. Use Vercel serverless or edge routes (`/api/...`) with `OPENROUTER_API_KEY` in env vars.
- Video jobs take minutes, longer than a request lifetime. Run this flow:
  1. Insert a `jobs` row in Supabase.
  2. Submit to `/api/v1/videos` with `callback_url` pointing to a Vercel route.
  3. The webhook verifies `X-OpenRouter-Signature` against the raw body, de-duplicates on `X-OpenRouter-Idempotency-Key`, downloads the content with auth, uploads it to Supabase Storage and updates the row. It also handles the `failed`, `cancelled` and `expired` statuses.
  4. The frontend subscribes via Supabase Realtime.
  
  As a safety net, run a Vercel Cron job every minute that polls stale jobs.
- Final render (concatenation, VO, music, RTL captions, logo) is too heavy for standard serverless functions. Options: Remotion (React components, so the Hebrew RTL UI can be reused as video templates) on Remotion Lambda, or an FFmpeg worker on a container host. Pricing and limits were not researched here.
- Charge users in **credits**, mapped from `usage.cost` plus a margin. Store per-generation cost.

---

## 9. Uncertainties and gaps (read before writing the build prompt)
1. **Sora on OpenRouter:** resolved. OpenAI shut down the Sora API on 2026-09-24, and OpenRouter's own `openai/sora-2-pro` page says the model is removed on that date [verified: https://openrouter.ai/models/openai/sora-2-pro]. Treat Sora as unavailable.
2. **Video webhook signing:** mostly resolved. `X-OpenRouter-Signature` + `X-OpenRouter-Idempotency-Key`, four terminal statuses, raw-body verification [verified: https://openrouter.ai/docs/cookbook/video-generation/video-generation-webhooks]. The exact `t=…,v1=…` string and the 5-minute window come from the skill summary only (partially unverified).
3. **`frame_images[]` item schema:** resolved [verified: https://openrouter.ai/docs/cookbook/video-generation/image-to-video]. The full poll response body (for example `progress`, `usage.cost`) was still not seen verbatim.
4. **OpenRouter video launch date:** the announcement text is dated 2026-04-15 (read from a mirror of the official post) [corrected: https://openrouter.ai/blog/video-generation].
5. **Image prices conflict:**
   - Seedream 4.5 is listed at $0.04 and $0.05 (not re-checked).
   - Nano Banana 2 per-image cost: resolved, $0.067 at 1024² in OpenRouter's own test [verified: https://openrouter.ai/blog/insights/image-generation-models-compared/].
   - Nano Banana Pro output price conflicts on OpenRouter's own page ($120/M header vs $12/M FAQ) [verified conflict: https://openrouter.ai/google/gemini-3-pro-image].
   - The `image_size` field name in `image_config` is now confirmed in OpenRouter's docs [verified: https://openrouter.ai/docs/guides/overview/multimodal/image-generation].
6. **ElevenLabs discount:** the OpenRouter 50% discount ends **2026-10-19 08:00 PT**, a week from today [verified: https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/]. Budget at list price: about $80/M characters for v4 and $40/M for v4 Turbo (list figures not re-read; v4 Turbo is half the v4 rate, verified).
7. **Gemini 3.8 Flash TTS OpenRouter slug and price:** resolved, `google/gemini-3.8-flash-tts`, $0.50/M input, $9/M output [verified: https://openrouter.ai/google/gemini-3.8-flash-tts]. Hebrew is "preview" for 3.1 Flash TTS (not re-checked).
8. **Paid-model rate limits** on OpenRouter were not found. **BYOK fee:** resolved, $25,000/month list-price allowance on pay-as-you-go, then 5% [verified: https://openrouter.ai/docs/faq].
9. **No Hebrew-specific LLM writing benchmark exists** for 2026 frontier models. The model choice relies on general writing leadership. Do a native-speaker blind test.
10. **Hebrew text rendering** inside image and video models is unverified and assumed weak. Overlay text in the render layer.
11. **Not researched (web-search budget exhausted):**
    - Azure he-IL voices and their pricing
    - OpenAI TTS Hebrew quality
    - Deepgram Hebrew
    - Suno and Stable Audio APIs
    - Runway, Kling, Luma and Google Veo direct APIs
    - the fal.ai queue/webhook spec (it is only described from prior knowledge)
    - Remotion Lambda and Vercel function limits
12. **"OpenRouter is Joining Stripe":** Stripe has agreed to acquire OpenRouter, reported at about $7–8B; terms were not officially disclosed [verified: https://www.thestack.technology/stripe-acquires-openrouter-setting-up-a-battle-for-ai-routing-business/, https://betanews.com/article/stripe-reportedly-acquiring-ai-gateway-startup-openrouter-for-over-7-billion/]. Any impact on billing or the API is still unknown ([OpenRouter blog index](https://openrouter.ai/blog/announcements/)).
13. Model IDs, status after the 2026-10-13 re-check:
    - **Verified on openrouter.ai:** `anthropic/claude-sonnet-5.5`, `anthropic/claude-opus-5`, `openai/gpt-6-sol`, `openai/gpt-6.1-sol`, `google/gemini-3.8-flash`, `google/gemini-3.8-flash-tts`, `google/gemini-3.1-flash-image`, `google/gemini-3.1-flash-lite-image`, `google/gemini-3-pro-image`, `google/veo-3.1`, `google/veo-3.1-fast`, `google/veo-3.1-lite`, `bytedance/seedance-2.0`, `bytedance/seedance-2.0-fast`, `bytedance/seedance-2.5`, `kwaivgi/kling-v3.0-pro`, `kwaivgi/kling-v3.0-std`, `alibaba/wan-3.0`, `alibaba/wan-3.0-prime`, `minimax/hailuo-2.3`, `minimax/hailuo-3`, `minimax/hailuo-3-max`, `heygen/avatar-iv`, `elevenlabs/eleven-v4`, `elevenlabs/eleven-v4-turbo`, `elevenlabs/scribe-v2`, `google/lyria-3-pro-preview`.
    - **Corrected:** `alibaba/wan-3` → `alibaba/wan-3.0`; the recommended OpenAI fallback is now `openai/gpt-6.1-sol`.
    - **Still unverified on OpenRouter:** `anthropic/claude-opus-5.5`, `bytedance/seedance-2.0-mini`, `openai/gpt-6-luna` / `gpt-6-astra` prices.
    
    **The app should fetch `/api/v1/models`, `/api/v1/images/models` and `/api/v1/videos/models` at runtime** and store the allowed models in an admin-editable Supabase table instead of hard-coding them.

---

## Verification addendum (2026-10-13)

Method: 45 fresh WebSearch queries (direct page fetch is blocked), mostly limited to openrouter.ai, plus elevenlabs.io and news sites. Tags in the body: `[verified: url]` means confirmed, `[corrected: url]` means the earlier text was wrong and has been fixed, and "(unverified)" or "(not re-checked)" means still open.

### Corrections (the earlier text was wrong)
1. **STT request body.** Base64 audio goes in `input_audio: { data, format }` (no `data:` prefix), not in `file`. Multipart upload is limited to 25 MB. Sample 7.6 is fixed. https://openrouter.ai/docs/guides/overview/multimodal/stt
2. **Usage accounting.** `usage` (including `cost`, in credits) is now always returned. `usage: {include: true}` and `stream_options.include_usage` are deprecated and have no effect. https://openrouter.ai/docs/cookbook/administration/usage-accounting
3. **ElevenLabs on OpenRouter date.** No 2026-07-24 launch was found. Eleven v4 and Scribe v2 were added 2026-10-07 (dated slugs `-20260930` / `-20260929`). The 50% discount ends 2026-10-19 08:00 PT. https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/
4. **Wan slug.** It is `alibaba/wan-3.0`, not `alibaba/wan-3`: $0.0425/s at 480p to $0.17/s at 1080p, 2–30 s, with audio. `alibaba/wan-3.0-prime` costs $0.068–0.28/s. https://openrouter.ai/alibaba/wan-3.0
5. **OpenAI fallback.** `openai/gpt-6.1-sol` (released 2026-09-29; $2/$10; cache read $0.10; 1.05M context) supersedes `gpt-6-sol` in the fallback chain and the sample JSON. https://openrouter.ai/openai/gpt-6.1-sol
6. **Claude Opus 5.5.** It was not found on OpenRouter. The listed Opus there is `anthropic/claude-opus-5` at $5/$25. https://openrouter.ai/anthropic/claude-opus-5
7. **H3 Max.** It starts at $0.05/s, not $0.13. https://openrouter.ai/compare/minimax/hailuo-3-max/x-ai/grok-imagine-video
8. **Video launch date.** The announcement text is dated 2026-04-15, not 16 or 22 April. https://openrouter.ai/blog/video-generation
9. **Webhook events.** Deliveries fire for four terminal statuses, not two event names. Headers are `X-OpenRouter-Signature` and `X-OpenRouter-Idempotency-Key`. https://openrouter.ai/docs/cookbook/video-generation/video-generation-webhooks

### Newly verified
- Video flow: 202 response, statuses `pending/in_progress/completed/failed/cancelled/expired`, a `polling_url` that may be relative, and `unsigned_urls` that need a Bearer token. https://openrouter.ai/docs/guides/overview/multimodal/video-generation
- `frame_images` schema and the requirement for a public HTTPS image. https://openrouter.ai/docs/cookbook/video-generation/image-to-video
- `/api/v1/videos/models` fields, including `pricing_skus`. https://openrouter.ai/docs/api/api-reference/video-generation/list-all-video-generation-models
- Video per-second prices: Veo 3.1 / Fast / Lite, Seedance 2.0 / 2.0-fast / 2.5, Kling v3.0, Hailuo 2.3 / H3, Avatar IV (model pages cited inline). Sora 2 Pro was removed on 2026-09-24.
- Images: `POST /api/v1/images` → `data[0].b64_json` and `usage.cost`; `image_config.image_size` takes 1K/2K/4K. Slugs, token prices and the $0.067 per-image test result for Nano Banana 2; new Nano Banana 2 Lite slug; Nano Banana Pro GA slug.
- Audio: the audio APIs were announced 2026-05-01; Eleven v4 supports Hebrew; `google/gemini-3.8-flash-tts` costs $0.50/$9 per M tokens; Scribe v2 costs $0.000031/s and returns word timestamps with `verbose_json`; Lyria 3 Pro costs $0.08 per song.
- Headers (`X-OpenRouter-Title`; `X-Title` still works), structured outputs with `require_parameters` (default false), and the Batch API (beta, 24 h window, generally 50% off).
- Platform fee: 5.5% with an $0.80 minimum, or 5% on crypto. BYOK: free up to $25k/month, then 5%.
- Stripe has agreed to acquire OpenRouter, reported at about $7–8B.

### Still unverified
- The exact `t=…,v1=…` signature format and the 5-minute replay window.
- Fields of the video poll body beyond `status` / `unsigned_urls`.
- Veo durations: the docs show 4/6/8 s and 5/8 s.
- Seedance 2.0-mini.
- Seedance 2.5 price at 720p.
- `/api/v1/images/models`.
- Image resolution tiers.
- Eleven v4 $/M list price.
- The shape of the Scribe diarization option and of word entries.
- `timestamp_granularities`.
- Hebrew support in Gemini 3.8 Flash TTS (stated by Google, not re-checked).
- Batch API date and whether it is text-only.
- US routing and Security Center.
- Paid-model rate limits.
- The 8% Business-plan fee.
- Claude Opus 5.5 on OpenRouter.
- GPT-6 Luna and Astra prices.
- Seedream and FLUX prices.
- Nano Banana Pro output-price conflict ($120/M vs $12/M).
