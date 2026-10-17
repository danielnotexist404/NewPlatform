import { SkipLink } from "@/components/a11y/skip-link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-shell="marketing" className="film-grain bg-projector min-h-dvh">
      <SkipLink />
      <AnnouncementBar />
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <MarketingFooter />
      <MobileStickyCta />
    </div>
  );
}
