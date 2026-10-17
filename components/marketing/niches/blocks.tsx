import Link from "next/link";
import { Camera, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Num, Price } from "@/components/a11y/num";
import { NICHES_COPY } from "@/content/he/niches";
import { PLANS, VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import { cn } from "@/lib/utils";

export function FaqList({ items, idPrefix }: { items: { q: string; a: string }[]; idPrefix: string }) {
  return (
    <Accordion type="multiple" className="rounded-lg bg-surface-1/60 px-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-7">
      {items.map((f, i) => (
        <AccordionItem key={i} value={`${idPrefix}-${i}`} className="last:border-b-0">
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** "כללי פרסום שכדאי להכיר" (Part 02 §4.2 row 8) + mandatory disclaimers of the niche. */
export function ComplianceBox({ note, disclaimers, title = NICHES_COPY.page.complianceTitle, headingId }: { note: string; disclaimers: string[]; title?: string; headingId: string }) {
  const P = NICHES_COPY.page;
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
      <div aria-hidden className="absolute inset-y-0 inset-s-0 w-1 bg-primary" />
      <h2 id={headingId} className="flex items-center gap-2 text-h3">
        <ShieldCheck className="size-6 text-primary-text" aria-hidden />
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-body-lg">{note}</p>
      <p className="mt-3 max-w-3xl text-text-2">{P.complianceBody}</p>
      {disclaimers.length > 0 && (
        <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-sm bg-surface-2 px-3 py-2 text-small">
          <span className="text-text-2">{P.disclaimerLabel}</span>
          {disclaimers.map((d) => (
            <span key={d} className="font-semibold text-text">&quot;{d}&quot;</span>
          ))}
        </p>
      )}
    </div>
  );
}

export function RealAssetsBox({ text, extra }: { text: string; extra?: string }) {
  return (
    <p className="flex gap-3 rounded-md bg-violet/10 p-4 text-text shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_30%,transparent)]" role="note">
      <Camera className="mt-1 size-5 shrink-0 text-violet" aria-hidden />
      <span>
        {text}
        {extra && <> {extra}</>}
      </span>
    </p>
  );
}

const business = PLANS.find((p) => p.id === "business")!;
const ilsPerCredit = business.monthlyIls / business.monthlyCredits;
export const creditsToIls = (credits: number) => Math.round(credits * ilsPerCredit);

/** "כמה עולה סרטון ל…" — three computed rows + mini Business plan card (Part 02 §4.2 row 9). */
export function CostBlock({ headingId, title }: { headingId: string; title: string }) {
  const P = NICHES_COPY.page;
  const rows = [VIDEO_COST_EXAMPLES[0], VIDEO_COST_EXAMPLES[1], VIDEO_COST_EXAMPLES[2]];
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
        <h2 id={headingId} className="text-h2">{title}</h2>
        <ul className="mt-6 divide-y divide-border">
          {rows.map((r) => (
            <li key={r.labelHe} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <span className="font-semibold">{r.labelHe}</span>
              <span className="flex items-baseline gap-4">
                <span className="text-text-2">
                  <Num value={r.credits} className="text-h3 text-text" /> {P.costCredits}
                </span>
                <span className="text-small text-muted">
                  {P.costIlsPrefix} <Price ils={creditsToIls(r.credits)} className="font-semibold text-text-2" />
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-micro font-normal text-muted">{P.costNote}</p>
        <Link href="/pricing#credit-costs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-text hover:underline">
          {P.costLink} <DirIcon name="forward" />
        </Link>
      </div>
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-lg bg-surface-1 p-6 glow-primary md:p-8">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%)]" />
        <div className="relative flex items-center justify-between">
          <h3 className="text-h3">{business.nameHe}</h3>
          {business.badgeHe && <span className="rounded-xs bg-primary px-2 py-0.5 text-micro text-on-primary">{business.badgeHe}</span>}
        </div>
        <p className="relative text-text-2">{business.taglineHe}</p>
        <p className="relative">
          <Price ils={business.monthlyIls} className="text-[3rem] font-extrabold leading-none" />{" "}
          <span className="text-small text-muted">{P.planPerMonth}</span>
        </p>
        <ul className="relative flex flex-col gap-1.5 text-small text-text-2">
          {business.featuresHe.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>
        <Link href="/pricing" className={cn(buttonVariants({ variant: "secondary" }), "relative mt-auto")}>
          {P.planCta}
        </Link>
      </div>
    </div>
  );
}

/** Final CTA band with the niche preselected (Part 02 §4.2 row 12). */
export function FinalCtaBand({ title, sub, href, cta }: { title: string; sub: string; href: string; cta: string }) {
  return (
    <section aria-labelledby="final-cta" className="container-marketing py-16">
      <div className="relative overflow-hidden rounded-xl bg-surface-1 px-6 py-14 text-center shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-12 md:py-20">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_26%,transparent),transparent_70%)]" />
        <div aria-hidden className="absolute inset-0 bg-afterglow" />
        <h2 id="final-cta" className="relative mx-auto max-w-4xl font-display text-display">{title}</h2>
        <p className="relative mx-auto mt-5 max-w-2xl text-body-lg text-text-2">{sub}</p>
        <Link href={href} className={cn(buttonVariants({ size: "xl" }), "relative mt-8")}>
          {cta}
          <DirIcon name="forward" />
        </Link>
      </div>
    </section>
  );
}
