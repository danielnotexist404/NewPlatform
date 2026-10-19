"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clapperboard, Plus } from "lucide-react";
import { accentCta } from "@/components/layout/cta-styles";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { useGeneratedVideos } from "@/lib/generate/store";
import { PROJECT_STAGE_GROUP, type MockProject } from "@/lib/mock/projects";
import { VideoCard } from "./video-card";
import { generatedCard, projectCard } from "./video-cards";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "הכול" },
  { key: "ready", label: "מוכנים" },
  { key: "progress", label: "בהכנה" },
  { key: "drafts", label: "טיוטות" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

const TOOLS = [
  { href: "/app/templates", label: "תבניות" },
  { href: "/app/hooks", label: "ספריית הוקים" },
  { href: "/app/library", label: "ספריית מדיה" },
  { href: "/app/publish", label: "לוח פרסום" },
];

/** "הסרטונים שלי": one filter row and a clean grid. Videos generated in this browser come first. */
export function ProjectsBrowser({ projects }: { projects: MockProject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const raw = sp.get("status");
  const status: FilterKey = FILTERS.some((f) => f.key === raw) ? (raw as FilterKey) : "all";
  const generated = useGeneratedVideos();

  const sorted = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const mock = sorted
    .filter((p) => status === "all" || PROJECT_STAGE_GROUP[p.stage] === status)
    .map(projectCard);
  const items = [...(status === "all" || status === "ready" ? generated.map(generatedCard) : []), ...mock];
  const count = (k: FilterKey) =>
    k === "all" ? projects.length + generated.length : projects.filter((p) => PROJECT_STAGE_GROUP[p.stage] === k).length + (k === "ready" ? generated.length : 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-h1">{SIMPLE_APP.nav.videos}</h1>
        <Link href="/app/create" className={cn(accentCta, "h-12 px-6 max-sm:hidden")}>
          <Plus className="size-5" aria-hidden />
          {SIMPLE_APP.nav.create}
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label={SIMPLE_APP.nav.videos} className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = f.key === status;
            return (
              <button
                key={f.key}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => router.replace(f.key === "all" ? pathname : `${pathname}?status=${f.key}`, { scroll: false })}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold ring-1 transition-colors",
                  on ? "bg-ink text-paper ring-ink" : "bg-surface-1 text-text-2 ring-border hover:text-text",
                )}
              >
                {f.label}
                <bdi className="num text-micro opacity-60">{count(f.key)}</bdi>
              </button>
            );
          })}
        </div>
        <nav aria-label="כלים" className="flex flex-wrap gap-x-4 gap-y-1 text-small">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="text-text-2 hover:text-text hover:underline">{t.label}</Link>
          ))}
        </nav>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-surface-1 px-6 py-16 text-center ring-hairline">
          <Clapperboard className="size-10 text-muted" aria-hidden />
          <p className="text-body-lg text-text-2">אין כאן סרטונים עדיין.</p>
          <Link href="/app/create" className={cn(accentCta, "h-12 px-6")}>{SIMPLE_APP.nav.create}</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((v, i) => (
            <li key={v.id} className="min-w-0">
              <VideoCard video={v} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
