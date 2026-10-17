import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clapperboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { HookText } from "@/components/hooks/hook-text";
import { PAGE_PLATFORMS, hooksOfPlatform, placeholdersIn } from "@/components/hooks/hook-data";
import { signupHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { nicheCategories } from "@/lib/data/seed";
import { PLATFORM_LABEL, PLATFORM_LABEL_L, type Platform } from "@/lib/labels";
import { HOOKS_COPY, PLATFORM_INTROS } from "@/content/he/hooks";
import { cn } from "@/lib/utils";

const P = HOOKS_COPY.platform;

export function generateStaticParams() {
  return PAGE_PLATFORMS.map((p) => ({ platform: p }));
}

type Props = { params: Promise<{ platform: string }> };
const isPagePlatform = (p: string): p is Exclude<Platform, "linkedin"> => (PAGE_PLATFORMS as string[]).includes(p);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  if (!isPagePlatform(platform)) return {};
  const l = PLATFORM_LABEL_L[platform];
  return pageMeta({
    title: P.title(l),
    short: P.titleShort(l),
    description: P.description(l),
    path: `/hooks/platform/${platform}`,
    index: hooksOfPlatform(platform).length >= 12,
  });
}

export default function PlatformPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PlatformPageView params={params} />
    </Suspense>
  );
}

async function PlatformPageView({ params }: Props) {
  const { platform } = await params;
  if (!isPagePlatform(platform)) notFound();
  const l = PLATFORM_LABEL_L[platform];
  const all = hooksOfPlatform(platform);
  const groups = nicheCategories
    .map((c) => ({ c, hooks: all.filter((h) => h.nicheCategory === c.slug).slice(0, 4) }))
    .filter((g) => g.hooks.length > 0);
  const universal = all.filter((h) => !h.nicheSlug).slice(0, 4);
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: PLATFORM_LABEL[platform], href: `/hooks/platform/${platform}` },
  ];
  const shown = [...groups.flatMap((g) => g.hooks), ...universal];

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="container-marketing pt-8 pb-8 md:pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 num">{plural(all.length, HOOKS_COPY.niche.hooksCount)}</p>
            <h1 className="text-h1">{P.h1(l)}</h1>
            <p className="mt-6 max-w-3xl text-body-lg text-text-2">
              <HookText text={PLATFORM_INTROS[platform]} />
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Link href={signupHref(`/app/create?platform=${platform}&src=hooks`)} className={cn(buttonVariants({ size: "xl" }))}>
              <Clapperboard aria-hidden />
              {P.cta(l)}
            </Link>
            <Link href={`/hooks?platform=${platform}`} className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline">
              {P.all(l)} <DirIcon name="forward" />
            </Link>
          </div>
        </div>
        <nav aria-label={P.other} className="mt-8 flex flex-wrap gap-2">
          {PAGE_PLATFORMS.map((p) => (
            <Link
              key={p}
              href={`/hooks/platform/${p}`}
              aria-current={p === platform ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                p === platform ? "bg-primary text-on-primary" : "bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text",
              )}
            >
              {PLATFORM_LABEL[p]}
            </Link>
          ))}
        </nav>
      </section>

      <div className="container-marketing flex flex-col gap-14">
        <HookPersonalizer fields={placeholdersIn(shown)} />
        {groups.map((g) => (
          <section key={g.c.slug} aria-labelledby={`pl-${g.c.slug}`}>
            <h2 id={`pl-${g.c.slug}`} className="mb-5 text-h3">{g.c.name_he}</h2>
            <ul className="grid items-start gap-4 md:grid-cols-2">
              {g.hooks.map((h) => (
                <li key={h.id} className="contents"><HookCard hook={h} location="platform_page" /></li>
              ))}
            </ul>
          </section>
        ))}
        {universal.length > 0 && (
          <section aria-labelledby="pl-universal">
            <h2 id="pl-universal" className="mb-5 text-h3">{HOOKS_COPY.hub.sections.universal}</h2>
            <ul className="grid items-start gap-4 md:grid-cols-2">
              {universal.map((h) => (
                <li key={h.id} className="contents"><HookCard hook={h} location="platform_page" /></li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex justify-center">
          <Link href={`/hooks?platform=${platform}`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            {P.all(l)} <DirIcon name="forward" />
          </Link>
        </div>
      </div>
    </HooksProvider>
  );
}
