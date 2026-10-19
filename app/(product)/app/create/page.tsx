import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { CreateFlow } from "@/components/wizard/create-flow";
import { SIMPLE_APP } from "@/content/he/simple-app";

export const metadata: Metadata = {
  title: SIMPLE_APP.create.metaTitle,
  description: SIMPLE_APP.create.metaDescription,
};

function CreateSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-10" aria-busy="true">
      <div className="flex justify-between"><Skeleton className="h-6 w-16" /><Skeleton className="h-7 w-72 rounded-full" /></div>
      <Skeleton className="h-14 w-80" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
      </div>
    </div>
  );
}

/** Three screens: על מה הסרטון? → איך זה ייראה? → תצוגה מקדימה, then render progress → the video page. */
export default function CreatePage() {
  return (
    <Suspense fallback={<CreateSkeleton />}>
      <CreateFlow />
    </Suspense>
  );
}
