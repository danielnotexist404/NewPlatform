# 11: Organic publishing to Instagram and Facebook via API, plus "boost the winner" (as of 2026-10-17)

> Scope: organic Reels/posts publishing from {{BRAND_NAME}} ("קדימון") to a customer's Instagram professional account and Facebook Page; scheduling; organic insights (especially hook metrics); turning an organic post into an ad; AI-content labeling.
> Paid campaign creation, budgets and the ads dashboard are covered by the sibling Meta Ads report; this file only covers the boost hand-off.

---

## 0. How reliable this report is

- **Method:** 30 web searches. WebFetch and curl were blocked, so no page was opened in full. Every fact comes from search-result snippets of the pages linked inline.
- **Tags used:**
  - **(official)**: the snippet came from developers.facebook.com or another Meta page.
  - **(secondary)**: the snippet came from a third-party vendor or blog.
  - **(unverified)**: model knowledge, or sources that conflict. Check it in M0.
- **Meta's docs disagree with themselves.** The publishing limit (50 vs 100) and Facebook Reels scheduling are two examples. The build should read these values at runtime or confirm them in M0. It should not hard-code them as facts.
- **Docs URL scheme:** Meta is moving its docs from `developers.facebook.com/docs/...` to `developers.facebook.com/documentation/...`. Both forms appear below, and both resolved in search results.

---

## 1. Graph API version (pin this)

