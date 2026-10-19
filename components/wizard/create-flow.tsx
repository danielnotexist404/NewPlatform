"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Flame, Mic, MicOff, Pencil, RefreshCw } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta } from "@/components/layout/cta-styles";
import { Button } from "@/components/ui/button";
import { PhonePreview } from "@/components/video/phone-preview";
import { SceneArt } from "@/components/video/scene-art";
import { fillText } from "@/components/projects/plural";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { getHookType, niches } from "@/lib/data/seed";
import { compressImage, saveVideo, type StoredScene } from "@/lib/generate/store";
import type { GenAspect, ImageResponse, ScriptResponse } from "@/lib/generate/types";
import { MOCK_BUSINESS, MOCK_CREDITS, MOCK_TREND } from "@/lib/mock/workspace";
import { RenderScreen } from "./render-screen";
import {
  CAPTION_FOR, FORMATS, GOALS, MOODS, STYLES, costOf, draftScenes, factsComplete, finalHook, initCreate, openFacts, rawHook, scriptRequest, suggestedHooks,
  type CreateState, type CreateStyle, type HookChoice, type Screen,
} from "./create-state";
import { cn } from "@/lib/utils";

const C = SIMPLE_APP.create;
const nf = new Intl.NumberFormat("he-IL");
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

// ---------- small building blocks ----------

function Chip({ name, value, checked, onChange, children, className }: { name: string; value: string; checked: boolean; onChange: () => void; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("relative cursor-pointer", className)}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold ring-1 transition-[background-color,box-shadow,color] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
          checked ? "bg-ink text-paper ring-ink" : "bg-surface-1 text-text-2 ring-border hover:text-text hover:ring-border-strong",
        )}
      >
        {children}
      </span>
    </label>
  );
}

