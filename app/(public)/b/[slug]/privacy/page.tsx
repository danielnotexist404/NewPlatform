import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirIcon } from "@/components/a11y/dir-icon";
import { NicheIcon } from "@/components/trends/niche-icon";
import { LP_ID_TYPE, LP_PRIVACY, LP_PUBLIC } from "@/content/he/landing-pages";
import { getPublicPage, PUBLIC_PAGES } from "@/lib/mock/landing-pages";

/** Per-business privacy notice (§S.1; template ⚖️ [Counsel]) — marked "טיוטה". */
export function generateStaticParams() {
  return PUBLIC_PAGES.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublicPage(slug);
  const m = LP_PRIVACY.meta(page?.business.nameHe ?? "");
  return { title: { absolute: m.title }, description: m.description, robots: { index: false, follow: false } };
}

export default function BusinessPrivacyPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-bg" aria-busy="true" />}>
      <Privacy params={params} />
    </Suspense>
  );
}

async function Privacy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPublicPage(slug);
  if (!page) notFound();
  const { business, content: c } = page;
  const address = [c.address.street, c.address.city].filter(Boolean).join(", ");
  const sections = LP_PRIVACY.sections({
    name: business.nameHe,
    legalName: c.legal.legalName || business.nameHe,
    idLabel: LP_ID_TYPE[c.legal.idType],
    idNumber: c.legal.idNumber,
    address,
  });
  return (
    <div className="min-h-dvh bg-bg">
      <p className="bg-violet/15 px-4 py-2 text-center text-micro text-text">{LP_PUBLIC.sampleRibbon}</p>
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary-text">
            <NicheIcon icon={business.nicheIcon} className="size-[18px]" />
          </span>
          <Link href={`/b/${slug}`} className="font-bold hover:underline">{business.nameHe}</Link>
        </div>
      </div>
      <article className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 md:py-14">
        <Link href={`/b/${slug}`} className="inline-flex w-fit items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
          <DirIcon name="back" />
          {LP_PRIVACY.back}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-h1">{LP_PRIVACY.h1}</h1>
          <span className="rounded-xs bg-lemon px-2 py-0.5 text-micro text-on-primary">{LP_PRIVACY.draftBadge}</span>
        </div>
        <p role="note" className="rounded-md bg-primary/10 p-4 text-small shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]">
          {LP_PRIVACY.draftBanner}
        </p>
        <div className="prose-he">
          <p className="text-text-2">{business.nameHe}</p>
          {sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <hr />
          <p className="text-small text-muted">{LP_PRIVACY.updated}</p>
        </div>
      </article>
    </div>
  );
}
