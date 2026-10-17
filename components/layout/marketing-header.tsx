"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DisplaySettings } from "@/components/a11y/display-settings";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/#how-it-works", label: "איך זה עובד" },
  { href: "/campaigns", label: "קמפיינים" },
  { href: "/niches", label: "נישות" },
  { href: "/hooks", label: "ספריית הוקים" },
  { href: "/trends", label: "טרנדים" },
  { href: "/pricing", label: "מחירים" },
  { href: "/blog", label: "בלוג" },
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
  return (
    <header className={cn("sticky top-0 z-[var(--z-sticky)] h-16 transition-colors", scrolled && "glass shadow-[0_1px_0_var(--color-frame)]")}>
      <div className="container-marketing flex h-full items-center justify-between gap-4">
        <Logo />
        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.href !== "/#how-it-works" && pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-semibold text-text-2 transition-colors hover:text-text",
                      active && "text-text underline decoration-primary-text decoration-2 underline-offset-8",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block"><DisplaySettings /></div>
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "md" }), "hidden min-w-24 lg:inline-flex")}>
            התחברות
          </Link>
          <Link href={SIGNUP_HREF} className={cn(buttonVariants({ size: "md" }), "min-w-28")}>
            <span className="hidden sm:inline">צרו סרטון בחינם</span>
            <span className="sm:hidden">צרו סרטון</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="פתיחת התפריט">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="start" title="תפריט" closeLabel="סגירת התפריט">
              <nav aria-label="ניווט ראשי">
                <ul className="flex flex-col gap-1">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-sm px-3 py-3 text-lg font-semibold hover:bg-surface-2">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li><Link href="/login" className="block rounded-sm px-3 py-3 text-lg font-semibold hover:bg-surface-2">התחברות</Link></li>
                </ul>
              </nav>
              <div className="mt-6"><DisplaySettings /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
