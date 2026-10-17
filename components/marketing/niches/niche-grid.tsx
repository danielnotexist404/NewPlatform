"use client";
import * as React from "react";
import Link from "next/link";
import { Search, ShieldCheck, X } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { NICHES_COPY } from "@/content/he/niches";
import { plural, normalize } from "@/components/hooks/text";
import { cn } from "@/lib/utils";
import { NicheIcon } from "./niche-icon";
import { SmartText } from "@/components/hooks/hook-text";
import { tintFor } from "./reel-tile";

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
  return (
    <article
      className="group relative flex h-full flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[background-color,box-shadow] duration-200 hover:bg-surface-2 hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tint)_40%,transparent)]"
      style={{ "--tint": tint } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--tint)_16%,transparent)] text-[var(--tint)]">
          <NicheIcon name={n.icon} className="size-6" />
        </span>
        {n.compliance && (
          <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
            <ShieldCheck className="size-3.5" aria-hidden />
            {H.compliance}
          </span>
        )}
      </div>
      <h3 className="text-body-lg font-bold leading-snug">
        <Link href={`/niches/${n.slug}`} className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-focus">
          {n.name}
        </Link>
      </h3>
      <p className="line-clamp-2 text-small text-text-2">
        <SmartText text={n.description} />
      </p>
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-2 text-sm font-semibold">
        <span className="inline-flex items-center gap-1 text-primary-text" aria-hidden>
          {H.cardPrimary} <DirIcon name="forward" className="size-4 transition-transform group-hover:rtl:-translate-x-0.5 group-hover:ltr:translate-x-0.5" />
        </span>
        <Link href={`/hooks/${n.slug}`} className="num rounded-full bg-surface-3 px-2.5 py-1 text-micro text-text-2 hover:text-text">
          {plural(n.hookCount, H.cardHooks)}
        </Link>
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
        <div className="relative max-w-2xl">
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
        <p aria-live="polite" className={cn("num text-small text-muted", !nq && "sr-only")}>
          {plural(total, H.results)}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg bg-surface-1 p-8 text-center text-body-lg text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{H.noResults}</p>
      ) : (
        filtered.map((g) => (
          <section key={g.slug} aria-labelledby={`cat-${g.slug}`} className="grid gap-4 border-t border-border pt-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8">
            <div>
              <h2 id={`cat-${g.slug}`} className="text-h3 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
                {g.name}
                <span className="num mt-1 block text-small font-normal text-muted">{plural(g.niches.length, H.results)}</span>
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {g.niches.map((n) => (
                <li key={n.slug}>
                  <NicheCard n={n} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
