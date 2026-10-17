import { Skeleton } from "@/components/ui/misc";

/** Static-shell fallback for content pages whose params resolve inside <Suspense>. */
export function ContentSkeleton() {
  return (
    <div aria-hidden className="container-marketing pt-12 pb-24">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-10 h-12 w-3/4 max-w-2xl" />
      <Skeleton className="mt-5 h-5 w-full max-w-xl" />
      <Skeleton className="mt-3 h-5 w-2/3 max-w-lg" />
      <Skeleton className="mt-12 h-64 w-full max-w-4xl rounded-lg" />
    </div>
  );
}
