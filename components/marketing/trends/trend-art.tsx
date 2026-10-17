import * as React from "react";
import { Heart } from "lucide-react";
import { ReelArt, ArtChip, DurationChip, nicheIcon, toneFor, type ReelTone } from "@/components/marketing/gallery/reel-art";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import type { TrendTemplateV1 } from "@/lib/mock/trends";
import { cn } from "@/lib/utils";

const TREND_TONE: Record<string, ReelTone> = {
  "bait-and-sign": "gold",
  "behind-the-viral": "rose",
  "almost-got-me-reveal": "violet",
  "fake-system-popup": "lemon",
  "pov-deadpan": "violet",
  "before-after-snap": "success",
  "day-in-the-life": "gold",
  "asmr-process": "rose",
  "myth-vs-fact": "violet",
  "reply-to-comment": "success",
  "price-reveal": "gold",
  "quick-how-to": "rose",
};

function firstExample(t: TrendTemplateV1, nicheSlug?: string) {
  const ad = (nicheSlug && t.niche_adaptations.find((a) => a.niche_slug === nicheSlug)) || t.niche_adaptations[0];
  const text = ad ? Object.values(ad.onscreen_examples_he)[0] : undefined;
  return { ad, text: text ?? t.hook_variants[0]?.hook_line_he_pattern ?? t.name_he };
}

