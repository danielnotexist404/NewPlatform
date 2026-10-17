"use client";
import * as React from "react";
import Link from "next/link";
import {
  Check, CircleAlert, Clapperboard, Copy, ExternalLink, EyeOff, Lock, Palette, Phone, Plus, RefreshCw, Store, Trash2, Wand, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { BusinessPage } from "./business-page";
import { LandingStatusBadge } from "./status-badge";
import { PlanDemoToggle, useDemoPlan } from "./plan-demo";
import { TrendTile } from "@/components/trends/trend-tile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { Progress, Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { DirIcon } from "@/components/a11y/dir-icon";
import { LP_COST, LP_EDITOR, LP_GATE, LP_ID_TYPE, LP_NEW } from "@/content/he/landing-pages";
import { BRAND } from "@/lib/constants";
import { PLANS } from "@/lib/data/plans";
import {
  draftForNewPage, GAHELET_REGENERATIONS, getWorkspacePage, LANDING_GENERATE_CREDITS, LANDING_LIMITS, NEW_PAGE_ID, slugError, wazeHref,
  WORKSPACE_PAGES, type BusinessIdType, type LandingPage, type LandingPageContent, type LandingStatus,
} from "@/lib/mock/landing-pages";
import { cn } from "@/lib/utils";

const E = LP_EDITOR;
const FL = E.fields;
const uid = () => Math.random().toString(36).slice(2, 9);
const starterName = `תוכנית ${PLANS.find((p) => p.id === "starter")!.nameHe}`;
const costLabel = (verb: string) => `${verb} · ${LP_COST.credits(LANDING_GENERATE_CREDITS)}`;

export function LandingEditor({ pageId }: { pageId: string }) {
  const [plan] = useDemoPlan();
  const free = plan === "free";
  const isNew = pageId === NEW_PAGE_ID;
  const initial = React.useMemo<LandingPage>(() => (isNew ? draftForNewPage() : getWorkspacePage(pageId) ?? draftForNewPage()), [isNew, pageId]);

  const [phase, setPhase] = React.useState<"intro" | "generating" | "editing">(isNew ? "intro" : "editing");
  const [content, setContent] = React.useState<LandingPageContent>(initial.content);
  const [slug, setSlug] = React.useState(initial.slug);
  const [status, setStatus] = React.useState<LandingStatus>(initial.status);
  const [regenIdx, setRegenIdx] = React.useState(isNew ? 1 : 0);
  const [regenerating, setRegenerating] = React.useState(false);
  const [view, setView] = React.useState<"edit" | "preview">("edit");
  const [dialog, setDialog] = React.useState<null | "publish" | "unpublish" | "regenerate">(null);

  const patch = React.useCallback((p: Partial<LandingPageContent>) => setContent((c) => ({ ...c, ...p })), []);
  const slugErr = slugError(slug, initial.id);
  const url = `${BRAND.domain}/b/${slug}`;

  // Starter plan already uses its one page (§S.7 limit): /new explains instead of generating.
  if (isNew && !free && WORKSPACE_PAGES.length >= 1 && phase === "intro") {
    return <LimitCard />;
  }

  if (phase !== "editing") {
    return (
      <GenerateIntro
        free={free}
        generating={phase === "generating"}
        onGenerate={() => setPhase("generating")}
        onDone={() => { setPhase("editing"); toast.success(E.generatedToast); }}
      />
    );
  }

  const missing = [
    slugErr ? E.publishDialog.missing.slug : null,
    !content.h1.trim() ? E.publishDialog.missing.h1 : null,
    !content.whatsapp.trim() && !content.phone.trim() ? E.publishDialog.missing.contact : null,
    !content.legal.legalName.trim() ? E.publishDialog.missing.legal : null,
  ].filter(Boolean) as string[];

  function regenerate() {
    setDialog(null);
    setRegenerating(true);
    setTimeout(() => {
      const next = GAHELET_REGENERATIONS[regenIdx % GAHELET_REGENERATIONS.length];
      patch({ h1: next.h1, subline: next.subline, benefits: [...next.benefits] as LandingPageContent["benefits"] });
      setRegenIdx((i) => i + 1);
      setRegenerating(false);
      toast.success(E.regenerateDialog.toast);
    }, 2200);
  }

  return (
    <div className="flex flex-col gap-6">
      <PlanDemoToggle />

      {/* top bar */}
      <div className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <LandingStatusBadge status={free ? "draft" : status} />
              <span className="text-micro text-muted">{E.autosave}</span>
            </div>
            <p className="truncate text-h3">{initial.business.nameHe}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!free && status === "published" && (
              <Link href={`/b/${initial.slug}`} target="_blank" className={buttonVariants({ variant: "ghost" })}>
                <ExternalLink aria-hidden />{E.view}
              </Link>
            )}
            <Button variant="secondary" onClick={() => setDialog("regenerate")} disabled={regenerating}>
              <RefreshCw aria-hidden className={cn(regenerating && "animate-spin")} />
              {costLabel(free ? LP_COST.preview : LP_COST.regenerate)}
            </Button>
            {free ? (
              <Button disabled aria-describedby="lp-gate-title"><Lock aria-hidden />{LP_GATE.locked}</Button>
            ) : status === "published" ? (
              <Button variant="outline" onClick={() => setDialog("unpublish")}><EyeOff aria-hidden />{E.unpublish}</Button>
            ) : (
              <Button onClick={() => setDialog("publish")}><Check aria-hidden />{status === "unpublished" ? E.republish : E.publish}</Button>
            )}
          </div>
        </div>
        <SlugField slug={slug} onChange={setSlug} error={slugErr} disabled={status === "published" && !free} />
      </div>

      {free && <GateCard />}

      {/* mobile view switch */}
      <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "edit" | "preview")} aria-label={E.preview.label} className="self-start lg:hidden">
        <ToggleGroupItem value="edit">{E.viewToggle.edit}</ToggleGroupItem>
        <ToggleGroupItem value="preview">{E.viewToggle.preview}</ToggleGroupItem>
      </ToggleGroup>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <div className={cn("min-w-0", view === "preview" && "hidden lg:block")}>
          <EditorForm content={content} patch={patch} page={initial} slug={WORKSPACE_PAGES[0].slug} />
        </div>
        <div className={cn(view === "edit" && "hidden lg:block")}>
          <div className="flex flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+16px)]">
            <div className="flex items-center justify-between gap-2 text-small text-text-2">
              <span className="font-semibold text-text">{E.preview.label}</span>
              {!free && status === "published" && (
                <Link href={`/b/${initial.slug}`} target="_blank" className="inline-flex items-center gap-1 text-link hover:underline">
                  {E.preview.open}<ExternalLink aria-hidden className="size-3.5" />
                </Link>
              )}
            </div>
            <PhoneFrame regenerating={regenerating}>
              <BusinessPage
                business={initial.business}
                content={content}
                heroVideos={initial.heroVideos}
                slug={WORKSPACE_PAGES[0].slug}
                mode="preview"
                showBranding={free}
                watermark={free}
                isSample={false}
                idPrefix="editor-preview"
              />
            </PhoneFrame>
            <p className="flex items-start gap-1.5 text-micro font-normal text-muted">
              <Zap aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary-text" />
              {LP_COST.note}
            </p>
          </div>
        </div>
      </div>

      {/* dialogs */}
      <Dialog open={dialog === "publish"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogTitle>{E.publishDialog.title}</DialogTitle>
          <DialogDescription>
            {E.publishDialog.body}
            <bdi dir="ltr" className="mt-1 block font-mono text-small text-text">{url}</bdi>
          </DialogDescription>
          {missing.length > 0 ? (
            <div role="alert" className="mt-4 rounded-sm bg-danger/10 p-3 text-small">
              <p className="font-semibold text-danger">{E.publishDialog.missingTitle}</p>
              <ul className="mt-1 list-disc ps-5">{missing.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-2 text-small">
              {E.publishDialog.checks.map((c) => (
                <li key={c} className="flex items-center gap-2"><Check aria-hidden className="size-4 text-success" />{c}</li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <DialogClose asChild><Button variant="ghost">{E.publishDialog.cancel}</Button></DialogClose>
            <Button disabled={missing.length > 0} onClick={() => { setStatus("published"); setDialog(null); toast.success(E.publishDialog.toast); }}>
              <Check aria-hidden />{E.publishDialog.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "unpublish"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogTitle>{E.unpublishDialog.title}</DialogTitle>
          <DialogDescription>{E.unpublishDialog.body}</DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <DialogClose asChild><Button variant="ghost">{E.unpublishDialog.cancel}</Button></DialogClose>
            <Button variant="destructive" onClick={() => { setStatus("unpublished"); setDialog(null); toast(E.unpublishDialog.toast); }}>
              <EyeOff aria-hidden />{E.unpublishDialog.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "regenerate"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogTitle>{E.regenerateDialog.title}</DialogTitle>
          <DialogDescription>{E.regenerateDialog.body}</DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <DialogClose asChild><Button variant="ghost">{E.regenerateDialog.cancel}</Button></DialogClose>
            <Button onClick={regenerate}><Wand aria-hidden />{costLabel(LP_COST.regenerate)}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- pieces ----------

function PhoneFrame({ children, regenerating }: { children: React.ReactNode; regenerating: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[400px] rounded-[44px] bg-surface-3 p-2.5 elev-3 shadow-[inset_0_0_0_1px_var(--color-border)]">
      <div className="relative overflow-hidden rounded-[36px]">
        <div className="h-[min(780px,calc(100dvh-220px))] min-h-[560px] overflow-x-hidden overflow-y-auto bg-bg [scrollbar-width:thin]">
          {children}
        </div>
        {regenerating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-overlay" role="status">
            <div className="flex w-[80%] flex-col gap-3 rounded-md bg-surface-1 p-4 text-center elev-3">
              <p className="font-semibold text-violet">{E.generatingLabel}</p>
              <Progress value={60} variant="ai" aria-label={E.generatingLabel} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SlugField({ slug, onChange, error, disabled }: { slug: string; onChange: (s: string) => void; error: ReturnType<typeof slugError>; disabled?: boolean }) {
  const id = "lp-slug";
  async function copy() {
    try { await navigator.clipboard.writeText(`https://${BRAND.domain}/b/${slug}`); toast.success("הכתובת הועתקה"); } catch { /* ignore */ }
  }
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{E.slug.label}</Label>
      <div className="flex items-stretch gap-2">
        <div dir="ltr" className={cn("flex min-w-0 flex-1 items-center overflow-hidden rounded-sm border bg-surface-2 focus-within:outline-2 focus-within:outline-focus", error ? "border-danger" : "border-border-strong")}>
          <span className="shrink-0 ps-3.5 pe-0.5 font-mono text-small text-muted">{BRAND.domain}/b/</span>
          <input
            id={id}
            value={slug}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            disabled={disabled}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            maxLength={LANDING_LIMITS.slugMax}
            aria-invalid={!!error || undefined}
            aria-describedby={`${id}-help`}
            className="h-11 min-w-0 flex-1 bg-transparent pe-3.5 font-mono text-small text-text outline-none disabled:opacity-60"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={copy} aria-label="העתקת הכתובת"><Copy aria-hidden /></Button>
      </div>
      <p id={`${id}-help`} className={cn("text-small", error ? "text-danger" : "text-muted")} role={error ? "alert" : undefined}>
        {error ? E.slug.errors[error] : disabled ? E.slug.locked : <><Check aria-hidden className="me-1 inline size-3.5 text-success" />{E.slug.available} · {E.slug.help}</>}
      </p>
    </div>
  );
}

function GateCard() {
  return (
    <section aria-labelledby="lp-gate-title" className="flex flex-col gap-4 rounded-lg bg-primary/10 p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] md:flex-row md:items-center md:justify-between">
      <div className="flex gap-3">
        <Lock aria-hidden className="mt-1 size-5 shrink-0 text-primary-text" />
        <div>
          <h2 id="lp-gate-title" className="text-body-lg font-bold">{LP_GATE.title}</h2>
          <p className="mt-1 text-small text-text-2">{LP_GATE.body}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link href="/app/billing/plans" className={buttonVariants({})}>{LP_GATE.plansCta}</Link>
        <Link href="/app/billing" className={buttonVariants({ variant: "secondary" })}>{LP_GATE.packCta}</Link>
      </div>
    </section>
  );
}

function LimitCard() {
  return (
    <div className="flex flex-col gap-6">
      <PlanDemoToggle />
      <section className="flex flex-col items-start gap-4 rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-text-2"><Lock aria-hidden className="size-6" /></span>
        <h2 className="text-h2">{LP_NEW.limitTitle}</h2>
        <p className="max-w-2xl text-body-lg text-text-2">{LP_NEW.limitBody(starterName)}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/app/landing-pages/${WORKSPACE_PAGES[0].id}`} className={buttonVariants({ size: "lg" })}>{LP_NEW.toExisting}<DirIcon name="forward" /></Link>
          <Link href="/app/billing/plans" className={buttonVariants({ variant: "secondary", size: "lg" })}>שדרוג לתוכנית עסק</Link>
        </div>
      </section>
    </div>
  );
}

const SOURCE_ICON = { brand: Palette, niche: Store, video: Clapperboard, facts: Phone } as const;

function GenerateIntro({ free, generating, onGenerate, onDone }: { free: boolean; generating: boolean; onGenerate: () => void; onDone: () => void }) {
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    if (!generating) return;
    let n = 0;
    let done: ReturnType<typeof setTimeout> | undefined;
    const t = setInterval(() => {
      n += 1;
      setStage(n);
      if (n >= E.generating.length) {
        clearInterval(t);
        done = setTimeout(onDone, 500);
      }
    }, 800);
    return () => { clearInterval(t); if (done) clearTimeout(done); };
  }, [generating, onDone]);

  return (
    <div className="flex flex-col gap-6">
      <PlanDemoToggle />
      {free && <GateCard />}
      <section aria-labelledby="lp-new-title" className="relative overflow-hidden rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div className="flex flex-col gap-5">
            <h2 id="lp-new-title" className="text-h2">{LP_NEW.title}</h2>
            <p className="max-w-2xl text-body-lg text-text-2">{LP_NEW.sub}</p>
            {generating ? (
              <div className="flex flex-col gap-4" role="status" aria-live="polite">
                <Progress value={Math.max(8, (stage / E.generating.length) * 100)} variant="ai" aria-label={E.generatingLabel} />
                <ol className="flex flex-col gap-2">
                  {E.generating.map((g, i) => (
                    <li key={g} className={cn("flex items-center gap-2.5 text-small", i > stage && "text-muted")}>
                      <span className={cn("flex size-5 items-center justify-center rounded-full", i < stage ? "bg-success/15 text-success" : i === stage ? "bg-violet/15" : "bg-surface-3")}>
                        {i < stage ? <Check aria-hidden className="size-3" /> : i === stage ? <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-violet" /> : null}
                      </span>
                      <span className={cn(i === stage && "font-semibold")}>{g}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {LP_NEW.sources.map((s) => {
                    const Icon = SOURCE_ICON[s.key];
                    return (
                      <li key={s.key} className="flex items-center gap-3 rounded-md bg-surface-2 p-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text"><Icon aria-hidden className="size-4" /></span>
                        <div className="min-w-0">
                          <p className="text-small font-bold">{s.title}</p>
                          <p className="truncate text-micro font-normal text-text-2">{s.body}</p>
                        </div>
                        <Check aria-hidden className="ms-auto size-4 shrink-0 text-success" />
                      </li>
                    );
                  })}
                </ul>
                <p className="flex items-start gap-2 text-small text-text-2">
                  <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-text" />
                  {LP_NEW.truthNote}
                </p>
                <Button size="lg" className="self-start" onClick={onGenerate}>
                  <Wand aria-hidden />
                  {costLabel(free ? LP_COST.preview : LP_COST.generate)}
                </Button>
              </>
            )}
          </div>
          <div className="mx-auto w-[220px] lg:w-full">
            <TrendTile art="sign" tone="gold" text="בואו לאכול אצלנו. אנחנו בפתח תקווה" nicheIcon="UtensilsCrossed" durationSec={15} size="lg" label="הסרטון לדף" className={cn("rounded-lg elev-3", generating && "shimmer-ai")} />
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- the form ----------

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={cn("num text-micro font-normal", value.length > max ? "text-danger" : "text-muted")}>{FL.counter(value.length, max)}</span>;
}

function SectionTitle({ title, summary }: { title: string; summary?: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <span>{title}</span>
      {summary && <span className="truncate text-small font-normal text-muted">{summary}</span>}
    </span>
  );
}

const selectCls = "h-11 w-full rounded-sm border border-border-strong bg-surface-2 px-3 text-base text-text focus-visible:outline-2";

function EditorForm({ content: c, patch, page, slug }: { content: LandingPageContent; patch: (p: Partial<LandingPageContent>) => void; page: LandingPage; slug: string }) {
  const setBenefit = (i: number, v: string) => {
    const b = [...c.benefits] as LandingPageContent["benefits"];
    b[i] = v;
    patch({ benefits: b });
  };
  const setService = (id: string, p: Partial<LandingPageContent["services"][number]>) =>
    patch({ services: c.services.map((s) => (s.id === id ? { ...s, ...p } : s)) });
  const setHours = (id: string, p: Partial<LandingPageContent["hours"][number]>) =>
    patch({ hours: c.hours.map((h) => (h.id === id ? { ...h, ...p } : h)) });
  const setFaq = (id: string, p: Partial<LandingPageContent["faq"][number]>) =>
    patch({ faq: c.faq.map((f) => (f.id === id ? { ...f, ...p } : f)) });
  const setFields = (p: Partial<LandingPageContent["leadForm"]["fields"]>) =>
    patch({ leadForm: { ...c.leadForm, fields: { ...c.leadForm.fields, ...p } } });

  return (
    <Accordion type="multiple" defaultValue={["hero", "headline"]} className="rounded-lg bg-surface-1 px-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-6">
      <AccordionItem value="hero">
        <AccordionTrigger><SectionTitle title={E.sections.hero.title} summary={page.heroVideos.find((v) => v.id === c.heroVideoId)?.titleHe} /></AccordionTrigger>
        <AccordionContent>
          <p className="mb-3 text-small">{E.sections.hero.help}</p>
          <div role="radiogroup" aria-label={E.sections.hero.title} className="grid max-w-md grid-cols-3 gap-3">
            {page.heroVideos.map((v) => {
              const on = v.id === c.heroVideoId;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => patch({ heroVideoId: v.id })}
                  className={cn("flex flex-col gap-2 rounded-md p-1.5 text-start transition-colors hover:bg-surface-2", on && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]")}
                >
                  <TrendTile art={v.art} tone={v.tone} text={v.hookHe} nicheIcon={page.business.nicheIcon} durationSec={v.durationSec} size="sm" />
                  <span className="line-clamp-2 px-1 text-micro text-text">{v.titleHe}</span>
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="headline">
        <AccordionTrigger><SectionTitle title={E.sections.headline.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-text">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between"><Label htmlFor="lp-h1">{FL.h1}</Label><Counter value={c.h1} max={LANDING_LIMITS.h1} /></div>
            <Input id="lp-h1" value={c.h1} maxLength={LANDING_LIMITS.h1 + 20} onChange={(e) => patch({ h1: e.target.value })} aria-invalid={c.h1.length > LANDING_LIMITS.h1 || !c.h1.trim() || undefined} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between"><Label htmlFor="lp-sub">{FL.subline}</Label><Counter value={c.subline} max={LANDING_LIMITS.subline} /></div>
            <Textarea id="lp-sub" rows={3} value={c.subline} onChange={(e) => patch({ subline: e.target.value })} aria-invalid={c.subline.length > LANDING_LIMITS.subline || undefined} />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="benefits">
        <AccordionTrigger><SectionTitle title={E.sections.benefits.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          {c.benefits.map((b, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between"><Label htmlFor={`lp-b${i}`}>{FL.benefit(i + 1)}</Label><Counter value={b} max={LANDING_LIMITS.benefit} /></div>
              <Input id={`lp-b${i}`} value={b} onChange={(e) => setBenefit(i, e.target.value)} />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="services">
        <AccordionTrigger><SectionTitle title={E.sections.services.title} summary={`${c.services.length}`} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          <p className="text-small text-text-2">{E.sections.services.help}</p>
          {c.services.map((s, i) => (
            <fieldset key={s.id} className="grid gap-3 rounded-md bg-surface-2 p-3 sm:grid-cols-[minmax(0,1fr)_140px_auto] sm:items-end">
              <legend className="sr-only">{`${FL.serviceName} ${i + 1}`}</legend>
              <div className="flex flex-col gap-2 sm:col-span-1">
                <Label htmlFor={`lp-s-${s.id}-n`}>{FL.serviceName}</Label>
                <Input id={`lp-s-${s.id}-n`} value={s.nameHe} onChange={(e) => setService(s.id, { nameHe: e.target.value })} />
                <Label htmlFor={`lp-s-${s.id}-d`} className="sr-only">{FL.serviceDesc}</Label>
                <Input id={`lp-s-${s.id}-d`} placeholder={FL.serviceDesc} value={s.descriptionHe} onChange={(e) => setService(s.id, { descriptionHe: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 self-start">
                <Label htmlFor={`lp-s-${s.id}-p`}>{FL.servicePrice} <span className="font-normal text-muted">({FL.servicePriceHelp})</span></Label>
                <div dir="ltr" className="relative">
                  <span aria-hidden className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted">₪</span>
                  <LtrInput
                    id={`lp-s-${s.id}-p`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="ps-7"
                    value={s.priceFromIls ?? ""}
                    onChange={(e) => setService(s.id, { priceFromIls: e.target.value === "" ? null : Math.max(0, Math.round(Number(e.target.value))) })}
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="self-start sm:self-end" aria-label={FL.removeService(s.nameHe)} onClick={() => patch({ services: c.services.filter((x) => x.id !== s.id) })}>
                <Trash2 aria-hidden />
              </Button>
            </fieldset>
          ))}
          <Button variant="secondary" className="self-start" disabled={c.services.length >= LANDING_LIMITS.services} onClick={() => patch({ services: [...c.services, { id: uid(), nameHe: "", descriptionHe: "", priceFromIls: null }] })}>
            <Plus aria-hidden />{FL.addService}
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="hours">
        <AccordionTrigger><SectionTitle title={E.sections.hours.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 text-text">
          {c.hours.map((h) => {
            const closed = !h.open || !h.close;
            return (
              <div key={h.id} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-md bg-surface-2 p-3 sm:grid-cols-[110px_minmax(0,1fr)_auto]">
                <span className="text-small font-semibold">{h.labelHe}</span>
                <div className="flex items-center gap-2" dir="ltr">
                  <label className="sr-only" htmlFor={`lp-h-${h.id}-o`}>{`${h.labelHe} ${FL.hoursOpen}`}</label>
                  <LtrInput id={`lp-h-${h.id}-o`} type="time" disabled={closed} value={h.open ?? ""} onChange={(e) => setHours(h.id, { open: e.target.value })} className="h-10 min-w-0" />
                  <span aria-hidden className="text-muted">–</span>
                  <label className="sr-only" htmlFor={`lp-h-${h.id}-c`}>{`${h.labelHe} ${FL.hoursClose}`}</label>
                  <LtrInput id={`lp-h-${h.id}-c`} type="time" disabled={closed} value={h.close ?? ""} onChange={(e) => setHours(h.id, { close: e.target.value })} className="h-10 min-w-0" />
                </div>
                <label className="col-span-2 flex items-center gap-2 text-small sm:col-span-1">
                  <Switch checked={closed} onCheckedChange={(on) => setHours(h.id, on ? { open: null, close: null } : { open: "09:00", close: "18:00" })} aria-label={`${h.labelHe}: ${FL.hoursClosed}`} />
                  {FL.hoursClosed}
                </label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="address">
        <AccordionTrigger><SectionTitle title={E.sections.address.title} summary={c.address.city} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={FL.street} htmlFor="lp-street"><Input id="lp-street" autoComplete="street-address" value={c.address.street} onChange={(e) => patch({ address: { ...c.address, street: e.target.value } })} /></Field>
            <Field label={FL.city} htmlFor="lp-city"><Input id="lp-city" autoComplete="address-level2" value={c.address.city} onChange={(e) => patch({ address: { ...c.address, city: e.target.value } })} /></Field>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-micro text-muted">{FL.waze}</span>
            <a href={wazeHref(c.address)} target="_blank" rel="noopener" dir="ltr" className="truncate text-start font-mono text-micro font-normal text-link hover:underline">{wazeHref(c.address)}</a>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="contact">
        <AccordionTrigger><SectionTitle title={E.sections.contact.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={FL.whatsapp} htmlFor="lp-wa"><LtrInput id="lp-wa" type="tel" inputMode="tel" autoComplete="tel" value={c.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} /></Field>
            <Field label={FL.phone} htmlFor="lp-phone"><LtrInput id="lp-phone" type="tel" inputMode="tel" autoComplete="tel" value={c.phone} onChange={(e) => patch({ phone: e.target.value })} /></Field>
          </div>
          <Field label={FL.whatsappPrefill} htmlFor="lp-wa-text"><Textarea id="lp-wa-text" rows={2} value={c.whatsappPrefill} onChange={(e) => patch({ whatsappPrefill: e.target.value })} /></Field>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="form">
        <AccordionTrigger><SectionTitle title={E.sections.form.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          <p className="text-small text-text-2">{E.sections.form.help}</p>
          <ul className="flex flex-col divide-y divide-border rounded-md bg-surface-2 px-3">
            {[
              { label: FL.formName, locked: true },
              { label: FL.formPhone, locked: true },
              { label: FL.formEmail, key: "email" as const },
              { label: FL.formMessage, key: "message" as const },
              { label: FL.formTime, key: "preferredTime" as const },
            ].map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-3 py-2.5 text-small">
                <span>{f.label}</span>
                {f.locked ? (
                  <span className="text-micro text-muted">{FL.required}</span>
                ) : (
                  <Switch checked={c.leadForm.fields[f.key!]} onCheckedChange={(on) => setFields({ [f.key!]: on })} aria-label={f.label} />
                )}
              </li>
            ))}
          </ul>
          <Field label={FL.submitLabel} htmlFor="lp-submit"><Input id="lp-submit" value={c.leadForm.submitLabel} maxLength={30} onChange={(e) => patch({ leadForm: { ...c.leadForm, submitLabel: e.target.value } })} /></Field>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq">
        <AccordionTrigger><SectionTitle title={E.sections.faq.title} summary={FL.faqCount(c.faq.length, LANDING_LIMITS.faq)} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          {c.faq.map((f, i) => (
            <fieldset key={f.id} className="flex flex-col gap-2 rounded-md bg-surface-2 p-3">
              <legend className="sr-only">{`${FL.faqQ} ${i + 1}`}</legend>
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label htmlFor={`lp-f-${f.id}-q`}>{FL.faqQ}</Label>
                  <Input id={`lp-f-${f.id}-q`} value={f.q} onChange={(e) => setFaq(f.id, { q: e.target.value })} />
                </div>
                <Button variant="ghost" size="icon" aria-label={FL.removeFaq(i + 1)} onClick={() => patch({ faq: c.faq.filter((x) => x.id !== f.id) })}><Trash2 aria-hidden /></Button>
              </div>
              <Label htmlFor={`lp-f-${f.id}-a`}>{FL.faqA}</Label>
              <Textarea id={`lp-f-${f.id}-a`} rows={2} value={f.a} onChange={(e) => setFaq(f.id, { a: e.target.value })} />
            </fieldset>
          ))}
          <div className="flex items-center gap-3">
            <Button variant="secondary" disabled={c.faq.length >= LANDING_LIMITS.faq} onClick={() => patch({ faq: [...c.faq, { id: uid(), q: "", a: "" }] })}>
              <Plus aria-hidden />{FL.addFaq}
            </Button>
            <span className="text-small text-muted">{FL.faqCount(c.faq.length, LANDING_LIMITS.faq)}</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="legal" className="border-b-0">
        <AccordionTrigger><SectionTitle title={E.sections.legal.title} /></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 text-text">
          <p className="text-small text-text-2">{E.sections.legal.help}</p>
          <Field label={FL.legalName} htmlFor="lp-legal"><Input id="lp-legal" value={c.legal.legalName} onChange={(e) => patch({ legal: { ...c.legal, legalName: e.target.value } })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={FL.idType} htmlFor="lp-idtype">
              <select id="lp-idtype" className={selectCls} value={c.legal.idType} onChange={(e) => patch({ legal: { ...c.legal, idType: e.target.value as BusinessIdType } })}>
                {(Object.keys(LP_ID_TYPE) as BusinessIdType[]).map((k) => <option key={k} value={k}>{LP_ID_TYPE[k]}</option>)}
              </select>
            </Field>
            <Field label={FL.idNumber} htmlFor="lp-idnum"><LtrInput id="lp-idnum" inputMode="numeric" value={c.legal.idNumber} onChange={(e) => patch({ legal: { ...c.legal, idNumber: e.target.value.replace(/[^\d-]/g, "") } })} /></Field>
          </div>
          <Link href={`/b/${slug}/privacy`} target="_blank" className="inline-flex items-center gap-1 self-start text-small font-semibold text-link hover:underline">
            {FL.privacyLink}<ExternalLink aria-hidden className="size-3.5" />
          </Link>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
