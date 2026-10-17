"use client";
import * as React from "react";
import { getHook, getHookType, hooksForNiche } from "@/lib/data/seed";
import type { Platform } from "@/lib/labels";
import {
  DRAFT_SCRIPT, WIZARD_STEPS, getProject,
  type Aspect, type CaptionPreset, type Goal, type MockProject, type MockScene, type Quality, type VideoType, type VisualMix, type VisualStyle, type WizardStep,
} from "@/lib/mock/projects";
import { MOCK_BUSINESS, MOCK_PLAN, MOCK_TRACKS, MOCK_TREND, MOCK_VOICES, personalizeHook, type AudienceGender, type MockService, type Register } from "@/lib/mock/workspace";
import { detectFactSlots, type FactAnswer, type FactSlot } from "./facts";
import { estimate } from "./estimate";

export type CtaType = "whatsapp" | "call" | "booking" | "link_in_bio" | "navigate" | "lead_form";
export interface SelectedHook { key: string; hookId: string | null; text: string; source: "library" | "ai" | "own" | "trend"; typeSlug: string | null }

export interface WizardData {
  projectId: string;
  title: string;
  business: { name: string; city: string; phone: string; whatsapp: string; usp: string; services: MockService[] };
  focusService: string;
  focusOther: string;
  notes: string;
  nicheSlug: string | null;
  otherNiche: string;
  videoType: VideoType;
  goal: Goal;
  durationSec: 15 | 30 | 45 | 60;
  platforms: Platform[];
  primaryAspect: Aspect;
  extraAspects: Aspect[];
  offerText: string;
  offerUntil: string;
  seasonSlug: string | null;
  cta: CtaType;
  ctaPrefill: string;
  audience: AudienceGender;
  register: Register;
  voiceGender: "female" | "male";
  abMode: boolean;
  hooks: SelectedHook[];
  aiHooksGenerated: number;
  factAnswers: Record<string, FactAnswer>;
  scriptState: "none" | "writing" | "ready";
  scriptHookKey: string | null;
  scenes: MockScene[];
  priceAttested: boolean;
  visualStyle: VisualStyle;
  visualMix: VisualMix;
  quality: Quality;
  uploads: string[];
  voiceId: string;
  speed: number;
  musicMode: "library" | "generate" | "none";
  mood: string;
  trackId: string;
  musicVolume: number;
  ducking: boolean;
  storyboard: "none" | "building" | "ready";
  captionPreset: CaptionPreset;
  captionPosition: "lower" | "middle";
  logoBug: boolean;
  intro: "none" | "logo_reveal" | "title_card";
  endCard: { headline: string; phone: boolean; whatsapp: boolean; website: boolean; address: boolean };
  aiLabel: boolean;
  fastPath: "idle" | "running" | "done";
  fastHighlight: boolean;
  trendSlug: string | null;
}

const RECOMMENDED: Record<VideoType, { goal: Goal; duration: 15 | 30 | 45 | 60 }> = {
  reel_hook: { goal: "leads", duration: 30 }, brand_promo: { goal: "trust", duration: 45 }, offer: { goal: "sales", duration: 30 },
  testimonial: { goal: "trust", duration: 30 }, launch: { goal: "awareness", duration: 30 }, recruiting: { goal: "leads", duration: 30 },
  explainer: { goal: "trust", duration: 45 },
};
export const recommendedFor = (t: VideoType) => RECOMMENDED[t];

export function hookFromSeed(id: string, source: SelectedHook["source"] = "library"): SelectedHook | null {
  const h = getHook(id);
  if (!h) return null;
  return { key: `lib:${h.id}`, hookId: h.id, text: personalizeHook(h.text_he), source, typeSlug: h.hook_type_slug };
}

