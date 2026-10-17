"use client";
import { useCallback, useSyncExternalStore } from "react";

/** localStorage `guided.camera.tips` (Part 03 allow-list): the camera tips were already shown. */
const KEY = "guided.camera.tips";
const listeners = new Set<() => void>();
let memory = false;

function read() {
  try {
    return window.localStorage.getItem(KEY) === "1" || memory;
  } catch {
    return memory;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useTipsSeen() {
  // Server snapshot "seen" so the card never flashes in the static shell; the client shows it when needed.
  const seen = useSyncExternalStore(subscribe, read, () => true);
  const markSeen = useCallback(() => {
    memory = true;
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l());
  }, []);
  return [seen, markSeen] as const;
}
