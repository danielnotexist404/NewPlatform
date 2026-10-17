"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Search, SlidersHorizontal, WandSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ALL_HOOKS, byPopular, type HookView } from "@/components/hooks/hook-data";
import { normalize, type Values } from "@/components/hooks/text";
import { PageHeader, Panel, EmptyState, Note } from "@/components/settings/kit";
import { NativeSelect } from "@/components/settings/controls";
import { AppHookCard, WrittenHookCard } from "./app-hook-card";
import { HookVariationsDialog, type VariationsMode } from "./hook-variations-dialog";
import { hooksCopy as h, accountCommon } from "@/content/he/account";
import { hookTypes, niches, seasons, getSeason } from "@/lib/data/seed";
import { GENDER_LABEL, GOAL_LABEL, PLATFORM_LABEL, type HookGender, type HookGoal, type Platform } from "@/lib/labels";
import { MOCK_BUSINESS_PROFILE, MOCK_FAVORITE_HOOK_IDS, MOCK_PROFILE, MOCK_WORKSPACE_HOOKS, type WorkspaceHook } from "@/lib/mock/account";
import { fill, formatDateHe, plural } from "@/components/settings/format";

const P = h.personalizer;
const F = h.filters;
type Facets = { niche: string; type: string; platform: string; goal: string; gender: string; season: string; q: string };
const PAGE = 24;
const PLATFORMS = (["reels", "tiktok", "shorts", "facebook", "youtube", "whatsapp"] as Platform[]);
const SEASONS = seasons.filter((s) => !s.is_quiet_day && !s.slug.includes("elections"));

