import type { TrendExplainerV1, TrendRecipeBeatV1 } from "@/lib/mock/trends";
import { TREND_PAGE } from "@/content/he/trends";
import { cn } from "@/lib/utils";

/**
 * "מה קורה ב-3 השניות הראשונות": a 0–3 s timeline (LTR like every media timeline, Hebrew labels)
 * on md+, and an ordered list on mobile. Both come from the same data.
 */
export function FirstSeconds({ items }: { items: TrendExplainerV1["first_seconds_he"] }) {
  const max = 3000;
  return (
    <div className="flex flex-col gap-6">
      {/* desktop timeline */}
      <div className="hidden md:block" aria-hidden>
        <div dir="ltr" className="relative mx-3 h-36">
          <div className="absolute inset-x-0 top-[70px] h-1 rounded-full bg-surface-3" />
          <div className="absolute inset-s-0 top-[70px] h-1 w-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-rose))] opacity-80" />
          {[0, 1000, 2000, 3000].map((t) => (
            <div key={t} className="absolute top-[82px] -translate-x-1/2 font-mono text-micro text-muted" style={{ insetInlineStart: `${(t / max) * 100}%` }}>
              {(t / 1000).toFixed(1)}s
            </div>
          ))}
          {items.map((it, i) => {
            const left = Math.min(it.t_ms, max) / max;
            const up = i % 2 === 0;
            return (
              <div key={i} className="absolute" style={{ insetInlineStart: `${left * 100}%` }}>
                <span className="absolute top-[64px] block size-4 -translate-x-1/2 rounded-full border-[3px] border-bg bg-primary shadow-[0_0_0_2px_var(--color-primary)]" />
                <div
                  className={cn(
                    "absolute w-48 rounded-sm bg-surface-2 px-3 py-2 text-small leading-snug text-text shadow-[inset_0_0_0_1px_var(--color-frame)]",
                    up ? "bottom-[calc(100%-56px)]" : "top-[106px]",
                    left > 0.8 ? "inset-e-0 translate-x-3" : left < 0.15 ? "inset-s-0 -translate-x-3" : "-translate-x-1/2",
                  )}
                >
                  <span dir="rtl" className="block text-start">
                    {it.text_he}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-16" />
      </div>
      {/* list (all widths for AT, visible on mobile) */}
      <ol className="flex flex-col gap-3 md:sr-only">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 min-w-14 items-center justify-center rounded-full bg-primary px-2 font-mono text-micro text-on-primary">
              <bdi dir="ltr">{(it.t_ms / 1000).toFixed(1)}s</bdi>
            </span>
            <span className="text-body">{it.text_he}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Recipe strip: one block per beat, width by duration (LTR media order, Hebrew labels). */
export function RecipeStrip({ beats }: { beats: TrendRecipeBeatV1[] }) {
  const timed = beats.filter((b) => b.role !== "label" && b.role !== "cut");
  const total = timed.reduce((s, b) => s + b.duration_ms, 0) || 1;
  const persistent = beats.filter((b) => b.role === "label");
  const tones: Record<string, string> = {
    bait: "bg-rose/20 text-rose shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-rose)_40%,transparent)]",
    payoff: "bg-primary/20 text-primary-text shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]",
    reveal: "bg-violet/20 text-violet shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_40%,transparent)]",
    cta: "bg-success/15 text-success shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-success)_40%,transparent)]",
  };
  return (
    <div className="flex flex-col gap-4">
      <div dir="ltr" aria-hidden className="hidden gap-1.5 md:flex">
        {timed.map((b) => (
          <div key={b.key} className={cn("flex min-w-0 flex-col justify-between rounded-sm px-3 py-2.5", tones[b.role] ?? "bg-surface-2")} style={{ flexGrow: b.duration_ms, flexBasis: 0 }}>
            <span dir="rtl" className="truncate text-small font-bold">
              {TREND_PAGE.roleLabel[b.role]}
            </span>
            <span className="font-mono text-micro opacity-80">{(b.duration_ms / 1000).toFixed(1)}s</span>
          </div>
        ))}
      </div>
      {persistent.length > 0 && (
        <p className="hidden text-micro text-text-2 md:block" aria-hidden>
          {persistent.map((p) => p.description_he).join(" ")}
        </p>
      )}
      <ol className="flex flex-col gap-3">
        {beats
          .filter((b) => b.role !== "cut" || b.description_he)
          .map((b, i) => (
            <li key={b.key} className="flex gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <span aria-hidden className="font-display text-[34px] leading-none text-muted num">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-body-lg font-bold">{TREND_PAGE.roleLabel[b.role]}</h3>
                  {b.role !== "cut" && b.role !== "label" && (
                    <span className="rounded-xs bg-surface-3 px-1.5 py-0.5 text-micro text-text-2">
                      <bdi dir="ltr" className="num">
                        {(b.duration_ms / 1000).toFixed(1)}s
                      </bdi>{" "}
                      · {TREND_PAGE.visualSourceLabel[b.visual_source]}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-text-2">{b.description_he}</p>
                {b.onscreen_slot && (
                  <p className="mt-2 text-small">
                    <span className="text-muted">{TREND_PAGE.overlayLabel}: </span>
                    <span className="font-semibold">{b.onscreen_slot.example_he}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
