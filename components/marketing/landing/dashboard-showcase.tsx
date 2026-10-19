import Link from "next/link";
import { Section, SectionHeading } from "./section-heading";
import { ScrollTilt } from "./scroll-tilt";
import { DirIcon } from "@/components/a11y/dir-icon";
import { CampaignDashboard } from "@/components/marketing/media/campaign-dashboard";
import { LANDING } from "@/content/he/landing";

const C = LANDING.dash;

/** One big product shot: the campaign dashboard in a browser window. */
export function DashboardShowcase() {
  return (
    <Section id="dashboard" labelledBy="dash-title" className="overflow-x-clip">
      <SectionHeading id="dash-title" title={C.title} subtitle={C.subtitle} />
      <div className="relative mt-16 md:mt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-[8%] bottom-[-12%] -z-10 rounded-[50%] opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 32%, transparent), color-mix(in oklab, var(--color-coral) 12%, transparent) 60%, transparent)" }}
        />
        <ScrollTilt>
          <CampaignDashboard />
        </ScrollTilt>
        <p className="mt-5 text-center text-micro font-normal text-muted">{C.disclaimer}</p>
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/campaigns" className="group inline-flex items-center gap-1.5 text-body font-semibold text-primary-text hover:underline">
          {C.cta}
          <DirIcon name="forward" className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
