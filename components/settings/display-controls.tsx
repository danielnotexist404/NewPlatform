"use client";
import * as React from "react";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/misc";
import { settingsCopy } from "@/content/he/account";
import { cn } from "./cn";

/**
 * Theme + motion controls. They write the same keys as the TopBar DisplaySettings and the blocking
 * ThemeScript ("theme", "motion"), so all three stay in sync. Server persistence (profiles.theme,
 * profiles.reduce_motion) arrives with Supabase.
 */
type Theme = "dark" | "light" | "system";

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, v: string) {
  try { localStorage.setItem(key, v); } catch { /* storage may be blocked */ }
}
function applyTheme(t: Theme) {
  const d = document.documentElement;
  d.dataset.theme = t === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : t;
}

export function ThemeSegmented({ id = "theme" }: { id?: string }) {
  const [theme, setTheme] = React.useState<Theme>("dark");
  React.useEffect(() => {
    const t = read("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
    if (t === "light" || t === "dark" || t === "system") setTheme(t);
  }, []);
  const opts: { v: Theme; label: string; Icon: typeof Moon }[] = [
    { v: "dark", label: settingsCopy.profile.themeOptions.dark, Icon: Moon },
    { v: "light", label: settingsCopy.profile.themeOptions.light, Icon: Sun },
    { v: "system", label: settingsCopy.profile.themeOptions.system, Icon: MonitorSmartphone },
  ];
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} className="inline-grid grid-cols-3 gap-1 rounded-md bg-surface-2 p-1">
      {opts.map(({ v, label, Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={theme === v}
          onClick={() => {
            setTheme(v);
            write("theme", v);
            applyTheme(v);
            toast.success(settingsCopy.profile.theme + ": " + label);
          }}
          className={cn(
            "flex min-w-24 flex-col items-center gap-1.5 rounded-sm px-4 py-3 text-sm font-semibold text-text-2 transition-colors hover:text-text",
            theme === v && "bg-surface-3 text-text shadow-[inset_0_0_0_1px_var(--color-border-strong)]",
          )}
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}

export function MotionSwitch({ id = "motion" }: { id?: string }) {
  const [reduce, setReduce] = React.useState(false);
  const [osReduce, setOsReduce] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
    setReduce(read("motion") === "reduce");
    setOsReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="font-semibold">{settingsCopy.accessibility.motion}</label>
        <Switch
          id={id}
          checked={osReduce || reduce}
          disabled={osReduce}
          aria-describedby={`${id}-hint`}
          onCheckedChange={(c) => {
            setReduce(c);
            write("motion", c ? "reduce" : "full");
            if (c) document.documentElement.dataset.motion = "reduce";
            else delete document.documentElement.dataset.motion;
          }}
        />
      </div>
      <p id={`${id}-hint`} className="text-small text-text-2">
        {osReduce ? settingsCopy.accessibility.osReduced : settingsCopy.accessibility.motionHint}
      </p>
    </div>
  );
}
