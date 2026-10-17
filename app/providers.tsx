"use client";
import { Direction, Tooltip } from "radix-ui";
import { Toaster } from "sonner";

export function Providers({ children, dir }: { children: React.ReactNode; dir: "rtl" | "ltr" }) {
  return (
    <Direction.Provider dir={dir}>
      <Tooltip.Provider delayDuration={300}>
        {children}
        <Toaster
          dir={dir}
          position="top-center"
          closeButton
          duration={5000}
          style={{
            "--normal-bg": "var(--color-surface-2)",
            "--normal-text": "var(--color-text)",
            "--normal-border": "var(--color-border-strong)",
          } as React.CSSProperties}
        />
      </Tooltip.Provider>
    </Direction.Provider>
  );
}
