"use client";
import * as React from "react";
import { ChevronDown, MessageCircle, Phone, CalendarCheck, Link2, Navigation, ClipboardList } from "lucide-react";
import { Input, LtrInput } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { GOAL_LABEL, PLATFORM_LABEL, VIDEO_TYPE_LABEL, type Platform } from "@/lib/labels";
import { seasons } from "@/lib/data/seed";
import type { Aspect, Goal, VideoType } from "@/lib/mock/projects";
import { MOCK_BUSINESS } from "@/lib/mock/workspace";
import { NicheGrid } from "../niche-grid";
import { ChipRadio, ChipToggle, Group, Panel, RadioCards, StepHeading } from "../choice";
import { recommendedFor, useWizard, type CtaType } from "../wizard-state";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard;

export function NicheStep() {
  const { data, set } = useWizard();
  const N = W.niche;
  return (
    <>
      <StepHeading title={N.title} subtitle={N.subtitle}>
        <p className="text-small text-muted">{N.onlyThis}</p>
      </StepHeading>
      <NicheGrid
        value={data.nicheSlug}
        onChange={(slug) => set({ nicheSlug: slug })}
        other={data.otherNiche}
        onOtherChange={(v) => set({ otherNiche: v })}
        preselectedSlug={MOCK_BUSINESS.nicheSlug}
        preselectedLabel={N.fromProfile}
        labels={{
          search: APP_CORE.onboarding.niche.search,
          other: APP_CORE.onboarding.niche.other,
          otherLabel: APP_CORE.onboarding.niche.otherLabel,
          complianceTitle: N.complianceTitle,
          complianceTail: N.complianceTail,
          noResults: APP_CORE.onboarding.niche.noResults,
          groupLabel: N.title,
        }}
      />
    </>
  );
}

const TYPES: VideoType[] = ["reel_hook", "brand_promo", "offer", "testimonial", "launch", "recruiting", "explainer"];
const PLATFORMS: Platform[] = ["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"];
const ASPECTS: Aspect[] = ["9:16", "1:1", "16:9"];
const CTA_ICONS: Record<CtaType, React.ComponentType<{ className?: string }>> = {
  whatsapp: MessageCircle, call: Phone, booking: CalendarCheck, link_in_bio: Link2, navigate: Navigation, lead_form: ClipboardList,
};

function AspectGlyph({ a }: { a: Aspect }) {
  const cls = a === "9:16" ? "h-8 w-[18px]" : a === "1:1" ? "size-7" : "h-[18px] w-8";
  return <span aria-hidden className={cn("rounded-[4px] border-2 border-current", cls)} />;
}

