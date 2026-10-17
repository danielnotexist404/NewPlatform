import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/settings/kit";
import { CancelSubscriptionFlow } from "@/components/billing/cancel-subscription-flow";
import { billingCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: billingCopy.meta.cancel.title,
  description: billingCopy.meta.cancel.description,
};

export default function BillingCancelPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title={billingCopy.cancel.title}
        back={{ href: "/app/billing", label: billingCopy.plans.back }}
        eyebrow={
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-sm font-semibold text-success">
            <ShieldCheck className="size-4" aria-hidden />
            {billingCopy.cancel.promise}
          </p>
        }
      />
      <Suspense>
        <CancelSubscriptionFlow />
      </Suspense>
    </div>
  );
}
