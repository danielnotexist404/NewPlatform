import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BRAND, whatsappHref } from "@/lib/constants";
import { nicheCategories, niches, nicheShortName } from "@/lib/data/seed";
import { Section, SectionHeading } from "./section-heading";
import { FinalCtaForm } from "./final-cta-form";
import { LANDING } from "@/content/he/landing";

/** §3.13 FaqAccordion: multiple open, chevron at the end side, trigger is a button inside <h3>. */
export function FaqSection() {
  const T = LANDING.faq;
  const wa = whatsappHref();
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow={T.eyebrow} title={T.title} />
            <div className="mt-6 flex flex-col gap-3 text-sm font-semibold">
              <Link href="/faq" className="text-link underline-offset-4 hover:underline">{T.all}</Link>
              {wa ? (
                <a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-text-2 hover:text-text">
                  <MessageCircle className="size-4" aria-hidden />
                  {T.whatsapp}
                </a>
              ) : (
                <a href={`mailto:${BRAND.emails.support}`} className="inline-flex items-center gap-1.5 text-text-2 hover:text-text">
                  <Mail className="size-4" aria-hidden />
                  {T.email}
                </a>
              )}
            </div>
          </div>
        </div>
        <Accordion type="multiple" className="lg:col-span-8">
          {T.items.map((item) => (
            <AccordionItem key={item.id} value={item.id} id={`faq-${item.id}`}>
              <AccordionTrigger className="text-body-lg">{item.q}</AccordionTrigger>
              <AccordionContent className="text-body max-w-3xl">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

/** §3.14 FinalCtaBand: display-font H2, strong projector glow, compact niche combobox + CTA. */
export function FinalCta() {
  const T = LANDING.finalCta;
  const groups = nicheCategories
    .map((c) => ({
      label: c.name_he,
      items: niches.filter((n) => n.category_slug === c.slug).map((n) => ({ slug: n.slug, label: nicheShortName(n) })),
    }))
    .filter((g) => g.items.length > 0);
  return (
    <section id="start" aria-labelledby="start-title" className="relative isolate overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_28%,transparent),transparent_70%)] light:bg-text light:bg-none" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-primary)_70%,transparent),transparent)]" />
      <div className="container-marketing flex flex-col items-center gap-6 text-center light:text-bg">
        <h2 id="start-title" className="font-display text-display max-w-4xl text-text light:text-bg">
          {T.title}
        </h2>
        <p className="text-body-lg max-w-2xl text-text-2 light:text-bg/80">{T.subtitle}</p>
        <FinalCtaForm groups={groups} />
      </div>
    </section>
  );
}
