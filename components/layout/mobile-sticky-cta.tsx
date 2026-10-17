"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./whatsapp-button";
import { accentCta } from "./cta-styles";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileStickyCta() {
  const pathname = usePathname();
  const hiddenRoute = pathname.startsWith("/legal") || pathname.startsWith("/contact");
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const hero = document.getElementById("hero");
    const footer = document.querySelector("footer");
    let heroOut = !hero, footerIn = false;
    const update = () => setShow(heroOut && !footerIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === footer) footerIn = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (footer) io.observe(footer);
    update();
    return () => io.disconnect();
  }, []);
  if (hiddenRoute) return null;
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-3 pb-3 transition-transform duration-500 ease-out md:hidden",
        show ? "translate-y-0" : "translate-y-[120%]",
      )}
      aria-hidden={!show}
    >
      <div className="glass flex h-[60px] items-center gap-2 rounded-full p-1.5 shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--color-ink)_30%,transparent),inset_0_0_0_1px_var(--color-frame)]">
        <Link href={SIGNUP_HREF} tabIndex={show ? 0 : -1} className={cn(accentCta, "h-full flex-1 text-base")}>
          צרו סרטון בחינם
        </Link>
        <WhatsAppButton iconOnly />
      </div>
    </div>
  );
}
