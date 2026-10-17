import Link from "next/link";
import { AlertTriangle, BatteryLow, Camera, Check, Flame, Sparkles, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Section, SectionHeading } from "./section-heading";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const T = LANDING.trends;
type Item = (typeof T.items)[number];

function Frame({ children, tone, className }: { children: React.ReactNode; tone: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("kd-reel frame-tile relative aspect-reel w-full overflow-hidden bg-black text-white", className)}
      style={{ backgroundImage: `radial-gradient(80% 50% at 50% 0%, color-mix(in oklab, ${tone} 45%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, ${tone} 14%, var(--color-black)), var(--color-black))` }}
    >
      {children}
      <span className="absolute inset-s-[5%] bottom-[4%] rounded-[6px] bg-black/60 px-[2.6cqi] py-[0.9cqi] text-[max(10px,4.6cqi)] font-semibold text-white/90">{T.demo}</span>
    </div>
  );
}

/** T1 — bait clip, hard cut, deadpan sign (Hebrew composited onto a blank sheet). */
function SignDemo({ text }: { text: string }) {
  return (
    <Frame tone="var(--color-primary)">
      <div className="absolute inset-x-0 top-0 h-[34%] overflow-hidden border-b-2 border-dashed border-white/30">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,color-mix(in_oklab,var(--color-white)_10%,transparent)_0_6px,transparent_6px_18px)] blur-[1px]" />
        <span className="absolute inset-s-[6%] top-[14%] rounded-full bg-black/50 px-[3cqi] py-[1cqi] text-[max(9px,4.2cqi)] font-bold">{T.t1Bait}</span>
      </div>
      <span className="absolute inset-x-0 top-[31%] mx-auto w-fit rounded-full bg-white px-[3cqi] py-[0.6cqi] text-[max(9px,4cqi)] font-extrabold text-black">{T.t1Cut}</span>
      {/* person silhouette */}
      <div className="absolute bottom-[10%] inset-x-0 mx-auto h-[46%] w-[70%]">
        <div className="absolute inset-x-0 top-0 mx-auto size-[28cqi] rounded-full bg-white/15" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-[60%] w-full rounded-t-[40%] bg-white/10" />
        <div className="absolute inset-x-[4%] top-[34%] [perspective:300px]">
          <div className="flex aspect-[4/3] items-center justify-center rounded-[3px] bg-white p-[4cqi] shadow-[0_8px_20px_var(--color-black)] [transform:rotateX(8deg)_rotateZ(-3deg)]">
            <p className="kd-sign text-center text-[9.5cqi]">{text}</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** T2 — wide static behind-the-scenes shot with a persistent label. */
function BtsDemo() {
  return (
    <Frame tone="var(--color-violet)">
      <span className="absolute inset-x-0 top-[7%] mx-auto w-fit rounded-full bg-white px-[4cqi] py-[1.4cqi] text-[max(10px,5cqi)] font-extrabold text-black">{T.t2Label}</span>
      <div className="absolute inset-x-[6%] bottom-[26%] h-[8%] rounded-[4px] bg-white/15" />
      {[
        { x: "12%", b: "34%", s: 16 },
        { x: "34%", b: "40%", s: 18 },
        { x: "56%", b: "33%", s: 15 },
        { x: "74%", b: "42%", s: 17 },
        { x: "44%", b: "22%", s: 14 },
      ].map((p, i) => (
        <div key={i} className="absolute flex flex-col items-center" style={{ insetInlineStart: p.x, bottom: p.b }}>
          <span className="rounded-full bg-white/25" style={{ width: `${p.s * 0.55}cqi`, height: `${p.s * 0.55}cqi` }} />
          <span className="mt-[1cqi] rounded-t-[45%] bg-white/15" style={{ width: `${p.s}cqi`, height: `${p.s * 1.1}cqi` }} />
        </div>
      ))}
      <div className="absolute bottom-[12%] inset-e-[8%] flex flex-col items-center text-white/70">
        <Camera className="size-[9cqi]" />
        <span className="h-[8cqi] w-[0.8cqi] bg-white/40" />
      </div>
    </Frame>
  );
}

/** T3 — POV near-miss: boxes fly toward the camera, meme caption on top. */
function AlmostDemo() {
  return (
    <Frame tone="var(--color-rose)">
      <p className="kd-cap absolute inset-x-[6%] top-[8%] text-[7.4cqi] font-black text-white [-webkit-text-stroke:.06em_var(--color-black)] [paint-order:stroke_fill]">
        {T.t3Caption}
      </p>
      <div className="absolute inset-x-0 bottom-[30%] h-[3cqi] bg-white/20" />
      <div className="absolute inset-x-0 bottom-[33%] h-[1cqi] bg-white/30" />
      <div className="kd-boxes absolute inset-x-0 bottom-[28%] mx-auto h-[38%] w-[44%]">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-[2px] bg-[color-mix(in_oklab,var(--color-primary)_55%,var(--color-surface-3))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-black)_35%,transparent)]"
            style={{ width: `${12 + (i % 3) * 3}cqi`, height: `${10 + (i % 2) * 3}cqi`, insetInlineStart: `${(i * 23) % 70}%`, bottom: `${(i * 11) % 90}%`, transform: `rotate(${(i * 37) % 50 - 25}deg)` }}
          />
        ))}
      </div>
      <span className="absolute inset-e-[6%] bottom-[12%] inline-flex items-center gap-[1cqi] rounded-full bg-black/60 px-[2.6cqi] py-[0.9cqi] text-[max(9px,4cqi)] font-semibold">
        <Sparkles className="size-[1em]" />
        {T.t3AiLabel}
      </span>
    </Frame>
  );
}

