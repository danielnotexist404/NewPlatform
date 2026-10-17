"use client";
import * as React from "react";
import { RadioGroup as RG } from "radix-ui";
import { Info, Search } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { NicheIcon } from "@/components/video/niche-icon";
import { nicheCategories, niches, getNiche } from "@/lib/data/seed";
import { cn } from "@/lib/utils";

const OTHER = "__other__";
const norm = (s: string) => s.replace(/[״"'׳\s\-:]/g, "").replace(/[֑-ׇ]/g, "").toLowerCase();

/**
 * NichePicker variant="grid" (Part 01 §10.14): search, grouped by category, RadioGroup, compliance note after choice,
 * and the fixed last option "עסק אחר (לא ברשימה)".
 */
export function NicheGrid({
  value,
  onChange,
  other,
  onOtherChange,
  preselectedSlug,
  preselectedLabel,
  labels,
}: {
  value: string | null;
  onChange: (slug: string | null) => void;
  other: string;
  onOtherChange: (v: string) => void;
  preselectedSlug?: string | null;
  preselectedLabel?: string;
  labels: { search: string; other: string; otherLabel: string; complianceTitle: string; complianceTail?: string; noResults: string; groupLabel: string };
}) {
  const [q, setQ] = React.useState("");
  const [isOther, setIsOther] = React.useState(!value && !!other);
  const nq = norm(q);
  const filtered = niches.filter((n) => !nq || norm(n.name_he).includes(nq) || norm(n.name_en).includes(nq));
  const selected = value ? getNiche(value) : null;
  const radioValue = isOther ? OTHER : value ?? "";

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.search} aria-label={labels.search} className="ps-10" type="search" />
      </div>
      <RG.Root
        value={radioValue}
        onValueChange={(v) => {
          if (v === OTHER) { setIsOther(true); onChange(null); }
          else { setIsOther(false); onChange(v); }
        }}
        aria-label={labels.groupLabel}
        className="flex flex-col gap-6"
      >
        {nicheCategories.map((c) => {
          const items = filtered.filter((n) => n.category_slug === c.slug);
          if (items.length === 0) return null;
          return (
            <div key={c.slug} className="flex flex-col gap-2.5">
              <p className="text-micro text-muted">{c.name_he}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {items.map((n) => (
                  <RG.Item
                    key={n.slug}
                    value={n.slug}
                    className="group flex min-h-[72px] items-start gap-2.5 rounded-md bg-surface-1 p-3 text-start shadow-[inset_0_0_0_1px_var(--color-border)] transition-[background-color,box-shadow] hover:bg-surface-2 data-[state=checked]:bg-primary/10 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--color-primary)]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface-3 text-text-2 group-data-[state=checked]:bg-primary group-data-[state=checked]:text-on-primary">
                      <NicheIcon name={n.icon} className="size-[18px]" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-small font-semibold leading-snug">{n.name_he}</span>
                      {preselectedSlug === n.slug && preselectedLabel && (
                        <span className="w-fit rounded-xs bg-lemon px-1.5 py-0.5 text-micro text-on-primary">{preselectedLabel}</span>
                      )}
                    </span>
                  </RG.Item>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-small text-text-2">{labels.noResults}</p>}
        <RG.Item
          value={OTHER}
          className="flex items-center gap-2.5 rounded-md bg-surface-1 p-3 text-start text-small font-semibold shadow-[inset_0_0_0_1px_var(--color-border)] hover:bg-surface-2 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--color-primary)]"
        >
          <span className="flex size-9 items-center justify-center rounded-sm bg-surface-3 text-text-2">?</span>
          {labels.other}
        </RG.Item>
      </RG.Root>

      {isOther && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="niche-other" className="text-sm font-semibold">{labels.otherLabel}</label>
          <Textarea id="niche-other" maxLength={80} value={other} onChange={(e) => onOtherChange(e.target.value)} className="min-h-16" />
        </div>
      )}

      {selected && selected.compliance_flag !== "none" && selected.compliance_note_he && (
        <div role="note" className={cn("flex gap-3 rounded-md bg-lemon/[.08] p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_40%,transparent)]")}>
          <Info className="mt-0.5 size-5 shrink-0 text-primary-text" aria-hidden />
          <div className="flex flex-col gap-1 text-small">
            <p className="font-bold">{labels.complianceTitle}</p>
            <p className="text-text-2">{selected.compliance_note_he}</p>
            {labels.complianceTail && <p className="text-text-2">{labels.complianceTail}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
