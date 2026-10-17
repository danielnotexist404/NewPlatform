"use client";
/**
 * Tiny external stores read with useSyncExternalStore, so server HTML and hydration agree
 * (server snapshot = neutral value) and no state is set inside effects.
 */
import * as React from "react";
import { todayIL, type Values } from "./text";
import { HOOK_PLACEHOLDERS } from "@/content/he/hooks";

/* ---------- URL query (filters) ---------- */
const urlListeners = new Set<() => void>();
function subscribeUrl(cb: () => void) {
  urlListeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    urlListeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}
export function useLocationSearch(): string {
  return React.useSyncExternalStore(subscribeUrl, () => window.location.search, () => "");
}
/** Replaces the query without navigation or scroll (Next.js syncs history.replaceState with its router). */
export function replaceSearch(params: URLSearchParams) {
  const s = params.toString();
  const url = `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);
  urlListeners.forEach((l) => l());
}

/* ---------- Search draft (what is typed before the debounced URL write) ---------- */
let draft: string | null = null;
const draftListeners = new Set<() => void>();
function subscribeDraft(cb: () => void) {
  draftListeners.add(cb);
  return () => draftListeners.delete(cb);
}
export function useSearchDraft(): string | null {
  return React.useSyncExternalStore(subscribeDraft, () => draft, () => null);
}
export function setSearchDraft(v: string | null) {
  if (draft === v) return;
  draft = v;
  draftListeners.forEach((l) => l());
}

/* ---------- Today (Israel time) ---------- */
const noop = () => () => {};
/** "YYYY-MM-DD" on the client, null during prerender and hydration. */
export function useToday(): string | null {
  return React.useSyncExternalStore(noop, () => todayIL(), () => null);
}

/* ---------- Personalization (`hook_personalize_v1`, Part 02 §5.3) ---------- */
const KEY = "hook_personalize_v1";
const EMPTY: Values = Object.freeze({}) as Values;
let values: Values = EMPTY;
let loaded = false;
const pListeners = new Set<() => void>();

const ALLOWED = new Set<string>(HOOK_PLACEHOLDERS);
function sanitize(raw: unknown): Values {
  const out: Values = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (ALLOWED.has(k) && typeof v === "string") out[k] = v.slice(0, 80);
  }
  return out;
}
function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) values = sanitize((JSON.parse(raw) as { values?: unknown }).values);
  } catch {
    /* storage blocked: session only */
  }
}
function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ values, ts: Date.now() }));
  } catch {
    /* storage blocked: session only */
  }
}
function emit() {
  pListeners.forEach((l) => l());
}
function subscribeP(cb: () => void) {
  pListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    pListeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function getValues() {
  load();
  return values;
}
export function usePersonalization(): Values {
  return React.useSyncExternalStore(subscribeP, getValues, () => EMPTY);
}
export function setPersonalValue(name: string, value: string) {
  load();
  const next = { ...values };
  if (value) next[name] = value.slice(0, 80);
  else delete next[name];
  values = next;
  persist();
  emit();
}
export function clearPersonalization() {
  values = {};
  persist();
  emit();
}
