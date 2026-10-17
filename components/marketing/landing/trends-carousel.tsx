"use client";
import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { BatteryLow, Package } from "lucide-react";
import { ReelScene } from "./reel-phone";
import { SectionHeading } from "./section-heading";
import { DirIcon } from "@/components/a11y/dir-icon";
import { LANDING } from "@/content/he/landing";
import { cn } from "@/lib/utils";

const C = LANDING.trends;
type Trend = (typeof C.items)[number];

const chip = "rounded-full bg-ink/55 px-2.5 py-1 text-micro text-paper backdrop-blur-md";

function TrendArt({ t }: { t: Trend }) {
  switch (t.slug) {
    case "bait-and-sign":
      return (
        <>
          <div className="absolute inset-x-0 top-0 h-[46%] overflow-hidden">
            <ReelScene scene="dusk" />
            <span className={cn(chip, "absolute top-3 inset-s-3")}>פיתיון · 2.5 שנ׳</span>
          </div>
          <div className="absolute inset-x-0 top-[46%] z-10 -translate-y-1/2 -rotate-3 bg-accent-gradient py-1 text-center text-micro font-bold tracking-[0.3em] text-ink">קאט</div>
          <div className="absolute inset-x-0 bottom-0 h-[54%] bg-surface-3">
            <span className="absolute inset-x-0 bottom-0 mx-auto h-[46%] w-[46%] rounded-t-full bg-scene-navy/85" />
            <div className="absolute inset-x-0 top-[16%] mx-auto w-[74%] rotate-[-2.5deg] rounded-[6px] bg-scene-sand px-4 py-3 text-center shadow-[0_10px_24px_-10px_color-mix(in_oklab,var(--color-ink)_45%,transparent)]">
              <p className="font-display text-[1.75rem] leading-[1.05] text-ink">{t.sign}</p>
            </div>
          </div>
        </>
      );
    case "behind-the-viral":
      return (
        <>
          <ReelScene scene="teal" />
          <div className="absolute inset-5">
            {["top-0 inset-s-0 border-t-2 border-s-2 rounded-ss-[10px]", "top-0 inset-e-0 border-t-2 border-e-2 rounded-se-[10px]", "bottom-0 inset-s-0 border-b-2 border-s-2 rounded-es-[10px]", "bottom-0 inset-e-0 border-b-2 border-e-2 rounded-ee-[10px]"].map((c) => (
              <span key={c} className={cn("absolute size-7 border-paper/80", c)} />
            ))}
          </div>
          <span className="absolute top-8 inset-e-8 inline-flex items-center gap-1.5 text-micro text-paper" dir="ltr">
            <span className="size-2 rounded-full bg-danger animate-pulse-dot" />
            REC
          </span>
          <div className="absolute inset-x-0 bottom-[22%] flex justify-center gap-3">
            {[0.8, 1, 0.9].map((s, i) => (
              <span key={i} className="flex flex-col items-center" style={{ scale: s }}>
                <span className="size-8 rounded-full bg-paper/25 backdrop-blur-sm" />
                <span className="mt-1 h-12 w-14 rounded-t-[22px] bg-paper/20 backdrop-blur-sm" />
              </span>
            ))}
          </div>
          <span className="absolute inset-x-0 top-[16%] mx-auto w-fit rounded-[8px] bg-paper px-3 py-1.5 text-small font-extrabold text-ink">{t.sign}</span>
        </>
      );
    case "almost-got-me-reveal":
      return (
        <>
          <ReelScene scene="sky" />
          <div className="absolute inset-x-0 top-[24%] mx-auto flex w-fit -rotate-12 flex-col items-center">
            <span className="relative inline-flex size-28 items-center justify-center rounded-[14px] bg-scene-sand shadow-[0_24px_40px_-16px_color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
              <span className="absolute inset-y-0 w-5 bg-primary/70" />
              <Package className="relative size-10 text-scene-cocoa" aria-hidden />
            </span>
          </div>
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute h-0.5 rounded-full bg-paper/70" style={{ width: `${38 - i * 8}%`, top: `${34 + i * 7}%`, insetInlineEnd: "6%" }} />
          ))}
          <span className={cn(chip, "absolute top-3 inset-s-3")}>{t.sign}</span>
          <p className="absolute inset-x-4 bottom-6 text-center text-small font-extrabold text-paper [text-shadow:0_2px_10px_color-mix(in_oklab,var(--color-ink)_60%,transparent)]">המשאית כמעט תפסה אותי</p>
        </>
      );
    case "fake-system-popup":
      return (
        <>
          <ReelScene scene="cocoa" />
          <span className="absolute inset-x-0 bottom-[-18%] mx-auto aspect-square w-[86%] rounded-full bg-[radial-gradient(closest-side,var(--color-scene-sand)_0_52%,var(--color-paper)_53%_70%,color-mix(in_oklab,var(--color-paper)_70%,transparent)_71%_74%,transparent_75%)] opacity-90" />
          <div className="absolute inset-x-0 top-[26%] mx-auto w-[72%] overflow-hidden rounded-[16px] bg-paper/92 text-center text-ink shadow-[0_20px_40px_-12px_color-mix(in_oklab,var(--color-ink)_55%,transparent)] backdrop-blur-md">
            <div className="px-4 pb-3 pt-4">
              <BatteryLow className="mx-auto size-5 text-danger" aria-hidden />
              <p className="mt-1 text-small font-bold">סוללה חלשה</p>
              <p className="text-micro font-normal">נותרו 10%</p>
            </div>
            <div className="grid grid-cols-2 border-t border-ink/10 text-micro font-semibold text-scene-navy">
              <span className="border-e border-ink/10 py-2">מצב חיסכון</span>
              <span className="py-2">סגירה</span>
            </div>
          </div>
        </>
      );
    default:
      return <ReelScene scene="dusk" />;
  }
}

