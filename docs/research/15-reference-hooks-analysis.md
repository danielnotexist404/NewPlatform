# 15: Analysis of the founder's 4 reference videos (2026-10-17)

## Method
The founder uploaded 4 vertical reels (720×1280). We extracted frames with ffmpeg: 2 fps for the first 4 s, sparser after that. The files had no audio transcript and no STT was available, so this analysis rests on frames and on-screen text only. The second half of videos 3 and 4 (and the closing part of 1) is a creator explaining why the hook worked. The founder pointed us to **the opening** as the hook to learn from.

Each analysis gives:
- the hook mechanics,
- why it works, mapped to our hook taxonomy (`seed/hook_types.json`),
- how our platform can produce it with AI,
- compliance flags,
- a Hebrew adaptation for Israeli niches.

These four become the first **trend templates** (Part 08).

---

## T1: "Bait clip, then the sign" (פיתיון ושלט)
**Reference (video 1, 10 s):**
- 0–1.8 s: a pole vaulter sprints and plants the pole, the pole bends sideways, and the athlete crashes onto the mat. It is a dramatic, slightly comic sports moment.
- About 1.9 s: a **hard cut** to a plain wall and floor. A man in sunglasses lies on the floor, deadpan, holding a handwritten paper sign: "Hãy đến tham quan bảo tàng" (Vietnamese: "Come visit the museum"). He then does a finger-heart and a cute pose.

**Why it works:**
- The first 2 s are pure attention, a "what is going to happen?" moment (`pattern-interrupt` / `curiosity-gap`).
- The bait has nothing to do with the message. The hard cut to a low-effort, deadpan sign creates a comic payoff (`bold-claim`-style absurdity), and people rewatch and share.
- The CTA *is* the punchline. The video is very short and loops.

