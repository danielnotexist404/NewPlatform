import type { Metadata } from "next";
import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs } from "@/components/marketing/content/breadcrumbs";
import { LEGAL_ICONS } from "@/components/marketing/content/legal-page";
import { formatHeDate } from "@/components/marketing/content/dates";
import { LEGAL_DOCS, LEGAL_UI } from "@/content/he/legal";

export const metadata: Metadata = {
  title: LEGAL_UI.hub.metaTitle,
  description: LEGAL_UI.hub.description,
  alternates: { canonical: "/legal" },
};

export default function LegalHubPage() {
  return (
    <div className="pb-8">
      <header className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-70" />
        <div className="container-marketing relative pt-8 pb-12 md:pt-12 md:pb-16">
          <Breadcrumbs items={[{ label: LEGAL_UI.hub.title }]} />
          <p className="mt-10 text-micro text-primary-text">{LEGAL_UI.hub.eyebrow}</p>
          <h1 className="mt-3 text-h1">{LEGAL_UI.hub.title}</h1>
          <p className="mt-4 max-w-2xl text-body-lg text-text-2">{LEGAL_UI.hub.lede}</p>
        </div>
      </header>
      <div className="container-marketing">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LEGAL_DOCS.map((d) => {
            const Icon = LEGAL_ICONS[d.icon];
            return (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 transition-[background-color,box-shadow] hover:bg-surface-2 hover:elev-2"
                >
                  <span aria-hidden className="pointer-events-none absolute -top-12 inset-e-[-2rem] size-36 rounded-full bg-primary/0 blur-2xl transition-colors group-hover:bg-primary/15" />
                  <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-md bg-surface-2 text-primary-text shadow-[inset_0_0_0_1px_var(--color-frame)]">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex flex-1 flex-col gap-2">
                    <span className="text-h3">{d.title}</span>
                    <span className="text-small text-text-2">{d.description}</span>
                  </span>
                  <span className="flex items-center justify-between gap-3 border-t border-border pt-4 text-micro font-normal text-muted">
                    <span>
                      {LEGAL_UI.updatedPrefix} {formatHeDate(d.updated)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary-text">
                      {LEGAL_UI.hub.open}
                      <DirIcon name="forward" className="size-3.5 transition-transform rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
