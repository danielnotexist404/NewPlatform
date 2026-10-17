"use client";
import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NicheIcon } from "./niche-icon";
import { cn } from "@/lib/utils";

export interface NicheOption { slug: string; nameHe: string; shortHe: string; icon: string }

const normalize = (s: string) => s.replace(/[֑-ׇ]/g, "").replace(/[״"׳']/g, "").replace(/\s+/g, " ").trim();

/** Compact niche combobox for the trends feed and trend page (Part 01 §10.14 "combobox" spirit). */
export function NichePicker({
  options, value, onChange, workspaceSlug, label, searchLabel, emptyLabel, workspaceLabel, className, id,
}: {
  options: NicheOption[];
  value: string;
  onChange: (slug: string) => void;
  workspaceSlug?: string;
  label: string;
  searchLabel: string;
  emptyLabel: string;
  workspaceLabel?: string;
  className?: string;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const current = options.find((o) => o.slug === value) ?? options[0];
  const nq = normalize(q);
  const list = nq ? options.filter((o) => normalize(o.nameHe).includes(nq) || normalize(o.shortHe).includes(nq)) : options;
  const ordered = workspaceSlug && !nq
    ? [...list.filter((o) => o.slug === workspaceSlug), ...list.filter((o) => o.slug !== workspaceSlug)]
    : list;
  const listId = React.useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span id={`${listId}-label`} className="text-micro text-muted">{label}</span>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-labelledby={`${listId}-label ${listId}-value`}
            className="flex h-11 w-full min-w-56 items-center gap-2.5 rounded-sm border border-border-strong bg-surface-2 px-3 text-start text-sm font-semibold transition-colors hover:bg-surface-3 md:w-72"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text">
              <NicheIcon name={current?.icon} className="size-4" />
            </span>
            <span id={`${listId}-value`} className="min-w-0 flex-1 truncate">{current?.shortHe}</span>
            <ChevronDown aria-hidden className="size-4 shrink-0 text-text-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[min(22rem,calc(100vw-32px))] p-0">
          <div className="relative border-b border-border p-2">
            <Search aria-hidden className="pointer-events-none absolute inset-s-5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label={searchLabel}
              aria-controls={listId}
              placeholder={searchLabel}
              className="h-10 w-full rounded-sm bg-surface-1 ps-9 pe-3 text-sm text-text placeholder:text-muted focus-visible:outline-2"
            />
          </div>
          <ul id={listId} aria-label={label} className="max-h-80 overflow-y-auto p-1.5">
            {ordered.length === 0 && <li className="px-3 py-6 text-center text-small text-muted">{emptyLabel}</li>}
            {ordered.map((o) => {
              const selected = o.slug === value;
              return (
                <li key={o.slug}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => { onChange(o.slug); setOpen(false); setQ(""); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-start text-sm transition-colors hover:bg-surface-3",
                      selected && "bg-surface-3 font-semibold",
                    )}
                  >
                    <NicheIcon name={o.icon} className="size-4 shrink-0 text-text-2" />
                    <span className="min-w-0 flex-1">{o.nameHe}</span>
                    {o.slug === workspaceSlug && workspaceLabel && <span className="shrink-0 text-micro text-primary-text">{workspaceLabel}</span>}
                    {selected && <Check aria-hidden className="size-4 shrink-0 text-primary-text" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
