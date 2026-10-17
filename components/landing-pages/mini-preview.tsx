import { BusinessPage } from "./business-page";
import type { LandingPage } from "@/lib/mock/landing-pages";
import { cn } from "@/lib/utils";

/** Scaled, non-interactive phone thumbnail of a business page (list cards). */
export function MiniPreview({ page, watermark, className }: { page: LandingPage; watermark?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-[22px] bg-bg shadow-[0_0_0_5px_var(--color-surface-3),0_0_0_6px_var(--color-border)] elev-2", className)}>
      <div inert className="pointer-events-none origin-top-right select-none [zoom:0.42]" style={{ width: 390, height: 900, overflow: "hidden" }}>
        <BusinessPage
          business={page.business}
          content={page.content}
          heroVideos={page.heroVideos}
          slug={page.slug}
          mode="preview"
          showBranding={!!watermark}
          watermark={watermark}
          isSample={false}
          idPrefix={`mini-${page.id}`}
        />
      </div>
    </div>
  );
}
