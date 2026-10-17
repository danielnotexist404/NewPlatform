import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Num } from "@/components/a11y/num";
import { Breadcrumbs, JsonLd, absUrl, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheGrid, type NicheGroup } from "@/components/marketing/niches/niche-grid";
import { categoriesWithNiches, nicheHookCount, ALL_HOOKS } from "@/components/hooks/hook-data";
import { signupHref } from "@/components/hooks/links";
import { pageMeta } from "@/components/hooks/seo";
import { niches, nicheShortName } from "@/lib/data/seed";
import { NICHES_COPY } from "@/content/he/niches";
import { cn } from "@/lib/utils";

const H = NICHES_COPY.hub;

export const metadata: Metadata = pageMeta({ title: H.title, description: H.description(niches.length), path: "/niches" });

export default function NichesHubPage() {
  const groups: NicheGroup[] = categoriesWithNiches().map(({ category, niches: list }) => ({
    slug: category.slug,
    name: category.name_he,
    niches: list.map((n) => ({
      slug: n.slug,
      name: n.name_he,
      short: nicheShortName(n),
      icon: n.icon,
      description: n.description_he,
      category: n.category_slug,
      hookCount: nicheHookCount(n.slug),
      compliance: n.compliance_flag !== "none",
    })),
  }));
  const crumbs = [{ label: NICHES_COPY.crumbs.home, href: "/" }, { label: NICHES_COPY.crumbs.niches }];
  const nicheHooks = ALL_HOOKS.filter((h) => h.nicheSlug).length;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ label: NICHES_COPY.crumbs.home, href: "/" }, { label: NICHES_COPY.crumbs.niches, href: "/niches" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: niches.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.name_he, url: absUrl(`/niches/${n.slug}`) })),
          },
        ]}
      />
      <section id="hero" className="container-marketing pt-8 pb-10 md:pt-12 md:pb-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">{H.eyebrow}</p>
            <h1 className="text-h1 max-w-3xl">
              סרטוני תדמית ורילס <span className="text-gold-gradient">לפי נישה</span>
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg text-text-2">{H.intro}</p>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {[
              { n: niches.length, l: H.stats.niches },
              { n: groups.length, l: H.stats.categories },
              { n: nicheHooks, l: H.stats.hooks },
            ].map((s) => (
              <div key={s.l} className="rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <dt className="text-micro font-normal text-muted">{s.l}</dt>
                <dd className="mt-1 text-[2.25rem] font-extrabold leading-none text-text">
                  <Num value={s.n} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label={H.filterLabel} className="container-marketing pb-12">
        <NicheGrid groups={groups} />
      </section>

      <section aria-labelledby="niche-not-found" className="container-marketing pb-8">
        <div className="relative overflow-hidden rounded-xl bg-surface-1 p-8 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-12">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_90%_at_0%_100%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_70%)]" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 id="niche-not-found" className="text-h2">{H.notFound.title}</h2>
              <p className="mt-3 text-body-lg text-text-2">{H.notFound.body}</p>
            </div>
            <Link href={signupHref("/app/create")} className={cn(buttonVariants({ size: "xl" }))}>
              <Sparkles aria-hidden />
              {H.notFound.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
