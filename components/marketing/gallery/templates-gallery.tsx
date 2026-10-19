"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { TemplateCard, type TemplateCardData } from "./template-card";
import { TEMPLATES_PAGE as T } from "@/content/he/gallery";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

type F = { type: string; niche: string; duration: string; format: string };
const EMPTY: F = { type: "", niche: "", duration: "", format: "" };

/** Client-only chip filters (Part 02 §6.2: no URL change). */
export function TemplatesGallery({ items }: { items: TemplateCardData[] }) {
  const [f, setF] = React.useState<F>(EMPTY);
  const types = Array.from(new Set(items.map((i) => i.video_type)));
  const shown = items.filter(
    (i) =>
      (!f.type || i.video_type === f.type) &&
      (!f.niche || (f.niche === "__all" ? i.niche_slug === null : i.niche_slug === f.niche)) &&
      (!f.duration || String(i.duration_sec) === f.duration) &&
      (!f.format || i.aspect_ratio === f.format),
  );
  return (
    <div className="flex flex-col gap-8">
      <div role="radiogroup" aria-label={T.filters.type} className="flex flex-wrap justify-center gap-2">
        {[{ value: "", label: T.filters.all }, ...types.map((t) => ({ value: t, label: VIDEO_TYPE_LABEL[t] }))].map((o) => {
          const active = f.type === o.value;
          return (
            <button
              key={o.value || "all"}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setF({ ...f, type: o.value })}
              className={cn(
                "h-11 rounded-full px-5 text-body font-semibold transition-colors",
                active ? "bg-ink text-paper dark:bg-text dark:text-bg" : "bg-surface-1 text-text-2 ring-hairline hover:text-text",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {T.filters.results(shown.length)}
      </p>
      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[28px] bg-surface-1 px-6 py-16 text-center ring-hairline">
          <p className="text-body-lg max-w-xl">{T.filters.empty}</p>
          <Button variant="secondary" onClick={() => setF(EMPTY)}>
            {T.filters.clear}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 items-end gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((t, i) => (
            <li key={t.slug} className={cn(t.aspect_ratio === "16:9" && "col-span-2")}>
              <TemplateCard t={t} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
