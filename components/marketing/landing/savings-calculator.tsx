"use client";
import * as React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LtrInput } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { Price } from "@/components/a11y/num";
import { computeSavings, type SavingsPreset } from "./savings";
import { LANDING } from "@/content/he/landing";
import { SIGNUP_HREF } from "@/lib/constants";

const C = LANDING.editorMath.calc;
const nf = new Intl.NumberFormat("he-IL");
const ils = (n: number) => `₪${nf.format(n)}`;

const range =
  "h-2 w-full cursor-pointer appearance-auto accent-[var(--color-primary)] [direction:rtl] focus-visible:outline-2 focus-visible:outline-offset-4";

/** SavingsCalculator (Part 02 §3.7.2). Live output; the polite announcement waits 600ms without changes. */
export function SavingsCalculator() {
  const id = React.useId();
  const [videos, setVideos] = React.useState(8);
  const [price, setPrice] = React.useState(550);
  const [priceDraft, setPriceDraft] = React.useState("550");
  const [preset, setPreset] = React.useState<SavingsPreset>("draft30");
  const r = computeSavings({ videos, pricePerVideoIls: price, preset });
  const positive = r.savingMonthlyIls > 0;
  const summary = positive
    ? `${C.today(ils(r.todayIls))}. ${C.ours(ils(r.ours.totalIls))}. ${C.savingLabel}: ${C.saving(ils(r.savingMonthlyIls))}.`
    : C.notCheaper;
  const [announced, setAnnounced] = React.useState("");
  React.useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(summary), 600);
    return () => window.clearTimeout(t);
  }, [summary]);

  const commitPrice = (raw: string) => {
    const n = Number(raw.replace(/[^\d]/g, ""));
    const v = Number.isFinite(n) && n > 0 ? Math.min(3000, Math.max(100, Math.round(n / 50) * 50)) : price;
    setPrice(v);
    setPriceDraft(String(v));
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-2)] md:p-7">
      <h3 className="inline-flex items-center gap-2 text-h3 text-text">
        <Calculator className="size-5 text-primary-text" aria-hidden />
        {C.title}
      </h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={`${id}-v`} className="text-sm font-semibold text-text">{C.videos.label}</label>
          <bdi className="num text-lg font-bold text-primary-text">{videos}</bdi>
        </div>
        <input
          id={`${id}-v`}
          type="range"
          min={1}
          max={30}
          step={1}
          value={videos}
          onChange={(e) => setVideos(Number(e.target.value))}
          aria-valuetext={C.videosValueText(videos)}
          className={range}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${id}-p`} className="text-sm font-semibold text-text">{C.price.label}</label>
          <div className="flex items-center gap-1.5" dir="ltr">
            <span className="text-sm text-text-2" aria-hidden>₪</span>
            <LtrInput
              id={`${id}-pn`}
              aria-label={C.price.inputLabel}
              inputMode="numeric"
              value={priceDraft}
              onChange={(e) => setPriceDraft(e.target.value)}
              onBlur={(e) => commitPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitPrice((e.target as HTMLInputElement).value)}
              className="h-9 w-24 text-center font-bold"
            />
          </div>
        </div>
        <input
          id={`${id}-p`}
          type="range"
          min={100}
          max={3000}
          step={50}
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value));
            setPriceDraft(e.target.value);
          }}
          aria-valuetext={C.priceValueText(price)}
          className={range}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span id={`${id}-q`} className="text-sm font-semibold text-text">{C.quality.label}</span>
        <ToggleGroup type="single" aria-labelledby={`${id}-q`} value={preset} onValueChange={(v) => v && setPreset(v as SavingsPreset)} className="w-fit">
          <ToggleGroupItem value="draft30">{C.quality.draft}</ToggleGroupItem>
          <ToggleGroupItem value="standard30">{C.quality.standard}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-3 rounded-lg bg-surface-2 p-4 sm:grid-cols-2" aria-describedby="fn-4">
        <div className="flex flex-col gap-1">
          <span className="text-small text-text-2">{C.today(ils(r.todayIls))}</span>
          <span className="text-small font-semibold text-text">{C.ours(ils(r.ours.totalIls))}</span>
          <span className="text-micro font-normal text-muted">
            {C.plan(r.ours.planName)}
            {r.ours.packs.map((p) => ` ${C.pack(p.qty, p.credits)}`).join("")}
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:items-end sm:text-end">
          {positive ? (
            <>
              <span className="text-small text-text-2">
                {C.savingLabel}
                <sup>
                  <a href="#fn-4" className="ms-0.5 text-link" aria-label={C.footnoteRef(4)}>4</a>
                </sup>
              </span>
              <span className="text-4xl font-extrabold leading-none text-success md:text-5xl">
                <Price ils={r.savingMonthlyIls} />
              </span>
              <span className="text-small text-text-2">{C.saving("").trim()} · {C.yearly(ils(r.savingYearlyIls))}</span>
            </>
          ) : (
            <p className="text-small text-text">{C.notCheaper}</p>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{announced}</p>

      <Link href={SIGNUP_HREF} className={buttonVariants({ size: "lg", className: "w-full sm:w-fit" })} data-cta-location="editor_math">
        {C.cta}
      </Link>
    </div>
  );
}
