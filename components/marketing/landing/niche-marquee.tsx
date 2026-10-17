import Link from "next/link";
import { NicheIcon } from "./niche-icon";
import { DirIcon } from "@/components/a11y/dir-icon";
import { niches, nicheShortName } from "@/lib/data/seed";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const N = LANDING.niches;

function Chip({ slug, icon, label, hidden }: { slug: string; icon: string; label: string; hidden?: boolean }) {
  return (
    <li className="shrink-0">
      <Link
        href={`/niches/${slug}`}
        tabIndex={hidden ? -1 : undefined}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-surface-1 ps-2 pe-4 text-small font-semibold text-text shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--color-ink)_20%,transparent),inset_0_0_0_1px_var(--color-frame)]"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-surface-3 text-primary-text">
          <NicheIcon name={icon} className="size-3.5" />
        </span>
        {label}
      </Link>
    </li>
  );
}

function Row({ items, reverse, duration }: { items: typeof niches; reverse?: boolean; duration: string }) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <ul
        className={cn("marquee-track flex w-max animate-marquee gap-[var(--marquee-gap)] py-1.5", reverse && "[animation-direction:reverse]")}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) =>
          items.map((n) => (
            <Chip key={`${copy}-${n.slug}`} slug={n.slug} icon={n.icon} label={nicheShortName(n)} hidden={copy === 1} />
          )),
        )}
      </ul>
    </div>
  );
}

/** "לכל עסק" — two slow rows of real seed niches. The second copy of each row is presentational. */
export function NicheMarquee() {
  const list = niches.filter((n) => n.priority <= 2);
  const half = Math.ceil(list.length / 2);
  return (
    <section aria-labelledby="niches-label" className="relative py-10 md:py-14">
      <div className="container-marketing mb-6 flex items-center justify-center gap-3">
        <span aria-hidden className="h-px w-10 bg-border" />
        <h2 id="niches-label" className="text-small font-semibold text-muted">{N.label}</h2>
        <span aria-hidden className="h-px w-10 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        <Row items={list.slice(0, half)} duration="70s" />
        <Row items={list.slice(half)} duration="80s" reverse />
      </div>
      <div className="mt-6 flex justify-center">
        <Link href="/niches" className="group inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
          {N.all}
          <DirIcon name="forward" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
