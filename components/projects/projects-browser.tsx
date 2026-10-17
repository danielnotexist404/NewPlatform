"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Archive, FolderOpen, LayoutGrid, List, Plus, Search, SearchX, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VideoTile } from "@/components/video/video-tile";
import { ChipRadio } from "@/components/wizard/choice";
import { APP_CORE } from "@/content/he/app-core";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import { PROJECT_STAGE_GROUP, formatDuration, projectHref, relativeFromNow, type MockProject, type VideoType } from "@/lib/mock/projects";
import { ProjectCard } from "./project-card";
import { StatusBadge } from "./status-badge";
import { Plural, plural } from "./plural";

const C = APP_CORE.projects;
type StatusKey = keyof typeof C.status;
const GROUP_OF: Record<Exclude<StatusKey, "all">, string> = { drafts: "drafts", progress: "progress", ready: "ready", failed: "failed" };

/** Part 03 §10: filters in the URL (?status=&type=&q=&view=&sort=), grid/list, multi-select. */
export function ProjectsBrowser({ projects }: { projects: MockProject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const status = (sp.get("status") as StatusKey) || "all";
  const type = sp.get("type") ?? "";
  const view = sp.get("view") === "list" ? "list" : "grid";
  const sort = sp.get("sort") ?? "updated";
  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [archived, setArchived] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const setParam = React.useCallback((k: string, v: string | null) => {
    const next = new URLSearchParams(sp.toString());
    if (v && v !== "all" && !(k === "view" && v === "grid") && !(k === "sort" && v === "updated")) next.set(k, v);
    else next.delete(k);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  }, [pathname, router, sp]);

  React.useEffect(() => {
    const id = window.setTimeout(() => { if ((sp.get("q") ?? "") !== q) setParam("q", q || null); }, 300);
    return () => window.clearTimeout(id);
  }, [q, sp, setParam]);

  const filtered = projects
    .filter(() => !archived)
    .filter((p) => status === "all" || PROJECT_STAGE_GROUP[p.stage] === GROUP_OF[status])
    .filter((p) => !type || p.videoType === type)
    .filter((p) => !q.trim() || p.title.includes(q.trim()))
    .sort((a, b) => (sort === "name" ? a.title.localeCompare(b.title, "he") : sort === "created" ? Date.parse(b.createdAt) - Date.parse(a.createdAt) : Date.parse(b.updatedAt) - Date.parse(a.updatedAt)));

  const counts = (k: StatusKey) => (k === "all" ? projects.length : projects.filter((p) => PROJECT_STAGE_GROUP[p.stage] === GROUP_OF[k]).length);
  const anyFilter = status !== "all" || !!type || !!q.trim() || archived;
  const toggleSel = (id: string, on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)));

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-h1">{C.title}</h1>
        <Button asChild size="lg"><Link href="/app/create?src=dashboard"><Plus aria-hidden />{C.newVideo}</Link></Button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={C.search} aria-label={C.search} className="ps-10" />
          </div>
          <label htmlFor="type-filter" className="sr-only">{C.type}</label>
          <select id="type-filter" value={type} onChange={(e) => setParam("type", e.target.value || null)} className="h-11 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm">
            <option value="">{C.typeAll}</option>
            {(Object.keys(VIDEO_TYPE_LABEL) as VideoType[]).map((t) => <option key={t} value={t}>{VIDEO_TYPE_LABEL[t]}</option>)}
          </select>
          <label htmlFor="sort" className="sr-only">{C.sortLabel}</label>
          <select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value)} className="h-11 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm">
            {(Object.keys(C.sort) as (keyof typeof C.sort)[]).map((k) => <option key={k} value={k}>{C.sort[k]}</option>)}
          </select>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setParam("view", v)} aria-label={C.view.grid}>
            <ToggleGroupItem value="grid" aria-label={C.view.grid}><LayoutGrid className="size-4" aria-hidden /></ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label={C.view.list}><List className="size-4" aria-hidden /></ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ChipRadio
            label={C.title}
            value={status}
            onValueChange={(v) => setParam("status", v)}
            items={(Object.keys(C.status) as StatusKey[]).map((k) => ({ value: k, label: <>{C.status[k]} <bdi className="num text-micro opacity-70">{counts(k)}</bdi></> }))}
          />
          <label className="flex items-center gap-2 text-small font-semibold text-text-2">
            <Switch checked={archived} onCheckedChange={setArchived} />
            {C.archive}
          </label>
        </div>
      </div>

      {selected.length > 0 && (
        <div role="region" aria-label={plural(selected.length, APP_CORE.counts.selected)} className="sticky top-[calc(var(--header-h)+8px)] z-10 flex flex-wrap items-center gap-3 rounded-full bg-surface-3 px-4 py-2 elev-2">
          <span className="text-small font-semibold"><Plural n={selected.length} forms={APP_CORE.counts.selected} /></span>
          <Button size="sm" variant="secondary" onClick={() => { toast(C.archived); setSelected([]); }}><Archive aria-hidden />{C.bulkArchive}</Button>
          <Button size="sm" variant="ghost" className="text-danger" onClick={() => setConfirmDelete(true)}><Trash2 aria-hidden />{C.bulkDelete}</Button>
          <Button size="icon-sm" variant="ghost" className="ms-auto" aria-label={C.clearSelection} onClick={() => setSelected([])}><X aria-hidden /></Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-1 px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <span className="flex size-20 items-center justify-center rounded-full bg-surface-2 text-muted">
            {anyFilter ? <SearchX className="size-9" aria-hidden /> : <FolderOpen className="size-9" aria-hidden />}
          </span>
          <h2 className="text-h3">{anyFilter ? C.filteredTitle : C.emptyTitle}</h2>
          <p className="max-w-md text-text-2">{anyFilter ? C.filteredBody : C.emptyBody}</p>
          {anyFilter ? (
            <Button variant="secondary" onClick={() => { setQ(""); setArchived(false); router.replace(pathname); }}>{C.clear}</Button>
          ) : (
            <Button asChild><Link href="/app/create">{C.emptyCta}</Link></Button>
          )}
        </div>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <ProjectCard project={p} selectable selected={selected.includes(p.id)} onSelectedChange={(on) => toggleSel(p.id, on)} priority={i < 5} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <table className="w-full min-w-[760px] text-small">
            <thead>
              <tr className="border-b border-border text-start text-micro text-muted">
                <th className="w-10 p-3"><span className="sr-only">{C.select.replace("{title}", "")}</span></th>
                <th className="p-3 text-start">{C.columns.name}</th>
                <th className="p-3 text-start">{C.columns.status}</th>
                <th className="p-3 text-start">{C.columns.type}</th>
                <th className="p-3 text-start">{C.columns.duration}</th>
                <th className="p-3 text-start">{C.columns.formats}</th>
                <th className="p-3 text-start">{C.columns.credits}</th>
                <th className="p-3 text-start">{C.columns.updated}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => toggleSel(p.id, e.target.checked)} aria-label={C.select.replace("{title}", p.title)} className="size-4 accent-[var(--color-primary)]" />
                  </td>
                  <td className="p-3">
                    <Link href={projectHref(p)} className="flex items-center gap-3 font-semibold hover:underline">
                      <span className="w-8 shrink-0"><VideoTile tone={p.tone} icon={p.scenes[0]?.icon} /></span>
                      <span dir="auto" className="line-clamp-2">{p.title}</span>
                    </Link>
                  </td>
                  <td className="p-3"><StatusBadge kind="project" status={p.stage} /></td>
                  <td className="p-3 text-text-2">{VIDEO_TYPE_LABEL[p.videoType]}</td>
                  <td className="p-3 font-mono text-text-2" dir="ltr">{formatDuration(p.durationSec)}</td>
                  <td className="p-3 font-mono text-micro text-text-2" dir="ltr">{p.renderedFormats.join(" · ") || "—"}</td>
                  <td className="p-3 text-text-2"><bdi className="num">{p.creditsSpent}</bdi></td>
                  <td className="p-3 text-text-2">{relativeFromNow(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogTitle>{plural(selected.length, APP_CORE.counts.projectsDelete)}</DialogTitle>
          <DialogDescription>{C.bulkDeleteBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild><Button variant="secondary" autoFocus>{C.cancel}</Button></DialogClose>
            <Button variant="destructive" onClick={() => { setConfirmDelete(false); setSelected([]); toast.success(C.deleted); }}>{C.bulkDelete}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
