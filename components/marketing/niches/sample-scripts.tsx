import Link from "next/link";
import { Clapperboard, ListChecks, ShieldAlert, Timer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HookText } from "@/components/hooks/hook-text";
import { BEAT_ROLE_LABEL, NICHES_COPY, type SampleScript } from "@/content/he/niches";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

const S = NICHES_COPY.scripts;

/** Three sample scripts as cards: tags, beats table, CTA line, disclaimers, create button (Part 02 §4.3). */
export function SampleScripts({ scripts, hrefFor }: { scripts: SampleScript[]; hrefFor: (s: SampleScript) => string }) {
  return (
    <ol className="grid gap-5 lg:grid-cols-3">
      {scripts.map((s, i) => (
        <li key={s.title_he} className="flex flex-col rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <div className="flex flex-col gap-3 p-5 pb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="num inline-flex size-6 items-center justify-center rounded-full bg-primary text-micro text-on-primary">{i + 1}</span>
              <span className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{VIDEO_TYPE_LABEL[s.video_type]}</span>
              <span className="inline-flex items-center gap-1 rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
                <Timer className="size-3.5" aria-hidden />
                <bdi className="num">{s.duration_sec}</bdi> {S.seconds}
              </span>
              {s.outline && (
                <span className="inline-flex items-center gap-1 rounded-xs bg-violet/15 px-2 py-0.5 text-micro text-violet">
                  <ListChecks className="size-3.5" aria-hidden />
                  {S.outline}
                </span>
              )}
            </div>
            <h3 className="text-body-lg font-bold leading-snug">{s.title_he}</h3>
          </div>

          <div className="overflow-x-auto px-5">
            <table className="w-full min-w-[300px] border-collapse text-small">
              <caption className="sr-only">{s.title_he}</caption>
              <thead>
                <tr className="text-start text-micro text-muted">
                  <th scope="col" className="w-[22%] pb-2 text-start font-semibold">{S.step}</th>
                  <th scope="col" className="pb-2 text-start font-semibold">{S.vo}</th>
                  <th scope="col" className="w-[32%] pb-2 text-start font-semibold">{S.onscreen}</th>
                </tr>
              </thead>
              <tbody>
                {s.beats.map((b, j) => (
                  <tr key={j} className="border-t border-border align-top">
                    <th scope="row" className={cn("py-2.5 pe-2 text-start text-micro", b.role === "hook" ? "text-primary-text" : "text-text-2")}>
                      {BEAT_ROLE_LABEL[b.role] ?? b.role}
                    </th>
                    <td className={cn("py-2.5 pe-3", b.role === "hook" ? "font-semibold text-text" : "text-text-2", s.outline && b.role !== "hook" && "text-muted")}>
                      <HookText text={b.vo_he} />
                    </td>
                    <td className="py-2.5 font-semibold text-text">
                      <HookText text={b.onscreen_text_he} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto flex flex-col gap-3 p-5">
            <p className="text-small">
              <span className="font-semibold text-text">{S.cta}</span> <span className="text-text-2">{s.cta_text_he}</span>
            </p>
            {s.disclaimers_he.length > 0 && (
              <div className="flex gap-2 rounded-sm bg-surface-2 p-3 text-micro font-normal text-text-2">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <p>
                  <span className="font-semibold text-text">{S.disclaimers}</span> {s.disclaimers_he.join(" · ")}
                </p>
              </div>
            )}
            {s.outline && <p className="text-micro font-normal text-muted">{S.outlineNote}</p>}
            <Link href={hrefFor(s)} className={cn(buttonVariants({ variant: "secondary", size: "md" }), "w-full")}>
              <Clapperboard aria-hidden />
              {S.create}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
