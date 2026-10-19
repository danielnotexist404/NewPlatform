import type { Metadata } from "next";
import { Greeting } from "@/components/app/dashboard/greeting";
import { CampaignSummary, CreateCard, RecentVideos, TrendCard } from "@/components/app/dashboard/home";
import { projectCard } from "@/components/projects/video-cards";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { campaignKpis, campaigns } from "@/lib/mock/campaigns";
import { recentProjects } from "@/lib/mock/projects";
import { MOCK_TREND, MOCK_USER } from "@/lib/mock/workspace";

const D = SIMPLE_APP.dashboard;

export const metadata: Metadata = {
  title: D.metaTitle,
  description: D.metaDescription,
};

/** Minimal home: greeting, one big create card, 3 recent videos, one campaign summary, one trend. */
export default function DashboardPage() {
  const recent = recentProjects(3).map(projectCard);
  const active = campaigns.find((c) => c.status === "active");
  const k = active ? campaignKpis(active, "7d").current : null;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <Greeting firstName={MOCK_USER.firstName} />
      <CreateCard hookSamples={recent.map((r) => r.hookText ?? "").filter(Boolean)} />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-8">
          <RecentVideos items={recent} />
        </div>
        <aside className="flex min-w-0 flex-col gap-5 lg:col-span-4 lg:pt-12">
          {active && k && <CampaignSummary name={active.name} spendIls={k.spendIls} results={k.results} costPerResultIls={k.results ? k.spendIls / k.results : 0} />}
          <TrendCard slug={MOCK_TREND.slug} name={MOCK_TREND.nameHe} why={MOCK_TREND.whyHe} hook={MOCK_TREND.hooks[0]} />
        </aside>
      </div>
    </div>
  );
}
