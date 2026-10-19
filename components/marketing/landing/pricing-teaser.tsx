import Link from "next/link";
import { reveal } from "@/components/marketing/media/reveal";
import { Check } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { loginNext } from "./create-link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, ctaArrow, inkCta } from "@/components/layout/cta-styles";
import { PLANS, type Plan } from "@/lib/data/plans";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.pricing;
const nf = new Intl.NumberFormat("he-IL");
const PAID = PLANS.filter((p) => p.id !== "free");

function PlanCard({ plan }: { plan: Plan }) {
  const featured = plan.badgeHe === C.recommended;
  const features = C.features[plan.id] ?? plan.featuresHe.slice(0, 4);
  return (
    <li
      className={cn(
        reveal, "relative flex flex-col rounded-[32px] p-px",
        featured ? "bg-accent-gradient shadow-[0_40px_80px_-36px_color-mix(in_oklab,var(--color-coral)_70%,transparent)] lg:-my-5" : "bg-border",
      )}
    >
      <div className={cn("flex h-full flex-col rounded-[31px] bg-surface-1 p-7 md:p-9", featured && "lg:py-12")}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-h2 font-extrabold text-text">{plan.nameHe}</h3>
          {featured && <span className="rounded-full bg-accent-gradient px-3 py-1 text-small font-bold text-ink">{plan.badgeHe}</span>}
        </div>
        <p className="mt-6 flex items-baseline gap-2">
          <span className="text-[3.75rem] font-black leading-none text-text">
            <bdi className="num">₪{nf.format(plan.monthlyIls)}</bdi>
          </span>
          <span className="text-body text-muted">{C.perMonth}</span>
        </p>
        {plan.annualMonthlyIls && <p className="mt-2 text-small text-muted">{C.annual(plan.annualMonthlyIls)}</p>}
        <ul className="mt-8 flex flex-col gap-3.5 text-body text-text">
          {features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span aria-hidden className={cn("mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full", featured ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text")}>
                <Check className="size-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={loginNext(`/app/billing/plans?plan=${plan.id}&cycle=monthly`)}
          className={cn(featured ? accentCta : cn(inkCta, "dark:bg-text dark:text-bg"), "mt-auto h-14 w-full text-base")}
          style={{ marginTop: "2.5rem" }}
        >
          {C.cta(plan.nameHe)}
          <DirIcon name="forward" className={ctaArrow} />
        </Link>
      </div>
    </li>
  );
}

export function PricingTeaser() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative scroll-mt-20 py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 mx-auto h-[60%] max-w-5xl rounded-[50%] opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent)" }}
      />
      <div className="container-marketing">
        <SectionHeading id="pricing-title" title={C.title} subtitle={C.subtitle} />
        <ul className="mx-auto mt-16 grid max-w-[1100px] items-stretch gap-6 lg:mt-20 lg:grid-cols-3">
          {PAID.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </ul>
        <div className="mt-12 flex flex-col items-center gap-2 text-center">
          <p className="text-body text-muted">{C.note}</p>
          <Link href="/pricing" className="group inline-flex items-center gap-1.5 text-body font-semibold text-primary-text hover:underline">
            {C.all}
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
