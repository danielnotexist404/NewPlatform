"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Home, Inbox, Megaphone, Plus, UserRound } from "lucide-react";
import { Logo } from "./logo";
import { accentCta } from "./cta-styles";
import { DisplaySettings } from "@/components/a11y/display-settings";
import { SkipLink } from "@/components/a11y/skip-link";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { cn } from "@/lib/utils";

const N = SIMPLE_APP.nav;

/** Six destinations (founder feedback): everything else is reached from inside these pages. */
export const APP_NAV = [
  { href: "/app", label: N.home, short: N.home, icon: Home, match: (p: string) => p === "/app" || p.startsWith("/app/trends") || p.startsWith("/app/plan") },
  { href: "/app/projects", label: N.videos, short: N.videosShort, icon: Clapperboard, match: (p: string) => p.startsWith("/app/projects") || p.startsWith("/app/publish") || p.startsWith("/app/templates") || p.startsWith("/app/hooks") || p.startsWith("/app/library") },
  { href: "/app/campaigns", label: N.campaigns, short: N.campaigns, icon: Megaphone, match: (p: string) => p.startsWith("/app/campaigns") || p.startsWith("/app/landing-pages") },
  { href: "/app/leads", label: N.leads, short: N.leads, icon: Inbox, match: (p: string) => p.startsWith("/app/leads") },
  { href: "/app/account", label: N.account, short: N.account, icon: UserRound, match: (p: string) => ["/app/account", "/app/brand", "/app/billing", "/app/settings", "/app/team", "/app/clients"].some((x) => p.startsWith(x)) },
] as const;

export function CreditsMeter({ credits = 400, className }: { credits?: number; className?: string }) {
  return (
    <Link
      href="/app/billing"
      aria-label={`${credits.toLocaleString("he-IL")} ${N.credits}, ${N.buyCredits}`}
      className={cn("inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:bg-surface-3", className)}
    >
      <span className="size-2 rounded-full bg-accent-gradient" aria-hidden />
      <bdi className="num">{credits.toLocaleString("he-IL")}</bdi>
      <span className="text-text-2">{N.credits}</span>
    </Link>
  );
}

function SideNav() {
  const pathname = usePathname();
  const creating = pathname.startsWith("/app/create") || /\/create(\/|$)/.test(pathname);
  return (
    <nav aria-label={N.label} className="flex flex-col gap-6">
      <Link href="/app/create" aria-current={creating ? "page" : undefined} className={cn(accentCta, "h-12 w-full text-base")}>
        <Plus className="size-5" aria-hidden />
        {N.create}
      </Link>
      <ul className="flex flex-col gap-1">
        {APP_NAV.map((item) => {
          const active = !creating && item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-full px-4 text-[15px] font-semibold text-text-2 transition-colors hover:bg-surface-2 hover:text-text",
                  active && "bg-surface-3 text-text",
                )}
              >
                <Icon className={cn("size-[19px]", active ? "text-primary-text" : "")} strokeWidth={active ? 2.2 : 1.9} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mobile bottom tab bar: 5 items, the create button raised in the middle. */
function TabBar() {
  const pathname = usePathname();
  const [home, videos, campaigns, leads] = APP_NAV;
  const tab = (item: (typeof APP_NAV)[number]) => {
    const active = item.match(pathname);
    const Icon = item.icon;
    return (
      <li key={item.href} className="flex-1">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-text" : "text-muted")}
        >
          <Icon className={cn("size-[22px]", active && "text-primary-text")} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
          {item.short}
        </Link>
      </li>
    );
  };
  return (
    <nav aria-label={N.label} className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border bg-surface-1/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch px-2">
        {tab(home)}
        {tab(videos)}
        <li className="flex flex-1 items-center justify-center">
          <Link href="/app/create" aria-label={N.create} className={cn(accentCta, "-mt-5 size-14 rounded-full p-0")}>
            <Plus className="size-6" strokeWidth={2.4} aria-hidden />
          </Link>
        </li>
        {tab(campaigns)}
        {tab(leads)}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Onboarding is a focused full-screen flow without navigation (Part 03 §4).
  if (pathname.startsWith("/app/onboarding")) {
    return (
      <div data-shell="app" className="min-h-dvh bg-bg">
        <SkipLink />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[960px] px-4 py-8 outline-none md:px-8">
          {children}
        </main>
      </div>
    );
  }
  // Focused flows (create, campaign builder, publish composer) have their own bottom action bar on mobile.
  const focused = ["/app/create", "/app/campaigns/new", "/app/publish/new"].some((x) => pathname.startsWith(x));
  return (
    <div data-shell="app" className="min-h-dvh bg-bg">
      <SkipLink />
      <aside className="fixed inset-y-0 inset-s-0 z-[var(--z-sticky)] hidden w-[264px] flex-col gap-8 border-e border-border bg-surface-1 px-5 py-6 lg:flex">
        <Logo href="/app" className="px-2" />
        <SideNav />
        <div className="mt-auto flex items-center justify-between gap-2">
          <CreditsMeter />
          <DisplaySettings />
        </div>
      </aside>
      <div className="lg:ps-[264px]">
        <header className="sticky top-0 z-[var(--z-sticky)] flex h-14 items-center justify-between gap-3 border-b border-border glass px-4 lg:hidden">
          <Logo href="/app" />
          <div className="flex items-center gap-1.5">
            <CreditsMeter />
            <Link
              href="/app/account"
              aria-label={N.account}
              className="flex size-10 items-center justify-center rounded-full text-text-2 hover:bg-surface-2 hover:text-text"
            >
              <UserRound className="size-5" aria-hidden />
            </Link>
          </div>
        </header>
        <main
          id="main"
          tabIndex={-1}
          className={cn("mx-auto w-full max-w-[1180px] px-4 pt-6 outline-none md:px-10 lg:pt-12", focused ? "pb-8" : "pb-28 lg:pb-16")}
        >
          {children}
        </main>
      </div>
      {!focused && <TabBar />}
    </div>
  );
}
