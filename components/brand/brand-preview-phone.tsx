"use client";
import * as React from "react";
import { AtSign, Globe, MapPin, MessageCircle, Pause, Phone, Play, QrCode, RotateCcw } from "lucide-react";
import { PhoneFrame } from "@/components/video/phone-frame";
import { useReducedMotion } from "@/components/video/use-reduced-motion";
import { CaptionPreview, useActiveWord } from "./caption-preview";
import { fontFamily } from "./brand-fonts";
import { brandCopy, CTA_LABEL } from "@/content/he/account";
import type { BrandKit } from "@/lib/mock/account";
import { cn } from "@/components/settings/cn";

const p = brandCopy.editor.preview;
type Scene = "intro" | "hook" | "scene" | "end";

export interface PreviewContext {
  businessName: string;
  serviceName: string;
  hookText: string;
  phone: string;
  website: string;
  instagram: string;
  address: string;
  lockedDisclaimer?: string | null;
}

/** Logo mark: the uploaded logo, or a temporary monogram in the brand's heading font. */
export function LogoMark({ kit, src, size = 40, className }: { kit: BrandKit; src?: string | null; size?: number; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview of an uploaded file
    return <img src={src} alt="" className={cn("object-contain", className)} style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center justify-center rounded-[22%] font-bold", className)}
      style={{ width: size, height: size, background: kit.colors.primary, color: kit.colors.text, fontFamily: fontFamily(kit.fonts.heading), fontSize: size * 0.42 }}
    >
      {kit.logoText}
    </span>
  );
}

/**
 * LivePreviewPhone for the brand kit (Part 03 §12.2): a sample animatic — hook from the niche, a scene with
 * captions and the end card — that updates on every change. Auto-advances unless motion is reduced.
 */
