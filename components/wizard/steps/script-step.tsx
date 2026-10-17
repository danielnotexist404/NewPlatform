"use client";
import * as React from "react";
import { toast } from "sonner";
import { Check, ChevronDown, Copy, PenLine, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Num } from "@/components/a11y/num";
import { fill, fillText, plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { BEAT_ROLE_LABEL, DRAFT_SCRIPT, SCRIPT_REWRITES, formatDuration, getProject, type MockScene } from "@/lib/mock/projects";
import { Panel, StepHeading } from "../choice";
import { MissingFactsPanel, type PanelSlot } from "../missing-facts-panel";
import { hasPriceClaim, scriptSlots, useWizard, withHook } from "../wizard-state";
import { cn } from "@/lib/utils";

const S = APP_CORE.wizard.script;
const WPS = 2.4; // app_settings.hebrew_wps.default (Part 05 §12)

const fixShekel = (t: string) => t.replace(/(\d[\d,.]*)\s?₪/g, "₪$1");
const dropToken = (t: string, token: string) =>
  t.replace(new RegExp(`[,:]?\\s*(?:ב-|ב)?${token.replace(/[{}]/g, "\\$&")}\\s*₪?`, "g"), "").replace(/\s+\./g, ".").trim();

export function ScriptStep() {
  const { data, set } = useWizard();
  const [shown, setShown] = React.useState(data.scriptState === "ready" ? 99 : 0);
  const [elapsed, setElapsed] = React.useState(0);

  // simulated NDJSON stream: beats arrive in order, then "התסריט מוכן לעריכה"
  React.useEffect(() => {
    if (data.scriptState !== "writing") return;
    const base = withHook(data.scenes.length ? data.scenes : DRAFT_SCRIPT, data.hooks[0]?.text);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setElapsed((e) => e + 1);
      setShown(n);
      if (n > base.length) {
        window.clearInterval(id);
        set({ scriptState: "ready", scenes: base });
        toast.success(S.ready);
        document.getElementById("wizard-step-title")?.focus();
      }
    }, 650);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.scriptState]);

  const scenes = data.scriptState === "ready" ? data.scenes : withHook(data.scenes.length ? data.scenes : DRAFT_SCRIPT, data.hooks[0]?.text);
  const writing = data.scriptState === "writing";
  const words = scenes.reduce((a, s) => a + s.vo.split(/\s+/).filter(Boolean).length, 0);
  const estSec = Math.round(words / WPS);
  const target = data.durationSec;
  const ratio = estSec / target;
  const lengthOk = ratio >= 0.75 && ratio <= 1;

  const updateScene = (i: number, p: Partial<MockScene>) => set((d) => ({ scenes: d.scenes.map((s, j) => (j === i ? { ...s, ...p } : s)) }));

  return (
    <>
      <StepHeading title={S.title} subtitle={S.subtitle} />

      {writing ? (
        <p className="flex items-center gap-3 rounded-full bg-violet/10 px-4 py-2 text-small font-semibold text-violet glow-ai self-start" aria-live="off">
          <span className="size-2 rounded-full bg-violet animate-pulse-dot" aria-hidden />
          {S.writing}
          <bdi className="font-mono text-micro text-text-2">{formatDuration(elapsed * 0.65)}</bdi>
        </p>
      ) : (
        <>
          <ScriptFactsPanel />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-small">{fillText(S.structure, { label: S.structureLabel })}</span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small", lengthOk ? "bg-success/12 text-success" : "bg-lemon/15 text-primary-text")}>
              {lengthOk && <Check className="size-3.5" aria-hidden />}
              {fill(S.length, { estimated: <Num value={estSec} />, target: <Num value={target} /> })}
            </span>
            {!lengthOk && (
              <span className="w-full text-micro font-normal text-text-2 sm:w-auto">
                {ratio > 1
                  ? fillText(S.tooLong, { diff: estSec - target, next: Math.min(60, target + 15) })
                  : fillText(S.tooShort, { diff: Math.round(target * 0.9 - estSec), prev: Math.max(15, target - 15) })}
              </span>
            )}
            <Button variant="ghost" size="sm" className="ms-auto" onClick={() => { set({ scriptState: "writing" }); setShown(0); setElapsed(0); }}>
              <RefreshCw aria-hidden />
              {S.regenerate}
              <span className="font-normal opacity-80">· {plural(2, APP_CORE.counts.credits)}</span>
            </Button>
          </div>
        </>
      )}

      <ol className="flex flex-col gap-3" aria-busy={writing}>
        {scenes.map((s, i) =>
          writing && i >= shown ? (
            <li key={s.id}><Skeleton className="h-40 rounded-lg shimmer-ai" /></li>
          ) : (
            <BeatEditor key={s.id} scene={s} index={i} start={scenes.slice(0, i).reduce((a, x) => a + x.durationSec, 0)} readOnly={writing} onChange={(p) => updateScene(i, p)} />
          ),
        )}
      </ol>

      {!writing && hasPriceClaim(data) && (
        <Panel className="flex flex-col gap-3">
          <h2 className="text-body-lg font-bold">{S.complianceTitle}</h2>
          <label className="flex items-start gap-3 text-small">
            <input type="checkbox" checked={data.priceAttested} onChange={(e) => set({ priceAttested: e.target.checked })} className="mt-1 size-4 accent-[var(--color-primary)]" />
            <span><span className="text-text-2">{S.priceClaim} </span><span className="font-semibold">{S.priceAttest}</span></span>
          </label>
        </Panel>
      )}

      {!writing && <PostCaption />}
    </>
  );
}

