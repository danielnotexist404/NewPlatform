"use client";
import * as React from "react";
import Link from "next/link";
import { CircleCheck, MessageCircle, Pause, Phone, Play } from "lucide-react";
import { toast } from "sonner";
import { TrendTile } from "@/components/trends/trend-tile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { LP_PUBLIC } from "@/content/he/landing-pages";
import type { HeroVideo, LandingHours, LeadFormFields } from "@/lib/mock/landing-pages";
import { cn } from "@/lib/utils";

export type PageMode = "public" | "preview";

/** Israeli phone → wa.me / tel: (E.164 without "+"). */
export function e164(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("972")) return d;
  if (d.startsWith("0")) return `972${d.slice(1)}`;
  return d;
}

/** WhatsApp / call buttons. On sample pages and in the editor preview they only explain themselves. */
export function ContactLink({
  kind, phone, prefill, mode, isSample, className, size = "lg", label, iconOnly,
}: {
  kind: "whatsapp" | "call"; phone: string; prefill?: string; mode: PageMode; isSample: boolean;
  className?: string; size?: "md" | "lg"; label?: string; iconOnly?: boolean;
}) {
  const Icon = kind === "whatsapp" ? MessageCircle : Phone;
  const text = label ?? (kind === "whatsapp" ? LP_PUBLIC.whatsappLong : LP_PUBLIC.callLong);
  const href = kind === "whatsapp"
    ? `https://wa.me/${e164(phone)}${prefill ? `?text=${encodeURIComponent(prefill)}` : ""}`
    : `tel:+${e164(phone)}`;
  const inert = mode === "preview" || isSample;
  const cls = cn(
    buttonVariants({ variant: kind === "whatsapp" ? "primary" : "secondary", size: iconOnly ? "icon" : size }),
    className,
  );
  if (!phone.trim()) return null;
  if (inert) {
    return (
      <button type="button" className={cls} aria-label={iconOnly ? text : undefined} onClick={() => toast(mode === "preview" ? LP_PUBLIC.previewToast : LP_PUBLIC.sampleToast)}>
        <Icon aria-hidden />
        {!iconOnly && text}
      </button>
    );
  }
  return (
    <a href={href} target={kind === "whatsapp" ? "_blank" : undefined} rel={kind === "whatsapp" ? "noopener" : undefined} className={cls} aria-label={iconOnly ? text : undefined}>
      <Icon aria-hidden />
      {!iconOnly && text}
    </a>
  );
}

/** Hero video (mock playback: the poster is CSS art; the progress bar runs for the video's length). */
export function HeroVideoPlayer({ video, nicheIcon, className }: { video: HeroVideo; nicheIcon?: string; className?: string }) {
  const [playing, setPlaying] = React.useState(false);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPlaying(false), video.durationSec * 1000);
    return () => clearTimeout(t);
  }, [playing, run, video.durationSec]);
  return (
    <div className={cn("relative", className)}>
      <TrendTile art={video.art} tone={video.tone} text={video.hookHe} nicheIcon={nicheIcon} durationSec={video.durationSec} size="lg" controls={false} className="rounded-lg" />
      <button
        type="button"
        onClick={() => { setPlaying((p) => !p); setRun((r) => r + 1); }}
        aria-label={playing ? LP_PUBLIC.pause : LP_PUBLIC.play}
        aria-pressed={playing}
        className="group absolute inset-0 z-40 flex items-end justify-center rounded-lg pb-[16%] focus-visible:outline-offset-4"
      >
        <span className={cn("flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-[0_8px_30px_rgb(0_0_0/.45)] transition-transform group-hover:scale-105", playing && "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")}>
          {playing ? <Pause className="size-7" fill="currentColor" aria-hidden /> : <Play className="size-7 translate-x-0.5" fill="currentColor" aria-hidden />}
        </span>
      </button>
      <div dir="ltr" className="pointer-events-none absolute inset-x-3 bottom-3 z-40 h-1 overflow-hidden rounded-full bg-white/25">
        <span
          key={run}
          className="block h-full rounded-full bg-white"
          style={{ width: playing ? "100%" : "0%", transition: playing ? `width ${video.durationSec}s linear` : "none" }}
        />
      </div>
    </div>
  );
}

// ---------- open now ----------
const DAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + (m || 0); };

function computeOpen(hours: LandingHours[]): "open" | "closed" {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const day = DAY[parts.find((p) => p.type === "weekday")?.value ?? "Sun"] ?? 0;
  const now = toMin(`${parts.find((p) => p.type === "hour")?.value ?? "0"}:${parts.find((p) => p.type === "minute")?.value ?? "0"}`);
  for (const h of hours) {
    if (!h.open || !h.close) continue;
    const o = toMin(h.open), c = toMin(h.close);
    if (h.days.includes(day) && (c > o ? now >= o && now < c : now >= o)) return "open";
    const prev = (day + 6) % 7;
    if (c <= o && h.days.includes(prev) && now < c) return "open";
  }
  return "closed";
}

const minuteTick = (cb: () => void) => { const t = setInterval(cb, 60_000); return () => clearInterval(t); };

/** "פתוח עכשיו" by Asia/Jerusalem time — client only (no clock during prerender). */
export function OpenNowBadge({ hours }: { hours: LandingHours[] }) {
  const key = JSON.stringify(hours);
  const status = React.useSyncExternalStore(minuteTick, () => computeOpen(JSON.parse(key) as LandingHours[]), () => null);
  if (!status) return null;
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-micro", status === "open" ? "bg-success/15 text-success" : "bg-surface-3 text-text-2")}>
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "open" ? "bg-success" : "bg-text-2")} />
      {status === "open" ? LP_PUBLIC.openNow : LP_PUBLIC.closedNow}
    </span>
  );
}

