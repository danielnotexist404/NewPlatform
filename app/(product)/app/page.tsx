import type { Metadata } from "next";
import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Greeting } from "@/components/app/dashboard/greeting";
import { QuickStarts } from "@/components/app/dashboard/quick-starts";
import { JobQueue } from "@/components/app/dashboard/job-queue";
import { HookOfWeek } from "@/components/app/dashboard/hook-of-week";
import { CampaignKpiWidget, NewLeadsWidget, PlanItemsWidget } from "@/components/app/dashboard/widgets";
import { ProjectCard } from "@/components/projects/project-card";
import { DemoBadge } from "@/components/projects/demo-note";
import { APP_CORE } from "@/content/he/app-core";
import { getHookType, getNiche, nicheShortName } from "@/lib/data/seed";
import { activeJobs, getProject, recentProjects } from "@/lib/mock/projects";
import { MOCK_BUSINESS, MOCK_USER, hookOfTheWeek, personalizeHook } from "@/lib/mock/workspace";

const D = APP_CORE.dashboard;

export const metadata: Metadata = {
  title: D.metaTitle,
  description: D.metaDescription,
};

export default function DashboardPage() {
  const queue = activeJobs().flatMap((job) => {
    const project = getProject(job.projectId);
    return project ? [{ job, project }] : [];
  });
  const recent = recentProjects(8);
  const hook = hookOfTheWeek();
  const niche = getNiche(MOCK_BUSINESS.nicheSlug);

  return (
    <div className="relative flex flex-col gap-10 pb-10">
      <div aria-hidden className="pointer-events-none absolute -top-6 inset-x-0 -z-10 h-72 bg-projector opacity-80" />
      <header className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <Greeting firstName={MOCK_USER.firstName} />
        <DemoBadge />
      </header>

      <QuickStarts />

      <JobQueue items={queue} />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          <section aria-labelledby="recent-title" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 id="recent-title" className="text-h3">{D.recent.title}</h2>
              <Link href="/app/projects" className="inline-flex items-center gap-1 text-small font-semibold text-primary-text hover:underline">
                {D.recent.all}
                <DirIcon name="next" className="size-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
              {recent.map((p, i) => (
                <li key={p.id}>
                  <ProjectCard project={p} priority={i < 4} />
                </li>
              ))}
            </ul>
          </section>
          <HookOfWeek
            hook={hook}
            text={personalizeHook(hook.text_he)}
            typeName={getHookType(hook.hook_type_slug)?.name_he ?? ""}
            nicheShort={niche ? nicheShortName(niche) : ""}
          />
        </div>
        <aside className="flex min-w-0 flex-col gap-6 lg:col-span-4" aria-label="קמפיינים, לידים ותוכנית">
          <CampaignKpiWidget />
          <NewLeadsWidget />
          <PlanItemsWidget />
        </aside>
      </div>
    </div>
  );
}
