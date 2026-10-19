"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronDown, Copy, Download, Megaphone, RefreshCw, Send, Share2, Trash2 } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { accentCta, inkCta } from "@/components/layout/cta-styles";
import { Button } from "@/components/ui/button";
import { PhonePreview, type PreviewEndCard, type PreviewScene } from "@/components/video/phone-preview";
import { SIMPLE_APP } from "@/content/he/simple-app";
import type { Aspect, HookScoreData } from "@/lib/mock/projects";
import { HookScoreBadge, HookScorePanel } from "./hook-score";
import { ExportDialog, ShareDialog } from "./share-export";
import { fillText } from "./plural";
import { cn } from "@/lib/utils";

const V = SIMPLE_APP.video;

export interface VideoPageProps {
  id: string;
  title: string;
  scenes: PreviewScene[];
  aspect: Aspect;
  formats?: Aspect[];
  durationSec: number;
  score: number | null;
  scoreData?: HookScoreData | null;
  voice?: "male" | "female" | null;
  source?: "ai" | "mock" | null;
  endCard?: PreviewEndCard | null;
  failed?: boolean;
  newVersionHref: string;
  /** Generated videos have no rendered file yet: "הורדה" saves the script instead of opening the export dialog. */
  downloadScript?: boolean;
  onDelete?: () => void;
}

function saveScript(title: string, scenes: PreviewScene[]) {
  const text = [title, "", ...scenes.map((s, i) => `${fillText(V.scene, { n: i + 1 })} (${s.durationSec}s)\n${s.onscreen ? `על המסך: ${s.onscreen}\n` : ""}קריינות: ${s.vo}`)].join("\n\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.slice(0, 40) || "video"}.txt`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Video page: the player, three actions and a small hook-score badge; everything else lives under "עוד". */
export function VideoPage(p: VideoPageProps) {
  const [more, setMore] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const moreId = React.useId();

  const onDownload = () => {
    if (p.downloadScript) {
      saveScript(p.title, p.scenes);
      toast(V.downloadStarted);
    } else setExportOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 overflow-x-clip">
      <Link href="/app/projects" className="inline-flex w-fit items-center gap-1.5 text-small font-semibold text-text-2 hover:text-text">
        <DirIcon name="back" className="size-4" />
        {V.back}
      </Link>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
        <div className="flex flex-col gap-8 lg:order-1 lg:pt-6">
          <div className="flex flex-col gap-4">
            <h1 dir="auto" className="text-h2 font-extrabold [text-wrap:balance]">{p.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-small text-text-2">
              {p.score != null && (
                <span className="inline-flex items-center gap-2 rounded-full bg-surface-1 py-1 pe-3 ps-1 ring-1 ring-border">
                  <HookScoreBadge score={p.score} size={30} />
                  <span className="font-semibold">{V.hookScore}</span>
                </span>
              )}
              <span>
                <bdi className="num">{p.durationSec}</bdi> שניות · <bdi dir="ltr" className="num">{p.aspect}</bdi>
              </span>
              {p.source && <span className="text-muted">· {p.source === "ai" ? V.aiSource : V.demoSource}</span>}
            </div>
          </div>

          {p.failed ? (
            <p className="rounded-md bg-danger/10 p-4 text-body text-danger">{V.failed}</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={`/app/campaigns/new?project=${p.id}`} className={cn(accentCta, "h-14 px-8 text-lg")}>
                <Megaphone className="size-5" aria-hidden />
                {V.campaign}
              </Link>
              <Link href={`/app/publish/new?project=${p.id}`} className={cn(inkCta, "h-14 px-8 text-lg")}>
                <Send className="size-5" aria-hidden />
                {V.publish}
              </Link>
              <Button variant="outline" size="xl" onClick={onDownload} className="h-14">
                <Download aria-hidden />
                {V.download}
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-border pt-5">
            <button
              type="button"
              aria-expanded={more}
              aria-controls={moreId}
              onClick={() => setMore((m) => !m)}
              className="inline-flex w-fit items-center gap-1.5 text-body font-semibold text-text-2 hover:text-text"
            >
              {more ? V.less : V.more}
              <ChevronDown className={cn("size-4 transition-transform", more && "rotate-180")} aria-hidden />
            </button>
            <div id={moreId} hidden={!more} className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)} disabled={p.failed}><Share2 aria-hidden />{V.share}</Button>
                <Button asChild variant="secondary" size="sm"><Link href={p.newVersionHref}><RefreshCw aria-hidden />{V.newVersion}</Link></Button>
                <Button variant="secondary" size="sm" onClick={() => toast.success(V.duplicated)}><Copy aria-hidden />{V.duplicate}</Button>
                <Button variant="ghost" size="sm" className="text-danger" onClick={() => { p.onDelete?.(); toast(V.deleted); }}><Trash2 aria-hidden />{V.delete}</Button>
              </div>
              {p.scoreData && <HookScorePanel data={p.scoreData} />}
              <section aria-labelledby={`${moreId}-script`} className="flex flex-col gap-3">
                <h2 id={`${moreId}-script`} className="text-body-lg font-bold">{V.script}</h2>
                <ol className="flex flex-col gap-2">
                  {p.scenes.map((s, i) => (
                    <li key={s.id} className="flex gap-3 rounded-md bg-surface-1 p-4 ring-1 ring-border">
                      <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-micro">{i + 1}</span>
                      <div className="flex min-w-0 flex-col gap-1">
                        {s.onscreen && <p dir="auto" className="text-body font-bold">{s.onscreen}</p>}
                        <p dir="auto" className="text-small text-text-2">{s.vo}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>

        <div className="order-first mx-auto flex w-full max-w-[300px] justify-center lg:order-2 lg:max-w-none">
          <PhonePreview
            scenes={p.scenes}
            title={p.title}
            aspect={p.aspect}
            width={p.aspect === "9:16" ? 340 : 260}
            captionPreset="bold-pop"
            endCard={p.endCard ?? null}
            aiLabel
            autoPlay
            glow
            speak={p.voice ?? null}
          />
        </div>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} formats={p.formats?.length ? p.formats : [p.aspect]} />
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} projectId={p.id} />
    </div>
  );
}
