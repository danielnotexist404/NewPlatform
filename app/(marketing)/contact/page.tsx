import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Accessibility, Clock, LifeBuoy, Lock, Mail, MessageCircle, Undo2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageHero } from "@/components/marketing/content/page-hero";
import { ContactForm } from "@/components/marketing/content/contact-form";
import { Skeleton } from "@/components/ui/misc";
import { BRAND, whatsappHref } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";
import { CONTACT } from "@/content/he/site";

export const metadata: Metadata = {
  title: { absolute: CONTACT.meta.title },
  description: CONTACT.meta.description,
  alternates: { canonical: "/contact" },
};

type Channel = { key: string; icon: LucideIcon; title: string; text: string; href: string; action: string; ltr?: boolean; external?: boolean };

function channels(): Channel[] {
  const c = CONTACT.channels;
  const wa = whatsappHref();
  const a11yName = [BRAND.a11y.coordinatorTitle, BRAND.a11y.coordinatorName].every((v) => isFilled(v))
    ? `${BRAND.a11y.coordinatorTitle}: ${BRAND.a11y.coordinatorName}`
    : c.a11y.text;
  const list: (Channel | null)[] = [
    wa ? { key: "wa", icon: MessageCircle, title: c.whatsapp.title, text: c.whatsapp.text, href: wa, action: c.whatsapp.action, external: true } : null,
    { key: "hello", icon: Mail, title: c.hello.title, text: c.hello.text, href: `mailto:${BRAND.emails.hello}`, action: BRAND.emails.hello, ltr: true },
    { key: "support", icon: LifeBuoy, title: c.support.title, text: c.support.text, href: `mailto:${BRAND.emails.support}`, action: BRAND.emails.support, ltr: true },
    { key: "cancel", icon: Undo2, title: c.cancel.title, text: c.cancel.text, href: "/app/billing/cancel", action: c.cancel.action },
    { key: "a11y", icon: Accessibility, title: c.a11y.title, text: a11yName, href: "/legal/accessibility", action: c.a11y.action },
    { key: "privacy", icon: Lock, title: c.privacy.title, text: c.privacy.text, href: `mailto:${BRAND.emails.privacy}`, action: BRAND.emails.privacy, ltr: true },
  ];
  return list.filter((x): x is Channel => !!x);
}

function FormFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[4.5rem]" />
        ))}
      </div>
      <Skeleton className="h-44" />
      <Skeleton className="h-12 w-40 rounded-full" />
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="pb-8">
      <PageHero crumbs={[{ label: CONTACT.crumb }]} eyebrow={CONTACT.eyebrow} title={CONTACT.h1} lede={CONTACT.lede} />

      <section aria-labelledby="channels" className="container-marketing">
        <h2 id="channels" className="sr-only">{CONTACT.channelsTitle}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels().map((ch) => {
            const Icon = ch.icon;
            const inner = (
              <>
                <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-md bg-surface-2 text-primary-text shadow-[inset_0_0_0_1px_var(--color-frame)]">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="text-h3">{ch.title}</span>
                  <span className="text-small text-text-2">{ch.text}</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-small font-semibold text-primary-text">
                  {ch.ltr ? <bdi dir="ltr">{ch.action}</bdi> : ch.action}
                  {!ch.ltr && <DirIcon name="forward" className="size-4" />}
                </span>
              </>
            );
            const cls =
              "group flex h-full flex-col gap-4 rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 transition-[background-color,box-shadow] hover:bg-surface-2 hover:elev-2";
            return (
              <li key={ch.key}>
                {ch.href.startsWith("/") ? (
                  <Link href={ch.href} className={cls}>{inner}</Link>
                ) : (
                  <a href={ch.href} className={cls} {...(ch.external ? { target: "_blank", rel: "noopener" } : {})}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="form-title" className="container-marketing mt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="relative overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-24 inset-s-[-6rem] size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <h2 id="form-title" className="text-h2">{CONTACT.formTitle}</h2>
              <p className="mt-2 mb-8 text-text-2">{CONTACT.formLede}</p>
              <Suspense fallback={<FormFallback />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <h2 className="flex items-center gap-2 text-body font-bold">
                <Clock aria-hidden className="size-4 text-primary-text" />
                {CONTACT.hoursTitle}
              </h2>
              <p className="mt-2 text-small text-text-2">{CONTACT.hours}</p>
            </div>
            <nav aria-labelledby="quick-links" className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <h2 id="quick-links" className="text-body font-bold">{CONTACT.asideTitle}</h2>
              <ul className="mt-3 flex flex-col">
                {CONTACT.asideLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center justify-between gap-3 border-b border-border py-3 text-small text-text-2 transition-colors last:border-0 hover:text-text">
                      {l.label}
                      <DirIcon name="next" className="size-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </div>
  );
}
