import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/settings/kit";
import { BrandView } from "@/components/brand/brand-view";
import { brandCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: brandCopy.meta.title,
  description: brandCopy.meta.description,
};

export default function BrandPage() {
  return (
    <>
      <PageHeader title={brandCopy.title} description={brandCopy.subtitle} />
      <Suspense>
        <BrandView />
      </Suspense>
    </>
  );
}
