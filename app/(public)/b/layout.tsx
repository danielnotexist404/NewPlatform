import { SkipLink } from "@/components/a11y/skip-link";
import { ShellTheme } from "@/components/a11y/shell-theme";

/** Minimal shell for public business pages (no marketing header/footer — the page belongs to the business). */
export default function BusinessPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-shell="business" className="min-h-dvh bg-bg">
      <ShellTheme theme="light" />
      <SkipLink />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </div>
  );
}
