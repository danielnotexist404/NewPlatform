"use client";
import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem, Switch } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";

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

export function DisplaySettings() {
  const [theme, setTheme] = React.useState<Theme>("dark");
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const t = read("theme");
    if (t === "light" || t === "dark" || t === "system") setTheme(t);
    setReduce(read("motion") === "reduce");
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="הגדרות תצוגה">
          <SlidersHorizontal aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span id="theme-label" className="text-sm font-semibold">ערכת נושא</span>
          <ToggleGroup
            type="single"
            aria-labelledby="theme-label"
            value={theme}
            onValueChange={(v) => {
              if (!v) return;
              setTheme(v as Theme);
              write("theme", v);
              applyTheme(v as Theme);
            }}
          >
            <ToggleGroupItem value="dark">כהה</ToggleGroupItem>
            <ToggleGroupItem value="light">בהירה</ToggleGroupItem>
            <ToggleGroupItem value="system">לפי המכשיר</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">
          עצירת אנימציות
          <Switch
            checked={reduce}
            onCheckedChange={(c) => {
              setReduce(c);
              write("motion", c ? "reduce" : "full");
              if (c) document.documentElement.dataset.motion = "reduce";
              else delete document.documentElement.dataset.motion;
            }}
          />
        </label>
      </PopoverContent>
    </Popover>
  );
}
