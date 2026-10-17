"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { PhoneShell, ReelCaption, ReelOverlay, ReelScene } from "./reel-phone";
import { useInView, useMediaQuery, useMotionAllowed } from "./use-motion";
import { HERO_REELS, TYPING_REELS, type HeroReel } from "@/lib/mock/home";
import { DASHBOARD_SAMPLE } from "@/lib/mock/landing";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const H = LANDING.hero;

/** Fan geometry at design size (1000px stage); the whole stage scales per breakpoint via --s. */
const FAN = [
  { x: 395, y: 92, r: 8, w: 172, z: 1, d: 260, fd: 1400 },
  { x: 215, y: 36, r: 4, w: 206, z: 2, d: 130, fd: 700 },
  { x: 0, y: 0, r: 0, w: 252, z: 3, d: 0, fd: 0 },
  { x: -215, y: 36, r: -4, w: 206, z: 2, d: 130, fd: 1050 },
  { x: -395, y: 92, r: -8, w: 172, z: 1, d: 260, fd: 1750 },
] as const;

type Phase = "hold" | "delete" | "type";

/** Center phone: types real seed hooks one after another (static under reduced motion / off-screen). */
function TypingReel({ allowed }: { allowed: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [idx, setIdx] = React.useState(0);
  const [n, setN] = React.useState(TYPING_REELS[0]?.hook.length ?? 0);
  const [phase, setPhase] = React.useState<Phase>("hold");
  const reel = TYPING_REELS[idx] ?? HERO_REELS[2];
  const full = reel.hook;
  const active = allowed && inView && TYPING_REELS.length > 1;

  React.useEffect(() => {
    if (!active) return;
    let t: number;
    if (phase === "hold") t = window.setTimeout(() => setPhase("delete"), 2600);
    else if (phase === "delete") {
      t = window.setTimeout(() => {
        if (n > 0) setN(n - 1);
        else {
          setIdx((idx + 1) % TYPING_REELS.length);
          setPhase("type");
        }
      }, 16);
    } else {
      t = window.setTimeout(() => {
        if (n < full.length) setN(n + 1);
        else setPhase("hold");
      }, 46);
    }
    return () => window.clearTimeout(t);
  }, [active, phase, n, idx, full.length]);

  const shown = active ? full.slice(0, n) : full;
  return (
    <div ref={ref} className="contents">
      <PhoneShell>
        <ReelScene scene={reel.scene} />
        <ReelOverlay
          reel={reel}
          demoLabel={H.demo}
          viewsLabel={H.views}
          live={allowed}
          caption={
            <ReelCaption style="accent">
              {shown}
              <span aria-hidden className="ms-[0.6cqw] inline-block h-[0.95em] w-[0.7cqw] translate-y-[0.14em] rounded-full bg-ink animate-caret" />
            </ReelCaption>
          }
        />
      </PhoneShell>
    </div>
  );
}

function StaticReel({ reel }: { reel: HeroReel }) {
  return (
    <PhoneShell>
      <ReelScene scene={reel.scene} />
      <ReelOverlay reel={reel} demoLabel={H.demo} viewsLabel={H.views} caption={<ReelCaption text={reel.hook} style={reel.caption} />} />
    </PhoneShell>
  );
}

const badge =
  "fan-badge hidden items-center gap-3 rounded-[18px] bg-surface-1/85 p-3 pe-5 text-start shadow-[0_2px_6px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_24px_48px_-20px_color-mix(in_oklab,var(--color-ink)_35%,transparent),inset_0_0_0_1px_var(--color-frame)] backdrop-blur-xl md:flex";

/** Floating UI badges that tie the reels to the campaign story (decorative; numbers are the labelled sample). */
function FanBadges({ allowed }: { allowed: boolean }) {
  return (
    <>
      <div className={badge} style={{ "--x": "340px", "--y": "118px", "--d": "520ms", zIndex: 6 } as React.CSSProperties}>
        <div className={cn("flex items-center gap-3", allowed && "fan-float")} style={{ "--fd": "400ms" } as React.CSSProperties}>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
            <CheckCircle2 className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-small font-bold text-text">{H.badgeLive}</span>
            <span className="text-micro font-normal text-muted">{H.badgeLiveSub}</span>
          </span>
        </div>
      </div>
      <div className={badge} style={{ "--x": "-350px", "--y": "404px", "--d": "640ms", zIndex: 6 } as React.CSSProperties}>
        <div className={cn("flex items-center gap-3", allowed && "fan-float")} style={{ "--fd": "1300ms" } as React.CSSProperties}>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent-gradient text-ink">
            <MessageCircle className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="flex items-baseline gap-2">
              <bdi className="num text-h3 font-extrabold text-text">{DASHBOARD_SAMPLE.results}</bdi>
              <span className="rounded-full bg-surface-3 px-1.5 py-0.5 text-[0.7rem] font-semibold text-text-2">{H.demo}</span>
            </span>
            <span className="text-micro font-normal text-muted">{H.badgeLeads}</span>
          </span>
        </div>
      </div>
    </>
  );
}

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
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    ry.set(px * 9);
    rx.set(-py * 6);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div className="relative mt-14 md:mt-16">
      <ul className="sr-only">
        {HERO_REELS.map((r) => (
          <li key={r.key}>{`${r.nicheLabel}: ${r.hook} (${H.demo})`}</li>
        ))}
      </ul>
      <div
        aria-hidden
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="relative grid h-[calc(575px*var(--s))] justify-center [--s:.58] xs:[--s:.64] sm:[--s:.7] md:[--s:.8] lg:[--s:.92] xl:[--s:1]"
      >
        <div className="w-[1000px] origin-top" style={{ scale: "var(--s)" }}>
        <motion.div className="grid" style={{ rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0, transformPerspective: 1600 }}>
          {/* floor shadow */}
          <span
            className="pointer-events-none mx-auto mt-[500px] h-16 w-[760px] rounded-[50%] opacity-60 blur-2xl [grid-area:1/1]"
            style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-ink) 22%, transparent), transparent)" }}
          />
          <FanBadges allowed={allowed} />
          {HERO_REELS.map((reel, i) => {
            const f = FAN[i];
            return (
              <div
                key={reel.key}
                className="fan-phone"
                style={{ "--x": `${f.x}px`, "--y": `${f.y}px`, "--r": `${f.r}deg`, "--d": `${f.d}ms`, width: f.w, zIndex: f.z } as React.CSSProperties}
              >
                <div className={cn("fan-float", allowed ? "" : "[animation:none]")} style={{ "--fd": `${f.fd}ms` } as React.CSSProperties}>
                  {i === 2 ? <TypingReel allowed={allowed} /> : <StaticReel reel={reel} />}
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
