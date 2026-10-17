"use client";
import * as React from "react";
import { RadioGroup as RG } from "radix-ui";
import { CircleCheck, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LtrInput, Input } from "@/components/ui/input";
import { fill } from "@/components/projects/plural";
import { Num } from "@/components/a11y/num";
import { APP_CORE } from "@/content/he/app-core";
import type { FactAnswer, FactSlot } from "./facts";
import { cn } from "@/lib/utils";

const F = APP_CORE.wizard.facts;

export interface PanelSlot { key: string; slot: FactSlot; context: string }

function Quote({ text, token }: { text: string; token: string }) {
  const i = text.indexOf(token);
  if (i < 0) return <q dir="rtl">{text}</q>;
  return (
    <q dir="rtl" className="font-semibold">
      {text.slice(0, i)}
      <mark className="rounded-[4px] bg-lemon px-1 text-on-primary">{token.replace(/^\{|\}$/g, "")}</mark>
      {text.slice(i + token.length)}
    </q>
  );
}

export const isResolved = (a: FactAnswer | undefined) => !!a && (a.action !== "replaced" || !!a.value);

/** Part 03 §6.12 — "המספרים כאן הם דוגמה". Nothing numeric is published until the owner decides. */
export function MissingFactsPanel({
  items,
  answers,
  onConfirm,
  onReplace,
  removeActions,
  id = "missing-facts",
}: {
  items: PanelSlot[];
  answers: Record<string, FactAnswer>;
  onConfirm: (it: PanelSlot) => void;
  onReplace: (it: PanelSlot, value: string) => void;
  removeActions: (it: PanelSlot) => { label: string; onClick: () => void }[];
  id?: string;
}) {
  const open = items.filter((it) => !it.slot.resolvedFrom);
  const resolvedCount = items.filter((it) => it.slot.resolvedFrom || isResolved(answers[it.key])).length;
  const allDone = resolvedCount === items.length;
  const [expanded, setExpanded] = React.useState(!allDone);
  React.useEffect(() => { if (!allDone) setExpanded(true); }, [allDone]);
  if (items.length === 0) return null;

  if (allDone && !expanded) {
    return (
      <div id={id} className="flex items-center justify-between gap-3 rounded-md bg-success/10 px-4 py-3 text-small">
        <span className="flex items-center gap-2 font-semibold text-success"><CircleCheck className="size-4" aria-hidden />{F.allDone}</span>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>{F.edit}</Button>
      </div>
    );
  }

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-4 rounded-lg bg-lemon/[.06] p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_45%,transparent)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={`${id}-title`} className="flex items-center gap-2 text-body-lg font-bold">
            <Hash className="size-5 text-primary-text" aria-hidden />
            {F.title}
          </h2>
          <p className="text-small text-text-2">{F.body}</p>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-micro" aria-live="polite">
          {fill(F.counter, { resolved: <Num value={resolvedCount} />, total: <Num value={items.length} /> })}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <FactSlotField key={it.key} it={it} answer={answers[it.key]} onConfirm={onConfirm} onReplace={onReplace} removeActions={removeActions} />
        ))}
      </ul>
      {allDone && open.length > 0 && (
        <Button variant="secondary" size="sm" className="self-start" onClick={() => setExpanded(false)}>{F.allDone}</Button>
      )}
    </section>
  );
}

function FactSlotField({ it, answer, onConfirm, onReplace, removeActions }: {
  it: PanelSlot; answer?: FactAnswer;
  onConfirm: (it: PanelSlot) => void; onReplace: (it: PanelSlot, value: string) => void;
  removeActions: (it: PanelSlot) => { label: string; onClick: () => void }[];
}) {
  const { slot } = it;
  const [choice, setChoice] = React.useState<string>(answer?.action ?? (slot.kind === "placeholder" ? "replaced" : ""));
  const [value, setValue] = React.useState(answer?.value ?? "");
  const [save, setSave] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const numeric = slot.kind === "numeric_claim" || ["{מחיר}", "{סכום}", "{מספר}", "{הנחה}", "{דירוג}"].includes(slot.token);
  const inputId = `fact-${it.key.replace(/[^\w]/g, "")}`;

  if (slot.resolvedFrom) {
    return (
      <li className="flex flex-wrap items-center gap-2 rounded-md bg-surface-1 p-3 text-small">
        <Quote text={it.context} token={slot.token} />
        <span className="ms-auto inline-flex items-center gap-1 text-micro text-success"><CircleCheck className="size-3.5" aria-hidden />{F.fromProfile}</span>
      </li>
    );
  }

  const apply = () => {
    const v = value.trim();
    if (numeric && !/^\d[\d,.]*$/.test(v)) { setError(F.needNumber); return; }
    if (!v) { setError(F.mustChoose); return; }
    setError(null);
    onReplace(it, v);
  };

  return (
    <li className={cn("flex flex-col gap-3 rounded-md bg-surface-1 p-4", isResolved(answer) && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-success)_45%,transparent)]")}>
      <div className="flex flex-wrap items-center gap-2 text-small">
        <Quote text={it.context} token={slot.token} />
        {isResolved(answer) && <CircleCheck className="ms-auto size-4 text-success" aria-label={F.handled} />}
      </div>
      {slot.kind === "placeholder" && <p className="text-small font-semibold">{slot.labelHe}</p>}
      <RG.Root value={choice} onValueChange={(v) => { setChoice(v); if (v === "confirmed") onConfirm(it); }} aria-label={slot.labelHe} className="flex flex-col gap-2">
        {slot.kind === "numeric_claim" && <Opt value="confirmed" label={F.confirm} />}
        <Opt value="replaced" label={slot.kind === "placeholder" && !numeric ? F.fillNow : F.replace} />
        {choice === "replaced" && (
          <div className="flex flex-col gap-2 ps-7">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor={inputId} className="sr-only">{slot.labelHe}</label>
              {numeric ? (
                <LtrInput id={inputId} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 w-32" placeholder="249" aria-invalid={!!error} />
              ) : (
                <Input id={inputId} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 max-w-xs" aria-invalid={!!error} />
              )}
              {slot.unit && <span className="text-small text-text-2">{slot.unit}</span>}
              <Button size="sm" variant="secondary" onClick={apply}>{F.apply}</Button>
            </div>
            {error && <p role="alert" className="text-micro text-danger">{error}</p>}
            <label className="flex items-center gap-2 text-micro font-normal text-text-2">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
              {F.saveToProfile}
            </label>
          </div>
        )}
        <Opt value="removed" label={F.remove} />
        {choice === "removed" && (
          <div className="flex flex-wrap gap-2 ps-7">
            {removeActions(it).map((a) => (
              <Button key={a.label} size="sm" variant="secondary" onClick={a.onClick}>{a.label}</Button>
            ))}
          </div>
        )}
      </RG.Root>
    </li>
  );
}

function Opt({ value, label }: { value: string; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-small">
      <RG.Item value={value} className="flex size-5 items-center justify-center rounded-full border border-border-strong data-[state=checked]:border-primary">
        <RG.Indicator className="size-2.5 rounded-full bg-primary" />
      </RG.Item>
      {label}
    </label>
  );
}
