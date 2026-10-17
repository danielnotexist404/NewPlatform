"use client";
import * as React from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import type { ResolvedTile } from "@/lib/mock/landing";
import { ReelArt } from "./reel-tile";
import { useInView, useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.wall;

function Tile({ t, i }: { t: ResolvedTile; i: number }) {
  return (
    <ReelArt
      text={t.text}
      preset={t.preset}
      icon={t.icon}
      categorySlug={t.categorySlug}
      nicheLabel={t.nicheLabel}
      badge={T.demo}
      variant={i}
      progressDelay={(i * 1.7) % 6}
      className="w-full shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-2)]"
    />
  );
}

/**
 * VideoWall (Part 02 §3.3.5): decorative wall of CSS/SVG 9:16 tiles with real seed hooks.
 * Desktop: 3 vertical marquee columns (up / down / up, 45 s). Tablet: 2 columns. Mobile: one RTL horizontal marquee.
 * Pausable (button outside the aria-hidden wrapper), paused off-screen, static under reduced motion.
 */
export function VideoWall({ columns, mobile }: { columns: ResolvedTile[][]; mobile: ResolvedTile[] }) {
  const motion = useMotionAllowed();
  const [userPaused, setUserPaused] = React.useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0 });
  const paused = userPaused || !inView;

  return (
    <div ref={ref} className="relative md:absolute md:inset-0">
      <div aria-hidden className={cn("relative md:h-full", paused && "kd-paused")}>
        {/* projector glow behind the wall */}
        <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(55%_45%_at_50%_30%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_70%)] light:hidden" />

        {/* md+ : vertical columns */}
        <div className="hidden h-full grid-cols-2 gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:grid xl:grid-cols-3">
          {columns.map((col, ci) => (
            <div key={ci} className={cn("relative min-w-0", ci === 2 && "hidden xl:block", ci === 1 && "mt-16")}>
              <div
                className="flex animate-marquee-y flex-col gap-3 will-change-transform"
                style={
                  {
                    "--marquee-duration": `${45 + ci * 6}s`,
                    animationDirection: ci === 1 ? "reverse" : "normal",
                    animationDelay: `${-ci * 9}s`,
                  } as React.CSSProperties
                }
              >
                {[...col, ...col].map((t, i) => (
                  <Tile key={`${t.key}-${i}`} t={t} i={i + ci * 6} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* mobile: horizontal RTL marquee, tiles at 60% width */}
        <div className="-mx-4 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)] md:hidden">
          <div className="flex w-max animate-marquee gap-4 will-change-transform" style={{ "--marquee-duration": "48s" } as React.CSSProperties}>
            {[...mobile, ...mobile].map((t, i) => (
              <div key={`${t.key}-m-${i}`} className="w-[60vw] max-w-[280px] shrink-0">
                <Tile t={t} i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only">
        {T.srDescription}{" "}
        <Link href="/examples" className="focus:not-sr-only focus:underline">{T.srLink}</Link>
      </p>

      {motion && (
        <button
          type="button"
          aria-pressed={userPaused}
          onClick={() => setUserPaused((p) => !p)}
          className="glass absolute bottom-3 inset-e-3 z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-frame)] hover:bg-surface-2 max-md:bottom-[-3rem]"
        >
          {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {userPaused ? T.play : T.pause}
        </button>
      )}
    </div>
  );
}
