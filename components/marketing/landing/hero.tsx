import { Clock, Minus } from "lucide-react";
import { launchNiches, nicheCategories, niches, nicheShortName } from "@/lib/data/seed";
import { WALL_TILES, resolveWallTile, type ResolvedTile } from "@/lib/mock/landing";
import { HeroPromptCard } from "./hero-prompt-card";
import type { NicheGroup, NicheOption } from "./niche-picker";
import { TrustRow } from "./trust-row";
import { VideoWall } from "./video-wall";
import { LANDING } from "@/content/he/landing";

const T = LANDING.hero;

const toOption = (n: (typeof niches)[number]): NicheOption => ({
  slug: n.slug,
  label: nicheShortName(n),
  icon: n.icon,
  search: `${n.name_he} ${nicheShortName(n)} ${n.name_en}`.toLowerCase(),
});

export function Hero() {
  const launch = launchNiches().map(toOption);
  const groups: NicheGroup[] = nicheCategories
    .map((c) => ({ slug: c.slug, label: c.name_he, items: niches.filter((n) => n.category_slug === c.slug).map(toOption) }))
    .filter((g) => g.items.length > 0);

  const resolved = WALL_TILES.map((t) => ({ t, r: resolveWallTile(t) })).filter((x): x is { t: (typeof WALL_TILES)[number]; r: ResolvedTile } => !!x.r);
  const columns = [1, 2, 3].map((c) => resolved.filter((x) => x.t.column === c).map((x) => x.r));
  const mobile = resolved.filter((x) => x.t.mobile).map((x) => x.r);

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-afterglow opacity-80" aria-hidden />
      <div className="container-marketing grid grid-cols-[minmax(0,1fr)] gap-10 pb-16 pt-6 md:pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-12 lg:pt-4">
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-7 lg:pb-6 lg:pt-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-2/80 px-3 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <span aria-hidden className="relative flex size-2">
              <span className="kd-ring absolute inline-flex size-full rounded-full bg-primary" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {T.eyebrow}
          </span>

          <h1 id="hero-title" className="font-display text-display text-text xl:text-[6.5rem]">
            {T.h1.before}
            <span className="text-gold-gradient">{T.h1.highlight}</span>
            {T.h1.after}
          </h1>

          <p className="text-body-lg max-w-2xl text-text-2">{T.sub}</p>

          <ul aria-label={T.withoutLabel} className="flex flex-wrap gap-2">
            {T.without.map((w) => (
              <li key={w} className="inline-flex items-center gap-1.5 rounded-full bg-surface-1/70 px-3 py-1.5 text-small font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-border)]">
                <Minus className="size-3.5 text-rose" aria-hidden />
                {w}
              </li>
            ))}
          </ul>

          <HeroPromptCard launch={launch} groups={groups} />

          <div className="flex flex-col gap-3">
            <TrustRow />
            <p className="inline-flex items-center gap-1.5 text-micro font-normal text-muted">
              <Clock className="size-3.5" aria-hidden />
              {T.reviewNote}
            </p>
          </div>
        </div>

        <div className="relative min-w-0 md:h-[520px] lg:col-span-5 lg:h-auto lg:min-h-[680px]">
          <VideoWall columns={columns} mobile={mobile} />
        </div>
      </div>
    </section>
  );
}
