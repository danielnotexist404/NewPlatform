import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/settings/kit";
import { PlansView } from "@/components/billing/plans-view";
import { billingCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: billingCopy.meta.plans.title,
  description: billingCopy.meta.plans.description,
};

export default function BillingPlansPage() {
  return (
    <>
      <PageHeader
        title={billingCopy.plans.title}
        description={billingCopy.plans.subtitle}
        back={{ href: "/app/billing", label: billingCopy.plans.back }}
      />
      <Suspense>
        <PlansView />
      </Suspense>
    </>
  );
}
