import { Suspense } from "react";
import { PageSkeleton } from "@/components/hooks/page-skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { ReelCard } from "@/components/marketing/media/reel-card";
import { reelFromHook } from "@/components/marketing/media/reel-data";
import { Band, Chip, Disclosure, HeroActions, PageHero } from "@/components/marketing/page/kit";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookText, SmartText } from "@/components/hooks/hook-text";
import { familyOf, hooksOfType, typesOfFamily } from "@/components/hooks/hook-data";
import { pageMeta, clampDesc } from "@/components/hooks/seo";
import { getHookType, getNiche, hookTypes, nicheShortName } from "@/lib/data/seed";
import { GENERIC_STEPS, HOOKS_COPY, TYPE_GUIDES, WHY_IT_WORKS } from "@/content/he/hooks";

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
          <HookText text={ex} />
        </span>
      )}
    </>
  );
}

export default function HookTypePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HookTypePageView params={params} />
    </Suspense>
  );
}

async function HookTypePageView({ params }: Props) {
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
  const ex0 = examples.find((h) => h.nicheSlug);
  const heroReel = ex0 ? reelFromHook(ex0.id, { caption: "box", viewsK: 51.3, highlight: 2 }) : null;

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
      <PageHero
        align="split"
        eyebrow={family ? <Chip>{T.family} {family.name_he}</Chip> : undefined}
        title={g.h1}
        sub={<>{T.exampleLabel}: <strong className="font-bold text-text"><HookText text={t.example_he} /></strong></>}
        actions={<HeroActions primary={T.allOfType(t.name_he)} primaryHref={`/hooks?type=${type}`} />}
      >
        {heroReel && <ReelCard reel={heroReel} frame="phone" className="mx-auto w-full max-w-[280px]" label={`דוגמה: ${heroReel.hook}`} />}
      </PageHero>

      {examples.length > 0 && (
        <Band id="examples" title={S.examples}>
          <ul className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {examples.map((h) => (
              <li key={h.id} className="contents"><HookCard hook={h} location="hook_type_page" /></li>
            ))}
          </ul>
        </Band>
      )}

      <Band id="guide" title="המדריך המלא" tight>
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <Disclosure summary={S.what}>
            <div className="prose-he max-w-none">{g.what.map((p) => <p key={p.slice(0, 30)}><SmartText text={p} /></p>)}</div>
          </Disclosure>
          <Disclosure summary={S.why}>
            <div className="prose-he max-w-none">{g.why.map((p) => <p key={p.slice(0, 30)}><SmartText text={p} /></p>)}</div>
          </Disclosure>
          {g.formulas.length > 0 && (
            <Disclosure summary={S.formulas}>
              <ol className="flex flex-col gap-3">
                {g.formulas.map((f, i) => (
                  <li key={f} className="flex gap-3 rounded-[16px] bg-surface-2 p-4">
                    <span className="num mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-micro text-ink">{i + 1}</span>
                    <span className="flex-1"><Formula text={f} /></span>
                  </li>
                ))}
              </ol>
            </Disclosure>
          )}
          {g.mistakes.length > 0 && (
            <Disclosure summary={S.mistakes}>
              <ul className="flex flex-col gap-2">
                {g.mistakes.map((m) => (
                  <li key={m} className="flex gap-3">
                    <AlertTriangle className="mt-1.5 size-4 shrink-0 text-rose" aria-hidden />
                    <span className="text-text-2"><SmartText text={m} /></span>
                  </li>
                ))}
              </ul>
            </Disclosure>
          )}
          <Disclosure summary={S.steps}>
            <ol className="flex flex-col gap-3">
              {g.steps.map((st, i) => (
                <li key={st} className="flex gap-3">
                  <span className="num mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-micro">{i + 1}</span>
                  <span><SmartText text={st} /></span>
                </li>
              ))}
            </ol>
          </Disclosure>
        </div>
      </Band>

      {(topNiches.length > 0 || related.length > 0) && (
        <Band id="more" title={S.niches} tight>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {topNiches.map(([slug]) => {
              const n = getNiche(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/hooks/${slug}/${type}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-surface-1 px-5 text-body font-semibold text-text ring-hairline hover:bg-surface-2">
                    <NicheIcon name={n.icon} className="size-4 text-primary-text" />
                    {nicheShortName(n)}
                  </Link>
                </li>
              );
            })}
          </ul>
          {related.length > 0 && (
            <nav aria-label={S.related} className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="text-small text-muted">{S.related}:</span>
              {related.map((r) => (
                <Link key={r.slug} href={`/hooks/types/${r.slug}`} className="rounded-full bg-surface-3 px-3 py-1.5 text-small font-semibold text-text-2 hover:text-text">
                  {r.name_he}
                </Link>
              ))}
            </nav>
          )}
        </Band>
      )}
      <FinalCta />
    </HooksProvider>
  );
}