export function BrandPreviewPhone({ kit, ctx, logoSrc, width = 290 }: { kit: BrandKit; ctx: PreviewContext; logoSrc?: string | null; width?: number }) {
  const reduce = useReducedMotion();
  const scenes: Scene[] = kit.introStyle === "none" ? ["hook", "scene", "end"] : ["intro", "hook", "scene", "end"];
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const playing = !reduce && !paused;
  const scene = scenes[Math.min(idx, scenes.length - 1)];

  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % scenes.length), 2800);
    return () => clearInterval(t);
  }, [playing, scenes.length]);

  const captionText = scene === "scene" ? p.sceneCaption : ctx.hookText.split(" ").slice(0, 5).join(" ");
  const active = useActiveWord(captionText.split(" ").length, playing);
  const colors = { primary: kit.colors.primary, secondary: kit.colors.secondary, accent: kit.colors.accent, highlight: kit.captionHighlight };
  const price = kit.shekelFormat === "prefix" ? "₪120" : "120 ₪";
  const wmPos = {
    top_start: "top-[7%] inset-s-[6%]", top_end: "top-[7%] inset-e-[6%]",
    bottom_start: "bottom-[16%] inset-s-[6%]", bottom_end: "bottom-[16%] inset-e-[6%]",
  }[kit.watermark.position];

  return (
    <div className="flex flex-col items-center gap-4">
      <PhoneFrame width={width} label={p.label} glow>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(80% 60% at 70% 20%, color-mix(in oklab, ${kit.colors.primary} 55%, transparent), transparent 70%), radial-gradient(70% 50% at 20% 85%, color-mix(in oklab, ${kit.colors.accent} 35%, transparent), transparent 70%), ${kit.colors.secondary}`,
          }}
        />
        {/* Scenes */}
        <div className="absolute inset-0 flex flex-col" dir="rtl">
          {scene === "intro" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-[4cqw]">
              <LogoMark kit={kit} src={logoSrc} size={88} className={cn(playing && "animate-[pulse-dot_2.8s_ease-in-out_1]")} />
              {kit.introStyle === "title_card" && (
                <p className="px-[8%] text-center text-[9cqw] leading-tight" style={{ fontFamily: fontFamily(kit.fonts.heading), color: kit.colors.text }}>{ctx.businessName}</p>
              )}
            </div>
          )}
          {scene === "hook" && (
            <div className="flex flex-1 flex-col justify-center px-[8%]">
              <p className="text-center text-[10.5cqw] leading-[1.12] [text-wrap:balance]" style={{ fontFamily: fontFamily(kit.fonts.heading), color: kit.colors.text, textShadow: "0 3px 16px rgb(0 0 0 / .5)" }}>
                {ctx.hookText}
              </p>
            </div>
          )}
          {scene === "scene" && (
            <div className="flex flex-1 flex-col justify-end gap-[3cqw] px-[6%] pb-[30%]">
              {kit.lowerThird !== "none" && (
                <div
                  className="w-fit rounded-[3cqw] px-[4cqw] py-[2cqw]"
                  style={kit.lowerThird === "glass"
                    ? { background: "rgb(255 255 255 / .14)", backdropFilter: "blur(10px)", color: kit.colors.text, borderInlineStart: `1.2cqw solid ${kit.colors.primary}` }
                    : { background: kit.colors.primary, color: kit.colors.text }}
                >
                  <p className="text-[5cqw] font-bold leading-tight" style={{ fontFamily: fontFamily(kit.fonts.heading) }}>{ctx.businessName}</p>
                  <p className="text-[3.6cqw] opacity-90" style={{ fontFamily: fontFamily(kit.fonts.body) }}>{ctx.serviceName} · <bdi dir="ltr">{price}</bdi></p>
                </div>
              )}
            </div>
          )}
          {scene === "end" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-[3.5cqw] px-[8%] text-center">
              <LogoMark kit={kit} src={logoSrc} size={64} />
              <p className="text-[8.5cqw] leading-tight" style={{ fontFamily: fontFamily(kit.fonts.heading), color: kit.colors.text }}>
                {kit.endCard.headline || CTA_LABEL[kit.endCard.ctaType].headline}
              </p>
              <span className="rounded-full px-[5cqw] py-[2cqw] text-[4.2cqw] font-bold" style={{ background: kit.colors.accent, color: "#0A0A0F", fontFamily: fontFamily(kit.fonts.body) }}>
                {CTA_LABEL[kit.endCard.ctaType].label}
              </span>
              <ul className="flex flex-wrap justify-center gap-[1.6cqw] text-[3.4cqw]" style={{ color: kit.colors.text, fontFamily: fontFamily(kit.fonts.body) }}>
                {kit.endCard.showWhatsapp && <EndItem icon={<MessageCircle />} text={kit.endCard.whatsappNumber || ctx.phone} ltr />}
                {kit.endCard.showPhone && <EndItem icon={<Phone />} text={ctx.phone} ltr />}
                {kit.endCard.showWebsite && ctx.website && <EndItem icon={<Globe />} text={ctx.website} ltr />}
                {kit.endCard.showInstagram && ctx.instagram && <EndItem icon={<AtSign />} text={ctx.instagram} ltr />}
                {kit.endCard.showAddress && ctx.address && <EndItem icon={<MapPin />} text={ctx.address} />}
              </ul>
              {kit.endCard.showQr && (
                <span className="flex size-[16cqw] items-center justify-center rounded-[2cqw] bg-white text-black"><QrCode className="size-[11cqw]" aria-hidden /></span>
              )}
              {(ctx.lockedDisclaimer || kit.endCard.disclaimer || kit.endCard.license) && (
                <div className="absolute inset-x-[6%] bottom-[5%] flex flex-col gap-[0.6cqw] text-[2.7cqw] opacity-80" style={{ color: kit.colors.text }}>
                  {ctx.lockedDisclaimer && <p>{ctx.lockedDisclaimer}</p>}
                  {kit.endCard.disclaimer && <p>{kit.endCard.disclaimer}</p>}
                  {kit.endCard.license && <p>{kit.endCard.license}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Captions (hook + scene) */}
        {(scene === "hook" || scene === "scene") && (
          <div className="absolute inset-x-[6%] bottom-[14%] flex justify-center">
            <CaptionPreview preset={kit.captionPreset} colors={colors} text={captionText} active={active} size={width * 0.072} />
          </div>
        )}
        {/* Logo watermark and corner bug */}
        {kit.watermark.on && scene !== "end" && scene !== "intro" && (
          <div className={cn("absolute", wmPos)} style={{ opacity: kit.watermark.opacity / 100 }}>
            <LogoMark kit={kit} src={logoSrc} size={26} />
          </div>
        )}
        {!kit.watermark.on && kit.endCard.logoBug && scene === "scene" && (
          <div className="absolute bottom-[16%] inset-e-[6%] opacity-80"><LogoMark kit={kit} src={logoSrc} size={22} /></div>
        )}
      </PhoneFrame>

      <div className="flex items-center gap-2" dir="rtl">
        <div role="group" aria-label={p.label} className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
          {scenes.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={i === idx}
              onClick={() => { setIdx(i); setPaused(true); }}
              className={cn("rounded-full px-3 py-1 text-micro text-text-2 transition-colors hover:text-text", i === idx && "bg-surface-3 text-text")}
            >
              {s === "intro" ? brandCopy.editor.intro.intro : s === "hook" ? p.scenes.hook : s === "scene" ? p.scenes.scene : p.scenes.end}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((x) => !x)}
          disabled={reduce}
          aria-label={paused || reduce ? p.play : p.pause}
          className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-text-2 hover:text-text disabled:opacity-40"
        >
          {paused || reduce ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        </button>
        <button type="button" onClick={() => setIdx(0)} aria-label={p.replay} className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-text-2 hover:text-text">
          <RotateCcw className="size-4" aria-hidden />
        </button>
      </div>
      <p className="text-micro font-normal text-muted">{p.sampleNote}</p>
    </div>
  );
}

function EndItem({ icon, text, ltr }: { icon: React.ReactNode; text: string; ltr?: boolean }) {
  return (
    <li className="flex items-center gap-[1cqw] rounded-full bg-black/35 px-[2.4cqw] py-[1cqw] [&_svg]:size-[3.4cqw]">
      {icon}
      {ltr ? <bdi dir="ltr">{text}</bdi> : text}
    </li>
  );
}
