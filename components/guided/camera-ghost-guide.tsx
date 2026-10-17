import type { GhostKind } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

/**
 * CameraGhostGuide (spec 07–08 §J.7): a 9:16 viewfinder with a dashed "ghost" of where things go.
 * Mock: no getUserMedia yet — the scene behind the ghost is CSS art. The frame is media, so it stays dark
 * and LTR (the overlay drawing never mirrors).
 */
export function CameraGhostGuide({
  ghost, hint, shotLabel, framingLabel, recording, elapsed, captured, className,
}: {
  ghost: GhostKind;
  hint: string;
  shotLabel: string;
  framingLabel: string;
  recording: boolean;
  elapsed: number;
  captured?: boolean;
  className?: string;
}) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div
      className={cn(
        "@container relative isolate aspect-reel w-full overflow-hidden rounded-[28px] bg-black text-white shadow-[0_0_0_6px_var(--color-surface-2),0_0_0_7px_var(--color-border)] elev-3 transition-shadow",
        recording && "shadow-[0_0_0_6px_var(--color-surface-2),0_0_0_8px_var(--color-rose)]",
        className,
      )}
    >
      {/* simulated scene */}
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "radial-gradient(70% 45% at 30% 30%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 70%), radial-gradient(60% 40% at 80% 75%, color-mix(in oklab, var(--color-violet) 25%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-white) 6%, var(--color-black)), var(--color-black))" }} />
      <div aria-hidden className="absolute inset-0 opacity-60 blur-xl" style={{ backgroundImage: "radial-gradient(25% 18% at 60% 55%, color-mix(in oklab, var(--color-white) 18%, transparent), transparent), radial-gradient(18% 14% at 25% 70%, color-mix(in oklab, var(--color-rose) 25%, transparent), transparent)" }} />
      {/* rule of thirds */}
      <div aria-hidden className="absolute inset-0" dir="ltr">
        <span className="absolute inset-y-0 inset-s-1/3 w-px bg-white/15" />
        <span className="absolute inset-y-0 inset-s-2/3 w-px bg-white/15" />
        <span className="absolute inset-x-0 top-1/3 h-px bg-white/15" />
        <span className="absolute inset-x-0 top-2/3 h-px bg-white/15" />
      </div>
      <GhostSvg ghost={ghost} />

      {/* top bar */}
      <div className="absolute inset-x-[4cqi] top-[4cqi] flex items-center justify-between gap-2" dir="ltr">
        <span className={cn("num flex items-center gap-[1.6cqi] rounded-full px-[3cqi] py-[1cqi] text-[4cqi] font-semibold", recording ? "bg-rose text-black" : "bg-black/55")}>
          <span aria-hidden className={cn("size-[2.4cqi] rounded-full", recording ? "animate-pulse-dot bg-black" : "bg-rose")} />
          {mm}:{ss}
        </span>
        <span dir="rtl" className="rounded-full bg-black/55 px-[3cqi] py-[1cqi] text-[3.8cqi] font-semibold backdrop-blur-sm">
          {shotLabel} · {framingLabel}
        </span>
      </div>

      {/* hint */}
      <p className="absolute inset-x-[8cqi] bottom-[6cqi] rounded-full bg-black/60 px-[4cqi] py-[2cqi] text-center text-[4.2cqi] font-semibold backdrop-blur-sm">
        {hint}
      </p>

      {captured && !recording && (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/45">
          <span className="flex size-[22cqi] items-center justify-center rounded-full bg-success text-black">
            <svg viewBox="0 0 24 24" className="size-[12cqi]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
        </div>
      )}
    </div>
  );
}

function GhostSvg({ ghost }: { ghost: GhostKind }) {
  const s = { fill: "none", stroke: "var(--color-primary)", strokeWidth: 0.9, strokeDasharray: "2.4 1.8", strokeLinecap: "round" as const, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg aria-hidden viewBox="0 0 90 160" preserveAspectRatio="none" className="absolute inset-0 size-full opacity-90" style={{ direction: "ltr" }}>
      {/* corner brackets */}
      <g stroke="var(--color-white)" strokeOpacity=".55" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M6 18 v-6 h6" /><path d="M84 18 v-6 h-6" /><path d="M6 142 v6 h6" /><path d="M84 142 v6 h-6" />
      </g>
      {ghost === "tripod_wide" && (
        <g {...s}>
          {[14, 30, 45, 60, 76].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={i % 2 ? 66 : 70} rx="4.2" ry="5" />
              <path d={`M${x - 8} ${i % 2 ? 92 : 96} q0 -16 8 -17 q8 1 8 17`} />
            </g>
          ))}
          <path d="M4 104 H86" strokeDasharray="1 2.4" />
        </g>
      )}
      {ghost === "hands_table" && (
        <g {...s}>
          <path d="M0 98 H90" />
          <ellipse cx="45" cy="112" rx="24" ry="12" />
          <path d="M8 150 q2 -22 12 -24 q8 0 7 12 l-2 12" />
          <path d="M82 150 q-2 -22 -12 -24 q-8 0 -7 12 l2 12" />
        </g>
      )}
      {ghost === "face_center" && (
        <g {...s}>
          <ellipse cx="45" cy="62" rx="17" ry="22" />
          <path d="M14 128 q2 -34 31 -36 q29 2 31 36" />
          <path d="M38 58 h2 M50 58 h2" strokeDasharray="none" />
        </g>
      )}
      {ghost === "product_center" && (
        <g {...s}>
          <rect x="21" y="56" width="48" height="48" rx="6" />
          <path d="M45 74 v12 M39 80 h12" strokeDasharray="none" />
        </g>
      )}
      {ghost === "cover_lens" && (
        <g {...s}>
          <rect x="10" y="22" width="70" height="116" rx="4" />
          <path d="M22 34 L68 126 M68 34 L22 126" strokeDasharray="1.2 2.4" strokeOpacity=".7" />
        </g>
      )}
    </svg>
  );
}

