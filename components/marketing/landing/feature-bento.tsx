import {
  BadgeCheck, CalendarClock, Camera, Captions, Coins, Gauge, Inbox, Layers, MessageCircle, Mic, Palette, PhoneCall,
  RotateCcw, ScanLine, ShieldAlert, Sparkles, SquarePen, type LucideIcon,
} from "lucide-react";
import { featuredHooks, getHookType } from "@/lib/data/seed";
import { Section, SectionHeading } from "./section-heading";
import { BrandDemo, CaptionsDemo, FormatsDemo, ScenesDemo } from "./bento-demos";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const B = LANDING.bento;
const T = B.tiles;

function Tile({
  icon: Icon, title, text, className, children, accent = "primary",
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
  children?: React.ReactNode;
  accent?: "primary" | "violet" | "success" | "rose";
}) {
  const accentCls = { primary: "text-primary-text", violet: "text-violet", success: "text-success", rose: "text-rose" }[accent];
  return (
    <li className={cn("group relative flex flex-col gap-4 overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2/70", className)}>
      <div className="flex flex-col gap-2">
        <span className={cn("inline-flex size-9 items-center justify-center rounded-md bg-surface-3", accentCls)}>
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <h3 className="text-lg font-bold leading-snug text-text">{title}</h3>
        <p className="text-small text-text-2">{text}</p>
      </div>
      {children && <div className="mt-auto flex flex-1 flex-col">{children}</div>}
    </li>
  );
}

