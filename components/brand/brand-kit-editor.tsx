"use client";
import * as React from "react";
import Link from "next/link";
import { ImageUp, Lock, Play, Smartphone, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, LtrInput } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { Slider, Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PageHeader, Panel, Note, Tag } from "@/components/settings/kit";
import { CharCount, FilterChips, NativeSelect, RadioCards, SavedIndicator, useAutosave } from "@/components/settings/controls";
import { BrandPreviewPhone, LogoMark, type PreviewContext } from "./brand-preview-phone";
import { CaptionPreview, captionContrast } from "./caption-preview";
import { BRAND_FONTS, fontFamily } from "./brand-fonts";
import { brandCopy, CTA_LABEL, CAPTION_PRESET_LABEL, MUSIC_MOOD_LABEL, AUDIENCE_LABEL, REGISTER_LABEL, accountCommon } from "@/content/he/account";
import { getNiche, hooksForNiche, nicheExtra } from "@/lib/data/seed";
import {
  MOCK_BUSINESS_PROFILE, MOCK_VOICES, type BrandKit, type BrandFont, type CaptionPresetId, type CtaType, type MusicMood,
} from "@/lib/mock/account";
import { fill, isHex } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

const e = brandCopy.editor;
const SECTIONS = ["logo", "colors", "fonts", "captions", "intro", "endCard", "voice", "numbers"] as const;
const PRESETS: CaptionPresetId[] = ["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"];
const CTAS = Object.keys(CTA_LABEL) as CtaType[];
const MOODS = Object.keys(MUSIC_MOOD_LABEL) as MusicMood[];
const LOCKED_FLAGS = new Set(["medical", "financial", "legal", "real_estate"]);
const isPhoneIL = (s: string) => /^0\d{1,2}-?\d{3}-?\d{4}$/.test(s.replace(/\s/g, ""));

