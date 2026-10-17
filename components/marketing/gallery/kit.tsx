import * as React from "react";
import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { cn } from "@/lib/utils";

/**
 * Small building blocks shared by the pricing, campaigns, trends and gallery pages
 * (Part 01 §10.16 `SectionHeading`, `Breadcrumbs`, `JsonLd` — local copies until the shared ones exist).
 */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: As = "h2",
  align = "start",
  id,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <As id={id} className={cn(As === "h1" ? "text-h1" : As === "h2" ? "text-h2" : "text-h3", "max-w-3xl")}>
        {title}
      </As>
      {subtitle && <p className={cn("text-body-lg max-w-2xl text-text-2", align === "center" && "mx-auto")}>{subtitle}</p>}
    </div>
  );
}

export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="פירורי לחם" className={cn("text-small text-text-2", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="rounded-xs hover:text-text hover:underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-text")}>
                  {item.label}
                </span>
              )}
              {!last && <DirIcon name="next" className="size-3.5 text-muted" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; "<" is escaped so the payload can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbLd(items: { label: string; href: string }[], domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: `https://${domain}${it.href}` })),
  };
}

export function faqLd(items: { q_he: string; a_he: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q_he, acceptedAnswer: { "@type": "Answer", text: f.a_he } })),
  };
}

/** "דוגמה" / "הדגמה" chip — sample data must always be labelled (Part 00 §3 principle 9). */
export function SampleTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary", className)}>
      {children}
    </span>
  );
}

/** Wide band with the projector glow used for final CTAs. */
export function CtaBand({ title, body, children }: { title: React.ReactNode; body?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="container-marketing py-16 md:py-24">
      <div className="relative isolate overflow-hidden rounded-xl bg-surface-1 px-6 py-14 text-center shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-12 md:py-20">
        <div aria-hidden className="absolute inset-0 -z-10 bg-projector opacity-90" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-afterglow" />
        <h2 className="font-display text-display mx-auto max-w-4xl leading-[0.95]">{title}</h2>
        {body && <p className="text-body-lg mx-auto mt-5 max-w-2xl text-text-2">{body}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      </div>
    </section>
  );
}
