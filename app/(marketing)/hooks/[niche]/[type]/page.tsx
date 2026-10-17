import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Breadcrumbs, JsonLd, breadcrumbJsonLd } from "@/components/marketing/niches/breadcrumbs";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { HooksProvider } from "@/components/hooks/hooks-provider";
import { HookCard } from "@/components/hooks/hook-card";
import { HookPersonalizer } from "@/components/hooks/hook-personalizer";
import { SmartText } from "@/components/hooks/hook-text";
import { ALL_HOOKS, hooksOfType, placeholdersIn } from "@/components/hooks/hook-data";
import { pageMeta } from "@/components/hooks/seo";
import { getHookType, getNiche, nicheShortName } from "@/lib/data/seed";
import { HOOKS_COPY } from "@/content/he/hooks";

const X = HOOKS_COPY.combo;

export function generateStaticParams() {
  const seen = new Set<string>();
  const out: { niche: string; type: string }[] = [];
  for (const h of ALL_HOOKS) {
    if (!h.nicheSlug) continue;
    const k = `${h.nicheSlug}/${h.typeSlug}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ niche: h.nicheSlug, type: h.typeSlug });
  }
  return out;
}

type Props = { params: Promise<{ niche: string; type: string }> };

function load(nicheSlug: string, typeSlug: string) {
  const n = getNiche(nicheSlug);
  const t = getHookType(typeSlug);
  if (!n || !t) return null;
  const hooks = ALL_HOOKS.filter((h) => h.nicheSlug === nicheSlug && h.typeSlug === typeSlug);
  if (hooks.length === 0) return null;
  return { n, t, hooks, short: nicheShortName(n) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche, type } = await params;
  const d = load(niche, type);
  if (!d) return {};
  // Never indexable at launch: < 8 hooks and no unique intro file (Part 02 §5.6).
  return pageMeta({
    title: X.title(d.t.name_he, d.short),
    description: X.description(d.t.name_he, d.short),
    path: `/hooks/${niche}/${type}`,
    canonical: `/hooks/${niche}`,
    index: false,
  });
}

export default async function NicheTypePage({ params }: Props) {
  const { niche, type } = await params;
  const d = load(niche, type);
  if (!d) notFound();
  const { n, t, hooks, short } = d;
  const others = hooksOfType(type).filter((h) => h.nicheSlug && h.nicheSlug !== niche);
  const otherByNiche: typeof others = [];
  const seen = new Set<string>();
  for (const h of others) {
    if (seen.has(h.nicheSlug!)) continue;
    seen.add(h.nicheSlug!);
    otherByNiche.push(h);
    if (otherByNiche.length >= 6) break;
  }
  const crumbs = [
    { label: HOOKS_COPY.crumbs.home, href: "/" },
    { label: HOOKS_COPY.crumbs.hooks, href: "/hooks" },
    { label: short, href: `/hooks/${niche}` },
    { label: t.name_he, href: `/hooks/${niche}/${type}` },
  ];

  return (
    <HooksProvider>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="container-marketing pt-8 pb-8 md:pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2">
            <NicheIcon name={n.icon} className="size-3.5" />
            {short}
          </p>
          <h1 className="text-h1">{X.h1(t.name_he, short)}</h1>
          <p className="mt-6 text-body-lg text-text-2">
            <SmartText text={t.description_he} /> {X.introTail(short)}
          </p>
        </div>
      </section>

      <div className="container-marketing flex flex-col gap-8">
        <HookPersonalizer fields={placeholdersIn(hooks)} />
        <ul className="grid items-start gap-4 md:grid-cols-2">
          {hooks.map((h) => (
            <li key={h.id} className="contents"><HookCard hook={h} showNiche={false} location="hook_niche_type_page" /></li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={`/hooks/types/${type}`} className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline">
            {X.toType(t.name_he)} <DirIcon name="forward" />
          </Link>
          <Link href={`/hooks/${niche}`} className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline">
            {X.toNiche(short)} <DirIcon name="forward" />
          </Link>
        </div>
      </div>

      {otherByNiche.length > 0 && (
        <section aria-labelledby="others-title" className="container-marketing mt-20">
          <h2 id="others-title" className="mb-6 text-h2">{X.other(t.name_he)}</h2>
          <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {otherByNiche.map((h) => (
              <li key={h.id} className="contents"><HookCard hook={h} variant="compact" location="hook_niche_type_page" /></li>
            ))}
          </ul>
        </section>
      )}
    </HooksProvider>
  );
}
