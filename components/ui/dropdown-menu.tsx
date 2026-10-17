"use client";
import * as React from "react";
import { DropdownMenu as M } from "radix-ui";
import { cn } from "@/lib/utils";

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;
export function DropdownMenuContent({ className, align = "end", sideOffset = 6, ...props }: React.ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content align={align} sideOffset={sideOffset} className={cn("z-[var(--z-dropdown)] min-w-48 rounded-md bg-surface-2 p-1 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)} {...props} />
    </M.Portal>
  );
}
export function DropdownMenuItem({ className, danger, ...props }: React.ComponentProps<typeof M.Item> & { danger?: boolean }) {
  return (
    <M.Item
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none select-none data-[highlighted]:bg-surface-3 [&_svg]:size-4",
        danger ? "text-danger" : "text-text",
        className,
      )}
      {...props}
    />
  );
}
export function DropdownMenuSeparator() {
  return <M.Separator className="my-1 h-px bg-border" />;
}
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof M.Label>) {
  return <M.Label className={cn("px-2.5 py-1.5 text-micro text-muted", className)} {...props} />;
}
