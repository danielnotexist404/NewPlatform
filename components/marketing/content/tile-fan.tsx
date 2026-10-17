import type { LucideIcon } from "lucide-react";
import { BedDouble, Brush, Camera, Clapperboard, House, PartyPopper, Scissors, Smile, UtensilsCrossed } from "lucide-react";
import { getHook, getNiche, nicheShortName } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import { ReelTile, type ReelTone } from "./reel-tile";

const ICONS: Record<string, LucideIcon> = { House, Scissors, UtensilsCrossed, BedDouble, Smile, PartyPopper, Camera, Brush };

/**
 * Three demo reel tiles fanned out (about page, auth screen): real hooks from the seed
 * library, labelled "הדגמה". The middle tile is in front.
 */
export function TileFan({ tiles, label, className }: { tiles: readonly { hook: string; tone: string }[]; label: string; className?: string }) {
  const items = tiles.map((t) => {
    const h = getHook(t.hook);
    if (!h) throw new Error(`TileFan: unknown hook ${t.hook}`);
    const n = h.niche_slug ? getNiche(h.niche_slug) : undefined;
    return { text: h.text_he, label: n ? nicheShortName(n) : undefined, icon: (n && ICONS[n.icon]) || Clapperboard, tone: t.tone as ReelTone };
  });
  const [a, b, c] = items;
  return (
    <div role="group" aria-label={label} dir="ltr" className={cn("relative mx-auto flex aspect-[4/3] w-full max-w-xl items-center justify-center", className)}>
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-primary/15 blur-3xl" />
      {a && (
        <div className="absolute w-[34%] -translate-x-[78%] translate-y-[4%] -rotate-[8deg] opacity-90">
          <ReelTile hook={a.text} label={a.label} icon={a.icon} tone={a.tone} size="sm" className="elev-3" />
        </div>
      )}
      {c && (
        <div className="absolute w-[34%] translate-x-[78%] translate-y-[4%] rotate-[8deg] opacity-90">
          <ReelTile hook={c.text} label={c.label} icon={c.icon} tone={c.tone} size="sm" className="elev-3" />
        </div>
      )}
      {b && (
        <div className="relative w-[40%] drop-shadow-[0_30px_60px_rgb(0_0_0/.55)]">
          <ReelTile hook={b.text} label={b.label} icon={b.icon} tone={b.tone} size="md" className="glow-primary" />
        </div>
      )}
    </div>
  );
}
