#!/usr/bin/env python3
"""Build and validate the trend-templates seed (part 08 §12, prompt/08-trends-engine.md).

Single source of truth for seed/trend_templates.json: the 12 launch templates of spec §J.9 —
T1–T4 from the founder's reference reels (docs/research/15-reference-hooks-analysis.md) and 8 evergreen
formats (docs/research/13-viral-trends-engine.md §4.3). The rules checked here are the TrendTemplateV1
rules of part 08 §5.6 (codes TT01–TT27); lib/trends/validate.ts enforces the same list at runtime, and
lib/trends/seed-schema.ts (TrendTemplateSeed, TREND_TEMPLATE_KEY_ORDER) is the seed's Zod twin.

Run from anywhere:   python3 -I seed/scripts/build_trends.py            (writes the file, then validates it)
Validate only:       python3 -I seed/scripts/build_trends.py --check    (rebuilds in memory; fails on any diff)
Docs helper:         python3 -I seed/scripts/build_trends.py --print-compact   (one template per line, for part 08 §18)

Hebrew copy follows Appendix E and the seed conventions of seed/README.md: plural or neutral address, the
hooks-seed shekel exception ("{מחיר} ₪"; applyShekel moves the sign per brand kit when the text enters a
project), gershayim ״ and geresh ׳, no gender slashes or dots, no "הכל". Numbers that a business must
confirm are placeholders from the dictionary of docs/03-hooks-library.md §11.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SEED = ROOT / "seed"
OUT = SEED / "trend_templates.json"

sys.path.insert(0, str(HERE))
from build_seed import _hebrew_text_issues  # noqa: E402  (BANNED_PHRASES of Appendix E §5.2 + typography: one source)

# ---------------------------------------------------------------------------
# Enums and limits (canonical; mirror part 04 §3, part 05 §11.2 and part 08 §5)
# ---------------------------------------------------------------------------
LIFECYCLES = ["moment", "format", "evergreen"]
PRODUCTION_MODES = ["ai", "guided", "hybrid"]
AD_SAFETY = ["ad_safe", "organic_only", "needs_consent", "needs_ai_label"]
HOOK_GOALS = ["awareness", "leads", "sales", "trust", "engagement"]
VIDEO_TYPES = ["brand_promo", "reel_hook", "offer", "testimonial", "launch", "recruiting", "explainer"]
VISUAL_STYLES = ["cinematic", "ugc", "day_in_business", "before_after", "product", "text_motion"]
MUSIC_MOODS = ["energetic", "warm", "luxury", "funny", "calm", "inspiring", "urban"]
CAPTION_PRESETS = ["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"]
VO_MODES = ["none", "optional", "required"]
AD_GOALS = ["whatsapp_messages", "lead_form", "website_traffic", "local_awareness"]
CTA_TYPES = ["whatsapp", "call", "link_in_bio", "booking", "navigate", "lead_form", "comment_keyword", "save_share", "visit_site"]
ROLES = ["bait", "cut", "payoff", "reveal", "cta", "label"]
SCENE_SOURCES = ["ai_clip", "ai_image_kenburns", "user_media", "brand_card"]
CAMERAS = ["static", "push_in", "pull_out", "pan_left", "pan_right", "tilt_up", "tilt_down", "handheld", "orbit", "drone"]
TRANSITIONS = ["cut", "fade", "whip", "zoom", "slide", "wipe", "flash"]
SFX = ["whoosh", "impact", "pop", "sizzle", "click", "riser", "cash", "camera_shutter"]   # scenes.sfx without "none"
OVERLAY_KINDS = ["sign", "fake_ui", "meme_caption", "bts_label", "split_reveal", "comment_bubble", "rating",
                 "pov_label", "clock", "sticker", "price"]
LABEL_KINDS = {"bts_label", "pov_label"}
ENERGY = ["flat", "build", "drop", "loop"]
FRAMINGS = ["wide", "medium", "closeup", "pov"]
GHOSTS = ["tripod_wide", "hands_table", "face_center", "product_center", "cover_lens"]
STICKER_EMOJI = ["🫶", "❤️", "🔥", "👍", "😂", "🎉", "✨", "👏"]
FAKE_UI_VARIANTS = ["low_battery", "new_message", "order_arrived", "generic"]
DURATIONS = [15, 30, 45, 60]
PROMPT_SLOTS = {"subject_en", "setting_en", "product_en", "bait_en"}
# Appendix F §7.4 dictionary (part 05 §8.2 ALLOWED_PLACEHOLDERS); the first 17 are allowed in hook lines
ALLOWED_PLACEHOLDERS = ["עיר", "שכונה", "שירות", "מוצר", "מחיר", "סכום", "מספר", "זמן", "חודש", "קהל_יעד", "שם_העסק",
                        "פעולה_שגויה", "מיתוס", "לפני", "אחרי", "הנחה", "בעיה",
                        "דירוג", "כתובת", "שם_לקוח", "מספר_רישיון", "מילה"]
HOOK_PLACEHOLDERS = ALLOWED_PLACEHOLDERS[:17]
# Appendix E §12 LENGTH_LIMITS for overlay text slots (part 08 §8.2)
SLOT_LIMITS = {"sign": 40, "meme_caption": 40, "pov_label": 40, "comment_bubble": 60, "price": 40}
POPUP_TITLE_MAX, POPUP_BODY_MAX = 24, 60
ONSCREEN_MAX_CHARS, ONSCREEN_MAX_WORDS = 70, 8      # ScriptV1 / StoryboardScene limits (part 05 §11.2, S05)
WPS = 2.4                                           # app_settings.hebrew_wps.default (part 05 §12.1)
NAME_HE_LATIN_OK = {"POV"}                          # canonical trend names that stay in Latin (spec §J.9)
# Appendix E §19.6 RESULTS_BANNED_PHRASES (HE027): trend copy can end up in paid ads and on the public pages
RESULTS_BANNED = ["תוצאות מובטחות", "תוצאה מובטחת", "יותר לקוחות בוודאות", "ויראלי מובטח", "יהיה ויראלי",
                  "יתפוצץ ברשת", "הכפלת המכירות", "הכפלת ההכנסות", "החזר השקעה מובטח", "בטוח יעבוד",
                  "בטוח תקבלו", "הממוצע בתחום", "עסקים כמוכם", "הקמפיין נכשל", "ROI"]
# Appendix E §18.4 PERSONAL_ATTRIBUTE_PATTERNS (HE026, simplified stems): no 2nd-person address next to a personal attribute
PERSONAL_ATTRIBUTE_STEMS = ["כאב", "כואב", "מחלה", "חולה", "חרדה", "דיכאון", "משקל", "קילו", "היריון", "הריון",
                            "חובות", "פיגור", "מובטל", "גירושין", "גרוש", "רווק", "רווקה", "בני 50", "בנות 50"]
SECOND_PERSON = ["אתם", "אתן", "אתה", "יש לכם", "שלכם", "לכם", "אצלכם", "סובלים", "סובלת", "סובל"]
# singular address forms of Appendix E §4.4 (unambiguous ones): templates address in plural or not at all
SINGULAR_FORMS = {"בואי", "בוא", "שלחי", "התקשרי", "קבעי", "כתבי", "שמרי", "בדקי", "בדוק", "גלי",
                  "הזמיני", "השאירי", "נווטי", "צרי", "נסי", "תגידי", "תגיד", "אתה", "שלך", "לך", "בשבילך", "אצלך"}
# reference expression of T1–T4 (R15) that must never appear in a template (similarity guard, part 08 §5.7)
REFERENCE_TEXTS = ["Hãy đến tham quan bảo tàng", "Come visit the museum", "The truck almost got me smh",
                   "The truck almost got me", "JESUS IS KING", "10% battery remaining", "Low Power Mode",
                   "fooling people with my edits", "Video that hit 2.7M views", "This reel pulled 50,000"]
GENERIC_MARKERS = {"pov", "grwm", "asmr"}

TOP_KEYS = ["slug", "name_he", "tagline_he", "description_he", "why_it_works_he", "hook_type_slug", "lifecycle",
            "production_mode", "ad_safety", "extra_gates", "requires_real_footage", "requires_people_consent", "recipe",
            "hook_variants", "niche_adaptations", "music_brief", "required_overlays", "shot_list", "compliance_notes_he",
            "do_not_copy", "platform_tone", "default_duration_sec", "default_goal", "default_video_type",
            "default_visual_style", "default_music_mood", "default_caption_preset", "vo_mode", "recommended_ad_goal",
            "niches", "first_seen_at", "peak_expected_at", "expires_at", "seo_title_he", "seo_description_he",
            "is_featured", "sort_order"]
BEAT_KEYS = ["key", "role", "duration_ms", "purpose_he", "visual_source", "visual_prompt_en", "motion_prompt_en", "camera",
             "transition_in", "sfx", "speed", "onscreen_slot", "vo_slot", "overlay", "guided_shot_key", "spans"]


# ---------------------------------------------------------------------------
# Constructors (keep every beat in canonical key order)
# ---------------------------------------------------------------------------
def scene(key, role, ms, purpose, source, prompt="", motion="", camera="static", transition="cut", sfx=None,
          speed=None, onscreen=None, vo=None, overlay=None, shot=None):
    return {"key": key, "role": role, "duration_ms": ms, "purpose_he": purpose, "visual_source": source,
            "visual_prompt_en": prompt, "motion_prompt_en": motion, "camera": camera, "transition_in": transition,
            "sfx": sfx, "speed": speed, "onscreen_slot": onscreen, "vo_slot": vo, "overlay": overlay,
            "guided_shot_key": shot, "spans": None}


def cut(key, sfx=None, purpose="חיתוך חד, בלי מעבר"):
    return {"key": key, "role": "cut", "duration_ms": 0, "purpose_he": purpose, "visual_source": None,
            "visual_prompt_en": "", "motion_prompt_en": "", "camera": None, "transition_in": "cut", "sfx": sfx,
            "speed": None, "onscreen_slot": None, "vo_slot": None, "overlay": None, "guided_shot_key": None, "spans": None}


def label(key, purpose, overlay, spans):
    return {"key": key, "role": "label", "duration_ms": 0, "purpose_he": purpose, "visual_source": None,
            "visual_prompt_en": "", "motion_prompt_en": "", "camera": None, "transition_in": None, "sfx": None,
            "speed": None, "onscreen_slot": None, "vo_slot": None, "overlay": overlay, "guided_shot_key": None,
            "spans": spans}


def slot(key, max_chars, example):
    return {"key": key, "max_chars": max_chars, "example_he": example}


def vo(key, sec):
    return {"key": key, "max_words": int(sec * WPS * 0.9)}


def shot(key, title, instruction, framing, min_sec, max_sec, ghost, tips, people):
    return {"key": key, "title_he": title, "instruction_he": instruction, "framing": framing, "min_sec": min_sec,
            "max_sec": max_sec, "ghost": ghost, "tips_he": tips, "people_on_camera": people}


def adapt(niche, subject, setting, product, examples, cta, vo_example=None, notes=None):
    return {"niche_slug": niche, "subject_en": subject, "setting_en": setting, "product_en": product,
            "onscreen_examples_he": examples, "vo_example_he": vo_example, "cta_type": cta, "notes_he": notes}


def variant(key, bait, hook, why):
    return {"key": key, "bait_concept_en": bait, "hook_line_he_pattern": hook, "why_he": why}


def music(mood, bpm_min, bpm_max, drop, energy, cues):
    return {"mood": mood, "bpm_min": bpm_min, "bpm_max": bpm_max, "drop_at_ms": drop, "energy_curve": energy,
            "sfx_cues": [{"beat_key": k, "kind": v} for k, v in cues]}


# overlay templates (part 08 §8.2: "$onscreen" = the beat's own text slot, "$hook" = the hook line)
def ov_sign():
    return {"kind": "sign", "textHe": "$onscreen", "quad": None, "quadSource": "preset",
            "presetQuad": {"tl": {"x": 0.2, "y": 0.24}, "tr": {"x": 0.8, "y": 0.24},
                           "br": {"x": 0.8, "y": 0.5}, "bl": {"x": 0.2, "y": 0.5}},
            "ink": "auto", "reveal": "words", "fromMs": 300, "toMs": None, "position": "auto"}


def ov_sticker(emoji, at_ms, x, y, size=180):
    return {"kind": "sticker", "stickers": [{"emoji": emoji, "atMs": at_ms, "anchor": {"x": x, "y": y}, "sizePx": size}],
            "fromMs": 0, "toMs": None, "position": "auto"}


def ov_meme(emoji):
    return {"kind": "meme_caption", "textHe": "$onscreen", "emoji": emoji, "fromMs": 0, "toMs": None, "position": "top"}


def ov_fake_ui(variant_name, from_ms, to_ms):
    return {"kind": "fake_ui", "variant": variant_name, "titleHe": "$onscreen", "bodyHe": "$onscreen",
            "buttonsHe": ["סגירה"], "theme": "light", "tapAtMs": to_ms - 250, "fromMs": from_ms, "toMs": to_ms,
            "position": "center"}


def ov_bts():
    return {"kind": "bts_label", "textHe": "מאחורי הקלעים", "fromMs": 0, "toMs": None, "position": "top"}


def ov_pov():
    return {"kind": "pov_label", "prefix": "POV:", "textHe": "$hook", "fromMs": 0, "toMs": None, "position": "top"}


def ov_split(before_key):
    return {"kind": "split_reveal", "before": {"beatKey": before_key, "sceneIndex": None}, "beforeSource": None,
            "labelBeforeHe": "לפני", "labelAfterHe": "אחרי", "dividerFromMs": 300, "dividerToMs": 800,
            "fromMs": 0, "toMs": None, "position": "auto"}


def ov_comment():
    return {"kind": "comment_bubble", "leadHe": "לקוח שאל:", "textHe": "$onscreen", "source": "generic",
            "fromMs": 0, "toMs": None, "position": "top"}


def ov_verdict(truth, label_he, from_ms=0, to_ms=None):
    return {"kind": "rating", "mode": "verdict", "scoreText": None, "verdict": truth, "labelHe": label_he,
            "fromMs": from_ms, "toMs": to_ms, "position": "auto"}


def ov_clock(time):
    return {"kind": "clock", "time": time, "fromMs": 0, "toMs": None, "position": "top"}


def ov_price():
    return {"kind": "price", "amountHe": "$onscreen", "labelHe": "$onscreen", "strikeAmountHe": None,
            "fromMs": 300, "toMs": None, "position": "center"}


NO_TEXT = "no text, no letters, no logos, no watermark"


# ---------------------------------------------------------------------------
# The 12 templates
# ---------------------------------------------------------------------------
def t1_bait_and_sign():
    return {
        "slug": "bait-and-sign",
        "name_he": "פיתיון ושלט",
        "tagline_he": "שלוש שניות של מתח, ואז שלט שאומר בדיוק מה רוצים",
        "description_he": "הסרטון נפתח ברגע מותח שאין לו שום קשר לעסק, ואז חיתוך חד לאדם שעומד מול המצלמה בפנים רציניות ומחזיק שלט בכתב יד. השלט הוא ההזמנה, והוא גם הפאנץ׳. הכול נוצר ב-AI, והטקסט על השלט נכתב אצלנו בעברית מדויקת.",
        "why_it_works_he": "הרגע המותח עוצר את הגלילה, והמעבר הפתאומי לשלט יבש מצחיק כי לא ציפו לו. ההזמנה לעסק היא הבדיחה עצמה, ולכן צופים עד הסוף ושולחים לחברים.",
        "hook_type_slug": "pattern-interrupt",
        "lifecycle": "format",
        "production_mode": "ai",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("bait", "bait", 2500, "רגע מותח בלי קשר לעסק: עוד שנייה משהו קורה", "ai_clip",
                  "Handheld smartphone-style shot of {bait_en}, bright natural daylight, candid everyday setting",
                  "the moment builds for two and a half seconds and stays unresolved, slight handheld shake, natural motion",
                  camera="handheld", onscreen=slot("hook_line", 24, "נכנס או לא נכנס?")),
            cut("cut1", sfx="impact"),
            scene("sign", "payoff", 7000, "אדם רציני מחזיק שלט בכתב יד עם ההזמנה לעסק", "ai_image_kenburns",
                  "Static frontal medium shot of {subject_en} standing against a plain wall in {setting_en}, holding a blank white sheet of paper flat at chest height with both hands, the sheet faces the camera and is fully visible, deadpan neutral expression, soft even light",
                  "almost still, a slow blink, the sheet stays perfectly flat",
                  sfx="impact", onscreen=slot("sign_text", 40, "בואו לאכול אצלנו. אנחנו ב{עיר}"), overlay=ov_sign()),
            scene("cta", "cta", 5500, "המקום או המוצר האמיתי, עם הנעה לפעולה קצרה", "ai_image_kenburns",
                  "Close-up of {product_en} in {setting_en}, warm inviting light, shallow depth of field",
                  "slow push in toward the subject", camera="push_in",
                  onscreen=slot("cta_line", 30, "שלחו וואטסאפ ושמרו שולחן"), overlay=ov_sticker("🫶", 700, 0.7, 0.42)),
        ]},
        "hook_variants": [
            variant("A", "a basketball rolling around the rim of a hoop again and again, about to drop in or out",
                    "נכנס או לא נכנס?", "שאלה פתוחה כבר בשנייה הראשונה, והצופה נשאר לראות את התשובה."),
            variant("B", "a long row of colourful dominoes on a café table starting to tip toward a full cup of coffee",
                    "עוד שנייה זה נופל", "תחושה שמשהו עומד להשתבש, בלי שום סכנה אמיתית."),
            variant("C", "milk poured into a coffee cup that is already full, the foam rising right to the rim",
                    "רק לא לשפוך", "מתח קטן ומוכר מהיומיום, שכל אחד מזדהה איתו."),
        ],
        "niche_adaptations": [
            adapt("restaurants", "a chef in a plain dark apron, around 35", "the dining room of a small neighbourhood restaurant",
                  "a plate of freshly grilled food on a wooden table",
                  {"hook_line": "נכנס או לא נכנס?", "sign_text": "בואו לאכול אצלנו. אנחנו ב{עיר}",
                   "cta_line": "שלחו וואטסאפ ושמרו שולחן"}, "whatsapp",
                  notes="אפשר לכתוב על השלט את שם המנה הכי מבוקשת במקום ההזמנה הכללית."),
            adapt("fitness-trainers", "a fitness trainer in a plain t-shirt, around 30", "a small bright training studio",
                  "a clean training mat with a pair of dumbbells",
                  {"hook_line": "עוד שנייה זה נופל", "sign_text": "בואו להתאמן. התירוצים נשארים בחוץ",
                   "cta_line": "שלחו הודעה ונתאם אימון"}, "whatsapp"),
            adapt("dentists", "a dentist in a white coat, around 40", "a calm modern dental clinic",
                  "an empty treatment chair by a bright window",
                  {"hook_line": "רק לא לשפוך", "sign_text": "בואו לבדיקה לפני שזה קורה לשיניים",
                   "cta_line": "קבעו תור לבדיקה"}, "booking",
                  notes="בלי הבטחות רפואיות ובלי \"בלי כאב\". השלט מזמין לבדיקה, ולא מבטיח תוצאה."),
            adapt("real-estate", "a real estate agent in a casual blazer, around 40", "a bright empty apartment living room",
                  "a sunny balcony with a city view",
                  {"hook_line": "נכנס או לא נכנס?", "sign_text": "מחפשים דירה? אני מכיר כמה",
                   "cta_line": "שלחו וואטסאפ ונקבע סיור"}, "whatsapp",
                  notes="גוף ראשון לפי מי שמחזיק את השלט: \"אני מכיר\" או \"אני מכירה\"."),
        ],
        "music_brief": music("funny", 96, 118, 2500, "drop", [("sign", "impact")]),
        "required_overlays": ["sign", "sticker"],
        "shot_list": None,
        "compliance_notes_he": [
            "רגע הפיתיון נוצר ב-AI ולא מראה פגיעה באף אחד.",
            "מי שמחזיק את השלט הוא דמות AI כללית. אפשר להחליף לתמונה של בעלי העסק, עם הסכמה בכתב.",
            "הטקסט על השלט חייב להיות נכון: עיר, שירות ומחיר כמו שהם באמת.",
        ],
        "do_not_copy": [
            "the reference sign text 'Hãy đến tham quan bảo tàng' and its translation 'Come visit the museum' (also in Hebrew: 'בואו לבקר במוזיאון')",
            "the pole-vault crash footage and any pole-vault bait",
            "the man in sunglasses lying on the floor, his look and his poses",
            "the finger-heart pose sequence as performed in the reference",
            "the reference audio track",
        ],
        "platform_tone": {"reels": "קצר וחד: בלי הסבר, השלט עושה את העבודה",
                          "facebook": "אפשר שורת פתיחה אחת מעל הסרטון, בלי לגלות את הסוף"},
        "default_duration_sec": 15, "default_goal": "awareness", "default_video_type": "reel_hook",
        "default_visual_style": "ugc", "default_music_mood": "funny", "default_caption_preset": "bold-pop",
        "vo_mode": "none", "recommended_ad_goal": "local_awareness",
        "niches": ["restaurants", "fitness-trainers", "dentists", "real-estate", "barbers-salons", "beauty-nails",
                   "home-services", "retail-stores"],
        "first_seen_at": "2026-10-17", "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד פיתיון ושלט: רילס מצחיק לעסקים",
        "seo_description_he": "רגע מותח, חיתוך חד ושלט בכתב יד עם ההזמנה שלכם. ככה עושים את הטרנד לעסק, עם דוגמאות לפי תחום ומוזיקה שמותרת לפרסום.",
        "is_featured": True, "sort_order": 10,
    }


def t2_behind_the_viral():
    wide = "wide_chaos"
    return {
        "slug": "behind-the-viral",
        "name_he": "מאחורי הקלעים",
        "tagline_he": "הבלגן של ההכנות הוא ההוק, והתוצאה מגיעה בסוף",
        "description_he": "צילום רחב וקבוע של הצוות באמצע ההכנות לסרטון, עם התווית \"מאחורי הקלעים\". הצופים לא מבינים מה קורה ונשארים לראות, ובסוף מגיעה התוצאה. אתם מצלמים לפי רשימת צילומים קצרה, ואנחנו עורכים: תווית, כתוביות, האצה, מוזיקה וכרטיס סיום.",
        "why_it_works_he": "סקרנות נקייה: אי אפשר להבין מה הם עושים עד שרואים את התוצאה. אנשים אמיתיים מהעסק בונים אמון, והסרטון מפנה גם לסרטון התוצאה.",
        "hook_type_slug": "behind-the-scenes",
        "lifecycle": "format",
        "production_mode": "guided",
        "ad_safety": "needs_consent",
        "extra_gates": [],
        "requires_real_footage": True,
        "requires_people_consent": True,
        "recipe": {"version": 1, "beats": [
            label("bts", "תווית קבועה מעל צילומי ההכנות", ov_bts(), ["chaos", "chaos_more"]),
            scene("chaos", "bait", 3500, "צילום רחב של כל הצוות באמצע ההכנות, בלי הסבר", "user_media",
                  speed=1.25, onscreen=slot("hook_line", 40, "הסרטון הכי מטורף שצילמנו במסעדה"),
                  vo=vo("chaos_vo", 3.5), shot=wide),
            scene("chaos_more", "payoff", 7000, "הבלגן ממשיך, מואץ, וכולם רציניים לגמרי", "user_media",
                  speed=1.5, onscreen=slot("detail_line", 30, "כן, זה בכוונה"), vo=vo("chaos_more_vo", 7), shot=wide),
            scene("result", "reveal", 7500, "התוצאה הגמורה: למה כל הבלגן היה שווה", "user_media", transition="whip",
                  sfx="whoosh", onscreen=slot("result_line", 30, "וזה מה שיצא"), vo=vo("result_vo", 7.5),
                  shot="final_result"),
            scene("team", "payoff", 6000, "הצוות שעשה את זה, מנופף למצלמה", "user_media",
                  onscreen=slot("team_line", 30, "הצוות שעשה את זה"), vo=vo("team_vo", 6), shot="team_wave"),
            scene("cta", "cta", 6000, "איך מגיעים אלינו", "brand_card",
                  onscreen=slot("cta_line", 30, "בואו לראות את זה מקרוב"), vo=vo("cta_vo", 6)),
        ]},
        "hook_variants": [
            variant("A", "open on the most absurd wide moment of the preparation, everyone in the middle of an action",
                    "הסרטון הכי מטורף שצילמנו אצלנו", "רואים בבת אחת את כל הבלגן, ולא מבינים מה הולך לצאת ממנו."),
            variant("B", "open on the moment someone covers the camera lens with a sheet of paper, then reveal the room",
                    "מה קורה מאחורי הדף הזה?", "המסך המכוסה יוצר שאלה, והחשיפה עונה עליה."),
            variant("C", "open on one team member keeping a completely straight face in the middle of the chaos",
                    "מה עשינו עם {מספר} עובדים ודף נייר?", "פרצוף רציני באמצע הבלגן מצחיק עוד לפני שמבינים למה."),
        ],
        "niche_adaptations": [
            adapt("restaurants", "the restaurant floor team in work aprons", "a busy restaurant bar area",
                  "a signature dish served at the bar",
                  {"hook_line": "הסרטון הכי מטורף שצילמנו במסעדה", "detail_line": "כן, זה בכוונה",
                   "result_line": "וזה מה שיצא", "team_line": "צוות הערב שלנו", "cta_line": "בואו לראות את זה מקרוב"},
                  "whatsapp",
                  vo_example="ככה נראות ההכנות לסרטון קצר אחד. ועכשיו התוצאה.",
                  notes="כל מי שמופיע בצילום, גם עובדים, צריך לאשר בכתב לפני הפרסום."),
            adapt("event-photographers", "a photographer and an assistant with lights and a backdrop", "a small photo studio",
                  "a finished portrait on a camera screen",
                  {"hook_line": "ככה נראה יום צילומים אצלנו בסטודיו", "detail_line": "התאורה לקחה יותר זמן מהצילום",
                   "result_line": "וזו התמונה שיצאה", "team_line": "הצוות שמאחורי המצלמה",
                   "cta_line": "שלחו וואטסאפ וקבעו צילומים"}, "whatsapp",
                  vo_example="רוב העבודה קורית לפני שלוחצים על הכפתור."),
            adapt("beauty-nails", "a nail technician and a client at the work table", "a calm nail studio with soft lighting",
                  "a finished set of nails in close-up",
                  {"hook_line": "ככה נראה יום צילומים אצלנו בסטודיו", "detail_line": "רגע לפני שזה מושלם",
                   "result_line": "וזו התוצאה", "team_line": "הידיים שמאחורי כל ציפורן", "cta_line": "קבעו תור אונליין"},
                  "booking",
                  vo_example="לפני כל סרטון יפה יש בלגן קטן. זה שלנו."),
            adapt("fitness-trainers", "a trainer and two clients", "a training studio during a busy hour",
                  "the trainer giving a high five after a set",
                  {"hook_line": "ככה צילמנו את אימון הבוקר", "detail_line": "אף אחד לא הבין מה אנחנו עושים",
                   "result_line": "וזה הסרטון שיצא", "team_line": "המאמנים של הסטודיו",
                   "cta_line": "שלחו הודעה ונתאם אימון"}, "whatsapp",
                  vo_example="ככה נראה צילום של סרטון קצר, מאחורי הקלעים."),
        ],
        "music_brief": music("energetic", 110, 128, 23500, "build", [("result", "whoosh")]),
        "required_overlays": ["bts_label"],
        "shot_list": {"version": 1, "intro_he": "שלושה שוטים קצרים, בערך עשר דקות של צילום. אנחנו עורכים, מוסיפים כתוביות ומוזיקה.",
                      "estimated_minutes": 10, "shots": [
            shot(wide, "הבלגן מזווית רחבה",
                 "שימו את הטלפון לאורך על חצובה או על מדף, וצלמו את כל הצוות באמצע ההכנות. לא עוצרים באמצע.",
                 "wide", 15, 45, "tripod_wide",
                 ["האור מגיע מאחורי הטלפון, לא מולו", "כולם בתוך המסגרת, גם מי שמחזיק את הדף",
                  "בקשו מכל מי שמצטלם אישור לפני שמתחילים"], True),
            shot("final_result", "התוצאה",
                 "צלמו את התוצאה הגמורה: המנה על הבר, הצוות בעמדות, או הסרטון שיצא מההכנות.",
                 "medium", 5, 25, "product_center", ["צילום אחד יציב, בלי לזוז", "התוצאה במרכז המסגרת"], False),
            shot("team_wave", "הצוות מזמין", "כל הצוות מול המצלמה, מחייך ומנופף. בלי לדבר, רק תנועה.",
                 "medium", 3, 10, "face_center", ["כולם בגובה העיניים של המצלמה", "בקשו מכל מי שמצטלם אישור לפני שמתחילים"], True),
        ]},
        "compliance_notes_he": [
            "כל מי שמופיע בצילום צריך לתת הסכמה בכתב, גם עובדים.",
            "בלי ילדים בצילום.",
            "התוצאה בסוף צריכה להיות אמיתית: מה שהעסק עשה באמת.",
        ],
        "do_not_copy": [
            "the reference restaurant, its bar and its staff",
            "the exact plate-passing choreography and staff positions of the reference",
            "the English 'behind the scenes' caption styling of the reference",
            "the reference music",
        ],
        "platform_tone": {"reels": "אנרגטי ואמיתי, כמו צילום מהטלפון של הצוות",
                          "facebook": "כדאי שורה שמסבירה שזה מאחורי הקלעים של סרטון אחר"},
        "default_duration_sec": 30, "default_goal": "engagement", "default_video_type": "reel_hook",
        "default_visual_style": "ugc", "default_music_mood": "energetic", "default_caption_preset": "bold-pop",
        "vo_mode": "optional", "recommended_ad_goal": "local_awareness",
        "niches": ["restaurants", "event-photographers", "beauty-nails", "fitness-trainers", "catering-chefs", "event-venues"],
        "first_seen_at": "2026-10-17", "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד מאחורי הקלעים: איך מצלמים את זה בעסק",
        "seo_description_he": "צילום רחב של הצוות באמצע ההכנות, ותוצאה בסוף. ככה עושים את טרנד מאחורי הקלעים לעסק, עם רשימת צילומים קצרה ועריכה אוטומטית.",
        "is_featured": False, "sort_order": 20,
    }


def t3_almost_got_me():
    return {
        "slug": "almost-got-me-reveal",
        "name_he": "כמעט נפגעתי",
        "tagline_he": "קופסאות עפות ישר למצלמה, ובתוך אחת מהן המוצר שלכם",
        "description_he": "צילום מנקודת המבט של הצופה: ערימה של קופסאות עפה ישר לעבר המצלמה, בפיזיקה שברור שהיא לא אמיתית. חיתוך, קופסה אחת נפתחת, ובפנים המוצר שלכם. הכול נוצר ב-AI, עם התווית \"נוצר באמצעות AI\".",
        "why_it_works_he": "כמעט-תאונה מנקודת מבט ראשונה מפעילה תגובה אינסטינקטיבית, והפיזיקה הבלתי אפשרית גורמת לצפות שוב. הקופסה הופכת את המחזה למוצר.",
        "hook_type_slug": "pattern-interrupt",
        "lifecycle": "format",
        "production_mode": "ai",
        "ad_safety": "needs_ai_label",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("bait", "bait", 3500, "כמעט-תאונה: קופסאות עפות ישר אל המצלמה", "ai_clip",
                  "First-person POV shot, {bait_en}, the objects tumble straight toward the lens, motion blur, bright daylight, playful and clearly impossible physics, nobody is in harm's way",
                  "the objects fly toward the camera and stop just before the lens, quick and exaggerated",
                  camera="handheld", onscreen=slot("hook_line", 40, "המשלוח הגיע. כמעט דרך המצלמה"), overlay=ov_meme("💀")),
            cut("cut1", sfx="impact"),
            scene("reveal", "reveal", 6000, "קופסה אחת נוחתת ונפתחת, ובפנים המוצר", "ai_clip",
                  "Close-up of hands opening a single cardboard box on a sidewalk, revealing {product_en} inside, soft daylight",
                  "the flaps open and the product is lifted slowly toward the camera", camera="push_in", sfx="impact",
                  onscreen=slot("reveal_line", 30, "וזה מה שהיה בקופסה")),
            scene("cta", "cta", 5500, "המוצר במלוא הדרו, עם הנעה לפעולה", "ai_image_kenburns",
                  "{product_en} displayed in {setting_en}, clean bright light, simple composition",
                  "slow orbit around the product", camera="orbit", onscreen=slot("cta_line", 30, "כל הפרטים באתר")),
        ]},
        "hook_variants": [
            variant("A", "a delivery van hits a bump in a narrow street and a tall stack of {subject_en} flies off its roof rack",
                    "המשלוח הגיע. כמעט דרך המצלמה", "רגע של בהלה שהופך מיד לצחוק, ואז לשאלה מה יש בקופסה."),
            variant("B", "a tower of {subject_en} on a high warehouse shelf tips over and cascades down",
                    "רגע, זה נופל עליי?", "השאלה של הצופה כתובה על המסך, בדיוק ברגע הנכון."),
            variant("C", "{subject_en} bounce one after another down a long outdoor staircase",
                    "כל הקופסאות האלה בדרך אליי", "קצב של נפילות חוזרות יוצר מתח עד הקופסה האחרונה."),
        ],
        "niche_adaptations": [
            adapt("ecommerce", "cardboard shipping boxes", "a clean, bright product corner with a light background",
                  "the store's best-selling product, neatly folded",
                  {"hook_line": "ההזמנה בדרך אליכם. ממש בדרך", "reveal_line": "וזה מה שהיה בקופסה",
                   "cta_line": "כל הפרטים באתר"}, "visit_site",
                  notes="המוצר בקופסה הוא המוצר האמיתי, באותם צבעים ובאותה אריזה."),
            adapt("movers-storage", "moving boxes", "a tidy new living room with boxes stacked neatly",
                  "a neat stack of intact moving boxes next to a moving truck",
                  {"hook_line": "ככה נראית הובלה בלי תכנון", "reveal_line": "המשאית שלנו לא מאבדת אף ארגז",
                   "cta_line": "שלחו וואטסאפ להצעת מחיר"}, "whatsapp",
                  notes="הקופסאות עפות בצחוק ונוחתות שלמות. לא מראים נזק לרכוש של לקוחות."),
            adapt("restaurants", "pizza boxes", "a warm pizzeria counter", "a fresh hot pizza with melted cheese",
                  {"hook_line": "הפיצה הגיעה. מהר מדי", "reveal_line": "ובקופסה? פיצה חמה",
                   "cta_line": "הזמינו בוואטסאפ"}, "whatsapp"),
            adapt("retail-stores", "paper-wrapped flower bouquets", "a bright flower shop counter",
                  "a fresh, colourful bouquet in kraft paper",
                  {"hook_line": "משלוח פרחים, גרסת האקשן", "reveal_line": "וזה מה שהגיע",
                   "cta_line": "שלחו וואטסאפ והזמינו זר"}, "whatsapp",
                  notes="לחנות פרחים: הזרים עפים ונוחתים שלמים."),
        ],
        "music_brief": music("energetic", 120, 140, 3500, "drop", [("reveal", "impact")]),
        "required_overlays": ["meme_caption"],
        "shot_list": None,
        "compliance_notes_he": [
            "סכנה שנראית אמיתית ונוצרה ב-AI מקבלת את התווית \"נוצר באמצעות AI\", גם בפרסום רגיל וגם במודעה.",
            "אף אדם לא נפגע בסרטון, וגם לא נראה כאילו נפגע.",
            "המוצר בסוף הוא המוצר האמיתי של העסק, בלי שיפורים שאין בו.",
        ],
        "do_not_copy": [
            "the reference caption 'The truck almost got me smh' and its Hebrew translation 'המשאית כמעט תפסה אותי'",
            "the highway footbridge shot and the truck hitting the bridge",
            "the hoodie, its printed slogan and the brand handle of the reference",
            "the follow card and the explainer segment of the reference",
            "the reference audio",
        ],
        "platform_tone": {"reels": "מהיר ומוגזם, כמו מם", "facebook": "כדאי שהמוצר יופיע כבר בתמונה המקדימה"},
        "default_duration_sec": 15, "default_goal": "sales", "default_video_type": "reel_hook",
        "default_visual_style": "cinematic", "default_music_mood": "energetic", "default_caption_preset": "bold-pop",
        "vo_mode": "none", "recommended_ad_goal": "website_traffic",
        "niches": ["ecommerce", "movers-storage", "restaurants", "retail-stores"],
        "first_seen_at": "2026-10-17", "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד כמעט נפגעתי: חשיפת מוצר מתוך קופסה",
        "seo_description_he": "קופסאות עפות אל המצלמה, חיתוך, והמוצר שלכם יוצא מהקופסה. ככה עושים את הטרנד ב-AI, עם תווית מתאימה ומוזיקה שמותרת לפרסום.",
        "is_featured": False, "sort_order": 30,
    }


def t4_fake_popup():
    return {
        "slug": "fake-system-popup",
        "name_he": "התראה מזויפת",
        "tagline_he": "התראה מצחיקה קופצת מעל האוכל, והעיניים נשארות על המנה",
        "description_he": "צילום מנקודת המבט של מי שיושב לשולחן: המנה מגיעה, ובדיוק אז קופצת על המסך התראה שנראית כמו הודעת מערכת. הצופים מנסים לסגור אותה ונשארים להסתכל על האוכל. ההתראה נבנית אצלנו בעברית, בלי לוגו ובלי עיצוב של מערכת מסוימת. מתאים רק לפרסום רגיל.",
        "why_it_works_he": "התראה בזמן הלא נכון היא רפלקס: עוצרים, מנסים ללחוץ וצופים שוב. בכל הזמן הזה המנה נמצאת במרכז המסך.",
        "hook_type_slug": "pattern-interrupt",
        "lifecycle": "format",
        "production_mode": "hybrid",
        "ad_safety": "organic_only",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("bait", "bait", 3500, "המנה מוגשת, ומעליה קופצת התראה", "ai_clip",
                  "First-person POV at a wooden table in {setting_en}, the viewer's hand resting on the table, a server places {product_en} right in front of the camera, warm appetizing light",
                  "the plate slides into frame and settles, steam rising, the hand stays still",
                  onscreen=slot("hook_line", 70, "סוללה חלשה\nכדאי לחבר למטען"), overlay=ov_fake_ui("low_battery", 350, 3300),
                  shot="pov_table"),
            cut("cut1", sfx="click"),
            scene("closeup", "reveal", 6000, "תקריב של המנה, בלי שום הפרעה", "ai_clip",
                  "Extreme close-up of {product_en}, steam rising, rich textures, warm light",
                  "slow push in across the food", camera="push_in", sfx="click",
                  onscreen=slot("payoff_line", 30, "ניסיתם לסגור, נכון?"), shot="food_closeup"),
            scene("cta", "cta", 5500, "המקום עצמו, עם הזמנה", "ai_image_kenburns",
                  "{setting_en} seen from the entrance, inviting evening light, tables set",
                  "slow push in through the entrance", camera="push_in",
                  onscreen=slot("cta_line", 30, "שמרו מקום בוואטסאפ"), shot="place_wide"),
        ]},
        "hook_variants": [
            variant("A", "a low-battery style alert pops up over the food the moment the plate lands",
                    "סוללה חלשה\nכדאי לחבר למטען", "התראה מוכרת בזמן הכי לא נוח, והאוכל ממש מאחוריה."),
            variant("B", "a new-message style alert from mom pops up while the camera tilts toward the plate",
                    "הודעה חדשה מאמא\nאכלתם כבר?", "הודעה שכולם מכירים, וחיוך עוד לפני שמבינים שזה חלק מהסרטון."),
            variant("C", "an order-arrived style alert pops up exactly as the server sets the tray down from above",
                    "ההזמנה הגיעה\nבתיאבון", "ההתראה מתארת בדיוק את מה שקורה בתמונה, וזה מה שמצחיק."),
        ],
        "niche_adaptations": [
            adapt("restaurants", "a server in a black apron", "a cozy restaurant with wooden tables",
                  "a plate of grilled skewers with a fresh salad",
                  {"hook_line": "סוללה חלשה\nכדאי לחבר למטען", "payoff_line": "ניסיתם לסגור, נכון?",
                   "cta_line": "שמרו מקום בוואטסאפ"}, "whatsapp",
                  notes="\"נשארו 2 מנות\" רק כשזה נכון באותו יום, עם אישור."),
            adapt("catering-chefs", "a private chef in a white jacket", "a home dining table set for guests",
                  "a plated tasting dish with sauce",
                  {"hook_line": "הודעה חדשה מאמא\nאכלתם כבר?", "payoff_line": "אל תדאגו, אכלנו",
                   "cta_line": "שלחו וואטסאפ לתפריט לאירוע"}, "whatsapp"),
            adapt("zimmers-boutique-hotels", "a host carrying a breakfast tray", "a sunny cabin deck with a mountain view",
                  "a rich Israeli breakfast tray with shakshuka",
                  {"hook_line": "ההזמנה הגיעה\nבתיאבון", "payoff_line": "ככה מתחיל בוקר אצלנו",
                   "cta_line": "בדקו תאריכים בוואטסאפ"}, "whatsapp"),
        ],
        "music_brief": music("funny", 90, 110, None, "loop", [("closeup", "click")]),
        "required_overlays": ["fake_ui"],
        "shot_list": {"version": 1, "intro_he": "אפשר להפיק הכול ב-AI, או לצלם שלושה שוטים קצרים בטלפון. את ההתראה בונים אצלנו בכל מקרה.",
                      "estimated_minutes": 6, "shots": [
            shot("pov_table", "המנה מגיעה לשולחן",
                 "שימו את הטלפון לאורך בגובה העיניים של מי שיושב, יד אחת על השולחן, וצלמו את רגע ההגשה.",
                 "pov", 4, 12, "hands_table", ["מקום ריק במרכז המסגרת: שם תופיע ההתראה",
                                               "בקשו מהמלצר אישור לפני שמצלמים"], True),
            shot("food_closeup", "תקריב של המנה", "מתקרבים לאט למנה, מלמעלה או מהצד. אדים או רוטב שנוזל הם בונוס.",
                 "closeup", 4, 10, "product_center", ["אור מהחלון, בלי פלאש", "מנגבים את שולי הצלחת לפני הצילום"], False),
            shot("place_wide", "המקום", "צלמו את המקום מהכניסה, בתנועה איטית פנימה.", "wide", 3, 10, "tripod_wide",
                 ["בשעה שיש אורחים, אבל בלי פנים מזוהות"], False),
        ]},
        "compliance_notes_he": [
            "הפורמט הזה מתאים רק לפרסום רגיל. מטא לא מאשרת מודעות שמחקות הודעות מערכת או כפתורים מזויפים.",
            "ההתראה כללית: בלי לוגו, בלי אייקונים ובלי עיצוב של מערכת הפעלה מסוימת.",
            "\"נשארו 2 מנות\" או כל הגבלה אחרת מופיעים רק כשהם נכונים באותו רגע.",
        ],
        "do_not_copy": [
            "the iPhone-style 'Low Battery' dialog layout, system fonts, icons and the 'Low Power Mode' option",
            "the reference fried-chicken and fries tray composition",
            "the reference restaurant name, logo and staff",
            "the creator explainer and the view counts quoted in it",
            "the reference audio",
        ],
        "platform_tone": {"reels": "מצחיק ושקט: ההתראה עושה את הרעש", "facebook": "פוסט רגיל בלבד, בלי קידום כמודעה"},
        "default_duration_sec": 15, "default_goal": "engagement", "default_video_type": "reel_hook",
        "default_visual_style": "ugc", "default_music_mood": "funny", "default_caption_preset": "bold-pop",
        "vo_mode": "none", "recommended_ad_goal": None,
        "niches": ["restaurants", "catering-chefs", "zimmers-boutique-hotels"],
        "first_seen_at": "2026-10-17", "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד ההתראה המזויפת: רילס למסעדות ולאוכל",
        "seo_description_he": "התראה מצחיקה קופצת מעל המנה, והצופים נשארים להסתכל על האוכל. ככה עושים את הטרנד לפרסום רגיל, בלי לוגו ובלי עיצוב של מערכת.",
        "is_featured": False, "sort_order": 40,
    }


def t5_pov():
    return {
        "slug": "pov-deadpan",
        "name_he": "POV",
        "tagline_he": "משפט אחד שכל לקוח מכיר, ותפנית בסוף",
        "description_he": "שורת POV למעלה, סיטואציה שכל לקוח בתחום מזהה, ותפנית שמראה איך זה נראה אצלכם. הומור דוגרי, בלי להעליב אף אחד. אפשר להפיק ב-AI או לצלם שני שוטים בטלפון.",
        "why_it_works_he": "שורת POV מכניסה את הצופה לנעליים של הלקוח בשנייה אחת. ההזדהות מחזיקה אותו, והתפנית מראה במה אתם שונים.",
        "hook_type_slug": "pov",
        "lifecycle": "evergreen",
        "production_mode": "hybrid",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            label("pov", "שורת POV קבועה מעל הסיטואציה", ov_pov(), ["situation", "reaction"]),
            scene("situation", "bait", 3500, "הסיטואציה המוכרת: מבט יבש למצלמה", "ai_clip",
                  "Medium shot of {subject_en} in {setting_en}, looking straight at the camera with a tired, deadpan expression, an everyday moment, natural light",
                  "a slow silent stare, then a small sigh",
                  onscreen=slot("hook_line", 40, "הבטיחו לכם שזה ייקח רק שבוע"), vo=vo("situation_vo", 3.5),
                  shot="situation_shot"),
            scene("reaction", "payoff", 4000, "המבט נמשך, והשתיקה אומרת הכול", "ai_image_kenburns",
                  "Close-up of {subject_en} in {setting_en}, raising one eyebrow at the camera, deadpan, natural light",
                  "slow push in on the face", camera="push_in", vo=vo("reaction_vo", 4), shot="situation_shot"),
            scene("twist", "reveal", 4000, "התפנית: ככה זה אצלכם", "ai_clip",
                  "{subject_en} in {setting_en} confidently presenting {product_en}, a small satisfied smile, bright clean light",
                  "a quick confident turn toward the camera and a nod", camera="push_in", sfx="pop",
                  onscreen=slot("twist_line", 40, "אצלנו לוח זמנים כתוב, ומעדכנים כל יום"), vo=vo("twist_vo", 4),
                  shot="twist_shot"),
            scene("cta", "cta", 3500, "הזמנה קצרה", "ai_image_kenburns",
                  "{product_en} in {setting_en}, tidy and inviting, soft light", "slow push in", camera="push_in",
                  onscreen=slot("cta_line", 30, "שלחו וואטסאפ לתיאום"), vo=vo("cta_vo", 3.5)),
        ]},
        "hook_variants": [
            variant("A", "{subject_en} staring silently at the camera, then slowly glancing at a wall calendar",
                    "הבטיחו לכם שזה ייקח רק שבוע", "כל לקוח שמע את המשפט הזה, והמבט היבש אומר את השאר."),
            variant("B", "a close-up of a person listening on the phone, eyes rolling, then a slow turn to the camera",
                    "שאלתם כמה זה עולה וקיבלתם \"תלוי\"", "תשובה מתחמקת שכולם מכירים, והצופה מחכה לראות מי עונה אחרת."),
            variant("C", "a wide shot of an empty waiting area in {setting_en}, one person checking the time again and again",
                    "הגעתם בזמן, ואף אחד לא מחכה לכם", "תסכול קטן ומוכר, שהתפנית פותרת."),
        ],
        "niche_adaptations": [
            adapt("renovation-contractors", "a renovation contractor in work clothes, around 45", "a half-finished bathroom renovation",
                  "a finished modern bathroom",
                  {"hook_line": "הקבלן אמר שזה ייגמר עד החג", "twist_line": "אצלנו לוח זמנים כתוב, ומעדכנים כל יום",
                   "cta_line": "שלחו וואטסאפ לתיאום מדידה"}, "whatsapp",
                  vo_example="ואז מגיעים אלינו, ומקבלים לוח זמנים בכתב.",
                  notes="לוח הזמנים והעדכונים צריכים להיות אמיתיים."),
            adapt("dentists", "a dentist in a white coat, around 40", "a bright dental clinic reception",
                  "a calm, tidy treatment room",
                  {"hook_line": "אמרו לכם שזה \"רק משהו קטן\"", "twist_line": "אצלנו מסבירים כל שלב לפני שמתחילים",
                   "cta_line": "קבעו תור לבדיקה"}, "booking",
                  vo_example="אצלנו מסבירים מה עושים ולמה, לפני שמתחילים.",
                  notes="בלי הבטחה לתוצאה ובלי \"בלי כאב\"."),
            adapt("restaurants", "a waiter in a black apron, around 30", "a busy neighbourhood café",
                  "a full table of shared dishes",
                  {"hook_line": "אמרתם \"רק קפה\" ונשארתם לארוחה", "twist_line": "זה קורה פה הרבה. ובצדק.",
                   "cta_line": "שמרו מקום בוואטסאפ"}, "whatsapp",
                  vo_example="זה קורה פה כל יום, ואנחנו לא מתלוננים."),
        ],
        "music_brief": music("funny", 85, 105, 7500, "drop", [("twist", "pop")]),
        "required_overlays": ["pov_label"],
        "shot_list": {"version": 1, "intro_he": "אפשר הכול ב-AI. מי שרוצה להופיע בעצמו מצלם שני שוטים קצרים, בערך חמש דקות.",
                      "estimated_minutes": 5, "shots": [
            shot("situation_shot", "המבט היבש",
                 "עמדו מול המצלמה במקום העבודה, הסתכלו ישר לעדשה בלי לחייך, וספרו בלב עד חמש.",
                 "medium", 4, 12, "face_center", ["הטלפון בגובה העיניים, על משטח יציב", "בלי לדבר: הטקסט יופיע למעלה"], True),
            shot("twist_shot", "התפנית",
                 "הראו את מה שעושים אחרת: לוח הזמנים, החדר המוכן, המנה. תנועה אחת בטוחה לעבר המצלמה.",
                 "medium", 4, 10, "product_center", ["חיוך קטן מספיק", "מה שמראים חייב להיות אמיתי"], True),
        ]},
        "compliance_notes_he": [
            "ההומור על הסיטואציה בתחום, אף פעם לא על לקוחות או על מתחרים בשמם.",
            "מה שמוצג בתפנית חייב להיות נכון: לוח זמנים, מחיר או שירות שקיימים באמת.",
            "דמות AI לא מדברת למצלמה. קריינות מגיעה מקריין, וכשרוצים דיבור מול המצלמה מצלמים את בעלי העסק.",
        ],
        "do_not_copy": [
            "names, faces, voices or handles of creators who made POV skits popular",
            "copyrighted trending sounds used in POV videos",
            "any competitor's name, logo or premises",
        ],
        "platform_tone": {"reels": "יבש וקצר, הפאנץ׳ בתפנית", "facebook": "אפשר להוסיף שורה אחת על השירות מעל הסרטון"},
        "default_duration_sec": 15, "default_goal": "engagement", "default_video_type": "reel_hook",
        "default_visual_style": "ugc", "default_music_mood": "funny", "default_caption_preset": "bold-pop",
        "vo_mode": "optional", "recommended_ad_goal": "whatsapp_messages",
        "niches": ["renovation-contractors", "dentists", "restaurants", "home-services", "auto-services", "accountants", "lawyers"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד POV לעסקים: ככה עושים רילס דוגרי",
        "seo_description_he": "שורת POV, סיטואציה שכל לקוח מכיר ותפנית שמראה איך זה אצלכם. ככה עושים את הפורמט לעסק, ב-AI או בצילום של שני שוטים.",
        "is_featured": False, "sort_order": 50,
    }


def t6_before_after():
    return {
        "slug": "before-after-snap",
        "name_he": "לפני ואחרי",
        "tagline_he": "רגע של לפני, חיתוך על הקצב, והתוצאה האמיתית",
        "description_he": "שתי שניות מהירות של המצב לפני, חיתוך חד על הקצב, והתוצאה. בסוף מסך מפוצל שמראה את שני המצבים זה לצד זה. מצלמים רק עבודה אמיתית של העסק, לפי רשימת צילומים, ואנחנו עורכים.",
        "why_it_works_he": "מהפך ויזואלי מבטיח תמורה כבר בשנייה הראשונה. החיתוך על הקצב מספק, והמסך המפוצל משאיר את ההוכחה מול העיניים.",
        "hook_type_slug": "before-after",
        "lifecycle": "evergreen",
        "production_mode": "guided",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": True,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("before", "bait", 2000, "המצב לפני, מהר", "user_media", speed=1.5,
                  onscreen=slot("hook_line", 36, "ככה זה הגיע אלינו"), shot="before_shot"),
            cut("cut1", sfx="whoosh", purpose="חיתוך חד על הקצב, כמו כף יד שמכסה את העדשה"),
            scene("after", "reveal", 5000, "התוצאה, מאותה זווית", "user_media", sfx="whoosh", shot="after_shot"),
            scene("split", "payoff", 4500, "לפני ואחרי זה לצד זה", "user_media",
                  onscreen=slot("result_line", 36, "{זמן} עבודה, בלי קיצורי דרך"), overlay=ov_split("before"),
                  shot="after_shot"),
            scene("cta", "cta", 3500, "איך מזמינים", "brand_card", onscreen=slot("cta_line", 30, "שלחו תמונה וקבלו הצעת מחיר")),
        ]},
        "hook_variants": [
            variant("A", "open on an extreme close-up of the worst detail of the before state",
                    "ככה זה הגיע אלינו", "הפרט הכי גרוע בשנייה הראשונה, והצופה כבר רוצה לראות את התיקון."),
            variant("B", "open on a wide before shot as a hand covers the lens for the transition",
                    "רגע לפני שנגענו בזה", "היד שמכסה את העדשה מבטיחה שינוי, והצופה מחכה לראות מה מתחת."),
            variant("C", "open on half a second of the finished result, then jump back to the before state",
                    "ניחשתם איך זה נראה קודם?", "קודם התוצאה, ואז שאלה שמחזירה אחורה: שני הוקים בשנייה אחת."),
        ],
        "niche_adaptations": [
            adapt("barbers-salons", "a client in the barber chair, seen from behind", "a modern barbershop",
                  "a fresh skin fade haircut",
                  {"hook_line": "ככה הוא נכנס אלינו", "result_line": "{זמן} בכיסא. זה ההבדל", "cta_line": "קבעו תור אונליין"},
                  "booking", notes="הלקוח שמופיע צריך לאשר בכתב."),
            adapt("home-services", "an air conditioner indoor unit with a dusty filter", "a living room wall",
                  "the same unit with a clean filter",
                  {"hook_line": "ככה נראה מזגן שלא נוקה הרבה זמן", "result_line": "ניקוי יסודי, בלי בלגן בבית",
                   "cta_line": "התקשרו ונתאם ביקור"}, "call"),
            adapt("auto-services", "a dirty car interior with crumbs and stains", "a detailing bay", "the same interior, spotless",
                  {"hook_line": "ככה האוטו הגיע אלינו", "result_line": "דיטיילינג פנים מלא",
                   "cta_line": "שלחו וואטסאפ וקבעו תור"}, "whatsapp"),
            adapt("renovation-contractors", "an old, worn bathroom", "a small apartment bathroom", "the same bathroom after renovation",
                  {"hook_line": "האמבטיה הזאת חיכתה לנו הרבה זמן", "result_line": "{זמן} עבודה, מהפירוק ועד הסיליקון",
                   "cta_line": "שלחו תמונה וקבלו הצעת מחיר"}, "whatsapp"),
            adapt("vets-dog-grooming", "a fluffy, matted dog on a grooming table", "a bright grooming salon",
                  "the same dog after a neat grooming",
                  {"hook_line": "ככה הוא הגיע לטיפוח", "result_line": "רחצה, סירוק ותספורת. והוא מרוצה",
                   "cta_line": "קבעו תור לטיפוח"}, "booking"),
        ],
        "music_brief": music("energetic", 115, 135, 2000, "drop", [("after", "whoosh")]),
        "required_overlays": ["split_reveal"],
        "shot_list": {"version": 1, "intro_he": "שני שוטים מאותה זווית: לפני שמתחילים ואחרי שמסיימים. כדאי לסמן על הרצפה איפה עמד הטלפון.",
                      "estimated_minutes": 5, "shots": [
            shot("before_shot", "לפני",
                 "צלמו את המצב לפני שמתחילים, לאורך, מאותה זווית שבה תצלמו בסוף. שלוש שניות מספיקות.",
                 "medium", 3, 10, "product_center", ["מסמנים בנייר דבק איפה עמדתם", "אותה תאורה גם בצילום של אחרי"], False),
            shot("after_shot", "אחרי", "בדיוק מאותה זווית ובאותו אור, צלמו את התוצאה. תנו לה חמש שניות לפחות.",
                 "medium", 5, 15, "product_center", ["לא מזיזים את הטלפון בין שני הצילומים",
                                                     "בלי פילטרים: התוצאה צריכה להיות אמיתית"], False),
        ]},
        "compliance_notes_he": [
            "רק תוצאות אמיתיות של העסק. אסור לייצר ב-AI את התוצאה.",
            "לקוח שמופיע בצילום צריך לתת הסכמה בכתב.",
            "בקליניקות אסתטיקה ובמרפאות הפורמט לא זמין, בגלל הכללים על לפני ואחרי ברפואה.",
            "משך עבודה או מחיר שמופיעים בסרטון צריכים להיות נכונים.",
        ],
        "do_not_copy": [
            "names, faces or handles of creators known for before-and-after transitions",
            "copyrighted trending sounds used for the transition beat",
            "before or after images that are not the business's own work",
        ],
        "platform_tone": {"reels": "קצב מהיר, החיתוך בדיוק על הביט", "facebook": "כדאי לכתוב במשפט אחד מה נעשה"},
        "default_duration_sec": 15, "default_goal": "trust", "default_video_type": "reel_hook",
        "default_visual_style": "before_after", "default_music_mood": "energetic", "default_caption_preset": "bold-pop",
        "vo_mode": "none", "recommended_ad_goal": "whatsapp_messages",
        "niches": ["barbers-salons", "home-services", "auto-services", "renovation-contractors", "vets-dog-grooming", "beauty-nails"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד לפני ואחרי: חיתוך על הקצב לרילס של עסק",
        "seo_description_he": "רגע של לפני, חיתוך על הקצב והתוצאה האמיתית. ככה מצלמים את הטרנד בשני שוטים, ואנחנו עורכים עם מסך מפוצל ומוזיקה מותרת.",
        "is_featured": False, "sort_order": 60,
    }


def t7_day_in_life():
    clocks = [("open", "bait", 2500, "פתיחת היום: מפתח בדלת, אור ראשון", "07:00", "open"),
              ("prep", "reveal", 2500, "ההכנות", "08:30", "prep"),
              ("first_customer", "reveal", 3000, "הלקוח הראשון", "10:00", "first_customer"),
              ("craft", "reveal", 3000, "העבודה עצמה, מקרוב", "12:30", "craft"),
              ("busy", "reveal", 3000, "השעה הכי עמוסה", "14:00", "busy"),
              ("closing", "reveal", 3000, "סוגרים את היום", "19:00", "closing")]
    examples = {"open": ("hook_line", 36, "יום שלם אצלנו, ב-30 שניות"), "prep": ("prep_line", 30, "מכינים הכול"),
                "first_customer": ("first_customer_line", 30, "הלקוח הראשון"),
                "craft": ("craft_line", 30, "החלק שהכי אוהבים"), "busy": ("busy_line", 30, "השעה הכי עמוסה"),
                "closing": ("closing_line", 30, "סוגרים את היום")}
    beats = []
    for key, role, ms, purpose, time, shot_key in clocks:
        s_key, s_max, s_ex = examples[key]
        beats.append(scene(key, role, ms, purpose, "user_media", camera="handheld" if key != "open" else "static",
                           onscreen=slot(s_key, s_max, s_ex), vo=vo(f"{key}_vo", ms / 1000), overlay=ov_clock(time),
                           shot=shot_key))
    beats.append(scene("reflection", "payoff", 7000, "משפט אחד שלכם על למה אתם עושים את זה", "user_media",
                       onscreen=slot("reflection_line", 40, "בשביל הרגע הזה אנחנו פה"), vo=vo("reflection_vo", 7),
                       shot="owner_reflection"))
    beats.append(scene("cta", "cta", 6000, "הזמנה להכיר", "brand_card", onscreen=slot("cta_line", 30, "בואו להכיר אותנו"),
                       vo=vo("cta_vo", 6)))

    def ex(hook, prep, first, craft, busy, closing, reflection, cta):
        return {"hook_line": hook, "prep_line": prep, "first_customer_line": first, "craft_line": craft,
                "busy_line": busy, "closing_line": closing, "reflection_line": reflection, "cta_line": cta}

    return {
        "slug": "day-in-the-life",
        "name_he": "יום בחיים של…",
        "tagline_he": "יום שלם בעסק, בשישה רגעים קצרים עם שעון",
        "description_he": "שישה שוטים קצרים לאורך היום, כל אחד עם השעה על המסך: פתיחה, הכנות, הלקוח הראשון, העבודה עצמה, השעה העמוסה והסגירה. בסוף משפט אחד שלכם. אנשים אוהבים לראות איך עסק נראה באמת.",
        "why_it_works_he": "תוכן אמיתי ולא מלוטש בונה אמון, והשעון יוצר קצב שקל לעקוב אחריו. צופים נשארים כדי לראות איך היום נגמר.",
        "hook_type_slug": "day-in-life",
        "lifecycle": "evergreen",
        "production_mode": "guided",
        "ad_safety": "needs_consent",
        "extra_gates": [],
        "requires_real_footage": True,
        "requires_people_consent": True,
        "recipe": {"version": 1, "beats": beats},
        "hook_variants": [
            variant("A", "open on keys turning in the front door at first light", "יום שלם אצלנו, ב-30 שניות",
                    "פתיחה של יום מבטיחה סיפור קצר, עם התחלה וסוף."),
            variant("B", "open on the busiest moment of the day, then jump back to the morning",
                    "ככה נראית השעה הכי עמוסה אצלנו", "מתחילים בשיא, ואז חוזרים אחורה כדי לראות איך הגענו לשם."),
            variant("C", "open on the owner's tired smile at closing time, then jump back to the morning",
                    "מה קורה פה מהבוקר עד הסגירה?", "סוף היום בהתחלה יוצר סקרנות לגבי כל מה שקרה באמצע."),
        ],
        "niche_adaptations": [
            adapt("restaurants", "the cook and the floor team", "a neighbourhood bistro kitchen and dining room",
                  "the first plates going out of the kitchen",
                  ex("יום שלם במטבח שלנו, ב-30 שניות", "ירקות, רטבים, אש", "ההזמנה הראשונה", "המנה שהכי כיף להכין",
                     "שעת הצהריים", "מנקים ונועלים", "בשביל הצלחות שחוזרות ריקות", "בואו לאכול אצלנו"), "whatsapp",
                  vo_example="אנחנו כאן מהבוקר, כדי שבצהריים הכול יהיה מוכן."),
            adapt("fitness-trainers", "a personal trainer and clients", "a small training studio", "a client finishing a set",
                  ex("יום שלם בסטודיו, ב-30 שניות", "מסדרים את הציוד", "אימון הבוקר הראשון",
                     "התרגיל שכולם אוהבים לשנוא", "שעת השיא", "מכבים את האורות", "בשביל ההתקדמות של כל מתאמן",
                     "שלחו הודעה ונתאם אימון"), "whatsapp",
                  vo_example="כל יום מתחיל מוקדם, ונגמר כשהמתאמן האחרון יוצא."),
            adapt("beauty-nails", "a nail technician", "a calm nail studio", "a finished manicure in close-up",
                  ex("יום שלם בסטודיו, ב-30 שניות", "מסדרים צבעים", "התור הראשון", "הפרט הקטן שעושה את ההבדל",
                     "תור אחרי תור", "מנקים את השולחן", "בשביל החיוך בסוף כל תור", "קבעו תור אונליין"), "booking",
                  vo_example="כל יום פה מתחיל בסידור צבעים, ונגמר בידיים מטופחות."),
            adapt("event-venues", "the venue staff", "an event hall being set up", "the hall ready with tables and lights",
                  ex("יום אירוע אצלנו, ב-30 שניות", "פורשים מפות", "הספקים מגיעים", "התאורה נדלקת", "האורחים בפנים",
                     "מקפלים כיסאות", "בשביל הרגע שהזוג נכנס", "שלחו וואטסאפ לתאריך פנוי"), "whatsapp",
                  vo_example="מאחורי כל אירוע יש יום שלם של הכנות."),
        ],
        "music_brief": music("warm", 90, 110, None, "build", []),
        "required_overlays": ["clock"],
        "shot_list": {"version": 1, "intro_he": "שבעה שוטים קצרים לאורך יום אחד. כל שוט לוקח כמה שניות, ובסוף משפט אחד שלכם למצלמה.",
                      "estimated_minutes": 12, "shots": [
            shot("open", "פתיחת היום", "צלמו את רגע הפתיחה: מפתח בדלת, תריס שעולה או האור הראשון שנדלק.", "medium", 3, 8,
                 "tripod_wide", ["לאורך, ביד יציבה", "אם יש שלט לעסק, כדאי שייראה"], False),
            shot("prep", "ההכנות", "רגע של הכנה: סידור, ניקוי, חומרים על השולחן.", "closeup", 3, 8, "hands_table",
                 ["מקרוב, על הידיים והחומרים"], False),
            shot("first_customer", "הלקוח הראשון",
                 "הרגע שהלקוח הראשון מגיע או שההזמנה הראשונה יוצאת. בלי לצלם פנים בלי אישור.", "medium", 3, 8,
                 "tripod_wide", ["אפשר לצלם מאחור או רק ידיים", "בקשו אישור מכל מי שמופיע"], True),
            shot("craft", "העבודה עצמה", "תקריב של החלק שאתם הכי אוהבים בעבודה.", "closeup", 3, 8, "hands_table",
                 ["אור טוב על הידיים", "תנועה אחת ברורה"], False),
            shot("busy", "השעה העמוסה", "צילום רחב בשעה הכי עמוסה של היום.", "wide", 3, 10, "tripod_wide",
                 ["הטלפון על משטח, לא ביד", "בקשו אישור מכל מי שמופיע"], True),
            shot("closing", "סוגרים", "סוף היום: מכבים אור, מנקים, נועלים.", "medium", 3, 8, "tripod_wide",
                 ["אותה זווית כמו בפתיחה, אם אפשר"], False),
            shot("owner_reflection", "משפט אחד שלכם",
                 "עמדו מול המצלמה ותגידו משפט אחד על למה אתם עושים את זה. אפשר כמה ניסיונות, אנחנו נבחר את הטוב.",
                 "medium", 5, 20, "face_center", ["הטלפון בגובה העיניים", "מדברים לאט, כמו לחבר"], True),
        ]},
        "compliance_notes_he": [
            "כל מי שמופיע בצילום צריך לתת הסכמה בכתב, גם עובדים וגם לקוחות.",
            "בלי ילדים בצילום.",
            "הכול אמיתי: השעות, המקום והאנשים של העסק.",
        ],
        "do_not_copy": [
            "names, faces or handles of creators known for day-in-the-life vlogs",
            "copyrighted trending sounds used in vlog edits",
            "time stamps or routines copied from a specific creator's video",
        ],
        "platform_tone": {"reels": "אמיתי וחם, קצב קבוע", "facebook": "מתאים גם לגרסה ארוכה יותר"},
        "default_duration_sec": 30, "default_goal": "trust", "default_video_type": "brand_promo",
        "default_visual_style": "day_in_business", "default_music_mood": "warm", "default_caption_preset": "soft",
        "vo_mode": "optional", "recommended_ad_goal": "local_awareness",
        "niches": ["restaurants", "fitness-trainers", "beauty-nails", "event-venues", "barbers-salons", "catering-chefs",
                   "vets-dog-grooming"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד יום בחיים של עסק: רילס עם שעון",
        "seo_description_he": "שישה רגעים קצרים לאורך היום, כל אחד עם השעה על המסך, ומשפט אחד שלכם בסוף. ככה מצלמים את הטרנד, ואנחנו עורכים.",
        "is_featured": False, "sort_order": 70,
    }


def t8_asmr():
    return {
        "slug": "asmr-process",
        "name_he": "תהליך מספק",
        "tagline_he": "מחומר גלם למוצר מוגמר, בלי מילה אחת",
        "description_he": "תקריבים של התהליך, מחומר הגלם ועד התוצאה, בלי דיבור. הצליל עושה את העבודה: אנחנו מוסיפים אפקטים עדינים ומוזיקה רגועה. עובד מצוין גם בלי סאונד.",
        "why_it_works_he": "תהליך שמתקדם מול העיניים מספק ומרגיע, וצופים נשארים עד שהוא נגמר. בלי דיבור הסרטון מובן לכולם, גם בשקט.",
        "hook_type_slug": "satisfying-visual",
        "lifecycle": "evergreen",
        "production_mode": "guided",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": True,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("raw", "bait", 3000, "חומר הגלם בתקריב, בשקט", "user_media",
                  onscreen=slot("hook_line", 24, "תעלו את הסאונד"), shot="raw_material"),
            scene("process1", "reveal", 3000, "התהליך: התנועה הראשונה", "user_media", speed=1.5, shot="process_close_1"),
            scene("process2", "reveal", 3000, "התהליך: הרגע הכי מספק", "user_media", speed=1.25, shot="process_close_2"),
            scene("finished", "payoff", 3000, "התוצאה המוגמרת", "user_media",
                  onscreen=slot("finished_line", 24, "וזה מוכן"), shot="finished_result"),
            scene("cta", "cta", 3000, "איך מזמינים", "brand_card", onscreen=slot("cta_line", 30, "שלחו וואטסאפ והזמינו")),
        ]},
        "hook_variants": [
            variant("A", "open on the raw material in an extreme, perfectly still close-up", "תעלו את הסאונד",
                    "שקט מוחלט ותקריב חד מבקשים מהצופה לעצור."),
            variant("B", "open in the middle of the process, on the single most satisfying motion", "עוד שנייה זה מושלם",
                    "נכנסים באמצע התנועה, והצופה רוצה לראות אותה נגמרת."),
            variant("C", "open on half a second of the finished result, then cut back to the raw material", "מאיפה זה התחיל?",
                    "התוצאה קודם, והתהליך עונה על השאלה."),
        ],
        "niche_adaptations": [
            adapt("catering-chefs", "a chef's hands", "a clean professional kitchen counter", "a beautifully plated dish",
                  {"hook_line": "תעלו את הסאונד", "finished_line": "וזה מוכן לאירוע", "cta_line": "שלחו וואטסאפ לתפריט"},
                  "whatsapp"),
            adapt("beauty-nails", "a nail technician's hands", "a calm nail station with soft light", "a glossy finished manicure",
                  {"hook_line": "רגע של שקט", "finished_line": "וזה מוכן", "cta_line": "קבעו תור אונליין"}, "booking"),
            adapt("auto-services", "a detailer's gloved hands", "a detailing bay", "a mirror-shine car hood",
                  {"hook_line": "תעלו את הסאונד", "finished_line": "וככה הוא יוצא", "cta_line": "שלחו וואטסאפ וקבעו תור"},
                  "whatsapp"),
            adapt("retail-stores", "hands packing an order", "a tidy packing table in a small shop",
                  "a wrapped gift box with a ribbon",
                  {"hook_line": "אורזים לכם הזמנה", "finished_line": "מוכן למשלוח", "cta_line": "הזמינו בוואטסאפ"},
                  "whatsapp", notes="\"מוכן למשלוח\" רק כשיש לחנות משלוחים."),
        ],
        "music_brief": music("calm", 70, 90, None, "flat", []),
        "required_overlays": [],
        "shot_list": {"version": 1, "intro_he": "ארבעה תקריבים של תהליך אחד, מההתחלה ועד הסוף. בלי לדבר, רק ידיים וחומרים.",
                      "estimated_minutes": 8, "shots": [
            shot("raw_material", "חומר הגלם", "צלמו מקרוב את החומר לפני שמתחילים, בלי לזוז, חמש שניות.", "closeup", 3, 10,
                 "product_center", ["הטלפון על משטח יציב", "רקע נקי ופשוט"], False),
            shot("process_close_1", "התחלת התהליך", "התנועה הראשונה, מקרוב: חיתוך, מריחה או קיפול.", "closeup", 4, 15,
                 "hands_table", ["תנועות איטיות ורציפות", "אור מהצד מבליט מרקם"], False),
            shot("process_close_2", "הרגע המספק", "הרגע הכי מספק בתהליך, מקרוב, מתחילתו ועד סופו.", "closeup", 4, 15,
                 "hands_table", ["לא חותכים באמצע תנועה"], False),
            shot("finished_result", "התוצאה", "התוצאה הגמורה, מקרוב ואז קצת יותר רחוק.", "closeup", 3, 10, "product_center",
                 ["סיבוב קטן של המוצר מול המצלמה"], False),
        ]},
        "compliance_notes_he": [
            "התהליך והתוצאה של העסק עצמו, בלי עריכה שמשפרת את התוצאה.",
            "הסאונד שלנו הוא אפקטים ומוזיקה ברישיון. לא משתמשים בשיר מטרנד.",
        ],
        "do_not_copy": [
            "names, faces or handles of ASMR creators",
            "copyrighted ASMR or trending audio",
            "process footage that is not the business's own",
        ],
        "platform_tone": {"reels": "רגוע ומדויק, בלי טקסט מיותר", "facebook": "שורה אחת שמסבירה מה מכינים"},
        "default_duration_sec": 15, "default_goal": "awareness", "default_video_type": "reel_hook",
        "default_visual_style": "product", "default_music_mood": "calm", "default_caption_preset": "soft",
        "vo_mode": "none", "recommended_ad_goal": "local_awareness",
        "niches": ["catering-chefs", "beauty-nails", "auto-services", "retail-stores", "restaurants", "barbers-salons"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד ASMR לעסקים: תהליך מספק בלי מילים",
        "seo_description_he": "תקריבים של התהליך, מחומר הגלם ועד התוצאה, בלי דיבור. ככה מצלמים את הטרנד בארבעה שוטים, עם אפקטים ומוזיקה רגועה שמותרת לפרסום.",
        "is_featured": False, "sort_order": 80,
    }


def t9_myth():
    return {
        "slug": "myth-vs-fact",
        "name_he": "מיתוס מול עובדה",
        "tagline_he": "משפט שכולם מאמינים בו, חותמת \"לא נכון\" והסבר קצר",
        "description_he": "פותחים במיתוס נפוץ בתחום, חותמת \"לא נכון\" קופצת, ואז הסבר קצר וטיפ אחד שאפשר ליישם. הקריינות מסבירה, והחותמות עושות את הדרמה. מתאים לבעלי מקצוע שרוצים להראות ידע בלי להטיף.",
        "why_it_works_he": "מיתוס מוכר יוצר התנגדות מיידית, והחותמת נותנת סיפוק. הצופה יוצא עם משהו שימושי, ומקשר את הידע לעסק.",
        "hook_type_slug": "myth-busting",
        "lifecycle": "evergreen",
        "production_mode": "hybrid",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("myth", "bait", 3500, "המיתוס, כמו שכולם אומרים אותו", "ai_image_kenburns",
                  "Medium shot of {subject_en} in {setting_en}, one eyebrow raised in mild disbelief, looking at the camera, clean natural light",
                  "a subtle head tilt, otherwise still", onscreen=slot("hook_line", 40, "מיתוס: רואה חשבון צריך רק באפריל"),
                  vo=vo("myth_vo", 3.5), shot="talking_head"),
            cut("cut1", sfx="pop"),
            scene("verdict", "payoff", 6500, "חותמת \"לא נכון\", והעובדה במשפט אחד", "ai_image_kenburns",
                  "Close-up of {product_en} on a desk in {setting_en}, tidy and well lit", "slow push in", camera="push_in",
                  sfx="pop", onscreen=slot("fact_line", 40, "תכנון מס עושים לאורך כל השנה"), vo=vo("verdict_vo", 6.5),
                  overlay=ov_verdict("false", "לא נכון", 0, 2500), shot="explain_closeup"),
            scene("why", "reveal", 8000, "למה, בשני משפטים", "ai_clip",
                  "Hands of {subject_en} arranging {product_en} on a desk in {setting_en}, calm and organised",
                  "the hands move items into neat piles, slow and deliberate",
                  onscreen=slot("why_line", 40, "מי שמתכנן מוקדם, מופתע פחות"), vo=vo("why_vo", 8), shot="explain_closeup"),
            scene("tip", "reveal", 6000, "טיפ אחד שאפשר לעשות היום", "ai_image_kenburns",
                  "Top-down shot of {product_en} neatly organised on a desk in {setting_en}", "slow top-down push in",
                  camera="push_in", onscreen=slot("tip_line", 40, "שמרו קבלות כבר מינואר, בתיקייה אחת"),
                  vo=vo("tip_vo", 6), overlay=ov_verdict("true", "ככה עושים נכון", 200, 2200)),
            scene("cta", "cta", 6000, "הזמנה לשאול", "brand_card", onscreen=slot("cta_line", 30, "שלחו וואטסאפ עם השאלה שלכם"),
                  vo=vo("cta_vo", 6)),
        ]},
        "hook_variants": [
            variant("A", "a deadpan, slightly sceptical look straight at the camera", "מיתוס שכל לקוח שלנו שמע",
                    "מבט ספקני ושורת מיתוס מזמינים את הצופה לבדוק אם גם הוא האמין בזה."),
            variant("B", "a red cross stamp slamming onto a blank card in the first second", "את זה אומרים כולם. וזה לא נכון",
                    "החותמת בשנייה הראשונה מבטיחה תיקון, והצופה רוצה לדעת מה."),
            variant("C", "a raised index finger and a quick questioning gesture toward the camera", "גם אתם חשבתם ככה?",
                    "שאלה ישירה שמכניסה את הצופה לשיחה."),
        ],
        "niche_adaptations": [
            adapt("accountants", "an accountant in a smart casual shirt, around 45", "a tidy accounting office",
                  "a neat folder of receipts and a calculator",
                  {"hook_line": "מיתוס: רואה חשבון צריך רק באפריל", "fact_line": "תכנון מס עושים לאורך כל השנה",
                   "why_line": "מי שמתכנן מוקדם, מופתע פחות", "tip_line": "שמרו קבלות כבר מינואר, בתיקייה אחת",
                   "cta_line": "שלחו וואטסאפ עם השאלה שלכם"}, "whatsapp",
                  vo_example="מי שמגיע אלינו רק באפריל, כבר מאוחר לתכנן את השנה שעברה.",
                  notes="בלי הבטחה לחיסכון במס. מסבירים עיקרון, לא מבטיחים סכום."),
            adapt("dentists", "a dentist in a white coat", "a bright dental clinic",
                  "a dental mirror and a toothbrush on a clean tray",
                  {"hook_line": "מיתוס: אם לא כואב, אין מה לבדוק", "fact_line": "הרבה בעיות מתחילות בשקט",
                   "why_line": "בבדיקה רואים מה שעוד לא מרגישים", "tip_line": "קבעו בדיקה תקופתית, גם כשהכול בסדר",
                   "cta_line": "קבעו תור לבדיקה"}, "booking",
                  vo_example="הרבה בעיות בשיניים מתחילות בשקט, ולכן בדיקה תקופתית חשובה גם כשהכול נראה בסדר.",
                  notes="מידע כללי בלבד, בלי הבטחה לתוצאה. ההסתייגות הרפואית נוספת אוטומטית."),
            adapt("fitness-trainers", "a fitness trainer in a plain t-shirt", "a training studio",
                  "a pair of dumbbells and a training mat",
                  {"hook_line": "מיתוס: מספיק לעשות רק קרדיו", "fact_line": "אימוני כוח הם חלק חשוב מהתוכנית",
                   "why_line": "גוף חזק יותר עושה כל אימון קל יותר", "tip_line": "שלבו כוח וקרדיו באותו שבוע",
                   "cta_line": "שלחו הודעה ונבנה לכם תוכנית"}, "whatsapp",
                  vo_example="קרדיו זה טוב, אבל בלי אימוני כוח התוכנית לא שלמה.",
                  notes="בלי הבטחות לשינוי בגוף ובלי לפני ואחרי של גוף."),
            adapt("mortgage-advisors", "a mortgage advisor in a blazer, around 45", "a calm office with a large table",
                  "printed mortgage offers side by side on a table",
                  {"hook_line": "מיתוס: הבנק תמיד נותן את ההצעה הכי טובה", "fact_line": "את ההצעה אפשר לבדוק ולהשוות",
                   "why_line": "תמהיל אחר יכול לשנות את ההחזר החודשי", "tip_line": "לפני שחותמים, משווים כמה הצעות",
                   "cta_line": "השאירו פרטים לשיחת ייעוץ"}, "lead_form",
                  vo_example="ההצעה הראשונה מהבנק היא נקודת פתיחה, לא סוף פסוק.",
                  notes="בלי הבטחה לחיסכון או לריבית. ההסתייגות הפיננסית נוספת אוטומטית."),
        ],
        "music_brief": music("inspiring", 95, 115, None, "flat", [("verdict", "pop")]),
        "required_overlays": ["rating"],
        "shot_list": {"version": 1, "intro_he": "אפשר הכול ב-AI. מי שרוצה להופיע בעצמו מצלם שני שוטים: משפט למצלמה ותקריב של העבודה.",
                      "estimated_minutes": 5, "shots": [
            shot("talking_head", "המשפט למצלמה",
                 "עמדו מול המצלמה ואמרו את המיתוס בטון קצת ספקני, כאילו שמעתם אותו כבר מאה פעם.", "medium", 3, 10,
                 "face_center", ["הטלפון בגובה העיניים", "חיוך קטן בסוף המשפט"], True),
            shot("explain_closeup", "תקריב של העבודה", "תקריב של הידיים בעבודה: מסמכים, כלים או ציוד, לפי התחום.",
                 "closeup", 4, 15, "hands_table", ["בלי מסמכים עם פרטים אישיים בפריים"], False),
        ]},
        "compliance_notes_he": [
            "כל עובדה בסרטון צריכה להיות נכונה ומקובלת בתחום. בספק, מנסחים בזהירות.",
            "בלי הבטחה לתוצאה, לחיסכון או לריפוי.",
            "ברפואה, במשפט ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום.",
        ],
        "do_not_copy": [
            "names, faces or handles of creators known for myth-busting videos",
            "myths and wording copied from a specific creator's video",
            "copyrighted trending sounds",
        ],
        "platform_tone": {"reels": "ענייני וקליל, מהר לעניין", "facebook": "מתאים לטקסט ארוך יותר מתחת לסרטון"},
        "default_duration_sec": 30, "default_goal": "trust", "default_video_type": "explainer",
        "default_visual_style": "ugc", "default_music_mood": "inspiring", "default_caption_preset": "clean-box",
        "vo_mode": "required", "recommended_ad_goal": "lead_form",
        "niches": ["accountants", "dentists", "fitness-trainers", "mortgage-advisors", "lawyers", "insurance-agents",
                   "physio-nutrition"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד מיתוס מול עובדה: רילס לבעלי מקצוע",
        "seo_description_he": "מיתוס נפוץ בתחום, חותמת לא נכון, הסבר קצר וטיפ אחד. ככה עושים את הפורמט לעסק, ב-AI או בצילום, עם קריינות בעברית.",
        "is_featured": False, "sort_order": 90,
    }


def t10_reply():
    return {
        "slug": "reply-to-comment",
        "name_he": "עונים לתגובה",
        "tagline_he": "שאלה של לקוח על המסך, ותשובה קצרה וברורה",
        "description_he": "כרטיס תגובה עם שאלה שלקוחות שואלים באמת, ואחריו תשובה קצרה: מה נכון, דוגמה וטיפ. מתאים לשאלות על מחיר, על זמן ועל התנגדויות. משתמשים בשאלה אמיתית באישור, או בשאלה כללית בלי שם.",
        "why_it_works_he": "שאלה שהצופה כבר חשב עליה מושכת אותו פנימה, והתשובה בונה אמון. כך עונים על התנגדויות עוד לפני שהן מגיעות לשיחה.",
        "hook_type_slug": "question",
        "lifecycle": "evergreen",
        "production_mode": "hybrid",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("comment", "bait", 3500, "כרטיס התגובה עם השאלה", "ai_image_kenburns",
                  "Medium shot of {subject_en} in {setting_en} looking up from a phone with a blank screen toward the camera, thoughtful expression, natural light",
                  "a slow look up from the phone", onscreen=slot("hook_line", 60, "כמה זמן לוקח לסדר צוואה?"),
                  vo=vo("comment_vo", 3.5), overlay=ov_comment(), shot="talking_head"),
            scene("answer", "payoff", 8000, "התשובה הקצרה", "ai_clip",
                  "Hands of {subject_en} pointing at {product_en} on a desk in {setting_en}, calm explanatory gesture",
                  "the hand moves slowly across the desk, pointing at details",
                  onscreen=slot("answer_line", 40, "פחות מסובך ממה שחושבים"), vo=vo("answer_vo", 8), shot="explain_closeup"),
            scene("example", "reveal", 7500, "דוגמה מהשטח", "ai_image_kenburns",
                  "{product_en} in {setting_en}, tidy, in focus, soft light", "slow push in", camera="push_in",
                  onscreen=slot("example_line", 40, "שיחה מסודרת, ומסמך חתום"), vo=vo("example_vo", 7.5),
                  shot="explain_closeup"),
            scene("tip", "reveal", 6000, "טיפ אחד", "brand_card", onscreen=slot("tip_line", 40, "הכינו מראש רשימה של כל מה שיש"),
                  vo=vo("tip_vo", 6)),
            scene("cta", "cta", 5000, "הזמנה לשאול עוד", "brand_card", onscreen=slot("cta_line", 30, "שאלה? שלחו לנו וואטסאפ"),
                  vo=vo("cta_vo", 5)),
        ]},
        "hook_variants": [
            variant("A", "the comment card pops up over a calm shot of the workplace", "כמה זמן זה לוקח באמת?",
                    "שאלה על זמן היא הדבר הראשון שלקוחות רוצים לדעת."),
            variant("B", "the comment card appears while {subject_en} smiles and slightly shakes their head",
                    "זה באמת שווה את הכסף?", "התנגדות מוכרת על המסך, והצופה מחכה לראות איך עונים עליה."),
            variant("C", "the comment card slides in over a close-up of tools or documents on a desk",
                    "אפשר לעשות את זה לבד, לא?", "שאלה קצת מתגרה פותחת תשובה מקצועית בלי להתנשא."),
        ],
        "niche_adaptations": [
            adapt("lawyers", "a lawyer in a blazer, around 45", "a calm law office with bookshelves",
                  "a signed document in a folder on the desk",
                  {"hook_line": "כמה זמן לוקח לסדר צוואה?", "answer_line": "פחות מסובך ממה שחושבים",
                   "example_line": "שיחה מסודרת, ומסמך חתום", "tip_line": "הכינו רשימה של הנכסים ושל היורשים",
                   "cta_line": "שאלה? שלחו לנו וואטסאפ"}, "whatsapp",
                  vo_example="זה תלוי במצב המשפחתי, אבל ברוב המקרים זה פחות מסובך ממה שחושבים.",
                  notes="מידע כללי, לא ייעוץ משפטי. ההסתייגות המשפטית נוספת אוטומטית."),
            adapt("insurance-agents", "an insurance agent in smart casual clothes", "a bright small office",
                  "an insurance policy folder on a desk",
                  {"hook_line": "ביטוח דירה זה לא מיותר?", "answer_line": "תלוי מה יש בדירה ומה כבר מכוסה",
                   "example_line": "בודקים מה כבר מכוסה, ורק אז מוסיפים", "tip_line": "צלמו את תכולת הדירה פעם בשנה",
                   "cta_line": "השאירו פרטים לבדיקה"}, "lead_form",
                  vo_example="לפני שמחליטים, בודקים מה כבר מכוסה בפוליסות הקיימות.",
                  notes="בלי הבטחה לחיסכון ובלי השוואה לחברה מסוימת."),
            adapt("interior-design", "an interior designer", "a small bright apartment living room",
                  "a cosy redesigned living room corner",
                  {"hook_line": "אפשר לעצב דירה קטנה בלי לשבור קירות?", "answer_line": "כן. אור, צבע ורהיטים עושים הרבה",
                   "example_line": "אותו סלון, בלי פטיש אחד", "tip_line": "מתחילים מהתאורה, לפני הרהיטים",
                   "cta_line": "שלחו תמונה של החדר בוואטסאפ"}, "whatsapp",
                  vo_example="ברוב הדירות אפשר לשנות המון בלי לשבור אף קיר.",
                  notes="דוגמה רק מפרויקט אמיתי של העסק."),
            adapt("renovation-contractors", "a renovation contractor", "a kitchen under renovation",
                  "a refreshed kitchen with new fronts and lighting",
                  {"hook_line": "אפשר לשפץ מטבח בלי לפרק הכול?", "answer_line": "לפעמים כן: חזיתות, משטח ותאורה",
                   "example_line": "אותו מטבח, בלי לפרק את הארונות", "tip_line": "בודקים את מצב הארונות לפני שמחליטים",
                   "cta_line": "שלחו תמונה וקבלו הצעה"}, "whatsapp",
                  vo_example="כשהארונות במצב טוב, מחליפים חזיתות, משטח ותאורה, ומדלגים על הפירוק."),
        ],
        "music_brief": music("warm", 85, 100, None, "flat", []),
        "required_overlays": ["comment_bubble"],
        "shot_list": {"version": 1, "intro_he": "אפשר הכול ב-AI. מי שרוצה לענות בעצמו מצלם שני שוטים קצרים.",
                      "estimated_minutes": 5, "shots": [
            shot("talking_head", "קוראים את השאלה",
                 "החזיקו טלפון ביד, הרימו מבט למצלמה ותנו רגע של מחשבה, כאילו קראתם עכשיו את השאלה.", "medium", 3, 8,
                 "face_center", ["בלי לדבר בשוט הזה", "הטלפון שמצלם בגובה העיניים"], True),
            shot("explain_closeup", "התשובה מקרוב", "תקריב של מה שמסביר את התשובה: מסמך, חומר או דוגמה מהעבודה.",
                 "closeup", 4, 15, "hands_table", ["בלי פרטים אישיים של לקוחות בפריים"], False),
        ]},
        "compliance_notes_he": [
            "השאלה אמיתית ובאישור, או כללית לגמרי: בלי שם, בלי תמונה ובלי עיצוב של רשת מסוימת.",
            "התשובה מדויקת ולא מבטיחה תוצאה.",
            "במשפט, בביטוח ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום.",
        ],
        "do_not_copy": [
            "real comments, usernames or avatars taken from social networks without permission",
            "the comment design of any specific platform",
            "copyrighted trending sounds",
        ],
        "platform_tone": {"reels": "שיחה קצרה וחמה, כמו תשובה בהודעה", "facebook": "מתאים לשאלה בטקסט מעל הסרטון"},
        "default_duration_sec": 30, "default_goal": "leads", "default_video_type": "explainer",
        "default_visual_style": "ugc", "default_music_mood": "warm", "default_caption_preset": "clean-box",
        "vo_mode": "required", "recommended_ad_goal": "whatsapp_messages",
        "niches": ["lawyers", "insurance-agents", "interior-design", "renovation-contractors", "accountants",
                   "mortgage-advisors", "home-services"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד עונים לתגובה: רילס של שאלה ותשובה",
        "seo_description_he": "שאלה של לקוח על המסך ותשובה קצרה וברורה. ככה עושים את הפורמט לעסק, עם שאלה אמיתית באישור או שאלה כללית, וקריינות בעברית.",
        "is_featured": False, "sort_order": 100,
    }


def t11_price():
    return {
        "slug": "price-reveal",
        "name_he": "כמה זה עולה באמת",
        "tagline_he": "מספר גדול בשנייה הראשונה, ואז מה מקבלים בדיוק",
        "description_he": "המחיר מופיע גדול על המסך בשנייה הראשונה, ואחריו פירוט קצר של מה כלול והצעה אחת. רק מחיר אמיתי ועדכני של העסק. הכול נוצר ב-AI, והמספר נבנה אצלנו בעברית ובפורמט של ערכת המותג.",
        "why_it_works_he": "מחיר הוא מה שכולם רוצים לדעת, ומעט עסקים מראים אותו. שקיפות עוצרת את הגלילה, והפירוט מסביר למה המחיר הוגן.",
        "hook_type_slug": "price-reveal",
        "lifecycle": "evergreen",
        "production_mode": "ai",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("number", "bait", 3000, "המחיר, גדול, בשנייה הראשונה", "ai_image_kenburns",
                  "Hero product shot in {setting_en}: {bait_en}, {product_en} in sharp focus, dramatic but warm light, empty space in the upper half of the frame",
                  "a slow dramatic push in", camera="push_in", sfx="cash",
                  onscreen=slot("hook_line", 36, "{מחיר} ₪. וזה מה שמקבלים"), vo=vo("number_vo", 3), overlay=ov_price()),
            scene("breakdown", "reveal", 5000, "מה כלול, בפירוט קצר", "ai_clip",
                  "Slow close-up pan across the details of {product_en} in {setting_en}",
                  "a smooth lateral pan revealing one detail after another", camera="pan_left",
                  onscreen=slot("breakdown_line", 40, "מנה ראשונה, עיקרית ושתייה"), vo=vo("breakdown_vo", 5)),
            scene("offer", "payoff", 3500, "ההצעה, רק אם היא אמיתית", "ai_image_kenburns",
                  "{product_en} served and ready in {setting_en}, inviting", "slow push in", camera="push_in",
                  onscreen=slot("offer_line", 40, "בלי תוספות שמגלים בסוף"), vo=vo("offer_vo", 3.5)),
            scene("cta", "cta", 3500, "איך מזמינים", "brand_card", onscreen=slot("cta_line", 30, "שלחו וואטסאפ ושמרו מקום"),
                  vo=vo("cta_vo", 3.5)),
        ]},
        "hook_variants": [
            variant("A", "a dramatic slow push-in on the hero product", "{מחיר} ₪. וזה מה שמקבלים",
                    "המספר לפני הכול: הצופה רוצה לדעת אם זה זול או יקר."),
            variant("B", "a hand slides a small blank card across the table toward the camera", "כמה זה עולה באמת? {מחיר} ₪",
                    "שאלה ותשובה באותה שורה, בלי לחכות."),
            variant("C", "a quick top-down reveal as a cover is lifted off the product", "{מחיר} ₪ ל{שירות}. בלי הפתעות",
                    "חשיפה של המוצר יחד עם המחיר, והבטחה לשקיפות."),
        ],
        "niche_adaptations": [
            adapt("restaurants", "a chef", "a cosy restaurant table", "a business-lunch meal with a starter, a main and a drink",
                  {"hook_line": "{מחיר} ₪. וזה מה שמקבלים", "breakdown_line": "מנה ראשונה, עיקרית ושתייה",
                   "offer_line": "בצהריים, בימים א׳ עד ה׳", "cta_line": "שלחו וואטסאפ ושמרו מקום"}, "whatsapp",
                  vo_example="ארוחה מלאה: מנה ראשונה, עיקרית ושתייה.",
                  notes="המחיר מהתפריט של היום, כולל מע״מ."),
            adapt("home-services", "an air conditioning technician in uniform", "a bright living room with a wall-mounted AC unit",
                  "an AC service kit laid out next to the unit",
                  {"hook_line": "{מחיר} ₪ לניקוי מזגן בבית", "breakdown_line": "פילטרים, מאייד והסבר מה מצאנו",
                   "offer_line": "מחיר סגור לפני שמתחילים", "cta_line": "התקשרו ונתאם ביקור"}, "call",
                  vo_example="ניקוי מלא של המזגן, ובסוף הסבר קצר מה מצאנו."),
            adapt("real-estate", "a real estate agent", "a bright apartment for sale", "a sunny four-room apartment living room",
                  {"hook_line": "{מחיר} ₪ לדירת {מספר} חדרים ב{עיר}", "breakdown_line": "מרפסת, חניה ומעלית",
                   "offer_line": "סיור בדירה בלי התחייבות", "cta_line": "שלחו וואטסאפ ונקבע סיור"}, "whatsapp",
                  vo_example="מחיר מבוקש אמיתי, ומה מקבלים בו.", notes="רק מחיר מבוקש עדכני של נכס אמיתי."),
            adapt("beauty-nails", "a nail technician", "a nail studio table", "a gel manicure with neat cuticles",
                  {"hook_line": "{מחיר} ₪ לבנייה בג׳ל", "breakdown_line": "הסרה, בנייה, עיצוב וציפוי",
                   "offer_line": "מחיר אחד, בלי תוספות", "cta_line": "קבעו תור אונליין"}, "booking",
                  vo_example="בנייה בג׳ל מההתחלה ועד הסוף, במחיר אחד."),
        ],
        "music_brief": music("energetic", 105, 125, 300, "drop", [("number", "cash")]),
        "required_overlays": ["price"],
        "shot_list": None,
        "compliance_notes_he": [
            "המחיר אמיתי, עדכני וכולל מע״מ, כמו שהוא מופיע אצלכם.",
            "כל מה שכתוב שכלול, כלול באמת. הגבלות ותנאים כתובים במלואם.",
            "משפטים כמו \"בלי תוספות\" כותבים רק כשזה נכון.",
        ],
        "do_not_copy": [
            "prices, menus or offers of other businesses",
            "names, faces or handles of creators known for price-reveal videos",
            "copyrighted trending sounds",
        ],
        "platform_tone": {"reels": "ישיר ושקוף, המספר בגדול", "facebook": "כדאי לכתוב את המחיר גם בטקסט של הפוסט"},
        "default_duration_sec": 15, "default_goal": "sales", "default_video_type": "offer",
        "default_visual_style": "product", "default_music_mood": "energetic", "default_caption_preset": "poster",
        "vo_mode": "optional", "recommended_ad_goal": "whatsapp_messages",
        "niches": ["restaurants", "home-services", "real-estate", "beauty-nails", "barbers-salons", "auto-services"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד חשיפת מחיר: כמה זה עולה באמת",
        "seo_description_he": "המחיר בגדול בשנייה הראשונה, ואז מה כלול והצעה אחת. ככה עושים את הטרנד ב-AI, עם מחיר אמיתי של העסק ומוזיקה שמותרת לפרסום.",
        "is_featured": False, "sort_order": 110,
    }


def t12_how_to():
    def tip(n, ms, key, example, sfx=None, last=False):
        prompt = (f"Close-up of hands demonstrating the {['first', 'second', 'third'][n - 1]} step with {{product_en}} in {{setting_en}}"
                  + (", ending on the result" if last else ""))
        return scene(key, "reveal", ms, f"טיפ {['ראשון', 'שני', 'שלישי'][n - 1]}", "ai_clip", prompt,
                     "one clear demonstrative motion, steady framing", sfx=sfx,
                     onscreen=slot(f"{key}_line", 40, example), vo=vo(f"{key}_vo", ms / 1000), shot=f"demo_{n}")

    return {
        "slug": "quick-how-to",
        "name_he": "מדריך מהיר",
        "tagline_he": "שלושה טיפים קצרים, וכל אחד אפשר ליישם היום",
        "description_he": "הבטחה קצרה בשנייה הראשונה, שלושה טיפים מעשיים עם קריינות, והזמנה לפנות. טיימר על המסך שומר על קצב. מתאים לכל תחום שיש בו ידע מקצועי.",
        "why_it_works_he": "הבטחה לערך מוגדר בזמן קצר מורידה את המחיר של הצפייה. טיפ שימושי נשמר ונשלח הלאה, והצופה זוכר מי נתן אותו.",
        "hook_type_slug": "how-to",
        "lifecycle": "evergreen",
        "production_mode": "hybrid",
        "ad_safety": "ad_safe",
        "extra_gates": [],
        "requires_real_footage": False,
        "requires_people_consent": False,
        "recipe": {"version": 1, "beats": [
            scene("promise", "bait", 3500, "ההבטחה: שלושה טיפים, בזמן קצר", "ai_clip",
                  "Hands of {subject_en} placing three objects in a row on a table in {setting_en}, clean natural light",
                  "three quick placements, one after another, in rhythm",
                  onscreen=slot("hook_line", 30, "3 טיפים ב-20 שניות"), vo=vo("promise_vo", 3.5), overlay=ov_clock("00:20"),
                  shot="talking_head"),
            tip(1, 7000, "tip1", "1. מנקים את הפילטר", sfx="pop"),
            tip(2, 7000, "tip2", "2. בודקים שאין נזילה מתחת ליחידה"),
            tip(3, 7000, "tip3", "3. סוגרים חלונות כשהמזגן עובד", sfx="pop", last=True),
            scene("cta", "cta", 5500, "למי שרוצה שנעשה את זה בשבילו", "brand_card",
                  onscreen=slot("cta_line", 30, "רוצים שנבדוק? התקשרו"), vo=vo("cta_vo", 5.5)),
        ]},
        "hook_variants": [
            variant("A", "three objects placed in a row in a quick rhythm", "3 טיפים ב-20 שניות",
                    "מספר וזמן מוגדרים: הצופה יודע בדיוק כמה זה ייקח."),
            variant("B", "a slow push-in on a professional's tool laid out on a clean table", "שלושה דברים שאנחנו בודקים תמיד",
                    "סוד מקצועי קטן שהצופה רוצה לקחת לעצמו."),
            variant("C", "a close-up of the most common mistake, frozen for a moment", "הטעות שכולם עושים, ואיך מתקנים",
                    "טעות מוכרת יוצרת הזדהות, והתיקון נותן ערך מיד."),
        ],
        "niche_adaptations": [
            adapt("home-services", "an air conditioning technician", "a living room with a wall-mounted AC unit",
                  "an AC filter and a soft brush",
                  {"hook_line": "3 טיפים למזגן לפני הקיץ", "tip1_line": "1. מנקים את הפילטר",
                   "tip2_line": "2. בודקים שאין נזילה מתחת ליחידה", "tip3_line": "3. סוגרים חלונות כשהמזגן עובד",
                   "cta_line": "רוצים שנבדוק? התקשרו"}, "call",
                  vo_example="פילטר נקי, בלי נזילות וחלונות סגורים: שלושה דברים פשוטים לפני הקיץ."),
            adapt("physio-nutrition", "a physiotherapist", "a bright treatment room", "a yoga mat and a resistance band",
                  {"hook_line": "3 תרגילים קלים לגב, ליד המחשב", "tip1_line": "1. מותחים את הכתפיים לאחור",
                   "tip2_line": "2. קמים ללכת כל שעה", "tip3_line": "3. המסך בגובה העיניים",
                   "cta_line": "קבעו תור להערכה"}, "booking",
                  vo_example="שלושה הרגלים קטנים שאפשר להתחיל כבר היום, ליד השולחן.",
                  notes="מידע כללי, לא מחליף בדיקה אישית. בלי הבטחה לריפוי."),
            adapt("vets-dog-grooming", "a dog groomer with a calm dog", "a bright grooming salon",
                  "a soft brush, a towel and a dog treat",
                  {"hook_line": "3 טיפים לרחצה רגועה של הכלב", "tip1_line": "1. מסרקים לפני הרחצה",
                   "tip2_line": "2. מים פושרים, לא חמים", "tip3_line": "3. מייבשים היטב בין האצבעות",
                   "cta_line": "קבעו תור לטיפוח"}, "booking",
                  vo_example="סירוק, מים פושרים וייבוש טוב. ככה הרחצה נגמרת בלי דרמה."),
            adapt("accountants", "an accountant", "a tidy office desk", "a folder of documents and a laptop with a blank screen",
                  {"hook_line": "3 דברים לסגור לפני סוף השנה", "tip1_line": "1. מסדרים את כל הקבלות",
                   "tip2_line": "2. בודקים הוצאות שמותר לדווח", "tip3_line": "3. קובעים פגישה לפני דצמבר",
                   "cta_line": "שלחו וואטסאפ וקבעו פגישה"}, "whatsapp",
                  vo_example="שלושה דברים פשוטים שעושים את סוף השנה הרבה יותר רגוע."),
        ],
        "music_brief": music("inspiring", 95, 115, None, "loop", [("tip1", "pop"), ("tip3", "pop")]),
        "required_overlays": ["clock"],
        "shot_list": {"version": 1, "intro_he": "אפשר הכול ב-AI. מי שרוצה להדגים בעצמו מצלם משפט אחד ושלוש הדגמות קצרות.",
                      "estimated_minutes": 8, "shots": [
            shot("talking_head", "ההבטחה", "עמדו מול המצלמה, הרימו שלוש אצבעות ואמרו מה יהיה בסרטון.", "medium", 3, 8,
                 "face_center", ["הטלפון בגובה העיניים", "משפט אחד קצר"], True),
            shot("demo_1", "הטיפ הראשון", "הדגימו את הטיפ הראשון בידיים, מקרוב.", "closeup", 4, 15, "hands_table",
                 ["תנועה אחת ברורה"], False),
            shot("demo_2", "הטיפ השני", "הדגימו את הטיפ השני, מאותה זווית.", "closeup", 4, 15, "hands_table",
                 ["אותו אור כמו בשוט הקודם"], False),
            shot("demo_3", "הטיפ השלישי", "הדגימו את הטיפ השלישי, ובסוף הראו את התוצאה.", "closeup", 4, 15, "hands_table",
                 ["משאירים שנייה על התוצאה"], False),
        ]},
        "compliance_notes_he": [
            "כל טיפ נכון ומקובל בתחום, ולא מבטיח תוצאה.",
            "בבריאות ובפיננסים ההסתייגות המתאימה נוספת לכרטיס הסיום.",
            "בלי מוצרים או מותגים של אחרים בפריים.",
        ],
        "do_not_copy": [
            "tips and wording copied from a specific creator's video",
            "names, faces or handles of creators known for quick tutorials",
            "copyrighted trending sounds",
        ],
        "platform_tone": {"reels": "מהיר ומעשי, טיפ כל כמה שניות", "facebook": "כדאי לכתוב את שלושת הטיפים גם בטקסט"},
        "default_duration_sec": 30, "default_goal": "trust", "default_video_type": "explainer",
        "default_visual_style": "ugc", "default_music_mood": "inspiring", "default_caption_preset": "clean-box",
        "vo_mode": "required", "recommended_ad_goal": "local_awareness",
        "niches": ["home-services", "physio-nutrition", "vets-dog-grooming", "accountants", "fitness-trainers", "beauty-nails"],
        "first_seen_at": None, "peak_expected_at": None, "expires_at": None,
        "seo_title_he": "טרנד מדריך מהיר: שלושה טיפים ברילס אחד",
        "seo_description_he": "הבטחה קצרה, שלושה טיפים מעשיים והזמנה לפנות. ככה עושים את הפורמט לעסק, ב-AI או בהדגמה שלכם, עם קריינות בעברית.",
        "is_featured": False, "sort_order": 120,
    }


def build_all():
    return [t1_bait_and_sign(), t2_behind_the_viral(), t3_almost_got_me(), t4_fake_popup(), t5_pov(), t6_before_after(),
            t7_day_in_life(), t8_asmr(), t9_myth(), t10_reply(), t11_price(), t12_how_to()]


# ---------------------------------------------------------------------------
# Validation (TT01–TT27, part 08 §5.6)
# ---------------------------------------------------------------------------
HEB_RE = re.compile("[א-ת]")
PH_RE = re.compile(r"\{([^{}]+)\}")
SLOT_KEY_RE = re.compile(r"^[a-z][a-z0-9_]{1,30}$")
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
TIME_RE = re.compile(r"^([01][0-9]|2[0-3]):[0-5][0-9]$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def words(s):
    return [w for w in s.split() if re.search(r"[\wא-ת]", w)]


def norm_tokens(s):
    s = re.sub(r"[֑-ׇ]", "", s.lower())
    return re.findall(r"[\wא-ת%']+", s)


def contains_seq(hay, needle, n):
    if len(needle) < n:
        return False
    grams = {tuple(needle[i:i + n]) for i in range(len(needle) - n + 1)}
    return any(tuple(hay[i:i + n]) in grams for i in range(len(hay) - n + 1))


def he_strings(t):
    """(path, text) for every Hebrew text field a customer can see or that can reach a render."""
    out = [(k, t[k]) for k in ("name_he", "tagline_he", "description_he", "why_it_works_he", "seo_title_he",
                                "seo_description_he")]
    out += [(f"compliance_notes_he[{i}]", s) for i, s in enumerate(t["compliance_notes_he"])]
    out += [(f"platform_tone.{k}", v) for k, v in t["platform_tone"].items()]
    for b in t["recipe"]["beats"]:
        out.append((f"recipe.{b['key']}.purpose_he", b["purpose_he"]))
        if b["onscreen_slot"]:
            out.append((f"recipe.{b['key']}.example_he", b["onscreen_slot"]["example_he"].replace("\n", " ")))
        ov = b["overlay"] or {}
        for fk, fv in ov.items():
            if fk.endswith("He") and isinstance(fv, str) and not fv.startswith("$"):
                out.append((f"recipe.{b['key']}.overlay.{fk}", fv))
            if fk == "buttonsHe":
                out += [(f"recipe.{b['key']}.overlay.buttonsHe", x) for x in fv]
    for v in t["hook_variants"]:
        out += [(f"hook_variants.{v['key']}.hook_line", v["hook_line_he_pattern"].replace("\n", " ")),
                (f"hook_variants.{v['key']}.why_he", v["why_he"])]
    for a in t["niche_adaptations"]:
        out += [(f"niche_adaptations.{a['niche_slug']}.{k}", s.replace("\n", " ")) for k, s in a["onscreen_examples_he"].items()]
        for k in ("vo_example_he", "notes_he"):
            if a[k]:
                out.append((f"niche_adaptations.{a['niche_slug']}.{k}", a[k]))
    if t["shot_list"]:
        out.append(("shot_list.intro_he", t["shot_list"]["intro_he"]))
        for s in t["shot_list"]["shots"]:
            out += [(f"shot_list.{s['key']}.title_he", s["title_he"]), (f"shot_list.{s['key']}.instruction_he", s["instruction_he"])]
            out += [(f"shot_list.{s['key']}.tips_he", x) for x in s["tips_he"]]
    return out


def en_strings(t):
    out = []
    for b in t["recipe"]["beats"]:
        out += [(f"recipe.{b['key']}.visual_prompt_en", b["visual_prompt_en"]),
                (f"recipe.{b['key']}.motion_prompt_en", b["motion_prompt_en"])]
    out += [(f"hook_variants.{v['key']}.bait_concept_en", v["bait_concept_en"]) for v in t["hook_variants"]]
    for a in t["niche_adaptations"]:
        out += [(f"niche_adaptations.{a['niche_slug']}.{k}", a[k] or "") for k in ("subject_en", "setting_en", "product_en")]
    return out


def shekel_issues(s):
    issues = []
    for m in re.finditer("₪", s):
        before = s[:m.start()]
        if not re.search(r"(\d|\})\s$", before):
            issues.append("₪ must follow a number or {מחיר}/{סכום} with a space (hooks-seed exception, '{מחיר} ₪')")
        after = s[m.end():]
        if re.match(r"\s?(\d|\{)", after):
            issues.append("₪ before a number (use '{מחיר} ₪' in seed text)")
    return issues


def he026(s):
    """Appendix E §18.4 (simplified): 2nd-person address in the same sentence as a personal attribute."""
    for sentence in re.split(r"[.?!\n]", s):
        if any(st in sentence for st in PERSONAL_ATTRIBUTE_STEMS) and any(sp in sentence.split() or sp in sentence
                                                                          for sp in SECOND_PERSON):
            return True
    return False


def validate(rows, hook_types, niche_slugs):
    errs, warns = [], []

    def e(i, code, msg):
        errs.append(f"trend_templates.json[{i}] {rows[i].get('slug', '?')}: {code} {msg}")

    def w(i, code, msg):
        warns.append(f"trend_templates.json[{i}] {rows[i].get('slug', '?')}: {code} {msg}")

    if len(rows) != 12:
        errs.append(f"expected exactly 12 templates, got {len(rows)}")
    seen_slugs = set()
    for i, t in enumerate(rows):
        # TT01 shape
        if list(t.keys()) != TOP_KEYS:
            e(i, "TT01", f"keys/order differ from TrendTemplateV1: {list(t.keys())}")
            continue
        # TT02 slug
        if not SLUG_RE.match(t["slug"]) or t["slug"] in seen_slugs:
            e(i, "TT02", "slug invalid or duplicate")
        seen_slugs.add(t["slug"])
        # TT03 enums and scalars
        for k, allowed in (("lifecycle", LIFECYCLES), ("production_mode", PRODUCTION_MODES), ("ad_safety", AD_SAFETY),
                           ("default_goal", HOOK_GOALS), ("default_video_type", VIDEO_TYPES),
                           ("default_visual_style", VISUAL_STYLES), ("default_music_mood", MUSIC_MOODS),
                           ("default_caption_preset", CAPTION_PRESETS), ("vo_mode", VO_MODES)):
            if t[k] not in allowed:
                e(i, "TT03", f"{k}={t[k]!r} not allowed")
        if t["default_duration_sec"] not in DURATIONS:
            e(i, "TT03", "default_duration_sec")
        if t["recommended_ad_goal"] is not None and t["recommended_ad_goal"] not in AD_GOALS:
            e(i, "TT03", "recommended_ad_goal")
        if any(g not in AD_SAFETY or g == "ad_safe" or g == t["ad_safety"] for g in t["extra_gates"]) \
                or len(set(t["extra_gates"])) != len(t["extra_gates"]):
            e(i, "TT03", "extra_gates must be distinct gates other than ad_safe and ad_safety")
        for k in ("requires_real_footage", "requires_people_consent", "is_featured"):
            if not isinstance(t[k], bool):
                e(i, "TT03", f"{k} must be boolean")
        if not isinstance(t["sort_order"], int):
            e(i, "TT03", "sort_order must be int")
        # TT04 references
        if t["hook_type_slug"] not in hook_types:
            e(i, "TT04", f"hook_type_slug {t['hook_type_slug']} unknown")
        bad = [n for n in t["niches"] if n not in niche_slugs]
        if bad or not t["niches"] or len(set(t["niches"])) != len(t["niches"]):
            e(i, "TT04", f"niches invalid: {bad}")
        beats = t["recipe"]["beats"]
        if t["recipe"].get("version") != 1 or list(t["recipe"].keys()) != ["version", "beats"]:
            e(i, "TT05", "recipe must be {version: 1, beats}")
        keys = [b["key"] for b in beats]
        if len(set(keys)) != len(keys):
            e(i, "TT05", "duplicate beat keys")
        for b in beats:
            if list(b.keys()) != BEAT_KEYS:
                e(i, "TT05", f"beat {b.get('key')} keys/order differ")
            if not SLOT_KEY_RE.match(b["key"]) or b["role"] not in ROLES:
                e(i, "TT05", f"beat {b['key']}: key or role invalid")
        scenes = [b for b in beats if b["role"] not in ("cut", "label")]
        scene_keys = [b["key"] for b in scenes]
        # TT05 durations and order (part 05 §12.2 trendBeatPlan: bait 2–3.5 s, others 1.5–8 s)
        if not (2 <= len(scenes) <= 10):
            e(i, "TT05", "2–10 scene beats")
        if scenes and scenes[0]["role"] != "bait":
            e(i, "TT05", "first scene beat must be bait")
        if scenes and scenes[-1]["role"] != "cta":
            e(i, "TT05", "last scene beat must be cta")
        if any(b["role"] == "bait" for b in scenes[1:]):
            w(i, "TT05", "a second bait beat becomes role story (part 05 §12.2)")
        for j, b in enumerate(scenes):
            lo, hi = (2000, 3500) if j == 0 else (1500, 8000)
            if not (lo <= b["duration_ms"] <= hi) or b["duration_ms"] % 500:
                e(i, "TT05", f"beat {b['key']} duration {b['duration_ms']} outside {lo}–{hi} or not a multiple of 500")
        total = sum(b["duration_ms"] for b in scenes)
        if abs(total - t["default_duration_sec"] * 1000) > t["default_duration_sec"] * 100:
            e(i, "TT05", f"scene durations sum {total} not within ±10% of {t['default_duration_sec']} s")
        # TT06 cut beats
        for j, b in enumerate(beats):
            if b["role"] == "cut":
                nxt = beats[j + 1] if j + 1 < len(beats) else None
                if b["duration_ms"] != 0 or b["transition_in"] != "cut" or j == 0 or nxt is None or nxt["role"] in ("cut", "label"):
                    e(i, "TT06", f"cut {b['key']}: duration 0, transition cut, between two scene beats")
                elif b["sfx"] is not None and nxt["sfx"] not in (None, b["sfx"]):
                    e(i, "TT06", f"cut {b['key']}: the next scene's sfx must equal the cut's sfx (B15)")
                elif b["sfx"] is not None and nxt["sfx"] is None:
                    e(i, "TT06", f"cut {b['key']}: copy the sfx onto the next scene beat {nxt['key']} (B15, music_brief)")
                if nxt is not None and nxt["transition_in"] != "cut":
                    e(i, "TT06", f"scene after cut {b['key']} must have transition_in cut (B15)")
        # TT07 labels, TT08 one overlay per scene, required_overlays
        covered = {}
        kinds_used = set()
        for b in beats:
            if b["role"] == "label":
                ov = b["overlay"] or {}
                sp = b["spans"] or []
                if ov.get("kind") not in LABEL_KINDS or b["duration_ms"] != 0 or not sp:
                    e(i, "TT07", f"label {b['key']}: bts_label/pov_label overlay, duration 0, spans")
                idx = [scene_keys.index(s) for s in sp if s in scene_keys]
                if len(idx) != len(sp) or idx != list(range(idx[0], idx[0] + len(idx))):
                    e(i, "TT07", f"label {b['key']}: spans must be contiguous scene beats")
                for s in sp:
                    covered[s] = ov.get("kind")
                kinds_used.add(ov.get("kind"))
            elif b["spans"] is not None:
                e(i, "TT07", f"beat {b['key']}: spans only on label beats")
        for b in scenes:
            if b["overlay"]:
                kinds_used.add(b["overlay"]["kind"])
                if b["key"] in covered:
                    e(i, "TT08", f"beat {b['key']} has its own overlay and is covered by a label")
        if sorted(kinds_used) != sorted(t["required_overlays"]) or len(set(t["required_overlays"])) != len(t["required_overlays"]):
            e(i, "TT08", f"required_overlays {t['required_overlays']} != kinds used {sorted(kinds_used)}")
        # TT09 overlay rules
        hook_slot = scenes[0]["onscreen_slot"] if scenes else None
        for b in beats:
            ov = b["overlay"]
            if not ov:
                continue
            k = ov["kind"]
            if k not in OVERLAY_KINDS:
                e(i, "TT09", f"{b['key']}: unknown overlay kind {k}")
                continue
            refs = [v for fk, v in ov.items() if isinstance(v, str) and v.startswith("$")]
            if "$onscreen" in refs and not b["onscreen_slot"]:
                e(i, "TT09", f"{b['key']}: $onscreen without an onscreen_slot")
            if "$hook" in refs and k != "pov_label":
                e(i, "TT09", f"{b['key']}: $hook only in pov_label")
            if any(r not in ("$onscreen", "$hook") for r in refs):
                e(i, "TT09", f"{b['key']}: unknown text reference {refs}")
            if k == "sign" and (b["visual_source"] != "ai_image_kenburns" or b["camera"] != "static"):
                e(i, "TT09", f"{b['key']}: sign needs a still image with camera static")
            if k == "fake_ui" and t["ad_safety"] != "organic_only":
                e(i, "TT09", "fake_ui requires ad_safety organic_only")
            if k == "fake_ui" and ov["variant"] not in FAKE_UI_VARIANTS:
                e(i, "TT09", "fake_ui variant")
            if k == "price":
                ex = b["onscreen_slot"]["example_he"] if b["onscreen_slot"] else ""
                if not re.search(r"\{(מחיר|סכום)\} ₪", ex):
                    e(i, "TT09", f"{b['key']}: price slot must carry '{{מחיר}} ₪' (real prices only)")
            if k == "split_reveal":
                bk = ov["before"]["beatKey"]
                if bk not in scene_keys or scene_keys.index(bk) >= scene_keys.index(b["key"]):
                    e(i, "TT09", f"{b['key']}: split_reveal.before must be an earlier scene beat")
            if k == "sticker":
                st = ov["stickers"]
                if not (1 <= len(st) <= 2) or any(s["emoji"] not in STICKER_EMOJI for s in st):
                    e(i, "TT09", f"{b['key']}: 1–2 stickers from the allowed emoji")
            if k == "clock" and not TIME_RE.match(ov["time"]):
                e(i, "TT09", f"{b['key']}: clock time HH:MM")
            if k == "rating" and not ((ov["mode"] == "verdict" and ov["verdict"] in ("true", "false") and ov["labelHe"])
                                      or (ov["mode"] == "score" and ov["scoreText"])):
                e(i, "TT09", f"{b['key']}: rating fields")
            if k == "meme_caption" and ov.get("emoji") and len(ov["emoji"]) > 2:
                e(i, "TT09", f"{b['key']}: one emoji at most")
            if ov.get("toMs") is not None and (ov["toMs"] <= ov["fromMs"] or ov["toMs"] > b["duration_ms"]):
                e(i, "TT09", f"{b['key']}: overlay timing outside the beat")
            if b is (scenes[0] if scenes else None) and refs and ov["fromMs"] + 120 > 500:
                w(i, "TT09", f"{b['key']}: hook text in the overlay appears after 0.5 s (hook score text_by_500ms)")
        # TT10 text slots
        slots = {}
        for b in scenes:
            s = b["onscreen_slot"]
            if not s:
                continue
            if not SLOT_KEY_RE.match(s["key"]) or s["key"] in slots:
                e(i, "TT10", f"slot {s['key']} invalid or duplicate")
            slots[s["key"]] = (s, b)
        if not hook_slot or hook_slot["key"] != "hook_line":
            e(i, "TT10", "the bait beat must carry the slot hook_line")

        def check_slot_text(path, text, s, b):
            kind = (b["overlay"] or {}).get("kind") if any(isinstance(v, str) and v == "$onscreen"
                                                            for v in (b["overlay"] or {}).values()) else None
            lim = min(s["max_chars"], ONSCREEN_MAX_CHARS)
            if kind == "fake_ui":
                parts = text.split("\n")
                if len(parts) != 2 or len(parts[0]) > POPUP_TITLE_MAX or len(parts[1]) > POPUP_BODY_MAX:
                    e(i, "TT10", f"{path}: fake_ui text = title (≤{POPUP_TITLE_MAX})\\nbody (≤{POPUP_BODY_MAX})")
            elif "\n" in text:
                e(i, "TT10", f"{path}: one line only")
            if kind in SLOT_LIMITS:
                lim = min(lim, SLOT_LIMITS[kind])
            if len(text) > lim:
                e(i, "TT10", f"{path}: {len(text)} chars > {lim}")
            if len(words(text)) > ONSCREEN_MAX_WORDS:
                e(i, "TT10", f"{path}: more than {ONSCREEN_MAX_WORDS} words")

        for key, (s, b) in slots.items():
            check_slot_text(f"recipe.{b['key']}.example_he", s["example_he"], s, b)
        # TT11 voice-over
        vo_beats = [b for b in scenes if b["vo_slot"]]
        if t["vo_mode"] == "none" and vo_beats:
            e(i, "TT11", "vo_mode none but beats carry vo_slot")
        if t["vo_mode"] != "none" and len(vo_beats) < 2:
            e(i, "TT11", "vo_mode optional/required needs vo slots")
        for b in vo_beats:
            if b["vo_slot"]["max_words"] > int(b["duration_ms"] / 1000 * WPS * 0.9) or b["vo_slot"]["max_words"] < 3:
                e(i, "TT11", f"{b['key']}: vo max_words over the word budget")
        # TT12 visuals
        used_slots = set()
        for b in scenes:
            src = b["visual_source"]
            if src not in SCENE_SOURCES or b["camera"] not in CAMERAS or b["transition_in"] not in TRANSITIONS:
                e(i, "TT12", f"{b['key']}: visual_source/camera/transition invalid")
            if b["sfx"] is not None and b["sfx"] not in SFX:
                e(i, "TT12", f"{b['key']}: sfx")
            if b["speed"] is not None and not (1 <= b["speed"] <= 2):
                e(i, "TT12", f"{b['key']}: speed 1–2")
            if src in ("ai_clip", "ai_image_kenburns"):
                if not b["visual_prompt_en"] or not b["motion_prompt_en"]:
                    e(i, "TT12", f"{b['key']}: AI source needs English prompts")
            elif b["visual_prompt_en"] or b["motion_prompt_en"]:
                e(i, "TT12", f"{b['key']}: {src} has no prompts")
            for p in (b["visual_prompt_en"], b["motion_prompt_en"]):
                slots_in = set(PH_RE.findall(p))
                used_slots |= slots_in
                if slots_in - PROMPT_SLOTS:
                    e(i, "TT12", f"{b['key']}: unknown prompt slot {slots_in - PROMPT_SLOTS}")
                if "bait_en" in slots_in and b is not scenes[0]:
                    e(i, "TT12", f"{b['key']}: {{bait_en}} only in the bait beat")
                if re.search(r"(sign|card|screen|board) (that says|with the words)|\btext\b|\bletters\b|\blogo\b", p.lower()):
                    e(i, "TT12", f"{b['key']}: requested text in frame (promptSafety B09)")
        for path, s in en_strings(t):
            if HEB_RE.search(s):
                e(i, "TT12", f"{path}: Hebrew letters in an _en field")
        for v in t["hook_variants"]:
            used_slots |= set(PH_RE.findall(v["bait_concept_en"]))
            if "bait_en" in PH_RE.findall(v["bait_concept_en"]):
                e(i, "TT12", "bait_concept_en cannot contain {bait_en}")
        if scenes and scenes[0]["visual_source"] in ("ai_clip", "ai_image_kenburns") \
                and "{bait_en}" not in scenes[0]["visual_prompt_en"] and t["production_mode"] == "ai":
            w(i, "TT12", "the bait prompt does not use {bait_en}: variants differ only in text")
        # TT13 production mode
        guided_keys = {b["guided_shot_key"] for b in scenes if b["guided_shot_key"]}
        shot_keys = [s["key"] for s in (t["shot_list"] or {}).get("shots", [])]
        has_user = any(b["visual_source"] == "user_media" for b in scenes)
        if t["production_mode"] == "ai":
            if has_user or guided_keys or t["shot_list"] is not None:
                e(i, "TT13", "ai: no user_media, no guided keys, shot_list null")
        else:
            if not t["shot_list"]:
                e(i, "TT13", "guided/hybrid need a shot_list")
            if guided_keys - set(shot_keys) or set(shot_keys) - guided_keys:
                e(i, "TT13", f"guided keys {sorted(guided_keys)} and shots {shot_keys} must match")
            for b in scenes:
                if t["production_mode"] == "guided" and b["visual_source"] == "user_media" and not b["guided_shot_key"]:
                    e(i, "TT13", f"{b['key']}: user_media needs guided_shot_key")
                if t["production_mode"] == "guided" and b["guided_shot_key"] and b["visual_source"] != "user_media":
                    e(i, "TT13", f"{b['key']}: guided beats are user_media")
                if t["production_mode"] == "hybrid" and b["guided_shot_key"] and b["visual_source"] not in ("ai_clip", "ai_image_kenburns"):
                    e(i, "TT13", f"{b['key']}: hybrid beats keep an AI fallback")
            if t["production_mode"] == "guided" and not has_user:
                e(i, "TT13", "guided needs user_media beats")
        if t["requires_real_footage"] != (t["production_mode"] == "guided"):
            e(i, "TT13", "requires_real_footage is true exactly for guided templates")
        # TT14 people consent (part 05 §21.8)
        if t["requires_people_consent"] and "needs_consent" not in [t["ad_safety"], *t["extra_gates"]]:
            e(i, "TT14", "requires_people_consent needs the needs_consent gate")
        if t["ad_safety"] == "needs_consent" and not t["requires_people_consent"]:
            e(i, "TT14", "needs_consent implies requires_people_consent")
        if t["requires_people_consent"] and t["production_mode"] != "guided":
            e(i, "TT14", "real-people formats are filmed (no AI people)")
        # TT15 ad safety
        if t["ad_safety"] == "organic_only" and t["recommended_ad_goal"] is not None:
            e(i, "TT15", "organic_only => recommended_ad_goal null")
        if t["ad_safety"] != "organic_only" and t["recommended_ad_goal"] is None:
            w(i, "TT15", "an ad-capable template without recommended_ad_goal")
        # TT16 hook variants
        hv = t["hook_variants"]
        if not (3 <= len(hv) <= 5) or [v["key"] for v in hv] != list("ABCDE")[:len(hv)]:
            e(i, "TT16", "3–5 variants keyed A, B, C…")
        stop = {"a", "an", "the", "of", "on", "in", "at", "to", "then", "and", "with", "one", "its", "is", "as", "into"}
        sets = [set(norm_tokens(v["bait_concept_en"])) - stop for v in hv]
        for x in range(len(sets)):
            for y in range(x + 1, len(sets)):
                jac = len(sets[x] & sets[y]) / max(1, len(sets[x] | sets[y]))
                if jac >= 0.5:
                    e(i, "TT16", f"bait concepts {hv[x]['key']} and {hv[y]['key']} too similar ({jac:.2f})")
        for v in hv:
            if len(v["why_he"]) > 160 or len(v["bait_concept_en"]) > 300:
                e(i, "TT16", f"variant {v['key']}: lengths")
            if hook_slot:
                check_slot_text(f"hook_variants.{v['key']}", v["hook_line_he_pattern"], hook_slot, scenes[0])
            for ph in PH_RE.findall(v["hook_line_he_pattern"]):
                if ph not in HOOK_PLACEHOLDERS:
                    e(i, "TT16", f"variant {v['key']}: placeholder {{{ph}}} not allowed in hook lines")
            if re.search(r"[()\[\]]", v["hook_line_he_pattern"]):
                e(i, "TT16", f"variant {v['key']}: brackets in a hook line (HE025)")
        # TT17 niche adaptations
        na = t["niche_adaptations"]
        if not (3 <= len(na) <= 6) or len({a["niche_slug"] for a in na}) != len(na):
            e(i, "TT17", "3–6 adaptations, one per niche")
        for a in na:
            if a["niche_slug"] not in t["niches"]:
                e(i, "TT17", f"{a['niche_slug']} not in niches[]")
            if a["cta_type"] not in CTA_TYPES:
                e(i, "TT17", f"{a['niche_slug']}: cta_type")
            if set(a["onscreen_examples_he"].keys()) != set(slots.keys()):
                e(i, "TT17", f"{a['niche_slug']}: examples for exactly the slots {sorted(slots)}")
            for k, txt in a["onscreen_examples_he"].items():
                if k in slots:
                    check_slot_text(f"niche_adaptations.{a['niche_slug']}.{k}", txt, *slots[k])
                    if k == "hook_line":
                        for ph in PH_RE.findall(txt):
                            if ph not in HOOK_PLACEHOLDERS:
                                e(i, "TT17", f"{a['niche_slug']}: {{{ph}}} not allowed in a hook line")
            if "product_en" in used_slots and not a["product_en"]:
                e(i, "TT17", f"{a['niche_slug']}: product_en required by the prompts")
            if not a["subject_en"] or not a["setting_en"]:
                e(i, "TT17", f"{a['niche_slug']}: subject_en/setting_en")
            if (a["vo_example_he"] is not None) != bool(vo_beats):
                e(i, "TT17", f"{a['niche_slug']}: vo_example_he exactly when the recipe has voice-over")
            if a["notes_he"] and len(a["notes_he"]) > 200:
                e(i, "TT17", f"{a['niche_slug']}: notes_he ≤ 200")
        # TT18 music brief
        mb = t["music_brief"]
        if list(mb.keys()) != ["mood", "bpm_min", "bpm_max", "drop_at_ms", "energy_curve", "sfx_cues"] or mb["mood"] not in MUSIC_MOODS \
                or not (60 <= mb["bpm_min"] <= mb["bpm_max"] <= 180) or mb["energy_curve"] not in ENERGY:
            e(i, "TT18", "music_brief shape, mood, bpm 60–180, energy_curve")
        if mb["drop_at_ms"] is not None and not (0 < mb["drop_at_ms"] < t["default_duration_sec"] * 1000):
            e(i, "TT18", "drop_at_ms inside the video")
        cues = {(c["beat_key"], c["kind"]) for c in mb["sfx_cues"]}
        beat_sfx = {(b["key"], b["sfx"]) for b in scenes if b["sfx"]}
        if cues != beat_sfx:
            e(i, "TT18", f"sfx_cues {sorted(cues)} must equal the scene sfx {sorted(beat_sfx)}")
        # TT19 shot list
        if t["shot_list"]:
            sl = t["shot_list"]
            if list(sl.keys()) != ["version", "intro_he", "estimated_minutes", "shots"] or sl["version"] != 1 \
                    or not (2 <= sl["estimated_minutes"] <= 15) or not (1 <= len(sl["shots"]) <= 8) or len(sl["intro_he"]) > 200:
                e(i, "TT19", "shot_list shape, 1–8 shots, minutes 2–15")
            for s in sl["shots"]:
                if not SLOT_KEY_RE.match(s["key"]) or s["framing"] not in FRAMINGS or s["ghost"] not in GHOSTS \
                        or not (1 <= s["min_sec"] < s["max_sec"] <= 60) or len(s["title_he"]) > 40 \
                        or len(s["instruction_he"]) > 200 or len(s["tips_he"]) > 3 or any(len(x) > 80 for x in s["tips_he"]) \
                        or not isinstance(s["people_on_camera"], bool):
                    e(i, "TT19", f"shot {s['key']} invalid")
            if len(shot_keys) != len(set(shot_keys)):
                e(i, "TT19", "duplicate shot keys")
            for b in scenes:
                if b["guided_shot_key"]:
                    s = next(x for x in sl["shots"] if x["key"] == b["guided_shot_key"]) if b["guided_shot_key"] in shot_keys else None
                    if s and s["max_sec"] * 1000 * (b["speed"] or 1) < b["duration_ms"]:
                        w(i, "TT19", f"{b['key']}: shot {s['key']} may be shorter than the scene")
        # TT20 Hebrew copy
        for path, s in he_strings(t):
            if not s:
                e(i, "TT20", f"{path}: empty")
                continue
            if path == "name_he" and s in NAME_HE_LATIN_OK:
                pass
            elif not HEB_RE.search(s):
                e(i, "TT20", f"{path}: no Hebrew")
            for issue in _hebrew_text_issues(s):
                e(i, "TT20", f"{path}: {issue}")
            for ph in PH_RE.findall(s):
                if ph not in ALLOWED_PLACEHOLDERS:
                    e(i, "TT20", f"{path}: placeholder {{{ph}}} not in the dictionary")
            for issue in shekel_issues(s):
                e(i, "TT20", f"{path}: {issue}")
            sing = [x for x in re.findall("[א-ת]+", s) if x in SINGULAR_FORMS]
            if sing:
                e(i, "TT20", f"{path}: singular address {sing} (plural or neutral only)")
            for ph in RESULTS_BANNED:
                if ph in s:
                    e(i, "TT20", f"{path}: HE027 banned results phrase '{ph}'")
            if he026(s):
                e(i, "TT20", f"{path}: HE026 second person next to a personal attribute")
        # TT21 compliance and do_not_copy
        if not (2 <= len(t["compliance_notes_he"]) <= 6) or any(len(s) > 200 for s in t["compliance_notes_he"]):
            e(i, "TT21", "2–6 compliance notes, ≤ 200 chars")
        min_dnc = 3 if t["first_seen_at"] else 1
        if not (min_dnc <= len(t["do_not_copy"]) <= 10):
            e(i, "TT21", f"do_not_copy needs {min_dnc}–10 items")
        if t["ad_safety"] == "organic_only" and not t["compliance_notes_he"][0].startswith("הפורמט הזה מתאים רק לפרסום רגיל"):
            e(i, "TT21", "organic_only: the first compliance note is the canonical organic-only sentence")
        # TT22 similarity guard (part 08 §5.7): quoted expression in do_not_copy + known reference texts
        quoted = []
        for item in t["do_not_copy"]:
            quoted += re.findall(r"'([^']{3,})'", item)
        texts = [s for _, s in he_strings(t)] + [s for _, s in en_strings(t)]
        for q in quoted + REFERENCE_TEXTS:
            qt = [x for x in norm_tokens(q) if x not in GENERIC_MARKERS]
            n = min(6, len(qt))
            if n < 2:
                continue
            for s in texts:
                if contains_seq(norm_tokens(s), qt, n):
                    if q.lower() in ("low battery",):
                        continue
                    e(i, "TT22", f"copies reference expression '{q}'")
        # TT23 SEO
        if len(t["seo_title_he"]) > 60 or not (50 <= len(t["seo_description_he"]) <= 155):
            e(i, "TT23", f"seo_title ≤ 60 ({len(t['seo_title_he'])}), seo_description 50–155 ({len(t['seo_description_he'])})")
        # TT24 lifecycle dates (seed rows are drafts: expires_at stays null until publish)
        if t["lifecycle"] in ("format", "moment") and not (t["first_seen_at"] and DATE_RE.match(t["first_seen_at"])):
            e(i, "TT24", "format/moment templates carry first_seen_at")
        if t["expires_at"] is not None or t["peak_expected_at"] not in (None,) and not DATE_RE.match(t["peak_expected_at"] or ""):
            e(i, "TT24", "seed rows: expires_at null (set at publish)")
        # TT25 platform tone
        if list(t["platform_tone"].keys()) != ["reels", "facebook"] or any(len(v) > 120 for v in t["platform_tone"].values()):
            e(i, "TT25", "platform_tone {reels, facebook}, ≤ 120 chars")
        # TT26 lengths of the card copy
        for k, lo, hi in (("name_he", 2, 40), ("tagline_he", 10, 80), ("description_he", 40, 420), ("why_it_works_he", 20, 300)):
            if not (lo <= len(t[k]) <= hi):
                e(i, "TT26", f"{k} length {len(t[k])} outside {lo}–{hi}")
        # TT27 people on camera vs. ghost (hook score face_or_product reads the ghost)
        if t["shot_list"]:
            for s in t["shot_list"]["shots"]:
                if s["ghost"] == "face_center" and not s["people_on_camera"]:
                    e(i, "TT27", f"shot {s['key']}: face_center ghost implies people_on_camera")
    if [t["sort_order"] for t in rows] != sorted(t["sort_order"] for t in rows):
        warns.append("sort_order not ascending in file order")
    return errs, warns


def serialize(rows):
    return json.dumps(rows, ensure_ascii=False, indent=2) + "\n"


def main():
    rows = build_all()
    if "--print-compact" in sys.argv:
        print("[")
        print(",\n".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in rows))
        print("]")
        return
    hook_types = {h["slug"] for h in json.loads((SEED / "hook_types.json").read_text(encoding="utf-8"))}
    niches = {n["slug"] for n in json.loads((SEED / "niches.json").read_text(encoding="utf-8"))
              if n["compliance_flag"] != "political"}
    text = serialize(rows)
    if "--check" in sys.argv:
        if not OUT.exists() or OUT.read_text(encoding="utf-8") != text:
            print("ERROR seed/trend_templates.json differs from build_trends.py (run without --check and commit)")
            sys.exit(1)
    else:
        OUT.write_text(text, encoding="utf-8")
    rows_on_disk = json.loads(OUT.read_text(encoding="utf-8"))
    errors, warnings = validate(rows_on_disk, hook_types, niches)
    print(f"trend_templates={len(rows_on_disk)} "
          f"(ai={sum(r['production_mode'] == 'ai' for r in rows_on_disk)}, "
          f"guided={sum(r['production_mode'] == 'guided' for r in rows_on_disk)}, "
          f"hybrid={sum(r['production_mode'] == 'hybrid' for r in rows_on_disk)}, "
          f"organic_only={sum(r['ad_safety'] == 'organic_only' for r in rows_on_disk)}, "
          f"adaptations={sum(len(r['niche_adaptations']) for r in rows_on_disk)})")
    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("ERROR", e)
    print(f"validation: {len(errors)} errors, {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
