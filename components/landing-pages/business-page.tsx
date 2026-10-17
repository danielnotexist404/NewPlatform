import Link from "next/link";
import { CircleCheck, Clock, MapPin, Navigation } from "lucide-react";
import { ContactLink, HeroVideoPlayer, LeadForm, OpenNowBadge, type PageMode } from "./business-page-client";
import { NicheIcon } from "@/components/trends/niche-icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { LP_GATE, LP_ID_TYPE, LP_PUBLIC } from "@/content/he/landing-pages";
import { wazeHref, type BusinessProfile, type HeroVideo, type LandingAccent, type LandingPageContent } from "@/lib/mock/landing-pages";
import { cn } from "@/lib/utils";

const ACCENT: Record<LandingAccent, { soft: string; text: string; glow: string }> = {
  gold: { soft: "bg-primary/15 text-primary-text", text: "text-primary-text", glow: "var(--color-primary)" },
  rose: { soft: "bg-rose/15 text-rose", text: "text-rose", glow: "var(--color-rose)" },
  violet: { soft: "bg-violet/15 text-violet", text: "text-violet", glow: "var(--color-violet)" },
};

export interface BusinessPageProps {
  business: BusinessProfile;
  content: LandingPageContent;
  heroVideos: HeroVideo[];
  slug: string;
  mode: PageMode;
  /** "נבנה עם קדימון" — free plan only (§S.1; on paid plans `show_branding = false`). */
  showBranding: boolean;
  /** Free-plan preview: watermark, not publishable (§S.7). */
  watermark?: boolean;
  isSample: boolean;
  idPrefix?: string;
}

/**
 * The one-page business site ("דף העסק"). Mobile-first; layout switches on the CONTAINER width (@container),
 * so the same component renders the public page and the 375px phone preview in the editor.
 */
