"use client";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Captions, Layers, Pause, Play, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/misc";
import { APP_CORE } from "@/content/he/app-core";
import type { Aspect, BeatRole, CaptionPreset, SceneTone } from "@/lib/mock/projects";
import { formatDuration } from "@/lib/mock/projects";
import { fillText } from "@/components/projects/plural";
import { PhoneFrame } from "./phone-frame";
import { SceneArt } from "./scene-art";
import { useReducedMotion } from "./use-reduced-motion";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface PreviewScene {
  id: string;
  onscreen: string;
  vo: string;
  durationSec: number;
  tone: SceneTone;
  icon?: string | null;
  role?: BeatRole;
}

export interface PreviewEndCard { headline: string; name: string; logoLetter: string; lines: string[] }

export interface PhonePreviewProps {
  scenes: PreviewScene[];
  title: string;
  aspect?: Aspect;
  width?: number;
  captionPreset?: CaptionPreset;
  captionPosition?: "lower" | "middle";
  endCard?: PreviewEndCard | null;
  aiLabel?: boolean;
  watermark?: boolean;
  logoBug?: string | null;
  autoPlay?: boolean;
  loop?: boolean;
  hookOverride?: string | null;
  controls?: "full" | "none";
  chrome?: "phone" | "bare";
  glow?: boolean;
  seekScene?: { index: number; nonce: number } | null;
  onSceneChange?: (index: number) => void;
  feedHeader?: React.ReactNode;
  emptyLabel?: string;
  className?: string;
}

const P = APP_CORE.player;
const END_SEC = 2.5;
const SHADOW = "0 4px 18px color-mix(in oklab, var(--color-black) 55%, transparent)";
const STROKE = "color-mix(in oklab, var(--color-black) 88%, transparent)";

