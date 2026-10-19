import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { HeroActions, PageHero } from "@/components/marketing/page/kit";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { PAGE_PLATFORMS, hooksOfPlatform, placeholdersIn } from "@/components/hooks/hook-data";
import { signupHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { nicheCategories } from "@/lib/data/seed";
import { PLATFORM_LABEL, PLATFORM_LABEL_L, type Platform } from "@/lib/labels";
import { HOOKS_COPY } from "@/content/he/hooks";
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
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: PLATFORM_LABEL[platform], href: `/hooks/platform/${platform}` },
  ];
  const shown = groups.flatMap((g) => g.hooks);

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        title={P.h1(l)}
        sub={plural(all.length, HOOKS_COPY.niche.hooksCount)}
        actions={<HeroActions primary={P.cta(l)} primaryHref={signupHref(`/app/create?platform=${platform}&src=hooks`)} secondary={P.all(l)} secondaryHref={`/hooks?platform=${platform}`} />}
        className="pb-4 md:pb-8"
      >
        <nav aria-label={P.other} className="flex flex-wrap justify-center gap-2.5">
          {PAGE_PLATFORMS.map((p) => (
            <Link
              key={p}
              href={`/hooks/platform/${p}`}
              aria-current={p === platform ? "page" : undefined}
              className={cn(
                "inline-flex h-11 items-center rounded-full px-5 text-body font-semibold transition-colors",
                p === platform ? "bg-ink text-paper dark:bg-text dark:text-bg" : "bg-surface-1 text-text-2 ring-hairline hover:text-text",
              )}
            >
              {PLATFORM_LABEL[p]}
            </Link>
          ))}
        </nav>
      </PageHero>

      <div className="container-marketing flex flex-col gap-14">
        <HookPersonalizer fields={placeholdersIn(shown)} />
        {groups.map((g) => (
          <section key={g.c.slug} aria-labelledby={`pl-${g.c.slug}`}>
            <h2 id={`pl-${g.c.slug}`} className="mb-6 text-h2 font-black">{g.c.name_he}</h2>
            <ul className="grid items-start gap-4 md:grid-cols-2">
              {g.hooks.map((h) => (
                <li key={h.id} className="contents"><HookCard hook={h} location="platform_page" /></li>
              ))}
            </ul>
          </section>
        ))}
        <div className="flex justify-center">
          <Link href={`/hooks?platform=${platform}`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            {P.all(l)} <DirIcon name="forward" />
          </Link>
        </div>
      </div>
      <FinalCta />
    </HooksProvider>
  );
}
