"use client";
import * as React from "react";
import Link from "next/link";
import { CalendarClock, Clapperboard, Plus, RotateCcw, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { getVideo, socialPosts, type SocialPost } from "@/lib/mock/publish";
import { publishCopy as P, sample } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote, SectionTitle } from "@/components/campaigns/page-header";
import { VideoThumb } from "@/components/campaigns/video-thumb";
import { dateDayMonth, Pct, timeOf, weekday } from "@/components/campaigns/text";
import { ContentCalendar } from "./content-calendar";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("he-IL");

function StatusPill({ status }: { status: SocialPost["status"] }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-micro", status === "published" ? "bg-success/15 text-success" : status === "failed" ? "bg-danger/15 text-danger" : status === "canceled" ? "bg-surface-3 text-text-2" : "bg-primary/12 text-primary-text")}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {P.status[status]}
    </span>
  );
}

export function PublishOverview() {
  const [posts, setPosts] = React.useState(socialPosts);
  const queue = posts.filter((p) => p.status === "scheduled" || p.status === "failed" || p.status === "uploading").sort((a, b) => a.at.localeCompare(b.at));
  const top = posts
    .filter((p) => p.status === "published" && p.insights)
    .sort((a, b) => b.insights!.views - a.insights!.views)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <SampleNote text={sample.publish} />
      <PageHeader
        eyebrow={P.eyebrow}
        eyebrowIcon={CalendarClock}
        title={P.title}
        sub={P.sub}
        actions={
          <Button asChild size="lg">
            <Link href="/app/publish/new">
              <Plus aria-hidden />
              {P.newPost}
            </Link>
          </Button>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-labelledby="queue-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
          <SectionTitle id="queue-title" title={P.queueTitle} />
          {queue.length === 0 ? (
            <p className="text-small text-text-2">{P.queueEmpty}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {queue.map((p) => {
                const v = getVideo(p.videoId)!;
                return (
                  <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <VideoThumb size="sm" tone={v.tone} className="w-10" showPlay={false} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate font-semibold">{v.title}</p>
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro font-normal text-text-2">
                        <span>{P.platform[p.platform]} · {P.kind[p.kind]}</span>
                        <span aria-hidden>·</span>
                        <span>{weekday(p.at)}, {dateDayMonth(p.at)}, <bdi className="num">{timeOf(p.at)}</bdi></span>
                      </p>
                      {p.status === "failed" && p.errorHe && <p className="text-micro font-normal text-danger">{p.errorHe}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusPill status={p.status} />
                      {p.status === "scheduled" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-micro text-text-2 hover:text-text"
                          onClick={() => {
                            setPosts((list) => list.map((x) => (x.id === p.id ? { ...x, status: "canceled" } : x)));
                            toast.success(P.canceledToast);
                          }}
                        >
                          <X className="size-3" aria-hidden />
                          {P.cancelSchedule}
                        </button>
                      )}
                      {p.status === "failed" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-micro font-semibold text-link hover:underline"
                          onClick={() => {
                            setPosts((list) => list.map((x) => (x.id === p.id ? { ...x, status: "scheduled", at: "2026-10-17T11:00:00+03:00", errorHe: undefined } : x)));
                            toast.success(P.retryToast);
                          }}
                        >
                          <RotateCcw className="size-3" aria-hidden />
                          {P.retry}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-micro font-normal text-muted">{P.igNote}</p>
        </section>

        <section aria-labelledby="top-title" className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
          <SectionTitle id="top-title" title={P.leaderboard.title} sub={P.leaderboard.sub} />
          <ol className="flex flex-col gap-3">
            {top.map((p, i) => {
              const v = getVideo(p.videoId)!;
              const ins = p.insights!;
              return (
                <li key={p.id} className={cn("flex gap-3 rounded-sm p-3", i === 0 ? "bg-primary/8 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]" : "bg-surface-2")}>
                  <div className="relative">
                    <VideoThumb size="sm" tone={v.tone} className="w-14" />
                    <span className={cn("absolute -top-2 -inset-s-2 flex size-6 items-center justify-center rounded-full text-micro", i === 0 ? "bg-primary text-on-primary" : "bg-surface-3 text-text")}>
                      {i === 0 ? <Trophy className="size-3.5" aria-hidden /> : <bdi className="num">{i + 1}</bdi>}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                      <p className="font-semibold">{v.title}</p>
                      <p className="text-micro font-normal text-text-2">{P.platform[p.platform]} · {dateDayMonth(p.at)}</p>
                    </div>
                    <dl className="grid grid-cols-3 gap-2 text-micro">
                      <div><dt className="font-normal text-muted">{P.leaderboard.views}</dt><dd className="text-small font-bold"><bdi className="num">{nf.format(ins.views)}</bdi></dd></div>
                      <div><dt className="font-normal text-muted" title={P.leaderboard.skipHelp}>{P.leaderboard.skip}</dt><dd className="text-small font-bold">{ins.skipRate === null ? <span className="font-normal text-muted">{P.leaderboard.skipNull}</span> : <Pct value={ins.skipRate} />}</dd></div>
                      <div><dt className="font-normal text-muted">{P.leaderboard.watch}</dt><dd className="text-small font-bold"><Pct value={ins.avgWatchPct} /></dd></div>
                    </dl>
                    {i === 0 && (
                      <div className="flex flex-col gap-2 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-small text-text">{P.leaderboard.topPrompt}</p>
                        <Button asChild size="sm" className="shrink-0">
                          <Link href={`/app/campaigns/new?post=${p.id}`}>
                            <Clapperboard aria-hidden />
                            {P.leaderboard.boost}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="text-micro font-normal text-muted">{P.leaderboard.skipHelp}</p>
        </section>
      </div>

      <ContentCalendar />

      <Link href="/app/plan" className="group flex items-center justify-between gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] hover:bg-surface-2 md:p-5">
        <span className="flex flex-col gap-1">
          <span className="font-bold">{P.planLink.title}</span>
          <span className="text-small text-text-2">{P.planLink.sub}</span>
        </span>
        <DirIcon name="next" className="size-5 text-text-2 group-hover:text-text" />
      </Link>
    </div>
  );
}
