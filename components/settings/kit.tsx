import * as React from "react";
import Link from "next/link";
import {
  Briefcase, Clapperboard, Coins, Film, ImageUp, LayoutGrid, Palette, ReceiptText, SearchX, Star, Users,
  CircleCheck, Check, Circle, Clock, TriangleAlert, CircleAlert, BookOpen, Info, Lock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accountCommon } from "@/content/he/account";
import { cn } from "./cn";

/* ---------------- Page header ---------------- */
export function PageHeader({
  title, description, actions, back, demo = true, eyebrow, className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  demo?: boolean;
  eyebrow?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex max-w-3xl flex-col gap-2.5">
        {back && (
          <Link href={back.href} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
            <DirIcon name="back" className="size-4" />
            {back.label}
          </Link>
        )}
        {eyebrow}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-h2 font-extrabold">{title}</h1>
          {demo && <DemoBadge />}
        </div>
        {description && <p className="text-body-lg text-text-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/**
 * Tag = Badge look-alike that keeps its `text-micro` size (the shared Badge loses it through tailwind-merge,
 * because the custom type scale is not registered there — reported to the lead).
 */
const TAG = {
  neutral: "bg-surface-3 text-text-2",
  primary: "bg-primary text-on-primary",
  lemon: "bg-lemon text-on-primary",
  violet: "bg-violet/15 text-violet",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  outline: "shadow-[inset_0_0_0_1px_var(--color-border-strong)] text-text-2",
} as const;
export function Tag({ variant = "neutral", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof TAG }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro whitespace-nowrap [&_svg]:size-3.5", TAG[variant], className)} {...props} />;
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Tag variant="outline" className={cn("gap-1.5", className)} title={accountCommon.demoBadgeHint}>
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      {accountCommon.demoBadge}
    </Tag>
  );
}

/* ---------------- Section ---------------- */
export function Section({
  id, title, description, actions, children, className, headingLevel = "h2",
}: {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <section aria-labelledby={`${id}-title`} id={id} className={cn("flex scroll-mt-24 flex-col gap-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <H id={`${id}-title`} className={H === "h2" ? "text-h3" : "text-body-lg font-bold"}>{title}</H>
          {description && <p className="text-small text-text-2">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

/** Card-like panel with consistent padding. */
export function Panel({ className, children, tone = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "danger" | "ai" | "gold" }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-1 p-5 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-6",
        tone === "danger" && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_55%,transparent)]",
        tone === "ai" && "glow-ai",
        tone === "gold" && "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------- Empty state (Part 01 §10.11, §17) ---------------- */
export type EmptyIllustration =
  | "projects" | "library" | "brand" | "hooks-favorites" | "search" | "team" | "clients"
  | "invoices" | "ledger" | "templates" | "approval-done" | "error" | "hooks";

const ILLUSTRATION_ICON: Record<EmptyIllustration, React.ComponentType<{ className?: string }>> = {
  projects: Clapperboard, library: ImageUp, brand: Palette, "hooks-favorites": Star, search: SearchX,
  team: Users, clients: Briefcase, invoices: ReceiptText, ledger: Coins, templates: LayoutGrid,
  "approval-done": CircleCheck, error: Film, hooks: BookOpen,
};

export function EmptyArt({ illustration, size = "section" }: { illustration: EmptyIllustration; size?: "page" | "section" | "inline" }) {
  const Icon = ILLUSTRATION_ICON[illustration];
  const box = size === "page" ? "h-40 w-28" : size === "section" ? "h-28 w-20" : "h-16 w-12";
  const icon = size === "page" ? "size-10" : size === "section" ? "size-7" : "size-5";
  return (
    <div aria-hidden className="relative flex items-center justify-center">
      <div className={cn("absolute -rotate-12 rounded-md bg-surface-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", box, "-translate-x-6 rtl:translate-x-6 opacity-70")} />
      <div className={cn("absolute rotate-12 rounded-md bg-surface-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", box, "translate-x-6 rtl:-translate-x-6 opacity-70")} />
      <div className={cn("relative flex items-center justify-center rounded-md bg-surface-3 glow-primary", box)}>
        <div className="absolute inset-0 rounded-md bg-projector" />
        <Icon className={cn("relative text-primary-text", icon)} />
      </div>
    </div>
  );
}

export function EmptyState({
  illustration, title, description, action, secondaryAction, size = "section", className,
}: {
  illustration: EmptyIllustration;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: "page" | "section" | "inline";
  className?: string;
}) {
  if (size === "inline") {
    return (
      <div className={cn("flex items-center gap-4 py-2", className)}>
        <EmptyArt illustration={illustration} size="inline" />
        <div className="flex flex-col gap-1">
          <p className="font-bold">{title}</p>
          {description && <p className="text-small text-text-2">{description}</p>}
          {action}
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col items-center gap-5 px-4 py-10 text-center", size === "page" && "py-16", className)}>
      <EmptyArt illustration={illustration} size={size} />
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-h3">{title}</h2>
        {description && <p className="text-text-2">{description}</p>}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/* ---------------- Status badge (Part 01 §10.10 subset) ---------------- */
export type StatusTone = "neutral" | "progress" | "waiting" | "success" | "warning" | "danger";
export function StatusPill({ tone, children, className }: { tone: StatusTone; children: React.ReactNode; className?: string }) {
  const map: Record<StatusTone, { cls: string; icon: React.ReactNode }> = {
    neutral: { cls: "bg-surface-3 text-text-2", icon: <Circle aria-hidden /> },
    progress: { cls: "bg-violet/15 text-violet", icon: <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-violet" /> },
    waiting: { cls: "bg-primary/12 text-primary-text", icon: <Clock aria-hidden /> },
    success: { cls: "bg-success/15 text-success", icon: <Check aria-hidden /> },
    warning: { cls: "bg-primary/12 text-primary-text", icon: <TriangleAlert aria-hidden /> },
    danger: { cls: "bg-danger/15 text-danger", icon: <CircleAlert aria-hidden /> },
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro whitespace-nowrap [&_svg]:size-3.5", map[tone].cls, className)}>
      {map[tone].icon}
      {children}
    </span>
  );
}

/* ---------------- Inline notes ---------------- */
export function Note({ tone = "info", children, className, icon }: { tone?: "info" | "warning" | "danger" | "success" | "lock"; children: React.ReactNode; className?: string; icon?: React.ReactNode }) {
  const I = tone === "warning" ? TriangleAlert : tone === "danger" ? CircleAlert : tone === "success" ? CircleCheck : tone === "lock" ? Lock : Info;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-sm px-3.5 py-3 text-small",
        tone === "info" && "bg-surface-2 text-text-2",
        tone === "lock" && "bg-surface-2 text-text-2",
        tone === "warning" && "bg-primary/10 text-text",
        tone === "danger" && "bg-danger/12 text-text",
        tone === "success" && "bg-success/12 text-text",
        className,
      )}
    >
      <span className={cn("mt-0.5 shrink-0 [&_svg]:size-4", tone === "warning" && "text-primary-text", tone === "danger" && "text-danger", tone === "success" && "text-success")}>
        {icon ?? <I aria-hidden />}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/** Link styled as a button (navigation stays a link for a11y). */
export function ButtonLink({ href, variant = "secondary", size = "md", className, children, ...props }: React.ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "outline" | "ghost" | "link"; size?: "sm" | "md" | "lg" }) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

/** Definition-list row used in drawers and dialogs. */
export function DlRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-small text-text-2">{term}</dt>
      <dd className="text-end text-small font-semibold">{children}</dd>
    </div>
  );
}

/** Table shell with horizontal scroll on small screens. */
export function TableShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("-mx-5 overflow-x-auto md:mx-0", className)}>
      <table className="w-full min-w-[640px] border-collapse text-start text-small [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_th]:px-4 [&_th]:text-start [&_thead_th]:py-2.5 [&_thead_th]:text-micro [&_thead_th]:font-semibold [&_thead_th]:text-muted [&_tbody_th]:py-3 [&_tbody_th]:font-semibold [&_thead_tr]:border-b [&_thead_tr]:border-border [&_tbody_tr]:border-b [&_tbody_tr]:border-border [&_tbody_tr:last-child]:border-b-0">
        {children}
      </table>
    </div>
  );
}
