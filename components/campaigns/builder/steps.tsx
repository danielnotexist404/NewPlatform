"use client";
import * as React from "react";
import { ClipboardList, Globe2, MapPin, MessageCircle, MousePointerClick, Plus, Radar, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input, LtrInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { RangeSlider } from "../range-slider";
import { Price } from "@/components/a11y/num";
import {
  builderDraft,
  CITY_SUGGESTIONS,
  daysBetween,
  GOAL_CTAS,
  monthSpendIls,
  MOCK_TODAY,
  SAMPLE_BUSINESS,
  type CampaignGoal,
  type CtaKey,
} from "@/lib/mock/campaigns";
import { builder as B, CTA_LABEL, GOAL_COPY } from "@/content/he/campaigns-app";
import { SpendCapMeter } from "../spend-cap-meter";
import { dateLong, fill, fmt } from "../text";
import { RADIUS_CHIPS, type DraftState, type Patch } from "./types";
import { cn } from "@/lib/utils";

export function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h2" tabIndex={-1} data-step-heading>
        {title}
      </h2>
      <p className="max-w-xl text-body text-text-2">{sub}</p>
    </div>
  );
}

/* ---------------- 1 · Goal ---------------- */
const GOAL_ICON: Record<CampaignGoal, React.ComponentType<{ className?: string }>> = {
  whatsapp_messages: MessageCircle,
  lead_form: ClipboardList,
  website_traffic: MousePointerClick,
  local_awareness: Radar,
};
const GOALS: CampaignGoal[] = ["whatsapp_messages", "lead_form", "website_traffic", "local_awareness"];