function BeatEditor({ scene, index, start, readOnly, onChange }: { scene: MockScene; index: number; start: number; readOnly: boolean; onChange: (p: Partial<MockScene>) => void }) {
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [custom, setCustom] = React.useState<string | null>(null);
  const osWords = scene.onscreen.split(/\s+/).filter(Boolean).length;
  const id = `beat-${scene.id}`;
  const rewrite = (kind: "short" | "energetic" | "formal") => {
    setBusy(true);
    window.setTimeout(() => {
      const alt = SCRIPT_REWRITES[scene.id]?.[kind] ?? scene.vo.split(/(?<=[.?!])\s/)[0];
      setSuggestion(alt);
      setBusy(false);
    }, 900);
  };
  return (
    <li className={cn("flex flex-col gap-3 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow", busy && "glow-ai")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-xs px-2 py-0.5 text-micro", scene.role === "hook" ? "bg-lemon text-on-primary" : "bg-surface-3 text-text-2")}>{BEAT_ROLE_LABEL[scene.role]}</span>
        <bdi dir="ltr" className="font-mono text-micro text-muted">{formatDuration(start)}–{formatDuration(start + scene.durationSec)}</bdi>
        {busy && <span className="text-micro text-violet">{S.rewriting}</span>}
        {!readOnly && (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ms-auto">
                <PenLine aria-hidden />{S.rewrite}<ChevronDown aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => rewrite("short")}>{S.rewrites[0]}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => rewrite("energetic")}>{S.rewrites[1]}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => rewrite("formal")}>{S.rewrites[2]}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setCustom("")}>{S.customInstruction}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-vo`} className="text-micro text-text-2">{S.vo}</label>
        <Textarea id={`${id}-vo`} dir="rtl" value={scene.vo} readOnly={readOnly} onChange={(e) => onChange({ vo: e.target.value })} className="min-h-16 text-body" />
      </div>
      {custom !== null && (
        <div className="flex flex-wrap items-center gap-2">
          <Input aria-label={S.customLabel} maxLength={200} placeholder={S.customPlaceholder} value={custom} onChange={(e) => setCustom(e.target.value)} className="h-10 flex-1" />
          <Button size="sm" variant="secondary" onClick={() => { setCustom(null); rewrite("short"); }}>{S.rewrite}</Button>
        </div>
      )}
      {suggestion && (
        <div className="flex flex-col gap-2 rounded-md bg-violet/[.08] p-3 glow-ai">
          <p dir="rtl" className="text-small font-semibold">{suggestion}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { onChange({ vo: suggestion }); setSuggestion(null); }}>{S.useNew}</Button>
            <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)}>{S.keepOld}</Button>
          </div>
        </div>
      )}
      {index > 0 || scene.onscreen ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-os`} className="text-micro text-text-2">{S.onscreen}</label>
            <Input id={`${id}-os`} value={scene.onscreen} readOnly={readOnly} onChange={(e) => onChange({ onscreen: e.target.value })} className="h-10" aria-describedby={`${id}-osc`} />
          </div>
          <p id={`${id}-osc`} className={cn("pb-2.5 text-micro font-normal", osWords > 8 ? "text-primary-text" : "text-muted")}>
            {fillText(S.onscreenCount, { n: osWords })}
          </p>
        </div>
      ) : null}
      {osWords > 8 && <p className="text-micro text-primary-text">{S.onscreenWarn}</p>}
      <p className="text-micro font-normal text-muted"><span className="font-semibold text-text-2">{S.visual}: </span>{scene.visual}</p>
    </li>
  );
}

