import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/misc";
import { BrandKitEditor } from "@/components/brand/brand-kit-editor";
import { brandCopy } from "@/content/he/account";
import { MOCK_BRAND_KITS, getBrandKit } from "@/lib/mock/account";

export function generateStaticParams() {
  return MOCK_BRAND_KITS.map((k) => ({ kitId: k.id }));
}

export const metadata: Metadata = {
  title: brandCopy.editor.metaTitle,
  description: brandCopy.meta.description,
};

type Params = Promise<{ kitId: string }>;

async function EditorScreen({ params }: { params: Params }) {
  const { kitId } = await params;
  const kit = getBrandKit(kitId);
  if (!kit) notFound();
  return <BrandKitEditor initial={kit} />;
}

export default function BrandKitPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6" aria-busy="true">
          <Skeleton className="h-12 w-1/2" />
          <div className="grid gap-8 lg:grid-cols-12">
            <Skeleton className="h-[640px] rounded-lg lg:col-span-7" />
            <Skeleton className="mx-auto hidden aspect-reel w-[300px] rounded-[44px] lg:col-span-5 lg:block" />
          </div>
        </div>
      }
    >
      <EditorScreen params={params} />
    </Suspense>
  );
}
