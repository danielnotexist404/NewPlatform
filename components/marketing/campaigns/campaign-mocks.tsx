import Link from "next/link";
import {
  Activity, AlertTriangle, Bell, CalendarClock, Check, CheckCircle2, Clock, FileText, Mail, MapPin, MessageCircle, Navigation, Phone, Scissors,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SampleTag, SectionHeading } from "@/components/marketing/gallery/kit";
import { ReelArt } from "@/components/marketing/gallery/reel-art";
import { PhoneFrame } from "@/components/marketing/landing/phone-frame";
import { BUSINESS_PAGE, HEALTH, LEADS, PUBLISHING, WEEKLY } from "@/content/he/campaigns";
import { cn } from "@/lib/utils";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-text-2">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Check aria-hidden className="size-3.5" strokeWidth={3} />
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

const STATUS_TONE = ["bg-primary text-on-primary", "bg-violet/15 text-violet", "bg-success/15 text-success", "bg-surface-3 text-text-2"];

export function LeadsInbox() {
  return (
    <section id="leads" aria-labelledby="leads-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading id="leads-title" eyebrow={LEADS.eyebrow} title={LEADS.h2} subtitle={LEADS.sub} />
          <Bullets items={LEADS.bullets} />
        </div>
        <figure className="relative">
          {/* notification toast */}
          <div aria-hidden className="absolute -top-5 inset-e-4 z-10 flex max-w-[300px] items-start gap-3 rounded-md glass p-3 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)] md:inset-e-[-12px]">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <Bell className="size-4" />
            </span>
            <div>
              <p className="text-small font-bold">{LEADS.notification.title}</p>
              <p className="text-micro font-normal text-text-2">{LEADS.notification.body}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)]">
            <div className="flex items-center gap-3 border-b border-border bg-surface-2/60 px-4 py-3">
              <span className="text-sm font-bold">לידים</span>
              <SampleTag>{LEADS.sampleTag}</SampleTag>
            </div>
            <div className="flex gap-1.5 overflow-x-auto px-4 pt-4" aria-hidden>
              {LEADS.statuses.map((st, i) => (
                <span key={st} className={cn("shrink-0 rounded-full px-3 py-1 text-micro", i === 0 ? "bg-text text-bg" : "bg-surface-2 text-text-2")}>
                  {st}
                </span>
              ))}
            </div>
            <ul className="flex flex-col gap-3 p-4">
              {LEADS.items.map((l) => (
                <li key={l.name} className="rounded-md bg-surface-2/60 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-surface-3 font-bold text-text-2">
                        {l.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-bold">{l.name}</p>
                        <p className="text-micro font-normal text-muted">
                          {l.source} · {l.time}
                        </p>
                      </div>
                    </div>
                    <span className={cn("rounded-xs px-2 py-0.5 text-micro", STATUS_TONE[l.status])}>{LEADS.statuses[l.status]}</span>
                  </div>
                  <p className="mt-3 text-small text-text">&quot;{l.answer}&quot;</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-small font-semibold">
                      <Phone aria-hidden className="size-3.5" />
                      {LEADS.call}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-small font-semibold text-success">
                      <MessageCircle aria-hidden className="size-3.5" />
                      {LEADS.whatsapp}
                    </span>
                    <bdi dir="ltr" className="num ms-auto text-micro font-normal text-muted">
                      {l.phone}
                    </bdi>
                  </div>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 border-t border-border px-4 py-3 text-micro font-normal text-text-2">
              <Clock aria-hidden className="size-3.5 text-primary-text" />
              {LEADS.reminder}
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}

const KIND_TONE: Record<string, string> = {
  post: "bg-primary/15 text-primary-text",
  campaign: "bg-violet/15 text-violet",
  season: "bg-success/15 text-success",
};

export function PublishingCalendar() {
  // A 5-week month starting on Sunday, for illustration.
  const offset = 1;
  const cells = Array.from({ length: 35 }, (_, i) => i - offset + 1);
  return (
    <section id="publishing" aria-labelledby="pub-title" className="relative scroll-mt-20 py-16 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface-1/40" />
      <div className="container-marketing grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <figure className="order-last overflow-hidden rounded-xl bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)] lg:order-first">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <CalendarClock aria-hidden className="size-4 text-primary-text" />
              {PUBLISHING.calendarTitle} · {PUBLISHING.calendarMonth}
            </span>
            <SampleTag>דוגמה</SampleTag>
          </div>
          <div className="p-3 md:p-4" aria-hidden>
            <div className="grid grid-cols-7 gap-1 pb-1 text-center text-micro text-muted">
              {PUBLISHING.weekDays.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                const inMonth = d >= 1 && d <= 31;
                const ev = PUBLISHING.events.find((e) => e.day === d);
                return (
                  <div key={i} className={cn("flex min-h-14 flex-col gap-1 rounded-sm p-1 md:min-h-20 md:p-1.5", inMonth ? "bg-surface-2/60" : "opacity-30")}>
                    <span className="text-[11px] font-semibold text-text-2 num">{inMonth ? d : ""}</span>
                    {ev && (
                      <span className={cn("line-clamp-2 rounded-[4px] px-1 py-0.5 text-[10px] font-semibold leading-tight md:text-[11px]", KIND_TONE[ev.kind])}>
                        {ev.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-micro font-normal text-text-2">
              {PUBLISHING.legend.map((l) => (
                <span key={l.key} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-[3px]", KIND_TONE[l.key])} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </figure>
        <div className="flex flex-col gap-6">
          <SectionHeading id="pub-title" eyebrow={PUBLISHING.eyebrow} title={PUBLISHING.h2} subtitle={PUBLISHING.sub} />
          <Bullets items={PUBLISHING.bullets} />
          <p className="text-small text-muted">{PUBLISHING.igNote}</p>
        </div>
      </div>
    </section>
  );
}

export function HealthCheck() {
  return (
    <section id="health-check" aria-labelledby="health-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading id="health-title" eyebrow={HEALTH.eyebrow} title={HEALTH.h2} subtitle={HEALTH.sub} />
          <div>
            <Link href={`/login?next=${encodeURIComponent("/app/campaigns/health")}`} className={buttonVariants({ size: "lg" })} data-cta-location="campaigns_page">
              <Activity aria-hidden />
              {HEALTH.cta}
            </Link>
          </div>
          <p className="text-small text-muted">{HEALTH.note}</p>
        </div>
        <figure className="overflow-hidden rounded-xl bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)]">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <Activity aria-hidden className="size-4 text-success" />
              {HEALTH.reportTitle}
            </span>
            <SampleTag>{HEALTH.sampleTag}</SampleTag>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {HEALTH.checks.map((c) => (
              <li key={c.text} className="flex items-center gap-3 px-4 py-3.5">
                {c.ok ? (
                  <CheckCircle2 aria-hidden className="size-5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle aria-hidden className="size-5 shrink-0 text-primary-text" />
                )}
                <span className="sr-only">{c.ok ? "תקין:" : "לתיקון:"}</span>
                <span className="flex-1 text-small">{c.text}</span>
                {!c.ok && (
                  <span aria-hidden className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-micro text-text shadow-[inset_0_0_0_1px_var(--color-border-strong)]">
                    {HEALTH.fixLabel}
                    <DirIcon name="forward" className="size-3" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}

export function BusinessPage() {
  const m = BUSINESS_PAGE.mock;
  return (
    <section id="business-page" aria-labelledby="bp-title" className="relative scroll-mt-20 py-16 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface-1/40" />
      <div className="container-marketing grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            id="bp-title"
            eyebrow={
              <>
                {BUSINESS_PAGE.eyebrow}
                <span className="inline-flex items-center gap-1 rounded-full bg-violet/15 px-2 py-0.5 text-violet">
                  <FileText aria-hidden className="size-3" />
                  {BUSINESS_PAGE.paidTag}
                </span>
              </>
            }
            title={BUSINESS_PAGE.h2}
            subtitle={BUSINESS_PAGE.sub}
          />
          <Bullets items={BUSINESS_PAGE.bullets} />
          <p className="rounded-md bg-surface-2 px-4 py-3 text-small text-text">{BUSINESS_PAGE.upsell}</p>
        </div>
        <figure aria-label="דוגמה לדף עסק" className="relative">
          <PhoneFrame className="max-w-[290px]">
            <div className="flex h-[630px] flex-col overflow-hidden bg-bg text-text" aria-hidden>
              <div className="relative">
                <ReelArt tone="gold" icon={Scissors} aspect="16:9" className="rounded-none" />
                <span className="absolute bottom-2 inset-s-2 rounded-xs bg-lemon px-1.5 text-[10px] font-bold text-on-primary">דוגמה</span>
              </div>
              <div className="flex flex-col gap-3 px-4 pt-4">
                <div>
                  <p className="text-lg font-extrabold leading-tight">{m.business}</p>
                  <p className="text-[12px] text-text-2">{m.sub}</p>
                </div>
                <span className="flex items-center justify-center gap-1.5 rounded-full bg-success py-2.5 text-[13px] font-bold text-on-primary">
                  <MessageCircle className="size-4" />
                  {m.whatsapp}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <span className="flex items-center justify-center gap-1 rounded-full bg-surface-2 py-2 text-[12px] font-semibold">
                    <Phone className="size-3.5" /> {m.call}
                  </span>
                  <span className="flex items-center justify-center gap-1 rounded-full bg-surface-2 py-2 text-[12px] font-semibold">
                    <Navigation className="size-3.5" /> {m.waze}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-text-2">
                  <Clock className="size-3.5 text-primary-text" />
                  {m.hours.map((h, i) => (
                    <span key={h.days}>
                      {i > 0 && "· "}
                      {h.days} <bdi dir="ltr" className="num">{h.time}</bdi>
                    </span>
                  ))}
                </p>
                <ul className="flex flex-col divide-y divide-border rounded-sm bg-surface-1 text-[12px]">
                  {m.services.map((s) => (
                    <li key={s.name} className="flex items-center justify-between px-3 py-2">
                      <span className="font-semibold">{s.name}</span>
                      <span className="text-muted">{m.priceFrom}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-sm bg-surface-1 p-3">
                  <p className="text-[12px] font-bold">{m.formTitle}</p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <span className="h-7 rounded-[6px] bg-surface-2 px-2 text-[11px] leading-7 text-muted">{m.formName}</span>
                    <span className="h-7 rounded-[6px] bg-surface-2 px-2 text-[11px] leading-7 text-muted">{m.formPhone}</span>
                    <span className="h-7 rounded-[6px] bg-primary text-center text-[11px] font-bold leading-7 text-on-primary">{m.formSubmit}</span>
                  </div>
                </div>
                <p className="flex items-center gap-1 pb-3 text-[10px] text-muted">
                  <MapPin className="size-3" /> רחוב הדוגמה 1 · הודעת פרטיות
                </p>
              </div>
            </div>
          </PhoneFrame>
        </figure>
      </div>
    </section>
  );
}

export function WeeklySummary() {
  return (
    <section id="weekly" aria-labelledby="weekly-title" className="container-marketing scroll-mt-20 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <figure className="mx-auto w-full max-w-[460px] rounded-xl bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-small font-bold">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-on-primary">
                <Mail aria-hidden className="size-4" />
              </span>
              {WEEKLY.from}
            </span>
            <SampleTag>{WEEKLY.sampleTag}</SampleTag>
          </div>
          <div className="relative rounded-lg rounded-se-xs bg-surface-2 p-4">
            <ul className="flex flex-col gap-2.5 text-small">
              {WEEKLY.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
              <span className="inline-flex items-center gap-1 text-small font-semibold text-link">
                {WEEKLY.link}
                <DirIcon name="forward" className="size-4" />
              </span>
              <span className="text-micro font-normal text-muted">{WEEKLY.time}</span>
            </div>
          </div>
        </figure>
        <SectionHeading id="weekly-title" eyebrow={WEEKLY.eyebrow} title={WEEKLY.h2} subtitle={WEEKLY.sub} className="order-first lg:order-last" />
      </div>
    </section>
  );
}
