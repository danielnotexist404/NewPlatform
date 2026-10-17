import { BRAND } from "@/lib/constants";

/** Login/signup with a return path — same pattern as SIGNUP_HREF ("/login?next=/app/create"). */
export const signupHref = (next: string) => `/login?next=${encodeURIComponent(next)}`;

export const createFromHookHref = (hookId: string) => signupHref(`/app/create?hook=${hookId}&src=hooks`);
export const createForNicheHref = (niche: string, src: "niche_page" | "hooks" = "niche_page", hookId?: string) =>
  signupHref(`/app/create?niche=${niche}${hookId ? `&hook=${hookId}` : ""}&src=${src}`);
export const variationsHref = (hookId: string) => signupHref(`/app/hooks?source=${hookId}&variations=1`);
export const generateHooksHref = (niche?: string | null, q?: string | null) => {
  const p = new URLSearchParams({ generate: "1" });
  if (niche) p.set("niche", niche);
  if (q) p.set("q", q);
  return signupHref(`/app/hooks?${p.toString()}`);
};
export const seasonCreateHref = (season: string, hookId?: string) =>
  signupHref(`/app/create?${hookId ? `hook=${hookId}&` : ""}season=${season}&src=hooks`);

export const hookPermalink = (id: string) => `https://${BRAND.domain}/hooks/h/${id}`;
