"use client";
import * as React from "react";
import { WandSparkles, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { HookText } from "@/components/hooks/hook-text";
import type { Values } from "@/components/hooks/text";
import { NativeSelect, CharCount } from "@/components/settings/controls";
import { Note } from "@/components/settings/kit";
import { WrittenHookCard } from "./app-hook-card";
import { hooksCopy as h, AUDIENCE_LABEL, REGISTER_LABEL, accountCommon } from "@/content/he/account";
import { niches } from "@/lib/data/seed";
import { MOCK_BUSINESS_PROFILE, MOCK_NEW_HOOKS, MOCK_VARIATIONS, type WorkspaceHook } from "@/lib/mock/account";
import { fill } from "@/components/settings/format";

const v = h.variations;
export type VariationsMode = { kind: "existing"; sourceId: string; sourceText: string } | { kind: "new"; niche?: string; topic?: string };

/**
 * HookVariationsDialog (Part 03 §14): two modes, both POST /api/hooks/variations (NDJSON stream, 1 credit).
 * Opening never charges — only the "כתבו" button does. Results stream into cards and are saved to workspace_hooks.
 */
export function HookVariationsDialog({
  mode, onClose, values, onSaved,
}: {
  mode: VariationsMode | null;
  onClose: () => void;
  values: Values;
  onSaved: (hooks: WorkspaceHook[]) => void;
}) {
  const [gender, setGender] = React.useState<keyof typeof AUDIENCE_LABEL>(MOCK_BUSINESS_PROFILE.audience);
  const [register, setRegister] = React.useState<keyof typeof REGISTER_LABEL>(MOCK_BUSINESS_PROFILE.register);
  const [topic, setTopic] = React.useState("");
  const [niche, setNiche] = React.useState(MOCK_BUSINESS_PROFILE.nicheSlug);
  const [state, setState] = React.useState<"idle" | "streaming" | "done">("idle");
  const [results, setResults] = React.useState<{ textHe: string; strength: 1 | 2 | 3 | 4 | 5; whyHe: string }[]>([]);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!mode) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset each time the dialog opens (never auto-start)
    setState("idle"); setResults([]);
    if (mode.kind === "new") { setTopic(mode.topic ?? ""); setNiche(mode.niche || MOCK_BUSINESS_PROFILE.nicheSlug); }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [mode]);

  const start = () => {
    if (!mode) return;
    const source = mode.kind === "existing" ? MOCK_VARIATIONS : MOCK_NEW_HOOKS;
    setState("streaming");
    setResults([]);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setResults(source.slice(0, i));
      if (i >= source.length) {
        if (timer.current) clearInterval(timer.current);
        setState("done");
        onSaved(source.map((r, k) => ({ id: `wh-new-${Date.now()}-${k}`, textHe: r.textHe, strength: r.strength, whyHe: r.whyHe, sourceHookId: mode.kind === "existing" ? mode.sourceId : null, projectTitle: null, createdAt: "2026-10-17" })));
      }
    }, 420);
  };

  const total = mode?.kind === "new" ? 10 : 5;
  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && state !== "streaming" && onClose()}>
      <DialogContent size="xl" className="max-h-[92dvh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2"><WandSparkles className="size-5 text-violet" aria-hidden />{mode?.kind === "new" ? v.titleNew : v.titleExisting}</DialogTitle>
        <DialogDescription>{v.costNote}</DialogDescription>

        <div className="mt-5 flex flex-col gap-5">
          {mode?.kind === "existing" && (
            <div className="rounded-md bg-surface-2 p-4">
              <p className="text-micro text-muted">{v.original}</p>
              <blockquote className="mt-1 text-body-lg font-bold"><HookText text={mode.sourceText} values={values} /></blockquote>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mode?.kind === "new" && (
              <>
                <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
                  <span className="flex items-center justify-between">{v.topic}<CharCount value={topic} max={80} /></span>
                  <Input maxLength={80} placeholder={v.topicPlaceholder} value={topic} onChange={(e) => setTopic(e.target.value)} disabled={state === "streaming"} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
                  {v.niche}
                  <NativeSelect value={niche} onChange={(e) => setNiche(e.target.value)} disabled={state === "streaming"}>
                    {niches.filter((n) => n.slug !== "local-politics").map((n) => <option key={n.slug} value={n.slug}>{n.name_he}</option>)}
                  </NativeSelect>
                </label>
              </>
            )}
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {v.gender}
              <NativeSelect value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} disabled={state === "streaming"}>
                {(Object.keys(AUDIENCE_LABEL) as (keyof typeof AUDIENCE_LABEL)[]).map((g) => <option key={g} value={g}>{AUDIENCE_LABEL[g].label}</option>)}
              </NativeSelect>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {v.register}
              <NativeSelect value={register} onChange={(e) => setRegister(e.target.value as typeof register)} disabled={state === "streaming"}>
                {(Object.keys(REGISTER_LABEL) as (keyof typeof REGISTER_LABEL)[]).map((r) => <option key={r} value={r}>{REGISTER_LABEL[r].label}</option>)}
              </NativeSelect>
            </label>
          </div>

          {state === "idle" && (
            <Button size="lg" className="w-fit glow-ai" onClick={start}>
              <Coins aria-hidden />
              {mode?.kind === "new" ? v.write10 : v.write5}
            </Button>
          )}

          {state !== "idle" && (
            <div className="flex flex-col gap-3">
              <p role="status" aria-live="polite" className="text-sm font-semibold text-violet">
                {state === "streaming" ? v.writing : fill(v.done, { n: results.length })}
              </p>
              <ul className="grid gap-3 md:grid-cols-2" aria-busy={state === "streaming"}>
                {results.map((r, i) => (
                  <li key={i}><WrittenHookCard id={`preview-${i}`} text={r.textHe} strength={r.strength} why={r.whyHe} values={values} /></li>
                ))}
                {state === "streaming" && Array.from({ length: Math.max(0, total - results.length) }).slice(0, 2).map((_, i) => (
                  <li key={`sk-${i}`} className="flex flex-col gap-3 rounded-lg p-5 shimmer-ai glow-ai">
                    <Skeleton className="h-4 w-24 bg-transparent" />
                    <Skeleton className="h-6 w-full bg-surface-3/60" />
                    <Skeleton className="h-6 w-3/4 bg-surface-3/60" />
                  </li>
                ))}
              </ul>
              {state === "done" && <Note tone="success">{v.savedNote}</Note>}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose} disabled={state === "streaming"}>{accountCommon.close}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
