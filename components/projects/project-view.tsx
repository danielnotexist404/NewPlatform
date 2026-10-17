"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Archive, Camera, Copy, Download, Ellipsis, FileText, Image as ImageIcon, Megaphone, Pencil, Plus, RefreshCw, Send, Share2, Split, Subtitles, Trash2, TriangleAlert, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Num } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PhonePreview } from "@/components/video/phone-preview";
import { SceneArt } from "@/components/video/scene-art";
import { LockedNote } from "@/components/wizard/choice";
import { APP_CORE } from "@/content/he/app-core";
import { getHook, getHookType, getNiche } from "@/lib/data/seed";
import { PLATFORM_LABEL, QUALITY_LABEL, VIDEO_TYPE_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { formatDate, formatDuration, relativeFromNow, type Aspect, type MockProject } from "@/lib/mock/projects";
import { MOCK_BUSINESS, MOCK_PLAN } from "@/lib/mock/workspace";
import { HookScoreBadge, HookScorePanel } from "./hook-score";
import { StatusBadge } from "./status-badge";
import { ExportDialog, ShareDialog } from "./share-export";
import { DemoBadge } from "./demo-note";
import { Plural, fill, fillText, plural } from "./plural";
import { cn } from "@/lib/utils";

const PJ = APP_CORE.project;
const ALL: Aspect[] = ["9:16", "1:1", "16:9"];
const RES: Record<Aspect, string> = { "9:16": "1080×1920", "1:1": "1080×1080", "16:9": "1920×1080" };
const CAPTION_LABEL = APP_CORE.wizard.preview.captionPresets;

export function ProjectView({ project }: { project: MockProject }) {
  const router = useRouter();
  const q = useSearchParams();
  const [title, setTitle] = React.useState(project.title);
  const [renaming, setRenaming] = React.useState(false);
  const [aspect, setAspect] = React.useState<Aspect>(project.renderedFormats[0] ?? project.primaryAspect);
  const [addFormat, setAddFormat] = React.useState<Aspect | null>(null);
  const [variant, setVariant] = React.useState(0);
  const [shareOpen, setShareOpen] = React.useState(q.get("share") === "1");
  const [exportOpen, setExportOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [activeScene, setActiveScene] = React.useState(0);
  const [seek, setSeek] = React.useState<{ index: number; nonce: number } | null>(null);
  const failed = project.stage === "failed";
  const niche = getNiche(project.nicheSlug);
  const hookOverride = project.variants?.[variant]?.hookText ?? null;
  const formatCost = project.durationSec > 30 ? 3 : 2;
  const groupSize = project.variants?.length ?? 0;
  const endCard = { headline: project.endCardHeadline, name: MOCK_BUSINESS.name, logoLetter: MOCK_BUSINESS.logoLetter, lines: [fillText(APP_CORE.player.endWhatsapp, { phone: MOCK_BUSINESS.whatsapp })] };

  return (
    <div className="flex flex-col gap-8 overflow-x-clip pb-12">
      {/* header */}
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/app/projects" className="inline-flex items-center gap-1 text-small text-text-2 hover:text-text">
            <DirIcon name="back" className="size-4" />
            {APP_CORE.projects.title}
          </Link>
          <DemoBadge />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              {renaming ? (
                <>
                  <label htmlFor="project-title" className="sr-only">{PJ.renameLabel}</label>
                  <input
                    id="project-title"
                    dir="auto"
                    autoFocus
                    value={title}
                    maxLength={80}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => { setRenaming(false); if (title !== project.title) toast.success(APP_CORE.wizard.saved); }}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className="w-full max-w-3xl rounded-sm bg-surface-2 px-3 py-1 text-h2 font-bold"
                  />
                </>
              ) : (
                <h1 className="text-h2 [text-wrap:balance]" dir="auto">
                  {title}
                  <button type="button" onClick={() => setRenaming(true)} aria-label={PJ.renameLabel} className="ms-2 inline-flex size-8 translate-y-[-4px] items-center justify-center rounded-full align-middle text-text-2 hover:bg-surface-2 hover:text-text">
                    <Pencil className="size-4" aria-hidden />
                  </button>
                </h1>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge kind="project" status={project.stage} size="md" />
              {project.hookScore && <HookScoreBadge score={project.hookScore.score} size={36} />}
              <p className="text-small text-text-2">
                {fill(PJ.meta, {
                  type: VIDEO_TYPE_LABEL[project.videoType],
                  duration: <Num value={project.durationSec} />,
                  creator: project.creator,
                  date: <bdi className="num">{formatDate(project.createdAt)}</bdi>,
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {failed ? (
              <>
                <Tooltip content={PJ.needsRender}>
                  <Button size="lg" aria-disabled="true" onClick={(e) => e.preventDefault()}><Megaphone aria-hidden />{PJ.actions.campaign}</Button>
                </Tooltip>
                <Tooltip content={PJ.needsRender}>
                  <Button size="lg" variant="secondary" aria-disabled="true" onClick={(e) => e.preventDefault()}><Send aria-hidden />{PJ.actions.publish}</Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="glow-primary">
                  <Link href={`/app/campaigns/new?project=${project.id}`}><Megaphone aria-hidden />{PJ.actions.campaign}</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href={`/app/publish/new?project=${project.id}`}><Send aria-hidden />{PJ.actions.publish}</Link>
                </Button>
              </>
            )}
            <Button size="lg" variant="outline" onClick={() => setExportOpen(true)} disabled={failed}><Download aria-hidden />{PJ.actions.download}</Button>
            <Button size="lg" variant="outline" onClick={() => setShareOpen(true)} disabled={failed}><Share2 aria-hidden />{PJ.actions.share}</Button>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button size="icon-lg" variant="ghost" aria-label={PJ.actions.more}><Ellipsis aria-hidden /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => router.push(`/app/projects/${project.id}/editor`)}><Pencil aria-hidden />{PJ.actions.edit}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toast.success(APP_CORE.projects.duplicated)}><Copy aria-hidden />{PJ.actions.duplicate}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(`/app/projects/${project.id}/create/hook`)}><RefreshCw aria-hidden />{PJ.actions.newHook}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => toast(APP_CORE.projects.archived)}><Archive aria-hidden />{PJ.actions.archive}</DropdownMenuItem>
                <DropdownMenuItem danger onSelect={() => setDeleteOpen(true)}><Trash2 aria-hidden />{PJ.actions.delete}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {groupSize > 1 && (
          <Link href={`/app/campaigns/new?group=${project.id}`} className="inline-flex w-fit items-center gap-2 rounded-full bg-violet/10 px-4 py-2 text-small font-semibold text-violet hover:bg-violet/20">
            <Split className="size-4" aria-hidden />
            {PJ.actions.splitTest}
            <DirIcon name="next" className="size-4" />
          </Link>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* player column */}
        <div className="flex min-w-0 flex-col items-center gap-5 lg:col-span-7">
          {failed && (
            <div role="alert" className="flex w-full flex-col gap-3 rounded-lg bg-rose/[.08] p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-rose)_45%,transparent)]">
              <p className="flex items-center gap-2 font-bold text-rose"><TriangleAlert className="size-5" aria-hidden />{APP_CORE.render.failure.title}</p>
              <p className="text-small text-text-2">{APP_CORE.render.failure.body}</p>
              <p className="text-small font-semibold text-success">{plural(project.creditsRefunded, APP_CORE.counts.refundedAll)}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild><Link href={`/app/projects/${project.id}/create/preview`}>{APP_CORE.render.failure.retry}</Link></Button>
                {project.latestJobId && <Button size="sm" variant="ghost" asChild><Link href={`/app/projects/${project.id}/jobs/${project.latestJobId}`}>{APP_CORE.render.stepsLabel}</Link></Button>}
              </div>
            </div>
          )}

          {groupSize > 1 && (
            <div className="flex w-full flex-col gap-2">
              <p className="text-micro text-muted">{PJ.variantsLabel}</p>
              <div role="tablist" aria-label={PJ.variantsLabel} className="flex flex-wrap gap-2">
                {project.variants!.map((v, i) => (
                  <button
                    key={v.letter}
                    role="tab"
                    type="button"
                    aria-selected={variant === i}
                    onClick={() => setVariant(i)}
                    className={cn("flex max-w-[16rem] items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-start text-small text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)]", variant === i && "bg-surface-3 text-text shadow-[inset_0_0_0_1px_var(--color-primary)]")}
                  >
                    <span className="font-bold">{v.letter}</span>
                    <span className="truncate" dir="auto">{v.hookText}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* format tabs */}
          <div role="tablist" aria-label={PJ.formatsLabel} className="flex flex-wrap items-center justify-center gap-1 rounded-full bg-surface-2 p-1" dir="ltr">
            {ALL.map((a) => {
              const rendered = project.renderedFormats.includes(a);
              return rendered ? (
                <button key={a} role="tab" type="button" aria-selected={aspect === a} onClick={() => setAspect(a)} className={cn("rounded-full px-4 py-1.5 font-mono text-small font-semibold text-text-2", aspect === a && "bg-surface-3 text-text")}>
                  {a}
                </button>
              ) : (
                <button key={a} type="button" onClick={() => setAddFormat(a)} disabled={failed} className="rounded-full px-3 py-1.5 font-mono text-small text-muted hover:text-text disabled:opacity-50">
                  {fillText(PJ.addFormatTab, { aspect: a })}
                </button>
              );
            })}
          </div>

          {failed ? (
            <div className="relative aspect-reel w-full max-w-[300px] overflow-hidden rounded-[34px]">
              <SceneArt tone={project.tone} icon={project.scenes[0]?.icon} className="opacity-50" />
            </div>
          ) : (
            <PhonePreview
              key={aspect + variant}
              scenes={project.scenes}
              title={title}
              aspect={aspect}
              width={340}
              captionPreset={project.captionPreset}
              endCard={endCard}
              aiLabel
              logoBug={MOCK_BUSINESS.logoLetter}
              hookOverride={hookOverride}
              glow
              seekScene={seek}
              onSceneChange={setActiveScene}
              feedHeader={
                <>
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">{MOCK_BUSINESS.logoLetter}</span>
                  <span className="text-small font-semibold">{MOCK_BUSINESS.shortName}</span>
                </>
              }
            />
          )}

          {/* scene strip */}
          <section aria-labelledby="scenes-title" className="flex w-full flex-col gap-3">
            <h2 id="scenes-title" className="text-body font-bold">{PJ.scenesLabel}</h2>
            <ol className="flex gap-2.5 overflow-x-auto pb-2">
              {project.scenes.map((s, i) => (
                <li key={s.id} className="w-[96px] shrink-0">
                  <button
                    type="button"
                    onClick={() => setSeek({ index: i, nonce: Date.now() })}
                    aria-label={`${fillText(APP_CORE.wizard.preview.scene, { n: i + 1 })}: ${s.onscreen || s.vo}`}
                    aria-current={activeScene === i ? "true" : undefined}
                    className={cn("relative block aspect-reel w-full overflow-hidden rounded-sm shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow", activeScene === i && "ring-2 ring-primary")}
                  >
                    <SceneArt tone={s.tone} icon={s.icon} />
                    <span className="absolute top-1 inset-s-1 rounded-[4px] bg-black/60 px-1 font-mono text-[11px] text-white"><bdi dir="ltr">{formatDuration(s.durationSec)}</bdi></span>
                  </button>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-micro text-muted"><bdi className="num">{i + 1}</bdi></span>
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="size-6" aria-label={`${PJ.actions.more} · ${fillText(APP_CORE.wizard.preview.scene, { n: i + 1 })}`}>
                          <Ellipsis aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => toast(APP_CORE.demo.note)}><RefreshCw aria-hidden />{fillText(PJ.regenerateScene, { cost: plural(s.source === "ai_clip" ? 19 : 4, APP_CORE.counts.credits) })}</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push(`/app/projects/${project.id}/editor`)}><Pencil aria-hidden />{PJ.editInEditor}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex w-full flex-col gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:flex-row sm:items-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-rose/15 text-rose"><Camera className="size-5" aria-hidden /></span>
            <div className="flex-1">
              <p className="font-bold">{PJ.shoot.title}</p>
              <p className="text-small text-text-2">{PJ.shoot.body}</p>
            </div>
            <Button asChild variant="secondary"><Link href={`/app/projects/${project.id}/shoot`}>{PJ.shoot.cta}</Link></Button>
          </div>
        </div>

        {/* side column */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          {project.hookScore && <HookScorePanel data={project.hookScore} />}
          <Tabs defaultValue="downloads" dir="rtl" className="flex flex-col gap-4">
            <TabsList variant="underline" className="overflow-x-auto">
              <TabsTrigger value="downloads" className="whitespace-nowrap">{PJ.tabs.downloads}</TabsTrigger>
              <TabsTrigger value="share" className="whitespace-nowrap">{PJ.tabs.share}</TabsTrigger>
              <TabsTrigger value="versions" className="whitespace-nowrap">{PJ.tabs.versions}</TabsTrigger>
              <TabsTrigger value="details" className="whitespace-nowrap">{PJ.tabs.details}</TabsTrigger>
            </TabsList>
            <TabsContent value="downloads"><DownloadsPanel project={project} disabled={failed} /></TabsContent>
            <TabsContent value="share"><SharePanel project={project} onShare={() => setShareOpen(true)} /></TabsContent>
            <TabsContent value="versions"><VersionsPanel project={project} /></TabsContent>
            <TabsContent value="details">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-surface-1 p-5 text-small shadow-[inset_0_0_0_1px_var(--color-frame)]">
                {[
                  [PJ.details.niche, niche?.name_he ?? ""],
                  [PJ.details.hook, <Link key="h" href={`/app/hooks?niche=${project.nicheSlug}`} className="text-link underline underline-offset-2">{getHookType(getHook(project.hookId ?? "")?.hook_type_slug ?? "")?.name_he ?? PJ.details.hookLink}</Link>],
                  [PJ.details.style, APP_CORE.wizard.style.styles[project.style].title],
                  [PJ.details.quality, `${QUALITY_LABEL[project.quality]} · ${VISUAL_MIX_LABEL[project.visualMix]}`],
                  [PJ.details.voice, project.voiceName ?? APP_CORE.wizard.confirm.noVoice],
                  [PJ.details.music, project.musicName ?? APP_CORE.wizard.confirm.noMusic],
                  [PJ.details.captions, CAPTION_LABEL[project.captionPreset]],
                  [PJ.details.created, <bdi key="c" className="num">{formatDate(project.createdAt)}</bdi>],
                  [PJ.details.updated, relativeFromNow(project.updatedAt)],
                ].map(([k, v], i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="text-micro text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
                <div className="col-span-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-text-2">
                  <span>{fill(PJ.details.spent, { n: <Num value={project.creditsSpent} /> })}</span>
                  <span>{fill(PJ.details.refunded, { n: <Num value={project.creditsRefunded} /> })}</span>
                </div>
              </dl>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!addFormat} onOpenChange={(o) => !o && setAddFormat(null)}>
        <DialogContent>
          <DialogTitle>{addFormat && fillText(PJ.addFormat, { aspect: addFormat, cost: plural(formatCost, APP_CORE.counts.credits) })}</DialogTitle>
          <DialogDescription>{APP_CORE.wizard.goal.extraHelp}</DialogDescription>
          {MOCK_PLAN.id === "free" && <LockedNote className="mt-3" text={PJ.formatLocked} />}
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild><Button variant="secondary" autoFocus>{APP_CORE.projects.cancel}</Button></DialogClose>
            <Button onClick={() => { setAddFormat(null); router.push(`/app/projects/${project.id}/jobs/j-new`); }}>
              <Plus aria-hidden />{addFormat && fillText(PJ.addFormat, { aspect: addFormat, cost: plural(formatCost, APP_CORE.counts.credits) })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogTitle>{fillText(APP_CORE.projects.deleteTitle, { title })}</DialogTitle>
          <DialogDescription>{APP_CORE.projects.deleteBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild><Button variant="secondary" autoFocus>{APP_CORE.projects.cancel}</Button></DialogClose>
            <Button variant="destructive" onClick={() => { setDeleteOpen(false); toast.success(APP_CORE.projects.deleted); router.push("/app/projects"); }}>{PJ.actions.delete}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} projectId={project.id} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} formats={project.renderedFormats} />
    </div>
  );
}

function Row({ icon: Icon, title, sub, action }: { icon: React.ComponentType<{ className?: string }>; title: React.ReactNode; sub?: React.ReactNode; action: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-text-2"><Icon className="size-4" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold">{title}</p>
        {sub && <p className="text-micro font-normal text-muted">{sub}</p>}
      </div>
      {action}
    </li>
  );
}

function DownloadsPanel({ project, disabled }: { project: MockProject; disabled: boolean }) {
  const D = PJ.downloads;
  const [platform, setPlatform] = React.useState("reels");
  const [rewriting, setRewriting] = React.useState(false);
  const demo = () => toast(APP_CORE.demo.noFile);
  const dl = <Button size="sm" variant="secondary" onClick={demo} disabled={disabled}><Download aria-hidden />{D.download}</Button>;
  if (disabled) return <p className="rounded-lg bg-surface-1 p-5 text-small text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{PJ.noFiles}</p>;
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <ul className="flex flex-col divide-y divide-border">
        {project.renderedFormats.map((f) => (
          <Row key={f} icon={Video} title={fillText(D.video, { aspect: f })} sub={<><bdi dir="ltr" className="font-mono">{RES[f]}</bdi> · <bdi className="font-mono">{formatDuration(project.durationSec)}</bdi> · <Num value={f === "9:16" ? 18 : 14} /> MB</>} action={dl} />
        ))}
        <Row icon={Subtitles} title={D.srt} sub={D.srtHelp} action={dl} />
        <Row icon={Subtitles} title={D.vtt} sub={D.vttHelp} action={dl} />
        <Row icon={ImageIcon} title={D.poster} sub="JPG" action={dl} />
      </ul>
      <p className="text-micro font-normal text-text-2">{D.captionsHelp}</p>
      {project.postCaption && (
        <div className={cn("flex flex-col gap-3 rounded-md bg-surface-2 p-4", rewriting && "glow-ai")}>
          <p className="flex items-center gap-2 text-small font-bold"><FileText className="size-4" aria-hidden />{D.caption}</p>
          <p className="whitespace-pre-line text-small text-text-2">{rewriting ? D.rewriting : project.postCaption}</p>
          <ul className="flex flex-wrap gap-1.5">{project.hashtags?.map((h) => <li key={h} className="rounded-full bg-surface-3 px-2.5 py-0.5 text-micro">{h}</li>)}</ul>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={async () => { try { await navigator.clipboard.writeText(project.postCaption ?? ""); } catch { /* blocked */ } toast.success(APP_CORE.wizard.script.textCopied); }}>
              <Copy aria-hidden />{D.copy}
            </Button>
            <Button size="sm" variant="ghost" loading={rewriting} onClick={() => { setRewriting(true); window.setTimeout(() => setRewriting(false), 1400); }}>{D.rewrite}</Button>
            <label htmlFor="cap-platform" className="sr-only">{D.platform}</label>
            <select id="cap-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-8 rounded-full border border-border-strong bg-surface-1 px-3 text-small">
              {(["reels", "tiktok", "facebook", "linkedin"] as const).map((k) => <option key={k} value={k}>{PLATFORM_LABEL[k]}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function SharePanel({ project, onShare }: { project: MockProject; onShare: () => void }) {
  const S = PJ.share;
  if (project.shareLinks.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <p className="text-small text-text-2">{S.empty}</p>
        <Button size="sm" onClick={onShare}><Share2 aria-hidden />{S.cta}</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <ul className="flex flex-col divide-y divide-border">
        {project.shareLinks.map((l) => {
          const exp = l.expiry.kind === "until" ? fillText(S.validUntil, { date: formatDate(l.expiry.date) }) : l.expiry.kind === "unlimited" ? S.unlimited : l.expiry.kind === "expired" ? S.expired : S.revoked;
          const live = l.expiry.kind === "until" || l.expiry.kind === "unlimited";
          return (
            <li key={l.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-small font-semibold">{l.kind === "public_view" ? S.kindView : S.kindApproval}</span>
                <span className={cn("rounded-xs px-2 py-0.5 text-micro", live ? "bg-success/15 text-success" : "bg-surface-3 text-text-2")}>{exp}</span>
              </div>
              <p className="text-micro font-normal text-muted">
                {fillText(S.createdBy, { date: formatDate(l.createdAt), name: l.createdBy })} · <Num value={l.views} /> {S.views} · {S.download}: {l.allowDownload ? S.yes : S.no}
              </p>
              {live && <button type="button" onClick={() => toast(S.revokeBody)} className="self-start text-micro font-semibold text-danger hover:underline">{S.revoke}</button>}
            </li>
          );
        })}
      </ul>
      <Button size="sm" variant="secondary" className="self-start" onClick={onShare}>{S.newLink}</Button>
    </div>
  );
}

function VersionsPanel({ project }: { project: MockProject }) {
  const V = PJ.versions;
  return (
    <ol className="flex flex-col gap-2">
      {project.versions.map((v) => (
        <li key={v.n} className={cn("flex flex-wrap items-center gap-3 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]", v.current && "shadow-[inset_0_0_0_1px_var(--color-primary)]")}>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 font-semibold">
              {fillText(V.version, { n: v.n })}
              {v.current && <span className="rounded-xs bg-primary px-1.5 py-0.5 text-micro text-on-primary">{V.current}</span>}
            </p>
            <p className="text-micro font-normal text-muted">{V.sources[v.source]} · {v.author} · {relativeFromNow(v.date)}</p>
            {v.formats.length > 0 && <p className="mt-1 flex gap-1">{v.formats.map((f) => <bdi key={f} dir="ltr" className="rounded-xs bg-surface-3 px-1.5 font-mono text-micro">{f}</bdi>)}</p>}
          </div>
          {!v.current && (
            <div className="flex gap-1">
              {v.formats.length > 0 && <Button size="sm" variant="ghost" onClick={() => toast(APP_CORE.demo.note)}>{V.view}</Button>}
              <Button size="sm" variant="secondary" onClick={() => toast.success(fillText(APP_CORE.projects.restoredToast, { n: project.versions.length + 1 }))}>{V.restore}</Button>
            </div>
          )}
        </li>
      ))}
      {project.versions.length === 0 && <li className="text-small text-text-2"><Plural n={0} forms={APP_CORE.counts.versions} /></li>}
    </ol>
  );
}
