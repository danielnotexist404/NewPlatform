import { Bell, Check, CheckCircle2, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Price } from "@/components/a11y/num";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { reelFromHook } from "@/components/marketing/media/reel-data";
import s from "@/components/marketing/media/media.module.css";
import { CAMPAIGNS } from "@/content/he/campaigns";
import { cn } from "@/lib/utils";

export const floatCard =
  "rounded-[22px] bg-surface-1 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),0_24px_48px_-22px_color-mix(in_oklab,var(--color-ink)_32%,transparent),inset_0_0_0_1px_var(--color-frame)]";

const H = CAMPAIGNS.hero;
const S = CAMPAIGNS.setup;
const L = CAMPAIGNS.leads;
const REEL = reelFromHook("barbers-salons-01", { caption: "box", viewsK: 48.2, sponsored: true, highlight: 1 });

/** Hero: a sponsored reel in a phone + floating "live" and budget cards. */
export function CampaignHeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto flex h-[520px] w-full max-w-[520px] items-center justify-center md:h-[600px]">
      <div className="absolute inset-[8%] rounded-full opacity-80 blur-3xl" style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 40%, transparent), transparent)" }} />
      {REEL && <ReelCard reel={REEL} frame="phone" className="relative w-[230px] md:w-[270px]" decorative />}
      <div className={cn(floatCard, "absolute top-[14%] inset-s-0 flex items-center gap-3 p-3 pe-5 md:inset-s-[-4%]", s.float)}>
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckCircle2 className="size-6" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-body font-bold text-text">{H.live}</span>
          <span className="text-small text-muted">{H.liveSub}</span>
        </span>
      </div>
      <div className={cn(floatCard, "absolute bottom-[12%] inset-e-0 flex flex-col gap-1 p-4 md:inset-e-[-2%]", s.float)} style={{ "--off": "-3s" } as React.CSSProperties}>
        <span className="flex items-center gap-2 text-small font-semibold text-muted">
          <MessageCircle className="size-4 text-success" />
          {H.goal}
        </span>
        <span className="text-h2 font-black text-text">{H.budget}</span>
        <span className="w-fit rounded-full bg-surface-3 px-2 py-0.5 text-micro text-text-2">{H.sample}</span>
      </div>
    </div>
  );
}

/** Step 1: goal + area + budget + publish (paused by default). */
export function SetupVisual() {
  return (
    <div aria-hidden className={cn(floatCard, "mx-auto w-full max-w-[460px] p-6 md:p-7")}>
      <div className="grid grid-cols-2 gap-2">
        {S.goals.map((g, i) => (
          <span key={g} className={cn("flex items-center gap-2 rounded-[14px] px-3.5 py-3 text-small font-semibold", i === 0 ? "bg-primary/12 text-text ring-1 ring-primary/60" : "bg-surface-2 text-text-2")}>
            {i === 0 ? <Check className="size-4 text-primary-text" strokeWidth={3} /> : <span className="size-4 rounded-full ring-1 ring-border-strong" />}
            {g}
          </span>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 text-small font-semibold text-text">
        <MapPin className="size-4 text-primary-text" />
        {S.area}
      </p>
      <p className="mt-5 text-small font-semibold text-muted">{S.budgetLabel}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {S.budgets.map((b) => (
          <span key={b} className={cn("inline-flex h-14 items-center justify-center rounded-[14px] text-h3 font-extrabold", b === 40 ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text-2")}>
            <Price ils={b} />
          </span>
        ))}
      </div>
      <span className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-body font-bold text-paper">
        <Sparkles className="size-4" />
        {S.publish}
      </span>
      <p className="mt-2.5 text-center text-micro font-normal text-muted">{S.paused}</p>
    </div>
  );
}

/** Step 3: leads inbox. */
export function LeadsVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[480px] pt-8">
      <div className={cn(floatCard, "absolute top-0 inset-e-4 z-10 flex items-center gap-3 p-3 pe-5", s.float)}>
        <span className="flex size-9 items-center justify-center rounded-full bg-accent-gradient text-ink">
          <Bell className="size-4" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-small font-bold text-text">{L.toastTitle}</span>
          <span className="text-micro font-normal text-text-2">{L.toastBody}</span>
        </span>
      </div>
      <div className={cn(floatCard, "overflow-hidden")}>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3.5">
          <span className="font-bold text-text">לידים</span>
          <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-micro text-text-2">{L.sampleTag}</span>
        </div>
        <ul className="flex flex-col gap-3 p-4">
          {L.items.map((l, i) => (
            <li key={l.name} className="rounded-[16px] bg-surface-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-surface-3 font-bold text-text-2">{l.name.slice(0, 1)}</span>
                  <div>
                    <p className="font-bold text-text">{l.name}</p>
                    <p className="text-micro font-normal text-muted">{l.time}</p>
                  </div>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-micro", i === 0 ? "bg-accent-gradient text-ink" : "bg-surface-3 text-text-2")}>{l.status}</span>
              </div>
              <p className="mt-3 text-small text-text">&quot;{l.answer}&quot;</p>
              {i === 0 && (
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-small font-semibold text-text">
                    <Phone className="size-3.5" />
                    {L.call}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-small font-semibold text-success">
                    <MessageCircle className="size-3.5" />
                    {L.whatsapp}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
