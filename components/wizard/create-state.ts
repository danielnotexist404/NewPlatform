/**
 * State + pure helpers for the 3-screen create flow (founder feedback: minimal).
 * Screens: about (niche, goal, hook) → look (style, voice, music, format) → preview (cost + generate).
 */
import { getHook, getNiche, hooksForNiche } from "@/lib/data/seed";
import { mockScript } from "@/lib/generate/mock-script";
import type { GenAspect, ScriptRequest } from "@/lib/generate/types";
import { getProject, type SceneTone } from "@/lib/mock/projects";
import { MOCK_BUSINESS, MOCK_TREND, personalizeHook } from "@/lib/mock/workspace";
import { detectFactSlots, type FactSlot } from "./facts";
import { estimate } from "./estimate";

export type CreateGoal = "leads" | "sales" | "awareness" | "trust";
export type CreateStyle = "cinematic" | "ugc" | "text_motion";
export type CreateVoice = "male" | "female" | "none";
export type CreateMood = "energetic" | "warm" | "calm";
export type Screen = 0 | 1 | 2;

export interface HookChoice { key: string; text: string; source: "library" | "own" | "trend"; typeSlug: string | null }

export interface CreateState {
  nicheSlug: string;
  goal: CreateGoal;
  hook: HookChoice | null;
  ownText: string;
  style: CreateStyle;
  voice: CreateVoice;
  mood: CreateMood;
  aspect: GenAspect;
  durationSec: number;
  facts: Record<string, string>;
  trend: boolean;
}

export const GOALS: CreateGoal[] = ["leads", "sales", "awareness", "trust"];
export const STYLES: CreateStyle[] = ["cinematic", "ugc", "text_motion"];
export const MOODS: CreateMood[] = ["energetic", "warm", "calm"];
export const FORMATS: GenAspect[] = ["9:16", "1:1", "16:9"];

const toGoal = (g: string | null | undefined): CreateGoal => (g === "sales" || g === "awareness" || g === "trust" ? g : g === "engagement" ? "awareness" : "leads");

export function libraryHook(id: string): HookChoice | null {
  const h = getHook(id);
  return h ? { key: `lib:${h.id}`, text: personalizeHook(h.text_he), source: "library", typeSlug: h.hook_type_slug } : null;
}

/** Initial state + landing screen from the query (?niche, ?goal, ?hook, ?trend, ?project). */
export function initCreate(q: URLSearchParams): { state: CreateState; screen: Screen } {
  const state: CreateState = {
    nicheSlug: q.get("niche") && getNiche(q.get("niche")!) ? q.get("niche")! : MOCK_BUSINESS.nicheSlug,
    goal: toGoal(q.get("goal")),
    hook: null,
    ownText: "",
    style: "cinematic",
    voice: MOCK_BUSINESS.voiceGender,
    mood: "energetic",
    aspect: "9:16",
    durationSec: 30,
    facts: {},
    trend: false,
  };
  let screen: Screen = 0;
  const project = q.get("project") ? getProject(q.get("project")!) : null;
  const hookId = q.get("hook");
  if (project) {
    state.nicheSlug = project.nicheSlug;
    state.goal = toGoal(project.goal);
    state.aspect = project.primaryAspect;
    state.durationSec = project.durationSec <= 15 ? 15 : 30;
    if (project.hookText) {
      const lib = project.hookId ? libraryHook(project.hookId) : null;
      state.hook = { key: lib?.key ?? `p:${project.id}`, text: project.hookText, source: "library", typeSlug: lib?.typeSlug ?? null };
      screen = 2;
    }
  } else if (hookId) {
    const h = libraryHook(hookId);
    const seed = getHook(hookId);
    if (h && seed) {
      state.hook = h;
      if (seed.niche_slug) state.nicheSlug = seed.niche_slug;
      state.goal = toGoal(seed.goal);
    }
  } else if (q.get("trend")) {
    state.trend = true;
    state.goal = "awareness";
    state.durationSec = 15;
    state.hook = { key: "trend:0", text: MOCK_TREND.hooks[0], source: "trend", typeSlug: "pattern-interrupt" };
  }
  // smart default: the top suggestion is preselected, so "המשך" works right away
  if (!state.hook) state.hook = suggestedHooks(state, 0)[0] ?? null;
  return { state, screen };
}

