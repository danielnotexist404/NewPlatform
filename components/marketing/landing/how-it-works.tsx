"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "./phone-frame";
import { HOW_SCREENS } from "./how-screens";
import { useMediaQuery, useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.how;

function focusHero() {
  const hero = document.getElementById("hero");
  hero?.scrollIntoView({ behavior: "smooth", block: "start" });
  const first = hero?.querySelector<HTMLInputElement>('input[type="radio"]');
  window.setTimeout(() => first?.focus({ preventScroll: true }), 400);
}

/**
 * HowItWorks (Part 02 §3.6). Desktop with motion: the phone sticks at the end side and its screen follows the
 * step in the middle of the viewport (CSS sticky + IntersectionObserver, 320ms crossfade).
 * Mobile / reduced motion: three stacked cards, each with its own static screen.
 */
export function HowItWorks() {
  const desktop = useMediaQuery("(min-width: 64rem)");
  const motion = useMotionAllowed();
  const pinned = desktop && motion;
  const [active, setActive] = React.useState(0);
  const stepRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  React.useEffect(() => {
    if (!pinned) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pinned]);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-12">
      <ol className="flex flex-col gap-4 lg:col-span-6 lg:gap-0">
        {T.steps.map((s, i) => {
          const Screen = HOW_SCREENS[i];
          const on = !pinned || active === i;
          return (
            <li
              key={s.title}
              data-step={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={cn(
                "flex flex-col gap-5 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-opacity duration-[var(--duration-panel)]",
                pinned && "min-h-[62vh] justify-center bg-transparent p-0 shadow-none",
                pinned && !on && "opacity-35",
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-full font-display text-3xl leading-none transition-colors",
                    on ? "bg-primary text-on-primary" : "bg-surface-2 text-text-2",
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="text-h3 text-text">
                  <span className="sr-only">{`צעד ${i + 1}: `}</span>
                  {s.title}
                </h3>
              </div>
              <p className="text-body-lg max-w-lg text-text-2">{s.text}</p>
              {!pinned && (
                <div aria-hidden className="pt-2">
                  <PhoneFrame className="max-w-[220px]" glow={false}>
                    <Screen />
                  </PhoneFrame>
                </div>
              )}
            </li>
          );
        })}
        <li className={cn("list-none", pinned ? "pb-[20vh]" : "pt-2")}>
          <Button variant="secondary" size="lg" onClick={focusHero} data-cta-location="how_it_works">
            {T.cta}
          </Button>
        </li>
      </ol>
      {pinned && (
        <div className="lg:col-span-6" aria-hidden>
          <div className="sticky top-[calc(var(--header-h)+5vh)] flex h-[80vh] items-center justify-center">
            <PhoneFrame className="max-w-[300px]">
              <div className="relative">
                {HOW_SCREENS.map((Screen, i) => (
                  <div
                    key={i}
                    className={cn(
                      "transition-opacity duration-[var(--duration-panel)]",
                      i === 0 ? "relative" : "absolute inset-0",
                      active === i ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Screen />
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}
    </div>
  );
}