export function GoalStep({ d, patch }: { d: DraftState; patch: Patch }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={B.goal.title} sub={B.goal.sub} />
      <div role="radiogroup" aria-label={B.goal.title} className="grid gap-3 md:grid-cols-2">
        {GOALS.map((g) => {
          const Icon = GOAL_ICON[g];
          const selected = d.goal === g;
          return (
            <label
              key={g}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[background-color,box-shadow] hover:bg-surface-2 md:p-5",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                selected && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
              )}
            >
              <input
                type="radio"
                name="goal"
                value={g}
                checked={selected}
                onChange={() => patch({ goal: g, cta: GOAL_CTAS[g][0], qualityLeads: g === "lead_form" ? d.qualityLeads : false })}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-3">
                <span className={cn("flex size-11 items-center justify-center rounded-full", selected ? "bg-primary text-on-primary" : "bg-surface-3 text-text")}>
                  <Icon className="size-5" />
                </span>
                {g === builderDraft.defaults.goal && (
                  <span className="rounded-full bg-primary/12 px-2.5 py-1 text-micro text-primary-text">{B.goal.recommended}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-body-lg font-bold">{GOAL_COPY[g].label}</span>
                <span className="text-small text-text-2">{GOAL_COPY[g].desc}</span>
              </div>
              {g === "website_traffic" && <span className="text-micro font-normal text-muted">{B.goal.noWebsite}</span>}
              <span
                aria-hidden
                className={cn(
                  "absolute top-4 inset-e-4 hidden size-5 items-center justify-center rounded-full border-2",
                  selected ? "flex border-primary bg-primary" : "md:flex border-border-strong",
                )}
              >
                {selected && <span className="size-2 rounded-full bg-on-primary" />}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- 2 · Who & where ---------------- */
function RadiusVisual({ km }: { km: number }) {
  // map 1–80 km to a ring size; log scale so 3 vs 25 km both read
  const t = Math.log(Math.max(1, km)) / Math.log(80);
  const r = 18 + t * 72;
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {[30, 55, 80, 95].map((rr) => (
        <circle key={rr} cx="100" cy="100" r={rr} fill="none" stroke="var(--color-border)" strokeWidth="1" />
      ))}
      <line x1="100" y1="5" x2="100" y2="195" stroke="var(--color-border)" strokeWidth="1" />
      <line x1="5" y1="100" x2="195" y2="100" stroke="var(--color-border)" strokeWidth="1" />
      <circle cx="100" cy="100" r={r} fill="url(#radar-fill)" stroke="var(--color-primary)" strokeWidth="2" style={{ transition: "r 300ms var(--ease-out)" }} />
      <circle cx="100" cy="100" r="7" fill="var(--color-primary)" stroke="var(--color-surface-1)" strokeWidth="3" />
    </svg>
  );
}

export function AreaStep({ d, patch }: { d: DraftState; patch: Patch }) {
  const [q, setQ] = React.useState("");
  const matches = q.trim() ? CITY_SUGGESTIONS.filter((c) => c.includes(q.trim()) && !d.cities.includes(c)).slice(0, 6) : [];
  const maxCities = d.cities.length >= 10;
  const ctas = GOAL_CTAS[d.goal];

  function addCity(c: string) {
    if (maxCities || d.cities.includes(c)) return;
    patch({ cities: [...d.cities, c] });
    setQ("");
  }

  function onAge(v: [number, number]) {
    patch({ ageMin: v[0], ageMax: v[1] });
  }
  function onAgeCommit(v: [number, number]) {
    if (d.advantage && (v[0] > 25 || v[1] < 65)) patch({ ageWarn: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={B.area.title} sub={B.area.sub} />

      <section className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5" aria-labelledby="area-mode-label">
        <span id="area-mode-label" className="sr-only">{B.area.areaLabel}</span>
        <ToggleGroup type="single" value={d.areaMode} onValueChange={(v) => v && patch({ areaMode: v as DraftState["areaMode"] })} aria-labelledby="area-mode-label" className="w-full rounded-full">
          <ToggleGroupItem value="radius" className="flex flex-1 items-center justify-center gap-1.5 rounded-full"><MapPin className="size-4" aria-hidden />{B.area.modes.radius}</ToggleGroupItem>
          <ToggleGroupItem value="cities" className="flex-1 rounded-full">{B.area.modes.cities}</ToggleGroupItem>
          <ToggleGroupItem value="country" className="flex flex-1 items-center justify-center gap-1.5 rounded-full"><Globe2 className="size-4" aria-hidden />{B.area.modes.country}</ToggleGroupItem>
        </ToggleGroup>

        {d.areaMode === "radius" && (
          <div className="grid items-center gap-5 sm:grid-cols-[160px_1fr]">
            <div className="mx-auto size-40 sm:mx-0">
              <RadiusVisual km={d.radiusKm} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-small text-text-2">{fmt(B.area.around, { address: SAMPLE_BUSINESS.addressHe })}</p>
              <div role="radiogroup" aria-label={B.area.distanceLabel} className="flex flex-wrap gap-2">
                {RADIUS_CHIPS.map((km) => {
                  const on = !d.customKm && d.radiusKm === km;
                  return (
                    <button
                      key={km}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => patch({ radiusKm: km, customKm: false })}
                      className={cn("h-10 rounded-full px-4 text-sm font-semibold transition-colors", on ? "bg-primary text-on-primary" : "bg-surface-2 text-text hover:bg-surface-3")}
                    >
                      {fmt(B.area.km, { n: km })}
                    </button>
                  );
                })}
                <button
                  type="button"
                  role="radio"
                  aria-checked={d.customKm}
                  onClick={() => patch({ customKm: true })}
                  className={cn("h-10 rounded-full px-4 text-sm font-semibold transition-colors", d.customKm ? "bg-primary text-on-primary" : "bg-surface-2 text-text hover:bg-surface-3")}
                >
                  {B.area.customKm}
                </button>
              </div>
              {d.customKm && (
                <div className="flex max-w-56 flex-col gap-1.5">
                  <Label htmlFor="custom-km">{B.area.customKmLabel}</Label>
                  <LtrInput
                    id="custom-km"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={80}
                    value={d.radiusKm}
                    onChange={(e) => patch({ radiusKm: Math.max(1, Math.min(80, Number(e.target.value) || 1)) })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {d.areaMode === "cities" && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Label htmlFor="city-search" className="sr-only">{B.area.citiesPlaceholder}</Label>
              <Input
                id="city-search"
                value={q}
                disabled={maxCities}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && matches[0]) {
                    e.preventDefault();
                    addCity(matches[0]);
                  }
                }}
                placeholder={B.area.citiesPlaceholder}
                autoComplete="off"
                aria-describedby="city-help"
              />
              {matches.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-[var(--z-dropdown)] mt-1 overflow-hidden rounded-sm bg-surface-2 p-1 elev-2" aria-label={B.area.cityMatches}>
                  {matches.map((c) => (
                    <li key={c}>
                      <button type="button" onClick={() => addCity(c)} className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-start text-sm hover:bg-surface-3">
                        <Plus className="size-3.5 text-text-2" aria-hidden />
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p id="city-help" className="text-micro font-normal text-muted">{maxCities ? B.area.citiesMax : B.area.citiesHelp}</p>
            {d.cities.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {d.cities.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1 rounded-full bg-surface-3 py-1 ps-3 pe-1 text-sm">
                    {c}
                    <button type="button" onClick={() => patch({ cities: d.cities.filter((x) => x !== c) })} className="rounded-full p-1 text-text-2 hover:bg-surface-2 hover:text-text" aria-label={fmt(B.area.removeCity, { city: c })}>
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2" aria-label={B.area.citySuggestions}>
              {["רמת גן", "גבעתיים", "תל אביב-יפו", "בני ברק"].filter((c) => !d.cities.includes(c)).map((c) => (
                <button key={c} type="button" disabled={maxCities} onClick={() => addCity(c)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-border-strong px-3 py-1 text-small text-text-2 hover:text-text">
                  <Plus className="size-3.5" aria-hidden />
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {d.areaMode === "country" && <p className="text-small text-text-2">{B.area.countryHelp}</p>}
      </section>

      <section className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5" aria-labelledby="age-label">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="age-label" className="text-body font-bold">{B.area.age}</h3>
          <bdi className="text-body-lg font-bold num">{fmt(B.area.ageValue, { min: d.ageMin, max: d.ageMax === 65 ? "65+" : d.ageMax })}</bdi>
        </div>
        <RangeSlider min={18} max={65} value={[d.ageMin, d.ageMax]} onValueChange={onAge} onValueCommit={onAgeCommit} thumbLabels={[B.area.ageMin, B.area.ageMax]} />
        {d.advantage && (
          <p className="text-micro font-normal text-muted">
            {fill(B.area.suggestedAge, { range: <bdi className="num">{builderDraft.defaults.suggestedAge[0]}–{builderDraft.defaults.suggestedAge[1]}</bdi> })}
          </p>
        )}
        {d.ageWarn && (
          <div role="alert" className="flex flex-col gap-3 rounded-sm bg-primary/10 p-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]">
            <p className="flex items-start gap-2 text-small">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
              <span>
                <span className="block font-bold">{B.area.hardAgeTitle}</span>
                <span className="text-text-2">{B.area.hardAgeBody}</span>
              </span>
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => patch({ advantage: false, ageWarn: false })}>{B.area.hardAgeConfirm}</Button>
              <Button size="sm" variant="ghost" onClick={() => patch({ ageWarn: false, ageMin: Math.min(d.ageMin, 25), ageMax: 65 })}>{B.area.hardAgeCancel}</Button>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="advantage">{B.area.advantage}</Label>
            <p className="text-small text-text-2">{B.area.advantageHelp}</p>
          </div>
          <Switch
            id="advantage"
            checked={d.advantage}
            onCheckedChange={(on) => patch(on ? { advantage: true, ageWarn: false, ageMin: Math.min(d.ageMin, 25), ageMax: 65 } : { advantage: false, ageWarn: false })}
          />
        </div>
      </section>

      <Accordion type="single" collapsible className="rounded-md bg-surface-1 px-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-5">
        <AccordionItem value="advanced" className="border-b-0">
          <AccordionTrigger className="text-body">
            <span className="flex flex-col items-start gap-0.5">
              {B.area.advanced}
              <span className="text-micro font-normal text-muted">{B.area.advancedSub}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-5">
            <ToggleRow id="reels-only" label={B.area.reelsOnly} help={B.area.reelsOnlyHelp} checked={d.reelsOnly} onChange={(v) => patch({ reelsOnly: v })} />
            {d.goal === "lead_form" && (
              <ToggleRow id="quality-leads" label={B.area.qualityLeads} help={B.area.qualityLeadsHelp} checked={d.qualityLeads} onChange={(v) => patch({ qualityLeads: v })} />
            )}
            <ToggleRow id="creative-optin" label={B.area.creativeOptin} help={B.area.creativeOptinHelp} checked={d.creativeOptin} onChange={(v) => patch({ creativeOptin: v })} />
            {ctas.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cta-select">{B.area.ctaLabel}</Label>
                <select
                  id="cta-select"
                  value={d.cta}
                  onChange={(e) => patch({ cta: e.target.value as CtaKey })}
                  className="h-11 rounded-sm border border-border-strong bg-surface-2 px-3 text-base text-text"
                >
                  {ctas.map((c) => (
                    <option key={c} value={c}>{CTA_LABEL[c]}</option>
                  ))}
                </select>
              </div>
            )}
            {d.goal === "website_traffic" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="utm">{B.area.utm}</Label>
                <LtrInput id="utm" value={d.utm} onChange={(e) => patch({ utm: e.target.value })} aria-describedby="utm-help" />
                <p id="utm-help" className="text-micro font-normal text-muted">{B.area.utmHelp}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ToggleRow({ id, label, help, checked, onChange }: { id: string; label: string; help: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-small text-text-2">{help}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/* ---------------- 3 · Budget ---------------- */
export function BudgetStep({ d, patch }: { d: DraftState; patch: Patch }) {
  const presets = builderDraft.budgetPresets;
  const floor = builderDraft.budgetFloor;
  const monthly = d.budget * 30;
  const used = monthSpendIls();
  const monthEnd = "2026-10-31";
  const daysLeft = daysBetween(MOCK_TODAY, monthEnd) + 1;
  const projected = used + (builderDraft.committedDailyIls + d.budget) * daysLeft;
  const capWarn = projected > SAMPLE_BUSINESS.plan.monthlyCapIls;
  const days = d.duration === "date" ? Math.max(1, daysBetween(MOCK_TODAY, d.endDate) + 1) : null;

  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={B.budget.title} sub={B.budget.sub} />
      <div role="radiogroup" aria-label={B.budget.title} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {presets.map((p) => {
          const on = !d.customBudget && d.budget === p;
          const rec = p === builderDraft.recommendedBudget;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => patch({ budget: p, customBudget: false })}
              className={cn(
                "relative flex flex-col items-start gap-1 rounded-md bg-surface-1 p-4 text-start shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[background-color,box-shadow] hover:bg-surface-2",
                on && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
              )}
            >
              {rec && <span className="absolute -top-2.5 inset-s-3 rounded-full bg-primary px-2 py-0.5 text-micro text-on-primary">{B.budget.recommended}</span>}
              <span className="text-h3 font-bold"><Price ils={p} /></span>
              <span className="text-small text-text-2">{B.budget.perDay}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Button variant={d.customBudget ? "secondary" : "ghost"} size="sm" onClick={() => patch({ customBudget: true })} aria-pressed={d.customBudget}>
          {B.budget.custom}
        </Button>
        {d.customBudget && (
          <div className="flex max-w-56 flex-col gap-1.5">
            <Label htmlFor="custom-budget">{B.budget.customLabel}</Label>
            <LtrInput
              id="custom-budget"
              type="number"
              inputMode="numeric"
              min={floor}
              value={d.budget}
              aria-invalid={d.budget < floor || undefined}
              aria-describedby="budget-min"
              onChange={(e) => patch({ budget: Math.round(Number(e.target.value) || 0) })}
            />
            <p id="budget-min" className={cn("text-micro font-normal", d.budget < floor ? "text-danger" : "text-muted")}>
              {fill(B.budget.min, { min: <Price ils={floor} /> })}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
        <p className="text-h3 font-bold">{fill(B.budget.monthly, { amount: <Price ils={monthly} className="text-gold-gradient" /> })}</p>
        <p className="text-small text-text-2">{B.budget.monthlyNote}</p>
        <p className="mt-2 text-small text-text-2">{B.budget.noPromise}</p>
      </div>

      <section className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5" aria-labelledby="duration-label">
        <h3 id="duration-label" className="text-body font-bold">{B.budget.duration}</h3>
        <ToggleGroup type="single" value={d.duration} onValueChange={(v) => v && patch({ duration: v as DraftState["duration"] })} aria-labelledby="duration-label" className="w-fit rounded-full">
          <ToggleGroupItem value="date" className="rounded-full">{B.budget.untilDate}</ToggleGroupItem>
          <ToggleGroupItem value="open" className="rounded-full">{B.budget.untilStopped}</ToggleGroupItem>
        </ToggleGroup>
        {d.duration === "date" && (
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end-date">{B.budget.endDate}</Label>
              <LtrInput id="end-date" type="date" min={MOCK_TODAY} value={d.endDate} onChange={(e) => e.target.value && patch({ endDate: e.target.value })} className="w-48" />
            </div>
            {days && (
              <p className="pb-2.5 text-small text-text-2">
                {fill(B.budget.total, { amount: <Price ils={d.budget * days} className="font-bold text-text" />, date: dateLong(d.endDate) })}
              </p>
            )}
          </div>
        )}
        <p className="text-small text-text-2">{B.budget.firstTip}</p>
      </section>

      <section className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5" aria-labelledby="cap-label">
        <h3 id="cap-label" className="text-body font-bold">{fmt(B.budget.planMeter, { plan: `"${SAMPLE_BUSINESS.plan.nameHe}"` })}</h3>
        <SpendCapMeter compact usedIls={used} capIls={SAMPLE_BUSINESS.plan.monthlyCapIls} planName={SAMPLE_BUSINESS.plan.nameHe} userCapIls={d.userCapOn ? d.userCap : null} />
        {capWarn && (
          <p role="status" className="flex items-start gap-2 rounded-sm bg-primary/10 p-3 text-small">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
            {B.budget.capWarn}
          </p>
        )}
        <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="user-cap">{B.budget.userCap}</Label>
            <p className="text-small text-text-2">{B.budget.userCapHelp}</p>
          </div>
          <Switch id="user-cap" checked={d.userCapOn} onCheckedChange={(v) => patch({ userCapOn: v })} />
        </div>
        {d.userCapOn && (
          <div className="flex max-w-56 flex-col gap-1.5">
            <Label htmlFor="user-cap-value">{B.budget.userCapLabel}</Label>
            <LtrInput id="user-cap-value" type="number" inputMode="numeric" min={floor} value={d.userCap} onChange={(e) => patch({ userCap: Math.round(Number(e.target.value) || 0) })} />
          </div>
        )}
      </section>

      <div className="flex flex-col gap-2 text-small text-text-2">
        <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{B.budget.money}</p>
        <p className="ps-6">{B.budget.honest}</p>
      </div>
    </div>
  );
}
