import * as React from "react";
import { cn } from "@/lib/utils";

/** Page section with a consistent vertical rhythm and an optional eyebrow + heading block. */
export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("container-marketing py-12 md:py-16", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({ id, eyebrow, title, subtitle, className, action, as: As = "h2" }: {
  id?: string; eyebrow?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; className?: string; action?: React.ReactNode; as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-3 inline-flex rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">{eyebrow}</p>}
        <As id={id} className={As === "h1" ? "text-h1" : "text-h2"}>
          {title}
        </As>
        {subtitle && <p className="mt-3 text-body-lg text-text-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
