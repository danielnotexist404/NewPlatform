import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ShellTheme } from "@/components/a11y/shell-theme";

// AppShell reads usePathname(); fallback shells of partially-known dynamic routes need a Suspense boundary above it.
// Auth gate is added when Supabase is connected (Part 04 proxy.ts). Until then the app runs on mock data.
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <ShellTheme theme="dark" />
    <Suspense fallback={<div data-shell="app" className="min-h-dvh bg-bg" aria-busy="true" />}>
      <AppShell>{children}</AppShell>
    </Suspense>
    </>
  );
}
