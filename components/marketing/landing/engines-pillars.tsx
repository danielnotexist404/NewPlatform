import { ChartNoAxesColumn, Clapperboard, Flame, Megaphone, PiggyBank, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "./section-heading";
import { LANDING } from "@/content/he/landing";

/** §3.4 EnginesStrip — text wordmarks only, static row (six names or fewer). */
export function EnginesStrip() {
  const T = LANDING.engines;
  return (
    <section id="engines" aria-labelledby="engines-title" className="border-y border-border bg-surface-1/30">
      <div className="container-marketing flex flex-col items-center gap-4 py-8 text-center">
        <h2 id="engines-title" className="text-small max-w-2xl text-text-2">
          {T.line}
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="מנועי AI">
          {T.names.map((n) => (
            <li key={n} lang="en" dir="ltr" className="text-lg font-semibold text-text opacity-60 transition-opacity hover:opacity-100">
              {n}
            </li>
          ))}
        </ul>
        <p className="text-micro max-w-3xl font-normal text-muted">{T.disclaimer}</p>
      </div>
    </section>
  );
}

const PILLAR_ICONS: Record<string, LucideIcon> = { Clapperboard, Megaphone, ChartNoAxesColumn, Flame, PiggyBank };

/** Spec 07–08 §A.2 — the five messaging pillars. */
export function Pillars() {
  const T = LANDING.pillars;
  return (
    <Section id="why" labelledBy="why-title">
      <SectionHeading id="why-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
      <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {T.items.map((p, i) => {
          const Icon = PILLAR_ICONS[p.icon];
          return (
            <li
              key={p.title}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 inset-e-[-30%] size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 light:hidden"
                style={{ background: "color-mix(in oklab, var(--color-primary) 18%, transparent)" }}
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-md bg-surface-3 text-primary-text">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span aria-hidden className="font-display text-4xl leading-none text-text/15">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-text">{p.title}</h3>
              <p className="text-small text-text-2">{p.text}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
