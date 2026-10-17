import type { Metadata } from "next";
import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { HookText } from "@/components/hooks/hook-text";
import { typeHookCount, typesOfFamily } from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { hookFamilies, hookTypes } from "@/lib/data/seed";
import { HOOKS_COPY } from "@/content/he/hooks";

const T = HOOKS_COPY.types;

export const metadata: Metadata = pageMeta({
  title: plural(hookTypes.length, T.title),
  short: T.titleShort,
  description: T.description,
  path: "/hooks/types",
});

export default function HookTypesPage() {
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: HOOKS_COPY.crumbs.types, href: "/hooks/types" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="container-marketing pt-8 pb-6 md:pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-h1">{T.h1}</h1>
            <p className="mt-6 max-w-3xl text-body-lg text-text-2">{plural(hookTypes.length, T.intro)}</p>
          </div>
          <nav aria-label="משפחות" className="flex flex-wrap gap-2 lg:justify-end">
            {hookFamilies.map((f) => (
              <a key={f.slug} href={`#${f.slug}`} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-text-2 hover:bg-surface-3 hover:text-text">
                {f.name_he}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-marketing flex flex-col gap-16 pt-8">
        {hookFamilies.map((f, i) => (
          <section key={f.slug} id={f.slug} aria-labelledby={`fam-${f.slug}`} className="scroll-mt-24">
            <div className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-2 border-b border-border pb-4">
              <span className="num text-[2.5rem] font-extrabold leading-none text-primary-text/60">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`fam-${f.slug}`} className="text-h2">{f.name_he}</h2>
                <p className="mt-1 text-text-2">{f.description_he}</p>
              </div>
            </div>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {typesOfFamily(f.slug).map((t) => (
                <li key={t.slug} className="group relative flex flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-h3">
                      <Link href={`/hooks/types/${t.slug}`} className="after:absolute after:inset-0 after:rounded-md">
                        {t.name_he}
                      </Link>
                    </h3>
                    <span className="num shrink-0 rounded-full bg-surface-3 px-2.5 py-0.5 text-micro text-text-2">{plural(typeHookCount(t.slug), T.inLibrary)}</span>
                  </div>
                  <p className="text-small text-text-2">{t.description_he}</p>
                  <blockquote className="rounded-sm border-s-2 border-primary bg-surface-2/60 px-3 py-2 font-semibold">
                    <HookText text={t.example_he} />
                  </blockquote>
                  <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary-text">
                    {T.learn} <DirIcon name="forward" />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
