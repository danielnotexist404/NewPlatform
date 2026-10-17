"use client";
import * as React from "react";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import type { CaptionPreset, DemoFormat } from "@/lib/mock/landing";
import { ReelArt } from "./reel-tile";
import { LANDING } from "@/content/he/landing";

const T = LANDING.showcase;

export interface ShowcaseItem {
  id: string;
  title: string;
  onscreen: string;
  format: DemoFormat;
  durationSec: number;
  preset: CaptionPreset;
  nicheLabel: string;
  icon: string;
  categorySlug: string;
}

const ASPECT: Record<DemoFormat, "reel" | "square" | "wide"> = { "9:16": "reel", "1:1": "square", "16:9": "wide" };
const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** ShowcaseGallery (Part 02 §3.10): Appendix D demo items only — every tile is labelled "הדגמה". */
export function ShowcaseGallery({ items }: { items: ShowcaseItem[] }) {
  const [format, setFormat] = React.useState<string>("all");
  const shown = format === "all" ? items : items.filter((i) => i.format === format);
  const [announce, setAnnounce] = React.useState("");
  return (
    <div className="mt-10 flex flex-col gap-6">
      <ToggleGroup
        type="single"
        value={format}
        onValueChange={(v) => {
          if (!v) return;
          setFormat(v);
          const n = v === "all" ? items.length : items.filter((i) => i.format === v).length;
          setAnnounce(T.resultsAnnounce(n));
        }}
        aria-label={T.filterLabel}
        className="w-fit flex-wrap"
      >
        {T.formats.map((f) => (
          <ToggleGroupItem key={f.id} value={f.id}>
            {f.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="sr-only" aria-live="polite">{announce}</p>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>li]:mb-3 sm:[&>li]:mb-4">
        {shown.map((item, i) => (
          <li key={item.id} className="break-inside-avoid">
            <Link
              href="/examples"
              aria-label={T.alt(item.title)}
              className="group block overflow-hidden rounded-md bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_55%,transparent),var(--glow-primary)]"
            >
              <div className="relative">
                <ReelArt
                  text={item.onscreen}
                  preset={item.preset}
                  icon={item.icon}
                  categorySlug={item.categorySlug}
                  nicheLabel={item.nicheLabel}
                  badge={T.demo}
                  aspect={ASPECT[item.format]}
                  variant={i + 1}
                  chrome={item.format === "9:16"}
                  className="rounded-none transition-transform duration-500 group-hover:scale-[1.015]"
                />
                <span className="absolute inset-e-[4%] bottom-[4%] flex gap-1">
                  <bdi className="num rounded-[6px] bg-black/60 px-1.5 py-0.5 text-micro text-white">{fmtDuration(item.durationSec)}</bdi>
                  <bdi className="num rounded-[6px] bg-black/60 px-1.5 py-0.5 text-micro text-white">{item.format}</bdi>
                </span>
              </div>
              <p className="px-3 py-2.5 text-small font-semibold leading-snug text-text sm:px-4 sm:py-3 sm:text-sm">{item.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
