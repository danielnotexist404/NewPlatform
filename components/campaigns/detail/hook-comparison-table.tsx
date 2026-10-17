"use client";
import * as React from "react";
import { CircleHelp, Hourglass, Trophy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Price } from "@/components/a11y/num";
import { variantMetrics, type Campaign, type HookVariant } from "@/lib/mock/campaigns";
import { builder as B, detail as D, HOOK_KEY_HE, kpi as K } from "@/content/he/campaigns-app";
import { AdStatusBadge } from "../status-badge";
import { VideoThumb } from "../video-thumb";
import { Pct, fmt } from "../text";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("he-IL");

function HelpPop({ label, help }: { label: string; help: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center gap-1 rounded-full hover:text-text" aria-label={`${K.whatIsIt} ${label}`}>
          {label}
          <CircleHelp className="size-3.5" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 text-small text-text-2">{help}</PopoverContent>
    </Popover>
  );
}

function RateBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="flex items-center gap-2">
      <Pct value={value * 100} className="w-10 font-semibold text-text" />
      <span aria-hidden className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-3 xl:block">
        <span className="block h-full rounded-full bg-primary-text" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </span>
    </span>
  );
}

/** HookComparisonTable (spec §G.2): table on wide screens, cards on mobile. Winner badge only after the minimum sample. */
export function HookComparisonTable({ campaign, statuses, winner }: { campaign: Campaign; statuses: Record<string, HookVariant["status"]>; winner: HookVariant | null }) {
  const rows = campaign.variants.map((v) => ({ v, m: variantMetrics(campaign, v) }));
  const maxHook = Math.max(...campaign.variants.map((v) => v.hookRate));
  const maxHold = Math.max(...campaign.variants.map((v) => v.holdRate));
  const hasData = rows.some((r) => r.m.impressions > 0);

  return (
    <div className="flex flex-col gap-4">
      {campaign.variants.length > 1 && !winner && hasData && (
        <p className="flex items-start gap-2 rounded-sm bg-surface-2 px-3 py-2 text-small text-text-2">
          <Hourglass className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span><span className="font-semibold text-text">{D.hooks.early}.</span> {D.hooks.earlyHelp}</span>
        </p>
      )}
      {campaign.variants.length === 1 && <p className="text-small text-text-2">{D.hooks.single}</p>}

      {/* wide */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-small">
          <caption className="sr-only">{D.hooks.title}</caption>
          <thead className="text-micro text-text-2">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pe-3 text-start font-semibold">{D.hooks.cols.hook}</th>
              <th scope="col" className="px-3 py-2 text-start font-semibold">{D.hooks.cols.impressions}</th>
              <th scope="col" className="px-3 py-2 text-start font-semibold"><HelpPop label={D.hooks.cols.hookRate} help={D.hooks.hookRateHelp} /></th>
              <th scope="col" className="px-3 py-2 text-start font-semibold"><HelpPop label={D.hooks.cols.holdRate} help={D.hooks.holdRateHelp} /></th>
              <th scope="col" className="px-3 py-2 text-start font-semibold">{D.hooks.cols.results}</th>
              <th scope="col" className="px-3 py-2 text-start font-semibold">{D.hooks.cols.cpr}</th>
              <th scope="col" className="py-2 ps-3 text-start font-semibold">{D.hooks.cols.status}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ v, m }) => {
              const isWinner = winner?.key === v.key;
              return (
                <tr key={v.key} className={cn("border-b border-border last:border-b-0", isWinner && "bg-primary/6")}>
                  <th scope="row" className="py-3 pe-3 text-start font-normal">
                    <div className="flex items-center gap-3">
                      <VideoThumb size="sm" tone={v.tone} className="w-10" showPlay={false} />
                      <div className="min-w-0 max-w-64">
                        <p className="flex items-center gap-2 text-micro text-primary-text">
                          {fmt(B.review.hook, { key: HOOK_KEY_HE[v.key] })} · <span className="font-normal text-muted">{v.hookTypeHe}</span>
                        </p>
                        <p className="line-clamp-2 font-semibold text-text">{v.hookText}</p>
                        {isWinner && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-micro text-on-primary">
                            <Trophy className="size-3" aria-hidden />
                            {D.hooks.winner}
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                  <td className="px-3 py-3"><bdi className="num">{m.impressions ? nf.format(m.impressions) : "—"}</bdi></td>
                  <td className="px-3 py-3">{m.impressions ? <RateBar value={v.hookRate} max={maxHook} /> : "—"}</td>
                  <td className="px-3 py-3">{m.impressions ? <RateBar value={v.holdRate} max={maxHold} /> : "—"}</td>
                  <td className="px-3 py-3"><bdi className="num">{m.impressions ? nf.format(m.results) : "—"}</bdi></td>
                  <td className={cn("px-3 py-3", isWinner && "font-bold text-text")}>{m.costPerResult ? <Price ils={m.costPerResult} decimals /> : "—"}</td>
                  <td className="py-3 ps-3"><AdStatusBadge status={statuses[v.key] ?? v.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map(({ v, m }) => {
          const isWinner = winner?.key === v.key;
          return (
            <li key={v.key} className={cn("flex flex-col gap-3 rounded-md bg-surface-2 p-3", isWinner && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}>
              <div className="flex items-start gap-3">
                <VideoThumb size="sm" tone={v.tone} className="w-11" showPlay={false} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-micro text-primary-text">{fmt(B.review.hook, { key: HOOK_KEY_HE[v.key] })}</span>
                    {isWinner && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-micro text-on-primary">
                        <Trophy className="size-3" aria-hidden />
                        {D.hooks.winner}
                      </span>
                    )}
                    <AdStatusBadge status={statuses[v.key] ?? v.status} />
                  </div>
                  <p className="mt-1 text-small font-semibold">{v.hookText}</p>
                </div>
              </div>
              {m.impressions > 0 ? (
                <dl className="grid grid-cols-3 gap-2 text-micro">
                  <div><dt className="font-normal text-muted">{D.hooks.cols.hookRate}</dt><dd className="text-small font-bold"><Pct value={v.hookRate * 100} /></dd></div>
                  <div><dt className="font-normal text-muted">{D.hooks.cols.holdRate}</dt><dd className="text-small font-bold"><Pct value={v.holdRate * 100} /></dd></div>
                  <div><dt className="font-normal text-muted">{D.hooks.cols.cpr}</dt><dd className="text-small font-bold">{m.costPerResult ? <Price ils={m.costPerResult} decimals /> : "—"}</dd></div>
                  <div><dt className="font-normal text-muted">{D.hooks.cols.impressions}</dt><dd className="text-small"><bdi className="num">{nf.format(m.impressions)}</bdi></dd></div>
                  <div><dt className="font-normal text-muted">{D.hooks.cols.results}</dt><dd className="text-small"><bdi className="num">{nf.format(m.results)}</bdi></dd></div>
                </dl>
              ) : (
                <p className="text-micro font-normal text-muted">{D.hooks.noData}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
