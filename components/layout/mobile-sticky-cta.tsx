"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "./whatsapp-button";
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
        "glass fixed inset-x-0 bottom-0 z-[var(--z-sticky)] flex h-[72px] items-center gap-3 px-4 transition-transform md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!show}
    >
      <Link href={SIGNUP_HREF} tabIndex={show ? 0 : -1} className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
        צרו סרטון בחינם
      </Link>
      <WhatsAppButton iconOnly />
    </div>
  );
}
