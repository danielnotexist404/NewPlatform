import type { Metadata } from "next";
import { SkipLink } from "@/components/a11y/skip-link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { NotFoundContent } from "@/components/marketing/content/not-found-content";
import { NOT_FOUND } from "@/content/he/site";

export const metadata: Metadata = {
  title: NOT_FOUND.metaTitle,
  robots: { index: false, follow: true },
};

/** Unmatched URLs (Part 02 §1.5): rendered inside the root layout only, so it brings the marketing chrome. */
export default function NotFound() {
  return (
    <div data-shell="marketing" className="film-grain bg-projector min-h-dvh">
      <SkipLink />
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <NotFoundContent />
      </main>
      <MarketingFooter />
    </div>
  );
}
