"use client";
import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import type { RangeKey } from "@/lib/mock/campaigns";
import { RANGE_LABEL } from "@/content/he/campaigns-app";

const STORAGE_KEY = "campaigns.report.range"; // allowed key (Part 03 §1, browser storage list)

export function useStoredRange<T extends RangeKey>(fallback: T, allowed: readonly T[]): [T, (r: T) => void] {
  const [range, setRange] = React.useState<T>(fallback);
  React.useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as T | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the remembered range after mount
      if (v && allowed.includes(v)) setRange(v);
    } catch {
      /* storage blocked */
    }
  }, [allowed]);
  const update = React.useCallback((r: T) => {
    setRange(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* storage blocked */
    }
  }, []);
  return [range, update];
}

export function RangePicker<T extends RangeKey>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: readonly T[]; label: string }) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      aria-label={label}
      className="max-w-full overflow-x-auto rounded-full [scrollbar-width:none]"
    >
      {options.map((o) => (
        <ToggleGroupItem key={o} value={o} className="shrink-0 rounded-full px-3.5">
          {RANGE_LABEL[o]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
