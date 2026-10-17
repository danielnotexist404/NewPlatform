/** Filter state ↔ URL params and faceted counts for the hooks library (Part 02 §5.1, §5.5). Pure module. */
import type { HookView } from "./hook-data";
import { byPopular } from "./hook-data";
import { normalize } from "./text";

export type FacetKey = "niche" | "type" | "platform" | "goal" | "gender" | "season";
export const FACET_KEYS: FacetKey[] = ["niche", "type", "platform", "goal", "gender", "season"];

export interface Filters {
  q: string;
  niche: string;
  type: string;
  platform: string;
  goal: string;
  gender: string;
  season: string;
  featured: boolean;
  sort: "popular" | "new";
  /** Hub only: results view without any filter ("לכל ההוקים"). */
  all: boolean;
}

export const EMPTY_FILTERS: Filters = { q: "", niche: "", type: "", platform: "", goal: "", gender: "", season: "", featured: false, sort: "popular", all: false };

export function parseFilters(search: string): Filters {
  const p = new URLSearchParams(search);
  const get = (k: string) => (p.get(k) ?? "").slice(0, 80);
  return {
    q: get("q"),
    niche: get("niche"),
    type: get("type"),
    platform: get("platform"),
    goal: get("goal"),
    gender: get("gender"),
    season: get("season"),
    featured: p.get("featured") === "1",
    sort: p.get("sort") === "new" ? "new" : "popular",
    all: p.get("view") === "all",
  };
}

export function toParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  for (const k of FACET_KEYS) if (f[k]) p.set(k, f[k]);
  if (f.featured) p.set("featured", "1");
  if (f.sort !== "popular") p.set("sort", f.sort);
  if (f.all) p.set("view", "all");
  return p;
}

export const effectiveQuery = (q: string) => (normalize(q).length >= 2 ? normalize(q) : "");

export function activeCount(f: Filters, fixed: FacetKey[] = []): number {
  return FACET_KEYS.filter((k) => !fixed.includes(k) && f[k]).length + (f.featured ? 1 : 0) + (effectiveQuery(f.q) ? 1 : 0);
}

const hayCache = new WeakMap<HookView, string>();
function hay(h: HookView) {
  let s = hayCache.get(h);
  if (!s) {
    s = normalize([h.text, h.nicheName, h.nicheShort, h.typeName, h.seasonName].filter(Boolean).join(" "));
    hayCache.set(h, s);
  }
  return s;
}

function facetValue(h: HookView, k: FacetKey): string[] {
  switch (k) {
    case "niche": return h.nicheSlug ? [h.nicheSlug] : ["__universal"];
    case "type": return [h.typeSlug];
    case "platform": return h.platforms;
    case "goal": return [h.goal];
    case "gender": return [h.gender];
    case "season": return h.seasonSlug ? [h.seasonSlug] : [];
  }
}

export function matches(h: HookView, f: Filters, q: string, skip?: FacetKey): boolean {
  for (const k of FACET_KEYS) {
    if (k === skip || !f[k]) continue;
    if (!facetValue(h, k).includes(f[k])) return false;
  }
  if (f.featured && !h.featured) return false;
  if (q) {
    const text = hay(h);
    for (const token of q.split(" ")) if (!text.includes(token)) return false;
  }
  return true;
}

export function applyFilters(list: HookView[], f: Filters): HookView[] {
  const q = effectiveQuery(f.q);
  const out = list.filter((h) => matches(h, f, q));
  return out.sort(f.sort === "new" ? (a, b) => b.order - a.order : byPopular);
}

/** Counts per facet value, each facet counted against all the *other* active filters. */
export function facetCounts(list: HookView[], f: Filters, keys: FacetKey[]): Record<FacetKey, Record<string, number>> {
  const q = effectiveQuery(f.q);
  const out = {} as Record<FacetKey, Record<string, number>>;
  for (const k of keys) {
    const counts: Record<string, number> = {};
    for (const h of list) {
      if (!matches(h, f, q, k)) continue;
      for (const v of facetValue(h, k)) counts[v] = (counts[v] ?? 0) + 1;
    }
    out[k] = counts;
  }
  return out;
}

export function featuredCount(list: HookView[], f: Filters): number {
  const q = effectiveQuery(f.q);
  return list.filter((h) => h.featured && matches(h, { ...f, featured: false }, q)).length;
}
