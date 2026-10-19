/**
 * Shared types + Zod schemas for the generation API (app/api/generate/*).
 * Client-safe: no secrets, no server-only imports.
 */
import { z } from "zod";

export const ASPECTS = ["9:16", "1:1", "16:9"] as const;
export type GenAspect = (typeof ASPECTS)[number];

export const ScriptRequestSchema = z.object({
  niche: z.string().trim().min(1).max(80),
  goal: z.string().trim().min(1).max(40),
  hookText: z.string().trim().min(2).max(240),
  businessName: z.string().trim().max(80).optional(),
  city: z.string().trim().max(60).optional(),
  durationSec: z.number().int().min(10).max(90),
  /** Optional hints (the UI sends them; the API works without them). */
  nicheEn: z.string().trim().max(80).optional(),
  style: z.string().trim().max(40).optional(),
  mood: z.string().trim().max(40).optional(),
});
export type ScriptRequest = z.infer<typeof ScriptRequestSchema>;

export const SceneSchema = z.object({
  onscreen_text_he: z.string().max(160),
  vo_he: z.string().min(1).max(400),
  visual_prompt_en: z.string().min(1).max(600),
  duration_sec: z.number().min(1).max(30),
});
export type GeneratedScene = z.infer<typeof SceneSchema>;

export const ScriptSchema = z.object({ scenes: z.array(SceneSchema).min(4).max(6) });

export interface ScriptResponse {
  scenes: GeneratedScene[];
  /** "ai" = OpenRouter; "mock" = deterministic demo script (no key, or the AI call failed). */
  source: "ai" | "mock";
  model?: string;
}

export const ImageRequestSchema = z.object({
  prompt: z.string().trim().min(3).max(1000),
  aspect: z.enum(ASPECTS).default("9:16"),
});
export interface ImageResponse { image: string | null }

/** JSON schema handed to OpenRouter's structured output (response_format: json_schema). */
export const SCRIPT_JSON_SCHEMA = {
  name: "video_script",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["scenes"],
    properties: {
      scenes: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["onscreen_text_he", "vo_he", "visual_prompt_en", "duration_sec"],
          properties: {
            onscreen_text_he: { type: "string", description: "Short Hebrew on-screen text, max 7 words. Empty string allowed for the last scene." },
            vo_he: { type: "string", description: "Natural spoken Hebrew voice-over for this scene." },
            visual_prompt_en: { type: "string", description: "English prompt for a photoreal vertical frame. No text, letters or logos in the image." },
            duration_sec: { type: "number", description: "Scene length in seconds." },
          },
        },
      },
    },
  },
} as const;
