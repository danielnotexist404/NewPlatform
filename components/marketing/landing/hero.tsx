import Link from "next/link";
import { Play } from "lucide-react";
import { HeroFan } from "./hero-fan";
import { createHref } from "./create-link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, ctaArrow, quietCta } from "@/components/layout/cta-styles";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const H = LANDING.hero;

/** Warm glow pool + faint dot grid behind the fan. Decorative only. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-[620px] bg-dots opacity-50"
        style={{ maskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)", WebkitMaskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-[-6%] mx-auto h-[58%] max-w-[1200px] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 36%, transparent), color-mix(in oklab, var(--color-coral) 16%, transparent) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-x-clip pb-10 pt-14 md:pb-16 md:pt-24">
      <HeroBackdrop />
      <div className="container-marketing relative flex flex-col items-center text-center">
        <h1 id="hero-title" className="rise text-[clamp(2.75rem,1.2rem+5.4vw,6rem)] font-black leading-[1.04] text-text">
          <span className="block">{H.title}</span>
          <span className="block text-accent-gradient">{H.accent}</span>
        </h1>
        <p className="rise mt-7 max-w-[34rem] text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-relaxed text-text-2 [--d:120ms]">{H.sub}</p>
        <div className="rise mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row [--d:200ms]">
          <Link href={createHref("hero")} className={cn(accentCta, "h-16 w-full px-9 text-lg sm:w-auto")}>
            {H.ctaPrimary}
            <DirIcon name="forward" className={ctaArrow} />
          </Link>
          <Link href="#how-it-works" className={cn(quietCta, "h-16 px-6 text-base")}>
            <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-surface-1 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_10%,transparent),inset_0_0_0_1px_var(--color-frame)]">
              <Play className="size-3.5 fill-current" />
            </span>
            {H.ctaSecondary}
          </Link>
        </div>
        <p className="rise mt-5 text-small text-muted [--d:260ms]">{H.trust}</p>
      </div>
      <HeroFan />
    </section>
  );
}
