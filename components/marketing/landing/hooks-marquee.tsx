"use client";
import * as React from "react";
import { Pause, Play } from "lucide-react";
import { HookCard, type HookCardData } from "./hook-card";
import { useInView, useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.hooks;

function Row({ items, reverse, paused, motion }: { items: HookCardData[]; reverse?: boolean; paused: boolean; motion: boolean }) {
  return (
    <div
      className={cn(
        "group/row overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_6%,black_94%,transparent)]",
        !motion && "overflow-x-auto [mask-image:none] [scrollbar-width:thin]",
      )}
    >
      <div
        className={cn(
          "flex w-max gap-4 py-1",
          motion && "animate-marquee group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]",
          paused && "[animation-play-state:paused]",
        )}
        style={{ "--marquee-duration": reverse ? "80s" : "70s", animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}
      >
        {items.map((h) => (
          <HookCard key={h.id} hook={h} className="w-[300px] shrink-0" />
        ))}
        {/* duplicated copy for the seamless loop: hidden from AT and not focusable */}
        {motion && (
          <div aria-hidden inert className="flex gap-4">
            {items.map((h) => (
              <HookCard key={`${h.id}-dup`} hook={h} className="w-[300px] shrink-0" tabbable={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Two RTL marquee rows in opposite directions (Part 02 §3.9). Pauses on hover, focus-within, the button, off-screen and reduced motion. */
export function HooksMarquee({ rows }: { rows: [HookCardData[], HookCardData[]] }) {
  const motion = useMotionAllowed();
  const [userPaused, setUserPaused] = React.useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();
  const paused = userPaused || !inView;
  return (
    <div ref={ref} className="relative flex flex-col gap-3">
      <Row items={rows[0]} paused={paused} motion={motion} />
      <Row items={rows[1]} reverse paused={paused} motion={motion} />
      {motion && (
        <div className="container-marketing flex justify-end">
          <button
            type="button"
            aria-pressed={userPaused}
            onClick={() => setUserPaused((p) => !p)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-sm font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-border)] hover:bg-surface-3"
          >
            {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            {userPaused ? T.playMotion : T.pauseMotion}
          </button>
        </div>
      )}
    </div>
  );
}
