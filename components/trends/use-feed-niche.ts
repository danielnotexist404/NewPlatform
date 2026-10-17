"use client";
import { useCallback, useSyncExternalStore } from "react";

/** Last niche picked in the trends feed — localStorage `trends.feed.niche` (Part 03 allow-list). */
const KEY = "trends.feed.niche";
const listeners = new Set<() => void>();
let memory: string | null = null;

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStoredNiche(fallback: string, valid: (slug: string) => boolean) {
  const stored = useSyncExternalStore(subscribe, read, () => null);
  const value = stored && valid(stored) ? stored : fallback;
  const setValue = useCallback((slug: string) => {
    memory = slug;
    try {
      window.localStorage.setItem(KEY, slug);
    } catch {
      /* storage unavailable: keep the in-memory value */
    }
    listeners.forEach((l) => l());
  }, []);
  return [value, setValue] as const;
}
