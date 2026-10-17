import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BusinessPage } from "@/components/landing-pages/business-page";
import { getPublicPage, PUBLIC_PAGES } from "@/lib/mock/landing-pages";

/** Public "דף העסק" (spec 07–08 §S.1): ISR from `landing_page_public(slug)`; mock = 2 sample businesses. */
export function generateStaticParams() {
  return PUBLIC_PAGES.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublicPage(slug);
  if (!page) return { title: { absolute: "הדף לא נמצא" }, robots: { index: false } };
  return {
    title: { absolute: `${page.business.nameHe} · ${page.content.address.city || page.business.city}` },
    description: page.content.subline,
    // `indexable = false` by default (§S.1); sample pages are never indexed.
    robots: { index: false, follow: false },
    openGraph: { title: page.business.nameHe, description: page.content.subline, locale: "he_IL", type: "website" },
  };
}

export default function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-bg" aria-busy="true" />}>
      <PublicPage params={params} />
    </Suspense>
  );
}

async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPublicPage(slug);
  if (!page) notFound();
  return (
    <BusinessPage
      business={page.business}
      content={page.content}
      heroVideos={page.heroVideos}
      slug={page.slug}
      mode="public"
      // Paid plans only can publish (§S.7), so published pages never carry our branding.
      showBranding={false}
      isSample
    />
  );
}
