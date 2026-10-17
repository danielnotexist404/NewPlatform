/** Destinations and helpers shared by the hero card and the final CTA (Part 02 §3.3.3, §3.14). */

export type CreateSrc = "hero" | "final_cta" | "hooks";

/** Guest destination: /login?next=<encoded /app/create?...>. Signed-in routing is handled by /login. */
export function createHref(src: CreateSrc, nicheSlug?: string | null, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (nicheSlug) params.set("niche", nicheSlug);
  for (const [k, v] of Object.entries(extra ?? {})) params.set(k, v);
  params.set("src", src);
  return `/login?next=${encodeURIComponent(`/app/create?${params.toString()}`)}`;
}

export const loginNext = (target: string) => `/login?next=${encodeURIComponent(target)}`;

/** Normalises a URL or an Instagram handle. "" → null (no link); invalid → false. */
export function normalizeBusinessUrl(raw: string): string | null | false {
  const v = raw.trim();
  if (!v) return null;
  if (v.startsWith("@")) {
    const handle = v.slice(1);
    return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? `https://instagram.com/${handle}` : false;
  }
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes(".") || u.hostname.startsWith(".") || u.hostname.endsWith(".")) return false;
    return u.toString();
  } catch {
    return false;
  }
}

export interface HeroDraft { nicheSlug: string | null; url: string | null; description: string | null; ts: number }

export function saveHeroDraft(d: HeroDraft) {
  try {
    localStorage.setItem("hero_draft_v1", JSON.stringify(d));
  } catch {
    /* storage may be blocked — continue without the draft */
  }
}
