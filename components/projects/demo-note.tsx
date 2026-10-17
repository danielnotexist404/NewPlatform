import { FlaskConical } from "lucide-react";
import { APP_CORE } from "@/content/he/app-core";
import { cn } from "@/lib/utils";

/** Marks screens that run on sample data ("נתוני דוגמה"), as required for mock data shown to users. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)} title={APP_CORE.demo.note}>
      <FlaskConical className="size-3.5 text-violet" aria-hidden />
      {APP_CORE.demo.badge}
      <span className="sr-only">: {APP_CORE.demo.note}</span>
    </span>
  );
}
