import Link from "next/link";
import { Check, ExternalLink, Percent } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Num, Price } from "@/components/a11y/num";
import { getNiche, hooks, niches, nicheShortName } from "@/lib/data/seed";
import { PLANS } from "@/lib/data/plans";
import { DEMO_EXAMPLES } from "@/lib/mock/landing";
import { Section, SectionHeading } from "./section-heading";
import { ShowcaseGallery, type ShowcaseItem } from "./showcase-gallery";
import { COMPARISON_CLAIMS, LANDING } from "@/content/he/landing";

/** §3.10 ShowcaseGallery section (demo subtitle while any item is a demo). */
export function Showcase() {
  const T = LANDING.showcase;
  const items: ShowcaseItem[] = DEMO_EXAMPLES.flatMap((d) => {
    const n = getNiche(d.nicheSlug);
    if (!n) return [];
    return [{ id: d.id, title: d.titleHe, onscreen: d.onscreenHe, format: d.format, durationSec: d.durationSec, preset: d.preset, nicheLabel: nicheShortName(n), icon: n.icon, categorySlug: n.category_slug }];
  });
  return (
    <Section id="examples" labelledBy="examples-title">
      <SectionHeading id="examples-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitleDemo} />
      <ShowcaseGallery items={items} />
      <Link href="/examples" className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-4" })} data-cta-location="landing_gallery">
        {T.cta}
      </Link>
    </Section>
  );
}

/**
 * §3.11 — Testimonials are NOT rendered (no approved testimonials yet).
 * CountersRow shows only counters that are always true: niches, Hebrew hooks, formats and caption styles.
 */
export function CountersRow() {
  const T = LANDING.counters;
  const nicheCount = niches.length;
  const hookCount = hooks.filter((h) => h.niche_slug !== "local-politics").length;
  const items = [
    { n: nicheCount, label: T.niches(nicheCount) },
    { n: hookCount, label: T.hooks(hookCount) },
    { n: 3, label: T.formats },
    { n: 6, label: T.captionStyles },
  ];
  return (
    <section aria-label={T.label} className="border-y border-border bg-surface-1/40">
      <ul className="container-marketing grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {items.map((c) => (
          <li key={c.label} className="flex flex-col items-center gap-1 text-center">
            <span className="font-display text-6xl leading-none text-text md:text-7xl">
              <Num value={c.n} />
            </span>
            <span className="text-small text-text-2">{c.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** ComparisonBlock (#compare, spec §A.4): like-for-like monthly price, both without ad budget, sourced and dated. */
export function ComparisonBlock() {
  const T = LANDING.compare;
  const agency = COMPARISON_CLAIMS[0];
  const separate = COMPARISON_CLAIMS[1];
  const [min, max] = agency.value_range_ils ?? [0, 0];
  const paid = PLANS.filter((p) => p.id !== "free");
  const allSources = [agency, separate];
  return (
    <Section id="compare" labelledBy="compare-title">
      <SectionHeading id="compare-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <article className="flex flex-col gap-5 rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
          <h3 className="text-h3 text-text">{T.them.title}</h3>
          <p className="flex flex-wrap items-baseline gap-x-2 text-text">
            <span className="text-4xl font-extrabold leading-none text-text-2 md:text-5xl">
              <bdi dir="ltr" className="num">
                <Price ils={min} />–<Price ils={max} />
              </bdi>
            </span>
            <sup>
              <a href="#cmp-1" className="text-sm text-link" aria-label={T.sourceRef(1)}>1</a>
            </sup>
          </p>
          <p className="text-small text-text-2">{T.them.unit}</p>
          <div className="mt-auto flex flex-col gap-2">
            <span className="w-fit rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{T.rangeLabel}</span>
            <p className="text-micro font-normal text-muted">
              {T.budgetNote}
              <sup>
                <a href="#cmp-2" className="ms-0.5 text-link" aria-label={T.sourceRef(2)}>2</a>
              </sup>
            </p>
          </div>
        </article>

        <article className="relative flex flex-col gap-5 overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_50%,transparent),var(--glow-primary)] md:p-8 light:shadow-[inset_0_0_0_2px_var(--color-primary)]">
          <div aria-hidden className="pointer-events-none absolute -top-24 inset-e-[-10%] size-72 rounded-full blur-3xl light:hidden" style={{ background: "color-mix(in oklab, var(--color-primary) 16%, transparent)" }} />
          <h3 className="text-h3 text-text">{T.us.title}</h3>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {paid.map((p, i) => (
              <span key={p.id} className="inline-flex items-baseline gap-3">
                {i > 0 && <span aria-hidden className="text-3xl text-muted">/</span>}
                <span className="text-4xl font-extrabold leading-none text-primary-text md:text-5xl">
                  <Price ils={p.monthlyIls} />
                </span>
              </span>
            ))}
          </p>
          <p className="text-small text-text-2">
            {T.us.unit} · {T.us.plans}
          </p>
          <ul className="flex flex-col gap-2">
            {T.us.includes.map((x, i) => (
              <li key={x} className="flex items-start gap-2 text-small text-text">
                {i === T.us.includes.length - 1 ? <Percent className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden /> : <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />}
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-auto text-micro font-normal text-muted">{T.budgetNote}</p>
        </article>
      </div>
      <p className="mt-6 max-w-3xl text-small text-text-2">{T.honest}</p>
      <div className="mt-6">
        <h3 className="mb-2 text-small font-bold text-text-2">{T.footnotesTitle}</h3>
        <ol className="flex list-decimal flex-col gap-2 ps-5 text-micro font-normal text-muted">
          {allSources.map((c, i) => (
            <li key={c.id} id={`cmp-${i + 1}`} className="scroll-mt-28 leading-relaxed">
              {c.text_he}. {c.note_he}{" "}
              {c.sources.map((s, si) => (
                <span key={s.url}>
                  {si > 0 && " · "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-link underline-offset-2 hover:underline">
                    {s.label}
                    <ExternalLink className="size-3" aria-hidden />
                    <span className="sr-only">{T.newWindow}</span>
                  </a>
                </span>
              ))}
              . {T.checked(T.accessedHe)}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
