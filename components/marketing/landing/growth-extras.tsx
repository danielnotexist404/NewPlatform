import Link from "next/link";
import { Activity, Check, Clock, Globe, MapPin, MessageCircle, Stethoscope } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Section, SectionHeading } from "./section-heading";
import { ReelArt } from "./reel-tile";
import { loginNext } from "./create-link";
import { getHook } from "@/lib/data/seed";
import { LANDING } from "@/content/he/landing";

const T = LANDING.extras;

/** "בדיקת דופק" (spec §S.2, free) + "דף העסק" (spec §S.1/§S.7, paid plans only). */
export function GrowthExtras() {
  return (
    <Section id="extras" labelledBy="extras-title">
      <SectionHeading id="extras-title" eyebrow={T.eyebrow} title={T.title} />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {/* Health check */}
        <article className="relative flex flex-col gap-6 overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
          <div aria-hidden className="pointer-events-none absolute -top-24 inset-e-[-10%] size-72 rounded-full blur-3xl light:hidden" style={{ background: "color-mix(in oklab, var(--color-success) 14%, transparent)" }} />
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-xs bg-success/15 px-2 py-0.5 text-micro text-success">
              <Activity className="size-3.5" aria-hidden />
              {T.health.badge}
            </span>
            <h3 className="text-h3 text-text">{T.health.title}</h3>
            <p className="text-body text-text-2">{T.health.text}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <ul className="flex flex-col gap-2.5">
              {T.health.checks.map((c) => (
                <li key={c} className="flex items-start gap-2 text-small text-text">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            {/* sample report card */}
            <div aria-hidden className="mx-auto flex w-48 flex-col gap-3 rounded-lg bg-surface-2 p-4 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-2)]">
              <div className="flex items-center justify-between">
                <span className="text-micro text-text-2">{T.health.reportTitle}</span>
                <Stethoscope className="size-4 text-success" />
              </div>
              <div className="relative mx-auto size-24">
                <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-surface-3)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-success)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="38" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display text-3xl text-text">
                  <bdi>62</bdi>
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {T.health.reportLines.map((l, i) => (
                  <li key={l} className="flex items-center gap-1.5 text-micro font-normal text-text-2">
                    <span className="size-1.5 rounded-full" style={{ background: i === 0 ? "var(--color-danger)" : i === 1 ? "var(--color-primary)" : "var(--color-success)" }} />
                    {l}
                  </li>
                ))}
              </ul>
              <span className="self-start rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{T.health.reportDemo}</span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link href={loginNext("/app/campaigns/health")} className={buttonVariants({ size: "lg", className: "w-fit" })} data-cta-location="health_check">
              <Activity aria-hidden />
              {T.health.cta}
            </Link>
            <p className="text-micro font-normal text-muted">{T.health.note}</p>
          </div>
        </article>

        {/* Landing page (paid) */}
        <article className="relative flex flex-col gap-6 overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
          <div aria-hidden className="pointer-events-none absolute -top-24 inset-e-[-10%] size-72 rounded-full blur-3xl light:hidden" style={{ background: "color-mix(in oklab, var(--color-violet) 16%, transparent)" }} />
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-xs bg-violet/15 px-2 py-0.5 text-micro text-violet">
              <Globe className="size-3.5" aria-hidden />
              {T.landing.badge}
            </span>
            <h3 className="text-h3 text-text">{T.landing.title}</h3>
            <p className="text-body text-text-2">{T.landing.text}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <ul className="flex flex-col gap-2.5">
              {T.landing.bullets.map((c) => (
                <li key={c} className="flex items-start gap-2 text-small text-text">
                  <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            {/* mini landing page mock */}
            <div aria-hidden className="mx-auto w-48 overflow-hidden rounded-lg bg-bg shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-2)]">
              <ReelArt
                text={getHook("barbers-salons-04")?.text_he ?? ""}
                preset="bold-pop"
                icon="Scissors"
                categorySlug="beauty-grooming"
                aspect="wide"
                chrome={false}
                className="rounded-none"
              />
              <div className="flex flex-col gap-2 p-3">
                <p className="text-sm font-extrabold text-text">{T.landing.mockName}</p>
                <p className="text-[11px] leading-snug text-text-2">{T.landing.mockSub}</p>
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-success/15 px-2 py-1.5 text-[11px] font-bold text-success">
                  <MessageCircle className="size-3" />
                  {T.landing.mockWhatsapp}
                </span>
                <span className="inline-flex items-center justify-center rounded-full px-2 py-1 text-[11px] font-semibold text-text shadow-[inset_0_0_0_1px_var(--color-border-strong)]">
                  {T.landing.mockForm}
                </span>
                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span className="inline-flex items-center gap-1"><Clock className="size-3" />{T.landing.mockHours}</span>
                  <MapPin className="size-3" />
                </div>
                <span className="self-start rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{T.landing.demo}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg", className: "w-fit" })} data-cta-location="landing_pages">
              <Globe aria-hidden />
              {T.landing.cta}
            </Link>
            <p className="text-micro font-normal text-muted">{T.landing.paidNote}</p>
          </div>
        </article>
      </div>
    </Section>
  );
}
