"use client";
import * as React from "react";
import Link from "next/link";
import { Clock, Coins, Info, LayoutTemplate, Ratio, Rows3 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VideoTile } from "@/components/video/video-tile";
import { SceneArt } from "@/components/video/scene-art";
import { HookText } from "@/components/hooks/hook-text";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageHeader, Panel, EmptyState, Tag, DlRow, ButtonLink } from "@/components/settings/kit";
import { FilterChips, NativeSelect } from "@/components/settings/controls";
import {
  templatesCopy as t, STRUCTURE_LABEL, BEAT_ROLE_LABEL, VISUAL_STYLE_LABEL, CAPTION_PRESET_LABEL, MUSIC_MOOD_LABEL,
} from "@/content/he/account";
import { VIDEO_TYPE_LABEL, ASPECT_LABEL, QUALITY_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { getNiche, hooks, niches } from "@/lib/data/seed";
import { MOCK_TEMPLATES, MOCK_WORKSPACE, type MockTemplate, type VideoType } from "@/lib/mock/account";
import type { SceneTone } from "@/lib/mock/projects";
import { creditsText, fill, plural } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

type TypeTab = "all" | VideoType;
const TONES: SceneTone[] = ["ember", "gold", "rose", "violet", "night", "smoke"];
const toneOf = (tpl: MockTemplate) => TONES[Math.floor(tpl.hue / 60) % TONES.length];
const iconOf = (tpl: MockTemplate) => (tpl.nicheSlug ? getNiche(tpl.nicheSlug)?.icon ?? "Clapperboard" : "Clapperboard");
const startHref = (tpl: MockTemplate) => `/app/create?template=${tpl.id}&src=template`;

export function TemplatesGallery() {
  const [type, setType] = React.useState<TypeTab>("all");
  const [niche, setNiche] = React.useState<string>(MOCK_WORKSPACE.nicheSlug);
  const [duration, setDuration] = React.useState<string>("any");
  const [format, setFormat] = React.useState<string>("any");
  const [open, setOpen] = React.useState<MockTemplate | null>(null);

  const base = MOCK_TEMPLATES.filter((x) => !niche || x.nicheSlug === null || x.nicheSlug === niche);
  const counts = (v: TypeTab) => (v === "all" ? base.length : base.filter((x) => x.videoType === v).length);
  const list = base.filter((x) =>
    (type === "all" || x.videoType === type) &&
    (duration === "any" || String(x.durationSec) === duration) &&
    (format === "any" || x.aspect === format));
  const nicheOptions = niches.filter((n) => n.slug !== "local-politics");

  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <div className="flex flex-col gap-6">
        <FilterChips<TypeTab>
          label={t.tabsLabel}
          value={type}
          onChange={setType}
          options={[{ value: "all" as TypeTab, label: t.all, count: counts("all") }, ...(Object.keys(VIDEO_TYPE_LABEL) as VideoType[]).map((v) => ({ value: v as TypeTab, label: VIDEO_TYPE_LABEL[v], count: counts(v) }))]}
        />
        <div className="grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            {t.filters.niche}
            <NativeSelect value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option value="">{t.filters.allNiches}</option>
              {nicheOptions.map((n) => <option key={n.slug} value={n.slug}>{n.name_he}</option>)}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            {t.filters.duration}
            <NativeSelect value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="any">{t.filters.any}</option>
              {[15, 30, 45, 60].map((d) => <option key={d} value={String(d)}>{fill(t.seconds, { n: d })}</option>)}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            {t.filters.format}
            <NativeSelect value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="any">{t.filters.any}</option>
              {(Object.keys(ASPECT_LABEL) as (keyof typeof ASPECT_LABEL)[]).map((a) => <option key={a} value={a}>{ASPECT_LABEL[a]}</option>)}
            </NativeSelect>
          </label>
        </div>
        <p className="text-small text-muted" aria-live="polite">{plural(list.length, t.count)}</p>

        {list.length === 0 ? (
          <Panel>
            <EmptyState illustration="templates" title={t.emptyTitle} action={<ButtonLink href="/app/hooks" variant="secondary">{t.emptyAction}</ButtonLink>} />
          </Panel>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {list.map((tpl) => (
              <li key={tpl.id}>
                <article aria-labelledby={`tpl-${tpl.id}`} className="group flex h-full flex-col overflow-hidden rounded-lg bg-surface-1 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow hover:elev-2">
                  <div className="relative isolate overflow-hidden bg-black p-4">
                    <SceneArt tone={toneOf(tpl)} glyph={false} className="-z-10 scale-125 opacity-70 blur-2xl" />
                    <div className={cn("relative mx-auto", tpl.aspect === "9:16" ? "w-[46%]" : tpl.aspect === "1:1" ? "w-[66%]" : "w-full")}>
                      <VideoTile tone={toneOf(tpl)} icon={iconOf(tpl)} hookText={tpl.nameHe} aspect={tpl.aspect} durationSec={tpl.durationSec} textSize="sm" />
                    </div>
                    <Tag variant="lemon" className="absolute top-3 inset-s-3">{VIDEO_TYPE_LABEL[tpl.videoType]}</Tag>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h2 id={`tpl-${tpl.id}`} className="text-body-lg font-bold">{tpl.nameHe}</h2>
                    <p className="line-clamp-2 text-small text-text-2">{tpl.descriptionHe}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      <li><Tag variant="outline"><Clock aria-hidden />{fill(t.seconds, { n: tpl.durationSec })}</Tag></li>
                      <li><Tag variant="outline"><Ratio aria-hidden /><bdi dir="ltr">{tpl.aspect}</bdi></Tag></li>
                      <li><Tag variant="outline"><Rows3 aria-hidden />{STRUCTURE_LABEL[tpl.structure]}</Tag></li>
                      {!tpl.nicheSlug && <li><Tag variant="neutral">{t.filters.forAny}</Tag></li>}
                    </ul>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-primary-text"><Coins className="size-4" aria-hidden />{plural(tpl.cost.draft, t.fromCredits)}</p>
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <Link href={startHref(tpl)} className={cn(buttonVariants({ size: "sm" }), "flex-1")}>{t.start}</Link>
                      <Button size="sm" variant="ghost" aria-label={fill(t.detailsSr, { name: tpl.nameHe })} onClick={() => setOpen(tpl)}>
                        <Info aria-hidden />{t.details}
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        {open && <TemplateDetails tpl={open} />}
      </Dialog>
    </>
  );
}

function TemplateDetails({ tpl }: { tpl: MockTemplate }) {
  const d = t.dialog;
  const matching = hooks
    .filter((h) => h.hook_type_slug === tpl.defaultHookType && (h.niche_slug === (tpl.nicheSlug ?? MOCK_WORKSPACE.nicheSlug) || h.niche_slug === null))
    .concat(hooks.filter((h) => h.niche_slug === (tpl.nicheSlug ?? MOCK_WORKSPACE.nicheSlug)))
    .filter((h, i, arr) => arr.findIndex((x) => x.id === h.id) === i)
    .slice(0, 4);
  const total = tpl.beats.reduce((s, b) => s + b.sec, 0);
  return (
    <DialogContent size="xl" className="max-h-[92dvh] overflow-y-auto">
      <DialogTitle>{tpl.nameHe}</DialogTitle>
      <DialogDescription>{tpl.descriptionHe}</DialogDescription>
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,240px)_1fr]">
        <div className={cn("mx-auto w-full", tpl.aspect === "9:16" ? "max-w-[240px]" : "max-w-none")}>
          <VideoTile tone={toneOf(tpl)} icon={iconOf(tpl)} hookText={tpl.nameHe} aspect={tpl.aspect} durationSec={tpl.durationSec} alt={fill(d.previewSr, { name: tpl.nameHe })} />
        </div>
        <div className="flex flex-col gap-5">
          <section aria-labelledby="tpl-inside">
            <h3 id="tpl-inside" className="mb-1 font-bold">{d.inside}</h3>
            <dl>
              <DlRow term={d.structure}>{STRUCTURE_LABEL[tpl.structure]}</DlRow>
              <DlRow term={d.duration}>{plural(tpl.durationSec, d.durationWords)}</DlRow>
              <DlRow term={d.format}>{ASPECT_LABEL[tpl.aspect]}</DlRow>
              <DlRow term={d.style}>{VISUAL_STYLE_LABEL[tpl.visualStyle]}</DlRow>
              <DlRow term={d.captions}>{CAPTION_PRESET_LABEL[tpl.captionPreset]}</DlRow>
              <DlRow term={d.music}>{MUSIC_MOOD_LABEL[tpl.musicMood]}</DlRow>
              <DlRow term={d.visual}>{VISUAL_MIX_LABEL[tpl.visualMix]}</DlRow>
            </dl>
          </section>
          <section aria-labelledby="tpl-cost">
            <h3 id="tpl-cost" className="mb-1 font-bold">{d.costTitle}</h3>
            <dl>
              {(["draft", "standard", "premium"] as const).map((q) => (
                <DlRow key={q} term={QUALITY_LABEL[q]}>{fill(d.costRow, { credits: creditsText(tpl.cost[q]) })}</DlRow>
              ))}
            </dl>
            <p className="mt-2 text-micro font-normal text-muted">{d.costNote}</p>
          </section>
        </div>
      </div>

      <section aria-labelledby="tpl-beats" className="mt-6">
        <h3 id="tpl-beats" className="mb-3 font-bold">{d.beatsTitle}</h3>
        {/* Timeline is LTR like every timeline; labels stay Hebrew */}
        <div dir="ltr" className="hidden gap-1 md:flex">
          {tpl.beats.map((b, i) => (
            <div key={i} className="flex min-w-0 flex-col gap-1.5 rounded-sm bg-surface-2 p-2.5" style={{ flexGrow: b.sec, flexBasis: 0 }}>
              <span className="h-1 rounded-full" style={{ background: `var(--color-chart-${(i % 5) + 1})` }} />
              <span dir="rtl" className="text-micro text-text">{BEAT_ROLE_LABEL[b.role]} · <bdi className="num">{fill(t.seconds, { n: b.sec })}</bdi></span>
              <span dir="rtl" className="line-clamp-2 text-micro font-normal text-text-2">{b.ideaHe}</span>
            </div>
          ))}
        </div>
        <ol className="flex flex-col gap-2 md:hidden">
          {tpl.beats.map((b, i) => (
            <li key={i} className="flex gap-3 rounded-sm bg-surface-2 p-3">
              <span className="mt-1 h-auto w-1 shrink-0 rounded-full" style={{ background: `var(--color-chart-${(i % 5) + 1})` }} />
              <span className="flex flex-col">
                <span className="text-sm font-bold">{BEAT_ROLE_LABEL[b.role]} · {fill(t.seconds, { n: b.sec })}</span>
                <span className="text-small text-text-2">{b.ideaHe}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="sr-only">{plural(total, d.durationWords)}</p>
      </section>

      {matching.length > 0 && (
        <section aria-labelledby="tpl-hooks" className="mt-6">
          <h3 id="tpl-hooks" className="mb-3 font-bold">{d.hooksTitle}</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {matching.map((h) => (
              <li key={h.id} className="rounded-sm bg-surface-2 p-3.5">
                <blockquote className="text-body font-bold"><HookText text={h.text_he} values={{ עיר: "רמת גן", שם_העסק: MOCK_WORKSPACE.name }} /></blockquote>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 flex justify-end">
        <Link href={startHref(tpl)} className={buttonVariants({ size: "lg" })}>
          <LayoutTemplate aria-hidden />
          {t.start}
          <DirIcon name="forward" />
        </Link>
      </div>
    </DialogContent>
  );
}
