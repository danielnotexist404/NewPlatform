import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera } from "lucide-react";
import { ShootKit } from "@/components/guided/shoot-kit";
import { AdSafetyBadge, ProductionBadge } from "@/components/trends/trend-badges";
import { DirIcon } from "@/components/a11y/dir-icon";
import { PageSkeleton } from "@/components/trends/page-skeleton";
import { GUIDED, TRENDS_META } from "@/content/he/trends-app";
import { getNiche } from "@/lib/data/seed";
import { getShootProject, MOCK_WORKSPACE, SHOOT_PROJECTS } from "@/lib/mock/trends-app";

/** Guided filming kit (spec 07–08 §J.7). Mock projects: one per trend template with a shot list. */
export function generateStaticParams() {
  return SHOOT_PROJECTS.map((p) => ({ projectId: p.projectId }));
}

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
  const { projectId } = await params;
  const p = getShootProject(projectId);
  const m = TRENDS_META.shoot(p?.trend.nameHe ?? GUIDED.eyebrow);
  return { title: m.title, description: m.description, robots: { index: false } };
}

export default function ShootPage({ params }: { params: Promise<{ projectId: string }> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Shoot params={params} />
    </Suspense>
  );
}

async function Shoot({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const p = getShootProject(projectId);
  if (!p) notFound();
  const { trend } = p;
  const niche = getNiche(MOCK_WORKSPACE.nicheSlug);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <Link href={`/app/trends/${trend.slug}`} className="inline-flex w-fit items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
        <DirIcon name="back" />
        {GUIDED.back}
      </Link>
      <header className="flex flex-col gap-3">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-micro text-primary-text">
          <Camera aria-hidden className="size-3.5" />
          {GUIDED.eyebrow}
        </p>
        <h1 className="text-h1">{trend.nameHe}</h1>
        <div className="flex flex-wrap items-center gap-2 text-small text-text-2">
          <span>{GUIDED.forBusiness(MOCK_WORKSPACE.businessNameHe)}</span>
          <span aria-hidden>·</span>
          <ProductionBadge mode={trend.productionMode} />
          <AdSafetyBadge safety={trend.adSafety} />
        </div>
      </header>
      <ShootKit trendSlug={trend.slug} nicheSlug={MOCK_WORKSPACE.nicheSlug} nicheIcon={niche?.icon} />
    </div>
  );
}
