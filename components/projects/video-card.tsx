import Link from "next/link";
import { VideoTile } from "@/components/video/video-tile";
import type { Aspect, SceneTone } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

export interface VideoCardData {
  id: string;
  href: string;
  title: string;
  hookText?: string;
  tone: SceneTone;
  icon?: string | null;
  durationSec?: number;
  aspect?: Aspect;
  image?: string | null;
  status?: { label: string; tone: "ready" | "progress" | "draft" | "failed" } | null;
  meta?: string;
}

const STATUS_DOT: Record<NonNullable<VideoCardData["status"]>["tone"], string> = {
  ready: "bg-success",
  progress: "bg-violet",
  draft: "bg-border-strong",
  failed: "bg-danger",
};

/** One clean card: 9:16 poster + title + one line of meta. */
export function VideoCard({ video, className, priority }: { video: VideoCardData; className?: string; priority?: boolean }) {
  return (
    <Link
      href={video.href}
      prefetch={priority ? true : undefined}
      className={cn("group/card flex flex-col gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4", className)}
    >
      <div className="relative overflow-hidden rounded-lg elev-2 transition-[box-shadow,translate] duration-300 group-hover/card:-translate-y-0.5 group-hover/card:elev-3">
        <VideoTile tone={video.tone} icon={video.icon} hookText={video.hookText} durationSec={video.durationSec} textSize="sm" className="rounded-lg" />
        {video.image && (
          // eslint-disable-next-line @next/next/no-img-element -- generated data URL frame
          <img src={video.image} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
        )}
        {video.image && video.hookText && (
          <p
            aria-hidden
            dir="rtl"
            className="@container absolute inset-x-[8%] top-[30%] text-center text-[1.05rem] font-black leading-[1.15] text-white [text-wrap:balance]"
            style={{ textShadow: "0 3px 14px color-mix(in oklab, var(--color-black) 70%, transparent)" }}
          >
            {video.hookText}
          </p>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1 px-0.5">
        <h3 dir="auto" className="truncate text-body font-bold leading-snug">{video.title}</h3>
        <p className="flex items-center gap-1.5 text-micro font-normal text-muted">
          {video.status && <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[video.status.tone])} aria-hidden />}
          {video.status && <span className="font-semibold text-text-2">{video.status.label}</span>}
          {video.status && video.meta && <span aria-hidden>·</span>}
          {video.meta && <span className="truncate">{video.meta}</span>}
        </p>
      </div>
    </Link>
  );
}
