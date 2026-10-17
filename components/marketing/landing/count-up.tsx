"use client";
import * as React from "react";
import { useMotionAllowed } from "./use-motion";

const nf = new Intl.NumberFormat("he-IL");

/**
 * Number that counts up when it first scrolls into view, and tweens when `value` changes.
 * Server HTML (and reduced motion) always shows the final value. Width is reserved so centered lines don't jump.
 */
export function CountUp({
  value, from = 0, duration = 900, prefix = "", label, className,
}: {
  value: number;
  from?: number;
  duration?: number;
  prefix?: string;
  /** Accessible text (e.g. "119 שקלים"); the animated digits are hidden from screen readers. */
  label?: string;
  className?: string;
}) {
  const allowed = useMotionAllowed();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState(value);
  const last = React.useRef<number | null>(null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!allowed || !seen) return;
    const start = last.current ?? from;
    last.current = value;
    if (start === value) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (value - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, allowed, seen, from, duration]);

  const text = `${prefix}${nf.format(allowed && seen ? shown : value)}`;
  const width = `${prefix.length + nf.format(value).length}ch`;
  return (
    <bdi ref={ref} className={className} aria-label={label} style={{ display: "inline-block", minWidth: width, fontVariantNumeric: "tabular-nums" }}>
      <span aria-hidden={label ? true : undefined}>{text}</span>
    </bdi>
  );
}
