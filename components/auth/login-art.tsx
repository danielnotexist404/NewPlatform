import { CircleCheck } from "lucide-react";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { isReel, reelFromHook } from "@/components/marketing/media/reel-data";
import { AUTH } from "@/content/he/site";

const REELS = [
  reelFromHook("event-venues-01", { caption: "shadow", viewsK: 73.2, highlight: 3 }),
  reelFromHook("dentists-01", { caption: "box", viewsK: 64.3, highlight: 1, sponsored: true }),
  reelFromHook("event-photographers-01", { caption: "box", viewsK: 28.6, highlight: 2 }),
].filter(isReel);

/** End-side art of /login (Part 03 §3.1): three looping demo reels in phones + trust lines. */
export function LoginArt() {
  return (
    <div className="relative isolate flex h-full flex-col items-center justify-center gap-12 overflow-hidden px-10 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundImage: "radial-gradient(50% 50% at 50% 42%, color-mix(in oklab, var(--color-primary) 30%, transparent), color-mix(in oklab, var(--color-coral) 10%, transparent) 55%, transparent 75%)" }}
      />
      <div role="group" aria-label={AUTH.art.label} className="flex w-full max-w-lg items-start justify-center gap-4">
        {REELS.map((r, i) => (
          <ReelCard
            key={r.key}
            reel={r}
            frame="phone"
            offset={i * 2}
            lite={i !== 1}
            decorative={i !== 1}
            className={i === 1 ? "z-10 w-[40%]" : i === 0 ? "w-[30%] translate-y-10 rotate-[-7deg] opacity-90" : "w-[30%] translate-y-10 rotate-[7deg] opacity-90"}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {AUTH.art.trust.map((t) => (
          <li key={t} className="flex items-center gap-3 text-body-lg font-semibold">
            <CircleCheck aria-hidden className="size-5 shrink-0 text-success" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
