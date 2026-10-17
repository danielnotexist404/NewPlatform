/**
 * Typed access to the canonical seed files in /seed (Appendices A–C).
 * Until Supabase is connected, marketing pages read the seed directly at build time.
 */
import nicheCategoriesJson from "@/seed/niche_categories.json";
import nichesJson from "@/seed/niches.json";
import nicheExtrasJson from "@/seed/niche_extras.json";
import hookFamiliesJson from "@/seed/hook_families.json";
import hookTypesJson from "@/seed/hook_types.json";
import seasonsJson from "@/seed/seasons.json";
import hooksJson from "@/seed/hooks.json";
import type { HookGender, HookGoal, Platform } from "@/lib/labels";

export interface NicheCategory { slug: string; name_he: string; name_en: string; sort_order: number }
export interface Niche {
  slug: string; name_he: string; name_en: string; category_slug: string; icon: string;
  description_he: string; video_types_he: string[]; seasonal_angles_he: string[];
  compliance_flag: string; compliance_note_he: string | null; priority: 1 | 2 | 3; sort_order: number;
}
export interface HookFamily { slug: string; name_he: string; name_en: string; description_he: string; sort_order: number }
export interface HookType { slug: string; name_he: string; name_en: string; family_slug: string; description_he: string; example_he: string; sort_order: number }
export interface Season {
  slug: string; name_he: string; name_en: string; date_hint_he: string; publish_window_he: string;
  niche_slugs: string[]; is_quiet_day: boolean; note_he: string | null; sort_order: number;
}
export interface Hook {
  id: string; niche_slug: string | null; hook_type_slug: string; text_he: string; platforms: Platform[];
  goal: HookGoal; gender: HookGender; visual_direction_he: string; placeholders: string[];
  season_slug: string | null; compliance_note_he: string | null; is_featured: boolean;
}
type NicheExtra = { slug: string; short_name_he?: string | null; [k: string]: unknown };

export const nicheCategories = (nicheCategoriesJson as NicheCategory[]).slice().sort((a, b) => a.sort_order - b.sort_order);
export const niches = (nichesJson as Niche[]).filter((n) => n.slug !== "local-politics").sort((a, b) => a.sort_order - b.sort_order);
export const hookFamilies = (hookFamiliesJson as HookFamily[]).slice().sort((a, b) => a.sort_order - b.sort_order);
export const hookTypes = (hookTypesJson as HookType[]).slice().sort((a, b) => a.sort_order - b.sort_order);
export const seasons = (seasonsJson as Season[]).slice().sort((a, b) => a.sort_order - b.sort_order);
export const hooks = hooksJson as Hook[];

const extrasArray: NicheExtra[] = Array.isArray(nicheExtrasJson)
  ? (nicheExtrasJson as NicheExtra[])
  : Object.entries(nicheExtrasJson as Record<string, Omit<NicheExtra, "slug">>).map(([slug, v]) => ({ slug, ...v }));
const extras = new Map(extrasArray.map((e) => [e.slug, e]));

export const getNiche = (slug: string) => niches.find((n) => n.slug === slug);
export const getHookType = (slug: string) => hookTypes.find((t) => t.slug === slug);
export const getSeason = (slug: string) => seasons.find((s) => s.slug === slug);
export const getHook = (id: string) => hooks.find((h) => h.id === id);
export const nicheShortName = (n: Niche) => (extras.get(n.slug)?.short_name_he as string | undefined) ?? n.name_he;
export const nicheExtra = (slug: string) => extras.get(slug);
export const hooksForNiche = (slug: string) => hooks.filter((h) => h.niche_slug === slug);
export const hooksForType = (slug: string) => hooks.filter((h) => h.hook_type_slug === slug);
export const hooksForSeason = (slug: string) => hooks.filter((h) => h.season_slug === slug);
export const featuredHooks = () => hooks.filter((h) => h.is_featured);
export const launchNiches = () => niches.filter((n) => n.priority === 1);
