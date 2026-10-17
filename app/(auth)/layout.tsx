import Link from "next/link";
import { SkipLink } from "@/components/a11y/skip-link";
import { ShellTheme } from "@/components/a11y/shell-theme";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Logo } from "@/components/layout/logo";
import { AUTH } from "@/content/he/site";

/** Minimal shell for the auth screens (Part 03 §3): logo, back link, no marketing chrome. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-shell="auth" className="relative min-h-dvh bg-bg">
      <ShellTheme theme="light" />
      <SkipLink />
      <header className="absolute inset-x-0 top-0 z-[var(--z-sticky)]">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-small font-semibold text-text-2 hover:text-text">
            <DirIcon name="back" className="size-4" />
            {AUTH.backToSite}
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </div>
  );
}
