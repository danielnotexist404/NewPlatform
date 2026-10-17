import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutReturnStatus } from "@/components/billing/checkout-return-status";
import { billingCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: billingCopy.meta.returnPage.title,
  description: billingCopy.meta.returnPage.description,
  robots: { index: false },
};

export default function BillingReturnPage() {
  return (
    <div className="py-6 md:py-12">
      <Suspense>
        <CheckoutReturnStatus />
      </Suspense>
    </div>
  );
}
