import Link from "next/link";
import { Accessibility, Cookie, Handshake, Mail, Scale, ShieldCheck, Sparkles, Undo2, UserCheck, ScrollText, History, CircleCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LEGAL_DOCS, LEGAL_UI, type LegalDoc } from "@/content/he/legal";
import { CONTENT_UI } from "@/content/he/site";
import { Breadcrumbs } from "./breadcrumbs";
import { Blocks } from "./blocks";
import { renderInline } from "./inline";
import { splitSections } from "./markdown";
import { Toc } from "./toc";
import { formatHeDate } from "./dates";

export const LEGAL_ICONS: Record<LegalDoc["icon"], LucideIcon> = {
  scale: Scale,
  shield: ShieldCheck,
  cookie: Cookie,
  undo: Undo2,
  a11y: Accessibility,
  sparkles: Sparkles,
  "user-check": UserCheck,
  handshake: Handshake,
};

function DraftBanner() {
  return (
    <div role="note" className="flex items-start gap-3 rounded-md border border-primary-text/40 bg-primary/10 px-4 py-3 text-small text-text">
      <Scale aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-text" />
      <div>
        <p className="font-bold text-primary-text">{LEGAL_UI.draftTitle}</p>
        <p className="text-text-2">{LEGAL_UI.draftBody} {LEGAL_UI.pendingNote}</p>
      </div>
    </div>
  );
}

function CancelLead() {
  return (
    <section aria-label={LEGAL_UI.cancel.button} className="mt-8 flex flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold">{LEGAL_UI.cancel.how}</p>
        <p className="text-small text-text-2">
          {LEGAL_UI.cancel.orEmail} {renderInline(`billing@{{DOMAIN}}`, "legal", "ce")} · {LEGAL_UI.cancel.orPhone} {renderInline("{{SUPPORT_PHONE}}", "legal", "cp")}
        </p>
      </div>
      <Link href="/app/billing/cancel" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
        {LEGAL_UI.cancel.button}
      </Link>
    </section>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { intro, sections } = splitSections(doc.body);
  const toc = sections.map((s, i) => ({ id: s.id, title: s.title, n: i + 1 }));
  const Icon = LEGAL_ICONS[doc.icon];
  const email = BRAND.emails[doc.contact.email];
  const others = LEGAL_DOCS.filter((d) => d.slug !== doc.slug);

  return (
    <article className="pb-8">
      <header className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-70" />
        <div className="container-marketing relative pt-8 pb-10 md:pt-12 md:pb-12">
          <Breadcrumbs items={[{ label: LEGAL_UI.hub.title, href: "/legal" }, { label: doc.title }]} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-md bg-surface-2 text-primary-text shadow-[inset_0_0_0_1px_var(--color-frame)] glow-primary">
                  <Icon className="size-6" />
                </span>
                <span className="text-micro text-muted">{LEGAL_UI.badge}</span>
              </div>
              <h1 className="text-h1">{doc.title}</h1>
              <p className="mt-4 max-w-2xl text-body-lg text-text-2">{doc.description}</p>
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-muted">
                <span>
                  {LEGAL_UI.effectivePrefix}
                  {renderInline("{{LEGAL_EFFECTIVE_DATE}}", "legal", "eff")}
                </span>
                <span aria-hidden>·</span>
                <span>
                  {LEGAL_UI.versionPrefix} <bdi className="num">{doc.version}</bdi>
                </span>
                <span aria-hidden>·</span>
                <span>
                  {LEGAL_UI.updatedPrefix} {formatHeDate(doc.updated)}
                </span>
              </p>
            </div>
          </div>
          {doc.reviewStatus === "draft" && (
            <div className="mt-8 max-w-3xl">
              <DraftBanner />
            </div>
          )}
          {doc.slug === "cancellation" && <div className="max-w-3xl"><CancelLead /></div>}
        </div>
      </header>

      <div className="container-marketing grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <div className="min-w-0">
          <section aria-labelledby="summary-title" className="relative overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 md:p-7">
            <div aria-hidden className="pointer-events-none absolute -top-16 inset-e-[-3rem] size-48 rounded-full bg-primary/10 blur-3xl" />
            <h2 id="summary-title" className="relative mb-4 flex items-center gap-2 text-h3">
              <ScrollText aria-hidden className="size-5 text-primary-text" />
              {LEGAL_UI.summaryTitle}
            </h2>
            <ul className="relative flex flex-col gap-3">
              {doc.summary.map((s, i) => (
                <li key={i} className="flex gap-3 text-body">
                  <CircleCheck aria-hidden className="mt-1 size-5 shrink-0 text-success" />
                  <span>{renderInline(s, "legal", `sum${i}`)}</span>
                </li>
              ))}
            </ul>
            <p className="relative mt-5 border-t border-border pt-4 text-small text-muted">{LEGAL_UI.summaryNote}</p>
          </section>

          <div className="lg:hidden">
            <Toc items={toc} title={CONTENT_UI.tocLegal} variant="mobile" />
          </div>

          <div className="prose-he mt-10 max-w-[72ch]">
            {intro.length > 0 && <Blocks blocks={intro} idPrefix="intro" />}
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id} className="group/section">
                <h2 id={s.id} className="flex scroll-mt-[calc(var(--header-h)+24px)] items-baseline gap-3 text-h3">
                  <span className="num shrink-0 text-primary-text">{i + 1}.</span>
                  <span>{s.title}</span>
                  <a
                    href={`#${s.id}`}
                    aria-label={`${CONTENT_UI.sectionLink}: ${s.title}`}
                    className="text-small font-normal text-muted no-underline opacity-0 transition-opacity group-hover/section:opacity-100 focus-visible:opacity-100"
                  >
                    #
                  </a>
                </h2>
                <Blocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}
          </div>

          <section aria-labelledby="previous-title" className="mt-14 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <h2 id="previous-title" className="mb-2 flex items-center gap-2 text-body font-bold">
              <History aria-hidden className="size-4 text-text-2" />
              {LEGAL_UI.previousTitle}
            </h2>
            <p className="text-small text-text-2">{LEGAL_UI.previousNone}</p>
          </section>

          <section aria-labelledby="doc-contact" className="mt-6 flex flex-col gap-4 rounded-lg bg-surface-2 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="doc-contact" className="text-h3">{LEGAL_UI.contactTitle}</h2>
              <p className="mt-1 text-text-2">{LEGAL_UI.contactBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${email}`} className={cn(buttonVariants({ variant: "secondary" }))}>
                <Mail aria-hidden />
                <bdi dir="ltr">{email}</bdi>
              </a>
              <Link href={`/contact?topic=${doc.contact.topic}`} className={cn(buttonVariants({ variant: "ghost" }))}>
                {LEGAL_UI.contactForm}
                <DirIcon name="forward" />
              </Link>
            </div>
          </section>

          <nav aria-labelledby="more-docs" className="mt-14">
            <h2 id="more-docs" className="mb-4 text-micro text-muted">{LEGAL_UI.moreTitle}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {others.map((d) => {
                const I = LEGAL_ICONS[d.icon];
                return (
                  <li key={d.slug}>
                    <Link href={`/legal/${d.slug}`} className="flex items-center gap-3 rounded-md bg-surface-1 px-4 py-3 text-small font-semibold shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2">
                      <I aria-hidden className="size-4 text-primary-text" />
                      <span className="flex-1">{d.title}</span>
                      <DirIcon name="next" className="size-4 text-muted" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <aside className="hidden lg:block">
          <Toc items={toc} title={CONTENT_UI.tocLegal} variant="desktop" />
        </aside>
      </div>
    </article>
  );
}
