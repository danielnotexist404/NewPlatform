"use client";
import * as React from "react";
import Link from "next/link";
import { BellRing, Download, FileText, Globe, Inbox, MessageCircle, Phone as PhoneIcon, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { leads as SEED, type Lead, type LeadSource, type LeadStatus } from "@/lib/mock/leads";
import { SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { HOOK_KEY_HE, leadsCopy as L, sample } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote } from "@/components/campaigns/page-header";
import { dateShort, fmt, Phone, plural, timeOf } from "@/components/campaigns/text";
import { cn } from "@/lib/utils";

const STATUSES: LeadStatus[] = ["new", "in_progress", "closed"];
const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-primary/12 text-primary-text",
  in_progress: "bg-violet/15 text-violet",
  closed: "bg-success/15 text-success",
};
const SOURCE_ICON: Record<LeadSource, React.ComponentType<{ className?: string }>> = {
  meta_form: FileText,
  whatsapp: MessageCircle,
  landing_page: Globe,
  manual: UserPlus,
};

function ago(l: Lead) {
  const m = l.minutesAgo;
  if (m < 60) return fmt(L.ago.minutes, { n: m });
  if (m < 120) return L.ago.hour;
  if (m < 24 * 60) return fmt(L.ago.hours, { n: Math.floor(m / 60) });
  if (m < 48 * 60) return fmt(L.ago.yesterday, { time: timeOf(l.receivedAt) });
  return `${dateShort(l.receivedAt)}, ${timeOf(l.receivedAt)}`;
}

