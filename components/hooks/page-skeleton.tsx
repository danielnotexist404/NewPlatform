/** Static fallback while route params resolve (cacheComponents + instant navigation). Same rhythm as the pages. */
export function PageSkeleton() {
  return (
    <div aria-hidden className="container-marketing animate-pulse pt-8 pb-16 md:pt-12">
      <div className="h-4 w-48 rounded-full bg-surface-2" />
      <div className="mt-10 h-14 w-3/4 max-w-2xl rounded-md bg-surface-2" />
      <div className="mt-4 h-14 w-1/2 max-w-xl rounded-md bg-surface-2" />
      <div className="mt-8 h-5 w-full max-w-3xl rounded-full bg-surface-1" />
      <div className="mt-3 h-5 w-2/3 max-w-2xl rounded-full bg-surface-1" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-56 rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]" />
        ))}
      </div>
    </div>
  );
}
