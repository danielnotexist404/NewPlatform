import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Accessibility, LifeBuoy, Lock, Mail, MessageCircle, Undo2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageHero } from "@/components/marketing/page/kit";
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
  const all = channels();
  const main = all.filter((c) => ["wa", "hello", "support"].includes(c.key));
  const more = all.filter((c) => !["wa", "hello", "support"].includes(c.key));
  return (
    <>
      <PageHero title="דברו איתנו." accent="בעברית." sub={CONTACT.hours} className="pb-6 md:pb-10">
        <div className="grid gap-6 text-start lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-8">
          <section aria-labelledby="channels" className="flex flex-col gap-4">
            <h2 id="channels" className="sr-only">{CONTACT.channelsTitle}</h2>
            <ul className="flex flex-col gap-4">
              {main.map((ch) => {
                const Icon = ch.icon;
                const inner = (
                  <>
                    <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-ink">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-h3">{ch.title}</span>
                      <span className="truncate text-body font-semibold text-primary-text">{ch.ltr ? <bdi dir="ltr">{ch.action}</bdi> : ch.action}</span>
                    </span>
                    <DirIcon name="forward" className="size-5 shrink-0 text-muted" />
                  </>
                );
                const cls = "group flex items-center gap-4 rounded-[24px] bg-surface-1 p-5 ring-hairline elev-1 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:elev-2 md:p-6";
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
            <ul className="flex flex-wrap gap-x-5 gap-y-2 px-2 pt-2 text-small">
              {more.map((ch) => (
                <li key={ch.key}>
                  {ch.href.startsWith("/") ? (
                    <Link href={ch.href} className="font-semibold text-text-2 hover:text-text">{ch.title}</Link>
                  ) : (
                    <a href={ch.href} className="font-semibold text-text-2 hover:text-text">{ch.title}</a>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="form-title" className="rounded-[32px] bg-surface-1 p-6 ring-hairline elev-3 md:p-10">
            <h2 id="form-title" className="text-h2 font-black">{CONTACT.formTitle}</h2>
            <p className="mt-2 mb-8 text-body text-text-2">{CONTACT.formLede}</p>
            <Suspense fallback={<FormFallback />}>
              <ContactForm />
            </Suspense>
          </section>
        </div>
      </PageHero>
    </>
  );
}