export function GoalStep() {
  const { data, set } = useWizard();
  const G = W.goal;
  const [toneOpen, setToneOpen] = React.useState(false);
  const rec = recommendedFor(data.videoType);
  const seasonOptions = seasons.filter((s) => !s.is_quiet_day && s.slug !== "knesset-elections-2026");
  const V = APP_CORE.onboarding.voice;

  return (
    <>
      <StepHeading title={G.title} subtitle={G.subtitle} />

      <Group label={G.typeLabel}>
        <RadioCards
          label={G.typeLabel}
          value={data.videoType}
          onValueChange={(v) => {
            const t = v as VideoType;
            const r = recommendedFor(t);
            set({ videoType: t, goal: r.goal, durationSec: r.duration, primaryAspect: t === "brand_promo" ? "16:9" : data.primaryAspect });
          }}
          columns="grid-cols-1 sm:grid-cols-2"
          size="sm"
          items={TYPES.map((t) => ({
            value: t,
            title: VIDEO_TYPE_LABEL[t],
            description: G.types[t].description,
            aside: <span className="text-micro font-normal text-muted">{G.types[t].duration}</span>,
          }))}
        />
        {data.videoType === "testimonial" && <p className="rounded-md bg-lemon/[.08] p-3 text-small">{G.testimonialWarn}</p>}
      </Group>

      <Group label={G.goalLabel}>
        <ChipRadio
          label={G.goalLabel}
          value={data.goal}
          onValueChange={(v) => set({ goal: v as Goal })}
          items={(Object.keys(GOAL_LABEL) as Goal[]).map((g) => ({ value: g, label: GOAL_LABEL[g] }))}
        />
      </Group>

      <Group label={G.durationLabel}>
        <ChipRadio
          label={G.durationLabel}
          value={String(data.durationSec)}
          onValueChange={(v) => set({ durationSec: Number(v) as 15 | 30 | 45 | 60 })}
          items={[15, 30, 45, 60].map((n) => ({
            value: String(n),
            label: <><bdi className="num">{n}</bdi> {G.seconds}</>,
            badge: n === rec.duration ? <span className="rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{G.recommended}</span> : undefined,
          }))}
        />
      </Group>

      <Group label={G.platformsLabel} help={data.platforms.length === 0 ? <span className="text-danger">{G.errors.platforms}</span> : undefined}>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <ChipToggle
              key={p}
              pressed={data.platforms.includes(p)}
              onPressedChange={(on) =>
                set((d) => {
                  const platforms = on ? [...d.platforms, p] : d.platforms.filter((x) => x !== p);
                  const onlyYoutube = platforms.length === 1 && platforms[0] === "youtube";
                  return { platforms, primaryAspect: onlyYoutube ? "16:9" : platforms.length && d.primaryAspect === "16:9" && !platforms.includes("youtube") ? "9:16" : d.primaryAspect };
                })
              }
            >
              {PLATFORM_LABEL[p]}
            </ChipToggle>
          ))}
        </div>
      </Group>

      <Group label={G.aspectLabel} help={G.extraHelp}>
        <RadioCards
          label={G.aspectLabel}
          value={data.primaryAspect}
          onValueChange={(v) => set((d) => ({ primaryAspect: v as Aspect, extraAspects: d.extraAspects.filter((x) => x !== v) }))}
          columns="grid-cols-3"
          size="sm"
          items={ASPECTS.map((a) => ({
            value: a,
            media: <span className="flex h-9 items-center text-text-2"><AspectGlyph a={a} /></span>,
            title: G.aspects[a].title,
            description: G.aspects[a].sub,
          }))}
        />
        <p className="mt-2 text-small font-semibold">{G.extraLabel}</p>
        <div className="flex flex-wrap gap-2">
          {ASPECTS.filter((a) => a !== data.primaryAspect).map((a) => (
            <ChipToggle
              key={a}
              pressed={data.extraAspects.includes(a)}
              onPressedChange={(on) => set((d) => ({ extraAspects: on ? [...d.extraAspects, a] : d.extraAspects.filter((x) => x !== a) }))}
            >
              <bdi dir="ltr" className="font-mono">{a}</bdi>
              <span className="font-normal text-muted">· <Plural n={data.durationSec > 30 ? 3 : 2} forms={APP_CORE.counts.creditsMore} /> {G.extraCost}</span>
            </ChipToggle>
          ))}
        </div>
      </Group>

      {(data.videoType === "offer" || data.seasonSlug) && (
        <Panel className="flex flex-col gap-4">
          <Field label={G.offerLabel} htmlFor="offer" error={data.videoType === "offer" && !data.offerText.trim() ? G.errors.offer : undefined}>
            <Input id="offer" maxLength={120} placeholder={G.offerPlaceholder} value={data.offerText} onChange={(e) => set({ offerText: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={G.offerUntil} htmlFor="until" help={G.offerUntilHelp}>
              <LtrInput id="until" type="date" value={data.offerUntil} min="2026-10-17" onChange={(e) => set({ offerUntil: e.target.value })} />
            </Field>
            <Field label={G.seasonLabel} htmlFor="season">
              <select id="season" value={data.seasonSlug ?? ""} onChange={(e) => set({ seasonSlug: e.target.value || null })} className="h-11 w-full rounded-sm border border-border-strong bg-surface-2 px-3.5 text-base">
                <option value="">{G.seasonNone}</option>
                {seasonOptions.map((s) => <option key={s.slug} value={s.slug}>{s.name_he}</option>)}
              </select>
            </Field>
          </div>
        </Panel>
      )}

      <Group label={G.ctaLabel}>
        <RadioCards
          label={G.ctaLabel}
          value={data.cta}
          onValueChange={(v) => set({ cta: v as CtaType, endCard: { ...data.endCard, headline: G.ctas[v as CtaType].headline } })}
          columns="grid-cols-2 sm:grid-cols-3"
          size="sm"
          items={(Object.keys(G.ctas) as CtaType[]).map((c) => {
            const I = CTA_ICONS[c];
            return {
              value: c,
              media: <I className="size-5 text-primary-text" />,
              title: G.ctas[c].label,
              description: <span className="text-micro">&quot;{G.ctas[c].headline}&quot;</span>,
              badge: c === "whatsapp" ? <span className="rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{G.ctaRecommended}</span> : undefined,
            };
          })}
        />
        {data.cta === "whatsapp" && (
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <Field label={APP_CORE.onboarding.business.fields.whatsapp} htmlFor="cta-wa">
              <LtrInput id="cta-wa" type="tel" value={data.business.whatsapp} onChange={(e) => set((d) => ({ business: { ...d.business, whatsapp: e.target.value } }))} />
            </Field>
            <Field label={G.whatsappPrefillLabel} htmlFor="cta-prefill">
              <Input id="cta-prefill" value={data.ctaPrefill} onChange={(e) => set({ ctaPrefill: e.target.value })} />
            </Field>
          </div>
        )}
      </Group>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-small">
            <span className="font-semibold">{V.audience[data.audience].title}</span> · {V.register.label} {V.register[data.register].title} · {data.voiceGender === "female" ? V.speaker.female : V.speaker.male}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setToneOpen((o) => !o)} aria-expanded={toneOpen}>
            {G.toneChange}
            <ChevronDown className={cn("transition-transform", toneOpen && "rotate-180")} aria-hidden />
          </Button>
        </div>
        {toneOpen && (
          <div className="flex flex-col gap-5">
            <Group label={V.audience.label}>
              <ChipRadio label={V.audience.label} value={data.audience} onValueChange={(v) => set({ audience: v as typeof data.audience })}
                items={(["plural", "female", "male"] as const).map((a) => ({ value: a, label: V.audience[a].title }))} />
            </Group>
            <Group label={V.register.label}>
              <ChipRadio label={V.register.label} value={data.register} onValueChange={(v) => set({ register: v as typeof data.register })}
                items={(["formal", "warm", "casual", "slang"] as const).map((r) => ({ value: r, label: V.register[r].title }))} />
            </Group>
            <Group label={V.speaker.label}>
              <ChipRadio label={V.speaker.label} value={data.voiceGender} onValueChange={(v) => set({ voiceGender: v as "female" | "male" })}
                items={[{ value: "female", label: V.speaker.female }, { value: "male", label: V.speaker.male }]} />
            </Group>
          </div>
        )}
      </Panel>
    </>
  );
}
