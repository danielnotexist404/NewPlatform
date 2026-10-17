"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, CircleAlert, Loader2, Megaphone, Plus, Send, BarChart3, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PhonePreview } from "@/components/video/phone-preview";
import { NicheGrid } from "@/components/wizard/niche-grid";
import { Group, Panel, RadioCards } from "@/components/wizard/choice";
import { fillText } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { getNiche } from "@/lib/data/seed";
import { MOCK_BUSINESS, type AudienceGender, type BrandToken, type MockService, type Register } from "@/lib/mock/workspace";
import { cn } from "@/lib/utils";

const O = APP_CORE.onboarding;
const STEPS = ["business", "niche", "voice", "connect"] as const;
type Step = (typeof STEPS)[number];
const SWATCHES: BrandToken[] = ["primary", "rose", "violet", "lemon", "success", "text"];

interface Biz {
  name: string; city: string; phone: string; whatsapp: string; sameWa: boolean; usp: string;
  services: MockService[]; colors: BrandToken[]; logo: boolean; facts: { key: string; label: string; checked: boolean }[];
}
const EMPTY: Biz = { name: "", city: "", phone: "", whatsapp: "", sameWa: true, usp: "", services: [], colors: ["primary", "text"], logo: false, facts: [] };

const normUrl = (raw: string) => {
  const v = raw.trim();
  if (/^@[\w.]{2,30}$/.test(v)) return `https://instagram.com/${v.slice(1)}`;
  if (/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v)) return v.startsWith("http") ? v : `https://${v}`;
  return null;
};

