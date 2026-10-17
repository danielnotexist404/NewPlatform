import { AppShell } from "@/components/layout/app-shell";

// Auth gate is added when Supabase is connected (Part 04 proxy.ts). Until then the app runs on mock data.
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
