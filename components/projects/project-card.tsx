"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Copy, Download, Ellipsis, FolderOpen, Pencil, Share2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoTile } from "@/components/video/video-tile";
import { StatusBadge } from "./status-badge";
import { Plural, fillText } from "./plural";
import { APP_CORE } from "@/content/he/app-core";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import { PROJECT_STAGE_GROUP, projectHref, relativeFromNow, type MockProject } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

const C = APP_CORE.projects;

export function ProjectCard({
  project,
  selectable,
  selected,
  onSelectedChange,
  priority,
  className,
}: {
  project: MockProject;
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (on: boolean) => void;
  priority?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const done = project.stage === "done";
  const href = projectHref(project);
  const group = PROJECT_STAGE_GROUP[project.stage];

  return (
    <article className={cn("group/card relative flex flex-col gap-3", className)} aria-labelledby={`pc-${project.id}`}>
      <Link
        href={href}
        className="relative block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-labelledby={`pc-${project.id}`}
        prefetch={priority ? true : undefined}
      >
        <VideoTile
          tone={project.tone}
          icon={project.scenes[0]?.icon ?? "UtensilsCrossed"}
          hookText={project.hookText || undefined}
          durationSec={project.durationSec}
          textSize="sm"
          className={cn("transition-shadow group-hover/card:shadow-[inset_0_0_0_1px_var(--color-frame),var(--glow-primary)]", selected && "ring-2 ring-primary")}
          bottomStart={
            project.renderedFormats.length > 1 ? (
              <span className="rounded-xs bg-black/60 px-1.5 py-0.5 font-mono text-micro text-white">
                <bdi dir="ltr">{project.renderedFormats.join(" · ")}</bdi>
              </span>
            ) : project.primaryAspect !== "9:16" ? (
              <span className="rounded-xs bg-black/60 px-1.5 py-0.5 font-mono text-micro text-white"><bdi dir="ltr">{project.primaryAspect}</bdi></span>
            ) : null
          }
          badge={
            project.variants && project.variants.length > 1 ? (
              <span className="rounded-xs bg-lemon px-1.5 py-0.5 text-micro font-bold text-on-primary">
                <Plural n={project.variants.length} forms={APP_CORE.counts.versions} />
              </span>
            ) : null
          }
        />
        {group === "progress" && (
          <span className="absolute inset-x-3 bottom-10 h-1 overflow-hidden rounded-full bg-white/20" aria-hidden>
            <span className="block h-full w-[46%] rounded-full shimmer-ai bg-violet" />
          </span>
        )}
      </Link>
      {selectable && (
        <label className="absolute top-2 inset-s-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-sm bg-black/55 backdrop-blur">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => onSelectedChange?.(e.target.checked)}
            className="size-4 accent-[var(--color-primary)]"
            aria-label={fillText(C.select, { title: project.title })}
          />
        </label>
      )}
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 id={`pc-${project.id}`} dir="auto" className="truncate text-body font-bold leading-snug">
            {project.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-micro font-normal text-muted">
            <StatusBadge kind="project" status={project.stage} />
            <span>{VIDEO_TYPE_LABEL[project.videoType]}</span>
          </div>
          <p className="mt-1 text-micro font-normal text-muted">{fillText(C.updated, { relative: relativeFromNow(project.updatedAt) })}</p>
        </div>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={fillText(C.menu.label, { title: project.title })} className="-me-1.5 text-text-2">
              <Ellipsis aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push(href)}><FolderOpen aria-hidden />{C.menu.open}</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/app/projects/${project.id}/editor`)}><Pencil aria-hidden />{C.menu.edit}</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.success(C.duplicated)}><Copy aria-hidden />{C.menu.duplicate}</DropdownMenuItem>
            {done && <DropdownMenuItem onSelect={() => toast(APP_CORE.demo.noFile)}><Download aria-hidden />{C.menu.download}</DropdownMenuItem>}
            {done && <DropdownMenuItem onSelect={() => router.push(`/app/projects/${project.id}?share=1`)}><Share2 aria-hidden />{C.menu.share}</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast(C.archived, { action: { label: C.undo, onClick: () => undefined }, duration: 6000 })}>
              <Archive aria-hidden />{C.menu.archive}
            </DropdownMenuItem>
            <DropdownMenuItem danger onSelect={() => setConfirmDelete(true)}><Trash2 aria-hidden />{C.menu.delete}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogTitle>{fillText(C.deleteTitle, { title: project.title })}</DialogTitle>
          <DialogDescription>{C.deleteBody}</DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <DialogClose asChild><Button variant="secondary" autoFocus>{C.cancel}</Button></DialogClose>
            <Button variant="destructive" onClick={() => { setConfirmDelete(false); toast.success(C.deleted); }}>{C.menu.delete}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
