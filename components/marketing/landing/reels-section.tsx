import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { DirIcon } from "@/components/a11y/dir-icon";
import { ReelStrip } from "@/components/marketing/media/reel-strip";
import { STRIP_REELS } from "@/lib/mock/home";
import { LANDING } from "@/content/he/landing";

const C = LANDING.reels;

/** Looping strip of reel cards ("videos"). */
export function ReelsSection() {
  return (
    <section id="reels" aria-labelledby="reels-title" className="relative scroll-mt-20 overflow-x-clip py-20 md:py-32">
      <div className="container-marketing">
        <SectionHeading id="reels-title" title={C.title} subtitle={C.subtitle} />
      </div>
      <ReelStrip reels={STRIP_REELS} label={C.label} className="mt-12 md:mt-16" cardClassName="md:w-[260px]" />
      <div className="mt-8 flex justify-center">
        <Link href="/examples" className="group inline-flex items-center gap-1.5 text-body font-semibold text-primary-text hover:underline">
          {C.cta}
          <DirIcon name="forward" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
