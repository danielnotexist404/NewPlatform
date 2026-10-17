"use client";
import * as React from "react";

/** True when the OS asks for reduced motion OR the global "עצירת אנימציות" toggle set [data-motion=reduce]. */
function read(): boolean {
  if (typeof window === "undefined") return false;
  const os = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return os || document.documentElement.getAttribute("data-motion") === "reduce";
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  mq?.addEventListener?.("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    mq?.removeEventListener?.("change", cb);
    mo.disconnect();
  };
}

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, read, () => false);
}
