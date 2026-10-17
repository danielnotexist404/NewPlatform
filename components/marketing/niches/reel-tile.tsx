import * as React from "react";
import { Heart, MessageCircle, Play, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { HookText } from "@/components/hooks/hook-text";
import { NicheIcon } from "./niche-icon";

/** Category tint for placeholder art — tokens only. */
const TINT: Record<string, string> = {
  "real-estate-home": "var(--color-primary)",
  "beauty-grooming": "var(--color-rose)",
  "health-wellness": "var(--color-success)",
  "food-hospitality": "var(--color-primary)",
  events: "var(--color-violet)",
  "tourism-leisure": "var(--color-success)",
  "professional-finance": "var(--color-violet)",
  commerce: "var(--color-rose)",
  automotive: "var(--color-primary)",
  "education-kids": "var(--color-lemon)",
  pets: "var(--color-success)",
  "tech-b2b": "var(--color-violet)",
  "community-public": "var(--color-rose)",
};
export const tintFor = (category?: string | null) => (category && TINT[category]) || "var(--color-primary)";

/**
 * 9:16 placeholder "reel" (no media exists yet): gradient + niche icon + hook text as burned-in caption.
 * Media chrome stays LTR (Part 01 §9), the Hebrew text inside is RTL. The platform button column sits on the
 * physical right, as in the apps.
 */
export function ReelTile({ icon, category, hookText, caption, handle, badge, size = "md", className }: {
  icon: string | null; category?: string | null; hookText: string; caption?: string; handle?: string; badge?: string; size?: "sm" | "md"; className?: string;
}) {
  const tint = tintFor(category);
  return (
    <div
      dir="ltr"
      className={cn("relative isolate aspect-reel w-full overflow-hidden bg-bg", className)}
      style={{ "--tint": tint } as React.CSSProperties}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(130%_75%_at_50%_0%,color-mix(in_oklab,var(--tint)_42%,transparent),transparent_62%),radial-gradient(90%_60%_at_100%_100%,color-mix(in_oklab,var(--color-violet)_28%,transparent),transparent_70%),linear-gradient(180deg,var(--color-surface-2),var(--color-bg))]" />
      <div aria-hidden className="absolute inset-0 animate-sweep bg-[linear-gradient(105deg,transparent_35%,color-mix(in_oklab,var(--color-white)_9%,transparent)_50%,transparent_65%)] bg-[length:260%_100%]" />
      <NicheIcon name={icon} strokeWidth={1.1} className={cn("absolute inset-s-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-white/[0.07]", size === "sm" ? "size-28" : "size-56")} />

      {/* top: story bars + account */}
      <div className="absolute inset-x-3 top-3 flex gap-1" aria-hidden>
        <span className="h-0.5 flex-1 rounded-full bg-white/85" />
        <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
          <span className="block h-full w-2/5 bg-white/85" />
        </span>
        <span className="h-0.5 flex-1 rounded-full bg-white/30" />
      </div>
      {handle && (
        <div className="absolute inset-s-3 top-6 flex items-center gap-2" aria-hidden>
          <span className="flex size-7 items-center justify-center rounded-full bg-[var(--tint)] text-on-primary">
            <NicheIcon name={icon} className="size-3.5" />
          </span>
          <span dir="rtl" className="text-[11px] font-semibold text-white/90">{handle}</span>
        </div>
      )}

      {/* hook = burned-in title in the hook zone (15–55%) */}
      <div className="absolute inset-x-4 top-[20%]" dir="rtl">
        <p className={cn("rounded-md bg-black/60 px-3 py-2 text-center font-extrabold leading-snug text-white backdrop-blur-sm", size === "sm" ? "text-[13px]" : "text-[19px]")}>
          <HookText text={hookText} />
        </p>
      </div>

      {/* caption zone (62–78%) */}
      {caption && (
        <div className="absolute inset-x-6 top-[66%]" dir="rtl">
          <p className={cn("text-center font-bold text-white [text-shadow:0_1px_8px_var(--color-black)]", size === "sm" ? "text-[11px]" : "text-[14px]")}>{caption}</p>
        </div>
      )}

      <div aria-hidden className="absolute inset-s-1/2 top-[50%] flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
        <Play className="size-5 translate-x-px fill-white text-white" />
      </div>

      {/* platform buttons column: physical right */}
      <div aria-hidden className={cn("absolute inset-e-2.5 flex flex-col items-center gap-3 text-white/90", size === "sm" ? "bottom-10" : "bottom-16")}>
        <Heart className="size-5" />
        <MessageCircle className="size-5" />
        <Send className="size-5" />
      </div>

      {badge && (
        <span dir="rtl" className="absolute bottom-3 inset-s-3 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white/90">
          {badge}
        </span>
      )}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
        <div className="h-full w-1/3 bg-primary" />
      </div>
    </div>
  );
}

/** Generic phone (Part 01 §10.6): 44px body radius, 10px bezel, island pill at 28%. */
export function PhoneFrame({ children, label, glow = true, className }: { children: React.ReactNode; label: string; glow?: boolean; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn("relative mx-auto w-full max-w-[300px]", className)}>
      {glow && <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_28%,transparent),transparent)] blur-2xl" />}
      <div className="relative rounded-[44px] bg-surface-3 p-[10px] elev-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border-strong)_40%,transparent)]">
        <div aria-hidden className="absolute inset-x-0 top-[18px] z-10 mx-auto h-[22px] w-[28%] rounded-full bg-black" />
        <div className="overflow-hidden rounded-[34px]">{children}</div>
      </div>
    </div>
  );
}
