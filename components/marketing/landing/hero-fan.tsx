"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { useMediaQuery, useMotionAllowed } from "./use-motion";
import { HERO_REELS } from "@/lib/mock/home";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const H = LANDING.hero;

/** Fan geometry at design size (1100px stage); the whole stage scales per breakpoint via --s. */
const FAN = [
  { x: 430, y: 110, r: 9, w: 214, z: 1, d: 260, fd: 1400 },
  { x: 236, y: 44, r: 4.5, w: 252, z: 2, d: 130, fd: 700 },
  { x: 0, y: 0, r: 0, w: 300, z: 3, d: 0, fd: 0 },
  { x: -236, y: 44, r: -4.5, w: 252, z: 2, d: 130, fd: 1050 },
  { x: -430, y: 110, r: -9, w: 214, z: 1, d: 260, fd: 1750 },
] as const;

export function HeroFan() {
  const allowed = useMotionAllowed();
  const finePointer = useMediaQuery("(pointer: fine)");
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.6 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.6 });
  const tilt = allowed && finePointer;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 8);
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 5);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div className="relative mt-14 md:mt-20">
      <ul className="sr-only" aria-label={H.phonesLabel}>
        {HERO_REELS.map((r) => (
          <li key={r.key}>{`${r.nicheLabel}: ${r.hook} (דוגמה)`}</li>
        ))}
      </ul>
      <div
        aria-hidden
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="relative grid h-[calc(700px*var(--s))] justify-center [--s:.5] xs:[--s:.56] sm:[--s:.66] md:[--s:.76] lg:[--s:.9] xl:[--s:1]"
      >
        <div className="w-[1100px] origin-top" style={{ scale: "var(--s)" }}>
          <motion.div className="grid" style={{ rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0, transformPerspective: 1800 }}>
            <span
              className="pointer-events-none mx-auto mt-[610px] h-20 w-[860px] rounded-[50%] opacity-60 blur-2xl [grid-area:1/1]"
              style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-ink) 24%, transparent), transparent)" }}
            />
            <div
              className="fan-badge z-[6] hidden items-center gap-3 rounded-[20px] bg-surface-1/90 p-3 pe-5 text-start shadow-[0_2px_6px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_24px_48px_-20px_color-mix(in_oklab,var(--color-ink)_35%,transparent),inset_0_0_0_1px_var(--color-frame)] backdrop-blur-xl md:flex"
              style={{ "--x": "-330px", "--y": "596px", "--d": "640ms" } as React.CSSProperties}
            >
              <div className={cn("flex items-center gap-3", allowed && "fan-float")} style={{ "--fd": "600ms" } as React.CSSProperties}>
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-success/12 text-success">
                  <CheckCircle2 className="size-6" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-body font-bold text-text">{H.badgeLive}</span>
                  <span className="text-small font-normal text-muted">{H.badgeLiveSub}</span>
                </span>
              </div>
            </div>
            {HERO_REELS.map((reel, i) => {
              const f = FAN[i];
              return (
                <div
                  key={reel.key}
                  className="fan-phone"
                  style={{ "--x": `${f.x}px`, "--y": `${f.y}px`, "--r": `${f.r}deg`, "--d": `${f.d}ms`, width: f.w, zIndex: f.z } as React.CSSProperties}
                >
                  <div className={cn("fan-float", !allowed && "[animation:none]")} style={{ "--fd": `${f.fd}ms` } as React.CSSProperties}>
                    <ReelCard reel={reel} frame="phone" offset={i * 1.9} lite={i !== 2} decorative />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
