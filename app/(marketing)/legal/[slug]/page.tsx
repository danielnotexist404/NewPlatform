import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContentSkeleton } from "@/components/marketing/content/content-skeleton";
import { LegalPage } from "@/components/marketing/content/legal-page";
import { LEGAL_DOCS, getLegalDoc } from "@/content/he/legal";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${doc.slug}` },
    openGraph: { title: doc.title, description: doc.description, url: `/legal/${doc.slug}` },
  };
}

export default function LegalDocPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <LegalDoc params={params} />
    </Suspense>
  );
}

async function LegalDoc({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
