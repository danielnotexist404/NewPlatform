"use client";
import * as React from "react";
import { Switch as Sw, Slider as Sl, Progress as Pr, Separator as Se, ToggleGroup as TG, Avatar as Av } from "radix-ui";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof Sw.Root>) {
  return (
    <Sw.Root className={cn("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border-strong bg-surface-3 transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary", className)} {...props}>
      <Sw.Thumb className="block size-5 rounded-full bg-text shadow transition-transform data-[state=checked]:bg-on-primary ltr:data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5" />
    </Sw.Root>
  );
}

export function Slider({ className, ...props }: React.ComponentProps<typeof Sl.Root>) {
  return (
    <Sl.Root className={cn("relative flex w-full touch-none items-center select-none", className)} {...props}>
      <Sl.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-surface-3">
        <Sl.Range className="absolute h-full bg-primary-text" />
      </Sl.Track>
      {(props.value ?? props.defaultValue ?? [0]).map((_, i) => (
        <Sl.Thumb key={i} className="block size-5 rounded-full border-2 border-primary bg-bg shadow focus-visible:outline-2" />
      ))}
    </Sl.Root>
  );
}

export function Progress({ className, value, variant = "default", ...props }: React.ComponentProps<typeof Pr.Root> & { variant?: "default" | "ai" }) {
  return (
    <Pr.Root className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-3", className)} value={value} {...props}>
      <Pr.Indicator
        className={cn("h-full transition-[width] duration-500 ms-0", variant === "ai" ? "shimmer-ai bg-violet" : "bg-primary-text")}
        style={{ width: `${value ?? 0}%` }}
      />
    </Pr.Root>
  );
}

export function Separator({ className, ...props }: React.ComponentProps<typeof Se.Root>) {
  return <Se.Root className={cn("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)} {...props} />;
}

export const ToggleGroup = ({ className, ...props }: React.ComponentProps<typeof TG.Root>) => (
  <TG.Root className={cn("inline-flex gap-1 rounded-sm bg-surface-2 p-1", className)} {...props} />
);
export function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof TG.Item>) {
  return <TG.Item className={cn("rounded-[8px] px-3 py-1.5 text-sm font-semibold text-text-2 hover:text-text data-[state=on]:bg-surface-3 data-[state=on]:text-text", className)} {...props} />;
}

export function Avatar({ src, name, className }: { src?: string; name: string; className?: string }) {
  return (
    <Av.Root className={cn("inline-flex size-9 shrink-0 overflow-hidden rounded-full bg-surface-3", className)}>
      {src && <Av.Image src={src} alt="" className="size-full object-cover" />}
      <Av.Fallback className="flex size-full items-center justify-center text-sm font-bold text-text-2">{name.slice(0, 1)}</Av.Fallback>
    </Av.Root>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-surface-2", className)} {...props} />;
}
