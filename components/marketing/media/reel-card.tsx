import * as React from "react";
import { Eye, Heart, MessageCircle, Send } from "lucide-react";
import { NicheIcon } from "@/components/marketing/landing/niche-icon";
import { PhoneFrame } from "./phone-frame";
import { PropArt } from "./props";
import { GRAIN, SCENES, tint } from "./scenes";
import type { ReelData } from "./reel-data";
import s from "./media.module.css";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 1 });
const MAX_WORDS = 13;

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/** The animated "footage": Ken Burns scene, drifting light, a floating product shot, light sweep and grain. */
export function ReelFootage({ reel, uid, offset = 0, propClassName, still = false }: { reel: Pick<ReelData, "scene" | "prop">; uid: string; offset?: number; propClassName?: string; still?: boolean }) {
  const sc = SCENES[reel.scene];
  const a = (cls: string | undefined) => (still ? undefined : cls);
  const off = { "--off": `${-offset}s` } as Vars;
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={off}>
      <div className={cn("absolute -inset-[4%]", a(s.kenburns))}>
        <div className="absolute inset-0" style={{ backgroundImage: sc.base }} />
        <span className={cn("absolute top-[8%] inset-s-[-10%] aspect-square w-[70%] rounded-full blur-[14cqw]", a(s.driftA))} style={{ background: sc.blobs[0] }} />
        <span className={cn("absolute top-[34%] inset-e-[-14%] aspect-square w-[60%] rounded-full blur-[12cqw]", a(s.driftB))} style={{ background: sc.blobs[1] }} />
        {/* floor plane */}
        <div
          className="absolute inset-x-0 bottom-0 h-[36%]"
          style={{ backgroundImage: sc.floor, maskImage: "linear-gradient(180deg, transparent, #000 28%)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 28%)" }}
        />
        {/* product shot */}
        <div className={cn("absolute inset-x-0 bottom-[17%] mx-auto w-[64%]", propClassName)}>
          <span
            className={cn("absolute inset-x-[8%] bottom-[2%] h-[9%] rounded-[50%] blur-[2.4cqw]", a(s.propShadow))}
            style={{ background: tint("ink", 70) }}
          />
          <div className="absolute inset-[-12%] rounded-full blur-[10cqw] opacity-60" style={{ background: `radial-gradient(closest-side, ${sc.rim}, transparent)` }} />
          <PropArt name={reel.prop} uid={uid} className={cn("relative block h-auto w-full drop-shadow-[0_4cqw_5cqw_rgb(0_0_0/.35)]", a(s.prop))} />
        </div>
      </div>
      <span
        className={cn("absolute -inset-y-[20%] inset-s-0 w-[45%] opacity-50", still ? "hidden" : s.sweep)}
        style={{ background: `linear-gradient(90deg, transparent, ${tint("paper", 26)}, transparent)` }}
      />
      <span className="absolute inset-0 opacity-[.16] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <span className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${tint("ink", 45)} 0%, transparent 22%, transparent 66%, ${tint("ink", 70)} 100%)` }} />
    </div>
  );
}

/** Hebrew caption that builds word by word (static under reduced motion). */
export function ReelWords({ text, style, highlight, loop, offset = 0, className }: { text: string; style: ReelData["caption"]; highlight?: number; loop: number; offset?: number; className?: string }) {
  const all = text.split(/\s+/).filter(Boolean);
  const words = all.length > MAX_WORDS ? [...all.slice(0, MAX_WORDS - 1), `${all[MAX_WORDS - 1]}…`] : all;
  const hl = highlight ?? (words.length > 3 ? Math.min(words.length - 1, 2) : -1);
  const step = Math.min(170, Math.round(2600 / Math.max(words.length, 1)));
  return (
    <p
      className={cn(
        "flex flex-wrap content-center gap-x-[1.8cqw] gap-y-[0.6cqw]",
        "text-[8cqw] leading-[1.18]",
        "font-black",
        className,
      )}
      style={{ "--loop": `${loop}s`, "--step": `${step}ms`, "--off": `${-offset}s` } as Vars}
    >
      {words.map((w, i) => {
        const isHl = i === hl;
        return (
          <span
            key={i}
            className={cn(
              s.word,
              isHl && s.pop,
              "text-paper [text-shadow:0_0.5cqw_2.6cqw_rgb(0_0_0/.6)]",
              isHl && style === "shadow" && "text-lemon",
              isHl && style === "box" && "rounded-[1.4cqw] bg-accent-gradient px-[1.6cqw] text-ink [text-shadow:none]",
              isHl && style === "accent" && "rounded-[1.4cqw] bg-paper px-[1.6cqw] text-ink [text-shadow:none]",
            )}
            style={{ "--i": i } as Vars}
          >
            {w}
          </span>
        );
      })}
    </p>
  );
}

/** Story progress bars only (for tiles in other formats). */
export function ReelChromeBar({ loop, offset = 0 }: { loop: number; offset?: number }) {
  return (
    <div className="absolute inset-x-[5cqw] top-[5cqw] flex gap-[1.2cqw]" dir="ltr" style={{ "--loop": `${loop}s`, "--off": `${-offset}s` } as Vars}>
      <span className="h-[0.9cqw] flex-1 rounded-full bg-paper" />
      <span className="h-[0.9cqw] flex-1 overflow-hidden rounded-full bg-paper/30">
        <span className={cn("block h-full w-full rounded-full bg-paper", s.progress)} />
      </span>
      <span className="h-[0.9cqw] flex-1 rounded-full bg-paper/30" />
    </div>
  );
}

