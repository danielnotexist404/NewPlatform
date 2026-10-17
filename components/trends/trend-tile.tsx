import { Check, Heart, Play, X } from "lucide-react";
import { NicheIcon } from "./niche-icon";
import type { TileArt, TileTone } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

/**
 * 9:16 demo-video placeholder for a trend (no external media yet): token gradients + CSS art of the
 * trend's hook moment + the Hebrew on-screen line. Sizes scale with the tile through container units (cqi).
 * The frame is media, so it stays dark in both themes.
 */
const TONE_BG: Record<TileTone, string> = {
  gold: "radial-gradient(90% 55% at 75% 12%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 70%), radial-gradient(70% 50% at 10% 95%, color-mix(in oklab, var(--color-rose) 35%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-primary) 16%, var(--color-black)), var(--color-black))",
  rose: "radial-gradient(90% 55% at 20% 10%, color-mix(in oklab, var(--color-rose) 55%, transparent), transparent 70%), radial-gradient(70% 50% at 90% 90%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-rose) 16%, var(--color-black)), var(--color-black))",
  violet: "radial-gradient(90% 55% at 80% 10%, color-mix(in oklab, var(--color-violet) 60%, transparent), transparent 70%), radial-gradient(70% 50% at 10% 90%, color-mix(in oklab, var(--color-rose) 30%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-violet) 18%, var(--color-black)), var(--color-black))",
  success: "radial-gradient(90% 55% at 25% 12%, color-mix(in oklab, var(--color-success) 45%, transparent), transparent 70%), radial-gradient(70% 50% at 90% 90%, color-mix(in oklab, var(--color-violet) 35%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-success) 14%, var(--color-black)), var(--color-black))",
};

const cardboard = "color-mix(in oklab, var(--color-primary) 48%, var(--color-black))";
const skin = "color-mix(in oklab, var(--color-primary) 30%, var(--color-white))";

export interface TrendTileProps {
  art: TileArt;
  tone: TileTone;
  text: string;
  nicheIcon?: string | null;
  durationSec?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Accessible name; the tile is decorative when omitted. */
  ariaLabel?: string;
}