/** T4 — food served, a generic phone-style "system" pop-up over it (organic posts only). */
function PopupDemo() {
  const p = T.t4Popup;
  return (
    <Frame tone="var(--color-primary)">
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_22%,var(--color-black))_0_14px,color-mix(in_oklab,var(--color-primary)_16%,var(--color-black))_14px_28px)]" />
      <div className="absolute inset-x-0 bottom-[16%] mx-auto flex aspect-[5/3] w-[70%] items-center justify-center rounded-[50%] bg-white/10 shadow-[0_10px_30px_var(--color-black)]">
        <UtensilsCrossed className="size-[22cqi] text-[color-mix(in_oklab,var(--color-primary)_80%,var(--color-white))]" strokeWidth={1.2} />
      </div>
      <div className="kd-popup absolute inset-x-[10%] top-[24%] overflow-hidden rounded-[5cqi] bg-[color-mix(in_oklab,var(--color-surface-3)_92%,transparent)] text-center text-text backdrop-blur-md">
        <div className="flex flex-col items-center gap-[1cqi] px-[5cqi] pb-[3cqi] pt-[4cqi]">
          <BatteryLow className="size-[9cqi] text-danger" />
          <p className="text-[max(10px,5.4cqi)] font-bold leading-tight">{p.title}</p>
          <p className="text-[max(9px,4.4cqi)] text-text-2">{p.body}</p>
        </div>
        <div className="grid grid-cols-2 border-t border-border text-[max(9px,4.2cqi)] font-semibold text-link">
          <span className="border-e border-border px-[2cqi] py-[2.4cqi] leading-tight">{p.action1}</span>
          <span className="px-[2cqi] py-[2.4cqi]">{p.action2}</span>
        </div>
      </div>
    </Frame>
  );
}

const DEMOS: Record<string, (i: Item) => React.ReactNode> = {
  "bait-and-sign": (i) => <SignDemo text={i.example} />,
  "behind-the-viral": () => <BtsDemo />,
  "almost-got-me-reveal": () => <AlmostDemo />,
  "fake-system-popup": () => <PopupDemo />,
};

/** TrendsTeaser (#trends, spec §L.5): the four reference templates T1–T4 (R15); T4 is organic-only. */
export function TrendsTeaser() {
  return (
    <Section id="trends" labelledBy="trends-title" className="bg-afterglow">
      <SectionHeading id="trends-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {T.items.map((item) => {
          const warn = item.ad.tone === "warn";
          return (
            <li key={item.slug} className="grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-3 rounded-lg bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:grid-cols-[10rem_1fr] sm:p-5 lg:grid-cols-[11rem_1fr]">
              <div className="row-span-2 self-start sm:row-span-3">{DEMOS[item.slug](item)}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <bdi className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-micro text-text-2">{item.code}</bdi>
                  <h3 className="text-h3 text-text">{item.name}</h3>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  <li className="rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{item.hookType}</li>
                  <li className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{item.production}</li>
                  <li className={cn("inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro", warn ? "bg-danger/15 text-danger" : "bg-success/15 text-success")}>
                    {warn ? <AlertTriangle className="size-3.5" aria-hidden /> : <Check className="size-3.5" aria-hidden />}
                    {item.ad.label}
                  </li>
                </ul>
              </div>
              <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
                <p className="text-small text-text-2">
                  <span className="font-semibold text-text">{T.whyLabel}: </span>
                  {item.why}
                </p>
                <p className="text-small text-text-2">
                  <span className="font-semibold text-text">{T.exampleLabel} ({item.niche}): </span>
                  &quot;{item.example}&quot;
                </p>
                {"note" in item && item.note && (
                  <p className="flex items-start gap-1.5 rounded-sm bg-danger/10 p-2.5 text-micro font-normal text-text">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden />
                    {item.note}
                  </p>
                )}
                <Link href={`/trends/${item.slug}`} className="w-fit text-sm font-semibold text-link underline-offset-4 hover:underline">
                  <span className="sr-only">{item.name}: </span>
                  {T.open}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="flex max-w-2xl items-start gap-2 text-small text-text-2">
          <Flame className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
          {T.legal}
        </p>
        <Link href="/trends" className={buttonVariants({ variant: "secondary", size: "lg", className: "w-fit shrink-0" })} data-cta-location="trends_teaser">
          {T.cta}
        </Link>
      </div>
    </Section>
  );
}
