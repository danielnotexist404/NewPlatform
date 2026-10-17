import { Check, Download, Link2, Mic, Play, Sparkles } from "lucide-react";
import { ReelArt } from "./reel-tile";
import { LANDING } from "@/content/he/landing";
import { getHook } from "@/lib/data/seed";
import { cn } from "@/lib/utils";

const S = LANDING.how.screens;

function ScreenShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex aspect-reel w-full flex-col gap-3 bg-bg px-4 pb-5 pt-10 text-text", className)}>{children}</div>;
}

export function BrandScreen() {
  return (
    <ScreenShell>
      <div dir="ltr" className="flex items-center gap-2 rounded-full bg-surface-2 px-3 py-2 text-[11px] text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)]">
        <Link2 className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{S.exampleUrl}</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-violet">
        <Sparkles className="size-3.5" aria-hidden />
        <span className="shimmer-ai rounded-full px-2 py-0.5">{S.analyzing}</span>
      </div>
      <div className="flex flex-col gap-3 rounded-md bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <p className="text-[11px] font-semibold text-muted">{S.brandTitle}</p>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-base font-extrabold text-on-primary">מ</span>
          <span className="text-base font-bold">{S.brandName}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {["var(--color-primary)", "var(--color-text)", "var(--color-rose)"].map((c) => (
            <span key={c} className="size-6 rounded-full shadow-[inset_0_0_0_1px_var(--color-frame)]" style={{ background: c }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {S.brandServices.map((x) => (
            <span key={x} className="rounded-xs bg-surface-3 px-2 py-0.5 text-[11px] font-semibold text-text-2">{x}</span>
          ))}
        </div>
      </div>
      <p className="mt-auto text-center text-[11px] text-muted">{S.brandNote}</p>
    </ScreenShell>
  );
}

export function HookScreen() {
  const ids = ["barbers-salons-01", "barbers-salons-04", "barbers-salons-06"];
  return (
    <ScreenShell>
      <p className="text-sm font-bold">{S.hooksTitle}</p>
      <ul className="flex flex-col gap-2">
        {ids.map((id, i) => (
          <li
            key={id}
            className={cn(
              "flex items-start gap-2 rounded-sm bg-surface-1 p-2.5 text-[12px] font-semibold leading-snug shadow-[inset_0_0_0_1px_var(--color-frame)]",
              i === 0 && "shadow-[inset_0_0_0_2px_var(--color-primary)]",
            )}
          >
            <span className={cn("mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full", i === 0 ? "bg-primary text-on-primary" : "bg-surface-3")}>
              {i === 0 && <Check className="size-3" aria-hidden />}
            </span>
            {getHook(id)?.text_he}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-sm bg-surface-1 p-2 text-[11px] font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{S.styleLabel}</div>
        <div className="rounded-sm bg-surface-1 p-2 text-[11px] font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">{S.voiceLabel}</div>
      </div>
      <div className="mt-auto flex items-center gap-2.5 rounded-md bg-surface-1 p-2.5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-on-primary">
          <Play className="size-3.5" aria-hidden />
        </span>
        <div dir="ltr" aria-hidden className="flex h-7 flex-1 items-center gap-[3px]">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="kd-wave w-[3px] flex-1 rounded-full bg-text-2" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.12}s` }} />
          ))}
        </div>
        <Mic className="size-4 text-text-2" aria-hidden />
      </div>
    </ScreenShell>
  );
}

export function DoneScreen() {
  return (
    <div className="relative">
      <ReelArt
        text={getHook("barbers-salons-01")?.text_he ?? ""}
        preset="poster"
        icon="Scissors"
        categorySlug="beauty-grooming"
        nicheLabel={S.doneTitle}
        badge={S.demo}
        className="rounded-none"
      >
        <div className="absolute inset-x-[6%] bottom-[11%] flex justify-center gap-[2cqi]">
          {["9:16", "1:1", "16:9"].map((f) => (
            <span key={f} className="inline-flex items-center gap-[1.4cqi] rounded-full bg-white/90 px-[3cqi] py-[1.6cqi] text-[max(10px,4cqi)] font-bold text-black">
              <Download className="size-[1.1em]" aria-hidden />
              <bdi>{f}</bdi>
            </span>
          ))}
        </div>
      </ReelArt>
    </div>
  );
}

export const HOW_SCREENS = [BrandScreen, HookScreen, DoneScreen];
