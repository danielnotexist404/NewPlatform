"use client";
import * as React from "react";
import { Tooltip as T } from "radix-ui";
import { cn } from "@/lib/utils";

export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content side={side} sideOffset={6} className={cn("z-[var(--z-toast)] max-w-64 rounded-xs bg-surface-3 px-2.5 py-1.5 text-small text-text elev-2")}>
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}