/** Three suggestions (or the trend's three hooks); `page` rotates to the next three. */
export function suggestedHooks(s: CreateState, page: number): HookChoice[] {
  if (s.trend) return MOCK_TREND.hooks.map((text, i) => ({ key: `trend:${i}`, text, source: "trend" as const, typeSlug: "pattern-interrupt" }));
  const list = hooksForNiche(s.nicheSlug).filter((h) => !h.season_slug);
  const score = (h: (typeof list)[number]) => (h.goal === s.goal ? 2 : 0) + (h.is_featured ? 1 : 0);
  const sorted = [...list].sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
  if (!sorted.length) return [];
  const start = (page * 3) % sorted.length;
  const picked = [...sorted.slice(start), ...sorted.slice(0, start)].slice(0, 3);
  return picked.map((h) => ({ key: `lib:${h.id}`, text: personalizeHook(h.text_he), source: "library" as const, typeSlug: h.hook_type_slug }));
}

/** The hook the user will actually generate with (own text when "write your own" is selected). */
export function rawHook(s: CreateState): string {
  if (!s.hook) return "";
  return s.hook.source === "own" ? s.ownText.trim() : s.hook.text;
}

const CONFIRMED = MOCK_BUSINESS.facts.map((f) => f.value);

/** Open facts in the hook: placeholders must be filled; numbers are shown pre-filled so the owner confirms them. */
export function openFacts(s: CreateState): FactSlot[] {
  const text = rawHook(s);
  if (!text) return [];
  return detectFactSlots({ text, source: "hook", hookTypeSlug: s.hook?.typeSlug, confirmedValues: CONFIRMED }).filter((f) => !f.resolvedFrom);
}

export function factsComplete(s: CreateState): boolean {
  return openFacts(s).every((f) => f.kind === "numeric_claim" || (s.facts[f.id] ?? "").trim().length > 0);
}

/** Hook text with the user's answers applied (placeholders replaced, numbers corrected). */
export function finalHook(s: CreateState): string {
  let text = rawHook(s);
  for (const f of openFacts(s)) {
    const v = (s.facts[f.id] ?? "").trim();
    if (!v) continue;
    if (f.kind === "placeholder") text = text.replace(f.token, v);
    else if (f.number && v !== f.number) text = text.replace(f.number, v);
  }
  return text;
}

export function costOf(s: CreateState): number {
  return estimate({
    durationSec: s.durationSec,
    quality: "standard",
    visualMix: s.style === "text_motion" ? "images" : "smart",
    formats: 1,
    noVoice: s.voice === "none",
  }).credits;
}

export function scriptRequest(s: CreateState): ScriptRequest {
  const niche = getNiche(s.nicheSlug);
  return {
    niche: niche?.name_he ?? "עסק מקומי",
    nicheEn: niche?.name_en,
    goal: s.goal,
    hookText: finalHook(s),
    businessName: MOCK_BUSINESS.shortName,
    city: MOCK_BUSINESS.city,
    durationSec: s.durationSec,
    style: s.style,
    mood: s.mood,
  };
}

const TONES: SceneTone[] = ["ember", "gold", "rose", "violet", "night", "smoke"];
const ICONS = ["Flame", "Store", "Sparkles", "Star", "MessageCircle", "Camera"];
export const sceneTone = (i: number, n: number): SceneTone => (i === n - 1 ? "night" : TONES[i % TONES.length]);
export const sceneIcon = (i: number, n: number, nicheIcon?: string) => (i === n - 1 ? "MessageCircle" : i === 0 && nicheIcon ? nicheIcon : ICONS[i % ICONS.length]);

/** Draft scenes for the preview (same deterministic script the API falls back to). Keeps {placeholders} visible. */
export function draftScenes(s: CreateState) {
  const text = rawHook(s);
  if (!text) return [];
  const req = { ...scriptRequest(s), hookText: finalHook(s) || text };
  const scenes = mockScript(req);
  const icon = getNiche(s.nicheSlug)?.icon;
  return scenes.map((sc, i) => ({ id: `d${i}`, onscreen: sc.onscreen_text_he, vo: sc.vo_he, durationSec: sc.duration_sec, tone: sceneTone(i, scenes.length), icon: sceneIcon(i, scenes.length, icon) }));
}

export const CAPTION_FOR: Record<CreateStyle, "bold-pop" | "clean-box" | "poster"> = { cinematic: "bold-pop", ugc: "clean-box", text_motion: "poster" };
