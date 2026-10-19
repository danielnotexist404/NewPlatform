import Link from "next/link";
import { reveal } from "@/components/marketing/media/reveal";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, ctaArrow, quietCta } from "@/components/layout/cta-styles";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Page kit for the clean marketing pages: one big hero line, big visuals, very little body text.
 * Server components only.
 */

export const h1Class = "text-[clamp(2.5rem,1.3rem+4.6vw,5.5rem)] font-black leading-[1.03] text-text";
export const h2Class = "text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] font-black leading-[1.08] text-text";
export const leadClass = "text-[clamp(1.125rem,1rem+0.45vw,1.375rem)] leading-relaxed text-text-2";

/** Soft glow behind a hero. Decorative. */
export function HeroGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        className="absolute inset-x-0 top-0 h-[520px] bg-dots opacity-50"
        style={{ maskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)", WebkitMaskImage: "radial-gradient(50% 70% at 50% 0%, #000, transparent)" }}
      />
      <div
        className="absolute inset-x-0 top-[38%] mx-auto h-[60%] max-w-[1100px] rounded-[50%] opacity-80 blur-3xl"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 30%, transparent), color-mix(in oklab, var(--color-coral) 12%, transparent) 55%, transparent 75%)" }}
      />
    </div>
  );
}

export function PageHero({
  title, accent, sub, actions, children, eyebrow, className, align = "center", id = "hero",
}: {
  title: React.ReactNode;
  accent?: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  /** The visual (below on mobile, below or beside on desktop) */
  children?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
  align?: "center" | "split";
  id?: string;
}) {
  const text = (
    <div className={cn("flex flex-col", align === "center" ? "items-center text-center" : "items-start text-start")}>
      {eyebrow && <div className="rise mb-6">{eyebrow}</div>}
      <h1 id={`${id}-title`} className={cn("rise max-w-[16ch]", h1Class)}>
        {title}
        {accent && <> <span className="text-accent-gradient">{accent}</span></>}
      </h1>
      {sub && <p className={cn("rise mt-6 max-w-[36rem] [--d:100ms]", leadClass)}>{sub}</p>}
      {actions && <div className={cn("rise mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row [--d:180ms]", align === "center" && "items-center justify-center")}>{actions}</div>}
    </div>
  );
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative isolate overflow-x-clip pb-12 pt-14 md:pb-20 md:pt-24", className)}>
      <HeroGlow />
      <div className="container-marketing">
        {align === "split" && children ? (
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {text}
            <div className="rise [--d:220ms]">{children}</div>
          </div>
        ) : (
          <>
            {text}
            {children && <div className="rise mt-14 md:mt-20 [--d:240ms]">{children}</div>}
          </>
        )}
      </div>
    </section>
  );
}

/** Primary + quiet CTA pair. */
export function HeroActions({ primary, primaryHref = SIGNUP_HREF, secondary, secondaryHref }: { primary: string; primaryHref?: string; secondary?: string; secondaryHref?: string }) {
  return (
    <>
      <Link href={primaryHref} className={cn(accentCta, "h-14 w-full px-8 text-lg sm:w-auto")}>
        {primary}
        <DirIcon name="forward" className={ctaArrow} />
      </Link>
      {secondary && secondaryHref && (
        <Link href={secondaryHref} className={cn(quietCta, "h-14 px-6 text-base")}>
          {secondary}
        </Link>
      )}
    </>
  );
}

/** Section with a big centered heading. */
export function Band({
  id, title, sub, children, className, align = "center", tight = false,
}: {
  id: string;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  align?: "center" | "start";
  tight?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={title ? `${id}-title` : undefined} className={cn("relative scroll-mt-20", tight ? "py-12 md:py-16" : "py-16 md:py-28", className)}>
      <div className="container-marketing">
        {title && (
          <div className={cn(reveal, "flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start text-start")}>
            <h2 id={`${id}-title`} className={cn("max-w-[20ch]", h2Class)}>{title}</h2>
            {sub && <p className={cn("max-w-xl", leadClass)}>{sub}</p>}
          </div>
        )}
        {children && <div className={cn(title && "mt-12 md:mt-16")}>{children}</div>}
      </div>
    </section>
  );
}

/** Soft tinted stage for a visual. */
export function VisualPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate flex items-center justify-center overflow-hidden rounded-[32px] bg-surface-2 ring-hairline", className)}>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots opacity-50"
        style={{ maskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%, #000, transparent)" }}
      />
      <span
        aria-hidden
        className="absolute -top-28 inset-s-[-12%] -z-10 size-96 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 34%, transparent), transparent)" }}
      />
      {children}
    </div>
  );
}

/** Text + visual row; alternate with `flip`. */
export function FeatureRow({
  id, title, text, visual, flip = false, link, kicker,
}: {
  id: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  visual: React.ReactNode;
  flip?: boolean;
  link?: { href: string; label: string };
  kicker?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative scroll-mt-20 py-12 md:py-20">
      <div className="container-marketing grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className={cn(reveal, "flex flex-col items-start gap-5", flip && "lg:order-2")}>
          {kicker && <span className="text-body font-bold text-primary-text">{kicker}</span>}
          <h2 id={`${id}-title`} className={cn("max-w-[14ch]", h2Class)}>{title}</h2>
          {text && <p className={cn("max-w-md", leadClass)}>{text}</p>}
          {link && <MoreLink href={link.href}>{link.label}</MoreLink>}
        </div>
        <div className={reveal}>{visual}</div>
      </div>
    </section>
  );
}

export function MoreLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-1.5 text-body font-semibold text-primary-text hover:underline", className)}>
      {children}
      <DirIcon name="forward" className="size-4 transition-transform duration-300 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Big stat / promise strip: 3–4 short items in a row. */
export function PromiseStrip({ items, className }: { items: readonly { title: string; text?: string }[]; className?: string }) {
  return (
    <ul className={cn("grid gap-px overflow-hidden rounded-[28px] bg-border ring-hairline sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((it) => (
        <li key={it.title} className="flex flex-col gap-1 bg-surface-1 px-7 py-8">
          <p className="text-h3 font-extrabold text-text">{it.title}</p>
          {it.text && <p className="text-body text-text-2">{it.text}</p>}
        </li>
      ))}
    </ul>
  );
}

/** Pill chip */
export function Chip({ children, active = false, className }: { children: React.ReactNode; active?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small font-semibold", active ? "bg-accent-gradient text-ink" : "bg-surface-1 text-text-2 ring-hairline", className)}>
      {children}
    </span>
  );
}

/** Collapsed "more details" block (native <details>, no JS). */
export function Disclosure({ summary, children, className, defaultOpen = false }: { summary: React.ReactNode; children: React.ReactNode; className?: string; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className={cn("group rounded-[28px] bg-surface-1 ring-hairline open:shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--color-ink)_25%,transparent)]", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[28px] px-6 py-6 text-body-lg font-bold text-text md:px-8 md:text-[1.25rem] [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text transition-transform duration-300 group-open:rotate-45">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
        </span>
      </summary>
      <div className="px-4 pb-6 md:px-8 md:pb-8">{children}</div>
    </details>
  );
}
