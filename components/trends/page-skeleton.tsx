import { Skeleton } from "@/components/ui/misc";

/** Suspense fallback for param-driven pages (cacheComponents + instant navigation). */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="טוען…">
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <Skeleton className="aspect-reel w-full max-w-[260px] rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
