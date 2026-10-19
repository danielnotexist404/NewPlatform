import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { Band, PageHero } from "@/components/marketing/page/kit";
import { DirIcon } from "@/components/a11y/dir-icon";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
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
      <PageHero title={T.h1} sub={`${hookTypes.length} סוגי פתיחה. בחרו אחד, וקבלו הוקים לנישה שלכם.`} className="pb-4 md:pb-8">
        <nav aria-label="משפחות" className="flex flex-wrap justify-center gap-2.5">
          {hookFamilies.map((f) => (
            <a key={f.slug} href={`#${f.slug}`} className="inline-flex h-11 items-center rounded-full bg-surface-1 px-5 text-body font-semibold text-text-2 ring-hairline hover:text-text">
              {f.name_he}
            </a>
          ))}
        </nav>
      </PageHero>

      {hookFamilies.map((f) => (
        <Band key={f.slug} id={f.slug} title={f.name_he} tight>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {typesOfFamily(f.slug).map((t) => (
              <li key={t.slug} className="group relative flex flex-col gap-4 rounded-[24px] bg-surface-1 p-6 ring-hairline transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:elev-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-h3">
                    <Link href={`/hooks/types/${t.slug}`} className="after:absolute after:inset-0 after:rounded-[24px]">
                      {t.name_he}
                    </Link>
                  </h3>
                  <span className="num shrink-0 rounded-full bg-surface-3 px-2.5 py-0.5 text-micro text-text-2">{plural(typeHookCount(t.slug), T.inLibrary)}</span>
                </div>
                <blockquote className="text-body-lg font-bold leading-snug text-text">
                  <HookText text={t.example_he} />
                </blockquote>
                <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-primary-text">
                  {T.learn} <DirIcon name="forward" />
                </span>
              </li>
            ))}
          </ul>
        </Band>
      ))}
      <FinalCta />
    </>
  );
}
