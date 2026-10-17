import * as React from "react";
import {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap, HandHeart,
  Hammer, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap, Rocket, Scale, Scissors,
  ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella, UtensilsCrossed, Wrench, Clapperboard,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap, HandHeart,
  Hammer, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap, Rocket, Scale, Scissors,
  ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella, UtensilsCrossed, Wrench,
};

/** Lucide icon for a niche `icon` field from the seed (fallback: a clapperboard). */
export function nicheIcon(name: string | undefined | null): LucideIcon {
  return (name && ICONS[name]) || Clapperboard;
}

export type ReelTone = "gold" | "rose" | "violet" | "success" | "lemon";

const TONES: Record<ReelTone, [string, string]> = {
  gold: ["var(--color-primary)", "var(--color-rose)"],
  rose: ["var(--color-rose)", "var(--color-violet)"],
  violet: ["var(--color-violet)", "var(--color-primary)"],
  success: ["var(--color-success)", "var(--color-violet)"],
  lemon: ["var(--color-lemon)", "var(--color-rose)"],
};

export function toneFor(key: string): ReelTone {
  const all: ReelTone[] = ["gold", "rose", "violet", "success", "lemon"];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return all[h % all.length];
}

const ASPECT: Record<"9:16" | "1:1" | "16:9", string> = { "9:16": "aspect-reel", "1:1": "aspect-square", "16:9": "aspect-wide" };

/** "0:30" — durations are always LTR. */
export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Splits the hook so one word (the highlight) can get the gold "bold-pop" box. */
function HookText({ text, highlight, size }: { text: string; highlight?: string; size: "sm" | "md" | "lg" }) {
  const parts = highlight && text.includes(highlight) ? text.split(highlight) : null;
  const cls = cn(
    "font-extrabold leading-[1.18] text-white [text-shadow:0_2px_0_rgb(0_0_0/.55),0_4px_18px_rgb(0_0_0/.5)] [text-wrap:balance]",
    size === "sm" && "text-[15px]",
    size === "md" && "text-[19px] md:text-[21px]",
    size === "lg" && "text-[24px] md:text-[30px]",
  );
  const box = "rounded-[6px] bg-primary px-1.5 text-on-primary [text-shadow:none] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";
  return (
    <p className={cls} dir="rtl">
      {parts ? (
        <>
          {parts[0]}
          <span className={box}>{highlight}</span>
          {parts.slice(1).join(highlight)}
        </>
      ) : (
        text
      )}
    </p>
  );
}

export interface ReelArtProps {
  aspect?: "9:16" | "1:1" | "16:9";
  tone?: ReelTone;
  icon?: LucideIcon;
  hook?: string;
  highlight?: string;
  /** Hook position: top third (Part 01 §16.3 safe zone) or centre. */
  hookPosition?: "top" | "center";
  topStart?: React.ReactNode;
  topEnd?: React.ReactNode;
  bottomStart?: React.ReactNode;
  bottomEnd?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Extra overlay art (trend overlays, UI mocks). */
  children?: React.ReactNode;
  className?: string;
  /** Decorative by default; pass a label to expose it as an image. */
  label?: string;
}

/**
 * CSS-only 9:16 (or 1:1 / 16:9) "video frame" used until real posters exist (Part 01 §15.2).
 * Always looks like a dark video frame, in both themes.
 */
export function ReelArt({
  aspect = "9:16",
  tone = "gold",
  icon: Icon = Clapperboard,
  hook,
  highlight,
  hookPosition = "top",
  topStart,
  topEnd,
  bottomStart,
  bottomEnd,
  size = "md",
  children,
  className,
  label,
}: ReelArtProps) {
  const [a, b] = TONES[tone];
  return (
    <div
      className={cn("frame-tile relative isolate bg-black text-white", ASPECT[aspect], className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* light */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(90% 55% at 85% 8%, color-mix(in oklab, ${a} 58%, transparent), transparent 66%), radial-gradient(85% 55% at 8% 96%, color-mix(in oklab, ${b} 46%, transparent), transparent 70%), linear-gradient(168deg, color-mix(in oklab, ${a} 20%, var(--color-black)), var(--color-black) 72%)`,
        }}
      />
      {/* subject glyph */}
      <Icon
        aria-hidden
        strokeWidth={1.1}
        className={cn(
          "absolute -z-10 text-white/[.13]",
          aspect === "16:9" ? "inset-e-[8%] top-1/2 size-[46%] -translate-y-1/2" : "inset-s-1/2 top-[52%] size-[62%] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2",
        )}
      />
      {/* light leak + scanlines */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_38%,rgb(255_255_255/.07)_46%,transparent_56%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/.025)_0_1px,transparent_1px_3px)]" />

      {hook && (
        <div className={cn("absolute inset-x-[9%] text-center", hookPosition === "top" ? "top-[17%]" : "top-1/2 -translate-y-1/2")}>
          <HookText text={hook} highlight={highlight} size={size} />
        </div>
      )}

      {children}

      {(bottomStart || bottomEnd) && (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/.6),transparent_34%)]" />
      )}
      {topStart && <div className="absolute inset-s-2.5 top-2.5 max-w-[70%]">{topStart}</div>}
      {topEnd && <div className="absolute inset-e-2.5 top-2.5">{topEnd}</div>}
      {bottomStart && <div className="absolute inset-s-2.5 bottom-2.5 max-w-[70%]">{bottomStart}</div>}
      {bottomEnd && <div className="absolute inset-e-2.5 bottom-2.5">{bottomEnd}</div>}
    </div>
  );
}

/** Chip used on top of the art (dark glass, readable on any frame). */
export function ArtChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1 truncate rounded-xs bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm", className)}>
      {children}
    </span>
  );
}

export function DurationChip({ sec }: { sec: number }) {
  return (
    <ArtChip className="num">
      <bdi dir="ltr">{formatDuration(sec)}</bdi>
    </ArtChip>
  );
}
