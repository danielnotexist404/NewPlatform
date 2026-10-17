import * as React from "react";
import Link from "next/link";
import { FlaskConical, type LucideIcon } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  sub,
  actions,
  back,
  className,
  children,
}: {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      {back && (
        <Link href={back.href} className="inline-flex w-fit items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
          <DirIcon name="prev" className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow && (
            <p className="inline-flex items-center gap-1.5 text-micro text-primary-text">
              {EyebrowIcon && <EyebrowIcon className="size-4" aria-hidden />}
              {eyebrow}
            </p>
          )}
          <h1 className="text-h2">{title}</h1>
          {sub && <p className="max-w-2xl text-body text-text-2">{sub}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}

/** "נתוני דוגמה" — every screen that shows mock data says so (brief: sample data must be labelled). */
export function SampleNote({ text, action, className }: { text: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-dashed border-border-strong bg-surface-1/60 px-3 py-2 text-small text-text-2", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">
        <FlaskConical className="size-3.5" aria-hidden />
        נתוני דוגמה
      </span>
      <span className="min-w-0 grow basis-64">{text}</span>
      {action}
    </div>
  );
}

export function SectionTitle({ title, sub, action, id, className }: { title: string; sub?: React.ReactNode; action?: React.ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-4 gap-y-2", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 id={id} className="text-h3">{title}</h2>
        {sub && <p className="text-small text-text-2">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
