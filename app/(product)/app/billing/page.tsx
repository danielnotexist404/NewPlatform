import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/settings/kit";
import { BillingOverview } from "@/components/billing/billing-overview";
import { billingCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: billingCopy.meta.overview.title,
  description: billingCopy.meta.overview.description,
};

export default function BillingPage() {
  return (
    <>
      <PageHeader title={billingCopy.title} description={billingCopy.subtitle} />
      <Suspense>
        <BillingOverview />
      </Suspense>
    </>
  );
}
