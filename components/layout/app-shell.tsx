"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Plus, FolderOpen, Flame, Megaphone, Inbox, CalendarClock, LayoutTemplate, BookOpen,
  Palette, Images, Users, Briefcase, CreditCard, Settings, Globe, CalendarRange, Menu,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DisplaySettings } from "@/components/a11y/display-settings";
import { SkipLink } from "@/components/a11y/skip-link";
import { cn } from "@/lib/utils";

/** SidebarNav order — spec 07–08 §L.1 (+ §S: התוכנית שלי, דפי עסק). */
export const APP_NAV = [
  { href: "/app", label: "ראשי", icon: Home, exact: true },
  { href: "/app/create", label: "סרטון חדש", icon: Plus, accent: true },
  { href: "/app/projects", label: "פרויקטים", icon: FolderOpen },
  { href: "/app/trends", label: "טרנדים", icon: Flame },
  { href: "/app/campaigns", label: "קמפיינים", icon: Megaphone },
  { href: "/app/leads", label: "לידים", icon: Inbox },
  { href: "/app/publish", label: "פרסום ותזמון", icon: CalendarClock },
  { href: "/app/plan", label: "התוכנית שלי", icon: CalendarRange },
  { href: "/app/landing-pages", label: "דפי עסק", icon: Globe },
  { href: "/app/templates", label: "תבניות", icon: LayoutTemplate },
  { href: "/app/hooks", label: "ספריית הוקים", icon: BookOpen },
  { href: "/app/brand", label: "ערכת מותג", icon: Palette },
  { href: "/app/library", label: "ספריית מדיה", icon: Images },
  { href: "/app/team", label: "צוות", icon: Users },
  { href: "/app/clients", label: "לקוחות", icon: Briefcase },
  { href: "/app/billing", label: "חיוב וקרדיטים", icon: CreditCard },
  { href: "/app/settings", label: "הגדרות", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-0.5">
      {APP_NAV.map((item) => {
        const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold text-text-2 transition-colors hover:bg-surface-2 hover:text-text",
                active && "bg-surface-3 text-text",
                "accent" in item && item.accent && "text-primary-text",
              )}
            >
              <Icon className="size-[18px]" aria-hidden />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function CreditsMeter({ credits = 400 }: { credits?: number }) {
  return (
    <Link href="/app/billing" className="flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold hover:bg-surface-3">
      <span className="size-2 rounded-full bg-primary" aria-hidden />
      <bdi className="num">{credits.toLocaleString("he-IL")}</bdi> קרדיטים
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  // Onboarding is a focused full-screen flow without the sidebar (Part 03 §4).
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
  return (
    <div data-shell="app" className="min-h-dvh bg-bg">
      <SkipLink />
      <aside className="fixed inset-y-0 inset-s-0 z-[var(--z-sticky)] hidden w-64 flex-col gap-4 border-e border-border bg-surface-1 p-4 lg:flex">
        <Logo href="/app" />
        <nav aria-label="ניווט באפליקציה" className="flex-1 overflow-y-auto">
          <NavList />
        </nav>
      </aside>
      <div className="lg:ps-64">
        <header className="sticky top-0 z-[var(--z-sticky)] flex h-14 items-center justify-between gap-3 border-b border-border glass px-4">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="פתיחת התפריט">
                  <Menu aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="start" title="תפריט" closeLabel="סגירת התפריט">
                <NavList onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="lg:hidden"><Logo href="/app" /></span>
          </div>
          <div className="flex items-center gap-2">
            <CreditsMeter />
            <DisplaySettings />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] px-4 py-6 outline-none md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
