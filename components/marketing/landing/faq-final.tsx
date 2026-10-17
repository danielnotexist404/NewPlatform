import Link from "next/link";
import { Section } from "./section-heading";
import { Eyebrow } from "./section-heading";
import { createHref } from "./create-link";
import { PhoneShell, ReelCaption, ReelScene } from "./reel-phone";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DirIcon } from "@/components/a11y/dir-icon";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ctaArrow, inkCta } from "@/components/layout/cta-styles";
import { getHook } from "@/lib/data/seed";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const F = LANDING.faq;
const FC = LANDING.finalCta;

export function FaqSection() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="reveal flex flex-col items-start gap-4 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{F.eyebrow}</Eyebrow>
          <h2 id="faq-title" className="text-title text-text">{F.title}</h2>
          <p className="text-body-lg text-text-2">{F.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link href="/faq" className="group inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
              {F.all}
              <DirIcon name="forward" className="size-3.5" />
            </Link>
            <WhatsAppButton />
          </div>
        </div>
        <Accordion type="single" collapsible className="reveal flex flex-col gap-3">
          {F.items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-[20px] border-0 bg-surface-1 px-5 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_5%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-shadow data-[state=open]:shadow-[0_18px_40px_-20px_color-mix(in_oklab,var(--color-ink)_22%,transparent),inset_0_0_0_1px_var(--color-frame)] md:px-6"
            >
              <AccordionTrigger className="py-5 text-body-lg font-bold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-body">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

function SidePhone({ hookId, scene, className }: { hookId: string; scene: "teal" | "sky"; className: string }) {
  const text = getHook(hookId)?.text_he ?? "";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute hidden w-[180px] lg:block", className)}>
      <PhoneShell>
        <ReelScene scene={scene} />
        <div className="absolute inset-0 flex items-center px-[7cqw]">
          <ReelCaption text={text} style="box" />
        </div>
      </PhoneShell>
    </div>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative pt-6 md:pt-10">
      <div className="mx-auto max-w-[1280px] px-2 md:px-4">
        <div className="reveal relative isolate overflow-hidden rounded-[36px] bg-accent-gradient px-6 py-16 text-center text-ink md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {[520, 760, 1000].map((s) => (
              <span key={s} className="absolute inset-0 m-auto rounded-full border border-ink/10" style={{ width: s, height: s }} />
            ))}
            <span className="absolute inset-0 bg-dots opacity-30" />
          </div>
          <SidePhone hookId="dentists-03" scene="sky" className="-bottom-24 inset-s-14 rotate-[10deg]" />
          <SidePhone hookId="ecommerce-02" scene="teal" className="-bottom-28 inset-e-14 rotate-[-10deg]" />
          <h2 id="final-cta-title" className="mx-auto max-w-[22ch] text-title font-black text-ink">{FC.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-body-lg font-medium text-ink/80">{FC.subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={createHref("final_cta")} className={cn(inkCta, "h-14 px-8 text-lg")}>
              {FC.cta}
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
