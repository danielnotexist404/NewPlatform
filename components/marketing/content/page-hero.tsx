import * as React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { renderInline } from "./inline";

/** Shared header of the content pages: breadcrumbs, eyebrow, H1, lede, optional aside art. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  aside,
  children,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-70" />
      <div className="container-marketing relative pt-8 pb-12 md:pt-12 md:pb-16">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-10 grid items-center gap-10", aside && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]")}>
          <div className="max-w-3xl">
            {eyebrow && <p className="text-micro text-primary-text">{eyebrow}</p>}
            <h1 className="mt-3 text-h1">{title}</h1>
            {lede && <p className="mt-5 max-w-2xl text-body-lg text-text-2">{renderInline(lede, "site", "lede")}</p>}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}
