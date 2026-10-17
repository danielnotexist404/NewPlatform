"use client";
import * as React from "react";

/** Subscribe to a media query without setState-in-effect (SSR snapshot: `false`). */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}
function motionSnapshot() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.motion !== "reduce";
}

/** true when motion is allowed: neither the OS preference nor the global "עצירת אנימציות" toggle asks to reduce it. */
export function useMotionAllowed(): boolean {
  return React.useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
}

/** Observes an element and reports whether it intersects the viewport. */
export function useInView<T extends Element>(options?: IntersectionObserverInit): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  const { root, rootMargin, threshold } = options ?? {};
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { root, rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);
  return [ref, inView];
}

/** Cycles 0..count-1 every `ms` while `active` is true. */
export function useCycle(count: number, ms: number, active: boolean): number {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!active || count < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => window.clearInterval(t);
  }, [active, count, ms]);
  return i;
}