function waHref(l: Lead) {
  const text = fmt(L.waPrefill, { firstName: l.fullName.split(" ")[0], businessName: SAMPLE_BUSINESS.name });
  return `https://wa.me/${l.phoneE164.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

export function LeadSourceBadge({ source, className }: { source: LeadSource; className?: string }) {
  const Icon = SOURCE_ICON[source];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-surface-3 px-2 py-0.5 text-micro text-text-2", source === "landing_page" && "bg-violet/15 text-violet", className)}>
      <Icon className="size-3" aria-hidden />
      {L.source[source]}
    </span>
  );
}

export function LeadStatusChip({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-micro", STATUS_TONE[status])}>
      <span aria-hidden className={cn("size-1.5 rounded-full bg-current", status === "new" && "animate-pulse-dot")} />
      {L.status[status]}
    </span>
  );
}

function ContactButtons({ lead, size = "sm", className }: { lead: Lead; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button asChild size={size} variant="secondary" className="flex-1">
        <a href={`tel:${lead.phoneE164}`} aria-label={`${L.call} ${lead.fullName}`}>
          <PhoneIcon aria-hidden />
          {L.call}
        </a>
      </Button>
      <Button asChild size={size} className="flex-1">
        <a href={waHref(lead)} target="_blank" rel="noopener noreferrer" aria-label={`${L.whatsapp} ${lead.fullName}`}>
          <MessageCircle aria-hidden />
          {L.whatsapp}
        </a>
      </Button>
    </div>
  );
}

function toCsv(rows: Lead[]) {
  const head = [L.csv.name, L.csv.phone, L.csv.email, L.csv.city, L.csv.source, L.csv.campaign, L.csv.status, L.csv.received, L.csv.notes];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((l) =>
    [l.fullName, l.phoneDisplay, l.email ?? "", l.city ?? "", L.source[l.source], l.campaignName ?? "", L.status[l.status], `${dateShort(l.receivedAt)} ${timeOf(l.receivedAt)}`, l.notes].map(esc).join(","),
  );
  return "﻿" + [head.map(esc).join(","), ...lines].join("\r\n");
}

export function LeadsInbox() {
  const [items, setItems] = React.useState<Lead[]>(SEED);
  const [status, setStatus] = React.useState<LeadStatus | "all">("all");
  const [source, setSource] = React.useState<LeadSource | "all">("all");
  const [campaign, setCampaign] = React.useState<string>("all");
  const [q, setQ] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(SEED[0]?.id ?? null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const campaigns = Array.from(new Map(items.filter((l) => l.campaignId).map((l) => [l.campaignId!, l.campaignName!])).entries());
  const shown = items.filter(
    (l) =>
      (status === "all" || l.status === status) &&
      (source === "all" || l.source === source) &&
      (campaign === "all" || l.campaignId === campaign) &&
      (!q.trim() || l.fullName.includes(q.trim()) || l.phoneDisplay.replace(/-/g, "").includes(q.trim().replace(/-/g, ""))),
  );
  const counts = STATUSES.reduce<Record<string, number>>((a, s) => ({ ...a, [s]: items.filter((l) => l.status === s).length }), {});
  const waiting = items.filter((l) => l.status === "new" && l.minutesAgo > 15 && !l.isTest).length;
  const selected = items.find((l) => l.id === selectedId) ?? null;
  const filtered = status !== "all" || source !== "all" || campaign !== "all" || !!q;

  function update(id: string, p: Partial<Lead>) {
    setItems((list) => list.map((l) => (l.id === id ? { ...l, ...p } : l)));
  }

  function exportCsv() {
    const csv = toCsv(shown);
    try {
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads-sample.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      /* download blocked — still show the toast below */
    }
    toast.success(fmt(L.exportToast, { n: plural(shown.length, L.leadsCount) }), { description: L.exportAudit });
  }

  function open(l: Lead) {
    setSelectedId(l.id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 63.99rem)").matches) setSheetOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <SampleNote text={sample.leads} />
      <PageHeader
        eyebrow={L.eyebrow}
        eyebrowIcon={Inbox}
        title={L.title}
        sub={L.sub}
        actions={
          <Button variant="secondary" onClick={exportCsv}>
            <Download aria-hidden />
            {L.export}
          </Button>
        }
      />

      {waiting > 0 && (
        <div role="status" className="flex items-center gap-3 rounded-md bg-primary/10 px-4 py-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]">
          <BellRing className="size-5 shrink-0 text-primary-text" aria-hidden />
          <p className="text-small text-text">{fmt(L.reminder, { n: plural(waiting, L.reminderCount) })}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <ToggleGroup type="single" value={status} onValueChange={(v) => v && setStatus(v as LeadStatus | "all")} aria-label={L.statusLabel} className="w-full max-w-full overflow-x-auto rounded-full sm:w-fit [scrollbar-width:none]">
          <ToggleGroupItem value="all" className="shrink-0 rounded-full">
            {L.all} <bdi className="num ms-1 text-muted">{items.length}</bdi>
          </ToggleGroupItem>
          {STATUSES.map((s) => (
            <ToggleGroupItem key={s} value={s} className="shrink-0 rounded-full">
              {L.status[s]} <bdi className="num ms-1 text-muted">{counts[s]}</bdi>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Label htmlFor="lead-search" className="sr-only">{L.search}</Label>
            <Search className="pointer-events-none absolute top-1/2 inset-s-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input id="lead-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.search} className="ps-9" />
          </div>
          <label className="sr-only" htmlFor="lead-source">{L.sourceLabel}</label>
          <select id="lead-source" value={source} onChange={(e) => setSource(e.target.value as LeadSource | "all")} className="h-11 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm text-text">
            <option value="all">{L.allSources}</option>
            {(Object.keys(L.source) as LeadSource[]).map((s) => (
              <option key={s} value={s}>{L.source[s]}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="lead-campaign">{L.campaignLabel}</label>
          <select id="lead-campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} className="h-11 rounded-sm border border-border-strong bg-surface-2 px-3 text-sm text-text">
            <option value="all">{L.allCampaigns}</option>
            {campaigns.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-2.5">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border-strong p-10 text-center text-text-2">
              <Inbox className="size-6" aria-hidden />
              {L.empty}
              {filtered && (
                <Button variant="ghost" size="sm" onClick={() => { setStatus("all"); setSource("all"); setCampaign("all"); setQ(""); }}>
                  <X aria-hidden />
                  {L.clear}
                </Button>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5" aria-label={L.title}>
              {shown.map((l) => (
                <li key={l.id}>
                  <LeadRow lead={l} active={l.id === selectedId} onOpen={() => open(l)} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 flex items-start gap-2 text-micro font-normal text-muted">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {L.privacy}
          </p>
        </div>

        <aside className="sticky top-[calc(var(--header-h)+24px)] hidden lg:block" aria-label={L.detail.title}>
          {selected && <LeadDetail key={selected.id} lead={selected} onChange={(p) => update(selected.id, p)} />}
        </aside>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" title={selected?.fullName ?? L.detail.title} closeLabel={L.closeDetail} className="lg:hidden">
          {selected && <LeadDetail key={selected.id} lead={selected} onChange={(p) => update(selected.id, p)} bare />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LeadRow({ lead: l, active, onOpen }: { lead: Lead; active: boolean; onOpen: () => void }) {
  const first = l.answers[0];
  return (
    <div className={cn("relative flex flex-col gap-3 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2 sm:flex-row sm:items-center", active && "lg:bg-surface-2 lg:shadow-[inset_0_0_0_2px_var(--color-primary)]", l.status === "new" && "border-s-2 border-primary")}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-3 font-bold text-text">{l.fullName.slice(0, 1)}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onOpen} className="text-start font-bold text-text after:absolute after:inset-0 after:content-[''] hover:underline" aria-label={`${L.select}: ${l.fullName}`}>
              {l.fullName}
            </button>
            <LeadStatusChip status={l.status} />
            {l.isTest && <span className="rounded-full bg-surface-3 px-2 py-0.5 text-micro text-text-2" title={L.testHelp}>{L.test}</span>}
          </div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro font-normal text-text-2">
            <Phone value={l.phoneDisplay} />
            <span aria-hidden>·</span>
            <span>{fmt(L.received, { when: ago(l) })}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <LeadSourceBadge source={l.source} />
            {l.campaignName && <span className="truncate text-micro font-normal text-muted">{l.campaignName}{l.hookKey ? ` · ${fmt(L.detail.hook, { key: HOOK_KEY_HE[l.hookKey] })}` : ""}</span>}
          </div>
          {first && <p className="line-clamp-1 text-small text-text-2">{first.q}: <span className="text-text">{first.a}</span></p>}
        </div>
      </div>
      <ContactButtons lead={l} className="relative z-10 shrink-0 sm:w-60" />
    </div>
  );
}

function LeadDetail({ lead: l, onChange, bare = false }: { lead: Lead; onChange: (p: Partial<Lead>) => void; bare?: boolean }) {
  const [notes, setNotes] = React.useState(l.notes);
  return (
    <div className={cn("flex flex-col gap-5", !bare && "rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1")}>
      {!bare && (
        <div className="flex items-start gap-3">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-body-lg font-bold text-on-primary">{l.fullName.slice(0, 1)}</span>
          <div className="min-w-0">
            <h2 className="text-h3">{l.fullName}</h2>
            <p className="text-micro font-normal text-muted">{fmt(L.received, { when: ago(l) })}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <span id={`st-${l.id}`} className="text-micro text-text-2">{L.statusLabel}</span>
        <ToggleGroup
          type="single"
          value={l.status}
          aria-labelledby={`st-${l.id}`}
          onValueChange={(v) => {
            if (!v) return;
            onChange({ status: v as LeadStatus });
            toast.success(fmt(L.statusToast, { status: L.status[v as LeadStatus] }));
          }}
          className="grid w-full grid-cols-3"
        >
          {STATUSES.map((s) => (
            <ToggleGroupItem key={s} value={s} className="data-[state=on]:bg-primary data-[state=on]:text-on-primary">
              {L.status[s]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <ContactButtons lead={l} size="lg" />
      <dl className="flex flex-col gap-3 text-small">
        <div className="flex justify-between gap-3"><dt className="text-muted">{L.csv.phone}</dt><dd className="font-semibold"><Phone value={l.phoneDisplay} /></dd></div>
        {l.email && <div className="flex justify-between gap-3"><dt className="text-muted">{L.csv.email}</dt><dd className="font-semibold"><bdi dir="ltr">{l.email}</bdi></dd></div>}
        {l.city && <div className="flex justify-between gap-3"><dt className="text-muted">{L.csv.city}</dt><dd className="font-semibold">{l.city}</dd></div>}
        <div className="flex justify-between gap-3"><dt className="text-muted">{L.detail.from}</dt><dd className="flex flex-col items-end gap-1 text-end"><LeadSourceBadge source={l.source} />{l.campaignId && <Link href={`/app/campaigns/${l.campaignId}`} className="text-micro text-link underline-offset-4 hover:underline">{l.campaignName}</Link>}</dd></div>
        {l.hookText && <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{fmt(L.detail.hook, { key: l.hookKey ? HOOK_KEY_HE[l.hookKey] : "" })}</dt><dd className="text-end font-semibold">{l.hookText}</dd></div>}
        <div className="flex justify-between gap-3"><dt className="text-muted">{L.detail.assignee}</dt><dd className="font-semibold">{l.assignee ?? L.detail.none}</dd></div>
      </dl>
      {l.answers.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-small font-bold">{L.detail.answers}</h3>
          <ul className="flex flex-col gap-2">
            {l.answers.map((a) => (
              <li key={a.q} className="rounded-sm bg-surface-2 px-3 py-2">
                <p className="text-micro font-normal text-muted">{a.q}</p>
                <p className="text-small text-text">{a.a}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor={`notes-${l.id}`}>{L.notes}</Label>
          <bdi className="text-micro text-muted num">{notes.length}/1,000</bdi>
        </div>
        <Textarea id={`notes-${l.id}`} value={notes} maxLength={1000} onChange={(e) => setNotes(e.target.value)} placeholder={L.notesPlaceholder} className="text-sm" />
        <Button
          variant="secondary"
          size="sm"
          className="self-start"
          disabled={notes === l.notes}
          onClick={() => {
            onChange({ notes });
            toast.success(L.notesSaved);
          }}
        >
          {L.notesSave}
        </Button>
      </div>
    </div>
  );
}
