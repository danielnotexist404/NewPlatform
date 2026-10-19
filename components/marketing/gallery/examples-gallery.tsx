"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Play, RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { MediaTile } from "@/components/marketing/media/media-tile";
import { reelFromText, type ReelData } from "@/components/marketing/media/reel-data";
import { EXAMPLES_PAGE as T } from "@/content/he/gallery";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import type { AspectRatio, DemoExample } from "@/lib/mock/gallery";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExampleItem extends DemoExample {
  nicheName: string;
  nicheIconName: string;
  templateId: string | null;
}

const ASPECT_ICON: Record<AspectRatio, LucideIcon> = { "9:16": RectangleVertical, "1:1": Square, "16:9": RectangleHorizontal };
function exampleReel(ex: ExampleItem, i: number): ReelData {
  return reelFromText(ex.slug, ex.scenes[0]?.onscreen_he ?? ex.hook_text_he, ex.niche_slug, { caption: (["box", "shadow", "accent"] as const)[i % 3], highlight: 1 });
}

type Filters = { niche: string; format: string; type: string };

export function ExamplesGallery({ items }: { items: ExampleItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters: Filters = { niche: params.get("niche") ?? "", format: params.get("format") ?? "", type: params.get("type") ?? "" };
  const open = params.get("v");
  const set = (patch: Partial<Filters & { v: string }>) => {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  return <ExamplesGalleryView items={items} filters={filters} openSlug={open} onChange={set} />;
}

export function ExamplesGalleryFallback({ items }: { items: ExampleItem[] }) {
  return <ExamplesGalleryView items={items} filters={{ niche: "", format: "", type: "" }} openSlug={null} />;
}

function ExamplesGalleryView({
  items,
  filters,
  openSlug,
  onChange,
}: {
  items: ExampleItem[];
  filters: Filters;
  openSlug: string | null;
  onChange?: (patch: Partial<Filters & { v: string }>) => void;
}) {
  const tileRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const lastOpened = React.useRef<string | null>(null);

  const shown = items.filter(
    (i) =>
      (!filters.niche || i.niche_slug === filters.niche) &&
      (!filters.format || i.aspect_ratio === filters.format || i.extra_formats.includes(filters.format as AspectRatio)) &&
      (!filters.type || i.video_type === filters.type),
  );
  const current = items.find((i) => i.slug === openSlug) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 items-end gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
        {shown.map((ex, i) => {
          const AspectIcon = ASPECT_ICON[ex.aspect_ratio];
          return (
            <li key={ex.slug} className={cn(ex.aspect_ratio === "16:9" && "col-span-2")}>
              <button
                ref={(el) => {
                  if (el) tileRefs.current.set(ex.slug, el);
                }}
                type="button"
                onClick={() => {
                  lastOpened.current = ex.slug;
                  onChange?.({ v: ex.slug });
                }}
                aria-label={T.dialog.open(ex.title_he)}
                className="group block w-full rounded-[22px] text-start focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <MediaTile reel={exampleReel(ex, i)} aspect={ex.aspect_ratio} offset={i * 1.5} className="transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="absolute top-[4%] inset-e-[4%] z-10 rounded-full bg-paper/90 px-2.5 py-1 text-micro text-ink">{T.demoTag}</span>
                  <span aria-hidden className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex size-16 items-center justify-center rounded-full bg-paper/20 text-paper backdrop-blur-md">
                      <Play className="size-7 fill-current" />
                    </span>
                  </span>
                </MediaTile>
                <span className="mt-4 block px-1">
                  <span className="block text-body-lg font-bold text-text">{ex.title_he}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-small text-muted">
                    {VIDEO_TYPE_LABEL[ex.video_type]} ·
                    <AspectIcon aria-hidden className="size-3.5" />
                    <bdi dir="ltr">{ex.aspect_ratio}</bdi>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Dialog open={!!current} onOpenChange={(o) => !o && onChange?.({ v: "" })}>
        {current && (
          <DialogContent
            size="xl"
            className="max-h-[90dvh] overflow-y-auto p-5 md:p-7"
            closeLabel={T.dialog.close}
            onCloseAutoFocus={(e) => {
              const el = lastOpened.current ? tileRefs.current.get(lastOpened.current) : null;
              if (el) {
                e.preventDefault();
                el.focus();
              }
            }}
          >
            <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_1fr]">
              <div className={cn("mx-auto w-full", current.aspect_ratio === "16:9" ? "max-w-none md:col-span-2" : "max-w-[280px]")}>
                <MediaTile reel={exampleReel(current, 0)} aspect={current.aspect_ratio} label={current.title_he} instance="-dlg">
                  <span className="absolute top-[4%] inset-e-[4%] z-10 rounded-full bg-paper/90 px-2.5 py-1 text-micro text-ink">{T.demoTag}</span>
                </MediaTile>
                <p className="mt-2 text-micro font-normal text-muted">{T.dialog.playerNote}</p>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <DialogTitle className="text-h3 pe-8">{current.title_he}</DialogTitle>
                <DialogDescription className="mt-0 text-small">
                  {current.nicheName} · {VIDEO_TYPE_LABEL[current.video_type]} ·{" "}
                  <bdi dir="ltr" className="num">
                    {[current.aspect_ratio, ...current.extra_formats].join(" · ")}
                  </bdi>
                </DialogDescription>
                <div className="rounded-md bg-surface-2 p-4">
                  <p className="text-micro text-muted">{T.dialog.hookLabel}</p>
                  <p className="mt-1 text-body-lg font-bold">{current.hook_text_he}</p>
                  <Link href={`/hooks/h/${current.hook_id}`} className="mt-2 inline-flex items-center gap-1 text-small font-semibold text-link underline underline-offset-4">
                    {T.dialog.hookLink}
                    <DirIcon name="forward" className="size-3.5" />
                  </Link>
                </div>
                <div>
                  <p className="text-small font-bold">{T.dialog.scenes}</p>
                  <ol className="mt-2 flex flex-col gap-1.5">
                    {current.scenes.map((s) => (
                      <li key={s.t} className="flex gap-3 rounded-sm bg-surface-2/60 px-3 py-2 text-small">
                        <bdi dir="ltr" className="num w-20 shrink-0 text-micro text-muted">
                          {s.t}
                        </bdi>
                        <span className="min-w-0">
                          {s.onscreen_he && <span className="block font-semibold">{s.onscreen_he}</span>}
                          <span className="block text-micro font-normal text-text-2">{s.visual_he}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={`/login?next=${encodeURIComponent(
                      current.templateId
                        ? `/app/create?template=${current.templateId}&src=template`
                        : `/app/create?niche=${current.niche_slug}&hook=${current.hook_id}&src=hooks`,
                    )}`}
                    className={buttonVariants({ size: "lg" })}
                    data-cta-location="examples_dialog"
                  >
                    {T.dialog.cta}
                  </Link>
                  <Button variant="secondary" size="lg" onClick={() => onChange?.({ v: "" })}>
                    {T.dialog.close}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
