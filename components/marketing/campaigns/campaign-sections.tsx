import Link from "next/link";
import {
  Ban, BadgePercent, Check, ClipboardList, Eye, FileClock, Globe, Info, Lock, MapPin, MessageCircle, PauseCircle, Scissors, ShieldCheck, Trophy,
  type LucideIcon,
} from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SampleTag, SectionHeading } from "@/components/marketing/gallery/kit";
import { ReelArt, ArtChip } from "@/components/marketing/gallery/reel-art";
import { CampaignStatusTimeline } from "@/components/campaigns/status-timeline";
import { BUILDER, GOALS, GUARDRAILS, HONESTY, MONEY, SPLIT_TEST } from "@/content/he/campaigns";
import { getHook } from "@/lib/data/seed";
import { cn } from "@/lib/utils";

const GOAL_ICON: Record<string, LucideIcon> = { whatsapp: MessageCircle, lead_form: ClipboardList, traffic: Globe, awareness: Eye };

export function GoalsGrid() {
  return (
    <section id="goals" aria-labelledby="goals-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <SectionHeading id="goals-title" eyebrow={GOALS.eyebrow} title={GOALS.h2} subtitle={GOALS.sub} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {GOALS.items.map((g, i) => {
          const Icon = GOAL_ICON[g.key];
          return (
            <li
              key={g.key}
              className={cn(
                "flex flex-col gap-3 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]",
                i === 0 && "shadow-[inset_0_0_0_1.5px_var(--color-primary)]",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("flex size-12 items-center justify-center rounded-full", i === 0 ? "bg-primary text-on-primary glow-primary" : "bg-surface-3 text-primary-text")}>
                  <Icon aria-hidden className="size-5" />
                </span>
                {i === 0 && <span className="rounded-full bg-primary/15 px-2.5 py-1 text-micro text-primary-text">ברירת מחדל לנותני שירות</span>}
              </div>
              <h3 className="text-h3">{g.title}</h3>
              <p className="text-small text-text-2">{g.body}</p>
              <p className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm bg-surface-2 px-2.5 py-1 text-micro text-text">{g.metric}</p>
              <p className="text-micro font-normal text-muted">{g.needs}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StepMock({ k }: { k: string }) {
  const step = BUILDER.steps.find((s) => s.key === k)!;
  if (k === "goal")
    return (
      <div className="grid grid-cols-2 gap-2">
        {GOALS.items.map((g, i) => {
          const Icon = GOAL_ICON[g.key];
          return (
            <span key={g.key} className={cn("flex items-center gap-2 rounded-sm px-3 py-2.5 text-small font-semibold", i === 0 ? "bg-primary/15 text-text shadow-[inset_0_0_0_1.5px_var(--color-primary)]" : "bg-surface-2 text-text-2")}>
              <Icon aria-hidden className={cn("size-4", i === 0 ? "text-primary-text" : "text-muted")} />
              {g.title}
            </span>
          );
        })}
      </div>
    );
  if (k === "area" && "radius" in step)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-small text-text-2">
          <MapPin aria-hidden className="size-4 text-violet" /> סביב העסק
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(step.radius ?? []).map((r) => (
            <span key={r} className={cn("rounded-full px-3 py-1.5 text-small font-semibold", r === "5" ? "bg-primary text-on-primary" : "bg-surface-2 text-text-2 shadow-[inset_0_0_0_1px_var(--color-border-strong)]")}>
              <bdi className="num">{r}</bdi> {step.radiusUnit}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3 py-2.5">
          <span className="text-small">{step.audienceSwitch}</span>
          <span aria-hidden className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-primary">
            <span className="absolute inset-e-0.5 size-5 rounded-full bg-on-primary" />
          </span>
        </div>
      </div>
    );
  if (k === "budget" && "presets" in step)
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-1.5">
          {(step.presets ?? []).map((p) => (
            <span key={p} className={cn("flex flex-col items-center rounded-sm py-2 text-small font-bold", p === step.recommended ? "bg-primary text-on-primary" : "bg-surface-2 text-text")}>
              <bdi className="num">₪{p}</bdi>
              {p === step.recommended && <span className="text-[10px] font-semibold">{step.recommendedLabel}</span>}
            </span>
          ))}
        </div>
        <p className="text-small font-semibold">{step.monthly?.("₪1,200")}</p>
        <p className="text-micro font-normal text-muted">{step.honest}</p>
        <p className="flex items-start gap-2 rounded-sm bg-success/10 px-3 py-2 text-micro text-success">
          <BadgePercent aria-hidden className="mt-0.5 size-4 shrink-0" />
          {step.moneyBadge}
        </p>
      </div>
    );
  if (k === "review" && "confirm" in step)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-1.5">
          {["A", "B", "C"].map((x, i) => (
            <span key={x} className="relative w-1/3">
              <ReelArt tone={i === 0 ? "gold" : i === 1 ? "violet" : "rose"} icon={Scissors} size="sm" className="aspect-[4/5]" />
              <span className="absolute inset-s-1.5 top-1.5 rounded-xs bg-black/60 px-1.5 text-[11px] font-bold text-white">{x}</span>
            </span>
          ))}
        </div>
        <p className="flex items-start gap-2 text-micro">
          <span aria-hidden className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-primary text-on-primary">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {step.confirm}
        </p>
        <div className="flex gap-2">
          <span className="flex-1 rounded-full bg-surface-2 py-2 text-center text-small font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-border-strong)]">{step.prepare}</span>
          <span className="flex-1 rounded-full bg-primary py-2 text-center text-small font-semibold text-on-primary">{step.publish}</span>
        </div>
      </div>
    );
  return null;
}

export function BuilderSteps() {
  return (
    <section id="builder" aria-labelledby="builder-title" className="relative scroll-mt-20 py-16 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface-1/40" />
      <div className="container-marketing">
        <SectionHeading id="builder-title" eyebrow={BUILDER.eyebrow} title={BUILDER.h2} subtitle={BUILDER.sub} />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {BUILDER.steps.map((s) => (
            <li key={s.key} className="flex flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-on-primary num">{s.n}</span>
                <h3 className="text-h3">{s.title}</h3>
              </div>
              <p className="text-small text-text-2">{s.body}</p>
              <div aria-hidden className="mt-auto rounded-md bg-bg/60 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <StepMock k={s.key} />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-6 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h3 className="text-h3">{BUILDER.timelineTitle}</h3>
            <p className="mt-2 text-text-2">{BUILDER.timelineNote}</p>
            <p className="mt-3 flex items-center gap-2 text-small font-semibold text-text">
              <PauseCircle aria-hidden className="size-4 text-primary-text" />
              {BUILDER.pausedNote}
            </p>
          </div>
          <CampaignStatusTimeline
            steps={BUILDER.timeline.map((label, i) => ({ label, state: i < 2 ? "done" : i === 2 ? "current" : "todo" }))}
          />
        </div>
      </div>
    </section>
  );
}

export function SplitTest() {
  return (
    <section id="split-test" aria-labelledby="split-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading id="split-title" eyebrow={SPLIT_TEST.eyebrow} title={SPLIT_TEST.h2} subtitle={SPLIT_TEST.sub} />
          <div className="flex gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-violet" />
            <div>
              <h3 className="font-bold">{SPLIT_TEST.differentTitle}</h3>
              <p className="mt-1 text-small text-text-2">{SPLIT_TEST.differentBody}</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <FileClock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-text" />
            <div>
              <h3 className="font-bold">{SPLIT_TEST.earlyTitle}</h3>
              <p className="mt-1 text-small text-text-2">{SPLIT_TEST.earlyBody}</p>
            </div>
          </div>
        </div>

        <figure className="rounded-xl bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-small font-bold">תור פנוי השבוע · 3 מודעות</span>
            <SampleTag>{SPLIT_TEST.sampleTag}</SampleTag>
          </div>
          <ul className="grid grid-cols-3 gap-2 md:gap-3">
            {SPLIT_TEST.rows.map((r, i) => {
              const hook = getHook(r.hookId);
              const lead = i === 0;
              return (
                <li key={r.key} className="flex flex-col gap-2">
                  <div className={cn("relative rounded-md", lead && "glow-primary")}>
                    <ReelArt tone={r.tone} icon={Scissors} hook={hook?.text_he} size="sm" topStart={<ArtChip>הוק {r.key}</ArtChip>} />
                    {lead && (
                      <span className="absolute -top-2.5 inset-x-0 mx-auto flex w-fit items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary">
                        <Trophy aria-hidden className="size-3" />
                        {SPLIT_TEST.winnerTag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-0.5">
                    <div className="flex items-center justify-between text-micro">
                      <span className="text-muted">{SPLIT_TEST.stopLabel}</span>
                      <bdi className="num font-bold">{r.stopPct}%</bdi>
                    </div>
                    <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                      <span className={cn("block h-full rounded-full", lead ? "bg-primary" : "bg-text-2/60")} style={{ width: `${r.stopPct * 2.5}%` }} />
                    </span>
                    <p className="text-micro text-text-2">
                      <bdi className="num font-bold text-text">{r.results}</bdi> {SPLIT_TEST.resultsLabel}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <figcaption className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-small text-text-2">{SPLIT_TEST.boostBody}</p>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
              <Trophy aria-hidden className="size-4" />
              {SPLIT_TEST.boost}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function MoneyFlow() {
  return (
    <section id="who-pays" aria-labelledby="money-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <div className="relative isolate overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-12">
        <div aria-hidden className="absolute -z-10 inset-s-[-10%] top-[-30%] size-[520px] rounded-full bg-primary/10 blur-3xl light:hidden" />
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeading id="money-title" eyebrow={MONEY.eyebrow} title={MONEY.h2} subtitle={MONEY.sub} />
          <div className="flex flex-col gap-4" aria-hidden>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-md bg-surface-2 p-4 text-center">
                <p className="text-micro text-muted">{MONEY.you}</p>
                <p className="text-h3">העסק שלכם</p>
              </div>
              <DirIcon name="forward" className="size-6 text-primary-text" />
              <div className="rounded-md bg-surface-2 p-4 text-center">
                <p className="text-micro text-muted">פייסבוק ואינסטגרם</p>
                <p className="text-h3">{MONEY.meta}</p>
              </div>
            </div>
            <p className="-mt-1 text-center text-small text-text-2">{MONEY.toMeta}</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-md bg-surface-2 p-4 text-center">
                <p className="text-micro text-muted">{MONEY.you}</p>
                <p className="text-h3">העסק שלכם</p>
              </div>
              <DirIcon name="forward" className="size-6 text-violet" />
              <div className="rounded-md bg-surface-2 p-4 text-center">
                <p className="text-micro text-muted">התוכנה</p>
                <p className="text-h3">{MONEY.us}</p>
              </div>
            </div>
            <p className="-mt-1 text-center text-small text-text-2">{MONEY.toUs}</p>
            <div className="mt-2 flex items-center justify-center gap-4 rounded-md bg-primary/10 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]">
              <span className="font-display text-[72px] leading-none text-primary-text num">{MONEY.zero}</span>
              <span className="text-h3">{MONEY.zeroLabel}</span>
            </div>
          </div>
        </div>
        <p className="sr-only">
          {MONEY.toMeta}. {MONEY.toUs}. {MONEY.zero} {MONEY.zeroLabel}.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {MONEY.facts.map((f) => (
            <li key={f.title} className="border-s-2 border-primary ps-4">
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1 text-small text-text-2">{f.body}</p>
            </li>
          ))}
        </ul>
        <Link href="/pricing" className="mt-8 inline-flex items-center gap-1 font-semibold text-primary-text underline-offset-4 hover:underline">
          {MONEY.pricingLink}
          <DirIcon name="forward" className="size-4" />
        </Link>
      </div>
    </section>
  );
}

const GUARD_ICONS: LucideIcon[] = [PauseCircle, ShieldCheck, Ban, FileClock, Lock, Ban];

export function Guardrails() {
  return (
    <section id="guardrails" aria-labelledby="guard-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <SectionHeading id="guard-title" eyebrow={GUARDRAILS.eyebrow} title={GUARDRAILS.h2} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUARDRAILS.items.map((g, i) => {
          const Icon = GUARD_ICONS[i] ?? ShieldCheck;
          return (
            <li key={g.title} className="flex gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Icon aria-hidden className="size-5" />
              </span>
              <div>
                <h3 className="font-bold">{g.title}</h3>
                <p className="mt-1 text-small text-text-2">{g.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 rounded-lg bg-surface-2/60 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6">
        <h3 className="font-bold">{HONESTY.title}</h3>
        <ul className="mt-3 flex flex-col gap-2 text-small text-text-2">
          {HONESTY.items.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

