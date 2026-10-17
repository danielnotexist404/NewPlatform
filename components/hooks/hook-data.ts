/**
 * Flat hook view model built from the seed — the shape of `HookCardDTO` (Part 04 §20.3) that the site needs,
 * without counters (no real data yet, so none are shown). Pure module: server and client.
 */
import {
  hooks as seedHooks,
  niches,
  hookTypes,
  hookFamilies,
  seasons,
  nicheCategories,
  nicheShortName,
  type Hook,
  type Niche,
} from "@/lib/data/seed";
import type { HookGender, HookGoal, Platform } from "@/lib/labels";
import { WHY_IT_WORKS, SEASONS_WITHOUT_PAGE } from "@/content/he/hooks";
import { hash } from "./text";

export interface HookView {
  id: string;
  text: string;
  placeholders: string[];
  nicheSlug: string | null;
  nicheName: string | null;
  nicheShort: string | null;
  nicheIcon: string | null;
  nicheCategory: string | null;
  typeSlug: string;
  typeName: string;
  familySlug: string;
  why: string | null;
  platforms: Platform[];
  goal: HookGoal;
  gender: HookGender;
  visual: string;
  seasonSlug: string | null;
  seasonName: string | null;
  compliance: string | null;
  featured: boolean;
  /** Seed order (stands in for created_at until the database exists). */
  order: number;
}

const nicheBySlug = new Map(niches.map((n) => [n.slug, n]));
const typeBySlug = new Map(hookTypes.map((t) => [t.slug, t]));
const seasonBySlug = new Map(seasons.map((s) => [s.slug, s]));

function toView(h: Hook, order: number): HookView {
  const n = h.niche_slug ? nicheBySlug.get(h.niche_slug) : undefined;
  const t = typeBySlug.get(h.hook_type_slug);
  const s = h.season_slug ? seasonBySlug.get(h.season_slug) : undefined;
  return {
    id: h.id,
    text: h.text_he,
    placeholders: h.placeholders,
    nicheSlug: n?.slug ?? null,
    nicheName: n?.name_he ?? null,
    nicheShort: n ? nicheShortName(n) : null,
    nicheIcon: n?.icon ?? null,
    nicheCategory: n?.category_slug ?? null,
    typeSlug: h.hook_type_slug,
    typeName: t?.name_he ?? h.hook_type_slug,
    familySlug: t?.family_slug ?? "",
    why: WHY_IT_WORKS[h.hook_type_slug] ?? null,
    platforms: h.platforms.filter((p) => p !== "linkedin"),
    goal: h.goal,
    gender: h.gender,
    visual: h.visual_direction_he,
    seasonSlug: s?.slug ?? null,
    seasonName: s?.name_he ?? null,
    compliance: h.compliance_note_he,
    featured: h.is_featured,
    order,
  };
}

/** Hooks of active niches only (local-politics has none) plus universal and seasonal hooks. */
export const ALL_HOOKS: HookView[] = seedHooks
  .map(toView)
  .filter((h) => h.nicheSlug !== null || !seedHooks[h.order].niche_slug);

export const hookById = new Map(ALL_HOOKS.map((h) => [h.id, h]));

/** Popular order: featured first, then seed order (Part 02 §5.1 without counters). */
export const byPopular = (a: HookView, b: HookView) => Number(b.featured) - Number(a.featured) || a.order - b.order;

export const hooksOfNiche = (slug: string) => ALL_HOOKS.filter((h) => h.nicheSlug === slug).sort(byPopular);
export const hooksOfType = (slug: string) => ALL_HOOKS.filter((h) => h.typeSlug === slug).sort(byPopular);
export const hooksOfSeason = (slug: string) => ALL_HOOKS.filter((h) => h.seasonSlug === slug).sort(byPopular);
export const hooksOfPlatform = (p: Platform) => ALL_HOOKS.filter((h) => h.platforms.includes(p)).sort(byPopular);
/** The 10 universal hooks (no niche, no season). */
export const universalHooks = () => ALL_HOOKS.filter((h) => h.nicheSlug === null && h.seasonSlug === null);

/** Featured hooks mixed across niches in a fixed order (deterministic, cache-friendly). */
export function featuredMix(limit = 12): HookView[] {
  const pool = ALL_HOOKS.filter((h) => h.featured && h.nicheSlug).sort((a, b) => hash(a.id) - hash(b.id));
  const seen = new Set<string>();
  const out: HookView[] = [];
  for (const h of pool) {
    if (out.length >= limit) break;
    if (seen.has(h.nicheSlug!)) continue;
    seen.add(h.nicheSlug!);
    out.push(h);
  }
  return out;
}

export const nicheHookCount = (slug: string) => ALL_HOOKS.reduce((n, h) => n + (h.nicheSlug === slug ? 1 : 0), 0);
export const typeHookCount = (slug: string) => ALL_HOOKS.reduce((n, h) => n + (h.typeSlug === slug ? 1 : 0), 0);

/** Seasons that get a page: not quiet days, not the election (Part 02 §5.8). */
export const pageSeasons = () =>
  seasons.filter((s) => !s.is_quiet_day && !(SEASONS_WITHOUT_PAGE as readonly string[]).includes(s.slug));
export const hasSeasonPage = (slug: string) => pageSeasons().some((s) => s.slug === slug);

/** Platforms that get a page (≥1 hook; linkedin not built at launch). Indexable at ≥12 hooks (§5.9). */
export const PAGE_PLATFORMS: Platform[] = (["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"] as Platform[]).filter(
  (p) => ALL_HOOKS.some((h) => h.platforms.includes(p)),
);

export const categoriesWithNiches = () =>
  nicheCategories
    .map((c) => ({ category: c, niches: niches.filter((n) => n.category_slug === c.slug) }))
    .filter((g) => g.niches.length > 0);

export const relatedNiches = (n: Niche, limit: number) =>
  niches.filter((x) => x.category_slug === n.category_slug && x.slug !== n.slug).slice(0, limit);

export const familyOf = (slug: string) => hookFamilies.find((f) => f.slug === slug);
export const typesOfFamily = (slug: string) => hookTypes.filter((t) => t.family_slug === slug);

/** Placeholders present in a set of hooks (text and visual direction), for the personalizer's "עוד שדות". */
export function placeholdersIn(list: HookView[]): string[] {
  const s = new Set<string>();
  for (const h of list) {
    h.placeholders.forEach((p) => s.add(p));
    for (const m of h.visual.matchAll(/\{([^{}]+)\}/g)) s.add(m[1]);
  }
  return [...s];
}

/** Compact JSON-safe subset for server → client props (identical to HookView today). */
export type HookViewProps = HookView;
