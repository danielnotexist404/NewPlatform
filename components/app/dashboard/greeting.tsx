"use client";
import * as React from "react";
import { APP_CORE } from "@/content/he/app-core";
import { cn } from "@/lib/utils";

const G = APP_CORE.dashboard.greeting;

/** Reads the Israeli hour + date on the client only (cacheComponents: no current time during prerender). */
function snapshot(): string {
  const now = new Date();
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Jerusalem" }).format(now));
  const date = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Jerusalem" }).format(now);
  return `${hour}|${date}`;
}
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}

export function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return G.morning;
  if (hour >= 12 && hour < 17) return G.noon;
  if (hour >= 17) return G.evening;
  return G.night;
}

export function Greeting({ firstName }: { firstName?: string }) {
  const snap = React.useSyncExternalStore(subscribe, snapshot, () => "");
  const [hourStr, date] = snap.split("|");
  const known = snap !== "";
  const word = known ? greetingFor(Number(hourStr)) : G.night;
  return (
    <div className="flex flex-col gap-2">
      <p className={cn("text-small font-semibold text-muted transition-opacity duration-300", known ? "opacity-100" : "opacity-0")} aria-hidden={!known}>
        {date || " "}
      </p>
      <h1 className={cn("text-h1 transition-opacity duration-300", known ? "opacity-100" : "opacity-0")}>
        {word}
        {firstName ? `, ${firstName}` : ""}
      </h1>
    </div>
  );
}
