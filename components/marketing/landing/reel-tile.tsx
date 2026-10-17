import { Heart, MessageCircle, Send } from "lucide-react";
import type { CaptionPreset } from "@/lib/mock/landing";
import { NicheIcon, categoryTones } from "./niche-icon";
import { cn } from "@/lib/utils";

const LATIN_OR_NUM = /[A-Za-z0-9₪%]/;

/** Hook text with word-level styling per caption preset. Latin/number tokens are bidi-isolated. */
export function CaptionText({ text, preset, className }: { text: string; preset: CaptionPreset; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const active = Math.min(words.length - 1, Math.max(0, Math.floor(words.length / 3)));
  const sungUntil = Math.ceil(words.length * 0.55);
  const nodes = words.map((w, i) => {
    const content = LATIN_OR_NUM.test(w) ? <bdi>{w}</bdi> : w;
    const on = preset === "karaoke" ? i < sungUntil : i === active;
    const cls = preset === "karaoke" ? (on ? "kd-sung" : undefined) : on ? "kd-on" : undefined;
    return (
      <span key={i}>
        <span className={cls}>{content}</span>
        {i < words.length - 1 ? " " : null}
      </span>
    );
  });
  const boxed = preset === "clean-box" || preset === "soft";
  return (
    <p className={cn("kd-cap", `kd-cap-${preset}`, className)} dir="rtl">
      {boxed ? <span>{nodes}</span> : nodes}
    </p>
  );
}

export interface ReelArtProps {
  text: string;
  preset: CaptionPreset;
  icon: string;
  categorySlug: string;
  nicheLabel?: string;
  badge?: string;
  aspect?: "reel" | "square" | "wide";
  variant?: number;
  /** Reel UI (side actions + playback bar). */
  chrome?: boolean;
  progressDelay?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A styled "video" poster made only of CSS/SVG: gradient set, light streak, niche icon silhouette,
 * Hebrew hook overlay in one of the six caption presets, niche chip (top-start) and demo badge (bottom-start).
 * Decorative by default — callers hide it from assistive tech and describe it in text.
 */
export function ReelArt({
  text, preset, icon, categorySlug, nicheLabel, badge, aspect = "reel", variant = 0, chrome = true, progressDelay = 0, className, children,
}: ReelArtProps) {
  const [c1, c2] = categoryTones(categorySlug);
  const v = variant % 4;
  const glowA = ["30% 18%", "75% 22%", "50% 10%", "20% 40%"][v];
  const glowB = ["80% 88%", "20% 80%", "70% 70%", "85% 95%"][v];
  const iconPos = [
    "inset-x-0 bottom-[14%] mx-auto w-[62%]",
    "inset-s-[6%] bottom-[10%] w-[58%]",
    "inset-e-[4%] bottom-[18%] w-[56%]",
    "inset-x-0 bottom-[20%] mx-auto w-[52%]",
  ][v];
  const capPos =
    preset === "news" ? "inset-x-[6%] top-[62%]" : aspect === "wide" ? "inset-x-[10%] top-[28%]" : aspect === "square" ? "inset-x-[8%] top-[22%]" : "inset-x-[7%] top-[20%]";
  return (
    <div
      className={cn(
        "kd-reel frame-tile relative isolate overflow-hidden bg-black text-white select-none",
        aspect === "reel" ? "aspect-reel" : aspect === "square" ? "aspect-square" : "aspect-wide",
        className,
      )}
      style={
        {
          "--kd-accent": c1,
          backgroundImage: `radial-gradient(70% 45% at ${glowA}, color-mix(in oklab, ${c1} 62%, transparent), transparent 70%), radial-gradient(65% 45% at ${glowB}, color-mix(in oklab, ${c2} 50%, transparent), transparent 72%), linear-gradient(180deg, color-mix(in oklab, ${c2} 18%, var(--color-black)), var(--color-black) 78%)`,
        } as React.CSSProperties
      }
    >
      {/* light streak */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1/4 top-[8%] h-[38%] -rotate-12 opacity-40 mix-blend-screen"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, color-mix(in oklab, ${c1} 45%, transparent) 45%, transparent 70%)` }}
      />
      {/* floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-18%] h-[42%] rounded-[50%]"
        style={{ backgroundImage: `radial-gradient(closest-side, color-mix(in oklab, ${c1} 30%, transparent), transparent)` }}
      />
      {/* subject silhouette */}
      <div aria-hidden className={cn("pointer-events-none absolute aspect-square opacity-[.28]", iconPos)} style={{ color: c1 }}>
        <NicheIcon name={icon} className="size-full" strokeWidth={0.9} />
      </div>
      {/* vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_55%,var(--color-black)_100%)] opacity-70" />

      {/* captions keep clear of the network action column on the physical right (Part 01 §10.6) */}
      <div className={cn("absolute", capPos)} style={chrome && aspect === "reel" && preset === "news" ? { right: "17%" } : undefined}>
        <CaptionText text={text} preset={preset} />
      </div>

      {children}

      {chrome && aspect === "reel" && (
        <>
          {/* Network action column sits on the PHYSICAL right in every app, also in RTL (Part 01 §10.6) — never mirrored. */}
          <div aria-hidden className="absolute bottom-[22%] flex flex-col items-center gap-[5cqi] opacity-85" style={{ right: "4%" }}>
            <Heart className="size-[8cqi]" strokeWidth={2} />
            <MessageCircle className="size-[8cqi]" strokeWidth={2} />
            <Send className="size-[8cqi]" strokeWidth={2} />
          </div>
          <div aria-hidden className="absolute inset-x-[5%] top-[3.2%] h-[.9cqi] min-h-[2px] overflow-hidden rounded-full bg-white/25">
            <div className="kd-progress h-full w-full rounded-full bg-white/90" style={{ ["--kd-delay" as string]: `${-progressDelay}s` }} />
          </div>
        </>
      )}

      {nicheLabel && (
        <span className="absolute inset-s-[5%] top-[7%] inline-flex max-w-[78%] items-center gap-[1.6cqi] truncate rounded-full bg-black/55 px-[3.4cqi] py-[1.4cqi] text-[max(10px,4.2cqi)] font-semibold leading-tight text-white backdrop-blur-sm">
          <NicheIcon name={icon} className="size-[1.1em] shrink-0" />
          <span className="truncate">{nicheLabel}</span>
        </span>
      )}
      {badge && (
        <span className="absolute inset-s-[5%] bottom-[4%] rounded-[6px] bg-black/60 px-[2.6cqi] py-[0.9cqi] text-[max(10px,3.8cqi)] font-semibold text-white/90">
          {badge}
        </span>
      )}
    </div>
  );
}
