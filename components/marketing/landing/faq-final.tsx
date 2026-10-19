import Link from "next/link";
import { reveal } from "@/components/marketing/media/reveal";
import { Section, SectionHeading } from "./section-heading";
import { createHref } from "./create-link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DirIcon } from "@/components/a11y/dir-icon";
import { ctaArrow, inkCta } from "@/components/layout/cta-styles";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { STRIP_REELS } from "@/lib/mock/home";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const F = LANDING.faq;
const FC = LANDING.finalCta;

/** Short FAQ list (accordion). Pass your own items on inner pages. */
export function FaqList({ items, className }: { items: readonly { id: string; q: string; a: string }[]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="rounded-[22px] border-0 bg-surface-1 px-6 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_5%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-shadow data-[state=open]:shadow-[0_18px_40px_-20px_color-mix(in_oklab,var(--color-ink)_22%,transparent),inset_0_0_0_1px_var(--color-frame)] md:px-8"
        >
          <AccordionTrigger className="py-6 text-body-lg font-bold md:text-[1.25rem]">{item.q}</AccordionTrigger>
          <AccordionContent className="pb-6 text-body-lg text-text-2">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" title={F.title} />
      <FaqList items={F.items} className={cn(reveal, "mx-auto mt-12 max-w-3xl")} />
      <div className="mt-8 flex justify-center">
        <Link href="/faq" className="group inline-flex items-center gap-1.5 text-body font-semibold text-primary-text hover:underline">
          {F.all}
          <DirIcon name="forward" className="size-4" />
        </Link>
      </div>
    </Section>
  );
}

/** Big accent CTA band with two looping reels on the sides. */
export function FinalCta({ title = FC.title, subtitle = FC.subtitle, href, cta = FC.cta }: { title?: string; subtitle?: string; href?: string; cta?: string }) {
  const [a, b] = [STRIP_REELS[0], STRIP_REELS[5]];
  return (
    <section aria-labelledby="final-cta-title" className="relative pt-6 md:pt-10">
      <div className="mx-auto max-w-[1320px] px-2 md:px-4">
        <div className={cn(reveal, "relative isolate overflow-hidden rounded-[40px] bg-accent-gradient px-6 py-20 text-center text-ink md:py-32")}>
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {[560, 820, 1080].map((s) => (
              <span key={s} className="absolute inset-0 m-auto rounded-full border border-ink/10" style={{ width: s, height: s }} />
            ))}
          </div>
          {a && <ReelCard reel={a} frame="phone" decorative className="pointer-events-none absolute -bottom-28 inset-s-16 hidden w-[210px] rotate-[10deg] lg:block" offset={1} />}
          {b && <ReelCard reel={b} frame="phone" decorative className="pointer-events-none absolute -bottom-32 inset-e-16 hidden w-[210px] rotate-[-10deg] lg:block" offset={3} />}
          <h2 id="final-cta-title" className="mx-auto max-w-[16ch] text-[clamp(2.25rem,1.4rem+3.4vw,4.5rem)] font-black leading-[1.05] text-ink">{title}</h2>
          <p className="mx-auto mt-5 max-w-md text-body-lg font-medium text-ink/80">{subtitle}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={href ?? createHref("final_cta")} className={cn(inkCta, "h-16 px-9 text-lg")}>
              {cta}
              <DirIcon name="forward" className={ctaArrow} />
            </Link>
            <Link href="/pricing" className="inline-flex h-14 items-center rounded-full px-6 font-bold text-ink underline-offset-4 hover:underline">
              {FC.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
