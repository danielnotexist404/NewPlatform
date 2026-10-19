/**
 * Server-side OpenRouter client (used only by app/api/generate/*). Never import from a client component:
 * it reads OPENROUTER_API_KEY. The browser talks to our route handlers, never to OpenRouter.
 */
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const openRouterKey = () => process.env.OPENROUTER_API_KEY?.trim() || null;
export const scriptModel = () => process.env.OPENROUTER_SCRIPT_MODEL?.trim() || "anthropic/claude-sonnet-5.5";
export const imageModel = () => process.env.OPENROUTER_IMAGE_MODEL?.trim() || "google/gemini-3.1-flash-image";

interface ChatMessage {
  content?: string | null | { type: string; text?: string }[];
  images?: { type?: string; image_url?: { url?: string } }[];
}
interface ChatResponse { choices?: { message?: ChatMessage }[]; error?: { message?: string } }

export async function chatCompletion(body: Record<string, unknown>, timeoutMs: number): Promise<ChatMessage> {
  const key = openRouterKey();
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://kdimon.co.il",
      "X-OpenRouter-Title": "Kdimon",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as ChatResponse;
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${json.error?.message ?? "request failed"}`);
  const message = json.choices?.[0]?.message;
  if (!message) throw new Error("OpenRouter: empty response");
  return message;
}

/** Message content as plain text (string or content parts). */
export function messageText(m: ChatMessage): string {
  if (typeof m.content === "string") return m.content;
  if (Array.isArray(m.content)) return m.content.map((p) => p.text ?? "").join("");
  return "";
}

/** Parses a JSON object out of a model reply (tolerates ```json fences). */
export function parseJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? raw.slice(start, end + 1) : raw);
}