/** The overlay mock per `overlay.kind` (spec §J.5) — CSS only, Hebrew rendered by us. */
function OverlayMock({ t, text, size }: { t: TrendTemplateV1; text: string; size: "sm" | "md" | "lg" }) {
  const big = size !== "sm";
  const kind = t.required_overlays[0];
  switch (kind) {
    case "sign":
      return (
        <div className="absolute inset-x-[16%] top-[40%] [perspective:600px]">
          <div className="origin-bottom rotate-[-4deg] [transform:rotateX(8deg)_rotate(-4deg)] rounded-[3px] bg-white px-3 py-4 text-center shadow-[0_18px_40px_rgb(0_0_0/.55)]">
            <p className={cn("font-display leading-[1.02] text-black", big ? "text-[30px] md:text-[34px]" : "text-[22px]")}>{text}</p>
          </div>
          <Heart aria-hidden className="absolute -top-4 inset-e-0 size-7 fill-rose text-rose drop-shadow" />
        </div>
      );
    case "fake_ui":
      return (
        <div className="absolute inset-x-[12%] top-[38%]">
          <div className="rounded-[18px] bg-white/85 px-4 pt-4 text-center text-black shadow-[0_20px_50px_rgb(0_0_0/.5)] backdrop-blur-md">
            <p className={cn("font-bold", big ? "text-[17px]" : "text-[14px]")}>{text}</p>
            <p className={cn("mt-0.5 text-black/70", big ? "text-[13px]" : "text-[11px]")}>נותרו 10%</p>
            <div className={cn("mt-3 grid grid-cols-2 border-t border-black/15 font-semibold text-black/80", big ? "text-[14px]" : "text-[12px]")}>
              <span className="border-e border-black/15 py-2">מצב חיסכון</span>
              <span className="py-2">סגירה</span>
            </div>
          </div>
        </div>
      );
    case "meme_caption":
      return (
        <>
          <div className="absolute inset-x-[7%] top-[12%] text-center">
            <p className={cn("font-black leading-tight text-white [-webkit-text-stroke:1.2px_black] [paint-order:stroke_fill] [text-shadow:0_3px_0_rgb(0_0_0/.8)]", big ? "text-[22px]" : "text-[16px]")}>{text}</p>
          </div>
          <div className="absolute inset-s-1/2 top-[44%] h-[26%] w-[46%] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 rotate-6 rounded-[4px] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_55%,var(--color-black)),color-mix(in_oklab,var(--color-primary)_30%,var(--color-black)))] shadow-[0_24px_40px_rgb(0_0_0/.6)]" />
          <span className="absolute bottom-[14%] inset-s-[8%] rounded-xs bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">צולם ב-AI</span>
        </>
      );
    case "bts_label":
      return (
        <>
          <div className="absolute inset-x-0 top-[9%] flex justify-center">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-bold text-black", big ? "text-[14px]" : "text-[11px]")}>
              <span aria-hidden className="size-2 animate-pulse-dot rounded-full bg-danger" />
              מאחורי הקלעים
            </span>
          </div>
          <div className="absolute inset-x-[9%] top-[20%] text-center">
            <p className={cn("font-extrabold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)]", big ? "text-[18px]" : "text-[13px]")}>{text}</p>
          </div>
        </>
      );
    case "split_reveal":
      return (
        <>
          <div className="absolute inset-y-0 inset-e-0 w-1/2 bg-[linear-gradient(180deg,rgb(255_255_255/.12),rgb(255_255_255/.04))]" />
          <div className="absolute inset-y-[6%] inset-s-1/2 w-[3px] rounded-full bg-white shadow-[0_0_18px_rgb(255_255_255/.7)]" />
          <span className="absolute top-[46%] inset-s-[10%] rounded-xs bg-black/60 px-2 py-0.5 text-[12px] font-bold text-white">לפני</span>
          <span className="absolute top-[46%] inset-e-[10%] rounded-xs bg-white px-2 py-0.5 text-[12px] font-bold text-black">אחרי</span>
          <div className="absolute inset-x-[8%] top-[14%] text-center">
            <p className={cn("font-extrabold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)]", big ? "text-[19px]" : "text-[14px]")}>{text}</p>
          </div>
        </>
      );
    case "comment_bubble":
      return (
        <div className="absolute inset-x-[9%] top-[22%]">
          <div className="flex items-start gap-2 rounded-[14px] bg-white p-3 text-start text-black shadow-[0_16px_36px_rgb(0_0_0/.45)]">
            <span aria-hidden className="mt-0.5 size-7 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--color-violet),var(--color-rose))]" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-black/60">לקוח שאל:</p>
              <p className={cn("font-semibold leading-snug", big ? "text-[15px]" : "text-[12px]")}>{text}</p>
            </div>
          </div>
        </div>
      );
    case "rating":
      return (
        <>
          <div className="absolute inset-x-[9%] top-[16%] text-center">
            <p className={cn("font-extrabold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)]", big ? "text-[18px]" : "text-[13px]")}>{text}</p>
          </div>
          <div className="absolute inset-x-0 top-[50%] flex justify-center">
            <span className={cn("-rotate-12 rounded-[8px] border-[3px] border-rose px-3 py-1 font-black text-rose [text-shadow:0_0_14px_rgb(0_0_0/.6)]", big ? "text-[26px]" : "text-[18px]")}>
              ✗ לא נכון
            </span>
          </div>
        </>
      );
    case "pov_label":
      return (
        <div className="absolute inset-x-[8%] top-[15%] text-center">
          <p className={cn("font-extrabold leading-snug text-white [text-shadow:0_2px_14px_rgb(0_0_0/.75)]", big ? "text-[20px]" : "text-[14px]")}>{text}</p>
        </div>
      );
    case "clock":
      return (
        <>
          <div className="absolute inset-s-[8%] top-[11%]">
            <span dir="ltr" className={cn("num rounded-[6px] bg-black/60 px-2 py-0.5 font-mono font-bold text-primary", big ? "text-[22px]" : "text-[15px]")}>
              {t.slug === "quick-how-to" ? "0:20" : "06:30"}
            </span>
          </div>
          <div className="absolute inset-x-[8%] top-[24%] text-center">
            <p className={cn("font-extrabold leading-snug text-white [text-shadow:0_2px_14px_rgb(0_0_0/.75)]", big ? "text-[18px]" : "text-[13px]")}>{text}</p>
          </div>
        </>
      );
    case "price":
      return (
        <>
          <div className="absolute inset-x-0 top-[34%] flex justify-center">
            <span className={cn("rotate-[-3deg] rounded-[10px] bg-primary px-4 py-2 font-black text-on-primary shadow-[0_18px_40px_rgb(0_0_0/.5)]", big ? "text-[30px]" : "text-[20px]")}>
              ₪ המחיר שלכם
            </span>
          </div>
          <div className="absolute inset-x-[8%] top-[14%] text-center">
            <p className={cn("font-extrabold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)]", big ? "text-[17px]" : "text-[13px]")}>כמה זה עולה באמת?</p>
          </div>
        </>
      );
    default:
      return (
        <div className="absolute inset-x-[8%] top-[16%] text-center">
          <p className={cn("font-extrabold leading-snug text-white [text-shadow:0_2px_14px_rgb(0_0_0/.75)]", big ? "text-[19px]" : "text-[14px]")}>{text}</p>
        </div>
      );
  }
}

export function TrendArt({
  trend,
  nicheSlug,
  size = "md",
  tag,
  showDuration = true,
  className,
}: {
  trend: TrendTemplateV1;
  nicheSlug?: string;
  size?: "sm" | "md" | "lg";
  tag?: React.ReactNode;
  showDuration?: boolean;
  className?: string;
}) {
  const { ad, text } = firstExample(trend, nicheSlug);
  const niche = ad ? getNiche(ad.niche_slug) : undefined;
  return (
    <ReelArt
      tone={TREND_TONE[trend.slug] ?? toneFor(trend.slug)}
      icon={nicheIcon(niche?.icon)}
      size={size}
      className={className}
      topEnd={tag}
      bottomEnd={showDuration ? <DurationChip sec={trend.default_duration_sec} /> : undefined}
      bottomStart={niche ? <ArtChip>{nicheShortName(niche)}</ArtChip> : undefined}
    >
      <OverlayMock t={trend} text={text} size={size} />
    </ReelArt>
  );
}