export function viewsLabel(viewsK: number) {
  return `${nf.format(viewsK)} אלף צפיות`;
}

/** Reel UI chrome over the footage: story progress, handle, side rail, niche badge and a sample views counter. */
function ReelChrome({ reel, loop, offset, lite, children }: { reel: ReelData; loop: number; offset: number; lite: boolean; children: React.ReactNode }) {
  const vars = { "--loop": `${loop}s`, "--off": `${-offset}s` } as Vars;
  return (
    <div aria-hidden className="absolute inset-0 flex flex-col px-[5cqw] pb-[5cqw] pt-[12cqw] text-paper" style={vars}>
      <div className="flex gap-[1.2cqw]" dir="ltr">
        <span className="h-[0.9cqw] flex-1 rounded-full bg-paper" />
        <span className="h-[0.9cqw] flex-1 overflow-hidden rounded-full bg-paper/30">
          <span className={cn("block h-full w-full rounded-full bg-paper", s.progress)} />
        </span>
        <span className="h-[0.9cqw] flex-1 rounded-full bg-paper/30" />
      </div>
      {!lite && (
        <div className="mt-[3.4cqw] flex items-center gap-[2cqw] text-[3.6cqw] font-semibold">
          <span className="inline-flex size-[7.5cqw] shrink-0 items-center justify-center rounded-full bg-accent-gradient text-ink ring-[0.5cqw] ring-paper/70">
            <NicheIcon name={reel.icon} className="size-[4cqw]" strokeWidth={2.4} />
          </span>
          <span className="truncate">{reel.nicheLabel || "העסק שלכם"}</span>
          {reel.sponsored && <span className="shrink-0 font-normal opacity-80">· ממומן</span>}
        </div>
      )}

      <div className="mt-[7cqw] pe-[9cqw]">{children}</div>

      {!lite && (
        <div className="absolute inset-e-[3.4cqw] bottom-[22cqw] flex flex-col items-center gap-[4.4cqw] text-[2.8cqw] font-semibold">
          <span className="flex flex-col items-center gap-[0.6cqw]">
            <Heart className={cn("size-[6.6cqw] fill-current", s.like)} strokeWidth={0} />
          </span>
          <MessageCircle className="size-[6.4cqw]" strokeWidth={2.2} />
          <Send className="size-[6.4cqw]" strokeWidth={2.2} />
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-[2cqw]">
        <span className="inline-flex min-w-0 items-center gap-[1.6cqw] rounded-full bg-ink/45 px-[3cqw] py-[1.6cqw] text-[3.5cqw] font-semibold backdrop-blur-md">
          <NicheIcon name={reel.icon} className="size-[4cqw] shrink-0" />
          <span className="truncate">{reel.nicheLabel || "דוגמה"}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-[1.2cqw] text-[3.3cqw] font-semibold">
          <Eye className="size-[4cqw]" />
          <span>{viewsLabel(reel.viewsK)}</span>
          <span className="rounded-full bg-paper/90 px-[1.8cqw] py-[0.3cqw] text-[2.7cqw] font-bold text-ink">דוגמה</span>
        </span>
      </div>
    </div>
  );
}

export interface ReelCardProps {
  reel: ReelData;
  /** "phone": inside a phone body · "tile": rounded 9:16 card · "bare": fills its parent */
  frame?: "phone" | "tile" | "bare";
  /** Seconds to shift every loop by, so neighbouring cards are out of sync */
  offset?: number;
  /** Hide handle + side rail (small thumbnails) */
  lite?: boolean;
  className?: string;
  /** Unique suffix when the same reel is rendered twice on a page */
  instance?: string;
  /** Visually hidden accessible name (defaults to the hook) */
  label?: string;
  decorative?: boolean;
}

/**
 * ReelCard — a looping CSS/SVG "video": animated footage, Hebrew caption appearing word by word,
 * story progress bar, niche badge and an illustrative views counter (always marked "דוגמה").
 * Server-safe (no hooks); every animation stops under reduced motion.
 */
export function ReelCard({ reel, frame = "tile", offset = 0, lite = false, className, instance = "", label, decorative = false }: ReelCardProps) {
  const words = reel.hook.split(/\s+/).filter(Boolean).length;
  const loop = Math.max(6, Math.min(9, 4.2 + words * 0.32));
  const uid = `${reel.key}${instance}`;
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": label ?? `סרטון לדוגמה${reel.nicheLabel ? `, ${reel.nicheLabel}` : ""}: ${reel.hook}` };

  const screen = (
    <>
      <ReelFootage reel={reel} uid={uid} offset={offset} />
      <ReelChrome reel={reel} loop={loop} offset={offset} lite={lite}>
        <ReelWords text={reel.hook} style={reel.caption} highlight={reel.highlight} loop={loop} offset={offset} />
      </ReelChrome>
    </>
  );

  if (frame === "phone") {
    return (
      <div {...a11y} className={className}>
        <PhoneFrame>{screen}</PhoneFrame>
      </div>
    );
  }
  if (frame === "bare") {
    return (
      <div {...a11y} className={cn("@container absolute inset-0 overflow-hidden bg-ink", className)}>
        {screen}
      </div>
    );
  }
  return (
    <div
      {...a11y}
      className={cn(
        "@container relative isolate aspect-[9/16] overflow-hidden rounded-[22px] bg-ink shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--color-ink)_55%,transparent),inset_0_0_0_1px_var(--color-frame)]",
        className,
      )}
    >
      {screen}
    </div>
  );
}