export function TrendTile({ art, tone, text, nicheIcon, durationSec, label, size = "md", className, ariaLabel }: TrendTileProps) {
  return (
    <div
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("@container relative isolate aspect-reel w-full overflow-hidden rounded-md bg-black text-white select-none", className)}
      style={{ backgroundImage: TONE_BG[tone] }}
    >
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_var(--color-frame)] rounded-[inherit] z-30 pointer-events-none" />
      <TileArtLayer art={art} text={text} />
      {/* bottom scrim + meta */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-[32%] bg-linear-to-t from-black/85 to-transparent" />
      {label && size !== "sm" && (
        <span className="absolute top-[3.5cqi] inset-e-[3.5cqi] z-20 rounded-full bg-black/55 px-[3cqi] py-[1cqi] text-[3.6cqi] font-semibold text-white/90 backdrop-blur-sm">
          {label}
        </span>
      )}
      <div className="absolute inset-x-[4cqi] bottom-[4cqi] z-20 flex items-center justify-between gap-2" dir="ltr">
        <span className="flex size-[13cqi] items-center justify-center rounded-full bg-white/90 text-black">
          <Play className="size-[6cqi] translate-x-[0.4cqi]" fill="currentColor" />
        </span>
        <span className="flex items-center gap-[2cqi]">
          {durationSec ? <span className="num rounded-full bg-black/55 px-[2.6cqi] py-[0.8cqi] text-[4cqi] font-semibold">0:{String(durationSec).padStart(2, "0")}</span> : null}
          {nicheIcon && size !== "sm" ? (
            <span className="flex size-[10cqi] items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
              <NicheIcon name={nicheIcon} className="size-[5.5cqi]" />
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function Person({ className, sheet }: { className?: string; sheet?: boolean }) {
  return (
    <div className={cn("absolute flex flex-col items-center", className)}>
      <span className="block aspect-square w-[42%] rounded-full" style={{ background: skin }} />
      <span className="-mt-[6%] block h-[110%] w-full rounded-t-[45%] bg-white/15" />
      {sheet && <span className="absolute top-[45%] block h-[38%] w-[70%] rotate-[-6deg] rounded-[1px] bg-white" />}
    </div>
  );
}

function splitFirst(text: string, sep: string) {
  const i = text.indexOf(sep);
  return i === -1 ? [text, ""] : [text.slice(0, i), text.slice(i + sep.length)];
}

function TileArtLayer({ art, text }: { art: TileArt; text: string }) {
  switch (art) {
    case "sign":
      return (
        <div className="absolute inset-0 z-10">
          <span className="absolute top-[13%] inset-x-0 mx-auto block aspect-square w-[30%] rounded-full" style={{ background: skin }} />
          <span className="absolute top-[11%] inset-x-0 mx-auto block h-[5%] w-[30%] rounded-full bg-black/80" />
          <span className="absolute top-[32%] inset-x-[14%] block h-[60%] rounded-t-[40%] bg-white/12" />
          <div className="absolute top-[37%] inset-x-[11%] [perspective:500px]">
            <div className="rounded-[0.6cqi] bg-white px-[5cqi] py-[7cqi] text-center text-black shadow-[0_2cqi_6cqi_rgb(0_0_0/.5)] [transform:rotateY(-10deg)_rotate(-3deg)]">
              <p className="font-display text-[10.5cqi] leading-[1.02] font-bold">{text}</p>
            </div>
          </div>
          <Heart className="absolute bottom-[19%] inset-e-[12%] size-[12cqi] rotate-12 text-rose drop-shadow" fill="currentColor" aria-hidden />
        </div>
      );
    case "fake_ui": {
      const [title, body] = splitFirst(text, " · ");
      return (
        <div className="absolute inset-0 z-10">
          {/* table + plate */}
          <span className="absolute inset-x-0 bottom-0 block h-[45%] bg-linear-to-b from-transparent to-black/30" style={{ backgroundColor: cardboard }} />
          <span className="absolute bottom-[10%] inset-x-0 mx-auto block aspect-square w-[78%] rounded-full bg-white/85 shadow-[0_3cqi_8cqi_rgb(0_0_0/.5)]" />
          <span className="absolute bottom-[15%] inset-x-0 mx-auto block aspect-square w-[58%] rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, var(--color-lemon), var(--color-primary) 45%, color-mix(in oklab, var(--color-primary) 40%, var(--color-black)) 100%)" }} />
          <span className="absolute bottom-[4%] inset-e-[4%] block h-[16%] w-[22%] rotate-[-20deg] rounded-[2cqi]" style={{ background: skin }} />
          {/* popup */}
          <div className="absolute top-[24%] inset-x-[12%] overflow-hidden rounded-[5cqi] bg-white/88 text-center text-black shadow-[0_3cqi_10cqi_rgb(0_0_0/.55)] backdrop-blur-md">
            <div className="px-[5cqi] pt-[5cqi] pb-[3.5cqi]">
              <p className="text-[5.4cqi] leading-tight font-bold">{title}</p>
              {body && <p className="mt-[1cqi] text-[4.2cqi] leading-snug text-black/75">{body}</p>}
            </div>
            <p className="border-t border-black/15 py-[2.6cqi] text-[4.4cqi] font-semibold text-black/80">אישור</p>
            <p className="border-t border-black/15 py-[2.6cqi] text-[4.4cqi] font-bold">סגירה</p>
          </div>
        </div>
      );
    }
    case "meme_caption":
      return (
        <div className="absolute inset-0 z-10">
          <p className="absolute top-[9%] inset-x-[6%] text-center text-[7.6cqi] leading-tight font-extrabold text-white [paint-order:stroke_fill] [-webkit-text-stroke:1.4cqi_var(--color-black)]">{text}</p>
          {[
            "top-[34%] inset-s-[18%] w-[22%] rotate-[18deg]", "top-[30%] inset-s-[52%] w-[26%] rotate-[-12deg]", "top-[48%] inset-s-[34%] w-[34%] rotate-[8deg]",
            "top-[44%] inset-s-[70%] w-[18%] rotate-[32deg]", "top-[58%] inset-s-[8%] w-[24%] rotate-[-22deg]", "top-[60%] inset-s-[62%] w-[26%] rotate-[14deg]",
          ].map((pos) => (
            <span key={pos} className={cn("absolute block aspect-square rounded-[1cqi] shadow-[0_2cqi_5cqi_rgb(0_0_0/.5)]", pos)} style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${cardboard} 70%, var(--color-white)), ${cardboard})` }}>
              <span className="absolute inset-x-0 top-1/2 block h-[14%] -translate-y-1/2 bg-black/20" />
            </span>
          ))}
          <span className="absolute bottom-[22%] inset-x-0 block h-[2.5%] bg-white/30" />
          <span className="absolute bottom-[25.5%] inset-x-0 block h-[1%] bg-white/20" />
          <span className="absolute bottom-[17%] inset-e-[5%] rounded-full bg-black/60 px-[2.6cqi] py-[0.8cqi] text-[3.6cqi] font-semibold text-white">צולם ב-AI</span>
        </div>
      );
    case "bts_label":
      return (
        <div className="absolute inset-0 z-10">
          <span className="absolute top-[7%] inset-x-0 mx-auto w-fit rounded-full bg-black/60 px-[4cqi] py-[1.4cqi] text-[4.6cqi] font-bold whitespace-nowrap text-white backdrop-blur-sm">מאחורי הקלעים</span>
          <span className="absolute bottom-[30%] inset-x-[4%] block h-[14%] rounded-[1cqi]" style={{ backgroundColor: cardboard }} />
          <Person className="bottom-[44%] inset-s-[8%] w-[16%] h-[18%]" />
          <Person className="bottom-[44%] inset-s-[28%] w-[15%] h-[24%]" sheet />
          <Person className="bottom-[44%] inset-s-[47%] w-[16%] h-[34%]" />
          <Person className="bottom-[30%] inset-s-[66%] w-[14%] h-[16%]" />
          <Person className="bottom-[44%] inset-s-[80%] w-[14%] h-[21%]" />
          <span className="absolute bottom-[24%] inset-s-[45%] block h-[10%] w-[1.2%] rotate-[14deg] bg-white/50" />
          <span className="absolute bottom-[24%] inset-s-[51%] block h-[10%] w-[1.2%] rotate-[-14deg] bg-white/50" />
          <p className="absolute bottom-[17%] inset-x-[7%] line-clamp-2 text-center text-[4.8cqi] leading-snug font-bold text-white">{text}</p>
        </div>
      );
    case "pov_label":
      return (
        <div className="absolute inset-0 z-10">
          <div className="absolute top-[14%] inset-x-[8%] text-center">
            <p dir="ltr" className="text-[13cqi] leading-none font-extrabold text-primary">POV:</p>
            <p className="mt-[3cqi] text-[6.6cqi] leading-tight font-bold text-white">{text}</p>
          </div>
          <span className="absolute bottom-[26%] inset-x-0 mx-auto block aspect-square w-[34%] rounded-full" style={{ background: skin }} />
          <span className="absolute bottom-[34%] inset-s-[38%] block h-[1.6%] w-[8%] rounded-full bg-black/70" />
          <span className="absolute bottom-[34%] inset-s-[54%] block h-[1.6%] w-[8%] rounded-full bg-black/70" />
          <span className="absolute bottom-[29%] inset-s-[44%] block h-[1.2%] w-[12%] rounded-full bg-black/50" />
          <span className="absolute -bottom-[2%] inset-x-[16%] block h-[28%] rounded-t-[45%] bg-white/15" />
        </div>
      );
    case "split_reveal":
      return (
        <div className="absolute inset-0 z-10" dir="ltr">
          <div className="absolute inset-y-0 inset-s-0 w-1/2 bg-black/55 [filter:saturate(.2)]" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 4cqi, rgb(255 255 255 / .05) 4cqi 8cqi)" }} />
          <div className="absolute inset-y-0 inset-e-0 w-1/2" style={{ background: "radial-gradient(80% 50% at 50% 45%, color-mix(in oklab, var(--color-success) 40%, transparent), transparent 75%)" }} />
          <span className="absolute inset-y-0 inset-x-0 mx-auto block w-[1.2cqi] bg-white shadow-[0_0_4cqi_rgb(255_255_255/.6)]" />
          <span className="absolute top-1/2 inset-x-0 mx-auto flex size-[12cqi] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[5cqi] font-bold text-black">⇆</span>
          <span className="absolute top-[8%] inset-s-[6%] rounded-full bg-black/60 px-[3cqi] py-[1cqi] text-[4.2cqi] font-bold">לפני</span>
          <span className="absolute top-[8%] inset-e-[6%] rounded-full bg-white px-[3cqi] py-[1cqi] text-[4.2cqi] font-bold text-black">אחרי</span>
          <p dir="rtl" className="absolute bottom-[18%] inset-x-[7%] text-center text-[6cqi] leading-tight font-extrabold text-white">{text}</p>
        </div>
      );
    case "clock": {
      const m = text.match(/^(\d{1,2}:\d{2})[.,]?\s*(.*)$/);
      const time = m?.[1] ?? "06:30";
      const rest = m ? m[2] : text;
      return (
        <div className="absolute inset-0 z-10">
          <span className="absolute inset-x-0 bottom-[20%] block h-[40%]" style={{ background: "radial-gradient(60% 70% at 50% 100%, color-mix(in oklab, var(--color-lemon) 55%, transparent), transparent 70%)" }} />
          <div className="absolute top-[22%] inset-x-0 mx-auto w-fit rounded-[3cqi] bg-white/10 px-[5cqi] py-[2cqi] shadow-[inset_0_0_0_0.4cqi_rgb(255_255_255/.25)] backdrop-blur-sm">
            <p dir="ltr" className="num text-[16cqi] leading-none font-extrabold text-white">{time}</p>
          </div>
          {rest && <p className="absolute top-[46%] inset-x-[8%] text-center text-[6.4cqi] leading-tight font-bold text-white">{rest}</p>}
        </div>
      );
    }
    case "satisfying":
      return (
        <div className="absolute inset-0 z-10">
          <span className="absolute top-[22%] inset-x-0 mx-auto block aspect-square w-[70%] rounded-full opacity-90 blur-[0.3cqi]" style={{ background: "conic-gradient(from 30deg, var(--color-rose), var(--color-primary), var(--color-lemon), var(--color-violet), var(--color-rose))" }} />
          {[62, 48, 34, 20].map((w) => (
            <span key={w} className="absolute inset-x-0 mx-auto block aspect-square -translate-y-1/2 rounded-full shadow-[inset_0_0_0_0.5cqi_rgb(255_255_255/.35)]" style={{ width: `${w}%`, top: `calc(22% + 35cqi)` }} />
          ))}
          <p className="absolute top-[9%] inset-x-[8%] text-center text-[7cqi] leading-tight font-extrabold text-white">{text}</p>
        </div>
      );
    case "rating":
      return (
        <div className="absolute inset-0 z-10">
          <span className="absolute top-[9%] inset-e-[8%] rounded-full bg-white/15 px-[3cqi] py-[1cqi] text-[4cqi] font-bold">מיתוס</span>
          <p className="absolute top-[20%] inset-x-[8%] text-center text-[6.8cqi] leading-tight font-extrabold text-white">{text}</p>
          <span className="absolute top-[50%] inset-s-[18%] flex size-[30cqi] rotate-[-14deg] items-center justify-center rounded-full border-[1.6cqi] border-rose text-rose">
            <X className="size-[20cqi]" strokeWidth={3} aria-hidden />
          </span>
          <span className="absolute top-[58%] inset-e-[16%] flex size-[18cqi] rotate-[10deg] items-center justify-center rounded-full bg-success text-black">
            <Check className="size-[11cqi]" strokeWidth={3} aria-hidden />
          </span>
        </div>
      );
    case "comment_bubble": {
      const [lead, q] = text.startsWith("לקוח שאל:") ? ["לקוח שאל:", text.slice("לקוח שאל:".length).trim()] : ["לקוח שאל:", text];
      return (
        <div className="absolute inset-0 z-10">
          <div className="absolute top-[16%] inset-x-[9%] rounded-[4cqi] bg-white p-[4cqi] text-black shadow-[0_3cqi_10cqi_rgb(0_0_0/.5)]">
            <div className="flex items-center gap-[2.4cqi]">
              <span className="block size-[8cqi] rounded-full bg-black/15" />
              <span className="text-[4.2cqi] font-bold">{lead}</span>
            </div>
            <p className="mt-[2cqi] text-[5.4cqi] leading-snug font-semibold">{q}</p>
          </div>
          <span className="absolute bottom-[26%] inset-x-0 mx-auto block aspect-square w-[30%] rounded-full" style={{ background: skin }} />
          <span className="absolute -bottom-[2%] inset-x-[18%] block h-[26%] rounded-t-[45%] bg-white/15" />
        </div>
      );
    }
    case "price":
      return (
        <div className="absolute inset-0 z-10">
          <p dir="ltr" className="absolute top-[18%] inset-x-0 text-center font-display text-[42cqi] leading-none font-bold text-primary drop-shadow-[0_0_6cqi_color-mix(in_oklab,var(--color-primary)_45%,transparent)]">₪?</p>
          <p className="absolute top-[56%] inset-x-[8%] text-center text-[6.6cqi] leading-tight font-extrabold text-white">{text}</p>
        </div>
      );
    case "how_to":
      return (
        <div className="absolute inset-0 z-10">
          <p className="absolute top-[11%] inset-x-[8%] text-center text-[7.4cqi] leading-tight font-extrabold text-white">{text}</p>
          <span dir="ltr" className="num absolute top-[4%] inset-s-[6%] rounded-full bg-white/15 px-[2.6cqi] py-[0.6cqi] text-[3.8cqi] font-semibold">0:20</span>
          <ol className="absolute top-[34%] inset-x-[10%] flex flex-col gap-[3.4cqi]">
            {[78, 64, 70].map((w, i) => (
              <li key={i} className="flex items-center gap-[3cqi]">
                <span className="num flex size-[10cqi] shrink-0 items-center justify-center rounded-full bg-success text-[5.4cqi] font-extrabold text-black">{i + 1}</span>
                <span className="block h-[3.2cqi] rounded-full bg-white/35" style={{ width: `${w}%` }} />
              </li>
            ))}
          </ol>
        </div>
      );
    default:
      return <p className="absolute top-[40%] inset-x-[8%] z-10 text-center text-[7cqi] font-bold">{text}</p>;
  }
}
