import { Check, Search, Sparkles } from "lucide-react";
import { reveal } from "@/components/marketing/media/reveal";
import { Section, SectionHeading } from "./section-heading";
import { Price } from "@/components/a11y/num";
import { ReelCard } from "@/components/marketing/media/reel-card";
import s from "@/components/marketing/media/media.module.css";
import { getHook } from "@/lib/data/seed";
import { STEP_REEL } from "@/lib/mock/home";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.how;
const M = C.mock;

const card =
  "rounded-[22px] bg-surface-1 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_24px_48px_-22px_color-mix(in_oklab,var(--color-ink)_30%,transparent),inset_0_0_0_1px_var(--color-frame)]";

function PickVisual() {
  const hooks = [getHook("barbers-salons-01")?.text_he ?? "", getHook("barbers-salons-04")?.text_he ?? ""];
  return (
    <div className={cn(card, "w-[86%] max-w-[330px] p-5")}>
      <div className="flex h-12 items-center gap-2 rounded-full bg-surface-2 px-4 text-body font-semibold text-text ring-hairline">
        <Search className="size-4 text-muted" aria-hidden />
        {M.search}
        <span className={cn("h-5 w-0.5 rounded-full bg-coral", s.blink)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-small">
        {M.niches.map((n, i) => (
          <span
            key={n}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold",
              i === 0 ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text-2",
            )}
          >
            {i === 0 && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
            {n}
          </span>
        ))}
      </div>
      <ul className="mt-5 flex flex-col gap-2 text-small">
        {hooks.map((h, i) => (
          <li
            key={h}
            className={cn(
              "flex items-center gap-2.5 rounded-[14px] px-3.5 py-3",
              i === 0 ? "bg-primary/12 font-semibold text-text ring-1 ring-primary/50" : "text-text-2 ring-1 ring-border",
            )}
          >
            <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-full", i === 0 ? "bg-accent-gradient text-ink" : "ring-1 ring-border-strong")}>
              {i === 0 && <Check className="size-3" strokeWidth={3.5} aria-hidden />}
            </span>
            <span className="truncate">{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoVisual() {
  if (!STEP_REEL) return null;
  return (
    <div className="relative">
      <ReelCard reel={STEP_REEL} frame="phone" className="w-[200px] rotate-[-3deg] md:w-[210px]" decorative />
      <ul className="absolute bottom-8 inset-e-[-34%] flex flex-col gap-2 md:inset-e-[-44%]">
        {M.checklist.map((item, i) => (
          <li
            key={item}
            className={cn(card, "flex items-center gap-2 rounded-full py-2 ps-2 pe-4 text-small font-bold text-text", s.float)}
            style={{ "--off": `${-i * 1.3}s` } as React.CSSProperties}
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-3.5" strokeWidth={3.5} aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CampaignVisual() {
  return (
    <div className={cn(card, "w-[86%] max-w-[330px] p-5")}>
      <p className="text-small font-semibold text-muted">{M.budgetTitle}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {M.budgets.map((b) => (
          <span
            key={b}
            className={cn(
              "inline-flex h-14 items-center justify-center rounded-[14px] text-h3 font-extrabold",
              b === 40 ? "bg-accent-gradient text-ink shadow-[0_10px_22px_-10px_var(--color-coral)]" : "bg-surface-3 text-text-2",
            )}
          >
            <Price ils={b} />
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {M.platforms.map((p) => (
          <span key={p} className="inline-flex flex-1 items-center justify-between rounded-full bg-surface-2 px-3.5 py-2 text-small font-semibold text-text ring-1 ring-border">
            {p}
            <span aria-hidden className="relative h-5 w-9 rounded-full bg-success">
              <span className="absolute inset-y-0.5 inset-e-0.5 size-4 rounded-full bg-paper" />
            </span>
          </span>
        ))}
      </div>
      <span className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-body font-bold text-paper">
        <Sparkles className="size-4" aria-hidden />
        {M.publish}
      </span>
      <p className="mt-2.5 text-center text-micro font-normal text-muted">{M.review}</p>
    </div>
  );
}

const VISUALS = [PickVisual, VideoVisual, CampaignVisual];

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeading id="how-title" title={C.title} subtitle={C.subtitle} />
      <ol className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-8">
        {C.steps.map((step, i) => {
          const Visual = VISUALS[i];
          return (
            <li key={step.title} className={cn(reveal, "flex flex-col")} style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}>
              <div aria-hidden className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-[32px] bg-surface-2 ring-hairline md:h-[440px]">
                <span
                  className="absolute inset-0 bg-dots opacity-50"
                  style={{ maskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)" }}
                />
                <span
                  className="absolute -top-28 inset-s-[-12%] size-80 rounded-full opacity-70 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 34%, transparent), transparent)" }}
                />
                <div className="relative flex w-full justify-center">
                  <Visual />
                </div>
              </div>
              <div className="mt-6 flex items-start gap-4 px-2">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-text text-body font-bold text-bg">
                  <span className="sr-only">{C.stepLabel} </span>
                  <bdi className="num">{i + 1}</bdi>
                </span>
                <div>
                  <h3 className="text-h3 text-text">{step.title}</h3>
                  <p className="mt-1 text-body-lg text-text-2">{step.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
