"use client";
import * as React from "react";
import { ChevronsLeftRight, MessageCircle } from "lucide-react";
import { ReelArt } from "./reel-tile";
import { LANDING } from "@/content/he/landing";

const S = LANDING.editorMath.slider;

/** "Before": raw phone material (tilted photos, a WhatsApp-style list) — CSS art, labelled as a demo. */
function BeforeArt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-3">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,color-mix(in_oklab,var(--color-text-2)_18%,transparent),transparent_70%)]" />
      {[
        { cls: "inset-e-[5%] top-[7%] w-[36%] rotate-[6deg]", tone: "var(--color-surface-2)" },
        { cls: "inset-e-[33%] top-[14%] w-[32%] rotate-[-6deg]", tone: "var(--color-surface-1)" },
        { cls: "inset-e-[17%] top-[37%] w-[32%] rotate-[-2deg]", tone: "var(--color-surface-2)" },
      ].map((p, i) => (
        <div key={i} className={`absolute aspect-[3/4] rounded-[6px] p-[3%] shadow-[var(--shadow-2)] ${p.cls}`} style={{ background: "var(--color-text)" }}>
          <div
            className="size-full rounded-[3px] opacity-80"
            style={{ background: `linear-gradient(${120 + i * 40}deg, ${p.tone}, color-mix(in oklab, var(--color-muted) 60%, ${p.tone}))`, filter: "blur(.4px) saturate(.6)" }}
          />
        </div>
      ))}
      <div dir="rtl" className="absolute bottom-[6%] inset-e-[6%] w-[50%] rounded-lg rounded-be-[4px] bg-surface-1 p-3 text-[11px] leading-relaxed text-text shadow-[var(--shadow-2)]">
        <p className="mb-1 inline-flex items-center gap-1 font-bold text-success">
          <MessageCircle className="size-3" aria-hidden />
          {S.whatsappTitle}
        </p>
        <ul className="list-disc ps-4 text-text-2">
          {S.whatsappLines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * BeforeAfterSlider (Part 02 §3.7.1): "before" on the start side (right), "after" on the end side (left).
 * role="slider"; arrow keys move the handle in the arrow's visual direction; Home = all "before", End = all "after".
 * Pointer down anywhere on the frame jumps the handle there (WCAG 2.5.7 alternative to dragging).
 */
export function BeforeAfterSlider() {
  const [after, setAfter] = React.useState(50); // % of the frame (from the left edge) that shows "after"
  const frame = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const fromPointer = (clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAfter(Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100))));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    let v = after;
    if (e.key === "ArrowLeft") v = after - step; // handle moves left → less "after" visible
    else if (e.key === "ArrowRight") v = after + step;
    else if (e.key === "Home") v = 0;
    else if (e.key === "End") v = 100;
    else return;
    e.preventDefault();
    setAfter(Math.min(100, Math.max(0, v)));
  };

  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={frame}
        dir="ltr"
        className="relative mx-auto aspect-[4/5] w-full max-w-[420px] touch-none select-none overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)]"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* after (full) */}
        <div className="absolute inset-0" aria-hidden>
          <ReelArt text={S.hook} preset="bold-pop" icon="Hammer" categorySlug="real-estate-home" aspect="square" chrome={false} variant={3} className="h-full rounded-none [aspect-ratio:auto]">
            <div className="absolute inset-x-[8%] bottom-[16%]">
              <p className="kd-cap kd-cap-clean-box"><span>{S.afterCaption}</span></p>
            </div>
          </ReelArt>
        </div>
        {/* before (clipped to the right part) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${after}%)` }} aria-hidden>
          <BeforeArt />
        </div>
        {/* labels */}
        <span dir="rtl" className="absolute inset-e-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-micro text-white" aria-hidden>{S.before}</span>
        <span dir="rtl" className="absolute inset-s-3 top-3 max-w-[45%] rounded-full bg-black/60 px-2.5 py-1 text-micro text-white" aria-hidden>{S.after}</span>
        <span dir="rtl" className="absolute bottom-3 inset-s-3 rounded-[6px] bg-black/60 px-2 py-0.5 text-micro text-white/90" aria-hidden>{S.demo}</span>
        {/* handle */}
        <div className="absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_var(--color-black)]" style={{ insetInlineStart: `${after}%` }} aria-hidden />
        <div
          role="slider"
          tabIndex={0}
          aria-label={S.label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={after}
          aria-valuetext={S.valueText(after)}
          aria-orientation="horizontal"
          onKeyDown={onKey}
          className="absolute top-1/2 inline-flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-black shadow-[var(--shadow-3)] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ insetInlineStart: `${after}%` }}
        >
          <ChevronsLeftRight className="size-5" aria-hidden />
        </div>
      </div>
      <figcaption className="text-center text-micro font-normal text-muted">
        {S.before} · {S.after}
      </figcaption>
    </figure>
  );
}
