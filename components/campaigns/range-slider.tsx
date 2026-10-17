"use client";
import * as React from "react";
import { Slider as Sl } from "radix-ui";
import { cn } from "@/lib/utils";

/** Two-thumb slider with a label per thumb (the shared Slider has no per-thumb labels). Follows RTL via Direction provider. */
export function RangeSlider({
  value,
  onValueChange,
  onValueCommit,
  min,
  max,
  step = 1,
  thumbLabels,
  className,
}: {
  value: [number, number];
  onValueChange: (v: [number, number]) => void;
  onValueCommit?: (v: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  thumbLabels: [string, string];
  className?: string;
}) {
  return (
    <Sl.Root
      className={cn("relative flex h-6 w-full touch-none items-center select-none", className)}
      value={value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      onValueChange={(v) => onValueChange([v[0], v[1]])}
      onValueCommit={onValueCommit ? (v) => onValueCommit([v[0], v[1]]) : undefined}
    >
      <Sl.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-surface-3">
        <Sl.Range className="absolute h-full bg-primary-text" />
      </Sl.Track>
      {thumbLabels.map((l) => (
        <Sl.Thumb key={l} aria-label={l} className="block size-6 rounded-full border-2 border-primary bg-bg shadow transition-transform hover:scale-110 focus-visible:outline-2" />
      ))}
    </Sl.Root>
  );
}
