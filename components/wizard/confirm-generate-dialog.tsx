"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plural, fill, plural } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { QUALITY_LABEL, VIDEO_TYPE_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { MOCK_TRACKS, MOCK_VOICES } from "@/lib/mock/workspace";
import { CostBadge } from "./cost-badge";
import { costOf, formatsOf, useWizard } from "./wizard-state";
import { etaRange, estimate } from "./estimate";

const C = APP_CORE.wizard.confirm;
const LETTERS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳"];

/** Part 03 §6.10 — summary, cost, refund promise, ETA, AI-policy line; initial focus on "חזרה לעריכה". */
export function ConfirmGenerateDialog({ open, onOpenChange, balance }: { open: boolean; onOpenChange: (o: boolean) => void; balance: number }) {
  const router = useRouter();
  const { data } = useWizard();
  const [starting, setStarting] = React.useState(false);
  const est = costOf(data);
  const formats = formatsOf(data);
  const variants = data.abMode ? data.hooks.length : 1;
  const single = estimate({ durationSec: data.durationSec, quality: data.quality, visualMix: data.visualMix, formats: formats.length, noVoice: data.voiceId === "none", musicMode: data.musicMode });
  const perVariant = variants > 1 ? Math.round((est.credits - single.credits) / (variants - 1)) : 0;
  const [eMin, eMax] = etaRange(data.quality, data.durationSec, formats.length, variants);
  const insufficient = est.credits > balance;
  const voice = data.voiceId === "none" ? C.noVoice : MOCK_VOICES.find((v) => v.id === data.voiceId)?.name ?? "";
  const music = data.musicMode === "none" ? C.noMusic : data.musicMode === "generate" ? C.originalMusic : MOCK_TRACKS.find((t) => t.id === data.trackId)?.name ?? "";

  const rows: [string, React.ReactNode][] = [
    [C.rows.video, <>{VIDEO_TYPE_LABEL[data.videoType]} · <bdi className="num">{data.durationSec}</bdi> שנ׳</>],
    [C.rows.formats, <bdi key="f" dir="ltr" className="font-mono">{formats.join(" · ")}</bdi>],
    [C.rows.quality, QUALITY_LABEL[data.quality]],
    [C.rows.visual, VISUAL_MIX_LABEL[data.visualMix]],
    [C.rows.voice, voice],
    [C.rows.music, music],
  ];
  if (variants > 1) rows.push([C.rows.variants, <Plural key="v" n={variants} forms={APP_CORE.counts.hooksVersions} />]);

  const start = () => {
    setStarting(true);
    window.setTimeout(() => {
      onOpenChange(false);
      setStarting(false);
      toast.success(C.started);
      router.push(`/app/projects/${data.projectId}/jobs/j-new`);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !starting && onOpenChange(o)}>
      <DialogContent size="lg" className="max-h-[90dvh] overflow-y-auto">
        <DialogTitle>{C.title}</DialogTitle>
        <DialogDescription className="sr-only">{fill(C.time, { eta: `${eMin}–${eMax}` })}</DialogDescription>
        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto]">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-small">
            {rows.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </React.Fragment>
            ))}
          </dl>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <CostBadge credits={est.credits} lines={est.lines} size="lg" balance={balance} />
            <p className="text-micro font-normal text-muted">
              {fill(C.alreadySpent, { total: plural(est.credits + est.alreadySpent, APP_CORE.counts.credits) })}
            </p>
            {variants > 1 &&
              data.hooks.slice(1).map((h, i) => (
                <p key={h.key} className="text-micro font-normal text-text-2">
                  גרסה {LETTERS[i + 1]} · <Plural n={perVariant} forms={APP_CORE.counts.creditsMore} />
                </p>
              ))}
            <p className="text-micro font-semibold text-text-2">{plural(Math.max(0, balance - est.credits), APP_CORE.counts.afterGeneration)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-md bg-surface-2 p-4 text-small">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            {C.refund}
          </p>
          <p className="text-text-2">{fill(C.time, { eta: <bdi className="num">{`${eMin}–${eMax}`}</bdi> })}</p>
        </div>

        {insufficient && (
          <p role="alert" className="mt-4 text-small font-semibold text-rose">
            <Plural n={est.credits - balance} forms={APP_CORE.counts.missing} />
          </p>
        )}

        <p className="mt-4 text-micro font-normal text-text-2">
          {C.policyPre}
          <a href="/legal/ai-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-link underline underline-offset-2">
            {C.policyLink}
            <span className="sr-only"> {C.newTab}</span>
          </a>
          {C.policyPost}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary" autoFocus disabled={starting}>{C.back}</Button>
          </DialogClose>
          {insufficient ? (
            <Button onClick={() => router.push("/app/billing")}>{C.topUp}</Button>
          ) : (
            <Button onClick={start} loading={starting}>
              {starting ? C.starting : <>{APP_CORE.wizard.preview.generate} <span className="font-normal opacity-80">· {plural(est.credits, APP_CORE.counts.credits)}</span></>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