export function TrendsCarousel() {
  const [viewportRef, api] = useEmblaCarousel({ direction: "rtl", align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);
  React.useEffect(() => {
    if (!api) return;
    const update = () => { setCanPrev(api.canScrollPrev()); setCanNext(api.canScrollNext()); };
    update();
    api.on("select", update).on("reInit", update);
    return () => { api.off("select", update).off("reInit", update); };
  }, [api]);

  const navBtn =
    "inline-flex size-11 items-center justify-center rounded-full bg-surface-1 text-text shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_8%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-[opacity,transform] hover:-translate-y-0.5 disabled:opacity-35 disabled:hover:translate-y-0";

  return (
    <section id="trends" aria-labelledby="trends-title" className="relative scroll-mt-20 overflow-x-clip py-20 md:py-24">
      <div className="container-marketing">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="trends-title" eyebrow={C.eyebrow} title={C.title} subtitle={C.subtitle} align="start" />
          <div className="flex items-center gap-2">
            <button type="button" className={navBtn} onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label={C.prev}>
              <DirIcon name="prev" className="size-5" />
            </button>
            <button type="button" className={navBtn} onClick={() => api?.scrollNext()} disabled={!canNext} aria-label={C.next}>
              <DirIcon name="next" className="size-5" />
            </button>
          </div>
        </div>
        <div ref={viewportRef} className="reveal mt-10 overflow-visible" role="region" aria-roledescription="carousel" aria-label={C.title}>
          <ul className="flex touch-pan-y gap-4 md:gap-5">
            {C.items.map((t, i) => (
              <li key={t.slug} className="min-w-0 shrink-0 grow-0 basis-[80%] xs:basis-[300px] md:basis-[340px]" aria-roledescription="slide" aria-label={`${i + 1} / ${C.items.length}`}>
                <Link
                  href={`/trends/${t.slug}`}
                  className="group block h-full rounded-[28px] bg-surface-1 p-2 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_5%,transparent),inset_0_0_0_1px_var(--color-frame)] transition-[box-shadow,translate] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--color-ink)_25%,transparent),inset_0_0_0_1px_var(--color-frame)]"
                >
                  <div aria-hidden className="@container relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink">
                    <TrendArt t={t} />
                    <span className="absolute bottom-3 inset-e-3 z-20 rounded-full bg-paper/90 px-2 py-0.5 text-micro text-ink">{C.demo}</span>
                  </div>
                  <div className="px-3 pb-3 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-h3 text-text">{t.name}</h3>
                      <DirIcon name="forward" className="size-4 text-muted transition-transform duration-300 rtl:group-hover:-translate-x-1" />
                    </div>
                    <p className="mt-1 text-small text-text-2">{t.line}</p>
                    <span
                      className={cn(
                        "mt-3 inline-flex rounded-full px-2.5 py-1 text-micro",
                        t.tone === "warn" ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
                      )}
                    >
                      {t.tag}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-micro font-normal text-muted">{C.legal}</p>
          <Link href="/trends" className="group inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
            {C.cta}
            <DirIcon name="forward" className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
