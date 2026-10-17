import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_UI } from "@/content/he/site";

/**
 * Styled 9:16 video placeholder (no external media yet): gradient "footage", niche icon,
 * hook text in the top safe zone, caption bars and the platform's action column.
 * The frame is LTR (media stays LTR, Part 01 §9) so the action column sits on the physical
 * right like in Reels; the Hebrew text inside is RTL.
 */
export type ReelTone = "gold" | "violet" | "rose" | "mint";

const TONES: Record<ReelTone, string> = {
  gold:
    "radial-gradient(120% 70% at 85% 0%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 62%), radial-gradient(90% 60% at 0% 100%, color-mix(in oklab, var(--color-rose) 38%, transparent), transparent 65%)",
  violet:
    "radial-gradient(110% 70% at 10% 0%, color-mix(in oklab, var(--color-violet) 60%, transparent), transparent 62%), radial-gradient(90% 60% at 100% 100%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 65%)",
  rose:
    "radial-gradient(110% 70% at 90% 10%, color-mix(in oklab, var(--color-rose) 55%, transparent), transparent 62%), radial-gradient(90% 60% at 0% 100%, color-mix(in oklab, var(--color-violet) 40%, transparent), transparent 65%)",
  mint:
    "radial-gradient(110% 70% at 15% 5%, color-mix(in oklab, var(--color-success) 45%, transparent), transparent 62%), radial-gradient(90% 60% at 100% 100%, color-mix(in oklab, var(--color-violet) 35%, transparent), transparent 65%)",
};

export function ReelTile({
  hook,
  label,
  icon: Icon,
  tone = "gold",
  demo = true,
  caption,
  size = "md",
  className,
  ariaLabel,
  decorative = false,
}: {
  hook: string;
  label?: string;
  icon?: LucideIcon;
  tone?: ReelTone;
  demo?: boolean;
  caption?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
  /** Inside an illustration that already has its own label. */
  decorative?: boolean;
}) {
  const text = size === "sm" ? "text-[0.8rem]" : size === "lg" ? "text-[1.35rem]" : "text-base";
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (ariaLabel ?? CONTENT_UI.tileAria(hook, label))}
      dir="ltr"
      className={cn("frame-tile relative aspect-reel select-none bg-black text-white", className)}
    >
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: TONES[tone] }} />
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "linear-gradient(180deg, transparent 35%, color-mix(in oklab, var(--color-black) 85%, transparent) 100%)" }}
      />
      {/* projector sweep */}
      <div
        aria-hidden
        className="absolute inset-0 animate-sweep opacity-40"
        style={{
          backgroundImage: "linear-gradient(105deg, transparent 40%, color-mix(in oklab, var(--color-white) 22%, transparent) 50%, transparent 60%)",
          backgroundSize: "250% 100%",
        }}
      />
      {Icon && (
        <Icon aria-hidden strokeWidth={1.25} className="absolute inset-s-1/2 top-[46%] size-[38%] -translate-x-1/2 -translate-y-1/2 text-white/15" />
      )}

      {/* story progress */}
      <div aria-hidden className="absolute inset-x-3 top-2.5 flex gap-1">
        <span className="h-0.5 flex-1 rounded-full bg-white/80" />
        <span className="h-0.5 flex-1 rounded-full bg-white/35" />
        <span className="h-0.5 flex-1 rounded-full bg-white/35" />
      </div>

      <div dir="rtl" className="absolute inset-x-3 top-6 flex items-center justify-between gap-2">
        {label ? (
          <span className="truncate rounded-full bg-black/45 px-2 py-0.5 text-[0.7rem] font-semibold text-white/90 backdrop-blur-sm">{label}</span>
        ) : (
          <span />
        )}
        {demo && <span className="shrink-0 rounded-xs bg-white/90 px-1.5 py-0.5 text-[0.65rem] font-bold text-black">{CONTENT_UI.demo}</span>}
      </div>

      {/* hook in the top safe zone */}
      <div dir="rtl" className="absolute inset-x-[10%] top-[22%] flex justify-center">
        <p className={cn("rounded-[8px] bg-black/55 px-2.5 py-1.5 text-center font-extrabold leading-snug text-white shadow-[0_8px_24px_rgb(0_0_0/.35)] backdrop-blur-[2px]", text)}>
          {hook}
        </p>
      </div>

      {/* action column — physical right, like the platform UI */}
      <div aria-hidden className="absolute inset-e-2 bottom-[18%] flex flex-col items-center gap-3 text-white/85">
        <Heart className="size-4" />
        <MessageCircle className="size-4" />
        <Send className="size-4" />
        <Bookmark className="size-4" />
      </div>

      {/* captions */}
      <div dir="rtl" aria-hidden className="absolute inset-x-[14%] bottom-[9%] flex flex-col items-center gap-1.5">
        {caption ? (
          <span className="rounded-[6px] bg-primary px-1.5 py-0.5 text-center text-[0.7rem] font-bold text-on-primary">{caption}</span>
        ) : (
          <>
            <span className="h-1.5 w-4/5 rounded-full bg-white/70" />
            <span className="h-1.5 w-3/5 rounded-full bg-white/45" />
          </>
        )}
      </div>
    </div>
  );
}
