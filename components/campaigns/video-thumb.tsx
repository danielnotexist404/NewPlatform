import * as React from "react";
import { Play, Scissors, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled 9:16 video placeholder (no real media yet): projector gradient + niche icon + hook text
 * in the top safe zone, like a reel frame. Media stays visually LTR-neutral; text is Hebrew RTL.
 */
const TONES = [
  "radial-gradient(120% 70% at 85% 0%, color-mix(in oklab, var(--color-primary) 62%, transparent), transparent 62%), radial-gradient(90% 60% at 0% 100%, color-mix(in oklab, var(--color-rose) 48%, transparent), transparent 65%)",
  "radial-gradient(110% 70% at 10% 5%, color-mix(in oklab, var(--color-violet) 70%, transparent), transparent 60%), radial-gradient(90% 60% at 100% 100%, color-mix(in oklab, var(--color-primary) 40%, transparent), transparent 65%)",
  "radial-gradient(120% 70% at 90% 10%, color-mix(in oklab, var(--color-rose) 60%, transparent), transparent 60%), radial-gradient(100% 60% at 0% 95%, color-mix(in oklab, var(--color-violet) 50%, transparent), transparent 65%)",
  "radial-gradient(120% 70% at 50% 0%, color-mix(in oklab, var(--color-success) 42%, transparent), transparent 60%), radial-gradient(100% 70% at 100% 100%, color-mix(in oklab, var(--color-primary) 46%, transparent), transparent 65%)",
] as const;

type Size = "xs" | "sm" | "md" | "lg";

export function VideoThumb({
  hookText,
  tone = 0,
  size = "md",
  icon: Icon = Scissors,
  durationSec,
  className,
  showPlay = true,
  children,
}: {
  hookText?: string;
  tone?: 0 | 1 | 2 | 3;
  size?: Size;
  icon?: LucideIcon;
  durationSec?: number;
  className?: string;
  showPlay?: boolean;
  children?: React.ReactNode;
}) {
  const showText = !!hookText && (size === "md" || size === "lg");
  return (
    <div
      className={cn("relative isolate aspect-reel shrink-0 overflow-hidden bg-black text-white frame-tile", size === "xs" ? "rounded-xs" : "rounded-md", className)}
      style={{ backgroundImage: TONES[tone] }}
      role={hookText ? "img" : undefined}
      aria-label={hookText ? `סרטון לדוגמה: ${hookText}` : undefined}
      aria-hidden={hookText ? undefined : true}
    >
      {/* film light + vignette */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/.08)_45%,transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_120%,rgb(0_0_0/.55),transparent)]" />
      <Icon
        aria-hidden
        strokeWidth={1.25}
        className={cn(
          "absolute bottom-[14%] inset-s-1/2 opacity-30 ltr:-translate-x-1/2 rtl:translate-x-1/2",
          size === "xs" ? "size-5" : size === "sm" ? "size-8" : size === "md" ? "size-14" : "size-20",
        )}
      />
      {showText && (
        <p
          dir="rtl"
          className={cn(
            "absolute inset-x-[8%] top-[13%] text-center font-extrabold leading-snug text-balance [text-shadow:0_2px_12px_rgb(0_0_0/.55)]",
            size === "lg" ? "text-body-lg" : "text-small",
          )}
        >
          <span className="rounded-[4px] bg-black/45 box-decoration-clone px-1.5 py-0.5">{hookText}</span>
        </p>
      )}
      {showPlay && size !== "xs" && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 inset-s-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ltr:-translate-x-1/2 rtl:translate-x-1/2",
            size === "sm" ? "size-6" : "size-11",
          )}
        >
          <Play className={cn("fill-current", size === "sm" ? "size-3" : "size-4")} style={{ transform: "none" }} />
        </span>
      )}
      {durationSec && size !== "xs" && size !== "sm" && (
        <span dir="ltr" className="absolute bottom-2 inset-e-2 rounded-xs bg-black/55 px-1.5 py-0.5 text-micro num">
          0:{String(durationSec).padStart(2, "0")}
        </span>
      )}
      {children}
    </div>
  );
}
