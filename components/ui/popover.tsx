"use client";
import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "@/lib/utils";

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export function PopoverContent({ className, align = "end", sideOffset = 8, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        align={align}
        sideOffset={sideOffset}
        className={cn("z-[var(--z-dropdown)] w-72 rounded-md bg-surface-2 p-4 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}
        {...props}
      />
    </P.Portal>
  );
}
