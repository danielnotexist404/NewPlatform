"use client";
import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { LANDING } from "@/content/he/landing";

const KEY = "announcement.dismissed.meta-campaigns-v2";
const P = LANDING.promo;

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readDismissed = () => {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
};

/** Thin accent promo bar. Rendered on the server (no layout shift); hidden only for visitors who dismissed it. */
export function AnnouncementBar() {
  const stored = React.useSyncExternalStore(subscribe, readDismissed, () => false);
  const [closed, setClosed] = React.useState(false);
  if (stored || closed) return null;
  return (
    <div className="relative z-[calc(var(--z-sticky)+1)] flex h-9 items-center justify-center bg-accent-gradient px-10 text-ink">
      <Link href={P.href} className="group inline-flex min-w-0 items-center gap-2 text-small font-semibold">
        <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-micro leading-none text-paper">{P.badge}</span>
        <span className="truncate max-sm:hidden">{P.text}</span>
        <span className="truncate sm:hidden">{P.textShort}</span>
        <DirIcon name="forward" className="size-3.5 shrink-0 transition-transform duration-300 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
      </Link>
      <button
        type="button"
        aria-label={P.dismiss}
        className="absolute inset-e-2 rounded-full p-1.5 text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
        onClick={() => {
          setClosed(true);
          try { localStorage.setItem(KEY, "1"); } catch { /* storage may be blocked */ }
        }}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
