"use client";
import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sheet = Dialog that slides from a logical side. side="start" is the right edge in RTL. */
export const Sheet = D.Root;
export const SheetTrigger = D.Trigger;
export const SheetClose = D.Close;

export function SheetContent({ className, children, side = "start", title, closeLabel = "סגירה", ...props }: React.ComponentProps<typeof D.Content> & { side?: "start" | "end" | "bottom"; title: string; closeLabel?: string }) {
  const pos =
    side === "bottom"
      ? "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-lg"
      : side === "start"
        ? "inset-y-0 inset-s-0 w-full max-w-sm"
        : "inset-y-0 inset-e-0 w-full max-w-sm";
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-overlay" />
      <D.Content className={cn("fixed z-[var(--z-modal)] flex flex-col overflow-y-auto bg-surface-1 p-5 elev-3", pos, className)} {...props}>
        <div className="mb-4 flex items-center justify-between">
          <D.Title className="text-h3">{title}</D.Title>
          <D.Close className="rounded-full p-2 text-text-2 hover:bg-surface-2 hover:text-text" aria-label={closeLabel}>
            <X className="size-5" aria-hidden />
          </D.Close>
        </div>
        <D.Description className="sr-only">{title}</D.Description>
        {children}
      </D.Content>
    </D.Portal>
  );
}
