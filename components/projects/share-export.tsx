"use client";
import * as React from "react";
import { toast } from "sonner";
import { Copy, Download, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/misc";
import { LockedNote, ChipRadio } from "@/components/wizard/choice";
import { APP_CORE } from "@/content/he/app-core";
import { BRAND } from "@/lib/constants";
import type { Aspect } from "@/lib/mock/projects";
import { MOCK_PLAN } from "@/lib/mock/workspace";
import { fillText } from "./plural";

const SD = APP_CORE.shareDialog;
const ED = APP_CORE.exportDialog;

function LinkResult({ url, waText }: { url: string; waText: string }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* blocked */ }
    toast.success(SD.copied);
  };
  return (
    <div className="flex flex-col gap-3 rounded-md bg-surface-2 p-4">
      <label htmlFor="share-url" className="text-sm font-semibold">{SD.linkLabel}</label>
      <div className="flex gap-2">
        <LtrInput id="share-url" readOnly value={url} className="h-10 font-mono text-small" onFocus={(e) => e.currentTarget.select()} />
        <Button size="sm" className="h-10" onClick={copy}><Copy aria-hidden />{SD.copy}</Button>
      </div>
      <Button asChild variant="secondary" size="sm" className="self-start">
        <a href={`https://wa.me/?text=${encodeURIComponent(fillText(waText, { url }))}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden />{SD.whatsapp}
        </a>
      </Button>
      <p className="text-micro font-normal text-text-2">{SD.saveNow}</p>
    </div>
  );
}

/** ShareDialog (Part 03 §8.2): public view link + client approval (locked below the business plan). */
export function ShareDialog({ open, onOpenChange, projectId }: { open: boolean; onOpenChange: (o: boolean) => void; projectId: string }) {
  const [allow, setAllow] = React.useState(false);
  const [expiry, setExpiry] = React.useState("d30");
  const [url, setUrl] = React.useState<string | null>(null);
  const approvalLocked = MOCK_PLAN.id === "free" || MOCK_PLAN.id === "starter";
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setUrl(null); onOpenChange(o); }}>
      <DialogContent size="lg">
        <DialogTitle>{SD.title}</DialogTitle>
        <DialogDescription className="sr-only">{SD.saveNow}</DialogDescription>
        <Tabs defaultValue="view" dir="rtl" className="mt-4 flex flex-col gap-5">
          <TabsList className="self-start">
            <TabsTrigger value="view">{SD.tabs.view}</TabsTrigger>
            <TabsTrigger value="approval">{SD.tabs.approval}</TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-3 text-small font-semibold">
              {SD.allowDownload}
              <Switch checked={allow} onCheckedChange={setAllow} />
            </label>
            <div className="flex flex-col gap-2">
              <p className="text-small font-semibold">{SD.expiry}</p>
              <ChipRadio label={SD.expiry} value={expiry} onValueChange={setExpiry} items={(["d7", "d30", "none"] as const).map((k) => ({ value: k, label: SD.expiries[k] }))} />
            </div>
            {url ? (
              <LinkResult url={url} waText={SD.whatsappText} />
            ) : (
              <Button className="self-start" onClick={() => setUrl(`https://${BRAND.domain}/v/demo-${projectId.replace("p-", "")}x7k2`)}>{SD.create}</Button>
            )}
          </TabsContent>
          <TabsContent value="approval" className="flex flex-col gap-4">
            {approvalLocked ? (
              <LockedNote text={SD.approvalLocked} className="text-small" />
            ) : (
              <>
                <Input aria-label={SD.approverName} placeholder={SD.approverName} />
                <LtrInput type="email" aria-label={SD.approverEmail} placeholder={SD.approverEmail} />
                <Textarea aria-label={SD.senderNote} placeholder={SD.senderNote} maxLength={300} />
              </>
            )}
            <fieldset disabled={approvalLocked} className="flex flex-col gap-2 disabled:opacity-60">
              <p className="text-small font-semibold">{SD.approvalExpiry}</p>
              <ChipRadio label={SD.approvalExpiry} value="d14" onValueChange={() => undefined} items={(["d14", "d30", "d90"] as const).map((k) => ({ value: k, label: SD.approvalExpiries[k], locked: approvalLocked }))} />
            </fieldset>
            <p className="text-micro font-normal text-text-2">{SD.approvalHelp}</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/** ExportDialog (Part 03 §8.1): pick formats/captions/poster + "לפני שמפרסמים" tips (dismissible in localStorage). */
export function ExportDialog({ open, onOpenChange, formats }: { open: boolean; onOpenChange: (o: boolean) => void; formats: Aspect[] }) {
  const KEY = "announcement.dismissed.export-tips";
  const [sel, setSel] = React.useState<string[]>([...formats, "captions", "poster"]);
  const [dontShow, setDontShow] = React.useState(false);
  const hideTips = React.useMemo(() => {
    if (!open) return false;
    try { return window.localStorage.getItem(KEY) === "1"; } catch { return false; }
  }, [open]);
  const toggle = (k: string, on: boolean) => setSel((s) => (on ? [...s, k] : s.filter((x) => x !== k)));
  const items: [string, React.ReactNode][] = [
    ...formats.map((f) => [f, <bdi key={f} dir="ltr" className="font-mono">{f}</bdi>] as [string, React.ReactNode]),
    ["captions", ED.captions],
    ["poster", ED.poster],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogTitle>{ED.title}</DialogTitle>
        <DialogDescription className="sr-only">{ED.formats}</DialogDescription>
        <ul className="mt-5 flex flex-col gap-2">
          {items.map(([k, label]) => (
            <li key={k}>
              <label className="flex items-center gap-3 rounded-md bg-surface-2 px-4 py-3 text-small font-semibold">
                <input type="checkbox" checked={sel.includes(k)} onChange={(e) => toggle(k, e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
                {label}
              </label>
            </li>
          ))}
        </ul>
        {!hideTips && (
          <div className="mt-5 flex flex-col gap-2 rounded-md bg-lemon/[.07] p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-lemon)_40%,transparent)]">
            <p className="font-bold">{ED.tipsTitle}</p>
            <ol className="flex list-decimal flex-col gap-1.5 ps-5 text-small text-text-2">
              {ED.tips.map((t) => <li key={t}>{t}</li>)}
            </ol>
            <label className="mt-1 flex items-center gap-2 text-micro font-normal text-text-2">
              <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
              {ED.dontShow}
            </label>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={sel.length === 0}
            onClick={() => {
              if (dontShow) { try { window.localStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ } }
              onOpenChange(false);
              toast(APP_CORE.demo.noFile);
            }}
          >
            <Download aria-hidden />
            {ED.downloadSelected}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
