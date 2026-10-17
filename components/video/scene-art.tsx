import * as React from "react";
import type { SceneTone } from "@/lib/mock/projects";
import { NicheIcon } from "./niche-icon";
import { cn } from "@/lib/utils";

/**
 * Placeholder "footage": layered gradients in brand tokens over a black base, a large soft glyph and a vignette.
 * Media surfaces stay dark in both themes (they stand in for video frames).
 */
const mix = (token: string, pct: number) => `color-mix(in oklab, var(--color-${token}) ${pct}%, transparent)`;

export const TONE_BG: Record<SceneTone, string> = {
  ember: [
    `radial-gradient(90% 60% at 70% 105%, ${mix("primary", 70)}, transparent 62%)`,
    `radial-gradient(70% 50% at 15% 85%, ${mix("rose", 55)}, transparent 60%)`,
    `radial-gradient(80% 60% at 50% 0%, ${mix("violet", 22)}, transparent 70%)`,
  ].join(","),
  gold: [
    `radial-gradient(80% 55% at 35% 20%, ${mix("primary", 65)}, transparent 62%)`,
    `radial-gradient(70% 60% at 85% 95%, ${mix("lemon", 30)}, transparent 60%)`,
    `radial-gradient(60% 50% at 10% 90%, ${mix("rose", 25)}, transparent 60%)`,
  ].join(","),
  rose: [
    `radial-gradient(85% 60% at 75% 25%, ${mix("rose", 62)}, transparent 62%)`,
    `radial-gradient(70% 55% at 20% 95%, ${mix("primary", 40)}, transparent 60%)`,
  ].join(","),
  violet: [
    `radial-gradient(85% 60% at 25% 20%, ${mix("violet", 62)}, transparent 62%)`,
    `radial-gradient(70% 60% at 85% 95%, ${mix("rose", 35)}, transparent 60%)`,
  ].join(","),
  night: [
    `radial-gradient(60% 40% at 50% 30%, ${mix("primary", 45)}, transparent 65%)`,
    `radial-gradient(90% 70% at 50% 110%, ${mix("violet", 45)}, transparent 60%)`,
  ].join(","),
  smoke: [
    `radial-gradient(80% 60% at 50% 30%, ${mix("text-2", 28)}, transparent 65%)`,
    `radial-gradient(70% 60% at 80% 100%, ${mix("violet", 18)}, transparent 60%)`,
  ].join(","),
};

export function SceneArt({
  tone,
  icon,
  scale = 1,
  shift = 0,
  className,
  glyph = true,
  children,
}: {
  tone: SceneTone;
  icon?: string | null;
  scale?: number;
  shift?: number;
  className?: string;
  glyph?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black", className)} aria-hidden>
      <div
        className="absolute inset-[-6%] will-change-transform"
        style={{ backgroundImage: TONE_BG[tone], transform: `scale(${scale}) translate3d(${shift}%, ${-shift / 2}%, 0)` }}
      >
        {glyph && (
          <NicheIcon
            name={icon}
            strokeWidth={1}
            className="absolute inset-s-1/2 top-[38%] size-[46%] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 text-white opacity-[.13]"
          />
        )}
      </div>
      {/* horizontal light streaks + vignette */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, ${mix("black", 35)} 0%, transparent 22%, transparent 58%, ${mix("black", 78)} 100%)`,
        }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_80px_var(--color-black)] opacity-70" />
      {children}
    </div>
  );
}