/** Placeholder tokens such as {מחיר} render as a lemon marker chip inside the frame. */
function withPlaceholders(text: string) {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((p, i) =>
    /^\{[^}]+\}$/.test(p) ? (
      <span key={i} className="mx-[0.1em] rounded-[0.2em] bg-lemon px-[0.25em] text-on-primary [text-shadow:none]">
        {p.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

function CaptionWords({ words, active, preset }: { words: string[]; active: number; preset: CaptionPreset }) {
  const pageSize = preset === "bold-pop" ? 3 : preset === "poster" ? 2 : 5;
  const page = Math.max(0, Math.floor(active / pageSize));
  const start = page * pageSize;
  const pageWords = words.slice(start, start + pageSize);
  const big = preset === "poster";
  return (
    <p
      dir="rtl"
      className={cn(
        "flex flex-wrap justify-center gap-x-[0.28em] gap-y-[0.1em] text-center leading-[1.15]",
        big ? "font-display text-[11cqw] font-bold" : preset === "clean-box" || preset === "news" ? "text-[6.2cqw] font-bold" : "text-[7.4cqw] font-black",
        preset === "clean-box" && "rounded-[0.35em] bg-black/80 px-[0.45em] py-[0.12em]",
        preset === "news" && "rounded-[0.3em] border-s-[0.35em] border-primary bg-black/80 px-[0.45em] py-[0.12em]",
        preset === "soft" && "rounded-[1em] bg-white/90 px-[0.5em] py-[0.14em] text-on-primary",
      )}
    >
      {pageWords.map((w, i) => {
        const idx = start + i;
        const shown = idx <= active;
        const isActive = idx === active;
        const isPop = preset === "bold-pop";
        return (
          <span
            key={`${page}-${i}`}
            className={cn(
              "inline-block transition-[opacity,transform,background-color,color] duration-100 ease-[var(--ease-out)]",
              shown ? "scale-100 opacity-100" : "scale-[.86] opacity-0",
              isPop && isActive && "rounded-[0.24em] bg-primary px-[0.18em] text-on-primary",
              preset === "karaoke" && shown && "text-rose",
              preset === "poster" && isActive && "text-primary",
              preset === "clean-box" && isActive && "underline decoration-primary decoration-[0.12em] underline-offset-[0.18em]",
              preset === "news" && isActive && "text-primary",
              preset === "soft" && isActive && "scale-[1.06]",
              !isPop || !isActive ? (preset === "soft" ? "" : "text-white") : "",
            )}
            style={
              preset === "soft" || (isPop && isActive) || preset === "clean-box" || preset === "news"
                ? undefined
                : { textShadow: SHADOW, WebkitTextStroke: preset === "poster" ? `0.02em ${STROKE}` : `0.035em ${STROKE}`, paintOrder: "stroke fill" }
            }
          >
            {withPlaceholders(w)}
          </span>
        );
      })}
    </p>
  );
}

export function PhonePreview({
  scenes,
  title,
  aspect = "9:16",
  width = 300,
  captionPreset = "bold-pop",
  captionPosition = "lower",
  endCard = null,
  aiLabel = false,
  watermark = false,
  logoBug = null,
  autoPlay = false,
  loop = false,
  hookOverride = null,
  controls = "full",
  chrome = "phone",
  glow = false,
  seekScene = null,
  onSceneChange,
  feedHeader,
  emptyLabel,
  className,
}: PhonePreviewProps) {
  const reduced = useReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [captionsOn, setCaptionsOn] = React.useState(true);
  const [zones, setZones] = React.useState(false);

  const effScenes = React.useMemo(
    () => scenes.map((s, i) => (i === 0 && hookOverride ? { ...s, onscreen: hookOverride, vo: hookOverride } : s)),
    [scenes, hookOverride],
  );
  const sceneTotal = effScenes.reduce((a, s) => a + s.durationSec, 0);
  const total = sceneTotal + (endCard ? END_SEC : 0);

  // playback clock
  React.useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= total) {
          if (loop) return 0;
          setPlaying(false);
          return total;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, total, loop]);

  // pause when hidden or off-screen; autoplay once when visible (never under reduced motion)
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let autoplayed = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlaying(false);
        else if (autoPlay && !reduced && !autoplayed && total > 0) {
          autoplayed = true;
          setStarted(true);
          setPlaying(true);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    const onVis = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [autoPlay, reduced, total]);

  // external seek (scene list click): adjust state while rendering, keyed by the nonce
  const [seekNonce, setSeekNonce] = React.useState<number | null>(null);
  if (seekScene && seekScene.nonce !== seekNonce) {
    setSeekNonce(seekScene.nonce);
    setT(effScenes.slice(0, seekScene.index).reduce((a, s) => a + s.durationSec, 0) + 0.01);
    setStarted(true);
  }

  let acc = 0;
  let idx = -1;
  for (let i = 0; i < effScenes.length; i++) {
    if (t < acc + effScenes[i].durationSec) { idx = i; break; }
    acc += effScenes[i].durationSec;
  }
  const inEnd = idx === -1 && effScenes.length > 0;
  const scene = idx >= 0 ? effScenes[idx] : null;
  const local = scene ? Math.min(1, Math.max(0, (t - acc) / scene.durationSec)) : 1;

  const lastIdx = React.useRef(-2);
  React.useEffect(() => {
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      onSceneChange?.(idx);
    }
  }, [idx, onSceneChange]);

  const words = scene ? scene.vo.split(/\s+/).filter(Boolean) : [];
  const active = scene ? Math.min(words.length - 1, Math.floor((local / 0.94) * words.length)) : -1;
  const kbScale = reduced ? 1.02 : 1.02 + 0.07 * local;
  const kbShift = reduced ? 0 : (idx % 2 ? 1 : -1) * 2.2 * local;
  const ended = !playing && started && t >= total - 0.01;

  const toggle = () => {
    if (total <= 0) return;
    setStarted(true);
    if (ended) setT(0);
    setPlaying((p) => !p);
  };
  const seek = (v: number) => {
    setStarted(true);
    setT(Math.min(total, Math.max(0, v)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).getAttribute("role");
    if (tag === "slider") return;
    if (e.key === " " || e.key.toLowerCase() === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); seek(t + 5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); seek(t - 5); }
    else if (e.key.toLowerCase() === "c") setCaptionsOn((c) => !c);
  };

  const transcript = effScenes.map((s) => s.vo).join(" ");
  const empty = effScenes.length === 0;
  const textTop = captionPosition === "middle" ? "top-[16%]" : aspect === "9:16" ? "top-[24%]" : "top-[16%]";
  const captionsTop = captionPosition === "middle" ? "top-[46%]" : aspect === "9:16" ? "top-[64%]" : "top-[62%]";

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label={fillText(P.region, { title })}
      onKeyDown={onKeyDown}
      className={cn("flex w-full flex-col items-center gap-3", className)}
    >
      <PhoneFrame aspect={aspect} width={width} chrome={chrome} glow={glow} header={feedHeader}>
        {empty ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2 p-6 text-center text-small text-muted">
            {emptyLabel ?? APP_CORE.wizard.previewEmpty}
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              <motion.div
                key={inEnd ? "end" : scene?.id ?? "x"}
                className="absolute inset-0"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.35 }}
              >
                {inEnd && endCard ? (
                  <SceneArt tone="ember" glyph={false} scale={1.02}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw] px-[8%] text-center text-white">
                      <span className="flex size-[18cqw] items-center justify-center rounded-full bg-primary text-[8cqw] font-black text-on-primary glow-primary">
                        {endCard.logoLetter}
                      </span>
                      <p className="text-[4.4cqw] font-bold opacity-85">{endCard.name}</p>
                      <p className="text-[7.6cqw] font-black leading-[1.15] [text-wrap:balance]" style={{ textShadow: SHADOW }}>
                        {endCard.headline}
                      </p>
                      <ul className="flex flex-col gap-[1cqw] text-[4.2cqw] font-semibold opacity-90">
                        {endCard.lines.map((l) => (
                          <li key={l} dir="auto">{l}</li>
                        ))}
                      </ul>
                    </div>
                  </SceneArt>
                ) : scene ? (
                  <SceneArt tone={scene.tone} icon={scene.icon} scale={kbScale} shift={kbShift} />
                ) : null}
              </motion.div>
            </AnimatePresence>

            {scene && scene.onscreen && (
              <p
                dir="rtl"
                aria-hidden
                className={cn(
                  "absolute inset-x-[7%] text-center leading-[1.12] text-white [text-wrap:balance] transition-opacity duration-200",
                  textTop,
                  idx === 0 ? "text-[9.6cqw] font-black" : "text-[6.6cqw] font-extrabold",
                  aspect !== "9:16" && (idx === 0 ? "text-[6.4cqw]" : "text-[4.6cqw]"),
                  local < 0.04 && !reduced ? "opacity-0" : "opacity-100",
                )}
                style={{ textShadow: SHADOW }}
              >
                {withPlaceholders(scene.onscreen)}
              </p>
            )}

            {scene && captionsOn && words.length > 0 && (
              <div aria-hidden className={cn("absolute inset-x-[6%]", captionsTop, aspect !== "9:16" && "text-[0.62em]")}>
                <CaptionWords words={words} active={active} preset={captionPreset} />
              </div>
            )}

            {aiLabel && (
              <span className="absolute top-[4.5%] inset-s-[5%] z-10 rounded-full bg-black/55 px-[2.2cqw] py-[0.6cqw] text-[3cqw] font-semibold text-white">
                {P.aiLabel}
              </span>
            )}
            {logoBug && t > 3 && !inEnd && (
              <span className="absolute top-[4.5%] inset-e-[5%] z-10 flex size-[8cqw] items-center justify-center rounded-full bg-primary text-[3.8cqw] font-black text-on-primary">
                {logoBug}
              </span>
            )}
            {watermark && (
              <span className="absolute bottom-[3%] inset-s-1/2 z-10 rounded-full bg-black/50 px-[2.4cqw] py-[0.5cqw] text-[3cqw] text-white/85 ltr:-translate-x-1/2 rtl:translate-x-1/2">
                {BRAND.watermarkHe}
              </span>
            )}

            {zones && aspect === "9:16" && (
              <div aria-hidden dir="ltr" className="pointer-events-none absolute inset-0 z-20 text-[2.8cqw] font-semibold text-white [&>div]:text-end" lang="he">
                <div className="absolute inset-x-0 top-0 h-[12%] border-b border-dashed border-rose bg-rose/10 p-[2cqw]">{P.zoneTop}</div>
                <div className="absolute inset-x-[4%] top-[15%] h-[40%] rounded-[2cqw] border border-dashed border-success p-[2cqw]">{P.zoneHook}</div>
                <div className="absolute inset-x-[4%] top-[62%] h-[16%] rounded-[2cqw] border border-dashed border-success p-[2cqw]">{P.zoneCaptions}</div>
                <div className="absolute inset-x-0 bottom-0 h-[22%] border-t border-dashed border-rose bg-rose/10 p-[2cqw] pt-[8cqw]">{P.zoneBottom}</div>
                {/* platform buttons column stays on the physical right (LTR wrapper), as in the apps themselves */}
                <div className="absolute top-[40%] inset-e-0 h-[45%] w-[14%] border-s border-dashed border-rose bg-rose/10 p-[1cqw] [writing-mode:vertical-rl]">{P.zoneButtons}</div>
              </div>
            )}

            {(!started || ended) && (
              <button
                type="button"
                onClick={toggle}
                aria-label={ended ? P.replay : P.play}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 focus-visible:outline-offset-[-4px]"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-primary text-on-primary glow-primary transition-transform hover:scale-105">
                  {ended ? <RotateCcw className="size-7" aria-hidden /> : <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />}
                </span>
              </button>
            )}
          </>
        )}
      </PhoneFrame>

      {controls === "full" && !empty && (
        <div dir="ltr" className="flex w-full max-w-[380px] items-center gap-2 rounded-full bg-surface-2 px-2 py-1.5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? P.pause : ended ? P.replay : P.play}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-hover"
          >
            {playing ? <Pause className="size-4 fill-current" aria-hidden /> : ended ? <RotateCcw className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px fill-current" aria-hidden />}
          </button>
          <span className="shrink-0 font-mono text-micro text-text-2 tabular-nums">
            {formatDuration(t)} / {formatDuration(total)}
          </span>
          <Slider
            dir="ltr"
            min={0}
            max={Math.max(0.1, total)}
            step={0.1}
            value={[t]}
            onValueChange={([v]) => seek(v)}
            aria-label={P.seek}
            aria-valuetext={fillText(P.timeOf, { current: formatDuration(t), total: formatDuration(total) })}
            className="mx-1"
          />
          <button
            type="button"
            onClick={() => setCaptionsOn((c) => !c)}
            aria-pressed={captionsOn}
            aria-label={captionsOn ? P.captionsOff : P.captionsOn}
            className={cn("flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-3", captionsOn ? "text-primary-text" : "text-text-2")}
          >
            <Captions className="size-4" aria-hidden />
          </button>
          {aspect === "9:16" && (
            <button
              type="button"
              onClick={() => setZones((z) => !z)}
              aria-pressed={zones}
              aria-label={P.safeZones}
              className={cn("flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-3", zones ? "text-primary-text" : "text-text-2")}
            >
              <Layers className="size-4" aria-hidden />
            </button>
          )}
        </div>
      )}
      <p className="sr-only">{transcript}</p>
    </div>
  );
}
