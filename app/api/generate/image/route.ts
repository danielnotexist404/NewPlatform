import { NextResponse } from "next/server";
import { ImageRequestSchema, type ImageResponse } from "@/lib/generate/types";
import { chatCompletion, imageModel, openRouterKey } from "@/lib/generate/openrouter";

export const maxDuration = 60;

/**
 * POST /api/generate/image — one scene frame. With OPENROUTER_API_KEY: OpenRouter image generation
 * (chat completions, modalities image+text) and the first returned data URL. Without a key (or on failure): { image: null },
 * and the UI keeps its styled placeholder art.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ImageRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  if (!openRouterKey()) return NextResponse.json({ image: null } satisfies ImageResponse);

  const { prompt, aspect } = parsed.data;
  try {
    const message = await chatCompletion(
      {
        model: imageModel(),
        messages: [{ role: "user", content: `${prompt}. Photorealistic, ${aspect} frame. No text, letters, captions, signs or logos.` }],
        modalities: ["image", "text"],
        image_config: { aspect_ratio: aspect },
      },
      55_000,
    );
    const url = message.images?.[0]?.image_url?.url ?? null;
    return NextResponse.json({ image: typeof url === "string" && url.startsWith("data:image/") ? url : null } satisfies ImageResponse);
  } catch (err) {
    console.error("[generate/image]", err instanceof Error ? err.message : err);
    return NextResponse.json({ image: null } satisfies ImageResponse);
  }
}
