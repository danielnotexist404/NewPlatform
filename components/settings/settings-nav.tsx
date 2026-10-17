"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Building2, Accessibility, ShieldCheck, Mic, Plug, UserRound } from "lucide-react";
import { settingsCopy } from "@/content/he/account";
import { cn } from "./cn";

const ITEMS = [
  { href: "/app/settings", label: settingsCopy.nav.profile, icon: UserRound, exact: true },
  { href: "/app/settings#workspace", label: settingsCopy.nav.workspace, icon: Building2, anchor: true },
  { href: "/app/settings/notifications", label: settingsCopy.nav.notifications, icon: Bell },
  { href: "/app/settings/accessibility", label: settingsCopy.nav.accessibility, icon: Accessibility },
  { href: "/app/settings/privacy", label: settingsCopy.nav.privacy, icon: ShieldCheck },
  { href: "/app/settings/pronunciation", label: settingsCopy.nav.pronunciation, icon: Mic },
  { href: "/app/settings/integrations", label: settingsCopy.nav.integrations, icon: Plug },
] as const;

/** Secondary settings nav (Part 03 §16): a column at the start on desktop, a scrollable chip row on mobile. */
export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label={settingsCopy.navLabel} className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      <ul className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
        {ITEMS.map((item) => {
          const active = "anchor" in item ? false : "exact" in item ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold text-text-2 transition-colors hover:bg-surface-2 hover:text-text lg:rounded-sm lg:border-s-2 lg:border-transparent",
                  active && "bg-surface-3 text-text lg:border-primary-text lg:bg-surface-2",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
