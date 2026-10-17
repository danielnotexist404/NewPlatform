"use client";
import * as React from "react";
import { Check, Flame, Search, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch, Skeleton } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Plural, fillText, plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { PLATFORM_LABEL } from "@/lib/labels";
import { hooks as allHooks, hooksForNiche, getHookType, type Hook } from "@/lib/data/seed";
import { MOCK_AI_HOOKS, MOCK_PLAN, MOCK_TREND, personalizeHook } from "@/lib/mock/workspace";
import { LockedNote, Panel, StepHeading } from "../choice";
import { MissingFactsPanel, type PanelSlot } from "../missing-facts-panel";
import { costOf, hookSlots, useWizard, type SelectedHook } from "../wizard-state";
import { estimate } from "../estimate";
import { cn } from "@/lib/utils";

const H = APP_CORE.wizard.hook;
const MAX = MOCK_PLAN.hookVariantsMax;

interface CardHook { key: string; hookId: string | null; text: string; typeSlug: string | null; platforms?: Hook["platforms"]; visual?: string; ai?: { strength: number; why: string }; source: SelectedHook["source"] }

const fromSeed = (h: Hook): CardHook => ({
  key: `lib:${h.id}`, hookId: h.id, text: personalizeHook(h.text_he), typeSlug: h.hook_type_slug, platforms: h.platforms, visual: h.visual_direction_he, source: "library",
});

