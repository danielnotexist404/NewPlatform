import { Languages, PiggyBank, Timer, Wand2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COMPARISON_CLAIMS, LANDING, STARTING_PRICE } from "@/content/he/landing";

const C = LANDING.agency;
const ICONS: Record<string, LucideIcon> = { save: PiggyBank, "no-skill": Wand2, minutes: Timer, hebrew: Languages };

/** The only sourced money anchor (spec §A.4): jett.co.il + bidernet.co.il, 2025. */
const CLAIM = COMPARISON_CLAIMS.find((c) => c.id === "agency-social-management-monthly");
const SOURCES = (CLAIM?.sources ?? []).filter((s) => /jett\.co\.il|bidernet\.co\.il/.test(s.url));
const [LOW, HIGH] = CLAIM?.value_range_ils ?? [1500, 6000];

export function AgencyBenefits() {
  const usPct = Math.max(3, (STARTING_PRICE / HIGH) * 100);
  const lowPct = (LOW / HIGH) * 100;
  return (
    <section id="vs-agency" aria-labelledby="agency-title" className="relative scroll-mt-20 py-10 md:py-16">
      <div className="mx-auto max-w-[1280px] px-2 md:px-4">
        <div className="theme-ink relative isolate overflow-hidden rounded-[36px] bg-bg px-5 py-16 md:px-12 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 inset-x-0 -z-10 mx-auto h-[420px] max-w-4xl rounded-[50%] opacity-70 blur-3xl"
            style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-coral) 40%, transparent), color-mix(in oklab, var(--color-primary) 18%, transparent) 60%, transparent)" }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-[.35]" style={{ maskImage: "radial-gradient(60% 60% at 50% 0%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 0%, #000, transparent)" }} />

          <SectionHeading id="agency-title" eyebrow={C.eyebrow} title={C.title} subtitle={C.subtitle} />

          {/* sourced comparison */}
          <div className="reveal mx-auto mt-12 max-w-3xl rounded-[24px] bg-surface-1/70 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] backdrop-blur md:p-7">
            <dl className="flex flex-col gap-5">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-small text-text-2">{C.compareThem}</dt>
                  <dd className="text-body font-bold text-text">
                    {C.compareThemValue}
                    <a href="#agency-sources" className="ms-0.5 align-super text-micro text-primary-text" aria-label={C.sourcesLabel}>1</a>
                  </dd>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-text-2/30">
                  <span className="block h-full rounded-full bg-text-2/70" style={{ width: `${lowPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-small text-text-2">{C.compareUs}</dt>
                  <dd className="text-body font-bold text-primary-text">{C.compareUsValue}</dd>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-3">
                  <span className="block h-full rounded-full bg-accent-gradient" style={{ width: `${usPct}%` }} />
                </div>
              </div>
            </dl>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.tiles.map((t, i) => {
              const Icon = ICONS[t.key];
              return (
                <li
                  key={t.key}
                  className="reveal group flex items-start gap-4 rounded-[24px] bg-surface-1/70 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] backdrop-blur transition-[translate,background-color] duration-500 hover:-translate-y-1 hover:bg-surface-2/80 sm:block sm:p-6"
                  style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                >
                  <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent-gradient text-ink shadow-[0_8px_20px_-8px_var(--color-coral)]">
                    {Icon && <Icon className="size-5" />}
                  </span>
                  <div>
                    <h3 className="text-h3 text-text sm:mt-5">{t.title}</h3>
                    <p className="mt-1.5 text-small text-text-2">{t.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p id="agency-sources" className="mx-auto mt-10 max-w-3xl text-center text-micro font-normal text-muted">
            <sup>1</sup> {C.footnote} {C.sourcesLabel}:{" "}
            {SOURCES.map((s, i) => (
              <span key={s.url}>
                <a href={s.url} target="_blank" rel="noopener nofollow" className="underline underline-offset-2 hover:text-text">
                  {s.label}
                </a>
                {i < SOURCES.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
