import { NextResponse } from "next/server";
import { ScriptRequestSchema, ScriptSchema, SCRIPT_JSON_SCHEMA, type ScriptRequest, type ScriptResponse } from "@/lib/generate/types";
import { mockScript, normalizeDurations } from "@/lib/generate/mock-script";
import { chatCompletion, messageText, openRouterKey, parseJsonObject, scriptModel } from "@/lib/generate/openrouter";

export const maxDuration = 60;

const GOAL_EN: Record<string, string> = {
  leads: "get leads (WhatsApp messages / calls)",
  sales: "drive sales of the offer",
  awareness: "make the business known locally",
  trust: "build trust in the business",
  engagement: "get comments and shares",
};

const SYSTEM = `You write short promo-video scripts in Hebrew for small Israeli businesses (Reels / TikTok / Facebook ads).
Rules:
- Return 4 to 6 scenes. The first scene IS the hook: its vo_he must be the given hook text (you may only fix grammar), and onscreen_text_he a short version of it.
- Natural, warm, spoken modern Hebrew. Address the viewer in plural ("אתם"). No English words in Hebrew fields.
- onscreen_text_he: at most 7 words. The last scene is a clear call to action (WhatsApp message); its onscreen_text_he may be "".
- NEVER invent facts: no prices, numbers, ratings, years, awards, guarantees or customer names that are not in the input. If the input has none, use none.
- No medical, financial or "best in Israel" claims.
- visual_prompt_en: one English sentence describing a photoreal frame for that scene (subject, setting, light, camera). Never ask for text, letters, signs or logos in the image.
- duration_sec values must add up to the requested total length.`;

function userPrompt(r: ScriptRequest) {
  return [
    `Business niche: ${r.niche}${r.nicheEn ? ` (${r.nicheEn})` : ""}`,
    r.businessName ? `Business name: ${r.businessName}` : null,
    r.city ? `City: ${r.city}` : null,
    `Goal: ${GOAL_EN[r.goal] ?? r.goal}`,
    `Hook (scene 1): ${r.hookText}`,
    `Total length: ${r.durationSec} seconds`,
    r.style ? `Visual style: ${r.style}` : null,
    r.mood ? `Music mood: ${r.mood}` : null,
  ].filter(Boolean).join("\n");
}

async function aiScript(r: ScriptRequest) {
  const model = scriptModel();
  const message = await chatCompletion(
    {
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt(r) },
      ],
      response_format: { type: "json_schema", json_schema: SCRIPT_JSON_SCHEMA },
      temperature: 0.7,
      max_tokens: 2000,
    },
    45_000,
  );
  const parsed = ScriptSchema.parse(parseJsonObject(messageText(message)));
  return { scenes: normalizeDurations(parsed.scenes, r.durationSec), model };
}

/** POST /api/generate/script — Hebrew scene script. Uses OpenRouter when a key is set; otherwise (or on failure) a deterministic demo script. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ScriptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 400 });
  }
  const req = parsed.data;

  if (openRouterKey()) {
    try {
      const { scenes, model } = await aiScript(req);
      return NextResponse.json({ scenes, source: "ai", model } satisfies ScriptResponse);
    } catch (err) {
      console.error("[generate/script] falling back to the demo script:", err instanceof Error ? err.message : err);
    }
  }
  return NextResponse.json({ scenes: mockScript(req), source: "mock" } satisfies ScriptResponse);
}
