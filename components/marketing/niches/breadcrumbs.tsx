import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Part 01 §10.16: nav "פירורי לחם", separator DirIcon next, last item aria-current. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="פירורי לחם" className={cn("text-small", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-text-2">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-text hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-text")}>
                  {c.label}
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

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://${BRAND.domain}${c.href}` } : {}),
    })),
  };
}

/** <script type="application/ld+json"> with "<" escaped (Part 01 §10.16). */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export const absUrl = (path: string) => `https://${BRAND.domain}${path}`;
