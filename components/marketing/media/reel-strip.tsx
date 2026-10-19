import * as React from "react";
import { ReelCard } from "./reel-card";
import type { ReelData } from "./reel-data";
import s from "./media.module.css";
import { cn } from "@/lib/utils";

/**
 * Endless strip of looping reel cards. Pauses on hover/focus; under reduced motion it stops and
 * becomes a normal horizontal scroller (the duplicate copy is hidden).
 */
export function ReelStrip({ reels, label, className, cardClassName, seconds = 70 }: { reels: ReelData[]; label: string; className?: string; cardClassName?: string; seconds?: number }) {
  const card = cn("w-[200px] shrink-0 md:w-[240px]", cardClassName);
  return (
    <div className={cn("mask-fade-x overflow-hidden motion-reduce:overflow-x-auto reduced:overflow-x-auto", className)}>
      <div
        className={cn("flex w-max gap-5 py-6", s.strip)}
        style={{ "--strip-dur": `${seconds}s`, "--gap": "20px" } as React.CSSProperties}
      >
        <ul aria-label={label} className="flex gap-5">
          {reels.map((r, i) => (
            <li key={r.key} className={card}>
              <ReelCard reel={r} offset={i * 1.7} />
            </li>
          ))}
        </ul>
        <ul aria-hidden className="flex gap-5 motion-reduce:hidden reduced:hidden">
          {reels.map((r, i) => (
            <li key={r.key} className={card}>
              <ReelCard reel={r} offset={i * 1.7 + 0.8} instance="-b" decorative />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
