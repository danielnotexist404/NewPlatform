"use client";
/** cacheComponents forbids `new Date()` during prerender in server components — render on the client. */
export function CurrentYear() {
  return <bdi className="num" suppressHydrationWarning>{new Date().getFullYear()}</bdi>;
}
