"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Clapperboard, Download, Film, Image as ImageIcon, Pause, Play, Search, Sparkles, Trash2, Upload, UploadCloud, X, Palette, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/misc";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SceneArt } from "@/components/video/scene-art";
import { PageHeader, Panel, EmptyState, Note, DlRow, Tag, ButtonLink } from "@/components/settings/kit";
import { Checkbox, FilterChips, NativeSelect } from "@/components/settings/controls";
import { libraryCopy as c, accountCommon } from "@/content/he/account";
import { MOCK_ASSETS, MOCK_PROJECTS, MOCK_WORKSPACE, type AssetKind, type MockAsset } from "@/lib/mock/account";
import type { SceneTone } from "@/lib/mock/projects";
import { fill, formatBytes, formatDateHe, formatDuration, plural } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

type Tab = keyof typeof c.tabs;
const TAB_KINDS: Record<Exclude<Tab, "all">, AssetKind[]> = {
  uploads: ["upload_image", "upload_video"],
  brand: ["logo", "brand_image"],
  keyframes: ["keyframe"],
  clips: ["clip"],
  renders: ["render"],
};
const VIDEO_KINDS: AssetKind[] = ["upload_video", "clip", "render"];
const DELETABLE: AssetKind[] = ["upload_image", "upload_video"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];

const toneFor = (hue: number): SceneTone =>
  hue >= 300 || hue < 0 ? "rose" : hue < 40 ? "ember" : hue < 60 ? "gold" : hue < 180 ? "smoke" : hue < 240 ? "night" : "violet";
const sourceOf = (k: AssetKind) => (k === "upload_image" || k === "upload_video" || k === "logo" || k === "brand_image" ? c.source.upload : k === "render" ? c.source.render : c.source.ai);
/** Soft glyph drawn by SceneArt (lucide names): the niche glyph for footage, a spark for AI frames. */
const KIND_GLYPH: Record<AssetKind, string> = {
  upload_image: "Brush", upload_video: "Brush", logo: "Brush", brand_image: "Palette", keyframe: "Sparkles", clip: "Sparkles", render: "Brush",
};
const KIND_ICON: Record<AssetKind, typeof Film> = {
  upload_image: ImageIcon, upload_video: Film, logo: Palette, brand_image: Palette, keyframe: Sparkles, clip: Clapperboard, render: Play,
};

interface QueueItem { id: string; name: string; progress: number; paused: boolean; file: File }

