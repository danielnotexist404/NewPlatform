"use client";
import * as React from "react";
import Link from "next/link";
import { Search, ShieldCheck, X } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { NICHES_COPY } from "@/content/he/niches";
import { plural, normalize } from "@/components/hooks/text";
import { cn } from "@/lib/utils";
import { NicheIcon } from "./niche-icon";
import { tintFor } from "./reel-tile";
import { ReelFootage } from "@/components/marketing/media/reel-card";
import { nicheVisual } from "@/components/marketing/media/props";

export interface NicheCardData {
  slug: string;
  name: string;
  short: string;
  icon: string;
  description: string;
  category: string;
  hookCount: number;
  compliance: boolean;
}
export interface NicheGroup { slug: string; name: string; niches: NicheCardData[] }

const H = NICHES_COPY.hub;

export function NicheCard({ n, compact = false }: { n: NicheCardData; compact?: boolean }) {
  const tint = tintFor(n.category);
  if (compact) {
    return (
      <Link
        href={`/hooks/${n.slug}`}
        className="group flex items-center gap-3 rounded-md bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2"
        style={{ "--tint": tint } as React.CSSProperties}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--tint)_16%,transparent)] text-[var(--tint)]">
          <NicheIcon name={n.icon} className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-text">{n.short}</span>
          <span className="num block text-micro font-normal text-muted">{plural(n.hookCount, H.cardHooks)}</span>
        </span>
        <DirIcon name="next" className="size-4 text-muted transition-transform group-hover:rtl:-translate-x-0.5 group-hover:ltr:translate-x-0.5" />
      </Link>
    );
  }
  const v = nicheVisual(n.slug);
  return (
    <article className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[26px] bg-ink text-paper @container shadow-[0_24px_48px_-28px_color-mix(in_oklab,var(--color-ink)_55%,transparent)]">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
        <ReelFootage reel={v} uid={`nc-${n.slug}`} still />
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/80 to-transparent" />
      {n.compliance && (
        <span className="absolute top-4 inset-s-4 inline-flex items-center gap-1 rounded-full bg-ink/50 px-2.5 py-1 text-micro text-paper backdrop-blur-md">
          <ShieldCheck className="size-3.5" aria-hidden />
          {H.compliance}
        </span>
      )}
      <div className="relative flex flex-col gap-1 p-5">
        <h3 className="text-h3 font-extrabold leading-tight text-paper">
          <Link href={`/niches/${n.slug}`} className="after:absolute after:inset-0 after:rounded-[26px] focus-visible:outline-none [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-focus">
            {n.short}
          </Link>
        </h3>
        <span className="num text-small text-paper/80">{plural(n.hookCount, H.cardHooks)}</span>
      </div>
    </article>
  );
}

/** /niches grid by category with a client filter (Part 02 §4.1), results announced via aria-live. */
export function NicheGrid({ groups }: { groups: NicheGroup[] }) {
  const [q, setQ] = React.useState("");
  const nq = normalize(q);
  const filtered = React.useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          niches: nq
            ? g.niches.filter((n) => normalize(`${n.name} ${n.short} ${n.description} ${g.name}`).includes(nq))
            : g.niches,
        }))
        .filter((g) => g.niches.length > 0),
    [groups, nq],
  );
  const total = filtered.reduce((s, g) => s + g.niches.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="niche-filter" className="sr-only">{H.filterLabel}</label>
        <div className="relative mx-auto w-full max-w-2xl">
          <Search className="pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="niche-filter"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={H.filterPlaceholder}
            autoComplete="off"
            className="h-14 w-full rounded-full border border-border-strong bg-surface-1 ps-12 pe-12 text-body-lg text-text placeholder:text-muted elev-2 focus-visible:outline-2 focus-visible:outline-offset-0 [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="ניקוי הסינון"
              className="absolute inset-e-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-text-2 hover:bg-surface-2 hover:text-text"
            >
              <X className="size-4.5" aria-hidden />
            </button>
          )}
        </div>
        <p aria-live="polite" className={cn("num text-center text-small text-muted", !nq && "sr-only")}>
          {plural(total, H.results)}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg bg-surface-1 p-8 text-center text-body-lg text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{H.noResults}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filtered.flatMap((g) => g.niches).map((n) => (
            <li key={n.slug}>
              <NicheCard n={n} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