export function BrandKitEditor({ initial }: { initial: BrandKit }) {
  const save = useAutosave();
  const [kit, setKit] = React.useState<BrandKit>(initial);
  const [logo, setLogo] = React.useState<string | null>(null);
  const [logoDark, setLogoDark] = React.useState<string | null>(null);
  const [voiceGender, setVoiceGender] = React.useState<"female" | "male">(MOCK_VOICES.find((v) => v.id === initial.defaultVoiceId)?.gender ?? "female");
  const [ctaExtra, setCtaExtra] = React.useState({ phone: MOCK_BUSINESS_PROFILE.phone, booking: "", keyword: "", website: MOCK_BUSINESS_PROFILE.website });
  const [playing, setPlaying] = React.useState<string | null>(null);

  const biz = MOCK_BUSINESS_PROFILE;
  const niche = getNiche(biz.nicheSlug);
  const recommendedCta = (nicheExtra(biz.nicheSlug)?.default_cta as CtaType | undefined) ?? "whatsapp";
  const lockedDisclaimer = niche && LOCKED_FLAGS.has(niche.compliance_flag) ? niche.compliance_note_he : null;
  const hook = hooksForNiche(biz.nicheSlug).find((h) => h.placeholders.length === 0)?.text_he ?? "";

  const update = (patch: Partial<BrandKit>) => { setKit((k) => ({ ...k, ...patch })); save.touch(); };
  const updateEnd = (patch: Partial<BrandKit["endCard"]>) => { setKit((k) => ({ ...k, endCard: { ...k.endCard, ...patch } })); save.touch(); };

  const ctx: PreviewContext = {
    businessName: biz.name,
    serviceName: biz.services[0]?.name ?? "",
    hookText: hook,
    phone: biz.phone,
    website: ctaExtra.website,
    instagram: biz.instagram,
    address: biz.address,
    lockedDisclaimer,
  };
  const contrastLow = captionContrast(kit.captionPreset, { ...kit.colors, highlight: kit.captionHighlight }) < 4.5;
  const nameError = !kit.name.trim() ? e.name.required : kit.name.length > 60 ? e.name.tooLong : undefined;

  return (
    <>
      <PageHeader
        title={kit.name || brandCopy.kits.newName}
        back={{ href: "/app/brand", label: e.back }}
        actions={<SavedIndicator state={save.state} />}
      />
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
          <nav aria-label={e.anchorsLabel} className="sticky top-[calc(var(--header-h)+8px)] z-10 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
            <ul className="flex w-max gap-1 rounded-full glass p-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              {SECTIONS.map((s) => (
                <li key={s}>
                  <a href={`#${s}`} className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-text-2 hover:bg-surface-3 hover:text-text">{e.anchors[s]}</a>
                </li>
              ))}
            </ul>
          </nav>

          <Panel>
            <Field label={e.name.label} htmlFor="kit-name" error={nameError}>
              <Input id="kit-name" dir="auto" maxLength={60} value={kit.name} onChange={(ev) => update({ name: ev.target.value })} aria-invalid={!!nameError} aria-describedby={nameError ? "kit-name-error" : undefined} />
            </Field>
          </Panel>

          {/* Logo */}
          <EditorSection id="logo">
            <div className="grid gap-6">
              <LogoSlot label={e.logo.main} id="logo-main" kit={kit} src={logo} onChange={(s) => { setLogo(s); save.touch(); }} />
              <LogoSlot label={e.logo.dark} id="logo-dark" kit={kit} src={logoDark} onChange={(s) => { setLogoDark(s); save.touch(); }} darkOnly />
            </div>
            <p className="text-small text-text-2">{e.logo.formats}</p>
            <Note>{e.logo.tip}</Note>
          </EditorSection>

          {/* Colors */}
          <EditorSection id="colors">
            <div className="grid gap-4 sm:grid-cols-2">
              {(["primary", "secondary", "accent", "text"] as const).map((k) => (
                <ColorField key={k} id={`color-${k}`} label={e.colors[k]} value={kit.colors[k]} onChange={(v) => update({ colors: { ...kit.colors, [k]: v } })} />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">{e.colors.previewTitle}</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {(["image", "dark", "light", "busy"] as const).map((b) => (
                  <figure key={b} className="flex flex-col gap-1.5">
                    <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-sm p-2 pb-4" style={{ background: backdrop(b, kit) }}>
                      <CaptionPreview preset={kit.captionPreset} colors={{ ...kit.colors, highlight: kit.captionHighlight }} text={e.colors.sample.split(" ").slice(0, 3).join(" ")} size={17} />
                    </div>
                    <figcaption className="text-center text-micro font-normal text-muted">{e.colors.backdrops[b]}</figcaption>
                  </figure>
                ))}
              </div>
              {contrastLow && <Note tone="warning">{e.colors.contrastWarning}</Note>}
            </div>
          </EditorSection>

          {/* Fonts */}
          <EditorSection id="fonts">
            <div className="flex flex-col gap-2">
              <p id="font-heading-label" className="text-sm font-semibold">{e.fonts.heading}</p>
              <RadioCards<BrandFont>
                labelId="font-heading-label"
                value={kit.fonts.heading}
                onValueChange={(v) => update({ fonts: { ...kit.fonts, heading: v } })}
                columns={3}
                size="sm"
                options={BRAND_FONTS.map((f) => ({
                  value: f,
                  label: <bdi dir="ltr">{f}</bdi>,
                  extra: <span className="block truncate text-body-lg leading-snug" style={{ fontFamily: fontFamily(f) }}>{e.fonts.sample}</span>,
                }))}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-[240px_1fr] md:items-end">
              <Field label={e.fonts.body} htmlFor="font-body">
                <NativeSelect id="font-body" value={kit.fonts.body} onChange={(ev) => update({ fonts: { ...kit.fonts, body: ev.target.value as BrandFont } })}>
                  {BRAND_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </NativeSelect>
              </Field>
              <p className="rounded-sm bg-surface-2 px-4 py-2.5 text-body" style={{ fontFamily: fontFamily(kit.fonts.body) }}>{biz.description}</p>
            </div>
            <p className="text-small text-muted">{e.fonts.note}</p>
          </EditorSection>

          {/* Captions */}
          <EditorSection id="captions">
            <p id="preset-label" className="text-sm font-semibold">{e.captions.preset}</p>
            <RadioCards<CaptionPresetId>
              labelId="preset-label"
              value={kit.captionPreset}
              onValueChange={(v) => update({ captionPreset: v })}
              columns={3}
              size="sm"
              options={PRESETS.map((pr) => ({
                value: pr,
                label: CAPTION_PRESET_LABEL[pr],
                extra: (
                  <span className="mt-2 flex h-24 items-center justify-center overflow-hidden rounded-sm px-2" style={{ background: backdrop("image", kit) }}>
                    <CaptionPreview preset={pr} colors={{ ...kit.colors, highlight: kit.captionHighlight }} text={e.colors.sample.split(" ").slice(0, 3).join(" ")} size={18} />
                  </span>
                ),
              }))}
            />
            <div className="max-w-sm">
              <ColorField id="caption-highlight" label={e.captions.highlight} value={kit.captionHighlight} onChange={(v) => update({ captionHighlight: v })} />
            </div>
            {contrastLow && <Note tone="warning">{e.colors.contrastWarning}</Note>}
          </EditorSection>

          {/* Intro & overlays */}
          <EditorSection id="intro">
            <div className="flex flex-col gap-2">
              <p id="intro-label" className="text-sm font-semibold">{e.intro.intro}</p>
              <RadioCards<BrandKit["introStyle"]> labelId="intro-label" value={kit.introStyle} onValueChange={(v) => update({ introStyle: v })} columns={3} size="sm"
                options={(["none", "logo_reveal", "title_card"] as const).map((v) => ({ value: v, label: e.intro.introOptions[v] }))} />
            </div>
            <div className="flex flex-col gap-2">
              <p id="lt-label" className="text-sm font-semibold">{e.intro.lowerThird}</p>
              <RadioCards<BrandKit["lowerThird"]> labelId="lt-label" value={kit.lowerThird} onValueChange={(v) => update({ lowerThird: v })} columns={3} size="sm"
                options={(["glass", "solid", "none"] as const).map((v) => ({ value: v, label: e.intro.lowerThirdOptions[v] }))} />
            </div>
            <div className="flex flex-col gap-4 rounded-md bg-surface-2 p-4">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="wm-on" className="font-semibold">{e.intro.watermark}</label>
                <Switch id="wm-on" checked={kit.watermark.on} aria-describedby="wm-help" onCheckedChange={(on) => update({ watermark: { ...kit.watermark, on } })} />
              </div>
              <p id="wm-help" className="text-small text-text-2">{e.intro.watermarkHelp}</p>
              {kit.watermark.on && (
                <>
                  <div className="flex flex-col gap-2">
                    <p id="wm-pos" className="text-sm font-semibold">{e.intro.position}</p>
                    <RadioCards<BrandKit["watermark"]["position"]> labelId="wm-pos" value={kit.watermark.position} onValueChange={(position) => update({ watermark: { ...kit.watermark, position } })} columns={4} size="sm"
                      options={(["top_start", "top_end", "bottom_start", "bottom_end"] as const).map((v) => ({ value: v, label: e.intro.positions[v] }))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span id="wm-opacity" className="flex items-center justify-between text-sm font-semibold">{e.intro.opacity}<bdi className="num text-text-2">{kit.watermark.opacity}%</bdi></span>
                    <Slider aria-labelledby="wm-opacity" min={20} max={100} step={5} value={[kit.watermark.opacity]} onValueChange={([opacity]) => update({ watermark: { ...kit.watermark, opacity } })} />
                  </div>
                </>
              )}
            </div>
          </EditorSection>

          {/* End card */}
          <EditorSection id="endCard">
            <p id="cta-label" className="text-sm font-semibold">{e.endCard.cta}</p>
            <RadioCards<CtaType>
              labelId="cta-label"
              value={kit.endCard.ctaType}
              onValueChange={(v) => {
                const wasDefault = kit.endCard.headline === CTA_LABEL[kit.endCard.ctaType].headline || !kit.endCard.headline;
                updateEnd({ ctaType: v, ...(wasDefault ? { headline: CTA_LABEL[v].headline.replace("{keyword}", ctaExtra.keyword || e.endCard.keywordDefault) } : {}) });
              }}
              columns={3}
              size="sm"
              options={[recommendedCta, ...CTAS.filter((x) => x !== recommendedCta)].map((v) => ({
                value: v,
                label: CTA_LABEL[v].label,
                badge: v === recommendedCta ? <Tag variant="lemon">{e.endCard.recommended}</Tag> : undefined,
                description: CTA_LABEL[v].headline.replace("{keyword}", "…"),
              }))}
            />
            {kit.endCard.ctaType === "whatsapp" && (
              <div className="grid gap-4 md:grid-cols-[minmax(0,240px)_1fr]">
                <Field label={e.endCard.whatsappNumber} htmlFor="wa-number" error={kit.endCard.whatsappNumber && !isPhoneIL(kit.endCard.whatsappNumber) ? e.endCard.phoneError : undefined}>
                  <LtrInput id="wa-number" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-1234567" value={kit.endCard.whatsappNumber} onChange={(ev) => updateEnd({ whatsappNumber: ev.target.value })} aria-invalid={!!kit.endCard.whatsappNumber && !isPhoneIL(kit.endCard.whatsappNumber)} />
                </Field>
                <Field label={e.endCard.whatsappPrefill} htmlFor="wa-prefill">
                  <Input id="wa-prefill" value={kit.endCard.whatsappPrefill} placeholder={fill(e.endCard.whatsappPrefillDefault, { service: ctx.serviceName })} onChange={(ev) => updateEnd({ whatsappPrefill: ev.target.value })} />
                </Field>
              </div>
            )}
            {kit.endCard.ctaType === "call" && (
              <div className="max-w-xs"><Field label={brandCopy.business.fields.phone} htmlFor="cta-phone"><LtrInput id="cta-phone" type="tel" value={ctaExtra.phone} onChange={(ev) => { setCtaExtra((x) => ({ ...x, phone: ev.target.value })); save.touch(); }} /></Field></div>
            )}
            {kit.endCard.ctaType === "booking" && (
              <div className="max-w-md"><Field label={CTA_LABEL.booking.label} htmlFor="cta-booking"><LtrInput id="cta-booking" type="url" inputMode="url" placeholder="yourbusiness.co.il/booking" value={ctaExtra.booking} onChange={(ev) => { setCtaExtra((x) => ({ ...x, booking: ev.target.value })); save.touch(); }} /></Field></div>
            )}
            {kit.endCard.ctaType === "visit_site" && (
              <div className="max-w-md"><Field label={brandCopy.business.fields.website} htmlFor="cta-site"><LtrInput id="cta-site" type="url" inputMode="url" placeholder="yourbusiness.co.il" value={ctaExtra.website} onChange={(ev) => { setCtaExtra((x) => ({ ...x, website: ev.target.value })); save.touch(); }} /></Field></div>
            )}
            {kit.endCard.ctaType === "comment_keyword" && (
              <div className="max-w-xs"><Field label={CTA_LABEL.comment_keyword.label} htmlFor="cta-keyword"><Input id="cta-keyword" maxLength={15} value={ctaExtra.keyword} onChange={(ev) => { setCtaExtra((x) => ({ ...x, keyword: ev.target.value })); updateEnd({ headline: CTA_LABEL.comment_keyword.headline.replace("{keyword}", ev.target.value) }); }} /></Field></div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end-headline" className="flex items-center justify-between">{e.endCard.headline}<CharCount value={kit.endCard.headline} max={30} id="end-headline-count" /></Label>
              <Input id="end-headline" maxLength={30} value={kit.endCard.headline} onChange={(ev) => updateEnd({ headline: ev.target.value })} aria-describedby="end-headline-help end-headline-count" />
              <p id="end-headline-help" className="text-small text-muted">{e.endCard.headlineHelp}</p>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-semibold">{e.endCard.show}</legend>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {(Object.keys(e.endCard.toggles) as (keyof typeof e.endCard.toggles)[]).map((k) => (
                  <label key={k} className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3.5 py-2.5 text-sm font-semibold">
                    {e.endCard.toggles[k]}
                    <Switch checked={kit.endCard[k]} onCheckedChange={(v) => updateEnd({ [k]: v })} />
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="end-disclaimer" className="flex items-center justify-between">{e.endCard.disclaimer}<CharCount value={kit.endCard.disclaimer} max={120} /></Label>
                <Input id="end-disclaimer" maxLength={120} placeholder={e.endCard.disclaimerPlaceholder} value={kit.endCard.disclaimer} onChange={(ev) => updateEnd({ disclaimer: ev.target.value })} />
              </div>
              <Field label={e.endCard.license} htmlFor="end-license">
                <Input id="end-license" placeholder={e.endCard.licensePlaceholder} value={kit.endCard.license} onChange={(ev) => updateEnd({ license: ev.target.value })} />
              </Field>
            </div>
            {lockedDisclaimer && (
              <Note tone="lock" icon={<Lock aria-hidden />}><p className="font-semibold">{e.endCard.lockedDisclaimer}</p><p>{lockedDisclaimer}</p></Note>
            )}
            <p className="text-small text-muted">{e.endCard.override}</p>
          </EditorSection>

          {/* Voice & music */}
          <EditorSection id="voice">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p id="voice-label" className="text-sm font-semibold">{e.voice.voice}</p>
              <ToggleGroup type="single" value={voiceGender} onValueChange={(v) => v && setVoiceGender(v as "female" | "male")} aria-labelledby="voice-label">
                <ToggleGroupItem value="female">{e.voice.female}</ToggleGroupItem>
                <ToggleGroupItem value="male">{e.voice.male}</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <RadioCards<string>
              labelId="voice-label"
              value={kit.defaultVoiceId ?? ""}
              onValueChange={(v) => update({ defaultVoiceId: v })}
              columns={2}
              size="sm"
              options={MOCK_VOICES.filter((v) => v.gender === voiceGender).map((v) => ({
                value: v.id,
                label: v.nameHe,
                badge: v.id === initial.defaultVoiceId ? <Tag variant="violet">{e.voice.brandVoice}</Tag> : undefined,
                description: `${v.ageHe} · ${v.toneHe}`,
              }))}
            />
            <div className="flex flex-wrap gap-2">
              {MOCK_VOICES.filter((v) => v.gender === voiceGender).map((v) => (
                <Button key={v.id} size="sm" variant="secondary" aria-pressed={playing === v.id} onClick={() => { setPlaying(v.id); toast(e.voice.playing); setTimeout(() => setPlaying(null), 1800); }}>
                  {playing === v.id ? <Volume2 aria-hidden /> : <Play aria-hidden />}
                  {e.voice.play}: {v.nameHe}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">{e.voice.mood}</p>
              <FilterChips<MusicMood> label={e.voice.mood} value={kit.musicMood ?? "warm"} onChange={(v) => update({ musicMood: v })} options={MOODS.map((m) => ({ value: m, label: MUSIC_MOOD_LABEL[m] }))} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-2 px-4 py-3">
              <span className="text-small"><span className="font-semibold">{e.voice.tone}: </span>{fill(e.voice.toneSummary, { audience: AUDIENCE_LABEL[biz.audience].label, register: REGISTER_LABEL[biz.register].label })}</span>
              <Link href="/app/brand?tab=business" className="text-sm font-semibold text-link underline-offset-4 hover:underline">{e.voice.toneLink}</Link>
            </div>
          </EditorSection>

          {/* Numbers */}
          <EditorSection id="numbers">
            <p id="shekel-label" className="text-sm font-semibold">{e.numbers.label}</p>
            <RadioCards<BrandKit["shekelFormat"]> labelId="shekel-label" value={kit.shekelFormat} onValueChange={(v) => update({ shekelFormat: v })} columns={2} size="sm"
              options={[
                { value: "prefix", label: <bdi dir="ltr" className="num">{e.numbers.prefix}</bdi> },
                { value: "suffix", label: <bdi dir="ltr" className="num">{e.numbers.suffix}</bdi> },
              ]} />
          </EditorSection>
        </div>

        <aside className="hidden lg:col-span-5 lg:block" aria-label={e.preview.label}>
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <BrandPreviewPhone kit={kit} ctx={ctx} logoSrc={logo} width={300} />
          </div>
        </aside>
      </div>

      {/* Mobile: preview behind a floating button (same as the wizard) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="fixed bottom-[calc(var(--bottom-bar-h)+16px)] inset-e-4 z-[var(--z-sticky)] glow-primary lg:hidden">
            <Smartphone aria-hidden />
            {e.preview.open}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" title={e.preview.title} closeLabel={accountCommon.close}>
          <BrandPreviewPhone kit={kit} ctx={ctx} logoSrc={logo} width={230} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function EditorSection({ id, children }: { id: (typeof SECTIONS)[number]; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <Panel className="flex flex-col gap-5">
        <h2 id={`${id}-title`} className="text-h3">{e.anchors[id]}</h2>
        {children}
      </Panel>
    </section>
  );
}

function backdrop(kind: "image" | "dark" | "light" | "busy", kit: BrandKit): string {
  switch (kind) {
    case "image": return `radial-gradient(90% 70% at 70% 20%, color-mix(in oklab, ${kit.colors.primary} 60%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, ${kit.colors.secondary} 70%, var(--color-black)), var(--color-black))`;
    case "dark": return "var(--color-black)";
    case "light": return "var(--color-white)";
    case "busy": return `repeating-linear-gradient(135deg, ${kit.colors.accent} 0 14px, var(--color-white) 14px 28px, ${kit.colors.primary} 28px 42px)`;
  }
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the text field in sync when the swatch changes
    setDraft(value);
  }, [value]);
  const invalid = !isHex(draft);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <label className="relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-[inset_0_0_0_1px_var(--color-border-strong)]" style={{ background: isHex(draft) ? draft : value }}>
          <span className="sr-only">{fill(e.colors.pick, { name: label })}</span>
          <input type="color" value={value} onChange={(ev) => { onChange(ev.target.value.toUpperCase()); }} className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
        <LtrInput
          id={id}
          value={draft}
          maxLength={7}
          spellCheck={false}
          onChange={(ev) => { const v = ev.target.value; setDraft(v); if (isHex(v)) onChange(v.toUpperCase()); }}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className="font-mono uppercase"
        />
      </div>
      {invalid && <p id={`${id}-error`} role="alert" className="text-small text-danger">{e.colors.hexError}</p>}
    </div>
  );
}

function LogoSlot({ id, label, kit, src, onChange, darkOnly }: { id: string; label: string; kit: BrandKit; src: string | null; onChange: (s: string | null) => void; darkOnly?: boolean }) {
  const [error, setError] = React.useState<string | null>(null);
  const [wide, setWide] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
    if (!["image/png", "image/svg+xml", "image/webp", "image/jpeg"].includes(file.type)) { setError(fill(e.logo.badType, { ext })); return; }
    if (file.size > 5 * 1024 * 1024) { setError(fill(e.logo.tooBig, { name: file.name })); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (file.type !== "image/svg+xml" && Math.min(img.naturalWidth, img.naturalHeight) < 256) { setError(e.logo.tooSmall); URL.revokeObjectURL(url); return; }
      setError(null);
      setWide(img.naturalWidth >= img.naturalHeight * 4);
      onChange(url);
    };
    img.src = url;
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {!darkOnly && (
          <div className="flex aspect-[4/3] w-40 flex-col items-center justify-center gap-2 rounded-sm bg-white">
            <LogoMark kit={kit} src={src} size={64} />
            <span className="text-micro font-normal text-black/60">{e.logo.onLight}</span>
          </div>
        )}
        <div className="flex aspect-[4/3] w-40 flex-col items-center justify-center gap-2 rounded-sm bg-black shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <LogoMark kit={kit} src={src} size={64} />
          <span className="text-micro font-normal text-white/60">{e.logo.onDark}</span>
        </div>
      </div>
      {!src && <p className="sr-only">{e.logo.placeholderSr}</p>}
      <input ref={inputRef} id={id} type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" className="sr-only" onChange={(ev) => { const f = ev.target.files?.[0]; if (f) onFile(f); ev.target.value = ""; }} />
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
          <ImageUp aria-hidden />
          {src ? e.logo.replace : e.logo.choose}
        </Button>
        {src && (
          <Button size="sm" variant="ghost" onClick={() => { onChange(null); setWide(false); }}>
            <Trash2 aria-hidden />
            {e.logo.remove}
          </Button>
        )}
      </div>
      {error && <p role="alert" className="text-small text-danger">{error}</p>}
      {wide && <Note tone="warning">{e.logo.wide}</Note>}
    </div>
  );
}
