"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Play, RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { ReelArt, ArtChip, DurationChip, nicheIcon, toneFor, type ReelTone } from "./reel-art";
import { SampleTag } from "./kit";
import { EXAMPLES_PAGE as T } from "@/content/he/gallery";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import type { AspectRatio, DemoExample, VideoType } from "@/lib/mock/gallery";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExampleItem extends DemoExample {
  nicheName: string;
  nicheIconName: string;
  templateId: string | null;
}

const ASPECT_ICON: Record<AspectRatio, LucideIcon> = { "9:16": RectangleVertical, "1:1": Square, "16:9": RectangleHorizontal };
const TONES: Record<string, ReelTone> = {
  "restaurants-grill-30": "gold",
  "renovation-bathroom-30": "success",
  "mortgage-mix-30": "violet",
  "dentists-brand-60": "rose",
  "nails-hanukkah-15": "lemon",
};

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
  const niches = Array.from(new Map(items.map((i) => [i.niche_slug, i.nicheName])).entries());
  const types = Array.from(new Set(items.map((i) => i.video_type))) as VideoType[];
  const formats: AspectRatio[] = ["9:16", "1:1", "16:9"];

  const shown = items.filter(
    (i) =>
      (!filters.niche || i.niche_slug === filters.niche) &&
      (!filters.format || i.aspect_ratio === filters.format || i.extra_formats.includes(filters.format as AspectRatio)) &&
      (!filters.type || i.video_type === filters.type),
  );
  const current = items.find((i) => i.slug === openSlug) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label={T.filters.label} className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
        <label className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
          <span className="text-small font-semibold text-text-2">{T.filters.niche}</span>
          <select
            value={filters.niche}
            onChange={(e) => onChange?.({ niche: e.target.value })}
            className="h-10 min-w-52 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm text-text"
          >
            <option value="">{T.filters.nicheAll}</option>
            {niches.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <ChipGroup
          label={T.filters.format}
          value={filters.format}
          allLabel={T.filters.formatAll}
          options={formats.map((f) => ({ value: f, label: T.formatLabels[f] }))}
          onChange={(v) => onChange?.({ format: v })}
        />
        <ChipGroup
          label={T.filters.type}
          value={filters.type}
          allLabel={T.filters.typeAll}
          options={types.map((t) => ({ value: t, label: VIDEO_TYPE_LABEL[t] }))}
          onChange={(v) => onChange?.({ type: v })}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {T.filters.results(shown.length)}
      </p>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-1 px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <p className="text-body-lg">{T.filters.none}</p>
          <Button variant="secondary" onClick={() => onChange?.({ niche: "", format: "", type: "" })}>
            {T.filters.clear}
          </Button>
        </div>
      ) : (
        <ul className="columns-2 gap-3 sm:gap-5 lg:columns-3">
          {shown.map((ex) => {
            const AspectIcon = ASPECT_ICON[ex.aspect_ratio];
            return (
              <li key={ex.slug} className="mb-4 break-inside-avoid sm:mb-6">
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
                  className="group block w-full rounded-md text-start focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <ReelArt
                    aspect={ex.aspect_ratio}
                    tone={TONES[ex.slug] ?? toneFor(ex.slug)}
                    icon={nicheIcon(ex.nicheIconName)}
                    hook={ex.aspect_ratio === "16:9" ? undefined : (ex.scenes[0]?.onscreen_he ?? ex.hook_text_he)}
                    size="sm"
                    topEnd={<SampleTag>{T.demoTag}</SampleTag>}
                    bottomStart={<ArtChip>{ex.nicheName}</ArtChip>}
                    bottomEnd={<DurationChip sec={ex.duration_sec} />}
                    className="transition-transform duration-500 group-hover:scale-[1.012]"
                  >
                    {ex.aspect_ratio === "16:9" && (
                      <span className="absolute inset-x-[10%] top-[24%] hidden text-center text-[17px] font-extrabold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)] sm:block">
                        {ex.scenes[0]?.onscreen_he ?? ex.hook_text_he}
                      </span>
                    )}
                    <span aria-hidden className={cn("absolute inset-0 flex justify-center", ex.aspect_ratio === "16:9" ? "items-center sm:items-end sm:pb-[8%]" : "items-center")}>
                      <span className="flex size-10 sm:size-14 items-center justify-center rounded-full bg-white/15 text-white opacity-90 backdrop-blur-md transition-transform group-hover:scale-110">
                        <Play className="size-5 fill-current sm:size-6" />
                      </span>
                    </span>
                  </ReelArt>
                  <span className="mt-3 block px-0.5">
                    <span className="block text-small font-bold text-text sm:text-body">{ex.title_he}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="inline-flex rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{VIDEO_TYPE_LABEL[ex.video_type]}</span>
                      <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
                        <AspectIcon aria-hidden className="size-3.5" />
                        <bdi dir="ltr">{ex.aspect_ratio}</bdi>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

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
                <ReelArt
                  aspect={current.aspect_ratio}
                  tone={TONES[current.slug] ?? toneFor(current.slug)}
                  icon={nicheIcon(current.nicheIconName)}
                  hook={current.scenes[0]?.onscreen_he ?? current.hook_text_he}
                  size="lg"
                  topEnd={<SampleTag>{T.demoTag}</SampleTag>}
                  bottomEnd={<DurationChip sec={current.duration_sec} />}
                  label={current.title_he}
                />
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

function ChipGroup({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
      <span id={id} className="text-small font-semibold text-text-2">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1.5">
        {[{ value: "", label: allLabel }, ...options].map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value || "all"}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors",
                active ? "border-primary bg-primary text-on-primary" : "border-border-strong text-text-2 hover:text-text",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