export function BusinessPage({ business, content: c, heroVideos, slug, mode, showBranding, watermark, isSample, idPrefix = "biz" }: BusinessPageProps) {
  const a = ACCENT[business.accent];
  const video = heroVideos.find((v) => v.id === c.heroVideoId) ?? heroVideos[0];
  const H1 = mode === "public" ? "h1" : "p";
  const H2 = mode === "public" ? "h2" : "p";
  const contact = c.whatsapp || c.phone;
  const address = [c.address.street, c.address.city].filter(Boolean).join(", ");

  return (
    <div className="@container relative isolate min-h-full bg-bg text-text">
      {isSample && mode === "public" && (
        <p className="bg-violet/15 px-4 py-2 text-center text-micro text-text">{LP_PUBLIC.sampleRibbon}</p>
      )}
      {watermark && <p className="bg-rose/15 px-4 py-2 text-center text-micro text-rose">{LP_GATE.watermark}</p>}

      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-border glass">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-2.5 @3xl:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", a.soft)}>
              <NicheIcon icon={business.nicheIcon} className="size-[18px]" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-bold">{business.nameHe}</p>
              <p className="text-micro font-normal text-muted">{c.address.city || business.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden @3xl:inline-flex">
              <ContactLink kind="whatsapp" phone={c.whatsapp} prefill={c.whatsappPrefill} mode={mode} isSample={isSample} size="md" label={LP_PUBLIC.whatsapp} />
            </span>
            <ContactLink kind="call" phone={c.phone} mode={mode} isSample={isSample} iconOnly />
          </div>
        </div>
      </div>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: `radial-gradient(70% 55% at 85% 0%, color-mix(in oklab, ${a.glow} 24%, transparent), transparent 70%), radial-gradient(50% 40% at 0% 100%, color-mix(in oklab, var(--color-violet) 14%, transparent), transparent 70%)` }} />
        <div className="relative mx-auto grid max-w-[1080px] gap-8 px-4 pt-8 pb-10 @3xl:grid-cols-[minmax(0,1fr)_300px] @3xl:items-center @3xl:gap-14 @3xl:px-8 @3xl:pt-16 @3xl:pb-20">
          <div className="flex flex-col gap-5">
            <OpenNowBadge hours={c.hours} />
            <H1 className="text-[clamp(2rem,1.1rem+4.6cqi,3.75rem)] leading-[1.06] font-extrabold text-balance">{c.h1}</H1>
            {c.subline && <p className="text-[1.0625rem] leading-relaxed text-text-2 @3xl:text-[1.25rem]">{c.subline}</p>}
            {contact && (
              <div className="flex flex-col gap-3 @md:flex-row">
                <ContactLink kind="whatsapp" phone={c.whatsapp} prefill={c.whatsappPrefill} mode={mode} isSample={isSample} className="w-full @md:w-auto" />
                <ContactLink kind="call" phone={c.phone} mode={mode} isSample={isSample} className="w-full @md:w-auto" />
              </div>
            )}
          </div>
          {video && (
            <HeroVideoPlayer video={video} nicheIcon={business.nicheIcon} className="mx-auto w-[min(70%,280px)] @3xl:w-full" />
          )}
        </div>
      </section>

      {/* benefits */}
      {c.benefits.some(Boolean) && (
        <section className="mx-auto max-w-[1080px] px-4 py-8 @3xl:px-8 @3xl:py-12">
          <H2 className="text-[1.5rem] font-bold @3xl:text-[2rem]">{LP_PUBLIC.benefitsTitle}</H2>
          <ul className="mt-5 grid gap-3 @3xl:grid-cols-3 @3xl:gap-4">
            {c.benefits.filter(Boolean).map((b, i) => (
              <li key={i} className="flex items-start gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] @3xl:flex-col @3xl:p-6">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", a.soft)}>
                  <CircleCheck aria-hidden className="size-5" />
                </span>
                <span className="pt-2 text-body font-semibold @3xl:pt-0 @3xl:text-body-lg">{b}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* services */}
      {c.services.length > 0 && (
        <section className="mx-auto max-w-[1080px] px-4 py-8 @3xl:px-8 @3xl:py-12">
          <H2 className="text-[1.5rem] font-bold @3xl:text-[2rem]">{LP_PUBLIC.servicesTitle}</H2>
          <ul className="mt-5 grid gap-3 @3xl:grid-cols-2">
            {c.services.filter((s) => s.nameHe).map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] @3xl:p-5">
                <div className="min-w-0">
                  <p className="font-bold">{s.nameHe}</p>
                  {s.descriptionHe && <p className="mt-0.5 text-small text-text-2">{s.descriptionHe}</p>}
                </div>
                {s.priceFromIls != null && s.priceFromIls > 0 && (
                  <p className={cn("shrink-0 text-end leading-tight", a.text)}>
                    <span className="block text-micro font-normal text-muted">{LP_PUBLIC.priceFrom}</span>
                    <Price ils={s.priceFromIls} className="text-[1.25rem] font-extrabold" />
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* hours + address */}
      <section className="mx-auto grid max-w-[1080px] gap-4 px-4 py-8 @3xl:grid-cols-2 @3xl:px-8 @3xl:py-12">
        <div className="rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] @3xl:p-6">
          <div className="flex items-center justify-between gap-3">
            <H2 className="flex items-center gap-2 text-[1.25rem] font-bold">
              <Clock aria-hidden className={cn("size-5", a.text)} />
              {LP_PUBLIC.hoursTitle}
            </H2>
            <OpenNowBadge hours={c.hours} />
          </div>
          <dl className="mt-4 flex flex-col divide-y divide-border">
            {c.hours.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-text-2">{h.labelHe}</dt>
                <dd className="font-semibold">
                  {h.open && h.close ? <bdi dir="ltr" className="num">{h.open}–{h.close}</bdi> : <span className="text-muted">{LP_PUBLIC.closed}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {address && (
          <div className="flex flex-col overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <div aria-hidden className="relative h-36 overflow-hidden bg-surface-2" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 27px, var(--color-border) 27px 28px), repeating-linear-gradient(90deg, transparent 0 27px, var(--color-border) 27px 28px)" }}>
              <span className="absolute inset-x-0 top-[55%] block h-3 -rotate-6 bg-surface-3" />
              <span className="absolute inset-y-0 inset-s-[38%] block w-3 rotate-12 bg-surface-3" />
              <span className={cn("absolute inset-x-0 top-[28%] mx-auto flex size-12 items-center justify-center rounded-full elev-2", a.soft)}>
                <MapPin className="size-6" />
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 @3xl:p-6">
              <H2 className="text-[1.25rem] font-bold">{LP_PUBLIC.addressTitle}</H2>
              <p className="text-text-2">{address}</p>
              <a href={wazeHref(c.address)} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "secondary", size: "md" }), "self-start")}>
                <Navigation aria-hidden />
                {LP_PUBLIC.waze}
              </a>
            </div>
          </div>
        )}
      </section>

      {/* lead form */}
      <section id={`${idPrefix}-contact`} className="mx-auto max-w-[1080px] px-4 py-8 @3xl:px-8 @3xl:py-12">
        <div className="relative overflow-hidden rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] @3xl:grid @3xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @3xl:gap-10 @3xl:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: `radial-gradient(60% 50% at 100% 0%, color-mix(in oklab, ${a.glow} 14%, transparent), transparent 70%)` }} />
          <div className="relative mb-5 @3xl:mb-0">
            <H2 className="text-[1.5rem] leading-tight font-bold @3xl:text-[2rem]">{LP_PUBLIC.formTitle}</H2>
            <p className="mt-2 text-text-2">{LP_PUBLIC.formSub}</p>
          </div>
          <div className="relative">
            <LeadForm fields={c.leadForm.fields} submitLabel={c.leadForm.submitLabel || "שליחה"} slug={slug} mode={mode} isSample={isSample} idPrefix={`${idPrefix}-lead`} />
          </div>
        </div>
      </section>

      {/* faq */}
      {c.faq.length > 0 && (
        <section className="mx-auto max-w-[1080px] px-4 py-8 @3xl:px-8 @3xl:py-12">
          <H2 className="text-[1.5rem] font-bold @3xl:text-[2rem]">{LP_PUBLIC.faqTitle}</H2>
          <Accordion type="single" collapsible className="mt-3">
            {c.faq.filter((f) => f.q).slice(0, 5).map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-body">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* footer */}
      <footer className="mt-4 border-t border-border">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-4 py-8 text-small text-text-2 @3xl:flex-row @3xl:items-start @3xl:justify-between @3xl:px-8">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-text">{c.legal.legalName || business.nameHe}</p>
            <p>
              {LP_ID_TYPE[c.legal.idType]} <bdi className="num">{c.legal.idNumber}</bdi>
              {address && <> · {address}</>}
            </p>
            <p className="text-micro font-normal text-muted">{LP_PUBLIC.footer.controller}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={`/b/${slug}/privacy`} className="underline underline-offset-2 hover:text-text" target={mode === "preview" ? "_blank" : undefined}>
              {LP_PUBLIC.footer.privacy}
            </Link>
            {showBranding && (
              <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-micro text-text hover:bg-surface-3" target={mode === "preview" ? "_blank" : undefined}>
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {LP_PUBLIC.footer.builtWith}
              </Link>
            )}
          </div>
        </div>
        {/* room for the sticky bar on narrow containers */}
        <div className="h-2 @3xl:hidden" />
      </footer>

      {contact && (
        <div className="sticky bottom-0 z-30 border-t border-border glass @3xl:hidden" role="group" aria-label={LP_PUBLIC.stickyLabel}>
          <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
            <ContactLink kind="whatsapp" phone={c.whatsapp} prefill={c.whatsappPrefill} mode={mode} isSample={isSample} size="md" label={LP_PUBLIC.whatsapp} className="w-full" />
            <ContactLink kind="call" phone={c.phone} mode={mode} isSample={isSample} size="md" label={LP_PUBLIC.call} className="w-full" />
          </div>
        </div>
      )}

      {watermark && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-40 flex flex-col gap-24 overflow-hidden pt-24 opacity-[0.16]">
          {Array.from({ length: 36 }, (_, i) => (
            <div key={i} className={cn("flex shrink-0 justify-around", i % 2 && "ps-24")}>
              {[0, 1].map((j) => (
                <span key={j} className="-rotate-[22deg] text-[1.5rem] font-extrabold whitespace-nowrap text-text">{LP_GATE.watermark}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
