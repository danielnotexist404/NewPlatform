"use client";
import * as React from "react";

export type ShellThemeName = "light" | "dark";

/** The theme a shell uses when the visitor never chose one (stored "light" / "dark" / "system" always wins). */
export function resolveTheme(shellDefault: ShellThemeName): ShellThemeName {
  let stored: string | null = null;
  try { stored = localStorage.getItem("theme"); } catch { /* storage may be blocked */ }
  if (stored === "light" || stored === "dark") return stored;
  if (stored === "system") return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  return shellDefault;
}

/**
 * Applies the shell's default theme after client-side navigation between shells
 * (both shells default to light). The first paint is handled by the blocking ThemeScript.
 */
export function ShellTheme({ theme }: { theme: ShellThemeName }) {
  React.useEffect(() => {
    document.documentElement.dataset.theme = resolveTheme(theme);
  }, [theme]);
  return null;
}
