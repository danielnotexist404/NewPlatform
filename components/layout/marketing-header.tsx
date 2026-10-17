"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DisplaySettings } from "@/components/a11y/display-settings";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { accentCta } from "./cta-styles";

export const NAV = [
  { href: "/#how-it-works", label: "איך זה עובד" },
  { href: "/examples", label: "דוגמאות" },
  { href: "/trends", label: "טרנדים" },
  { href: "/pricing", label: "מחירים" },
  { href: "/faq", label: "שאלות" },
] as const;

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href);
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] h-16 px-2 md:px-4">
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-3 rounded-full px-3 transition-[max-width,height,margin,background-color,box-shadow,backdrop-filter] duration-500 ease-out md:px-5",
          scrolled
            ? "glass mt-2 h-12 max-w-[1080px] shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_12px_32px_-12px_color-mix(in_oklab,var(--color-ink)_18%,transparent),inset_0_0_0_1px_var(--color-frame)] md:h-14"
            : "max-w-[1240px]",
        )}
      >
        <Logo className={cn("transition-transform duration-500", scrolled && "scale-95")} />
        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-text-2 transition-colors hover:bg-surface-3/70 hover:text-text",
                      active && "text-text after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:size-1 after:rounded-full after:bg-coral",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-[0.95rem] font-semibold text-text transition-colors hover:bg-surface-3/70 sm:inline-flex"
          >
            התחברות
          </Link>
          <Link href={SIGNUP_HREF} className={cn(accentCta, "h-10 px-4 text-sm md:px-5", scrolled && "md:h-10")}>
            <span className="hidden sm:inline">צרו סרטון בחינם</span>
            <span className="sm:hidden">צרו סרטון</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="פתיחת התפריט">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="end" title="תפריט" closeLabel="סגירת התפריט" className="gap-2">
              <nav aria-label="ניווט ראשי">
                <ul className="flex flex-col">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className="flex items-center justify-between rounded-md px-3 py-3.5 text-lg font-semibold hover:bg-surface-2 aria-[current=page]:text-primary-text"
                        >
                          {item.label}
                          <DirIcon name="next" className="size-4 text-muted" />
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-5">
                <SheetClose asChild>
                  <Link href={SIGNUP_HREF} className={cn(accentCta, "h-12 text-base")}>צרו סרטון בחינם</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-full font-semibold ring-hairline hover:bg-surface-2">
                    התחברות
                  </Link>
                </SheetClose>
              </div>
              <div className="mt-auto pt-6"><DisplaySettings /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