/** §3.8 FeatureBento — the 8 tiles of Part 02 + leads, publishing, guided filming and hook score (spec §L.5, §S.4). */
export function FeatureBento() {
  const stack = featuredHooks().filter((h) => h.niche_slug && h.placeholders.length === 0).slice(4, 7);
  return (
    <Section id="features" labelledBy="features-title">
      <SectionHeading id="features-title" eyebrow={B.eyebrow} title={B.title} subtitle={B.subtitle} />
      <ul className="mt-12 grid grid-flow-dense gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* 1 · captions 2×2 with a gold beam frame */}
        <Tile icon={Captions} title={T.captions.title} text={T.captions.text} className="md:col-span-2 lg:row-span-2 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent),var(--glow-primary)] light:shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <CaptionsDemo />
        </Tile>

        {/* 4 · hooks 1×2 */}
        <Tile icon={Sparkles} title={T.hooks.title} text={T.hooks.text} className="lg:row-span-2" accent="violet">
          <div aria-hidden className="relative mt-2 flex flex-1 flex-col justify-end gap-2">
            {stack.map((h, i) => (
              <div
                key={h.id}
                className="rounded-md bg-surface-2 p-3 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-2)]"
                style={{ transform: `rotate(${(i - 1) * 1.5}deg)`, opacity: 1 - (2 - i) * 0.18 }}
              >
                <span className="mb-1.5 inline-flex rounded-xs bg-lemon px-1.5 py-0.5 text-micro text-on-primary">{getHookType(h.hook_type_slug)?.name_he}</span>
                <p className="text-sm font-bold leading-snug text-text">{h.text_he}</p>
              </div>
            ))}
          </div>
        </Tile>

        {/* 2 · voice */}
        <Tile icon={Mic} title={T.voice.title} text={T.voice.text}>
          <div aria-hidden dir="ltr" className="flex h-10 items-center gap-[3px] pt-2">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} className="kd-wave w-1 flex-1 rounded-full bg-primary-text/70" style={{ height: `${25 + ((i * 53) % 75)}%`, animationDelay: `${(i % 9) * 0.1}s` }} />
            ))}
          </div>
        </Tile>

        {/* 3 · brand kit */}
        <Tile icon={Palette} title={T.brand.title} text={T.brand.text} accent="rose">
          <BrandDemo />
        </Tile>

        {/* 5 · formats */}
        <Tile icon={Layers} title={T.formats.title} text={T.formats.text}>
          <FormatsDemo />
        </Tile>

        {/* 6 · scenes */}
        <Tile icon={SquarePen} title={T.scenes.title} text={T.scenes.text} accent="violet">
          <ScenesDemo />
        </Tile>

        {/* 7 · transparent credits */}
        <Tile icon={Coins} title={T.credits.title} text={T.credits.text} accent="success">
          <div aria-hidden className="relative flex flex-1 flex-col items-center justify-center gap-3 pt-2">
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-on-primary">
              <Sparkles className="size-4" />
              <bdi>{T.credits.button}</bdi>
            </span>
            <span className="kd-toast inline-flex items-center gap-1.5 rounded-sm bg-surface-3 px-3 py-2 text-micro text-text shadow-[var(--shadow-2)]">
              <RotateCcw className="size-3.5 text-success" />
              {T.credits.toast}
            </span>
          </div>
        </Tile>

        {/* 12 · hook score */}
        <Tile icon={Gauge} title={T.score.title} text={T.score.text} accent="success">
          <div aria-hidden className="flex items-center gap-3 pt-1">
            <div className="relative size-16 shrink-0">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-surface-3)" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-success)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset={97.4 * (1 - T.score.sample / 100)} />
              </svg>
              <bdi className="absolute inset-0 flex items-center justify-center font-display text-2xl text-text">{T.score.sample}</bdi>
            </div>
            <span className="rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{T.score.demo}</span>
          </div>
          <p className="mt-2 text-micro font-normal text-muted">{T.score.caption}</p>
        </Tile>

        {/* 8 · AI label & rules 2×1 */}
        <Tile icon={BadgeCheck} title={T.compliance.title} text={T.compliance.text} className="md:col-span-2" accent="violet">
          <div aria-hidden className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-micro text-white shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <Sparkles className="size-3.5" />
              {T.compliance.aiTag}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-micro text-primary-text">
              <ShieldAlert className="size-3.5" />
              {T.compliance.rulesTag}
            </span>
          </div>
        </Tile>

        {/* 9 · leads 2×1 */}
        <Tile icon={Inbox} title={T.leads.title} text={T.leads.text} className="md:col-span-2" accent="success">
          <div aria-hidden className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-2 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/15 text-sm font-bold text-success">ד</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text">{T.leads.sampleName}</span>
                <span className="text-micro font-normal text-muted">{T.leads.sampleMeta}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-8 items-center gap-1 rounded-full bg-success/15 px-3 text-micro text-success">
                <MessageCircle className="size-3.5" />
                {T.leads.whatsapp}
              </span>
              <span className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-3 px-3 text-micro text-text">
                <PhoneCall className="size-3.5" />
                {T.leads.call}
              </span>
              <span className="rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{T.leads.demo}</span>
            </div>
          </div>
        </Tile>

        {/* 10 · publish & schedule 2×1 */}
        <Tile icon={CalendarClock} title={T.publish.title} text={T.publish.text} className="md:col-span-2">
          <div aria-hidden className="grid grid-cols-7 gap-1.5">
            {T.publish.days.map((d, i) => {
              const slot = T.publish.slots.find((s) => s.day === i);
              return (
                <div key={d} className="flex min-h-16 flex-col gap-1 rounded-sm bg-surface-2 p-1.5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <span className="text-micro text-muted">{d}</span>
                  {slot && (
                    <span className={cn("rounded-[6px] px-1 py-0.5 text-[10px] font-bold leading-tight", slot.label === "קמפיין" ? "bg-violet/20 text-violet" : "bg-primary/20 text-primary-text")}>
                      <bdi>{slot.label}</bdi>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Tile>

        {/* 11 · guided filming 2×1 */}
        <Tile icon={Camera} title={T.guided.title} text={T.guided.text} className="md:col-span-2" accent="rose">
          <div aria-hidden className="flex items-center gap-4">
            <div className="relative aspect-reel w-16 shrink-0 overflow-hidden rounded-sm bg-black shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <div className="absolute inset-[12%] rounded-[4px] border border-dashed border-white/60" />
              <ScanLine className="absolute inset-0 m-auto size-6 text-white/70" />
            </div>
            <p className="text-small text-text">{T.guided.shot}</p>
          </div>
        </Tile>
      </ul>
    </Section>
  );
}
