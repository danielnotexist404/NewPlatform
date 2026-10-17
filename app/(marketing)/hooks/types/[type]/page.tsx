import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ListOrdered, Sigma } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookText, SmartText } from "@/components/hooks/hook-text";
import { familyOf, hooksOfType, typeHookCount, typesOfFamily } from "@/components/hooks/hook-data";
import { pageMeta, clampDesc } from "@/components/hooks/seo";
import { plural } from "@/components/hooks/text";
import { getHookType, getNiche, hookTypes, nicheShortName } from "@/lib/data/seed";
import { GENERIC_STEPS, HOOKS_COPY, TYPE_GUIDES, WHY_IT_WORKS } from "@/content/he/hooks";
import { cn } from "@/lib/utils";

const T = HOOKS_COPY.types;

export function generateStaticParams() {
  return hookTypes.map((t) => ({ type: t.slug }));
}

type Props = { params: Promise<{ type: string }> };

function guideFor(slug: string) {
  const t = getHookType(slug);
  if (!t) return null;
  const g = TYPE_GUIDES[slug];
  const plain = t.name_he.replace(/\s*\/\s*/g, " ו").replace(/\bX\b\s*/g, "");
  const h1 = g?.h1 ?? `הוק ${plain}: מה זה ואיך כותבים הוק כזה`;
  return {
    t,
    h1,
    title: g?.title ?? `${h1} (עם דוגמאות)`,
    description: g?.description ?? clampDesc(`${t.description_he} נוסחאות, דוגמאות בעברית מהספרייה וטעויות שכדאי להימנע מהן.`),
    what: g?.what ?? [t.description_he],
    why: g?.why ?? [WHY_IT_WORKS[slug]].filter(Boolean),
    formulas: g?.formulas ?? [],
    mistakes: g?.mistakes ?? [],
    steps: g?.steps ?? [GENERIC_STEPS.pick, GENERIC_STEPS.formula(t.name_he), GENERIC_STEPS.short, GENERIC_STEPS.visual, GENERIC_STEPS.read],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const g = guideFor(type);
  if (!g) return {};
  return pageMeta({ title: g.title, short: g.h1, description: g.description, path: `/hooks/types/${type}` });
}

function Formula({ text }: { text: string }) {
  const [f, ex] = text.split(" — ");
  return (
    <>
      <span className="font-bold text-text">
        <HookText text={f} />
      </span>
      {ex && (
        <span className="mt-1 block text-text-2">
          <SmartText text={ex} />
        </span>
      )}
    </>
  );
}

export default async function HookTypePage({ params }: Props) {
  const { type } = await params;
  const g = guideFor(type);
  if (!g) notFound();
  const { t } = g;
  const family = familyOf(t.family_slug);
  const all = hooksOfType(type);
  // 6 examples from different niches, featured first
  const examples: typeof all = [];
  const seen = new Set<string>();
  for (const h of all) {
    const key = h.nicheSlug ?? h.id;
    if (seen.has(key)) continue;
    seen.add(key);
    examples.push(h);
    if (examples.length >= 6) break;
  }
  const nicheCounts = new Map<string, number>();
  for (const h of all) if (h.nicheSlug) nicheCounts.set(h.nicheSlug, (nicheCounts.get(h.nicheSlug) ?? 0) + 1);
  const topNiches = [...nicheCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const related = typesOfFamily(t.family_slug).filter((x) => x.slug !== type);
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: HOOKS_COPY.crumbs.types, href: "/hooks/types" },
    { label: t.name_he, href: `/hooks/types/${type}` },
  ];
  const S = T.sections;

  return (
    <HooksProvider>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: g.h1,
            step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
          },
        ]}
      />
      <section className="container-marketing pt-8 pb-6 md:pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 max-w-4xl">
          {family && (
            <Link href={`/hooks/types#${family.slug}`} className="mb-5 inline-flex rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 hover:text-text">
              {T.family} {family.name_he}
            </Link>
          )}
          <h1 className="text-h1">{g.h1}</h1>
          <p className="mt-6 text-body-lg text-text-2">{t.description_he}</p>
        </div>
      </section>

      <div className="container-marketing grid gap-10 pt-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <article className="prose-he max-w-none [&_h2]:mt-12 [&_h2:first-child]:mt-0">
          <h2>{S.what}</h2>
          {g.what.map((p) => <p key={p.slice(0, 30)}><SmartText text={p} /></p>)}
          <h2>{S.why}</h2>
          {g.why.map((p) => <p key={p.slice(0, 30)}><SmartText text={p} /></p>)}
          {g.formulas.length > 0 && (
            <>
              <h2>{S.formulas}</h2>
              <ol className="list-none ps-0 flex flex-col gap-3">
                {g.formulas.map((f, i) => (
                  <li key={f} className="flex gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                    <span className="num mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-lemon text-micro text-on-primary">{i + 1}</span>
                    <span className="flex-1"><Formula text={f} /></span>
                    <Sigma className="mt-1 size-4 shrink-0 text-muted" aria-hidden />
                  </li>
                ))}
              </ol>
            </>
          )}
          {g.mistakes.length > 0 && (
            <>
              <h2>{S.mistakes}</h2>
              <ul className="list-none ps-0 flex flex-col gap-2">
                {g.mistakes.map((m) => (
                  <li key={m} className="flex gap-3">
                    <AlertTriangle className="mt-1.5 size-4 shrink-0 text-rose" aria-hidden />
                    <span className="text-text-2"><SmartText text={m} /></span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <h2>{S.steps}</h2>
          <ol className="list-none ps-0 flex flex-col gap-3">
            {g.steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="num mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-micro">{i + 1}</span>
                <span><SmartText text={s} /></span>
              </li>
            ))}
          </ol>
        </article>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          <div className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] glow-primary">
            <p className="text-micro text-muted">{T.exampleLabel}</p>
            <blockquote className="mt-2 text-h3">
              <HookText text={t.example_he} />
            </blockquote>
            <p className="num mt-4 text-small text-text-2">{plural(typeHookCount(type), T.inLibrary)}</p>
            <Link href={`/hooks?type=${type}`} className={cn(buttonVariants({ size: "lg" }), "mt-5 w-full")}>
              <ListOrdered aria-hidden />
              {T.allOfType(t.name_he)}
            </Link>
          </div>
          {related.length > 0 && (
            <nav aria-labelledby="related-types" className="rounded-lg bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)]">
              <h2 id="related-types" className="text-body-lg font-bold">{S.related}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/hooks/types/${r.slug}`} className="inline-flex rounded-xs bg-surface-3 px-2.5 py-1 text-sm font-semibold text-text-2 hover:bg-lemon hover:text-on-primary">
                      {r.name_he}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>

      {examples.length > 0 && (
        <section aria-labelledby="examples-title" className="container-marketing mt-20">
          <h2 id="examples-title" className="mb-6 text-h2">{S.examples}</h2>
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {examples.map((h) => (
              <li key={h.id} className="contents"><HookCard hook={h} location="hook_type_page" /></li>
            ))}
          </ul>
        </section>
      )}

      {topNiches.length > 0 && (
        <section aria-labelledby="niches-title" className="container-marketing mt-20">
          <h2 id="niches-title" className="mb-6 text-h2">{S.niches}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {topNiches.map(([slug, count]) => {
              const n = getNiche(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/hooks/${slug}/${type}`} className="group flex items-center gap-3 rounded-md bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2">
                    <span className="flex size-10 items-center justify-center rounded-sm bg-surface-3 text-primary-text"><NicheIcon name={n.icon} className="size-5" /></span>
                    <span className="flex-1">
                      <span className="block font-semibold">{nicheShortName(n)}</span>
                      <span className="num block text-micro font-normal text-muted">{plural(count, T.nicheCount)}</span>
                    </span>
                    <DirIcon name="next" className="size-4 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </HooksProvider>
  );
}
