import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { reelFromHook, reelFromText } from "@/components/marketing/media/reel-data";
import { HeroGlow, h2Class } from "@/components/marketing/page/kit";
import { cn } from "@/lib/utils";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { HookScore } from "@/components/hooks/hook-score";
import { ALL_HOOKS, hookById, hooksOfNiche } from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { getHookType } from "@/lib/data/seed";
import { HOOKS_COPY } from "@/content/he/hooks";

const S = HOOKS_COPY.single;

export function generateStaticParams() {
  return ALL_HOOKS.map((h) => ({ id: h.id }));
}

type Props = { params: Promise<{ id: string }> };

const cut = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}…`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const h = hookById.get(id);
  if (!h) return {};
  const t = getHookType(h.typeSlug);
  const plainText = h.text.replace(/\{([^}]+)\}/g, (_, n: string) => n.replace(/_/g, " "));
  const canonical = h.seasonSlug && !h.nicheSlug ? `/hooks/season/${h.seasonSlug}` : h.nicheSlug ? `/hooks/${h.nicheSlug}` : "/hooks";
  return pageMeta({
    title: `${cut(plainText, 45)} | הוק מסוג ${h.typeName}`,
    short: cut(plainText, 55),
    description: `${plainText}. ${cut(t?.description_he ?? "", 100)}`,
    path: `/hooks/h/${id}`,
    canonical,
    index: false,
  });
}

export default function SingleHookPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SingleHookPageView params={params} />
    </Suspense>
  );
}

async function SingleHookPageView({ params }: Props) {
  const { id } = await params;
  const h = hookById.get(id);
  if (!h) notFound();
  const sameNiche = h.nicheSlug ? hooksOfNiche(h.nicheSlug).filter((x) => x.id !== h.id && x.typeSlug !== h.typeSlug).slice(0, 3) : [];
  const reel = h.nicheSlug
    ? reelFromHook(h.id, { caption: "box", viewsK: 36.2, highlight: 2 })
    : reelFromText(h.id, h.text.replace(/[{}]/g, ""), null, { caption: "box", viewsK: 36.2, highlight: 2 });
  const middle = h.nicheSlug
    ? { label: h.nicheShort!, href: `/hooks/${h.nicheSlug}` }
    : h.seasonSlug
      ? { label: h.seasonName!, href: `/hooks/season/${h.seasonSlug}` }
      : { label: HOOKS_COPY.crumbs.universal, href: "/hooks#universal" };
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    middle,
    { label: HOOKS_COPY.crumbs.hook, href: `/hooks/h/${h.id}` },
  ];
  const fields = [...new Set([...h.placeholders, ...[...h.visual.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1])])];

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="relative isolate overflow-x-clip">
        <HeroGlow />
        <div className="container-marketing relative pt-14 pb-10 md:pt-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="inline-flex w-fit rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">{S.eyebrow(h.typeName)}</p>
                <HookCard hook={h} variant="page" location="hook_page" />
              </div>
              {fields.length > 0 && <HookPersonalizer only={fields} />}
            </div>
            <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              {reel && <ReelCard reel={reel} frame="phone" className="mx-auto w-full max-w-[280px]" label={`תצוגה להמחשה: ${h.typeName}`} />}
              <HookScore hook={h} />
            </div>
          </div>
        </div>
      </section>

      {sameNiche.length > 0 && (
        <section aria-labelledby="similar-title" className="container-marketing py-16 md:py-24">
          <h2 id="similar-title" className={cn(h2Class, "mb-10 text-center")}>{S.similar}</h2>
          <ul className="grid items-start gap-5 md:grid-cols-3">
            {sameNiche.map((x) => (
              <li key={x.id} className="contents"><HookCard hook={x} variant="compact" showNiche={false} location="hook_page" headingLevel="h3" /></li>
            ))}
          </ul>
        </section>
      )}
    </HooksProvider>
  );
}
