"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clapperboard } from "lucide-react";
import { accentCta } from "@/components/layout/cta-styles";
import { Skeleton } from "@/components/ui/misc";
import { sceneIcon, sceneTone } from "@/components/wizard/create-state";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { getNiche } from "@/lib/data/seed";
import { getVideo, type GeneratedVideo } from "@/lib/generate/store";
import { MOCK_BUSINESS } from "@/lib/mock/workspace";
import { VideoPage } from "./video-page";
import { cn } from "@/lib/utils";

/** Quick structural hook score (0–100) until the scoring model exists: short hook, early text, CTA, length. */
function quickScore(v: GeneratedVideo): number {
  const words = v.hookText.split(/\s+/).filter(Boolean).length;
  const last = v.scenes[v.scenes.length - 1];
  let s = 58;
  if (words <= 9) s += 12;
  if (v.scenes[0]?.onscreen_text_he) s += 8;
  if (/[?!]/.test(v.hookText)) s += 5;
  if (last && /וואטסאפ|הודעה|התקשרו|הזמינו|לחצו/.test(last.vo_he)) s += 9;
  if (v.durationSec <= 30) s += 6;
  return Math.min(96, s);
}

export function GeneratedVideoView() {
  const q = useSearchParams();
  const id = q.get("id") ?? "";
  const [video, setVideo] = React.useState<GeneratedVideo | null | undefined>(undefined);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the store lives in the browser only
    setVideo(getVideo(id));
  }, [id]);

  if (video === undefined) return <Skeleton className="mx-auto aspect-reel w-[340px] rounded-[44px]" />;
  if (!video) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
        <Clapperboard className="size-10 text-muted" aria-hidden />
        <p className="text-body-lg text-text-2">{SIMPLE_APP.video.notFound}</p>
        <Link href="/app/create" className={cn(accentCta, "h-12 px-7")}>{SIMPLE_APP.video.notFoundCta}</Link>
      </div>
    );
  }
  const n = video.scenes.length;
  const icon = getNiche(video.nicheSlug)?.icon;
  return (
    <VideoPage
      id={video.id}
      title={video.title}
      aspect={video.aspect}
      durationSec={video.durationSec}
      score={quickScore(video)}
      voice={video.voice === "none" ? null : video.voice}
      source={video.source}
      downloadScript
      newVersionHref="/app/create"
      endCard={{ headline: "שלחו לנו וואטסאפ", name: MOCK_BUSINESS.name, logoLetter: MOCK_BUSINESS.logoLetter, lines: [`וואטסאפ ${MOCK_BUSINESS.whatsapp}`] }}
      scenes={video.scenes.map((s, i) => ({
        id: `${video.id}-${i}`,
        onscreen: s.onscreen_text_he,
        vo: s.vo_he,
        durationSec: s.duration_sec,
        tone: sceneTone(i, n),
        icon: sceneIcon(i, n, icon),
        image: s.image,
      }))}
    />
  );
}
