"use client";
import * as React from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/misc";
import { FilterChips } from "@/components/settings/controls";
import { EmptyState, TableShell } from "@/components/settings/kit";
import { billingCopy } from "@/content/he/account";
import { MOCK_LEDGER, type LedgerKind } from "@/lib/mock/account";
import { formatDateHe, formatInt, formatSigned } from "@/components/settings/format";
import { cn } from "@/lib/utils";

const l = billingCopy.ledger;
type Filter = "all" | "additions" | "generations" | "refunds" | "expirations";
const FILTER_KINDS: Record<Exclude<Filter, "all">, LedgerKind[]> = {
  additions: ["grant_trial", "grant_plan", "grant_rollover", "purchase", "promo", "adjustment"],
  generations: ["reserve", "capture"],
  refunds: ["release", "refund"],
  expirations: ["expire"],
};

/** LedgerTable (Part 03 §15.1): signed change carries the meaning, color only reinforces it. */
export function LedgerTable() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [technical, setTechnical] = React.useState(false);
  const rows = MOCK_LEDGER.filter((r) => (technical || r.kind !== "capture") && (filter === "all" || FILTER_KINDS[filter].includes(r.kind)));

  const exportCsv = () => {
    const header = [l.columns.date, l.columns.description, "סוג", l.columns.change, l.columns.balanceAfter].join(",");
    const body = MOCK_LEDGER.map((r) => [r.at.replace("T", " "), `"${r.descriptionHe.replace(/"/g, '""')}"`, l.kinds[r.kind], r.delta, r.balanceAfter].join(",")).join("\n");
    const blob = new Blob(["﻿" + header + "\n" + body], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = l.csvFilename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterChips<Filter>
          label={l.filterLabel}
          value={filter}
          onChange={setFilter}
          options={(Object.keys(l.filters) as Filter[]).map((f) => ({ value: f, label: l.filters[f] }))}
        />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-text-2">
            <Switch checked={technical} onCheckedChange={setTechnical} />
            {l.technical}
          </label>
          <Button size="sm" variant="secondary" onClick={exportCsv}>
            <Download aria-hidden />
            {l.exportCsv}
          </Button>
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState illustration="ledger" title={l.empty} size="inline" />
      ) : (
        <TableShell>
          <caption className="sr-only">{l.title}</caption>
          <thead>
            <tr>
              <th scope="col">{l.columns.date}</th>
              <th scope="col">{l.columns.description}</th>
              <th scope="col" className="text-end">{l.columns.change}</th>
              <th scope="col" className="text-end">{l.columns.balanceAfter}</th>
              <th scope="col"><span className="sr-only">{l.columns.link}</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={cn(r.kind === "capture" && "text-muted")}>
                <td className="whitespace-nowrap text-text-2">
                  {formatDateHe(r.at, "dayMonth")}
                  <span className="ms-1.5 text-muted"><bdi className="num">{r.at.split("T")[1]}</bdi></span>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text">{r.descriptionHe}</span>
                    <span className="text-micro text-muted">{l.kinds[r.kind]}</span>
                  </div>
                </td>
                <td className="text-end">
                  <bdi className={cn("num font-bold", r.delta > 0 && "text-success", r.delta < 0 && "text-text")}>{formatSigned(r.delta)}</bdi>
                </td>
                <td className="text-end"><bdi className="num text-text-2">{formatInt(r.balanceAfter)}</bdi></td>
                <td className="text-end">
                  {r.projectId && (
                    <Link href={`/app/projects/${r.projectId}`} className="text-sm font-semibold text-link underline-offset-4 hover:underline">{l.toProject}</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