export function MediaLibrary() {
  const [assets, setAssets] = React.useState<MockAsset[]>(MOCK_ASSETS);
  const [tab, setTab] = React.useState<Tab>("all");
  const [q, setQ] = React.useState("");
  const [project, setProject] = React.useState("");
  const [open, setOpen] = React.useState<MockAsset | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<MockAsset | null>(null);
  const [dropOpen, setDropOpen] = React.useState(MOCK_ASSETS.length === 0);
  const [consent, setConsent] = React.useState(false);
  const [consentError, setConsentError] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Simulated resumable upload (sign → upload → complete)
  React.useEffect(() => {
    if (!queue.some((x) => !x.paused && x.progress < 100)) return;
    const t = setInterval(() => {
      setQueue((list) => list.map((x) => (x.paused || x.progress >= 100 ? x : { ...x, progress: Math.min(100, x.progress + 7 + Math.round(x.file.size % 5)) })));
    }, 220);
    return () => clearInterval(t);
  }, [queue]);
  React.useEffect(() => {
    const done = queue.filter((x) => x.progress >= 100);
    if (!done.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- move finished uploads from the queue into the grid
    setQueue((list) => list.filter((x) => x.progress < 100));
    setAssets((list) => [
      ...done.map((d, i): MockAsset => {
        const isVideo = d.file.type.startsWith("video/");
        return {
          id: `up-${d.id}`,
          kind: isVideo ? "upload_video" : "upload_image",
          filename: d.name,
          width: 1080,
          height: isVideo ? 1920 : 1350,
          durationSec: isVideo ? 18 : undefined,
          bytes: d.file.size,
          createdAt: "2026-10-17T12:00",
          projectIds: [],
          hue: 20 + i * 40,
          objectUrl: !isVideo && d.file.type !== "image/heic" ? URL.createObjectURL(d.file) : undefined,
        };
      }),
      ...list,
    ]);
    toast.success(c.queue.done);
  }, [queue]);

  const addFiles = (files: FileList | File[]) => {
    if (!consent) { setConsentError(true); setDropOpen(true); return; }
    const errs: string[] = [];
    const ok: QueueItem[] = [];
    Array.from(files).forEach((f, i) => {
      const ext = f.name.split(".").pop()?.toUpperCase() ?? "";
      const isImg = IMAGE_TYPES.includes(f.type) || ["HEIC", "HEIF"].includes(ext);
      const isVid = VIDEO_TYPES.includes(f.type) || ["MP4", "MOV"].includes(ext);
      if (!isImg && !isVid) { errs.push(fill(c.errors.badType, { ext })); return; }
      if ((isImg && f.size > 25 * 1024 * 1024) || (isVid && f.size > 500 * 1024 * 1024)) { errs.push(fill(c.errors.tooBig, { name: f.name })); return; }
      ok.push({ id: `${f.name}-${f.size}-${i}-${queue.length}`, name: f.name, progress: 0, paused: false, file: f });
    });
    setErrors(errs);
    if (ok.length) setQueue((l) => [...l, ...ok]);
  };

  const counts = Object.fromEntries((Object.keys(c.tabs) as Tab[]).map((t) => [t, t === "all" ? assets.length : assets.filter((a) => TAB_KINDS[t].includes(a.kind)).length])) as Record<Tab, number>;
  const visible = assets.filter((a) =>
    (tab === "all" || TAB_KINDS[tab].includes(a.kind)) &&
    (!q.trim() || a.filename.toLowerCase().includes(q.trim().toLowerCase())) &&
    (!project || a.projectIds.includes(project)));

  return (
    <>
      <PageHeader
        title={c.title}
        description={c.subtitle}
        actions={
          <Button size="lg" onClick={() => { if (consent) inputRef.current?.click(); else { setDropOpen(true); setConsentError(true); } }}>
            <Upload aria-hidden />{c.upload}
          </Button>
        }
      />
      <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,image/*,video/mp4,video/quicktime" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />

      <div className="flex flex-col gap-6">
        {/* MediaDropzone — collapses after the first upload */}
        <Panel className={cn("flex flex-col gap-4 transition-colors", dragOver && "shadow-[inset_0_0_0_2px_var(--color-primary-text)]")}>
          <button type="button" aria-expanded={dropOpen} onClick={() => setDropOpen((x) => !x)} className="flex items-center justify-between gap-3 text-start">
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-sm bg-surface-2 text-primary-text"><UploadCloud className="size-5" aria-hidden /></span>
              <span className="flex flex-col">
                <span className="font-bold">{c.dropzone.title}</span>
                <span className="text-small text-text-2">{c.dropzone.formats}</span>
              </span>
            </span>
            {dropOpen ? <ChevronUp className="size-5 text-text-2" aria-label={c.dropzone.collapse} /> : <ChevronDown className="size-5 text-text-2" aria-label={c.dropzone.expand} />}
          </button>
          {dropOpen && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border-strong bg-bg/40 px-4 py-8 text-center"
            >
              <UploadCloud className="size-9 text-primary-text" aria-hidden />
              <Button variant="secondary" onClick={() => { if (!consent) { setConsentError(true); return; } inputRef.current?.click(); }}>{c.dropzone.choose}</Button>
              <div className="max-w-xl text-start">
                <Checkbox id="upload-consent" checked={consent} onCheckedChange={(v) => { setConsent(v); setConsentError(false); }} invalid={consentError}>
                  {c.dropzone.consent}{" "}
                  <Link href="/legal/likeness-consent" target="_blank" rel="noopener" className="font-semibold text-link underline underline-offset-4">{c.dropzone.consentForm}</Link>
                </Checkbox>
                {consentError && !consent && <p role="alert" className="mt-2 ps-8 text-small text-danger">{c.dropzone.consentRequired}</p>}
              </div>
            </div>
          )}
          {errors.length > 0 && <Note tone="danger"><ul className="flex flex-col gap-1">{errors.map((x) => <li key={x}>{x}</li>)}</ul></Note>}
          {queue.length > 0 && (
            <ul aria-label={c.queue.title} className="flex flex-col gap-2">
              {queue.map((item) => (
                <li key={item.id} className="flex flex-col gap-2 rounded-sm bg-surface-2 p-3 sm:flex-row sm:items-center">
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold"><bdi dir="ltr">{item.name}</bdi>{item.paused && <span className="ms-2 text-micro text-muted">{c.queue.paused}</span>}</span>
                  <Progress value={item.progress} aria-label={fill(c.queue.progressSr, { name: item.name })} className="sm:w-48" />
                  <span className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setQueue((l) => l.map((x) => (x.id === item.id ? { ...x, paused: !x.paused } : x)))}>
                      {item.paused ? <Play aria-hidden /> : <Pause aria-hidden />}{item.paused ? c.queue.resume : c.queue.pause}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setQueue((l) => l.filter((x) => x.id !== item.id)); toast(c.queue.canceled); }}><X aria-hidden />{c.queue.cancel}</Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          <FilterChips<Tab> label={c.tabsLabel} value={tab} onChange={setTab} options={(Object.keys(c.tabs) as Tab[]).map((t) => ({ value: t, label: c.tabs[t], count: counts[t] }))} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:max-w-xs sm:flex-1">
              <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input aria-label={c.search} placeholder={c.search} value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" type="search" />
            </div>
            <NativeSelect aria-label={c.projectFilter} value={project} onChange={(e) => setProject(e.target.value)} className="sm:w-64">
              <option value="">{c.allProjects}</option>
              {MOCK_PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </NativeSelect>
          </div>
          <p className="text-small text-muted" aria-live="polite">{plural(visible.length, c.count)}</p>
        </div>

        {/* AssetGrid — tiles keep the file's aspect ratio */}
        {assets.length === 0 ? (
          <Panel><EmptyState illustration="library" title={c.emptyTitle} description={c.emptyBody} action={<Button onClick={() => setDropOpen(true)}>{c.upload}</Button>} /></Panel>
        ) : visible.length === 0 ? (
          <Panel><EmptyState illustration="search" title={accountCommon.emptySearch} action={<Button variant="secondary" onClick={() => { setTab("all"); setQ(""); setProject(""); }}>{accountCommon.clearFilters}</Button>} /></Panel>
        ) : (
          <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 2xl:columns-5 [&>li]:mb-3">
            {visible.map((a) => (
              <li key={a.id} className="break-inside-avoid">
                <AssetTile asset={a} onOpen={() => setOpen(a)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        {open && (
          <SheetContent side="end" title={c.drawer.details} closeLabel={accountCommon.close} className="max-w-md">
            <AssetDrawer asset={open} onDelete={() => setConfirmDelete(open)} />
          </SheetContent>
        )}
      </Sheet>

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogTitle>{c.drawer.deleteTitle}</DialogTitle>
          <DialogDescription>{c.drawer.deleteBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{accountCommon.cancel}</Button>
            <Button variant="destructive" onClick={() => {
              setAssets((l) => l.filter((x) => x.id !== confirmDelete?.id));
              setConfirmDelete(null); setOpen(null); toast(c.drawer.deleted);
            }}>{c.drawer.delete}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AssetArt({ asset, large }: { asset: MockAsset; large?: boolean }) {
  const Icon = KIND_ICON[asset.kind];
  const isVideo = VIDEO_KINDS.includes(asset.kind);
  return (
    <div className="relative isolate w-full overflow-hidden bg-black" style={{ aspectRatio: `${asset.width} / ${asset.height}` }}>
      {asset.objectUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- local preview of a file the user just picked
        <img src={asset.objectUrl} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <SceneArt tone={toneFor(asset.hue)} icon={KIND_GLYPH[asset.kind]} glyph={asset.kind !== "logo" && asset.kind !== "brand_image"} />
      )}
      {asset.kind === "logo" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-1/2 items-center justify-center rounded-[22%] bg-rose font-bold text-white" style={{ fontSize: large ? 56 : 28 }}>{asset.captionHe}</span>
        </span>
      )}
      {asset.captionHe && asset.kind !== "logo" && (
        <p dir="rtl" className={cn("absolute inset-x-[8%] top-[34%] text-center font-black leading-tight text-white [text-wrap:balance]", large ? "text-h3" : "text-sm")} style={{ textShadow: "0 3px 14px rgb(0 0 0 / .6)" }}>{asset.captionHe}</p>
      )}
      {asset.kind === "brand_image" && (
        <span className="absolute inset-0 flex items-center justify-center text-white/70"><Icon className={large ? "size-12" : "size-7"} aria-hidden /></span>
      )}
      {isVideo && (
        <span className="absolute inset-s-2 bottom-2 flex size-7 items-center justify-center rounded-full bg-black/55 text-white"><Play className="size-3.5" aria-hidden /></span>
      )}
      {asset.durationSec != null && (
        <span className="absolute bottom-2 inset-e-2 rounded-xs bg-black/60 px-1.5 py-0.5 font-mono text-micro text-white"><bdi dir="ltr">{formatDuration(asset.durationSec)}</bdi></span>
      )}
    </div>
  );
}

function AssetTile({ asset, onOpen }: { asset: MockAsset; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={fill(c.drawer.openSr, { name: asset.filename })}
      className="group block w-full overflow-hidden rounded-md bg-surface-1 text-start shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow hover:elev-2 focus-visible:outline-2"
    >
      <div className="relative">
        <div className="transition-transform duration-500 group-hover:scale-[1.03]"><AssetArt asset={asset} /></div>
        <Tag variant="neutral" className="absolute top-2 inset-s-2 bg-black/60 text-white">{c.kindBadge[asset.kind]}</Tag>
      </div>
      <div className="flex flex-col gap-0.5 px-3 py-2.5">
        <bdi dir="ltr" className="truncate text-start text-sm font-semibold">{asset.filename}</bdi>
        <span className="text-micro font-normal text-muted">
          <bdi dir="ltr" className="num">{asset.width}×{asset.height}</bdi> · {formatBytes(asset.bytes)}
        </span>
      </div>
    </button>
  );
}

function AssetDrawer({ asset, onDelete }: { asset: MockAsset; onDelete: () => void }) {
  const projects = MOCK_PROJECTS.filter((p) => asset.projectIds.includes(p.id));
  const deletable = DELETABLE.includes(asset.kind);
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--color-frame)]"><AssetArt asset={asset} large /></div>
      <dl className="flex flex-col">
        <DlRow term={c.drawer.kind}>{c.kindBadge[asset.kind]}</DlRow>
        <DlRow term={c.drawer.dimensions}><bdi dir="ltr" className="num">{asset.width}×{asset.height}</bdi></DlRow>
        {asset.durationSec != null && <DlRow term={c.drawer.duration}><bdi dir="ltr" className="num">{formatDuration(asset.durationSec)}</bdi></DlRow>}
        <DlRow term={c.drawer.size}><bdi className="num">{formatBytes(asset.bytes)}</bdi></DlRow>
        <DlRow term={c.drawer.date}>{formatDateHe(asset.createdAt)}</DlRow>
        <DlRow term={c.drawer.filename}><bdi dir="ltr" className="break-all">{asset.filename}</bdi></DlRow>
        <DlRow term={c.drawer.source}>{sourceOf(asset.kind)}</DlRow>
      </dl>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">{c.drawer.usedIn}</p>
        {projects.length ? (
          <ul className="flex flex-col gap-1">
            {projects.map((p) => (
              <li key={p.id}><Link href={`/app/projects/${p.id}`} className="text-sm font-semibold text-link underline-offset-4 hover:underline">{p.title}</Link></li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-text-2">{c.drawer.notUsed}</p>
        )}
      </div>
      {!MOCK_WORKSPACE.hasPaid && asset.kind === "render" && <Tag variant="danger" className="w-fit">{plural(21, c.expiry)}</Tag>}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast(c.drawer.preparing)}><Download aria-hidden />{c.drawer.download}</Button>
        {deletable && <Button variant="secondary" onClick={onDelete}><Trash2 aria-hidden />{c.drawer.delete}</Button>}
      </div>
      {asset.kind === "logo" || asset.kind === "brand_image" ? (
        <Note>{c.drawer.noDeleteLogo} <ButtonLink href="/app/brand" variant="link" size="sm" className="h-auto">{c.drawer.toBrand}</ButtonLink></Note>
      ) : !deletable ? (
        <Note>{c.drawer.noDeleteGenerated}</Note>
      ) : (
        <Note>{c.drawer.useHint}</Note>
      )}
    </div>
  );
}
