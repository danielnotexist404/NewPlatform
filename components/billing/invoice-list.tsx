"use client";
import * as React from "react";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { EmptyState, TableShell } from "@/components/settings/kit";
import { billingCopy } from "@/content/he/account";
import { MOCK_INVOICES } from "@/lib/mock/account";
import { fill, formatDateHe } from "@/components/settings/format";

const i = billingCopy.invoices;

export function InvoiceList() {
  if (MOCK_INVOICES.length === 0) {
    return <EmptyState illustration="invoices" title={i.emptyTitle} description={i.emptyBody} />;
  }
  return (
    <TableShell>
      <caption className="sr-only">{i.title}</caption>
      <thead>
        <tr>
          <th scope="col">{i.columns.number}</th>
          <th scope="col">{i.columns.date}</th>
          <th scope="col">{i.columns.kind}</th>
          <th scope="col" className="text-end">{i.columns.amount}</th>
          <th scope="col">{i.columns.allocation}</th>
          <th scope="col"><span className="sr-only">{i.columns.pdf}</span></th>
        </tr>
      </thead>
      <tbody>
        {MOCK_INVOICES.map((inv) => (
          <tr key={inv.id}>
            <th scope="row"><bdi className="num">{inv.docNumber}</bdi></th>
            <td className="text-text-2">{formatDateHe(inv.at)}</td>
            <td>{i.kinds[inv.kind]}</td>
            <td className="text-end font-semibold"><Price ils={inv.amountIls} /></td>
            <td className="text-text-2">{inv.allocationNumber ? <bdi className="num">{inv.allocationNumber}</bdi> : i.noAllocation}</td>
            <td className="text-end">
              <Button
                size="sm"
                variant="ghost"
                aria-label={fill(i.downloadSr, { docNumber: String(inv.docNumber) })}
                onClick={() => toast(i.downloading)}
              >
                <FileDown aria-hidden />
                {i.download}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
