"use client";
import * as React from "react";
import type { CaptionPresetId } from "@/lib/mock/account";
import { fontFamily } from "./brand-fonts";
import { contrastRatio } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

export interface CaptionColors { primary: string; secondary: string; accent: string; highlight: string }

const INK = "#0A0A0F";
const STROKE = "#08080C";

/** Minimum contrast of the preset's text against its own surface (Part 01 §16.4). */
export function captionContrast(preset: CaptionPresetId, c: CaptionColors): number {
  switch (preset) {
    case "bold-pop": return contrastRatio(c.highlight, INK);
    case "clean-box": return Math.max(contrastRatio("#FFFFFF", c.secondary), contrastRatio(INK, c.secondary));
    case "karaoke": return contrastRatio(c.accent, STROKE);
    case "poster": return contrastRatio(c.highlight, STROKE);
    case "news": return contrastRatio("#FFFFFF", c.secondary);
    case "soft": return 7;
  }
}

/** Word-by-word active index (350 ms per word, words only — never letters). */
export function useActiveWord(count: number, play: boolean) {
  const [i, setI] = React.useState(1);
  React.useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setI((x) => (x + 1) % Math.max(1, count)), 350);
    return () => clearInterval(t);
  }, [count, play]);
  return i;
}

/**
 * CaptionPreview (Part 01 §10.12): DOM rendering of the 6 caption presets with brand colors, no Remotion.
 * `scale` is the font size in px for the canvas the caption sits on.
 */
export function CaptionPreview({
  preset, colors, text, active = 1, size = 22, className,
}: {
  preset: CaptionPresetId;
  colors: CaptionColors;
  text: string;
  active?: number;
  size?: number;
  className?: string;
}) {
  const words = text.split(" ");
  const base: React.CSSProperties = { direction: "rtl", unicodeBidi: "plaintext", letterSpacing: 0, textAlign: "center" };
  const stroke = (w: number, col = STROKE) => ({ WebkitTextStroke: `${w}px ${col}`, paintOrder: "stroke fill" as const });

  if (preset === "bold-pop") {
    return (
      <p className={className} style={{ ...base, fontFamily: fontFamily("Heebo"), fontWeight: 900, fontSize: size, lineHeight: 1.15, color: "#FFFFFF", textShadow: "0 4px 18px rgb(0 0 0 / .45)" }}>
        {words.map((w, k) => (
          <React.Fragment key={k}>
            <span style={k === active ? { background: colors.highlight, color: INK, borderRadius: size * 0.16, padding: ".04em .2em" } : stroke(size * 0.07)}>{w}</span>{" "}
          </React.Fragment>
        ))}
      </p>
    );
  }
  if (preset === "clean-box") {
    const textCol = contrastRatio("#FFFFFF", colors.secondary) >= contrastRatio(INK, colors.secondary) ? "#FFFFFF" : INK;
    return (
      <p className={className} style={{ ...base, fontFamily: fontFamily("Heebo"), fontWeight: 700, fontSize: size * 0.8, lineHeight: 1.6 }}>
        <span style={{ background: `color-mix(in oklab, ${colors.secondary} 88%, transparent)`, color: textCol, borderRadius: size * 0.2, padding: ".12em .45em", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
          {words.map((w, k) => (
            <React.Fragment key={k}>
              <span style={k === active ? { boxShadow: `inset 0 -0.12em 0 ${colors.highlight}` } : undefined}>{w}</span>{" "}
            </React.Fragment>
          ))}
        </span>
      </p>
    );
  }
  if (preset === "karaoke") {
    return (
      <p className={className} style={{ ...base, fontFamily: fontFamily("Rubik"), fontWeight: 800, fontSize: size * 0.88, lineHeight: 1.2 }}>
        {words.map((w, k) => (
          <React.Fragment key={k}>
            <span style={{ color: k <= active ? colors.accent : "#FFFFFF", ...stroke(size * 0.06) }}>{w}</span>{" "}
          </React.Fragment>
        ))}
      </p>
    );
  }
  if (preset === "poster") {
    return (
      <p className={className} style={{ ...base, fontFamily: fontFamily("Karantina"), fontWeight: 700, fontSize: size * 1.55, lineHeight: 0.98, color: "#FFFFFF", textShadow: "0 6px 24px rgb(0 0 0 / .55)" }}>
        {words.map((w, k) => (
          <React.Fragment key={k}>
            <span style={{ color: k === active ? colors.highlight : "#FFFFFF", ...stroke(size * 0.035) }}>{w}</span>{" "}
          </React.Fragment>
        ))}
      </p>
    );
  }
  if (preset === "news") {
    return (
      <div className={cn("w-full", className)} style={{ ...base, fontFamily: fontFamily("Suez One"), fontSize: size * 0.78, lineHeight: 1.25, color: "#FFFFFF", background: `color-mix(in oklab, ${colors.secondary} 90%, transparent)`, borderRadius: 8, padding: ".45em .6em", borderInlineStart: `${Math.max(4, size * 0.15)}px solid ${colors.primary}` }}>
        {words.map((w, k) => (
          <React.Fragment key={k}>
            <span style={k === active ? (contrastRatio(colors.primary, colors.secondary) >= 4.5 ? { color: colors.primary } : { textDecoration: "underline", textUnderlineOffset: ".18em" }) : undefined}>{w}</span>{" "}
          </React.Fragment>
        ))}
      </div>
    );
  }
  // soft
  return (
    <p className={className} style={{ ...base, fontFamily: fontFamily("Fredoka"), fontWeight: 600, fontSize: size * 0.82, lineHeight: 1.7, color: "#16140F" }}>
      <span style={{ background: `color-mix(in oklab, ${colors.accent} 20%, white)`, borderRadius: size * 0.6, padding: ".14em .5em", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {words.map((w, k) => (
          <React.Fragment key={k}>
            <span style={k === active ? { background: `color-mix(in oklab, ${colors.accent} 34%, white)`, borderRadius: size * 0.4, padding: "0 .15em", display: "inline-block", transform: "scale(1.06)" } : undefined}>{w}</span>{" "}
          </React.Fragment>
        ))}
      </span>
    </p>
  );
}
