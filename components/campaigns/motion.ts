"use client";
import * as React from "react";
import { useReducedMotion } from "motion/react";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => mo.disconnect();
}

/** True when the OS asks for reduced motion OR the site toggle set [data-motion=reduce]. */
export function useCalmMotion(): boolean {
  const prefers = useReducedMotion();
  const attr = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.motion === "reduce",
    () => false,
  );
  return !!prefers || attr;
}
