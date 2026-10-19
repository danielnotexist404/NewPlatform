import type { Metadata } from "next";
import { Accessibility, BadgeCheck, Clapperboard, Languages, Lock, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { JsonLd } from "@/components/marketing/content/json-ld";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { Band, HeroActions, PageHero, PromiseStrip } from "@/components/marketing/page/kit";
import { HERO_REELS } from "@/lib/mock/home";
import { BRAND } from "@/lib/constants";
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

const REELS = [HERO_REELS[0], HERO_REELS[2], HERO_REELS[4]].filter(Boolean);

export default function AboutPage() {
  const entity = isFilled(BRAND.legal.entityName) ? BRAND.legal.entityName : null;
  return (
    <div>
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
      <PageHero align="split" title={ABOUT.h1Lead} accent={ABOUT.h1Accent} sub={ABOUT.sub} actions={<HeroActions primary={ABOUT.talkCreate} secondary={ABOUT.talkContact} secondaryHref="/contact" />}>
        <div aria-hidden className="mx-auto flex max-w-[520px] items-start justify-center gap-4">
          {REELS.map((r, i) => (
            <ReelCard key={r.key} reel={r} frame="phone" decorative offset={i * 2} lite={i !== 1} className={cn("w-[32%]", i === 1 ? "z-10 scale-110" : i === 0 ? "translate-y-8 rotate-[-6deg]" : "translate-y-8 rotate-[6deg]")} />
          ))}
        </div>
      </PageHero>

      <Band id="values" title={ABOUT.valuesTitle}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.valuesShort.map((v) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <li key={v.title} className="flex flex-col gap-4 rounded-[28px] bg-surface-1 p-7 ring-hairline">
                <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-full bg-accent-gradient text-ink">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-h3">{v.title}</h3>
                <p className="text-body-lg text-text-2">{v.text}</p>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band id="who" title={ABOUT.whoTitle} sub={entity ? ABOUT.whoWithEntity(entity) : ABOUT.whoWithoutEntity} tight>
        <PromiseStrip items={ABOUT.facts.map((f) => ({ title: f.value, text: f.label }))} className="lg:grid-cols-3" />
      </Band>

      <FinalCta title={ABOUT.talkTitle} subtitle={ABOUT.talkBody} />
    </div>
  );
}
