import * as React from "react";
import { health as H } from "@/content/he/campaigns-app";
import { cn } from "@/lib/utils";

/** Health score ring 0–100. Color carries severity, the number and label carry meaning. */
export function ScoreRing({ score, size = 160, label, className, display = false }: { score: number; size?: number; label: string; className?: string; display?: boolean }) {
  const stroke = Math.max(6, Math.round(size / 14));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = score < 50 ? "var(--color-danger)" : score < 75 ? "var(--color-primary)" : "var(--color-success)";
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} role="img" aria-label={`${label}: ${score} ${H.of100}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          style={{ filter: `drop-shadow(0 0 ${size / 16}px color-mix(in oklab, ${color} 55%, transparent))` }}
        />
      </svg>
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold leading-none", display ? "font-display text-display" : size >= 120 ? "text-h1" : "text-h3")}>{score}</span>
        {size >= 120 && <span className="mt-1 text-micro text-muted">{H.of100}</span>}
      </div>
    </div>
  );
}
