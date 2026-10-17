"use client";
import * as React from "react";
import { MessageCircle } from "lucide-react";
import type { CaptionPreset } from "@/lib/mock/landing";
import { CaptionText } from "./reel-tile";
import { useCycle, useInView, useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const B = LANDING.bento;
const PRESETS: CaptionPreset[] = ["bold-pop", "clean-box", "karaoke", "poster", "news", "soft"];

function useActiveCycle(count: number, ms: number) {
  const motion = useMotionAllowed();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const i = useCycle(count, ms, motion && inView);
  return [ref, i] as const;
}

export function CaptionsDemo() {
  const [ref, i] = useActiveCycle(PRESETS.length, 2200);
  const preset = PRESETS[i];
  return (
    <div ref={ref} className="flex h-full flex-col gap-4">
      <div aria-hidden className="kd-reel relative flex min-h-48 flex-1 items-center justify-center overflow-hidden rounded-md bg-black px-6 py-8"
        style={{ backgroundImage: "radial-gradient(60% 70% at 30% 20%, color-mix(in oklab, var(--color-rose) 40%, transparent), transparent 70%), radial-gradient(50% 60% at 80% 90%, color-mix(in oklab, var(--color-violet) 40%, transparent), transparent 70%)" }}
      >
        <div key={preset} className="w-full motion-safe:animate-[kd-fade-up_.35s_var(--ease-out)]">
          <CaptionText text={B.captionSample} preset={preset} />
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5" aria-label={B.presetsLabel}>
        {PRESETS.map((p, pi) => (
          <li key={p} className={cn("rounded-full px-2.5 py-1 text-micro transition-colors", pi === i ? "bg-primary text-on-primary" : "bg-surface-3 text-text-2")}>
            {B.presetNames[p]}
          </li>
        ))}
      </ul>
    </div>
  );
}

const PALETTES = [
  ["var(--color-primary)", "var(--color-on-primary)"],
  ["var(--color-rose)", "var(--color-white)"],
  ["var(--color-violet)", "var(--color-white)"],
] as const;

export function BrandDemo() {
  const [ref, i] = useActiveCycle(PALETTES.length, 1800);
  const [bg, fg] = PALETTES[i];
  const t = B.tiles.brand;
  return (
    <div ref={ref} aria-hidden className="flex flex-1 items-center justify-center">
      <div className="flex aspect-wide w-full max-w-56 flex-col items-center justify-center gap-2 rounded-md transition-colors duration-500" style={{ background: bg, color: fg }}>
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-black/20 text-sm font-extrabold">מ</span>
        <span className="text-sm font-extrabold">{t.endCard}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] font-bold">
          <MessageCircle className="size-3" />
          {t.endCardCta}
        </span>
      </div>
    </div>
  );
}

const FORMATS = [
  { label: "9:16", w: 68 },
  { label: "1:1", w: 120 },
  { label: "16:9", w: 213 },
];

export function FormatsDemo() {
  const [ref, i] = useActiveCycle(FORMATS.length, 1600);
  return (
    <div ref={ref} aria-hidden className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="flex h-[120px] items-center justify-center">
        <div
          className="h-[120px] rounded-sm bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-primary)_55%,var(--color-black)),var(--color-black))] shadow-[inset_0_0_0_1px_var(--color-frame)] transition-[width] duration-500 ease-[var(--ease-out)]"
          style={{ width: FORMATS[i].w }}
        />
      </div>
      <div className="flex gap-1.5">
        {FORMATS.map((f, fi) => (
          <bdi key={f.label} className={cn("num rounded-full px-2 py-0.5 text-micro", fi === i ? "bg-primary text-on-primary" : "bg-surface-3 text-text-2")}>
            {f.label}
          </bdi>
        ))}
      </div>
    </div>
  );
}

export function ScenesDemo() {
  const [ref, i] = useActiveCycle(4, 1400);
  const t = B.tiles.scenes;
  return (
    <div ref={ref} aria-hidden className="flex flex-1 items-center justify-center gap-2">
      {[0, 1, 2, 3].map((n) => (
        <div
          key={n}
          className={cn(
            "flex aspect-reel w-12 flex-col justify-end rounded-sm bg-surface-3 p-1 text-[9px] font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-all duration-300",
            n === i && "-translate-y-2 bg-primary/20 text-primary-text shadow-[inset_0_0_0_2px_var(--color-primary)]",
          )}
        >
          {t.sceneLabel(n + 1)}
        </div>
      ))}
    </div>
  );
}
