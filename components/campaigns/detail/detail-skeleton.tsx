import { Skeleton } from "@/components/ui/misc";

export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
