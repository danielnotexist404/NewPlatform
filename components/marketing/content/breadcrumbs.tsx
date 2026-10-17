import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { BRAND } from "@/lib/constants";
import { CONTENT_UI } from "@/content/he/site";
import { cn } from "@/lib/utils";
import { JsonLd } from "./json-ld";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumbs (Part 01 §10.16): "ראשי › …", last item aria-current, BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: CONTENT_UI.home, href: "/" }, ...items];
  return (
    <>
      <nav aria-label={CONTENT_UI.breadcrumbsLabel} className={cn("text-small", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-text-2">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {c.href && !last ? (
                  <Link href={c.href} className="rounded-xs hover:text-text hover:underline">
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `https://${BRAND.domain}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
