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
  const niches = Array.from(new Map(items.filter((i) => i.niche_slug).map((i) => [i.niche_slug!, i.nicheName ?? i.niche_slug!])).entries());
  const durations = [15, 30, 45, 60].filter((d) => items.some((i) => i.duration_sec === d));
  const formats = Array.from(new Set(items.map((i) => i.aspect_ratio)));
  const shown = items.filter(
    (i) =>
      (!f.type || i.video_type === f.type) &&
      (!f.niche || (f.niche === "__all" ? i.niche_slug === null : i.niche_slug === f.niche)) &&
      (!f.duration || String(i.duration_sec) === f.duration) &&
      (!f.format || i.aspect_ratio === f.format),
  );
  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label={T.filters.label} className="flex flex-col gap-4 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
        <Chips label={T.filters.type} value={f.type} onChange={(v) => setF({ ...f, type: v })} options={types.map((t) => ({ value: t, label: VIDEO_TYPE_LABEL[t] }))} />
        <Chips
          label={T.filters.niche}
          value={f.niche}
          onChange={(v) => setF({ ...f, niche: v })}
          options={[{ value: "__all", label: T.filters.nicheAll }, ...niches.map(([slug, name]) => ({ value: slug, label: name }))]}
        />
        <div className="flex flex-col gap-4 md:flex-row md:gap-10">
          <Chips label={T.filters.duration} value={f.duration} onChange={(v) => setF({ ...f, duration: v })} options={durations.map((d) => ({ value: String(d), label: T.seconds(d) }))} />
          <Chips label={T.filters.format} value={f.format} onChange={(v) => setF({ ...f, format: v })} options={formats.map((x) => ({ value: x, label: x }))} ltr />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {T.filters.results(shown.length)}
      </p>
      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-1 px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <p className="text-body-lg max-w-xl">{T.filters.empty}</p>
          <Button variant="secondary" onClick={() => setF(EMPTY)}>
            {T.filters.clear}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((t) => (
            <li key={t.slug}>
              <TemplateCard t={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chips({ label, value, options, onChange, ltr }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; ltr?: boolean }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
      <span id={id} className="min-w-20 text-small font-semibold text-text-2">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1.5">
        {[{ value: "", label: T.filters.all }, ...options].map((o) => {
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
              {ltr && o.value ? <bdi dir="ltr">{o.label}</bdi> : o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