function Group({ label, children, hint }: { label: string; hint?: string; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <div role="radiogroup" aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <h2 id={id} className="text-body-lg font-bold">{label}</h2>
        {hint && <span className="text-small text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Stepper({ screen, canReach, onGo }: { screen: Screen; canReach: (s: Screen) => boolean; onGo: (s: Screen) => void }) {
  return (
    <nav aria-label={fillText(C.stepOf, { n: screen + 1 })}>
      <ol className="flex items-center gap-2 md:gap-3">
        {C.steps.map((label, i) => {
          const s = i as Screen;
          const current = s === screen;
          const done = s < screen;
          return (
            <li key={label} className="flex items-center gap-2 md:gap-3">
              {i > 0 && <span aria-hidden className={cn("h-px w-5 md:w-10", done || current ? "bg-primary-text/50" : "bg-border")} />}
              <button
                type="button"
                disabled={current || !canReach(s)}
                onClick={() => onGo(s)}
                aria-current={current ? "step" : undefined}
                className="flex items-center gap-2 rounded-full disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-micro",
                    current ? "bg-accent-gradient text-ink" : done ? "bg-surface-3 text-text" : "bg-surface-2 text-muted ring-1 ring-border",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : <bdi className="num">{i + 1}</bdi>}
                </span>
                <span className={cn("hidden text-small font-semibold md:inline", current ? "text-text" : "text-muted")}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------- screen 1: about ----------

function HookCard({ hook, checked, onSelect }: { hook: HookChoice; checked: boolean; onSelect: () => void }) {
  const type = hook.typeSlug ? getHookType(hook.typeSlug)?.name_he : null;
  return (
    <label className="group relative flex cursor-pointer">
      <input type="radio" name="hook" value={hook.key} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        className={cn(
          "flex min-h-36 w-full flex-col justify-between gap-4 rounded-lg bg-surface-1 p-5 ring-1 transition-[box-shadow,transform] duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
          checked ? "elev-2 ring-2 ring-primary-text" : "elev-1 ring-border hover:-translate-y-0.5 hover:elev-2",
        )}
      >
        <span dir="auto" className="text-body-lg font-bold leading-snug [text-wrap:balance]">{hook.text}</span>
        <span className="flex items-center justify-between gap-2">
          <span className="text-micro font-normal text-muted">{type}</span>
          <span className={cn("flex size-6 items-center justify-center rounded-full transition-colors", checked ? "bg-accent-gradient text-ink" : "ring-1 ring-border-strong")}>
            {checked && <Check className="size-3.5" aria-hidden />}
          </span>
        </span>
      </span>
    </label>
  );
}

function AboutScreen({ s, set }: { s: CreateState; set: (p: Partial<CreateState>) => void }) {
  const [page, setPage] = React.useState(0);
  const suggestions = suggestedHooks(s, page);
  const ownSelected = s.hook?.source === "own";
  const nicheId = React.useId();
  return (
    <div className="flex flex-col gap-10">
      <h1 id="create-title" tabIndex={-1} className="text-h1 outline-none">{C.about.title}</h1>

      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        <div className="flex flex-col gap-3">
          <label htmlFor={nicheId} className="text-body-lg font-bold">{C.about.niche}</label>
          <span className="relative inline-flex w-fit">
            <select
              id={nicheId}
              value={s.nicheSlug}
              onChange={(e) => set({ nicheSlug: e.target.value, hook: null, trend: false, facts: {} })}
              className="h-11 appearance-none rounded-full bg-surface-1 pe-11 ps-5 text-[15px] font-semibold text-text ring-1 ring-border-strong hover:bg-surface-2"
            >
              {niches.map((n) => (
                <option key={n.slug} value={n.slug}>{n.name_he}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute inset-e-4 top-1/2 size-4 -translate-y-1/2 text-text-2" aria-hidden />
          </span>
        </div>
        <Group label={C.about.goal}>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Chip key={g} name="goal" value={g} checked={s.goal === g} onChange={() => set({ goal: g })}>{C.about.goals[g]}</Chip>
            ))}
          </div>
        </Group>
      </div>

      <Group label={C.about.hook} hint={C.about.hookHint}>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {suggestions.map((h) => (
            <HookCard key={h.key} hook={h} checked={s.hook?.key === h.key} onSelect={() => set({ hook: h, facts: {} })} />
          ))}
        </div>
        <label
          className={cn(
            "flex items-center gap-3 rounded-lg bg-surface-1 px-5 py-2 ring-1 transition-shadow focus-within:ring-2 focus-within:ring-primary-text",
            ownSelected ? "ring-2 ring-primary-text elev-2" : "ring-border elev-1",
          )}
        >
          <input
            type="radio"
            name="hook"
            value="own"
            checked={ownSelected}
            onChange={() => set({ hook: { key: "own", text: "", source: "own", typeSlug: null }, facts: {} })}
            className="sr-only"
          />
          <Pencil className="size-4 shrink-0 text-text-2" aria-hidden />
          <span className="sr-only">{C.about.own}</span>
          <input
            type="text"
            dir="auto"
            maxLength={160}
            value={s.ownText}
            placeholder={`${C.about.own}…`}
            aria-label={C.about.own}
            onFocus={() => !ownSelected && set({ hook: { key: "own", text: "", source: "own", typeSlug: null }, facts: {} })}
            onChange={(e) => set({ ownText: e.target.value, hook: { key: "own", text: "", source: "own", typeSlug: null } })}
            className="h-11 min-w-0 flex-1 bg-transparent text-body font-semibold text-text outline-none placeholder:font-normal placeholder:text-muted"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {!s.trend && (
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => p + 1)}>
              <RefreshCw aria-hidden />
              {C.about.more}
            </Button>
          )}
          <button
            type="button"
            onClick={() => (s.trend ? set({ trend: false, hook: null, durationSec: 30 }) : set({ trend: true, durationSec: 15, hook: { key: "trend:0", text: MOCK_TREND.hooks[0], source: "trend", typeSlug: "pattern-interrupt" }, facts: {} }))}
            aria-pressed={s.trend}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors",
              s.trend ? "bg-primary/20 text-primary-text" : "text-text-2 hover:bg-surface-2 hover:text-text",
            )}
          >
            <Flame className="size-4 text-primary-text" aria-hidden />
            {C.about.inspiration}
            <span className="font-normal text-muted">· {MOCK_TREND.nameHe}</span>
          </button>
        </div>
      </Group>
    </div>
  );
}

// ---------- screen 2: look ----------

const STYLE_ART: Record<CreateStyle, { tone: "ember" | "smoke" | "violet"; caption: string }> = {
  cinematic: { tone: "ember", caption: "font-black text-[13cqw]" },
  ugc: { tone: "smoke", caption: "rounded-[0.3em] bg-black/75 px-[0.4em] text-[10cqw] font-bold" },
  text_motion: { tone: "violet", caption: "font-display text-[18cqw] font-bold" },
};

function AspectGlyph({ a }: { a: GenAspect }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-[3px] ring-[1.5px] ring-current"
      style={a === "9:16" ? { width: 9, height: 15 } : a === "1:1" ? { width: 13, height: 13 } : { width: 17, height: 10 }}
    />
  );
}

function LookScreen({ s, set }: { s: CreateState; set: (p: Partial<CreateState>) => void }) {
  const L = C.look;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 id="create-title" tabIndex={-1} className="text-h1 outline-none">{L.title}</h1>
        <p className="text-body-lg text-text-2">{L.hint}</p>
      </div>

      <Group label={L.style}>
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {STYLES.map((st) => {
            const checked = s.style === st;
            const art = STYLE_ART[st];
            return (
              <label key={st} className="cursor-pointer">
                <input type="radio" name="style" value={st} checked={checked} onChange={() => set({ style: st })} className="peer sr-only" />
                <span
                  className={cn(
                    "flex flex-col overflow-hidden rounded-lg bg-surface-1 ring-1 transition-[box-shadow,transform] duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                    checked ? "elev-2 ring-2 ring-primary-text" : "elev-1 ring-border hover:-translate-y-0.5 hover:elev-2",
                  )}
                >
                  <span className="@container relative block aspect-[4/5] bg-black">
                    <SceneArt tone={art.tone} icon={st === "ugc" ? "Camera" : st === "text_motion" ? "Sparkles" : "Flame"} />
                    <span className="absolute inset-x-[8%] top-1/2 flex -translate-y-1/2 justify-center text-center leading-[1.1] text-white">
                      <span className={art.caption} style={{ textShadow: "0 3px 14px rgb(0 0 0 / .6)" }}>{MOCK_BUSINESS.shortName}</span>
                    </span>
                    {checked && (
                      <span className="absolute top-2.5 inset-e-2.5 flex size-6 items-center justify-center rounded-full bg-accent-gradient text-ink">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-0.5 p-3 md:p-4">
                    <span className="text-small font-bold md:text-body">{L.styles[st].name}</span>
                    <span className="hidden text-micro font-normal text-muted md:block">{L.styles[st].body}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </Group>

      <div className="flex flex-col divide-y divide-border rounded-lg bg-surface-1 px-5 ring-1 ring-border elev-1 md:px-6">
        {[
          {
            label: L.voice,
            body: (
              <>
                <Chip name="voice" value="male" checked={s.voice === "male"} onChange={() => set({ voice: "male" })}><Mic className="size-4" aria-hidden />{L.male}</Chip>
                <Chip name="voice" value="female" checked={s.voice === "female"} onChange={() => set({ voice: "female" })}><Mic className="size-4" aria-hidden />{L.female}</Chip>
                <Chip name="voice" value="none" checked={s.voice === "none"} onChange={() => set({ voice: "none" })}><MicOff className="size-4" aria-hidden />{L.voiceOff}</Chip>
              </>
            ),
          },
          {
            label: L.music,
            body: MOODS.map((m) => (
              <Chip key={m} name="mood" value={m} checked={s.mood === m} onChange={() => set({ mood: m })}>{L.moods[m]}</Chip>
            )),
          },
          {
            label: L.format,
            body: FORMATS.map((a) => (
              <Chip key={a} name="format" value={a} checked={s.aspect === a} onChange={() => set({ aspect: a })}>
                <AspectGlyph a={a} />
                <bdi dir="ltr" className="num">{a}</bdi>
                <span className="hidden font-normal opacity-70 sm:inline">{L.formats[a]}</span>
              </Chip>
            )),
          },
        ].map((row) => (
          <RowGroup key={row.label} label={row.label}>{row.body}</RowGroup>
        ))}
      </div>
    </div>
  );
}

function RowGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <div role="radiogroup" aria-labelledby={id} className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:gap-6">
      <h2 id={id} className="w-28 shrink-0 text-body font-bold">{label}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// ---------- screen 3: preview ----------

function PreviewScreen({ s, set, onGo, onGenerate }: { s: CreateState; set: (p: Partial<CreateState>) => void; onGo: (x: Screen) => void; onGenerate: () => void }) {
  const P = C.preview;
  const scenes = React.useMemo(() => draftScenes(s), [s]);
  const facts = openFacts(s);
  const cost = costOf(s);
  const ok = factsComplete(s) && finalHook(s).length > 1;
  const rows: { k: string; v: string; to: Screen }[] = [
    { k: P.rows.hook, v: finalHook(s) || rawHook(s), to: 0 },
    { k: P.rows.style, v: C.look.styles[s.style].name, to: 1 },
    { k: P.rows.voice, v: s.voice === "none" ? C.look.voiceOff : s.voice === "male" ? C.look.male : C.look.female, to: 1 },
    { k: P.rows.format, v: s.aspect, to: 1 },
  ];
  return (
    <div className="flex flex-col gap-8">
      <h1 id="create-title" tabIndex={-1} className="text-h1 outline-none">{P.title}</h1>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-14">
        <div className="order-2 flex flex-col gap-6 rounded-xl bg-surface-1 p-6 elev-3 ring-hairline md:p-8 lg:order-1">
          <dl className="flex flex-col divide-y divide-border">
            {rows.map((r) => (
              <div key={r.k} className="flex items-start gap-4 py-3 first:pt-0">
                <dt className="w-20 shrink-0 pt-0.5 text-small text-muted">{r.k}</dt>
                <dd dir="auto" className="min-w-0 flex-1 text-body font-semibold">{r.k === P.rows.format ? <bdi dir="ltr" className="num">{r.v}</bdi> : r.v}</dd>
                <button type="button" onClick={() => onGo(r.to)} className="shrink-0 rounded-full px-2 text-small font-semibold text-primary-text hover:underline">
                  {P.edit}
                  <span className="sr-only"> {r.k}</span>
                </button>
              </div>
            ))}
          </dl>

          {facts.map((f) => {
            const id = `fact-${f.id}`;
            const numeric = f.kind === "numeric_claim";
            return (
              <div key={f.id} className="flex flex-col gap-2 rounded-md bg-lemon/25 p-4 ring-1 ring-lemon">
                <label htmlFor={id} className="text-small font-bold">{numeric ? fillText(P.factNumber, { n: f.number ?? "" }) : f.labelHe}</label>
                <input
                  id={id}
                  dir="auto"
                  inputMode={f.unit === "₪" || f.kind === "numeric_claim" ? "decimal" : undefined}
                  value={s.facts[f.id] ?? (numeric ? f.number ?? "" : "")}
                  placeholder={P.factPh}
                  onChange={(e) => set({ facts: { ...s.facts, [f.id]: e.target.value } })}
                  className="h-11 w-full rounded-sm bg-surface-1 px-3.5 text-base font-semibold ring-1 ring-border-strong placeholder:font-normal placeholder:text-muted"
                />
              </div>
            );
          })}

          <div className="flex items-end justify-between gap-4 border-t border-border pt-5">
            <div className="flex flex-col">
              <span className="text-small text-muted">{P.cost}</span>
              <span className="text-h2 font-extrabold">
                <bdi className="num">{nf.format(cost)}</bdi> <span className="text-body-lg font-bold text-text-2">{SIMPLE_APP.nav.credits}</span>
              </span>
            </div>
            <span className="pb-1.5 text-small text-muted">{fillText(P.balance, { n: nf.format(MOCK_CREDITS.balance) })}</span>
          </div>
          <button type="button" onClick={onGenerate} disabled={!ok} className={cn(accentCta, "h-14 w-full text-lg disabled:pointer-events-none disabled:opacity-45")}>
            {P.generate}
            <DirIcon name="forward" className="size-5" />
          </button>
        </div>

        <div className="order-1 flex flex-col items-center gap-3 lg:order-2">
          <PhonePreview
            scenes={scenes}
            title={finalHook(s) || P.title}
            aspect={s.aspect}
            width={s.aspect === "9:16" ? 300 : 240}
            captionPreset={CAPTION_FOR[s.style]}
            aiLabel
            loop
            autoPlay
            glow
          />
          <p className="text-micro font-normal text-muted">{P.sampleNote}</p>
        </div>
      </div>
    </div>
  );
}

// ---------- the flow ----------

type Phase = { kind: "edit" } | { kind: "render"; stage: number; target: number; scenes: [number, number] } | { kind: "error" };

async function pool<T>(items: T[], size: number, fn: (item: T, i: number) => Promise<void>) {
  let next = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
}

export function CreateFlow() {
  const router = useRouter();
  const q = useSearchParams();
  const [init] = React.useState(() => initCreate(new URLSearchParams(q.toString())));
  const [s, setS] = React.useState<CreateState>(init.state);
  const [screen, setScreen] = React.useState<Screen>(init.screen);
  const [phase, setPhase] = React.useState<Phase>({ kind: "edit" });
  const alive = React.useRef(true);
  React.useEffect(() => () => { alive.current = false; }, []);

  const set = React.useCallback((p: Partial<CreateState>) => setS((d) => ({ ...d, ...p })), []);
  const hookOk = rawHook(s).length > 1;
  const canReach = (x: Screen) => x === 0 || hookOk;
  const go = (x: Screen) => {
    if (!canReach(x)) return;
    setScreen(x);
    window.scrollTo({ top: 0 });
  };
  React.useEffect(() => {
    document.getElementById("create-title")?.focus({ preventScroll: true });
  }, [screen]);

  const generate = async () => {
    const req = scriptRequest(s);
    const update = (p: Partial<Extract<Phase, { kind: "render" }>>) =>
      alive.current && setPhase((ph) => (ph.kind === "render" ? { ...ph, ...p } : ph));
    setPhase({ kind: "render", stage: 0, target: 22, scenes: [0, 0] });
    window.scrollTo({ top: 0 });
    try {
      const [res] = await Promise.all([
        fetch("/api/generate/script", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(req) }),
        wait(1500),
      ]);
      if (!res.ok) throw new Error(`script ${res.status}`);
      const script = (await res.json()) as ScriptResponse;
      const n = script.scenes.length;
      const images: (string | null)[] = new Array(n).fill(null);
      let done = 0;
      update({ stage: 1, target: 28, scenes: [0, n] });
      await Promise.all([
        pool(script.scenes, 3, async (sc, i) => {
          try {
            const r = await fetch("/api/generate/image", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: sc.visual_prompt_en, aspect: s.aspect }) });
            const j = (await r.json()) as ImageResponse;
            images[i] = j.image ? await compressImage(j.image) : null;
          } catch {
            images[i] = null;
          }
          done += 1;
          update({ scenes: [done, n], target: 28 + (47 * done) / n });
        }),
        wait(2200),
      ]);
      update({ stage: 2, target: 88 });
      await wait(1000);
      update({ stage: 3, target: 100 });
      await wait(1000);
      const id = `gen-${Date.now().toString(36)}`;
      const scenes: StoredScene[] = script.scenes.map((sc, i) => ({ ...sc, image: images[i] }));
      const hook = req.hookText;
      saveVideo({
        id,
        createdAt: new Date().toISOString(),
        title: hook.split(/\s+/).slice(0, 7).join(" "),
        hookText: hook,
        nicheSlug: s.nicheSlug,
        goal: s.goal,
        style: s.style,
        voice: s.voice,
        mood: s.mood,
        aspect: s.aspect,
        durationSec: s.durationSec,
        credits: costOf(s),
        source: script.source,
        scenes,
      });
      update({ stage: 4 });
      if (alive.current) router.push(`/app/projects/generated?id=${encodeURIComponent(id)}`);
    } catch {
      if (alive.current) setPhase({ kind: "error" });
    }
  };

  if (phase.kind !== "edit") {
    return (
      <RenderScreen
        stage={phase.kind === "render" ? phase.stage : -1}
        target={phase.kind === "render" ? phase.target : 0}
        scenes={phase.kind === "render" ? phase.scenes : [0, 0]}
        error={phase.kind === "error"}
        onRetry={generate}
        onBack={() => setPhase({ kind: "edit" })}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1040px] flex-col">
      <div className="flex items-center justify-between gap-4 pb-8 md:pb-12">
        <Link href="/app" className="inline-flex items-center gap-1.5 text-small font-semibold text-text-2 hover:text-text">
          <DirIcon name="back" className="size-4" />
          {C.exit}
        </Link>
        <Stepper screen={screen} canReach={canReach} onGo={go} />
      </div>

      {screen === 0 && <AboutScreen s={s} set={set} />}
      {screen === 1 && <LookScreen s={s} set={set} />}
      {screen === 2 && <PreviewScreen s={s} set={set} onGo={go} onGenerate={generate} />}

      {screen < 2 ? (
        <div className="sticky bottom-0 z-[var(--z-sticky)] -mx-4 mt-12 flex items-center justify-between gap-3 border-t border-border glass px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          {screen > 0 ? (
            <Button variant="ghost" size="lg" onClick={() => go((screen - 1) as Screen)}>
              <DirIcon name="back" />
              {C.back}
            </Button>
          ) : (
            <span />
          )}
          <button type="button" onClick={() => go((screen + 1) as Screen)} disabled={!hookOk} className={cn(accentCta, "h-12 px-8 text-base disabled:pointer-events-none disabled:opacity-45 max-md:flex-1")}>
            {C.next}
            <DirIcon name="forward" className="size-4" />
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <Button variant="ghost" size="lg" onClick={() => go(1)}>
            <DirIcon name="back" />
            {C.back}
          </Button>
        </div>
      )}
    </div>
  );
}