**How we make it:**
- Scene 1, the bait: a 2–3 s AI clip from a library of "bait moments" (near-fail sports, a domino about to fall, a cat about to jump, a perfect pour, a balloon about to pop). Prompts are generated per niche, and we never use real third-party footage.
- Scene 2, the sign: an AI keyframe of a person (or the owner's own photo, with consent) holding a **blank** sheet. Remotion composites the Hebrew sign text onto the sheet with a CSS 3D transform and a handwritten Hebrew font, so the Hebrew is perfect.
- Optional micro-animation: a finger-heart sticker.

**Hebrew adaptations:**
| Niche | Sign text |
|---|---|
| Restaurant | "בואו לאכול אצלנו. אנחנו בחולון" |
| Gym | "תתחילו להתאמן. זה פחות כואב מזה" |
| Dentist | "בואו לבדיקה לפני שזה קורה לשיניים" |
| Real estate | "מחפשים דירה? אני מכיר כמה" |

**Compliance:**
- Safe for ads.
- Avoid bait clips that show real injury (Meta "shocking content").
- Likeness: an AI person or the owner with a recorded consent.

---

## T2: "Behind the scenes of our viral" (מאחורי הקלעים)
**Reference (video 2, 27 s, a restaurant):**
- A single static wide shot with the label "behind the scenes" at the top.
- Five staff members do something absurd and coordinated around the bar. One stands on the counter, one sits on it, one sits on the floor on a cushion, and they pass plates. A woman holds a sheet of paper in front of the phone camera on a tripod. It is the "cover the lens, then cut" trick used to make plates "teleport" in the final video.
- No explanation in the first seconds: the chaos itself is the hook.

**Why it works:**
- The viewer can't tell what's happening, and that curiosity holds them to the end (`behind-the-scenes`, `curiosity-gap`).
- It shows real people from the business, which builds trust.
- It doubles the reach of the original viral video ("now go watch the result").

**How we make it:**
- This format needs **real footage of the business**, so we offer a **"guided filming" kit** ("צלמו בעצמכם"): the app shows a 3-step shot list in Hebrew with an overlay guide on the phone ("שימו את הטלפון על חצובה, צלמו את כל הצוות מזווית רחבה…"). The user uploads the clip and we auto-edit it: the "מאחורי הקלעים" label, Hebrew captions, a speed ramp, licensed music, and an end card.
- The "teleport plate" result video is the companion template. The user films 4 short shots, covering the lens between them, and we stitch them with match cuts.

**Hebrew adaptations:**
- "מאחורי הקלעים של הסרטון הכי מטורף שצילמנו במסעדה"
- "ככה נראה יום צילומים אצלנו בסטודיו"
- "מה עשינו עם 5 מלצרים ונייר A4?"

**Compliance:** safe. Every person shown needs a consent checkbox (likeness rule, Part 06).

---

## T3: "The truck almost got me" (כמעט נפגעתי), POV plus product reveal
**Reference (video 3, 48 s, a clothing brand):**
- 0–2.5 s: a POV from a highway footbridge. A truck carrying an absurdly tall tower of cardboard boxes approaches. The tower "hits" the bridge and the boxes fly into the camera.
- Caption: "The truck almost got me smh… 💀🤦".
- Then a hard cut: one box lands, someone opens it, and inside is the brand's red hoodie ("JESUS IS KING"). The creator wears it, and a follow card shows the brand handle.
- The rest of the video is the explainer: "Video that hit 2.7M views…".

**Why it works:**
- A near-miss in POV triggers an instinctive "whoa" (`pattern-interrupt`).
- The impossible physics makes people rewatch and comment "is it real?" (`satisfying-visual`).
- The box turns the spectacle into the product (`demonstration`, `result-first`).

**How we make it:**
- The bridge, truck and box-impact shot is exactly what image-to-video models do well. Veo 3.1 or Kling 3.0 make a 4–5 s clip from a generated keyframe.
- Scene 2 is the unboxing: the user's own product photo or video, or an AI image-to-video of the product being pulled from a box.
- The caption is a Hebrew meme line rendered by Remotion: "המשאית כמעט תפסה אותי 💀".
- End card: the brand, a WhatsApp CTA, or "הזמינו באתר".

**Hebrew adaptations:**
| Niche | Version |
|---|---|
| E-commerce, fashion, gifts | Boxes, then the product |
| Movers | "המשאית שלנו לא מאבדת אף ארגז" (the boxes fly but land safely) |
| Pizza or food delivery | Pizza boxes flying, then a fresh pizza |
| Flower shop | Bouquets |

**Compliance:**
- AI-generated realistic danger can mislead viewers. Add a small "צולם ב-AI" or "בדיחה" label, plus the Meta AI-info label for ads.
- Never show real people being hurt.

---

## T4: "Fake system pop-up" (התראה מזויפת)
**Reference (video 4, 53 s, a fried-chicken restaurant):**
- 0–1 s: a POV at a wooden table, with the viewer's hand resting on it. A server walks in and puts down a tray of fried chicken and fries.
- About 1.5 s: an **iPhone-style "Low Battery, 10% battery remaining · Low Power Mode · Close" pop-up** appears right over the food.
- Viewers instinctively try to tap "Close" and keep watching (`pattern-interrupt`).
- The explainer part: "This reel pulled 50,000 [views]" on a small account (the restaurant's previous reels had about 4,495 and 3,690 views). It cites similar tricks with 108M and 26.8M views ("fooling people with my edits"), labelled "triggers… viral".

**Why it works:**
- It exploits a reflex: a fake UI makes people pause, tap and rewatch.
- The food stays the visual centre, so the dwell time is spent looking at the product.

**How we make it:**
- Scene: a POV of a table with food served, from an AI image-to-video clip or the user's own clip.
- The pop-up is rendered **deterministically in Remotion** as a Hebrew iOS-style dialog ("סוללה חלשה · נותרו 10% · מצב חיסכון בסוללה · סגירה"). There are variants:
  - "הודעה חדשה מאמא"
  - "האוכל שלך הגיע"
  - "נשארו 2 מנות"

**Compliance (important):**
- Meta's advertising standards prohibit ads that imitate system notifications, fake buttons or deceptive UI.
- **T4 is therefore "organic only"**: the platform must block publishing it as a paid ad, and the campaign builder must show a clear Hebrew explanation.
- Fake-urgency variants like "נשארו 2 מנות" are allowed only when they are true (consumer law, Part 02/App E "truth first").

---

## Cross-cutting lessons for the product
1. **Hooks are formats, not sentences.** Our seed has 326 text hooks. These references show the winning layer is often **visual and editorial**: a hard cut, a fake UI, POV physics, a deadpan sign. Part 08 must model a *trend template* as a scene recipe (bait scene → cut → payoff → CTA) with per-niche prompts, not just a text line.
2. **Two production modes:**
   - **AI-only** (T1, T3 and T4 are fully generatable).
   - **Guided filming** (T2, and any template that needs the real team or place). The app teaches filming in 3 shots and edits automatically. This keeps it authentic and cheap.
3. **Explainer content is our marketing.** Videos 3 and 4 are "why this went viral" breakdowns. {{BRAND_NAME}} should publish a weekly Hebrew "פירוק טרנד" reel and page. Each one links to the template ("צרו את זה לעסק שלכם בלחיצה"), which feeds both SEO and social.
4. **Small accounts can win.** The fried-chicken example went from about 4K to 50K views. This is the core promise for small Israeli businesses, and it should be shown honestly, as an example, not as a guarantee.
5. **Each template carries an "ad-safe" flag.** It is checked by the campaign builder (Part 07) and the moderation step (Part 05). Values: `ad_safe` / `organic_only` / `needs_consent` / `needs_ai_label`.
6. **Licensed music only.** Trending sounds can't be used in ads. Templates use the platform library or Lyria-generated music and say so.
