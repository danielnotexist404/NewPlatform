import { Eye, Heart, MessageCircle, Send } from "lucide-react";
import { NicheIcon } from "./niche-icon";
import type { CaptionStyle, HeroReel, SceneName } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

/**
 * CSS-only "reel" art (no images): a photographic mesh of scene tokens, bokeh, a light leak and grain,
 * with a Hebrew hook caption like a real reel. Text sizes use container units, so any phone size works.
 */
const mix = (c: string, pct: number) => `color-mix(in oklab, var(--color-${c}) ${pct}%, transparent)`;

const SCENES: Record<SceneName, { bg: string; bokeh: [string, string, string] }> = {
  teal: {
    bg: `radial-gradient(70% 45% at 72% 16%, ${mix("scene-mint", 75)}, transparent 70%), radial-gradient(60% 40% at 15% 55%, ${mix("scene-sky", 45)}, transparent 70%), linear-gradient(170deg, color-mix(in oklab, var(--color-scene-teal) 80%, var(--color-scene-mint)), var(--color-scene-teal) 45%, var(--color-scene-night) 100%)`,
    bokeh: ["scene-mint", "primary", "scene-sky"],
  },
  cocoa: {
    bg: `radial-gradient(70% 45% at 28% 20%, ${mix("primary", 85)}, transparent 70%), radial-gradient(70% 50% at 80% 70%, ${mix("coral", 65)}, transparent 70%), linear-gradient(170deg, color-mix(in oklab, var(--color-primary) 45%, var(--color-scene-cocoa)), var(--color-scene-cocoa) 55%, var(--color-ink) 100%)`,
    bokeh: ["lemon", "primary", "coral"],
  },
  dusk: {
    bg: `radial-gradient(90% 50% at 50% 0%, ${mix("primary", 95)}, transparent 72%), radial-gradient(70% 45% at 88% 40%, ${mix("coral", 85)}, transparent 70%), radial-gradient(80% 50% at 8% 62%, ${mix("scene-blush", 55)}, transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-coral) 70%, var(--color-scene-wine)) 0%, var(--color-scene-wine) 50%, var(--color-scene-night) 100%)`,
    bokeh: ["lemon", "scene-blush", "primary"],
  },
  blush: {
    bg: `radial-gradient(70% 45% at 25% 16%, ${mix("scene-blush", 100)}, transparent 72%), radial-gradient(70% 45% at 85% 62%, ${mix("coral", 55)}, transparent 70%), linear-gradient(170deg, color-mix(in oklab, var(--color-scene-blush) 55%, var(--color-scene-wine)), var(--color-scene-wine) 55%, var(--color-ink) 100%)`,
    bokeh: ["scene-blush", "paper", "primary"],
  },
  sky: {
    bg: `radial-gradient(90% 50% at 50% 0%, ${mix("scene-sky", 100)}, transparent 75%), radial-gradient(70% 40% at 25% 70%, ${mix("scene-sand", 80)}, transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-scene-sky) 55%, var(--color-scene-navy)), var(--color-scene-navy) 55%, var(--color-scene-night) 100%)`,
    bokeh: ["scene-sky", "scene-sand", "paper"],
  },
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function ReelScene({ scene }: { scene: SceneName }) {
  const s = SCENES[scene];
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0" style={{ backgroundImage: s.bg }} />
      {/* bokeh */}
      <span className="absolute aspect-square w-[46%] rounded-full blur-[10cqw] opacity-70" style={{ background: mix(s.bokeh[0], 80), insetInlineStart: "8%", top: "30%" }} />
      <span className="absolute aspect-square w-[30%] rounded-full blur-[6cqw] opacity-60" style={{ background: mix(s.bokeh[1], 85), insetInlineEnd: "6%", top: "52%" }} />
      <span className="absolute aspect-square w-[16%] rounded-full blur-[3cqw] opacity-70" style={{ background: mix(s.bokeh[2], 90), insetInlineStart: "36%", top: "16%" }} />
      {/* light leak + sheen */}
      <span className="absolute -inset-x-1/4 top-[-10%] h-1/2 rotate-[-18deg] opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${mix("paper", 22)}, transparent)` }} />
      {/* grain */}
      <span className="absolute inset-0 opacity-[.18] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {/* legibility vignette */}
      <span className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${mix("ink", 35)} 0%, transparent 20%, transparent 62%, ${mix("ink", 62)} 100%)` }} />
    </div>
  );
}

export function ReelCaption({ text, style, children }: { text?: string; style: CaptionStyle; children?: React.ReactNode }) {
  const content = children ?? text;
  if (style === "shadow") {
    return (
      <p className="text-[8.6cqw] font-black leading-[1.18] text-paper [text-shadow:0_2px_12px_color-mix(in_oklab,var(--color-ink)_65%,transparent)]">
        {content}
      </p>
    );
  }
  return (
    <p className="text-[7.4cqw] font-extrabold leading-[1.62]">
      <span
        className={cn(
          "reel-box rounded-[1.6cqw] px-[2.4cqw] py-[0.6cqw]",
          style === "box" ? "bg-paper text-ink" : "bg-accent-gradient text-ink",
        )}
      >
        {content}
      </span>
    </p>
  );
}

/** Reel UI overlay: story progress, handle, side rail, niche chip and a demo views counter. */
export function ReelOverlay({
  reel, demoLabel, viewsLabel, caption, progress = 0.45, live = false,
}: {
  reel: HeroReel;
  demoLabel: string;
  viewsLabel: string;
  caption: React.ReactNode;
  progress?: number;
  live?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-[5cqw] pb-[5cqw] pt-[13cqw] text-paper">
      <div aria-hidden className="flex gap-[1.2cqw]" dir="ltr">
        {[1, 0.999, 0].map((full, i) => (
          <span key={i} className="h-[0.9cqw] flex-1 overflow-hidden rounded-full bg-paper/30">
            <span
              className={cn("block h-full rounded-full bg-paper", live && i === 1 && "origin-left animate-[reel-progress_7s_linear_infinite]")}
              style={{ width: live && i === 1 ? "100%" : `${(i === 1 ? progress : full) * 100}%` }}
            />
          </span>
        ))}
      </div>
      <div aria-hidden className="mt-[3.5cqw] flex items-center gap-[2cqw] text-[3.6cqw] font-semibold">
        <span className="size-[7cqw] shrink-0 rounded-full bg-accent-gradient ring-[0.5cqw] ring-paper/70" />
        <span className="truncate">{reel.nicheLabel}</span>
        {reel.sponsored && <span className="font-normal opacity-80">· ממומן</span>}
      </div>

      <div className="flex flex-1 items-center pe-[11cqw]">
        <div className="w-full">{caption}</div>
      </div>

      <div aria-hidden className="absolute inset-e-[3.5cqw] bottom-[24cqw] flex flex-col items-center gap-[4.5cqw]">
        <Heart className="size-[6.4cqw]" strokeWidth={2.2} />
        <MessageCircle className="size-[6.4cqw]" strokeWidth={2.2} />
        <Send className="size-[6.4cqw]" strokeWidth={2.2} />
      </div>

      <div className="flex items-end justify-between gap-[2cqw]">
        <span className="inline-flex min-w-0 items-center gap-[1.6cqw] rounded-full bg-ink/45 px-[3cqw] py-[1.6cqw] text-[3.6cqw] font-semibold backdrop-blur-md">
          <NicheIcon name={reel.icon} className="size-[4cqw] shrink-0" />
          <span className="truncate">{reel.nicheLabel}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-[1.4cqw] text-[3.4cqw] font-semibold">
          <Eye className="size-[4cqw]" aria-hidden />
          <span>
            <bdi className="num">{reel.viewsK.toLocaleString("he-IL")}</bdi> אלף {viewsLabel}
          </span>
          <span className="rounded-full bg-paper/90 px-[1.8cqw] py-[0.4cqw] text-[2.8cqw] font-bold text-ink">{demoLabel}</span>
        </span>
      </div>
    </div>
  );
}

/** Generic phone body (not a real device model): ink bezel, island, soft layered shadow. */
export function PhoneShell({ children, className, label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <div
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn(
        "relative bg-ink p-[3%] shadow-[0_40px_80px_-30px_color-mix(in_oklab,var(--color-ink)_55%,transparent),0_16px_32px_-16px_color-mix(in_oklab,var(--color-ink)_35%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_14%,transparent)]",
        className,
      )}
      style={{ borderRadius: "14% / 6.6%" }}
    >
      <div className="@container relative aspect-[9/18.5] overflow-hidden bg-ink" style={{ borderRadius: "11.5% / 5.6%" }}>
        {children}
        <span aria-hidden className="absolute inset-x-0 top-[2.6cqw] z-10 mx-auto h-[6.4cqw] w-[30%] rounded-full bg-ink" />
      </div>
    </div>
  );
}
