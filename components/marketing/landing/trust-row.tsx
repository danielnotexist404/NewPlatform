import { Banknote, Gift, Info, Percent, ReceiptText, RotateCcw, type LucideIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { LANDING } from "@/content/he/landing";

const ICONS: Record<string, LucideIcon> = { Gift, Percent, Banknote, ReceiptText, RotateCcw };
const T = LANDING.trust;

/** TrustRow (Part 02 §3.3.4) + "0% מתקציב הפרסום" (spec §A.3). */
export function TrustRow() {
  return (
    <ul aria-label={T.label} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-micro font-normal text-text-2 md:gap-x-1">
      {T.items.map((item, i) => {
        const Icon = ICONS[item.icon];
        return (
          <li key={item.text} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="mx-1.5 hidden text-muted md:inline">·</span>}
            <Icon className="size-4 shrink-0 text-primary-text" aria-hidden />
            <span>{item.text}</span>
            {"footnote" in item && item.footnote && (
              <>
                <Tooltip content={<span className="block max-w-64 text-small leading-relaxed">{T.footnote}</span>}>
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
                    aria-label={T.footnoteLabel}
                    aria-describedby="trust-footnote"
                  >
                    <Info className="size-3.5" aria-hidden />
                  </button>
                </Tooltip>
                <span id="trust-footnote" className="sr-only">{T.footnote}</span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
