import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { PhoneFrame, ReelTile } from "@/components/marketing/niches/reel-tile";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { HookScore } from "@/components/hooks/hook-score";
import { SingleHookHero, CreateFromHookButton } from "@/components/hooks/single-hook";
import { ALL_HOOKS, hookById, hooksOfNiche, hooksOfType } from "@/components/hooks/hook-data";
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

export default async function SingleHookPage({ params }: Props) {
  const { id } = await params;
  const h = hookById.get(id);
  if (!h) notFound();
  const sameNiche = h.nicheSlug ? hooksOfNiche(h.nicheSlug).filter((x) => x.id !== h.id && x.typeSlug !== h.typeSlug).slice(0, 3) : [];
  const sameType = hooksOfType(h.typeSlug).filter((x) => x.id !== h.id && x.nicheSlug !== h.nicheSlug);
  const sameTypeMixed: typeof sameType = [];
  const seen = new Set<string>();
  for (const x of sameType) {
    const k = x.nicheSlug ?? x.id;
    if (seen.has(k)) continue;
    seen.add(k);
    sameTypeMixed.push(x);
    if (sameTypeMixed.length >= 3) break;
  }
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
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
        <div className="container-marketing relative pt-8 pb-10 md:pt-12">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-8">
              <SingleHookHero hook={h} eyebrow={S.eyebrow(h.typeName)} />
              {fields.length > 0 && <HookPersonalizer only={fields} />}
              <HookCard hook={h} location="hook_page" headingLevel="h2" />
            </div>
            <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <PhoneFrame label={`תצוגה להמחשה: ${h.typeName}`} className="max-w-[260px]">
                <ReelTile icon={h.nicheIcon} category={h.nicheCategory} hookText={h.text} handle={h.nicheShort ?? undefined} badge="דוגמה להמחשה" />
              </PhoneFrame>
              <HookScore hook={h} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="container-marketing mt-12">
        <div className="rounded-xl bg-surface-1 p-8 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-12">
          <h2 id="how-title" className="text-h2">{S.howTitle}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {S.how.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="num inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary">{i + 1}</span>
                <span className="pt-1.5 text-body-lg font-semibold">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <CreateFromHookButton id={h.id} />
          </div>
        </div>
      </section>

      {(sameNiche.length > 0 || sameTypeMixed.length > 0) && (
        <section aria-labelledby="similar-title" className="container-marketing mt-20">
          <h2 id="similar-title" className="mb-6 text-h2">{S.similar}</h2>
          <div className="flex flex-col gap-10">
            {sameNiche.length > 0 && (
              <div>
                <h3 className="mb-4 text-body-lg font-bold text-text-2">{S.sameNiche(h.nicheShort!)}</h3>
                <ul className="grid items-start gap-4 md:grid-cols-3">
                  {sameNiche.map((x) => (
                    <li key={x.id} className="contents"><HookCard hook={x} variant="compact" showNiche={false} location="hook_page" headingLevel="h4" /></li>
                  ))}
                </ul>
              </div>
            )}
            {sameTypeMixed.length > 0 && (
              <div>
                <h3 className="mb-4 text-body-lg font-bold text-text-2">{S.sameType(h.typeName)}</h3>
                <ul className="grid items-start gap-4 md:grid-cols-3">
                  {sameTypeMixed.map((x) => (
                    <li key={x.id} className="contents"><HookCard hook={x} variant="compact" location="hook_page" headingLevel="h4" /></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </HooksProvider>
  );
}
