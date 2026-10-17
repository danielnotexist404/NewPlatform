"use client";
import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({ className, children, size = "md", closeLabel = "סגירה", ...props }: React.ComponentProps<typeof D.Content> & { size?: "md" | "lg" | "xl"; closeLabel?: string }) {
  const w = size === "xl" ? "max-w-[880px]" : size === "lg" ? "max-w-[640px]" : "max-w-[480px]";
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-overlay" />
      <D.Content
        className={cn(
          "fixed inset-s-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100%-32px)] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-lg bg-surface-1 p-6 elev-3 shadow-[inset_0_0_0_1px_var(--color-frame)]",
          w,
          className,
        )}
        {...props}
      >
        {children}
        <D.Close className="absolute inset-e-4 top-4 rounded-full p-1.5 text-text-2 hover:bg-surface-2 hover:text-text" aria-label={closeLabel}>
          <X className="size-5" aria-hidden />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
export function DialogTitle({ className, ...props }: React.ComponentProps<typeof D.Title>) {
  return <D.Title className={cn("text-h3 pe-8", className)} {...props} />;
}
export function DialogDescription({ className, ...props }: React.ComponentProps<typeof D.Description>) {
  return <D.Description className={cn("mt-2 text-text-2", className)} {...props} />;
}
