"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Download, FileArchive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Panel, Section, Note, StatusPill, TableShell } from "./kit";
import { settingsCopy, accountCommon } from "@/content/he/account";
import { MOCK_CONSENTS, MOCK_MEMBERS, MOCK_WORKSPACE, MOCK_SUBSCRIPTION, TODAY_ISO } from "@/lib/mock/account";
import { fill, formatDateHe } from "./format";

const c = settingsCopy.privacy;

function daysBetween(a: string, b: string) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export function PrivacySettings() {
  const params = useSearchParams();
  const solo = params.get("scenario") === "solo";
  const [consents, setConsents] = React.useState(MOCK_CONSENTS);
  const [exportState, setExportState] = React.useState<"none" | "pending" | "ready">("none");
  const [deleteState, setDeleteState] = React.useState<"idle" | "checking" | "blocked" | "dialog" | "deleted">("idle");
  const [confirmText, setConfirmText] = React.useState("");
  const hasOtherMembers = !solo && MOCK_MEMBERS.length > 1;
  const recentPayment = daysBetween(MOCK_SUBSCRIPTION.firstPaidAt, TODAY_ISO) <= 14;

  const toggleConsent = (kind: (typeof MOCK_CONSENTS)[number]["kind"]) => {
    setConsents((list) => list.map((x) => (x.kind === kind ? { ...x, granted: !x.granted, at: TODAY_ISO } : x)));
    toast.success(accountCommon.saved);
  };

  return (
    <div className="flex flex-col gap-10">
      <Section id="consents" title={c.consentsTitle}>
        <Panel className="pb-2 md:pb-2">
          <TableShell>
            <caption className="sr-only">{c.consentsCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{c.columns.kind}</th>
                <th scope="col">{c.columns.version}</th>
                <th scope="col">{c.columns.date}</th>
                <th scope="col">{c.columns.status}</th>
                <th scope="col"><span className="sr-only">{c.columns.action}</span></th>
              </tr>
            </thead>
            <tbody>
              {consents.map((x) => (
                <tr key={x.kind}>
                  <th scope="row">{c.kinds[x.kind]}</th>
                  <td><bdi className="num text-text-2">{x.version}</bdi></td>
                  <td className="text-text-2">{formatDateHe(x.at)}</td>
                  <td>{x.granted ? <StatusPill tone="success">{c.granted}</StatusPill> : <StatusPill tone="neutral">{c.notGranted}</StatusPill>}</td>
                  <td className="text-end">
                    {x.kind === "marketing_email" && (
                      <Button size="sm" variant="secondary" onClick={() => toggleConsent(x.kind)}>{x.granted ? c.revoke : c.grant}</Button>
                    )}
                    {x.kind === "analytics_cookies" && (
                      <Button size="sm" variant="secondary" onClick={() => toggleConsent(x.kind)}>{x.granted ? c.revoke : c.grant}</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Panel>
      </Section>

      <Section id="export" title={c.exportTitle} description={c.exportBody}>
        <Panel className="flex flex-col gap-4">
          {exportState === "none" && (
            <Button
              variant="secondary"
              className="w-fit"
              onClick={() => { setExportState("pending"); toast.success(c.exportStarted); }}
            >
              <FileArchive aria-hidden />
              {c.exportButton}
            </Button>
          )}
          {exportState === "pending" && (
            <div className="flex flex-col gap-3">
              <Note>{c.exportStarted}</Note>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill tone="progress">{fill(c.exportPending, { date: formatDateHe(TODAY_ISO) })}</StatusPill>
                <Button size="sm" variant="ghost" onClick={() => setExportState("ready")}>{accountCommon.retry}</Button>
              </div>
            </div>
          )}
          {exportState === "ready" && (
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="success">{fill(c.exportReady, { expiresAt: formatDateHe("2026-10-24") })}</StatusPill>
              <Button size="sm" onClick={() => toast(accountCommon.download)}>
                <Download aria-hidden />
                {accountCommon.download}
              </Button>
            </div>
          )}
        </Panel>
      </Section>

      <Section id="delete" title={<span className="text-danger">{c.deleteTitle}</span>}>
        <Panel tone="danger" className="flex flex-col gap-4">
          <p className="text-text-2">{c.deleteIntro}</p>
          {recentPayment && (
            <Note tone="warning">
              {c.recentPayment}{" "}
              <Link href="/app/billing/cancel" className="font-semibold text-link underline underline-offset-4">{c.recentPaymentLink}</Link>
            </Note>
          )}
          {deleteState === "blocked" && (
            <Note tone="danger">
              <p>{fill(c.blocker, { workspace: MOCK_WORKSPACE.name })}</p>
              <Link href="/app/team" className="mt-1 inline-block font-semibold text-link underline underline-offset-4">{c.blockerLink}</Link>
            </Note>
          )}
          <Button
            variant="destructive"
            className="w-fit"
            loading={deleteState === "checking"}
            onClick={() => {
              setDeleteState("checking");
              setTimeout(() => setDeleteState(hasOtherMembers ? "blocked" : "dialog"), 700);
            }}
          >
            <Trash2 aria-hidden />
            {deleteState === "checking" ? c.checking : c.deleteButton}
          </Button>
          {deleteState === "deleted" && <Note tone="success">{c.deleted}</Note>}
        </Panel>
      </Section>

      <Dialog open={deleteState === "dialog"} onOpenChange={(o) => !o && setDeleteState("idle")}>
        <DialogContent>
          <DialogTitle>{c.deleteTitle}</DialogTitle>
          <DialogDescription>{c.dialogBody}</DialogDescription>
          {recentPayment && (
            <Note tone="warning" className="mt-4">
              {c.recentPayment}{" "}
              <Link href="/app/billing/cancel" className="font-semibold text-link underline underline-offset-4">{c.recentPaymentLink}</Link>
            </Note>
          )}
          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="confirm-delete">{c.confirmLabel}</Label>
            <Input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteState("idle")}>{accountCommon.cancel}</Button>
            <Button
              variant="destructive"
              disabled={confirmText.trim() !== c.confirmWord}
              onClick={() => { setDeleteState("deleted"); setConfirmText(""); }}
            >
              {c.deleteButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
