import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { GeneratedVideoView } from "@/components/projects/generated-video-view";

export const metadata: Metadata = {
  title: "הסרטון שלכם",
  description: "הסרטון שיצרתם: צפייה, הורדה, קמפיין ופרסום.",
};

/** A video generated in this browser (?id=…); read on the client from the local store. */
export default function GeneratedVideoPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-10 lg:grid-cols-2" aria-busy="true">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="mx-auto aspect-reel w-[340px] rounded-[44px]" />
        </div>
      }
    >
      <GeneratedVideoView />
    </Suspense>
  );
}