export function HookStep() {
  const { data, set } = useWizard();
  const [tab, setTab] = React.useState("forYou");
  const [own, setOwn] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [streamed, setStreamed] = React.useState(data.aiHooksGenerated);
  const [query, setQuery] = React.useState("");
  const [allNiches, setAllNiches] = React.useState(false);

  const forYou = React.useMemo(() => {
    const list = hooksForNiche(data.nicheSlug ?? "restaurants").filter((h) => !h.season_slug);
    const score = (h: Hook) => (h.goal === data.goal ? 2 : 0) + (h.is_featured ? 1 : 0);
    return [...list].sort((a, b) => score(b) - score(a)).slice(0, 6).map(fromSeed);
  }, [data.nicheSlug, data.goal]);
  const aiCards: CardHook[] = MOCK_AI_HOOKS.slice(0, streamed).map((h, i) => ({ key: `ai:${i}`, hookId: null, text: h.text, typeSlug: null, ai: { strength: h.strength, why: h.why }, source: "ai" }));
  const library = React.useMemo(() => {
    const base = allNiches ? allHooks : hooksForNiche(data.nicheSlug ?? "restaurants");
    const q = query.trim();
    return base.filter((h) => !q || h.text_he.includes(q)).slice(0, 24).map(fromSeed);
  }, [allNiches, data.nicheSlug, query]);

  const selectedKeys = data.hooks.map((h) => h.key);
  const atMax = data.abMode && data.hooks.length >= MAX;

  const toggle = (c: CardHook) => {
    const sel: SelectedHook = { key: c.key, hookId: c.hookId, text: c.text, source: c.source, typeSlug: c.typeSlug };
    set((d) => {
      const has = d.hooks.some((h) => h.key === c.key);
      if (!d.abMode) return { hooks: has ? [] : [sel] };
      if (has) return { hooks: d.hooks.filter((h) => h.key !== c.key) };
      if (d.hooks.length >= MAX) return {};
      return { hooks: [...d.hooks, sel] };
    });
  };

  const generate = () => {
    setGenerating(true);
    setTab("forYou");
    const start = streamed;
    let n = start;
    const id = window.setInterval(() => {
      n += 1;
      setStreamed(Math.min(MOCK_AI_HOOKS.length, n));
      if (n >= Math.min(MOCK_AI_HOOKS.length, start + 6)) {
        window.clearInterval(id);
        setGenerating(false);
        set({ aiHooksGenerated: Math.min(MOCK_AI_HOOKS.length, n) });
      }
    }, 450);
  };

  const ownWords = own.trim() ? own.trim().split(/\s+/).length : 0;
  const ownError = ownWords > 20 ? H.ownHard : null;
  const ownWarn = ownWords > 12 && ownWords <= 20 ? H.ownSoft : null;

  // facts gate for every selected hook
  const factItems: PanelSlot[] = hookSlots(data).flatMap(({ hook, slots }) => slots.map((slot) => ({ key: `${hook.key}|${slot.id}`, slot, context: hook.text })));
  const hookKeyOf = (it: PanelSlot) => it.key.split("|")[0];

  const extra = data.abMode && data.hooks.length > 1
    ? costOf(data).credits - estimate({ durationSec: data.durationSec, quality: data.quality, visualMix: data.visualMix, formats: 1 + data.extraAspects.length, noVoice: data.voiceId === "none", musicMode: data.musicMode }).credits
    : 0;

  return (
    <>
      <StepHeading title={H.title} subtitle={H.subtitle} />

      {data.trendSlug && (
        <p className="flex items-start gap-2 rounded-md bg-lemon/[.08] p-3 text-small shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_40%,transparent)]">
          <Flame className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
          {fillText(H.trendBanner, { name: MOCK_TREND.nameHe })}
        </p>
      )}

      <Panel className="flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4">
          <span className="font-semibold">{H.abToggle}</span>
          <Switch
            checked={data.abMode}
            disabled={MAX <= 1}
            onCheckedChange={(on) => set((d) => ({ abMode: on, hooks: on ? d.hooks : d.hooks.slice(0, 1) }))}
          />
        </label>
        {MAX <= 1 && <LockedNote text="בתוכנית הנוכחית יש גרסת הוק אחת לכל סרטון. בתוכנית בסיס — עד 3." />}
        {atMax && <p className="text-micro font-normal text-text-2" role="status">{plural(MAX, APP_CORE.counts.maxHooks)}</p>}
      </Panel>

      {factItems.length > 0 && (
        <MissingFactsPanel
          items={factItems}
          answers={data.factAnswers}
          onConfirm={(it) => set((d) => ({ factAnswers: { ...d.factAnswers, [it.key]: { action: "confirmed" } } }))}
          onReplace={(it, value) =>
            set((d) => {
              const hk = hookKeyOf(it);
              const hooks = d.hooks.map((h) => (h.key === hk && it.slot.number ? { ...h, text: h.text.replace(it.slot.number, value) } : h));
              return {
                hooks,
                factAnswers: { ...d.factAnswers, [it.key]: { action: "replaced", value }, [`${hk}|hook:hook:${value}`]: { action: "confirmed" } },
              };
            })
          }
          removeActions={(it) => [
            { label: APP_CORE.wizard.facts.removeHook, onClick: () => set((d) => ({ hooks: d.hooks.filter((h) => h.key !== hookKeyOf(it)) })) },
            {
              label: "עריכה ידנית של ההוק",
              onClick: () => {
                setOwn(it.context);
                setTab("own");
                set((d) => ({ hooks: d.hooks.filter((h) => h.key !== hookKeyOf(it)) }));
              },
            },
          ]}
        />
      )}

      <Tabs value={tab} onValueChange={setTab} dir="rtl" className="flex flex-col gap-5">
        <TabsList className="max-w-full self-start overflow-x-auto [scrollbar-width:none]">
          <TabsTrigger value="forYou" className="whitespace-nowrap">{H.tabs.forYou}</TabsTrigger>
          <TabsTrigger value="library" className="whitespace-nowrap">{H.tabs.library}</TabsTrigger>
          <TabsTrigger value="own" className="whitespace-nowrap">{H.tabs.own}</TabsTrigger>
        </TabsList>

        <TabsContent value="forYou" className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {forYou.map((c) => (
              <HookPickCard key={c.key} c={c} selectedIndex={selectedKeys.indexOf(c.key)} disabled={atMax && !selectedKeys.includes(c.key)} onToggle={() => toggle(c)} onMakePrimary={() => makePrimary(c.key)} />
            ))}
          </div>
          <Panel tone="ai" className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-bold"><Sparkles className="size-5 text-violet" aria-hidden />{H.generateTitle}</p>
              <Button variant="secondary" onClick={generate} loading={generating} disabled={streamed >= MOCK_AI_HOOKS.length}>
                {generating ? H.generating : streamed > 0 ? H.generateMore : H.generate}
                {!generating && <span className="font-normal opacity-80">· {plural(1, APP_CORE.counts.credits)}</span>}
              </Button>
            </div>
            {(aiCards.length > 0 || generating) && (
              <div className="grid gap-3 sm:grid-cols-2" aria-busy={generating}>
                {aiCards.map((c) => (
                  <HookPickCard key={c.key} c={c} selectedIndex={selectedKeys.indexOf(c.key)} disabled={atMax && !selectedKeys.includes(c.key)} onToggle={() => toggle(c)} onMakePrimary={() => makePrimary(c.key)} />
                ))}
                {generating && Array.from({ length: Math.max(0, 6 - aiCards.length) }, (_, i) => <Skeleton key={i} className="h-36 rounded-md shimmer-ai" />)}
              </div>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="library" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={H.searchPlaceholder} aria-label={H.searchPlaceholder} className="ps-10" />
            </div>
            <Button variant={allNiches ? "primary" : "secondary"} size="sm" aria-pressed={allNiches} onClick={() => setAllNiches((a) => !a)}>{H.allNiches}</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {library.map((c) => (
              <HookPickCard key={c.key} c={c} selectedIndex={selectedKeys.indexOf(c.key)} disabled={atMax && !selectedKeys.includes(c.key)} onToggle={() => toggle(c)} onMakePrimary={() => makePrimary(c.key)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="own" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="own-hook" className="text-sm font-semibold">{H.ownLabel}</label>
            <Textarea id="own-hook" value={own} onChange={(e) => setOwn(e.target.value)} aria-invalid={!!ownError} aria-describedby="own-count" className="min-h-24 text-body-lg font-semibold" />
            <p id="own-count" className="flex justify-between text-micro font-normal text-muted">
              <Plural n={ownWords} forms={APP_CORE.counts.words} />
              {ownError ? <span className="text-danger">{ownError}</span> : ownWarn ? <span className="text-primary-text">{ownWarn}</span> : null}
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 text-small text-text-2">
            {H.ownTips.map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />{t}</li>)}
          </ul>
          <Button
            className="self-start"
            disabled={!!ownError}
            onClick={() => {
              if (!own.trim()) { toast.error(H.ownEmpty); return; }
              const c: CardHook = { key: `own:${Date.now()}`, hookId: null, text: own.trim(), typeSlug: null, source: "own" };
              set((d) => ({ hooks: d.abMode ? [...d.hooks, { ...c }].slice(0, MAX) : [{ ...c }] }));
              setTab("forYou");
            }}
          >
            {H.ownUse}
          </Button>
        </TabsContent>
      </Tabs>

      {data.abMode && data.hooks.length > 1 && (
        <p className="sticky bottom-20 z-10 self-start rounded-full bg-surface-3 px-4 py-2 text-small font-semibold elev-2" role="status">
          <Plural n={data.hooks.length} forms={APP_CORE.counts.hooksVersions} /> · <Plural n={Math.max(1, extra)} forms={APP_CORE.counts.creditsMore} />
        </p>
      )}
    </>
  );

  function makePrimary(key: string) {
    set((d) => {
      const h = d.hooks.find((x) => x.key === key);
      return h ? { hooks: [h, ...d.hooks.filter((x) => x.key !== key)] } : {};
    });
  }
}

function HookPickCard({ c, selectedIndex, disabled, onToggle, onMakePrimary }: { c: CardHook; selectedIndex: number; disabled: boolean; onToggle: () => void; onMakePrimary: () => void }) {
  const selected = selectedIndex >= 0;
  const typeName = c.typeSlug ? getHookType(c.typeSlug)?.name_he : null;
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-border)] transition-[box-shadow,background-color]",
        selected && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]",
        disabled && "opacity-55",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && onToggle()}
        className="absolute inset-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label={c.text}
      />
      <div className="pointer-events-none flex flex-wrap items-center gap-1.5">
        {c.ai ? (
          <span className="rounded-xs bg-violet/15 px-2 py-0.5 text-micro text-violet">{H.aiTag}</span>
        ) : typeName ? (
          <span className="rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{typeName}</span>
        ) : null}
        {c.platforms?.slice(0, 2).map((p) => <span key={p} className="rounded-xs bg-surface-3 px-1.5 py-0.5 text-micro text-text-2">{PLATFORM_LABEL[p]}</span>)}
        {selectedIndex === 0 && <span className="ms-auto rounded-xs bg-primary px-2 py-0.5 text-micro text-on-primary">{H.primary}</span>}
        {selected && selectedIndex > 0 && <span className="ms-auto rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text">גרסה {["א׳", "ב׳", "ג׳", "ד׳", "ה׳"][selectedIndex]}</span>}
      </div>
      <blockquote dir="rtl" className="pointer-events-none text-[1.15rem] font-bold leading-snug">{c.text}</blockquote>
      {c.visual && <p className="pointer-events-none text-micro font-normal text-text-2">{c.visual}</p>}
      {c.ai && (
        <div className="pointer-events-none flex flex-col gap-1 text-micro font-normal text-text-2">
          <span className="flex items-center gap-1" aria-label={fillText(H.strength, { n: c.ai.strength })}>
            {Array.from({ length: 5 }, (_, i) => <Star key={i} aria-hidden className={cn("size-3.5", i < c.ai!.strength ? "fill-primary text-primary-text" : "text-border-strong")} />)}
            <span className="ms-1">{fillText(H.strength, { n: c.ai.strength })}</span>
          </span>
          <span><span className="font-semibold text-text">{H.why} </span>{c.ai.why}</span>
        </div>
      )}
      {selected && selectedIndex > 0 && (
        <Button size="sm" variant="ghost" className="relative z-10 self-start" onClick={onMakePrimary}>{H.makePrimary}</Button>
      )}
    </div>
  );
}
