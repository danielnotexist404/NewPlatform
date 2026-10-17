"use client";
import * as React from "react";
import { toast } from "sonner";
import { Check, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Tooltip } from "@/components/ui/tooltip";
import { Panel, Note, StatusPill } from "@/components/settings/kit";
import { CharCount, NativeSelect, RadioCards, SavedIndicator, useAutosave } from "@/components/settings/controls";
import { brandCopy, AUDIENCE_LABEL, REGISTER_LABEL, CTA_LABEL, accountCommon } from "@/content/he/account";
import { niches } from "@/lib/data/seed";
import { MOCK_BUSINESS_PROFILE, MOCK_EXTRACT_DIFF, type CtaType, type ServiceGender } from "@/lib/mock/account";
import { fill } from "@/components/settings/format";

const b = brandCopy.business;
type Profile = typeof MOCK_BUSINESS_PROFILE;

const isPhone = (s: string) => !s.trim() || /^0\d{1,2}-?\d{3}-?\d{4}$/.test(s.replace(/\s/g, ""));
const isSite = (s: string) => !s.trim() || /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(s.trim());
const isInsta = (s: string) => !s.trim() || /^@?[A-Za-z0-9._]{1,30}$/.test(s.trim());

export function BusinessProfileForm() {
  const save = useAutosave();
  const [p, setP] = React.useState<Profile>(MOCK_BUSINESS_PROFILE);
  const [newService, setNewService] = React.useState("");
  const [extract, setExtract] = React.useState<"idle" | "running" | "done">("idle");
  const [applied, setApplied] = React.useState<string[]>([]);
  const set = <K extends keyof Profile>(key: K, v: Profile[K]) => { setP((x) => ({ ...x, [key]: v })); save.touch(); };

  const nameErr = !p.name.trim() ? b.errors.nameRequired : p.name.length > 60 ? b.errors.nameTooLong : undefined;
  const addService = () => {
    const name = newService.trim();
    if (!name) return;
    set("services", [...p.services, { id: `s-${p.services.length + 1}-${name}`, name, gender: "m" as ServiceGender, definite: `ה${name}` }]);
    setNewService("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-small text-text-2">{b.autosave}</p>
        <SavedIndicator state={save.state} />
      </div>

      <FormPanel title={b.sections.identity}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label={b.fields.name} htmlFor="bp-name" error={nameErr}>
            <Input id="bp-name" dir="auto" value={p.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!nameErr} aria-describedby={nameErr ? "bp-name-error" : undefined} />
          </Field>
          <Field label={b.fields.niche} htmlFor="bp-niche">
            <NativeSelect id="bp-niche" value={p.nicheSlug} onChange={(e) => set("nicheSlug", e.target.value)}>
              {niches.filter((n) => n.slug !== "local-politics").map((n) => <option key={n.slug} value={n.slug}>{n.name_he}</option>)}
            </NativeSelect>
          </Field>
          <Field label={b.fields.city} htmlFor="bp-city"><Input id="bp-city" value={p.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" /></Field>
          <Field label={b.fields.area} htmlFor="bp-area" optional><Input id="bp-area" value={p.area} onChange={(e) => set("area", e.target.value)} /></Field>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-desc" className="flex items-center justify-between">{b.fields.description}<CharCount value={p.description} max={300} id="bp-desc-count" /></Label>
          <Textarea id="bp-desc" maxLength={300} value={p.description} onChange={(e) => set("description", e.target.value)} aria-describedby="bp-desc-count" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bp-usp" className="flex items-center justify-between">{b.fields.usp}<CharCount value={p.usp} max={160} id="bp-usp-count" /></Label>
          <Input id="bp-usp" maxLength={160} value={p.usp} onChange={(e) => set("usp", e.target.value)} aria-describedby="bp-usp-count" />
        </div>
      </FormPanel>

      <FormPanel title={b.sections.services}>
        <ul className="flex flex-col gap-2">
          {p.services.map((s) => (
            <li key={s.id} className="grid items-center gap-3 rounded-md bg-surface-2 p-3 md:grid-cols-[1fr_auto_1fr_auto]">
              <span className="font-semibold">{s.name}</span>
              <Tooltip content={b.services.genderTip}>
                <span>
                  <ToggleGroup type="single" value={s.gender} aria-label={`${b.services.genderLabel}: ${s.name}`} onValueChange={(v) => v && set("services", p.services.map((x) => (x.id === s.id ? { ...x, gender: v as ServiceGender } : x)))}>
                    <ToggleGroupItem value="m">{b.services.male}</ToggleGroupItem>
                    <ToggleGroupItem value="f">{b.services.female}</ToggleGroupItem>
                  </ToggleGroup>
                </span>
              </Tooltip>
              <Input aria-label={`${b.services.definite} ${s.name}`} title={b.services.definite} value={s.definite} onChange={(e) => set("services", p.services.map((x) => (x.id === s.id ? { ...x, definite: e.target.value } : x)))} className="h-10" />
              <Button size="icon-sm" variant="ghost" aria-label={fill(b.services.remove, { name: s.name })} onClick={() => set("services", p.services.filter((x) => x.id !== s.id))}><X aria-hidden /></Button>
            </li>
          ))}
        </ul>
        <p className="text-small text-muted">{b.services.definite}</p>
        <form onSubmit={(e) => { e.preventDefault(); addService(); }} className="flex gap-2">
          <Input aria-label={b.services.add} placeholder={b.services.addPlaceholder} value={newService} onChange={(e) => setNewService(e.target.value)} className="max-w-sm" />
          <Button type="submit" variant="secondary" size="lg" className="h-11"><Plus aria-hidden />{b.services.add}</Button>
        </form>
      </FormPanel>

      <FormPanel title={b.sections.contact}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label={b.fields.phone} htmlFor="bp-phone" error={!isPhone(p.phone) ? b.errors.phone : undefined}>
            <LtrInput id="bp-phone" type="tel" inputMode="tel" autoComplete="tel" value={p.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!isPhone(p.phone)} />
          </Field>
          <Field label={b.fields.whatsapp} htmlFor="bp-wa" error={!isPhone(p.whatsapp) ? b.errors.phone : undefined}>
            <LtrInput id="bp-wa" type="tel" inputMode="tel" value={p.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} aria-invalid={!isPhone(p.whatsapp)} />
          </Field>
          <Field label={b.fields.website} htmlFor="bp-site" error={!isSite(p.website) ? b.errors.website : undefined}>
            <LtrInput id="bp-site" type="url" inputMode="url" placeholder="yourbusiness.co.il" value={p.website} onChange={(e) => set("website", e.target.value)} aria-invalid={!isSite(p.website)} />
          </Field>
          <Field label={b.fields.instagram} htmlFor="bp-ig" error={!isInsta(p.instagram) ? b.errors.instagram : undefined}>
            <LtrInput id="bp-ig" placeholder="@yourbusiness" value={p.instagram} onChange={(e) => set("instagram", e.target.value)} aria-invalid={!isInsta(p.instagram)} />
          </Field>
          <Field label={b.fields.facebook} htmlFor="bp-fb" optional>
            <LtrInput id="bp-fb" type="url" inputMode="url" placeholder="facebook.com/yourbusiness" value={p.facebook} onChange={(e) => set("facebook", e.target.value)} />
          </Field>
          <Field label={b.fields.address} htmlFor="bp-address">
            <Input id="bp-address" value={p.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
          </Field>
        </div>
      </FormPanel>

      <FormPanel title={b.sections.voice}>
        <div className="flex flex-col gap-2">
          <p id="aud-label" className="text-sm font-semibold">{b.fields.audience}</p>
          <RadioCards<Profile["audience"]> labelId="aud-label" value={p.audience} onValueChange={(v) => set("audience", v)} columns={3} size="sm"
            options={(["plural", "female", "male"] as const).map((v) => ({ value: v, label: AUDIENCE_LABEL[v].label, description: AUDIENCE_LABEL[v].hint }))} />
        </div>
        <div className="flex flex-col gap-2">
          <p id="reg-label" className="text-sm font-semibold">{b.fields.register}</p>
          <RadioCards<Profile["register"]> labelId="reg-label" value={p.register} onValueChange={(v) => set("register", v)} columns={4} size="sm"
            options={(["formal", "warm", "casual", "slang"] as const).map((v) => ({ value: v, label: REGISTER_LABEL[v].label, description: REGISTER_LABEL[v].hint }))} />
        </div>
        <div className="max-w-sm">
          <Field label={b.fields.preferredCta} htmlFor="bp-cta">
            <NativeSelect id="bp-cta" value={p.preferredCta} onChange={(e) => set("preferredCta", e.target.value as CtaType)}>
              {(Object.keys(CTA_LABEL) as CtaType[]).map((c) => <option key={c} value={c}>{CTA_LABEL[c].label}</option>)}
            </NativeSelect>
          </Field>
        </div>
      </FormPanel>

      <FormPanel title={b.sections.facts}>
        <Note>{b.facts.help}</Note>
        <ul className="flex flex-col gap-2" aria-label={b.sections.facts}>
          {p.facts.map((f) => (
            <li key={f.id} className="grid items-start gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input aria-label={b.facts.what} placeholder={b.facts.labelPlaceholder} value={f.label} onChange={(e) => set("facts", p.facts.map((x) => (x.id === f.id ? { ...x, label: e.target.value } : x)))} />
              <div className="flex flex-col gap-1">
                <Input aria-label={`${b.facts.value}: ${f.label}`} value={f.value} onChange={(e) => set("facts", p.facts.map((x) => (x.id === f.id ? { ...x, value: e.target.value } : x)))} aria-invalid={!f.value.trim()} />
                {!f.value.trim() && <p role="alert" className="text-small text-danger">{b.facts.empty}</p>}
              </div>
              <Button size="icon" variant="ghost" aria-label={fill(b.facts.remove, { label: f.label })} onClick={() => set("facts", p.facts.filter((x) => x.id !== f.id))}><Trash2 aria-hidden /></Button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="w-fit" onClick={() => set("facts", [...p.facts, { id: `f-${p.facts.length + 1}`, label: "", value: "" }])}><Plus aria-hidden />{b.facts.add}</Button>
      </FormPanel>

      <FormPanel title={b.sections.reextract}>
        <p className="text-small text-text-2">{b.reextract.help}</p>
        {extract !== "done" && (
          <Button variant="secondary" className="w-fit" loading={extract === "running"} onClick={() => { setExtract("running"); setTimeout(() => setExtract("done"), 1400); }}>
            {extract !== "running" && <RefreshCw aria-hidden />}
            {extract === "running" ? b.reextract.running : b.reextract.button}
          </Button>
        )}
        {extract === "done" && (
          <ul className="flex flex-col divide-y divide-border rounded-md bg-surface-2">
            {MOCK_EXTRACT_DIFF.map((d) => {
              const same = d.was === d.now;
              const done = applied.includes(d.field);
              return (
                <li key={d.field} className="grid gap-3 p-4 md:grid-cols-[120px_1fr_1fr_auto] md:items-center">
                  <span className="text-sm font-bold">{d.labelHe}</span>
                  <span className="text-small"><span className="block text-micro text-muted">{b.reextract.was}</span>{d.was}</span>
                  <span className="text-small"><span className="block text-micro text-muted">{b.reextract.now}</span>{d.now}</span>
                  {same ? (
                    <StatusPill tone="neutral">{b.reextract.same}</StatusPill>
                  ) : done ? (
                    <StatusPill tone="success">{b.reextract.updated}</StatusPill>
                  ) : (
                    <Button size="sm" onClick={() => {
                      setApplied((l) => [...l, d.field]);
                      if (d.field === "description") set("description", d.now);
                      toast.success(accountCommon.saved);
                    }}><Check aria-hidden />{b.reextract.update}</Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </FormPanel>
    </div>
  );
}

function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id}>
      <Panel className="flex flex-col gap-5">
        <h2 id={id} className="text-h3">{title}</h2>
        {children}
      </Panel>
    </section>
  );
}