/** Initial state from a mock project + /app/create query (Part 03 §6.0 landing rules). */
export function initWizard(project: MockProject, q: URLSearchParams): { data: WizardData; landing: WizardStep } {
  const type = (q.get("type") as VideoType | null) ?? project.videoType;
  const rec = RECOMMENDED[type] ?? RECOMMENDED.reel_hook;
  const isExisting = project.stage !== "draft" || project.wizardStep !== "business";
  const hooks: SelectedHook[] = [];
  if (project.hookId && project.hookText) {
    const h = getHook(project.hookId);
    hooks.push({ key: `lib:${project.hookId}`, hookId: project.hookId, text: project.hookText, source: "library", typeSlug: h?.hook_type_slug ?? null });
  }
  const factAnswers: Record<string, FactAnswer> = {};
  if (project.stage !== "draft" && hooks[0]) {
    for (const s of detectFactSlots({ text: hooks[0].text, source: "hook", hookTypeSlug: hooks[0].typeSlug })) factAnswers[`${hooks[0].key}|${s.id}`] = { action: "confirmed" };
  }
  const scriptReady = ["script", "storyboard", "voice", "captions", "assets", "render", "done", "failed"].includes(project.stage);
  const data: WizardData = {
    projectId: project.id,
    title: project.title,
    business: { name: MOCK_BUSINESS.name, city: MOCK_BUSINESS.city, phone: MOCK_BUSINESS.phone, whatsapp: MOCK_BUSINESS.whatsapp, usp: MOCK_BUSINESS.usp, services: MOCK_BUSINESS.services },
    focusService: MOCK_BUSINESS.services[0].name,
    focusOther: "",
    notes: "",
    nicheSlug: q.get("niche") ?? project.nicheSlug ?? MOCK_BUSINESS.nicheSlug,
    otherNiche: "",
    videoType: type,
    goal: isExisting ? project.goal : rec.goal,
    durationSec: isExisting ? project.durationSec : rec.duration,
    platforms: type === "brand_promo" ? ["youtube", "facebook"] : ["reels", "tiktok"],
    primaryAspect: isExisting ? project.primaryAspect : type === "brand_promo" ? "16:9" : "9:16",
    extraAspects: project.renderedFormats.filter((a) => a !== project.primaryAspect),
    offerText: type === "offer" ? "" : "",
    offerUntil: "",
    seasonSlug: q.get("season"),
    cta: "whatsapp",
    ctaPrefill: `היי, ראיתי את הסרטון על ${MOCK_BUSINESS.services[0].name} ואשמח לפרטים`,
    audience: MOCK_BUSINESS.audienceGender,
    register: MOCK_BUSINESS.register,
    voiceGender: MOCK_BUSINESS.voiceGender,
    abMode: (project.variants?.length ?? 0) > 1,
    hooks,
    aiHooksGenerated: 0,
    factAnswers,
    scriptState: scriptReady ? "ready" : "none",
    scriptHookKey: scriptReady ? hooks[0]?.key ?? null : null,
    scenes: scriptReady ? withHook(project.scenes.length ? project.scenes : DRAFT_SCRIPT, hooks[0]?.text) : [],
    priceAttested: project.stage === "done",
    visualStyle: project.style,
    visualMix: project.visualMix,
    quality: project.quality,
    uploads: [],
    voiceId: project.voiceName ? MOCK_VOICES.find((v) => v.name === project.voiceName)?.id ?? "v-ori" : "v-ori",
    speed: 1,
    musicMode: "library",
    mood: "אורבני",
    trackId: project.musicName ? MOCK_TRACKS.find((t) => t.name === project.musicName)?.id ?? "t-1" : "t-1",
    musicVolume: 1,
    ducking: true,
    storyboard: project.stage === "done" || project.stage === "failed" ? "ready" : "none",
    captionPreset: project.captionPreset,
    captionPosition: "lower",
    logoBug: true,
    intro: "none",
    endCard: { headline: project.endCardHeadline, phone: false, whatsapp: true, website: false, address: true },
    aiLabel: true,
    fastPath: "idle",
    fastHighlight: q.get("fast") === "1",
    trendSlug: q.get("trend"),
  };
  // projects past the script stage already had every fact decided
  if (scriptReady && project.stage !== "script") {
    for (const sl of scriptSlots(data)) data.factAnswers[`script|${sl.id}`] = { action: "confirmed" };
  }

  let landing: WizardStep = project.wizardStep ?? "business";
  const hookParam = q.get("hook");
  if (hookParam) {
    const h = hookFromSeed(hookParam);
    if (h) {
      data.hooks = [h];
      const seed = getHook(hookParam);
      if (seed?.niche_slug) data.nicheSlug = seed.niche_slug;
      if (seed) data.goal = seed.goal;
      landing = "hook";
    }
  } else if (data.trendSlug) {
    data.abMode = MOCK_PLAN.hookVariantsMax > 1;
    data.durationSec = 15;
    data.goal = "awareness";
    data.hooks = MOCK_TREND.hooks.slice(0, MOCK_PLAN.hookVariantsMax).map((text, i) => ({ key: `trend:${i}`, hookId: null, text, source: "trend", typeSlug: "pattern-interrupt" }));
    landing = "hook";
  } else if (q.get("niche") || q.get("type") || q.get("season")) {
    landing = "goal";
  } else if (q.get("fast") === "1") {
    landing = "business";
  }
  return { data, landing };
}

export function withHook(scenes: MockScene[], hookText?: string | null): MockScene[] {
  if (!hookText || scenes.length === 0) return scenes;
  return scenes.map((s, i) => (i === 0 ? { ...s, onscreen: shortOnscreen(hookText), vo: hookText } : s));
}
function shortOnscreen(text: string) {
  const first = text.split(/(?<=[.?!])\s/)[0];
  const words = first.split(/\s+/);
  return words.length > 8 ? words.slice(0, 8).join(" ") : first;
}

// ---------- validity (Part 03 §6.0 table) ----------

const CONFIRMED_VALUES = MOCK_BUSINESS.facts.map((f) => f.value);

