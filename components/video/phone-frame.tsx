import * as React from "react";
import type { Aspect } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

/**
 * Generic phone (not a vendor model) for 9:16; a "feed post" card for 1:1 and 16:9 (Part 01 §10.6).
 * `width` is the screen width in px; it shrinks to the container on small screens.
 */
export function PhoneFrame({
  aspect = "9:16",
  width = 300,
  chrome = "phone",
  label,
  glow,
  header,
  className,
  children,
}: {
  aspect?: Aspect;
  width?: number;
  chrome?: "phone" | "bare";
  label?: string;
  glow?: boolean;
  header?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  if (aspect !== "9:16") {
    const w = aspect === "16:9" ? Math.round(width * 1.75) : Math.round(width * 1.12);
    return (
      <div role="group" aria-label={label} className={cn("relative mx-auto w-full", className)} style={{ maxWidth: w }}>
        {glow && <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />}
        <div className="overflow-hidden rounded-lg bg-surface-1 elev-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          {header && <div className="flex items-center gap-2.5 px-3.5 py-2.5">{header}</div>}
          <div className={cn("@container relative isolate w-full overflow-hidden bg-black", aspect === "16:9" ? "aspect-wide" : "aspect-square")}>
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (chrome === "bare") {
    return (
      <div role="group" aria-label={label} className={cn("relative mx-auto w-full", className)} style={{ maxWidth: width }}>
        <div className="@container relative isolate aspect-reel w-full overflow-hidden rounded-[28px] bg-black elev-3">{children}</div>
      </div>
    );
  }
  return (
    <div role="group" aria-label={label} className={cn("relative mx-auto w-full", className)} style={{ maxWidth: width + 20 }}>
      {glow && <div aria-hidden className="absolute -inset-12 -z-10 rounded-full bg-primary/12 blur-3xl" />}
      <div className="relative rounded-[44px] border border-border-strong/40 bg-surface-3 p-[10px] elev-3">
        <div className="@container relative isolate aspect-reel w-full overflow-hidden rounded-[34px] bg-black">
          {children}
          <span aria-hidden className="absolute inset-s-1/2 top-2.5 z-20 h-[18px] w-[28%] rounded-full bg-black ltr:-translate-x-1/2 rtl:translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
