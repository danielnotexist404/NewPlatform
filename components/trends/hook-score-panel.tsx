import { Check, Lightbulb, X } from "lucide-react";
import { HookScoreRing } from "./trend-badges";
import { HOOK_CHECK_LABEL, TREND_DETAIL } from "@/content/he/trends-app";
import { HOOK_CHECKS, hookScore, type TrendTemplate } from "@/lib/mock/trends-app";
import { cn } from "@/lib/utils";

/** "ציון הוק" panel for a trend demo (§S.4): score, the deterministic checks and what to improve. */
export function HookScorePanel({ trend }: { trend: TrendTemplate }) {
  const score = hookScore(trend);
  const failed = HOOK_CHECKS.filter((c) => !trend.hookChecks[c.key]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <HookScoreRing score={score} />
        <div className="flex flex-col gap-2">
          <p className="text-small text-text-2">{TREND_DETAIL.score.caption}</p>
          {failed.length > 0 && (
            <div className="rounded-sm bg-surface-2 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <p className="flex items-center gap-1.5 text-micro text-primary-text">
                <Lightbulb aria-hidden className="size-3.5" />
                {TREND_DETAIL.score.suggestionsTitle}
              </p>
              <ul className="mt-1 flex flex-col gap-1 text-small">
                {failed.map((c) => <li key={c.key}>{HOOK_CHECK_LABEL[c.key].fix}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {HOOK_CHECKS.map((c) => {
          const pass = trend.hookChecks[c.key];
          return (
            <li key={c.key} className="flex items-start gap-2 text-small">
              <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", pass ? "bg-success/15 text-success" : "bg-rose/15 text-rose")}>
                {pass ? <Check aria-hidden className="size-3.5" /> : <X aria-hidden className="size-3.5" />}
              </span>
              <span className={pass ? "text-text" : "text-text-2"}>
                {HOOK_CHECK_LABEL[c.key].label}
                <span className="sr-only">: {pass ? TREND_DETAIL.score.passed : TREND_DETAIL.score.failed}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
