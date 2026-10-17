"use client";
import * as React from "react";
import Link from "next/link";
import { Bot, Clock, Lightbulb, Lock, Megaphone, Sparkles, Trophy, TriangleAlert, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LtrInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/misc";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SAMPLE_BUSINESS, type ChangeLogEntry, type HookVariant, type InsightAction, type RuleKind } from "@/lib/mock/campaigns";
import { detail as D, HOOK_KEY_HE } from "@/content/he/campaigns-app";
import { dateShort, fill, fmt, plural, timeOf } from "../text";
import { cn } from "@/lib/utils";

/* ---------- Budget (F.9, C.6 guard: ≤ 3 changes an hour) ---------- */
export function BudgetDialog({
  open,
  onOpenChange,
  current,
  changesLeft,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  current: number;
  changesLeft: number;
  initial?: number;
  onSave: (v: number) => void;
}) {
  const [value, setValue] = React.useState(initial ?? current);
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setValue(initial ?? current);
  }
  const pct = current ? Math.round(((value - current) / current) * 100) : 0;
  const maxed = changesLeft <= 0;
  const invalid = value < 20;
  const chips = [Math.round(current * 0.8), Math.round(current * 1.1), Math.round(current * 1.2)].filter((v, i, a) => v !== current && a.indexOf(v) === i);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{D.budgetDialog.title}</DialogTitle>
        <DialogDescription>{fill(D.budgetDialog.current, { amount: <Price ils={current} className="font-bold text-text" /> })}</DialogDescription>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="budget-new">{D.budgetDialog.label}</Label>
            <LtrInput id="budget-new" type="number" inputMode="numeric" min={20} value={value} disabled={maxed} aria-invalid={invalid || undefined} onChange={(e) => setValue(Math.round(Number(e.target.value) || 0))} />
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c} type="button" disabled={maxed} onClick={() => setValue(c)} className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", value === c ? "bg-primary text-on-primary" : "bg-surface-2 hover:bg-surface-3")}>
                <Price ils={c} />
              </button>
            ))}
          </div>
          <p className="flex items-start gap-2 rounded-sm bg-surface-2 p-3 text-small text-text-2">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
            <span>
              {D.budgetDialog.learning}
              {Math.abs(pct) > 20 && <span className="mt-1 block font-semibold text-primary-text">{fmt(D.budgetDialog.bigChange, { pct: `${Math.abs(pct)}%` })}</span>}
            </span>
          </p>
          <p className={cn("flex items-center gap-2 text-small", maxed ? "text-danger" : "text-text-2")}>
            <Clock className="size-4 shrink-0" aria-hidden />
            {maxed ? D.budgetDialog.maxed : `${D.budgetDialog.rate} ${plural(changesLeft, D.budgetDialog.remaining)}.`}
          </p>
          <div className="flex gap-2">
            <Button disabled={maxed || invalid || value === current} onClick={() => onSave(value)}>{D.budgetDialog.save}</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>{D.budgetDialog.cancel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Boost the winner (F.6, C14) ---------- */
export function BoostDialog({ open, onOpenChange, winner, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; winner: HookVariant; onConfirm: (raisePct: 0 | 10 | 20) => void }) {
  const [raise, setRaise] = React.useState<0 | 10 | 20>(0);
  const opts: { v: 0 | 10 | 20; label: string }[] = [
    { v: 0, label: D.boost.raiseNone },
    { v: 10, label: D.boost.raise10 },
    { v: 20, label: D.boost.raise20 },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{D.boost.dialogTitle}</DialogTitle>
        <DialogDescription>{fmt(D.boost.dialogBody, { key: HOOK_KEY_HE[winner.key] })}</DialogDescription>
        <fieldset className="mt-5 flex flex-col gap-2">
          <legend className="mb-2 text-small font-semibold">{D.boost.raiseLabel}</legend>
          <div className="grid grid-cols-3 gap-2">
            {opts.map((o) => (
              <label key={o.v} className={cn("flex cursor-pointer items-center justify-center rounded-sm px-3 py-2.5 text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus", raise === o.v ? "bg-primary text-on-primary" : "bg-surface-2 hover:bg-surface-3")}>
                <input type="radio" name="raise" className="sr-only" checked={raise === o.v} onChange={() => setRaise(o.v)} />
                <bdi>{o.label}</bdi>
              </label>
            ))}
          </div>
          <p className="text-micro font-normal text-muted">{D.boost.raiseNote}</p>
        </fieldset>
        <div className="mt-5 flex gap-2">
          <Button onClick={() => onConfirm(raise)}>
            <Trophy aria-hidden />
            {D.boost.confirm}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{D.cancel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- "מה זה אומר?" (G.4) ---------- */
export function InsightCard({ sentences, actions, onAction, hrefFor }: { sentences: React.ReactNode[]; actions: InsightAction[]; onAction: (a: InsightAction) => void; hrefFor: (a: InsightAction) => string | null }) {
  return (
    <section aria-labelledby="insight-title" className="relative overflow-hidden rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] glow-ai md:p-5">
      <div aria-hidden className="pointer-events-none absolute -top-20 inset-s-0 size-56 rounded-full bg-violet/15 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="insight-title" className="flex items-center gap-2 text-h3">
            <Sparkles className="size-5 text-violet" aria-hidden />
            {D.insight.title}
          </h2>
          <span className="rounded-full bg-violet/15 px-2.5 py-1 text-micro text-violet">{D.insight.badge}</span>
        </div>
        <div className="flex flex-col gap-2 text-body text-text">
          {sentences.map((s, i) => (
            <p key={i}>{s}</p>
          ))}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((a, i) => {
              if (a === "wait_more_data") {
                return (
                  <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm text-text-2">
                    <Clock className="size-4" aria-hidden />
                    {D.insight.actions[a]}
                  </span>
                );
              }
              const href = hrefFor(a);
              const variant = i === 0 ? "primary" : "secondary";
              return href ? (
                <Button key={a} asChild size="sm" variant={variant}>
                  <Link href={href}>
                    {D.insight.actions[a]}
                    <DirIcon name="forward" />
                  </Link>
                </Button>
              ) : (
                <Button key={a} size="sm" variant={variant} onClick={() => onAction(a)}>
                  {D.insight.actions[a]}
                </Button>
              );
            })}
          </div>
        )}
        <p className="text-micro font-normal text-muted">{D.insight.source}</p>
      </div>
    </section>
  );
}

/* ---------- Auto-rules (F.10) ---------- */
const RULE_ORDER: RuleKind[] = ["pause_expensive_ad", "boost_winner", "alert_no_results", "alert_fatigue", "monthly_cap_stop"];

export function AutoRules({ rules, onChange }: { rules: Partial<Record<RuleKind, boolean>>; onChange: (k: RuleKind, on: boolean) => void }) {
  const max = SAMPLE_BUSINESS.plan.autoRulesMax;
  const enabled = RULE_ORDER.filter((k) => rules[k]).length;
  return (
    <section aria-labelledby="rules-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
      <div className="flex flex-col gap-1">
        <h2 id="rules-title" className="flex items-center gap-2 text-h3">
          <Bot className="size-5 text-text-2" aria-hidden />
          {D.rules.title}
        </h2>
        <p className="text-small text-text-2">{D.rules.sub}</p>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {RULE_ORDER.map((k) => {
          const on = !!rules[k];
          const locked = !on && enabled >= max;
          const id = `rule-${k}`;
          return (
            <li key={k} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 flex-col gap-0.5">
                <Label htmlFor={id} className={cn("flex items-center gap-1.5", locked && "text-text-2")}>
                  {locked && <Lock className="size-3.5" aria-hidden />}
                  {D.rules.items[k].name}
                </Label>
                <p className="text-micro font-normal text-text-2">{D.rules.items[k].desc}</p>
              </div>
              <Switch
                id={id}
                checked={on}
                aria-disabled={locked || undefined}
                onCheckedChange={(v) => {
                  if (locked && v) {
                    toast.error(D.rules.limitReached);
                    return;
                  }
                  onChange(k, v);
                }}
                className={cn(locked && "opacity-50")}
              />
            </li>
          );
        })}
      </ul>
      <p className="flex flex-wrap items-center gap-x-2 text-micro font-normal text-muted">
        {fmt(D.rules.limit, { plan: `"${SAMPLE_BUSINESS.plan.nameHe}"`, n: max })}
        <Link href="/app/billing/plans" className="text-link underline-offset-4 hover:underline">{D.rules.upgrade}</Link>
      </p>
    </section>
  );
}

/* ---------- Change log (F.9, G.5) ---------- */
export function ChangeLog({ entries }: { entries: ChangeLogEntry[] }) {
  return (
    <section aria-labelledby="log-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
      <h2 id="log-title" className="text-h3">{D.log.title}</h2>
      {entries.length === 0 ? (
        <p className="text-small text-text-2">{D.log.empty}</p>
      ) : (
        <ol className="relative flex flex-col gap-4 border-s border-border ps-4">
          {entries.map((e, i) => {
            const Icon = e.source === "user" ? User : e.source === "rule" ? Bot : Megaphone;
            return (
              <li key={`${e.at}-${i}`} className="relative">
                <span aria-hidden className="absolute -inset-s-[25px] top-0.5 flex size-[17px] items-center justify-center rounded-full bg-surface-3 text-text-2">
                  <Icon className="size-2.5" />
                </span>
                <p className="text-small text-text">{e.text}</p>
                <p className="text-micro font-normal text-muted">
                  {D.log.sources[e.source]} · <bdi className="num">{dateShort(e.at)}</bdi> · <bdi className="num">{timeOf(e.at)}</bdi>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function NoticeCard({ tone, title, children, icon: Icon = TriangleAlert }: { tone: "danger" | "waiting" | "neutral"; title: string; children?: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <section
      className={cn(
        "flex items-start gap-3 rounded-md p-4 md:p-5",
        tone === "danger" && "bg-danger/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_40%,transparent)]",
        tone === "waiting" && "bg-primary/8 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
        tone === "neutral" && "bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]",
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", tone === "danger" ? "text-danger" : tone === "waiting" ? "text-primary-text" : "text-text-2")} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h2 className="text-body-lg font-bold">{title}</h2>
        {children}
      </div>
    </section>
  );
}
