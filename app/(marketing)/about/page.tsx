import type { Metadata } from "next";
import Link from "next/link";
import { Accessibility, BadgeCheck, Clapperboard, Languages, Lock, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageHero } from "@/components/marketing/content/page-hero";
import { TileFan } from "@/components/marketing/content/tile-fan";
import { JsonLd } from "@/components/marketing/content/json-ld";
import { BRAND, SIGNUP_HREF } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";
import { cn } from "@/lib/utils";
import { ABOUT } from "@/content/he/site";

export const metadata: Metadata = {
  title: { absolute: ABOUT.meta.title },
  description: ABOUT.meta.description,
  alternates: { canonical: "/about" },
};

const VALUE_ICONS: Record<(typeof ABOUT.values)[number]["icon"], LucideIcon> = {
  languages: Languages,
  clapperboard: Clapperboard,
  badge: BadgeCheck,
  receipt: Receipt,
  a11y: Accessibility,
  lock: Lock,
};

export default function AboutPage() {
  const entity = isFilled(BRAND.legal.entityName) ? BRAND.legal.entityName : null;
  return (
    <div className="pb-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.nameHe,
          alternateName: BRAND.nameEn,
          url: `https://${BRAND.domain}`,
          email: BRAND.emails.hello,
          ...(entity ? { legalName: entity } : {}),
        }}
      />
      <PageHero
        crumbs={[{ label: ABOUT.crumb }]}
        eyebrow={ABOUT.eyebrow}
        title={
          <>
            {ABOUT.h1Lead} <span className="text-gold-gradient">{ABOUT.h1Accent}</span>
          </>
        }
        aside={<TileFan tiles={ABOUT.tiles} label={ABOUT.tilesLabel} className="mt-4 lg:mt-0" />}
      >
        <div className="mt-6 flex max-w-2xl flex-col gap-4 text-body-lg text-text-2">
          {ABOUT.intro.map((p, i) => (
            <p key={i} className={cn(i === 0 && "text-text")}>
              {p}
            </p>
          ))}
        </div>
      </PageHero>

      <section aria-labelledby="values" className="container-marketing">
        <h2 id="values" className="text-h2">{ABOUT.valuesTitle}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ABOUT.values.map((v) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <li key={v.title} className="group relative overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 transition-colors hover:bg-surface-2">
                <span aria-hidden className="pointer-events-none absolute -top-14 inset-e-[-2.5rem] size-36 rounded-full bg-primary/0 blur-2xl transition-colors duration-[var(--duration-panel)] group-hover:bg-primary/15" />
                <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-md bg-surface-2 text-primary-text shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-h3">{v.title}</h3>
                <p className="mt-2 text-text-2">{v.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="who" className="container-marketing mt-20">
        <div className="relative overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2 id="who" className="text-h2">{ABOUT.whoTitle}</h2>
              <p className="mt-5 max-w-2xl text-body-lg text-text-2">{entity ? ABOUT.whoWithEntity(entity) : ABOUT.whoWithoutEntity}</p>
            </div>
            <dl className="grid gap-3">
              {ABOUT.facts.map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-4 rounded-md bg-surface-2/70 px-5 py-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <dt className="text-small text-muted">{f.label}</dt>
                  <dd className="text-end font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="talk" className="container-marketing mt-20">
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <h2 id="talk" className="text-h2">{ABOUT.talkTitle}</h2>
          <p className="max-w-xl text-body-lg text-text-2">{ABOUT.talkBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={SIGNUP_HREF} className={cn(buttonVariants({ size: "lg" }))}>
              {ABOUT.talkCreate}
              <DirIcon name="forward" />
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              {ABOUT.talkContact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