| Version | Released | Status as of 2026-10-17 | Source |
|---|---|---|---|
| **v26.0** | **2026-07-29** | Latest. Expiry "TBD" | [changelog v26.0](https://developers.facebook.com/docs/graph-api/changelog/version26.0), [versions list](https://developers.facebook.com/docs/graph-api/changelog/versions) (official) |
| v25.0 | 2026-02-18 | Active | [Meta blog: Introducing Graph API v25](https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25) (official) |
| v24.0 | 2025-10-08 | Active | [versions list](https://developers.facebook.com/docs/graph-api/changelog/versions) (official) |
| v20.0 | — | **Expired 2026-09-24**. Calls to an expired version are silently routed to the next oldest usable version | [versions list](https://developers.facebook.com/docs/graph-api/changelog/versions), [dev.to note](https://dev.to/flarecanary/metas-graph-api-v20-expires-september-24-your-calls-wont-fail-theyll-quietly-start-running-v21-2m2a) (secondary) |

- No v27.0 turned up in search results.
- **v26.0 breaking changes found.** 47 Commerce Order Management endpoints were blocked from 2026-07-29 and are removed from all versions on 2026-10-27 ([changelog v26.0](https://developers.facebook.com/docs/graph-api/changelog/version26.0)). A third-party write-up says the **Instagram Explore Feed ad placement now errors** and Messenger Stories placement is silently stripped on v26.0+ ([adligator](https://adligator.com/blog/meta-graph-api-v26-placement-changes), secondary). The placement change matters to the ads module, not to organic publishing.
- **Recommendation:** set `META_GRAPH_VERSION=v26.0` as one env constant used by every Graph, rupload and Marketing call. Meta usually supports a version for about 2 years (unverified for v26), so v26 should last into 2028.

---

## 2. Which login: "Instagram API with Instagram Login" vs "with Facebook Login"

Meta now offers two configurations ([Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview), official):

| | **Facebook Login for Business** ("Instagram API with Facebook Login") | **Business Login for Instagram** ("Instagram API with Instagram Login") |
|---|---|---|
| User signs in with | Facebook | Instagram credentials |
| Facebook Page required | **Yes.** The IG professional account must be linked to a Page, and the app user must be able to do admin-equivalent tasks on that Page ([overview](https://developers.facebook.com/documentation/instagram-platform/overview)) | No |
| Host | `graph.facebook.com` | `graph.instagram.com` |
| Publishing scopes | `instagram_basic`, `instagram_content_publish`, `pages_read_engagement` (Page access token per docs) ([content publishing](https://developers.facebook.com/documentation/instagram-platform/content-publishing), official) | `instagram_business_basic`, `instagram_business_content_publish` (Instagram user token) ([same page](https://developers.facebook.com/documentation/instagram-platform/content-publishing)) |
| Ads / Marketing API | **Yes**, the same consent can include `ads_management`/`ads_read` | **No ads or tagging** ([getphyllo](https://www.getphyllo.com/post/instagram-api-permissions-scopes), secondary) |
| `boost_eligibility_info` on IG media | **Yes** | **No.** "Available for Instagram API with Facebook Login only" ([Use posts as ads](https://developers.facebook.com/docs/instagram/ads-api/guides/use-posts-as-ads/), official) |
| Facebook Page Reels | Yes (`pages_manage_posts`) | No |
| Status | Supported | GA 2024-07-23. Meta *recommends* it for IG-only apps but keeps supporting the Facebook Login version ([Meta blog 2024-07-30](https://developers.facebook.com/blog/post/2024/07/30/instagram-api-with-instagram-login/), official) |

- **Scope rename on the Instagram Login path.** The old `business_basic`, `business_content_publish`, `business_manage_messages` and `business_manage_comments` scopes were deprecated on **2025-01-27**. Apps still sending them fail hard ([Business Login for Instagram](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login), official).
- **Object model change.** Graph API v22 replaced the legacy Instagram User, Media, Carousel and Comment objects with **IG User / IG Media / IG Comment**. The Graph API migration deadline was 2025-05-20 and the Marketing API deadline was 2025-09-09 ([Meta blog 2025-01-21](https://developers.facebook.com/blog/post/2025/01/21/making-it-easier-to-build-integrations-across-the-instagram-api-and-marketing-api/), official).

**Decision for קדימון: use Facebook Login for Business as the only connection path in MVP.**
- The product promise is "publish organic, then boost and run campaigns without Ads Manager". That needs the Page, the IG account and the ad account in **one** consent, plus `boost_eligibility_info`. Only the Facebook Login path provides all of these.
- Business Login for Instagram can be added later as "organic-only for IG accounts without a Page". The default flow should instead be a Hebrew wizard that helps the customer link IG to a Page (IG app → Accounts Center).
- **Gotcha:** Meta's content-publishing doc says that if the app user holds a **Business Manager role on the connected Page**, the publishing calls also require `ads_management` and `ads_read` ([content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing), official). Request them in the same consent anyway, since ads need them.

---

## 3. Instagram Reels publishing (IG Graph API, Facebook Login path)

### 3.1 Flow

Use the two-step container flow with a status poll in between ([Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing), [IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media), official).

1. **Create the container.**
   ```
   POST /{ig-user-id}/media
     media_type=REELS
     video_url=<public URL Meta can fetch>
     caption=<Hebrew text>
     share_to_feed, cover_url | thumb_offset, collaborators, location_id,
     audio_name, user_tags, trial_params
   → { id: <container-id> }
   ```
   The media must be on a **publicly accessible server at publish time**, because Meta fetches it ([content publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing), official).
   **Alternative: resumable upload.** Pass `upload_type=resumable` to receive a container ID and an upload URI on `rupload.facebook.com`, then send the bytes or a `file_url` ([Resumable uploads](https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads), official). The exact header names (`Authorization: OAuth <token>`, `offset`, `file_size`, `file_url`) are (unverified).
2. **Poll the container.** Call `GET /{container-id}?fields=status_code,status`. The `status_code` values are `IN_PROGRESS`, `FINISHED`, `ERROR`, `EXPIRED` and `PUBLISHED`. **EXPIRED means the container was not published within 24 h** ([IG Container reference](https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-container), official).
   - Cadence: "poll once per minute, at most 5 minutes", and most Reels finish in 30 s–2 min ([PostProxy](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/), secondary; Meta's wording is unverified). Large files can take several minutes ([RapidDev](https://rapidevelopers.com/api-automations/how-to-automate-instagram-reels-scheduling-using-the-api), secondary).
   - Keep the source file reachable until the container reaches `FINISHED` ([bundle.social](https://bundle.social/blog/instagram-posting-api), secondary).
3. **Publish.** Call `POST /{ig-user-id}/media_publish?creation_id=<container-id>`, which returns the IG media ID. Then fetch `permalink`, `media_product_type` and `thumbnail_url`.
   - Querying `media_type` on a published reel returns **VIDEO**. Use `media_product_type` (= `REELS`) to tell reels apart ([content publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing), official).
   - A forum thread reports containers reaching `FINISHED` and then failing at `media_publish` with subcode **2207089**, which the reporter suspected was platform-side ([Meta dev community](https://developers.facebook.com/community/threads/1970836260493737/)). Treat it as retryable a few times.

### 3.2 Video specs for `media_type=REELS` (official, IG User Media reference)

Source: [IG User Media](https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media).

| Spec | Value |
|---|---|
| Container | MOV or MP4, **moov atom at the front** (faststart) |
| Video codec | H.264 or HEVC |
| Audio | **AAC, ≤ 48 kHz, ≤ 128 kbps** |
| Video bitrate | ≤ 25 Mbps |
| Frame rate | 23–60 fps |
| Max width | 1920 px |
| Aspect ratio | 0.01:1 to 10:1 allowed; **9:16 recommended** to avoid cropping |
| Duration | **3 s – 15 min** (the 15-min API limit has existed since about Feb 2023 per [Hootsuite](https://www.hootsuite.com/whats-new/publish-longer-instagram-reels-and-stories), secondary) |
| File size | ≤ 300 MB |

- **Reels-tab eligibility:** one 2026 guide says 5–90 s ([PostProxy](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/), secondary, unverified). Our 7–60 s outputs satisfy both ranges.

### 3.3 Container parameters relevant to us

All from the official [IG User Media reference](https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media) unless marked.

- **`caption`**
  - Length: 2,200 characters, hashtags and mentions included ([Emplifi](https://docs.emplifi.io/platform/latest/home/instagram-publishing), [PostPeer](https://www.postpeer.dev/errors/instagram), secondary).
  - **Hashtags: Instagram is moving to a cap of 5 per post.** Meta announced this in late 2025 after about a year of testing; some testers were held to 3 ([Social Media Today](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/), [Social Samosa](https://www.socialsamosa.com/news-2/instagram-hashtags-five-per-post-10923075), secondary). One vendor says posts with more than 5 hashtags are rejected ([Contentbird](https://help.contentbird.io/en/articles/14702458-social-publishing-important-notes), secondary). How the API itself behaves with more than 5 is (unverified).
  - Mentions: the limit is 20 or 5 depending on the source (unverified).
- **`share_to_feed`**: whether the reel also appears in the main feed/grid. Defaults to `true` per a third-party guide (secondary).
- **`cover_url`**: a public image used as the Reels-tab cover. **If both `cover_url` and `thumb_offset` are set, `cover_url` wins.**
- **`thumb_offset`**: the frame to use as the thumbnail. The unit is reportedly milliseconds (unverified).
- **`collaborators`**: up to **3** IG usernames, comma-separated, for Collab posts. Use case: a business plus an influencer, or two branches.
- **`location_id`**: the ID of a Facebook Page that has location data. Find one with the Pages Search API. **Trick (unverified):** if the customer's own Page has an address, its Page ID can serve as `location_id`, which helps local Israeli SMBs.
- **`audio_name`**: renames the reel's original audio, e.g. "קדימון · <business>". Constraints are undocumented in what we found.
- **`user_tags`**: supported.
- **`trial_params`**: Trial Reels, see §3.5.

### 3.4 Publishing rate limit

- **The official numbers conflict.** The content-publishing guide says **100 API-published posts per 24 h**, enforced on `media_publish`, with a carousel counting as one post. Its carousel section and the `content_publishing_limit` reference say **50** ([content publishing](https://developers.facebook.com/documentation/instagram-platform/content-publishing), official; conflict noted by [bundle.social](https://bundle.social/blog/instagram-api-rate-limits) and [AdaptlyPost](https://adaptlypost.com/blog/content-publishing-limit-instagram-api), secondary).
- **Read the real quota at runtime:** `GET /{ig-user-id}/content_publishing_limit?fields=config,quota_usage`. The `quota_total` and `quota_duration` (86400 s) fields are (secondary).
- Over-quota error: HTTP 400, code 9, subcode 2207042 (single secondary source, unverified).
- **Practical impact: none.** An SMB posts 1–3 reels a day. Still enforce a per-IG-account cap of about 25/day in our scheduler as a safety margin.

### 3.5 Trial Reels: shown to non-followers first

- **API support.** `trial_params` is an optional field on the create-media endpoint, supported on **both** login paths ([Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog), official).
- **Graduation strategies:**
  - `MANUAL`: stays a trial until the owner graduates it in the IG app.
  - `SS_PERFORMANCE`: Instagram auto-graduates it based on early performance with non-followers ([Ayrshare](https://www.ayrshare.com/apis/post/social-networks/instagram), [bundle.social API ref](https://info.bundle.social/api-reference/platforms/instagram), secondary).
  - The exact JSON key casing (`graduation_strategy` vs `graduationStrategy`) is (unverified).
- **Graduation cannot be triggered via API.** It happens in the app only ([Ayrshare](https://www.ayrshare.com/apis/post/social-networks/instagram), secondary).
- **Eligibility is not universal.** It applies to professional accounts only. Follower thresholds of about 1,000 (or 200) are unofficial (unverified) ([superprofile](https://superprofile.bio/guides/instagram-trial-reels.md), secondary). The claimed "72 h auto-graduation window" is (unverified).
- **Why this matters for trend templates:** we can publish 2–3 **hook variants** of the same video as Trial Reels and compare `reels_skip_rate` and views among non-followers. Then the customer graduates the winner in the app (we deep-link them) and **boosts it** (§7). Meta built this for "test before your followers see it", which is exactly our hook-testing story.

### 3.6 No native scheduling for Instagram via API

- Multiple sources say IG publishing has **no `scheduled_publish_time` equivalent**: the API publishes immediately, and the scheduler must live in our system ([bundle.social Graph API guide](https://bundle.social/blog/instagram-graph-api), [PostProxy Stories](https://postproxy.dev/how-to/schedule-instagram-stories/), secondary).
- A 2018 TechCrunch piece mentioned scheduling for Instagram Partners ([TechCrunch](https://techcrunch.com/2018/01/30/instagram-now-allows-businesses-to-schedule-their-posts)). In practice that meant third-party tools could publish via API at a time they chose. It was not a server-side schedule.
- **Implementation:** a Trigger.dev delayed run (or `wait.until`) fires about 10 minutes before the slot. It creates the container, polls until `FINISHED` and publishes at the slot.
  - Never pre-create containers more than 24 h ahead, because they expire.
  - Posts scheduled this way **do not appear** in the IG app's "scheduled content". The UI should explain this in Hebrew.

---

## 4. Facebook Page Reels publishing (`/{page-id}/video_reels`)

### 4.1 Flow

Source: [Reels Publishing API guide](https://developers.facebook.com/docs/video-api/guides/reels-publishing), [page/video_reels reference](https://developers.facebook.com/docs/graph-api/reference/page/video_reels) (official).

1. **Start the upload session.** `POST /{page-id}/video_reels upload_phase=start` returns `{ video_id, upload_url }`.
2. **Upload the bytes** to `rupload.facebook.com` (not graph.facebook.com).
   - Send either the file body or a `file_url` header pointing to a public URL such as a CDN or a signed Supabase URL.
   - To resume an interrupted upload, use the offset from `bytes_transfered`. Meta's field name has that spelling ([guide](https://developers.facebook.com/documentation/video-api/guides/reels-publishing)).
   - **Gotcha:** this step authenticates with `Authorization: OAuth <PAGE_TOKEN>`. Using `Bearer` reportedly fails with an unclear error ([bundle.social FB guide](https://bundle.social/blog/facebook-posting-api), secondary).
3. **Check processing (optional).** `GET /{video_id}?fields=status` reports the uploading, processing and publishing phases. The exact field shape is (unverified).
4. **Finish.** `POST /{page-id}/video_reels upload_phase=finish video_id=... video_state=PUBLISHED|DRAFT|SCHEDULED description="<Hebrew caption + hashtags>" title=...`.
   - A **DRAFT** state exists. It could let the customer open the reel in Meta Business Suite to add licensed trending audio before posting. Whether drafts appear there is (unverified).

### 4.2 Specs and limits

- **Duration:** the Reels Publishing API guide still lists **3–90 s**, 9:16, 1080×1920 recommended ([guide](https://developers.facebook.com/documentation/video-api/guides/reels-publishing), official).
  - Facebook announced on **2025-06-17** that **all videos become Reels**, with no length or orientation limits for consumers ([TechCrunch](https://techcrunch.com/2025/06/17/facebook-announces-that-all-videos-on-its-platform-will-soon-be-shared-as-reels), [Engadget](https://www.engadget.com/social-media/facebook-videos-are-all-just-going-to-be-reels-now-185807805.html)).
  - The search results did **not** show the API guide reflecting that change. Keep the API at 3–90 s until verified.
- **Other specs:** 24–60 fps, minimum 540×960 ([Planable](https://help.planable.io/hc/articles/21715457579932), secondary). File size is cited as 1 GB or 4 GB (unverified conflict).
- **Rate limit: 30 API-published Reels per Page per rolling 24 h**, enforced on `POST /{page_id}/video_reels`. Meta asks apps to enforce it client-side too ([Reels Publishing guide](https://developers.facebook.com/documentation/video-api/guides/reels-publishing), official per snippet).
- **Permissions (Page token):** `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`. For Pages owned by a business portfolio, also `business_management` (unverified). For insights, `read_insights` (unverified for Reels).

### 4.3 Scheduling on Facebook

- **`/videos` edge:** `scheduled_publish_time` must be between **10 min and 6 months** ahead ([page/videos reference](https://developers.facebook.com/docs/graph-api/reference/page/videos/), official).
- **`/video_reels`:** `video_state=SCHEDULED` exists. The reference also lists `scheduled_publish_time` ("time when a video should be scheduled") ([page/video_reels](https://developers.facebook.com/docs/graph-api/reference/page/video_reels), official, fragmentary snippet).
  - One guide says the maximum is 29 days ([AdaptlyPost DE](https://adaptlypost.com/de/blog/facebook-scheduled-publish-time), secondary).
  - Another says Reels do not support it (secondary).
  - **(unverified, M0-verify)**
- **Recommendation:** use **our own scheduler for both platforms**, so behavior, editing and cancel stay the same. Native FB scheduling can be an optimization later.

---

## 5. Captions in Hebrew: practical rules (design, partly unverified)

1. **UTF-8 throughout.** Hebrew counts as 1 character per letter against the 2,200 limit. Emoji count as 1–2 code units (unverified how Meta counts them). Validate at 2,000 to keep a margin.
2. **Bidi:** IG and FB pick each paragraph's direction from its first strong character (unverified for IG's renderer).
   - Start every caption line with a Hebrew letter, or prefix U+200F (RLM), when the line begins with an emoji, a number, a price ("₪99") or a Latin brand name.
   - Wrap phone numbers and URLs in U+2066…U+2069 (LRI/PDI) so digits don't reorder.
3. **Hebrew hashtags work as `#מילה_מילה`**, using underscores and no spaces.
   - **Strip geresh/gershayim (׳ ״), quotes, hyphens and nikud** from hashtags, because they end the tag (unverified, but standard tokenization).
   - Generate **at most 5 hashtags** (§3.3), mixing 1–2 niche-plus-city Hebrew tags with 1–2 broad tags.
4. **Put the CTA in the first ~125 characters**, which is roughly what shows before "more" (unverified for Hebrew rendering). Example: "שלחו לנו הודעה בוואטסאפ 👇".
5. **Avoid `@mentions` in captions.** Use `collaborators` instead (max 3).
6. Hashtags in the first comment no longer help much and count toward the 5-tag cap, per [Socialk](https://socialk.it/en/tools/instagram-character-counter) (secondary). Don't build a "first comment hashtags" feature.

---

## 6. Organic insights (for the "which hook works best" dashboard)

### 6.1 Instagram media insights

Endpoint: `GET /{ig-media-id}/insights?metric=...`. Source: [Instagram Media Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/), official.

Permission: `instagram_manage_insights` on the FB Login path, or `instagram_business_manage_insights` on the IG Login path (scope names unverified).

| Metric | Meaning | Notes |
|---|---|---|
| `views` | Total times the media was played on IG | Replaced `plays`. Counts plays of 1 ms or more, excluding replays ([Brandwatch](https://social-media-management-help.brandwatch.com/en/articles/12767947), secondary) |
| `reach` | Unique accounts | official list |
| `likes`, `comments`, `shares`, `saved`, `total_interactions` | Engagement | Listed by tool docs ([Aident](https://aident.ai/actions/instagram_tools/instagram_get_ig_media_insights), secondary) |
| **`ig_reels_avg_watch_time`** | Average time a reel was played | REELS only. Marked "in development" in some doc versions |
| `ig_reels_video_view_total_time` | Total play time including replays | REELS only |
| **`reels_skip_rate`** | **% of views that skipped within the first 3 s** | Added **2025-12-03** ([Meta blog: Instagram API updates](https://developers.facebook.com/blog/post/2025/12/03/instragram-api-updates/), official). The 3-s window is fixed. It must be requested explicitly and **may return null on low-reach reels** ([Storrito](https://storrito.com/resources/how-instagrams-updated-marketing-api-metrics-work/), secondary) |
| `reposts` (media and account level) | Repost counts | Added 2025-12-03 (official blog). Exact metric name is (unverified) |
| `crossposted_views`, `facebook_views` | IG+FB views for reels shared to FB; FB-only views | Added 2025-12-03 (official blog) |

**Deprecated, do not use:**
- `plays`, `clips_replays_count`, `ig_reels_aggregated_all_plays_count` and `impressions` were removed for all versions on **2025-04-21**. Requesting them for media created after 2024-07-02 returns an error ([Graph API v22 changelog](https://developers.facebook.com/docs/graph-api/changelog/version22.0), official).
- `video_views` is also deprecated ([Media Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/)).

**`reels_skip_rate` is the single most valuable metric for our product.** It measures exactly the first-3-second hook that Appendix B/C's taxonomy is built around. Join each published reel to its `hook_id` and `trend_template_id`, then rank hooks per niche by low skip rate, high avg watch time as a share of duration, and shares.

### 6.2 Facebook Reels insights

Endpoint: `GET /{video-id}/video_insights`. Source: [Video Insights reference](https://developers.facebook.com/docs/graph-api/reference/video/video_insights/), official.

- `blue_reels_play_count`: lifetime plays of 1 ms or more, excluding replays.
- `fb_reels_replay_count`
- `fb_reels_total_plays`
- `post_video_avg_time_watched`: average ms per play including replays, so it can exceed the length ([Funnel](https://help.funnel.io/en/articles/8769477-facebook-reels-dimensions-and-metrics), secondary).
- Reels insights cover the **past 2 years only**.

Page-level metric deprecation on **2025-11-15** ([Meta blog 2025-08-15](https://developers.facebook.com/blog/post/2025/08/15/page-insights-api-updates/), [deprecated metrics list](https://developers.facebook.com/documentation/pages-api/platforminsights/page/deprecated-metrics.md), official):

| Removed | Use instead |
|---|---|
| `page_impressions*` | `page_media_view` |
| `post_impressions*` | `post_media_view` |
| `page_fans` | `page_follows` |
| `page_impressions_unique` family (removed by 2025-06-15 per Meta; a third party says 2026-06-15) | `page_total_media_view_unique` |

### 6.3 Polling plan (design)

- Fetch snapshots at +1 h, +6 h, +24 h, +72 h and +7 d, then daily until day 28.
- Store them in a time-series table and show "early signal" after 24 h.
- IG insights can lag by hours (unverified exact lag).
- Batch requests (`?ids=` or a batch API) and respect the `X-Business-Use-Case-Usage` / `X-App-Usage` headers (unverified header set for IG).

---

## 7. Boosting an organic post as an ad ("publish organic → boost the winner")

### 7.1 Instagram post or reel → ad

Source: [Use Posts as Instagram Ads](https://developers.facebook.com/docs/instagram/ads-api/guides/use-posts-as-ads/), [Instagram boost signal blog](https://developers.facebook.com/blog/post/2024/06/03/instagram-boost-signal-for-ad-eligibility/), official.

1. **Eligibility check.** Call `GET /{ig-media-id}?fields=boost_eligibility_info,boost_ads_list`.
   - Available since 2024-06-03 on the **Facebook Login path only**.
   - `boost_ads_list` shows **ACTIVE** ads on that post only.
   - The schema (`eligible_to_boost`, reason codes) was not visible in snippets (unverified). Typical blockers (unverified) are copyrighted music, a pending collab, and branded-content tags.
2. **Get the IG user ID for ads** from `GET /act_{ad_account_id}/connected_instagram_accounts` or `GET /{business_id}/instagram_business_accounts` (official, same guide).
3. **Create the creative.**
   ```
   POST /act_{ad_account_id}/adcreatives
     object_id=<PAGE_ID>
     instagram_user_id=<IG_USER_ID>
     source_instagram_media_id=<IG_MEDIA_ID>
     (+ call_to_action, e.g. WhatsApp message, unverified for existing-post creatives)
   ```
   **Field migration:** `instagram_actor_id` became `instagram_user_id`, `instagram_story_id` became `source_instagram_media_id`, and `effective_instagram_story_id` became `effective_instagram_media_id`. This started in Marketing API v22 and applied to **all versions from 2025-09-09** ([Marketing API v22 changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog/version22.0), [Meta blog 2025-08-11](https://developers.facebook.com/blog/post/2025/08/11/instagram-marketing-api-update/), official). Never emit `instagram_actor_id`.
4. **Create the ad.** `POST /act_{id}/ads` with `creative={creative_id}` in an existing ad set (campaign and ad set creation are in the Ads report).
   - Reels are in scope: single photo, video, carousel or reel posts can become ads (official guide).
   - **Social proof** (likes and comments) stays on the post, which is the main reason to boost instead of uploading a new ad.
5. **Partnership ads.** To boost a collab or creator post, use `facebook_branded_content`/`instagram_branded_content` with `instagram_branded_content_ads_brand`.
   - `/{ig-id}/branded_content_advertisable_medias` is **removed 2026-12-01** in favor of the Advertisable Content Discovery API ([Boost existing post as partnership ad](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/partnership-ads/ads-creation/boost-existing-post), official). This is Phase 2.

### 7.2 Facebook Page post or reel → ad

- `POST /act_{id}/adcreatives object_story_id=<PAGEID>_<POSTID>`, then `POST /ads` with the returned `creative_id` ([Create an Ad Creative](https://developers.facebook.com/docs/marketing-api/get-started/basic-ad-creation/create-an-ad-creative), [object story spec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/), official).
- For a Reel published via `video_reels`, resolve the **post ID** of the video first, e.g. `GET /{video_id}?fields=post_id` (unverified field name).
- Historically, Page-post ads required at least an advertiser role on the Page ([2014 Page post API blog](https://developers.facebook.com/ads/blog/post/2014/08/28/creative-page-post-api), official, old).

### 7.3 Product flow (design)

1. The organic reel is published, tagged with `hook_id`/`trend_template_id`.
2. After 24–72 h, the dashboard ranks posts by skip rate, watch time and shares. A badge reads "🏆 המנצח".
3. A "קדם את המנצח" button runs `boost_eligibility_info`.
   - If not eligible, show a Hebrew reason ("המוזיקה בסרטון לא מאושרת לקידום", etc.).
   - If eligible, open the simple campaign builder (objective, budget, audience) pre-filled with this post as the creative.
4. Paid results join back to the same `hook_id`. "Which hook works best" then combines organic skip rate with paid cost per lead.

---

## 8. AI-generated content labeling (Meta "AI info")

**What Meta does**
- **Feb 2024:** Meta said it would label AI images detected through C2PA and IPTC metadata from major generators, plus invisible watermarks and classifiers ([SiliconANGLE](https://siliconangle.com/2024/02/06/meta-will-label-ai-generated-images-across-facebook-instagram-threads/), secondary).
- **2024-07-01:** the "Made with AI" label (May 2024) was renamed **"AI info"** after real photos with minor AI edits were mislabeled ([ppc.land](https://ppc.land/iptc-metadata/), [FoneArena](https://www.fonearena.com/blog/427659/meta-ai-labeling-ai-info-enhanced-transparency.html/amp), secondary).
- **Aug 2026 report:** the AI info tag moved from under the username into a top-right menu, so users must tap to see it ([CO/AI](https://getcoai.com/?p=19931), secondary).
- **Meta's own generators:** images made with Meta AI carry "Imagined with AI" plus a watermark ([The Decoder](https://the-decoder.com/meta-introduces-imagined-with-ai-labels-for-ai-generated-content-on-its-social-media-platforms/)).

**How reliable detection is**
- IPTC's testing found **Instagram reads IPTC `DigitalSourceType` but not C2PA**, and Facebook uploads have historically stripped metadata ([IPTC: AI disclosure on social media](https://iptc.org/news/ai-disclosure-on-social-media-a-work-in-progress/), secondary; parts of the test data may be old).
- Claims that "Instagram adopted C2PA in late 2025" come from a metadata-stripping vendor (unverified).

**Self-disclosure for video**
- Meta's 2024 policy asks users to **self-disclose photorealistic AI video and realistic audio** using an in-app toggle, with possible penalties for not doing so (unverified current wording).
- We found **no Graph API parameter for AI self-disclosure** on IG `/media` or FB `/video_reels` (unverified; treat as absent).

**Recommendation (design)**
1. **Embed provenance in every render.**
   - Write XMP/IPTC `Iptc4xmpExt:DigitalSourceType`: `compositeWithTrainedAlgorithmicMedia` for a mix of real brand assets and AI clips, `trainedAlgorithmicMedia` for fully AI.
   - Optionally add a C2PA manifest via the open-source `c2patool`/c2pa-rs in the finalize step.
   - This is cheap and future-proof, and it fits the EU AI Act Art. 50 transparency duties that apply from 2026-08-02 (unverified applicability to Israeli users).
2. **Hebrew notice in the publish dialog** when a video contains photorealistic AI people or voices: "סרטון שנוצר בבינה מלאכותית עשוי לקבל אצל מטא תווית 'AI info'. לפי המדיניות של מטא, בסרטון שנראה אמיתי צריך לסמן את זה בעצמכם." Link to how to toggle it in the IG app.
3. **Don't strip or forge metadata.** Never market "avoid the AI label" as a feature. The label is informational, and evading it risks policy enforcement.

---

## 9. App review, tokens and compliance

- **Access levels.**
  - Standard Access only works for accounts with a role on the app.
  - Serving customers needs **Advanced Access** for each permission. That means **App Review** (a screencast of the full login → publish flow plus a real published post) and a **verified business portfolio** ([singhamandeep](https://singhamandeep.com/?p=951), [AdaptlyPost](https://adaptlypost.com/blog/instagram-business-content-publish-scope), secondary).
  - Plan **2–6 weeks** for review (unverified).
- **Tokens.**
  - Instagram Login long-lived tokens last **60 days** and are refreshable (secondary, same AdaptlyPost source).
  - FB Login: exchange for a long-lived user token, then fetch Page tokens. Those normally don't expire, but they are invalidated on password change, role removal or permission revocation (unverified).
  - Handle error **190** (invalid token) and **200** (permission) ([page/video_reels reference](https://developers.facebook.com/docs/graph-api/reference/page/video_reels)) with a Hebrew "חברו מחדש את פייסבוק/אינסטגרם" banner.
- **Required callbacks:** deauthorize and data-deletion URLs (unverified as current requirement; standard for App Review).
- **Business Integration System User tokens** (Facebook Login for Business with `config_id`) are worth evaluating for ad-account longevity. They belong to the Ads report; organic publishing works with Page tokens.

---

## 10. Trend-template constraints that come from the API

- **Trending IG/FB library audio cannot be attached via API** (unverified, but nothing in the reference exposes music IDs; only `audio_name` renames original audio).
  - Trend templates must ship **our own licensed or AI music** and recreate the *visual and textual* hook.
  - For trends that depend on a sound, offer "Publish as draft to FB" (`video_state=DRAFT`) or "Download and add the sound in the app" as a fallback.
- **Remix, duet, stickers, polls and link stickers:** not available via the publishing API (unverified).
- **Profile grid crop:** the grid shows reels cropped (3:4 since early 2025, unverified). Keep the hook text and the cover's key content in the vertical center.
- **Safe zones:** keep burned-in Hebrew captions out of the bottom ~20% and the right-edge action rail. Generate the `cover_url` image as 1080×1920 with the hook text, using our existing `poster.jpg` pipeline.

---

## Implications for the build prompt

**Integration architecture**
1. **One Meta connection per workspace via Facebook Login for Business.** In a single consent, request:
   - `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`
   - `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`
   - `read_insights` (Page/video insights)
   - `business_management`
   - `ads_management`, `ads_read`

   After consent, the customer picks the Page, the linked IG account and the ad account in a Hebrew picker. Business Login for Instagram is **Phase 2** (organic-only, no boost).
2. **Graph version constant** `META_GRAPH_VERSION = "v26.0"` in `lib/meta/client.ts`. All URLs are built from it: `graph.facebook.com/{v}`, `rupload.facebook.com/video-upload/{v}/…`, `rupload.facebook.com/ig-api-upload/{v}/…`. Add a CI check that fails if a literal `v2x.0` appears elsewhere.
3. **New tables** (part 04). Token columns are server-only (column privileges like `ai_generations.meta`) and encrypted with AES-GCM using `META_TOKEN_KEY`.
   - `meta_connections`: workspace, FB user id, encrypted long-lived user token, scopes, `expires_at`, status, `last_error`.
   - `meta_assets`: page_id, ig_user_id, ad_account_id, names, avatars, selected flag.
   - `social_posts`
     - Keys: version/render id, `platform` (`instagram`/`facebook`), `kind` (`reel`/`trial_reel`).
     - Status enum: `draft`, `scheduled`, `uploading`, `processing`, `ready`, `published`, `failed`, `expired`, `canceled`.
     - Fields: `scheduled_at`, container/video id, media id, post id, permalink, caption_he, hashtags[], collaborators[], cover path, `hook_id`, `trend_template_id`, error code/subcode, attempts.
   - `social_post_metrics`: post id, captured_at, views, reach, likes, comments, shares, saves, total_interactions, avg_watch_ms, total_watch_ms, skip_rate, reposts, raw jsonb.
   - `boosts`: social_post_id → ad_creative_id/ad_id, linking to the Ads module tables.
4. **Trigger.dev tasks**
   - `publish-instagram-reel`: create container → `wait.for` 30–60 s and poll `status_code` (cap 15 min) → `media_publish` → fetch permalink. Retry 2207089 and other transient errors up to 3 times with backoff. On EXPIRED, recreate the container.
   - `publish-facebook-reel`: start → rupload (`Authorization: OAuth`) → finish with `video_state=PUBLISHED`.
   - `schedule-post`: a delayed run that fires about 10 min before `scheduled_at`.
   - `collect-post-insights`: a cron that follows the §6.3 cadence.
5. **Media delivery to Meta**
   - Prefer the `video_url`/`file_url` path with a **Supabase signed URL TTL of at least 2 h** on the `renders` object.
   - Fall back to resumable byte upload.
   - Never delete or replace the render until the container is FINISHED and published.
6. **Render compliance profile `meta_reels`** in the Remotion/ffmpeg finalize step:
   - 1080×1920, 30 fps, H.264 High.
   - Video bitrate cap ≤ 20 Mbps (below the 25 Mbps max).
   - **AAC 48 kHz at 128 kbps.** Override Remotion's audio bitrate if its default is higher (unverified default).
   - `-movflags +faststart`.
   - Duration 3–90 s, so the same file is valid for IG and FB.
   - Run an `ffprobe` validator before any publish call, and block with a Hebrew error if it fails.
7. **Caption builder (Hebrew)**
   - ≤ 2,000 characters.
   - ≤ 5 hashtags, sanitized: no ׳ ״ - or nikud, underscores instead of spaces.
   - Add RLM/LRI handling for lines that start with digits, emoji or Latin, and for phone numbers and URLs.
   - CTA in the first line.
   - The LLM prompt (part 05) must output `{caption_he, hashtags_he[≤5], first_line_cta}`, validated by Zod.
8. **Publish dialog UI (part 03)**
   - Platform toggles: IG Reel, FB Reel. "Also show in feed" maps to `share_to_feed`.
   - Cover: frame picker or the generated hook cover.
   - Collaborators (≤ 3 usernames), location (own Page), schedule (date/time picker in Asia/Jerusalem).
   - **"בדיקת הוק לקהל חדש (Trial Reel)"** toggle with `MANUAL`/`SS_PERFORMANCE`. Only offer it if the account is eligible; probe this on the first attempt and remember the result.
   - AI-label notice (§8).
9. **Rate-limit guards**
   - IG: read `content_publishing_limit` before publishing. Internal cap 25/day per IG account.
   - FB: 30 Reels per 24 h per Page, enforced in the DB with a rolling-window count.
10. **Insights**
    - IG: request `views,reach,likes,comments,shares,saved,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time,reels_skip_rate` explicitly. Handle `null` skip rate as "not enough data yet". Never request `plays`, `impressions` or `video_views`.
    - FB: `blue_reels_play_count,fb_reels_total_plays,fb_reels_replay_count,post_video_avg_time_watched`. Page level uses `page_media_view`/`post_media_view`/`page_follows`.
11. **Hook leaderboard (part 03 dashboard)**
    - Per niche and per `hook_id`/`trend_template_id`: median skip rate (lower is better), avg watch % of duration, shares per 1k views.
    - Paid metrics come from the Ads module: cost per lead and cost per WhatsApp conversation.
    - Show it in plain Hebrew ("ההוק 'שאלה מפתיעה' שומר 68% מהצופים אחרי 3 שניות").
12. **Boost hand-off**
    - IG: `boost_eligibility_info` → creative with `object_id` + `instagram_user_id` + `source_instagram_media_id`.
    - FB: `object_story_id = {page}_{post}`.
    - Lint rule: forbid the string `instagram_actor_id`.
13. **Provenance:** the finalize step writes XMP `DigitalSourceType` and optionally a C2PA manifest. Store `ai_disclosure_required` per render when it contains photorealistic AI humans or voice clones.
14. **App Review plan in M0**
    - Business verification of the company's Meta business portfolio.
    - Privacy policy URL in Hebrew and English, data-deletion callback, deauthorize callback.
    - A screencast per permission.
    - Build against test users or a role-holder IG/Page while review is pending.
15. **Error mapping:** a Hebrew message table for 190 (reconnect), 200/10 (permission missing), 9/2207042 (daily limit), 2207026 (unsupported format, unverified code) and 2207089 (Instagram glitch, retrying automatically).

## Open questions / [M0-verify] items

1. **[M0-verify]** The IG daily publish quota: 100 or 50? Call `content_publishing_limit` on a real account and record `config.quota_total`.
2. **[M0-verify]** Does the IG API reject captions with more than 5 hashtags (which error?), or does it strip or accept them? Also confirm the current mention limit.
3. **[M0-verify]** FB `video_reels`: does `video_state=SCHEDULED` plus `scheduled_publish_time` work, and what is the maximum horizon (29 days?).
4. **[M0-verify]** Is the FB Reels API duration still 3–90 s after the June 2025 "all videos are Reels" change? Also confirm the file size limit (1 GB vs 4 GB).
5. **[M0-verify]** The exact `trial_params` JSON shape and key casing, how ineligible accounts fail, and whether trial reels can later be boosted.
6. **[M0-verify]** The `boost_eligibility_info` response schema and reason codes. Does a reel published via API with our AI music pass?
7. **[M0-verify]** Can an existing-IG-post creative carry a WhatsApp CTA / click-to-WhatsApp destination? This depends on the Ads report.
8. **[M0-verify]** The `thumb_offset` unit (ms?), `cover_url` aspect requirements, and whether Supabase signed URLs with query strings are accepted as `video_url`, `cover_url` and `file_url`.
9. **[M0-verify]** Headers for IG resumable upload (`ig-api-upload`) and for FB rupload (`file_url` vs body). Confirm that `Authorization: OAuth` is required.
10. **[M0-verify]** Does `reels_skip_rate` work on the Facebook Login path for organic reels, and what are the minimum-views thresholds for non-null values? Confirm the exact names of the repost metrics.
11. **[M0-verify]** Is there any API field for self-disclosing AI content on IG/FB organic posts? Does Instagram read IPTC `DigitalSourceType` or C2PA on **video** uploads today?
12. **[M0-verify]** Is the FB video post ID for `object_story_id` reachable via `GET /{video_id}?fields=post_id` for Reels?
13. **[M0-verify]** Do FB Reels saved as `DRAFT` via API show up in Meta Business Suite so the user can add licensed trending audio there?
14. **Open:** should MVP also support Business Login for Instagram (no Page) for organic-only customers? Recommendation: no. Measure how often onboarding fails on "no linked Page" first.
15. **Open:** App Review timeline and whether Meta requires "Tech Provider"/Access Verification for a SaaS that publishes on behalf of other businesses (unverified).
16. **Open:** auto-cross-post IG → FB (`crossposted_views` suggests Meta supports it) versus two separate uploads. Recommendation: two separate uploads, so each platform can have its own caption and schedule.