// ---------- lead form ----------
const F = LP_PUBLIC.form;
const isIsraeliPhone = (v: string) => /^(?:0(?:5\d|[2-489]|7\d)\d{7}|9725\d{8}|972[2-489]\d{7})$/.test(v.replace(/[\s-]/g, "").replace(/^\+/, ""));

export function LeadForm({
  fields, submitLabel, slug, mode, isSample, idPrefix = "lead",
}: { fields: LeadFormFields; submitLabel: string; slug: string; mode: PageMode; isSample: boolean; idPrefix?: string }) {
  const [v, setV] = React.useState({ name: "", phone: "", email: "", message: "", time: "", consent: false, marketing: false, company: "" });
  const [errors, setErrors] = React.useState<Partial<Record<"name" | "phone" | "email" | "consent", string>>>({});
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const id = (k: string) => `${idPrefix}-${k}`;
  const successRef = React.useRef<HTMLDivElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "preview") {
      toast(LP_PUBLIC.previewToast);
      return;
    }
    const next: typeof errors = {};
    if (v.name.trim().length < 2) next.name = F.errors.name;
    if (!isIsraeliPhone(v.phone)) next.phone = F.errors.phone;
    if (fields.email && v.email && !/^\S+@\S+\.\S+$/.test(v.email)) next.email = F.errors.email;
    if (!v.consent) next.consent = F.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(id(first))?.focus();
      return;
    }
    if (v.company) return; // honeypot
    setState("sending");
    setTimeout(() => {
      setState("sent");
      requestAnimationFrame(() => successRef.current?.focus());
    }, 700);
  }

  if (state === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-center gap-3 rounded-md bg-success/10 px-5 py-8 text-center outline-none">
        <CircleCheck aria-hidden className="size-10 text-success" />
        <p className="text-[1.375rem] font-bold">{F.successTitle}</p>
        <p className="text-text-2">{F.successBody}</p>
        {isSample && <p className="text-small text-muted">{F.successSample}</p>}
        <Button variant="ghost" size="sm" onClick={() => { setV({ name: "", phone: "", email: "", message: "", time: "", consent: false, marketing: false, company: "" }); setState("idle"); }}>
          {F.again}
        </Button>
      </div>
    );
  }

  const err = (k: keyof typeof errors) => errors[k] ? { "aria-invalid": true as const, "aria-describedby": id(`${k}-err`) } : {};
  const errorText = (k: keyof typeof errors) => errors[k] ? <p id={id(`${k}-err`)} role="alert" className="text-small text-danger">{errors[k]}</p> : null;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 @xl:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("name")} className="text-sm font-semibold">{F.name}</label>
          <Input id={id("name")} autoComplete="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} {...err("name")} />
          {errorText("name")}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("phone")} className="text-sm font-semibold">{F.phone}</label>
          <LtrInput id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} {...err("phone")} />
          {errorText("phone")}
        </div>
      </div>
      {fields.email && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("email")} className="text-sm font-semibold">{F.email} <span className="font-normal text-muted">(רשות)</span></label>
          <LtrInput id={id("email")} type="email" autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} {...err("email")} />
          {errorText("email")}
        </div>
      )}
      {fields.preferredTime && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm font-semibold">{F.time} <span className="font-normal text-muted">(רשות)</span></legend>
          <div className="flex flex-wrap gap-2">
            {F.timeOptions.map((o) => (
              <label key={o} className={cn("cursor-pointer rounded-full px-3.5 py-1.5 text-sm shadow-[inset_0_0_0_1px_var(--color-border-strong)] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus", v.time === o ? "bg-primary text-on-primary shadow-none" : "hover:bg-surface-2")}>
                <input type="radio" name={id("time")} value={o} checked={v.time === o} onChange={() => setV({ ...v, time: o })} className="sr-only" />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {fields.message && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("message")} className="text-sm font-semibold">{F.message} <span className="font-normal text-muted">(רשות)</span></label>
          <Textarea id={id("message")} rows={3} maxLength={1000} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
        </div>
      )}
      <div aria-hidden className="absolute -z-10 size-px overflow-hidden opacity-0">
        <label htmlFor={id("company")}>company</label>
        <input id={id("company")} tabIndex={-1} autoComplete="off" value={v.company} onChange={(e) => setV({ ...v, company: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-2.5 text-small">
          <input id={id("consent")} type="checkbox" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} className="mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]" {...err("consent")} />
          <span>
            {F.consent}{" "}
            <Link href={`/b/${slug}/privacy`} className="text-link underline underline-offset-2" target={mode === "preview" ? "_blank" : undefined}>{F.privacy}</Link>
          </span>
        </label>
        {errorText("consent")}
        <label className="flex cursor-pointer items-start gap-2.5 text-small text-text-2">
          <input type="checkbox" checked={v.marketing} onChange={(e) => setV({ ...v, marketing: e.target.checked })} className="mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]" />
          <span>{F.marketing}</span>
        </label>
      </div>
      <Button type="submit" size="lg" loading={state === "sending"} className="w-full @xl:w-auto @xl:self-start">
        {state === "sending" ? F.sending : submitLabel}
      </Button>
    </form>
  );
}
