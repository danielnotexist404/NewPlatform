import { CircleCheck, PartyPopper, Smile, Camera } from "lucide-react";
import { getHook, getNiche, nicheShortName } from "@/lib/data/seed";
import { ReelTile } from "@/components/marketing/content/reel-tile";
import { AUTH } from "@/content/he/site";

const FRONT = "dentists-01";
const BACK = ["event-venues-01", "event-photographers-01"] as const;

/** End-side art of /login (Part 03 §3.1): a phone frame with a demo reel, two tiles behind, trust lines. */
export function LoginArt() {
  const front = getHook(FRONT);
  const frontNiche = front?.niche_slug ? getNiche(front.niche_slug) : undefined;
  const back = BACK.map((id) => getHook(id));
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 px-10 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(45% 55% at 50% 40%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 70%)" }}
      />

      <div role="group" aria-label={AUTH.art.label} dir="ltr" className="relative flex w-full max-w-md items-center justify-center">
        <div aria-hidden className="absolute w-[38%] -translate-x-[92%] translate-y-[6%] -rotate-[10deg] opacity-80">
          <ReelTile hook={back[0]?.text_he ?? ""} icon={PartyPopper} tone="rose" size="sm" decorative className="elev-3" />
        </div>
        <div aria-hidden className="absolute w-[38%] translate-x-[92%] translate-y-[6%] rotate-[10deg] opacity-80">
          <ReelTile hook={back[1]?.text_he ?? ""} icon={Camera} tone="violet" size="sm" decorative className="elev-3" />
        </div>
        {/* phone frame */}
        <div className="relative w-[52%] rounded-[2.4rem] bg-surface-3 p-2.5 shadow-[0_40px_80px_rgb(0_0_0/.55),inset_0_0_0_1px_var(--color-frame)]">
          <span aria-hidden className="absolute inset-s-1/2 top-4 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
          <div className="overflow-hidden rounded-[1.9rem]">
            <ReelTile
              hook={front?.text_he ?? ""}
              label={frontNiche ? nicheShortName(frontNiche) : undefined}
              icon={Smile}
              tone="gold"
              caption={AUTH.art.tileCaption}
              className="rounded-none shadow-none"
            />
          </div>
        </div>
      </div>

      <p className="relative -mt-4 text-small text-muted">{AUTH.art.caption}</p>
      <ul className="relative flex flex-col gap-3">
        {AUTH.art.trust.map((t) => (
          <li key={t} className="flex items-center gap-3 text-body font-semibold">
            <CircleCheck aria-hidden className="size-5 shrink-0 text-success" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