function PostCaption() {
  const [open, setOpen] = React.useState(false);
  const sample = getProject("p-1001");
  const text = sample?.postCaption ?? "";
  const tags = sample?.hashtags ?? [];
  return (
    <Panel className="flex flex-col gap-3">
      <button type="button" className="flex items-center justify-between text-start font-bold" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {S.postCaption}
        <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <>
          <p className="whitespace-pre-line text-small text-text-2">{text}</p>
          <ul className="flex flex-wrap gap-1.5">{tags.map((t) => <li key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-micro">{t}</li>)}</ul>
          <Button size="sm" variant="secondary" className="self-start" onClick={async () => { try { await navigator.clipboard.writeText(`${text}\n\n${tags.join(" ")}`); } catch { /* blocked */ } toast.success(S.textCopied); }}>
            <Copy aria-hidden />{S.copy}
          </Button>
        </>
      )}
    </Panel>
  );
}

/** The script facts gate (Part 03 §6.12), shared by the script and preview steps. */
export function ScriptFactsPanel() {
  const { data, set } = useWizard();
  const factItems: PanelSlot[] = data.scriptState === "ready"
    ? scriptSlots(data).map((slot) => ({ key: `script|${slot.id}`, slot, context: data.scenes[slot.beatIndex ?? 0]?.onscreen.includes(slot.token) ? data.scenes[slot.beatIndex ?? 0].onscreen : data.scenes[slot.beatIndex ?? 0]?.vo ?? "" }))
    : [];
  if (factItems.length === 0) return null;
  return (
            <MissingFactsPanel
              items={factItems}
              answers={data.factAnswers}
              onConfirm={(it) => set((d) => ({ factAnswers: { ...d.factAnswers, [it.key]: { action: "confirmed" } } }))}
              onReplace={(it, value) =>
                set((d) => {
                  const bi = it.slot.beatIndex ?? 0;
                  const rep = (t: string) => fixShekel(it.slot.kind === "placeholder" ? t.replaceAll(it.slot.token, value) : t.replace(it.slot.number ?? "", value));
                  return {
                    scenes: d.scenes.map((s, j) => (j === bi ? { ...s, onscreen: rep(s.onscreen), vo: rep(s.vo) } : s)),
                    factAnswers: { ...d.factAnswers, [it.key]: { action: "replaced", value }, [`script|script:${bi}:${value}`]: { action: "confirmed" } },
                  };
                })
              }
              removeActions={(it) => [
                {
                  label: APP_CORE.wizard.facts.removeScript,
                  onClick: () =>
                    set((d) => {
                      const bi = it.slot.beatIndex ?? 0;
                      return {
                        scenes: d.scenes.map((s, j) => (j === bi ? { ...s, onscreen: dropToken(s.onscreen, it.slot.token), vo: dropToken(s.vo, it.slot.token) } : s)),
                        factAnswers: { ...d.factAnswers, [it.key]: { action: "removed" } },
                      };
                    }),
                },
              ]}
            />
  );
}
