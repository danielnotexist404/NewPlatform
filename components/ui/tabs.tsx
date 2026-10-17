"use client";
import * as React from "react";
import { Tabs as T } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = T.Root;

export function TabsList({ className, variant = "pills", ...props }: React.ComponentProps<typeof T.List> & { variant?: "pills" | "underline" }) {
  return (
    <T.List
      className={cn(
        variant === "pills" ? "inline-flex gap-1 rounded-full bg-surface-2 p-1" : "flex gap-6 border-b border-border",
        className,
      )}
      data-variant={variant}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-semibold text-text-2 transition-colors hover:text-text data-[state=active]:bg-surface-3 data-[state=active]:text-text",
        "[[data-variant=underline]_&]:rounded-none [[data-variant=underline]_&]:px-0 [[data-variant=underline]_&]:pb-3 [[data-variant=underline]_&]:data-[state=active]:bg-transparent [[data-variant=underline]_&]:data-[state=active]:shadow-[inset_0_-2px_0_var(--color-primary-text)]",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = T.Content;
