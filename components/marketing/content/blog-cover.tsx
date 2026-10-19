import { Clapperboard, Scissors, Sparkles } from "lucide-react";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { reelFromHook, reelFromText, isReel } from "@/components/marketing/media/reel-data";
import { cn } from "@/lib/utils";
import { BLOG_COVER_ART, type BlogPost } from "@/content/he/blog";

/**
 * Cover illustrations for the articles (CSS/SVG art in place of photos; Part 02 §8.1 cover):
 * a warm light "studio" with looping demo reels. 16:9; content scales with the container.
 */
export function BlogCover({ post, size = "lg", className }: { post: BlogPost; size?: "lg" | "sm"; className?: string }) {
  const sm = size === "sm";
  return (
    <div role="img" aria-label={post.cover.alt} className={cn("@container relative isolate aspect-wide overflow-hidden rounded-[28px] bg-surface-3", className)}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 50% 110%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 70%), radial-gradient(40% 60% at 90% 0%, color-mix(in oklab, var(--color-coral) 30%, transparent), transparent 70%)",
        }}
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-40" />
      {post.cover.art === "real-estate" && <RealEstateArt />}
      {post.cover.art === "cost" && <CostArt sm={sm} />}
      {post.cover.art === "reels" && <ReelsArt sm={sm} />}
    </div>
  );
}

function RealEstateArt() {
  const reels = [
    reelFromHook("real-estate-03", { caption: "shadow", highlight: 2 }),
    reelFromHook(BLOG_COVER_ART.realEstate.hooks[0], { caption: "box", highlight: 1, viewsK: 61.4 }),
    reelFromHook("real-estate-02", { caption: "box", highlight: 4, scene: "sky", prop: "building" }),
  ].filter(isReel);
  return (
    <div aria-hidden className="absolute inset-0 flex items-end justify-center gap-[3cqw] pt-[6cqw]">
      {reels.map((r, i) => (
        <ReelCard
          key={r.key}
          reel={r}
          frame="phone"
          decorative
          lite={i !== 1}
          offset={i * 2}
          instance="-cover"
          className={cn(i === 1 ? "z-10 w-[24cqw] translate-y-[6cqw]" : "w-[19cqw] translate-y-[14cqw]", i === 0 && "rotate-[-6deg]", i === 2 && "rotate-[6deg]")}
        />
      ))}
    </div>
  );
}

function CostArt({ sm }: { sm: boolean }) {
  const icons = [Clapperboard, Scissors, Sparkles];
  return (
    <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw]">
      <div className="flex items-center gap-[3cqw]">
        <span className="text-[20cqw] font-black leading-none text-accent-gradient">₪</span>
        {!sm && <span className="max-w-[32cqw] text-[5cqw] font-black leading-tight text-ink">{BLOG_COVER_ART.cost.title}</span>}
      </div>
      <div className="flex gap-[2cqw]">
        {BLOG_COVER_ART.cost.cards.map((c, i) => {
          const I = icons[i];
          return (
            <span key={c} className={cn("flex items-center gap-[1cqw] rounded-full px-[2.4cqw] py-[1.1cqw] text-[2.6cqw] font-bold", i === 2 ? "bg-accent-gradient text-ink" : "bg-paper text-ink shadow-[0_8px_20px_-10px_rgb(0_0_0/.3)]")}>
              <I className="size-[3cqw]" />
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ReelsArt({ sm }: { sm: boolean }) {
  const a = BLOG_COVER_ART.reels;
  const reel = reelFromText("blog-reels", a.hook, "dentists", { caption: "box", highlight: 1, viewsK: 33.8 });
  return (
    <div aria-hidden className="absolute inset-0 flex items-end justify-center gap-[5cqw] pt-[5cqw]">
      {!sm && (
        <ul className="mb-[14cqw] flex flex-col gap-[1.6cqw]">
          {a.chips.map((c) => (
            <li key={c} className="rounded-full bg-paper px-[2.4cqw] py-[1cqw] text-[2.5cqw] font-bold text-ink shadow-[0_8px_20px_-10px_rgb(0_0_0/.3)]">
              {c}
            </li>
          ))}
        </ul>
      )}
      <ReelCard reel={reel} frame="phone" decorative instance="-cover" className="w-[26cqw] translate-y-[8cqw]" />
    </div>
  );
}
