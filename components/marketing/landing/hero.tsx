import Link from "next/link";
import { Check, Play } from "lucide-react";
import { HeroFan } from "./hero-fan";
import { CountUp } from "./count-up";
import { Eyebrow } from "./section-heading";
import { createHref } from "./create-link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, ctaArrow, quietCta } from "@/components/layout/cta-styles";
import { LANDING, STARTING_PRICE } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const H = LANDING.hero;

/** Projector beam + warm glow pool + faint dot grid. Decorative only. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-[760px] opacity-80"
        style={{
          background:
            "conic-gradient(from 180deg at 50% -6%, transparent 158deg, color-mix(in oklab, var(--color-primary) 16%, transparent) 172deg, color-mix(in oklab, var(--color-coral) 12%, transparent) 188deg, transparent 202deg)",
          maskImage: "linear-gradient(180deg, #000 30%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 30%, transparent 95%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[560px] bg-dots opacity-60"
        style={{ maskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)", WebkitMaskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-[-8%] mx-auto h-[62%] max-w-[1100px] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 34%, transparent), color-mix(in oklab, var(--color-coral) 16%, transparent) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-x-clip pb-6 pt-10 md:pb-10 md:pt-14">
      <HeroBackdrop />
      <div className="container-marketing relative flex flex-col items-center text-center">
        <Eyebrow className="rise">{H.eyebrow}</Eyebrow>
        <h1 id="hero-title" className="rise mt-6 text-hero text-text [--d:60ms]">
          <span className="block">{H.title}</span>
          <span className="mt-2 block text-[0.6em] leading-[1.18] md:text-[0.56em]">
            <span className="text-accent-gradient">{H.accentLead}</span>
            <br className="sm:hidden" />
            <span className="text-accent-gradient"> {H.accentBefore}</span>
            <CountUp value={STARTING_PRICE} prefix="₪" label={`${STARTING_PRICE} שקלים`} className="text-accent-gradient" />
            <span className="text-accent-gradient">{H.accentAfter}</span>
          </span>
        </h1>
        <p className="rise mt-6 max-w-[36rem] text-body-lg text-text-2 [--d:140ms]">
          {H.sub[0]}
          <br className="hidden sm:inline" /> {H.sub[1]}
        </p>
        <div className="rise mt-9 flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row [--d:220ms]">
          <Link href={createHref("hero")} className={cn(accentCta, "h-14 w-full px-8 text-lg sm:w-auto")}>
            {H.ctaPrimary}
            <DirIcon name="forward" className={ctaArrow} />
          </Link>
          <Link href="#how-it-works" className={cn(quietCta, "h-14 px-6 text-base")}>
            <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-full bg-surface-1 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_10%,transparent),inset_0_0_0_1px_var(--color-frame)]">
              <Play className="size-3.5 fill-current" style={{ transform: "none" }} />
            </span>
            {H.ctaSecondary}
          </Link>
        </div>
        <ul className="rise mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-small text-text-2 [--d:300ms]">
          {H.trust.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="inline-flex size-4 items-center justify-center rounded-full bg-primary/25 text-primary-text">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <HeroFan />
    </section>
  );
}
