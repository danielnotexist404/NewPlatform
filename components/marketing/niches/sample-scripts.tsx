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
    <ol className="flex flex-col gap-5">
      {scripts.map((s, i) => (
        <li key={s.title_he} className="grid overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 border-b border-border p-6 lg:border-b-0 lg:border-e">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="num inline-flex size-7 items-center justify-center rounded-full bg-primary text-micro text-on-primary">{i + 1}</span>
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
            <h3 className="text-h3">{s.title_he}</h3>
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
            <Link href={hrefFor(s)} className={cn(buttonVariants({ variant: "secondary", size: "md" }), "mt-auto w-full")}>
              <Clapperboard aria-hidden />
              {S.create}
            </Link>
          </div>

          <div className="p-5 md:overflow-x-auto md:p-6">
            <table className="w-full border-collapse text-small max-md:block md:min-w-[460px]">
              <caption className="sr-only">{s.title_he}</caption>
              <thead className="max-md:hidden">
                <tr className="text-micro text-muted">
                  <th scope="col" className="w-[16%] pb-2 text-start font-semibold">{S.step}</th>
                  <th scope="col" className="pb-2 text-start font-semibold">{S.vo}</th>
                  <th scope="col" className="w-[32%] pb-2 text-start font-semibold">{S.onscreen}</th>
                </tr>
              </thead>
              <tbody className="max-md:block">
                {s.beats.map((b, j) => (
                  <tr key={j} className="border-t border-border align-top max-md:flex max-md:flex-col max-md:gap-1.5 max-md:py-3 max-md:first:border-t-0 max-md:first:pt-0">
                    <th scope="row" className={cn("py-3 pe-3 text-start text-micro max-md:p-0", b.role === "hook" ? "text-primary-text" : "text-text-2")}>
                      {BEAT_ROLE_LABEL[b.role] ?? b.role}
                    </th>
                    <td className={cn("py-3 pe-4 max-md:p-0", b.role === "hook" ? "font-semibold text-text" : s.outline ? "text-muted" : "text-text-2")}>
                      <HookText text={b.vo_he} />
                    </td>
                    <td className="py-3 max-md:p-0">
                      <span className="inline-block rounded-xs bg-surface-2 px-2 py-0.5 font-bold text-text">
                        <HookText text={b.onscreen_text_he} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </li>
      ))}
    </ol>
  );
}
