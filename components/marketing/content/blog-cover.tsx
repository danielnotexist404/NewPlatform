import { House, Clapperboard, Scissors, Sparkles, Smile } from "lucide-react";
import { getHook } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import { COVER_ART, type BlogPost } from "@/content/he/blog";
import { ReelTile } from "./reel-tile";

/** Film-strip perforations (decorative). */
function Perforations({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-x-0 flex justify-between gap-2 px-3", className)}>
      {Array.from({ length: 22 }).map((_, i) => (
        <span key={i} className="h-2.5 w-4 shrink-0 rounded-[3px] bg-white/[0.07]" />
      ))}
    </div>
  );
}

/**
 * Cover illustrations for the launch articles (CSS art in place of photos; Part 02 §8.1 cover).
 * The frame is a 16:9 "screen"; content scales with the container (container queries).
 */
export function BlogCover({ post, size = "lg", className }: { post: BlogPost; size?: "lg" | "sm"; className?: string }) {
  const sm = size === "sm";
  return (
    <div
      role="img"
      aria-label={post.cover.alt}
      className={cn("@container relative isolate aspect-wide overflow-hidden rounded-lg bg-black shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}
    >
      {post.cover.art === "real-estate" && <RealEstateArt sm={sm} />}
      {post.cover.art === "cost" && <CostArt sm={sm} />}
      {post.cover.art === "reels" && <ReelsArt sm={sm} />}
    </div>
  );
}

function Glow({ a, b }: { a: string; b: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: `radial-gradient(55% 75% at 50% 110%, color-mix(in oklab, var(${a}) 45%, transparent), transparent 70%), radial-gradient(40% 60% at 85% 0%, color-mix(in oklab, var(${b}) 35%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-black) 92%, var(--color-violet)), var(--color-black))`,
      }}
    />
  );
}

function RealEstateArt({ sm }: { sm: boolean }) {
  const [front, left, right] = COVER_ART.realEstate.hooks.map((id) => getHook(id)?.text_he ?? "");
  return (
    <>
      <Glow a="--color-primary" b="--color-rose" />
      <div aria-hidden className="absolute inset-0 flex items-center justify-center" dir="ltr">
        <div className="absolute h-[70%] -translate-x-[62%] -rotate-[9deg] opacity-70">
          <ReelTile hook={left} icon={House} tone="violet" size="sm" demo={false} className="h-full w-auto" decorative />
        </div>
        <div className="absolute h-[70%] translate-x-[62%] rotate-[9deg] opacity-70">
          <ReelTile hook={right} icon={House} tone="rose" size="sm" demo={false} className="h-full w-auto" decorative />
        </div>
        <div className="relative h-[86%] drop-shadow-[0_24px_48px_rgb(0_0_0/.6)]">
          <ReelTile hook={front} label={COVER_ART.realEstate.label} icon={House} tone="gold" size={sm ? "sm" : "md"} className="h-full w-auto" decorative />
        </div>
      </div>
    </>
  );
}

function CostArt({ sm }: { sm: boolean }) {
  const icons = [Clapperboard, Scissors, Sparkles];
  return (
    <>
      <Glow a="--color-primary" b="--color-violet" />
      <Perforations className="top-3" />
      <Perforations className="bottom-3" />
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-[4cqw]">
        <div className="flex items-center gap-[3cqw]">
          <span className="font-display text-[22cqw] leading-none text-gold-gradient">₪</span>
          {!sm && <span className="max-w-[30cqw] text-[4.2cqw] font-extrabold leading-tight text-white">{COVER_ART.cost.title}</span>}
        </div>
        <div className="flex gap-[2cqw]">
          {COVER_ART.cost.cards.map((c, i) => {
            const I = icons[i];
            return (
              <span key={c} className={cn("flex items-center gap-[1cqw] rounded-full border border-white/15 bg-white/[0.06] px-[2.2cqw] py-[1cqw] text-[2.4cqw] font-semibold text-white/90 backdrop-blur", i === 2 && "border-primary/60 text-primary")}>
                <I className="size-[2.8cqw]" />
                {c}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ReelsArt({ sm }: { sm: boolean }) {
  const a = COVER_ART.reels;
  return (
    <>
      <Glow a="--color-violet" b="--color-primary" />
      <div aria-hidden className="absolute inset-0 flex items-center justify-center gap-[5cqw]">
        {!sm && (
          <ul className="flex flex-col gap-[1.6cqw]">
            {a.chips.map((c) => (
              <li key={c} className="rounded-full border border-white/15 bg-white/[0.06] px-[2cqw] py-[0.9cqw] text-[2.3cqw] font-semibold text-white/90 backdrop-blur">
                {c}
              </li>
            ))}
          </ul>
        )}
        <div className="flex h-[88%] flex-col items-center gap-[1.6cqw]">
          <ReelTile hook={a.hook} label={a.label} icon={Smile} tone="violet" caption={a.caption} size={sm ? "sm" : "md"} className="h-[88%] w-auto drop-shadow-[0_24px_48px_rgb(0_0_0/.6)]" decorative />
          {/* timeline: media stays LTR */}
          <div dir="ltr" className="flex w-[26cqw] items-center gap-[0.6cqw]">
            <span className="h-[1.1cqw] w-[22%] rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
            <span className="h-[1.1cqw] flex-1 rounded-full bg-white/20" />
          </div>
          {!sm && <span className="text-[2cqw] font-semibold text-primary">{a.firstSeconds}</span>}
        </div>
      </div>
    </>
  );
}
