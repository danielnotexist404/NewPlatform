"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { createHref, saveHeroDraft } from "./create-link";
import { LANDING } from "@/content/he/landing";

const T = LANDING.finalCta;

interface Group { label: string; items: { slug: string; label: string }[] }

/** Compact NichePicker (one native select, grouped by category) + the same CTA behaviour as the hero, src=final_cta. */
export function FinalCtaForm({ groups }: { groups: Group[] }) {
  const router = useRouter();
  const id = React.useId();
  const [niche, setNiche] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  return (
    <>
    <form
      className="mt-2 flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-end"
      data-cta-location="final_cta"
      onSubmit={(e) => {
        e.preventDefault();
        setBusy(true);
        const slug = niche && niche !== "__other" ? niche : null;
        saveHeroDraft({ nicheSlug: slug, url: null, description: null, ts: Date.now() });
        router.push(createHref("final_cta", slug));
      }}
    >
      <div className="flex flex-1 flex-col gap-1.5 text-start">
        <label htmlFor={`${id}-n`} className="text-sm font-semibold text-text light:text-bg">{T.nicheLabel}</label>
        <div className="relative">
          <select
            id={`${id}-n`}
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="h-14 w-full appearance-none rounded-full border border-border-strong bg-surface-2 pe-11 ps-5 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <option value="">{T.nichePlaceholder}</option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((n) => (
                  <option key={n.slug} value={n.slug}>{n.label}</option>
                ))}
              </optgroup>
            ))}
            <option value="__other">{T.other}</option>
          </select>
          <ChevronDown className="pointer-events-none absolute inset-e-4 top-1/2 size-5 -translate-y-1/2 text-text-2" aria-hidden />
        </div>
      </div>
      <Button type="submit" size="xl" loading={busy} className="w-full sm:w-auto">
        {T.cta}
        <DirIcon name="forward" className="size-5" />
      </Button>
    </form>
    <p className="text-micro text-muted light:text-bg/70">{T.ctaNote}</p>
    </>
  );
}