export function HooksLibrary() {
  const params = useSearchParams();
  const [tab, setTab] = React.useState<"all" | "favorites" | "written">("all");
  const [f, setF] = React.useState<Facets>(() => ({
    niche: params.get("niche") ?? MOCK_BUSINESS_PROFILE.nicheSlug,
    type: params.get("type") ?? "",
    platform: params.get("platform") ?? "",
    goal: params.get("goal") ?? "",
    gender: params.get("gender") ?? "",
    season: params.get("season") ?? "",
    q: params.get("q") && params.get("generate") !== "1" ? params.get("q")! : "",
  }));
  const [values, setValues] = React.useState<Values>({ שם_העסק: MOCK_BUSINESS_PROFILE.name, עיר: MOCK_BUSINESS_PROFILE.city, שירות: MOCK_BUSINESS_PROFILE.services[0]?.name ?? "" });
  const [moreFields, setMoreFields] = React.useState(false);
  const [favorites, setFavorites] = React.useState<string[]>(MOCK_FAVORITE_HOOK_IDS);
  const [written, setWritten] = React.useState<WorkspaceHook[]>(MOCK_WORKSPACE_HOOKS);
  const [limit, setLimit] = React.useState(PAGE);
  const [mode, setMode] = React.useState<VariationsMode | null>(() => {
    const src = params.get("source");
    if (src && params.get("variations") === "1") {
      const hk = ALL_HOOKS.find((x) => x.id === src);
      if (hk) return { kind: "existing", sourceId: hk.id, sourceText: hk.text };
    }
    if (params.get("generate") === "1") return { kind: "new", niche: params.get("niche") ?? undefined, topic: params.get("q") ?? undefined };
    return null;
  });

  const set = (k: keyof Facets, v: string) => { setF((x) => ({ ...x, [k]: v })); setLimit(PAGE); };
  const q = normalize(f.q);
  const list = ALL_HOOKS.filter((x) =>
    (!f.niche || x.nicheSlug === f.niche || (x.nicheSlug === null && (!!f.season || !!f.type))) &&
    (!f.type || x.typeSlug === f.type) &&
    (!f.platform || x.platforms.includes(f.platform as Platform)) &&
    (!f.goal || x.goal === f.goal) &&
    (!f.gender || x.gender === f.gender) &&
    (!f.season || x.seasonSlug === f.season) &&
    (q.length < 2 || normalize(x.text).includes(q) || normalize(x.typeName).includes(q)),
  ).sort(byPopular);
  const favList = ALL_HOOKS.filter((x) => favorites.includes(x.id));
  const season = f.season ? getSeason(f.season) : undefined;
  const activeCount = (["type", "platform", "goal", "gender", "season"] as const).filter((k) => f[k]).length + (f.niche !== MOCK_BUSINESS_PROFILE.nicheSlug ? 1 : 0);

  const toggleFavorite = (hook: HookView, on: boolean) => {
    setFavorites((l) => (on ? [...l, hook.id] : l.filter((x) => x !== hook.id)));
    toast.success(on ? h.card.favorite : h.card.unfavorite);
  };

  const filterControls = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Select label={F.niche} value={f.niche} onChange={(v) => set("niche", v)} options={[{ v: "", l: F.allNiches }, ...niches.filter((n) => n.slug !== "local-politics").map((n) => ({ v: n.slug, l: n.name_he }))]} />
      <Select label={F.type} value={f.type} onChange={(v) => set("type", v)} options={[{ v: "", l: F.any }, ...hookTypes.map((t) => ({ v: t.slug, l: t.name_he }))]} />
      <Select label={F.platform} value={f.platform} onChange={(v) => set("platform", v)} options={[{ v: "", l: F.any }, ...PLATFORMS.map((p) => ({ v: p, l: PLATFORM_LABEL[p] }))]} />
      <Select label={F.goal} value={f.goal} onChange={(v) => set("goal", v)} options={[{ v: "", l: F.any }, ...(Object.keys(GOAL_LABEL) as HookGoal[]).map((g) => ({ v: g, l: GOAL_LABEL[g] }))]} />
      <Select label={F.gender} value={f.gender} onChange={(v) => set("gender", v)} options={[{ v: "", l: F.any }, ...(Object.keys(GENDER_LABEL) as HookGender[]).map((g) => ({ v: g, l: GENDER_LABEL[g] }))]} />
      <Select label={F.season} value={f.season} onChange={(v) => set("season", v)} options={[{ v: "", l: F.any }, ...SEASONS.map((s) => ({ v: s.slug, l: s.name_he }))]} />
    </div>
  );

  return (
    <>
      <PageHeader
        title={h.title}
        description={h.subtitle[MOCK_PROFILE.genderForm]}
        actions={
          <Button size="lg" variant="secondary" className="glow-ai" onClick={() => setMode({ kind: "new", niche: f.niche })}>
            <WandSparkles className="text-violet" aria-hidden />{h.writeNew}
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* HookPersonalizer — prefilled from the business profile */}
        <Panel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-body-lg font-bold">{P.title}</h2>
            <p className="text-small text-text-2">{P.note}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(["שם_העסק", "עיר", "שירות"] as const).map((k) => (
              <label key={k} className="flex flex-col gap-1.5 text-sm font-semibold">
                {P.fields[k]}
                <Input value={values[k] ?? ""} placeholder={P.placeholders[k]} onChange={(e) => setValues((x) => ({ ...x, [k]: e.target.value }))} />
              </label>
            ))}
          </div>
          {moreFields && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(P.moreFields) as (keyof typeof P.moreFields)[]).map((k) => (
                <label key={k} className="flex flex-col gap-1.5 text-sm font-semibold">
                  {P.moreFields[k]}
                  <Input value={values[k] ?? ""} onChange={(e) => setValues((x) => ({ ...x, [k]: e.target.value }))} />
                </label>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" aria-expanded={moreFields} onClick={() => setMoreFields((x) => !x)}>{moreFields ? P.less : P.more}</Button>
            <Button size="sm" variant="ghost" onClick={() => setValues({})}><X aria-hidden />{P.clear}</Button>
          </div>
        </Panel>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="flex flex-col gap-6">
          <TabsList aria-label={h.tabsLabel} className="w-fit max-w-full overflow-x-auto">
            <TabsTrigger value="all">{h.tabs.all}</TabsTrigger>
            <TabsTrigger value="favorites">{h.tabs.favorites} <bdi className="num text-micro text-muted">{favorites.length}</bdi></TabsTrigger>
            <TabsTrigger value="written">{h.tabs.written} <bdi className="num text-micro text-muted">{written.length}</bdi></TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                  <Input type="search" aria-label={F.search} placeholder={F.searchPlaceholder} value={f.q} onChange={(e) => set("q", e.target.value)} className="ps-9" />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="lg" className="h-11 lg:hidden"><SlidersHorizontal aria-hidden />{F.open}{activeCount > 0 && <bdi className="num">({activeCount})</bdi>}</Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" title={F.title} closeLabel={accountCommon.close}>
                    <div className="flex flex-col gap-5">
                      {filterControls}
                      <SheetClose asChild><Button size="lg">{plural(list.length, F.show)}</Button></SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden lg:block">{filterControls}</div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-small text-muted" aria-live="polite">{plural(list.length, h.count)}</p>
                {activeCount > 0 && (
                  <Button size="sm" variant="ghost" onClick={() => { setF({ niche: MOCK_BUSINESS_PROFILE.nicheSlug, type: "", platform: "", goal: "", gender: "", season: "", q: "" }); setLimit(PAGE); }}>{accountCommon.clearFilters}</Button>
                )}
              </div>
            </div>
            {season && season.publish_window_he !== "—" && (
              <Note icon={<CalendarDays aria-hidden />}>{fill(h.season, { seasonName: season.name_he, dateHint: season.date_hint_he, publishWindow: season.publish_window_he })}</Note>
            )}
            {list.length === 0 ? (
              <Panel><EmptyState illustration="search" title={accountCommon.emptySearch} action={<Button variant="secondary" onClick={() => setF({ niche: "", type: "", platform: "", goal: "", gender: "", season: "", q: "" })}>{accountCommon.clearFilters}</Button>} /></Panel>
            ) : (
              <>
                <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {list.slice(0, limit).map((hk) => (
                    <li key={hk.id}>
                      <AppHookCard
                        hook={hk}
                        values={values}
                        favorite={favorites.includes(hk.id)}
                        onFavorite={(on) => toggleFavorite(hk, on)}
                        onVariations={() => setMode({ kind: "existing", sourceId: hk.id, sourceText: hk.text })}
                        showNiche={!f.niche}
                      />
                    </li>
                  ))}
                </ul>
                {list.length > limit && (
                  <Button variant="secondary" className="self-center" onClick={() => setLimit((x) => x + PAGE)}>{h.loadMore}</Button>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favList.length === 0 ? (
              <Panel><EmptyState illustration="hooks-favorites" title={h.favoritesEmptyTitle} description={h.favoritesEmpty} /></Panel>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {favList.map((hk) => (
                  <li key={hk.id}>
                    <AppHookCard hook={hk} values={values} favorite onFavorite={(on) => toggleFavorite(hk, on)} onVariations={() => setMode({ kind: "existing", sourceId: hk.id, sourceText: hk.text })} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="written">
            {written.length === 0 ? (
              <Panel><EmptyState illustration="hooks" title={h.written.empty} /></Panel>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {written.map((w) => {
                  const src = w.sourceHookId ? ALL_HOOKS.find((x) => x.id === w.sourceHookId) : null;
                  return (
                    <li key={w.id}>
                      <WrittenHookCard
                        id={w.id}
                        text={w.textHe}
                        strength={w.strength}
                        why={w.whyHe}
                        values={values}
                        meta={
                          <span className="flex flex-col gap-0.5">
                            {src && <span>{fill(h.card.source, { text: src.text })}</span>}
                            <span>{w.projectTitle ? `${fill(h.card.project, { title: w.projectTitle })} · ` : ""}{formatDateHe(w.createdAt)}</span>
                          </span>
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <HookVariationsDialog
        mode={mode}
        values={values}
        onClose={() => setMode(null)}
        onSaved={(list) => setWritten((l) => [...list, ...l])}
      />
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">
      {label}
      <NativeSelect value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </NativeSelect>
    </label>
  );
}
