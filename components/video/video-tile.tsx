import * as React from "react";
import type { Aspect, SceneTone } from "@/lib/mock/projects";
import { formatDuration } from "@/lib/mock/projects";
import { SceneArt } from "./scene-art";
import { cn } from "@/lib/utils";

const ASPECT_CLASS: Record<Aspect, string> = { "9:16": "aspect-reel", "1:1": "aspect-square", "16:9": "aspect-wide" };

/**
 * Styled stand-in for a video poster (no media files exist yet): gradient art + glyph + hook text overlay.
 * Hover/focus gives a slow push-in (disabled under reduced motion by the global rules).
 */
export function VideoTile({
  tone,
  icon,
  hookText,
  aspect = "9:16",
  durationSec,
  badge,
  topStart,
  bottomStart,
  alt,
  className,
  textSize = "md",
}: {
  tone: SceneTone;
  icon?: string | null;
  hookText?: string;
  aspect?: Aspect;
  durationSec?: number | null;
  badge?: React.ReactNode;
  topStart?: React.ReactNode;
  bottomStart?: React.ReactNode;
  alt?: string;
  className?: string;
  textSize?: "sm" | "md" | "lg";
}) {
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={cn("group/tile @container relative isolate w-full frame-tile bg-black", ASPECT_CLASS[aspect], className)}
    >
      <SceneArt
        tone={tone}
        icon={icon}
        className="transition-transform duration-[1600ms] ease-[var(--ease-out)] group-hover/tile:scale-[1.06] group-focus-within/tile:scale-[1.06]"
      />
      {hookText && (
        <p
          aria-hidden
          dir="rtl"
          className={cn(
            "absolute inset-x-[8%] top-[30%] text-center font-black leading-[1.15] text-white [text-wrap:balance]",
            textSize === "sm" ? "text-[9cqw]" : textSize === "lg" ? "text-[12cqw]" : "text-[10.5cqw]",
            aspect !== "9:16" && "top-[24%] text-[7cqw]",
          )}
          style={{ textShadow: "0 3px 14px color-mix(in oklab, var(--color-black) 70%, transparent)" }}
        >
          {hookText}
        </p>
      )}
      {(topStart || badge) && (
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          <div>{topStart}</div>
          <div>{badge}</div>
        </div>
      )}
      {bottomStart && <div className="absolute bottom-2 inset-s-2">{bottomStart}</div>}
      {durationSec != null && (
        <span className="absolute bottom-2 inset-e-2 rounded-xs bg-black/60 px-1.5 py-0.5 font-mono text-micro text-white">
          <bdi dir="ltr">{formatDuration(durationSec)}</bdi>
        </span>
      )}
    </div>
  );
}
