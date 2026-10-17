"use client";
import * as React from "react";

/**
 * One observer for every `.reveal` element on the page: sets `data-in` once it scrolls into view.
 * The hidden state only applies when JS runs (`:root[data-js]`) and never under reduced motion (globals.css).
 */
export function RevealObserver() {
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not([data-in])"));
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
