"use client";
import * as React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FAQ, type FaqCategory } from "@/content/he/site";
import { plainText, renderInline } from "./inline";

/** Normalises Hebrew punctuation (״ ׳ → " ') and case so "מע״מ" matches "מעמ". */
function norm(s: string) {
  return s.toLowerCase().replace(/[״"׳'.,:;!?()–—-]/g, "").replace(/\s+/g, " ").trim();
}

/** Grouped FAQ with a client-side filter (Part 02 §9.3). */
export function FaqBrowser({ categories }: { categories: FaqCategory[] }) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState<string[]>([]);
  const query = norm(q);

  const filtered = React.useMemo(() => {
    if (!query) return categories;
    return categories
      .map((c) => ({ ...c, items: c.items.filter((it) => norm(`${it.q} ${plainText(it.a)}`).includes(query)) }))
      .filter((c) => c.items.length > 0);
  }, [categories, query]);

  const total = filtered.reduce((n, c) => n + c.items.length, 0);
  const shownOpen = query ? filtered.flatMap((c) => c.items.map((i) => i.id)) : open;

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="min-w-0">
        <div role="search" className="relative">
          <label htmlFor="faq-search" className="sr-only">
            {FAQ.searchLabel}
          </label>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <Input
              id="faq-search"
              type="search"
              size="lg"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={FAQ.searchPlaceholder}
              aria-describedby="faq-count"
              className="h-14 rounded-full bg-surface-1 ps-12 pe-12 text-body-lg elev-2 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label={FAQ.clear}
                className="absolute inset-e-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-2 hover:bg-surface-3 hover:text-text"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
          <p id="faq-count" aria-live="polite" className={cn("mt-2 text-small text-muted", !query && "sr-only")}>
            {FAQ.results(total)}
          </p>
        </div>

        {total === 0 ? (
          <div className="mt-10 flex flex-col items-start gap-4 rounded-lg bg-surface-1 p-8 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <p className="text-body-lg">{FAQ.empty}</p>
            <Link href="/contact" className={cn(buttonVariants())}>
              {FAQ.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-14">
            {filtered.map((c) => (
              <section key={c.id} aria-labelledby={`faq-${c.id}`} className="scroll-mt-[calc(var(--header-h)+24px)]" id={`cat-${c.id}`}>
                <h2 id={`faq-${c.id}`} className="mb-5 text-h2 font-black">
                  {c.title}
                </h2>
                <Accordion
                  type="multiple"
                  value={shownOpen}
                  onValueChange={(v) => {
                    if (!query) setOpen(v);
                  }}
                  className="flex flex-col gap-3"
                >
                  {c.items.map((it) => (
                    <AccordionItem key={it.id} value={it.id} id={it.id} className="scroll-mt-[calc(var(--header-h)+24px)] rounded-[22px] border-0 bg-surface-1 px-6 ring-hairline md:px-8">
                      <AccordionTrigger className="py-6 text-body-lg font-bold">{it.q}</AccordionTrigger>
                      <AccordionContent className="max-w-[68ch] pb-6 text-body-lg text-text-2 [&_a]:text-link [&_a]:underline">{renderInline(it.a, "site", it.id)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}
      </div>

      <nav aria-label={FAQ.navLabel} className="order-first mb-6">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => {
            const has = filtered.some((f) => f.id === c.id);
            return (
              <li key={c.id}>
                <a
                  href={`#cat-${c.id}`}
                  aria-disabled={!has || undefined}
                  className={cn("inline-flex h-10 items-center rounded-full bg-surface-1 px-4 text-small font-semibold text-text-2 ring-hairline hover:text-text", !has && "pointer-events-none opacity-40")}
                >
                  {c.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