export function OnboardingFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const [step, setStep] = React.useState<Step>(sp.get("step") === "connect" ? "connect" : "business");
  const [mode, setMode] = React.useState<"url" | "analyzing" | "card">("url");
  const [url, setUrl] = React.useState("");
  const [urlError, setUrlError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState(0);
  const [extracted, setExtracted] = React.useState(false);
  const [biz, setBiz] = React.useState<Biz>(EMPTY);
  const [touched, setTouched] = React.useState(false);
  const [niche, setNiche] = React.useState<string | null>(null);
  const [otherNiche, setOtherNiche] = React.useState("");
  const [audience, setAudience] = React.useState<AudienceGender>("plural");
  const [register, setRegister] = React.useState<Register>("casual");
  const [speaker, setSpeaker] = React.useState<"female" | "male">("female");
  const [ui, setUi] = React.useState<AudienceGender>("plural");
  const [connect, setConnect] = React.useState<"idle" | "connecting" | "connected">("idle");
  const idx = STEPS.indexOf(step);

  React.useEffect(() => {
    document.getElementById("ob-title")?.focus({ preventScroll: true });
  }, [step]);

  // simulated SSE rows from /api/brand/extract
  React.useEffect(() => {
    if (mode !== "analyzing") return;
    const id = window.setTimeout(() => {
      if (rows + 1 < O.business.progress.length) { setRows(rows + 1); return; }
      setBiz({ ...EMPTY, name: MOCK_BUSINESS.name, city: MOCK_BUSINESS.city, phone: MOCK_BUSINESS.phone, whatsapp: MOCK_BUSINESS.whatsapp, usp: MOCK_BUSINESS.usp, services: MOCK_BUSINESS.services, colors: MOCK_BUSINESS.brandColors, logo: true, facts: MOCK_BUSINESS.factCandidates });
      setExtracted(true);
      setNiche(MOCK_BUSINESS.nicheSlug);
      const r = MOCK_BUSINESS.register;
      setRegister(r);
      setMode("card");
      toast.success(O.business.done);
    }, 700);
    return () => window.clearTimeout(id);
  }, [mode, rows]);

  const nameError = touched && !biz.name.trim() ? O.business.errors.nameEmpty : biz.name.length > 60 ? O.business.errors.nameLong : undefined;
  const phoneError = biz.phone && !/^0\d{1,2}-?\d{7}$/.test(biz.phone.replace(/\s/g, "")) ? O.business.errors.phone : undefined;
  const canNext = step === "business" ? mode === "card" && !!biz.name.trim() && !phoneError : step === "niche" ? !!niche || !!otherNiche.trim() : true;

  const next = () => {
    if (step === "business" && !biz.name.trim()) { setTouched(true); return; }
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const title = (t: string) => t;
  const nicheObj = niche ? getNiche(niche) : null;
  const previewName = biz.name || O.business.fields.name;

  return (
    <div className="grid gap-10 pb-16 xl:grid-cols-[minmax(0,640px)_1fr] xl:justify-center">
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
        <div className="flex items-center justify-between gap-3">
          <ol className="flex items-center gap-2" aria-label={fillText(O.stepOf, { n: idx + 1, total: STEPS.length })}>
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2" aria-current={s === step ? "step" : undefined}>
                <span className={cn("flex size-7 items-center justify-center rounded-full text-micro", i < idx ? "bg-primary/15 text-primary-text" : i === idx ? "bg-primary text-on-primary glow-primary" : "bg-surface-2 text-muted")}>
                  {i < idx ? <Check className="size-3.5" aria-hidden /> : <bdi className="num">{i + 1}</bdi>}
                </span>
                <span className={cn("hidden whitespace-nowrap text-small font-semibold sm:inline", i === idx ? "text-text" : "text-muted")}>{O.steps[s]}</span>
                {i < STEPS.length - 1 && <span aria-hidden className={cn("h-px w-4 sm:w-6", i < idx ? "bg-primary/50" : "bg-border")} />}
              </li>
            ))}
          </ol>
          <Link href="/app" className="shrink-0 text-small font-semibold text-text-2 hover:text-text">{O.skip}</Link>
        </div>

        {step === "business" && (
          <section className="flex flex-col gap-6" aria-labelledby="ob-title">
            <div className="flex flex-col gap-2">
              <h1 id="ob-title" tabIndex={-1} className="text-h1 outline-none">{title(O.business.title)}</h1>
              <p className="text-body-lg text-text-2">{O.business.subtitle}</p>
            </div>
            {mode === "url" && (
              <Panel className="flex flex-col gap-4">
                <Field label={O.business.urlLabel} htmlFor="ob-url" error={urlError ?? undefined}>
                  <div className="flex gap-2">
                    <LtrInput id="ob-url" size="lg" type="url" placeholder={O.business.urlPlaceholder} value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={!!urlError} />
                    <Button
                      size="lg"
                      className="h-[52px]"
                      onClick={() => {
                        if (!normUrl(url)) { setUrlError(O.business.invalidUrl); return; }
                        setUrlError(null); setRows(0); setMode("analyzing");
                      }}
                    >
                      {O.business.analyze}
                      <span className="font-normal opacity-80">· {O.business.analyzeFree}</span>
                    </Button>
                  </div>
                </Field>
                <button type="button" onClick={() => { setBiz(EMPTY); setMode("card"); }} className="self-start text-small font-semibold text-link underline underline-offset-2">
                  {O.business.manual}
                </button>
              </Panel>
            )}
            {mode === "analyzing" && (
              <Panel tone="ai" className="flex flex-col gap-4" aria-live="polite">
                <ul className="flex flex-col gap-2.5">
                  {O.business.progress.slice(0, rows + 1).map((r, i) => (
                    <li key={r} className="flex items-center gap-2.5 text-small">
                      {i < rows ? <Check className="size-4 text-success" aria-hidden /> : <Loader2 className="size-4 animate-spin text-violet" aria-hidden />}
                      <span className={i < rows ? "text-text" : "text-text-2"}>{r}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" className="self-start" onClick={() => { setBiz(EMPTY); setMode("card"); }}>{O.business.stop}</Button>
              </Panel>
            )}
            {mode === "card" && (
              <Panel className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span className={cn("flex size-16 shrink-0 items-center justify-center rounded-md text-2xl font-black", biz.logo ? "bg-primary text-on-primary glow-primary" : "border-2 border-dashed border-border-strong text-muted")} aria-hidden>
                    {biz.logo ? (biz.name.slice(0, 1) || MOCK_BUSINESS.logoLetter) : <Plus className="size-6" />}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-small font-semibold">{biz.logo ? O.business.fields.logo : O.business.fields.logoUpload}</p>
                    <Button variant="secondary" size="sm" className="self-start" onClick={() => setBiz((b) => ({ ...b, logo: true }))}>{biz.logo ? O.business.fields.replace : O.business.fields.logoUpload}</Button>
                  </div>
                </div>
                <Field label={O.business.fields.name} htmlFor="ob-name" error={nameError}>
                  <Input id="ob-name" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} onBlur={() => setTouched(true)} aria-invalid={!!nameError} required />
                </Field>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">{O.business.fields.colors}</p>
                  <div className="flex flex-wrap gap-2">
                    {SWATCHES.map((t) => {
                      const on = biz.colors.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          aria-label={t}
                          onClick={() => setBiz((b) => ({ ...b, colors: on ? b.colors.filter((x) => x !== t) : [...b.colors, t].slice(0, 4) }))}
                          className={cn("size-9 rounded-full shadow-[inset_0_0_0_1px_var(--color-frame)]", on && "ring-2 ring-offset-2 ring-offset-surface-1 ring-text")}
                          style={{ background: `var(--color-${t})` }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">{O.business.fields.services}</p>
                  <ul className="flex flex-col gap-2">
                    {biz.services.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Input aria-label={`${O.business.fields.services} ${i + 1}`} value={s.name} onChange={(e) => setBiz((b) => ({ ...b, services: b.services.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} className="h-10" />
                        <ToggleGroup type="single" value={s.gender} onValueChange={(v) => v && setBiz((b) => ({ ...b, services: b.services.map((x, j) => (j === i ? { ...x, gender: v as "m" | "f" } : x)) }))} aria-label={O.business.fields.serviceGender}>
                          <ToggleGroupItem value="m">{O.business.fields.genderM}</ToggleGroupItem>
                          <ToggleGroupItem value="f">{O.business.fields.genderF}</ToggleGroupItem>
                        </ToggleGroup>
                        <Button variant="ghost" size="icon-sm" aria-label={APP_CORE.projects.menu.delete} onClick={() => setBiz((b) => ({ ...b, services: b.services.filter((_, j) => j !== i) }))}><X aria-hidden /></Button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-micro font-normal text-muted">{O.business.fields.serviceGender}</p>
                  <Button variant="ghost" size="sm" className="self-start" onClick={() => setBiz((b) => ({ ...b, services: [...b.services, { name: "", gender: "m" }] }))}><Plus aria-hidden />{O.business.fields.addService}</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={O.business.fields.city} htmlFor="ob-city"><Input id="ob-city" value={biz.city} onChange={(e) => setBiz({ ...biz, city: e.target.value })} /></Field>
                  <Field label={O.business.fields.phone} htmlFor="ob-phone" error={phoneError}>
                    <LtrInput id="ob-phone" type="tel" placeholder="050-1234567" value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} aria-invalid={!!phoneError} />
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-small">
                  <input type="checkbox" checked={biz.sameWa} onChange={(e) => setBiz({ ...biz, sameWa: e.target.checked })} className="size-4 accent-[var(--color-primary)]" />
                  {O.business.fields.sameWhatsapp}
                </label>
                {!biz.sameWa && (
                  <Field label={O.business.fields.whatsapp} htmlFor="ob-wa"><LtrInput id="ob-wa" type="tel" value={biz.whatsapp} onChange={(e) => setBiz({ ...biz, whatsapp: e.target.value })} /></Field>
                )}
                <Field label={O.business.fields.usp} htmlFor="ob-usp">
                  <Textarea id="ob-usp" maxLength={160} value={biz.usp} onChange={(e) => setBiz({ ...biz, usp: e.target.value })} className="min-h-16" />
                </Field>
                {biz.facts.length > 0 && (
                  <fieldset className="flex flex-col gap-2 rounded-md bg-lemon/[.07] p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_40%,transparent)]">
                    <legend className="sr-only">{O.business.fields.facts}</legend>
                    <p className="text-small font-semibold">{O.business.fields.factsTitle}</p>
                    {biz.facts.map((f, i) => (
                      <label key={f.key} className="flex items-center gap-2 text-small">
                        <input type="checkbox" checked={f.checked} onChange={(e) => setBiz((b) => ({ ...b, facts: b.facts.map((x, j) => (j === i ? { ...x, checked: e.target.checked } : x)) }))} className="size-4 accent-[var(--color-primary)]" />
                        {f.label}
                      </label>
                    ))}
                  </fieldset>
                )}
              </Panel>
            )}
          </section>
        )}

        {step === "niche" && (
          <section className="flex flex-col gap-6" aria-labelledby="ob-title">
            <div className="flex flex-col gap-2">
              <h1 id="ob-title" tabIndex={-1} className="text-h1 outline-none">{O.niche.title}</h1>
              <p className="text-body-lg text-text-2">{O.niche.subtitle}</p>
            </div>
            <NicheGrid
              value={niche}
              onChange={setNiche}
              other={otherNiche}
              onOtherChange={setOtherNiche}
              preselectedSlug={extracted ? MOCK_BUSINESS.nicheSlug : null}
              preselectedLabel={O.niche.guessed}
              labels={{ search: O.niche.search, other: O.niche.other, otherLabel: O.niche.otherLabel, complianceTitle: O.niche.complianceTitle, noResults: O.niche.noResults, groupLabel: O.niche.title }}
            />
          </section>
        )}

        {step === "voice" && (
          <section className="flex flex-col gap-7" aria-labelledby="ob-title">
            <div className="flex flex-col gap-2">
              <h1 id="ob-title" tabIndex={-1} className="text-h1 outline-none">{O.voice.title}</h1>
              <p className="text-body-lg text-text-2">{O.voice.subtitle}</p>
            </div>
            <Group label={O.voice.audience.label}>
              <RadioCards label={O.voice.audience.label} value={audience} onValueChange={(v) => setAudience(v as AudienceGender)} columns="sm:grid-cols-3" size="sm"
                items={(["plural", "female", "male"] as const).map((a) => ({ value: a, title: O.voice.audience[a].title, description: `"${O.voice.audience[a].sample}"` }))} />
            </Group>
            <Group label={O.voice.register.label}>
              <RadioCards label={O.voice.register.label} value={register} onValueChange={(v) => setRegister(v as Register)} columns="grid-cols-2" size="sm"
                items={(["formal", "warm", "casual", "slang"] as const).map((r) => ({ value: r, title: O.voice.register[r].title, description: O.voice.register[r].sample }))} />
            </Group>
            <div className="rounded-lg bg-primary/[.07] p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]" aria-live="polite">
              <p className="text-micro text-muted">{O.voice.sampleLabel}</p>
              <p className="mt-1 text-h3">{O.voice.samples[audience][register]}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Group label={O.voice.speaker.label}>
                <ToggleGroup type="single" value={speaker} onValueChange={(v) => v && setSpeaker(v as "female" | "male")} aria-label={O.voice.speaker.label} className="self-start">
                  <ToggleGroupItem value="female">{O.voice.speaker.female}</ToggleGroupItem>
                  <ToggleGroupItem value="male">{O.voice.speaker.male}</ToggleGroupItem>
                </ToggleGroup>
              </Group>
              <Group label={O.voice.ui.label}>
                <ToggleGroup type="single" value={ui} onValueChange={(v) => v && setUi(v as AudienceGender)} aria-label={O.voice.ui.label} className="self-start">
                  <ToggleGroupItem value="plural">{O.voice.ui.plural}</ToggleGroupItem>
                  <ToggleGroupItem value="female">{O.voice.ui.female}</ToggleGroupItem>
                  <ToggleGroupItem value="male">{O.voice.ui.male}</ToggleGroupItem>
                </ToggleGroup>
              </Group>
            </div>
          </section>
        )}

        {step === "connect" && (
          <section className="flex flex-col gap-6" aria-labelledby="ob-title">
            <div className="flex flex-col gap-2">
              <h1 id="ob-title" tabIndex={-1} className="text-h1 outline-none">{O.connect.title}</h1>
              <p className="text-body-lg text-text-2">{O.connect.subtitle}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {O.connect.why.map((w, i) => {
                const I = [Send, Megaphone, BarChart3][i];
                return (
                  <li key={w.title} className="flex flex-col gap-2 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                    <I className="size-5 text-primary-text" aria-hidden />
                    <p className="font-bold">{w.title}</p>
                    <p className="text-small text-text-2">{w.body}</p>
                  </li>
                );
              })}
            </ul>
            <Panel className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5 text-success" aria-hidden />{O.connect.permissionsTitle}</h2>
              <ul className="flex flex-col gap-1.5 text-small text-text-2">
                {O.connect.permissions.map((p) => <li key={p} className="flex gap-2"><Check className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />{p}</li>)}
              </ul>
            </Panel>
            {connect === "connected" ? (
              <Panel className="flex flex-col gap-3" aria-live="polite">
                <h2 className="font-bold">{O.connect.checklistTitle}</h2>
                <ul className="flex flex-col gap-2">
                  {O.connect.checklist.map((c) => {
                    const ok = c.key !== "whatsapp";
                    return (
                      <li key={c.key} className="flex flex-col gap-1 rounded-md bg-surface-2 p-3">
                        <span className="flex items-center gap-2 text-small font-semibold">
                          {ok ? <Check className="size-4 text-success" aria-hidden /> : <CircleAlert className="size-4 text-primary-text" aria-hidden />}
                          {c.label}
                        </span>
                        {!ok && (
                          <span className="ps-6 text-micro font-normal text-text-2">
                            {c.fix}{" "}
                            <Link href="/app/settings/integrations/meta" className="font-semibold text-link underline underline-offset-2">{O.connect.fixCta}</Link>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-small text-text-2">{O.connect.connectedBody}</p>
              </Panel>
            ) : (
              <div className="flex flex-col gap-3">
                <Button size="lg" className="self-start" loading={connect === "connecting"} onClick={() => { setConnect("connecting"); window.setTimeout(() => { setConnect("connected"); toast.success(O.connect.connected); }, 1600); }}>
                  {connect === "connecting" ? O.connect.connecting : O.connect.connectCta}
                </Button>
                <p className="text-micro font-normal text-muted">{O.connect.note} {O.connect.demoNote}</p>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-3">
            {idx > 0 && <Button variant="ghost" onClick={() => setStep(STEPS[idx - 1])}><DirIcon name="back" />{O.back}</Button>}
            {step === "connect" ? (
              <>
                <Button size="lg" className="ms-auto" onClick={() => router.push("/app/create?src=onboarding")}>{O.finish}</Button>
              </>
            ) : (
              <Button size="lg" className="ms-auto" onClick={next} disabled={!canNext}>{O.next}<DirIcon name="forward" /></Button>
            )}
          </div>
          {step === "connect" && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" onClick={() => router.push("/app/create?src=onboarding")}>{O.connect.later}</Button>
              <Link href="/app" className="text-small font-semibold text-link underline underline-offset-2">{O.finishToDashboard}</Link>
            </div>
          )}
        </div>
      </div>

      <aside className="hidden xl:block" aria-label={O.previewLabel}>
        <div className="sticky top-[calc(var(--header-h)+32px)] flex flex-col items-center gap-3">
          <PhonePreview
            key={`${previewName}-${nicheObj?.slug ?? ""}`}
            scenes={[{ id: "brand", onscreen: previewName, vo: biz.usp || O.voice.samples[audience][register], durationSec: 5, tone: biz.colors.includes("violet") ? "violet" : biz.colors.includes("rose") ? "ember" : "gold", icon: nicheObj?.icon ?? "Store" }]}
            title={O.previewLabel}
            width={280}
            autoPlay
            loop
            glow
          />
          <p className="text-micro font-normal text-muted">{O.previewLabel}</p>
        </div>
      </aside>
    </div>
  );
}
