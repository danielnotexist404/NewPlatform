"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { NicheIcon } from "./niche-icon";
import { useMediaQuery } from "./use-motion";
import { searchKey } from "./create-link";
import { LANDING } from "@/content/he/landing";

export interface NicheOption { slug: string; label: string; icon: string; search: string }
export interface NicheGroup { slug: string; label: string; items: NicheOption[] }

const T = LANDING.heroCard.picker;

function PickerBody({ groups, selected, onSelect }: { groups: NicheGroup[]; selected: string | null; onSelect: (slug: string | null) => void }) {
  const [q, setQ] = React.useState("");
  const id = React.useId();
  const needle = searchKey(q.trim());
  const filtered = needle
    ? groups.map((g) => ({ ...g, items: g.items.filter((n) => n.search.includes(needle)) })).filter((g) => g.items.length > 0)
    : groups;
  const count = filtered.reduce((s, g) => s + g.items.length, 0);
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`${id}-q`} className="sr-only">{T.searchLabel}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input id={`${id}-q`} value={q} onChange={(e) => setQ(e.target.value)} placeholder={T.searchPlaceholder} className="ps-9" autoComplete="off" />
      </div>
      <p className="sr-only" aria-live="polite">{needle ? (count === 0 ? T.empty : `${count} תוצאות`) : ""}</p>
      <div className="max-h-[50dvh] overflow-y-auto overscroll-contain pe-1 md:max-h-80">
        {count === 0 && <p className="px-1 py-3 text-small text-text-2">{T.empty}</p>}
        {filtered.map((g) => (
          <div key={g.slug} role="group" aria-labelledby={`${id}-${g.slug}`} className="mb-3">
            <p id={`${id}-${g.slug}`} className="mb-1 px-1 text-micro text-muted">{g.label}</p>
            <ul className="flex flex-col">
              {g.items.map((n) => (
                <li key={n.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(n.slug)}
                    aria-pressed={selected === n.slug}
                    className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-start text-sm font-semibold text-text hover:bg-surface-3 aria-pressed:bg-surface-3 aria-pressed:text-primary-text"
                  >
                    <NicheIcon name={n.icon} className="size-4 text-text-2" />
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="rounded-sm border border-dashed border-border-strong px-3 py-2.5 text-start text-sm font-semibold text-text-2 hover:bg-surface-3 hover:text-text"
      >
        {T.other}
      </button>
    </div>
  );
}

/** NichePicker (Part 02 §3.3.3): Popover on desktop, bottom Sheet on mobile, search + groups by category + "עסק אחר". */
export function NichePicker({
  groups, selected, onSelect, trigger,
}: {
  groups: NicheGroup[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  trigger: React.ReactElement;
}) {
  const desktop = useMediaQuery("(min-width: 48rem)");
  const [open, setOpen] = React.useState(false);
  const pick = (slug: string | null) => {
    onSelect(slug);
    setOpen(false);
  };
  if (desktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align="start" className="w-[22rem] p-3" aria-label={T.title}>
          <PickerBody groups={groups} selected={selected} onSelect={pick} />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" title={T.title} closeLabel={T.close}>
        <PickerBody groups={groups} selected={selected} onSelect={pick} />
      </SheetContent>
    </Sheet>
  );
}
