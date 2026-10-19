import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Generic desktop browser window (product shots). The address bar stays LTR. */
export function BrowserFrame({
  children, url = "kdimon.co.il/app", className, bodyClassName, label, tabs,
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
  bodyClassName?: string;
  label?: string;
  /** Optional UI on the start side of the bar (e.g. a sample badge) */
  tabs?: React.ReactNode;
}) {
  return (
    <figure
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-surface-1 shadow-[0_2px_6px_color-mix(in_oklab,var(--color-ink)_5%,transparent),0_60px_120px_-50px_color-mix(in_oklab,var(--color-ink)_40%,transparent),inset_0_0_0_1px_var(--color-frame)] md:rounded-[28px]",
        className,
      )}
    >
      <div className="flex h-11 items-center gap-3 border-b border-border bg-surface-2 px-4 md:h-12 md:px-5">
        <span aria-hidden className="flex shrink-0 gap-1.5" dir="ltr">
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--color-coral)_70%,var(--color-surface-3))]" />
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_70%,var(--color-surface-3))]" />
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--color-scene-mint)_80%,var(--color-surface-3))]" />
        </span>
        <span aria-hidden className="mx-auto hidden h-7 w-full max-w-sm items-center justify-center gap-1.5 rounded-full bg-surface-1 px-3 text-micro font-normal text-muted ring-hairline sm:inline-flex" dir="ltr">
          <Lock className="size-3" />
          {url}
        </span>
        <span className="ms-auto shrink-0 sm:ms-0">{tabs}</span>
      </div>
      <div className={cn("relative bg-surface-2", bodyClassName)}>{children}</div>
    </figure>
  );
}
