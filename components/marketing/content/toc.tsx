"use client";
import * as React from "react";
import { ChevronDown, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  n?: number;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string | null>(null);
  React.useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = ids.find((id) => visible.get(id));
        if (first) setActive(first);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/**
 * Table of contents from the H2s (Part 02 §8.1 / §10.1): sticky list on desktop with the
 * current section marked, collapsible box on mobile.
 */
export function Toc({ items, title, variant }: { items: TocItem[]; title: string; variant: "desktop" | "mobile" }) {
  const ids = React.useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveSection(ids);

  const list = (
    <ol className="flex flex-col gap-0.5">
      {items.map((it) => {
        const on = active === it.id;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={on ? "location" : undefined}
              className={cn(
                "flex gap-2 rounded-sm border-s-2 py-1.5 ps-3 pe-2 text-small leading-snug transition-colors",
                on ? "border-primary-text bg-surface-2/60 font-semibold text-text" : "border-border text-text-2 hover:border-border-strong hover:text-text",
              )}
            >
              {it.n !== undefined && <span className="num shrink-0 text-muted">{it.n}.</span>}
              <span>{it.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "mobile") {
    return (
      <details className="group my-6 rounded-md bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold">
          <span className="flex items-center gap-2">
            <ListTree aria-hidden className="size-4 text-primary-text" />
            {title}
          </span>
          <ChevronDown aria-hidden className="size-4 text-text-2 transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label={title} className="px-2 pb-3">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label={title} className="sticky top-[calc(var(--header-h)+24px)] max-h-[calc(100dvh-var(--header-h)-48px)] overflow-y-auto pb-6">
      <p className="mb-3 flex items-center gap-2 text-micro text-muted">
        <ListTree aria-hidden className="size-4" />
        {title}
      </p>
      {list}
    </nav>
  );
}
