import { Check, Sparkles } from "lucide-react";
import { PhoneShell, ReelCaption, ReelScene } from "./reel-phone";
import { Section, SectionHeading } from "./section-heading";
import { Num, Price } from "@/components/a11y/num";
import { getHook } from "@/lib/data/seed";
import { DASHBOARD_SAMPLE as D } from "@/lib/mock/landing";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.how;
const M = C.mock;

/** Floating mini-UI card used inside the step mockups. */
function MiniCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-surface-1 p-4 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_18px_40px_-18px_color-mix(in_oklab,var(--color-ink)_28%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-transform duration-500 ease-out group-hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PickMock() {
  const h1 = getHook("barbers-salons-01")?.text_he ?? "";
  const h2 = getHook("barbers-salons-04")?.text_he ?? "";
  return (
    <MiniCard className="w-[86%] max-w-[340px] -rotate-1">
      <p className="text-micro text-muted">{M.nicheQ}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-micro">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-gradient px-2.5 py-1 font-bold text-ink">
          <Check className="size-3" strokeWidth={3} aria-hidden />
          מספרות
        </span>
        <span className="rounded-full bg-surface-3 px-2.5 py-1 font-semibold text-text-2">מסעדות</span>
        <span className="rounded-full bg-surface-3 px-2.5 py-1 font-semibold text-text-2">רופאי שיניים</span>
      </div>
      <p className="mt-4 text-micro text-muted">{M.hooksTitle}</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-small">
        <li className="flex items-center gap-2 rounded-[12px] bg-primary/12 px-3 py-2 font-semibold text-text ring-1 ring-primary/50">
          <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-ink">
            <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
          </span>
          <span className="truncate">{h1}</span>
        </li>
        <li className="flex items-center gap-2 rounded-[12px] px-3 py-2 text-text-2 ring-1 ring-border">
          <span className="size-4 shrink-0 rounded-full ring-1 ring-border-strong" />
          <span className="truncate">{h2}</span>
        </li>
      </ul>
    </MiniCard>
  );
}

function VideoMock() {
  const hook = getHook("restaurants-01")?.text_he ?? "";
  return (
    <div className="flex items-center gap-4">
      <PhoneShell className="w-[112px] shrink-0 rotate-[-4deg] transition-transform duration-500 group-hover:rotate-0">
        <ReelScene scene="cocoa" />
        <div className="absolute inset-0 flex items-center px-[7cqw]">
          <ReelCaption text={hook} style="box" />
        </div>
      </PhoneShell>
      <MiniCard className="w-[190px]">
        <ul className="flex flex-col gap-2 text-micro">
          {M.checklist.map((item) => (
            <li key={item} className="flex items-center gap-2 font-semibold text-text">
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-3.5 flex items-center justify-between text-micro text-muted">
          <span>{M.rendering}</span>
          <span className="num">82%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3" dir="ltr">
          <div className="h-full w-[82%] rounded-full bg-accent-gradient" />
        </div>
      </MiniCard>
    </div>
  );
}

function CampaignMock() {
  return (
    <MiniCard className="w-[86%] max-w-[330px]">
      <div className="flex items-center justify-between">
        <p className="text-micro text-muted">{M.budgetTitle}</p>
        <span className="text-micro text-muted">{M.goal}</span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {M.budgets.map((b) => (
          <span
            key={b}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-[12px] text-body font-bold",
              b === 40 ? "bg-accent-gradient text-ink shadow-[0_6px_16px_-8px_var(--color-coral)]" : "bg-surface-3 text-text-2",
            )}
          >
            <Price ils={b} />
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-1.5">
        {M.platforms.map((p) => (
          <span key={p} className="inline-flex flex-1 items-center justify-between rounded-full bg-surface-2 px-3 py-1.5 text-micro font-semibold text-text ring-1 ring-border">
            {p}
            <span aria-hidden className="relative h-4 w-7 rounded-full bg-success">
              <span className="absolute inset-y-0.5 inset-e-0.5 size-3 rounded-full bg-paper" />
            </span>
          </span>
        ))}
      </div>
      <span className="mt-3 flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink text-small font-bold text-paper">
        <Sparkles className="size-3.5" aria-hidden />
        {M.publish}
      </span>
      <p className="mt-2 text-center text-micro font-normal text-muted">{M.review}</p>
    </MiniCard>
  );
}

function ResultsMock() {
  const K = LANDING.dash.kpis;
  const tiles = [
    { label: K.spend, value: <Price ils={D.spendIls} /> },
    { label: K.reach, value: <Num value={D.reach} /> },
    { label: K.results, value: <Num value={D.results} /> },
    { label: K.cpr, value: <Price ils={D.costPerResultIls} decimals /> },
  ];
  return (
    <div className="relative w-[88%] max-w-[340px]">
      <span className="absolute -top-3 inset-e-3 z-10 rounded-full bg-ink px-2.5 py-1 text-micro text-paper">{M.demo}</span>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t, i) => (
          <MiniCard key={t.label} className={cn("p-3.5", i % 2 === 1 && "group-hover:-translate-y-2")}>
            <p className="text-micro font-normal text-muted">{t.label}</p>
            <p className="mt-1 text-h3 font-extrabold text-text">{t.value}</p>
          </MiniCard>
        ))}
      </div>
    </div>
  );
}

const MOCKS = [PickMock, VideoMock, CampaignMock, ResultsMock];

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeading id="how-title" eyebrow={C.eyebrow} title={C.title} subtitle={C.subtitle} />
      <ol className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
        {C.steps.map((s, i) => {
          const Mock = MOCKS[i];
          return (
            <li
              key={s.title}
              className="reveal group flex flex-col rounded-[28px] bg-surface-1 p-2 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_5%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-[box-shadow,translate] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--color-ink)_22%,transparent),inset_0_0_0_1px_var(--color-frame)]"
              style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
            >
              <div aria-hidden className="relative flex h-[250px] items-center justify-center overflow-hidden rounded-[22px] bg-surface-2 md:h-[280px]">
                <span
                  className="absolute inset-0 bg-dots opacity-50"
                  style={{ maskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)" }}
                />
                <span
                  className="absolute -top-24 inset-s-[-10%] size-72 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent)" }}
                />
                <div className="relative flex w-full justify-center">
                  <Mock />
                </div>
              </div>
              <div className="flex items-start gap-4 px-4 pb-5 pt-5 md:px-6 md:pb-6">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-text text-small font-bold text-bg">
                  <span className="sr-only">{C.stepLabel} </span>
                  <bdi className="num">{i + 1}</bdi>
                </span>
                <div>
                  <h3 className="text-h3 text-text">{s.title}</h3>
                  <p className="mt-1 text-body text-text-2">{s.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
