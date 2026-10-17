"use client";
import * as React from "react";
import Link from "next/link";
import { BadgeCheck, CreditCard, Globe, Link2, Lock, MessageCircle, Plug, RefreshCw, Repeat2, ShieldCheck, Trash2, Unplug } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, LtrInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { metaConnection as M } from "@/lib/mock/campaigns";
import { connect as C, integrationsCopy as I, sample } from "@/content/he/campaigns-app";
import { SampleNote, SectionTitle } from "./page-header";
import { MetaConnectChecklist } from "./meta-connect-checklist";
import { MetaConnectFlow } from "./connect-meta-card";
import { dateLong, fmt, Phone, timeOf } from "./text";
import { cn } from "@/lib/utils";

type Status = "connected" | "needs_reconnect" | "revoked";
const ALL_OK = Object.fromEntries(C.checklist.map((c) => [c.key, "ok" as const]));

export function MetaIntegration() {
  const [status, setStatus] = React.useState<Status>(M.status);
  const [checking, setChecking] = React.useState(false);
  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const [alsoDelete, setAlsoDelete] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [word, setWord] = React.useState("");
  const [flowOpen, setFlowOpen] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(M.privacyUrl);
  const [savedPrivacy, setSavedPrivacy] = React.useState(M.privacyUrl);
  const connected = status === "connected";

  function recheck() {
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      toast.success(I.recheckToast);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Rendered inside the /app/settings layout (which owns the page H1), so this is a section heading. */}
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">{I.title}</h2>
        <p className="text-small text-text-2">{I.sub}</p>
      </div>
      <SampleNote text={sample.integrations} />

      <section aria-labelledby="meta-title" className="relative overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector opacity-60" />
        <div className="relative flex flex-col gap-6 p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-surface-3 text-text"><Plug className="size-6" aria-hidden /></span>
              <div className="flex flex-col gap-1">
                <h3 id="meta-title" className="text-h3">{I.metaTitle}</h3>
                <p className="text-small text-text-2">{I.metaSub}</p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                status === "connected" ? "bg-success/15 text-success" : status === "needs_reconnect" ? "bg-primary/12 text-primary-text" : "bg-surface-3 text-text-2",
              )}
            >
              <span aria-hidden className={cn("size-1.5 rounded-full bg-current", connected && "animate-pulse-dot")} />
              {I.status[status]}
            </span>
          </div>

          {status === "needs_reconnect" && <p role="alert" className="rounded-sm bg-primary/10 p-3 text-small">{I.reconnectBanner}</p>}

          {connected ? (
            <>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info label={I.labels.business} value={M.businessName} />
                <Info label={I.labels.connectedBy} value={M.connectedBy} />
                <Info label={I.labels.connectedAt} value={dateLong(M.connectedAt)} />
                <Info label={I.labels.lastCheck} value={fmt(I.lastCheckValue, { time: timeOf(M.lastHealthCheck) })} />
              </dl>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <h4 className="text-body font-bold">{I.assetsTitle}</h4>
                  <ul className="flex flex-col gap-2">
                    <Asset icon={Globe} label={I.assets.page} value={M.assets.page.name} meta={M.assets.page.category} />
                    <Asset icon={Link2} label={I.assets.ig} value={<bdi dir="ltr">@{M.assets.instagram.username}</bdi>} />
                    <Asset icon={CreditCard} label={I.assets.ad} value={M.assets.adAccount.name} meta={<><bdi dir="ltr" className="font-mono">{M.assets.adAccount.id}</bdi> · {I.currency}</>} />
                    <Asset icon={MessageCircle} label={I.assets.whatsapp} value={<Phone value={M.assets.whatsapp} />} meta={I.confirmed} />
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="flex items-center justify-between gap-2 text-body font-bold">
                    {I.healthTitle}
                    <span className="inline-flex items-center gap-1 text-micro text-success"><BadgeCheck className="size-4" aria-hidden />{I.healthOk}</span>
                  </h4>
                  <MetaConnectChecklist states={checking ? Object.fromEntries(C.checklist.map((c) => [c.key, "checking" as const])) : ALL_OK} showFixes={false} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                <Button variant="secondary" onClick={() => toast(I.swapToast)}>
                  <Repeat2 aria-hidden />
                  {I.swap}
                </Button>
                <Button variant="secondary" onClick={recheck} loading={checking}>
                  {!checking && <RefreshCw aria-hidden />}
                  {I.recheck}
                </Button>
                <Button variant="secondary" onClick={() => setFlowOpen(true)}>
                  <Link2 aria-hidden />
                  {I.reconnect}
                </Button>
                <span className="grow" />
                <Button variant="outline" className="border-danger text-danger hover:bg-danger/10" onClick={() => setDisconnectOpen(true)}>
                  <Unplug aria-hidden />
                  {I.disconnect}
                </Button>
                <Button variant="ghost" className="text-danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 aria-hidden />
                  {I.deleteData}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-bold">{I.disconnectedTitle}</p>
                <p className="text-small text-text-2">{I.disconnectedBody}</p>
              </div>
              <MetaConnectChecklist />
              <Button size="lg" className="self-start glow-primary" onClick={() => setFlowOpen(true)}>{C.cta}</Button>
            </div>
          )}
        </div>
      </section>

      {connected && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="wa-title" className="flex flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <SectionTitle level={3} id="wa-title" title={I.whatsappTitle} sub={I.whatsappBody} />
            <div className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-4 py-3">
              <span className="flex items-center gap-2 font-semibold"><MessageCircle className="size-4 text-success" aria-hidden /><Phone value={M.assets.whatsapp} /></span>
              <span className="inline-flex items-center gap-1 text-micro text-success"><BadgeCheck className="size-4" aria-hidden />{I.confirmed}</span>
            </div>
          </section>
          <section aria-labelledby="privacy-title" className="flex flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <SectionTitle level={3} id="privacy-title" title={I.privacyTitle} sub={I.privacyHelp} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="privacy-url">{I.privacyLabel}</Label>
              <div className="flex gap-2">
                <LtrInput id="privacy-url" type="url" inputMode="url" value={privacy} onChange={(e) => setPrivacy(e.target.value)} />
                <Button
                  variant="secondary"
                  disabled={privacy === savedPrivacy || !/^https:\/\/\S+\.\S+/.test(privacy)}
                  onClick={() => {
                    setSavedPrivacy(privacy);
                    toast.success(I.privacyToast);
                  }}
                >
                  {I.privacySave}
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}

      <section aria-labelledby="perm-title" className="flex flex-col gap-3 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <SectionTitle level={3} id="perm-title" title={I.permissionsTitle} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {C.permissions.map((p) => (
            <li key={p.title} className="flex items-start gap-3 rounded-sm bg-surface-2 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-text-2" aria-hidden />
              <span>
                <span className="block text-small font-semibold">{p.title}</span>
                <span className="text-small text-text-2">{p.why}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-2 text-micro font-normal text-muted"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />{C.permissionsNote}</p>
      </section>

      <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <DialogContent>
          <DialogTitle>{I.disconnectDialog.title}</DialogTitle>
          <DialogDescription>{I.disconnectDialog.body}</DialogDescription>
          <Link href="/app/campaigns" className="mt-2 inline-block text-small text-link underline-offset-4 hover:underline">{I.disconnectDialog.pauseLink}</Link>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-sm bg-surface-2 p-3 text-small">
            <input type="checkbox" checked={alsoDelete} onChange={(e) => setAlsoDelete(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-danger)]" />
            {I.disconnectDialog.alsoDelete}
          </label>
          <div className="mt-5 flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setStatus("revoked");
                setDisconnectOpen(false);
                toast.success(I.disconnectDialog.toast);
                if (alsoDelete) toast.success(I.deleteDialog.toast);
              }}
            >
              {I.disconnectDialog.confirm}
            </Button>
            <Button variant="ghost" onClick={() => setDisconnectOpen(false)}>{I.disconnectDialog.cancel}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(o) => { setDeleteOpen(o); if (!o) setWord(""); }}>
        <DialogContent>
          <DialogTitle>{I.deleteDialog.title}</DialogTitle>
          <DialogDescription>{I.deleteDialog.body}</DialogDescription>
          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="delete-word">{I.deleteDialog.typeLabel}</Label>
            <Input id="delete-word" value={word} onChange={(e) => setWord(e.target.value)} autoComplete="off" />
          </div>
          <div className="mt-5 flex gap-2">
            <Button
              variant="destructive"
              disabled={word.trim() !== I.deleteDialog.word}
              onClick={() => {
                setStatus("revoked");
                setDeleteOpen(false);
                setWord("");
                toast.success(I.deleteDialog.toast);
              }}
            >
              {I.deleteDialog.confirm}
            </Button>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>{I.deleteDialog.cancel}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <MetaConnectFlow
        open={flowOpen}
        onOpenChange={setFlowOpen}
        onConnected={() => {
          setStatus("connected");
        }}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-sm bg-surface-2 p-3">
      <dt className="text-micro font-normal text-muted">{label}</dt>
      <dd className="text-small font-semibold text-text">{value}</dd>
    </div>
  );
}

function Asset({ icon: Icon, label, value, meta }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-sm bg-surface-2 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-text-2" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-micro font-normal text-muted">{label}</span>
        <span className="truncate text-small font-semibold">{value}</span>
      </div>
      {meta && <span className="shrink-0 text-micro font-normal text-text-2">{meta}</span>}
    </li>
  );
}
