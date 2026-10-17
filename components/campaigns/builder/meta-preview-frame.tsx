import * as React from "react";
import { Bookmark, ChevronLeft, Globe, Heart, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp } from "lucide-react";
import { VideoThumb } from "../video-thumb";
import { builder as B } from "@/content/he/campaigns-app";
import { SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { cn } from "@/lib/utils";

export type PreviewPlatform = "facebook" | "instagram" | "reels";

/**
 * MetaPreviewFrame (spec §L.4) — an illustrative mock of the placement. Generic UI only:
 * no Meta / Facebook / Instagram logos (spec §A.3). Real Meta previews load after "הכנה לפרסום".
 */
export function MetaPreviewFrame({
  platform,
  hookText,
  tone,
  primaryText,
  headline,
  ctaLabel,
  label,
  className,
}: {
  platform: PreviewPlatform;
  hookText: string;
  tone: 0 | 1 | 2 | 3;
  primaryText: string;
  headline: string;
  ctaLabel: string;
  label: string;
  className?: string;
}) {
  const name = SAMPLE_BUSINESS.name;
  const avatar = (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-micro text-on-primary">
      {name.slice(0, 1)}
    </span>
  );

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <figcaption className="text-micro text-text-2">{label}</figcaption>
      <div className="overflow-hidden rounded-[22px] bg-black p-1.5 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        {platform === "reels" ? (
          <div className="relative overflow-hidden rounded-[16px]">
            <VideoThumb hookText={hookText} tone={tone} size="lg" showPlay={false} hideIcon className="w-full rounded-[16px]" />
            {/* action rail sits on the physical right (Part 01 §16.3 safe zones); inset-s = right in our RTL app */}
            <div aria-hidden className="absolute bottom-24 inset-s-2 flex flex-col items-center gap-3 text-white">
              <Heart className="size-5" />
              <MessageCircle className="size-5" />
              <Send className="size-5" />
              <MoreHorizontal className="size-5" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/85 to-transparent p-3 pt-10 text-white">
              <div className="flex items-center gap-2">
                {avatar}
                <span className="text-micro">{name}</span>
                <span className="text-micro font-normal opacity-75">· {B.review.sponsored}</span>
              </div>
              <p className="line-clamp-1 text-micro font-normal opacity-90">{primaryText}</p>
              <span className="flex h-8 items-center justify-between rounded-sm bg-white/90 px-3 text-micro text-black">
                {ctaLabel}
                <ChevronLeft className="size-3.5" aria-hidden />
              </span>
            </div>
          </div>
        ) : platform === "facebook" ? (
          <div className="rounded-[16px] bg-surface-1 text-text">
            <div className="flex items-center gap-2 p-3">
              {avatar}
              <div className="min-w-0 flex-1">
                <p className="truncate text-micro text-text">{name}</p>
                <p className="flex items-center gap-1 text-micro font-normal text-muted">
                  {B.review.sponsored} · <Globe className="size-3" aria-hidden />
                </p>
              </div>
              <MoreHorizontal className="size-4 text-text-2" aria-hidden />
            </div>
            <p className="line-clamp-2 px-3 pb-2 text-micro font-normal text-text">{primaryText}</p>
            <VideoThumb hookText={hookText} tone={tone} size="md" aspect="feed" className="w-full rounded-none" />
            <div className="flex items-center justify-between gap-2 bg-surface-2 px-3 py-2">
              <p className="line-clamp-1 min-w-0 text-micro text-text">{headline}</p>
              <span className="shrink-0 rounded-xs bg-surface-3 px-2 py-1 text-micro text-text">{ctaLabel}</span>
            </div>
            <div aria-hidden className="flex items-center justify-around border-t border-border px-2 py-2 text-micro font-normal text-text-2">
              <span className="flex items-center gap-1"><ThumbsUp className="size-3.5" />לייק</span>
              <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />תגובה</span>
              <span className="flex items-center gap-1"><Share2 className="size-3.5" />שיתוף</span>
            </div>
          </div>
        ) : (
          <div className="rounded-[16px] bg-surface-1 text-text">
            <div className="flex items-center gap-2 p-3">
              {avatar}
              <div className="min-w-0 flex-1">
                <p className="truncate text-end text-micro" dir="ltr">{SAMPLE_BUSINESS.instagram}</p>
                <p className="text-micro font-normal text-muted">{B.review.sponsored}</p>
              </div>
              <MoreHorizontal className="size-4 text-text-2" aria-hidden />
            </div>
            <VideoThumb hookText={hookText} tone={tone} size="md" aspect="feed" className="w-full rounded-none" />
            <div className="flex items-center justify-between bg-surface-2 px-3 py-2 text-micro">
              {ctaLabel}
              <ChevronLeft className="size-3.5" aria-hidden />
            </div>
            <div aria-hidden className="flex items-center gap-3 px-3 pt-2 text-text">
              <Heart className="size-4" />
              <MessageCircle className="size-4" />
              <Send className="size-4" />
              <Bookmark className="ms-auto size-4" />
            </div>
            <p className="line-clamp-2 px-3 pb-3 pt-1.5 text-micro font-normal">
              <bdi dir="ltr" className="font-bold">{SAMPLE_BUSINESS.instagram}</bdi> {primaryText}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
