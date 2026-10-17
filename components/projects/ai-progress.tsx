import { cn } from "@/lib/utils";

/** Determinate AI progress bar (violet → gold) with a moving sheen; the sheen stops under reduced motion (global rules). */
export function AiProgress({ value, label, className }: { value: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className="absolute inset-y-0 inset-s-0 rounded-full transition-[width] duration-500 ease-[var(--ease-out)]"
        style={{ width: `${v}%`, backgroundImage: "linear-gradient(90deg, var(--color-violet), var(--color-primary))" }}
      >
        <div className="absolute inset-0 animate-shimmer opacity-60" style={{ backgroundImage: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-white) 45%, transparent), transparent)", backgroundSize: "200% 100%" }} />
      </div>
    </div>
  );
}

/** "52%" as one LTR-isolated token. */
export function Pct({ value, className }: { value: number; className?: string }) {
  return <bdi dir="ltr" className={cn("num", className)}>{Math.round(value)}%</bdi>;
}