export function hookSlots(d: WizardData): { hook: SelectedHook; slots: FactSlot[] }[] {
  return d.hooks.map((h) => ({ hook: h, slots: detectFactSlots({ text: h.text, source: "hook", hookTypeSlug: h.typeSlug, confirmedValues: CONFIRMED_VALUES }) }));
}
export function scriptSlots(d: WizardData): FactSlot[] {
  return d.scenes.flatMap((s, i) =>
    i === 0 ? [] : [s.onscreen, s.vo].flatMap((t) => detectFactSlots({ text: t, source: "script", beatIndex: i, confirmedValues: CONFIRMED_VALUES })),
  ).filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);
}
export const hookFactsOpen = (d: WizardData) =>
  hookSlots(d).reduce((a, { hook, slots }) => a + slots.filter((s) => !s.resolvedFrom && !d.factAnswers[`${hook.key}|${s.id}`]).length, 0);
export const scriptFactsOpen = (d: WizardData) => scriptSlots(d).filter((s) => !s.resolvedFrom && !d.factAnswers[`script|${s.id}`]).length;
export const hasPriceClaim = (d: WizardData) => d.scenes.some((s) => /₪|\{מחיר\}|שקל/.test(s.vo + s.onscreen));

export function stepValid(step: WizardStep, d: WizardData): boolean {
  switch (step) {
    case "business": return d.business.name.trim().length > 0;
    case "niche": return !!d.nicheSlug || d.otherNiche.trim().length > 0;
    case "goal": return d.platforms.length > 0 && (d.videoType !== "offer" || d.offerText.trim().length > 0);
    case "hook": return d.hooks.length > 0 && hookFactsOpen(d) === 0;
    case "script": return d.scriptState === "ready" && scriptFactsOpen(d) === 0 && (!hasPriceClaim(d) || d.priceAttested);
    case "style": return d.quality !== "premium" || MOCK_PLAN.id !== "starter";
    case "voice": return !!d.voiceId;
    case "music": return true;
    case "preview": return d.storyboard === "ready" && scriptFactsOpen(d) === 0 && (!hasPriceClaim(d) || d.priceAttested);
  }
}

/** Navigation gate: like stepValid, but open facts in the script can still be fixed later in "preview" (fast path, §6.11). */
export function stepNavOk(step: WizardStep, d: WizardData): boolean {
  if (step === "script") return d.scriptState === "ready";
  if (step === "preview") return true;
  return stepValid(step, d);
}

/** First step that blocks navigation; steps after it are not reachable. */
export function firstInvalid(d: WizardData): WizardStep | null {
  return WIZARD_STEPS.find((s) => !stepNavOk(s, d)) ?? null;
}
export function reachable(step: WizardStep, d: WizardData): boolean {
  const fi = firstInvalid(d);
  if (!fi) return true;
  return WIZARD_STEPS.indexOf(step) <= WIZARD_STEPS.indexOf(fi);
}

export function formatsOf(d: WizardData): Aspect[] {
  return [d.primaryAspect, ...d.extraAspects.filter((a) => a !== d.primaryAspect)];
}

export function costOf(d: WizardData, over: Partial<Pick<WizardData, "quality" | "visualMix" | "durationSec">> = {}) {
  return estimate({
    durationSec: over.durationSec ?? d.durationSec,
    quality: over.quality ?? d.quality,
    visualMix: over.visualMix ?? d.visualMix,
    formats: formatsOf(d).length,
    noVoice: d.voiceId === "none",
    musicMode: d.musicMode,
    variants: d.abMode ? d.hooks.length : 1,
  });
}

// ---------- context ----------

type Patch = Partial<WizardData> | ((d: WizardData) => Partial<WizardData>);
interface Ctx {
  data: WizardData;
  set: (p: Patch) => void;
  saveState: "idle" | "saving" | "saved";
  hookTypeName: (slug: string | null) => string;
}
const WizardCtx = React.createContext<Ctx | null>(null);

export function useWizard(): Ctx {
  const c = React.useContext(WizardCtx);
  if (!c) throw new Error("useWizard outside WizardProvider");
  return c;
}

export function WizardProvider({ initial, children }: { initial: WizardData; children: React.ReactNode }) {
  const [data, setData] = React.useState<WizardData>(initial);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const timer = React.useRef<number | undefined>(undefined);
  const set = React.useCallback((p: Patch) => {
    setData((d) => ({ ...d, ...(typeof p === "function" ? p(d) : p) }));
    setSaveState("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaveState("saved"), 800);
  }, []);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const value = React.useMemo<Ctx>(
    () => ({ data, set, saveState, hookTypeName: (slug) => (slug ? getHookType(slug)?.name_he ?? "" : "") }),
    [data, set, saveState],
  );
  return <WizardCtx.Provider value={value}>{children}</WizardCtx.Provider>;
}

export function getWizardProject(id: string) {
  return getProject(id);
}

/** Library hooks for the niche, filtered by goal first, featured first (Part 03 §6.4 "הוקים בשבילכם"). */
export function hooksForYou(d: WizardData) {
  const list = hooksForNiche(d.nicheSlug ?? MOCK_BUSINESS.nicheSlug).filter((h) => !h.season_slug);
  const score = (h: (typeof list)[number]) => (h.goal === d.goal ? 2 : 0) + (h.is_featured ? 1 : 0);
  return [...list].sort((a, b) => score(b) - score(a)).slice(0, 6);
}
